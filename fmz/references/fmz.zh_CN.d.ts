
/** 控制台日志接口，用于输出调试信息 */
interface IConsole {
    log(...args: any[]): void;
    error(...args: any[]): void;
}

declare function setTimeout(handler: Function, timeout?: number, ...arguments: any[]): number;

declare function clearTimeout(id: number | undefined): void;

declare const console: IConsole;

/** 模板类库的域 */
declare const $: any;

/** 高精度十进制数运算，用于避免浮点数精度问题 */
declare var BigDecimal: any;

/** 高精度浮点数运算 */
declare var BigFloat: any;

// ==================== K线周期常量 ====================

/** 1分钟K线周期 */
declare const PERIOD_M1: number;
/** 3分钟K线周期 */
declare const PERIOD_M3: number;
/** 5分钟K线周期 */
declare const PERIOD_M5: number;
/** 15分钟K线周期 */
declare const PERIOD_M15: number;
/** 30分钟K线周期 */
declare const PERIOD_M30: number;
/** 1小时K线周期 */
declare const PERIOD_H1: number;
/** 2小时K线周期 */
declare const PERIOD_H2: number;
/** 4小时K线周期 */
declare const PERIOD_H4: number;
/** 6小时K线周期 */
declare const PERIOD_H6: number;
/** 12小时K线周期 */
declare const PERIOD_H12: number;
/** 1天K线周期 */
declare const PERIOD_D1: number;
/** 3天K线周期 */
declare const PERIOD_D3: number;
/** 1周K线周期 */
declare const PERIOD_W1: number;

// ==================== 订单状态常量 ====================

/** 订单未完成状态（挂单中） */
declare const ORDER_STATE_PENDING: number;
/** 订单已完成（已成交） */
declare const ORDER_STATE_CLOSED: number;
/** 订单已取消（用户取消或交易所取消） */
declare const ORDER_STATE_CANCELED: number;
/** 订单状态未知 */
declare const ORDER_STATE_UNKNOWN: number;

// ==================== 订单类型常量 ====================

/** 买单类型 */
declare const ORDER_TYPE_BUY: number;
/** 卖单类型 */
declare const ORDER_TYPE_SELL: number;

// ==================== 条件单类型常量 ====================

/** OCO条件单（One-Cancels-the-Other） */
declare const ORDER_CONDITION_TYPE_OCO: number;
/** 止盈条件单（Take Profit） */
declare const ORDER_CONDITION_TYPE_TP: number;
/** 止损条件单（Stop Loss） */
declare const ORDER_CONDITION_TYPE_SL: number;
/** 通用条件单 */
declare const ORDER_CONDITION_TYPE_GENERIC: number;

// ==================== 订单方向常量（期货） ====================

/** 开仓方向 */
declare const ORDER_OFFSET_OPEN: number;
/** 平仓方向 */
declare const ORDER_OFFSET_CLOSE: number;

// ==================== 日志类型常量 ====================

/** 买入日志类型，用于 exchange.Log() */
declare const LOG_TYPE_BUY: number;
/** 卖出日志类型，用于 exchange.Log() */
declare const LOG_TYPE_SELL: number;
/** 取消订单日志类型，用于 exchange.Log() */
declare const LOG_TYPE_CANCEL: number;

// ==================== 持仓方向常量（期货） ====================

/** 多头持仓方向 */
declare const PD_LONG: number;
/** 空头持仓方向 */
declare const PD_SHORT: number;
/** 昨日多头持仓（上期所专用） */
declare const PD_LONG_YD: number;
/** 昨日空头持仓（上期所专用） */
declare const PD_SHORT_YD: number;

// ==================== 期货操作码常量 ====================

/** 设置保证金/杠杆操作码 */
declare const FUTURES_OP_SET_MARGIN: number;
/** 设置交易方向操作码 */
declare const FUTURES_OP_SET_DIRECTION: number;
/** 设置合约类型操作码 */
declare const FUTURES_OP_SET_CONTRACT_TYPE: number;
/** 获取持仓操作码 */
declare const FUTURES_OP_GET_POSITION: number;
/** IO控制操作码，用于发送任意API请求 */
declare const EXCHANGE_OP_IO_CONTROL: number;

/**
 * 订单信息结构体，包含订单的完整信息
 *
 * ```js
 * var order = exchange.GetOrder(orderId);
 * if (order) {
 *     Log("订单价格:", order.Price, "成交量:", order.DealAmount, "状态:", order.Status);
 * }
 * ```
 */
declare interface IOrder {
    /** 交易所返回的原始订单信息（JSON对象），不同交易所格式不同 */
    Info: any;
    /** 订单ID，可能是字符串或数字，取决于交易所 */
    Id: number | string;
    /** 订单创建时间戳（毫秒） */
    Time: number;
    /** 订单委托价格 */
    Price: number;
    /** 订单委托数量 */
    Amount: number;
    /** 已成交数量 */
    DealAmount: number;
    /** 成交均价 */
    AvgPrice: number;
    /** 订单状态: ORDER_STATE_PENDING(0-未完成), ORDER_STATE_CLOSED(1-已完成), ORDER_STATE_CANCELED(2-已取消), ORDER_STATE_UNKNOWN(3-未知) */
    Status: number;
    /** 订单类型: ORDER_TYPE_BUY(0-买单), ORDER_TYPE_SELL(1-卖单) */
    Type: number;
    /** 订单开平方向（期货）: ORDER_OFFSET_OPEN(0-开仓), ORDER_OFFSET_CLOSE(1-平仓) */
    Offset?: number;
    /** 交易对符号，如 "BTC_USDT" */
    Symbol: string;
    /** 合约类型（期货），如 "swap"（永续）, "quarter"（季度）等 */
    ContractType?: string;
    /** 条件单信息（仅条件单有此字段；普通订单没有这个键，不会出现 ConditionType=-1） */
    Condition?: ICondition;
}

/**
 * 市场挂单（深度数据中的买一/卖一等），包含价格和数量
 */
declare interface IMarketOrder {
    /** 价格 */
    Price: number;
    /** 数量 */
    Amount: number;
}

/**
 * 市场深度（订单簿）数据，包含买卖盘挂单信息
 * Asks按价格从低到高排列，Bids按价格从高到低排列
 *
 * ```js
 * var depth = exchange.GetDepth();
 * if (depth) {
 *     Log("卖一价:", depth.Asks[0].Price, "买一价:", depth.Bids[0].Price);
 *     Log("买卖价差:", depth.Asks[0].Price - depth.Bids[0].Price);
 * }
 * ```
 */
declare interface IDepth {
    /** 交易所返回的原始深度数据 */
    Info: any;
    /** 时间戳（毫秒） */
    Time: number;
    /** 卖盘挂单数组，按价格从低到高排列（Asks[0]为卖一） */
    Asks: IMarketOrder[];
    /** 买盘挂单数组，按价格从高到低排列（Bids[0]为买一） */
    Bids: IMarketOrder[];
}

/**
 * 资金费率信息（永续合约）
 *
 * ```js
 * var fundings = exchange.GetFundings("BTC_USDT.swap");
 * if (fundings) {
 *     Log("资金费率:", fundings[0].Rate, "结算时间:", fundings[0].Time);
 * }
 * ```
 */
declare interface IFunding {
    /** 结算时间戳（毫秒） */
    Time: number;
    /** 资金费率，如 0.0001 表示万分之一 */
    Rate: number;
    /** 结算周期（毫秒），如 28800000 表示8小时 */
    Interval: number;
    /** 交易对符号 */
    Symbol: string;
    /** 交易所返回的原始数据 */
    Info: any;
}

/**
 * 持仓信息结构体（期货）
 *
 * ```js
 * var positions = exchange.GetPositions("BTC_USDT.swap");
 * if (positions) {
 *     for (var pos of positions) {
 *         Log("方向:", pos.Type == PD_LONG ? "多" : "空",
 *             "数量:", pos.Amount, "均价:", pos.Price, "盈亏:", pos.Profit);
 *     }
 * }
 * ```
 */
declare interface IPosition {
    /** 交易所返回的原始持仓数据 */
    Info: any;
    /** 杠杆倍数 */
    MarginLevel: number;
    /** 持仓数量 */
    Amount: number;
    /** 冻结数量（平仓挂单中的仓位） */
    FrozenAmount: number;
    /** 持仓均价 */
    Price: number;
    /** 持仓浮动盈亏 */
    Profit: number;
    /** 持仓方向: PD_LONG(0-多头), PD_SHORT(1-空头), PD_LONG_YD(2-昨日多头), PD_SHORT_YD(3-昨日空头) */
    Type: number;
    /** 交易对符号 */
    Symbol: string;
    /** 合约类型，如 "swap"、"quarter" */
    ContractType: string;
    /** 保证金 */
    Margin: number;
}

/**
 * 最近成交记录
 *
 * ```js
 * var trades = exchange.GetTrades();
 * if (trades) {
 *     Log("最新成交价:", trades[trades.length - 1].Price,
 *         "成交量:", trades[trades.length - 1].Amount);
 * }
 * ```
 */
declare interface ITrade {
    /** 成交记录ID */
    Id: number | string;
    /** 成交时间戳（毫秒） */
    Time: number;
    /** 成交价格 */
    Price: number;
    /** 成交数量 */
    Amount: number;
    /** 成交类型: ORDER_TYPE_BUY(0-买入), ORDER_TYPE_SELL(1-卖出) */
    Type: number;
}

/**
 * 行情Ticker数据，包含当前市场快照信息
 *
 * ```js
 * var ticker = exchange.GetTicker();
 * if (ticker) {
 *     Log("最新价:", ticker.Last, "买一:", ticker.Buy, "卖一:", ticker.Sell);
 *     Log("24h最高:", ticker.High, "24h最低:", ticker.Low, "24h成交量:", ticker.Volume);
 * }
 * ```
 */
declare interface ITicker {
    /** 时间戳（毫秒） */
    Time: number;
    /** 交易对符号 */
    Symbol: string;
    /** 周期开盘价，交易所接口未提供24小时滚动周期开盘价时使用当前价格填充 */
    Open: number;
    /** 24小时最高价 */
    High: number;
    /** 24小时最低价 */
    Low: number;
    /** 卖一价（最优卖价） */
    Sell: number;
    /** 买一价（最优买价） */
    Buy: number;
    /** 最新成交价 */
    Last: number;
    /** 24小时成交量 */
    Volume: number;
    /** 持仓量（期货），大部分交易所接口不提供该数据，不支持时值为 0 */
    OpenInterest: number;
    /** 交易所返回的原始Ticker数据 */
    Info: any;
}

/**
 * 账户信息结构体（现货）
 * 对于期货账户（CTP等），会返回包含 Equity（权益）和 UPnL（未实现盈亏）的扩展结构
 *
 * ```js
 * var account = exchange.GetAccount();
 * if (account) {
 *     Log("计价币余额:", account.Balance, "冻结:", account.FrozenBalance);
 *     Log("交易币余额:", account.Stocks, "冻结:", account.FrozenStocks);
 * }
 * ```
 */
declare interface IAccount {
    /** 交易所返回的原始账户数据 */
    Info: any;
    /** 计价币余额（如 USDT），对于期货指可用保证金 */
    Balance: number;
    /** 冻结的计价币余额 */
    FrozenBalance: number;
    /** 交易币余额（如 BTC），对于期货指可用保证金对应的币 */
    Stocks: number;
    /** 冻结的交易币余额 */
    FrozenStocks: number;
    /** 权益（期货），包括未实现盈亏的总账户价值 */
    Equity: number;
    /** 未实现盈亏（期货），不支持时值为 0 */
    UPnL: number;
}

/**
 * 资产信息，表示账户中某种币种的持有量
 *
 * ```js
 * var assets = exchange.GetAssets();
 * if (assets) {
 *     for (var asset of assets) {
 *         Log("币种:", asset.Currency, "可用:", asset.Amount, "冻结:", asset.FrozenAmount);
 *     }
 * }
 * ```
 */
declare interface IAsset {
    /** 币种名称，如 "BTC", "USDT" */
    Currency : string;
    /** 可用数量 */
    Amount: number;
    /** 冻结数量 */
    FrozenAmount: number;
}

/**
 * K线（蜡烛图）数据结构，包含OHLCV信息
 *
 * ```js
 * var records = exchange.GetRecords(PERIOD_H1);
 * if (records) {
 *     var last = records[records.length - 1];
 *     Log("最新K线 - 开:", last.Open, "高:", last.High, "低:", last.Low, "收:", last.Close);
 * }
 * ```
 */
declare interface IRecord {
    /** K线时间戳（毫秒），表示该K线柱的起始时间 */
    Time: number;
    /** 开盘价 */
    Open: number;
    /** 最高价 */
    High: number;
    /** 最低价 */
    Low: number;
    /** 收盘价 */
    Close: number;
    /** 成交量 */
    Volume: number;
    /** 持仓量（期货），大部分交易所接口不提供该数据，不支持时值为 0 */
    OpenInterest?: number;
}

/**
 * 市场/交易对信息，描述交易对的精度、限制等元数据
 * 通过 exchange.GetMarkets() 获取所有交易对的市场信息
 *
 * ```js
 * var markets = exchange.GetMarkets();
 * if (markets) {
 *     var btc = markets["BTC_USDT"];
 *     if (btc) {
 *         Log("价格精度:", btc.PricePrecision, "数量精度:", btc.AmountPrecision);
 *         Log("最小下单量:", btc.MinQty, "最小下单金额:", btc.MinNotional);
 *     }
 * }
 * ```
 */
declare interface IMarket {
    /** 交易对符号，如 "BTC_USDT"，期货为 "BTC_USDT.swap" */
    Symbol: string;
    /** 基础货币（交易货币），如 "BTC" */
    BaseAsset: string;
    /** 计价货币，如 "USDT" */
    QuoteAsset: string;
    /** 价格最小变动单位（tick），如 0.01 */
    TickSize?: number;
    /** 数量最小变动单位，如 0.001 */
    AmountSize?: number;
    /** 价格小数位精度，如 2 表示精确到小数点后2位 */
    PricePrecision?: number;
    /** 数量小数位精度，如 3 表示精确到小数点后3位 */
    AmountPrecision?: number;
    /** 最小下单数量 */
    MinQty?: number;
    /** 最大下单数量 */
    MaxQty?: number;
    /** 最小下单金额（名义价值） */
    MinNotional?: number;
    /** 最大下单金额（名义价值） */
    MaxNotional?: number;
    /** 合约面值（期货），如 0.01 表示一张合约代表0.01个币 */
    CtVal?: number;
    /** 合约面值计价币种（期货），如 "BTC", "USD" */
    CtValCcy?: string;
    /** 交易所返回的原始市场信息 */
    Info?: any;
}

/**
 * 并发调用返回的 Go 对象，用于异步获取结果
 * 通过 exchange.Go() 创建，调用 wait() 等待结果返回
 *
 * ```js
 * // 并发获取行情和深度
 * var goTicker = exchange.Go("GetTicker");
 * var goDepth = exchange.Go("GetDepth");
 * var ticker = goTicker.wait();  // 等待ticker返回
 * var depth = goDepth.wait();    // 等待depth返回
 * ```
 */
interface IGo {
    /**
     * 等待并发任务完成并返回结果
     * @param timeoutMs - 超时时间（毫秒）。
     *   - 不传或传0: 阻塞等待直到返回结果
     *   - 传正数: 等待指定毫秒数，超时返回 undefined
     *   - 传负数(-1): 立即返回，无结果则返回 undefined
     * @returns 对应函数的返回值，失败返回 null，超时返回 undefined。
     *   超时不消费任务，可继续 wait；结果取走后再 wait 抛 "routine N already finished"
     * ```js
     * var go1 = exchange.Go("GetTicker");
     * var ticker = go1.wait(2000);   // 最多等2秒
     * var go2 = exchange.Go("GetDepth");
     * var depth = go2.wait();         // 一直等到返回
     * ```
     */
    wait(timeoutMs?: number): any;
}

// ==================== 交易所接口 ====================

/**
 * 交易所操作接口，封装了所有交易所API调用方法
 * 通过全局变量 `exchange`（第一个交易所）或 `exchanges[i]`（第i个交易所）使用
 *
 * ```js
 * // 获取行情
 * var ticker = exchange.GetTicker();
 * // 下买单
 * var orderId = exchange.Buy(ticker.Sell, 0.1);
 * // 查询订单
 * var order = exchange.GetOrder(orderId);
 * ```
 */
interface IExchange {
    /**
     * 创建并发任务，异步调用交易所方法。不会阻塞当前代码执行，
     * 调用返回的 IGo 对象的 wait() 方法获取结果。
     * 可同时发起多个并发请求以提高效率。
     * @param method - 要调用的方法名，如 "GetTicker", "GetDepth", "GetAccount", "GetRecords", "Buy", "Sell" 等
     * @param args - 传递给方法的参数，与直接调用该方法时的参数一致
     * @returns IGo 对象，调用其 wait() 方法获取结果
     * ```js
     * // 并发获取多个交易对的行情
     * var goTicker1 = exchange.Go("GetTicker", "BTC_USDT");
     * var goTicker2 = exchange.Go("GetTicker", "ETH_USDT");
     * var goAccount = exchange.Go("GetAccount");
     * var ticker1 = goTicker1.wait();
     * var ticker2 = goTicker2.wait();
     * var account = goAccount.wait();
     * // 并发下单
     * var goBuy = exchange.Go("Buy", 50000, 0.1);
     * var goSell = exchange.Go("Sell", 60000, 0.1);
     * var buyId = goBuy.wait();
     * var sellId = goSell.wait();
     * ```
     */
    Go(method: string, ...args: any[]): IGo;

    /**
     * 获取当前持仓列表（期货）
     * @param symbol - 交易对符号，如 "BTC_USDT.swap"。不传则返回所有持仓
     * @returns 持仓数组，失败返回 null。无持仓时返回空数组 []
     * ```js
     * var positions = exchange.GetPositions("BTC_USDT.swap");
     * if (positions && positions.length > 0) {
     *     Log("持仓数量:", positions[0].Amount, "方向:", positions[0].Type);
     * }
     * ```
     */
    GetPositions(symbol?: string): IPosition[] | null;

    /**
     * 获取当前设置的合约类型（期货）
     * @returns 当前合约类型字符串，如 "swap"（永续）、"quarter"（季度）、"this_week"（当周）等
     * ```js
     * Log("当前合约:", exchange.GetContractType()); // "swap"
     * ```
     */
    GetContractType(): string;

    /**
     * 设置合约类型（期货），调用交易接口前必须先设置
     * @param symbol - 合约类型:
     *   - "swap": 永续合约
     *   - "quarter": 季度合约
     *   - "next_quarter": 次季度合约
     *   - "this_week": 当周合约
     *   - "next_week": 次周合约
     *   - 也可以直接传合约ID，如 "BTC-USD-200925"
     * @returns 设置结果
     * ```js
     * exchange.SetContractType("swap");      // 设置为永续合约
     * exchange.SetContractType("quarter");   // 设置为季度合约
     * ```
     */
    SetContractType(symbol: string): any;

    /**
     * 设置杠杆倍数（期货）
     * @param num - 杠杆倍数，如 10 表示10倍杠杆
     * ```js
     * exchange.SetMarginLevel(10);  // 设置10倍杠杆
     * ```
     */
    SetMarginLevel(num: number): void;
    /**
     * 设置指定交易对的杠杆倍数（期货）
     * @param symbol - 交易对符号，如 "BTC_USDT.swap"
     * @param num - 杠杆倍数
     * ```js
     * exchange.SetMarginLevel("BTC_USDT.swap", 20);
     * ```
     */
    SetMarginLevel(symbol: string, num: number): void;

    /**
     * 设置期货交易方向，下单前必须设置。
     *
     * 不推荐：优先用 `CreateOrder`，可直接指定 side，无需先调用 `SetDirection`。
     * @param s - 交易方向:
     *   - "buy": 买入开多
     *   - "sell": 卖出开空
     *   - "closebuy": 卖出平多
     *   - "closesell": 买入平空
     * ```js
     * exchange.SetDirection("buy");      // 开多
     * exchange.Buy(50000, 1);            // 以50000价格开多1张
     * exchange.SetDirection("closebuy"); // 平多
     * exchange.Sell(51000, 1);           // 以51000价格平多1张
     * ```
     */
    SetDirection(s: string): void;

    /**
     * 取消指定订单
     * @param orderId - 要取消的订单ID
     * @param extra - 附加日志信息，会显示在日志中
     * @returns 取消成功返回 true，失败返回 false
     * ```js
     * var id = exchange.Buy(50000, 0.1);
     * if (id) {
     *     exchange.CancelOrder(id, "取消测试订单");
     * }
     * ```
     */
    CancelOrder(orderId: any, ...extra: any[]): boolean;

    /**
     * 根据订单ID查询订单详情
     * @param orderId - 订单ID
     * @returns 订单信息对象，失败返回 null
     * ```js
     * var order = exchange.GetOrder(orderId);
     * if (order) {
     *     Log("状态:", order.Status, "成交量:", order.DealAmount);
     * }
     * ```
     */
    GetOrder(orderId: any): IOrder | null;

    /**
     * 获取当前未完成的挂单列表
     * @param symbol - 交易对符号。不传则使用当前设置的交易对
     * @returns 未完成订单数组（空数组表示无挂单），失败返回 null
     * ```js
     * var orders = exchange.GetOrders("BTC_USDT");
     * Log("当前挂单数:", orders.length);
     * ```
     */
    GetOrders(symbol?: string): IOrder[];

    /**
     * 获取历史订单（已完成/已取消）
     * 支持无参调用（查询当前交易对），也支持省略 symbol 直接传 since：GetHistoryOrders(since, limit)
     * @param symbol - 交易对符号，不传则使用当前设置的交易对；也可直接传起始时间戳（毫秒）
     * @param since - 起始时间戳（毫秒），不传默认获取最近的
     * @param limit - 返回数量上限
     * @returns 历史订单数组
     * ```js
     * var orders = exchange.GetHistoryOrders();                    // 当前交易对
     * var orders = exchange.GetHistoryOrders("BTC_USDT", 0, 100);  // 指定交易对
     * Log("历史订单数:", orders.length);
     * ```
     */
    GetHistoryOrders(symbol?: string | number, since?: number, limit?: number): IOrder[];

    /**
     * 记录模拟交易日志（不实际下单），用于虚拟交易或信号标记
     * @param orderType - 日志类型: LOG_TYPE_BUY(0), LOG_TYPE_SELL(1), LOG_TYPE_CANCEL(2)
     * @param price - 价格（取消订单时为订单ID）
     * @param amount - 数量（LOG_TYPE_CANCEL 时可省略）
     * @param args - 附加日志信息
     * ```js
     * exchange.Log(LOG_TYPE_BUY, 50000, 0.1, "模拟买入信号");
     * exchange.Log(LOG_TYPE_SELL, 51000, 0.1, "模拟卖出信号");
     * exchange.Log(LOG_TYPE_CANCEL, orderId);  // 取消订单日志
     * ```
     */
    Log(orderType: number, price: number, amount?: number, ...args: any[]): void;

    /**
     * 卖出下单（现货卖出/期货按当前方向下卖单）
     * @param price - 卖出价格，传 -1 为市价单
     * @param amount - 卖出数量
     * @param extra - 附加日志信息
     * @returns 订单ID（字符串或数字），失败返回 null
     * ```js
     * // 限价卖出
     * var id = exchange.Sell(51000, 0.1, "限价卖出");
     * // 市价卖出
     * var id = exchange.Sell(-1, 0.1, "市价卖出");
     * ```
     */
    Sell(price: number, amount: number, ...extra: any[]): string | number | null;

    /**
     * 买入下单（现货买入/期货按当前方向下买单）
     * @param price - 买入价格，传 -1 为市价单
     * @param amount - 买入数量
     * @param extra - 附加日志信息
     * @returns 订单ID（字符串或数字），失败返回 null
     * ```js
     * // 限价买入
     * var id = exchange.Buy(50000, 0.1, "限价买入");
     * // 市价买入
     * var id = exchange.Buy(-1, 0.1, "市价买入");
     * ```
     */
    Buy(price: number, amount: number, ...extra: any[]): string | number | null;

    /**
     * 通用下单函数，支持指定交易对和方向，无需预先 SetDirection
     * side 参数可附带选项，用分号分隔，如 "buy;{\"timeInForce\":\"GTC\"}"
     * @param symbol - 交易对符号，如 "BTC_USDT"（现货）或 "BTC_USDT.swap"（期货）
     * @param side - 订单方向: "buy"(买入), "sell"(卖出), "closebuy"(平多), "closesell"(平空)
     * @param price - 价格，传 -1 为市价单
     * @param amount - 数量
     * @param extra - 附加日志信息
     * @returns 订单ID，失败返回 null
     * ```js
     * // 现货买入
     * exchange.CreateOrder("ETH_USDT", "buy", -1, 1);
     * // 期货开多
     * exchange.CreateOrder("BTC_USDT.swap", "buy", 50000, 1);
     * // 期货平多
     * exchange.CreateOrder("BTC_USDT.swap", "closebuy", -1, 1);
     * ```
     */
    CreateOrder(symbol: string, side: string, price: number, amount: number, ...extra: any[]): string | number | null;

    /**
     * 修改已有订单的价格和数量
     * @param orderId - 要修改的订单ID。期货可能为 "symbol,orderId" 格式
     * @param side - 订单方向
     * @param price - 新价格
     * @param amount - 新数量
     * @param extra - 附加日志信息
     * @returns 更新后的订单ID，失败返回 null
     * ```js
     * var newId = exchange.ModifyOrder(orderId, "buy", 49000, 0.2);
     * ```
     */
    ModifyOrder(orderId: any, side: string, price: number, amount: number, ...extra: any[]): string | number | null;

    /**
     * 获取最近一次REST API请求返回的原始JSON字符串，用于调试
     * @returns 原始JSON字符串
     * ```js
     * exchange.GetTicker();
     * var raw = exchange.GetRawJSON();
     * Log("原始返回:", raw);
     * ```
     */
    GetRawJSON(): any;

    /**
     * 创建条件单（止盈止损等）
     * @param symbol - 交易对符号
     * @param side - 订单方向: "buy", "sell", "closebuy", "closesell"
     * @param amount - 数量
     * @param condition - 条件参数，包含触发价格等
     * @param extra - 附加日志信息
     * @returns 条件单ID，失败返回 null
     * ```js
     * // 创建止盈条件单
     * exchange.CreateConditionOrder("BTC_USDT.swap", "closebuy", 1, {
     *     ConditionType: ORDER_CONDITION_TYPE_TP,
     *     TpTriggerPrice: 55000,
     *     TpOrderPrice: 54900
     * });
     * ```
     */
    CreateConditionOrder(symbol: string, side: string, amount: number, condition: ICondition, ...extra: any[]): string | number | null;

    /**
     * 修改已有的条件单
     * @param orderId - 条件单ID
     * @param side - 订单方向
     * @param amount - 新数量
     * @param condition - 新条件参数
     * @param extra - 附加日志信息
     * @returns 更新后的条件单ID，失败返回 null
     */
    ModifyConditionOrder(orderId: any, side: string, amount: number, condition: ICondition, ...extra: any[]): string | number | null;

    /**
     * 获取当前未触发的条件单列表
     * @param symbol - 交易对符号，不传则返回所有
     * @returns 条件单数组
     */
    GetConditionOrders(symbol?: string): IOrder[];

    /**
     * 根据ID查询条件单详情
     * @param orderId - 条件单ID
     * @returns 条件单信息，失败返回 null
     */
    GetConditionOrder(orderId: any): IOrder | null;

    /**
     * 取消指定条件单
     * @param orderId - 条件单ID
     * @param extra - 附加日志信息
     * @returns 取消成功返回 true，失败返回 false
     */
    CancelConditionOrder(orderId: any, ...extra: any[]): boolean;

    /**
     * 获取历史条件单列表
     * 支持省略 symbol 直接传 since：GetHistoryConditionOrders(since, limit)
     * @param symbol - 交易对符号；也可直接传起始时间戳（毫秒）
     * @param since - 起始时间戳（毫秒）
     * @param limit - 返回数量上限
     * @returns 历史条件单数组
     */
    GetHistoryConditionOrders(symbol?: string | number, since?: number, limit?: number): IOrder[];

    /**
     * 获取账户信息（余额、冻结等）
     * @returns 账户信息对象，失败返回 null
     * ```js
     * var account = exchange.GetAccount();
     * if (account) {
     *     Log("余额:", account.Balance, "冻结:", account.FrozenBalance);
     * }
     * ```
     */
    GetAccount(): IAccount | null;

    /**
     * 获取K线数据
     * @param symbol - 交易对符号，不传使用当前设置的交易对；也可省略 symbol 直接传K线周期（秒）
     * @param period - K线周期（秒），如 PERIOD_M1, PERIOD_H1 等。不传使用创建机器人时设置的默认周期
     * @param limit - 返回K线数量上限
     * @returns K线数据数组（按时间升序），失败返回 null
     * ```js
     * // 获取当前交易对的1小时K线
     * var records = exchange.GetRecords(PERIOD_H1);
     * // 获取指定交易对的5分钟K线，最多100根
     * var records = exchange.GetRecords("ETH_USDT", PERIOD_M5, 100);
     * // 传给talib做技术分析
     * var macd = talib.MACD(records);
     * ```
     */
    GetRecords(symbol?: string | number, period?: number, limit?: number): IRecord[] | null;

    /**
     * 设置K线最大缓存长度（默认200根）
     * @param n - 最大K线柱数量
     * ```js
     * exchange.SetMaxBarLen(500);  // 缓存最多500根K线
     * ```
     */
    SetMaxBarLen(n: number): void;

    /**
     * 获取最近成交记录
     * @param symbol - 交易对符号，不传使用当前设置的交易对
     * @returns 成交记录数组（按时间升序），失败返回 null
     * ```js
     * var trades = exchange.GetTrades();
     * if (trades && trades.length > 0) {
     *     Log("最新成交:", trades[trades.length - 1].Price);
     * }
     * ```
     */
    GetTrades(symbol?: string): ITrade[] | null;

    /**
     * 获取当前行情Ticker
     * @param symbol - 交易对符号，不传使用当前设置的交易对
     * @returns Ticker数据，失败返回 null
     * ```js
     * var ticker = exchange.GetTicker("BTC_USDT");
     * if (ticker) Log("BTC最新价:", ticker.Last);
     * ```
     */
    GetTicker(symbol?: string): ITicker | null;

    /**
     * 获取资金费率（永续合约）
     * @param symbol - 交易对符号
     * @returns 资金费率数组，失败返回 null
     * ```js
     * var fundings = exchange.GetFundings("BTC_USDT.swap");
     * ```
     */
    GetFundings(symbol?: string): IFunding[] | null;

    /**
     * 获取所有交易对的Ticker行情（批量获取）
     * @returns 所有交易对的Ticker数组，失败返回 null
     * ```js
     * var tickers = exchange.GetTickers();
     * if (tickers) {
     *     for (var t of tickers) {
     *         if (t.Symbol === "BTC_USDT") Log("BTC:", t.Last);
     *     }
     * }
     * ```
     */
    GetTickers(): ITicker[] | null;

    /**
     * 获取市场深度（订单簿），Asks从低到高，Bids从高到低
     * @param symbol - 交易对符号，不传使用当前设置的交易对
     * @returns 深度数据，失败返回 null
     * ```js
     * var depth = exchange.GetDepth("BTC_USDT");
     * if (depth) {
     *     Log("卖一:", depth.Asks[0].Price, "买一:", depth.Bids[0].Price);
     * }
     * ```
     */
    GetDepth(symbol?: string): IDepth | null;

    /**
     * 获取基础货币名称
     * @returns 基础货币，如 "BTC"
     * ```js
     * Log(exchange.GetBaseCurrency());  // "BTC"
     * ```
     */
    GetBaseCurrency(): string;

    /**
     * 获取计价货币名称
     * @returns 计价货币，如 "USDT"
     * ```js
     * Log(exchange.GetQuoteCurrency());  // "USDT"
     * ```
     */
    GetQuoteCurrency(): string;

    /**
     * 设置代理服务器地址
     * @param proxy - 代理地址，支持的格式:
     *   - "socks5://user:pass@host:port" — SOCKS5代理
     *   - "http://host:port" — HTTP代理
     *   - "" — 清除代理设置
     * ```js
     * exchange.SetProxy("socks5://127.0.0.1:1080");
     * exchange.SetProxy("");  // 取消代理
     * ```
     */
    SetProxy(proxy: string): void;

    /**
     * 设置价格和数量的小数精度，下单时自动截断到指定位数
     * @param pricePrecision - 价格小数位数
     * @param amountPrecision - 数量小数位数
     * ```js
     * exchange.SetPrecision(2, 4);  // 价格2位，数量4位
     * ```
     */
    SetPrecision(pricePrecision: number, amountPrecision: number): void;

    /**
     * 发送任意API请求（IO控制），用于调用交易所未封装的API接口
     * @param k - 请求路径或控制指令:
     *   - API路径: 如 "/api/v5/account/balance"
     *   - "api": 通用API调用
     *   - "currency": 切换交易对
     *   - "base": 切换API基础地址
     *   - 其他自定义IO指令
     * @param args - 请求参数
     * @returns API返回结果（已解析为对象）
     * ```js
     * // 直接调用交易所API
     * var ret = exchange.IO("api", "GET", "/api/v5/account/balance");
     * // 切换交易对
     * exchange.IO("currency", "ETH_USDT");
     * // 国内期货柜台（CTP）：直发柜台请求，请求名以 Req 开头。等应答时返回
     * // [[{Name: 柜台结构名, Value: 行}, …]]（外层恒 1 项，空结果 [[]]）；第三参 false
     * // 表示不等应答，返回 ""；柜台拒绝返回 null（GetLastError 可读）
     * var products = exchange.IO("api", "ReqQryProduct", {});
     * if (products) for (var row of products[0]) Log(row.Name, row.Value.ProductID);
     * ```
     */
    /**
     * 国内期货柜台（CTP 等）：等当前合约的下一跳行情，或本交易所的下一条订单回报——
     * 两者取先到的（与旧 waitEvent 同时监听 tick/order 两条队列一致）
     * @param timeoutMs - 超时毫秒数；0 或不传 = 默认等待；负数 = 不等待，只看当下有没有
     * @returns 事件消息：行情跳 `Event: "tick"`（`Ticker` 为 ITicker 形状，`Symbol` 为合约名）；
     *   订单回报 `Event: "order"`（`Order` 为 IOrder 形状；回报本身不带方向时没有 Type 字段，
     *   下过单的订单按订单号合并下单时的 Type/Offset）；超时没等到返回 null
     * ```js
     * var e = exchange.IO("wait", 5000);
     * if (e && e.Event == "tick") Log(e.Symbol, e.Ticker.Last);
     * if (e && e.Event == "order") Log(e.Order.Id, e.Order.Status, e.Order.DealAmount);
     * ```
     */
    IO(k: "wait", timeoutMs?: number): IEventMsg | null;
    IO(k: string, ...args: any[]): any;

    /**
     * 设置REST API请求超时时间
     * @param timeoutMs - 超时时间（毫秒）
     * ```js
     * exchange.SetTimeout(10000);  // 设置10秒超时
     * ```
     */
    SetTimeout(timeoutMs: number): void;

    /**
     * 设置交易所API基础地址，用于切换到备用域名或测试网
     * @param s - API基础URL
     * ```js
     * exchange.SetBase("https://testnet.binance.vision");  // 切换到测试网
     * ```
     */
    SetBase(s: string): void;

    /**
     * 获取当前API基础地址
     * @returns API基础URL字符串
     */
    GetBase(): string;

    /**
     * 切换当前交易对
     * @param s - 交易对字符串，如 "BTC_USDT", "ETH_BTC"
     * ```js
     * exchange.SetCurrency("ETH_USDT");
     * Log(exchange.GetTicker());  // 获取ETH行情
     * ```
     */
    SetCurrency(s: string): void;

    /**
     * 设置汇率转换，所有价格会自动乘以此汇率
     * @param n - 汇率值，1表示不转换
     * ```js
     * exchange.SetRate(6.5);  // 价格转换为人民币显示
     * exchange.SetRate(1);    // 取消汇率转换
     * ```
     */
    SetRate(n: number): void;

    /**
     * 获取当前设置的汇率值
     * @returns 汇率值，默认为 1
     */
    GetRate(): number;

    /**
     * 获取美元兑人民币汇率
     * @returns USD/CNY 汇率
     */
    GetUSDCNY(): number;

    /**
     * 获取交易所自定义标签名（在FMZ平台配置交易所时设置）
     * @returns 标签字符串
     * ```js
     * Log(exchange.GetLabel());  // "我的币安账户"
     * ```
     */
    GetLabel(): string;

    /**
     * 获取当前交易对名称
     * @returns 交易对字符串，如 "BTC_USDT"
     * ```js
     * Log(exchange.GetCurrency());  // "BTC_USDT"
     * ```
     */
    GetCurrency(): string;

    /**
     * 获取当前设置的K线周期
     * @returns K线周期（秒）
     * ```js
     * Log(exchange.GetPeriod());  // 3600 (1小时)
     * ```
     */
    GetPeriod(): number;

    /**
     * 获取交易所名称
     * @returns 交易所平台名称，如 "Binance", "OKX", "Futures_Binance"
     * ```js
     * Log(exchange.GetName());  // "Binance"
     * ```
     */
    GetName(): string;

    /**
     * 获取所有交易对的市场信息（精度、限制等），key为交易对符号
     * @returns 市场信息字典，key为交易对（如 "BTC_USDT"），value为 IMarket 对象。失败返回 null
     * ```js
     * var markets = exchange.GetMarkets();
     * if (markets) {
     *     var m = markets["BTC_USDT"];
     *     Log("BTC最小下单量:", m.MinQty, "价格精度:", m.PricePrecision);
     * }
     * ```
     */
    GetMarkets(): { [key: string]: IMarket }|null;

    /**
     * 获取账户所有资产信息
     * @returns 资产数组，每个元素包含币种、可用量、冻结量。失败返回 null
     * ```js
     * var assets = exchange.GetAssets();
     * if (assets) {
     *     for (var a of assets) Log(a.Currency, "可用:", a.Amount);
     * }
     * ```
     */
    GetAssets(): IAsset[]|null;

    /**
     * 写入数据集合，供 exchange.GetData() 读取（常用于回测时加载自定义数据）
     * @param key - 数据集合名称
     * @param value - 数据内容，格式为 [[时间戳, 数据], ...] 的数组（非字符串会自动JSON序列化）
     * @returns 数据JSON编码后的字符串长度
     * ```js
     * exchange.SetData("test", [[1579536000000, 123], [1579622400000, 456]]);
     * Log(exchange.GetData("test"));  // 随时间推进返回对应时间戳的数据
     * ```
     */
    SetData(key: string, value: any): number;

    /**
     * 获取 exchange.SetData() 写入的数据集合或外部链接提供的数据
     * 回测时一次性获取数据；实盘时 http/https 链接由本机同步拉取（HttpQuery），响应须是
     * `[[time, data], …]` 或 `{Schema: ["time", "data"], Data: [[…]]}`，按 timeout 缓存、过期重拉；
     * SetData 写入的本地集合不过期。`ext.` 前缀的服务端数据源需要服务端下发映射，当前运行时不可用
     * @param key - 数据集合名称或请求链接（http/https URL）
     * @param timeout - 缓存超时时间（毫秒），下限 5 秒
     * @param offset - 取 time <= offset 的最后一行；0 或不传 = 当前时间
     * @returns `{Time, Data}`：命中的记录；没有记录、拉取失败或数据源不可用时 `Data` 为 null
     *   （`Time` 为 offset），并可用 GetLastError() 读原因——任何情况都返回对象，不返回 null
     * ```js
     * var data = exchange.GetData("test");
     * var extern = exchange.GetData("https://www.example.com/data.json");
     * if (extern.Data === null) Log("no data:", GetLastError());
     * ```
     */
    GetData(key: string, timeout?: number, offset?: number): any;

    /**
     * 签名加密计算（成员函数版本，仅实盘支持）
     * 与全局 Encode() 类似，但 key 参数支持 "{{accesskey}}"、"{{secretkey}}" 模板，
     * 引用当前交易所对象配置的 AccessKey/SecretKey，避免在代码中泄露密钥
     * @param algo - 算法名称: "raw", "sign", "signTx", "md4", "md5", "sha256", "sha512", "sha1", "keccak256", "ed25519" 等
     * @param inputFormat - 输入数据格式: "hex", "base64", "raw", "string"
     * @param outputFormat - 输出数据格式: "hex", "base64", "raw", "string"
     * @param data - 要处理的数据
     * @param keyFormat - 密钥格式: "hex", "base64", "raw", "string"
     * @param key - 密钥，支持明文或 "{{accesskey}}"、"{{secretkey}}" 模板
     * @returns 计算出的哈希/编码值
     * ```js
     * var sign = exchange.Encode("sha256", "string", "hex", "data", "string", "{{secretkey}}");
     * ```
     */
    Encode(algo: string, inputFormat: "hex" | "base64" | "raw" | "string", outputFormat: "hex" | "base64" | "raw" | "string", data: string | ArrayBuffer, keyFormat?: string, key?: string): string | ArrayBuffer;

    /**
     * 读取当前交易所对象的配置字段（仅实盘支持）
     * 键名不区分大小写与下划线/横线：GetMeta("AccessKey") 与 GetMeta("access_key") 等价。
     * 只返回**非敏感**字段；SecretKey/Password/Passphrase/PrivateKey 这类字段以及服务端
     * 加密下发的字段一律返回空串。字段不存在也返回空串。
     * @param key - 配置字段名（如 "AccessKey"、"Simulate"、"BrokerId"）
     * @returns 字段值的字符串形式（布尔/数字转成文本），没有或敏感时为 ""
     * ```js
     * var ak = exchange.GetMeta("AccessKey");
     * ```
     */
    GetMeta(key: string): string;
    /**
     * HMAC 签名（成员函数版本，仅实盘支持）：等价于 exchange.Encode(algo, "raw", outputFormat, data, "raw", key)，
     * key/data 同样支持 "{{accesskey}}"、"{{secretkey}}" 模板。
     * @param algo - 如 "hmac_sha256"、"hmac_sha512"、"hmac_md5"
     * @param outputFormat - "hex" | "base64" | "raw" | "string"
     * @param data - 待签名数据
     * @param key - 密钥，可写 "{{secretkey}}"
     */
    HMAC(algo: string, outputFormat: "hex" | "base64" | "raw" | "string", data: string, key?: string): string;
}

// ==================== TA-Lib 技术分析库接口 ====================
/**
 * TA-Lib 技术分析库，包含 100+ 技术指标函数
 * 通过全局变量 `talib` 访问
 *
 * 输入数据类型说明:
 * - `inReal: number[] | IRecord[]` — 可传入收盘价数组或K线数组（自动取Close字段）
 * - `inPriceHLC: IRecord[]` — 需要 High/Low/Close 的K线数组
 * - `inPriceHL: IRecord[]` — 需要 High/Low 的K线数组
 * - `inPriceOHLC: IRecord[]` — 需要 Open/High/Low/Close 的K线数组
 * - `inPriceHLCV: IRecord[]` — 需要 High/Low/Close/Volume 的K线数组
 *
 * optInMAType 移动平均类型参数:
 * - 0=SMA, 1=EMA, 2=WMA, 3=DEMA, 4=TEMA, 5=TRIMA, 6=KAMA, 7=MAMA, 8=T3
 *
 * ```js
 * var records = exchange.GetRecords(PERIOD_H1);
 * // 计算MACD
 * var [dif, dea, macd] = talib.MACD(records, 12, 26, 9);
 * // 计算布林带
 * var [upper, middle, lower] = talib.BBANDS(records, 20, 2, 2);
 * // 计算RSI
 * var rsi = talib.RSI(records, 14);
 * Log("RSI:", rsi[rsi.length - 1]);
 * ```
 */
interface Italib {
    // ==================== 移动平均类指标 ====================

    /**
     * WMA - 加权移动平均线 (Weighted Moving Average)
     * @param inReal - 输入数据（收盘价数组或K线数组）
     * @param optInTimePeriod - 计算周期，默认 30
     * @returns 加权移动平均值数组
     * ```js
     * var wma = talib.WMA(records, 10);
     * ```
     */
    WMA(inReal: number[] | IRecord[], optInTimePeriod?: number): number[];

    /**
     * SMA - 简单移动平均线 (Simple Moving Average)
     * @param inReal - 输入数据（收盘价数组或K线数组）
     * @param optInTimePeriod - 计算周期，默认 30
     * @returns 简单移动平均值数组
     * ```js
     * var ma5 = talib.SMA(records, 5);
     * var ma20 = talib.SMA(records, 20);
     * ```
     */
    SMA(inReal: number[] | IRecord[], optInTimePeriod?: number): number[];

    /**
     * EMA - 指数移动平均线 (Exponential Moving Average)
     * @param inReal - 输入数据（收盘价数组或K线数组）
     * @param optInTimePeriod - 计算周期，默认 30
     * @returns 指数移动平均值数组
     * ```js
     * var ema12 = talib.EMA(records, 12);
     * var ema26 = talib.EMA(records, 26);
     * ```
     */
    EMA(inReal: number[] | IRecord[], optInTimePeriod?: number): number[];

    /**
     * DEMA - 双重指数移动平均线 (Double Exponential Moving Average)
     * @param inReal - 输入数据
     * @param optInTimePeriod - 计算周期，默认 30
     * @returns DEMA数组
     */
    DEMA(inReal: number[] | IRecord[], optInTimePeriod?: number): number[];

    /**
     * TEMA - 三重指数移动平均线 (Triple Exponential Moving Average)
     * @param inReal - 输入数据
     * @param optInTimePeriod - 计算周期，默认 30
     * @returns TEMA数组
     */
    TEMA(inReal: number[] | IRecord[], optInTimePeriod?: number): number[];

    /**
     * TRIMA - 三角移动平均线 (Triangular Moving Average)
     * @param inReal - 输入数据
     * @param optInTimePeriod - 计算周期，默认 30
     * @returns TRIMA数组
     */
    TRIMA(inReal: number[] | IRecord[], optInTimePeriod?: number): number[];

    /**
     * KAMA - 考夫曼自适应移动平均线 (Kaufman Adaptive Moving Average)
     * @param inReal - 输入数据
     * @param optInTimePeriod - 计算周期，默认 30
     * @returns KAMA数组
     */
    KAMA(inReal: number[] | IRecord[], optInTimePeriod?: number): number[];

    /**
     * MA - 通用移动平均线，可指定类型
     * @param inReal - 输入数据
     * @param optInTimePeriod - 计算周期，默认 30
     * @param optInMAType - 移动平均类型: 0=SMA, 1=EMA, 2=WMA, 3=DEMA, 4=TEMA, 5=TRIMA, 6=KAMA, 7=MAMA, 8=T3
     * @returns MA数组
     * ```js
     * var sma = talib.MA(records, 20, 0);  // SMA
     * var ema = talib.MA(records, 20, 1);  // EMA
     * ```
     */
    MA(inReal: number[] | IRecord[], optInTimePeriod?: number, optInMAType?: number): number[];

    /**
     * MAVP - 可变周期移动平均线 (Moving Average with Variable Period)
     * 注意: 该函数需要两个输入数组，暂不支持
     */

    /**
     * T3 - T3移动平均线 (Triple Exponential Moving Average T3)
     * @param inReal - 输入数据
     * @param optInTimePeriod - 计算周期，默认 5
     * @param optInVFactor - 体积因子，默认 0.7（范围 0~1）
     * @returns T3数组
     */
    T3(inReal: number[] | IRecord[], optInTimePeriod?: number, optInVFactor?: number): number[];

    /**
     * MAMA - MESA自适应移动平均线 (MESA Adaptive Moving Average)
     * @param inReal - 输入数据
     * @param optInFastLimit - 快线限制，默认 0.5
     * @param optInSlowLimit - 慢线限制，默认 0.05
     * @returns [MAMA数组, FAMA数组] — MAMA线和跟随自适应移动平均线
     */
    MAMA(inReal: number[] | IRecord[], optInFastLimit?: number, optInSlowLimit?: number): [number[], number[]];

    // ==================== 趋势指标 ====================

    /**
     * MACD - 指数平滑异同移动平均线
     * @param inReal - 输入数据
     * @param optInFastPeriod - 快线周期，默认 12
     * @param optInSlowPeriod - 慢线周期，默认 26
     * @param optInSignalPeriod - 信号线周期，默认 9
     * @returns [DIF数组, DEA数组, MACD柱状图数组]
     * ```js
     * var [dif, dea, macd] = talib.MACD(records, 12, 26, 9);
     * var lastMACD = macd[macd.length - 1];
     * Log("MACD柱:", lastMACD);
     * ```
     */
    MACD(inReal: number[] | IRecord[], optInFastPeriod?: number, optInSlowPeriod?: number, optInSignalPeriod?: number): [number[], number[], number[]];

    /**
     * MACDEXT - 可自定义均线类型的MACD
     * @param inReal - 输入数据
     * @param optInFastPeriod - 快线周期，默认 12
     * @param optInFastMAType - 快线均线类型，默认 0(SMA)
     * @param optInSlowPeriod - 慢线周期，默认 26
     * @param optInSlowMAType - 慢线均线类型，默认 0(SMA)
     * @param optInSignalPeriod - 信号线周期，默认 9
     * @param optInSignalMAType - 信号线均线类型，默认 0(SMA)
     * @returns [DIF数组, DEA数组, MACD柱状图数组]
     */
    MACDEXT(inReal: number[] | IRecord[], optInFastPeriod?: number, optInFastMAType?: number, optInSlowPeriod?: number, optInSlowMAType?: number, optInSignalPeriod?: number, optInSignalMAType?: number): [number[], number[], number[]];

    /**
     * MACDFIX - 固定12/26周期的MACD，仅可调信号线周期
     * @param inReal - 输入数据
     * @param optInSignalPeriod - 信号线周期，默认 9
     * @returns [DIF数组, DEA数组, MACD柱状图数组]
     */
    MACDFIX(inReal: number[] | IRecord[], optInSignalPeriod?: number): [number[], number[], number[]];

    /**
     * ADX - 平均趋向指标 (Average Directional Movement Index)
     * @param inPriceHLC - K线数据（需要High/Low/Close）
     * @param optInTimePeriod - 计算周期，默认 14
     * @returns ADX数组，值范围 0~100，>25表示有趋势
     * ```js
     * var adx = talib.ADX(records, 14);
     * if (adx[adx.length - 1] > 25) Log("存在明显趋势");
     * ```
     */
    ADX(inPriceHLC: IRecord[], optInTimePeriod?: number): number[];

    /**
     * ADXR - 平均趋向指标评估 (Average Directional Movement Index Rating)
     * @param inPriceHLC - K线数据
     * @param optInTimePeriod - 计算周期，默认 14
     * @returns ADXR数组
     */
    ADXR(inPriceHLC: IRecord[], optInTimePeriod?: number): number[];

    /**
     * DX - 趋向指标 (Directional Movement Index)
     * @param inPriceHLC - K线数据
     * @param optInTimePeriod - 计算周期，默认 14
     * @returns DX数组
     */
    DX(inPriceHLC: IRecord[], optInTimePeriod?: number): number[];

    /**
     * PLUS_DI - 正趋向指标 (Plus Directional Indicator)
     * @param inPriceHLC - K线数据
     * @param optInTimePeriod - 计算周期，默认 14
     * @returns +DI数组
     */
    PLUS_DI(inPriceHLC: IRecord[], optInTimePeriod?: number): number[];

    /**
     * PLUS_DM - 正趋向变动 (Plus Directional Movement)
     * @param inPriceHL - K线数据（需要High/Low）
     * @param optInTimePeriod - 计算周期，默认 14
     * @returns +DM数组
     */
    PLUS_DM(inPriceHL: IRecord[], optInTimePeriod?: number): number[];

    /**
     * MINUS_DI - 负趋向指标 (Minus Directional Indicator)
     * @param inPriceHLC - K线数据
     * @param optInTimePeriod - 计算周期，默认 14
     * @returns -DI数组
     */
    MINUS_DI(inPriceHLC: IRecord[], optInTimePeriod?: number): number[];

    /**
     * MINUS_DM - 负趋向变动 (Minus Directional Movement)
     * @param inPriceHL - K线数据
     * @param optInTimePeriod - 计算周期，默认 14
     * @returns -DM数组
     */
    MINUS_DM(inPriceHL: IRecord[], optInTimePeriod?: number): number[];

    /**
     * SAR - 抛物线转向指标 (Parabolic SAR)
     * @param inPriceHL - K线数据（需要High/Low）
     * @param optInAcceleration - 加速因子，默认 0.02
     * @param optInMaximum - 最大加速因子，默认 0.2
     * @returns SAR数组
     * ```js
     * var sar = talib.SAR(records, 0.02, 0.2);
     * if (records[records.length-1].Close > sar[sar.length-1]) Log("多头趋势");
     * ```
     */
    SAR(inPriceHL: IRecord[], optInAcceleration?: number, optInMaximum?: number): number[];

    /**
     * SAREXT - 扩展抛物线转向指标
     * @param inPriceHL - K线数据
     * @param optInStartValue - 起始值，默认 0
     * @param optInOffsetOnReverse - 反转偏移，默认 0
     * @param optInAccelerationInitLong - 多头初始加速因子，默认 0.02
     * @param optInAccelerationLong - 多头加速因子，默认 0.02
     * @param optInAccelerationMaxLong - 多头最大加速因子，默认 0.2
     * @param optInAccelerationInitShort - 空头初始加速因子，默认 0.02
     * @param optInAccelerationShort - 空头加速因子，默认 0.02
     * @param optInAccelerationMaxShort - 空头最大加速因子，默认 0.2
     * @returns SAREXT数组
     */
    SAREXT(inPriceHL: IRecord[], optInStartValue?: number, optInOffsetOnReverse?: number, optInAccelerationInitLong?: number, optInAccelerationLong?: number, optInAccelerationMaxLong?: number, optInAccelerationInitShort?: number, optInAccelerationShort?: number, optInAccelerationMaxShort?: number): number[];

    /**
     * AROON - 阿隆指标 (Aroon)
     * @param inPriceHL - K线数据（需要High/Low）
     * @param optInTimePeriod - 计算周期，默认 14
     * @returns [AroonDown数组, AroonUp数组]
     */
    AROON(inPriceHL: IRecord[], optInTimePeriod?: number): [number[], number[]];

    /**
     * AROONOSC - 阿隆振荡器 (Aroon Oscillator)
     * @param inPriceHL - K线数据
     * @param optInTimePeriod - 计算周期，默认 14
     * @returns AroonOsc数组
     */
    AROONOSC(inPriceHL: IRecord[], optInTimePeriod?: number): number[];

    // ==================== 动量指标 ====================

    /**
     * RSI - 相对强弱指标 (Relative Strength Index)
     * @param inReal - 输入数据
     * @param optInTimePeriod - 计算周期，默认 14
     * @returns RSI数组，值范围 0~100。>70超买，<30超卖
     * ```js
     * var rsi = talib.RSI(records, 14);
     * var last = rsi[rsi.length - 1];
     * if (last > 70) Log("超买区域");
     * if (last < 30) Log("超卖区域");
     * ```
     */
    RSI(inReal: number[] | IRecord[], optInTimePeriod?: number): number[];

    /**
     * WILLR - 威廉指标 (Williams' %R)
     * @param inPriceHLC - K线数据
     * @param optInTimePeriod - 计算周期，默认 14
     * @returns WilliamsR数组，值范围 -100~0
     */
    WILLR(inPriceHLC: IRecord[], optInTimePeriod?: number): number[];

    /**
     * CCI - 顺势指标 (Commodity Channel Index)
     * @param inPriceHLC - K线数据
     * @param optInTimePeriod - 计算周期，默认 14
     * @returns CCI数组
     */
    CCI(inPriceHLC: IRecord[], optInTimePeriod?: number): number[];

    /**
     * MOM - 动量指标 (Momentum)
     * @param inReal - 输入数据
     * @param optInTimePeriod - 计算周期，默认 10
     * @returns 动量值数组
     */
    MOM(inReal: number[] | IRecord[], optInTimePeriod?: number): number[];

    /**
     * ROC - 变动率指标 (Rate of Change)
     * @param inReal - 输入数据
     * @param optInTimePeriod - 计算周期，默认 10
     * @returns ROC数组（百分比变化 * 100）
     */
    ROC(inReal: number[] | IRecord[], optInTimePeriod?: number): number[];

    /**
     * ROCP - 变动率百分比 (Rate of Change Percentage)
     * @param inReal - 输入数据
     * @param optInTimePeriod - 计算周期，默认 10
     * @returns ROCP数组
     */
    ROCP(inReal: number[] | IRecord[], optInTimePeriod?: number): number[];

    /**
     * ROCR - 变动率比率 (Rate of Change Ratio)
     * @param inReal - 输入数据
     * @param optInTimePeriod - 计算周期，默认 10
     * @returns ROCR数组
     */
    ROCR(inReal: number[] | IRecord[], optInTimePeriod?: number): number[];

    /**
     * ROCR100 - 变动率比率×100 (Rate of Change Ratio 100 Scale)
     * @param inReal - 输入数据
     * @param optInTimePeriod - 计算周期，默认 10
     * @returns ROCR100数组
     */
    ROCR100(inReal: number[] | IRecord[], optInTimePeriod?: number): number[];

    /**
     * TRIX - 三重指数平滑平均线 (Triple Smooth EMA, 1-day Rate-Of-Change)
     * @param inReal - 输入数据
     * @param optInTimePeriod - 计算周期，默认 30
     * @returns TRIX数组
     */
    TRIX(inReal: number[] | IRecord[], optInTimePeriod?: number): number[];

    /**
     * PPO - 价格振荡器百分比 (Percentage Price Oscillator)
     * @param inReal - 输入数据
     * @param optInFastPeriod - 快线周期，默认 12
     * @param optInSlowPeriod - 慢线周期，默认 26
     * @param optInMAType - 均线类型，默认 0(SMA)
     * @returns PPO数组
     */
    PPO(inReal: number[] | IRecord[], optInFastPeriod?: number, optInSlowPeriod?: number, optInMAType?: number): number[];

    /**
     * APO - 价格振荡器 (Absolute Price Oscillator)
     * @param inReal - 输入数据
     * @param optInFastPeriod - 快线周期，默认 12
     * @param optInSlowPeriod - 慢线周期，默认 26
     * @param optInMAType - 均线类型，默认 0(SMA)
     * @returns APO数组
     */
    APO(inReal: number[] | IRecord[], optInFastPeriod?: number, optInSlowPeriod?: number, optInMAType?: number): number[];

    /**
     * CMO - 钱德动量摆动指标 (Chande Momentum Oscillator)
     * @param inReal - 输入数据
     * @param optInTimePeriod - 计算周期，默认 14
     * @returns CMO数组
     */
    CMO(inReal: number[] | IRecord[], optInTimePeriod?: number): number[];

    /**
     * ULTOSC - 终极震荡指标 (Ultimate Oscillator)
     * @param inPriceHLC - K线数据
     * @param optInTimePeriod1 - 周期1，默认 7
     * @param optInTimePeriod2 - 周期2，默认 14
     * @param optInTimePeriod3 - 周期3，默认 28
     * @returns ULTOSC数组
     */
    ULTOSC(inPriceHLC: IRecord[], optInTimePeriod1?: number, optInTimePeriod2?: number, optInTimePeriod3?: number): number[];

    // ==================== 随机/KDJ指标 ====================

    /**
     * STOCH - 随机指标 (Stochastic)，即KDJ的KD线
     * @param inPriceHLC - K线数据
     * @param optInFastK_Period - Fast K周期，默认 5
     * @param optInSlowK_Period - Slow K周期，默认 3
     * @param optInSlowK_MAType - Slow K均线类型，默认 0(SMA)
     * @param optInSlowD_Period - Slow D周期，默认 3
     * @param optInSlowD_MAType - Slow D均线类型，默认 0(SMA)
     * @returns [SlowK数组, SlowD数组]
     * ```js
     * var [k, d] = talib.STOCH(records, 9, 3, 0, 3, 0);
     * ```
     */
    STOCH(inPriceHLC: IRecord[], optInFastK_Period?: number, optInSlowK_Period?: number, optInSlowK_MAType?: number, optInSlowD_Period?: number, optInSlowD_MAType?: number): [number[], number[]];

    /**
     * STOCHF - 快速随机指标 (Stochastic Fast)
     * @param inPriceHLC - K线数据
     * @param optInFastK_Period - Fast K周期，默认 5
     * @param optInFastD_Period - Fast D周期，默认 3
     * @param optInFastD_MAType - Fast D均线类型，默认 0(SMA)
     * @returns [FastK数组, FastD数组]
     */
    STOCHF(inPriceHLC: IRecord[], optInFastK_Period?: number, optInFastD_Period?: number, optInFastD_MAType?: number): [number[], number[]];

    /**
     * STOCHRSI - 随机RSI指标 (Stochastic Relative Strength Index)
     * @param inReal - 输入数据
     * @param optInTimePeriod - RSI周期，默认 14
     * @param optInFastK_Period - Fast K周期，默认 5
     * @param optInFastD_Period - Fast D周期，默认 3
     * @param optInFastD_MAType - Fast D均线类型，默认 0(SMA)
     * @returns [FastK数组, FastD数组]
     */
    STOCHRSI(inReal: number[] | IRecord[], optInTimePeriod?: number, optInFastK_Period?: number, optInFastD_Period?: number, optInFastD_MAType?: number): [number[], number[]];

    // ==================== 波动率指标 ====================

    /**
     * BBANDS - 布林带 (Bollinger Bands)
     * @param inReal - 输入数据
     * @param optInTimePeriod - 计算周期，默认 5
     * @param optInNbDevUp - 上轨标准差倍数，默认 2
     * @param optInNbDevDn - 下轨标准差倍数，默认 2
     * @param optInMAType - 均线类型，默认 0(SMA)
     * @returns [上轨数组, 中轨数组, 下轨数组]
     * ```js
     * var [upper, middle, lower] = talib.BBANDS(records, 20, 2, 2);
     * var price = records[records.length - 1].Close;
     * if (price > upper[upper.length - 1]) Log("突破上轨");
     * if (price < lower[lower.length - 1]) Log("突破下轨");
     * ```
     */
    BBANDS(inReal: number[] | IRecord[], optInTimePeriod?: number, optInNbDevUp?: number, optInNbDevDn?: number, optInMAType?: number): [number[], number[], number[]];

    /**
     * ATR - 平均真实波幅 (Average True Range)
     * @param inPriceHLC - K线数据
     * @param optInTimePeriod - 计算周期，默认 14
     * @returns ATR数组
     * ```js
     * var atr = talib.ATR(records, 14);
     * Log("当前ATR:", atr[atr.length - 1]);
     * ```
     */
    ATR(inPriceHLC: IRecord[], optInTimePeriod?: number): number[];

    /**
     * NATR - 归一化平均真实波幅 (Normalized ATR)
     * @param inPriceHLC - K线数据
     * @param optInTimePeriod - 计算周期，默认 14
     * @returns NATR数组（百分比）
     */
    NATR(inPriceHLC: IRecord[], optInTimePeriod?: number): number[];

    /**
     * TRANGE - 真实波幅 (True Range)
     * @param inPriceHLC - K线数据
     * @returns TrueRange数组
     */
    TRANGE(inPriceHLC: IRecord[]): number[];

    /**
     * STDDEV - 标准差 (Standard Deviation)
     * @param inReal - 输入数据
     * @param optInTimePeriod - 计算周期，默认 5
     * @param optInNbDev - 标准差倍数，默认 1
     * @returns 标准差数组
     */
    STDDEV(inReal: number[] | IRecord[], optInTimePeriod?: number, optInNbDev?: number): number[];

    /**
     * VAR - 方差 (Variance)
     * @param inReal - 输入数据
     * @param optInTimePeriod - 计算周期，默认 5
     * @param optInNbDev - 标准差倍数，默认 1
     * @returns 方差数组
     */
    VAR(inReal: number[] | IRecord[], optInTimePeriod?: number, optInNbDev?: number): number[];

    // ==================== 成交量指标 ====================

    /**
     * OBV - 能量潮指标 (On Balance Volume)
     * @param inReal - 收盘价数组或K线数组
     * @param inPriceV - 包含Volume的K线数组
     * @returns OBV数组
     * ```js
     * var obv = talib.OBV(records, records);
     * ```
     */
    OBV(inReal: number[] | IRecord[], inPriceV: IRecord[]): number[];

    /**
     * AD - 积累/分布指标 (Chaikin A/D Line)
     * @param inPriceHLCV - K线数据（需要High/Low/Close/Volume）
     * @returns AD数组
     */
    AD(inPriceHLCV: IRecord[]): number[];

    /**
     * ADOSC - 积累/分布震荡指标 (Chaikin A/D Oscillator)
     * @param inPriceHLCV - K线数据
     * @param optInFastPeriod - 快线周期，默认 3
     * @param optInSlowPeriod - 慢线周期，默认 10
     * @returns ADOSC数组
     */
    ADOSC(inPriceHLCV: IRecord[], optInFastPeriod?: number, optInSlowPeriod?: number): number[];

    /**
     * MFI - 资金流量指标 (Money Flow Index)
     * @param inPriceHLCV - K线数据（需要High/Low/Close/Volume）
     * @param optInTimePeriod - 计算周期，默认 14
     * @returns MFI数组，值范围 0~100
     */
    MFI(inPriceHLCV: IRecord[], optInTimePeriod?: number): number[];

    // ==================== 价格转换指标 ====================

    /** 加权收盘价 (Weighted Close Price): (High+Low+Close*2)/4 */
    WCLPRICE(inPriceHLC: IRecord[]): number[];
    /** 典型价格 (Typical Price): (High+Low+Close)/3 */
    TYPPRICE(inPriceHLC: IRecord[]): number[];
    /** 中间价 (Median Price): (High+Low)/2 */
    MEDPRICE(inPriceHL: IRecord[]): number[];
    /** 平均价格 (Average Price): (Open+High+Low+Close)/4 */
    AVGPRICE(inPriceOHLC: IRecord[]): number[];
    /** 中点 (Mid Point): (最高+最低)/2 */
    MIDPOINT(inReal: number[] | IRecord[], optInTimePeriod?: number): number[];
    /** 中间价格 (Mid Price): (period内最高的High + period内最低的Low)/2 */
    MIDPRICE(inPriceHL: IRecord[], optInTimePeriod?: number): number[];

    // ==================== 统计/回归指标 ====================

    /**
     * LINEARREG - 线性回归 (Linear Regression)
     * @param inReal - 输入数据
     * @param optInTimePeriod - 计算周期，默认 14
     * @returns 线性回归值数组
     */
    LINEARREG(inReal: number[] | IRecord[], optInTimePeriod?: number): number[];

    /** 线性回归斜率 */
    LINEARREG_SLOPE(inReal: number[] | IRecord[], optInTimePeriod?: number): number[];
    /** 线性回归截距 */
    LINEARREG_INTERCEPT(inReal: number[] | IRecord[], optInTimePeriod?: number): number[];
    /** 线性回归角度 */
    LINEARREG_ANGLE(inReal: number[] | IRecord[], optInTimePeriod?: number): number[];

    /**
     * TSF - 时间序列预测 (Time Series Forecast)
     * @param inReal - 输入数据
     * @param optInTimePeriod - 计算周期，默认 14
     * @returns TSF数组
     */
    TSF(inReal: number[] | IRecord[], optInTimePeriod?: number): number[];

    // ==================== 希尔伯特变换指标 ====================

    /** 希尔伯特变换 - 瞬时趋势线 */
    HT_TRENDLINE(inReal: number[] | IRecord[]): number[];
    /** 希尔伯特变换 - 趋势模式 (1=趋势, 0=周期) */
    HT_TRENDMODE(inReal: number[] | IRecord[]): number[];
    /** 希尔伯特变换 - 正弦波，返回 [Sine数组, LeadSine数组] */
    HT_SINE(inReal: number[] | IRecord[]): [number[], number[]];
    /** 希尔伯特变换 - 相量，返回 [InPhase数组, Quadrature数组] */
    HT_PHASOR(inReal: number[] | IRecord[]): [number[], number[]];
    /** 希尔伯特变换 - 主导周期相位 */
    HT_DCPHASE(inReal: number[] | IRecord[]): number[];
    /** 希尔伯特变换 - 主导周期 */
    HT_DCPERIOD(inReal: number[] | IRecord[]): number[];

    // ==================== 数学函数 ====================

    /** 向上取整 */
    CEIL(inReal: number[] | IRecord[]): number[];
    /** 向下取整 */
    FLOOR(inReal: number[] | IRecord[]): number[];
    /** 指数函数 e^x */
    EXP(inReal: number[] | IRecord[]): number[];
    /** 自然对数 ln(x) */
    LN(inReal: number[] | IRecord[]): number[];
    /** 常用对数 log10(x) */
    LOG10(inReal: number[] | IRecord[]): number[];
    /** 平方根 */
    SQRT(inReal: number[] | IRecord[]): number[];

    // ==================== 三角函数 ====================

    /** 正弦 */
    SIN(inReal: number[] | IRecord[]): number[];
    /** 余弦 */
    COS(inReal: number[] | IRecord[]): number[];
    /** 正切 */
    TAN(inReal: number[] | IRecord[]): number[];
    /** 双曲正弦 */
    SINH(inReal: number[] | IRecord[]): number[];
    /** 双曲余弦 */
    COSH(inReal: number[] | IRecord[]): number[];
    /** 双曲正切 */
    TANH(inReal: number[] | IRecord[]): number[];
    /** 反正弦 */
    ASIN(inReal: number[] | IRecord[]): number[];
    /** 反余弦 */
    ACOS(inReal: number[] | IRecord[]): number[];
    /** 反正切 */
    ATAN(inReal: number[] | IRecord[]): number[];

    // ==================== 最值/求和 ====================

    /**
     * MAX - 周期内最大值
     * @param inReal - 输入数据
     * @param optInTimePeriod - 计算周期，默认 30
     */
    MAX(inReal: number[] | IRecord[], optInTimePeriod?: number): number[];
    /** 周期内最大值的索引位置 */
    MAXINDEX(inReal: number[] | IRecord[], optInTimePeriod?: number): number[];
    /**
     * MIN - 周期内最小值
     * @param inReal - 输入数据
     * @param optInTimePeriod - 计算周期，默认 30
     */
    MIN(inReal: number[] | IRecord[], optInTimePeriod?: number): number[];
    /** 周期内最小值的索引位置 */
    MININDEX(inReal: number[] | IRecord[], optInTimePeriod?: number): number[];
    /** 同时获取周期内最大值和最小值，返回 [Min数组, Max数组] */
    MINMAX(inReal: number[] | IRecord[], optInTimePeriod?: number): [number[], number[]];
    /** 同时获取最大值和最小值的索引，返回 [MinIdx数组, MaxIdx数组] */
    MINMAXINDEX(inReal: number[] | IRecord[], optInTimePeriod?: number): [number[], number[]];
    /**
     * SUM - 周期内求和
     * @param inReal - 输入数据
     * @param optInTimePeriod - 计算周期，默认 30
     */
    SUM(inReal: number[] | IRecord[], optInTimePeriod?: number): number[];

    // ==================== 其他指标 ====================

    /**
     * BOP - 均势指标 (Balance Of Power)
     * @param inPriceOHLC - K线数据
     * @returns BOP数组
     */
    BOP(inPriceOHLC: IRecord[]): number[];

    // ==================== K线形态识别 ====================
    // 所有 CDL* 函数输入K线数组(OHLC)，返回识别信号数组:
    // 正数(100/200)=看涨信号，负数(-100/-200)=看跌信号，0=无信号

    /** 弃婴形态 (Abandoned Baby)，optInPenetration为穿透率，默认0.3 */
    CDLABANDONEDBABY(inPriceOHLC: IRecord[], optInPenetration?: number): number[];
    /** 提进线 (Advance Block) */
    CDLADVANCEBLOCK(inPriceOHLC: IRecord[]): number[];
    /** 捉腰带线 (Belt-hold) */
    CDLBELTHOLD(inPriceOHLC: IRecord[]): number[];
    /** 脱离形态 (Breakaway) */
    CDLBREAKAWAY(inPriceOHLC: IRecord[]): number[];
    /** 收盘光头光脚 (Closing Marubozu) */
    CDLCLOSINGMARUBOZU(inPriceOHLC: IRecord[]): number[];
    /** 隐藏吞没 (Concealing Baby Swallow) */
    CDLCONCEALBABYSWALL(inPriceOHLC: IRecord[]): number[];
    /** 反击形态 (Counterattack) */
    CDLCOUNTERATTACK(inPriceOHLC: IRecord[]): number[];
    /** 乌云盖顶 (Dark Cloud Cover)，optInPenetration为穿透率 */
    CDLDARKCLOUDCOVER(inPriceOHLC: IRecord[], optInPenetration?: number): number[];
    /** 十字星 (Doji) */
    CDLDOJI(inPriceOHLC: IRecord[]): number[];
    /** 十字星线 (Doji Star) */
    CDLDOJISTAR(inPriceOHLC: IRecord[]): number[];
    /** 蜻蜓十字 (Dragonfly Doji) */
    CDLDRAGONFLYDOJI(inPriceOHLC: IRecord[]): number[];
    /** 吞没形态 (Engulfing Pattern) */
    CDLENGULFING(inPriceOHLC: IRecord[]): number[];
    /** 黄昏十字星 (Evening Doji Star) */
    CDLEVENINGDOJISTAR(inPriceOHLC: IRecord[], optInPenetration?: number): number[];
    /** 黄昏之星 (Evening Star) */
    CDLEVENINGSTAR(inPriceOHLC: IRecord[], optInPenetration?: number): number[];
    /** 向上跳空并排白色蜡烛线 (Up/Down-gap side-by-side white lines) */
    CDLGAPSIDESIDEWHITE(inPriceOHLC: IRecord[]): number[];
    /** 墓碑十字 (Gravestone Doji) */
    CDLGRAVESTONEDOJI(inPriceOHLC: IRecord[]): number[];
    /** 锤子线 (Hammer) */
    CDLHAMMER(inPriceOHLC: IRecord[]): number[];
    /** 上吊线 (Hanging Man) */
    CDLHANGINGMAN(inPriceOHLC: IRecord[]): number[];
    /** 孕线形态 (Harami Pattern) */
    CDLHARAMI(inPriceOHLC: IRecord[]): number[];
    /** 十字孕线 (Harami Cross) */
    CDLHARAMICROSS(inPriceOHLC: IRecord[]): number[];
    /** 高浪线 (High-Wave Candle) */
    CDLHIGHWAVE(inPriceOHLC: IRecord[]): number[];
    /** 陷阱形态 (Hikkake Pattern) */
    CDLHIKKAKE(inPriceOHLC: IRecord[]): number[];
    /** 修正陷阱形态 (Modified Hikkake) */
    CDLHIKKAKEMOD(inPriceOHLC: IRecord[]): number[];
    /** 家鸽形态 (Homing Pigeon) */
    CDLHOMINGPIGEON(inPriceOHLC: IRecord[]): number[];
    /** 三只乌鸦 (Identical Three Crows) */
    CDLIDENTICAL3CROWS(inPriceOHLC: IRecord[]): number[];
    /** 颈内线 (In-Neck Pattern) */
    CDLINNECK(inPriceOHLC: IRecord[]): number[];
    /** 倒锤子 (Inverted Hammer) */
    CDLINVERTEDHAMMER(inPriceOHLC: IRecord[]): number[];
    /** 反冲形态 (Kicking) */
    CDLKICKING(inPriceOHLC: IRecord[]): number[];
    /** 由较长光头光脚决定的反冲形态 */
    CDLKICKINGBYLENGTH(inPriceOHLC: IRecord[]): number[];
    /** 梯底 (Ladder Bottom) */
    CDLLADDERBOTTOM(inPriceOHLC: IRecord[]): number[];
    /** 长腿十字 (Long Legged Doji) */
    CDLLONGLEGGEDDOJI(inPriceOHLC: IRecord[]): number[];
    /** 长蜡烛线 (Long Line Candle) */
    CDLLONGLINE(inPriceOHLC: IRecord[]): number[];
    /** 光头光脚 (Marubozu) */
    CDLMARUBOZU(inPriceOHLC: IRecord[]): number[];
    /** 相同低价 (Matching Low) */
    CDLMATCHINGLOW(inPriceOHLC: IRecord[]): number[];
    /** 铺垫形态 (Mat Hold) */
    CDLMATHOLD(inPriceOHLC: IRecord[], optInPenetration?: number): number[];
    /** 早晨十字星 (Morning Doji Star) */
    CDLMORNINGDOJISTAR(inPriceOHLC: IRecord[], optInPenetration?: number): number[];
    /** 早晨之星 (Morning Star) */
    CDLMORNINGSTAR(inPriceOHLC: IRecord[], optInPenetration?: number): number[];
    /** 颈上线 (On-Neck Pattern) */
    CDLONNECK(inPriceOHLC: IRecord[]): number[];
    /** 刺透形态 (Piercing Pattern) */
    CDLPIERCING(inPriceOHLC: IRecord[]): number[];
    /** 黄包车夫 (Rickshaw Man) */
    CDLRICKSHAWMAN(inPriceOHLC: IRecord[]): number[];
    /** 上升/下降三法 (Rising/Falling Three Methods) */
    CDLRISEFALL3METHODS(inPriceOHLC: IRecord[]): number[];
    /** 分离线 (Separating Lines) */
    CDLSEPARATINGLINES(inPriceOHLC: IRecord[]): number[];
    /** 射击之星 (Shooting Star) */
    CDLSHOOTINGSTAR(inPriceOHLC: IRecord[]): number[];
    /** 短蜡烛线 (Short Line Candle) */
    CDLSHORTLINE(inPriceOHLC: IRecord[]): number[];
    /** 纺锤线 (Spinning Top) */
    CDLSPINNINGTOP(inPriceOHLC: IRecord[]): number[];
    /** 停顿形态 (Stalled Pattern) */
    CDLSTALLEDPATTERN(inPriceOHLC: IRecord[]): number[];
    /** 条形三明治 (Stick Sandwich) */
    CDLSTICKSANDWICH(inPriceOHLC: IRecord[]): number[];
    /** 探水竿 (Takuri) */
    CDLTAKURI(inPriceOHLC: IRecord[]): number[];
    /** 跳空缺口 (Tasuki Gap) */
    CDLTASUKIGAP(inPriceOHLC: IRecord[]): number[];
    /** 插入形态 (Thrusting Pattern) */
    CDLTHRUSTING(inPriceOHLC: IRecord[]): number[];
    /** 三星形态 (Tristar) */
    CDLTRISTAR(inPriceOHLC: IRecord[]): number[];
    /** 奇特三河 (Unique 3 River) */
    CDLUNIQUE3RIVER(inPriceOHLC: IRecord[]): number[];
    /** 向上跳空两乌鸦 (Upside Gap Two Crows) */
    CDLUPSIDEGAP2CROWS(inPriceOHLC: IRecord[]): number[];
    /** 向上/向下跳空三法 (Upside/Downside Gap Three Methods) */
    CDLXSIDEGAP3METHODS(inPriceOHLC: IRecord[]): number[];
    /** 三白兵 (Three Advancing White Soldiers) */
    CDL3WHITESOLDIERS(inPriceOHLC: IRecord[]): number[];
    /** 南方三星 (Three Stars In The South) */
    CDL3STARSINSOUTH(inPriceOHLC: IRecord[]): number[];
    /** 三外部上涨/下跌 (Three Outside Up/Down) */
    CDL3OUTSIDE(inPriceOHLC: IRecord[]): number[];
    /** 三线打击 (Three-Line Strike) */
    CDL3LINESTRIKE(inPriceOHLC: IRecord[]): number[];
    /** 三内部上涨/下跌 (Three Inside Up/Down) */
    CDL3INSIDE(inPriceOHLC: IRecord[]): number[];
    /** 三只黑乌鸦 (Three Black Crows) */
    CDL3BLACKCROWS(inPriceOHLC: IRecord[]): number[];
    /** 两只乌鸦 (Two Crows) */
    CDL2CROWS(inPriceOHLC: IRecord[]): number[];
}

// ==================== FMZ内置TA指标库 ====================
/**
 * FMZ平台内置技术分析指标库（简化版），相比talib更常用易用
 * 通过全局变量 `TA` 访问
 *
 * ```js
 * var records = exchange.GetRecords();
 * var [k, d, j] = TA.KDJ(records, 9, 3, 3);
 * var [up, mid, down] = TA.BOLL(records, 20, 2);
 * ```
 */
interface ITA {
    /**
     * CMF - 蔡金资金流量指标 (Chaikin Money Flow)
     * @param inPriceHLCV - K线数组（需要 High/Low/Close/Volume）
     * @param periods - 计算周期，默认 20
     * @returns CMF数组
     */
    CMF(inPriceHLCV: IRecord[], periods?: number): number[];

    /**
     * Alligator - 鳄鱼指标（威廉姆斯）
     * @param inPriceHL - K线数组（需要 High/Low）
     * @param jawLength - 鳄鱼颚线周期，默认 13
     * @param teethLength - 鳄鱼齿线周期，默认 8
     * @param lipsLength - 鳄鱼唇线周期，默认 5
     * @returns [颚线数组, 齿线数组, 唇线数组]
     * ```js
     * var [jaw, teeth, lips] = TA.Alligator(records, 13, 8, 5);
     * ```
     */
    Alligator(inPriceHL: IRecord[], jawLength?: number, teethLength?: number, lipsLength?: number): [number[], number[], number[]];

    /**
     * ATR - 平均真实波幅 (Average True Range)
     * @param inPriceHLC - K线数据
     * @param optInTimePeriod - 计算周期，默认 14
     * @returns ATR数组
     */
    ATR(inPriceHLC: IRecord[], optInTimePeriod?: number): number[];

    /**
     * OBV - 能量潮指标 (On Balance Volume)
     * 注意：与 talib.OBV(inReal, inPriceV) 不同，TA.OBV 只接收一个K线数组参数
     * @param records - K线数组（需要 Close/Volume）
     * @returns OBV数组
     */
    OBV(records: IRecord[]): number[];

    /**
     * RSI - 相对强弱指标
     * @param inReal - 输入数据
     * @param optInTimePeriod - 计算周期，默认 14
     * @returns RSI数组，值范围 0~100
     */
    RSI(inReal: number[] | IRecord[], optInTimePeriod?: number): number[];

    /**
     * KDJ - 随机指标
     * @param inPriceHLC - K线数组（需要 High/Low/Close）
     * @param period - K线周期，默认 9
     * @param kPeriod - K线平滑周期，默认 3
     * @param dPeriod - D线平滑周期，默认 3
     * @returns [K数组, D数组, J数组]
     * ```js
     * var [k, d, j] = TA.KDJ(records, 9, 3, 3);
     * Log("K:", k[k.length-1], "D:", d[d.length-1], "J:", j[j.length-1]);
     * ```
     */
    KDJ(inPriceHLC: IRecord[], period?: number, kPeriod?: number, dPeriod?: number): [number[], number[], number[]];

    /**
     * BOLL - 布林带指标 (Bollinger Bands)
     * @param inReal - 输入数据
     * @param period - 计算周期，默认 20
     * @param multiplier - 标准差倍数，默认 2
     * @returns [上轨数组, 中轨数组, 下轨数组]
     * ```js
     * var [upper, middle, lower] = TA.BOLL(records, 20, 2);
     * ```
     */
    BOLL(inReal: number[] | IRecord[], period?: number, multiplier?: number): [number[], number[], number[]];

    /**
     * MACD - 指数平滑异同移动平均线
     * @param inReal - 输入数据
     * @param optInFastPeriod - 快线周期，默认 12
     * @param optInSlowPeriod - 慢线周期，默认 26
     * @param optInSignalPeriod - 信号线周期，默认 9
     * @returns [DIF数组, DEA数组, MACD柱状图数组]
     */
    MACD(inReal: number[] | IRecord[], optInFastPeriod?: number, optInSlowPeriod?: number, optInSignalPeriod?: number): [number[], number[], number[]];

    /**
     * EMA - 指数移动平均线
     * @param inReal - 输入数据
     * @param optInTimePeriod - 计算周期
     * @returns EMA数组
     */
    EMA(inReal: number[] | IRecord[], optInTimePeriod?: number): number[];

    /**
     * SMA - 简单移动平均线
     * @param inReal - 输入数据
     * @param optInTimePeriod - 计算周期
     * @returns SMA数组
     */
    SMA(inReal: number[] | IRecord[], optInTimePeriod?: number): number[];

    /**
     * MA - 移动平均线（默认SMA）
     * @param inReal - 输入数据
     * @param optInTimePeriod - 计算周期
     * @returns MA数组
     */
    MA(inReal: number[] | IRecord[], optInTimePeriod?: number): number[];

    /**
     * Highest - 获取周期内最高值
     * @param inReal - 输入数据
     * @param period - 计算周期，不传则计算全部数据
     * @param attr - K线属性名（当传入K线数组时），如 "High", "Low", "Close", "Volume"
     * @returns 最高值（单个数字）
     * ```js
     * var highestHigh = TA.Highest(records, 20, "High");
     * var highestClose = TA.Highest(records, 10, "Close");
     * ```
     */
    Highest(inReal: number[] | IRecord[], period?: number, attr?: string): number;

    /**
     * Lowest - 获取周期内最低值
     * @param inReal - 输入数据
     * @param period - 计算周期，不传则计算全部数据
     * @param attr - K线属性名，如 "High", "Low", "Close", "Volume"
     * @returns 最低值（单个数字）
     * ```js
     * var lowestLow = TA.Lowest(records, 20, "Low");
     * ```
     */
    Lowest(inReal: number[] | IRecord[], period?: number, attr?: string): number;
}

/**
 * 数据库执行结果结构体
 */
interface IDBExecRet {
    /** 查询结果数据行，每行为一个值数组 */
    values: Array<Array<any>>;
    /** 列名数组 */
    columns: string[];
}

/**
 * Dial连接对象，支持TCP/WebSocket/数据库等多种协议。
 * 通过 Dial() 函数创建；网络连接句柄可传给 Thread，启用重连后 fd 保持不变。
 *
 * ```js
 * // WebSocket连接
 * var ws = Dial("wss://stream.binance.com:9443/ws/btcusdt@ticker");
 * var msg = ws.read(5000);  // 5秒超时读取
 * ws.close();
 *
 * // 数据库连接
 * var db = Dial("sqlite3:///mydata.db");
 * db.exec("CREATE TABLE IF NOT EXISTS kv(k TEXT PRIMARY KEY, v TEXT)");
 * db.exec("INSERT INTO kv VALUES(?, ?)", "key1", "value1");
 * var ret = db.exec("SELECT * FROM kv");
 * db.close();
 * ```
 */
interface IDial {
    /**
     * 从连接读取数据
     * @param timeoutMs - 超时毫秒：
     *   - 大于 0：最多等这么久，没数据返回 null；
     *   - 0 或不传：阻塞到有数据；
     *   - -1：非阻塞取一条，没有返回 null；
     *   - 小于 -1（如 -2）：丢掉积压只取最新一条，没有返回 null。
     *   连接断开返回 ""（空字符串）；开启 reconnect 时重连在后台进行，期间 read 立即返回 ""，
     *   连上后自动继续读，fd 不变。
     * 返回值：帧内容是合法 UTF-8 时为 string，否则为 ArrayBuffer（原字节，与旧项目相同）
     * @returns 读取到的字符串；超时 null；连接断开 ""
     */
    read(timeoutMs?: number): string | ArrayBuffer | null;

    /**
     * 向连接写入数据
     * @param data - 要发送的数据（字符串或二进制数据）
     * @param timeoutMs - 写超时时间（毫秒）
     * @returns 成功写入的字节数，连接断开时返回 0
     */
    write(data: string | ArrayBuffer, timeoutMs?: number): number;

    /**
     * 执行SQL语句（仅数据库连接可用）
     * @param sql - SQL语句
     * @param extra - SQL参数化查询的绑定值。number / string / boolean / null 按原类型绑定；
     *   BigInt 精确转成 64 位整数（`BigInt(ts)` 写 Int64/UInt64 列不丢位）；
     *   Uint8Array / ArrayBuffer 作为二进制（blob）写入。
     *   ClickHouse 批量插入：每个 extra 都是数组时，每个数组就是一行，
     *   `db.exec("INSERT INTO t VALUES(?,?)", [a1, b1], [a2, b2])`。
     * @returns 查询结果对象，失败返回 null
     * ```js
     * // SQL
     * var ret = db.exec("SELECT * FROM users WHERE age > ?", 18);
     * ```
     */
    exec(sql: string, ...extra: any[]): IDBExecRet | null;

    /**
     * 获取连接的文件描述符编号
     * @returns 文件描述符编号
     */
    fd(): number;

    /**
     * 关闭连接，释放资源
     */
    close(): void;
}

/**
 * 事件循环消息结构体，由 EventLoop() 返回
 */
interface IEventMsg {
    /** 事件序列号 */
    Seq: number;
    /** 事件类型，如 "ticker", "order", "thread" 等 */
    Event: string;
    /** 触发事件的线程ID */
    ThreadId: number;
    /** 交易所索引 */
    Index: number;
    /** 返回该事件时兼容队列中仍在等待的事件数 */
    Queue: number;
    /** 事件时间（纳秒） */
    Nano: number;
    /** 相关交易对（行情/订单事件才有） */
    Symbol?: string;
    /** 如果是行情事件，包含Ticker数据 */
    Ticker?: ITicker;
    /** 如果是订单事件，包含Order数据 */
    Order?: IOrder;
}

/**
 * 图表对象，用于在策略页面绘制自定义图表
 * 通过 Chart() 或 KLineChart() 创建
 *
 * ```js
 * var chart = Chart({
 *     title: { text: "价格走势" },
 *     xAxis: { type: "datetime" },
 *     series: [{ name: "价格", data: [] }]
 * });
 * chart.add(0, [Date.now(), ticker.Last]);
 * ```
 */
interface IChart {
    /**
     * 向图表指定系列添加数据点
     * @param series - 系列索引（从0开始）
     * @param data - 数据点，格式取决于图表类型（如 [时间戳, 值] 或 单个值）
     * @param index - 更新指定索引处的数据点（不传则追加到末尾，-1更新最后一个）
     */
    add(series: number, data: any, index?: number): void;
    /**
     * 向图表添加数据点（数组形式）
     * @param data - [系列索引, 数据点] 或 [系列索引, 数据点, 更新索引] 形式的数组
     * ```js
     * chart.add([0, [new Date().getTime(), ticker.Buy]]);
     * ```
     */
    add(data: any[]): void;

    /**
     * 重置图表数据
     * @param remain - 保留最近的数据点数量，默认 0（全部清除）
     */
    reset(remain?: number): void;

    /**
     * 删除指定系列
     * @param series - 要删除的系列索引
     */
    del(series: number): void;

    /**
     * 更新图表配置选项
     * @param options - 新的图表配置（Highcharts/Highstock配置对象）
     */
    update(options: object): void;
}

/**
 * K线图表控制对象，由 KLineChart() 创建，提供类似 Pine Script 的画图方法
 * 画图操作必须在K线数据上遍历执行，每根K线以 begin(bar) 开始、以 close() 结束
 *
 * 各画图方法的可选参数既支持按声明顺序位置传参，也支持把选项对象作为最后一个参数传入
 *
 * ```js
 * var c = KLineChart({ overlay: true });
 * var bars = exchange.GetRecords();
 * bars.forEach(function(bar, index) {
 *     c.begin(bar);
 *     c.barcolor(bar.Close > bar.Open ? 'rgba(255,0,0,0.2)' : 'rgba(0,0,0,0.2)');
 *     var h = c.plot(bar.High, 'high');
 *     var l = c.plot(bar.Low, 'low');
 *     c.fill(h, l, { color: 'rgba(255,0,0,0.2)' });
 *     c.close();
 * });
 * ```
 */
interface IKLineChart {
    /**
     * 开始处理一根K线，必须作为每根K线画图操作的起始调用
     * @param bar - 当前K线柱数据（IRecord）
     */
    begin(bar: IRecord): void;

    /**
     * 结束当前K线的画图操作并输出到图表，必须与 begin(bar) 配对调用
     * @param bar - 当前K线柱数据（可省略，运行时忽略该参数）
     */
    close(bar?: IRecord): void;

    /**
     * 重置图表数据
     * @param remain - 保留最近的数据点数量，默认 0（全部清除）
     */
    reset(remain?: number): void;

    /**
     * 在图表上画线（类似 Pine 的 plot）
     * @param series - 数据值（传 NaN 表示该K线处不画，可画不连续线段）
     * @param title - 线条名称
     * @param options - 选项对象: { color, linewidth, style("line"|"linebr"|"histogram"等), offset, join, histbase, display, overlay } 等
     * @returns 绘图对象索引（可传给 fill 使用）
     * ```js
     * var h = c.plot(bar.High, 'high');
     * c.plot(bar.Open < bar.Close ? NaN : bar.Close, "Close", {style: "linebr"});
     * ```
     */
    plot(series: number, title?: string | { [key: string]: any }, options?: { [key: string]: any }): number;

    /**
     * 在指定价格画水平线
     * @param price - 水平线价格
     * @param title - 线条名称
     * @param options - 选项对象: { color, linestyle("dashed"|"dotted"|"solid"), linewidth, display, overlay } 等
     * @returns 绘图对象索引（可传给 fill 使用）
     */
    hline(price: number, title?: string | { [key: string]: any }, options?: { [key: string]: any }): number;

    /**
     * 在K线上画图形标记
     * @param series - 数据值或条件（真值时画标记；location 为 "absolute" 时为价格位置）
     * @param title - 标记名称
     * @param options - 选项对象: { style("diamond"等), location("abovebar"|"belowbar"|"absolute"), color, offset, text, textcolor, size } 等
     * ```js
     * c.plotshape(bar.Low, { style: 'diamond' });
     * ```
     */
    plotshape(series: number | boolean, title?: string | { [key: string]: any }, options?: { [key: string]: any }): void;

    /**
     * 在K线上画字符标记
     * @param series - 数据值或条件（真值时画标记；location 为 "absolute" 时为价格位置）
     * @param title - 标记名称
     * @param options - 选项对象: { char(必需), location("abovebar"|"belowbar"|"absolute"), color, offset, text, textcolor, size } 等
     * ```js
     * c.plotchar(bar.Close, { char: 'X' });
     * ```
     */
    plotchar(series: number | boolean, title?: string | { [key: string]: any }, options?: { [key: string]: any }): void;

    /**
     * 画上下箭头，正值画向上箭头，负值画向下箭头，绝对值决定箭头长度
     * @param series - 数据值
     * @param title - 名称
     * @param options - 选项对象: { colorup, colordown, offset, minheight, maxheight } 等
     * ```js
     * c.plotarrow(bar.Close - bar.Open);
     * ```
     */
    plotarrow(series: number, title?: string | { [key: string]: any }, options?: { [key: string]: any }): void;

    /**
     * 画自定义蜡烛图
     * @param open - 开盘价
     * @param high - 最高价
     * @param low - 最低价
     * @param close - 收盘价
     * @param title - 名称
     * @param options - 选项对象: { color, wickcolor, bordercolor, display } 等
     * ```js
     * c.plotcandle(bar.Open*0.9, bar.High*0.9, bar.Low*0.9, bar.Close*0.9);
     * ```
     */
    plotcandle(open: number, high: number, low: number, close: number, title?: string | { [key: string]: any }, options?: { [key: string]: any }): void;

    /**
     * 设置当前K线柱的颜色
     * @param color - 颜色字符串，如 'rgba(255, 0, 0, 0.2)' 或 '#ff0000'
     * @param options - 选项对象: { offset, show_last, title, display } 等
     */
    barcolor(color: string, options?: { [key: string]: any }): void;

    /**
     * 设置当前K线位置的背景颜色
     * @param color - 颜色字符串，如 'rgba(0, 255, 0, 0.5)'
     * @param options - 选项对象: { offset, show_last, title, display, overlay } 等
     */
    bgcolor(color: string, options?: { [key: string]: any }): void;

    /**
     * 填充两个绘图对象（plot/hline 的返回值）之间的区域
     * @param plot1 - 第一个绘图对象索引
     * @param plot2 - 第二个绘图对象索引
     * @param options - 选项对象: { color, fillgaps, show_last, title, display } 等
     * ```js
     * var h = c.plot(bar.High, 'high');
     * var l = c.plot(bar.Low, 'low');
     * c.fill(h, l, { color: 'rgba(255, 0, 0, 0.2)' });
     * ```
     */
    fill(plot1: number, plot2: number, options?: { [key: string]: any }): void;

    /**
     * 在图表上标记交易信号
     * @param direction - 信号方向: "buy"/"long"(开多), "sell"/"short"(开空), "closebuy"/"closelong"(平多), "closesell"/"closeshort"(平空)
     * @param price - 信号价格
     * @param qty - 信号数量
     * @param id - 信号标识（可选，默认使用 direction）
     * ```js
     * c.signal("long", bar.High, 1.5);
     * c.signal("closelong", bar.Low, 1.5);
     * ```
     */
    signal(direction: string, price: number, qty: number, id?: string): void;
}

/**
 * 条件单参数结构体，定义止盈止损的触发条件
 *
 * ```js
 * // 止盈条件
 * var tpCondition = {
 *     ConditionType: ORDER_CONDITION_TYPE_TP,
 *     TpTriggerPrice: 55000,   // 价格达到55000时触发
 *     TpOrderPrice: 54900      // 以54900的价格下单
 * };
 * // 止损条件
 * var slCondition = {
 *     ConditionType: ORDER_CONDITION_TYPE_SL,
 *     SlTriggerPrice: 48000,
 *     SlOrderPrice: 47900
 * };
 * // OCO条件（同时设置止盈止损）
 * var ocoCondition = {
 *     ConditionType: ORDER_CONDITION_TYPE_OCO,
 *     TpTriggerPrice: 55000, TpOrderPrice: 54900,
 *     SlTriggerPrice: 48000, SlOrderPrice: 47900
 * };
 * ```
 */
declare interface ICondition {
    /** 条件类型: ORDER_CONDITION_TYPE_OCO(0), TP(1-止盈), SL(2-止损), GENERIC(3-通用) */
    ConditionType:  number;
    /** 止盈触发价格 */
    TpTriggerPrice?: number;
    /** 止盈下单价格（触发后以此价格下单） */
    TpOrderPrice?:   number;
    /** 止损触发价格 */
    SlTriggerPrice?: number;
    /** 止损下单价格（触发后以此价格下单） */
    SlOrderPrice?:   number;
}

/**
 * HttpQuery 请求选项
 *
 * ```js
 * var ret = HttpQuery("https://api.example.com/data", {
 *     method: "POST",
 *     body: JSON.stringify({key: "value"}),
 *     headers: {"Content-Type": "application/json"},
 *     timeout: 5000,
 *     debug: true   // 返回完整响应（含状态码和头部）
 * });
 * ```
 */
declare interface IHttpOptions {
    /** HTTP方法: "GET", "POST", "PUT", "DELETE" 等，默认 "GET" */
    method?: string;
    /** 请求体（POST等方法时使用），可以是字符串或二进制数据 */
    body?: string | ArrayBuffer;
    /** 代理地址，如 "socks5://127.0.0.1:1080" */
    proxy?: string;
    /** 响应字符编码转换（如 "gbk"），用于处理非UTF-8编码的响应 */
    charset?: string;
    /** Cookie字符串 */
    cookie?: string;
    /** TLS指纹配置 */
    profile?: string;
    /** 设为 true 时返回完整响应对象（含状态码、响应头）；false 时仅返回Body字符串 */
    debug?: boolean;
    /** 响应Body的输出格式: "base64" 或 "hex"，不设则返回字符串 */
    format?: "base64" | "hex";
    /** 是否在请求后关闭连接（禁用 keep-alive） */
    close?: boolean;
    /** 自定义请求头 */
    headers?: { [key: string]: any };
    /** 请求超时时间（毫秒），默认 300000（5分钟） */
    timeout?: number;
}

/**
 * HttpQuery debug模式返回的完整响应结构体
 */
declare interface IHttpRet {
    /** HTTP状态码，如 200, 404, 500；请求没拿到应答（拒绝连接、DNS、超时、代理失败）时为 0 */
    StatusCode: number;
    /** 请求追踪信息（debug时可用） */
    Trace?: any;
    /** 响应头字典，每个key对应一个字符串数组（同名头可能有多个值） */
    Header: { [key: string]: string[] };
    /** Cookies 信息（debug 时可用） */
    Cookies?: any[];
    /** 报文长度 */
    Length?: number;
    /** 响应体内容，可以是字符串或二进制数据，请求失败时为空字符串 */
    Body: string | ArrayBuffer;
    /** 请求失败原因（方法 + URL + 底层错误），只在 StatusCode 为 0 时出现 */
    Error?: string;
}

// ==================== 全局变量 ====================

/** TA-Lib 技术分析库全局实例，包含100+技术指标函数 */
declare const talib: Italib;

/** FMZ内置技术分析库，包含常用指标（KDJ, BOLL, MACD等）的简化版本 */
declare const TA: ITA;

/** 多线程管理对象，用于创建和管理工作线程 */
declare const threading: IThreading;

/** 第一个（默认）交易所对象，等价于 exchanges[0] */
declare const exchange: IExchange;

/** 所有已添加的交易所对象数组，通过 exchanges[i] 访问第i个交易所 */
declare const exchanges: IExchange[];


// ==================== 全局函数 ====================

/**
 * 获取托管者版本号
 * @returns 版本号字符串
 * ```js
 * Log("版本:", Version());  // "3.7"
 * ```
 */
declare function Version(): string;

/**
 * 暂停策略执行指定毫秒数。在暂停期间会处理事件循环中的待处理事件。
 * 策略主循环中建议添加 Sleep 避免过于频繁的API请求。
 * @param millisecond - 暂停的毫秒数
 * ```js
 * while (true) {
 *     var ticker = exchange.GetTicker();
 *     Log(ticker.Last);
 *     Sleep(1000);  // 每秒执行一次
 * }
 * ```
 */
declare function Sleep(millisecond: number): void;

/**
 * 异步睡眠：返回一个在指定毫秒后 resolve 的 Promise，用于 async 策略里的 `await sleepAsync(1000)`。
 * 与 Sleep 不同，它不阻塞事件循环，等待期间定时器、其它 Promise 照常运行；参数必须是数字。
 * ```js
 * async function main() {
 *     while (true) {
 *         Log(exchange.GetTicker().Last);
 *         await sleepAsync(1000);
 *     }
 * }
 * ```
 * @param millisecond - 毫秒
 */
declare function sleepAsync(millisecond: number): Promise<void>;

/**
 * 判断当前是否在回测（模拟）环境中运行
 * @returns 回测环境返回 true，实盘环境返回 false
 * ```js
 * if (IsVirtual()) {
 *     Log("当前为回测模式");
 * } else {
 *     Log("当前为实盘模式");
 * }
 * ```
 */
declare function IsVirtual(): boolean;

/**
 * 通过SMTP发送邮件通知
 * @param smtpServer - SMTP服务器地址，如 "smtp.qq.com:465"
 * @param smtpUsername - SMTP登录用户名（通常为邮箱地址）
 * @param smtpPassword - SMTP登录密码或授权码
 * @param mailTo - 收件人邮箱地址
 * @param title - 邮件标题
 * @param body - 邮件正文
 * @returns 发送成功返回 true，失败返回 false
 * ```js
 * Mail("smtp.qq.com:465", "sender@qq.com", "auth_code", "receiver@gmail.com", "策略告警", "BTC价格突破50000");
 * ```
 */
declare function Mail(smtpServer: string, smtpUsername: string, smtpPassword: string, mailTo: string, title: string, body: string): boolean;

/**
 * Mail 函数的异步版本，立即返回并发对象，不阻塞当前线程
 * @param smtpServer - SMTP服务器地址，如 "smtp.qq.com:465"
 * @param smtpUsername - SMTP登录用户名（通常为邮箱地址）
 * @param smtpPassword - SMTP登录密码或授权码
 * @param mailTo - 收件人邮箱地址
 * @param title - 邮件标题
 * @param body - 邮件正文
 * @returns 并发对象，调用其 wait() 方法获取发送结果（成功返回 true，失败返回 false）
 * ```js
 * var r = Mail_Go("smtp.qq.com:465", "sender@qq.com", "auth_code", "receiver@gmail.com", "标题", "正文");
 * // ... 执行其他操作 ...
 * var ok = r.wait();  // 获取发送结果
 * ```
 */
declare function Mail_Go(smtpServer: string, smtpUsername: string, smtpPassword: string, mailTo: string, title: string, body: string): IGo;

/**
 * 设置错误信息过滤正则表达式，匹配的错误信息将不会记录到日志中
 * 常用于过滤频繁出现的无关错误。可多次调用添加多个过滤规则。
 * @param filters - 正则表达式字符串。传空字符串 "" 清除所有过滤规则
 * ```js
 * SetErrorFilter("timeout|503|rate limit");  // 过滤超时和限频错误
 * SetErrorFilter("");  // 清除所有过滤规则
 * ```
 */
declare function SetErrorFilter(filters: string): void;

/**
 * 获取当前托管者进程的PID
 * @returns 进程ID号
 * ```js
 * Log("进程PID:", GetPid());
 * ```
 */
declare function GetPid(): number;

/**
 * 获取最近一次错误信息并清除。调用后错误信息被消费，再次调用返回 null
 * @returns 最近的错误信息字符串，无错误时返回 null
 * ```js
 * exchange.GetTicker();
 * var err = GetLastError();
 * if (err) Log("发生错误:", err);
 * ```
 */
declare function GetLastError(): string | null;

/**
 * 获取策略交互命令。用于读取用户在FMZ平台策略页面发送的交互命令。
 * @returns 命令字符串（格式为 "按钮名:参数"），无命令时返回 null
 * ```js
 * var cmd = GetCommand();
 * if (cmd) {
 *     Log("收到命令:", cmd);
 *     var [name, value] = cmd.split(":");
 *     if (name === "buy") exchange.Buy(-1, parseFloat(value));
 * }
 * ```
 */
declare function GetCommand(): string | null;

/**
 * 获取策略元数据（在创建机器人时设置的附加数据）
 * @returns 元数据字符串，无数据时返回 null
 */
declare function GetMeta(): string | null;

/**
 * 创建网络连接（TCP/WebSocket/数据库等），用于与外部服务通信
 * @param address - 连接地址，支持多种协议:
 *   - WebSocket: "wss://stream.binance.com:9443/ws/btcusdt@ticker"
 *   - TCP: "tcp://host:port"
 *   - SQLite: "sqlite3:///path/to/db.sqlite3"
 *   - MySQL: "mysql://user:pass@host:port/dbname"
 *   - PostgreSQL: "postgres://user:pass@host:port/dbname?sslmode=disable"
 *   - ClickHouse: "clickhouse://user:pass@host:9000/db"（原生 TCP 协议，与旧托管者相同；
 *     9440 或 ?secure=true 为 TLS，?insecure=true 跳过证书校验）；
 *     "clickhouse+http://host:8123/db" / "clickhouse+https://host:8443/db" 走 HTTP 接口
 *
 *   地址末尾可用 `|` 分隔追加选项（同名键覆盖第二参），如:
 *   "wss://....|compress=gzip_raw&mode=recv"
 * @param timeoutMs - 连接超时时间（毫秒），默认 30000；也可传选项对象（或其 JSON 串）：
 *   headers 请求头；reconnect 自动重连；retry 最大重试次数（0 表示不限）；
 *   interval 重试间隔（毫秒，默认 1000）；payload 每次连接成功后发送的数据；
 *   compress 收到的二进制帧自动解压（gzip / gzip_raw / flate / zlib / deflate；mode 只支持 recv）；
 *   pingInterval 心跳间隔（毫秒）、pingMessage 心跳内容、pingType control（协议 Ping 帧，默认）或 text（文本帧）；
 *   insecureSkipVerify 是否跳过证书校验（默认 true）；proxy 代理地址；local_ip 本地出口 IP。
 * @returns IDial 连接对象，连接失败返回 null
 * ```js
 * // WebSocket实时行情
 * var ws = Dial("wss://stream.binance.com:9443/ws/btcusdt@ticker");
 * if (ws) {
 *     while (true) {
 *         var msg = ws.read(5000);
 *         if (msg) Log(JSON.parse(msg));
 *     }
 *     ws.close();
 * }
 * // 连接中断后由原生运行时重连；ws.fd() 始终返回同一个 fd
 * var ws = Dial("wss://example.com/ws", {reconnect: true, retry: 0, interval: 1000});
 * // SQLite数据库
 * var db = Dial("sqlite3:///strategy.db");
 * db.exec("CREATE TABLE IF NOT EXISTS logs(time TEXT, msg TEXT)");
 * ```
 */
declare function Dial(address: string|number, timeoutMs?: number | { [key: string]: any }): IDial | null;

/**
 * 发送HTTP请求（简单用法）
 * @param url - 请求URL
 * @param postData - POST数据（传入非空字符串自动变为POST请求）
 * @param cookies - Cookie字符串
 * @param headers - 请求头，支持字符串（换行分隔）或对象
 * @returns 响应Body字符串，失败返回 null
 * ```js
 * var data = HttpQuery("https://api.example.com/ticker");
 * Log(JSON.parse(data));
 * ```
 */
declare function HttpQuery(url: string, postData?: string | ArrayBuffer, cookies?: string, headers?: string | { [key: string]: string }): string | null;
/**
 * 发送HTTP请求（debug模式，返回完整响应信息）
 * @param url - 请求URL
 * @param options - 请求选项，设置 debug: true 返回完整响应
 * @returns 包含状态码、响应头、响应体的完整对象
 * ```js
 * var ret = HttpQuery("https://api.example.com/data", {
 *     method: "POST",
 *     body: JSON.stringify({key: "value"}),
 *     headers: {"Content-Type": "application/json"},
 *     debug: true
 * });
 * if (ret) Log("状态:", ret.StatusCode, "内容:", ret.Body);
 * ```
 */
declare function HttpQuery(url: string, options: { debug: true } & IHttpOptions): IHttpRet | null;
/**
 * 发送HTTP请求（带选项，仅返回Body字符串）
 * @param url - 请求URL
 * @param options - 请求选项
 * @returns 响应Body字符串，失败返回 null
 */
declare function HttpQuery(url: string, options?: { debug?: false } & IHttpOptions): string | null;
/**
 * 发送HTTP请求（通用重载）
 */
declare function HttpQuery(url: string, options: { debug?: boolean } & IHttpOptions): string | IHttpRet | null;

/**
 * HttpQuery 函数的异步版本，立即返回并发对象，不阻塞当前线程
 * @param url - 请求URL
 * @param options - 请求选项（同 HttpQuery），也支持旧式 postData 字符串
 * @param cookies - Cookie字符串（旧式调用形式）
 * @param headers - 请求头（旧式调用形式）
 * @returns 并发对象，调用其 wait() 方法获取HTTP请求结果
 * ```js
 * // 并发请求两个接口
 * var r1 = HttpQuery_Go("https://api.example.com/tickerA");
 * var r2 = HttpQuery_Go("https://api.example.com/tickerB");
 * var tickerA = JSON.parse(r1.wait());
 * var tickerB = JSON.parse(r2.wait());
 * ```
 */
declare function HttpQuery_Go(url: string, options?: string | ArrayBuffer | IHttpOptions, cookies?: string, headers?: string | { [key: string]: string }): IGo;


/**
 * 通用编码/加密/签名函数
 * @param algo - 算法名称:
 *   - 哈希: "md5", "sha256", "sha512", "sha1", "keccak256", "sha3.224/256/384/512"
 *   - HMAC: "hmac_md5", "hmac_sha256", "hmac_sha512", "hmac_sha1"
 *   - 加密: "aes128-cbc", "aes256-cbc", "aes192-cbc"
 *   - 签名: "ed25519", "ed25519.seed"
 *   - 编码: "raw", "text.encoder", "text.decoder"
 * @param inputFormat - 输入数据格式: "hex", "base64", "raw"(二进制), "string"(UTF-8字符串)
 * @param outputFormat - 输出数据格式: "hex", "base64", "raw"(二进制), "string"(UTF-8字符串)
 * @param data - 输入数据
 * @param keyFormat - 密钥格式（加密算法需要）: "hex", "base64", "raw", "string"
 * @param key - 密钥（加密算法需要）
 * @returns 编码后的结果
 * ```js
 * // HMAC-SHA256签名
 * var sign = Encode("hmac_sha256", "string", "hex", "message", "string", "secret");
 * // SHA256哈希
 * var hash = Encode("sha256", "string", "hex", "hello");
 * // AES加密
 * var encrypted = Encode("aes256-cbc", "string", "base64", "data", "string", "key");
 * ```
 */
declare function Encode(algo: string, inputFormat: "hex" | "base64" | "raw" | "string", outputFormat: "hex" | "base64" | "raw" | "string", data: string | ArrayBuffer, keyFormat?: string, key?: string): string | ArrayBuffer;

/**
 * 获取当前时间的纳秒级时间戳
 * @returns 纳秒时间戳（如 1609459200000000000）
 * ```js
 * var start = UnixNano();
 * // ... 执行操作 ...
 * var elapsed = (UnixNano() - start) / 1e6;  // 转换为毫秒
 * Log("耗时:", elapsed, "ms");
 * ```
 */
declare function UnixNano(): number;

/**
 * 获取当前时间的秒级时间戳
 * @returns 秒级时间戳（如 1609459200）
 * ```js
 * Log("当前时间戳:", Unix());
 * ```
 */
declare function Unix(): number;

/**
 * 获取托管者运行的操作系统和架构信息
 * @returns 格式为 "os/arch" 的字符串，如 "linux/amd64", "darwin/arm64", "windows/amd64"
 * ```js
 * Log("系统:", GetOS());  // "linux/amd64"
 * ```
 */
declare function GetOS(): string;

/**
 * 获取系统信息
 * @param attr - 信息类型:
 *   - "pid": 进程ID
 *   - "ppid": 父进程ID
 *   - "uid": 用户ID
 *   - "gid": 组ID
 *   - "ncpu": CPU核心数
 *   - "arch": CPU架构（如 "amd64"）
 *   - "os": 操作系统（如 "linux"）
 *   - "version": Go运行时版本
 *   - "sys_cpu": 系统CPU使用率(%)
 *   - "sys_mem": 系统内存信息
 *   - "cpu": 当前进程CPU使用率
 *   - "mem": 当前进程内存使用
 *   - "threads": 当前进程线程数
 *   - "go.NumGoroutine": Go协程数
 *   - "go.MemStats": Go内存统计
 * @returns 对应的系统信息值
 * ```js
 * Log("CPU核心数:", SysInfo("ncpu"));
 * Log("系统内存:", SysInfo("sys_mem"));
 * ```
 */
declare function SysInfo(attr: string): any;

/**
 * 计算字符串的MD5哈希值
 * @param data - 要计算哈希的字符串
 * @returns 32位十六进制MD5哈希字符串（小写）
 * ```js
 * Log(MD5("hello"));  // "5d41402abc4b2a76b9719d911017c592"
 * ```
 */
declare function MD5(data: string): string;

/**
 * 执行SQL语句，操作策略的内置SQLite数据库
 * 每个机器人有独立的SQLite数据库，数据持久保存。
 * SQL语句以 ":" 开头时使用内存数据库（重启后数据丢失）。
 * @param sql - SQL语句，支持参数化查询（用 ? 占位）
 * @param extra - SQL参数化查询的绑定值
 * @returns 查询结果对象（含 columns 和 values），失败返回 null
 * ```js
 * // 创建表
 * DBExec("CREATE TABLE IF NOT EXISTS trades(id INTEGER PRIMARY KEY, price REAL, amount REAL, time TEXT)");
 * // 插入数据
 * DBExec("INSERT INTO trades(price, amount, time) VALUES(?, ?, ?)", 50000, 0.1, _D());
 * // 查询数据
 * var ret = DBExec("SELECT * FROM trades ORDER BY id DESC LIMIT 10");
 * if (ret) {
 *     Log("列名:", ret.columns);  // ["id", "price", "amount", "time"]
 *     Log("数据:", ret.values);   // [[1, 50000, 0.1, "2024-01-01 00:00:00"], ...]
 * }
 * // 使用内存数据库
 * DBExec(":CREATE TABLE cache(k TEXT, v TEXT)");
 * ```
 */
declare function DBExec(sql: string, ...extra: any[]): IDBExecRet | null;

/**
 * 生成UUID字符串（包含时间组件）
 * @returns UUID字符串
 * ```js
 * Log(UUID());  // "550e8400-e29b-41d4-a716-446655440000"
 * ```
 */
declare function UUID(): string;

/**
 * 等待兼容事件循环中的下一个事件：Rust统一ctx.poll返回的旧tick/order业务事件、线程消息、exchange.Go/
 * HttpQuery_Go/Mail_Go完成，以及旧Dial WebSocket可读通知。原生WebSocket、Promise
 * 和定时器按各自回调执行，等待期间会被推进，但不会额外生成EventLoop消息。
 * 同一个Dial fd在read()消费当前帧前最多投递一次；若队列仍有帧，消费后才登记下一次通知。
 * depth/trade/kline/timer/status属于ctx.poll扩展事件：EventLoop会排空但不返回，避免改变旧策略分支。
 * EventLoop恢复旧消息格式和已知订单元数据；与直接ctx.poll消费同一来源队列，同一策略应选择一个消费入口。
 * 首次调用会为各账户惰性订阅当前交易对ticker和orders事件；SetCurrency/SetContractType
 * 会同步切换ticker订阅。
 * @param timeoutMs - 超时时间（毫秒）:
 *   - 不传或0: 阻塞等待直到有事件
 *   - 正数: 等待指定毫秒，超时返回 null
 *   - 负数(-1): 非阻塞，无事件立即返回 null
 * @returns 事件消息对象，超时或无事件返回 null
 * ```js
 * // 事件驱动循环
 * while (true) {
 *     var ev = EventLoop(1000);
 *     if (ev) {
 *         Log("事件:", ev.Event, "交易所:", ev.Index, "交易对:", ev.Symbol);
 *     }
 * }
 * ```
 */
declare function EventLoop(timeoutMs?: number): IEventMsg | null;

/**
 * 翻译函数，用于策略国际化
 * @param a - 要翻译的字符串
 * @param b - 翻译后的字符串（可选）
 * @returns 翻译后的字符串
 */
declare function _T(a: string, b?: string): string;

/**
 * 全局持久化KV存储，数据保存在策略数据库中，重启后仍然保留
 * @param k - 键名
 * @param v - 值（可选）:
 *   - 不传: 读取键对应的值
 *   - 传null: 删除该键
 *   - 传其他值: 保存键值对
 * @returns 读取时返回对应的值，写入时无有意义的返回值。无参数调用返回机器人ID
 * ```js
 * _G("lastPrice", 50000);          // 保存
 * var price = _G("lastPrice");     // 读取 -> 50000
 * _G("lastPrice", null);           // 删除
 * _G(null);                        // 清空所有KV数据
 * _G();                            // 获取机器人ID
 * ```
 */
declare function _G(k?: string, v?: any): any;

/**
 * 格式化时间戳为可读的日期字符串（本地时区）
 * @param timestamp - 时间戳（毫秒）或Date对象。不传使用当前时间
 * @param fmt - 日期格式字符串，默认 "yyyy-MM-dd hh:mm:ss"。占位符 yyyy、yy、MM、dd、hh（24 小时制）、
 *   mm、ss，另支持 HH（同 hh）与 SSS（毫秒）；每个占位符只替换第一处，其余字符原样保留，
 *   例如 "yyyy-MM-ddThh:mm:ss.999Z" 中的 T、.999、Z 都会照抄
 * @returns 格式化后的日期字符串
 * ```js
 * Log(_D());                    // "2024-01-15 10:30:45"
 * Log(_D(1705284645000));       // "2024-01-15 10:30:45"
 * Log(_D(new Date()));          // "2024-01-15 10:30:45"
 * Log(_D(ts, "yyyy-MM-ddThh:mm:ss.SSSZ"));  // "2024-01-15T10:30:45.123Z"（本地时间）
 * ```
 */
declare function _D(timestamp?: number | Date, fmt?: string): string;

/**
 * 数字精度截断（向下截断到指定小数位数，不四舍五入）
 * @param num - 要截断的数字
 * @param precision - 保留的小数位数
 * @returns 截断后的数字
 * ```js
 * Log(_N(3.14159, 2));  // 3.14
 * Log(_N(3.14959, 2));  // 3.14（不四舍五入，直接截断）
 * ```
 */
declare function _N(num: number, precision: number): number;

/**
 * 容错重试函数，自动反复调用函数直到返回非null值
 * 常用于包装可能因网络问题返回null的API调用
 * @param pfn - 要重试调用的函数
 * @param args - 传递给函数的参数
 * @returns 函数成功返回的非null值
 * ```js
 * // 保证获取到Ticker（内部会不断重试直到成功）
 * var ticker = _C(exchange.GetTicker);
 * // 带参数的重试调用
 * var depth = _C(exchange.GetDepth, "BTC_USDT");
 * var account = _C(exchange.GetAccount);
 * ```
 */
declare function _C<T extends (...args: any[]) => any>( pfn: T, ...args: Parameters<T>): NonNullable<ReturnType<T>>;

/**
 * 设置 _C() 函数的重试间隔（默认 3000 毫秒）
 * @param ms - 重试间隔（毫秒），必须大于 0
 * ```js
 * _CDelay(1000);  // 将 _C() 重试间隔改为1秒
 * var ticker = _C(exchange.GetTicker);
 * ```
 */
declare function _CDelay(ms: number): void;

/**
 * 判断两条线是否发生交叉（金叉/死叉）
 * @param arr1 - 第一条线的数据数组
 * @param arr2 - 第二条线的数据数组
 * @returns 正数表示金叉（arr1上穿arr2），负数表示死叉（arr1下穿arr2），0表示无交叉
 * ```js
 * var ema5 = talib.EMA(records, 5);
 * var ema20 = talib.EMA(records, 20);
 * var cross = _Cross(ema5, ema20);
 * if (cross > 0) Log("金叉！5日均线上穿20日均线");
 * if (cross < 0) Log("死叉！5日均线下穿20日均线");
 * ```
 */
declare function _Cross(arr1: number[], arr2: number[]): boolean;

/**
 * 安全的JSON解析，解析失败时抛出异常（而非返回undefined）
 * @param s - 要解析的JSON字符串
 * @returns 解析后的对象
 * ```js
 * var obj = JSONParse('{"price": 50000, "amount": 0.1}');
 * Log(obj.price);  // 50000
 * ```
 */
declare function JSONParse(s: string): object;

/**
 * FMZ 扩展：JSON.parse 的第二个参数支持传布尔值 safeStr
 * safeStr 为 true 时以安全模式解析，大数字自动转为字符串，避免精度丢失
 *
 * ```js
 * var obj = JSON.parse('{"num": 8754613197327563525}', true);
 * Log(obj.num);  // "8754613197327563525"（字符串，精度不丢失）
 * ```
 */
interface JSON {
    parse(text: string, safeStr?: boolean | ((this: any, key: string, value: any) => any)): any;
}

/**
 * 重载：parseInt 也接受数字参数（JS运行时会自动转换），如 parseInt(Date.now() / 1000)
 */
declare function parseInt(value: string | number, radix?: number): number;

// ==================== 日志函数 ====================

/**
 * 输出日志到策略日志区域
 * 支持特殊后缀控制日志颜色: s + "#FF0000" 显示红色
 * @param s - 日志内容，支持任意类型
 * @param extra - 额外的日志参数，会拼接到后面
 * ```js
 * Log("普通日志");
 * Log("红色日志 #FF0000");       // 红色显示
 * Log("价格:", ticker.Last, "数量:", 0.1);
 * Log(exchange.GetAccount());      // 直接输出对象
 * ```
 */
declare function Log(s: any, ...extra: any[]): void;

/**
 * 记录收益数据并绘制收益曲线
 * @param profit - 收益值
 * @param extra - 附加日志信息
 * ```js
 * LogProfit(100.5);                   // 记录收益100.5
 * LogProfit(100.5, "本次交易盈利");    // 带备注
 * ```
 */
declare function LogProfit(profit: number, ...extra: any[]): void;

/**
 * 重置收益日志
 * @param remain - 保留最近的记录数量，默认 0（全部清除）
 * ```js
 * LogProfitReset();    // 清除所有收益记录
 * LogProfitReset(10);  // 保留最近10条
 * ```
 */
declare function LogProfitReset(remain?: number): void;

/**
 * 设置策略状态栏信息（显示在机器人页面顶部）
 * 支持 Markdown 表格、HTML等格式
 * @param s - 状态信息字符串
 * ```js
 * LogStatus("当前价格: " + ticker.Last + " | 持仓: " + position.Amount);
 * // Markdown表格
 * LogStatus("`" + JSON.stringify({type:"table", title:"持仓", cols:["币种","数量"], rows:[["BTC","0.1"]]}) + "`");
 * ```
 */
declare function LogStatus(s: any, ...extra: any[]): void;

/**
 * 开启或关闭日志记录
 * @param enable - true开启，false关闭日志记录
 * ```js
 * EnableLog(false);  // 关闭日志（减少数据库写入）
 * EnableLog(true);   // 重新开启
 * ```
 */
declare function EnableLog(enable: boolean): void;

/**
 * 创建自定义图表（基于Highcharts/Highstock），用于在策略页面绘制图表
 *
 * 【首选】支持最全面的图表类型（折线/柱状/散点/面积/K线等）。一般绘图请优先使用 Chart；
 * 仅当确实需要 Pine 风格 K 线/蜡烛图时才用 KLineChart。
 * @param options - Highcharts/Highstock图表配置对象，或配置数组（多图）
 * @returns IChart图表对象，用于动态添加数据
 * ```js
 * var chart = Chart({
 *     title: { text: "价格走势" },
 *     xAxis: { type: "datetime" },
 *     series: [
 *         { name: "价格", type: "line", data: [] },
 *         { name: "MA5", type: "line", data: [] }
 *     ]
 * });
 * // 动态添加数据
 * chart.add(0, [Date.now(), ticker.Last]);   // 添加价格点
 * chart.add(1, [Date.now(), ma5Value]);      // 添加MA5点
 * chart.reset();                              // 清空图表
 * ```
 */
declare function Chart(options: object | Array<object>): IChart;

/**
 * 创建K线图表控制对象，提供类似 Pine Script 的画图方法（plot/hline/plotshape/signal 等）
 *
 * 【专用】仅用于绘制 K 线/蜡烛图；一般绘图请优先使用 Chart（类型更全面）。
 * @param options - K线图表配置对象，支持 { overlay, pricePrecision, volumePrecision } 等属性，可省略
 * @returns IKLineChart 图表控制对象，画图时每根K线以 begin(bar) 开始、close() 结束
 * ```js
 * var c = KLineChart({
 *     overlay: true  // 在主图上叠加显示
 * });
 * var bars = exchange.GetRecords();
 * bars.forEach(function(bar) {
 *     c.begin(bar);
 *     c.plot(bar.High, 'high');
 *     c.close();
 * });
 * ```
 */
declare function KLineChart(options?: object): IKLineChart;

/**
 * 重置所有日志
 * @param remain - 保留最近的日志条数，默认 0（全部清除）
 * ```js
 * LogReset();     // 清除所有日志
 * LogReset(100);  // 保留最近100条
 * ```
 */
declare function LogReset(remain?: number): void;

/**
 * 对策略数据库执行 VACUUM 操作，回收数据库空间
 * 在大量删除日志后调用可以减小数据库文件体积
 */
declare function LogVacuum(): void;


// ==================== 多线程接口 ====================

/**
 * 线程执行结果结构体，由 thread.join() 返回
 */
declare interface IThreadRet {
    /** 线程ID */
    id: number;
    /** 是否被强制终止（true=被terminate()终止，false=正常结束） */
    terminated: boolean;
    /** 线程执行耗时（纳秒） */
    elapsed: number;
    /** 线程函数的返回值 */
    ret: any;
}

/**
 * 线程对象，由 threading.Thread() 创建
 * 每个线程运行在独立的JS上下文中，通过消息传递进行通信
 *
 * ```js
 * var t = threading.Thread(function(symbol) {
 *     while (true) {
 *         var ticker = exchange.GetTicker(symbol);
 *         threading.currentThread().postMessage(ticker);
 *         Sleep(1000);
 *     }
 * }, "BTC_USDT");
 *
 * var msg = t.peekMessage(5000);
 * Log("收到:", msg);
 * t.terminate();
 * ```
 */
declare interface IThread {
    /**
     * 从线程接收消息
     * @param timeoutMs - 超时时间（毫秒）:
     *   - 不传或0: 阻塞等待
     *   - 正数: 等待指定毫秒
     *   - 负数(-1): 非阻塞，无消息立即返回 undefined
     * @returns 线程发送的消息，超时返回 undefined，线程已关闭返回 null
     */
    peekMessage(timeoutMs?: number): any | null;

    /**
     * 向线程发送消息
     * @param msg - 要发送的消息（会被序列化传递，不共享引用）
     */
    postMessage(msg: any): void;

    /**
     * 等待线程执行完毕并获取结果
     * @param timeoutMs - 超时时间（毫秒），不传则阻塞等待
     * @returns 线程执行结果对象，超时返回 null
     * ```js
     * var t = threading.Thread(function() { return 42; });
     * var result = t.join();
     * Log("结果:", result.ret);  // 42
     * Log("耗时:", result.elapsed / 1e6, "ms");
     * ```
     */
    join(timeoutMs?: number): IThreadRet | null;

    /**
     * 强制终止线程
     */
    terminate(): void;

    /**
     * 获取线程本地存储的数据（跨线程可读）
     * @param key - 数据键名
     * @returns 对应的值
     */
    getData(key: string): any;

    /**
     * 设置线程本地存储的数据（跨线程可读）
     * @param key - 数据键名
     * @param value - 数据值（会被序列化）
     */
    setData(key: string, value: any): void;

    /**
     * 在线程内等待事件
     * @param timeoutMs - 超时时间（毫秒）
     * @returns 事件消息，超时返回 null
     */
    eventLoop(timeoutMs?: number): IEventMsg | null;

    /**
     * 获取线程ID
     * @returns 线程ID号
     */
    id(): number;

    /**
     * 获取线程名称
     * @returns 线程名称，如 "Thread-1"
     */
    name(): string;
}

/**
 * 线程互斥锁，用于保护共享资源的并发访问
 *
 * ```js
 * var lock = threading.Lock();
 * // 在多线程中使用
 * lock.acquire();
 * try {
 *     // 访问共享资源
 * } finally {
 *     lock.release();
 * }
 * ```
 */
declare interface IThreadLock {
    /** 获取锁（阻塞直到获得锁） */
    acquire(): void;
    /** 释放锁 */
    release(): void;
}

/**
 * 线程事件，用于线程间的信号通知
 *
 * ```js
 * var event = threading.Event();
 * // 线程A中等待
 * event.wait(5000);  // 等待最多5秒
 * // 线程B中触发
 * event.set();
 * ```
 */
declare interface IThreadEvent {
    /** 设置事件（触发等待中的线程） */
    set(): void;
    /** 清除事件状态 */
    clear(): void;
    /**
     * 等待事件被设置
     * @param timeoutMs - 超时时间（毫秒）
     * @returns true=事件已设置, false=超时
     */
    wait(timeoutMs?: number): boolean;
    /** 检查事件是否已设置 */
    isSet(): boolean;
}

/**
 * 线程条件变量，结合锁实现复杂的线程同步
 *
 * ```js
 * var cond = threading.Condition();
 * // 等待方
 * cond.acquire();
 * cond.wait();      // 释放锁并等待通知
 * cond.release();
 * // 通知方
 * cond.acquire();
 * cond.notify();    // 唤醒一个等待线程
 * cond.release();
 * ```
 */
declare interface IThreadCondition {
    /** 唤醒一个等待的线程 */
    notify(): void;
    /** 唤醒所有等待的线程 */
    notifyAll(): void;
    /** 释放锁并等待通知（被唤醒后重新获取锁） */
    wait(): void;
    /** 获取关联的锁 */
    acquire(): void;
    /** 释放关联的锁 */
    release(): void;
}

/**
 * 线程安全的共享字典，用于多线程间共享数据
 *
 * ```js
 * var dict = threading.Dict();
 * dict.set("price", 50000);
 * // 在另一个线程中
 * var price = dict.get("price");  // 50000
 * ```
 */
declare interface IThreadDict {
    /**
     * 获取指定键的值
     * @param key - 键名
     * @returns 对应的值
     */
    get(key: string): any;
    /**
     * 设置键值对
     * @param key - 键名
     * @param value - 值
     */
    set(key: string, value: any): void;
}

/**
 * 多线程管理接口，用于创建和管理工作线程
 * 通过全局变量 `threading` 访问
 *
 * ```js
 * // 创建线程执行函数
 * var t1 = threading.Thread(function() {
 *     return exchange.GetTicker();
 * });
 * var t2 = threading.Thread(function() {
 *     return exchange.GetAccount();
 * });
 * var ticker = t1.join().ret;
 * var account = t2.join().ret;
 * ```
 */
declare interface IThreading {
    /**
     * 创建新的工作线程（传入函数和参数）
     * 函数和参数会被序列化到新的JS上下文中执行，不共享变量
     * @param f - 要在线程中执行的函数
     * @param args - 传递给函数的参数
     * @returns 线程对象
     * ```js
     * var t = threading.Thread(function(a, b) {
     *     return a + b;
     * }, 1, 2);
     * Log(t.join().ret);  // 3
     * ```
     */
    Thread(f: Function, ...args: any[]): IThread;

    /**
     * 创建新的工作线程（传入命令数组形式）
     * 每个数组项为 [函数, 参数1, 参数2, ...] 的格式
     * @param item - 第一个命令数组
     * @param items - 更多命令数组
     * @returns 线程对象
     */
    Thread(item: Array<any>, ...items: Array<any>[]): IThread;

    /**
     * 根据线程ID获取线程对象
     * @param num - 线程ID
     * @returns 线程对象
     */
    getThread(num: number): IThread;

    /**
     * 获取主线程对象
     * @returns 主线程
     */
    mainThread(): IThread;

    /**
     * 获取当前线程对象（在工作线程内调用）
     * @returns 当前线程
     */
    currentThread(): IThread;

    /**
     * 创建互斥锁
     * @returns 锁对象
     */
    Lock(): IThreadLock;

    /**
     * 创建条件变量
     * @returns 条件变量对象
     */
    Condition(): IThreadCondition;

    /**
     * 创建事件
     * @returns 事件对象
     */
    Event(): IThreadEvent;

    /**
     * 创建线程安全共享字典
     * @returns 字典对象
     */
    Dict(): IThreadDict;

    /**
     * 获取当前活跃的线程数量
     * @returns 活跃线程数
     */
    pending(): number;
}

// ==================== 旧版线程API（已废弃，建议使用 threading 模块） ====================

/**
 * @deprecated 已废弃，请使用 `threading.Thread` 替代
 * 创建工作线程
 * @param f - 线程函数
 * @param args - 函数参数
 * @returns 线程ID
 */
declare function __Thread(f: Function, ...args: any[]): number;

/**
 * @deprecated 已废弃，请使用 `threading.Thread` 替代
 * 创建工作线程（数组命令形式）
 */
declare function __Thread(item: Array<any>, ...items: Array<any>[]): number;

/**
 * @deprecated 已废弃，请使用 `thread.peekMessage` 替代
 * 从当前线程接收消息
 */
declare function __threadPeekMessage(timeoutMs?: number): any | null;

/**
 * @deprecated 已废弃，请使用 `thread.postMessage` 替代
 * 向指定线程发送消息
 */
declare function __threadPostMessage(threadId: number, msg: any): void;

/**
 * @deprecated 已废弃，请使用 `thread.join` 替代
 * 等待线程完成并获取结果
 */
declare function __threadJoin(threadId: number, timeoutMs?: number): IThreadRet | null;

/**
 * @deprecated 已废弃，请使用 `thread.terminate` 替代
 * 强制终止线程
 */
declare function __threadTerminate(threadId: number): void;

/**
 * @deprecated 已废弃，请使用 `thread.getData` 替代
 * 获取线程数据
 */
declare function __threadGetData(threadId: number, key: string): any;

/**
 * @deprecated 已废弃，请使用 `thread.setData` 替代
 * 设置线程数据
 */
declare function __threadSetData(threadId: number, key: string, value: any): void;

/**
 * @deprecated 已废弃，请使用 `threading.currentThread().id()` 替代
 * 获取当前线程ID
 */
declare function __threadId(): number;

/**
 * @deprecated 已废弃，请使用 `threading.pending()` 替代
 * 获取活跃线程数
 */
declare function __threadPending(running?:boolean): number;


/**
 * HTTP/TCP服务器请求上下文，提供请求信息和响应方法
 * 在 __Serve 的处理函数中使用
 *
 * ```js
 * __Serve("http://0.0.0.0:8080", function(ctx) {
 *     if (ctx.method() === "POST") {
 *         var body = ctx.body();
 *         Log("收到POST:", body);
 *     }
 *     ctx.setHeader("Content-Type", "application/json");
 *     ctx.write(JSON.stringify({status: "ok"}));
 * });
 * ```
 */
interface IServeContext {
    /** 获取客户端远程地址，如 "192.168.1.100:54321" */
    remoteAddr: () => string;
    /** 获取服务端本地监听地址 */
    localAddr: () => string;
    /**
     * 读取数据（WebSocket模式下使用）
     * @param timeoutMs - 超时时间（毫秒）
     * @returns 接收到的数据，超时返回 null
     */
    read: (timeoutMs?: number) => string | null;
    /** 获取HTTP请求体内容 */
    body: () => string | null;
    /** 向客户端写入响应数据 */
    write: (data: string) => void;
    /** 获取请求路径，如 "/api/data" */
    path: () => string;
    /** 获取HTTP请求方法，如 "GET", "POST" */
    method: () => string;
    /** 获取所有请求头（键值对） */
    headers: () => Record<string, string>;
    /**
     * 获取指定请求头的值
     * @param name - 请求头名称
     * @returns 请求头值，不存在返回 undefined
     */
    header: (name: string) => string | undefined;
    /**
     * 设置HTTP响应状态码
     * @param status - HTTP状态码，如 200, 404, 500
     */
    setStatus: (status: number) => void;
    /**
     * 设置HTTP响应头
     * @param key - 响应头名称
     * @param value - 响应头值
     */
    setHeader: (key: string, value: string) => void;
    /** 获取URL查询字符串（不含?号），如 "page=1&size=10" */
    rawQuery: () => string;
    /**
     * 将HTTP连接升级为其他协议（如WebSocket）
     * @param protocol - 目标协议，如 "websocket"
     * @returns 升级成功返回 true
     */
    upgrade: (protocol: string) => boolean;
}

/**
 * 创建HTTP或TCP服务器，每个请求/连接在独立线程中处理
 * 支持 HTTP, HTTPS, TCP, WebSocket 协议。
 *
 * URL支持的查询参数:
 * - gzip=true: 启用gzip压缩
 * - tls=true: 启用TLS加密
 * - cert_pem=...: TLS证书
 * - cert_key_pem=...: TLS私钥
 * - pprof=true: 启用pprof调试端点
 *
 * @param uri - 监听地址:
 *   - HTTP: "http://0.0.0.0:8080"
 *   - HTTPS: "http://0.0.0.0:443?tls=true"
 *   - TCP: "tcp://0.0.0.0:9090"
 * @param handler - 请求处理函数，每个请求在独立线程中调用
 * @returns 监听地址字符串
 * ```js
 * // HTTP服务器
 * __Serve("http://0.0.0.0:8080", function(ctx) {
 *     ctx.setHeader("Content-Type", "text/plain");
 *     ctx.write("Hello World");
 * });
 *
 * // WebSocket服务器
 * __Serve("http://0.0.0.0:8080", function(ctx) {
 *     if (ctx.upgrade("websocket")) {
 *         while (true) {
 *             var msg = ctx.read(5000);
 *             if (msg) ctx.write("Echo: " + msg);
 *         }
 *     }
 * });
 * ```
 */
declare function __Serve(uri: string, handler: (ctx: IServeContext, ...args: any[]) => void): any;

declare namespace threading {
    /**
     * 与 __Serve 同一实现（__Serve 是它的别名，只返回地址串）：在策略进程内起 TCP / HTTP(S) / WebSocket
     * 服务，每个连接或请求在独立线程里调用 handler(ctx, ...args)。返回 Server 对象。
     * 不支持 pprof=true（忽略）；tls=true 必须同时给 cert_pem 与 cert_key_pem。
     */
    function Serve(uri: string, handler: (ctx: IServeContext, ...args: any[]) => void, ...args: any[]): IServer;
}

/** threading.Serve 返回的服务对象（可作为 Thread 参数跨线程传递） */
interface IServer {
    /** 实际监听地址，如 "0.0.0.0:8080" / "127.0.0.1:53021" */
    addr(): string;
    /** 停止接收新连接；在飞的 handler 继续跑完（优雅关闭）。幂等。 */
    close(): void;
    /** close() 后再终止所有在飞的 handler 线程（硬停，同 Thread.terminate）。 */
    stop(): void;
    /**
     * 等到监听已关闭且没有在飞的 handler。
     * @param timeoutMs - 超时毫秒，省略或 0 表示一直等（策略停止时会被打断）
     * @returns 是否已空闲
     */
    join(timeoutMs?: number): boolean;
    /** 当前在飞的连接/handler 数 */
    pending(): number;
}

declare namespace os {
    // File handle interface
    interface File {
      /** Close the file */
      close(): void;

      /** Write string data to file, returns number of bytes written */
      puts(...data: string[]): number;

      /** Formatted write to file, returns number of bytes written */
      printf(format: string, ...args: any[]): number;

      /** Flush file buffer */
      flush(): void;

      /** Get current file position */
      tell(): number;

      /** Seek to position (offset, whence: 0=start, 1=current, 2=end) */
      seek(offset: number, whence: number): number;

      /** Check if at end of file */
      eof(): boolean;

      /** Read data from file. If size not specified, reads all */
      read(size?: number): string | ArrayBuffer | undefined;

      /** Write string data to file, returns number of bytes written */
      write(data: string): number;

      /** Read next line from file */
      getline(): string | undefined;

      /** String representation of file */
      toString(): string;
    }

    // File listing result interface
    interface ListFilesResult {
      files: string[];
      dirs: string[];
    }

    // File statistics interface
    interface FileStat {
      size: number;
      mode: number;
      mtime: number;
      atime: number;
      ctime: number;
    }

    // File operations

    /** Open file with specified mode (r/w/a/+/b combinations) */
    function open(filename: string, mode?: string): File;

    /** Read entire file content as string */
    function fgets(filename: string): string;

    /** Write content to file. Third parameter controls append mode */
    function fputs(filename: string, content: string, append?: boolean): number;

    /** Memory map a file and return as ArrayBuffer */
    function mmap(filename: string): ArrayBuffer;

    // Directory operations

    /** Get the root directory path for file operations */
    function getRootDir(): string;

    /** List files and directories. Supports glob patterns like *.txt */
    function listFiles(pattern?: string): ListFilesResult;

    /** Check if file or directory exists */
    function exists(filename: string): boolean;

    /** Delete a file */
    function remove(filename: string): boolean;

    /** Create directory (recursive) */
    function mkdir(dirname: string): boolean;

    /** Remove directory and all contents */
    function rmdir(dirname: string): boolean;

    /** Rename/move file */
    function rename(oldName: string, newName: string): boolean;

    /** Get file statistics */
    function stat(filename: string): FileStat;

    // Process operations

    /** Exit with status code */
    function exit(status?: number): never;
}

  // TextDecoder
interface TextDecoder {
  readonly encoding: string;
  readonly fatal: boolean;
  readonly ignoreBOM: boolean;
  
  decode(input?: BufferSource, options?: TextDecodeOptions): string;
}

interface TextDecoderOptions {
  fatal?: boolean;
  ignoreBOM?: boolean;
}

interface TextDecodeOptions {
  stream?: boolean;
}

declare var TextDecoder: {
  prototype: TextDecoder;
  new(label?: string, options?: TextDecoderOptions): TextDecoder;
};

// TextEncoder
interface TextEncoder {
  readonly encoding: string;
  
  encode(input?: string): Uint8Array;
  encodeInto(source: string, destination: Uint8Array): TextEncoderEncodeIntoResult;
}

interface TextEncoderEncodeIntoResult {
  read: number;
  written: number;
}

declare var TextEncoder: {
  prototype: TextEncoder;
  new(): TextEncoder;
};

/**
 * Fetch API 请求选项（类似Web标准的 fetch API）
 */
interface FetchOptions {
  /** HTTP方法: "GET", "POST" 等 */
  method?: string;
  /** 请求头 */
  headers?: Map<string, string>;
  /** 请求体 */
  body?: string | ArrayBuffer;
}

/**
 * Fetch API 响应对象
 */
interface FetchResponse {
  /** 请求是否成功（状态码 200-299） */
  ok: boolean;
  /** HTTP状态码 */
  status: number;
  /** HTTP状态描述文本 */
  statusText: string;
  /** 响应头 */
  headers: Map<string, string>;
  /** 将响应体解析为JSON */
  json(): Promise<any>;
  /** 将响应体解析为文本 */
  text(): Promise<string>;
}

/**
 * Fetch API（类Web标准），用于发送HTTP请求（支持async/await）
 * @param url - 请求URL
 * @param init - 请求选项
 * @returns Promise<FetchResponse>
 * ```js
 * async function main() {
 *     var resp = await fetch("https://api.example.com/data");
 *     if (resp.ok) {
 *         var data = await resp.json();
 *         Log(data);
 *     }
 * }
 * ```
 */
declare function fetch(url: string, init?: FetchOptions): Promise<FetchResponse>;

/**
 * 设置通道数据，用于不同机器人/策略之间的跨策略通信
 * 将数据发布到通道，其他策略可通过 GetChannelData 读取
 * @param v - 要发布的数据
 * ```js
 * SetChannelData({price: 50000, signal: "buy"});
 * ```
 */
declare function SetChannelData(v : any): void;

/**
 * 获取通道数据，读取其他策略通过 SetChannelData 发布的数据
 * @param token - 通道token（用于标识数据来源）
 * @returns 通道中的数据
 * ```js
 * var data = GetChannelData("#token123");
 * if (data) Log("收到信号:", data);
 * ```
 */
declare function GetChannelData(token: any): any;

// Type definitions for Trader class
// For FMZ Quant Trading Platform

/**
 * Trade position information
 */
interface TradePosition {
  /** Trading symbol */
  symbol: string;
  /** Position amount (positive=long, negative=short, 0=no position) */
  amount: number;
  /** Average position price */
  price: number;
  /** Margin */
  margin: number;
}

/**
 * Trade result
 */
interface TradeResult {
  /** Actual traded amount */
  amount: number;
  /** Average trade price */
  avgPrice: number;
  /** Position info after trade */
  position: TradePosition;
}

/**
 * Percent option (for closing position by percentage)
 */
interface PercentOption {
  /** Percentage value (0-100) */
  percent: number;
}

/**
 * Trade callback data
 */
interface TradeCallbackData {
  /** Trade result */
  tradeResult: TradeResult;
  /** Initial assets info */
  initAssets: IAsset[];
}

/**
 * Amount option type (can be specific amount or percent object)
 */
type AmountOption = PercentOption | number;

/**
 * Trader constructor options
 */
interface TraderOptions {
  /** Slippage (default 2) */
  slippage?: number;
  /** Fee rate (default 0.001) */
  fee?: number;
  /** Retry delay in milliseconds (default 500) */
  retryDelay?: number;
  /** Order timeout in milliseconds (default 10000) */
  orderTimeout?: number;
  /** Futures leverage multiplier (default 10) */
  marginLevel?: number;
  /** Position cache time in milliseconds (default 5000) */
  positionCacheTime?: number;
  /** Whether to synchronize spot positions on init (default false) */
  syncSpotPositions?: boolean;
}

/**
 * Pure trading class - only responsible for executing trades, no strategy framework
 * 
 * ```js
 * // Get singleton instance
 * const trader = Trader.getInstance();
 * // Buy operation
 * trader.buy(1.5); // Buy 1.5 units
 * trader.buy("BTC.swap", 1.5, "Open long"); // Buy specific symbol
 * // Sell operation
 * trader.sell(1.0); // Sell 1.0 units
 * trader.sell("BTC.swap", 1.0, "Open short"); // Sell specific symbol
 * // Close position operation
 * trader.close(); // Close all positions
 * trader.close(0.5); // Close 0.5 units
 * trader.close({ percent: 50 }); // Close 50%
 * trader.close("BTC.swap", 1.0); // Close specific symbol
 * ```
 */
declare class Trader {
  /**
   * Get Trader singleton instance
   * @param exchange Exchange object (optional, defaults to exchanges[0])
   * @param options Configuration options
   * @returns Trader instance
   */
  static getInstance(exchange?: IExchange, options?: TraderOptions): Trader;

  /**
   * Get market info
   * @returns Market info of current default symbol
   */
  getMarketInfo(): IMarket | null;
  
  /**
   * Get market info of specified symbol
   * @param symbol Trading symbol
   * @returns Market info
   */
  getMarketInfo(symbol: string): IMarket | null;
  
  /**
   * Get ticker info of specified symbol
   * @param symbol Trading symbol
   * @returns Ticker info
   */
  getTicker(symbol: string): ITicker;

  /**
   * Get account equity
   * @param currencies Array of currency codes (optional, defaults to all currencies)
   * @returns Equity value
   */
  public getEquity(currencies?: string[]): number;

  /**
   * Set after-trade callback function
   * @param fn Callback function, called after each trade completion
   */
  setAfterTradeCallback(fn: ((data: TradeCallbackData) => void) | null): void;

  /**
   * Get all positions list
   * @returns Position array
   */
  getPosition(): TradePosition[];
  
  /**
   * Get position of specified symbol
   * @param symbol Trading symbol
   * @returns Position info
   */
  getPosition(symbol: string): TradePosition;

  /**
   * Get account assets info
   * @returns Assets array
   */
  getAssets(): IAsset[];

  /** 
   * Get default trading symbol
   * @returns Default trading symbol
   */
  getSymbol(): string;

  /**
   * Check if symbol is tradable (mainly for CTP to check trading hours)
   * @param symbol Trading symbol
   * @returns Whether tradable
   */
  isTrading(symbol: string): boolean;

  /**
   * Buy (using default symbol)
   * @param amount Buy amount
   * @param comment Comment info (optional)
   * @returns Trade result, returns null on failure
   */
  buy(amount: number, comment?: string): TradeResult | null;
  
  /**
   * Buy specified symbol
   * @param symbol Trading symbol
   * @param amount Buy amount
   * @param comment Comment info (optional)
   * @returns Trade result, returns null on failure
   */
  buy(symbol: string, amount: number, comment?: string): TradeResult | null;

  /**
   * Sell (using default symbol)
   * @param amount Sell amount
   * @param comment Comment info (optional)
   * @returns Trade result, returns null on failure
   */
  sell(amount: number, comment?: string): TradeResult | null;
  
  /**
   * Sell specified symbol
   * @param symbol Trading symbol
   * @param amount Sell amount
   * @param comment Comment info (optional)
   * @returns Trade result, returns null on failure
   */
  sell(symbol: string, amount: number, comment?: string): TradeResult | null;

  /**
   * Close position (close all, specified symbol or using default symbol)
   * @param symbol Trading symbol (optional)
   * @param comment Comment info (optional)
   * @returns Trade result, returns null on failure
   */
  close(symbol?:string, comment?: string): TradeResult | null;
  
  /**
   * Close specified amount or percentage (using default symbol)
   * @param amount Close amount or percent object
   * @param comment Comment info (optional)
   * @returns Trade result, returns null on failure
   */
  close(amount: AmountOption, comment?: string): TradeResult | null;
  
  /**
   * Close position of specified symbol
   * @param symbol Trading symbol
   * @param amount Close amount or percent object (optional, close all if not provided)
   * @param comment Comment info (optional)
   * @returns Trade result, returns null on failure
   */
  close(symbol: string, amount?: AmountOption, comment?: string): TradeResult | null;
}
