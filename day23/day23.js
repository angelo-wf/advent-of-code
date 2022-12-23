
import fs from "node:fs";

const tdata = `.....
..##.
..#..
.....
..##.
.....`;
// solutions for tdata - p1: 25 empty spots, p2: round 4

const tdata2 = `....#..
..###.#
#...#.#
.#...##
#.###..
##.#.##
.#..#..`;

const data = fs.readFileSync("input.txt", "utf-8").slice(0, -1);

const neightbors = [
  [-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]
];

const checkDirs = [
  [[-1, -1], [0, -1], [1, -1]],
  [[-1, 1], [0, 1], [1, 1]],
  [[-1, -1], [-1, 0], [-1, 1]],
  [[1, -1], [1, 0], [1, 1]]
];

// N, S, W, E
const dirs = [
  [0, -1], [0, 1], [-1, 0], [1, 0]
];

function parseData(data) {
  let y = 0;
  let map = new Map();
  for(let line of data.split("\n")) {
    let x = 0;
    for(let char of line) {
      if(char === "#") map.set(`${x},${y}`, true);
      x++;
    }
    y++;
  }
  return map;
}

function doRound(map, sdir) {
  let proposals = {};
  let destCount = {};
  // form proposals for each elf
  for(let [key, _] of map) {
    let c = key.split(",").map(i => + i);
    let others = false;
    for(let n of neightbors) {
      if(map.get(`${c[0] + n[0]},${c[1] + n[1]}`) !== undefined) {
        others = true;
        break;
      }
    }
    if(others) {
      for(let i = 0; i < 4; i++) {
        // for each direction
        let other = false;
        for(let n of checkDirs[(sdir + i) % 4]) {
          // for each check in that direction, chekc if there is an elf there
          if(map.get(`${c[0] + n[0]},${c[1] + n[1]}`) !== undefined) {
            other = true;
            break;
          }
        }
        if(!other) {
          // propose
          let dest = [c[0] + dirs[(sdir + i) % 4][0], c[1] + dirs[(sdir + i) % 4][1]];
          proposals[c.join(",")] = dest;
          if(destCount[dest.join(",")] !== undefined) {
            destCount[dest.join(",")]++;
          } else {
            destCount[dest.join(",")] = 1;
          }
          break;
        }
      }
    }
  }
  // move elfes
  for(let [key, val] of Object.entries(proposals)) {
    // if there is only one elf moving here
    if(destCount[val.join(",")] === 1) {
      // move it
      map.delete(key);
      map.set(val.join(","), true);
    }
  }
  return Object.keys(proposals).length > 0;
}

function doRounds(map, count) {
  let dir = 0;
  for(let i = 0; i < count; i++) {
    doRound(map, dir);
    dir++;
  }
  return map;
}

function doRoundsUntilDone(map) {
  let dir = 0;
  while(true) {
    let res = doRound(map, dir++);
    if(!res) break;
  }
  return dir;
}

function getEmpty(map) {
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  for(let [key, _] of map) {
    let c = key.split(",").map(i => + i);
    if(c[0] < minX) minX = c[0];
    if(c[0] > maxX) maxX = c[0];
    if(c[1] < minY) minY = c[1];
    if(c[1] > maxY) maxY = c[1]; 
  }
  let sum = 0;
  for(let x = minX; x <= maxX; x++) {
    for(let y = minY; y <= maxY; y++) {
      if(map.get([x, y].join(",")) === undefined) sum++;
    }
  }
  return sum;
}

console.log(getEmpty(doRounds(parseData(data), 10)));

console.log(doRoundsUntilDone(parseData(data)));
