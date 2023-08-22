import logging
import os
from time import perf_counter

import src.services.load_data.repository as ld_repo
from src.constants import ROOT_PATH
from src.infrastructure.util import write_script

_logger = logging.getLogger(__name__)


def _find_years() -> list[int]:
    rows = ld_repo.find_distinct_year()
    result = [int(r.year) for r in rows]
    return result


def _find_scenario() -> list[str]:
    rows = ld_repo.find_distinct_scenario()
    result = [r.scenario_name for r in rows]
    result.remove('')
    return result


def _find_external_ids() -> list[str]:
    rows = ld_repo.find_distinct_external_id()
    result = [r.external_id for r in rows]
    return result


def _process(scenarios: list[str], year: int, external_id: str) -> list[dict]:
    records = ld_repo.find_by_external_id(external_id, year)

    new_records = []
    exclude_keys = ['scenario_name', 'scenario_description']
    for record in records:
        row = record._asdict()
        keys = list(filter(lambda k: not (str(k).isdigit() or k in exclude_keys), row.keys()))

        key_template = '{}_{}_{}'
        scenario_name = record.scenario_name
        valid_scenarios = [scenario_name]

        if scenario_name == '':
            # Copiar 'baseline' para todos os cenarios
            valid_scenarios = scenarios

        for scenario in valid_scenarios:
            new_record = {}
            for key in keys:
                value = row[key]
                new_key = key_template.format(scenario, key, year)
                new_record[new_key] = value
            new_records.append(new_record)

    return new_records


def _process_years(attributes: set[str], scenarios: list[str], years: list[int], external_id: str):
    t0 = perf_counter()

    _logger.info(
        f"Starting processing for external_id '{external_id}'..."
    )

    records = []
    for year in years:
        for record in _process(scenarios, year, external_id):
            records.append(record)

    new_record = {}
    for record in records:
        for k, v in record.items():
            if k in new_record:
                _logger.error(f"Duplicated key '{k}'...")
            new_record[k] = v
            attributes.add(k)

    # spatial = ld_repo.find_first_geom_by_external_id(external_id)
    # new_record['pgeom'] = spatial.pgeom
    # new_record['cgeom'] = spatial.cgeom
    # new_record['geom'] = spatial.geom

    # Avaliar o schema
    # print(json.dumps(new_record))

    # ld_repo.insert_into(new_record)

    _logger.info(
        f"external_id '{external_id}' processed in {perf_counter() - t0:0.4f} seconds."
    )


def _make_scripts(attributes, extent_raster_template, raster_output):
    # Criar script de extracao de raster do banco de dados
    cmd_extract_raster_template = 'python ../data/raster/extract_raster.py -s "select {attr}, geom from luccme_merged " -r "{extent_raster_template}" -o "{raster_output}" -a "{attr}"'
    cmd_lines_extract_raster = []
    for attr in attributes:
        values = {'raster_output': raster_output, 'extent_raster_template': extent_raster_template, 'attr': attr}
        line = cmd_extract_raster_template.format(**values)
        cmd_lines_extract_raster.append(line)
    write_script(os.path.join(ROOT_PATH, "bin", "extract_raster.sh"), cmd_lines_extract_raster)

    # Criar sql para atualizar dados background
    table_names = ['brazil', 'biomes', 'regions', 'states']
    table_ids = [i for i in range(1, 28)]

    cmd_lines_alter_table = []
    cmd_lines_update_table = []

    sql_alter_table = 'alter table "{table_name}" add column if not exists "{attr}" float;'

    sql_update_table_set_field = '''"{attr}" = ((
select coalesce(sum(luccme_merged."{attr}"), 0)
from luccme_merged, "{table_name}"
where "{table_name}".id = {table_id} and st_intersects(luccme_merged.cgeom, "{table_name}".cgeom) and st_within(luccme_merged.cgeom, "{table_name}".cgeom)
) + (
select coalesce(sum(luccme_merged."{attr}" * (st_area(st_intersection(luccme_merged.cgeom, "{table_name}".cgeom))/st_area(luccme_merged.cgeom))), 0)
from luccme_merged, "{table_name}"
where "{table_name}".id = {table_id} and st_intersects(luccme_merged.cgeom, "{table_name}".cgeom) and st_isvalid(luccme_merged.cgeom) and st_isvalid("{table_name}".cgeom) and not st_within(luccme_merged.cgeom, "{table_name}".cgeom) and st_isvalid(st_intersection(luccme_merged.cgeom, "{table_name}".cgeom))
))'''

    sql_update_table = '''update "{table_name}" set {set_field} from luccme_merged where "{table_name}".id = {table_id};'''

    for table_name in table_names:
        for table_id in table_ids:

            cmd_lines_update_table_set_field = []
            for attr in attributes:
                if 'description' in attr:
                    continue

                cmd_lines_alter_table.append(sql_alter_table.format(**{'table_name': table_name, 'attr': attr}))

                cmd_lines_update_table_set_field.append(sql_update_table_set_field.format(**{
                    'table_name': table_name,
                    'table_id': table_id,
                    'attr': attr
                }))

            cmd_lines_update_table.append(sql_update_table.format(**{
                'table_name': table_name,
                'table_id': table_id,
                'set_field': ','.join(cmd_lines_update_table_set_field)
            }))

    write_script(os.path.join(ROOT_PATH, "bin", "alter_table.sql"), list(set(cmd_lines_alter_table)),
                 remove_header=True)
    write_script(os.path.join(ROOT_PATH, "bin", "update_table.sql"), list(set(cmd_lines_update_table)),
                 remove_header=True)


def process(raster_output: str, extent_raster_template='extend_10km2_4326.tif'):
    t0 = perf_counter()
    scenarios = _find_scenario()
    years = _find_years()
    external_ids = _find_external_ids()

    count = len(external_ids)
    _logger.info(
        f"Starting processing {count} external ids..."
    )

    attributes = set()
    for external_id in external_ids:
        _process_years(attributes, scenarios, years, external_id)
        break

    _make_scripts(attributes, extent_raster_template, raster_output)

    _logger.info(
        f"{count} records processed in {perf_counter() - t0:0.4f} seconds."
    )


def _make_scripts_brazilforestcode(from_table_name, from_scenario_name, attributes):
    # Criar sql para atualizar dados background
    to_table_names = ['brazil', 'biomes', 'regions', 'states']
    to_table_ids = [i for i in range(1, 28)]

    cmd_lines_alter_table = []
    cmd_lines_update_table = []

    sql_alter_table = 'alter table "{to_table_name}" add column if not exists "{from_scenario_name}_{attr}" float;'

    sql_update_table_set_field = '''"{from_scenario_name}_{attr}" = ((
select coalesce(sum("{from_table_name}"."{attr}"), 0)
from "{from_table_name}", "{to_table_name}"
where "{to_table_name}".id = {to_table_id} and st_intersects("{from_table_name}".cgeom, "{to_table_name}".cgeom) and st_within("{from_table_name}".cgeom, "{to_table_name}".cgeom)
) + (
select coalesce(sum("{from_table_name}"."{attr}" * (st_area(st_intersection("{from_table_name}".cgeom, "{to_table_name}".cgeom))/st_area("{from_table_name}".cgeom))), 0)
from "{from_table_name}", "{to_table_name}"
where "{to_table_name}".id = {to_table_id} and st_intersects("{from_table_name}".cgeom, "{to_table_name}".cgeom) and st_isvalid("{from_table_name}".cgeom) and st_isvalid("{to_table_name}".cgeom) and not st_within("{from_table_name}".cgeom, "{to_table_name}".cgeom) and st_isvalid(st_intersection("{from_table_name}".cgeom, "{to_table_name}".cgeom))
))'''

    sql_update_table = '''update "{to_table_name}" set {set_field} from "{from_table_name}" where "{to_table_name}".id = {to_table_id};'''

    for to_table_name in to_table_names:
        for to_table_id in to_table_ids:

            cmd_lines_update_table_set_field = []
            for attr in attributes:
                if 'description' in attr:
                    continue

                cmd_lines_alter_table.append(sql_alter_table.format(**{'to_table_name': to_table_name, 'from_scenario_name': from_scenario_name, 'attr': attr}))

                cmd_lines_update_table_set_field.append(sql_update_table_set_field.format(**{
                    'from_table_name': from_table_name,
                    'from_scenario_name': from_scenario_name,
                    'to_table_name': to_table_name,
                    'to_table_id': to_table_id,
                    'attr': attr
                }))

            cmd_lines_update_table.append(sql_update_table.format(**{
                'from_table_name': from_table_name,
                'from_scenario_name': from_scenario_name,
                'to_table_name': to_table_name,
                'to_table_id': to_table_id,
                'set_field': ','.join(cmd_lines_update_table_set_field)
            }))

    create_spatial_columns = [
        'alter table "{}" drop column if exists cgeom;'.format(from_table_name),
        'alter table "{}" drop column if exists lgeom;'.format(from_table_name),
        'alter table "{}" add column if not exists cgeom geometry(multipolygon, 900914);'.format(from_table_name),
        'alter table "{}" add column if not exists lgeom geometry(point, 4326);'.format(from_table_name),
        'update "{}" set cgeom = st_transform(st_setsrid(geom, 4326), 900914);'.format(from_table_name),
        'update "{}" set lgeom = st_setsrid(st_centroid(geom), 4326);'.format(from_table_name),
        'create index if not exists "{0}_cgeom_gix" on "{0}" using gist (cgeom);'.format(from_table_name),
        'create index if not exists "{0}_lgeom_gix" on "{0}" using gist (lgeom);'.format(from_table_name),
    ]
    # write_script(os.path.join(ROOT_PATH, "bin", "alter_table.sql"), create_spatial_columns + list(set(cmd_lines_alter_table)),
    #              remove_header=True)

    write_script(os.path.join(ROOT_PATH, "bin", "update_table.sql"), list(set(cmd_lines_update_table)),
                 remove_header=True)


def process_brazilforestcode(from_table_name, from_scenario_name, attributes):
    t0 = perf_counter()

    _make_scripts_brazilforestcode(from_table_name, from_scenario_name, attributes)

    _logger.info(
        f"Records processed in {perf_counter() - t0:0.4f} seconds."
    )
