# aoc-22
Advent of Code 2022

My solutions to [Advent of Code 2022](https://adventofcode.com/) in Javascript, run with Node.js.

Each day has its own folder, the script within with the same name will print both answers.
The input is expected to be found in `input.txt` (in that day's folder).

The `fetchinput.js` script can be used to fetch the input for a given day and store it in its folder (run with `node fetchinput.js <day>`).
It requires a file named `session.txt` to be created containing (just) the session-token `<token>` from adventofcode.com, which is stored there in a cookie as `session=<token>`.

## Special cases

- Day 16 has a version called `day16sw.js` which also prints a list of the steps taken for those 2 problems (was used for debugging).
- Day 22 contains a image showing the connections needed for part 2 (was used to help set those up properly).
