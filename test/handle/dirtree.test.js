const expect = require('chai').expect;
const handle = require('../../controller/handle');
const { dirTree } = handle();

const u_id = 0; //0为测试u_id
const fields = { path: '/' };
const files = [
  { name: 'pic/fox.jpg' },
  { name: 'pic/tree.jpg' },
  { name: 'pic/test/cat.jpg' }
]



describe('文件树', () => {
  it('', done => {
    const trees = dirTree(fields, files, u_id);

    //第一层为pic文件夹
    expect(trees.length).to.equal(1);
    const pic = trees[0];
    expect(pic.name).to.equal('pic');
    expect(pic.children).to.be.an('array')

    //第二层为fox.jpg, tree.jpg, test
    const second = trees[0].children;
    expect(second.length).to.equal(3);
    const [fox, tree, test] = second;
    expect(fox.name).to.equal('fox.jpg');
    expect(tree.name).to.equal('tree.jpg');
    expect(test.name).to.equal('test');
    
    //第三层为cat.jpg
    const [cat] = test.children;
    expect(cat.name).to.equal('cat.jpg');
    done();
  })
})