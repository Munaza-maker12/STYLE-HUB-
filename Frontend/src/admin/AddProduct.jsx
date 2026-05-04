// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import "./AddProduct.css";

// const AddProduct = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     name: "",
//     category: "",
//     subCategory: "",
//     new_price: "",
//     old_price: "",
//     description: "",
//     customStock: 10,
//     stock: { S: 0, M: 0, L: 0, XL: 0, XXL: 0 },
//   });
//   const [images, setImages] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [categories, setCategories] = useState([]);
//   const [subcategories, setSubcategories] = useState([]);
//   const [existingProducts, setExistingProducts] = useState([]);

//   useEffect(() => {
//     const token = localStorage.getItem("adminToken");

//     // Fetch categories
//     const fetchCats = async () => {
//       try {
//         const res = await axios.get("http://localhost:4000/api/admin/categories/main", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setCategories(res.data);
//       } catch (error) {
//         console.error("Failed to fetch categories", error);
//       }
//     };

//     // Fetch existing products for duplicate name check
//     const fetchProducts = async () => {
//       try {
//         const res = await axios.get("http://localhost:4000/api/admin/products/stock", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setExistingProducts(res.data);
//       } catch (error) {
//         console.error("Failed to fetch products", error);
//       }
//     };

//     fetchCats();
//     fetchProducts();
//   }, []);

//   const handleCategoryChange = (e) => {
//     const catId = e.target.value;
//     const selectedCat = categories.find((c) => c._id === catId);

//     setFormData((prev) => ({
//       ...prev,
//       category: selectedCat ? selectedCat.name.toLowerCase() : "",
//       subCategory: "",
//     }));
//     setSubcategories(selectedCat ? selectedCat.subcategories : []);
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     if (name === "subCategory") {
//       const selectedSub = subcategories.find((s) => s._id === value);
//       setFormData((prev) => ({
//         ...prev,
//         subCategory: selectedSub ? selectedSub.name.toLowerCase() : value,
//       }));
//     } else if (["S", "M", "L", "XL", "XXL"].includes(name)) {
//       setFormData((prev) => ({
//         ...prev,
//         stock: { ...prev.stock, [name]: Math.max(0, Number(value)) },
//       }));
//     } else {
//       setFormData((prev) => ({ ...prev, [name]: value }));
//     }
//   };

//   const handleImageChange = (e) => {
//     setImages((prev) => [...prev, ...Array.from(e.target.files)]);
//   };

//   const removeImage = (index) =>
//     setImages((prev) => prev.filter((_, i) => i !== index));

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (images.length === 0) return alert("Please select at least one image!");

//     // Duplicate product name check
//     const isDuplicate = existingProducts.some(
//       (p) => p.name.toLowerCase() === formData.name.trim().toLowerCase()
//     );
//     if (isDuplicate) return alert("A product with this name already exists!");

//     try {
//       setLoading(true);
//       const token = localStorage.getItem("adminToken");
//       const data = new FormData();
//       data.append("name", formData.name);
//       data.append("category", formData.category);
//       data.append("subCategory", formData.subCategory);
//       data.append("new_price", formData.new_price);
//       data.append("old_price", formData.old_price);
//       data.append("description", formData.description);
//       data.append("customStock", formData.customStock);
//       data.append("stock", JSON.stringify(formData.stock));
//       images.forEach((img) => data.append("images", img));

//       const response = await axios.post(
//         "http://localhost:4000/api/admin/products",
//         data,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "multipart/form-data",
//           },
//           timeout: 60000,
//         }
//       );

//       console.log("Server response:", response.data);
//       alert("Product added successfully!");
//       navigate("/admin/products");
//     } catch (error) {
//       if (error.code === "ECONNABORTED") {
//         console.warn("Request timed out but product may have been saved.");
//         alert("Request timed out. Please check products list — product may have been added.");
//         navigate("/admin/products");
//       } else {
//         console.error("Error adding product:", error.response?.data || error);
//         alert("Failed to add product: " + (error.response?.data?.message || error.message));
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="add-product-container">
//       <h2>Add New Product</h2>
//       <form onSubmit={handleSubmit} className="add-product-form">
//         <label>
//           Name:{" "}
//           <input
//             type="text"
//             name="name"
//             value={formData.name}
//             onChange={handleChange}
//             required
//           />
//         </label>

//         {/* Category */}
//         <label>
//           Category:
//           <select
//             name="category"
//             value={categories.find(c => c.name.toLowerCase() === formData.category)?._id || ""}
//             onChange={handleCategoryChange}
//             required
//           >
//             <option value="">Select Category</option>
//             {categories.map((cat) => (
//               <option key={cat._id} value={cat._id}>
//                 {cat.name}
//               </option>
//             ))}
//           </select>
//         </label>

//         {/* SubCategory */}
//         <label>
//           SubCategory:
//           <select
//             name="subCategory"
//             value={subcategories.find(s => s.name.toLowerCase() === formData.subCategory)?._id || ""}
//             onChange={handleChange}
//             required
//           >
//             <option value="">Select Subcategory</option>
//             {subcategories.map((sub) => (
//               <option key={sub._id} value={sub._id}>
//                 {sub.name}
//               </option>
//             ))}
//           </select>
//         </label>

//         <label>
//           New Price:{" "}
//           <input
//             type="number"
//             name="new_price"
//             value={formData.new_price}
//             onChange={handleChange}
//             required
//           />
//         </label>

//         <label>
//           Old Price:{" "}
//           <input
//             type="number"
//             name="old_price"
//             value={formData.old_price}
//             onChange={handleChange}
//           />
//         </label>

//         <label>
//           Description:{" "}
//           <textarea
//             name="description"
//             value={formData.description}
//             onChange={handleChange}
//             rows={5}
//           />
//         </label>

//         <label>
//           Images:{" "}
//           <input type="file" multiple accept="image/*" onChange={handleImageChange} />
//         </label>

//         {images.length > 0 && (
//           <div className="image-preview">
//             {images.map((img, i) => (
//               <div key={i} className="preview-item">
//                 <img src={URL.createObjectURL(img)} alt={`img-${i}`} />
//                 <span className="remove-btn" onClick={() => removeImage(i)}>
//                   ×
//                 </span>
//               </div>
//             ))}
//           </div>
//         )}

//         <fieldset>
//           <legend>Stock</legend>
//           {["S", "M", "L", "XL", "XXL"].map((size) => (
//             <label key={size}>
//               {size}:{" "}
//               <input
//                 type="number"
//                 name={size}
//                 value={formData.stock[size]}
//                 min="0"
//                 onChange={handleChange}
//               />
//             </label>
//           ))}
//         </fieldset>

//         <label>
//           Custom Stock:{" "}
//           <input
//             type="number"
//             name="customStock"
//             value={formData.customStock}
//             min="0"
//             onChange={handleChange}
//           />
//         </label>

//         <button type="submit" disabled={loading}>
//           {loading ? "Adding..." : "Add Product"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default AddProduct;   
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AddProduct.css";

const ALL_SIZES = ["S", "M", "L", "XL"];

const AddProduct = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    subCategory: "",
    new_price: "",
    old_price: "",
    description: "",
    customStock: 10,
  });

  // Track which sizes are ENABLED (checked)
  const [enabledSizes, setEnabledSizes] = useState([]);
  // Track stock quantity for each size
  const [sizeStock, setSizeStock] = useState({ S: 0, M: 0, L: 0, XL: 0, XXL: 0 });

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [existingProducts, setExistingProducts] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");

    const fetchCats = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/admin/categories/main", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCategories(res.data);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };

    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/admin/products/stock", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setExistingProducts(res.data);
      } catch (error) {
        console.error("Failed to fetch products", error);
      }
    };

    fetchCats();
    fetchProducts();
  }, []);

  const handleCategoryChange = (e) => {
    const catId = e.target.value;
    const selectedCat = categories.find((c) => c._id === catId);
    setFormData((prev) => ({
      ...prev,
      category: selectedCat ? selectedCat.name.toLowerCase() : "",
      subCategory: "",
    }));
    setSubcategories(selectedCat ? selectedCat.subcategories : []);
  };

  const handleChange = (e) => {
  const { name, value } = e.target;
  if (name === "subCategory") {
    const selectedSub = subcategories.find((s) => s._id === value);
    setFormData((prev) => ({
      ...prev,
      subCategory: selectedSub ? selectedSub.name.toLowerCase() : value,
    }));
  } else if (name === "new_price" || name === "old_price") {
    // Negative value allowed nahi
    const parsed = parseFloat(value);
    setFormData((prev) => ({
      ...prev,
      [name]: isNaN(parsed) ? "" : Math.max(0, parsed),
    }));
  } else {
    setFormData((prev) => ({ ...prev, [name]: value }));
  }
};
  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   if (name === "subCategory") {
  //     const selectedSub = subcategories.find((s) => s._id === value);
  //     setFormData((prev) => ({
  //       ...prev,
  //       subCategory: selectedSub ? selectedSub.name.toLowerCase() : value,
  //     }));
  //   } else {
  //     setFormData((prev) => ({ ...prev, [name]: value }));
  //   }
  // };

  // Toggle a size checkbox
  const handleSizeToggle = (size) => {
    setEnabledSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  // Update stock quantity for a specific size
  const handleSizeStockChange = (size, value) => {
    setSizeStock((prev) => ({
      ...prev,
      [size]: Math.max(0, Number(value)),
    }));
  };

  const handleImageChange = (e) => {
    setImages((prev) => [...prev, ...Array.from(e.target.files)]);
  };

  const removeImage = (index) =>
    setImages((prev) => prev.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (images.length === 0) return alert("Please select at least one image!");
    if (enabledSizes.length === 0) return alert("Please select at least one size!");

    const isDuplicate = existingProducts.some(
      (p) => p.name.toLowerCase() === formData.name.trim().toLowerCase()
    );
    if (isDuplicate) return alert("A product with this name already exists!");
   // Price validation

const newP = parseFloat(formData.new_price);
  const oldP = parseFloat(formData.old_price);
  if (formData.old_price !== "" && oldP <= newP) {
    return alert("Old Price must be greater than New Price!\n\nOld Price = original (crossed-out) price\nNew Price = discounted selling price");
  }


if (formData.old_price !== "" && oldP <= newP) {
  return alert("Old Price must be greater than New Price! (Old price is the original/crossed-out price)");
}
    // Build stock object with ONLY enabled sizes
    const stockToSave = {};
    enabledSizes.forEach((size) => {
      stockToSave[size] = sizeStock[size];
    });

    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");
      const data = new FormData();
      data.append("name", formData.name);
      data.append("category", formData.category);
      data.append("subCategory", formData.subCategory);
      data.append("new_price", formData.new_price);
      data.append("old_price", formData.old_price);
      data.append("description", formData.description);
      data.append("customStock", formData.customStock);
      data.append("stock", JSON.stringify(stockToSave)); // Only enabled sizes
      images.forEach((img) => data.append("images", img));

      const response = await axios.post(
        "http://localhost:4000/api/admin/products",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
          timeout: 60000,
        }
      );

      console.log("Server response:", response.data);
      alert("Product added successfully!");
      navigate("/admin/products");
    } catch (error) {
      if (error.code === "ECONNABORTED") {
        console.warn("Request timed out but product may have been saved.");
        alert("Request timed out. Please check products list — product may have been added.");
        navigate("/admin/products");
      } else {
        console.error("Error adding product:", error.response?.data || error);
        alert("Failed to add product: " + (error.response?.data?.message || error.message));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-product-container">
      <h2>Add New Product</h2>
      <form onSubmit={handleSubmit} className="add-product-form">
        <label>
          Name:{" "}
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Category:
          <select
            name="category"
            value={categories.find((c) => c.name.toLowerCase() === formData.category)?._id || ""}
            onChange={handleCategoryChange}
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          SubCategory:
          <select
            name="subCategory"
            value={subcategories.find((s) => s.name.toLowerCase() === formData.subCategory)?._id || ""}
            onChange={handleChange}
            required
          >
            <option value="">Select Subcategory</option>
            {subcategories.map((sub) => (
              <option key={sub._id} value={sub._id}>
                {sub.name}
              </option>
            ))}
          </select>
        </label>

        <label>
  New Price:{" "}
  <input
    type="number"
    name="new_price"
    value={formData.new_price}
    onChange={handleChange}
    min="0"       
    required
  />
</label>

       <label>
  Old Price:{" "}
  <input
    type="number"
    name="old_price"
    value={formData.old_price}
    onChange={handleChange}
    min="0"       
  />
</label>

        <label>
          Description:{" "}
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={5}
          />
        </label>

        <label>
          Images:{" "}
          <input type="file" multiple accept="image/*" onChange={handleImageChange} />
        </label>

        {images.length > 0 && (
          <div className="image-preview">
            {images.map((img, i) => (
              <div key={i} className="preview-item">
                <img src={URL.createObjectURL(img)} alt={`img-${i}`} />
                <span className="remove-btn" onClick={() => removeImage(i)}>×</span>
              </div>
            ))}
          </div>
        )}

        {/* ✅ SIZE SELECTION WITH CHECKBOXES */}
        <fieldset className="size-fieldset">
          <legend>Available Sizes & Stock</legend>
          <p className="size-hint">Select the sizes available for this product</p>
          <div className="size-grid">
            {ALL_SIZES.map((size) => {
              const isEnabled = enabledSizes.includes(size);
              return (
                <div key={size} className={`size-card ${isEnabled ? "size-card--enabled" : ""}`}>
                  <label className="size-checkbox-label">
                    <input
                      type="checkbox"
                      checked={isEnabled}
                      onChange={() => handleSizeToggle(size)}
                    />
                    <span className="size-name">{size}</span>
                  </label>
                  {isEnabled && (
                    <input
                      type="number"
                      className="size-qty-input"
                      value={sizeStock[size]}
                      min="0"
                      onChange={(e) => handleSizeStockChange(size, e.target.value)}
                      placeholder="Qty"
                    />
                  )}
                </div>
              );
            })}
          </div>
          {enabledSizes.length === 0 && (
            <p className="size-warning">⚠️ Please select at least one size</p>
          )}
        </fieldset>

        <label>
          Custom Stock:{" "}
          <input
            type="number"
            name="customStock"
            value={formData.customStock}
            min="0"
            onChange={handleChange}
          />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Product"}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;