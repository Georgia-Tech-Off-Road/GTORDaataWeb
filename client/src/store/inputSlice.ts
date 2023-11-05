import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { InputMode } from "../types";

export interface InputState {
  inputMode?: InputMode;
  ports: string[];
}

export const inputSlice = createSlice({
  name: "input",
  initialState: {
    inputMode: undefined,
    ports: [],
  } as InputState,
  reducers: {
    setInputMode: (state, action: PayloadAction<InputState["inputMode"]>) => {
      state.inputMode = action.payload;
    },
    setPorts: (state, action: PayloadAction<InputState["ports"]>) => {
      state.ports = action.payload;
    },
  },
});

export const { setInputMode, setPorts } = inputSlice.actions;

export default inputSlice.reducer;
