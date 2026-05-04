  import { createSlice } from "@reduxjs/toolkit";

// ✅ localStorage se cart load karo — refresh ke baad bhi rehega
const loadCartFromStorage = () => {
  try {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

// ✅ localStorage mein save karo
const saveCartToStorage = (items) => {
  try {
    localStorage.setItem("cart", JSON.stringify(items));
  } catch {}
};

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: loadCartFromStorage(), // ✅ start mein localStorage se load
  },
  reducers: {
    addToCart: (state, action) => {
      const newItem = action.payload;
      const existing = state.items.find(
        (i) => i.id === newItem.id && i.size === newItem.size
      );
      if (existing) {
        existing.quantity += newItem.quantity || 1;
      } else {
        state.items.push({ ...newItem, quantity: newItem.quantity || 1 });
      }
      saveCartToStorage(state.items); // ✅ save
    },

    removeFromCart: (state, action) => {
      const { id, size } = action.payload;
      state.items = state.items.filter(
        (i) => !(i.id === id && i.size === size)
      );
      saveCartToStorage(state.items); // ✅ save
    },

    increaseQuantity: (state, action) => {
      const { id, size } = action.payload;
      const item = state.items.find((i) => i.id === id && i.size === size);
      if (item) item.quantity += 1;
      saveCartToStorage(state.items); // ✅ save
    },

    decreaseQuantity: (state, action) => {
      const { id, size } = action.payload;
      const item = state.items.find((i) => i.id === id && i.size === size);
      if (item && item.quantity > 1) item.quantity -= 1;
      saveCartToStorage(state.items); // ✅ save
    },

    clearCart: (state) => {
      state.items = [];
      localStorage.removeItem("cart"); // ✅ order ke baad clear
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;