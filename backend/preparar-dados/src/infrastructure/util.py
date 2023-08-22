import json
import logging
import os
import subprocess
from configparser import ConfigParser
from datetime import datetime as dt
from multiprocessing import cpu_count, Process

from src.constants import CONFIG_PATH, DATE_TIME_FORMAT, DATE_FORMAT, DEFAULT_ENCODING


def str_to_datetime(s) -> dt:
    return dt.strptime(s, DATE_TIME_FORMAT)


def date_to_str(date: dt) -> str:
    return date.strftime(DATE_FORMAT)


def date_today_to_str() -> str:
    return date_to_str(dt.now())


def chunks(l, n):
    """Yield successive n-sized chunks from l."""
    for i in range(0, len(l), n):
        yield l[i:i + n]


def thread(elements, __sof__, cpus=cpu_count()):
    n = len(elements) / cpus
    logging.info("Running '{}' using {} cpus and {} elements by cpu...".format(__sof__.func_name, cpus, n))
    procs = []
    for el in chunks(elements, n):
        proc = Process(target=__sof__, args=(el,))
        procs.append(proc)
        proc.start()
    for proc in procs:
        proc.join()


def run_command(commands):
    assert isinstance(commands, list)
    success = False
    retry_count = 0

    fused_command = ' '.join([str(c) for c in commands])
    log_lines = ["Execution console output"]
    while not success:
        try:
            with subprocess.Popen(
                fused_command,
                shell=True,
                stdout=subprocess.PIPE,
                stdin=subprocess.DEVNULL,
                stderr=subprocess.STDOUT,
                universal_newlines=True,
            ) as proc:
                for line in proc.stdout:
                    log_lines.append(line)
                success = True
        except IOError as e:
            if retry_count < 5:
                retry_count += 1
            else:
                raise IOError(
                    str(
                        e) + u'\nTried 5 times without success. Last iteration stopped after reading {} line(s).\n'
                             u'Last line(s):\n{}'.format(
                        len(log_lines), u'\n'.join(log_lines[-10:])))

    return success, log_lines


def load_config(filename='pg.ini', section='app'):
    filepath = os.path.join(CONFIG_PATH, filename)

    if not os.path.isfile(filepath):
        raise IOError('File "{}" not found'.format(filepath))

    parser = ConfigParser()
    parser.read(filepath)

    config = {}
    if parser.has_section(section):
        params = parser.items(section)
        for param in params:
            config[param[0]] = param[1]
    else:
        raise Exception('Section {0} not found in the {1} file'.format(section, filepath))

    return config


def read_json(path):
    with open(path, encoding=DEFAULT_ENCODING) as json_file:
        return json.load(json_file)


def write_script(shell_script, lines, mode='w', remove_header=False):
    header = r'#!/bin/bash' + '\n'
    if remove_header:
        header = ''

    lines.insert(0, header)
    with open(shell_script, mode, encoding=DEFAULT_ENCODING) as f:
        for line in lines:
            if line.strip() == '':
                continue

            try:
                f.write(line + '\n')
            except Exception as writeErr:
                logging.error('Error to append "{}": {}'.format(line, str(writeErr)))
