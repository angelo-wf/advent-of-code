
const tdata = `seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4`;

function parseInput(input) {
  let parts = input.split("\n\n");
  let seeds = parts[0].split(": ")[1].split(" ").map(n => +n);
  let mapOut = {};
  for(let mapping of parts.slice(1)) {
    let [mapNames, mapRanges] = mapping.split(" map:\n");
    let [mapFrom, mapTo] = mapNames.split("-to-");
    let mappings = mapRanges.split("\n").map(v => v.split(" ")).map(a => ({s: +a[1], d: +a[0], r: +a[2]}));
    mapOut[mapFrom] = {to: mapTo, mappings: mappings};
  }
  return [seeds, mapOut];
}

function doMapping(mappings, value) {
  for(let mapping of mappings) {
    if(value >= mapping.s && value < mapping.s + mapping.r) {
      return mapping.d + (value - mapping.s);
    }
  }
  return value;
}

function findLocation(maps, seed) {
  let to = "seed";
  let val = seed;
  while(to !== "location") {
    val = doMapping(maps[to].mappings, val);
    to = maps[to].to;
  }
  return val;
}

function findLocations(input) {
  return input[0].map(v => findLocation(input[1], v));
}

function findMinLocationRanged(input) {
  let min = Infinity;
  for(let i = 0; i < input[0].length; i += 2) {
    for(let j = input[0][i]; j < input[0][i] + input[0][i + 1]; j++) {
      let val = findLocation(input[1], j);
      if(val < min) min = val;
    }
  }
  return min;
}

export function part1(data) {
  return Math.min(...findLocations(parseInput(data)));
}

export function part2(data) {
  // TODO: this brute-force is extremely slow, doesn't complete with a reasonable runtime (has yet to run to completion)
  return findMinLocationRanged(parseInput(data));
}
