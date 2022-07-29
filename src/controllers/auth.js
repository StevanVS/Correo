const { query } = require('../connection');
const { httpError } = require('../helpers/handleError');

async function loginControl(req, res) {
    try {
        const { email_address, password } = req.body;
        const sql = 'SELECT * FROM users WHERE email_address = ? and password = ?';

        const result = await query(sql, [email_address, password])
        const user = await result[0];

        if (user) {
            const session = req.session;
            session.userid = user.id;
            // console.log(JSON.stringify(session));
            query('update session_info set session = ?', JSON.stringify(session));
        }

        res.send(user);
    } catch (err) {
        httpError(res, err)
    }

}

async function singupControl(req, res) {
    try {
        const newUser = req.body;

        // VALIDAR SI NO SE REPITE EL EMAIL

        await query('INSERT INTO users SET ?', newUser);

        res.status(201).send()

    } catch (err) {
        httpError(res, err)
    }
}

module.exports = {
    loginControl,
    singupControl
}