import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { toast, ToastContainer } from "react-toastify";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8088/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Invalid email or password");
      }

      const data = await res.json();

      login({ userRole: data.role, userId: data.userId, token: data.token });

      toast.success("Login successful! Redirecting...");

      switch (data.role) {
        case "Volunteer":
          navigate("/dashboard/volunteer");
          break;
        case "Requester":
          navigate("/dashboard/requester");
          break;
        case "NGO":
          navigate("/dashboard/ngo");
          break;
        case "Provider":
          navigate("/dashboard/provider");
          break;
        case "Admin":
          navigate("/dashboard/admin");
          break;
        default:
          navigate("/");
      }
    } catch (err) {
      toast.error(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container pt-5" style={{ maxWidth: "420px" }}>
      <form onSubmit={handleSubmit} className="border p-4 rounded shadow bg-light">
        <h2 className="mb-4 text-primary text-center">Login</h2>

        <input
          type="email"
          className="form-control mb-3"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
        />

        <input
          type="password"
          className="form-control mb-4"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading}
        />

        <button type="submit" className="btn btn-primary w-100" disabled={loading}>
          {loading ? "Loading..." : "Login"}
        </button>

        <p className="mt-3 text-center">Don't have an account? <a href="/register">Register here</a></p>
      </form>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default Login;
