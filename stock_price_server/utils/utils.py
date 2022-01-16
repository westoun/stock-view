#!/usr/bin/env python3
from datetime import datetime, timedelta
import sys
from wallstreet import Stock

sys.path.append("/Users/christophstein/Documents/kairos/")
from utils.basic import parse_date  # nopep8

def get_latest_quotes_date(stock_quotes):
    if len(stock_quotes) == 0:
        return datetime(1970, 1, 1).date()

    dates = [q["Date"] for q in stock_quotes]
    max_date = max(dates)
    return max_date


def fetch_stock_quotes(simfinid, ticker):
    stock = Stock(ticker)

    df = stock.historical(days_back=30*12*20, frequency="d")
    df = df.drop([
        "Open", "High", "Low", "Adj Close"
    ], axis=1)

    quotes = df.to_dict('records')
    quotes = [{"SimFinId": simfinid, "Ticker": ticker, "Price": q["Close"],
               "Volume": q["Volume"], "Date": q["Date"]} for q in quotes]

    return quotes


def last_work_day_before_today():
    today = datetime.now().date()

    if today.weekday() < 5:  # 0 is Monday, 6 is Sunday
        return today

    delta = today.weekday() - 4
    return today - timedelta(days=delta)


def get_latest_quotes_date(stock_quotes):
    if len(stock_quotes) == 0:
        return datetime(1970, 1, 1).date()

    dates = [q["Date"] for q in stock_quotes]
    max_date = max(dates)
    return max_date


def parse_date_strings(date_str=None, default="01-01-2020"):
    if date_str is None:
        date_str = default

    _, start_date = parse_date(date_str, year_only=False)
    return start_date