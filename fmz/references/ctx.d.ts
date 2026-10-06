// 原生事件式策略 API 声明：全局 `ctx`。
//
// en_US/zh_CN/raw.lib.d.ts 描述 FMZ 策略 API（exchange.GetTicker 等）；本文件只描述
// runner 直接暴露的 ctx.* 原语。
// 事件字段规范见 sdk/docs/EVENTS.md，REST 面方法形状见 connectors/DESIGN.md。

// ---------------- 事件 ----------------

/** 所有事件的公共字段。 */
declare interface IEventBase {
    /** 1=ticker 3=depth 4=trade 5=kline 16=订单回报 32=定时器 33=网关状态 */
    kind: number;
    /** 账户在装载序里的下标（= ctx.* 第一参可用的数字形态；无归属事件为 -1） */
    ex: number;
    /** 统一符号 BASE_QUOTE[.contract] */
    symbol: string;
    /** 引擎全序号（单调递增） */
    seq: number;
    /** connector 收到原始报文的时刻（UNIX 毫秒，带微秒小数）；Date.now()-ts = 管道延迟 */
    ts: number;
}

/** ticker / bbo（kind=1）。bbo 类频道无最新价时 last 为 0。 */
declare interface ITickEvent extends IEventBase {
    bid: number;
    ask: number;
    last: number;
    bidQty: number;
    askQty: number;
    volume: number;
    openInterest: number;
    /** 最新日 K 可用时取其 OHLC，否则回落到 last。 */
    open: number;
    high: number;
    low: number;
    /** 交易所时间（毫秒）；连接器未提供时回落到 ts。 */
    time: number;
}

/** 逐笔成交（kind=4）。side = taker 方向。 */
declare interface ITradeEvent extends IEventBase {
    px: number;
    qty: number;
    side: "buy" | "sell" | "";
    tradeId: number | string;
}

/** K 线（kind=5）。closed=true 表示该根已收盘。 */
declare interface IKlineEvent extends IEventBase {
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
    intervalSec: number;
    openTimeMs: number;
    closed: boolean;
}

/** 深度更新信号（kind=3）：不带档位，档位读 ctx.book()。 */
declare type IDepthEvent = IEventBase;

/** 订单回报（kind=16）。 */
declare interface IOrderEvent extends IEventBase {
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

/** 网关状态（kind=33）：status 1=UP 2=DOWN 3=DEGRADED。 */
declare interface IStatusEvent extends IEventBase {
    status: number;
    detail: number;
}

/** 引擎定时器到期（kind=32；大整数超出 JS 安全范围时为字符串）。 */
declare interface ITimerEvent extends IEventBase {
    timerId: number | string;
    scheduledNs: number | string;
}

declare type IAnyEvent =
    | ITickEvent
    | ITradeEvent
    | IKlineEvent
    | IDepthEvent
    | IOrderEvent
    | ITimerEvent
    | IStatusEvent;

/** 订阅选项。 */
declare interface ISubOpts {
    /** ticker（默认）/ bbo / trade / depth / kline / orders（账户私有流，symbol 传空串） */
    channel?: "ticker" | "bbo" | "trade" | "depth" | "kline" | "orders";
    /** depth 频道的档数 */
    depth?: number;
    /** kline 频道的周期（秒） */
    interval?: number;
    /** 投递模式：只保留最新、旧的作废（ticker/depth 默认已是） */
    mode?: "latest";
    /** 投递模式：有界数组，溢出丢最旧（trade/kline 默认 1024） */
    buffer?: number;
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
}

/** ctx.book() 返回的组装簿：[价, 量] 数组，bids 降序、asks 升序。 */
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

/**
 * 账户寻址：**装载序下标**（0 起，= loadConnector 的装载顺序，服务端按 pid 定序，
 * 跨重启稳定）。数字串（"0"）也收。
 *
 * **label 不能用**：同所多账户默认同名，拿 label 当路由键会塌缩到同一个账户。传
 * 非数字串会被归成 -1，由引擎响亮拒绝（no connector -1），不会静默落到别的账户上。
 */
declare type ExRef = number | string;
/** ctx.subscribe 返回的事件流 id。 */
declare type StreamId = number;

/** `ctx.poll(options)` 可统一等待的运行时来源。 */
declare type RuntimePollSource = "engine" | "thread" | "go" | "dial" | "task";
declare interface IRuntimePollOptions {
    /** Engine 来源的 stream 过滤；省略或 [] 表示全部。 */
    streams?: StreamId | StreamId[];
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
    /** 所有未被其它 poll 过滤器点名的兜底流。 */
    readonly STREAM_REST: 3;
    /** 订阅一个行情或账户私有流，立即返回可交给 ctx.poll 过滤的 stream id。 */
    subscribe(
        ex: ExRef,
        symbol: string,
        opts?: ISubOpts
    ): StreamId;
    /**
     * 拉取下一条事件。streams 省略或 [] 表示全部（单线程策略推荐）；单个 id/数组表示过滤。
     * 使用过滤时应由某个消费点带上 STREAM_REST，避免未点名的无损流持续积压。
     * timeoutMs 省略=一直等待，0=不等待业务事件，正数=最长等待指定毫秒。
     * 宿主在每次调用（包括 timeoutMs=0）都会推进 Promise、setTimeout 和 WS/TCP 回调。
     */
    poll(streams?: StreamId | StreamId[], timeoutMs?: number): IAnyEvent | null;
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

    /** 下单：**同步**走一个 REST 往返，返回交易所订单号（回报经 orders 流回到 ctx.poll）。
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
    /** 读引擎组装的订单簿（订了 depth 频道才有；消费多慢都是最新的完整簿）。 */
    book(ex: ExRef, symbol: string, n?: number): IBook;

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
