
const tdata = `#.#####
#.....#
#>....#
#.....#
#...v.#
#.....#
#####.#`;
// part 1: 10 steps, part2: 30 steps

const tdata2 = `#.######
#>>.<^<#
#.<..<<#
#>v.><>#
#<^v^^>#
######.#`;

const dirs = [[1, 0], [0, 1], [-1, 0], [0, -1]];

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

function updateBlizzards(map) {
  let nblizzards = new Map();
  for(let [key, val] of map.m) {
    for(let blizzard of val.blizzards) {
      let c = key.split(",").map(i => +i);
      c[0] += dirs[blizzard][0];
      c[1] += dirs[blizzard][1];
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
    updateBlizzards(map);
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

function bfs(map, start, endCheck) {
  let queue = [start];
  let visited = new Set();
  visited.add(start);
  while(queue.length > 0) {
    let current = queue.shift();
    if(map.m.get(current.split(",").slice(0, 2).join(","))[endCheck]) return +current.split(",").slice(2);
    for(let n of getNeightbors(map, current)) {
      if(!visited.has(n)) {
        visited.add(n);
        queue.push(n);
      }
    }
  }
  return -1;
}

function triplePath(map) {
  let s1 = bfs(map, "1,0,0", "end");
  let s2 = bfs(map, `${map.w - 1},${map.h},${s1}`, "start");
  return bfs(map, "1,0," + s2, "end");
}

export function part1(data) {
  return bfs(parseData(data), "1,0,0", "end");
}

export function part2(data) {
  return triplePath(parseData(data));
}
