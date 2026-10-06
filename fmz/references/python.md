> Part of the `fmz` skill. File paths below are relative to the skill directory (the folder that holds `SKILL.md`).

# FMZ Python strategies

A strategy is a Python source file with a `def main():` entry. The runtime `exec`s it as `__main__` with the platform API already injected as globals: `exchange` (first configured account), `exchanges` (all of them), the parameter globals, `Log`, `Sleep`, `TA`, `talib`, the `PERIOD_*`/`ORDER_*`/`PD_*` constants, and the functions below. Do not import those. Do import the stdlib you use (`json`, `time`, `math`): the injected namespace holds only the API. The same code runs in backtest and live.

```python
import json

def init():                                    # optional, runs once before main()
    Log("init")

def main():
    Log("start", fast, slow)                   # parameters are module globals (see "Parameters")
    while True:
        ticker = _C(exchange.GetTicker)        # retries every 3 s until a truthy result
        records = exchange.GetRecords()        # K-lines of the robot's period; None on failure
        if not records or len(records) < slow:
            Sleep(1000)
            continue
        ma_fast = TA.MA(records, fast)         # lists aligned with records; leading values are None
        ma_slow = TA.MA(records, slow)
        LogStatus("price", ticker["Last"], "ma", _N(ma_fast[-1], 2), "/", _N(ma_slow[-1], 2))
        cmd = GetCommand()                     # "name:value" from the UI or send_robot_command
        if cmd:
            Log("command", cmd)
        Sleep(5000)                            # milliseconds; never time.sleep in a strategy

def onexit():                                  # optional; runs when the robot stops (5 min budget)
    Log("exit")
```

## Runtime model

- Entry order: `init()` (if defined) → `main()` → `onexit()` on stop. `onerror()` is JavaScript-only (user guide, "Strategy Entry Functions"). `onexit()` runs in a helper thread and is killed after 300 s. When `main()` returns, child threads are terminated.
- Interpreter: the system Python of the host running the docker/node. If both Python 2 and 3 are installed, pick one with a first-line shebang `#!python3` / `#!python2` / `#!/usr/bin/python3`. Python 2 syntax is still accepted by the bootstrap; write Python 3. `#!encrypt` / `#!not encrypted` control source encryption for rented strategies (user guide, "### Python").
- Third-party packages: whatever that interpreter can import. `talib` + `numpy` are detected at startup; `pandas` works on records (`pandas.DataFrame(list(records))`); `Log(plt)` prints a matplotlib figure. The docs describe no installer: install into the host's Python yourself. Private modules: drop `mymod.py` into `<docker dir>/logs/storage/<robot id>/` and `import mymod`.
- Templates (template library strategies): a template exports with `ext.Func = Func`; the strategy calls `ext.Func()`. Template `init()` functions run before the strategy's. Template parameters are globals of the template.
- Stopping: the runtime may raise `StopError` (an injected `RuntimeError` subclass) from `Sleep()` or an API call while the robot is being stopped. Never trap it inside a retry loop; let it propagate (catch narrower exceptions, or re-raise `StopError`).
- Backtest end: the engine ends the run by raising an exception from the next API call (the "EOF" marker). Pattern from the docs: `if IsVirtual(): try: loop() except Exception as e: Log(e)` so `main()` returns and `onexit()` still runs. In live, `onexit()` is triggered by the stop button.
- `IsVirtual()` is `True` in backtest. `Info` fields and `_G` data do not survive a backtest.

## Parameters

Declared when saving (`save_strategy.args`): `[[name, label, description, default], ...]`. Each name becomes a module global of the default's type: number → `int`/`float`, boolean → `bool`, string/encrypted string → `str`, dropdown → index (or bound value; a list when multi-select is on). Run-time values come from the robot's `args`. To assign a parameter inside a function use `global name` (user guide, "Strategy Parameters"). An optional parameter left empty is `""` for strings and `None` for number/dropdown/encrypted — guard before arithmetic.

## Exchange API (synchronous; `None` on failure, error text goes to the log)

| Call | Returns / notes |
|---|---|
| `exchange.GetTicker(symbol="")` | `{Last, Buy (bid), Sell (ask), High, Low, Open, Volume, Time (ms), Symbol, Info}` |
| `exchange.GetDepth(symbol="")` | `{"Asks": [{Price, Amount}, ...] low→high, "Bids": [...] high→low, Time}` |
| `exchange.GetTrades(symbol="")` | recent public trades `[{Id, Time, Price, Amount, Type}]` |
| `exchange.GetRecords()` / `(PERIOD_M5)` / `("BTC_USDT.swap", PERIOD_H1, 100)` | K-lines oldest→newest `[{Time (ms), Open, High, Low, Close, Volume}]`; periods `PERIOD_M1..PERIOD_W1` are seconds, any int works; no period = robot's period (`exchange.GetPeriod()`); `records.Close` etc. give flat arrays |
| `exchange.GetAccount()` | `{Balance, FrozenBalance}` quote currency, `{Stocks, FrozenStocks}` base; futures add `Equity`, `UPnL` (use `.get()` on spot) |
| `exchange.GetAssets()` | `[{Currency, Amount, FrozenAmount}]` for every currency |
| `exchange.GetMarkets()` | dict `"BTC_USDT"` / `"BTC_USDT.swap"` → `{TickSize, AmountSize, PricePrecision, AmountPrecision, MinQty, MaxQty, MinNotional, CtVal, ...}` |
| `exchange.Buy(price, amount, *log)` / `exchange.Sell(...)` | order id (str such as `"ETH-USDT,1547..."`) or `None`. Price `-1` = market. Spot market **buy** amount is in quote currency; limit orders and market sells in base; futures amounts are contracts |
| `exchange.CreateOrder(symbol, side, price, amount, *log)` | `side` = `"buy"`, `"sell"`, `"closebuy"`, `"closesell"`; `symbol=""` = current pair; preferred for futures (no `SetDirection` needed) |
| `exchange.GetOrders(symbol="")` / `GetOrder(id)` / `CancelOrder(id, *log)` | open orders (`[]` when none) / one `Order` / `True`/`False` |
| `exchange.GetHistoryOrders(symbol="", since=0, limit=0)` | filled/cancelled orders |
| `exchange.CreateConditionOrder(symbol, side, amount, cond)`, `GetConditionOrders()`, `CancelConditionOrder(id)` | `cond = {"ConditionType": ORDER_CONDITION_TYPE_SL, "SlTriggerPrice": p, "SlOrderPrice": p2}` (TP / SL / OCO) |
| `exchange.SetCurrency("ETH_USDT")` (= `exchange.IO("currency", "ETH_USDT")`) | switch pair; in backtest the quote currency cannot change |
| `exchange.GetName()`, `GetLabel()`, `GetCurrency()`, `GetBaseCurrency()`, `GetQuoteCurrency()` | `"Binance"` / `"Futures_Binance"` (futures names start with `Futures_`), account label, `"BTC_USDT"` |
| `exchange.IO("api", "GET"\|"POST", path, query_string, raw_body)` | raw signed REST call; parsed response or `None`; `query_string` may be `""` |
| `exchange.SetPrecision(price_digits, amount_digits)`, `SetMaxBarLen(n)`, `SetTimeout(ms)`, `SetProxy(url)`, `SetBase(url)` | setup; the K-line cache default differs by runtime, set it explicitly when you need many bars |
| `exchange.Log(LOG_TYPE_BUY\|LOG_TYPE_SELL\|LOG_TYPE_CANCEL, price, amount, *log)` | chart marker only, no real order |
| `exchange.GetRawJSON()`, `GetLastError()` | last raw response / last error text (consumed) |

Order fields: `Id, Symbol, Price, Amount, DealAmount, AvgPrice, Status, Type, Offset, ContractType, Time`. Compare `Status` with `ORDER_STATE_PENDING/CLOSED/CANCELED/UNKNOWN` and `Type` with `ORDER_TYPE_BUY/SELL`, never with literals.

Multi-account: `exchanges[i]`, `len(exchanges)`; `exchange is exchanges[0]`.

Order lifecycle (spot limit order, poll, cancel if still open):

```python
depth = _C(exchange.GetDepth)
oid = exchange.Buy(depth["Bids"][0]["Price"], 0.01, "limit buy")   # id or None
if oid is None:
    Log("order rejected:", GetLastError())
else:
    Sleep(2000)
    o = exchange.GetOrder(oid)
    if o is None:
        Log("GetOrder failed, retry later")
    elif o["Status"] == ORDER_STATE_PENDING:
        exchange.CancelOrder(oid, "not filled in time")
    else:
        Log("done", o["DealAmount"], "@", o["AvgPrice"], "status", o["Status"])
```

### Futures

```python
exchange.SetCurrency("BTC_USDT")        # BTC_USDT → USDT-margined, BTC_USD → coin-margined
exchange.SetContractType("swap")        # "swap", "quarter", "next_quarter", "this_week", "next_week"
exchange.SetMarginLevel(10)             # or SetMarginLevel("BTC_USDT.swap", 20)
exchange.CreateOrder("BTC_USDT.swap", "buy", -1, 1)        # open long, 1 contract, market
exchange.CreateOrder("BTC_USDT.swap", "closebuy", -1, 1)   # close it
for pos in exchange.GetPositions("BTC_USDT.swap") or []:   # [] = flat, None = request failed
    side = "long" if pos["Type"] == PD_LONG else "short"
    Log(pos["Symbol"], side, pos["Amount"], pos["Price"], pos["Profit"], pos["MarginLevel"])
```

With `Buy`/`Sell` instead of `CreateOrder`, call `exchange.SetDirection("buy"|"sell"|"closebuy"|"closesell")` before each order; a mismatch is rejected (`direction is sell, invalid order type Buy`). `GetPosition()` is an alias of `GetPositions()`. `GetFundings(symbol)` → `[{Symbol, Rate, Time, Interval}]`; `GetContractType()` returns the current code.

## Result objects

Every API result is a dict subclass with attribute access: `ticker["Last"]` and `ticker.Last` are the same thing, `json.dumps(ticker)` works, and a missing field raises (`KeyError` / `AttributeError`). Records come back as a list subclass whose `.Open/.High/.Low/.Close/.Volume` properties return flat arrays (a numpy array when talib+numpy are installed, otherwise a list). The records list is an accumulating cache shared across calls: copy before mutating.

## Concurrency

- `g = exchange.Go("GetTicker")`, `exchange.Go("GetRecords", PERIOD_H1)`, `exchange.Go("Buy", price, amount)`, `exchange.Go("IO", "api", "POST", path, "", body)` start the call in the background. `value, ok = g.wait()` blocks; `g.wait(ms)` times out with `ok == False`; waiting twice on the same handle gives `ok == False`. **Python returns a `(value, ok)` tuple** (api docs `exchange.Go`, bootstrap `AsyncRet.wait`, selfcheck); the `fmz.pyi` stub shows a bare value — unpack the tuple.
- `EventLoop(timeout_ms)` returns the next event dict (`{Seq, Event, ThreadId, Index, Nano, ...}`) or `None`; `0` blocks, `-1` polls. Call `EventLoop(-1)` once early or events raised before the first call are missed.
- Native `threading.Thread` is allowed (API calls from threads are serialized by the runtime); make them daemon threads and remember they die when `main()` returns. The JavaScript `threading`/`Thread`/`ThreadLock` objects do not exist in Python.

## Logging, status, timing, persistence

- `Log(*args)` joins arguments with spaces. Trailing `"#ff0000"` colours the line, trailing `"@"` pushes it (email/webhook, live only, ~1 per 20 s), trailing `"&"` marks it private. `` Log("`data:image/png;base64,...`") `` shows an image; `Log(plt)` logs a matplotlib figure. `print()` goes to the process stdout (`get_robot_output` / debug panel), not the strategy log.
- `LogProfit(value, *extra)` draws the profit curve; `LogProfitReset(remain=0)`, `LogReset(remain=0)`, `LogVacuum()`, `EnableLog(False)`.
- `LogStatus(*args)` sets the status bar. Tables: `` LogStatus("`" + json.dumps(tbl) + "`") `` with `tbl = {"type": "table", "title": "...", "cols": [...], "rows": [[...], ...]}`; a list of tables renders as tabs; a cell or standalone `{"type": "button", "cmd": "coverAll", "name": "Close all"}` arrives in `GetCommand()` as `"coverAll"`. Multi-line text and `#ff0000` colours work too.
- `GetCommand()` → `"name:value"` (`"name"` for bare buttons; dropdowns send the option index) or falsy when nothing is queued. Poll it every loop and split it yourself.

```python
tbl = {"type": "table", "title": "Positions", "cols": ["Symbol", "Amount", "PnL", ""], "rows": []}
for pos in exchange.GetPositions() or []:
    btn = {"type": "button", "cmd": "close:" + pos["Symbol"], "name": "Close"}
    tbl["rows"].append([pos["Symbol"], pos["Amount"], _N(pos["Profit"], 2), btn])
LogStatus(_D(), "\n`" + json.dumps(tbl) + "`")       # the backticks mark the JSON as a widget

def on_command(cmd):
    global size                                         # parameters are module globals
    name, _, value = cmd.partition(":")                 # "close:BTC_USDT.swap" / "size:0.5" / "stop"
    if name == "size":
        size = float(value)
    elif name == "close":
        Log("close requested for", value)

cmd = GetCommand()
if cmd:
    on_command(cmd)
```
- `Sleep(ms)` (fractions allowed). `Unix()` seconds, `UnixNano()`. **`_D(ts_seconds=None, fmt="%Y-%m-%d %H:%M:%S")` takes seconds in Python** (api docs `_D`, bootstrap, selfcheck); record and ticker `Time` are milliseconds, so write `_D(r["Time"] // 1000)`. Output is in the host's local time zone. The `fmz.pyi` docstring says milliseconds; it is wrong for Python.
- `_C(fn, *args)` calls `fn(*args)` until the result is truthy, sleeping 3 s between tries (`_CDelay(ms)` changes it). Pass the function, not a call. It also retries on `0`/`0.0`/`False`, so do not wrap calls that legitimately return zero.
- `_N(x, digits=4)` truncates toward zero (no rounding). `_Cross(a, b)` > 0 golden cross, < 0 death cross, 0 none; raises if the lists differ in length.
- `_G(key, value)` stores a JSON-serialisable value per robot (keys case-insensitive), `_G(key)` reads (`None` if absent), `_G(key, None)` deletes, `_G(None)` wipes everything, `_G()` returns the robot id. Persists across restarts in live; cleared after a backtest.
- `DBExec(sql, *params)` on the robot's own SQLite: returns `{"columns": [...], "values": [[...]]}` or `None`; `?` placeholders.
- `GetMeta()`, `SetChannelData(str)` / `GetChannelData(token)` for cross-robot messages, `Mail(smtp, user, password, to, title, body)` → bool, `Encode(algo, in_fmt, out_fmt, data, key_fmt=None, key=None)`, `MD5(s)`, `UUID()`, `JSONParse(s)` (raises on bad JSON), `SetErrorFilter(regex)`, `Version()`, `GetOS()`, `GetPid()`.

## Charts

- `chart = Chart(cfg)` where `cfg` is a Highcharts/Highstock config dict (or a list of them; `"__isStock": False` for a plain chart). `chart.add(series_index, [ts_ms, value])` appends; `chart.add(i, point, -1)` replaces the last point; `chart.reset(remain=0)`; `chart.update(cfg)` replaces the whole config (pass the full dict). Series indexes run across all charts in the list in order (two series in cfgA → 0, 1; cfgB's first series → 2).
- `c = KLineChart({"overlay": True})` draws Pine-style on real candles. Per bar: `c.begin(bar)`, then `c.plot(value, title=..., color=..., style="line"|"histogram", overlay=False)` (returns a plot index), `c.hline(price, color=..., linestyle="dashed")`, `c.plotshape(cond, style="triangleup", location="belowbar", color=...)`, `c.plotchar(cond, char="D", location="abovebar")`, `c.plotarrow(value)`, `c.plotcandle(o, h, l, c)`, `c.barcolor(color)`, `c.bgcolor(color)`, `c.fill(idx1, idx2, color=...)`, `c.signal("buy"|"sell"|"closebuy"|"closesell", price, qty)`, and finally `c.close()`. Options are keyword arguments (selfcheck). The runtime's `close()` takes no arguments (one doc example passes `bar`; omit it). These methods are not declared in `fmz.pyi`; the authoritative signatures are in `bootstrap.py`'s `KLineChartObj` and the api docs `#### KLineChart`.

## Network

- `ws = Dial("wss://host/path", timeout_ms=30000)` → connection or `None`. `ws.read(timeout_ms)` returns the next message, a falsy value on timeout, `""` once closed (omit the timeout to block, `-1` to poll); `ws.write(str_or_bytes)`; `ws.close()`. Options after `|`: `"wss://...|compress=gzip_raw&mode=recv&reconnect=true&payload=" + json.dumps(sub)`; headers via a dict second argument `Dial(url, {"headers": {...}})`. Also `tcp://`, `tls://`, `sqlite3://`, `mysql://`, `postgres://`, `kvdb://` (then `.exec(sql, *params)`). Keep the handle in a module global and close it in `onexit()`.
- `HttpQuery(url, options)`: the api docs mark it JavaScript/C++ only and tell Python to use `urllib.request`; the classic bootstrap does not bind it, while `fmz.pyi` declares it. Safe choice: `urllib.request.urlopen(url, timeout=10).read()`; if you do call `HttpQuery`, guard with `'HttpQuery' in globals()`. In backtest `HttpQuery` is GET-only and cached per URL (max 20).

## Indicators

- `TA.MA(records, n)`, `TA.EMA`, `TA.SMA`, `TA.RSI(records, 14)`, `TA.ATR(records, 14)`, `TA.OBV(records)`, `TA.CMF(records, 20)`, `TA.Alligator(records, 13, 8, 5)` return lists aligned with `records`; `TA.MACD(records, 12, 26, 9)` → `[dif, dea, histogram]`, `TA.BOLL(records, 20, 2)` → `[upper, middle, lower]`, `TA.KDJ(records, 9, 3, 3)` → `[k, d, j]`; `TA.Highest(records, n, "High")` / `TA.Lowest(records, n, "Low")` return one number. Inputs may be the records list or a plain list of floats. Leading entries are `None` until enough bars exist: test `is None` before comparing.
- `talib` (TA-Lib via its Python binding, needs numpy on the host; the global is injected, `import talib` also works) takes flat arrays, not records: `talib.MACD(records.Close, 12, 26, 9)` → tuple of three arrays, `talib.ATR(records.High, records.Low, records.Close, 14)`, `talib.CDL2CROWS(records.Open, records.High, records.Low, records.Close)`. Missing TA-Lib raises `Please install talib module for python` on first use. Full signatures: `references/talib.pyi`; indicator semantics: the `references/indicators.md`.

## What a failed call looks like

- Market, account, order and position calls return `None` when the request fails (network, rate limit, exchange error); the error text is logged and available once through `GetLastError()`. `GetOrders`/`GetPositions`/`GetTrades` return `[]` when there is simply nothing, so test `is None` to tell failure from empty. `CancelOrder` returns `False`. Nothing is substituted with zeros or fake ids.
- Exceptions come from the runtime itself (unknown method name, RPC error, `StopError`, backtest EOF), from `JSONParse`, `_Cross`, `talib` without TA-Lib, and from missing keys on result objects. An uncaught exception stops the robot with a traceback in the output.

## Pitfalls

- Guard every result (`if not ticker: continue`) or wrap with `_C`; never compute on `None`.
- `_D()` wants seconds in Python; records/tickers carry milliseconds.
- `exchange.Go(...).wait()` returns `(value, ok)`; forgetting to unpack gives a tuple where you expect a dict.
- `Sleep(ms)` only. `time.sleep` makes backtests crawl and does not process platform events; a bare `ws.read()` blocks the whole loop, pass a timeout.
- Floats: Python 3 `/` is float division; under `#!python2` ints divide as ints. `_N` truncates, `round` does not; size orders from `GetMarkets()` precision/minimums (`AmountPrecision`, `MinQty`, `MinNotional`).
- Spot market buy = quote amount; limit and market sell = base amount; futures = contracts. Order ids are opaque strings (`"ETH-USDT,1547..."`): pass them back unchanged.
- `GetRecords(period, limit)`: the classic runtime ignores `limit` in that two-int form; use `GetRecords(symbol, period, limit)` or `SetMaxBarLen(n)`.
- `_C` retries on `0`/`False`; wrap only calls whose success is truthy.
- Assigning a parameter inside a function creates a local unless you declare `global`.
- `print` is not `Log`; use `Log` for anything you want in the robot log.
- Source is UTF-8; add `# -*- coding: utf-8 -*-` only if you force Python 2. Strings from the API are `str` (decoded) in Python 3.
- Do not swallow `StopError` with a blanket `except Exception: continue`; keep `onexit()` under 5 minutes; close `Dial` handles there.
- Backtest-only data differences: no `Info`, `_G` wiped at the end, `onexit()` only via the EOF-exception pattern, `HttpQuery` cached.

## Save and run

1. `check_strategy` has **no static check for Python** (returns ok without parsing): run `python3 -m py_compile file.py` locally first.
2. `save_strategy` with `language: "python"`, `source`, `args` definitions. Updating: pass `strategy_id`; `save_strategy_version` first if the old code must stay retrievable.
3. `run_backtest` (`strategy_id`, or `source` + `language: "python"`) → `get_backtest` with `wait`; read `error_lines`, `profit`, `orders`. A `'''backtest ... '''` docstring at the top of the file (Python form of `/*backtest*/`) can carry start/end/period/exchanges/args; it is optional and documented in the `references/backtest.md`.
4. Live: `create_robot` / `start_robot` / `send_robot_command` / `get_robot_logs` as described in `SKILL.md`.

## References

- `references/fmz.pyi` — complete Python API stub with docstrings. Grep `def GetRecords`, `class IOrder`, `class IMarket`, `def Dial`, `class IDial`, `def _G`, `def CreateConditionOrder`, `def Encode`, `def HttpQuery`, `class IHttpOptions`. Known stub errors: `IGo.wait` really returns `(value, ok)`; `_D` really takes seconds; `IAccount` lacks `UPnL`; KLineChart's Pine methods are not declared.
- `references/fmz.zh_CN.pyi` — the same stub in Chinese.
- `references/talib.pyi` — every `talib.*` signature with defaults (`def MACD`, `def BBANDS`, `def STOCH`, `def CDL...`).
- `references/selfcheck.py` — known-good strategy exercising the whole surface; copy its idioms (`if t:` guards, `tk, ok = g.wait(0)`, `_D(r["Time"] // 1000)`, KLineChart keyword args, `IsVirtual()` gating of writes, condition-order dicts).
- `references/api-docs.md` (`references/api.en.md`): grep `#### exchange.Buy`, `#### exchange.GetRecords`, `#### exchange.Go`, `#### _D`, `#### _C`, `#### _G`, `#### LogStatus`, `#### LogStatus-table`, `#### Dial`, `#### Chart`, `#### KLineChart`, `#### EventLoop`, `### Order`, `### Account`, `### Position`, `### Market` (each with a `python` example block).
- `SKILL.md` (`references/user-guide.en.md`): grep `### Python` (interpreter shebang, encryption, custom modules), `## Strategy Entry Functions`, `## Strategy Parameters`, `## Interactive Controls`, `## Template Library`, `### Local Backtesting Engine`.
- `references/backtest.md` — the `'''backtest'''` header, periods, exchanges and reading results. `references/indicators.md` — TA/talib semantics.
