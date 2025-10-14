import React, { useState } from "react";

function ResourceForm({ onResourceAdded }) {
  const [type, setType] = useState("");
  const [quantity, setQuantity] = useState("");
  const [location, setLocation] = useState("");
  const [ngoId, setNgoId] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!ngoId || isNaN(Number(ngoId)) || Number(ngoId) <= 0) {
      alert("Please enter a valid NGO ID (positive number).");
      return;
    }

    try {
      const newResource = {
        type,
        quantity: Number(quantity),
        location,
        ngo: { id: Number(ngoId) },
      };

      const res = await fetch("http://localhost:8088/api/resources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newResource),
      });

      if (!res.ok) throw new Error("Failed to add resource");

      const savedResource = await res.json();
      onResourceAdded(savedResource);

      setType("");
      setQuantity("");
      setLocation("");
      setNgoId("");
    } catch (err) {
      console.error("Error adding resource:", err);
      alert("Failed to add resource. Check console for details.");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: "15px" }}>
      <h3>Add Resource</h3>
      <input
        type="text"
        placeholder="Resource Type (e.g. Food Pack)"
        value={type}
        onChange={(e) => setType(e.target.value)}
        required
      /><br />
      <input
        type="number"
        placeholder="Quantity"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        required
      /><br />
      <input
        type="text"
        placeholder="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        required
      /><br />
      <input
        type="number"
        placeholder="NGO ID"
        value={ngoId}
        onChange={(e) => setNgoId(e.target.value)}
        required
      /><br />
      <button type="submit">Add Resource</button>
    </form>
  );
}

export default ResourceForm;
