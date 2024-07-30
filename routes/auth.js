const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const auth = require("../middleware/auth");
const User = require("../models/user");
const isAdmin = require("../middleware/isadmin");

// route to create the first admin

router.post("/create-first-admin", authController.createFirstAdmin);

// route to create the first admin

router.post("/create-admin", auth, authController.createAdmin);
router.post("/admin", auth, isAdmin, authController.admin);
router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/profile", auth, (req, res) => res.json(req.user));
router.patch("/profile", auth, authController.updateProfile);
router.delete("/profile", auth, authController.deleteProfile);

module.exports = router;
