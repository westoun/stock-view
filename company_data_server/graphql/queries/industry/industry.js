import {
    GraphQLID,
    GraphQLString,
    GraphQLNonNull,
    GraphQLInt
  } from 'graphql';
  
  import models from '../../../models/index.js';
  import Industry from '../../types/industry.js';
  
  export default {
      type: Industry,
      args: {
          IndustryId: {
              type: new GraphQLNonNull(GraphQLInt)
          }
      },
      resolve(root, args) {
          return models.industries.findByPk(args.IndustryId);
      }
  };
  