const {retrieveTopics, retrieveArticles, retrieveCommentsByArticleID} = require(`${__dirname}/model.js`)


const getTopics = (request, response, next) => {

    retrieveTopics().then((topics) => {

        response.status(200).send({topics: topics});
    })
    .catch((err) => {
        next(err);
    })
}

const getArticles = (request, response, next) => {

    retrieveArticles().then((articles) => {

        response.status(200).send({articles: articles})
    })
    .catch((err) => {
        next(err);
    })
}

const getCommentsByArticleID = (request, response, next) => {
    const {article_id} = request.params

    retrieveCommentsByArticleID(article_id).then((comments) => {

        response.status(200).send({comments: comments})
    })
    .catch((error) => {

        next(error)
    })
}

module.exports = {getTopics, getArticles, getCommentsByArticleID}