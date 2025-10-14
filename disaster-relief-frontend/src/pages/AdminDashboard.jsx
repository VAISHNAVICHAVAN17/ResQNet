import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const { auth } = useAuth();

  // Fetch all users
  useEffect(() => {
    fetch("http://localhost:8088/api/admin/users", {
      headers: { Authorization: `Bearer ${auth.token}` },
    })
      .then(async res => {
        const text = await res.text();
        try {
          const json = JSON.parse(text);
          setUsers(json);
          setError(null);
        } catch (err) {
          setError(
            "Failed to load users: Invalid JSON response from server." +
              (text ? " Server response: " + text : "")
          );
        }
      })
      .catch(e => setError("Network error: " + e.message));
  }, [auth.token]);

  // Update user role
  const updateRole = (userId, newRole) => {
    fetch(`http://localhost:8088/api/admin/users/${userId}/role?role=${newRole}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${auth.token}` },
    })
      .then(res => {
        if (!res.ok) throw new Error("Role update failed");
        setUsers(users.map(u => (u.id === userId ? { ...u, role: newRole } : u)));
      })
      .catch(e => setError("Role update failed: " + e.message));
  };

  // Delete user
  const deleteUser = userId => {
    if (!window.confirm("Are you sure you want to permanently delete this user?")) return;
    fetch(`http://localhost:8088/api/users/${userId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${auth.token}` },
    })
      .then(res => {
        if (!res.ok) throw new Error("Delete failed");
        setUsers(users.filter(u => u.id !== userId));
      })
      .catch(e => setError("Delete failed: " + e.message));
  };

  return (
    <div className="container mt-4">
      <h2>Admin Dashboard</h2>
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Role</th>
            <th>Change Role</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <select
                  className="form-select form-select-sm"
                  value={user.role}
                  onChange={e => updateRole(user.id, e.target.value)}
                >
                  <option value="Admin">Admin</option>
                  <option value="Volunteer">Volunteer</option>
                  <option value="Requester">Requester</option>
                  <option value="NGO">NGO</option>
                  <option value="Provider">Provider</option>
                </select>
              </td>
              <td>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => deleteUser(user.id)}
                  title="Delete user"
                >
                  delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
