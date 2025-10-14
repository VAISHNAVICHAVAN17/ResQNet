import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { logout, isLoggedIn, getUserRole } from "../utils/auth";

// Helper for dashboard route and label per role
const DASHBOARD_LINKS = {
  "NGO":     { path: "/dashboard/ngo", label: "NGO Dashboard" },
  "Volunteer": { path: "/dashboard/volunteer", label: "Volunteer Dashboard" },
  "Provider":  { path: "/dashboard/provider", label: "Provider Dashboard" },
  "Requester": { path: "/dashboard/requester", label: "Requester Dashboard" },
};

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const loggedIn = isLoggedIn();
  const userRole = getUserRole(); // string like "NGO", "Volunteer", ...

  const [showInstructions, setShowInstructions] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const onRegisterPage = location.pathname === "/register";

  // True if logged in as one of these "app" roles:
  const limitedNav = loggedIn && ["NGO", "Volunteer", "Provider", "Requester"].includes(userRole);
  const dashboardLink = DASHBOARD_LINKS[userRole];

  return (
    <nav
      style={{
        padding: "10px 20px",
        background: "#0077b6",
        color: "white",
        display: "flex",
        alignItems: "center",
        fontFamily: "Segoe UI, Arial",
        fontSize: "18px",
        justifyContent: "space-between",
      }}
      role="navigation"
      aria-label="Main Navigation"
    >
      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        <Link
          to="/"
          style={{
            color: "white",
            fontWeight: "bold",
            fontSize: "30px",
            textDecoration: "none",
            whiteSpace: "nowrap",
            minWidth: 110,
          }}
        >
          ResQNet
        </Link>
        <Link to="/about" className="nav-link-btn">
          About
        </Link>
        <Link to="/contact" className="nav-link-btn">
          Contact
        </Link>
        {limitedNav
          ? (
            <>
              {/* Only show DASHBOARD for this role */}
              <Link
                to={dashboardLink.path}
                className="nav-link-btn"
              >
                {dashboardLink.label}
              </Link>
              {/* NGO: also show Donations button */}
              {userRole === "NGO" &&
                <Link
                  to="/dashboard/ngo/donations"
                  className="nav-link-btn"
                >
                  Donations
                </Link>
              }
            </>
          )
          :
          <>
            <Link to="/how-to-use" className="nav-link-btn">
              How To Use
            </Link>
            {/* Instructions Dropdown */}
            <div style={{ position: "relative" }}>
              <button
                type="button"
                onClick={() => setShowInstructions((show) => !show)}
                className="nav-link-btn"
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer"
                }}
                aria-haspopup="true"
                aria-expanded={showInstructions}
                aria-label="Instructions Menu"
              >
                Instructions ▼
              </button>
              {showInstructions && (
                <div
                  style={{
                    position: "absolute",
                    top: "125%",
                    left: 0,
                    background: "#ffffff",
                    color: "#222",
                    borderRadius: "7px",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.19)",
                    minWidth: "180px",
                    zIndex: "99",
                    padding: "5px 0",
                  }}
                  onMouseLeave={() => setShowInstructions(false)}
                >
                  <Link
                    to="/instructions/volunteers"
                    style={{ display: "block", padding: "8px 22px", textDecoration: "none", color: "#0077b6" }}
                    onClick={() => setShowInstructions(false)}
                  >
                    Volunteers
                  </Link>
                  <Link
                    to="/instructions/providers"
                    style={{ display: "block", padding: "8px 22px", textDecoration: "none", color: "#0077b6" }}
                    onClick={() => setShowInstructions(false)}
                  >
                    Providers
                  </Link>
                  <Link
                    to="/instructions/ngos"
                    style={{ display: "block", padding: "8px 22px", textDecoration: "none", color: "#0077b6" }}
                    onClick={() => setShowInstructions(false)}
                  >
                    NGOs
                  </Link>
                  <Link
                    to="/instructions/requesters"
                    style={{ display: "block", padding: "8px 22px", textDecoration: "none", color: "#0077b6" }}
                    onClick={() => setShowInstructions(false)}
                  >
                    Requesters
                  </Link>
                </div>
              )}
            </div>
            <Link to="/faq" className="nav-link-btn">
              FAQ
            </Link>
          </>
        }
      </div>
      <div style={{ display: "flex", alignItems: "center" }}>
        {!loggedIn ? (
          onRegisterPage ? (
            <Link
  to="/login"
  className="nav-link-btn outer-btn"
  style={{
    backgroundColor: "#fff",
    color: "#0077b6",
    border: "2px solid #0077b6",
    fontWeight: "bold",
    fontSize: "18px",
    padding: "8px 28px",
    borderRadius: "8px",
    marginLeft: "10px",
    marginRight: "4px"
  }}
>
  Login
</Link>
          ) : (
            <Link
  to="/register"
  className="nav-link-btn outer-btn"
  style={{
    backgroundColor: "#fff",
    color: "#0077b6",
    border: "2px solid #0077b6",
    fontWeight: "bold",
    fontSize: "18px",
    padding: "8px 28px",
    borderRadius: "8px",
    marginLeft: "10px",
    marginRight: "4px"
  }}
>
  Register
</Link>
          )
        ) : (
          <button
  onClick={handleLogout}
  className="nav-link-btn logout-btn"
  style={{
    backgroundColor: "#fff",
    color: "#0077b6",
    border: "2px solid #0077b6",      // blue border for visibility
    fontWeight: "bold",
    fontSize: "18px",
    padding: "8px 28px",
    marginLeft: "20px",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(36,87,182,.08)",
    outline: "none"
  }}
  aria-label="Logout"
>
  Logout
</button>

        )}
      </div>
    </nav>
  );
}

export default Navbar;
