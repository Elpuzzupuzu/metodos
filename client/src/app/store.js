// src/app/store.js
import { configureStore } from "@reduxjs/toolkit";
import gaussReducer from "../features/gauss/gaussSlice";
import lagrangeReducer from "../features/lagrange/lagrangeSlice";
import trapecioReducer from "../features/trapecio/trapecioSlice";

export const store = configureStore({
  reducer: {
    gauss: gaussReducer,
    lagrange: lagrangeReducer,
    trapecio: trapecioReducer,
  },
});