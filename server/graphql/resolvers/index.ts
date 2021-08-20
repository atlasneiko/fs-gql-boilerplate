/**
 * Exporting all resolvers
 */

import { UserMutations, UserQueries, UserSubscription } from "./user";
const rootResolver = {
  Query: {
    ...UserQueries,
    // Add other queries here
  },
  Mutation: {
    ...UserMutations,
    // Add other mutations here
  },
  Subscription: {
    ...UserSubscription,
    // Add other subscriptions here
  },
};
export default rootResolver;
