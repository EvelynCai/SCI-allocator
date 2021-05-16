
const csv = require("csvtojson");

/**
 * The module that pre-process the uploaded csv files to be prepared for Linear Program model
 * 
 * @param {*} files uploaded files: supplyCSV, demandCSV, (optional/sourcingRule CSV)
 */
const CsvParser = async (files) => {
    Object.entries(files).forEach(async ([key, val]) => {
        // store the CSVs
        const path = `${__dirname}/client/public/uploads/${key}`
        val.mv(path, err => {
            if (err) {
              console.error(err);
              throw err;
            }
        });

        // validate

        // parse csv to json array
        const jsonArray = await csv().fromFile(path);
        // console.log(jsonArray);
    });
};

module.exports = { CsvParser };