
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./MyOrders.css";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [returnReason, setReturnReason] = useState("");
  const [returnComment, setReturnComment] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;

  useEffect(() => {
    const fetchOrders = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(
          `http://localhost:4000/api/orders/my-orders/${userId}`
        );
        setOrders(res.data);
      } catch (err) {
        console.error("Error fetching orders:", err.response?.data || err.message);
        alert("Failed to load your orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId]);

  const handleCancelOrder = async (orderId) => {
  if (!window.confirm("Are you sure you want to cancel this order?")) return;

  try {
    const res = await axios.put(`http://localhost:4000/api/orders/cancel/${orderId}`);
    alert(res.data.message);

    // ✅ Status update karo — "Cancelled" set karo
    setOrders((prev) =>
      prev.map((order) =>
        order.orderId === orderId ? { ...order, status: "Cancelled" } : order
      )
    );
  } catch (err) {
    console.error("Cancel order error:", err.response?.data || err.message);
    alert(err.response?.data?.message || "Failed to cancel order");
  }
};
  const openReturnModal = (order) => {
    setSelectedOrder(order);
    setShowReturnModal(true);
    setReturnReason("");
    setReturnComment("");
  };

  const closeReturnModal = () => {
    setShowReturnModal(false);
    setSelectedOrder(null);
    setReturnReason("");
    setReturnComment("");
  };

  const handleReturnRequest = async () => {
    if (!returnReason) {
      alert("Please select a return reason");
      return;
    }

    try {
      const res = await axios.put(
        `http://localhost:4000/api/orders/return/${selectedOrder.orderId}`,
        {
          reason: returnReason,
          comment: returnComment,
        }
      );

      alert(res.data.message || "Return request submitted successfully");

      setOrders((prev) =>
        prev.map((order) =>
          order.orderId === selectedOrder.orderId
            ? { ...order, returnStatus: "Requested" }
            : order
        )
      );

      closeReturnModal();
    } catch (err) {
      console.error("Return request error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to submit return request");
    }
  };

  if (loading) return <p>Loading your orders...</p>;

  if (orders.length === 0) return <p>You have no orders yet.</p>;

  return (
    <div className="my-orders-page">
      <h2>My Orders</h2>
      <div className="orders-list">
        {orders.map((order) => (
          <div key={order._id} className="order-card">
            <h3>Order ID: {order.orderId}</h3>
            <p>
              Status:{" "}
              <strong
                className={
                  order.status === "Pending"
                    ? "status-pending"
                    : order.status === "Cancelled"
                    ? "status-cancelled"
                    : order.status === "Delivered"
                    ? "status-delivered"
                    : order.status === "Shipped"
                    ? "status-shipped"
                    : ""
                }
              >
                {order.status}
              </strong>
            </p>
            <p>
              Return Status:{" "}
              <strong
                className={
                  order.returnStatus === "Not Returned"
                    ? "status-not-returned"
                    : order.returnStatus === "Requested"
                    ? "status-return-requested"
                    : order.returnStatus === "Returned"
                    ? "status-returned"
                    : ""
                }
              >
                {order.returnStatus}
              </strong>
            </p>
            <p>Total: Rs {order.totalAmount}</p>
            <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>

            <div className="order-products">
              <h4>Products:</h4>
              <ul>
                {order.items.map((item, index) => (
                  <li key={index}>
                    {item.name} × {item.quantity} (Rs {item.price})
                  </li>
                ))}
              </ul>
            </div>

            <div className="order-actions">
              {order.status === "Pending" && (
                <button
                  className="cancel-btn"
                  onClick={() => handleCancelOrder(order.orderId)}
                >
                  Cancel Order
                </button>
              )}

              {order.status === "Delivered" && 
               order.returnStatus === "Not Returned" && (
                <button
                  className="return-btn"
                  onClick={() => openReturnModal(order)}
                >
                  Return Order
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {showReturnModal && (
        <div className="modal-overlay" onClick={closeReturnModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Return Order</h3>
            <p>Order ID: {selectedOrder?.orderId}</p>

            <div className="form-group">
              <label>Return Reason *</label>
              <select
                value={returnReason}
                onChange={(e) => setReturnReason(e.target.value)}
                required
              >
                <option value="">Select a reason</option>
                <option value="Defective Product">Defective Product</option>
                <option value="Wrong Item Received">Wrong Item Received</option>
                <option value="Size Issue">Size Issue</option>
                <option value="Quality Not as Expected">Quality Not as Expected</option>
                <option value="Changed Mind">Changed Mind</option>
                <option value="Product Not as Described">Product Not as Described</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>Additional Comments (Optional)</label>
              <textarea
                value={returnComment}
                onChange={(e) => setReturnComment(e.target.value)}
                placeholder="Provide more details about your return..."
                rows="4"
              />
            </div>

            <div className="modal-actions">
              <button className="submit-btn" onClick={handleReturnRequest}>
                Submit Return Request
              </button>
              <button className="cancel-modal-btn" onClick={closeReturnModal}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrders;