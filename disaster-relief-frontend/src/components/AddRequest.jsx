import React, { useState } from "react";
import axios from "axios";

export default function AddRequest() {
  const [request, setRequest] = useState({
    title: "",
    description: "",
    status: "PENDING", // ✅ default status
  });

  // change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setRequest((prev) => ({ ...prev, [name]: value }));
  };

  // submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:8088/api/requests?requesterId=13", // ✅ backend API
        request,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log("✅ Request saved:", response.data);

      // reset form
      setRequest({ title: "", description: "", status: "PENDING" });
      alert("Request submitted successfully!");
    } catch (error) {
      console.error("❌ Error saving request:", error.response || error);
      alert("Failed to submit request. Check backend logs.");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ margin: "20px" }}>
      <h2>Add New Request</h2>

      <div>
        <label>Title:</label>
        <input
          type="text"
          name="title"
          value={request.title}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label>Description:</label>
        <textarea
          name="description"
          value={request.description}
          onChange={handleChange}
          required
        />
      </div>

      <button type="submit">Submit Request</button>
    </form>
  );
}
