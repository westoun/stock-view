#!/usr/bin/env python3

import psycopg2
import psycopg2.extras
import sys

from SQL_QUERIES import DROP_QUOTES_TABLES_QUERY, \
    CREATE_QUOTES_TABLE_QUERY, CREATE_QUOTES_META_QUERY  # nopep8


def seed_quotes_table(engine, connection, cursor):

    cursor.execute(DROP_QUOTES_TABLES_QUERY)
    cursor.execute(CREATE_QUOTES_TABLE_QUERY)
    cursor.execute(CREATE_QUOTES_META_QUERY)

    connection.commit()


