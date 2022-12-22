
import fs from "node:fs";

const tdata = `Sensor at x=2, y=18: closest beacon is at x=-2, y=15
Sensor at x=9, y=16: closest beacon is at x=10, y=16
Sensor at x=13, y=2: closest beacon is at x=15, y=3
Sensor at x=12, y=14: closest beacon is at x=10, y=16
Sensor at x=10, y=20: closest beacon is at x=10, y=16
Sensor at x=14, y=17: closest beacon is at x=10, y=16
Sensor at x=8, y=7: closest beacon is at x=2, y=10
Sensor at x=2, y=0: closest beacon is at x=2, y=10
Sensor at x=0, y=11: closest beacon is at x=2, y=10
Sensor at x=20, y=14: closest beacon is at x=25, y=17
Sensor at x=17, y=20: closest beacon is at x=21, y=22
Sensor at x=16, y=7: closest beacon is at x=15, y=3
Sensor at x=14, y=3: closest beacon is at x=15, y=3
Sensor at x=20, y=1: closest beacon is at x=15, y=3`;

const data = fs.readFileSync("input.txt", "utf-8").slice(0, -1);

function parseLine(line) {
  let [p1, p2] = line.split(": ");
  let sx = +p1.slice(12, p1.indexOf(", "));
  let sy = +p1.slice(p1.indexOf(", y=") + 4);
  let bx = +p2.slice(23, p2.indexOf(", "));
  let by = +p2.slice(p2.indexOf(", y=") + 4);
  return [sx, sy, bx, by];
}

function findCountRow(lines, row) {
  // for each sensor, get start&end of range on row
  let ranges = [];
  for(let line of lines) {
    let range = Math.abs(line[0] - line[2]) + Math.abs(line[1] - line[3]);
    let offset = Math.abs(line[1] - row);
    if(offset > range) continue; // skip if not in range for row
    let start = (line[0] - range) + offset;
    let end = (line[0] - range) + offset + ((range * 2 + 1) - (2 * offset));
    ranges.push([start, end]);
  }
  // put these in a map of x-coords
  let rowMap = new Map();
  for(let range of ranges) {
    for(let i = range[0]; i < range[1]; i++) {
      rowMap.set(i, 1);
    }
  }
  // for each sensor + beacon, add it if on this row
  for(let line of lines) {
    if(line[1] === row) rowMap.set(line[0], 2);
    if(line[3] === row) rowMap.set(line[2], 3);
  }
  let count = 0;
  rowMap.forEach((v, k) => count += v === 1 ? 1 : 0);
  return count;
}

// combine 2 ranges, returns new range or null if not possible
function combineRanges(r1, r2) {
  // r1 starts before r2
  if(r1[1] < r2[0]) return null; // 2 separate ranges
  if(r2[1] <= r1[1]) return r1; // r2 fully within r1
  return [r1[0], r2[1]]; // new range
}

function checkRanges(ranges) {
  // sort ranges depending on L
  ranges.sort((a, b) => a[0] - b[0]);
  // combine ranges
  while(true) {
    let l = ranges.shift();
    let r = ranges.shift();
    let c = combineRanges(l, r);
    if(c === null) return l[1];
    ranges.unshift(c);
    if(ranges.length === 1) break;
  }
  return -1;
}

function findSpot(lines) {
  // for each sensor, get start&end of range on row
  let x = -1;
  let row;
  for(row = 0; row < 4000000; row++) {
    let ranges = [];
    for(let line of lines) {
      let range = Math.abs(line[0] - line[2]) + Math.abs(line[1] - line[3]);
      let offset = Math.abs(line[1] - row);
      if(offset > range) continue; // skip if not in range for row
      let start = (line[0] - range) + offset;
      let end = (line[0] - range) + offset + ((range * 2 + 1) - (2 * offset));
      ranges.push([start, end]);
    }
    x = checkRanges(ranges);
    if(x !== -1) break;
  }
  return x * 4000000 + row;
}

console.log(findCountRow(data.split("\n").map(parseLine), data === tdata ? 10 : 2000000));

console.log(findSpot(data.split("\n").map(parseLine)));
