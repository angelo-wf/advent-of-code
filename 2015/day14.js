
const tdata = `Comet can fly 14 km/s for 10 seconds, but then must rest for 127 seconds.
Dancer can fly 16 km/s for 11 seconds, but then must rest for 162 seconds.`;
// part 1: 2660

function parse(lines) {
  let res = [];
  for(let line of lines.split("\n")) {
    let parts = line.split(" ");
    res.push({
      name: parts[0],
      speed: +parts[3],
      speedTime: +parts[6],
      restTime: +parts[13],
      timer: 0,
      resting: true,
      distance: 0
    });
  }
  return res;
}

function simulate(deer, time) {
  for(let i = 0; i < time; i++) {
    for(let d of deer) {
      if(d.timer === 0) {
        d.resting = !d.resting;
        d.timer = d.resting ? d.restTime : d.speedTime;
      }
      if(!d.resting) d.distance += d.speed;
      d.timer--;
    }
  }
  return deer;
}

export function part1(data) {
  return Math.max(...simulate(parse(data), 2503).map(d => d.distance));
}

export function part2(data) {
  return 0;
}
