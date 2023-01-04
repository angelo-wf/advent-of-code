
const tdata = `1`;
// part 1: 82350, part 2: 1166642

function expandNum(num) {
  let count = 0;
  let prev = "";
  let res = "";
  for(let char of num) {
    if(char === prev) {
      count++;
    } else {
      if(count > 0) res += count + prev;
      count = 1;
    }
    prev = char;
  }
  res += count + prev;
  return res;
}

function expandTimes(num, count) {
  for(let i = 0; i < count; i++) {
    num = expandNum(num);
  }
  return num;
}

export function part1(data) {
  return expandTimes(data, 40).length;
}

export function part2(data) {
  return expandTimes(data, 50).length;
}
