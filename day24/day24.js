
import fs from "node:fs";

const tdata = `#.######
#>>.<^<#
#.<..<<#
#>v.><>#
#<^v^^>#
######.#`;

const data = fs.readFileSync("input.txt", "utf-8").slice(0, -1);

const dirs = [[1, 0], [0, 1], [-1, 0], [0, -1]];
const rdirs = [[-1, 0], [0, -1], [1, 0], [0, 1]];

function parseData(data) {
  let map = new Map();
  let y = 0;
  let width = 0;
  for(let line of data.split("\n")) {
    let x = 0;
    for(let char of line) {
      let o = {
        wall: char === "#",
        blizzards: [],
        blocked: []
      };
      let i = ">v<^".indexOf(char);
      if(i >= 0) o.blizzards.push(i);
      map.set(`${x},${y}`, o);
      x++;
    }
    width = x;
    y++;
  }
  // assume start is top left, end is bottom right, add walls above/below spot
  // (start at 1,0; end at w-1,h)
  map.get("1,0").start = true;
  map.set("1,-1", {wall: true, blizzards: [], blocked: []});
  map.get(`${width - 2},${y - 1}`).end = true;
  map.set(`${width - 2},${y}`, {wall: true, blizzards: [], blocked: []});
  return setupBlockArrays({m: map, w: width - 1, h: y - 1, });
}

function updateBlizzards(map, reversed) {
  let nblizzards = new Map();
  for(let [key, val] of map.m) {
    for(let blizzard of val.blizzards) {
      let c = key.split(",").map(i => +i);
      let d = (reversed ? rdirs : dirs)[blizzard];
      c[0] += d[0];
      c[1] += d[1];
      if(c[0] === 0) c[0] = map.w - 1;
      if(c[0] === map.w) c[0] = 1;
      if(c[1] === 0) c[1] = map.h - 1;
      if(c[1] === map.h) c[1] = 1;
      let a = nblizzards.get(c.join(","));
      if(a !== undefined) {
        a.push(blizzard);
      } else {
        nblizzards.set(c.join(","), [blizzard]);
      }
    }
    val.blizzards = [];
  }
  for(let [key, val] of nblizzards) {
    map.m.get(key).blizzards = val;
  }
}

function setupBlockArrays(map) {
  // sets up arrays in each node indicating if it is blocked at that moment
  for(let i = 0; i < (map.w - 1) * (map.h - 1); i++) {
    for(let y = 0; y <= map.h; y++) {
      for(let x = 0; x <= map.w; x++) {
        let i = map.m.get([x, y].join(","));
        if(!i.wall) {
          i.blocked.push(i.blizzards.length > 0);
        }
      }
    }
    updateBlizzards(map, false);
  }
  return map;
}

function getNeightbors(map, node) {
  // node: x,y,c
  let n = node.split(",").map(i => +i);
  let nc = (n[2] + 1) % ((map.w - 1) * (map.h - 1));
  let nbs = [];
  for(let dir of dirs) {
    let nb = map.m.get(`${n[0] + dir[0]},${n[1] + dir[1]}`);
    if(!nb.wall && !nb.blocked[nc]) {
      nbs.push(`${n[0] + dir[0]},${n[1] + dir[1]},${n[2] + 1}`);
    }
  }
  if(!map.m.get(`${n[0]},${n[1]}`).blocked[nc]) {
    nbs.push(`${n[0]},${n[1]},${n[2] + 1}`);
  }
  return nbs;
}

function heuristic(map, node) {
  // manhattan distance to end
  let [x, y, _] = node.split(",").map(i => +i);
  return Math.abs(map.w - 1 - x) + Math.abs(map.h - y);
}

function getDefault(map, key, def) {
  let i = map.get(key);
  if(i === undefined) return def;
  return i;
}

function astar(map, start, endCheck) {
  let openSet = new Set();
  openSet.add(start);
  let cameFrom = new Map();
  let gScore = new Map();
  gScore.set(start, 0);
  let fScore = new Map();
  fScore.set(start, heuristic(map, start));
  while(openSet.size !== 0) {
    // find node with lowest fscore
    let current = null;
    let lowestCost = Infinity;
    for(let item of openSet) {
      if(fScore.get(item) < lowestCost) {
        current = item;
        lowestCost = fScore.get(item);
      }
    }
    if(map.m.get(current.split(",").slice(0, 2).join(","))[endCheck]) return +current.split(",").slice(2);
    openSet.delete(current);
    for(let n of getNeightbors(map, current)) {
      let tenativeG = gScore.get(current) + 1;
      if(tenativeG < getDefault(gScore, n, Infinity)) {
        cameFrom.set(n, current);
        gScore.set(n, tenativeG);
        fScore.set(n, tenativeG + heuristic(map, n));
        if(!openSet.has(n)) openSet.add(n);
      }
    }
  }
  return -1;
}

function triplePath(map) {
  let s1 = astar(map, "1,0,0", "end");
  let s2 = astar(map, `${map.w - 1},${map.h},${s1}`, "start");
  return astar(map, "1,0," + s2, "end");
}

// used for debugging
function drawMap(map) {
  let str = "";
  for(let y = 0; y <= map.h; y++) {
    for(let x = 0; x <= map.w; x++) {
      let i = map.m.get([x, y].join(","));
      if(i.wall) str += "#";
      else if(i.blizzards.length === 0) str += ".";
      else if(i.blizzards.length === 1) str += ">v<^"[i.blizzards[0]];
      else str += i.blizzards.length;
    }
    str += "\n";
  }
  console.log(str);
}

console.log(astar(parseData(data), "1,0,0", "end"));

console.log(triplePath(parseData(data)));
