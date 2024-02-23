const db = require('../../db/connection')

exports.fetchArticleById = (id) => {
    return db.query(`SELECT * FROM articles WHERE article_id = ${id}`)
    .then((response) => {
        if(response.rowCount === 0){
            return Promise.reject({status:404, msg:'id not found'})
        }
        return response.rows
    })
}

exports.fetchArticlesArr = () => {
    return db.query(`SELECT * FROM articles ORDER BY created_at DESC`)
    .then((response) => {
        return response.rows
    })
}

exports.addVotes = (id, num) => {
    if(typeof num !== 'number'){
        return Promise.reject({status: 400, msg: 'Missing Required Fields'})
    }
    return db.query(`UPDATE articles 
    SET votes = votes + ${num} 
    WHERE article_id = ${id}
    RETURNING *`)
    .then((result) => {
        console.log(result.rows[0])
        return result.rows[0]
    })
}