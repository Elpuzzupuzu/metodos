// src/features/lagrange/lagrangeSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

export const calcularLagrange = createAsyncThunk(
  "lagrange/calcular",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post("/lagrange", data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Error");
    }
  }
);

const lagrangeSlice = createSlice({
  name: "lagrange",
  initialState: {
    resultado: null,
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(calcularLagrange.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(calcularLagrange.fulfilled, (state, action) => {
        state.status = "success";
        state.resultado = action.payload.resultado;
      })
      .addCase(calcularLagrange.rejected, (state, action) => {
        state.status = "error";
        state.error = action.payload;
      });
  },
});

export default lagrangeSlice.reducer;