const express = require('express')
const { getTopics } = require('./controllers/topics-controller')
const app = express()

app.get('/api/topics', getTopics)

app.get('/api', )

app.use((err, request, response, next) =>{
    console.log(err)
    if (err.status && err.msg) {
        res.status(err.status).send({ msg: err.msg });
      }
      else if (err.code === '22P02') {
        res.status(400).send({ msg: err.message || 'Bad Request' });
      } else {
        console.log(err);
        res.status(500).send({ msg: 'Internal Server Error' });
      }
    });

module.exports = app