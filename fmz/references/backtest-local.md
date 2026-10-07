> Part of the `fmz` skill. File paths below are relative to the skill directory (the folder that holds `SKILL.md`).

# Local backtesting on your own machine

The platform publishes its backtest engine as a local package, so a JavaScript or Python strategy can be backtested on the machine the agent runs on, in seconds, without a cloud slot. Same engine core, same history data (downloaded from the platform's data server), same result format as the cloud. Use it for the write–run–fix loop and parameter sweeps; use `run_backtest` (cloud) for the confirming run, for Pine / MyLanguage / C++ / Rust, and whenever the user wants the result on the website.

| | Local engine | Cloud (`run_backtest`) |
|---|---|---|
| Languages | Python (works), JavaScript (package currently fails to load on Node 26, see below) | all eight |
| Templates / class libraries | not resolved: paste the template code into the file | attached automatically |
| Speed, measured | 2 weeks of 1h bars (15m base): 0.6 s end to end on a laptop | queue + run + poll, tens of seconds to minutes |
| Limits | none (your CPU) | account concurrency slots |
| Needs | Python 3, `pip`, internet access to the data server (`q.fmz.com`) | an MCP key with `backtest` |
| Result | raw engine JSON (`Join(False)`), pandas frame (`Join(True)`), chart (`Show()`) | `get_backtest` summary / logs / full |

## Python engine

Install once (Windows, Linux, macOS; Python 2 and 3 per the project README, tested here on 3.14):

```bash
pip install https://github.com/fmzquant/backtest_python/archive/master.zip
pip install pandas matplotlib   # only for Join(True) and Show()
```

Source: https://github.com/fmzquant/backtest_python. On first use the package downloads the native engine (`backtest_py_<os>_<arch>.so`) from the data server into a cache directory; later runs are offline except for history data.

A strategy file is the normal FMZ strategy plus a header docstring and three lines of harness:

```python
'''backtest
start: 2026-09-01 00:00:00
end: 2026-09-15 00:00:00
period: 1h
basePeriod: 15m
exchanges: [{"eid":"Binance","currency":"BTC_USDT","balance":10000,"stocks":0}]
'''
import json
from fmz import *
task = VCtx(__doc__)          # builds the engine from the header; exchange / exchanges / Log / TA ... become globals

# ---- the strategy exactly as it would run on the platform ----
def main():
    pos = 0
    while True:
        r = exchange.GetRecords()
        if len(r) < 25:
            Sleep(60000); continue
        ma1, ma2, i = TA.MA(r, 5), TA.MA(r, 20), len(r) - 2
        if pos == 0 and ma1[i-1] <= ma2[i-1] and ma1[i] > ma2[i]:
            exchange.Buy(-1, exchange.GetAccount()["Balance"] * 0.5); pos = 1
        elif pos == 1 and ma1[i-1] >= ma2[i-1] and ma1[i] < ma2[i]:
            exchange.Sell(-1, exchange.GetAccount()["Stocks"]); pos = 0
        acc = exchange.GetAccount()
        LogProfit(acc["Balance"] + acc["Stocks"] * r[-1]["Close"] - 10000)
        Sleep(3600 * 1000)

try:
    main()
except EOFError:                # the engine raises EOFError when the virtual clock reaches `end`
    pass
result = json.loads(task.Join(False))
print(json.dumps({"profit": result["Profit"], "logs": result["LogsCount"], "elapsed_ms": result["Elapsed"] / 1e6}))
```

Run it with `python strategy.py`. Strategy parameters are not injected locally: define them as plain module globals (`fast = 5`) above `main()`, and when you later `save_strategy` declare the same names in `args`.

### What `Join` returns

- `task.Join(False)` → the raw engine result as JSON **bytes**; `json.loads` it. Keys: `Profit` (last `LogProfit` value), `ProfitLogs` (`[[time_ms, profit], ...]`), `RuntimeLogs` (`[id, time_ms, type, exchangeIdx, orderId, price, amount, text, symbol, direction]`, type 0 buy / 1 sell / 2 cancel / 3 error / 4 profit / 5 log), `Snapshots` (`[[time_ms, [account, ...]], ...]` with `Balance`, `Stocks`, `PnL`, `Utilization`), `Indicators`, `Chart`, `LogsCount`, `Elapsed` (ns), `BacktestStatus` (2 = finished), `Status` (the `LogStatus` text).
- `task.Join(True)` → a pandas DataFrame of `PnL` / `Utilization(%)` over time (needs pandas).
- `task.Show()` → matplotlib chart of the equity curve (needs matplotlib; in notebooks it renders inline).

To report the same numbers `get_backtest` gives: `profit` = last `ProfitLogs` value, max drawdown = largest peak-to-trough drop over `ProfitLogs`, `orders` = count of type 0/1 logs, `error_lines` = type 3 logs. `Profit`, drawdown and the curve exist only if the strategy calls `LogProfit()`; otherwise read the last snapshot's accounts.

### Header keys the local engine reads

`start`, `end` (`YYYY-MM-DD HH:mm:ss`, interpreted in the **machine's local time zone**; the cloud tool takes UTC), `period`, `basePeriod` (`Nm`/`Nh`/`Nd`), `exchanges` (JSON array of `{eid, currency, balance, stocks, fee:[maker, taker]}` — `eid` must be the data server's name: `Binance`, `OKX`, `HTX`, `Futures_Binance`, ... exactly what `list_exchanges` returns), `dataServer` (default `http://q.fmz.com`; the `DATASERVER` environment variable overrides it), `pnl` (`true`/`false`, account PnL snapshots). Not configurable locally: network delay (fixed 200 ms), slippage, tick mode, runtime log cap (800). The full key reference is in `references/backtest-config.md`.

### Differences from the cloud run

- No templates and no required libraries: the Pine / MyLanguage trading classes cannot be loaded, so those languages do not run locally; a JS/Python strategy that imports a template must have the template's code pasted in.
- `IsVirtual()` is true, `Sleep` advances the virtual clock, `exchange.IO` raw calls and `HttpQuery` have no exchange behind them — same as the cloud engine.
- Numbers match the cloud for the same header (same engine core and data); differences come from the time-zone interpretation of `start`/`end` and from the cloud defaults (`NetDelay`, depth, fee defaults) listed in `backtest-config.md`.
- The data server returns only what the platform has history for; a pair with no data ends the run immediately with an EOF and empty logs, so check `LogsCount` and `RuntimeLogs` before trusting a flat result.

## JavaScript engine

Package: https://github.com/fmzquant/backtest_javascript (`npm install git+https://github.com/fmzquant/backtest_javascript.git`, then `var fmz = require("fmz"); var task = fmz.VCtx({start, end, period, exchanges}); ...; task.Join()`). As of October 2026 the published bundle fails at `require` time on Node 26 with `TypeError: Cannot read properties of null (reading 'talib')` (it touches the wasm module before the asynchronous instantiation has finished), so treat it as unavailable until the package is fixed: backtest JavaScript strategies on the cloud, or port the logic to the Python engine for the fast loop.

## Recommended loop

1. Write `strategy.py` with the header for the period you care about; run locally; fix errors and logic until the result makes sense. Each run takes seconds, so sweep parameters by looping over values and re-running `VCtx` in fresh processes.
2. Remove the harness lines (header docstring may stay; the platform ignores it, the website even reads it to fill the backtest form), `save_strategy` with the parameters declared in `args`, run `run_backtest` once with the same dates and exchanges and compare `profit` / `orders` with the local numbers.
3. Only then `create_robot`.
