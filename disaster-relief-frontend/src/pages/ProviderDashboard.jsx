import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";


export default function ProviderDashboard() {
  const [donations, setDonations] = useState([]);
  const [ngos, setNgos] = useState([]);
  const [form, setForm] = useState({ ngoId: "", resourceType: "", quantity: 1 });

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      toast.error("Authentication token missing. Please login again.");
      setNgos([]);
      setDonations([]);
      return;
    }

    fetch("http://localhost:8088/api/ngo/all", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) {
          throw new Error(`Failed to fetch NGOs: ${res.status}`);
        }
        return res.json();
      })
      .then(data => setNgos(data))
      .catch(() => {
        toast.error("Failed to load NGOs. Please login again.");
        setNgos([]);
      });

    fetch("http://localhost:8088/api/provider/donations", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) {
          throw new Error(`Failed to fetch donations: ${res.status}`);
        }
        return res.json();
      })
      .then(data => setDonations(data))
      .catch(() => {
        toast.error("Failed to load donations. Please login again.");
        setDonations([]);
      });
  }, [token]);

  const submitDonation = (e) => {
    e.preventDefault();
    if (!token) {
      toast.error("Authentication token missing. Please login again.");
      return;
    }

    fetch("http://localhost:8088/api/provider/donations", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({
  ngoId: form.ngoId,  // ← Send as separate field
  resourceType: form.resourceType,
  quantity: Number(form.quantity)
})
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to submit donation");
        return res.json();
      })
      .then(donation => {
        toast.success("Donation submitted!");
        setDonations(donations.concat(donation));
        setForm({ ngoId: "", resourceType: "", quantity: 1 });
      })
      .catch(() => toast.error("Failed to donate"));
  };

  return (
    <div className="container mt-4">
      <h2>Provider Dashboard</h2>
      <form className="row g-2 mb-4" onSubmit={submitDonation}>
        <div className="col">
          <select
            className="form-select"
            value={form.ngoId}
            required
            onChange={(e) => setForm(f => ({ ...f, ngoId: e.target.value }))}
          >
            <option value="">Select NGO</option>
            {ngos.map(ngo => (
              <option key={ngo.id} value={ngo.id}>
                {ngo.orgName}
              </option>
            ))}
          </select>
        </div>
        <div className="col">
          <input
            className="form-control"
            placeholder="Resource"
            value={form.resourceType}
            required
            onChange={(e) => setForm(f => ({ ...f, resourceType: e.target.value }))}
          />
        </div>
        <div className="col">
          <input
            className="form-control"
            type="number"
            min="1"
            placeholder="Qty"
            value={form.quantity}
            required
            onChange={(e) => setForm(f => ({ ...f, quantity: e.target.value }))}
          />
        </div>
        <div className="col">
          <button className="btn btn-primary" type="submit">Donate</button>
        </div>
      </form>
      <h5>Your Donations</h5>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>NGO</th>
            <th>Resource</th>
            <th>Quantity</th>
            <th>Status</th>
            <th>Volunteer</th>
            <th>Due Date</th>
          </tr>
        </thead>
        <tbody>
          {donations.map(d => (
            <tr key={d.id}>
              <td>{d.ngo?.orgName || "-"}</td>
              <td>{d.resourceType}</td>
              <td>{d.quantity}</td>
              <td>{d.status}</td>
              <td>{d.assignedVolunteer?.name || "-"}</td>
              <td>{d.dueDate || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
