import logging
from typing import NamedTuple, Tuple, Any

import psycopg2
import psycopg2.extras
import psycopg2.pool

from src.constants import PPRINT
from src.infrastructure.util import load_config

_logger = logging.getLogger(__name__)


class PgResult(NamedTuple):
    results: Tuple[Any]
    success: bool = False
    rowcount: int = 0


class PgDataSource(object):

    def __init__(self, filename='pg.ini', section=None):
        assert section is not None

        self.source = load_config(filename, section)
        self.name = section
        self.pool = None
        self.is_open = False

        if 'host' not in self.source:
            raise ValueError('No database host specified')

    def connect(self):
        if not self.pool or not self.is_open:
            self.pool = psycopg2.pool.SimpleConnectionPool(**self.source)
            self.is_open = True

        conn = self.pool.getconn()
        assert conn is not None

        _logger.debug('Connection "{}" opened...'.format(self.name))
        return conn

    def close_all(self):
        if self.pool:
            self.pool.closeall()
            self.pool = None
            self.is_open = False
            _logger.debug('Connection "{}" closed!'.format(self.name))

    def close_cursor(self, cur):
        if cur:
            try:
                cur.close()
            except Exception as error:
                _logger.exception(f"Error to close cursor: {error}")

    def release_connection(self, conn):
        if conn:
            try:
                self.pool.putconn(conn)
            except Exception as error:
                _logger.exception(f"Error to release connection: {error}")

    def execute(
        self,
        sql,
        parameters=None,
        fetch=None,
        autocommit=False,
        rollback=False,
        chuncksize=1000,
        cursor_type=psycopg2.extras.NamedTupleCursor
    ) -> PgResult:
        success = False
        rowcount = 0
        results = tuple()
        conn = None

        try:
            conn = self.connect()

            with conn.cursor(cursor_factory=cursor_type) as cur:
                cur.execute(sql, parameters)
                rowcount = cur.rowcount

                if fetch:
                    if isinstance(fetch, int):
                        results = cur.fetchmany(fetch)
                    elif isinstance(fetch, str) and fetch == '*':
                        page_results = []
                        rows = cur.fetchmany(chuncksize)
                        while rows and len(rows) > 0:
                            page_results.extend(rows)
                            rows = cur.fetchmany(chuncksize)
                        results = tuple(page_results)
                    else:
                        raise ValueError('Wrong value for argument fetch "{}"'.format(fetch))

                if autocommit:
                    conn.commit()

                if rollback:
                    conn.rollback()

                success = True
                self.close_cursor(cur)
        except Exception as e:
            _logger.exception('SQL statement: {}, error: {}'.format(sql, e))
            if conn:
                conn.rollback()
        finally:
            self.release_connection(conn)
        return PgResult(results, success, rowcount)

    def __repr__(self):
        return self.__str__()

    def __str__(self):
        return str(self.__class__) + ": " + str(self.__dict__)


def _test_connection():
    _logger.info('Testing SimpleDataSource...')

    source = PgDataSource(section='app')
    _logger.info('IsOpen: ' + str(source.is_open))

    r = source.execute('select * from aluno limit 1;', fetch=1)
    PPRINT(r.results[0])
    _logger.info('IsOpen: ' + str(source.is_open))


if __name__ == '__main__':
    _test_connection()
