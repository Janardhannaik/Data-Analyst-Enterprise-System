import React, { useState, useEffect } from "react";
import API from "../api/api";
import AnalysisView from "../components/AnalysisView";

export default function Dashboard() {
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedView, setSelectedView] = useState("latest"); // "latest" | "history" | "upload"
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
        setSelectedUpload(data[0]); // default to most recent
      }
    } catch (err) {
      console.error("Dashboard API error:", err);
      alert("Failed to load uploads. See console for details.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading uploads...</div>;
  if (!uploads.length) return <div>No uploads found.</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-6">
      <h2 className="text-3xl font-bold mb-4 text-white">📊 Dashboard</h2>

      {/* Buttons */}
      <div className="flex items-center gap-4 mb-4">
        <button
          onClick={() => {
            setSelectedView("latest");
            setSelectedUpload(uploads[0]);
          }}
          className="bg-black/60 border border-white text-white px-4 py-2 rounded-xl hover:bg-black/80"
        >
          Show Latest
        </button>
        <button
          onClick={() => setSelectedView("history")}
          className="bg-black/60 border border-white text-white px-4 py-2 rounded-xl hover:bg-black/80"
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
              className="p-3 bg-black/40 border border-white text-white rounded-xl cursor-pointer hover:bg-black/60"
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
            <h3 className="text-xl font-semibold mb-3 text-white">
              {selectedUpload.filename} — Uploaded on{" "}
              {new Date(selectedUpload.createdAt).toLocaleDateString()}
            </h3>
            <AnalysisView analysis={selectedUpload.analysis} />
          </div>
        )}
    </div>
  );
}
