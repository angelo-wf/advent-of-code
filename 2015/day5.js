
const tdata = `ugknbfddgicrmopn
aaa
jchzalrnumimnmhp
haegwjzuvuyypxyu
dvszwmarrgswjxmb`;
// part 1: 2, part 2: 0

const tdata2 = `qjhvhtzxzqqjkmpb
xxyxx
uurcxstgmygtbstg
ieodomkazucvgmuy`;
// part 1: 0, part 2: 2

function isNice(data) {
  if(data.includes("ab")) return false;
  if(data.includes("cd")) return false;
  if(data.includes("pq")) return false;
  if(data.includes("xy")) return false;
  let doubles = false;
  for(let i = 0; i < data.length - 1; i++) {
    if(data[i] === data[i + 1]) {
      doubles = true;
      break;
    }
  }
  let vowels = 0;
  for(let c of data) vowels += "aeiou".includes(c) ? 1 : 0;
  return vowels >= 3 && doubles;
}

function isNewNice(data) {
  let doubles = false;
  for(let i = 0; i < data.length - 1; i++) {
    // go over string to check if we match a pair
    for(let j = 0; j < data.length - 1; j++) {
      if(j >= i - 1 && j < i + 2) continue; // skip if it overlaps
      if(data[i] === data[j] && data[i + 1] === data[j + 1]) {
        doubles = true;
        break;
      }
    }
    if(doubles) break;
  }
  let pair = false;
  for(let i = 0; i < data.length - 2; i++) {
    if(data[i] === data[i + 2]) {
      pair = true;
      break;
    }
  }
  return pair && doubles;
}

export function part1(data) {
  return data.split("\n").map(isNice).reduce((a, s) => a + (s ? 1 : 0), 0);
}

export function part2(data) {
  return data.split("\n").map(isNewNice).reduce((a, s) => a + (s ? 1 : 0), 0);
}
