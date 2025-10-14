import React, { useState } from "react";

function RequestForm({ onRequestAdded }) {
  const [resourceType, setResourceType] = useState("");
  const [quantity, setQuantity] = useState("");
  const [location, setLocation] = useState("");
  const [requesterId, setRequesterId] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newRequest = { resourceType, quantity: Number(quantity), location };
      const res = await fetch(
        `http://localhost:8088/api/requests?requesterId=${requesterId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newRequest),
        }
      );
      if (!res.ok) throw new Error("Failed to add request");
      const savedRequest = await res.json();
      onRequestAdded(savedRequest);
      // reset form
      setResourceType("");
      setQuantity("");
      setLocation("");
      setRequesterId("");
    } catch (err) {
      console.error("Error adding request:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: "15px" }}>
      <h3>Add Request</h3>
      <input
        type="text"
        placeholder="Resource Type (e.g. Food, Water)"
        value={resourceType}
        onChange={(e) => setResourceType(e.target.value)}
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
        type="text"
        placeholder="Requester ID"
        value={requesterId}
        onChange={(e) => setRequesterId(e.target.value)}
        required
      /><br />
      <button type="submit">Add Request</button>
    </form>
  );
}

export default RequestForm;
