const express = require('express');
const fileUpload = require('express-fileupload');
const logger = require('morgan');
const { LpSolver } = require('./LpSolver');
const { LpParser } = require('./LpParser');

const app = express();

// logging middleware
app.use(logger('dev'));

// uploading middleware
app.use(fileUpload());
app.post('/upload', async (req, res) => {
  if (req.files === null) {
    return res.status(400).json({ msg: 'No file uploaded' });
  }
  
  // pre-process 
  const supplyFile = req.files.supplyFile;
  const demandFile = req.files.demandFile;
  const optionalFile = req.files.optionalFile;

  // compute 
  // iterate each day
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

  const solution = await LpParser(params, carryOvers);
  BigInt.prototype.toJSON = function() { return this.toString(); };

  // supplyFile.mv(`${__dirname}/client/public/uploads/${supplyFile.name}`, err => {
  //   if (err) {
  //     console.error(err);
  //     return res.status(500).send(err);
  //   }
  // });
  // demandFile.mv(`${__dirname}/client/public/uploads/${demandFile.name}`, err => {
  //   if (err) {
  //     console.error(err);
  //     return res.status(500).send(err);
  //   }
  // });

  // respond
  res.json(solution);
});

// start the server
app.listen(5000, () => console.log('Server Started...'));
