const Booking = require("../models/booking");
const Showtime = require("../models/showtime"); // Assuming you have a Showtime model

exports.createBooking = async (req, res) => {
	try {
		const { showtime_id, seats } = req.body;
		const user_id = req.user._id; // Assuming you have authentication middleware

		// Check if the showtime exists and seats are available
		const showtime = await Showtime.findById(showtime_id);
		if (!showtime) {
			return res.status(404).json({ message: "Showtime not found" });
		}

		// Check if seats are available
		const areSeatsAvailable = seats.every((seat) =>
			showtime.available_seats.some(
				(availableSeat) =>
					availableSeat.row === seat.row && availableSeat.number === seat.number
			)
		);

		if (!areSeatsAvailable) {
			return res
				.status(400)
				.json({ message: "One or more selected seats are not available" });
		}

		// Calculate total amount (you might want to get the price from the showtime or have a separate pricing logic)
		const total_amount = seats.length * 10; // Assuming each seat costs $10

		const booking = new Booking({
			user_id,
			showtime_id,
			seats,
			total_amount,
			booking_status: "pending",
		});

		const newBooking = await booking.save();

		// Update available seats in the showtime
		showtime.available_seats = showtime.available_seats.filter(
			(availableSeat) =>
				!seats.some(
					(seat) =>
						seat.row === availableSeat.row &&
						seat.number === availableSeat.number
				)
		);
		await showtime.save();

		res.status(201).json(newBooking);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

exports.getBooking = async (req, res) => {
	try {
		const booking = await Booking.findById(req.params.id)
			.populate("user_id", "username email")
			.populate("showtime_id");
		if (!booking) {
			return res.status(404).json({ message: "Booking not found" });
		}
		res.json(booking);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

exports.getUserBookings = async (req, res) => {
	try {
		const bookings = await Booking.find({
			user_id: req.params.userId,
		}).populate("showtime_id");
		res.json(bookings);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

exports.updateBookingPaymentStatus = async (req, res) => {
	try {
		const { payment_status } = req.body;
		const booking = await Booking.findByIdAndUpdate(
			req.params.id,
			{ payment_status },
			{ new: true }
		);
		if (!booking) {
			return res.status(404).json({ message: "Booking not found" });
		}
		res.json(booking);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

exports.deleteBooking = async (req, res) => {
	try {
		const booking = await Booking.findByIdAndDelete(req.params.id);
		if (!booking) {
			return res.status(404).json({ message: "Booking not found" });
		}
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};
