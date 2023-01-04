
const tdata = `[1,2,3]`;
const tdata2 = `{"a":2,"b":4}`;
const tdata3 = `[[[3]]]`;
const tdata4 = `{"a":{"b":4},"c":-1}`;
const tdata5 = `{"a":[-1,1]}`;
const tdata6 = `[-1,{"a":1}]`;
const tdata7 = `[]`;
const tdata8 = `{}`; // part 2 for all above: same as part 1
const tdata9 = `[1,{"c":"red","b":2},3]`; // part 1: 6
const tdata10 = `{"d":"red","e":[1,2,3,4],"f":5}`; // part 1: 15
const tdata11 = `[1,"red",5]`; // part 1: 6

function countNumbers(val, noRed) {
  if(typeof val === "number") return val;
  if(typeof val === "string") return 0;
  if(Array.isArray(val)) return val.map(i => countNumbers(i, noRed)).reduce((a, s) => a + s, 0);
  if(!noRed) {
    return Object.values(val).map(i => countNumbers(i, noRed)).reduce((a, s) => a + s, 0);
  } else {
    let values = Object.values(val);
    if(values.includes("red")) return 0;
    return values.map(i => countNumbers(i, noRed)).reduce((a, s) => a + s, 0);
  }
}

export function part1(data) {
  return countNumbers(JSON.parse(data), false);
}

export function part2(data) {
  return countNumbers(JSON.parse(data), true);
}
