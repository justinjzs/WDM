const query = require('./sharequery');
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


const QueryType = new GraphQLObjectType({
  name: 'query',
  description: 'query the files info in sharing',
  fields: () => ({
    secret: {
      type: GraphQLString,
      description: 'get the secret of specified share page',
      args: {
        addr: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve: (root, { addr }) => query.getSerect(addr)
    },
    auth: {
      type: GraphQLBoolean,
      description: 'auth the specified share page',
      args: {
        addr: { type: new GraphQLNonNull(GraphQLString) },
        secret: { type: GraphQLString }
      },
      resolve: (root, { addr, secret }) => query.auth(addr, secret)
    },
    entityByPath: {
      type: new GraphQLList(entityInterface),
      description: 'query entities in specified path',
      args: {
        path: { type: GraphQLString },
        addr: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve: (root, { addr, path = '/' }) => (
        query.pathIsExist(addr, path)
          .then(() => query.entityByPath(addr, path)
          )
      )
    },
    entityByKey: {
      type: entityInterface,
      description: 'query entity info by key',
      args: {
        addr: { type: new GraphQLNonNull(GraphQLString) },
        key: { type: new GraphQLNonNull(GraphQLInt) }
      },
      resolve: (root, { key, addr }) => query.entityByKey(addr, key)
    },
    allFolders: {
      type: new GraphQLList(folderType),
      description: 'query all folders in share page',
      args: {
        addr: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve: (root, { addr }) => (
        query.getAllFolders(addr)
      )
    }
  })
})


//实体接口模型
const entityInterface = new GraphQLInterfaceType({
  name: 'entity',
  description: 'an entity (folder or file) in share',
  fields: () => ({
    key: {
      type: new GraphQLNonNull(GraphQLInt),
      description: 'the key of the entity',
    },
    name: {
      type: GraphQLString,
      description: 'the name of the entity'
    },
    addr: {
      type: GraphQLString,
      description: 'the addr of the entity'
    },
    path: {
      type: GraphQLString,
      description: 'the path of the entity',
    },
    isdir: {
      type: GraphQLBoolean,
      description: 'judge the entity is a file or a folder'
    }

  }),
  resolveType(entity) {
    if (entity.isdir)
      return folderType;
    else
      return fileType;
  }
})
//文件模型
const fileType = new GraphQLObjectType({
  name: 'file',
  description: 'a file in share',
  fields: () => ({
    key: {
      type: new GraphQLNonNull(GraphQLInt),
      description: 'the key of the file',
    },
    name: {
      type: GraphQLString,
      description: 'the name of the file'
    },
    addr: {
      type: GraphQLString,
      description: 'the addr of the entity'
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
    }
  }),
  interfaces: [entityInterface]
});
//文件夹模型
const folderType = new GraphQLObjectType({
  name: 'folder',
  description: 'a folder in share',
  fields: () => ({
    key: {
      type: new GraphQLNonNull(GraphQLInt),
      description: 'the key of the folder',
    },
    name: {
      type: GraphQLString,
      description: 'the name of the folder'
    },
    addr: {
      type: GraphQLString,
      description: 'the addr of the entity'
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
      resolve: ({key, path, addr}) => query.insideFolder(key, path, addr)
    }
  }),
  interfaces: [entityInterface]
});


const schema = new GraphQLSchema({
  query: QueryType,
  types: [fileType, folderType]
});

module.exports = schema;