// src/store/slices/movieSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchMovies = createAsyncThunk("movies/fetchMovies", async () => {
	const response = await fetch("http://localhost:3000/api/movies");
	if (!response.ok) {
		throw new Error("Failed to fetch movies");
	}
	const data = await response.json();
	console.log(data);
	return data;
});

const movieSlice = createSlice({
	name: "movies",
	initialState: {
		items: [],
		status: "idle",
		error: null,
	},
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchMovies.pending, (state) => {
				state.status = "loading";
			})
			.addCase(fetchMovies.fulfilled, (state, action) => {
				state.status = "succeeded";
				state.items = action.payload;
			})
			.addCase(fetchMovies.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.error.message;
			});
	},
});

export default movieSlice.reducer;
