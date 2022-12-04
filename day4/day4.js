
import fs from "node:fs";

const tdata = `2-4,6-8
2-3,4-5
5-7,7-9
2-8,3-7
6-6,4-6
2-6,4-8`;

const data = fs.readFileSync("input.txt", "utf-8").slice(0, -1);

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

console.log(data.split("\n").map(i => i.split(",").map(j => j.split("-"))).map(i => checkOverlap(+i[0][0], +i[0][1], +i[1][0], +i[1][1])).reduce((s, a) => s + (a ? 1 : 0), 0));

console.log(data.split("\n").map(i => i.split(",").map(j => j.split("-"))).map(i => checkPartialOverlap(+i[0][0], +i[0][1], +i[1][0], +i[1][1])).reduce((s, a) => s + (a ? 1 : 0), 0));
