const { fetchArticleById, fetchArticlesArr } = require("../models/article-model")

exports.getArticleById = (req, res, next) => {
    const {article_id} = req.params
    fetchArticleById(article_id).then((article) => {
        res.status(200).send({article: article})
    })
    .catch((err) => {
        next(err)
    })
}

exports.getArticles = (req, res, next) => {
    fetchArticlesArr().then((articles) => {
        res.status(200).send({articles: articles})
    })
    .catch((err) => {
        next(err)
    })
}