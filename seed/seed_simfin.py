#!/usr/bin/env python3

from dotenv import dotenv_values
from os import environ
import psycopg2
import psycopg2.extras
import simfin as sf
import sys

from SQL_QUERIES import DROP_EVERYTHING_QUERY, \
    CREATE_FINANCIAL_STATEMENT_VIEW_QUERY, \
    DROP_FINANCIAL_STATEMENT_TABLE  # nopep8


def dbfy_column_name(text):
    text = text.replace(".", "")
    text = text.replace(",", "")
    text = text.replace("-", "")
    text = text.replace("(", "")
    text = text.replace(")", "")
    text = text.replace("&", "")
    text = text.replace("/", "")
    text = "".join(text.split(" "))
    return text


def dbfy_column_names(df):
    columns_dict = {}
    for column in df.columns:
        dbfied_column = dbfy_column_name(column)
        columns_dict[column] = dbfied_column

    df.rename(columns=columns_dict, inplace=True)
    return df


def normalize_df(df):
    df.reset_index(inplace=True)  # turns ticker into column
    df = dbfy_column_names(df)
    return df


def seed_table(table_name, df, engine, connection, cursor):
    df = normalize_df(df)

    try:
        df.to_sql(table_name, engine, if_exists="replace", index=False)
    except TypeError:
        # if the injection fails, table still gets
        # created with right types.
        # Inspired by https://stackoverflow.com/a/52124686

        columns = "\"" + "\", \"".join(df.columns) + "\""
        values = "VALUES({})".format(",".join(["%s" for _ in df.columns]))
        insert_statement = "INSERT INTO {} ({}) {}".format(
            table_name, columns, values)
        psycopg2.extras.execute_batch(cursor, insert_statement, df.values)

        connection.commit()


def seed_tables(engine, connection, cursor):
    df = sf.load_industries()
    seed_table("industries", df, engine, connection, cursor)

    df = sf.load_companies(market='us')
    seed_table("companies", df, engine, connection, cursor)

    df = sf.load_income(variant='annual', market='us')
    seed_table("income_statement", df, engine, connection, cursor)

    df = sf.load_balance(variant='annual', market='us')
    seed_table("balance_sheet", df, engine, connection, cursor)

    df = sf.load_cashflow(variant='annual', market='us')
    seed_table("cashflow_statement", df, engine, connection, cursor)


def drop_existing_tables(cursor, connection):
    try:
        cursor.execute(DROP_EVERYTHING_QUERY)
        connection.commit()
    except psycopg2.ProgrammingError:
        # When company data container starts before seed,
        # it initializes sequelize types as tables.
        # This can cause programming error, since financial
        # statement is suppossed to be view.
        connection.rollback()
        cursor.execute(DROP_FINANCIAL_STATEMENT_TABLE)
        connection.commit()
        drop_existing_tables(cursor, connection)


def create_financial_statement_view(cursor, connection):
    cursor.execute(CREATE_FINANCIAL_STATEMENT_VIEW_QUERY)
    connection.commit()


def seed_simfin(engine, connection, cursor):

    env = {
        **dotenv_values(),
        **environ
    }

    simfin_api_key = env["SIMFIN_API_KEY"]
    data_dir = env["SIMFIN_DATA_DIR"]

    sf.set_api_key(simfin_api_key)
    sf.set_data_dir(data_dir)

    drop_existing_tables(cursor, connection)

    seed_tables(engine, connection, cursor)

    create_financial_statement_view(cursor, connection)
