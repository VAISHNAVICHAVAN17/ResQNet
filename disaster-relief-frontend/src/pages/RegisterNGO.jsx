import React, { useState } from "react";

function RegisterNGO() {
  const [pan, setPan] = useState("");
  const [details, setDetails] = useState({ orgName: "", address: "" });

  const fetchPan = async () => {
    const res = await fetch(`http://localhost:8088/api/verify/pan/${pan}`);
    if (res.ok) {
      const data = await res.json();
      setDetails(data);
    }
  };

  return (
    <form>
      <label>PAN Number</label>
      <input
        type="text"
        value={pan}
        onChange={e => setPan(e.target.value)}
        placeholder="Enter PAN Number"
        required
      />
      <button onClick={e => { e.preventDefault(); fetchPan(); }}>
        Fetch Details
      </button>
      <label>Organization Name</label>
      <input
        type="text"
        value={details.orgName}
        placeholder="Organization Name"
        required
        readOnly
      />
      <label>Address</label>
      <input
        type="text"
        value={details.address}
        placeholder="Address"
        required
        readOnly
      />
      {/* Other fields, password, email, etc. */}
      <button type="submit">Register NGO</button>
    </form>
  );
}

export default RegisterNGO;
