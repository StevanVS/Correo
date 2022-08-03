function login(req, res, next) {
    // todo: eliminar al final
    req.session.userid = 2;
    // todo

    if (!req.session.userid) {
        res.redirect('/login');
    } else {
        next();
    }
}


module.exports = {
    login
};