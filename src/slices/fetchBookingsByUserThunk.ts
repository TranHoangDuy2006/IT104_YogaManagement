import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchBookingsByUser = createAsyncThunk(
  "bookings/fetchByUser",
  async (userId: string) => {
    const response = await axios.get(`http://localhost:1904/bookings`, { params: { userId } });
    return response.data;
  }
);

export default fetchBookingsByUser;
