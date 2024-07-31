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
			case "updatePaymentStatus": {
				const { bookingId, paymentStatus } = data;

				// Validate paymentStatus
				const booking = await Booking.findById(bookingId);
				if (!booking) {
					return res.status(404).json({ message: "Booking not found" });
				}

				booking.payment_status = paymentStatus;
				await booking.save();

				// If payment is now 'paid/completed', you might want to confirm the booking
				if (
					paymentStatus === "completed" &&
					booking.booking_status !== "completed"
				) {
					booking.booking_status = "completed";
					await booking.save();
				}

				// If payment is 'failed' or 'refunded', you might want to cancel the booking
				if (paymentStatus === "failed") {
					booking.booking_status = "cancelled";
					await booking.save();

					// Release the seats back to available
					await Showtime.findByIdAndUpdate(booking.showtime_id, {
						$addToSet: { availableSeats: { $each: booking.seats } },
					});
				}

				res.json({
					message: "Payment status updated successfully",
					booking: {
						id: booking._id,
						paymentStatus: booking.payment_status,
						status: booking.booking_status,
					},
				});
				break;
			}

			case "addMovie": {
				// Add a new movie
				// const newMovie = new Movie(data);
				// await newMovie.save();
				res.json({ message: "Movie added successfully" });
				break;
			}

			case "updateMovie": {
				// Update a movie
				// Example: await Movie.findByIdAndUpdate(data.movieId, data.updates);
				res.json({ message: "Movie updated successfully" });
				break;
			}

			case "deleteMovie": {
				// Delete a movie
				// Example: await Movie.findByIdAndDelete(data.movieId);
				res.json({ message: "Movie deleted successfully" });
				break;
			}

			case "updateUserStatus": {
				const user = await User.findByIdAndUpdate(data.userId, data.updates);
				if (!user) {
					return res.status(404).json({ message: "User not found" });
				}

				// Update user status
				user.isAdmin = data.updates.isAdmin;
				await user.save();

				res.json({ message: "User status updated successfully" });
				break;
			}

			case "updateShowtime": {
				// Update showtime
				// Example: await Showtime.findByIdAndUpdate(data.showtimeId, data.updates);
				res.json({ message: "Showtime updated successfully" });
				break;
			}

			default:
				res.status(400).json({ message: "Invalid admin action" });
		}
	} catch (error) {
		res
			.status(500)
			.json({ message: "Error performing admin action", error: error.message });
	}
};
