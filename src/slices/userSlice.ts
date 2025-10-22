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
      })

      // Thêm user
      .addCase(addUser.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addUser.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(addUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Thêm người dùng thất bại";
      })

      // Sửa user
      .addCase(updateUser.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Sửa người dùng thất bại";
      })

      // Xóa user
      .addCase(deleteUser.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Xóa người dùng thất bại";
      });
  },
});

export default userSlice.reducer;
