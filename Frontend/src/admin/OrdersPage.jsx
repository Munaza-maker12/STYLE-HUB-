
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import "./OrdersPage.css";

// const OrdersPage = () => {
//   const [orders, setOrders] = useState([]);
//   const [filteredOrders, setFilteredOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         const token = localStorage.getItem("adminToken");
//         if (!token) throw new Error("Admin not logged in");

//         const res = await axios.get(
//           "http://localhost:4000/api/admin/orders",
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );

//         if (!res.data.status) throw new Error(res.data.message || "Failed to fetch orders");

//         setOrders(res.data.orders || []);
//         setFilteredOrders(res.data.orders || []);
//       } catch (err) {
//         console.error("Error fetching orders:", err);
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchOrders();
//   }, []);

//   // 🔍 Filter orders based on search
//   useEffect(() => {
//     const results = orders.filter((order) =>
//       order.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       order.shipping?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       order.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       order.returnStatus?.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//     setFilteredOrders(results);
//   }, [searchTerm, orders]);

//   if (loading) return <p>Loading orders...</p>;
//   if (error) return <p style={{ color: "red" }}>Error: {error}</p>;
//   if (orders.length === 0) return <p>No orders found.</p>;

//   return (
//     <div className="orders-container">
//        <div className="orders-header">
//       <h1 className="orders-title">Order Listing</h1>
      
//       <input
//         type="text"
//         placeholder="Search by Order ID, Customer, Status..."
//         className="search-input"
//         value={searchTerm}
//         onChange={(e) => setSearchTerm(e.target.value)}
//       />
//       </div>
//       <table className="orders-table">
//         <thead>
//           <tr>
//             <th>#</th>
//             <th>Order ID</th>
//             <th>Order Date</th>
//             <th>Customer Name</th>
//             <th>Total Amount</th>
//             <th>Status</th>
            
//             <th>Action</th>
//           </tr>
//         </thead>
//         <tbody>
//           {filteredOrders.length > 0 ? (
//             filteredOrders.map((order, index) => (
//               <tr key={order._id || index}>
//                 <td>{index + 1}</td>
//                 <td>{order.orderId}</td>
//                 <td>{new Date(order.createdAt).toLocaleString()}</td>
//                 <td>{order.shipping?.name || "N/A"}</td>
//                 <td>PKR {order.totalAmount}</td>
//                 <td>{order.status}</td>
                
//                 <td>
//                   <button
//                     className="detail-btn"
//                     onClick={() => navigate(`/admin/orders/${order.orderId}`)}
//                   >
//                     Details
//                   </button>
//                    {order.status === "Cancelled" && (
//     <button
//       className="delete-btn"
//       onClick={async () => {
//         if (!window.confirm("Are you sure you want to delete this cancelled order?")) return;
//         try {
//           const token = localStorage.getItem("adminToken");
//           const res = await axios.delete(
//             `http://localhost:4000/api/admin/orders/${order.orderId}`,
//             {
//               headers: { Authorization: `Bearer ${token}` },
//             }
//           );
//           alert(res.data.message);
//           // Remove the deleted order from state
//           setOrders((prev) => prev.filter((o) => o.orderId !== order.orderId));
//           setFilteredOrders((prev) => prev.filter((o) => o.orderId !== order.orderId));
//         } catch (err) {
//           console.error("Delete order error:", err);
//           alert(err.response?.data?.message || "Failed to delete order");
//         }
//       }}
//     >
//       Delete
//     </button>
//   )}
//                 </td>
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td colSpan="8" className="no-orders">No matching orders found</td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default OrdersPage;
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./OrdersPage.css";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [updatingId, setUpdatingId] = useState(null); // track which order is being updated
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) throw new Error("Admin not logged in");

      const res = await axios.get("http://localhost:4000/api/admin/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.data.status) throw new Error(res.data.message || "Failed to fetch orders");

      setOrders(res.data.orders || []);
      setFilteredOrders(res.data.orders || []);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const results = orders.filter(
      (order) =>
        order.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.shipping?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.returnStatus?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredOrders(results);
  }, [searchTerm, orders]);

  // Inline status change — update local state only
  const handleStatusChange = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.orderId === orderId ? { ...o, status: newStatus } : o))
    );
  };

  // Send update to backend
  const handleUpdateStatus = async (order) => {
  try {
    setUpdatingId(order.orderId);
    const token = localStorage.getItem("adminToken");

    const res = await axios.put(
      `http://localhost:4000/api/admin/orders/${order.orderId}/status`,
      { status: order.status },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // ✅ res.data.status check hata do — admin route alag response deta hai
    alert("Status updated!");
    fetchOrders(); // refresh
  } catch (err) {
    console.error("Error updating status:", err.response?.data); // exact error dekhne ke liye
    alert("Error: " + (err.response?.data?.message || err.message));
  } finally {
    setUpdatingId(null);
  }
};
  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this cancelled order?")) return;

    try {
      const token = localStorage.getItem("adminToken");
      const res = await axios.delete(
        `http://localhost:4000/api/admin/orders/${orderId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(res.data.message);
      setOrders((prev) => prev.filter((o) => o.orderId !== orderId));
      setFilteredOrders((prev) => prev.filter((o) => o.orderId !== orderId));
    } catch (err) {
      console.error("Delete order error:", err);
      alert(err.response?.data?.message || "Failed to delete order");
    }
  };

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;
  if (orders.length === 0) return <p>No orders found.</p>;

  return (
    <div className="orders-container">
      <div className="orders-header">
        <h1 className="orders-title">Order Listing</h1>
        <input
          type="text"
          placeholder="Search by Order ID, Customer, Status..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <table className="orders-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Order ID</th>
            <th>Order Date</th>
            <th>Customer Name</th>
            <th>Total Amount</th>
            <th>Status</th>
            <th>Return Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order, index) => (
              <tr key={order._id || index}>
                <td>{index + 1}</td>
                <td>{order.orderId}</td>
                <td>{new Date(order.createdAt).toLocaleString()}</td>
                <td>{order.shipping?.name || "N/A"}</td>
                <td>PKR {order.totalAmount}</td>

                {/* Inline Status Update */}
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.orderId, e.target.value)}
                      className={`status-badge status-${order.status.toLowerCase()}`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                    <button
                      className="update-btn"
                      onClick={() => handleUpdateStatus(order)}
                      disabled={updatingId === order.orderId}
                    >
                      {updatingId === order.orderId ? "..." : "Update"}
                    </button>
                  </div>
                </td>

                <td>
                  <span
                    className={`return-badge return-${order.returnStatus
                      .toLowerCase()
                      .replace(" ", "-")}`}
                  >
                    {order.returnStatus}
                    {order.returnStatus === "Requested" && " 🔔"}
                  </span>
                </td>

                <td>
                  <button
                    className="detail-btn"
                    onClick={() => navigate(`/admin/orders/${order.orderId}`)}
                  >
                    Details
                  </button>
                  {order.status === "Cancelled" && (
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteOrder(order.orderId)}
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="no-orders">
                No matching orders found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersPage;