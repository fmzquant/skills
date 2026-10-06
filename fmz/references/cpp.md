> Part of the `fmz` skill. File paths below are relative to the skill directory (the folder that holds `SKILL.md`).

# FMZ C++ strategies

A strategy is a source file with a `void main()` entry. The platform compiles it on its
build cluster (not on the node) and runs the result as a plugin in both backtest and live.
The SDK (`exchange`, `exchanges`, `TA`, `talib`, `json`, every global below) is already
included: write **no `#include`** and **no `int main`**.

```cpp
// parameters are globals (see "Parameters"); here fast, slow are double
void main() {
    Log("start", fast, slow, "virtual:", IsVirtual());
    while (true) {
        Ticker t = exchange.GetTicker();
        if (!t.Valid) { Log("ticker failed:", GetLastError()); Sleep(2000); continue; }
        Records &r = exchange.GetRecords();           // K-lines of the robot's period
        if (!r.Valid || r.size() < (size_t)slow) { Sleep(1000); continue; }
        auto ma1 = TA.MA(r, (size_t)fast), ma2 = TA.MA(r, (size_t)slow);
        LogStatus("price", t.Last, "ma", _N(ma1.back(), 2), "/", _N(ma2.back(), 2));
        string cmd = GetCommand();                    // "" when nothing was sent
        if (!cmd.empty()) Log("command:", cmd);
        Sleep(5000);                                  // milliseconds; never busy-loop
    }
}
```

Futures, with explicit sides instead of `SetDirection` (selfcheck.cpp "trading" section, api.en.md "exchange.CreateOrder"):

```cpp
void main() {
    json ct = exchange.SetContractType("swap");       // pair BTC_USDT -> symbol "BTC_USDT.swap"
    if (ct.is_null()) Panic("SetContractType failed:", GetLastError());
    exchange.SetMarginLevel(5);
    Ticker t = _C(exchange.GetTicker);                // _C retries until Valid
    TId id = exchange.CreateOrder("BTC_USDT.swap", "buy", t.Sell, 1);   // open long, 1 contract
    if (!id.Valid) { Log("order failed:", GetLastError()); return; }
    Sleep(2000);
    Order o = exchange.GetOrder(id);
    if (o.Valid && o.Status == ORDER_STATE_PENDING) exchange.CancelOrder(id, "unfilled, cancelled");
    Positions ps = exchange.GetPositions("BTC_USDT.swap");
    if (!ps.Valid) return;
    for (auto &p : ps)
        if (p.Type == PD_LONG && p.Amount > 0)
            exchange.CreateOrder("BTC_USDT.swap", "closebuy", -1, p.Amount);   // -1 = market
}
```

## How the source is wrapped

- The server emits `<SDK bundle>` + parameter globals + `namespace strategy { #line 1 "main.cpp" <your source> }` + `void __vmain() { strategy::main(); }` (lang_cpp.go `buildCpp`; the backtest node does the same in `loader_tpl.py`). So `void main()` is legal (it is `strategy::main`, not `::main`) and compiler errors cite `main.cpp:<your line>`.
- Toolchain: `zig c++ -std=c++20 -shared -DBUILD_DLL -Oz` (lang_cpp.go line ~213). The user guide still says "C++11"; C++20 is what actually compiles. Warnings are not errors.
- `using namespace std;` and `using json = nlohmann::json;` are in effect (fmz.hpp lines 2-3). `<string> <vector> <map> <memory> <random> <iostream> <ctime> <cstdio>` are already included (bootstrap.hpp lines 10-19); `fabs/pow/floor` work with no include (selfcheck.cpp line 72). Your main source is pasted *inside* `namespace strategy`, so an `#include` there can break the build; only template (library) sources have their `#include` lines hoisted.
- Strategy templates (libraries) are compiled into `namespace ext { ... }` before your code; call their functions as `ext::fn()`.
- `exchange` is a macro for `strategy::exchange`, a copy of `exchanges[0]`; `vector<Exchange> exchanges` holds every configured account in order. Each `Exchange` object keeps its own K-line cache.
- Lifecycle (bootstrap.hpp `startup`, lines ~2960-2975): live runs `main()` and then stops the robot when it returns (`call_onExit` -> `exit(0)`); an uncaught `std::exception` escaping `main()` in live is turned into `Panic(e.what())`, i.e. the robot stops with that message. In a backtest the end of the data range is signalled by an internal exception thrown out of the next API call, which unwinds your `while(true)` loop; the harness does **not** convert other exceptions there, so catch your own.
- `init()` / `onexit()`: documented optional hooks (user guide "Strategy Entry Functions"; selfcheck.cpp defines both). They are looked up at run time by the plain C symbol names `plugin_oninit` / `plugin_onexit`, but your definitions live inside `namespace strategy`, and in a local clang build they come out as C++-mangled symbols that this lookup cannot see. Treat them as unreliable: do setup at the top of `main()`, and never rely on `onexit()` to flatten positions. `onerror()` is not supported for C++ at all.

## Parameters

Declared when saving (`save_strategy.args`): `[[name, label, description, default], ...]`. Each becomes a namespace-scope global you can read and assign, typed by its value (lang_cpp.go `EmitArg`/`cppConstFromValue`, loader_tpl.py lines ~159-167):

| Control | C++ type |
|---|---|
| number | `double` (never `int`; cast with `(int)` or `(size_t)` when indexing) |
| string | `string` |
| bool | `bool` |
| dropdown, single select | `int` index in live; `double` in backtests. Compare with `==`, never `switch` on it |
| dropdown, multi select | `vector<int>` / `vector<double>` (all numeric) or `json` (mixed) in live; `json` in backtests |
| encrypted string | `auto` (a lazy wrapper that converts to `string` on first use) |

The raw parameter object is also available as the `json __jsargv` global (selfcheck.cpp line 63). Keep names valid C++ identifiers that do not collide with SDK names.

## Error model: the `Valid` flag

Market, account and order calls never return null; they return an object whose base class `TBase` carries `bool Valid` (fmz.hpp lines 69-81). `Valid` is false when the call failed; the engine writes the error to the robot log and `GetLastError()` returns (and clears) its text. `Records` and `Orders` etc. are `vector<T>` subclasses with the same flag, so check `Valid` *and* `size()`. `if (ticker)` also works (`explicit operator bool`). Order ids are `TId` (fmz.hpp lines 240-275): `id.Valid`, `(string)id` or `to_string(id)` to print, `==` to compare, and pass it straight to `GetOrder`/`CancelOrder`.

## Exchange API (synchronous; see fmz.hpp `class Exchange`, lines 499-643)

| Call | Returns / notes |
|---|---|
| `GetTicker(symbol = "")` | `Ticker{Time, Symbol, Open, High, Low, Sell, Buy, Last, Volume, OpenInterest, json Info}` |
| `GetTickers()` | `Tickers` (vector<Ticker>) |
| `GetDepth(symbol = "")` | `Depth{Time, Asks, Bids, Info}`; `Asks[i].Price/.Amount` ascending, `Bids` descending |
| `GetTrades(symbol = "")` | `Trades` of `{Id, Time, Price, Amount, Type}` |
| `GetRecords(period = -1, limit = 0)` / `GetRecords(symbol, period, limit)` | `Records &` of `Record{Time(ms), Open, High, Low, Close, Volume}`; period in seconds (`PERIOD_M5`, `PERIOD_H1`, `PERIOD_D1`...), -1 = robot period. The reference points at a per-exchange cache that the next call with the same symbol/period updates in place and caps at `SetMaxBarLen` bars; copy (`Records r = ...`) for a snapshot. `r.Close()` etc. give `vector<double>` columns |
| `GetFundings(symbol = "")` | `Fundings` of `{Time, Rate, Interval, Symbol, Info}` |
| `GetMarkets()` | `json` keyed by symbol (`markets["BTC_USDT.swap"]`) with precision/limits |
| `GetAccount()` | `Account{Balance, FrozenBalance, Stocks, FrozenStocks, Equity, UPnL, Info}`: quote / base currency; futures: margin in `Balance`, equity and unrealised PnL |
| `GetAssets()` | `Assets` of `{Currency, Amount, FrozenAmount}` |
| `Buy(price, amount, ...)` / `Sell(price, amount, ...)` | `TId`. `price = -1` is a market order; a **spot market buy** takes the amount in quote currency; limit orders take base currency; futures amounts are contracts. Extra args are appended to the order log |
| `CreateOrder(symbol, side, price, amount, ...)` | `TId`; `side` is `"buy"`/`"sell"` (spot) or `"buy"`/`"closebuy"`/`"sell"`/`"closesell"` (futures); `symbol` like `"BTC_USDT"` or `"BTC_USDT.swap"`; no `SetDirection` needed. Preferred for futures |
| `ModifyOrder(id, side, price, amount)` | `TId`; the side argument is required (selfcheck.cpp line ~335) |
| `GetOrder(id)` | `Order{Id, Time, Price, Amount, DealAmount, AvgPrice, Type, Offset, Status, Symbol, ContractType, Condition, Info}`; `Valid` false when the call fails or returns nothing. `Status` is `ORDER_STATE_PENDING/CLOSED/CANCELED/UNKNOWN`, `Type` is `ORDER_TYPE_BUY/SELL` |
| `GetOrders(symbol = "")` / `GetHistoryOrders(symbol, since_ms, limit)` | `Orders` (open / finished) |
| `CancelOrder(id, ...)` | `bool` |
| `CreateConditionOrder(symbol, side, amount, OrderCondition)` and `Modify/Get/Cancel...ConditionOrder`, `GetConditionOrders()` | stop / take-profit orders; fill `OrderCondition{ConditionType = ORDER_CONDITION_TYPE_SL/TP/OCO, TpTriggerPrice, TpOrderPrice, SlTriggerPrice, SlOrderPrice}` (api.en.md "exchange.CreateConditionOrder") |
| `GetPositions(symbol = "")` / `GetPosition()` | `Positions` of `{MarginLevel, Amount, FrozenAmount, Price, Margin, Profit, Type (PD_LONG/PD_SHORT), Symbol, ContractType, Info}` |
| `SetContractType("swap"/"quarter"/"this_week"...)` | `json` contract info (null-ish on failure); required before trading futures. `SetMarginLevel(10)` / `SetMarginLevel(symbol, 10)`; `SetDirection("buy"/"sell"/"closebuy"/"closesell")` before each `Buy`/`Sell` on futures (legacy style) |
| `SetCurrency("ETH_USDT")` | switch pair; `GetCurrency()`, `GetBaseCurrency()`, `GetQuoteCurrency()`, `GetName()`, `GetLabel()`, `GetPeriod()` seconds |
| `SetPrecision(pricePlaces, amountPlaces)`, `SetTimeout(ms)`, `SetMaxBarLen(n)`, `SetProxy(url)`, `SetBase(url)`, `SetRate(x)` | configuration |
| `IO("api", "GET"/"POST", "/path", "query", body)` | `json`; raw REST call signed with the account's keys. `IO("currency", "BTC_USDT")` switches pair the old way |
| `GetRawJSON()` | raw body of the last REST response, for debugging |
| `Log(LOG_TYPE_BUY/SELL/CANCEL, price, amount, ...)` | draws a trade marker in the log only; **not** an order |
| `Go("GetTicker")`, `Go("Buy", price, amount)`, `Go("IO", ...)` | `GoObj`; call `wait(obj, timeout_ms = 0)` with a variable of the result type (`Ticker`, `Depth`, `Records`, `TId`, `bool` for CancelOrder, `json` for IO) — a type mismatch `Panic`s. Supported ops: Buy, Sell, CreateOrder, ModifyOrder, Create/ModifyConditionOrder, GetTicker(s), GetDepth, GetRecords, GetTrades, GetPosition(s), GetFundings, GetAccount, GetAssets, GetOrders, GetHistoryOrders, GetOrder, CancelOrder, IO (bootstrap.hpp lines ~2333-2353). `wait` returns false on timeout (then call it again); once it has delivered a result the routine is released and a second `wait` is an error |

Multi-account: `for (auto &e : exchanges) Log(e.GetName(), e.GetLabel(), e.GetAccount());` and `exchanges[i].Buy(...)`.
Fetching from every account at once (selfcheck.cpp lines ~206-220):

```cpp
vector<GoObj> jobs;
for (auto &e : exchanges) jobs.push_back(e.Go("GetTicker"));
for (size_t i = 0; i < jobs.size(); i++) {
    Ticker t;                                          // the variable's type must match the op
    if (jobs[i].wait(t) && t.Valid) Log(exchanges[i].GetName(), "last", t.Last);
    else Log(exchanges[i].GetName(), "failed:", GetLastError());
}
```

Raw exchange fields and HTTP (json.hpp; api.en.md "HttpQuery"):

```cpp
Ticker t = _C(exchange.GetTicker);
string raw = t.Info.value("someField", string(""));    // Info is the exchange's own payload; keys vary
if (!raw.empty()) Log("as number:", stod(raw));        // exchanges often send numbers as strings
json opt = {{"method", "GET"}, {"timeout", 5000}, {"headers", {{"User-Agent", "fmz"}}}};
string body = HttpQuery("https://www.okx.com/api/v5/public/time", &opt);   // "" on failure
if (!body.empty()) {
    try {
        json j = json::parse(body);
        Log("server time:", j["data"][0]["ts"]);
    } catch (json::exception &e) { Log("bad json:", e.what()); }
}
```

## Utilities (global functions; fmz.hpp lines 655-866)

- `Log(a, b, ...)`: variadic, any mix of numbers, strings, `json` (dumped), `TId`, and every SDK struct/vector (`Log(ticker)`, `Log(records)`, `Log(TA.MA(r, 9))`).
  - A message ending in `@` is pushed (email/webhook), `#ff0000` inside the text colours it, a trailing `&` marks it private.
  - `LogError(...)`, `LogProfit(x)` (profit curve), `LogReset(n)`, `LogProfitReset(n)`, `EnableLog(bool)`.
  - `LogStatus(...)` writes the status bar; a `json` table dumped between backticks renders as a table (api.en.md "LogStatus" cpp example):

    ```cpp
    json tbl = R"({"type":"table","title":"Positions","cols":["Symbol","Amount","Profit"],"rows":[]})"_json;
    Positions positions = exchange.GetPositions();
    for (auto &p : positions) tbl["rows"].push_back({p.Symbol, p.Amount, p.Profit});
    LogStatus("`" + tbl.dump() + "`");
    ```
- `to_string(order.Id)` — the SDK adds a variadic `to_string` overload for its own types (fmz.hpp line 665); `str_format("%.2f", x)` is printf-style formatting.
- `Sleep(ms)` (double; sub-millisecond allowed). The POSIX `sleep(s)` is remapped to it; nothing else advances a backtest's clock.
- `Unix()` seconds, `UnixNano()`, `_D(ms = 0, fmt = "%Y-%m-%d %H:%M:%S")` — note **milliseconds**: `_D(record.Time)`, `_D(Unix() * 1000)`.
- `_C(exchange.GetTicker)`, `_C(exchange.GetRecords, PERIOD_D1)`: a macro that re-calls until `Valid` (or a non-null `json`), sleeping `_CDelay(ms)` between tries (default 3000). It only works on SDK calls whose result has `is_null()`; custom functions are not supported.
- `_N(x, places = 4)`: truncates with `floor(x * 10^p) / 10^p` (toward minus infinity, no rounding).
- `_G("key", value)` stores any `json` value across restarts (live only; cleared when a backtest ends).
  - `_G("key")` returns `json`: `is_null()` when absent, `int(_G("n"))`, `string s = _G("s")`, `_G("k") == "v"`.
  - `_G("key", nullptr)` deletes one key; `_G(nullptr)` clears everything (selfcheck.cpp gates that behind `IsVirtual()`).
- `GetCommand()`: raw string from `send_robot_command` or a status-bar button (`"name:value"`), `""` when none. `EventLoop(timeout_ms)` blocks for the next event (Go routine done, websocket data) and returns its JSON string, `""` on timeout.
- `IsVirtual()` true in backtest; `Version()`, `GetOS()`, `GetPid()`, `SysInfo("mem")`, `UUID()`, `MD5(s)`, `Encode(algo, inFmt, outFmt, data, keyFmt, key)`, `exchange.HMAC(...)`.
- `JSONParse(s)` / `json::parse(s)` / `R"({"a":1})"_json`; `DBExec(sql, ...)` on the robot's SQLite returns `json{columns, values}`.
- `Panic("msg", ...)` logs and terminates the strategy (exit code 1). `SetErrorFilter(regex)` hides matching errors from the log.
- `HttpQuery(url, json *options = nullptr)`: returns the body string, `""` on failure (the error goes to the log).
  - Options keys: `method`, `body`, `headers`, `cookie`, `timeout` (ms), `charset`, `debug`; pass the address of a `json` object.
  - With `{"debug", true}` the returned string is the whole response (`StatusCode`, `Body`, ...) to parse yourself.
- `Dial(addr, timeout = 30)`: `tcp://`, `tls://`, `wss://`, `sqlite3://`, `kvdb://`.
  - Check `.Valid`; `read(timeout_ms = 0)` returns `""` on timeout or close; `write(s)`; `exec(sql)` for the database schemes; `close()`.
  - Live only; in a backtest the handle is never `Valid` (selfcheck.cpp lines ~263-268).
- `Mail(smtp, user, pass, to, subject, body)` / `Mail_Go(...)`; `_Cross(a, b)` on two `vector<double>` (positive = golden cross N bars ago, negative = dead cross); `_T("zh", "en")` for bilingual text.
- `Chart chart(json cfg)`: Highcharts config whose series carry `"data": []`.
  - `chart.add(seriesIdx, {ts_ms, value})` appends a point; `add(idx, point, replaceId)` overwrites one; `update(cfg)` replaces the whole config (pass the full one); `reset(keepLast)`.
- `KLineChart kc({{"overlay", true}})`: Pine-style candlestick plotter, one bar at a time (selfcheck.cpp lines ~247-311):
  - `kc.begin(bar); int p = kc.plot(v, {{"title","MA"},{"color","#ff0000"}}); kc.hline(price, ...); kc.plotshape(cond, ...); kc.fill(p1, p2, ...); kc.signal("buy", price, qty); kc.close();`
  - Use `Chart` for ordinary plots and `KLineChart` only when you need candlesticks (fmz.hpp lines 360-435).

## Indicators

`TA` (TA.hpp): `MA, SMA, EMA, RSI, ATR, OBV, CMF, Highest, Lowest` return `vector<double>`; `MACD, KDJ, BOLL, Alligator` return `array<vector<double>, 3>` (`auto m = TA.MACD(r, 12, 26, 9); m[0]` = DIF). Overloads accept `Records &` or `vector<double> &`; periods are `size_t`.
`talib` (talib.hpp): the full TA-Lib set, each as `talib.NAME(Records &r, params...)` or `talib.NAME(vector<double> &high, &low, &close, ...)`; multi-output functions return `array<vector<double>, N>`. Outputs are aligned with the input and hold NaN where the window is not full — check `std::isnan(v.back())`. Defaults and parameter names are in `references/talib.hpp`; the per-function docs are in the `references/indicators.md`.

## Pitfalls

- Check `Valid` (and `size()`) before touching any result; an invalid `Ticker` holds garbage, an invalid `Records` is empty. Wrap reads with `_C`; never wrap `Buy`/`Sell`/`CreateOrder`/`CancelOrder` in `_C` — every retry resends the order.
- `exchange.Go(...).wait(x)` needs `x` of the exact result type; `Records records; d.wait(records);`.
- json: `j["k"]` on a non-const `json` inserts a null key when missing; prefer `j.contains("k")` and `j.value("k", 0.0)`. Exchange payloads in `Info` often carry numbers as strings: `stod(j["price"].get<string>())`. `json::parse` and `.get<T>()` throw (`json::parse_error`, `json::type_error`); catch them (selfcheck.cpp lines 118-128) — in live an escaped exception kills the robot via `Panic`, in a backtest it aborts the run.
- `string + double` does not compile; use `to_string(x)` or `str_format`, or just pass the pieces to `Log` separately.
- `Records &` is a live view of the cache; `r.back()` changes after the next `GetRecords()` with the same key. Copy it before long computations if you mix calls.
- Amounts and prices: respect the exchange precision (`GetMarkets()`, `SetPrecision`), `_N` to truncate; a spot market buy amount is quote currency; futures need `SetContractType` first and `SetDirection` (or `CreateOrder` with an explicit side) before each order — a wrong direction is rejected with `direction is sell, invalid order type Buy`.
- Dropdown parameters are `int` in live but `double` in backtests; `switch (mode)` compiles in one and not the other.
- Never loop without `Sleep`; 500-5000 ms is typical. `main()` returning ends the robot.
- `_D` takes milliseconds, `Unix()` returns seconds; `Record.Time`, `Order.Time`, `Ticker.Time` are milliseconds.
- `_N` floors: `_N(-1.235, 2)` is `-1.24`.
- Use `Log`, not `cout`: `cout` writes to the process stdout, not to the robot log.
- Backtest and live share the code: gate side effects on `IsVirtual()` when needed, and do not assume wall-clock time.
- Errors from failed API calls are written to the robot log by the engine; `GetLastError()` gives you the text to branch on. Compile errors come back from `check_strategy` with `main.cpp:<line>` positions.

## Save and run

1. `check_strategy` with `language: "cpp"` — it compiles on the build cluster and takes a while; read the returned `error` with its `main.cpp:<line>` positions.
2. `save_strategy` with `language: "cpp"`, `source`, `args` (parameter definitions) → `strategy_id`.
3. `run_backtest` (`strategy_id`, or `source` + `language: "cpp"`), then `get_backtest` and read `errors` / `error_lines`. A `/*backtest ... */` header at the top of the source (start, end, period, basePeriod, exchanges) sets the defaults; it is documented in the `references/backtest.md`, and api.en.md "exchange.GetOrders" shows one on a C++ file.
4. For a live robot the source is compiled again for the node's reported OS/arch when the robot starts; an outdated node fails with `not support, please update docker`.

## References

- `references/fmz.hpp` — the authoritative declarations with comments: constants (`PERIOD_*`, `ORDER_STATE_*`, `ORDER_TYPE_*`, `PD_*`, `LOG_TYPE_*`, `ORDER_CONDITION_TYPE_*`), structs (`Ticker`, `Account`, `Depth`, `Record`/`Records`, `Order`/`Orders`, `Position`, `Trade`, `Asset`, `Funding`, `TId`, `OrderCondition`), `GoObj`, `Chart`, `KLineChart`, `Dial`, `class Exchange`, and every global function with its exact signature. Grep the function name.
- `references/selfcheck.cpp` — a known-good strategy that calls the whole API once; copy its idioms (Valid checks with `GetLastError()`, `_G`, `DBExec`, `JSONParse` try/catch, `Chart`, the complete `KLineChart` pass, `Go`/`wait`, condition orders, `IsVirtual()` gating of writes).
- `references/json.hpp` — the nlohmann `json` surface available to strategies: constructors, `parse`, `dump`, `is_*`, `get<T>`, `value`, `contains`, `items()`, operators, exception classes.
- `references/TA.hpp` and `references/talib.hpp` — indicator signatures, overloads and default parameters; grep the indicator name.
- See also: `references/api-docs.md` (full prose docs, grep the fenced `cpp` blocks by function name in `references/api.en.md`), `references/backtest.md` (backtest header and MCP flow) (the indicator guide is inside `references/api-docs.md`) (per-indicator semantics), `SKILL.md` (MCP tools, robots, safety rules).
