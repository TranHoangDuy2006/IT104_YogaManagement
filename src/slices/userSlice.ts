import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

interface User {
  fullName: string;
  email: string;
  password: string;
  role?: string; 
}

interface UserState {
  data: User | null;
  loading: boolean;
  error: string | null;
}

interface LoginCredentials {
  email: string;
  password: string;
}

const initialState: UserState = {
  data: null,
  loading: false,
  error: null,
};

export const registerUser = createAsyncThunk<User, User>(
  "user/register",
  async (user): Promise<User> => {
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
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(registerUser.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Đăng ký thất bại";
      })

      .addCase(loginUser.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;

        localStorage.setItem("currentUser", JSON.stringify(action.payload));
        if (action.payload.role) {
          localStorage.setItem("role", action.payload.role);
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) || action.error.message || "Đăng nhập thất bại";
      });
  },
});

export default userSlice.reducer;
