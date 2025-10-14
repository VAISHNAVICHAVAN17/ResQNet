import React, { useState, useEffect } from "react";
import ResourceForm from "../components/ResourceForm";
import ResourceList from "../components/ResourceList";

function ResourcesPage() {
  const [resources, setResources] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8088/api/resources")
      .then(res => res.json())
      .then(data => setResources(data))
      .catch(() => setResources([]));
  }, []);

  const handleResourceAdded = newResource => {
    setResources(prev => [...prev, newResource]);
  };

  return (
    <div style={{ maxWidth: "700px", margin: "0 auto" }}>
      <h2 style={{ margin: "20px 0", color: "#0077b6" }}>Resources</h2>
      <ResourceForm onResourceAdded={handleResourceAdded} />
      <ResourceList resources={resources} setResources={setResources} />
    </div>
  );
}

export default ResourcesPage;
