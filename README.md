# Automotive Supply Chain Analysis

Exploratory analysis of an automotive supply-chain dataset, using interactive Plotly visualizations to investigate sales, product mix, supplier performance, shipping, and customer feedback.

> **Portfolio focus:** Python EDA, interactive visualization, SQL analysis, and a Power BI reporting plan.

## Business Objective
Explore how products, suppliers, customers, and shipping activity relate to sales and quantity patterns. This is descriptive analysis, not proof of causation.

## Business Questions
- Which suppliers contribute the most sales or quantities?
- How are sales distributed across cities and car makers?
- What patterns appear in order dates, ship dates, and shipping modes?
- How does customer feedback vary across records?

## Existing Notebook
- `eda-on-supplychain-dataset-using-plotly-for-viz.ipynb` — exploratory analysis and interactive visualizations.

## End-to-End Analytics Starter Kit
- [SQL queries](sql/analysis_queries.sql) — SQL Server templates for profiling, monthly trends, supplier performance, lead time, and data quality.
- [Python analysis script](python/analyze_supply_chain.py) — reusable script that generates data-quality reports and summary tables.
- [Power BI dashboard blueprint](powerbi/dashboard_blueprint.md) — suggested dashboard pages, example DAX measures, and design standards.
- [Profile README template](PROFILE_README_TEMPLATE.md) — draft professional GitHub profile content.

## Run the Python Script
1. Install Python and Pandas: `pip install pandas`
2. Put the CSV at a local path.
3. Run:

```bash
python python/analyze_supply_chain.py --input data/Car_SupplyChainManagementDataSet.csv
```

The script writes normalized data and summary CSVs into `outputs/`. The original notebook references `/kaggle/input/supply-chain-management-for-car/Car_SupplyChainManagementDataSet.csv`; update paths for your environment.

## SQL & Power BI
The SQL templates assume a SQL Server table named `dbo.SupplyChain`. Update the table and column names to match your imported dataset. Follow the Power BI blueprint to build executive, supplier, shipping, and customer/product pages.

## Limitations
- Confirm field definitions, row grain, date parsing, and units before interpreting metrics.
- Order-to-ship lead time is not the same as late-delivery rate; late delivery requires a reliable promised date or SLA.
- This repository does not claim unverified model scores or business impact.

## Next Steps
Add validated findings, dashboard screenshots, and reproducible data-quality checks after running the analysis.

---
Portfolio project demonstrating supply-chain data exploration and an end-to-end analytics workflow.
