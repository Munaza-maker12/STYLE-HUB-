import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
} from "./redux/cartSlice";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./CartPage.css";

const CartPage = () => {
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [selectedItems, setSelectedItems] = useState([]);

  const toggleSelect = (itemId, itemSize) => {
    const key = `${itemId}-${itemSize}`;
    setSelectedItems((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const toggleSelectAll = () => {
    if (selectedItems.length === cartItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cartItems.map((item) => `${item.id}-${item.size}`));
    }
  };

  const isSelected = (itemId, itemSize) =>
    selectedItems.includes(`${itemId}-${itemSize}`);

  const getSelectedTotal = () =>
    cartItems
      .filter((item) => isSelected(item.id, item.size))
      .reduce((sum, item) => sum + item.price * item.quantity, 0);

  const getTotalPrice = () =>
    cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      toast.warning("Please select at least one item to proceed!", { position: "top-right" }); // ✅ English
      return;
    }
    const itemsToOrder = cartItems.filter((item) =>
      isSelected(item.id, item.size)
    );
    navigate("/checkout", { state: { items: itemsToOrder } });
  };

  const handleIncreaseQuantity = (item) => {
    const currentStock =
      typeof item.stock === "object" ? item.stock[item.size] : item.stock;
    if (item.quantity >= currentStock) {
      toast.error(`Only ${currentStock} pieces available!`, { // ✅ Already English
        position: "top-right",
      });
      return;
    }
    dispatch(increaseQuantity({ id: item.id, size: item.size }));
  };

  const handleDecreaseQuantity = (item) => {
    if (item.quantity <= 1) {
      dispatch(removeFromCart({ id: item.id, size: item.size }));
      setSelectedItems((prev) =>
        prev.filter((k) => k !== `${item.id}-${item.size}`)
      );
    } else {
      dispatch(decreaseQuantity({ id: item.id, size: item.size }));
    }
  };

  const handleRemove = (item) => {
    dispatch(removeFromCart({ id: item.id, size: item.size }));
    setSelectedItems((prev) =>
      prev.filter((k) => k !== `${item.id}-${item.size}`)
    );
  };

  return (
    <div className="cart-container">
      <ToastContainer />
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>
      <h2>Your Shopping Cart</h2>

      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <span className="empty-icon">🛒</span>
          <p>Your cart is empty.</p>
          <button className="checkout-btn" onClick={() => navigate("/")}>
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="cart-content">
          <div className="select-all-row">
            <label className="select-all-label">
              <input
                type="checkbox"
                className="custom-checkbox"
                checked={selectedItems.length === cartItems.length}
                onChange={toggleSelectAll}
              />
              <span>
                {selectedItems.length === cartItems.length
                  ? "Deselect All"
                  : "Select All"}
              </span>
            </label>
            <span className="selected-count">
              {selectedItems.length} / {cartItems.length} selected
            </span>
          </div>

          <div className="cart-items">
            {cartItems.map((item) => (
              <div
                key={`${item.id}-${item.size}`}
                className={`cart-item ${
                  isSelected(item.id, item.size) ? "item-selected" : ""
                }`}
              >
                <div className="item-checkbox">
                  <input
                    type="checkbox"
                    className="custom-checkbox"
                    checked={isSelected(item.id, item.size)}
                    onChange={() => toggleSelect(item.id, item.size)}
                  />
                </div>

                <img src={item.image} alt={item.name} className="cart-img" />

                <div className="cart-details">
                  <h3>{item.name}</h3>
                  <p className="item-price">PKR {item.price}</p>
                  <p>
                    Size: <span className="size-box">{item.size}</span>
                  </p>

                  <div className="measurement-section">
                    <div className="shirt-measurements">
                      <h4>Shirt</h4>
                      <div className="measurements-boxes">
                        {[
                          "Length","Shoulder","Armhole","Chest","Waist","Hip",
                          "Sleeve Length","Wrist","Bottom/Damman",
                        ]
                          .filter(
                            (f) =>
                              (item.measurements && item.measurements[f]) ||
                              (item.measurements && item.measurements[`S.${f}`])
                          )
                          .map((f) => (
                            <div key={f} className="measure-box">
                              {f}:{" "}
                              {item.measurements[f] ||
                                item.measurements[`S.${f}`]}
                            </div>
                          ))}
                      </div>
                    </div>

                    <div className="trouser-measurements">
                      <h4>Trouser</h4>
                      <div className="measurements-boxes">
                        {["Length", "Waist", "Knee", "Thigh", "Hip", "Bottom"]
                          .filter(
                            (f) =>
                              (item.measurements && item.measurements[f]) ||
                              (item.measurements && item.measurements[`T.${f}`])
                          )
                          .map((f) => (
                            <div key={f} className="measure-box">
                              {f}:{" "}
                              {item.measurements[f] ||
                                item.measurements[`T.${f}`]}
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>

                  <div className="quantity-remove-row">
                    <div className="quantity-control">
                      <button onClick={() => handleDecreaseQuantity(item)}>
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => handleIncreaseQuantity(item)}
                        disabled={
                          item.quantity >=
                          (typeof item.stock === "object"
                            ? item.stock[item.size]
                            : item.stock)
                        }
                        style={{
                          opacity:
                            item.quantity >=
                            (typeof item.stock === "object"
                              ? item.stock[item.size]
                              : item.stock)
                              ? 0.5
                              : 1,
                          cursor:
                            item.quantity >=
                            (typeof item.stock === "object"
                              ? item.stock[item.size]
                              : item.stock)
                              ? "not-allowed"
                              : "pointer",
                        }}
                      >
                        +
                      </button>
                    </div>
                    <button
                      className="remove-btn"
                      onClick={() => handleRemove(item)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="price-details">
            <h3>Price Details</h3>
            <p>
              Total Items:{" "}
              <span>
                {cartItems.reduce((s, i) => s + i.quantity, 0)} items
              </span>
            </p>
            <p>
              Cart Total: <span>PKR {getTotalPrice()}</span>
            </p>

            {selectedItems.length > 0 && (
              <div className="selected-summary">
                <p>
                  Selected ({selectedItems.length} items):{" "}
                  <strong>PKR {getSelectedTotal()}</strong>
                </p>
              </div>
            )}

            <p>
              Shipping: <span className="free-ship">Free</span>
            </p>
            <p>
              <strong>Payment:</strong> Cash on Delivery
            </p>
            <h4>
              Order Total: PKR{" "}
              {selectedItems.length > 0 ? getSelectedTotal() : getTotalPrice()}
            </h4>

            {selectedItems.length === 0 && (
              <p className="select-hint">
                ☝️ Please select items to checkout
              </p>
            )}

            <button
              className={`checkout-btn ${
                selectedItems.length === 0 ? "btn-disabled" : ""
              }`}
              onClick={handleCheckout}
            >
              {selectedItems.length > 0
                ? `Order Selected (${selectedItems.length})`
                : "Select Items to Order"}
            </button>
            <button className="checkout-btn secondary-btn" onClick={() => navigate("/")}>
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
