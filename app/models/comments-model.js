const db = require('../../db/connection')

exports.fetchCommentsById = (id) => {
    return db.query(`SELECT comments.comment_id, comments.votes, comments.created_at, comments.author, comments.body, comments.article_id FROM comments INNER JOIN articles ON comments.article_id = articles.article_id WHERE comments.article_id = ${id} ORDER BY created_at ASC;`)
    .then((response) => {
        if(response.rowCount === 0){
            return Promise.reject({status:404, msg:'id not found'})
        }
        return response.rows
    })
}
