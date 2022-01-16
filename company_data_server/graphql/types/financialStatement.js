import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLNonNull,
  GraphQLBoolean,
  GraphQLInt,
  GraphQLList,
} from 'graphql';

import GraphQLLong from 'graphql-type-long';

import models from '../../models/index.js';

import Company from './company';

function timesNegativeOneIfExists(numberValue) {
  if (!numberValue) {
    return 0;
  }
  return numberValue * -1;
}

function handleNaN(numberValue) {
  if (!numberValue) {
    return 0;
  }
  return numberValue;
}

export default new GraphQLObjectType({
  name: 'financialStatement',
  description: 'financialStatement',
  fields() {
    return {
      SimFinId: {
        type: GraphQLInt,
        description: '',
        resolve(financialStatement) {
          return financialStatement.SimFinId;
        },
      },
      Ticker: {
        type: GraphQLString,
        description: '',
        resolve(financialStatement) {
          return financialStatement.Ticker;
        },
      },
      FiscalYear: {
        type: GraphQLInt,
        description: '',
        resolve(financialStatement) {
          return financialStatement.FiscalYear;
        },
      },
      ReportDate: {
        type: GraphQLString,
        description: '',
        resolve(financialStatement) {
          return financialStatement.ReportDate;
        },
      },
      SharesBasic: {
        type: GraphQLLong,
        description: '',
        resolve(financialStatement) {
          return financialStatement.SharesBasic;
        },
      },
      SharesDiluted: {
        type: GraphQLLong,
        description: '',
        resolve(financialStatement) {
          return financialStatement.SharesDiluted;
        },
      },

      // Balance sheet data

      CashCashEquivalentsShortTermInvestments: {
        type: GraphQLLong,
        description: '',
        resolve(financialStatement) {
          return handleNaN(
            financialStatement.CashCashEquivalentsShortTermInvestments
          );
        },
      },
      AccountsNotesReceivable: {
        type: GraphQLLong,
        description: '',
        resolve(financialStatement) {
          return handleNaN(financialStatement.AccountsNotesReceivable);
        },
      },
      Inventories: {
        type: GraphQLLong,
        description: '',
        resolve(financialStatement) {
          return handleNaN(financialStatement.Inventories);
        },
      },
      TotalCurrentAssets: {
        type: GraphQLLong,
        description: '',
        resolve(financialStatement) {
          return handleNaN( financialStatement.TotalCurrentAssets);
        },
      },
      PropertyPlantEquipmentNet: {
        type: GraphQLLong,
        description: '',
        resolve(financialStatement) {
          return handleNaN( financialStatement.PropertyPlantEquipmentNet);
        },
      },
      LongTermInvestmentsReceivables: {
        type: GraphQLLong,
        description: '',
        resolve(financialStatement) {
          return handleNaN( financialStatement.LongTermInvestmentsReceivables);
        },
      },
      OtherLongTermAssets: {
        type: GraphQLLong,
        description: '',
        resolve(financialStatement) {
          return handleNaN( financialStatement.OtherLongTermAssets);
        },
      },
      TotalNoncurrentAssets: {
        type: GraphQLLong,
        description: '',
        resolve(financialStatement) {
          return handleNaN( financialStatement.TotalNoncurrentAssets);
        },
      },
      TotalAssets: {
        type: GraphQLLong,
        description: '',
        resolve(financialStatement) {
          return handleNaN( financialStatement.TotalAssets);
        },
      },
      PayablesAccruals: {
        type: GraphQLLong,
        description: '',
        resolve(financialStatement) {
          return handleNaN( financialStatement.PayablesAccruals);
        },
      },
      ShortTermDebt: {
        type: GraphQLLong,
        description: '',
        resolve(financialStatement) {
          return handleNaN( financialStatement.ShortTermDebt);
        },
      },
      TotalCurrentLiabilities: {
        type: GraphQLLong,
        description: '',
        resolve(financialStatement) {
          return handleNaN( financialStatement.TotalCurrentLiabilities);
        },
      },
      LongTermDebt: {
        type: GraphQLLong,
        description: '',
        resolve(financialStatement) {
          return handleNaN( financialStatement.LongTermDebt);
        },
      },
      TotalNoncurrentLiabilities: {
        type: GraphQLLong,
        description: '',
        resolve(financialStatement) {
          return handleNaN( financialStatement.TotalNoncurrentLiabilities);
        },
      },
      TotalLiabilities: {
        type: GraphQLLong,
        description: '',
        resolve(financialStatement) {
          return handleNaN( financialStatement.TotalLiabilities);
        },
      },
      ShareCapitalAdditionalPaidInCapital: {
        type: GraphQLLong,
        description: '',
        resolve(financialStatement) {
          return handleNaN( financialStatement.ShareCapitalAdditionalPaidInCapital);
        },
      },
      TreasuryStock: {
        type: GraphQLLong,
        description: '',
        resolve(financialStatement) {
          return handleNaN( financialStatement.TreasuryStock);
        },
      },
      RetainedEarnings: {
        type: GraphQLLong,
        description: '',
        resolve(financialStatement) {
          return handleNaN( financialStatement.RetainedEarnings);
        },
      },
      TotalEquity: {
        type: GraphQLLong,
        description: '',
        resolve(financialStatement) {
          return handleNaN( financialStatement.TotalEquity);
        },
      },
      TotalLiabilitiesEquity: {
        type: GraphQLLong,
        description: '',
        resolve(financialStatement) {
          return handleNaN( financialStatement.TotalLiabilitiesEquity);
        },
      },

      // Income statement data

      Revenue: {
        type: GraphQLLong,
        description: '',
        resolve(financialStatement) {
          return handleNaN( financialStatement.Revenue);
        },
      },

      CostofRevenue: {
        type: GraphQLLong,
        description: '',

        resolve(financialStatement) {
          const value = handleNaN(financialStatement.CostofRevenue);
          return timesNegativeOneIfExists(value);
        },
      },
      GrossProfit: {
        type: GraphQLLong,
        description: '',

        resolve(financialStatement) {
          return handleNaN( financialStatement.GrossProfit);
        },
      },
      OperatingExpenses: {
        type: GraphQLLong,
        description: '',

        resolve(financialStatement) {
          const value = handleNaN(financialStatement.OperatingExpenses);
          return timesNegativeOneIfExists(value);
        },
      },
      SellingGeneralAdministrative: {
        type: GraphQLLong,
        description: '',

        resolve(financialStatement) {
          const value = handleNaN(financialStatement.SellingGeneralAdministrative);
          return timesNegativeOneIfExists(
            value
          );
        },
      },
      ResearchDevelopment: {
        type: GraphQLLong,
        description: '',

        resolve(financialStatement) {
          const value = handleNaN(financialStatement.ResearchDevelopment);
          return timesNegativeOneIfExists(
            value
          );
        },
      },
      DepreciationAmortization: {
        type: GraphQLLong,
        description: '',

        resolve(financialStatement) {
          const value = handleNaN(financialStatement.DepreciationAmortization);
          return timesNegativeOneIfExists(
            value
          );
        },
      },
      OperatingIncomeLoss: {
        type: GraphQLLong,
        description: '',

        resolve(financialStatement) {
          return handleNaN( financialStatement.OperatingIncomeLoss);
        },
      },
      NonOperatingIncomeLoss: {
        type: GraphQLLong,
        description: '',

        resolve(financialStatement) {
          return handleNaN( financialStatement.NonOperatingIncomeLoss);
        },
      },
      InterestExpenseNet: {
        type: GraphQLLong,
        description: '',

        resolve(financialStatement) {
          const value = handleNaN(financialStatement.InterestExpenseNet);
          return timesNegativeOneIfExists(
            value
          );
        },
      },
      PretaxIncomeLossAdj: {
        type: GraphQLLong,
        description: '',

        resolve(financialStatement) {
          return handleNaN( financialStatement.PretaxIncomeLossAdj);
        },
      },
      AbnormalGainsLosses: {
        type: GraphQLLong,
        description: '',

        resolve(financialStatement) {
         return handleNaN( financialStatement.AbnormalGainsLosses);
        },
      },
      PretaxIncomeLoss: {
        type: GraphQLLong,
        description: '',

        resolve(financialStatement) {
          return handleNaN( financialStatement.PretaxIncomeLoss);
        },
      },
      IncomeTaxExpenseBenefitNet: {
        type: GraphQLLong,
        description: '',

        resolve(financialStatement) {
          const value = handleNaN(financialStatement.IncomeTaxExpenseBenefitNet);
          return timesNegativeOneIfExists(
            value
          );
        },
      },
      IncomeLossfromContinuingOperations: {
        type: GraphQLLong,
        description: '',

        resolve(financialStatement) {
          return handleNaN( financialStatement.IncomeLossfromContinuingOperations);
        },
      },
      NetExtraordinaryGainsLosses: {
        type: GraphQLLong,
        description: '',

        resolve(financialStatement) {
          return handleNaN( financialStatement.NetExtraordinaryGainsLosses);
        },
      },
      NetIncome: {
        type: GraphQLLong,
        description: '',

        resolve(financialStatement) {
          return handleNaN( financialStatement.NetIncome);
        },
      },
      NetIncomeCommon: {
        type: GraphQLLong,
        description: '',

        resolve(financialStatement) {
          return handleNaN( financialStatement.NetIncomeCommon);
        },
      },

      // Cashflow statement data

      NetIncomeStartingLine: {
        type: GraphQLLong,
        description: '',
        resolve(financialStatement) {
          return handleNaN( financialStatement.NetIncomeStartingLine);
        },
      },

      DepreciationAmortization: {
        type: GraphQLLong,
        description: '',
        resolve(financialStatement) {
          const value = handleNaN( financialStatement.DepreciationAmortization);
          return timesNegativeOneIfExists(value);
        },
      },
      NonCashItems: {
        type: GraphQLLong,
        description: '',
        resolve(financialStatement) {
          return handleNaN( financialStatement.NonCashItems);
        },
      },
      ChangeinWorkingCapital: {
        type: GraphQLLong,
        description: '',
        resolve(financialStatement) {
          return handleNaN( financialStatement.ChangeinWorkingCapital);
        },
      },
      ChangeinAccountsReceivable: {
        type: GraphQLLong,
        description: '',
        resolve(financialStatement) {
          return handleNaN(  financialStatement.ChangeinAccountsReceivable);
        },
      },
      ChangeinInventories: {
        type: GraphQLLong,
        description: '',
        resolve(financialStatement) {
          return handleNaN(  financialStatement.ChangeinInventories);
        },
      },
      ChangeinAccountsPayable: {
        type: GraphQLLong,
        description: '',
        resolve(financialStatement) {
          return handleNaN(  financialStatement.ChangeinAccountsPayable);
        },
      },
      ChangeinOther: {
        type: GraphQLLong,
        description: '',
        resolve(financialStatement) {
          return handleNaN(  financialStatement.ChangeinOther);
        },
      },
      NetCashfromOperatingActivities: {
        type: GraphQLLong,
        description: '',
        resolve(financialStatement) {
          return handleNaN(  financialStatement.NetCashfromOperatingActivities);
        },
      },
      ChangeinFixedAssetsIntangibles: {
        type: GraphQLLong,
        description: '',
        resolve(financialStatement) {
          return handleNaN(  financialStatement.ChangeinFixedAssetsIntangibles);
        },
      },
      NetChangeinLongTermInvestment: {
        type: GraphQLLong,
        description: '',
        resolve(financialStatement) {
          return handleNaN(  financialStatement.NetChangeinLongTermInvestment);
        },
      },
      NetCashfromAcquisitionsDivestitures: {
        type: GraphQLLong,
        description: '',
        resolve(financialStatement) {
          return handleNaN(  financialStatement.NetCashfromAcquisitionsDivestitures);
        },
      },
      NetCashfromInvestingActivities: {
        type: GraphQLLong,
        description: '',
        resolve(financialStatement) {
          return handleNaN(  financialStatement.NetCashfromInvestingActivities);
        },
      },
      DividendsPaid: {
        type: GraphQLLong,
        description: '',
        resolve(financialStatement) {
          const value = handleNaN(  financialStatement.DividendsPaid);
          return timesNegativeOneIfExists(value);
        },
      },
      CashfromRepaymentofDebt: {
        type: GraphQLLong,
        description: '',
        resolve(financialStatement) {
          return handleNaN(  financialStatement.CashfromRepaymentofDebt);
        },
      },
      CashfromRepurchaseofEquity: {
        type: GraphQLLong,
        description: '',
        resolve(financialStatement) {
          return handleNaN(  financialStatement.CashfromRepurchaseofEquity);
        },
      },
      NetCashfromFinancingActivities: {
        type: GraphQLLong,
        description: '',
        resolve(financialStatement) {
          return handleNaN(  financialStatement.NetCashfromFinancingActivities);
        },
      },
      NetChangeinCash: {
        type: GraphQLLong,
        description: '',
        resolve(financialStatement) {
          return handleNaN(  financialStatement.NetChangeinCash);
        },
      },

      Company: {
        type: Company,
        description: '',
        resolve(financialStatement) {
          return models.companies.findByPk(financialStatement.SimFinId);
        },
      },
    };
  },
});
