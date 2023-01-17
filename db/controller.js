const {retrieveTopics, retrieveArticles} = require(`${__dirname}/model.js`)


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

module.exports = {getTopics, getArticles}