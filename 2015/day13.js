
const tdata = `Alice would gain 54 happiness units by sitting next to Bob.
Alice would lose 79 happiness units by sitting next to Carol.
Alice would lose 2 happiness units by sitting next to David.
Bob would gain 83 happiness units by sitting next to Alice.
Bob would lose 7 happiness units by sitting next to Carol.
Bob would lose 63 happiness units by sitting next to David.
Carol would lose 62 happiness units by sitting next to Alice.
Carol would gain 60 happiness units by sitting next to Bob.
Carol would gain 55 happiness units by sitting next to David.
David would gain 46 happiness units by sitting next to Alice.
David would lose 7 happiness units by sitting next to Bob.
David would gain 41 happiness units by sitting next to Carol.`;
// part 2: 286

function parse(lines, addSelf) {
  let map = {};
  for(let line of lines.split("\n")) {
    let parts = line.split(" ");
    let name = parts[0];
    let val = +parts[3];
    if(parts[2] === "lose") val = -val;
    let next = parts[10].slice(0, -1); // remove dot
    if(map[name] === undefined) map[name] = {};
    map[name][next] = val;
  }
  if(addSelf) {
    for(let val of Object.values(map)) {
      val["self"] = 0;
    }
    map["self"] = {};
    for(let key of Object.keys(map)) {
      if(key !== "self") map["self"][key] = 0;
    }
  }
  return map;
}

function getPermutations(arr) {
  if(arr.length <= 1) return [arr];
  let out = [];
  // for each value, get permutations of array without it, and prepend value to each
  for(let val of arr) {
    let rest = arr.slice();
    rest.splice(arr.indexOf(val), 1);
    let pos = getPermutations(rest);
    pos.forEach(p => out.push([val].concat(p)));
  }
  return out;
}

function getBest(map) {
  let names = Object.keys(map);
  let max = -Infinity;
  for(let permutation of getPermutations(names)) {
    let score = 0;
    for(let i = 0; i < permutation.length; i++) {
      let left = i === 0 ? permutation.length - 1 : i - 1;
      let right = i === permutation.length - 1 ? 0 : i + 1;
      score += map[permutation[i]][permutation[left]];
      score += map[permutation[i]][permutation[right]];
    }
    if(score > max) {
      max = score;
    }
  }
  return max;
}

export function part1(data) {
  return getBest(parse(data, false));
}

export function part2(data) {
  return getBest(parse(data, true));
}
