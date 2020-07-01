const app = require('../src/app')

describe('app tests', () => {

    console.log(process.env.DATABASE_URL);

    it('GET / responds with 200 + string', () => {
        return supertest(app)
        .get('/')
        .expect(200, 'This is the Department of Truth and Facts Api Service')
    });
    
});