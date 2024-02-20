const fs = require('fs/promises')

exports.fetchEndpoint = () => {
    return fs.readFile('/Users/kamillamohamed/Northcoders/backend/be-nc-news/endpoints.json')
    .then((data) => {
        return JSON.parse(data.toString())
    })
    .catch((err) => {
        console.log(err)
    })
}