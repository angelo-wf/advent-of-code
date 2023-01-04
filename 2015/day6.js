
const tdata = `turn on 0,0 through 999,999
toggle 0,0 through 999,0
turn off 499,499 through 500,500`;
// part 1: 998996, part 2: 1001996

const tdata2 = `turn on 0,0 through 0,0
toggle 0,0 through 999,999`;
// part 1: 999999, part 2: 2000001

function parse(data) {
  let res = [];
  for(let line of data.split("\n")) {
    let item = {op: "", coords: []};
    let splitSpot = 0;
    if(line.startsWith("turn on ")) {
      item.op = "on";
      splitSpot = 8;
    } else if(line.startsWith("turn off ")) {
      item.op = "off";
      splitSpot = 9;
    } else { // toggle
      item.op = "toggle"
      splitSpot = 7;
    }
    item.coords = line.slice(splitSpot).split(" through ").join(",").split(",").map(i => +i);
    res.push(item);
  }
  return res;
}

function createLights() {
  let lights = [];
  for(let y = 0; y < 1000; y++) {
    let row = [];
    for(let x = 0; x < 1000; x++) row.push(0);
    lights.push(row);
  }
  return lights;
}

function doCommands(lights, commands) {
  for(let command of commands) {
    for(let y = command.coords[1]; y <= command.coords[3]; y++) {
      for(let x = command.coords[0]; x <= command.coords[2]; x++) {
        if(command.op === "on") lights[y][x] = 1;
        if(command.op === "off") lights[y][x] = 0;
        if(command.op === "toggle") lights[y][x] = lights[y][x] === 0 ? 1 : 0;
      }
    }
  }
  return lights;
}

function doNewCommands(lights, commands) {
  for(let command of commands) {
    for(let y = command.coords[1]; y <= command.coords[3]; y++) {
      for(let x = command.coords[0]; x <= command.coords[2]; x++) {
        if(command.op === "on") lights[y][x]++;
        if(command.op === "off") lights[y][x]--;
        if(command.op === "toggle") lights[y][x] += 2;
        if(lights[y][x] < 0) lights[y][x] = 0;
      }
    }
  }
  return lights;
}

function getSum(lights) {
  let sum = 0;
  for(let y = 0; y < 1000; y++) {
    for(let x = 0; x < 1000; x++) sum += lights[y][x];
  }
  return sum;
}

export function part1(data) {
  return getSum(doCommands(createLights(), parse(data)));
}

export function part2(data) {
  return getSum(doNewCommands(createLights(), parse(data)));
}
