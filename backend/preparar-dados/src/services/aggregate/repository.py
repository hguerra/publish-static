# -*- coding: utf-8 -*-
import logging
from collections import namedtuple
from decimal import Decimal

from src.infrastructure.datasource import get_postgresql_connection

_logger = logging.getLogger(__name__)
_pg = get_postgresql_connection()


def find_border_feature_percentage(border_name: str):
    sql = """
    select b.id,
        b.nm,
        trunc(sum(st_area(b.geom)::numeric), 3) /
        (select trunc(sum(st_area(b.geom)::numeric), 3) from "biomes" b) percentage
    from "{}" b
    group by b.id, b.nm
    order by percentage;
    """.format(border_name)

    res = _pg.execute(sql, None, "*")

    features_percentage = res.results
    percentages_head = features_percentage[:-1]
    percentages_tail = features_percentage[-1]

    percentages_head_value = Decimal(0.0)
    for f in percentages_head:
        percentages_head_value = percentages_head_value + f.percentage
    new_tail_percentage = Decimal(1) - percentages_head_value

    CustomRecord = namedtuple('CustomRecord', 'id nm percentage')
    new_tail = CustomRecord(percentages_tail.id, percentages_tail.nm, new_tail_percentage)
    return [*percentages_head, new_tail]


def find_brazil_values(brazil_table):
    sql = """
    select
        agro00,
        agro10,
        agro20,
        agro30,
        agro40,
        agro50,
        forreg30,
        forreg40,
        forreg50,
        natveg00,
        natveg10,
        natveg20,
        natveg30,
        natveg40,
        natveg50,
        pltfor00,
        pltfor10,
        pltfor20,
        pltfor30,
        pltfor40,
        pltfor50
    from "{}";
    """.format(brazil_table)

    res = _pg.execute(sql, None, 1)
    return res.results[0]
