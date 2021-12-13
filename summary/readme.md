# summary

### 应用场景

    以 YouTube 的视频详情页为例：

```JavaScript
    https://www.youtube.com/watch?v=8dUpL8SCO1w
```

    每一个视频在数据库中都有一个唯一的主键，但是这里的 8dUpL8SCO1w 并不是主键。

```JavaScript
    https://www.youtube.com/watch?v=10002
```

    如果在视频详情的 URL 上直接暴露主键，这种情况很容易猜测到其为数据库主键。

> 通常情况下数据库主键都是自增数字，其优点体现在：1、占用空间小，节省CPU开销。2、通常会在主键上建立索引，整形索引可以更多的载入内存，从而提高性能。

    从而很轻松地爬取整个站的视频，那么如何保护数据库主键，从而避免这样的问题呢？

### 解决思路

### 实现原理

### 参考资料

- https://gaohaoyang.github.io/2016/10/16/shuffle-algorithm/
- https://meantobe.github.io/2019/12/11/hashids/