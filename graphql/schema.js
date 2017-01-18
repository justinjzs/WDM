const fetch = require('node-fetch');
const query = require('./query');
const { 
  GraphQLSchema,
  GraphQLNonNull,
  GraphQLInterfaceType,
  GraphQLList,
  GraphQLString,
  GraphQLObjectType,
  GraphQLBoolean,
  GraphQLInt,
 } = require('graphql')

//mutation模型
const MutationType = new GraphQLObjectType({
  name: 'Mutation',
  description: 'mutate what you want',
  fields: () => ({
    mkdir: {
      type: folderType,
      description: 'create a new folder in specified dir',
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        path: { type: GraphQLString }
      },
      resolve: (root, { name, path = '/' }, ctx) => (
        query.pathIsExist(ctx.req.user, path)
          .then(() =>
            query.mkdir(ctx.req.user, name, path)
          )
      )
    }
  })
})
//查询模型
const QueryType = new GraphQLObjectType({
  name: 'Query',
  description: 'query the wdm info',
  fields: () => ({
    entityByPath: {
      type: new GraphQLList( entityInterface ),
      description: 'query entities in specified path',
      args: {
        path: { type: GraphQLString }
      },
      resolve: (root, { path = '/' }, ctx) => (
        query.pathIsExist(ctx.req.user, path)
          .then(() =>
            query.entityByPath(ctx.req.user, path)
          )
      )     
    },
    entityByKey: {
      type: entityInterface,
      description: 'query entity info by key',
      args: {
        key: { type: new GraphQLNonNull(GraphQLInt) }
      },
      resolve: (root, { key }, ctx) => query.entityByKey(ctx.req.user, key)
    },
    entityByName: {
      type: new GraphQLList(entityInterface),
      description: 'search entities by name',
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        path: { type: GraphQLString }
      },
      resolve: (root, { name, path = '/' }, ctx) => (
        query.pathIsExist(ctx.req.user, path)
          .then(() =>
            query.entityByName(ctx.req.user, name, path)
          )
      )
    }
  })
}) 
//实体接口模型
const entityInterface = new GraphQLInterfaceType({
  name: 'entity',
  description: 'an entity (folder or file) in the wdm',
  fields: () => ({
    key: {
      type: new GraphQLNonNull(GraphQLInt),
      description: 'the key of the entity',
    },
    name: {
      type: GraphQLString,
      description: 'the name of the entity'
    },
    path: {
      type: GraphQLString,
      description: 'the path of the entity',
    },
    isdir: {
      type: GraphQLBoolean,
      description: 'judge the entity is a file or a folder'
    },
    createTime: {
      type: GraphQLString,
      description: 'the upload time of a file or the create time of a folder'
    },
    lastTime: {
      type: GraphQLString,
      description: 'the last modified time'
    }

  }),
  resolveType(entity) {
    if(entity.isdir)
      return folderType;
    else
      return fileType;
  }
})
//文件模型
const fileType = new GraphQLObjectType({
  name: 'file',
  description: 'a file in the wdm',
  fields: () => ({
    key: {
      type: new GraphQLNonNull(GraphQLInt),
      description: 'the key of the file',
    },
    name: {
      type: GraphQLString,
      description: 'the name of the file'
    },
    path: {
      type: GraphQLString,
      description: 'the path of the file'
    },
    isdir: {
      type: GraphQLBoolean,
      description: 'should be false as this is a file not a folder'
    },
    size: {
      type: new GraphQLNonNull(GraphQLInt),
      description: 'the size of the file',
      resolve: file => file.d_size
    },
    createTime: {
      type: GraphQLString,
      description: 'the time of file that uploaded',
      resolve: file => file.createtime
    },
    lastTime: {
      type: GraphQLString,
      description: 'the time of file that modified at last',
      resolve: file => file.lasttime
    } 
  }),
  interfaces: [ entityInterface ]
});
//文件夹模型
const folderType = new GraphQLObjectType({
  name: 'folder',
  description: 'a folder in the wdm',
  fields: () => ({
    key: {
      type: new GraphQLNonNull(GraphQLInt),
      description: 'the key of the folder',
    },
    name: {
      type: GraphQLString,
      description: 'the name of the folder'
    },
    path: {
      type: GraphQLString,
      description: 'the path of the folder'
    },
    isdir: {
      type: GraphQLBoolean,
      description: 'should be true as this is a folder'
    },
    inside: {
      type: new GraphQLList(entityInterface),
      description: 'the entities in the folder',
      resolve: ({key, path}) => query.insideFolder(key, path)
    },
    createTime: {
      type: GraphQLString,
      description: 'the time of the folder created',
      resolve: folder => folder.createtime
    },
    lastTime: {
      type: GraphQLString,
      description: 'the time of the folder that modified at last',
      resolve: folder => folder.lasttime
    }
  }),
  interfaces: [ entityInterface ]
});

//schema
const schema = new GraphQLSchema({
  query: QueryType,
  mutation: MutationType,
  types: [ fileType, folderType ]
});

module.exports = schema;




/**
 * interface entity {
 *  key: Number!,
 *  path: String!,
 *  name: String!,
 *  createTime: String!
 *  lastTime: String!
 * }
 * 
 * type File : entity {
 *  key: Number!,
 *  path: String!,
 *  name: String!,
 *  d-size: Number!,
 *  createTime: String!
 *  lastTime: String!
 * }
 * 
 * type Folder : entity {
 *  key: Number!,
 *  path: String!,
 *  name: String!,
 *  createTime: String!
 *  contain: [Number],
 *  lastTime: String!
 * }
 * 
 * type Query {
 *  entity(key: Number): entity
 * }
 */

