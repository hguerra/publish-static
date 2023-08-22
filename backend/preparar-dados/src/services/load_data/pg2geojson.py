def ogr2ogr(all_attributes, filter_attributes, filter_scenario, from_table, output_filepath, geom_field):
    pg = 'PG:host=127.0.0.1 port=5432 user=geospatialservice password=geospatialservice dbname=geospatialservice'
    ogr_template = '''ogr2ogr -f "GeoJSON" "{output_filepath}" "{pg}" -sql "{sql}"'''

    base_sql = 'select \\"id\\", \\"name\\", {attributes}, \\"{geom_field}\\" as geom from \\"{from_table}\\"'

    selected_attributes = set()
    for attr in all_attributes:
        if filter_scenario not in attr:
            continue

        for f in filter_attributes:
            if f in attr:
                selected_attributes.add('\\"{}\\"'.format(attr))

    attributes = list(selected_attributes)
    attributes.sort()

    str_attributes = ', '.join(attributes)
    sql = base_sql.format(**{
        'attributes': str_attributes,
        'from_table': from_table,
        'geom_field': geom_field
    })

    ogr = ogr_template.format(**{
        'output_filepath': output_filepath,
        'pg': pg,
        'sql': sql
    })

    return ogr


if __name__ == '__main__':
    # scenario = 'fc_'
    # scenario = 'fcnocra_'
    # scenario = 'fcnocranosfa_'
    # scenario = 'fcnosfa_'
    # scenario = 'idc2_'
    scenario = '_'
    tables = ['biomes', 'brazil', 'regions', 'states']

    lines = [
        '#!/bin/bash',
        'export PGCLIENTENCODING=latin1'
    ]

    for table in tables:
        for geom in ['geom', 'lgeom']:
            basename = '{}{}'.format(scenario.replace('_', '-'), table)
            if geom == 'lgeom':
                basename = basename + '-labels'

            if basename.startswith('-'):
                basename = basename[1:]

            output_filepath = '{}.geojson'.format(basename)
            line = ogr2ogr(
                [
                    'fcnocranosfa_natveg00',
                    'fcnocranosfa_natveg10',
                    'fcnocranosfa_natveg20',
                    'fcnocranosfa_natveg30',
                    'fcnocranosfa_natveg40',
                    'fcnocranosfa_natveg50',
                    'fcnocranosfa_forreg30',
                    'fcnocranosfa_forreg40',
                    'fcnocranosfa_forreg50',
                    'fcnocranosfa_pltfor00',
                    'fcnocranosfa_pltfor10',
                    'fcnocranosfa_pltfor20',
                    'fcnocranosfa_pltfor30',
                    'fcnocranosfa_pltfor40',
                    'fcnocranosfa_pltfor50',
                    'fcnocranosfa_nonprodq00',
                    'fcnocranosfa_nonprodq10',
                    'fcnocranosfa_nonprodq20',
                    'fcnocranosfa_nonprodq30',
                    'fcnocranosfa_nonprodq40',
                    'fcnocranosfa_nonprodq50',
                    'fcnocranosfa_agro00',
                    'fcnocranosfa_agro10',
                    'fcnocranosfa_agro20',
                    'fcnocranosfa_agro30',
                    'fcnocranosfa_agro40',
                    'fcnocranosfa_agro50',
                    'fcnocranosfa_wetlnd00',
                    'fcnocranosfa_wetlnd10',
                    'fcnocranosfa_wetlnd20',
                    'fcnocranosfa_wetlnd30',
                    'fcnocranosfa_wetlnd40',
                    'fcnocranosfa_wetlnd50',
                    'fcnocranosfa_notrel00',
                    'fcnocranosfa_notrel10',
                    'fcnocranosfa_notrel20',
                    'fcnocranosfa_notrel30',
                    'fcnocranosfa_notrel40',
                    'fcnocranosfa_notrel50',
                    'fcnosfa_natveg00',
                    'fcnosfa_natveg10',
                    'fcnosfa_natveg20',
                    'fcnosfa_natveg30',
                    'fcnosfa_natveg40',
                    'fcnosfa_natveg50',
                    'fcnosfa_forreg30',
                    'fcnosfa_forreg40',
                    'fcnosfa_forreg50',
                    'fcnosfa_pltfor00',
                    'fcnosfa_pltfor10',
                    'fcnosfa_pltfor20',
                    'fcnosfa_pltfor30',
                    'fcnosfa_pltfor40',
                    'fcnosfa_pltfor50',
                    'fcnosfa_nonprodq00',
                    'fcnosfa_nonprodq10',
                    'fcnosfa_nonprodq20',
                    'fcnosfa_nonprodq30',
                    'fcnosfa_nonprodq40',
                    'fcnosfa_nonprodq50',
                    'fcnosfa_agro00',
                    'fcnosfa_agro10',
                    'fcnosfa_agro20',
                    'fcnosfa_agro30',
                    'fcnosfa_agro40',
                    'fcnosfa_agro50',
                    'fcnosfa_wetlnd00',
                    'fcnosfa_wetlnd10',
                    'fcnosfa_wetlnd20',
                    'fcnosfa_wetlnd30',
                    'fcnosfa_wetlnd40',
                    'fcnosfa_wetlnd50',
                    'fcnosfa_notrel00',
                    'fcnosfa_notrel10',
                    'fcnosfa_notrel20',
                    'fcnosfa_notrel30',
                    'fcnosfa_notrel40',
                    'fcnosfa_notrel50',
                    'fcnocra_natveg00',
                    'fcnocra_natveg10',
                    'fcnocra_natveg20',
                    'fcnocra_natveg30',
                    'fcnocra_natveg40',
                    'fcnocra_natveg50',
                    'fcnocra_forreg30',
                    'fcnocra_forreg40',
                    'fcnocra_forreg50',
                    'fcnocra_pltfor00',
                    'fcnocra_pltfor10',
                    'fcnocra_pltfor20',
                    'fcnocra_pltfor30',
                    'fcnocra_pltfor40',
                    'fcnocra_pltfor50',
                    'fcnocra_nonprodq00',
                    'fcnocra_nonprodq10',
                    'fcnocra_nonprodq20',
                    'fcnocra_nonprodq30',
                    'fcnocra_nonprodq40',
                    'fcnocra_nonprodq50',
                    'fcnocra_agro00',
                    'fcnocra_agro10',
                    'fcnocra_agro20',
                    'fcnocra_agro30',
                    'fcnocra_agro40',
                    'fcnocra_agro50',
                    'fcnocra_wetlnd00',
                    'fcnocra_wetlnd10',
                    'fcnocra_wetlnd20',
                    'fcnocra_wetlnd30',
                    'fcnocra_wetlnd40',
                    'fcnocra_wetlnd50',
                    'fcnocra_notrel00',
                    'fcnocra_notrel10',
                    'fcnocra_notrel20',
                    'fcnocra_notrel30',
                    'fcnocra_notrel40',
                    'fcnocra_notrel50',
                    'fc_natveg00',
                    'fc_natveg10',
                    'fc_natveg20',
                    'fc_natveg30',
                    'fc_natveg40',
                    'fc_natveg50',
                    'fc_forreg30',
                    'fc_forreg40',
                    'fc_forreg50',
                    'fc_pltfor00',
                    'fc_pltfor10',
                    'fc_pltfor20',
                    'fc_pltfor30',
                    'fc_pltfor40',
                    'fc_pltfor50',
                    'fc_nonprodq00',
                    'fc_nonprodq10',
                    'fc_nonprodq20',
                    'fc_nonprodq30',
                    'fc_nonprodq40',
                    'fc_nonprodq50',
                    'fc_agro00',
                    'fc_agro10',
                    'fc_agro20',
                    'fc_agro30',
                    'fc_agro40',
                    'fc_agro50',
                    'fc_wetlnd00',
                    'fc_wetlnd10',
                    'fc_wetlnd20',
                    'fc_wetlnd30',
                    'fc_wetlnd40',
                    'fc_wetlnd50',
                    'fc_notrel00',
                    'fc_notrel10',
                    'fc_notrel20',
                    'fc_notrel30',
                    'fc_notrel40',
                    'fc_notrel50',
                    'idc2_natveg00',
                    'idc2_natveg10',
                    'idc2_natveg20',
                    'idc2_natveg30',
                    'idc2_natveg40',
                    'idc2_natveg50',
                    'idc2_forreg30',
                    'idc2_forreg40',
                    'idc2_forreg50',
                    'idc2_pltfor00',
                    'idc2_pltfor10',
                    'idc2_pltfor20',
                    'idc2_pltfor30',
                    'idc2_pltfor40',
                    'idc2_pltfor50',
                    'idc2_nonprodq00',
                    'idc2_nonprodq10',
                    'idc2_nonprodq20',
                    'idc2_nonprodq30',
                    'idc2_nonprodq40',
                    'idc2_nonprodq50',
                    'idc2_agro00',
                    'idc2_agro10',
                    'idc2_agro20',
                    'idc2_agro30',
                    'idc2_agro40',
                    'idc2_agro50',
                    'idc2_wetlnd00',
                    'idc2_wetlnd10',
                    'idc2_wetlnd20',
                    'idc2_wetlnd30',
                    'idc2_wetlnd40',
                    'idc2_wetlnd50',
                    'idc2_notrel00',
                    'idc2_notrel10',
                    'idc2_notrel20',
                    'idc2_notrel30',
                    'idc2_notrel40',
                    'idc2_notrel50',
                ],
                [
                    'natveg',
                    'forreg',
                    'pltfor',
                    'agro'
                ],
                scenario,
                table,
                output_filepath,
                geom
            )

            lines.append(line)

    for line in lines:
        print(line)
