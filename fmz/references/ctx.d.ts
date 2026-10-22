// 原生事件式策略 API 声明：全局 `ctx`。
//
// en_US/zh_CN/raw.lib.d.ts 描述平台策略 API（exchange.GetTicker 等）；本文件只描述
// runner 直接暴露的 ctx.* 原语。
// 事件字段规范见 sdk/docs/EVENTS.md，REST 面方法形状见 connectors/DESIGN.md。

// ---------------- 事件 ----------------
//
// ctx.poll 返回的事件是按 `kind`（以及 `type`）区分的联合类型 IAnyEvent：先判 `kind`（或先排除
// `type === "status"`），再读该类事件的字段，tsc 才能收窄。注意 kind=35（初始化/订阅状态）的
// `channel` 是它所属订阅的频道（可以是 "ticker"、"depth"…），所以**只看 channel 不足以区分**数据
// 事件与状态事件——先判 `ev.type === "status"`（或 `ev.kind`）。

/** 订阅频道（ISubOpts.channel / ISubscription.channel）。 */
declare type SubChannel = "ticker" | "bbo" | "tickers" | "trade" | "depth" | "kline" | "private";

/** 事件所属订阅的频道；私有流的事件说明自己是哪一种（orders/positions/balance，同属一路 "private"
 * 订阅），私有流快照状态为 "private"；网关状态为 "gateway"，定时器为 "timer"。 */
declare type EventChannel =
    | "ticker" | "bbo" | "tickers" | "depth" | "trade" | "kline"
    | "orders" | "positions" | "balance" | "private"
    | "gateway" | "timer";

/** 所有事件的公共字段。 */
declare interface IEventBase {
    /** 1=ticker/bbo/tickers 3=depth 4=trade 5=kline 16=订单回报 17=持仓 18=余额 32=定时器 33=网关状态 35=初始化状态 */
    kind: number;
    /** 投递这条事件的流：订阅流 = ISubscription.id（本线程自己的订阅）；内建流 STREAM_TIMER/STREAM_STATUS。 */
    stream: StreamId;
    /** data = 行情/私有流（订单、持仓、余额），status = 网关状态/初始化状态，timer = 定时器。 */
    type: "data" | "status" | "timer";
    /** 所属订阅的频道。 */
    channel: EventChannel;
    /** 账户在装载序里的下标（= ctx.* 第一参可用的数字形态；无归属事件为 -1；余额与状态事件按账户归属） */
    ex: number;
    /** 统一符号 BASE_QUOTE[.contract]（tickers 流逐条是各自的合约；余额/网关/定时器为空串） */
    symbol: string;
    /** 引擎全序号（单调递增） */
    seq: number;
    /** 本机收到这条事件的时刻：connector 收到原始报文的时刻，引擎自产事件为发布时刻（UNIX 毫秒，带微秒
     * 小数；回测为虚拟钟）；Date.now()-ts = 管道延迟。 */
    ts: number;
    /** 事件发生的时刻（UNIX 毫秒），每种事件都有：交易所给了时间就是交易所时间；拿不到交易所时间时为
     * 接收时间（同 ts）。各类事件的取法见该事件类型的说明。 */
    time: number;
}

/** ticker / bbo / 全市场 tickers（kind=1）。bbo 类频道无最新价时 last 为 0；tickers 流的 `symbol`
 * 逐条是各自的合约（交易所的全市场流不带买卖价时 bid/ask 为 0，见该交易所文档）。 */
declare interface ITickEvent extends IEventBase {
    kind: 1;
    type: "data";
    channel: "ticker" | "bbo" | "tickers";
    bid: number;
    ask: number;
    last: number;
    bidQty: number;
    askQty: number;
    volume: number;
    openInterest: number;
    /** ticker 自带的交易日开高低；协议没有时回落到 last。 */
    open: number;
    high: number;
    low: number;
    /** 交易所时间（毫秒）；连接器未提供时回落到 ts。 */
    time: number;
}

/** 逐笔成交（kind=4）。side = taker 方向。 */
declare interface ITradeEvent extends IEventBase {
    kind: 4;
    type: "data";
    channel: "trade";
    px: number;
    qty: number;
    side: "buy" | "sell" | "";
    /** 成交号，恒为字符串（与 rest("trades") 行的 id 同一口径：数字号写十进制、UUID 原样，
     * 交易所不给号时为 "syn:" 合成号）；空串 = 连接器没给号。 */
    tradeId: string;
    /** 交易所成交时间（毫秒）；连接器未提供时回落到 ts。 */
    time: number;
}

/** K 线（kind=5）。closed=true 表示该根已收盘。 */
declare interface IKlineEvent extends IEventBase {
    kind: 5;
    type: "data";
    channel: "kline";
    /** 周期（秒），同 intervalSec。 */
    interval: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
    openInterest: number;
    intervalSec: number;
    /** bar 起始时间（毫秒）；`time` 与它相同（同 REST Record.Time）。 */
    openTimeMs: number;
    closed: boolean;
    /** 首次订阅的历史初始化数据（后来订阅同一路的线程也会补收这些 bar）。 */
    prefill: boolean;
}

/** 深度更新信号（kind=3）：不带档位，档位用 ev.book(n) 读。`time` 为接收时间（同 ts；ABI 尚不携带
 * 深度的交易所时间）。 */
declare interface IDepthEvent extends IEventBase {
    kind: 3;
    type: "data";
    channel: "depth";
    /** 所属深度订阅的档数（0 = 连接器默认）。 */
    depth: number;
    /** 读本事件所属订阅自己的订单簿前 n 档（n 缺省 = 订阅档数）。不可枚举：JSON.stringify(ev) 里没有。
     * 所属流已退订时抛异常。 */
    book(n?: number): IBook;
}

/** 持仓行（kind=17，私有流，channel "positions"）：该合约该持仓槽的**全量**当前状态（qty 0 = 已平）。
 * 口径同 ctx.rest(ex, "positions") 的行；交易所没给的金额字段没有该键。 */
declare interface IPositionEvent extends IEventBase {
    kind: 17;
    type: "data";
    channel: "positions";
    /** 多 "buy" / 空 "sell"（同 rest positions 的 side）；净持仓已平为 ""。 */
    side: "buy" | "sell" | "";
    /** 持仓槽：双向持仓的 "long"/"short" 腿，或单向的 "net"。 */
    posSide: "long" | "short" | "net";
    qty: number;
    avgPx: number;
    profit?: number;
    margin?: number;
    liqPx?: number;
    markPx?: number;
    leverage?: number;
    /** 交易所更新时间（毫秒）；没给时为 ts。 */
    time: number;
    /** 订阅生效/重连后的账户快照行（随后同一 stream 上有 kind=35 READY）。 */
    snapshot: boolean;
}

/** 余额行（kind=18，私有流，channel "balance"，symbol 为空串）：该资产此刻的**全量** free/frozen。 */
declare interface IBalanceEvent extends IEventBase {
    kind: 18;
    type: "data";
    channel: "balance";
    asset: string;
    free: number;
    frozen: number;
    equity?: number;
    upnl?: number;
    margin?: number;
    time: number;
    snapshot: boolean;
}

/** sub.positions() 的一行（字段同 IPositionEvent 的持仓部分）。 */
declare interface IPositionRow {
    symbol: string;
    side: "buy" | "sell" | "";
    posSide: "long" | "short" | "net";
    qty: number;
    avgPx: number;
    profit?: number;
    margin?: number;
    liqPx?: number;
    markPx?: number;
    leverage?: number;
    /** 交易所更新时间（毫秒）；没给就没有该键。 */
    time?: number;
}

/** sub.balances() 的一行。 */
declare interface IBalanceRow {
    asset: string;
    free: number;
    frozen: number;
    equity?: number;
    upnl?: number;
    margin?: number;
    time?: number;
}

/** 订单回报（kind=16，私有流，channel "orders"）。`time` 目前为接收时间（同 ts；ABI 尚不携带订单回报的
 * 交易所时间）。 */
declare interface IOrderEvent extends IEventBase {
    kind: 16;
    type: "data";
    channel: "orders";
    /** 订单号（与 ctx.order 的返回值同域；空串 = 连接器没给号）。 */
    id: string;
    state: "acked" | "partial" | "filled" | "canceled" | "rejected";
    px: number;
    qty: number;
    filledQty: number;
    avgPx: number;
    /** 拒单/撤单原因码（0=无）。跨连接器统一含义。 */
    reason: number;
    /** reason 的人话版本（连接器无关）。 */
    reasonText: string;
}

/** 网关状态（kind=33，type "status"，channel "gateway"，stream = STREAM_STATUS）：status 1=UP 2=DOWN
 * 3=DEGRADED。广播给在该交易所有订阅的每个线程。`time` 同 ts。 */
declare interface IGatewayEvent extends IEventBase {
    kind: 33;
    type: "status";
    channel: "gateway";
    status: number;
    detail: number;
}
/** @deprecated 旧名，同 IGatewayEvent。 */
declare type IStatusEvent = IGatewayEvent;

/** 初始化/订阅状态（kind=35，type "status"）：与目标订阅同一 stream，`channel` 是目标订阅的频道；
 * 订阅被拒也以它报告。私有流的账户快照完成/失败同样用它（channel "private"）。`time` 同 ts。 */
declare interface IFeedStatusEvent extends IEventBase {
    kind: 35;
    type: "status";
    channel: SubChannel;
    /** 目标订阅频道的 ABI 数字码（CH_*）；字符串形式在 channel。 */
    channelCode: number;
    /** K 线订阅的周期（秒）；只有 K 线订阅的状态有。 */
    interval?: number;
    /** 深度订阅的档数；只有深度订阅的状态有。 */
    depth?: number;
    intervalSec: number;
    /** 1=READY 2=FAILED */
    prefillStatus: number;
    detail: number;
    /** FAILED 时 connector 给的真实原因。 */
    message: string;
}

/** 定时器（kind=32，type "timer"，stream = STREAM_TIMER；大整数超出 JS 安全范围时为字符串）。`time` 是
 * 计划触发时刻（scheduledNs 换到与 ts 相同的毫秒时钟），ts 是实际发布时刻。 */
declare interface ITimerEvent extends IEventBase {
    kind: 32;
    type: "timer";
    channel: "timer";
    timerId: number | string;
    scheduledNs: number | string;
}

/** ctx.poll 的事件：按 `kind` 区分（ticker/bbo/tickers 共用 kind 1，再看 channel）。 */
declare type IAnyEvent =
    | ITickEvent
    | ITradeEvent
    | IKlineEvent
    | IDepthEvent
    | IOrderEvent
    | IPositionEvent
    | IBalanceEvent
    | ITimerEvent
    | IGatewayEvent
    | IFeedStatusEvent;

/** 订阅选项（ctx.subscribe 的第二参；未知键抛异常）。 */
declare interface ISubOpts {
    /** ticker（默认）/ bbo / tickers（全市场 ticker）/ trade / depth / kline / private（账户私有流：
     * 订单 + 持仓 + 余额一路） */
    channel?: SubChannel;
    /** 统一符号 BASE_QUOTE[.contract]。行情频道必填——第一参是交易所对象时可省，取它此刻的交易对；
     * private（整个账户）与 tickers（整个市场）不收 symbol（给了抛异常）。 */
    symbol?: string;
    /** depth 频道的档数 */
    depth?: number;
    /** kline 频道的周期（秒） */
    interval?: number;
    /** 投递模式：只保留最新、旧的作废（ticker/bbo/depth 默认已是；tickers 按合约各留最新一条）。
     * 与 buffer 二选一。 */
    mode?: "latest";
    /** 投递模式：有界数组，溢出丢最旧（trade/kline 默认 1024）。与 mode 二选一。 */
    buffer?: number;
}

/** 批量订阅的选项：symbol 是数组（每个元素一路独立订阅）。 */
declare interface ISubOptsBatch extends Omit<ISubOpts, "symbol"> {
    symbol: string[];
}

/**
 * ctx.subscribe 返回的订阅对象。身份字段只读；JSON.stringify(sub) 只含身份字段。
 * 订阅属于调用 ctx.subscribe 的线程（主线程或 threading worker）：它的事件只投给这个线程。
 * 同一线程里身份 (ex, symbol, channel, depth, interval) 相同的订阅共用一条流（id 相同、引用计数）；
 * 别的线程订同一身份是它自己的另一条流（共用一路上游，各收一份）。
 */
declare interface ISubscription {
    readonly id: StreamId;
    readonly ex: number;
    readonly channel: SubChannel;
    readonly symbol: string;
    readonly depth: number;
    readonly interval: number;
    /** 这一路深度订阅自己的订单簿前 n 档（n 缺省 = 订阅档数；还没收到快照时两边为空）。
     * 不是深度订阅、已退订都抛异常。 */
    book(n?: number): IBook;
    /** 私有订阅看到的最新持仓（全量状态）。账户快照还没 READY（或最近一轮 FAILED）为 null——状态
     * 不可知，不是"没有持仓"；现货 READY 后为 []。不是私有订阅、已退订都抛异常。 */
    positions(): IPositionRow[] | null;
    /** 私有订阅看到的最新余额（全量状态，按资产排序）；null 同 positions()。 */
    balances(): IBalanceRow[] | null;
    /** 退订（退掉本对象持有的引用，最后一个引用退掉才真正向交易所退订）。重复调用是空操作。 */
    unsubscribe(): void;
}

/** 批量订阅的结果：与 opts.symbol 同序的订阅对象数组，外加不可枚举的 unsubscribe()（退订全部）。 */
declare interface ISubscriptionArray extends Array<ISubscription> {
    unsubscribe(): void;
}

/** 已挂载的账户（连接器实例）。 */
declare interface IConnectorInfo {
    /** 装载序下标（= ev.ex） */
    ex: number;
    /** 账户 label（多账户唯一） */
    label: string;
    /** 交易所名（web_connector.name） */
    name: string;
    /** 用户配置的交易对（可能为空） */
    symbol: string;
    /** tickPeriod（秒），0=未指定 */
    interval: number;
    /** 兼容 API 的公开订单号是否带 symbol（"symbol"）还是全局唯一（"global"）。 */
    orderIdScope: "global" | "symbol";
    /** 推送面来源环的计数（只读诊断，进程启动以来累计）：环满丢掉的 tick、回给连接器的背压次数、
     * 环当前容量（条，按积压从 1024 增长到 32768）。涨得快 = 消费跟不上这个连接器的推送。 */
    feed: { ticksDropped: number; backpressure: number; ringCapacity: number };
}

/** sub.book() / ev.book() 返回的组装簿：[价, 量] 数组，bids 降序、asks 升序。 */
declare interface IBook {
    bids: [number, number][];
    asks: [number, number][];
}

/** 条件单参数（交易所**原生**条件单；委托价 0 = 触发后市价）。 */
declare interface ICondOpts {
    /** tp=止盈 sl=止损 oco=二择一（多数交易所不支持 oco，会拒单） */
    type: "tp" | "sl" | "oco";
    /** 止盈触发价（tp/oco 必填） */
    tpTrigger?: number;
    /** 止盈委托价，0/省略 = 市价 */
    tpPx?: number;
    /** 止损触发价（sl/oco 必填） */
    slTrigger?: number;
    /** 止损委托价，0/省略 = 市价 */
    slPx?: number;
}

/** 下单可选项。 */
declare interface IOrderOpts {
    type?: "limit" | "market" | "stop" | "stopLimit";
    tif?: "gtc" | "ioc" | "fak" | "fok" | "postOnly";
    reduceOnly?: boolean;
    postOnly?: boolean;
    closeToday?: boolean;
    replaceId?: number;
    extra?: any;
    /** 条件单（下交易所原生条件单，不是本地模拟） */
    cond?: ICondOpts;
}

/** 交易所对象（exchange、exchanges[i]，即 lib.d.ts 的 IExchange）：ctx.* 第一参取它的 GetIndex()。 */
declare interface IExchangeLike {
    GetIndex(): number;
}

/**
 * 账户寻址：**装载序下标**（0 起，= exchanges[i] 的 i，服务端按 pid 定序，跨重启稳定；数字串 "0"
 * 也收），或交易所对象（exchange、exchanges[i]）。
 *
 * **label 不能用**：同所多账户默认同名，拿 label 当路由键会塌缩到同一个账户。传
 * 非数字串会被归成无效下标，由引擎响亮拒绝（no connector），不会静默落到别的账户上。
 */
declare type ExRef = number | string | IExchangeLike;
/** 事件流 id（ISubscription.id 或内建流）。 */
declare type StreamId = number;
/** ctx.poll 的流过滤：订阅对象、数字 id，或它们的（可嵌套）数组（批量订阅的结果可直接传）。 */
declare type StreamRef = StreamId | ISubscription | StreamRef[];

/** `ctx.poll(options)` 可统一等待的运行时来源。 */
declare type RuntimePollSource = "engine" | "thread" | "go" | "dial" | "task";
declare interface IRuntimePollOptions {
    /** Engine 来源的 stream 过滤（订阅对象或 id，可混排、可嵌套）；省略或 [] 表示本线程的全部。 */
    streams?: StreamRef;
    /** 默认仅 engine；"all" 表示全部来源。 */
    sources?: RuntimePollSource[] | "all";
}
declare interface IRuntimePollMeta {
    /** 当前 worker 内按生产顺序分配的事件序号。 */
    seq: number;
    /** 生产通知时的 Unix 纳秒。 */
    nano: number;
    /** 本条出队后，当前 worker 仍积压的通知数。 */
    queue: number;
}
declare type IRuntimePollEvent =
    | (IRuntimePollMeta & { source: "engine"; event: IAnyEvent })
    | (IRuntimePollMeta & { source: "thread"; event: any })
    | (IRuntimePollMeta & { source: "go"; event: { ticket: number; name: string } })
    | (IRuntimePollMeta & { source: "dial"; event: { fd: number } })
    | (IRuntimePollMeta & { source: "task"; event: { id: number; name: string } });

// ---------------- ctx ----------------

declare interface ICtx {
    // —— 事件流 ——
    /** 内建定时器事件流 id（kind=32）。 */
    readonly STREAM_TIMER: 1;
    /** 内建网关状态事件流 id（kind=33）。 */
    readonly STREAM_STATUS: 2;
    /** 订阅一个行情或账户私有流，立即返回订阅对象（可交给 ctx.poll 过滤）。**只有两参形式**：
     * symbol 写在 opts 里；第二参不是对象/参数个数不对/未知键/未知频道/行情频道缺 symbol 都抛异常。
     * 订阅属于调用它的线程（主线程或 threading worker），事件只投给这个线程。
     * 同一线程里订阅身份 = (ex, symbol, channel, depth, interval) 相同的重复订阅回同一条流（引用计数）；
     * 同合约的 ticker 与 bbo、depth 5 与 depth 20 是不同的订阅、不同的 stream。
     * 订阅被拒时，该订阅自己的流上来一条 kind=35、prefillStatus=2 的事件（tickers 在交易所没有原生
     * 全市场流时也这样报 unsupported）。
     * 订阅不影响 REST：ctx.rest / exchange.GetTicker 等照旧打交易所 REST，不读推送缓存。 */
    subscribe(ex: ExRef, opts: ISubOpts): ISubscription;
    /** 批量订阅：opts.symbol 是数组 → 与它同序的订阅对象数组（一个元素也是数组）。整批先校验：任何一个
     * symbol/选项不合法整批抛异常、一个也不订。之后每个元素都是独立的一路订阅（自己的 id、簿、引用
     * 计数），连接器拒绝其中一个只让那一路上来 FAILED。 */
    subscribe(ex: ExRef, opts: ISubOptsBatch): ISubscriptionArray;
    /**
     * 拉取下一条**本线程自己订阅的**事件。streams 省略或 [] 表示本线程的全部；单个订阅对象/id 或它们的
     * （嵌套）数组表示只要这几路（没点名的留在本线程队列里，迟早要取）。别的线程的订阅在这里取不到。
     * timeoutMs 省略=一直等待，0=不等待业务事件，正数=最长等待指定毫秒。
     * 宿主在每次调用（包括 timeoutMs=0）都会推进 Promise、setTimeout 和 WS/TCP 回调。
     */
    poll(streams?: StreamRef, timeoutMs?: number): IAnyEvent | null;
    /**
     * 按当前 worker 的统一通知 FIFO 等待多个运行时来源；payload 仍从各来源原队列取出。
     * timeoutMs 语义与上面的 Engine-only 重载相同。
     */
    poll(options: IRuntimePollOptions, timeoutMs?: number): IRuntimePollEvent | null;

    // —— 交易 ——
    //
    // **失败不抛异常，一律走返回值**，而且分两层，两层都要判（只判一层，另一层就会
    // 被当成数据用下去）：
    //   1. 传输层失败（断连/超时/没有这个连接器/没有这个方法）→ 返回 `Error` 实例；
    //   2. 交易所业务失败（401/限频/拒单）→ 返回**带 `error` 字段的普通对象**
    //      （order/cancel 这种没有对象返回值的，走第 1 层）。
    // 调用方应先判 `instanceof Error`，再判普通对象上的 `error` 字段。

    /** 下单：**同步**走一个 REST 往返，返回交易所订单号（回报经私有流 private 回到 ctx.poll）。
     * 未订阅也可下单。失败回 `Error` 值，绝不返回假号——用前先 `instanceof Error`。 */
    order(
        ex: ExRef,
        symbol: string,
        side: "buy" | "sell",
        px: number,
        qty: number,
        opts?: IOrderOpts
    ): string | Error;
    /** 撤单：id 传 order() 的返回值。失败回 `Error` 值。 */
    cancel(ex: ExRef, symbol: string, id: string): void | Error;

    // —— REST 查询面（同步、可查未订阅品种、宿主限频）——
    /** 标准方法由 extension-api/abi 的 REST_METHODS 登记，JSON 契约见其 README。
     * 失败见上面"交易"段的两层约定。 */
    rest(ex: ExRef, method: string, args?: any): any;
    /** 交易所专属端点（逃生口，方法名由连接器定义）。回**字符串**（不是解析后的对象）。 */
    raw(ex: ExRef, method: string, args?: any): string | Error;

    /** 兼容层内部使用：将工作线程的完成通知纳入统一 poll。 */
    pollTrackTask(threadId: number, taskId: number, eventName: string): void;

    // —— 运行时 ——
    /** 已挂载的账户列表（顺序即 ev.ex 下标）。 */
    connectors(): IConnectorInfo[];
    /** 睡眠 ms；期间推进定时器/微任务和网络回调，但不消费业务事件；stop 时抛中断。 */
    sleep(ms: number): void;
    /** 普通日志（落本地 sqlite，服务端按需拉取）。文本以 @ 结尾同时作为推送消息。 */
    log(...args: any[]): void;
    /** 状态栏（覆盖式，不进日志流）。 */
    logStatus(...args: any[]): void;
    /** 收益打点。 */
    logProfit(profit: number, note?: string): void;
    /** 图表配置 / 加点 / 清空。 */
    chart(cfg: any): void;
    chartAdd(seriesId: number, data: any, replaceIdx?: number): void;
    chartReset(keep?: number): void;
    /** 删一条曲线；`seriesId <= 0` 删整张图（含配置）。 */
    chartDel(seriesId: number): void;
    /** 取服务端下发的交互命令（无则返回空串；timeoutMs>0 时阻塞等待）。 */
    getCommand(timeoutMs?: number): string;
    /** 解密 $$$__ 前缀的密文（凭据用；根密码不落 env）。 */
    decrypt(data: string): string;
    /** 机器人间共享数据：写本机器人的一格。 */
    setChannelData(value: any): void;
    /** 机器人间共享数据：按 token 读别人的一格（无则空串）。 */
    getChannelData(token: string): string;
    /** 服务端下发的运行期配置（市场时段表等；未下发过为 null）。 */
    getRuntimeContext(): any;
    /** 本实盘 ID。 */
    robotId(): number;
    /** 装载 connector（引导层用，策略一般不直接调）。 */
    loadConnector(label: string, path: string, config: string): void;
}

declare const ctx: ICtx;

/** 策略入口（可选 async）。 */
declare function main(): void | Promise<void>;
/** 停止钩子。 */
declare function onexit(): void;
/**
 * 异常钩子。
 *
 * 注：TS 的 DOM 库也声明了全局 `onerror`（浏览器事件处理器），同项目下会撞名——
 * 编辑器里把 `"lib": ["es2020"]`（不含 dom）或 `"types": []` 配上即可。
 */
declare function onerror(msg: string): void;
