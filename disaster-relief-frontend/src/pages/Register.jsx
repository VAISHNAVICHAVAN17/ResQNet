import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserPlus, FaSpinner, FaMapMarkerAlt } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "bootstrap/dist/css/bootstrap.min.css";

const myIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/535/535137.png",
  iconSize: [38, 44],
  iconAnchor: [19, 44],
  popupAnchor: [0, -40],
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  shadowSize: [41, 41]
});

function LocationMarker({ latlng, setLatlng }) {
  useMapEvents({
    click(e) { setLatlng([e.latlng.lat, e.latlng.lng]); }
  });
  return latlng ? (<Marker position={latlng} icon={myIcon} />) : null;
}

async function reverseGeocode(lat, lng) {
  try {
    const resp = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
    );
    if (resp.ok) {
      const data = await resp.json();
      return data.display_name || `${lat}, ${lng}`;
    }
  } catch (err) {}
  return `${lat}, ${lng}`;
}

export default function Register() {
  const [role, setRole] = useState("");
  const [name, setName] = useState("");
  const [orgName, setOrgName] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");
  const [address, setAddress] = useState("");
  const [aadhaarNumber, setAadhaarNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const [latlng, setLatlng] = useState(null);
  const [showMap, setShowMap] = useState(false);

  // For map search
  const [searchText, setSearchText] = useState("");
  const mapRef = useRef();

  const navigate = useNavigate();

  const onFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  // OCR File Upload + Extraction logic
  const uploadAndExtract = async () => {
    if (!file) {
      toast.error("Please select a file.");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("http://localhost:8088/api/ocr/extract", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("OCR extraction failed");
      const data = await res.json();

      setName(data.name || ""); // Editable
      setOrgName(data.orgName || "");
      setDob(data.dob || ""); // Filled from OCR, non-editable
      setAadhaarNumber(data.aadhaarNumber || ""); // Filled from OCR, non-editable

      toast.success("Details extracted successfully!");
    } catch (error) {
      toast.error(error.message || "Extraction error");
    } finally {
      setLoading(false);
    }
  };

  // --- Address must ONLY be updated via Map ---
  const handleManualAddressEdit = (e) => {
    toast.warn(
      "For convenience and accuracy, please use the location button to pick your address on the map."
    );
  };

  const handleMapDone = async () => {
    if (latlng) {
      const foundAddress = await reverseGeocode(latlng[0], latlng[1]);
      setAddress(foundAddress);
    }
    setShowMap(false);
  };

  // Search for address function
  const handleSearchLocation = async () => {
    if (!searchText) {
      toast.error("Enter a place or address to search!");
      return;
    }
    try {
      const resp = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(
          searchText
        )}`
      );
      const results = await resp.json();
      if (results && results.length > 0) {
        const loc = [parseFloat(results[0].lat), parseFloat(results[0].lon)];
        setLatlng(loc);
        // Center map
        if (mapRef.current) {
          mapRef.current.setView(loc, 15);
        }
        toast.success("Location found and marker updated.");
      } else {
        toast.error("Location not found!");
      }
    } catch (error) {
      toast.error("Failed to search location.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!role) {
      toast.error("Please select a role");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (!latlng) {
      toast.error("Please set your map location (click marker)");
      return;
    }
    setLoading(true);
    try {
      const requestData = {
        role,
        name,
        orgName,
        email,
        dob,
        address,
        aadhaarNumber,
        password,
        latitude: latlng[0],
        longitude: latlng[1],
      };

      const res = await fetch("http://localhost:8088/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      if (!res.ok) throw new Error("Registration failed");
      toast.success("Registration successful! Redirecting...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (error) {
      toast.error(error.message || "Failed to register");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container pt-5" style={{ maxWidth: "480px" }}>
      <form className="border p-4 rounded shadow bg-light" onSubmit={handleSubmit}>
        <h2 className="mb-4 text-primary text-center">
          <FaUserPlus style={{ marginRight: 8 }} />
          Register
        </h2>

        <select
          className="form-select mb-3"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          disabled={loading}
          required
        >
          <option value="">Select Role</option>
          <option value="Volunteer">Volunteer</option>
          <option value="Requester">Requester</option>
          <option value="NGO">NGO</option>
          <option value="Provider">Provider</option>
          <option value="Admin">Admin</option>
        </select>

        {["Volunteer", "Requester", "NGO", "Provider", "Admin"].includes(role) && (
          <>
            <input
              type="file"
              accept="image/*,application/pdf"
              onChange={onFileChange}
              disabled={loading}
              className="form-control mb-2"
            />
            <button
              type="button"
              className="btn btn-secondary mb-3 w-100"
              onClick={uploadAndExtract}
              disabled={loading || !file}
            >
              {loading ? <FaSpinner className="spinner" /> : "Upload & Extract Details"}
            </button>
          </>
        )}

        {role === "NGO" ? (
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Organization Name"
            value={orgName}
            onChange={(e) => setOrgName(e.target.value)}
            required
            disabled={loading}
          />
        ) : (
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={loading}
          />
        )}

        <input
          type="email"
          className="form-control mb-3"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          required
        />

        <input
          type="text"
          className="form-control mb-3"
          placeholder="Date of Birth"
          value={dob}
          readOnly // Non-editable after OCR
          disabled={loading}
          required
        />

        <div className="mb-3">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Address"
              value={address}
              readOnly
              onFocus={handleManualAddressEdit}
              disabled={loading}
              required
            />
            <button
              type="button"
              className="btn btn-outline-secondary"
              title="Pick location from map"
              onClick={() => setShowMap(true)}
              tabIndex={-1}
            >
              <FaMapMarkerAlt />
            </button>
          </div>
          {latlng && (
            <div className="small text-success">
              Location set: <span>{latlng[0].toFixed(6)}, {latlng[1].toFixed(6)}</span>
            </div>
          )}
        </div>

        <input
          type="text"
          className="form-control mb-3"
          placeholder="Aadhaar Number"
          value={aadhaarNumber}
          readOnly // Only set from OCR, non-editable
          disabled={loading}
          required
        />

        <input
          type="password"
          className="form-control mb-3"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
          required
        />

        <input
          type="password"
          className="form-control mb-3"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={loading}
          required
        />

        <button type="submit" className="btn btn-primary w-100" disabled={loading}>
          {loading ? <FaSpinner className="spinner" /> : "Register"}
        </button>

        <p className="mt-3 text-center">
          Already have an account? <a href="/login">Login here</a>
        </p>
      </form>

      <ToastContainer position="top-right" autoClose={3000} />

      {/* Location modal */}
      {showMap && (
        <div className="modal d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.25)" }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content p-3">
              <div className="modal-header">
                <h5>Select your location by search or map</h5>
                <button type="button" className="btn-close" onClick={() => setShowMap(false)} />
              </div>
              <div className="modal-body">
                {/* Search Input & Button */}
                <div className="input-group mb-2">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search for area/place..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleSearchLocation()}
                  />
                  <button
                    type="button"
                    className="btn btn-outline-primary"
                    onClick={handleSearchLocation}
                  >Search</button>
                </div>
                <MapContainer
                  ref={mapRef}
                  center={latlng || [19.0974, 74.7411]}
                  zoom={7}
                  style={{ height: 330, width: "100%" }}
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <LocationMarker latlng={latlng} setLatlng={setLatlng} />
                </MapContainer>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-success"
                  disabled={!latlng}
                  onClick={handleMapDone}
                >
                  Use this location
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .spinner {
          animation: spin 1s linear infinite;
          margin: auto;
          display: block;
        }
        @keyframes spin {
          100% { transform: rotate(360deg); }
        }
        .modal-backdrop { z-index: 1040 !important; }
        .btn-close { float: right; }
      `}</style>
    </div>
  );
}
