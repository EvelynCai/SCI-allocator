const FlyJson = require('fly-json-odm'); 

const JsonFinder = async (jsonArrays) => {
    const nosql = new FlyJson();
    const demandJsons = jsonArrays.demandFile;
    const supplyJsons = jsonArrays.supplyFile;
    const optionalJsons = jsonArrays.optionalFile;

    // console.log(supplyJsons)
    const dates = nosql.set(supplyJsons)
    .select(['date'])
    .orderBy('date')
    .distinct()
    .exec();
    // console.log(dates);

    // const joinByProduct = nosql.set(demandJsons).join('profile',supplyJsons)
    // .merge('product','product')
    // .exec();
    // console.log(data);

    // const data = nosql.set()
    // .groupBy('brand')
    // .orderBy('brand')
    // .exec();
    // console.log(data);
};

module.exports = { JsonFinder };