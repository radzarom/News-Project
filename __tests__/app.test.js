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
    test('responds with 404 error if invalid path used', () => {
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

    describe('GET /api/articles/article_id/comments', () => {
        test('responds with an array of comments for a given article ID', () => {
            return request(app)
            .get('/api/articles/1/comments')
            .expect(200)
            .then(({body: {comments}}) => {
                expect(comments).toHaveLength(11);
                comments.forEach((comment) => {
                    expect(comment).toHaveProperty('comment_id', expect.any(Number));
                    expect(comment).toHaveProperty('votes', expect.any(Number));
                    expect(comment).toHaveProperty('created_at', expect.any(String));
                    expect(comment).toHaveProperty('article_id', expect.any(Number));
                    expect(comment).toHaveProperty('author', expect.any(String));
                    expect(comment).toHaveProperty('body', expect.any(String));
                })       
            })
        });

        test('responds with an array of comments for a given article ID in date descending', () => {
            return request(app)
            .get('/api/articles/1/comments')
            .expect(200)
            .then(({body: {comments}}) => {
                expect(comments).toBeSortedBy('created_at', {
                    descending: true
                })
            })
        });

    }) 

    describe('POST /api/articles/:article_id/comments', () => {
        test('adds comment to database with relevant article ID', () => {
            return request(app)
            .post('/api/articles/1/comments')
            .send({
                username: 'lurker',
                body: '#metoo'
            })
            .expect(201)
            .then(({body: {comment}}) => {
                
                expect(comment).toHaveProperty('comment_id', expect.any(Number));
                expect(comment).toHaveProperty('votes', 0);
                expect(comment).toHaveProperty('created_at', expect.any(String));
                expect(comment).toHaveProperty('article_id', 1);
                expect(comment).toHaveProperty('author', 'lurker');
                expect(comment).toHaveProperty('body', '#metoo');
            })
        });

        test('responds with 400 error when sending properties that are not valid table columns', () => {
            return request(app)
            .post('/api/articles/1/comments')
            .send({
                username: 'lurker',
                bodyyyy: 'yes'
            })
            .expect(400)
            .then(({body: {msg}}) => {
                
                expect(msg).toBe('Invalid column names')
                
            })
        });

        test('responds with 400 error when sent invalid data type in username', () => {
            return request(app)
            .post('/api/articles/1/comments')
            .send({
                username: 123,
                body: 'hello'
            })
            .expect(400)
            .then(({body: {msg}}) => {
                
                expect(msg).toBe('Invalid value for username')
                
            })
        });

        test('responds with 400 error when sent invalid data type in body', () => {
            return request(app)
            .post('/api/articles/1/comments')
            .send({
                username: 'lurker',
                body: 123
            })
            .expect(400)
            .then(({body: {msg}}) => {
                
                expect(msg).toBe('Invalid value for body')
                
            })
        });

        test('responds with 404 error when given an ID which does not exist', () => {
            return request(app)
            .post('/api/articles/1001/comments')
            .send({
                username: 'lurker',
                body: '123'
            })
            .expect(404)
            .then(({body: {msg}}) => {
                
                expect(msg).toBe('This ID does not exist')
                
            })
        });

        test('responds with 400 error if given ID which is not the right data type', () => {
            return request(app)
            .post('/api/articles/oops/comments')
            .send({
                username: 'lurker',
                body: '123'
            })
            .expect(400)
            .then(({body: {msg}}) => {
                
                expect(msg).toBe('The ID used is not the correct data type')
            })
        })
    })

    describe('PATCH /api/articles/:article_id', () => {
        test('responds with the updated article object', () => {
            return request(app)
            .patch('/api/articles/2')
            .send({
                inc_votes: 5
            })
            .expect(200)
            .then(({body: {article}}) => {
               
                expect(article).toHaveProperty('votes', 5);
                expect(article).toHaveProperty('article_id', 2);
                expect(article).toHaveProperty('author', expect.any(String));
                expect(article).toHaveProperty('title', expect.any(String));
                expect(article).toHaveProperty('topic', expect.any(String));
                expect(article).toHaveProperty('created_at', expect.any(String));
                expect(article).toHaveProperty('article_img_url', expect.any(String));
            })    
        });

        test('the change has been committed to the database', () => {
            return request(app)
                .patch('/api/articles/2')
                .send({
                    inc_votes: 5
                })
                .expect(200)
                .then(() => {
                    return request(app)
                    .get('/api/articles/2')
                    .expect(200)
                    .then(({body: {article}}) => {
                        expect(article).toHaveProperty('votes', 5);
                    })
                })
        });

        test('responds with 400 error if votes not sent on inc_votes property', () => {
            return request(app)
            .patch('/api/articles/2')
            .send({
                inc_tes: 5
            })
            .expect(400)
            .then(({body: {msg}}) => {
               
                expect(msg).toBe('Votes data not sent in correct format');
            })
        });

        test('responds with 404 error if article with that ID isnt found', () => {
            return request(app)
            .patch('/api/articles/200')
            .send({
                inc_votes: 5
            })
            .expect(404)
            .then(({body: {msg}}) => {

                expect(msg).toBe('No article with that ID exists')
            })
        });

        test('responds with 400 error if article ID is the wrong data type', () => {
            return request(app)
            .patch('/api/articles/abc')
            .send({
                inc_votes: 5
            })
            .expect(400)
            .then(({body: {msg}}) => {

                expect(msg).toBe('The article ID is the wrong data type')
            })
        });
    });
    
    describe('GET /api/users', () => {
        test('responds with an array of user objects wuth relevant fields', () => {
            return request(app)
            .get('/api/users')
            .expect(200)
            .then(({body}) => {
                expect(body.users).toHaveLength(4);
                body.users.forEach((user) => {
                    expect(user).toHaveProperty('username', expect.any(String));
                    expect(user).toHaveProperty('name', expect.any(String));
                    expect(user).toHaveProperty('avatar_url', expect.any(String));
                })
            })
        });
    });

    describe('GET /api/articles (queries)', () => {
        test('responds with articles filtered by topic', () => {
            return request(app)
            .get('/api/articles?topic=mitch')
            .expect(200)
            .then(({body}) => {
                
                expect(body.articles).toHaveLength(11)
                body.articles.forEach((article) =>{

                    expect(article.topic).toBe('mitch');
                })
            })
        });

        test('responds with articles sorted by specified column', () => {
            return request(app)
            .get('/api/articles?sort_by=author')
            .expect(200)
            .then(({body}) => {
                
                expect(body.articles).toHaveLength(12)
                expect(body.articles).toBeSortedBy('author', {
                    descending: true
                })
            })
        });

        test('responds with articles sorted by ascending when specified', () => {
            return request(app)
            .get('/api/articles?order=asc')
            .expect(200)
            .then(({body}) => {
                
                expect(body.articles).toHaveLength(12)
                expect(body.articles).toBeSortedBy('created_at')
            })
        });

        test('responds with articles filtered by topic, sorted by column_name, in correct order and limited to 5 when all are specified ', () => {
            return request(app)
            .get('/api/articles?topic=mitch&sort_by=author&order=asc&limit=5')
            .expect(200)
            .then(({body}) => {
                
                expect(body.articles).toHaveLength(5)
                expect(body.articles).toBeSortedBy('author')
                body.articles.forEach((article) =>{

                    expect(article.topic).toBe('mitch');
                })
            })
        });

        test('responds 200 and an empty array for a topic that does exist but doesnt have any articles yet', () => {
            return request(app)
            .get('/api/articles?topic=paper')
            .expect(200)
            .then(({body}) => {

                expect(body.articles).toHaveLength(0);
            })
        });

        test('responds with 400 error when queried with an invalid topic', () => {
            return request(app)
            .get('/api/articles?topic=treees')
            .expect(404)
            .then(({body: {msg}}) => {
                
                expect(msg).toBe('Invalid topic name used')
            })
        });

        test('responds with 400 error when invalid column is used for sort_by', () => {
            return request(app)
            .get('/api/articles?sort_by=grandma')
            .expect(400)
            .then(({body: {msg}}) => {
                
                expect(msg).toBe('Invalid column name to sort by')
            })
        });

        test('responds with 400 error when order value is not asc or desc', () => {
            return request(app)
            .get('/api/articles?order=grandma')
            .expect(400)
            .then(({body: {msg}}) => {
                
                expect(msg).toBe('Invalid ordering request')
            })
        });
    }) 
    
    describe('GET /api/articles/:article_id (comment count)', () => {
        test('responds with article of a given ID with count of comments associated with that article', () => {
            return request(app)
            .get('/api/articles/3')
            .expect(200)
            .then(({body}) => {

                expect(body.article).toHaveProperty('comment_count', 2)
            })
        });
    });

    describe('DELETE /api/comments/:comment_id', () => {
        test('responds with status 204 and no content, and removes comment from DB', () => {
            return request(app)
            .delete('/api/comments/2')
            .expect(204)
            .then(() => {

                return request(app)
                    .get('/api/articles/1/comments')
                    .expect(200)
                    .then(({body: {comments}}) => {

                        const numberOf = comments.filter((comment) => comment.comment_id === 2)
                        expect(numberOf.length).toBe(0);
                    })
            })
        });

        test('responds with 404 if the comment did not exist to be deleted', () => {
            return request(app)
            .delete('/api/comments/200')
            .expect(404)
            .then(({body: {msg}}) => {

                expect(msg).toBe('Could not delete comment with this ID as it did not exist')
            })
        });

        test('responds with 400 error if comment ID is wrong data type', () => {
            return request(app)
            .delete('/api/comments/abc')
            .expect(400)
            .then(({body: {msg}}) => {

                expect(msg).toBe('Comment ID is the wrong data type')
            })
        });
    });

    describe('GET /api/', () => {
        test('responds with a json object with a property for each endpoint', () => {
            return request(app)
            .get('/api')
            .expect(200)
            .then(({body: endpoints}) => {

                expect(endpoints).toMatchObject({
                    "GET /api/topics": expect.any(Object),
                    "GET /api/articles": expect.any(Object),
                    "GET /api/articles/:article_id": expect.any(Object),
                    "GET /api/articles/:article_id/comments": expect.any(Object),
                    "GET /api/users": expect.any(Object),
                    "POST /api/articles/:article_id/comments": expect.any(Object),
                    "PATCH /api/articles/:article_id": expect.any(Object),
                    "DELETE /api/comments/:comment_id": expect.any(Object)
                })
            })
        });
    });
})