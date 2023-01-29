import { ApolloServer, gql } from 'apollo-server';

const mockTweet = [
  {
    id: 1,
    text: 'Hello World! oneUser!',
  },
  {
    id: 2,
    text: 'Hello World! twoUser!',
  },
];

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    firstName: String!
    lastName: String
  }
  type Tweet {
    id: ID!
    text: String!
    author: User
  }
  type Query {
    allTweets: [Tweet!]!
    tweet(id: ID!): Tweet
    ping: String!
  }
  type Mutation {
    postTweet(text: String!, userId: ID!): Tweet!
    deleteTweet(id: ID!): Boolean!
  }
`;

const resolvers = {
  Query: {
    allTweets() {
      return mockTweet;
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`Running a GraphQL API server at ${url}`);
});
