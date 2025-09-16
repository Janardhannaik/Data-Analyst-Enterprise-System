



import pandas as pd
import numpy as np

def analyze_table(path, max_rows=5000):
    """
    Analyze CSV or Excel file in a memory-safe way.
    - path: file path
    - max_rows: maximum rows to process for performance
    """
    ext = path.split(".")[-1].lower()

    # -------------------
    # CSV files (chunked)
    # -------------------
    if ext == "csv":
        chunks = []
        numeric_cols = []
        kpis = {"sum": 0, "count": 0, "mean": 0}

        # Read CSV in chunks
        for chunk in pd.read_csv(path, chunksize=1000):
            chunk.columns = [c.strip().lower() for c in chunk.columns]
            chunks.append(chunk)

            # Identify numeric columns
            if not numeric_cols:
                numeric_cols = chunk.select_dtypes(include=[np.number]).columns.tolist()

            # Update KPIs incrementally
            if numeric_cols:
                col = numeric_cols[0]
                kpis["sum"] += float(chunk[col].sum())
                kpis["count"] += int(chunk.shape[0])

        if kpis["count"] > 0:
            kpis["mean"] = kpis["sum"] / kpis["count"]

        # Combine only first `max_rows` for preview
        df_preview = pd.concat(chunks, ignore_index=True).head(max_rows)

    # -------------------
    # Excel files
    # -------------------
    else:
        df = pd.read_excel(path)
        df.columns = [c.strip().lower() for c in df.columns]
        numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
        kpis = {"sum": 0, "count": 0, "mean": 0}
        if numeric_cols:
            col = numeric_cols[0]
            kpis["sum"] = float(df[col].sum())
            kpis["count"] = int(df.shape[0])
            kpis["mean"] = float(df[col].mean())
        df_preview = df.head(max_rows)

    # -------------------
    # Suggestions
    # -------------------
    suggestions = []
    if kpis.get("sum", 0) == 0:
        suggestions.append("Total sum is zero; check column mapping.")
    elif kpis.get("sum", 0) > 0 and kpis.get("count", 0) > 1000:
        suggestions.append("Large dataset processed; preview limited to first rows.")

    return {
        "table": df_preview.to_dict(orient="records"),
        "kpis": kpis,
        "suggestions": suggestions
    }

