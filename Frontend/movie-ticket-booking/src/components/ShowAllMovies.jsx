// src/components/ShowtimeList.jsx
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchMovies } from "../store/slices/movieSlice";

function ShowAllMovies() {
	const dispatch = useDispatch();

	const { items: movies, status, error } = useSelector((state) => state.movies);

	console.log(movies);

	useEffect(() => {
		if (status === "idle") {
			dispatch(fetchMovies());
		}
	}, [status, dispatch]);

	if (status === "loading") {
		return <div>Loading...</div>;
	}

	if (status === "failed") {
		return <div>Error: {error}</div>;
	}

	return (
		<div>
			<p>this is to show all movies</p>
			{movies &&
				movies.map((movie) => (
					<div key={movie._id}>
						<h3>{movie.title}</h3>
					</div>
				))}
		</div>
	);
}

export default ShowAllMovies;
