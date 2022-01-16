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
  name: 'incomeStatement',
  description: 'incomeStatement',
  fields() {
    return {
      SimFinId: {
        type: GraphQLInt,
        description: '',
        resolve(incomeStatement) {
          return incomeStatement.SimFinId;
        },
      },
      Ticker: {
        type: GraphQLString,
        description: '',
        resolve(incomeStatement) {
          return incomeStatement.Ticker;
        },
      },
      FiscalYear: {
        type: GraphQLInt,
        description: '',
        resolve(incomeStatement) {
          return incomeStatement.FiscalYear;
        },
      },
      ReportDate: {
        type: GraphQLString,
        description: '',
        resolve(incomeStatement) {
          return incomeStatement.ReportDate;
        },
      },
      SharesBasic: {
        type: GraphQLLong,
        description: '',
        resolve(incomeStatement) {
          return incomeStatement.SharesBasic;
        },
      },
      SharesDiluted: {
        type: GraphQLLong,
        description: '',
        resolve(incomeStatement) {
          return incomeStatement.SharesDiluted;
        },
      },
      Revenue: {
        type: GraphQLLong,
        description: '',
        resolve(incomeStatement) {
          return handleNaN(incomeStatement.Revenue);
        },
      },
      CostofRevenue: {
        type: GraphQLLong,
        description: '',
        resolve(incomeStatement) {
          return timesNegativeOneIfExists(incomeStatement.CostofRevenue);
        },
      },
      GrossProfit: {
        type: GraphQLLong,
        description: '',
        resolve(incomeStatement) {
          return handleNaN(incomeStatement.GrossProfit);
        },
      },
      OperatingExpenses: {
        type: GraphQLLong,
        description: '',
        resolve(incomeStatement) {
          return timesNegativeOneIfExists(incomeStatement.OperatingExpenses);
        },
      },
      SellingGeneralAdministrative: {
        type: GraphQLLong,
        description: '',
        resolve(incomeStatement) {
          return timesNegativeOneIfExists(incomeStatement.SellingGeneralAdministrative);
        },
      },
      ResearchDevelopment: {
        type: GraphQLLong,
        description: '',
        resolve(incomeStatement) {
          return timesNegativeOneIfExists(incomeStatement.ResearchDevelopment);
        },
      },
      DepreciationAmortization: {
        type: GraphQLLong,
        description: '',
        resolve(incomeStatement) {
          return timesNegativeOneIfExists(incomeStatement.DepreciationAmortization);
        },
      },
      OperatingIncomeLoss: {
        type: GraphQLLong,
        description: '',
        resolve(incomeStatement) {
          return handleNaN(incomeStatement.OperatingIncomeLoss);
        },
      },
      NonOperatingIncomeLoss: {
        type: GraphQLLong,
        description: '',
        resolve(incomeStatement) {
          return handleNaN(incomeStatement.NonOperatingIncomeLoss);
        },
      },
      InterestExpenseNet: {
        type: GraphQLLong,
        description: '',
        resolve(incomeStatement) {
          return timesNegativeOneIfExists(incomeStatement.InterestExpenseNet);
        },
      },
      PretaxIncomeLossAdj: {
        type: GraphQLLong,
        description: '',
        resolve(incomeStatement) {
          return handleNaN(incomeStatement.PretaxIncomeLossAdj);
        },
      },
      AbnormalGainsLosses: {
        type: GraphQLLong,
        description: '',
        resolve(incomeStatement) {
          return handleNaN(incomeStatement.AbnormalGainsLosses);
        },
      },
      PretaxIncomeLoss: {
        type: GraphQLLong,
        description: '',
        resolve(incomeStatement) {
          return handleNaN(incomeStatement.PretaxIncomeLoss);
        },
      },
      IncomeTaxExpenseBenefitNet: {
        type: GraphQLLong,
        description: '',
        resolve(incomeStatement) {
          return timesNegativeOneIfExists(incomeStatement.IncomeTaxExpenseBenefitNet);
        },
      },
      IncomeLossfromContinuingOperations: {
        type: GraphQLLong,
        description: '',
        resolve(incomeStatement) {
          return handleNaN(incomeStatement.IncomeLossfromContinuingOperations);
        },
      },
      NetExtraordinaryGainsLosses: {
        type: GraphQLLong,
        description: '',
        resolve(incomeStatement) {
          return handleNaN(incomeStatement.NetExtraordinaryGainsLosses);
        },
      },
      NetIncome: {
        type: GraphQLLong,
        description: '',
        resolve(incomeStatement) {
          return handleNaN(incomeStatement.NetIncome);
        },
      },
      NetIncomeCommon: {
        type: GraphQLLong,
        description: '',
        resolve(incomeStatement) {
          return handleNaN(incomeStatement.NetIncomeCommon);
        },
      },
      Company: {
        type: Company,
        description: '',
        resolve(incomeStatement) {
          return models.companies.findByPk(incomeStatement.SimFinId);
        },
      },
    };
  },
});
