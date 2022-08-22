const { query } = require('../connection');
const { httpError } = require('../helpers/handleError');
const { getUserId } = require('../helpers/getUserId');

function getUsers(req, res) {
    query('SELECT * FROM users', (err, rows) => {
        if (err) console.log(err);
        res.send(rows);
    })
}

function getUser(req, res) {
    query('SELECT * FROM users WHERE id = ?', req.params.userId,
        (err, rows) => {
            if (err) console.log(err);
            res.send(rows[0]);
        })
}

async function createUser(req, res) {
    const user = req.body;
    const sql = 'INSERT INTO users SET ?';

    const result = await query(sql, user);

    res.status(201).send(result);
}

async function editUser(req, res) {
    try {
        const userId = getUserId(req);
        const values = req.body;
        const sql = 'UPDATE users SET ? WHERE id = ?';
        const result = await query(sql, [values, userId]);
        res.send(result);
    } catch (err) {
        httpError(res, err)
    }
}

function deleteUser(req, res) {
    const id = req.params.userId;
    query('DELETE FROM users WHERE id = ?', id, (err, rows) => {
        if (err) console.log(err);
        if (rows.affectedRows > 0)
            res.send(`User ${id} Deleted`);
        else
            res.status(404).send('User not Found');
    })
}

async function getCurrentUser(req, res) {
    try {
        userId = req.session.userId;
        if (userId) {
            const result = await query('SELECT * FROM users WHERE id = ?', req.session.userId);
            const user = await result[0];
            res.send(user)
        }
    } catch (err) {
        httpError(res, err)
    }
    res.end()
}


async function getUserByEmail(req, res) {
    try {
        const sql = 'SELECT * FROM users WHERE email_address = ?';
        const result = await query(sql, req.params.email);
        const user = await result[0];
        res.send(user);
    } catch (err) {
        httpError(res, err);
    }

    res.end();
}

async function getUserLabels(req, res) {
    try {
        // const userId = getUserId(req);
        const sql = 'select * from labels'
        const result = await query(sql);
        res.send(result);
    } catch (err) {
        httpError(res, err);
    }
}

module.exports = {
    getUsers,
    getUser,
    createUser,
    editUser,
    deleteUser,
    getCurrentUser,
    getUserByEmail,
    getUserLabels,
}