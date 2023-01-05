
const tdata = `inc b
jio b, +2
tpl b
inc b`;
// modified to use b; part 2: also 2

function parse(lines) {
  let out = [];
  for(let line of lines.split("\n")) {
    switch(line.slice(0, 3)) {
      case "hlf": out.push({op: "hlf", reg: line.slice(4)}); break;
      case "tpl": out.push({op: "tpl", reg: line.slice(4)}); break;
      case "inc": out.push({op: "inc", reg: line.slice(4)}); break;
      case "jmp": out.push({op: "jmp", off: +line.slice(4)}); break;
      case "jie": {
        let args = line.slice(4).split(", ");
        out.push({op: "jie", off: +args[1], reg: args[0]});
        break;
      }
      case "jio": {
        let args = line.slice(4).split(", ");
        out.push({op: "jio", off: +args[1], reg: args[0]});
        break;
      }
    }  
  }
  return out;
}

class Emulator {
  constructor(program) {
    this.program = program;
    this.pc = 0;
    this.regs = {a: 0, b: 0};
  }

  executeOpcode() {
    if(this.pc < 0 || this.pc >= this.program.length) return false;
    let opcode = this.program[this.pc++];
    switch(opcode.op) {
      case "hlf": this.regs[opcode.reg] /= 2; break;
      case "tpl": this.regs[opcode.reg] *= 3; break;
      case "inc": this.regs[opcode.reg]++; break;
      case "jmp": this.pc += opcode.off - 1; break;
      case "jie": if(this.regs[opcode.reg] % 2 === 0) this.pc += opcode.off - 1; break;
      case "jio": if(this.regs[opcode.reg] === 1) this.pc += opcode.off - 1; break;
    }
    return true;
  }

  run() {
    while(this.executeOpcode()) {}
  }
}

function emulate(data, aStart) {
  let emu = new Emulator(data);
  emu.regs.a = aStart;
  emu.run();
  return emu.regs.b;
}

export function part1(data) {
  return emulate(parse(data), 0);
}

export function part2(data) {
  return emulate(parse(data), 1);
}
