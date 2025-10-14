import React from "react";

function Dashboard() {
  return (
    <div style={{ maxWidth: "540px", margin: "0 auto", background: "#fefefe", padding: "32px", borderRadius: "14px", boxShadow: "0 6px 18px rgba(0,0,0,0.14)" }}>
      <h2 style={{ color: "#0077b6", fontWeight: "bold", marginBottom: "16px" }}>
        ResQNet
      </h2>
      <p>
        Welcome! Use the navigation bar above to manage users, resource requests, and resources. This dashboard provides real-time coordination for relief efforts.
      </p>
    </div>
  );
}

export default Dashboard;
