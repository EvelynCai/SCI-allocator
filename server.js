const express = require('express');
const fileUpload = require('express-fileupload');
const logger = require('morgan');
const { CsvParser } = require('./CsvParser');
const { LpSolver } = require('./LpSolver');

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

    // query JSON by DATE and PRODUCT
    
    // find Linear Programming solutions iteratively (per DATE per PRODUCT)
    const carryOvers = {
      "demand1": 0,
      "demand2": 0,
      "supply1": 0,
      "supply2": 0,
    };
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
