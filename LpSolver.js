const parse = require('linear-program-parser').parse;
const simplex = require('linear-program-solver').simplex;
const findSolution = require('linear-program-solver').findSolution;
const simplexIsOK = require('linear-program-solver').simplexIsOK;
const SimplexSolution = require('linear-program-solver').SimplexSolution;

const LpSolver = async (params, carryOvers) => {
    const linearProgram = parse(`max(x11 +x12 +x21 +x22)
    st:
        x11 + x12 <= ${params.demand1} + ${carryOvers.demand1};
        x21 + x22 <= ${params.demand2} + ${carryOvers.demand2};
        x11 + x21 <= ${params.supplyI} + ${carryOvers.supplyI};
        x12 + x22 <= ${params.supplyII} + ${carryOvers.supplyII};
        x11 >= 0;
        x12 >= 0;
        x21 >= 0;
        x22 >= 0;
    `);
 
    if (simplexIsOK()) {
        const fpi = linearProgram.toFPI();
        const val = simplex(fpi.toMatrix());

        const result = {};
        val.vars.forEach((key, i) => result[key] = val.solution[i]);

        return result;
    } 

    return "N/A";
}

module.exports = { LpSolver };
