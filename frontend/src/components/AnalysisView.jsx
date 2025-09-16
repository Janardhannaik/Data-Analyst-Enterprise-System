import React from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

export default function AnalysisView({ analysis }) {
  if (!analysis) return null;

  // Particle init
  const particlesInit = async (engine) => {
    await loadFull(engine);
  };

  // Download JSON
  const handleDownloadJSON = () => {
    const blob = new Blob([JSON.stringify(analysis, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "analysis_report.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  // Download PDF
  const handleDownloadPDF = async () => {
    const element = document.getElementById("analysis-report");
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("analysis_report.pdf");
  };

  return (
    <div className="relative mt-6">
      {/* Particle background */}
      <Particles
        id="analysisParticles"
        init={particlesInit}
        options={{
          background: { color: { value: "transparent" } },
          fpsLimit: 60,
          interactivity: {
            events: {
              onHover: { enable: true, mode: "repulse" },
              resize: true,
            },
            modes: { repulse: { distance: 100, duration: 0.4 } },
          },
          particles: {
            color: { value: "#00ffcc" },
            links: {
              color: "#00ffcc",
              distance: 120,
              enable: true,
              opacity: 0.3,
              width: 1,
            },
            move: { enable: true, speed: 1, outModes: { default: "bounce" } },
            number: { density: { enable: true, area: 800 }, value: 40 },
            opacity: { value: 0.5 },
            shape: { type: "circle" },
            size: { value: { min: 1, max: 3 } },
          },
          detectRetina: true,
        }}
        className="absolute inset-0 -z-10"
      />

      <div
        id="analysis-report"
        className="relative z-10 space-y-6 p-6 border border-cyan-400/40 rounded-2xl shadow-2xl"
      >
        {/* Narrative Summary */}
        {analysis.narrative && (
          <div className="p-6 border border-green-400/50 text-green-300 rounded-2xl shadow-lg">
            <h3 className="font-bold text-lg mb-2">📝 AI Summary</h3>
            <p className="whitespace-pre-line">{analysis.narrative}</p>
          </div>
        )}

        {/* Summary */}
        {analysis.summary && (
          <div className="p-6 border border-cyan-400/40 text-cyan-200 rounded-2xl shadow-lg">
            <h3 className="font-bold text-lg mb-2 text-cyan-300">
              📊 Data Summary
            </h3>
            <p>Total Rows: {analysis.summary.rows}</p>
            <p>Total Columns: {analysis.summary.columns}</p>
            <p>Missing Values: {analysis.summary.missing_values}</p>
          </div>
        )}

        {/* KPIs */}
        {analysis.kpis && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(analysis.kpis).map(([k, v]) => (
              <div
                key={k}
                className="p-6 border border-white/30 text-white text-center rounded-2xl shadow-lg"
              >
                <h3 className="font-bold">{k}</h3>
                <p className="text-2xl text-cyan-300">{v}</p>
              </div>
            ))}
          </div>
        )}

        {/* Chart Images */}
        {analysis.chart_urls?.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analysis.chart_urls.map((url, idx) => (
              <div
                key={idx}
                className="p-4 border border-purple-400/40 rounded-2xl shadow-lg"
              >
                <img
                  src={`http://localhost:5001${url}`}
                  alt={`chart-${idx}`}
                  className="rounded-xl shadow-md w-full"
                />
              </div>
            ))}
          </div>
        )}

        {/* Patterns & Insights */}
        {analysis.patterns?.length > 0 && (
          <div className="p-6 border border-yellow-400/40 text-yellow-300 rounded-2xl shadow-lg">
            <h3 className="font-bold text-lg mb-2">🔎 Patterns & Insights</h3>
            <ul className="list-disc pl-5 space-y-1">
              {analysis.patterns.map((p, idx) => (
                <li key={idx}>{p}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Areas of Improvement */}
        {analysis.improvement?.length > 0 && (
          <div className="p-6 border border-red-400/40 text-red-300 rounded-2xl shadow-lg">
            <h3 className="font-bold text-lg mb-2">⚡ Areas of Improvement</h3>
            <ul className="list-disc pl-5 space-y-1">
              {analysis.improvement.map((i, idx) => (
                <li key={idx}>{i}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Predictions */}
        {analysis.predictions?.length > 0 && (
          <div className="p-6 border border-purple-400/40 text-purple-300 rounded-2xl shadow-lg">
            <h3 className="font-bold text-lg mb-2">🤖 Predictions</h3>
            <ul className="list-disc pl-5 space-y-1">
              {analysis.predictions.map((p, idx) => (
                <li key={idx}>{p}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Download Buttons */}
        <div className="flex flex-wrap gap-4 mt-6">
          {analysis.download && (
            <a
              href={`http://localhost:5001${analysis.download}`}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl shadow-md transition"
            >
              ⬇️ Download Processed Data
            </a>
          )}

          <button
            onClick={handleDownloadJSON}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl shadow-md transition"
          >
            📥 Download JSON Report
          </button>

          <button
            onClick={handleDownloadPDF}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl shadow-md transition"
          >
            📄 Download PDF Report
          </button>
        </div>
      </div>
    </div>
  );
}
