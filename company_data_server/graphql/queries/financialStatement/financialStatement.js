import {
  GraphQLID,
  GraphQLList,
  GraphQLString,
  GraphQLNonNull,
  GraphQLInt,
} from 'graphql';

import { Op, col } from 'sequelize';

import models from '../../../models/index.js';
import FinancialStatement from '../../types/financialStatement';

export default {
  type: new GraphQLList(FinancialStatement),
  args: {
    SimFinId: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    FiscalYear: {
      type: new GraphQLNonNull(GraphQLInt),
    },
  },
  resolve(root, args) {
    return models.financial_statement.findAll({
      where: {
        SimFinId: args.SimFinId,
        FiscalYear: args.FiscalYear,
      },
    });
  },
};
