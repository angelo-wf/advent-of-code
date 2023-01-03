
const tdata = `Valve AA has flow rate=0; tunnels lead to valves DD, II, BB
Valve BB has flow rate=13; tunnels lead to valves CC, AA
Valve CC has flow rate=2; tunnels lead to valves DD, BB
Valve DD has flow rate=20; tunnels lead to valves CC, AA, EE
Valve EE has flow rate=3; tunnels lead to valves FF, DD
Valve FF has flow rate=0; tunnels lead to valves EE, GG
Valve GG has flow rate=0; tunnels lead to valves FF, HH
Valve HH has flow rate=22; tunnel leads to valve GG
Valve II has flow rate=0; tunnels lead to valves AA, JJ
Valve JJ has flow rate=21; tunnel leads to valve II`;

function parseData(lines) {
  let map = {};
  let nodes = [];
  for(let line of lines) {
    let nodeName = line.slice(6, 8);
    let rate = +line.slice(23, line.indexOf("; tunnel"));
    let loc = line.indexOf("valve ") + 6; // if not found: -1 + 6 = 5
    if(loc === 5) loc = line.indexOf("valves ") + 7;
    let paths = line.slice(loc).split(", ");
    let node = {name: nodeName, rate: rate, opened: false, neightbors: paths};
    map[nodeName] = node;
    nodes.push(node);
  }
  for(let node of nodes) {
    for(let i = 0; i < node.neightbors.length; i++) {
      node.neightbors[i] = map[node.neightbors[i]];
    }
  }
  return [map["AA"], nodes];
}

function getMaxSteam(node, nodes, countLeft, totalSteam = 0, steam = 0, prev = null, prune = {s: 0, a: null}) {
  // calculate max steam if not done yet
  if(prune.a === null) {prune.a = 0; for(let n of nodes) prune.a += n.rate;}
  // if having everything open from now on still gives us a worse score than already found, prune
  if((totalSteam + prune.a * countLeft) <= prune.s) return 0;
  // if done, return, else, check if all valves open and return early, or go one level deeper taking a action (move/open)
  if(countLeft === 0) {
    if(totalSteam > prune.s) prune.s = totalSteam;
    return totalSteam;
  }
  let options = [];
  let allOpen = nodes.map(n => n.opened || n.rate === 0).reduce((a, s) => !s ? false : a, true);
  if(allOpen) {
    // stay here and wait
    if((totalSteam + steam * countLeft) > prune.s) {
      // if we get a better score, record it
      prune.s = totalSteam + steam * countLeft;
    }
    return totalSteam + steam * countLeft;
  } else {
    // open valve if closed
    if(!node.opened && node.rate !== 0) {
      node.opened = true;
      options.push(getMaxSteam(node, nodes, countLeft - 1, totalSteam + steam, steam + node.rate, null, prune));
      node.opened = false; // restore state
    }
    // go over neightbors, except the one we just came from
    for(let n of node.neightbors) {
      if(n.name !== prev) options.push(getMaxSteam(n, nodes, countLeft - 1, totalSteam + steam, steam, node.name, prune));
    }
  }
  let m = 0;
  for(let option of options) {if(option > m) m = option;}
  return m;
}

function getMaxSteamElephants(node1, node2, nodes, countLeft, totalSteam = 0, steam = 0, prev1 = null, prev2 = null, prune = {s: 0, a: null}) {
  // calculate max steam if not done yet
  if(prune.a === null) {prune.a = 0; for(let n of nodes) prune.a += n.rate;}
  // if having everything open from now on still gives us a worse score than already found, prune
  if((totalSteam + prune.a * countLeft) <= prune.s) return 0;
  // if done, return, else, check if all valves open and return early, or go one level deeper taking a combination of actions (move/open) for both solvers
  if(countLeft === 0) {
    if(totalSteam > prune.s) prune.s = totalSteam;
    return totalSteam;
  }
  let options = [];
  let allOpen = nodes.map(n => n.opened || n.rate === 0).reduce((a, s) => !s ? false : a, true);
  if(allOpen) {
    // stay here and wait
    if((totalSteam + steam * countLeft) > prune.s) {
      // if we get a better score, record it
      prune.s = totalSteam + steam * countLeft;
    }
    return totalSteam + steam * countLeft;
  } else {
    // both open valve
    if(!node1.opened && node1.rate !== 0 && !node2.opened && node2.rate !== 0 && node1.name !== node2.name) {
      node1.opened = true;
      node2.opened = true;
      options.push(getMaxSteamElephants(node1, node2, nodes, countLeft - 1, totalSteam + steam, steam + node1.rate + node2.rate, null, null, prune));
      node1.opened = false;
      node2.opened = false;
    }
    // 1 opens valve, 2 moves
    if(!node1.opened && node1.rate !== 0) {
      node1.opened = true;
      for(let n of node2.neightbors) {
        if(n.name !== prev2) options.push(getMaxSteamElephants(node1, n, nodes, countLeft - 1, totalSteam + steam, steam + node1.rate, null, node2.name, prune));
      }
      node1.opened = false;
    }
    // 1 moves, 2 opens valve
    if(!node2.opened && node2.rate !== 0) {
      node2.opened = true;
      for(let n of node1.neightbors) {
        if(n.name !== prev1) options.push(getMaxSteamElephants(n, node2, nodes, countLeft - 1, totalSteam + steam, steam + node2.rate, node1.name, null, prune));
      }
      node2.opened = false;
    }
    // both move
    for(let n1 of node1.neightbors) {
      for(let n2 of node2.neightbors) {
        // for each combo
        if(n1.name !== prev1 && n2.name !== prev2) options.push(getMaxSteamElephants(n1, n2, nodes, countLeft - 1, totalSteam + steam, steam, node1.name, node2.name, prune));
      }
    }
  }
  let m = 0;
  for(let option of options) {if(option > m) m = option;}
  return m;
}

function findWithElephants(data) {
  let [node, nodes] = parseData(data);
  return getMaxSteamElephants(node, node, nodes, 26);
}

export function part1(data) {
  return getMaxSteam(...parseData(data.split("\n")), 30);
}

export function part2(data) {
  return findWithElephants(data.split("\n"));
}
