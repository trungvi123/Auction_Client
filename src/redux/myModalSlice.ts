import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  show: false,
  status: "login", // login and changePassword
 

};

const myModalSlice = createSlice({
  name: "myModal",
  initialState,
  reducers: {
    setShow: (state) => {
      state.show = true;
    },
    setClose: (state) => {
      state.show = false;
    },
   
    setStatus: (state, action) => {
      state.status = action.payload;
    },
  },
});

export const {
  setShow,
  setClose,
  setStatus
} = myModalSlice.actions;
export default myModalSlice.reducer;
