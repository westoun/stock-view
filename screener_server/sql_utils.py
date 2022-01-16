#!/usr/bin/env python3


def sqlify_industry_filter(filter_):
    # TODO: Handle wrong keys/missing values
    industry_ids = filter_["industryIds"]
    industry_ids = [str(industry_id) for industry_id in industry_ids]
    query = f"""
        -- filter based on industry id
        and companies."SimFinId" in 
        (
            select companies."SimFinId" from companies
            where companies."IndustryId" in ({','.join(industry_ids)})
        )
    """
    return query


def sqlify_ratio_now_filter(filter_):
    year = filter_["year"]
    if year is None:
        year = 2019  # TODO: put current/highest year

    # TODO: Handling invalid or missing keys
    numerator_key = filter_["numeratorKey"]
    denominator_key = filter_["denominatorKey"]
    value = filter_["value"]
    comparison_type = filter_["comparisonType"]

    if comparison_type == "greaterThan":
        comparison_operator = ">="
    elif comparison_type == "lessThan":
        comparison_operator = "<="
    else:
        raise ValueError("Unknown comparison type!")

    if denominator_key is None:
        query = f"""
            -- filter based on specific ration value
            and companies."SimFinId" in 
            (
            select financial_statement."SimFinId" from financial_statement 
            where 
                "FiscalYear" = {year} 
                and "{numerator_key}" {comparison_operator} {value}
            )
        """
    else:
        query = f"""
            -- filter based on specific ration value
            and companies."SimFinId" in 
            (
            select financial_statement."SimFinId" from financial_statement 
            where 
                "FiscalYear" = {year} 
                and "{denominator_key}" != 0
                and "{numerator_key}" / "{denominator_key}" {comparison_operator} {value}
            )
        """
    return query


def sqlify_vs_market_filter(filter_):
    year = filter_["year"]
    if year is None:
        year = 2019  # TODO: put current/highest year

    # TODO: Handling invalid keys
    numerator_key = filter_["numeratorKey"]
    denominator_key = filter_["denominatorKey"]
    percentile = filter_["value"]
    comparison_type = filter_["comparisonType"]

    if comparison_type == "greaterThan":
        comparison_operator = ">="
    elif comparison_type == "lessThan":
        comparison_operator = "<="
    else:
        raise ValueError("Unknown comparison type!")

    if denominator_key is None:
        query = f"""
            -- filter based on market rank
            and companies."SimFinId" in 
            (
            select companies."SimFinId"
            from companies
            join (
                select companies."SimFinId" as "SimFinId",
                    percent_rank() over (order by financial_statement."{numerator_key}") as "rank"
                from companies
                join financial_statement 
                on financial_statement."SimFinId" = companies."SimFinId"
                where financial_statement."FiscalYear" = {year}
            ) as comparison_companies  
            on comparison_companies."SimFinId" = companies."SimFinId"
            where comparison_companies."rank" {comparison_operator} {percentile}
            )
        """
    else:
        query = f"""
            -- filter based on market rank
            and companies."SimFinId" in 
            (
            select companies."SimFinId"
            from companies
            join (
                select companies."SimFinId" as "SimFinId",
                    percent_rank() over (order by (financial_statement."{numerator_key}" / 
                    financial_statement."{denominator_key}")) as "rank"
                from companies
                join financial_statement 
                on financial_statement."SimFinId" = companies."SimFinId"
                where financial_statement."FiscalYear" = {year}
                and financial_statement."{denominator_key}" != 0
            ) as comparison_companies  
            on comparison_companies."SimFinId" = companies."SimFinId"
            where comparison_companies."rank" {comparison_operator} {percentile}
            )
        """
    return query


def sqlify_vs_industry_filter(filter_):
    year = filter_["year"]
    if year is None:
        year = 2019  # TODO: put current/highest year

    # TODO: Handling invalid keys
    numerator_key = filter_["numeratorKey"]
    denominator_key = filter_["denominatorKey"]
    percentile = filter_["value"]
    comparison_type = filter_["comparisonType"]

    if comparison_type == "greaterThan":
        comparison_operator = ">="
    elif comparison_type == "lessThan":
        comparison_operator = "<="
    else:
        raise ValueError("Unknown comparison type!")

    if denominator_key is None:
        query = f"""
            -- filter based on industry rank
            and companies."SimFinId" in 
            (
            select companies."SimFinId"
            from companies
            join (
                select companies."SimFinId" as "SimFinId",
                    percent_rank() over (partition by companies."IndustryId" 
                    order by financial_statement."{numerator_key}") as "rank"
                from companies
                join financial_statement 
                on financial_statement."SimFinId" = companies."SimFinId"
                where financial_statement."FiscalYear" = {year}
            ) as comparison_companies  
            on comparison_companies."SimFinId" = companies."SimFinId"
            where comparison_companies."rank" {comparison_operator} {percentile}
            )
        """
    else:
        query = f"""
            -- filter based on market rank
            and companies."SimFinId" in 
            (
            select companies."SimFinId"
            from companies
            join (
                select companies."SimFinId" as "SimFinId",
                    percent_rank() over (partition by companies."IndustryId"
                    order by (financial_statement."{numerator_key}" / 
                    financial_statement."{denominator_key}")) as "rank"
                from companies
                join financial_statement 
                on financial_statement."SimFinId" = companies."SimFinId"
                where financial_statement."FiscalYear" = {year}
                and financial_statement."{denominator_key}" != 0
            ) as comparison_companies  
            on comparison_companies."SimFinId" = companies."SimFinId"
            where comparison_companies."rank" {comparison_operator} {percentile}
            )
        """
    return query


def sqlify_growth_filter(filter_):
    # TODO: Handle wrong order years and
    # out of bound
    year_end = filter_["yearEnd"]
    if year_end is None:
        year_end = 2019

    year_start = filter_["yearStart"]
    if year_start is None:
        year_start = year_end - 5

    year_span = year_end - year_start

    numerator_key = filter_["numeratorKey"]
    denominator_key = filter_["denominatorKey"]

    growth_rate = filter_["value"]

    if growth_rate < 1:
        growth_rate = 1 + growth_rate
    else:
        growth_rate = 1 + growth_rate / 100

    comparison_type = filter_["comparisonType"]

    if comparison_type == "greaterThan":
        comparison_operator = ">="
    elif comparison_type == "lessThan":
        comparison_operator = "<="
    else:
        raise ValueError("Unknown comparison type!")

    if denominator_key is None:
        query = f"""
            -- filter based on value growth
            and companies."SimFinId" in 
            (
                select financial_statement_end."SimFinId"
                from financial_statement as financial_statement_end
                inner join financial_statement as financial_statementstart
                on financial_statement_end."SimFinId" = financial_statementstart."SimFinId"
                where 
                    financial_statement_end."FiscalYear" = {year_end}
                    and financial_statementstart."FiscalYear" = {year_start}
                    and financial_statementstart."{numerator_key}" != 0
                    and financial_statement_end."{numerator_key}" / (financial_statementstart."{numerator_key}" + 0.0) > 0
                    and power((financial_statement_end."{numerator_key}" / (financial_statementstart."{numerator_key}" + 
                    0.0)), (1 / ({year_span} + 0.0))) {comparison_operator} {growth_rate}
            )
        """
    else:
        query = f"""
            -- filter based on value growth
            and companies."SimFinId" in 
            (
                select financial_statement_end."SimFinId"
                from financial_statement as financial_statement_end
                inner join financial_statement as financial_statement_start
                on financial_statement_end."SimFinId" = financial_statement_start."SimFinId"
                where 
                    financial_statement_end."FiscalYear" = {year_end}
                    and financial_statement_start."FiscalYear" = {year_start}
                    and financial_statement_end."{denominator_key}" != 0
                    and financial_statement_start."{denominator_key}" != 0
                    and financial_statement_start."{numerator_key}" != 0
                    and (financial_statement_end."{numerator_key}" / (financial_statement_end."{denominator_key}" + 0.0)) 
                    / (financial_statement_start."{numerator_key}" / (financial_statement_start."{denominator_key}" + 0.0)) > 0
                    and power((financial_statement_end."{numerator_key}" / (financial_statement_end."{denominator_key}" + 0.0)) 
                    / (financial_statement_start."{numerator_key}" / (financial_statement_start."{denominator_key}" + 0.0)), 
                    (1 / ({year_span} + 0.0))) {comparison_operator} {growth_rate}
            )
        """
    return query


def sqlify_growth_vs_market_filter(filter_):
    year_end = filter_["yearEnd"]
    if year_end is None:
        year_end = 2019

    year_start = filter_["yearStart"]
    if year_start is None:
        year_start = year_end - 5

    year_span = year_end - year_start

    numerator_key = filter_["numeratorKey"]
    denominator_key = filter_["denominatorKey"]

    percentile = filter_["value"]  # TODO: Handle formatting a la growth rate

    comparison_type = filter_["comparisonType"]

    if comparison_type == "greaterThan":
        comparison_operator = ">="
    elif comparison_type == "lessThan":
        comparison_operator = "<="
    else:
        raise ValueError("Unknown comparison type!")

    if denominator_key is None:
        query = f"""
            -- industry growth rank
            and companies."SimFinId" in 
            (
            select companies."SimFinId" from companies
            join (
                select selection."SimFinId" as "SimFinId",
                    percent_rank() over (order by selection."CompoundedGrowth") as "Rank"
                from (
                    select financial_statement_end."SimFinId" as "SimFinId", companies."IndustryId" as "IndustryId",
                    power((financial_statement_end."{numerator_key}" / (financial_statement_start."{numerator_key}" + 0.0)) , 
                        (1 / ({year_span} + 0.0))) * 100 - 100 as "CompoundedGrowth" 
                    from financial_statement as financial_statement_end
                        inner join financial_statement as financial_statement_start
                            on financial_statement_end."SimFinId" = financial_statement_start."SimFinId"
                        inner join companies 
                            on financial_statement_end."SimFinId" = companies."SimFinId"
                        where 
                            financial_statement_end."FiscalYear" = {year_end}
                            and financial_statement_start."FiscalYear" = {year_start}
                            and financial_statement_start."{numerator_key}" > 0
                            and financial_statement_end."{numerator_key}" / (financial_statement_start."{numerator_key}" + 0.0) > 0   
                ) as selection
            ) as comparison_companies
            on comparison_companies."SimFinId" = companies."SimFinId"
            where comparison_companies."Rank" {comparison_operator} {percentile} 
            )
        """
    else:
        query = f"""
            -- industry growth rank
            and companies."SimFinId" in 
            (
            select companies."SimFinId" from companies
            join (
                select selection."SimFinId" as "SimFinId",
                    percent_rank() over (order by selection."CompoundedGrowth") as "Rank"
                from (
                    select financial_statement_end."SimFinId" as "SimFinId", companies."IndustryId" as "IndustryId",
                    power((financial_statement_end."{numerator_key}" / (financial_statement_end."{denominator_key}" + 0.0)) 
                            / (financial_statement_start."{numerator_key}" / (financial_statement_start."{denominator_key}" + 0.0)) , 
                        (1 / ({year_span} + 0.0))) * 100 - 100 as "CompoundedGrowth" 
                    from financial_statement as financial_statement_end
                        inner join financial_statement as financial_statement_start
                            on financial_statement_end."SimFinId" = financial_statement_start."SimFinId"
                        inner join companies 
                            on financial_statement_end."SimFinId" = companies."SimFinId"
                        where 
                            financial_statement_end."FiscalYear" = {year_end}
                            and financial_statement_start."FiscalYear" = {year_start}

                            and financial_statement_end."{denominator_key}" != 0
                            and financial_statement_start."{denominator_key}" != 0
                            and financial_statement_start."{numerator_key}" != 0
                            and (financial_statement_end."{numerator_key}" / (financial_statement_end."{denominator_key}" + 0.0)) 
                            / (financial_statement_start."{numerator_key}" / (financial_statement_start."{denominator_key}" + 0.0)) > 0
                
                ) as selection
            ) as comparison_companies
            on comparison_companies."SimFinId" = companies."SimFinId"
            where comparison_companies."Rank" {comparison_operator} {percentile} 
            )
        """
    return query


def sqlify_growth_vs_industry_filter(filter_):
    year_end = filter_["yearEnd"]
    if year_end is None:
        year_end = 2019

    year_start = filter_["yearStart"]
    if year_start is None:
        year_start = year_end - 5

    year_span = year_end - year_start

    numerator_key = filter_["numeratorKey"]
    denominator_key = filter_["denominatorKey"]

    percentile = filter_["value"]  # TODO: Handle formatting a la growth rate

    comparison_type = filter_["comparisonType"]

    if comparison_type == "greaterThan":
        comparison_operator = ">="
    elif comparison_type == "lessThan":
        comparison_operator = "<="
    else:
        raise ValueError("Unknown comparison type!")

    if denominator_key is None:
        query = f"""
            -- industry growth rank
            and companies."SimFinId" in 
            (
            select companies."SimFinId" from companies
            join (
                select selection."SimFinId" as "SimFinId",
                    percent_rank() over (partition by selection."IndustryId" order by selection."CompoundedGrowth") as "Rank"
                from (
                    select financial_statement_end."SimFinId" as "SimFinId", companies."IndustryId" as "IndustryId",
                    power((financial_statement_end."{numerator_key}" / (financial_statement_start."{numerator_key}" + 0.0)) , 
                        (1 / ({year_span} + 0.0))) * 100 - 100 as "CompoundedGrowth" 
                    from financial_statement as financial_statement_end
                        inner join financial_statement as financial_statement_start
                            on financial_statement_end."SimFinId" = financial_statement_start."SimFinId"
                        inner join companies 
                            on financial_statement_end."SimFinId" = companies."SimFinId"
                        where 
                            financial_statement_end."FiscalYear" = {year_end}
                            and financial_statement_start."FiscalYear" = {year_start}
                            and financial_statement_start."{numerator_key}" > 0
                            and financial_statement_end."{numerator_key}" / (financial_statement_start."{numerator_key}" + 0.0) > 0   
                ) as selection
            ) as comparison_companies
            on comparison_companies."SimFinId" = companies."SimFinId"
            where comparison_companies."Rank" {comparison_operator} {percentile} 
            )
        """
    else:
        query = f"""
            -- industry growth rank
            and companies."SimFinId" in 
            (
            select companies."SimFinId" from companies
            join (
                select selection."SimFinId" as "SimFinId",
                    percent_rank() over (partition by selection."IndustryId" order by selection."CompoundedGrowth") as "Rank"
                from (
                    select financial_statement_end."SimFinId" as "SimFinId", companies."IndustryId" as "IndustryId",
                    power((financial_statement_end."{numerator_key}" / (financial_statement_end."{denominator_key}" + 0.0)) 
                            / (financial_statement_start."{numerator_key}" / (financial_statement_start."{denominator_key}" + 0.0)) , 
                        (1 / ({year_span} + 0.0))) * 100 - 100 as "CompoundedGrowth" 
                    from financial_statement as financial_statement_end
                        inner join financial_statement as financial_statement_start
                            on financial_statement_end."SimFinId" = financial_statement_start."SimFinId"
                        inner join companies 
                            on financial_statement_end."SimFinId" = companies."SimFinId"
                        where 
                            financial_statement_end."FiscalYear" = {year_end}
                            and financial_statement_start."FiscalYear" = {year_start}

                            and financial_statement_end."{denominator_key}" != 0
                            and financial_statement_start."{denominator_key}" != 0
                            and financial_statement_start."{numerator_key}" != 0
                            and (financial_statement_end."{numerator_key}" / (financial_statement_end."{denominator_key}" + 0.0)) 
                            / (financial_statement_start."{numerator_key}" / (financial_statement_start."{denominator_key}" + 0.0)) > 0
                
                ) as selection
            ) as comparison_companies
            on comparison_companies."SimFinId" = companies."SimFinId"
            where comparison_companies."Rank" {comparison_operator} {percentile} 
            )
        """
    return query
