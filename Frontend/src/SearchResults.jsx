import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import './SearchResults.css';

const SearchResults = () => {
  const query = new URLSearchParams(useLocation().search).get('query');
  const [products, setProducts] = useState([]);

  // useEffect(() => {
  //   const fetchProducts = async () => {
  //     try {
  //       const res = await axios.get(`http://localhost:4000/api/products?search=${query}`);
  //       setProducts(res.data);
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   };
  //   if (query) fetchProducts();
  // }, [query]);
  useEffect(() => {
  const fetchProducts = async () => {
    try {
      const res = await axios.get(`http://localhost:4000/api/products/search/query?q=${query}`); // ✅ URL fix
      setProducts(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  if (query) fetchProducts();
}, [query]);

  return (
    <div className="search-results-container">
      <h2>Search Results for: "{query}"</h2>

      {products.length === 0 ? (
        <p>No products match your search.</p> 
      ) : (
        <div className="products-container">
          {products.map(p => (
            <div key={p._id} className="search-product">
              {p.images && p.images.length > 0 && (
                   <img src={p.images[0]} alt={p.name} /> 
               
              )}
              <h4>{p.name}</h4>
              <p>{p.category} / {p.subcategory}</p>
              <p>PKR {p.price}</p>
              <Link to={`/product/${p._id}`} className="view-btn">View</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;