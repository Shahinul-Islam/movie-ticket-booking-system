const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
			trim: true,
		},
		description: {
			type: String,
			required: true,
		},
		duration: {
			type: Number,
			required: true,
			min: 0,
		},
		genre: {
			type: String,
			required: true,
		},
		release_date: {
			type: Date,
			required: true,
		},
		poster_url: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

const Movie = mongoose.model("Movie", movieSchema);

module.exports = Movie;
