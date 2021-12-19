# Fisher–Yates shuffle 算法

### 前言

&emsp;&emsp;Fisher–Yates shuffle 是一个将有限集合生成一个随机序列的算法，并且具备等概率和高效率的特点。

### 算法过程

&emsp;&emsp;Fisher–Yates shuffle 算法生成随机序列的过程如下：

1. 得到一个 [1, ..., N] 的数组。
2. 从当前区间中随机获得一个数字 K。
3. 从低位开始，得到第 K 个数字，把它放到新数组（ans）的最后一位。
4. 重复第二步，直到所有的数字都被取出。

&emsp;&emsp;如果第二步是真随机，那么新数组（ans）就是原数组的一个随机序列。

> JavaScript 中的 Math.random 方法并不是真随机，因为其随机数种子是固定的。

### 等概率

&emsp;&emsp;以数组 [a, b, c] 为例：

- 第一次取出 a 的概率为： 1/3。
- 第二次取出 a 的概率为：2/3（取出b和c的概率） * 1/2 = 1/3。
- 第三次取出 a 的概率为：2/3（取出b和c的概率） * 1/2（取出b或者c的概率） * 1 = 1/3。

&emsp;&emsp;以此类推，取出 a、b、c 的概率是相等的。

### 高效率

&emsp;&emsp;通过算法过程描述，可以得到如下实现：

```JavaScript
function shuffle(input) {
    for (let i = input.length - 1; i > 0; i--) {
        const k = Math.floor(Math.random() * (i + 1));
        const element = input[k];
        input[k] = input[i];
        input[i] = element;
    }

    return input;
}
```

&emsp;&emsp;通过上述实现不难发现，其时间复杂度为 O(n)，空间复杂度为 O(1)。