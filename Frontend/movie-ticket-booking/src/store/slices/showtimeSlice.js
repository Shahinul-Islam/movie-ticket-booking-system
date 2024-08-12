// src/store/slices/showtimeSlice.js

// Importing necessary dependencies
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Importing the necessary function to make a fetch request
// import axios from "axios";

// Creating an async thunk action to fetch the showtimes data from the API
// The action is called fetchShowtimes and it returns a promise that resolves to the data from the API
export const fetchShowtimes = createAsyncThunk(
	"showtimes/fetchShowtimes",
	async () => {
		const response = await fetch("http://localhost:3000/api/showtimes");
		if (!response.ok) {
			throw new Error("Failed to fetch showtimes");
		}
		return response.json();
	}
);

// Creating the showtimeSlice which holds the state for the showtimes data
// The name of the slice is "showtimes" and the initial state is defined with an empty array for the items and "idle" for the status and null for the error
const showtimeSlice = createSlice({
	name: "showtimes",
	initialState: {
		items: [],
		status: "idle",
		error: null,
	},
	reducers: {},
	// Defining the extraReducers property to handle the different cases of the fetchShowtimes action
	extraReducers: (builder) => {
		builder
			// When the fetchShowtimes action is pending, the status is set to "loading"
			.addCase(fetchShowtimes.pending, (state) => {
				state.status = "loading";
			})
			// When the fetchShowtimes action is fulfilled, the status is set to "succeeded" and the items are updated with the payload from the action
			.addCase(fetchShowtimes.fulfilled, (state, action) => {
				state.status = "succeeded";
				state.items = action.payload;
			})
			// When the fetchShowtimes action is rejected, the status is set to "failed" and the error is updated with the message from the action's error
			.addCase(fetchShowtimes.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.error.message;
			});
	},
});

// Exporting the reducer for the showtimes slice
export default showtimeSlice.reducer;
