//对数据库的后端操作

const pg = require('pg');
const conString = "tcp://jin:jinzis@localhost:5432/wdm";

 const client = new pg.Client(conString);
 client.connect();

 const query = client.query( //users table
  `CREATE TABLE users (
    U_id   bigserial primary key not null,
    U_name varchar(50) ,
    U_pwd  varchar(100),
    U_github varchar(20)
  );`
 )

// const query = client.query(
//   `CREATE TABLE documents (
//     D_hash varchar(80) primary key not null,
//     D_dir  varchar(100) not null,
//     D_size bigint not null
//   );`
// )


// const query = client.query(
//   `CREATE TABLE u_d (
//     key     bigserial primary key not null,
//     U_id    int not null,
//     D_hash  varchar(80) ,
//     isdir   boolean not null,
//     path    varchar(100) not null,
//     name    varchar(50) not null,
//     createtime date not null,
//     lasttime date not null
//   );`
// )



//  const query = client.query(
//    `CREATE TABLE share (
//     addr    char(10) not null,
//     secret  char(6) ,
//     U_id    int not null,
//     key     bigint not null,
//     D_hash  varchar(80) ,
//     D_dir   varchar(100),
//     isdir   boolean not null,
//     path    varchar(100) not null,
//     name    varchar(50) not null
//   );`
//  )


// client.query(`insert into documents (d_hash, d_dir, d_size) values ('123', '321', 123) returning d_hash;`,
//   (err, result) => {if (err) throw err; console.log(result); client.end(); });

query.on('end', () => client.end() );