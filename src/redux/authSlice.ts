import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  email: "",
  _id: "",
  lastName: "",
  basicUser: true,
  productPermission: [],
  freeProductPermission: [],
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setEmail: (state, action) => {
      state.email = action.payload;
    },
    setIdUser: (state, action) => {
      state._id = action.payload;
    },
    setLastName: (state, action) => {
      state.lastName = action.payload;
    },
    setBasicUser: (state) => {
      state.basicUser = false;
    },
    setProductPermission: (state, action) => {
      state.productPermission = action.payload;
    },
    setFreeProductPermission: (state, action) => {
      state.freeProductPermission = action.payload;
    },
  },
});

export const {
  setEmail,
  setIdUser,
  setLastName,
  setBasicUser,
  setProductPermission,
  setFreeProductPermission,
} = authSlice.actions;

export default authSlice.reducer;
