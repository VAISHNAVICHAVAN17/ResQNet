import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Navigate } from "react-router-dom";

export default function RequesterDashboard() {
  const [requests, setRequests] = useState([]);
  const [newRequest, setNewRequest] = useState({
    resourceType: "",
    quantity: 1
  });
  const [searchText, setSearchText] = useState("");

  const requesterId = parseInt(localStorage.getItem("userId"), 10);
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("userRole");

  const fetchRequests = () => {
    if (!token) return;
    fetch(`http://localhost:8088/api/requester/requests?requesterId=${requesterId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      credentials: "include"
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load requests");
        return res.json();
      })
      .then(setRequests)
      .catch(() => toast.error("Failed to load requests"));
  };

  useEffect(() => {
    fetchRequests();
  }, [token]);

  const handleCreate = () => {
    if (!newRequest.resourceType || newRequest.quantity < 1) {
      toast.error("Please fill out all fields with valid values.");
      return;
    }
    fetch(`http://localhost:8088/api/requester/requests?requesterId=${requesterId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      credentials: "include",
      body: JSON.stringify(newRequest)
    })
      .then((res) => {
        if (!res.ok) throw new Error("Creation failed");
        return res.json();
      })
      .then(() => {
        toast.success("Request created");
        setNewRequest({ resourceType: "", quantity: 1 });
        fetchRequests();
      })
      .catch(() => toast.error("Failed to create request"));
  };

  if (userRole !== "Requester" || !requesterId || !token) {
    return <Navigate to="/login" replace />;
  }

  const filteredRequests = requests.filter((r) => {
    const lowerSearch = searchText.toLowerCase();
    return (
      (r.resourceType && r.resourceType.toLowerCase().includes(lowerSearch)) ||
      (r.location && r.location.toLowerCase().includes(lowerSearch))
    );
  });

  return (
    <div className="container mt-4">
      <h2>Requester Dashboard</h2>
      <div className="mb-4">
        <h4>New Request</h4>
        <input
          type="text"
          placeholder="Resource Type"
          className="form-control mb-2"
          value={newRequest.resourceType}
          onChange={(e) => setNewRequest({ ...newRequest, resourceType: e.target.value })}
        />
        <input
          type="number"
          min="1"
          placeholder="Quantity"
          className="form-control mb-2"
          value={newRequest.quantity}
          onChange={(e) => setNewRequest({ ...newRequest, quantity: Number(e.target.value) })}
        />
        <button className="btn btn-primary" onClick={handleCreate}>
          Submit Request
        </button>
      </div>

      <input
        type="text"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        className="form-control mb-3"
        placeholder="Search your requests"
      />

      <h4>Your Requests</h4>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Resource</th>
            <th>Quantity</th>
            <th>Location</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredRequests.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center">No matching requests.</td>
            </tr>
          ) : (
            filteredRequests.map((r) => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.resourceType}</td>
                <td>{r.quantity}</td>
                <td>{r.location}</td>
                <td>{r.status}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
