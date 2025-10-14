import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
import axios from "axios";

// Fallback to just city/state/country for reliability
function lastLocationFields(address, max = 3) {
  if (!address) return "";
  let parts = address.split(",").map(s => s.trim()).filter(Boolean);
  let cleaned = parts.slice(-max).join(", ");
  if (!cleaned.toLowerCase().includes("india")) cleaned += ", India";
  return cleaned;
}

async function geocode(address) {
  let resp = await axios.get("https://nominatim.openstreetmap.org/search", {
    params: { q: address, format: "json", limit: 1 },
  });
  if (resp.data && resp.data.length > 0) {
    return [parseFloat(resp.data[0].lat), parseFloat(resp.data[0].lon)];
  }
  throw new Error(address);
}

export default function VolunteerAssignmentMap({ ngoAddress, requesterAddress }) {
  const [fromCoords, setFromCoords] = useState(null);
  const [toCoords, setToCoords] = useState(null);
  const [error, setError] = useState("");
  const [editProviderAddress, setEditProviderAddress] = useState(requesterAddress || "");
  const [editNgoAddress, setEditNgoAddress] = useState(ngoAddress || "");
  const [suggestProvider, setSuggestProvider] = useState(lastLocationFields(requesterAddress));
  const [suggestNgo, setSuggestNgo] = useState(lastLocationFields(ngoAddress));

  useEffect(() => {
    let cancelled = false;
    async function fetchCoords() {
      setError("");
      setFromCoords(null); setToCoords(null);
      try {
        const [from, to] = await Promise.all([
          geocode(editProviderAddress),
          geocode(editNgoAddress),
        ]);
        if (!cancelled) {
          setFromCoords(from);
          setToCoords(to);
        }
      } catch (e) {
        setError(
          "Unable to geocode one or both addresses. " +
          "Try removing all but city + state + country below, or click the Suggestion."
        );
        setFromCoords(null); setToCoords(null);
      }
    }
    if (editProviderAddress && editNgoAddress) fetchCoords();
    return () => { cancelled = true };
    // eslint-disable-next-line
  }, [editProviderAddress, editNgoAddress]);

  return (
    <div>
      {error && (
        <div className="alert alert-danger">{error}</div>
      )}

      <div className="mb-2">
        <label className="form-label">
          Provider Location:
          <input
            type="text"
            className="form-control"
            value={editProviderAddress}
            onChange={e => setEditProviderAddress(e.target.value)}
            placeholder="Ahmednagar, Maharashtra, India"
          />
        </label>
      </div>

      <div className="mb-2">
        <label className="form-label">
          NGO Location:
          <input
            type="text"
            className="form-control"
            value={editNgoAddress}
            onChange={e => setEditNgoAddress(e.target.value)}
            placeholder="Ahmednagar, Maharashtra, India"
          />
        </label>
      </div>

      <div className="mb-3 text-muted">
        Tip: For Indian addresses use only major city, district, state, and country.<br/>
        <button
          className="btn btn-link btn-sm"
          onClick={() => {
            setEditProviderAddress(suggestProvider);
            setEditNgoAddress(suggestNgo);
          }}
        >Use suggestions: {suggestProvider} → {suggestNgo}</button>
      </div>

      <button
        className="btn btn-primary mb-3"
        onClick={() => {
          setEditProviderAddress(editProviderAddress.trim());
          setEditNgoAddress(editNgoAddress.trim());
        }}
      >Retry Geocoding</button>

      {fromCoords && toCoords ? (
        <MapContainer center={fromCoords} zoom={10} style={{ height: 400, width: "100%" }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={fromCoords}>
            <Popup>Provider:<br />{editProviderAddress}</Popup>
          </Marker>
          <Marker position={toCoords}>
            <Popup>NGO:<br />{editNgoAddress}</Popup>
          </Marker>
          <Polyline positions={[fromCoords, toCoords]} color="blue" />
        </MapContainer>
      ) : (
        <div className="text-center text-secondary">
          Map will appear here once addresses are geocoded.
        </div>
      )}
    </div>
  );
}
