> Part of the `fmz` skill. File paths below are relative to the skill directory (the folder that holds `SKILL.md`).

# FMZ JavaScript strategies

A strategy is a script with a `function main()` entry. The platform injects globals: `exchange` (the first configured exchange account, the same object as `exchanges[0]`), `exchanges` (all accounts, in the robot's configured order), the parameter globals, and the API below. The same code runs in backtest and live.

Every `exchange.*` call is synchronous, goes to the exchange over REST, and **returns `null` on failure** (the error text goes to the log and to `GetLastError()`). Exceptions to the null rule are marked in the tables.

```js
function main() {
  Log("start", fast, slow);                     // parameters are globals (see "Parameters")
  if (exchange.GetName().startsWith("Futures_")) exchange.SetContractType("swap");  // futures: pick the contract first
  while (true) {
    var ticker = _C(exchange.GetTicker);        // _C retries until the call returns non-null
    var records = exchange.GetRecords();        // K-lines of the robot's period, ascending, last = current bar
    if (!records || records.length < slow) { Sleep(1000); continue; }
    var ma1 = TA.MA(records, fast), ma2 = TA.MA(records, slow);
    LogStatus(_D(), "price", ticker.Last, "ma", _N(ma1[ma1.length-1], 2), "/", _N(ma2[ma2.length-1], 2));
    var cmd = GetCommand();                     // "name" or "name:value" from interactive controls / send_robot_command
    if (cmd) Log("command", cmd);
    Sleep(5000);                                // milliseconds; never busy-loop
  }
}
function onexit() { Log("exit"); }              // optional, runs when the robot stops
```

## Entry functions (user-guide "Strategy Entry Functions")

| Function | When | Notes |
|---|---|---|
| `main()` | required entry | may be `async function main()` (`ctx.d.ts`: `main(): void \| Promise<void>`); then use `await sleepAsync(ms)` instead of `Sleep` so timers and Promises keep running. When `main` returns, every child thread is terminated. |
| `init()` | optional, runs automatically before `main` | initialisation only |
| `onexit()` | optional, normal stop | max 5 minutes, otherwise an `interrupt` error. Not called if `onerror` already fired. In a backtest the end of data raises an exception inside your loop, so `onexit` only runs if `main` returns: wrap the loop in `try/catch` when `IsVirtual()` (user-guide example under `#### onexit()`). |
| `onerror(msg)` | optional, abnormal exit | JavaScript only, max 5 minutes, **not supported by the backtest system**. |

TypeScript:
- Save with `language: "typescript"` (`save_strategy`), or keep JavaScript and start the file with `// @ts-check` / press the editor's TypeScript button; the platform compiles with type checking. Nothing else differs at run time.
- For editor types use `references/fmz.d.ts`; for the native API `references/ctx.d.ts` (set `"lib": ["es2020"]` or `"types": []` so the DOM `onerror` does not clash).
- The docs state no ECMAScript level or strict mode. Official examples use `let/const`, template literals, `for..of`, destructuring, `async/await`, `Promise.all`, `BigInt`, `setTimeout/clearTimeout` and `fetch`, so modern syntax is fine. Do not `require()` anything.

## Parameters (user-guide "Strategy Parameters")

- Declared when saving: `save_strategy.args = [[name, label, description, default], ...]`. Each name becomes a **global variable** of the default's type (number, string, boolean, dropdown, encrypted string) and may be reassigned in code. Run-time values come from the robot's `args`.
- Optional parameters left empty are `""` (string) or `null` (number, dropdown, encrypted string).
- A dropdown's value is the selected index (or the data bound to the option); an array when multi-select is enabled.
- Names must be valid identifiers and not reserved words.
- A backtest can pin values in the header comment: `/*backtest ... args: [["fast",5],["slow",20]] */` (see `references/backtest.md`).

## Symbols, pairs and contracts

| Symbol | Meaning |
|---|---|
| `BTC_USDT` | spot pair, upper case, underscore between base and quote |
| `BTC_USDT.swap` / `BTC_USD.swap` | USDT-margined / coin-margined perpetual |
| `BTC_USDT.quarter`, `.next_quarter`, `.this_week`, `.next_week` | delivery contracts |
| `BTC_USDT.BTC-240108-40000-C` | option = pair + "." + the exchange's own option code (formats differ per exchange, user-guide "Options Trading") |
| `"USDT.swap"`, `"USDT.futures"`, `"USD.swap"`, `"USD.futures"`, `"USDT.option"`, `"USD.option"` | range filters accepted by `GetPositions`/`GetOrders`/`GetFundings` on futures objects |

Two ways to address an instrument:
- Per call: `GetTicker/GetDepth/GetTrades/GetRecords/GetOrders/GetHistoryOrders/GetFundings/GetPositions(symbol)` and `CreateOrder(symbol, ...)` accept a full symbol and leave the exchange object's state unchanged.
- Stateful: `exchange.SetCurrency("ETH_USDT")` (alias `exchange.IO("currency", "ETH_USDT")`) switches the pair. On a futures object `exchange.SetContractType("swap")` must be called **before any market or trade call**, and again after switching the pair (coin-margined `BTC_USD` + `"this_week"` vs USDT-margined `BTC_USDT` + `"swap"`). `GetAccount`, `Buy`, `Sell` and `SetDirection` always act on the current pair/contract.
- `SetContractType(code)` takes `"swap"`, `"quarter"`, `"next_quarter"`, `"this_week"`, `"next_week"`, an exchange contract id (e.g. `"BTC-USD-200925"`) or an option code; it returns the exchange's contract info object (e.g. `{"InstrumentID":"BTCUSD_230630", ...}`).
- Read state with `GetContractType()`, `GetCurrency()`, `GetBaseCurrency()`, `GetQuoteCurrency()`, `GetPeriod()` (seconds), `GetName()` (`"Binance"`, `"Futures_Binance"`, ...), `GetLabel()`.
- Discovery: `GetMarkets()` → `{ "BTC_USDT": IMarket, "BTC_USDT.swap": IMarket, ... } | null` with `PricePrecision`, `AmountPrecision`, `TickSize`, `AmountSize`, `MinQty`, `MaxQty`, `MinNotional`, `CtVal`/`CtValCcy` (contract value, futures). `GetTickers()` → `ITicker[] | null` for every pair (spot) or contract (futures).

## Market data and account

| Call | Returns (`null` on failure unless noted) |
|---|---|
| `exchange.GetTicker(symbol?)` | `{Symbol, Last, Buy (best bid), Sell (best ask), High, Low, Open, Volume, OpenInterest, Time (ms), Info}` |
| `exchange.GetDepth(symbol?)` | `{Asks: [{Price, Amount}] ascending, Bids: [...] descending, Time, Info}`; `Asks[0]`/`Bids[0]` are the best levels |
| `exchange.GetTrades(symbol?)` | `[{Id, Time, Price, Amount, Type}]` ascending by time |
| `exchange.GetRecords(symbol?, period?, limit?)`, also `(period)` and `(period, limit)` | `[{Time (ms, bar start), Open, High, Low, Close, Volume}]` ascending; `period` is `PERIOD_M1 … PERIOD_W1` or seconds, default = the robot's period; `exchange.SetMaxBarLen(n)` sets the cache (default 200) |
| `exchange.GetAccount()` | `{Balance, FrozenBalance, Stocks, FrozenStocks, Equity, UPnL, Info}` — quote / base of the **current pair**; futures: `Balance` = available margin |
| `exchange.GetAssets()` | `[{Currency, Amount, FrozenAmount}]`, every currency |
| `exchange.GetPositions(symbol?)` | `[{Symbol, ContractType, Type (PD_LONG 0 / PD_SHORT 1), Amount, FrozenAmount, Price, Profit, Margin, MarginLevel, Info}]`; `[]` when flat. `exchange.GetPosition()` is a documented legacy alias with identical behaviour but is **not declared in fmz.d.ts**: use `GetPositions` |
| `exchange.GetFundings(symbol?)` | `[{Symbol, Rate, Time, Interval (ms), Info}]` for perpetuals |
| `exchange.GetRawJSON()` | raw body of the last REST response (debugging) |
| `exchange.GetData(key, timeout?, offset?)` / `exchange.SetData(key, [[ts, data], ...])` | custom time series; `GetData` always returns `{Time, Data}` with `Data === null` on a miss |

Every structure keeps the exchange's raw payload in `Info`; read it only for fields the platform does not normalise.

## Orders

Placement rules (api.en.md `#### exchange.Buy`, `#### exchange.CreateOrder`):

| Case | Call | `price` | `amount` unit |
|---|---|---|---|
| Spot limit | `exchange.Buy(price, amount)` / `exchange.Sell(price, amount)` / `exchange.CreateOrder("BTC_USDT", "buy"\|"sell", price, amount)` | limit price | base currency (BTC) |
| Spot market **buy** | `exchange.Buy(-1, amount)` | `-1` | **quote currency to spend (USDT)**; AscendEx, BitMEX and Bitfinex take base coins instead |
| Spot market sell | `exchange.Sell(-1, amount)` | `-1` | base currency |
| Futures open long | `CreateOrder("BTC_USDT.swap", "buy", price, amount)` or `SetDirection("buy"); Buy(price, amount)` | limit or `-1` | **number of contracts** (`GetMarkets()[sym].CtVal` coins each) |
| Futures open short | `CreateOrder(sym, "sell", ...)` or `SetDirection("sell"); Sell(...)` | limit or `-1` | contracts |
| Futures close long | `CreateOrder(sym, "closebuy", ...)` or `SetDirection("closebuy"); Sell(...)` | limit or `-1` | contracts |
| Futures close short | `CreateOrder(sym, "closesell", ...)` or `SetDirection("closesell"); Buy(...)` | limit or `-1` | contracts |

- Prefer `CreateOrder(symbol, side, price, amount, ...logExtra)`: it needs no `SetContractType`/`SetDirection` state (fmz.d.ts marks `SetDirection` as discouraged). `side` may carry exchange options: `'buy;{"timeInForce":"GTC"}'` or `"buy;type=TRAILING_STOP_MARKET&activationPrice=2300"`.
- With `SetDirection` the pairing is fixed: `"buy"`→`Buy`, `"closesell"`→`Buy`, `"sell"`→`Sell`, `"closebuy"`→`Sell`; a mismatch is rejected (`direction is sell, invalid order type Buy`).
- Leverage: `exchange.SetMarginLevel(n)` or `SetMarginLevel("BTC_USDT.swap", n)` before opening. On some exchanges it only sets a local variable; on others it is a request that fails while positions or orders exist. Unsupported on Futures_dYdX / Futures_Deribit / Futures_edgeX.
- Return value is the order id (`string | number`) or `null`. Ids look like `"ETH-USDT,1547130415509278720"` (exchange symbol + comma + exchange order id); pass them back unchanged to `GetOrder`/`CancelOrder`.
- Precision: `exchange.SetPrecision(pricePrecision, amountPrecision)` truncates every later order; `_N(x, digits)` truncates (never rounds) one number. Take digits from `GetMarkets()` and respect `MinQty`/`MinNotional`.
- `exchange.GetOrder(id)` → `IOrder | null`: `Status` ∈ `ORDER_STATE_PENDING` (0), `ORDER_STATE_CLOSED` (1), `ORDER_STATE_CANCELED` (2), `ORDER_STATE_UNKNOWN` (3); `Type` ∈ `ORDER_TYPE_BUY` (0) / `ORDER_TYPE_SELL` (1); `Offset` ∈ `ORDER_OFFSET_OPEN` / `ORDER_OFFSET_CLOSE` (futures); plus `Price`, `Amount`, `DealAmount`, `AvgPrice`, `Symbol`, `ContractType`, `Info`.
- `exchange.GetOrders(symbol?)` → open orders (`[]` when none; docs say `null` on failure, fmz.d.ts types it `IOrder[]`). `exchange.GetHistoryOrders(symbol?, since?, limit?)` or `(since, limit)` → filled/cancelled orders.
- `exchange.CancelOrder(id, ...logExtra)` → `true` only means the request was sent; confirm with `GetOrders`/`GetOrder`. `exchange.ModifyOrder(id, side, price, amount)` → new id or `null`.
- Conditional orders (exchange-native TP/SL): `exchange.CreateConditionOrder(symbol, side, amount, {ConditionType: ORDER_CONDITION_TYPE_TP|SL|OCO|GENERIC, TpTriggerPrice, TpOrderPrice, SlTriggerPrice, SlOrderPrice})`, `ModifyConditionOrder(id, side, amount, cond)`, `GetConditionOrder(id)`, `GetConditionOrders(symbol?)`, `CancelConditionOrder(id)`, `GetHistoryConditionOrders(...)`. An `IOrder` has a `Condition` key only when it is a conditional order.
- `exchange.Log(LOG_TYPE_BUY|LOG_TYPE_SELL|LOG_TYPE_CANCEL, price, amount?, ...)` writes a trade-shaped log line and chart marker **without placing an order** (paper signals).

## Raw exchange calls: `exchange.IO`

| Command | Effect |
|---|---|
| `IO("api", "GET"\|"POST", "/path" or full URL, "k=v&k2=v2", rawBody?)` | signed request to any endpoint of the account's exchange; returns the parsed response or `null`. String values inside the query need single quotes (`"amount='1'"`). |
| `IO("currency", "ETH_USDT")` | same as `SetCurrency` |
| `IO("cross", bool)`, `IO("dual", bool)`, `IO("unified", bool)`, `IO("simulate", bool)`, `IO("trade_margin")` / `IO("trade_super_margin")` / `IO("trade_normal")`, `IO("selfTradePreventionMode", s)` | cross/isolated margin, hedge/one-way, unified account, demo trading, spot margin modes, STP — availability per exchange is tabulated under `#### Spot Exchanges` / `#### Futures Exchanges` in api.en.md |
| `IO("rate", "GetTicker", 10, "1s")`, `IO("rate", "GetTicker,GetDepth", 10, "1s", "delay")` | client-side rate limit: default mode makes the limited function return `null` when exceeded, `"delay"` mode waits; wildcards allowed (`#### exchange.IO`, user-guide "API Rate Limiting Control") |
| `IO("wait", ms)` | domestic futures counters (CTP): next tick or order update as `{Event: "tick"\|"order", ...}` |

## Concurrency and IO

`exchange.Go(methodName, ...args)` → `IGo` (one call on a background routine):
- `wait()` blocks; `wait(ms)` returns `undefined` on timeout — test with `typeof r === "undefined"`, because `null` is a real failure; `wait(-1)` polls. A timed-out object can be waited again; a consumed one cannot.
- Supported: `GetTicker, GetDepth, GetTrades, GetRecords, GetAccount, GetOrders, GetOrder, CancelOrder, Buy, Sell, GetPositions, IO`. Backtests run them sequentially. More than 2000 un-waited routines is an error.
- `HttpQuery_Go(...)` and `Mail_Go(...)` return the same object kind.
- `EventLoop(timeout)` (live only) wakes when any Go routine or `Dial` socket has data; call `EventLoop(-1)` once early or earlier events are missed; the queue holds 500 events. Returns `{Seq, Event, ThreadId, Index, Nano, Symbol?, Ticker?, Order?}`.

`threading` (fmz.d.ts `interface IThreading`):

| Call | Notes |
|---|---|
| `threading.Thread(fn, ...args)` or `Thread([fn, a, b], [fn2, ...])` | runs `fn` in an **isolated JS context**: no outer variables, no user-defined functions, only its arguments and the platform API (pass data or functions in as arguments) |
| `t.join(ms?)` | `{id, terminated, elapsed (ns), ret} \| null` on timeout |
| `t.postMessage(msg)` / `threading.currentThread().peekMessage(ms?)` | serialised copies; `peekMessage(-1)` is non-blocking |
| `t.terminate()`, `t.setData(k, v)` / `t.getData(k)`, `t.eventLoop(ms?)`, `t.id()`, `t.name()` | |
| `threading.mainThread()`, `currentThread()`, `getThread(id)`, `pending()` | |
| `threading.Lock()` (`acquire/release`), `Event()` (`set/clear/wait(ms)/isSet`), `Condition()` (`acquire/release/wait/notify/notifyAll`), `Dict()` (`get/set`) | sync primitives |
| `threading.Serve(uri, handler)` / `__Serve(uri, handler)` | HTTP/TCP/WebSocket server inside the robot, one thread per request; `ctx.path()/method()/body()/write()/setStatus()/upgrade("websocket")/read(ms)` |

In the backtest threads exist for compatibility but do not run concurrently. `__Thread*` globals are deprecated aliases. When `main` returns all threads are terminated.

`Dial(address, timeoutOrOptions?)` → `IDial | null`:
- Addresses: `wss://`, `ws://`, `tcp://`, `udp://`, `tls://`, `unix://`, `sqlite3:///file.db`, `mysql://u:p@h:3306/db`, `postgres://...`, `clickhouse://...`; mqtt/nats/amqp/kafka per api.en.md `#### Dial`.
- Options after `|` in the address: `"wss://...|compress=gzip_raw&mode=recv&reconnect=true&payload=" + JSON.stringify(sub)`; or an object `{headers, reconnect, retry, interval, payload, compress, pingInterval, pingMessage, pingType, insecureSkipVerify, proxy, local_ip}`.
- fmz.d.ts says a numeric second argument is a connect timeout in **ms** (default 30000); api.en.md says seconds. Prefer the options object.
- `read(ms)`: `> 0` wait that long, `0`/omitted block, `-1` non-blocking, `< -1` drop the backlog and return the newest. Returns the message (string, or `ArrayBuffer` for non-UTF-8 frames), `null` on timeout, `""` when the peer disconnected (with `reconnect` the reconnection runs in the background).
- `write(data, ms?)` → bytes written (0 = broken); `exec(sql, ...binds)` on database handles → `{columns, values} | null`; `fd()`; always `close()`.

HTTP, database, crypto, misc:
- `HttpQuery(url)` / `HttpQuery(url, {method, body, headers, cookie, timeout (ms, default 300000), charset, proxy, debug, format})` → body string; with `debug: true` → `{StatusCode, Header, Body, Error?}`. A transport failure gives `""` / `StatusCode 0` + `Error` (fmz.d.ts says `null`; treat any falsy result as failure); HTTP 4xx/5xx are returned normally. Legacy form `HttpQuery(url, postData, cookies, headers)` still works. `fetch(url, init)` is the Promise version for `async` code.
- `DBExec(sql, ...binds)` → `{columns: [...], values: [[...]]} | null` on the robot's private SQLite; a leading `:` (`DBExec(":SELECT ...")`) uses an in-memory DB. `_G` lives in the same database file.
- `Encode(algo, inFmt, outFmt, data, keyFmt?, key?)`: algos `"md5"|"sha1"|"sha256"|"sha512"|"keccak256"|"hmac_sha256"|"hmac_sha512"|"aes256-cbc"|"ed25519"|"raw"...`, formats `"hex"|"base64"|"raw"|"string"`. `exchange.Encode(...)` is the same but accepts `"{{accesskey}}"`/`"{{secretkey}}"` so keys never appear in code; `exchange.HMAC(algo, outFmt, data, key?)` is its HMAC shortcut (both live only; `selfcheck.js` uses `Encode("hmac_sha256", ...)`, the portable form). `MD5(s)`, `UUID()`.
- `exchange.GetMeta("AccessKey")` reads a non-sensitive config field of that account (secrets return `""`); the global `GetMeta()` returns the registration-code metadata string or `null`.
- `Mail(smtpServer, user, password, to, title, body)` → bool. `SetChannelData(v)` / `GetChannelData(token)` share data between robots. `os.open/fgets/fputs/listFiles/...` file access is confined to the robot's `files` folder in live.
- `UnixNano()`, `Unix()` (s), `Version()`, `GetOS()` (`"linux/amd64"`), `GetPid()`, `SysInfo(attr)`, `GetLastError()` (returns and clears, `null` if none), `IsVirtual()`, `exchange.SetBase(url)`/`GetBase()` (alternate domain or testnet), `exchange.SetProxy("socks5://...")`, `exchange.SetTimeout(ms)`, `exchange.SetRate(n)`/`GetRate()`, `_T(a, b?)`.

## Logging and UI

`Log(...any)` prints to the robot log (and backtest log); objects are rendered. Suffixes on the **last string**:

| Suffix / form | Effect |
|---|---|
| `"... #ff0000"` | colours the line |
| `"...@"` | also pushes it (email/webhook from the account's push settings); one push per 20 s is kept; none in backtest or debug tool |
| `"...&"` | private line (hidden when the robot is shared publicly) |
| `` "`data:image/png;base64,...`" `` | embeds an image |
| `"[trans]中文|abc[/trans]"` | localised text |

Combine colour then push: `Log("Hello #ff0000@")`.

`LogStatus(...any)` overwrites the status bar (not the log). Same colour suffix; `"\n"` for lines; a JSON string wrapped in backticks renders rich content:
- Table: `` LogStatus("`" + JSON.stringify({type: "table", title: "Pos", cols: ["Sym", "Amt"], rows: [["BTC", 0.1]]}) + "`") ``; an array of tables renders as tabs.
- Button: `{type: "button", name: "Close all", cmd: "coverAll", class: "btn btn-xs btn-danger", description, disabled, input: {name, type: "number"|"string"|"selected"|"boolean", defValue}}` (or `group: [...]` for several inputs); buttons may sit inside table cells. A click reaches `GetCommand()` as `"coverAll"` or `"coverAll:123"`.

Other log calls:
- `LogProfit(profit, ...extra)` appends to the profit curve; a last argument `"&"` updates the chart without writing a log row. `LogProfitReset(remain?)`.
- `LogReset(remain?)`, `LogVacuum()` (compact the DB after deletes), `EnableLog(false)` stops log writes.
- `SetErrorFilter("timeout|503")` hides matching error logs; calls accumulate, `""` clears.
- `console.log/error` go to the robot's "Debug Info" tab and `stdout_*` files (live only; objects print as `[object Object]`). Use `Log` for anything you want to see.

Charts:
- `Chart(options | [options])` → `IChart`: a Highcharts/Highstock config (`__isStock`, `extension.layout/height/col` for multi-chart pages). `chart.add(seriesIndex, [ts, value])` or `add([i, point])`; `add(i, point, -1)` replaces the last point; `reset(remain?)`; `del(series)`; `update(fullOptions)` replaces the whole config. Prefer `Chart` for general plotting (fmz.d.ts).
- `KLineChart({overlay, pricePrecision, volumePrecision})` → Pine-style drawing: per bar call `c.begin(bar)`, then `c.plot(v, title?, opts?)`, `hline`, `plotshape`, `plotchar`, `plotarrow`, `plotcandle`, `barcolor`, `bgcolor`, `fill(p1, p2, opts)`, `signal("buy"|"sell"|"closebuy"|"closesell", price, qty)`, and finish with `c.close()`. Optional arguments go positionally or as a trailing options object (`selfcheck.js` "KLineChart").

Interaction and persistence:
- `GetCommand()` → `null` when nothing is pending, else `"cmdBtn"` (button) or `"name:value"`: numbers `"cmdNum:123"`, booleans `"cmdBool:true"`, strings `"cmdStr:abc"`, dropdowns `"cmdCombox:1"` (index). Split on the first `":"` yourself. Invalid in backtests. Controls are declared in the strategy's interaction settings or built in the status bar; `send_robot_command` delivers the same strings.
- `_G(key, value)` persists JSON-serialisable values per robot across restarts; `_G(key)` reads (`null` if absent); `_G(key, null)` deletes; `_G(null)` wipes everything; `_G()` returns the robot id. Keys are case-insensitive. Cleared when a backtest ends.

## Templates and built-in libraries

- A template is a strategy of category "template" that exports functions on the `$` namespace: `$.Test = function () { Log("Test") }`; its own `main()` only runs when the template is debugged. A strategy that references it (editor checkbox, or `save_strategy.templates: [id]`) calls `$.Test()`. Template parameters are globals inside the template code. `$` is declared `any` in fmz.d.ts.
- Built in: `talib.*` (full TA-Lib: `talib.MACD(records, 12, 26, 9)` → `[dif, dea, hist]`, `talib.BBANDS`, `talib.RSI`, `talib.ATR`, `CDL*` patterns), `TA.*` (`MA, EMA, SMA, MACD, BOLL, KDJ, RSI, ATR, OBV, CMF, Alligator, Highest, Lowest`), `_` (underscore), `Decimal` (decimal.js). Indicator functions take a records array (uses `Close`) or a number array and return arrays aligned with the input; values before the warm-up period are invalid. Details in `references/indicators.md`.
- mathjs is listed as integrated in one guide section, but the "Built-in Libraries" section loads it with `eval(HttpQuery("https://cdnjs.cloudflare.com/ajax/libs/mathjs/13.2.0/math.min.js"))`; load third-party libraries that way.
- `BigDecimal`/`BigFloat` are declared `any` in fmz.d.ts and undocumented elsewhere; standard `BigInt` and `JSON.parse(s, true)` (big numbers as strings, live only) are the documented options.

## Utilities

| Call | Behaviour |
|---|---|
| `Sleep(ms)` | blocks the strategy while pumping pending events; sub-millisecond values allowed (minimum `0.000001`); in a backtest it skips ahead on the virtual clock |
| `sleepAsync(ms)` | Promise version for `async main` |
| `Unix()` / `UnixNano()` | seconds / nanoseconds |
| `_D(ts?, fmt?)` | `"yyyy-MM-dd hh:mm:ss"` in the **node's local time zone**; `ts` in ms or a `Date`; tokens `yyyy MM dd hh mm ss SSS` |
| `_N(x, digits = 4)` | truncates, never rounds |
| `_C(fn, ...args)` | retries `fn` every 3 s (`_CDelay(ms)` changes it) until it returns something non-null and non-false; it never gives up |
| `_CDelay(ms)` | retry interval for `_C` |
| `_Cross(a, b)` | `> 0` a crossed above b, `< 0` below, `0` none (JSDoc and api.en.md); the fmz.d.ts return annotation says `boolean`, so test with `!== 0` or the sign |
| `JSONParse(s)` | throws on bad JSON; `JSON.parse(s, true)` keeps big integers as strings |
| `IsVirtual()` | `true` in the backtest |
| `GetLastError()` | last error string, cleared on read |
| `parseInt(number)` | accepted (`parseInt(Date.now() / 1000)`) |

## Native event API (`ctx`) — optional, lower level

On the Rust-based node a global `ctx` exposes the engine directly (`references/ctx.d.ts`, `references/events.md`). It is a separate programming model: subscribe, then poll events. Failures come back as **values**, never exceptions: a transport failure is an `Error` instance, an exchange-side failure is an object with an `error` field, and both must be checked.

```js
var tick = ctx.subscribe(0, "BTC_USDT", {channel: "ticker"});   // ex = account index (never the label); returns a stream id
ctx.subscribe(0, "", {channel: "orders"});                        // private order stream, empty symbol
while (true) {
  var ev = ctx.poll([], 1000);                                    // [] = every stream; null on timeout; also pumps timers/Promises/WS
  if (!ev) continue;
  if (ev.kind === 1) { /* ticker: bid ask last bidQty askQty volume openInterest open high low time */ }
  else if (ev.kind === 16) { /* order: id state(acked|partial|filled|canceled|rejected) px qty filledQty avgPx reason reasonText */ }
}
var id = ctx.order(0, "BTC_USDT", "buy", 50000, 0.01, {type: "limit", tif: "gtc"});   // string | Error
if (id instanceof Error) { ctx.log("rejected", id.message); }
```

| Piece | Details |
|---|---|
| Event kinds | 1 ticker/bbo; 3 depth (signal only — read levels with `ctx.book(ex, symbol, n)` → `{bids: [[px, qty]...], asks: [...]}`); 4 trade (`px qty side tradeId`); 5 kline (`open high low close volume intervalSec openTimeMs closed prefill`); 16 order report; 32 timer (`ctx.STREAM_TIMER`); 33 gateway status (`ctx.STREAM_STATUS`, `status` 1 UP 2 DOWN 3 DEGRADED); 35 market-data prefill status. Common fields `kind ex symbol seq ts`. |
| `ctx.subscribe(ex, symbol, opts)` | `channel` (`ticker|bbo|trade|depth|kline|orders`), `depth`, `interval` (s), `mode: "latest"` or `buffer: N` (slow-consumer policy, events.md "投递模式") |
| `ctx.poll(streams?, timeoutMs?)` | `[]`/omitted = all streams; filtered consumers should include `ctx.STREAM_REST`; `ctx.poll({sources: "all"}, ms)` also waits on threads, Go, Dial and tasks |
| `ctx.order(ex, symbol, "buy"\|"sell", px, qty, opts?)` | `opts`: `type` (`limit|market|stop|stopLimit`), `tif` (`gtc|ioc|fak|fok|postOnly`), `reduceOnly`, `postOnly`, `closeToday`, `replaceId`, `cond: {type: "tp"|"sl"|"oco", tpTrigger, tpPx, slTrigger, slPx}`, `extra`; returns the exchange id or an `Error` |
| `ctx.cancel(ex, symbol, id)` | `void | Error` |
| `ctx.rest(ex, method, args)` | synchronous REST for any symbol (`"ticker"`, `"depth"`, `"klines"`, `"assets"`, ...; names from `abi::REST_METHODS`), rate-limited 20/s per exchange (blocks) |
| `ctx.raw(ex, method, args)` | exchange-specific endpoint, returns a **string** or `Error` |
| Runtime | `ctx.connectors()` (index, label, name, symbol), `ctx.sleep(ms)`, `ctx.log/logStatus/logProfit`, `ctx.chart/chartAdd/chartReset/chartDel`, `ctx.getCommand(timeoutMs?)` (`""` when none), `ctx.setChannelData/getChannelData`, `ctx.robotId()` |

`EventLoop` and `ctx.poll` drain the same queues: pick one consumer per strategy. Do not mix `ctx` calls into the classic API above; `ctx` does not exist on the legacy Go node.

## Pitfalls

- **Check every return value.** `GetTicker()`, `GetAccount()`, `Buy()` and the rest are `null` on network errors, rate limits and exchange rejections; `ticker.Last` on `null` throws and kills the robot (the user guide's top cause of abnormal exits). Use `if (!x)` or `_C` for reads; for orders inspect `null` and `GetLastError()`, never retry blindly.
- **Never busy-loop.** Put `Sleep(500–5000)` in every loop; exchange rate limits otherwise turn every call into `null`. Do not wrap calls that may fail forever in `_C`; `IO("rate", ...)` can cap a function client-side.
- **Amount units.** Spot market buy = quote amount; futures = contracts (`CtVal` coins each); limit = base currency. Apply `SetPrecision`/`_N` and `MinQty`/`MinNotional` from `GetMarkets()` or the exchange rejects the order.
- **Futures state.** `SetContractType` before anything else; with `Buy`/`Sell` set `SetDirection` before every order; prefer `CreateOrder` with an explicit symbol and side.
- **Order lifecycle.** An order id does not mean filled: poll `GetOrder(id).Status` until `ORDER_STATE_CLOSED`, or cancel; `CancelOrder` returning `true` is only "request sent".
- **One `exchange` per account.** `exchanges[i]` is one configured account; address by index, labels can repeat. `GetAccount` covers only the current pair's two currencies; use `GetAssets` for everything else.
- **Restarts lose memory.** Globals reset on restart; persist state with `_G`/`DBExec` and rebuild from `GetOrders`/`GetPositions` on start.
- **Backtest vs live.** `IsVirtual()` tells them apart. Backtest: no `GetCommand`, no push, no `onerror`, no real `threading`/`Go` concurrency, `_G` cleared at the end, `Sleep` jumps the virtual clock; use `Unix()`/`UnixNano()`/`_D()` rather than wall-clock assumptions. Live-only: `EventLoop`, `Dial` sockets, `console.log`, `exchange.Encode/HMAC/GetMeta`, `JSON.parse(s, true)`.
- **Logging.** `console.log` is invisible in the normal log; `Log` is. Push only works live and is throttled to one message per 20 s.
- **Numbers.** Exchange ids and big integers exceed `Number` precision: keep `Id` as received, use `JSON.parse(s, true)` or `BigInt` for raw payloads, and `Info` for unnormalised fields.
- **Threads are sandboxes.** A `threading.Thread` body cannot use closures or outer functions; pass what it needs as arguments.
- **`wait()` semantics.** `undefined` = timed out (call `wait` again), `null` = the call failed; waiting on a consumed object errors.
- **Strings.** Byte strings that cannot be encoded come back as `ArrayBuffer`; every string parameter accepts `ArrayBuffer` too (user-guide "JavaScript Strategy Writing Guide").
- Before saving run `check_strategy`; before going live run `run_backtest` and read `error_lines`; test with a sandbox account or a tiny amount first (`SKILL.md`).
- Fast local iteration: the platform's local engine (`references/backtest-local.md`) runs a JavaScript strategy on this machine in seconds (`npm install git+https://github.com/fmzquant/backtest_javascript.git`); confirm on the cloud with `run_backtest` before going live.

## References

- `references/fmz.d.ts` — every global, `IExchange` method, structure and constant with JSDoc. Grep `GetRecords(`, `CreateOrder(`, `interface IOrder`, `interface IMarket`, `IO(k:`, `interface IDial`, `interface IThreading`, `interface IKLineChart`, `declare function HttpQuery`, `interface IHttpOptions`, `ORDER_STATE_`, `declare namespace os`, `class Trader` (a `Trader` helper class declared here but not covered by the platform docs). `references/fmz.zh_CN.d.ts` is the Chinese copy.
- `references/ctx.d.ts` and `references/events.md` — the native `ctx` API: `ISubOpts`, `IOrderOpts`, `ICondOpts`, `ICtx`, event field tables, delivery modes, `ctx.rest` method names.
- `references/selfcheck.js` — a known-good strategy that calls the whole classic API once (meta, `_G`, DB, HTTP, markets, market data, account, `Go`, `Chart`, `KLineChart`, orders and conditional orders gated by `IsVirtual()`). Copy its idioms and null checks.
- `references/api-docs.md` — `references/api.en.md`; grep `#### exchange.GetTicker`, `#### exchange.Buy`, `#### exchange.CreateOrder`, `#### exchange.GetPositions`, `#### exchange.SetContractType`, `#### exchange.SetDirection`, `#### exchange.IO`, `#### Spot Exchanges`, `#### Futures Exchanges`, `#### exchange.Go`, `#### threading`, `#### Dial`, `#### DBExec`, `#### Log`, `#### LogStatus`, `#### LogStatus-btnTypeTwo`, `#### Chart`, `#### KLineChart`, `#### GetCommand`, `#### EventLoop`, `#### Server` (`threading.Serve`), `#### _G`, `#### _C`, `## Structures`.
- `SKILL.md` — `references/user-guide.en.md`: "Strategy Entry Functions", "Strategy Parameters", "Interactive Controls", "Template Library", "Built-in Libraries", "JavaScript Strategy Writing Guide", "### TypeScript", "API Rate Limiting Control", "Options Trading", "Common Causes of Live Trading Errors"; `references/tools.md` for `save_strategy`, `run_backtest`, `send_robot_command`.
- `references/backtest.md` — backtest header comment, exchanges, data granularity. `references/indicators.md` — `talib`/`TA` argument and output details.
