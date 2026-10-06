---
name: fmz-backtest
description: "Runs and interprets FMZ Quant backtests. Covers the cloud task model (run_backtest, get_backtest with wait, stop_backtest, concurrency slots), the two ways to configure a run (MCP run_backtest parameters, or the /*backtest ... */ header comment the website reads), every config key with units and defaults (period and base period, balance/stocks, fees in percent, slippage, network delay, fault tolerance, depth, bar limits), exchange eid and pair/contract naming, how the engine simulates fills, fees, latency and tick vs bar data, what a strategy sees under IsVirtual() (virtual clock, pre-fetched records, no real IO), how to read profit, drawdown, orders and error_lines, custom data via exchange.SetData, and the common failure messages. Use when starting, configuring, debugging or interpreting a backtest of an FMZ strategy, or when strategy code must behave differently in a backtest."
---

# FMZ backtesting

The backtest engine is one C++ program (`backtest.cpp`), compiled to WebAssembly for in-browser runs of JavaScript/C++/Rust strategies and run natively on a node for Python and for cloud runs. It replays history with a virtual clock and a simulated account per exchange. Everything below is what that engine, the MCP tools and the website form actually do; `references/config.md` has the full key table and worked configurations.

## 1. How a cloud backtest runs (MCP)

1. `run_backtest` submits a task to the cloud cluster and returns `task_id` immediately.
2. `get_backtest(task_id, wait)` returns progress or the result. `wait` (0-60 s) blocks on the server, polling every 2 s, so one call per minute is enough. While running it returns `{status:"running", progress, elapsed_ms, logs_count}`.
3. `stop_backtest(task_id)` stops a running task or discards a finished one. Call it once you have read the result: a task holds one of the account's concurrency slots while running **and after finishing until it is collected or stopped**. Results are kept only a few minutes after completion; afterwards `get_backtest` says `not found`.
4. `list_backtests` lists the tasks still holding a slot (`task_id`, `started`). Use it with `stop_backtest` when `run_backtest` says too many are running.

`run_backtest` takes either `strategy_id` (own, rented or public; its templates are attached automatically and `args` override saved parameter values) or `source` + `language` (raw code). Supported strategy languages on the platform: JavaScript, TypeScript, Python, C++, Rust, Pine, My language, Blockly, Workflow; the tool's `language` enum lists what it accepts.

## 2. Configuring a run

### 2a. MCP `run_backtest` parameters

| Param | Meaning | Default |
|---|---|---|
| `begin`, `end` | ISO date (`2024-01-01`, `2024-01-01 08:00:00`, `2024-01-01T08:00:00Z`) or unix seconds/ms; parsed as **UTC**; `end` must be after `begin` | required |
| `period` | K-line period the strategy sees from `GetRecords()`: `1m 5m 15m 30m 1h 4h 1d` | `1h` |
| `exchanges[]` | `{exchange, pair, balance, stocks, fee_maker, fee_taker}`; `exchange` = `eid` from `list_exchanges` | required |
| `exchanges[].balance` | initial quote-currency balance | 10000 |
| `exchanges[].stocks` | initial base-currency balance | 0 |
| `exchanges[].fee_maker/fee_taker` | fees in **percent** | per-exchange table below, else 0.2/0.2 |
| `net_delay` | simulated latency added to the virtual clock on every API call, ms | 200 |
| `slippage` | slip points per order, in **price ticks** added to the synthetic spread | 0 |
| `args` | strategy parameters, `{name: value}` or `[[name, value], ...]` | saved values |

Fee defaults (maker/taker, %): Huobi, OKX, Binance 0.15/0.2; Futures_BitMEX 0.008/0.01; Futures_OKX and Futures_HuobiDM 0.03/0.03; Futures_CTP 0.025/0.025; Futures_XTP 0.03/0.13; anything else 0.2/0.2.

The underlying ("base") K-line period is derived from `period`: `1d`/`4h` -> 1h, `1h` -> 30m, `30m` -> 15m, `15m` -> 5m, `5m` and `1m` -> 1m (Futures_BitMEX: 15m/30m base becomes 5m). The MCP path always runs the **simulated-tick (bar) mode**; real-tick mode is only available from the website.

### 2b. The `/*backtest ... */` header (website and local engines)

The website's editor reads a comment block at the top of the source and fills the backtest form from it (the "Save backtest settings" button writes it; the code lens above the block re-syncs the form after you edit it). Keys are one per line, `key: value`, whitespace trimmed, `exchanges` is JSON:

```javascript
/*backtest
start: 2021-06-26 00:00:00
end: 2021-09-23 00:00:00
period: 1d
basePeriod: 1h
exchanges: [{"eid":"Binance","currency":"BTC_USDT","balance":10000,"stocks":0}]
args: [["fast",5],["slow",20]]
*/
```

Python uses `'''backtest ... '''`; Rust, C++, TypeScript and JavaScript use `/*backtest ... */` (the block is the language's comment start followed immediately by the word `backtest`).

| Key | Value format | Notes |
|---|---|---|
| `start`, `end` | `YYYY-MM-DD HH:mm:ss` | parsed by the browser (local time) |
| `period` | `Nm`, `Nh`, `Nd`, or plain seconds | strategy K-line period; website default 1d |
| `basePeriod` | same format | underlying K-line period used to generate ticks; defaults to `period` when absent; ignored when `mode: 1` |
| `mode` | `1` | real-tick mode (omit for simulated-tick mode) |
| `exchanges` | JSON array of `{eid, currency, balance, stocks, fee:[maker,taker], feeMin, feeder, tradesMode, depthDeep, depthAmount, quotePrecision, basePrecision}` | `currency` is `BASE_QUOTE`; `fee` in percent; only `eid` and `currency` are required |
| `args` | JSON `[["name", value], ["name", value, templateId]]` | third element targets a template's parameter |

"Save backtest settings" also appends website-form keys (`btSlipPoint`, `btNetDelay`, `btMaxBarLen`, `btDepthDeep`, `btFaultTolerant`, `btMaxRuntimeLogs`, ...) when they differ from the defaults; the sync handler visibly applies `start/end/period/basePeriod/mode/exchanges/args`, so treat the `bt*` lines as a record of the form rather than something to hand-edit.

The open-source local engines (`backtest_python`: `VCtx(__doc__)`, `backtest_javascript`) read the same header. The bundled JavaScript parser (`worker.js` `VCtx`) also accepts `dataServer`, and converts an `h` suffix with a wrong factor (`360000` ms), so prefer minute values (`60m`) there.

## 3. Exchanges, pairs and contracts

- `eid` names come from `list_exchanges`: spot ids like `Binance`, `OKX`, `Huobi`, `Bitfinex`; futures ids are prefixed `Futures_` (`Futures_Binance`, `Futures_OKX`, `Futures_HuobiDM`, `Futures_BitMEX`, `Futures_CTP`, `Futures_XTP`, `Futures_Futu`).
- Pair is `BASE_QUOTE`, upper case (`BTC_USDT`). The MCP tool uppercases it and, if there is no `_`, appends `_USD`.
- Crypto futures: the pair is the **margin pair** (`BTC_USDT` for USDT-margined, `BTC_USD` for coin-margined). The contract is chosen in the strategy with `exchange.SetContractType("swap" | "this_week" | "next_week" | "quarter" | "next_quarter")`, or by passing a full symbol such as `BTC_USDT.swap` to `GetRecords/GetTicker`. Until a contract is set, the engine raises `symbol BTC_USDT not set contract on Futures_Binance`. Do not put `.swap` into the MCP `pair` (it is split on `_`).
- Futu (`Futures_Futu`) supports daily data only, with `currency: "STOCK"` and `exchange.SetContractType("TLSA.US")`-style codes.
- Data server: `https://q.fmz.com`. No data for the pair in the date range -> the task ends with a symbol-not-found error (see section 7).

## 4. The simulation model (what the engine does)

- **Data**: on first use of a symbol the engine fetches one history feed for the whole range at the base period, starting `min(PreBarLen, 3000) x period` before `start` (capped at 10000 base bars) so the first `GetRecords()` already has history. If the feed carries `asks/bids` columns it is **tick mode** (real order-book snapshots, optional real trades); otherwise each base bar is expanded into 2-14 synthetic ticks along the bar's open -> low/high -> close path, with the bar's volume spread across them. Simulated mode therefore gives at most ~12-14 decision points per base bar; a smaller `basePeriod` is more realistic and slower.
- **Prices**: in bar mode the order book at a tick is `ask = close + priceTick + slipTick`, `bid = close - priceTick - slipTick`, with `slipTick = priceTick x SlipPoint`. `GetTicker().Last` is the tick close; `GetDepth()` returns `DepthDeep` synthetic levels spaced by the spread, each with `DepthAmount`. In tick mode real levels are returned (missing sizes filled with `DepthAmount`).
- **Fills**: matching is price-touch and **all-or-nothing** (no partial fills). A market order fills on the current tick at best ask/bid (spot market buy: the amount is quote currency; filled base = `(1 - taker fee) x quote / price`). A limit buy fills when its price `>= ask`, a limit sell when its price `<= bid`, checked on every later tick: if it crosses on the tick it was placed it fills at the market price and pays the **taker** fee; if it rests and is touched by a later tick it fills at its own price and pays the **maker** fee. In tick mode an order sitting exactly at best bid/ask fills only after the queued volume ahead of it is consumed (`MatchVol`).
- **Fees**: `notional x feeMaker/feeTaker`; `FeeMin` (minimum fee per fill) applies to CTP and stock exchanges only. Futures freeze margin `notional / marginLevel` plus fee; perpetual funding is deducted when the feed carries funding data.
- **Latency**: every exchange call (except `SetContractType`) adds `NetDelay` ms to the virtual clock.
- **Fault tolerance** (`FaultTolerant`, 0..1): when > 0, the first call of each API kind fails and later calls fail with that probability; each failure is logged as the error `FaultTolerant Test`. The website offers this as a separate "fault-tolerant test" run (p = 0.5 by default); the MCP path uses 0.

## 5. What the strategy sees in a backtest

- `IsVirtual()` returns `true`. Branch on it for anything that must not run in simulation.
- Time is virtual: `Unix()`, `UnixNano()`, `_D()` read the engine clock, which starts at `start`, advances by `Sleep(ms)` and by `NetDelay` per API call, and is moved to the next tick when the same market function is called again. When the clock passes `end` the engine throws `EOF` (JavaScript string exception / Python `EOFError`-style exception) and the run ends; `onexit()` is not called unless the strategy catches EOF itself. A `while(true)` loop with a short `Sleep` is the normal shape; `Sleep(100)` in tick mode, larger sleeps only cost virtual time.
- `GetRecords()` returns bars of the strategy period, built from the base period. A custom period smaller than `basePeriod` cannot be produced. The first call returns pre-fetched history capped at `MaxBarLen` (engine default 1000; website 100-5000, default 300; the docs' "5000 by default" is the live-trading cap). `SetMaxBarLen(n)` caps the array the JS glue returns. The last element is the forming bar.
- `exchange.GetAccount()`, `GetPosition()`, orders and cancels work against the simulated account. `Order.Info` is empty, `SetPrecision` is ignored (precision comes from the market detail), `GetRawJSON` is live-only, `GetCommand()` returns nothing, `onerror()` is not supported, HTTP/mail/channel features are restricted. `_C()` retries still work and are the right way to survive fault-tolerance failures.
- Logs are capped: MCP runs keep the last 2000 runtime log lines and 800 profit points and no chart data (the website keeps up to 8000/8000/3000; the engine caps at 10000). `Log()`, `LogStatus()`, `LogProfit()` and `exchange.Log()` are all recorded.
- **`profit`, `max_drawdown` and `profit_curve` exist only if the strategy calls `LogProfit(value)`**; the engine does not compute them by itself. Without it, read `final_accounts`.
- Custom data: `exchange.SetData(key, [[ms, value], ...])` loads a time series; `exchange.GetData(key)` returns the entry whose time is the latest `<=` now as `{Time, Data}`. `GetData(url)` GETs a JSON `{"schema":["time","data"],"data":[[ms, value], ...]}`. A custom K-line feed is configured per exchange with `feeder: "http://host/path"` in the header; the engine calls it with `symbol, eid, period (ms), depth, trades, from, to, round=true, detail=true` and expects `{detail:{...}, schema:["time","open","high","low","close","vol"], data:[...]}` (see the user guide's custom data source section).

## 6. Reading results (`get_backtest`)

| Field | Meaning |
|---|---|
| `status` | `done`, `error` (engine `TaskStatus` 2; see `exception`), or `running` |
| `elapsed_ms` | wall time the engine spent |
| `profit` | last `LogProfit` value (quote currency) |
| `max_drawdown` | largest peak-to-trough drop of the `LogProfit` curve, absolute, same unit as `profit` |
| `profit_curve` | ~60 sampled `[iso_time, profit]` points |
| `orders`, `cancels`, `errors`, `log_counts` | counts of runtime log lines by type (`buy sell cancel error profit log restart status`) |
| `error_lines` | first 20 error log lines, `"time text"` |
| `final_accounts` | account snapshot at the end (balances, frozen, PnL) from the last periodic snapshot |
| `status_page` | the last `LogStatus()` text |
| `logs` (detail=`logs`) | last 100 log lines with `time, type, order_id, price, amount, symbol, direction, text` |
| `result` (detail=`full`) | raw engine result: `ProfitLogs [[ms, profit]]`, `RuntimeLogs [[id, ms, type, exchangeIdx, orderId, price, amount, text, symbol, direction]]`, `Snapshots [[ms, [accounts]]]`, `Status`, `Exception`, `Elapsed`, `TaskStatus` |

Workflow: start with `detail=summary`; if `errors > 0` read `error_lines`; if the logic is suspect use `detail=logs`; use `full` only when you need the raw curve or snapshots. Drawdown and profit are in quote-currency units of whatever the strategy logged; the website additionally derives return %, annualised return, Sharpe (daily resampling, 3% risk-free) and max drawdown % from account snapshots.

## 7. Common failures and what they mean

| Message | Cause / fix |
|---|---|
| `end must be after begin`, `time X: use an ISO date or unix seconds` | bad `begin`/`end` |
| `exchanges[i]: exchange and pair are required` | missing `exchange` or `pair` |
| `no backtest node available right now, try again later` | cluster has no free node; retry |
| `strategy not usable for backtest (not owned/rented, or its templates could not be loaded)` | the key's account cannot run that `strategy_id` |
| `too many backtests running for this account` | slots exhausted: `list_backtests`, then `stop_backtest` stale ones |
| `backtest could not start: ...` | engine rejected the task (usually a bad exchange/pair) |
| `backtest task not found (expired, or the server restarted)` / `backtest X not found: it finished more than a few minutes ago, was stopped, or never existed` | result already discarded; run again |
| `backtest failed: ...` | engine-level failure; the text is the engine's message |
| `status: "error"` with `exception` naming the symbol | no history for that pair/exchange/range (wrong `eid`, pair not listed, dates before data begins, CN futures on the wrong data server) |
| `symbol X not set contract on Futures_...` | futures strategy did not call `SetContractType` before market calls |
| many `FaultTolerant Test` error lines | expected in a fault-tolerance run; wrap calls in `_C()` |
| `orders: 0` with no errors | strategy never traded: check the period vs signal logic, the `Sleep` loop, and that `IsVirtual()` branches do not skip trading |
| `data columns length mismatch` | custom feeder returned rows that do not match its `schema` |

## 8. Website-only features (for completeness)

- **Real-tick mode** (`mode: 1`): per-second recorded ticks with depth (1-20 levels) and optional trade prints; up to 50 MB of data per run, so shorten the range or lower depth/disable trades. `GetDepth`/`GetTrades` return real data there.
- **Parameter optimisation**: min/max/step on numeric parameters, run as a grid; concurrency only for JavaScript/Pine/My language.
- **Local engines**: `backtest_python` and `backtest_javascript` on GitHub, driven by the same header; the run ends with an `EOF` exception you catch to print results.
- The result page's CSV downloads (status table, log table) and the Sharpe algorithm are described in the platform user guide ("Backtesting System").
