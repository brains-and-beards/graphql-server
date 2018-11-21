const { GraphQLServer } = require('graphql-yoga');
const { Prisma } = require('prisma-binding');

const resolvers = {
  Query: {
    dogName: () => `Tommy the chihuahua`,
    dogs: (root, args, context, queryInfo) => {
      return context.db.query.dogs({}, queryInfo);
    }
  },
  Mutation: {
    dog: (root, args, context, queryInfo) => {
      return context.db.mutation.createDog(
        {
          data: {
            type: args.type,
            name: args.name
          }
        },
        queryInfo
      );
    }
  }
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
server.start(() => console.log(`Server address: http://localhost:4000`));
