
const tdata = `abcdef`; // part 2: 6742839
const tdata2 = `pqrstuv`; // part 2: 5714438

const S = [
  7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22,
  5,  9, 14, 20, 5,  9, 14, 20, 5,  9, 14, 20, 5,  9, 14, 20,
  4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23,
  6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21
];

const K = new Uint32Array([
  0xd76aa478, 0xe8c7b756, 0x242070db, 0xc1bdceee, 0xf57c0faf, 0x4787c62a, 0xa8304613, 0xfd469501,
  0x698098d8, 0x8b44f7af, 0xffff5bb1, 0x895cd7be, 0x6b901122, 0xfd987193, 0xa679438e, 0x49b40821,
  0xf61e2562, 0xc040b340, 0x265e5a51, 0xe9b6c7aa, 0xd62f105d, 0x02441453, 0xd8a1e681, 0xe7d3fbc8,
  0x21e1cde6, 0xc33707d6, 0xf4d50d87, 0x455a14ed, 0xa9e3e905, 0xfcefa3f8, 0x676f02d9, 0x8d2a4c8a,
  0xfffa3942, 0x8771f681, 0x6d9d6122, 0xfde5380c, 0xa4beea44, 0x4bdecfa9, 0xf6bb4b60, 0xbebfbc70,
  0x289b7ec6, 0xeaa127fa, 0xd4ef3085, 0x04881d05, 0xd9d4d039, 0xe6db99e5, 0x1fa27cf8, 0xc4ac5665,
  0xf4292244, 0x432aff97, 0xab9423a7, 0xfc93a039, 0x655b59c3, 0x8f0ccc92, 0xffeff47d, 0x85845dd1,
  0x6fa87e4f, 0xfe2ce6e0, 0xa3014314, 0x4e0811a1, 0xf7537e82, 0xbd3af235, 0x2ad7d2bb, 0xeb86d391
]);

// gets md5 hash for a string, assumes string is no longer than 56 characters (only handles 1 512-bit block)
function md5(str) {
  let M = new Uint32Array(16);
  let i = 0;
  for(let char of str) {
    let val = char.codePointAt(0);
    M[i >> 2] |= val << ((i & 3) * 8);
    i++;
  }
  M[i >> 2] |= 0x80 << ((i & 3) * 8);
  M[14] = str.length * 8;
  let vals = new Uint32Array(9); // a0, b0, c0, d0, a, b, c, d, f
  vals[0] = vals[4] = 0x67452301;
  vals[1] = vals[5] = 0xefcdab89;
  vals[2] = vals[6] = 0x98badcfe;
  vals[3] = vals[7] = 0x10325476;
  let g = 0;
  for(let i = 0; i < 64; i++) {
    if(i < 16) {
      vals[8] = (vals[5] & vals[6]) | (~vals[5] & vals[7]);
      g = i;
    } else if(i < 32) {
      vals[8] = (vals[7] & vals[5]) | (~vals[7] & vals[6]);
      g = (5 * i + 1) % 16;
    } else if(i < 48) {
      vals[8] = vals[5] ^ vals[6] ^ vals[7];
      g = (3 * i + 5) % 16;
    } else {
      vals[8] = vals[6] ^ (vals[5] | ~vals[7]);
      g = (7 * i) % 16;
    }
    vals[8] += vals[4] + K[i] + M[g];
    vals[4] = vals[7];
    vals[7] = vals[6];
    vals[6] = vals[5];
    vals[5] += (vals[8] << S[i]) | (vals[8] >>> (32 - S[i]));
  }
  vals[0] += vals[4];
  vals[1] += vals[5];
  vals[2] += vals[6];
  vals[3] += vals[7];
  let out = "";
  for(let i = 0; i < 32; i += 2) {
    out += ((vals[(i + 1) >> 3] >>> (((i + 1) & 7) * 4)) & 0xf).toString(16);
    out += ((vals[i >> 3] >>> ((i & 7) * 4)) & 0xf).toString(16);
  }
  return out;
}

function findHash(data, start) {
  let i = 0;
  while(true) {
    if(md5(data + i).startsWith(start)) break;
    i++;
  }
  return i;
}

export function part1(data) {
  return findHash(data, "00000");
}

export function part2(data) {
  return findHash(data, "000000");
}
