const expect = require('chai').expect;
const handle = require('../../../controller/handle');
const { rmPrefix, rewritePath } = handle();
/* 文件结构 
    f1
    |--pic2
    |--f3
       |--f4
       |--pic5
  调用前必须先调用rePrefix函数去除公共前缀
*/ 
const files = [
  {
    key: 4,
    name: 'f4',
    path: '/1/3/'
  },
  {
    key: 2,
    name: 'pic2',
    path: '/1/'
  },
  {
    key: 5,
    name: 'pic5',
    path: '/1/3/'
  },
  {
    key: 3,
    name: 'f3',
    path: '/1/'
  },
]

describe('重写路径', () => {
  it('', done => {
    //先移除前缀,排序
    rmPrefix(files);
    expect(files[0].path).to.equal('/');
    expect(files[1].path).to.equal('/');
    expect(files[2].path).to.equal('/3/');
    expect(files[3].path).to.equal('/3/');
    //重写路径
    rewritePath(files);
    expect(files[0].path).to.equal('/pic2');
    expect(files[1].path).to.equal('/f3');
    expect(files[2].path).to.equal('/f3/f4');
    expect(files[3].path).to.equal('/f3/pic5');
    done();
  })
})