import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  prodDescription: "",
  prodName: "",
};

const utilsSlice = createSlice({
  name: "utils",
  initialState,
  reducers: {
    setProdDescription: (state, action) => {
      state.prodDescription = action.payload;
    },
    setProdName: (state, action) => {
      state.prodName = action.payload;
    },
  },
});

export const { setProdDescription, setProdName } = utilsSlice.actions;

export default utilsSlice.reducer;
