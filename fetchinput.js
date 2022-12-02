
import fs from "node:fs";
import https from "node:https";

const url = "https://adventofcode.com/2022/day/";

const session = fs.readFileSync("session.txt", "utf-8").trim();

function parseNum(val) {
  let v = +val;
  if(isNaN(v) || v <= 0 || v > 25 || v != Math.floor(v)) {
    throw new Error("invalid number: " + val);
  }
  return v;
}

function main(args) {
  if(args.length < 1) {
    console.log("No day given");
    return;
  } else {
    let day = parseNum(args[0]);
    let options = {
      headers: {
        "User-Agent": "github.com/elzo-d/aoc-22 (fetchinput.js / node)",
        "Cookie": `session=${session}`
      }
    };
    let path = url + day + "/input";
    console.log("Making request...");
    let req = https.request(path, options, (res) => {
      let result = "";
      res.on("data", d => result += d);
      res.on("error", e => {throw e;});
      res.on("end", () => {
        let filePath = `day${day}/input.txt`;
        fs.writeFileSync(filePath, result, "utf-8");
        console.log("Written " + filePath);
      });
    });
    req.on("error", e => {throw e;})
    req.end();
  }
}

main(process.argv.slice(2));
