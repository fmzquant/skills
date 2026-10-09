> Part of the `fmz` skill. File paths below are relative to the skill directory (the folder that holds `SKILL.md`).


# FMZ strategy API reference

This skill is a lookup table, not a tutorial. The language skills (`references/javascript.md`, `references/python.md`, `references/rust.md`) explain how a strategy is built; come here for the authoritative details of one function or structure. The second half is the indicator guide (`TA.*` and `talib.*`) with its own reference tables.

## Files

- `references/api.en.md` — English, ~1 MB. Generated from the platform's syntax guide (https://www.fmz.com/syntax-guide).
- `references/api.zh.md` — the same in Chinese (https://www.fmz.com/syntax-guide in zh-CN).
- `references/ta.md` — exact `TA.*` reference (signature, inputs, outputs, edge behaviour) extracted from the engine source.
- `references/talib.md` — generated table of all 151 `talib.*` functions (name, description, 中文, which record fields it reads, parameter defaults, outputs).

Each entry has: the syntax line(s), description, parameters (name, type, required/optional, meaning), return value, examples (one code block per language, tagged ```javascript / ```python / ```rust), remarks (backtest differences, unsupported exchanges), and "See also".

## How to use it

Do not read the whole file. Grep for the heading:

```
grep -n "^#### exchange.GetTicker$" references/api.en.md     # function
grep -n "^### Ticker$" references/api.en.md                   # structure (Structures are ### headings)
grep -n "^#### PERIOD_H1$" references/api.en.md               # constant
```

then read ~100 lines from that line. Function headings are `####` under a `###` category (`talib.*` functions are `#####` under their family, e.g. `grep -n "^##### talib.ATR$"`); structures are `###` under `## Structures`; constants are `####` under `## Built-in Variables`.

## Layout

```
## Built-in Functions
### Global      Version, IsVirtual, GetOS, GetPid, GetMeta, Sleep, Unix, UnixNano, _D, GetCommand, GetLastError, SetErrorFilter, _N, _C, _Cross, JSON.parse, JSON.stringify, Encode, MD5, UUID
### Log         Log, LogStatus, LogProfit, LogProfitReset, LogReset, LogVacuum, EnableLog, Chart, KLineChart, console.log, console.error, exchange.Log
### Market      exchange.GetTicker, GetTickers, GetDepth, GetTrades, GetRecords, GetMarkets, GetRawJSON, SetData, GetData
### Trade       exchange.Buy, Sell, CreateOrder, ModifyOrder, CancelOrder, GetOrder, GetOrders, GetHistoryOrders, CreateConditionOrder, ModifyConditionOrder, CancelConditionOrder, GetConditionOrder(s), GetHistoryConditionOrders
### Account     exchange.GetAccount, GetAssets
### Futures     exchange.SetContractType, GetContractType, SetDirection, SetMarginLevel, GetPositions, GetFundings
### Exchange    exchange.GetName, GetLabel, GetCurrency, SetCurrency, GetQuoteCurrency, GetPeriod, SetMaxBarLen, SetPrecision, GetRate, SetRate, SetBase, GetBase, SetProxy, SetTimeout, Encode
### IO          exchange.IO, Spot Exchanges, Futures Exchanges, exchange.IO("api" | "currency" | "base" | "rate", ...), exchange.IO(mode, value)
### Network     HttpQuery, HttpQuery_Go, Dial, Mail, Mail_Go
### Storage     _G, DBExec, SetChannelData, GetChannelData
### Threads     exchange.Go, EventLoop, threading, Thread, ThreadLock, ThreadEvent, ThreadCondition, ThreadDict, Server (threading.Serve)
### Web3        exchange.IO("abi" | "api" | "encode" | "encodePacked" | "decode" | "hash" | "key" | "sign" | "signTypedData" | "signMessage" | "call" | "multicall" | "logs" | "waitReceipt" | "nonce" | "speedUp" | "cancelTx" | "toUnits" | "fromUnits" | "uniswapV3" | "contracts" | "address" | "base" | "sendBase", ...)
### Uniswap     exchange.IO("transfer" | "receipt" | "route" | "simulate" | "token" | "wrap" | "unwrap" | "approve" | "slippage" | "deadline" | "gasMultiplier", ...)
### TA          TA.MACD, KDJ, RSI, ATR, OBV, MA, EMA, BOLL, Alligator, CMF, Highest, Lowest, SMA
### Talib       talib.* by family (#### OverlapStudies, MomentumIndicators, ..., PatternRecognition), each function a ##### heading
### OS          os, File, ListFilesResult, FileStat
## Structures   Ticker, Depth, OrderBook, Trade, Record, Market, Order, Condition, Account, Asset, Position, Funding, OtherStruct (HttpQuery options/return, LogStatus table/buttons, Chart/KLineChart options, SetData data, EventLoop/DBExec/Thread.join returns)
## Built-in Variables   exchange/exchanges, ORDER_STATE_*, ORDER_TYPE_*, ORDER_CONDITION_TYPE_*, PD_LONG/PD_SHORT, ORDER_OFFSET_*, PERIOD_*, LOG_TYPE_*
```

Structures are `###` headings directly under `## Structures` (e.g. `grep -n "^### Order$"`); constants are `####` under their `###` family.

## Reading tips

- "returns null / None / an error on failure" is spelled out per function in the *Returns* line; always check before using a result.
- Examples show the real calling convention per language: JS `exchange.GetTicker()`, Python `exchange.GetTicker()` with dict results, Rust `exchange.GetTicker(None)` returning `Result`/`Option`.
- Remarks list exchanges that do not support a call and how the backtester simulates it; read them before relying on `High`/`Low`, `Info`, funding or option data.
- `{@...}` cross-references from the website were converted to plain backtick names; grep them the same way.
- Image links point at https://www.fmz.com/upload/...; they are screenshots, not needed for code.

## Refreshing

The files are generated by `scripts/build-references.py` in the repository (https://github.com/fmzquant/skills) from the live site; `last generated` date is in the file header. If a function seems missing, check the live syntax guide.
