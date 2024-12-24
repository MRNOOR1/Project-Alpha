const jwt = require("jsonwebtoken");

function decodeCookie(req, res, next) {
  try {
    const decoded = jwt.verify(req.cookies.cookie, process.env.JWTSECRET);
    req.user = decoded;
  } catch {
    req.user = false;
  }

  res.locals.user = req.user;
  next();
}

function mustBeLoggedIn(req, res, next) {
  if (req.user) {
    return next();
  }
  return res.redirect("/");
}

module.exports = { decodeCookie, mustBeLoggedIn };
