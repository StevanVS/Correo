const con = require('../connection');


function getEmails(req, res) {
    const sql = 'SELECT * FROM emails ORDER BY date DESC';

    con.query(sql, req.params.emailId, (err, rows) => {
        if (err) console.log(err);
        res.send(rows);
    })
}

function getEmailsFrom(req, res) {
    const sql = 'SELECT * FROM emails WHERE from_user = ? ORDER BY date DESC';

    con.query(sql, req.params.userId, (err, rows) => {
        if (err) console.log(err);
        res.send(rows);
    })
}

function getEmailsTo(req, res) {
    const sql = 'SELECT * FROM emails WHERE to_user = ? ORDER BY date DESC';

    con.query(sql, req.params.userId, (err, rows) => {
        if (err) console.log(err);
        res.send(rows);
    })
}

function getEmail(req, res) {
    const sql = 'SELECT * FROM emails WHERE id = ?';

    con.query(sql, req.params.emailId, (err, rows) => {
        if (err) console.log(err);
        res.send(rows);
    })
}

function sendEmail(req, res) {
    const email = req.body;
    const sql = 'INSERT INTO emails SET ?';

    con.query(sql, email, (err, rows) => {
        if (err) console.log(err);
        res.send(`Email Send with ID: ${rows.insertId}`);
    })
}

function deleteEmail(req, res) {
    const id = req.params.emailId;
    con.query('DELETE FROM emails WHERE id = ?', id, (err, rows) => {
        if (err) console.log(err);
        if (rows.affectedRows > 0)
            res.send(`Email ${id} Deleted`);
        else
            res.status(404).send('Email not Found');
    })
}

module.exports = {
    getEmails,
    getEmailsFrom,
    getEmailsTo,
    getEmail,
    sendEmail,
    deleteEmail,
}