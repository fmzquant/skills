> Part of the `fmz` skill. File paths below are relative to the skill directory (the folder that holds `SKILL.md`).


# FMZ strategy API reference

This skill is a lookup table, not a tutorial. The language skills (`references/javascript.md`, `references/python.md`, `references/rust.md`) explain how a strategy is built; come here for the authoritative details of one function or structure. The second half is the indicator guide (`TA.*` and `talib.*`) with its own reference tables.

## Files

- `references/api.en.md` — English, ~1 MB. Generated from the platform's syntax guide (https://www.fmz.com/syntax-guide).
- `references/api.zh.md` — the same in Chinese (https://www.fmz.com/syntax-guide in zh-CN).
- `references/ta.md` — exact `TA.*` reference (signature, inputs, outputs, edge behaviour) extracted from the engine source.
- `references/talib.md` — generated table of all 151 `talib.*` functions (name, description, 中文, which record fields it reads, parameter defaults, outputs).

Each function entry has: the syntax line(s), description, parameters (name, type, required/optional, meaning), return value, examples (one code block per language, tagged ```javascript / ```python / ```rust), remarks (backtest differences), a generated line "Exchanges that do not support this function: ..." where it applies, and "See also". What differs between exchanges (names, configuration, contract codes, exchange-specific `exchange.IO` commands, margin/account modes, unsupported functions) is not on the function pages: it is in the `## Exchanges` chapter, one page per brand. What is common to all functions (how `symbol` is written, query ranges, what a failed or unsupported call returns) is in `## Conventions`.

## How to use it

Do not read the whole file. Grep for the heading:

```
grep -n "^#### exchange.GetTicker$" references/api.en.md     # function
grep -n "^### Ticker$" references/api.en.md                   # structure (Structures are ### headings)
grep -n "^#### PERIOD_H1$" references/api.en.md               # constant
```

then read ~100 lines from that line. Function headings are `####` under a `###` category (`talib.*` functions are `#####` under their family, e.g. `grep -n "^##### talib.ATR$"`); structures are `###` under `## Structures`; constants are `####` under `## Built-in Variables`.

Exchange-specific questions (does exchange X support `GetTickers`, which contract codes does it take, how to switch margin mode, its own `IO` commands, demo trading):

```
grep -n "^### Capability Matrix$" references/api.en.md        # every function / trading-mode command x every exchange
grep -n "^#### Binance$" references/api.en.md                 # one brand page (spot + futures objects together)
grep -n "Futures_OKX" references/api.en.md | head            # by exchange.GetName(): the Names table at the top of ## Exchanges links name -> brand
```

Brand pages are `####` under a group `###` (Centralized Exchanges, Decentralized Exchanges (DEX), Prediction Markets, Securities and Futures, On-chain & Custom); the brand heading is the display name (`OKX`, `HTX`, `KuCoin`, `Gate`, `Hyperliquid`, `Uniswap`, `Polymarket`, `Futu Securities`, `Interactive Brokers`, `General Protocol`, `Web3`, ...). Each page has bold sub-sections: Names, Configuration, Trading Pairs and Contract Codes, Exchange-specific IO Commands, unsupported functions, margin/account/simulation, notes. The DEX and on-chain pages `Uniswap`, `Jupiter` and `Web3` carry their `exchange.IO("<command>", ...)` entries as `#####` headings; the same command name can appear under several brands (`"route"` under Uniswap and Jupiter), so read inside the brand's range, e.g. `awk '/^#### Uniswap$/,/^#### Jupiter$/' references/api.en.md`.

Common ground for all functions:

```
grep -n "^### Symbols$" references/api.en.md                  # symbol notation: pairs, contracts, options, native codes, query ranges
grep -n "^### Failures and null values$" references/api.en.md # failed call -> null, unsupported -> error + null, programming errors throw
```

In `references/api.zh.md` the same headings are Chinese: `## 通用约定` (`### 品种代码`, `### 失败与空值`), `## 交易所` (`### 能力矩阵`, groups `### 中心化交易所` / `### 去中心化交易所` / `### 预测市场` / `### 证券与期货` / `### 链上与自定义接入`, brand pages such as `#### 币安`, `#### 火币`, `#### 库币`, `#### OKX`, `#### 富途证券`, `#### 通用协议`).

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
### IO          exchange.IO, exchange.IO("api" | "currency" | "base" | "rate", ...), exchange.IO(mode, value)   (per-exchange IO commands: the brand pages under ## Exchanges)
### Network     HttpQuery, HttpQuery_Go, Dial, Mail, Mail_Go
### Storage     _G, DBExec, SetChannelData, GetChannelData
### Threads     exchange.Go, EventLoop, ctx.subscribe, ctx.poll, ctx.book, threading, Thread, ThreadLock, ThreadEvent, ThreadCondition, ThreadDict, Server (threading.Serve)
### TA          TA.MACD, KDJ, RSI, ATR, OBV, MA, EMA, BOLL, Alligator, CMF, Highest, Lowest, SMA
### Talib       talib.* by family (#### OverlapStudies, MomentumIndicators, ..., PatternRecognition), each function a ##### heading
### OS          os, File, ListFilesResult, FileStat
## Structures   Ticker, Depth, OrderBook, Trade, Record, Market, Order, Condition, Account, Asset, Position, Funding, Other Structures (HttpQuery options/return, LogStatus table/buttons, Chart/KLineChart options, SetData data, EventLoop/exchange.Go/DBExec/Dial/Thread.join returns)
## Built-in Variables   exchange/exchanges, ORDER_STATE_*, ORDER_TYPE_*, ORDER_CONDITION_TYPE_*, PD_LONG/PD_SHORT, ORDER_OFFSET_*, PERIOD_*, LOG_TYPE_*
## Conventions
### Symbols                   #### Omitting symbol, Trading pairs, Contracts, Options, Native codes, Query ranges
### Failures and null values  #### Failed calls return a null value, Unsupported functions, Programming errors throw, Pattern
## Exchanges     Names table (exchange.GetName() -> brand, type, aliases)
### Capability Matrix
### Centralized Exchanges           #### AscendEx, Backpack, BigONE, Binance, Bitfinex, bitFlyer, Bitget, Bithumb, Bitstamp, Bybit, Coincheck, Coinone, CoinW, Crypto.com, DeepCoin, Deribit, DigiFinex, Gate, Gemini, HashKey, HitBTC, HTX, Korbit, Kraken, KuCoin, LBank, MEXC, OKX, Poloniex, Upbit, WEEX, WOO X, Zaif
### Decentralized Exchanges (DEX)   #### Hyperliquid, Lighter, edgeX, Aster, Aevo, WOOFi Pro, Uniswap (##### its IO commands), Jupiter (##### its IO commands), KyberSwap, 1inch, OKX DEX
### Prediction Markets              #### Polymarket
### Securities and Futures          #### Futu Securities, Interactive Brokers
### On-chain & Custom               #### General Protocol, Web3 (##### exchange.IO("abi" | "api" | "encode" | "call" | "multicall" | "logs" | "waitReceipt" | "nonce" | "uniswapV3" | ..., ...))
```

Structures are `###` headings directly under `## Structures` (e.g. `grep -n "^### Order$"`); constants are `####` under their `###` family.

## Reading tips

- "returns null / None / an error on failure" is spelled out per function in the *Returns* line; always check before using a result.
- Examples show the real calling convention per language: JS `exchange.GetTicker()`, Python `exchange.GetTicker()` with dict results, Rust `exchange.GetTicker(None)` returning `Result`/`Option`.
- Remarks say how the backtester simulates a call; the generated "Exchanges that do not support this function" line names the exchange objects (`exchange.GetName()` values, e.g. `OneInch` for the 1inch page, `Exchange` for General Protocol) where it fails; its "see `Capabilities`" means `### Capability Matrix`. For anything finer (partial support, fallbacks, required IO mode) read the brand page and `### Capability Matrix`; read them before relying on `High`/`Low`, `Info`, funding or option data.
- Contract codes: `exchange.SetContractType` documents only the generic codes (`swap`, `quarter`, ...); each exchange's own contract, delivery and option codes are on its brand page (Trading Pairs and Contract Codes) and the notation itself in `### Symbols`.
- `{@...}` cross-references from the website were converted to plain backtick names; grep them the same way.
- Image links point at https://www.fmz.com/upload/...; they are screenshots, not needed for code.

## Refreshing

The files are generated by `scripts/build-references.py` in the repository (https://github.com/fmzquant/skills), from the site's doc data or from the merged doc-tree JSON it is built from. If a function seems missing, check the live syntax guide.
