const app = require('../src/app')

describe('app tests', () => {

    it('GET / responds with 200 + string', () => {
        return supertest(app)
        .get('/')
        .expect(200, 'This is the Department of Truth and Facts Api Service')
    });
    
});