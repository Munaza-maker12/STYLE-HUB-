

// import React, { useState, useEffect } from "react";
// import { Link, Outlet, useNavigate } from "react-router-dom";
// import Notifications from "./Notifications";
// import logo from '../assets/logo.png'; 
// import { FiHome, FiPackage, FiUsers, FiSettings, FiChevronDown, FiLogOut} from "react-icons/fi";
// import { MdCategory, MdOutlineAddBox, MdViewList } from "react-icons/md";
// import "./Admin.css";

// const AdminLayout = () => {
//   const navigate = useNavigate();
//   const [productDropdown, setProductDropdown] = useState(false);
//   const [categoryDropdown, setCategoryDropdown] = useState(false);
//   const [profileDropdown, setProfileDropdown] = useState(false);

//   useEffect(() => {
//     const token = localStorage.getItem("adminToken");
//     if (!token) {
//       alert("Admin not logged in");
//       navigate("/");
//     }
//   }, [navigate]);

//   const handleLogout = () => {
//     localStorage.removeItem("adminToken");
//     navigate("/"); 
//   };

//   return (
//     <div className="admin-container">
   
//       <aside className="admin-sidebar">
//         <div className="sidebar-logo">
//           <img src={logo} alt="logo" className="logo-img" />
//           <span className="logo-text">StyleHUB</span>
//         </div>

//         <ul className="sidebar-menu">
//           <li>
//             <Link to="/admin">
//               <FiHome className="menu-icon" /> Dashboard
//             </Link>
//           </li>
//           <li>
//             <Link to="/admin/orders">
//               <FiPackage className="menu-icon" /> View Orders
//             </Link>
//           </li>
//           <li>
//             <Link to="/admin/users">
//               <FiUsers className="menu-icon" /> User List
//             </Link>
//           </li>
//           <li>
//             <div className="dropdown-toggle" onClick={() => setProductDropdown(!productDropdown)}>
//               <FiPackage className="menu-icon" /> 
//               <span>Manage Products</span>
//               <FiChevronDown className={`chevron ${productDropdown ? 'open' : ''}`} />
//             </div>
//             {productDropdown && (
//               <ul className="dropdown-submenu">
//                 <li><Link to="/admin/products">View All Products</Link></li>
//                 <li><Link to="/admin/products/new">Add New Product</Link></li>
//               </ul>
//             )}
//           </li>
//           <li>
//             <div className="dropdown-toggle" onClick={() => setCategoryDropdown(!categoryDropdown)}>
//               <MdCategory className="menu-icon" /> 
//               <span>Manage Categories</span>
//               <FiChevronDown className={`chevron ${categoryDropdown ? 'open' : ''}`} />
//             </div>
//             {categoryDropdown && (
//               <ul className="dropdown-submenu">
//                 <li><Link to="/admin/categories">View All Categories</Link></li>
//                 <li><Link to="/admin/categories/new">Add New Category</Link></li>
//               </ul>
//             )}
//           </li>
//           <li>
//             <Link to="/admin/stock">
//               <FiPackage className="menu-icon" /> Stock Management
//             </Link>
//           </li>
//         </ul>
//       </aside>

   
//       <main className="admin-main">
//         <header className="admin-header">
//           <div className="header-left">
//             <h2>Online StyleHUB Shop - Admin Panel</h2>
//           </div>
//           <div className="header-right">
//             <div className="notifications">
              
//               <Notifications isAdmin={true} />

//             </div>
//             <div className="profile-dropdown">
//               <span onClick={() => setProfileDropdown(!profileDropdown)}>
//                 Hi, Admin <FiChevronDown className={profileDropdown ? 'open' : ''} />
//               </span>
//               {profileDropdown && (
//                 <ul className="profile-menu">
//                   <li><Link to="/admin/profile"><MdViewList /> My Profile</Link></li>
//                  <li>
//   <Link to="/forget/password">
//     <MdOutlineAddBox /> Forget Password
//   </Link>
// </li>

//                   <li onClick={handleLogout}><FiLogOut /> Logout</li>
//                 </ul>
//               )}
//             </div>
//           </div>
//         </header>
//         <div className="admin-content">
//           <Outlet />
//         </div>
//       </main>
//     </div>
//   );
// };

// export default AdminLayout;     

import React, { useState, useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import Notifications from "./Notifications";
import logo from '../assets/logo.png'; 
import { FiHome, FiPackage, FiUsers, FiSettings, FiChevronDown, FiLogOut} from "react-icons/fi";
import { MdCategory, MdOutlineAddBox, MdViewList } from "react-icons/md";
import "./Admin.css";

const AdminLayout = () => {
  const navigate = useNavigate();
  const [productDropdown, setProductDropdown] = useState(false);
  const [categoryDropdown, setCategoryDropdown] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      alert("Admin not logged in");
      navigate("/");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/"); 
  };

  return (
    <div className="admin-container">
   
      <aside className="admin-sidebar">
        <div className="sidebar-logo">
          <img src={logo} alt="logo" className="logo-img" />
          <span className="logo-text">StyleHUB</span>
        </div>

        <ul className="sidebar-menu">
          <li>
            <Link to="/admin">
              <FiHome className="menu-icon" /> Dashboard
            </Link>
          </li>
          <li>
            <Link to="/admin/orders">
              <FiPackage className="menu-icon" /> View Orders
            </Link>
          </li>
          <li>
            <Link to="/admin/users">
              <FiUsers className="menu-icon" /> User List
            </Link>
          </li>
          <li>
            <Link to="/admin/admins">All Admins</Link>
          </li>
          <li>
            <div className="dropdown-toggle" onClick={() => setProductDropdown(!productDropdown)}>
              <FiPackage className="menu-icon" /> 
              <span>Manage Products</span>
              <FiChevronDown className={`chevron ${productDropdown ? 'open' : ''}`} />
            </div>
            {productDropdown && (
              <ul className="dropdown-submenu">
                <li><Link to="/admin/products">View All Products</Link></li>
                <li><Link to="/admin/products/new">Add New Product</Link></li>
              </ul>
            )}
          </li>
          <li>
            <div className="dropdown-toggle" onClick={() => setCategoryDropdown(!categoryDropdown)}>
              <MdCategory className="menu-icon" /> 
              <span>Manage Categories</span>
              <FiChevronDown className={`chevron ${categoryDropdown ? 'open' : ''}`} />
            </div>
            {categoryDropdown && (
              <ul className="dropdown-submenu">
                <li><Link to="/admin/categories">View All Categories</Link></li>
                <li><Link to="/admin/categories/new">Add New Category</Link></li>
              </ul>
            )}
          </li>
          <li>
            <Link to="/admin/stock">
              <FiPackage className="menu-icon" /> Stock Management
            </Link>
          </li>
        </ul>
      </aside>

   
      <main className="admin-main">
        <header className="admin-header">
          <div className="header-left">
            <h2>Online StyleHUB Shop - Admin Panel</h2>
          </div>
          <div className="header-right">
            <div className="notifications">
              
              <Notifications isAdmin={true} />

            </div>
            <div className="profile-dropdown">
              <span onClick={() => setProfileDropdown(!profileDropdown)}>
                Hi, Admin <FiChevronDown className={profileDropdown ? 'open' : ''} />
              </span>
              {profileDropdown && (
                <ul className="profile-menu">
                  <li><Link to="/admin/profile"><MdViewList /> My Profile</Link></li>
                 <li>
  <Link to="/forget/password">
    <MdOutlineAddBox /> Forget Password
  </Link>
</li>

                  <li onClick={handleLogout}><FiLogOut /> Logout</li>
                </ul>
              )}
            </div>
          </div>
        </header>
        <div className="admin-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;