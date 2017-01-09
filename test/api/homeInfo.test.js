var app = require('../../app');

var request = require('supertest').agent(app.listen());


//
describe('GET /homeinfo', function() {
    it('response should be json', function(done) {
        request
        .get('/homeinfo')
        .expect('Content-Type', /json/)
        .expect(200, function() {
            console.log(res)
        });
    });
});