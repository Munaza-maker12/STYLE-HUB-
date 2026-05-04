
import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";

import productsReducer from "./productsSlice";
import userReducer from "./UserSlice";
import wishlistReducer from "./wishlistSlice";
export const store = configureStore({
  reducer: {
    cart: cartReducer,
  
     products: productsReducer,
      user: userReducer,
      wishlist: wishlistReducer,
  },
});

