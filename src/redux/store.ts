import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import myModalSlice from "./myModalSlice";
import searchModalSlice from "./searchModalSlice";
import uiSlice from "./uiSlice";
import utilsSlice from "./utilsSlice";
import productSlice from "./productSlice";

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
    product: productSlice,
  },
  preloadedState: initialState,
});

// Lưu state vào localStorage trước khi trang reload
window.addEventListener("beforeunload", () => {
  const state = store.getState();
  const reloadState = {
    ...state,
    product:{
      happenningProduct : [],
      upcomingProduct:[]
    }
  }
  localStorage.setItem("reduxState", JSON.stringify(reloadState));
});
