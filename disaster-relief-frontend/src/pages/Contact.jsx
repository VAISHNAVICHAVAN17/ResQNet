import React from "react";
export default function Contact() {
  return (
    <div className="container mt-4">
      <h2>Contact Us</h2>
      <p>
        Having trouble or need help? Contact us at <strong>relief-support@example.com</strong>
        <br />Or use the form below:
      </p>
      <form style={{ maxWidth: 400 }}>
        <input className="form-control mb-2" type="email" placeholder="Your Email" required />
        <textarea className="form-control mb-2" rows={4} placeholder="Your message" required />
        <button type="submit" className="btn btn-primary">Send</button>
      </form>
    </div>
  );
}
