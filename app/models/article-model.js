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

exports.fetchArticlesArr = (query) => {
    return db.query(`SELECT * FROM articles ORDER BY created_at DESC`)
    .then((response) => {
        return response.rows
    })
    .then((arr) => {
        if(query){
            return filteredArr = arr.filter((article) => {
                return article.topic === query
            })
        }
        return arr
    })
}

exports.addVotes = (id, num) => {
    return db.query(`SELECT * FROM articles WHERE article_id = ${id}`)
    .then((result) => {
        if(result.rowCount === 0){
            return Promise.reject({status:404, msg:'id not found'})
        }else if(typeof num !== 'number'){
            return Promise.reject({status: 400, msg: 'Missing Required Fields'})
        }
        const article = result.rows[0]
        article.votes += num
        return article
    })
}