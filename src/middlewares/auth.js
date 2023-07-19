function login(req, res, next) {
  // todo: eliminar al final
  // req.session.userId = 7;
  // todo

  if (!req.session.userId) {
    res.redirect("/login-singup");
  } else {
    next();
  }
}

function singup(req, res, next) {
  if (req.session.userId) res.redirect("/");
  else next();
}

module.exports = {
  login,
  singup,
};
