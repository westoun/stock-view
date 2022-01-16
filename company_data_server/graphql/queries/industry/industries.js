import { GraphQLList, GraphQLString, GraphQLID, GraphQLInt } from 'graphql';
import { Op } from 'sequelize';

import models from '../../../models/index.js';
import Industry from '../../types/industry.js';

export default {
  type: new GraphQLList(Industry),
  args: {
    SearchString: {
      type: GraphQLString,
    }
  },
  resolve(root, args) {
    if (args.SearchString) {
      return models.industries.findAll({
        where: {
          [Op.or]: [
            {
              Industry: {
                [Op.iLike]: `%${args.SearchString}%`
              }
            }, {
              Sector: {
                [Op.iLike]: `%${args.SearchString}%`
              }
            }
          ]
        }
      });
    }

    return models.industries.findAll();
  }
};
