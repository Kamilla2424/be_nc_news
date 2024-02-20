const {fetchEndpoint} = require('../models/app-model')

exports.getEndpoint = (req, res, next) => {
    fetchEndpoint().then((endpoints) => {
        res.status(200).send({endpoints: endpoints})
    })
    .catch((err) => {
        next(err)
    })
}