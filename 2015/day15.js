
const tdata = `Butterscotch: capacity -1, durability -2, flavor 6, texture 3, calories 8
Cinnamon: capacity 2, durability 3, flavor -2, texture -1, calories 3`;

function parse(lines) {
  let out = [];
  for(let line of lines.split("\n")) {
    let parts = line.split(/,?\s/);
    out.push([+parts[2], +parts[4], +parts[6], +parts[8], +parts[10]]);
  }
  return out;
}

function getScore(amounts, counts) {
  let capacity = 0;
  let durability = 0;
  let flavor = 0;
  let texture = 0;
  let calories = 0;
  for(let i = 0; i < counts.length; i++) {
    capacity += amounts[i][0] * counts[i];
    durability += amounts[i][1] * counts[i];
    flavor += amounts[i][2] * counts[i];
    texture += amounts[i][3] * counts[i];
    calories += amounts[i][4] * counts[i];
  }
  if(capacity < 0) capacity = 0;
  if(durability < 0) durability = 0;
  if(flavor < 0) flavor = 0;
  if(texture < 0) texture = 0;
  return [capacity * durability * flavor * texture, calories];
}

function findDivisions(count, max) {
  if(count === 2) {
    let ret = [];
    for(let i = 0; i <= max; i++) {
      ret.push([i, max - i]);
    }
    return ret;
  } else {
    // for each amount of first, find divisions of remainder for rest, and prepend first
    let ret = [];
    for(let i = 0; i <= max; i++) {
      findDivisions(count - 1, max - i).forEach(d => ret.push([i].concat(d)));
    }
    return ret;
  }
}

function findBest(amounts, specificCals) {
  let best = 0;
  for(let division of findDivisions(amounts.length, 100)) {
    let [score, calories] = getScore(amounts, division);
    if(score > best && (!specificCals || calories === 500)) best = score;
  }
  return best;
}

export function part1(data) {
  return findBest(parse(data), false);
}

export function part2(data) {
  return findBest(parse(data), true);
}
