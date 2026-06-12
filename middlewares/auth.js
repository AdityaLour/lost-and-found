function requireAuth(req, res, next) {
  if (!req.user) {
    return res.redirect("/auth/getstarted?form=login");
  }

  next();
}

module.exports = requireAuth;
