const parse = require('co-busboy');
const Pool = require('./pool');

const check = () => { //检查ctx.pool

} 

const cb = (err, result) => {
  if (err) throw err;
  conso.log(result.rows);
}

module.exports = {
  upLoad: function(ctx){
    const query = Pool(ctx.pool);
    query("insert into company (id,name,age,address,salary) values (4, 'tank',  25, 'england', 10000.00);",
      undefined, cb);

  }
}