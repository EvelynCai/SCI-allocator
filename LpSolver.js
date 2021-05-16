const parse = require('linear-program-parser').parse;
const simplex = require('linear-program-solver').simplex;
const findSolution = require('linear-program-solver').findSolution;
const simplexIsOK = require('linear-program-solver').simplexIsOK;
const SimplexSolution = require('linear-program-solver').SimplexSolution;

/**
 * This module finds maximal order execution solution (per DAY per PRODUCT) via Linear Programming solver
 * 
 * TODO: extend the LP model from (2 SITE * 2 CUSTOMER) to (m SITE * n CUSTOMER)
 * 
 * @param {*} supply1 the object that denotes
 * @param {*} supply2 
 * @param {*} demand1 
 * @param {*} demand2 
 * @param {*} carryOvers 
 * @param {*} sourceArray1 the array of source-able customer names of site1
 * @param {*} sourceArray2 the array of source-able customer names of site2
 * @returns optimal execution solution if feasible, otherwise "N/A"
 */
const LpSolver = async (supply1, supply2, demand1, demand2, carryOvers, sourceArray1, sourceArray2) => {
    // construct the Decision Variable name, e.g. site1206customerC001
    const nameDecisionVar = (supply, demand) => {
        console.log(`${supply.site}${demand.customer}`);
        return `site${supply.site}customer${demand.customer}`;
    };

    // construct the Objective Function, in this case maximize the order execution
    const buildObjectiveFunc = () => `max(${nameDecisionVar(supply1, demand1)} + ${nameDecisionVar(supply1, demand2)} + ${nameDecisionVar(supply2, demand1)} + ${nameDecisionVar(supply2, demand2)})`;

    // construct the non-negativity constraints based on Sourcing Rule(if any)
    const buildNonNegaConstraint = (supplySourceArray, demand) => {
        return supplySourceArray.includes(demand.customer) ? '>=' : '==';
    };
    
    // construct the LP model that maximizes order execution for 2 CUSTOMERs * 2 SITE (per DAY per PRODUCT)
    const linearProgram = parse(`${buildObjectiveFunc()}
    st:
        ${nameDecisionVar(supply1, demand1)} + ${nameDecisionVar(supply1, demand2)} <= ${supply1.quantity} + ${carryOvers.supply1};
        ${nameDecisionVar(supply2, demand1)} + ${nameDecisionVar(supply2, demand2)} <= ${supply2.quantity} + ${carryOvers.supply2};
        ${nameDecisionVar(supply1, demand1)} + ${nameDecisionVar(supply2, demand1)} <= ${demand1.quantity} + ${carryOvers.demand1};
        ${nameDecisionVar(supply1, demand2)} + ${nameDecisionVar(supply2, demand2)} <= ${demand2.quantity} + ${carryOvers.demand2};
        ${nameDecisionVar(supply1, demand1)} ${buildNonNegaConstraint(sourceArray1, demand1)} 0;
        ${nameDecisionVar(supply1, demand2)} ${buildNonNegaConstraint(sourceArray1, demand2)} 0;
        ${nameDecisionVar(supply2, demand1)} ${buildNonNegaConstraint(sourceArray2, demand1)} 0;
        ${nameDecisionVar(supply2, demand2)} ${buildNonNegaConstraint(sourceArray2, demand2)} 0;
    `);
 
    // optimal solution found
    if (simplexIsOK()) {
        const fpi = linearProgram.toFPI();
        const val = simplex(fpi.toMatrix());

        const result = {};
        val.vars.forEach((key, i) => result[key] = val.solution[i]);

        return result;
    } 

    // optimization not applicable
    return "N/A";
};

module.exports = { LpSolver };