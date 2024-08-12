// src/store/index.js
import { configureStore } from "@reduxjs/toolkit";
import showtimeReducer from "./slices/showtimeSlice";
import movieReducer from "./slices/movieSlice";
import theaterReducer from "./slices/theaterSlice";
import upcomingMovieReducer from "./slices/upcomingMovieSlice";
import movieDetailsReducer from "./slices/movieDetailsSlice";


const store = configureStore({
	reducer: {
        showtimes: showtimeReducer,
		movies: movieReducer,
		theaters: theaterReducer,
        upcomingMovies: upcomingMovieReducer,
        movieDetails: movieDetailsReducer,

	},
});
export default store