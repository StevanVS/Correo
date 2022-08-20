const { query } = require('../connection');
const { httpError } = require('../helpers/handleError');

async function authControl(req, res) {
    if (req.body.type === 'login') loginControl(req, res);
    if (req.body.type === 'singup') singupControl(req, res);
}

async function loginControl(req, res) {
    try {
        const { email_address, password } = req.body;
        const sql = 'SELECT * FROM users WHERE email_address = ? and password = ?';

        const result = await query(sql, [email_address, password])
        const user = await result[0];

        if (user) {
            const session = req.session;
            session.userId = user.id;
        }

        res.send(user);
    } catch (err) {
        httpError(res, err)
    }

}

async function singupControl(req, res) {
    try {
        const { type, ...newUser } = req.body;

        // VALIDAR SI NO SE REPITE EL EMAIL

        const sql = 'INSERT INTO users SET ?';

        const result = await query(sql, newUser);

        req.session.userId = result.insertId;

        res.status(201).send(result);
    } catch (err) {
        httpError(res, err)
    }
}

module.exports = {
    loginControl,
    singupControl,
    authControl,
}