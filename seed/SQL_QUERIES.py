#!/usr/bin/env python3


DROP_QUOTES_TABLES_QUERY = """
    drop table if exists stock_quotes;
    drop table if exists stock_quotes_meta;
"""

CREATE_QUOTES_TABLE_QUERY = """
    CREATE TABLE stock_quotes(
        "SimFinId" bigint,
        "Ticker" text,
        "Price" float,
        "Volume" bigint,
        "Date" timestamp(6)
    );
"""

CREATE_QUOTES_META_QUERY = """
    CREATE TABLE stock_quotes_meta(
        "SimFinId" bigint,
        "Ticker" text,
        "LastFetched" timestamp(6)
    );
"""


# Drop views first, since they dependency on tables
# can cause errors.
DROP_EVERYTHING_QUERY = """
    drop view if exists financial_statement;

    drop table if exists balance_sheet;
    drop table if exists cashflow_statement;
    drop table if exists income_statement;
    drop table if exists companies;
    drop table if exists industries;
"""

DROP_FINANCIAL_STATEMENT_TABLE = """
    drop table if exists financial_statement;
"""

CREATE_FINANCIAL_STATEMENT_VIEW_QUERY = """

    create view financial_statement as
    select 
        income_statement."Ticker" as "Ticker",
        income_statement."SimFinId" as "SimFinId",
        income_statement."Currency" as "Currency",
        income_statement."FiscalYear" as "FiscalYear",
        income_statement."FiscalPeriod" as "FiscalPeriod",
        income_statement."ReportDate" as "ReportDate",
        income_statement."SharesBasic" as "SharesBasic",
        income_statement."SharesDiluted" as "SharesDiluted",
        
        "Revenue",
        "CostofRevenue",
        "GrossProfit",
        "OperatingExpenses",
        "SellingGeneralAdministrative",
        "ResearchDevelopment",
        income_statement."DepreciationAmortization" as "DepreciationAmortization",
        "OperatingIncomeLoss",
        "NonOperatingIncomeLoss",
        "InterestExpenseNet",
        "PretaxIncomeLossAdj",
        "AbnormalGainsLosses",
        "PretaxIncomeLoss",
        "IncomeTaxExpenseBenefitNet",
        "IncomeLossfromContinuingOperations",
        "NetExtraordinaryGainsLosses",
        "NetIncome",
        "NetIncomeCommon",
        
        "CashCashEquivalentsShortTermInvestments",
        "AccountsNotesReceivable",
        "Inventories",
        "TotalCurrentAssets",
        "PropertyPlantEquipmentNet",
        "LongTermInvestmentsReceivables",
        "OtherLongTermAssets",
        "TotalNoncurrentAssets",
        "TotalAssets",
        "PayablesAccruals",
        "ShortTermDebt",
        "TotalCurrentLiabilities",
        "LongTermDebt",
        "TotalNoncurrentLiabilities",
        "TotalLiabilities",
        "ShareCapitalAdditionalPaidInCapital",
        "TreasuryStock",
        "RetainedEarnings",
        "TotalEquity",
        "TotalLiabilitiesEquity",
        
        "NetIncomeStartingLine",
        "NonCashItems",
        "ChangeinWorkingCapital",
        "ChangeinAccountsReceivable",
        "ChangeinInventories",
        "ChangeinAccountsPayable",
        "ChangeinOther",
        "NetCashfromOperatingActivities",
        "ChangeinFixedAssetsIntangibles",
        "NetChangeinLongTermInvestment",
        "NetCashfromAcquisitionsDivestitures",
        "NetCashfromInvestingActivities",
        "DividendsPaid",
        "CashfromRepaymentofDebt",
        "CashfromRepurchaseofEquity",
        "NetCashfromFinancingActivities",
        "NetChangeinCash"

    from income_statement 
    join balance_sheet 
    on income_statement."FiscalYear" = balance_sheet."FiscalYear"
    and income_statement."SimFinId" = balance_sheet."SimFinId"
    join cashflow_statement
    on income_statement."FiscalYear" = cashflow_statement."FiscalYear"
    and income_statement."SimFinId" = cashflow_statement."SimFinId";
"""
