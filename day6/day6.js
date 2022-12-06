
import fs from "node:fs";

const tdata = "mjqjpqmgbljsphdztnvjfqwrcgsmlb";
const tdata2 = "bvwbjplbgvbhsrlpgdmjqwftvncz";
const tdata3 = "nppdvjthqldpwncqszvftbrmjlhg";
const tdata4 = "nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg";
const tdata5 = "zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw";

const data = fs.readFileSync("input.txt", "utf-8").slice(0, -1);

function checkUnique(arr) {
  if(
    arr[0] !== arr[1] && arr[0] !== arr[2] && arr[0] !== arr[3] &&
    arr[1] !== arr[2] && arr[1] !== arr[3] && arr[2] !== arr[3]
  ) return true;
  return false;
}

function checkUniqueAll(arr) {
  let set = new Set();
  arr.forEach(e => set.add(e));
  return set.size == arr.length;
}

function checkInput(input) {
  let tarr = [];
  tarr.push(input[0], input[1], input[2], input[3]);
  for(let i = 4; i < input.length; i++) {
    if(checkUnique(tarr)) return i;
    tarr.shift();
    tarr.push(input[i]);
  }
  return 0;
}

function checkInputLong(input) {
  let tarr = [];
  for(let i = 0; i < 14; i++) tarr.push(input[i]);
  for(let i = 14; i < input.length; i++) {
    if(checkUniqueAll(tarr)) return i;
    tarr.shift();
    tarr.push(input[i]);
  }
  return 0;
}

console.log(checkInput(data));

console.log(checkInputLong(data));
