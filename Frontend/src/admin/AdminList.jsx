import React, { useEffect, useState } from "react";
import apis from "../utils/apis";

const AdminList = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentUserId, setCurrentUserId] = useState("");

  useEffect(() => {
    // Logged-in admin ki ID nikalo token se
    const token = localStorage.getItem("adminToken");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setCurrentUserId(payload.id);
      } catch (err) {
        console.error("Error parsing token:", err);
      }
    }
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(apis().getAllAdmins, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!data.status) throw new Error(data.message || "Failed to fetch admins");
      setAdmins(data.admins);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, email) => {
    if (!window.confirm(`Sure delete "${email}"?`)) return;

    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(apis().deleteAdminById(id), {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!data.status) throw new Error(data.message || "Delete failed");

      alert(data.message);
      setAdmins((prev) => prev.filter((a) => a._id !== id));
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  if (loading) return <p>Loading admins...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  return (
    <div style={{ padding: "30px" }}>
      <h1>All Admins ({admins.length})</h1>

      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
        <thead style={{ background: "#f1f5f9" }}>
          <tr>
            <th style={th}>#</th>
            <th style={th}>Avatar</th>
            <th style={th}>Name</th>
            <th style={th}>Email</th>
            <th style={th}>Role</th>
            <th style={th}>Joined On</th>
            <th style={th}>Action</th>
          </tr>
        </thead>
        <tbody>
          {admins.map((a, idx) => {
            const isSelf = a._id === currentUserId;
            return (
              <tr key={a._id} style={{ borderBottom: "1px solid #e2e8f0" }}>
                <td style={td}>{idx + 1}</td>
                <td style={td}>
                  {a.avatar ? (
                    <img
                      src={a.avatar}
                      alt={a.name}
                      style={{ width: 40, height: 40, borderRadius: "50%" }}
                    />
                  ) : (
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        background: "#cbd5e1",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700,
                      }}
                    >
                      {a.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </td>
                <td style={td}>
                  {a.name} {isSelf && <small style={{ color: "#16a34a" }}>(You)</small>}
                </td>
                <td style={td}>{a.email}</td>
                <td style={td}>
                  <span
                    style={{
                      background: "#dbeafe",
                      color: "#1d4ed8",
                      padding: "4px 10px",
                      borderRadius: "6px",
                      fontSize: "12px",
                      fontWeight: 600,
                    }}
                  >
                    {a.role}
                  </span>
                </td>
                <td style={td}>
                  {a.createdAt ? new Date(a.createdAt).toLocaleDateString() : "—"}
                </td>
                <td style={td}>
                  {isSelf ? (
                    <span style={{ color: "#94a3b8", fontSize: "13px" }}>—</span>
                  ) : (
                    <button
                      onClick={() => handleDelete(a._id, a.email)}
                      style={{
                        background: "#ef4444",
                        color: "white",
                        border: "none",
                        padding: "6px 14px",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontWeight: 600,
                      }}
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}           
    

const th = { padding: "12px", textAlign: "left", fontWeight: 700 };
const td = { padding: "12px" };

export default AdminList;