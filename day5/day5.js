
import fs from "node:fs";

const tdata = `    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2`;

const data = fs.readFileSync("input.txt", "utf-8").slice(0, -1);

function parseInput(input) {
  let parts = input.split("\n\n");
  let stackss = parts[0].split("\n").slice(0, -1);
  let stacksTrans = [];
  for(let line of stackss) {
    let stackVals = [];
    for(let i = 0; i < line.length; i += 4) {
      if(line[i] === "[") {
        stackVals.push(line[i + 1]);
      } else {
        stackVals.push("");
      }
    }
    stacksTrans.push(stackVals);
  }
  // create stacks
  let stacks = [];
  for(let i = 0; i < stacksTrans[0].length; i++) {
    let stack = [];
    for(let j = stacksTrans.length - 1; j >= 0; j--) {
      if(stacksTrans[j][i] !== "") stack.push(stacksTrans[j][i]);
    }
    stacks.push(stack);
  }
  // create commands
  let commands = parts[1].split("\n").map(i => [
    +i.slice(5, i.indexOf(" from ")),
    +i.slice(i.indexOf(" from ") + 6, i.indexOf(" to ")),
    +i.slice(i.indexOf(" to ") + 4)
  ]);
  return [stacks, commands];
}

function configureStacks(stacks, commands) {
  for(let command of commands) {
    for(let i = 0; i < command[0]; i++) {
      stacks[command[2] - 1].push(stacks[command[1] - 1].pop());
    }
  }
  return stacks;
}

function configureStacksNew(stacks, commands) {
  for(let command of commands) {
    let vals = [];
    for(let i = 0; i < command[0]; i++) vals.push(stacks[command[1] - 1].pop());
    for(let i = 0; i < command[0]; i++) stacks[command[2] - 1].push(vals.pop());
  }
  return stacks;
}

function getTops(stacks) {
  return stacks.map(a => a[a.length - 1]).reduce((s, a) => s + a, "");
}

console.log(getTops(configureStacks(...parseInput(data))));

console.log(getTops(configureStacksNew(...parseInput(data))));
