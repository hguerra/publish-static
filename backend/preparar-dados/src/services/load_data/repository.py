# -*- coding: utf-8 -*-
import logging
from typing import Tuple, NamedTuple

from src.infrastructure.datasource import get_postgresql_connection

_logger = logging.getLogger(__name__)
_pg = get_postgresql_connection()


def find_distinct_scenario() -> Tuple:
    sql = """
        select distinct "scenario_name" from "luccme" order by "scenario_name";
    """

    res = _pg.execute(sql, None, "*")
    return res.results


def find_distinct_year() -> Tuple:
    sql = """
        select distinct "year" from "luccme" order by "year";
    """

    res = _pg.execute(sql, None, "*")
    return res.results


def find_distinct_external_id() -> Tuple:
    sql = """
        select distinct "external_id" from "luccme";
    """

    res = _pg.execute(sql, None, "*")
    return res.results


def find_first_geom_by_external_id(external_id: str):
    sql = """
        select "external_id", ST_AsText(pgeom) "pgeom", ST_AsText(cgeom) "cgeom", ST_AsText(geom) "geom"
        from "luccme"
        where "external_id" = %(external_id)s
        limit 1;
    """

    params = {
        "external_id": external_id
    }

    res = _pg.execute(sql, params, 1)
    return res.results[0]


def find_by_external_id(external_id: str, year: int) -> Tuple:
    sql = """
        select "description", "scenario_name", "scenario_description", "veg", "pastp", "mosc", "fores", "others", "agric"
        from "luccme"
        where "external_id" = %(external_id)s and "year" = %(year)s
        order by "year", "scenario_name";
    """

    params = {
        "external_id": external_id,
        "year": year
    }

    res = _pg.execute(sql, params, "*")
    return res.results


def insert_into(row: dict[str]) -> int:
    keys = sorted(row.keys())

    values = []
    for key in keys:
        value_template = '%({})s'
        if key == 'pgeom':
            value_template = r'ST_GeomFromText(%({})s, 5880)'
        if key == 'cgeom':
            value_template = r'ST_GeomFromText(%({})s, 900914)'
        if key == 'geom':
            value_template = r'ST_GeomFromText(%({})s, 4326)'

        value = value_template.format(key)
        values.append(value)

    sql_insert_line = 'insert into luccme_merged({})'.format(', '.join(keys))
    sql_value_line = 'values({})'.format(', '.join(values))

    sql = """{} {} returning id;""".strip().format(sql_insert_line, sql_value_line)

    res = _pg.execute(sql, row, "*", autocommit=True)
    return res.results[0].id if len(res.results) > 0 else None
