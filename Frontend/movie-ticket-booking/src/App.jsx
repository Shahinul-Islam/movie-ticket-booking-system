// src/App.jsx
// import React from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ShowtimeList from "./components/ShowTimeList";
import MovieDetails from "./components/MovieDetails";
import ShowAllMovies from "./components/ShowAllMovies";

function App() {
	return (
		<Router>
			<div className="App">
				<h1>Movie Ticket Booking</h1>
				<Routes>
					<Route path="/" element={<ShowtimeList />} />
					<Route path="/movies" element={<ShowAllMovies />} />
					<Route path="/movie/:movieId" element={<MovieDetails />} />
				</Routes>
			</div>
		</Router>
	);
}

export default App;
