const User = require("../model/User");
exports.index = function (req, res) {
  res.render("frontend/index");
};
exports.items = function (req, res) {
  res.render("frontend/items");
};
exports.register = function (req, res) {
  res.render("frontend/register");
};
exports.registerPost = function (req, res) {
  const user = new User(req.body);
  user
    .create()
    .then(() => {
      req.flash("errors", "Yaay, You just Signed Up!");
      req.session.save(() => {
        res.redirect("/login");
      });
    })
    .catch(e => {
      req.flash("errors", e);
      req.session.save(() => {
        res.redirect("/register");
      });
    });
};
exports.login = function (req, res) {
  res.render("frontend/login");
};
exports.loginPost = function (req, res) {
  const user = new User(req.body);
  user
    .access()
    .then(client => {
      req.session.user = { username: client.username, email: client.email, role: client.role, joined: client.created_at };
      req.flash("errors", "Welcome Back!");
      req.session.save(() => {
        res.redirect("/");
      });
    })
    .catch(e => {
      req.flash("errors", e);
      req.session.save(() => {
        res.redirect("/register");
      });
    });
};
exports.logout = function (req, res) {
  req.session.destroy(() => {
    res.redirect("/");
  });
};
exports.forgotPassword = function (req, res) {
  res.render("frontend/forgot-password");
};
exports.forgotPasswordPost = function (req, res) {
  const user = new User(req.body, null, null, req.originalUrl);
  user
    .passwordForgot()
    .then(() => {
      req.flash("errors", "A link has been sent to your inbox!");
      req.session.save(() => {
        res.redirect("/login");
      });
    })
    .catch(e => {
      req.flash("errors", e);
      req.session.save(() => {
        res.redirect("/password-forgot");
      });
    });
};
