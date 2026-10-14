/* Automotive Supply Chain Analytics — SQL Server templates.
Expected table: dbo.SupplyChain. Validate table/column names and data types first.
Expected fields are based on README: SupplierName, CarMaker, OrderDate, ShipDate,
ShipMode, City, CountryCode, Sales, Quantity, Discount, CustomerFeedback. */

-- Data profile
SELECT COUNT_BIG(*) AS row_count,
       COUNT(DISTINCT SupplierName) AS supplier_count,
       SUM(COALESCE(Sales,0)) AS total_sales,
       SUM(COALESCE(Quantity,0)) AS total_quantity
FROM dbo.SupplyChain;

-- Monthly sales trend
SELECT DATEFROMPARTS(YEAR(TRY_CONVERT(date,OrderDate)),
                     MONTH(TRY_CONVERT(date,OrderDate)),1) AS order_month,
       SUM(COALESCE(Sales,0)) AS total_sales,
       SUM(COALESCE(Quantity,0)) AS total_quantity,
       COUNT_BIG(*) AS row_count
FROM dbo.SupplyChain
WHERE TRY_CONVERT(date,OrderDate) IS NOT NULL
GROUP BY DATEFROMPARTS(YEAR(TRY_CONVERT(date,OrderDate)),
                       MONTH(TRY_CONVERT(date,OrderDate)),1)
ORDER BY order_month;

-- Supplier performance
SELECT SupplierName, COUNT_BIG(*) AS row_count,
       SUM(COALESCE(Sales,0)) AS total_sales,
       SUM(COALESCE(Quantity,0)) AS total_quantity,
       AVG(TRY_CONVERT(float,Discount)) AS average_discount
FROM dbo.SupplyChain
GROUP BY SupplierName
ORDER BY total_sales DESC;

-- Shipping lead time; this is not late-delivery rate without a promised date/SLA
SELECT ShipMode, COUNT_BIG(*) AS valid_shipments,
       AVG(CAST(DATEDIFF(day,TRY_CONVERT(date,OrderDate),
                         TRY_CONVERT(date,ShipDate)) AS float)) AS avg_lead_time_days
FROM dbo.SupplyChain
WHERE TRY_CONVERT(date,OrderDate) IS NOT NULL
  AND TRY_CONVERT(date,ShipDate) IS NOT NULL
  AND TRY_CONVERT(date,ShipDate) >= TRY_CONVERT(date,OrderDate)
GROUP BY ShipMode
ORDER BY avg_lead_time_days;

-- Data quality checks
SELECT
 SUM(CASE WHEN SupplierName IS NULL THEN 1 ELSE 0 END) AS missing_supplier,
 SUM(CASE WHEN OrderDate IS NULL THEN 1 ELSE 0 END) AS missing_order_date,
 SUM(CASE WHEN Sales IS NULL THEN 1 ELSE 0 END) AS missing_sales,
 SUM(CASE WHEN Quantity IS NULL THEN 1 ELSE 0 END) AS missing_quantity,
 SUM(CASE WHEN OrderDate IS NOT NULL AND TRY_CONVERT(date,OrderDate) IS NULL
          THEN 1 ELSE 0 END) AS unparseable_order_dates
FROM dbo.SupplyChain;
