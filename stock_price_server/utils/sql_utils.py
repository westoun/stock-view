#!/usr/bin/env python3

from datetime import datetime, timedelta
from sqlalchemy import and_, create_engine, select, insert, update
from sqlalchemy import Table, Column, Integer, DateTime, Float, String, MetaData
import sys

sys.path.append("/Users/christophstein/Documents/kairos/")
from utils.utils import get_latest_quotes_date  # nopep8


meta = MetaData()

companies_table = Table(
    'companies',
    meta,
    Column('Ticker', String),
    Column('SimFinId', Integer, primary_key=True),
    Column('CompanyName', String),
    Column('IndustryId', Integer)
)

stock_quotes_table = Table(
    'stock_quotes',
    meta,
    Column('SimFinId', Integer),
    Column('Ticker', String),
    Column('Price', Float),
    Column('Volume', Integer),
    Column('Date', DateTime)
)

stock_quotes_meta_table = Table(
    'stock_quotes_meta',
    meta,
    Column('SimFinId', Integer),
    Column('Ticker', String),
    Column('LastFetched', DateTime)
)


def select_last_fetched(connection, simfinid):

    select_quotes_meta_statement = select(stock_quotes_meta_table).where(
        stock_quotes_meta_table.columns.SimFinId == simfinid
    )

    quotes_meta_result = connection.execute(select_quotes_meta_statement)
    quotes_meta = [dict(r) for r in quotes_meta_result]

    if len(quotes_meta) > 0:
        return quotes_meta[0]["LastFetched"].date()
    else:
        return None


def select_company(connection, simfinid):

    select_companies_statement = select(companies_table).where(
        companies_table.columns.SimFinId == simfinid)

    companies_result = connection.execute(select_companies_statement)

    # transforming to dict became necessary
    # since execute returns cursor object that
    # cannot be converted to list directly.
    companies = [dict(r) for r in companies_result]

    if len(companies) > 0:
        return companies[0]

    else:
        return None


def select_stock_quotes(connection, simfinid, start_date, end_date):
    select_quotes_statement = select(stock_quotes_table).where(and_(
        stock_quotes_table.columns.SimFinId == simfinid,
        stock_quotes_table.columns.Date <= end_date,
        stock_quotes_table.columns.Date >= start_date
    ))

    stock_quotes_result = connection.execute(select_quotes_statement)

    stock_quotes = [dict(r) for r in stock_quotes_result]

    return stock_quotes


def update_last_fetched(connection, simfinid):
    today = datetime.now().date()
    update_meta_statement = update(stock_quotes_meta_table).\
        where(stock_quotes_meta_table.columns.SimFinId == simfinid).\
        values(LastFetched=today)
    connection.execute(update_meta_statement)


def insert_last_fetched(connection, simfinid, ticker):
    today = datetime.now().date()
    insert_meta_statement = insert(stock_quotes_meta_table).values(
        SimFinId=simfinid, Ticker=ticker, LastFetched=today
    )
    connection.execute(insert_meta_statement)


def insert_stock_quotes(connection, simfinid, stock_quotes):
    start_date = datetime(1970, 1, 1).date()
    end_date = datetime(2100, 12, 31).date()
    existing_quotes = select_stock_quotes(
        connection, simfinid, start_date, end_date)
    latest_date = get_latest_quotes_date(existing_quotes)

    # TODO: Figure out a way to only insert whats new directly in sql
    uninserted_quotes = [q for q in stock_quotes if q["Date"] > latest_date]
    for quote in uninserted_quotes:
        insert_quote_statement = insert(stock_quotes_table).values(
            SimFinId=quote["SimFinId"], Ticker=quote["Ticker"],
            Price=quote["Price"], Volume=quote["Volume"], Date=quote["Date"]
        )
        connection.execute(insert_quote_statement)
