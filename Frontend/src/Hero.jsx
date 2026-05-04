 import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import heroData from "./data/HeroData.json";
import "./Hero.css";

const Hero = () => {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % heroData.length);
    }, 6000); 
    return () => clearInterval(interval);
  }, []);

  const current = heroData[index];

  return (
    <div
      className="hero-section"
      style={{ backgroundImage: `url(${current.img})` }}
    >
      <div className="overlay">
        <div className="hero-content">
          <h2>{current.heading}</h2>
          
          <p>{current.paragraph}</p>
         
          <div className="dots">
            {heroData.map((_, i) => (
              <span
                key={i}
                className={`dot ${i === index ? "active" : ""}`}
                onClick={() => setIndex(i)}
              ></span>
            ))}
        
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;