const pg = require('pg');


const config = {
  user: 'jin', //env var: PGUSER
  database: 'wdm', //env var: PGDATABASE
  password: 'jinzis', //env var: PGPASSWORD
  host: 'localhost', // Server hosting the postgres database
  port: 5432, //env var: PGPORT
  max: 3, // max number of clients in the pool
  idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
};

const dbquery = pool => function(text, values, cb) {
  pool.connect(function(err, client, done) {
  if(err) {
    return console.error('error fetching client from pool', err);
  }
  client.query(text, values, function(err, result) {
    done();
    cb(err, result);
  });
});
  pool.on('error', function (err, client) {
  console.error('idle client error', err.message, err.stack)
  })
}


module.exports = {
  middleware: function* (next) { //middleware
    const pool = new pg.Pool(config);
    this.dbquery = dbquery(pool);
    yield next;
  },
  query: () => (dbquery(new pg.Pool(config))) //function
}




