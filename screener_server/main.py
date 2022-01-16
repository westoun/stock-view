#!/usr/bin/env python3


from datetime import datetime
from dotenv import dotenv_values
from flask import jsonify, Flask, request
from flask_cors import CORS
import json
import numpy as np
from os import environ
import sys
from sqlalchemy import and_, create_engine, select, insert
from sqlalchemy import Table, Column, Integer, DateTime, Float, String, MetaData
from sqlalchemy.orm import scoped_session, sessionmaker
from time import sleep

from sql_utils import sqlify_industry_filter, \
    sqlify_ratio_now_filter, sqlify_vs_market_filter, sqlify_vs_industry_filter, \
    sqlify_growth_filter, sqlify_growth_vs_market_filter, \
    sqlify_growth_vs_industry_filter  # nopep8

config = {
    **dotenv_values(),
    **environ
}

app = Flask(__name__)
CORS(app)

def format_companies(company_list):
    """The SQLAlchemy query returns results as list of values.
    This function converts them to dictionaries based on 
    specified list of keys. 

    This approach isn't very robust, so don't take it live!
    Any change in the select statement of the query has to 
    reflect in this function.
    """

    formatted_list = []
    for company_values in company_list:
        company = {
            "Ticker": company_values[0],
            "SimFinId": company_values[1],
            "CompanyName": company_values[2],
            "IndustryId": company_values[3],
            "Industry": company_values[4]
        }
        formatted_list.append(company)

    return formatted_list


def execute_fetch_query(query):
    connection = engine.raw_connection()
    cursor = connection.cursor()

    cursor.execute(query)

    companies = cursor.fetchall()

    cursor.close()
    connection.close()

    return companies


def sqlify_filter(filter_):
    """
    filter types: industryid, ratio now, ratio now vs. market,
    ratio now vs. industry, ratio growth, ratio growth vs. market,
    ratio growth vs. industry

    make ratio the default, set 1 if no denominator
    comparison type
    for growth, start and end year
    """

    filter_type = filter_["type"]

    if filter_type == "industry":
        return sqlify_industry_filter(filter_)
    elif filter_type == "ratioNow":
        return sqlify_ratio_now_filter(filter_)
    elif filter_type == "vsMarket":
        return sqlify_vs_market_filter(filter_)
    elif filter_type == "vsIndustry":
        return sqlify_vs_industry_filter(filter_)
    elif filter_type == "growth":
        return sqlify_growth_filter(filter_)
    elif filter_type == "growthVsMarket":
        return sqlify_growth_vs_market_filter(filter_)
    elif filter_type == "growthVsIndustry":
        return sqlify_growth_vs_industry_filter(filter_)
    else:
        raise NotImplementedError("The declared filter type has not\
            been implemented!")


def sqlify_filters(filters):
    sqlified_filters = [sqlify_filter(filter_) for filter_ in filters]
    filter_text = "\n".join(sqlified_filters)
    return filter_text


def build_fetch_query(filters):

    sqlified_filters = sqlify_filters(filters)

    fetch_query = f"""
        select "Ticker", "SimFinId", "CompanyName", companies."IndustryId", "Industry" 
        from companies 
        join industries 
            on industries."IndustryId" = companies."IndustryId"
        where "SimFinId" is not null
        
        {sqlified_filters}

        limit 200;
    """

    return fetch_query


def fetch_companies(filters):

    fetch_query = build_fetch_query(filters)

    companies = execute_fetch_query(fetch_query)

    companies = format_companies(companies)

    return companies


@app.route('/')
def hello_world():
    return 'Hello, World!'


@app.route('/screen', methods=['POST'])
def screen():

    try:
        body = request.get_json()
        filters = body['filters']
        assert type(filters) == list
        # TODO: Develop strategy how to handle wrong filter format
    except:
        return "Specify filter criteria!"

    companies = fetch_companies(filters)

    return jsonify(companies)


def clear_context():
    pass

def setup_engine(retries=5):

    try:
        engine = create_engine(
            f"postgresql+psycopg2://{config['POSTGRES_USER']}:{config['POSTGRES_PASSWORD']}@{config['POSTGRES_HOST']}:{config['POSTGRES_PORT']}/{config['POSTGRES_DB']}")
        return engine
    except Exception:
        if retries > 0:
            print("Connection to database failed. Retrying...")
            remaining_retries = retries - 1
            sleep(5)
            return setup_engine(retries=remaining_retries)
        else:
            raise Exception("The database connection could not be established.")





if __name__ == "__main__":
    engine = setup_engine()

    # The following host-ip became necessary for
    # dockerization. For details, see
    # https://forums.docker.com/t/docker-is-running-but-i-cannot-access-localhost-flask-application/82193/2
    app.run(host="0.0.0.0")
