
const tdata = `>`; // part 2: 3
const tdata2 = `^>v<`;
const tdata3 = `^v^v^v^v^v`;
const tdata4 = `^v`; // part 1: 2

const dirs = {">": [0, 1], "<": [0, -1], "^": [-1, 0], "v": [1, 0]};

function getHouseCount(data) {
  let pos = [0, 0];
  let map = new Map();
  map.set(pos.join(","), true);
  for(let c of data) {
    pos[0] += dirs[c][0];
    pos[1] += dirs[c][1];
    map.set(pos.join(","), true);
  }
  return map.size;
}

function getHouseCountRobot(data) {
  let poss = [[0, 0], [0, 0]];
  let map = new Map();
  map.set(poss[0].join(","), true);
  let turn = 0;
  for(let c of data) {
    poss[turn][0] += dirs[c][0];
    poss[turn][1] += dirs[c][1];
    map.set(poss[0].join(","), true);
    map.set(poss[1].join(","), true);
    turn = (turn + 1) % 2;
  }
  return map.size;
}

export function part1(data) {
  return getHouseCount(data);
}

export function part2(data) {
  return getHouseCountRobot(data);
}
