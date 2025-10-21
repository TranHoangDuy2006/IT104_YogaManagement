import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchAllBookings = createAsyncThunk(
  "bookings/fetchAll",
  async () => {
    const response = await axios.get("http://localhost:1904/bookings");
    return response.data;
  }
);
