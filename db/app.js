const express = require('express');
const {getTopics, getArticles, getArticleByID, getCommentsByArticleID, patchArticleByID} = require(`${__dirname}/controller.js`);


const app = express()
app.use(express.json());

app.get('/api/topics', getTopics);

app.get('/api/articles', getArticles);

app.get('/api/articles/:article_id', getArticleByID);

app.get('/api/articles/:article_id/comments', getCommentsByArticleID)

app.patch('/api/articles/:article_id', patchArticleByID)


app.use((request, response, next) => {

    response.status(404).send({msg: 'Path not found'})
})

app.use((error, request, response, next) => {

    if(error.status && error.msg) {

        response.status(error.status).send({msg: error.msg})
    }
    else {
        next(error)
    }
}) 

app.use((error, request, response, next) => {
    console.log(error);
    response.status(404).send({message: 'Something went wrong'})
})

module.exports = app