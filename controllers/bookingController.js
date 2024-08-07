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
			booking_status,
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
        
        // Prepare the update object
        const updateData = { payment_status };
        
        // If payment_status is "complete", set booking_status to "completed"
        if (payment_status === "complete") {
            updateData.booking_status = "completed";
        } 
		else if (payment_status === "failed") {
            updateData.booking_status = "cancelled";
        }
		else {
            updateData.booking_status = "pending";
        }

        const booking = await Booking.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        res.json({
            payment_status: booking.payment_status,
            booking_status: booking.booking_status
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteBooking = async (req, res) => {
	try {
		const booking = await Booking.findById(req.params.id);
		if (!booking) {
			return res.status(404).json({ message: "Booking not found" });
		}

		// Check if the user is authorized to delete this booking
		// Assuming only admins or the booking owner can delete
		if (
			!req.user.isAdmin &&
			booking.user_id.toString() !== req.user._id.toString()
		) {
			return res
				.status(403)
				.json({ message: "Not authorized to delete this booking" });
		}

		// If the booking is not cancelled, we need to return the seats to available
		if (booking.booking_status !== "cancelled") {
			const showtime = await Showtime.findById(booking.showtime_id);
			if (showtime) {
				showtime.available_seats = [
					...showtime.available_seats,
					...booking.seats,
				];
				await showtime.save();
			}
		}

		await booking.remove();

		res.json({ message: "Booking deleted successfully" });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};
