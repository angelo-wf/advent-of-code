
const tdata = `(())`; // part 2: N/A
const tdata2 = `()()`; // part 2: N/A
const tdata3 = `(((`; // part 2: N/A
const tdata4 = `(()(()(`; // part 2: N/A
const tdata5 = `))(((((`; // part 2: 1
const tdata6 = `())`; // part 2: 3
const tdata7 = `))(`; // part 2: 1
const tdata8 = `)))`; // part 2: 1
const tdata9 = `)())())`; // part 2: 1
const tdata10 = `)`; // part 1: -1
const tdata11 = `()())`; // part 1: -1

function findBasement(data) {
  let level = 0;
  for(let i = 0; i < data.length; i++) {
    level += data[i] === "(" ? 1 : -1;
    if(level < 0) return i + 1;
  }
  return -1;
}

export function part1(data) {
  return data.split("").map(v => v === "(" ? 1 : -1).reduce((a, s) => a + s, 0);
}

export function part2(data) {
  return findBasement(data);
}
