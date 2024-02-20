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
            const article = body.article
                expect(article).toEqual({
                    article_id: 2,
                    title: "Sony Vaio; or, The Laptop",
                    topic: "mitch",
                    author: "icellusedkars",
                    body: "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
                    created_at: "2020-10-16T05:03:00.000Z",
                    votes: 0,
                    article_img_url: "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
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
})