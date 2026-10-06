---
name: fmz-strategy-pine
description: "Write TradingView-style Pine Script (v5) strategies that run on the FMZ Quant platform's own Pine engine, in backtests and as live robots against real exchange accounts. Covers which strategy() settings FMZ honours and how they map to a real account, how strategy.entry/exit/close/order/cancel become exchange orders (pyramiding, quantity units, simulated limit/stop/trailing), the position and trade fields, series semantics (var/varip, history, request.security, timeframe/syminfo/barstate), inputs as robot parameters, plotting, alerts and logging, restart behaviour, the built-ins that exist (references/builtins.md) and the TradingView features that do not, plus how to save, compile-check and backtest with the fmz MCP tools. Use when writing, porting or debugging a Pine strategy for FMZ."
---

# FMZ Pine strategies

FMZ compiles a Pine script to JavaScript on the platform and runs it in its own Pine engine, on the user's node for a live robot and in the cloud for a backtest. The same script runs in both. Only the built-ins the engine registers exist: `references/builtins.md` is the authoritative list (with the engine's parameter names); anything else is not available, however standard it is on TradingView.

Fixed facts about the runtime:

- One exchange account per robot (`PineScript only support one exchange` otherwise). The trading pair, the futures contract and the K-line period are robot/backtest settings, not script code; the script sees them through `syminfo.*` and `timeframe.*`.
- The engine needs the platform's Pine trade library (a JS template that implements the order/account calls). A robot that errors with `Please import PineLang Class` is missing it: look at an existing Pine strategy with `get_strategy` for the template id and pass it in `save_strategy.templates`.
- Execution is bar driven: on every poll the engine fetches K-lines and runs the script once per new bar (bar-close model) or on every poll of the forming bar (tick model). Which one is a parameter of the trade library, not of `strategy()`.

```pine
/*backtest
start: 2024-01-01 00:00:00
end: 2024-03-01 00:00:00
period: 1h
basePeriod: 15m
exchanges: [{"eid":"Binance","currency":"BTC_USDT"}]
*/
//@version=5
strategy("MA cross", overlay=true, pyramiding=1, default_qty_type=strategy.fixed, default_qty_value=0.01)
fast = input.int(9, "Fast MA", minval=1)
slow = input.int(21, "Slow MA", minval=1)
maFast = ta.sma(close, fast)
maSlow = ta.sma(close, slow)
plot(maFast, "fast", color=color.green)
plot(maSlow, "slow", color=color.red)
if ta.crossover(maFast, maSlow)
    strategy.entry("long", strategy.long)
if ta.crossunder(maFast, maSlow)
    strategy.entry("short", strategy.short)
```

## strategy() declaration

`strategy(title, shorttitle, overlay, format, precision, scale, pyramiding, calc_on_order_fills, calc_on_every_tick, max_bars_back, backtest_fill_limits_assumption, default_qty_type, default_qty_value, initial_capital, currency, slippage, commission_type, commission_value, process_orders_on_close, close_entries_rule, margin_long, margin_short, ...)` is accepted in full so TradingView scripts compile, but the engine only uses:

| Parameter | Effect on FMZ |
|---|---|
| `title` | Chart title. |
| `overlay` | `true` draws plots on the price chart, otherwise in a separate pane (per-plot `overlay=` overrides). |
| `pyramiding` | Max open entries in one direction (minimum 1). Further same-direction entries are ignored. |
| `default_qty_type`, `default_qty_value` | Quantity used when an entry has no `qty`: `strategy.fixed` = that many units; `strategy.cash` = that much quote currency converted at the bar close; `strategy.percent_of_equity` = that percent of `strategy.equity` converted at the bar close. |
| `max_bars_back` | History depth kept for every series; `x[n]` beyond it throws `Invalid number ... of bars back`. |

Everything else (`initial_capital`, `currency`, `commission_*`, `slippage`, `calc_on_every_tick`, `calc_on_order_fills`, `process_orders_on_close`, `close_entries_rule`, margins) is ignored. Backtest fees and slippage come from the backtest settings (`run_backtest` `fee_maker`/`fee_taker`/`slippage`); live fees are the exchange's. `indicator()`/`study()` scripts run too (they only plot).

There is no simulated account: `strategy.equity` is the real account value (balance + frozen, plus margin and unrealized PnL on futures) and `strategy.initial_capital` is that value as seen the first time it is read, not the declared number.

## Orders

Order calls never hit the exchange immediately. They queue a task; after the script finishes its bar the engine processes the queue through the trade library, which places the real orders (market-style, at the then-current price) and logs `[id] direction: long avgPrice: ... qty: ...`. During the history warm-up on start-up nothing is traded.

`strategy.entry(id, direction, qty, limit, stop, oca_name, oca_type, comment, when, alert_message)`:

- `direction` is `strategy.long` or `strategy.short`. An entry first closes the entire opposite position (whatever its id), then opens `qty` if the number of open entries is below `pyramiding`. So an opposite entry always reverses; it does not need the same id.
- `qty` is in the account's order unit: base coins on spot, contracts on futures. If omitted, `default_qty_*` applies, and if that gives nothing the trade library's default quantity parameter is used. Quantities are rounded to the trade library's amount precision; a quantity that rounds to 0 falls back to the default.
- Without `limit`/`stop` the order is executed on this bar. With `limit` and/or `stop` the engine keeps the task itself and executes it when the price condition is met (long: bar low <= limit, or bar high >= stop; short mirrored; on the bar it was created only the close is compared). It is not a resting order on the exchange.
- Two calls with the same `id` in one bar: the later one replaces the earlier pending task. `when=false` makes the call a no-op.
- `strategy.order(...)` has the same arguments; it offsets an opposite position only up to `qty` and opens the remainder, i.e. a net order instead of a reversal.

`strategy.exit(id, from_entry, qty, qty_percent, profit, limit, loss, stop, trail_price, trail_points, trail_offset, oca_name, comment, when, alert_message)` closes `from_entry` (or every open entry when omitted). `profit`/`loss` are ticks (`syminfo.mintick`) from the average entry price; `limit`/`stop` are prices and take precedence over them. Trailing needs `trail_offset` plus `trail_price` or `trail_points` (ticks). `qty` or `qty_percent` close part of the group, otherwise all of it. An exit with a given id fills once per position: after it fills, the same id is ignored until a new entry opens. An exit placed while flat stays pending and arms when a position appears.

`strategy.close(id, when, comment, qty, qty_percent, alert_message)` closes the entries with that id at market; `strategy.close_all(when, comment, alert_message)` closes everything. `strategy.cancel(id)` / `strategy.cancel_all()` drop pending limit/stop/exit tasks only. Closing is FIFO across entries.

`strategy.risk.allow_entry_in(strategy.direction.long|short|all)` blocks entries in the other direction; `strategy.risk.max_position_size(contracts)` caps the position. `comment` and `alert_message` are written to the robot log when the order executes.

```pine
if longCond
    strategy.entry("L", strategy.long, qty=0.01)
    // stop-loss / take-profit in ticks from the average entry price, kept by the engine
    strategy.exit("L-x", "L", loss=200, profit=400)
// trailing: arms once price is 300 ticks in profit, then exits 100 ticks off the extreme
strategy.exit("L-trail", "L", trail_points=300, trail_offset=100)
if shortCond
    strategy.entry("S", strategy.short)        // closes L first, then opens the short
if flatCond
    strategy.close_all(comment="flat")
```

What the robot log shows for these (useful when reading `get_robot_logs` or the backtest logs):

- `PriceTick BTC_USDT : 0.1` once at start (tick size, plus the contract multiplier when it is not 1).
- `[L] direction: long avgPrice: 64321.5 qty: 0.01` when an entry executes.
- `L-x stop: 64121.5, lowestPrice: 64100` (or `limit: ...`) when a pending task triggers, followed by `[exit] (0.01, L-x, L) exitPrice: 64118`; `strategy.close` logs `[close] (...)`.
- `[cancel] id` / `[cancel_all] id` for cancelled tasks, `[L] <comment> <alert_message>` after execution, `process position remain qty` when dust below the minimum quantity is closed separately.

### Position and trade fields

- `strategy.position_size`: the real exchange position, signed (negative = short), refreshed on every live bar/tick. `strategy.position_avg_price`: its average price (`na` when flat).
- `strategy.opentrades`, `strategy.closedtrades`: counts of the engine's own entry records. `strategy.netprofit`, `strategy.grossprofit`, `strategy.openprofit`: computed by the engine from those records.
- `strategy.opentrades.entry_id/entry_price/entry_time/entry_bar_index/size/profit(n)` and `strategy.closedtrades.entry_id/entry_price/exit_price/entry_time/exit_time/entry_bar_index/exit_bar_index/size/profit(n)`: `n` is 0-based; `size` is signed; `na`/`""`/`0` when `n` does not exist. The closed list keeps the last 1000 trades.

The engine only knows the entries it opened itself (persisted by the trade library across restarts). A position opened by hand or by another robot shows in `strategy.position_size` but `strategy.close`/`strategy.exit` have nothing to close, and an opposite `strategy.entry` will open against it.

## Data and series

Bar data:

- `open high low close volume time hl2 hlc3 hlcc4 ohlc4 bar_index last_bar_index`. `bar_index` counts from the first bar the engine loaded, not from listing. `time` is a millisecond timestamp.
- `barstate.isnew isfirst islast ishistory isrealtime isconfirmed islastconfirmedhistory`. In the bar-close model `isconfirmed` is always true; in the tick model it is true only for closed bars.
- History `x[n]` works on every series and on user function results. `var` initialises once; `varip` keeps its value across ticks of the same bar. `na`, `nz(x, repl)`, `fixnan`, `na(x)`, `int/float/bool/string(x)` casts.

Symbol and timeframe:

- `syminfo.ticker` (FMZ symbol, e.g. `BTC_USDT` or `BTC_USDT.swap`), `syminfo.tickerid` (`Exchange:symbol`), `syminfo.basecurrency`, `syminfo.currency`, `syminfo.mintick`, `syminfo.pointvalue`, `syminfo.type` (`crypto`, or `futures` for CTP-style brokers), `syminfo.timezone` (the host's zone).
- `timeframe.period` (TradingView notation: `60`, `D`, `W`), `timeframe.multiplier`, `timeframe.in_seconds`, `timeframe.in_seconds("240")`, and the flags `isintraday isdaily isminutes isseconds isdwm`. `timeframe.isweekly`/`ismonthly` are miscomputed in the engine (always false); do not rely on them.
- `ta.*`: `sma ema rma wma hma vwma alma swma linreg atr tr rsi macd bb bbw kc kcw stoch cci mom roc change cum stdev dev variance highest lowest highestbars lowestbars pivothigh pivotlow crossover crossunder cross barssince valuewhen rising falling supertrend sar dmi mfi obv vwap cmo tsi cog correlation percentrank percentile_*` and more (`ta.sum` does not exist, use `math.sum(src, len)`); see the reference for the exact argument lists. Call `ta.*` functions on every bar (not inside `if`), as on TradingView; the engine logs a warning otherwise.
- `math.*` (`abs ceil floor round(x, precision) max min avg pow sqrt exp log log10 sign sum(src, len) random round_to_mintick` and the trig functions, `math.pi`/`e`/`phi`/`rphi`).
- `str.*`: `tostring(x, "#.##")`, `format("{0} {1}", a, b)`, `tonumber length contains startswith endswith substring pos replace replace_all split lower upper match`.
- `array.*`: `array.new<float>(n)`, `array.new_float/int/bool/string`, `array.from(...)`, `push pop get set size slice sum avg min max median mode sort sort_indices includes indexof insert remove fill clear concat copy reverse join stdev variance covariance percentile_* binary_search*`.
- Language: user functions, `method`, user types (`type`), `switch`, `for`, `for ... in`, `while`, `break`/`continue`, tuples `[a, b] = f()`, `//@version=5` (v4 scripts work through name aliases such as `sma` -> `ta.sma`, `security` -> `request.security`).
- Not available: `line.*`, `box.*`, `matrix.*`, `map.*`, `polyline.*`, `import` of libraries.

Other data:

- `request.security(symbol, timeframe, expression)`: the same exchange, another FMZ symbol or timeframe (string `symbol` in FMZ form, e.g. `"BTC_USDT"` or `syminfo.tickerid`; timeframe `"60"`, `"D"`, `""` = chart period). The expression is evaluated on the other series; `gaps`/`lookahead` are accepted but have no effect; `ticker.heikinashi(sym)` as the symbol gives Heikin-Ashi bars. `request.data(uri, "$.path")` reads JSON from a URL. Every other `request.*` is unsupported.
- `time`, `time_close`, `time("D")`, `timestamp(...)`, `timenow`, `year month weekofyear dayofmonth dayofweek hour minute second` (optional `time`, `timezone`); `dayofweek.monday` etc. Without `timezone` these use the host's local time.

## Inputs become robot parameters

`input, input.int, input.float, input.bool, input.string, input.source, input.color, input.timeframe` each create one parameter on the robot/backtest configuration form; `defval` (first positional argument) is the default, `title` the label, `options=[...]` a dropdown with the default first, `input.source` a dropdown of `close/high/low/open/hl2/hlc3/hlcc4/ohlc4`. Each call site is one parameter, identified by its position in the script, so inserting an input call shifts the ones after it. `input.symbol`, `input.session`, `input.time`, `input.price`, `input.text_area` do not exist. Pine strategies take no `save_strategy.args`; put defaults in the script and change them on the robot form.

## Live trading on FMZ

- Start-up: the engine loads the history the exchange returns, replays it with trading disabled (indicators and `var` state warm up, no orders, no alerts), then goes live. The trade library saves its order records after every executed signal and restores them on restart, so pending limit/stop/exit tasks and `strategy.opentrades.*` survive a restart; `strategy.position_size` always comes from the exchange.
- Bar-close model: the script runs once per closed bar; pending limit/stop/exit tasks are still checked against the forming bar, so stops can fire intrabar. Tick model: the script runs on every poll of the forming bar, so an unconfirmed condition can trade (guard with `barstate.isconfirmed` if that is not wanted).
- Futures: set the contract on the robot; `strategy.long`/`strategy.short` open/close both sides through the trade library. Spot has no short side: a short entry sells base currency, so two-sided scripts belong on futures. Chinese A-shares ignore short entries. CTP-style brokers wait for market data and trading hours before each bar.
- Logging: `runtime.log(a, b, ...)` writes to the robot log (`get_robot_logs`); `runtime.error("msg")` stops the robot with that error; `runtime.debug(x)` goes to stdout (`get_robot_output`). `log.info/warning/error` do not exist.
- `alert(message, freq)` writes the message to the log as a push notification (suppressed during the history warm-up; `freq` honoured; `{{close}}`/`{{open}}`/`{{high}}`/`{{low}}`/`{{volume}}`/`{{time}}`, `{{ticker}}`, `{{exchange}}`, `{{timenow}}`, `{{interval}}` placeholders expand). `alertcondition()` does nothing. There are no webhooks.
- Plotting on the robot/backtest chart: `plot` (returns an id for `fill`), `plotshape`, `plotchar`, `plotarrow`, `plotcandle`, `hline`, `bgcolor`, `barcolor`, `fill`, `color.*` constants, `color.new`, `color.rgb`, `#rrggbb` literals. `label.*` and `table.*` are accepted but ignored (one `ignored because not supported temporarily` log line).

## Pitfalls

- A built-in missing from `references/builtins.md` passes `check_strategy` (the compiler only checks syntax and undeclared assignments) and fails when the script first runs: `Could not find function or function reference 'x'`. Read the backtest `errors` before going live.
- Quantities are coins on spot and contracts on futures; `strategy.cash` converts at the bar close. TradingView defaults (`default_qty_value=1`) are 1 BTC on a BTC pair.
- `strategy.entry` in the opposite direction closes the whole opposite position first, regardless of id; `pyramiding` only limits same-direction stacking.
- Limit/stop prices on entries and exits are simulated by the engine from bar highs/lows and executed at market when touched; expect slippage and no partial fills.
- `strategy.equity` and `strategy.initial_capital` are real account money; percent-of-equity sizing uses the whole account, including what other robots use.
- The forming bar's values change until it closes; in the tick model `close` is the last price and a condition can be true now and false at the close (repainting). `request.security` on a higher timeframe returns the still-forming higher bar.
- `bar_index` and `last_bar_index` are relative to the loaded history; do not persist them.
- `var` state and the engine's trade records are per robot; changing the strategy code and restarting keeps the saved trade records.
- Unsupported TradingView features: `import` libraries, `line`/`box`/`matrix`/`map`, `request.*` other than `security`/`data`, `input.symbol`/`session`/`time`, webhooks, `strategy()` commission/slippage/initial capital simulation, `calc_on_every_tick` (set the mode on the trade library instead).

## Save and run

1. Source starts with the optional `/*backtest ... */` header (see the `fmz-backtest` skill for its fields), then `//@version=5` and `strategy(...)`.
2. `check_strategy` with `language: "pine"` compiles the script (syntax errors come back as `line N:M ...`).
3. `save_strategy` with `language: "pine"`, no `args` (parameters come from `input.*`), plus `templates` with the Pine trade library id if the platform does not attach it.
4. `run_backtest` with `strategy_id` or `source` + `language: "pine"`, `period` = the chart timeframe, `exchanges[].exchange` = eid, then `get_backtest` and read `profit`, `orders`, `errors`, `error_lines`; the robot log in `detail: "logs"` shows every `[id]` execution line.
5. `create_robot` with the pair on the exchange entry (`BTC_USDT`); on futures the contract is chosen through the Pine trade library's settings on the robot, not in the script. Watch `get_robot_logs`.

## References

- `references/builtins.md`: every built-in the engine registers, with parameter lists.
- Skill `fmz-backtest`: the `/*backtest*/` header and backtest tools.
- Skill `fmz-platform`: MCP workflow, safety rules, robot and strategy tools.
- Platform Pine documentation: https://www.fmz.com/bbs-topic/9315
