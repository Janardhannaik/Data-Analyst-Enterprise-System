import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Dashboard from "./pages/Dashboard";
import BusinessProfile from "./pages/BusinessProfile";
import UploadForm from "./pages/UploadForm";
import UploadHistory from "./pages/UploadHistory";
import ComparePage from "./pages/ComparePage";
import Profile from "./pages/Profile";
import Navbar from "./components/Navbar";
import { getToken } from "./utils/auth";

function Protected({ children }) {
  return getToken() ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="p-6">
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
            path="/compare"
            element={
              <Protected>
                <ComparePage />
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
