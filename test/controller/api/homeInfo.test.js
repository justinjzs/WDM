const app = require('../../../app');

const request = require('supertest').agent(app.listen());



describe('获取文件信息', function() {
    it('response should be json', function(done) {
        request
        .get('/homeinfo')
        .expect('Content-Type', /json/)
        .expect(200, done);
    });
});