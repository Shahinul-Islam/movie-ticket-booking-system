// src/store/slices/theaterSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchTheaters = createAsyncThunk(
  'theaters/fetchTheaters',
  async () => {
    const response = await axios.get('/api/theaters');
    return response.data;
  }
);

const theaterSlice = createSlice({
  name: 'theaters',
  initialState: {
    items: [],
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTheaters.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTheaters.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchTheaters.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default theaterSlice.reducer;