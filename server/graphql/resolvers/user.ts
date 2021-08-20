/**
 * File Containing all user queries, mutations and subscriptions
 */

import { PubSub } from "apollo-server";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import config from "../../../config";
import User from "../../models/user";
import { transformUser } from "./resolver.utils";
const pubsub = new PubSub();

const USER_ADDED = "USER_ADDED";

/**
 * USER QUERIES
 */

const UserQueries = {
  users: async (parent, args, context) => {
    try {
      const users = await User.find({});
      return users.map((user) => {
        return transformUser(user);
      });
    } catch (err) {
      throw err;
    }
  },
  user: async (parent, { userId }) => {
    try {
      const user = await User.findById(userId);
      return transformUser(user);
    } catch (err) {
      throw err;
    }
  },
  login: async (parent, { email, password }) => {
    try {
      const user: any = await User.findOne({ email, password });
      if (!user) {
        throw new Error("User does not Exists");
      }
      const token = jwt.sign({ userId: user.id }, config.JWT_SECRET, {
        expiresIn: "1h",
      });
      return {
        userId: user.id,
        token,
        tokenExpiration: 1,
      };
    } catch (err) {
      throw err;
    }
  },
};

/**
 * User Mutations
 */

const UserMutations = {
  createUser: async (parent: any, { userInput }: any) => {
    try {
      const user = await User.findOne({ email: userInput.email });
      if (user) {
        throw new Error("User already Exists");
      } else {
        const newUser = new User({
          _id: new mongoose.Types.ObjectId(),
          email: userInput.email,
          name: userInput.name,
          password: userInput.password,
        });
        const savedUser = await newUser.save();
        pubsub.publish(USER_ADDED, {
          userAdded: { userAdded: transformUser(savedUser) },
        });
        const token = jwt.sign({ userId: savedUser.id }, config.JWT_SECRET, {
          expiresIn: "1h",
        });
        return {
          userId: savedUser.id,
          token,
          tokenExpiration: 1,
        };
      }
    } catch (err) {
      throw err;
    }
  },
  updateUser: async (
    parent: any,
    { userId, updateUser }: any,
    context: any
  ) => {
    // If auth token is not valid
    if (!context.isAuth) {
      throw new Error("Not Authenticated");
    }
    try {
      const user = await User.findByIdAndUpdate(userId, updateUser, {
        new: true,
      });
      return transformUser(user);
    } catch (err) {
      throw err;
    }
  },
};

/**
 * User Subscriptions
 */

const UserSubscription = {
  userAdded: {
    subscribe: () => pubsub.asyncIterator([USER_ADDED]),
  },
};

export { UserQueries, UserMutations, UserSubscription };
