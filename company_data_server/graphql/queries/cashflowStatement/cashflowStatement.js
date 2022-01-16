import {
    GraphQLID,
    GraphQLList,
    GraphQLString,
    GraphQLNonNull,
    GraphQLInt,
  } from 'graphql';
  
  import models from '../../../models/index.js';
  import CashflowStatement from '../../types/cashflowStatement';
  
  export default {
    type: new GraphQLList(CashflowStatement),
    args: {
      SimFinId: {
        type: new GraphQLNonNull(GraphQLInt),
      },
      FiscalYear: {
        type: new GraphQLNonNull(GraphQLInt),
      },
    },
    resolve(root, args) {
      return models.cashflow_statement.findAll({
        where: {
          SimFinId: args.SimFinId,
          FiscalYear: args.FiscalYear,
        },
      });
    },
  };
  