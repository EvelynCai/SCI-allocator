const solver = require('javascript-lp-solver');

const LpSolver = async (restrictions, vars) => {
    const model = {
      "optimize": "order",
      "opType": "max",
      "constraints": restrictions,
      "variables": vars,
    //   "ints": {"1203": 1, "1206": 1}
    };
   
    const results = solver.Solve(model);
    return results;
  }

  module.exports = { LpSolver }