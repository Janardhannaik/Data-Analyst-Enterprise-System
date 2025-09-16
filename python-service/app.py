




from flask import Flask, request, jsonify, send_file
import pandas as pd
import numpy as np
import os
from datetime import datetime
import matplotlib
matplotlib.use("Agg")  # use non-GUI backend
import matplotlib.pyplot as plt
import seaborn as sns

app = Flask(__name__)

UPLOAD_FOLDER = "uploads"
REPORTS_FOLDER = "reports"
CHARTS_FOLDER = "charts"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(REPORTS_FOLDER, exist_ok=True)
os.makedirs(CHARTS_FOLDER, exist_ok=True)


def save_chart(fig, name):
    """Save chart as PNG and return relative URL"""
    path = os.path.join(CHARTS_FOLDER, name)
    fig.savefig(path, bbox_inches="tight", dpi=150)
    plt.close(fig)
    return f"/chart/{name}"


def generate_narrative(df, summary, kpis, improvement, predictions):
    """Generate English summary of analysis"""
    lines = []

    # General info
    lines.append(
        f"The dataset contains {summary['rows']} rows and {summary['columns']} columns "
        f"with {summary['missing_values']} missing values."
    )

    # Numeric stats
    if summary.get("numeric_stats"):
        for col, stats in summary["numeric_stats"].items():
            lines.append(
                f"For **{col}**, the average value is {stats['mean']:.2f}, "
                f"with a minimum of {stats['min']:.2f} and a maximum of {stats['max']:.2f}."
            )

    # KPIs
    if kpis:
        for k, v in kpis.items():
            lines.append(f"The key performance indicator **{k}** is {v}.")

    # Areas of improvement
    if improvement:
        lines.append("Potential areas of improvement were identified:")
        for imp in improvement:
            lines.append(f"- {imp}")

    # Predictions
    if predictions:
        lines.append("Based on the trends, predictions suggest:")
        for pred in predictions:
            lines.append(f"- {pred}")

    return " ".join(lines)


@app.route("/analyze", methods=["POST"])
def analyze():
    try:
        file = request.files["file"]
        filepath = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(filepath)

        # Read file with encoding fallback
        if filepath.endswith(".csv"):
            try:
                df = pd.read_csv(filepath, encoding="utf-8")
            except UnicodeDecodeError:
                df = pd.read_csv(filepath, encoding="latin1")
        else:
            df = pd.read_excel(filepath)

        numeric_cols = df.select_dtypes(include=[np.number]).columns
        cat_cols = df.select_dtypes(include=["object"]).columns

        # 1. Basic Summary
        summary_stats = {}
        for col in numeric_cols:
            summary_stats[col] = {
                "mean": float(df[col].mean()),
                "median": float(df[col].median()),
                "min": float(df[col].min()),
                "max": float(df[col].max()),
                "variance": float(df[col].var())
            }

        basic_summary = {
            "rows": df.shape[0],
            "columns": df.shape[1],
            "missing_values": int(df.isnull().sum().sum()),
            "numeric_stats": summary_stats
        }

        # 2. Visual Insights (Charts)
        chart_urls = []
        for col in numeric_cols:
            fig, ax = plt.subplots()
            sns.histplot(df[col].dropna(), kde=True, ax=ax, color="skyblue")
            ax.set_title(f"Distribution of {col}")
            ax.set_xlabel(col)
            url = save_chart(fig, f"dist_{col}.png")
            chart_urls.append(url)

        if len(numeric_cols) > 1:
            fig, ax = plt.subplots(figsize=(6, 4))
            sns.heatmap(df[numeric_cols].corr(), annot=True, cmap="coolwarm", ax=ax)
            ax.set_title("Correlation Heatmap")
            url = save_chart(fig, "correlation_heatmap.png")
            chart_urls.append(url)

        if len(cat_cols) > 0:
            col = cat_cols[0]
            fig, ax = plt.subplots()
            df[col].value_counts().head(5).plot.pie(
                autopct="%1.1f%%", ax=ax, startangle=90, cmap="Set2"
            )
            ax.set_ylabel("")
            ax.set_title(f"Top 5 Categories in {col}")
            url = save_chart(fig, f"pie_{col}.png")
            chart_urls.append(url)

        # 3. Patterns & Relationships
        correlations = df.corr(numeric_only=True).round(2).to_dict()
        patterns = [
            f"{a} vs {b} correlation = {v}"
            for a in correlations for b, v in correlations[a].items() if a != b
        ]

        # 4. KPIs
        kpis = {}
        if "sales" in df.columns and "profit" in df.columns:
            kpis["Profit Margin (%)"] = round(df["profit"].sum() / df["sales"].sum() * 100, 2)
        if "churn" in df.columns:
            kpis["Churn Rate (%)"] = round(df["churn"].mean() * 100, 2)
        if "revenue" in df.columns and "ads_spend" in df.columns:
            kpis["ROI (%)"] = round(
                (df["revenue"].sum() - df["ads_spend"].sum()) / df["ads_spend"].sum() * 100, 2
            )

        # 5. Areas of Improvement
        improvement = []
        if "region" in df.columns and "sales" in df.columns:
            sales_by_region = df.groupby("region")["sales"].sum()
            worst_region = sales_by_region.idxmin()
            best_region = sales_by_region.idxmax()
            gap = round(
                (sales_by_region.max() - sales_by_region.min()) / sales_by_region.max() * 100, 2
            )
            improvement.append(
                f"Region {worst_region} underperforms compared to {best_region} by {gap}%"
            )

        # 6. Predictions
        predictions = []
        if "sales" in df.columns:
            next_month = df["sales"].mean() * 1.05
            predictions.append(f"Forecast: Next month sales ≈ {round(next_month,2)}")

        # Generate narrative
        narrative = generate_narrative(df, basic_summary, kpis, improvement, predictions)

        # Save cleaned file
        report_path = os.path.join(REPORTS_FOLDER, f"analysis_{datetime.now().strftime('%Y%m%d%H%M%S')}.csv")
        df.to_csv(report_path, index=False)

        return jsonify({
            "summary": basic_summary,
            "patterns": patterns,
            "kpis": kpis,
            "improvement": improvement,
            "predictions": predictions,
            "chart_urls": chart_urls,
            "narrative": narrative,
            "download": f"/download/{os.path.basename(report_path)}"
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/download/<filename>", methods=["GET"])
def download(filename):
    return send_file(os.path.join(REPORTS_FOLDER, filename), as_attachment=True)


@app.route("/chart/<filename>", methods=["GET"])
def chart(filename):
    return send_file(os.path.join(CHARTS_FOLDER, filename), mimetype="image/png")


if __name__ == "__main__":
    app.run(port=5001, debug=True)







