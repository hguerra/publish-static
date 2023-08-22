import os
from datetime import datetime;
from typing import NamedTuple

import src.services.add_new_field.repository as nf_repo
import src.infrastructure.util as util
from src.constants import ROOT_PATH


def row_to_sql(scenario: str, row: dict, add_columns=False, update_border=False):
    base_table_name = 'brazilsforestcode'
    borders = [
        'biome',
        'region',
        'state',
    ]

    lines_sql = []
    dml_set = []
    for colname, value in row.items():
        if 'id' == colname:
            continue

        if add_columns:
            lines_sql.append(
                f'begin;alter table "{base_table_name}_{scenario}" drop column if exists "{colname}";commit;')
            lines_sql.append(
                f'begin;alter table "{base_table_name}_{scenario}" add column if not exists "{colname}" numeric;commit;')

        if update_border:
            lines_sql.append(
                f'begin;alter table "output_{base_table_name}_brazil" drop column if exists "{scenario}_{colname}";commit;')
            lines_sql.append(
                f'begin;alter table "output_{base_table_name}_brazil" add column if not exists "{scenario}_{colname}" numeric;commit;')
            lines_sql.append(
                f'begin;update "output_{base_table_name}_brazil" set "{scenario}_{colname}" = (select trunc(sum("{colname}" ), 3) from "{base_table_name}_{scenario}");commit;')

            for border in borders:
                lines_sql.append(
                    f'begin;alter table "output_{base_table_name}_{border}s" drop column if exists "{scenario}_{colname}";commit;')
                lines_sql.append(
                    f'begin;alter table "output_{base_table_name}_{border}s" add column if not exists "{scenario}_{colname}" numeric;commit;')
                lines_sql.append(
                    f'begin;update "output_{base_table_name}_{border}s" set "{scenario}_{colname}" = trunc(s_sum.s_total, 3) from (select s.{border}_id s_id, sum(s."{colname}") s_total from "{base_table_name}_{scenario}" s group by s.{border}_id order by s.{border}_id) s_sum where "output_{base_table_name}_{border}s".id = s_sum.s_id;commit;')

        set_col = f'"{colname}"={value}'
        dml_set.append(set_col)

    lines_sql.append(
        f'begin;update "{base_table_name}_{scenario}" set {",".join(dml_set)} where "{base_table_name}_{scenario}"."id"=\'{row["id"]}\';commit;')

    return '\n'.join(lines_sql)


def group_by_id(scenario: str, add_columns: bool, update_border: bool, *datasets: [NamedTuple]):
    lines_sql = []

    rows = {}
    for dataset in datasets:
        for rec in dataset:
            r_id = str(rec.id)
            if r_id not in rows:
                rows[r_id] = {
                    'id': r_id
                }
            rows[r_id][str(rec.field)] = float(rec.value)

    for row in rows.values():
        lines_sql.append(row_to_sql(scenario, row, add_columns, update_border))

    return lines_sql


def sql_to_file(scenario: str, lines_sql: [str]):
    filename = f'{scenario}_{int(datetime.now().timestamp() * 1000)}.sql'
    script_name = os.path.join(ROOT_PATH, 'bin', filename)
    util.write_script(script_name, lines_sql, remove_header=True)
    return filename


def write_rul_sql_script(
    scenario: str,
    filenames: [str],
    pg_user='geospatialservice',
    pg_password='geospatialservice',
    pg_dbname='geospatialservice'
):
    lines = [
        f'export PGPASSWORD={pg_password}'
    ]

    for f in filenames:
        lines.append(f'psql -h localhost -p 5432 -U {pg_user} -d {pg_dbname} -f "{f}"')

    util.write_script(os.path.join(ROOT_PATH, 'bin', f'{scenario}_000.sh'), lines)


def process_row(scenario: str, add_columns: bool, update_border: bool, ids: [str]):
    cropland_data = nf_repo.find_cropland(scenario, ids)
    pasture_data = nf_repo.find_pasture(scenario, ids)
    lines_sql = group_by_id(scenario, add_columns, update_border, cropland_data, pasture_data)
    sql_name = sql_to_file(scenario, lines_sql)
    return sql_name


def process():
    chunck_size = 1000
    add_column_and_update_output = True

    scenarios = [
        'fcdd',
        'fcnocra_dd',
        'fcnocranosfa',
        'fcnosfa',
        'idc2_dd'
    ]

    for i, scenario in enumerate(scenarios):
        all_ids = nf_repo.find_ids(scenario)
        filenames = []

        if add_column_and_update_output and i == 0:
            filenames.append(process_row(scenario, True, False, ['CR213195']))

        for ids in util.chunks(all_ids, chunck_size):
            sql_name = process_row(scenario, False, False, ids)
            filenames.append(sql_name)

        if add_column_and_update_output and i == 0:
            filenames.append(process_row(scenario, False, True, ['CR213195']))

        write_rul_sql_script(scenario, filenames)
