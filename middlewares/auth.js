function requireAuth(req, res, next) {
  if (!req.user) {
    return res.redirect("/auth/getstarted");
  }

  next();
}

module.exports = requireAuth;
