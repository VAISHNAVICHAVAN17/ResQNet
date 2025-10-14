import React, { useState, useEffect } from "react";
import UserList from "../components/UserList";
import UserForm from "../components/UserForm";

function UsersPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8088/api/users")
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(() => setUsers([]));
  }, []);

  const handleUserAdded = (newUser) => {
    setUsers(prev => [...prev, newUser]);
  };

  return (
    <div style={{ maxWidth: "700px", margin: "0 auto" }}>
      <h2 style={{ margin: "20px 0", color: "#0077b6" }}>Users Management</h2>
      <UserForm onUserAdded={handleUserAdded} />
      <UserList users={users} />
    </div>
  );
}

export default UsersPage;
