
import fs from "node:fs";

const tdata = `$ cd /
$ ls
dir a
14848514 b.txt
8504156 c.dat
dir d
$ cd a
$ ls
dir e
29116 f
2557 g
62596 h.lst
$ cd e
$ ls
584 i
$ cd ..
$ cd ..
$ cd d
$ ls
4060174 j
8033020 d.log
5626152 d.ext
7214296 k`;

let data = fs.readFileSync("input.txt", "utf-8").slice(0, -1);

function parseFS(data) {
  let root = {
    files: [],
    dirs: [],
    name: "",
    parent: null
  };
  let cur = root;
  for(let line of data.split("\n")) {
    if(line[0] === "$") {
      // command
      let cmd = line.slice(2);
      if(cmd.slice(0, 2) === "cd") {
        let loc = cmd.slice(3);
        if(loc === "/") {
          cur = root;
        } else if(loc === "..") {
          cur = cur.parent;
        } else {
          let dir = {
            files: [],
            dirs: [],
            name: loc,
            parent: cur
          };
          cur.dirs.push(dir);
          cur = dir;
        }
      } else { // ls
        // ignore
      }
    } else {
      // output
      let parts = line.split(" ");
      if(parts[0] === "dir") {
        // ignore
      } else {
        let size = +parts[0];
        let name = parts[1];
        cur.files.push({name: name, size: size});
      }
    }
  }
  return root;
}

function getDirSize(dir) {
  let sum = 0;
  for(let file of dir.files) sum += file.size;
  for(let subdir of dir.dirs) sum += getDirSize(subdir);
  return sum;
}

function findSizesLess(dir, arr) {
  if(getDirSize(dir) < 100000) arr.push(getDirSize(dir));
  for(let subdir of dir.dirs) findSizesLess(subdir, arr);
  return arr;
}

function findSizes(dir, arr) {
  arr.push(getDirSize(dir));
  for(let subdir of dir.dirs) findSizes(subdir, arr);
  return arr;
}

function findToDelete(fs) {
  let needed = 30000000 - (70000000 - getDirSize(fs));
  let sizes = findSizes(fs, []);
  sizes.sort((a, b) => a - b);
  for(let size of sizes) {
    if(size >= needed) return size;
  }
}

console.log(findSizesLess(parseFS(data), []).reduce((a, s) => a + s, 0));

console.log(findToDelete(parseFS(data)));
