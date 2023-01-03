
const tdata = `2-4,6-8
2-3,4-5
5-7,7-9
2-8,3-7
6-6,4-6
2-6,4-8`;

function checkOverlap(l1, r1, l2, r2) {
  if(l1 <= l2 && r1 >= r2) return true;
  if(l2 <= l1 && r2 >= r1) return true;
  return false;
}

function checkPartialOverlap(l1, r1, l2, r2) {
  if(r1 < l2) return false;
  if(r2 < l1) return false;
  return true;
}

export function part1(data) {
  return data.split("\n").map(i => i.split(",").map(j => j.split("-").map(k => +k))).map(i => checkOverlap(...i[0], ...i[1])).reduce((a, s) => a + (s ? 1 : 0), 0);
}

export function part2(data) {
  return data.split("\n").map(i => i.split(",").map(j => j.split("-").map(k => +k))).map(i => checkPartialOverlap(...i[0], ...i[1])).reduce((a, s) => a + (s ? 1 : 0), 0);
}
