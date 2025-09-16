import React, { useState, useEffect } from "react";
import API from "../api/api";
import AnalysisView from "../components/AnalysisView";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

export default function Dashboard() {
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedView, setSelectedView] = useState("latest");
  const [selectedUpload, setSelectedUpload] = useState(null);

  useEffect(() => {
    fetchUploads();
  }, []);

  const fetchUploads = async () => {
    try {
      const res = await API.get("/uploads");
      const data = res.data.uploads || [];
      setUploads(data);
      if (data.length > 0) {
        setSelectedUpload(data[0]);
      }
    } catch (err) {
      console.error("Dashboard API error:", err);
      alert("Failed to load uploads. See console for details.");
    } finally {
      setLoading(false);
    }
  };

  const particlesInit = async (main) => {
    await loadFull(main);
  };

  if (loading)
    return <div className="pt-20 text-white">Loading uploads...</div>;
  if (!uploads.length)
    return <div className="pt-20 text-white">No uploads found.</div>;

  return (
    <div className="relative min-h-screen pt-20 flex justify-center items-start px-4 bg-transparent">
      {/* 🎇 Particle Background */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          background: { color: { value: "transparent" } },
          fpsLimit: 60,
          interactivity: {
            events: {
              onHover: { enable: true, mode: "repulse" },
              resize: true,
            },
          },
          particles: {
            color: { value: "#00eaff" },
            links: {
              color: "#7d00ff",
              distance: 150,
              enable: true,
              opacity: 0.4,
              width: 1,
            },
            move: { enable: true, speed: 1.5 },
            number: { value: 70, density: { enable: true, area: 800 } },
            opacity: { value: 0.5 },
            size: { value: { min: 1, max: 3 } },
          },
        }}
        className="absolute top-0 left-0 w-full h-full -z-10"
      />

      {/* 📦 Dashboard Card */}
      <div className="w-full max-w-6xl rounded-2xl p-[2px] bg-gradient-to-r from-cyan-400 via-purple-600 to-pink-500 shadow-2xl">
        <div className="rounded-2xl bg-black/70 backdrop-blur-lg p-8 space-y-6 border border-white/20">
          {/* Dashboard Heading with Emoji */}
          <h2 className="text-3xl font-extrabold text-center flex items-center justify-center gap-2">
            <span role="img" aria-label="dashboard">
              📊
            </span>
            <span className="bg-gradient-to-r from-cyan-300 to-purple-400 bg-clip-text text-transparent">
              Dashboard
            </span>
          </h2>

          {/* Buttons */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <button
              onClick={() => {
                setSelectedView("latest");
                setSelectedUpload(uploads[0]);
              }}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-5 py-2 rounded-xl shadow-lg hover:scale-105 transform transition"
            >
              Show Latest
            </button>
            <button
              onClick={() => setSelectedView("history")}
              className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-5 py-2 rounded-xl shadow-lg hover:scale-105 transform transition"
            >
              History
            </button>
          </div>

          {/* History Mode */}
          {selectedView === "history" && (
            <div className="space-y-3">
              {uploads.map((u) => (
                <div
                  key={u._id}
                  onClick={() => {
                    setSelectedUpload(u);
                    setSelectedView("upload");
                  }}
                  className="p-3 bg-black/60 border border-white/20 text-white rounded-xl cursor-pointer hover:bg-black/80 transition"
                >
                  {u.filename} — {new Date(u.createdAt).toLocaleString()}
                </div>
              ))}
            </div>
          )}

          {/* Latest or Selected Upload */}
          {(selectedView === "latest" || selectedView === "upload") &&
            selectedUpload && (
              <div>
                <h3 className="text-xl font-semibold mb-3 text-center text-cyan-300">
                  {selectedUpload.filename} — Uploaded on{" "}
                  {new Date(selectedUpload.createdAt).toLocaleDateString()}
                </h3>
                <AnalysisView analysis={selectedUpload.analysis} />
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
