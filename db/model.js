const db = require(`${__dirname}/connection.js`)


const retrieveTopics = () => {

    const sqlQuery = 'SELECT slug, description FROM topics'

    return db.query(sqlQuery).then((results) => {

        return results.rows
    })
}

module.exports = {retrieveTopics}