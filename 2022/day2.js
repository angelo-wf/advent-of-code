
const tdata = `A Y
B X
C Z`;

// 0: rock, 1: paper, 2: scissors
const types = {A: 0, B: 1, C: 2, X: 0, Y: 1, Z: 2};

const plays = [{w: 1, l: 2}, {w: 2, l: 0}, {w: 0, l: 1}];

function testGame(y, o) {
  if(y == o) return 3;
  if(y == 0 && o == 2) return 6;
  if(y == 1 && o == 0) return 6;
  if(y == 2 && o == 1) return 6;
  return 0;
}

function getPlay(o, c) {
  if(c == 0) {
    return plays[o].l;
  } else if(c == 2) {
    return plays[o].w;
  }
  return o;
}

export function part1(data) {
  return data.split("\n").map(i => i.split(" ").map(x => types[x])).reduce((a, s) => a + testGame(s[1], s[0]) + s[1] + 1, 0);
}

export function part2(data) {
  return data.split("\n").map(i => i.split(" ").map(x => types[x])).reduce((a, s) => a + testGame(getPlay(s[0], s[1]), s[0]) + getPlay(s[0], s[1]) + 1, 0);
}
