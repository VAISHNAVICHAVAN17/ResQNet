import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Navigate } from "react-router-dom";
import VolunteerTrackMap from "../components/VolunteerTrackMap";

export default function VolunteerDashboard() {
  const [assignments, setAssignments] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [trackId, setTrackId] = useState(null);

  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("userRole");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!token) return;
    Promise.all([
      fetch(`http://localhost:8088/api/volunteer/assignments?volunteerId=${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => res.ok ? res.json() : []),
      fetch(`http://localhost:8088/api/volunteer/donations?volunteerId=${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => res.ok ? res.json() : [])
    ])
      .then(([requests, donations]) => {
        const reqData = (requests || []).map(a => ({
          type: "request",
          id: a.requestId,
          name: a.requesterName || "-",
          ngoName: a.ngoName || "-",
          source: a.ngoAddress || "-",
          destination: a.requesterAddress || "-",
          resourceType: a.resourceType,
          quantity: a.quantity,
          status: a.status,
          dueDate: a.dueDate,
          latSource: a.ngoLat,
          lngSource: a.ngoLng,
          latDestination: a.requesterLat,
          lngDestination: a.requesterLng
        }));
        const donData = (donations || []).map(a => ({
          type: "provider",
          id: a.id,
          name: a.providerName || "-",
          ngoName: a.ngoName || "-",
          source: a.providerAddress || "-",
          destination: a.ngoAddress || "-",
          resourceType: a.resourceType,
          quantity: a.quantity,
          status: a.status,
          dueDate: a.dueDate,
          latSource: a.providerLat,
          lngSource: a.providerLng,
          latDestination: a.ngoLat,
          lngDestination: a.ngoLng
        }));
        setAssignments([...reqData, ...donData]);
      })
      .catch(() => toast.error("Failed to load assignments and donations"));
  }, [token, userId]);

  if (userRole !== "Volunteer" || !token) {
    return <Navigate to="/login" replace />;
  }

  const lowerSearch = searchText.toLowerCase();
  const filteredAssignments = assignments.filter(a =>
    (a.name && a.name.toLowerCase().includes(lowerSearch)) ||
    (a.ngoName && a.ngoName.toLowerCase().includes(lowerSearch)) ||
    (a.resourceType && a.resourceType.toLowerCase().includes(lowerSearch))
  );

  return (
    <div className="container mt-4">
      <h2>Volunteer Dashboard</h2>
      <input
        type="text"
        placeholder="Search by name, NGO, or resource"
        className="form-control mb-3"
        value={searchText}
        onChange={e => setSearchText(e.target.value)}
      />
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name (Requester/Provider)</th>
            <th>NGO Name</th>
            <th>Source</th>
            <th>Destination</th>
            <th>Resource</th>
            <th>Quantity</th>
            <th>Status</th>
            <th>Due Date</th>
            <th>Track</th>
          </tr>
        </thead>
        <tbody>
          {filteredAssignments.length === 0 ? (
            <tr>
              <td colSpan="10" className="text-center">No matching assignments</td>
            </tr>
          ) : (
            filteredAssignments.map(a => (
              <tr key={`${a.type}-${a.id}`}>
                <td>{a.id}</td>
                <td>{a.name}</td>
                <td>{a.ngoName}</td>
                <td>{a.source}</td>
                <td>{a.destination}</td>
                <td>{a.resourceType}</td>
                <td>{a.quantity}</td>
                <td>{a.status}</td>
                <td>{a.dueDate || "-"}</td>
                <td>
                  <button className="btn btn-primary btn-sm"
                    onClick={() => setTrackId(a.id)}>
                    Track
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      {/* Robust tracking modal logic */}
      {trackId && (() => {
        const assignment = assignments.find(a => a.id === trackId);
        if (!assignment) return null;
        let source, destination;
        if (assignment.type === "request") {
          source = {
            name: assignment.ngoName,
            address: assignment.source,
            latitude: assignment.latSource,
            longitude: assignment.lngSource
          };
          destination = {
            name: assignment.name,
            address: assignment.destination,
            latitude: assignment.latDestination,
            longitude: assignment.lngDestination
          };
        } else {
          source = {
            name: assignment.name,
            address: assignment.source,
            latitude: assignment.latSource,
            longitude: assignment.lngSource
          };
          destination = {
            name: assignment.ngoName,
            address: assignment.destination,
            latitude: assignment.latDestination,
            longitude: assignment.lngDestination
          };
        }
        return (
          <div className="modal d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.2)" }}>
            <div className="modal-dialog modal-lg">
              <div className="modal-content p-3">
                <div className="modal-header">
                  <h5>Track Assignment #{assignment.id}</h5>
                  <button type="button" className="btn-close" onClick={() => setTrackId(null)} />
                </div>
                <div className="modal-body">
                  <VolunteerTrackMap
                    provider={source}
                    ngo={destination}
                  />
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
