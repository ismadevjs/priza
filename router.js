const express = require("express");
const router = express.Router();
const multer = require("multer");
const userController = require("./controller/userController");
const backendController = require("./controller/backendController");
const isAuthenticated = require("./middleware/auth");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now());
  }
});
const upload = multer({ storage: storage });

// frontend area
router.get("/", userController.index);
router.get("/items", userController.items);

// backend area
router.get("/admin", isAuthenticated.isAdminAuthenticated, backendController.index);
router.get("/register", isAuthenticated.isAuthenticated, userController.register);
router.post("/register", isAuthenticated.isAuthenticated, userController.registerPost);
router.get("/login", isAuthenticated.isAuthenticated, userController.login);
router.post("/login", isAuthenticated.isAuthenticated, userController.loginPost);
router.get("/logout", userController.logout);
router.get("/password-forgot", isAuthenticated.isAuthenticated, userController.forgotPassword);
router.post("/password-forgot", isAuthenticated.isAuthenticated, userController.forgotPasswordPost);
router.get("/password-forgot/:email/:code", isAuthenticated.isAuthenticated, userController.code);
router.post("/password-new", isAuthenticated.isAuthenticated, userController.newPassword);
router.get("/404", userController.errorPage);
// router.get("/admin/categories", isAuthenticated.isNotAuth, backendController.categories);
// router.post("/admin/categories/add", isAuthenticated.isNotAuth, backendController.categoriesAdd);
// router.post("/admin/categories/:id/edit", isAuthenticated.isNotAuth, backendController.categoriesEdit);
// router.post("/admin/categories/:id/delete", isAuthenticated.isNotAuth, backendController.categoriesDelete);
// router.post("/admin/categories/bulk_del", isAuthenticated.isNotAuth, backendController.categoriesBulkDelete);
// router.get("/admin/categories/deleteAll", isAuthenticated.isNotAuth, backendController.categoriesAllDelete);
module.exports = router;
