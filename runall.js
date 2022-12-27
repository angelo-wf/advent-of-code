
import {execSync} from "node:child_process";

process.chdir("day1");
for(let i = 1; i <= 25; i++) {
  console.log("Day " + i);
  console.time("Day " + i);
  process.chdir("../day" + i);
  console.log(execSync(`node day${i}.js`).toString("utf-8").slice(0, -1));
  console.timeEnd("Day " + i);
  console.log("");
}
