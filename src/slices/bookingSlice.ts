import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export interface Booking {
  id?: number;
  userId: number;
  class: string;
  date: string;
  time: string;
  name: string;
  email: string;
}

interface BookingState {
  data: Booking[];
  loading: boolean;
  error: string | null;
}

const initialState: BookingState = {
  data: [],
  loading: false,
  error: null,
};

export const fetchBookingsByUser = createAsyncThunk<Booking[], number>(
  "bookings/fetchByUser",
  async (userId) => {
    const response = await axios.get<Booking[]>(`http://localhost:1904/bookings?userId=${userId}`);
    return response.data;
  }
);

export const addBooking = createAsyncThunk<Booking, Booking, { rejectValue: string }>(
  "bookings/add",
  async (booking, { rejectWithValue }) => {
    // Kiểm tra dữ liệu không trống
    if (!booking.class || !booking.date || !booking.time) {
      return rejectWithValue("Vui lòng nhập đầy đủ thông tin!");
    }
    // Kiểm tra trùng lặp sẽ thực hiện ở component trước khi gọi thunk
    const response = await axios.post<Booking>("http://localhost:1904/bookings", booking);
    return response.data;
  }
);

export const updateBooking = createAsyncThunk<Booking, Booking, { rejectValue: string }>(
  "bookings/update",
  async (booking, { rejectWithValue }) => {
    if (!booking.id) return rejectWithValue("Thiếu id lịch!");
    if (!booking.class || !booking.date || !booking.time) {
      return rejectWithValue("Vui lòng nhập đầy đủ thông tin!");
    }
    const response = await axios.patch<Booking>(`http://localhost:1904/bookings/${booking.id}`, booking);
    return response.data;
  }
);

export const deleteBooking = createAsyncThunk<number, number, { rejectValue: string }>(
  "bookings/delete",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`http://localhost:1904/bookings/${id}`);
      return id;
    } catch {
      return rejectWithValue("Xóa lịch thất bại!");
    }
  }
);

const bookingSlice = createSlice({
  name: "bookings",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchBookingsByUser.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookingsByUser.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(fetchBookingsByUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Lấy lịch thất bại";
      })
      .addCase(addBooking.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.data.push(action.payload);
        state.error = null;
      })
      .addCase(addBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error.message || "Thêm lịch thất bại";
      })
      .addCase(updateBooking.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.data = state.data.map(b => b.id === action.payload.id ? action.payload : b);
        state.error = null;
      })
      .addCase(updateBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error.message || "Cập nhật lịch thất bại";
      })
      .addCase(deleteBooking.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.data = state.data.filter(b => b.id !== action.payload);
        state.error = null;
      })
      .addCase(deleteBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error.message || "Xóa lịch thất bại";
      });
  },
});

export default bookingSlice.reducer;
