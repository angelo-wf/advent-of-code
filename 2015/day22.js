
const tdata = `Hit Points: 13
Damage: 8`;
// part 1: 226, part 2: N/A (player always loses)

const tdata2 = `Hit Points: 14
Damage: 8`;
// part 1: 641, part 2: N/A (player always loses)

function step(mana, hp, bhp, bdmg, hard, turn = true, shield = -1, poison = -1, recharge = -1, manaSpend = 0, prune = {s: Infinity}) {
  // if we have spend more mana than what was used to kill boss succesfully, prune
  if(manaSpend >= prune.s) return Infinity;
  if(bhp <= 0) {
    if(manaSpend < prune.s) prune.s = manaSpend;
    return manaSpend; // boss is dead
  }
  if(hard && turn) hp--;
  if(hp <= 0) return Infinity; // dead
  if(turn && mana < 53) return Infinity; // not enough mana on your turn: death
  let options = [];
  if(recharge >= 0) mana += 101;
  if(poison >= 0) bhp -= 3;
  if(turn) {
    // player's turn, do spell
    if(mana >= 53) {
      options.push(step(mana - 53, hp, bhp - 4, bdmg, hard, false, shield - 1, poison - 1, recharge - 1, manaSpend + 53, prune));
    }
    if(mana >= 73) {
      options.push(step(mana - 73, hp + 2, bhp - 2, bdmg, hard, false, shield - 1, poison - 1, recharge - 1, manaSpend + 73, prune));
    }
    if(mana >= 113 && shield < 1) {
      options.push(step(mana - 113, hp, bhp, bdmg, hard, false, 5, poison - 1, recharge - 1, manaSpend + 113, prune));
    }
    if(mana >= 173 && poison < 1) {
      options.push(step(mana - 173, hp, bhp, bdmg, hard, false, shield - 1, 5, recharge - 1, manaSpend + 173, prune));
    }
    if(mana >= 229 && recharge < 1) {
      options.push(step(mana - 229, hp, bhp, bdmg, hard, false, shield - 1, poison - 1, 4, manaSpend + 229, prune));
    }
  } else {
    // boss' turn, simply do boss' attack
    let rdmg = bdmg - (shield >= 0 ? 7 : 0);
    if(rdmg < 1) rdmg = 1;
    options.push(step(mana, hp - rdmg, bhp, bdmg, hard, true, shield - 1, poison - 1, recharge - 1, manaSpend, prune));
  }
  return Math.min(...options);
}

const testData = false;

export function part1(data) {
  return step(testData ? 250 : 500, testData ? 10 : 50, ...data.split("\n").map(l => +l.split(" ").slice(-1)), false);
}

export function part2(data) {
  return step(testData ? 250 : 500, testData ? 10 : 50, ...data.split("\n").map(l => +l.split(" ").slice(-1)), true);
}
