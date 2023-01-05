
const tdata = `Hit Points: 12
Damage: 7
Armor: 2`;
// part 1: 8, part 2: N/A (player always wins)

const items = {
  weapons: [[8, 4, 0], [10, 5, 0], [25, 6, 0], [40, 7, 0], [74, 8, 0]],
  armors: [[0, 0, 0], [13, 0, 1], [31, 0, 2], [53, 0, 3], [75, 0, 4], [102, 0, 5]], // armor 0: no armor
  rings: [[0, 0, 0], [25, 1, 0], [50, 2, 0], [100, 3, 0], [20, 0, 1], [40, 0, 2], [80, 0, 3]] // ring 0: no ring
};

function simulateGame(hp, atk, def, bhp, batk, bdef) {
  let playerTurn = true;
  while(true) {
    if(playerTurn) {
      let ratk = atk - bdef;
      if(ratk < 1) ratk = 1;
      bhp -= ratk;
    } else {
      let ratk = batk - def;
      if(ratk < 1) ratk = 1;
      hp -= ratk;
    }
    if(hp <= 0) return false;
    if(bhp <= 0) return true;
    playerTurn = !playerTurn;
  }
}

function getBest(data, lose) {
  let best = lose ? -Infinity : Infinity;
  for(let weapon of items.weapons) {
    for(let armor of items.armors) {
      for(let i = 0; i < items.rings.length; i++) {
        for(let j = i; j < items.rings.length; j++) {
          // if not the same, or both item 0 (no ring)
          if((i === 0 && j === 0) || i !== j) {
            let ring1 = items.rings[i];
            let ring2 = items.rings[j];
            let cost = weapon[0] + armor[0] + ring1[0] + ring2[0];
            let atk = weapon[1] + armor[1] + ring1[1] + ring2[1];
            let def = weapon[2] + armor[2] + ring1[2] + ring2[2];
            let result = simulateGame(100, atk, def, ...data);
            if(lose ? !result : result) {
              if(!lose && cost < best) best = cost;
              if(lose && cost > best) best = cost;
            }
          }
        }
      }
    }
  }
  return best;
}

export function part1(data) {
  return getBest(data.split("\n").map(l => +l.split(" ").slice(-1)), false);
}

export function part2(data) {
  return getBest(data.split("\n").map(l => +l.split(" ").slice(-1)), true);
}
