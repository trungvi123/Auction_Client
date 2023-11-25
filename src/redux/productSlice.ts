import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  happenningProduct: [],
  upcomingProduct: [],
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setHappenningProduct: (state, action) => {
      state.happenningProduct = action.payload;
    },
    setUpcomingProduct: (state, action) => {
      state.upcomingProduct = action.payload;
    },
  },
});

export const { setHappenningProduct, setUpcomingProduct } =
  productSlice.actions;
export default productSlice.reducer;
