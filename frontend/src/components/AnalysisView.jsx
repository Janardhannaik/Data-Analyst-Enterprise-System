// import React from "react";

// export default function AnalysisView({ analysis }) {
//   if (!analysis) return null;

//   return (
//     <div className="mt-6 space-y-6">
//       {/* Narrative Summary */}
//       {analysis.narrative && (
//         <div className="p-6 bg-black/50 border border-green-400 text-green-200 rounded-2xl shadow-lg">
//           <h3 className="font-bold text-lg mb-2">📝 AI Summary</h3>
//           <p className="whitespace-pre-line">{analysis.narrative}</p>
//         </div>
//       )}

//       {/* Summary */}
//       {analysis.summary && (
//         <div className="p-6 bg-black/40 backdrop-blur-lg rounded-2xl border border-white/30 text-white shadow-lg">
//           <h3 className="font-bold text-lg mb-2 text-cyan-300">
//             📊 Data Summary
//           </h3>
//           <p>Total Rows: {analysis.summary.rows}</p>
//           <p>Total Columns: {analysis.summary.columns}</p>
//           <p>Missing Values: {analysis.summary.missing_values}</p>
//         </div>
//       )}

//       {/* KPIs */}
//       {analysis.kpis && (
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           {Object.entries(analysis.kpis).map(([k, v]) => (
//             <div
//               key={k}
//               className="p-6 bg-black/50 border border-white/40 text-white text-center rounded-2xl backdrop-blur-md shadow-lg"
//             >
//               <h3 className="font-bold">{k}</h3>
//               <p className="text-2xl">{v}</p>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Chart Images */}
//       {analysis.chart_urls?.length > 0 && (
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           {analysis.chart_urls.map((url, idx) => (
//             <div
//               key={idx}
//               className="p-4 bg-black/50 border border-white/30 rounded-2xl backdrop-blur-md shadow-lg"
//             >
//               <img
//                 src={`http://localhost:5001${url}`}
//                 alt={`chart-${idx}`}
//                 className="rounded-xl shadow-md w-full"
//               />
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Patterns & Insights */}
//       {analysis.patterns?.length > 0 && (
//         <div className="p-6 bg-black/50 border border-white/40 text-white rounded-2xl backdrop-blur-md shadow-lg">
//           <h3 className="font-bold text-lg text-yellow-300 mb-2">
//             🔎 Patterns & Insights
//           </h3>
//           <ul className="list-disc pl-5 space-y-1">
//             {analysis.patterns.map((p, idx) => (
//               <li key={idx}>{p}</li>
//             ))}
//           </ul>
//         </div>
//       )}

//       {/* Areas of Improvement */}
//       {analysis.improvement?.length > 0 && (
//         <div className="p-6 bg-black/50 border border-white/40 text-white rounded-2xl backdrop-blur-md shadow-lg">
//           <h3 className="font-bold text-lg text-red-400 mb-2">
//             ⚡ Areas of Improvement
//           </h3>
//           <ul className="list-disc pl-5 space-y-1">
//             {analysis.improvement.map((i, idx) => (
//               <li key={idx}>{i}</li>
//             ))}
//           </ul>
//         </div>
//       )}

//       {/* Predictions */}
//       {analysis.predictions?.length > 0 && (
//         <div className="p-6 bg-black/50 border border-white/40 text-white rounded-2xl backdrop-blur-md shadow-lg">
//           <h3 className="font-bold text-lg text-purple-300 mb-2">
//             🤖 Predictions
//           </h3>
//           <ul className="list-disc pl-5 space-y-1">
//             {analysis.predictions.map((p, idx) => (
//               <li key={idx}>{p}</li>
//             ))}
//           </ul>
//         </div>
//       )}

//       {/* Download Button */}
//       {analysis.download && (
//         <a
//           href={`http://localhost:5001${analysis.download}`}
//           className="inline-block mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl shadow-md transition"
//         >
//           ⬇️ Download Processed Data
//         </a>
//       )}
//     </div>
//   );
// }

import React from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function AnalysisView({ analysis }) {
  if (!analysis) return null;

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
    <div id="analysis-report" className="mt-6 space-y-6">
      {/* Narrative Summary */}
      {analysis.narrative && (
        <div className="p-6 bg-black/50 border border-green-400 text-green-200 rounded-2xl shadow-lg">
          <h3 className="font-bold text-lg mb-2">📝 AI Summary</h3>
          <p className="whitespace-pre-line">{analysis.narrative}</p>
        </div>
      )}

      {/* Summary */}
      {analysis.summary && (
        <div className="p-6 bg-black/40 backdrop-blur-lg rounded-2xl border border-white/30 text-white shadow-lg">
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
              className="p-6 bg-black/50 border border-white/40 text-white text-center rounded-2xl backdrop-blur-md shadow-lg"
            >
              <h3 className="font-bold">{k}</h3>
              <p className="text-2xl">{v}</p>
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
              className="p-4 bg-black/50 border border-white/30 rounded-2xl backdrop-blur-md shadow-lg"
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
        <div className="p-6 bg-black/50 border border-white/40 text-white rounded-2xl backdrop-blur-md shadow-lg">
          <h3 className="font-bold text-lg text-yellow-300 mb-2">
            🔎 Patterns & Insights
          </h3>
          <ul className="list-disc pl-5 space-y-1">
            {analysis.patterns.map((p, idx) => (
              <li key={idx}>{p}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Areas of Improvement */}
      {analysis.improvement?.length > 0 && (
        <div className="p-6 bg-black/50 border border-white/40 text-white rounded-2xl backdrop-blur-md shadow-lg">
          <h3 className="font-bold text-lg text-red-400 mb-2">
            ⚡ Areas of Improvement
          </h3>
          <ul className="list-disc pl-5 space-y-1">
            {analysis.improvement.map((i, idx) => (
              <li key={idx}>{i}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Predictions */}
      {analysis.predictions?.length > 0 && (
        <div className="p-6 bg-black/50 border border-white/40 text-white rounded-2xl backdrop-blur-md shadow-lg">
          <h3 className="font-bold text-lg text-purple-300 mb-2">
            🤖 Predictions
          </h3>
          <ul className="list-disc pl-5 space-y-1">
            {analysis.predictions.map((p, idx) => (
              <li key={idx}>{p}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Download Buttons */}
      <div className="flex gap-4 mt-6">
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
  );
}
