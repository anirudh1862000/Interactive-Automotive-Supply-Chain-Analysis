# EDA on Supply Chain Dataset Using Plotly

## Project Overview
This project performs exploratory data analysis on an automotive supply chain dataset, with a strong focus on interactive visual storytelling using Plotly.

Notebook: `eda-on-supplychain-dataset-using-plotly-for-viz.ipynb`

## Dataset
The notebook loads:

`/kaggle/input/supply-chain-management-for-car/Car_SupplyChainManagementDataSet.csv`

The data includes supplier, product, customer, order, shipping, and transaction fields such as:
- `SupplierName`, `CarMaker`, `CarModel`
- `OrderDate`, `ShipDate`, `ShipMode`, `Shipping`
- `City`, `CountryCode`, `Gender`
- `Sales`, `Quantity`, `Discount`
- `CustomerFeedback`

## Workflow Covered in Notebook
- Imports and setup for analysis/visualization (`pandas`, `numpy`, `plotly`, `seaborn`, `matplotlib`)
- Data loading and initial structure inspection
- Feature reduction by dropping less relevant columns
- Date conversion for order and shipment fields
- Numeric summary (`describe`) and dataset info checks
- EDA focused on business questions, including:
  - Sales and quantity patterns by gender and city
  - Top-performing suppliers by sales/quantity
  - Car brand distribution and most-sold brands
  - Supplier and customer feedback trends (best/worst feedback context)
  - Comparative visual analysis using Plotly histograms, bars, and tables

## Tech Stack
- Python
- Pandas, NumPy
- Plotly Express, Plotly Offline, Plotly Figure Factory
- Seaborn, Matplotlib (supporting visuals)

## How to Run
1. Open `eda-on-supplychain-dataset-using-plotly-for-viz.ipynb`.
2. Install required packages if needed:
   - `pandas`
   - `numpy`
   - `plotly`
   - `seaborn`
   - `matplotlib`
3. Update dataset path if running outside Kaggle.
4. Run all cells in order.

## Key Output
An interactive EDA report that highlights supplier performance, demand and sales distribution, and logistics/customer feedback trends for automotive supply chain decision support.
