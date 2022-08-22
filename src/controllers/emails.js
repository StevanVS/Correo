const con = require('../connection');
const { query } = require('../connection');
const { getUserId } = require('../helpers/getUserId')
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

async function getHistoryId(req, res) {
    try {
        const userId = getUserId(req);

        const historyId = await query('select max(id) as id from history where user_id = ?', userId)
            .then(r => r[0]);
        res.send(historyId)
    } catch (err) {
        httpError(res, err);
    }
}

async function getUserEmails(req, res) {
    try {
        const userId = getUserId(req);
        const labelId = req.params.labelId;

        let sql = 'select * from user_emails where user_id = ? and label_id = ?';

        let userEmails = await query(sql, [userId, labelId]);

        let emails = [];

        for (const userEmail of userEmails) {
            let email;

            if (userEmail.email_id > 0 || userEmail.label_id !== 'DRAFT') {
                email = await query('select * from emails where id = ?', userEmail.email_id)
                    .then(r => r[0]);

                email.to_user = await query('select * from users where id = ?', email.to_user)
                    .then(r => r[0]);
            } else {
                email = await query('select * from drafts where id = ?', userEmail.draft_id)
                    .then(r => r[0]);
            }

            if (email == null) continue;

            email.from_user = await query('select * from users where id = ?', email.from_user)
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
// PATCH {  values: {labelId, emailId}, newLabelId: "DELETED" }
async function changeEmailLabel(req, res) {
    try {
        const userId = getUserId(req);
        const { newLabelId } = req.body;
        let { labelId, emailId } = req.body.values

        const sql = 'UPDATE user_emails set label_id = ? where user_id = ? and label_id = ? AND email_id = ?';

        const response = await query(sql, [newLabelId, userId, labelId, emailId]);

        res.send(response)
    } catch (err) {
        httpError(res, err)
    }
}

// PUT /api/users/:userId/emails/:emailId
async function editEmail(req, res) {
    try {
        const emailId = req.params.emailId;
        const values = req.body;
        const sql = 'UPDATE emails SET ? where id = ?';
        const result = await query(sql, [values, emailId]);
        res.send(result)
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
    getHistoryId,
    changeEmailLabel,
    editEmail,
}