import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Dashboard from "./pages/Dashboard";
import BusinessProfile from "./pages/BusinessProfile";
import UploadForm from "./pages/UploadForm";
import UploadHistory from "./pages/UploadHistory";

import Profile from "./pages/Profile";
import Navbar from "./components/Navbar";
import { getToken } from "./utils/auth";

function Protected({ children }) {
  return getToken() ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0d0d0d] via-[#1a0033] to-[#000000] relative overflow-hidden">
      {/* Glowing background circles */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-purple-600/30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute top-1/2 left-1/3 w-60 h-60 bg-pink-500/20 rounded-full blur-3xl animate-pulse"></div>

      {/* Content */}
      <Navbar />
      <main className="relative z-10 p-6">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              <Protected>
                <Dashboard />
              </Protected>
            }
          />
          <Route
            path="/business"
            element={
              <Protected>
                <BusinessProfile />
              </Protected>
            }
          />
          <Route
            path="/upload"
            element={
              <Protected>
                <UploadForm />
              </Protected>
            }
          />
          <Route
            path="/history"
            element={
              <Protected>
                <UploadHistory />
              </Protected>
            }
          />

          <Route
            path="/profile"
            element={
              <Protected>
                <Profile />
              </Protected>
            }
          />
        </Routes>
      </main>
    </div>
  );
}
