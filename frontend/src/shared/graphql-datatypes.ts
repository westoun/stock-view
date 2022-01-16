import { Ratio, FundamentalDataType } from './ratio-definition.type';

export const STOCK_PRICE_KEY = 'STOCK_PRICE_KEY';

export const STOCK_QUOTA_DATA_TYPES = [
  {
    gqlKey: STOCK_PRICE_KEY,
    title: 'Stock Price',
  },
];

export const BALANCE_SHEET_DATA_TYPES: FundamentalDataType[] = [
  // {
  //   gqlKey: STOCK_PRICE_KEY,
  //   title: 'Stock Price',
  // },
  {
    gqlKey: 'CashCashEquivalentsShortTermInvestments',
    title: 'Cash and Cash Equivalents',
  },
  {
    gqlKey: 'AccountsNotesReceivable',
    title: 'Accounts Receivable',
  },
  {
    gqlKey: 'Inventories',
    title: 'Inventories',
  },
  {
    gqlKey: 'TotalCurrentAssets',
    title: 'Total Current Assets',
  },
  {
    gqlKey: 'PropertyPlantEquipmentNet',
    title: 'Property Plant and Equipment',
  },
  {
    gqlKey: 'LongTermInvestmentsReceivables',
    title: 'Long Term Receivables',
  },
  {
    gqlKey: 'OtherLongTermAssets',
    title: 'Other Long Term Assets',
  },
  {
    gqlKey: 'TotalNoncurrentAssets',
    title: 'Total Noncurrent Assets',
  },
  {
    gqlKey: 'TotalAssets',
    title: 'Total Assets',
  },
  {
    gqlKey: 'PayablesAccruals',
    title: 'Payables Accruals',
  },
  {
    gqlKey: 'ShortTermDebt',
    title: 'Short Term Debt',
  },
  {
    gqlKey: 'TotalCurrentLiabilities',
    title: 'Total Current Liabilities',
  },
  {
    gqlKey: 'LongTermDebt',
    title: 'Long Term Debt',
  },
  {
    gqlKey: 'TotalNoncurrentLiabilities',
    title: 'Total Noncurrent Liabilities',
  },
  {
    gqlKey: 'TotalLiabilities',
    title: 'Total Liabilities',
  },
  {
    gqlKey: 'ShareCapitalAdditionalPaidInCapital',
    title: 'Share Capital',
  },
  {
    gqlKey: 'TreasuryStock',
    title: 'Treasury Stock',
  },
  {
    gqlKey: 'RetainedEarnings',
    title: 'Retained Earnings',
  },
  {
    gqlKey: 'TotalEquity',
    title: 'Total Equity',
  },
  {
    gqlKey: 'TotalLiabilitiesEquity',
    title: 'Total Liabilities and Equity',
  },
];

export const INCOME_STATEMENT_DATA_TYPES: FundamentalDataType[] = [
  {
    gqlKey: 'Revenue',
    title: 'Revenue',
  },
  {
    gqlKey: 'CostofRevenue',
    title: 'Cost of Revenue',
  },
  {
    gqlKey: 'GrossProfit',
    title: 'Gross Profit',
  },
  {
    gqlKey: 'OperatingExpenses',
    title: 'Operating Expenses',
  },
  {
    gqlKey: 'SellingGeneralAdministrative',
    title: 'Selling, General and Administrative Costs',
  },
  {
    gqlKey: 'ResearchDevelopment',
    title: 'Research and Development',
  },
  {
    gqlKey: 'DepreciationAmortization',
    title: 'Depreciation and Amortization',
  },
  {
    gqlKey: 'OperatingIncomeLoss',
    title: 'Operating Income',
  },
  {
    gqlKey: 'NonOperatingIncomeLoss',
    title: 'Non Operating Income',
  },
  {
    gqlKey: 'InterestExpenseNet',
    title: 'Interest Expense',
  },
  {
    gqlKey: 'PretaxIncomeLossAdj',
    title: 'Pretax Income',
  },
  {
    gqlKey: 'AbnormalGainsLosses',
    title: 'Abnormal Gains',
  },
  {
    gqlKey: 'PretaxIncomeLoss',
    title: 'Pretax Income',
  },
  {
    gqlKey: 'IncomeTaxExpenseBenefitNet',
    title: 'Income Tax Expense',
  },
  {
    gqlKey: 'IncomeLossfromContinuingOperations',
    title: 'Income from Continuing Operations',
  },
  {
    gqlKey: 'NetExtraordinaryGainsLosses',
    title: 'Net Extraordinary Gains',
  },
  {
    gqlKey: 'NetIncome',
    title: 'Net Income',
  },
];

export const CASHFLOW_STATEMENT_DATA_TYPES: FundamentalDataType[] = [
  {
    gqlKey: 'NetIncomeStartingLine',
    title: 'Net Income Starting Line',
  },
  {
    gqlKey: 'DepreciationAmortization',
    title: 'Depreciation and Amortization',
  },
  {
    gqlKey: 'NonCashItems',
    title: 'Non Cash Items',
  },
  {
    gqlKey: 'ChangeinWorkingCapital',
    title: 'Change in Working Capital',
  },
  {
    gqlKey: 'ChangeinAccountsReceivable',
    title: 'Change in Accounts Receivable',
  },
  {
    gqlKey: 'ChangeinInventories',
    title: 'Change in Inventories',
  },
  {
    gqlKey: 'ChangeinAccountsPayable',
    title: 'Change in Accounts Payable',
  },
  {
    gqlKey: 'ChangeinOther',
    title: 'Change in Other',
  },
  {
    gqlKey: 'NetCashfromOperatingActivities',
    title: 'Cash from Operating Activities',
  },
  {
    gqlKey: 'ChangeinFixedAssetsIntangibles',
    title: 'Change in Fixed Assets',
  },
  {
    gqlKey: 'NetChangeinLongTermInvestment',
    title: 'Change in Long Term Investment',
  },
  {
    gqlKey: 'NetCashfromAcquisitionsDivestitures',
    title: 'Cash from Acquisitions and Divestitures',
  },
  {
    gqlKey: 'NetCashfromInvestingActivities',
    title: 'Cash from Investing Activities',
  },
  {
    gqlKey: 'DividendsPaid',
    title: 'Dividends Paid',
  },
  {
    gqlKey: 'CashfromRepaymentofDebt',
    title: 'Cash from Repayment of Debt',
  },
  {
    gqlKey: 'CashfromRepurchaseofEquity',
    title: 'Cash from Repurchase of Equity',
  },
  {
    gqlKey: 'NetCashfromFinancingActivities',
    title: 'Cash from Financing Activities',
  },
  {
    gqlKey: 'NetChangeinCash',
    title: 'Change in Cash',
  },
];
