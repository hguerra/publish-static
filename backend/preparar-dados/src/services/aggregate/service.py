import logging
from decimal import Decimal

import src.services.aggregate.repository as agg_repo

_logger = logging.getLogger(__name__)


def calculate():
    output_border_name = 'biomes'
    app_name = 'brazilsforestcode'
    scenario_name = 'idc2_dd'

    records = _calculate_percentage(app_name, output_border_name, scenario_name)
    print(records)
    # print(brazil_values.agro00)


def _calculate_percentage(app_name, output_border_name, scenario_name):
    table_template_name = 'output_{}_{}_{}'
    brazil_table = table_template_name.format(app_name, 'brazil', scenario_name)
    features_percentage = agg_repo.find_border_feature_percentage(output_border_name)
    row = agg_repo.find_brazil_values(brazil_table)._asdict()
    keys = row.keys()
    sorted(keys)
    records = []
    for f in features_percentage:
        new_record = {
            'id': f.id,
            'nm': f.nm
        }
        for key in keys:
            value = row[key]
            if not value:
                value = Decimal(0.0)
            else:
                value = Decimal(value) * Decimal(f.percentage)
            new_record[key] = value
        records.append(new_record)
    return records
