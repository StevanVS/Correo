const mysql = require('mysql');
const util = require('util')

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'repartidor',
    password: 'repar',
    database: 'correo',
})

connection.connect((err) => {
    if (err) throw err;
    console.log('Conection Established with DB');
});

connection.query = util.promisify(connection.query).bind(connection);

module.exports = connection;