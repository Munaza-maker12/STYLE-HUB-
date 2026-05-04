import React from 'react';
import "./Shippingpolicy.css";
import { useNavigate } from 'react-router-dom';

const ShippingPolicy = () => {
  const navigate = useNavigate();

  return (
    <div>
      <button onClick={() => navigate(-1)} className="back-button">← Back</button>

      <div className="shipping-container">
        <h1>Shipping Policy</h1>
        <p>At StyleHub, we are committed to delivering your orders as quickly and efficiently as possible.</p>

        <h2>1. Delivery Time</h2>
        <p>We offer delivery across Pakistan. Orders are typically shipped within 2-3 business days and delivered within 5-7 business days.</p>

        <h2>2. Shipping Charges</h2>
        <ul>
          <li>Express Shipping: PKR 199 (2-3 days)</li>
          <li>Cash on Delivery (COD): Free (5-7 days)</li>
        </ul>

        <h2>3. International Shipping</h2>
        <p>Currently, we do not offer international shipping. Stay tuned for updates!</p>

        <h2>4. Delays</h2>
        <p>Delays can occur due to weather, holidays, or other unforeseen circumstances. We appreciate your patience and will keep you informed.</p>
      </div>
    </div>
  );
};

export default ShippingPolicy;