# -*- coding: utf-8 -*-
import logging
from typing import Tuple, NamedTuple

from src.infrastructure.datasource import get_postgresql_connection

_logger = logging.getLogger(__name__)
_pg = get_postgresql_connection()


def find_ids(scenario: str) -> [str]:
    sql = """
        select id from brazilsforestcode_{} order by id;
    """.format(scenario)

    res = _pg.execute(sql, None, "*")
    return [r.id for r in res.results]


def find_cropland(scenario: str, ids: [str]) -> [NamedTuple]:
    def fmt(s):
        return f"'{s}'"

    ids_str = ','.join(map(fmt, ids))

    sql = """
        with fields as (
            select
                rb.field2 as id,
                lower(rb.field7) as attribute,
                right(rb.field11::varchar, 2) as year,
                rb.field12 as value
            from raw_brazilsforestcode_{} rb
            where rb.field2 in ({}) and lower(rb.field7) in ('crplnd', 'soylnd')
            order by rb.field7, rb.field11
        )
        select f.id, ('cropland' || f.year) as field, sum(f.value) as value
        from fields f
        where f.attribute in ('crplnd', 'soylnd')
        group by f.id, ('cropland' || f.year);
    """.format(scenario, ids_str)

    res = _pg.execute(sql, None, "*")
    return res.results


def find_pasture(scenario: str, ids: [str]) -> [NamedTuple]:
    def fmt(s):
        return f"'{s}'"

    ids_str = ','.join(map(fmt, ids))

    sql = """
        with fields as (
            select
                rb.field2 as id,
                lower(rb.field7) as attribute,
                right(rb.field11::varchar, 2) as year,
                rb.field12 as value
            from raw_brazilsforestcode_{} rb
            where rb.field2 in ({}) and lower(rb.field7) in ('grslnd')
            order by rb.field7, rb.field11
        )
        select f.id, ('pasture' || f.year) as field, sum(f.value) as value
        from fields f
        where f.attribute = 'grslnd'
        group by f.id, ('pasture' || f.year);
    """.format(scenario, ids_str)

    res = _pg.execute(sql, None, "*")
    return res.results
