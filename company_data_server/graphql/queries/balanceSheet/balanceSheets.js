import {
  GraphQLID,
  GraphQLList,
  GraphQLString,
  GraphQLNonNull,
  GraphQLInt,
} from 'graphql';

import { Op } from 'sequelize';

import models from '../../../models/index.js';
import BalanceSheet from '../../types/balanceSheet';

export default {
  type: new GraphQLList(BalanceSheet),
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

    return models.balance_sheet.findAll({
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
