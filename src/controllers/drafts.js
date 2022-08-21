const { query } = require('../connection');
const con = require('../connection');
const { getUserId } = require('../helpers/getUserId');
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

async function createDraft(req, res) {
    try {
        const userId = getUserId(req);
        const sql = 'INSERT INTO drafts (from_user) VALUES (?)';
        const result = await query(sql, userId);
        res.status(201).send(result)
    } catch (err) {
        httpError(res, err);
    }



    // const sql = 'INSERT INTO drafts (from_user) VALUES (?)';

    // con.query(sql, [req.body.from_user], (err, rows) => {
    //     if (err) console.log(err);
    //     res.status(201).send(`Created Draft with ID: ${rows.insertId}`);
    // })
}

function editDraft(req, res) {
    const { id, ...draft } = req.body;
    const sql = 'UPDATE drafts SET ? WHERE id = ?';

    con.query(sql, [draft, id], (err, rows) => {
        if (err) console.log(err);
        res.send(`Draft ${id} Updated: ${rows.message})`);
    })
}

async function deleteDraft(req, res) {
    try {
        const userId = getUserId(req);
        const draftId = req.params.draftId;

        const sql = 'DELETE FROM user_emails where user_id = ? and draft_id = ?';

        // const sql ='DELETE FROM drafts WHERE id = ?';

        const result = await query(sql, [userId, draftId]);

        res.send(result);
    } catch (err) {
        httpError(res, err)
    }
}

async function getDraftsFrom(req, res) {
    try {
        const userId = req.params.userId;
        const sql = 'SELECT * FROM drafts WHERE from_user = ? ORDER BY date DESC';
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