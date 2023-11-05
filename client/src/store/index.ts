import { configureStore } from "@reduxjs/toolkit";
import dataSlice from "./dataSlice";
import inputSlice from "./inputSlice";

const store = configureStore({
  reducer: {
    data: dataSlice,
    input: inputSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
