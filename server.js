import { ApolloServer, gql } from 'apollo-server';
import fetch from 'node-fetch';

let mockTweets = [
  {
    id: '1',
    text: 'Hello World! oneUser!',
    userId: '2',
  },
  {
    id: '2',
    text: 'Hello World! twoUser!',
    userId: '1',
  },
];

let mockUsers = [
  {
    id: '1',
    firstName: 'Jung',
    lastName: 'Sany',
  },
  {
    id: '2',
    firstName: 'Yoon',
    lastName: 'Sora',
  },
];

const typeDefs = gql`
  type User {
    id: ID!
    firstName: String!
    lastName: String!
    """
    Is the sum of firstName + lastName as a string
    """
    fullName: String!
  }
  """
  Tweet object represents a resource for a Tweet
  """
  type Tweet {
    id: ID!
    text: String!
    author: User
  }
  type Query {
    allMovies: [Movie!]!
    allUsers: [User!]!
    allTweets: [Tweet!]!
    tweet(id: ID!): Tweet
    movie(id: string!): Movie
  }
  type Mutation {
    postTweet(text: String!, userId: ID!): Tweet!
    """
    Deletes a Tweet if found, else returns false.
    """
    deleteTweet(id: ID!): Boolean!
  }
  type Movie {
    id: Int!
    url: String!
    imdb_code: String!
    title: String!
    title_english: String!
    title_long: String!
    slug: String!
    year: Int!
    rating: Float!
    runtime: Float!
    genres: [String]!
    summary: String
    description_full: String!
    synopsis: String
    yt_trailer_code: String!
    language: String!
    background_image: String!
    background_image_original: String!
    small_cover_image: String!
    medium_cover_image: String!
    large_cover_image: String!
  }
`;

const resolvers = {
  Query: {
    allTweets() {
      return mockTweets;
    },
    tweet(root, { id }) {
      return mockTweets.find((tweet) => tweet.id === id);
    },
    allUsers() {
      return mockUsers;
    },
    allMovies() {
      return fetch(`https://yts.mx/api/v2/list_movies.json`)
        .then((res) => res.json())
        .then((json) => json.data.movies);
    },
    movie(_, { id }) {
      return fetch(`https://yts.mx/api/v2/list_movies.json?movie_id=${id}`)
        .then((res) => res.json())
        .then((json) => json.data.movie);
    },
  },
  Mutation: {
    postTweet(root, { text, userId }) {
      const newTweet = {
        id: mockTweets.length + 1,
        text,
      };

      mockTweets.push(newTweet);

      return newTweet;
    },
    deleteTweet(root, { id }) {
      const tweet = mockTweets.find((tweet) => tweet.id === id);

      if (!tweet) return false;

      mockTweets = mockTweets.filter((tweet) => tweet.id !== id);

      return true;
    },
  },
  User: {
    firstName({ firstName }) {
      return firstName;
    },
    fullName({ firstName, lastName }) {
      return `${firstName} ${lastName}`;
    },
  },
  Tweet: {
    author({ userId }) {
      return mockUsers.find((user) => user.id === userId);
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`Running a GraphQL API server at ${url}`);
});
