#!/usr/bin/env python3

from dotenv import dotenv_values
from os import environ
from sqlalchemy import create_engine
from time import sleep

from seed_simfin import seed_simfin
from seed_quotes_table import seed_quotes_table

config = {
    **dotenv_values(),
    **environ
}


def setup_connection(retries=5):
    try:
        engine = create_engine(
            f"postgresql+psycopg2://{config['POSTGRES_USER']}:{config['POSTGRES_PASSWORD']}@{config['POSTGRES_HOST']}:{config['POSTGRES_PORT']}/{config['POSTGRES_DB']}")
        connection = engine.raw_connection()
        cursor = connection.cursor()
        return engine, connection, cursor
    except Exception:
        if retries > 0:
            print("Connection to database failed. Retrying...")
            remaining_retries = retries - 1
            sleep(5)
            return setup_connection(retries=remaining_retries)
        else:
            raise Exception("The database connection could not be established.")


def teardown_connection(connection, cursor):
    cursor.close()
    connection.close()

def main():

    try:
        seed = int(config['SEED_DB'])
        if seed == 0:
            print("Skipping seed...")
            return
        # else: seed is 1
        print("Starting to seed...")
    except ValueError:
        print(f"Could not parse env variable '{config['SEED_DB']}' to int. Must be 0 or 1!")
        return

    engine, connection, cursor = setup_connection()

    seed_simfin(engine, connection, cursor)
    seed_quotes_table(engine, connection, cursor)

    teardown_connection(connection, cursor)


if __name__ == "__main__":
    main()


