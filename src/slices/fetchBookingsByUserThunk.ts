import { createAsyncThunk } from "@reduxjs/toolkit";
import { getBookingsByUser } from "../apis/api";

export const fetchBookingsByUser = createAsyncThunk(
  "bookings/fetchByUser",
  async (userId: string) => {
    const response = await getBookingsByUser(userId);
    return response.data;
  }
);

export default fetchBookingsByUser;
