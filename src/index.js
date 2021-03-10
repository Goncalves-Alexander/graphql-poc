const { ApolloServer, PubSub } = require('apollo-server');
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const { getUserId } = require('./utils');
const Query = require('./resolvers/Query');
const Mutation = require('./resolvers/Mutation');
const User = require('./resolvers/User');
const Link = require('./resolvers/Link');
const Subscription = require('./resolvers/Subscription');
const Vote = require('./resolvers/Vote');

const prisma = new PrismaClient();
const pubsub = new PubSub();

// const typeDefs = `
//   type Query {
//     info: String!
//     feed: async (parent, args, context) => {
//       return context.prisma.link.findMany()
//     },
//   },
//   Mutation: {
//     post: (parent, args, context, info) => {
//       const newLink = context.prisma.link.create({
//         data: {
//           url: args.url,
//           description: args.description,
//         },
//       })
//       return newLink
//     },
//   },
// }
// `

const resolvers = {
  Query,
  Mutation,
  User,
  Link,
  Subscription,
  Vote,
}


const server = new ApolloServer({
  typeDefs: fs.readFileSync(
    path.join(__dirname, 'schema.graphql'),
    'utf8'
  ),
  resolvers,
  context: ({ req }) => {
    return {
      ...req,
      prisma,
      pubsub,
      userId:
        req && req.headers.authorization
          ? getUserId(req)
          : null
    };
  }
});

server
  .listen()
  .then(({ url }) =>
    console.log(`Server is running on ${url}`)
  );
