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

function authenticateUser(req, res, next) {
  const token = req.cookies.cookie; // Access the token from the cookie named 'cookie'

  if (!token) {
    return res.status(401).json({ error: "Authentication required." });
  }

  try {
    // Verify the token using the same secret used to sign it
    const decoded = jwt.verify(token, process.env.JWTSECRET);

    // Attach the userid to the request object for later use
    req.userId = decoded.userid;
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    console.error("Error verifying token:", err);
    res.status(403).json({ error: "Invalid or expired token." });
  }
}

module.exports = { decodeCookie, mustBeLoggedIn, authenticateUser };
