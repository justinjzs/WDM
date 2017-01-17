const koa = require('koa');
const mount = require('koa-mount'); // koa-mount@1.x
const graphqlHTTP = require('koa-graphql');
const { buildSchema } = require('graphql');

const schema = buildSchema(`
  type Query {
    hello: String
  }
`);

const root = { 
  hello: (a, b, c) => {
    console.log(a, b, c); 
    return 'Hello world!'}
 };

const app = koa();

app.use(mount('/graphql', graphqlHTTP({
  schema,
  rootValue: root,
  graphiql: true
})));

app.listen(4000);