const mysql = require('mysql');
const util = require('util');
require('dotenv').config();

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    dateStrings: [
        'DATE',
        'TIMESTAMP',
    ],
    timezone: 'local'
})

connection.connect((err) => {
    if (err) throw err;
    console.log('Conection Established with DB');
});

connection.query = util.promisify(connection.query).bind(connection);

module.exports = connection;