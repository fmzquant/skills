---
name: fmz-platform
description: "Operate the FMZ Quant trading platform (fmz.com) through its MCP tools — the platform model (exchange accounts, nodes, strategies, templates, robots, backtests, messages), the complete tool catalog by scope, the workflows for writing, checking, backtesting and running a strategy live, the REST \"extended API\" alternative, and the safety rules a real-money trading platform needs. Use whenever the fmz MCP server is connected, or when a task mentions FMZ robots, strategies, backtests, nodes or API keys."
---

# FMZ platform via MCP

FMZ (fmz.com) is a quant trading platform: strategies written in JavaScript, TypeScript, Python, C++, Rust, Pine, MyLanguage (麦语言) or Blockly run as "robots" (实盘) on the user's own nodes (托管者) against the user's exchange accounts. Everything below is done through the `fmz` MCP server. Not connected yet? Read `https://www.fmz.com/agent/setup.md` and follow it.

Sibling skills installed with this one: `fmz-strategy-javascript` / `-python` / `-cpp` / `-rust` / `-pine` / `-mylanguage` (how to write code in each language), `fmz-api-reference` (the full API documentation), `fmz-backtest` (backtest configuration and semantics).

## The platform model

| Object | What it is | How you reach it |
|---|---|---|
| Exchange account (`platform`) | One exchange API key the user added on the website (spot, futures, or a CTP futures counter). The agent never sees or enters keys. | `list_platforms` → pick by `id` (`platform_id`). Sandbox accounts have `is_sandbox`. |
| Node (`node`, 托管者) | The host process that runs robots: the user's own docker/binary, or a platform-hosted one. A robot can only start on an online node. | `list_nodes`; `delete_node` is `[danger]`. |
| Strategy | Source code + language + parameter definitions (`args`) + optional templates. Has versions (snapshots), a group (folder), a visibility (private/shared/verify/premium/system). Rented or public strategies can be run but their source may be hidden. | `list_strategies` (scope mine/public/official/templates), `get_strategy`, `save_strategy`, `check_strategy`, `save_strategy_version`. |
| Template | A strategy of category "template" whose functions a strategy imports (`$.` namespace in JS). Listed in `save_strategy.templates` by id. | `list_strategies` with `scope: templates`. |
| Robot (实盘) | A running instance: strategy (+ pinned version) + `exchanges: [{platform_id, pair}]` + `args` + `period` + node. Prepaid by the hour from the account balance. Has a log database (trades, errors, prints), a status page (`LogStatus`), stdout/stderr output, and a profit curve (`LogProfit`). | `list_robots`, `get_robot`, `get_robot_logs`, `get_robot_output`; `create_robot` / `start_robot` / `stop_robot` / `restart_robot` / `send_robot_command` are `[trade]`. |
| Backtest | A cloud task that replays history data through the strategy with simulated accounts. Holds a concurrency slot until collected or stopped. | `run_backtest`, `get_backtest`, `list_backtests`, `stop_backtest` (see `fmz-backtest`). |
| Messages | Robot push messages (`Log("...@")`, trade notices) and system alerts (node offline, robot stopped). | `list_messages`, `delete_messages`, `set_robot_alert`, `set_node_alert`. |
| Groups | Folders for robots or strategies. | `list_groups`, `save_group`, `move_to_group`, `delete_group`. |

Robot `status` values: `queue` (waiting for a node), `running`, `stopping`, `complete` (strategy returned), `stopped`, `error` (read `error` and `get_robot_output`).

## Workflow

1. **Orient**: `ping`, `get_account_summary`, `list_platforms`, `list_nodes`. No online node → the user must start one (website: Nodes); nothing you do will run until then.
2. **Write**: pick the language skill, write the code, run `check_strategy` (`language`, `source`): syntax check for javascript/typescript, compile check for pine/mylanguage/flow/cpp/rust (cpp/rust compile on the build cluster and can take a minute); python and blockly have no static check.
3. **Save**: `save_strategy` with `name`, `language`, `source`, `args` (`[[name, label, description, default], ...]`; names become globals in the code), optional `description`, `manual`, `note`, `templates`, `group_id`. Returns `strategy_id`. Updating: pass `strategy_id` and only the changed fields; call `save_strategy_version` first if the old code must stay retrievable (max 20 versions; `delete_strategy_version` when full).
4. **Backtest**: `run_backtest` with `strategy_id` (or raw `source` + `language`), `begin`, `end`, `period`, `exchanges: [{exchange: eid, pair, balance, stocks, fee_maker, fee_taker}]`, optional `args`, `slippage`, `net_delay` → `task_id`. Then `get_backtest` with `wait` up to 60 and `detail` summary/logs/full → `profit`, `max_drawdown`, order and error counts, `error_lines`, final accounts, `profit_curve`. The profit metrics come from the strategy's own `LogProfit()` calls: a strategy that never calls it shows empty profit/drawdown/curve, so judge it by `final_accounts` (or add `LogProfit`). Always `stop_backtest` when you have what you need; slots are limited. `eid` values come from `list_exchanges`.
5. **Go live** (`[trade]`, confirm with the user first): `create_robot` with `name`, `strategy_id`, `exchanges: [{platform_id, pair}]`, optional `args`, `period` (seconds, default 60), `node_id` (omit = least loaded online node), `strategy_version_id` (pin a version), `group_id`. It prepays one hour and starts the robot; the result is the robot after the start attempt. `status: error` → read `error`, `get_robot_output`, `get_robot_logs`.
6. **Watch**: `get_robot` (configuration, status, profit, status page text, last error), `get_robot_logs` (newest first; `before_id` pages back; `types` filters; `with_status` adds the status page), `get_robot_output` (process stdout/stderr tail), `list_messages`.
7. **Change**: `stop_robot` → `update_robot` (only stopped robots; `args` replaces all values; the strategy itself cannot change, create a new robot for that) → `start_robot`. `restart_robot` = stop + start. `send_robot_command` delivers a string to a running robot's `GetCommand()`; interactive buttons use the `name:value` form.
8. **Finish**: `stop_robot` does not close positions — say so. Delete only on explicit request (`delete_robot` needs a stopped robot; `remove_logs` is irreversible). When the user asks you to disconnect, `revoke_my_key` with `confirm: true` revokes only the key this connection uses.

## Tool catalog

`references/tools.md` is the complete, generated list (40 tools: every parameter, type, default). By scope:

| Scope | Tools | Granted |
|---|---|---|
| `read` | ping, revoke_my_key, get_account_summary, list_exchanges, list_platforms, list_nodes, list_strategies, get_strategy, list_strategy_versions, get_strategy_version, list_robots, get_robot, get_robot_logs, get_robot_output, list_messages, list_groups | default |
| `backtest` | run_backtest, get_backtest, list_backtests, stop_backtest | default |
| `write` | check_strategy, save_strategy, save_strategy_version, delete_strategy_version, update_robot, save_group, move_to_group, delete_group, set_robot_alert, set_node_alert, delete_messages | default |
| `trade` | create_robot, start_robot, stop_robot, restart_robot, send_robot_command | default (device-flow keys); costs money and places real orders |
| `danger` | delete_strategy, delete_robot, delete_node, publish_strategy | never by default; the user grants it explicitly |

A tool missing from `tools/list` means the key lacks that scope; the user can edit the key's privileges at `/m/account#apikey` (scope names, tool names, `*`, `!name` to exclude). Trading-terminal tools named `plugin*` may also appear; they belong to the website's trading terminal and need the `trade` scope.

## Conventions

- `args` everywhere: `{name: value}` object or `[[name, value], ...]`; omitted parameters keep the strategy defaults. Values are typed by the default (number / string / boolean).
- Enumerations are words, not numbers: robot `status` queue/running/stopping/complete/stopped/error; strategy `visibility` private/shared/verify/premium/system; `language` javascript/typescript/python/cpp/blockly/mylanguage/pine/flow/rust.
- Times: ISO 8601 or unix seconds in; ISO UTC out. Backtest `period`: 1m/5m/15m/30m/1h/4h/1d. Robot `period` is in seconds.
- Pairs: `BTC_USDT` (spot). Futures contracts are chosen in code with `exchange.SetContractType("swap" | "quarter" | ...)`, so the robot pair stays `BTC_USDT`.
- Backtest `exchanges[].exchange` is the `eid` from `list_exchanges` (e.g. `Binance`, `Futures_Binance`, `Futures_CTP`); robots use `platform_id` from `list_platforms` instead.
- All list tools paginate with `offset` / `limit` (max 200). Results never contain secrets.

## Safety rules

- Tools whose description starts with `[trade]` spend the user's balance and place real orders; `[danger]` tools delete or publish. Ask the user before each such call and say what it will do.
- Never configure exchange API keys; never ask the user for them. They add accounts on the website, you choose by `platform_id`.
- Never paste `secret_key` or any credential anywhere; tool results never contain them.
- `stop_robot` does not close positions. Say so when stopping a robot that may hold positions.
- Prefer sandbox/simulated accounts (`is_sandbox`) or a tiny amount for a first live run, after a backtest with no `error_lines`.
- Do not create robots in a loop or retry `create_robot` blindly: each attempt prepays an hour.
- Deleting is the user's decision, named explicitly, every time.

## Errors you will see

- `no online node` → the user must start a node. Nothing was created or charged.
- `too many backtests running` → `list_backtests`, then `stop_backtest` the stale one.
- `Tool not allowed` / tool missing from `tools/list` → the key lacks that scope.
- `strategy ... not usable` → not owned/rented, deleted, or a version that is not the author's.
- `robot is not stopped` on `update_robot` / `delete_robot` → `stop_robot` first and wait for `stopped`.
- Robot `status: error` right after `create_robot` → compile/runtime failure: `get_robot_output` shows the traceback; insufficient balance and expired rented strategies are reported in `error`.
- Backtest `errors > 0` → `get_backtest` with `detail: logs` and read `error_lines`; data gaps for the pair/period/date range are the usual cause.

## REST instead of MCP

Scripts and schedulers can use the signed REST "extended API" with the same key: `references/rest-api.md` has the endpoint, the signature, the return codes, the robot status codes and the method list (GetRobotList, GetRobotDetail, GetRobotLogs, CommandRobot, StopRobot, RestartRobot, NewRobot, GetNodeList, GetPlatformList, ...). The REST surface is older and lower-level than the MCP tools; prefer MCP when it is available.

## Documentation

- `references/tools.md` — generated tool catalog (authoritative for parameters).
- `references/user-guide.en.md` / `references/user-guide.zh.md` — the platform user guide converted to markdown. Grep its `## ` sections: Live Trading, Docker (nodes), Exchange, Strategy Library, Backtesting System, Strategy Entry Functions, Template Library, Strategy Parameters, Interactive Controls, Options Trading, the per-language writing guides, Built-in Libraries, Extended API Interface, MCP Service, Trading Terminal, Data Explorer, General Protocol, Debugging Tool.
- The API itself (every function, structure and constant, with examples in four languages) lives in the `fmz-api-reference` skill.
