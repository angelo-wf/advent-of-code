
const tdata = `abcdefgh`; // part 2: abcdffbb
const tdata2 = `ghijklmn`; // part 2: ghjbbcdd

const alpha = "abcdefghijklmnopqrstuvwxyz";

function checkPw(pw) {
  for(let c of pw) {
    if(c === 8 || c === 14 || c === 11) return false;
  }
  let inc = false;
  for(let i = 0; i < pw.length - 2; i++) {
    if(pw[i] === pw[i + 1] - 1 && pw[i] === pw[i + 2] - 2) {
      inc = true;
      break;
    }
  }
  let pairs = new Set();
  for(let i = 0; i < pw.length - 1; i++) {
    if(pw[i] === pw[i + 1]) pairs.add(pw[i]);
    if(pairs.size >= 2) break;
  }
  return inc && pairs.size >= 2;
}

function incrementPw(pw) {
  pw[pw.length - 1]++;
  for(let i = pw.length - 1; i >= 0; i--) {
    if(pw[i] > 25) {
      pw[i] -= 26;
      if(i > 0) pw[i - 1]++;
    }
  }
  return pw;
}

function getNextValid(pw) {
  let conf = pw.split("").map(i => alpha.indexOf(i));
  do {
    conf = incrementPw(conf);
  } while(!checkPw(conf));
  return conf.map(i => alpha[i]).join("");
}

export function part1(data) {
  return getNextValid(data);
}

export function part2(data) {
  return getNextValid(getNextValid(data));
}
