# Backtest configuration reference

Three layers describe the same run:

1. the **header** (`/*backtest ... */` in the source; what the website form and the local engines read),
2. the **MCP `run_backtest` parameters**,
3. the **engine task JSON** (`Code`, `Exchanges[]`, `Options`) that both of the above are turned into and that `backtest.cpp` reads.

Fee integers: the engine computes `rate = FeeMaker / 10^FeeDenominator`. The MCP tool sends `FeeDenominator: 5` with `percent x 1000` (0.15 % -> 150); the website sends `FeeDenominator: 6` with `percent x 10000` (0.15 % -> 1500). Both yield the same rate.

## Key table

"Website" = value the website form sends by default; "Engine default" = what `backtest.cpp` assumes when the key is absent. `-` = not available on that path.

### Per-run options (`Options`)

| Header key | MCP param | Engine key | Meaning / units | MCP sends | Website default | Engine default |
|---|---|---|---|---|---|---|
| `start` | `begin` | `TimeBegin` | unix **seconds**. Header `YYYY-MM-DD HH:mm:ss` parsed in the browser's local time; MCP accepts ISO or unix and parses as UTC | as given | form | required |
| `end` | `end` | `TimeEnd` | unix seconds, must be > start | as given | form (default yesterday) | required |
| `period` | `period` | `Period` | strategy K-line period, **ms**. Header `Nm/Nh/Nd` or seconds; MCP enum `1m 5m 15m 30m 1h 4h 1d` | 1h | 1d | required |
| - | `net_delay` | `NetDelay` | ms added to the clock per API call | 200 | `btNetDelay` 200 | required |
| `btMaxRuntimeLogs` | - | `MaxRuntimeLogs` | runtime log lines kept | 2000 | 8000 | capped at 10000 |
| `btMaxProfitLogs` | - | `MaxProfitLogs` | `LogProfit` points kept | 800 | 8000 | capped at 10000 |
| `btMaxChartLogs` | - | `MaxChartLogs` | chart data points kept | 0 | 3000 | capped at 10000 |
| - | - | `SnapshotPeriod` | ms between account snapshots | auto: span <= 2 h -> 60 s, <= 2 d -> 5 min, < 30 d -> 1 h, else 1 d | auto (same, `< 20 d` for the hourly step) | required |
| `dataServer` (local JS engine only) | - | `DataServer` | history server | set by the server (`http://q.fmz.com`, reached via the cluster proxy) | site origin | required |
| - | - | `RetFlags` | bitmask of result sections: 1 Status, 2 Symbols, 4 Indicators, 8 Chart, 16 ProfitLogs, 32 RuntimeLogs, 64 CloseProfitLogs, 128 Accounts, 256 Accounts_PnL, 512 Event, 1024 Orders, 2048 FilledOrders | `1|16|32|256` | `1|8|16|32|64|128|256` | required |
| - | - | `UpdatePeriod` | ms between progress callbacks | 5000 | 500 (5000 for Python) | required |
| `args` | `args` | `Code[i][1]` | parameter values: header `[["name", value]]` or `[["name", value, templateId]]`; MCP `{name: value}` or `[[name, value]]` | - | form | - |

### Per-exchange settings (`Exchanges[]`)

| Header key (`exchanges[]`) | MCP param (`exchanges[]`) | Engine key | Meaning / units | MCP sends | Website default | Engine default |
|---|---|---|---|---|---|---|
| `eid` | `exchange` | `Id` (also `Label`, website `Name`) | exchange id from `list_exchanges` | as given | as given | required |
| `currency` | `pair` | `BaseCurrency`, `QuoteCurrency` (website also `Currency`, `DataSource`) | `BASE_QUOTE`; MCP uppercases and appends `_USD` (CTP: `_CNY`) to a single token | split on `_` | market symbol | required |
| `balance` | `balance` | `Balance` | initial quote currency | 10000 | market default | none |
| `stocks` | `stocks` | `Stocks` | initial base currency | 0 | market default | none |
| - | - | `Assets` | `{currency: amount}` initial balances (website sends both `Assets` and `Balance/Stocks`) | - | from pair | none |
| `fee: [maker, taker]` | `fee_maker`, `fee_taker` | `FeeMaker`, `FeeTaker` + `FeeDenominator` | percent | per-exchange table, else 0.2/0.2; `FeeDenominator` 5 | market default; `FeeDenominator` 6 | 0/0 |
| `feeMin` | - | `FeeMin` | minimum fee per fill, quote currency; applied only for CTP and stock ids | 0 | market default or 0 | 0 |
| `basePeriod` | derived from `period` | `BasePeriod` | underlying K-line period, **ms**; ticks are generated from these bars | `1d,4h`->1h, `1h`->30m, `30m`->15m, `15m`->5m, `5m,1m`->1m; BitMEX 15m/30m->5m | = `period` unless set; `1000` in tick mode | required |
| `mode` | - | `Mode` (sent, not read by the engine) | `1` = real-tick mode: website sets `BasePeriod: 1000`, `PreBarLen: 0`, `Trades` | - | 0 | tick mode is detected from the feed (`asks` column) |
| `tradesMode` | - | `Trades` | tick mode only: `"0"` -> `true` (replay real trade prints) | - | `"0"` | false |
| `depthDeep` | - | `DepthDeep` | order-book levels (synthetic in bar mode, requested from the feed in tick mode) | 5 (CTP/XTP: 1) | 20 (form clamps 1-20) | 20 |
| `depthAmount` | - | `DepthAmount` | size shown on each synthetic level | 20 | 200 | 20 |
| `btSlipPoint` | `slippage` | `SlipPoint` | integer price ticks added to each side of the synthetic spread | 0 | 0 | 0 |
| `btFaultTolerant` | - | `FaultTolerant` | failure probability 0..1 for API calls (first call of each kind always fails when > 0) | 0 | 0.5, but only sent for the "fault-tolerant test" run, else 0 | 0 |
| `btMaxBarLen` | - | `MaxBarLen` | cap on bars returned by the first `GetRecords()` | not sent | 300 (100-5000) | 1000 |
| - | - | `PreBarLen` | bars of history fetched before `start` (also used to back-fill short series) | 1000 | `MaxBarLen - 1` (0 in tick mode) | 200 |
| `feeder` | - | `Feeder` | `"local"` or a custom data-source URL | - | `"local"` | `"local"` |
| - | - | `MatchVol` | tick mode: queue simulation for orders resting at best bid/ask | - | - | true |
| - | - | `TimezoneOffset` | ms offset used to align bars of 1 day or longer | not sent | 0 unless the market defines one | 28800000 (UTC+8) |
| - | - | `MarginCurrency` | futures margin currency; equal to quote = USDT-margined, equal to base = coin-margined | not sent | from market | = quote currency |
| `quotePrecision`, `basePrecision` | - | `QuotePrecision`, `BasePrecision` | sent by the website; precision actually comes from the market detail | - | 2 / 2 | not read |
| `btHistoryMode`, `btOrder`, `logEvent`, `btConcurrentMax` | - | - | website form fields (history mode, order mode, event logging, optimisation threads); no engine key in these sources | - | `"0"`, `"0"`, false, CPU count | - |

### Fee defaults by exchange (maker / taker, percent)

| eid | maker | taker |
|---|---|---|
| Huobi, OKX, Binance | 0.15 | 0.2 |
| Futures_BitMEX | 0.008 | 0.01 |
| Futures_OKX, Futures_HuobiDM | 0.03 | 0.03 |
| Futures_CTP | 0.025 | 0.025 |
| Futures_XTP | 0.03 | 0.13 |
| any other id | 0.2 | 0.2 |

The same table is used by the MCP tool and by the local JavaScript engine (`worker.js`); the website takes defaults from each market's detail instead.

## Examples

Each example shows the header, the equivalent MCP call, and what the strategy has to do.

### Spot (Binance BTC_USDT, 1h bars, 30-minute base)

```javascript
/*backtest
start: 2024-01-01 00:00:00
end: 2024-03-01 00:00:00
period: 1h
basePeriod: 30m
exchanges: [{"eid":"Binance","currency":"BTC_USDT","balance":10000,"stocks":0,"fee":[0.1,0.1]}]
*/
```

```json
{"begin":"2024-01-01","end":"2024-03-01","period":"1h",
 "exchanges":[{"exchange":"Binance","pair":"BTC_USDT","balance":10000,"stocks":0,"fee_maker":0.1,"fee_taker":0.1}]}
```

Strategy: `exchange.GetTicker()`, `exchange.Buy(price, amount)` etc. work directly. A spot market buy (`exchange.Buy(-1, quoteAmount)`) spends quote currency.

### USDT-margined perpetual (Futures_Binance BTC_USDT.swap)

```javascript
/*backtest
start: 2024-01-01 00:00:00
end: 2024-02-01 00:00:00
period: 15m
basePeriod: 5m
exchanges: [{"eid":"Futures_Binance","currency":"BTC_USDT","balance":5000}]
*/
function main() {
    exchange.SetContractType("swap")      // required before any market or trade call
    exchange.SetMarginLevel(10)           // leverage; margin = notional / level
    exchange.SetDirection("buy")          // then exchange.Buy(price, contracts)
    ...
}
```

```json
{"begin":"2024-01-01","end":"2024-02-01","period":"15m",
 "exchanges":[{"exchange":"Futures_Binance","pair":"BTC_USDT","balance":5000}]}
```

The margin currency equals the quote currency (USDT), so notional is `price x amount x multiplier` and funding is deducted when the feed provides it. Passing `"BTC_USDT.swap"` as the `symbol` argument of `GetRecords`/`GetTicker`/`CreateOrder` is the alternative to `SetContractType`.

### Coin-margined futures (Futures_OKX BTC_USD, quarterly)

```javascript
/*backtest
start: 2023-10-01 00:00:00
end: 2023-12-20 00:00:00
period: 1h
basePeriod: 15m
exchanges: [{"eid":"Futures_OKX","currency":"BTC_USD","stocks":1}]
*/
function main() {
    exchange.SetContractType("quarter")   // or "this_week", "next_week", "next_quarter", "swap"
    ...
}
```

```json
{"begin":"2023-10-01","end":"2023-12-20","period":"1h",
 "exchanges":[{"exchange":"Futures_OKX","pair":"BTC_USD","balance":0,"stocks":1}]}
```

Here the margin currency is the base coin: fund `stocks` (BTC), not `balance`; contract value is `amount x multiplier / price` in BTC. The MCP tool keeps `balance` at its default 10000 unless you pass 0, which only matters if the strategy reads the quote balance.

### Multiple exchanges (cross-exchange, `exchanges[0]`, `exchanges[1]`)

```javascript
/*backtest
start: 2024-01-01 00:00:00
end: 2024-01-15 00:00:00
period: 5m
basePeriod: 1m
exchanges: [{"eid":"Binance","currency":"BTC_USDT","balance":10000},
            {"eid":"OKX","currency":"BTC_USDT","balance":10000,"fee":[0.08,0.1]}]
*/
function main() {
    var a = exchanges[0].GetTicker(), b = exchanges[1].GetTicker()
    ...
}
```

```json
{"begin":"2024-01-01","end":"2024-01-15","period":"5m",
 "exchanges":[{"exchange":"Binance","pair":"BTC_USDT","balance":10000},
              {"exchange":"OKX","pair":"BTC_USDT","balance":10000,"fee_maker":0.08,"fee_taker":0.1}]}
```

Each exchange has its own simulated account, fee schedule and feed; `exchange` is `exchanges[0]`. The clock is shared, so a call on one exchange also advances time for the other.

### Real-tick mode (website only)

```javascript
/*backtest
start: 2025-04-01 08:00:00
end: 2025-04-18 00:00:00
period: 1m
exchanges: [{"eid":"Binance","currency":"BTC_USDT","balance":1000000,"depthDeep":5,"tradesMode":"1"}]
mode: 1
*/
```

`basePeriod` is omitted (the website sends `BasePeriod: 1000`). Lower `depthDeep` and set `tradesMode: "1"` (no trade prints) to fit longer ranges into the 50 MB data limit.

### Engine task JSON (what both paths send)

```json
{
  "Code": [[<templateId>, [], "<template name>"], ["<source or strategyId>", [["name", value]], "main"]],
  "Exchanges": [{
    "Id": "Binance", "Label": "Binance", "BaseCurrency": "BTC", "QuoteCurrency": "USDT",
    "Balance": 10000, "Stocks": 0, "BasePeriod": 1800000,
    "DepthDeep": 5, "DepthAmount": 20, "PreBarLen": 1000, "FaultTolerant": 0,
    "FeeDenominator": 5, "FeeMaker": 150, "FeeTaker": 200, "FeeMin": 0, "SlipPoint": 0
  }],
  "Options": {
    "DataServer": "http://q.fmz.com", "TimeBegin": 1704067200, "TimeEnd": 1709251200,
    "Period": 3600000, "RetFlags": 305, "MaxRuntimeLogs": 2000, "MaxProfitLogs": 800, "MaxChartLogs": 0,
    "SnapshotPeriod": 86400000, "NetDelay": 200, "UpdatePeriod": 5000
  }
}
```

This is exactly what `run_backtest` builds for the spot example; the website adds `Name`, `Assets`, `MaxBarLen`, `Mode`, `Trades`, `Feeder`, `DataSource`, `TimezoneOffset`, `MarginCurrency`, `QuotePrecision`, `BasePrecision`, `Period` and `Currency` to each exchange entry.
