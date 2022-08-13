const con = require('../connection');
const { query } = require('../connection');
const { httpError } = require('../helpers/handleError');


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

async function getUserEmails(req, res) {
    try {
        const userId = (req.params.userId === 'me' && req.session.userid) ? req.session.userid : req.params.userId;

        let userEmails = await query('select * from user_emails where user_id = ?', userId);

        if (req.query.labelId != null) {
            const labelIds = [req.query.labelId].flat();

            userEmails = userEmails
                .filter(userEmail => labelIds
                    .some(labelId => labelId === userEmail.label_id));
        }


        let emails = [];

        for (const userEmail of userEmails) {
            const email = await query('select * from emails where id = ?', userEmail.email_id)
                .then(r => r[0]);

            email.from_user = await query('select * from users where id = ?', email.from_user)
                .then(r => r[0]);

            email.to_user = await query('select * from users where id = ?', email.to_user)
                .then(r => r[0]);

            email.label = await query('select * from labels where id = ?', userEmail.label_id)
                .then(r => r[0]);

            emails.push(email);
        }

        res.send(emails)
    } catch (err) {
        httpError(res, err)
    }
}

module.exports = {
    getEmails,
    getEmailsFrom,
    getEmailsTo,
    getEmail,
    sendEmail,
    deleteEmail,
    getUserEmails,
}