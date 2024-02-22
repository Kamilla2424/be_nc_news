const express = require('express')
const { getTopics } = require('./controllers/topics-controller')
const { getArticleById, getArticles } = require('./controllers/article-controller')
const { getCommentsById } = require('./controllers/comments-controller')
const { getEndpoint } = require('./controllers/app-controller')
const app = express()

app.get('/api/topics', getTopics)

app.get('/api', getEndpoint)

app.get('/api/articles/:article_id', getArticleById)

app.get('/api/articles', getArticles)

app.get('/api/articles/:article_id/comments', getCommentsById)

app.use((err, req, res, next) =>{
    if(err.status === 404) {
        res.status(404).send({ msg: "Not Found" });
    }
    next(err)
});
    
app.use((err, req, res, next) => {
    if (err.code === '42703') {
        res.status(400).send({ msg: 'Bad Request' });
    }
    next(err)   
})

app.use((err, req, res, next) => {
    res.status(500).send({ msg: 'Internal Server Error' });
})

module.exports = app