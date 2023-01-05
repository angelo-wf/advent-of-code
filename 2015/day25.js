
// no testdata was provided

function getNum(row, col) {
  let num = 1 + ((row * (row - 1)) / 2);
  for(let i = 1; i < col; i++) {
    num += row + i;
  }
  return num;
}

function calcVal(num) {
  let val = 20151125;
  for(let i = 1; i < num; i++) {
    val *= 252533;
    val %= 33554393;
  }
  return val;
}

// data in format: 'To continue, please consult the code grid in the manual.  Enter the code at row <ROW>, column <COL>.'

export function part1(data) {
  return calcVal(getNum(...data.split(/\s+/).map(i => +i.slice(0, -1)).filter(i => !isNaN(i))));
}

export function part2(data) {
  return "N/A";
}
