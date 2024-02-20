const express = require('express')
const { getTopics } = require('./controllers/topics-controller')
const { getEndpoint } = require('./controllers/app-controller')
const app = express()

app.get('/api/topics', getTopics)

app.get('/api', getEndpoint)

app.use((err, request, response, next) =>{
    console.log(err)
    if (err.status && err.msg) {
        res.status(err.status).send({ msg: err.msg });
      } else {
        console.log(err);
        res.status(500).send({ msg: 'Internal Server Error' });
      }
    });


    let server;
    beforeAll(() => {
      server = app.listen(9090);
    });
    
    afterAll((done) => {
      server.close(done);
    });

module.exports = app