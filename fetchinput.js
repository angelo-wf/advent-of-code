
import fs from "node:fs";
import https from "node:https";

const session = fs.readFileSync("session.txt", "utf-8").trim();

function parseNum(val, min, max) {
  let v = +val;
  if(isNaN(v) || v < min || v > max || v != Math.floor(v)) {
    throw new Error("invalid number: " + val);
  }
  return v;
}

function waitSeconds(seconds) {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(), seconds * 1000);
  });
}

function fetchInput(year, day) {
  return new Promise((resolve, reject) => {
    let options = {
      headers: {
        "User-Agent": "github.com/elzo-d/advent-of-code (fetchinput.js / node)",
        "Cookie": `session=${session}`
      }
    };
    let path = `https://adventofcode.com/${year}/day/${day}/input`;
    console.log("Making request...");
    let req = https.request(path, options, (res) => {
      let result = "";
      res.on("data", d => result += d);
      res.on("error", e => reject(e));
      res.on("end", () => {
        resolve(result);
      });
    });
    req.on("error", e => reject(e));
    req.end();
  });
}

async function fetch(year, day) {
  let final = year !== null ? year : new Date().getFullYear() - 1;
  for(let i = 2015; i <= final; i++) {
    if(year === null || year === i) {
      for(let j = 1; j <= 25; j++) {
        if(day === null || day === j) {
          let result = await fetchInput(i, j);
          let filePath = `inputs/${i}_${j}.txt`;
          fs.writeFileSync(filePath, result, "utf-8");
          console.log("Written " + filePath);
          if(day === null) await waitSeconds(10);
        }
      }
    }
  }
}

function main(args) {
  if(args.length < 1) {
    fetch(null, null);
    return;
  } else {
    let day = null;
    let year = new Date().getFullYear();
    try {
      day = parseNum(args[0], 1, 25);
    } catch(e) {
      year = parseNum(args[0], 2015, year);
    }
    if(args.length >= 2) {
      if(day === null) day = parseNum(args[1], 1, 25);
      else year = parseNum(args[1], 2015, year);
    }
    fetch(year, day);
  }
}

main(process.argv.slice(2));
