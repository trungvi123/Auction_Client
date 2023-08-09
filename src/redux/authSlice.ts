import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  email: "",
  _id: "",
  lastName: "",
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
  },
});

export const { setEmail, setIdUser, setLastName } = authSlice.actions;

export default authSlice.reducer;
