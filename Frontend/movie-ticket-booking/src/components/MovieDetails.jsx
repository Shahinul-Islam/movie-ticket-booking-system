// src/components/MovieDetails.jsx
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
	fetchMovieDetails,
	clearMovieDetails,
} from "../store/slices/movieDetailsSlice";

function MovieDetails() {
	const { movieId } = useParams();
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { movie, status, error } = useSelector((state) => state.movieDetails);

	useEffect(() => {
		dispatch(fetchMovieDetails(movieId));

		return () => {
			dispatch(clearMovieDetails());
		};
	}, [dispatch, movieId]);

	if (status === "loading") {
		return <div>Loading movie details...</div>;
	}

	if (status === "failed") {
		return <div>Error loading movie details: {error}</div>;
	}

	if (!movie) {
		return null;
	}

	return (
		<div className="movie-details">
			<h2>{movie.title}</h2>
			{movie.posterUrl && (
				<img src={movie.posterUrl} alt={`${movie.title} poster`} />
			)}
			<p>Release Date: {new Date(movie.releaseDate).toLocaleDateString()}</p>
			<p>Duration: {movie.duration} minutes</p>
			<p>Genre: {movie.genre}</p>
			<p>{movie.description}</p>
			<button onClick={() => navigate(-1)}>Back to List</button>
		</div>
	);
}

export default MovieDetails;
