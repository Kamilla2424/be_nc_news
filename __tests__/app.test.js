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

