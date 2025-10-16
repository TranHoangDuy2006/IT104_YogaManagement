import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

interface User {
    fullName: string
    email: string
    password: string
}

interface UserState {
  data: User | null
  loading: boolean
  error: string | null
}

const initialState: UserState = {
  data: null,
  loading: false,
  error: null,
}

export const registerUser = createAsyncThunk<User, User>(
    "user/register",
    async (user): Promise<User> => {
        const response = await axios.post<User>("http://localhost:1904/users", user)
        return response.data
    }
)

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(registerUser.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false
        state.data = action.payload
        state.error = null
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Đăng ký thất bại"
      })
  },
})

export default userSlice.reducer