const express = require('express')
const { getTopics } = require('./controllers/topics-controller')
const { getArticleById, getArticles, addVotesById } = require('./controllers/article-controller')
const { getCommentsById, postCommentsById } = require('./controllers/comments-controller')
const app = express()
app.use(express.json())

app.get('/api/topics', getTopics)

app.get('/api', )

app.get('/api/articles/:article_id', getArticleById)

app.get('/api/articles', getArticles)

app.get('/api/articles/:article_id/comments', getCommentsById)

app.post('/api/articles/:article_id/comments', postCommentsById)

app.patch('/api/articles/:article_id', addVotesById)

app.use((err, req, res, next) =>{
    if(err.status === 404) {
        res.status(404).send({ msg: "Not Found" });
    }else if(err.status === 400){
        res.status(400).send({msg: 'Bad Request'})
    }
    next(err)
});
    
app.use((err, req, res, next) => {
    if (err.code === '42703') {
        res.status(400).send({ msg: 'Bad Request' });
    }else if(err.code === '23502'){
        res.status(400).send({msg: 'Missing Required Fields'})
    }
    next(err)   
})

app.use((err, req, res, next) => {
    res.status(500).send({ msg: 'Internal Server Error' });
})

module.exports = app