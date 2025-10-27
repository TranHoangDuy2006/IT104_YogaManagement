// Thêm user
export const addUser = createAsyncThunk<User, User>(
  "user/addUser",
  async (user) => {
    const response = await axios.post<User>("http://localhost:1904/users", user);
    return response.data;
  }
);

// Sửa user
export const updateUser = createAsyncThunk<User, { id: string; user: Partial<User> }>(
  "user/updateUser",
  async ({ id, user }) => {
    const response = await axios.patch<User>(`http://localhost:1904/users/${id}`, user);
    return response.data;
  }
);

// Xóa user
export const deleteUser = createAsyncThunk<string, string>(
  "user/deleteUser",
  async (id) => {
    await axios.delete(`http://localhost:1904/users/${id}`);
    return id;
  }
);

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import type { User, UserState, LoginCredentials } from "../types/User";

const initialState: UserState = {
  data: null,
  loading: false,
  error: null,
};

export const registerUser = createAsyncThunk<User, User, { rejectValue: string }>(
  "user/register",
  async (user, { rejectWithValue }) => {
    // Kiểm tra email đã tồn tại
    const check = await axios.get<User[]>("http://localhost:1904/users", { params: { email: user.email } });
    if (check.data.length > 0) {
      return rejectWithValue("Email đã tồn tại!");
    }
    const response = await axios.post<User>("http://localhost:1904/users", user);
    return response.data;
  }
);

export const loginUser = createAsyncThunk<User, LoginCredentials, { rejectValue: string }>(
  "user/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.get<User[]>(
        "http://localhost:1904/users",
        { params: { email: credentials.email, password: credentials.password } }
      );
      if (response.data.length > 0) {
        return response.data[0];
      } else {
        return rejectWithValue("Sai email hoặc mật khẩu!");
      }
    } catch {
      return rejectWithValue("Sai email hoặc mật khẩu!");
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserFromLocalStorage(state, action) {
      state.data = action.payload;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(registerUser.pending, state => {
        state.loading = true;
        state.error = null;
      })
      // ...existing builder logic...
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
        // Lưu user vào localStorage
        localStorage.setItem("currentUser", JSON.stringify(action.payload));
      });
  }
});
export const { setUserFromLocalStorage } = userSlice.actions;
export default userSlice.reducer;
