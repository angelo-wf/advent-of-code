
const tdata = "mjqjpqmgbljsphdztnvjfqwrcgsmlb";
const tdata2 = "bvwbjplbgvbhsrlpgdmjqwftvncz";
const tdata3 = "nppdvjthqldpwncqszvftbrmjlhg";
const tdata4 = "nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg";
const tdata5 = "zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw";

function checkUnique(arr) {
  let set = new Set();
  arr.forEach(e => set.add(e));
  return set.size == arr.length;
}

function checkInput(input, count) {
  let tarr = [];
  for(let i = 0; i < count; i++) tarr.push(input[i]);
  for(let i = count; i < input.length; i++) {
    if(checkUnique(tarr)) return i;
    tarr.shift();
    tarr.push(input[i]);
  }
  return 0;
}

export function part1(data) {
  return checkInput(data, 4);
}

export function part2(data) {
  return checkInput(data, 14);
}
