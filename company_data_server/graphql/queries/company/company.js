import { GraphQLID, GraphQLString, GraphQLNonNull, GraphQLInt } from 'graphql';

import models from '../../../models/index.js';
import Company from '../../types/company.js';

export default {
  type: Company,
  args: {
    SimFinId: {
      type: new GraphQLNonNull(GraphQLInt),
    },
  },
  resolve(root, args) {
    return models.companies.findByPk(args.SimFinId);
  },
};
