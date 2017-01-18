const pg = require('pg');
const co = require('co');
const crypto = require('crypto');
const account = require('./dbconfig');

const conString = `tcp://${account.user}:${account.password}@localhost:5432/${account.database}`;

const client = new pg.Client(conString);
client.connect();

const createUsers = () => new Promise((resolve, reject) => {
  client.query( 
    `CREATE TABLE users (
    U_id   bigserial primary key not null,
    U_name varchar(50) ,
    U_pwd  varchar(100),
    U_gitId varchar(30),
    u_gitName varchar(20),
    u_googleId varchar(30),
    u_googleName varchar(20)
  );`,
    (err, result) => {
      if (err) return reject(err);
      resolve();
    }
  )
});

const createDocuments = () => new Promise((resolve, reject) => {
  client.query( 
    `CREATE TABLE documents (
    D_hash varchar(80) primary key not null,
    D_dir  varchar(100) not null,
    D_size bigint not null
  );`,
    (err, result) => {
      if (err) return reject(err);
      resolve();
    }
  )
});

const createU_D = () => new Promise((resolve, reject) => {
  client.query( 
    `CREATE TABLE u_d (
    key     bigserial primary key not null,
    U_id    int not null,
    D_hash  varchar(80) ,
    isdir   boolean not null,
    path    varchar(100) not null,
    name    varchar(50) not null,
    createtime timestamp not null,
    lasttime timestamp not null
  );`,
    (err, result) => {
      if (err) return reject(err);
      resolve();
    }
  )
});

const createShare = () => new Promise((resolve, reject) => {
  client.query( 
    `CREATE TABLE share (
    addr    char(10) not null,
    secret  char(6) ,
    U_id    int not null,
    key     bigint not null,
    D_hash  varchar(80) ,
    D_dir   varchar(100),
    isdir   boolean not null,
    path    varchar(100) not null,
    name    varchar(50) not null
  );`,
    (err, result) => {
      if (err) return reject(err);
      resolve();
    }
  )
});

const createTestUser = () => new Promise((resolve, reject) => {
  const hash = crypto.createHash('sha1');
  hash.update('test');
  const values = ['test', hash.digest('hex')];
  const query = client.query( 
    `insert into users ( u_name, u_pwd ) values ( $1, $2 );`,
    values,
    (err, result) => {
      if (err) return reject(err);
      resolve();
    }
  )
});


const dbInit = function *() {
  yield createUsers();
  yield createU_D();
  yield createDocuments();
  yield createShare();
  yield createTestUser();
  client.end();
}

co(dbInit).then(() => console.log("Database init successfully!"))
          .catch(err => {console.log(err); client.end()});






