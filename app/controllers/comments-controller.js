const { fetchCommentsById, insertCommentById, removeComment } = require("../models/comments-model")

exports.getCommentsById = (req, res, next) => {
    const {article_id} = req.params
    fetchCommentsById(article_id).then((comments) => {
        res.status(200).send({comments: comments})
    })
    .catch((err) => {
        next(err)
    })
}

exports.postCommentsById = (req, res, next) => {
    const {article_id} = req.params
    const {username, body} = req.body
    insertCommentById(article_id, username, body).then((comment) => {
        res.status(200).send({comment: comment})
    })
    .catch((err) => {
        next(err)
    })
}

exports.deleteCommentById = (req, res, next) => {
    const {comment_id} = req.params
    removeComment(comment_id).then((response) => {
        res.status(204).send()
    })
    .catch((err) => {
        next(err)
    })
}