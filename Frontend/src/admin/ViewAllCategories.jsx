import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import "./ViewAllCategories.css";

const token = localStorage.getItem("adminToken");
const API = axios.create({
  baseURL: "http://localhost:4000/api/admin",
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

const ViewAllCategories = () => {
  const [categories, setCategories] = useState([]);
  const [expandedCat, setExpandedCat] = useState(null);

  const [newCatName, setNewCatName] = useState("");
  const [newCatImage, setNewCatImage] = useState(null);

  const [editingCat, setEditingCat] = useState(null);
  const [editingCatName, setEditingCatName] = useState("");
  const [editingCatImage, setEditingCatImage] = useState(null);

  const [newSubName, setNewSubName] = useState("");
  const [newSubImage, setNewSubImage] = useState(null);

  const [editingSub, setEditingSub] = useState(null);
  const [editingSubName, setEditingSubName] = useState("");
  const [editingSubImage, setEditingSubImage] = useState(null);

  const fetchCategories = async () => {
    try {
      const { data } = await API.get("/categories/main");
      setCategories(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch categories");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const toggleSubcategories = (catId) => {
    setExpandedCat(expandedCat === catId ? null : catId);
  };

  // CATEGORY
  const addCategory = async () => {
    if (!newCatName.trim()) return toast.error("Enter category name");
      if (!newCatImage) return toast.error("Please select a category image");
    // Frontend duplicate check
    const isDuplicate = categories.some(
      (cat) => cat.name.toLowerCase() === newCatName.trim().toLowerCase()
    );
    if (isDuplicate) return toast.error("Category with this name already exists!");

    try {
      const formData = new FormData();
      formData.append("name", newCatName.trim());
      if (newCatImage) formData.append("image", newCatImage);

      await API.post("/categories", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Category added successfully");
      setNewCatName("");
      setNewCatImage(null);
      fetchCategories();
    } catch (err) {
      console.error(err);
      // Show backend error message if available
      const msg = err.response?.data?.message || "Failed to add category";
      toast.error(msg);
    }
  };

  const editCategory = (cat) => {
    setEditingCat(cat);
    setEditingCatName(cat.name);
    setEditingCatImage(null);
  };

  const updateCategory = async () => {
    try {
      const formData = new FormData();
      formData.append("name", editingCatName);
      if (editingCatImage) formData.append("image", editingCatImage);

      await API.put(`/categories/${editingCat._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Category updated");
      setEditingCat(null);
      fetchCategories();
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || "Failed to update category";
      toast.error(msg);
    }
  };

  const deleteCategory = async (id) => {
    if (!window.confirm("Are you sure to delete this category?")) return;
    try {
      await API.delete(`/categories/${id}`);
      toast.success("Category deleted");
      fetchCategories();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete category");
    }
  };

  // SUBCATEGORY
  const addSubcategory = async (catId) => {
    if (!newSubName.trim()) return toast.error("Enter subcategory name");
      if (!newSubImage) return toast.error("Please select a subcategory image");
    // Frontend duplicate check
    const parentCat = categories.find((cat) => cat._id === catId);
    const isDuplicate = parentCat?.subcategories.some(
      (sub) => sub.name.toLowerCase() === newSubName.trim().toLowerCase()
    );
    if (isDuplicate) return toast.error("Subcategory with this name already exists!");

    try {
      const formData = new FormData();
      formData.append("name", newSubName.trim());
      if (newSubImage) formData.append("image", newSubImage);

      await API.post(`/categories/${catId}/sub`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Subcategory added");
      setNewSubName("");
      setNewSubImage(null);
      fetchCategories();
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || "Failed to add subcategory";
      toast.error(msg);
    }
  };

  const editSubcategory = (catId, sub) => {
    setEditingSub({ catId, ...sub });
    setEditingSubName(sub.name);
    setEditingSubImage(null);
  };

  const updateSubcategory = async () => {
    try {
      const formData = new FormData();
      formData.append("name", editingSubName);
      if (editingSubImage) formData.append("image", editingSubImage);

      await API.put(`/categories/${editingSub.catId}/sub/${editingSub._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Subcategory updated");
      setEditingSub(null);
      fetchCategories();
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || "Failed to update subcategory";
      toast.error(msg);
    }
  };

  const deleteSubcategory = async (catId, subId) => {
    if (!window.confirm("Are you sure to delete this subcategory?")) return;
    try {
      await API.delete(`/categories/${catId}/sub/${subId}`);
      toast.success("Subcategory deleted");
      fetchCategories();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete subcategory");
    }
  };

  return (
    <div className="p-5">
      <ToastContainer />
      <h2 className="text-2xl font-bold mb-4">Manage Categories</h2>

      <table className="category-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => (
            <React.Fragment key={cat._id}>
              <tr>
                <td>{cat.name}</td>
                <td>{cat.image && <img src={cat.image} alt={cat.name} className="cat-image" />}</td>
                <td>
                  <button onClick={() => editCategory(cat)}>Edit</button>
                  <button onClick={() => deleteCategory(cat._id)}>Delete</button>
                  <button onClick={() => toggleSubcategories(cat._id)}>
                    {expandedCat === cat._id ? "Hide Subcategories" : "Manage Subcategories"}
                  </button>
                </td>
              </tr>

              {/* Edit Category */}
              {editingCat && editingCat._id === cat._id && (
                <tr>
                  <td colSpan={3}>
                    <input type="text" value={editingCatName} onChange={(e) => setEditingCatName(e.target.value)} />
                    <input type="file" onChange={(e) => setEditingCatImage(e.target.files[0])} />
                    <button onClick={updateCategory}>Save</button>
                    <button onClick={() => setEditingCat(null)}>Cancel</button>
                  </td>
                </tr>
              )}

              {/* Subcategories */}
              {expandedCat === cat._id && (
                <tr>
                  <td colSpan={3}>
                    <div className="add-subcategory">
                      <input type="text" placeholder="New subcategory" value={newSubName} onChange={(e) => setNewSubName(e.target.value)} />
                      <input type="file" onChange={(e) => setNewSubImage(e.target.files[0])} />
                      <button onClick={() => addSubcategory(cat._id)}>Add Subcategory</button>
                    </div>

                    <table className="sub-table">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Image</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cat.subcategories.map((sub) => (
                          <tr key={sub._id}>
                            <td>{sub.name}</td>
                            <td>{sub.image && <img src={sub.image} alt={sub.name} className="sub-image" />}</td>
                            <td>
                              <button onClick={() => editSubcategory(cat._id, sub)}>Edit</button>
                              <button onClick={() => deleteSubcategory(cat._id, sub._id)}>Delete</button>
                            </td>
                          </tr>
                        ))}

                        {/* Edit Subcategory */}
                        {editingSub && editingSub.catId === cat._id && (
                          <tr>
                            <td colSpan={3}>
                              <input type="text" value={editingSubName} onChange={(e) => setEditingSubName(e.target.value)} />
                              <input type="file" onChange={(e) => setEditingSubImage(e.target.files[0])} />
                              <button onClick={updateSubcategory}>Save</button>
                              <button onClick={() => setEditingSub(null)}>Cancel</button>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewAllCategories;