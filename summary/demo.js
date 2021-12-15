const Hashids = require('../cjs/hashids').default;

const hash = new Hashids('daiqingyun', 10);

console.log(hash.encode(300204))