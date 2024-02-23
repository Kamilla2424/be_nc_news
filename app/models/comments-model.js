const db = require('../../db/connection')
const { response } = require('../app')

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

exports.insertCommentById = (id, username, body) => {
    return db.query(`SELECT * FROM articles WHERE article_id = ${id}`)
    .then((response) => {
        if(response.rowCount === 0){
            return Promise.reject({status:404, msg:'id not found'})
        }else if(username === 'undefined' || body === 'undefined' || username === 'undefined' && body === 'undefined'){
            return Promise.reject({status: 400, msg: 'missing require fields'})
        }else{
            return db.query(`INSERT INTO comments (body, author, article_id) VALUES ($1, $2, $3) RETURNING comment_id, author, article_id, votes, created_at, body;`,
            [body, username, id])
        }
    })
    .then((result) => {
        return result.rows[0]
    })
}

exports.removeComment = (id) => {
    return db.query(`DELETE FROM comments WHERE comment_id = ${id}`)
    .then((response) => {
        if(response.rowCount === 0){
            return Promise.reject({ status: 404, msg: 'team does not exist' })
        }
    })
}
