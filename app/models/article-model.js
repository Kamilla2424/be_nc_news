const db = require('../../db/connection')

exports.fetchArticleById = (id) => {
    return db.query(`SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, articles.body, CAST(COUNT(comments.comment_id) AS INTEGER) AS comment_count 
    FROM articles 
    LEFT JOIN 
    comments ON articles.article_id = comments.article_id
    WHERE articles.article_id = ${id}
    GROUP BY articles.article_id;`)
    .then((response) => {
        if(response.rowCount === 0){
            return Promise.reject({status:404, msg:'id not found'})
        }
        return response.rows[0]
    })
}

exports.fetchArticlesArr = (query) => {
    let text = `SELECT * FROM articles`
    
    if(query){
        text += ` WHERE topic = '${query}'`
    }

    text += ` ORDER BY created_at DESC;`
    
    return db.query(text)
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
        return result.rows[0]
    })
}