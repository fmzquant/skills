# FMZ platform user guide

Generated from https://www.fmz.com/user-guide: how the platform works (nodes, robots, strategies, templates, backtesting, extended API, MCP), as written for people; agents use it for concepts and limits.

## Getting Started

Start here: get to know the platform, go from registration to your first live robot in six steps, and keep your exchange API keys safe.

### Welcome to FMZ Quant Trading Platform

FMZ Quant is a quantitative trading platform: write strategies in the browser, backtest them online, then run them as live robots on a docker you deploy yourself or rent. You can also learn from, share and rent out strategies in the strategy square, or show your own live robots publicly.

#### Supported markets
- Crypto: spot, futures and perpetual contracts on the major centralized exchanges, plus some on-chain exchanges.
- Securities and futures: Futu Securities, Interactive Brokers and others.
- Exchanges the platform has not integrated yet can be connected yourself through the general protocol (see `General Protocol`).

#### Strategy languages
JavaScript, Python, Rust, PINE, MyLanguage and Workflow; see `Programming Languages`.

#### AI assistance
- The strategy editor has a built-in AI assistant that generates, explains and edits strategy code and analyzes backtest results (see `AI Assistant`).
- You can also connect the external AI assistant you already use to the platform and manage strategies, backtests and live robots through conversation (see `AI Integration`).

#### Dashboard
After signing up and logging in, open the [dashboard](https://www.fmz.com/m):

![Dashboard overview](https://www.fmz.com/upload/asset/2e4e636a6fe51c8f620e8.png)

- [Control Center](https://www.fmz.com/m/dashboard): account overview and shortcuts. Running a live robot takes three things: an online docker, a strategy and a configured exchange account.
- [Live Trading](https://www.fmz.com/m/robots): create, manage and control live robots. A live robot is a running instance of a strategy program.
- [Strategy Library](https://www.fmz.com/m/strategies): write, save and group strategies in any supported language.
- [Docker](https://www.fmz.com/m/nodes): deploy and manage the docker programs that run strategies.
- [Exchange](https://www.fmz.com/m/platforms): add and manage exchange accounts.

#### Public resources
- [Strategy Square](https://www.fmz.com/square): strategies shared publicly or listed for rent, good for learning and reference.
- [Live](https://www.fmz.com/live): live robots that users show publicly.
- [Digest](https://www.fmz.com/digest): original articles by the platform.
- [Community](https://www.fmz.com/bbs): the forum for discussing quantitative trading.
- [Crowdsourcing](https://www.fmz.com/markets): post and take on strategy development requests.
- [Classes](https://www.fmz.com/class): video tutorials.
- [API Docs](https://www.fmz.com/api): the API syntax manual for writing strategies.

#### Getting help
Post in the community, submit a ticket from the dashboard, or contact the administrators in the [Telegram](https://t.me/fmzquant_cn) group.

### Quick Start

Six steps take you from registration to your first live robot; each step links to the details.

#### 1. Register

Register and log in on the [sign-up page](https://www.fmz.com/sign-up). Adding an exchange asks for your account password (the exchange keys are encrypted with it in the browser); users who log in with a third-party account and have no password yet are asked to set one first. See `Key Security`.

#### 2. Add an exchange account

Create an API key on the exchange's website (enable only read and trade permissions, never withdrawal), then click "Add Exchange" on the [Exchange page](https://www.fmz.com/m/platforms), choose the exchange and fill in the keys. For a first try, use the exchange's demo trading or a small sub-account. For the steps and every field see `Exchange`.

#### 3. Deploy a docker

The docker is the program that runs strategies; every live robot runs on one. Rent one with a click (`One-Click Docker Rental`) or deploy it on your own server (`Manual Deployment of Docker`).

#### 4. Write a strategy

On the [new strategy page](https://www.fmz.com/m/add-strategy), choose a programming language, paste in the minimal strategy below and save. It reads the market data and the account every 5 seconds and shows them in the status bar; it does not place orders. A strategy is an entry function ```main()``` with a main loop (see `Strategy Structure`); all functions are listed in `API Quick Reference`, and the editor is described in `Strategy Editor`. You can also start from a public strategy in the strategy square.

#### 5. Backtest

In the backtest panel of the strategy editing page, choose the exchange, trading pair, time range and K-line period, then start a backtest and check the profit curve, trades and logs. Go live only after the backtest looks right; see `Overview and Starting a Backtest`.

#### 6. Create a live robot

On the [create robot page](https://www.fmz.com/m/add-robot), choose the strategy, a docker and the exchange account, set the strategy parameters and start it. Live robots are billed by the hour, so the account needs a balance before you start; see `Live Robot Billing and Top-up`. Status, logs and profit are on the robot page; see `Live Trading`.

Read on as needed: "Development Tools" covers editing and debugging, "Advanced Topics" covers rate limiting, communication between robots, multi-threading and on-chain trading, and "Extended API Interface" covers driving the platform from programs or AI assistants.

Minimal runnable strategy: shows the market data and the account in the status bar every 5 seconds without placing orders; runs as is in backtesting and live trading.

```javascript
function main() {
    Log("exchange:", exchange.GetName(), "pair:", exchange.GetCurrency())
    while (true) {
        var ticker = exchange.GetTicker()
        var account = exchange.GetAccount()
        if (ticker && account) {
            LogStatus(_D(), "last:", ticker.Last,
                "quote available:", account.Balance, "coins available:", account.Stocks)
        }
        Sleep(5000)
    }
}
```

```python
def main():
    Log("exchange:", exchange.GetName(), "pair:", exchange.GetCurrency())
    while True:
        ticker = exchange.GetTicker()
        account = exchange.GetAccount()
        if ticker and account:
            LogStatus(_D(), "last:", ticker["Last"],
                      "quote available:", account["Balance"], "coins available:", account["Stocks"])
        Sleep(5000)
```

```rust
fn main() {
    Log!("exchange:", exchange.GetName(), "pair:", exchange.GetCurrency());
    loop {
        if let (Ok(ticker), Ok(account)) = (exchange.GetTicker(None), exchange.GetAccount()) {
            LogStatus!(_D(None), "last:", ticker.Last,
                "quote available:", account.Balance, "coins available:", account.Stocks);
        }
        Sleep(5000);
    }
}
```

### Key Security

Before configuring an exchange account, check your key settings against this list; a leaked exchange key costs you the assets in that exchange account.

- **Trade permission only**: enable only read and trade permissions for the API key, and **never enable withdrawal**.
- **Bind an IP whitelist**: on the exchange, bind the API key to the outbound IP of the server running your docker. If the server has several IPs, pin the outbound IP with the docker's ```-I``` option (see `Command-Line Options`).
- **Keep private keys local**: if the exchange supports asymmetric keys such as RSA, prefer them, and keep the private key as a credential file on the docker's machine so that the platform stores only the file path (see `Local Credential Files`).
- **Start small**: run a new strategy against the exchange's demo trading or a small sub-account first.
- **Do not publish secrets**: if the strategy code, parameters or description contain keys, account names or similar information, do not publish or sell the strategy.

How the platform stores keys: encrypted fields such as keys on the exchange configuration page are encrypted in the browser with your platform account password before upload, so the platform never stores them in plain text; only a docker started with that account password can decrypt them locally. Changing the platform account password therefore invalidates existing exchange configurations; see `Common Causes of Live Trading Errors and Abnormal Exits` for what to do.

## Platform Basics

The basic objects of the platform: exchange accounts, the docker that runs strategies, the strategy library, live robots, the trading terminal for manual trading, and account and billing.

### Exchange

The [Exchange](https://www.fmz.com/m/platforms) page manages the exchange accounts you have configured. On FMZ, an "exchange" is an account a strategy program can operate: it holds the keys of the funding account together with the protocol and API wrapper used to talk to that exchange.

#### Adding an exchange account

1. **Create an API key on the exchange**: enable only read and trade permissions, never withdrawal; if the exchange supports an IP whitelist, bind the outbound IP of the docker that will run the robot (see the checklist in `Key Security`).
2. **Open the add page**: click "Add Exchange" on the Exchange page to open the [add exchange page](https://www.fmz.com/m/add-platform).
3. **Choose the protocol**: pick the exchange by category, or search by exchange name or ID. Spot and futures (contracts) are two different exchange objects and are added separately; futures exchanges carry a "Futures" tag. For example Binance spot is ```Binance``` and Binance futures is ```Futures_Binance```.
4. **Fill in the configuration**: "Label" is the account's name on the platform (the exchange name by default) and tells several accounts on the same exchange apart. The other fields depend on the exchange; the common ones are listed below, and the full list for each exchange is on its exchange page in the syntax manual (all exchanges are listed in `Capability Matrix`). Fields not marked optional are required.
5. **Confirm**: click the confirm button and enter your platform account password. Encrypted fields such as keys are encrypted in the browser with the account password before upload, so the platform never stores them in plain text.
6. **Use it**: select the exchange account when creating a live robot or a backtest. If you use the platform's public dockers, their IPs are listed at the bottom of the add page; add them to the exchange's IP whitelist.

#### Common fields

| Field | Description |
| - | - |
| Access Key, Secret Key | The exchange API key and secret. Secret Key is an encrypted field |
| Passphrase | The passphrase set when creating the API key; required by some exchanges (see below) |
| Simulate (demo) | When checked, connects to the exchange's demo trading or testnet; usually needs a separate API key |
| Version, V5 protocol, V3 protocol | The exchange API version; keep the default on most exchanges |
| Wallet address and private keys | The wallet address, wallet private key or exchange-generated API private key used to sign on on-chain exchanges |
| Rpc Address, Chain, ChainType | Node address and chain for the on-chain swap and Web3 exchange objects; see `Web3` |
| Server address, trading password | Securities and futures accounts such as Futu and Interactive Brokers; see `Securities and Futures` in the syntax manual |

- Passphrase: required by ```OKEX``` (OKX), ```Futures_OKCoin``` (OKX futures), Bitget, DeepCoin, ```Futures_KuCoin```, ```WEEX```, ```Futures_WEEX``` and others. For ```KuCoin``` spot this field is labeled Password.
- Simulate (demo): supported by some exchange objects of Binance, OKX, Bybit, Gate and DigiFinex.
- API version: on a few exchanges the version selects the account type, for example v3 is the unified account and v2 the classic account on Bitget; see the exchange page.
- Wallet address and private keys: used by on-chain exchanges such as Hyperliquid, Lighter, EdgeX, Aster and Polymarket; see the exchange pages under `Decentralized Exchanges` and `Prediction Markets` in the syntax manual for the exact fields.

Every masked (encrypted) input can hold a credential file path instead, so the private key stays only on the docker's machine; see `Local Credential Files`.

#### Exchange objects
In strategy code a configured exchange is the exchange object `exchange`. A backtest or live robot can be configured with several exchanges; in code they form the exchange object array `exchanges`. ```exchange.GetName()``` returns the name of the exchange object (such as ```Futures_Binance```); the documentation uses this name when it refers to a specific exchange, with the common name in parentheses where helpful.

Strategy code reads the account and market data, places orders and cancels them through the exchange object. In ```JavaScript```:

```javascript
function main() {
    let account = exchange.GetAccount()    // query account information
    let ticker = exchange.GetTicker()      // get the ticker
    let id = exchange.Buy(1000, 1)         // price 1000, amount 1
    if (id) {
        exchange.CancelOrder(id)           // cancel the order if it is still open
    }
}
```

#### Exchange-Specific Notes

The configuration, contract codes, exchange-specific commands and notes of each exchange have moved to the "Exchanges" chapter of the syntax manual. Function and trading-mode command support of all exchanges is in `Capability Matrix`; the exchange pages are grouped under `Centralized Exchanges`, `Decentralized Exchanges`, `Prediction Markets`, `Securities and Futures` and `On-chain & Custom`.

#### Local Credential Files

When configuring an exchange, every masked encrypted input (Secret Key, private key, password, etc.) can hold a credential file path ```file:///name.txt``` instead of the secret itself. When the live robot runs, the docker reads that file on its own machine and uses the content as the value. The private key then exists only on the docker's machine, and the platform stores nothing but a path.

##### Path rules
- The path is resolved relative to **this robot's directory** ```logs/storage/<robot ID>/``` (```logs``` is under the docker's working directory). For robot ID ```123456```, ```file:///rsaKey.txt``` means ```logs/storage/123456/rsaKey.txt```.
- Subdirectories are allowed, e.g. ```file:///keys/rsaKey.txt```.
- Only the ```.txt``` suffix is recognized; with any other suffix the text is not read as a file but used literally as the configuration value.
- The path cannot be absolute, cannot contain ```..```, and after resolution cannot leave the robot directory (symbolic links pointing outside are rejected too).
- Credential files are read from each robot's own directory, so when several robots use the same exchange configuration, every robot directory needs its own copy.
- If the file cannot be read, the robot fails to start: a missing file gives an error containing ```resolve key file```, and a file that exists but cannot be read gives one containing ```read key file```; an invalid path fails with ```key file path must be relative and cannot contain '..'``` or ```key file path escapes the robot directory```.

##### Example: an RSA key
For an exchange that supports ```RSA KEY``` authentication:
1. Generate an RSA public/private key pair, e.g. a PKCS#8 pair with ```openssl```.
2. Create an ```RSA KEY``` on the exchange and upload the public key from step 1.
3. Configure the exchange on the platform: put the exchange's ```RSA KEY``` in ```Access Key``` and ```file:///rsaKey.txt``` in ```Secret Key```.
4. Create the live robot and note its ID (e.g. ```123456```).
5. Save the private key from step 1 as ```logs/storage/123456/rsaKey.txt```, then start (or restart) the robot.

See the [video walkthrough](https://www.bilibili.com/video/BV1UM41147Jj/) (Chinese) for the full process.

#### General Protocol

An exchange the platform has not integrated yet can be connected by writing a general protocol plugin: on one side the plugin calls the exchange's API, on the other it talks to the docker in a fixed format.

![General Protocol Configuration Screenshot](https://www.fmz.com/upload/asset/2e43b059b3ec9f42ded6e.png)

Any exchange that offers a trading API can be connected this way. Plugins support two protocols:
- ```REST``` protocol: [reference documentation](https://www.fmz.com/digest-topic/10518).
- ```FIX``` protocol: [reference project](https://github.com/fmzquant/fixc).

The two kinds of plugin differ only in how they talk to the exchange API; the interaction with the docker, the data formats and other details are the same. See the examples behind the links above for implementations.

### Docker

The [docker](https://www.fmz.com/m/nodes) is the program that runs strategies: live strategies run on a docker, not on the FMZ website. The docker talks to the platform, starts and stops strategy processes and sends logs back; every request a strategy makes to an exchange also leaves from the docker's machine. The docker runs on your own server (or a server rented with one click), so a network failure of the platform website does not affect the live robots already running on it.

#### Supported systems
Only 64-bit builds are released: Linux (x86_64, ARM64), macOS (Intel, Apple Silicon) and Windows (x64, ARM64, plus a GUI version). 32-bit systems are not supported.

#### Data directory
All docker data is in the ```logs``` directory under the working directory (the startup directory by default, or the one given with ```-w```):
- ```logs/storage/<robot ID>/<robot ID>.db3```: the robot database (```SQLite```) holding logs, profit, charts, the status bar and ```_G()``` data; it can be opened with any ```SQLite``` tool.
- ```logs/storage/<robot ID>/stdout.log```, ```stderr.log```: standard output and standard error of the strategy process.
- ```logs/docker.log```: the docker's own log.
- ```logs/docker.pid```: the docker's identity; keep it and the platform gives the docker its old ID back after a restart.

To put the robot directories on another disk, set the environment variable ```QUANT_ROBOT_LOG_DIR``` before starting the docker; it replaces ```logs/storage``` as the parent of the robot directories.

#### Network proxy
The docker does not read the operating system's proxy settings. Environment variables such as ```HTTP_PROXY```, ```HTTPS_PROXY```, ```ALL_PROXY``` (and ```NO_PROXY```) in the docker process's environment apply to the HTTP requests a strategy makes (```HttpQuery``` and exchange REST calls), but not to WebSocket connections. To reach an exchange through a proxy, the recommended ways are:
- set a proxy on the exchange object in the strategy with `exchange.SetProxy`;
- or use a transparent proxy that takes over traffic at the network layer (such as Clash in TUN mode), which needs no docker configuration.

#### Deploy Docker

Rent a server on the platform with one click, or deploy it manually on your own device. Click **Deploy Docker** on the [docker management page](https://www.fmz.com/m/nodes) to open the [docker deployment page](https://www.fmz.com/m/add-node) and choose one.

The docker management page lists the dockers of your account, as a list or with details, including each docker's IP address, version and build time.

![Docker deployment page](https://www.fmz.com/upload/asset/2e527e497b3fa27ba497b.png)

##### One-Click Docker Rental

The platform rents a server for you and deploys the docker on it automatically, so you need no server of your own; the docker is online within a few minutes.

###### Steps
1. On the [docker deployment page](https://www.fmz.com/m/add-node), click the **One-Click Docker Rental** tab and choose a server by configuration and data-center region.
2. Click "Buy Now" and enter your FMZ account password to verify.
3. After verification the docker program is deployed and common Python libraries are installed automatically; this takes a few minutes.

###### Notes
- The server is rented by the platform on your behalf and has limited system permissions, with no remote login. If you need third-party Python libraries that are not pre-installed, deploy on your own server instead (`Manual Deployment of Docker`).
- Rented servers are billed separately from live robots.
- "Redeploy" does not delete the robot logs and data files in the ```logs``` directory of the docker.

##### Manual Deployment of Docker

The docker can run on a PC, a server, a Raspberry Pi (64-bit OS) and similar devices. Only 64-bit builds are released:
- Linux command line: x86_64 (amd64), ARM64 (aarch64)
- macOS command line: Intel, Apple Silicon
- Windows: x64 and ARM64, each with a command-line and a GUI version

On the [docker deployment page](https://www.fmz.com/m/add-node), click **Manual Deployment**, download the build for your system and unpack it; the executable ```robot``` is the docker program. The same page shows the two pieces of information needed:

![Manual docker deployment page](https://www.fmz.com/upload/asset/2e460507bc21582ba1448.png)

1. Communication address: contains your account UID, like ```node.fmz.com/123456```.
2. Password: the password of the FMZ account that owns the UID.

###### Windows GUI version
Run ```robot.exe```, enter the communication address and password, and click start.

###### Command-line version
```bash
chmod +x robot                      # Linux/macOS: make it executable before the first run
./robot -s node.fmz.com/123456      # prompts for the password, which is not echoed
```

```123456``` is only an example; the real address is on the docker deployment page. Do not pass the password in plain text with ```-p```: it stays in the shell history and the process list. For unattended start-up, put the address and password in a configuration file ```robot.conf``` that only you can read:

```bash
cat > robot.conf <<'EOF'
s=node.fmz.com/123456
p=your-password
EOF
chmod 600 robot.conf
./robot -c robot.conf               # plain ./robot also loads ./robot.conf
```

All options and the configuration file format are described in `Command-Line Options`.

###### Running in the background
The docker ignores the terminal hang-up signal: start it in the foreground over SSH and simply disconnect, and it keeps running, with its log also written to ```logs/docker.log```. To start at boot or restart after a crash, run it under a service manager such as systemd, e.g. ```/etc/systemd/system/robot.service```:

```ini
[Unit]
Description=FMZ robot
After=network-online.target
Wants=network-online.target

[Service]
WorkingDirectory=/opt/robot
ExecStart=/opt/robot/robot -c /opt/robot/robot.conf
Restart=on-failure
TimeoutStopSec=90

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now robot
```

The ```SIGTERM``` sent by ```systemctl stop robot``` makes the docker shut down gracefully: it stops all its live robots, reports their state and then logs out of the platform. ```TimeoutStopSec``` leaves enough time so that it is not killed before finishing.

###### Upgrading the docker
The strategy runtime and the exchange connectors are delivered by the platform when needed and need no manual updates. To upgrade the docker program itself, stop the docker (see `Docker Operation Precautions`), replace the ```robot``` executable with the new version and start it in the **same working directory**. The ```logs``` directory there keeps the docker identity and the robot data, so the docker comes back with its old ID.

###### Isolating strategy processes in Docker containers
On Linux and macOS, the command-line version can run each strategy process in its own Docker container with the ```-i``` option (Docker must be installed and running on the machine). This isolates strategy processes; it is not a Docker image of the docker program itself. See `Command-Line Options` for the parameters.

##### Docker Operation Precautions

What to watch out for when stopping or deleting a docker: stop the robots first, stop the docker the normal way, and avoid killing the process.

###### Stop the robots first, then the docker
Before deleting a docker or stopping its process, make sure no live robot is running on it.

###### Stopping the docker normally
- Command-line version: press ```Ctrl+C``` once in the terminal, or send ```SIGTERM``` to the process (```kill <PID>```, ```systemctl stop```).
- Windows GUI version: click the stop button.

On a stop request the docker shuts down gracefully: it stops all its live robots, reports their final state and then logs out of the platform. Pressing ```Ctrl+C``` again during this shutdown skips the reporting and logout and exits at once; normally do not do that.

###### Avoid forced termination
Do not end the docker with ```kill -9```, cut the power or force a shutdown. The docker then has no chance to log out, and its live robots may still show as running on the platform and keep being billed; in that case the offline docker has to be deleted before those robots can be stopped. Stop the docker before rebooting the server; when it runs under a service manager such as systemd, a system shutdown sends ```SIGTERM``` automatically.

#### Command-Line Options

Startup options of the command-line docker program ```robot``` and the format of its configuration file ```robot.conf```. Common ways to start it:

```bash
./robot -s node.fmz.com/123456            # prompts for the password (not echoed)
./robot node.fmz.com/123456               # short form: robot address [password]
./robot -c robot.conf                     # read options from a configuration file
./robot -v                                # show the version
```

The address and account UID are shown on the [docker deployment page](https://www.fmz.com/m/add-node).

##### Options

| Option | Description |
| --- | --- |
| ```-s address``` | Platform address like ```node.fmz.com/123456``` (```123456``` is the account UID); a ```ws://``` or ```wss://``` prefix is allowed. |
| ```-p password``` | Account password. Avoid: it stays in shell history and the process list. Omit to be prompted, or use the config file. |
| ```-n name``` | Docker name, shown on the platform's docker page. |
| ```-w dir``` | Working directory. ```logs``` (robot data, docker log, identity file) lives under it. |
| ```-c file``` | Configuration file; format below. |
| ```-u user``` | Linux/macOS only: run strategy processes as this system user; the docker itself must run as root. Ignored with ```-i```. |
| ```-I IP``` | Local outbound IP for both the platform connection and the strategies' exchange connections; see below. |
| ```-i image``` | Linux/macOS only: run each strategy process in its own container from this Docker image (Docker must be running). |
| ```-e path``` | With ```-i```: path of the executable inside the container. |
| ```-f JSON``` | With ```-i```: Docker container settings, as inline JSON or ```@path``` to read them from a file. |
| ```-H address``` | With ```-i```: address the container uses to connect back to the host. |
| ```-vv``` | Verbose log (including the messages exchanged with the platform); off by default to keep logs small. |
| ```-d DNS``` | The old custom DNS option; still accepted but ignored, as the docker always uses the system resolver. |
| ```-v```, ```-V```, ```--version``` | Print version and build information and exit. |
| ```-h```, ```--help``` | Print usage. |
| ```--ctl-stdin``` | For service wrappers: read control commands from stdin (password first if no ```-p```); ```stop``` or EOF shuts down gracefully. |

Options that take a value can also be written as ```-option=value```, e.g. ```-n=server01```. An invalid option prints the usage and exits.

##### Configuration file robot.conf
One ```key=value``` per line; the key is the option name without ```-``` (```s p n w u I d i e f H vv```), and lines starting with ```#``` are comments:

```ini
# robot.conf
s=node.fmz.com/123456
p=your-password
n=server01
vv=true
```

- Give the file with ```-c```; without ```-c``` and without an address, ```robot.conf``` in the startup directory is loaded automatically if present.
- When an option is given both on the command line and in the file, the command line wins.
- A key is matched as written first and then in lower case, so only ```I``` (outbound IP) and ```i``` (Docker image) are case-sensitive; the other keys (e.g. ```S=```) work in either case.
- The configuration file path is resolved relative to the startup directory (before ```-w``` changes directory); ```-f @file``` is read after ```-w``` changes directory, so a relative path is resolved against the working directory.
- The file holds your password, so make it readable only by you (```chmod 600 robot.conf```).

##### Pinning the outbound IP (-I)
When the server has several IP addresses and the exchange API key is whitelisted for one of them, pin the outbound IP with ```-I```, e.g. ```./robot -s node.fmz.com/123456 -I 192.168.1.100```. The connection to the platform and the strategies' connections to exchanges then leave from that address. With ```-i``` container isolation the container's network may not have that address; in that case let the container use the host network.

The Windows GUI version has no IP setting; use the command-line version when you need to pin the outbound IP. The GUI version accepts only ```-s```, ```-p``` and ```-n```, which prefill the window; when both ```-s``` and ```-p``` are given it starts automatically.

#### Live Trading Data Migration

Each live robot's data is in ```logs/storage/<robot ID>/``` under the docker's working directory (the database ```<robot ID>.db3```, ```stdout.log```, ```stderr.log``` and so on). The logs, profit and charts the platform shows for a robot are read from the docker that runs it.

##### Moving one robot to a docker on another machine
1. Stop the robot.
2. Copy the whole ```logs/storage/<robot ID>/``` directory to the same place under the new docker's working directory, keeping the robot ID as the directory name.
3. Switch the robot's docker to the new one in the robot configuration and start the robot.

The robot's existing logs, profit and other data are then kept on the new machine.

##### Moving a whole docker
1. Stop the robots on the old docker, then stop the old docker.
2. Copy the entire ```logs``` directory from the old docker's working directory to the working directory on the new machine.
3. Start the docker on the new machine.

```logs/docker.pid``` holds the docker's identity: with the old docker offline, the docker on the new machine gets the old docker ID back, so robot configurations need no change. Never run dockers on two machines with the same ```logs``` directory at the same time.

#### Docker Monitor

On the [docker management page](https://www.fmz.com/m/nodes), **Docker Monitor** can be enabled from the actions of the docker list or of the docker details. Once enabled, when the docker goes offline abnormally and when it comes back online, the platform sends a notification according to the [push settings](https://www.fmz.com/m/account#push) (App, email, Telegram; never to the WebHook).

### Strategy Library

The [Strategy Library](https://www.fmz.com/m/strategies) page holds all strategies of the current account, written in any of the programming languages or visually.

- Grouping: strategies can be grouped just like robots (see `Grouping`).
- Import and export: besides the source code, a complete strategy includes its parameters, interactions, description, notes, manual, template references and more, so move a strategy by exporting and importing the complete strategy (see `Import and Export of Complete Strategies`).
- Sharing and renting: generate a "copy code" to share a strategy or a "registration code" to rent it out (see `Strategy Sharing and Renting`).

#### Import and Export of Complete Strategies

Copying the source code is not enough to move a strategy: the parameter design, interaction design, template references and more are not in the source. "Export Strategy" and "Import Strategy" on the strategy editing page move a strategy completely.

![Strategy import/export screenshot](https://www.fmz.com/upload/asset/2e52ccf44526f396fb795.png)

- Export Strategy
  Exports one ```xml``` file, for strategies in every programming language. When exporting you can choose what to include: name, source code, notes, description, manual, template references, strategy parameters, interactive controls and backtest settings.

- Import Strategy
  Click "Import Strategy" on the strategy editing page, choose an ```xml``` file produced by "Export Strategy", and select what to import. Click "Save" afterwards to save the strategy.

#### Strategy Sharing and Renting

There are two ways to let others use your strategy: sharing (they get a full copy of the strategy, source code included) and renting (they get only the right to backtest and run it live, without seeing the source). On the [Strategy Library](https://www.fmz.com/m/strategies) page, click the "Actions" button on the right of the strategy and choose share or rent from the menu.

When creating and handing out **registration codes** (rental), make sure you generated a "registration code" and not a "copy code" (sharing), so that you do not give away the source code by mistake.

##### Strategy Sharing

Sharing a strategy gives the other user a full copy of it, source code included. Click the strategy's "Share" button and choose how to share in the dialog:

- **Public Sharing**: the full strategy is shared to the platform's strategy square, where any user can copy it.
- **Internal Sharing**: choose a validity period and a number of uses to generate the strategy's **copy page URL** and **copy code**, and hand them to the users you choose. A user opens the copy page URL, logs in and enters the copy code to get the strategy, which then appears in their strategy library.

![Strategy Sharing](https://www.fmz.com/upload/asset/2e593d57dc36afc004ef6.png)

##### Strategy Rental

Renting a strategy gives the other user only the right to backtest it and run it live; they cannot see the source code or other details. Click the strategy's "Rent" button and choose how to rent it in the dialog:

- **Public Sale**: apply to list the strategy for sale in the strategy square; listing requires review.
- **Internal Sale**: choose the number of days, the maximum number of concurrent robots and the number of registration codes to generate the strategy's **registration page URL** and **registration codes**, and hand them to the users you choose. A user opens the registration page URL, logs in and enters a registration code to get the right of use; the strategy then appears in their strategy library. A maximum of 0 concurrent robots means no limit: any number of robots can be created.

![Strategy Rental](https://www.fmz.com/upload/asset/2e4e78f6c46c9dde1ce90.png)

When a rented strategy expires, the robots using it are stopped and cannot be started again; once the maximum number of concurrent robots is reached, no new robot can be started.

### Live Trading

As opposed to a backtest, a live robot is a strategy program instance that really interacts with an exchange (fetching market data, querying positions, placing and canceling orders, etc.). An instance connected to the exchange's production environment is a live robot, and so is one connected to the exchange's simulation environment (many exchanges offer a test environment).

#### Creating a live robot
On the [robot creation page](https://www.fmz.com/m/add-robot), choose the strategy, the docker and the exchange accounts, then create the robot. Three things must be ready beforehand:
- A strategy: click "New Strategy" in the [Strategy Library](https://www.fmz.com/m/strategies), write it and save it.
- An online docker: click "Deploy Docker" on the [Docker page](https://www.fmz.com/m/nodes) (see `Docker`).
- An exchange account: click "Add Exchange" on the [Exchange page](https://www.fmz.com/m/platforms) and configure it (see `Exchange`).

Live robots are billed by the hour and cannot start without enough balance (see `Live Robot Billing and Top-up`).

#### Robot monitoring
On the [live trading page](https://www.fmz.com/m/robots), click "Monitor" in the actions column of a running robot to enable monitoring. Once enabled, when the robot exits for any reason other than a manual operation, the platform sends a notification according to the [push settings](https://www.fmz.com/m/account#push) (App, email, Telegram; never to the WebHook).

#### Robot database
For robot ID ```123456```, the database file is ```logs/storage/123456/123456.db3``` (```SQLite```) under the working directory of the docker running it, with these tables:
- chart: chart data.
- cfg: the latest state such as the status bar content and the chart configuration.
- kvdb: data persisted with the ```_G()``` function.
- log: robot logs.
- profit: profit data.

The same directory also holds the strategy process's standard output ```stdout.log``` and standard error ```stderr.log```.

To let other people view and operate some of your robots, use sub-accounts (see `Sub-accounts`).

#### Grouping

Click the **Group Management** button on the right of the "Live Trading" page or the "Strategy Library" page to group robots or strategies; group names are up to you. For strategies, for example, you can put template libraries, JavaScript strategies and test strategies in separate groups.

Strategy groups:

![Strategy groups](https://www.fmz.com/upload/asset/2e482ba9b9aa272085d00.png)

Robot groups:

![Robot groups](https://www.fmz.com/upload/asset/2e577d050e817837bbfdf.png)

#### Live Trading Observation

Click the "Public" button of a robot in the robot list on the [Live Trading page](https://www.fmz.com/m/robots) to let others watch it. There are two ways:

1. **Public Sharing**: the robot is shown on the platform's public [Live Trading Observation](https://www.fmz.com/live) page.
2. **Internal Sharing**: set a validity period to generate a private link; whoever has the link can open the robot's private observation page.

#### Live Trading Message Push

A live robot can push log lines as messages to the mobile app, email, Telegram or a WebHook; enable the channels on the [push settings page](https://www.fmz.com/m/account#push).

![Push Settings](https://www.fmz.com/upload/asset/2e4ad17706aa842c914ce.png)

##### Push channels
- Mobile (App): when enabled, push messages are sent to the FMZ mobile app.
- Email: verify your email address first; after that you receive push messages.
- Telegram: bind Telegram in the push settings and enable it.
- WebHook: enable it and set a push address such as ```http://abc.com/push.php?data={body}```; the format is described below.

Alerts such as docker monitoring, robot monitoring and the balance alert are also sent according to the push settings, but never to the WebHook.

##### WebHook address
When a robot sends a push message, the platform sends a ```GET``` request to the push address: ```{body}``` in the address is replaced with the message content and ```{subject}``` with the message title, both URL-encoded; ```{{body}}``` and ```{{subject}}``` are replaced as-is, without encoding.

To send a ```POST``` request, write the push address as ```request URL||request body```, for example ```http://abc.com/push.php||text={body}```: the part before ```||``` is the request URL and the part after it is the request body; both parts can use the placeholders above. The push address must be an ```http``` or ```https``` address reachable from the public internet.

##### Pushing from a strategy
- JavaScript, Python, Rust: when calling `Log` or another function that writes to the log area (such as ```exchange.CreateOrder()``` or ```exchange.CancelOrder()```), pass one more argument ```@``` after the required ones and that log line is pushed according to the push settings, for example ```Log("This is a push message", "@")```. In Rust use the ```Log!``` macro the same way: ```Log!("This is a push message", "@");```.
- PINE and My language: enable trade log push in the parameters of the "trading library" built into the strategy; trades then push messages automatically.

##### Push limits
The docker reports push messages with its heartbeat (about every 20 seconds), and several pushes in one cycle are merged into one; each account can push at most 50 messages per hour (a merged message counts as one), and the body of each push is at most 200 characters. The backtest system and the debugging tool do not push messages. See `Log` for the full rules.

#### Common Causes of Live Trading Errors and Abnormal Exits

When a robot will not start, reports errors or exits abnormally, check the causes below by category.

##### The robot cannot start
- No online docker
  A robot cannot start while its docker is offline. Check on the [docker page](https://www.fmz.com/m/nodes) that the docker is online, or pick another online docker.
- Insufficient balance
  Starting a robot prepays its first hour, so it cannot start without enough balance; if the balance runs out while it runs, the platform stops it. Top up and start it again (see `Live Robot Billing and Top-up`).
- Rented strategy expired or concurrency limit reached
  When a rented strategy expires, robots using it are stopped and cannot be started again; once the rental's maximum number of concurrent robots is reached, no further robot can start.
- Key decryption failed
  The error looks like ```decrypt connector config (<exchange label>): field '<field>': AES decrypt failed (wrong password?)``` (occasionally ```secret key decrypt failed (wrong password)```). The FMZ account password was changed, so the exchange keys configured earlier can no longer be decrypted. To fix it:
  1. Re-enter the exchange keys, passwords and similar fields on the [Exchange management page](https://www.fmz.com/m/platforms).
  2. Stop all dockers and start them again with the new password.
- Credential file not found
  The exchange configuration uses a ```file:///xxx.txt``` credential file that is missing from the robot directory; the error contains ```resolve key file``` (or ```read key file``` if the file exists but cannot be read). An invalid path fails with ```key file path must be relative and cannot contain '..'``` or ```key file path escapes the robot directory```. See `Local Credential Files`.

##### Errors caused by strategy code
- Static syntax errors

  ![Syntax error in editor](https://www.fmz.com/upload/asset/2e4daebbb80548adf3927.png)

  These are obvious: the strategy editing page usually marks them, and a backtest reveals them too.
- Runtime errors
  The most common one is using a function's return value without checking that it is valid.
- Excessive memory usage
  Keeping too much data that cannot be garbage-collected in global variables.
- Improper use of ```exchange.Go``` for concurrent requests
  Calling the asynchronous ```exchange.Go``` without calling ```wait``` for the results in time, so that too many concurrent tasks pile up.
- Recursion too deep
  Too many levels of recursion exceed the call stack size.

##### Other errors
- API business errors and network request errors
  These show the exchange object name, the function name, the error message and the reason, and do not stop the robot by themselves. They are usually the trigger rather than the direct cause, which is typically **a program exception from using an API return value without checking it**.
- ```interrupt``` error
  Logged when the user clicks the **Stop** button on the robot page while the program is in the middle of an operation (such as an exchange API call) and the stop interrupts it. It is harmless, just a log entry.

See the [FAQ collection](https://www.fmz.com/bbs-topic/1427) for more.

### Trading Terminal

The platform provides a modular, customizable [Trading Terminal](https://www.fmz.com/m/trade) page: add market data, trading and other modules freely, drag and resize them, change the exchange and trading pair a module is bound to, and add several modules of the same kind, which makes manual and semi-automated trading convenient.

The trading terminal also supports trading plugins: code you write yourself that runs as a module on a selected docker to assist manual trading.

#### Plugin Principle and Development

A trading plugin is a short piece of code executed on a docker: when you click "Execute" on the trading terminal page, the platform sends the plugin code and the exchange account selected in the module to the selected docker, runs it, and shows the return value in the module. The following entry points share the same execution mechanism:

| Entry point | Code that runs | Notes |
| - | - | - |
| Trading terminal plugin | A strategy of type "Trading Plugin" in your strategy library | Added and executed on the trading terminal page |
| Debug Tool (development tools) | JavaScript code written on the page | For testing API calls |
| Extended API `PluginRun` | ```source``` in the request, or an existing strategy of the account | For programs |
| MCP ```plugin_*``` tools | Built-in functions for market data, orders and so on | For AI assistants, authorized by the ```trade``` permission, see `AI Integration` |

No robot is created and nothing is charged; one run lasts at most 5 minutes and is interrupted on timeout. It suits simple tasks that assist manual trading, such as iceberg orders, placing or cancelling orders in bulk, or calculations; logic that has to run for a long time should be a robot.

##### Writing a plugin

Create a strategy and set its type to "Trading Plugin" on the new-strategy page. Trading plugins, the debugging tool and ```PluginRun``` support JavaScript only.

The plugin's entry point is ```main()```, and its return value is the result: a returned table or chart object is shown as a table or chart in the module (see `Plugin Examples`). Logs written with ```Log()``` are not shown in the module.

##### Using a plugin

- Add: open the module menu on the trading terminal page; the trading plugins in your strategy library are listed there. Choose one to add it.
- Execute: click "Execute" in the plugin module to run it.

##### Data directory

When plugins and the debug tool run on a docker, their working directory is ```logs/storage/p<number>/``` under the docker's running directory (one directory starting with ```p``` per platform account, created on the first run). If an exchange account used by the trading terminal configures its key as a key file path (```file:///xxx.txt```), put the key file in this directory.

#### Plugin Examples

A plugin runs code for a limited time to do simple jobs such as iceberg orders, placing and cancelling orders, or calculations. It returns its result with ```return```; a returned table or chart object is displayed as a table or chart. Two examples follow; more can be found in the **Strategy Square**, e.g. buying or selling in small slices.

##### Order book snapshot

Show the top 15 levels of the current order book as a table:

```javascript
// Return an order book snapshot
function main() {
    var tbl = {
        type: 'table',
        title: 'Depth snapshot @ ' + _D(),
        cols: ['#', 'Amount', 'Ask', 'Bid', 'Amount'],
        rows: []
    }
    var d = exchange.GetDepth()
    if (!d) {
        return 'failed to get the order book'
    }
    var n = Math.min(d.Asks.length, d.Bids.length, 15)
    for (var i = 0; i < n; i++) {
        tbl.rows.push([i, d.Asks[i].Amount, d.Asks[i].Price + '#ff0000',
                       d.Bids[i].Price + '#0000ff', d.Bids[i].Amount])
    }
    return tbl
}
```

##### Calendar spread chart

On a futures exchange object, take 5-minute K-lines of the quarterly and the weekly contract and chart the difference of their closes:

```javascript
// Chart the calendar spread
var chart = {
    __isStock: true,
    title: {text: 'Spread analysis'},
    xAxis: {type: 'datetime'},
    yAxis: {
        title: {text: 'Spread'},
        opposite: false
    },
    series: [
        {name: "diff", data: []}
    ]
}

function main() {
    exchange.SetContractType('quarter')
    var recordsA = exchange.GetRecords(PERIOD_M5)
    exchange.SetContractType('this_week')
    var recordsB = exchange.GetRecords(PERIOD_M5)
    if (!recordsA || !recordsB) {
        return 'failed to get K-lines'
    }

    var n = Math.min(recordsA.length, recordsB.length)
    for (var i = 0; i < n; i++) {
        var a = recordsA[recordsA.length - n + i]
        var b = recordsB[recordsB.length - n + i]
        chart.series[0].data.push([a.Time, a.Close - b.Close])
    }
    return chart
}
```

### Account and Billing

How live robots are billed, how to top up, and how to hand some live robots to other people with sub-accounts. Other account settings (push notifications, two-factor authentication, API keys, etc.) are on the [account settings page](https://www.fmz.com/m/account).

#### Live Robot Billing and Top-up

Live robots are billed by the hour from your platform account balance; this page covers the billing rules, bills and the balance alert, and what to watch out for when topping up.

##### Billing
- Live robots are billed by the hour at 0.05 USD per robot per hour; a partial hour counts as a full hour.
- Billing starts when the robot is created, and starting it prepays the first hour, so a robot cannot start if the account balance is insufficient. Stopping or restarting a robot does not bill it twice.
- If the balance runs out while a robot is running, the platform stops the robot; when a rented strategy expires, the robots using it are stopped as well.
- Servers rented with one-click docker rental are billed separately from live robots (see `One-Click Docker Rental`).

##### Bills and balance alerts
- The [billing page](https://www.fmz.com/m/billing) shows the balance, top-up records and every billing item.
- Under [balance alert in account settings](https://www.fmz.com/m/account#alertthreshold), set an alert threshold: when the available balance drops below it, the platform sends a notification according to the [push settings](https://www.fmz.com/m/account#push) (App, email, Telegram; at most once every 24 hours unless you top up or change the setting); 0 turns the alert off.

##### Top-up
Choose the payment method and amount on the [billing page](https://www.fmz.com/m/billing). When topping up with ```USDT```, check carefully:
- The transfer network must match the network selected on the billing page; TRC20, ERC20 and BSC are supported. ERC20 and BSC addresses both start with ```0x``` and look the same, which makes them the easiest to mix up.
- The asset is ```USDT```.
- The destination address is the one shown on the billing page.

#### Sub-accounts

Lets other people view and operate some of your live robots without giving them the main account.

##### Create a sub-account
On the [account settings page](https://www.fmz.com/m/account#shadowmember), open the sub-account tab, select the live robots the sub-account may access under operation permissions, enter its username and login password, and create it. Sub-accounts are listed on the same page, where you can edit, lock/unlock or delete them.

![Sub-account settings](https://www.fmz.com/upload/asset/2e46d725dbe6b471f1b33.png)

##### Permissions
A sub-account sees only the live robots authorized to it. On those robots it can view logs and charts, change strategy parameters, send interactive commands, stop and restart; it cannot change the robot's docker, strategy, version, name, exchange objects or other configuration.

##### Typical uses
- A quant team sharing the management of several live robots.
- Letting the renter of a strategy help debug a live robot.

## Writing Strategies

Covers strategy structure (lifecycle, main loop, event-driven), notes for each programming language, strategy parameters, interactive controls, template libraries, built-in libraries, Chinese/English text in the strategy UI, and a categorized quick reference of all API functions.

### Strategy Structure

Strategies in ```JavaScript```, ```Python``` and ```Rust``` consist of a few functions with agreed names, which the docker calls at fixed points. MyLanguage, PINE and Workflow strategies do not need to define them.

#### Lifecycle functions

| Function | Required | When it is called |
| - | - | - |
| ```main()``` | Yes | The entry function and body of the strategy. When ```main()``` returns, the strategy has finished. |
| ```init()``` | No | Called once before ```main()```, for initialization. |
| ```onexit()``` | No | Called when the strategy exits, for cleanup (cancel orders, close positions, save state, etc.). |
| ```onerror(msg)``` | No | ```JavaScript``` only: called when ```main()``` ends with an uncaught exception (```msg``` is the error); then ```onexit()``` is not called. |
| ```destroy()``` | No | ```JavaScript``` template libraries only: called when the strategy exits, after ```onexit()``` or ```onerror()```; see `Template Library`. |

Which function runs on exit:

| Exit reason | JavaScript | Python | Rust |
| - | - | - | - |
| ```main()``` returns normally | ```onexit()``` | ```onexit()``` | ```onexit()``` |
| Live trading stopped | ```onexit()``` | ```onexit()``` | ```onexit()``` |
| Uncaught exception or ```panic``` | ```onerror(msg)``` | neither | ```onexit()``` |

#### Notes
- ```onexit()``` and ```onerror()``` may run for at most 5 minutes (the limit is sent by the server with each task; the default is 5 minutes) and are terminated when they exceed it.
- In backtesting a strategy is usually an endless polling loop, so ```main()``` does not return normally when the backtest ends and ```JavaScript``` and ```Python``` strategies do not run ```onexit()```; see `onexit()` for how to handle this. ```Rust``` strategies run ```onexit()``` automatically when the backtest ends.
- When ```main()``` of a ```JavaScript``` strategy returns, threads created with ```threading``` are terminated; ```setTimeout``` callbacks that have not fired yet run first, then ```onexit()``` is called.
- ```JavaScript``` and ```Python``` template libraries can define their own ```init()```, which runs when the template is loaded, before the strategy's ```init()```.

#### Main loop and event-driven strategies

Most strategies run a loop in ```main()```: each round fetches data, computes, places orders, then calls ```Sleep()``` to wait for the next round (see `Main Loop`). A strategy can also wait for market data, order updates and other events and handle them as they arrive (see `Event-driven handling`). For a categorized list of all API functions see `API Quick Reference`.

#### init()

Optional initialization function, called automatically once when the strategy starts, before ```main()```, to do initialization work.

```init()``` runs before ```main()```; "initializing" is logged first, then the two lines from ```main()```.

```javascript
function main(){
    Log("first line of main()", "#FF0000")
    Log("exiting")
}

// initialization function
function init(){
    Log("initializing")
}
```

```python
def main():
    Log("first line of main()", "#FF0000")
    Log("exiting")

# initialization function
def init():
    Log("initializing")
```

```rust
fn main() {
    Log!("first line of main()", "#FF0000");
    Log!("exiting");
}

// initialization function
fn init() {
    Log!("initializing");
}
```

#### onexit()

Optional clean-up function, called when the strategy exits to cancel orders, close positions, save state and so on. It may run for at most 5 minutes and is terminated when it exceeds that. For when each language calls ```onexit()```, see `Strategy Structure`.

In a backtest the strategy is usually an endless polling loop, so ```main()``` has not returned normally when the backtest data ends, and ```JavaScript``` and ```Python``` strategies therefore do not run ```onexit()```. In a backtest (```IsVirtual()``` is true) you can catch the exception (EOF) thrown when the backtest ends so that ```main()``` returns and ```onexit()``` runs; see the second example. ```Rust``` strategies need nothing special: when the backtest ends the SDK runs ```onexit()``` automatically and then stops the strategy.

```main()``` returns after 5 seconds; ```onexit()``` logs the elapsed time every second until it is terminated after 5 minutes.

```javascript
function main(){
    Log("starting; stops after 5 seconds and runs the clean-up function")
    Sleep(1000 * 5)
}

// clean-up function
function onexit(){
    var beginTime = new Date().getTime()
    while(true){
        var nowTime = new Date().getTime()
        Log("cleaning up, elapsed", (nowTime - beginTime) / 1000, "seconds")
        Sleep(1000)
    }
}
```

```python
import time
def main():
    Log("starting; stops after 5 seconds and runs the clean-up function")
    Sleep(1000 * 5)

# clean-up function
def onexit():
    beginTime = time.time() * 1000
    while True:
        ts = time.time() * 1000
        Log("cleaning up, elapsed", (ts - beginTime) / 1000, "seconds")
        Sleep(1000)
```

```rust
fn main() {
    Log!("starting; stops after 5 seconds and runs the clean-up function");
    Sleep(1000 * 5);
}

// clean-up function
fn onexit() {
    let beginTime = Unix() * 1000;
    loop {
        let nowTime = Unix() * 1000;
        Log!("cleaning up, elapsed", (nowTime - beginTime) / 1000, "seconds");
        Sleep(1000);
    }
}
```

Catch the exception at the end of a backtest so that ```main()``` returns and ```onexit()``` runs.

```javascript
function main() {
    if (exchange.GetName().startsWith("Futures_")) {
        Log("exchange is futures")
        exchange.SetContractType("swap")
    } else {
        Log("exchange is spot")
    }

    if (IsVirtual()) {
        try {
            onTick()
        } catch (e) {
            Log("error:", e)
        }
    } else {
        onTick()
    }
}

function onTick() {
    while (true) {
        var ticker = exchange.GetTicker()
        LogStatus(_D(), ticker ? ticker.Last : "--")
        Sleep(500)
    }
}

function onexit() {
    Log("running the clean-up function")
}
```

```python
def main():
    if exchange.GetName().startswith("Futures_"):
        Log("exchange is futures")
        exchange.SetContractType("swap")
    else:
        Log("exchange is spot")

    if IsVirtual():
        try:
            onTick()
        except Exception as e:
            Log(e)
    else:
        onTick()

def onTick():
    while True:
        ticker = exchange.GetTicker()
        LogStatus(_D(), ticker["Last"] if ticker else "--")
        Sleep(500)

def onexit():
    Log("running the clean-up function")
```

```rust
fn onTick() {
    loop {
        // at the end of a backtest the SDK runs onexit() first; nothing to handle here
        match exchange.GetTicker(None) {
            Ok(ticker) => LogStatus!(_D(None), ticker.Last),
            Err(e) => Log!("error:", e),
        }
        Sleep(500);
    }
}

fn main() {
    if exchange.GetName().starts_with("Futures_") {
        Log!("exchange is futures");
        let _ = exchange.SetContractType("swap");
    } else {
        Log!("exchange is spot");
    }

    onTick();
}

fn onexit() {
    Log!("running the clean-up function");
}
```

#### onerror()

Optional exception handler, ```JavaScript``` only: called when ```main()``` ends with an uncaught exception; the argument ```msg``` is the error message. When ```onerror()``` is called, ```onexit()``` is not. It may run for at most 5 minutes and is terminated when it exceeds that.

The backtesting system does not support this function, and neither do ```Python``` and ```Rust``` strategies.

An out-of-range array access in ```main()``` raises an exception, and ```onerror()``` logs the error message.

```javascript
function main() {
    var arr = []
    Log(arr[6].Close)  // deliberately raise an exception here
}

function onerror(msg) {
    Log("Error:", msg)
}
```

#### Main Loop

A strategy usually runs a loop in ```main()```: each round fetches market data, computes signals, places orders, then calls `Sleep` to wait for the next round. In backtesting ```Sleep()``` advances backtest time and controls the replay speed; in live trading it controls the polling interval and therefore how often the exchange API is called. A loop without ```Sleep()``` calls the exchange API as fast as it can and easily hits the exchange's rate limits. To limit the API call rate on the docker, see `API Rate Limiting Control`.

Basic framework: run ```onTick()``` once per round, then wait 60 seconds with ```Sleep()```.

```javascript
function onTick(){
    // strategy logic goes here and is called repeatedly, e.g. print market data
    Log(exchange.GetTicker())
}

function main(){
    while(true){
        onTick()
        // Sleep controls the polling frequency so the exchange API is not called too often
        Sleep(60000)
    }
}
```

```python
def onTick():
    Log(exchange.GetTicker())

def main():
    while True:
        onTick()
        Sleep(60000)
```

```rust
fn onTick() {
    // strategy logic goes here and is called repeatedly, e.g. print market data
    Log!(exchange.GetTicker(None));
}

fn main() {
    loop {
        onTick();
        // Sleep controls the polling frequency so the exchange API is not called too often
        Sleep(60000);
    }
}
```

Place a buy order at price 100 for amount 1 every second (a demo only; it quickly spends all funds on orders).

```javascript
function onTick(){
    // only an example: it quickly spends all funds on orders, do not run it live
    exchange.Buy(100, 1)
}

function main(){
    while(true){
        onTick()
        // the pause is in milliseconds; 1 second = 1000 milliseconds
        Sleep(1000)
    }
}
```

```python
def onTick():
    exchange.Buy(100, 1)

def main():
    while True:
        onTick()
        Sleep(1000)
```

```rust
fn onTick() {
    // only an example: it quickly spends all funds on orders, do not run it live
    let _ = exchange.Buy(100, 1);
}

fn main() {
    loop {
        onTick();
        // the pause is in milliseconds; 1 second = 1000 milliseconds
        Sleep(1000);
    }
}
```

Acting on K-line updates (On Bar): ```onTick()``` runs only when the time of the latest K-line changes.

```javascript
function onTick() {
    Log("K-line updated, new BAR generated")
}

function main() {
    var exName = exchange.GetName()
    if (exName.includes("Futures_")) {
        exchange.SetContractType("swap")
    }

    var lastTs = 0
    while (true) {
        var r = _C(exchange.GetRecords)
        if (r.length > 0 && r[r.length - 1].Time != lastTs) {
            onTick()
            lastTs = r[r.length - 1].Time
        }
        Sleep(1000)
    }
}
```

```python
def onTick():
    Log("K-line updated, new BAR generated")

def main():
    exName = exchange.GetName()
    if "Futures_" in exName:
        exchange.SetContractType("swap")

    lastTs = 0
    while True:
        r = _C(exchange.GetRecords)
        if len(r) > 0 and r[-1]["Time"] != lastTs:
            onTick()
            lastTs = r[-1]["Time"]
        Sleep(1000)
```

```rust
fn onTick() {
    Log!("K-line updated, new BAR generated");
}

fn main() {
    let exName = exchange.GetName();
    if exName.contains("Futures_") {
        let _ = exchange.SetContractType("swap");
    }

    let mut lastTs = 0;
    loop {
        let r = _C!(exchange.GetRecords(None, None, None));
        if r.len() > 0 && r[r.len() - 1].Time != lastTs {
            onTick();
            lastTs = r[r.len() - 1].Time;
        }
        Sleep(1000);
    }
}
```

#### Event-Driven

Besides polling at fixed intervals, a strategy can also wait for events to arrive before processing them, which both reduces wasted requests and responds faster to market changes.

##### EventLoop

`EventLoop` waits for events such as the completion of concurrent tasks like ```exchange.Go()``` and ```HttpQuery_Go()```, data becoming readable on a WebSocket connection, or the receipt of a thread message; when an event occurs it returns the event information, and the strategy then reads the corresponding data. Events are only recorded from the first call to ```EventLoop()``` onward, so call ```EventLoop(-1)``` once before launching concurrent tasks:

```javascript
function main() {
    EventLoop(-1)                       // Start recording events so that none occurring afterwards are missed
    var r1 = exchange.Go("GetTicker")
    var r2 = exchange.Go("GetDepth")
    var ev = EventLoop(1000)            // Wait for any concurrent task to complete, up to 1 second
    Log("event:", ev)
    Log("ticker:", r1.wait(), "depth:", r2.wait())
}
```

##### ctx.subscribe / ctx.poll

A strategy can also consume the exchange's WebSocket push feeds directly: `ctx.subscribe` subscribes to market data for a given account, the market-wide ticker feed, or the account's private stream, and returns a `Subscription` object; `ctx.poll` retrieves the next pushed event (with an optional wait timeout), and the strategy handles each event according to its ```channel```. ```JavaScript``` and ```Python``` strategies use the global ```ctx``` object; ```Rust``` strategies use the functions of the same name in the ```ctx``` module.

```javascript
function main() {
    // The first argument is the exchange object; if no symbol is given, its current trading pair is used
    var tk = ctx.subscribe(exchange, {channel: "ticker"})
    var book = ctx.subscribe(exchange, {channel: "depth", depth: 20})    // 20-level order book
    // Account private stream: order updates, positions and balances are all pushed through this one feed
    var acct = ctx.subscribe(exchange, {channel: "private"})
    while (true) {
        const ev = ctx.poll([], 1000)                    // [] means all subscriptions of this thread; wait up to 1 second
        if (!ev) {
            continue
        }
        if (ev.type === "status") {                      // Handle gateway status and subscription status events separately first
            if (ev.kind === 35 && ev.prefillStatus === 2) {
                Log("subscription failed:", ev.channel, ev.message)
            }
            continue
        }
        if (ev.channel === "ticker") {
            Log("ticker:", ev.symbol, ev.bid, ev.ask, ev.last)
        } else if (ev.channel === "depth") {
            // Depth events carry no level data; read it from this subscription's own order book
            const b = ev.book(1)
            if (b.bids.length > 0 && b.asks.length > 0) {
                Log("bid1:", b.bids[0][0], "ask1:", b.asks[0][0])
            }
        } else if (ev.channel === "orders") {
            Log("order:", ev.id, ev.state, ev.filledQty)
        } else if (ev.channel === "positions" || ev.channel === "balance") {
            Log("positions:", acct.positions(), "balances:", acct.balances())
        }
    }
}
```

```Python``` works the same way: options are a dict, and events are dicts too (attribute access such as ```ev.kind``` also works):

```python
def main():
    tk = ctx.subscribe(exchange, {"channel": "ticker"})
    book = ctx.subscribe(exchange, {"channel": "depth", "depth": 20})
    acct = ctx.subscribe(exchange, {"channel": "private"})
    while True:
        ev = ctx.poll([], 1000)                          # Returns None on timeout
        if ev is None:
            continue
        if ev.type == "status":
            if ev.kind == 35 and ev.prefillStatus == 2:
                Log("subscription failed:", ev.channel, ev.message)
            continue
        if ev.channel == "ticker":
            Log("ticker:", ev.symbol, ev.bid, ev.ask, ev.last)
        elif ev.channel == "depth":
            b = ev.book(1)
            if b["bids"] and b["asks"]:
                Log("bid1:", b["bids"][0][0], "ask1:", b["asks"][0][0])
        elif ev.channel == "orders":
            Log("order:", ev.id, ev.state, ev.filledQty)
        elif ev.channel in ("positions", "balance"):
            Log("positions:", acct.positions(), "balances:", acct.balances())
```

- The first argument is the exchange object (```exchange```, ```exchanges[1]```) or the account's index in ```exchanges```; the second argument is the options object ```{channel, symbol, depth, interval, mode, buffer}```, with the instrument specified in ```symbol```.
- ```channel``` can be ```ticker```, ```bbo```, ```depth``` (```depth``` is the number of levels), ```trade```, ```kline``` (```interval``` is the candlestick period in seconds), ```tickers``` or ```private```. ```private``` takes no instrument; order updates, positions and balances are all pushed through this one feed, and the corresponding events have ```channel``` set to ```orders```, ```positions``` and ```balance``` respectively. After subscribing, an account snapshot is pushed first; once it is ready, the latest positions and balances can be obtained via the subscription object's ```positions()``` and ```balances()```.
- ```tickers``` takes no instrument; a single subscription receives tickers for every instrument on the exchange, and the event's ```symbol``` is the corresponding instrument. Only exchanges that provide a market-wide push feed support this channel; see the "Push" column of the `capability matrix` for details. When it is not supported, the subscription receives a failed status event.
- When ```symbol``` is an array, multiple instruments are subscribed at once and an array of subscription objects is returned in the same order: the whole batch is validated first, and if any instrument is invalid, nothing in the batch is subscribed. The array can be passed directly to ```ctx.poll()```, and calling the array's ```unsubscribe()``` unsubscribes all of them at once.
- Every event contains fields such as ```stream``` (the ```id``` of the subscription it belongs to), ```type``` and ```channel```; see `ctx.poll` for field details. A depth event only signals that the order book has been updated; the level data must be read via ```ev.book(n)``` or the subscription object's ```book(n)```.
- Identical subscriptions share a single push feed. To unsubscribe, call the subscription object's ```unsubscribe()```; the subscription is actually cancelled only when the last subscription object unsubscribes. A subscription that the exchange does not support does not throw an exception; instead, that subscription receives a status event with ```prefillStatus``` set to ```2```.
- If market data subscriptions are not consumed promptly, only the latest data is kept or the oldest data is dropped; order updates, positions and balances are never dropped. The strategy must keep calling ```ctx.poll()```. To check whether events are being processed in time, look at the ```feed``` counters for each exchange in ```ctx.connectors()```.
- Push feeds and REST interfaces are independent of each other: functions such as ```exchange.GetTicker()``` and ```exchange.GetDepth()``` still call the exchange's REST API on every request and do not read push data. See the respective exchange pages for the push channels each exchange supports.
- In ```JavaScript``` and ```Rust```, ```EventLoop()``` and ```ctx.poll()``` in the same thread take events from the same event queue, so a thread should use only one of them; in ```Python```, ```EventLoop()``` has its own separate queue and does not compete with ```ctx.poll()```.

A subscription belongs to the thread that called ```ctx.subscribe()```: events are delivered only to that thread, ```ctx.poll()``` only retrieves events for the current thread's subscriptions, and only that thread can unsubscribe. To dedicate a thread to a set of market data, subscribe within that thread; when different threads subscribe to the same content, the exchange side is subscribed only once, but each thread receives its own copy:

```javascript
function main() {
    var t = threading.Thread(function(symbols) {
        var subs = ctx.subscribe(0, {channel: "depth", symbol: symbols, depth: 5})
        while (true) {
            var ev = ctx.poll([], 1000)                  // Only the two feeds subscribed by this thread
            if (ev && ev.kind === 3) {
                var b = ev.book(1)
                if (b.bids.length > 0 && b.asks.length > 0) {
                    Log(ev.symbol, "bid1:", b.bids[0][0], "ask1:", b.asks[0][0])
                }
            }
        }
    }, ["ETH_USDT", "SOL_USDT"])
    var acct = ctx.subscribe(0, {channel: "private"})   // The main thread handles only the account private stream
    while (true) {
        var ev = ctx.poll([acct], 1000)
        if (ev && ev.kind === 16) {
            Log("order:", ev.id, ev.state)
        }
    }
}
```

```Python``` creates threads with the standard library's ```threading.Thread``` and works the same way; when a thread ends, its subscriptions are unsubscribed automatically.

In ```Rust``` strategies, the calls are ```ctx::subscribe()``` and ```ctx::poll()```; subscription options are built with ```ctx::SubOpts```, batch subscriptions use ```ctx::subscribe_many()```, and any thread can subscribe. Events are raw structs; after importing ```sdk::ctx::EventExt```, methods such as ```ev.channel()```, ```ev.book(n)```, ```ev.ticker()```, ```ev.order()``` and ```ev.feed_status()``` read them according to event type (prices and quantities are already converted to real numbers, so no ```unsafe``` code is needed):

```rust
use sdk::ctx::EventExt;

fn main() {
    let book = ctx::subscribe(exchange, ctx::SubOpts::depth(20)).unwrap();
    loop {
        match ctx::poll(&[book.id()], Some(1000)) {
            ctx::Polled::Event(ev) => {
                if let Ok(b) = ev.book(1) {
                    if !b.bids.is_empty() && !b.asks.is_empty() {
                        Log!("bid1:", b.bids[0].0, "ask1:", b.asks[0].0);
                    }
                }
            }
            ctx::Polled::Stopped => break,
            _ => {}
        }
    }
}
```

### Programming Languages

Strategies can be written in ```JavaScript```, ```Python```, ```Rust```, [```PINE```](https://www.fmz.com/bbs-topic/9315), [```My Language```](https://www.fmz.com/bbs-topic/2569) (MyLanguage) and the ```Workflow``` visual editor.

```JavaScript```, ```Python``` and ```Rust``` strategies call the platform's full API directly; PINE and My Language follow the script syntax of TradingView and Wenhua; Workflow builds a strategy from visual nodes without writing code.

#### JavaScript

Strategies can be written in ```JavaScript```. The runtime is based on the QuickJS engine and supports modern syntax such as ```async```/```await```, ```class``` and ```BigInt```. In live trading the strategy runs on the docker; in backtesting it runs in the browser-side backtesting system. Strategies can also be written in TypeScript; see "Writing in TypeScript" at the end of this page.

##### Structure and parameters

The entry point is ```function main()```. The optional ```init()```, ```onexit()``` and ```onerror(msg)``` are called automatically by the docker (see `Strategy Structure`). Interface parameters are global variables with the same names; they can be read directly and also modified in code (see `Strategy Parameters`).

##### Errors and return values

When an API call fails (the exchange returns an error, a network problem, etc.) it returns ```null``` and writes the error to the log. Check the return value before using it, or retry with `_C`:

```javascript
function main() {
    var ticker = exchange.GetTicker()
    // null when the call fails
    if (ticker) {
        Log(ticker)
    }

    // retry until valid data is returned
    var account = _C(exchange.GetAccount)
    Log(account)
}
```

For program exceptions (for example reading a property of ```undefined```) and API business errors, the log shows the line number in the strategy code where the error occurred, which makes debugging easier.

##### Strings and ArrayBuffer

JavaScript strings are UTF-16. If text returned by a platform API is not a valid UTF-8 byte sequence, an ```ArrayBuffer``` (the raw bytes) is returned instead so that no data is lost. Every API parameter that accepts a string also accepts an ```ArrayBuffer```.

```javascript
function stringToHex(str) {
    let hex = ''
    for (let i = 0; i < str.length; i++) {
        const charCode = str.charCodeAt(i).toString(16)
        hex += charCode.length === 1 ? '0' + charCode : charCode
    }
    return hex
}

function main() {
    // the code point of "𠮷" exceeds 16 bits; it takes two UTF-16 code units in a JavaScript string
    const inputString = "abc𠮷123"

    // Encode outputs the UTF-8 bytes as hex
    const encodedHex = Encode("raw", "string", "hex", inputString)
    Log(encodedHex)                       // 616263f0a0aeb7313233

    // charCodeAt returns UTF-16 code units, so "𠮷" becomes d842, dfb7 - not UTF-8
    const manuallyEncodedHex = stringToHex(inputString)
    Log(manuallyEncodedHex)               // 616263d842dfb7313233

    // valid UTF-8 bytes decode back to a string
    const decodedString = Encode("raw", "hex", "string", encodedHex)
    Log(decodedString)                    // abc𠮷123

    // bytes that are not valid UTF-8 come back as an ArrayBuffer
    // (with inputString = "abcG123" both encodings are identical and this is a string)
    const outputD = Encode("raw", "hex", "string", manuallyEncodedHex)
    Log(outputD instanceof ArrayBuffer)   // true

    // inspect the raw bytes in the ArrayBuffer
    const bufferD = new Uint8Array(outputD)
    let hexBufferD = ''
    for (let i = 0; i < bufferD.length; i++) {
        hexBufferD += bufferD[i].toString(16).padStart(2, '0')
    }
    Log(hexBufferD)                       // 616263d842dfb7313233
}
```

##### Asynchrony and threads

- ```setTimeout```/```clearTimeout```: callbacks run while the main thread is waiting in ```Sleep()```. When ```main()``` returns, timers that have not fired yet run first, then ```onexit()``` is called.
- ```fetch(url)```: returns a ```Promise``` that resolves to a response object (```ok```, ```status```, ```headers```; ```text()``` and ```json()``` return the content directly). On the docker, ```fetch``` completes the request synchronously when called and returns an already settled ```Promise```, so combining several ```fetch``` calls with ```Promise.all``` does not make them concurrent.
- Exchange APIs (such as ```exchange.GetTicker()```) are synchronous blocking calls; wrapping them in a ```Promise``` or an ```async``` function does not make them concurrent either.
- For concurrency use `exchange.Go`, `HttpQuery_Go`, or create threads with `Thread` (see `JavaScript Multi-threading`).

```javascript
async function main() {
    let resp = await fetch("https://www.okx.com/api/v5/market/books?instId=BTC-USDT")
    if (resp.ok) {
        Log(resp.json())
    } else {
        Log("status:", resp.status)
    }
}
```

##### Libraries and dependencies

JavaScript strategies can use the built-in ```TA``` and ```talib``` indicator libraries directly; see `Built-in Libraries` for what each language provides. Other third-party JavaScript libraries can be downloaded at run time and loaded with ```eval```; the same page has an example.

##### Writing in TypeScript

TypeScript is not a separate language option. Create the strategy as ```JavaScript``` and put a ```//@ts-check``` comment line in the code (usually the first line), or click the "TypeScript" button at the top right of the editor; the platform then treats it as TypeScript and compiles it to JavaScript before backtesting or live trading. When a strategy is saved through the AI/MCP tools, the language can be given as ```typescript```: the platform saves it as a JavaScript strategy and adds ```//@ts-check``` at the top automatically (see `AI Integration`).

Type declarations for the platform API are built into the strategy editor; nothing needs to be referenced in the code. They cover the global functions, the ```exchange``` object, data structure interfaces such as ```ITicker```, ```IRecord```, ```IOrder``` and ```IPosition```, and ```TA```, ```talib``` and so on. Static type checking catches mistakes such as wrong argument counts, property names or types while you write. Language features, APIs and libraries at run time are the same as for JavaScript.

```typescript
//@ts-check
function getSignal(ticker: ITicker, ma: number): "buy" | "sell" | null {
    if (ticker.Last > ma) {
        return "buy"
    }
    return ticker.Last < ma ? "sell" : null
}

function main() {
    const records = exchange.GetRecords()
    const ticker = exchange.GetTicker()
    if (records && ticker && records.length > 20) {
        const ma = TA.MA(records, 20)
        Log(getSignal(ticker, ma[ma.length - 1]))
    }
}
```

#### Python

Strategies can be written in ```Python 3```; Python 2 is not supported. Live trading, and backtests that run on a docker, use the Python interpreter installed on the docker's machine.

##### Interpreter

For live trading the docker looks for an interpreter in this order and uses the first program that starts and is Python 3:
1. the interpreter named on the strategy's first line after ```#!```, for example ```#!/opt/venv/bin/python3```; with ```#!/usr/bin/env python3.11``` it takes ```python3.11```;
2. the interpreter given by the environment variable ```PYTHON_BIN```;
3. ```python3```;
4. ```python```.

If the interpreter named on the first line cannot be used, the docker falls back to the next candidates and leaves a note in ```stderr.log``` in the live trading directory. To choose an interpreter without changing the strategy code (for example the Python of a virtual environment), set the environment variable before starting the docker:

```bash
export PYTHON_BIN=/opt/venv/bin/python3
```

Backtests that run on a docker do not read ```PYTHON_BIN```: they search ```PATH``` for the first program that exists, in the order: the interpreter named after ```#!```, ```python3```, ```python```.

##### Structure and parameters

The entry point is ```def main()```. The optional ```init()``` and ```onexit()``` are called automatically by the docker (Python does not support ```onerror()```); see `Strategy Structure`. Interface parameters are global variables with the same names; to assign a new value to one inside a function, declare it with ```global``` first.

##### Errors and return values

When an API call fails it returns ```None``` and writes the error to the log. Check the return value before using it, or retry with ```_C()```. An uncaught exception ends the strategy, and the error is recorded in the log.

##### Output

The output of ```print()``` is written to ```logs/storage/<robot ID>/stdout.log``` under the docker's directory (error output goes to ```stderr.log``` in the same directory) and does not appear in the live trading log. Use `Log` for anything that should show up in the log.

##### Third-party packages

A strategy can import any package installed in the interpreter. Install packages with the same interpreter the docker uses, for example:

```bash
python3 -m pip install numpy
# when the first line names an interpreter with #!, install with that one, e.g.
/opt/venv/bin/python3 -m pip install numpy
# when PYTHON_BIN is set
$PYTHON_BIN -m pip install numpy
```

To use ```talib```, install TA-Lib (the ```talib``` package) and ```numpy``` on the docker's machine.

##### Your own modules

While a strategy runs, its current directory is the live trading directory ```logs/storage/<robot ID>/``` (files opened with relative paths land there and are kept with the live trading); ```PYTHONPATH``` is a temporary directory created by the docker for that run and deleted afterwards. The current directory is not on the module search path, so ```.py``` files placed in the live trading directory are not found automatically. There are two ways to import your own modules:
- install the module into the interpreter's ```site-packages``` (for example package it and install it with ```pip install```, or copy it into the ```site-packages``` directory);
- in the strategy, append the absolute path of the module's directory to ```sys.path```, then import it.

For example, with the module file ```/home/user/fmz_modules/mymath.py```:

```python
# mymath.py
def add(a, b):
    return a + b
```

the strategy code is:

```python
import sys
sys.path.append("/home/user/fmz_modules")   # absolute path of the module's directory

import mymath

def main():
    Log("mymath.add(1, 2):", mymath.add(1, 2))
```

Keeping the core logic in a module on your own docker, with only the calling code in the strategy, is also a way to avoid uploading that logic to the platform.

#### Rust

Strategies can be written in ```Rust```. Rust strategies are compiled before they run: for backtesting the platform server compiles them and they are backtested in the cloud (on the platform's servers) by default, or in the browser if you choose the "Local" backtest node; in live trading they run on the docker once compiled. The strategy editor integrates ```rust-analyzer``` for Rust, with code completion and live diagnostics.

##### Structure

A strategy only needs a ```fn main()```. The platform API (```exchange```, ```exchanges```, ```TA```, ```Log!```, ```_C!``` and so on) is imported automatically; no ```use``` or ```mod``` declarations are needed.

The optional ```fn init()``` and ```fn onexit()``` are called automatically by the docker; just define them, no registration is needed. ```init()``` runs before ```main()```; ```onexit()``` runs when ```main()``` returns normally, when the live trading is stopped, and when the strategy panics. Rust does not support ```onerror()```. See `Strategy Structure`.

```rust
fn init() {
    Log!("initializing");
}

fn main() {
    // APIs that can fail return Result<T>; the _C! macro retries until the call succeeds
    let ticker = _C!(exchange.GetTicker(None));
    Log!("Last:", ticker.Last);
}

fn onexit() {
    Log!("strategy exiting, cleaning up");
}
```

Some functions are macros (note the exclamation mark): ```Log!()```, ```LogStatus!()```, ```Panic!()```, ```_G!()```, ```_C!()```. ```LogProfit()```, ```Sleep()```, ```_D()```, ```_N()```, ```HttpQuery()``` and others are ordinary functions.

##### Parameter types

Interface parameters are injected as global constants with the same names. They can only be read, not modified in code (copy a value into a local variable if it needs to change). The type depends on the kind of parameter:

| Parameter kind | Rust type |
| - | - |
| Number | ```f64``` |
| Boolean | ```bool``` |
| String | ```&str``` |
| Dropdown (single choice) | ```f64``` (option index); ```&str``` when the options are bound to string data |
| Dropdown (multiple choice) | ```&[i64]```, ```&[f64]``` or ```&[&str]```; JSON text as ```&str``` when the option values have mixed types |
| Encrypted string | ```&str``` or ```Decrypted``` (dereferences to ```str```) |

- Convert explicitly where an integer is needed, for example ```let n = Period as usize;```.
- An optional parameter that is left empty has the zero value of its type: ```0.0```, ```""```, ```false```, or an empty list for a multiple-choice dropdown.
- When the server cannot decrypt an encrypted-string parameter in advance (for example on a private docker), it is injected as a ```static``` of type ```Decrypted``` and decrypted on first use. It implements ```Display```, so it can be used directly with ```format!```; when passing it to ```Log!``` or anywhere a ```&str``` is needed, write ```&*ParamName``` (this also works for ```&str``` parameters):

```rust
fn main() {
    let key: &str = &*ApiKey;   // ApiKey is an encrypted-string parameter
    Log!("key length:", key.len());
}
```

- If a parameter name clashes with another name in the code, refer to the parameter as ```args::ParamName```.

##### Errors and return values

API calls that can fail return ```Result<T>```; handle it the usual Rust way (in JavaScript a failed call returns ```null```):

```rust
fn main() {
    // option 1: pattern matching
    if let Ok(ticker) = exchange.GetTicker(None) {
        Log!(ticker);
    }

    // option 2: the _C! macro retries until the call succeeds
    let ticker = _C!(exchange.GetTicker(None));
    Log!(ticker);
}
```

Optional arguments (such as the ```symbol``` argument of ```GetTicker```) are passed as ```None``` when omitted, or given directly, for example ```exchange.GetTicker("BTC_USDT")```.

##### JSON

Raw JSON text returned by the platform API (for example the return value of ```exchange.IO()``` or the ```Info``` field of each structure) is parsed with the built-in ```JSONParse()```, which returns an ```Option<JsonValue>```. Navigate with ```v["key"]``` and ```v[0]``` and read values with methods such as ```as_f64()```, ```as_str()``` and ```as_bool()```. ```JsonValue``` implements ```Display```, so ```v.to_string()``` or ```format!("{}", v)``` gives compact JSON text. The SDK has no convenient API for building JSON; build JSON text with ```format!```, or use ```serde_json```.

##### Third-party crates

The strategy source is the only code file (there is no separate ```Cargo.toml```). Declare dependencies in a frontmatter block wrapped in ```---``` at the very top of the source; it is merged into ```Cargo.toml``` at build time:

```rust
---
[dependencies]
serde_json = "1"
---
/*backtest
start: 2024-01-01 00:00:00
end: 2024-02-01 00:00:00
period: 1h
*/
fn main() {
    let v: serde_json::Value = serde_json::from_str(r#"{"a": 1}"#).unwrap();
    Log!("a:", v["a"].to_string());
}
```

- The frontmatter must be at the start of the source, with only blank lines or lines starting with ```#!``` before it; the ```/*backtest ... */``` backtest configuration block goes after the closing ```---```. If the strategy has no backtest configuration block yet, "Save Backtest Settings" inserts one at the very top of the source; move it below the frontmatter (later saves update it in place).
- Between a strategy and the template libraries it references, the dependency block may appear in only one place; declaring it in both fails the build.
- The build environment has no system OpenSSL. For crates that need TLS (HTTP/WebSocket clients and the like), choose the pure-Rust ```rustls``` implementation (for example ```tokio-tungstenite``` with the ```rustls-tls-webpki-roots``` feature) and avoid ```native-tls```/```openssl-sys```. For WebSocket connections prefer the built-in `Dial` function, which needs no third-party crate.

##### Built-in libraries

Rust strategies can use the ```TA``` indicator library; ```talib``` is not supported. See `Built-in Libraries`.

#### MyLanguage

Strategies can be written in MyLanguage, which is compatible with most of the syntax, instructions and functions of Wenhua MyLanguage. It breaks complex algorithms into functions and describes trading logic with a concise syntax and a library of financial functions.

Example strategy: a system based on displaced Bollinger Bands

```My
M := 12;          // Parameter range 1, 20
N := 3;           // Parameter range 1, 10
SDEV := 2;        // Parameter range 1, 10
P := 16;          // Parameter range 1, 20

// A trend-following strategy for larger periods such as daily K-lines.
// This model is only an example of model development; trade on it at your own risk.

////////////////////////////////////////////////////////

// Displaced BOLL channel calculation
MID:=MA(C,N);                 // Calculate middle band
TMP:=STD(C,M)*SDEV;           // Calculate standard deviation
DISPTOP:=REF(MID,P)+TMP;      // Displaced BOLL channel upper band
DISPBOTTOM:=REF(MID,P)-TMP;   // Displaced BOLL channel lower band

// System entry
H>=DISPTOP,BPK;
L<=DISPBOTTOM,SPK;
AUTOFILTER;
```

- [FMZ Quant MyLanguage Documentation](https://www.fmz.com/bbs-topic/2569)
- [FMZ Quant MyLanguage--MyLanguage Trading Library Parameters](https://www.fmz.com/bbs-topic/5768)

#### PINE Language

The platform supports ```Trading View```'s PINE language scripts. PINE is used to write indicators and strategies that can be backtested and traded live; the community has published more than 100,000 PINE scripts that you can reuse to implement your own trading ideas instead of starting from scratch.

Example strategy: Supertrend

```pine
strategy("supertrend", overlay=true)

[supertrend, direction] = ta.supertrend(input(5, "factor"), input.int(10, "atrPeriod"))
plot(direction < 0 ? supertrend : na, "Up direction", color = color.green, style=plot.style_linebr)
plot(direction > 0 ? supertrend : na, "Down direction", color = color.red, style=plot.style_linebr)

if direction < 0
    if supertrend > supertrend[2]
        strategy.entry("entry long", strategy.long)
    else if strategy.position_size < 0
        strategy.close_all()
else if direction > 0
    if supertrend < supertrend[3]
        strategy.entry("entry short", strategy.short)
    else if strategy.position_size > 0
        strategy.close_all()
```

- [PINE Script Documentation](https://www.fmz.com/bbs-topic/9315)

#### Workflow

The platform supports writing strategies using the Workflow approach. Workflow is a visual strategy design method that builds trading logic through node connections and configurations, enabling strategy implementation without writing code.

##### Workflow Features
- Visual drag-and-drop design, WYSIWYG
- Rich preset functional nodes (data retrieval, indicator calculation, conditional judgment, trade execution, etc.)
- Lower programming barrier, suitable for rapid strategy building and validation
- Supports backtesting functionality with visual node execution status viewing

##### Learning Resources
- [Workflow Video Tutorial Series](https://www.fmz.com/class/workflow)

### Strategy Parameters

Set in the strategy interface; they appear in the strategy code as global variables with the same names (global constants in Rust), accessed by name. Differences between languages:
- ```JavaScript```, ```MyLanguage```: parameters can be read directly and the parameter variables can also be modified in code.
- ```Python```: parameters can be read directly; to assign a new value to one inside a function, declare it with ```global``` first.
- ```Rust```: parameters are constants that can only be read, not modified; see `Rust` for the type of each kind of parameter.
- ```PINE```: interface parameters are created with the ```input()``` function.

![Strategy Parameter Settings Interface](https://www.fmz.com/upload/asset/2e46b5e593de3b2f11445.png)

#### Interface Parameter Types

Interface parameters are set in the strategy parameters area below the code editor on the strategy editing page. There are 5 types; the variable names in the table are only examples:

| Type | Example variable | Value in code | Default value |
| - | - | - | - |
| Number (number) | ```pNum``` | A number; ```f64``` in Rust | Enter a number, e.g. ```100``` |
| Boolean (true/false) | ```pBool``` | A boolean | Set with a switch; cannot be optional |
| String (string) | ```pStr``` | A string | Type it as is, e.g. ```abc```, without quotes |
| Dropdown (selected) | ```pCombox``` | Index or bound data of the selected option; an array with multiple selection | Select one or more options |
| Encrypted string (string) | ```pSecretStr``` | A string | Type it as is, e.g. ```xyz```, without quotes |

##### Settings of a parameter
- Variable: the name of the parameter's global variable in the strategy code; do not use a reserved word (keyword) of the programming language.
- Description: the display name of the control bound to the parameter.
- Remarks: the tooltip shown when the mouse hovers over the parameter's control in the backtest or live robot interface.
- Default value and "Optional": the "Optional" switch next to the default value is on by default and can be turned off to make the parameter required. A backtest or live robot cannot start if a required parameter is not set.
- Component configuration: the type of UI control bound to the parameter, plus minimum, maximum, group, filter and so on; see `Component Configuration`.

##### Notes
- Parameters are global variables in the code and can be modified there (except in Rust, where parameters are global constants and cannot be modified).
- An "Encrypted string" parameter is used the same way as a "String" parameter, but it is sent encrypted, never in plain text.
- An optional parameter that is left empty is an empty string for String parameters, and a null value for Number, Dropdown and Encrypted string parameters. In ```Rust``` strategies it is the zero value of its type: ```0``` for numbers, an empty string for strings and encrypted strings, ```false``` for booleans.
- A dropdown parameter without "Support multiple selection" in its component configuration holds the index of the selected option, or the option's bound data if data is bound; with "Support multiple selection" it holds an array of the indices (or bound data) of all selected options.

#### Component Configuration

Both strategy interface parameters and strategy interactive controls have a "Component Configuration" option. It sets the UI control used for the parameter (or interactive control), as well as the minimum, maximum, group, filter and so on.

Components available for each type (the first one is the default):

| Type | Components |
| - | - |
| Number (number) | Input box, time picker, slider |
| Boolean (true/false) | Switch |
| String (string) | Input box, text box, time picker, color picker, currency, trading symbol |
| Dropdown (selected) | Dropdown, segmented control, currency, trading symbol |
| Encrypted string (string), strategy parameters only | Encrypted input box |
| Button (button), interactive controls only | Button (no input) |

##### Group

Enter a label in the "Group" box of the component configuration to put several strategy parameters in the same group (replacing the platform's old "Strategy Grouping" feature). Interactive controls can be grouped the same way (replacing the old "Interactive Control Grouping" feature).

##### Filter

In the component configuration of a strategy parameter, the "Filter" box takes a condition expression that controls whether the parameter is available (replacing the platform's old "Parameter Dependency" feature). The filter is empty by default, meaning no filtering; the parameter is available when the condition is true. Expressions such as ```a > b```, ```a == 1```, ```a```, ```!a``` and ```a >= 1 && a <= 10``` can be used, for example:
- ```a == 1```: available when parameter ```a``` equals 1, otherwise not.
- ```a >= 1 && a <= 10```: available when ```a``` is at least 1 and at most 10, otherwise not.
- ```!a```: the condition is "not a"; ```a``` can be a boolean or a number (```!0``` is true).

#### Save Parameter Settings

Strategy parameters set for a backtest can be saved into the strategy code; a live robot's parameters can be exported to a file and imported into another robot.

##### Saving backtest parameters
After changing strategy parameters on the backtest page, click "Save Backtest Settings": the parameters are saved together with the backtest configuration as a comment block at the top of the strategy code; see `Backtest Configuration and Saving`. For example, for a strategy with these parameters:

| Variable | Description | Type | Default |
| - | - | - | - |
| number | Number | Number (number) | 1 |
| string | String | String (string) | Hello FMZ |
| combox | Dropdown | Dropdown (selected) | 1\|2\|3 |
| bool | Boolean | Boolean (true/false) | true |
| numberA | Number A (filter ```isShowA```: available only when ```isShowA``` is true) | Number (number) | 2 |
| isShowA | Whether to show numberA | Boolean (true/false) | false |

after changing the values and saving, the block at the top of the code looks like this (```JavaScript``` and ```Rust``` use ```/*backtest ... */```, ```Python``` uses ```'''backtest ... '''```):

```javascript
/*backtest
start: 2020-02-29 00:00:00
end: 2020-03-29 00:00:00
period: 1d
args: [["number",2],["string","Hello"],["combox",2],["bool",false],["numberA",666],["isShowA",true]]
*/
```

```python
'''backtest
start: 2020-02-29 00:00:00
end: 2020-03-29 00:00:00
period: 1d
args: [["number",2],["string","Hello"],["combox",2],["bool",false],["numberA",666],["isShowA",true]]
'''
```

If a ```Rust``` strategy declares dependencies in a frontmatter block at the top, the backtest configuration block must come after the frontmatter; see `Rust`.

##### Importing and exporting live robot parameters
1. On the robot page, click "Parameter Settings", then "Export Parameters"; the parameters are saved as a ```json``` file.
2. On the robot page that should receive them, click "Import Parameters" and choose the exported file.
3. Click "Update Parameters" to save; the imported parameters take effect only then.

### Interactive Controls

Strategies in ```JavaScript```, ```Python```, ```Rust``` and MyLanguage can have interactive controls, which send interaction commands to the strategy while it is running live. In ```JavaScript```, ```Python``` and ```Rust``` strategies, the messages produced by interactive controls are read with the `GetCommand` function. The "Component Configuration" of interactive controls is the same as for strategy parameters (see `Component Configuration`).

![Interactive Controls](https://www.fmz.com/upload/asset/2e4320d0cc33c15eb935d.png)

With code in the strategy that handles interactive control messages, interactive controls in live trading can be used for (among other things):
- Manually closing the strategy's positions.
- Changing strategy parameters dynamically without restarting the live trading.
- Switching strategy logic.
- Printing debugging information or data to test a feature.

#### Types of Interactive Controls

There are 5 types of interactive control. When the control's button is clicked, `GetCommand` in the strategy receives a string message. The variable names in the table are only examples:

| Type | Example variable | Default value | Message received by ```GetCommand()``` |
| - | - | - | - |
| Number (number) | ```cmdNum``` | Optional, may be empty | Enter ```123``` and click: ```cmdNum:123``` |
| Boolean (true/false) | ```cmdBool``` | Required, on or off | Click with the switch on: ```cmdBool:true``` |
| String (string) | ```cmdStr``` | Optional, may be empty | Enter ```abc``` and click: ```cmdStr:abc``` |
| Dropdown (selected) | ```cmdCombox``` | Optional, may be empty | Pick option 2 and click: ```cmdCombox:1``` (index from 0) |
| Button (button) | ```cmdBtn``` | No input | Click: ```cmdBtn``` |

The message format is ```variable:value```; a button sends only its variable name. Description, remarks and component configuration of interactive controls work as for strategy parameters; see `Interface Parameter Types` and `Component Configuration`.

##### Example: changing a strategy parameter with an interactive control

On the strategy editing page, add a string interactive control named ```changeSymbol``` under "Strategy Interaction". The settings of the interactive control:

![Setting up an interactive control](https://www.fmz.com/upload/asset/1741a2b35e569c5e07e3.png)

While the strategy runs live, enter ```ETH_USDT``` in the control's input box and click its button; ```GetCommand()``` receives the message ```changeSymbol:ETH_USDT```. The strategy detects the message and updates the corresponding variable (parameters set in the strategy interface are global variables too; a global variable in the code is used here for demonstration):

```javascript
// strategy parameter
var symbol = "BTC_USDT"

function main() {
    while (true) {
        var cmd = GetCommand()
        if (cmd) {
            var arr = cmd.split(":")
            if (arr.length == 2 && arr[0] == "changeSymbol") {
                // the changeSymbol control was triggered: update the parameter
                Log("Changed symbol parameter to:", arr[1])
                symbol = arr[1]
            }
        }

        LogStatus(_D(), ", Current symbol parameter value:", symbol)
        Sleep(3000)
    }
}
```

#### Interactive Controls in Status Bar

Besides the controls designed in the "Strategy Interaction" section, a strategy can output interactive controls in its status bar. The only interactive control there is the button. For all fields of buttons and input controls, and the format of the command that `GetCommand` receives after a click, see "Status bar buttons" on the `LogStatus` page; this page shows the common patterns.

There are three kinds of status bar buttons:
- A plain button: a click opens a confirmation box, and on confirmation the strategy receives ```cmd```.
  ```json
  {"type": "button", "name": "平仓|Close", "cmd": "close",
   "description": "平掉全部持仓|close all positions"}
  ```
- A button with one input control: set it with ```input```; the strategy receives ```cmd:value```.
  ```json
  {
      "type": "button",
      "name": "开仓|Open",
      "cmd": "open",
      "input": {"type": "number", "name": "amount", "label": "开仓数量|amount",
                "default": 1, "required": true}
  }
  ```
- A button with a group of input controls: set them with ```group```; the strategy receives ```cmd:JSON``` keyed by each control's ```name```. In this example the price control is shown only when the order type is "limit":
  ```json
  {
      "type": "button",
      "cmd": "order",
      "name": "下单|Order",
      "group": [
          {"type": "selected", "name": "orderType", "label": "下单方式|order type", "default": 0,
           "settings": {"options": ["市价单|market", "限价单|limit"]}},
          {"type": "number", "name": "price", "label": "价格|price",
           "settings": {"filter": "orderType==1"}},
          {"type": "number", "name": "amount", "label": "数量|amount", "default": 1,
           "required": true}
      ]
  }
  ```

When writing these controls:
- Put the display condition in ```settings.filter``` (for example ```"filter": "orderType==1"```), referring to the ```name``` of another control in the same group; a ```filter``` at the top level of the control has no effect.
- Put ```"required": true``` at the top level of the control; a ```required``` inside ```settings``` has no effect.
- Each line of the status bar can hold only one JSON block wrapped in ``` ` ```. Output several buttons on separate lines, or put them in a status bar table (several buttons in one cell are written as an array of buttons).
- Texts can be bilingual, written as ```"中文|English"``` and shown according to the page language.

To output a button, encode the button object as a JSON string, wrap it in ``` ` ``` and pass it to ```LogStatus()```. In JavaScript:

```javascript
function main() {
    var btnClose = {"type": "button", "name": "平仓|Close", "cmd": "close"}
    var btnOpen = {
        "type": "button", "name": "开仓|Open", "cmd": "open",
        "input": {"type": "number", "name": "amount", "label": "开仓数量|amount", "default": 1}
    }
    // one JSON block per line: the two buttons go on two lines
    LogStatus("`" + JSON.stringify(btnClose) + "`\n`" + JSON.stringify(btnOpen) + "`")
    while (true) {
        var cmd = GetCommand()
        if (cmd) {
            Log("command received:", cmd)   // "close", "open:2"
        }
        Sleep(1000)
    }
}
```

For buttons in status bar tables, button colors and sizes (```class```), multi-select and customizable drop-downs, sliders, date pickers and other control styles, see `LogStatus`.

##### Status bar display components

Besides text, tables and buttons, `LogStatus` accepts objects with a `type` directly and the status bar renders them as components: `grid` and `tabs` handle layout, while `kpi` (KPI card), `stat` (key-value list), `chart` (line, bar and area charts), `sparkline`, `gauge`, `progress`, `pie`, `histogram`, `heatmap`, `calendar`, `timeline`, `markdown`, `alert` and `badge` display data. Components are display-only and can share a `grid` with buttons and tables:

```javascript
function main() {
    var btn = {type: "button", name: "平仓|Close", cmd: "close"}
    while (true) {
        var ticker = exchange.GetTicker()
        if (ticker) {
            LogStatus({type: "grid", cols: 2, items: [
                {type: "kpi", title: "Last price", value: ticker.Last},
                btn   // no backticks needed for a button inside a grid
            ]})
        }
        var cmd = GetCommand()
        if (cmd) {
            Log("Command received:", cmd)
        }
        Sleep(1000)
    }
}
```

For the fields of every component and examples in three languages see `Status Bar Components`; for the input forms (objects, backticks, several arguments) see `LogStatus`.

### Template Library

A reusable code module on the FMZ Quant Trading Platform and a category of strategy code. Languages that support template libraries: ```JavaScript```, ```Python``` and ```Rust```. If the category is set to template library when a strategy is created, a template library is created in the strategy library of the logged-in account; its category cannot be changed to an ordinary strategy afterwards.

![Create Template Library Page](https://www.fmz.com/upload/asset/2e4c55da99fd457ca94a0.png)

How template functions are exported and called in each language:

| Language | Export in the template | Call in the strategy |
| - | - | - |
| JavaScript | attach to ```$```: ```$.Test = function() {...}``` | ```$.Test()``` |
| Python | attach to ```ext```: ```ext.Test = Test``` | ```ext.Test()``` |
| Rust | the template code goes into the ```ext``` module; functions the strategy calls are declared ```pub fn``` | ```ext::Test()``` |

- A template's ```main()``` function is not run by the strategy; it is only the entry point for backtesting or debugging the template on its own.
- ```JavaScript``` templates can define ```init()``` and ```destroy()```: ```init()``` runs when the template is loaded (before the strategy's ```init()```), and ```destroy()``` runs when the strategy exits, after ```onexit()``` or ```onerror()```. ```Python``` templates can define ```init()```, which runs when the template is loaded.
- Both ```Rust``` templates and strategies can declare third-party crates in a frontmatter block, but the dependency block may appear in only one of them; declaring it in both fails the build.

#### Export Functions of Template Libraries

Exported functions are the interface a template library offers; strategies that reference the template library can call them. How each language exports them is described in `Template Library`.

Declare and implement the exported function ```Test``` in a template library, in each language.

```javascript
/*
-- after referencing this template, a strategy calls this method directly as $.Test()
-- main is never triggered in the strategy; it is only the entry point for debugging the template
*/
$.Test = function() {
    Log('Test')
}

function main() {
    $.Test()
}
```

```python
def Test():
    Log("template call")

# export Test; the main strategy calls it as ext.Test()
ext.Test = Test
```

```rust
// after referencing this template, a strategy calls it as ext::Test()
// functions called by the strategy must be declared pub
pub fn Test() {
    Log!("template call");
}
```

#### Template Library Parameters

Template libraries can also set their own interface parameters. Template library parameters are used as global variables in the template library code (global constants in Rust). For example, a template library with this parameter:

![Template Parameter](https://www.fmz.com/upload/asset/2e4ab550b85e6a1cac08e.png)

| Variable Name in Strategy Code | Parameter Name Displayed on Strategy Interface | Type | Default Value |
| - | - | - | - |
| param1 | Template Parameter 1 | Number | 99 |

In the examples below the template exports functions that read and modify the parameter, and the strategy calls them. Parameters of a ```Rust``` template are constants that can only be read, not modified, so in Rust the parameter can only be read:

```rust
// template code
pub fn GetParam1() -> f64 {
    Log!("param1:", param1);
    param1
}
```

```rust
// strategy code
fn main() {
    Log!("Calling ext::GetParam1:", ext::GetParam1());
}
```

Template library code: export functions that read and modify the ```param1``` parameter.

```javascript
$.SetParam1 = function(p1) {
    param1 = p1
}

$.GetParam1 = function() {
    Log("param1:", param1)
    return param1
}
```

```python
def SetParam1(p1):
    global param1
    param1 = p1

def GetParam1():
    Log("param1:", param1)
    return param1

ext.SetParam1 = SetParam1
ext.GetParam1 = GetParam1
```

Strategy code that references the template above: read and modify ```param1``` through the exported functions.

```javascript
function main () {
    Log("Calling $.GetParam1:", $.GetParam1())
    Log("Calling $.SetParam1:", "#FF0000")
    $.SetParam1(20)
    Log("Calling $.GetParam1:", $.GetParam1())
}
```

```python
def main():
    Log("Calling ext.GetParam1:", ext.GetParam1())
    Log("Calling ext.SetParam1:", "#FF0000")
    ext.SetParam1(20)
    Log("Calling ext.GetParam1:", ext.GetParam1())
```

#### Reference Template Library

When a strategy references a template library, the currently logged-in FMZ Quant Trading Platform account must have available template libraries in its strategy library. On the [Strategy Edit Page](https://www.fmz.com/m/add-strategy), check the templates you need to reference in the Template section, then save the strategy to complete the reference.

![Template Reference Screenshot](https://www.fmz.com/upload/asset/2e4ee2ec7b3e7b1649af8.png)

### Built-in Libraries

Strategies can use the platform's built-in ```TA``` and ```talib``` indicator libraries and each language's JSON support without importing anything. Availability by language:

| Library | JavaScript | Python | Rust |
| - | - | - | - |
| ```TA``` indicators | ✓ | ✓ | ✓ |
| ```talib``` indicators | ✓ | ✓ (needs TA-Lib and numpy on the docker's machine) | ✗ |
| JSON | the language's built-in ```JSON``` | the standard ```json``` module | ```JSONParse()```/```JsonValue``` |

For the full list of functions and their arguments see `TA` and `Talib` in the reference.

#### TA indicator library

The platform's ```TA``` library optimizes the common indicator algorithms ([open-source TA library code](https://www.fmz.com/bbs-topic/409)). Where there are not enough K-lines to compute an indicator, invalid values are returned at those positions.

```javascript
function main(){
    var records = exchange.GetRecords()
    if (!records) {
        return
    }
    var macd = TA.MACD(records)
    var atr = TA.ATR(records, 14)

    // print the last set of indicator values
    Log(macd[0][records.length-1], macd[1][records.length-1], macd[2][records.length-1])
    Log(atr[atr.length-1])
}
```

```rust
fn main() {
    let r = exchange.GetRecords(None, None, None).unwrap();
    let macd = TA.MACD(&r, None, None, None);
    let atr = TA.ATR(&r, 14);
    Log!(macd[0][r.len() - 1], macd[1][r.len() - 1], macd[2][r.len() - 1]);
    Log!(atr[atr.len() - 1]);
}
```

#### talib indicator library

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) {
        return
    }
    var cci = talib.CCI(records, 14)
    Log(cci)
}
```

```python
# needs TA-Lib and numpy on the docker's machine, otherwise talib raises an error
def main():
    records = exchange.GetRecords()
    if not records:
        return
    cci = talib.CCI(records.High, records.Low, records.Close, 14)
    Log(cci)
```

#### JavaScript: loading third-party libraries dynamically

Other third-party JavaScript libraries can be downloaded at run time and loaded with ```eval```:

```javascript
function main() {
    // via. https://cdnjs.com/libraries
    eval(HttpQuery("https://cdnjs.cloudflare.com/ajax/libs/mathjs/13.2.0/math.min.js"))

    Log(math.round(math.e, 3))                // 2.718
    Log(math.atan2(3, -3) / math.pi)          // 0.75
    Log(math.log(10000, 10))                  // 4
    Log(math.sqrt(-4))                        // {"mathjs":"Complex","re":0,"im":2}
}
```

### UI Text Localization

Text in the strategy interface can be written in both Chinese and English; the web page shows the one matching the current language (refresh the page after switching languages):
- Strategy name and descriptions of strategy parameters: write ```Chinese|English```.
- Strategy description, usage instructions and other ```Markdown``` text: write ```[trans]Chinese|English[/trans]``` or ```[trans]Chinese||English[/trans]```.
- Functions in the strategy code that output strings, such as ```Log()``` and ```LogStatus()```: the same as ```Markdown``` text; texts of status bar buttons are written ```Chinese|English``` directly, without the ```[trans]``` tag.

```javascript
function main() {
    Log("[trans]日志|log[/trans]")
    // no [trans] tag inside buttons
    var btn = {"type": "button", "cmd": "coverAll", "name": "平仓|cover",
               "description": "描述|description"}
    var table = {
        type: "table",
        title: "[trans]操作|option[/trans]",
        cols: ["[trans]列1|col1[/trans]", "[trans]列2|col2[/trans]", "[trans]操作|option[/trans]"],
        rows: [
            ["[trans]比特币|BTC[/trans]", "[trans]以太坊|ETH[/trans]", btn]
        ]
    }
    LogStatus("[trans]信息|message[/trans]", "\n`" + JSON.stringify(table) + "`")
    throw "[trans]错误|error[/trans]"
}
```

```python
import json

def main():
    Log("[trans]日志|log[/trans]")
    btn = {"type": "button", "cmd": "coverAll", "name": "平仓|cover",
           "description": "描述|description"}
    table = {
        "type": "table",
        "title": "[trans]操作|option[/trans]",
        "cols": ["[trans]列1|col1[/trans]", "[trans]列2|col2[/trans]", "[trans]操作|option[/trans]"],
        "rows": [
            ["[trans]比特币|BTC[/trans]", "[trans]以太坊|ETH[/trans]", btn]
        ]
    }
    LogStatus("[trans]信息|message[/trans]", "\n`" + json.dumps(table) + "`")
    raise Exception("[trans]错误|error[/trans]")
```

```rust
fn main() {
    Log!("[trans]日志|log[/trans]");
    let table = r#"{
        "type": "table",
        "title": "[trans]操作|option[/trans]",
        "cols": ["[trans]列1|col1[/trans]", "[trans]列2|col2[/trans]", "[trans]操作|option[/trans]"],
        "rows": [
            ["[trans]比特币|BTC[/trans]", "[trans]以太坊|ETH[/trans]",
             {"type": "button", "cmd": "coverAll", "name": "平仓|cover",
              "description": "描述|description"}]
        ]
    }"#;
    LogStatus!("[trans]信息|message[/trans]", format!("\n`{}`", table));
    Panic!("[trans]错误|error[/trans]");
}
```

### API Quick Reference

Every function, structure and constant of the API reference, grouped by its category, with a one-line description; click a name for the full page. This page is generated from the reference by ```doc_tools/gen_api_index.py```.

#### Built-in Functions

##### Global

| Name | Description |
| - | - |
| `Version` | Returns the current system version number. |
| `IsVirtual` | Used to determine whether the strategy's runtime environment is the backtesting system. |
| `GetOS` | Retrieves the operating system information of the device hosting the bot. |
| `GetPid` | Get the ID of the live trading process. |
| `GetMeta` | Get the ```Meta``` value written when generating the strategy registration code. |
| `Sleep` | Pauses program execution for a specified period of time. |
| `Unix` | Get the second-level timestamp of the current moment. |
| `UnixNano` | Get the nanosecond-level timestamp of the current moment. |
| `_D` | Convert a millisecond-level timestamp or a ```Date``` object into a time string. |
| `GetCommand` | Get the strategy's interactive command. |
| `GetLastError` | Retrieves the most recent error message. |
| `SetErrorFilter` | Filters error logs. |
| `_N` | Format a floating-point number. |
| `_C` | A retry function used for fault-tolerant handling of interface calls. |
| `_Cross` | Returns the number of crossover periods between array ```arr1``` and array ```arr2```. |
| `JSON.parse` | Decodes (parses) a JSON string; a method of the ECMAScript standard built-in object ```JSON```. |
| `JSON.stringify` | Converts JavaScript values to JSON strings; a method of the ECMAScript standard built-in object ```JSON```. |
| `Encode` | This function encodes data according to the parameters passed in. |
| `MD5` | Calculate the MD5 hash of the parameter ```data```. |
| `UUID` | Create a UUID. |

##### Log

| Name | Description |
| - | - |
| `Log` | Outputs logs. |
| `LogStatus` | Refreshes the status bar of a backtest or live trading page with text, tables, buttons or component objects with a `type` (KPI cards, charts, tabs and more); each call replaces the previous content. |
| `LogProfit` | Records and prints the profit/loss value, and plots the equity curve based on the profit/loss value. |
| `LogProfitReset` | Clear all profit logs and the profit chart. |
| `LogReset` | Clear the logs. |
| `LogVacuum` | Used to reclaim the storage space occupied by deleted data in SQLite after clearing logs with the ```LogReset()``` function. |
| `EnableLog` | Enable or disable logging of order information. |
| `Chart` | Custom chart plotting function. |
| `KLineChart` | This function is used to perform custom drawing while a strategy is running, using a drawing approach similar to the ```Pine``` language. |
| `console.log` | Used to output debug information in the "Debug Info" section of the live trading page. |
| `console.error` | Used to output error messages in the "Debug Information" section of the live trading page. |
| `exchange.Log` | Outputs order placement and cancellation logs in the log column area. |

##### Market

| Name | Description |
| - | - |
| `exchange.GetTicker` | Gets the Ticker structure (market data) of a spot instrument or contract; without ```symbol``` it uses the currently set trading pair and contract code. |
| `exchange.GetTickers` | Retrieves aggregated market data from the exchange (an array of Ticker structures). |
| `exchange.GetDepth` | Gets the Depth structure, i.e. the order book data, of the spot or contract corresponding to the currently set trading pair and contract code. |
| `exchange.GetTrades` | Gets the Trade structure array of the spot or futures corresponding to the currently set trading pair and contract code, i.e. the market's trade (tick) data. |
| `exchange.GetRecords` | Get the Record structure array (i.e. K-line data) of the spot or contract corresponding to the currently set trading pair or contract code. |
| `exchange.GetMarkets` | Retrieves market information from the exchange. |
| `exchange.GetRawJSON` | Get the raw content returned by the most recent ```rest``` request from the current exchange object (exchange, exchanges). |
| `exchange.SetData` | Sets the data loaded when the strategy is running. |
| `exchange.GetData` | Retrieves data loaded by the ```exchange.SetData()``` function, or data provided by an external link. |

##### Trade

| Name | Description |
| - | - |
| `exchange.Buy` | Submits a buy order. |
| `exchange.Sell` | Submits a sell order. |
| `exchange.CreateOrder` | Places an order. |
| `exchange.ModifyOrder` | Modifies the price and quantity of an existing regular order. |
| `exchange.CancelOrder` | Cancels an order. |
| `exchange.GetOrder` | Obtains order information. |
| `exchange.GetOrders` | Obtains the current unfilled orders. |
| `exchange.GetHistoryOrders` | Retrieves the historical orders of the current trading pair or contract, and supports specifying a particular trading instrument. |
| `exchange.CreateConditionOrder` | Creates a conditional order. |
| `exchange.ModifyConditionOrder` | Modifies an existing conditional order, including its order quantity, trigger condition and execution price. |
| `exchange.CancelConditionOrder` | Cancels a conditional order. |
| `exchange.GetConditionOrder` | Retrieves information about a specified conditional order. |
| `exchange.GetConditionOrders` | Obtains unfinished conditional orders (conditional orders that have not yet been triggered or canceled). |
| `exchange.GetHistoryConditionOrders` | Retrieves the historical conditional orders (including triggered, canceled, and expired conditional orders) for the current trading pair or contract, and supports specifying a particular trading instrument. |

##### Account

| Name | Description |
| - | - |
| `exchange.GetAccount` | Requests the exchange account information. |
| `exchange.GetAssets` | Requests the asset information of the exchange account. |

##### Futures

| Name | Description |
| - | - |
| `exchange.SetContractType` | Sets the current contract code of the exchange object. |
| `exchange.GetContractType` | Gets the contract code currently set for the exchange object. |
| `exchange.SetDirection` | Sets the order direction when calling the exchange.Buy function or exchange.Sell function to place futures contract orders. |
| `exchange.SetMarginLevel` | Sets the leverage value for the trading pair or contract specified by the ```symbol``` parameter. |
| `exchange.GetPositions` | Gets position information. |
| `exchange.GetFundings` | Obtains the funding rate data for the current period. |

##### Exchange

| Name | Description |
| - | - |
| `exchange.GetName` | Gets the name of the exchange bound to the current exchange object. |
| `exchange.GetLabel` | Obtains the custom label set when configuring the exchange object. |
| `exchange.GetCurrency` | Gets the currently set trading pair. |
| `exchange.SetCurrency` | Switches the current trading pair of the exchange object exchange. |
| `exchange.GetQuoteCurrency` | Gets the name of the quote currency of the current trading pair, i.e. ```quoteCurrency```. |
| `exchange.GetPeriod` | Retrieves the K-line period configured on the FMZ Quant Trading platform website page when running a strategy in backtesting or live trading, i.e., the default K-line period used when calling the ```exchange.GetRecords()``` function without… |
| `exchange.SetMaxBarLen` | Set the maximum length of the K-line (candlestick chart). |
| `exchange.SetPrecision` | Sets the precision of the price and order amount for the ```exchange``` object. |
| `exchange.GetRate` | Get the exchange rate currently set for the exchange object. |
| `exchange.SetRate` | Set the current exchange rate of the exchange object. |
| `exchange.SetBase` | Sets the base URL of the exchange API interface used by the exchange object. |
| `exchange.GetBase` | Gets the base address of the current exchange API interface. |
| `exchange.SetProxy` | Sets the proxy configuration of the exchange object. |
| `exchange.SetTimeout` | Sets the timeout for ```rest``` requests of the exchange object. |
| `exchange.Encode` | Performs signature and encryption computations. |

##### IO

| Name | Description |
| - | - |
| `exchange.IO` | Calls other interfaces related to the exchange object. |
| ```exchange.IO("api", ...)``` | Calls a raw REST endpoint of the exchange that has no wrapper function; the platform signs the request. |
| ```exchange.IO("currency", ...)``` | Switches the current trading pair of the exchange object at runtime. |
| ```exchange.IO("base", ...)``` | Queries or switches the base address of the exchange API. |
| ```exchange.IO(mode, value)``` | Switches the trading mode of an exchange, including demo/live trading, cross/isolated margin, hedge/one-way position mode, unified account, margin trading mode and self-trade prevention. |
| ```exchange.IO("rate", ...)``` | Limits how often each API function is called: ```rate``` for smoothed limiting, ```quota``` for quota limiting. |
| ```exchange.IO("extend", ...)``` | Inject parameters (such as the exchange's self-trade prevention mode, ```recvWindow```, or partner identifier) into requests sent by the exchange object without changing how order placement and other functions are called. |

##### Network

| Name | Description |
| - | - |
| `HttpQuery` | Sends an HTTP request. |
| `HttpQuery_Go` | Sends an Http request. |
| `Dial` | Used for raw ```Socket``` access, supporting the ```tcp``` and ```tls``` (also written as ```ssl```) protocols as well as the WebSocket ```ws``` and ```wss``` protocols. |
| `Mail` | Send an email. |
| `Mail_Go` | Asynchronous version of the ```Mail``` function. |

##### Storage

| Name | Description |
| - | - |
| `_G` | Persistently store data. |
| `DBExec` | Executes SQL statements against the live trading database. |
| `SetChannelData` | Publishes the latest status data to a channel. |
| `GetChannelData` | Subscribes to the channel data of a specified live trading bot. |

##### Threads

| Name | Description |
| - | - |
| `exchange.Go` | Multi-threaded asynchronous support function that can convert the operations of all supported functions into asynchronous concurrent execution. |
| `EventLoop` | Listens for events. |
| `ctx.subscribe` | Subscribes to WebSocket push data. |
| `ctx.poll` | Retrieves the next push event from subscriptions in the current thread, with an optional wait timeout. |
| `ctx.order` | Places an order through the exchange's REST API and returns after receiving the order ID from the exchange. |
| `ctx.cancel` | Cancels an order through the exchange's REST API and returns after receiving confirmation from the exchange. |
| `ctx.submit` | Submit order placement and cancellation requests through the exchange's WebSocket trading API: returns a request ID immediately after sending the request, without waiting for the exchange's response; the result of each request is delivered… |

##### Threads/Subscription

| Name | Description |
| - | - |
| `Subscription.book` | Reads the order book maintained by this depth subscription itself. |
| `Subscription.positions` | Reads the latest positions that a private subscription maintains from pushed updates. |
| `Subscription.balances` | Reads the latest balances that a private subscription maintains from pushed updates. |
| `Subscription.unsubscribe` | Unsubscribe: releases the reference held by this subscription object; the actual unsubscribe request is sent to the exchange only when the last reference is released. |

##### Threads/threading

| Name | Description |
| - | - |
| `threading.Thread` | Creates concurrent threads. |
| `threading.getThread` | Gets a thread object based on the specified thread ID. |
| `threading.mainThread` | Gets the thread object of the main thread, which is the thread where the ```main()``` function in the strategy is located. |
| `threading.currentThread` | Gets the thread object of the current thread. |
| `threading.Lock` | Creates a thread lock object. |
| `threading.Condition` | Creates a condition variable object, which is used to implement synchronization and communication between threads in a multi-threaded concurrent environment. |
| `threading.Event` | Creates a *thread event* object, which is used for synchronization between threads, allowing one thread to wait for notification or signal from another thread. |
| `threading.Dict` | Creates a dictionary object for passing and sharing data between concurrent threads. |
| `threading.Serve` | Starts an HTTP, TCP or WebSocket (over HTTP) service inside the strategy process and returns a Server object. |
| `threading.pending` | Gets the number of concurrent threads currently running in the strategy program. |

##### Threads/Thread

| Name | Description |
| - | - |
| `Thread.peekMessage` | Receives messages from a thread. |
| `Thread.postMessage` | Sends messages to a thread. |
| `Thread.join` | Waits for a thread to exit and reclaims its system resources. |
| `Thread.terminate` | Forcibly terminates a thread and releases the hardware resources occupied when the thread was created. |
| `Thread.getData` | Accesses variables recorded in the thread environment. |
| `Thread.setData` | Stores variables in the thread environment. |
| `Thread.id` | Returns the ```threadId``` of the current multi-threaded object instance. |
| `Thread.name` | Returns the name of the current multi-threaded object instance. |
| `Thread.eventLoop` | Listens for events received by the current thread (the thread of the caller). |

##### Threads/ThreadLock

| Name | Description |
| - | - |
| `ThreadLock.acquire` | Requests a thread lock (acquire lock). |
| `ThreadLock.release` | Releases a thread lock (unlock). |

##### Threads/ThreadEvent

| Name | Description |
| - | - |
| `ThreadEvent.set` | Sets an event signal. |
| `ThreadEvent.clear` | Clears the signal. |
| `ThreadEvent.wait` | Sets event (signal) waiting, which will block until the event (signal) is set; supports setting timeout parameters. |
| `ThreadEvent.isSet` | Determines whether an event (signal) has been set. |

##### Threads/ThreadCondition

| Name | Description |
| - | - |
| `ThreadCondition.notify` | Wakes up one waiting thread (if any exists). |
| `ThreadCondition.notifyAll` | Wakes up all waiting threads. |
| `ThreadCondition.wait` | Puts a thread into a waiting state under specific conditions. |
| `ThreadCondition.acquire` | Requests a thread lock (acquire lock). |
| `ThreadCondition.release` | Releases the thread lock (unlock). |

##### Threads/ThreadDict

| Name | Description |
| - | - |
| `ThreadDict.get` | Retrieves the value of a key recorded in a dictionary object. |
| `ThreadDict.set` | Sets key-value pairs. |

##### Threads/Server

| Name | Description |
| - | - |
| `Server.addr` | Returns the address and port the service actually listens on. |
| `Server.close` | Stops accepting new connections; handlers already running finish normally (graceful shutdown). |
| `Server.stop` | Closes the service (as ```close()```) and then terminates every handler thread that is still running. |
| `Server.join` | Waits until the service is closed and no handler is running. |
| `Server.pending` | Returns the number of handlers currently running, i.e. connections or requests being handled. |

##### TA

| Name | Description |
| - | - |
| `TA.MACD` | Calculates the Moving Average Convergence Divergence (MACD) indicator. |
| `TA.KDJ` | Calculates the Stochastic Oscillator (KDJ). |
| `TA.RSI` | Calculates the Relative Strength Index (RSI). |
| `TA.ATR` | Calculates the Average True Range indicator (ATR). |
| `TA.OBV` | Calculates the On-Balance Volume (OBV). |
| `TA.MA` | Calculates the Moving Average indicator (Moving Average). |
| `TA.EMA` | Calculates the Exponential Moving Average (EMA) indicator. |
| `TA.BOLL` | Calculates the Bollinger Bands indicator. |
| `TA.Alligator` | Calculates the Alligator indicator. |
| `TA.CMF` | Calculates the Chaikin Money Flow (CMF) indicator. |
| `TA.Highest` | Calculates the highest price within a period. |
| `TA.Lowest` | Calculates the lowest price over a period. |
| `TA.SMA` | Calculates the Simple Moving Average (SMA) indicator. |

##### Talib/OverlapStudies

| Name | Description |
| - | - |
| `talib.ACCBANDS` | Calculates the Acceleration Bands and returns the upper band, middle band and lower band. |
| `talib.BBANDS` | Calculates the Bollinger Bands and returns the upper band, middle band and lower band. |
| `talib.DEMA` | Calculates the Double Exponential Moving Average. |
| `talib.EMA` | Calculates the Exponential Moving Average. |
| `talib.HT_TRENDLINE` | Calculates the Hilbert Transform - Instantaneous Trendline. |
| `talib.KAMA` | Calculates the Kaufman Adaptive Moving Average. |
| `talib.MA` | Calculates the Moving Average. |
| `talib.MAMA` | Calculates the MESA Adaptive Moving Average and returns the MAMA and FAMA. |
| `talib.MAVP` | Calculates the Moving Average with Variable Period. |
| `talib.MIDPOINT` | Calculates the MidPoint over Period. |
| `talib.MIDPRICE` | Calculates the Midpoint Price over Period. |
| `talib.SAR` | Calculates the Parabolic SAR. |
| `talib.SAREXT` | Calculates the Parabolic SAR - Extended. |
| `talib.SMA` | Calculates the Simple Moving Average. |
| `talib.T3` | Calculates the Triple Exponential Moving Average (T3). |
| `talib.TEMA` | Calculates the Triple Exponential Moving Average. |
| `talib.TRIMA` | Calculates the Triangular Moving Average. |
| `talib.WMA` | Calculates the Weighted Moving Average. |

##### Talib/MomentumIndicators

| Name | Description |
| - | - |
| `talib.ADX` | Calculates the Average Directional Movement Index. |
| `talib.ADXR` | Calculates the Average Directional Movement Index Rating. |
| `talib.APO` | Calculates the Absolute Price Oscillator. |
| `talib.AROON` | Calculates the Aroon and returns the Aroon Down and Aroon Up. |
| `talib.AROONOSC` | Calculates the Aroon Oscillator. |
| `talib.BOP` | Calculates the Balance Of Power. |
| `talib.CCI` | Calculates the Commodity Channel Index. |
| `talib.CMO` | Calculates the Chande Momentum Oscillator. |
| `talib.DX` | Calculates the Directional Movement Index. |
| `talib.IMI` | Calculates the Intraday Momentum Index. |
| `talib.MACD` | Calculates the Moving Average Convergence/Divergence and returns the MACD line, signal line and histogram. |
| `talib.MACDEXT` | Calculates the MACD with Controllable MA Type and returns the MACD line, signal line and histogram. |
| `talib.MACDFIX` | Calculates the Moving Average Convergence/Divergence Fix 12/26 and returns the MACD line, signal line and histogram. |
| `talib.MFI` | Calculates the Money Flow Index. |
| `talib.MINUS_DI` | Calculates the Minus Directional Indicator. |
| `talib.MINUS_DM` | Calculates the Minus Directional Movement. |
| `talib.MOM` | Calculates the Momentum. |
| `talib.PLUS_DI` | Calculates the Plus Directional Indicator. |
| `talib.PLUS_DM` | Calculates the Plus Directional Movement. |
| `talib.PPO` | Calculates the Percentage Price Oscillator. |
| `talib.ROC` | Calculates the Rate of Change, defined as `((price/prevPrice)-1)*100`. |
| `talib.ROCP` | Calculates the Rate of Change Percentage, defined as `(price-prevPrice)/prevPrice`. |
| `talib.ROCR` | Calculates the Rate of Change Ratio, defined as `price/prevPrice`. |
| `talib.ROCR100` | Calculates the Rate of Change Ratio 100 Scale, defined as `(price/prevPrice)*100`. |
| `talib.RSI` | Calculates the Relative Strength Index. |
| `talib.STOCH` | Calculates the Stochastic and returns the slow %K and slow %D. |
| `talib.STOCHF` | Calculates the Stochastic Fast and returns the fast %K and fast %D. |
| `talib.STOCHRSI` | Calculates the Stochastic Relative Strength Index and returns the fast %K and fast %D. |
| `talib.TRIX` | Calculates the 1-day Rate-Of-Change (ROC) of a Triple Smooth EMA. |
| `talib.ULTOSC` | Calculates the Ultimate Oscillator. |
| `talib.WILLR` | Calculates the Williams' %R. |

##### Talib/VolumeIndicators

| Name | Description |
| - | - |
| `talib.AD` | Calculates the Chaikin A/D Line. |
| `talib.ADOSC` | Calculates the Chaikin A/D Oscillator. |
| `talib.OBV` | Calculates the On Balance Volume. |

##### Talib/VolatilityIndicators

| Name | Description |
| - | - |
| `talib.ATR` | Calculates the Average True Range. |
| `talib.NATR` | Calculates the Normalized Average True Range. |
| `talib.TRANGE` | Calculates the True Range. |

##### Talib/CycleIndicators

| Name | Description |
| - | - |
| `talib.HT_DCPERIOD` | Calculates the Hilbert Transform - Dominant Cycle Period. |
| `talib.HT_DCPHASE` | Calculates the Hilbert Transform - Dominant Cycle Phase. |
| `talib.HT_PHASOR` | Calculates the Hilbert Transform - Phasor Components and returns the in-phase component and quadrature component. |
| `talib.HT_SINE` | Calculates the Hilbert Transform - SineWave and returns the sine and lead sine. |
| `talib.HT_TRENDMODE` | Calculates the Hilbert Transform - Trend vs Cycle Mode. |

##### Talib/PriceTransform

| Name | Description |
| - | - |
| `talib.AVGDEV` | Calculates the Average Deviation. |
| `talib.AVGPRICE` | Calculates the Average Price. |
| `talib.MEDPRICE` | Calculates the Median Price. |
| `talib.TYPPRICE` | Calculates the Typical Price. |
| `talib.WCLPRICE` | Calculates the Weighted Close Price. |

##### Talib/StatisticFunctions

| Name | Description |
| - | - |
| `talib.BETA` | Calculates the Beta. |
| `talib.CORREL` | Calculates the Pearson's Correlation Coefficient (r). |
| `talib.LINEARREG` | Calculates the Linear Regression. |
| `talib.LINEARREG_ANGLE` | Calculates the Linear Regression Angle. |
| `talib.LINEARREG_INTERCEPT` | Calculates the Linear Regression Intercept. |
| `talib.LINEARREG_SLOPE` | Calculates the Linear Regression Slope. |
| `talib.STDDEV` | Calculates the Standard Deviation. |
| `talib.TSF` | Calculates the Time Series Forecast. |
| `talib.VAR` | Calculates the Variance. |

##### Talib/MathTransform

| Name | Description |
| - | - |
| `talib.ACOS` | Calculates the arc cosine of each element (Vector Trigonometric ACos). |
| `talib.ASIN` | Calculates the arc sine of each element (Vector Trigonometric ASin). |
| `talib.ATAN` | Calculates the arc tangent of each element (Vector Trigonometric ATan). |
| `talib.CEIL` | Rounds each element up to an integer (Vector Ceil). |
| `talib.COS` | Calculates the cosine of each element (Vector Trigonometric Cos). |
| `talib.COSH` | Calculates the hyperbolic cosine of each element (Vector Trigonometric Cosh). |
| `talib.EXP` | Calculates the exponential (e to the power of x) of each element (Vector Arithmetic Exp). |
| `talib.FLOOR` | Rounds each element down to an integer (Vector Floor). |
| `talib.LN` | Calculates the natural logarithm of each element (Vector Log Natural). |
| `talib.LOG10` | Calculates the base-10 logarithm of each element (Vector Log10). |
| `talib.SIN` | Calculates the sine of each element (Vector Trigonometric Sin). |
| `talib.SINH` | Calculates the hyperbolic sine of each element (Vector Trigonometric Sinh). |
| `talib.SQRT` | Calculates the square root of each element (Vector Square Root). |
| `talib.TAN` | Calculates the tangent of each element (Vector Trigonometric Tan). |
| `talib.TANH` | Calculates the hyperbolic tangent of each element (Vector Trigonometric Tanh). |

##### Talib/MathOperators

| Name | Description |
| - | - |
| `talib.ADD` | Adds two arrays element by element (Vector Arithmetic Add). |
| `talib.DIV` | Divides the first array by the second, element by element (Vector Arithmetic Div). |
| `talib.MAX` | Calculates the Highest Value over a Specified Period. |
| `talib.MAXINDEX` | Calculates the Index of Highest Value over a Specified Period. |
| `talib.MIN` | Calculates the Lowest Value over a Specified Period. |
| `talib.MININDEX` | Calculates the Index of Lowest Value over a Specified Period. |
| `talib.MINMAX` | Calculates the Lowest and Highest Values over a Specified Period and returns the minimum and maximum. |
| `talib.MINMAXINDEX` | Calculates the Indexes of Lowest and Highest Values over a Specified Period and returns the minimum index and maximum index. |
| `talib.MULT` | Multiplies two arrays element by element (Vector Arithmetic Mult). |
| `talib.SUB` | Subtracts the second array from the first, element by element (Vector Arithmetic Subtraction). |
| `talib.SUM` | Calculates the Summation. |

##### Talib/PatternRecognition

| Name | Description |
| - | - |
| `talib.CDL2CROWS` | Detects the Two Crows candlestick pattern. |
| `talib.CDL3BLACKCROWS` | Detects the Three Black Crows candlestick pattern. |
| `talib.CDL3INSIDE` | Detects the Three Inside Up/Down candlestick pattern. |
| `talib.CDL3LINESTRIKE` | Detects the Three-Line Strike candlestick pattern. |
| `talib.CDL3OUTSIDE` | Detects the Three Outside Up/Down candlestick pattern. |
| `talib.CDL3STARSINSOUTH` | Detects the Three Stars In The South candlestick pattern. |
| `talib.CDL3WHITESOLDIERS` | Detects the Three Advancing White Soldiers candlestick pattern. |
| `talib.CDLABANDONEDBABY` | Detects the Abandoned Baby candlestick pattern. |
| `talib.CDLADVANCEBLOCK` | Detects the Advance Block candlestick pattern. |
| `talib.CDLBELTHOLD` | Detects the Belt-hold candlestick pattern. |
| `talib.CDLBREAKAWAY` | Detects the Breakaway candlestick pattern. |
| `talib.CDLCLOSINGMARUBOZU` | Detects the Closing Marubozu candlestick pattern. |
| `talib.CDLCONCEALBABYSWALL` | Detects the Concealing Baby Swallow candlestick pattern. |
| `talib.CDLCOUNTERATTACK` | Detects the Counterattack candlestick pattern. |
| `talib.CDLDARKCLOUDCOVER` | Detects the Dark Cloud Cover candlestick pattern. |
| `talib.CDLDOJI` | Detects the Doji candlestick pattern. |
| `talib.CDLDOJISTAR` | Detects the Doji Star candlestick pattern. |
| `talib.CDLDRAGONFLYDOJI` | Detects the Dragonfly Doji candlestick pattern. |
| `talib.CDLENGULFING` | Detects the Engulfing Pattern candlestick pattern. |
| `talib.CDLEVENINGDOJISTAR` | Detects the Evening Doji Star candlestick pattern. |
| `talib.CDLEVENINGSTAR` | Detects the Evening Star candlestick pattern. |
| `talib.CDLGAPSIDESIDEWHITE` | Detects the Up/Down-gap side-by-side white lines candlestick pattern. |
| `talib.CDLGRAVESTONEDOJI` | Detects the Gravestone Doji candlestick pattern. |
| `talib.CDLHAMMER` | Detects the Hammer candlestick pattern. |
| `talib.CDLHANGINGMAN` | Detects the Hanging Man candlestick pattern. |
| `talib.CDLHARAMI` | Detects the Harami Pattern candlestick pattern. |
| `talib.CDLHARAMICROSS` | Detects the Harami Cross Pattern candlestick pattern. |
| `talib.CDLHIGHWAVE` | Detects the High-Wave Candle candlestick pattern. |
| `talib.CDLHIKKAKE` | Detects the Hikkake Pattern candlestick pattern. |
| `talib.CDLHIKKAKEMOD` | Detects the Modified Hikkake Pattern candlestick pattern. |
| `talib.CDLHOMINGPIGEON` | Detects the Homing Pigeon candlestick pattern. |
| `talib.CDLIDENTICAL3CROWS` | Detects the Identical Three Crows candlestick pattern. |
| `talib.CDLINNECK` | Detects the In-Neck Pattern candlestick pattern. |
| `talib.CDLINVERTEDHAMMER` | Detects the Inverted Hammer candlestick pattern. |
| `talib.CDLKICKING` | Detects the Kicking candlestick pattern. |
| `talib.CDLKICKINGBYLENGTH` | Detects the Kicking - bull/bear determined by the longer marubozu candlestick pattern. |
| `talib.CDLLADDERBOTTOM` | Detects the Ladder Bottom candlestick pattern. |
| `talib.CDLLONGLEGGEDDOJI` | Detects the Long Legged Doji candlestick pattern. |
| `talib.CDLLONGLINE` | Detects the Long Line Candle candlestick pattern. |
| `talib.CDLMARUBOZU` | Detects the Marubozu candlestick pattern. |
| `talib.CDLMATCHINGLOW` | Detects the Matching Low candlestick pattern. |
| `talib.CDLMATHOLD` | Detects the Mat Hold candlestick pattern. |
| `talib.CDLMORNINGDOJISTAR` | Detects the Morning Doji Star candlestick pattern. |
| `talib.CDLMORNINGSTAR` | Detects the Morning Star candlestick pattern. |
| `talib.CDLONNECK` | Detects the On-Neck Pattern candlestick pattern. |
| `talib.CDLPIERCING` | Detects the Piercing Pattern candlestick pattern. |
| `talib.CDLRICKSHAWMAN` | Detects the Rickshaw Man candlestick pattern. |
| `talib.CDLRISEFALL3METHODS` | Detects the Rising/Falling Three Methods candlestick pattern. |
| `talib.CDLSEPARATINGLINES` | Detects the Separating Lines candlestick pattern. |
| `talib.CDLSHOOTINGSTAR` | Detects the Shooting Star candlestick pattern. |
| `talib.CDLSHORTLINE` | Detects the Short Line Candle candlestick pattern. |
| `talib.CDLSPINNINGTOP` | Detects the Spinning Top candlestick pattern. |
| `talib.CDLSTALLEDPATTERN` | Detects the Stalled Pattern candlestick pattern. |
| `talib.CDLSTICKSANDWICH` | Detects the Stick Sandwich candlestick pattern. |
| `talib.CDLTAKURI` | Detects the Takuri (Dragonfly Doji with very long lower shadow) candlestick pattern. |
| `talib.CDLTASUKIGAP` | Detects the Tasuki Gap candlestick pattern. |
| `talib.CDLTHRUSTING` | Detects the Thrusting Pattern candlestick pattern. |
| `talib.CDLTRISTAR` | Detects the Tristar Pattern candlestick pattern. |
| `talib.CDLUNIQUE3RIVER` | Detects the Unique 3 River candlestick pattern. |
| `talib.CDLUPSIDEGAP2CROWS` | Detects the Upside Gap Two Crows candlestick pattern. |
| `talib.CDLXSIDEGAP3METHODS` | Detects the Upside/Downside Gap Three Methods candlestick pattern. |

##### OS

| Name | Description |
| - | - |
| `ListFilesResult` | File list object used to record directory listing information. |
| `FileStat` | File statistics information object. |

##### OS/os

| Name | Description |
| - | - |
| `os.open` | Open a file in the specified mode. |
| `os.fgets` | Read the entire file content at once. |
| `os.fputs` | Write content to a file. |
| `os.mmap` | Reads the whole file and returns its binary data as an ArrayBuffer. |
| `os.getRootDir` | Get the root directory path for file operations. |
| `os.listFiles` | List files and subdirectories in the specified directory. |
| `os.exists` | Check if the specified file or directory exists. |
| `os.remove` | Delete the specified file or empty directory. |
| `os.mkdir` | Create a directory. |
| `os.rmdir` | Remove a directory and all its contents. |
| `os.rename` | Rename a file or move a file. |
| `os.stat` | Get detailed statistics information of a file. |
| `os.exit` | Exit the program. |

##### OS/File

| Name | Description |
| - | - |
| `File.close` | Close the file and release associated resources. |
| `File.puts` | Write one or more strings to a file. |
| `File.printf` | Write formatted data to file. |
| `File.flush` | Flush the file buffer to ensure data is written to disk. |
| `File.tell` | Get the current file pointer position. |
| `File.seek` | Move the file pointer to a specified position. |
| `File.eof` | Check if the file pointer has reached the end of file. |
| `File.read` | Read data from a file. |
| `File.write` | Write string data to a file. |
| `File.getline` | Read the next line from the file. |
| `File.toString` | Get the string representation of the file object. |

#### Structures

| Name | Description |
| - | - |
| `Ticker` | Market data returned by ```exchange.GetTicker()```: high, low, best ask, best bid, last price, open, volume and open interest. |
| `Depth` | Market depth returned by ```exchange.GetDepth()```: the asks ```Asks``` and bids ```Bids``` (OrderBook arrays) and a timestamp. |
| `OrderBook` | One price level of the asks or bids in market depth (Depth): price and amount. |
| `Trade` | Market trade records returned by ```exchange.GetTrades()```, including the trade Id, time, price, amount and side. |
| `Record` | Data structure for candlestick bars in standard OHLC format, used for charting candlesticks and calculating technical indicators. |
| `Market` | Returned by ```exchange.GetMarkets()```: an instrument's base and quote assets, price and amount steps and precisions, order quantity and notional limits, and contract value. |
| `Order` | Returned by ```exchange.GetOrder()```, ```exchange.GetOrders()``` and similar: order ID, price, amount, filled amount, average price, status, type, offset, contract code and conditional order settings. |
| `Condition` | Conditional order settings: the conditional order type and the take-profit and stop-loss trigger and order prices, used to set the trigger conditions and execution prices of conditional orders. |
| `Account` | Returned by ```exchange.GetAccount()```: the available and frozen amounts of the quote and base currencies, plus equity and unrealized profit and loss on futures. |
| `Asset` | One item of the array returned by ```exchange.GetAssets()```: the available and frozen amounts of one currency. |
| `Position` | Returned by ```exchange.GetPositions()```: instrument, leverage, amount and frozen amount, average price, unrealized profit, direction, contract code and margin. |
| `Funding` | Returned by ```exchange.GetFundings()```: instrument, settlement interval, time and funding rate; only cryptocurrency perpetual contracts have funding rates. |

##### OtherStruct

| Name | Description |
| - | - |
| `HttpQuery-options` | This JSON structure is used to configure various parameters for HTTP requests sent by HttpQuery and HttpQuery_Go functions. |
| `HttpQuery-return` | This JSON structure is the data structure returned by the HttpQuery function in debug mode, when the debug field is set to true in the ```options``` parameter structure while calling the HttpQuery function. |
| `LogStatus-table` | Status bar table output with LogStatus: columns can set number formats, up/down colors and units; cells can be merged or hold buttons; several tables can be shown as tabs. |
| `LogStatus-btnTypeOne` | Older form of the status bar button structure (input controls without ```settings```), still supported. |
| `LogStatus-btnTypeTwo` | JSON structure of a status bar button (current form, with ```settings``` on input controls). |
| `Chart-options` | This JSON is used to configure chart settings for the custom plotting function ```Chart()```. |
| `Chart-return` | The chart object returned by Chart, used to write data, update the configuration and clear the chart. |
| `KLineChart-options` | This JSON is used to configure the chart settings for the custom drawing function ```KLineChart```. |
| `KLineChart-return` | The chart object returned by KLineChart, which draws on K-lines in a ```Pine```-like way. |
| `SetData-data` | This JSON is used to set the data to be loaded by the ```exchange.SetData()``` function. |
| `EventLoop-return` | This JSON is the data structure returned by the ```EventLoop()``` function. |
| `exchange.Go-return` | The concurrent object returned by exchange.Go; its ```wait()``` method returns the result of the concurrent call. |
| `DBExec-return` | This JSON is the data structure returned by the ```DBExec()``` function; this JSON data structure is also returned when executing SQL statements using the ```exec()``` method of objects created by the ```Dial()``` function. |
| `Dial-return` | The connection object returned by Dial. |
| `Thread.join-return` | This JSON is the data structure returned by the ```join()``` member function of the ```Thread``` object, used to store information related to concurrent threads in ```JavaScript``` language strategies. |

##### OtherStruct/LogStatus-display

| Name | Description |
| - | - |
| `grid` | Arranges components in columns and drops columns automatically when the container gets narrow. |
| `tabs` | Groups components into tabs; the selected tab is kept when the status bar refreshes. |
| `kpi` | Shows one prominent number with optional unit, change and hint, for equity, returns or the last price. |
| `stat` | Lists label and value pairs, for details such as balances, frozen funds, leverage or liquidation price. |
| `progress` | Shows a ratio, or current value / total, as a bar. |
| `gauge` | Shows where a value sits in a range on a half-circle dial, with optional threshold colors; for RSI, exposure or risk. |
| `sparkline` | Shows a number with a small trend line, colored by the first-to-last change by default. |
| `chart` | Draws line, bar or area charts with several series, a right axis and buy/sell marks; use Chart for more options. |
| `heatmap` | Shades a 2D grid by value, for returns by period and symbol or correlation matrices. |
| `calendar` | Shows returns as daily heat cells (like a contribution graph) or as a year × month table. |
| `histogram` | Bins raw data automatically and shows the counts with sample size, mean, median and share of positive values. |
| `pie` | Shows the share of each part in the total; a donut by default with the total in the center. |
| `timeline` | Lists events in order, for fills, trading signals or risk events. |
| `markdown` | Renders Markdown text with headings, lists, bold and tables, for strategy notes and market commentary. |
| `alert` | Shows an info, success, warning or error message with an icon, for risk and error notices. |
| `badge` | Shows small labels with a dot inline, so they can follow a line of text. |

#### Built-in Variables and Constants

##### EXCHANGE

| Name | Description |
| - | - |
| `exchange` | The first exchange object added in the strategy live trading settings and backtesting settings. |
| `exchanges` | An array of exchange objects that contains all the exchange objects added in the strategy's live trading settings or backtesting settings, where exchanges[0] is exchange. |

##### ORDER_STATE

| Name | Description |
| - | - |
| `ORDER_STATE_PENDING` | The order is pending (open, possibly partially filled); the value is ```0```. |
| `ORDER_STATE_CLOSED` | The order is completed (fully filled); the value is ```1```. |
| `ORDER_STATE_CANCELED` | The order is canceled; the value is ```2```. |
| `ORDER_STATE_UNKNOWN` | The order status is unknown (any other status); the value is ```3```. |

##### ORDER_TYPE

| Name | Description |
| - | - |
| `ORDER_TYPE_BUY` | A buy order; the value is ```0```. |
| `ORDER_TYPE_SELL` | A sell order; the value is ```1```. |
| `ORDER_TYPE_NONE` | No direction; the value is ```2```. |

##### ORDER_CONDITION_TYPE

| Name | Description |
| - | - |
| `ORDER_CONDITION_TYPE_OCO` | An OCO order (One-Cancels-the-Other): take-profit and stop-loss conditions are set together, and when one triggers the other is canceled automatically; the value is ```0```. |
| `ORDER_CONDITION_TYPE_TP` | A take-profit order: an order is placed when the price reaches the take-profit trigger price; the value is ```1```. |
| `ORDER_CONDITION_TYPE_SL` | A stop-loss order: an order is placed when the price reaches the stop-loss trigger price, to limit losses; the value is ```2```. |
| `ORDER_CONDITION_TYPE_GENERIC` | A generic conditional order: its behavior depends on the exchange, and it only appears in query results; the value is ```3```. |

##### POSITION_DIRECTION

| Name | Description |
| - | - |
| `PD_LONG` | A long position; the value is ```0```. |
| `PD_SHORT` | A short position; the value is ```1```. |

##### ORDER_OFFSET

| Name | Description |
| - | - |
| `ORDER_OFFSET_OPEN` | An opening order; the value is ```0```. |
| `ORDER_OFFSET_CLOSE` | A closing order; the value is ```1```. |

##### PERIOD

| Name | Description |
| - | - |
| `PERIOD_M1` | 1-minute K-line period; the value is ```60```. |
| `PERIOD_M3` | 3-minute K-line period; the value is ```180```. |
| `PERIOD_M5` | 5-minute K-line period; the value is ```300```. |
| `PERIOD_M15` | 15-minute K-line period; the value is ```900```. |
| `PERIOD_M30` | 30-minute K-line period; the value is ```1800```. |
| `PERIOD_H1` | 1-hour K-line period; the value is ```3600```. |
| `PERIOD_H2` | 2-hour K-line period; the value is ```7200```. |
| `PERIOD_H4` | 4-hour K-line period; the value is ```14400```. |
| `PERIOD_H6` | 6-hour K-line period; the value is ```21600```. |
| `PERIOD_H12` | 12-hour K-line period; the value is ```43200```. |
| `PERIOD_D1` | 1-day K-line period; the value is ```86400```. |
| `PERIOD_D3` | 3-day K-line period; the value is ```259200```. |
| `PERIOD_W1` | 1-week K-line period; the value is ```604800```. |

##### LOG_TYPE

| Name | Description |
| - | - |
| `LOG_TYPE_BUY` | A buy order log; the value is ```0```. |
| `LOG_TYPE_SELL` | A sell order log; the value is ```1```. |
| `LOG_TYPE_CANCEL` | An order cancellation log; the value is ```2```. |

#### Conventions

| Name | Description |
| - | - |
| `Symbols` | Functions of exchange objects specify an instrument with the string parameter ```symbol```. |
| `Failures and null values` | ### Failed calls return a null value |

#### Exchanges

| Name | Description |
| - | - |
| `Capability Matrix` | Support of the standard functions and trading-mode commands per exchange object. |

## Development Tools

Tools for writing and debugging strategies: the strategy editor (with the AI assistant and history versions), the debugging tool, and remote editing from a local editor.

### Strategy Editor

Open the **edit page** from the [new strategy page](https://www.fmz.com/m/add-strategy) or by opening an existing strategy in the [Strategy Library](https://www.fmz.com/m/strategies) (for strategy ID 123456 the address is ```https://www.fmz.com/m/edit-strategy/123456```) to write strategies.

![Online strategy editor](https://www.fmz.com/upload/asset/2e50fff4160187be92248.png)

This chapter covers the editor's assistance features. Related features of the editing page:
- Remote editing: write in a local editor and sync to the platform automatically (see `Remote Editing`).
- `Backtest configuration and saving`: save the backtest configuration and strategy parameters with the strategy (see Backtesting System).
- `Import and export of complete strategies`: export and import a strategy with its parameters and everything else (see Platform Basics → Strategy Library).

#### Editor shortcuts

- **Command Palette**: right-click in the code editing area and choose "Command Palette" to see the keyboard shortcuts and editor commands for each feature.

  ![Command Palette display in strategy editor menu](https://www.fmz.com/upload/asset/2e429269f02185dfbab3b.png)

- **Go to definition and references**: select the content to look up and right-click:
  - Go to Definition: jump to where it is defined.
  - Go to References: jump to where it is referenced.
  - Peek - Peek Definition: view the definition of the selected code without leaving the current line.
  - Peek - Peek References: view references to it from other lines without leaving the current line, with quick navigation.

- **Syntax manual lookup**: in the "Code" editing area, hold down ```⌘``` (Mac) or ```Ctrl``` (Windows) and hover over a **variable name** or **function name**; a link appears, and clicking it opens the "Syntax Manual" at that entry.

  ![Syntax Manual Quick Reference in Strategy Editor](https://www.fmz.com/upload/asset/2e4d0722af99164f69996.png)

#### AI Assistant

The strategy editor has a built-in AI assistant that generates strategy code from a description, explains and edits selected code, adjusts strategy parameters and interactive controls, and runs backtests and analyzes their results automatically.

- AI assistant panel
  The AI assistant panel sits to the right of the code editor and can be collapsed or expanded. Describe what you want in the input box to start a conversation; code selected in the editor beforehand becomes context for the conversation.
  Changes the AI proposes to code, parameters and interactive controls are shown as diffs that you can "Accept" or "Reject" one by one, or accept all at once; it asks for permission before modifying the strategy or running a backtest automatically.
- Quick actions on selected code
  Select code and right-click: the menu has AI actions (such as explaining or optimizing the code), which can also be triggered with ```⌘1```, ```⌘2```, ... (```Ctrl+1```, ```Ctrl+2```, ... on Windows).

  ![AI assistant explaining code in the strategy editor](https://www.fmz.com/upload/asset/16aa01684eda4e8163ed.png)
- Smart completion
  Turn smart completion on or off from the right-click menu, or with ```⌘J``` (```Ctrl+J``` on Windows).

The AI assistant is charged to your account balance by usage, and each conversation shows its cost.

Besides the assistant in the editor, you can connect the external AI assistant you already use to the platform and manage strategies, backtests and live robots through conversation (see `AI Integration`).

#### Strategy Documentation

The online strategy editing page keeps the code, description, usage instructions and development notes of a strategy separately.

![Strategy documentation options](https://www.fmz.com/upload/asset/2e47983c191c1779bd52e.png)

- Code: the source code of the strategy program.
  A complete strategy on the platform consists of the source code, the strategy parameter design, the interactive control design and the `template library` references (see `Strategy Parameters`, `Interactive Controls` and Template Libraries).
- Notes: notes taken while developing the strategy.
- Description: the introduction shown when the strategy is published.
- Manual: instructions visible only to those who rent the strategy.

#### History Version Management

A history version is a snapshot of the strategy at a point in time; use it to roll back or compare code, or to have a live robot run a specific version. On the **Strategy Editing Page**, click the "History Version" button in the "Code" editing area to open the history version management page.

##### Creating and managing snapshots
- Create: if the strategy has no snapshot yet, click "Create Now"; otherwise click "Create History Version" above the snapshot list on the right. A snapshot includes the strategy code, notes, description, manual, parameter design, interaction design and so on.
- Manage: rename a snapshot, delete it, or restore the strategy to a snapshot's version.
- Preview: click "Preview" at the bottom left of the page to view the code, notes, description, manual, parameter design and interaction design in the selected snapshot.
- Compare: click "Compare" at the bottom left of the page to see the differences between the selected snapshot and the current strategy.

##### Running a history version live
- **Set the default running version**: select a version on the history version management page, click "Modify" in the menu and check "Set as Default Version" in the dialog. Without it, the latest version runs by default.
- **Use a history version in a live robot**: when creating a robot or changing its parameters, the strategy owner can choose a history version of the strategy to run; this works only for the strategy owner.
- **Versions of rented strategies**: a renter can run only the default running version set by the strategy owner and cannot choose other history versions; the owner controls the version used by rented strategies by setting the default running version.

### Debugging Tool

The [Debugging Tool](https://www.fmz.com/m/debug) page provides a free environment for quickly testing live trading code, currently supporting only the ```JavaScript``` language.

![Debugging Tool](https://www.fmz.com/upload/asset/2e48d6d1bc77e46099058.png)

When using the debugging tool to test code, the code will run directly on the specified docker, with a maximum runtime of 5 minutes. It supports calling all API functions of the FMZ Quant Trading Platform, but only supports a single exchange object.

### Remote Editing

You can write a strategy in a local editor and have it synced to FMZ automatically on save. ```VSCode```, ```Vim``` and ```Sublime Text 3``` are supported; ```JavaScript``` strategies can also use ```WebStorm``` and ```Python``` strategies ```PyCharm```.

![Remote editing screenshot](https://www.fmz.com/upload/asset/2e4e8975d1e32517fd989.png)

#### Steps
1. Click "Remote Editing" on the strategy editing page. The top of the dialog has download links for the editor plugins; follow one to the plugin page and install it (installation differs slightly between editors).
2. The dialog shows the current strategy's remote sync token. If it is empty, click "Update Token" to generate one.
3. Save the strategy source locally and insert the token line shown in the dialog as the first line (e.g. ```// fmz@<token>``` for ```JavaScript```, ```# fmz@<token>``` for ```Python```); from then on every save is synced to the platform.

Without a plugin you can upload the local source with ```curl``` (the dialog shows the full command with your token), for example:

```bash
curl -T quant.js -H "Authorization: Bearer <token>" https://www.fmz.com/rsync
```

#### Managing the token
- "Update Token": generates a new token; the old one stops working at once.
- "Delete Token": deletes the strategy's token and turns remote editing off.
- If the strategy has not been modified at all for more than 30 days (neither saved on the website nor synced remotely), sync is refused (return code 405); save the strategy once on the website or click "Update Token" to restore it.
- When uploading with ```curl```, the source code must not exceed 8 MB.

Anyone holding the token can overwrite the strategy's source code, so keep it private.

## Backtesting System

Test strategies on historical data: the backtesting system drives the strategy code with past market data, simulates order matching and accounts, and reports profit, drawdown and other results. A backtest only shows how a strategy behaved on past data; it does not predict future returns.

### Overview and Starting a Backtest

A backtest drives the strategy code with the platform's historical market data: the backtest engine keeps a virtual clock and one simulated account per exchange object, and answers every market, order and account call from history. A backtest only shows how the strategy would have behaved on past data; the past does not represent the future, so read backtest results with caution.

#### Starting a backtest

- Website: open the strategy editor, switch to the "Backtest" tab, set the backtest configuration and strategy parameters, then click "Start Backtest" (keyboard shortcuts: see `Backtest Page Shortcuts`). The configuration can be saved into the strategy source, see `Backtest Configuration and Saving`.
- AI assistant: start a backtest with the MCP tool ```run_backtest``` and read the result with ```get_backtest```, see `AI Integration`. Backtests started through MCP always use the simulated-tick mode.
- Your own machine: use the open-source local backtest engine, see `Local Backtesting Engine`.

#### Configuration items

| Item | Description |
| - | - |
| Time range | Start and end time of the backtest. |
| K-line period | The K-line period that ```GetRecords()``` returns by default. |
| Base K-line period | The K-line period from which ticks are generated in simulated-tick mode. |
| Mode | Simulated tick or real tick, see `Backtest Modes and Order Matching`. |
| Exchange, trading pair | Each exchange object has its own simulated account; pairs are written like ```BTC_USDT```. |
| Initial funds | Initial balances of the quote currency (e.g. USDT) and the base currency (e.g. BTC). |
| Fees | Maker and taker rates in percent. |
| Slippage | Number of price ticks (minimum price increments) added outside the simulated best bid and ask; default 0. |
| Network delay | Milliseconds the virtual clock advances on every exchange call; default 200. |
| Depth levels, amount per level | Number of levels ```GetDepth()``` returns (1-20) and the amount on each simulated level. |
| Max K-line bars | Upper limit of history bars returned by the first ```GetRecords()``` call (100-5000, default 300). |
| Log limits | Upper limits on kept runtime logs, profit logs and chart data points. |
| Data source | The platform's historical data by default, or a `Custom Data Source`. |

Further details:
- The smaller the base K-line period, the closer the generated ticks are to the real market and the slower the backtest; strategy K-lines are built from base K-lines, so the K-line period cannot be shorter than the base period.
- On cryptocurrency futures exchanges the contract defaults to ```swap``` (perpetual); to use another contract, call ```exchange.SetContractType()``` in the strategy first.
- Coin-margined contracts use the base currency as margin, so set the base-currency balance.
- Fees default to the exchange market's configuration. A limit order that fills immediately when placed pays the taker rate; one that rests in the book and is filled later pays the maker rate.
- Slippage applies only in simulated-tick mode; real-tick mode uses the replayed real order book, and there the depth levels are the real depth requested from the data source.

#### Fault-tolerance test

The backtest page also offers a "fault-tolerance test": exchange calls fail with a given probability (0.5 by default), and the first call of each kind always fails; each failure is logged as the error ```FaultTolerant Test```. Use it to check how the strategy handles failed calls, e.g. whether it retries with ```_C()```.

#### What the strategy sees in a backtest

- ```IsVirtual()``` returns ```true```; logic that must not run in a backtest can be skipped based on it, see `IsVirtual`.
- Time is virtual: ```Unix()```, ```_D()``` and similar functions read the backtest clock, and ```Sleep()``` advances it. When the clock passes the end time, the engine throws an ```EOF``` exception and the backtest ends; ```JavaScript``` and ```Python``` strategies do not call ```onexit()``` in that case (see `onexit()` for how to handle this), while ```Rust``` strategies call ```onexit()``` automatically.
- In a backtest ```GetCommand()``` receives no interactive commands, ```onerror()``` is not supported, and network request functions are restricted.

### Backtest Modes and Order Matching

There are two backtest modes, **simulated tick** and **real tick**. Both are based on real historical data: simulated tick generates ticks from K-lines, real tick replays recorded ticks. The latter is more accurate and slower.

#### Simulated tick

Within the price frame of each base K-line (open, high, low, close), the engine generates 2-14 simulated ticks along the path open → low/high → close and spreads the bar's volume over them; market calls return the data of the current simulated tick. Each base K-line therefore has several backtest time points, and a strategy can trade several times inside one bar instead of only at the close. The smaller the base K-line period, the closer the ticks follow the real price path, and the slower the backtest. Details: [Simulated-tick mechanism](https://www.fmz.com/bbs-topic/662), [Backtesting mechanism](https://www.fmz.com/digest-topic/4009).

Simulated order book: best ask = tick close + one tick + slippage, best bid = close − one tick − slippage (slippage counted in ticks); ```GetDepth()``` returns several simulated levels outward from the best bid and ask; adjacent levels are spaced by the bid-ask spread (2 ticks + 2 × slippage), each with the configured "amount per level".

#### Real tick

Uses per-second ticks recorded by the platform, including order-book depth (configurable, up to 20 levels) and, optionally, replayed trade prints; ```GetDepth()``` and ```GetTrades()``` return the replayed real data. The platform's data service caps each data request per symbol (50 MB, plus a limit of 530,000 records); both modes are subject to it (custom data sources are not), but real-tick data is large and slow to backtest, so it is affected most and the time range is limited; to cover a longer range, lower the depth levels and do not use trade prints. Early periods may have no real-tick data, so do not choose a start time that is too early. In real-tick mode keep the ```Sleep()``` in the strategy loop short (e.g. 100 ms).

#### How market moments advance

In both modes, at a given market moment, calling each of ```GetTicker()```, ```GetDepth()```, ```GetTrades()``` and ```GetRecords()``` once does not move the backtest time; calling the same function again jumps to the next market moment.

#### Order matching

Both modes use the same matching rules:

- Orders fill when the price is touched, and always in full; there are no partial fills in a backtest.
- A market order fills on the current tick at the best ask/bid; the amount of a spot market buy order is in the quote currency.
- A limit buy fills when its price is at or above the best ask, a limit sell when its price is at or below the best bid; this is checked on every tick after the order is placed. An order that fills immediately when placed fills at the market price and pays the taker fee; an order that rests in the book and is touched later fills at its own price and pays the maker fee.
- In real-tick mode an order resting exactly at the best bid/ask fills only after the volume queued ahead of it has been consumed.
- Opening a futures position freezes margin of notional value ÷ leverage plus the estimated fee; when the market data includes funding rates, perpetual contracts are charged funding.

#### Effect of data granularity

The same strategy produces different trade counts and P&L at different data granularities (real tick, simulated tick with a small base period, simulated tick with a large base period, ...). Coarse data backtests faster but may give misleading results, so use fine granularity where possible. The following strategy can be backtested at several granularities for comparison:

```javascript
/*backtest
start: 2025-04-01 08:00:00
end: 2025-04-18 00:00:00
period: 1m
exchanges: [{"eid":"Binance","currency":"BTC_USDT","balance":1000000}]
mode: 1
*/

var delta = 50
var lotSize = 0.001
var lastPrice = null
var direction = null

function main() {
    while (true) {
        var ticker = _C(exchange.GetTicker)
        if (!lastPrice) {
            lastPrice = ticker.Last
        }
        var diff = ticker.Last - lastPrice
        if ((!direction || direction == "long") && diff >= delta) {
            // Price rose above the threshold -> go short
            exchange.Sell(ticker.Last, lotSize)
            Log("Short @", ticker.Last)
            direction = "short"
        } else if ((!direction || direction == "short") && diff <= -delta) {
            // Price fell below the threshold -> go long
            exchange.Buy(ticker.Last, lotSize)
            Log("Long @", ticker.Last)
            direction = "long"
        }
        // Keep it short in tick mode; it has no effect in K-line mode
        Sleep(100)
    }
}
```

### Backtest Configuration and Saving

The backtest configuration on the "Backtest" tab (time range, exchanges, fees, ...) and the strategy parameters can be saved with the strategy and are loaded again the next time the strategy is opened.

#### Saving

- Click "Save Backtest Settings": the configuration and strategy parameters are written as a comment block (the ```backtest``` block) at the top of the strategy source.
- Click "Save Strategy": the platform also records the current backtest configuration and strategy parameters.

#### Loading

- When the strategy editor is opened or refreshed, the configuration in the source's ```backtest``` block is loaded first.
- If the source has no ```backtest``` block, the configuration recorded by the last "Save Strategy" is loaded.
- After editing the ```backtest``` block by hand, click the "Backtest Settings" button above the block to apply the change to the backtest form.

#### Block format

The word ```backtest``` follows the language's block-comment opener directly, then one ```key: value``` per line:

```javascript
/*backtest
start: 2024-01-01 00:00:00
end: 2024-03-01 00:00:00
period: 1h
basePeriod: 15m
exchanges: [{"eid":"Binance","currency":"BTC_USDT","balance":10000,"stocks":0,"fee":[0.1,0.1]}]
args: [["fast",5],["slow",20]]
*/
```

Comment syntax per language: JavaScript, Rust and PINE use ```/*backtest ... */```; Python uses ```'''backtest ... '''```; MyLanguage uses ```(*backtest ... *)```.

| Key | Format | Description |
| - | - | - |
| start, end | ```YYYY-MM-DD HH:mm:ss``` | Start and end time, parsed in the browser's time zone. |
| period | ```1m```, ```1h```, ```1d``` etc., or seconds | Strategy K-line period. |
| basePeriod | same | Base K-line period; defaults to ```period```; ignored in real-tick mode. |
| mode | ```1``` | Real-tick mode; omit for simulated-tick mode. |
| exchanges | JSON array | One element per exchange object, fields below. |
| args | JSON array | Strategy parameters ```[["name", value], ...]```; ```["name", value, templateId]``` sets a template's parameter. |

Fields of an ```exchanges``` element; everything except ```eid``` and ```currency``` is optional:

| Field | Description |
| - | - |
| eid | Exchange ID, e.g. ```Binance```, ```Futures_OKX```. |
| currency | Trading pair, e.g. ```BTC_USDT```. |
| balance, stocks | Initial quote-currency and base-currency balances. |
| fee | ```[maker rate, taker rate]``` in percent. |
| feeMin | Minimum fee per fill; only applies to some markets. |
| depthDeep, depthAmount | Depth levels and the amount on each simulated level. |
| tradesMode | Whether trade prints are replayed in real-tick mode: ```"0"``` replay, ```"1"``` do not. |
| feeder | Custom data source URL, see `Custom Data Source`. |

The other options of the backtest form (slippage, network delay, failure probability, max K-line bars, etc.) are not written into the comment block; they are stored with the strategy record when you "Save Strategy". The local backtest engines also read this block, but only some of its keys, see `Local Backtesting Engine`.

### Supported Languages and Exchanges

Which programming languages and exchanges the backtest system supports, and where strategies in each language are backtested.

#### Programming languages

The backtesting system supports strategies written in JavaScript, Python, Rust, [PINE](https://www.fmz.com/bbs-topic/9315), [MyLanguage](https://www.fmz.com/bbs-topic/2569) and Workflow.

- JavaScript strategies are backtested in the browser, where the backtest engine runs as WebAssembly; nothing needs to be installed. JavaScript strategies can be debugged with Chrome DevTools during a backtest, see [this guide](https://www.fmz.com/digest-topic/9459).
- Rust strategies are compiled by the platform's servers; third-party crates declared in the strategy's frontmatter are fetched at compile time, so no local toolchain is needed. The backtest node defaults to "Cloud" (runs on the platform's servers); you can also choose "Local", which runs in the browser.
- For Python strategies the backtest node defaults to "Cloud" (the platform's public servers); you can also choose your own docker, or "Local: Python3" to backtest in the browser (run with Pyodide). A backtest on a docker, like live trading, uses the Python 3 environment of the docker's system; install the third-party libraries you need yourself. The public servers only provide common libraries.
- Workflow strategies show each node's execution state and data flow visually during a backtest.

#### Exchanges

Backtests use the platform's historical data; the exchanges selectable on the backtest page are the ones that can be backtested (the MCP tool ```list_exchanges``` also shows this: exchanges with ```backtest``` set to ```true``` have history data).

- Cryptocurrency: spot and futures of major exchanges, e.g. ```Binance``` and ```Futures_Binance```, ```OKX``` and ```Futures_OKX```, ```HTX``` and ```Futures_HTX```, ```Bybit``` and ```Futures_Bybit```, ```Bitget``` and ```Futures_Bitget```, ```GateIO``` and ```Futures_GateIO```, with all symbols of the exchange.

  These are the exchange IDs used for backtesting (the ```eid``` in the ```/*backtest*/``` configuration and in the MCP tool ```run_backtest```, matching the names of the history data server). For most exchanges they equal what ```exchange.GetName()``` returns in live trading, but a few differ: backtest ```OKX``` and ```Futures_OKX``` correspond to live ```OKEX``` and ```Futures_OKCoin``` (OKX futures); backtest ```HTX``` and ```Futures_HTX``` correspond to live ```Huobi``` and ```Futures_HuobiDM``` (HTX futures). If a strategy branches on the exchange name, handle both spellings.
- Futu Securities (```Futures_Futu```): Hong Kong, US and other stock markets. Only daily data is available for backtesting; set ```currency``` to ```STOCK``` and select the stock code in the strategy with ```exchange.SetContractType()```:

```javascript
/*backtest
start: 2024-05-01 00:00:00
end: 2025-02-17 00:00:00
period: 1d
basePeriod: 1d
exchanges: [{"eid":"Futures_Futu","currency":"STOCK","fee":[0.03,0.03]}]
*/

function main() {
    // Set the stock code: Tesla
    var info = exchange.SetContractType("TSLA.US")
    // Contract info: InstrumentID, PriceTick, LotTick, VolumeMultiple, ...
    Log("info:", info)
    // Daily market data at the current backtest time
    Log(exchange.GetTicker())
}
```

### Reading Backtest Results

When a backtest finishes, the backtest page shows the profit curve, statistics, status information, logs and account information.

#### Profit curve

When the strategy calls ```LogProfit()``` (`LogProfit`), the profit curve consists of the recorded values and the statistics below are computed from that series. When it never calls ```LogProfit()```, the backtest page computes profit and loss from the account snapshots recorded by the engine and draws the curve and computes the statistics from them (using the first exchange account).

The ```profit``` and ```max_drawdown``` returned by the MCP tool ```get_backtest``` come from the values recorded with ```LogProfit()```; ```max_drawdown``` is the largest peak-to-trough fall of that series (an absolute amount, not a ratio). When the strategy has no profit records, ```profit``` is the profit computed by the engine and ```max_drawdown``` is not returned.

#### Statistics

The statistics are computed from the profit series ```profits``` (each element ```[timestamp, profit]```) and the initial assets ```totalAssets``` with the algorithm below:

| Metric | Meaning |
| - | - |
| Return (totalReturns) | Last profit value ÷ initial assets. |
| Annualized return (annualizedReturns) | Return × one year (yearDays days) ÷ backtest duration, scaled linearly. |
| Max drawdown (maxDrawdown) | The largest fractional drop of assets (initial assets + profit) from their previous peak. |
| Win rate (winningRate) | Share of points in the profit series higher than the previous point (the first point is compared with 0). |
| Volatility (volatility) | Population standard deviation of each day's profit ÷ initial assets, annualized by multiplying by yearDays. |
| Sharpe ratio (sharpeRatio) | (Annualized return − risk-free rate 3%) ÷ volatility; 0 when volatility is 0. |

- Max drawdown: maxDrawdownStartTime is the time of the asset peak before the drawdown, maxDrawdownTime the time of the deepest point.
- Win rate: it counts profit records, not individual trades.
- Volatility: the backtest period is cut into days to compute daily profit; days without profit records count as 0.
- yearDays is the number of days per year used for annualization, fixed at 365. Daily returns are annualized by multiplying by yearDays rather than the usual √yearDays, so this Sharpe ratio should not be compared directly with values from other platforms.

Algorithm source:

```javascript
function returnAnalyze(totalAssets, profits, ts, te, period, yearDays) {
    // always by day
    period = 86400000
    if (profits.length == 0) {
        return null
    }
    var freeProfit = 0.03   // risk-free rate
    var yearRange = yearDays * 86400000
    var totalReturns = profits[profits.length - 1][1] / totalAssets
    var annualizedReturns = (totalReturns * yearRange) / (te - ts)

    // MaxDrawDown
    var maxDrawdown = 0
    var maxAssets = totalAssets
    var maxAssetsTime = 0
    var maxDrawdownTime = 0
    var maxDrawdownStartTime = 0
    var winningRate = 0
    var winningResult = 0
    for (var i = 0; i < profits.length; i++) {
        if (i == 0) {
            if (profits[i][1] > 0) {
                winningResult++
            }
        } else {
            if (profits[i][1] > profits[i - 1][1]) {
                winningResult++
            }
        }
        if ((profits[i][1] + totalAssets) > maxAssets) {
            maxAssets = profits[i][1] + totalAssets
            maxAssetsTime = profits[i][0]
        }
        if (maxAssets > 0) {
            var drawDown = 1 - (profits[i][1] + totalAssets) / maxAssets
            if (drawDown > maxDrawdown) {
                maxDrawdown = drawDown
                maxDrawdownTime = profits[i][0]
                maxDrawdownStartTime = maxAssetsTime
            }
        }
    }
    if (profits.length > 0) {
        winningRate = winningResult / profits.length
    }
    // trim profits
    var i = 0
    var datas = []
    var sum = 0
    var preProfit = 0
    var perRatio = 0
    var rangeEnd = te
    if ((te - ts) % period > 0) {
        rangeEnd = (parseInt(te / period) + 1) * period
    }
    for (var n = ts; n < rangeEnd; n += period) {
        var dayProfit = 0.0
        var cut = n + period
        while (i < profits.length && profits[i][0] < cut) {
            dayProfit += (profits[i][1] - preProfit)
            preProfit = profits[i][1]
            i++
        }
        perRatio = ((dayProfit / totalAssets) * yearRange) / period
        sum += perRatio
        datas.push(perRatio)
    }

    var sharpeRatio = 0
    var volatility = 0
    if (datas.length > 0) {
        var avg = sum / datas.length;
        var std = 0;
        for (i = 0; i < datas.length; i++) {
            std += Math.pow(datas[i] - avg, 2);
        }
        volatility = Math.sqrt(std / datas.length);
        if (volatility !== 0) {
            sharpeRatio = (annualizedReturns - freeProfit) / volatility
        }
    }

    return {
        totalAssets: totalAssets,
        yearDays: yearDays,
        totalReturns: totalReturns,
        annualizedReturns: annualizedReturns,
        sharpeRatio: sharpeRatio,
        volatility: volatility,
        maxDrawdown: maxDrawdown,
        maxDrawdownTime: maxDrawdownTime,
        maxAssetsTime: maxAssetsTime,
        maxDrawdownStartTime: maxDrawdownStartTime,
        winningRate: winningRate
    }
}
```

#### Downloading data

- Status bar data: after the backtest finishes, click "Download Table" at the top right of the "Status" panel to download the final status bar data as a CSV file.
- Log data: click "Download Table" at the top right of the "Logs" panel to download the backtest logs as a CSV file.

### Parameter Optimization

Generates several parameter sets from the ranges you configure and backtests each of them. In the strategy parameter section of the "Backtest" tab, tick the **Optimize** option to the right of a parameter to show its settings:

- Min: the starting value of the parameter.
- Max: the largest value the parameter is increased to.
- Step: the increment.
- Concurrent threads: how many backtests run at the same time during optimization. This option only takes effect for backtests that run in the browser: JavaScript, PINE and MyLanguage strategies, and Python and Rust strategies with the "Local" backtest node; otherwise backtests run one at a time. Parameters of referenced templates can be selected for optimization too and are included in the combinations.

The system generates parameter combinations from ```Min```, ```Max``` and ```Step``` and backtests every combination once. Only **number** parameters can be optimized.

### Custom Data Source

The backtest system can use a custom data source instead of the platform's historical data: set the exchange's data source in the backtest configuration to the custom data source (feeder) address, and during the backtest the platform's data server requests that URL with the ```GET``` method, so the URL must be reachable from the public internet. The request carries these parameters:

| Parameter | Meaning | Description |
| - | - | - |
| symbol | Symbol name | Spot like ```BTC_USDT```, futures like ```BTC_USDT.swap```; funding rate and price index: see below |
| eid | Exchange | For example: OKX, Futures_OKX |
| round | Data precision | Always ```round=true```: values are integers scaled by precision; see `Data Format` |
| period | K-line data period (milliseconds) | For example: ```60000``` represents a 1-minute period |
| depth | Order book depth levels | 1-20 |
| trades | Whether trade-by-trade data is required | Yes (1) / No (0); always 0 in simulated-tick backtests |
| from | Start time | Unix timestamp in seconds |
| to | End time | Unix timestamp in seconds |
| detail | Instrument details | Always ```detail=true```: the response must include the instrument details |
| event | Request type | ```feed```: market data requested when the backtest starts; ```fill```: older K-lines when there are not enough bars |
| custom | -- | This parameter can be ignored |

- Perpetual contract backtests also request funding rate data (```symbol``` like ```BTC_USDT.funding```) and price index data (```symbol``` like ```BTC_USDT.index```); see `Data Format`.
- ```event=fill``` requests always carry ```depth=2&trades=0&custom=0```, with ```period``` ```900000``` or ```86400000```.

Example requests sent by the backtest system to a custom data source (one for a spot and one for a futures exchange object):

```url
http://customserver:9090/data?custom=0&depth=20&detail=true&eid=Bitget&event=feed&from=1351641600&period=86400000&round=true&symbol=BTC_USDT&to=1611244800&trades=0
http://customserver:9090/data?custom=0&depth=20&detail=true&eid=Futures_OKX&event=feed&from=1351641600&period=86400000&round=true&symbol=BTC_USDT.swap&to=1611244800&trades=0
```

#### Data Format

A custom data source returns JSON in one of the two formats below, recognized automatically: simulated-tick backtests use K-line data, real-tick backtests use order book depth and trade data. All values are integers scaled by precision; see "Numeric precision" below.

##### Simulated tick

```json
{
    "detail": {
        "eid": "Binance",
        "symbol": "BTC_USDT",
        "alias": "BTCUSDT",
        "baseCurrency": "BTC",
        "quoteCurrency": "USDT",
        "marginCurrency": "USDT",
        "basePrecision": 5,
        "quotePrecision": 3,
        "minQty": 0.00001,
        "maxQty": 9000,
        "minNotional": 5,
        "maxNotional": 9000000,
        "priceTick": 0.01,
        "volumeTick": 0.00001,
        "marginLevel": 10
    },
    "schema":["time", "open", "high", "low", "close", "vol"],
    "data":[
        [1564315200000, 9531300, 9531300, 9497060, 9497060, 787],
        [1564316100000, 9495160, 9495160, 9474260, 9489460, 338]
    ]
}
```

##### Real tick

The data includes order book depth as arrays of ```[price, amount]```, with any number of levels: ```asks``` in ascending price order, ```bids``` in descending price order.

```json
{
    "detail": {
        "eid": "Binance",
        "symbol": "BTC_USDT",
        "alias": "BTCUSDT",
        "baseCurrency": "BTC",
        "quoteCurrency": "USDT",
        "marginCurrency": "USDT",
        "basePrecision": 5,
        "quotePrecision": 3,
        "minQty": 0.00001,
        "maxQty": 9000,
        "minNotional": 5,
        "maxNotional": 9000000,
        "priceTick": 0.01,
        "volumeTick": 0.00001,
        "marginLevel": 10
    },
    "schema":["time", "asks", "bids", "trades", "close", "vol"],
    "data":[
        [1564315200000, [[9531300, 10]], [[9531300, 10]],
         [[1564315200000, 0, 9531300, 10]], 9497060, 787],
        [1564316100000, [[9531300, 10]], [[9531300, 10]],
         [[1564316100000, 0, 9531300, 10]], 9497060, 787]
    ]
}
```

##### Top-level fields

| Field | Description |
| - | - |
| detail | Details of the requested instrument (currencies, precision, minimum order size...); see "detail field" below |
| schema | Attributes of the columns of the ```data``` array, case-sensitive |
| data | The data, laid out by the columns in ```schema``` |

Columns available in ```schema```: ```time```, ```open```, ```high```, ```low```, ```close```, ```vol```, ```asks```, ```bids```, ```trades```, ```position``` (open interest), ```data``` (custom data). The formats of ```asks```, ```bids``` and ```trades```:

| Column | Format | Example (from the real-tick sample) |
| - | - | - |
| asks / bids | ```[[price, amount], ...]``` | ```[[9531300, 10]]``` |
| trades | ```[[time, side, price, amount], ...]```, side 0 = buy, 1 = sell | ```[[1564315200000, 0, 9531300, 10]]``` |

##### Numeric precision

Requests always carry ```round=true```, and all values are returned as integers scaled by their precision, so that no floating-point precision is lost in transit:

- Prices (```open```, ```high```, ```low```, ```close```, and the prices in ```asks```/```bids``` and ```trades```) = actual value × 10^```quotePrecision```.
- Amounts (```vol```, and the amounts in ```asks```/```bids``` and ```trades```) = actual value × 10^```basePrecision```.

In the examples above ```quotePrecision``` is 3, so ```9531300``` means a price of 9531.300; ```basePrecision``` is 5, so ```787``` means an amount of 0.00787. Time columns (```time``` and the time in ```trades```) are millisecond timestamps and are not scaled.

##### detail field

| Field | Description |
| - | - |
| eid | Exchange ID; spot and futures of the same exchange use different eids |
| symbol | Trading instrument code |
| alias | The instrument's symbol on the exchange |
| baseCurrency | Base currency |
| quoteCurrency | Quote currency |
| marginCurrency | Margin currency |
| basePrecision | Base currency precision |
| quotePrecision | Quote currency precision |
| minQty | Minimum order quantity |
| maxQty | Maximum order quantity |
| minNotional | Minimum order amount |
| maxNotional | Maximum order amount |
| priceTick | Minimum price increment |
| volumeTick | Minimum order quantity increment |
| marginLevel | Futures leverage |
| contractType | Set to ```swap``` for perpetual contracts; the backtest system then also requests funding rate and price index data |

##### Funding rates and price index for perpetual contracts

When backtesting perpetual contracts on futures exchanges, the custom data source must also provide funding rate data and price index data:

- The backtest system requests funding rate data only if the ```detail``` of the market data contains ```"contractType": "swap"```, and only when the strategy holds a position in that perpetual contract or calls ```GetFundings()```. If ```swap``` is declared but no funding rate data can be obtained, the backtest fails with ```symbol ... not found```.
- Only after receiving funding rate data does the backtest system request price index data.
- For funding rate data only the ```open``` column is read as the rate, truncated to the ```priceTick``` in the funding data's ```detail```, so that ```priceTick``` must be small enough (e.g. ```0.00000001```).
- Funding rate records are 8 hours apart and, like K-line data, are integers scaled by precision; they can be negative. In the example below ```quotePrecision``` is 8, so ```-16795``` means a funding rate of -0.00016795.

Funding rate data (the requested ```symbol``` looks like ```BTC_USDT.funding```):

```json
{
    "detail": {
        "eid": "Futures_Binance",
        "symbol": "BTC_USDT.funding",
        "alias": "BTC_USDT.funding",
        "baseCurrency": "BTC",
        "quoteCurrency": "USDT",
        "marginCurrency": "",
        "basePrecision": 8,
        "quotePrecision": 8,
        "minQty": 1,
        "maxQty": 10000,
        "minNotional": 1,
        "maxNotional": 100000000,
        "priceTick": 1e-8,
        "volumeTick": 1e-8,
        "marginLevel": 10
    },
    "schema": ["time", "open", "high", "low", "close", "vol"],
    "data": [
        [1584921600000, -16795, -16795, -16795, -16795, 0],
        [1584950400000, -16294, -16294, -16294, -16294, 0]
    ]
}
```

Example of a funding rate request sent by the backtest system:

```url
http://customserver:9090/data?custom=0&depth=20&detail=true&eid=Futures_Binance&from=1351641600&period=86400000&round=true&symbol=BTC_USDT.funding&to=1611244800&trades=0
```

Price index data (the requested ```symbol``` looks like ```BTC_USDT.index```):

```json
{
    "detail": {
        "eid": "Futures_Binance",
        "symbol": "BTC_USDT.index",
        "alias": "BTCUSDT",
        "baseCurrency": "BTC",
        "quoteCurrency": "USDT",
        "contractType": "index",
        "marginCurrency": "USDT",
        "basePrecision": 3,
        "quotePrecision": 1,
        "minQty": 0.001,
        "maxQty": 1000,
        "minNotional": 0,
        "maxNotional": 1.7976931348623157e+308,
        "priceTick": 0.1,
        "volumeTick": 0.001,
        "marginLevel": 10,
        "volumeMultiple": 1
    },
    "schema": ["time", "open", "high", "low", "close", "vol"],
    "data": [
        [1584921600000, 58172, 59167, 56902, 58962, 0],
        [1584922500000, 58975, 59428, 58581, 59154, 0]
    ]
}
```

Example of a price index request sent by the backtest system:

```url
http://customserver:9090/data?custom=0&depth=20&detail=true&eid=Futures_Binance&from=1351641600&period=86400000&round=true&symbol=BTC_USDT.index&to=1611244800&trades=0
```

#### Custom Data Source Example

A minimal custom data source service written in Go, and a test strategy to check it. Steps:

1. Deploy the service below on a server reachable from the public internet; the data source URL is then ```http://<server>:9090/data``` (replace ```<server>``` with the server's public IP or domain name).
2. In the backtest configuration, set the exchange's data source (```feeder```) to that URL and backtest the test strategy below.

The service:

```go
package main

import (
    "fmt"
    "net/http"
    "encoding/json"
)

func Handle (w http.ResponseWriter, r *http.Request) {
    // e.g. set on backtest DataSource: http://xxx.xx.x.xx:9090/data

    // request: GET http://xxx.xx.x.xx:9090/data?custom=0&depth=20&detail=true&eid=OKX
    //     &from=1584921600&period=86400000&round=true&symbol=BTC_USDT&to=1611244800&trades=1
    // request: GET http://xxx.xx.x.xx:9090/data?custom=0&depth=20&detail=true&eid=Futures_Binance
    //     &from=1599958800&period=3600000&round=true&symbol=BTC_USDT.swap&to=1611244800&trades=0
    fmt.Println("request:", r)

    // response
    defer func() {
        // response data
        /* e.g. data
        {
            "detail": {
                "eid": "Binance",
                "symbol": "BTC_USDT",
                "alias": "BTCUSDT",
                "baseCurrency": "BTC",
                "quoteCurrency": "USDT",
                "marginCurrency": "USDT",
                "basePrecision": 5,
                "quotePrecision": 2,
                "minQty": 0.00001,
                "maxQty": 9000,
                "minNotional": 5,
                "maxNotional": 9000000,
                "priceTick": 0.01,
                "volumeTick": 0.00001,
                "marginLevel": 10
            },
            "schema": [
                "time",
                "open",
                "high",
                "low",
                "close",
                "vol"
            ],
            "data": [
                [1610755200000, 3673743, 3795000, 3535780, 3599498, 8634843151],
                [1610841600000, 3599498, 3685250, 3385000, 3582861, 8015772738],
                [1610928000000, 3582499, 3746983, 3480000, 3663127, 7069811875],
                [1611014400000, 3662246, 3785000, 3584406, 3589149, 7961130777],
                [1611100800000, 3590194, 3641531, 3340000, 3546823, 8936842292],
                [1611187200000, 3546823, 3560000, 3007100, 3085013, 13500407666],
                [1611273600000, 3085199, 3382653, 2885000, 3294517, 14297168405],
                [1611360000000, 3295000, 3345600, 3139016, 3207800, 6459528768],
                [1611446400000, 3207800, 3307100, 3090000, 3225990, 5797803797],
                [1611532800000, 3225945, 3487500, 3191000, 3225420, 8849922692]
            ]
        }
        */

        // /* Simulation-level Tick
        ret := map[string]interface{}{
            "detail": map[string]interface{}{
                "eid": "Binance",
                "symbol": "BTC_USDT",
                "alias": "BTCUSDT",
                "baseCurrency": "BTC",
                "quoteCurrency": "USDT",
                "marginCurrency": "USDT",
                "basePrecision": 5,
                "quotePrecision": 2,
                "minQty": 0.00001,
                "maxQty": 9000,
                "minNotional": 5,
                "maxNotional": 9000000,
                "priceTick": 0.01,
                "volumeTick": 0.00001,
                "marginLevel": 10,
            },
            "schema": []string{"time","open","high","low","close","vol"},
            "data": []interface{}{
                // 1610755200000: 2021-01-16 08:00:00
                []int64{1610755200000, 3673743, 3795000, 3535780, 3599498, 8634843151},
                // 1610841600000: 2021-01-17 08:00:00
                []int64{1610841600000, 3599498, 3685250, 3385000, 3582861, 8015772738},
                []int64{1610928000000, 3582499, 3746983, 3480000, 3663127, 7069811875},
                []int64{1611014400000, 3662246, 3785000, 3584406, 3589149, 7961130777},
                []int64{1611100800000, 3590194, 3641531, 3340000, 3546823, 8936842292},
                []int64{1611187200000, 3546823, 3560000, 3007100, 3085013, 13500407666},
                []int64{1611273600000, 3085199, 3382653, 2885000, 3294517, 14297168405},
                []int64{1611360000000, 3295000, 3345600, 3139016, 3207800, 6459528768},
                []int64{1611446400000, 3207800, 3307100, 3090000, 3225990, 5797803797},
                []int64{1611532800000, 3225945, 3487500, 3191000, 3225420, 8849922692},
            },
        }
        // */

        /* Live trading-level Tick
        ret := map[string]interface{}{
            "detail": map[string]interface{}{
                "eid": "Binance",
                "symbol": "BTC_USDT",
                "alias": "BTCUSDT",
                "baseCurrency": "BTC",
                "quoteCurrency": "USDT",
                "marginCurrency": "USDT",
                "basePrecision": 5,
                "quotePrecision": 2,
                "minQty": 0.00001,
                "maxQty": 9000,
                "minNotional": 5,
                "maxNotional": 9000000,
                "priceTick": 0.01,
                "volumeTick": 0.00001,
                "marginLevel": 10,
            },
            "schema": []string{"time", "asks", "bids", "trades", "close", "vol"},
            "data": []interface{}{
                []interface{}{1610755200000,
                    []interface{}{[]int64{9531300, 10}},
                    []interface{}{[]int64{9531300, 10}},
                    []interface{}{[]int64{1610755200000, 0, 9531300, 10}},
                    9497060, 787},
                []interface{}{1610841600000,
                    []interface{}{[]int64{9531300, 15}},
                    []interface{}{[]int64{9531300, 15}},
                    []interface{}{[]int64{1610841600000, 0, 9531300, 11}},
                    9497061, 789},
            },
        }
        */

        b, _ := json.Marshal(ret)
        w.Write(b)
    }()
}

func main () {
    fmt.Println("listen http://localhost:9090")
    http.HandleFunc("/data", Handle)
    http.ListenAndServe(":9090", nil)
}
```

Test strategy (```JavaScript```):

```javascript
/*backtest
start: 2021-01-16 08:00:00
end: 2021-01-22 00:00:00
period: 1d
basePeriod: 1d
exchanges: [{"eid":"OKX","currency":"BTC_USDT","feeder":"http://<server>:9090/data"}]
args: [["number",2]]
*/

function main() {
    var ticker = exchange.GetTicker()
    var records = exchange.GetRecords()
    Log(exchange.GetName(), exchange.GetCurrency())
    Log(ticker)
    Log(records)
}
```

### Local Backtesting Engine

The platform publishes local backtest engines for JavaScript and Python. They use the same engine core and the same history data (downloaded from the platform's data server) as cloud backtests, and backtest JavaScript and Python strategies quickly on your own computer. Source code:

- [Python backtest engine](https://github.com/fmzquant/backtest_python)
- [JavaScript backtest engine](https://github.com/fmzquant/backtest_javascript)

#### Python

Install (requires Python 3 and pip):

```bash
pip install https://github.com/fmzquant/backtest_python/archive/master.zip
pip install pandas matplotlib   # only needed for Join(True) and Show()
```

On first use the package downloads the engine file for your system from the data server; afterwards only history data is downloaded. A strategy file is an ordinary FMZ strategy plus the ```backtest``` configuration comment at the top (format: see `Backtest Configuration and Saving`; the local engines read only some of its keys, see "Differences from cloud backtests" below) and a few lines that drive the engine:

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
# initialize the engine from the configuration above; exchange, Log, TA etc. become globals
task = VCtx(__doc__)

# The strategy under test, copied from the platform as is
def main():
    Log(exchange.GetAccount())
    while True:
        r = exchange.GetRecords()
        if r:
            LogStatus(_D(), r[-1]["Close"])
        Sleep(60 * 60 * 1000)

try:
    main()
except EOFError:      # The engine raises EOFError when the virtual clock reaches the end time
    pass
result = json.loads(task.Join(False))   # Raw backtest result (JSON)
print(result["LogsCount"], result["Elapsed"] / 1e6)
# task.Show()                           # Or show the profit chart (requires matplotlib)
```

Run it with ```python strategy.py```. ```task.Join(False)``` returns the raw result as JSON, ```task.Join(True)``` returns a pandas DataFrame of the first exchange account's profit and loss (PnL) and utilization at each snapshot, and ```task.Show()``` plots equity, profit and loss and utilization from the account snapshots; neither depends on ```LogProfit()```.

#### JavaScript

```bash
npm install git+https://github.com/fmzquant/backtest_javascript.git
```

```javascript
var fmz = require("fmz")
var task = fmz.VCtx({
    start: "2026-09-01 00:00:00", end: "2026-09-15 00:00:00", period: "1h", basePeriod: "15m",
    exchanges: [{eid: "Binance", currency: "BTC_USDT", balance: 10000, stocks: 0}]
})
// From here on exchange, Log, TA etc. are globals; paste the strategy code and call main()

function main() {
    Log(exchange.GetAccount())
    while (true) {
        var r = exchange.GetRecords()
        if (r) {
            LogStatus(_D(), r[r.length - 1].Close)
        }
        Sleep(60 * 60 * 1000)
    }
}

try {
    main()
} catch (e) {
    // The engine throws "EOF" when the virtual clock reaches the end time
}
var result = JSON.parse(task.Join())    // Same result as Join(False) of the Python engine
console.log(result.LogsCount)
```

#### Differences from cloud backtests

- Only JavaScript and Python strategies are supported and templates are not loaded automatically: paste the code of referenced templates into the file. PINE and MyLanguage strategies depend on trading libraries and therefore cannot be backtested locally.
- Strategy parameters are not injected; define them as global variables in the code.
- ```start``` and ```end``` in the comment are parsed in the machine's time zone; network delay is fixed at 200 ms; slippage and real-tick mode are not supported.
- Only ```start```, ```end```, ```period```, ```basePeriod``` and ```exchanges``` (with its ```eid```, ```currency```, ```balance```, ```stocks```, ```fee```, ```feeMin```) are read from the comment; ```mode```, ```args```, ```depthDeep```, ```tradesMode```, ```feeder``` and the like are ignored. Without ```basePeriod``` it is derived from ```period``` (1d→1h, 1h→30m, 30m→15m, 15m→5m, 5m→1m); without ```stocks``` the default is 3; without ```fee``` the engine's built-in fee table is used. It is best to write them all out.

#### Backtesting with an AI assistant

An AI assistant can run backtests for you: it starts a cloud backtest with the MCP tool ```run_backtest``` and reads profit, drawdown, error logs and other results with ```get_backtest```, see `AI Integration`. It can also install the local engine on your machine for a fast edit-and-run loop, then confirm once with a cloud backtest.

### Backtest Page Shortcuts

On the strategy editing page and the backtest page, the shortcuts below switch pages, save the strategy and start a backtest.

| Shortcut | Action |
| - | - |
| ```Ctrl + ,``` | Switch between the strategy editing page and the backtest page (hold ```Ctrl``` and press ```,```) |
| ```Ctrl + s``` | Save the strategy |
| ```Ctrl + b``` | Start a backtest |

## Advanced Topics

Advanced usage: JavaScript multi-threading, communication between robots, API rate limiting, options trading and on-chain trading with Web3.

### JavaScript Multi-threading

JavaScript strategies can use the ```threading``` object to create threads that really run in parallel, and exchange data between them with messages, shared dictionaries, locks and similar objects. This page explains when to use threads and how to organize thread code; for the parameters and return values of each function see `Threads` in the syntax manual.

#### Pick the right tool first

| Need | Recommended | Languages |
| - | - | - |
| Send several API requests at once (for example tickers from several exchanges) and wait for the results | `exchange.Go`, with `EventLoop` to wait for completion events | All languages |
| Long-running background work: separate market data collection, risk checks, heavy computation | `threading.Thread` | JavaScript only |
| Serve HTTP, WebSocket or TCP from inside the strategy | `threading.Serve` | JavaScript only |

When you only need a few concurrent requests, ```exchange.Go()``` is simpler and involves no data passing between threads. The ```threading``` object on this page is for JavaScript strategies only; Python and Rust strategies use ```exchange.Go()```.

These functions can be called in the backtesting system, but the threads actually run one after another there; this only keeps the code runnable in backtests.

#### Threads run in isolated environments

The function passed to ```threading.Thread()``` runs in a separate JavaScript environment. This is the most important thing to keep in mind when writing thread code:

- A thread function **cannot reference outer variables or closures**, nor call other functions defined in the strategy. Pass the data it needs as arguments: ```threading.Thread(func, arg1, arg2, ...)```.
- Plain objects and arrays passed as arguments are **deep-copied**: changing them inside the thread does not affect other threads. When several threads need to see the same data, use a dictionary created by ```threading.Dict()```.
- Functions can be passed as arguments too; ```threading.Thread()``` also accepts function source strings, which can be used to load external libraries in the thread.
- Platform API functions such as ```exchange.GetTicker()``` and ```Log()``` can be called directly in a thread.
- The return value of the thread function is retrieved with ```join()```: ```t.join().ret```.

#### Exchanging data between threads

| Method | Usage | Notes |
| - | - | - |
| Messages | Send with ```postMessage(msg)```, read with ```peekMessage(timeout)```; see below the table | Each thread has its own inbox, read in order |
| Shared dictionary | ```var d = threading.Dict()```, pass it to threads as an argument, then each thread uses ```d.get(key)``` and ```d.set(key, value)``` | Good for holding the "latest state", such as the latest price or a running flag |
| Thread data | ```t.setData(key, value)```, ```t.getData(key)``` | Key-value pairs attached to a thread object; invalid after the thread ends (```join()```, ```terminate()```) |
| Synchronization objects | ```threading.Lock()```, ```threading.Event()```, ```threading.Condition()``` | Passed to threads as arguments for mutual exclusion and waiting for notifications |

Sending and receiving messages: ```t.postMessage(msg)``` sends to thread ```t```; inside a thread, ```threading.currentThread().peekMessage(timeout)``` reads the messages it received, and ```peekMessage(-1)``` does not block and returns a null value when there is no message; a child thread sends back to the main thread with ```threading.mainThread().postMessage(msg)```.

A message received by a thread also raises an event, so the thread object's `eventLoop` can wait for messages and other events in one place.

#### Thread lifecycle

- ```t.join()``` waits for the thread to end and returns its result, with an optional timeout; ```t.terminate()``` ends a thread forcibly.
- When a thread has ended and is no longer referenced, its resources are reclaimed automatically; there is no need to call ```join()``` just to free them. There is no fixed limit on the number of threads (the 2000 limit applies only to ```exchange.Go()``` and ```HttpQuery_Go()``` tasks whose results have not been collected).
- ```threading.pending()``` returns the number of running threads (main thread included).
- All threads end when the live trading stops. Waits in ```peekMessage()```, ```join()```, locks and events are interrupted by the stop.

#### Serving from inside the strategy

```threading.Serve(address, handler, ...args)``` starts an HTTP (WebSocket included) or TCP service inside the strategy process. Each request or connection calls the handler in its own thread. It returns a `Server` object (```addr()``` gives the actual listening address, ```close()``` shuts it down). Like thread functions, handlers run in isolated environments and receive what they need as arguments; a ```threading.Dict()``` is commonly used to share state with the main thread. For the address syntax and the methods of the ```ctx``` object see `Serve`.

The old global function ```__Serve()``` still works but only returns the listening address string; use ```threading.Serve()``` in new code.

Several threads compute in parallel and the main thread collects the results; the symbol is passed as an argument, so the thread function references no outer variables.

```javascript
function main() {
    var symbols = ["BTC_USDT", "ETH_USDT", "SOL_USDT"]
    var threads = []
    for (var i = 0; i < symbols.length; i++) {
        threads.push(threading.Thread(function(symbol, period) {
            // runs in the thread: only arguments and platform APIs are available
            var records = exchange.GetRecords(symbol, period)
            if (!records || records.length < 20) {
                return null
            }
            var ma = TA.MA(records, 20)
            var close = records[records.length - 1].Close
            return {symbol: symbol, close: close, ma20: ma[ma.length - 1]}
        }, symbols[i], PERIOD_H1))
    }
    for (var i = 0; i < threads.length; i++) {
        var r = threads[i].join().ret
        if (r) {
            Log(r.symbol, "close:", r.close, "MA20:", r.ma20)
        }
    }
}
```

A background thread writes the latest price into a shared dictionary and reports errors by message; the main thread tells it to exit with a message.

```javascript
function main() {
    var shared = threading.Dict()
    var worker = threading.Thread(function(dict, symbol) {
        while (true) {
            // read commands from the main thread; -1 means do not block
            var cmd = threading.currentThread().peekMessage(-1)
            if (cmd == "stop") {
                break
            }
            var ticker = exchange.GetTicker(symbol)
            if (ticker) {
                dict.set("last", ticker.Last)
                dict.set("time", ticker.Time)
            } else {
                threading.mainThread().postMessage("failed to get ticker: " + GetLastError())
            }
            Sleep(1000)
        }
        return "worker exited"
    }, shared, "BTC_USDT")

    for (var i = 0; i < 10; i++) {
        // wait at most 1 second for a message from the background thread
        var msg = threading.currentThread().peekMessage(1000)
        if (msg) {
            Log("background thread reports:", msg)
        }
        LogStatus("last:", shared.get("last"), "time:", _D(shared.get("time")))
    }
    worker.postMessage("stop")
    Log(worker.join().ret)
}
```

A status endpoint with ```threading.Serve```: the HTTP handler gets the shared dictionary as an argument and returns it as JSON.

```javascript
function main() {
    var state = threading.Dict()
    var server = threading.Serve("http://127.0.0.1:8088", function(ctx, st) {
        if (ctx.path() == "/status") {
            ctx.setHeader("Content-Type", "application/json")
            ctx.write(JSON.stringify({last: st.get("last"), updated: st.get("updated")}))
        } else {
            ctx.setStatus(404)
        }
    }, state)
    Log("listening on:", server.addr())

    while (true) {
        var ticker = exchange.GetTicker("BTC_USDT")
        if (ticker) {
            state.set("last", ticker.Last)
            state.set("updated", _D())
        }
        Sleep(3000)
    }
}
```

See also: `Threads`, `Thread`, `Dict`, `Serve`, `exchange.Go`, `EventLoop`

### Communication Between Live Trading Strategies

Every live trading has a channel whose ID is the robot ID. A robot publishes data on its own channel with ```SetChannelData()```, and other robots read it with ```GetChannelData(liveTradingId)```. The data is relayed by the platform server, so it can travel across dockers and servers.

A channel holds the **latest state**, not a message queue: each publish overwrites the previous data, and a subscriber always reads the current latest copy. If history is needed, the subscriber keeps it itself.

Typical uses:

- **Master/follower**: a master strategy analyzes the market and publishes signals; several follower strategies read them and trade on their own accounts.
- **Status monitoring**: each strategy publishes its running status; a monitoring live trading collects them for display or alerts.
- **Data sharing**: one live trading computes indicators and publishes the results; others use them directly instead of computing them again.

#### Key points

- **The first read subscribes**: the first ```GetChannelData()``` call for a channel subscribes to it and returns a null value (```null```/```None```). From then on the server pushes the channel's updates to this robot, and later calls return the latest data. A subscriber should start reading at startup and handle null values.
- **Subscription limit**: a robot can subscribe to at most 10 different channels (UUID channels below included). Beyond that, the call returns a null value (```null```/```None```) and logs the error ```channel subscriber exceed limit```; the strategy keeps running.
- **Data format**: in JavaScript and Python, ```SetChannelData()``` accepts any JSON-serializable data and the subscriber reads the parsed object. Unchanged data is not sent again. For the data size limit see `SetChannelData`.
- **Rust**: ```SetChannelData(string)``` only accepts a string, so build the JSON text yourself; ```GetChannelData()``` takes no argument and reads this robot's own channel; to read another robot's or a UUID channel use ```GetChannelDataOf(channel ID)```, which returns a ```JsonValue``` (```Null``` on the first call, the parsed value when the data is JSON, otherwise a string).
- **Cross-platform push**: an external system (a TradingView alert, your own program, etc.) can push data to a given live trading on a channel identified by a 32-character UUID through the extended API's ```method=pub```; the live trading reads it with ```GetChannelData(UUID)```. For the request format and delivery rules see `pub`, and `GetChannelData`.
- **Live trading feature**: channels are meant for communication between robots; do not rely on them in backtests. The current robot ID is available from ```_G()```.
- Do not pass keys or other sensitive information through channels.

Publisher: publish a market summary.

```javascript
function main() {
    var robotId = _G()  // current robot ID, which is also this robot's channel ID
    var updateId = 0

    while (true) {
        var ticker = exchange.GetTicker("BTC_USDT")
        if (ticker) {
            // publish the latest state, overwriting the previous data
            SetChannelData({
                robotId: robotId,
                updateId: ++updateId,
                timestamp: Date.now(),
                symbol: "BTC_USDT",
                lastPrice: ticker.Last
            })
            LogStatus("channel", robotId, "publish #", updateId, "last price:", ticker.Last)
        }
        Sleep(60000)  // publish once a minute
    }
}
```

```python
import time

def main():
    robotId = _G()  # current robot ID, which is also this robot's channel ID
    updateId = 0

    while True:
        ticker = exchange.GetTicker("BTC_USDT")
        if ticker:
            updateId += 1
            # publish the latest state, overwriting the previous data
            SetChannelData({
                "robotId": robotId,
                "updateId": updateId,
                "timestamp": int(time.time() * 1000),
                "symbol": "BTC_USDT",
                "lastPrice": ticker["Last"]
            })
            LogStatus("channel", robotId, "publish #", updateId, "last price:", ticker["Last"])
        Sleep(60000)  # publish once a minute
```

```rust
fn main() {
    let robotId = _G!();  // current robot ID, which is also this robot's channel ID
    let mut updateId = 0;

    loop {
        if let Ok(ticker) = exchange.GetTicker("BTC_USDT") {
            updateId += 1;
            // Rust's SetChannelData only accepts a string; build the JSON text yourself
            let state = format!(
                r#"{{"robotId": "{}", "updateId": {}, "timestamp": {},
                    "symbol": "BTC_USDT", "lastPrice": {}}}"#,
                robotId, updateId, Unix() * 1000, ticker.Last
            );
            SetChannelData(&state);
            LogStatus!("channel", robotId, "publish #", updateId, "last price:", ticker.Last);
        }
        Sleep(60000);  // publish once a minute
    }
}
```

Subscriber: read two channels.

```javascript
function main() {
    // robot IDs to subscribe to (change as needed)
    var channels = ["632799", "632800"]

    while (true) {
        var msg = ""
        for (var i = 0; i < channels.length; i++) {
            // the first call subscribes and returns null; later calls return the latest data
            var state = GetChannelData(channels[i])
            if (state) {
                msg += "channel " + channels[i] + ": #" + state.updateId + " " +
                    _D(state.timestamp) + " last " + state.lastPrice + "\n"
            } else {
                msg += "channel " + channels[i] + ": waiting for data\n"
            }
        }
        LogStatus(msg)
        Sleep(5000)
    }
}
```

```python
def main():
    # robot IDs to subscribe to (change as needed)
    channels = ["632799", "632800"]

    while True:
        msg = ""
        for ch in channels:
            # the first call subscribes and returns None; later calls return the latest data
            state = GetChannelData(ch)
            if state:
                msg += "channel {}: #{} {} last {}\n".format(
                    ch, state["updateId"], _D(state["timestamp"]), state["lastPrice"])
            else:
                msg += "channel {}: waiting for data\n".format(ch)
        LogStatus(msg)
        Sleep(5000)
```

```rust
fn main() {
    // IDs of the robots to subscribe to (change as needed)
    let channels = ["632799", "632800"];

    loop {
        let mut msg = String::new();
        for ch in channels.iter() {
            // The first call subscribes and returns Null; later calls return the latest data
            let state = GetChannelDataOf(*ch);
            if !state.is_null() {
                msg += &format!("Channel {}: #{} {} last price {}\n", ch,
                    state["updateId"].as_i64().unwrap_or(0),
                    _D(state["timestamp"].as_i64().unwrap_or(0)),
                    state["lastPrice"].as_f64().unwrap_or(0.0));
            } else {
                msg += &format!("Channel {}: waiting for data\n", ch);
            }
        }
        LogStatus!(msg);
        Sleep(5000);
    }
}
```

Scenario 1, master/follower strategies: the master computes a moving-average crossover signal and publishes it.

```javascript
function main() {
    while (true) {
        var records = exchange.GetRecords("BTC_USDT")
        if (records && records.length >= 21) {
            var ma5 = TA.MA(records, 5)
            var ma20 = TA.MA(records, 20)
            var n = records.length
            var signal = "HOLD"
            if (ma5[n - 1] > ma20[n - 1] && ma5[n - 2] <= ma20[n - 2]) {
                signal = "BUY"
            } else if (ma5[n - 1] < ma20[n - 1] && ma5[n - 2] >= ma20[n - 2]) {
                signal = "SELL"
            }
            SetChannelData({
                timestamp: Date.now(),
                symbol: "BTC_USDT",
                signal: signal,
                price: records[n - 1].Close
            })
            LogStatus("current signal:", signal, "price:", records[n - 1].Close)
        }
        Sleep(60000)
    }
}
```

```python
import time

def main():
    while True:
        records = exchange.GetRecords("BTC_USDT")
        if records and len(records) >= 21:
            ma5 = TA.MA(records, 5)
            ma20 = TA.MA(records, 20)
            signal = "HOLD"
            if ma5[-1] > ma20[-1] and ma5[-2] <= ma20[-2]:
                signal = "BUY"
            elif ma5[-1] < ma20[-1] and ma5[-2] >= ma20[-2]:
                signal = "SELL"
            SetChannelData({
                "timestamp": int(time.time() * 1000),
                "symbol": "BTC_USDT",
                "signal": signal,
                "price": records[-1]["Close"]
            })
            LogStatus("current signal:", signal, "price:", records[-1]["Close"])
        Sleep(60000)
```

```rust
fn main() {
    loop {
        if let Ok(records) = exchange.GetRecords("BTC_USDT", None, None) {
            let n = records.len();
            if n >= 21 {
                let ma5 = TA.MA(&records, 5);
                let ma20 = TA.MA(&records, 20);
                let mut signal = "HOLD";
                if ma5[n - 1] > ma20[n - 1] && ma5[n - 2] <= ma20[n - 2] {
                    signal = "BUY";
                } else if ma5[n - 1] < ma20[n - 1] && ma5[n - 2] >= ma20[n - 2] {
                    signal = "SELL";
                }
                let price = records[n - 1].Close;
                // Rust's SetChannelData only accepts a string; build the JSON text yourself
                let data = format!(
                    r#"{{"timestamp": {}, "symbol": "BTC_USDT", "signal": "{}", "price": {}}}"#,
                    Unix() * 1000, signal, price
                );
                SetChannelData(&data);
                LogStatus!("current signal:", signal, "price:", price);
            }
        }
        Sleep(60000);
    }
}
```

Scenario 1, master/follower strategies: the follower reads the signal and places an order when it changes.

```javascript
function main() {
    var masterId = "632799"  // robot ID of the master strategy
    var lastSignal = null

    while (true) {
        var data = GetChannelData(masterId)
        if (!data) {
            LogStatus("waiting for the master strategy's signal...")
        } else {
            if (data.signal !== lastSignal) {
                Log("new signal:", data.signal, "signal price:", data.price)
                var ticker = exchange.GetTicker(data.symbol)
                if (ticker && data.signal === "BUY") {
                    exchange.CreateOrder(data.symbol, "buy", ticker.Last, 0.01)
                } else if (ticker && data.signal === "SELL") {
                    exchange.CreateOrder(data.symbol, "sell", ticker.Last, 0.01)
                }
                lastSignal = data.signal
            }
            LogStatus("current signal:", data.signal, "signal time:", _D(data.timestamp))
        }
        Sleep(5000)
    }
}
```

```python
def main():
    masterId = "632799"  # robot ID of the master strategy
    lastSignal = None

    while True:
        data = GetChannelData(masterId)
        if not data:
            LogStatus("waiting for the master strategy's signal...")
        else:
            if data["signal"] != lastSignal:
                Log("new signal:", data["signal"], "signal price:", data["price"])
                ticker = exchange.GetTicker(data["symbol"])
                if ticker and data["signal"] == "BUY":
                    exchange.CreateOrder(data["symbol"], "buy", ticker["Last"], 0.01)
                elif ticker and data["signal"] == "SELL":
                    exchange.CreateOrder(data["symbol"], "sell", ticker["Last"], 0.01)
                lastSignal = data["signal"]
            LogStatus("current signal:", data["signal"], "signal time:", _D(data["timestamp"]))
        Sleep(5000)
```

```rust
fn main() {
    let masterId = "632799";  // robot ID of the master strategy
    let mut lastSignal = String::new();

    loop {
        let data = GetChannelDataOf(masterId);
        if data.is_null() {
            LogStatus!("Waiting for the master strategy signal...");
        } else {
            let signal = data["signal"].as_str().unwrap_or("").to_string();
            let symbol = data["symbol"].as_str().unwrap_or("BTC_USDT");
            if signal != lastSignal {
                let price = data["price"].as_f64().unwrap_or(0.0);
                Log!("New signal:", signal.as_str(), "signal price:", price);
                if let Ok(ticker) = exchange.GetTicker(symbol) {
                    if signal == "BUY" {
                        let _ = exchange.CreateOrder(symbol, "buy", ticker.Last, 0.01);
                    } else if signal == "SELL" {
                        let _ = exchange.CreateOrder(symbol, "sell", ticker.Last, 0.01);
                    }
                }
                lastSignal = signal.clone();
            }
            let ts = data["timestamp"].as_i64().unwrap_or(0);
            LogStatus!("Current signal:", signal.as_str(), "signal time:", _D(ts));
        }
        Sleep(5000);
    }
}
```

Scenario 2, monitoring several strategies: each strategy publishes its status like the publisher; the monitoring robot reads every channel, shows them in a table and marks those without an update for over 2 minutes as abnormal.

```javascript
function main() {
    var monitorList = ["632799", "632800", "632801"]  // at most 10

    while (true) {
        var table = {
            type: "table", title: "Strategy status",
            cols: ["Robot ID", "Status", "Last update", "Symbol", "Last price"], rows: []
        }
        for (var i = 0; i < monitorList.length; i++) {
            var data = GetChannelData(monitorList[i])
            if (data) {
                var status = Date.now() - data.timestamp < 120000 ? "running" : "abnormal"
                table.rows.push([monitorList[i], status, _D(data.timestamp),
                                 data.symbol || "-", data.lastPrice || "-"])
            } else {
                table.rows.push([monitorList[i], "waiting for data", "-", "-", "-"])
            }
        }
        LogStatus("`" + JSON.stringify(table) + "`")
        Sleep(10000)
    }
}
```

```python
import json
import time

def main():
    monitorList = ["632799", "632800", "632801"]  # at most 10

    while True:
        table = {
            "type": "table", "title": "Strategy status",
            "cols": ["Robot ID", "Status", "Last update", "Symbol", "Last price"], "rows": []
        }
        for robotId in monitorList:
            data = GetChannelData(robotId)
            if data:
                fresh = time.time() * 1000 - data["timestamp"] < 120000
                status = "running" if fresh else "abnormal"
                table["rows"].append([robotId, status, _D(data["timestamp"]),
                                      data.get("symbol", "-"), data.get("lastPrice", "-")])
            else:
                table["rows"].append([robotId, "waiting for data", "-", "-", "-"])
        LogStatus("`" + json.dumps(table) + "`")
        Sleep(10000)
```

```rust
fn main() {
    let monitorList = ["632799", "632800", "632801"];  // at most 10

    loop {
        let mut rows = Vec::new();
        for robotId in monitorList.iter() {
            let data = GetChannelDataOf(*robotId);
            if !data.is_null() {
                let ts = data["timestamp"].as_i64().unwrap_or(0);
                let status = if Unix() * 1000 - ts < 120000 { "Running" } else { "Stale" };
                let price = data["lastPrice"].as_f64()
                    .map(|p| p.to_string()).unwrap_or("-".to_string());
                rows.push(format!(r#"["{}", "{}", "{}", "{}", "{}"]"#, robotId, status, _D(ts),
                    data["symbol"].as_str().unwrap_or("-"), price));
            } else {
                rows.push(format!(r#"["{}", "Waiting for data", "-", "-", "-"]"#, robotId));
            }
        }
        let table = format!(
            r#"{{"type": "table", "title": "Strategy status",
                "cols": ["Robot ID", "Status", "Last update", "Symbol", "Last price"],
                "rows": [{}]}}"#,
            rows.join(", "));
        LogStatus!(format!("`{}`", table));
        Sleep(10000);
    }
}
```

See also: `SetChannelData`, `GetChannelData`, `_G`

### API Rate Limiting Control

Exchanges limit how often their API may be called. Going over the limit gets requests rejected at best and the account temporarily banned at worst. With ```exchange.IO("rate", ...)``` or ```exchange.IO("quota", ...)``` you can cap the call frequency of standard functions locally on the docker: a call that exceeds the limit is never sent.

```javascript
exchange.IO("rate" | "quota", name, count, window[, "delay"])
```

#### Two modes

- **rate (token bucket)**: the bucket capacity defaults to ```count```. It starts full and refills at a steady "count per window"; each call takes one token. Short bursts are allowed, while the long-run average never exceeds "count per window". Writing ```count``` as ```"10/5"``` means 10 refills per window with a bucket capacity of 5, which limits bursts.
- **quota (fixed window)**: at most ```count``` calls per window; the counter resets when the next window starts. Windows are aligned to the Unix epoch: ```1s``` to whole seconds, ```1m``` to whole minutes, ```1h``` to whole hours, ```1d``` to UTC midnight (08:00 Beijing time). For example, counting that starts at 12:00:00.900 is already in a new window at 12:00:01.000.

Use ```quota``` with a window matching the exchange's counting period when you must guarantee "no more than N calls in any of the exchange's periods"; use ```rate``` when you only need to control the average frequency.

#### Parameters

For the parameter syntax (several function names separated by commas, the ```*``` fallback rule, ```"count/burst"``` in ```rate``` mode, window durations and daily resets with ```@HHMM```, the ```delay``` action, deleting rules) see ```exchange.IO("rate", ...)``` in the `exchange.IO` category of the syntax manual.

#### Function names that can be limited

| Category | Names |
| - | - |
| Market data | ```GetTicker```, ```GetTickers```, ```GetDepth```, ```GetTrades```, ```GetRecords```, ```GetMarkets```, ```GetFundings``` |
| Account | ```GetAccount```, ```GetAssets```, ```GetPositions```, ```SetMarginLevel``` |
| Trading | ```CreateOrder``` (```Buy``` and ```Sell``` count here too), ```CancelOrder```, ```ModifyOrder``` |
| Order queries | ```GetOrder```, ```GetOrders```, ```GetHistoryOrders``` |
| Conditional orders | ```CreateConditionOrder```, ```ModifyConditionOrder```, ```CancelConditionOrder``` |
| Conditional order queries | ```GetConditionOrder```, ```GetConditionOrders```, ```GetHistoryConditionOrders``` |
| Custom requests | ```IO/api```: limits only ```exchange.IO("api", ...)```, other ```exchange.IO()``` commands are unaffected |

- ```GetAccount``` and ```GetAssets``` are the same underlying request; a rule under either name applies to both functions.
- Calls made concurrently through ```exchange.Go()``` are counted under the function actually called.

#### Scope of rules

- Rules are set per exchange object: a rule on ```exchanges[0]``` does not affect ```exchanges[1]```.
- Rules last for the current run only. Set them again after the live trading restarts, usually at the beginning of ```main()```.
- Setting the same name again replaces its rule; an empty name (```exchange.IO("rate", "")```) clears all rules of that exchange object.
- Each call is counted under one rule only: a function with its own rule is no longer counted under ```*```, so ```*``` cannot be used as a "total quota for all calls" stacked on top of specific rules.

#### When the limit is exceeded

With the default action, a call over the limit sends no request and is treated as a failed call (JavaScript returns ```null```, Python returns ```None```, Rust returns ```Err```). The error message looks like:

```text
rate limit exceeded: GetTicker 10/1s
quota limit exceeded: GetTicker 10/1m
quota limit exceeded: GetRecords 2000/day (resets at 0800)
```

With the ```delay``` action the call blocks until a call is available, so the time recorded in the log is the time after the wait. With a rule that resets daily, ```delay``` may wait until the next day; use it with care.

Default action: calls over the limit fail.

```javascript
function main() {
    // GetTicker at most 5 calls per second on average (token bucket, capacity 5)
    exchange.IO("rate", "GetTicker", 5, "1s")

    for (var i = 0; i < 10; i++) {
        var ticker = exchange.GetTicker("BTC_USDT")
        if (ticker) {
            Log("call", i + 1, "succeeded:", ticker.Last)
        } else {
            // a call over the limit sends no request and returns null
            Log("call", i + 1, "rate limited:", GetLastError())
        }
    }
}
```

```python
def main():
    # GetTicker at most 5 calls per second on average (token bucket, capacity 5)
    exchange.IO("rate", "GetTicker", 5, "1s")

    for i in range(10):
        ticker = exchange.GetTicker("BTC_USDT")
        if ticker:
            Log("call", i + 1, "succeeded:", ticker["Last"])
        else:
            # a call over the limit sends no request and returns None
            Log("call", i + 1, "rate limited:", GetLastError())
```

```rust
fn main() {
    // GetTicker at most 5 calls per second on average (token bucket, capacity 5)
    let _ = exchange.IO(("rate", "GetTicker", 5, "1s"));

    for i in 0..10 {
        match exchange.GetTicker("BTC_USDT") {
            Ok(ticker) => Log!("call", i + 1, "succeeded:", ticker.Last),
            // a call over the limit sends no request and returns Err
            Err(e) => Log!("call", i + 1, "rate limited:", e),
        }
    }
}
```

Rules grouped after the exchange's own limits: market data and trading each share one rule, trading calls wait instead of failing, and every other function falls back to ```*```.

```javascript
function main() {
    // market data: GetTicker and GetDepth together 20 calls/s on average
    exchange.IO("rate", "GetTicker,GetDepth", 20, "1s")
    // trading: orders (incl. Buy/Sell) and cancels together 5/s; wait when over
    exchange.IO("rate", "CreateOrder,CancelOrder", 5, "1s", "delay")
    // fallback: other functions (GetAccount, GetPositions...) 60/min, aligned to minutes
    exchange.IO("quota", "*", 60, "1m")

    while (true) {
        var ticker = exchange.GetTicker("BTC_USDT")
        var depth = exchange.GetDepth("BTC_USDT")
        if (ticker && depth) {
            Log("last:", ticker.Last, "best bid:", depth.Bids[0].Price)
        }
        Sleep(1000)
    }
}
```

```python
def main():
    # market data: GetTicker and GetDepth together 20 calls/s on average
    exchange.IO("rate", "GetTicker,GetDepth", 20, "1s")
    # trading: orders (incl. Buy/Sell) and cancels together 5/s; wait when over
    exchange.IO("rate", "CreateOrder,CancelOrder", 5, "1s", "delay")
    # fallback: other functions (GetAccount, GetPositions...) 60/min, aligned to minutes
    exchange.IO("quota", "*", 60, "1m")

    while True:
        ticker = exchange.GetTicker("BTC_USDT")
        depth = exchange.GetDepth("BTC_USDT")
        if ticker and depth:
            Log("last:", ticker["Last"], "best bid:", depth["Bids"][0]["Price"])
        Sleep(1000)
```

```rust
fn main() {
    // market data: GetTicker and GetDepth together 20 calls/s on average
    let _ = exchange.IO(("rate", "GetTicker,GetDepth", 20, "1s"));
    // trading: orders (incl. Buy/Sell) and cancels together 5/s; wait when over
    let _ = exchange.IO(("rate", "CreateOrder,CancelOrder", 5, "1s", "delay"));
    // fallback: other functions (GetAccount, GetPositions...) 60/min, aligned to minutes
    let _ = exchange.IO(("quota", "*", 60, "1m"));

    loop {
        let (t, d) = (exchange.GetTicker("BTC_USDT"), exchange.GetDepth("BTC_USDT"));
        if let (Ok(ticker), Ok(depth)) = (t, d) {
            Log!("last:", ticker.Last, "best bid:", depth.Bids[0].Price);
        }
        Sleep(1000);
    }
}
```

Burst capacity, daily quota, and deleting rules.

```javascript
function main() {
    // 10 calls per second on average, but at most 2 in a burst
    exchange.IO("rate", "GetDepth", "10/2", "1s")
    // resets every day at 08:00 Beijing time, at most 2000 calls per day
    exchange.IO("quota", "GetRecords", 2000, "@0800")
    // units can be combined: at most 100 calls every 1 hour 30 minutes
    exchange.IO("rate", "GetOrders", 100, "1h30m")

    // count 0: delete the rule for GetOrders
    exchange.IO("rate", "GetOrders", 0)
    // empty name: clear all rules of this exchange object
    exchange.IO("rate", "")
}
```

```python
def main():
    # 10 calls per second on average, but at most 2 in a burst
    exchange.IO("rate", "GetDepth", "10/2", "1s")
    # resets every day at 08:00 Beijing time, at most 2000 calls per day
    exchange.IO("quota", "GetRecords", 2000, "@0800")
    # units can be combined: at most 100 calls every 1 hour 30 minutes
    exchange.IO("rate", "GetOrders", 100, "1h30m")

    # count 0: delete the rule for GetOrders
    exchange.IO("rate", "GetOrders", 0)
    # empty name: clear all rules of this exchange object
    exchange.IO("rate", "")
```

```rust
fn main() {
    // 10 calls per second on average, but at most 2 in a burst
    let _ = exchange.IO(("rate", "GetDepth", "10/2", "1s"));
    // resets every day at 08:00 Beijing time, at most 2000 calls per day
    let _ = exchange.IO(("quota", "GetRecords", 2000, "@0800"));
    // units can be combined: at most 100 calls every 1 hour 30 minutes
    let _ = exchange.IO(("rate", "GetOrders", 100, "1h30m"));

    // count 0: delete the rule for GetOrders
    let _ = exchange.IO(("rate", "GetOrders", 0));
    // empty name: clear all rules of this exchange object
    let _ = exchange.IO(("rate", ""));
}
```

See also: `exchange.IO`, `exchange.Go`, `GetLastError`

### Options Trading

The FMZ Quant Trading Platform supports options trading on the cryptocurrency futures exchanges in the table below. Options are used the same way as futures contracts: set the contract to an option code with ```exchange.SetContractType()``` (the option code is the exchange's native code, and the format differs between exchanges). After that, market data functions such as ```GetTicker()``` and ```GetDepth()``` and trading functions such as ```Buy()```, ```Sell()``` (set the trade direction with ```exchange.SetDirection()``` before placing orders), ```CancelOrder()``` and ```GetPositions()``` all work on that option contract. You can also place orders with the full instrument code in the form ```pair.optionCode```, for example ```BTC_USDT.BTC-261225-100000-C```.

Option order books are usually thin: when there is no bid or ask, ```Buy``` and ```Sell``` in the ```Ticker``` are 0, and ```Last``` may be 0 for a contract that has never traded; see the exchange pages. Whether ```exchange.GetMarkets()``` lists option contracts depends on the exchange; where it does not, get the option codes from the exchange's API or website.

| Exchange object | Pair example | Option code example | GetMarkets lists options |
| - | - | - | - |
| `Futures_Deribit` | ```BTC_USD``` | ```BTC-25DEC26-100000-C``` | Yes |
| `Futures_OKCoin` (OKX futures) | ```BTC_USD``` | ```BTC-USD-261225-100000-C``` | No |
| `Futures_Binance` | ```BTC_USDT``` | ```BTC-261225-100000-C``` | No |
| `Futures_Bybit` | ```ETH_USDT``` | ```ETH-25JUN27-2800-C-USDT``` | Yes |
| `Futures_Aevo` | ```ETH_USDC``` | ```ETH-25DEC26-3000-C``` | Yes |
| `Futures_GateIO` | ```BTC_USDT``` | ```BTC_USDT-20261225-100000-C``` | Yes |
| `Futures_Kraken` | ```ETH_USD``` | ```OF_ETHUSD_261225_4000_C``` | No |

The expiries and strikes in these codes are examples only; the contracts you can trade are those currently listed by the exchange.

The exact rules differ between exchanges and are documented in the "Options" section of each exchange page: how option codes are written (for example Deribit's combination options, or ```XBT``` for BTC in Kraken codes), where to get option codes when ```exchange.GetMarkets()``` does not list them, order restrictions (some exchanges accept only limit orders and support neither order modification, conditional orders nor ```exchange.SetMarginLevel()```), and whether ```Last``` in the ```Ticker``` falls back to the mark price when there is no trade. Click an exchange name in the table above.

See also: `exchange.SetContractType`, `exchange.SetDirection`, `exchange.GetPositions`

### Web3

On-chain trading: which exchange object to use.

| Need | Exchange object | Notes |
| - | - | - |
| Swap tokens on DEXs of EVM chains | ```Uniswap``` (Uniswap, PancakeSwap, Aerodrome), ```KyberSwap```, ```OneInch``` (1inch) | Trade with the spot trading functions; see `EVM On-chain Swaps (Uniswap, KyberSwap, 1inch)` |
| Swap tokens on Solana | ```Jupiter``` | See `Solana Swaps (Jupiter)` |
| Swap on several chains through the OKX DEX aggregator | ```OKX_DEX``` | Mnemonic phrase; pairs are ```{chainIndex}:{token}_USD``` (case-sensitive token names); see `OKX_DEX` |
| Read on-chain data, call smart contracts, send custom transactions | ```Web3``` | Supports Ethereum and other EVM-compatible chains (see `Ethereum (EVM)`) and TRON (see `TRON`) |

On-chain exchanges such as Hyperliquid, Lighter, EdgeX, Aster and Polymarket are used with the standard trading functions just like centralized exchanges; for their configuration see the exchange pages under `Decentralized Exchanges` and `Prediction Markets` in the syntax manual.

#### EVM On-chain Swaps (Uniswap, KyberSwap, 1inch)

The Uniswap exchange object (```exchange.GetName()``` returns ```Uniswap```) connects to the pools of Uniswap, PancakeSwap or Aerodrome on one EVM chain and maps on-chain swaps to the spot trading functions: check prices with ```exchange.GetTicker()``` and trade with ```exchange.CreateOrder()```, without registering ABIs or encoding contract calls yourself. Routing, quoting, token approval, price protection and sending transactions are handled by the exchange object. The same implementation also comes in two aggregator versions, ```KyberSwap``` and ```OneInch``` (1inch), whose quotes and transaction data come from the aggregator, which splits and routes orders across many DEXs and market makers.

##### Which exchange object to use

| Need | Exchange object |
| - | - |
| Swap on the pools of a given DEX with control over the route (V2/V3/V4, direct or two-hop) | ```Uniswap```, with DEX set to Uniswap, PancakeSwap or Aerodrome |
| Let an aggregator find the best price across DEXs, no API key needed | ```KyberSwap``` |
| Let the 1inch aggregator find the best price (needs a 1inch API key) | ```OneInch``` |
| Call other contracts, provide liquidity, manage V3 positions, custom transactions | ```Web3```, see `Ethereum (EVM)` |
| Swaps on Solana | ```Jupiter```, see `Solana Swaps (Jupiter)` |

A strategy can add several exchange objects that use the same wallet, for example ```Uniswap``` and ```KyberSwap``` to compare prices and ```Web3``` for other on-chain operations.

##### Configuring the exchange object

- ```DEX```: ```Uniswap``` exchange object only: ```Uniswap```, ```PancakeSwap```, ```Aerodrome``` (Base only)
- ```Chain```: One exchange object corresponds to one chain; see the table below
- ```Private Key```: Wallet private key (hex string). The key can be kept locally on the docker, see `Local Credential Files`
- ```Rpc Address```: Node address for the chain; selecting a Chain fills in the default nodes (```primary,backup```). Separate several nodes with commas; when one fails or lacks data the next one is used
- ```Rpc Api Key```: Node authentication, may be empty. Written as ```Name: value``` it is sent as that request header, otherwise as ```Authorization: Basic <value>```. ```OneInch``` has no such field
- ```1inch Api Key```: ```OneInch``` only, required: apply for it on the 1inch developer portal

DEXs and aggregators by chain:

| Chain | Uniswap | PancakeSwap | Aerodrome | KyberSwap | OneInch |
| - | - | - | - | - | - |
| Ethereum | V2, V3, V4 | V2, V3 | — | ✓ | ✓ |
| Arbitrum | V3, V4 | V2, V3 | — | ✓ | ✓ |
| Base | V3, V4 | V2, V3, Infinity | Slipstream, basic pools | ✓ | ✓ |
| BNB Chain | V3, V4 | V2, V3, Infinity | — | ✓ | ✓ |
| Unichain | V2, V3, V4 | — | — | ✓ | ✓ |
| Polygon | V3, V4 | — | — | ✓ | ✓ |
| OP Mainnet | V3, V4 | — | — | ✓ | ✓ |
| Robinhood | V2, V3, V4 | — | — | ✓ | — |
| Arc | V2, V3, V4 | — | — | — | — |

- V4 (Uniswap) and Infinity (PancakeSwap Infinity CL) use only pools without hooks; the native coin takes part in the swap directly, without the wrapped coin.
- The wallet needs the chain's native coin to pay gas: ETH or BNB; POL on Polygon (wrapped: WPOL); Arc pays gas in USDC.
- The first request checks that the node is on the configured Chain; if not, it reports an error and never sends a transaction to another chain.
- The node must be able to return receipts of mined transactions, otherwise order status cannot be queried. publicnode's public Base, BNB Chain and Arbitrum nodes cannot, so do not use them alone; check this when you configure your own node.

##### Trading pairs

- Pairs are written as ```base_quote```, e.g. ```ETH_USDC```, ```UNI_USDT```.
- Token names are looked up in the token table first (built-in common tokens such as the native coin, wrapped native coin, USDC and USDT, plus tokens registered with ```exchange.IO("token", name, contractAddress)```), then in the built-in official token list. If a chain has several tokens with the same name, use the contract address instead, e.g. ```0x1f9840a85d5af5bf1d1762f925bdaddc4201f984_USDC```; a contract address is registered automatically with the decimals read from the chain.
- **The native coin and the wrapped coin are two assets**: ```ETH``` and ```WETH```, ```BNB``` and ```WBNB``` are different coins. You cannot place an order between them; convert 1:1 with ```exchange.IO("wrap", amount)``` and ```exchange.IO("unwrap", amount)```, which only cost gas.
- Chain-specific names: USDT on Unichain and Polygon is ```USDT0```; Robinhood has no USDC or USDT and uses USDG (```ETH_USDG```); on Arc the native balance is USDC and pairs are written ```WETH_USDC```, ```EURC_USDC```.
- ```exchange.GetMarkets()``` lists only common pairs; pairs not listed can be traded as well.

##### Placing orders

A DEX has no order book: every order is an on-chain swap executed immediately, either filled in full or reverted in full (losing only gas). There are no partial fills and no resting orders.

- **Limit orders**: the limit price is the **worst execution price**. The order is quoted first; if the current price cannot reach the limit, an error is reported and nothing is sent. Otherwise "minimum received / maximum paid" is written into the transaction, and if the price moves before it is mined the swap reverts.
- **Market orders**: slippage protection is applied to the quote; the default slippage is 0.5%, changed with ```exchange.IO("slippage", ratio)```.
- **Amount**: for a sell, the amount of base coin to sell; for a limit buy, the amount of base coin to receive; **for a market buy, the amount of quote coin to spend**.
- **Aggregators only support exact input**: a limit buy on ```KyberSwap``` or ```OneInch``` is executed as "spend at most amount × price, receive at least amount", so slightly more may be received. Aerodrome's basic pools are also exact-input only, so a limit buy there uses only Slipstream pools.
- **Per-order settings**: JSON can be appended to the side parameter, e.g. ```exchange.CreateOrder("ETH_USDC", 'sell;{"slippage":0.01,"route":"v3"}', -1, 0.1)```: ```slippage``` is the slippage for this order; ```route``` restricts the route type to ```v2```, ```v3```, ```v4```, ```hop``` (two hops) or ```direct```. On Aerodrome ```v2``` means basic pools and ```v3``` means Slipstream.
- **Approval**: before selling an ERC20 token the allowance is checked; if it is not enough an approval transaction is sent first and mined. V2 and V3 pools are approved to the router; V4 and Infinity go through their Permit2 contracts; aggregators are approved directly to the aggregator's router. By default only the amount needed is approved; ```exchange.IO("approve", "max")``` switches to unlimited approval.
- **Deadline**: a transaction not mined before the deadline (120 seconds by default, changed with ```exchange.IO("deadline", seconds)```) reverts, so it does not fill after a large price move.

Before placing an order you can quote only with ```exchange.IO("route", ...)``` (quotes for each candidate route), and build the transaction with the order logic and simulate it on chain with ```exchange.IO("simulate", ...)```, which costs no gas.

##### Orders and cancellation

- Order IDs look like ```ETH_USDC,0x…```: the pair, a comma and the transaction hash. ```exchange.GetOrder()``` takes the status from the transaction receipt; the order's ```Info``` has ```chainId``` and the chain name ```chain```, which tell which chain an order belongs to when you aggregate or store orders across chains. To query the receipt with ```exchange.IO("receipt", ...)```, pass the transaction hash after the comma.
- ```exchange.GetOrders()``` returns the orders sent in this run that are not mined yet.
- ```exchange.CancelOrder()``` sends a replacement transaction with the original order's nonce and waits for the result (up to 30 seconds by default, changed with ```exchange.IO("cancelWait", seconds)```): if the replacement is mined first it returns ```true```; if the original order is mined first (or was already mined) it returns ```false```; on timeout it returns ```true```, meaning the cancellation has been submitted. ```exchange.GetOrder()``` has the final word: when the original nonce was taken by the replacement, the order shows as canceled.

##### Differences from centralized exchanges

- The bid and ask of ```exchange.GetTicker()``` are executable prices for about 1000 USD; there are no 24-hour statistics on chain. ```exchange.GetDepth()``` is derived from quotes of increasing size, not a real order book.
- ```exchange.GetTrades()``` returns recent on-chain trades from the pair's pools; the aggregators (```KyberSwap```, ```OneInch```) do not support it.
- ```exchange.GetRecords()```, ```exchange.GetTickers()``` and ```exchange.GetHistoryOrders()``` are not supported.
- The 1inch free tier allows 1 request per second; the connector queues requests, so ```exchange.GetDepth()``` takes correspondingly longer.

For the detailed behavior of each function and the parameters and return values of the ```exchange.IO()``` commands (```route```, ```simulate```, ```token```, ```transfer```, ```receipt```, ```wrap```, ```unwrap```, ```approve```, ```slippage```, ```deadline```, ```cancelWait```, ```gasMultiplier```, ```contracts```, ```base```, ```sendBase```, ```address```), see the `Uniswap` exchange page of the syntax manual.

Quote, simulate, then market sell (```ETH_USDC``` on Ethereum; the same code works on ```KyberSwap``` and ```OneInch```). ```CreateOrder``` sends a real transaction.

```javascript
function main() {
    var symbol = "ETH_USDC"
    exchange.IO("slippage", 0.003)   // market order slippage 0.3%

    var t = exchange.GetTicker(symbol)
    Log("bid:", t.Buy, "ask:", t.Sell)

    // quote only: best route for selling 0.1 ETH
    var r = exchange.IO("route", symbol, "sell", 0.1)
    if (!r || r.best === null) {
        Log("no route:", GetLastError())
        return
    }
    Log("best route:", r.best, "average price:", r.price)

    // simulate on chain, no gas spent
    if (!exchange.IO("simulate", symbol, "sell", 0.1)) {
        Log("simulation failed:", GetLastError())
        return
    }

    // market sell 0.1 ETH; the order ID looks like ETH_USDC,0x…
    var id = exchange.CreateOrder(symbol, "sell", -1, 0.1)
    if (!id) {
        Log("order failed:", GetLastError())
        return
    }
    while (true) {
        var o = exchange.GetOrder(id)
        if (o && o.Status != ORDER_STATE_PENDING) {
            Log("status:", o.Status, "filled:", o.DealAmount, "average fill price:", o.AvgPrice)
            break
        }
        Sleep(3000)
    }
}
```

See also: `Uniswap`, `exchange.CreateOrder`, `exchange.CancelOrder`

#### Solana Swaps (Jupiter)

The Jupiter exchange object (```exchange.GetName()``` returns ```Jupiter```) connects to the Jupiter aggregator on Solana and maps swaps to the spot trading functions. One exchange object corresponds to one Solana wallet: quotes and swap transactions are generated by Jupiter (which splits and routes orders across the many DEXs and market makers on Solana), signed by the docker with the configured private key and broadcast through a Solana node. For swaps on EVM chains see `EVM On-chain Swaps (Uniswap, KyberSwap, 1inch)`.

##### Configuring the exchange object

- ```Private Key```: Solana wallet private key: the base58 string exported by Phantom or Solflare, or the JSON byte array of a solana-keygen file. The key can be kept locally on the docker, see `Local Credential Files`
- ```Rpc Address```: Solana RPC nodes, separated by commas; when one fails the next one is used. Defaults to the official public node and publicnode
- ```Jupiter Api Key```: Optional. Without it the free ```lite-api.jup.ag``` is used; with it ```api.jup.ag``` is used and the request rate can be raised according to your plan
- ```Liquidity Sources```: Optional; restricts the liquidity sources swaps go through, comma-separated: ```pump``` (the pump.fun bonding curve and PumpSwap), ```meteora```, ```raydium```, ```orca```, or Jupiter source names (such as ```Meteora DLMM```). Empty means all sources

The wallet needs SOL for fees: each transaction's base fee and priority fee are paid from the SOL balance (the priority fee cap defaults to 0.001 SOL and is changed with ```exchange.IO("priorityFee", ...)```). The first time you buy a token, the wallet has to create an account for it, with a deposit of about 0.002 SOL that still belongs to the wallet.

##### Trading pairs

- Pairs are written as ```SOL_USDC```, ```JUP_USDC```, ```BONK_SOL```. SOL is the native coin and is wrapped and unwrapped automatically during swaps.
- Built-in common tokens can be written by name. Other tokens can be written as the exact name of a verified token in Jupiter's token list, as the mint address, or registered first with ```exchange.IO("token", name, mintAddress)```.
- Pairs are **not upper-cased**: mint addresses and names such as ```mSOL``` are case-sensitive, so write them as they are, e.g. ```DB5QKorV9KHY54y73h5xWQqYyuD8P3jC1p5Ea8DBpump_SOL```.
- ```exchange.GetMarkets()``` lists pairs of the token table's coins against USDC, USDT and SOL; ```exchange.GetAssets()``` lists only the balances of SOL and the token table's tokens.

##### Orders

- Every order is a swap executed immediately. The limit price is the worst execution price, enforced on chain through the slippage setting; if the current quote cannot reach the limit, an error is reported and nothing is sent. Market orders are protected by slippage (0.5% by default, changed with ```exchange.IO("slippage", ratio)```). For a market buy the amount is the quote coin to spend.
- Jupiter simulates the transaction when generating it, so problems such as an insufficient balance are reported when the order is placed.
- Order IDs look like ```SOL_USDC,5VERv8…``` (the pair, a comma and the transaction signature). Once confirmed the order is filled, with the filled amount computed from the wallet balances before and after; a transaction that fails on chain shows as canceled (the fee is still paid); a transaction not included within about a minute expires and shows as canceled.
- ```exchange.GetOrders()``` returns the swaps sent by this program that are neither confirmed nor expired.
- **No cancellation**: a sent Solana transaction cannot be recalled; ```exchange.CancelOrder()``` reports an error and fails. Just wait for the transaction to expire.
- ```exchange.GetTrades()```, ```exchange.GetRecords()```, ```exchange.GetTickers()``` and ```exchange.GetHistoryOrders()``` are not supported.

##### Request rate

Jupiter limits requests per second and returns 429 beyond the limit. The connector queues requests at the rate set with ```exchange.IO("rps", ...)``` (1 per second by default), shared by all Jupiter exchange objects in the same docker process. One ```exchange.GetTicker()``` needs two quotes (about 2 seconds), and a 5-level ```exchange.GetDepth()``` about 10 seconds. If you need more speed, get a Jupiter API key and raise ```rps``` according to your plan.

##### Common commands

```route``` (quote only), ```token``` (register tokens), ```transfer``` (send SOL), ```receipt``` (transaction status), ```slippage```, ```priorityFee```, ```dexes``` (change liquidity sources at run time), ```rps```, plus ```base``` (switch nodes) and ```address``` (wallet address). For their parameters and return values and the detailed behavior of each function, see the `Jupiter` exchange page of the syntax manual.

Quote, then market sell. ```CreateOrder``` sends a real transaction.

```javascript
function main() {
    exchange.IO("slippage", 0.01)      // market order slippage 1%

    var t = exchange.GetTicker("SOL_USDC")
    Log("bid:", t.Buy, "ask:", t.Sell)

    // quote only: how much USDC selling 0.1 SOL gets
    var r = exchange.IO("route", "SOL_USDC", "sell", 0.1)
    if (!r || r.route === null) {
        Log("no route:", GetLastError())
        return
    }
    Log("receive:", r.quote, "USDC", "average price:", r.price, "route:", r.route.join(" + "))

    // market sell 0.1 SOL; the order ID looks like SOL_USDC,5VERv8…
    var id = exchange.CreateOrder("SOL_USDC", "sell", -1, 0.1)
    if (!id) {
        Log("order failed:", GetLastError())
        return
    }
    while (true) {
        var o = exchange.GetOrder(id)
        if (o && o.Status != ORDER_STATE_PENDING) {
            Log("status:", o.Status, "filled:", o.DealAmount, "average fill price:", o.AvgPrice)
            break
        }
        Sleep(2000)
    }
}
```

See also: `Jupiter`, `exchange.CreateOrder`

#### Ethereum (EVM)

With ```ChainType``` set to ```ETH```, the Web3 exchange object connects to nodes of Ethereum and every EVM-compatible chain (BSC, Base, Arbitrum, Optimism, Polygon and so on), and uses the ```exchange.IO()``` commands to query balances, call contracts and send transactions. This page walks through the commands in the order of a typical on-chain operation; for the full parameters of each command see the corresponding ```exchange.IO("command", ...)``` in the `Web3` exchange page of the syntax manual.

If you only want to swap tokens on a DEX, use the ```Uniswap```, ```KyberSwap``` or ```OneInch``` exchange object (see `EVM On-chain Swaps (Uniswap, KyberSwap, 1inch)`): it supports standard functions such as ```exchange.GetTicker()``` and ```exchange.CreateOrder()``` directly, with no contract calls to encode yourself.

##### 1. Configure the exchange object

Add an exchange on the "Exchange" page (```/m/add-platform```), choose the protocol "Cryptocurrency" and the exchange ```Web3```:

- ```ChainType```: ```ETH```: Ethereum and all EVM-compatible chains; ```TRON```: TRON, see `TRON`
- ```Private Key```: Wallet private key (hex string, the ```0x``` prefix is optional). The key can be deployed locally on the docker, see `Key Security`
- ```Rpc Address```: Node address, by default ```https://ethereum-rpc.publicnode.com``` (a public Ethereum mainnet node). For other chains enter a node of that chain, for example BSC: ```https://bsc-dataseed.binance.org```. ```http(s)://``` and ```ws(s)://``` are supported. Several nodes separated by commas back each other up
- ```Rpc Api Key```: Node authentication, may be left empty. Written as ```Name: value``` (such as ```x-api-key: xxx```) it is sent as a request header with that name; otherwise it is sent as ```Authorization: Basic <value>```

With several nodes, requests start from the node that last succeeded and move on only when a node is unavailable (connection failure, timeout, rate limiting); errors such as a failed contract execution are returned directly. Nodes whose chain ID differs from the first node's are skipped, so transactions are never sent to another chain.

At runtime, ```exchange.IO("base", nodeAddress)``` switches nodes (several nodes can be passed as an array or a comma-separated string), ```exchange.IO("key", privateKey)``` switches the wallet private key, and `exchange.IO("address")` returns the current wallet address.

Among the standard functions only ```exchange.GetAccount()``` and ```exchange.GetAssets()``` are available; they return the wallet's native coin balance (the currency is recognized from the chain ID, ```BNB``` on BSC for example).

##### 2. Query balances and read contracts

Read-only contract methods (```view```/```pure```) cost no gas and return decoded results directly:

```javascript
exchange.IO("api", "eth", "eth_getBalance", wallet, "latest")   // native balance (hex integer)
exchange.IO("api", tokenAddress, "balanceOf", wallet)           // ERC20 balance, on-chain integer
exchange.IO("api", tokenAddress, "decimals")                    // token decimals
```

- ```exchange.IO("api", "eth", method, ...args)``` calls the node's JSON-RPC methods directly, such as ```eth_gasPrice```, ```eth_blockNumber``` and ```eth_getTransactionReceipt```.
- ```exchange.IO("api", contractAddress, method, ...args)``` calls a contract method. The method can be a name, a full signature (such as ```"approve(address,uint256)"```, to tell overloads apart) or a selector (such as ```"0x095ea7b3"```).
- On-chain amounts are integers. ```exchange.IO("fromUnits", onChainInteger, decimals)``` converts to a readable amount and ```exchange.IO("toUnits", "1.5", decimals)``` converts back; a token contract address can be passed in place of the decimals. Both compute exactly on strings.
- Use ```exchange.IO("multicall", ...)``` to read many contracts in one request, and ```exchange.IO("logs", ...)``` to query event logs.

##### 3. Register ABIs

Standard ERC20 methods (```balanceOf```, ```decimals```, ```allowance```, ```approve```, ```transfer``` and others) are built in and need no registration. Before calling methods of other contracts, register the contract's ABI with ```exchange.IO("abi", contractAddress, abi)```.

Common contracts can use built-in templates by passing the template name as the third argument: ```weth```, ```uniswapV3Pool```, ```uniswapV3Factory```, ```uniswapV3QuoterV2```, ```uniswapV3SwapRouter02```, ```uniswapV3PositionManager```, ```permit2``` (PancakeSwap V3 uses the same templates, aliases such as ```pancakeV3Pool``` also work). Addresses of common contracts are available from ```exchange.IO("contracts")```.

```javascript
exchange.IO("abi", poolAddress, "uniswapV3Pool")
var slot0 = exchange.IO("api", poolAddress, "slot0")
```

The ABI of other contracts can be obtained from a block explorer, for example Etherscan's V2 API (an Etherscan API key is required, ```chainid``` is the chain ID, take the ```result``` field of the response):

```url
https://api.etherscan.io/v2/api?chainid=1&module=contract&action=getabi&address=0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45&apikey=YourApiKey
```

##### 4. Send transactions

When a write method of a contract is called, the exchange object signs the transaction with the configured private key, broadcasts it and returns the transaction hash. Before sending you can replace ```api``` with ```call``` and rehearse the same call with ```exchange.IO("call", ...)```: it is simulated on the node without signing or spending gas; on failure it returns a null value and ```GetLastError()``` holds the reason given by the contract.

Taking approve as an example:

```javascript
var amount = exchange.IO("toUnits", "100", tokenAddress)   // 100 tokens, on-chain integer
var txHash = exchange.IO("api", tokenAddress, "approve", spender, amount)
```

When the method's ```stateMutability``` is ```payable```, pass one extra argument before the method arguments: the amount of native coin to attach (on-chain integer). The last argument can be an options object:

- ```gasLimit```: Gas limit. Estimated by the node (```eth_estimateGas```) when omitted. Do not use ```21000``` for contract calls; that is only enough for a plain transfer
- ```gasPrice```: Fixed gas price; when given, a legacy transaction is sent. When omitted, chains that support EIP-1559 get an EIP-1559 transaction: the tip is the larger of the node's suggestion and the tips actually paid in recent blocks, and the max fee is ```2 × baseFee + tip```
- ```nonce```: A specific nonce. Allocated automatically when omitted and kept in sync with the on-chain pending count, so consecutive sends never reuse a nonce
- ```dryRun```: When ```true```, sign without broadcasting and return fields such as ```hash```, ```raw``` (the signed transaction), ```nonce``` and ```gasLimit```, for checking the transaction or sending it through another channel

Native coin is sent with ```exchange.IO("api", "eth", "send", toAddress, amount)```, where the amount is an on-chain integer (wei). Its options also accept ```data``` (hex call data) to send a transaction ```{to, data, value}``` returned by an aggregator API as is; gas is then estimated as for a contract call. Note: a plain transfer without ```gasPrice``` bids a fixed 100 Gwei with a gas limit of 21000, usually too high on Ethereum mainnet; query ```eth_gasPrice``` first and pass it in.

To send transactions through a private channel (such as Flashbots Protect or MEV Blocker) and avoid front-running, set a node used only for broadcasting with ```exchange.IO("sendBase", nodeAddress)```.

##### 5. Wait for the transaction to be mined

```exchange.IO("waitReceipt", txHash, {timeout, confirmations})``` waits until the transaction is mined with the required confirmations and returns the receipt: ```status``` is ```1``` for success and ```0``` for failure (with the reason in ```revertReason```), and ```events``` holds the events decoded with the registered ABIs. It returns a null value on timeout.

##### 6. Nonce management, speeding up and cancelling

- ```exchange.IO("nonce")``` shows the on-chain and local nonce counts; ```exchange.IO("nonce", "sync")``` resyncs from the chain (use it after the same wallet has sent transactions elsewhere).
- When a transaction stays unmined for a long time, ```exchange.IO("speedUp", txHash)``` resends it with the same nonce and a higher fee, and ```exchange.IO("cancelTx", txHash)``` replaces it with a zero-value transaction to yourself using the same nonce. Both only work before the original transaction is mined.
- The local nonce record only exists inside the current live trading instance: instances that share one wallet cannot see each other's records and may still collide, so give each instance its own wallet.

##### Other commands

- Encoding and decoding: ```exchange.IO("encode", ...)``` encodes contract call data or values by type (like Solidity's ```abi.encode```), ```exchange.IO("encodePacked", ...)``` does packed encoding (for example a Uniswap V3 swap path), and ```exchange.IO("decode", ...)``` decodes by type.
- Signing: ```exchange.IO("sign", ...)``` signs a 32-byte hash, ```exchange.IO("signTypedData", ...)``` signs EIP-712 typed data (such as ERC-20 Permit), and ```exchange.IO("signMessage", ...)``` signs a message with EIP-191.
- Uniswap V3 math: ```exchange.IO("uniswapV3", ...)``` converts between ticks, prices and sqrtPrice, and between liquidity and token amounts.
- Hashing: ```exchange.IO("hash", "keccak256", "raw", "hex", text)``` computes keccak256 and other digests, for example method selectors and EIP-712 digests; its parameters are the same as those of the ```Encode()``` function.
- Complete examples: a swap through an aggregator (quote, build the transaction, rehearse it with ```exchange.IO("call", ...)```, send it with ```data```) is in the examples of ```exchange.IO("call", ...)``` in the syntax manual; an ERC-20 Permit signature verified by the contract is in the examples of ```exchange.IO("sign", ...)``` and ```exchange.IO("signTypedData", ...)```.

Query balances, approve and wait for the transaction (USDC on Ethereum mainnet); this code sends a real transaction and spends gas.

```javascript
function main() {
    var usdc = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"     // USDC on Ethereum mainnet
    // the contract to approve, Uniswap SwapRouter02 here
    var spender = "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45"
    var wallet = exchange.IO("address")

    // balances: standard ERC20 methods need no ABI registration
    var wei = exchange.IO("api", "eth", "eth_getBalance", wallet, "latest")
    var eth = exchange.IO("fromUnits", wei, 18)
    var usdcBalance = exchange.IO("fromUnits", exchange.IO("api", usdc, "balanceOf", wallet), usdc)
    Log("ETH:", eth, "USDC:", usdcBalance)

    // read a contract: current allowance
    var allowance = exchange.IO("api", usdc, "allowance", wallet, spender)
    Log("current allowance:", exchange.IO("fromUnits", allowance, usdc))

    // approve 100 USDC: rehearse first, then send
    var amount = exchange.IO("toUnits", "100", usdc)
    if (!exchange.IO("call", usdc, "approve", spender, amount)) {
        Log("rehearsal failed:", GetLastError())
        return
    }
    var txHash = exchange.IO("api", usdc, "approve", spender, amount)
    Log("tx hash:", txHash)

    // wait at most 3 minutes for the transaction to be mined
    var receipt = exchange.IO("waitReceipt", txHash, {timeout: 180000})
    if (receipt && receipt.status == 1) {
        Log("approved in block:", receipt.blockNumber)
    } else if (receipt) {
        Log("transaction failed:", receipt.revertReason)
    } else {
        // not mined yet: speedUp resends with a higher fee, cancelTx cancels it
        Log("not mined before timeout:", GetLastError())
    }
}
```

See also: `Web3`, `exchange.IO`

#### TRON

With ```ChainType``` set to ```TRON```, the Web3 exchange object connects to a TRON node. Usage is largely the same as on Ethereum (see `Ethereum (EVM)`): the ```exchange.IO()``` commands for registering ABIs, calling contracts, encoding and decoding, signing and switching private keys are the same, addresses use the TRON format (starting with ```T```), and TRX amounts are in sun (1 TRX = 1000000 sun). This page covers the configuration and the TRON-specific parts.

##### Configure the exchange object

- ```ChainType```: Choose ```TRON```
- ```Private Key```: Wallet private key (hex string). The key can be deployed locally on the docker, see `Key Security`
- ```Rpc Address```: HTTP address of a TRON full node, for example the official node ```https://api.trongrid.io``` (testnets: ```https://nile.trongrid.io```, ```https://api.shasta.trongrid.io```)
- ```Rpc Api Key```: TronGrid API key. Enter only the key itself; it is sent as the ```TRON-PRO-API-KEY``` request header. It works without a key, but TronGrid rate-limits keyless requests more strictly

The docker accesses TRON through the full node's HTTP API (```/wallet/...```) and no longer uses gRPC. The old gRPC address ```grpc.trongrid.io:50051``` that the form fills in by default for TRON is replaced automatically with ```https://api.trongrid.io``` (```grpc.nile.trongrid.io:50051``` and ```grpc.shasta.trongrid.io:50051``` likewise become the HTTP addresses of the corresponding testnets); any other gRPC address is rejected, so enter the node's HTTP address instead.

At runtime, ```exchange.IO("base", nodeAddress)``` switches nodes, ```exchange.IO("key", privateKey)``` switches wallets, and ```exchange.IO("address")``` returns the current wallet address (starting with ```T```). The standard functions ```exchange.GetAccount()``` and ```exchange.GetAssets()``` return the wallet's TRX balance. An account that has not been activated yet (no on-chain record) reads as 0 TRX.

##### Calling smart contracts

As on Ethereum, use ```exchange.IO("api", contractAddress, method, ...args)```: read-only methods return results directly, write methods sign and broadcast a transaction and return the transaction ID. Standard TRC20 methods are built in; for other contracts without a registered ABI, the ABI is read from the chain automatically, and only when that fails do you need to register it with ```exchange.IO("abi", contractAddress, abi)```. The last argument of a write method can be ```{gasLimit: amount}``` to set the fee limit (feeLimit, in sun).

```javascript
// USDT (TRC20) contract
var usdt = "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t"
Log(exchange.IO("api", usdt, "balanceOf", exchange.IO("address")))   // on-chain integer, 6 decimals
```

Encoding and decoding work as on Ethereum; address arguments can be written directly as ```T``` addresses:

```javascript
exchange.IO("encode", "address", "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t")
// 000000000000000000000000a614f803b6fd780986a42c78ec9c7f77e6ded13c
exchange.IO("encodePacked", "address", "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t")
// a614f803b6fd780986a42c78ec9c7f77e6ded13c
exchange.IO("decode", "string",
    "0000000000000000000000000000000000000000000000000000000000000020" +
    "000000000000000000000000000000000000000000000000000000000000000a" +
    "5465746865722055534400000000000000000000000000000000000000000000")
// Tether USD
```

##### Calling TRON node methods

```exchange.IO("api", "tron", method, ...args)``` calls TRON node methods; method names are case-insensitive (except ```send```, which must be lower case). Methods that need a signature (transfers, triggering contracts, etc.) are signed and broadcast automatically. Common methods:

| Method | Arguments | Description |
| - | - | - |
| ```send``` | to address, amount (sun) | Send TRX from the current wallet |
| ```Transfer``` | from address, to address, amount (sun) | Send TRX; the from address must be the current wallet |
| ```GetAccount``` | address | Account information |
| ```GetAccountResource``` | address | The account's energy and bandwidth resources |
| ```GetContractABI``` | contract address | The contract's on-chain ABI |
| ```GetAssetIssueByName``` | name | TRC10 asset information |
| ```GetNowBlock``` | none | Current block |
| ```GetBlockByNum``` | block height | A given block |
| ```GetTransactionByID``` | transaction ID | Transaction content |
| ```GetTransactionInfoByID``` | transaction ID | Execution result of a transaction (fees, energy used, logs, etc.) |
| ```GetChainParameters``` | none | Chain parameters |
| ```TriggerConstantContract``` | caller address (may be empty), contract address, method signature, argument values (see below the table) | Read-only contract call; the result is in ```constant_result``` |
| ```TRC20ContractBalance``` | address, contract address | TRC20 balance (on-chain integer) |
| ```TRC20GetName```, ```TRC20GetSymbol```, ```TRC20GetDecimals``` | contract address | Name, symbol and decimals of a TRC20 token |
| ```TRC20Send```, ```TRC20Approve``` | from address, to or spender address, contract address, amount, feeLimit | TRC20 transfer and approval |
| ```TRC20Call``` | caller address (may be empty), contract address, call data, read-only flag, feeLimit | Call a contract with raw call data |
| ```ParseTRC20NumericProperty```, ```ParseTRC20StringProperty``` | hex data | Parse numbers and strings returned by TRC20 |

For ```TriggerConstantContract```, the method signature includes the parameter types (e.g. ```"balanceOf(address)"```) and the argument values are a JSON array string (e.g. ```'["T..."]'```, an empty string for no arguments); the returned ```constant_result``` holds hex strings that can be decoded with ```exchange.IO("decode", ...)```.

Node endpoints not in the table can be called with a path and a request body: ```exchange.IO("api", "tron", "/wallet/endpointName", {body})```.

##### Differences from Ethereum

The following commands only work on Ethereum (EVM) and report an error on TRON: ```call```, ```multicall```, ```logs```, ```waitReceipt```, ```nonce```, ```speedUp```, ```cancelTx```, ```contracts``` and ```sendBase```. Multiple fallback nodes also only apply to Ethereum: TRON takes a single node address, and a comma-separated list of nodes reports an error. On TRON, simulate a contract call with the node method ```TriggerConstantContract```, and query a transaction's execution result with ```GetTransactionInfoByID```.

```toUnits```, ```fromUnits```, ```uniswapV3```, the encoding and decoding commands and the signing commands work on TRON as well, and a TRC20 contract address can be passed as the decimals:

```javascript
var usdt = "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t"
var raw = exchange.IO("api", usdt, "balanceOf", exchange.IO("address"))
Log(exchange.IO("fromUnits", raw, usdt))   // readable amount, using the contract's decimals()
```

When the node rejects a contract call at validation time (for example because the contract does not exist), the error carries the node's reason, such as ```tron contract call rejected (CONTRACT_VALIDATE_ERROR): Smart contract is not exist.```; a contract execution failure (revert) reports ```tron contract execution failed``` with the reason.

##### Signing

```exchange.IO("hash", "sign", "hex", "hex", txHash)``` signs a 32-byte hash with the current private key and returns the 65-byte signature ```r‖s‖v``` (v is 0 or 1); other ```hash``` algorithms (such as ```sha256```) compute digests, the same as the ```Encode()``` function. When r, s and v (v being 27 or 28) are needed separately for contract verification, use ```exchange.IO("sign", ...)```, see the `Web3` exchange page of the syntax manual.

Query TRX and USDT balances and read token information.

```javascript
function main() {
    var usdt = "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t"
    var wallet = exchange.IO("address")

    // TRX balance (standard function, in TRX)
    Log("account:", exchange.GetAccount())

    // USDT balance: an on-chain integer, scale it by the decimals
    var raw = exchange.IO("api", "tron", "TRC20ContractBalance", wallet, usdt)
    var decimals = exchange.IO("api", "tron", "TRC20GetDecimals", usdt)
    Log("USDT:", raw / Math.pow(10, decimals))

    // read-only call of name() (selector 0x06fdde03) with TRC20Call, then parse the returned string
    var ret = exchange.IO("api", "tron", "TRC20Call", "", usdt, "0x06fdde03", true, 0)
    // constant_result holds hex strings, parse them directly
    Log("name:", exchange.IO("api", "tron", "ParseTRC20StringProperty", ret.constant_result[0]))
}
```

Read several contract methods at once with a Multicall contract.

```javascript
function main() {
    var usdt = "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t"
    var multicall = "TGXuuKAb4bnrn137u39EKbYzKNXvdCes98"
    var wallet = exchange.IO("address")

    var calls = [
        [usdt, exchange.IO("encode", usdt, "name")],
        [usdt, exchange.IO("encode", usdt, "decimals")],
        [usdt, exchange.IO("encode", usdt, "balanceOf", wallet)]
    ]
    // register the aggregate method of the Multicall contract
    exchange.IO("abi", multicall, `[{
        "inputs": [{
            "components": [
                {"internalType": "address", "name": "target", "type": "address"},
                {"internalType": "bytes", "name": "callData", "type": "bytes"}
            ],
            "internalType": "struct TronMulticall.Call[]", "name": "calls", "type": "tuple[]"
        }],
        "name": "aggregate",
        "outputs": [
            {"internalType": "uint256", "name": "blockNumber", "type": "uint256"},
            {"internalType": "bytes[]", "name": "returnData", "type": "bytes[]"}
        ],
        "stateMutability": "view", "type": "function"
    }]`)
    var ret = exchange.IO("api", multicall, "aggregate", calls)
    Log("name:", exchange.IO("decode", "string", ret.returnData[0]))
    Log("decimals:", exchange.IO("decode", "uint8", ret.returnData[1]))
    Log("balanceOf:", exchange.IO("decode", "uint256", ret.returnData[2]))
}
```

See also: `Web3`, `exchange.IO`

## Data and Research

Two tools for researching market data, the data explorer for querying and visualizing financial data with SQL and the alpha factor analysis tool for computing and testing factors with formulas.

### Data Explorer

**datadata**, developed by FMZ Quant, is a quantitative financial data platform. The [Data Explorer](https://www.fmz.com/m/database) module of FMZ integrates its services and features, and FMZ users can use it without registering a separate **datadata** account. Analyze large amounts of data with SQL, build various charts through a visual interface and share them with your team. For examples, see the [Data Explorer articles](https://www.fmz.com/digest-topic/10370).

- Data sources: the data sources provided by datadata are updated continuously in real time and cover many kinds of data; you can also upload CSV files as private data sources and preview them on the Data Explorer page.
- Queries: query data with SQL, with query parameters; results can be downloaded as CSV or JSON files.
- Saving research: click "Save" at the top right to save the current SQL query to the resource list of your Data Explorer (the resource list button is to the left of "Save").
- Visualization: query results can be shown as tables or with various visualization components.
- Sharing research: as a public link, embed code (e.g. in a community post), an embedded web page, a data link or a preview image link. A "data link" also feeds the data straight to strategies, in both backtests and live robots.

### Alpha Factor Analysis Tool

The [alpha factor analysis tool](https://www.fmz.com/m/alpha) computes formulas over market time series quickly, to test trading ideas. The formulas follow the market calculation methods of ```worldquant```'s public [```alpha101```](https://github.com/yli188/WorldQuant_alpha101_code/blob/master/101%20Formulaic%20Alphas.pdf), are largely compatible with its syntax (unimplemented parts are noted) and add enhancements.

One formula can output several results at once when written as a list: for example ```[sma(close, 10), sma(high, 30)]``` plots two lines on the chart. Without time series data the tool also works as a simple calculator. The functions, operators and available input data are described in the two sections below.

#### Functions and Operators

What can be used in formulas of the alpha factor analysis tool. Expressions are case-insensitive; below, ```x``` and ```y``` are time series, ```d``` is a number of periods, and ```{}``` is a placeholder.

##### Operators

```+```, ```-```, ```*```, ```/```, ```>``` and ```<``` have their standard meaning; ```==``` tests equality, ```||``` is logical or, and ```x ? y : z``` is the ternary conditional operator.

##### Functions

| Function | Description |
| - | - |
| ```abs(x)```, ```log(x)```, ```sign(x)``` | Absolute value, logarithm, sign |
| ```rank(x)``` | Cross-sectional percentile rank; needs a pool of instruments, and with a single one returns the value unchanged |
| ```delay(x, d)``` | Value of x d periods ago |
| ```sma(x, d)``` | Simple moving average of x over d periods |
| ```correlation(x, y, d)``` | Correlation of x and y over the past d periods |
| ```covariance(x, y, d)``` | Covariance of x and y over the past d periods |
| ```scale(x, a)``` | Normalize so that ```sum(abs(x)) = a``` (a defaults to 1) |
| ```delta(x, d)``` | Current value of x minus its value d periods ago |
| ```signedpower(x, a)``` | ```x^a``` |
| ```decay_linear(x, d)``` | Weighted moving average of x over d periods with weights d, d-1, …, 1 (normalized) |
| ```indneutralize(x, g)``` | Neutralize by industry classification g; not supported yet |
| ```ts_{O}(x, d)``` | Apply operation O (min, max, ..., see the rows below) to the past d periods of x; d is converted to an integer |
| ```ts_min(x, d)```, ```min(x, d)``` | Minimum over the past d periods |
| ```ts_max(x, d)```, ```max(x, d)``` | Maximum over the past d periods |
| ```ts_argmin(x, d)``` | Position of ```ts_min(x, d)``` |
| ```ts_argmax(x, d)``` | Position of ```ts_max(x, d)``` |
| ```ts_rank(x, d)``` | Rank (percentile) of x within the past d periods |
| ```sum(x, d)``` | Sum over the past d periods |
| ```product(x, d)``` | Product over the past d periods |
| ```stddev(x, d)``` | Standard deviation over the past d periods |

#### Input Data

Market data that formulas can refer to. Input data is case-insensitive and defaults to the instrument selected on the web page; an instrument can also be given directly, e.g. ```binance.ada_bnb```.

| Data | Description |
| - | - |
| ```returns``` | Return of the close price |
| ```open```, ```close```, ```high```, ```low```, ```volume``` | Open, close, high, low and volume of the period |
| ```vwap``` | Volume-weighted average price; not implemented yet, currently the close price |
| ```cap``` | Total market capitalization; not implemented yet |
| ```IndClass``` | Industry classification; not implemented yet |

## Extended API Interface

The platform's HTTP interface (```https://www.fmz.com/api/v1```) for scripts, scheduled jobs and other programs: query the account, dockers, strategies and robots, create, restart and stop robots, send interactive commands to robots, and so on.

To operate the platform interactively from an AI assistant (Claude Code, Cursor, ...), prefer AI Integration (the MCP service, see `AI Integration`): it has more tools, takes named parameters, and can be authorized by permission category. Both can use the same API KEY.

Steps: create an API KEY (`Create ApiKey`), send requests as described in `Authentication Methods`, and look up methods and parameters in `Extended API Interface Details`.

### AI Integration

Connect FMZ to an AI coding assistant (AI agent) such as Claude Code, Codex or Cursor, and you can write strategies, run backtests, create and manage live trading, and read logs and profit just by talking to it. The assistant reaches these functions through the platform's MCP (Model Context Protocol) service, with an API KEY created for it alone; you choose its permissions when you approve it and can change or revoke them at any time.

#### Connect with one sentence

Tell your AI assistant:

```text
Read https://www.fmz.com/agent/setup.md and connect to FMZ
```

The assistant follows that page; your only step is one click in the browser:

1. The assistant requests authorization and shows you a link such as ```https://www.fmz.com/agent/authorize?code=XXXX-XXXX```, valid for 10 minutes.
2. Open it in a browser where you are logged in to FMZ, check the requester's name and the permissions, and approve. You can untick permissions you do not want to grant.
3. The assistant receives an API KEY, writes it into its own MCP configuration and connects. From then on you can simply ask it to "list my live trading" or "backtest this strategy".

The assistant names the key "name @ machine" (for example ```Claude Code @ MacBook```). When a request with the same name is approved again, the old key is revoked and replaced, so connecting again does not pile up keys.

#### Permissions

| Permission | Allows | Default |
| - | - | - |
| read | Lists and details of strategies, robots, dockers and exchange accounts; logs, messages, account summary (no secrets) | Yes |
| backtest | Start, query and stop backtests | Yes |
| write | Save strategies and versions, groups, alert switches; change the configuration of stopped live trading | Yes |
| trade | Create, start and stop live trading, send interactive commands (costs balance and places real orders) | Yes |
| danger | Delete strategies, live trading and nodes; publish strategies | No |

```danger``` is never granted by default: the assistant has to request it explicitly and you have to tick it on the approval page. Before calling a ```[trade]``` or ```[danger]``` tool the assistant should ask you first.

#### Manual configuration

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

#### Install the skills (recommended)

The skills are knowledge packs written for AI assistants: platform workflow, the full API reference, how to write strategies in each language, backtesting and indicators. With them installed the assistant writes noticeably more accurate strategies. In a terminal:

```bash
npx skills add fmzquant/skills --global --yes -a claude-code
```

Put your assistant's name after ```-a``` (claude-code, codex, cursor, gemini-cli, ...). They can also be read on GitHub: ```https://github.com/fmzquant/skills```.

#### Available tools

Once connected the assistant can use the tools below; the list the assistant sees is authoritative:

- ```read```: ```ping```, ```get_account_summary```, ```list_exchanges```, ```list_platforms```, ```list_nodes```, ```list_strategies```, ```get_strategy```, ```list_strategy_versions```, ```get_strategy_version```, ```list_robots```, ```get_robot```, ```get_robot_logs```, ```get_robot_profit```, ```get_robot_output```, ```list_messages```, ```list_groups```, ```revoke_my_key```
- ```backtest```: ```run_backtest```, ```get_backtest```, ```list_backtests```, ```stop_backtest```
- ```write```: ```check_strategy```, ```save_strategy```, ```save_strategy_version```, ```delete_strategy_version```, ```update_robot```, ```save_group```, ```move_to_group```, ```delete_group```, ```set_robot_alert```, ```set_node_alert```, ```delete_messages```
- ```trade```: ```create_robot```, ```start_robot```, ```stop_robot```, ```restart_robot```, ```send_robot_command```, and the trading terminal plugin tools ```plugin_*``` (market data, orders, ...)
- ```danger```: ```delete_strategy```, ```delete_robot```, ```delete_node```, ```publish_strategy```

A typical session: ```list_platforms``` and ```list_nodes``` to see which exchange accounts and nodes the account has; ```save_strategy``` to save a strategy and ```check_strategy``` to check it; ```run_backtest``` and ```get_backtest``` to backtest; then ```create_robot``` to go live and ```get_robot``` / ```get_robot_logs``` to watch it.

#### Security and management

- Exchange API KEYs never pass through the assistant: add them on the Exchanges page of the website and the assistant picks them by id. No tool result ever contains a secret.
- At ```https://www.fmz.com/m/account#apikey``` you can see the key the assistant uses, change its permissions or lock it. Besides the permission names above, permissions can list tool names, and ```!tool_name``` excludes one tool.
- When you are done, ask the assistant to call ```revoke_my_key``` to revoke its own key, or delete it on that page.
- ```stop_robot``` stops live trading; it does not close positions.
- The first time the assistant creates live trading, backtest first and then run on a demo account or with a small amount.

#### Common problems

- No online node: live trading needs at least one online node, see Platform Basics → Nodes.
- Too many backtests: concurrent backtests are limited; have the assistant ```stop_backtest``` the ones it no longer needs.
- The assistant says a tool is missing or a call is refused: the key lacks that permission; change it on the API KEY page and reconnect.

The same API key also works with the `Extended API` for scripts and schedulers; prefer MCP wherever it can be used.

### Create ApiKey

On the [Account Settings → API KEY](https://www.fmz.com/m/account#apikey) page (```/m/account#apikey```), click "Create New ApiKey" to get an ```AccessKey``` and a ```SecretKey```. The ```SecretKey``` carries every permission of the key; keep it secret. The same page lets you change the permissions of existing keys, or disable and delete them.

#### Permissions

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

### Authentication Methods

The extended API supports two authentication methods: signature authentication and direct authentication.

- `Signature authentication`: the request parameters are signed with the ```SecretKey```, which itself never travels over the network. Programs should use this method.
- `Direct verification`: the ```SecretKey``` is put into the request URL itself; meant for webhooks such as TradingView that accept only a single URL.

#### Token Authentication

Signature authentication signs the request parameters with an MD5 hash that includes the ```SecretKey```, so the ```SecretKey``` itself never travels over the network; programs calling the extended API should use it.

##### Request format

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

##### Signature

Concatenate the string below, where ```args``` is the exact JSON string being submitted:

```plaintext
version + "|" + method + "|" + args + "|" + nonce + "|" + secretKey
```

Compute the MD5 of the result and use its 32-character lowercase hexadecimal form as ```sign```.

##### Python example

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

##### Go example

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

#### Direct Verification

Puts the ```secret_key``` into the request parameters instead of computing a signature. This produces a fixed URL that can be entered into webhooks such as TradingView that accept only a single URL.

> **Security note**: a ```secret_key``` in a URL ends up in browser history, proxy and server access logs, and the webhook provider's configuration; anyone who obtains the URL can call the API with this key's permissions. Use direct verification only for ```CommandRobot``` webhooks, and create a dedicated API KEY for it that is granted ```CommandRobot``` only (see `Create ApiKey`). If it leaks, delete that API KEY immediately.

The request parameters are ```access_key```, ```secret_key```, ```method``` and ```args``` (a JSON array, URL-encoded); ```version```, ```nonce``` and ```sign``` are not needed. ```CommandRobot``` skips the ```nonce``` check; other methods are still checked: without a ```nonce``` the server uses the current time (to the second), so a second call within the same second returns a nonce error (```code``` 3).

For example, with an API KEY whose ```AccessKey``` is ```xxx``` and ```SecretKey``` is ```yyy```, opening the URL below sends the interactive command ```ok12345``` to the robot with ID ```186515```:

```plaintext
https://www.fmz.com/api/v1?access_key=xxx&secret_key=yyy&method=CommandRobot&args=%5B186515%2C%22ok12345%22%5D
```

##### Receiving a webhook body

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

##### Python and Go examples

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

### Extended API Interface Details

All methods are called through ```https://www.fmz.com/api/v1```; for the request format and signature see `Token Authentication`, for the response structure and error codes see `Extended API Interface Return Codes`. The ```api()``` used in the examples on the method pages is the function from the Python example on the signature authentication page.

#### Method overview

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

#### Passing parameters

```args``` can be written in two ways:

- Array: positional parameters in the order of the table above, e.g. ```[123, "ok"]```. Positional calls accept only certain numbers of arguments; any other count returns a ```Params number mismatch``` error:
  - GetNodeList, GetPlatformList: 0 or 2.
  - GetStrategyList: 0, 6, 7 or 8; with no arguments ```language``` is ```1``` (only Python strategies), see `GetStrategyList`.
  - GetRobotList: 0, 1, 3, 5, 6, 7 or 8; a single argument is taken as ```appId```.
  - GetRobotLogs: 15 to 19 (with 15 the status bar is not queried).
  - RestartRobot, DeleteRobot: 1 or 2; when DeleteRobot gets only ```robotId```, ```removeLog``` is ```false```.
- Object: values by parameter name, e.g. ```{"robotId": 123, "cmd": "ok"}```. Names are case-insensitive and underscores are ignored; omitted parameters take their defaults. Recommended for methods with many optional parameters (GetRobotList, GetRobotLogs, GetStrategyList).

#### Robot configuration (settings)

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

##### GetAccount

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

###### Example response

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

##### GetNodeList

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

###### Example response

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

##### DeleteNode

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

##### GetExchangeList

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

###### Example response (isSummary false)

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

###### Example response (isSummary true)

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

##### GetPlatformList

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

###### Example response

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

##### GetStrategyList

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

###### Parameter values

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

###### Example response

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

##### GetRobotGroupList

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

###### Example response

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

##### GetRobotList

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

###### Example response

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

##### GetRobotDetail

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

###### Example response

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

##### GetRobotLogs

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

###### logs[0]: strategy log

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

###### logs[1]: profit log

The same as the profit entries of the strategy log; each entry is log ID, profit value, timestamp. In ```[202, 2515.44, 1575896700315]```, ```202``` is the log ID, ```2515.44``` the profit and ```1575896700315``` the timestamp:

```plaintext
"Arr": [
    [202, 2515.44, 1575896700315],
    [201, 1415.44, 1575896341568]
]
```

###### logs[2]: chart log

Each entry is log ID, chart series index, data (JSON text). In ```[23637, 0, "{\"close\":648, ...}"]```, ```23637``` is the log ID, ```0``` the series index, and the JSON text is one K-line on the chart:

```plaintext
"Arr": [
    [23637, 0, "{\"close\":648,\"high\":650.5,\"low\":647,\"open\":650,\"x\":1575960300000}"],
    [23636, 5, "{\"x\":1575960300000,\"y\":3.0735}"]
]
```

###### Example response

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

##### NewRobot

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

##### RestartRobot

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

##### StopRobot

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

##### CommandRobot

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

##### DeleteRobot

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

##### PluginRun

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

###### Example response

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

##### pub

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

###### Delivery rules

- Subscribe first, then push: the robot's first ```GetChannelData(channel)``` call subscribes to the channel (and returns a null value); the subscription is reported with the docker's heartbeat, so the external system can push successfully only after a short while. Requests fail while no robot subscribes.
- The message is delivered to the docker of the ```robot``` robot, and every robot on that docker subscribed to the same channel receives it; robots on other dockers do not.
- A channel keeps only the latest message, with no queue: ```GetChannelData()``` returns the most recent one each time, and reading does not clear it. To tell new messages from old ones, include an increasing number or a timestamp in the message.
- Each robot can subscribe to at most 10 channels (other robots' channels included); beyond that ```GetChannelData()``` returns a null value and logs the error ```channel subscriber exceed limit```.
- The robot receives a **string** (the raw request body). When the body is JSON text, the strategy has to parse it again.

###### Example push request

An external system pushes a message:

```bash
curl -X POST \
     "https://www.fmz.com/api/v1?method=pub&robot=123456&channel=6BC42A119B5DBFA2188A8279DA3B5C30" \
     -d '{"id": 1, "action": "buy", "symbol": "BTC_USDT"}'
```

In TradingView, put the URL above in the alert's webhook URL; the alert message becomes the request body.

###### Example response

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

### Extended API Interface Return Codes

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

### Live Trading Status Codes

The ```status``` field in the data returned by ```GetRobotList```, ```GetRobotDetail``` and ```GetRobotLogs``` is the robot status code, with these values.

| Status | Code |
| - | - |
| Preparing (queued, compiling) | 0 |
| Running | 1 |
| Stopping | 2 |
| Exited | 3 |
| Stopped | 4 |
| Strategy error | 5 |

#### Return values when a start fails

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
