import React, { useState, useEffect } from "react";
import RequestForm from "../components/RequestForm";
import RequestList from "../components/RequestList";

function Requests() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8088/api/requests")
      .then(res => res.json())
      .then(data => setRequests(data))
      .catch(() => setRequests([]));
  }, []);

  const handleRequestAdded = newRequest => {
    setRequests(prev => [...prev, newRequest]);
  };

  return (
    <div style={{ maxWidth: "700px", margin: "0 auto" }}>
      <h2 style={{ margin: "20px 0", color: "#0077b6" }}>Resource Requests</h2>
      <RequestForm onRequestAdded={handleRequestAdded} />
      <RequestList requests={requests} setRequests={setRequests} />
    </div>
  );
}

export default Requests;
