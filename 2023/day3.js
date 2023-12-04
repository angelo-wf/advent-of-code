
const tdata = `467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..`;

function handleMap(map, onlyStars = false) {
  let linenum = 0;
  let numList = [];
  for(let line of map) {
    let i = 0;
    while(i < line.length) {
      if(line[i++].match(/\d/)) {
        let num = +line[i - 1];
        let [symboled, symbolx, symboly] = checkSymbols(map, linenum, i - 1, onlyStars);
        // go forward until end of digits
        while(line[i++].match(/\d/)) {
          let [sym, sx, sy] = checkSymbols(map, linenum, i - 1, onlyStars);
          if(sym) {
            symboled = true;
            symbolx = sx;
            symboly = sy;
          }
          num *= 10;
          num += +line[i - 1];
        }
        numList.push([symboled, num, symbolx, symboly]);
      }
    }
    linenum++;
  }
  return numList;
}

function checkGearRatio(numList) {
  let doneCombies = new Set();
  let total = 0;
  for(let item of numList) {
    if(doneCombies.has(`${item[2]},${item[3]}`)) continue;
    // check if another number has the same x,y
    for(let item2 of numList) {
      if(item === item2) continue;
      if(item[2] === item2[2] && item[3] === item2[3]) {
        doneCombies.add(`${item[2]},${item[3]}`);
        total += item[1] * item2[1];
      }
    }
  }
  return total;
}

function checkSymbols(map, line, col, onlyStars = false) {
  for(let x = -1; x <= 1; x++) {
    for(let y = -1; y <= 1; y++) {
      let rx = col + x;
      let ry = line + y;
      if(rx < 0 || rx >= map[0].length) continue;
      if(ry < 0 || ry >= map.length) continue;
      if(x === 0 && y === 0) continue;
      let char = map[ry][rx];
      if(onlyStars) {
        if(char === "*") return [true, rx, ry];
      } else {
        if(!char.match(/\d/) && char !== ".") return [true, rx, ry];
      }
    }
  }
  return [false];
}

export function part1(data) {
  return handleMap(data.split("\n").map(l => l + ".")).filter(i => i[0]).reduce((a, s) => a + s[1], 0);
}

export function part2(data) {
  return checkGearRatio(handleMap(data.split("\n").map(l => l + "."), true).filter(i => i[0]));
}
