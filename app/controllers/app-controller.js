const fs = require('fs/promises')

exports.getEndpoint = (req, res, next) => {
    fs.readFile('/Users/kamillamohamed/Northcoders/backend/be-nc-news/endpoints.json', 'utf-8')
    .then((data) => {
        return JSON.parse(data)
    }).then((endpoints) => {
        res.status(200).send({endpoints: endpoints})
    })
    .catch((err) => {
        next(err)
    })
}