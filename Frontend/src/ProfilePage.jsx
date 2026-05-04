import React, { useState } from "react";
import axios from "axios";
import "./Profile.css";
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const storedUser = JSON.parse(localStorage.getItem("user")) || {};
  const token = localStorage.getItem("accessToken");

  const presetAvatars = [
 "https://cdn-icons-png.flaticon.com/512/194/194938.png",
    "https://cdn-icons-png.flaticon.com/512/194/194935.png",
    "https://cdn-icons-png.flaticon.com/512/3006/3006878.png",
    "https://cdn-icons-png.flaticon.com/512/1999/1999625.png",
    "https://cdn-icons-png.flaticon.com/512/2922/2922506.png",
    "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
    "https://cdn-icons-png.flaticon.com/512/3135/3135789.png",
    "https://cdn-icons-png.flaticon.com/512/3135/3135768.png",
    "https://cdn-icons-png.flaticon.com/512/3135/3135823.png",
];
  const [formData, setFormData] = useState({
    name: storedUser.name || "",
    email: storedUser.email || "",
    address: storedUser.address || "",
    city: storedUser.city || "",
    postalCode: storedUser.postalCode || "",
    phone: storedUser.phone || "",
    note: storedUser.note || "",
    country: storedUser.country || "Pakistan",
    avatar: storedUser.avatar || "",
    avatarPreview: "",
  });

  const [loading, setLoading] = useState(false);

  // Profile Update Handler
  const handleUpdate = async () => {
    if (!token || token === "undefined" || token === "null") {
      toast.error("Please login first");
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();
      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("address", formData.address);
      data.append("city", formData.city);
      data.append("postalCode", formData.postalCode);
      data.append("phone", formData.phone);
      data.append("note", formData.note);
      data.append("country", formData.country);

      if (formData.avatar instanceof File) {
  data.append("avatar", formData.avatar);
} else if (typeof formData.avatar === "string" && formData.avatar.startsWith("http")) {
  data.append("avatarUrl", formData.avatar); // preset avatar URL
}

      const res = await axios.put("http://localhost:4000/user/profile", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Profile updated successfully!");

      // FIX 1: Merge existing data with backend response to avoid undefined fields
      const updatedUser = {
        ...formData,
        ...res.data.user,
        avatar: res.data.user?.avatar || formData.avatar,
        avatarPreview: "", // clear preview after successful upload
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));
      setFormData(updatedUser);
    window.dispatchEvent(new Event("storage"));
    } catch (err) {
      if (err.response) {
        if (err.response.status === 401) {
          toast.error("Session expired. Please login again.");
          localStorage.removeItem("accessToken");
          localStorage.removeItem("user");
        } else {
          toast.error(err.response?.data?.message || "Failed to update profile");
        }
      } else if (err.request) {
        toast.error("Network error. Please check your connection.");
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  // Input change handler
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // FIX 2: Avatar upload with preview
  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size should be less than 5MB");
        return;
      }
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }

      const previewUrl = URL.createObjectURL(file); // instant preview
      setFormData({ ...formData, avatar: file, avatarPreview: previewUrl });
    }
  };

  // Determine avatar src
  const avatarSrc = formData.avatarPreview || 
    (formData.avatar && !(formData.avatar instanceof File) ? formData.avatar : null);

  return (
    <div className="profile-container">
      <h2>My Profile</h2>

      {/* FIX 3: Avatar Section with preview support */}
     {/* Avatar Section */}
<div className="avatar-section">
  {avatarSrc ? (
    <img src={avatarSrc} alt="User Avatar" className="avatar-img" />
  ) : (
    <div className="default-avatar">
      {formData.name ? formData.name.charAt(0).toUpperCase() : "U"}
    </div>
  )}
  <input type="file" accept="image/*" onChange={handleAvatarUpload} />

  {/* Preset avatars */}
  <p style={{ marginTop: "12px", fontSize: "13px", color: "#888" }}>
    Choose a preset avatar:
  </p>
  <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center", marginTop: "8px" }}>
    {presetAvatars.map((url, idx) => (
      <img
        key={idx}
        src={url}
        alt={`avatar-${idx}`}
        onClick={() => {
          setFormData({ ...formData, avatar: url, avatarPreview: url });
        }}
        style={{
          width: "52px",
          height: "52px",
          borderRadius: "50%",
          cursor: "pointer",
          border: formData.avatarPreview === url ? "3px solid #6c63ff" : "2px solid #ddd",
          transition: "border 0.2s",
          background: "#f5f5f5",
        }}
      />
    ))}
  </div>
</div>

      {/* Form Fields */}
      <input
        type="text"
        name="name"
        placeholder="Full Name"
        value={formData.name}
        onChange={handleChange}
        required
      />

      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        readOnly
      />

      <input
        type="text"
        name="address"
        placeholder="Address"
        value={formData.address}
        onChange={handleChange}
      />

      <div className="row">
        <input
          type="text"
          name="city"
          placeholder="City"
          value={formData.city}
          onChange={handleChange}
        />
        <input
          type="text"
          name="country"
          placeholder="Country"
          value={formData.country}
          readOnly
        />
      </div>

      <div className="row">
        <input
          type="text"
          name="postalCode"
          placeholder="Postal Code"
          value={formData.postalCode}
          onChange={handleChange}
        />
        <input
          type="tel"
          name="phone"
          placeholder="03XX-XXXXXXX"
          value={formData.phone}
          onChange={(e) => {
            let val = e.target.value.replace(/\D/g, "");
            if (!val.startsWith("03")) val = "03" + val.replace(/^0*3?/, "");
            if (val.length > 11) val = val.slice(0, 11);
            if (val.length > 4) val = val.slice(0, 4) + "-" + val.slice(4);
            setFormData({ ...formData, phone: val });
          }}
          maxLength={12}
        />
      </div>

      <textarea
        name="note"
        placeholder="Additional Note (Optional)"
        value={formData.note}
        onChange={handleChange}
      ></textarea>

      <button
        className="update-profile-btn"
        onClick={handleUpdate}
        disabled={loading}
      >
        {loading ? "Updating..." : "Update Profile"}
      </button>
    </div>
  );
};

export default ProfilePage;