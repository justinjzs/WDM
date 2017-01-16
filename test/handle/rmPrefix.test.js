const expect = require('chai').expect;
const handle = require('../../controller/handle');
const { rmPrefix } = handle();

describe('移除同层文件的公共前缀并排序(同文件夹内)', () => {
/* 文件结构 
    1
    |--2
    |--3
       |--4
       |--5
*/
  it('', done => {
    const files = [
      { path: '/1/' }, //2
      { path: '/1/3/' }, //4
      { path: '/1/' }, //3
      { path: '/1/3/' } //5
    ];
    rmPrefix(files);
    expect(files[0].path).to.equal('/');
    expect(files[1].path).to.equal('/');
    expect(files[2].path).to.equal('/3/');
    expect(files[3].path).to.equal('/3/');
    done();
  })
})