const con = require('../connection');
const { httpError } = require('../helpers/handleError');

function getDrafts(req, res) {
    con.query('SELECT * FROM users', (err, rows) => {
        if (err) console.log(err);
        res.send(rows);
    })
}

function getDraft(req, res) {
    const id = req.params.draftId;
    con.query('SELECT * FROM drafts WHERE id = ?', id, (err, rows) => {
        if (err) console.log(err);
        res.send(rows);
    })
}

function createDraft(req, res) {
    const sql = 'INSERT INTO drafts (from_user) VALUES (?)';

    con.query(sql, [req.body.from_user], (err, rows) => {
        if (err) console.log(err);
        res.status(201).send(`Created Draft with ID: ${rows.insertId}`);
    })
}

function editDraft(req, res) {
    const {id, ...draft} = req.body;
    const sql = 'UPDATE drafts SET ? WHERE id = ?';

    con.query(sql, [draft, id], (err, rows) => {
        if (err) console.log(err);
        res.send(`Draft ${id} Updated: ${rows.message})`);
    })
}

function deleteDraft(req, res) {
    const id = req.params.draftId;
    con.query('DELETE FROM drafts WHERE id = ?', id, (err, rows) => {
        if (err) console.log(err);
        if (rows.affectedRows > 0)
            res.send(`Draft ${id} Deleted`);
        else
            res.status(404).send('Draft not Found')
    })
}

async function getDraftsFrom(req, res) {
    try {
        const userId = req.params.userId;
        const sql = 'SELECT * FROM drafts WHERE from_user = ?';
        const result = await con.query(sql, userId)
        res.send(result);
    } catch (err) {
        httpError(res, err);
    }
    res.end();
}

module.exports = {
    getDrafts,
    getDraft,
    createDraft,
    editDraft,
    deleteDraft,
    getDraftsFrom,
}