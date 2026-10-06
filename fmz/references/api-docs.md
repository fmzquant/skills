> Part of the `fmz` skill. File paths below are relative to the skill directory (the folder that holds `SKILL.md`).


# FMZ strategy API reference

This skill is a lookup table, not a tutorial. The language skills (`references/javascript.md`, `-python`, `-cpp`, `-rust`) explain how a strategy is built; come here for the authoritative details of one function or structure. The second half is the indicator guide (`TA.*` and `talib.*`) with its own reference tables.

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

## Refreshing

The files are generated by `scripts/build-references.py` in the repository (https://github.com/fmzquant/skills) from the live site; `last generated` date is in the file header. If a function seems missing, check the live syntax guide.
