
const tdata = `""
"abc"
"aaa\\"aaa"
"\\x27"`;

function parseString(str) {
  // assume all string are valid: start and end with '"', only '\\', '\"' and '\xDD'
  str = str.slice(1, -1);
  let res = "";
  let i = 0;
  while(true) {
    if(i >= str.length) break;
    let c = str[i++];
    if(c === "\\") {
      let escaped = str[i++];
      if(escaped === "x") {
        let f = str[i++];
        let code = parseInt(f + str[i++], 16);
        res += String.fromCodePoint(code);
      } else if(escaped === "\"") {
        res += "\"";
      } else { // '\'
        res += "\\";
      }
    } else {
      res += c;
    }
  }
  return res;
}

function encodeString(str) {
  let res = "";
  for(let c of str) {
    if(c === "\"") res += "\\\"";
    else if(c === "\\") res += "\\\\";
    else res += c;
  }
  return `"${res}"`;
}

export function part1(data) {
  return data.split("\n").map(l => l.length - parseString(l).length).reduce((a, s) => a + s, 0);
}

export function part2(data) {
  return data.split("\n").map(l => encodeString(l).length - l.length).reduce((a, s) => a + s, 0);
}
