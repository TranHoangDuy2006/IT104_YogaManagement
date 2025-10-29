import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../slices/userSlice";
import coursesReducer from "../slices/coursesSlice";
import servicesReducer from "../slices/servicesSlice";
import bookingReducer from "../slices/bookingSlice";
import bookingsAllReducer from "../slices/bookingsAllSlice";

const store = configureStore({
  reducer: {
  user: userReducer,
  bookings: bookingReducer,
  bookingsAll: bookingsAllReducer,
  courses: coursesReducer,
  services: servicesReducer,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
