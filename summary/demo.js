const Hashids = require('../cjs/hashids').default;

const hash = new Hashids('dqy');

const s1 = hash.encode(300204, 200306);
const s2 = hash.encode(300204200306)

console.log(s1);
console.log(s2);


// Fisher–Yates shuffle

function shuffle(input) {
    for (let i = input.length - 1; i > 0; i--) {
        const k = Math.floor(Math.random() * (i + 1));
        const element = input[k];
        input[k] = input[i];
        input[i] = element;
    }

    return input;
}


console.log(shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]))