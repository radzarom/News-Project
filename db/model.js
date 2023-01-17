const db = require(`${__dirname}/connection.js`)


const retrieveTopics = () => {

    const sqlQuery = 'SELECT slug, description FROM topics'

    return db.query(sqlQuery).then((results) => results.rows)
}

const retrieveArticles = () => {

    const sqlQuery = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, CAST(COUNT(comments.article_id) AS INTEGER) AS "comment_count"
                        FROM articles
                        LEFT JOIN comments ON articles.article_id = comments.article_id
                        GROUP BY articles.article_id
                        ORDER BY created_at DESC`

    return db.query(sqlQuery).then((results) => results.rows)
}

module.exports = {retrieveTopics, retrieveArticles}