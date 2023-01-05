
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

// given array, gives array of pair/set of 3 of array where each has items totaling max
// if furtherSplit is set, splits in 3
// can probably be generalized to abritary split-counts
function splitInParts(arr, max, furtherSplit) {
  let res = [];
  for(let i = 0; i < (2 ** arr.length); i++) {
    let out1 = [];
    let out2 = [];
    // for each bit of value, if set, add to this set, else other set
    let out1sum = 0;
    for(let j = 0; j < arr.length; j++) {
      if((i >> j) & 1) out1sum += arr[j];
    }
    if(out1sum === max) {
      for(let j = 0; j < arr.length; j++) {
        if((i >> j) & 1) {
          out1.push(arr[j]);
        } else {
          out2.push(arr[j]);
        }
      }
      if(furtherSplit) {
        // split remainder in 2 parts
        let splits = splitInParts(out2, max, false);
        if(splits.length > 0) {
          splits.forEach(v => res.push([out1].concat(v)));
        }
      } else {
        res.push([out1, out2]);
      }
    }
  }
  return res;
}

export function part1(data) {
  // takes about ~50 seconds
  let max = data.split("\n").map(i => +i).reduce((a, s) => a + s, 0) / 3;
  (splitInParts(data.split("\n").map(i => +i), max, true));
  return 0;
}

export function part2(data) {
  return 0;
}
