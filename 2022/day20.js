
const tdata = `1
2
-3
3
-2
0
4`;

function findIdx(arr, i) {
  for(let j = 0; j < arr.length; j++) {
    if(arr[j].i === i) return j;
  }
  return -1;
}

function mix(arr, count) {
  for(let j = 0; j < count; j++) {
    for(let i = 0; i < arr.length; i ++) {
      let startPos = findIdx(arr, i);
      // when moving from end, we need to move 1 further, so mod by length - 1
      let endPos = (startPos + arr[startPos].v) % (arr.length - 1);
      let v = arr.splice(startPos, 1);
      arr.splice(endPos, 0, v[0]);
    }
  }
  let zeroPos = 0;
  for(let i = 0; i < arr.length; i++) {
    if(arr[i].v === 0) zeroPos = i;
  }
  return [1000, 2000, 3000].map(v => arr[(zeroPos + v) % arr.length].v).reduce((a, s) => a + s, 0);
}

function parseVals(vals) {
  let out = [];
  for(let i = 0; i < vals.length; i++) {
    out.push({v: vals[i], i: i});
  }
  return out;
}

export function part1(data) {
  return mix(parseVals(data.split("\n").map(v => +v)), 1);
}

export function part2(data) {
  return mix(parseVals(data.split("\n").map(v => (+v) * 811589153)), 10);
}
