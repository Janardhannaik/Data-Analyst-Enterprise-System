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

  if (loading) return <div>Loading history...</div>;
  if (!uploads.length) return <div>No uploads found.</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-6 text-white">
      <h2 className="text-3xl font-bold mb-4">📂 Upload History</h2>

      {!selectedUpload ? (
        <div className="space-y-3">
          {uploads.map((u) => (
            <div
              key={u._id}
              onClick={() => setSelectedUpload(u)}
              className="p-3 bg-black/40 border border-white rounded-xl cursor-pointer hover:bg-black/60"
            >
              {u.filename} — {new Date(u.createdAt).toLocaleString()}
            </div>
          ))}
        </div>
      ) : (
        <div>
          <button
            onClick={() => setSelectedUpload(null)}
            className="mb-4 bg-black/60 border border-white px-3 py-1 rounded-lg"
          >
            ⬅ Back to History
          </button>
          <h3 className="text-xl font-semibold mb-3">
            {selectedUpload.filename} — Uploaded on{" "}
            {new Date(selectedUpload.createdAt).toLocaleDateString()}
          </h3>
          <AnalysisView analysis={selectedUpload.analysis} />
        </div>
      )}
    </div>
  );
}
