import { createSlice } from "@reduxjs/toolkit";
import { fetchAllBookings } from "./fetchAllBookingsThunk";

const bookingsAllSlice = createSlice({
  name: "bookingsAll",
  initialState: {
    data: [],
    loading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchAllBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Lỗi lấy dữ liệu";
      });
  },
});

export default bookingsAllSlice.reducer;
