# FMZ MCP tools (generated from the server's tool table)

Every tool the `fmz` MCP server exposes to agents, grouped by scope. A key's privileges decide which scopes are visible in `tools/list`: an empty privilege list means read+backtest+write+trade; `danger` must be granted explicitly. Parameters marked (required) must be present.

## scope `read`

List/inspect; results never contain secrets.

### ping

Health check: confirms the platform is reachable and the credentials are valid.

(no parameters)

### revoke_my_key

Permanently revoke the API key this connection is using (e.g. when the user asks you to disconnect, or when you are done and will not come back). Takes effect immediately: every later call with this key fails with 401. Other keys are untouched; the user can always revoke keys at /m/account#apikey too.

- `confirm` (boolean, required): Must be true

### get_account_summary

Account overview: counts of robots, strategies, exchange accounts and nodes, plus balance and total spend in USD.

(no parameters)

### list_exchanges

Exchanges the platform supports. `eid` is the exchange id used by run_backtest (already the name the history data server uses, e.g. OKX / HTX); backtest=false means the platform has no history data for that exchange, so it can only be traded live.

(no parameters)

### list_platforms

The user's configured exchange accounts (API keys are never returned). `id` is the platform_id used by create_robot. New accounts must be added by the user on the website.

(no parameters)

### list_nodes

The user's own nodes (the hosts that run robots). A robot can only start on an online node; if none is online the user must deploy one on the website first.

(no parameters)

### list_strategies

List strategies. scope: mine (default; the user's own plus rented ones, see is_owner), public (community shared), official, templates (template libraries usable in save_strategy's `templates`: the user's own and rented ones plus the platform's built-in ones, marked builtin). Use get_strategy for the source.

- `group_id` (number): Only this strategy group (see list_groups)
- `keyword` (string): Fuzzy match on the strategy name
- `language` (string one of javascript/python/blockly/mylanguage/pine/flow/rust)
- `limit` (number): Default 50, max 200
- `offset` (number)
- `scope` (string one of mine/public/official/templates)

### get_strategy

One strategy in full: metadata, parameter definitions (args), template ids and the source code (own, shared or system strategies only).

- `strategy_id` (number, required)
- `with_source` (boolean): Default true

### list_strategy_versions

Saved versions (history snapshots) of one of the user's strategies, newest first.

- `strategy_id` (number, required)

### get_strategy_version

One saved strategy version, with its source when with_source is true.

- `version_id` (number, required)
- `with_source` (boolean)

### list_robots

List the user's robots (live strategies) with status and profit. `total` is how many robots match the filters (the page is a slice of it); `status_totals` counts ALL the user's robots per status, regardless of filters and paging. Use get_robot for configuration, get_robot_logs for what it is doing and get_robot_profit for its profit curve.

- `group_id` (number): Only this robot group; 0 = ungrouped
- `keyword` (string): Fuzzy match on the robot name
- `limit` (number): Default 50, max 200
- `offset` (number)
- `status` (string one of all/queue/running/stopping/complete/stopped/error): Default all
- `strategy_id` (number): Only robots of this strategy, whatever their status — e.g. to see what still references a strategy before deleting it

### get_robot

One robot's configuration and state: strategy, parameters (args), exchange accounts and pairs, node, status, profit, the status page text, and the error output when status is error.

- `robot_id` (number, required)

### get_robot_logs

A robot's runtime log, newest first: trades, errors, prints. The tool to find out why a robot behaves oddly. Page older entries with before_id = the smallest id already seen.

- `before_id` (number): Only entries with id below this
- `limit` (number): Default 50, max 200
- `robot_id` (number, required)
- `types` (array of string): Only these entry types
- `with_status` (boolean): Also return the robot's status page text

### get_robot_profit

A robot's profit curve, newest first: one point per LogProfit() call the strategy made (a strategy that never calls LogProfit has no curve; the robot's `profit` field is its last point). The points live on the robot's node, so an offline node gives an empty page even for a stopped robot. Page older points with before_id = the smallest id already seen.

- `before_id` (number): Only points with id below this
- `limit` (number): Default 50, max 200
- `robot_id` (number, required)

### get_robot_output

The robot process's stdout/stderr tail: from the node while it runs, otherwise the output captured from its last run. Read this when a robot is in error or crashed.

- `robot_id` (number, required)

### list_messages

Notifications: kind=robot (default) are messages robots pushed (alerts, trade notices); kind=system are platform alerts such as a node going offline.

- `kind` (string one of robot/system)
- `limit` (number): Default 20, max 100

### list_groups

The user's robot groups or strategy groups (folders).

- `kind` (string one of robot/strategy, required)

## scope `backtest`

Start, poll, stop cloud backtests.

### run_backtest

Start a backtest on the cloud cluster, either of a saved strategy (strategy_id) or of raw source (source + language). Returns task_id; poll with get_backtest at least every 5 minutes (a task nobody polls for 5 minutes is discarded, result included). Prices come from the platform's history data; the simulated account per exchange starts with `balance` quote currency and `stocks` base currency.

- `args` (object): Strategy parameter values, {name: value} or [[name, value], ...]. With strategy_id, omitted parameters take the strategy's defaults; with raw source there are no defaults, so pass every parameter the code reads. Libraries the language requires (e.g. the Pine / MyLanguage trading class) are attached automatically.
- `begin` (string, required): ISO date or unix seconds
- `end` (string, required): ISO date or unix seconds
- `exchanges` (array of object, required): Simulated exchange accounts, e.g. [{"exchange":"Binance","pair":"BTC_USDT","balance":10000,"stocks":0}]. exchange = eid from list_exchanges; fee_maker/fee_taker in percent (default 0.15/0.2).
  - `balance` (number)
  - `exchange` (string, required)
  - `fee_maker` (number)
  - `fee_taker` (number)
  - `pair` (string, required)
  - `stocks` (number)
- `language` (string one of javascript/python/blockly/mylanguage/pine/flow/rust/typescript): Required with source
- `net_delay` (number): Simulated network latency in ms, default 200
- `period` (string one of 1m/5m/15m/30m/1h/4h/1d): Default K-line period the strategy sees, default 1h
- `slippage` (number): Slip points per order, default 0
- `source` (string): Raw source instead of strategy_id
- `strategy_id` (number): A saved strategy (own, rented or public)

### get_backtest

Progress or result of a backtest. With wait>0 the call blocks up to that many seconds for the task to finish. detail=summary (default) gives profit, max drawdown, order/error counts, error lines and the final accounts; logs adds the last runtime log lines; full returns the raw engine result. The task (and its result) is kept only while it is polled: 5 minutes after the last get_backtest call it is discarded, as it is by stop_backtest; a returned result frees the account's concurrency slot.

- `detail` (string one of summary/logs/full)
- `task_id` (string, required)
- `wait` (number): Seconds to wait for completion, 0-60

### list_backtests

The account's cloud backtests that still hold a concurrency slot (running, or finished but not yet seen by get_backtest). When run_backtest says too many are running, get_backtest a finished one (that frees its slot) or stop_backtest a stale one.

(no parameters)

### stop_backtest

Stop a running backtest, or discard a finished one. Read the result with get_backtest first: after stop_backtest the task and its result are gone (get_backtest then says not found). Not needed to free the concurrency slot after a result was read.

- `task_id` (string, required)

## scope `write`

Save strategies and versions, groups, alert switches, edit stopped robots.

### update_robot

Change a STOPPED robot's configuration: name, exchanges/pairs, parameter values, period, node, pinned strategy version or group. Only the fields given change. The strategy itself cannot be changed (create a new robot). Start it afterwards with start_robot.

- `args` (object): Parameter values to change: {name: value} or [[name, value], ...] for the strategy's own parameters, [name, value, template_id] for a template's. MERGED into the current values — only the parameters named here change
- `exchanges` (array of object)
  - `pair` (string, required): e.g. BTC_USDT
  - `platform_id` (number, required): id from list_platforms
- `group_id` (number): 0 keeps the current group
- `name` (string)
- `node_id` (number): 0 = pick automatically at start
- `period` (number): Seconds
- `replace_args` (boolean): Replace the whole parameter set with args instead of merging; parameters left out revert to the strategy's defaults when the robot starts
- `robot_id` (number, required)
- `strategy_version_id` (number): 0 = latest source

### check_strategy

Static check of strategy source before saving: syntax errors for javascript/typescript, compile errors for pine, mylanguage, flow and rust (rust compiles on the build cluster and takes a while). python and blockly have no static check. Returns {ok, error}.

- `language` (string one of javascript/python/blockly/mylanguage/pine/flow/rust/typescript, required)
- `source` (string, required)

### save_strategy

Create a strategy (omit strategy_id) or update one of the user's own (pass strategy_id; only the fields given change, the rest are kept). Names must be unique per account. Updating overwrites the source in place: call save_strategy_version first if the old version should stay retrievable. Robots already running keep the old code until restarted.

- `args` (array of array): Parameter definitions the user can edit when starting a robot: [[name, label, description, default], ...]. Names become global variables in the code, so they must be valid identifiers.
- `description` (string)
- `group_id` (number): Strategy group; 0 = none
- `language` (string one of javascript/python/blockly/mylanguage/pine/flow/rust/typescript): Required when creating
- `manual` (string): User-facing manual (markdown)
- `name` (string)
- `note` (string): Private notes
- `source` (string): Required when creating
- `strategy_id` (number): Omit to create
- `templates` (array of number): Ids of template strategies this one depends on. The library the language requires (e.g. the Pine / MyLanguage trading class) is added automatically

### save_strategy_version

Snapshot the current source of one of the user's strategies as a named version (max 20 kept; delete one with delete_strategy_version when full). Do this before a large rewrite.

- `description` (string)
- `is_default` (boolean): Make it the version renters run
- `strategy_id` (number, required)
- `version` (string, required): Label such as v1.2

### delete_strategy_version

Delete one saved strategy version (the strategy itself is untouched).

- `version_id` (number, required)

### save_group

Create a robot or strategy group (folder), or rename one by passing group_id.

- `group_id` (number): Rename this group instead of creating
- `kind` (string one of robot/strategy, required)
- `name` (string, required)

### move_to_group

Put a robot or strategy into a group; group_id 0 removes it from its group.

- `group_id` (number, required)
- `item_id` (number, required): robot_id or strategy_id
- `kind` (string one of robot/strategy, required)

### delete_group

Delete a robot or strategy group. Its members are kept, just ungrouped.

- `group_id` (number, required)
- `kind` (string one of robot/strategy, required)

### set_robot_alert

Turn the alert (watchdog) on or off for a robot: when on, the user is notified the moment the robot leaves the running state. The flag is cleared automatically every time the robot stops — whether by stop_robot/restart_robot, by the strategy exiting, or by an error — and again every time it starts, so it only lives for one run: set it after start_robot/create_robot and again after every restart. get_robot and list_robots report it as `alert`.

- `enabled` (boolean, required)
- `robot_id` (number, required)

### set_node_alert

Turn the offline alert on or off for one of the user's nodes.

- `enabled` (boolean, required)
- `node_id` (number, required)

### delete_messages

Delete notifications by id (see list_messages). kind must match the list they came from. Returns `deleted` (how many were actually removed) and `not_found` (ids that matched no message of this account in that list).

- `ids` (array of number, required)
- `kind` (string one of robot/system)

## scope `trade`

Create/start/stop robots and send them commands: spends balance and places real orders. Confirm with the user first.

### create_robot

[trade] Create AND start a live robot from a strategy on the user's exchange account(s). This prepays one hour of the platform fee from the balance and the strategy will place real orders. Returns the robot's state after the start attempt; if status is error, read `error`.

- `args` (object): Strategy parameter values, {name: value} or [[name, value], ...]; omitted ones use the strategy defaults
- `exchanges` (array of object, required): Exchange accounts and trading pairs the robot uses
  - `pair` (string, required): e.g. BTC_USDT
  - `platform_id` (number, required): id from list_platforms
- `group_id` (number)
- `name` (string, required)
- `node_id` (number): Run on this node of the user's; omit to pick the least loaded online one
- `period` (number): Default K-line period in seconds the strategy sees, default 60
- `strategy_id` (number, required)
- `strategy_version_id` (number): Pin a saved version instead of the latest source

### start_robot

[trade] Start a stopped robot with its current configuration (use update_robot first to change it). Charges the platform fee when the prepaid hour is used up and resumes real trading. Returns the robot's state after the start attempt. Starting clears the robot's alert flag (see set_robot_alert).

- `robot_id` (number, required)

### stop_robot

[trade] Stop a running robot (the strategy's exit handler runs; open positions are NOT closed automatically). Waits briefly for it to reach a final state and returns it. Stopping clears the robot's alert flag (`alert` in the result is then false; see set_robot_alert).

- `robot_id` (number, required)

### restart_robot

[trade] Stop a robot, wait for it to finish, then start it again with its current configuration. Same costs and effects as stop_robot + start_robot, including clearing the alert flag (see set_robot_alert).

- `robot_id` (number, required)

### send_robot_command

[trade] Send a command string to a running robot; the strategy reads it with GetCommand(). Interactive buttons use the form "name:value". What it does depends entirely on the strategy code — it may trade.

- `command` (string, required)
- `robot_id` (number, required)

## scope `danger`

Delete strategies/robots/nodes, publish strategies. Never included in a key by default; confirm with the user first.

### delete_strategy

[danger] Delete one of the user's own strategies (soft delete, but there is no undo for the user; rented strategies cannot be deleted here). Refused while any robot, even a stopped one, still references it — find them with list_robots(strategy_id) and delete those robots first.

- `strategy_id` (number, required)

### delete_robot

[danger] Delete a STOPPED robot. With remove_logs the robot's log database on the node is erased too (irreversible). A deleted robot is gone for this interface: get_robot and the other robot tools report it as not found.

- `remove_logs` (boolean): Default false
- `robot_id` (number, required)

### delete_node

[danger] Remove one of the user's self-hosted nodes from the account (it is logged out; robots on it are marked error). Cloud-hosted nodes cannot be deleted here because that destroys the server.

- `node_id` (number, required)

### publish_strategy

[danger] Make one of the user's strategies public (visibility=shared: source visible to everyone in the community) or private again. Paid/verified listings are not handled here.

- `strategy_id` (number, required)
- `visibility` (string one of private/shared, required)

## Legacy raw names

These older method names stay callable for existing integrations but are not listed in `tools/list`: `CommandRobot`, `GetExchangeList`, `GetNodeList`, `GetPlatformList`, `GetRobotDetail`, `GetRobotList`, `GetRobotLogs`, `GetStrategyList`, `Ping`, `RestartRobot`, `StopRobot`.

## Strategy languages

`language` values: `javascript`, `python`, `blockly`, `mylanguage`, `pine`, `flow`, `rust`, `typescript`.
