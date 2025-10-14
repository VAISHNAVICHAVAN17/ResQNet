import React, { useState } from "react";

function UserForm({ onUserAdded }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8088/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, role }),
      });
      if (response.ok) {
        const savedUser = await response.json();
        onUserAdded(savedUser);
        setName("");
        setEmail("");
        setRole("");
      } else {
        console.error("Error adding user");
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="user-form">
      <input
        type="text"
        placeholder="Enter user name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        type="email"
        placeholder="Enter email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <select value={role} onChange={(e) => setRole(e.target.value)} required>
        <option value="">Select Role</option>
        <option value="NGO">NGO</option>
        <option value="Volunteer">Volunteer</option>
        <option value="Requester">Requester</option>
      </select>
      <button type="submit">Add User</button>
    </form>
  );
}

export default UserForm;
