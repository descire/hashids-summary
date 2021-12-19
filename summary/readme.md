# 剖析 hashids 实现原理

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

> 通常情况下数据库主键都是自增数字，其优点体现在：1、占用空间小，节省CPU开销。2、通常会在主键上建立索引，整形索引可以更多的载入内存，从而提高性能。

&emsp;&emsp;从而很轻松地爬取整个站的视频，那么如何保护数据库主键，从而避免这样的问题呢？

### 二、hashids 的优势

&emsp;&emsp;hashids 这个名字，很容易让人联想到散列函数，但是上述场景是需要具备**可逆**属性的。

&emsp;&emsp;能够满足可逆属性的就是大家熟知的几种加解密方式：

- 对称加密：DES、3DES 等。
- 非对称加密：RSA、ECC 等。

&emsp;&emsp;但是上述场景其实对于安全级别的要求并没有那么高，采用对称加密或者非对称加密，就需要考虑随之而来的成本和效率问题。

&emsp;&emsp;另外，很容易被大家忽略的一个问题就是：加密之后的主键是要被放在 URL 中，长度也是衡量的一个标准。

- 具备一定安全性的加解密处理
- 生成无法预测的唯一短ID

### 三、生成短ID

&emsp;&emsp;hashids 是只支持数字类型入参数，主要原因在于其想明确本身的应用场景，不希望开发者因此将它作为加解密库来使用。

&emsp;&emsp;对于数字转化为更短字符串的方式就是：**进制转化**。

&emsp;&emsp;例如二进制 1010 转为十进制之后，其长度就减少了 2 。

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

&emsp;&emsp;hashids 通过该方法将输入的值转为了六十二进制（alphabetChars 默认为 62 个字符），这样原数字的长度会得到大大的缩减。

&emsp;&emsp;细心的同学会发现 alphabetChars 和最终输出的结果是一一映射的关系，那么 alphabetChars 必须是一个被加密过的数组。

### 四、改造版的 Fisher–Yates shuffle 算法



    其实现原理主要分为两部分：     

    1. 通过改良版的 Fisher–Yates shuffle 生成一个随机序列
    2. 以进制转化的方式作为随机序列的映射方式
    

### 四、参考资料

- https://meantobe.github.io/2019/12/11/hashids/