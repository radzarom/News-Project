const db = require(`${__dirname}/connection.js`)
const format = require('pg-format')



const retrieveTopics = () => {

    const sqlQuery = 'SELECT slug, description FROM topics'

    return db.query(sqlQuery).then((results) => results.rows)
}

const retrieveArticles = (topic, sort_by = 'created_at', order = 'desc', limit = 0) => {

    const limitConvert = Number(limit)

    const columnWhiteList = ['author', 'title', 'article_id', 'topic', 'created_at', 'votes', 'article_img_url', 'comment_count']
    const orderWhiteList = ['asc', 'desc', 'ASC', 'DESC']

    if(!columnWhiteList.includes(sort_by)) {
        return Promise.reject({status:400, msg: 'Invalid column name to sort by'})
    }

    if(!orderWhiteList.includes(order)) {
        return Promise.reject({status:400, msg: 'Invalid ordering request'})
    }

    if(typeof limitConvert != 'number' || isNaN(limitConvert)) {
        return Promise.reject({status:400, msg: 'Invalid limit, must me number'})
    }
    
    let sqlQuery = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, CAST(COUNT(comments.article_id) AS INTEGER) AS "comment_count"
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    `
    const queryValues = []

    return retrieveTopics().then((results) => {
        
        const validTopics = results.map( topic => topic.slug);

        if(topic) {
            if(validTopics.includes(topic)) {

                sqlQuery += ` WHERE articles.topic = $1`;
                queryValues.push(topic);
            }
            else return Promise.reject({status: 404, msg: 'Invalid topic name used'})
        }
        sqlQuery += ` GROUP BY articles.article_id`
        sqlQuery += ` ORDER BY ${sort_by} ${order}`

        if(limitConvert > 0) {
            sqlQuery += ` LIMIT ${limitConvert}`
        }
        
        return db.query(sqlQuery, queryValues).then((results) => {
            
            return results.rows
        })
    })
}

const retrieveArticleByID = (article_id) => {
    
    const sqlQuery = `SELECT articles.* , CAST(COUNT(comments.article_id) AS INT) AS "comment_count"
                        FROM articles
                        LEFT JOIN comments ON comments.article_id = articles.article_id
                        WHERE articles.article_id = $1
                        GROUP BY articles.article_id`

    return db.query(sqlQuery, [article_id]).then((results) => {
    
        if(results.rows.length === 0) {
            
            return Promise.reject({status: 404, msg: 'No article with this ID found'})
        } 
        
        return results.rows[0]

    })
}

const retrieveCommentsByArticleID = (article_id) => {

    const sqlQuery = `SELECT * FROM comments
                        WHERE article_id = $1
                        ORDER BY created_at DESC`

    return db.query(sqlQuery, [article_id]).then((results) => {

        return results.rows
    })
}

const addCommentByID = (article_id, commentData) => {

    if(!/^\d+$/.test(article_id)) {

        return Promise.reject({status: 400, msg:'The ID used is not the correct data type'})
    }

    for(let prop in commentData) {

        if(!['username', 'body'].includes(prop)){
            return Promise.reject({status: 400, msg: 'Invalid column names'})
        }

     
        if(typeof commentData[prop] != 'string' || commentData[prop] === '') {
            return Promise.reject({status:400, msg: `Invalid value for ${prop}` })
        }
        
    }
    
    const {username, body} = commentData

    const values = [[body, article_id, username, 0, 'now()']]
        
    const sqlQuery = format(`INSERT INTO comments
                            (body, article_id, author, votes, created_at)
                            VALUES
                            %L
                            RETURNING *`,
                            values)

    return db.query(sqlQuery).then((results) => {

        return results.rows[0];
    })
    
}

const updateArticleByID = (article_id, body) => {

    if(!/^\d+$/.test(article_id)) {

        return Promise.reject({status: 400, msg: 'The article ID is the wrong data type'})
    }

    if(!body.hasOwnProperty('inc_votes') || typeof body.inc_votes != 'number') {
        
        return Promise.reject({status: 400, msg: 'Votes data not sent in correct format'})
    }

    const {inc_votes} = body

    const sqlQuery = `UPDATE articles
                        SET votes = votes + $1
                        WHERE article_id = $2
                        RETURNING *`

    return db.query(sqlQuery, [inc_votes, article_id]).then((results) => {

        if(results.rows[0] === undefined) {

            return Promise.reject({status: 404, msg:'No article with that ID exists'})
        }

        return results.rows[0];
    })
}

const retrieveUsers = () => {

    const sqlQuery = `SELECT * FROM users`

    return db.query(sqlQuery).then((results) => {

        return results.rows;
    })
}

const removeCommentByID = (comment_id) => {

    if(!/^\d+$/.test(comment_id)) {
        return Promise.reject({status: 400, msg: 'Comment ID is the wrong data type'})
    }

    const sqlQueryCheckExists = `SELECT * FROM comments
                                WHERE comment_id = $1`

    const sqlQueryDelete = `DELETE FROM comments
                        WHERE comment_id = $1`

    return db.query(sqlQueryCheckExists, [comment_id]).then((results) => {

        if(results.rows.length === 0) {
            return Promise.reject({status: 404, msg: 'Could not delete comment with this ID as it did not exist'})
        }
        
        return db.query(sqlQueryDelete, [comment_id])
    })

}

module.exports = {retrieveTopics, retrieveArticles, retrieveArticleByID, retrieveCommentsByArticleID, addCommentByID, updateArticleByID, retrieveUsers, removeCommentByID}


