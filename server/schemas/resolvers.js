const { User } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');
const { findOneAndUpdate } = require('../models/User');

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id }).select(
          '-__v password'
        );

        return userData;
      }

      throw new AuthenticationError('Not logged in');
    },
  },
  Mutation: {
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);

      return { token, user };
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) throw new AuthenticationError('Incorrect creds');

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) throw new AuthenticationError('Incorrect creds');

      const token = signToken(user);
      return { token, user };
    },
    removeBook: async (parent, { bookId }, context) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          {
            $pull: {
              savedBooks: { bookId },
            },
          },
          { new: true }
        );

        return updatedUser;
      }
      throw new AuthenticationError('you need to be logged in for this');
    },
    saveBook: async (parent, args, context) => {
      if (context.user) {
        const updatedUser = await findOneAndUpdate(
          { _id: context.user._id },
          {
            $addToSet: { savedBooks: args },
          },
          { new: true, runValidators: true }
        );

        return updatedUser;
      }

      throw new AuthenticationError('you need to be logged in for this');
    },
  },
};

module.exports = resolvers;