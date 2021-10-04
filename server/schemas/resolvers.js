const { signToken } = require('../utils/auth');

// note: book is part of user like reaction is part of thoughts
const { User } = require('../models');
const { AuthenticationError } = require('apollo-server-errors');

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id })
          .select('__v -password')
          .populate('books');
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
  },
};

module.exports = resolvers;
