// import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchWishlist, toggleWishlist } from "./redux/wishlistSlice";
// import { useNavigate } from "react-router-dom";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { FaHeart, FaShoppingBag, FaArrowLeft } from "react-icons/fa";
// import { MdOutlineStorefront } from "react-icons/md";

// /* ─── Inline styles (no extra CSS file needed) ─── */
// const S = {
//   page: {
//     minHeight: "100vh",
//     background: "linear-gradient(135deg, #fff5f5 0%, #fff0f0 50%, #ffeaea 100%)",
//     fontFamily: "'Georgia', serif",
//     padding: "0 0 4rem",
//   },

//   /* ── Hero banner ── */
//   hero: {
//     background: "linear-gradient(135deg, #1a1a1a 0%, #2d0a0a 60%, #1a1a1a 100%)",
//     padding: "3rem 2rem 2.5rem",
//     textAlign: "center",
//     position: "relative",
//     overflow: "hidden",
//   },
//   heroBefore: {
//     position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
//     background: "radial-gradient(ellipse at center, rgba(180,30,30,0.18) 0%, transparent 70%)",
//     pointerEvents: "none",
//   },
//   heroTitle: {
//     fontSize: "clamp(2rem, 5vw, 3.2rem)",
//     color: "#fff",
//     margin: 0,
//     letterSpacing: "0.12em",
//     fontWeight: 400,
//     textTransform: "uppercase",
//   },
//   heroHeart: {
//     color: "#e53e3e",
//     marginRight: "0.5rem",
//     verticalAlign: "middle",
//     fontSize: "2rem",
//   },
//   heroSub: {
//     color: "rgba(255,255,255,0.55)",
//     marginTop: "0.5rem",
//     fontSize: "0.95rem",
//     letterSpacing: "0.08em",
//   },

//   /* ── Back button ── */
//   backBtn: {
//     display: "inline-flex",
//     alignItems: "center",
//     gap: "0.5rem",
//     margin: "1.5rem 2rem",
//     background: "none",
//     border: "1.5px solid #c53030",
//     color: "#c53030",
//     borderRadius: "2rem",
//     padding: "0.45rem 1.2rem",
//     cursor: "pointer",
//     fontSize: "0.88rem",
//     letterSpacing: "0.04em",
//     transition: "all 0.2s",
//     fontFamily: "inherit",
//   },

//   /* ── Counter chip ── */
//   chip: {
//     display: "inline-block",
//     background: "#c53030",
//     color: "#fff",
//     borderRadius: "2rem",
//     padding: "0.25rem 1rem",
//     fontSize: "0.82rem",
//     letterSpacing: "0.06em",
//     margin: "0 2rem 1.5rem",
//     fontFamily: "inherit",
//   },

//   /* ── Grid ── */
//   grid: {
//     display: "grid",
//     gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
//     gap: "1.8rem",
//     padding: "0 2rem",
//     maxWidth: "1300px",
//     margin: "0 auto",
//   },

//   /* ── Card ── */
//   card: {
//     background: "#fff",
//     borderRadius: "16px",
//     overflow: "hidden",
//     boxShadow: "0 2px 20px rgba(0,0,0,0.07)",
//     transition: "transform 0.25s, box-shadow 0.25s",
//     cursor: "pointer",
//     position: "relative",
//     display: "flex",
//     flexDirection: "column",
//   },

//   imgWrap: {
//     position: "relative",
//     overflow: "hidden",
//     aspectRatio: "3/4",
//     background: "#f8f0f0",
//   },
//   img: {
//     width: "100%",
//     height: "100%",
//     objectFit: "cover",
//     transition: "transform 0.4s ease",
//     display: "block",
//   },

//   /* Out of stock overlay */
//   outOfStockOverlay: {
//     position: "absolute",
//     inset: 0,
//     background: "rgba(0,0,0,0.45)",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   outOfStockBadge: {
//     background: "#1a1a1a",
//     color: "#fff",
//     padding: "0.5rem 1.2rem",
//     borderRadius: "2rem",
//     fontSize: "0.78rem",
//     letterSpacing: "0.12em",
//     textTransform: "uppercase",
//     border: "1px solid rgba(255,255,255,0.2)",
//   },

//   /* Remove heart button */
//   removeBtn: {
//     position: "absolute",
//     top: "12px",
//     right: "12px",
//     background: "#fff",
//     border: "none",
//     borderRadius: "50%",
//     width: "36px",
//     height: "36px",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     cursor: "pointer",
//     boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
//     color: "#e53e3e",
//     fontSize: "16px",
//     transition: "transform 0.2s, box-shadow 0.2s",
//     zIndex: 5,
//   },

//   /* Card body */
//   cardBody: {
//     padding: "1rem 1.1rem 1.2rem",
//     display: "flex",
//     flexDirection: "column",
//     gap: "0.5rem",
//     flex: 1,
//   },
//   productName: {
//     fontSize: "1rem",
//     fontWeight: 600,
//     color: "#1a1a1a",
//     margin: 0,
//     lineHeight: 1.35,
//     fontFamily: "inherit",
//   },
//   priceRow: {
//     display: "flex",
//     alignItems: "center",
//     gap: "0.6rem",
//   },
//   newPrice: {
//     fontSize: "1.05rem",
//     fontWeight: 700,
//     color: "#c53030",
//     fontFamily: "inherit",
//   },
//   oldPrice: {
//     fontSize: "0.85rem",
//     color: "#aaa",
//     textDecoration: "line-through",
//     fontFamily: "inherit",
//   },

//   /* Stock chips */
//   stockRow: {
//     display: "flex",
//     flexWrap: "wrap",
//     gap: "0.3rem",
//     marginTop: "0.15rem",
//   },
//   sizeChip: (available) => ({
//     fontSize: "0.7rem",
//     padding: "2px 8px",
//     borderRadius: "3px",
//     border: `1px solid ${available ? "#c53030" : "#ddd"}`,
//     color: available ? "#c53030" : "#bbb",
//     background: available ? "#fff5f5" : "#fafafa",
//     fontFamily: "inherit",
//   }),

//   /* Add to cart button */
//   cartBtn: {
//     marginTop: "auto",
//     padding: "0.65rem",
//     background: "linear-gradient(135deg, #c53030, #9b2c2c)",
//     color: "#fff",
//     border: "none",
//     borderRadius: "8px",
//     cursor: "pointer",
//     fontSize: "0.85rem",
//     letterSpacing: "0.06em",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     gap: "0.5rem",
//     transition: "opacity 0.2s",
//     fontFamily: "inherit",
//   },
//   cartBtnDisabled: {
//     background: "#ddd",
//     color: "#999",
//     cursor: "not-allowed",
//   },

//   /* ── Empty state ── */
//   empty: {
//     textAlign: "center",
//     padding: "5rem 2rem",
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     gap: "1rem",
//   },
//   emptyIcon: {
//     fontSize: "5rem",
//     color: "#e9b4b4",
//   },
//   emptyTitle: {
//     fontSize: "1.6rem",
//     color: "#1a1a1a",
//     margin: 0,
//     fontWeight: 400,
//     letterSpacing: "0.05em",
//   },
//   emptyText: {
//     color: "#888",
//     fontSize: "0.95rem",
//     margin: 0,
//     fontFamily: "'Helvetica Neue', sans-serif",
//   },
//   shopBtn: {
//     marginTop: "0.5rem",
//     padding: "0.75rem 2rem",
//     background: "#1a1a1a",
//     color: "#fff",
//     border: "none",
//     borderRadius: "2rem",
//     cursor: "pointer",
//     fontSize: "0.9rem",
//     letterSpacing: "0.06em",
//     display: "flex",
//     alignItems: "center",
//     gap: "0.5rem",
//     transition: "background 0.2s",
//     fontFamily: "inherit",
//   },

//   /* ── Not logged in ── */
//   loginMsg: {
//     textAlign: "center",
//     padding: "6rem 2rem",
//     fontFamily: "'Georgia', serif",
//   },
// };

// /* ─── Helper: is product out of stock? ─── */
// const isOutOfStock = (p) => {
//   const stockTotal = Object.values(p.stock || {}).reduce((a, b) => a + b, 0);
//   return stockTotal === 0 && (p.customStock || 0) === 0;
// };

// /* ─── WishlistPage Component ─── */
// const WishlistPage = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { items } = useSelector((state) => state.wishlist);
//   const reduxUser = useSelector((state) => state.user.userInfo);

//   // localStorage se bhi check — Redux page reload pe late hoti hai
//   const localUser = (() => {
//     try { return JSON.parse(localStorage.getItem("user")); } catch { return null; }
//   })();
//   const user = reduxUser || localUser;

//   useEffect(() => {
//     if (user?._id) dispatch(fetchWishlist());
//   }, [user?._id]);

//   const handleRemove = (productId, e) => {
//   e.stopPropagation();
//   // 1. Pehle optimistic — instant UI se item hata do
//   dispatch(optimisticToggle(productId));
//   // 2. Background mein server call — fetchWishlist dobara mat karo
//   dispatch(toggleWishlist(productId));
//   toast.info("Removed from wishlist", { icon: "💔" });
// };

//   const handleViewProduct = (p, e) => {
//     e.stopPropagation();
//     if (!isOutOfStock(p)) navigate(`/product/${p._id}`);
//   };

//   /* ── Not logged in ── */
//   if (!user) {
//     return (
//       <div style={S.loginMsg}>
//         <FaHeart style={{ fontSize: "4rem", color: "#e9b4b4", marginBottom: "1rem" }} />
//         <h2 style={{ fontWeight: 400, color: "#1a1a1a" }}>Your Wishlist Awaits</h2>
//         <p style={{ color: "#888", marginBottom: "1.5rem" }}>Please login to see your saved items.</p>
//         <button style={S.shopBtn} onClick={() => navigate("/login")}>
//           Login to Continue
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div style={S.page}>
//       <ToastContainer position="top-right" autoClose={2500} />

//       {/* Hero */}
//       <div style={S.hero}>
//         <div style={S.heroBefore} />
//         <h1 style={S.heroTitle}>
//           <FaHeart style={S.heroHeart} />
//           My Wishlist
//         </h1>
//         <p style={S.heroSub}>Items you love, saved for later</p>
//       </div>

//       {/* Back button */}
//       <button
//         style={S.backBtn}
//         onClick={() => navigate(-1)}
//         onMouseEnter={(e) => { e.target.style.background = "#c53030"; e.target.style.color = "#fff"; }}
//         onMouseLeave={(e) => { e.target.style.background = "none"; e.target.style.color = "#c53030"; }}
//       >
//         <FaArrowLeft size={12} /> Back
//       </button>

//       {/* Empty State */}
//       {items.length === 0 ? (
//         <div style={S.empty}>
//           <MdOutlineStorefront style={S.emptyIcon} />
//           <h2 style={S.emptyTitle}>Your wishlist is empty</h2>
//           <p style={S.emptyText}>Explore our collections and save items you love ❤️</p>
//           <button
//             style={S.shopBtn}
//             onClick={() => navigate("/")}
//             onMouseEnter={(e) => e.currentTarget.style.background = "#c53030"}
//             onMouseLeave={(e) => e.currentTarget.style.background = "#1a1a1a"}
//           >
//             <MdOutlineStorefront /> Start Shopping
//           </button>
//         </div>
//       ) : (
//         <>
//           {/* Item count chip */}
//           <div style={S.chip}>
//             {items.length} {items.length === 1 ? "item" : "items"} saved
//           </div>

//           {/* Product Grid */}
//           <div style={S.grid}>
//             {[...new Map(items.map(p => [p._id, p])).values()].map((p) => {
//               const oos = isOutOfStock(p);
//               return (
//                 <div
//                   key={p._id}
//                   style={S.card}
//                   onClick={() => navigate(`/product/${p._id}`)}
//                   onMouseEnter={(e) => {
//                     e.currentTarget.style.transform = "translateY(-6px)";
//                     e.currentTarget.style.boxShadow = "0 12px 35px rgba(0,0,0,0.13)";
//                     const img = e.currentTarget.querySelector(".wish-img");
//                     if (img) img.style.transform = "scale(1.06)";
//                   }}
//                   onMouseLeave={(e) => {
//                     e.currentTarget.style.transform = "translateY(0)";
//                     e.currentTarget.style.boxShadow = "0 2px 20px rgba(0,0,0,0.07)";
//                     const img = e.currentTarget.querySelector(".wish-img");
//                     if (img) img.style.transform = "scale(1)";
//                   }}
//                 >
//                   {/* Image */}
//                   <div style={S.imgWrap}>
//                     <img
//                       className="wish-img"
//                       src={p.images?.[0]}
//                       alt={p.name}
//                       style={S.img}
//                     />

//                     {/* Out of stock overlay */}
//                     {oos && (
//                       <div style={S.outOfStockOverlay}>
//                         <span style={S.outOfStockBadge}>Out of Stock</span>
//                       </div>
//                     )}

//                     {/* Remove heart */}
//                     <button
//                       style={S.removeBtn}
//                       onClick={(e) => handleRemove(p._id, e)}
//                       title="Remove from wishlist"
//                       onMouseEnter={(e) => {
//                         e.currentTarget.style.transform = "scale(1.15)";
//                         e.currentTarget.style.boxShadow = "0 4px 14px rgba(0,0,0,0.2)";
//                       }}
//                       onMouseLeave={(e) => {
//                         e.currentTarget.style.transform = "scale(1)";
//                         e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.15)";
//                       }}
//                     >
//                       <FaHeart />
//                     </button>
//                   </div>

//                   {/* Card body */}
//                   <div style={S.cardBody}>
//                     <h3 style={S.productName}>{p.name}</h3>

//                     {/* Price */}
//                     <div style={S.priceRow}>
//                       <span style={S.newPrice}>Rs {p.new_price}</span>
//                       {p.old_price && (
//                         <span style={S.oldPrice}>Rs {p.old_price}</span>
//                       )}
//                     </div>

//                     {/* Size availability chips */}
//                     {p.stock && (
//                       <div style={S.stockRow}>
//                         {Object.entries(p.stock).map(([size, qty]) => (
//                           <span key={size} style={S.sizeChip(qty > 0)}>
//                             {size}
//                           </span>
//                         ))}
//                         {p.customStock > 0 && (
//                           <span key="custom" style={S.sizeChip(true)}>Custom</span>
//                         )}
//                       </div>
//                     )}

//                     {/* View & Order button */}
//                     <button
//                       style={oos ? { ...S.cartBtn, ...S.cartBtnDisabled } : S.cartBtn}
//                       onClick={(e) => handleViewProduct(p, e)}
//                       disabled={oos}
//                       onMouseEnter={(e) => { if (!oos) e.currentTarget.style.opacity = "0.85"; }}
//                       onMouseLeave={(e) => { if (!oos) e.currentTarget.style.opacity = "1"; }}
//                     >
//                       <FaShoppingBag size={13} />
//                       {oos ? "Out of Stock" : "View & Order"}
//                     </button>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default WishlistPage;
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
// ✅ optimisticToggle import add kiya
import { fetchWishlist, toggleWishlist, optimisticToggle } from "./redux/wishlistSlice";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaHeart, FaShoppingBag, FaArrowLeft } from "react-icons/fa";
import { MdOutlineStorefront } from "react-icons/md";

const S = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #fff5f5 0%, #fff0f0 50%, #ffeaea 100%)",
    fontFamily: "'Georgia', serif",
    padding: "0 0 4rem",
  },
  hero: {
    background: "linear-gradient(135deg, #1a1a1a 0%, #2d0a0a 60%, #1a1a1a 100%)",
    padding: "3rem 2rem 2.5rem",
    textAlign: "center",
    position: "relative",
    overflow: "hidden",
  },
  heroBefore: {
    position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
    background: "radial-gradient(ellipse at center, rgba(180,30,30,0.18) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  heroTitle: {
    fontSize: "clamp(2rem, 5vw, 3.2rem)",
    color: "#fff",
    margin: 0,
    letterSpacing: "0.12em",
    fontWeight: 400,
    textTransform: "uppercase",
  },
  heroHeart: {
    color: "#e53e3e",
    marginRight: "0.5rem",
    verticalAlign: "middle",
    fontSize: "2rem",
  },
  heroSub: {
    color: "rgba(255,255,255,0.55)",
    marginTop: "0.5rem",
    fontSize: "0.95rem",
    letterSpacing: "0.08em",
  },
  backBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.5rem",
    margin: "1.5rem 2rem",
    background: "none",
    border: "1.5px solid #c53030",
    color: "#c53030",
    borderRadius: "2rem",
    padding: "0.45rem 1.2rem",
    cursor: "pointer",
    fontSize: "0.88rem",
    letterSpacing: "0.04em",
    transition: "all 0.2s",
    fontFamily: "inherit",
  },
  chip: {
    display: "inline-block",
    background: "#c53030",
    color: "#fff",
    borderRadius: "2rem",
    padding: "0.25rem 1rem",
    fontSize: "0.82rem",
    letterSpacing: "0.06em",
    margin: "0 2rem 1.5rem",
    fontFamily: "inherit",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: "1.8rem",
    padding: "0 2rem",
    maxWidth: "1300px",
    margin: "0 auto",
  },
  card: {
    background: "#fff",
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow: "0 2px 20px rgba(0,0,0,0.07)",
    transition: "transform 0.25s, box-shadow 0.25s",
    cursor: "pointer",
    position: "relative",
    display: "flex",
    flexDirection: "column",
  },
  imgWrap: {
    position: "relative",
    overflow: "hidden",
    aspectRatio: "3/4",
    background: "#f8f0f0",
  },
  img: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "transform 0.4s ease",
    display: "block",
  },
  outOfStockOverlay: {
    position: "absolute",
    inset: 0,
    background: "rgba(0,0,0,0.45)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  outOfStockBadge: {
    background: "#1a1a1a",
    color: "#fff",
    padding: "0.5rem 1.2rem",
    borderRadius: "2rem",
    fontSize: "0.78rem",
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    border: "1px solid rgba(255,255,255,0.2)",
  },
  removeBtn: {
    position: "absolute",
    top: "12px",
    right: "12px",
    background: "#fff",
    border: "none",
    borderRadius: "50%",
    width: "36px",
    height: "36px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
    color: "#e53e3e",
    fontSize: "16px",
    transition: "transform 0.2s, box-shadow 0.2s",
    zIndex: 5,
  },
  cardBody: {
    padding: "1rem 1.1rem 1.2rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    flex: 1,
  },
  productName: {
    fontSize: "1rem",
    fontWeight: 600,
    color: "#1a1a1a",
    margin: 0,
    lineHeight: 1.35,
    fontFamily: "inherit",
  },
  priceRow: {
    display: "flex",
    alignItems: "center",
    gap: "0.6rem",
  },
  newPrice: {
    fontSize: "1.05rem",
    fontWeight: 700,
    color: "#c53030",
    fontFamily: "inherit",
  },
  oldPrice: {
    fontSize: "0.85rem",
    color: "#aaa",
    textDecoration: "line-through",
    fontFamily: "inherit",
  },
  stockRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.3rem",
    marginTop: "0.15rem",
  },
  sizeChip: (available) => ({
    fontSize: "0.7rem",
    padding: "2px 8px",
    borderRadius: "3px",
    border: `1px solid ${available ? "#c53030" : "#ddd"}`,
    color: available ? "#c53030" : "#bbb",
    background: available ? "#fff5f5" : "#fafafa",
    fontFamily: "inherit",
  }),
  cartBtn: {
    marginTop: "auto",
    padding: "0.65rem",
    background: "linear-gradient(135deg, #c53030, #9b2c2c)",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "0.85rem",
    letterSpacing: "0.06em",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    transition: "opacity 0.2s",
    fontFamily: "inherit",
  },
  cartBtnDisabled: {
    background: "#ddd",
    color: "#999",
    cursor: "not-allowed",
  },
  empty: {
    textAlign: "center",
    padding: "5rem 2rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "1rem",
  },
  emptyIcon: { fontSize: "5rem", color: "#e9b4b4" },
  emptyTitle: {
    fontSize: "1.6rem",
    color: "#1a1a1a",
    margin: 0,
    fontWeight: 400,
    letterSpacing: "0.05em",
  },
  emptyText: {
    color: "#888",
    fontSize: "0.95rem",
    margin: 0,
    fontFamily: "'Helvetica Neue', sans-serif",
  },
  shopBtn: {
    marginTop: "0.5rem",
    padding: "0.75rem 2rem",
    background: "#1a1a1a",
    color: "#fff",
    border: "none",
    borderRadius: "2rem",
    cursor: "pointer",
    fontSize: "0.9rem",
    letterSpacing: "0.06em",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    transition: "background 0.2s",
    fontFamily: "inherit",
  },
  loginMsg: {
    textAlign: "center",
    padding: "6rem 2rem",
    fontFamily: "'Georgia', serif",
  },
};

// ✅ stock undefined hone par crash nahi hoga
const isOutOfStock = (p) => {
  if (!p?.stock) return false;
  const stockTotal = Object.values(p.stock).reduce((a, b) => a + b, 0);
  return stockTotal === 0 && (p.customStock || 0) === 0;
};

const WishlistPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items } = useSelector((state) => state.wishlist);
  const reduxUser = useSelector((state) => state.user.userInfo);

  const localUser = (() => {
    try { return JSON.parse(localStorage.getItem("user")); } catch { return null; }
  })();
  const user = reduxUser || localUser;

  useEffect(() => {
    if (user?._id) dispatch(fetchWishlist());
  }, [user?._id]);

  const handleRemove = (productId, e) => {
    e.stopPropagation();
    dispatch(optimisticToggle(productId)); // ✅ instant UI remove
    dispatch(toggleWishlist(productId));   // background server call
    toast.info("Removed from wishlist", { icon: "💔" });
  };

  const handleViewProduct = (p, e) => {
    e.stopPropagation();
    if (!isOutOfStock(p)) navigate(`/product/${p._id}`);
  };

  if (!user) {
    return (
      <div style={S.loginMsg}>
        <FaHeart style={{ fontSize: "4rem", color: "#e9b4b4", marginBottom: "1rem" }} />
        <h2 style={{ fontWeight: 400, color: "#1a1a1a" }}>Your Wishlist Awaits</h2>
        <p style={{ color: "#888", marginBottom: "1.5rem" }}>Please login to see your saved items.</p>
        <button style={S.shopBtn} onClick={() => navigate("/login")}>
          Login to Continue
        </button>
      </div>
    );
  }

  // ✅ Sirf real items render karo — optimistic stubs (name nahi) ko skip karo
  const realItems = items.filter((p) => p?.name);

  return (
    <div style={S.page}>
      <ToastContainer position="top-right" autoClose={2500} />

      <div style={S.hero}>
        <div style={S.heroBefore} />
        <h1 style={S.heroTitle}>
          <FaHeart style={S.heroHeart} />
          My Wishlist
        </h1>
        <p style={S.heroSub}>Items you love, saved for later</p>
      </div>

      <button
        style={S.backBtn}
        onClick={() => navigate(-1)}
        onMouseEnter={(e) => { e.target.style.background = "#c53030"; e.target.style.color = "#fff"; }}
        onMouseLeave={(e) => { e.target.style.background = "none"; e.target.style.color = "#c53030"; }}
      >
        <FaArrowLeft size={12} /> Back
      </button>

      {realItems.length === 0 ? (
        <div style={S.empty}>
          <MdOutlineStorefront style={S.emptyIcon} />
          <h2 style={S.emptyTitle}>Your wishlist is empty</h2>
          <p style={S.emptyText}>Explore our collections and save items you love ❤️</p>
          <button
            style={S.shopBtn}
            onClick={() => navigate("/")}
            onMouseEnter={(e) => e.currentTarget.style.background = "#c53030"}
            onMouseLeave={(e) => e.currentTarget.style.background = "#1a1a1a"}
          >
            <MdOutlineStorefront /> Start Shopping
          </button>
        </div>
      ) : (
        <>
          <div style={S.chip}>
            {realItems.length} {realItems.length === 1 ? "item" : "items"} saved
          </div>

          <div style={S.grid}>
            {realItems.map((p) => {
              const oos = isOutOfStock(p);
              return (
                <div
                  key={p._id}
                  style={S.card}
                  onClick={() => navigate(`/product/${p._id}`)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-6px)";
                    e.currentTarget.style.boxShadow = "0 12px 35px rgba(0,0,0,0.13)";
                    const img = e.currentTarget.querySelector(".wish-img");
                    if (img) img.style.transform = "scale(1.06)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 2px 20px rgba(0,0,0,0.07)";
                    const img = e.currentTarget.querySelector(".wish-img");
                    if (img) img.style.transform = "scale(1)";
                  }}
                >
                  <div style={S.imgWrap}>
                    <img
                      className="wish-img"
                      src={p.images?.[0]}
                      alt={p.name}
                      style={S.img}
                    />
                    {oos && (
                      <div style={S.outOfStockOverlay}>
                        <span style={S.outOfStockBadge}>Out of Stock</span>
                      </div>
                    )}
                    <button
                      style={S.removeBtn}
                      onClick={(e) => handleRemove(p._id, e)}
                      title="Remove from wishlist"
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "scale(1.15)";
                        e.currentTarget.style.boxShadow = "0 4px 14px rgba(0,0,0,0.2)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "scale(1)";
                        e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.15)";
                      }}
                    >
                      <FaHeart />
                    </button>
                  </div>

                  <div style={S.cardBody}>
                    <h3 style={S.productName}>{p.name}</h3>
                    <div style={S.priceRow}>
                      <span style={S.newPrice}>Rs {p.new_price}</span>
                      {p.old_price && <span style={S.oldPrice}>Rs {p.old_price}</span>}
                    </div>
                    {p.stock && (
                      <div style={S.stockRow}>
                        {Object.entries(p.stock).map(([size, qty]) => (
                          <span key={size} style={S.sizeChip(qty > 0)}>{size}</span>
                        ))}
                        {p.customStock > 0 && (
                          <span key="custom" style={S.sizeChip(true)}>Custom</span>
                        )}
                      </div>
                    )}
                    <button
                      style={oos ? { ...S.cartBtn, ...S.cartBtnDisabled } : S.cartBtn}
                      onClick={(e) => handleViewProduct(p, e)}
                      disabled={oos}
                      onMouseEnter={(e) => { if (!oos) e.currentTarget.style.opacity = "0.85"; }}
                      onMouseLeave={(e) => { if (!oos) e.currentTarget.style.opacity = "1"; }}
                    >
                      <FaShoppingBag size={13} />
                      {oos ? "Out of Stock" : "View & Order"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default WishlistPage;