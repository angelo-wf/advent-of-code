
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
  let shortest = Infinity;
  for(let i = (2 ** arr.length) - 1; i >= 0; i--) {
    // for each bit of value, if set, add array value to total and increment count
    let out1sum = 0;
    let out1count = 0;
    for(let j = 0; j < arr.length; j++) {
      if((i >> j) & 1) {
        out1sum += arr[j];
        out1count++;
      }
    }
    if(out1sum === max && out1count <= shortest) {
      // if total matches max, and no shorter one was found yet, get arrays for split
      let out1 = [];
      let out2 = [];
      for(let j = 0; j < arr.length; j++) {
        if((i >> j) & 1) {
          out1.push(arr[j]);
        } else {
          out2.push(arr[j]);
        }
      }
      if(canSplitInParts(out2, max, parts - 1)) {
        if(out1.length <= shortest) {
          shortest = out1.length;
          res.push(out1);
        }
      }
    }
  }
  let rres = [];
  shortest = Infinity;
  for(let item of res) if(item.length < shortest) shortest = item.length;
  for(let item of res) if(item.length === shortest) rres.push(item);
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
