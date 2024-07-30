const mongoose = require("mongoose");

const showtimeSchema = new mongoose.Schema(
	{
		movie_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Movie",
			required: true,
		},
		theater_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Theater",
			required: true,
		},
		screen_name: {
			type: String,
			required: true,
		},
		start_time: {
			type: Date,
			required: true,
		},
		end_time: {
			type: Date,
			required: true,
		},
		date: {
			type: Date,
			required: true,
		},
		price: {
			type: Number,
			required: true,
		},
		available_seats: [
			{
				row: {
					type: String,
					required: true,
				},
				number: {
					type: Number,
					required: true,
				},
				type: {
					type: String,
					enum: ["regular", "premium", "accessible"],
					default: "regular",
				},
			},
		],
	},
	{
		timestamps: true,
	}
);

const Showtime = mongoose.model("Showtime", showtimeSchema);

module.exports = Showtime;
