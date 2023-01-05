
// no testdata was provided

function createArray(val, limited) {
  // precalculate amount for each house up to val
  let arr = new Uint32Array(val);
  for(let i = 1; i <= val; i++) {
    let count = 0;
    for(let j = i - 1; j < val; j += i) {
      arr[j] += (limited ? 11 : 10) * i;
      count++;
      if(limited && count === 50) break;
    }
  }
  return arr;
}

function getHouseNum(val, limited) {
  let arr = createArray(val / 10, limited);
  for(let i = 0; i < arr.length; i++) {
    if(arr[i] >= val) return i + 1;
  }
  return -1;
}

export function part1(data) {
  return getHouseNum(+data, false);
}

export function part2(data) {
  return getHouseNum(+data, true);
}
