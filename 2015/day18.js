
const tdata = `.#.#.#
...##.
#....#
..#...
#.#..#
####..`;
// part 1: 4, part 2: 7

function parseGrid(data) {
  let grid = [];
  for(let line of data.split("\n")) {
    let row = [];
    for(let char of line) {
      row.push(char === "#" ? 1 : 0);
    }
    grid.push(row);
  }
  return grid;
}

function doStep(grid, stuck) {
  // force stuck lights on
  if(stuck) {
    grid[0][0] = 1;
    grid[0][grid[0].length - 1] = 1;
    grid[grid.length - 1][0] = 1;
    grid[grid.length - 1][grid[0].length - 1] = 1;
  }
  for(let y = 0; y < grid.length; y++) {
    for(let x = 0; x < grid[0].length; x++) {
      // get neightbor-count
      let nbs = 0;
      for(let nx = x - 1; nx <= x + 1; nx++) {
        for(let ny = y - 1; ny <= y + 1; ny++) {
          if(nx < 0 || nx >= grid[0].length || ny < 0 || ny >= grid.length) continue; // skip outside
          if(nx === x && ny === y) continue; // skip self
          if((grid[ny][nx] & 1) === 1) nbs++;
        }
      }
      let curState = grid[y][x] & 1;
      // set bit 1 to new state
      if(curState) {
        grid[y][x] |= (nbs === 2 || nbs === 3) ? 2 : 0;
      } else {
        grid[y][x] |= (nbs === 3) ? 2 : 0;
      }
    }
  }
  // move new states into current state
  for(let y = 0; y < grid.length; y++) {
    for(let x = 0; x < grid[0].length; x++) {
      // skip corners if they are stuck on
      if(stuck && (
        (x === 0 && y === 0) || (x === 0 && y === grid.length - 1) ||
        (x === grid[0].length - 1 && y === 0) || (x === grid[0].length - 1 && y === grid.length - 1)
      )) {
        grid[y][x] = 1;
        continue;
      }
      grid[y][x] >>= 1;
    }
  }
}

function doSteps(grid, count, stuck) {
  for(let i = 0; i < count; i++) doStep(grid, stuck);
  return grid;
}

export function part1(data) {
  return doSteps(parseGrid(data), 100, false).flat().reduce((a, s) => a + s, 0);
}

export function part2(data) {
  return doSteps(parseGrid(data), 100, true).flat().reduce((a, s) => a + s, 0);
}
