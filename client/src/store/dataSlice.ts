import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Data } from "../types";

export interface DataState {
  data: Data;
}

export const dataSlice = createSlice({
  name: "data",
  initialState: {
    data: {},
  } as DataState,
  reducers: {
    unpacketize: (state, action: PayloadAction<number[]>) => {
      console.log("unpacketize", action.payload);
    },
  },
});

export const { unpacketize } = dataSlice.actions;

export default dataSlice.reducer;
