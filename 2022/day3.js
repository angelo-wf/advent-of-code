
const tdata = `vJrwpWtwJgWrhcsFMMfFFhFp
jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
PmmdzqPrVvPwwTWBwg
wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
ttgJtRGJQctTZtZT
CrZsJsPPZsGzwwsLwLmpwMDw`;

function splitInThrees(input) {
  let groupedInput = [];
  let innerItems = [];
  for(let line of input.split("\n")) {
    innerItems.push(line);
    if(innerItems.length === 3) {
      groupedInput.push(innerItems);
      innerItems = [];
    }
  }
  return groupedInput;
}

// get an string of all chars shared between 2 strings
function getSharedBetween(a1, a2) {
  let out = "";
  for(let c1 of a1) {
    for(let c2 of a2) {
      if(c1 === c2 && !out.includes(c1)) {
        out += c1;
      }
    }
  }
  return out;
}

function getScore(c) {
  if(c.toUpperCase() === c) {
    // uppercase
    return c.codePointAt(0) - 64 + 26;
  }
  return c.codePointAt(0) - 96;
}

export function part1(data) {
  return data.split("\n").map(i => [i.slice(0, i.length / 2), i.slice(i.length / 2)]).map(i => getScore(getSharedBetween(i[0], i[1])[0])).reduce((a, s) => a + s, 0);
}

export function part2(data) {
  return splitInThrees(data).map(i => getSharedBetween(getSharedBetween(i[0], i[1]), i[2])[0]).map(i => getScore(i)).reduce((a, s) => a + s, 0);
}
