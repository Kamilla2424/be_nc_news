const app = require('../app/app.js')
const request = require('supertest')
const express = require('express')
const db = require('../db/connection.js')
const seed = require('../db/seeds/seed.js')
const data = require('../db/data/test-data')
const endpoints = require('/Users/kamillamohamed/Northcoders/backend/be-nc-news/endpoints.json');

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

describe("GET /api", () => {
    test('returns the endpoint with its information', () => {
        return request(app).get('/api')
        .expect(200)
        .then(({body}) => {
            expect(body.endpoints).toEqual(endpoints)
        })          
    })
})

describe("GET /api/articles/:article_id", () => {
    test('returns article by id with correct properties', () => {
        return request(app).get('/api/articles/2')
        .expect(200)
        .then(({body}) => {
            const article = body.article
                expect(article).toEqual({
                    article_id: 2,
                    title: "Sony Vaio; or, The Laptop",
                    topic: "mitch",
                    author: "icellusedkars",
                    body: "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
                    created_at: "2020-10-16T05:03:00.000Z",
                    votes: 0,
                    article_img_url: "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
                    comment_count: 0

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
        return request(app).get('/api/articles?topic=notATopic')
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
    test('Should return an empty array when the id is valid but comments are empty', () => {
        return request(app).get('/api/articles/2/comments')
        .expect(200)
        .then((response) => {
            expect(response.body.comments).toEqual([])
        })
    })
    test('ERR - should return 404 when id is a number but not valid', () => {
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
    test('ERR - should return 404 when id is valid but doesnt exist', () => {
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
    test("should return article unchanged if body is empty", () => {
        const body = {}
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
                    votes: 100
            })
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
    test('ERR - should return 404 when id is not valid', () => {
        const body = {inc_votes: 5}
        return request(app).get('/api/articles/9999')
        .send(body)
        .expect(404)
        .then((response) => {
            expect(response.body.msg).toBe('Not Found');
        })
    })
    test('ERR - should return 400 when id is not valid', () => {
        const body = {inc_votes: 5}
        return request(app).get('/api/articles/notAnId')
        .send(body)
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
            expect(users.length).toBe(4)
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
