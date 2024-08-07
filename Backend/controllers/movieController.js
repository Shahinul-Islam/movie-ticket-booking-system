const Movie = require("../models/movie");

// Get all movies
exports.getAllMovies = async (req, res) => {
	try {
		const movies = await Movie.find();
		res.json(movies);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// Get a single movie
exports.getMovie = async (req, res) => {
	try {
		const movie = await Movie.findById(req.params.id);
		if (!movie) return res.status(404).json({ message: "Movie not found" });
		res.json(movie);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// Create a new movie
exports.createMovie = async (req, res) => {
	const movie = new Movie(req.body);
	try {
		const newMovie = await movie.save();
		res.status(201).json(newMovie);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

// Update a movie
exports.updateMovie = async (req, res) => {
	try {
		const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
		});
		if (!movie) return res.status(404).json({ message: "Movie not found" });
		res.json(movie);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

// Delete a movie
exports.deleteMovie = async (req, res) => {
	try {
		const movie = await Movie.findByIdAndDelete(req.params.id);
		if (!movie) return res.status(404).json({ message: "Movie not found" });
		res.json({ message: "Movie deleted" });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// Get upcoming movies
exports.getUpcomingMovies = async (req, res) => {
	try {
		const upcomingMovies = await Movie.find({
			release_date: { $gte: new Date() },
		});
		res.json(upcomingMovies);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};
