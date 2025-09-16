import React, { useState, useEffect } from "react";
import API from "../api/api";
import AnalysisView from "../components/AnalysisView";

export default function UploadHistory() {
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUpload, setSelectedUpload] = useState(null);

  useEffect(() => {
    fetchUploads();
  }, []);

  const fetchUploads = async () => {
    try {
      const res = await API.get("/uploads");
      setUploads(res.data.uploads || []);
    } catch (err) {
      console.error("History API error:", err);
      alert("Failed to load history.");
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="pt-28 text-white text-center">Loading history...</div>
    );
  if (!uploads.length)
    return (
      <div className="pt-28 text-white text-center">No uploads found.</div>
    );

  return (
    <div className="relative min-h-screen flex items-start justify-center px-4 pt-28 bg-transparent">
      {/* Centered Card with Dashboard-style Gradient */}
      <div className="w-full max-w-5xl rounded-2xl p-[2px] bg-gradient-to-r from-cyan-400/40 via-purple-500/30 to-pink-500/40 shadow-2xl">
        <div className="rounded-2xl bg-black/30 backdrop-blur-lg p-8 space-y-6 border border-white/10">
          {/* Heading with Emoji */}
          <h2 className="text-3xl font-extrabold flex items-center gap-2 justify-center">
            <span>📂</span>
            <span className="bg-gradient-to-r from-cyan-300 to-purple-400 bg-clip-text text-transparent">
              Upload History
            </span>
          </h2>

          {/* History List */}
          {!selectedUpload ? (
            <div className="space-y-3">
              {uploads.map((u) => (
                <div
                  key={u._id}
                  onClick={() => setSelectedUpload(u)}
                  className="p-3 bg-black/40 border border-white/20 rounded-xl cursor-pointer hover:bg-black/60 transition"
                >
                  {u.filename} — {new Date(u.createdAt).toLocaleString()}
                </div>
              ))}
            </div>
          ) : (
            <div>
              <button
                onClick={() => setSelectedUpload(null)}
                className="mb-4 bg-black/40 border border-white/20 px-3 py-1 rounded-lg shadow hover:bg-black/60 transition"
              >
                ⬅ Back to History
              </button>
              <h3 className="text-xl font-semibold mb-3 text-white">
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
