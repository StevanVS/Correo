const { query } = require('../connection');
const { httpError } = require('../helpers/handleError');

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

function createUser(req, res) {
    const user = req.body;
    const sql = 'INSERT INTO users SET ?';

    query(sql, user, (err, rows) => {
        if (err) console.log(err);
        res.status(201).send(`New User ID: ${rows.insertId}`);
    })
}

function editUser(req, res) {
    const { id, ...user } = req.body;
    const sql = 'UPDATE users SET ? WHERE id = ?';

    query(sql, [user, id], (err, rows) => {
        if (err) console.log(err);
        res.send(`User ${id} Updated: ${rows.message})`);
    })
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
        userId = req.session.userid;
        if (userId) {
            const result = await query('SELECT * FROM users WHERE id = ?', req.session.userid);
            const user = await result[0];
            res.send(user)
        }
    } catch (err) {
        httpError(res, err)
    }
    res.end()
}

module.exports = {
    getUsers,
    getUser,
    createUser,
    editUser,
    deleteUser,
    getCurrentUser,
}