---
name: fmz-strategy-rust
description: "Write FMZ Quant strategies in Rust — the single-file program model (fn main, optional init/onexit, a prelude so no `use` lines), cargo-script dependency frontmatter, parameters injected as typed constants, the exchange/market/account/order API with its Result and Option return types, the Log!/LogStatus!/_G!/_C! macros, TA indicators, charts, HttpQuery/Dial, and the Rust-specific mistakes (unwrap panics, missing Sleep, f64 parameter casts, OpenSSL crates) that stop a live robot. Use when writing or editing a Rust strategy for the FMZ platform (then check, save and backtest it with the fmz MCP tools)."
---

# FMZ Rust strategies

A strategy is one `.rs` source with a `fn main()` entry. The platform compiles it on its build cluster into a cdylib (`libfmz_strategy.so`/`.dll`/`.dylib`, cross-compiled for the node's OS/arch) and the robot's node loads it; a backtest loads the same kind of artifact into the backtest engine. The whole SDK (`exchange`, `exchanges`, `TA`, types, constants, macros, your parameters) is in scope through a prelude: write no `use`, `mod` or `extern crate` for SDK items. Only third-party crates need `use`.

```rust
fn init() { Log!("init"); }                       // optional, runs before main
fn main() {
    Log!("fast", Fast, "slow", Slow);             // parameters are typed consts (f64 here)
    let (fast, slow) = (Fast as usize, Slow as usize);
    loop {
        let ticker = _C!(exchange.GetTicker(None)); // retry until Ok (transient errors only)
        let records = match exchange.GetRecords(None, None, None) {   // robot's period
            Ok(r) if r.len() >= slow => r,
            Ok(_) => { Sleep(1000); continue; }
            Err(e) => { Log!("GetRecords:", e); Sleep(1000); continue; }
        };
        let (mf, ms) = (TA.MA(&records, fast), TA.MA(&records, slow));
        let (f, s) = (mf[mf.len() - 1], ms[ms.len() - 1]);
        LogStatus!("price", ticker.Last, "ma", _N(f, 2), "/", _N(s, 2), _D(None));
        if let Some(cmd) = GetCommand(0) { Log!("command", cmd); }  // "name:value" strings
        Sleep(5000);                                 // milliseconds; never busy-loop
    }
}
fn onexit() { Log!("exit"); }                     // optional, runs when the robot stops
```

`main`, `init`, `onexit` take no arguments and return nothing. `OnExit(|| ...)` installs an exit hook programmatically, but there is a single slot: it replaces the hook already registered (including your `fn onexit`). The same code runs in backtest and live; `IsVirtual()` tells them apart.

## Build model

- **One file, no Cargo.toml.** Dependencies go in a cargo-script frontmatter that must be the first non-blank thing in the file (only blank and `#!` lines may precede it; a comment before it makes it unrecognized and the `---` lines then fail to compile):
  ```rust
  ---
  [dependencies]
  serde_json = "1"
  ---
  use serde_json::Value;                        // external crates still need `use`
  fn main() {
      let v: Value = serde_json::from_str(params()).unwrap_or(Value::Null);
      Log!("params:", v.to_string());
  }
  ```
  The table is merged into the SDK's Cargo.toml; the frontmatter is replaced by blank lines, so compiler line numbers match your file.
- **TLS crates:** the sandbox has no system OpenSSL. `native-tls`/`openssl-sys` fail to build; pick pure-Rust `rustls` features (e.g. `tokio-tungstenite = { version = "0.21", default-features = false, features = ["connect", "rustls-tls-webpki-roots"] }`). Better: use the built-in `Dial` (websocket) and `HttpQuery` and add no crate at all. Every crate lengthens an already slow cluster build.
- **Panics end the strategy.** `main` runs under `catch_unwind`; a panic is logged as `Rust strategy panic: ...` and the strategy exits. The SDK itself never panics on an exchange error — it returns `Err`. So `unwrap()`/`expect()`/out-of-range indexing are the ways a Rust robot dies.
- **Errors:** `Result<T>` is `std::result::Result<T, Error>` with `Error::Api(String)` (exchange/host error, message from `GetLastError`), `Error::Stopped` (host stopped the robot) and `Error::Eot` (backtest reached its end). In a backtest the end of data unwinds out of your `loop` on its own and `onexit` runs; do not wrap API calls in `catch_unwind`.
- **Build time:** `check_strategy` for `rust` compiles on the build cluster and takes a while; starting a robot compiles for that node (an old docker fails with "not support, please update docker").

## Parameters

Declared when saving (`save_strategy.args`): `[[name, label, description, default], ...]`. Each becomes a module-scope `pub const` typed by the value, glob-imported into your code, so refer to it by name (also reachable as `args::Name`). Values come from the robot's or backtest's `args`.

| Parameter kind | Rust type | Notes |
|---|---|---|
| number | `f64` | even `1` is `f64`; compare with `5.0`, cast for indices: `N as usize`, `N as i64` |
| boolean | `bool` | |
| string / password | `&str` | pass straight to the API; it is not `String` |
| encrypted string | `Decrypted` (derefs to `str`) | use `&*Key` where a `&str` is needed; decrypted lazily on first use |
| dropdown, single | `f64` \| `bool` \| `&str` | by the selected option's value type (index is `f64`) |
| dropdown, multiple | `&[i64]` \| `&[f64]` \| `&[&str]` | all-int / any-decimal / all-string selections |
| anything else | `&str` | the raw JSON text; parse it with `JSONParse` |

Unset optional controls get the zero value of the same type (`0.0`, `""`, `false`, `&[]`). `params()` returns the whole set as JSON text (`&'static str`). Defining your own item with a parameter's name shadows the UI value silently.

## Exchange API

`exchange` is the first configured account; `exchanges[i]`, `exchanges.len()`, `exchanges.iter()` reach the others (a static `Vec<Exchange>`). Any `symbol` argument is `impl Into<Option<&str>>`: pass `None` or `""` for the configured pair, `"ETH_USDT"` for another, `"BTC_USDT.swap"` for a futures contract; for a `String` pass `s.as_str()`. Prices/amounts are `impl ToF64`, so `-1`, `100` and `0.01` all work.

| Call | Returns | Notes |
|---|---|---|
| `exchange.GetTicker(sym)` | `Result<Ticker>` | `Last, Buy (bid), Sell (ask), High, Low, Open, Volume, OpenInterest, Time` (ms), `Info: JsonValue` |
| `exchange.GetDepth(sym)` | `Result<Depth>` | `Asks: Vec<MarketOrder{Price, Amount}>` ascending, `Bids` descending; `Asks[0]` best ask |
| `exchange.GetTrades(sym)` | `Result<Vec<Trade>>` | recent public trades `{Id, Time, Price, Amount, Type}` |
| `exchange.GetRecords(sym, period, limit)` | `Result<Vec<Record>>` | all three optional (`None`); `period` in **seconds** (`PERIOD_M1 … PERIOD_W1`, or `60 * 2`), default = robot period; `limit` 0/None = all cached bars. `Record{Time(ms), Open, High, Low, Close, Volume}`; the series accumulates across calls up to `SetMaxBarLen` (default 500) |
| `exchange.GetTickers()` | `Result<Vec<Ticker>>` | every market |
| `exchange.GetMarkets()` | `BTreeMap<String, Market>` | plain map; `Market{TickSize, AmountSize, PricePrecision, AmountPrecision, MinQty, MinNotional, CtVal, ...}` |
| `exchange.GetAccount()` | `Result<Account>` | `Balance, FrozenBalance` (quote; futures: available margin), `Stocks, FrozenStocks` (base), `Equity, UPnL` (futures, best-effort) |
| `exchange.GetAssets()` | `Result<Vec<Asset>>` | per-currency `{Currency, Amount, FrozenAmount}` |
| `exchange.CreateOrder(sym, side, price, amount)` | `Result<OrderId>` | **preferred order call.** `side`: spot `"buy"`/`"sell"`; futures `"buy"` open long, `"sell"` open short, `"closebuy"` close long, `"closesell"` close short. `price` `-1` = market order. Exchange extras via `"buy;{\"type\":\"...\"}"` |
| `exchange.Buy(price, amount)` / `Sell(price, amount)` | `Result<OrderId>` | same as `CreateOrder("", "buy"/"sell", ...)`; on futures they need `SetDirection` first, so prefer `CreateOrder` |
| `exchange.GetOrders(sym)` / `GetOrder(&id)` / `CancelOrder(&id)` | `Result<Vec<Order>>` / `Result<Order>` / `Result<()>` | open orders / one order / cancel. `Order{Id, Price, Amount, DealAmount, AvgPrice, Type, Status, Offset, ContractType, Info}` |
| `exchange.GetHistoryOrders(sym, since, limit)` | `Result<Vec<Order>>` | finished orders; `since`/`limit` optional |
| `exchange.ModifyOrder(&id, side, price, amount)` | `Result<OrderId>` | amend; `side` required |
| `exchange.GetPositions(sym)` | `Result<Vec<Position>>` | futures; `{Amount, FrozenAmount, Price, Profit, Margin, MarginLevel, Type (PD_LONG/PD_SHORT), Symbol, ContractType}`. Empty Vec = flat. (JS name `GetPosition` does not exist here) |
| `exchange.SetContractType("swap")` | `Result<String>` | futures: `"swap"`, `"quarter"`, `"this_week"`, ...; call before trading |
| `exchange.SetMarginLevel(10)` | `()` | leverage |
| `exchange.SetDirection("buy")` | `Result<String>` | legacy; only needed for `Buy`/`Sell` on futures |
| `exchange.CreateConditionOrder(sym, side, amount, &cond)` | `Result<OrderId>` | `cond = OrderCondition{ConditionType: ORDER_CONDITION_TYPE_SL, SlTriggerPrice, SlOrderPrice, ..Default::default()}`; also `GetConditionOrders`, `GetConditionOrder`, `ModifyConditionOrder`, `CancelConditionOrder` |
| `exchange.SetCurrency("ETH_USDT")` | `()` | switch pair; `GetCurrency()`, `GetBaseCurrency()`, `GetQuoteCurrency()` → `String` |
| `exchange.GetName()`, `GetLabel()`, `GetContractType()` | `String` | id (`"Binance"`, `"Futures_Binance"`), account label, contract |
| `exchange.GetPeriod()` | `i64` | configured K-line period in seconds |
| `exchange.IO(args)` | `Result<String>` | raw passthrough, args as a tuple: `exchange.IO(("api", "GET", "/api/v3/time", ""))`, `exchange.IO(("api", "POST", path, "", body_json))`, `exchange.IO(("currency", "BTC_USDT"))`. Parse the JSON with `JSONParse` |
| `exchange.Go(Go::GetTicker, ()).wait(0)` | `Result<Ticker>` | async call typed by the token (`Go::GetDepth`, `Go::GetAccount`, `Go::GetRecords`, `Go::CreateOrder`, `Go::CancelOrder` → `bool`, `Go::IO` → `String`, ...). `wait(0)` blocks, `wait(ms)` times out with `Err` and can be waited again. Args tuple follows the `exchange.Go` examples in api.en.md, e.g. `("", "buy", 1000, 0.1)` |
| `exchange.GetFundings(sym)`, `SetPrecision(p, a)`, `SetMaxBarLen(n)`, `SetTimeout(ms)`, `SetProxy(s)`, `SetBase(url)`, `HMAC(...)` | see `references/fmz.rs` | |

**Amount semantics** (same as every FMZ language): spot limit orders and spot market **sell** take the base-currency amount; a spot market **buy** (`price` `-1`) takes the quote-currency amount to spend; futures amounts are contracts. Round with `_N(amount, precision)` and respect `Market.MinQty`/`MinNotional`.

**OrderId** is a struct `{I64: i64, S: String}` (numeric or string id, whichever the exchange uses). Pass it by reference (`&id`), print or persist it with `id.to_string()`, rebuild one from a stored string with `OrderId { S: s.to_string(), ..Default::default() }`.

Safe call patterns (never `unwrap` an exchange call in a live robot):

```rust
fn step() -> Result<()> {                      // `?` works: Result is the SDK alias
    let t = exchange.GetTicker(None)?;
    let acc = exchange.GetAccount()?;
    if acc.Balance > 100.0 {
        let id = exchange.CreateOrder(None, "buy", -1, 100)?;   // spot market buy: 100 USDT
        Log!("buy", id);
    }
    LogStatus!("last", t.Last, "balance", _N(acc.Balance, 2));
    Ok(())
}
fn main() {
    loop {
        if let Err(e) = step() { Log!("step failed:", e); }
        Sleep(2000);
    }
}
```

Other idioms: `match` / `if let Ok(t) = ...` (see `references/selfcheck.rs` throughout), `let Ok(t) = exchange.GetTicker(None) else { Sleep(1000); continue; };`, `.map(|t| t.Last).unwrap_or(0.0)` only where a zero is genuinely harmless, and `_C!(expr)` for transient failures (it loops until `Ok`, sleeping `_CDelay` ms, default 3000 — a permanent error loops forever). `_C!` accepts any expression returning `Result<T, Error>`, including your own functions.

Futures: set the contract (and leverage) once, then trade with `CreateOrder` sides; positions come back as a `Vec`, empty when flat.

```rust
fn main() {
    if let Err(e) = exchange.SetContractType("swap") { Log!("SetContractType:", e); return; }
    exchange.SetMarginLevel(10);
    loop {
        let Ok(positions) = exchange.GetPositions(None) else { Sleep(2000); continue; };
        match positions.iter().find(|p| p.Type == PD_LONG) {
            None => {
                if let Err(e) = exchange.CreateOrder(None, "buy", -1, 1) { Log!("open long failed:", e); }
            }
            Some(p) if p.Profit < -50.0 => {
                if let Err(e) = exchange.CreateOrder(None, "closebuy", -1, p.Amount) { Log!("close failed:", e); }
            }
            Some(p) => LogStatus!("long", p.Amount, "entry", p.Price, "pnl", _N(p.Profit, 2)),
        }
        Sleep(5000);
    }
}
```

Several accounts: `exchanges` is indexable and iterable; `Go` fans calls out concurrently and each `wait` is typed.

```rust
let routines: Vec<_> = exchanges.iter().map(|e| e.Go(Go::GetTicker, ())).collect();
for (e, r) in exchanges.iter().zip(&routines) {
    match r.wait(0) {
        Ok(t) => Log!(e.GetName(), e.GetLabel(), e.GetCurrency(), t.Last),
        Err(err) => Log!(e.GetName(), "ticker failed:", err),
    }
}
```

## Utilities

```rust
Log!("filled", id, "at", _N(price, 2), "#00aa00");    // a "#rrggbb" argument colors the line
Log!("margin call@");                                   // a message ending in @ is also pushed as a notification
let table = format!(
    r#"{{"type":"table","title":"Position","cols":["Symbol","Amount","PnL"],"rows":[["{}",{},{}]]}}"#,
    p.Symbol, p.Amount, _N(p.Profit, 2));               // no JSON serializer: format! + raw string, {{ }} escapes braces
LogStatus!(format!("`{}`", table));                     // backticked JSON in the status bar renders as a table
LogProfit(_N(equity - start_equity, 2));                // plain function, one numeric argument
```

- **Logging (macros, note the `!`):** `Log!(a, b, ...)` and `LogStatus!(...)` take any mix of `ToArg` values: numbers, `&str`/`String`, `bool`, SDK structs and `Vec`s (printed as Rust `{:?}`), `Result` (prints the value or the error), `Error`, `OrderId`, `JsonValue`. `LogStatus!` replaces the status bar each call. Also `LogReset(n)`, `LogProfitReset(n)`, `EnableLog(bool)`, `SetErrorFilter(regex)`. `Panic!(...)` reports and tears the robot down. `exchange.Log(ORDER_TYPE_BUY, price, amount)` draws a simulated-trade marker, it is not logging.
- **Time:** `Sleep(ms)`; `Unix()` seconds, `UnixNano()`; `_D(None)` now, `_D(ms)` formats a **millisecond** timestamp (`_D(record.Time)`, `_D(Unix() * 1000)`) as `YYYY-MM-DD HH:MM:SS`.
- **Numbers:** `_N(x, digits) -> f64` truncates toward zero; `_Cross(&a, &b) -> i64` bars since two series crossed.
- **Persistence:** `_G!("k", v)` stores any `ToArg` (as a string), `_G!("k") -> String` (`""` when absent, parse it back: `_G!("k").parse::<f64>().unwrap_or(0.0)`), `_G!("k", null)` deletes, `_G!()` returns the robot id (`i64`, 0 in backtest). There is no wipe-all form in Rust. Survives restarts.
- **Commands:** `GetCommand(timeout_ms) -> Option<String>`; `0` polls, `< 0` blocks; `None` (treat an empty string the same) means nothing pending; parse `"name:value"` yourself.
- **Runtime:** `IsVirtual()` (true in backtest), `Version()`, `GetOS()`, `GetPid()`, `GetLastError()`, `GetMeta() -> JsonValue`, `UUID()`, `MD5(s)`, `Encode(algo, in_fmt, out_fmt, data, key_fmt, key)`, `exchange.HMAC(algo, out, data, key)`, `Mail(...) -> bool`, `StrDecode(s, "gbk")`.
- **JSON:** `JSONParse(&s) -> Option<JsonValue>`; index with `v["a"]["b"][0]` (never panics, yields `Null`), read with `.as_f64()/.as_i64()/.as_str()/.as_bool()/.as_array()/.as_object()` (all `Option`). Struct `Info` fields are already `JsonValue`. To produce JSON use `format!` with raw strings (`r#"{"a": 1}"#`, `{{ }}` escapes braces) or add `serde_json` via the frontmatter.
- **HTTP:** the return type selects the result: `let body: String = HttpQuery(url, None);` or `let r: HttpRet = HttpQuery(url, None);` (`StatusCode`, `Header`, `Body`). A non-empty second argument is sent as the POST body.
- **WebSocket / sockets:** `let mut c = Dial("wss://...");` then `c.Valid()`, `c.read(timeout_ms) -> String` (`""` = nothing or closed), `c.write(&s, timeout) -> i64`, `c.IsClosed()`, `c.close()`; `Dial::new(addr, timeout_secs)`, `Dial::with_options(addr, json)`. Live only: in a backtest the handle is invalid from the start.
- **Live-only extras:** `DBExec(sql) -> DBResult{columns, values: Vec<Vec<JsonValue>>}`, `conn.exec(sql)` on a `Dial`, `EventLoop(ms) -> JsonValue`, `SetChannelData(s)`/`GetChannelData()`, `LogVacuum()`.
- **Charts:** `let chart = Chart::new(cfg_json);` (Highcharts config as a JSON string; a JSON array of configs makes several charts), `chart.add(series_idx, "[ts_ms, value]", -1)` appends, `chart.update(full_cfg)` **replaces the whole config**, `chart.reset(0)`. `KLineChart::new(r#"{"overlay": true}"#)` is a per-bar Pine-style plotter: for each bar `c.begin(&bar)`, then `c.plot(v, opts_json)`, `c.hline`, `c.plotshape(cond, opts)`, `c.plotchar`, `c.plotarrow`, `c.plotcandle`, `c.barcolor`, `c.bgcolor`, `c.fill(p1, p2, opts)`, `c.signal("buy", price, qty, "")`, finally `c.close()`. Skip bars older than the last one drawn (track its `Time`), as `selfcheck.rs` does.
- **Indicators:** `TA` only — there is **no `talib` module in the Rust SDK**. `TA.MA/SMA/EMA/RSI(&src, period) -> Vec<f64>` where `src` is `&Vec<Record>`/`&[Record]` (uses `Close`) or `&Vec<f64>`/`&[f64]`; `TA.MACD(&r, 12, 26, 9) -> [Vec<f64>; 3]` (DIF, DEA, histogram), `TA.BOLL(&r, 20, 2.0) -> [upper, middle, lower]`, `TA.KDJ(&r, 9, 3, 3)`, `TA.ATR(&r, 14)`, `TA.OBV(&r)`, `TA.Alligator(&r, 13, 8, 5)`, `TA.CMF(&r, 20)`, `TA.Highest(&src, n)`/`Lowest -> f64` (the n bars before the current one). Period arguments accept `None` for the default. Warm-up entries are `NaN`: check `.is_nan()` and `records.len()` before trusting a value; destructure with `let [dif, dea, hist] = TA.MACD(&records, None, None, None);`.

## Pitfalls

- **`unwrap()` is a robot killer.** Every exchange call can fail (network, rate limit, exchange maintenance); `unwrap`/`expect`/`[i]` past the end panic, the panic is logged and the strategy stops with the position it had. Use `match`, `if let`, `?` in a `Result<()>` helper, or `_C!`.
- **No `Sleep` = busy loop** hammering the exchange and the node; 500-5000 ms per iteration is typical. Backtests advance simulated time through `Sleep`.
- **Parameters are `f64`.** `if Period == 5` does not compile (`f64` vs integer); write `5.0`. Indices and counts need `as usize`; `GetRecords` periods and `_D` timestamps need `i64`; `TA` periods need `usize`.
- **`&str` versus `String`.** Parameters and API arguments are `&str`; `GetTicker(my_string)` fails, `GetTicker(my_string.as_str())` works. `Log!` accepts both.
- **OpenSSL crates do not build**, and every crate adds minutes to each compile; `check_strategy` is the slow step, so batch your edits and compile once.
- **Float output.** `Log!` hands `f64` to the host unformatted (full precision); for readable numbers use `_N(x, 2)` or `format!("{:.2}", x)`. `Log!(records)` prints every bar as Debug text; log `records.last()` or a field.
- **`_D` takes milliseconds**, `Unix()` returns seconds. `Record.Time`, `Ticker.Time`, `Order.Time` are already milliseconds.
- **Shadowing.** A `const`, `static` or `fn` with a parameter's name silently replaces the UI value.
- **`OnExit` replaces** the current exit hook, including `fn onexit`.
- **`Chart::update` resets** the chart to the config you pass; keep the full config around.
- **Spot market buy amount is quote currency**; limit orders and market sells are base currency; futures are contracts. Check `exchange.GetName()` starts with `Futures_` before assuming contract semantics.
- **Position checks:** `GetPositions` returns `Ok(vec![])` when flat, not an error; iterate and read `Type` (`PD_LONG`/`PD_SHORT`).
- Backtest and live share code: use `Unix()`/`UnixNano()`, never `std::time::SystemTime`, and gate anything that writes exchange state behind the conditions you really mean (`selfcheck.rs` gates its writes with `IsVirtual()`).

## Save and run (fmz MCP tools)

1. `check_strategy { language: "rust", source }` — compiles on the build cluster; expect it to take a while. Fix every error (line numbers match your file).
2. `save_strategy { language: "rust", name, source, args: [[name, label, description, default], ...] }` → `strategy_id`. Updating: pass `strategy_id` and only changed fields; `save_strategy_version` first if the old code must stay retrievable.
3. `run_backtest { strategy_id | source + language: "rust", begin, end, period, exchanges: [{exchange: "Binance", pair: "BTC_USDT", balance: 10000, stocks: 0}], args }` → `get_backtest { task_id, wait: 60 }` → read `profit`, `max_drawdown`, `orders`, `errors`, `error_lines`; `stop_backtest` to free the slot. The `/*backtest ... */` comment block seen at the top of documentation examples configures backtests started from the website editor (format in the `fmz-backtest` skill); it is an ordinary Rust block comment, so keep the `---` dependency frontmatter above it.
4. Live: `create_robot` (a `[trade]` tool: ask the user first). Starting compiles for the node's OS/arch; `status: "error"` → `get_robot_output`. `send_robot_command` feeds `GetCommand`. Running robots keep the old binary until restarted.

## References

- `references/fmz.rs` — the complete SDK surface as a stub: header comment (lines 1-48) for lifecycle, frontmatter, TLS and the parameter type table; `grep -n "pub fn "` for every signature; `grep -n "pub struct"` for `Ticker`, `Record`, `Depth`, `Account`, `Order`, `OrderId`, `Position`, `Market`, `OrderCondition`, `HttpRet`, `DBResult`; `macro_rules!` for `Log`, `LogStatus`, `Panic`, `_G`, `_C`; `pub mod Go` for async tokens; `impl TAHelper` for indicators; `pub mod prelude` for what is in scope.
- `references/selfcheck.rs` — a known-good strategy that calls the entire API in backtest and live (it is the SDK's default strategy). Copy its `match`/`unwrap_or` handling, the `Go` fan-out over `exchanges`, the `Chart` and `KLineChart` loops, conditional orders and the `IsVirtual()` gating of writes.
- Sibling skills: `fmz-api-reference` (`references/api.en.md`: grep `#### exchange.CreateOrder` etc.; each function has a fenced `rust` example block — the `exchange.Go`, `exchange.IO`, `LogStatus`, `Chart` and `KLineChart` sections are the richest), `fmz-backtest` (backtest configuration and reading results), `fmz-indicators` (talib reference; applies to JS/Python/C++, Rust has `TA` only), `fmz-platform` (MCP tools, conventions and safety rules), `fmz-strategy-javascript` (the same API in JS; useful when porting examples).
