
import fs from "node:fs";

const tdata = `>>><<><>><<<>><>>><<<>>><<<><<<>><>><<>>`;

const data = fs.readFileSync("input.txt", "utf-8").slice(0, -1);

// rotated (simulation runs turned to the right (falling left))
const pieces = [
  [[1], [1], [1], [1]],
  [[0, 1, 0], [1, 1, 1], [0, 1, 0]],
  [[1, 0, 0], [1, 0, 0], [1, 1, 1]],
  [[1, 1, 1, 1]],
  [[1, 1], [1, 1]]
];

class Simlator {
  constructor(wind) {
    // board is flipped to the right, expands as needed
    this.cols = [[1], [1], [1], [1], [1], [1], [1], [1], [1]];
    this.pieceCol = 3;
    this.pieceRow = 0;
    this.curPiece = 0;
    this.wind = wind.split("").map(c => c === "<" ? false : true);
    this.curWind = 0;
  }

  spawnPiece() {
    // find highest piece
    let highest = this.findHeighestSpot();
    // find how many empty rows we already have above it
    let emptyAbove = this.cols[0].length - highest - 1;
    // we need 3 + height of piece
    let needed = (pieces[this.curPiece][0].length + 3) - emptyAbove;
    for(let j = 0; j <= 8; j++) {
      for(let i = 0; i < needed; i++) {
        this.cols[j].push((j === 0 || j === 8) ? 1 : 0);
      }
    }
    // spawn the piece
    this.pieceCol = 3;
    this.pieceRow = highest + 4;
    this.drawPiece(this.pieceCol, this.pieceRow);
  }

  findHeighestSpot() {
    let highest = 0;
    for(let i = 1; i <= 7; i++) {
      for(let j = this.cols[i].length - 1; j >= 0; j--) {
        if(this.cols[i][j] !== 0) {
          if(j > highest) highest = j;
        }
      }
    }
    return highest;
  }

  drawPiece(pc, pr) {
    for(let c = 0; c < pieces[this.curPiece].length; c++) {
      for(let r = 0; r < pieces[this.curPiece][0].length; r++) {
        if(pieces[this.curPiece][c][r]) this.cols[pc + c][pr + r] = 2;
      }
    }
  }

  removePiece(pc, pr) {
    for(let c = 0; c < pieces[this.curPiece].length; c++) {
      for(let r = 0; r < pieces[this.curPiece][0].length; r++) {
        if(pieces[this.curPiece][c][r]) this.cols[pc + c][pr + r] = 0;
      }
    }
  }

  checkPiece(pc, pr) {
    for(let c = 0; c < pieces[this.curPiece].length; c++) {
      for(let r = 0; r < pieces[this.curPiece][0].length; r++) {
        if(pieces[this.curPiece][c][r]) {
          if(this.cols[pc + c][pr + r]) return false;
        }
      }
    }
    return true;
  }

  movePiece(dc, dr) {
    this.removePiece(this.pieceCol, this.pieceRow);
    if(this.checkPiece(this.pieceCol + dc, this.pieceRow + dr)) {
      // can move, move it
      this.pieceCol += dc;
      this.pieceRow += dr;
      this.drawPiece(this.pieceCol, this.pieceRow);
      return true;
    } else {
      // can not move, restore orig pos
      this.drawPiece(this.pieceCol, this.pieceRow);
      return false;
    }
  }

  simulatePiece() {
    this.spawnPiece();
    while(true) {
      // handle wind
      this.movePiece(this.wind[this.curWind] ? 1 : -1, 0);
      this.curWind = (this.curWind + 1) % this.wind.length;
      // handle drop
      let moved = this.movePiece(0, -1);
      if(!moved) {
        break;
      }
    }
    this.curPiece = (this.curPiece + 1) % pieces.length;
  }
}

function findHeight(data) {
  let simulator = new Simlator(data);
  for(let i = 0; i < 2022; i++) {
    simulator.simulatePiece();
    // console.log(simulator.cols.map(r => r.map(c => c === 0 ? " " : (c === 1 ? "=" : "#")).join("")).join("\n"));
  }
  return simulator.findHeighestSpot();
}

function getCacheString(simulator) {
  let str = "";
  for(let i = 0; i < 30; i++) {
    let rowCount = simulator.cols[0].length;
    let v = (
      simulator.cols[1][rowCount - i] + simulator.cols[2][rowCount - i] * 2 + simulator.cols[3][rowCount - i] * 4 +
      simulator.cols[4][rowCount - i] * 8 + simulator.cols[5][rowCount - i] * 16 + simulator.cols[6][rowCount - i] * 32 +
      simulator.cols[7][rowCount - i] * 64
    );
    str += v + ",";
  }
  return str + `${simulator.curWind},${simulator.curPiece}`;
}

function findHeightLong(data) {
  // check for loops in the structure by keeping a cache of all found configs(top 30 rows) + curPiece + curWind
  let simulator = new Simlator(data);
  let cache = new Map();
  let i = 0;
  while(true) {
    let c = cache.get(getCacheString(simulator));
    if(c !== undefined) {
      // we found a loop
      let loopLength = i - c.i;
      let heightNow = simulator.findHeighestSpot();
      let loopHeight = heightNow - c.h;
      // calculate how many times we loop until we are just below 1000000000000 (1e12), skip to there
      let addTimes = Math.floor((1000000000000 - i) / loopLength);
      i += (addTimes * loopLength);
      // simulate amount to get to 1000000000000
      for(let j = i; j < 1000000000000; j++) {
        simulator.simulatePiece();
      }
      // and add skipped amount of loopheights to result
      return simulator.findHeighestSpot() + addTimes * loopHeight;
    } else {
      // insert into cache
      cache.set(getCacheString(simulator), {i: i, h: simulator.findHeighestSpot()});
    }
    simulator.simulatePiece();
    i++;
  }
}

console.log(findHeight(data));

console.log(findHeightLong(data));
