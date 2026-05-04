// // import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// // import axios from "axios";

// // const getToken = () =>
// //   localStorage.getItem("accessToken") ||
// //   localStorage.getItem("token") ||
// //   localStorage.getItem("userToken");

// // export const fetchWishlist = createAsyncThunk("wishlist/fetch", async () => {
// //   const res = await axios.get("http://localhost:4000/user/wishlist", {
// //     headers: { Authorization: `Bearer ${getToken()}` },
// //   });
// //   return res.data.wishlist;
// // });

// // export const toggleWishlist = createAsyncThunk("wishlist/toggle", async (productId) => {
// //   const res = await axios.post(
// //     `http://localhost:4000/user/wishlist/${productId}`,
// //     {},
// //     { headers: { Authorization: `Bearer ${getToken()}` } }
// //   );
// //   return res.data.wishlist;
// // });

// // const wishlistSlice = createSlice({
// //   name: "wishlist",
// //   initialState: { items: [], loading: false },
// //   reducers: {},
// //   extraReducers: (builder) => {
// //     builder
// //       .addCase(fetchWishlist.fulfilled, (state, action) => {
// //         state.items = action.payload;
// //       })
// //       .addCase(toggleWishlist.fulfilled, (state, action) => {
// //         state.items = action.payload;
// //       });
// //   },
// // });

// // export default wishlistSlice.reducer;
// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";

// const getToken = () =>
//   localStorage.getItem("accessToken") ||
//   localStorage.getItem("token") ||
//   localStorage.getItem("userToken");

// export const fetchWishlist = createAsyncThunk("wishlist/fetch", async () => {
//   const res = await axios.get("http://localhost:4000/user/wishlist", {
//     headers: { Authorization: `Bearer ${getToken()}` },
//   });
//   return res.data.wishlist;
// });

// export const toggleWishlist = createAsyncThunk(
//   "wishlist/toggle",
//   async (productId) => {
//     const res = await axios.post(
//       `http://localhost:4000/user/wishlist/${productId}`,
//       {},
//       { headers: { Authorization: `Bearer ${getToken()}` } }
//     );
//     return res.data.wishlist;
//   }
// );

// const wishlistSlice = createSlice({
//   name: "wishlist",
//   initialState: { items: [], loading: false },
//   reducers: {
//     // ✅ Optimistic toggle — ID string ke basis par instantly add/remove
//     optimisticToggle: (state, action) => {
//       const productId = action.payload;
//       const exists = state.items.some(
//         (item) => (item._id || item) === productId
//       );
//       if (exists) {
//         state.items = state.items.filter(
//           (item) => (item._id || item) !== productId
//         );
//       } else {
//         // Sirf ID push karo — server baad mein full object dega
//         state.items = [...state.items, { _id: productId }];
//       }
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchWishlist.fulfilled, (state, action) => {
//         state.items = action.payload;
//       })
//       // Server se real data aane par replace karo
//       .addCase(toggleWishlist.fulfilled, (state, action) => {
//         state.items = action.payload;
//       });
//   },
// });

// export const { optimisticToggle } = wishlistSlice.actions;
// export default wishlistSlice.reducer;
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ===============================
// 🔑 Token helper
// ===============================
const getToken = () =>
  localStorage.getItem("accessToken") ||
  localStorage.getItem("token") ||
  localStorage.getItem("userToken");

// ===============================
// 📥 Fetch Wishlist from backend
// ===============================
export const fetchWishlist = createAsyncThunk(
  "wishlist/fetchWishlist",
  async () => {
    const res = await axios.get("http://localhost:4000/user/wishlist", {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    return res.data.wishlist || [];
  }
);

// ===============================
// 🔄 Toggle Wishlist API
// ===============================
export const toggleWishlist = createAsyncThunk(
  "wishlist/toggleWishlist",
  async (productId) => {
    const res = await axios.post(
      `http://localhost:4000/user/wishlist/${productId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );

    return res.data.wishlist || [];
  }
);

// ===============================
// 🆔 Helper to get ID
// ===============================
const getId = (item) =>
  typeof item === "string"
    ? item
    : item?._id?.toString?.() || item?._id;

// ===============================
// 🧠 Wishlist Slice
// ===============================
const wishlistSlice = createSlice({
  name: "wishlist",

  initialState: {
    items: [],
    loading: false,
    error: null,
  },

  reducers: {
    // =========================
    // ⭐ Optimistic Toggle UI
    // =========================
    optimisticToggle: (state, action) => {
      const productId = action.payload.toString();

      const exists = state.items.some(
        (item) => getId(item) === productId
      );

      if (exists) {
        state.items = state.items.filter(
          (item) => getId(item) !== productId
        );
      } else {
        state.items.push({ _id: productId });
      }
    },

    // =========================
    // 🧹 Clear Wishlist (FIX FOR YOUR ERROR)
    // =========================
    clearWishlist: (state) => {
      state.items = [];
    },
  },

  extraReducers: (builder) => {
    builder
      // =========================
      // FETCH
      // =========================
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
      })

      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })

      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // =========================
      // TOGGLE
      // =========================
      .addCase(toggleWishlist.fulfilled, (state, action) => {
        const serverItems = action.payload;

        const serverIds = new Set(serverItems.map((i) => getId(i)));
        const localIds = new Set(state.items.map((i) => getId(i)));

        const same =
          serverIds.size === localIds.size &&
          [...serverIds].every((id) => localIds.has(id));

        if (!same) {
          state.items = serverItems;
        }
      });
  },
});

// ===============================
// 📤 EXPORTS
// ===============================
export const { optimisticToggle, clearWishlist } =
  wishlistSlice.actions;

export default wishlistSlice.reducer;