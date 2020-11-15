exports.isAdminAuthenticated = function (req, res, next) {
  if (req.session.user.role === "admin") {
    next();
  } else {
    req.flash("errors", "Sorry You don't have access");
    req.session.save(function () {
      res.redirect("/");
    });
  }
};
exports.isAuthenticated = function (req, res, next) {
  if (req.session.user) {
    req.flash("errors", "Please logout first");
    req.session.save(() => {
      res.redirect("/");
    });
  } else {
    next();
  }
};
