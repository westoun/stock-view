import {
  BALANCE_SHEET_DATA_TYPES,
  INCOME_STATEMENT_DATA_TYPES,
  CASHFLOW_STATEMENT_DATA_TYPES
} from './graphql-datatypes';
import {Ratio, FundamentalDataType} from './ratio-definition.type';

export const STOCK_PRICE_KEY = 'STOCK_PRICE_KEY';

export const MARKET_RATIO_CHART_TYPES: Ratio[] = [
  {
    title: 'Price-to-Earnings Ratio',
    numeratorType: {
      gqlKey: STOCK_PRICE_KEY,
      title: 'Stock Price',
    },
    denominatorType: {
      gqlKey: 'NetIncome',
      title: 'Net Income',
    },
  },
  {
    title: 'Price-to-Sales Ratio',
    numeratorType: {
      gqlKey: STOCK_PRICE_KEY,
      title: 'Stock Price',
    },
    denominatorType: {
      gqlKey: 'Revenue',
      title: 'Revenue',
    },
  },
  {
    title: 'Price-to-Book Ratio',
    numeratorType: {
      gqlKey: STOCK_PRICE_KEY,
      title: 'Stock Price',
    },
    denominatorType: {
      gqlKey: 'TotalEquity',
      title: 'Total Equity',
    },
  },
  {
    title: 'Earnings Yield',
    numeratorType: {
      gqlKey: 'NetIncome',
      title: 'Net Income',
    },
    denominatorType: {
      gqlKey: STOCK_PRICE_KEY,
      title: 'Stock Price',
    },
  },
  {
    title: 'Dividend Yield',
    numeratorType: {
      gqlKey: 'DividendsPaid',
      title: 'Dividends Paid',
    },
    denominatorType: {
      gqlKey: STOCK_PRICE_KEY,
      title: 'Stock Price',
    },
  },
];

export const FINANCIAL_STABILITY_CHART_TYPES = [
  {
    title: 'Equity Quota',
    numeratorType: {
      gqlKey: 'TotalEquity',
      title: 'Total Equity',
    },
    denominatorType: {
      gqlKey: 'TotalAssets',
      title: 'Total Assets',
    },
  },

  {
    title: 'Financial Leverage',
    numeratorType: {
      gqlKey: 'TotalAssets',
      title: 'Total Assets',
    },
    denominatorType: {
      gqlKey: 'TotalEquity',
      title: 'Total Equity',
    },
  },

  {
    title: 'Current Ratio',
    numeratorType: {
      gqlKey: 'TotalCurrentAssets',
      title: 'Current Assets',
    },
    denominatorType: {
      gqlKey: 'TotalCurrentLiabilities',
      title: 'Current Liabilities',
    },
  },

  {
    title: 'Quick Ratio',
    numeratorType: {
      gqlKey: 'CashCashEquivalentsShortTermInvestments',
      title: 'Cash and Cash Equivalents',
    },
    denominatorType: {
      gqlKey: 'TotalCurrentLiabilities',
      title: 'Current Liabilities',
    },
  },
];

export const PROFITABILITY_CHART_TYPES = [
  {
    title: 'Income Margin',
    numeratorType: {
      gqlKey: 'NetIncome',
      title: 'Net Income',
    },
    denominatorType: {
      gqlKey: 'Revenue',
      title: 'Revenue',
    },
  },

  {
    title: 'Earnings per Share',
    numeratorType: {
      gqlKey: 'NetIncome',
      title: 'Net Income',
    },
    denominatorType: {
      gqlKey: 'SharesDiluted',
      title: 'Total Shares',
    },
  },
  {
    title: 'Dividends per Share',
    numeratorType: {
      gqlKey: 'DividendsPaid',
      title: 'Dividends Paid',
    },
    denominatorType: {
      gqlKey: 'SharesDiluted',
      title: 'Total Shares',
    },
  },

  {
    title: 'Gross Margin',
    numeratorType: {
      gqlKey: 'GrossProfit',
      title: 'Gross Profit',
    },
    denominatorType: {
      gqlKey: 'Revenue',
      title: 'Revenue',
    },
  },

  {
    title: 'Return on Equity',
    numeratorType: {
      gqlKey: 'NetIncome',
      title: 'Net Income',
    },
    denominatorType: {
      gqlKey: 'TotalEquity',
      title: 'Total Equity',
    },
  },
];

export const OPERATIONAL_EFFICIENCY_CHART_TYPES = [
  {
    title: 'Return on Assets',
    numeratorType: {
      gqlKey: 'NetIncome',
      title: 'Net Income',
    },
    denominatorType: {
      gqlKey: 'TotalAssets',
      title: 'Total Assets',
    },
  },

  {
    title: 'Asset Turnover',
    numeratorType: {
      gqlKey: 'Revenue',
      title: 'Revenue',
    },
    denominatorType: {
      gqlKey: 'TotalAssets',
      title: 'Total Assets',
    },
  },

  {
    title: 'Inventory Turnover',
    numeratorType: {
      gqlKey: 'CostofRevenue',
      title: 'Costs of Goods Sold',
    },
    denominatorType: {
      gqlKey: 'Inventories',
      title: 'Inventory',
    },
  },
];
