// routes/users.js

const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const auth = require("../middleware/auth");

// Assuming you have an isAdmin middleware to check if the user is an admin
const isAdmin = (req, res, next) => {
	if (req.user && req.user.isAdmin) {
		next();
	} else {
		res.status(403).json({ message: "Access denied. Admin only." });
	}
};

router.get("/", auth, isAdmin, userController.getAllUsers);
router.get("/:id", auth, isAdmin, userController.getUser);
router.patch("/:id", auth, isAdmin, userController.updateUser);
router.delete("/:id", auth, isAdmin, userController.deleteUser);

module.exports = router;
