import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    prodDescription:''
};

const utilsSlice = createSlice({
  name: "utils",
  initialState,
  reducers: {
    setProdDescription: (state, action) => {
      state.prodDescription = action.payload;
    },
  },
});

export const { setProdDescription } = utilsSlice.actions;

export default utilsSlice.reducer;