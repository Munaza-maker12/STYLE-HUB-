import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./EditProduct.css";

const EditProduct = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: "",
    oldPrice: "",
    newPrice: "",
    description: "",
    images: [],
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/api/admin/products/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` }
        });
        const data = res.data;
        setFormData({
          name: data.name,
          oldPrice: data.old_price,
          newPrice: data.new_price,
          description: data.description.join("\n"),
          images: data.images || [],
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching product:", error);
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Price validations
    if (!formData.newPrice || Number(formData.newPrice) <= 0) {
      return alert("New price must be greater than 0!");
    }
    if (Number(formData.newPrice) > Number(formData.oldPrice)) {
      return alert("New price cannot be greater than old price!");
    }

    setUpdating(true);
    try {
      const updatedData = new FormData();
      updatedData.append("name", formData.name);
      updatedData.append("old_price", formData.oldPrice);
      updatedData.append("new_price", formData.newPrice);
      updatedData.append("description", formData.description);

      formData.images.forEach((img) => {
        if (img instanceof File) {
          updatedData.append("images", img);
        }
      });

      const existingImages = formData.images.filter(img => typeof img === "string");
      updatedData.append("existingImages", JSON.stringify(existingImages));

      await axios.put(`http://localhost:4000/api/admin/products/${id}`, updatedData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`
        },
      });

      alert("Product updated successfully!");
    } catch (error) {
      console.error("Error updating product:", error);
    } finally {
      setUpdating(false);
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...files],
    }));
  };

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  if (loading) return <p>Loading product...</p>;

  return (
    <div className="edit-product">
      <h2>Edit Product</h2>
      <form onSubmit={handleSubmit}>
        <label>Name:</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />

        {/* Old Price - read only */}
        <label>Old Price (Original MRP):</label>
        <input
          type="number"
          value={formData.oldPrice}
          readOnly
          style={{ backgroundColor: "#f0f0f0", cursor: "not-allowed", opacity: 0.7 }}
        />

        <label>New Price:</label>
        <input
          type="number"
          value={formData.newPrice}
          min="1"
          onChange={(e) => setFormData({ ...formData, newPrice: e.target.value })}
        />

        <label>Description:</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />

        <label>Images:</label>
        <div className="image-preview">
          {formData.images.map((img, index) => (
            <div key={index} className="image-container">
              <img
                src={img instanceof File ? URL.createObjectURL(img) : img}
                alt={`Product ${index}`}
              />
              <span className="remove-image" onClick={() => removeImage(index)}>×</span>
            </div>
          ))}
        </div>
        <input type="file" multiple onChange={handleImageChange} />

        <button type="submit" disabled={updating}>
          {updating ? <span className="spinner"></span> : "Update"}
        </button>
      </form>
    </div>
  );
};

export default EditProduct;