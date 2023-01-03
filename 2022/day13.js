
const tdata = `[1,1,3,1,1]
[1,1,5,1,1]

[[1],[2,3,4]]
[[1],4]

[9]
[[8,7,6]]

[[4,4],4,4]
[[4,4],4,4,4]

[7,7,7,7]
[7,7,7]

[]
[3]

[[[]]]
[[]]

[1,[2,[3,[4,[5,6,7]]]],8,9]
[1,[2,[3,[4,[5,6,0]]]],8,9]`;

function parseValue(out, str, i) {
  if(str[i] === "[") {
    // parse array
    i++;
    let v = [];
    while(true) {
      if(str[i] === ",") i++;
      if(str[i] === "]") break;
      i = parseValue(v, str, i);
    }
    out.push(v);
    i++;
  } else {
    // parse number
    let num = "";
    while(true) {
      num += str[i++];
      if(!str[i].match(/\d/)) break;
    }
    out.push(+num);
  }
  return i;
}

// return true/false if order detected or null if not
function compare(l, r) {
  if(typeof l === "number" && typeof r === "number") {
    if(l === r) return null;
    return l < r;
  } else if(typeof l === "number") { // r is array
    return compare([l], r);
  } else if(typeof r === "number") { // l is array
    return compare(l, [r]);
  } else { // both arrays
    // compare item by item
    let count = Math.min(l.length, r.length);
    for(let i = 0; i < count; i++) {
      let c = compare(l[i], r[i]);
      if(c !== null) return c;
    }
    if(l.length < r.length) return true;
    if(l.length > r.length) return false;
    return null;
  }
}

function parseLine(line) {
  let out = [];
  parseValue(out, line, 0);
  return out[0];
}

function sortPackets(packets) {
  packets.sort((a, b) => {
    let c = compare(a, b);
    if(c === null) return 0;
    return c ? -1 : 1;
  });
  return packets;
}

function checkMarker(val) {
  if(typeof val === "number") return false;
  if(val.length !== 1) return false;
  if(typeof val[0] === "number") return false;
  if(val[0].length !== 1) return false;
  if(typeof val[0][0] !== "number") return false;
  return val[0][0] === 2 || val[0][0] === 6;
}

export function part1(data) {
  return data.split("\n\n").map(i => i.split("\n").map(parseLine)).map(i => compare(...i)).reduce((a, s, i) => a + (s ? i + 1 : 0), 0);
}

export function part2(data) {
  return sortPackets(data.split("\n\n").map(i => i.split("\n").map(parseLine)).flat().concat([[[2]], [[6]]])).reduce((a, s, i) => a * (checkMarker(s) ? i + 1 : 1), 1); 
}
