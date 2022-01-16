import {
  GraphQLID,
  GraphQLList,
  GraphQLString,
  GraphQLNonNull,
  GraphQLInt,
} from 'graphql';

import { Op } from 'sequelize';

import models from '../../../models/index.js';
import IncomeStatement from '../../types/incomeStatement.js';

export default {
  type: new GraphQLList(IncomeStatement),
  args: {
    SimFinId: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    FiscalYearStart: {
      type: GraphQLInt,
    },
    FiscalYearEnd: {
      type: GraphQLInt,
    },
  },
  resolve(root, args) {
    if (!args.FiscalYearStart) {
      args.FiscalYearStart = 1900;
    }

    if (!args.FiscalYearEnd) {
      args.FiscalYearEnd = 2200;
    }

    return models.income_statement.findAll({
      where: {
        SimFinId: args.SimFinId,
        FiscalYear: {
          [Op.gte]: args.FiscalYearStart,
          [Op.lte]: args.FiscalYearEnd,
        },
      },
    });
  },
};
