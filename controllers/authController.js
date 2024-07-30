const User = require("../models/user");
const { generateToken } = require("../utils/token");

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

exports.updateProfile = async (req, res) => {
	const updates = Object.keys(req.body);
	const allowedUpdates = ["username", "email", "password"];
	const isValidOperation = updates.every((update) =>
		allowedUpdates.includes(update)
	);

	if (!isValidOperation) {
		return res.status(400).json({ message: "Invalid updates!" });
	}

	try {
		updates.forEach((update) => (req.user[update] = req.body[update]));
		await req.user.save();
		res.json(req.user);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

exports.deleteProfile = async (req, res) => {
	try {
		await req.user.remove();
		res.json({ message: "User deleted successfully" });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

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

exports.admin = async (req, res) => {
	const { action, data } = req.body;

	try {
		switch (action) {
			case "updatePaymentStatus":
				// Update payment status
				// Example: await Booking.findByIdAndUpdate(data.bookingId, { paymentStatus: data.status });
				res.json({ message: "Payment status updated successfully" });
				break;

			case "confirmBooking":
				// Confirm a booking
				// Example: await Booking.findByIdAndUpdate(data.bookingId, { status: 'confirmed' });
				res.json({ message: "Booking confirmed successfully" });
				break;

			case "addMovie":
				// Add a new movie
				// const newMovie = new Movie(data);
				// await newMovie.save();
				res.json({ message: "Movie added successfully" });
				break;

			case "updateMovie":
				// Update a movie
				// Example: await Movie.findByIdAndUpdate(data.movieId, data.updates);
				res.json({ message: "Movie updated successfully" });
				break;

			case "deleteMovie":
				// Delete a movie
				// Example: await Movie.findByIdAndDelete(data.movieId);
				res.json({ message: "Movie deleted successfully" });
				break;

			case "updateUserStatus":
				// Update user status (e.g., activate, deactivate, upgrade to admin)
				// Example: await User.findByIdAndUpdate(data.userId, { status: data.status });
				res.json({ message: "User status updated successfully" });
				break;

			case "updateShowtime":
				// Update showtime
				// Example: await Showtime.findByIdAndUpdate(data.showtimeId, data.updates);
				res.json({ message: "Showtime updated successfully" });
				break;

			default:
				res.status(400).json({ message: "Invalid admin action" });
		}
	} catch (error) {
		res
			.status(500)
			.json({ message: "Error performing admin action", error: error.message });
	}
};
