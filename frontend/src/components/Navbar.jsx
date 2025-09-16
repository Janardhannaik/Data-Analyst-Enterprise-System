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
    <nav className="fixed top-0 left-0 right-0 z-20 backdrop-blur-lg bg-white/5 border-b border-white/10 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Brand */}
        <Link
          to="/"
          className="text-xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent"
        >
          🚀 Data Analyst Enterprise System
        </Link>

        {/* Links */}
        <div className="flex items-center gap-6">
          {token && (
            <>
              <Link
                to="/upload"
                className="hover:text-cyan-300 transition-colors"
              >
                Upload
              </Link>
              <Link
                to="/history"
                className="hover:text-cyan-300 transition-colors"
              >
                History
              </Link>

              <Link
                to="/profile"
                className="hover:text-cyan-300 transition-colors"
              >
                Profile
              </Link>
            </>
          )}
        </div>

        {/* Auth */}
        <div className="flex items-center gap-3">
          {token ? (
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg hover:scale-105 transition"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg hover:scale-105 transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg hover:scale-105 transition"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
