
import React, { useEffect, useState } from "react";
import { useParams,useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "./redux/cartSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./ProductDetailPage.css";

const sizeRanges = {
  S: {
    shirt: {
      Length: [33, 35],
      Waist: [27, 29],
      Hip: [35, 37],
      Shoulder: [15, 16],
      Chest: [35, 37],
      Armhole: [15, 17],
      "Sleeve Length": [21, 23],
      Wrist: [7, 9],
      "Bottom/Damman": [15, 17],
    },
    trouser: {
      Length: [40, 42],
      Waist: [27, 29],
      Hip: [35, 37],
      Knee: [16, 18],
      Thigh: [22, 24],
      Bottom: [15, 17],
    },
  },
  M: {
    shirt: {
      Length: [36, 38],
      Waist: [30, 32],
      Hip: [38, 40],
      Shoulder: [16, 17],
      Chest: [38, 40],
      Armhole: [16, 18],
      "Sleeve Length": [22, 24],
      Wrist: [7, 9],
      "Bottom/Damman": [16, 18],
    },
    trouser: {
      Length: [43, 45],
      Waist: [30, 32],
      Hip: [38, 40],
      Knee: [17, 19],
      Thigh: [23, 26],
      Bottom: [16, 18],
    },
  },
  L: {
    shirt: {
      Length: [39, 41],
      Waist: [33, 35],
      Hip: [41, 43],
      Shoulder: [17, 18],
      Chest: [41, 43],
      Armhole: [17, 19],
      "Sleeve Length": [23, 25],
      Wrist: [8, 10],
      "Bottom/Damman": [17, 19],
    },
    trouser: {
      Length: [46, 48],
      Waist: [33, 35],
      Hip: [41, 43],
      Knee: [18, 20],
      Thigh: [25, 28],
      Bottom: [17, 19],
    },
  },
  XL: {
    shirt: {
      Length: [42, 44],
      Waist: [36, 38],
      Hip: [44, 46],
      Shoulder: [18, 19],
      Chest: [44, 46],
      Armhole: [18, 20],
      "Sleeve Length": [24, 26],
      Wrist: [8, 10],
      "Bottom/Damman": [18, 20],
    },
    trouser: {
      Length: [49, 51],
      Waist: [36, 38],
      Hip: [44, 46],
      Knee: [19, 21],
      Thigh: [27, 30],
      Bottom: [18, 20],
    },
  },
};


const shirtFields = [
  "Length",
  "Shoulder",
  "Armhole",
  "Chest",
  "Waist",
  "Hip",
  "Sleeve Length",
  "Wrist",
  "Bottom/Damman",
].map((f) => "S." + f);

const trouserFields = ["Length", "Waist", "Knee", "Thigh", "Hip", "Bottom"].map(
  (f) => "T." + f
);

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.userInfo);
  // const [selectedStock, setSelectedStock] = useState(null);

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [measurements, setMeasurements] = useState({});
  const [errors, setErrors] = useState({});
  const [showCustom, setShowCustom] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [showHowTo, setShowHowTo] = useState(true);
  const [howImage, setHowImage] = useState("/assets/how1.webp");
  const [error, setError] = useState("");
  const howImages = ["/assets/how1.webp", "/assets/how2.webp"];
const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
  setCurrentIndex((prev) => (prev === 0 ? howImages.length - 1 : prev - 1));
};

const handleNext = () => {
  setCurrentIndex((prev) => (prev === howImages.length - 1 ? 0 : prev + 1));
};

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/api/products/${id}`);
        setProduct(res.data);
        if (res.data.images && res.data.images.length > 0)
          setSelectedImage(res.data.images[0]);
      } catch (err) {
        console.error("Error fetching product:", err.message);
        setError("Failed to fetch product data. Please try again.");
      }
    };
    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (user && user.measurements) {
     
      const prefixedMeasurements = {};
      Object.entries(user.measurements).forEach(([key, val]) => {
        if (shirtFields.includes("S." + key)) {
          prefixedMeasurements["S." + key] = val;
        } else if (trouserFields.includes("T." + key)) {
          prefixedMeasurements["T." + key] = val;
        } else {
          prefixedMeasurements[key] = val;
        }
      });
      setMeasurements(prefixedMeasurements);
    }
  }, [user]);

  const getRange = (field, category) => {
    if (!selectedSize || showCustom) return null;
    const sizeData = sizeRanges[selectedSize];
    if (!sizeData) return null;
 
    const pureField = field.slice(2);
    return sizeData[category]?.[pureField] || null;
  };

  const twoDigitRegex = /^\d{0,2}$/;

  const handleMeasurementChange = (field, value, min, max) => {
    if (!twoDigitRegex.test(value)) {
      toast.error("Only up to 2 digits allowed");
      return;
    }

    setMeasurements((prev) => ({ ...prev, [field]: value }));

    setErrors((prev) => {
      const newErrors = { ...prev };
      if (!value || value === "") {
        newErrors[field] = "This field is required";
      } else if (
        !showCustom &&
        min !== undefined &&
        max !== undefined &&
        (Number(value) < min || Number(value) > max)
      ) {
        newErrors[field] = `Value should be between ${min} and ${max}`;
      } else {
        delete newErrors[field];
      }
      return newErrors;
    });
  };

  
  const handleBlur = () => {
    const allFields = [...shirtFields, ...trouserFields];
    const newErrors = {};
    allFields.forEach((f) => {
      if (!measurements[f] || measurements[f] === "") {
        newErrors[f] = "This field is required";
      }
    });
    setErrors((prev) => ({ ...prev, ...newErrors }));
  };

  const renderTableInputs = (fields, category) =>
    fields.map((field) => {
      const range = getRange(field, category);
      const placeholder = range ? `${range[0]} - ${range[1]}` : "";
      return (
        <div className="measurement-group" key={field}>
          <label>{field.slice(2)}</label>
          <input
            type="number"
            name={field}
            placeholder={placeholder}
            value={measurements[field] || ""}
            onChange={(e) =>
              handleMeasurementChange(field, e.target.value, range?.[0], range?.[1])
            }
            onBlur={handleBlur}
            className={errors[field] ? "error" : ""}
            maxLength={2}
            min={0}
            max={99}
            onKeyDown={(e) => {
              if (
                e.target.value.length >= 2 &&
                e.key !== "Backspace" &&
                e.key !== "Delete" &&
                !["ArrowLeft", "ArrowRight", "Tab"].includes(e.key)
              ) {
                e.preventDefault();
                toast.error("Only up to 2 digits allowed");
              }
            }}
          />
          {errors[field] && (
            <div
              className="error-message"
              style={{ color: "red", fontSize: "12px", marginTop: "4px" }}
            >
              {errors[field]}
            </div>
          )}
        </div>
      );
    });

  // const handleAddToCart = () => {
  //   const allRequired = [...shirtFields, ...trouserFields];
  //      if (!selectedSize && !showCustom) {
  //     toast.error("⚠️ Please select a size before adding to cart.");
  //     return;
  //   }

  //   // 🔎 Stock check
  //   if (!showCustom) {
  //     if (product.stock[selectedSize] === 0) {
  //       toast.error(" Sorry, this size is out of stock.");
  //       return;
  //     }
  //   } else {
  //     if (product.customStock === 0) {
  //       toast.error(" Sorry, this custom size is out of stock.");
  //       return;
  //     }
  //   }
  //   if (Object.keys(errors).length > 0) {
  //     toast.error("Please fix errors before adding to cart");
  //     return;
  //   }

  //   const newErrors = {};
  //   let hasEmpty = false;
  //   for (let f of allRequired) {
  //     if (!measurements[f] || measurements[f] === "") {
  //       newErrors[f] = "This field is required";
  //       hasEmpty = true;
  //     }
  //   }
  //   if (hasEmpty) {
  //     setErrors(newErrors);
  //     toast.error("Please fill all measurement fields");
  //     return;
  //   }

  //   if (quantity < 1 || quantity > 5) {
  //     toast.error("Quantity must be between 1 and 5");
  //     return;
  //   }

  //   dispatch(
  //     addToCart({
  //       // id: Date.now(),
  //        id: product._id,
  //           productId: product._id, 
  //       name: product.name,
  //       price: product.new_price,
  //       image: selectedImage,
  //       size: selectedSize,
  //       measurements,
  //       quantity,
  //        stock: product.stock
  //     })
  //   );

  //    toast.success("Item added to cart!");
  //   setTimeout(() => {
  //     navigate("/cart"); 
  //   }, 1000);
  // };
const handleAddToCart = async () => {
  const allRequired = [...shirtFields, ...trouserFields];

  if (!selectedSize && !showCustom) {
    toast.error("⚠️ Please select a size before adding to cart.");
    return;
  }

  const availableStock = showCustom ? product.customStock : product.stock[selectedSize] || 0;

  if (availableStock === 0) {
    toast.error("Sorry, this size is out of stock.");
    return;
  }

  if (quantity > availableStock) {
    toast.error(`Only ${availableStock} piece${availableStock > 1 ? "s" : ""} available`);
    return;
  }

  if (Object.keys(errors).length > 0) {
    toast.error("Please fix errors before adding to cart");
    return;
  }

  const newErrors = {};
  let hasEmpty = false;
  for (let f of allRequired) {
    if (!measurements[f] || measurements[f] === "") {
      newErrors[f] = "This field is required";
      hasEmpty = true;
    }
  }
  if (hasEmpty) {
    setErrors(newErrors);
    toast.error("Please fill all measurement fields");
    return;
  }

  try {
    // Backend stock update
    await axios.post(`http://localhost:4000/api/products/${product._id}/update-stock`, {
      quantity,
      size: selectedSize,
      custom: showCustom,
    });

    // Add to cart in Redux
    dispatch(
      addToCart({
        id: product._id,
        productId: product._id,
        name: product.name,
        price: product.new_price,
        image: selectedImage,
        size: selectedSize,
        measurements,
        quantity,
        stock: availableStock,
      })
    );
      

    toast.success("Item added to cart!");
    setTimeout(() => navigate("/cart"), 1000);

  } catch (err) {
    toast.error(err.response?.data?.message || "Error updating stock");
  }
};

    

  const handleQuantityChange = (e) => {
  let val = Number(e.target.value);
  const availableStock = showCustom ? product.customStock : product.stock[selectedSize] || 0;

  if (val < 1) val = 1;
  if (val > availableStock) {
    toast.error(`Only ${availableStock} piece${availableStock > 1 ? "s" : ""} available`);
    val = availableStock;
  }

  setQuantity(val);
};

  if (error) return <p>{error}</p>;
  if (!product) return <p>Loading...</p>;

  return (
    <div className="product-detail-page">
      <ToastContainer position="top-right" autoClose={3000} />
      <button onClick={() => window.history.back()} className="back-button">
        ← Back
      </button>

      <div className="main-layout">
        <div className="thumbnails-section">
          <div className="thumbnail-column">
            {product.images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={product.name}
                className={img === selectedImage ? "active" : ""}
                onClick={() => setSelectedImage(img)}
              />
            ))}
          </div>
        </div>

        <div className="image-section">
          <div className="main-image-container">
            <img className="main-image" src={selectedImage} alt={product.name} />
          </div>
        </div>

        <div className="info-section">
          <div className="product-info-container">
            <div className="product-header">
              <h2>{product.name}</h2>
              <p className="price">
                {product.old_price && (
                  <span className="old-price">Rs {product.old_price}</span>
                )}
                <span className="new-price">Rs {product.new_price}</span>
              </p>
            </div>
                          {/* {selectedSize && !showCustom && (
  <p className="stock-info">
    {selectedStock > 0 ? " In Stock" : " Out of Stock"}
  </p>
)}

{showCustom && (
  <p className="stock-info">
    {product.customStock > 0 ? "In Stock" : " Out of Stock"}
  </p>
)} */}
{selectedSize && !showCustom && (
  <p className="stock-info">
    {product.stock[selectedSize] > 0
      ? `${product.stock[selectedSize]} item${product.stock[selectedSize] > 1 ? "s" : ""} available`
      : "Out of Stock"}
  </p>
)}

{showCustom && (
  <p className="stock-info">
    {product.customStock > 0
      ? `${product.customStock} item${product.customStock > 1 ? "s" : ""} available`
      : "Out of Stock"}
  </p>
)}

            <div className="size-section">
              <h3>Select Size:</h3>
              <div className="size-buttons">
                {Object.keys(sizeRanges).map((size) => (
                  <button
                    key={size}
                    className={selectedSize === size ? "selected" : ""}
                    onClick={() => {
                      setSelectedSize(size);
                      setShowCustom(false);
                      setMeasurements(user?.measurements || {});
                      setErrors({});
                        setSelectedStock(product.stock?.[size] || 0);
                    }}
                  >
                    {size}
                  </button>
                ))}
                <button
                  className={showCustom ? "selected" : ""}
                  onClick={() => {
                    setShowCustom(true);
                    setSelectedSize("");
                    setMeasurements(user?.measurements || {});
                    setErrors({});
                  }}
                >
                  Custom
                </button>
              </div>
            </div>
          </div>

          {(selectedSize || showCustom) && (
            <div className="measurements-main-container">
              <div className="measure-table-container">
                <div className="measure-table">
                  <h3>{showCustom ? "Customize Your Measurements" : "Standard Measurements"}</h3>
                  <div className="shirt-section">
                    <h4 className="table-heading">Shirt Measurements</h4>
                    <div className="fields-grid">{renderTableInputs(shirtFields, "shirt")}</div>
                  </div>
                  <div className="trouser-section">
                    <h4 className="table-heading">Trouser Measurements</h4>
                    <div className="fields-grid">{renderTableInputs(trouserFields, "trouser")}</div>
                  </div>
                </div>
              </div>

              <div className="how-to-container">
                <div className="how-to-measure">
                  <h3 onClick={() => setShowHowTo(!showHowTo)}>
                    How to Measure {showHowTo ? "-" : "+"}
                  </h3>
                  {showHowTo && (
                    <div className="how-images">
                         <button className="how-arrow" onClick={handlePrev}>←</button>
    <img src={howImages[currentIndex]} alt="How to Measure" />
    <button className="how-arrow" onClick={handleNext}>→</button>
                      
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="cart-section">
            <label>Quantity:</label>
            <input
  type="number"
  min={1}
  max={showCustom ? product.customStock : product.stock[selectedSize] || 0}
  value={quantity}
  onChange={handleQuantityChange}
/>

            {/* <input
              type="number"
              min={1}
             
              value={quantity}
              onChange={handleQuantityChange}
            /> */}
            <button
  className="add-to-cart-btn"
  onClick={handleAddToCart}
  disabled={(selectedSize && product.stock[selectedSize] === 0) || (showCustom && product.customStock === 0)}
>
  Add to Cart
</button>

            {/* <button className="add-to-cart-btn" onClick={handleAddToCart}>
              Add to Cart
            </button> */}

          </div>
           {product.description && product.description.length > 0 && (
          <div className="product-description">
            <h3>Product Description</h3>
            {product.description.map((line, index) => (
              <p key={index}>{line}</p>
            ))}
          </div>
        )}
        </div>

       
      </div>
    </div>
  );
};

export default ProductDetailPage;