const express = require('express');
const {getTopics} = require(`${__dirname}/controller.js`);

const app = express()
app.use(express.json());

app.get('/api/topics', getTopics)

app.use((request, response, next) => {

    response.status(404).send({msg: 'Path not found'})
})

app.use((error, request, response, next) => {

    response.status(404).send({message: 'Something went wrong'})
})

module.exports = app