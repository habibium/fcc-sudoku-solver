class Cell {
  constructor(idx) {
    this.idx = idx;

    let rowStart = Math.floor(idx / 9);
    let incre = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    this.rowIdxs = incre.map((x) => 9 * rowStart + x);

    let colStart = idx % 9;
    this.colIdxs = incre.map((x) => colStart + x * 9);

    let regStart = Math.floor(rowStart / 3) * 27 + Math.floor(colStart / 3) * 3;
    this.regIdxs = incre.map((x) => regStart + Math.floor(x / 3) * 9 + (x % 3));

    let rowRegStart = 3 * Math.floor(rowStart / 3);
    let next1Row = 9 * (rowRegStart + ((rowStart + 1) % 3));
    let next2Row = 9 * (rowRegStart + ((rowStart + 2) % 3));
    this.adjRegRowIdxs = [
      ...incre.map((x) => next1Row + x),
      ...incre.map((x) => next2Row + x),
    ];

    let colRegStart = 3 * Math.floor(colStart / 3);
    let next1Col = colRegStart + ((colStart + 1) % 3);
    let next2Col = colRegStart + ((colStart + 2) % 3);
    this.adjRegColIdxs = [
      ...incre.map((x) => next1Col + x * 9),
      ...incre.map((x) => next2Col + x * 9),
    ];
  }
}

class Indexer {
  constructor() {
    this.lookup = {};
    for (let i = 0; i < 81; i++) {
      this.lookup[i] = new Cell(i);
    }
  }
}

let rowLookup = {
  A: 0,
  B: 1,
  C: 2,
  D: 3,
  E: 4,
  F: 5,
  G: 6,
  H: 7,
  I: 8,
  a: 0,
  b: 1,
  c: 2,
  d: 3,
  e: 4,
  f: 5,
  g: 6,
  h: 7,
  i: 8,
};

let colLookup = (col) => {
  return col - 1;
};

let cellIdxMap = (row, col) => {
  return 9 * rowLookup[row] + colLookup(col);
};

let rowString = (puzzleString, cellIdx) => {
  return indexer.lookup[cellIdx].rowIdxs.map((x) => puzzleString[x]).join();
};

let colString = (puzzleString, cellIdx) => {
  return indexer.lookup[cellIdx].colIdxs.map((x) => puzzleString[x]).join();
};

let regionString = (puzzleString, cellIdx) => {
  return indexer.lookup[cellIdx].regIdxs.map((x) => puzzleString[x]).join();
};

let indexer = new Indexer();

class SudokuSolver {
  validate(puzzle) {
    for (let cellIdx = 0; cellIdx < 80; cellIdx++) {
      if (puzzle[cellIdx] != ".") {
        let k = puzzle[cellIdx];
        let trailPuzzle = puzzle;
        trailPuzzle[cellIdx] = ".";
        let pString = trailPuzzle.join("");
        let rString = rowString(pString, cellIdx);
        let cString = colString(pString, cellIdx);
        let reString = regionString(pString, cellIdx);
        let re = new RegExp(k, "g");
        if (re.test(rString + cString + reString)) {
          return false;
        }
      }
    }
    return true;
  }

  checkDuplicateValue(puzzleString, row, column, value) {
    let cellIdx = cellIdxMap(row, column);
    return puzzleString[cellIdx] == value;
  }
  checkRowPlacement(puzzleString, row, column, value) {
    let cellIdx = cellIdxMap(row, column);
    let rString = rowString(puzzleString, cellIdx);
    let re = new RegExp(value, "g");
    return !re.test(rString);
  }
  checkColPlacement(puzzleString, row, column, value) {
    let cellIdx = cellIdxMap(row, column);
    let cString = colString(puzzleString, cellIdx);
    let re = new RegExp(value, "g");
    return !re.test(cString);
  }
  checkRegionPlacement(puzzleString, row, column, value) {
    let cellIdx = cellIdxMap(row, column);
    let reString = regionString(puzzleString, cellIdx);
    let re = new RegExp(value, "g");
    return !re.test(reString);
  }
  findAllCellOptions(puzzleString, row, column) {
    let cellIdx = cellIdxMap(row, column);
    return this.findAllCellOptionsByCellInd(puzzleString, cellIdx);
  }

  findAllCellOptionsByCellInd(puzzleString, cellIdx) {
    let rString = rowString(puzzleString, cellIdx);
    let cString = colString(puzzleString, cellIdx);
    let reString = regionString(puzzleString, cellIdx);
    let re = new RegExp("[^" + rString + cString + reString + "]", "g");
    return "123456789".match(re);
  }

  solve(puzzle) {
    for (let cellIdx = 0; cellIdx < 81; cellIdx++) {
      if (puzzle[cellIdx] == ".") {
        let pString = puzzle.join("");
        for (let k = 1; k < 10; k++) {
          let rString = rowString(pString, cellIdx);
          let cString = colString(pString, cellIdx);
          let reString = regionString(pString, cellIdx);
          let re = new RegExp(k, "g");
          if (!re.test(rString + cString + reString)) {
            puzzle[cellIdx] = k;
            if (this.solve(puzzle)) {
              return true;
            }
          }
          puzzle[cellIdx] = ".";
        }
        return false;
      }
    }
    return true;
  }
}

module.exports = SudokuSolver;
