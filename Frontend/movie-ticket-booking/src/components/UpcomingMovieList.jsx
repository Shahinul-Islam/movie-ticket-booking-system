// src/components/UpcomingMovieList.jsx
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUpcomingMovies } from "../store/slices/upcomingMovieSlice";

function UpcomingMovieList() {
  const dispatch = useDispatch();
  const { items: upcomingMovies, status, error } = useSelector((state) => state.upcomingMovies);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchUpcomingMovies());
    }
  }, [status, dispatch]);

  if (status === "loading") {
    return <div>Loading upcoming movies...</div>;
  }

  if (status === "failed") {
    return <div>Error loading upcoming movies: {error}</div>;
  }

  return (
    <div>
      <h2>Upcoming Movies</h2>
      {upcomingMovies.map((movie) => (
        <div key={movie.id}>
          <h3>{movie.title}</h3>
          <p>Release Date: {new Date(movie.releaseDate).toLocaleDateString()}</p>
          <p>{movie.description}</p>
          {movie.posterUrl && <img src={movie.posterUrl} alt={`${movie.title} poster`} />}
        </div>
      ))}
    </div>
  );
}

export default UpcomingMovieList;