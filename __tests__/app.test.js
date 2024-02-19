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
    test('ERR should return 404 not found for invalid URL', ()=>{
        return request(app).get('/api/notARoute')
        .expect(404)
    })
})
