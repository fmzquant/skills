// 原生事件式策略 API 声明：全局 `ctx`。
//
// en_US/zh_CN/raw.lib.d.ts 描述平台策略 API（exchange.GetTicker 等）；本文件只描述
// runner 直接暴露的 ctx.* 原语。
// 事件字段规范见 sdk/docs/EVENTS.md，REST 面方法形状见 connectors/DESIGN.md。

// ---------------- 事件 ----------------
//
// ctx.poll 返回的事件是按 `kind`（字符串名）区分的联合类型 IAnyEvent：先判 `ev.kind === "fill"` 这类，
// 再读该类事件的字段，tsc 才能收窄。注意 kind "status"（初始化/订阅状态）的 `channel` 是它所属订阅的
// 频道（可以是 "ticker"、"depth"…），所以**只看 channel 不足以区分**数据事件与状态事件——先判
// `ev.kind`（或 `ev.type === "status"`）。

/** 订阅频道（ISubOpts.channel / ISubscription.channel）。 */
declare type SubChannel = "ticker" | "bbo" | "tickers" | "trade" | "depth" | "kline" | "private";

/** 事件所属订阅的频道；私有流的事件说明自己是哪一种（orders/fills/positions/balance，同属一路 "private"
 * 订阅），私有流快照状态为 "private"；网关状态为 "gateway"，定时器为 "timer"，ctx.submit 的应答为 "ack"。 */
declare type EventChannel =
    | "ticker" | "bbo" | "tickers" | "depth" | "trade" | "kline"
    | "orders" | "fills" | "positions" | "balance" | "private"
    | "gateway" | "timer" | "ack";

/** 事件类型名（`ev.kind`）：ticker（ticker/bbo/tickers 频道共用，channel 区分）、depth、trade、kline、
 * order（订单回报）、position（持仓）、balance（余额）、fill（成交回报）、ack（ctx.submit 应答）、timer（定时器）、
 * gateway（网关状态）、status（初始化/订阅状态）。以后新增的类型会加新名字；宿主不认识的为 "unknown"。 */
declare type EventKind =
    | "ticker" | "depth" | "trade" | "kline"
    | "order" | "position" | "balance" | "fill" | "ack"
    | "timer" | "gateway" | "status";

/** 所有事件的公共字段。 */
declare interface IEventBase {
    /** 事件类型名（见 EventKind）；按它分发，tsc 会把 IAnyEvent 收窄到对应的事件类型。 */
    kind: EventKind;
    /** 投递这条事件的流：订阅流 = ISubscription.id（本线程自己的订阅）；内建流 STREAM_TIMER/STREAM_STATUS/STREAM_ORDER_ACK。 */
    stream: StreamId;
    /** data = 行情/私有流（订单、成交、持仓、余额），status = 网关状态/初始化状态，timer = 定时器，ack = ctx.submit 的应答。 */
    type: "data" | "status" | "timer" | "ack";
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

/** ticker / bbo / 全市场 tickers（kind "ticker"）。bbo 类频道无最新价时 last 为 0；tickers 流的 `symbol`
 * 逐条是各自的合约（交易所的全市场流不带买卖价时 bid/ask 为 0，见该交易所文档）。 */
declare interface ITickEvent extends IEventBase {
    kind: "ticker";
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

/** 逐笔成交（kind "trade"）。side = taker 方向。 */
declare interface ITradeEvent extends IEventBase {
    kind: "trade";
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

/** K 线（kind "kline"）。closed=true 表示该根已收盘。 */
declare interface IKlineEvent extends IEventBase {
    kind: "kline";
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

/** 深度更新信号（kind "depth"）：不带档位，档位用 ev.book(n) 读。`time` 为接收时间（同 ts；ABI 尚不携带
 * 深度的交易所时间）。 */
declare interface IDepthEvent extends IEventBase {
    kind: "depth";
    type: "data";
    channel: "depth";
    /** 所属深度订阅的档数（0 = 连接器默认）。 */
    depth: number;
    /** 读本事件所属订阅自己的订单簿前 n 档（n 缺省 = 订阅档数）。不可枚举：JSON.stringify(ev) 里没有。
     * 所属流已退订时抛异常。 */
    book(n?: number): IBook;
}

/** 持仓行（kind "position"，私有流，channel "positions"）：该合约该持仓槽的**全量**当前状态（qty 0 = 已平）。
 * 口径同 ctx.rest(ex, "positions") 的行；交易所没给的金额字段没有该键。 */
declare interface IPositionEvent extends IEventBase {
    kind: "position";
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
    /** 订阅生效/重连后的账户快照行（随后同一 stream 上有 kind "status" READY）。 */
    snapshot: boolean;
}

/** 余额行（kind "balance"，私有流，channel "balance"，symbol 为空串）：该资产此刻的**全量** free/frozen。 */
declare interface IBalanceEvent extends IEventBase {
    kind: "balance";
    type: "data";
    channel: "balance";
    asset: string;
    /** 可用；推送里没有与 GetAssets() 同口径的值时为 null（推送不调 REST 补齐）。 */
    free: number | null;
    /** 冻结；同 free。 */
    frozen: number | null;
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
    /** 可用；推送里没有同口径的值时为 null。 */
    free: number | null;
    frozen: number | null;
    equity?: number;
    upnl?: number;
    margin?: number;
    time?: number;
}

/** 订单回报（kind "order"，私有流，channel "orders"）。`time` 目前为接收时间（同 ts；ABI 尚不携带订单回报的
 * 交易所时间）。 */
declare interface IOrderEvent extends IEventBase {
    kind: "order";
    type: "data";
    channel: "orders";
    /** 订单号（与 ctx.order 的返回值同域；空串 = 连接器没给号）。 */
    id: string;
    /** 客户端订单号（交易所推送里的原值；ctx.submit 下的单就是它返回的 localId）；"" = 推送没给。 */
    clientId: string;
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

/** 成交回报（kind "fill"，私有流，channel "fills"）：自己订单的**一笔**成交（my trade）。连接器先发成交、
 * 再发反映它的订单回报；一张单全部成交的 qty 之和 = 它的 filledQty。不补快照（订阅/重连后不回补历史成交）。 */
declare interface IFillEvent extends IEventBase {
    kind: "fill";
    type: "data";
    channel: "fills";
    /** 所属订单的订单号（与 IOrderEvent.id、ctx.order 的返回值同域）。 */
    orderId: string;
    /** 所属订单的客户端订单号（同 IOrderEvent.clientId）；"" = 推送没给。 */
    clientId: string;
    /** 交易所成交号，恒为字符串（交易所不给号时为 "syn:" 合成号；空串 = 连接器没给号）。 */
    tradeId: string;
    /** 这一笔的成交价 / 成交量（量纲同该订单的 qty/filledQty）。 */
    px: number;
    qty: number;
    /** 这一笔的手续费：正 = 付出，负 = 返佣；交易所没给就没有该键。 */
    fee?: number;
    /** 手续费资产（同 ctx.rest(ex, "assets") 的资产名）；"" = 未知。 */
    feeCcy: string;
    /** 订单方向（不是 taker 方向）。 */
    side: "buy" | "sell" | "";
    /** 挂单 / 吃单；交易所没说为 ""。 */
    liquidity: "maker" | "taker" | "";
    /** 交易所成交时间（毫秒）；没给时为 ts。 */
    time: number;
}

/** 网关状态（kind "gateway"，type "status"，channel "gateway"，stream = STREAM_STATUS）：status 1=UP 2=DOWN
 * 3=DEGRADED。广播给在该交易所有订阅的每个线程。`time` 同 ts。 */
declare interface IGatewayEvent extends IEventBase {
    kind: "gateway";
    type: "status";
    channel: "gateway";
    status: number;
    detail: number;
}
/** @deprecated 旧名，同 IGatewayEvent。 */
declare type IStatusEvent = IGatewayEvent;

/** 初始化/订阅状态（kind "status"，type "status"）：与目标订阅同一 stream，`channel` 是目标订阅的频道；
 * 订阅被拒也以它报告。私有流的账户快照完成/失败同样用它（channel "private"）。`time` 同 ts。 */
declare interface IFeedStatusEvent extends IEventBase {
    kind: "status";
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

/** 定时器（kind "timer"，type "timer"，stream = STREAM_TIMER；大整数超出 JS 安全范围时为字符串）。`time` 是
 * 计划触发时刻（scheduledNs 换到与 ts 相同的毫秒时钟），ts 是实际发布时刻。 */
declare interface ITimerEvent extends IEventBase {
    kind: "timer";
    type: "timer";
    channel: "timer";
    timerId: number | string;
    scheduledNs: number | string;
}

/** ctx.submit 的应答（kind "ack"，type "ack"，channel "ack"，stream = STREAM_ORDER_ACK）：每一项一条，**只投给调用
 * ctx.submit 的线程**（不必订阅）。`symbol`/`ex` 是这一项的。 */
declare interface IOrderAckEvent extends IEventBase {
    kind: "ack";
    type: "ack";
    channel: "ack";
    /** ctx.submit 返回的请求号：下单就是这张单的客户端订单号（localId），撤单是一个新号。 */
    reqId: string;
    op: "order" | "cancel";
    /** ok = 拿到订单号 / 撤单确认；failed = 交易所拒绝、限频拒单、撤单时订单已先一步终态；unknown = 请求已发出却没等到
     * 结论（订单可能已在交易所：**不要重发**，按 clientId 查单或等私有流回报对账）。 */
    status: "ok" | "failed" | "unknown";
    ok: boolean;
    /** 交易所订单号（下单成功 / 撤单的目标单；下单失败为空串）。 */
    id: string;
    /** 目标订单的客户端订单号：下单 = localId；按 localId 撤单时是它，按交易所订单号撤为空串。 */
    clientId: string;
    /** 失败原因（与 REST 同款错误串；成功为空串；最长 127 字节）。 */
    error: string;
    /** ABI 统一原因码（0=无 3=传输/未知 4=交易所拒绝 5=限频）与说明。 */
    reason: number;
    reasonText: string;
    /** 交易所应答时间（毫秒）；交易所没给为 null。 */
    exchTime: number | null;
    /** 往返耗时（毫秒）：请求写出前一刻 → 宿主拿到交易所的结论。 */
    latencyMs: number;
    /** 交易所应答时间，没有时同 ts。 */
    time: number;
}

/** ctx.poll 的事件：按 `kind` 区分（ticker/bbo/tickers 共用 kind "ticker"，再看 channel）。 */
declare type IAnyEvent =
    | ITickEvent
    | ITradeEvent
    | IKlineEvent
    | IDepthEvent
    | IOrderEvent
    | IFillEvent
    | IPositionEvent
    | IBalanceEvent
    | ITimerEvent
    | IGatewayEvent
    | IFeedStatusEvent
    | IOrderAckEvent;

/** 订阅选项（ctx.subscribe 的第二参；未知键抛异常）。 */
declare interface ISubOpts {
    /** ticker（默认）/ bbo / tickers（全市场 ticker）/ trade / depth / kline / private（账户私有流：
     * 订单 + 成交 + 持仓 + 余额一路） */
    channel?: SubChannel;
    /** 统一符号 BASE_QUOTE[.contract]。行情频道必填——第一参是交易所对象时可省，取它此刻的交易对；
     * private（整个账户）与 tickers（整个市场）不收 symbol（给了抛异常）。 */
    symbol?: string;
    /** depth 频道的档数：0（缺省）= 连接器默认，1–255 任意档数各是一路独立订阅（取覆盖它的最小原生档、
     * 按档数截断）；超过 255 抛异常，超过交易所上限在该流上 FAILED（unsupported depth）。 */
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
    /** ctx.submit 的应答因发起线程的应答队列（1024 条）满了被丢掉的累计条数（策略从不取应答时增长）。 */
    acksDropped: number;
}

/** sub.book() / ev.book() 返回的组装簿：[价, 量] 数组，bids 降序、asks 升序。 */
declare interface IBook {
    bids: [number, number][];
    asks: [number, number][];
}

/** 下单可选项（ctx.order 的第六参；ctx.submit 的下单项也认这些键）。**白名单**：只认下面这些键，其他键一律报
 * `unknown order opt` 错误（不静默丢掉）。交易所专属参数放 `extra`；条件单走
 * `ctx.rest(ex, "condSubmit", {symbol, side, qty, cond, replaceId?, …})`；改挂着的单走
 * `ctx.rest(ex, "amend", {id, px?, qty?})`。 */
declare interface IOrderOpts {
    /** 订单类型，缺省 "limit"。 */
    type?: "limit" | "market";
    /** 有效期，缺省 "gtc"。 */
    tif?: "gtc" | "ioc" | "fak" | "fok" | "postOnly";
    /** 只减仓，缺省 false。 */
    reduceOnly?: boolean;
    /** 只做 maker，缺省 false。 */
    postOnly?: boolean;
    /** 交易所专属参数（逃生口，连接器原样透传给交易所）。ctx.submit 里不能用它带客户端订单号。 */
    extra?: any;
}

/** ctx.submit 的一张下单（`op: "order"` 的单笔字段，或 `orders` 数组的一项）。客户端订单号由我们生成，不能自带。 */
declare interface ISubmitOrderItem extends IOrderOpts {
    /** 统一符号 BASE_QUOTE[.contract]。 */
    symbol: string;
    side: "buy" | "sell";
    /** 限价；市价单（type: "market"）可省。 */
    price?: number;
    /** 数量（> 0，量纲同 ctx.order 的 qty）。 */
    amount: number;
}

/** ctx.submit 的一次撤单（`op: "cancel"` 的单笔字段，或 `orders` 数组的一项）。 */
declare interface ISubmitCancelItem {
    symbol: string;
    /** 交易所订单号，或本进程 ctx.submit 返回的 localId（按客户端订单号撤）。 */
    id: string;
}

declare type ISubmitOrder = { op: "order" } & ISubmitOrderItem;
declare type ISubmitOrderBatch = { op: "order"; orders: ISubmitOrderItem[] };
declare type ISubmitCancel = { op: "cancel" } & ISubmitCancelItem;
declare type ISubmitCancelBatch = { op: "cancel"; orders: ISubmitCancelItem[] };

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
    /** 内建定时器事件流 id（kind "timer"）。 */
    readonly STREAM_TIMER: 1;
    /** 内建网关状态事件流 id（kind "gateway"）。 */
    readonly STREAM_STATUS: 2;
    /** 内建 ctx.submit 应答流 id（kind "ack"，只投给发起请求的线程）。 */
    readonly STREAM_ORDER_ACK: 4;
    /** 订阅一个行情或账户私有流，立即返回订阅对象（可交给 ctx.poll 过滤）。**只有两参形式**：
     * symbol 写在 opts 里；第二参不是对象/参数个数不对/未知键/未知频道/行情频道缺 symbol 都抛异常。
     * 订阅属于调用它的线程（主线程或 threading worker），事件只投给这个线程。
     * 同一线程里订阅身份 = (ex, symbol, channel, depth, interval) 相同的重复订阅回同一条流（引用计数）；
     * 同合约的 ticker 与 bbo、depth 5 与 depth 20 是不同的订阅、不同的 stream。
     * 订阅被拒时，该订阅自己的流上来一条 kind "status"、prefillStatus=2 的事件（tickers 在交易所没有原生
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

    /** 下单（REST）：**同步**等一个往返，返回交易所订单号（回报经私有流 private 回到 ctx.poll）。未订阅也可下单；
     * 主线程与 threading worker 都可调。失败回 `Error` 值，绝不返回假号——用前先 `instanceof Error`。 */
    order(
        ex: ExRef,
        symbol: string,
        side: "buy" | "sell",
        px: number,
        qty: number,
        opts?: IOrderOpts
    ): string | Error;
    /** 撤单（REST）：id 传 order() 的返回值，或本进程 ctx.submit 返回的 localId。失败回 `Error` 值。 */
    cancel(ex: ExRef, symbol: string, id: string): void | Error;
    /** 经交易所的 WebSocket 交易连接下单（**只走 WS**，连接器不支持时回 Error，不改走 REST）。**写出即返回**
     * 请求号，就是发给交易所的客户端订单号（localId，由连接器生成；之后的订单/成交回报 `clientId` 也是它）；结论是投给
     * **本线程**的 kind "ack" 应答事件（IOrderAckEvent，`ctx.poll([ctx.STREAM_ORDER_ACK], …)`）。参数错、交易连接起不来
     * （首次至多等约 5 秒）、在途请求太多（256）、本地限频时当场回 `Error`，什么都没发出去。 */
    submit(ex: ExRef, req: ISubmitOrder): string | Error;
    /** 批量下单：返回与 `orders` 同序的 localId 数组，每一项一条应答。整批先校验，任何一项不合法整批回 Error、什么都
     * 不发；交易所有原生批量接口时一帧发出，否则同一连接上流水线发出（不是原子的）。 */
    submit(ex: ExRef, req: ISubmitOrderBatch): string[] | Error;
    /** 撤单（WS）：返回一个新的请求号（应答的 reqId）。 */
    submit(ex: ExRef, req: ISubmitCancel): string | Error;
    /** 批量撤单：同序的请求号数组。 */
    submit(ex: ExRef, req: ISubmitCancelBatch): string[] | Error;

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
