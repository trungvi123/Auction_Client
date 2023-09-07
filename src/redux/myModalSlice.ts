import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  show: false,
  status: "login", // login and changePassword
  type: "login", // phân biệt login và thông báo
  message: "", // nội dung
  variant: "", // loại thông báo

  typeSelect:'create',
  idItemDelete: "", // id của sản phẩm bị xóa
  refreshList: false,
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
    setRefreshList: (state) => {
      state.refreshList = !state.refreshList;
    },
    setStatus: (state, action) => {
      state.status = action.payload;
    },
    setType: (state, action) => {
      state.type = action.payload;
    },
    setMessage: (state, action) => {
      state.message = action.payload;
    },
    setVariant: (state, action) => {
      state.variant = action.payload;
    },
    setIdItemDelete: (state, action) => {
      state.idItemDelete = action.payload;
    },
    setTypeSelect: (state, action) => {
      state.typeSelect = action.payload;
    },
  },
});

export const {
  setShow,
  setClose,
  setStatus,
  setType,
  setMessage,setTypeSelect,
  setVariant,
  setIdItemDelete,
  setRefreshList
} = myModalSlice.actions;
export default myModalSlice.reducer;
