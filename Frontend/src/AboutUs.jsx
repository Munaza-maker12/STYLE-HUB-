 import React from "react";
import { useNavigate } from "react-router-dom";
import "./AboutUs.css";

const AboutUs = () => {
  const navigate = useNavigate();

  return (
    <div className="about-container split-layout">
     

      <div className="about-text">
        <h1 className="animated-heading">Welcome to StyleHub</h1>
        <p className="about-tagline">"Your Fashion, Your Identity"</p>

        <div className="about-highlights">
          <div className="highlight-box">
            <h3>Premium Quality</h3>
            <p>
              At <strong>StyleHub</strong>, fashion is about self-expression.
              Our mission is to provide stylish, high-quality, and sustainable
              fashion for everyone.
            </p>
          </div>

          <div className="highlight-box">
            <h3>Trendy & Unique</h3>
            <p>
              Whether you're looking for the latest trends, timeless classics,
              or eco-friendly choices, StyleHub has something for you.
            </p>
          </div>

          <div className="highlight-box">
            <h3>Sustainable Fashion</h3>
            <p>
              We blend fashion with comfort, ensuring you always feel your best,
              using eco-friendly materials with ethical production.
            </p>
          </div>
        </div>
      </div>

      <div className="about-image">
        <img src="assets/herowo.webp" alt="Hero" />
      </div>
    </div>
  );
};

export default AboutUs;
