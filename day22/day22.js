
import fs from "node:fs";

const tdata = `        ...#
        .#..
        #...
        ....
...#.......#
........#...
..#....#....
..........#.
        ...#....
        .....#..
        .#......
        ......#.

10R5L5R10L4R5L5`;

const data = fs.readFileSync("input.txt", "utf-8").slice(0, -1);

const dirs = [[1, 0], [0, 1], [-1, 0], [0, -1]];

function parseData(data) {
  let [maps, list] = data.split("\n\n");
  // parse map (with extra border of 2's around)
  let lines = maps.split("\n");
  let width = Math.max(...lines.map(l => l.length));
  let height = lines.length;
  let map = [[]];
  for(let i = 0; i < width + 2; i++) map[0].push(2);
  for(let y = 0; y < height; y++) {
    map.push([2]);
    for(let x = 0; x < width; x++) {
      if(x >= lines[y].length || lines[y][x] === " ") {
        map[y + 1].push(2);
      } else {
        map[y + 1].push(lines[y][x] === "#" ? 1 : 0);
      }
    }
    map[y + 1].push(2);
  }
  map.push([]);
  for(let i = 0; i < width + 2; i++) map[map.length - 1].push(2);
  // parse list
  let ops = [];
  let curNum = "";
  for(let char of list) {
    if(char.match(/\d/)) {
      curNum += char;
    } else {
      ops.push({m: +curNum});
      ops.push({r: char});
      curNum = "";
    }
  }
  if(curNum.length > 0) ops.push({m: +curNum});
  return [map, ops];
}

function followPath(map, path) {
  let pos = null;
  for(let y = 1; y < map.length; y++) {
    for(let x = 1; x < map[0].length; x++) {
      if(map[y][x] === 0) {
        pos = [x, y];
        break;
      }
    }
    if(pos !== null) break;
  }
  let dir = 0;
  for(let op of path) {
    if(op.r) {
      if(op.r === "R") {
        dir = (dir + 1) % 4;
      } else {
        dir = (dir + 3) % 4;
      }
    } else {
      // move
      for(let i = 0; i < op.m; i++) {
        // attempt to move
        let old = [pos[0], pos[1]];
        pos[0] += dirs[dir][0];
        pos[1] += dirs[dir][1];
        if(map[pos[1]][pos[0]] === 2) {
          // loop to other end of map
          let [x, y] = pos;
          let [dx, dy] = dirs[(dir + 2) % 4];
          while(true) {
            x += dx;
            y += dy;
            if(map[y][x] === 2) {
              // back up one
              pos[0] = x - dx;
              pos[1] = y - dy;
              break;
            }
          }
        }
        // if could not move, restore old pos
        if(map[pos[1]][pos[0]] === 1) {
          pos = [old[0], old[1]];
        }
      }
    }
  }
  return pos[1] * 1000 + pos[0] * 4 + dir;
}

console.log(followPath(...parseData(data)));
