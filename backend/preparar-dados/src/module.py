# -*- coding: utf-8 -*-
import logging
import os

import src.services.add_new_field.service as add_new_field_service
from src import dist_name, __version__
from src.constants import DATE_TIME_FORMAT, LOG_PATH
from src.infrastructure.util import date_today_to_str

__author__ = "Heitor Carneiro"
__copyright__ = "Heitor Carneiro"
__license__ = "mit"

_logger = logging.getLogger(__name__)


def setup_logging(loglevel):
    """Setup basic logging

    Args:
      loglevel (int): minimum loglevel for emitting messages
    """
    logformat = "[%(asctime)s] %(levelname)s:%(name)s:%(message)s"
    logfilename = os.path.abspath(os.path.join(LOG_PATH, "service.{}.log".format(date_today_to_str())))
    logging.basicConfig(
        level=loglevel,
        filename=logfilename,
        format=logformat,
        datefmt=DATE_TIME_FORMAT
    )

    if loglevel <= logging.INFO:
        formatter = logging.Formatter(fmt=logformat, datefmt=DATE_TIME_FORMAT)
        console = logging.StreamHandler()
        console.setFormatter(formatter)
        logging.getLogger().addHandler(console)


def main():
    loglevel = int(os.environ.get('SERVICE_LOG_LEVEL', logging.INFO))

    setup_logging(loglevel)
    _logger.debug("Starting '{}' version '{}'".format(dist_name, __version__))

    # validar campos gveg e pastn
    # output_table_name = 'luccme'

    # ld_util.each_shapefile(output_table_name, shp_fields)

    # ld_service.process(
    #     '/home/user/dev/pessoal/inpe/data/Output',
    #     '/home/user/dev/pessoal/inpe/publish-next/backend/geospatialservice/data/raster/extend_10km2_4326.tif'
    # )

    # shp_fields = [
    #     'natveg00',
    #     'natveg10',
    #     'natveg20',
    #     'natveg30',
    #     'natveg40',
    #     'natveg50',
    #     'forreg30',
    #     'forreg40',
    #     'forreg50',
    #     'pltfor00',
    #     'pltfor10',
    #     'pltfor20',
    #     'pltfor30',
    #     'pltfor40',
    #     'pltfor50',
    #     'nonprodq00',
    #     'nonprodq10',
    #     'nonprodq20',
    #     'nonprodq30',
    #     'nonprodq40',
    #     'nonprodq50',
    #     'agro00',
    #     'agro10',
    #     'agro20',
    #     'agro30',
    #     'agro40',
    #     'agro50',
    #     'wetlnd00',
    #     'wetlnd10',
    #     'wetlnd20',
    #     'wetlnd30',
    #     'wetlnd40',
    #     'wetlnd50',
    #     'notrel00',
    #     'notrel10',
    #     'notrel20',
    #     'notrel30',
    #     'notrel40',
    #     'notrel50'
    # ]
    #
    # ld_service.process_brazilforestcode(
    #     'brazilsforestcode_scenario_fcdd',
    #     'fc',
    #     shp_fields
    # )

    # ####################################
    # shp_fields = [
    #     'natveg00',
    #     'natveg10',
    #     'natveg20',
    #     'natveg30',
    #     'natveg40',
    #     'natveg50',
    #     'forreg30',
    #     'forreg40',
    #     'forreg50',
    #     'pltfor00',
    #     'pltfor10',
    #     'pltfor20',
    #     'pltfor30',
    #     'pltfor40',
    #     'pltfor50',
    #     'nonprodq00',
    #     'nonprodq10',
    #     'nonprodq20',
    #     'nonprodq30',
    #     'nonprodq40',
    #     'nonprodq50',
    #     'agro00',
    #     'agro10',
    #     'agro20',
    #     'agro30',
    #     'agro40',
    #     'agro50',
    #     'wetlnd00',
    #     'wetlnd10',
    #     'wetlnd20',
    #     'wetlnd30',
    #     'wetlnd40',
    #     'wetlnd50',
    #     'notrel00',
    #     'notrel10',
    #     'notrel20',
    #     'notrel30',
    #     'notrel40',
    #     'notrel50',
    # ]
    #
    # ld_service.process_brazilforestcode(
    #     'brazilsforestcode_scenario_fcnocra_dd',
    #     'fcnocra',
    #     shp_fields
    # )

    # ####################################
    # shp_fields = [
    #     'natveg00',
    #     'natveg10',
    #     'natveg20',
    #     'natveg30',
    #     'natveg40',
    #     'natveg50',
    #     'forreg30',
    #     'forreg40',
    #     'forreg50',
    #     'pltfor00',
    #     'pltfor10',
    #     'pltfor20',
    #     'pltfor30',
    #     'pltfor40',
    #     'pltfor50',
    #     'nonprodq00',
    #     'nonprodq10',
    #     'nonprodq20',
    #     'nonprodq30',
    #     'nonprodq40',
    #     'nonprodq50',
    #     'agro00',
    #     'agro10',
    #     'agro20',
    #     'agro30',
    #     'agro40',
    #     'agro50',
    #     'wetlnd00',
    #     'wetlnd10',
    #     'wetlnd20',
    #     'wetlnd30',
    #     'wetlnd40',
    #     'wetlnd50',
    #     'notrel00',
    #     'notrel10',
    #     'notrel20',
    #     'notrel30',
    #     'notrel40',
    #     'notrel50',
    # ]
    #
    # ld_service.process_brazilforestcode(
    #     'brazilsforestcode_scenario_fcnocranosfa',
    #     'fcnocranosfa',
    #     shp_fields
    # )

    # ####################################
    # shp_fields = [
    #     'natveg00',
    #     'natveg10',
    #     'natveg20',
    #     'natveg30',
    #     'natveg40',
    #     'natveg50',
    #     'forreg30',
    #     'forreg40',
    #     'forreg50',
    #     'pltfor00',
    #     'pltfor10',
    #     'pltfor20',
    #     'pltfor30',
    #     'pltfor40',
    #     'pltfor50',
    #     'nonprodq00',
    #     'nonprodq10',
    #     'nonprodq20',
    #     'nonprodq30',
    #     'nonprodq40',
    #     'nonprodq50',
    #     'agro00',
    #     'agro10',
    #     'agro20',
    #     'agro30',
    #     'agro40',
    #     'agro50',
    #     'wetlnd00',
    #     'wetlnd10',
    #     'wetlnd20',
    #     'wetlnd30',
    #     'wetlnd40',
    #     'wetlnd50',
    #     'notrel00',
    #     'notrel10',
    #     'notrel20',
    #     'notrel30',
    #     'notrel40',
    #     'notrel50',
    # ]
    #
    # ld_service.process_brazilforestcode(
    #     'brazilsforestcode_scenario_fcnosfa',
    #     'fcnosfa',
    #     shp_fields
    # )

    ####################################
    # shp_fields = [
    #     'natveg00',
    #     'natveg10',
    #     'natveg20',
    #     'natveg30',
    #     'natveg40',
    #     'natveg50',
    #     'pltfor00',
    #     'pltfor10',
    #     'pltfor20',
    #     'pltfor30',
    #     'pltfor40',
    #     'pltfor50',
    #     'nonprodq00',
    #     'nonprodq10',
    #     'nonprodq20',
    #     'nonprodq30',
    #     'nonprodq40',
    #     'nonprodq50',
    #     'agro00',
    #     'agro10',
    #     'agro20',
    #     'agro30',
    #     'agro40',
    #     'agro50',
    #     'wetlnd00',
    #     'wetlnd10',
    #     'wetlnd20',
    #     'wetlnd30',
    #     'wetlnd40',
    #     'wetlnd50',
    #     'notrel00',
    #     'notrel10',
    #     'notrel20',
    #     'notrel30',
    #     'notrel40',
    #     'notrel50',
    # ]
    #
    # ld_service.process_brazilforestcode(
    #     'brazilsforestcode_scenario_idc2_dd',
    #     'idc2',
    #     shp_fields
    # )

    # agg_service.calculate()

    add_new_field_service.process()


def run():
    """Entry point for console_scripts
    """
    main()


if __name__ == "__main__":
    run()
