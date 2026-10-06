# 策略事件字段规范（JS 层）

`ctx.subscribe(exchange, symbol, opts)` 返回 stream id；事件由
`ctx.poll(streams, timeoutMs)` 在调用它的 JS 主线程返回，按 `ev.kind` 分发由策略自己写。
Rust SDK 采用相同的 subscribe + poll 契约，并允许不同线程分别消费不同 stream。
权威定义：Rust 侧 [abi/src/event.rs](../../extension-api/abi/src/event.rs)
（常量）+ [host/src/trade.rs](../../runner/crates/host/src/trade.rs) `event_json`（编组）——本文是
策略作者视角的速查，两边如有出入以代码为准。

## 公共字段（所有事件都有）

| 字段 | 类型 | 说明 |
|---|---|---|
| `kind` | number | 事件类型：1=ticker 3=depth 4=trade 5=kline 16=订单回报 32=定时器 33=网关状态 35=行情初始化状态 |
| `ex` | number | 账户在本次装载序列里的下标（`exchanges[i]` 的 i；无归属事件为 -1）。可**原样回传** `ctx.order/book/raw` 的第一参数；label 取 `ctx.connectors()[ev.ex].label` |
| `symbol` | string | 统一格式 `BASE_QUOTE[.contract]`（`BTC_USDT` 现货 / `.swap` 永续 / `.quarter` 季度） |
| `seq` | number | 引擎全序号（同一实例内单调递增） |
| `ts` | number | connector 收到原始报文的时刻；引擎自产事件为发布时间（UNIX 毫秒，带微秒小数；回测=虚拟钟）。`Date.now() - ev.ts` = 引擎+poll 延迟。交易所事件的时间不含交易所→本机网络延迟 |

## ticker（kind=1，channel: "ticker" / "bbo"）

`bid` `ask` `last` `bidQty` `askQty` `volume` `openInterest` —— 全部实数（已按合约精度
换算）。`time` 是交易所时间（毫秒；连接器未提供时回落到 `ts`）；`open` `high` `low`
由 ticker 自身携带的交易日字段提供，协议没有时回落到 `last`。bbo 类频道无最新价时 `last` 为 0。

## trade（kind=4，channel: "trade"）

| 字段 | 类型 | 说明 |
|---|---|---|
| `px` `qty` | number | 成交价/量（实数） |
| `side` | string | **taker 方向**：`"buy"` / `"sell"`；交易所未提供时 `""` |
| `tradeId` | number \| string | 交易所成交序号；超过 JS 安全整数范围时为字符串 |
| `time` | number | 交易所成交时间（毫秒）；连接器未提供时回落到 `ts` |

## kline（kind=5，channel: "kline"，opts.interval 单位秒）

`open` `high` `low` `close` `volume` `openInterest` `intervalSec` `openTimeMs` `closed`
`prefill`。`closed=true` 表示该根已收盘（未收盘的中间态会反复推送）；`prefill=true`
表示首次订阅的历史初始化数据。

Kline 的原生订阅、合成、历史 prefill 和断线续接都由 connector 负责。需要 prefill 的 connector
先确认实时订阅生效并暂存期间形成的全部 bar，再按时间发布历史和当前 bar，最后发布同一
stream 的 kind=35 状态；随后只推普通实时 Kline。

## 行情初始化状态（kind=35，与目标行情订阅共用 stream）

`channel`、`intervalSec` 标识目标订阅；`prefillStatus`：1=READY、2=FAILED。FAILED 时
`message` 是 connector 返回的真实原因，`detail` 是可选协议码。策略不能在收到 FAILED 前把
少量实时 bar 当作完整历史。

## depth（kind=3，channel: "depth"，opts.depth 档数）

事件本身只是"订单簿已更新"的信号，**不带档位**；档位读组装视图：
`ctx.book(ev.ex, ev.symbol, n)` → `{bids: [[价,量],…], asks: [[价,量],…]}`
（bids 降序 / asks 升序）。`bid/ask` 只用于**订单簿侧**命名，成交方向一律 `buy/sell`。

## 订单回报（kind=16，channel: "orders"）

| 字段 | 类型 | 说明 |
|---|---|---|
| `id` | string | 订单号（`ctx.order` 的返回值；空串 = 连接器没给号） |
| `state` | string | `"acked"` `"partial"` `"filled"` `"canceled"` `"rejected"` |
| `px` `qty` `filledQty` `avgPx` | number | 委托价/量、累计成交量、成交均价（实数） |
| `reason` | number | ABI 统一拒单原因码；`reasonText` 是该统一码对应的、与 connector 无关的说明 |

## 网关状态（kind=33，内建 STREAM_STATUS）

`status`：1=UP 2=DOWN 3=DEGRADED；`detail`：适配器自定义码。

## 引擎定时器（kind=32，内建 STREAM_TIMER）

`timerId` 是定时器 id，`scheduledNs` 是计划触发的引擎时钟纳秒值；超过 JS 安全整数范围时
以字符串返回。QuickJS 的 `setTimeout` 属于语言运行时回调，不会伪装成 kind=32 业务事件。

## 投递模式（慢消费者语义，subscribe opts 指定）

事件由 connector 线程产生、引擎缓存、策略显式 poll 消费（JS 单线程；Rust 可以多个线程
各 poll 各的流）。消费慢时按**每订阅**的模式处理：

| 模式 | opts | 语义 | 缺省适用 |
|---|---|---|---|
| Latest | `{mode:"latest"}` | 只留最新，旧的覆盖**作废**（计入 dropped） | ticker/bbo、depth |
| Ring | `{buffer:N}` | 有界数组，按序补投，溢出丢最旧（计入 dropped） | trade、kline（默认 N=1024） |

- 取走即清：每次 poll 拿到的必然是上次之后的新数据；
- **深度特殊**：订单簿在引擎入口持续 apply——策略消费多慢，`ctx.book()` 都是**恒常新**
  的完整簿；Latest 丢的只是"簿已更新"信号本身，不丢深度增量；
- 回报进入 Engine 后走不设上界、绝不静默丢弃的无损队列；来源环满时会向 connector
  传导背压，因此策略仍须持续 poll；
- 丢弃累计随资源监控上报（load.evdrop）——涨得快 = 策略消费不动，先查事件处理耗时。

`subscribe` 立即返回 stream id 并登记订阅意图；引擎首次 poll 时才向 connector 下发订阅，
connector 线程随后建连/重放；连接状态变化通过网关状态事件回报。

单线程 JS 推荐 `ctx.poll([], timeoutMs)` 拉取全部事件。需要过滤时，参数可传单个 stream id
或数组；应由某个消费点带上 `ctx.STREAM_REST`，接住没有被其它过滤器点名的流，避免无损
订单/状态/定时器事件持续积压。等待期间 `ctx.poll` 仍推进 Promise、`setTimeout` 和 WS/TCP；
timeoutMs=0 只是不等待业务事件，调用时仍会泵一轮这些语言运行时任务。

```javascript
ctx.subscribe(0, "BTC_USDT", {channel: "ticker"});
ctx.subscribe(0, "", {channel: "orders"});
while (true) {
    const ev = ctx.poll([], 1000);
    if (!ev) continue;
    if (ev.kind === 1) onTick(ev);
    else if (ev.kind === 16) onOrder(ev); // onOrder 是用户函数，不是宿主 API
}
```

## REST 查询面

事件流之外的第二接口面：`ctx.rest(ex, method, args)` —— **同步**打交易所传统 REST 端点，
不依赖订阅，可查询任意 symbol。

```javascript
var t = ctx.rest(0, "ticker", { symbol: "BTC_USDT" });     // {time,last,bid,ask,high,low,volume}
var d = ctx.rest(0, "depth",  { symbol: "BTC_USDT", limit: 20 });
var k = ctx.rest(0, "klines", { symbol: "BTC_USDT", interval: 3600, limit: 100 });
var a = ctx.rest(0, "assets");
```

标准方法名由 [`abi::REST_METHODS`](../../extension-api/abi/src/rest.rs) 唯一登记，完整参数、
返回形状、错误与版本规则见 [Extension ABI](../../extension-api/abi/README.md)。交易所特有端点
仍走 `ctx.raw`，不能自行增加 `rest.*` 方法。

- **限频**：每交易所令牌桶，默认 20 次/秒，超限**阻塞等待**；
  `REST_RATE_<LABEL>` / `REST_RATE` 环境变量可调。
- **与事件流的取舍**：要低延迟、要连续行情 → 用 `ctx.subscribe`（推送、纳秒级读缓存）；
  要一次性查询或查询未订阅的品种 → 用 `ctx.rest`。
- connector 未实现的方法会报错并带方法名（`rest.<名>`）。

## 约定

- **数值一律实数**：定点换算（px_scale/qty_scale）在引擎内完成，策略层不见定点数。
- **不暴露内部句柄**：引擎的 instrument id 等进程内实现细节不进事件（跨重启不稳定）。
- 枚举字段的字符串化只做在**语义层**（side/state）；协议码（reason/status/kind）保留数字。
