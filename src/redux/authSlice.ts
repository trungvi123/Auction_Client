import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  email: "",
  _id: "",
  lastName: "",
  basicUser: true,
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
  },
});

export const { setEmail, setIdUser, setLastName, setBasicUser } =
  authSlice.actions;

export default authSlice.reducer;
