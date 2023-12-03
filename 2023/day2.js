
const tdata = `Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green`;

function parseInput(line) {
  let [gameStr, data] = line.split(": ");
  let num = +gameStr.slice(gameStr.indexOf(" ") + 1);
  let sets = data.split("; ");
  let setMaps = [];
  for(let set of sets) {
    let map = {};
    set.split(", ").map(i => i.split(" ")).forEach(m => map[m[1]] = +m[0]);
    setMaps.push(map);
  }
  return [num, setMaps];
}

function checkValid(maps) {
  for(let map of maps) {
    if(map.red !== undefined && map.red > 12) return false;
    if(map.green !== undefined && map.green > 13) return false;
    if(map.blue !== undefined && map.blue > 14) return false;
  }
  return true;
}

function checkPower(maps) {
  let maxRed = 0, maxGreen = 0, maxBlue = 0;
  for(let map of maps) {
    if(map.red !== undefined && map.red > maxRed) maxRed = map.red;
    if(map.green !== undefined && map.green > maxGreen) maxGreen = map.green;
    if(map.blue !== undefined && map.blue > maxBlue) maxBlue = map.blue;
  }
  return maxRed * maxGreen * maxBlue;
}

export function part1(data) {
  return data.split("\n").map(parseInput).filter(i => checkValid(i[1])).reduce((s, a) => s + a[0], 0);
}

export function part2(data) {
  return data.split("\n").map(parseInput).map(i => checkPower(i[1])).reduce((s, a) => s + a);
}
