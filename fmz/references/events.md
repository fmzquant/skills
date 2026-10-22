# 策略事件字段规范（JS 层；Python / Rust 同一契约）

`ctx.subscribe(exchange, opts)` 返回**订阅对象**；事件由 `ctx.poll(streams, timeoutMs)` 交出，按
`ev.kind` / `ev.channel` 分发由策略自己写。**订阅属于调用 `ctx.subscribe` 的那个线程**（JS / Python 的主线程或
`threading.Thread` 线程；Rust 的任意线程）：它的事件只投给这个线程，`ctx.poll` 只取本线程自己订阅
的事件（见「线程与订阅归属」）。Rust SDK 采用相同的 subscribe + poll 契约（`ctx::subscribe(ex, SubOpts) -> Sub`），
Python 见「Python」。
权威定义：Rust 侧 [abi/src/event.rs](../../extension-api/abi/src/event.rs)
（常量）+ [host/src/trade.rs](../../runner/crates/host/src/trade.rs) `event_json`（编组）+
[compat/src/ctx_api.js](../../runner/crates/compat/src/ctx_api.js)（JS 外形）——本文是策略作者视角的
速查，几处如有出入以代码为准。

**推送与 REST 是两套独立的系统**：订阅只影响 `ctx.poll` 收到的事件；`ctx.rest`、`exchange.GetTicker`/
`GetDepth`/`GetTrades`/`GetRecords` 等查询每次都打交易所 REST，不读推送缓存，订阅与否、订了什么
都不改变它们的结果。

## 订阅

```javascript
var tk  = ctx.subscribe(exchange, {channel: "ticker"});                    // 交易所对象：symbol 取它当前的交易对
var d20 = ctx.subscribe(0, {channel: "depth", symbol: "BTC_USDT", depth: 20});
var k1m = ctx.subscribe(exchanges[1], {channel: "kline", symbol: "ETH_USDT.swap", interval: 60});
var acct = ctx.subscribe(0, {channel: "private"});                         // 私有流：订单 + 持仓 + 余额一路，整个账户
var all = ctx.subscribe(0, {channel: "tickers"});                          // 全市场 ticker：一路收该交易所全部合约
var pair = ctx.subscribe(0, {channel: "trade", symbol: ["BTC_USDT", "ETH_USDT"]}); // 批量：订阅对象数组
```

- **只有两参形式** `ctx.subscribe(ex, opts)`；`opts = {channel, symbol, depth, interval, mode, buffer}`，
  第二参不是对象、多传参数、未知键（如拼错的 `intervel`）、未知频道、行情频道缺 symbol、私有频道或
  `tickers` 给了 symbol 都抛异常。`channel` 缺省 `"ticker"`；频道：`ticker` `bbo` `tickers` `depth`
  `trade` `kline` `private`。
- **批量订阅**：`opts.symbol` 可以是数组 → 返回与它**同序**的订阅对象**数组**（只有一个元素也是数组；
  字符串仍返回单个对象）。**整批先校验**：任何一个 symbol 或选项不合法就整批抛异常、一个也不订。之后每个
  元素都是独立的一路订阅（自己的 `id`、簿、引用计数），连接器异步拒绝其中一个只让那一路的流上来 FAILED。
  数组带一个不可枚举的 `unsubscribe()`，一次退订全部元素；`ctx.poll` 直接收这个数组（可嵌套）。
- **全市场 `tickers`**：不带 symbol，一路订阅收该交易所全部合约的 ticker——事件就是普通 ticker 事件
  （kind=1，`channel: "tickers"`），`symbol` 逐条是各自的合约。只有交易所有原生全市场流时才支持（如
  币安现货/合约）；没有的交易所在该流上报 FAILED（`unsupported channel: tickers …`），不会退化成逐个
  合约订阅。缺省 Latest 模式**按合约**各留最新一条：消费慢也拿得到每个合约的最新 ticker。
- 第一参（`ctx.subscribe/order/cancel/rest/restGo/raw` 同一规则）：账户下标（数字或数字串，
  = `exchanges[i]` 的 i）或交易所对象（`exchange`、`exchanges[i]`，取其 `GetIndex()`）。
- 第一参是交易所对象、行情频道又没给 `symbol` 时，用该对象**订阅这一刻**的交易对（含合约类型，
  如 `BTC_USDT.swap`）；之后 `SetCurrency/SetContractType` 不改已有订阅。下标形式不补 symbol；
  私有频道与 `tickers` 永远不补（整个账户 / 整个市场）。
- 返回的订阅对象：`{id, ex, channel, symbol, depth, interval}`（只读、可 `JSON.stringify`）加这些方法：
  - `sub.book(n)`：**这一路**深度订阅自己的订单簿前 n 档 `{bids: [[价,量],…], asks: […]}`
    （bids 降序 / asks 升序；n 缺省为订阅档数）；还没收到完整快照时两边为空数组；
    不是深度订阅、已退订都抛异常。
  - `sub.positions()` / `sub.balances()`：**私有订阅**看到的最新持仓 / 余额全量状态（行的形状见下文
    「私有流」）；账户快照还没 READY（或最近一轮快照 FAILED）时为 `null`——状态不可知，不是"没有"；
    现货没有持仓，READY 后 `positions()` 是 `[]`。不是私有订阅、已退订都抛异常。
  - `sub.unsubscribe()`：退订；同一个对象重复调用是空操作。**只有订阅它的线程能退订**：stream id 全运行
    唯一，别的线程拿着同一个订阅对象/数字去退会抛异常（`… belongs to another thread …`），订阅保持有效。
- 订阅身份 = `(ex, symbol, channel, depth, interval)`。**同一线程里**身份相同的订阅共用一条流（`id`
  相同），引擎按**引用计数**管理：每次 `subscribe` 加一个引用，每个订阅对象的 `unsubscribe()` 退一个，
  最后一个退掉才真正向交易所退订——一处退订不会掐断别处还在用的同一路行情。任何一维不同就是另一路
  订阅、另一条流：同合约的 ticker 与 bbo 各一路，depth 5 与 depth 20 各一路（交易所不同档位推送频率
  不同，引擎**不合并成最大档**，每路一本簿）。不同线程订同一身份见「线程与订阅归属」。
- stream id 在一次运行内单调递增、不复用（全部退订后再订是新 id）。
- 订阅被交易所/连接器拒绝（如不支持的 K 线周期）时，**该订阅自己的流**上来一条 kind=35、
  `prefillStatus=2`（FAILED）的状态事件，`message` 是真实原因；`ctx.poll([sub])` 收得到。之后这条流
  作废，`unsubscribe()` 是空操作。

`subscribe` 立即返回并登记订阅意图；引擎首次 poll 时才向 connector 下发订阅，connector 线程随后
建连/重放；连接状态变化通过网关状态事件回报。

Rust SDK 对应：`ctx::subscribe(ex, SubOpts::depth(20).symbol("BTC_USDT")) -> Result<Sub, String>`
（`ex` 是 `u16` 下标或 `exchange`/`exchanges[i]`；`SubOpts` 另有 `.latest()` / `.buffer(n)`，私有流是
`SubOpts::private()`，全市场是 `SubOpts::tickers()`）；批量是
`ctx::subscribe_many(ex, SubOpts::trade(), &["BTC_USDT", "ETH_USDT"]) -> Result<Vec<Sub>, String>`（同样整批
先校验）；`Sub` 是 `Copy` 句柄：`id()`（交给 `ctx::poll(&[sub.id()], …)`）、
`book(n) -> Result<Book, String>`（`Book { bids: Vec<(f64, f64)>, asks: Vec<(f64, f64)> }`）、
`positions() -> Result<Option<Vec<PositionRow>>, String>` / `balances() -> Result<Option<Vec<BalanceRow>>, String>`
（`None` = 快照还没 READY）、`unsubscribe()`——`Sub` 可复制，引用计数按 **`subscribe` 调用次数**算，
每次 `subscribe` 对应一次 `unsubscribe`。原始 `Event` 经 `EventExt` 安全读取（策略不写 `unsafe`）：
`stream()` / `channel()` / `book(n)`（深度事件）/ `trade_id()`，以及按 kind 的实数视图——`ticker()`
（kind 1）、`trade()`（4）、`kline()`（5）、`order()`（16）、`position()` / `balance()`（17/18）、`gateway()`
（33）、`feed_status()`（35：`status`/`channel`/`interval`/`message`/`stream`，`ready()` / `failed()`），
kind 不符为 `None`，字段与本文各节的 JS 字段一一对应（Rust 命名）。

## 线程与订阅归属

**谁订阅、谁取。** 一路订阅属于调用 `ctx.subscribe` 的线程：JS 主线程、`threading.Thread` 起的
worker（worker 里同样有 `ctx.subscribe`、订阅对象的全部方法和 `ctx.poll`），Rust 策略的任意线程。

- `ctx.poll([])` 只回**本线程**订阅的事件；过滤器里写别的线程的订阅/流 id 永远取不到东西。要几个
  线程各收各的，就让每个线程自己订阅它要的那几路。
- 不同线程订阅**同一身份**：共用一路上游（交易所只订一次；订单簿、K 线缓存、账户状态都是同一份），
  但每个线程拿到**自己的**流 id、自己的一份事件、自己的投递模式（Latest/Ring）——一个线程消费慢不
  影响另一个。引用计数跨线程：所有线程都退订了，才真正向交易所退订。同一线程里重复订阅仍是同一条流。
- 后来的线程订阅一路**已经在跑**的 K 线：先补收已缓存的 bar（prefill 的带 `prefill: true`）和最近一条
  初始化状态（kind=35），不用等 connector 再拉一次历史；私有流同理：账户快照已 READY 时补收全部快照
  行（`snapshot: true`）与 READY，`sub.positions()` / `sub.balances()` 立即可读。其它频道从下一条起收。
- 网关状态（kind=33）广播给**在该交易所有订阅**的每个线程；定时器（kind=32）归主线程。
- 线程结束时它的订阅自动全部退掉（别的线程共用的同一路不受影响）。退订只能在订阅它的线程里做。
- 没有任何订阅的事件（例如没订私有流时，下单兜底连上的私有连接推来的订单回报）不投给任何线程，
  只进入宿主缓存（`exchange.IO("wait")` 这类旧接口照样读得到）。曾经的兜底流 `STREAM_REST` 已退役：
  本线程的全部事件就是 `ctx.poll([])`。

旧 `EventLoop` 胶水只为纯推送连接器（CTP 这类柜台）自动订阅 ticker 与私有流，订阅属于首次调用
`EventLoop` 的主线程（Python 的 EventLoop 是进程级一条队列，这些订阅挂在它自己的属主名下，见「Python」）。
切交易对时的改订也只由属主做：JS worker 与 Rust 其它线程的交易所对象/当前交易对是各自的，在那里
`SetCurrency` 不动这些订阅（Python 的交易所对象进程共享，任一线程切换都由 EventLoop 的属主改订）。

## Python

`fmz.py` 的全局 `ctx` 与 JS 同一语义（引用计数、簿、账户状态、按线程投递都在引擎，同一份实现）：

```python
tk = ctx.subscribe(exchange, {"channel": "ticker"})                     # 交易所对象：symbol 取它此刻的交易对
d20 = ctx.subscribe(0, {"channel": "depth", "symbol": "BTC_USDT", "depth": 20})
acct = ctx.subscribe(exchange, {"channel": "private"})
pair = ctx.subscribe(0, {"channel": "trade", "symbol": ["BTC_USDT", "ETH_USDT"]})  # SubscriptionList
while True:
    ev = ctx.poll([], 1000)                    # 本线程订阅的全部；None = 超时
    if ev is None:
        continue
    if ev["type"] == "status":                 # 网关状态 / 初始化状态（先判，channel 会与数据事件重名）
        if ev["kind"] == 35 and ev["prefillStatus"] == 2:
            raise Exception(ev["message"])
        continue
    if ev["channel"] == "depth":
        on_book(ev.book(5))                    # on_book 等是用户函数
    elif ev["channel"] == "orders":
        on_order(ev)
    elif ev["channel"] in ("positions", "balance"):
        on_account(acct.positions(), acct.balances())
```

- `ctx.subscribe(ex, opts)`：**只收两个位置参数**（多传/少传/关键字参数 → `TypeError`），`opts` 是 dict，
  键与校验同 JS（未知键、未知频道、行情频道缺 symbol、`private`/`tickers` 给了 symbol 都抛异常）。`ex` 是账户
  下标（int 或数字串）或交易所对象（`exchange`、`exchanges[i]`；取下标，行情频道没给 symbol 时取它此刻的
  `symbol`，之后 `SetCurrency` 不跟随；`private`/`tickers` 不补）。`opts["symbol"]` 是列表（或元组）→
  `SubscriptionList`（`list` 子类，同序；整批先校验；`.unsubscribe()` 退订全部元素）。传入的 `opts` 不被修改。
- 订阅对象 `Subscription`：只读属性 `id ex channel symbol depth interval`，`info()` 给同字段的 dict；方法
  `book(n=None)`（深度订阅自己的簿，`{"bids": [[价, 量], …], "asks": […]}`，n 缺省为订阅档数）、
  `positions()` / `balances()`（私有订阅；快照 READY 之前为 `None`）、`unsubscribe()`（幂等；只能在订阅它的
  线程里调，别的线程调用抛异常）。不是对应频道、已退订（本对象）都抛异常。
- `ctx.poll(streams=None, timeout_ms=None)`：`streams` 为 `None`/`[]` = 本线程的全部；否则是订阅对象、流 id、
  `SubscriptionList` 或它们的（嵌套）列表。`timeout_ms`：`None` 一直等、`0` 不等、`>0` 毫秒；超时回 `None`。
  事件是 `CtxEvent`（`dict` 子类，字段同 JS 事件 JSON；`ev["kind"]` 与 `ev.kind` 都能用），深度事件
  （kind 3）的 `ev.book(n=None)` 读该事件所属订阅的簿。实盘停止后（含 `onexit` 期）抛 `StopError`，正在等的
  也立即抛（同 JS 的 interrupted；其余 `ctx` 调用照常）。JS 的选项形式
  `ctx.poll({streams, sources}, …)` 是 **JS 专有**（Python 传 dict 抛 `TypeError`）：Python 的线程消息、
  `exchange.Go` 完成通知由 `EventLoop` 与各自的句柄交付，`ctx.poll` 只取引擎事件。
- 另有 `ctx.connectors()`（同 JS：`[{ex, label, name, symbol, interval, orderIdScope, feed}, …]`）与
  `ctx.STREAM_STATUS` / `ctx.STREAM_TIMER`。`ctx.order/cancel/rest/raw` 等 JS 面不在 Python 的 `ctx` 上
  （交易与查询走 `exchange.*`）。
- **线程**：主线程（以及替它跑 `onexit` 的线程）的订阅属于主线程；`threading.Thread` 起的线程各是一个
  属主（`fmz.py` 从 1 起单调发号、不复用），在线程里 `ctx.subscribe` / `ctx.poll` 就是这个线程自己的；
  线程体结束（正常返回或抛异常）时它的订阅一次退干净。`_thread.start_new_thread` 这类绕过
  `threading.Thread` 的裸线程也能用 `ctx`，但结束时不会自动退订（自己 `unsubscribe()`）。
- **与旧 `EventLoop` 并存**：两者互不争抢。`EventLoop` 只收它自己的事件——纯推送柜台（CTP 这类）首次调用
  时自动订的 ticker 与订单回报，以及 `exchange.Go` / `HttpQuery_Go` 的完成通知；`ctx.subscribe` 的事件只在
  `ctx.poll` 里出现。曾经未写入文档的 `exchange.Subscribe(symbol, opts)` 已删除（用 `ctx.subscribe`）。
- 投递路径：`ctx.poll` 是一次请求；runner 那边取不到又要等时把它挂起，事件一到（来源环的通知叫醒宿主
  线程）或到点才应答，宿主线程从不阻塞。每条事件一次往返，消费速率受解释器限制（量级见
  `runner/crates/lang-python/src/lib.rs` 头注释），全市场 `tickers` 这类高频流用缺省 Latest 模式即可。

## 公共字段（所有事件都有）

| 字段 | 类型 | 说明 |
|---|---|---|
| `kind` | number | 事件类型：1=ticker/bbo 3=depth 4=trade 5=kline 16=订单回报 17=持仓 18=余额 32=定时器 33=网关状态 35=初始化状态 |
| `stream` | number | 投递这条事件的流：订阅流 = 本线程订阅对象的 `id`；网关状态 / 定时器为内建流 `ctx.STREAM_STATUS`(2) / `ctx.STREAM_TIMER`(1) |
| `type` | string | `"data"`（行情、私有流的订单/持仓/余额）/ `"status"`（网关状态、初始化状态）/ `"timer"`（定时器） |
| `channel` | string | 所属订阅的频道：`ticker` `bbo` `tickers` `depth` `trade` `kline`；私有流的事件说明自己是哪一种：`orders` / `positions` / `balance`（同一路 `private` 订阅、同一个 `stream`）；网关状态 `"gateway"`，定时器 `"timer"`；kind=35 为它所属订阅的频道（私有流快照状态为 `"private"`）——所以只看 `channel` 分不出数据事件与 kind=35，先判 `type`/`kind` |
| `depth` | number | 仅深度事件：所属订阅的档数（0 = 连接器默认） |
| `interval` | number | 仅 K 线事件与 K 线订阅的 kind=35：周期（秒） |
| `ex` | number | 账户在本次装载序列里的下标（`exchanges[i]` 的 i；无归属事件为 -1；余额与私有流状态事件不挂合约，按账户归属）。可**原样回传** `ctx.order/rest/raw` 的第一参数；label 取 `ctx.connectors()[ev.ex].label` |
| `symbol` | string | 统一格式 `BASE_QUOTE[.contract]`（`BTC_USDT` 现货 / `.swap` 永续 / `.quarter` 季度） |
| `seq` | number | 引擎全序号（同一实例内单调递增） |
| `time` | number | 事件**发生**的时刻（UNIX 毫秒）：交易所给了时间就是交易所时间；交易所时间拿不到时为接收时间（同 `ts`）。各类事件的取法见下文对应小节 |
| `ts` | number | 本机**收到**这条事件的时刻：connector 收到原始报文的时刻；引擎自产事件为发布时间（UNIX 毫秒，带微秒小数；回测=虚拟钟）。`Date.now() - ev.ts` = 引擎+poll 延迟；`ev.ts - ev.time` ≈ 交易所→本机的延迟（仅当 `time` 是交易所时间时有意义） |

`time` 的取法一览（回测里两者都是虚拟钟）：

| 事件 | `time` |
|---|---|
| ticker/bbo/tickers、trade、持仓、余额 | 交易所时间；连接器没给时为 `ts` |
| kline | bar 起始时间，同 `openTimeMs`（与 REST `Record.Time` 同一口径） |
| depth、订单回报 | 接收时间（= `ts`）：ABI 目前不携带这两类的交易所时间，以后携带了即改为交易所时间 |
| 网关状态（33）、初始化状态（35） | `ts` |
| 定时器（32） | 计划触发时刻（`scheduledNs` 换到与 `ts` 相同的毫秒时钟） |

Rust SDK：`sdk::ctx::EventExt` 的 `ev.time()` / `ev.ts()` 按同一规则给出（f64 毫秒），各类型化视图
（`ev.ticker()` / `ev.order()` …）的 `time` 字段就是 `ev.time()`。

## ticker（kind=1，channel: "ticker" / "bbo" / "tickers"）

`bid` `ask` `last` `bidQty` `askQty` `volume` `openInterest` —— 全部实数（已按合约精度
换算）。`time` 是交易所时间（毫秒；连接器未提供时回落到 `ts`）；`open` `high` `low`
由 ticker 自身携带的交易日字段提供，协议没有时回落到 `last`。bbo 类频道无最新价时 `last` 为 0。
`tickers` 的事件逐条是各自的合约（`symbol`）；交易所的全市场流本身不带买卖价时 `bid`/`ask` 为 0
（例：币安现货 `!miniTicker@arr`，见该交易所文档）。`tickers` 只投递，不更新 `exchange.GetTicker`
那份推送缓存。

## trade（kind=4，channel: "trade"）

| 字段 | 类型 | 说明 |
|---|---|---|
| `px` `qty` | number | 成交价/量（实数） |
| `side` | string | **taker 方向**：`"buy"` / `"sell"`；交易所未提供时 `""` |
| `tradeId` | string | 成交号，**恒为字符串**，与 `rest("trades")` 行的 `id` 同一口径：交易所原始号（数字号写十进制、UUID 原样），交易所不给号时为 `syn:` 合成号；空串 = 连接器没给号 |
| `time` | number | 交易所成交时间（毫秒）；连接器未提供时回落到 `ts` |

`tradeId` 永远是 string（ABI v24 起；不会是 number）。Rust SDK 拿到的是原始 `Event`：成交号用
`sdk::ctx::EventExt` 的 `ev.trade_id()`（非成交事件为 `None`），整条成交用 `ev.trade()`。

## kline（kind=5，channel: "kline"，opts.interval 单位秒）

`open` `high` `low` `close` `volume` `openInterest` `intervalSec` `openTimeMs` `closed`
`prefill`。`time` 与 `openTimeMs` 相同（bar 起始时间，毫秒）。`closed=true` 表示该根已收盘（未收盘的中间态会反复推送）；`prefill=true`
表示首次订阅的历史初始化数据。

Kline 的原生订阅、合成、历史 prefill 和断线续接都由 connector 负责。需要 prefill 的 connector
先确认实时订阅生效并暂存期间形成的全部 bar，再按时间发布历史和当前 bar，最后发布同一
stream 的 kind=35 状态；随后只推普通实时 Kline。

## 初始化状态（kind=35，type: "status"，与目标订阅共用 stream）

`stream`、`channel`（字符串，如 `"kline"`）、`interval`/`intervalSec` 标识目标订阅；`channelCode` 是同一
频道的 ABI 数字码（`CH_*`，此前的数字 `channel` 字段）。`prefillStatus`：1=READY、2=FAILED。FAILED 时
`message` 是 connector 返回的真实原因，`detail` 是可选协议码。策略不能在收到 FAILED 前把少量实时
bar 当作完整历史。订阅被拒（见上文「订阅」）也以本事件报告，频道可以是任何频道。私有流的账户快照
也用它报告（`channel: "private"`，见「私有流」）。`time` 为接收时间（同 `ts`）。

## depth（kind=3，channel: "depth"，opts.depth 档数）

事件本身只是"订单簿已更新"的信号，**不带档位**；档位读组装视图：`ev.book(n)` 或 `sub.book(n)` →
`{bids: [[价,量],…], asks: [[价,量],…]}`（bids 降序 / asks 升序）。两者读的都是**这一路订阅自己的**
那本簿（同合约 depth 5 与 depth 20 各一本，互不影响）。`ev.book` 是不可枚举方法，
`JSON.stringify(ev)` 里没有它；事件所属的流已退订时调用抛异常。`bid/ask` 只用于**订单簿侧**命名，
成交方向一律 `buy/sell`。`time` 为接收时间（同 `ts`；ABI 尚不携带深度的交易所时间）。

## 私有流（channel 订阅 `"private"`：订单 + 持仓 + 余额）

一个账户只有**一路**私有订阅，订单回报、持仓、余额都在它的 `stream` 上（私有推送很稀疏，不分订阅）；
事件的 `channel` 说明这一条是什么：`orders`（kind 16）、`positions`（kind 17）、`balance`（kind 18）。三种都走
无损队列。

- **快照**：订阅生效后（以及每次断线重连之后）连接器用它的 `rest.assets` / `rest.positions` 取一份账户
  快照，先发全部快照行（`snapshot: true`），再在同一 stream 上发一条 kind=35 状态（`channel: "private"`，
  `prefillStatus` 1=READY / 2=FAILED，FAILED 时 `message` 是原因、连接器退避重试）；之后才是实时行
  （`snapshot: false`）。重连后的快照会为消失的持仓/资产补清零行。订单回报不补快照。
- **每一行都是全量当前状态，不是增量**：持仓行是某合约某持仓槽此刻的持仓（`qty: 0` = 已平），余额行是
  某资产此刻的 free/frozen 全额（都为 0 = 已清空）。按 (symbol, posSide) / asset 覆盖即得账户状态——
  `sub.positions()` / `sub.balances()` 就是引擎这样维护的那份。
- 口径与该交易所的 `ctx.rest(ex, "positions")` / `("assets")` 相同：统一 symbol、`side`、张或币、资产名、
  均价（每单位标的）。推送没有给的金额字段**省略**（不是 0）。
- 实时推送的覆盖面因交易所而异（例：币安合约的余额行在余额变动事件后经 REST 重读；CTP 柜台不推持仓
  与资金，只有快照），以各交易所文档为准。

持仓（kind=17，`channel: "positions"`）：

| 字段 | 类型 | 说明 |
|---|---|---|
| `symbol` | string | 统一 symbol |
| `side` | string | `"buy"`（多）/ `"sell"`（空），同 `rest("positions")` 行的 `side`；净持仓已平时 `""` |
| `posSide` | string | 持仓槽：`"long"` / `"short"`（双向持仓的两条腿）/ `"net"`（单向持仓，方向随 `side`） |
| `qty` `avgPx` | number | 持仓量（≥ 0，张或币同 REST）、持仓均价 |
| `profit` `margin` `liqPx` `markPx` `leverage` | number? | 未实现盈亏、保证金、强平价、标记价、杠杆；交易所没给就没有该键 |
| `time` | number | 交易所更新时间（毫秒）；没给时为 `ts` |
| `snapshot` | boolean | 属于订阅生效/重连后的快照 |

余额（kind=18，`channel: "balance"`，`symbol` 为空串）：

| 字段 | 类型 | 说明 |
|---|---|---|
| `asset` | string | 资产名（同 `rest("assets").balances[].asset`） |
| `free` `frozen` | number | 该资产此刻的可用 / 冻结全额 |
| `equity` `upnl` `margin` | number? | 权益、未实现盈亏、保证金占用；没有就没有该键 |
| `time` `snapshot` | | 同持仓 |

精度：数量与均价按合约精度定点后还原（均价截断到一个价格最小单位以内）；金额与余额是双精度浮点
（15～16 位有效数字，与 REST 面相同）。

```javascript
var acct = ctx.subscribe(exchange, {channel: "private"});
while (true) {
    var ev = ctx.poll([acct], 1000);
    if (!ev || ev.stream !== acct.id) continue;
    if (ev.kind === 35) {                         // 快照完成 / 失败
        if (ev.prefillStatus === 1) Log("account", acct.balances(), acct.positions());
        else Log("account snapshot failed:", ev.message);
    } else if (ev.channel === "positions" && !ev.snapshot) onPosition(ev);   // 用户函数
    else if (ev.channel === "balance" && !ev.snapshot) onBalance(ev);
    else if (ev.channel === "orders") onOrder(ev);
}
```

## 订单回报（kind=16，channel: "orders"，私有流）

| 字段 | 类型 | 说明 |
|---|---|---|
| `id` | string | 订单号（`ctx.order` 的返回值；空串 = 连接器没给号） |
| `state` | string | `"acked"` `"partial"` `"filled"` `"canceled"` `"rejected"` |
| `px` `qty` `filledQty` `avgPx` | number | 委托价/量、累计成交量、成交均价（实数） |
| `reason` | number | ABI 统一拒单原因码；`reasonText` 是该统一码对应的、与 connector 无关的说明 |
| `time` | number | 毫秒；ABI 尚不携带订单回报的交易所时间，目前为接收时间（同 `ts`） |

## 网关状态（kind=33，type: "status"，channel: "gateway"，内建 STREAM_STATUS）

`status`：1=UP 2=DOWN 3=DEGRADED；`detail`：适配器自定义码；`time` 同 `ts`。

## 引擎定时器（kind=32，type: "timer"，channel: "timer"，内建 STREAM_TIMER）

`timerId` 是定时器 id，`scheduledNs` 是计划触发的引擎时钟纳秒值；超过 JS 安全整数范围时
以字符串返回。`time` 是计划触发时刻换到与 `ts` 相同的毫秒时钟（UNIX 毫秒；回测=虚拟钟），`ts` 是实际发布时刻。QuickJS 的 `setTimeout` 属于语言运行时回调，不会伪装成 kind=32 业务事件。

## 事件归属

引擎把上游的 id 作为订阅标签下发给 connector（同一身份的各线程共用这一个），connector 在这路订阅
产生的每个事件上原样带回，引擎据此投给挂在这路上游上的每个线程，并在交出事件时把 `ev.stream`
写成**该线程自己的**流 id：
- 退订后迟到的事件（标签已不属于任何活订阅）直接丢弃，不会冒充到别的 stream 上；
- 尚未打标签的 connector（如 CTP）按 (合约, 事件类型) 匹配；同合约多路同类订阅时，事件归第一路
  被 poll 点过名的那路，否则归最早落地的那路（归属在事件到达引擎时定）。这类 connector 的深度簿按
  合约一本，同合约几路深度订阅的 `book()` 读到的是同一本。

## 投递模式（慢消费者语义，subscribe opts 指定）

事件由 connector 线程产生、引擎缓存、策略显式 poll 消费（每个线程取自己订阅的那些）。消费慢时按
**每个线程的每条流**各自的模式处理：

| 模式 | opts | 语义 | 缺省适用 |
|---|---|---|---|
| Latest | `{mode:"latest"}` | 只留最新，旧的覆盖**作废**（计入 dropped）；`tickers` 按**合约**各留最新一条 | ticker/bbo/tickers、depth |
| Ring | `{buffer:N}` | 有界数组，按序补投，溢出丢最旧（计入 dropped） | trade、kline（默认 N=1024） |

- 取走即清：每次 poll 拿到的必然是上次之后的新数据；
- **深度特殊**：订单簿在引擎入口持续 apply——策略消费多慢，`ev.book()`/`sub.book()` 都是
  **恒常新**的完整簿；Latest 丢的只是"簿已更新"信号本身，不丢深度增量；
- 回报/持仓/余额/状态走每线程的无损队列（有界 10240，只有某个线程订阅了却从不取时才会满、丢最旧
  并计入 evdrop）；
- 每个连接器的来源环按积压从 1024 条增长到 32768 条（全市场 ticker 一帧就是几百上千条）；到顶后
  tick 丢弃、其余事件向 connector 传导背压（connector 线程重试），因此策略仍须持续 poll；
- 丢弃累计随资源监控上报：`load.evdrop`（引擎侧慢消费：Latest 覆盖 / Ring 溢出 / 无损队列溢出）、
  `load.feeddrop`（来源环满丢掉的 tick）、`load.feedfull`（回给 connector 的背压次数）；策略自己读
  `ctx.connectors()[i].feed`（`{ticksDropped, backpressure, ringCapacity}`，按连接器）。涨得快 =
  策略消费不动，先查事件处理耗时。

`mode` 与 `buffer` 二选一（同时给报错）；`mode` 只认 `"latest"`，`buffer` 为正整数。

推荐 `ctx.poll([], timeoutMs)` 拉取本线程的全部事件。需要过滤时，参数可传单个订阅对象/stream id
或它们的（可嵌套）数组（可混排；批量订阅返回的数组直接传），选项形式 `ctx.poll({streams, sources},
timeoutMs)` 同样收订阅对象。过滤只是"这次只要这几路"：没点名的事件留在本线程的队列里，迟早要有一次
不带过滤器的 poll 取走。等待期间 `ctx.poll` 仍推进 Promise、`setTimeout` 和 WS/TCP；timeoutMs=0
只是不等待业务事件，调用时仍会泵一轮这些语言运行时任务。

```javascript
var tk = ctx.subscribe(exchange, {channel: "ticker"});
var book = ctx.subscribe(exchange, {channel: "depth", depth: 20});
var acct = ctx.subscribe(exchange, {channel: "private"});
while (true) {
    const ev = ctx.poll([], 1000);
    if (!ev) continue;
    if (ev.type === "status") {                    // 网关状态 / 初始化状态（先判，channel 会与数据事件重名）
        if (ev.kind === 35 && ev.prefillStatus === 2) throw new Error(ev.message);
        continue;
    }
    if (ev.channel === "ticker") onTick(ev);
    else if (ev.channel === "depth") onBook(ev.book(5));
    else if (ev.channel === "orders") onOrder(ev); // onTick/onBook/onOrder 是用户函数，不是宿主 API
    else if (ev.channel === "positions" || ev.channel === "balance") onAccount(acct.positions(), acct.balances());
}
```

只取某几路：`ctx.poll([book], 1000)`；不再需要某路时 `tk.unsubscribe()`。

另起一个线程收另一组行情（订阅在 worker 里做，事件只投给它）：

```javascript
var t = threading.Thread(function () {
    var subs = ctx.subscribe(0, {channel: "depth", symbol: ["ETH_USDT", "SOL_USDT"], depth: 5});
    while (true) {
        var ev = ctx.poll([], 1000);               // 只有这个线程自己的两路
        if (ev && ev.kind === 3) onBook(ev.symbol, ev.book(5));
    }
});
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
  要一次性查询 → 用 `ctx.rest`。两者互不影响：`ctx.rest` 不读推送缓存，订阅了也照样打 REST。
- connector 未实现的方法会报错并带方法名（`rest.<名>`）。

## 约定

- **数值一律实数**：定点换算（px_scale/qty_scale）在引擎内完成，策略层不见定点数。
- **不暴露内部句柄**：引擎的 instrument id 等进程内实现细节不进事件（跨重启不稳定）。
- 枚举字段的字符串化只做在**语义层**（side/state）；协议码（reason/status/kind）保留数字。
