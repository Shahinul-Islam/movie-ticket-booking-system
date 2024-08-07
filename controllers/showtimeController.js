const Showtime = require("../models/showtime");
const Theater = require("../models/theater")

exports.createShowtime = async (req, res) => {
	try {
		const showtime = new Showtime(req.body);
		const newShowtime = await showtime.save();
		res.status(201).json(newShowtime);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

exports.getAllShowtimes = async (req, res) => {
	try {
		const showtimes = await Showtime.find()
			.populate("movie_id", "title")
			.populate("theater_id", "name")
			.sort({ date: 1, start_time: 1 });
		res.json(showtimes);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

exports.getShowtime = async (req, res) => {
	try {
		const showtime = await Showtime.findById(req.params.id)
			
		if (!showtime) {
			return res.status(404).json({ message: "Showtime not found" });
		}
		res.json(showtime);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

exports.updateShowtime = async (req, res) => {
	try {
		const showtime = await Showtime.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
		});
		if (!showtime) {
			return res.status(404).json({ message: "Showtime not found" });
		}
		res.json(showtime);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

exports.deleteShowtime = async (req, res) => {
	try {
		const showtime = await Showtime.findByIdAndDelete(req.params.id);
		if (!showtime) {
			return res.status(404).json({ message: "Showtime not found" });
		}
		res.json({ message: "Showtime deleted" });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

exports.getShowtimesByMovie = async (req, res) => {
	try {
		const showtimes = await Showtime.find({
			movie_id: req.params.movieId,
		}).populate("theater_id", "name");
		res.json(showtimes);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

exports.getShowtimesByTheater = async (req, res) => {
	try {
		const showtimes = await Showtime.find({
			theater_id: req.params.theaterId,
		}).populate("movie_id", "title");
		res.json(showtimes);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};
