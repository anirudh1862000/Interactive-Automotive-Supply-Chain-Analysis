"""Starter analysis for automotive supply-chain CSV data.
Run: python python/analyze_supply_chain.py --input data/your_dataset.csv
Requires: pip install pandas
Review field mappings and outputs before drawing business conclusions.
"""
import argparse
from pathlib import Path
import pandas as pd

ALIASES = {
 "SupplierName": ["SupplierName", "Supplier Name", "supplier_name"],
 "CarMaker": ["CarMaker", "Car Maker", "car_maker", "Brand"],
 "OrderDate": ["OrderDate", "Order Date", "order_date"],
 "ShipDate": ["ShipDate", "Ship Date", "ship_date"],
 "ShipMode": ["ShipMode", "Ship Mode", "ship_mode"],
 "CountryCode": ["CountryCode", "Country Code", "country_code"],
 "City": ["City", "city"],
 "Sales": ["Sales", "sales", "Revenue"],
 "Quantity": ["Quantity", "quantity", "Qty"],
 "Discount": ["Discount", "discount"],
 "CustomerFeedback": ["CustomerFeedback", "Customer Feedback", "customer_feedback"],
}

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", required=True, help="Path to source CSV")
    parser.add_argument("--output-dir", default="outputs")
    args = parser.parse_args()
    out = Path(args.output_dir)
    out.mkdir(parents=True, exist_ok=True)

    df = pd.read_csv(args.input)
    rename = {}
    for standard, candidates in ALIASES.items():
        match = next((c for c in candidates if c in df.columns), None)
        if match:
            rename[match] = standard
    df = df.rename(columns=rename)

    for col in ("OrderDate", "ShipDate"):
        if col in df.columns:
            df[col] = pd.to_datetime(df[col], errors="coerce")
    for col in ("Sales", "Quantity", "Discount"):
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors="coerce")

    quality = pd.DataFrame({
        "column": df.columns,
        "dtype": [str(df[c].dtype) for c in df.columns],
        "missing_count": [int(df[c].isna().sum()) for c in df.columns],
        "missing_pct": [round(float(df[c].isna().mean()*100), 2) for c in df.columns],
        "distinct_count": [int(df[c].nunique(dropna=True)) for c in df.columns],
    })
    quality.to_csv(out / "data_quality_report.csv", index=False)

    kpis = {"rows": len(df), "columns": len(df.columns),
            "duplicate_rows": int(df.duplicated().sum())}
    if "Sales" in df:
        kpis["total_sales"] = float(df["Sales"].sum())
        kpis["average_sales_per_row"] = float(df["Sales"].mean())
    if "Quantity" in df:
        kpis["total_quantity"] = float(df["Quantity"].sum())
    pd.Series(kpis, name="value").to_csv(out / "summary_kpis.csv", header=True)

    if {"OrderDate", "Sales"}.issubset(df.columns):
        dated = df.dropna(subset=["OrderDate"]).copy()
        dated["order_month"] = dated["OrderDate"].dt.to_period("M").astype(str)
        dated.groupby("order_month", as_index=False).agg(
            total_sales=("Sales", "sum"), row_count=("Sales", "size")
        ).to_csv(out / "monthly_sales_trend.csv", index=False)
    if {"SupplierName", "Sales"}.issubset(df.columns):
        df.groupby("SupplierName", dropna=False, as_index=False).agg(
            total_sales=("Sales", "sum"), row_count=("Sales", "size")
        ).sort_values("total_sales", ascending=False).to_csv(
            out / "supplier_performance.csv", index=False)
    df.to_csv(out / "normalized_data.csv", index=False)
    print(f"Done. Review generated reports in {out.resolve()}")

if __name__ == "__main__":
    main()
