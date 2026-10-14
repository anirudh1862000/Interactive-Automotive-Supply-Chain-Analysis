# Power BI Dashboard Blueprint — Automotive Supply Chain

Build in Power BI Desktop after confirming the source CSV fields, data types, row grain, and metric definitions.

## Page 1 — Executive Overview
- KPI cards: Total Sales, Total Quantity, row count, supplier count
- Monthly sales trend
- Sales by car maker and top suppliers
- Slicers: order date, country, city, car maker, shipping mode

## Page 2 — Supplier Performance
- Sales and quantity by supplier
- Table with supplier, row count, total sales, average discount
- Top N supplier filter with selected metric clearly labeled

## Page 3 — Shipping & Operations
- Average order-to-ship lead time by shipping mode
- Lead-time distribution and invalid-date records
- Do not call shipments late unless a reliable promised date or SLA exists.

## Page 4 — Customer & Product
- Sales and quantity by car maker/model
- Customer feedback category distribution
- Sales by country/city; avoid causal claims from descriptive charts.

## Example DAX
Adjust table and field names to match your model.

```DAX
Total Sales = SUM ( SupplyChain[Sales] )
Total Quantity = SUM ( SupplyChain[Quantity] )
Row Count = COUNTROWS ( SupplyChain )
Supplier Count = DISTINCTCOUNT ( SupplyChain[SupplierName] )
Average Sales per Row = DIVIDE ( [Total Sales], [Row Count] )
Average Lead Time (Days) =
AVERAGEX (
    FILTER (
        SupplyChain,
        NOT ISBLANK ( SupplyChain[OrderDate] )
            && NOT ISBLANK ( SupplyChain[ShipDate] )
            && SupplyChain[ShipDate] >= SupplyChain[OrderDate]
    ),
    DATEDIFF ( SupplyChain[OrderDate], SupplyChain[ShipDate], DAY )
)
```

Row Count is not necessarily unique orders. Use a distinct order identifier only if the dataset provides one.

## Design & Evidence Checklist
- Use a consistent 16:9 canvas, restrained colors, readable units, and descriptive titles.
- Document row grain, KPI definitions, missing data, and date assumptions.
- Add screenshots to an images folder after building the report.
- Publish only validated findings; do not invent business impact or KPI values.
