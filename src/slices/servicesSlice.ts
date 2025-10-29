import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { Service } from "../types/Service";
import axios from "axios";

const API_BASE = "http://localhost:1904";

export const fetchServices = createAsyncThunk<Service[]>(
  "services/fetchAll",
  async () => {
    const res = await axios.get<Service[]>(`${API_BASE}/services`);
    return res.data;
  }
);

export const addService = createAsyncThunk<Service, Omit<Service, "id">>(
  "services/add",
  async (service) => {
    const res = await axios.post<Service>(`${API_BASE}/services`, service);
    return res.data;
  }
);

export const updateService = createAsyncThunk<Service, { id: string; service: Partial<Service> }>(
  "services/update",
  async ({ id, service }) => {
    const res = await axios.patch<Service>(`${API_BASE}/services/${id}`, service);
    return res.data;
  }
);

export const deleteService = createAsyncThunk<string, string>(
  "services/delete",
  async (id) => {
    await axios.delete(`${API_BASE}/services/${id}`);
    return id;
  }
);

interface ServicesState {
  data: Service[];
  loading: boolean;
  error: string | null;
}

const initialState: ServicesState = {
  data: [],
  loading: false,
  error: null,
};

const servicesSlice = createSlice({
  name: "services",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchServices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchServices.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Lỗi tải dịch vụ";
      })
      .addCase(addService.fulfilled, (state, action) => {
        state.data.push(action.payload);
      })
      .addCase(updateService.fulfilled, (state, action) => {
        const idx = state.data.findIndex(s => s.id === action.payload.id);
        if (idx !== -1) state.data[idx] = action.payload;
      })
      .addCase(deleteService.fulfilled, (state, action) => {
        state.data = state.data.filter(s => s.id !== action.payload);
      });
  },
});

export default servicesSlice.reducer;
