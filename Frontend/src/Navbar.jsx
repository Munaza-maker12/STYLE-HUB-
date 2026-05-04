 import React, { useState, useEffect, useRef } from 'react';
 import { Link, useNavigate } from 'react-router-dom';
import {   useLocation } from 'react-router-dom';
import { FaUserCircle, FaShoppingCart, FaTruck, FaSignOutAlt } from 'react-icons/fa';
import { AiOutlineSearch } from 'react-icons/ai';
import { clearCart } from './redux/cartSlice';
import { FaHeart } from "react-icons/fa";
import { MdFavoriteBorder } from "react-icons/md";
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts } from './redux/productsSlice';
import {  clearWishlist,fetchWishlist } from './redux/wishlistSlice';
import axios from 'axios';
import './Navbar.css';
import logo from './assets/logo.png';
import Notifications from './admin/Notifications';

const Navbar = () => {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [shopDropdownOpen, setShopDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [user, setUser] = useState(null);

  const shopRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const userRef = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const reduxUser = useSelector((state) => state.user.userInfo);
  const cartItems = useSelector((state) => state.cart.items || []);
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const products = useSelector((state) => state.products?.items || []);

  // ✅ Fix: items array ki actual length use karo
  // optimisticToggle ke baad items consistent hain, Map ki zaroorat nahi
  const wishlistItems = useSelector((state) => state.wishlist?.items || []);
  const wishlistCount = wishlistItems.length;
useEffect(() => {
  const loadUser = () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser && storedUser !== "undefined") {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("user");
        setUser(null);
      }
    }
  };

  loadUser(); // pehli baar load karo

  // localStorage change hone par dobara load karo
  window.addEventListener("storage", loadUser);
  return () => window.removeEventListener("storage", loadUser);
}, []);
  // useEffect(() => {
  //   const storedUser = localStorage.getItem("user");
  //   if (storedUser && storedUser !== "undefined") {
  //     try {
  //       setUser(JSON.parse(storedUser));
  //     } catch {
  //       localStorage.removeItem("user");
  //       setUser(null);
  //     }
  //   }
  // }, []);

  // ✅ Login hone ke baad wishlist fetch karo taake count sahi ho
  useEffect(() => {
  const userId = reduxUser?._id || user?._id;
  const token = localStorage.getItem('accessToken');
  
  // Token + user check
  if (userId && token) {
    dispatch(fetchWishlist());
  }
}, [reduxUser?._id, user?._id, dispatch]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
     dispatch(clearCart());
     dispatch(clearWishlist());
        
     localStorage.removeItem('accessToken');
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  localStorage.removeItem('userToken');

    setUser(null);
    navigate('/login');
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  };

  useEffect(() => {
    if (searchText.trim() !== '') {
      dispatch(fetchProducts(searchText));
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  }, [searchText, dispatch]);

  const handleSearch = () => {
    if (searchText.trim() !== '') {
      navigate(`/search?query=${encodeURIComponent(searchText)}`);
      setSearchText('');
      setShowDropdown(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (shopRef.current && !shopRef.current.contains(e.target)) setShopDropdownOpen(false);
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target)) setMobileMenuOpen(false);
      if (userRef.current && !userRef.current.contains(e.target)) setUserDropdownOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setMobileMenuOpen(false);
        setShopDropdownOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isLoggedIn = user?._id || reduxUser?._id;

  return (
    <nav className="navbar">
      <button className="menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>☰</button>

      <div className="nav-logo">
        <img src={logo} alt="Logo" />
        <h1>StyleHub</h1>
      </div>

      <ul className={`nav-links ${mobileMenuOpen ? 'open' : ''}`} ref={mobileMenuRef}>
        <li><Link to="/" onClick={() => setMobileMenuOpen(false)}>Home</Link></li>
        <li className={`dropdown ${shopDropdownOpen ? 'open' : ''}`} ref={shopRef}>
          <span className="dropdown-title" onClick={() => setShopDropdownOpen(!shopDropdownOpen)}>Shop</span>
          {shopDropdownOpen && (
            <ul className="dropdown-menu">
              <li><Link to="category/men" onClick={() => setMobileMenuOpen(false)}>Men</Link></li>
              <li><Link to="category/women" onClick={() => setMobileMenuOpen(false)}>Women</Link></li>
            </ul>
          )}
        </li>
        <li><Link to="/aboutus" onClick={() => setMobileMenuOpen(false)}>About Us</Link></li>
      </ul>

      <div className="search-container">
        <AiOutlineSearch className="search-icon" onClick={handleSearch} />
        <input
          type="text"
          placeholder="Search..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        {showDropdown && (
          <div className="search-dropdown">
            {products.length > 0 ? products.map(p => (
              <Link key={p._id} to={`/product/${p._id}`} className="search-item">
                {p.image && <img src={p.image} alt={p.name} />}
                <span>{p.name}</span>
              </Link>
            )) : <div className="search-item">No products found</div>}
          </div>
        )}
      </div>

      <div className="nav-icons">
        {/* Cart */}
        <Link to="/cart" className="cart-link">
          <FaShoppingCart />
          {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
        </Link>

        {/* Wishlist */}
        {isLoggedIn && (
          <Link to="/wishlist" className="cart-link">
            <MdFavoriteBorder style={{ fontSize: '24px', color: '#111' }} />
            {wishlistCount > 0 && (
              <span className="cart-count">{wishlistCount}</span>
            )}
          </Link>
        )}

        {/* Notifications */}
        {isLoggedIn && <Notifications isAdmin={false} />}

        {/* User dropdown */}
        <div className="user-wrapper" ref={userRef}>
          {/* <FaUserCircle onClick={() => setUserDropdownOpen(!userDropdownOpen)} /> */}
          {user?.avatar && typeof user.avatar === "string" && user.avatar.startsWith("http") ? (
  <img
    src={user.avatar}
    alt="profile"
    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
    style={{
      width: "32px",
      height: "32px",
      borderRadius: "50%",
      cursor: "pointer",
      objectFit: "cover",
      border: "2px solid #ddd",
    }}
  />
) : (
  <FaUserCircle onClick={() => setUserDropdownOpen(!userDropdownOpen)} />
)}
          {userDropdownOpen && (
            <div className="dropdown-content">
              {user ? (
                <>
                  <p className="dropdown-email">{user.email}</p>
                  <Link to="/myProfile" className="dropdown-item"><FaUserCircle /> My Profile</Link>
                  <Link to="/wishlist" className="dropdown-item"><FaHeart /> My Wishlist</Link>
                  <Link to="/myOrders" className="dropdown-item"><FaTruck /> My Orders</Link>
                  <Link to="/cart" className="dropdown-item"><FaShoppingCart /> My Cart</Link>
                  <button className="dropdown-item logout-btn" onClick={handleLogout}><FaSignOutAlt /> Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" className="dropdown-item">Login</Link>
                  <Link to="/register" className="dropdown-item">Register</Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="deliver-currency-wrapper">
        <div className="deliver-to">
          <span className="label">Deliver To</span>
          <div className="flag-with-code">
            <div className="flag-circle">
              <img src="https://upload.wikimedia.org/wikipedia/commons/3/32/Flag_of_Pakistan.svg" alt="Pakistan Flag" />
            </div>
            <span className="code">PK</span>
          </div>
        </div>
        <div className="divider"></div>
        <div className="currency">
          <span className="label">Currency</span>
          <span className="code">PKR</span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;