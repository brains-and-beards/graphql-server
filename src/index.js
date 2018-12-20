const { GraphQLServer } = require('graphql-yoga');
const { Prisma } = require('prisma-binding');
const Mutation = require('./Mutations');

const resolvers = {
  Query: {
    dogName: () => `Tommy the chihuahua`,
    dogs: (root, args, context, queryInfo) => {
      return context.db.query.dogs({}, queryInfo);
    },
    user: (root, args, context, info) => {
      return context.db.query.user({ where: { id: root.user.id } }, info);
    }
  },
  Mutation
};

const server = new GraphQLServer({
  typeDefs: 'src/schema.graphql',
  resolvers,
  context: req => ({
    ...req,
    db: new Prisma({
      typeDefs: 'src/generated/prisma.graphql',
      endpoint: 'https://eu1.prisma.sh/natalia-majkowska/dogs-service/dev',
      secret: 'testsecret',
      debug: true
    })
  })
});

server.start({ port: process.env.PORT || 4000 }, () =>
  console.log(`Server address: http://localhost:4000`)
);
