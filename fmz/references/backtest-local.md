> Part of the `fmz` skill. File paths below are relative to the skill directory (the folder that holds `SKILL.md`).

# Local backtesting (the default)

Backtests run on the machine the agent runs on, with the platform's own engine and history data. The platform prepares each run: it resolves templates and the libraries a language requires, compiles Pine / MyLanguage / TypeScript to JavaScript and Rust (with its templates) to wasm, checks every exchange and pair against the history server and fills the same defaults as the website's backtest form. This machine downloads the engine (cached by sha256) and runs it. There is no cloud slot to wait for, and a two-week run of 1h bars takes about a second.

| | Local (`scripts/backtest.js`) | Cloud (`run_backtest`) |
|---|---|---|
| Languages | JavaScript, TypeScript, Python, Pine, MyLanguage, Rust | the same, plus Workflow |
| Templates, required libraries | resolved by the platform; local template files work too | attached automatically |
| Real-tick mode (`mode: 1`), every header key | yes | no (bar mode, fixed defaults) |
| Parameter optimisation | `optimize`, in parallel on this machine | no |
| Speed | seconds; history is cached on disk between runs | queue + run + poll, tens of seconds to minutes |
| Needs | Node.js 18+; Python 3 for Python strategies; a key with the `backtest` scope | a key with the `backtest` scope |
| Strategies whose source you cannot see (rented, encrypted) | no | yes |

Use the cloud only for a strategy whose source this account cannot see, or when the user wants the run to appear on the website.

## Running it

```bash
node scripts/backtest.js run strategy.pine            # a source file with a /*backtest*/ header
node scripts/backtest.js run backtest.json            # a config file (below)
node scripts/backtest.js run backtest.json --html report.html --logs 50
node scripts/backtest.js optimize backtest.json --parallel 6
```

`scripts/` is inside the skill directory; give the script's full path when the working directory is elsewhere. stdout is one JSON object (the summary, below); progress goes to stderr when it is a terminal. Exit code 0 = finished, 1 = the backtest ended in an error (see `exception`), 2 = bad config or credentials, 3 = rejected by the platform (compile error, unknown pair, ...), 4 = network or engine download problem. Every error prints `{"status": "error", "error": "..."}`.

| Command | Does |
|---|---|
| `run <config.json \| strategy file>` | prepare on the platform, run, print the summary; the full result goes to `--out` (default `<tmp>/fmz-backtest/last-result.json`) |
| `optimize <config.json>` | grid of parameter values, runs in parallel, prints the ranking; all rows go to `--out` (default `<tmp>/fmz-backtest/last-optimize.json`) |
| `prepare <config.json \| strategy file> --out task.json` | only prepare: writes the engine task and the resolved settings |
| `exec <task.json>` | run a task written by `prepare` (no platform call except the engine download when it is not cached) |

| Option | Meaning |
|---|---|
| `--out FILE` | where the full result / ranking / task is written |
| `--html FILE` | self-contained HTML report: summary, profit curve, exchanges, last 300 log lines |
| `--logs N` | add the last N runtime log lines to the summary |
| `--args JSON` | parameter values, replaces the config's `args` |
| `--start`, `--end`, `--period`, `--base-period`, `--timezone` | override those settings |
| `--parallel N` | concurrent runs for `optimize` (default: CPU count − 1) |
| `--quiet` | no progress output |

### Credentials

The script calls the MCP tool `prepare_backtest` with the agent's key. It looks for the key in this order:

1. `--mcp-url URL --key SECRET`;
2. environment variables `FMZ_MCP_URL` (the key's `mcp_url`, `https://www.fmz.com/api/mcp/<access_key>`) and `FMZ_SECRET_KEY`;
3. `~/.config/fmz/credentials.json` (`$FMZ_CREDENTIALS` overrides the path): `{"mcp_url": "...", "secret_key": "..."}`. Write it with mode 600 when you set up the key, next to the MCP configuration;
4. the fmz MCP server configured in Claude Code (`~/.claude.json`, an entry whose URL contains `/api/mcp/` with an `Authorization: Bearer` header).

Never print the secret or pass it where it lands in shell history or logs; prefer the file or the environment.

Other environment variables: `FMZ_PYTHON` (Python interpreter, default `python3`, `python` on Windows), `FMZ_CACHE_DIR` (engine cache, default `~/.cache/fmz`, `%LOCALAPPDATA%\fmz` on Windows).

## The config file

Paths are relative to the config file. Everything except `strategy` is optional when the strategy source has its own `/*backtest*/` header; keys given here override the header's.

```json
{
  "strategy": "ma_cross.js",
  "templates": ["lib/risk.js", 123456],
  "args": {"fast": 5, "slow": 20},
  "backtest": {
    "start": "2026-09-01 00:00:00",
    "end": "2026-10-01 00:00:00",
    "period": "1h",
    "basePeriod": "15m",
    "exchanges": [
      {"eid": "Binance", "currency": "BTC_USDT", "balance": 10000, "stocks": 0, "fee": [0.1, 0.1]}
    ]
  },
  "optimize": {"params": {"fast": {"from": 3, "to": 12, "step": 1}, "slow": [20, 30, 50]}, "target": "sharpe", "top": 10}
}
```

| Key | Value |
|---|---|
| `strategy` | a source file path; `{"file": "x.txt", "language": "mylanguage"}`; `{"source": "...", "language": "pine"}`; or `{"id": 123}` / `123` for a saved strategy (its saved parameters and templates are used). The language comes from the extension: `.js` (TypeScript when the file has a `// @ts-check` line), `.ts`, `.py`, `.pine`, `.rs`, `.my` / `.mylang` |
| `templates` | replaces the strategy's own templates: template ids (`list_strategies` scope templates), local files, or `{"file" or "source", "name", "args"}`. The library the language requires (the Pine / MyLanguage trading class) is always added |
| `args` | `{name: value}` for the strategy, or `[[name, value], ...]`; `[name, value, templateIdOrName]` sets a template parameter. Omitted parameters of a saved strategy keep their defaults; a raw source has no parameter definitions, so pass every parameter it reads |
| `backtest` | the backtest settings, keys as in the website's `/*backtest*/` header (table below) |
| `optimize` | for the `optimize` command (below) |
| `taskOverrides` | expert: merged into the final engine task, `{"Options": {...}, "Exchanges": [{...}, ...]}` (engine keys in `references/backtest-config.md`) |

### Backtest settings (`backtest`, or the source header)

| Key | Value | Default |
|---|---|---|
| `start`, `end` | `YYYY-MM-DD HH:mm:ss` (or `YYYY-MM-DD`) in `timezone`; ISO with an offset; unix seconds | required |
| `timezone` | IANA name (`Asia/Shanghai`) or offset (`+08:00`); applies to `start`/`end` without an offset | the machine's time zone, as on the website |
| `period` | strategy K-line period: `1m 5m 15m 30m 1h 4h 1d`, or seconds | `1h` |
| `basePeriod` | the underlying period the engine builds ticks from (smaller = more realistic, slower); not longer than `period` | `= period` (as on the website) |
| `mode` | `0` simulated ticks from bars, `1` real recorded ticks with order book (period under 1d) | `0` |
| `exchanges` | array of `{eid, currency, balance, stocks, fee: [maker%, taker%], feeMin, depthDeep, depthAmount, tradesMode, quotePrecision, basePrecision, label, feeder}`; `eid` from `list_exchanges`; `currency` is the market pair (`BTC_USDT`; futures: pick the contract in code with `exchange.SetContractType`) | required. `balance`, `stocks`, fee and precision default to the pair's own values on the history server (as on the website; e.g. spot BTC_USDT starts with 1 BTC), so **always give both `balance` and `stocks`**; `depthDeep` 20, `depthAmount` 200 |
| `netDelay` | ms added to the virtual clock per API call | 200 |
| `slipPoint` | price ticks added to each side of the simulated spread | 0 |
| `faultTolerant` | 0..1, probability that an API call fails (fault-tolerance test) | 0 |
| `maxBarLen` | bars the first `GetRecords()` returns (100-5000) | 300 |
| `maxRuntimeLogs`, `maxProfitLogs`, `maxChartLogs` | log caps (≤ 10000) | 8000, 8000, 3000 |
| `orders` | `filled` (filled orders in the result) or `all` | `filled` |
| `symbols` | `true` adds the K-lines and indicators to the raw result | false |
| `events` | `true` records the event log | false |

The platform reports what it resolved in the summary's `config` (start/end, period, mode, each exchange's eid, pair, balance, stocks, fee and base period, the parameters and template names) and adds `warnings`, for example when the range is partly outside the pair's history, or when `BTC_USDT.swap` was given as a pair.

### Optimisation

`optimize.params` maps a parameter name to a list of values or a range `{"from", "to", "step"}`; `"Template.param"` addresses a template's parameter. All combinations run (at most `maxRuns`, default 2000), `parallel` at a time. `target` ranks them: `sharpe` (default), `profit`, `return`, `annualized_return`, `win_rate`, `calmar` (annualized return / max drawdown), or `max_drawdown` (smallest first). The output has `runs`, `ok`, `failed`, the `top` rows (`args` plus the metrics and the error count) and a few `failures`. Rust bakes parameters into the compiled module, so every combination is compiled on the platform; expect it to be slower than the other languages.

Ranking by a single in-sample run overfits. Check the best rows on a second date range (`--start`/`--end`) before trusting them.

## The summary

| Field | Meaning |
|---|---|
| `status` | `done` or `error` (with `exception`) |
| `elapsed_ms` | engine time |
| `profit` | last `LogProfit` value; without `LogProfit`, the first account's PnL |
| `return`, `annualized_return`, `sharpe`, `volatility`, `max_drawdown`, `max_drawdown_start`, `max_drawdown_time`, `win_rate` | the website's statistics, same algorithm (daily buckets, 3 % risk-free rate, drawdown as a fraction of peak assets). `stats_basis` says which series they come from: `CloseProfitLogs`, `LogProfit`, or `account PnL` |
| `orders`, `cancels`, `errors`, `log_counts`, `logs_total` | runtime log counts |
| `error_lines` | the first 20 error lines with their time |
| `logs` | the last N lines (`--logs N`): `time, type, order_id, price, amount, symbol, direction, text` |
| `final_accounts` | per exchange: assets (amount, frozen, commission, funding), PnL, utilization, open positions |
| `status_page` | the last `LogStatus()` text |
| `config`, `warnings` | what the platform resolved (above) |
| `result_file`, `report` | the full result file and the HTML report |
| `note` | set when the result is empty (no history for the pair or range, or the strategy never called the exchange) |

`result_file` holds `{summary, result}`; `result` is the raw engine result: `ProfitLogs [[ms, profit]]`, `CloseProfitLogs`, `RuntimeLogs [[id, ms, type, exchangeIdx, orderId, price, amount, text, symbol, direction]]` (type 0 buy, 1 sell, 2 cancel, 3 error, 4 profit, 5 log), `Snapshots [[ms, [account, ...]]]`, `Chart`, `Status`, `Exception`, `TaskStatus`. Read it for details the summary leaves out instead of re-running.

Times in the summary are ISO strings in the machine's time zone.

## Recommended loop

1. Write the strategy with a `/*backtest*/` header (or a config file), `run` it, read `exception`, `error_lines` and the statistics, fix, repeat. Add `--logs 50` or open `result_file` when the logic is in doubt.
2. `optimize` the parameters that matter, then re-run the best combination on a different range.
3. `save_strategy` (the header can stay; the website reads it into its backtest form), then `create_robot`; prefer a sandbox or a small account for the first live run.

## Troubleshooting

| Problem | Fix |
|---|---|
| `no FMZ credentials` | set the environment variables or write the credentials file (above) |
| `the FMZ key was rejected` | the key was revoked or replaced; run the authorization flow again |
| `prepare_backtest: Tool not allowed` | the key lacks the `backtest` scope |
| `compile error: ...` (exit 3) | Pine / MyLanguage / TypeScript / Rust compile error with line numbers; fix the source |
| `the source of strategy N is not visible ...` | rented or encrypted strategy: use `run_backtest` (cloud) |
| `X has no backtest data for PAIR` | wrong pair or exchange; the error lists pairs that exist |
| `note: empty result` or `exception` naming the symbol | no history in that range: check `warnings` and move the dates |
| `symbol X not set contract on Futures_...` | futures strategy: call `exchange.SetContractType("swap")` first |
| `cannot start python3` | install Python 3 or set `FMZ_PYTHON` |
| `engine ... sha256 mismatch` | the site updated the engine during the download; run again |
