const {retrieveTopics} = require(`${__dirname}/model.js`)


const getTopics = (request, response, next) => {

    retrieveTopics().then((topics) => {

        response.status(200).send({topics: topics});
    })
    .catch((err) => {
        next(err);
    })
}

module.exports = {getTopics}