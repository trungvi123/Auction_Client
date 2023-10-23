import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  prodName: "",
};

const utilsSlice = createSlice({
  name: "utils",
  initialState,
  reducers: {
    setProdName: (state, action) => {
      state.prodName = action.payload;
    },
  },
});

export const { setProdName } = utilsSlice.actions;
 
export default utilsSlice.reducer;
