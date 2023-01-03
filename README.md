# Advent of Code

My solutions to [Advent of Code](https://adventofcode.com/) in Javascript, run with Node.js.

Each year has its own folder, each day has its own file within that folder called `day<day>.js`.
- Each day exports 2 functions named `part1` and `part2`, which run those parts.
- The functions take the input as a string and give the ouput as something `toString()`-able.
- Additional files for a day are prefixed with `day<day>_`.

The `run.js` script can be used to run a part/both parts of a day/all days of a year/all years.
- Run as `node run.js [<year> [<day> [<part>]]]`.
- If no arguments are given, all solutions for each year will be run.
- If a year is given, all solutions for that year will be run.
- If a year and day is given, both parts for that day will be run.
- If a year, day and part (1 or 2) is given, only that part will be run.
- The needed input(s) need to be fetched beforehand, placed in the `inputs` folder, named `<year>_<day>.txt`.
- It will print the solution(s) and the time in milliseconds each solution took.
- If a whole year is run, the total time for that year will also be printed.

The `fetchinput.js` script can be used to fetch the input(s) for all days/a given day of a given year and store it in the `inputs` folder.
- Run as `node fetchinput.js [<day|year> [<year|day>]]`.
- If no arguments are given, it will fetch all days for all years up to (but not including) the current year.
- If only a day is given, it will fetch the day for the current year.
- If only a year is given, it will fetch all days for that year.
- If both are given, that day for that year will be fetched (can be given in either order).
- It requires a file named `session.txt` to be created containing (just) the session-token from adventofcode.com, which is stored there in a cookie called `session`.
- Calls are throttled (once every 10 seconds), and the User-Agent indicates this repo as the source, as required by the [Automation guidelines](https://reddit.com/r/adventofcode/wiki/faqs/automation).
