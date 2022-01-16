import {
    GraphQLID,
    GraphQLList,
    GraphQLString,
    GraphQLNonNull,
    GraphQLInt,
  } from 'graphql';
  
  import models from '../../../models/index.js';
  import BalanceSheet from '../../types/balanceSheet';
  
  export default {
    type: new GraphQLList(BalanceSheet),
    args: {
      SimFinId: {
        type: new GraphQLNonNull(GraphQLInt),
      },
      FiscalYear: {
        type: new GraphQLNonNull(GraphQLInt),
      },
    },
    resolve(root, args) {
      return models.balance_sheet.findAll({
        where: {
          SimFinId: args.SimFinId,
          FiscalYear: args.FiscalYear,
        },
      });
    },
  };
  