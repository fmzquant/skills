# FMZ extended REST API (generated from the user guide, section “Extended API Interface”)

Same API keys as MCP (website: `/m/account#apikey`). For REST the key's privileges are method names or `*` (scope names only apply to MCP). Prefer the MCP tools when they are available; this is for scripts, cron jobs and older integrations. Below is the user guide's section, verbatim: creating a key, the request format and signature, every method, the return codes and the robot status codes.

The platform's HTTP interface (```https://www.fmz.com/api/v1```) for scripts, scheduled jobs and other programs: query the account, dockers, strategies and robots, create, restart and stop robots, send interactive commands to robots, and so on.

To operate the platform interactively from an AI assistant (Claude Code, Cursor, ...), prefer AI Integration (the MCP service, see `AI Integration`): it has more tools, takes named parameters, and can be authorized by permission category. Both can use the same API KEY.

Steps: create an API KEY (`Create ApiKey`), send requests as described in `Authentication Methods`, and look up methods and parameters in `Extended API Interface Details`.

## AI Integration

Connect FMZ to an AI coding assistant (AI agent) such as Claude Code, Codex or Cursor, and you can write strategies, run backtests, create and manage live trading, and read logs and profit just by talking to it. The assistant reaches these functions through the platform's MCP (Model Context Protocol) service, with an API KEY created for it alone; you choose its permissions when you approve it and can change or revoke them at any time.

### Connect with one sentence

Tell your AI assistant:

```text
Read https://www.fmz.com/agent/setup.md and connect to FMZ
```

The assistant follows that page; your only step is one click in the browser:

1. The assistant requests authorization and shows you a link such as ```https://www.fmz.com/agent/authorize?code=XXXX-XXXX```, valid for 10 minutes.
2. Open it in a browser where you are logged in to FMZ, check the requester's name and the permissions, and approve. You can untick permissions you do not want to grant.
3. The assistant receives an API KEY, writes it into its own MCP configuration and connects. From then on you can simply ask it to "list my live trading" or "backtest this strategy".

The assistant names the key "name @ machine" (for example ```Claude Code @ MacBook```). When a request with the same name is approved again, the old key is revoked and replaced, so connecting again does not pile up keys.

### Permissions

| Permission | Allows | Default |
| - | - | - |
| read | Lists and details of strategies, robots, dockers and exchange accounts; logs, messages, account summary (no secrets) | Yes |
| backtest | Start, query and stop backtests | Yes |
| write | Save strategies and versions, groups, alert switches; change the configuration of stopped live trading | Yes |
| trade | Create, start and stop live trading, send interactive commands (costs balance and places real orders) | Yes |
| danger | Delete strategies, live trading and nodes; publish strategies | No |

```danger``` is never granted by default: the assistant has to request it explicitly and you have to tick it on the approval page. Before calling a ```[trade]``` or ```[danger]``` tool the assistant should ask you first.

### Manual configuration

Clients that cannot run commands (for example Cherry Studio) can be configured by hand:

1. Create an API KEY under Account settings → API KEY (```https://www.fmz.com/m/account#apikey```) and note its Access Key and Secret Key.
2. Add an MCP server of type Streamable HTTP to the client:
   - URL: ```https://www.fmz.com/api/mcp/<Access Key>```
   - Header: ```Authorization: Bearer <Secret Key>```

The Secret Key goes in the header only, never in the URL. Examples:

```bash
# Claude Code
claude mcp add --transport http fmz "https://www.fmz.com/api/mcp/<Access Key>" \
    --header "Authorization: Bearer <Secret Key>"
```

```json
{
    "mcpServers": {
        "fmz": {
            "url": "https://www.fmz.com/api/mcp/<Access Key>",
            "headers": {"Authorization": "Bearer <Secret Key>"}
        }
    }
}
```

The JSON is for Cursor (```~/.cursor/mcp.json```) and other clients that speak Streamable HTTP; Claude Desktop needs the ```npx mcp-remote``` bridge described in the setup page.

### Install the skills (recommended)

The skills are knowledge packs written for AI assistants: platform workflow, the full API reference, how to write strategies in each language, backtesting and indicators. With them installed the assistant writes noticeably more accurate strategies. In a terminal:

```bash
npx skills add fmzquant/skills --global --yes -a claude-code
```

Put your assistant's name after ```-a``` (claude-code, codex, cursor, gemini-cli, ...). They can also be read on GitHub: ```https://github.com/fmzquant/skills```.

### Available tools

Once connected the assistant can use the tools below; the list the assistant sees is authoritative:

- ```read```: ```ping```, ```get_account_summary```, ```list_exchanges```, ```list_platforms```, ```list_nodes```, ```list_strategies```, ```get_strategy```, ```list_strategy_versions```, ```get_strategy_version```, ```list_robots```, ```get_robot```, ```get_robot_logs```, ```get_robot_profit```, ```get_robot_output```, ```list_messages```, ```list_groups```, ```revoke_my_key```
- ```backtest```: ```run_backtest```, ```get_backtest```, ```list_backtests```, ```stop_backtest```
- ```write```: ```check_strategy```, ```save_strategy```, ```save_strategy_version```, ```delete_strategy_version```, ```update_robot```, ```save_group```, ```move_to_group```, ```delete_group```, ```set_robot_alert```, ```set_node_alert```, ```delete_messages```
- ```trade```: ```create_robot```, ```start_robot```, ```stop_robot```, ```restart_robot```, ```send_robot_command```, and the trading terminal plugin tools ```plugin_*``` (market data, orders, ...)
- ```danger```: ```delete_strategy```, ```delete_robot```, ```delete_node```, ```publish_strategy```

A typical session: ```list_platforms``` and ```list_nodes``` to see which exchange accounts and nodes the account has; ```save_strategy``` to save a strategy and ```check_strategy``` to check it; ```run_backtest``` and ```get_backtest``` to backtest; then ```create_robot``` to go live and ```get_robot``` / ```get_robot_logs``` to watch it.

### Security and management

- Exchange API KEYs never pass through the assistant: add them on the Exchanges page of the website and the assistant picks them by id. No tool result ever contains a secret.
- At ```https://www.fmz.com/m/account#apikey``` you can see the key the assistant uses, change its permissions or lock it. Besides the permission names above, permissions can list tool names, and ```!tool_name``` excludes one tool.
- When you are done, ask the assistant to call ```revoke_my_key``` to revoke its own key, or delete it on that page.
- ```stop_robot``` stops live trading; it does not close positions.
- The first time the assistant creates live trading, backtest first and then run on a demo account or with a small amount.

### Common problems

- No online node: live trading needs at least one online node, see Platform Basics → Nodes.
- Too many backtests: concurrent backtests are limited; have the assistant ```stop_backtest``` the ones it no longer needs.
- The assistant says a tool is missing or a call is refused: the key lacks that permission; change it on the API KEY page and reconnect.

The same API key also works with the `Extended API` for scripts and schedulers; prefer MCP wherever it can be used.

## Create ApiKey

On the [Account Settings → API KEY](https://www.fmz.com/m/account#apikey) page (```/m/account#apikey```), click "Create New ApiKey" to get an ```AccessKey``` and a ```SecretKey```. The ```SecretKey``` carries every permission of the key; keep it secret. The same page lets you change the permissions of existing keys, or disable and delete them.

### Permissions

When creating or editing a key, enter a comma-separated list in the "API Permissions" field:

- ```*```: allow all extended API methods.
- Method names: allow only the listed methods, e.g. ```GetRobotList,GetRobotDetail,CommandRobot```.
- ```!MethodName```: exclude a method, usually together with ```*```, e.g. ```*,!DeleteRobot,!DeleteNode```.

The same API KEY can also be used for AI Integration (the MCP service, see `AI Integration`). Besides method names (tool names for MCP), permissions can be granted by category: ```read```, ```backtest```, ```write```, ```trade```, ```danger``` (see the AI Integration page), and ```!name``` excludes as well. Categories apply to MCP tools and extended API methods alike. The categories of the extended API methods:

- ```read```: ```GetAccount```, ```GetExchangeList```, ```GetNodeList```, ```GetPlatformList```, ```GetRobotGroupList```, ```GetRobotList```, ```GetRobotDetail```, ```GetRobotLogs```, ```GetStrategyList```;
- ```trade```: ```NewRobot```, ```RestartRobot```, ```StopRobot```, ```CommandRobot```, ```PluginRun```;
- ```danger```: ```DeleteRobot```, ```DeleteNode```.

Order of evaluation: an explicitly listed method name (including a ```!name``` exclusion) comes first, then the category, then ```*```. For example, a key with just ```read``` can call ```GetRobotList``` but not ```NewRobot```; ```*,!trade``` allows every method outside the ```trade``` category.

With an empty permission list the extended API does not restrict methods (MCP allows every tool except ```danger```). Grant only what each use needs, e.g. a key used only for TradingView alerts should get ```CommandRobot``` and nothing else.

## Authentication Methods

The extended API supports two authentication methods: signature authentication and direct authentication.

- `Signature authentication`: the request parameters are signed with the ```SecretKey```, which itself never travels over the network. Programs should use this method.
- `Direct verification`: the ```SecretKey``` is put into the request URL itself; meant for webhooks such as TradingView that accept only a single URL.

### Token Authentication

Signature authentication signs the request parameters with an MD5 hash that includes the ```SecretKey```, so the ```SecretKey``` itself never travels over the network; programs calling the extended API should use it.

#### Request format

Send a ```POST``` request to ```https://www.fmz.com/api/v1``` with the parameters as a form (```application/x-www-form-urlencoded```). The server also accepts the same parameters in the URL query string of a ```GET``` request, but then they end up in access logs along the way, so ```POST``` is recommended.

| Parameter | Description |
| - | - |
| version | Version, always ```1.0```. |
| access_key | The ```AccessKey``` of the API KEY. |
| method | Method name, e.g. ```GetNodeList```. |
| args | Method parameters as a JSON string (an array or an object, see below the table); ```[]``` when omitted. |
| nonce | Millisecond timestamp, within 1 hour of server time and greater than this API key's previous ```nonce```. |
| sign | Signature, computed as described below. |

```args``` is either an array in parameter order (e.g. ```[]```, ```[123, "ok"]```) or an object keyed by parameter name (e.g. ```{"robotId": 123}```); see `Extended API Interface Details`. The request does not contain the ```SecretKey```.

#### Signature

Concatenate the string below, where ```args``` is the exact JSON string being submitted:

```plaintext
version + "|" + method + "|" + args + "|" + nonce + "|" + secretKey
```

Compute the MD5 of the result and use its 32-character lowercase hexadecimal form as ```sign```.

#### Python example

```python
import hashlib
import json
import time
import urllib.parse
import urllib.request

ACCESS_KEY = ''   # AccessKey of the API KEY
SECRET_KEY = ''   # SecretKey of the API KEY

def api(method, *args, **kwargs):
    d = {
        'version': '1.0',
        'access_key': ACCESS_KEY,
        'method': method,
        # Positional arguments are sent as an array, keyword arguments as an object (by name)
        'args': json.dumps(kwargs if kwargs else list(args)),
        'nonce': int(time.time() * 1000),
    }
    s = '%s|%s|%s|%d|%s' % (d['version'], d['method'], d['args'], d['nonce'], SECRET_KEY)
    d['sign'] = hashlib.md5(s.encode('utf-8')).hexdigest()
    body = urllib.parse.urlencode(d).encode('utf-8')
    with urllib.request.urlopen('https://www.fmz.com/api/v1', body, timeout=10) as resp:
        return json.loads(resp.read().decode('utf-8'))

print(api('GetNodeList'))                             # Docker list
print(api('GetRobotList', appId='member2'))           # By name: robots labeled member2
print(api('CommandRobot', 123, 'ok'))                 # Send an interactive command to robot 123
print(api('GetRobotDetail', 123))                     # Details of robot 123
```

#### Go example

```go
package main

import (
    "crypto/md5"
    "encoding/hex"
    "encoding/json"
    "fmt"
    "io"
    "net/http"
    "net/url"
    "strconv"
    "time"
)

const (
    accessKey = "" // AccessKey of the API KEY
    secretKey = "" // SecretKey of the API KEY
    baseAPI   = "https://www.fmz.com/api/v1"
)

var client = &http.Client{Timeout: 10 * time.Second}

func api(method string, args ...interface{}) (string, error) {
    if args == nil {
        args = []interface{}{}
    }
    b, err := json.Marshal(args)
    if err != nil {
        return "", err
    }
    nonce := strconv.FormatInt(time.Now().UnixMilli(), 10)
    sum := md5.Sum([]byte("1.0|" + method + "|" + string(b) + "|" + nonce + "|" + secretKey))
    form := url.Values{
        "version":    {"1.0"},
        "access_key": {accessKey},
        "method":     {method},
        "args":       {string(b)},
        "nonce":      {nonce},
        "sign":       {hex.EncodeToString(sum[:])},
    }
    resp, err := client.PostForm(baseAPI, form)
    if err != nil {
        return "", err
    }
    defer resp.Body.Close()
    body, err := io.ReadAll(resp.Body)
    return string(body), err
}

func main() {
    ret, err := api("GetNodeList")
    fmt.Println(ret, err)

    // restart robot 123 with a new configuration; settings: see Extended API Interface Details
    settings := map[string]interface{}{
        "name":     "hedge test",
        "strategy": 456,
        "period":   60,
        "node":     789,
        "exchanges": []interface{}{
            map[string]interface{}{"pid": 1001, "pair": "BTC_USDT"},
        },
    }
    ret, err = api("RestartRobot", 123, settings)
    fmt.Println(ret, err)
}
```

### Direct Verification

Puts the ```secret_key``` into the request parameters instead of computing a signature. This produces a fixed URL that can be entered into webhooks such as TradingView that accept only a single URL.

> **Security note**: a ```secret_key``` in a URL ends up in browser history, proxy and server access logs, and the webhook provider's configuration; anyone who obtains the URL can call the API with this key's permissions. Use direct verification only for ```CommandRobot``` webhooks, and create a dedicated API KEY for it that is granted ```CommandRobot``` only (see `Create ApiKey`). If it leaks, delete that API KEY immediately.

The request parameters are ```access_key```, ```secret_key```, ```method``` and ```args``` (a JSON array, URL-encoded); ```version```, ```nonce``` and ```sign``` are not needed. ```CommandRobot``` skips the ```nonce``` check; other methods are still checked: without a ```nonce``` the server uses the current time (to the second), so a second call within the same second returns a nonce error (```code``` 3).

For example, with an API KEY whose ```AccessKey``` is ```xxx``` and ```SecretKey``` is ```yyy```, opening the URL below sends the interactive command ```ok12345``` to the robot with ID ```186515```:

```plaintext
https://www.fmz.com/api/v1?access_key=xxx&secret_key=yyy&method=CommandRobot&args=%5B186515%2C%22ok12345%22%5D
```

#### Receiving a webhook body

When the command argument of ```CommandRobot``` is an empty string and the request is a ```POST```, the server sends the request body to the robot as the interactive command. The body must be JSON or plain text, not form-encoded (a body sent with ```Content-Type: application/x-www-form-urlencoded``` is consumed as a form first and the command becomes an empty string). For example, set the TradingView webhook URL to:

```plaintext
https://www.fmz.com/api/v1?access_key=xxx&secret_key=yyy&method=CommandRobot&args=%5B186515%2C+%22%22%5D
```

The ```args``` value ```%5B186515%2C+%22%22%5D``` decodes to ```[186515, ""]``` (```+``` is a URL-encoded space): ```186515``` is the robot ID and the command is an empty string.

Simulating a TradingView webhook alert:

```javascript
function main() {
    var options = {
        method: "POST",
        body: `{"test": 123}`,
        headers: {"Content-Type": "application/json"}
    }

    // A webhook alert sends a POST request with the required headers automatically
    var url = "https://www.fmz.com/api/v1?access_key=xxx&secret_key=yyy" +
        "&method=CommandRobot&args=%5B186515%2C+%22%22%5D"
    return HttpQuery(url, options)
}
```

The content of the TradingView alert message box is the request body:

- JSON format:

  ![TradingView alert message (JSON format)](https://www.fmz.com/upload/asset/16d8a37ef80d9ccd0079.png)

  ```plaintext
  {"close": {{close}}, "name": "aaa"}
  ```

  The robot with ID ```186515``` receives the interactive command ```{"close": 39773.75, "name": "aaa"}```.

- Text format:

  ![TradingView alert message (text format)](https://www.fmz.com/upload/asset/16d8a506dfbb6c60a077.png)

  ```plaintext
  BTCUSDTPERP Crossing 39700.00 close: {{close}}
  ```

  The robot with ID ```186515``` receives the interactive command ```BTCUSDTPERP Crossing 39700.00 close: 39739.4```.

#### Python and Go examples

```python
import json
import urllib.parse
import urllib.request

ACCESS_KEY = ''   # AccessKey of an API KEY granted CommandRobot only
SECRET_KEY = ''   # SecretKey

def api(method, *args):
    query = urllib.parse.urlencode({
        'access_key': ACCESS_KEY,
        'secret_key': SECRET_KEY,
        'method': method,
        'args': json.dumps(list(args)),
    })
    with urllib.request.urlopen('https://www.fmz.com/api/v1?' + query, timeout=10) as resp:
        return json.loads(resp.read().decode('utf-8'))

# Without permission for the method the result is {'code': 4, 'data': None}
print(api('CommandRobot', 186515, 'ok12345'))
```

```go
package main

import (
    "encoding/json"
    "fmt"
    "io"
    "net/http"
    "net/url"
    "time"
)

const (
    accessKey = "" // AccessKey of an API KEY granted CommandRobot only
    secretKey = "" // SecretKey
    baseAPI   = "https://www.fmz.com/api/v1"
)

var client = &http.Client{Timeout: 10 * time.Second}

func api(method string, args ...interface{}) (string, error) {
    if args == nil {
        args = []interface{}{}
    }
    b, err := json.Marshal(args)
    if err != nil {
        return "", err
    }
    q := url.Values{
        "access_key": {accessKey},
        "secret_key": {secretKey},
        "method":     {method},
        "args":       {string(b)},
    }
    resp, err := client.Get(baseAPI + "?" + q.Encode())
    if err != nil {
        return "", err
    }
    defer resp.Body.Close()
    body, err := io.ReadAll(resp.Body)
    return string(body), err
}

func main() {
    ret, err := api("CommandRobot", 186515, "ok12345")
    fmt.Println(ret, err)
}
```

References:

- [Trading on TradingView alert signals with the FMZ extended API](https://www.fmz.com/digest-topic/5533)
- [Trading on TradingView alert signals with the FMZ extended API (video, Bilibili)](https://www.bilibili.com/video/BV1Wk4y1k7zz/)

## Extended API Interface Details

All methods are called through ```https://www.fmz.com/api/v1```; for the request format and signature see `Token Authentication`, for the response structure and error codes see `Extended API Interface Return Codes`. The ```api()``` used in the examples on the method pages is the function from the Python example on the signature authentication page.

### Method overview

| Object | Method | Parameters (in order; bracketed ones are optional) | Description | Notes |
| - | - | - | - | - |
| Account | `GetAccount` | none | Account information | Read-only |
| Docker | `GetNodeList` | [offset, limit] | Docker list | Read-only |
| Docker | `DeleteNode` | nid | Delete a docker | Deletes, cannot be undone |
| Exchange | `GetExchangeList` | isSummary | Exchanges supported by the platform and their settings | Read-only |
| Exchange | `GetPlatformList` | [offset, limit] | Exchange accounts you added | Read-only |
| Strategy | `GetStrategyList` | offset, length, strategyType, category, language, kw[, groupId, orderBy] | Strategy list | Read-only |
| Robot | `GetRobotGroupList` | none | Robot groups | Read-only |
| Robot | `GetRobotList` | [offset, length, customStatus, appId, kw, groupId, orderBy, strategyId] | Robot list | Read-only |
| Robot | `GetRobotDetail` | robotId | Robot details | Read-only |
| Robot | `GetRobotLogs` | robotId, logMinId, …, summaryLimit[, logExchange, logKeyword, logTypes] | Logs, profit, chart and status bar data | Read-only |
| Robot | `NewRobot` | settings | Create and start a robot | Charges fees; the robot trades for real |
| Robot | `RestartRobot` | robotId[, settings] | Start (restart) a robot | Charges fees; the robot trades for real |
| Robot | `StopRobot` | robotId | Stop a robot | Does not close positions |
| Robot | `CommandRobot` | robotId, cmd | Send an interactive command | The strategy may place orders on it |
| Robot | `DeleteRobot` | robotId[, removeLog] | Delete a robot | Deletes, cannot be undone |
| Debugging | `PluginRun` | settings | Run a piece of code on a docker | The code can place real orders |
| Channel | `pub` | robot, channel (URL parameters); the message goes in the request body | Push a message to a channel a robot subscribed to | No API key, no signature |

The API key needs permission for the method, see `Create ApiKey`.

### Passing parameters

```args``` can be written in two ways:

- Array: positional parameters in the order of the table above, e.g. ```[123, "ok"]```. Positional calls accept only certain numbers of arguments; any other count returns a ```Params number mismatch``` error:
  - GetNodeList, GetPlatformList: 0 or 2.
  - GetStrategyList: 0, 6, 7 or 8; with no arguments ```language``` is ```1``` (only Python strategies), see `GetStrategyList`.
  - GetRobotList: 0, 1, 3, 5, 6, 7 or 8; a single argument is taken as ```appId```.
  - GetRobotLogs: 15 to 19 (with 15 the status bar is not queried).
  - RestartRobot, DeleteRobot: 1 or 2; when DeleteRobot gets only ```robotId```, ```removeLog``` is ```false```.
- Object: values by parameter name, e.g. ```{"robotId": 123, "cmd": "ok"}```. Names are case-insensitive and underscores are ignored; omitted parameters take their defaults. Recommended for methods with many optional parameters (GetRobotList, GetRobotLogs, GetStrategyList).

### Robot configuration (settings)

The ```settings``` parameter of NewRobot, RestartRobot and PluginRun is a JSON object; common fields:

| Field | Description |
| - | - |
| name | Robot name. |
| strategy | Strategy ID, see GetStrategyList. RestartRobot cannot change a robot's strategy. |
| args | Strategy parameters, each element ```["name", value]```, e.g. ```[["Interval", 500]]```; ```[]``` if the strategy has none. |
| exchanges | Array of exchange object configurations, one element per exchange object, see below. |
| period | Default K-line period in seconds, e.g. ```60```, ```3600```; 60 seconds when omitted. Pass 60 or more; see below the table. |
| node | ID of the docker that runs the robot, see GetNodeList; omitted or ```-1``` means automatic assignment. |
| group | Robot group ID, see GetRobotGroupList. |
| appid | Custom label; GetRobotList can filter by it. |

A ```period``` of ```0```, ```1```, ```2```, ```3```, ```4```, ```5```, ```10``` or ```12``` is read as an old period number (1 minute, 3 minutes, 5 minutes, 15 minutes, 30 minutes, 1 hour, 1 day, 1 week respectively); for example ```1``` actually means 180 seconds.

An ```exchanges``` element takes one of two forms, which cannot be mixed in one array (the first element decides):

- Reference an exchange account added on the platform: ```{"pid": 123, "pair": "BTC_USDT"}```. ```pid``` is the ```id``` returned by GetPlatformList.
- Pass the exchange configuration directly: ```{"eid": "Binance", "label": "test", "pair": "BTC_USDT", "meta": {"AccessKey": "...", "SecretKey": "..."}}```. ```eid``` is the exchange ID; the field names of ```meta``` are given by the ```meta``` returned by GetExchangeList; ```label``` is the exchange object's label, read in the strategy with ```exchange.GetLabel()```. The platform does not store the keys in ```meta``` but forwards them to the docker, so a robot created this way needs ```settings``` again on every restart.

For a custom-protocol exchange: ```{"eid": "Exchange", "label": "test", "pair": "BTC_USDT", "meta": {"AccessKey": "...", "SecretKey": "...", "Front": "http://127.0.0.1:6666/test"}}```, where ```Front``` is the address of the custom-protocol service.

#### GetAccount

Gets the account information of the account that owns the API key, including the balance and the total amount spent.

Fields:

- `balance` (number): Account balance in USD, as an integer scaled by 1e8; divide by 1e8 for the actual value (229.44702436 in the example).
- `consumed` (number): Total amount spent, in the same unit and scaling as ```balance```.
- `username` (string): User name.
- `email` (string): Account email.
- `uid` (string): Account UID.

Returns (object): On success ```data.result``` is the account information; its fields are in the attributes table below.

Query the account balance.

```python
# api() is the function in the Python example on the signature authentication page
r = api('GetAccount')
print(r['data']['result']['balance'] / 1e8)   # output: 229.44702436 (USD)
```

##### Example response

```json
{
    "code": 0,
    "data": {
        "result": {
            "balance": 22944702436,
            "concurrent": 0,
            "consumed": 211092719653,
            "email": "123@qq.com",
            "openai": false,
            "settings": {},
            "sns": {"wechat": true},
            "uid": "105ea6e51bcc177926a10fdbb7e2a1d6",
            "username": "abc"
        },
        "error": null
    }
}
```

#### GetNodeList

Gets the dockers the account can use, including its own dockers and the platform's public dockers.

Parameters:

- `offset` (number, optional): Paging offset, 0 by default.
- `limit` (number, optional): Page size; omitted or less than or equal to 0 returns all.

Fields:

- `all` (number): Total number of dockers (public dockers included).
- `nodes` (array): Array of dockers; the fields of each element are in the rows below (self-explanatory fields are not listed).
- `nodes[].id` (number): Docker ID, the ```node``` of a robot configuration.
- `nodes[].build` (string): Version number.
- `nodes[].version` (string): Detailed version information of the docker.
- `nodes[].online` (bool): Whether the docker is online.
- `nodes[].is_owner` (bool): ```true``` for a private docker, ```false``` for a public one.
- `nodes[].public` (number): ```0``` for a private docker, ```1``` for a public one.
- `nodes[].loaded` (number): Load: the number of strategy instances running on the docker.
- `nodes[].city` (string): City.
- `nodes[].region` (string): Region.
- `nodes[].wd` (number): Whether the offline alert is on; ```0``` means off.

Returns (object): On success ```data.result``` holds the docker count ```all``` and the docker array ```nodes```; fields are in the attributes table below.

List all dockers and whether they are online.

```python
# api() is the function in the Python example on the signature authentication page
r = api('GetNodeList')
for node in r['data']['result']['nodes']:
    print(node['id'], node['name'], node['online'])
```

Dockers rented with one click have extra fields starting with ```ecs_``` and ```unit_```, recording the server's provider, configuration and state, and the billing period and price.

##### Example response

```json
{
    "code": 0,
    "data": {
        "result": {
            "all": 1,
            "nodes": [{
                "build": "3.7",
                "city": "...",
                "created": "2024-11-08 09:21:08",
                "date": "2024-11-08 16:37:16",
                "forward": "...",
                "guid": "...",
                "host": "node.fmz.com:9902",
                "id": 123,
                "ip": "...",
                "is_owner": true,
                "loaded": 0,
                "name": "MacBook-Pro-2.local",
                "online": true,
                "os": "darwin/amd64",
                "peer": "...",
                "public": 0,
                "region": "...",
                "tunnel": false,
                "version": "...",
                "wd": 0
            }]
        },
        "error": null
    }
}
```

#### DeleteNode

Deletes a docker of the account; an online docker is forced to log out and all robots on it become "strategy error". Deletion cannot be undone.

Parameters:

- `nid` (number, required): ID of the docker to delete; see ```GetNodeList```.

Returns (bool): ```data.result``` is ```true``` when the docker record was deleted: the platform forces the online docker to log out and sets all robots on it to "strategy error" (status code ```5```). It is ```false``` when the docker does not exist, does not belong to the account, or cannot be forced to log out.

Delete the docker with ID 123.

```python
# api() is the function in the Python example on the signature authentication page
r = api('DeleteNode', 123)
print(r)   # output: {'code': 0, 'data': {'result': True, 'error': None}}
```

#### GetExchangeList

Gets the exchanges the platform supports and the configuration fields each of them needs.

Parameters:

- `isSummary` (bool, required): ```true``` returns only summary information, without ```meta``` and ```stocks```; ```false``` returns everything.

Fields:

- `exchanges[].eid` (string): Exchange ID, e.g. ```Futures_Binance```; used when a robot configuration passes an exchange configuration directly.
- `exchanges[].name` (string): Display name, written ```Chinese|English```.
- `exchanges[].category` (string): Category.
- `exchanges[].meta` (string): Metadata of the exchange's configuration fields (JSON text), returned only when ```isSummary``` is ```false```; the field names of ```meta``` in a robot configuration come from here.
- `exchanges[].stocks` (string): Common trading pairs, comma-separated, returned only when ```isSummary``` is ```false```.

Returns (object): On success ```data.result.exchanges``` is the array of exchanges; fields are in the attributes table below.

List the supported exchange IDs and names (summary).

```python
# api() is the function in the Python example on the signature authentication page
r = api('GetExchangeList', True)
for e in r['data']['result']['exchanges']:
    print(e['eid'], e['name'])
```

##### Example response (isSummary false)

```json
{
    "code": 0,
    "data": {
        "result": {
            "exchanges": [{
                "category": "加密货币||Crypto",
                "eid": "Futures_Binance",
                "id": 74,
                "logo": "/upload/asset/d8d84b23e573e9326b99.svg",
                "meta": "[...]",
                "name": "币安期货|Futures_Binance",
                "priority": 200,
                "stocks": "BTC_USDT,ETH_USDT,ETH_USD",
                "website": "https://accounts.binance.com/zh-TC/register?ref=45110270"
            }]
        },
        "error": null
    }
}
```

```meta``` is JSON text; parsed, it is an array of configuration fields:

```json
[
    {"desc": "Access Key", "qr": "apiKey", "required": true, "type": "string",
     "name": "AccessKey", "label": "Access Key"},
    {"encrypt": true, "qr": "secretKey", "name": "SecretKey", "required": true,
     "label": "Secret Key", "type": "password", "desc": "Secret Key"}
]
```

##### Example response (isSummary true)

```json
{
    "code": 0,
    "data": {
        "result": {
            "exchanges": [{
                "category": "加密货币||Crypto",
                "eid": "Futures_Binance",
                "id": 74,
                "logo": "/upload/asset/d8d84b23e573e9326b99.svg",
                "name": "币安期货|Futures_Binance",
                "priority": 200,
                "website": "https://accounts.binance.com/zh-TC/register?ref=45110270"
            }]
        },
        "error": null
    }
}
```

#### GetPlatformList

Gets the exchange accounts added to the account.

Parameters:

- `offset` (number, optional): Paging offset, 0 by default.
- `limit` (number, optional): Page size; omitted or less than or equal to 0 returns all.

Fields:

- `all` (number): Number of exchange accounts added.
- `platforms[].id` (number): Exchange account ID, the ```pid``` in the ```exchanges``` of a robot configuration.
- `platforms[].eid` (string): Exchange ID, used in some configurations and parameters.
- `platforms[].label` (string): The label set when the account was added.
- `platforms[].stocks` (array): Common trading pairs.

Returns (object): On success ```data.result``` holds the account count ```all``` and the array of exchange accounts ```platforms```; fields are in the attributes table below.

List the added exchange accounts to get the ```pid``` used in robot configurations.

```python
# api() is the function in the Python example on the signature authentication page
r = api('GetPlatformList')
for p in r['data']['result']['platforms']:
    print(p['id'], p['eid'], p['label'])
```

##### Example response

```json
{
    "code": 0,
    "data": {
        "result": {
            "all": 2,
            "platforms": [{
                "category": "加密货币||Crypto",
                "date": "2023-12-07 13:44:52",
                "eid": "Binance",
                "id": 123,
                "label": "Binance",
                "logo": "...",
                "name": "币安现货|Binance",
                "stocks": ["BTC_USDT", "LTC_USDT", "ETH_USDT", "ETC_USDT",
                           "BTC_TUSD", "ETH_TUSD", "BNB_TUSD"],
                "website": "..."
            }, {
                "category": "通用协议|Custom Protocol",
                "date": "2020-11-09 11:23:48",
                "eid": "Exchange",
                "id": 123,
                "label": "XX exchange REST protocol",
                "logo": "...",
                "name": "通用协议|Custom Protocol",
                "stocks": ["BTC_USDT", "ETH_USDT"],
                "website": ""
            }]
        },
        "error": null
    }
}
```

#### GetStrategyList

Queries strategies by scope, type, language, keyword and other conditions.

Parameters:

- `offset` (number, required): Paging offset.
- `length` (number, required): Page size; less than or equal to 0 returns all.
- `strategyType` (number, required): Scope, e.g. ```-3``` for only your own strategies; values are listed in the remarks.
- `category` (number, required): Strategy type: ```-1``` all, ```0``` normal strategy, ```20``` template library, ```21``` trading plugin.
- `language` (number, required): Programming language, ```-1``` for all; values are listed in the remarks.
- `kw` (string, required): Keyword matched fuzzily against strategy names, several words separated by spaces; an empty string means no filter. Starting with ```id:``` queries by strategy ID, e.g. ```id:123,456```.
- `groupId` (number, optional): Strategy group: ```-1``` all (default), ```0``` ungrouped, greater than 0 a specific group. Applies only to your own strategies.
- `orderBy` (string, optional): Sort field: ```name```, ```last_modified``` or ```date```; append ``` asc``` for ascending (descending by default); an empty string is the default order.

Fields:

- `all` (number): Total number of matching strategies.
- `strategies` (array): Array of strategies.
- `strategies[].id` (number): Strategy ID, the ```strategy``` of a robot configuration.
- `strategies[].category` (number): Strategy type, same values as the ```category``` argument.
- `strategies[].language` (number): Programming language, same values as the ```language``` argument.

Returns (object): On success ```data.result``` holds the strategy count ```all``` and the strategy array ```strategies```; fields are in the attributes table below.

Get your first 10 strategies with positional arguments, or all your Rust strategies with named arguments.

```python
# api() is the function in the Python example on the signature authentication page
r = api('GetStrategyList', 0, 10, -3, -1, -1, '')          # your first 10 strategies
r = api('GetStrategyList', strategyType=-3, language=7)    # all your Rust strategies
for s in r['data']['result']['strategies']:
    print(s['id'], s['name'])
```

There is no ```needArgs``` parameter: passing an extra argument after ```category``` as old documentation did shifts the following arguments. Pass the arguments in the order above, or by name.

Positional calls accept only 0, 6, 7 or 8 arguments. With no arguments (```args``` is ```[]```) the server fills in ```(-1, -1, -1, -1, 1, "")```, so ```language``` is ```1``` and only Python strategies are returned; to get all languages pass ```language``` as ```-1```, or pass arguments by name (then ```language``` defaults to ```-1```).

##### Parameter values

```strategyType``` (scope):

| Value | Meaning |
| - | - |
| ```-1``` | Your own and rented strategies (official strategies included) |
| ```0``` | Your own and rented strategies (official strategies excluded) |
| ```-3``` | Only your own strategies |
| ```-6``` | Only rented strategies (expired ones included) |
| ```-4``` | Official strategies |
| ```-2``` | Public and paid strategies in the strategy square |
| ```1``` | Published strategies |
| ```2``` | Strategies pending review |

```category``` (strategy type): ```-1``` all, ```0``` normal strategy, ```20``` template library, ```21``` trading plugin.

```language``` (programming language):

| Value | Meaning |
| - | - |
| ```-1``` | All languages |
| ```0``` | JavaScript |
| ```1``` | Python |
| ```3``` | A discontinued strategy type that appears only in existing strategies |
| ```4``` | My language |
| ```5``` | PINE |
| ```6``` | Workflow |
| ```7``` | Rust |

##### Example response

```json
{
    "code": 0,
    "data": {
        "result": {
            "all": 123,
            "strategies": [{
                "category": 0,
                "date": "2024-11-10 20:40:04",
                "description": "",
                "forked": 0,
                "hits": 0,
                "id": 123,
                "is_buy": false,
                "is_owner": false,
                "language": 0,
                "last_modified": "2024-11-11 17:23:52",
                "name": "HedgeGridStrategy",
                "profile": {
                    "avatar": "...",
                    "nickname": "abc",
                    "uid": "4ed225440db1eda23fe05ed10184113e"
                },
                "public": 0,
                "tags": "",
                "uid": "4ed225440db1eda23fe05ed10184113e",
                "username": "abc"
            }]
        },
        "error": null
    }
}
```

#### GetRobotGroupList

Gets the robot groups of the account; the "Default" group is not listed.

Fields:

- `items[].id` (number): Robot group ID, the ```group``` of a robot configuration.
- `items[].name` (string): Robot group name.

Returns (object): On success ```data.result.items``` is the array of groups; it contains only groups you created, not the "Default" group.

List the robot groups.

```python
# api() is the function in the Python example on the signature authentication page
r = api('GetRobotGroupList')
for g in r['data']['result']['items']:
    print(g['id'], g['name'])
```

##### Example response

```json
{
    "code": 0,
    "data": {
        "result": {
            "items": [{
                "id": 3417,
                "name": "test"
            }, {
                "id": 3608,
                "name": "demo"
            }]
        },
        "error": null
    }
}
```

#### GetRobotList

Gets the robots of the account, optionally filtered by status, label, name, group or strategy; all arguments can be omitted.

Parameters:

- `offset` (number, optional): Paging offset, 0 by default.
- `length` (number, optional): Page size; less than or equal to 0 returns all (default).
- `customStatus` (number, optional): Filter by robot status code, see `Live Trading Status Codes`; ```-1``` returns all robots (default), ```-2``` all robots sorted by start time.
- `appId` (string, optional): Filter by the robot's custom label (```appid``` in ```settings``` at creation); an empty string means no filter.
- `kw` (string, optional): Keyword matched fuzzily against robot names; an empty string means no filter.
- `groupId` (number, optional): Robot group: ```-1``` all (default), ```0``` ungrouped, greater than 0 a specific group.
- `orderBy` (string, optional): Sort field: ```name```, ```status```, ```node```, ```profit```, ```date```, ```refresh```, ```start_time``` or ```strategy_name```; append ``` asc``` for ascending (descending by default); an empty string is the default order.
- `strategyId` (number, optional): When greater than 0, only robots of this strategy are returned; 0 (no filter) by default.

Fields:

- `all` (number): Total number of matching robots.
- `robots` (array): Array of robots.
- `robots[].id` (number): Robot ID.
- `robots[].status` (number): Robot status code, see `Live Trading Status Codes`.
- `robots[].group_id` (number): Robot group ID; robots in the default group have no such field.

Returns (object): On success ```data.result``` holds the robot count ```all``` and the robot array ```robots```; fields are in the attributes table below.

Get all robots, filter by label, and pass arguments by position or by name.

```python
# api() is the function in the Python example on the signature authentication page
r = api('GetRobotList')                               # all robots
# a single string is taken as the label: all robots labeled member2
r = api('GetRobotList', 'member2')
# positional: up to 100 robots labeled member2, starting at offset 0
r = api('GetRobotList', 0, 100, -1, 'member2', '')
r = api('GetRobotList', appId='member2', length=100)  # by name, same as above
for robot in r['data']['result']['robots']:
    print(robot['id'], robot['name'], robot['status'])
```

##### Example response

```json
{
    "code": 0,
    "data": {
        "result": {
            "all": 1,
            "concurrent": 0,
            "robots": [{
                "charge_time": 1731654846,
                "date": "2024-11-12 14:05:29",
                "end_time": "2024-11-15 14:56:32",
                "fixed_id": 4509153,
                "id": 591026,
                "is_sandbox": 0,
                "name": "test",
                "node_guid": "45891bcf3d57f99b08a43dff76ee1ea1",
                "node_id": 4519153,
                "node_public": 0,
                "profit": 0,
                "public": 0,
                "refresh": 1731651257000,
                "start_time": "2024-11-15 14:56:30",
                "status": 3,
                "strategy_id": 411670,
                "strategy_isowner": true,
                "strategy_language": 0,
                "strategy_name": "test",
                "strategy_public": 0,
                "uid": "105ed6e511cc977921610fdbb7e2a1d6",
                "wd": 0
            }]
        },
        "error": null
    }
}
```

#### GetRobotDetail

Gets the details of one robot of the account, including its status, billing, exchange configuration and strategy arguments.

Parameters:

- `robotId` (number, required): Robot ID; see ```GetRobotList```.

Fields:

- `robot.status` (number): Robot status code, see `Live Trading Status Codes`.
- `robot.name` (string): Robot name.
- `robot.date` (string): Creation date.
- `robot.charge_time` (number): Next billing time (Unix timestamp in seconds), i.e. the end of the period already paid for.
- `robot.charged` (number): Total billed running time in seconds.
- `robot.consumed` (number): Total amount charged, in USD, as an integer scaled by 1e8; 5375000000 in the example is 53.75 USD.
- `robot.node_id` (number): Docker ID.
- `robot.fixed_id` (number): Docker ID set in the robot configuration; ```-1``` when assigned automatically.
- `robot.is_manager` (bool): Whether you may manage the robot.
- `robot.is_sandbox` (number): Whether it is a demo (sandbox) robot.
- `robot.pexchanges` (object): Exchange objects of the robot: keys are ```pid```, values are exchange IDs (```eid```), e.g. ```{"123": "Futures_OKX"}```.
- `robot.plabels` (object): Labels of the robot's exchange objects, keyed by ```pid```.
- `robot.strategy_exchange_pairs` (string): Default K-line period, exchange objects and trading pairs (JSON text); format in the remarks.
- `robot.profit` (number): Robot profit.
- `robot.public` (number): Whether the robot is public.
- `robot.refresh` (number): Last active time (millisecond timestamp).
- `robot.wd` (number): Whether the offline alert is on.

Returns (object): On success ```data.result.robot``` is the robot information; fields are in the attributes table below.

Query the status and exchange configuration of robot 123.

```python
# api() is the function in the Python example on the signature authentication page
r = api('GetRobotDetail', 123)
robot = r['data']['result']['robot']
print(robot['status'], robot['pexchanges'], robot['strategy_exchange_pairs'])
```

```strategy_exchange_pairs``` is the text of a JSON array, e.g. ```"[60,[44314,42960,15445,14703],[\"BTC_USDT\",\"BTC_USDT\",\"ETH_USDT\",\"ETH_USDT\"]]"```:

- ```60```: the default K-line period of the robot in seconds (1 minute here).
- ```[44314,42960,15445,14703]```: the ```pid``` of the robot's exchange objects, in the order they were added.
- ```["BTC_USDT","BTC_USDT","ETH_USDT","ETH_USDT"]```: the trading pair of each exchange object, matching the ```pid``` list in order.

##### Example response

```json
{
    "code": 0,
    "data": {
        "result": {
            "robot": {
                "charge_time": 1732246539,
                "charged": 5850000,
                "consumed": 5375000000,
                "date": "2018-12-28 14:34:51",
                "favorite": {
                    "added": false,
                    "type": "R"
                },
                "fixed_id": 123,
                "hits": 1,
                "id": 123,
                "is_deleted": 0,
                "is_manager": true,
                "is_sandbox": 0,
                "name": "test",
                "node_id": 123,
                "pexchanges": {
                    "123": "Futures_OKX"
                },
                "phash": {
                    "123": "ca1aca74b9cf7d8624f2af2dac01e36d"
                },
                "plabels": {
                    "123": "OKX futures"
                },
                "priority": 0,
                "profit": 0,
                "public": 0,
                "refresh": 1732244453000,
                "robot_args": "[]",
                "start_time": "2024-11-22 11:00:48",
                "status": 1,
                "strategy_args": "[]",
                "strategy_exchange_pairs": "[60,[123],[\"ETH_USDT\"]]",
                "strategy_id": 123,
                "strategy_last_modified": "2024-11-21 16:49:25",
                "strategy_name": "test",
                "strategy_public": "0",
                "uid": "105ed6e51bcc17792a610fdbb7e2a1d6",
                "username": "abc",
                "wd": 0
            }
        },
        "error": null
    }
}
```

#### GetRobotLogs

Gets the strategy log, profit log, chart data and status bar data of one robot of the account.

Parameters:

- `robotId` (number, required): Robot ID; see ```GetRobotList```.
- `logMinId` (number, required): Minimum ID of strategy log entries.
- `logMaxId` (number, required): Maximum ID of strategy log entries.
- `logOffset` (number, required): Number of records to skip within the range given by ```logMinId``` and ```logMaxId```.
- `logLimit` (number, required): Number of records to return from the starting position.
- `profitMinId` (number, required): Minimum ID of profit log entries.
- `profitMaxId` (number, required): Maximum ID of profit log entries.
- `profitOffset` (number, required): Number of records to skip.
- `profitLimit` (number, required): Number of records to return.
- `chartMinId` (number, required): Minimum ID of chart log entries.
- `chartMaxId` (number, required): Maximum ID of chart log entries.
- `chartOffset` (number, required): Number of records to skip.
- `chartLimit` (number, required): Number of records to return.
- `chartUpdateBaseId` (number, required): Base ID for querying updates.
- `chartUpdateDate` (number, required): Update timestamp; only newer records are returned.
- `summaryLimit` (number, required): Whether to return status bar data: ```0``` does not; greater than 0 returns it in ```summary``` (the value itself has no effect; at most 2MB).
- `logExchange` (string, optional): Return only logs of this exchange object (by label); an empty string means no filter.
- `logKeyword` (string, optional): Return only logs whose content contains this keyword; an empty string means no filter.
- `logTypes` (string, optional): Return only these log types, comma-separated type numbers, e.g. ```"0,1,2"``` for buy, sell and cancel logs; an empty string means all types.

Fields:

- `logs` (array): Three objects: the query results of the strategy log, profit log and chart log tables of the robot database, in that order; the ```Arr``` of each holds the records, formatted as described in the remarks.
- `summary` (string): Status bar data of the robot (returned when ```summaryLimit``` is greater than 0).
- `status` (number): Robot status code, see `Live Trading Status Codes`.

Returns (object): On success ```data.result``` holds the logs ```logs```, the status bar data ```summary``` and more; fields are in the attributes table below.

Query the latest 10 strategy log entries and the status bar of robot 123, passing arguments by name.

```python
# api() is the function in the Python example on the signature authentication page
r = api('GetRobotLogs', robotId=123, logLimit=10, summaryLimit=1)
result = r['data']['result']
for row in result['logs'][0]['Arr']:
    print(row)
print(result['summary'])   # status bar data
```

With this many parameters, passing them by name is recommended (missing ones take their defaults); positional calls take 15 to 19 arguments (with 15 the status bar is not queried). The three filters ```logExchange```, ```logKeyword``` and ```logTypes``` work only on new dockers; old dockers ignore them and return all logs.

##### logs[0]: strategy log

Each entry of ```logs[0].Arr``` is an array of: log ID (```id```), log type (```logType```), label of the exchange object (```platformId```), order ID (```orderId```), price (```price```), amount (```amount```), extra message of the log (```extra```), timestamp (```date```), contract code (```contractType```), direction (```direction```). For example:

```plaintext
"Arr": [
    [3977, 3, "Futures_OKX", "", 0, 0, "Sell(688.9, 2): 20016", 1526954372591, "", ""],
    [3976, 5, "", "", 0, 0, "this_week too many positions, long: 2", 1526954372410, "", ""]
]
```

Values of ```logType```:

| logType | Name | Meaning |
| - | - | - |
| 0 | BUY | Buy order |
| 1 | SALE | Sell order |
| 2 | RETRACT | Order cancelled |
| 3 | ERROR | Error |
| 4 | PROFIT | Profit |
| 5 | MESSAGE | Log message |
| 6 | RESTART | Restart |

##### logs[1]: profit log

The same as the profit entries of the strategy log; each entry is log ID, profit value, timestamp. In ```[202, 2515.44, 1575896700315]```, ```202``` is the log ID, ```2515.44``` the profit and ```1575896700315``` the timestamp:

```plaintext
"Arr": [
    [202, 2515.44, 1575896700315],
    [201, 1415.44, 1575896341568]
]
```

##### logs[2]: chart log

Each entry is log ID, chart series index, data (JSON text). In ```[23637, 0, "{\"close\":648, ...}"]```, ```23637``` is the log ID, ```0``` the series index, and the JSON text is one K-line on the chart:

```plaintext
"Arr": [
    [23637, 0, "{\"close\":648,\"high\":650.5,\"low\":647,\"open\":650,\"x\":1575960300000}"],
    [23636, 5, "{\"x\":1575960300000,\"y\":3.0735}"]
]
```

##### Example response

```json
{
    "code": 0,
    "data": {
        "result": {
            "chart": "",
            "chartTime": 0,
            "logs": [{
                "Total": 20,
                "Max": 20,
                "Min": 1,
                "Arr": []
            }, {
                "Total": 0,
                "Max": 0,
                "Min": 0,
                "Arr": []
            }, {
                "Total": 0,
                "Max": 0,
                "Min": 0,
                "Arr": []
            }],
            "node_id": 123,
            "online": true,
            "refresh": 1732201544000,
            "status": 4,
            "summary": "...",
            "updateTime": 1732201532636,
            "wd": 0
        },
        "error": null
    }
}
```

#### NewRobot

Creates a robot in the account and starts it; like creating a robot on the website, this charges fees and the robot trades for real.

Parameters:

- `settings` (object, required): Robot configuration; fields are described under "Robot configuration (settings)" in `Extended API Interface Details`.

Returns (number): ```data.result```: the ID of the new robot on success; ```0``` when ```args``` in ```settings``` is not an array; a negative number when no robot was created, see the remarks.

Create and start a robot with an added exchange account (```pid```).

```python
# api() is the function in the Python example on the signature authentication page
settings = {
    "name": "test",
    "strategy": 123,
    "args": [],
    "exchanges": [
        {"pid": 123, "pair": "SOL_USDT"}
    ],
    "period": 60,
    "node": 123,
    "group": 123,
    "appid": "test"
}
r = api('NewRobot', settings)
print(r['data']['result'])   # output: 591988 (ID of the new robot)
```

When created through the extended API, the call returns after the start-up has run. If start-up fails (e.g. the strategy does not compile), the ID of the new robot is still returned and the robot is in the "strategy error" state (status code ```5```), so check its status with ```GetRobotDetail``` after creating it.

A negative result means no robot was created; see "Return values of failed starts" in `Live Trading Status Codes`, e.g. ```-2``` no docker found, ```-5``` insufficient balance. When the account exceeds the number of robots it may run, an error with ```code``` 6 is returned.

When an exchange configuration is passed directly with ```eid```, the platform does not store the keys in ```meta```, so every later restart of the robot with ```RestartRobot``` must pass ```settings``` again.

#### RestartRobot

Starts (restarts) a robot of the account, optionally replacing its configuration; starting charges fees.

Parameters:

- `robotId` (number, required): Robot ID; see ```GetRobotList```.
- `settings` (object, optional): New robot configuration; when given it replaces the whole configuration before starting, see the remarks. Fields are described under "Robot configuration (settings)" in `Extended API Interface Details`.

Returns (number): ```data.result```: normally ```0``` (preparing), meaning the start-up has run; whether the start succeeded must be checked with ```GetRobotDetail```. Other return values are in the remarks.

Start robot 123 with its current configuration.

```python
# api() is the function in the Python example on the signature authentication page
r = api('RestartRobot', 123)
print(r['data']['result'])   # output: 0 (preparing; the start-up has run)
```

A robot created on the website with added exchange accounts (```pid```) can be started with just ```robotId```, using its current configuration. A robot whose exchange configurations were passed directly with ```eid``` (usually created through the extended API) has no stored keys, so ```settings``` must be passed on every restart.

When ```settings``` is given, it **replaces** the robot's whole configuration (name, arguments, exchanges, K-line period, docker) before the start; the strategy cannot be changed. Fields left out do not keep their old values: ```name``` becomes an empty string, ```args``` becomes ```[]``` (all arguments back to their defaults), leaving out ```exchanges``` deletes all of the robot's exchange configurations, ```period``` becomes 60 seconds and ```node``` becomes automatic; only ```group``` keeps the old group when omitted or ```0```. So always pass a complete configuration; it is best to get the current one with ```GetRobotDetail``` and modify it.

Passing ```settings``` while the robot is preparing, running or stopping returns an error with ```code``` 6 (```robot is running```); without ```settings``` the robot is not restarted and its current status code (```0```, ```1``` or ```2```) is returned.

A negative result means the start failed; see "Return values of failed starts" in `Live Trading Status Codes`. Whether the robot is then running, or in "strategy error" because it failed to compile, must be checked with ```GetRobotDetail```.

#### StopRobot

Stops a robot of the account; stopping does not close positions.

Parameters:

- `robotId` (number, required): Robot ID; see ```GetRobotList```.

Returns (number): ```data.result``` is the robot status code: ```2``` (stopping) means the stop command was sent to the docker; ```4``` (stopped) means the robot's docker has been deleted, so the robot was set to stopped directly; ```3```, ```4``` or ```5``` may also mean the robot had already ended.

Stop robot 123.

```python
# api() is the function in the Python example on the signature authentication page
r = api('StopRobot', 123)
print(r['data']['result'])   # output: 2 (stopping)
```

While the robot is starting or stopping (```robot is busy```), or when its docker is offline (```docker not found```), an error with ```code``` 6 is returned.

#### CommandRobot

Sends an interactive command to a running robot of the account; the strategy receives it with `GetCommand`.

Parameters:

- `robotId` (number, required): ID of the robot that receives the command; see ```GetRobotList```.
- `cmd` (string, required): The interactive command; the strategy reads it with ```GetCommand()```.

Returns (bool): ```data.result``` tells whether the command was sent; it is ```false``` when the robot is not running.

Send the command ```test command``` to running robot 123; its strategy receives it with ```GetCommand()``` and logs it (strategy code in the remarks).

```python
# api() is the function in the Python example on the signature authentication page
r = api('CommandRobot', 123, 'test command')
print(r['data']['result'])   # output: True
```

A strategy that receives the command:

```javascript
// strategy run by robot 123: print each interactive command it receives
function main() {
    while (true) {
        var cmd = GetCommand()
        if (cmd) {
            Log(cmd)
        }
        Sleep(2000)
    }
}
```

To call ```CommandRobot``` from a webhook that accepts only one URL, such as TradingView, see `Direct Verification`.

#### DeleteRobot

Deletes a robot of the account; a running robot must be stopped first, and deletion cannot be undone.

Parameters:

- `robotId` (number, required): Robot ID; see ```GetRobotList```.
- `removeLog` (bool, optional): Whether to delete the robot's log data on the docker as well. Defaults to ```true``` when passed by name, and to ```false``` when only ```[robotId]``` is passed by position. Passing it explicitly is recommended.

Returns (number): ```data.result```: ```0``` deleted; ```-1``` not deleted (the robot does not exist, or is running, starting or stopping); ```-2``` the robot was deleted but its docker could not be reached, so the log data was not deleted and must be removed by hand from ```logs/storage/<robotId>/``` in the docker directory (e.g. ```123.db3```).

Delete the stopped robot 123 together with its log data on the docker.

```python
# api() is the function in the Python example on the signature authentication page
r = api('DeleteRobot', robotId=123, removeLog=True)
print(r['data']['result'])   # output: 0 (deleted)
```

#### PluginRun

Runs a piece of JavaScript code on a docker and returns the result, without creating a robot or charging fees; one run lasts at most 5 minutes, and the code can place real orders.

Parameters:

- `settings` (object, required): Run configuration; fields are in the attributes table below.

Fields:

- `settings.source` (string): The code to run; its entry is ```main()```, whose return value is the result.
- `settings.strategy` (number): Without ```source```, run the account's strategy with this ID (e.g. a trading plugin).
- `settings.node` (number): ID of the docker that runs the code; omitted or ```-1``` chooses one automatically.
- `settings.exchanges` (array): Exchange object configuration, written as in "Robot configuration (settings)" in `Extended API Interface Details`.

Returns (string): ```data.result``` is JSON text: ```logs``` holds the lines written by ```Log()``` in the code, and ```result``` is the JSON text of the return value of ```main()```.

Run code on docker 123 and get its logs and return value.

```python
# api() is the function in the Python example on the signature authentication page
import json

settings = {
    "source": "function main() {Log(\"Hello FMZ\")}",
    "node": 123,
    "period": 60,
    "exchanges": [{"pid": 123, "pair": "SOL_USDT"}]
}
r = api('PluginRun', settings)
out = json.loads(r['data']['result'])
print(out['logs'], out['result'])
```

It uses the same execution mechanism as the "Debugging Tool" of the development tools and trading terminal plugins; see `Plugin Principle and Development`.

```exchanges``` can also pass an exchange configuration directly instead of referencing an exchange account on the platform, e.g. ```{"eid": "Binance", "pair": "ETH_BTC", "meta": {"AccessKey": "...", "SecretKey": "..."}}```; the field names of ```meta``` are given by the ```meta``` returned by ```GetExchangeList```. Usually only one exchange object is set in ```exchanges``` (the debugging tool page supports only one); setting two raises no error, but accessing the second exchange object in the code does.

##### Example response

```json
{
    "code": 0,
    "data": {
        "result": "{\"logs\": [...], \"result\": \"\"}",
        "error": null
    }
}
```

Parsed, ```result``` is:

```json
{
    "logs": [{
        "PlatformId": "", "OrderId": "0", "LogType": 5, "Price": 0, "Amount": 0,
        "Extra": "Hello FMZ", "Currency": "", "Instrument": "", "Direction": "",
        "Time": 1732267473108
    }],
    "result": ""
}
```

#### pub

Pushes a message to a channel subscribed by a running robot, so that systems outside the platform (TradingView webhook alerts, your own trading system, monitoring scripts and so on) can send data to the robot. The robot reads it with `GetChannelData`; for how channels work see `Communication Between Live Trading Strategies`.

Unlike the other methods, ```pub``` **needs no API key and no signature**: the request URL is ```https://www.fmz.com/api/v1?method=pub&robot={robotId}&channel={channel}``` and the message goes in the request body (```POST```). Anyone who knows the robot ID and the channel name can push, so use a hard-to-guess random string as the channel name, and have the strategy validate what it receives as untrusted input.

Parameters:

- `robot` (number, required): ID of the robot that receives the message (URL parameter). The robot must be running and already subscribed to ```channel```.
- `channel` (string, required): Channel name (URL parameter); a 32-character random string (a UUID without hyphens) is recommended. It must not be all digits (that is taken as a robot ID, i.e. the robot's own channel); names shorter than 10 characters are not delivered.
- `message` (string, optional): Message content. For ```POST``` requests it is the whole request body, any text such as JSON or plain text; otherwise it is the URL parameter ```message```.

Fields:

- `data.status` (string): ```ok``` on success.
- `data.robot` (number): Echo of the request's ```robot``` parameter.
- `data.channel` (string): Echo of the request's ```channel``` parameter.
- `data.message` (string): The message pushed.
- `data.affected` (number): Number of dockers that received the message.

Returns (object): On success ```code``` is 0 and the fields of ```data``` are in the attributes table below; when no robot subscribes to the channel (or the channel name is invalid, or ```robot``` is empty), the HTTP status is 500 and ```code``` is 5.

Receiving strategy: subscribe to the channel, parse the JSON messages it receives, and use ```id``` to tell new messages from old ones.

```javascript
// receiving robot (assume its ID is 123456)
var CHANNEL = "6BC42A119B5DBFA2188A8279DA3B5C30"

function main() {
    var lastId = null
    while (true) {
        var msg = GetChannelData(CHANNEL)    // the first call subscribes and returns null
        if (typeof msg == "string") {
            var obj = null
            try {
                obj = JSON.parse(msg)          // parse again when the body is JSON text
            } catch (e) {
                Log("non-JSON message:", msg)
            }
            // the channel keeps only the latest message; use id to spot new ones
            if (obj && obj.id != lastId) {
                lastId = obj.id
                Log("external message received:", obj)
            }
        }
        Sleep(1000)
    }
}
```

```python
import json

CHANNEL = "6BC42A119B5DBFA2188A8279DA3B5C30"

def main():
    lastId = None
    while True:
        msg = GetChannelData(CHANNEL)    # the first call subscribes and returns None
        if isinstance(msg, str):
            try:
                obj = json.loads(msg)    # parse again when the body is JSON text
            except ValueError:
                obj = None
                Log("non-JSON message:", msg)
            if isinstance(obj, dict) and obj.get("id") != lastId:
                lastId = obj.get("id")
                Log("external message received:", obj)
        Sleep(1000)
```

##### Delivery rules

- Subscribe first, then push: the robot's first ```GetChannelData(channel)``` call subscribes to the channel (and returns a null value); the subscription is reported with the docker's heartbeat, so the external system can push successfully only after a short while. Requests fail while no robot subscribes.
- The message is delivered to the docker of the ```robot``` robot, and every robot on that docker subscribed to the same channel receives it; robots on other dockers do not.
- A channel keeps only the latest message, with no queue: ```GetChannelData()``` returns the most recent one each time, and reading does not clear it. To tell new messages from old ones, include an increasing number or a timestamp in the message.
- Each robot can subscribe to at most 10 channels (other robots' channels included); beyond that ```GetChannelData()``` returns a null value and logs the error ```channel subscriber exceed limit```.
- The robot receives a **string** (the raw request body). When the body is JSON text, the strategy has to parse it again.

##### Example push request

An external system pushes a message:

```bash
curl -X POST \
     "https://www.fmz.com/api/v1?method=pub&robot=123456&channel=6BC42A119B5DBFA2188A8279DA3B5C30" \
     -d '{"id": 1, "action": "buy", "symbol": "BTC_USDT"}'
```

In TradingView, put the URL above in the alert's webhook URL; the alert message becomes the request body.

##### Example response

```json
{
    "code": 0,
    "data": {
        "status": "ok",
        "robot": 123456,
        "channel": "6BC42A119B5DBFA2188A8279DA3B5C30",
        "message": "{\"id\": 1, \"action\": \"buy\", \"symbol\": \"BTC_USDT\"}",
        "affected": 1
    }
}
```

When no robot subscribes to the channel:

```json
{
    "code": 5,
    "error": "No subscribers for channel: 6BC42A119B5DBFA2188A8279DA3B5C30",
    "data": null
}
```

## Extended API Interface Return Codes

Every response of the extended API has the JSON structure below: ```code``` tells whether the request itself succeeded, and the method's result is in ```data```.

```json
{
    "code": 0,
    "data": {
        "result": null,
        "error": null
    }
}
```

```code``` is the status of the request itself:

| Description | Code |
| - | - |
| Success | 0 |
| Invalid API KEY: the ```AccessKey``` does not exist or is disabled; or a wrong ```secret_key``` in direct verification | 1 |
| Invalid signature | 2 |
| Nonce error: the ```nonce``` is not greater than the previous one, or differs from server time by more than 1 hour | 3 |
| Invalid method: the method does not exist, is not public, or this API KEY has no permission for it | 4 |
| Invalid arguments: ```args``` is not valid JSON, or the request cannot be dispatched (e.g. mismatched ```method```/```args``` counts) | 5 |
| The method failed while running (e.g. no permission for the robot, robot busy, too many running robots); see below | 6 |
| The request's source IP is not in this API KEY's IP whitelist | 7 |

With ```code``` 0 the method's result is in ```data.result```. When the number or types of the arguments do not match the method, ```code``` is still 0, ```data.result``` is ```null``` and ```data.error``` holds the error message (```null``` on success). For example, with the wrong number of arguments:

```json
{
    "code": 0,
    "data": {
        "result": null,
        "error": "Params number mismatch for StopRobot: expected 1, got 0"
    }
}
```

When the method fails while running, ```code``` is 6, the message is in the top-level ```error``` field and ```data``` is ```null```. For example, when operating on a robot that is not yours:

```json
{
    "code": 6,
    "error": "Access Denied",
    "data": null
}
```

## Live Trading Status Codes

The ```status``` field in the data returned by ```GetRobotList```, ```GetRobotDetail``` and ```GetRobotLogs``` is the robot status code, with these values.

| Status | Code |
| - | - |
| Preparing (queued, compiling) | 0 |
| Running | 1 |
| Stopping | 2 |
| Exited | 3 |
| Stopped | 4 |
| Strategy error | 5 |

### Return values when a start fails

Negative codes never appear in the ```status``` field; they are only returned by ```NewRobot``` and ```RestartRobot``` when the start fails:

| Meaning | Code |
| - | - |
| Strategy not usable: rental expired, neither yours nor rented, deleted, or the given version does not exist | -1 |
| No usable docker: the given docker is offline, or no docker is online | -2 |
| Failed to read the live trading or account data | -3 |
| The robot's status changed at the same time as the start (```RestartRobot``` only); query it again and retry | -4 |
| Insufficient balance | -5 |
| The concurrency limit of a rented strategy has been reached and the strategy has no overage price | -6 |

Errors such as exceeding the number of robots the account may run, or having no permission for the live trading, are not reported as return values but as an error with ```code``` 6; see `Extended API Interface Return Codes`.
