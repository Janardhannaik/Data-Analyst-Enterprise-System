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
    <div className="max-w-5xl mx-auto space-y-6 p-6">
      <h2 className="text-2xl font-bold mb-4 text-white">
        📂 Upload Your Business Data
      </h2>

      <form onSubmit={submit} className="space-y-3">
        <input
          type="file"
          accept=".csv,.xlsx,.xls"
          onChange={(e) => setFile(e.target.files[0])}
          className="block w-full border p-2 rounded-lg bg-black/30 text-white"
        />
        <button
          type="submit"
          disabled={processing}
          className="bg-black text-white px-6 py-2 rounded-full border border-white hover:bg-black/80"
        >
          {processing ? "Analyzing..." : "Upload & Analyze"}
        </button>
      </form>

      {/* Show analysis results using shared component */}
      {analysis && <AnalysisView analysis={analysis} />}
    </div>
  );
}
