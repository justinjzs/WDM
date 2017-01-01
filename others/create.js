//对数据库的后端操作

const pg = require('pg');
const conString = "tcp://jin:jinzis@localhost:5432/wdm";

 const client = new pg.Client(conString);
 client.connect();

//  const query = client.query( //users table
//   `CREATE TABLE users (
//     U_id   int primary key not null,
//     U_name varchar(50) not null,
//     U_pwd  varchar(100) not null
//   );`
//  )

// const query = client.query(
//   `CREATE TABLE documents (
//     D_hash varchar(80) primary key not null,
//     D_dir  varchar(80) not null,
//     D_size bigint not null
//   );`
// )

// const query = client.query(
//   `CREATE TABLE u_d (
//     key     bigserial primary key not null,
//     U_id    int not null,
//     D_hash  varchar(80) ,
//     diruuid int ,
//     isdir   boolean not null,
//     path    varchar(100) not null,
//     name    varchar(50) not null,
//     createtime date not null,
//     lasttime date not null
//   );`
// )

const query = client.query(
  `select d_dir, name from documents inner join u_d on documents.d_hash = u_d.d_hash where u_d.key = $1`,
  [2],
  (err, result) => {
    if (err) throw err;
    console.log(result.rows[0]);
  }
)

query.on('end', () => client.end() );