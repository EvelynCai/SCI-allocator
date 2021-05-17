# Supply Chain Integration Allocator

This is a full stack JavaScript web application that leverages Operations Research methodology to solve allocation problems in Supply Chain Integration.
- Front-end: React
- Back-end: Node.js (Express)
- For more information about the Linear Programming model design, please refer to the comments in `./LpSolver`

![UI](https://github.com/EvelynCai/SCI-allocator/blob/main/client/public/start-view.png)

## N.B.
- Sample test CSVs could be found in `./testData`
- Uploaded files could be found in `./client/public/uploads` with alias for purpose: "demandFile", "supplyFile", "optionalFile"(if any)
- The "Solve" button is ONLY enabled when at least 2 input files are selected (TODO: file format is not validated when upload)
    - 1 required CSV for supply data (required columns are validated against: ["site", "product", "date", "quantity"])
    - 1 required CSV for demand data (required columns are validated against: ["customer", "product", "date", "quantity"])
    - 1 optional CSV for sourcing rules (TODO: adjust the LP model non-negativity constraints based on sourcing rules);
- The initial Linear Programming model is ONLY applicable to 2 customers * 2 sites at present, i.e. 
    - there must be 2 distinct customers contained in the entire demand CSV.
    - there must be 2 distinct sites contained in the entire supply CSV.
    - TODO: extend the model from 2 customer * 2 site to m customer * n site
- The demand/supply CSV is assumed to contain ONLY 1 record per CUSTOMER/SITE per DAY per PRODUCT. (TODO: query json with SUM and GROUPBY)
- The optimization solution now is based on the data of each day alone, i.e. the "unfulfilled order"/"inventory carryovers" in history is not updated although placeholders are already set up in the LP model. (`./LpSolver`)
    - TODO: need to update carryOvers based on date in `./server.js`)

## Quick Start on Local

```bash
# Install dependencies server/client
npm install
cd client
npm install

# Serve on localhost:3000
npm run dev
```

## Deployment on Azure 
URL: https://sci-allocator.azurewebsites.net/ (TODO, just the default Azure node app at present)

## Edge Cases
### display solution alert and table
![solution](https://github.com/EvelynCai/SCI-allocator/blob/main/client/public/display-solution-table-if-Ok.png)

### display alerts if any error occurs
![error-message](https://github.com/EvelynCai/SCI-allocator/blob/main/client/public/error-message.png)

### search result not found
![search-not-found](https://github.com/EvelynCai/SCI-allocator/blob/main/client/public/searched-solution-not-found.png)

### download solution CSVs (w/ searched result)
![UI](https://github.com/EvelynCai/SCI-allocator/blob/main/client/public/download-solution-of-searched-date.png)
