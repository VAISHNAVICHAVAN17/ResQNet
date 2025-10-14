import React from "react";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Tooltip } from "react-leaflet";
import RoutingControl from "../components/RoutingControl";

// Use standard pin icons for source/destination for clarity
const SourceIcon = L.icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png", // blue map pin
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});
const DestIcon = L.icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/2948/2948035.png", // red map pin
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

export default function VolunteerTrackMap({ provider, ngo, onClose }) {
  const providerLat = provider?.latitude;
  const providerLng = provider?.longitude;
  const ngoLat = ngo?.latitude;
  const ngoLng = ngo?.longitude;

  if (!providerLat || !providerLng || !ngoLat || !ngoLng) {
  return <div style={{padding:32, textAlign:"center"}}>No valid location for routing.</div>;
}

  return (
    <div style={{ position: "relative", minHeight: 430, background: "#eee", borderRadius: 10 }}>
      {onClose && (
        <button
          style={{
            position: "absolute", top: 9, right: 18, zIndex: 1300,
            background: "rgba(255,255,255,0.85)", border: "none",
            borderRadius: "48%", fontSize: 28, width: 34, height: 34, cursor: "pointer",
            boxShadow: "0 0px 5px #bbb"
          }}
          onClick={onClose}
          aria-label="Close"
        >×</button>
      )}
      <MapContainer center={[providerLat, providerLng]} zoom={9} style={{ height: "430px", width: "100%", borderRadius: 10 }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {/* Only show source and destination markers */}
        <Marker position={[providerLat, providerLng]} icon={SourceIcon}>
          <Tooltip direction="top" offset={[0, -16]} permanent={false}>Source: {provider.name}</Tooltip>
        </Marker>
        <Marker position={[ngoLat, ngoLng]} icon={DestIcon}>
          <Tooltip direction="top" offset={[0, -16]} permanent={false}>Destination: {ngo.orgName}</Tooltip>
        </Marker>
        {/* Route line only, NO instructions panel/overlay */}
        <RoutingControl 
          providerLat={providerLat}
          providerLng={providerLng}
          ngoLat={ngoLat}
          ngoLng={ngoLng}
          showInstructions={false} // Pass this to suppress instructions completely if needed
        />
      </MapContainer>
    </div>
  );
}
