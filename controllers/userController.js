// controllers/userController.js

const User = require("../models/user");

exports.getAllUsers = async (req, res) => {
	try {
		const users = await User.find({}, "-password");
		res.json(users);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

exports.getUser = async (req, res) => {
	try {
		const userId = req.params.id;

		// Check if the requested user ID matches the authenticated user's ID
		if (userId !== req.user._id.toString()) {
			return res
				.status(403)
				.json({
					message: "Access denied. You can only view your own profile.",
				});
		}

		const user = await User.findById(userId).select("-password");

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		res.json(user);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};
 
exports.updateUser = async (req, res) => {
	const updates = Object.keys(req.body);
	const allowedUpdates = ["username", "email", "password"];
	const isValidOperation = updates.every((update) =>
		allowedUpdates.includes(update)
	);

	if (!isValidOperation) {
		return res.status(400).json({ message: "Invalid updates!" });
	}

	try {
		const userId = req.params.id;

        // Check if the requested user ID matches the authenticated user's ID
        if (userId !== req.user._id.toString()) {
            return res.status(403).json({ message: "Access denied. You can only update your own profile." });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        updates.forEach((update) => (user[update] = req.body[update]));
        await user.save();
        
        // Remove password from the response
        const userResponse = user.toObject();
        delete userResponse.password;
        
        res.json(userResponse);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

exports.deleteUser = async (req, res) => {
	try {
		const userId = req.params.id;

        // Check if the user is an admin or the owner of the profile
        if (!req.user.isAdmin && userId !== req.user._id.toString()) {
            return res.status(403).json({ message: "Access denied. You can only delete your own profile or you must be an admin." });
        }

        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ message: "User deleted successfully" });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};
