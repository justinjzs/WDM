const pg = require('pg');

const config = {
  user: 'jin', //env var: PGUSER
  database: 'testdb', //env var: PGDATABASE
  password: 'jinzis', //env var: PGPASSWORD
  host: 'localhost', // Server hosting the postgres database
  port: 5432, //env var: PGPORT
  max: 3, // max number of clients in the pool
  idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
};


module.exports = function *(next) {
  if(this.pool) //this.poolw为空时
    this.pool = new pg.pool(config);
  yield next;
}