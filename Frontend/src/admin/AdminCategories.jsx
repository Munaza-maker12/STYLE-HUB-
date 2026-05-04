import React, { useEffect, useState } from "react";
import apis from "../utils/apis";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./AdminCategories.css";

const AdminCategories = () => {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");

  const [catName, setCatName] = useState("");
  const [catImage, setCatImage] = useState(null);
  const [subs, setSubs] = useState([""]);

  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editImage, setEditImage] = useState(null);
  const [editSubs, setEditSubs] = useState([""]);
  const [saving, setSaving] = useState(false);

  const getToken = () => localStorage.getItem("adminToken") || "";

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch(apis().getCategories, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) throw new Error("Failed to load categories");
      const data = await res.json();
      setCategories(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const addSubField = () => setSubs((p) => [...p, ""]);
  const removeSubField = (i) => setSubs((p) => p.filter((_, idx) => idx !== i));
  const updateSubVal = (i, val) => setSubs((p) => p.map((s, idx) => (idx === i ? val : s)));

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!catName.trim()) return toast.error("Category name required");
    if (!catImage) return toast.error("Please select a category image");

    const isDuplicateCat = categories.some(
      (cat) => cat.name.toLowerCase() === catName.trim().toLowerCase()
    );
    if (isDuplicateCat) return toast.error("Category with this name already exists!");

    const filteredSubs = subs.filter(Boolean).map((s) => s.trim());
    const uniqueSubs = new Set(filteredSubs.map((s) => s.toLowerCase()));
    if (uniqueSubs.size !== filteredSubs.length)
      return toast.error("Duplicate subcategory names found!");

    try {
      setSaving(true);

      const formData = new FormData();
      formData.append("name", catName.trim());
      formData.append("image", catImage);
      formData.append(
        "subcategories",
        JSON.stringify(filteredSubs.map((name) => ({ name })))
      );

      const res = await fetch(apis().addCategory, {
        method: "POST",
        headers: { Authorization: `Bearer ${getToken()}` },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to add category");

      toast.success("Category added!");
      setCatName("");
      setCatImage(null);
      setSubs([""]);
      await fetchCategories();
    } catch (e) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (cat) => {
    setEditId(cat._id);
    setEditName(cat.name || "");
    setEditImage(null);
    setEditSubs(
      cat.subcategories?.length > 0
        ? cat.subcategories.map((s) => s.name)
        : [""]
    );
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditName("");
    setEditImage(null);
    setEditSubs([""]);
  };

  const addEditSub = () => setEditSubs((p) => [...p, ""]);
  const removeEditSub = (i) => setEditSubs((p) => p.filter((_, idx) => idx !== i));
  const updateEditSubVal = (i, val) =>
    setEditSubs((p) => p.map((s, idx) => (idx === i ? val : s)));

  const saveEdit = async () => {
    if (!editName.trim()) return toast.error("Category name required");

    const isDuplicateCat = categories.some(
      (cat) =>
        cat._id !== editId &&
        cat.name.toLowerCase() === editName.trim().toLowerCase()
    );
    if (isDuplicateCat) return toast.error("Category with this name already exists!");

    const filteredSubs = editSubs.filter(Boolean).map((s) => s.trim());
    const uniqueSubs = new Set(filteredSubs.map((s) => s.toLowerCase()));
    if (uniqueSubs.size !== filteredSubs.length)
      return toast.error("Duplicate subcategory names found!");

    try {
      setSaving(true);

      const formData = new FormData();
      formData.append("name", editName.trim());
      if (editImage) formData.append("image", editImage); // optional on edit
      formData.append(
        "subcategories",
        JSON.stringify(filteredSubs.map((name) => ({ name })))
      );

      const res = await fetch(apis().updateCategory(editId), {
        method: "PUT",
        headers: { Authorization: `Bearer ${getToken()}` },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update");

      toast.success("Category updated");
      cancelEdit();
      await fetchCategories();
    } catch (e) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category?")) return;
    try {
      const res = await fetch(apis().deleteCategory(id), {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete");
      toast.success("Category deleted");
      setCategories((p) => p.filter((c) => c._id !== id));
    } catch (e) {
      toast.error(e.message);
    }
  };

  if (loading) return <div className="cat-loading">Loading categories…</div>;
  if (error) return <div className="cat-error">Error: {error}</div>;

  return (
    <div className="cat-page">
      <header className="cat-header">
        <h2>Manage Categories</h2>
      </header>

      {/* ADD CATEGORY */}
      <section className="card">
        <h3>Add Category</h3>
        <form onSubmit={handleAdd} className="cat-form">
          <div className="form-row">
            <label>Category Name</label>
            <input
              type="text"
              value={catName}
              onChange={(e) => setCatName(e.target.value)}
              placeholder="e.g., Men"
              required
            />
          </div>

          {/* ✅ Image input */}
          <div className="form-row">
            <label>Category Image *</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setCatImage(e.target.files[0])}
            />
            {catImage && (
              <img
                src={URL.createObjectURL(catImage)}
                alt="preview"
                style={{ width: 80, height: 80, objectFit: "cover", marginTop: 8, borderRadius: 6 }}
              />
            )}
          </div>

          <div className="form-row">
            <label>Subcategories</label>
            <div className="sub-list">
              {subs.map((s, idx) => (
                <div className="sub-item" key={idx}>
                  <input
                    type="text"
                    value={s}
                    onChange={(e) => updateSubVal(idx, e.target.value)}
                    placeholder={`Subcategory #${idx + 1}`}
                  />
                  {subs.length > 1 && (
                    <button
                      type="button"
                      className="btn btn-light"
                      onClick={() => removeSubField(idx)}
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button type="button" className="btn btn-outline" onClick={addSubField}>
                + Add Subcategory
              </button>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? "Saving..." : "Save Category"}
            </button>
          </div>
        </form>
      </section>

      {/* ALL CATEGORIES */}
      <section className="card">
        <h3>All Categories</h3>
        <div className="table-wrap">
          <table className="cat-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Subcategories</th>
                <th style={{ width: 160 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => {
                const isEditing = editId === cat._id;
                return (
                  <tr key={cat._id}>
                    {/* Image column */}
                    <td>
                      {!isEditing ? (
                        cat.image ? (
                          <img
                            src={cat.image}
                            alt={cat.name}
                            style={{ width: 50, height: 50, objectFit: "cover", borderRadius: 6 }}
                          />
                        ) : (
                          <span className="muted">No image</span>
                        )
                      ) : (
                        <div>
                          {cat.image && !editImage && (
                            <img
                              src={cat.image}
                              alt="current"
                              style={{ width: 50, height: 50, objectFit: "cover", borderRadius: 6, marginBottom: 4 }}
                            />
                          )}
                          {editImage && (
                            <img
                              src={URL.createObjectURL(editImage)}
                              alt="new"
                              style={{ width: 50, height: 50, objectFit: "cover", borderRadius: 6, marginBottom: 4 }}
                            />
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setEditImage(e.target.files[0])}
                          />
                        </div>
                      )}
                    </td>

                    {/* Name column */}
                    <td>
                      {!isEditing ? (
                        <span className="cat-name">{cat.name}</span>
                      ) : (
                        <input
                          className="edit-input"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          placeholder="Category name"
                        />
                      )}
                    </td>

                    {/* Subcategories column */}
                    <td>
                      {!isEditing ? (
                        <div className="badges">
                          {(cat.subcategories || []).map((s) => (
                            <span className="badge" key={s._id || s.name}>
                              {s.name}
                            </span>
                          ))}
                          {(!cat.subcategories || cat.subcategories.length === 0) && (
                            <span className="muted">—</span>
                          )}
                        </div>
                      ) : (
                        <div className="sub-list">
                          {editSubs.map((s, idx) => (
                            <div className="sub-item" key={idx}>
                              <input
                                className="edit-input"
                                value={s}
                                onChange={(e) => updateEditSubVal(idx, e.target.value)}
                                placeholder={`Subcategory #${idx + 1}`}
                              />
                              {editSubs.length > 1 && (
                                <button
                                  type="button"
                                  className="btn btn-light"
                                  onClick={() => removeEditSub(idx)}
                                >
                                  Remove
                                </button>
                              )}
                            </div>
                          ))}
                          <button
                            type="button"
                            className="btn btn-outline"
                            onClick={addEditSub}
                          >
                            + Add Subcategory
                          </button>
                        </div>
                      )}
                    </td>

                    {/* Actions column */}
                    <td className="actions">
                      {!isEditing ? (
                        <>
                          <button className="btn btn-sm" onClick={() => startEdit(cat)}>
                            Edit
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDelete(cat._id)}
                          >
                            Delete
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={saveEdit}
                            disabled={saving}
                          >
                            {saving ? "Saving..." : "Save"}
                          </button>
                          <button
                            className="btn btn-sm btn-light"
                            onClick={cancelEdit}
                          >
                            Cancel
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
              {categories.length === 0 && (
                <tr>
                  <td colSpan={4} className="muted" style={{ textAlign: "center" }}>
                    No categories yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <ToastContainer />
    </div>
  );
};

export default AdminCategories;