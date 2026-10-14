# Automotive Supply Chain Analysis

Exploratory analysis of an automotive supply-chain dataset, using interactive Plotly visualizations to investigate sales, product mix, supplier performance, shipping, and customer feedback.

> **Portfolio focus:** Python-based EDA, interactive data visualization, and translating operational data into business questions.

## Business Objective

Explore how products, suppliers, customers, and shipping activity relate to sales and quantity patterns. The analysis is intended to help an analyst identify trends worth investigating—not to claim causal relationships.

## Business Questions

- Which suppliers contribute the most sales or order quantities?
- How are sales and quantities distributed across cities and customer segments?
- Which car makers and models appear most frequently in the dataset?
- What patterns appear across order dates, ship dates, and shipping modes?
- How does customer feedback vary across the available records?

## Analysis Workflow

1. Load the source data and inspect schema, missingness, and summary statistics.
2. Convert order and shipment fields to date types.
3. Select fields relevant to the questions being explored.
4. Compare sales, quantity, suppliers, brands, geography, and feedback.
5. Build interactive charts and tables with Plotly for deeper exploration.

## Tech Stack

- **Language:** Python
- **Data wrangling:** Pandas, NumPy
- **Interactive visualization:** Plotly Express, Plotly Figure Factory
- **Supporting visualization:** Matplotlib, Seaborn
- **Analytics methods:** EDA, descriptive statistics, date parsing, categorical comparisons

## Repository Contents

- `eda-on-supplychain-dataset-using-plotly-for-viz.ipynb` — exploratory analysis and visualizations

## Run the Notebook

1. Clone or download the repository.
2. Open the notebook in Jupyter or Google Colab.
3. Install the packages used: `pandas`, `numpy`, `plotly`, `matplotlib`, and `seaborn`.
4. Update the dataset path and run the notebook cells in order.

The notebook currently references `/kaggle/input/supply-chain-management-for-car/Car_SupplyChainManagementDataSet.csv`. Make sure the source dataset is available and update the path for your environment.

## Interpretation Notes

- Sales and quantity comparisons are descriptive and do not establish causation.
- Validate field definitions and data quality before using results for business decisions.
- No performance or business-impact figures are claimed in this README; consult the notebook outputs for the analysis.

## Potential Extensions

- Add a documented data-quality report and reusable cleaning functions.
- Create supplier scorecards using clearly defined KPIs.
- Compare order-to-shipment lead times and late-shipment rates if the required fields support reliable definitions.
- Publish selected chart screenshots and a concise findings section.

---
Created as a portfolio project demonstrating interactive supply-chain data exploration.