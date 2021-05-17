const express = require('express');
const fileUpload = require('express-fileupload');
const logger = require('morgan');
const { CsvParser } = require('./CsvParser');
const { LpSolver } = require('./LpSolver');
const { JsonFinder } = require('./JsonFinder');
const FlyJson = require('fly-json-odm'); 
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

     // format DATE to be ISO date
     for (let demand of demandJsons) {
        demand.date = dateFormat(demand.date, 'isoDate');
    }
    for (let supply of supplyJsons) {
        supply.date = dateFormat(supply.date, 'isoDate');
    }

    // query JSON by DATE and PRODUCT
    const { productList, dateList, queryByDateProduct } = await JsonFinder(jsonArrays);

    // find Linear Programming solutions iteratively (per DATE per PRODUCT)
    const carryOvers = {
      "demand1": 0,
      "demand2": 0,
      "supply1": 0,
      "supply2": 0,
    };
    for (const date of dateList) {
      for (const product of productList) {
        const demands = queryByDateProduct(date, product, demandJsons);
        const supplys = queryByDateProduct(date, product, supplyJsons);
        // if (supplys.length <= 2 && demands.length <= 2) {
        //   // TODO: get sourcing rules lists from JsonFinder.js
        //   const solution = await LpSolver(supplys[0], supplys[1], demands[0], demands[1], carryOvers, [], []);
        // } else {
        //   throw new Error(`The Linear Programming model of ${demands.length} customer * ${supplys.length} site is NOT supported at present.`);
        // }
      }
    }
    
    const supply1 = { site: '1206', product: 'P001', date: '1/7/19', quantity: '2000' };
    const supply2 = { site: '1203', product: 'P001', date: '1/7/19', quantity: '2000' };
    const demand1 = {
      customer: 'C001',
      product: 'P001',
      date: '1-Jul-19',
      quantity: '5000'
    };
    const demand2 = {
      customer: 'C002',
      product: 'P001',
      date: '1-Jul-19',
      quantity: '0'
    };
    const solution = await LpSolver(supply1, supply2, demand1, demand2, carryOvers, [], []);

    // send response to client
    BigInt.prototype.toJSON = function() { return this.toString(); };
    res.json(solution);
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
});

// start the server
app.listen(5000, () => console.log('Server Started...'));
