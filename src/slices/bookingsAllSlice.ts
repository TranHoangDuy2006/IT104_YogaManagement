import { createSlice } from "@reduxjs/toolkit";
import { fetchAllBookings } from "./fetchAllBookingsThunk";
import type { Booking } from "./bookingSlice";

interface BookingsAllState {
  data: Booking[];
  loading: boolean;
  error: string | null;
}

const initialState: BookingsAllState = {
  data: [],
  loading: false,
  error: null,
};

const bookingsAllSlice = createSlice({
  name: "bookingsAll",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload as Booking[];
      })
      .addCase(fetchAllBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Lỗi lấy dữ liệu";
      });
  },
});

export default bookingsAllSlice.reducer;
