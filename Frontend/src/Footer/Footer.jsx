
import React from 'react';
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";
import { MdContactPage } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="footer">
      <div className="footer-container">

        {/* About */}
        <div className="footer-about">
          <h2 className="footer-title">StyleHub</h2>
          <p className="footer-description">
            StyleHub helps you find the perfect fit using your custom body measurements.
          </p>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h3 className="footer-subtitle">QUICK LINKS</h3>
          <ul>
            <li><button className="footer-link-btn" onClick={() => navigate("/")}>Home</button></li>
            <li><button className="footer-link-btn" onClick={() => navigate("/category/men")}>Mens</button></li>
            <li><button className="footer-link-btn" onClick={() => navigate("/category/women")}>Women</button></li>
            <li><button className="footer-link-btn" onClick={() => navigate("/aboutus")}>About Us</button></li>
          </ul>
        </div>

        {/* Support */}
        <div className="footer-section">
          <h3 className="footer-subtitle">SUPPORT</h3>
          <ul>
            <li><button className="footer-link-btn" onClick={() => navigate("/faq")}>FAQS</button></li>
            <li><button className="footer-link-btn" onClick={() => navigate("/termsandcondition")}>Terms & Condition</button></li>
            <li><button className="footer-link-btn" onClick={() => navigate("/shippingpolicy")}>Shipping Policy</button></li>
          </ul>
        </div>

        {/* Follow Us */}
        <div className="footer-section">
          <h3 className="footer-subtitle">FOLLOW US</h3>
          <div className="social-icons">
            <a href="https://facebook.com" target="_blank" rel="noreferrer"><FaFacebookF /></a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer"><FaInstagram /></a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer"><FaTwitter /></a>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="footer-bottom">
        © {new Date().getFullYear()} StyleHub. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;

