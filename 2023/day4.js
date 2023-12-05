
const tdata = `Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11`;

function parseInput(input) {
  let out = [];
  for(let line of input.split("\n")) {
    let [cardP, winningP, numbersP] = line.split(/\:\s+|\s\|\s+/);
    let card = +cardP.slice("Card ".length);
    let winning = winningP.split(/\s+/).map(n => +n);
    let numbers = numbersP.split(/\s+/).map(n => +n);
    out.push([card, winning, numbers]);
  }
  return out;
}

function getPoints(card, count = false) {
  let score = 0;
  for(let num of card[2]) {
    if(card[1].includes(num)) {
      score = score === 0 ? 1 : (count ? score + 1 : score * 2);
    }
  }
  return score;
}

function checkCardCount(input) {
  let cards = input;
  let i = 0;
  while(i < cards.length) {
    let score = getPoints(cards[i], true);
    // add cards to end
    for(let j = 0; j < score; j++) cards.push(cards[cards[i][0] + j]);
    i++;
  }
  return cards.length;
}

export function part1(data) {
  return parseInput(data).map(i => getPoints(i)).reduce((a, s) => a + s);
}

export function part2(data) {
  return checkCardCount(parseInput(data));
}
