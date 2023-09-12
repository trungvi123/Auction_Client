import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  menuSidebarCollapsed: false,
  controlSidebarCollapsed: false,
};

const utilsSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSidebarMenu: (state) => {
      state.menuSidebarCollapsed = !state.menuSidebarCollapsed;
    },
    toggleControlSidebar: (state) => {
      state.controlSidebarCollapsed = !state.controlSidebarCollapsed;
    },
  },
});

export const { toggleSidebarMenu, toggleControlSidebar } = utilsSlice.actions;

export default utilsSlice.reducer;
