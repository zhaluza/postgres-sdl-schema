const { makeExecutableSchema } = require('graphql-tools');
// TODO: remind readers to import their database connection as db

const db = require('../dbConnect');

const typeDefs = `
type Query {
    users: [User!]!
    user(id: String!): User!
    posts: [Post!]!
    post(id: String!): Post!
  }
  
  type Mutation {
    createUser(username: String!, password: String!): User!
    updateUser(username: String, password: String): User!
    deleteUser(id: String!): User!
  
    createPost(text: String!, author: String!): Post!
    updatePost(text: String, author: String): Post!
    deletePost(id: String!): Post!
  }
  
  type User {
    id: String!
    username: String!
    password: String!
    created_at: String!
  }
  
  type Post {
    id: String!
    text: String!
    author: User!
    posted_at: String!
  }
  
`;

const resolvers = {
  // In this format, resolvers are always named after the corresponding field from the schema definition
  Query: {
    /////// NOTES: ///////
    // 1. return "res.rows" for an iterable result
    // 2. return "res.rows[0]" for a single result
    users: () => {
      try {
        const query = `SELECT * FROM users`;
        return db.query(query).then((res) => res.rows);
      } catch (err) {
        throw new Error(err);
      }
    },
    user: (parent, args) => {
      try {
        const query = `SELECT * FROM users 
      WHERE id = $1`;
        const values = [args.id];
        return db.query(query, values).then((res) => res.rows[0]);
      } catch (err) {
        throw new Error(err);
      }
    },
    posts: () => {
      try {
        const query = `SELECT * FROM posts`;
        return db.query(query);
      } catch (err) {
        throw new Error(err);
      }
    },
    post: (parent, args) => {
      try {
        const query = `SELECT * FROM posts 
      WHERE id = $1`;
        const values = [args.id];
        return db.query(query, values);
      } catch (err) {
        throw new Error(err);
      }
    },
  },

  Mutation: {
    createUser: (parent, args) => {
      const query = `INSERT INTO users(username, password) 
      VALUES($1, $2)`;
      const values = [args.username, args.password];
      try {
        return db.query(query, values);
      } catch (err) {
        throw new Error(err);
      }
    },
    updateUser: (parent, args) => {
      try {
        const query = `UPDATE users 
        SET username=$1 password=$2
        WHERE id=$3`;
        const values = [args.username, args.password, args.id];
        return db.query(query, values);
      } catch (err) {
        throw new Error(err);
      }
    },
    deleteUser: (parent, args) => {
      try {
        const query = `DELETE FROM users
        WHERE id=$1`;
        const values = [args.id];
        return db.query(query, values);
      } catch (err) {
        throw new Error(err);
      }
    },

    createPost: (parent, args) => {
      try {
        const query = `INSERT INTO posts(text, author)
        VALUES($1, $2)`;
        const values = [args.text, args.author];
        return db.query(query, values).then((res) => res.rows[0]);
      } catch (err) {
        throw new Error(err);
      }
    },
    updatePost: (parent, args) => {
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
    deletePost: (parent, args) => {
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
};

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

module.exports = schema;
