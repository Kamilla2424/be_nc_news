const db = require('../../db/connection')
const { response } = require('../app')

exports.fetchCommentsById = (id) => {
    return db.query(`SELECT comments.comment_id, comments.votes, comments.created_at, comments.author, comments.body, comments.article_id FROM comments INNER JOIN articles ON comments.article_id = articles.article_id WHERE comments.article_id = ${id} ORDER BY created_at ASC;`)
    .then((response) => {
        if(response.rowCount === 0){
            return Promise.reject({status:404, msg:'id not found'})
        }
        return response.rows
    })
}

exports.insertCommentById = (id, username, body) => {
    return db.query(`SELECT * FROM articles WHERE article_id = ${id}`)
    .then((response) => {
        if(response.rowCount === 0){
            return Promise.reject({status:404, msg:'id not found'})
        }else if(username === 'undefined' || body === 'undefined' || username === 'undefined' && body === 'undefined'){
            Promise.reject({status: 400, msg: 'missing require fields'})
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