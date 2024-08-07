const User = require("../models/user");
const { generateToken } = require("../utils/token");
const Booking = require("../models/booking");
exports.register = async (req, res) => {
	try {
		const { username, email, password } = req.body;
		const user = new User({ username, email, password });
		await user.save();
		const token = generateToken(user._id);
		res.status(201).json({ user, token });
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

exports.login = async (req, res) => {
	try {
		const { email, password } = req.body;
		const user = await User.findOne({ email });
		if (!user || !(await user.comparePassword(password))) {
			return res.status(401).json({ message: "Invalid email or password" });
		}
		const token = generateToken(user._id);
		res.json({ user, token });
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

exports.getProfile = async (req, res) => {
	res.json(req.user);
};

// exports.updateProfile = async (req, res) => {
// 	const updates = Object.keys(req.body);
// 	const allowedUpdates = ["username", "email", "password"];
// 	const isValidOperation = updates.every((update) =>
// 		allowedUpdates.includes(update)
// 	);

// 	if (!isValidOperation) {
// 		return res.status(400).json({ message: "Invalid updates!" });
// 	}

// 	try {
// 		updates.forEach((update) => (req.user[update] = req.body[update]));
// 		await req.user.save();
// 		res.json(req.user);
// 	} catch (error) {
// 		res.status(400).json({ message: error.message });
// 	}
// };

// exports.deleteProfile = async (req, res) => {
// 	try {
// 		await req.user.remove();
// 		res.json({ message: "User deleted successfully" });
// 	} catch (error) {
// 		res.status(500).json({ message: error.message });
// 	}
// };

exports.createAdmin = async (req, res) => {
	try {
		const { username, email, password } = req.body;

		// console.log(req);

		// Check if the user making the request is already an admin
		if (!req.user.isAdmin) {
			return res
				.status(403)
				.json({ message: "Only admins can create other admins" });
		}

		const user = new User({
			username,
			email,
			password,
			isAdmin: true,
		});

		await user.save();
		const token = generateToken(user._id);
		res.status(201).json({ user, token });
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

exports.createFirstAdmin = async (req, res) => {
	try {
		const { username, email, password } = req.body;
		console.log(req.body);
		const adminCount = await User.countDocuments({ isAdmin: true });
		if (adminCount === 0) {
			const user = new User({
				username,
				email,
				password,
				isAdmin: true,
			});
			await user.save();
			res.json({ message: "Admin created successfully" });
		} else {
			res.json({ message: "Admin already exists" });
		}
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};
