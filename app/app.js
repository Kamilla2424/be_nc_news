const express = require('express')
const { getTopics } = require('./controllers/topics-controller')
const app = express()

app.get('/api/topics', getTopics)

app.use((err, request, response, next) =>{
    console.log(err)
    response.status(500).send({msg: "Internal server error"})
  })






app.listen(9090, () => {
    console.log('listening on 9090')
})

module.exports = app