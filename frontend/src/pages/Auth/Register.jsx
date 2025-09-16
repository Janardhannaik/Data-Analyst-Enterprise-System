import React, { useState } from "react";
import API from "../../api/api";
import { saveToken } from "../../utils/auth";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [err, setErr] = useState("");
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return setErr("Passwords do not match");
    }

    try {
      const res = await API.post("/auth/register", { email, password });
      saveToken(res.data.token);
      nav("/");
    } catch (error) {
      setErr(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 pt-28 bg-transparent">
      {/* Gradient Card Wrapper */}
      <div className="w-full max-w-md rounded-2xl p-[2px] bg-gradient-to-r from-cyan-400/40 via-purple-500/30 to-pink-500/40 shadow-2xl">
        <div className="rounded-2xl bg-black/30 backdrop-blur-lg p-8 space-y-6 border border-white/10 text-white">
          {/* Heading */}
          <h2 className="text-3xl font-extrabold flex items-center gap-2 justify-center">
            <span>📝</span>
            <span className="bg-gradient-to-r from-cyan-300 to-purple-400 bg-clip-text text-transparent">
              Register
            </span>
          </h2>

          {/* Error */}
          {err && (
            <div className="p-3 bg-red-500/20 border border-red-400 text-red-300 rounded-lg text-center">
              {err}
            </div>
          )}

          {/* Form */}
          <form onSubmit={submit} className="space-y-4">
            <input
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-lg bg-black/40 border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-400 text-white"
            />
            <input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-lg bg-black/40 border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-400 text-white"
            />
            <input
              placeholder="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 rounded-lg bg-black/40 border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-400 text-white"
            />
            <button
              className="w-full py-3 rounded-lg bg-gradient-to-r from-cyan-400 to-purple-500 text-white font-bold shadow hover:opacity-90 transition"
              type="submit"
            >
              Register
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
