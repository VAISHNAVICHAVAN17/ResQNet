import React, { useEffect, useState } from "react";
export default function AuditHistory() {
  const userId = parseInt(localStorage.getItem("userId"), 10);
  const [logs, setLogs] = useState([]);
  useEffect(() => {
    fetch(`http://localhost:8088/api/audit/user?userId=${userId}`).then(res => res.json()).then(setLogs);
  }, []);
  return (
    <div className="container mt-4">
      <h2>Action History</h2>
      <table className="table">
        <thead><tr>
          <th>Timestamp</th><th>Action</th><th>Details</th>
        </tr></thead>
        <tbody>
          {logs.length === 0 ? (
            <tr><td colSpan="3" className="text-center">No activity found.</td></tr>
          ) : (
            logs.map(log => (
              <tr key={log.id}>
                <td>{log.timestamp}</td><td>{log.action}</td><td>{log.details}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
