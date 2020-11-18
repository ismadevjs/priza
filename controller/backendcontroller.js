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
exports.categoriesEdit = function (req, res) {
  const category = new Category(req.body, req.session.user._id, req.params.id);
  category
    .edit()
    .then(() => {
      req.flash("errors", "Category just Edited!");
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
exports.categoriesDelete = function (req, res) {
  const category = new Category(req.body, req.session.user._id, req.params.id);
  category
    .delete()
    .then(() => {
      req.flash("errors", "Category just Deleted!");
      req.session.save(() => {
        res.redirect("/admin/categories");
      });
    })
    .catch(e => {
      req.flash("errors", "Somthing went wrong");
      req.session.save(() => {
        res.redirect("/admin/categories");
      });
    });
};