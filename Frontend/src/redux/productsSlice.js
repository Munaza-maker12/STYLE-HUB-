import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// export const fetchProducts = createAsyncThunk(
//   "products/fetchProducts",
//   async (searchQuery) => {
//     const res = await axios.get(`http://localhost:4000/api/products?search=${searchQuery}`);
//     return res.data;
//   }
// );
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (searchQuery) => {
    const res = await axios.get(`http://localhost:4000/api/products/search/query?q=${searchQuery}`);
    return res.data;
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState: { items: [], status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => { state.status = "loading"; })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default productsSlice.reducer;
