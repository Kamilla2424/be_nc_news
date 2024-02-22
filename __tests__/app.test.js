const app = require('../app/app.js')
const request = require('supertest')
const express = require('express')
const db = require('../db/connection.js')
const seed = require('../db/seeds/seed.js')
const data = require('../db/data/test-data')

app.use(express.json())

beforeEach(()=>{
    return seed(data)
})

afterAll(()=>{
    db.end()
})

describe("GET /api/topics", () => {
    test('serves an array of all topics', () => {
        return request(app).get('/api/topics')
        .expect(200)
        .then(({body}) => {
            body.forEach((topic)=>{
                expect(topic).toMatchObject({
                    slug: expect.any(String),
                    description: expect.any(String)
                })
            })
        })
    })
})

describe("GET /api/articles/:article_id", () => {
    test('returns article by id with correct properties', () => {
        return request(app).get('/api/articles/2')
        .expect(200)
        .then(({body}) => {
            const articles = body.article
            articles.forEach((article) => {
                expect(article).toMatchObject({
                    article_id: expect.any(Number),
                    article_img_url: expect.any(String),
                    author: expect.any(String),
                    body: expect.any(String),
                    created_at: expect.any(String),
                    title: expect.any(String),
                    topic: expect.any(String),
                    votes: expect.any(Number),
                })
            })
        })
    })
    test('ERR - should return 404 when id is valid but doesnt exist', () => {
        return request(app).get('/api/articles/9999')
        .expect(404)
        .then((response) => {
            expect(response.body.msg).toBe('Not Found')
        })
    })
    test('ERR - should return 400 when id is not valid', () => {
        return request(app).get('/api/articles/notAnId')
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe('Bad Request');
        })
    })
})

describe("GET /api/articles", () => {
    test('returns an arr of articles', () => {
        return request(app).get('/api/articles')
        .expect(200)
        .then(({body}) => {
            const articles = body.articles
            articles.forEach((article) => {
                expect(article).toMatchObject({
                    article_id: expect.any(Number),
                    article_img_url: expect.any(String),
                    author: expect.any(String),
                    body: expect.any(String),
                    created_at: expect.any(String),
                    title: expect.any(String),
                    topic: expect.any(String),
                    votes: expect.any(Number),
                })
            })
        })
    })
    test("returns arr of articles filtered by topic", () => {
        return request(app).get('/api/articles?topic=mitch')
        .expect(200)
        .then(({body}) => {
            const articles = body.articles
            articles.forEach((article) => {
                expect(article).toMatchObject({
                    article_id: expect.any(Number),
                    article_img_url: expect.any(String),
                    author: expect.any(String),
                    body: expect.any(String),
                    created_at: expect.any(String),
                    title: expect.any(String),
                    topic: "mitch",
                    votes: expect.any(Number),
                })
            })
        })
    })
    test("should return empty array when topic query doesn't match any articles", () => {
        return request(app).get('/api/articles?topic=puppies')
        .expect(200)
        .then(({body}) => {
            const articles = body.articles
            expect(articles).toEqual([])
        })
    })
})
describe("GET /api/articles/:article_id/comments", () => {
    test('returns an arr of articles', () => {
        return request(app).get('/api/articles/1/comments')
        .expect(200)
        .then(({body}) => {
            const comments = body.comments
            expect(comments).toBeSorted('created_at', {ascending: true})
            comments.forEach((comment) => {
                expect(comment).toMatchObject({
                    comment_id: expect.any(Number),
                    votes: expect.any(Number),
                    created_at: expect.any(String),
                    author: expect.any(String),
                    body: expect.any(String),
                    article_id: 1
                })
            })
        })
    })
    test('ERR - should return 400 when id is not valid', () => {
        return request(app).get('/api/articles/9999/comments')
        .expect(404)
        .then((response) => {
            expect(response.body.msg).toBe('Not Found');
        })
    })
    test('ERR - should return 400 when id is not valid', () => {
        return request(app).get('/api/articles/notAnId/comments')
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe('Bad Request');
        })
    })
})

describe("POST /api/articles/:article_id/comments", () => {
    test("Should return a comment with username as author and body as body to the right article", () => {
        const body = {
            username: 'lurker',
            body: 'so cool beans!'
        }
        return request(app).post('/api/articles/1/comments')
        .send(body)
        .expect(200)
        .then((response) => {
            const {comment} = response.body
            expect(comment.author).toBe('lurker')
            expect(comment.article_id).toBe(1)
            expect(comment.body).toBe('so cool beans!')
        }) 
    })
    test("ERR - should return 400 when body is empty", () => {
        const body = {}
        return request(app).post('/api/articles/1/comments')
        .send(body)
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe("Missing Required Fields")
        })
    })
    test("ERR - should return 400 when body is in wrong form or wrong info", () => {
        const body = { rating_out_of_five: 6 }
        return request(app).post('/api/articles/1/comments')
        .send(body)
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe("Missing Required Fields")
        })
    })
    test('ERR - should return 400 when id is not valid', () => {
        return request(app).get('/api/articles/9999/comments')
        .expect(404)
        .then((response) => {
            expect(response.body.msg).toBe('Not Found');
        })
    })
    test('ERR - should return 400 when id is not valid', () => {
        return request(app).get('/api/articles/notAnId/comments')
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe('Bad Request');
        })
    })
})
describe("PATCH /api/articles/:article_id", () => {
    test("Should increase the articles votes if positive number", () => {
        const body = {
            inc_votes : 1 
        }
        return request(app).patch('/api/articles/1')
        .send(body)
        .expect(200)
        .then(({body}) => {
            const article = body.article
            expect(article).toMatchObject({
                    article_id: 1,
                    article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
                    author: 'butter_bridge',
                    body: 'I find this existence challenging',
                    created_at: '2020-07-09T20:11:00.000Z',
                    title: 'Living in the shadow of a great man',
                    topic: 'mitch',
                    votes: 101
            })
        })
    })
    test("Should decrese the articles votes if negative number", () => {
        const body = {
            inc_votes : -50
        }
        return request(app).patch('/api/articles/1')
        .send(body)
        .expect(200)
        .then(({body}) => {
            const article = body.article
            expect(article).toMatchObject({
                    article_id: 1,
                    article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
                    author: 'butter_bridge',
                    body: 'I find this existence challenging',
                    created_at: '2020-07-09T20:11:00.000Z',
                    title: 'Living in the shadow of a great man',
                    topic: 'mitch',
                    votes: 50
            })
        })
    })
    test("ERR - should return 400 when body is empty", () => {
        const body = {}
        return request(app).patch('/api/articles/1')
        .send(body)
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe("Bad Request")
        })
    })
    test("ERR - should return 400 when body is in wrong form or wrong info", () => {
        const body = { inc_votes: 'whatever' }
        return request(app).patch('/api/articles/1')
        .send(body)
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe("Bad Request")
        })
    })
    test('ERR - should return 400 when id is not valid', () => {
        return request(app).get('/api/articles/9999')
        .expect(404)
        .then((response) => {
            expect(response.body.msg).toBe('Not Found');
        })
    })
    test('ERR - should return 400 when id is not valid', () => {
        return request(app).get('/api/articles/notAnId')
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe('Bad Request');
        })
    })
})
describe("DELETE /api/comments/:comment_id", () => {
    test("responds with 204 when successful", () => {
        return request(app).delete('/api/comments/3')
        .expect(204);
    })
    test("ERR - should return 404 when id is not valid", () => {
        return request(app).delete('/api/comments/9999')
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe('Not Found');
        });
    })
    test("ERR - should return 400 when id is not valid", () => {
        return request(app).delete('/api/comments/notAnId')
        .expect(400)
        .then((response) => {
        expect(response.body.msg).toBe('Bad Request');
      })
    })
})
describe("GET /api/users", () => {
    test("returns an array of users with the right properties", () => {
        return request(app).get('/api/users')
        .expect(200)
        .then(({body}) => {
            const users = body.users
            users.forEach((user) => {
                expect(user).toMatchObject({
                    username: expect.any(String),
                    name: expect.any(String),
                    avatar_url: expect.any(String)
                })
            })
        })
    })
})
