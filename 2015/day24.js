
const tdata = `1
2
3
4
5
7
8
9
10
11`;

function getSetWithCount(arr, count) {
  if(count == 1) {
    let out = [];
    for(let item of arr) out.push([item]);
    return out;
  }
  let out = [];
  for(let i = 0; i < arr.length - count + 1; i++) {
    getSetWithCount(arr.slice(i + 1), count - 1).forEach(v => out.push([arr[i]].concat(v)));
  }
  return out;
}

function canSplitInParts(arr, max, parts) {
  for(let i = (2 ** arr.length) - 1; i >= 0; i--) {
    // for each bit of value, check if using those array indices gives max
    let out1sum = 0;
    for(let j = 0; j < arr.length; j++) {
      if((i >> j) & 1) out1sum += arr[j];
    }
    if(out1sum === max) {
      // if we only need 2 parts, getting sum is enough
      if(parts === 2) {
        return true;
      } else {
        let out2 = [];
        // create array for remainder, to check if it can be split
        for(let j = 0; j < arr.length; j++) {
          if(!((i >> j) & 1)) out2.push(arr[j]);
        }
        // return if remainder can be split in parts succesfully
        if(canSplitInParts(out2, max, parts - 1)) return true;
      }
    }
  }
  return false;
}

// given array, looks at how it can be split in parts, with each part having values
// that add up to same value, returns list of all shortest first parts
function splitInParts(arr, parts) {
  let max = arr.reduce((a, s) => a + s, 0) / parts;
  let res = [];
  let numArr = [];
  for(let i = 0; i < arr.length; i++) numArr.push(i);
  for(let i = 1; i <= arr.length; i++) {
    // for each amount of items
    for(let option of getSetWithCount(numArr, i)) {
      // get sum of adding up, check if valid
      let out1sum = option.reduce((a, s) => a + arr[s], 0);
      if(out1sum === max) {
        // if total reached max, get split arrays and add if rest is also divisible
        let out1 = [];
        let out2 = [];
        for(let i = 0; i < arr.length; i++) {
          if(option.includes(i)) {
            out1.push(arr[i]);
          } else {
            out2.push(arr[i]);
          }
        }
        if(canSplitInParts(out2, max, parts - 1)) res.push(out1);
      }
    }
    // if we found solutions, don't check longer sets
    if(res.length > 0) break;
  }
  return res;
}

function findQuantum(items, count) {
  let parts = splitInParts(items, count);
  let min = Infinity;
  for(let part of parts) {
    let q = part.reduce((a, s) => a * s, 1);
    if(q < min) min = q;
  }
  return min;
}

export function part1(data) {
  return findQuantum(data.split("\n").map(i => +i), 3);
}

export function part2(data) {
  return findQuantum(data.split("\n").map(i => +i), 4);
}
