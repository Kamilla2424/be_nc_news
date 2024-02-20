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
describe("GET /api", () => {
    test('returns the endpoint with its information', () => {
        return request(app).get('/api')
        .expect(200)
        .then(({body}) => {
            expect(body.endpoints).toEqual({
                "GET /api": {
                  "description": "serves up a json representation of all the available endpoints of the api"
                },
                "GET /api/topics": {
                  "description": "serves an array of all topics",
                  "queries": [],
                  "exampleResponse": {
                    "topics": [{ "slug": "football", "description": "Footie!" }]
                  }
                },
                "GET /api/articles": {
                  "description": "serves an array of all articles",
                  "queries": ["author", "topic", "sort_by", "order"],
                  "exampleResponse": {
                    "articles": [
                      {
                        "title": "Seafood substitutions are increasing",
                        "topic": "cooking",
                        "author": "weegembump",
                        "body": "Text from the article..",
                        "created_at": "2018-05-30T15:59:13.341Z",
                        "votes": 0,
                        "comment_count": 6
                      }
                    ]
                  }
                }
              })
        })
    })
})
