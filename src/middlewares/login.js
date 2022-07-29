function login(req, res, next) {
    if (!req.session.userid) {
        res.redirect('/login');
    } else {
        next();
    }
}


module.exports = {
    login
};