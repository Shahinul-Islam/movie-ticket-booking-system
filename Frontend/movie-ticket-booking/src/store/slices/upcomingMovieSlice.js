// src/store/slices/upcomingMovieSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchUpcomingMovies = createAsyncThunk(
  "upcomingMovies/fetchUpcomingMovies",
  async () => {
    const response = await fetch("http://localhost:3000/api/movies/upcoming");
    if (!response.ok) {
      throw new Error('Failed to fetch upcoming movies');
    }
    const data = await response.json();
    return data;
  }
);

const upcomingMovieSlice = createSlice({
  name: "upcomingMovies",
  initialState: {
    items: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUpcomingMovies.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUpcomingMovies.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchUpcomingMovies.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default upcomingMovieSlice.reducer;