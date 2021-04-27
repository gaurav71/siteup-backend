import { queries, mutations, subscriptions } from "./resolvers";
import { subscriptionTypes } from "./subscriptionTypes";
import { schemaArray } from "./typedefs";

const typeDefs = schemaArray

const resolvers = {
  Query: {
    ...queries
  },
  Mutation: {
    ...mutations
  },
  Subscription: {
    ...subscriptions
  }
};

export {
  resolvers,
  typeDefs,
  subscriptionTypes
}