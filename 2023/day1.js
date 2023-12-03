
const tdata = `1abc2
pqr3stu8vwx
a1b2c3d4e5f
treb7uchet`;

const tdata2 = `two1nine
eightwothree
abcone2threexyz
xtwone3four
4nineeightseven2
zoneight234
7pqrstsixteen`;

const regex = /\d|one|two|three|four|five|six|seven|eight|nine/;
const regexRev = /\d|eno|owt|eerht|ruof|evif|xis|neves|thgie|enin/;

function findLastDigit(str, textDigits = false) {
  let rev = str.split("").reverse().join("");
  return (textDigits ? regexRev : /\d/).exec(rev)[0];
}

function parseNumber(val) {
  if(/\d/.test(val)) return +val;
  switch(val) {
    case "one": return 1;
    case "two": return 2;
    case "three": return 3;
    case "four": return 4;
    case "five": return 5;
    case "six": return 6;
    case "seven": return 7;
    case "eight": return 8;
    case "nine": return 9;
    default: return parseNumber(val.split("").reverse().join(""));
  }
}

export function part1(data) {
  return data.split("\n").map(i => 10 * +i[i.search(/\d/)] + +findLastDigit(i)).reduce((s, a) => s + a);
}

export function part2(data) {
  return data.split("\n").map(i => 10 * parseNumber(regex.exec(i)[0]) + parseNumber(findLastDigit(i, true))).reduce((s, a) => s + a);
}
