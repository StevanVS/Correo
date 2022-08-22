function login(req, res, next) {
    // todo: eliminar al final
    // req.session.userId = 2;
    // todo

    if (!req.session.userId) {
        res.redirect('/login-singup');
    } else {
        next();
    }
}


module.exports = {
    login
};