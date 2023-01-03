
const tdata = `1=-0-2
12111
2=0=
21
2=01
111
20012
112
1=-1=
1-12
12
1=
122`;

function snafuToNum(snafu) {
  let pow = 1;
  let total = 0;
  for(let i = snafu.length - 1; i >= 0; i--) {
    let c = snafu[i];
    let idx = "=-012".indexOf(c) - 2;
    total += idx * pow;
    pow *= 5;
  }
  return total;
}

function numToSnafu(num) {
  let vals = [];
  while(num > 0) {
    vals.unshift(Math.floor(num % 5));
    num = Math.floor(num / 5);
  }
  if(vals.length === 0) vals = [0];
  // go over end to start, adjusting next place up if we need 3 or 4
  let needOne = false;
  for(let i = vals.length - 1; i >= 0; i--) {
    let n = vals[i];
    if(n >= 3) {
      n = -(5 - n);
      vals[i] = n;
      if(i - 1 < 0) {
        needOne = true;
      } else {
        vals[i - 1]++;
      }
    }
  }
  if(needOne) vals.unshift(1);
  return vals.map(i => "=-012"[i + 2]).join("");
}

export function part1(data) {
  return numToSnafu(data.split("\n").map(snafuToNum).reduce((a, s) => a + s, 0));
}

export function part2(data) {
  return "N/A";
}
