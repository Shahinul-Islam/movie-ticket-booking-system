const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
	{
		user_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		showtime_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Showtime",
			required: true,
		},
		seats: [
			{
				row: {
					type: String,
					required: true,
				},
				number: {
					type: Number,
					required: true,
				},
			},
		],
		booking_time: {
			type: Date,
			default: Date.now,
		},
		total_amount: {
			type: Number,
			required: true,
		},
		payment_status: {
			type: String,
			enum: ["pending", "completed", "failed"],
			default: "pending",
		},
		booking_status: {
			type: String,
			enum: ["pending", "completed", "cancelled"],
			default: "pending",
		},
	},
	{
		timestamps: true,
	}
);

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
