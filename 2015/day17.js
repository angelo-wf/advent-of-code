
const tdata = `20
15
10
5
5`;

function findSets(arr) {
  let res = [];
  for(let i = 0; i < (2 ** arr.length); i++) {
    let out = [];
    // for each bit of value, if set, add to this set
    for(let j = 0; j < arr.length; j++) {
      if((i >> j) & 1) out.push(arr[j]);
    }
    res.push(out);
  }
  return res;
}

function getMinLengthCount(arrs) {
  let min = Infinity;
  for(let arr of arrs) if(arr.length < min) min = arr.length;
  return arrs.filter(arr => arr.length === min).length;
}

const testData = false;

export function part1(data) {
  return findSets(data.split("\n").map(i => +i)).filter(i => i.reduce((a, s) => a + s, 0) === (testData ? 25 : 150)).length;
}

export function part2(data) {
  return getMinLengthCount(findSets(data.split("\n").map(i => +i)).filter(i => i.reduce((a, s) => a + s, 0) === (testData ? 25 : 150)));
}
