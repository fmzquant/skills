
/** Console log interface for outputting debug information */
interface IConsole {
    log(...args: any[]): void;
    error(...args: any[]): void;
}

declare function setTimeout(handler: Function, timeout?: number, ...arguments: any[]): number;

declare function clearTimeout(id: number | undefined): void;

declare const console: IConsole;

/** Template class library domain */
declare const $: any;

/** High-precision decimal arithmetic for avoiding floating-point precision issues */
declare var BigDecimal: any;

/** High-precision floating-point arithmetic */
declare var BigFloat: any;

// ==================== K-line Period Constants ====================

/** 1-minute K-line period */
declare const PERIOD_M1: number;
/** 3-minute K-line period */
declare const PERIOD_M3: number;
/** 5-minute K-line period */
declare const PERIOD_M5: number;
/** 15-minute K-line period */
declare const PERIOD_M15: number;
/** 30-minute K-line period */
declare const PERIOD_M30: number;
/** 1-hour K-line period */
declare const PERIOD_H1: number;
/** 2-hour K-line period */
declare const PERIOD_H2: number;
/** 4-hour K-line period */
declare const PERIOD_H4: number;
/** 6-hour K-line period */
declare const PERIOD_H6: number;
/** 12-hour K-line period */
declare const PERIOD_H12: number;
/** 1-day K-line period */
declare const PERIOD_D1: number;
/** 3-day K-line period */
declare const PERIOD_D3: number;
/** 1-week K-line period */
declare const PERIOD_W1: number;

// ==================== Order Status Constants ====================

/** Order pending status (active order) */
declare const ORDER_STATE_PENDING: number;
/** Order completed (filled) */
declare const ORDER_STATE_CLOSED: number;
/** Order canceled (user canceled or exchange canceled) */
declare const ORDER_STATE_CANCELED: number;
/** Order status unknown */
declare const ORDER_STATE_UNKNOWN: number;

// ==================== Order Type Constants ====================

/** Buy order type */
declare const ORDER_TYPE_BUY: number;
/** Sell order type */
declare const ORDER_TYPE_SELL: number;

// ==================== Conditional Order Type Constants ====================

/** OCO conditional order (One-Cancels-the-Other) */
declare const ORDER_CONDITION_TYPE_OCO: number;
/** Take Profit conditional order */
declare const ORDER_CONDITION_TYPE_TP: number;
/** Stop Loss conditional order */
declare const ORDER_CONDITION_TYPE_SL: number;
/** Generic conditional order */
declare const ORDER_CONDITION_TYPE_GENERIC: number;

// ==================== Order Direction Constants (Futures) ====================

/** Open position direction */
declare const ORDER_OFFSET_OPEN: number;
/** Close position direction */
declare const ORDER_OFFSET_CLOSE: number;

// ==================== Log Type Constants ====================

/** Buy log type, used for exchange.Log() */
declare const LOG_TYPE_BUY: number;
/** Sell log type, used for exchange.Log() */
declare const LOG_TYPE_SELL: number;
/** Cancel order log type, used for exchange.Log() */
declare const LOG_TYPE_CANCEL: number;

// ==================== Position Direction Constants (Futures) ====================

/** Long position direction */
declare const PD_LONG: number;
/** Short position direction */
declare const PD_SHORT: number;
/** Yesterday's long position (SHFE specific) */
declare const PD_LONG_YD: number;
/** Yesterday's short position (SHFE specific) */
declare const PD_SHORT_YD: number;

// ==================== Futures Operation Code Constants ====================

/** Set margin/leverage operation code */
declare const FUTURES_OP_SET_MARGIN: number;
/** Set trading direction operation code */
declare const FUTURES_OP_SET_DIRECTION: number;
/** Set contract type operation code */
declare const FUTURES_OP_SET_CONTRACT_TYPE: number;
/** Get position operation code */
declare const FUTURES_OP_GET_POSITION: number;
/** IO control operation code, used for sending arbitrary API requests */
declare const EXCHANGE_OP_IO_CONTROL: number;


/**
 * Order information structure containing complete order details
 *
 * ```js
 * var order = exchange.GetOrder(orderId);
 * if (order) {
 *     Log("Order price:", order.Price, "Filled amount:", order.DealAmount, "Status:", order.Status);
 * }
 * ```
 */
declare interface IOrder {
    /** Original order information returned by exchange (JSON object), format varies by exchange */
    Info: any;
    /** Order ID, can be string or number depending on exchange */
    Id: number | string;
    /** Order timestamp (milliseconds) */
    Time: number;
    /** Order price */
    Price: number;
    /** Order quantity */
    Amount: number;
    /** Filled quantity */
    DealAmount: number;
    /** Average fill price */
    AvgPrice: number;
    /** Order status: ORDER_STATE_PENDING(0-pending), ORDER_STATE_CLOSED(1-closed), ORDER_STATE_CANCELED(2-canceled), ORDER_STATE_UNKNOWN(3-unknown) */
    Status: number;
    /** Order type: ORDER_TYPE_BUY(0-buy), ORDER_TYPE_SELL(1-sell) */
    Type: number;
    /** Order offset direction (futures): ORDER_OFFSET_OPEN(0-open position), ORDER_OFFSET_CLOSE(1-close position) */
    Offset?: number;
    /** Trading pair symbol, e.g. "BTC_USDT" */
    Symbol: string;
    /** Contract type (futures), e.g. "swap"(perpetual), "quarter"(quarterly), etc. */
    ContractType?: string;
    /** Conditional order information: only present on conditional orders; a plain order has no Condition key (never ConditionType=-1) */
    Condition?: ICondition;
}

/**
 * Market order (bid/ask in depth data), contains price and amount
 */
declare interface IMarketOrder {
    /** Price */
    Price: number;
    /** Amount */
    Amount: number;
}

/**
 * Market depth (order book) data, contains bid and ask order information
 * Asks sorted by price from low to high, Bids sorted by price from high to low
 *
 * ```js
 * var depth = exchange.GetDepth();
 * if (depth) {
 *     Log("Best ask:", depth.Asks[0].Price, "Best bid:", depth.Bids[0].Price);
 *     Log("Bid-ask spread:", depth.Asks[0].Price - depth.Bids[0].Price);
 * }
 * ```
 */
declare interface IDepth {
    /** Original depth data returned by exchange */
    Info: any;
    /** Timestamp (milliseconds) */
    Time: number;
    /** Ask order array, sorted by price from low to high (Asks[0] is best ask) */
    Asks: IMarketOrder[];
    /** Bid order array, sorted by price from high to low (Bids[0] is best bid) */
    Bids: IMarketOrder[];
}

/**
 * Funding rate information (perpetual contracts)
 *
 * ```js
 * var fundings = exchange.GetFundings("BTC_USDT.swap");
 * if (fundings) {
 *     Log("Funding rate:", fundings[0].Rate, "Settlement time:", fundings[0].Time);
 * }
 * ```
 */
declare interface IFunding {
    /** Settlement timestamp (milliseconds) */
    Time: number;
    /** Funding rate, e.g. 0.0001 means 0.01% */
    Rate: number;
    /** Settlement interval (milliseconds), e.g. 28800000 means 8 hours */
    Interval: number;
    /** Trading pair symbol */
    Symbol: string;
    /** Original data returned by exchange */
    Info: any;
}

/**
 * Position information structure (futures)
 *
 * ```js
 * var positions = exchange.GetPositions("BTC_USDT.swap");
 * if (positions) {
 *     for (var pos of positions) {
 *         Log("Direction:", pos.Type == PD_LONG ? "Long" : "Short",
 *             "Amount:", pos.Amount, "Avg price:", pos.Price, "PnL:", pos.Profit);
 *     }
 * }
 * ```
 */
declare interface IPosition {
    /** Original position data returned by exchange */
    Info: any;
    /** Leverage multiplier */
    MarginLevel: number;
    /** Position amount */
    Amount: number;
    /** Frozen amount (positions in pending close orders) */
    FrozenAmount: number;
    /** Average position price */
    Price: number;
    /** Unrealized profit and loss */
    Profit: number;
    /** Position direction: PD_LONG(0-long), PD_SHORT(1-short), PD_LONG_YD(2-long yesterday), PD_SHORT_YD(3-short yesterday) */
    Type: number;
    /** Trading pair symbol */
    Symbol: string;
    /** Contract type, e.g. "swap", "quarter" */
    ContractType: string;
    /** Margin */
    Margin: number;
}

/**
 * Recent trade records
 *
 * ```js
 * var trades = exchange.GetTrades();
 * if (trades) {
 *     Log("Latest trade price:", trades[trades.length - 1].Price,
 *         "Trade amount:", trades[trades.length - 1].Amount);
 * }
 * ```
 */
declare interface ITrade {
    /** Trade record ID */
    Id: number | string;
    /** Trade timestamp (milliseconds) */
    Time: number;
    /** Trade price */
    Price: number;
    /** Trade amount */
    Amount: number;
    /** Trade type: ORDER_TYPE_BUY(0-buy), ORDER_TYPE_SELL(1-sell) */
    Type: number;
}

/**
 * Ticker data containing current market snapshot information
 *
 * ```js
 * var ticker = exchange.GetTicker();
 * if (ticker) {
 *     Log("Last price:", ticker.Last, "Best bid:", ticker.Buy, "Best ask:", ticker.Sell);
 *     Log("24h high:", ticker.High, "24h low:", ticker.Low, "24h volume:", ticker.Volume);
 * }
 * ```
 */
declare interface ITicker {
    /** Timestamp (milliseconds) */
    Time: number;
    /** Trading pair symbol */
    Symbol: string;
    /** Period open price; filled with the current price if the exchange API does not provide a 24-hour rolling open price */
    Open: number;
    /** 24-hour high price */
    High: number;
    /** 24-hour low price */
    Low: number;
    /** Best ask price */
    Sell: number;
    /** Best bid price */
    Buy: number;
    /** Last trade price */
    Last: number;
    /** 24-hour trading volume */
    Volume: number;
    /** Open interest (futures); most exchange APIs do not provide this data, value is 0 when unsupported */
    OpenInterest: number;
    /** Original ticker data returned by exchange */
    Info: any;
}

/**
 * Account information structure (spot)
 * For futures accounts (CTP, etc.), returns extended structure with Equity and UPnL (unrealized profit and loss)
 *
 * ```js
 * var account = exchange.GetAccount();
 * if (account) {
 *     Log("Quote currency balance:", account.Balance, "Frozen:", account.FrozenBalance);
 *     Log("Base currency balance:", account.Stocks, "Frozen:", account.FrozenStocks);
 * }
 * ```
 */
declare interface IAccount {
    /** Original account data returned by exchange */
    Info: any;
    /** Quote currency balance (e.g. USDT), for futures it refers to available margin */
    Balance: number;
    /** Frozen quote currency balance */
    FrozenBalance: number;
    /** Base currency balance (e.g. BTC), for futures it refers to currency corresponding to available margin */
    Stocks: number;
    /** Frozen base currency balance */
    FrozenStocks: number;
    /** Equity (futures), total account value including unrealized PnL */
    Equity: number;
    /** Unrealized profit and loss (futures), value is 0 when unsupported */
    UPnL: number;
}

/**
 * Asset information representing holdings of a specific currency in the account
 *
 * ```js
 * var assets = exchange.GetAssets();
 * if (assets) {
 *     for (var asset of assets) {
 *         Log("Currency:", asset.Currency, "Available:", asset.Amount, "Frozen:", asset.FrozenAmount);
 *     }

 * }
 * ```
 */
declare interface IAsset {
    /** Currency name, e.g., "BTC", "USDT" */
    Currency : string;
    /** Available amount */
    Amount: number;
    /** Frozen amount */
    FrozenAmount: number;
}

/**
 * K-line (candlestick) data structure, containing OHLCV information

 *
 * ```js
 * var records = exchange.GetRecords(PERIOD_H1);
 * if (records) {
 *     var last = records[records.length - 1];
 *     Log("Latest candlestick - Open:", last.Open, "High:", last.High, "Low:", last.Low, "Close:", last.Close);
 * }
 * ```
 */
declare interface IRecord {
    /** Candlestick timestamp (milliseconds), representing the start time of this candlestick bar */
    Time: number;
    /** Open price */
    Open: number;
    /** High price */
    High: number;
    /** Low price */
    Low: number;
    /** Close price */
    Close: number;
    /** Volume */
    Volume: number;
    /** Open interest (futures); most exchange APIs do not provide this data, value is 0 when unsupported */
    OpenInterest?: number;
}

/**
 * Market/trading pair information, describing precision, limits and other metadata of trading pairs
 * Obtain all trading pair market information via exchange.GetMarkets()
 *
 * ```js
 * var markets = exchange.GetMarkets();
 * if (markets) {
 *     var btc = markets["BTC_USDT"];
 *     if (btc) {
 *         Log("Price precision:", btc.PricePrecision, "Amount precision:", btc.AmountPrecision);
 *         Log("Min order quantity:", btc.MinQty, "Min order value:", btc.MinNotional);
 *     }
 * }
 * ```
 */
declare interface IMarket {
    /** Trading pair symbol, e.g. "BTC_USDT", for futures "BTC_USDT.swap" */
    Symbol: string;
    /** Base asset (trading currency), e.g. "BTC" */
    BaseAsset: string;
    /** Quote asset, e.g. "USDT" */
    QuoteAsset: string;
    /** Minimum price tick size, e.g. 0.01 */
    TickSize?: number;
    /** Minimum amount step size, e.g. 0.001 */
    AmountSize?: number;
    /** Price decimal precision, e.g. 2 means precision to 2 decimal places */
    PricePrecision?: number;
    /** Amount decimal precision, e.g. 3 means precision to 3 decimal places */
    AmountPrecision?: number;
    /** Minimum order quantity */
    MinQty?: number;
    /** Maximum order quantity */
    MaxQty?: number;
    /** Minimum order value (notional value) */
    MinNotional?: number;
    /** Maximum order value (notional value) */
    MaxNotional?: number;
    /** Contract value (futures), e.g. 0.01 means one contract represents 0.01 coins */
    CtVal?: number;
    /** Contract value currency (futures), e.g. "BTC", "USD" */
    CtValCcy?: string;
    /** Raw market information returned by the exchange */
    Info?: any;
}

/**
 * Go object returned by concurrent calls, used for asynchronous result retrieval
 * Created via exchange.Go(), call wait() to await the result
 *
 * ```js
 * // Concurrently fetch ticker and depth
 * var goTicker = exchange.Go("GetTicker");
 * var goDepth = exchange.Go("GetDepth");
 * var ticker = goTicker.wait();  // Wait for ticker to return
 * var depth = goDepth.wait();    // Wait for depth to return
 * ```
 */
interface IGo {
    /**
     * Wait for the concurrent task to complete and return the result
     * @param timeoutMs - Timeout duration (milliseconds).
     *   - Not passed or 0: Block until result is returned
     *   - Positive number: Wait for specified milliseconds, return undefined on timeout
     *   - Negative number (-1): Return immediately, return undefined if no result
     * @returns The return value of the corresponding function, null on failure, undefined on timeout.
     *   A timed-out wait keeps the routine alive and can be waited again; once the result has
     *   been taken, waiting again throws "routine N already finished".
     * ```js
     * var go1 = exchange.Go("GetTicker");
     * var ticker = go1.wait(2000);   // Wait at most 2 seconds
     * var go2 = exchange.Go("GetDepth");
     * var depth = go2.wait();         // Wait until return
     * ```
     */
    wait(timeoutMs?: number): any;
}

// ==================== Exchange Interface ====================

/**
 * Exchange operation interface, encapsulates all exchange API call methods
 * Access via global variable `exchange` (first exchange) or `exchanges[i]` (i-th exchange)
 *
 * ```js
 * // Get ticker
 * var ticker = exchange.GetTicker();
 * // Place buy order
 * var orderId = exchange.Buy(ticker.Sell, 0.1);
 * // Query order
 * var order = exchange.GetOrder(orderId);
 * ```
 */
interface IExchange {
    /**
     * Create a concurrent task, asynchronously call exchange methods. Does not block current code execution,
     * call the wait() method of the returned IGo object to get the result.
     * Multiple concurrent requests can be initiated simultaneously to improve efficiency.
     * @param method - Method name to call, e.g. "GetTicker", "GetDepth", "GetAccount", "GetRecords", "Buy", "Sell", etc.
     * @param args - Parameters to pass to the method, consistent with parameters when calling the method directly
     * @returns IGo object, call its wait() method to get the result
     * ```js
     * // Concurrently fetch ticker for multiple trading pairs
     * var goTicker1 = exchange.Go("GetTicker", "BTC_USDT");
     * var goTicker2 = exchange.Go("GetTicker", "ETH_USDT");
     * var goAccount = exchange.Go("GetAccount");
     * var ticker1 = goTicker1.wait();
     * var ticker2 = goTicker2.wait();
     * var account = goAccount.wait();
     * // Concurrent orders
     * var goBuy = exchange.Go("Buy", 50000, 0.1);
     * var goSell = exchange.Go("Sell", 60000, 0.1);
     * var buyId = goBuy.wait();
     * var sellId = goSell.wait();
     * ```
     */
    Go(method: string, ...args: any[]): IGo;

    /**
     * Get current position list (futures)
     * @param symbol - Trading pair symbol, e.g. "BTC_USDT.swap". Not passed returns all positions
     * @returns Position array, null on failure. Empty array [] when no positions
     * ```js
     * var positions = exchange.GetPositions("BTC_USDT.swap");
     * if (positions && positions.length > 0) {
     *     Log("Position amount:", positions[0].Amount, "Direction:", positions[0].Type);
     * }
     * ```
     */
    GetPositions(symbol?: string): IPosition[] | null;

    /**
     * Get currently set contract type (futures)
     * @returns Current contract type string, e.g. "swap" (perpetual), "quarter" (quarterly), "this_week" (this week), etc.
     * ```js
     * Log("Current contract:", exchange.GetContractType()); // "swap"
     * ```
     */
    GetContractType(): string;

    /**
     * Set contract type (futures), must be set before calling trading interfaces
     * @param symbol - Contract type:
     *   - "swap": Perpetual contract
     *   - "quarter": Quarterly contract
     *   - "next_quarter": Next quarter contract
     *   - "this_week": This week contract
     *   - "next_week": Next week contract
     *   - Can also directly pass contract ID, e.g. "BTC-USD-200925"
     * @returns Setting result
     * ```js
     * exchange.SetContractType("swap");      // Set to perpetual contract
     * exchange.SetContractType("quarter");   // Set to quarterly contract
     * ```
     */
    SetContractType(symbol: string): any;

    /**
     * Set leverage multiplier (futures)
     * @param num - Leverage multiplier, e.g. 10 means 10x leverage
     * ```js
     * exchange.SetMarginLevel(10);  // Set 10x leverage
     * ```
     */
    SetMarginLevel(num: number): void;
    /**
     * Set leverage multiplier for a specific trading pair (futures)
     * @param symbol - Trading pair symbol, e.g. "BTC_USDT.swap"
     * @param num - Leverage multiplier
     * ```js
     * exchange.SetMarginLevel("BTC_USDT.swap", 20);
     * ```
     */
    SetMarginLevel(symbol: string, num: number): void;

    /**
     * Set futures trading direction, must be set before placing orders.
     *
     * Discouraged: prefer `CreateOrder`, which takes the side directly, so no `SetDirection` is needed.
     * @param s - Trading direction:
     *   - "buy": Buy to open long
     *   - "sell": Sell to open short
     *   - "closebuy": Sell to close long
     *   - "closesell": Buy to close short
     * ```js
     * exchange.SetDirection("buy");      // Open long
     * exchange.Buy(50000, 1);            // Open long at price 50000 for 1 contract
     * exchange.SetDirection("closebuy"); // Close long
     * exchange.Sell(51000, 1);           // Close long at price 51000 for 1 contract
     * ```
     */
    SetDirection(s: string): void;

    /**
     * Cancel a specified order
     * @param orderId - Order ID to cancel
     * @param extra - Additional log information, will be displayed in the log
     * @returns true on successful cancellation, false on failure
     * ```js
     * var id = exchange.Buy(50000, 0.1);
     * if (id) {
     *     exchange.CancelOrder(id, "Cancel test order");
     * }
     * ```
     */
    CancelOrder(orderId: any, ...extra: any[]): boolean;

    /**
     * Query order details by order ID
     * @param orderId - Order ID
     * @returns Order information object, null on failure
     * ```js
     * var order = exchange.GetOrder(orderId);
     * if (order) {
     *     Log("Status:", order.Status, "Filled amount:", order.DealAmount);
     * }
     * ```
     */
    GetOrder(orderId: any): IOrder | null;

    /**
     * Get list of current unfilled pending orders
     * @param symbol - Trading pair symbol. Not passed uses currently set trading pair
     * @returns Unfilled order array (empty array means no pending orders), null on failure
     * ```js
     * var orders = exchange.GetOrders("BTC_USDT");
     * Log("Current pending orders:", orders.length);
     * ```
     */
    GetOrders(symbol?: string): IOrder[];

    /**
     * Get historical orders (filled/cancelled)
     * Supports no-argument call (query current trading pair), and omitting symbol to pass since directly: GetHistoryOrders(since, limit)
     * @param symbol - Trading pair symbol, defaults to current trading pair if not passed; may also directly pass a start timestamp (milliseconds)
     * @param since - Start timestamp (milliseconds), not passed defaults to most recent
     * @param limit - Maximum number to return
     * @returns Historical order array
     * ```js
     * var orders = exchange.GetHistoryOrders();                    // current trading pair
     * var orders = exchange.GetHistoryOrders("BTC_USDT", 0, 100);  // specified trading pair
     * Log("Historical orders count:", orders.length);
     * ```
     */
    GetHistoryOrders(symbol?: string | number, since?: number, limit?: number): IOrder[];

    /**
     * Record simulated trading log (no actual order), used for virtual trading or signal marking
     * @param orderType - Log type: LOG_TYPE_BUY(0), LOG_TYPE_SELL(1), LOG_TYPE_CANCEL(2)
     * @param price - Price (order ID when cancelling order)
     * @param amount - Amount (may be omitted for LOG_TYPE_CANCEL)
     * @param args - Additional log information
     * ```js
     * exchange.Log(LOG_TYPE_BUY, 50000, 0.1, "Simulated buy signal");
     * exchange.Log(LOG_TYPE_SELL, 51000, 0.1, "Simulated sell signal");
     * exchange.Log(LOG_TYPE_CANCEL, orderId);  // cancel order log
     * ```
     */
    Log(orderType: number, price: number, amount?: number, ...args: any[]): void;

    /**
     * Sell order (spot sell/futures sell order according to current direction)
     * @param price - Sell price, pass -1 for market order
     * @param amount - Sell amount
     * @param extra - Additional log information
     * @returns Order ID (string or number), null on failure
     * ```js
     * // Limit sell order
     * var id = exchange.Sell(51000, 0.1, "Limit sell");
     * // Market sell order
     * var id = exchange.Sell(-1, 0.1, "Market sell");
     * ```
     */
    Sell(price: number, amount: number, ...extra: any[]): string | number | null;

    /**
     * Buy order (spot buy/futures buy order according to current direction)
     * @param price - Buy price, pass -1 for market order
     * @param amount - Buy amount
     * @param extra - Additional log information
     * @returns Order ID (string or number), null on failure
     * ```js
     * // Limit buy order
     * var id = exchange.Buy(50000, 0.1, "Limit buy");
     * // Market buy order
     * var id = exchange.Buy(-1, 0.1, "Market buy");
     * ```
     */
    Buy(price: number, amount: number, ...extra: any[]): string | number | null;

    /**
     * Generic order function, supports specifying trading pair and direction without prior SetDirection
     * side parameter can have options attached, separated by semicolon, e.g. "buy;{\"timeInForce\":\"GTC\"}"
     * @param symbol - Trading pair symbol, e.g. "BTC_USDT" (spot) or "BTC_USDT.swap" (futures)
     * @param side - Order direction: "buy"(buy), "sell"(sell), "closebuy"(close long), "closesell"(close short)
     * @param price - Price, pass -1 for market order
     * @param amount - Amount
     * @param extra - Additional log information
     * @returns Order ID, null on failure
     * ```js
     * // Spot buy
     * exchange.CreateOrder("ETH_USDT", "buy", -1, 1);
     * // Futures open long
     * exchange.CreateOrder("BTC_USDT.swap", "buy", 50000, 1);
     * // Futures close long
     * exchange.CreateOrder("BTC_USDT.swap", "closebuy", -1, 1);
     * ```
     */
    CreateOrder(symbol: string, side: string, price: number, amount: number, ...extra: any[]): string | number | null;

    /**
     * Modify price and amount of an existing order
     * @param orderId - Order ID to modify. For futures may be in "symbol,orderId" format
     * @param side - Order direction
     * @param price - New price
     * @param amount - New amount
     * @param extra - Additional log information
     * @returns Updated order ID, null on failure
     * ```js
     * var newId = exchange.ModifyOrder(orderId, "buy", 49000, 0.2);
     * ```
     */
    ModifyOrder(orderId: any, side: string, price: number, amount: number, ...extra: any[]): string | number | null;

    /**
     * Get the raw JSON string returned by the most recent REST API request, used for debugging
     * @returns Raw JSON string
     * ```js
     * exchange.GetTicker();
     * var raw = exchange.GetRawJSON();
     * Log("Raw response:", raw);
     * ```
     */
    GetRawJSON(): any;

    /**
     * Create condition order (take profit, stop loss, etc.)
     * @param symbol - Trading pair symbol
     * @param side - Order direction: "buy", "sell", "closebuy", "closesell"
     * @param amount - Amount
     * @param condition - Condition parameters, including trigger price, etc.
     * @param extra - Additional log information
     * @returns Condition order ID, null on failure
     * ```js
     * // Create take profit condition order
     * exchange.CreateConditionOrder("BTC_USDT.swap", "closebuy", 1, {
     *     ConditionType: ORDER_CONDITION_TYPE_TP,
     *     TpTriggerPrice: 55000,
     *     TpOrderPrice: 54900
     * });
     * ```
     */
    CreateConditionOrder(symbol: string, side: string, amount: number, condition: ICondition, ...extra: any[]): string | number | null;

    /**
     * Modify an existing condition order
     * @param orderId - Condition order ID
     * @param side - Order direction
     * @param amount - New amount
     * @param condition - New condition parameters
     * @param extra - Additional log information
     * @returns Updated condition order ID, null on failure
     */
    ModifyConditionOrder(orderId: any, side: string, amount: number, condition: ICondition, ...extra: any[]): string | number | null;

    /**
     * Get list of current untriggered condition orders
     * @param symbol - Trading pair symbol, not passed returns all
     * @returns Condition order array
     */
    GetConditionOrders(symbol?: string): IOrder[];

    /**
     * Query condition order details by ID
     * @param orderId - Condition order ID
     * @returns Condition order information, null on failure
     */
    GetConditionOrder(orderId: any): IOrder | null;

    /**
     * Cancel a specified condition order
     * @param orderId - Condition order ID
     * @param extra - Additional log information
     * @returns true on successful cancellation, false on failure
     */
    CancelConditionOrder(orderId: any, ...extra: any[]): boolean;

    /**
     * Get historical condition order list
     * Supports omitting symbol to pass since directly: GetHistoryConditionOrders(since, limit)
     * @param symbol - Trading pair symbol; may also directly pass a start timestamp (milliseconds)
     * @param since - Start timestamp (milliseconds)
     * @param limit - Maximum number to return
     * @returns Historical condition order array
     */
    GetHistoryConditionOrders(symbol?: string | number, since?: number, limit?: number): IOrder[];

    /**
     * Get account information (balance, frozen, etc.)
     * @returns Account information object, null on failure
     * ```js
     * var account = exchange.GetAccount();
     * if (account) {
     *     Log("Balance:", account.Balance, "Frozen:", account.FrozenBalance);
     * }
     * ```
     */
    GetAccount(): IAccount | null;

    /**
     * Get candlestick/OHLCV data
     * @param symbol - Trading pair symbol, not passed uses currently set trading pair; may also omit symbol and directly pass a candlestick period (seconds)
     * @param period - Candlestick period (seconds), e.g. PERIOD_M1, PERIOD_H1, etc. Not passed uses default period set when creating the bot
     * @param limit - Maximum number of candlesticks to return
     * @returns Candlestick data array (ascending by time), null on failure
     * ```js
     * // Get 1-hour candlesticks for current trading pair
     * var records = exchange.GetRecords(PERIOD_H1);
     * // Get 5-minute candlesticks for specific trading pair, max 100 bars
     * var records = exchange.GetRecords("ETH_USDT", PERIOD_M5, 100);
     * // Pass to talib for technical analysis
     * var macd = talib.MACD(records);
     * ```
     */
    GetRecords(symbol?: string | number, period?: number, limit?: number): IRecord[] | null;

    /**
     * Set maximum candlestick cache length (default 200 bars)
     * @param n - Maximum number of candlestick bars
     * ```js
     * exchange.SetMaxBarLen(500);  // Cache up to 500 candlestick bars
     * ```
     */
    SetMaxBarLen(n: number): void;

    /**
     * Get recent trade records
     * @param symbol - Trading pair symbol, not passed uses currently set trading pair
     * @returns Trade record array (ascending by time), null on failure
     * ```js
     * var trades = exchange.GetTrades();
     * if (trades && trades.length > 0) {
     *     Log("Latest trade:", trades[trades.length - 1].Price);
     * }
     * ```
     */
    GetTrades(symbol?: string): ITrade[] | null;

    /**
     * Get current ticker
     * @param symbol - Trading pair symbol, not passed uses currently set trading pair
     * @returns Ticker data, null on failure
     * ```js
     * var ticker = exchange.GetTicker("BTC_USDT");
     * if (ticker) Log("BTC latest price:", ticker.Last);
     * ```
     */
    GetTicker(symbol?: string): ITicker | null;

    /**
     * Get funding rate (perpetual contracts)
     * @param symbol - Trading pair symbol
     * @returns Funding rate array, null on failure
     * ```js
     * var fundings = exchange.GetFundings("BTC_USDT.swap");
     * ```
     */
    GetFundings(symbol?: string): IFunding[] | null;

    /**
     * Get ticker data for all trading pairs (batch fetch)
     * @returns Ticker array for all trading pairs, null on failure
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
     * Get market depth (order book), Asks from low to high, Bids from high to low
     * @param symbol - Trading pair symbol, not passed uses currently set trading pair
     * @returns Depth data, null on failure
     * ```js
     * var depth = exchange.GetDepth("BTC_USDT");
     * if (depth) {
     *     Log("Best ask:", depth.Asks[0].Price, "Best bid:", depth.Bids[0].Price);
     * }
     * ```
     */
    GetDepth(symbol?: string): IDepth | null;

    /**
     * Get base currency name
     * @returns Base currency, e.g. "BTC"
     * ```js
     * Log(exchange.GetBaseCurrency());  // "BTC"
     * ```
     */
    GetBaseCurrency(): string;

    /**
     * Get quote currency name
     * @returns Quote currency, e.g. "USDT"
     * ```js
     * Log(exchange.GetQuoteCurrency());  // "USDT"
     * ```
     */
    GetQuoteCurrency(): string;

    /**
     * Set proxy server address
     * @param proxy - Proxy address, supported formats:
     *   - "socks5://user:pass@host:port" — SOCKS5 proxy
     *   - "http://host:port" — HTTP proxy
     *   - "" — Clear proxy settings
     * ```js
     * exchange.SetProxy("socks5://127.0.0.1:1080");
     * exchange.SetProxy("");  // Cancel proxy
     * ```
     */
    SetProxy(proxy: string): void;

    /**
     * Set decimal precision for price and amount, automatically truncate to specified digits when placing orders
     * @param pricePrecision - Price decimal places
     * @param amountPrecision - Amount decimal places
     * ```js
     * exchange.SetPrecision(2, 4);  // Price 2 digits, amount 4 digits
     * ```
     */
    SetPrecision(pricePrecision: number, amountPrecision: number): void;

    /**
     * Send arbitrary API request (IO control), used to call exchange APIs not yet encapsulated
     * @param k - Request path or control command:
     *   - API path: e.g. "/api/v5/account/balance"
     *   - "api": Generic API call
     *   - "currency": Switch trading pair
     *   - "base": Switch API base address
     *   - Other custom IO commands
     * @param args - Request parameters
     * @returns API response result (parsed as object)
     * ```js
     * // Directly call exchange API
     * var ret = exchange.IO("api", "GET", "/api/v5/account/balance");
     * // Switch trading pair
     * exchange.IO("currency", "ETH_USDT");
     * // Domestic futures counters (CTP): send a counter request directly; the name starts
     * // with Req. When waiting for the reply the result is [[{Name: struct name, Value: row}, …]]
     * // (the outer array always has one item; an empty result is [[]]); passing false as the
     * // third argument does not wait and returns ""; a counter rejection returns null
     * // (see GetLastError)
     * var products = exchange.IO("api", "ReqQryProduct", {});
     * if (products) for (var row of products[0]) Log(row.Name, row.Value.ProductID);
     * ```
     */
    /**
     * Domestic futures counters (CTP etc.): wait for the next tick of the current contract
     * or the next order update of this exchange, whichever arrives first (the legacy
     * waitEvent listened on both the tick and the order queue)
     * @param timeoutMs - Timeout in milliseconds; 0 / omitted = the default wait; negative =
     *   do not wait, only report what is already there
     * @returns The event message: a tick as `Event: "tick"` (`Ticker` in ITicker shape,
     *   `Symbol` = contract); an order update as `Event: "order"` (`Order` in IOrder shape;
     *   `Type` is absent when the update carries no side — orders placed here merge the
     *   Type/Offset recorded at submit time by order id); null when nothing arrived before
     *   the timeout
     * ```js
     * var e = exchange.IO("wait", 5000);
     * if (e && e.Event == "tick") Log(e.Symbol, e.Ticker.Last);
     * if (e && e.Event == "order") Log(e.Order.Id, e.Order.Status, e.Order.DealAmount);
     * ```
     */
    IO(k: "wait", timeoutMs?: number): IEventMsg | null;
    IO(k: string, ...args: any[]): any;

    /**
     * Set REST API request timeout
     * @param timeoutMs - Timeout duration (milliseconds)
     * ```js
     * exchange.SetTimeout(10000);  // Set 10 second timeout
     * ```
     */
    SetTimeout(timeoutMs: number): void;

    /**
     * Set exchange API base address, used to switch to alternate domain or testnet
     * @param s - API base URL
     * ```js
     * exchange.SetBase("https://testnet.binance.vision");  // Switch to testnet
     * ```
     */
    SetBase(s: string): void;

    /**
     * Get current API base address
     * @returns API base URL string
     */
    GetBase(): string;

    /**
     * Switch current trading pair
     * @param s - Trading pair string, e.g. "BTC_USDT", "ETH_BTC"
     * ```js
     * exchange.SetCurrency("ETH_USDT");
     * Log(exchange.GetTicker());  // Get ETH ticker
     * ```
     */
    SetCurrency(s: string): void;

    /**
     * Set exchange rate conversion, all prices will be automatically multiplied by this exchange rate
     * @param n - Exchange rate value, 1 means no conversion
     * ```js
     * exchange.SetRate(6.5);  // Convert prices to RMB display
     * exchange.SetRate(1);    // Cancel exchange rate conversion
     * ```
     */
    SetRate(n: number): void;

    /**
     * Get currently set exchange rate value
     * @returns Exchange rate value, default is 1
     */
    GetRate(): number;

    /**
     * Get USD to CNY exchange rate
     * @returns USD/CNY exchange rate
     */
    GetUSDCNY(): number;

    /**
     * Get exchange custom label name (set when configuring exchange on FMZ platform)
     * @returns Label string
     * ```js
     * Log(exchange.GetLabel());  // "My Binance Account"
     * ```
     */
    GetLabel(): string;

    /**
     * Get current trading pair name
     * @returns Trading pair string, e.g. "BTC_USDT"
     * ```js
     * Log(exchange.GetCurrency());  // "BTC_USDT"
     * ```
     */
    GetCurrency(): string;

    /**
     * Get currently set candlestick period
     * @returns Candlestick period (seconds)
     * ```js
     * Log(exchange.GetPeriod());  // 3600 (1 hour)
     * ```
     */
    GetPeriod(): number;

    /**
     * Get exchange name
     * @returns Exchange platform name, e.g. "Binance", "OKX", "Futures_Binance"
     * ```js
     * Log(exchange.GetName());  // "Binance"
     * ```
     */
    GetName(): string;

    /**
     * Get market information (precision, limits, etc.) for all trading pairs, key is trading pair symbol
     * @returns Market information dictionary, key is trading pair (e.g. "BTC_USDT"), value is IMarket object. null on failure
     * ```js
     * var markets = exchange.GetMarkets();
     * if (markets) {
     *     var m = markets["BTC_USDT"];
     *     Log("BTC min order quantity:", m.MinQty, "Price precision:", m.PricePrecision);
     * }
     * ```
     */
    GetMarkets(): { [key: string]: IMarket }|null;

    /**
     * Get all asset information for the account
     * @returns Asset array, each element contains currency, available amount, frozen amount. null on failure
     * ```js
     * var assets = exchange.GetAssets();
     * if (assets) {
     *     for (var a of assets) Log(a.Currency, "Available:", a.Amount);
     * }
     * ```
     */
    GetAssets(): IAsset[]|null;

    /**
     * Write a data set that can be read via exchange.GetData() (commonly used to load custom data in backtesting)
     * @param key - Data set name
     * @param value - Data content, an array in the format [[timestamp, data], ...] (non-strings are automatically JSON-serialized)
     * @returns Length of the JSON-encoded data string
     * ```js
     * exchange.SetData("test", [[1579536000000, 123], [1579622400000, 456]]);
     * Log(exchange.GetData("test"));  // returns the data matching the current timestamp as time advances
     * ```
     */
    SetData(key: string, value: any): number;

    /**
     * Get a data set written by exchange.SetData() or data provided by an external link
     * Fetched all at once in backtesting; in live trading an http/https URL is fetched
     * synchronously by this node (HttpQuery) — the response must be `[[time, data], …]` or
     * `{Schema: ["time", "data"], Data: [[…]]}` — cached for `timeout` and refetched once
     * stale; data written with SetData never expires. `ext.` server-side data sources need a
     * mapping pushed by the server and are not available on this runtime
     * @param key - Data set name or request URL (http/https)
     * @param timeout - Cache timeout (milliseconds), at least 5 seconds
     * @param offset - Take the last row with time <= offset; 0 / omitted = now
     * @returns `{Time, Data}`: the matching row; when there is no row, the fetch failed or the
     *   source is unavailable, `Data` is null (`Time` = offset) and GetLastError() tells why —
     *   an object is always returned, never null
     * ```js
     * var data = exchange.GetData("test");
     * var extern = exchange.GetData("https://www.example.com/data.json");
     * if (extern.Data === null) Log("no data:", GetLastError());
     * ```
     */
    GetData(key: string, timeout?: number, offset?: number): any;

    /**
     * Signature/encryption calculation (member function version, live trading only)
     * Similar to the global Encode(), but the key parameter supports "{{accesskey}}" and "{{secretkey}}" templates
     * referencing the AccessKey/SecretKey configured on this exchange object, avoiding leaking keys in code
     * @param algo - Algorithm name: "raw", "sign", "signTx", "md4", "md5", "sha256", "sha512", "sha1", "keccak256", "ed25519", etc.
     * @param inputFormat - Input data format: "hex", "base64", "raw", "string"
     * @param outputFormat - Output data format: "hex", "base64", "raw", "string"
     * @param data - Data to process
     * @param keyFormat - Key format: "hex", "base64", "raw", "string"
     * @param key - Key, supports plain text or "{{accesskey}}" / "{{secretkey}}" templates
     * @returns Calculated hash/encoded value
     * ```js
     * var sign = exchange.Encode("sha256", "string", "hex", "data", "string", "{{secretkey}}");
     * ```
     */
    Encode(algo: string, inputFormat: "hex" | "base64" | "raw" | "string", outputFormat: "hex" | "base64" | "raw" | "string", data: string | ArrayBuffer, keyFormat?: string, key?: string): string | ArrayBuffer;

    /**
     * Read a configuration field of this exchange object (live trading only).
     * The key is matched case-insensitively and ignoring "_"/"-": GetMeta("AccessKey") equals GetMeta("access_key").
     * Only **non-sensitive** fields are returned; SecretKey/Password/Passphrase/PrivateKey style fields and
     * any field the server delivered encrypted come back as "". Unknown fields also return "".
     * @param key - Configuration field name (e.g. "AccessKey", "Simulate", "BrokerId")
     * @returns The field value as a string (booleans/numbers stringified), "" when absent or sensitive
     * ```js
     * var ak = exchange.GetMeta("AccessKey");
     * ```
     */
    GetMeta(key: string): string;
    /**
     * HMAC signature (member version, live only): equivalent to exchange.Encode(algo, "raw", outputFormat, data, "raw", key);
     * key/data accept the "{{accesskey}}" / "{{secretkey}}" templates as well.
     * @param algo - e.g. "hmac_sha256", "hmac_sha512", "hmac_md5"
     * @param outputFormat - "hex" | "base64" | "raw" | "string"
     * @param data - data to sign
     * @param key - key, may be "{{secretkey}}"
     */
    HMAC(algo: string, outputFormat: "hex" | "base64" | "raw" | "string", data: string, key?: string): string;
}

// ==================== TA-Lib Technical Analysis Library Interface ====================
/**
 * TA-Lib Technical Analysis Library with 100+ technical indicator functions
 * Accessed via global variable `talib`
 *
 * Input data type descriptions:
 * - `inReal: number[] | IRecord[]` — Can pass in close price array or candlestick array (automatically uses Close field)
 * - `inPriceHLC: IRecord[]` — Candlestick array requiring High/Low/Close
 * - `inPriceHL: IRecord[]` — Candlestick array requiring High/Low
 * - `inPriceOHLC: IRecord[]` — Candlestick array requiring Open/High/Low/Close
 * - `inPriceHLCV: IRecord[]` — Candlestick array requiring High/Low/Close/Volume
 *
 * optInMAType Moving Average Type parameter:
 * - 0=SMA, 1=EMA, 2=WMA, 3=DEMA, 4=TEMA, 5=TRIMA, 6=KAMA, 7=MAMA, 8=T3
 *
 * ```js
 * var records = exchange.GetRecords(PERIOD_H1);
 * // Calculate MACD
 * var [dif, dea, macd] = talib.MACD(records, 12, 26, 9);
 * // Calculate Bollinger Bands
 * var [upper, middle, lower] = talib.BBANDS(records, 20, 2, 2);
 * // Calculate RSI
 * var rsi = talib.RSI(records, 14);
 * Log("RSI:", rsi[rsi.length - 1]);
 * ```
 */
interface Italib {
    // ==================== Moving Average Indicators ====================

    /**
     * WMA - Weighted Moving Average
     * @param inReal - Input data (close price array or candlestick array)
     * @param optInTimePeriod - Calculation period, default 30
     * @returns Weighted moving average array
     * ```js
     * var wma = talib.WMA(records, 10);
     * ```
     */
    WMA(inReal: number[] | IRecord[], optInTimePeriod?: number): number[];

    /**
     * SMA - Simple Moving Average
     * @param inReal - Input data (close price array or candlestick array)
     * @param optInTimePeriod - Calculation period, default 30
     * @returns Simple moving average array
     * ```js
     * var ma5 = talib.SMA(records, 5);
     * var ma20 = talib.SMA(records, 20);
     * ```
     */
    SMA(inReal: number[] | IRecord[], optInTimePeriod?: number): number[];

    /**
     * EMA - Exponential Moving Average
     * @param inReal - Input data (close price array or candlestick array)
     * @param optInTimePeriod - Calculation period, default 30
     * @returns Exponential moving average array
     * ```js
     * var ema12 = talib.EMA(records, 12);
     * var ema26 = talib.EMA(records, 26);
     * ```
     */
    EMA(inReal: number[] | IRecord[], optInTimePeriod?: number): number[];

    /**
     * DEMA - Double Exponential Moving Average
     * @param inReal - Input data
     * @param optInTimePeriod - Calculation period, default 30
     * @returns DEMA array
     */
    DEMA(inReal: number[] | IRecord[], optInTimePeriod?: number): number[];

    /**
     * TEMA - Triple Exponential Moving Average
     * @param inReal - Input data
     * @param optInTimePeriod - Calculation period, default 30
     * @returns TEMA array
     */
    TEMA(inReal: number[] | IRecord[], optInTimePeriod?: number): number[];

    /**
     * TRIMA - Triangular Moving Average
     * @param inReal - Input data
     * @param optInTimePeriod - Calculation period, default 30
     * @returns TRIMA array
     */
    TRIMA(inReal: number[] | IRecord[], optInTimePeriod?: number): number[];

    /**
     * KAMA - Kaufman Adaptive Moving Average
     * @param inReal - Input data
     * @param optInTimePeriod - Calculation period, default 30
     * @returns KAMA array
     */
    KAMA(inReal: number[] | IRecord[], optInTimePeriod?: number): number[];

    /**
     * MA - Generic Moving Average with selectable type
     * @param inReal - Input data
     * @param optInTimePeriod - Calculation period, default 30
     * @param optInMAType - Moving average type: 0=SMA, 1=EMA, 2=WMA, 3=DEMA, 4=TEMA, 5=TRIMA, 6=KAMA, 7=MAMA, 8=T3
     * @returns MA array
     * ```js
     * var sma = talib.MA(records, 20, 0);  // SMA
     * var ema = talib.MA(records, 20, 1);  // EMA
     * ```
     */
    MA(inReal: number[] | IRecord[], optInTimePeriod?: number, optInMAType?: number): number[];

    /**
     * MAVP - Moving Average with Variable Period
     * Note: This function requires two input arrays, currently not supported
     */

    /**
     * T3 - Triple Exponential Moving Average T3
     * @param inReal - Input data
     * @param optInTimePeriod - Calculation period, default 5
     * @param optInVFactor - Volume factor, default 0.7 (range 0~1)
     * @returns T3 array
     */
    T3(inReal: number[] | IRecord[], optInTimePeriod?: number, optInVFactor?: number): number[];

    /**
     * MAMA - MESA Adaptive Moving Average
     * @param inReal - Input data
     * @param optInFastLimit - Fast limit, default 0.5
     * @param optInSlowLimit - Slow limit, default 0.05
     * @returns [MAMA array, FAMA array] — MAMA line and Following Adaptive Moving Average
     */
    MAMA(inReal: number[] | IRecord[], optInFastLimit?: number, optInSlowLimit?: number): [number[], number[]];

    // ==================== Trend Indicators ====================

    /**
     * MACD - Moving Average Convergence Divergence
     * @param inReal - Input data
     * @param optInFastPeriod - Fast period, default 12
     * @param optInSlowPeriod - Slow period, default 26
     * @param optInSignalPeriod - Signal period, default 9
     * @returns [DIF array, DEA array, MACD histogram array]
     * ```js
     * var [dif, dea, macd] = talib.MACD(records, 12, 26, 9);
     * var lastMACD = macd[macd.length - 1];
     * Log("MACD histogram:", lastMACD);
     * ```
     */
    MACD(inReal: number[] | IRecord[], optInFastPeriod?: number, optInSlowPeriod?: number, optInSignalPeriod?: number): [number[], number[], number[]];

    /**
     * MACDEXT - MACD with customizable moving average types
     * @param inReal - Input data
     * @param optInFastPeriod - Fast period, default 12
     * @param optInFastMAType - Fast MA type, default 0(SMA)
     * @param optInSlowPeriod - Slow period, default 26
     * @param optInSlowMAType - Slow MA type, default 0(SMA)
     * @param optInSignalPeriod - Signal period, default 9
     * @param optInSignalMAType - Signal MA type, default 0(SMA)
     * @returns [DIF array, DEA array, MACD histogram array]
     */
    MACDEXT(inReal: number[] | IRecord[], optInFastPeriod?: number, optInFastMAType?: number, optInSlowPeriod?: number, optInSlowMAType?: number, optInSignalPeriod?: number, optInSignalMAType?: number): [number[], number[], number[]];

    /**
     * MACDFIX - MACD with fixed 12/26 periods, only signal period adjustable
     * @param inReal - Input data
     * @param optInSignalPeriod - Signal period, default 9
     * @returns [DIF array, DEA array, MACD histogram array]
     */
    MACDFIX(inReal: number[] | IRecord[], optInSignalPeriod?: number): [number[], number[], number[]];

    /**
     * ADX - Average Directional Movement Index
     * @param inPriceHLC - Candlestick data (requires High/Low/Close)
     * @param optInTimePeriod - Calculation period, default 14
     * @returns ADX array, value range 0~100, >25 indicates trending market
     * ```js
     * var adx = talib.ADX(records, 14);
     * if (adx[adx.length - 1] > 25) Log("Strong trend present");
     * ```
     */
    ADX(inPriceHLC: IRecord[], optInTimePeriod?: number): number[];

    /**
     * ADXR - Average Directional Movement Index Rating
     * @param inPriceHLC - Candlestick data
     * @param optInTimePeriod - Calculation period, default 14
     * @returns ADXR array
     */
    ADXR(inPriceHLC: IRecord[], optInTimePeriod?: number): number[];

    /**
     * DX - Directional Movement Index
     * @param inPriceHLC - Candlestick data
     * @param optInTimePeriod - Calculation period, default 14
     * @returns DX array
     */
    DX(inPriceHLC: IRecord[], optInTimePeriod?: number): number[];

    /**
     * PLUS_DI - Plus Directional Indicator
     * @param inPriceHLC - Candlestick data
     * @param optInTimePeriod - Calculation period, default 14
     * @returns +DI array
     */
    PLUS_DI(inPriceHLC: IRecord[], optInTimePeriod?: number): number[];

    /**
     * PLUS_DM - Plus Directional Movement
     * @param inPriceHL - Candlestick data (requires High/Low)
     * @param optInTimePeriod - Calculation period, default 14
     * @returns +DM array
     */
    PLUS_DM(inPriceHL: IRecord[], optInTimePeriod?: number): number[];

    /**
     * MINUS_DI - Minus Directional Indicator
     * @param inPriceHLC - Candlestick data
     * @param optInTimePeriod - Calculation period, default 14
     * @returns -DI array
     */
    MINUS_DI(inPriceHLC: IRecord[], optInTimePeriod?: number): number[];

    /**
     * MINUS_DM - Minus Directional Movement
     * @param inPriceHL - Candlestick data
     * @param optInTimePeriod - Calculation period, default 14
     * @returns -DM array
     */
    MINUS_DM(inPriceHL: IRecord[], optInTimePeriod?: number): number[];

    /**
     * SAR - Parabolic SAR
     * @param inPriceHL - Candlestick data (requires High/Low)
     * @param optInAcceleration - Acceleration factor, default 0.02
     * @param optInMaximum - Maximum acceleration factor, default 0.2
     * @returns SAR array
     * ```js
     * var sar = talib.SAR(records, 0.02, 0.2);
     * if (records[records.length-1].Close > sar[sar.length-1]) Log("Bullish trend");
     * ```
     */
    SAR(inPriceHL: IRecord[], optInAcceleration?: number, optInMaximum?: number): number[];

    /**
     * SAREXT - Extended Parabolic SAR
     * @param inPriceHL - Candlestick data
     * @param optInStartValue - Start value, default 0
     * @param optInOffsetOnReverse - Offset on reverse, default 0
     * @param optInAccelerationInitLong - Long initial acceleration factor, default 0.02
     * @param optInAccelerationLong - Long acceleration factor, default 0.02
     * @param optInAccelerationMaxLong - Long maximum acceleration factor, default 0.2
     * @param optInAccelerationInitShort - Short initial acceleration factor, default 0.02
     * @param optInAccelerationShort - Short acceleration factor, default 0.02
     * @param optInAccelerationMaxShort - Short maximum acceleration factor, default 0.2
     * @returns SAREXT array
     */
    SAREXT(inPriceHL: IRecord[], optInStartValue?: number, optInOffsetOnReverse?: number, optInAccelerationInitLong?: number, optInAccelerationLong?: number, optInAccelerationMaxLong?: number, optInAccelerationInitShort?: number, optInAccelerationShort?: number, optInAccelerationMaxShort?: number): number[];

    /**
     * AROON - Aroon
     * @param inPriceHL - Candlestick data (requires High/Low)
     * @param optInTimePeriod - Calculation period, default 14
     * @returns [AroonDown array, AroonUp array]
     */
    AROON(inPriceHL: IRecord[], optInTimePeriod?: number): [number[], number[]];

    /**
     * AROONOSC - Aroon Oscillator
     * @param inPriceHL - Candlestick data
     * @param optInTimePeriod - Calculation period, default 14
     * @returns AroonOsc array
     */
    AROONOSC(inPriceHL: IRecord[], optInTimePeriod?: number): number[];

    // ==================== Momentum Indicators ====================

    /**
     * RSI - Relative Strength Index
     * @param inReal - Input data
     * @param optInTimePeriod - Calculation period, default 14
     * @returns RSI array, value range 0~100. >70 overbought, <30 oversold
     * ```js
     * var rsi = talib.RSI(records, 14);
     * var last = rsi[rsi.length - 1];
     * if (last > 70) Log("Overbought zone");
     * if (last < 30) Log("Oversold zone");
     * ```
     */
    RSI(inReal: number[] | IRecord[], optInTimePeriod?: number): number[];

    /**
     * WILLR - Williams' %R
     * @param inPriceHLC - Candlestick data
     * @param optInTimePeriod - Calculation period, default 14
     * @returns Williams' %R array, value range -100~0
     */
    WILLR(inPriceHLC: IRecord[], optInTimePeriod?: number): number[];

    /**
     * CCI - Commodity Channel Index
     * @param inPriceHLC - Candlestick data
     * @param optInTimePeriod - Calculation period, default 14
     * @returns CCI array
     */
    CCI(inPriceHLC: IRecord[], optInTimePeriod?: number): number[];

    /**
     * MOM - Momentum
     * @param inReal - Input data
     * @param optInTimePeriod - Calculation period, default 10
     * @returns Momentum value array
     */
    MOM(inReal: number[] | IRecord[], optInTimePeriod?: number): number[];

    /**
     * ROC - Rate of Change
     * @param inReal - Input data
     * @param optInTimePeriod - Calculation period, default 10
     * @returns ROC array (percentage change * 100)
     */
    ROC(inReal: number[] | IRecord[], optInTimePeriod?: number): number[];

    /**
     * ROCP - Rate of Change Percentage
     * @param inReal - Input data
     * @param optInTimePeriod - Calculation period, default 10
     * @returns ROCP array
     */
    ROCP(inReal: number[] | IRecord[], optInTimePeriod?: number): number[];

    /**
     * ROCR - Rate of Change Ratio
     * @param inReal - Input data
     * @param optInTimePeriod - Calculation period, default 10
     * @returns ROCR array
     */
    ROCR(inReal: number[] | IRecord[], optInTimePeriod?: number): number[];

    /**
     * ROCR100 - Rate of Change Ratio 100 Scale
     * @param inReal - Input data
     * @param optInTimePeriod - Calculation period, default 10
     * @returns ROCR100 array
     */
    ROCR100(inReal: number[] | IRecord[], optInTimePeriod?: number): number[];

    /**
     * TRIX - Triple Smooth EMA, 1-day Rate-Of-Change
     * @param inReal - Input data
     * @param optInTimePeriod - Calculation period, default 30
     * @returns TRIX array
     */
    TRIX(inReal: number[] | IRecord[], optInTimePeriod?: number): number[];

    /**
     * PPO - Percentage Price Oscillator
     * @param inReal - Input data
     * @param optInFastPeriod - Fast period, default 12
     * @param optInSlowPeriod - Slow period, default 26
     * @param optInMAType - Moving average type, default 0(SMA)
     * @returns PPO array
     */
    PPO(inReal: number[] | IRecord[], optInFastPeriod?: number, optInSlowPeriod?: number, optInMAType?: number): number[];

    /**
     * APO - Absolute Price Oscillator
     * @param inReal - Input data
     * @param optInFastPeriod - Fast period, default 12
     * @param optInSlowPeriod - Slow period, default 26
     * @param optInMAType - Moving average type, default 0(SMA)
     * @returns APO array
     */
    APO(inReal: number[] | IRecord[], optInFastPeriod?: number, optInSlowPeriod?: number, optInMAType?: number): number[];

    /**
     * CMO - Chande Momentum Oscillator
     * @param inReal - Input data
     * @param optInTimePeriod - Calculation period, default 14
     * @returns CMO array
     */
    CMO(inReal: number[] | IRecord[], optInTimePeriod?: number): number[];

    /**
     * ULTOSC - Ultimate Oscillator
     * @param inPriceHLC - Candlestick data
     * @param optInTimePeriod1 - Period 1, default 7
     * @param optInTimePeriod2 - Period 2, default 14
     * @param optInTimePeriod3 - Period 3, default 28
     * @returns ULTOSC array
     */
    ULTOSC(inPriceHLC: IRecord[], optInTimePeriod1?: number, optInTimePeriod2?: number, optInTimePeriod3?: number): number[];

    // ==================== Stochastic/KDJ Indicators ====================

    /**
     * STOCH - Stochastic, i.e. KD lines of KDJ
     * @param inPriceHLC - Candlestick data
     * @param optInFastK_Period - Fast K period, default 5
     * @param optInSlowK_Period - Slow K period, default 3
     * @param optInSlowK_MAType - Slow K MA type, default 0(SMA)
     * @param optInSlowD_Period - Slow D period, default 3
     * @param optInSlowD_MAType - Slow D MA type, default 0(SMA)
     * @returns [SlowK array, SlowD array]
     * ```js
     * var [k, d] = talib.STOCH(records, 9, 3, 0, 3, 0);
     * ```
     */
    STOCH(inPriceHLC: IRecord[], optInFastK_Period?: number, optInSlowK_Period?: number, optInSlowK_MAType?: number, optInSlowD_Period?: number, optInSlowD_MAType?: number): [number[], number[]];

    /**
     * STOCHF - Stochastic Fast
     * @param inPriceHLC - Candlestick data
     * @param optInFastK_Period - Fast K period, default 5
     * @param optInFastD_Period - Fast D period, default 3
     * @param optInFastD_MAType - Fast D MA type, default 0(SMA)
     * @returns [FastK array, FastD array]
     */
    STOCHF(inPriceHLC: IRecord[], optInFastK_Period?: number, optInFastD_Period?: number, optInFastD_MAType?: number): [number[], number[]];

    /**
     * STOCHRSI - Stochastic Relative Strength Index
     * @param inReal - Input data
     * @param optInTimePeriod - RSI period, default 14
     * @param optInFastK_Period - Fast K period, default 5
     * @param optInFastD_Period - Fast D period, default 3
     * @param optInFastD_MAType - Fast D MA type, default 0(SMA)
     * @returns [FastK array, FastD array]
     */
    STOCHRSI(inReal: number[] | IRecord[], optInTimePeriod?: number, optInFastK_Period?: number, optInFastD_Period?: number, optInFastD_MAType?: number): [number[], number[]];

    // ==================== Volatility Indicators ====================

    /**
     * BBANDS - Bollinger Bands
     * @param inReal - Input data
     * @param optInTimePeriod - Calculation period, default 5
     * @param optInNbDevUp - Upper band standard deviation multiplier, default 2
     * @param optInNbDevDn - Lower band standard deviation multiplier, default 2
     * @param optInMAType - Moving average type, default 0(SMA)
     * @returns [Upper band array, Middle band array, Lower band array]
     * ```js
     * var [upper, middle, lower] = talib.BBANDS(records, 20, 2, 2);
     * var price = records[records.length - 1].Close;
     * if (price > upper[upper.length - 1]) Log("Breakout above upper band");
     * if (price < lower[lower.length - 1]) Log("Breakout below lower band");
     * ```
     */
    BBANDS(inReal: number[] | IRecord[], optInTimePeriod?: number, optInNbDevUp?: number, optInNbDevDn?: number, optInMAType?: number): [number[], number[], number[]];

    /**
     * ATR - Average True Range
     * @param inPriceHLC - Candlestick data
     * @param optInTimePeriod - Calculation period, default 14
     * @returns ATR array
     * ```js
     * var atr = talib.ATR(records, 14);
     * Log("Current ATR:", atr[atr.length - 1]);
     * ```
     */
    ATR(inPriceHLC: IRecord[], optInTimePeriod?: number): number[];

    /**
     * NATR - Normalized ATR
     * @param inPriceHLC - Candlestick data
     * @param optInTimePeriod - Calculation period, default 14
     * @returns NATR array (percentage)
     */
    NATR(inPriceHLC: IRecord[], optInTimePeriod?: number): number[];

    /**
     * TRANGE - True Range
     * @param inPriceHLC - Candlestick data
     * @returns True Range array
     */
    TRANGE(inPriceHLC: IRecord[]): number[];

    /**
     * STDDEV - Standard Deviation
     * @param inReal - Input data
     * @param optInTimePeriod - Calculation period, default 5
     * @param optInNbDev - Standard deviation multiplier, default 1
     * @returns Standard deviation array
     */
    STDDEV(inReal: number[] | IRecord[], optInTimePeriod?: number, optInNbDev?: number): number[];

    /**
     * VAR - Variance
     * @param inReal - Input data
     * @param optInTimePeriod - Calculation period, default 5
     * @param optInNbDev - Standard deviation multiplier, default 1
     * @returns Variance array
     */
    VAR(inReal: number[] | IRecord[], optInTimePeriod?: number, optInNbDev?: number): number[];

    // ==================== Volume Indicators ====================

    /**
     * OBV - On Balance Volume
     * @param inReal - Close price array or candlestick array
     * @param inPriceV - Candlestick array containing Volume
     * @returns OBV array
     * ```js
     * var obv = talib.OBV(records, records);
     * ```
     */
    OBV(inReal: number[] | IRecord[], inPriceV: IRecord[]): number[];

    /**
     * AD - Chaikin A/D Line
     * @param inPriceHLCV - Candlestick data (requires High/Low/Close/Volume)
     * @returns AD array
     */
    AD(inPriceHLCV: IRecord[]): number[];

    /**
     * ADOSC - Chaikin A/D Oscillator
     * @param inPriceHLCV - Candlestick data
     * @param optInFastPeriod - Fast period, default 3
     * @param optInSlowPeriod - Slow period, default 10
     * @returns ADOSC array
     */
    ADOSC(inPriceHLCV: IRecord[], optInFastPeriod?: number, optInSlowPeriod?: number): number[];

    /**
     * MFI - Money Flow Index
     * @param inPriceHLCV - Candlestick data (requires High/Low/Close/Volume)
     * @param optInTimePeriod - Calculation period, default 14
     * @returns MFI array, value range 0~100
     */
    MFI(inPriceHLCV: IRecord[], optInTimePeriod?: number): number[];

    // ==================== Price Transform Indicators ====================

    /** Weighted Close Price: (High+Low+Close*2)/4 */
    WCLPRICE(inPriceHLC: IRecord[]): number[];
    /** Typical Price: (High+Low+Close)/3 */
    TYPPRICE(inPriceHLC: IRecord[]): number[];
    /** Median Price: (High+Low)/2 */
    MEDPRICE(inPriceHL: IRecord[]): number[];
    /** Average Price: (Open+High+Low+Close)/4 */
    AVGPRICE(inPriceOHLC: IRecord[]): number[];
    /** Mid Point: (Highest+Lowest)/2 */
    MIDPOINT(inReal: number[] | IRecord[], optInTimePeriod?: number): number[];
    /** Mid Price: (Highest High in period + Lowest Low in period)/2 */
    MIDPRICE(inPriceHL: IRecord[], optInTimePeriod?: number): number[];

    // ==================== Statistical/Regression Indicators ====================

    /**
     * LINEARREG - Linear Regression
     * @param inReal - Input data
     * @param optInTimePeriod - Calculation period, default 14
     * @returns Linear regression value array
     */
    LINEARREG(inReal: number[] | IRecord[], optInTimePeriod?: number): number[];

    /** Linear regression slope */
    LINEARREG_SLOPE(inReal: number[] | IRecord[], optInTimePeriod?: number): number[];
    /** Linear regression intercept */
    LINEARREG_INTERCEPT(inReal: number[] | IRecord[], optInTimePeriod?: number): number[];
    /** Linear regression angle */
    LINEARREG_ANGLE(inReal: number[] | IRecord[], optInTimePeriod?: number): number[];

    /**
     * TSF - Time Series Forecast
     * @param inReal - Input data
     * @param optInTimePeriod - Calculation period, default 14
     * @returns TSF array
     */
    TSF(inReal: number[] | IRecord[], optInTimePeriod?: number): number[];

    // ==================== Hilbert Transform Indicators ====================

    /** Hilbert Transform - Instantaneous Trendline */
    HT_TRENDLINE(inReal: number[] | IRecord[]): number[];
    /** Hilbert Transform - Trend vs Cycle Mode (1=trend, 0=cycle) */
    HT_TRENDMODE(inReal: number[] | IRecord[]): number[];
    /** Hilbert Transform - Sine Wave, returns [Sine array, LeadSine array] */
    HT_SINE(inReal: number[] | IRecord[]): [number[], number[]];
    /** Hilbert Transform - Phasor Components, returns [InPhase array, Quadrature array] */
    HT_PHASOR(inReal: number[] | IRecord[]): [number[], number[]];
    /** Hilbert Transform - Dominant Cycle Phase */
    HT_DCPHASE(inReal: number[] | IRecord[]): number[];
    /** Hilbert Transform - Dominant Cycle Period */
    HT_DCPERIOD(inReal: number[] | IRecord[]): number[];

    // ==================== Mathematical Functions ====================

    /** Ceiling (round up) */
    CEIL(inReal: number[] | IRecord[]): number[];
    /** Floor (round down) */
    FLOOR(inReal: number[] | IRecord[]): number[];
    /** Exponential function e^x */
    EXP(inReal: number[] | IRecord[]): number[];
    /** Natural logarithm ln(x) */
    LN(inReal: number[] | IRecord[]): number[];
    /** Common logarithm log10(x) */
    LOG10(inReal: number[] | IRecord[]): number[];
    /** Square root */
    SQRT(inReal: number[] | IRecord[]): number[];

    // ==================== Trigonometric Functions ====================

    /** Sine */
    SIN(inReal: number[] | IRecord[]): number[];
    /** Cosine */
    COS(inReal: number[] | IRecord[]): number[];
    /** Tangent */
    TAN(inReal: number[] | IRecord[]): number[];
    /** Hyperbolic sine */
    SINH(inReal: number[] | IRecord[]): number[];
    /** Hyperbolic cosine */
    COSH(inReal: number[] | IRecord[]): number[];
    /** Hyperbolic tangent */
    TANH(inReal: number[] | IRecord[]): number[];
    /** Arc sine */
    ASIN(inReal: number[] | IRecord[]): number[];
    /** Arc cosine */
    ACOS(inReal: number[] | IRecord[]): number[];
    /** Arc tangent */
    ATAN(inReal: number[] | IRecord[]): number[];

    // ==================== Min/Max/Sum ====================

    /**
     * MAX - Highest value over a specified period
     * @param inReal - Input data
     * @param optInTimePeriod - Calculation period, default 30
     */
    MAX(inReal: number[] | IRecord[], optInTimePeriod?: number): number[];
    /** Index of highest value over a specified period */
    MAXINDEX(inReal: number[] | IRecord[], optInTimePeriod?: number): number[];
    /**
     * MIN - Lowest value over a specified period
     * @param inReal - Input data
     * @param optInTimePeriod - Calculation period, default 30
     */
    MIN(inReal: number[] | IRecord[], optInTimePeriod?: number): number[];
    /** Index of lowest value over a specified period */
    MININDEX(inReal: number[] | IRecord[], optInTimePeriod?: number): number[];
    /** Get both min and max values over a specified period, returns [Min array, Max array] */
    MINMAX(inReal: number[] | IRecord[], optInTimePeriod?: number): [number[], number[]];
    /** Get indices of both min and max values, returns [MinIdx array, MaxIdx array] */
    MINMAXINDEX(inReal: number[] | IRecord[], optInTimePeriod?: number): [number[], number[]];
    /**
     * SUM - Summation over a specified period
     * @param inReal - Input data
     * @param optInTimePeriod - Calculation period, default 30
     */
    SUM(inReal: number[] | IRecord[], optInTimePeriod?: number): number[];

    // ==================== Other Indicators ====================

    /**
     * BOP - Balance Of Power
     * @param inPriceOHLC - Candlestick data
     * @returns BOP array
     */
    BOP(inPriceOHLC: IRecord[]): number[];

    // ==================== Candlestick Pattern Recognition ====================
    // All CDL* functions accept candlestick array (OHLC) and return pattern signal array:
    // Positive (100/200) = bullish signal, Negative (-100/-200) = bearish signal, 0 = no signal

    /** Abandoned Baby, optInPenetration is penetration rate, default 0.3 */
    CDLABANDONEDBABY(inPriceOHLC: IRecord[], optInPenetration?: number): number[];
    /** Advance Block */
    CDLADVANCEBLOCK(inPriceOHLC: IRecord[]): number[];
    /** Belt-hold */
    CDLBELTHOLD(inPriceOHLC: IRecord[]): number[];
    /** Breakaway */
    CDLBREAKAWAY(inPriceOHLC: IRecord[]): number[];
    /** Closing Marubozu */
    CDLCLOSINGMARUBOZU(inPriceOHLC: IRecord[]): number[];
    /** Concealing Baby Swallow */
    CDLCONCEALBABYSWALL(inPriceOHLC: IRecord[]): number[];
    /** Counterattack */
    CDLCOUNTERATTACK(inPriceOHLC: IRecord[]): number[];
    /** Dark Cloud Cover, optInPenetration is penetration rate */
    CDLDARKCLOUDCOVER(inPriceOHLC: IRecord[], optInPenetration?: number): number[];
    /** Doji */
    CDLDOJI(inPriceOHLC: IRecord[]): number[];
    /** Doji Star */
    CDLDOJISTAR(inPriceOHLC: IRecord[]): number[];
    /** Dragonfly Doji */
    CDLDRAGONFLYDOJI(inPriceOHLC: IRecord[]): number[];
    /** Engulfing Pattern */
    CDLENGULFING(inPriceOHLC: IRecord[]): number[];
    /** Evening Doji Star */
    CDLEVENINGDOJISTAR(inPriceOHLC: IRecord[], optInPenetration?: number): number[];
    /** Evening Star */
    CDLEVENINGSTAR(inPriceOHLC: IRecord[], optInPenetration?: number): number[];
    /** Up/Down-gap side-by-side white lines */
    CDLGAPSIDESIDEWHITE(inPriceOHLC: IRecord[]): number[];
    /** Gravestone Doji */
    CDLGRAVESTONEDOJI(inPriceOHLC: IRecord[]): number[];
    /** Hammer */
    CDLHAMMER(inPriceOHLC: IRecord[]): number[];
    /** Hanging Man */
    CDLHANGINGMAN(inPriceOHLC: IRecord[]): number[];
    /** Harami Pattern */
    CDLHARAMI(inPriceOHLC: IRecord[]): number[];
    /** Harami Cross */
    CDLHARAMICROSS(inPriceOHLC: IRecord[]): number[];
    /** High-Wave Candle */
    CDLHIGHWAVE(inPriceOHLC: IRecord[]): number[];
    /** Hikkake Pattern */
    CDLHIKKAKE(inPriceOHLC: IRecord[]): number[];
    /** Modified Hikkake */
    CDLHIKKAKEMOD(inPriceOHLC: IRecord[]): number[];
    /** Homing Pigeon */
    CDLHOMINGPIGEON(inPriceOHLC: IRecord[]): number[];
    /** Identical Three Crows */
    CDLIDENTICAL3CROWS(inPriceOHLC: IRecord[]): number[];
    /** In-Neck Pattern */
    CDLINNECK(inPriceOHLC: IRecord[]): number[];
    /** Inverted Hammer */
    CDLINVERTEDHAMMER(inPriceOHLC: IRecord[]): number[];
    /** Kicking */
    CDLKICKING(inPriceOHLC: IRecord[]): number[];
    /** Kicking determined by longer marubozu */
    CDLKICKINGBYLENGTH(inPriceOHLC: IRecord[]): number[];
    /** Ladder Bottom */
    CDLLADDERBOTTOM(inPriceOHLC: IRecord[]): number[];
    /** Long Legged Doji */
    CDLLONGLEGGEDDOJI(inPriceOHLC: IRecord[]): number[];
    /** Long Line Candle */
    CDLLONGLINE(inPriceOHLC: IRecord[]): number[];
    /** Marubozu */
    CDLMARUBOZU(inPriceOHLC: IRecord[]): number[];
    /** Matching Low */
    CDLMATCHINGLOW(inPriceOHLC: IRecord[]): number[];
    /** Mat Hold */
    CDLMATHOLD(inPriceOHLC: IRecord[], optInPenetration?: number): number[];
    /** Morning Doji Star */
    CDLMORNINGDOJISTAR(inPriceOHLC: IRecord[], optInPenetration?: number): number[];
    /** Morning Star */
    CDLMORNINGSTAR(inPriceOHLC: IRecord[], optInPenetration?: number): number[];
    /** On-Neck Pattern */
    CDLONNECK(inPriceOHLC: IRecord[]): number[];
    /** Piercing Pattern */
    CDLPIERCING(inPriceOHLC: IRecord[]): number[];
    /** Rickshaw Man */
    CDLRICKSHAWMAN(inPriceOHLC: IRecord[]): number[];
    /** Rising/Falling Three Methods */
    CDLRISEFALL3METHODS(inPriceOHLC: IRecord[]): number[];
    /** Separating Lines */
    CDLSEPARATINGLINES(inPriceOHLC: IRecord[]): number[];
    /** Shooting Star */
    CDLSHOOTINGSTAR(inPriceOHLC: IRecord[]): number[];
    /** Short Line Candle */
    CDLSHORTLINE(inPriceOHLC: IRecord[]): number[];
    /** Spinning Top */
    CDLSPINNINGTOP(inPriceOHLC: IRecord[]): number[];
    /** Stalled Pattern */
    CDLSTALLEDPATTERN(inPriceOHLC: IRecord[]): number[];
    /** Stick Sandwich */
    CDLSTICKSANDWICH(inPriceOHLC: IRecord[]): number[];
    /** Takuri (Dragonfly Doji with very long lower shadow) */
    CDLTAKURI(inPriceOHLC: IRecord[]): number[];
    /** Tasuki Gap */
    CDLTASUKIGAP(inPriceOHLC: IRecord[]): number[];
    /** Thrusting Pattern */
    CDLTHRUSTING(inPriceOHLC: IRecord[]): number[];
    /** Tristar Pattern */
    CDLTRISTAR(inPriceOHLC: IRecord[]): number[];
    /** Unique 3 River */
    CDLUNIQUE3RIVER(inPriceOHLC: IRecord[]): number[];
    /** Upside Gap Two Crows */
    CDLUPSIDEGAP2CROWS(inPriceOHLC: IRecord[]): number[];
    /** Upside/Downside Gap Three Methods */
    CDLXSIDEGAP3METHODS(inPriceOHLC: IRecord[]): number[];
    /** Three Advancing White Soldiers */
    CDL3WHITESOLDIERS(inPriceOHLC: IRecord[]): number[];
    /** Three Stars In The South */
    CDL3STARSINSOUTH(inPriceOHLC: IRecord[]): number[];
    /** Three Outside Up/Down */
    CDL3OUTSIDE(inPriceOHLC: IRecord[]): number[];
    /** Three-Line Strike */
    CDL3LINESTRIKE(inPriceOHLC: IRecord[]): number[];
    /** Three Inside Up/Down */
    CDL3INSIDE(inPriceOHLC: IRecord[]): number[];
    /** Three Black Crows */
    CDL3BLACKCROWS(inPriceOHLC: IRecord[]): number[];
    /** Two Crows */
    CDL2CROWS(inPriceOHLC: IRecord[]): number[];
}

// ==================== FMZ Built-in TA Indicator Library ====================
/**
 * FMZ Platform built-in technical analysis indicator library (simplified version), more commonly used and easier than talib
 * Access via global variable `TA`
 *
 * ```js
 * var records = exchange.GetRecords();
 * var [k, d, j] = TA.KDJ(records, 9, 3, 3);
 * var [up, mid, down] = TA.BOLL(records, 20, 2);
 * ```
 */
interface ITA {
    /**
     * CMF - Chaikin Money Flow
     * @param inPriceHLCV - Candlestick array (requires High/Low/Close/Volume)
     * @param periods - Calculation period, default 20
     * @returns CMF array
     */
    CMF(inPriceHLCV: IRecord[], periods?: number): number[];

    /**
     * Alligator - Alligator Indicator (Williams)
     * @param inPriceHL - Candlestick array (requires High/Low)
     * @param jawLength - Alligator jaw period, default 13
     * @param teethLength - Alligator teeth period, default 8
     * @param lipsLength - Alligator lips period, default 5
     * @returns [jaw array, teeth array, lips array]
     * ```js
     * var [jaw, teeth, lips] = TA.Alligator(records, 13, 8, 5);
     * ```
     */
    Alligator(inPriceHL: IRecord[], jawLength?: number, teethLength?: number, lipsLength?: number): [number[], number[], number[]];

    /**
     * ATR - Average True Range
     * @param inPriceHLC - Candlestick data
     * @param optInTimePeriod - Calculation period, default 14
     * @returns ATR array
     */
    ATR(inPriceHLC: IRecord[], optInTimePeriod?: number): number[];

    /**
     * OBV - On Balance Volume
     * Note: unlike talib.OBV(inReal, inPriceV), TA.OBV takes a single candlestick array parameter
     * @param records - Candlestick array (requires Close/Volume)
     * @returns OBV array
     */
    OBV(records: IRecord[]): number[];

    /**
     * RSI - Relative Strength Index
     * @param inReal - Input data
     * @param optInTimePeriod - Calculation period, default 14
     * @returns RSI array, value range 0~100
     */
    RSI(inReal: number[] | IRecord[], optInTimePeriod?: number): number[];

    /**
     * KDJ - Stochastic Oscillator
     * @param inPriceHLC - Candlestick array (requires High/Low/Close)
     * @param period - K-line period, default 9
     * @param kPeriod - K-line smoothing period, default 3
     * @param dPeriod - D-line smoothing period, default 3
     * @returns [K array, D array, J array]
     * ```js
     * var [k, d, j] = TA.KDJ(records, 9, 3, 3);
     * Log("K:", k[k.length-1], "D:", d[d.length-1], "J:", j[j.length-1]);
     * ```
     */
    KDJ(inPriceHLC: IRecord[], period?: number, kPeriod?: number, dPeriod?: number): [number[], number[], number[]];

    /**
     * BOLL - Bollinger Bands
     * @param inReal - Input data
     * @param period - Calculation period, default 20
     * @param multiplier - Standard deviation multiplier, default 2
     * @returns [upper band array, middle band array, lower band array]
     * ```js
     * var [upper, middle, lower] = TA.BOLL(records, 20, 2);
     * ```
     */
    BOLL(inReal: number[] | IRecord[], period?: number, multiplier?: number): [number[], number[], number[]];

    /**
     * MACD - Moving Average Convergence Divergence
     * @param inReal - Input data
     * @param optInFastPeriod - Fast line period, default 12
     * @param optInSlowPeriod - Slow line period, default 26
     * @param optInSignalPeriod - Signal line period, default 9
     * @returns [DIF array, DEA array, MACD histogram array]
     */
    MACD(inReal: number[] | IRecord[], optInFastPeriod?: number, optInSlowPeriod?: number, optInSignalPeriod?: number): [number[], number[], number[]];

    /**
     * EMA - Exponential Moving Average
     * @param inReal - Input data
     * @param optInTimePeriod - Calculation period
     * @returns EMA array
     */
    EMA(inReal: number[] | IRecord[], optInTimePeriod?: number): number[];

    /**
     * SMA - Simple Moving Average
     * @param inReal - Input data
     * @param optInTimePeriod - Calculation period
     * @returns SMA array
     */
    SMA(inReal: number[] | IRecord[], optInTimePeriod?: number): number[];

    /**
     * MA - Moving Average (default SMA)
     * @param inReal - Input data
     * @param optInTimePeriod - Calculation period
     * @returns MA array
     */
    MA(inReal: number[] | IRecord[], optInTimePeriod?: number): number[];

    /**
     * Highest - Get the highest value within a period
     * @param inReal - Input data
     * @param period - Calculation period, if not provided, calculates all data
     * @param attr - Candlestick attribute name (when passing candlestick array), such as "High", "Low", "Close", "Volume"
     * @returns Highest value (single number)
     * ```js
     * var highestHigh = TA.Highest(records, 20, "High");
     * var highestClose = TA.Highest(records, 10, "Close");
     * ```
     */
    Highest(inReal: number[] | IRecord[], period?: number, attr?: string): number;

    /**
     * Lowest - Get the lowest value within a period
     * @param inReal - Input data
     * @param period - Calculation period, if not provided, calculates all data
     * @param attr - Candlestick attribute name, such as "High", "Low", "Close", "Volume"
     * @returns Lowest value (single number)
     * ```js
     * var lowestLow = TA.Lowest(records, 20, "Low");
     * ```
     */
    Lowest(inReal: number[] | IRecord[], period?: number, attr?: string): number;
}

/**
 * Database execution result structure
 */

interface IDBExecRet {
    /** Query result data rows, each row is an array of values */
    values: Array<Array<any>>;
    /** Column name array */
    columns: string[];
}

/**
 * Dial connection object for TCP, WebSocket and databases.
 * Created via Dial(); network handles can be passed to Thread and keep the same fd across reconnects.
 *
 * ```js
 * // WebSocket connection
 * var ws = Dial("wss://stream.binance.com:9443/ws/btcusdt@ticker");
 * var msg = ws.read(5000);  // Read with 5 second timeout
 * ws.close();
 *
 * // Database connection
 * var db = Dial("sqlite3:///mydata.db");
 * db.exec("CREATE TABLE IF NOT EXISTS kv(k TEXT PRIMARY KEY, v TEXT)");
 * db.exec("INSERT INTO kv VALUES(?, ?)", "key1", "value1");
 * var ret = db.exec("SELECT * FROM kv");
 * db.close();
 * ```
 */
interface IDial {
    /**
     * Read from the connection
     * @param timeoutMs - timeout in milliseconds:
     *   - > 0: wait up to this long, null when nothing arrived;
     *   - 0 or omitted: block until data arrives;
     *   - -1: non-blocking, pop one message or null;
     *   - < -1 (e.g. -2): drop the backlog and return only the latest message, or null.
     *   Returns "" (empty string) once the peer disconnected. With reconnect enabled the
     *   reconnection runs in the background: read returns "" meanwhile and resumes on the
     *   new connection automatically; fd stays the same.
     * Return value: string when the frame is valid UTF-8, otherwise an ArrayBuffer with the raw bytes (same as the old runtime)
     * @returns the message string; null on timeout; "" when disconnected
     */
    read(timeoutMs?: number): string | ArrayBuffer | null;

    /**
     * Write data to the connection
     * @param data - Data to send (string or binary data)
     * @param timeoutMs - Write timeout in milliseconds
     * @returns Number of bytes written, returns 0 when the connection is broken
     */
    write(data: string | ArrayBuffer, timeoutMs?: number): number;

    /**
     * Execute SQL statement (only available for database connections)
     * @param sql - SQL statement
     * @param extra - Binding values for SQL parameterized queries. number / string / boolean / null
     *   bind as-is; BigInt is converted exactly to a 64-bit integer (`BigInt(ts)` into an
     *   Int64/UInt64 column keeps every digit); Uint8Array / ArrayBuffer are written as binary (blob).
     *   ClickHouse batch insert: when every extra is an array, each array is one row,
     *   `db.exec("INSERT INTO t VALUES(?,?)", [a1, b1], [a2, b2])`.
     * @returns Query result object, returns null on failure
     * ```js
     * // SQL
     * var ret = db.exec("SELECT * FROM users WHERE age > ?", 18);
     * ```
     */
    exec(sql: string, ...extra: any[]): IDBExecRet | null;

    /**
     * Get the file descriptor number of the connection
     * @returns File descriptor number
     */
    fd(): number;

    /**
     * Close the connection and release resources
     */
    close(): void;
}

/**
 * Event loop message structure, returned by EventLoop()
 */
interface IEventMsg {
    /** Event sequence number */
    Seq: number;
    /** Event type, such as "ticker", "order", "thread", etc. */
    Event: string;
    /** Thread ID that triggered the event */
    ThreadId: number;
    /** Exchange index */
    Index: number;
    /** Events still queued in the compatibility mux when this event is returned */
    Queue: number;
    /** Event time (nanoseconds) */
    Nano: number;
    /** Related trading pair (present on market/order events) */
    Symbol?: string;
    /** If it's a market event, contains Ticker data */
    Ticker?: ITicker;
    /** If it's an order event, contains Order data */
    Order?: IOrder;
}

/**
 * Chart object, used to draw custom charts on the strategy page
 * Created via Chart() or KLineChart()
 *
 * ```js

* var chart = Chart({
*     title: { text: "Price Trend" },
*     xAxis: { type: "datetime" },
*     series: [{ name: "Price", data: [] }]
* });
* chart.add(0, [Date.now(), ticker.Last]);
* ```
*/
interface IChart {
    /**
     * Add a data point to the specified series in the chart
     * @param series - Series index (starting from 0)
     * @param data - Data point, format depends on chart type (e.g., [timestamp, value] or single value)
     * @param index - Update the data point at the specified index (omit to append to end, -1 to update the last one)
     */
    add(series: number, data: any, index?: number): void;
    /**
     * Add a data point to the chart (array form)
     * @param data - Array in the form [seriesIndex, dataPoint] or [seriesIndex, dataPoint, updateIndex]
     * ```js
     * chart.add([0, [new Date().getTime(), ticker.Buy]]);
     * ```
     */
    add(data: any[]): void;

    /**
     * Reset chart data
     * @param remain - Number of recent data points to retain, defaults to 0 (clear all)
     */
    reset(remain?: number): void;

    /**
     * Delete the specified series
     * @param series - Index of the series to delete
     */
    del(series: number): void;

    /**
     * Update chart configuration options
     * @param options - New chart configuration (Highcharts/Highstock configuration object)
     */
    update(options: object): void;
}

/**
 * K-line chart control object created by KLineChart(), providing Pine Script style drawing methods
 * Drawing operations must be executed while iterating over candlestick data, starting each bar with begin(bar) and ending with close()
 *
 * Optional parameters of each drawing method can be passed positionally in declared order, or as an options object in the last argument position
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
     * Start processing a candlestick bar, must be the first call of drawing operations for each bar
     * @param bar - Current candlestick bar data (IRecord)
     */
    begin(bar: IRecord): void;

    /**
     * Finish drawing operations for the current bar and output to the chart, must be paired with begin(bar)
     * @param bar - Current candlestick bar data (optional, ignored at runtime)
     */
    close(bar?: IRecord): void;

    /**
     * Reset chart data
     * @param remain - Number of recent data points to retain, defaults to 0 (clear all)
     */
    reset(remain?: number): void;

    /**
     * Draw a line on the chart (similar to Pine's plot)
     * @param series - Data value (pass NaN to skip drawing at this bar, enabling discontinuous line segments)
     * @param title - Line name
     * @param options - Options object: { color, linewidth, style("line"|"linebr"|"histogram" etc.), offset, join, histbase, display, overlay } etc.
     * @returns Plot object index (can be passed to fill)
     * ```js
     * var h = c.plot(bar.High, 'high');
     * c.plot(bar.Open < bar.Close ? NaN : bar.Close, "Close", {style: "linebr"});
     * ```
     */
    plot(series: number, title?: string | { [key: string]: any }, options?: { [key: string]: any }): number;

    /**
     * Draw a horizontal line at the specified price
     * @param price - Horizontal line price
     * @param title - Line name
     * @param options - Options object: { color, linestyle("dashed"|"dotted"|"solid"), linewidth, display, overlay } etc.
     * @returns Plot object index (can be passed to fill)
     */
    hline(price: number, title?: string | { [key: string]: any }, options?: { [key: string]: any }): number;

    /**
     * Draw a shape marker on the candlestick
     * @param series - Data value or condition (draws marker when truthy; price position when location is "absolute")
     * @param title - Marker name
     * @param options - Options object: { style("diamond" etc.), location("abovebar"|"belowbar"|"absolute"), color, offset, text, textcolor, size } etc.
     * ```js
     * c.plotshape(bar.Low, { style: 'diamond' });
     * ```
     */
    plotshape(series: number | boolean, title?: string | { [key: string]: any }, options?: { [key: string]: any }): void;

    /**
     * Draw a character marker on the candlestick
     * @param series - Data value or condition (draws marker when truthy; price position when location is "absolute")
     * @param title - Marker name
     * @param options - Options object: { char(required), location("abovebar"|"belowbar"|"absolute"), color, offset, text, textcolor, size } etc.
     * ```js
     * c.plotchar(bar.Close, { char: 'X' });
     * ```
     */
    plotchar(series: number | boolean, title?: string | { [key: string]: any }, options?: { [key: string]: any }): void;

    /**
     * Draw up/down arrows, positive values draw up arrows, negative values draw down arrows, absolute value determines arrow length
     * @param series - Data value
     * @param title - Name
     * @param options - Options object: { colorup, colordown, offset, minheight, maxheight } etc.
     * ```js
     * c.plotarrow(bar.Close - bar.Open);
     * ```
     */
    plotarrow(series: number, title?: string | { [key: string]: any }, options?: { [key: string]: any }): void;

    /**
     * Draw a custom candlestick
     * @param open - Open price
     * @param high - High price
     * @param low - Low price
     * @param close - Close price
     * @param title - Name
     * @param options - Options object: { color, wickcolor, bordercolor, display } etc.
     * ```js
     * c.plotcandle(bar.Open*0.9, bar.High*0.9, bar.Low*0.9, bar.Close*0.9);
     * ```
     */
    plotcandle(open: number, high: number, low: number, close: number, title?: string | { [key: string]: any }, options?: { [key: string]: any }): void;

    /**
     * Set the color of the current candlestick bar
     * @param color - Color string, e.g. 'rgba(255, 0, 0, 0.2)' or '#ff0000'
     * @param options - Options object: { offset, show_last, title, display } etc.
     */
    barcolor(color: string, options?: { [key: string]: any }): void;

    /**
     * Set the background color at the current candlestick position
     * @param color - Color string, e.g. 'rgba(0, 255, 0, 0.5)'
     * @param options - Options object: { offset, show_last, title, display, overlay } etc.
     */
    bgcolor(color: string, options?: { [key: string]: any }): void;

    /**
     * Fill the area between two plot objects (return values of plot/hline)
     * @param plot1 - First plot object index
     * @param plot2 - Second plot object index
     * @param options - Options object: { color, fillgaps, show_last, title, display } etc.
     * ```js
     * var h = c.plot(bar.High, 'high');
     * var l = c.plot(bar.Low, 'low');
     * c.fill(h, l, { color: 'rgba(255, 0, 0, 0.2)' });
     * ```
     */
    fill(plot1: number, plot2: number, options?: { [key: string]: any }): void;

    /**
     * Mark a trading signal on the chart
     * @param direction - Signal direction: "buy"/"long"(open long), "sell"/"short"(open short), "closebuy"/"closelong"(close long), "closesell"/"closeshort"(close short)
     * @param price - Signal price
     * @param qty - Signal quantity
     * @param id - Signal identifier (optional, defaults to direction)
     * ```js
     * c.signal("long", bar.High, 1.5);
     * c.signal("closelong", bar.Low, 1.5);
     * ```
     */
    signal(direction: string, price: number, qty: number, id?: string): void;
}

/**
 * Condition order parameter structure, defining take-profit and stop-loss trigger conditions
 *
 * ```js
 * // Take-profit condition
 * var tpCondition = {
 *     ConditionType: ORDER_CONDITION_TYPE_TP,
 *     TpTriggerPrice: 55000,   // Triggers when price reaches 55000
 *     TpOrderPrice: 54900      // Places order at price 54900
 * };
 * // Stop-loss condition
 * var slCondition = {
 *     ConditionType: ORDER_CONDITION_TYPE_SL,
 *     SlTriggerPrice: 48000,
 *     SlOrderPrice: 47900
 * };
 * // OCO condition (set take-profit and stop-loss simultaneously)
 * var ocoCondition = {
 *     ConditionType: ORDER_CONDITION_TYPE_OCO,
 *     TpTriggerPrice: 55000, TpOrderPrice: 54900,
 *     SlTriggerPrice: 48000, SlOrderPrice: 47900
 * };
 * ```
 */
declare interface ICondition {
    /** Condition type: ORDER_CONDITION_TYPE_OCO(0), TP(1-take profit), SL(2-stop loss), GENERIC(3-generic) */
    ConditionType:  number;
    /** Take-profit trigger price */
    TpTriggerPrice?: number;
    /** Take-profit order price (places order at this price when triggered) */
    TpOrderPrice?:   number;
    /** Stop-loss trigger price */
    SlTriggerPrice?: number;
    /** Stop-loss order price (places order at this price when triggered) */
    SlOrderPrice?:   number;
}

/**
 * HttpQuery request options
 *
 * ```js

* var ret = HttpQuery("https://api.example.com/data", {
*     method: "POST",
*     body: JSON.stringify({key: "value"}),
*     headers: {"Content-Type": "application/json"},
*     timeout: 5000,
*     debug: true   // Return full response (including status code and headers)
* });
* ```
*/
declare interface IHttpOptions {
    /** HTTP method: "GET", "POST", "PUT", "DELETE", etc. Default is "GET" */
    method?: string;
    /** Request body (used for POST and other methods), can be a string or binary data */
    body?: string | ArrayBuffer;
    /** Proxy address, e.g., "socks5://127.0.0.1:1080" */
    proxy?: string;
    /** Response character encoding conversion (e.g., "gbk"), used for handling non-UTF-8 encoded responses */
    charset?: string;
    /** Cookie string */
    cookie?: string;
    /** TLS fingerprint configuration */
    profile?: string;
    /** When set to true, returns full response object (including status code and headers); when false, returns only the body string */
    debug?: boolean;
    /** Output format for response body: "base64" or "hex"; if not set, returns a string */
    format?: "base64" | "hex";
    /** Whether to close the connection after the request (disable keep-alive) */
    close?: boolean;
    /** Custom request headers */
    headers?: { [key: string]: any };
    /** Request timeout in milliseconds, default is 300000 (5 minutes) */
    timeout?: number;
}

/**
 * Full response structure returned by HttpQuery in debug mode
 */
declare interface IHttpRet {
    /** HTTP status code, such as 200, 404, 500; 0 when no response was received (connection refused, DNS, timeout, proxy failure) */
    StatusCode: number;
    /** Request trace information (available in debug mode) */
    Trace?: any;
    /** Response headers dictionary, each key corresponds to an array of strings (duplicate header names may have multiple values) */
    Header: { [key: string]: string[] };
    /** Cookies (available in debug mode) */
    Cookies?: any[];
    /** Body length */
    Length?: number;
    /** Response body content, can be a string or binary data, empty string when the request fails */
    Body: string | ArrayBuffer;
    /** Why the request failed (method + URL + underlying error); present only when StatusCode is 0 */
    Error?: string;
}

// ==================== Global Variables ====================

/** TA-Lib technical analysis library global instance, containing 100+ technical indicator functions */
declare const talib: Italib;

/** FMZ built-in technical analysis library, containing simplified versions of common indicators (KDJ, BOLL, MACD, etc.) */
declare const TA: ITA;

/** Multi-threading management object for creating and managing worker threads */
declare const threading: IThreading;

/** First (default) exchange object, equivalent to exchanges[0] */
declare const exchange: IExchange;

/** Array of all added exchange objects, access the i-th exchange via exchanges[i] */
declare const exchanges: IExchange[];


// ==================== Global Functions ====================

/**
 * Get the docker version number
 * @returns Version number string
 * ```js
 * Log("Version:", Version());  // "3.7"
 * ```
 */
declare function Version(): string;

/**
 * Pause strategy execution for the specified number of milliseconds. Pending events in the event loop are processed during the pause.
 * It is recommended to add Sleep in the main strategy loop to avoid overly frequent API requests.
 * @param millisecond - Number of milliseconds to pause
 * ```js
 * while (true) {
 *     var ticker = exchange.GetTicker();
 *     Log(ticker.Last);
 *     Sleep(1000);  // Execute once per second
 * }
 * ```
 */
declare function Sleep(millisecond: number): void;

/**
 * Asynchronous sleep: returns a Promise that resolves after the given milliseconds, for
 * `await sleepAsync(1000)` inside an async strategy. Unlike Sleep it does not block the
 * event loop: timers and other Promises keep running meanwhile. The argument must be a number.
 * ```js
 * async function main() {
 *     while (true) {
 *         Log(exchange.GetTicker().Last);
 *         await sleepAsync(1000);
 *     }
 * }
 * ```
 * @param millisecond - milliseconds
 */
declare function sleepAsync(millisecond: number): Promise<void>;

/**
 * Determine whether currently running in a backtest (simulation) environment
 * @returns Returns true in backtest environment, false in live trading environment
 * ```js
 * if (IsVirtual()) {
 *     Log("Currently in backtest mode");
 * } else {
 *     Log("Currently in live trading mode");
 * }
 * ```
 */
declare function IsVirtual(): boolean;

/**
 * Send email notification via SMTP
 * @param smtpServer - SMTP server address, e.g., "smtp.qq.com:465"
 * @param smtpUsername - SMTP login username (usually email address)
 * @param smtpPassword - SMTP login password or authorization code
 * @param mailTo - Recipient email address
 * @param title - Email subject
 * @param body - Email body
 * @returns Returns true on success, false on failure
 * ```js
 * Mail("smtp.qq.com:465", "sender@qq.com", "auth_code", "receiver@gmail.com", "Strategy Alert", "BTC price broke above 50000");
 * ```
 */
declare function Mail(smtpServer: string, smtpUsername: string, smtpPassword: string, mailTo: string, title: string, body: string): boolean;

/**
 * Asynchronous version of the Mail function, returns a concurrent object immediately without blocking the current thread
 * @param smtpServer - SMTP server address, e.g. "smtp.qq.com:465"
 * @param smtpUsername - SMTP login username (usually the email address)
 * @param smtpPassword - SMTP login password or authorization code
 * @param mailTo - Recipient email address
 * @param title - Email title
 * @param body - Email body
 * @returns Concurrent object; call its wait() method to get the send result (true on success, false on failure)
 * ```js
 * var r = Mail_Go("smtp.qq.com:465", "sender@qq.com", "auth_code", "receiver@gmail.com", "Title", "Body");
 * // ... do other work ...
 * var ok = r.wait();  // get the send result
 * ```
 */
declare function Mail_Go(smtpServer: string, smtpUsername: string, smtpPassword: string, mailTo: string, title: string, body: string): IGo;

/**
 * Set error message filter regular expression, matched error messages will not be logged
 * Commonly used to filter frequent irrelevant errors. Can be called multiple times to add multiple filter rules.
 * @param filters - Regular expression string. Pass empty string "" to clear all filter rules
 * ```js
 * SetErrorFilter("timeout|503|rate limit");  // Filter timeout and rate limit errors
 * SetErrorFilter("");  // Clear all filter rules
 * ```
 */
declare function SetErrorFilter(filters: string): void;

/**
 * Get the PID of the current docker process
 * @returns Process ID number
 * ```js
 * Log("Process PID:", GetPid());
 * ```
 */
declare function GetPid(): number;

/**
 * Get the most recent error message and clear it. After calling, the error message is consumed and subsequent calls return null
 * @returns Most recent error message string, returns null when there is no error
 * ```js
 * exchange.GetTicker();
 * var err = GetLastError();
 * if (err) Log("Error occurred:", err);
 * ```
 */
declare function GetLastError(): string | null;

/**
 * Get strategy interaction command. Used to read interaction commands sent by users on the FMZ platform strategy page.
 * @returns Command string (format: "button_name:parameter"), returns null when there is no command
 * ```js
 * var cmd = GetCommand();
 * if (cmd) {
 *     Log("Received command:", cmd);
 *     var [name, value] = cmd.split(":");
 *     if (name === "buy") exchange.Buy(-1, parseFloat(value));
 * }
 * ```
 */
declare function GetCommand(): string | null;

/**
 * Get strategy metadata (additional data set when creating the robot)
 * @returns Metadata string, returns null when there is no data
 */
declare function GetMeta(): string | null;

/**
 * Create network connection (TCP/WebSocket/database, etc.) for communication with external services
 * @param address - Connection address, supports multiple protocols:
 *   - WebSocket: "wss://stream.binance.com:9443/ws/btcusdt@ticker"
 *   - TCP: "tcp://host:port"
 *   - SQLite: "sqlite3:///path/to/db.sqlite3"
 *   - MySQL: "mysql://user:pass@host:port/dbname"
 *   - PostgreSQL: "postgres://user:pass@host:port/dbname?sslmode=disable"
 *   - ClickHouse: "clickhouse://user:pass@host:9000/db" (native TCP protocol, as the old
 *     runtime; 9440 or ?secure=true for TLS, ?insecure=true skips certificate checks);
 *     "clickhouse+http://host:8123/db" / "clickhouse+https://host:8443/db" use the HTTP interface
 *
 *   Options can be appended after `|` (keys there override the second argument), e.g.:
 *   "wss://....|compress=gzip_raw&mode=recv"
 * @param timeoutMs - connect timeout in ms (default 30000); or an options object (or its JSON string):
 *   headers request headers; reconnect auto reconnect; retry max attempts (0 = unlimited);
 *   interval retry interval in ms (default 1000); payload data sent after every successful connect;
 *   compress auto-inflate incoming binary frames (gzip / gzip_raw / flate / zlib / deflate; mode must be recv);
 *   pingInterval heartbeat interval in ms, pingMessage heartbeat body, pingType control (protocol Ping frame, default) or text (text frame);
 *   insecureSkipVerify skip TLS verification (default true); proxy proxy address; local_ip local egress IP.
 * @returns IDial connection object, returns null on connection failure
 * ```js
 * // WebSocket real-time market data
 * var ws = Dial("wss://stream.binance.com:9443/ws/btcusdt@ticker");
 * if (ws) {
 *     while (true) {
 *         var msg = ws.read(5000);
 *         if (msg) Log(JSON.parse(msg));
 *     }
 *     ws.close();
 * }
 * // The native runtime reconnects in place; ws.fd() remains unchanged
 * var ws = Dial("wss://example.com/ws", {reconnect: true, retry: 0, interval: 1000});
 * // SQLite database
 * var db = Dial("sqlite3:///strategy.db");
 * db.exec("CREATE TABLE IF NOT EXISTS logs(time TEXT, msg TEXT)");
 * ```
 */
declare function Dial(address: string|number, timeoutMs?: number | { [key: string]: any }): IDial | null;

/**
 * Send HTTP request (simple usage)
 * @param url - Request URL
 * @param postData - POST data (automatically becomes POST request when passing non-empty string)
 * @param cookies - Cookie string
 * @param headers - Request headers, supports string (newline-separated) or object
 * @returns Response body string, returns null on failure
 * ```js
 * var data = HttpQuery("https://api.example.com/ticker");
 * Log(JSON.parse(data));
 * ```
 */
declare function HttpQuery(url: string, postData?: string | ArrayBuffer, cookies?: string, headers?: string | { [key: string]: string }): string | null;
/**
 * Send HTTP request (debug mode, returns complete response information)
 * @param url - Request URL
 * @param options - Request options, set debug: true to return complete response
 * @returns Complete object containing status code, response headers, and response body
 * ```js
 * var ret = HttpQuery("https://api.example.com/data", {
 *     method: "POST",
 *     body: JSON.stringify({key: "value"}),
 *     headers: {"Content-Type": "application/json"},
 *     debug: true
 * });
 * if (ret) Log("Status:", ret.StatusCode, "Content:", ret.Body);
 * ```
 */
declare function HttpQuery(url: string, options: { debug: true } & IHttpOptions): IHttpRet | null;
/**
 * Send HTTP request (with options, returns only body string)
 * @param url - Request URL
 * @param options - Request options
 * @returns Response body string, returns null on failure
 */
declare function HttpQuery(url: string, options?: { debug?: false } & IHttpOptions): string | null;
/**
 * Send HTTP request (generic overload)
 */
declare function HttpQuery(url: string, options: { debug?: boolean } & IHttpOptions): string | IHttpRet | null;

/**
 * Asynchronous version of the HttpQuery function, returns a concurrent object immediately without blocking the current thread
 * @param url - Request URL
 * @param options - Request options (same as HttpQuery), the legacy postData string form is also supported
 * @param cookies - Cookie string (legacy call form)
 * @param headers - Request headers (legacy call form)
 * @returns Concurrent object; call its wait() method to get the HTTP request result
 * ```js
 * // Request two endpoints concurrently
 * var r1 = HttpQuery_Go("https://api.example.com/tickerA");
 * var r2 = HttpQuery_Go("https://api.example.com/tickerB");
 * var tickerA = JSON.parse(r1.wait());
 * var tickerB = JSON.parse(r2.wait());
 * ```
 */
declare function HttpQuery_Go(url: string, options?: string | ArrayBuffer | IHttpOptions, cookies?: string, headers?: string | { [key: string]: string }): IGo;


/**
 * Generic encoding/encryption/signing function
 * @param algo - Algorithm name:
 *   - Hash: "md5", "sha256", "sha512", "sha1", "keccak256", "sha3.224/256/384/512"
 *   - HMAC: "hmac_md5", "hmac_sha256", "hmac_sha512", "hmac_sha1"
 *   - Encryption: "aes128-cbc", "aes256-cbc", "aes192-cbc"
 *   - Signature: "ed25519", "ed25519.seed"
 *   - Encoding: "raw", "text.encoder", "text.decoder"
 * @param inputFormat - Input data format: "hex", "base64", "raw"(binary), "string"(UTF-8 string)
 * @param outputFormat - Output data format: "hex", "base64", "raw"(binary), "string"(UTF-8 string)
 * @param data - Input data
 * @param keyFormat - Key format (required for encryption algorithms): "hex", "base64", "raw", "string"
 * @param key - Key (required for encryption algorithms)
 * @returns Encoded result
 * ```js
 * // HMAC-SHA256 signature
 * var sign = Encode("hmac_sha256", "string", "hex", "message", "string", "secret");
 * // SHA256 hash
 * var hash = Encode("sha256", "string", "hex", "hello");
 * // AES encryption
 * var encrypted = Encode("aes256-cbc", "string", "base64", "data", "string", "key");
 * ```
 */
declare function Encode(algo: string, inputFormat: "hex" | "base64" | "raw" | "string", outputFormat: "hex" | "base64" | "raw" | "string", data: string | ArrayBuffer, keyFormat?: string, key?: string): string | ArrayBuffer;

/**
 * Get current time as nanosecond-precision timestamp
 * @returns Nanosecond timestamp (e.g., 1609459200000000000)
 * ```js
 * var start = UnixNano();
 * // ... perform operations ...
 * var elapsed = (UnixNano() - start) / 1e6;  // Convert to milliseconds
 * Log("Elapsed time:", elapsed, "ms");
 * ```
 */
declare function UnixNano(): number;

/**
 * Get current time as second-precision timestamp
 * @returns Second-precision timestamp (e.g., 1609459200)
 * ```js
 * Log("Current timestamp:", Unix());
 * ```
 */
declare function Unix(): number;

/**
 * Get operating system and architecture information where the docker is running
 * @returns String in format "os/arch", e.g., "linux/amd64", "darwin/arm64", "windows/amd64"
 * ```js
 * Log("System:", GetOS());  // "linux/amd64"
 * ```
 */
declare function GetOS(): string;

/**
 * Get system information
 * @param attr - Information type:
 *   - "pid": Process ID
 *   - "ppid": Parent process ID
 *   - "uid": User ID
 *   - "gid": Group ID
 *   - "ncpu": Number of CPU cores
 *   - "arch": CPU architecture (e.g., "amd64")
 *   - "os": Operating system (e.g., "linux")
 *   - "version": Go runtime version
 *   - "sys_cpu": System CPU usage (%)
 *   - "sys_mem": System memory information
 *   - "cpu": Current process CPU usage
 *   - "mem": Current process memory usage
 *   - "threads": Current process thread count
 *   - "go.NumGoroutine": Number of Go goroutines
 *   - "go.MemStats": Go memory statistics
 * @returns Corresponding system information value
 * ```js
 * Log("CPU cores:", SysInfo("ncpu"));
 * Log("System memory:", SysInfo("sys_mem"));
 * ```
 */
declare function SysInfo(attr: string): any;

/**
 * Calculate MD5 hash value of a string
 * @param data - String to hash
 * @returns 32-character hexadecimal MD5 hash string (lowercase)
 * ```js
 * Log(MD5("hello"));  // "5d41402abc4b2a76b9719d911017c592"
 * ```
 */
declare function MD5(data: string): string;

/**
 * Execute SQL statement to operate the strategy's built-in SQLite database
 * Each robot has an independent SQLite database with persistent data storage.
 * When SQL statement starts with ":", it uses in-memory database (data lost after restart).
 * @param sql - SQL statement, supports parameterized queries (use ? as placeholder)
 * @param extra - Binding values for SQL parameterized queries
 * @returns Query result object (containing columns and values), returns null on failure
 * ```js
 * // Create table
 * DBExec("CREATE TABLE IF NOT EXISTS trades(id INTEGER PRIMARY KEY, price REAL, amount REAL, time TEXT)");
 * // Insert data
 * DBExec("INSERT INTO trades(price, amount, time) VALUES(?, ?, ?)", 50000, 0.1, _D());
 * // Query data
 * var ret = DBExec("SELECT * FROM trades ORDER BY id DESC LIMIT 10");
 * if (ret) {
 *     Log("Columns:", ret.columns);  // ["id", "price", "amount", "time"]
 *     Log("Data:", ret.values);   // [[1, 50000, 0.1, "2024-01-01 00:00:00"], ...]
 * }
 * // Use in-memory database
 * DBExec(":CREATE TABLE cache(k TEXT, v TEXT)");
 * ```
 */
declare function DBExec(sql: string, ...extra: any[]): IDBExecRet | null;

/**
 * Generate UUID string (includes time component)
 * @returns UUID string
 * ```js
 * Log(UUID());  // "550e8400-e29b-41d4-a716-446655440000"
 * ```
 */
declare function UUID(): string;

/**
 * Wait for the next compatibility event from Rust's unified ctx.poll: a legacy tick/order event, thread message,
 * exchange.Go/HttpQuery_Go/Mail_Go completion, or legacy Dial WebSocket readability.
 * Native WebSocket, Promise, and timer callbacks are pumped while waiting but do not produce
 * an additional EventLoop message. Expanded ctx.poll engine events (depth/trade/kline/timer/status)
 * are drained but hidden so they cannot alter legacy strategy branches. EventLoop and direct ctx.poll
 * calls consume the same underlying source queues. EventLoop restores the legacy envelope and known
 * order metadata, so a strategy should choose one consumer.
 * The first call lazily subscribes each account to its current symbol's ticker and order events;
 * SetCurrency/SetContractType switch the ticker subscription as well.
 * @param timeoutMs - Timeout duration (milliseconds):
 *   - Not passed or 0: Block waiting until there is an event
 *   - Positive number: Wait for specified milliseconds, return null on timeout
 *   - Negative number (-1): Non-blocking, return null immediately if no event
 * @returns Event message object, returns null on timeout or no event
 * ```js
 * // Event-driven loop
 * while (true) {
 *     var ev = EventLoop(1000);
 *     if (ev) {
 *         Log("Event:", ev.Event, "Exchange:", ev.Index, "Symbol:", ev.Symbol);
 *     }
 * }
 * ```
 */
declare function EventLoop(timeoutMs?: number): IEventMsg | null;

/**
 * Translation function for strategy internationalization
 * @param a - String to translate
 * @param b - Translated string (optional)
 * @returns Translated string
 */
declare function _T(a: string, b?: string): string;

/**
 * Global persistent KV storage, data is saved in the strategy database and persists after restart
 * @param k - Key name
 * @param v - Value (optional):
 *   - Not passed: Read the value corresponding to the key
 *   - Pass null: Delete the key
 *   - Pass other value: Save key-value pair
 * @returns When reading, returns the corresponding value; when writing, no meaningful return value. Calling without parameters returns the robot ID
 * ```js
 * _G("lastPrice", 50000);          // Save
 * var price = _G("lastPrice");     // Read -> 50000
 * _G("lastPrice", null);           // Delete
 * _G(null);                        // Clear all KV data
 * _G();                            // Get robot ID
 * ```
 */
declare function _G(k?: string, v?: any): any;

/**
 * Format timestamp to readable date string (local time zone)
 * @param timestamp - Timestamp (milliseconds) or Date object. Uses current time if not passed
 * @param fmt - Date format string, default "yyyy-MM-dd hh:mm:ss". Tokens yyyy, yy, MM, dd, hh (24-hour),
 *   mm, ss, plus HH (same as hh) and SSS (milliseconds); each token is replaced at its first
 *   occurrence only and every other character is kept, e.g. the T, .999 and Z in
 *   "yyyy-MM-ddThh:mm:ss.999Z" are copied verbatim
 * @returns Formatted date string
 * ```js
 * Log(_D());                    // "2024-01-15 10:30:45"
 * Log(_D(1705284645000));       // "2024-01-15 10:30:45"
 * Log(_D(new Date()));          // "2024-01-15 10:30:45"
 * Log(_D(ts, "yyyy-MM-ddThh:mm:ss.SSSZ"));  // "2024-01-15T10:30:45.123Z" (local time)
 * ```
 */
declare function _D(timestamp?: number | Date, fmt?: string): string;

/**
 * Number precision truncation (truncate down to specified decimal places, no rounding)
 * @param num - Number to truncate
 * @param precision - Number of decimal places to keep
 * @returns Truncated number
 * ```js
 * Log(_N(3.14159, 2));  // 3.14
 * Log(_N(3.14959, 2));  // 3.14 (no rounding, direct truncation)
 * ```
 */
declare function _N(num: number, precision: number): number;

/**
 * Fault-tolerant retry function, automatically retries function call until it returns a non-null value
 * Commonly used to wrap API calls that may return null due to network issues
 * @param pfn - Function to retry calling
 * @param args - Arguments to pass to the function
 * @returns Non-null value successfully returned by the function
 * ```js
 * // Ensure getting Ticker (internally retries continuously until success)
 * var ticker = _C(exchange.GetTicker);
 * // Retry call with parameters
 * var depth = _C(exchange.GetDepth, "BTC_USDT");
 * var account = _C(exchange.GetAccount);
 * ```
 */
declare function _C<T extends (...args: any[]) => any>( pfn: T, ...args: Parameters<T>): NonNullable<ReturnType<T>>;

/**
 * Set the retry interval of the _C() function (default 3000 milliseconds)
 * @param ms - Retry interval (milliseconds), must be greater than 0
 * ```js
 * _CDelay(1000);  // change the _C() retry interval to 1 second
 * var ticker = _C(exchange.GetTicker);
 * ```
 */
declare function _CDelay(ms: number): void;

/**
 * Determine whether two lines cross (golden cross/death cross)
 * @param arr1 - Data array of the first line
 * @param arr2 - Data array of the second line
 * @returns Positive number indicates golden cross (arr1 crosses above arr2), negative number indicates death cross (arr1 crosses below arr2), 0 indicates no cross
 * ```js
 * var ema5 = talib.EMA(records, 5);
 * var ema20 = talib.EMA(records, 20);
 * var cross = _Cross(ema5, ema20);
 * if (cross > 0) Log("Golden cross! 5-day EMA crossed above 20-day EMA");
 * if (cross < 0) Log("Death cross! 5-day EMA crossed below 20-day EMA");
 * ```
 */
declare function _Cross(arr1: number[], arr2: number[]): boolean;

/**
 * Safe JSON parsing, throws exception on parsing failure (instead of returning undefined)
 * @param s - JSON string to parse
 * @returns Parsed object
 * ```js
 * var obj = JSONParse('{"price": 50000, "amount": 0.1}');
 * Log(obj.price);  // 50000
 * ```
 */
declare function JSONParse(s: string): object;

/**
 * FMZ extension: the second parameter of JSON.parse supports a boolean safeStr
 * When safeStr is true, parsing runs in safe mode and large numbers are automatically converted to strings to avoid precision loss
 *
 * ```js
 * var obj = JSON.parse('{"num": 8754613197327563525}', true);
 * Log(obj.num);  // "8754613197327563525" (string, no precision loss)
 * ```
 */
interface JSON {
    parse(text: string, safeStr?: boolean | ((this: any, key: string, value: any) => any)): any;
}

/**
 * Overload: parseInt also accepts a number argument (the JS runtime converts automatically), e.g. parseInt(Date.now() / 1000)
 */
declare function parseInt(value: string | number, radix?: number): number;

// ==================== Logging Functions ====================

/**
 * Output log to the strategy log area
 * Supports special suffix to control log color: s + "#FF0000" displays in red
 * @param s - Log content, supports any type
 * @param extra - Additional log parameters, will be appended
 * ```js
 * Log("Normal log");
 * Log("Red log #FF0000");       // Display in red
 * Log("Price:", ticker.Last, "Amount:", 0.1);
 * Log(exchange.GetAccount());      // Output object directly
 * ```
 */
declare function Log(s: any, ...extra: any[]): void;

/**
 * Record profit data and draw profit curve
 * @param profit - Profit value
 * @param extra - Additional log information
 * ```js
 * LogProfit(100.5);                   // Record profit of 100.5
 * LogProfit(100.5, "Profit from this trade");    // With note
 * ```
 */
declare function LogProfit(profit: number, ...extra: any[]): void;

/**
 * Reset profit log
 * @param remain - Number of recent records to retain, default 0 (clear all)
 * ```js
 * LogProfitReset();    // Clear all profit records
 * LogProfitReset(10);  // Retain last 10 records
 * ```
 */
declare function LogProfitReset(remain?: number): void;

/**
 * Set strategy status bar information (displayed at the top of the bot page)
 * Supports Markdown tables, HTML and other formats
 * @param s - Status information string
 * ```js
 * LogStatus("Current price: " + ticker.Last + " | Position: " + position.Amount);
 * // Markdown table
 * LogStatus("`" + JSON.stringify({type:"table", title:"Position", cols:["Coin","Amount"], rows:[["BTC","0.1"]]}) + "`");
 * ```
 */
declare function LogStatus(s: any, ...extra: any[]): void;

/**
 * Enable or disable log recording
 * @param enable - true to enable, false to disable log recording
 * ```js
 * EnableLog(false);  // Disable logging (reduce database writes)
 * EnableLog(true);   // Re-enable
 * ```
 */
declare function EnableLog(enable: boolean): void;

/**
 * Create custom chart (based on Highcharts/Highstock), used to draw charts on the strategy page
 *
 * Preferred for charting: supports the full range of chart types (line, column, scatter,
 * area, candlestick, ...). Use Chart by default; only use KLineChart when you specifically
 * need a Pine-style candlestick/K-line chart.
 * @param options - Highcharts/Highstock chart configuration object, or configuration array (multiple charts)
 * @returns IChart chart object, used to dynamically add data
 * ```js
 * var chart = Chart({
 *     title: { text: "Price Trend" },
 *     xAxis: { type: "datetime" },
 *     series: [
 *         { name: "Price", type: "line", data: [] },
 *         { name: "MA5", type: "line", data: [] }
 *     ]
 * });
 * // Dynamically add data
 * chart.add(0, [Date.now(), ticker.Last]);   // Add price point
 * chart.add(1, [Date.now(), ma5Value]);      // Add MA5 point
 * chart.reset();                              // Clear chart
 * ```
 */
declare function Chart(options: object | Array<object>): IChart;

/**
 * Create a K-line chart control object providing Pine Script style drawing methods (plot/hline/plotshape/signal etc.)
 *
 * Specialized for K-line (candlestick) charts only — prefer Chart for general charting
 * (it covers every chart type).
 * @param options - K-line chart configuration object supporting { overlay, pricePrecision, volumePrecision } etc., may be omitted
 * @returns IKLineChart chart control object; when drawing, start each bar with begin(bar) and end with close()
 * ```js
 * var c = KLineChart({
 *     overlay: true  // Display overlay on the main chart
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
 * Reset all logs
 * @param remain - Number of recent logs to retain, default 0 (clear all)
 * ```js
 * LogReset();     // Clear all logs
 * LogReset(100);  // Retain last 100 logs
 * ```
 */
declare function LogReset(remain?: number): void;

/**
 * Execute VACUUM operation on the strategy database, reclaim database space
 * Call after deleting large amounts of logs to reduce database file size
 */
declare function LogVacuum(): void;

// ==================== Multi-threading Interfaces ====================

/**
 * Thread execution result structure, returned by thread.join()
 */
declare interface IThreadRet {
    /** Thread ID */
    id: number;
    /** Whether the thread was forcibly terminated (true=terminated by terminate(), false=normal exit) */
    terminated: boolean;
    /** Thread execution time (nanoseconds) */
    elapsed: number;
    /** Return value of the thread function */
    ret: any;
}

/**
 * Thread object, created by threading.Thread()
 * Each thread runs in a separate JS context and communicates via message passing
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
 * Log("Received:", msg);
 * t.terminate();
 * ```
 */
declare interface IThread {
    /**
     * Receive a message from the thread
     * @param timeoutMs - Timeout in milliseconds:
     *   - Not passed or 0: Block and wait
     *   - Positive number: Wait for specified milliseconds
     *   - Negative number (-1): Non-blocking, returns undefined immediately if no message
     * @returns Message sent by the thread, undefined on timeout, null if thread is closed
     */
    peekMessage(timeoutMs?: number): any | null;

    /**
     * Send a message to the thread
     * @param msg - Message to send (will be serialized, not shared by reference)
     */
    postMessage(msg: any): void;

    /**
     * Wait for the thread to complete and get the result
     * @param timeoutMs - Timeout in milliseconds, blocks if not passed
     * @returns Thread execution result object, null on timeout
     * ```js
     * var t = threading.Thread(function() { return 42; });
     * var result = t.join();
     * Log("Result:", result.ret);  // 42
     * Log("Elapsed:", result.elapsed / 1e6, "ms");
     * ```
     */
    join(timeoutMs?: number): IThreadRet | null;

    /**
     * Forcibly terminate the thread
     */
    terminate(): void;

    /**
     * Get thread-local storage data (readable across threads)
     * @param key - Data key name
     * @returns Corresponding value
     */
    getData(key: string): any;

    /**
     * Set thread-local storage data (readable across threads)
     * @param key - Data key name
     * @param value - Data value (will be serialized)
     */
    setData(key: string, value: any): void;

    /**
     * Wait for events within the thread
     * @param timeoutMs - Timeout in milliseconds
     * @returns Event message, null on timeout
     */
    eventLoop(timeoutMs?: number): IEventMsg | null;

    /**
     * Get thread ID
     * @returns Thread ID number
     */
    id(): number;

    /**
     * Get thread name
     * @returns Thread name, e.g. "Thread-1"
     */
    name(): string;
}

/**
 * Thread mutex lock, used to protect concurrent access to shared resources
 *
 * ```js
 * var lock = threading.Lock();
 * // Use in multiple threads
 * lock.acquire();
 * try {
 *     // Access shared resources
 * } finally {
 *     lock.release();
 * }
 * ```
 */
declare interface IThreadLock {
    /** Acquire the lock (blocks until lock is obtained) */
    acquire(): void;
    /** Release the lock */
    release(): void;
}

/**
 * Thread event, used for signal notification between threads
 *
 * ```js
 * var event = threading.Event();
 * // Wait in thread A
 * event.wait(5000);  // Wait for up to 5 seconds
 * // Trigger in thread B
 * event.set();
 * ```
 */
declare interface IThreadEvent {
    /** Set the event (trigger waiting threads) */
    set(): void;
    /** Clear the event state */
    clear(): void;
    /**
     * Wait for the event to be set
     * @param timeoutMs - Timeout in milliseconds
     * @returns true=event is set, false=timeout
     */
    wait(timeoutMs?: number): boolean;
    /** Check if the event is set */
    isSet(): boolean;
}

/**
 * Thread condition variable, combined with locks for complex thread synchronization
 *
 * ```js
 * var cond = threading.Condition();
 * // Waiting side
 * cond.acquire();
 * cond.wait();      // Release lock and wait for notification
 * cond.release();
 * // Notifying side
 * cond.acquire();
 * cond.notify();    // Wake up one waiting thread
 * cond.release();
 * ```
 */
declare interface IThreadCondition {
    /** Wake up one waiting thread */
    notify(): void;
    /** Wake up all waiting threads */
    notifyAll(): void;
    /** Release lock and wait for notification (reacquires lock when awakened) */
    wait(): void;
    /** Acquire the associated lock */
    acquire(): void;
    /** Release the associated lock */
    release(): void;
}

/**
 * Thread-safe shared dictionary, used for sharing data between multiple threads
 *
 * ```js
 * var dict = threading.Dict();
 * dict.set("price", 50000);
 * // In another thread
 * var price = dict.get("price");  // 50000
 * ```
 */
declare interface IThreadDict {
    /**
     * Get the value for the specified key
     * @param key - Key name
     * @returns Corresponding value
     */
    get(key: string): any;
    /**
     * Set a key-value pair
     * @param key - Key name
     * @param value - Value
     */
    set(key: string, value: any): void;
}

/**
 * Multi-threading management interface, used for creating and managing worker threads
 * Accessed via the global variable `threading`
 *
 * ```js
 * // Create threads to execute functions
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
     * Create a new worker thread (passing in function and arguments)
     * Function and arguments are serialized and executed in a new JS context, variables are not shared
     * @param f - Function to execute in the thread
     * @param args - Arguments to pass to the function
     * @returns Thread object
     * ```js
     * var t = threading.Thread(function(a, b) {
     *     return a + b;
     * }, 1, 2);
     * Log(t.join().ret);  // 3
     * ```
     */
    Thread(f: Function, ...args: any[]): IThread;

    /**
     * Create a new worker thread (passing in command array format)
     * Each array item is in the format [function, arg1, arg2, ...]
     * @param item - First command array
     * @param items - Additional command arrays
     * @returns Thread object
     */
    Thread(item: Array<any>, ...items: Array<any>[]): IThread;

    /**
     * Get thread object by thread ID
     * @param num - Thread ID
     * @returns Thread object
     */
    getThread(num: number): IThread;

    /**
     * Get the main thread object
     * @returns Main thread
     */
    mainThread(): IThread;

    /**
     * Get the current thread object (called within worker thread)
     * @returns Current thread
     */
    currentThread(): IThread;

    /**
     * Create a mutex lock
     * @returns Lock object
     */
    Lock(): IThreadLock;

    /**
     * Create a condition variable
     * @returns Condition variable object
     */
    Condition(): IThreadCondition;

    /**
     * Create an event
     * @returns Event object
     */
    Event(): IThreadEvent;

    /**
     * Create a thread-safe shared dictionary
     * @returns Dictionary object
     */
    Dict(): IThreadDict;

    /**
     * Get the number of currently active threads
     * @returns Active thread count
     */
    pending(): number;
}

// ==================== Legacy Thread API (Deprecated, use threading module instead) ====================

/**
 * @deprecated Deprecated, please use `threading.Thread` instead
 * Create a worker thread
 * @param f - Thread function
 * @param args - Function arguments
 * @returns Thread ID
 */
declare function __Thread(f: Function, ...args: any[]): number;

/**
 * @deprecated Deprecated, please use `threading.Thread` instead
 * Create a worker thread (array command form)
 */
declare function __Thread(item: Array<any>, ...items: Array<any>[]): number;

/**
 * @deprecated Deprecated, please use `thread.peekMessage` instead
 * Receive message from current thread
 */
declare function __threadPeekMessage(timeoutMs?: number): any | null;

/**
 * @deprecated Deprecated, please use `thread.postMessage` instead
 * Send message to specified thread
 */
declare function __threadPostMessage(threadId: number, msg: any): void;

/**
 * @deprecated Deprecated, please use `thread.join` instead
 * Wait for thread to complete and get result
 */
declare function __threadJoin(threadId: number, timeoutMs?: number): IThreadRet | null;

/**
 * @deprecated Deprecated, please use `thread.terminate` instead
 * Force terminate thread
 */
declare function __threadTerminate(threadId: number): void;

/**
 * @deprecated Deprecated, please use `thread.getData` instead
 * Get thread data
 */
declare function __threadGetData(threadId: number, key: string): any;

/**
 * @deprecated Deprecated, please use `thread.setData` instead
 * Set thread data
 */
declare function __threadSetData(threadId: number, key: string, value: any): void;

/**
 * @deprecated Deprecated, please use `threading.currentThread().id()` instead
 * Get current thread ID
 */
declare function __threadId(): number;

/**
 * @deprecated Deprecated, please use `threading.pending()` instead
 * Get active thread count
 */
declare function __threadPending(running?:boolean): number;


/**
 * HTTP/TCP server request context, provides request information and response methods
 * Used in __Serve handler functions
 *
 * ```js
 * __Serve("http://0.0.0.0:8080", function(ctx) {
 *     if (ctx.method() === "POST") {
 *         var body = ctx.body();
 *         Log("Received POST:", body);
 *     }
 *     ctx.setHeader("Content-Type", "application/json");
 *     ctx.write(JSON.stringify({status: "ok"}));
 * });
 * ```
 */
interface IServeContext {
    /** Get client remote address, e.g. "192.168.1.100:54321" */
    remoteAddr: () => string;
    /** Get server local listening address */
    localAddr: () => string;
    /**
     * Read data (used in WebSocket mode)
     * @param timeoutMs - Timeout in milliseconds
     * @returns Received data, returns null on timeout
     */
    read: (timeoutMs?: number) => string | null;
    /** Get HTTP request body content */
    body: () => string | null;
    /** Write response data to client */
    write: (data: string) => void;
    /** Get request path, e.g. "/api/data" */
    path: () => string;
    /** Get HTTP request method, e.g. "GET", "POST" */
    method: () => string;
    /** Get all request headers (key-value pairs) */
    headers: () => Record<string, string>;
    /**
     * Get value of specified request header
     * @param name - Request header name
     * @returns Header value, returns undefined if not exists
     */
    header: (name: string) => string | undefined;
    /**
     * Set HTTP response status code

     * @param status - HTTP status code, such as 200, 404, 500
     */
    setStatus: (status: number) => void;
    /**
     * Set HTTP response header
     * @param key - Response header name
     * @param value - Response header value
     */
    setHeader: (key: string, value: string) => void;
    /** Get URL query string (without ? symbol), such as "page=1&size=10" */
    rawQuery: () => string;
    /**
     * Upgrade HTTP connection to other protocols (such as WebSocket)
     * @param protocol - Target protocol, such as "websocket"
     * @returns Returns true if upgrade is successful
     */
    upgrade: (protocol: string) => boolean;
}

/**
 * Create HTTP or TCP server, each request/connection is handled in a separate thread
 * Supports HTTP, HTTPS, TCP, WebSocket protocols.
 *
 * URL supported query parameters:
 * - gzip=true: Enable gzip compression
 * - tls=true: Enable TLS encryption
 * - cert_pem=...: TLS certificate
 * - cert_key_pem=...: TLS private key
 * - pprof=true: Enable pprof debugging endpoint
 *
 * @param uri - Listen address:
 *   - HTTP: "http://0.0.0.0:8080"
 *   - HTTPS: "http://0.0.0.0:443?tls=true"
 *   - TCP: "tcp://0.0.0.0:9090"
 * @param handler - Request handler function, called in a separate thread for each request
 * @returns Listen address string
 * ```js
 * // HTTP server
 * __Serve("http://0.0.0.0:8080", function(ctx) {
 *     ctx.setHeader("Content-Type", "text/plain");
 *     ctx.write("Hello World");
 * });
 *
 * // WebSocket server
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
     * Same implementation as __Serve (which is an alias returning only the address): start a TCP / HTTP(S) /
     * WebSocket server inside the strategy process; every connection or request runs handler(ctx, ...args) on
     * its own thread. Returns a Server object. pprof=true is ignored; tls=true requires cert_pem and cert_key_pem.
     */
    function Serve(uri: string, handler: (ctx: IServeContext, ...args: any[]) => void, ...args: any[]): IServer;
}

/** The server object returned by threading.Serve (can be passed to Threads) */
interface IServer {
    /** Actual bound address, e.g. "0.0.0.0:8080" / "127.0.0.1:53021" */
    addr(): string;
    /** Stop accepting new connections; in-flight handlers run to completion (graceful). Idempotent. */
    close(): void;
    /** close() and then terminate every in-flight handler thread (hard stop, like Thread.terminate). */
    stop(): void;
    /**
     * Wait until the listener is closed and no handler is in flight.
     * @param timeoutMs - milliseconds; omitted or 0 waits indefinitely (interrupted when the strategy stops)
     * @returns whether the server is idle
     */
    join(timeoutMs?: number): boolean;
    /** Number of connections/handlers currently in flight */
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
 * Fetch API request options (similar to the Web standard fetch API)
 */
interface FetchOptions {
  /** HTTP method: "GET", "POST", etc. */

method?: string;
  /** Request headers */
  headers?: Map<string, string>;
  /** Request body */
  body?: string | ArrayBuffer;
}

/**
 * Fetch API response object
 */
interface FetchResponse {
  /** Whether the request succeeded (status code 200-299) */
  ok: boolean;
  /** HTTP status code */
  status: number;
  /** HTTP status description text */
  statusText: string;
  /** Response headers */
  headers: Map<string, string>;
  /** Parse response body as JSON */
  json(): Promise<any>;
  /** Parse response body as text */
  text(): Promise<string>;
}

/**
 * Fetch API (Web-standard-like) for sending HTTP requests (supports async/await)
 * @param url - Request URL
 * @param init - Request options
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
 * Set channel data for cross-strategy communication between different bots/strategies
 * Publish data to the channel, which can be read by other strategies via GetChannelData
 * @param v - Data to publish
 * ```js
 * SetChannelData({price: 50000, signal: "buy"});
 * ```
 */
declare function SetChannelData(v : any): void;

/**
 * Get channel data, read data published by other strategies via SetChannelData
 * @param token - Channel token (used to identify data source)
 * @returns Data from the channel
 * ```js
 * var data = GetChannelData("#token123");
 * if (data) Log("Received signal:", data);
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
