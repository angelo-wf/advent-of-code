
import fs from "node:fs";

const tdata = `Sabqponm
abcryxxl
accszExk
acctuvwj
abdefghi`;

const data = fs.readFileSync("input.txt", "utf-8").slice(0, -1);

function isNeightbor(arr, ox, oy, x, y) {
  if(y < 0 || y >= arr[0].length || x < 0 || x >= arr.length) return false;
  if(arr[x][y].steps !== -2) return false;
  if(arr[x][y].val > arr[ox][oy].val + 1) return false;
  return true;
}

function fill(arr, start) {
  const dirs = [[0, 1], [0, -1], [-1, 0], [1, 0]];
  // [x, y, steps]
  let toExplore = [[start[0], start[1], 0]];
  while(toExplore.length > 0) {
    let pos = toExplore.shift();
    arr[pos[0]][pos[1]].steps = pos[2];
    for(let dir of dirs) {
      if(isNeightbor(arr, pos[0], pos[1], pos[0] + dir[0], pos[1] + dir[1])) {
        arr[pos[0] + dir[0]][pos[1] + dir[1]].steps = -1;
        toExplore.push([pos[0] + dir[0], pos[1] + dir[1], pos[2] + 1]);
      }
    }
  }
}

function mapNode(v) {
  const letters = "abcdefghijklmnopqrstuvwxyz";
  // steps: -2: not added to toExplore yet; -1: added, but not visited; 0+: steps from start needed
  if(v === "S") return {val: 0, start: true, end: false, steps: -2};
  if(v === "E") return {val: 25, start: false, end: true, steps: -2};
  return {val: letters.indexOf(v), start: false, end: false, steps:-2};
}

function resetArr(arr) {
  for(let x = 0; x < arr.length; x++) {
    for(let y = 0; y < arr[0].length; y++) {
      arr[x][y].steps = -2;
    }
  }
}

function getPos(arr, end) {
  for(let x = 0; x < arr.length; x++) {
    for(let y = 0; y < arr[0].length; y++) {
      if(arr[x][y].start && !end) return [x, y];
      if(arr[x][y].end && end) return [x, y];
    }
  }
  console.error("Failed to find start/endpos");
  return [0, 0];
}

function getSteps(arr) {
  fill(arr, getPos(arr, false));
  let endPos = getPos(arr, true);
  return arr[endPos[0]][endPos[1]].steps;
}

function getFewestSteps(arr) {
  let endPos = getPos(arr, true);
  let min = Infinity;
  for(let x = 0; x < arr.length; x++) {
    for(let y = 0; y < arr[0].length; y++) {
      if(arr[x][y].val === 0) {
        // check steps for this startpos
        fill(arr, [x, y]);
        let steps = arr[endPos[0]][endPos[1]].steps;
        resetArr(arr);
        // it's possible for the end to not be reachable from a startpos?
        // skip if steps indicate it was never reached (-2)
        if(steps < min && steps !== -2) min = steps;
      }
    }
  }
  return min;
}

console.log(getSteps(data.split("\n").map(i => i.split("").map(mapNode))));

console.log(getFewestSteps(data.split("\n").map(i => i.split("").map(mapNode))));
