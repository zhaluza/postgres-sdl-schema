const {
  GraphQLObjectType,
  GraphQLString,
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

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addUser: {
      type: UserType,
      args: {
        username: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, args) {
        try {
          const query = `INSERT INTO users(username, password)
          VALUES($1, $2)`;
          const values = [args.username, args.password];
          return db.query(query, values).then((res) => res.rows[0]);
        } catch (err) {
          throw new Error(err);
        }
      },
    },
    updateUser: {
      type: UserType,
      args: {
        username: { type: GraphQLString },
        password: { type: GraphQLString },
      },
      resolve(parent, args) {
        try {
          const query = `UPDATE users
        SET username=$1 password=$2
        WHERE id=$3`;
          const values = [args.username, args.password, args.id];
          db.query(query, values).then((res) => res.rows[0]);
        } catch (err) {
          throw new Error(err);
        }
      },
    },
    deleteUser: {
      type: UserType,
      args: {
        username: { type: GraphQLString },
        password: { type: GraphQLString },
      },
      resolve(parent, args) {
        try {
          const query = `DELETE FROM users
          WHERE id=$1`;
          const values = [args.id];
          return db.query(query, values).then((res) => res.rows[0]);
        } catch (err) {
          throw new Error(err);
        }
      },
    },

    addPost: {
      type: PostType,
      args: {
        text: { type: new GraphQLNonNull(GraphQLString) },
        author: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, args) {
        try {
          const query = `INSERT INTO posts(text, author)
          VALUES($1, $2)`;
          const values = [args.text, args.author];
          return db.query(query, values).then((res) => res.rows[0]);
        } catch (err) {
          throw new Error(err);
        }
      },
    },
    updatePost: {
      type: PostType,
      args: {
        text: { type: GraphQLString },
        author: { type: GraphQLString },
      },
      resolve(parent, args) {
        try {
          const query = `UPDATE users
          SET text=$1 author=$2
          WHERE ID=$3`;
          const values = [args.text, args.author, args.id];
          return db.query(query, values).then((res) => res.rows[0]);
        } catch (err) {
          throw new Error(err);
        }
      },
    },
    deletePost: {
      type: PostType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, args) {
        try {
          const query = `DELETE FROM users
          WHERE id=$1`;
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
