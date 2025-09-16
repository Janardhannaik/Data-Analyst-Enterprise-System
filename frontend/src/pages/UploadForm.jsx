import React, { useState } from "react";
import API from "../api/api";
import AnalysisView from "../components/AnalysisView";

export default function UploadForm() {
  const [file, setFile] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a file first.");

    const form = new FormData();
    form.append("file", file);

    try {
      setProcessing(true);
      const res = await API.post("/uploads", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setAnalysis(res.data.upload.analysis);
    } catch (err) {
      alert("Upload failed: " + (err.response?.data?.error || err.message));
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 pt-28 bg-transparent">
      {/* Centered Card with Dashboard-style Gradient */}
      <div className="w-full max-w-5xl rounded-2xl p-[2px] bg-gradient-to-r from-cyan-400/40 via-purple-500/30 to-pink-500/40 shadow-2xl">
        <div className="rounded-2xl bg-black/30 backdrop-blur-lg p-8 space-y-6 border border-white/10">
          {/* Heading with emoji keeping original color */}
          <h2 className="text-2xl font-extrabold flex items-center gap-2 justify-center">
            <span>📂</span>
            <span className="bg-gradient-to-r from-cyan-300 to-purple-400 bg-clip-text text-transparent">
              Upload Your Business Data
            </span>
          </h2>

          {/* Upload Form */}
          <form onSubmit={submit} className="space-y-3">
            <input
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={(e) => setFile(e.target.files[0])}
              className="block w-full border p-2 rounded-lg bg-black/30 text-white border-white/20"
            />
            <button
              type="submit"
              disabled={processing}
              className="bg-black/30 text-white px-6 py-2 rounded-full border border-white/20 shadow-lg hover:bg-black/50 transition"
            >
              {processing ? "Analyzing..." : "Upload & Analyze"}
            </button>
          </form>

          {/* Show analysis results */}
          {analysis && (
            <div>
              <h3 className="text-xl font-semibold mb-3 text-white flex items-center gap-2">
                📊 Analysis Results
              </h3>
              <AnalysisView analysis={analysis} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
