const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLSchema,
  GraphQLNonNull,
} = require('graphql');
const db = require('../dbConnect');

// users table
const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLString },
    username: { type: GraphQLString },
    password: { type: GraphQLString },
    createdAt: { type: GraphQLString },
  }),
});

// posts table
const PostType = new GraphQLObjectType({
  name: 'Post',
  fields: () => ({
    id: { type: GraphQLString },
    text: { type: GraphQLString },
    author: {
      type: UserType,
      resolve(parent, args) {
        try {
          const query = `SELECT * FROM posts
        WHERE author=$1`;
          const values = [parent.id];
          return db.query(query, values).then((res) => res.rows[0]);
        } catch (err) {
          throw new Error(err);
        }
      },
    },
  }),
});

// Root Query
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    // GET all users
    users: {
      type: new GraphQLList(UserType),
      resolve() {
        try {
          const query = `SELECT * FROM users`;
          return db.query(query).then((res) => res.rows);
        } catch (err) {
          throw new Error(err);
        }
      },
    },
    // GET single user by id
    user: {
      type: UserType,
      args: {
        id: { type: GraphQLString },
      },
      resolve(parent, args) {
        try {
          const query = `SELECT * FROM users
          WHERE id = $1`;
          const values = [args.id];
          return db.query(query, values).then((res) => res.rows[0]);
        } catch (err) {
          throw new Error(err);
        }
      },
    },
    // GET all posts
    posts: {
      type: PostType,
      resolve() {
        try {
          const query = `SELECT * FROM posts`;
          return db.query(query).then((res) => res.rows);
        } catch (err) {
          throw new Error(err);
        }
      },
    },
    // GET single post by id
    post: {
      type: PostType,
      resolve(parent, args) {
        try {
          const query = `SELECT * FROM posts
          WHERE id = $1`;
          const values = [args.id];
          return db.query(query, values).then((res) => res.rows[0]);
        } catch (err) {
          throw new Error(err);
        }
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
