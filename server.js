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
    // pre-process 
    const parsedFiles = await CsvParser(req.files);
    
    // compute 
    // const params = parsedFiles.params;
    // const dates = parsedFiles.dates;
    // const products = parsedFiles.products;
    // const carryOvers = parsedFiles.carryOvers;
    const params = {
      "demand1": 5000, 
      "demand2": 0, 
      "supplyI": 2000,
      "supplyII": 2000,
    };

    const carryOvers = {
      "demand1": 0,
      "demand2": 0,
      "supplyI": 0,
      "supplyII": 0,
    };

    //TODO: sourcing rule
    const solution = await LpSolver(params, carryOvers);

    // respond
    BigInt.prototype.toJSON = function() { return this.toString(); };
    res.json(solution);
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
});

// start the server
app.listen(5000, () => console.log('Server Started...'));
