
import fs from "node:fs";

const tdata = `498,4 -> 498,6 -> 496,6
503,4 -> 502,4 -> 502,9 -> 494,9`;

const data = fs.readFileSync("input.txt", "utf-8").slice(0, -1);

function makeMap(lines) {
  let map = {}; // 'x,y' -> rock/sand
  let bottomY = 0;
  for(let line of lines) {
    for(let i = 0; i < line.length - 1; i++) {
      if(line[i][0] === line[i + 1][0]) {
        // x the same, vertical line
        let min = Math.min(line[i][1], line[i + 1][1]);
        let max = Math.max(line[i][1], line[i + 1][1]);
        for(let j = min; j <= max; j++) map[`${line[i][0]},${j}`] = 1;
        if(max > bottomY) bottomY = max;
      } else { // horizontal line
        let min = Math.min(line[i][0], line[i + 1][0]);
        let max = Math.max(line[i][0], line[i + 1][0]);
        for(let j = min; j <= max; j++) map[`${j},${line[i][1]}`] = 1;
        if(line[i][1] > bottomY) bottomY = line[i][1];
      }
    }
  }
  return [map, bottomY];
}

function simulateSand(map, bottomY) {
  let count = 0;
  let done = false;
  while(true) {
    // for each grain of sand
    let pos = [500, 0];
    while(true) {
      if(pos[1] > bottomY) {
        done = true;
        break;
      }
      if(map[`${pos[0]},${pos[1] + 1}`] === undefined) {
        pos[1]++;
        continue;
      }
      if(map[`${pos[0] - 1},${pos[1] + 1}`] === undefined) {
        pos[1]++;
        pos[0]--;
        continue;
      }
      if(map[`${pos[0] + 1},${pos[1] + 1}`] === undefined) {
        pos[1]++;
        pos[0]++;
        continue;
      }
      map[`${pos[0]},${pos[1]}`] = 2;
      break; // settled
    }
    count++;
    if(done) break;
  }
  return count - 1;
}

function simulateFlooredSand(map, bottomY) {
  let count = 0;
  let done = false;
  // add floor, from 500 - bottomY - 3 to 500 + bottomY + 3
  for(let i = 497 - bottomY; i <= 503 + bottomY; i++) {
    map[`${i},${bottomY + 2}`] = 3;
  }
  while(true) {
    // for each grain of sand
    let pos = [500, 0];
    while(true) {
      if(map[`${pos[0]},${pos[1] + 1}`] === undefined) {
        pos[1]++;
        continue;
      }
      if(map[`${pos[0] - 1},${pos[1] + 1}`] === undefined) {
        pos[1]++;
        pos[0]--;
        continue;
      }
      if(map[`${pos[0] + 1},${pos[1] + 1}`] === undefined) {
        pos[1]++;
        pos[0]++;
        continue;
      }
      map[`${pos[0]},${pos[1]}`] = 2;
      if(pos[1] === 0) done = true;
      break; // settled
    }
    count++;
    if(done) break;
  }
  return count;
}

console.log(simulateSand(...makeMap(data.split("\n").map(l => l.split(" -> ").map(p => p.split(",").map(i => +i))))));

console.log(simulateFlooredSand(...makeMap(data.split("\n").map(l => l.split(" -> ").map(p => p.split(",").map(i => +i))))));
