
import crypto from "node:crypto";

const tdata = `abcdef`; // part 2: 6742839
const tdata2 = `pqrstuv`; // part 2: 5714438

function findHash(data, start) {
  let i = 0;
  while(true) {
    let hash = crypto.createHash("md5").update(data + i).digest("hex");
    if(hash.startsWith(start)) break;
    i++;
  }
  return i;
}

export function part1(data) {
  return findHash(data, "00000");
}

export function part2(data) {
  return findHash(data, "000000");
}
