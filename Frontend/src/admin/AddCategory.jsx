import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import "./AddCategory.css";

const API = "http://localhost:4000/api/admin/categories";

const AddCategory = () => {
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const [subName, setSubName] = useState("");
  const [subImage, setSubImage] = useState(null);
  const [existingCategories, setExistingCategories] = useState([]);
  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(API, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setExistingCategories(res.data);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };
    fetchCategories();
  }, []);

  const addSubcategory = () => {
    if (!subName.trim()) return toast.error("Enter subcategory name");
    // ✅ Image must
    if (!subImage) return toast.error("Please select a subcategory image");

    const isDuplicate = subcategories.some(
      (sub) => sub.name.toLowerCase() === subName.trim().toLowerCase()
    );
    if (isDuplicate) return toast.error("Subcategory with this name already added!");

    setSubcategories([...subcategories, { name: subName.trim(), image: subImage }]);
    setSubName("");
    setSubImage(null);
  };

  const removeSubcategory = (index) => {
    const updated = [...subcategories];
    updated.splice(index, 1);
    setSubcategories(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Category name is required");
    // ✅ Image must
    if (!image) return toast.error("Please select a category image");

    const isDuplicateCat = existingCategories.some(
      (cat) => cat.name.toLowerCase() === name.trim().toLowerCase()
    );
    if (isDuplicateCat) return toast.error("Category with this name already exists!");

    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("image", image);

      const res = await axios.post(`${API}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      const catId = res.data.category._id;

      for (let sub of subcategories) {
        const subForm = new FormData();
        subForm.append("name", sub.name);
        subForm.append("image", sub.image);

        await axios.post(`${API}/${catId}/sub`, subForm, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
      }

      toast.success("Category and subcategories added successfully!");
      setName("");
      setImage(null);
      setSubcategories([]);
      setExistingCategories((prev) => [...prev, res.data.category]);
    } catch (error) {
      console.error("AxiosError", error);
      toast.error(error.response?.data?.message || "Failed to add category");
    }
  };

  return (
    <div className="add-cat-container">
      <ToastContainer />
      <h2>Add New Category</h2>
      <form onSubmit={handleSubmit} className="add-cat-form">

        <div className="form-group">
          <label>Category Name: *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter category name"
            required
          />
        </div>

        <div className="form-group">
          <label>Category Image: *</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />
          {/* ✅ Preview */}
          {image && (
            <img
              src={URL.createObjectURL(image)}
              alt="preview"
              style={{ width: 80, height: 80, objectFit: "cover", marginTop: 8, borderRadius: 6 }}
            />
          )}
        </div>

        <div className="subcat-section">
          <h3>Add Subcategories</h3>
          <div className="subcat-inputs">
            <input
              type="text"
              value={subName}
              onChange={(e) => setSubName(e.target.value)}
              placeholder="Subcategory name"
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setSubImage(e.target.files[0])}
            />
            {/* ✅ Sub image preview */}
            {subImage && (
              <img
                src={URL.createObjectURL(subImage)}
                alt="sub-preview"
                style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 6 }}
              />
            )}
            <button type="button" onClick={addSubcategory}>Add Subcategory</button>
          </div>

          {subcategories.length > 0 && (
            <ul className="subcat-list">
              {subcategories.map((sub, index) => (
                <li key={index}>
                  {sub.image && (
                    <img
                      src={URL.createObjectURL(sub.image)}
                      alt={sub.name}
                      style={{ width: 40, height: 40, objectFit: "cover", borderRadius: 4, marginRight: 8 }}
                    />
                  )}
                  {sub.name}
                  <button type="button" onClick={() => removeSubcategory(index)}>Remove</button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <button type="submit" className="submit-btn">Add Category</button>
      </form>
    </div>
  );
};

export default AddCategory;