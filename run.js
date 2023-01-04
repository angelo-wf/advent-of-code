
import fs from "node:fs";

function parseNum(val, min, max) {
  let v = +val;
  if(isNaN(v) || v < min || v > max || v != Math.floor(v)) {
    throw new Error("invalid number: " + val);
  }
  return v;
}

function runPart(part, data, year, day, pn) {
  console.log(`${year} day ${day} part ${pn}:`);
  let start = process.hrtime.bigint();
  let val = part(data);
  let time = Number(process.hrtime.bigint() - start) / 1000000;
  console.log(`\x1b[38;5;51m${val}\x1b[0m`);
  console.log(`(took ${time} ms)\n`);
  return time;
}

async function run(year, day, part) {
  for(let i = 2015; i <= new Date().getFullYear(); i++) {
    if(year === undefined || i === year) {
      // run this year
      let yearTotal = 0;
      for(let j = 1; j <= 25; j++) {
        if(day === undefined || day === j) {
          // run this day
          try {
            const {part1, part2} = await import(`./${i}/day${j}.js`);
            let data = fs.readFileSync(`./inputs/${i}_${j}.txt`, "utf-8");
            if(data.slice(-1) === "\n") data = data.slice(0, -1);
            if(part === undefined || part === 1) yearTotal += runPart(part1, data, i, j, 1);
            if(part === undefined || part === 2) yearTotal += runPart(part2, data, i, j, 2);
          } catch(e) {
            if(day !== undefined || !e.message.startsWith("Cannot find module")) {
              console.log("Error thrown:");
              console.log(e);
            }
          }
        }
      }
      if(day === undefined) console.log(`(year ${i} took ${Math.round(yearTotal * 1000000) / 1000000} ms)\n`);
    }
  }
}

function main(args) {
  let year = undefined;
  let day = undefined;
  let part = undefined;
  if(args.length >= 1) year = parseNum(args[0], 2015, new Date().getFullYear());
  if(args.length >= 2) day = parseNum(args[1], 1, 25);
  if(args.length >= 3) part = parseNum(args[2], 1, 2);
  run(year, day, part);
}

main(process.argv.slice(2));
