const Hashids = require('../cjs/hashids').default;

const hash = new Hashids('dqy');

const result = hash.encode(300204)
console.log(hash.decode(result));

// const hash1 = new Hashids('dqy');
// const result1 = hash.encode(300204);

// console.log(result, result1);


// Fisher–Yates shuffle

// function shuffle(input) {
//     for (let i = input.length - 1; i > 0; i--) {
//         const k = Math.floor(Math.random() * (i + 1));
//         const element = input[k];
//         input[k] = input[i];
//         input[i] = element;
//     }

//     return input;
// }


// console.log(shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]))


/**
 * abcdefg 7 位
 * 
 * 11
 * 
 * 11 % 7 = 4 e
 * 1 % 7 = 1 b
 * 0 % 7 = 0 a
 * 
 * abe ===> 0 1 4 
 * 
 * 
 */