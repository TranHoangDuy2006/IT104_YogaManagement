import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { Course } from "../types/Course";
import axios from "axios";

const API_BASE = "http://localhost:1904";

export const fetchCourses = createAsyncThunk<Course[]>(
  "courses/fetchAll",
  async () => {
    const res = await axios.get<Course[]>(`${API_BASE}/courses`);
    return res.data;
  }
);

export const addCourse = createAsyncThunk<Course, Omit<Course, "id">>(
  "courses/add",
  async (course) => {
    const res = await axios.post<Course>(`${API_BASE}/courses`, course);
    return res.data;
  }
);

export const updateCourse = createAsyncThunk<Course, { id: string; course: Partial<Course> }>(
  "courses/update",
  async ({ id, course }) => {
    const res = await axios.patch<Course>(`${API_BASE}/courses/${id}`, course);
    return res.data;
  }
);

export const deleteCourse = createAsyncThunk<string, string>(
  "courses/delete",
  async (id) => {
    await axios.delete(`${API_BASE}/courses/${id}`);
    return id;
  }
);

interface CoursesState {
  data: Course[];
  loading: boolean;
  error: string | null;
}

const initialState: CoursesState = {
  data: [],
  loading: false,
  error: null,
};

const coursesSlice = createSlice({
  name: "courses",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Lỗi tải lớp học";
      })
      .addCase(addCourse.fulfilled, (state, action) => {
        state.data.push(action.payload);
      })
      .addCase(updateCourse.fulfilled, (state, action) => {
        const idx = state.data.findIndex(c => c.id === action.payload.id);
        if (idx !== -1) state.data[idx] = action.payload;
      })
      .addCase(deleteCourse.fulfilled, (state, action) => {
        state.data = state.data.filter(c => c.id !== action.payload);
      });
  },
});

export default coursesSlice.reducer;
