import { GraphQLList, GraphQLID, GraphQLString, GraphQLInt } from 'graphql';
import { Op } from 'sequelize';

import models from '../../../models/index.js';
import Company from '../../types/company.js';

export default {
  type: new GraphQLList(Company),
  args: {
    IndustryId: {
      type: GraphQLInt,
    },
    SearchString: {
      type: GraphQLString,
    },
  },
  resolve(root, args) {
    if (args.SearchString && args.IndustryId) {
      return models.companies.findAll({
        where: {
          IndustryId: args.IndustryId,
          [Op.or]: [
            {
              CompanyName: {
                [Op.iLike]: `%${args.SearchString}%`,
              },
            },
            {
              Ticker: {
                [Op.iLike]: `%${args.SearchString}%`,
              },
            },
          ],
        },
      });
    } else if (args.IndustryId) {
      return models.companies.findAll({
        where: {
          IndustryId: args.IndustryId,
        },
      });
    } else if (args.SearchString) {
      return models.companies.findAll({
        where: {
          [Op.or]: [
            {
              CompanyName: {
                [Op.iLike]: `%${args.SearchString}%`,
              },
            },
            {
              Ticker: {
                [Op.iLike]: `%${args.SearchString}%`,
              },
            },
          ],
        },
      });
    }
    return models.companies.findAll();
  },
};
