const express = require('express');
const fileUpload = require('express-fileupload');
const logger = require('morgan');
const { CsvParser } = require('./CsvParser');
const { LpSolver } = require('./LpSolver');
const { JsonFinder } = require('./JsonFinder');
const dateFormat = require("dateformat");

const app = express();

// logging middleware
app.use(logger('dev'));

// uploading middleware
app.use(fileUpload());

app.post('/upload', async (req, res) => {
  if (req.files === null) {
    return res.status(400).json({ msg: 'No file uploaded' });
  }

  try {
    // parse CSV to JSON
    const jsonArrays = await CsvParser(req.files);
    let demandJsons = jsonArrays.demandFile;
    let supplyJsons = jsonArrays.supplyFile;
    let optionalJsons = jsonArrays.optionalFile;
    let solutionArrays = [];

     // format DATE to be ISO date
     for (let demand of demandJsons) {
        demand.date = dateFormat(demand.date, 'isoDate');
    }
    for (let supply of supplyJsons) {
        supply.date = dateFormat(supply.date, 'isoDate');
    }

    // query JSON by DATE and PRODUCT
    const { getMergedSet, getDedupList, queryByDateProduct, queryCustomerByProductAndSite } = await JsonFinder(jsonArrays);
    const productList = getMergedSet('product');
    const dateList = getMergedSet('date');
    const siteList = getDedupList('site', supplyJsons);
    const customerList = getDedupList('customer', demandJsons);

    // find Linear Programming solutions iteratively (per DATE per PRODUCT)
    let carryOvers = {
      "demand1": 0,
      "demand2": 0,
      "supply1": 0,
      "supply2": 0,
    };

    // construct a 2-element list when currentList.length < 2
    const tablize = (currentList, overallList, date, product, fieldName) => {
      for (const value of overallList) {
        if (!currentList.some(d => d[fieldName] === value)) {
          let dummyObj = {
            product,
            date,
            quantity: 0,
          };
          dummyObj[fieldName] = value;

          currentList.push(dummyObj);
        }
      }
      console.log(currentList);
      console.log(overallList);
    };

    // TODO: update carryOvers based on previous dates
    dateList.sort();
    for (const date of dateList) {
      for (const product of productList) {
        const demands = queryByDateProduct(date, product, demandJsons);
        const supplies = queryByDateProduct(date, product, supplyJsons);
        
        // tablize the queries result to be 2 demand * 2 supply 
        tablize(demands, customerList, date, product, 'customer');
        tablize(supplies, siteList, date, product, 'site');

        if (supplies.length == 2 && demands.length == 2) {
          let result = {};
          result.date = date;
          result.product = product;

          const sourceList1 = queryCustomerByProductAndSite(supplies[0].site, product, optionalJsons);
          const sourceList2 = queryCustomerByProductAndSite(supplies[1].site, product, optionalJsons);
          
          // TODO: extend the model by replace one object(supply/demand/sourceList) with a list of objects
          const solution = await LpSolver(supplies[0], supplies[1], demands[0], demands[1], carryOvers, sourceList1, sourceList2);
          for (const [key, value] of Object.entries(solution)) {
            // TODO: replace with more reliable regex match
            if (!key.includes("f_")) {
              result[key] = value;
            }
          }
          solutionArrays.push(result);
        } else {
          throw new Error(`The Linear Programming model of ${demands.length} customer * ${supplies.length} site is NOT supported at present.`);
        }
      }
    }

    // send response to client
    BigInt.prototype.toJSON = function() { return this.toString(); };
    const serializedSolution = JSON.stringify(solutionArrays);
    res.json(serializedSolution);
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
});

// start the server
app.listen(5000, () => console.log('Server Started...'));
