
const tdata = `Blueprint 1: Each ore robot costs 4 ore. Each clay robot costs 2 ore. Each obsidian robot costs 3 ore and 14 clay. Each geode robot costs 2 ore and 7 obsidian.
Blueprint 2: Each ore robot costs 2 ore. Each clay robot costs 3 ore. Each obsidian robot costs 3 ore and 8 clay. Each geode robot costs 3 ore and 12 obsidian.`;

function findBest(map, iterLeft, oreb = 1, clayb = 0, obsib = 0, geodeb = 0, orec = 0, clayc = 0, obsic = 0, geodec = 0, prune = {s: 0}) {
  // if creating 1 extra bot each minute from now still gives less than max found, prune it
  // next minute create, then 1, then 2 + 1, then 3 + 2 + 1, etc...
  if(geodec + (geodeb * iterLeft) + ((iterLeft * (iterLeft - 1) / 2)) <= prune.s) return 0;
  if(iterLeft === 0) {
    // record best score if better
    if(geodec > prune.s) prune.s = geodec;
    return geodec;
  }
  let options = [];
  let maxOreNeeded = Math.max(map[0], map[1], map[2], map[4]);
  orec += oreb; clayc += clayb; obsic += obsib; geodec += geodeb;
  if((orec - oreb) >= map[4] && (obsic - obsib) >= map[5]) {
    // make geode-bot
    orec -= map[4]; obsic -= map[5];
    options.push(findBest(map, iterLeft - 1, oreb, clayb, obsib, geodeb + 1, orec, clayc, obsic, geodec, prune));
    orec += map[4]; obsic += map[5];
  }
  if((orec - oreb) >= map[2] && (clayc - clayb) >= map[3] && obsib < map[5]) {
    // make obsi-bot, unlesss we already have enough to make a geode bot every minute
    orec -= map[2]; clayc -= map[3];
    options.push(findBest(map, iterLeft - 1, oreb, clayb, obsib + 1, geodeb, orec, clayc, obsic, geodec, prune));
    orec += map[2]; clayc += map[3];
  }
  if((orec - oreb) >= map[1] && clayb < map[3]) {
    // make clay-bot, unless we already have enoguh to make an obsidian bot every minute
    orec -= map[1];
    options.push(findBest(map, iterLeft - 1, oreb, clayb + 1, obsib, geodeb, orec, clayc, obsic, geodec, prune));
    orec += map[1];
  }
  if((orec - oreb) >= map[0] && oreb < maxOreNeeded) {
    // make ore-bot, unless we already have enough for making any recipe every minute
    orec -= map[0];
    options.push(findBest(map, iterLeft - 1, oreb + 1, clayb, obsib, geodeb, orec, clayc, obsic, geodec, prune));
    orec += map[0];
  }
  // or don't make anything
  options.push(findBest(map, iterLeft - 1, oreb, clayb, obsib, geodeb, orec, clayc, obsic, geodec, prune));
  return Math.max(...options);
}

function findTotal(maps) {
  let sum = 0;
  for(let i = 0; i < maps.length; i++) {
    sum += (i + 1) * findBest(maps[i], 24);
  }
  return sum;
}

export function part1(data) {
  return findTotal(data.split("\n").map(l => l.split(" ").map(w => +w).filter(i => !isNaN(i))));
}

export function part2(data) {
  return data.split("\n").map(l => l.split(" ").map(w => +w).filter(i => !isNaN(i))).slice(0, 3).map(i => findBest(i, 32)).reduce((a, s) => a * s, 1);
}
