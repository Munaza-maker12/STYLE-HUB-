
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { FiUsers, FiShoppingCart } from "react-icons/fi";
// import { GiClothes } from "react-icons/gi";
// import { MdCategory, MdLocalShipping } from "react-icons/md";
// import { AiOutlineAppstoreAdd, AiOutlineClockCircle, AiOutlineStop } from "react-icons/ai";
// import { BiArrowBack } from "react-icons/bi";
// import "./AdminDashboard.css";

// const AdminDashboard = () => {
//   const [stats, setStats] = useState({
//     users: 0,
//     products: 0,
//     categories: 0,
//     subcategories: 0,
//     orders: 0,
//     deliveredOrders: 0,
//     returnedOrders: 0,
//     cancelledOrders: 0,
//     pendingOrders: 0,
//   });

//   useEffect(() => {
//     const fetchStats = async () => {
//       try {
//         const token = localStorage.getItem("adminToken");
//         const res = await axios.get("http://localhost:4000/api/admin/stats", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setStats(res.data);
//       } catch (err) {
//         console.error("Error fetching stats", err);
//       }
//     };
//     fetchStats();
//   }, []);

//   const cards = [
//     { label: "Users", value: stats.users, icon: <FiUsers />, color: "#ff6b6b" },
//     { label: "Products", value: stats.products, icon: <GiClothes />, color: "#54a0ff" },
//     { label: "Categories", value: stats.categories, icon: <MdCategory />, color: "#1dd1a1" },
//     { label: "Subcategories", value: stats.subcategories, icon: <AiOutlineAppstoreAdd />, color: "#f368e0" },
//     { label: "Orders", value: stats.orders, icon: <FiShoppingCart />, color: "#ff9f43" },
//     { label: "Delivered", value: stats.deliveredOrders, icon: <MdLocalShipping />, color: "#00d2d3" },
//     { label: "Cancelled", value: stats.cancelledOrders, icon: <AiOutlineStop />, color: "#ee5253" },
//     { label: "Pending", value: stats.pendingOrders, icon: <AiOutlineClockCircle />, color: "#ffbe76" },
//   ];

//   return (
//     <div className="dashboard-container">
//       <h1>Admin Dashboard</h1>
//       <div className="stats-grid">
//         {cards.map((card, idx) => (
//           <div className="stat-card" key={idx}>
//             <div className="card-icon" style={{ backgroundColor: card.color }}>
//               {card.icon}
//             </div>
//             <div className="card-text">
//               <h2>{card.value}</h2>
//               <p>{card.label}</p>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiUsers, FiShoppingCart } from "react-icons/fi";
import { GiClothes } from "react-icons/gi";
import { MdCategory, MdLocalShipping } from "react-icons/md";
import { AiOutlineAppstoreAdd, AiOutlineClockCircle, AiOutlineStop } from "react-icons/ai";
import { BiArrowBack } from "react-icons/bi";
import { TbTruckReturn } from "react-icons/tb";
import { HiOutlineRefresh } from "react-icons/hi";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    products: 0,
    categories: 0,
    subcategories: 0,
    orders: 0,
    deliveredOrders: 0,
    returnedOrders: 0,
    cancelledOrders: 0,
    pendingOrders: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        const res = await axios.get("http://localhost:4000/api/admin/stats", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(res.data);
      } catch (err) {
        console.error("Error fetching stats", err);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    { label: "Users", value: stats.users, icon: <FiUsers />, color: "#ff6b6b" },
    { label: "Products", value: stats.products, icon: <GiClothes />, color: "#54a0ff" },
    { label: "Categories", value: stats.categories, icon: <MdCategory />, color: "#1dd1a1" },
    { label: "Subcategories", value: stats.subcategories, icon: <AiOutlineAppstoreAdd />, color: "#f368e0" },
    { label: "Total Orders", value: stats.orders, icon: <FiShoppingCart />, color: "#ff9f43" },
    { label: "Pending Orders", value: stats.pendingOrders, icon: <AiOutlineClockCircle />, color: "#ffbe76" },
    { label: "Delivered", value: stats.deliveredOrders, icon: <MdLocalShipping />, color: "#00d2d3" },
    { label: "Cancelled", value: stats.cancelledOrders, icon: <AiOutlineStop />, color: "#ee5253" },
    { label: "Returned", value: stats.returnedOrders, icon: <TbTruckReturn />, color: "#a29bfe" },
  ];

  return (
    <div className="dashboard-container">
      <h1>Admin Dashboard</h1>
      <div className="stats-grid">
        {cards.map((card, idx) => (
          <div className="stat-card" key={idx}>
            <div className="card-icon" style={{ backgroundColor: card.color }}>
              {card.icon}
            </div>
            <div className="card-text">
              <h2>{card.value}</h2>
              <p>{card.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;