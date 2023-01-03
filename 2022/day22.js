
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

// maps from x,y moving by dx,dy to rx,rx moving by rdx,rdy, and reverse, for count spots
// nd is new direction if coming from x,y side, rnd when coming from rx,ry sde
// positions are first row/col 'outside' map for both x,y and rx,ry
// destination is ajusted to be on the map on destination side (using nd/rnd)
function addMapping(map, x, y, dx, dy, rx, ry, rdx, rdy, count, nd, rnd) {
  // reverse of dir after reverse move is direction move needs to be
  let fnd = (nd + 2) % 4;
  let frnd = (rnd + 2) % 4;
  for(let i = 0; i < count; i++) {
    map.set(`${x},${y},${frnd}`, {x: rx + dirs[nd][0], y: ry + dirs[nd][1], dir: nd});
    map.set(`${rx},${ry},${fnd}`, {x: x + dirs[rnd][0], y: y + dirs[rnd][1], dir: rnd});
    x += dx; y += dy;
    rx += rdx; ry += rdy;
  }
}

function createMapping(test) {
  // see diagram.png for color-reference
  let map = new Map();
  if(test) {
    //               x  y  dx dy  rx  ry rdx rdy c nd rnd
    addMapping(map,  1, 4, 1, 0, 12,  0, -1,  0, 4, 1, 1); // orange
    addMapping(map,  5, 4, 1, 0,  8,  1,  0,  1, 4, 0, 1); // red
    addMapping(map, 13, 1, 0, 1, 17, 12,  0, -1, 4, 2, 2); // yellow
    addMapping(map, 13, 5, 0, 1, 16,  8, -1,  0, 4, 1, 2); // green
    addMapping(map,  5, 9, 1, 0,  8, 12,  0, -1, 4, 0, 3); // cyan
    addMapping(map,  1, 9, 1, 0, 12, 13, -1,  0, 4, 3, 3); // blue
    addMapping(map,  0, 5, 0, 1, 16, 13, -1,  0, 4, 3, 0); // violet
  } else {
    //                x    y  dx dy  rx   ry rdx rdy  c nd rnd
    addMapping(map,   1, 100, 1, 0,  50,  51, 0,  1, 50, 0, 1); // red
    addMapping(map,   0, 101, 0, 1,  50,  50, 0, -1, 50, 0, 0); // blue
    addMapping(map,   0, 151, 0, 1,  51,   0, 1,  0, 50, 1, 0); // violet
    addMapping(map,   1, 201, 1, 0, 101,   0, 1,  0, 50, 1, 3); // cyan
    addMapping(map,  51, 151, 1, 0,  51, 151, 0,  1, 50, 2, 3); // green
    addMapping(map, 101, 101, 0, 1, 151,  50, 0, -1, 50, 2, 2); // orange
    addMapping(map, 101,  51, 1, 0, 101,  51, 0,  1, 50, 2, 3); // yellow
  }
  return map;
}

function followPath(map, path, cubed, testData) {
  let cmap = createMapping(testData);
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
        let oldDir = dir;
        pos[0] += dirs[dir][0];
        pos[1] += dirs[dir][1];
        if(map[pos[1]][pos[0]] === 2) {
          if(!cubed) {
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
          } else {
            // loop according to mapping
            let n = cmap.get(`${pos[0]},${pos[1]},${dir}`);
            if(n === undefined) console.error("Unmapped spot at " + pos.join(","));
            pos = [n.x, n.y];
            dir = n.dir;
          }
        }
        // if could not move, restore old pos
        if(map[pos[1]][pos[0]] === 1) {
          pos = [old[0], old[1]];
          dir = oldDir;
        }
      }
    }
  }
  return pos[1] * 1000 + pos[0] * 4 + dir;
}

const testData = false;

export function part1(data) {
  return followPath(...parseData(data), false, testData);
}

export function part2(data) {
  return followPath(...parseData(data), true, testData);
}
