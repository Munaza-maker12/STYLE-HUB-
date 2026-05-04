
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./ViewAllProducts.css";

const ViewAllProducts = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        alert("Admin not logged in");
        navigate("/login");
        return;
      }

      const res = await axios.get(
        "http://localhost:4000/api/admin/products/stock",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setProducts(res.data);
    } catch (error) {
      console.error("Error fetching products:", error);
      alert("Failed to fetch products. Check console for details.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      const token = localStorage.getItem("adminToken");
      await axios.delete(`http://localhost:4000/api/admin/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(products.filter((product) => product._id !== id));
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product");
    }
  };

  const handleEdit = (id) => {
    navigate(`/admin/products/edit/${id}`);
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.subCategory.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="view-products-container">
      <h2>All Products</h2>

      <input
        type="text"
        placeholder="Search products..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />

      <table className="products-table">
        <thead>
          <tr>
            <th>Sr#</th>
            <th>Image</th>
            <th>Name</th>
            <th>Category / SubCategory</th>
            <th>New Price</th>
            <th>Old Price</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product, index) => (
              <tr key={product._id}>
                <td>{index + 1}</td>
                <td>
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="product-image"
                  />
                </td>
                <td>{product.name}</td>
                <td>{`${product.category} / ${product.subCategory}`}</td>
                <td>{product.new_price}</td>
                <td>{product.old_price || "-"}</td>
                <td>{product.available ? "In Stock" : "Out of Stock"}</td>
                <td>
                  <button
                    className="edit-btn"
                    onClick={() => handleEdit(product._id)}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(product._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8">No products found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ViewAllProducts;


