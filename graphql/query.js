const query = require('../controller/db').query(); //拿到数据库查询函数


module.exports = {

  /**
   * @param {String|Number} key
   * @param {String} path path of specified dir
   * @returns {Promise} resolve(Array)
   */
  insideFolder: (key, path) => new Promise((resolve, reject) => {
    const insidePath = path + key + '/';
    query(`select key, name, path, isdir, createtime, lasttime, d_size 
      from u_d left join documents on u_d.d_hash = documents.d_hash 
      where path = $1;`,
      [insidePath],
      (err, result) => {
        if (err) return reject(err);
        resolve(result.rows);
      });
  }),

  /**
   * @param {String|Number} u_id
   * @param {String} path
   * @returns {Promise} resolve(Array)
   */
  entityByPath: ({ u_id }, path) => new Promise((resolve, reject) => {
    query(`select key, name, path, isdir, createtime, lasttime, d_size from u_d left join documents on u_d.d_hash = documents.d_hash where u_id = $1 and path = $2;`,
      [u_id, path],
      (err, result) => {
        if (err) return reject(err);
        resolve(result.rows);
      });
  }),
  /**
   * @param {String|Number} u_id
   * @param {String|Number} key
   * @returns {Promise} resolve(Object)
   */
  entityByKey: ({ u_id }, key) => new Promise((resolve, reject) => {
    query(`select key, name, path, isdir, createtime, lasttime, d_size 
      from u_d left join documents on u_d.d_hash = documents.d_hash 
      where u_id = $1 and key = $2;`,
      [u_id, key],
      (err, result) => {
        if (err) return reject(err);
        if (!result.rows.length) 
          return reject(new Error('Key is not existing!'));
        resolve(result.rows[0]);
      });
  }),
  /**
   * @param {String|Number} u_id
   * @param {String} name
   * @param {String} path  path of specified dir
   * @returns {Promise} resolve(Array)
   */
  entityByName: ({ u_id }, name, path) => new Promise((resolve, reject) => {
    const nameLike = `%${name}%`;
    const pathLike = `%${path}%`;
    query(`select key, name, path, isdir, createtime, lasttime, d_size 
      from u_d left join documents on u_d.d_hash = documents.d_hash 
      where u_id = $1 and name like $2 and path like $3;`,
      [u_id, nameLike, pathLike],
      (err, result) => {
        if (err) return reject(err);
        resolve(result.rows);
      });
  }),
  /**
   * @param {String|Number} u_id
   * @param {String} name
   * @param {String} path  path of specified dir
   * @returns {Promise} resolve(Object)
   */
  mkdir: ({ u_id }, name, path) => new Promise((resolve, reject) => {
    const time = new Date();
    const values = [u_id, name, path, time, time, true];
    query(`insert into u_d (u_id, name, path, createtime, lasttime, isdir) 
      values ($1, $2, $3, $4, $5, $6) 
      returning key, name, path, isdir,createtime, lasttime;`,
      values,
      (err, result) => {
        if (err) return reject(err);
        resolve(result.rows[0]);
      });
  }),
  /**
   * @param {String|Number} u_id
   * @param {String} path  path of specified dir
   * @returns {Promise} 
   */
  pathIsExist: ({ u_id }, path) => new Promise((resolve, reject) => {
    if (path === '/') //path为根目录
     return resolve();
    else {
      path = path.match(/\d+/g); 
      const key = path.pop();
      path = '/' + (path.length ? (path.join('/') + '/') : '');

      const values = [key, true, u_id, path];
      query(`select path from u_d 
        where key = $1 and isdir = $2 
        and u_id = $3 and path = $4;`,
        values,
        (err, result) => {
          if (err) return reject(err); //数据库查询错误

          if (!result.rows.length) //key不存在或不是文件夹
           return reject(new Error('Path is not existing!'));
          else 
            resolve();
        });
    }

  })

}


