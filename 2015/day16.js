
// no testdata was provided

const scan = {
  children: 3,
  cats: 7,
  samoyeds: 2,
  pomeranians: 3,
  akitas: 0,
  vizslas: 0,
  goldfish: 5,
  trees: 3,
  cars: 2,
  perfumes: 1
};

function parse(lines) {
  let aunts = [];
  // lines in format: 'Sue <NUM>: goldfish: <A>, cars: <B>, samoyeds: <C>'
  for(let line of lines.split("\n")) {
    // assume Sue-s are ordered
    let parts = line.split(/[,:]?\s/);
    let val = {};
    val[parts[2]] = +parts[3];
    val[parts[4]] = +parts[5];
    val[parts[6]] = +parts[7];
    aunts.push(val);
  }
  return aunts;
}

function findAunt(aunts, inprecise) {
  let map = [];
  for(let i = 0; i < aunts.length; i++) map.push(true);
  for(let [key, val] of Object.entries(scan)) {
    for(let i = 0; i < aunts.length; i++) {
      let aunt = aunts[i];
      if(aunt[key] !== undefined) {
        let invalid = true;
        if(!inprecise) {
          invalid = aunt[key] !== val;
        } else {
          if(key === "cats" || key === "trees") {
            // scan indicates >, so if it is <=, it is invalid
            invalid = aunt[key] <= val;
          } else if(key === "pomeranians" || key === "goldfish") {
            // scan indicates <, so if it is >=, it is invalid
            invalid = aunt[key] >= val;
          } else {
            invalid = aunt[key] !== val;
          }
        }
        if(invalid) map[i] = false;
      }
    }
  }
  // there should only be one option left now
  for(let i = 0; i < map.length; i++) {
    if(map[i]) return i + 1;
  }
  return -1;
}

export function part1(data) {
  return findAunt(parse(data), false);
}

export function part2(data) {
  return findAunt(parse(data), true);
}
