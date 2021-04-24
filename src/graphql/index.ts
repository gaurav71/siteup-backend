import { queries, mutations } from "./resolvers";
import { schemaArray } from "./typedefs";

export const typeDefs = schemaArray

export const resolvers = {
  Query: {
    ...queries
  },
  Mutation: {
    ...mutations
  }
};