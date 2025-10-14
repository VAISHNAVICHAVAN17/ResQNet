import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Navigate } from "react-router-dom";


export default function NgoDashboard() {
  const [requests, setRequests] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [selectedVolunteerId, setSelectedVolunteerId] = useState(null);
  const [dueDate, setDueDate] = useState("");                 // NEW STATE
  const [searchText, setSearchText] = useState("");
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("userRole");
  


  useEffect(() => {
    if (!token) return;
    fetch(`http://localhost:8088/api/ngo/requests`, {
      headers: { Authorization: `Bearer ${token}` },
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load requests");
        return res.json();
      })
      .then(setRequests)
      .catch(() => toast.error("Failed to load requests"));
    fetch(`http://localhost:8088/api/ngo/volunteers`, {
      headers: { Authorization: `Bearer ${token}` },
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load volunteers");
        return res.json();
      })
      .then(setVolunteers)
      .catch(() => toast.error("Failed to load volunteers"));
  }, [token]);

  if (userRole !== "NGO" || !token) {
    return <Navigate to="/login" replace />;
  }

  const assignVolunteer = (requestId) => {
    if (!selectedVolunteerId) {
      toast.warning("Please select a volunteer first");
      return;
    }
    if (!dueDate) {
      toast.warning("Please select a due date");
      return;
    }
    fetch(
      `http://localhost:8088/api/ngo/requests/${requestId}/assign?volunteerId=${selectedVolunteerId}&dueDate=${dueDate}`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      }
    )
      .then((res) => {
        if (!res.ok) throw new Error("Failed to assign volunteer");
        toast.success("Volunteer assigned successfully");
        setDueDate("");
        return fetch(`http://localhost:8088/api/ngo/requests`, {
          headers: { Authorization: `Bearer ${token}` },
          credentials: "include",
        });
      })
      .then((res) => res.json())
      .then(setRequests)
      .catch(() => toast.error("Failed to assign volunteer"));
  };

  const updateStatus = (requestId, status) => {
    fetch(
      `http://localhost:8088/api/ngo/requests/${requestId}/status?status=${status}`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      }
    )
      .then((res) => {
        if (!res.ok) throw new Error("Failed to update status");
        toast.success(`Request ${status.toLowerCase()} successfully`);
        return fetch(`http://localhost:8088/api/ngo/requests`, {
          headers: { Authorization: `Bearer ${token}` },
          credentials: "include",
        });
      })
      .then((res) => res.json())
      .then(setRequests)
      .catch(() => toast.error("Failed to update status"));
  };

  const rejectAndRemove = (requestId) => {
    fetch(`http://localhost:8088/api/ngo/requests/${requestId}/status?status=REJECTED`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      credentials: "include",
    })
      .then(() =>
        fetch(`http://localhost:8088/api/requests/${requestId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
          credentials: "include",
        })
      )
      .then(() => {
        setRequests((prev) => prev.filter((r) => r.id !== requestId));
        toast.success("Request rejected and removed!");
      })
      .catch(() => toast.error("Failed to reject/remove request"));
  };

  const filteredRequests = requests.filter((req) => {
    const lowerSearch = searchText.toLowerCase();
    return (
      (req.resourceType && req.resourceType.toLowerCase().includes(lowerSearch)) ||
      (req.location && req.location.toLowerCase().includes(lowerSearch))
    );
  });

  return (
    <div className="container mt-4">
      <h2>NGO Dashboard</h2>
      <div className="mb-3 d-flex gap-2 align-items-center">
        <label htmlFor="volunteerSelect" className="form-label mb-0">
          Select Volunteer
        </label>
        <select
          id="volunteerSelect"
          className="form-select w-auto"
          value={selectedVolunteerId || ""}
          onChange={(e) => setSelectedVolunteerId(e.target.value)}
        >
          <option value="" disabled>
            Select Volunteer
          </option>
          {volunteers.map((v) => (
            <option key={v.id} value={v.id}>
              {v.name} ({v.email})
            </option>
          ))}
        </select>
        <label htmlFor="dueDate" className="form-label mb-0 ms-3">Due Date</label>
        <input
          id="dueDate"
          type="date"
          className="form-control w-auto"
          value={dueDate}
          onChange={e => setDueDate(e.target.value)}
        />
      </div>
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Search requests by resource or location"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Requester</th>
            <th>Resource</th>
            <th>Quantity</th>
            <th>Location</th>
            <th>Status</th>
            <th>Assigned Volunteer</th>
            <th>Due Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredRequests.length === 0 ? (
            <tr>
              <td colSpan="9" className="text-center">
                No matching requests
              </td>
            </tr>
          ) : (
            filteredRequests.map((req) => (
              <tr key={req.id}>
                <td>{req.id}</td>
                <td>{req.requester?.name || "-"}</td>
                <td>{req.resourceType}</td>
                <td>{req.quantity}</td>
                <td>{req.location}</td>
                <td>{req.status}</td>
                <td>{req.assignedVolunteer ? req.assignedVolunteer.name : "Unassigned"}</td>
                <td>{req.dueDate || "-"}</td>
                <td>
                  <button
                    className="btn btn-primary btn-sm me-2"
                    disabled={!selectedVolunteerId || !dueDate}
                    onClick={() => assignVolunteer(req.id)}
                  >
                    Assign Volunteer
                  </button>
                  <button className="btn btn-success btn-sm me-2" onClick={() => updateStatus(req.id, "APPROVED")}>
                    Approve
                  </button>
                  <button className="btn btn-danger btn-sm me-2" onClick={() => updateStatus(req.id, "REJECTED")}>
                    Reject
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={() => rejectAndRemove(req.id)}>
                    Remove
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
