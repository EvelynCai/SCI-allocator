
const csv = require("csvtojson");

const CsvParser = async (files) => {
    Object.entries(files).forEach(async ([key, val]) => {
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
        console.log(jsonArray);
    });
};

module.exports = { CsvParser };