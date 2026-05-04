
// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { useDispatch, useSelector } from "react-redux";
// import { toggleWishlist, fetchWishlist } from "./redux/wishlistSlice";
// import { FaHeart, FaRegHeart } from "react-icons/fa";
// import { toast } from "react-toastify";
// import "./newArrival.css";

// const NewArrivals = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const [products, setProducts] = useState([]);
//   const [filter, setFilter] = useState("newest");

//   const wishlistItems = useSelector((state) => state.wishlist.items);
//   const reduxUser = useSelector((state) => state.user.userInfo);

//   const localUser = (() => {
//     try { return JSON.parse(localStorage.getItem("user")); } catch { return null; }
//   })();
//   const user = reduxUser || localUser;

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const { data } = await axios.get("http://localhost:4000/api/products/newarrivals");
//         if (data.success) setProducts(data.products);
//       } catch (err) {
//         console.error("Failed to fetch products:", err);
//       }
//     };
//     fetchProducts();
//   }, []);

//   useEffect(() => {
//     if (user?._id) dispatch(fetchWishlist());
//   }, [user?._id]);

//   const isWishlisted = (productId) =>
//     wishlistItems.some((item) => (item._id || item) === productId);

//   const handleWishlist = (e, productId) => {
//     e.stopPropagation();
//     if (!user) {
//       toast.error("Please login to add to wishlist");
//       return;
//     }
//     dispatch(toggleWishlist(productId));
//   };

//   const getMainImage = (product) =>
//     Array.isArray(product.images) && product.images.length > 0
//       ? product.images[0]
//       : "";

//   const getSortedProducts = () => {
//     const sorted = [...products];
//     switch (filter) {
//       case "price_high_low":
//         return sorted.sort((a, b) => b.new_price - a.new_price);
//       case "price_low_high":
//         return sorted.sort((a, b) => a.new_price - b.new_price);
//       case "newest":
//         return sorted.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
//       case "oldest":
//         return sorted.sort((a, b) => new Date(a.dateAdded) - new Date(b.dateAdded));
//       default:
//         return sorted;
//     }
//   };

//   const sortedProducts = getSortedProducts();

//   return (
//     <section className="new-arrival">

//       {/* Filter top-right, heading+p center */}
//       <div className="arrival-header">
//         <div className="arrival-title">
//           <h2>New Arrivals</h2>
//           <p>Stay ahead of trends with our latest collections</p>
//         </div>
//         <select
//           className="arrival-filter"
//           value={filter}
//           onChange={(e) => setFilter(e.target.value)}
//         >
//           <option value="newest">Newest</option>
//           <option value="oldest">Oldest</option>
//           <option value="price_high_low">Price: High to Low</option>
//           <option value="price_low_high">Price: Low to High</option>
//         </select>
//       </div>

//       <div className="arrival-grid">
//         {sortedProducts.map((product) => (
//           <div
//             key={product._id}
//             className="arrival-item"
//             onClick={() => navigate(`/product/${product._id}`, { state: product })}
//             style={{ position: "relative" }}
//           >
//             <img src={getMainImage(product)} alt={product.name} className="product-image" />

//             <span
//               onClick={(e) => handleWishlist(e, product._id)}
//               style={{
//                 position: "absolute",
//                 top: "10px",
//                 right: "10px",
//                 cursor: "pointer",
//                 fontSize: "20px",
//                 color: isWishlisted(product._id) ? "red" : "white",
//                 background: "rgba(0,0,0,0.35)",
//                 borderRadius: "50%",
//                 padding: "6px",
//                 zIndex: 10,
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 width: "34px",
//                 height: "34px",
//               }}
//             >
//               {isWishlisted(product._id) ? <FaHeart /> : <FaRegHeart />}
//             </span>

//             <p className="product-info">
//               {product.name}
//               <br />
//               <span className="price">Rs {product.new_price}</span>
//             </p>
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// };

// export default NewArrivals;
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { toggleWishlist, fetchWishlist, optimisticToggle } from "./redux/wishlistSlice";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./newArrival.css";

const NewArrivals = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState("newest");

  const wishlistItems = useSelector((state) => state.wishlist.items);
  const reduxUser = useSelector((state) => state.user.userInfo);

  const localUser = (() => {
    try { return JSON.parse(localStorage.getItem("user")); } catch { return null; }
  })();
  const user = reduxUser || localUser;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get("http://localhost:4000/api/products/newarrivals");
        if (data.success) setProducts(data.products);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (user?._id) dispatch(fetchWishlist());
  }, [user?._id]);

  const isWishlisted = (productId) =>
    wishlistItems.some((item) => (item._id || item) === productId);

  // ✅ Optimistic update — UI instant, server background mein
  const handleWishlist = (e, productId) => {
    e.stopPropagation();
    if (!user) {
      toast.error("Please login to add to wishlist");
      return;
    }
    dispatch(optimisticToggle(productId));   // instant UI
    dispatch(toggleWishlist(productId));     // background server call
  };

  const getMainImage = (product) =>
    Array.isArray(product.images) && product.images.length > 0
      ? product.images[0]
      : "";

  const getSortedProducts = () => {
    const sorted = [...products];
    switch (filter) {
      case "price_high_low":
        return sorted.sort((a, b) => b.new_price - a.new_price);
      case "price_low_high":
        return sorted.sort((a, b) => a.new_price - b.new_price);
      case "newest":
        return sorted.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
      case "oldest":
        return sorted.sort((a, b) => new Date(a.dateAdded) - new Date(b.dateAdded));
      default:
        return sorted;
    }
  };

  const sortedProducts = getSortedProducts();

  return (
    <section className="new-arrival">
      {/* ✅ ToastContainer add kiya — ab toast instant aayega */}
      <ToastContainer position="top-right" autoClose={2000} />

      <div className="arrival-header">
        <div className="arrival-title">
          <h2>New Arrivals</h2>
          <p>Stay ahead of trends with our latest collections</p>
        </div>
        <select
          className="arrival-filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="price_high_low">Price: High to Low</option>
          <option value="price_low_high">Price: Low to High</option>
        </select>
      </div>

      <div className="arrival-grid">
        {sortedProducts.map((product) => (
          <div
            key={product._id}
            className="arrival-item"
            onClick={() => navigate(`/product/${product._id}`, { state: product })}
            style={{ position: "relative" }}
          >
            <img src={getMainImage(product)} alt={product.name} className="product-image" />

            <span
              onClick={(e) => handleWishlist(e, product._id)}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                cursor: "pointer",
                fontSize: "20px",
                color: isWishlisted(product._id) ? "red" : "white",
                background: "rgba(0,0,0,0.35)",
                borderRadius: "50%",
                padding: "6px",
                zIndex: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "34px",
                height: "34px",
              }}
            >
              {isWishlisted(product._id) ? <FaHeart /> : <FaRegHeart />}
            </span>

            <p className="product-info">
              {product.name}
              <br />
              <span className="price">Rs {product.new_price}</span>
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default NewArrivals;