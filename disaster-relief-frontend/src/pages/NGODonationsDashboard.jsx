import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

export default function NGODonationsDashboard() {
  const [donations, setDonations] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [assignment, setAssignment] = useState({}); // { [donationId]: { volunteerId, dueDate } }

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch("http://localhost:8088/api/ngo/donations", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch donations");
        return res.json();
      })
      .then(data => setDonations(data))
      .catch(() => toast.error("Failed to load donations."));

    fetch("http://localhost:8088/api/ngo/volunteers", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch volunteers");
        return res.json();
      })
      .then(data => setVolunteers(data))
      .catch(() => toast.error("Failed to load volunteers."));
  }, [token]);

  // Volunteer assignment logic
  const handleAssign = (donationId) => {
    const { volunteerId, dueDate } = assignment[donationId] || {};
    if (!volunteerId || !dueDate) {
      toast.error("Select volunteer and due date.");
      return;
    }
    fetch(`http://localhost:8088/api/ngo/donations/${donationId}/assign?volunteerId=${volunteerId}&dueDate=${dueDate}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error("Assignment failed");
        toast.success("Volunteer assigned!");
        setDonations(donations.map(d =>
          d.id === donationId
            ? { ...d, assignedVolunteer: volunteers.find(v => v.id === Number(volunteerId)), dueDate, status: 'ASSIGNED' }
            : d
        ));
      })
      .catch(() => toast.error("Failed to assign volunteer."));
  };

  // Approve and Reject logic: sends status via query param (not JSON)
  const handleApprove = (donationId) => {
    fetch(`http://localhost:8088/api/ngo/donations/${donationId}/status?status=APPROVED`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error();
        toast.success("Donation approved!");
        setDonations(ds => ds.map(d =>
          d.id === donationId ? { ...d, status: "APPROVED" } : d
        ));
      })
      .catch(() => toast.error("Failed to approve donation"));
  };

  const handleReject = (donationId) => {
    fetch(`http://localhost:8088/api/ngo/donations/${donationId}/status?status=REJECTED`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error();
        toast.info("Donation rejected!");
        setDonations(ds => ds.map(d =>
          d.id === donationId ? { ...d, status: "REJECTED" } : d
        ));
      })
      .catch(() => toast.error("Failed to reject donation"));
  };

  return (
    <div className="container mt-4">
      <h2>Incoming Donations</h2>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Provider</th>
            <th>Resource</th>
            <th>Quantity</th>
            <th>Status</th>
            <th>Volunteer</th>
            <th>Due Date</th>
            <th>Assign Volunteer / Actions</th>
          </tr>
        </thead>
        <tbody>
          {donations.map(donation =>
            <tr key={donation.id}>
              <td>{donation.provider?.name || "-"}</td>
              <td>{donation.resourceType}</td>
              <td>{donation.quantity}</td>
              <td>{donation.status}</td>
              <td>{donation.assignedVolunteer?.name || "-"}</td>
              <td>{donation.dueDate || "-"}</td>
              <td style={{ minWidth: 320 }}>
                <select
                  value={assignment[donation.id]?.volunteerId || ""}
                  onChange={e =>
                    setAssignment(a => ({
                      ...a, [donation.id]: { ...a[donation.id], volunteerId: e.target.value }
                    }))
                  }
                  style={{ marginRight: 6 }}
                >
                  <option value="">Select Volunteer</option>
                  {volunteers.map(v => (
                    <option value={v.id} key={v.id}>{v.name}</option>
                  ))}
                </select>
                <input
                  type="date"
                  value={assignment[donation.id]?.dueDate || ""}
                  onChange={e =>
                    setAssignment(a => ({
                      ...a, [donation.id]: { ...a[donation.id], dueDate: e.target.value }
                    }))
                  }
                  style={{ marginRight: 6 }}
                />
                <button
                  className="btn btn-primary btn-sm me-2"
                  onClick={() => handleAssign(donation.id)}
                >
                  Assign
                </button>
                <button
                  className="btn btn-primary btn-sm me-2"
                  style={{ background: "#41d671", border: "none" }}
                  disabled={donation.status === "APPROVED"}
                  onClick={() => handleApprove(donation.id)}
                >
                  Approve
                </button>
                <button
                  className="btn btn-primary btn-sm"
                  style={{ background: "#ee554c", border: "none" }}
                  disabled={donation.status === "REJECTED"}
                  onClick={() => handleReject(donation.id)}
                >
                  Reject
                </button>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
