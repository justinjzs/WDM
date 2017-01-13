const parse = require('co-body');

module.exports = bodyParse;
//解析body
function *bodyParse(next) {
  this.request.body = yield parse.json(this).catch(() => ({}));

  yield next;
}