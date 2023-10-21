import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  email: "",
  emailPaypal: "",
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
    setEmailPaypal: (state, action) => {
      state.emailPaypal = action.payload;
    },
    setLastName: (state, action) => {
      state.lastName = action.payload;
    },
    setBasicUser: (state, action) => {
      state.basicUser = action.payload;
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
  setEmailPaypal,
  setFreeProductPermission,
} = authSlice.actions;

export default authSlice.reducer;
