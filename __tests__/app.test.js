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