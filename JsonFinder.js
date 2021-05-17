const FlyJson = require('fly-json-odm'); 

const JsonFinder = async (jsonArrays) => {
    const nosql = new FlyJson();
    const demandJsons = jsonArrays.demandFile;
    const supplyJsons = jsonArrays.supplyFile;
    const optionalJsons = jsonArrays.optionalFile;

    const getMergedSet = (selectColumn) => {
        const supplyRows = nosql.set(supplyJsons)
            .select([selectColumn])
            .distinct()
            .exec();
        const demandRows = nosql.set(demandJsons)
            .select([selectColumn])
            .distinct()
            .exec();
    
        const supplyList = supplyRows.map(p => p[selectColumn]);
        const demandList = demandRows.map(p => p[selectColumn]);
        const set = new Set(supplyList.concat(demandList));
        const dedupList = Array.from(set);
        return dedupList;
    }

    const productList = getMergedSet('product');
    const dateList = getMergedSet('date');

    // Assumption: only 1 supply/demand of one site/customer (per DAY per PRODUCT)
    // Assumption: only 2 sites/customers in total
    // TODO: use GROUPBY and SUM(quantity) to merge n objects of one site/customer (per DAY per PRODUCT)
    const queryByDateProduct = (date, product, jsons) => {
        const selected = nosql.set(jsons)
            .where('date', date)
            .where('product', product)
            .exec();
        return selected;
    };

    return { productList, dateList, queryByDateProduct };
};

module.exports = { JsonFinder };