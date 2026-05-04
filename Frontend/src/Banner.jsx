 import React from "react";
import { useNavigate } from "react-router-dom";
import "./Banner.css";
import data from "./data/banner.json";

const PromoBanner = () => {
  const navigate = useNavigate();
  const { heading, paragraph, img, size } = data[0]; 
  const [width, height] = size.split("x");

  return (
    <div
      className="promo-banner"
      style={{
        backgroundImage: `url(${img})`,
        width: `${width}px`,
        height: `${height}px`, 
      }}
    >
      <div className="promo-overlay">
        <div className="promo-content">
          <h1>{heading}</h1>
          <p>{paragraph}</p>
          
        </div>
      </div>
    </div>
  );
};

export default PromoBanner;