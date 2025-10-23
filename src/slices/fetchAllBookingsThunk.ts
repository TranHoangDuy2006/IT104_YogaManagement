import { createAsyncThunk } from "@reduxjs/toolkit";
import { getBookings } from "../apis/api";

export const fetchAllBookings = createAsyncThunk(
  "bookings/fetchAll",
  async () => {
    const response = await getBookings();
    return response.data;
  }
);
