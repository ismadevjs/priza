const categoryCollection = require("../db").db().collection("categories");
const Category = require("../model/Category");
exports.index = function (req, res) {
  res.render("backend/index");
};
exports.categories = async function (req, res) {
  res.render("backend/categories", {
    categories : await categoryCollection.find().toArray()
  });
};
exports.categoriesAdd = function (req, res) {
  const category = new Category(req.body, req.session.user._id);
  category
    .add()
    .then(() => {
      req.flash("errors", "Category just added!");
      req.session.save(() => {
        res.redirect("/admin/categories");
      });
    })
    .catch(e => {
      req.flash("errors", e);
      req.session.save(() => {
        res.redirect("/admin/categories");
      });
    });
};
