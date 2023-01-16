const request = require('supertest');
const db = require(`${__dirname}/../db/connection.js`);
const seed = require(`${__dirname}/../db/seeds/seed.js`);
const data = require(`${__dirname}/../db/data/test-data/index.js`);
const app = require(`${__dirname}/../db/app.js`);


beforeEach(() => {
    return seed(data);
});

afterAll(() => {
    return db.end();
});


describe('app.js test suite', () => {

    describe('GET /api/topics', () => {
        test('responds with status code 200', () => {
            return request(app)
            .get('/api/topics')
            .expect(200)
        });

        test('responds with an array of topic objects with slug and description properties', () => {
            return request(app)
            .get('/api/topics')
            .expect(200)
            .then(({body}) => {
                body.topics.forEach((topic) => {
                    expect(topic).toHaveProperty('slug', expect.any(String));
                    expect(topic).toHaveProperty('description', expect.any(String));
                })

            })
        });

        // test('responds with 404 if ', () => {
            
        // });
    });
});