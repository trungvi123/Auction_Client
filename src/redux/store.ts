import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import myModalSlice from "./myModalSlice";
import searchModalSlice from "./searchModalSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    myModal: myModalSlice,
    searchModal: searchModalSlice,
  },
});
