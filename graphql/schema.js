const fetch = require('node-fetch');
const { 
  GraphQLSchema,
  GraphQLList,
  GraphQLString,
  GraphQLObjectType,
  GraphQLBoolean,
  GraphQLInt,
 } = require('graphql')


const init = cookie => ({
  method: 'GET',
  headers: {
    'Content-Type': "application/json",
    'Cookie': cookie
  }
})

let cookie;

const BASE_URL = 'http://localhost:3000';

const fetchByUrl = relativeurl => 
  fetch(`${BASE_URL}${relativeurl}`, init(cookie))
    .then(res => res.json());

const fetchAll = () => fetchByUrl('/homeinfo');


const QueryType = new GraphQLObjectType({
  name: 'Query',
  description: 'query the file info',
  fields: () => ({
    all: {
      type: new GraphQLList( EntryType ),
      description: 'all files info',
      resolve: (root, args, ctx) => {
        cookie = ctx.req.headers.cookie;
        return fetchAll();
      }
    },
    entry: {
      type: EntryType,
      description: 'info of specified file',
      args: {
        key: { type: GraphQLInt }
      },
      resolve: (root, args, ctx) => {
        cookie = ctx.req.headers.cookie;
        return fetchByUrl(`/homeinfo?key=${args.key}`)
      }
    }
  })
}) 

const EntryType = new GraphQLObjectType({
  name: 'Entry',
  description: 'an entry (folder or file) in the WDM',
  fields: () => ({
    key: {
      type: GraphQLInt,
      description: 'the key of the entry',
    },
    name: {
      type: GraphQLString,
      description: 'the name of the entry'
    },
    path:{
      type: GraphQLString,
      description: 'the path of the entry',
    },

  })
})



const schema = new GraphQLSchema({
  query: QueryType
});

module.exports = schema;

/**
 * interface Entry {
 *  key: Number!,
 *  path: String!,
 *  name: String!,
 *  createTime: String!
 *  lastTime: String!
 * }
 * 
 * type File : Entry {
 *  key: Number!,
 *  path: String!,
 *  name: String!,
 *  d-size: Number!,
 *  createTime: String!
 *  lastTime: String!
 * }
 * 
 * type Folder : Entry {
 *  key: Number!,
 *  path: String!,
 *  name: String!,
 *  createTime: String!
 *  contain: [Number],
 *  lastTime: String!
 * }
 * 
 * type Query {
 *  Entry(key: Number): Entry
 * }
 */

