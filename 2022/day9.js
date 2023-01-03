
const tdata = `R 4
U 4
L 3
D 1
R 4
D 1
L 5
R 2`;

const tdata2 = `R 5
U 8
L 8
D 3
R 17
D 10
L 25
U 20`;
// part 1: 88 spots

const cardinals = [[0, 1], [0, -1], [1, 0], [-1, 0]];

const diagonals = [[1, 1], [1, -1], [-1, 1], [-1, -1]];

function checkTailInRange(head, tail) {
  return Math.abs(tail[0] - head[0]) <= 1 && Math.abs(tail[1] - head[1]) <= 1;
}

function fixTail(head, tail) {
  // check if tail is out of range, if in range, no fix needed, return
  if(checkTailInRange(head, tail)) return;
  // if horizontal, move tail cardinally
  let dirs = (head[0] === tail[0] || head[1] === tail[1]) ? cardinals : diagonals;
  // check all directions, do the one that works
  for(let dir of dirs) {
    if(checkTailInRange(head, [tail[0] + dir[0], tail[1] + dir[1]])) {
      tail[0] += dir[0];
      tail[1] += dir[1];
      return;
    }
  }
}

function handleLines(lines, knotCount) {
  let knots = [];
  for(let i = 0; i < knotCount; i++) knots.push([0, 0]);
  let tailPositions = new Set();
  for(let line of lines) {
    let [dir, count] = line.split(" ");
    count = +count;
    for(let i = 0; i < count; i++) {
      switch(dir) {
        case "R": knots[0][0]++; break;
        case "L": knots[0][0]--; break;
        case "U": knots[0][1]--; break;
        case "D": knots[0][1]++; break;
      }
      for(let i = 0; i < knotCount - 1; i++) fixTail(knots[i], knots[i + 1]);
      tailPositions.add(`${knots[knotCount - 1][0]}-${knots[knotCount - 1][1]}`);
    }
  }
  return tailPositions.size;
}

export function part1(data) {
  return handleLines(data.split("\n"), 2);
}

export function part2(data) {
  return handleLines(data.split("\n"), 10);
}
