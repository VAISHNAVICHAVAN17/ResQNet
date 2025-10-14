import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import { AuthProvider } from "./contexts/AuthContext";
import Navbar from "./components/Navbar";
import L from "leaflet";
import Dashboard from "./pages/Dashboard";
import Register from "./pages/Register";
import Login from "./pages/Login";
import VolunteerDashboard from "./pages/VolunteerDashboard";
import RequesterDashboard from "./pages/RequesterDashboard";
import NGODashboard from "./pages/NGODashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import RegisterUser from "./pages/RegisterUser";
import RegisterNGO from "./pages/RegisterNGO";
import ProviderDashboard from "./pages/ProviderDashboard";
import NGODonationsDashboard from './pages/NGODonationsDashboard';

// Info/about/support/faq/instructional pages (create these if not existing)
import About from "./pages/About";
import HowToUse from "./pages/HowToUse";
import InstructionsVolunteers from "./pages/InstructionsVolunteers";
import InstructionsProviders from "./pages/InstructionsProviders";
import InstructionsNGOs from "./pages/InstructionsNGOs";
import InstructionsRequesters from "./pages/InstructionsRequesters";
import FAQ from "./pages/FAQ";
import Contact from "./pages/Contact";

if (L && L.LayerGroup && typeof L.LayerGroup.prototype.removeLayer === "function") {
  const origRemoveLayer = L.LayerGroup.prototype.removeLayer;
  L.LayerGroup.prototype.removeLayer = function(layer) {
    if (!this._map || !layer) return this;
    try {
      return origRemoveLayer.call(this, layer);
    } catch (e) {
      // Swallow any error silently
      return this;
    }
  };
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <div style={{ margin: "32px 0" }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register/user" element={<RegisterUser />} />
            <Route path="/register/ngo" element={<RegisterNGO />} />
            {/* Info pages */}
            <Route path="/about" element={<About />} />
            <Route path="/how-to-use" element={<HowToUse />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/contact" element={<Contact />} />
            {/* Instructions dropdown pages */}
            <Route path="/instructions/volunteers" element={<InstructionsVolunteers />} />
            <Route path="/instructions/providers" element={<InstructionsProviders />} />
            <Route path="/instructions/ngos" element={<InstructionsNGOs />} />
            <Route path="/instructions/requesters" element={<InstructionsRequesters />} />
            {/* Dashboards */}
            <Route
              path="/dashboard/volunteer"
              element={
                <ProtectedRoute allowedRoles={["Volunteer"]}>
                  <VolunteerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/provider"
              element={
                <ProtectedRoute allowedRoles={["Provider"]}>
                  <ProviderDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/requester"
              element={
                <ProtectedRoute allowedRoles={["Requester"]}>
                  <RequesterDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/ngo"
              element={
                <ProtectedRoute allowedRoles={["NGO"]}>
                  <NGODashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/admin"
              element={
                <ProtectedRoute allowedRoles={["Admin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/ngo/donations"
              element={<NGODonationsDashboard />}
            />
            {/* Default/fallback */}
            <Route path="*" element={<Login />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
