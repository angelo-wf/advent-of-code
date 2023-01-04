
const tdata = `123 -> x
456 -> y
x AND y -> d
x OR y -> e
x LSHIFT 2 -> f
y RSHIFT 2 -> g
NOT x -> h
NOT y -> i
h OR i -> z
d AND e -> m
f OR g -> c
z AND m -> w
w OR c -> n
7 -> b
n RSHIFT b -> a`;
// added lines to add an 'a'; part 1: 3, part 2: 63

function parse(lines) {
  let res = {};
  for(let line of lines.split("\n")) {
    let parts = line.split(" -> ");
    let val = undefined;
    if(parts[0].startsWith("NOT ")) {
      val = {op: "NOT", l: parts[0].slice(4)};
    } else {
      let sections = parts[0].split(/\s(?:AND|OR|LSHIFT|RSHIFT)\s/);
      if(sections.length > 1) {
        val = {op: parts[0].slice(sections[0].length + 1, -(sections[1].length + 1)), l: sections[0], r: sections[1]};
      } else {
        val = {op: "EQ", l: parts[0]};
      }
    }
    if(!isNaN(+val.l)) val.l = +val.l;
    if(val.r !== undefined && !isNaN(+val.r)) val.r = +val.r;
    res[parts[1]] = val;
  }
  return res;
}

function calc(map, n, cache = {}) {
  if(cache[n] !== undefined) return cache[n];
  let ans = 0;
  if(typeof n === "number") {
    ans = n;
  } else {
    let v = map[n];
    switch(v.op) {
      case "EQ": ans = calc(map, v.l, cache); break;
      case "NOT": ans = ~calc(map, v.l, cache) & 0xffff; break;
      case "AND": ans = calc(map, v.l, cache) & calc(map, v.r, cache); break;
      case "OR": ans = calc(map, v.l, cache) | calc(map, v.r, cache); break;
      case "LSHIFT": ans = (calc(map, v.l, cache) << calc(map, v.r, cache)) & 0xffff; break;
      case "RSHIFT": ans = (calc(map, v.l, cache) >> calc(map, v.r, cache)) & 0xffff; break;
    }
  }
  cache[n] = ans;
  return ans;
}

function calcWithOverride(data) {
  let a = calc(data, "a");
  data["b"] = {op: "EQ", l: a};
  return calc(data, "a");
}

export function part1(data) {
  return calc(parse(data), "a");
}

export function part2(data) {
  return calcWithOverride(parse(data));
}
