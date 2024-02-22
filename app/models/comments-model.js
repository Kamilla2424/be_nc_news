const db = require('../../db/connection')

exports.fetchCommentsById = (id) => {
    return db.query(`SELECT * FROM articles WHERE article_id = ${id}`)
    .then((result) => {
        if(result.rowCount === 0){
            return Promise.reject({status:404, msg:'id not found'})
        }
        return id
    })
    .then((result) => {
        return db.query(`SELECT * FROM comments WHERE article_id = ${result}`)
    })
    .then((result) => {
        return result.rows
    })
}
