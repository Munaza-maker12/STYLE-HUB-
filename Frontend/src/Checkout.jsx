// import React, { useState, useEffect } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { clearCart } from "./redux/cartSlice";
// import "./Checkout.css";

// const Toast = ({ message, type, onClose }) => {
//   useEffect(() => {
//     const timer = setTimeout(() => { onClose(); }, 3000);
//     return () => clearTimeout(timer);
//   }, [onClose]);

//   return (
//     <div className={`toast toast-${type}`}>
//       <div className="toast-content">
//         <span className="toast-icon">{type === "success" ? "✅" : "❌"}</span>
//         <span className="toast-message">{message}</span>
//       </div>
//     </div>
//   );
// };

// const CheckoutPage = () => {
//   const cartItems = useSelector((state) => state.cart.items);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     name: "", email: "", address: "", city: "",
//     postalCode: "", phone: "", note: "",
//     country: "Pakistan", paymentMethod: "Cash on Delivery"
//   });

//   const [errors, setErrors] = useState({});
//   const [toast, setToast] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const maxLengths = {
//     name: 15, email: 50, phone: 11,
//     postalCode: 5, city: 15, address: 100, note: 200
//   };

//   const patterns = {
//     name:       /^[a-zA-Z\s]{2,15}$/,
//     email:      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
//     phone:      /^03[0-9]{9}$/,
//     postalCode: /^[0-9]{5}$/,
//     city:       /^[a-zA-Z\s]{2,15}$/,
//     address:    /^.{5,100}$/,
//   };

//   const showToast = (message, type = "error") => setToast({ message, type });

//   const validateField = (name, value) => {
//     const required = ["name", "email", "address", "city", "phone"];
//     if (!value.trim() && required.includes(name))
//       return `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
//     switch (name) {
//       case "name":
//         if (!patterns.name.test(value)) return "Only letters, 2-15 characters";
//         break;
//       case "email":
//         if (value && !patterns.email.test(value)) return "Enter a valid email";
//         break;
//       case "phone":
//         if (!patterns.phone.test(value))
//           return "03 se shuru karein, 11 digits (e.g. 03001234567)";
//         break;
//       case "postalCode":
//         if (value && !patterns.postalCode.test(value)) return "5 digits required";
//         break;
//       case "city":
//         if (!patterns.city.test(value)) return "Only letters, 2-15 characters";
//         break;
//       case "address":
//         if (!patterns.address.test(value)) return "5-100 characters required";
//         break;
//       default: return "";
//     }
//     return "";
//   };

//   const validateForm = () => {
//     const newErrors = {};
//     ["name", "email", "address", "city", "phone"].forEach(f => {
//       const err = validateField(f, formData[f]);
//       if (err) newErrors[f] = err;
//     });
//     if (formData.postalCode) {
//       const err = validateField("postalCode", formData.postalCode);
//       if (err) newErrors.postalCode = err;
//     }
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   useEffect(() => {
//     const raw = localStorage.getItem("user");
//     if (raw && raw !== "undefined") {
//       const u = JSON.parse(raw);
//       if (u) setFormData(prev => ({
//         ...prev,
//         name: u.name || "", email: u.email || "",
//         address: u.address || "", city: u.city || "",
//         postalCode: u.postalCode || "", phone: u.phone || ""
//       }));
//     }
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     if (maxLengths[name] !== undefined && value.length > maxLengths[name]) return;
//     setFormData(prev => ({ ...prev, [name]: value }));
//     if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
//   };

//   const handleBlur = (e) => {
//     const { name, value } = e.target;
//     setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
//   };

//   const totalAmount = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);
//   const raw = localStorage.getItem("user");
//   const user = raw && raw !== "undefined" ? JSON.parse(raw) : null;
//   const userId = user?._id;

//   const handlePlaceOrder = async () => {
//     if (loading) return;
//     if (!validateForm()) { showToast("Please fix the errors", "error"); return; }
//     if (cartItems.length === 0) { showToast("Cart is empty!", "error"); return; }
//     try {
//       setLoading(true);
//       const token = localStorage.getItem("accessToken");
//       const order = {
//         userId,
//         items: cartItems.map(item => ({
//           productId: item.productId || item._id || item.id,
//           name: item.name, price: item.price, image: item.image,
//           quantity: item.quantity, size: item.size, measurements: item.measurements
//         })),
//         shipping: formData, totalAmount,
//         paymentMethod: formData.paymentMethod, country: formData.country
//       };
//       const res = await axios.post("http://localhost:4000/api/orders", order, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       showToast("Order placed successfully!", "success");
//       window.dispatchEvent(new Event("new-notification"));
//       setTimeout(() => { dispatch(clearCart()); navigate("/receipt", { state: { order: res.data } }); }, 1500);
//     } catch (err) {
//       showToast(err.response?.data?.message || "Failed to place order.", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="checkout-container">
//       {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

//       <div className="checkout-form">
//         <h2>Shipping Details</h2>

//         <div className="form-group">
//           <label className="field-label">Full Name *</label>
//           <input type="text" name="name" placeholder="e.g. Sara Ahmed"
//             value={formData.name} onChange={handleChange} onBlur={handleBlur}
//             className={errors.name ? "error" : ""} maxLength={maxLengths.name} />
//           <div className="char-counter">{formData.name.length}/{maxLengths.name}</div>
//           {errors.name && <span className="error-message">{errors.name}</span>}
//         </div>

//         <div className="form-group">
//           <label className="field-label">Email Address *</label>
//           <input type="email" name="email" placeholder="e.g. sara@gmail.com"
//             value={formData.email} onChange={handleChange} onBlur={handleBlur}
//             className={errors.email ? "error" : ""} maxLength={maxLengths.email} />
//           <div className="char-counter">{formData.email.length}/{maxLengths.email}</div>
//           {errors.email && <span className="error-message">{errors.email}</span>}
//         </div>

//         <div className="form-group">
//           <label className="field-label">Street Address *</label>
//           <input type="text" name="address" placeholder="House #, Street, Area"
//             value={formData.address} onChange={handleChange} onBlur={handleBlur}
//             className={errors.address ? "error" : ""} maxLength={maxLengths.address} />
//           <div className="char-counter">{formData.address.length}/{maxLengths.address}</div>
//           {errors.address && <span className="error-message">{errors.address}</span>}
//         </div>

//         <div className="row">
//           <div className="form-group">
//             <label className="field-label">City *</label>
//             <input type="text" name="city" placeholder="e.g. Lahore"
//               value={formData.city} onChange={handleChange} onBlur={handleBlur}
//               className={errors.city ? "error" : ""} maxLength={maxLengths.city} />
//             <div className="char-counter">{formData.city.length}/{maxLengths.city}</div>
//             {errors.city && <span className="error-message">{errors.city}</span>}
//           </div>
//           <div className="form-group">
//             <label className="field-label">Country</label>
//             <input type="text" name="country" value={formData.country} readOnly />
//           </div>
//         </div>

//         <div className="row">
//           <div className="form-group">
//             <label className="field-label">Postal Code</label>
//             <input type="text" name="postalCode" placeholder="e.g. 54000"
//               value={formData.postalCode} onChange={handleChange} onBlur={handleBlur}
//               className={errors.postalCode ? "error" : ""} maxLength={maxLengths.postalCode} />
//             <div className="char-counter">{formData.postalCode.length}/{maxLengths.postalCode}</div>
//             {errors.postalCode && <span className="error-message">{errors.postalCode}</span>}
//           </div>

//           <div className="form-group">
//             <label className="field-label">Phone Number *</label>
//             <div className="phone-input-wrap">
//               <span className="phone-prefix">03</span>
//               <input
//                 type="tel"
//                 name="phone"
//                 placeholder="XXXXXXXXX"
//                 value={formData.phone.startsWith("03") ? formData.phone.slice(2) : formData.phone}
//                 onChange={(e) => {
//                   const digits = e.target.value.replace(/\D/g, ""); // sirf digits
//                   if (digits.length > 9) return; // 03 + 9 = 11 total
//                   const full = "03" + digits;
//                   setFormData(prev => ({ ...prev, phone: full }));
//                   if (errors.phone) setErrors(prev => ({ ...prev, phone: "" }));
//                 }}
//                 onBlur={() => {
//                   setErrors(prev => ({ ...prev, phone: validateField("phone", formData.phone) }));
//                 }}
//                 className={errors.phone ? "error phone-field" : "phone-field"}
//                 maxLength={9}
//               />
//             </div>
//             <div className="char-counter">{Math.max(0, formData.phone.length - 2)}/9</div>
//             {errors.phone && <span className="error-message">{errors.phone}</span>}
//           </div>
//         </div>

//         <div className="form-group">
//           <label className="field-label">Order Note (Optional)</label>
//           <textarea name="note" placeholder="Any special instructions for delivery..."
//             value={formData.note} onChange={handleChange}
//             maxLength={maxLengths.note} rows={3} />
//           <div className="char-counter">{formData.note.length}/{maxLengths.note}</div>
//         </div>

//         <div className="payment-section">
//           <h3 className="payment-heading">Payment Method</h3>
//           <div className="payment-circle">💵 {formData.paymentMethod}</div>
//         </div>

//         <button className="place-order-btn" onClick={handlePlaceOrder} disabled={loading}>
//           {loading ? <span className="spinner"></span> : "🛒 Place Order"}
//         </button>
//       </div>

//       <div className="checkout-summary">
//         <h2>Order Summary</h2>
//         {cartItems.map((item, index) => (
//           <div key={index} className="summary-item">
//             <img src={item.image} alt={item.name} />
//             <div>
//               <p>{item.name}</p>
//               <p>PKR {item.price} x {item.quantity}</p>
//               <p>Size: {item.size}</p>
//               {item.measurements && (
//                 <div className="measurement-section">
//                   <div>
//                     <h5>Shirt</h5>
//                     <div className="measurements-boxes">
//                       {["Length","Shoulder","Armhole","Chest","Waist","Hip","Sleeve Length","Wrist","Bottom/Damman"]
//                         .filter(f => item.measurements[f] || item.measurements[`S.${f}`])
//                         .map(f => (
//                           <div key={f} className="measure-box">
//                             {f}: {item.measurements[f] || item.measurements[`S.${f}`]}
//                           </div>
//                         ))}
//                     </div>
//                   </div>
//                   <div>
//                     <h5>Trouser</h5>
//                     <div className="measurements-boxes">
//                       {["Length","Waist","Knee","Thigh","Hip","Bottom"]
//                         .filter(f => item.measurements[f] || item.measurements[`T.${f}`])
//                         .map(f => (
//                           <div key={f} className="measure-box">
//                             {f}: {item.measurements[f] || item.measurements[`T.${f}`]}
//                           </div>
//                         ))}
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//             <p>Rs {item.price * item.quantity}</p>
//           </div>
//         ))}
//         <hr />
//         <h3>Total: Rs {totalAmount}</h3>
//       </div>
//     </div>
//   );
// };

// export default CheckoutPage;    

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom"; // ✅ useLocation add kiya
import axios from "axios";
import { clearCart } from "./redux/cartSlice";
import "./Checkout.css";

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => { onClose(); }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`toast toast-${type}`}>
      <div className="toast-content">
        <span className="toast-icon">{type === "success" ? "✅" : "❌"}</span>
        <span className="toast-message">{message}</span>
      </div>
    </div>
  );
};

const CheckoutPage = () => {
  const allCartItems = useSelector((state) => state.cart.items);
  const location = useLocation(); // ✅ location hook
  
  // ✅ FIX: CartPage se selected items aaye to woh use karo, warna saare cart items
  const cartItems = location.state?.items && location.state.items.length > 0
    ? location.state.items
    : allCartItems;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "", email: "", address: "", city: "",
    postalCode: "", phone: "", note: "",
    country: "Pakistan", paymentMethod: "Cash on Delivery"
  });

  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);

  const maxLengths = {
    name: 15, email: 50, phone: 11,
    postalCode: 5, city: 15, address: 100, note: 200
  };

  const patterns = {
    name:       /^[a-zA-Z\s]{2,15}$/,
    email:      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phone:      /^03[0-9]{9}$/,
    postalCode: /^[0-9]{5}$/,
    city:       /^[a-zA-Z\s]{2,15}$/,
    address:    /^.{5,100}$/,
  };

  const showToast = (message, type = "error") => setToast({ message, type });

  const validateField = (name, value) => {
    const required = ["name", "email", "address", "city", "phone"];
    if (!value.trim() && required.includes(name))
      return `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
    switch (name) {
      case "name":
        if (!patterns.name.test(value)) return "Only letters, 2-15 characters";
        break;
      case "email":
        if (value && !patterns.email.test(value)) return "Enter a valid email";
        break;
      case "phone":
        if (!patterns.phone.test(value))
          return "03 se shuru karein, 11 digits (e.g. 03001234567)";
        break;
      case "postalCode":
        if (value && !patterns.postalCode.test(value)) return "5 digits required";
        break;
      case "city":
        if (!patterns.city.test(value)) return "Only letters, 2-15 characters";
        break;
      case "address":
        if (!patterns.address.test(value)) return "5-100 characters required";
        break;
      default: return "";
    }
    return "";
  };

  const validateForm = () => {
    const newErrors = {};
    ["name", "email", "address", "city", "phone"].forEach(f => {
      const err = validateField(f, formData[f]);
      if (err) newErrors[f] = err;
    });
    if (formData.postalCode) {
      const err = validateField("postalCode", formData.postalCode);
      if (err) newErrors.postalCode = err;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    const raw = localStorage.getItem("user");
    if (raw && raw !== "undefined") {
      const u = JSON.parse(raw);
      if (u) setFormData(prev => ({
        ...prev,
        name: u.name || "", email: u.email || "",
        address: u.address || "", city: u.city || "",
        postalCode: u.postalCode || "", phone: u.phone || ""
      }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (maxLengths[name] !== undefined && value.length > maxLengths[name]) return;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
  };

  // ✅ FIX: totalAmount ab sirf cartItems (selected) ka calculate hoga
  const totalAmount = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);

  const raw = localStorage.getItem("user");
  const user = raw && raw !== "undefined" ? JSON.parse(raw) : null;
  const userId = user?._id;

  const handlePlaceOrder = async () => {
    if (loading) return;
    if (!validateForm()) { showToast("Please fix the errors", "error"); return; }
    if (cartItems.length === 0) { showToast("Cart is empty!", "error"); return; }
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      const order = {
        userId,
        items: cartItems.map(item => ({
          productId: item.productId || item._id || item.id,
          name: item.name, price: item.price, image: item.image,
          quantity: item.quantity, size: item.size, measurements: item.measurements
        })),
        shipping: formData, totalAmount,
        paymentMethod: formData.paymentMethod, country: formData.country
      };
      const res = await axios.post("http://localhost:4000/api/orders", order, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showToast("Order placed successfully!", "success");
      window.dispatchEvent(new Event("new-notification"));
      setTimeout(() => { dispatch(clearCart()); navigate("/receipt", { state: { order: res.data } }); }, 1500);
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to place order.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-container">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="checkout-form">
        <h2>Shipping Details</h2>

        <div className="form-group">
          <label className="field-label">Full Name *</label>
          <input type="text" name="name" placeholder="e.g. Sara Ahmed"
            value={formData.name} onChange={handleChange} onBlur={handleBlur}
            className={errors.name ? "error" : ""} maxLength={maxLengths.name} />
          <div className="char-counter">{formData.name.length}/{maxLengths.name}</div>
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label className="field-label">Email Address *</label>
          <input type="email" name="email" placeholder="e.g. sara@gmail.com"
            value={formData.email} onChange={handleChange} onBlur={handleBlur}
            className={errors.email ? "error" : ""} maxLength={maxLengths.email} />
          <div className="char-counter">{formData.email.length}/{maxLengths.email}</div>
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label className="field-label">Street Address *</label>
          <input type="text" name="address" placeholder="House #, Street, Area"
            value={formData.address} onChange={handleChange} onBlur={handleBlur}
            className={errors.address ? "error" : ""} maxLength={maxLengths.address} />
          <div className="char-counter">{formData.address.length}/{maxLengths.address}</div>
          {errors.address && <span className="error-message">{errors.address}</span>}
        </div>

        <div className="row">
          <div className="form-group">
            <label className="field-label">City *</label>
            <input type="text" name="city" placeholder="e.g. Lahore"
              value={formData.city} onChange={handleChange} onBlur={handleBlur}
              className={errors.city ? "error" : ""} maxLength={maxLengths.city} />
            <div className="char-counter">{formData.city.length}/{maxLengths.city}</div>
            {errors.city && <span className="error-message">{errors.city}</span>}
          </div>
          <div className="form-group">
            <label className="field-label">Country</label>
            <input type="text" name="country" value={formData.country} readOnly />
          </div>
        </div>

        <div className="row">
          <div className="form-group">
            <label className="field-label">Postal Code</label>
            <input type="text" name="postalCode" placeholder="e.g. 54000"
              value={formData.postalCode} onChange={handleChange} onBlur={handleBlur}
              className={errors.postalCode ? "error" : ""} maxLength={maxLengths.postalCode} />
            <div className="char-counter">{formData.postalCode.length}/{maxLengths.postalCode}</div>
            {errors.postalCode && <span className="error-message">{errors.postalCode}</span>}
          </div>

          <div className="form-group">
            <label className="field-label">Phone Number *</label>
            <div className="phone-input-wrap">
              <span className="phone-prefix">03</span>
              <input
                type="tel"
                name="phone"
                placeholder="XXXXXXXXX"
                value={formData.phone.startsWith("03") ? formData.phone.slice(2) : formData.phone}
                onChange={(e) => {
                  const digits = e.target.value.replace(/\D/g, "");
                  if (digits.length > 9) return;
                  const full = "03" + digits;
                  setFormData(prev => ({ ...prev, phone: full }));
                  if (errors.phone) setErrors(prev => ({ ...prev, phone: "" }));
                }}
                onBlur={() => {
                  setErrors(prev => ({ ...prev, phone: validateField("phone", formData.phone) }));
                }}
                className={errors.phone ? "error phone-field" : "phone-field"}
                maxLength={9}
              />
            </div>
            <div className="char-counter">{Math.max(0, formData.phone.length - 2)}/9</div>
            {errors.phone && <span className="error-message">{errors.phone}</span>}
          </div>
        </div>

        <div className="form-group">
          <label className="field-label">Order Note (Optional)</label>
          <textarea name="note" placeholder="Any special instructions for delivery..."
            value={formData.note} onChange={handleChange}
            maxLength={maxLengths.note} rows={3} />
          <div className="char-counter">{formData.note.length}/{maxLengths.note}</div>
        </div>

        <div className="payment-section">
          <h3 className="payment-heading">Payment Method</h3>
          <div className="payment-circle">💵 {formData.paymentMethod}</div>
        </div>

        <button className="place-order-btn" onClick={handlePlaceOrder} disabled={loading}>
          {loading ? <span className="spinner"></span> : "🛒 Place Order"}
        </button>
      </div>

      <div className="checkout-summary">
        <h2>Order Summary</h2>
        {cartItems.map((item, index) => (
          <div key={index} className="summary-item">
            <img src={item.image} alt={item.name} />
            <div>
              <p>{item.name}</p>
              <p>PKR {item.price} x {item.quantity}</p>
              <p>Size: {item.size}</p>
              {item.measurements && (
                <div className="measurement-section">
                  <div>
                    <h5>Shirt</h5>
                    <div className="measurements-boxes">
                      {["Length","Shoulder","Armhole","Chest","Waist","Hip","Sleeve Length","Wrist","Bottom/Damman"]
                        .filter(f => item.measurements[f] || item.measurements[`S.${f}`])
                        .map(f => (
                          <div key={f} className="measure-box">
                            {f}: {item.measurements[f] || item.measurements[`S.${f}`]}
                          </div>
                        ))}
                    </div>
                  </div>
                  <div>
                    <h5>Trouser</h5>
                    <div className="measurements-boxes">
                      {["Length","Waist","Knee","Thigh","Hip","Bottom"]
                        .filter(f => item.measurements[f] || item.measurements[`T.${f}`])
                        .map(f => (
                          <div key={f} className="measure-box">
                            {f}: {item.measurements[f] || item.measurements[`T.${f}`]}
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
            <p>Rs {item.price * item.quantity}</p>
          </div>
        ))}
        <hr />
        <h3>Total: Rs {totalAmount}</h3>
      </div>
    </div>
  );
};

export default CheckoutPage;
