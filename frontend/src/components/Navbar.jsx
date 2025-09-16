import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { clearToken, getToken } from "../utils/auth";

export default function Navbar() {
  const navigate = useNavigate();
  const token = getToken();

  const handleLogout = () => {
    clearToken();
    navigate("/login");
  };

  return (
    <nav
      className="flex items-center justify-between p-4 border-b"
      style={{ borderColor: "var(--fg)" }}
    >
      <div className="flex items-center gap-4">
        <Link to="/" className="text-lg font-semibold">
          SmallBiz Data
        </Link>
        {token && (
          <>
            <Link to="/upload" className="text-sm">
              Upload
            </Link>
            <Link to="/history" className="text-sm">
              History
            </Link>
            <Link to="/compare" className="text-sm">
              Compare
            </Link>
          </>
        )}
      </div>
      <div className="flex items-center gap-3">
        {token ? (
          <>
            <Link to="/profile" className="text-sm">
              Profile
            </Link>
            <button onClick={handleLogout} className="btn">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-sm">
              Login
            </Link>
            <Link to="/register" className="text-sm">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
