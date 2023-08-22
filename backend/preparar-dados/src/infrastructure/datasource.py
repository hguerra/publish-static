from src.infrastructure.pg_data_source import PgDataSource

_pg = PgDataSource(section='app')


def get_postgresql_connection():
    return _pg
