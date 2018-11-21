const { GraphQLServer } = require('graphql-yoga');

const typeDefs = `
type Query {
  dogName: String!
}
`;

const resolvers = {
  Query: {
    dogName: () => `Tommy the chihuahua`
  }
};

const server = new GraphQLServer({
  typeDefs,
  resolvers
});
server.start(() => console.log(`Server address: http://localhost:4000`));
