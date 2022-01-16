#!/usr/bin/env python3 

from dateutil.parser import parse
import re

def parse_date(string, fuzzy=True, year_only=True):
    """
    Function that parses dates from string to datetime.

    Args: 
        string: the string whish (should) contain the date.

    Returns:
        has_date: Boolean
        date:int || None
    """
    val = string

    try:
        if val is None:
            return False, None

        val = val.replace("\n", "")

        # Seperate regex check became necessary, to avoid
        # false positives due to fuzzy search.
        if not _contains_year(val):
            return False, None

        # If date was in format "MMMM dd,YYYY" the year was not detected
        val = val.replace(",", " ")

        date = parse(val, fuzzy=fuzzy)

        if date.year < 1800 or date.year > 2200:
            # Due to fuzzy date parse, might detect regular number as date
            return False, None

        if year_only:    
            date = date.year

        return True, date

    except (ValueError, TypeError, OverflowError):
        return False, None


def _contains_year(string):
    pattern = ".*\d{4}.*"
    return re.match(pattern, string)