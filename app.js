const express = require("express");
const app = express();
const ejs = require("ejs");
const router = require("./router");

const flash = require("connect-flash");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const MongoStore = require("connect-mongo")(session);
const toastr = require("express-toastr");
let sessionOptions = session({
  secret: "learn javascript from scratch",
  store: new MongoStore({
    client: require("./db"),
    httpOnly: true
  }),
  resave: false,
  saveUninitialized: true,
  maxAge: 1000 * 60 * 60 * 24,
  cookies: { secure: true }
});

app.use(sessionOptions);
app.use(cookieParser());
app.use(flash());
app.use(toastr());
app.use(function (req, res, next) {
  res.locals.user = req.session.user;
  next();
});
app.use(function (req, res, next) {
  res.locals.admin = req.session.admin;
  next();
});
app.use(function (req, res, next) {
  res.locals.toasts = req.toastr.render();
  next();
});
app.use(function (req, res, next) {
  res.locals.message = req.flash('errors');
  next();
});
app.use(express.static("public"));
app.use(express.static("uploads"));
app.set("views", "views");
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/", router);

module.exports = app;
