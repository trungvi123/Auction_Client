import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import myModalSlice from "./myModalSlice";
import searchModalSlice from "./searchModalSlice";
import uiSlice from "./uiSlice";
import utilsSlice from "./utilsSlice";

// Khôi phục state từ localStorage (nếu có)

const savedState = localStorage.getItem("reduxState");
const initialState = savedState ? JSON.parse(savedState) : {};

export const store = configureStore({
  reducer: {
    auth: authSlice,
    myModal: myModalSlice,
    searchModal: searchModalSlice,
    utils: utilsSlice,
    ui: uiSlice,
  },
  preloadedState: initialState,
});

// Lưu state vào localStorage trước khi trang reload
window.addEventListener("beforeunload", () => {
  const state = store.getState();
  localStorage.setItem("reduxState", JSON.stringify(state));
});
