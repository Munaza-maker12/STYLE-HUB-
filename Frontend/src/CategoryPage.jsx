

import React, { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { toggleWishlist, fetchWishlist } from "./redux/wishlistSlice";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import "./CategoryPage.css";

const CategoryPage = () => {
  const { slug } = useParams();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const subRefs = useRef({});
  const dispatch = useDispatch();

  const wishlistItems = useSelector((state) => state.wishlist.items);
  const reduxUser = useSelector((state) => state.user.userInfo);

  // ✅ localStorage se bhi check — Redux reload pe late hoti hai
  const localUser = (() => {
    try { return JSON.parse(localStorage.getItem("user")); } catch { return null; }
  })();
  const user = reduxUser || localUser;

  useEffect(() => {
    if (user?._id) dispatch(fetchWishlist());
  }, [user?._id]);

  const isWishlisted = (productId) =>
    wishlistItems.some((item) => (item._id || item) === productId);

  const handleWishlist = (e, productId) => {
    e.preventDefault();
     e.stopPropagation();
    if (!user) {
      toast.error("Please login to add to wishlist");
      return;
    }
    dispatch(toggleWishlist(productId));
  };

  useEffect(() => {
    const fetchCategoryAndProducts = async () => {
      try {
        setLoading(true);
        const categoryRes = await axios.get(`http://localhost:4000/api/categories/${slug}`);
        setCategory(categoryRes.data);

        const categoryNameLower = categoryRes.data.name.toLowerCase();
        const productsRes = await axios.get(`http://localhost:4000/api/products/category/${categoryNameLower}`);
        setProducts(productsRes.data);
        setLoading(false);
      } catch (err) {
        toast.error("Failed to fetch category or products");
        setLoading(false);
      }
    };
    fetchCategoryAndProducts();
  }, [slug]);

  const scrollToSub = (subSlug) => {
    if (subRefs.current[subSlug]) {
      subRefs.current[subSlug].scrollIntoView({ behavior: "smooth" });
    }
  };

  const productsBySub = {};
  category?.subcategories.forEach((sub) => {
    productsBySub[sub.slug] = products.filter(
      (p) => p.subCategory.toLowerCase() === sub.name.toLowerCase()
    );
  });

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <ToastContainer position="top-right" autoClose={2000} />

      <section
        className="hero-container"
        style={{
          backgroundImage: `url(${
            category?.slug === "men"
              ? "/assets/men.webp"
              : category?.slug === "women"
              ? "/assets/women.webp"
              : "/assets/default-hero.jpg"
          })`,
        }}
      >
        <div className="hero-content">
          <h1>{category?.name}</h1>
          <p>Explore our collection of {category?.name}</p>
        </div>
      </section>

      <div className="subcategories-section">
        <h2>Subcategories</h2>
        <div className="subcategories-container">
          {category?.subcategories.map((sub) => (
            <div
              key={sub._id}
              className="subcategory-card"
              onClick={() => scrollToSub(sub.slug)}
            >
              <img src={sub.image} alt={sub.name} />
              <p>{sub.name}</p>
            </div>
          ))}
        </div>
      </div>

      {category?.subcategories.map((sub) => (
        <div
          key={sub._id}
          ref={(el) => (subRefs.current[sub.slug] = el)}
          className="product-section"
        >
          <h2>{sub.name} Collection</h2>
          <div className="product-grid">
            {productsBySub[sub.slug]?.length > 0 ? (
              productsBySub[sub.slug].map((p) => (
                <Link to={`/product/${p._id}`} state={p} key={p._id}>
                  <div className="product-card">
                    <div style={{ position: "relative" }}>
                      <img src={p.images[0]} alt={p.name} />
                      <span
  onClick={(e) => handleWishlist(e, p._id)}
  style={{
    position: "absolute",
    top: "10px",
    right: "10px",
    cursor: "pointer",
    fontSize: "20px",
    color: isWishlisted(p._id) ? "red" : "white",
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
  {isWishlisted(p._id) ? <FaHeart /> : <FaRegHeart />}
</span>
                      {/* <span
                        onClick={(e) => handleWishlist(e, p._id)}
                        style={{
                          
                        }}
                      >
                        {isWishlisted(p._id) ? <FaHeart /> : <FaRegHeart />}
                      </span> */}
                    </div>
                    <h4>{p.name}</h4>
                    <p>₨ {p.new_price}</p>
                  </div>
                </Link>
              ))
            ) : (
              <p>No products in this subcategory</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CategoryPage;
