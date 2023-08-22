import logging
import os
import re

from src.constants import DATA_PATH, ROOT_PATH
from src.infrastructure.util import write_script, run_command

_logger = logging.getLogger(__name__)


def each_shapefile(output_table_name: str, shp_fields: [str], load_in_postgresql=False, pg_host="127.0.0.1", pg_port="5432",
                   pg_user="geospatialservice",
                   pg_password="geospatialservice", pg_dbname="geospatialservice"):
    mapped_shp_fields = []
    table_fields = set()
    for f in shp_fields:
        col = f
        if f == 'id':
            col = 'external_{}'.format(col)
        mapped_shp_fields.append("{} {}".format(f, col))
        table_fields.add('"{}"'.format(col))
    shp_fields_str = ', '.join(mapped_shp_fields)
    table_fields_str = ', '.join(list(table_fields))

    template_values = []
    extension = ".shp"
    directory = os.path.join(DATA_PATH, 'shapefile')
    for subdir, _, files in os.walk(directory):
        for filename in files:
            if filename.endswith(extension):
                filepath = os.path.join(subdir, filename)
                filename_without_extension, _ = os.path.splitext(filename)
                data_name = re.sub('\s\s+', '_', filename_without_extension.lower())

                parts = data_name.split('_')
                year = parts[-1]
                table_name = '{}_{}'.format(output_table_name, year)

                value = {
                    'output_table_name': output_table_name,
                    'filename_without_extension': filename_without_extension,
                    'filepath': filepath,
                    'from_authority_code': 5880,
                    'to_authority_code': 5880,
                    'table_name': table_name,
                    'year': year,
                    'description': ' '.join(parts),
                    'scenario_name': '',
                    'scenario_description': '',
                    'fields': shp_fields_str,
                    'table_fields': table_fields_str
                }

                if 'ssp' in data_name:
                    value['scenario_name'] = parts[1]
                    value['scenario_description'] = parts[2]
                    value['table_name'] = '{}_{}'.format(value['table_name'], value['scenario_name'])

                template_values.append(value)

    output_format = """
        PostgreSQL
    """.strip()

    output_args = """
        "PG:host={} port={} user={} password={} dbname={}"
    """.strip().format(pg_host, pg_port, pg_user, pg_password, pg_dbname)

    sql_shp_to_table_template = """
        select '{table_name}' name, {year} year, '{description}' description, '{scenario_name}' scenario_name, '{scenario_description}' scenario_description, {fields}, GeometryType(Geometry) geom_type, Geometry from {filename_without_extension}
    """.strip()

    ogr2og2_template = """
        ogr2ogr -f "{output_format}" {output_args} "{filepath}" -s_srs EPSG:{from_authority_code} -a_srs EPSG:{to_authority_code} -t_srs EPSG:{to_authority_code} -nln {table_name} -lco GEOMETRY_NAME=pgeom -lco FID=id -nlt PROMOTE_TO_MULTI -dialect sqlite -sql "{sql}"
    """.strip()

    sql_concat_table_template = """
        insert into {output_table_name}("name", "year", "description", "scenario_name", "scenario_description", {table_fields}, geom_type, pgeom, cgeom, geom)
        select "name", "year", "description", "scenario_name", "scenario_description", {table_fields}, geom_type, st_transform(st_setsrid(st_geometryn(pgeom, generate_series(1, st_numgeometries(pgeom))), {to_authority_code}), {to_authority_code}), st_transform(st_setsrid(st_geometryn(pgeom, generate_series(1, st_numgeometries(pgeom))), {to_authority_code}), 900914), st_transform(st_setsrid(st_geometryn(pgeom, generate_series(1, st_numgeometries(pgeom))), {to_authority_code}), 4326) from {table_name};
    """.strip()

    lines = []
    lines_concat = []
    tables = {}
    for value in template_values:
        table_name = value["table_name"]
        if table_name in tables:
            _logger.warning("Tabela duplicada '{}'...".format(table_name))

        value["sql"] = sql_shp_to_table_template.format(**value)
        value["output_format"] = output_format
        value["output_args"] = output_args

        cmd = ogr2og2_template.format(**value)
        lines.append(cmd)

        concat_table = sql_concat_table_template.format(**value)
        lines_concat.append(concat_table)

        tables[table_name] = True

    pg_encoding_var = "export PGCLIENTENCODING=latin1"
    lines.insert(0, pg_encoding_var)
    write_script(os.path.join(ROOT_PATH, "bin", "01_load_shapefile.sh"), lines)

    psql_template = """
       export PGPASSWORD={pg_password}
       psql -h localhost -p 5432 -U {pg_user} -d {pg_dbname} -f "{sql_filepath}"
   """.strip()

    output_sql_filepath = os.path.join(ROOT_PATH, "bin", "02_concat_tables.sql")
    write_script(output_sql_filepath, lines_concat, remove_header=True)
    write_script(os.path.join(ROOT_PATH, "bin", "run_sql.sh"), [
        psql_template.format(**{
            'pg_user': pg_user,
            'pg_password': pg_password,
            'pg_dbname': pg_dbname,
            'sql_filepath': output_sql_filepath
        })
    ])

    if load_in_postgresql:
        for line in lines:
            success, _ = run_command([pg_encoding_var + ";" + line])
            if not success:
                _logger.error("Falha ao executar linha '{}'".format(line))
