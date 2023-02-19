# Northcoders News API

## Hosted Version

[Available here](https://news-api-wh0q.onrender.com)

The page loads with default error message when the path is not specified.

Please append the URL to test various endpoints, e.g. /api/articles?sort_by=created_at

Append with /api to see a list of available endpoints and descriptions.


## Summary

This project is an API for accessing application data and is intended to mimic the building of a real world backend service which should provide this information to front end architecture.

# Instructions

## Cloning

On the main page for this repository, click 'Code' and copy the URL, then at the command line do:

    git clone <URL>

## Dependencies

From inside the created folder, install dependencies:

    npm install

## Seeding

Inside package.json you will see a list of various "scripts". To seed the database:

    npm run setup-dbs

    npm run seed


## Testing

To use the provided test suite, there is another script. Run:

    npm test


## dotenv
In order to connect to the 2 databases locally please create 2 .env files:
- a .env.development file containing PGDATABASE=nc_news
- a .env.test file containing PGDATABASE=nc_news_test

If you wish to host the database remotely, you will need to create a new file called .env.production and add the line:

    DATABASE_URL=<url here>

using the url provided by the host.

## Minimum requirements

It is recommended to use minimum Node v19.0.0 and Postgres 14.6