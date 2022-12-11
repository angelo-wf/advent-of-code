
import fs from "node:fs";

const tdata = `Monkey 0:
  Starting items: 79, 98
  Operation: new = old * 19
  Test: divisible by 23
    If true: throw to monkey 2
    If false: throw to monkey 3

Monkey 1:
  Starting items: 54, 65, 75, 74
  Operation: new = old + 6
  Test: divisible by 19
    If true: throw to monkey 2
    If false: throw to monkey 0

Monkey 2:
  Starting items: 79, 60, 97
  Operation: new = old * old
  Test: divisible by 13
    If true: throw to monkey 1
    If false: throw to monkey 3

Monkey 3:
  Starting items: 74
  Operation: new = old + 3
  Test: divisible by 17
    If true: throw to monkey 0
    If false: throw to monkey 1`;

const data = fs.readFileSync("input.txt", "utf-8").slice(0, -1);

function parseMonkey(monkey) {
  /*
    assumptions:
    - lines always same order
    - monekys are in order (line 0 not needed)
    - starting items always list at end of line 1
    - operations always set new, only uses 'old' or number, only uses + or *
    - first item of operation is always non-number
    - test always checks division, has number at end
    - tru/false always in that order, has single number at end for monkey to throw to
    - monkey never throws to itself
  */
  let lines = monkey.split("\n");
  let items = lines[1].split(": ")[1].split(", ").map(i => +i);
  let operation = lines[2].split(" = ")[1];
  let opParts = operation.split(/\s[+*]\s/).map(i => i !== "old" ? +i : i);
  let op = operation.slice(opParts[0].length + 1, opParts[0].length + 2);
  let test = +lines[3].split(" ").slice(-1)[0];
  let trueThrow = +lines[4].split(" ").slice(-1)[0];
  let falseThrow = +lines[5].split(" ").slice(-1)[0];
  return {
    items: items,
    test: test,
    operation: op,
    opVals: opParts,
    throws: [falseThrow, trueThrow],
    inspectionCount: 0
  };
}

function doRound(monkeys) {
  for(let monkey of monkeys) {
    // do turn
    let itemCount = monkey.items.length;
    for(let i = 0; i < itemCount; i++) {
      // do operation
      monkey.inspectionCount++;
      let old = monkey.items.shift();
      let l = monkey.opVals[0] === "old" ? old : monkey.opVals[0];
      let r = monkey.opVals[1] === "old" ? old : monkey.opVals[1];
      let worry = 0;
      if(monkey.operation === "+") worry = l + r;
      if(monkey.operation === "*") worry = l * r;
      worry = Math.floor(worry / 3);
      monkeys[monkey.throws[+(worry % monkey.test === 0)]].items.push(worry);
    }
  }
}

function doRounds(monkeys) {
  for(let i = 0; i < 20; i++) {
    doRound(monkeys);
  }
  monkeys.sort((a, b) => b.inspectionCount - a.inspectionCount);
  return monkeys[0].inspectionCount * monkeys[1].inspectionCount;
}

function doRoundApprox(monkeys) {
  let divVal = monkeys.map(i => i.test).reduce((a, s) => a * s, 1);
  for(let monkey of monkeys) {
    // do turn
    let itemCount = monkey.items.length;
    for(let i = 0; i < itemCount; i++) {
      // do operation
      monkey.inspectionCount++;
      let old = monkey.items.shift();
      let l = monkey.opVals[0] === "old" ? old : monkey.opVals[0];
      let r = monkey.opVals[1] === "old" ? old : monkey.opVals[1];
      let worry = 0;
      if(monkey.operation === "+") worry = l + r;
      if(monkey.operation === "*") worry = l * r;
      // get remainder with product of div-vals, so all operations still check out
      // without values growing too big
      worry %= divVal;
      monkeys[monkey.throws[+(worry % monkey.test === 0)]].items.push(worry);
    }
  }
}

function doRoundsApprox(monkeys) {
  for(let i = 0; i < 10000; i++) {
    doRoundApprox(monkeys);
  }
  monkeys.sort((a, b) => b.inspectionCount - a.inspectionCount);
  return monkeys[0].inspectionCount * monkeys[1].inspectionCount;
}

console.log(doRounds(data.split("\n\n").map(parseMonkey)));

console.log(doRoundsApprox(data.split("\n\n").map(parseMonkey)));
