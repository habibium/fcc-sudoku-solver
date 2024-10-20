"use strict";

const SudokuSolver = require("../controllers/sudoku-solver.js");

module.exports = function (app) {
  let solver = new SudokuSolver();

  app.route("/api/check").post((req, res) => {
    let puzzle = req.body.puzzle;
    let coord = req.body.coordinate;
    let val = req.body.value;

    if ((puzzle == undefined) | (coord == undefined) | (val == undefined))
      return res.json({ error: "Required field(s) missing" });

    let reCoord = /^([A-Ia-i])([1-9])$/;
    let reVal = /^[1-9]$/;
    let rePuz = /[^1-9\.]/;
    if (!reCoord.test(coord)) return res.json({ error: "Invalid coordinate" });
    if (!reVal.test(val)) return res.json({ error: "Invalid value" });
    if (puzzle.length != 81)
      return res.json({ error: "Expected puzzle to be 81 characters long" });
    if (rePuz.test(puzzle))
      return res.json({ error: "Invalid characters in puzzle" });

    let [_, row, col] = coord.match(reCoord);

    if (solver.checkDuplicateValue(puzzle, row, col, val))
      return res.json({ valid: true });

    let validRow = solver.checkRowPlacement(puzzle, row, col, val);
    let validCol = solver.checkColPlacement(puzzle, row, col, val);
    let validReg = solver.checkRegionPlacement(puzzle, row, col, val);
    if (validRow & validCol & validReg) return res.json({ valid: true });

    let conflict = [];
    if (!validRow) conflict.push("row");
    if (!validCol) conflict.push("column");
    if (!validReg) conflict.push("region");

    return res.json({ valid: false, conflict });
  });

  app.route("/api/solve").post((req, res) => {
    let puzzle = req.body.puzzle;

    if (puzzle == undefined)
      return res.json({ error: "Required field missing" });

    if (puzzle.length != 81)
      return res.json({ error: "Expected puzzle to be 81 characters long" });

    let rePuz = /[^1-9\.]/;
    if (rePuz.test(puzzle))
      return res.json({ error: "Invalid characters in puzzle" });

    let puzzleArr = [...puzzle];
    if (!solver.solve(puzzleArr))
      return res.json({ error: "Puzzle cannot be solved" });
    return res.json({ solution: puzzleArr.join("") });
  });
};
