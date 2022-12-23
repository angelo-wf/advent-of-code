
import fs from "node:fs";

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

const data = fs.readFileSync("input.txt", "utf-8").slice(0, -1);

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

function getMaxSteam(node, nodes, countLeft, totalSteam = 0, steam = 0, prev = null, prune = {s: 0, a: null}, arr = []) {
  // calculate max steam if not done yet
  if(prune.a === null) {prune.a = 0; for(let n of nodes) prune.a += n.rate;}
  // if having everything open from now on still gives us a worse score than already found, prune
  if((totalSteam + prune.a * countLeft) <= prune.s) return [0, [...arr]];
  if(countLeft === 0) {
    if(totalSteam > prune.s) prune.s = totalSteam;
    return [totalSteam, [...arr, `done, fr: ${steam}`]];
  }
  let options = [];
  let allOpen = nodes.map(n => n.opened || n.rate === 0).reduce((a, s) => !s ? false : a, true);
  if(allOpen) {
    // stay here and wait
    if((totalSteam + steam * countLeft) > prune.s) {
      // if we get a better score, record it
      prune.s = totalSteam + steam * countLeft;
    }
    return [totalSteam + steam * countLeft, [...arr, `wait to end, fr: ${steam}`]];
  } else {
    // open valve if closed
    if(!node.opened && node.rate !== 0) {
      node.opened = true;
      arr.push(`at node ${node.name}, opening valve, fr: ${steam}`);
      options.push(getMaxSteam(node, nodes, countLeft - 1, totalSteam + steam, steam + node.rate, null, prune, arr));
      arr.pop();
      node.opened = false; // restore state
    }
    // go over neightbors
    for(let n of node.neightbors) {
      if(n.name !== prev) {
        arr.push(`at node ${node.name}, going to node ${n.name}, fr: ${steam}`);
        options.push(getMaxSteam(n, nodes, countLeft - 1, totalSteam + steam, steam, node.name, prune, arr));
        arr.pop();
      }
    }
  }
  let m = 0, h = null;
  for(let option of options) {if(option[0] > m) {m = option[0]; h = option}}
  return h === null ? [0, [...arr]] : h;
  // return Math.max(...options);
}

function getMaxSteamElephants(node1, node2, nodes, countLeft, totalSteam = 0, steam = 0, prev1 = null, prev2 = null, prune = {s: 0, a: null}, arr = []) {
  // calculate max steam if not done yet
  if(prune.a === null) {prune.a = 0; for(let n of nodes) prune.a += n.rate;}
  // if having everything open from now on still gives us a worse score than already found, prune
  if((totalSteam + prune.a * countLeft) <= prune.s) return [0, [...arr]];
  if(countLeft === 0) {
    if(totalSteam > prune.s) prune.s = totalSteam;
    return [totalSteam, [...arr, `done, fr: ${steam}`]];
  }
  let options = [];
  let allOpen = nodes.map(n => n.opened || n.rate === 0).reduce((a, s) => !s ? false : a, true);
  if(allOpen) {
    // stay here and wait
    if((totalSteam + steam * countLeft) > prune.s) {
      // if we get a better score, record it
      prune.s = totalSteam + steam * countLeft;
    }
    return [totalSteam + steam * countLeft, [...arr, `wait to end, fr: ${steam}`]];
  } else {
    // both open valve
    if(!node1.opened && node1.rate !== 0 && !node2.opened && node2.rate !== 0 && node1.name !== node2.name) {
      node1.opened = true;
      node2.opened = true;
      arr.push(`H at node ${node1.name} opening valve, E at node ${node2.name} opening valve, fr: ${steam}`);
      options.push(getMaxSteamElephants(node1, node2, nodes, countLeft - 1, totalSteam + steam, steam + node1.rate + node2.rate, null, null, prune, arr));
      arr.pop();
      node1.opened = false; // restore state
      node2.opened = false;
    }
    // 1 opens valve, 2 moves or stays still
    if(!node1.opened && node1.rate !== 0) {
      node1.opened = true;
      for(let n of node2.neightbors) {
        if(n.name !== prev2) {
          arr.push(`H at node ${node1.name} opening valve, E at node ${node2.name} moving to ${n.name}, fr: ${steam}`);
          options.push(getMaxSteamElephants(node1, n, nodes, countLeft - 1, totalSteam + steam, steam + node1.rate, null, node2.name, prune, arr));
          arr.pop();
        }
      }
      // options.push(getMaxSteamElephants(node1, node2, nodes, countLeft - 1, totalSteam + steam, steam + node1.rate, null, prev2, prune));
      node1.opened = false;
    }
    // 1 moves or stays still, 2 opens valve
    if(!node2.opened && node2.rate !== 0) {
      node2.opened = true;
      for(let n of node1.neightbors) {
        if(n.name !== prev1) {
          arr.push(`H at node ${node1.name} moving to ${n.name}, E at node ${node2.name} opening valve, fr: ${steam}`);
          options.push(getMaxSteamElephants(n, node2, nodes, countLeft - 1, totalSteam + steam, steam + node2.rate, node1.name, null, prune, arr));
          arr.pop();
        }
      }
      // options.push(getMaxSteamElephants(node1, node2, nodes, countLeft - 1, totalSteam + steam, steam + node2.rate, prev1, null, prune));
      node2.opened = false;
    }
    // both move or one moves
    for(let n1 of node1.neightbors) {
      for(let n2 of node2.neightbors) {
        // for each combo
        if(n1.name !== prev1 && n2.name !== prev2) {
          arr.push(`H at node ${node1.name} moving to ${n1.name}, E at node ${node2.name} moving to ${n2.name}, fr: ${steam}`);
          options.push(getMaxSteamElephants(n1, n2, nodes, countLeft - 1, totalSteam + steam, steam, node1.name, node2.name, prune, arr));
          arr.pop();
        }
      }
    }
    // for(let n1 of node1.neightbors) {
    //   if(n1.name !== prev1) options.push(getMaxSteamElephants(n1, node2, nodes, countLeft - 1, totalSteam + steam, steam, node1.name, prev2, prune));
    // }
    // for(let n2 of node2.neightbors) {
    //   if(n2.name !== prev2) options.push(getMaxSteamElephants(node1, n2, nodes, countLeft - 1, totalSteam + steam, steam, prev1, node2.name, prune));
    // }
  }
  let m = 0, h = null;
  for(let option of options) {if(option[0] > m) {m = option[0]; h = option}}
  return h === null ? [0, [...arr]] : h;
  // return Math.max(...options);
}

function findWithElephants(data) {
  let [node, nodes] = parseData(data);
  return getMaxSteamElephants(node, node, nodes, 26);
}

console.log(getMaxSteam(...parseData(data.split("\n")), 30));

console.log(findWithElephants(data.split("\n")));
