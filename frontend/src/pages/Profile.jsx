// import React, { useEffect, useState } from "react";
// import API from "../api/api";

// export default function Profile() {
//   const [me, setMe] = useState({});
//   useEffect(() => {
//     API.get("/auth/me")
//       .then((res) => setMe(res.data))
//       .catch(() => {});
//   }, []);
//   return (
//     <div className="max-w-md mx-auto">
//       <h2 className="text-xl">Profile</h2>
//       <div className="card">
//         <div>Email: {me.email}</div>
//         <div>Businesses: {me.businesses?.length || 0}</div>
//       </div>
//     </div>
//   );
// }

// import React, { useEffect, useState } from "react";
// import API from "../api/api";
// import AnalysisView from "../components/AnalysisView";

// export default function Profile() {
//   const [me, setMe] = useState({});
//   const [uploads, setUploads] = useState([]);
//   const [selected, setSelected] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     async function fetchProfileAndUploads() {
//       try {
//         const [meRes, uploadsRes] = await Promise.all([
//           API.get("/auth/me"),
//           API.get("/uploads"),
//         ]);

//         setMe(meRes.data || {});
//         const u = uploadsRes.data.uploads || [];
//         setUploads(u);

//         if (u.length > 0) {
//           setSelected(u[0]); // show latest by default
//         }
//       } catch (err) {
//         console.error("Profile fetch error:", err);
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchProfileAndUploads();
//   }, []);

//   return (
//     <div className="max-w-6xl mx-auto space-y-6 p-6">
//       {/* Profile Info */}
//       <div className="p-6 bg-black/40 border border-white/30 text-white rounded-2xl shadow-md">
//         <h2 className="text-2xl font-bold mb-2">👤 Profile</h2>
//         <p>Email: {me.email || "—"}</p>
//         <p>Businesses: {me.businesses?.length || 0}</p>
//         <p>Total Uploads: {uploads.length}</p>
//       </div>

//       {/* Upload History */}
//       <div>
//         <h3 className="text-xl font-semibold mb-3 text-white">📂 My Uploads</h3>
//         {loading && <p className="text-gray-400">Loading uploads...</p>}
//         {!loading && uploads.length === 0 && (
//           <p className="text-gray-400">No uploads yet.</p>
//         )}

//         {/* Upload List */}
//         <div className="space-y-3">
//           {uploads.map((u) => (
//             <div
//               key={u._id}
//               onClick={() => setSelected(u)}
//               className={`p-3 rounded-xl cursor-pointer border ${
//                 selected?._id === u._id
//                   ? "bg-blue-600 text-white border-blue-400"
//                   : "bg-black/50 text-white border-white/30 hover:bg-black/70"
//               }`}
//             >
//               {u.filename} — {new Date(u.createdAt).toLocaleString()}
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Analysis Viewer */}
//       {selected && (
//         <div>
//           <h3 className="text-xl font-semibold mb-3 text-white">
//             📊 Analysis for {selected.filename}
//           </h3>
//           <AnalysisView analysis={selected.analysis} />
//         </div>
//       )}
//     </div>
//   );
// }

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

        // we can still fetch full uploads if you want deep analysis
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
    <div className="max-w-6xl mx-auto space-y-6 p-6">
      {/* Profile Info */}
      <div className="p-6 bg-black/40 border border-white/30 text-white rounded-2xl shadow-md">
        <h2 className="text-2xl font-bold mb-2">👤 Profile</h2>
        <p>Email: {me.email || "—"}</p>
        <p>Businesses: {me.businesses?.length || 0}</p>
        <p>Total Uploads: {me.totalUploads ?? 0}</p>
      </div>

      {/* Recent Uploads (from /auth/me) */}
      {me.recentUploads && me.recentUploads.length > 0 && (
        <div className="p-6 bg-black/30 border border-white/20 text-white rounded-2xl shadow-md">
          <h3 className="text-xl font-semibold mb-3">🕒 Recent Uploads</h3>
          <ul className="space-y-2">
            {me.recentUploads.map((u, idx) => (
              <li
                key={idx}
                className="p-3 bg-black/50 border border-white/30 rounded-xl"
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
        <h3 className="text-xl font-semibold mb-3 text-white">📂 My Uploads</h3>
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
                  ? "bg-blue-600 text-white border-blue-400"
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
          <h3 className="text-xl font-semibold mb-3 text-white">
            📊 Analysis for {selected.filename}
          </h3>
          <AnalysisView analysis={selected.analysis} />
        </div>
      )}
    </div>
  );
}
