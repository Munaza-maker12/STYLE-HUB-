
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Receipt.css";

const Receipt = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const order = state?.order;

  if (!order) {
    return <h2>No receipt data found</h2>;
  }

  return (
    <div className="receipt-container">
      <h2>🧾 Order Receipt</h2>
      <p><b>Order ID:</b> {order.orderId}</p>
      <p><b>Date:</b> {new Date(order.createdAt).toLocaleString()}</p>
      <p><b>Name:</b> {order.shipping.name}</p>
      <p><b>Phone:</b> {order.shipping.phone}</p>
      <p>
        <b>Address:</b> {order.shipping.address}, {order.shipping.city}, {order.shipping.country}
      </p>
      <p><b>City:</b> {order.shipping.city}</p>

      <h3>Items:</h3>
      <ul>
        {order.items.map((item, idx) => (
          <li key={idx}>
            <span className="item-desc">
              {item.name} ({item.size}) x {item.quantity}
            </span>
            <span className="item-price">
              Rs {item.price * item.quantity}
            </span>
          </li>
        ))}
      </ul>

      <h3>Total: Rs {order.totalAmount}</h3>
      <p><b>Payment:</b> {order.paymentMethod}</p>
      <p><strong>Status:</strong> {order.status}</p>
         <div className="receipt-footer">
        <p>✅ Thank you for shopping with StyleHub!</p>
      </div>

      <button onClick={() => window.print()}>Print Receipt</button>
      <button onClick={() => navigate("/")}>Continue Shopping</button>

    
    </div>
  );
};

export default Receipt;
