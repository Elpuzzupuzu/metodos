// src/features/trapecio/trapecioSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

export const calcularTrapecio = createAsyncThunk(
  "trapecio/calcular",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post("/trapecio", data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Error");
    }
  }
);

const trapecioSlice = createSlice({
  name: "trapecio",
  initialState: {
    resultado: null,
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(calcularTrapecio.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(calcularTrapecio.fulfilled, (state, action) => {
        state.status = "success";
        state.resultado = action.payload.resultado;
      })
      .addCase(calcularTrapecio.rejected, (state, action) => {
        state.status = "error";
        state.error = action.payload;
      });
  },
});

export default trapecioSlice.reducer;