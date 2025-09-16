import React, { useEffect, useState } from "react";
import API from "../api/api";
import AnalysisView from "../components/AnalysisView";

export default function Profile() {
  const [me, setMe] = useState({});
  const [uploads, setUploads] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfileAndUploads() {
      try {
        const meRes = await API.get("/auth/me");
        setMe(meRes.data || {});

        const uploadsRes = await API.get("/uploads");
        const u = uploadsRes.data.uploads || [];
        setUploads(u);

        if (u.length > 0) {
          setSelected(u[0]); // show latest by default
        }
      } catch (err) {
        console.error("Profile fetch error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchProfileAndUploads();
  }, []);

  return (
    <div className="relative min-h-screen pt-28 flex justify-center px-4 bg-transparent">
      <div className="w-full max-w-6xl rounded-2xl p-[2px] bg-gradient-to-r from-cyan-400 via-purple-600 to-pink-500 shadow-2xl">
        <div className="rounded-2xl bg-black/70 backdrop-blur-lg p-8 space-y-6 border border-white/20">
          {/* Profile Heading */}
          <h2 className="text-2xl font-extrabold flex items-center gap-2 justify-center bg-gradient-to-r from-cyan-300 to-purple-400 bg-clip-text text-transparent">
            <span role="img" aria-label="profile">
              👤
            </span>{" "}
            Profile
          </h2>

          {/* Profile Info */}
          <div className="p-6 bg-black/60 border border-white/20 rounded-2xl shadow-md space-y-1 text-white">
            <p>Email: {me.email || "—"}</p>
            <p>Businesses: {me.businesses?.length || 0}</p>
            <p>Total Uploads: {me.totalUploads ?? 0}</p>
          </div>

          {/* Recent Uploads */}
          {me.recentUploads && me.recentUploads.length > 0 && (
            <div className="p-6 bg-black/60 border border-white/20 rounded-2xl shadow-md">
              <h3 className="text-xl font-semibold mb-3 bg-gradient-to-r from-cyan-300 to-purple-400 bg-clip-text text-transparent flex items-center gap-2">
                🕒 Recent Uploads
              </h3>
              <ul className="space-y-2">
                {me.recentUploads.map((u, idx) => (
                  <li
                    key={idx}
                    className="p-3 bg-black/50 border border-white/30 rounded-xl text-white"
                  >
                    {u.filename} — {new Date(u.createdAt).toLocaleString()} (
                    {u.status})
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Full Upload History */}
          <div>
            <h3 className="text-xl font-semibold mb-3 text-white flex items-center gap-2">
              📂 My Uploads
            </h3>
            {loading && <p className="text-gray-400">Loading uploads...</p>}
            {!loading && uploads.length === 0 && (
              <p className="text-gray-400">No uploads yet.</p>
            )}

            <div className="space-y-3">
              {uploads.map((u) => (
                <div
                  key={u._id}
                  onClick={() => setSelected(u)}
                  className={`p-3 rounded-xl cursor-pointer border ${
                    selected?._id === u._id
                      ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-blue-400 shadow-lg"
                      : "bg-black/50 text-white border-white/30 hover:bg-black/70"
                  }`}
                >
                  {u.filename} — {new Date(u.createdAt).toLocaleString()}
                </div>
              ))}
            </div>
          </div>

          {/* Analysis Viewer */}
          {selected && (
            <div>
              <h3 className="text-xl font-semibold mb-3 text-white flex items-center gap-2">
                📊 Analysis for {selected.filename}
              </h3>
              <AnalysisView analysis={selected.analysis} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
