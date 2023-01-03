
const tdata = `noop
addx 3
addx -5`;
// part1: 0, part2: 5 #'s, rest .'s

const tdata2 = `addx 15
addx -11
addx 6
addx -3
addx 5
addx -1
addx -8
addx 13
addx 4
noop
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx -35
addx 1
addx 24
addx -19
addx 1
addx 16
addx -11
noop
noop
addx 21
addx -15
noop
noop
addx -3
addx 9
addx 1
addx -3
addx 8
addx 1
addx 5
noop
noop
noop
noop
noop
addx -36
noop
addx 1
addx 7
noop
noop
noop
addx 2
addx 6
noop
noop
noop
noop
noop
addx 1
noop
noop
addx 7
addx 1
noop
addx -13
addx 13
addx 7
noop
addx 1
addx -33
noop
noop
noop
addx 2
noop
noop
noop
addx 8
noop
addx -1
addx 2
addx 1
noop
addx 17
addx -9
addx 1
addx 1
addx -3
addx 11
noop
noop
addx 1
noop
addx 1
noop
noop
addx -13
addx -19
addx 1
addx 3
addx 26
addx -30
addx 12
addx -1
addx 3
addx 1
noop
noop
noop
addx -9
addx 18
addx 1
addx 2
noop
noop
addx 9
noop
noop
noop
addx -1
addx 2
addx -37
addx 1
addx 3
noop
addx 15
addx -21
addx 22
addx -6
addx 1
noop
addx 2
addx 1
noop
addx -10
noop
noop
addx 20
addx 1
addx 2
addx 2
addx -6
addx -11
noop
noop
noop`;

class Emulator {
  constructor(data) {
    this.data = data;
    this.pc = 0;
    this.cycles = 0;
    this.x = 1;
    this.waitCycles = 0;
    this.opToExecute = null;
  }

  runCycle() {
    let atEnd = false;
    if(this.waitCycles > 0) {
      // wait cycles
    } else {
      // do last opcode
      if(this.opToExecute !== null) {
        switch(this.opToExecute.op) {
          case "noop": break;
          case "addx": this.x += this.opToExecute.val; break;
        }
      }
      // and read next one
      this.opToExecute = this.data[this.pc++];
      if(this.opToExecute === undefined) {
        this.opToExecute = {op: "noop"};
        atEnd = true;
      }
      this.waitCycles = this.opToExecute.op === "addx" ? 2 : 1;
    }
    this.waitCycles--;
    this.cycles++;
    return atEnd;
  }
}

class Ppu {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.output = [];
    for(let i = 0; i < 40 * 6; i++) {
      this.output.push(".");
    }
  }

  doCycle(spriteX) {
    if(this.y >= 6) return;
    if(Math.abs(this.x - spriteX) <= 1) {
      this.output[this.y * 40 + this.x] = "#";
    } else {
      this.output[this.y * 40 + this.x] = ".";
    }
    this.x++;
    if(this.x === 40) {
      this.x = 0;
      this.y++;
    }
  }
}

function runEmu(data) {
  let emu = new Emulator(data.split("\n").map(i => i.length > 4 ? ({op: i.slice(0, 4), val: +i.slice(5)}) : ({op: i})));
  let sum = 0;
  while(true) {
    let end = emu.runCycle();
    if((emu.cycles - 20) % 40 === 0) {
      sum += emu.cycles * emu.x;
    }
    if(end) break;
  }
  return sum;
}

function drawImage(data) {
  let emu = new Emulator(data.split("\n").map(i => i.length > 4 ? ({op: i.slice(0, 4), val: +i.slice(5)}) : ({op: i})));
  let ppu = new Ppu();
  while(true) {
    let end = emu.runCycle();
    ppu.doCycle(emu.x);
    if(end) break;
  }
  let out = "";
  for(let y = 0; y < 6; y++) {
    for(let x = 0; x < 40; x++) {
      out += ppu.output[y * 40 + x];
    }
    out += "\n";
  }
  return out.slice(0, -1);
}

export function part1(data) {
  return runEmu(data);
}

export function part2(data) {
  return drawImage(data);
}
