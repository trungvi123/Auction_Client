import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  fireworks: false,
  changeTheme: false,
  images: {
    short_intro: "",
    logo: "",
    mini_logo: "",
    breadcrum: "",
  },
};

const utilsSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleFireworks: (state, actions) => {
      state.fireworks = actions.payload;
    },
    setChangeTheme: (state, actions) => {
      state.changeTheme = actions.payload;
    },
    setImages: (state, actions) => {
      state.images = actions.payload;
    },
  },
});

export const { toggleFireworks,setImages, setChangeTheme } = utilsSlice.actions;

export default utilsSlice.reducer;
