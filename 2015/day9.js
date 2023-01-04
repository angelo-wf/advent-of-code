
const tdata = `London to Dublin = 464
London to Belfast = 518
Dublin to Belfast = 141`;

function parse(lines) {
  let nodes = {};
  for(let line of lines.split("\n")) {
    let [path, distance] = line.split(" = ");
    let [from, to] = path.split(" to ");
    if(nodes[from] === undefined) {
      nodes[from] = {visited: false, dests: [{to: to, dist: +distance}]};
    } else {
      nodes[from].dests.push({to: to, dist: +distance});
    }
    if(nodes[to] === undefined) {
      nodes[to] = {visited: false, dests: [{to: from, dist: +distance}]};
    } else {
      nodes[to].dests.push({to: from, dist: +distance});
    }
  }
  return nodes;
}

// assume a net where each location has a path to every other location
function findPaths(nodes, at, shortest, dist = 0) {
  let options = [];
  // mark as visited
  nodes[at].visited = true;
  // find path for every non-visited destination
  for(let dest of nodes[at].dests) {
    if(!nodes[dest.to].visited) {
      options.push(findPaths(nodes, dest.to, shortest, dist + dest.dist));
    }
  }
  // unmark
  nodes[at].visited = false;
  if(options.length === 0) return dist;
  return shortest ? Math.min(...options) : Math.max(...options);
}

function findBest(data, shortest) {
  // for each location, find best path from there
  let vals = Object.keys(data).map(k => findPaths(data, k, shortest));
  return shortest ? Math.min(...vals) : Math.max(...vals);
}

export function part1(data) {
  return findBest(parse(data), true);
}

export function part2(data) {
  return findBest(parse(data), false);
}
