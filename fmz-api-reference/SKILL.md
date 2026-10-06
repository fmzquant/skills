---
name: fmz-api-reference
description: "The complete FMZ Quant strategy API documentation as greppable markdown — every built-in function (exchange.* market/trade/account/futures calls, Log family, Sleep/_C/_G/_N/_D, Dial, HttpQuery, DBExec, threading, Web3, OS), every structure (Ticker, Record, Order, Account, Position, Depth, Asset, Funding...) and every constant (PERIOD_*, ORDER_STATE_*, ORDER_TYPE_*, PD_*...), with the official examples in JavaScript, Python, C++ and Rust, in English and Chinese — plus the indicator guide: the built-in TA library (TA.MA/EMA/MACD/BOLL/KDJ/RSI/ATR/OBV/Alligator/CMF/Highest/Lowest) and the 151-function talib binding, their exact signatures, return shapes, NaN warm-up behaviour and per-language calling conventions. Use when writing or debugging an FMZ strategy in any language and you need the exact signature, return fields, failure behaviour or an example of a function, or when an indicator returns NaN/null or unexpected shapes."
---

# FMZ strategy API reference

This skill is a lookup table, not a tutorial. The language skills (`fmz-strategy-javascript`, `-python`, `-cpp`, `-rust`) explain how a strategy is built; come here for the authoritative details of one function or structure. The second half is the indicator guide (`TA.*` and `talib.*`) with its own reference tables.

## Files

- `references/api.en.md` — English, ~1 MB. Generated from the platform's syntax guide (https://www.fmz.com/syntax-guide).
- `references/api.zh.md` — the same in Chinese (https://www.fmz.com/syntax-guide in zh-CN).
- `references/ta.md` — exact `TA.*` reference (signature, inputs, outputs, edge behaviour) extracted from the engine source.
- `references/talib.md` — generated table of all 151 `talib.*` functions (name, description, 中文, which record fields it reads, parameter defaults, outputs).

Each entry has: the syntax line(s), description, parameters (name, type, required/optional, meaning), return value, examples (one code block per language, tagged ```javascript / ```python / ```cpp / ```rust), remarks (backtest differences, unsupported exchanges), and "See also".

## How to use it

Do not read the whole file. Grep for the heading:

```
grep -n "^#### exchange.GetTicker$" references/api.en.md     # function
grep -n "^### Ticker$" references/api.en.md                   # structure (Structures are ### headings)
grep -n "^#### PERIOD_H1$" references/api.en.md               # constant
```

then read ~100 lines from that line. Function headings are `####` under a `###` category; structures are `###` under `## Structures`; constants are `####` under `## Built-in Variables`.

## Layout

```
## Built-in Functions
### Global      Version, Sleep, IsVirtual, Mail, Mail_Go, SetErrorFilter, GetPid, GetLastError, GetCommand, GetMeta, Dial, HttpQuery, HttpQuery_Go, Encode, UnixNano, Unix, GetOS, MD5, DBExec, UUID, EventLoop, __Serve, _G, _D, _N, _C, _Cross, JSON.parse, JSON.stringify, SetChannelData, GetChannelData
### Log         Log, LogProfit, LogProfitReset, LogStatus, EnableLog, Chart, KLineChart, LogReset, LogVacuum, console.log, console.error
### Market      exchange.GetTicker, GetDepth, GetTrades, GetRecords, GetPeriod, SetMaxBarLen, GetRawJSON, GetRate, SetData, GetData, GetMarkets, GetTickers
### Trade       exchange.Buy, Sell, CreateOrder, CancelOrder, GetOrder, GetOrders, GetHistoryOrders, CreateConditionOrder, ModifyOrder, ModifyConditionOrder, CancelConditionOrder, GetConditionOrder(s), GetHistoryConditionOrders, SetPrecision, SetRate, IO (with the Spot / Futures exchange notes), Log, Encode, Go
### Account     exchange.GetAccount, GetAssets, GetName, GetLabel, GetCurrency, SetCurrency, GetQuoteCurrency
### Futures     exchange.GetPositions, SetMarginLevel, SetDirection, SetContractType, GetContractType, GetFundings
### NetSettings exchange.SetBase, GetBase, SetProxy, SetTimeout
### Threads     threading, Thread, ThreadLock, ThreadEvent, ThreadCondition, ThreadDict
### Web3        exchange.IO("abi" | "api" | "encode" | "encodePacked" | "decode" | "key" | "sign" | "signTypedData" | "signMessage" | "call" | "multicall" | "logs" | "waitReceipt" | "nonce" | "speedUp" | "cancelTx" | "toUnits" | "fromUnits" | "uniswapV3" | "contracts" | "address" | "base" | "sendBase", ...)
### TA          TA.MACD, KDJ, RSI, ATR, OBV, MA, EMA, BOLL, Alligator, CMF, Highest, Lowest, SMA
### Talib       151 talib.* functions (talib.CDL* patterns, MA/EMA/SMA/RSI/MACD/BBANDS/ATR/ADX/STOCH/...)
### OS          os, File, ListFilesResult, FileStat
## Structures   Trade, Ticker, Record, Order, Condition, OrderBook, Depth, Account, Asset, Position, Market, Funding, OtherStruct (HttpQuery options/return, LogStatus table/buttons, Chart/KLineChart options, SetData data, EventLoop/DBExec/Thread.join returns)
## Built-in Variables   exchange/exchanges, ORDER_STATE_*, ORDER_TYPE_*, ORDER_CONDITION_TYPE_*, PD_LONG/PD_SHORT, ORDER_OFFSET_*, PERIOD_*, LOG_TYPE_*
```

Structures are `###` headings directly under `## Structures` (e.g. `grep -n "^### Order$"`); constants are `####` under their `###` family.

## Reading tips

- "returns null / None / Valid=false on failure" is spelled out per function in the *Returns* line; always check before using a result.
- Examples show the real calling convention per language: JS `exchange.GetTicker()`, Python `exchange.GetTicker()` with dict results, C++ `exchange.GetTicker()` returning a struct with `Valid`, Rust `exchange.GetTicker(None)` returning `Result`/`Option`.
- Remarks list exchanges that do not support a call and how the backtester simulates it; read them before relying on `High`/`Low`, `Info`, funding or option data.
- `{@...}` cross-references from the website were converted to plain backtick names; grep them the same way.
- Image links point at https://www.fmz.com/upload/...; they are screenshots, not needed for code.

## Indicators: `TA.*` and `talib.*`

Two indicator libraries are available inside every strategy without imports (Python needs `import talib` for talib only):

- **`TA`**: 13 commonly used indicators implemented by FMZ (`ta.js`, ported to Python, C++ and Rust). Simple signatures, defaults, K-line or plain-number input. Exact per-function behaviour is in `references/ta.md`.
- **`talib`**: the TA-Lib function set (151 functions). The full generated table (name, description, which record fields it reads, parameter defaults, output arrays) is in `references/talib.md`.

### 1. The input: K-line records

`exchange.GetRecords()` returns an array of `Record` (or null/empty when the request fails; Python raises on API failure):

| Field | Meaning |
|---|---|
| `Time` | bar start, unix **milliseconds** |
| `Open`, `High`, `Low`, `Close` | prices |
| `Volume` | base-currency volume for spot, contracts for futures (quote volume on some exchanges) |
| `OpenInterest` | futures open interest, 0 when not provided |

- `GetRecords()` uses the K-line period set on the robot/backtest form (`exchange.GetPeriod()` seconds); `GetRecords(PERIOD_M15)`, `GetRecords(60*2)` (seconds), `GetRecords("BTC_USDT.swap", PERIOD_H1, 100)` select period, symbol and length. Periods not divisible by 60 s are synthesised from trades.
- Bars accumulate across calls up to `exchange.SetMaxBarLen(n)` (default upper limit 5000 in live trading; oldest bars drop off). `SetMaxBarLen` also sets how many bars the first call returns. Call it once at startup when an indicator needs more than the exchange's single request gives (it can trigger paginated requests).
- **The last element is the bar still forming**; `records[records.length - 2]` is the last closed bar.
- In a backtest the first call returns pre-fetched history (bounded by the backtest's `MaxBarLen`/`PreBarLen`) and a period shorter than the backtest's base period cannot be produced; see the `fmz-backtest` skill.

### 2. `TA.*` at a glance

All functions return a JavaScript array (Python list, C++ `vector<double>`, Rust `Vec<f64>`) **aligned with the input** (`out[i]` belongs to `records[i]`), except `Highest`/`Lowest`, which return one number. Multi-line indicators return an **array of arrays**: `[line0, line1, line2]`.

| Call (defaults) | Input | Returns | First valid index |
|---|---|---|---|
| `TA.MA(r, period=9)` / `TA.SMA(...)` | records or numbers (Close) | `[ma...]` | `period-1` (NaN before) |
| `TA.EMA(r, period=9)` | records or numbers | `[ema...]` | `period-1` |
| `TA.MACD(r, fast=12, slow=26, signal=9)` | records or numbers | `[DIF, DEA, histogram]` (histogram = DIF - DEA) | `slow+signal-2` |
| `TA.BOLL(r, period=20, multiplier=2)` | records or numbers | `[upper, middle, lower]` | `period-1` |
| `TA.KDJ(r, n=9, k=3, d=3)` | **records** (High/Low/Close) | `[K, D, J]` | `n-1` |
| `TA.RSI(r, period=14)` | records or numbers | `[rsi...]` | `period` (all NaN if fewer than `period` bars) |
| `TA.ATR(r, period=14)` | **records** | `[atr...]` | 0 (no NaN; expanding average until `period` bars) |
| `TA.OBV(r)` | **records** (Close/Volume) | `[obv...]` | 0 |
| `TA.Alligator(r, jaw=13, teeth=8, lips=5)` | **records** (median price) | `[jaw, teeth, lips]`, shifted forward by 8/5/3 bars (arrays are longer than `r`) | see `references/ta.md` |
| `TA.CMF(r, periods=20)` | **records** | `[cmf...]` | 0 (expanding window) |
| `TA.Highest(r, n, attr)` / `TA.Lowest(r, n, attr)` | records (+ `attr` = `"High"`, `"Low"`, `"Close"`, `"Open"`, `"Volume"`, `"OpenInterest"`) or numbers (no `attr`) | one number: extreme of the **n bars before the current bar** (`n = 0` -> all previous bars); `NaN` when fewer than 2 elements | - |

Input rule: if `records[0].Close` exists the function uses `Close` of each record; otherwise the array is used as the numeric series. `KDJ`, `ATR`, `OBV`, `Alligator`, `CMF` need real records (`ATR`/`OBV` throw `argument must KLine`). NaN inside the input is skipped when locating the first full window.

### 3. `talib.*`

- Table entries read `NAME(Records[fields], params...) = outputs`. `Records[Close]` means the function reads only `Close`; `Records[High,Low,Close]` means it reads those fields. Outputs are arrays aligned with the input; `[Array(a), Array(b)]` means it returns a list of arrays (JS array of arrays, Python tuple, C++ `array<vector<double>, N>`).
- Defaults are the TA-Lib defaults, e.g. `talib.MA(r)` is a **30-period** SMA, `talib.BBANDS(r)` is period **5**, `talib.RSI(r)` is 14, `talib.MACD(r)` is 12/26/9, `talib.STOCH(r)` is 5/3/0/3/0. Pass explicit periods.
- Multi-output: `talib.MACD` -> `[macd, signal, hist]`; `talib.BBANDS` -> `[upper, middle, lower]`; `talib.STOCH` -> `[slowK, slowD]`; `talib.STOCHF`/`STOCHRSI` -> `[fastK, fastD]`; `talib.AROON` -> `[down, up]`; `talib.MINMAX` -> `[min, max]`.
- `MA Type` parameters (`optInMAType`, `Slow-K MA`, ...) take TA-Lib's integer codes: 0 SMA, 1 EMA, 2 WMA, 3 DEMA, 4 TEMA, 5 TRIMA, 6 KAMA, 7 MAMA, 8 T3 (the FMZ docs only state the default 0; the codes are TA-Lib's).
- Candlestick functions (`CDL*`) return integer arrays: 0 none, +100 bullish, -100 bearish pattern on that bar.
- The leading entries before the lookback window are `NaN` in JavaScript/C++/Rust and `nan` floats in Python.

#### Passing data per language

| Language | `TA` | `talib` |
|---|---|---|
| JavaScript | `TA.MA(records, 20)`, `TA.MA(closes, 20)` | `talib.MA(records, 20)`, `talib.STOCH(records, 9, 3, 0, 3, 0)`, `talib.OBV(records, records)`; a plain number array works where only one price series is read (`talib.ACOS([-1, 0, 1])`) |
| Python | `TA.MA(records, 20)` | `import talib`; pass the field lists: `talib.MA(records.Close, 20)`, `talib.STOCH(records.High, records.Low, records.Close, 9, 3, 0, 3, 0)`, `talib.CDL2CROWS(records.Open, records.High, records.Low, records.Close)` (`records.Close` etc. are provided on the records object); results come back as lists / tuples of lists (see `fmz-strategy-python/references/talib.pyi`) |
| C++ | `TA.MA(r, 20)` with `Records r`; `TA.Highest(r.Close(), 10)` and `TA.Lowest(...)` take a `vector<double>` from `r.Open()/High()/Low()/Close()/Volume()` and have no `attr` parameter; multi-line results are `array<vector<double>, 3>` (`TA.hpp`) | `talib.MA(r, 20)` or `talib.MA(closes, 20, 0)`; every function has a `Records&` overload and a per-field `vector<double>&` overload (`talib.hpp`) |
| Rust | `TA.MA(&records, 20)`; period args are `impl Into<Option<usize>>` so `None` means the default; `MACD/BOLL/KDJ/Alligator` return `[Vec<f64>; 3]` (`let [dif, dea, hist] = TA.MACD(&records, 12, 26, 9);`); `TA.Highest(&closes, 10)` takes a `Vec<f64>`/slice, so extract the field first; `TA.BOLL` multiplier is `f64` (`2.0`) (`fmz-strategy-rust/references/fmz.rs`) | no `talib` binding is listed in the Rust reference; use `TA` or implement the formula |

#### Which library to reach for

- `TA` when the indicator is one of the 13, you want the FMZ defaults (`MA` 9, `BOLL` 20/2, `KDJ` 9/3/3) and identical numbers across JavaScript, Python, C++ and Rust.
- `talib` for everything else (ADX, CCI, SAR, candlestick patterns, regression, Hilbert transforms) and for Python code that already works on `records.Close` lists. `talib` is not listed for Rust.

```rust
// Rust: optional periods are Option, multi-line results destructure
let records = exchange.GetRecords(None, None, None).unwrap();
if records.len() > 34 {
    let [dif, dea, hist] = TA.MACD(&records, 12, 26, 9);
    let i = records.len() - 2;
    if !hist[i].is_nan() && !hist[i - 1].is_nan() && hist[i - 1] <= 0.0 && hist[i] > 0.0 { /* long */ }
}
```

### 4. Reading the latest value safely

```javascript
function signal() {
    var records = exchange.GetRecords()
    if (!records || records.length < 30) { return null }        // enough bars for the slowest window
    var macd = TA.MACD(records, 12, 26, 9)
    var hist = macd[2]
    var i = records.length - 2                                  // last CLOSED bar
    var cur = hist[i], prev = hist[i - 1]
    if (isNaN(cur) || isNaN(prev)) { return null }              // window not full yet
    if (prev <= 0 && cur > 0) { return "long" }
    if (prev >= 0 && cur < 0) { return "short" }
    return null
}
```

```python
import math
def signal():
    records = exchange.GetRecords()
    if not records or len(records) < 30:
        return None
    upper, middle, lower = TA.BOLL(records, 20, 2)
    i = len(records) - 2
    if math.isnan(upper[i]) or math.isnan(lower[i]):
        return None
    close = records[i]["Close"]
    return "long" if close < lower[i] else ("short" if close > upper[i] else None)
```

Rules the examples encode:

1. **Check length first**: `MA/EMA/BOLL/KDJ` need at least `period` bars, `RSI` needs `period + 1`, `MACD` needs `slow + signal - 1`, `Alligator` needs `jaw` bars plus the shift. Prefer `SetMaxBarLen(n)` over hoping the exchange returns enough.
2. **Decide on closed bars**: index `length - 2` for signals; `length - 1` changes every tick until the bar closes. To act once per bar, remember `records[length-1].Time` and act when it changes.
3. **NaN never compares true**: `NaN > 0`, `NaN < 0` and `NaN == NaN` are all false, so a crossover test on an unfilled window silently never fires. Test with `isNaN` / `math.isnan` before comparing.
4. Use the same index into every output array of a multi-line indicator; they are all aligned to `records`.

### 5. Pitfalls

- **Period mismatch**: `TA.MA(exchange.GetRecords(PERIOD_M5), 20)` is a 100-minute average regardless of the form's K-line period. In backtests a requested period smaller than the base period is not available.
- **`TA.MA` vs `talib.MA` defaults** differ (9 vs 30); `talib.BBANDS` default period 5 vs `TA.BOLL` 20.
- **`TA.Highest/Lowest` exclude the current bar** and need `attr` for records in JavaScript/Python (`TA.Highest(records, 20, "High")`); without `attr` the elements are treated as numbers and you get `NaN`/garbage comparisons on objects. `n` larger than the array is clamped to all previous bars.
- **`TA.Alligator` output is longer than the input** (jaw +8, teeth +5, lips +3 leading NaNs): index with `records.length - 1` for the value plotted on the current bar; do not iterate with `zip`-style alignment.
- `TA.KDJ` sets K = D = 50 and RSV = 0 for the first `n-1` bars internally, then overwrites them with NaN; `TA.RSI` returns an all-NaN array when `records.length < period`.
- `TA.ATR`, `TA.OBV`, `TA.CMF` never return NaN but their first values are warm-up artefacts (expanding windows); skip at least `period` bars.
- In backtests every `TA.*` call also reports its name and parameters to the host (used for the indicator chart); it is cheap, but recomputing a 5000-bar indicator on every tick in a `Sleep(0)` loop is the usual cause of slow backtests. Cache per bar.
- C++: `Records` has `Valid`; check `r.Valid && r.size() > n` before computing (`auto r = exchange.GetRecords(); if (r.Valid && r.size() > 9) { auto ema = TA.EMA(r, 9); }`).

## Refreshing

The files are generated by `scripts/build-references.py` in the repository (https://github.com/fmzquant/skills) from the live site; `last generated` date is in the file header. If a function seems missing, check the live syntax guide.
