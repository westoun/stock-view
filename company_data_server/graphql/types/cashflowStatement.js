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
    name: 'cashflowStatement',
    description: 'cashflowStatement',
    fields() {
      return {
        SimFinId: {
          type: GraphQLInt,
          description: '',
          resolve(cashflowStatement) {
            return cashflowStatement.SimFinId;
          },
        },
        Ticker: {
          type: GraphQLString,
          description: '',
          resolve(cashflowStatement) {
            return cashflowStatement.Ticker;
          },
        },
        FiscalYear: {
          type: GraphQLInt,
          description: '',
          resolve(cashflowStatement) {
            return cashflowStatement.FiscalYear;
          },
        },
        ReportDate: {
          type: GraphQLString,
          description: '',
          resolve(cashflowStatement) {
            return cashflowStatement.ReportDate;
          },
        },
        SharesBasic: {
          type: GraphQLLong,
          description: '',
          resolve(cashflowStatement) {
            return cashflowStatement.SharesBasic;
          },
        },
        SharesDiluted: {
          type: GraphQLLong,
          description: '',
          resolve(cashflowStatement) {
            return cashflowStatement.SharesDiluted;
          },
        },



        
        NetIncomeStartingLine: {
          type: GraphQLLong,
          description: '',
          resolve(cashflowStatement) {
            return handleNaN(cashflowStatement.NetIncomeStartingLine);
          },
        },

        DepreciationAmortization: {
          type: GraphQLLong,
          description: '',
          resolve(cashflowStatement) {
            return timesNegativeOneIfExists(cashflowStatement.DepreciationAmortization);
          },
        },
        NonCashItems: {
          type: GraphQLLong,
          description: '',
          resolve(cashflowStatement) {
            return handleNaN(cashflowStatement.NonCashItems);
          },
        },
        ChangeinWorkingCapital: {
          type: GraphQLLong,
          description: '',
          resolve(cashflowStatement) {
            return handleNaN(cashflowStatement.ChangeinWorkingCapital);
          },
        },
        ChangeinAccountsReceivable: {
          type: GraphQLLong,
          description: '',
          resolve(cashflowStatement) {
            return handleNaN(cashflowStatement.ChangeinAccountsReceivable);
          },
        },
        ChangeinInventories: {
          type: GraphQLLong,
          description: '',
          resolve(cashflowStatement) {
            return handleNaN(cashflowStatement.ChangeinInventories);
          },
        },
        ChangeinAccountsPayable: {
          type: GraphQLLong,
          description: '',
          resolve(cashflowStatement) {
            return handleNaN(cashflowStatement.ChangeinAccountsPayable);
          },
        },
        ChangeinOther: {
          type: GraphQLLong,
          description: '',
          resolve(cashflowStatement) {
            return handleNaN(cashflowStatement.ChangeinOther);
          },
        },
        NetCashfromOperatingActivities: {
          type: GraphQLLong,
          description: '',
          resolve(cashflowStatement) {
            return handleNaN(cashflowStatement.NetCashfromOperatingActivities);
          },
        },
        ChangeinFixedAssetsIntangibles: {
          type: GraphQLLong,
          description: '',
          resolve(cashflowStatement) {
            return handleNaN(cashflowStatement.ChangeinFixedAssetsIntangibles);
          },
        },
        NetChangeinLongTermInvestment: {
          type: GraphQLLong,
          description: '',
          resolve(cashflowStatement) {
            return handleNaN(cashflowStatement.NetChangeinLongTermInvestment);
          },
        },
        NetCashfromAcquisitionsDivestitures: {
          type: GraphQLLong,
          description: '',
          resolve(cashflowStatement) {
            return handleNaN(cashflowStatement.NetCashfromAcquisitionsDivestitures);
          },
        },
        NetCashfromInvestingActivities: {
          type: GraphQLLong,
          description: '',
          resolve(cashflowStatement) {
            return handleNaN(cashflowStatement.NetCashfromInvestingActivities);
          },
        },
        DividendsPaid: {
          type: GraphQLLong,
          description: '',
          resolve(cashflowStatement) {
            return timesNegativeOneIfExists(cashflowStatement.DividendsPaid);
          },
        },
        CashfromRepaymentofDebt: {
          type: GraphQLLong,
          description: '',
          resolve(cashflowStatement) {
            return handleNaN(cashflowStatement.CashfromRepaymentofDebt);
          },
        },
        CashfromRepurchaseofEquity: {
          type: GraphQLLong,
          description: '',
          resolve(cashflowStatement) {
            return handleNaN(cashflowStatement.CashfromRepurchaseofEquity);
          },
        },
        NetCashfromFinancingActivities: {
          type: GraphQLLong,
          description: '',
          resolve(cashflowStatement) {
            return handleNaN(cashflowStatement.NetCashfromFinancingActivities);
          },
        },
        NetChangeinCash: {
          type: GraphQLLong,
          description: '',
          resolve(cashflowStatement) {
            return handleNaN(cashflowStatement.NetChangeinCash);
          },
        },
  
        Company: {
          type: Company,
          description: '',
          resolve(CashflowStatement) {
            return models.companies.findByPk(CashflowStatement.SimFinId);
          },
        },
      };
    },
  });
  