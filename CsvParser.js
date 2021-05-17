
const csv = require("csvtojson");
const isvalid = require('isvalid');

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

        // parse csv to json array
        const json = await csv().fromFile(path);

        // validate and format json
        try {
            let schema;
            switch (key) {
                case 'demandFile':
                    schema = demandSchema;
                    break;
                case 'supplyFile':
                    schema = supplySchema;
                    break;
                default:
                    schema = optionalSchema;
            }
            const validatedJson = await isvalid(json, schema);
            jsonArrays[key] = validatedJson;
        } catch (err) {
            // validation OR type auto-conversion fails
            throw err;
        }
    }
    
    return jsonArrays;
};

const supplySchema = {
    type: 'Array',
    schema: { 
        type: 'Object',
        schema: {
            site: String,
            product: String, 
            date: Date, // auto convert from String to ISO Date
            quantity: Number, // auto convert from String to Number 
        }
    }
};

const demandSchema = {
    type: 'Array',
    schema: { 
        type: 'Object',
        schema: {
            customer: String,
            product: String, 
            date: Date, 
            quantity: Number,
        }
    }
};

const optionalSchema = {
    type: 'Array',
    required: false,
    schema: { 
        type: 'Object',
        schema: {
            customer: String,
            product: String, 
            site: String, 
        }
    }
};

module.exports = { CsvParser };