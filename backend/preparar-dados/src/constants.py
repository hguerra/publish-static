import os
import pprint

DATE_FORMAT = "%Y-%m-%d"
DATE_TIME_FORMAT = "%Y-%m-%d %H:%M:%S"
DEFAULT_ENCODING = "iso-8859-1"
ROOT_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
DATA_PATH = os.path.abspath(os.path.join(ROOT_PATH, "data"))
CONFIG_PATH = os.path.abspath(os.path.join(ROOT_PATH, "config"))
LOG_PATH = os.path.abspath(os.path.join(ROOT_PATH, "logs"))
PPRINT = pprint.PrettyPrinter(indent=2).pprint
