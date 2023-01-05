
const tdata = `H => HO
H => OH
O => HH
e => H
e => O

HOH`;

const tdata2 = `H => HO
H => OH
O => HH
e => H
e => O

HOHOHO`;

function parse(data) {
  let sections = data.split("\n\n");
  let rules = sections[0].split("\n").map(l => l.split(" => "));
  return [rules, sections[1]];
}

// gives array of all possibilities
function applyRule(molecule, from, to) {
  let out = [];
  for(let i = 0; i < molecule.length - (from.length - 1); i++) {
    if(molecule.slice(i, i + from.length) === from) {
      out.push(molecule.slice(0, i) + to + molecule.slice(i + from.length));
    }
  }
  return out;
}

function getPossibilies(rules, molecule) {
  let res = new Set();
  for(let [from, to] of rules) {
    applyRule(molecule, from, to).forEach(v => res.add(v));
  }
  return res;
}

function findGreedy(rules, molecule) {
  // sort rules from longest replacement to shortest
  rules.sort((a, b) => b[1].length - a[1].length);
  // assume greedy algorithm will find best result for data
  let steps = 0;
  while(molecule !== "e") {
    let replaced = false;
    for(let [from, to] of rules) {
      let opts = applyRule(molecule, to, from);
      if(opts.length > 0) {
        molecule = opts[0];
        steps++;
        replaced = true;
        break;
      }
    }
    if(!replaced) return -1;
  }
  return steps;
}

export function part1(data) {
  return getPossibilies(...parse(data)).size;
}

export function part2(data) {
  return findGreedy(...parse(data));
}
