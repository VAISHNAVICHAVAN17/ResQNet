import React from "react";

export default function HowToUse() {
  return (
    <div className="container mt-4">
      <h2>How To Use The Portal</h2>
      <ol>
        <li>Register for an account based on your role (Volunteer, NGO, Provider, Requester)</li>
        <li>Login using your email and password</li>
        <li>Access your personalized dashboard from the Navbar</li>
        <li>
          <strong>Volunteers:</strong> Accept/track assignments, view requests and routes on live map
        </li>
        <li>
          <strong>Providers:</strong> Submit available resources for donation, view assigned pickups
        </li>
        <li>
          <strong>NGOs:</strong> Manage incoming resource requests and assign volunteers to tasks
        </li>
        <li>
          <strong>Requesters:</strong> Submit requests for aid, track fulfillment progress
        </li>
      </ol>
      <p>
        Use the <strong>Instructions</strong> dropdown above for detailed guides for your role.
      </p>
    </div>
  );
}
