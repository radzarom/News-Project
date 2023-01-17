const request = require('supertest');
const db = require(`${__dirname}/../db/connection.js`);
const seed = require(`${__dirname}/../db/seeds/seed.js`);
const data = require(`${__dirname}/../db/data/test-data/index.js`);
const app = require(`${__dirname}/../db/app.js`);
require('jest-sorted');


beforeEach(() => {
    return seed(data);
});

afterAll(() => {
    return db.end();
});


describe('app.js test suite', () => {
    test('responds with 404 if invalid path used', () => {
        return request(app)
        .get('/not-a-path')
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe('Path not found');
        })
    });

    describe('GET /api/topics', () => {
        test('responds with an array of topic objects with slug and description properties', () => {
            return request(app)
            .get('/api/topics')
            .expect(200)
            .then(({body}) => {
                expect(body.topics).toHaveLength(3);
                body.topics.forEach((topic) => {
                    expect(topic).toHaveProperty('slug', expect.any(String));
                    expect(topic).toHaveProperty('description', expect.any(String));
                })

            })
        });
    });

    describe('GET /api/articles', () => {
        test('responds with an array of article objects with relevant properties', () => {
            return request(app)
            .get('/api/articles')
            .expect(200)
            .then(({body}) => {
                expect(body.articles).toHaveLength(12);
                body.articles.forEach((article) => {
                    expect(article).toHaveProperty('author', expect.any(String));
                    expect(article).toHaveProperty('title', expect.any(String));
                    expect(article).toHaveProperty('article_id', expect.any(Number));
                    expect(article).toHaveProperty('topic', expect.any(String));
                    expect(article).toHaveProperty('created_at', expect.any(String));
                    expect(article).toHaveProperty('votes', expect.any(Number));
                    expect(article).toHaveProperty('article_img_url', expect.any(String));
                    expect(article).toHaveProperty('comment_count', expect.any(Number));
                })
            })
        });

        test('responds with articles in date descending order', () => {
            return request(app)
            .get('/api/articles')
            .expect(200)
            .then(({body: {articles}}) => {
                expect(articles).toBeSortedBy('created_at', {
                    descending: true
                })             
            })
        });
    });

    describe('GET /api/articles/:article_id', () => {
        test('responds with one article object with the relevant properties', () => {
            return request(app)
            .get('/api/articles/3')
            .expect(200)
            .then(({body: {article}}) => {
               
                expect(article).toHaveProperty('author', expect.any(String));
                expect(article).toHaveProperty('title', expect.any(String));
                expect(article).toHaveProperty('article_id', expect.any(Number));
                expect(article).toHaveProperty('topic', expect.any(String));
                expect(article).toHaveProperty('created_at', expect.any(String));
                expect(article).toHaveProperty('votes', expect.any(Number));
                expect(article).toHaveProperty('article_img_url', expect.any(String));
            })
        });

        test('responds with a 404 error if ID is not in the database', () => {
            return request(app)
            .get('/api/articles/309')
            .expect(404)
            .then(({body}) => {
               
                expect(body).toHaveProperty('msg', 'No article with this ID found');
            })
        });
    });
});