
import fs from "node:fs";

const tdata = `#.######
#>>.<^<#
#.<..<<#
#>v.><>#
#<^v^^>#
######.#`;

const data = tdata; // fs.readFileSync("input.txt", "utf-8").slice(0, -1);

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

// implement a*, bfs is not doing it
function search(map) {
  let queue = ["1,0,0"];
  let visited = new Set();
  while(queue.length > 0) {
    let test = queue.shift();
    visited.add(test);
    if(map.m.get(test.split(",").slice(0, 2).join(",")).end) {
      return +test.split(",")[2];
    }
    for(let n of getNeightbors(map, test)) {
      if(!visited.has(n)) queue.push(n);
    }
  }
  return 0;
}

// does not work (stack limit)
// function search(map, x, y, c = 0, prune = {s: Infinity}) {
//   if((c + Math.abs(map.w - 1 - x) + Math.abs(map.h - y)) >= prune.s) return Infinity;
//   if(map.m.get(`${x},${y}`).end) {
//     if(c < prune.s) prune.s = c;
//     return c;
//   }
//   let options = [];
//   updateBlizzards(map, false);
//   for(let d of dirs) {
//     let o = map.m.get(`${x + d[0]},${y + d[1]}`);
//     if(!o.wall && !o.blizzards.length > 0) {
//       options.push(search(map, x + d[0], y + d[1], c + 1, prune));
//     }
//   }
//   if(map.m.get(`${x},${y}`).blizzards.length === 0) {
//     options.push(search(map, x, y, c + 1, prune));
//   }
//   updateBlizzards(map, true);
//   return Math.min(...options);
// }

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

console.log(search(parseData(data)));

