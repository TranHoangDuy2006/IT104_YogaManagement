import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../slices/userSlice";
import bookingReducer from "../slices/bookingSlice";
import bookingsAllReducer from "../slices/bookingsAllSlice";

const store = configureStore({
  reducer: {
  user: userReducer,
  bookings: bookingReducer,
  bookingsAll: bookingsAllReducer,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
