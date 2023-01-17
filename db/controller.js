const {retrieveTopics, retrieveArticles, retrieveArticleByID} = require(`${__dirname}/model.js`)


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

const getArticleByID = (request, response, next) => {
    const {article_id} = request.params

    retrieveArticleByID(article_id).then((article) => {
        
        response.status(200).send({article: article})
    })
    .catch((error) => {

        next(error)
    })
}

module.exports = {getTopics, getArticles, getArticleByID}