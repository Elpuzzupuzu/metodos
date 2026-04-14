// src/features/gauss/gaussSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

export const calcularGauss = createAsyncThunk(
  "gauss/calcular",
  async (data) => {
    const res = await api.post("/gauss", data);
    return res.data;
  }
);

const gaussSlice = createSlice({
  name: "gauss",
  initialState: {
    resultado: null,
    status: "idle",
  },
  extraReducers: (builder) => {
    builder
      .addCase(calcularGauss.pending, (state) => {
        state.status = "loading";
      })
      .addCase(calcularGauss.fulfilled, (state, action) => {
        state.status = "success";
        state.resultado = action.payload.resultado;
      })
      .addCase(calcularGauss.rejected, (state) => {
        state.status = "error";
      });
  },
});

export default gaussSlice.reducer;