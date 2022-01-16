#!/usr/bin/env python3


from datetime import datetime, timedelta
from dotenv import dotenv_values
from flask import jsonify, Flask, request
from flask_cors import CORS
import numpy as np
from os import environ
from sqlalchemy import create_engine
import sys



# the following workaround became necessary since utils
# are above mvp package.
sys.path.append("/Users/christophstein/Documents/kairos/")
from utils.basic import parse_date  # nopep8
from utils.utils import last_work_day_before_today, \
    fetch_stock_quotes, parse_date_strings
from utils.sql_utils import select_last_fetched, \
    select_company, select_stock_quotes, update_last_fetched, insert_last_fetched, \
        insert_stock_quotes

config = {
    **dotenv_values(),
    **environ
}

db_string = f"postgresql+psycopg2://{config['POSTGRES_USER']}:{config['POSTGRES_PASSWORD']}@{config['POSTGRES_HOST']}:{config['POSTGRES_PORT']}/{config['POSTGRES_DB']}"

app = Flask(__name__)
CORS(app)


@app.route('/')
def hello_world():
    return 'Hello, World!'


@app.route('/quotes/<simfinid>', methods=['GET'])
def company_quote(simfinid):

    start_date = parse_date_strings(request.args.get('from'), "01-01-2020")
    end_date = parse_date_strings(request.args.get('to'), "31-12-2100")

    db_engine = create_engine(db_string)
    connection = db_engine.connect()

    company = select_company(connection, simfinid)
    if company == None:
        return "No company found..."

    ticker = company["Ticker"]

    last_fetched = select_last_fetched(connection, simfinid)

    if last_fetched == None:
        stock_quotes = fetch_stock_quotes(simfinid, ticker)
        insert_stock_quotes(connection, simfinid, stock_quotes)
        insert_last_fetched(connection, simfinid, ticker)

    elif last_fetched != last_work_day_before_today():
        stock_quotes = fetch_stock_quotes(simfinid, ticker)
        insert_stock_quotes(connection, simfinid, stock_quotes)
        update_last_fetched(connection, simfinid)

    stock_quotes = select_stock_quotes(
        connection, simfinid, start_date, end_date)

    return jsonify(stock_quotes)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001)
