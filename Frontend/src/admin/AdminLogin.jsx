import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import apis from "../utils/apis";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(apis().loginUser, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result?.message || "Login failed");

      if (result?.status) {
        // Role check — sirf admin allow
        if (result.role !== "admin") {
          toast.error("Access denied. Admins only.");
          return;
        }

        localStorage.setItem("adminToken", result.token);
        localStorage.setItem("accessToken", result.token);
        localStorage.setItem("user", JSON.stringify(result.user));

        toast.success("Admin login successful!");
        navigate("/admin");
      } else {
        throw new Error(result?.message || "Login failed");
      }
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex",
      alignItems: "center", justifyContent: "center", background: "#f5f5f5"
    }}>
      <div style={{
        width: "100%", maxWidth: "400px", background: "#fff",
        padding: "2rem", borderRadius: "12px", border: "1px solid #eee"
      }}>
        <h2 style={{ textAlign: "center", marginBottom: "0.5rem" }}>Admin Login</h2>
        <p style={{ textAlign: "center", color: "#888", fontSize: "13px", marginBottom: "1.5rem" }}>
          Only admins can access
        </p>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: "12px" }}>
            <label style={{ fontSize: "13px", color: "#555", display: "block", marginBottom: "4px" }}>Email</label>
            <input
              type="email" placeholder="admin@example.com"
              value={email} onChange={(e) => setEmail(e.target.value)} required
              style={{ width: "100%", padding: "10px", borderRadius: "8px",
                border: "1px solid #ddd", fontSize: "14px", boxSizing: "border-box" }}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ fontSize: "13px", color: "#555", display: "block", marginBottom: "4px" }}>Password</label>
            <input
              type="password" placeholder="••••••••"
              value={password} onChange={(e) => setPassword(e.target.value)} required
              style={{ width: "100%", padding: "10px", borderRadius: "8px",
                border: "1px solid #ddd", fontSize: "14px", boxSizing: "border-box" }}
            />
          </div>

          <button type="submit" disabled={loading}
            style={{ width: "100%", padding: "11px",
              background: loading ? "#aaa" : "#6c63ff", color: "#fff",
              border: "none", borderRadius: "8px", fontSize: "15px", cursor: "pointer" }}>
            {loading ? "Logging in..." : "Login as Admin"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "1rem", fontSize: "13px", color: "#888" }}>
          User login? <Link to="/login" style={{ color: "#6c63ff" }}>Click here</Link>
        </p>
        <p style={{ textAlign: "center", marginTop: "0.5rem", fontSize: "13px", color: "#888" }}>
  Forgot password? <Link to="/forget/password" style={{ color: "#6c63ff" }}>Click here</Link>
</p>
      </div>
    </div>
  );
};

export default AdminLogin;