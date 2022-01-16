import {
  GraphQLID,
  GraphQLList,
  GraphQLString,
  GraphQLNonNull,
  GraphQLInt,
} from 'graphql';

import models from '../../../models/index.js';
import IncomeStatement from '../../types/incomeStatement.js';

export default {
  type: new GraphQLList(IncomeStatement),
  args: {
    SimFinId: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    FiscalYear: {
      type: new GraphQLNonNull(GraphQLInt),
    },
  },
  resolve(root, args) {
    return models.income_statement.findAll({
      where: {
        SimFinId: args.SimFinId,
        FiscalYear: args.FiscalYear,
      },
    });
  },
};
