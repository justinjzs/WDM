const query = require('../controller/db').query(); //拿到数据库查询函数

/**
 * @param {String|Number} key
 * @param {String} path path of specified dir
 * @param {String} addr
 * @returns {Promise} resolve(Array)
 */
const insideFolder = (key, path, addr) => new Promise((resolve, reject) => {
  const insidePath = path + key + '/';
  query(`select key, name, path, isdir, d_size, addr
      from share where path = $1 and addr = $2;`,
    [insidePath, addr],
    (err, result) => {
      if (err) return reject(err);
      resolve(result.rows);
    });
})

/**
 * @param {String} addr
 * @param {String} path
 * @returns {Promise} resolve(Array)
 */
const entityByPath = (addr, path) => new Promise((resolve, reject) => {
  query(`select key, name, path, isdir, d_size, addr
    from share 
    where addr = $1 and path = $2;`,
    [addr, path],
    (err, result) => {
      if (err) return reject(err);
      resolve(result.rows);
    });
})

/**
 * @param {String} addr
 * @param {String|Number} key
 * @returns {Promise} resolve(Object)
 */
const entityByKey = (addr, key) => new Promise((resolve, reject) => {
  query(`select key, name, path, isdir, d_size, addr 
      from share 
      where addr = $1 and key = $2;`,
    [addr, key],
    (err, result) => {
      if (err) return reject(err);
      if (!result.rows.length)
        return reject('Key is not existing!');
      resolve(result.rows[0]);
    });
})

/**
 * @param {String} addr
 * @param {String} path  path of specified dir
 * @returns {Promise} 
 */
const pathIsExist = (addr, path) => new Promise((resolve, reject) => {
  if (path === '/') //path为根目录
    return resolve();
  else {
    path = path.match(/\d+/g);
    const key = path.pop();
    path = '/' + (path.length ? (path.join('/') + '/') : '');

    const values = [key, true, addr, path];
    query(`select path from share 
        where key = $1 and isdir = $2 
        and addr = $3 and path = $4;`,
      values,
      (err, result) => {
        if (err) return reject(err); //数据库查询错误

        if (!result.rows.length) //key不存在或不是文件夹
          return reject('Path is not existing!');
        else
          resolve();
      });
  }

})
/**
 * @param {String} addr
 * @returns {Promise} resolve(String)
 */
const getSerect = addr => new Promise((resolve, reject) => {
  query(`select distinct secret from share 
    where addr = $1;`,
    [addr],
    (err, result) => {
      if (err) return reject(err);
      if(!result.rows.length)
        return reject('Invalid share page address!');
      else 
        resolve(result.rows[0].secret);
    })
})

module.exports = {
  entityByKey,
  entityByPath,
  insideFolder,
  pathIsExist,
  getSerect
}