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

function handleNaN(numberValue) {
  if (!numberValue) {
    return 0;
  }
  return numberValue;
}

export default new GraphQLObjectType({
  name: 'balanceSheet',
  description: 'balanceSheet',
  fields() {
    return {
      SimFinId: {
        type: GraphQLInt,
        description: '',
        resolve(balanceSheet) {
          return balanceSheet.SimFinId;
        },
      },
      Ticker: {
        type: GraphQLString,
        description: '',
        resolve(balanceSheet) {
          return balanceSheet.Ticker;
        },
      },
      FiscalYear: {
        type: GraphQLInt,
        description: '',
        resolve(balanceSheet) {
          return balanceSheet.FiscalYear;
        },
      },
      ReportDate: {
        type: GraphQLString,
        description: '',
        resolve(balanceSheet) {
          return balanceSheet.ReportDate;
        },
      },
      SharesBasic: {
        type: GraphQLLong,
        description: '',
        resolve(balanceSheet) {
          return balanceSheet.SharesBasic;
        },
      },
      SharesDiluted: {
        type: GraphQLLong,
        description: '',
        resolve(balanceSheet) {
          return balanceSheet.SharesDiluted;
        },
      },

      CashCashEquivalentsShortTermInvestments: {
        type: GraphQLLong,
        description: '',
        resolve(balanceSheet) {
          return handleNaN(balanceSheet.CashCashEquivalentsShortTermInvestments);
        },
      },
      AccountsNotesReceivable: {
        type: GraphQLLong,
        description: '',
        resolve(balanceSheet) {
          return handleNaN(balanceSheet.AccountsNotesReceivable);
        },
      },
      Inventories: {
        type: GraphQLLong,
        description: '',
        resolve(balanceSheet) {
          return handleNaN(balanceSheet.Inventories);
        },
      },
      TotalCurrentAssets: {
        type: GraphQLLong,
        description: '',
        resolve(balanceSheet) {
          return handleNaN(balanceSheet.TotalCurrentAssets);
        },
      },
      PropertyPlantEquipmentNet: {
        type: GraphQLLong,
        description: '',
        resolve(balanceSheet) {
          return handleNaN(balanceSheet.PropertyPlantEquipmentNet);
        },
      },
      LongTermInvestmentsReceivables: {
        type: GraphQLLong,
        description: '',
        resolve(balanceSheet) {
          return handleNaN(balanceSheet.LongTermInvestmentsReceivables);
        },
      },
      OtherLongTermAssets: {
        type: GraphQLLong,
        description: '',
        resolve(balanceSheet) {
          return handleNaN(balanceSheet.OtherLongTermAssets);
        },
      },
      TotalNoncurrentAssets: {
        type: GraphQLLong,
        description: '',
        resolve(balanceSheet) {
          return handleNaN(balanceSheet.TotalNoncurrentAssets);
        },
      },
      TotalAssets: {
        type: GraphQLLong,
        description: '',
        resolve(balanceSheet) {
          return handleNaN(balanceSheet.TotalAssets
          );
        },
      },
      PayablesAccruals: {
        type: GraphQLLong,
        description: '',
        resolve(balanceSheet) {
          return handleNaN(balanceSheet.PayablesAccruals);
        },
      },
      ShortTermDebt: {
        type: GraphQLLong,
        description: '',
        resolve(balanceSheet) {
          return handleNaN(balanceSheet.ShortTermDebt);
        },
      },
      TotalCurrentLiabilities: {
        type: GraphQLLong,
        description: '',
        resolve(balanceSheet) {
          return handleNaN(balanceSheet.TotalCurrentLiabilities);
        },
      },
      LongTermDebt: {
        type: GraphQLLong,
        description: '',
        resolve(balanceSheet) {
          return handleNaN(balanceSheet.LongTermDebt);
        },
      },
      TotalNoncurrentLiabilities: {
        type: GraphQLLong,
        description: '',
        resolve(balanceSheet) {
          return handleNaN(balanceSheet.TotalNoncurrentLiabilities);
        },
      },
      TotalLiabilities: {
        type: GraphQLLong,
        description: '',
        resolve(balanceSheet) {
          return handleNaN(balanceSheet.TotalLiabilities);
        },
      },
      ShareCapitalAdditionalPaidInCapital: {
        type: GraphQLLong,
        description: '',
        resolve(balanceSheet) {
          return handleNaN(balanceSheet.ShareCapitalAdditionalPaidInCapital);
        },
      },
      TreasuryStock: {
        type: GraphQLLong,
        description: '',
        resolve(balanceSheet) {
          return handleNaN(balanceSheet.TreasuryStock);
        },
      },
      RetainedEarnings: {
        type: GraphQLLong,
        description: '',
        resolve(balanceSheet) {
          return handleNaN(balanceSheet.RetainedEarnings);
        },
      },
      TotalEquity: {
        type: GraphQLLong,
        description: '',
        resolve(balanceSheet) {
          return handleNaN(balanceSheet.TotalEquity);
        },
      },
      TotalLiabilitiesEquity: {
        type: GraphQLLong,
        description: '',
        resolve(balanceSheet) {
          return handleNaN(balanceSheet.TotalLiabilitiesEquity);
        },
      },

      Company: {
        type: Company,
        description: '',
        resolve(balanceSheet) {
          return models.companies.findByPk(balanceSheet.SimFinId);
        },
      },
    };
  },
});
