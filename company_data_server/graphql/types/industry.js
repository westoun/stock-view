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

import Company from './company';

export default new GraphQLObjectType({
  name: 'industry',
  description: 'industry',
  fields() {
    return {
      IndustryId: {
        type: GraphQLInt,
        description: '',
        resolve(industry) {
          return industry.IndustryId;
        },
      },
      Sector: {
        type: GraphQLString,
        description: '',
        resolve(industry) {
          return industry.Sector;
        },
      },
      Industry: {
        type: GraphQLString,
        description: '',
        resolve(industry) {
          return industry.Industry;
        },
      },
      Companies: {
        type: new GraphQLList(Company),
        description: '',
        resolve(industry) {
          return models.companies.findAll({
            where: {
              IndustryId: industry.IndustryId,
            },
          });
        },
      },
    };
  },
});
