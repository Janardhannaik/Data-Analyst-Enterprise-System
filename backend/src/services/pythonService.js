const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const PY_URL = process.env.PYTHON_SERVICE_URL || "http://localhost:5001";

/**
 * Analyze file using Python service
 */
async function analyzeFile(filePath) {
  try {
    const form = new FormData();
    form.append("file", fs.createReadStream(filePath));

    const res = await axios.post(`${PY_URL}/analyze`, form, {
      headers: form.getHeaders(),
      timeout: 5 * 60 * 1000,
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
    });

    return res.data; // contains kpis, suggestions, chartData, table
  } catch (err) {
    console.error("Python service error:", err.message);
    throw err;
  }
}

module.exports = { analyzeFile };
