const { query } = require('../connection');
const { httpError } = require('../helpers/handleError');
const bcrypt = require('bcrypt');

async function authControl(req, res) {
    if (req.body.type === 'login') loginControl(req, res);
    if (req.body.type === 'singup') singupControl(req, res);
}

async function loginControl(req, res) {
    try {
        const { email_address, password } = req.body;

        const user = await query(
            'SELECT * FROM users WHERE email_address = ?',
            email_address
        ).then(r => r[0]);

        if (!user) {
            res.send({ error: 'No existe usuario' });
            return;
        }

        if (await bcrypt.compare(password, user.password)) {
            req.session.userId = user.id;
            res.send({ success: `Bienvenido ${user.name}` });
        } else {
            res.send({ error: 'Credenciales Incorrectas' });
        }
    } catch (err) {
        httpError(res, err)
    }

}

async function singupControl(req, res) {
    try {
        const { type, ...newUser } = req.body;

        const user = await query(
            'SELECT * FROM users WHERE email_address = ?',
            newUser.email_address
        ).then(r => r[0]);

        if (user) {
            res.send({ error: 'Ya existe un usuario registrado con este correo' });
            return;
        }

        //Encriptar contrasenia
        newUser.password = await bcrypt.hash(newUser.password, 8);


        const result = await query('INSERT INTO users SET ?', newUser);

        req.session.userId = result.insertId;

        res.status(201).send(result);
    } catch (err) {
        httpError(res, err)
    }
}

function logoutControl(req, res) {
    if (req.session) req.session.destroy();

    res.redirect('/login-singup');
}

module.exports = {
    authControl,
    logoutControl,
}