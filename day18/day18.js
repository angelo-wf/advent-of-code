
import fs from "node:fs";

const tdata = `2,2,2
1,2,2
3,2,2
2,1,2
2,3,2
2,2,1
2,2,3
2,2,4
2,2,6
1,2,5
3,2,5
2,1,5
2,3,5`;

const data = fs.readFileSync("input.txt", "utf-8").slice(0, -1);

const neightbors = [
  [-1, 0, 0], [1, 0, 0], [0, -1, 0], [0, 1, 0], [0, 0, -1], [0, 0, 1]
];

function createMap(lines) {
  let map = new Map();
  for(let line of lines) {
    map.set(line, true);
  }
  return map;
}

function isTrappedAir(map, coords) {
  let list = [coords];
  let all = [coords];
  let minC = [Infinity, Infinity, Infinity];
  let maxC = [0, 0, 0];
  for(let [key, _] of map) {
    let c = key.split(",").map(i => + i);
    if(c[0] < minC[0]) minC[0] = c[0];
    if(c[1] < minC[1]) minC[1] = c[1];
    if(c[2] < minC[2]) minC[2] = c[2];
    if(c[0] > maxC[0]) maxC[0] = c[0];
    if(c[1] > maxC[1]) maxC[1] = c[1];
    if(c[2] > maxC[2]) maxC[2] = c[2];
  }
  while(list.length > 0) {
    let coords = list.shift().split(",").map(i => + i);
    // if any coords are below/above bounding box of structure, we escaped the blob, not trapped air
    if(
      coords[0] < minC[0] || coords[1] < minC[1] || coords[2] < minC[2] ||
      coords[0] > maxC[0] || coords[1] > maxC[1] || coords[2] > maxC[2]
    ) return false;
    for(let n of neightbors) {
      let nc = `${coords[0] + n[0]},${coords[1] + n[1]},${coords[2] + n[2]}`;
      if(map.get(nc) === undefined) {
        // this is also air
        if(!all.includes(nc)) {
          list.push(nc);
          all.push(nc);
        }
      }
    }
  }
  return true; // search ended, so fully eclosed
}

function checkSides(map) {
  let total = 0;
  for(let [key, _] of map) {
    let coords = key.split(",").map(i => + i);
    for(let n of neightbors) {
      if(map.get(`${coords[0] + n[0]},${coords[1] + n[1]},${coords[2] + n[2]}`) === undefined) total++;
    }
  }
  return total;
}

function checkSidesOutside(map) {
  let total = 0;
  for(let [key, _] of map) {
    let coords = key.split(",").map(i => + i);
    for(let n of neightbors) {
      if(map.get(`${coords[0] + n[0]},${coords[1] + n[1]},${coords[2] + n[2]}`) === undefined) {
        if(!isTrappedAir(map, `${coords[0] + n[0]},${coords[1] + n[1]},${coords[2] + n[2]}`)) total++;
      }
    }
  }
  return total;
}

console.log(checkSides(createMap(data.split("\n"))));

console.log(checkSidesOutside(createMap(data.split("\n"))));
