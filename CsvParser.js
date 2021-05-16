
const csv = require("csvtojson");

/**
 * The module that pre-process the uploaded csv files to be prepared for Linear Program model
 * 
 * TODO: validate CSV columns
 * @param {*} files uploaded files: supplyCSV, demandCSV, (optional/sourcingRule CSV)
 * @returns an object containing the arrays of converted json: supplyJsonArray, demandJsonArray, (optional/sourcingRule JsonArray)
 */
 const CsvParser = async (files) => {
    let jsonArrays = {};
    for (const [key, val] of Object.entries(files)) {
        // store the CSVs
        const path = `${__dirname}/client/public/uploads/${key}`
        val.mv(path, err => {
            if (err) {
              console.error(err);
              throw err;
            }
        });

        // TODO: validate CSVs

        // parse csv to json array
        const json = await csv().fromFile(path);
        jsonArrays[key] = json;
    }
    
    return jsonArrays;
};

module.exports = { CsvParser };