import React, { useState } from "react";

function RegisterUser() {
  const [aadhar, setAadhar] = useState("");
  const [details, setDetails] = useState({ name: "", dob: "", address: "" });

  const fetchAadhar = async () => {
    const res = await fetch(`http://localhost:8088/api/verify/aadhar/${aadhar}`);
    if (res.ok) {
      const data = await res.json();
      setDetails(data);
    }
  };

  const handleInput = (e) => {
    setAadhar(e.target.value);
  };

  return (
    <form>
      <label>Aadhar Number</label>
      <input
        type="text"
        value={aadhar}
        onChange={handleInput}
        placeholder="Enter Aadhar Number"
        required
      />
      <button onClick={e => { e.preventDefault(); fetchAadhar(); }}>
        Fetch Details
      </button>
      <label>Name</label>
      <input
        type="text"
        value={details.name}
        placeholder="Name"
        required
        readOnly
      />
      <label>Date of Birth</label>
      <input
        type="text"
        value={details.dob}
        placeholder="DOB"
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
      <button type="submit">Register</button>
    </form>
  );
}

export default RegisterUser;
