
import fs from "node:fs";

const tdata = `root: pppw + sjmn
dbpl: 5
cczh: sllz + lgvd
zczc: 2
ptdq: humn - dvpt
dvpt: 3
lfqf: 4
humn: 5
ljgn: 2
sjmn: drzm * dbpl
sllz: 4
pppw: cczh / lfqf
lgvd: ljgn * ptdq
drzm: hmdt - zczc
hmdt: 32`;

const data = fs.readFileSync("input.txt", "utf-8").slice(0, -1);

function parseLines(lines) {
  let res = {};
  for(let line of lines) {
    let parts = line.split(": ");
    let name = parts[0];
    let rparts = parts[1].split(/\s[+*-\\]\s/);
    if(rparts.length === 1) {
      res[name] = {v: +parts[1]};
    } else {
      let op = parts[1].slice(5, 6);
      res[name] = {l: rparts[0], r: rparts[1], op: op};
    }
  }
  return res;
}

function calc(map, name) {
  let m = map[name];
  if(m.v !== undefined) return m.v;
  let l = calc(map, m.l);
  let r = calc(map, m.r);
  switch(m.op) {
    case "+": return l + r;
    case "-": return l - r;
    case "*": return l * r;
    case "/": return l / r;
  }
}

function containsHuman(map, name) {
  if(name === "humn") return true;
  if(map[name].v !== undefined) return false;
  if(containsHuman(map, map[name].l)) return true;
  if(containsHuman(map, map[name].r)) return true;
  return false;
}

function reverseCalcValue(map, name, wanted) {
  if(map[name].v !== undefined) {
    if(name !== "humn") console.error("Ended up at not human?");
    return wanted;
  }
  // figure out if L or R is what we want to know
  let m = map[name];
  if(containsHuman(map, m.l)) {
    // left side contains human, calc right side
    let r = calc(map, m.r);
    switch(m.op) {
      case "+": wanted -= r; break;
      case "-": wanted += r; break;
      case "*": wanted /= r; break;
      case "/": wanted *= r; break;
    }
    return reverseCalcValue(map, m.l, wanted);
  } else {
    // right side contains human, calc left side
    let l = calc(map, m.l);
    switch(m.op) {
      case "+": wanted -= l; break;
      case "-": wanted = l - wanted; break;
      case "*": wanted /= l; break;
      case "/": wanted = l / wanted; break;
    }
    return reverseCalcValue(map, m.r, wanted);
  }
}

function calcNeededValue(map) {
  if(containsHuman(map, map["root"].l)) {
    let wanted = calc(map, map["root"].r);
    return reverseCalcValue(map, map["root"].l, wanted);
  } else {
    let wanted = calc(map, map["root"].l);
    return reverseCalcValue(map, map["root"].r, wanted);
  }
}

console.log(calc(parseLines(data.split("\n")), "root"));

console.log(calcNeededValue(parseLines(data.split("\n"))));
