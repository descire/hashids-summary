# 剖析 hashids 实现原理（核心篇）

### 一、应用场景

&emsp;&emsp;以 YouTube 的视频详情页为例：

```JavaScript
    https://www.youtube.com/watch?v=8dUpL8SCO1w
```

&emsp;&emsp;每一个视频在数据库中都有一个唯一的主键，但是这里的 8dUpL8SCO1w 并不是主键。

```JavaScript
    https://www.youtube.com/watch?v=10002
```

&emsp;&emsp;如果在视频详情的 URL 上直接暴露主键，这种情况很容易猜测到其为数据库主键。

> 通常情况下数据库主键都是自增数字，其优点体现在：1、占用空间小，节省CPU开销。2、通常会在主键上建立索引，整形索引可以更多的载入内存，性能更优。

&emsp;&emsp;从而很轻松地爬取整站的视频，那么如何保护数据库主键，从而避免这样的问题呢？

### 二、hashids 的特点

&emsp;&emsp;hashids 这个名字，很容易让人联想到散列函数，但是散列函数只能加密，不能解密，无法满足上述场景。

&emsp;&emsp;而大家所熟知的加解密算法有如下几种：

- 对称加密：DES、3DES 等。
- 非对称加密：RSA、ECC 等。

&emsp;&emsp;但是上述场景其实对于安全级别的要求并没有那么高，采用对称加密或者非对称加密，就需要考虑随之而来的成本和效率问题。

&emsp;&emsp;另外，很容易被大家忽略的一个问题就是：加密之后的主键是要被放在 URL 中的，长度也是衡量的一个标准。

&emsp;&emsp;由此可以知道 hashids 库的基本特点如下：

- 具备一定安全性的加解密处理
- 生成无法预测的唯一短ID

### 三、生成短ID

&emsp;&emsp;hashids 只支持数字类型入参，主要原因在于其想明确本身的应用场景，不希望开发者因此将它作为加解密库来使用。

&emsp;&emsp;对于数字转化为更短字符串的方式就是：**进制转化**。

&emsp;&emsp;例如二进制 1010 转为十进制之后为 10，其长度就减少了 2 。

```JavaScript
export const toAlphabet = (
  input: NumberLike,
  alphabetChars: string[],
): string[] => {
  const id: string[] = []
  let value = input

  if (typeof value === 'bigint') {
    const alphabetLength = BigInt(alphabetChars.length)
    do {
      id.unshift([Number(value % alphabetLength)])
      value /= alphabetLength
    } while (value > BigInt(0))
  } else {
    do {
      // 默认十进制转化为六十二进制
      id.unshift(alphabetChars[value % alphabetChars.length])
      value = Math.floor(value / alphabetChars.length)
    } while (value > 0)
  }

  return id
}
```

&emsp;&emsp;hashids 通过上述方法将输入的值转为了六十二进制（alphabetChars 默认为 62 个字符），这样原数字的长度就会得到大大的缩减。

&emsp;&emsp;细心的同学会发现 alphabetChars 和最终输出的结果是一一映射的关系，所以 alphabetChars 必须是一个被加密过的数组。

### 四、改造版的 Fisher–Yates shuffle 算法

&emsp;&emsp;Fisher–Yates shuffle 是一个将有限集合生成一个随机序列的算法，不了解的同学可以先阅读这篇文章[Fisher–Yates shuffle 算法](https://mp.weixin.qq.com/s/Kse8-pyWG4BNEtQElJ5Hrg);

&emsp;&emsp;由于 Fisher–Yates shuffle 算法每一次随机选数，所以不能直接使用，这样会导致相同场景下加密出来的内容是不一样的。

```JavaScript
export function shuffle(
  alphabetChars: string[],
  saltChars: string[],
): string[] {
  if (saltChars.length === 0) {
    return alphabetChars
  }

  let integer: number
  const transformed = [...alphabetChars]

  for (let i = transformed.length - 1, v = 0, p = 0; i > 0; i--, v++) {
    // hashids 的选数机制
    v %= saltChars.length
    p += integer = saltChars[v].codePointAt(0)!
    const j = (integer + v + p) % i
    const a = transformed[i]
    const b = transformed[j]
    transformed[j] = a
    transformed[i] = b
  }

  return transformed
}
```

&emsp;&emsp;hashids 通过基于 salt 的选数设计，使得在相同场景下得到的“随机”映射序列是固定的，从而使得加密结果是相同的。

```JavaScript
private _encode(numbers: NumberLike[]): string[] {
  let { alphabet } = this

  const numbersIdInt = numbers.reduce<number>(
    (last, number, i) =>
      last +
      (typeof number === 'bigint'
        ? Number(number % BigInt(i + MODULO_PART))
        : number % (i + MODULO_PART)),
    0,
  )
  // 这个地方的赋值下一篇文章会揭晓
  let ret: string[] = [alphabet[numbersIdInt % alphabet.length]]
  const lottery = [...ret]

  numbers.forEach((number, i) => {
    const buffer = lottery.concat(this.salt, alphabet)
    alphabet = shuffle(alphabet, buffer)
    const last = toAlphabet(number, alphabet)
    ret.push(...last)
  })
  return ret
}
```

&emsp;&emsp;然后，通过对原数据的**进制转化**，也就是调用前文提到的 toAlphabet 方法，再通过查表，即可得到本次加密的内容。

&emsp;&emsp;同样，解密方法根据加密结果，逆向进制转化即可得到原文：

```JavaScript
// 为了方便理解，省略了部分非核心代码
private _decode(id: string): NumberLike[] {
  for (const subId of idArray) {
    // 得到加密时对应的映射表
    const buffer = [lotteryChar, ...this.salt, ...lastAlphabet]
    const nextAlphabet = shuffle(
      lastAlphabet,
      buffer.slice(0, lastAlphabet.length),
    )
    // 逆向进制转化
    result.push(fromAlphabet(Array.from(subId), nextAlphabet))
    lastAlphabet = nextAlphabet
  }

  return result
}

export const fromAlphabet = (
  inputChars: string[],
  alphabetChars: string[],
): NumberLike =>
  inputChars.reduce<NumberLike>((carry, item) => {
    const index = alphabetChars.indexOf(item)
    const value = carry * alphabetChars.length + index
    const isSafeValue = Number.isSafeInteger(value)
    if (isSafeValue) {
      return value
    }
  }, 0)
```

### 五、总结

&emsp;&emsp;上述内容主要介绍了 hashids 库实现的核心原理：

- **通过进制转化的方式将较长的正整型数字转为较短的字符。**
- **通过基于 salt 选数的设计来改造 Fisher–Yates shuffle 算法，从而获取到足够随机且具有一定安全性的加密内容。**

&emsp;&emsp;下一篇会为大家介绍 hashids 库的一些细节处理，敬请期待。最后，**如果本文对您有帮助，欢迎点赞、收藏、分享**。
