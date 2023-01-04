
const tdata = `2x3x4
1x1x10`;
// part 1: 101, part 2: 48

function findPaperAmount(data) {
  let total = 2 * data[0] * data[1] + 2 * data[0] * data[2] + 2 * data[1] * data[2];
  let slack = Math.min(data[0] * data[1], data[0] * data[2], data[1] * data[2]);
  return total + slack;
}

function findRibbonAmount(data) {
  let total = Math.min(2 * data[0] + 2 * data[1], 2 * data[0] + 2 * data[2], 2 * data[1] + 2 * data[2]);
  let bow = data[0] * data[1] * data[2];
  return total + bow;
}

export function part1(data) {
  return data.split("\n").map(v => v.split("x").map(i => +i)).map(findPaperAmount).reduce((a, s) => a + s, 0);
}

export function part2(data) {
  return data.split("\n").map(v => v.split("x").map(i => +i)).map(findRibbonAmount).reduce((a, s) => a + s, 0);
}
