const app = require(`${__dirname}/db/app.js`);

const { PORT = 9090} = process.env;

app.listen(PORT, () => console.log(`Listening on port ${PORT}...`))