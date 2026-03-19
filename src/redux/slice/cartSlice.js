import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cart: [],
  showCartDrawer: false,
};

export const cartSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCart: (state, action) => {
      state.cart = action.payload;
    },
    setShowCartDrawer: (state, action) => {
      state.showCartDrawer = action.payload;
    },
  },
});

export const { setCart, setShowCartDrawer } = cartSlice.actions;
export const cartReducer = cartSlice.reducer;
