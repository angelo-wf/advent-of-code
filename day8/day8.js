
import fs from "node:fs";

const tdata = `30373
25512
65332
33549
35390`;

const data = fs.readFileSync("input.txt", "utf-8").slice(0, -1);

function checkTree(arr, row, col) {
  let count = 0;
  // check for all trees from edge to this tree if it is lower
  for(let x = 0; x < col; x++) count += arr[row][x] < arr[row][col];
  // if lower-count is equal to amount of trees from edge, is it visible
  if(count >= col) return true;
  // check for other 3 directions as well
  count = 0;
  for(let x = arr[0].length - 1; x > col; x--) count += arr[row][x] < arr[row][col];
  if(count >= arr[0].length - col - 1) return true;
  count = 0;
  for(let y = 0; y < row; y++) count += arr[y][col] < arr[row][col];
  if(count >= row) return true;
  count = 0;
  for(let y = arr.length - 1; y > row; y--) count += arr[y][col] < arr[row][col];
  if(count >= arr.length - row - 1) return true;
  return false;
}

function checkVisible(grid) {
  let total = 0;
  for(let i = 0; i < grid.length; i++) {
    for(let j = 0; j < grid[0].length; j++) {
      if(checkTree(grid, i, j)) total++;
    }
  }
  return total;
}

function getScenicScore(arr, row, col) {
  let count = 0;
  for(let x = col - 1; x >= 0; x--) {count++; if(arr[row][x] >= arr[row][col]) break;}
  let prod = count; count = 0;
  for(let x = col + 1; x < arr[0].length; x++) {count++; if(arr[row][x] >= arr[row][col]) break;}
  prod *= count; count = 0;
  for(let y = row - 1; y >= 0; y--) {count++; if(arr[y][col] >= arr[row][col]) break;}
  prod *= count; count = 0;
  for(let y = row + 1; y < arr.length; y++) {count++; if(arr[y][col] >= arr[row][col]) break;}
  return prod * count;
}

function checkBestScenic(grid) {
  let highest = 0;
  for(let i = 0; i < grid.length; i++) {
    for(let j = 0; j < grid[0].length; j++) {
      if(getScenicScore(grid, i, j) > highest) {
        highest = getScenicScore(grid, i, j);
      }
    }
  }
  return highest;
}

console.log(checkVisible(data.split("\n").map(i => i.split("").map(x => +x))));

console.log(checkBestScenic(data.split("\n").map(i => i.split("").map(x => +x))));
