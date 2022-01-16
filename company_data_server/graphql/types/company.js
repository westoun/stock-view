import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLNonNull,
  GraphQLBoolean,
  GraphQLInt,
  GraphQLList,
} from 'graphql';

import models from '../../models/index.js';

import Industry from './industry';
import IncomeStatement from './incomeStatement';
import BalanceSheet from './balanceSheet';
import CashflowStatement from './cashflowStatement';
import FinancialStatement from './financialStatement';

export default new GraphQLObjectType({
  name: 'company',
  description: 'company',
  fields() {
    return {
      Ticker: {
        type: GraphQLString,
        description: '',
        resolve(company) {
          return company.Ticker;
        },
      },
      CompanyName: {
        type: GraphQLString,
        description: '',
        resolve(company) {
          return company.CompanyName;
        },
      },

      IndustryId: {
        type: GraphQLInt,
        description: '',
        resolve(company) {
          return company.IndustryId;
        },
      },
      SimFinId: {
        type: GraphQLInt,
        description: '',
        resolve(company) {
          return company.SimFinId;
        },
      },
      Industry: {
        type: Industry,
        description: '',
        resolve(company) {
          return models.industries.findByPk(company.IndustryId);
        },
      },
      IncomeStatements: {
        type: new GraphQLList(IncomeStatement),
        description: '',
        resolve(company) {
          return models.income_statement.findAll({
            where: {
              SimFinId: company.SimFinId,
            }, 
          });
        },
      },
      BalanceSheets: {
        type: new GraphQLList(BalanceSheet),
        description: '',
        resolve(company) {
          return models.balance_sheet.findAll({
            where: {
              SimFinId: company.SimFinId,
            }, 
          });
        },
      },
      CashflowStatements: {
        type: new GraphQLList(CashflowStatement),
        description: '',
        resolve(company) {
          return models.cashflow_statement.findAll({
            where: {
              SimFinId: company.SimFinId,
            }, 
          });
        },
      },
      FinancialStatements: {
        type: new GraphQLList(FinancialStatement),
        description: '',
        resolve(company) {
          return models.financial_statement.findAll({
            where: {
              SimFinId: company.SimFinId,
            }, 
          });
        },
      },
    };
  },
});
