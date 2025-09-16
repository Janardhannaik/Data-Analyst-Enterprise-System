import React, { useState } from "react";
import API from "../api/api";

export default function ComparePage() {
  const [left, setLeft] = useState("");
  const [right, setRight] = useState("");
  const [result, setResult] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/uploads/compare", {
        leftId: left,
        rightId: right,
      });
      setResult(res.data);
    } catch (err) {
      console.error(err);
      alert("Compare failed");
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <h2 className="text-xl">Compare Uploads</h2>
      <form onSubmit={submit} className="space-y-3">
        <input
          placeholder="Left upload ID"
          value={left}
          onChange={(e) => setLeft(e.target.value)}
        />
        <input
          placeholder="Right upload ID"
          value={right}
          onChange={(e) => setRight(e.target.value)}
        />
        <button className="btn" type="submit">
          Compare
        </button>
      </form>

      {result && (
        <div className="card">
          <h3>Comparison Results</h3>
          <pre style={{ whiteSpace: "pre-wrap" }}>
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
