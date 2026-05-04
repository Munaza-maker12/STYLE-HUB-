import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Catagory.css";

export default function Catagory() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/categories"); 
        setCategories(res.data); 
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div>
  
      <h2 className="category-heading">Shop By Categories</h2>

      
      <div className="categories-container">
        {categories.length > 0 ? (
          categories.map(({ _id, name, image, slug }) => (
            <Link to={`/category/${slug}`} key={_id} className="category-card">
              <img src={image} alt={name} />
              <h3>{name}</h3>
            </Link>
          ))
        ) : (
          <p>Loading categories...</p>
        )}
      </div>
    </div>
  );
}
