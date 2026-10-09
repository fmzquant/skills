# FMZ platform user guide

Generated from https://www.fmz.com/user-guide: how the platform works (nodes, robots, strategies, templates, backtesting, extended API, MCP), as written for people; agents use it for concepts and limits.

## Getting Started

Start here: what the platform is, the five steps from adding an exchange to running a live robot, and keeping API keys safe.

### Welcome to FMZ Quant Trading Platform

FMZ Quant is a quantitative trading platform: write strategies in the browser, backtest them online, then run them as live robots on a docker you deploy yourself or rent. You can also learn from, share and rent out strategies in the strategy square, or show your own live robots publicly.

**Supported markets**
- Crypto: spot, futures and perpetual contracts on the major centralized exchanges, plus some on-chain exchanges.
- Securities and futures: Futu Securities, Interactive Brokers and others.
- Exchanges the platform has not integrated yet can be connected yourself through the general protocol (see Platform Basics → Exchange → General Protocol).

**Strategy languages**
JavaScript, TypeScript, Python, Rust, PINE, MyLanguage, Blockly visual programming and Workflow; see Writing Strategies → Programming Languages.

**AI assistance**
- The strategy editor has a built-in AI assistant that generates, explains and edits strategy code and analyzes backtest results (see Development Tools → Strategy Editor → AI Assistant).
- You can also connect the external AI assistant you already use to the platform and manage strategies, backtests and live robots through conversation (see Integrations → AI Integration).

**Dashboard**
After signing up and logging in, open the [dashboard](https://www.fmz.com/m):

![Dashboard overview](https://www.fmz.com/upload/asset/2e4e636a6fe51c8f620e8.png)

- [Control Center](https://www.fmz.com/m/dashboard): account overview and shortcuts. Running a live robot takes three things: an online docker, a strategy and a configured exchange account.
- [Live Trading](https://www.fmz.com/m/robots): create, manage and control live robots. A live robot is a running instance of a strategy program.
- [Strategy Library](https://www.fmz.com/m/strategies): write, save and group strategies in any supported language.
- [Docker](https://www.fmz.com/m/nodes): deploy and manage the docker programs that run strategies.
- [Exchange](https://www.fmz.com/m/platforms): add and manage exchange accounts.

**Public resources**
- [Strategy Square](https://www.fmz.com/square): strategies shared publicly or listed for rent, good for learning and reference.
- [Live](https://www.fmz.com/live): live robots that users show publicly.
- [Digest](https://www.fmz.com/digest): original articles by the platform.
- [Community](https://www.fmz.com/bbs): the forum for discussing quantitative trading.
- [Crowdsourcing](https://www.fmz.com/markets): post and take on strategy development requests.
- [Classes](https://www.fmz.com/class): video tutorials.
- [API Docs](https://www.fmz.com/api): the API syntax manual for writing strategies.

**Getting help**
Post in the community, submit a ticket from the dashboard, or contact the administrators in the [Telegram](https://t.me/fmzquant_cn) group.

### Quick Start

Five steps take you from adding an exchange to running your first live robot; each step names the chapter with the details.

**1. Add an exchange account**

Add the exchange's API key on the Exchange page of the dashboard. Enable only read and trade permissions, never withdrawal; for a first try, use the exchange's demo trading or a small sub-account. See "Platform Basics → Exchange" and "Getting Started → Key Security".

**2. Deploy a docker**

The docker is the program that runs strategies; every live robot runs on one. Rent a docker provided by the platform with one click, or deploy it on your own server. See "Platform Basics → Docker".

**3. Write a strategy**

Create a strategy in the Strategy Library and pick a programming language. A strategy is an entry function ```main()``` with a main loop: each round fetches market data, computes signals, places orders and sleeps until the next round. See "Writing Strategies"; its "Strategy Structure" chapter has main-loop templates for every language and a quick reference of all API functions. You can also start from a public strategy in the strategy square.

**4. Backtest**

On the strategy editing page, choose the exchange, trading pair, time range and K-line period, then start a backtest and check the profit curve, trades and logs. Go live only after the backtest looks right. See "Backtesting System".

**5. Create a live robot**

On the Live Trading page of the dashboard, create a robot with the strategy, a docker and the exchange account, set the strategy parameters and start it. Live robots are billed by the hour, so the account needs a balance before you start; see "Platform Basics → Account and Billing → Live Robot Billing and Top-up". Its status, logs and profit are on the robot page, and errors can be pushed to your phone. See "Platform Basics → Live Trading".

Read on as needed: "Development Tools" covers editing and debugging, "Advanced Topics" covers rate limiting, communication between robots, multi-threading and on-chain trading, and "Integrations" covers driving the platform from programs or AI assistants.

### Key Security

A leaked exchange key costs you the assets in that exchange account. Before configuring an exchange account, go through this checklist:

- **Trade permission only**: enable only read and trade permissions for the API key, and **never enable withdrawal**.
- **Bind an IP whitelist**: on the exchange, bind the API key to the outbound IP of the server running your docker. If the server has several IPs, pin the outbound IP with the docker's ```-I``` option (see Platform Basics → Docker → Command-Line Options).
- **Keep private keys local**: if the exchange supports asymmetric keys such as RSA, prefer them, and keep the private key as a credential file on the docker's machine so that the platform stores only the file path (see Platform Basics → Exchange → Local Credential Files).
- **Start small**: run a new strategy against the exchange's demo trading or a small sub-account first.
- **Do not publish secrets**: if the strategy code, parameters or description contain keys, account names or similar information, do not publish or sell the strategy.

How the platform stores keys: encrypted fields such as keys on the exchange configuration page are encrypted in the browser with your platform account password before upload, so the platform never stores them in plain text; only a docker started with that account password can decrypt them locally. Changing the platform account password therefore invalidates existing exchange configurations; see Platform Basics → Live Trading → Common Causes of Live Trading Errors and Abnormal Exits for what to do.

## Platform Basics

The basic objects of the platform: account and billing, exchange accounts, the docker that runs strategies, the strategy library and live robots.

### Account and Billing

How live robots are billed, how to top up, and how to hand some live robots to other people with sub-accounts. Other account settings (push notifications, two-factor authentication, API keys, etc.) are on the [account settings page](https://www.fmz.com/m/account).

#### Live Robot Billing and Top-up

**Billing**
- Live robots are billed by the hour at 0.05 USD per robot per hour; a partial hour counts as a full hour.
- Billing starts when the robot is created, and starting it prepays the first hour, so a robot cannot start if the account balance is insufficient. Stopping or restarting a robot does not bill it twice.
- If the balance runs out while a robot is running, the platform stops the robot; when a rented strategy expires, the robots using it are stopped as well.
- Servers rented with one-click docker rental are billed separately from live robots (see Platform Basics → Docker → Deploy Docker → One-Click Docker Rental).

**Bills and balance alerts**
- The [billing page](https://www.fmz.com/m/billing) shows the balance, top-up records and every billing item.
- Under [balance alert in account settings](https://www.fmz.com/m/account#alertthreshold), set an alert threshold: when the available balance drops below it you get an email and WeChat notification (at most once every 24 hours unless you top up or change the setting); 0 turns the alert off.

**Top-up**
Choose the payment method and amount on the [billing page](https://www.fmz.com/m/billing). When topping up with ```USDT```, check carefully:
- The transfer network must match the network selected on the billing page; TRC20, ERC20 and BSC are supported. ERC20 and BSC addresses both start with ```0x``` and look the same, which makes them the easiest to mix up.
- The asset is ```USDT```.
- The destination address is the one shown on the billing page.

#### Sub-accounts

A sub-account lets other people view and operate some of your live robots without giving them the main account.

**Create a sub-account**
On the [account settings page](https://www.fmz.com/m/account#shadowmember), open the sub-account tab, select the live robots the sub-account may access under operation permissions, enter its username and login password, and create it. Sub-accounts are listed on the same page, where you can edit, lock/unlock or delete them.

![Sub-account settings](https://www.fmz.com/upload/asset/2e46d725dbe6b471f1b33.png)

**Permissions**
A sub-account sees only the live robots authorized to it. On those robots it can change parameters, stop and restart, but it cannot change the exchange objects configured for the robot.

**Typical uses**
- A quant team sharing the management of several live robots.
- Letting the renter of a strategy help debug a live robot.

### Exchange

The [Exchange](https://www.fmz.com/m/platforms) page manages the exchange accounts you have configured. On FMZ, an "exchange" is an account a strategy program can operate: it holds the keys of the funding account together with the protocol and API wrapper used to talk to that exchange.

Click "Add Exchange" on the exchange management page to open the [add exchange page](https://www.fmz.com/m/add-platform), then choose the exchange and fill in its configuration. Encrypted fields such as keys are encrypted in the browser before being saved to the platform, so the platform never stores them in plain text (see Getting Started → Key Security).

**Exchange objects**
In strategy code a configured exchange is the exchange object `exchange`. A backtest or live robot can be configured with several exchanges; in code they form the exchange object array `exchanges`.

**Using an exchange object**
Strategy code reads the account and market data, places orders and cancels them through the exchange object. In ```JavaScript```:

```js
function main() {
    let account = exchange.GetAccount()    // query account information
    let ticker = exchange.GetTicker()      // get the ticker
    let id = exchange.Buy(1000, 1)         // price 1000, amount 1
    if (id) {
        exchange.CancelOrder(id)           // an order Id exists only if the order was placed; cancel it if still open
    }
}
```

The rest of this chapter:
- General Protocol: connect an exchange the platform has not integrated yet.
- Local Credential Files: keep private keys and other secrets only on the docker's machine.
- Exchange-Specific Notes: configuration steps and behavior differences of individual exchanges.

#### General Protocol

For exchange API interfaces that have not yet been encapsulated and integrated by the FMZ Quant Trading Platform, you can access them by writing general protocol plugin programs.

![General Protocol Configuration Screenshot](https://www.fmz.com/upload/asset/2e43b059b3ec9f42ded6e.png)

This general protocol can be used to access any exchange that provides API interfaces, supporting the following two protocols:
- ```REST``` Protocol: [Reference Documentation](https://www.fmz.com/digest-topic/10518).
- ```FIX``` Protocol: [Reference Project](https://github.com/fmzquant/fixc).

The difference between ```FIX``` protocol plugin programs and ```REST``` protocol plugin programs lies only in the interaction method between the plugin program and the exchange interface. The interaction method, data format, and other implementation details between the protocol plugin program and the FMZ Quant docker program are exactly the same. For specific implementation, please refer to the examples in the above links.

#### Local Credential Files

When configuring an exchange, every masked encrypted input (Secret Key, private key, password, etc.) can hold a credential file path ```file:///name.txt``` instead of the secret itself. When the live robot runs, the docker reads that file on its own machine and uses the content as the value. The private key then exists only on the docker's machine, and the platform stores nothing but a path.

**Path rules**
- The path is resolved relative to **this robot's directory** ```logs/storage/<robot ID>/``` (```logs``` is under the docker's working directory). For robot ID ```123456```, ```file:///rsaKey.txt``` means ```logs/storage/123456/rsaKey.txt```.
- Subdirectories are allowed, e.g. ```file:///keys/rsaKey.txt```.
- Only the ```.txt``` suffix is recognized; with any other suffix the text is not read as a file but used literally as the configuration value.
- The path cannot be absolute, cannot contain ```..```, and after resolution cannot leave the robot directory (symbolic links pointing outside are rejected too).
- Credential files are read from each robot's own directory, so when several robots use the same exchange configuration, every robot directory needs its own copy.
- If the file cannot be read, the robot fails to start with an error containing ```read key file```; an invalid path fails with ```key file path must be relative and cannot contain '..'``` or ```key file path escapes the robot directory```.

**Example: an RSA key**
For an exchange that supports ```RSA KEY``` authentication:
1. Generate an RSA public/private key pair, e.g. a PKCS#8 pair with ```openssl```.
2. Create an ```RSA KEY``` on the exchange and upload the public key from step 1.
3. Configure the exchange on the platform: put the exchange's ```RSA KEY``` in ```Access Key``` and ```file:///rsaKey.txt``` in ```Secret Key```.
4. Create the live robot and note its ID (e.g. ```123456```).
5. Save the private key from step 1 as ```logs/storage/123456/rsaKey.txt```, then start (or restart) the robot.

See the [video walkthrough](https://www.bilibili.com/video/BV1UM41147Jj/) (Chinese) for the full process.

#### Exchange-Specific Notes

Configuration steps of individual exchanges and the places where they behave differently from the general API. Exchanges not listed here follow the general descriptions in the syntax manual; the switches each exchange supports through ```exchange.IO()``` are listed under `exchange.IO`.

##### Securities and Futures

**Futu Securities**

Futu NiuNiu live trading and paper trading are supported. [```FutuOpenD```](https://www.futunn.com/download/OpenAPI?lang=zh-CN) must run on the docker's machine. For configuring the exchange object and running ```FutuOpenD```, see the [Futu Securities configuration guide](https://www.fmz.com/bbs-topic/10185).

When ```FutuOpenD``` is used for paper trading, some stock codes are not supported and cannot be traded (paper trading works in the Futu NiuNiu mobile app).

- Call frequency
  ```GetOrder```, ```GetOrders```, ```GetPositions``` and ```GetAccount``` use **cached data** by default, so their call frequency is not limited; ```FutuOpenD``` updates the cache automatically when new data arrives.
  ```exchange.IO("refresh", true)``` disables the cache; without the cache the limit is **at most 10 queries every 30 seconds**, and exceeding it returns an error.

- Stock codes
  The format is ```code.market```, e.g. ```600519.SH```. Market suffixes:
  - HK: Hong Kong stocks
  - US: US stocks
  - SH: Shanghai
  - SZ: Shenzhen
  - SG: Singapore futures
  - JP: Japan futures

  Set the stock code with ```exchange.SetContractType()``` in the strategy, for example:

  ```js
  function main() {
      var info = exchange.SetContractType("600519.SH")    // set the stock 600519.SH (Moutai); the account switches to the mainland market
      Log(info)
      Log(exchange.GetAccount())                          // the current stock is Moutai, so GetAccount returns the mainland market assets
      Log(exchange.GetTicker())                           // current quote of Moutai
  }
  ```

  ```python
  def main():
      info = exchange.SetContractType("600519.SH")
      Log(info)
      Log(exchange.GetAccount())
      Log(exchange.GetTicker())
  ```

  ```rust
  fn main() {
      let info = exchange.SetContractType("600519.SH");    // set the stock 600519.SH (Moutai); the account switches to the mainland market
      Log!(info);
      Log!(exchange.GetAccount());                          // the current stock is Moutai, so GetAccount returns the mainland market assets
      Log!(exchange.GetTicker(None));                       // current quote of Moutai
  }
  ```

  ```exchange.SetDirection``` (trade direction), ```exchange.Buy```/```exchange.Sell``` (orders), ```exchange.CancelOrder``` (cancellation), ```exchange.GetOrder``` (order query) and the like are used the same way as in futures markets.

- Account information
  Futu uses ```TrdMarket``` to tell the Hong Kong, US, mainland and other markets apart. From the [```Futu API``` documentation](https://openapi.futunn.com/futu-api-doc/):

  ```go
  const (
      TrdMarket_TrdMarket_Unknown TrdMarket = 0 // unknown market
      TrdMarket_TrdMarket_HK      TrdMarket = 1 // Hong Kong market
      TrdMarket_TrdMarket_US      TrdMarket = 2 // US market
      TrdMarket_TrdMarket_CN      TrdMarket = 3 // mainland market
      TrdMarket_TrdMarket_HKCC    TrdMarket = 4 // Hong Kong Stock Connect market
      TrdMarket_TrdMarket_Futures TrdMarket = 5 // futures market
  )
  ```

  Data returned by ```exchange.GetAccount()```:

  ```json
  {
      "Info": [{
          "Header": {
              ...                 // omitted
              "TrdMarket": 1      // market ID in the raw Info data: assets of the Hong Kong market
          },
          "Funds": {              // account assets in this market
              ...
          }
      }, ...],
      "Stocks": 0,
      "FrozenStocks": 0,
      "Balance": 1000000,         // assets in the current market
      "FrozenBalance": 0
  }
  ```

- ```FutuOpenD``` decides the region by the **IP** address it logs in from; accounts logged in from outside mainland China have some market data restrictions. See the official ```FutuOpenD``` (Futu) documentation.

**Interactive Brokers**

- Configure the exchange
  Run "IB Gateway" or "TWS (Trader Workstation)" on the docker's machine. With TWS: after logging in, click the configuration button at the top right, open "Configure" → "API" → "Settings", **uncheck** "Read-Only API", check "Enable ActiveX and Socket Clients", and note the "Socket port" (TWS defaults to 7496 for live and 7497 for paper; IB Gateway to 4001 for live and 4002 for paper).
  Then choose **Interactive Brokers** on the platform's [add exchange page](https://www.fmz.com/m/add-platform):
  - Server address: the address and port of TWS or IB Gateway, e.g. ```localhost:7496```.
  - Market data type: realtime, frozen, delayed or delayed frozen. Accounts without a realtime market data subscription can choose delayed data. It can also be switched at run time with ```exchange.IO("marketDataType", n)``` (```n``` from 1 to 4, in the order above).

- Contract codes
  Set with ```exchange.SetContractType()``` in the form ```symbol.currency[.type[.exchange]]```; the type defaults to stock ```STK``` and the exchange to ```SMART```:
  - US stocks: ```AAPL.US```, ```TSLA.US``` (```US``` means priced in USD).
  - Hong Kong stocks: ```symbol.HK``` (```HK``` means priced in HKD).
  - Futures (```FUT```): ```symbol-expiry[-multiplier].currency.FUT.exchange```, with the expiry month written as ```YYYYMM``` and the exchange as IB's exchange code.
  - Options (```OPT```) and futures options (```FOP```): ```symbol-expiry-C or P-strike×100[-multiplier].currency.OPT or FOP.exchange```, with the strike multiplied by 100 and written as an integer.
  - A plain number: used directly as the IB contract ID (conId).

- Other notes
  - The docker connects to TWS with the live trading ID as its client ID (clientId), so the client ID stays the same across restarts and orders placed earlier can still be cancelled or modified. TWS only lets the client ID that placed an order (or the master client) modify or cancel it.
  - ```Symbol``` in positions and orders is the short form (e.g. ```Z74.SGD```); ```exchange.GetPositions()``` and ```exchange.GetOrders()``` accept either the short form or the full code used when ordering (e.g. ```Z74.SGD.STK.SGX```).
  - When the gateway rejects an order, the ```Reject``` field in the order's ```Info``` holds the reason.
  - After ```exchange.IO("debug", true)```, every frame sent to or received from TWS is logged in the TWS API log format, so it can be matched against the gateway's own log.

##### Crypto

- Futures_Binance
  Binance trading pairs with Chinese names are supported:

  ```js
  function main() {
      let ticker = exchange.GetTicker("币安人生_USDT.swap")
      Log("ticker:", ticker)   // {"Info":{...},"Symbol":"币安人生_USDT.swap","Open":0.29622,"High":0.31661, ...}
  }
  ```

  For the ```exchange.IO()``` switches of Binance Futures (dual-side position mode, isolated/cross margin, unified account, STP mode, etc.), see `exchange.IO`.
- Futures_HuobiDM
  Use ```exchange.IO("base", "https://xxx.xxx.xxx")``` or ```exchange.SetBase("https://xxx.xxx.xxx")``` to switch the base address of the exchange API.

  For the ```exchange.IO()``` switches of Huobi Futures (signHost, isolated/cross margin, one-way/two-way position mode, unified account, etc.), see `exchange.IO`.

  Condition orders of the OCO type (```ORDER_CONDITION_TYPE_OCO```) are not supported; condition orders also work in multi-asset margin mode.
- Huobi
  Huobi trading pairs with Chinese names are supported:

  ```js
  function main() {
      let ticker = exchange.GetTicker("币安人生_USDT")
      Log("ticker:", ticker)   // {"Info":{...},"Symbol":"币安人生_USDT","Open":0.29622,"High":0.31661, ...}
  }
  ```
- Bitfinex
  The amount of a spot market buy order is the quantity of the traded coin, not the quote amount.
- AscendEx
  The amount of a spot market buy order is the quantity of the traded coin, not the quote amount.
- Futures_Hyperliquid
  See the [Hyperliquid guide](https://www.fmz.com/digest-topic/10574).

  For the ```exchange.IO()``` switches of Hyperliquid Futures (isolated/cross margin, mainnet/testnet, vaultAddress, walletAddress, expiresAfter, etc.), see `exchange.IO`.
- Futures_Lighter
  The test environment can be selected when configuring the exchange object, or reached by changing the REST API endpoint with ```exchange.SetBase()```.

  For the ```exchange.IO()``` switches of Futures_Lighter (isolated/cross margin, order expiry, etc.), see `exchange.IO`.

  ```Buy``` and ```Sell``` returned by ```exchange.GetTickers()``` are each instrument's last trade price (the exchange has no batch order book endpoint); use ```exchange.GetTicker()``` or ```exchange.GetDepth()``` when you need the best bid and ask.
- Futures_edgeX
  All edgeX perpetuals are quoted in USDC: write the trading pair as ```BTC_USDC``` and so on, with full symbols such as ```BTC_USDC.swap```; ```BTC_USDT``` or ```BTC_USD``` is reported as a contract that does not exist.
- Poloniex
  Spot condition orders support stop-loss only (```ORDER_CONDITION_TYPE_SL```): a buy triggers when the price rises to the trigger price, a sell when it falls to the trigger price. Take-profit (```ORDER_CONDITION_TYPE_TP```) and OCO condition orders return an error and no order is placed.

### Docker

The [docker](https://www.fmz.com/m/nodes) is the program that runs strategies: live strategies run on a docker, not on the FMZ website. The docker talks to the platform, starts and stops strategy processes and sends logs back; every request a strategy makes to an exchange also leaves from the docker's machine. The docker runs on your own server (or a server rented with one click), so a network failure of the platform website does not affect the live robots already running on it.

**Supported systems**
Only 64-bit builds are released: Linux (x86_64, ARM64), macOS (Intel, Apple Silicon) and Windows (x64, ARM64, plus a GUI version). 32-bit systems are not supported.

**Data directory**
All docker data is in the ```logs``` directory under the working directory (the startup directory by default, or the one given with ```-w```):
- ```logs/storage/<robot ID>/<robot ID>.db3```: the robot database (```SQLite```) holding logs, profit, charts, the status bar and ```_G()``` data; it can be opened with any ```SQLite``` tool.
- ```logs/storage/<robot ID>/stdout.log```, ```stderr.log```: standard output and standard error of the strategy process.
- ```logs/docker.log```: the docker's own log.
- ```logs/docker.pid```: the docker's identity; keep it and the platform gives the docker its old ID back after a restart.

**Network proxy**
The docker does not read the system proxy settings or environment variables such as ```HTTP_PROXY```. To reach an exchange through a proxy:
- set a proxy on the exchange object in the strategy with `exchange.SetProxy`;
- or use a transparent proxy that takes over traffic at the network layer (such as Clash in TUN mode), which needs no docker configuration.

This chapter covers deploying the docker (manual deployment, one-click rental, operation precautions), command-line options, migrating live robot data and docker monitoring.

#### Deploy Docker

The [docker management page](https://www.fmz.com/m/nodes) lists the dockers of your account, as a list or with details, including each docker's IP address, version and build time. Click **Deploy Docker** to open the [docker deployment page](https://www.fmz.com/m/add-node), which offers two ways: one-click docker rental and manual deployment.

![Docker deployment page](https://www.fmz.com/upload/asset/2e527e497b3fa27ba497b.png)

##### One-Click Docker Rental

On the [Docker Deployment Page](https://www.fmz.com/m/add-node), click the **One-Click Docker Rental** tab and select the server to deploy based on your configuration requirements and server location preferences.

Click "Buy Now" and enter your FMZ Quant Trading Platform account credentials for verification. After successful verification, the docker program will be deployed automatically. The entire deployment process takes a few minutes, and the system will automatically install commonly used Python libraries.

After clicking "Buy Now", the rented server is provisioned through the platform on your behalf and has limited system permissions, with no support for remote login. If you need to use third-party Python libraries that are not pre-installed, it is recommended to use a private server for manual deployment.

Servers rented through the **One-Click Docker Rental** feature use independent billing, which is separate from live trading billing.

Clicking the "Redeploy" button will not delete the live trading logs and data files in the logs directory under the docker directory.

##### Manual Deployment of Docker

The docker can run on a PC, a server, a Raspberry Pi (64-bit OS) and similar devices. Only 64-bit builds are released:
- Linux command line: x86_64 (amd64), ARM64 (aarch64)
- macOS command line: Intel, Apple Silicon
- Windows: x64 and ARM64, each with a command-line and a GUI version

On the [docker deployment page](https://www.fmz.com/m/add-node), click **Manual Deployment**, download the build for your system and unpack it; the executable ```robot``` is the docker program. The same page shows the two pieces of information needed:

![Manual docker deployment page](https://www.fmz.com/upload/asset/2e460507bc21582ba1448.png)

1. Communication address: contains your account UID, like ```node.fmz.com/123456```.
2. Password: the password of the FMZ account that owns the UID.

**Windows GUI version**
Run ```robot.exe```, enter the communication address and password, and click start.

**Command-line version**
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
./robot -c robot.conf               # with robot.conf in the startup directory, plain ./robot loads it too
```

All options and the configuration file format are described in Platform Basics → Docker → Command-Line Options.

**Running in the background**
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

**Upgrading the docker**
The strategy runtime and the exchange connectors are delivered by the platform when needed and need no manual updates. To upgrade the docker program itself, stop the docker (see Docker Operation Precautions), replace the ```robot``` executable with the new version and start it in the **same working directory**. The ```logs``` directory there keeps the docker identity and the robot data, so the docker comes back with its old ID.

**Isolating strategy processes in Docker containers**
On Linux and macOS, the command-line version can run each strategy process in its own Docker container with the ```-i``` option (Docker must be installed and running on the machine). This isolates strategy processes; it is not a Docker image of the docker program itself. See Command-Line Options for the parameters.

##### Docker Operation Precautions

**Stop the robots first, then the docker**
Before deleting a docker or stopping its process, make sure no live robot is running on it.

**Stopping the docker normally**
- Command-line version: press ```Ctrl+C``` once in the terminal, or send ```SIGTERM``` to the process (```kill <PID>```, ```systemctl stop```).
- Windows GUI version: click the stop button.

On a stop request the docker shuts down gracefully: it stops all its live robots, reports their final state and then logs out of the platform. Pressing ```Ctrl+C``` again during this shutdown skips the reporting and logout and exits at once; normally do not do that.

**Avoid forced termination**
Do not end the docker with ```kill -9```, cut the power or force a shutdown. The docker then has no chance to log out, and its live robots may still show as running on the platform and keep being billed; in that case the offline docker has to be deleted before those robots can be stopped. Stop the docker before rebooting the server; when it runs under a service manager such as systemd, a system shutdown sends ```SIGTERM``` automatically.

#### Command-Line Options

Starting the command-line docker program ```robot```:

```bash
./robot -s node.fmz.com/123456            # prompts for the password (not echoed)
./robot node.fmz.com/123456               # short form: robot address [password]
./robot -c robot.conf                     # read options from a configuration file
./robot -v                                # show the version
```

**Options**

| Option | Description |
| --- | --- |
| ```-s address``` | Address for talking to the platform, like ```node.fmz.com/123456``` (```123456``` is the account UID); a ```ws://``` or ```wss://``` prefix is allowed. Shown on the [docker deployment page](https://www.fmz.com/m/add-node). |
| ```-p password``` | Account password. Not recommended: a plain-text password stays in the shell history and the process list. Without it the password is prompted for, or read from the configuration file. |
| ```-n name``` | Docker name, shown on the platform's docker page. |
| ```-w dir``` | Working directory. ```logs``` (robot data, docker log, identity file) lives under it. |
| ```-c file``` | Configuration file; format below. |
| ```-u user``` | Linux/macOS only: run strategy processes as this system user; the docker itself must run as root. Ignored with ```-i```. |
| ```-I IP``` | Local outbound IP: the connection to the platform and the strategies' connections to exchanges are bound to this address; see below. |
| ```-i image``` | Linux/macOS only: run each strategy process in its own container created from this Docker image; Docker must be installed and running. |
| ```-e path``` | With ```-i```: path of the executable inside the container. |
| ```-f JSON``` | With ```-i```: Docker container settings, as inline JSON or ```@path``` to read them from a file. |
| ```-H address``` | With ```-i```: address the container uses to connect back to the host. |
| ```-vv``` | Verbose log (including the messages exchanged with the platform); off by default to keep logs small. |
| ```-d DNS``` | The old custom DNS option; still accepted but ignored, as the docker always uses the system resolver. |
| ```-v```, ```-V```, ```--version``` | Print version and build information and exit. |
| ```-h```, ```--help``` | Print usage. |
| ```--ctl-stdin``` | Read control commands from standard input (the first line is the password when ```-p``` is not given); ```stop``` or end of input triggers a graceful shutdown. Meant for programs that wrap the docker as a service. |

Options that take a value can also be written as ```-option=value```, e.g. ```-n=server01```. An invalid option prints the usage and exits.

**Configuration file robot.conf**
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
- Keys are case-sensitive: ```I``` is the outbound IP and ```i``` the Docker image.
- The configuration file path and ```-f @file``` are resolved relative to the startup directory (before ```-w``` changes directory).
- The file holds your password, so make it readable only by you (```chmod 600 robot.conf```).

**Pinning the outbound IP (-I)**
When the server has several IP addresses and the exchange API key is whitelisted for one of them, pin the outbound IP with ```-I```, e.g. ```./robot -s node.fmz.com/123456 -I 192.168.1.100```. The connection to the platform and the strategies' connections to exchanges then leave from that address. With ```-i``` container isolation the container's network may not have that address; in that case let the container use the host network.

The Windows GUI version has no IP setting; use the command-line version when you need to pin the outbound IP. The GUI version accepts only ```-s```, ```-p``` and ```-n```, which prefill the window; when both ```-s``` and ```-p``` are given it starts automatically.

#### Live Trading Data Migration

Each live robot's data is in ```logs/storage/<robot ID>/``` under the docker's working directory (the database ```<robot ID>.db3```, ```stdout.log```, ```stderr.log``` and so on). The logs, profit and charts the platform shows for a robot are read from the docker that runs it.

**Moving one robot to a docker on another machine**
1. Stop the robot.
2. Copy the whole ```logs/storage/<robot ID>/``` directory to the same place under the new docker's working directory, keeping the robot ID as the directory name.
3. Switch the robot's docker to the new one in the robot configuration and start the robot.

The robot's existing logs, profit and other data are then kept on the new machine.

**Moving a whole docker**
1. Stop the robots on the old docker, then stop the old docker.
2. Copy the entire ```logs``` directory from the old docker's working directory to the working directory on the new machine.
3. Start the docker on the new machine.

```logs/docker.pid``` holds the docker's identity: with the old docker offline, the docker on the new machine gets the old docker ID back, so robot configurations need no change. Never run dockers on two machines with the same ```logs``` directory at the same time.

#### Docker Monitor

On the [docker management page](https://www.fmz.com/m/nodes), **Docker Monitor** can be enabled from the actions of the docker list or of the docker details. Once enabled, the platform emails the address bound to your account when the docker goes offline abnormally.

### Strategy Library

The [Strategy Library](https://www.fmz.com/m/strategies) page holds all strategies of the current account, written in any of the programming languages or visually.

- Grouping: strategies can be grouped just like robots (see Platform Basics → Live Trading → Grouping).
- Import and export: besides the source code, a complete strategy includes its parameters, interactions, description, notes, manual, template references and more, so move a strategy by exporting and importing the complete strategy (see Import and Export of Complete Strategies).
- Sharing and renting: generate a "copy code" to share a strategy or a "registration code" to rent it out (see Strategy Sharing and Renting).

#### Import and Export of Complete Strategies

Copying the source code is not enough to move a strategy: the parameter design, interaction design, template references and more are not in the source. "Export Strategy" and "Import Strategy" on the strategy editing page move a strategy completely.

![Strategy import/export screenshot](https://www.fmz.com/upload/asset/2e52ccf44526f396fb795.png)

- Export Strategy
  Exports one ```xml``` file, for strategies in every programming language. When exporting you can choose what to include: name, source code, notes, description, manual, template references, strategy parameters, interactive controls and backtest settings.

- Import Strategy
  Click "Import Strategy" on the strategy editing page, choose an ```xml``` file produced by "Export Strategy", and select what to import. Click "Save" afterwards to save the strategy.

#### Strategy Sharing and Renting

On the [Strategy Library](https://www.fmz.com/m/strategies) page, click the "Actions" button on the right side of a strategy to display a menu containing sharing and renting options.

Important Notice: When creating and distributing strategy **registration codes**, please carefully confirm whether it is a "Registration Code" or "Copy Code" to avoid accidentally leaking your strategy.

##### Strategy Sharing

![Strategy Sharing](https://www.fmz.com/upload/asset/2e593d57dc36afc004ef6.png)

- Public Sharing
  After clicking the "Share" button, a dialog box will pop up where you can select "Public Sharing". The strategy will be fully shared to the platform's Strategy Square, where any user can copy the strategy.

- Private Sharing
  After clicking the "Share" button, a dialog box will pop up where you can select "Private Sharing". After selecting the sharing validity period and sharing limit, a **copy page URL** and **copy code** for the strategy will be generated. These can be distributed to designated FMZ platform users. Users who need the strategy can simply use the **copy page URL** link, log in to the **copy page** and enter the copy code to obtain the strategy. Once obtained, the strategy will automatically appear in their strategy library.

##### Strategy Rental

![Strategy Rental](https://www.fmz.com/upload/asset/2e4e78f6c46c9dde1ce90.png)

- Public Sale
  After clicking the "Rent" button, a dialog box will pop up where you can select "Public Sale". The strategy can then be submitted for listing (requires approval).

- Internal Sale
  After clicking the "Rent" button, a dialog box will pop up where you can select "Internal Sale". After selecting the number of days, maximum concurrent instances, and number of registration codes, the system will generate a **registration page URL** and **registration codes** for this strategy. You can distribute these to designated FMZ platform users. Users who need this strategy only need to visit the **registration page URL** link, log in to the **registration page**, and enter the registration code to obtain access to the strategy. The strategy will also appear in the strategy library, but users will only have backtesting and live trading permissions, and cannot view the strategy source code or other information. When the number of concurrent live trading instances is set to 0, it means there is no limit on concurrent instances, allowing unlimited creation of live trading bots.

### Live Trading

As opposed to a backtest, a live robot is a strategy program instance that really interacts with an exchange (fetching market data, querying positions, placing and canceling orders, etc.). An instance connected to the exchange's production environment is a live robot, and so is one connected to the exchange's simulation environment (many exchanges offer a test environment).

**Creating a live robot**
On the [robot creation page](https://www.fmz.com/m/add-robot), choose the strategy, the docker host and the exchanges, then create the robot. Three things must be ready beforehand:
- A strategy: click "New Strategy" in the [Strategy Library](https://www.fmz.com/m/strategies), write it and save it.
- An online docker: click "Deploy Docker" on the [Docker page](https://www.fmz.com/m/nodes) (see Platform Basics → Docker).
- An exchange account: click "Add Exchange" on the [Exchange page](https://www.fmz.com/m/platforms) and configure it (see Platform Basics → Exchange).

Live robots are billed by the hour and cannot start without enough balance (see Platform Basics → Account and Billing → Live Robot Billing and Top-up).

**Robot monitoring**
On the [live trading page](https://www.fmz.com/m/robots), click "Monitor" in the actions column of a running robot to enable monitoring. Once enabled, the platform emails the address bound to your account when the robot exits for any reason other than a manual operation.

**Robot database**
For robot ID ```123456```, the database file is ```logs/storage/123456/123456.db3``` (```SQLite```) under the working directory of the docker running it, with these tables:
- chart: chart data.
- cfg: the latest state such as the status bar content and the chart configuration.
- kvdb: data persisted with the ```_G()``` function.
- log: robot logs.
- profit: profit data.

The same directory also holds the strategy process's standard output ```stdout.log``` and standard error ```stderr.log```.

**In this chapter**
- Grouping: group management of robots and strategies.
- Live Trading Observation: show a robot publicly or create a private viewing link.
- Live Trading Message Push: push logs to the mobile app, email or a WebHook.
- Common Causes of Live Trading Errors and Abnormal Exits.

To let other people view and operate some of your robots, use sub-accounts (see Platform Basics → Account and Billing → Sub-accounts).

#### Grouping

Click the **Group Management** button on the right of the "Live Trading" page or the "Strategy Library" page to group robots or strategies; group names are up to you.
For strategies, for example, you can put **template libraries** in one group, **JavaScript strategies** in another and **test strategies** in a third.

- Strategy groups
  ![Strategy groups](https://www.fmz.com/upload/asset/2e482ba9b9aa272085d00.png)

- Robot groups
  ![Robot groups](https://www.fmz.com/upload/asset/2e577d050e817837bbfdf.png)

#### Live Trading Observation

Click the "Public" button in the live trading list on the [Live Trading Page](https://www.fmz.com/m/robots) of FMZ Quant Trading Platform to publicly display the current live trading instance.

Live trading observation currently supports two methods:
- 1. Publicly display live trading on the [Live Trading Observation](https://www.fmz.com/live) page of FMZ Quant Trading Platform. Click the "Public" button and select **Public Sharing**.
- 2. Create a private link for live trading observation.
  Click the "Public" button and select **Internal Sharing**, set the validity period to generate a private link for accessing the private observation page of this strategy's live trading.

#### Live Trading Message Push

You can enable the message push feature on the [Push Settings page](https://www.fmz.com/m/account#push).

![Push Settings](https://www.fmz.com/upload/asset/2e4ad17706aa842c914ce.png)

- Mobile (App)
  After enabling mobile App push, push messages sent by the live trading program will be delivered to the FMZ Quant mobile App.
- Email
  To enable email push, you must first verify your email address. Once verified, you can receive push messages sent by the live trading program.
- WebHook
  After enabling WebHook push, you can customize the push address, for example: ```http://abc.com/push.php?data={body}```.
  When the live trading program sends a push message, the platform will send a request to the configured address ```http://abc.com/push.php?data={body}``` (only the ```GET``` method is supported), and the pushed message content will replace the ```{body}``` placeholder.

Pushing Messages in Strategies
- JavaScript/TypeScript/Python/Rust Languages
  In the strategy code, you can use the ```Log()``` function as well as other functions that output log information in the log area, such as ```exchange.CreateOrder()```, ```exchange.CancelOrder()```, etc.
  By passing an additional parameter ```"@"``` to these functions (i.e., adding an extra parameter beyond the required ones), for example ```Log("This is a push message", "@")```, the output log information will be pushed, and the platform will push the message according to the "Push Settings". In the Rust language, the corresponding ```Log!``` macro is used the same way: ```Log!("This is a push message", "@");```.
- PINE Language/My Language
  In the "Trading Library" parameters integrated into PINE Language/My Language strategies, you can enable trading log push, which will automatically push messages after a trading action is triggered.
- Blockly Visual
  In the "Tools" section, select the **Message Push** module to push specified information.

Message push is subject to a frequency limit, with the following rule: within each 20-second cycle of live trading, only the last message is retained and pushed, while all other messages are filtered out and not pushed.

#### Common Causes of Live Trading Errors and Abnormal Exits

**The robot cannot start**
- No online docker
  A robot cannot start while its docker is offline. Check on the [docker page](https://www.fmz.com/m/nodes) that the docker is online, or pick another online docker.
- Insufficient balance
  Starting a robot prepays its first hour, so it cannot start without enough balance; if the balance runs out while it runs, the platform stops it. Top up and start it again (see Platform Basics → Account and Billing → Live Robot Billing and Top-up).
- Rented strategy expired or concurrency limit reached
  When a rented strategy expires, robots using it are stopped and cannot be started again; once the rental's maximum number of concurrent robots is reached, no further robot can start.
- Key decryption failed
  The error contains ```secret key decrypt failed (wrong password)```. The FMZ account password was changed, so the exchange keys configured earlier can no longer be decrypted. To fix it:
  1. Re-enter the exchange keys, passwords and similar fields on the [Exchange management page](https://www.fmz.com/m/platforms).
  2. Stop all dockers and start them again with the new password.
- Credential file not found
  The exchange configuration uses a ```file:///xxx.txt``` credential file that is missing from the robot directory; the error contains ```read key file```. An invalid path fails with ```key file path must be relative and cannot contain '..'``` or ```key file path escapes the robot directory```. See Platform Basics → Exchange → Local Credential Files.

**Errors caused by strategy code**
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

**Other errors**
- API business errors and network request errors
  These show the exchange object name, the function name, the error message and the reason, and do not stop the robot by themselves. They are usually the trigger rather than the direct cause, which is typically **a program exception from using an API return value without checking it**.
- ```interrupt``` error
  Logged when the user clicks the **Stop** button on the robot page while the program is in the middle of an operation (such as an exchange API call) and the stop interrupts it. It is harmless, just a log entry.

See the [FAQ collection](https://www.fmz.com/bbs-topic/1427) for more.

## Writing Strategies

Writing strategies in the supported languages: notes for each language, strategy structure (lifecycle, main loop, event-driven), strategy parameters, interactive controls, template libraries, built-in libraries, and multi-language text in the strategy UI.

### Programming Languages

**What programming languages can I use to write my strategies on the FMZ Quant trading platform?**

  ![Supported Programming Languages](https://www.fmz.com/upload/asset/2e52c7501f57044f7f0ef.png)

  The FMZ Quant trading platform supports writing and designing trading strategies using ```JavaScript```, ```TypeScript```, ```Python```, ```Rust```, [```PINE```](https://www.fmz.com/bbs-topic/9315), [```My Language```](https://www.fmz.com/bbs-topic/2569), ```Blockly``` visual programming, and the ```Workflow``` workflow tool.

#### JavaScript

Strategies can be written in ```JavaScript```. The runtime is based on the QuickJS engine and supports modern syntax such as ```async```/```await```, ```class``` and ```BigInt```. In live trading the strategy runs on the docker; in backtesting it runs in the browser-side backtesting system. Adding ```// @ts-check``` to the code switches to TypeScript (see Programming Languages → TypeScript).

**Structure and parameters**

The entry point is ```function main()```. The optional ```init()```, ```onexit()``` and ```onerror(msg)``` are called automatically by the docker (see Writing Strategies → Strategy Structure). Interface parameters are global variables with the same names; they can be read directly and also modified in code (see Writing Strategies → Strategy Parameters).

**Errors and return values**

When an API call fails (the exchange returns an error, a network problem, etc.) it returns ```null``` and writes the error to the log. Check the return value before using it, or retry with `_C`:

```js
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

**Strings and ArrayBuffer**

JavaScript strings are UTF-16. If text returned by a platform API is not a valid UTF-8 byte sequence, an ```ArrayBuffer``` (the raw bytes) is returned instead so that no data is lost. Every API parameter that accepts a string also accepts an ```ArrayBuffer```.

```js
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

**Asynchrony and threads**

- ```setTimeout```/```clearTimeout```: callbacks run while the main thread is waiting in ```Sleep()```. When ```main()``` returns, timers that have not fired yet run first, then ```onexit()``` is called.
- ```fetch(url)```: returns a ```Promise``` that resolves to a response object (```ok```, ```status```, ```headers```; ```text()``` and ```json()``` return the content directly). On the docker, ```fetch``` completes the request synchronously when called and returns an already settled ```Promise```, so combining several ```fetch``` calls with ```Promise.all``` does not make them concurrent.
- Exchange APIs (such as ```exchange.GetTicker()```) are synchronous blocking calls; wrapping them in a ```Promise``` or an ```async``` function does not make them concurrent either.
- For concurrency use `exchange.Go`, `HttpQuery_Go`, or create threads with `Thread` (see Advanced Topics → JavaScript Multithreading).

```js
async function main() {
    let resp = await fetch("https://www.okx.com/api/v5/market/books?instId=BTC-USDT")
    if (resp.ok) {
        Log(resp.json())
    } else {
        Log("status:", resp.status)
    }
}
```

**Libraries and dependencies**

JavaScript strategies can use the built-in ```TA``` and ```talib``` indicator libraries directly; see Writing Strategies → Built-in Libraries for what each language provides. Other third-party JavaScript libraries can be downloaded at run time and loaded with ```eval```; the same page has an example.

#### TypeScript

TypeScript is not a separate language option. Create the strategy as ```JavaScript``` and add a ```// @ts-check``` line to the code (or click the "TypeScript" button at the top right of the editor); the platform then treats it as TypeScript and compiles it to JavaScript before backtesting or live trading. When a strategy is saved through the AI/MCP tools, the language can be given as ```typescript```: the platform saves it as a JavaScript strategy and adds ```//@ts-check``` at the top automatically (see External Interfaces → AI Access).

Static type checking catches mistakes such as wrong argument counts, property names or types while you write, and makes editor completion more accurate.

A minimal example:

```ts
// @ts-check
interface Signal {
    side: "buy" | "sell"
    price: number
}

function getSignal(ticker: ITicker, ma: number): Signal | null {
    if (ticker.Last > ma) {
        return {side: "buy", price: ticker.Last}
    }
    if (ticker.Last < ma) {
        return {side: "sell", price: ticker.Last}
    }
    return null
}

function main() {
    while (true) {
        const records = exchange.GetRecords()
        const ticker = exchange.GetTicker()
        if (records && ticker && records.length > 20) {
            const ma = TA.MA(records, 20)
            const signal = getSignal(ticker, ma[ma.length - 1])
            if (signal) {
                Log(signal.side, signal.price)
            }
        }
        Sleep(60 * 1000)
    }
}
```

Type declarations for the platform API are built into the strategy editor; nothing needs to be referenced in the code. They cover the global functions, the ```exchange``` object, data structure interfaces such as ```ITicker```, ```IRecord```, ```IOrder``` and ```IPosition```, and ```TA```, ```talib``` and so on. Language features, APIs and libraries at run time are the same as for JavaScript strategies (see Programming Languages → JavaScript).

#### Python

Strategies can be written in ```Python 3```; Python 2 is not supported. Live trading, and backtests that run on a docker, use the Python interpreter installed on the docker's machine.

**Interpreter**

The docker looks for an interpreter in this order and uses the first program that starts and is Python 3:
1. the interpreter given by the environment variable ```PYTHON_BIN```;
2. ```python3```;
3. ```python```.

To use a specific interpreter (for example the Python of a virtual environment), set the environment variable before starting the docker:

```bash
export PYTHON_BIN=/opt/venv/bin/python3
```

A first line such as ```#!python3``` or ```#!python2``` in the strategy is no longer used to choose the interpreter.

**Structure and parameters**

The entry point is ```def main()```. The optional ```init()``` and ```onexit()``` are called automatically by the docker (Python does not support ```onerror()```); see Writing Strategies → Strategy Structure. Interface parameters are global variables with the same names; to assign a new value to one inside a function, declare it with ```global``` first.

**Errors and return values**

When an API call fails it returns ```None``` and writes the error to the log. Check the return value before using it, or retry with ```_C()```. An uncaught exception ends the strategy, and the error is recorded in the log.

**Output**

The output of ```print()``` goes to the docker process's standard output and does not appear in the live trading log. Use `Log` for anything that should show up in the log.

**Third-party packages**

A strategy can import any package installed in the interpreter. Install packages with the same interpreter the docker uses, for example:

```bash
python3 -m pip install numpy
# when PYTHON_BIN is set
$PYTHON_BIN -m pip install numpy
```

To use ```talib```, install TA-Lib (the ```talib``` package) and ```numpy``` on the docker's machine.

**Your own modules**

While a strategy runs, its current directory and ```PYTHONPATH``` are a temporary directory created by the docker for that run and deleted afterwards; ```.py``` files placed under the docker's directory (for example ```logs/storage/<live trading ID>/```) are not found automatically. There are two ways to import your own modules:
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

Strategies can be written in ```Rust```. Rust strategies are compiled before they run: for backtesting the platform server compiles them and they run in the browser-side backtesting system; in live trading they run on the docker once compiled. The strategy editor integrates ```rust-analyzer``` for Rust, with code completion and live diagnostics.

**Structure**

A strategy only needs a ```fn main()```. The platform API (```exchange```, ```exchanges```, ```TA```, ```Log!```, ```_C!``` and so on) is imported automatically; no ```use``` or ```mod``` declarations are needed.

The optional ```fn init()``` and ```fn onexit()``` are called automatically by the docker; just define them, no registration is needed. ```init()``` runs before ```main()```; ```onexit()``` runs when ```main()``` returns normally, when the live trading is stopped, and when the strategy panics. Rust does not support ```onerror()```. See Writing Strategies → Strategy Structure.

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

**Parameter types**

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

**Errors and return values**

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

**JSON**

Raw JSON text returned by the platform API (for example the return value of ```exchange.IO()``` or the ```Info``` field of each structure) is parsed with the built-in ```JSONParse()```, which returns an ```Option<JsonValue>```. Navigate with ```v["key"]``` and ```v[0]``` and read values with methods such as ```as_f64()```, ```as_str()``` and ```as_bool()```. ```JsonValue``` implements ```Display```, so ```v.to_string()``` or ```format!("{}", v)``` gives compact JSON text. The SDK has no convenient API for building JSON; build JSON text with ```format!```, or use ```serde_json```.

**Third-party crates**

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

- The frontmatter must be at the start of the source, with only blank lines before it; the ```/*backtest ... */``` backtest configuration block goes after the closing ```---```. If the strategy has no backtest configuration block yet, "Save Backtest Settings" inserts one at the very top of the source; move it below the frontmatter (later saves update it in place).
- Between a strategy and the template libraries it references, the dependency block may appear in only one place; declaring it in both fails the build.
- The build environment has no system OpenSSL. For crates that need TLS (HTTP/WebSocket clients and the like), choose the pure-Rust ```rustls``` implementation (for example ```tokio-tungstenite``` with the ```rustls-tls-webpki-roots``` feature) and avoid ```native-tls```/```openssl-sys```. For WebSocket connections prefer the built-in `Dial` function, which needs no third-party crate.

**Built-in libraries**

Rust strategies can use the ```TA``` indicator library; ```talib``` is not supported. See Writing Strategies → Built-in Libraries.

#### MyLanguage

The platform supports MyLanguage for writing and designing strategies, compatible with most syntax, instructions and functions of Wenhua MyLanguage. MyLanguage encourages modular programming, breaking down complex algorithms into function modules. Through concise syntax, dedicated data structures and powerful financial function libraries, it supports the implementation of complex financial logic. Building applications in a modular way improves development efficiency and code maintainability.

MyLanguage Strategy Example: System Based on Displaced Bollinger Bands

```My
M := 12;          // Parameter range 1, 20
N := 3;           // Parameter range 1, 10
SDEV := 2;        // Parameter range 1, 10
P := 16;          // Parameter range 1, 20

// This strategy is a trend-following trading strategy, suitable for larger timeframes such as daily charts.
// This model is only used as a model development case. Trading based on this carries your own risk.

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

The platform supports and is compatible with ```Trading View```'s PINE language scripts. PINE is a lightweight yet powerful strategy programming language for creating technical indicators and strategies that can be backtested and traded live. The active community has created over 100,000 PINE scripts.
Users can easily access and apply various technical analysis tools and trading strategies; leverage community scripts to quickly implement trading ideas without writing code from scratch, significantly reducing development cycles; help both beginners and experienced traders learn and understand different technical indicators, strategies, and programming concepts.

PINE Language Strategy Example: Supertrend Strategy
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

#### Blockly Visual Programming

The platform supports Blockly visual programming. With the Blockly editor, users can express code concepts such as variables, logical expressions, and loops by connecting graphical blocks (similar to building blocks). This approach allows the programming process to focus less on tedious syntax details and instead operate directly according to programming principles. Through the arrangement and combination of graphical blocks, users can easily understand programming logic and implement creative ideas, making it ideal for cultivating interest in strategy design and quickly getting started with programmatic and quantitative trading.

  - [Building Trading Strategies with Visual Modules - Introduction](https://www.fmz.com/digest-topic/4016)

  - [Building Trading Strategies with Visual Modules - Advanced](https://www.fmz.com/digest-topic/4046)

  - [Building Trading Strategies with Visual Modules - In-depth](https://www.fmz.com/digest-topic/4086)

  - [Building Trading Strategies with Visual Modules - Simplified](https://www.fmz.com/digest-topic/4107)

#### Workflow

The platform supports writing strategies using the Workflow approach. Workflow is a visual strategy design method that builds trading logic through node connections and configurations, enabling strategy implementation without writing code.

**Workflow Features**:
- Visual drag-and-drop design, WYSIWYG
- Rich preset functional nodes (data retrieval, indicator calculation, conditional judgment, trade execution, etc.)
- Lower programming barrier, suitable for rapid strategy building and validation
- Supports backtesting functionality with visual node execution status viewing

**Learning Resources**:
- [Workflow Video Tutorial Series](https://www.fmz.com/class/workflow)

### Strategy Structure

Strategies in ```JavaScript``` (including TypeScript), ```Python``` and ```Rust``` consist of a few functions with agreed names, which the docker calls at fixed points. MyLanguage, PINE, Blockly and Workflow strategies do not need to define them.

**Lifecycle functions**

| Function | Required | When it is called |
| - | - | - |
| ```main()``` | Yes | The entry function and body of the strategy. When ```main()``` returns, the strategy has finished. |
| ```init()``` | No | Called once before ```main()```, for initialization. |
| ```onexit()``` | No | Called when the strategy exits, for cleanup (cancel orders, close positions, save state, etc.). |
| ```onerror(msg)``` | No | ```JavaScript``` only: called when ```main()``` ends with an uncaught exception; ```msg``` is the error message. When ```onerror()``` is called, ```onexit()``` is not. |
| ```destroy()``` | No | ```JavaScript``` template libraries only: called when the strategy exits, after ```onexit()``` or ```onerror()```; see Writing Strategies → Template Library. |

Which function runs on exit:

| Exit reason | JavaScript | Python | Rust |
| - | - | - | - |
| ```main()``` returns normally | ```onexit()``` | ```onexit()``` | ```onexit()``` |
| Live trading stopped | ```onexit()``` | ```onexit()``` | ```onexit()``` |
| Uncaught exception or ```panic``` | ```onerror(msg)``` | neither | ```onexit()``` |

**Notes:**
- ```onexit()``` and ```onerror()``` may run for at most 5 minutes (the limit is sent by the server with each task; the default is 5 minutes) and are terminated when they exceed it.
- In backtesting a strategy is usually an endless polling loop, so ```main()``` does not return normally when the backtest ends; see Strategy Structure → onexit() for how to handle this.
- When ```main()``` of a ```JavaScript``` strategy returns, threads created with ```threading``` are terminated; ```setTimeout``` callbacks that have not fired yet run first, then ```onexit()``` is called.
- ```JavaScript``` and ```Python``` template libraries can define their own ```init()```, which runs when the template is loaded, before the strategy's ```init()```.

**Main loop and event-driven strategies**

Most strategies run a loop in ```main()```: each round fetches data, computes, places orders, then calls ```Sleep()``` to wait for the next round (see Strategy Structure → Main Loop). A strategy can also wait for market data, order updates and other events and handle them as they arrive (see Strategy Structure → Event-Driven). For a categorized list of all API functions see Strategy Structure → API Quick Reference.

#### init()

```init()``` is the initialization function implemented by the user. When a strategy starts running, the ```init()``` function is automatically executed first to complete the initialization tasks designed within the strategy.

```javascript
function main(){
    Log("First line of code executed!", "#FF0000")
    Log("Exiting!")
}

// Initialization function
function init(){
    Log("Initializing!")
}
```

```python
def main():
    Log("First line of code executed!", "#FF0000")
    Log("Exiting!")

def init():
    Log("Initializing!")
```

```rust
fn main() {
    Log!("First line of code executed!", "#FF0000");
    Log!("Exiting!");
}

// Initialization function
fn init() {
    Log!("Initializing!");
}
```

#### onexit()

```onexit()``` is implemented by the user to clean up when the strategy exits; it is optional. It may run for at most 5 minutes and is terminated when it exceeds that. For when each language calls ```onexit()```, see Writing Strategies → Strategy Structure.

Testing the ```onexit()``` function:

```javascript
function main(){
    Log("Starting, will stop after 5 seconds and execute cleanup function!")
    Sleep(1000 * 5)
}

// cleanup function
function onexit(){
    var beginTime = new Date().getTime()
    while(true){
        var nowTime = new Date().getTime()
        Log("Program stop countdown..cleanup started, elapsed time:", (nowTime - beginTime) / 1000, "seconds!")
        Sleep(1000)
    }
}
```

```python
import time
def main():
    Log("Starting, will stop after 5 seconds and execute cleanup function!")
    Sleep(1000 * 5)

def onexit():
    beginTime = time.time() * 1000
    while True:
        ts = time.time() * 1000
        Log("Program stop countdown..cleanup started, elapsed time:", (ts - beginTime) / 1000, "seconds!")
        Sleep(1000)
```

```rust
fn main() {
    Log!("Starting, will stop after 5 seconds and execute cleanup function!");
    Sleep(1000 * 5);
}

// cleanup function
fn onexit() {
    let beginTime = Unix() * 1000;
    loop {
        let nowTime = Unix() * 1000;
        Log!("Program stop countdown..cleanup started, elapsed time:", (nowTime - beginTime) / 1000, "seconds!");
        Sleep(1000);
    }
}
```

In the backtesting system a strategy is usually an endless polling loop, so ```main()``` has not returned normally when the backtest data ends, and ```JavaScript``` and ```Python``` strategies therefore do not run ```onexit()```. In a backtest (```IsVirtual()``` is true) you can catch the exception (EOF) thrown when the backtest ends so that ```main()``` returns and ```onexit()``` runs. In ```Rust``` the API calls return ```Err``` when the backtest ends, so just leave the loop.

```javascript
function main() {
    if (exchange.GetName().startsWith("Futures_")) {
        Log("Exchange is futures")
        exchange.SetContractType("swap")
    } else {
        Log("Exchange is spot")
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
    Log("Executing cleanup function")
}
```

```python
def main():
    if exchange.GetName().startswith("Futures_"):
        Log("Exchange is futures")
    else:
        Log("Exchange is spot")

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
    Log("Executing cleanup function")
```

```rust
fn onTick() {
    loop {
        match exchange.GetTicker(None) {
            Ok(ticker) => LogStatus!(_D(None), ticker.Last),
            Err(e) => {
                // API calls return Err when the backtest ends; leaving the loop lets main return, which triggers onexit()
                Log!("error:", e);
                break;
            }
        }
        Sleep(500);
    }
}

fn main() {
    if exchange.GetName().starts_with("Futures_") {
        Log!("Exchange is futures");
        let _ = exchange.SetContractType("swap");
    } else {
        Log!("Exchange is spot");
    }

    onTick();
}

fn onexit() {
    Log!("Executing cleanup function");
}
```

#### onerror()

```onerror(msg)``` is supported only by ```JavaScript``` (including TypeScript) strategies. It is called when ```main()``` ends with an uncaught exception; the argument ```msg``` is the error message. When ```onerror()``` is called, ```onexit()``` is not. It may run for at most 5 minutes and is terminated when it exceeds that. The backtesting system does not support this function.

```Python``` and ```Rust``` strategies do not support ```onerror()```.

```javascript
function main() {
    var arr = []
    Log(arr[6].Close)  // deliberately raise an exception here
}

function onerror(msg) {
    Log("Error:", msg)
}
```

```python
# Not supported in Python
```

```rust
// Not supported in Rust
```

#### Main Loop

A strategy usually runs a loop in ```main()```: each round fetches market data, computes signals, places orders, then calls `Sleep` to wait for the next round. In backtesting ```Sleep()``` advances backtest time and controls the replay speed; in live trading it controls the polling interval and therefore how often the exchange API is called. A loop without ```Sleep()``` calls the exchange API as fast as it can and easily hits the exchange's rate limits. To limit the API call rate on the docker, see Advanced Topics → API Rate Limit Control.

Basic framework:

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

The simplest example: place a buy order at price 100 for amount 1 every second:

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

A strategy that acts on K-line updates (On Bar): ```onTick()``` runs only when the time of the latest K-line changes:

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

Besides polling at a fixed interval, a strategy can wait for events and handle them as they arrive, which avoids useless requests and reacts faster to market changes.

**EventLoop**

`EventLoop` waits for events such as the completion of concurrent tasks started with ```exchange.Go()``` or ```HttpQuery_Go()```, readable data on a WebSocket connection, or thread messages; when one occurs it returns the event information and the strategy then reads the corresponding data. Events are recorded only from the first call of ```EventLoop()```, so call ```EventLoop(-1)``` once before starting concurrent tasks:

```js
function main() {
    EventLoop(-1)                       // start recording events so none are missed
    var r1 = exchange.Go("GetTicker")
    var r2 = exchange.Go("GetDepth")
    var ev = EventLoop(1000)            // wait up to 1 second for either task to finish
    Log("event:", ev)
    Log("ticker:", r1.wait(), "depth:", r2.wait())
}
```

**ctx.subscribe / ctx.poll**

```JavaScript``` and ```Rust``` strategies can also use the docker's event subscription interface: ```ctx.subscribe()``` subscribes to market data or order updates for an account and symbol and returns a stream ID; ```ctx.poll()``` takes the next event (optionally with a timeout), and the strategy handles it according to its ```kind```. ```Python``` strategies do not support it.

```js
function main() {
    ctx.subscribe(0, "BTC_USDT", {channel: "ticker"})   // the first argument is the account's index in exchanges
    ctx.subscribe(0, "", {channel: "orders"})           // order updates
    while (true) {
        const ev = ctx.poll([], 1000)                    // [] means all subscriptions; wait up to 1 second
        if (!ev) {
            continue
        }
        if (ev.kind === 1) {
            Log("ticker:", ev.symbol, ev.bid, ev.ask, ev.last)
        } else if (ev.kind === 16) {
            Log("order:", ev.id, ev.state, ev.filledQty)
        }
    }
}
```

- ```channel``` can be ```"ticker"```, ```"bbo"```, ```"depth"```, ```"trade"```, ```"kline"``` (```interval``` is the period in seconds) or ```"orders"```.
- Event ```kind```: 1 ticker, 3 depth (the event only signals that the order book changed; read the levels with ```ctx.book(ev.ex, ev.symbol, n)```), 4 trade, 5 K-line, 16 order update.
- If market data subscriptions are not consumed in time, only the latest data is kept or the oldest is dropped; order updates are never dropped, so the strategy must keep calling ```ctx.poll()```.

In ```Rust``` the calls are ```ctx::subscribe()``` and ```ctx::poll()```; events are raw structures whose prices and quantities are fixed-point integers:

```rust
fn main() {
    let s = ctx::subscribe(0, "BTC_USDT", ctx::SubOpts::ticker()).unwrap();
    loop {
        match ctx::poll(&[s], Some(1000)) {
            ctx::Polled::Event(ev) => Log!("event kind:", ev.kind),
            ctx::Polled::Stopped => break,
            _ => {}
        }
    }
}
```

#### API Quick Reference

Every function, structure and constant of the API reference, grouped by its category, with a one-line description; click a name for the full page. This page is generated from the reference by ```doc_tools/gen_api_index.py```.

## Built-in Functions

### Global

| Name | Description |
| - | - |
| `Version` | Returns the current system version number. |
| `IsVirtual` | Used to determine whether the strategy's runtime environment is the backtesting system. |
| `GetOS` | Retrieves the operating system information of the device hosting the bot. |
| `GetPid` | Get the ID of the live trading process. |
| `GetMeta` | Get the ```Meta``` value written when generating the strategy registration code. |
| `Sleep` | The sleep function pauses program execution for a specified period of time. |
| `Unix` | Get the second-level timestamp of the current moment. |
| `UnixNano` | Get the nanosecond-level timestamp of the current moment. |
| `_D` | Convert a millisecond-level timestamp or a ```Date``` object into a time string. |
| `GetCommand` | Get the strategy's interactive command. |
| `GetLastError` | Retrieves the most recent error message. |
| `SetErrorFilter` | Filters error logs. |
| `_N` | Format a floating-point number. |
| `_C` | A retry function used for fault-tolerant handling of interface calls. |
| `_Cross` | Returns the number of crossover periods between array ```arr1``` and array ```arr2```. |
| `JSON.parse` | The ```JSON.parse``` function is a method of the **ECMAScript** standard built-in object ```JSON```, used to decode (parse) a JSON string. |
| `JSON.stringify` | The ```JSON.stringify``` function is a method of the **ECMAScript** standard built-in object ```JSON```, used to convert JavaScript values to JSON strings. |
| `Encode` | This function encodes data according to the parameters passed in. |
| `MD5` | Calculate the MD5 hash of the parameter ```data```. |
| `UUID` | Create a UUID. |

### Log

| Name | Description |
| - | - |
| `Log` | The ```Log()``` function is used to output logs. |
| `LogStatus` | Outputs information to the status bar on the backtesting system or the live trading page. |
| `LogProfit` | Records and prints the profit/loss value, and plots the equity curve based on the profit/loss value. |
| `LogProfitReset` | Clear all profit logs and the profit chart. |
| `LogReset` | Clear the logs. |
| `LogVacuum` | Used to reclaim the storage space occupied by deleted data in **SQLite** after clearing logs with the ```LogReset()``` function. |
| `EnableLog` | Enable or disable logging of order information. |
| `Chart` | Custom chart plotting function. |
| `KLineChart` | This function is used to perform custom drawing while a strategy is running, using a drawing approach similar to the ```Pine``` language. |
| `console.log` | Used to output debug information in the "Debug Info" section of the live trading page. |
| `console.error` | Used to output error messages in the "Debug Information" section of the live trading page. |
| `exchange.Log` | The ```exchange.Log()``` function is used to output order placement and cancellation logs in the log column area. |

### Market

| Name | Description |
| - | - |
| `exchange.GetTicker` | Retrieves the Ticker structure (i.e., the market data) corresponding to the spot or contract of the currently configured trading pair and contract code. |
| `exchange.GetTickers` | The ```exchange.GetTickers()``` function is used to retrieve aggregated market data from the exchange (an array of Ticker structures). |
| `exchange.GetDepth` | Gets the Depth structure, i.e. |
| `exchange.GetTrades` | Gets the Trade structure array of the spot or futures corresponding to the currently set trading pair and contract code, i.e. |
| `exchange.GetRecords` | Get the Record structure array (i.e. |
| `exchange.GetMarkets` | The ```exchange.GetMarkets()``` function is used to retrieve market information from the exchange. |
| `exchange.GetRawJSON` | Get the raw content returned by the most recent ```rest``` request from the current exchange object (exchange, exchanges). |
| `exchange.SetData` | The ```exchange.SetData()``` function is used to set the data loaded when the strategy is running. |
| `exchange.GetData` | The ```exchange.GetData()``` function is used to retrieve data loaded by the ```exchange.SetData()``` function, or data provided by an external link. |

### Trade

| Name | Description |
| - | - |
| `exchange.Buy` | The ```exchange.Buy()``` function is used to place a buy order. |
| `exchange.Sell` | The ```exchange.Sell()``` function is used to place a sell order. |
| `exchange.CreateOrder` | ```exchange.CreateOrder()``` function is used to place orders. |
| `exchange.ModifyOrder` | The ```exchange.ModifyOrder()``` function is used to modify an existing regular order, allowing you to modify the order's price and quantity. |
| `exchange.CancelOrder` | The ```exchange.CancelOrder()``` function is used to cancel an order. |
| `exchange.GetOrder` | The ```exchange.GetOrder()``` function is used to obtain order information. |
| `exchange.GetOrders` | The ```exchange.GetOrders()``` function is used to obtain the current unfilled orders. |
| `exchange.GetHistoryOrders` | ```exchange.GetHistoryOrders()``` function is used to retrieve the historical orders of the current trading pair or contract, and supports specifying a parti... |
| `exchange.CreateConditionOrder` | The ```exchange.CreateConditionOrder()``` function is used to create a conditional order. |
| `exchange.ModifyConditionOrder` | The ```exchange.ModifyConditionOrder()``` function is used to modify an existing conditional order, allowing modification of the order amount, trigger condit... |
| `exchange.CancelConditionOrder` | ```exchange.CancelConditionOrder()``` function is used to cancel a conditional order. |
| `exchange.GetConditionOrder` | The ```exchange.GetConditionOrder()``` function is used to retrieve information about a specified conditional order. |
| `exchange.GetConditionOrders` | ```exchange.GetConditionOrders()``` function is used to obtain unfinished conditional orders (conditional orders that have not yet been triggered or canceled). |
| `exchange.GetHistoryConditionOrders` | The ```exchange.GetHistoryConditionOrders()``` function is used to retrieve the historical conditional orders (including triggered, canceled, and expired con... |

### Account

| Name | Description |
| - | - |
| `exchange.GetAccount` | The ```exchange.GetAccount()``` function is used to request the exchange account information. |
| `exchange.GetAssets` | The ```exchange.GetAssets``` function is used to request the asset information of the exchange account. |

### Futures

| Name | Description |
| - | - |
| `exchange.SetContractType` | The ```exchange.SetContractType()``` function is used to set the current contract code of the exchange exchange object. |
| `exchange.GetContractType` | The ```exchange.GetContractType()``` function is used to get the contract code currently set for the exchange exchange object. |
| `exchange.SetDirection` | The ```exchange.SetDirection()``` function is used to set the order direction when calling the exchange.Buy function or exchange.Sell function to place futur... |
| `exchange.SetMarginLevel` | The ```exchange.SetMarginLevel()``` function is used to set the leverage value for the trading pair or contract specified by the ```symbol``` parameter. |
| `exchange.GetPositions` | ```exchange.GetPositions()``` function is used to get position information; the ```GetPositions()``` function is a member function of the exchange object exc... |
| `exchange.GetFundings` | The ```exchange.GetFundings()``` function is used to obtain the funding rate data for the current period. |

### Exchange

| Name | Description |
| - | - |
| `exchange.GetName` | The ```exchange.GetName()``` function is used to get the name of the exchange bound to the current exchange object. |
| `exchange.GetLabel` | The ```exchange.GetLabel()``` function is used to obtain the custom label set when configuring the exchange object. |
| `exchange.GetCurrency` | The ```exchange.GetCurrency()``` function is used to get the currently set trading pair. |
| `exchange.SetCurrency` | The ```exchange.SetCurrency()``` function is used to switch the current trading pair of the exchange object exchange. |
| `exchange.GetQuoteCurrency` | The ```exchange.GetQuoteCurrency()``` function is used to get the name of the quote currency of the current trading pair, i.e. |
| `exchange.GetPeriod` | Retrieves the K-line period configured on the FMZ Quant Trading platform website page when running a strategy in backtesting or live trading, i.e., the defau... |
| `exchange.SetMaxBarLen` | Set the maximum length of the K-line (candlestick chart). |
| `exchange.SetPrecision` | The ```exchange.SetPrecision()``` function is used to set the precision of the **price** and **order amount** for the ```exchange``` exchange object. |
| `exchange.GetRate` | Get the exchange rate currently set for the exchange object. |
| `exchange.SetRate` | Sets the current exchange rate for the exchange object. |
| `exchange.SetBase` | The ```exchange.SetBase()``` function is used to set the base URL of the exchange API interface used by the exchange exchange object. |
| `exchange.GetBase` | The ```exchange.GetBase()``` function is used to get the base address of the current exchange API interface. |
| `exchange.SetProxy` | The ```exchange.SetProxy()``` function is used to configure the proxy settings of the exchange exchange object. |
| `exchange.SetTimeout` | The ```exchange.SetTimeout()``` function is used to set the timeout for ```rest``` requests of the exchange exchange object. |
| `exchange.Encode` | The ```exchange.Encode()``` function is used to perform signature and encryption computations. |

### IO

| Name | Description |
| - | - |
| `exchange.IO` | ```exchange.IO()``` function is used to call other interfaces related to the exchange object. |
| ```exchange.IO("api", ...)``` | ```exchange.IO("api", ...)``` calls a raw REST endpoint of the exchange that has no wrapper function; the platform signs the request. |
| ```exchange.IO("currency", ...)``` | ```exchange.IO("currency", ...)``` switches the current trading pair of the exchange object at runtime. |
| ```exchange.IO("base", ...)``` | ```exchange.IO("base", ...)``` switches the base address of the trading API, and ```exchange.IO("mbase", ...)``` that of the market data API. |
| ```exchange.IO(mode, value)``` | ```exchange.IO(mode, value)``` switches trading modes of the exchange: simulated or live, cross or isolated margin, hedge or one-way positions, unified accou... |
| ```exchange.IO("rate", ...)``` | ```exchange.IO("rate", ...)``` and ```exchange.IO("quota", ...)``` limit how often API functions are called. |

### Network

| Name | Description |
| - | - |
| `HttpQuery` | Sends an HTTP request. |
| `HttpQuery_Go` | Sends an Http request. |
| `Dial` | Used for raw ```Socket``` access, supporting the ```tcp```, ```udp```, ```tls```, and ```unix``` protocols. |
| `Mail` | Send an email. |
| `Mail_Go` | Asynchronous version of the ```Mail``` function. |

### Storage

| Name | Description |
| - | - |
| `_G` | Persistently store data. |
| `DBExec` | Database interface function. |
| `SetChannelData` | Publishes the latest status data to a channel. |
| `GetChannelData` | Subscribes to the channel data of a specified live trading bot. |

### Threads

| Name | Description |
| - | - |
| `exchange.Go` | Multi-threaded asynchronous support function that can convert the operations of all supported functions into asynchronous concurrent execution. |
| `EventLoop` | Listens for events and returns when any ```WebSocket``` has readable data, or when concurrent tasks such as ```exchange.Go()``` or ```HttpQuery_Go()``` compl... |

#### Threads/threading

| Name | Description |
| - | - |
| `Thread` | The ```Thread()``` function is used to create concurrent threads. |
| `getThread` | The ```getThread()``` function is used to get a thread object based on the specified thread ID. |
| `mainThread` | The ```mainThread()``` function is used to get the thread object of the main thread, which is the thread where the ```main()``` function in the strategy is l... |
| `currentThread` | The ```currentThread()``` function is used to get the thread object of the current thread. |
| `Lock` | The ```Lock()``` function is used to create a thread lock object. |
| `Condition` | The ```Condition()``` function is used to create a condition variable object, which is used to implement synchronization and communication between threads in... |
| `Event` | The ```Event()``` function is used to create a *thread event* object, which is used for synchronization between threads, allowing one thread to wait for noti... |
| `Dict` | The ```Dict()``` function is used to create a dictionary object for passing and sharing data between concurrent threads. |
| `Serve` | The ```Serve()``` function starts an HTTP, TCP or WebSocket (over HTTP) service inside the strategy process and returns a Server object. |
| `pending` | The ```pending``` function is used to get the number of concurrent threads currently running in the strategy program. |

#### Threads/Thread

| Name | Description |
| - | - |
| `peekMessage` | The ```peekMessage()``` function is used to receive messages from a thread. |
| `postMessage` | The ```postMessage()``` function is used to send messages to a thread. |
| `join` | The ```join()``` function is used to wait for a thread to exit and reclaim system resources. |
| `terminate` | The ```terminate()``` function is used to forcibly terminate a thread and release the hardware resources occupied when the thread was created. |
| `getData` | The ```getData()``` function is used to access variables recorded in the thread environment. |
| `setData` | The ```setData()``` function is used to store variables in the thread environment. |
| `id` | The ```id()``` function is used to return the ```threadId``` of the current multi-threaded object instance. |
| `name` | The ```name()``` function is used to return the name of the current multi-threaded object instance. |
| `eventLoop` | The ```eventLoop()``` function is used to listen for events received by the current thread. |

#### Threads/ThreadLock

| Name | Description |
| - | - |
| `acquire` | The ```acquire()``` function is used to request a thread lock (acquire lock). |
| `release` | The ```release()``` function is used to release a thread lock (unlock). |

#### Threads/ThreadEvent

| Name | Description |
| - | - |
| `set` | The ```set()``` function is used to set an event signal. |
| `clear` | The ```clear()``` function is used to clear the signal. |
| `wait` | The ```wait()``` function is used to set event (signal) waiting, which will block until the event (signal) is set; supports setting timeout parameters. |
| `isSet` | The ```isSet()``` function is used to determine whether an event (signal) has been set. |

#### Threads/ThreadCondition

| Name | Description |
| - | - |
| `notify` | The ```notify()``` function is used to wake up one waiting thread (if any exists). |
| `notifyAll` | The ```notifyAll()``` function is used to wake up all waiting threads. |
| `wait` | The ```wait()``` function is used to put a thread into a waiting state under specific conditions. |
| `acquire` | The ```acquire()``` function is used to request a thread lock (acquire lock). |
| `release` | The ```release()``` function is used to release the thread lock (unlock). |

#### Threads/ThreadDict

| Name | Description |
| - | - |
| `get` | The ```get()``` function is used to retrieve the value of a key recorded in a dictionary object. |
| `set` | The ```set()``` function is used to set key-value pairs. |

#### Threads/Server

| Name | Description |
| - | - |
| `addr` | The ```addr()``` function returns the address and port the service actually listens on. |
| `close` | The ```close()``` function stops accepting new connections; handlers already running finish normally (graceful shutdown). |
| `stop` | The ```stop()``` function closes the service (as ```close()```) and then terminates every handler thread that is still running. |
| `join` | The ```join()``` function waits until the service is closed and no handler is running. |
| `pending` | The ```pending()``` function returns the number of handlers currently running, i.e. |

### Web3

| Name | Description |
| - | - |
| ```exchange.IO("abi", ...)``` | On the FMZ Quant Trading Platform, various blockchain-related functions and calls are mainly implemented through the ```exchange.IO()``` function. |
| ```exchange.IO("api", blockChain, ...)``` | The ```exchange.IO("api", "eth", ...)``` calling method is used to call Ethereum RPC methods (select eth when configuring the Web3 exchange object). |
| ```exchange.IO("encode", ...)``` | The ```exchange.IO("encode", ...)``` function is called in this way for data encoding. |
| ```exchange.IO("encodePacked", ...)``` | The ```exchange.IO("encodePacked", ...)``` function is used to perform ```encodePacked``` encoding operations. |
| ```exchange.IO("decode", ...)``` | The ```exchange.IO("decode", ...)``` calling method is used to decode data. |
| ```exchange.IO("hash", ...)``` | The ```exchange.IO("hash", ...)``` call computes hash digests and HMACs, signs with the private key configured on the exchange object, and so on. |
| ```exchange.IO("key", ...)``` | The ```exchange.IO("key", ...)``` function is used to switch the private key calling method. |
| ```exchange.IO("sign", ...)``` | The ```exchange.IO("sign", ...)``` calling method is used to sign a 32-byte hash with a secp256k1 private key and returns signature data such as r, s, and v. |
| ```exchange.IO("signTypedData", ...)``` | The ```exchange.IO("signTypedData", ...)``` calling method is used to sign structured data according to the EIP-712 standard. |
| ```exchange.IO("signMessage", ...)``` | The ```exchange.IO("signMessage", ...)``` calling method is used to sign messages according to the EIP-191 standard (```personal_sign```). |
| ```exchange.IO("api", ...)``` | The ```exchange.IO("api", ...)``` calling method is used to call methods of smart contracts. |
| ```exchange.IO("call", ...)``` | The ```exchange.IO("call", ...)``` calling method simulates the execution of any smart contract method (including write methods that modify on-chain state) v... |
| ```exchange.IO("multicall", ...)``` | The ```exchange.IO("multicall", ...)``` calling method is used to batch-read the results of multiple contract calls in a single request through the Multicall... |
| ```exchange.IO("logs", ...)``` | The ```exchange.IO("logs", ...)``` calling method is used to query the event logs of a contract (```eth_getLogs```) and decode them according to the ABI. |
| ```exchange.IO("waitReceipt", ...)``` | The ```exchange.IO("waitReceipt", ...)``` calling method is used to wait for a transaction to be included on-chain and reach the specified number of confirma... |
| ```exchange.IO("nonce", ...)``` | The ```exchange.IO("nonce", ...)``` function call is used to query, synchronize, or set the nonce counter used when sending transactions. |
| ```exchange.IO("speedUp", ...)``` | The ```exchange.IO("speedUp", ...)``` call is used to resend a stuck transaction (one that has not been mined for a long time) with a higher fee: the recipie... |
| ```exchange.IO("cancelTx", ...)``` | The ```exchange.IO("cancelTx", ...)``` calling method is used to cancel a transaction that has not yet been included on-chain: it sends a zero-amount transac... |
| ```exchange.IO("toUnits", ...)``` | The ```exchange.IO("toUnits", ...)``` function call is used to convert a human-readable amount into an on-chain integer. |
| ```exchange.IO("fromUnits", ...)``` | The ```exchange.IO("fromUnits", ...)``` calling method is used to convert an on-chain integer value into a human-readable amount. |
| ```exchange.IO("uniswapV3", ...)``` | The ```exchange.IO("uniswapV3", ...)``` calling method is used for concentrated liquidity (Uniswap V3) related calculations, including conversions between ti... |
| ```exchange.IO("contracts", ...)``` | The ```exchange.IO("contracts", ...)``` call is used to obtain commonly used contract addresses on the current chain (or a specified chain), including mainst... |
| `exchange.IO("address")` | The ```exchange.IO("address")``` call returns the address of the wallet configured on the exchange object. |
| ```exchange.IO("base", ...)``` | The ```exchange.IO("base", ...)``` calling method is used to set the RPC node address, and supports setting multiple nodes as backups for each other. |
| ```exchange.IO("sendBase", ...)``` | The ```exchange.IO("sendBase", ...)``` call is used to set a node dedicated solely to broadcasting transactions. |

### Uniswap

| Name | Description |
| - | - |
| ```exchange.IO("transfer", ...)``` | The ```exchange.IO("transfer", ...)``` call transfers the chain's native coin (such as ETH or BNB) or an ERC20 token out of the wallet configured on the Unis... |
| ```exchange.IO("receipt", ...)``` | When called as ```exchange.IO("receipt", ...)```, this function queries the receipt of a transaction sent by the Uniswap exchange object (such as an order or... |
| ```exchange.IO("route", ...)``` | The ```exchange.IO("route", ...)``` call requests quotes on a Uniswap exchange object. |
| ```exchange.IO("simulate", ...)``` | The ```exchange.IO("simulate", ...)``` call builds a swap transaction using the same order logic as the Uniswap exchange object (route selection, quoting and... |
| ```exchange.IO("token", ...)``` | The ```exchange.IO("token", ...)``` call is used to register a token on a Uniswap exchange object, or to list the token table. |
| ```exchange.IO("wrap", ...)``` | The ```exchange.IO("wrap", ...)``` call wraps the native coin (ETH, BNB) into the wrapped coin (WETH, WBNB) on a Uniswap exchange object: 1:1, no slippage, o... |
| ```exchange.IO("unwrap", ...)``` | The ```exchange.IO("unwrap", ...)``` call unwraps the wrapped coin (WETH, WBNB) into the native coin (ETH, BNB) on a Uniswap exchange object: 1:1, no slippag... |
| ```exchange.IO("approve", ...)``` | When called as ```exchange.IO("approve", ...)```, this function sets the token approval mode on a Uniswap exchange object. |
| ```exchange.IO("slippage", ...)``` | When called this way, ```exchange.IO("slippage", ...)``` sets slippage protection for market orders on a Uniswap exchange object. |
| ```exchange.IO("deadline", ...)``` | The ```exchange.IO("deadline", ...)``` call sets the transaction deadline on a Uniswap exchange object. |
| ```exchange.IO("gasMultiplier", ...)``` | ```exchange.IO("gasMultiplier", ...)``` is used to set the gas limit multiplier on a Uniswap exchange object. |

### TA

| Name | Description |
| - | - |
| `TA.MACD` | The ```TA.MACD()``` function is used to calculate the **Moving Average Convergence Divergence (MACD) indicator**. |
| `TA.KDJ` | The ```TA.KDJ()``` function is used to calculate the **Stochastic Oscillator (KDJ)**. |
| `TA.RSI` | The ```TA.RSI()``` function is used to calculate the **Relative Strength Index (RSI)**. |
| `TA.ATR` | The ```TA.ATR()``` function is used to calculate the **Average True Range indicator (ATR)**. |
| `TA.OBV` | ```TA.OBV()``` function is used to calculate the **On-Balance Volume (OBV)**. |
| `TA.MA` | The ```TA.MA()``` function is used to calculate the **Moving Average indicator (Moving Average)**. |
| `TA.EMA` | The ```TA.EMA()``` function is used to calculate the **Exponential Moving Average (EMA) indicator**. |
| `TA.BOLL` | The ```TA.BOLL()``` function is used to calculate the **Bollinger Bands indicator**. |
| `TA.Alligator` | ```TA.Alligator()``` function is used to calculate the **Alligator indicator**. |
| `TA.CMF` | The ```TA.CMF()``` function is used to calculate the **Chaikin Money Flow (CMF)** indicator. |
| `TA.Highest` | The ```TA.Highest()``` function is used to calculate the **highest price within a period**. |
| `TA.Lowest` | The ```TA.Lowest()``` function is used to calculate the **lowest price over a period**. |
| `TA.SMA` | The ```TA.SMA()``` function is used to calculate the **Simple Moving Average (SMA) indicator**. |

#### Talib/OverlapStudies

| Name | Description |
| - | - |
| `talib.BBANDS` | The ```talib.BBANDS()``` function is used to calculate **Bollinger Bands**. |
| `talib.DEMA` | The ```talib.DEMA()``` function is used to calculate **Double Exponential Moving Average**. |
| `talib.EMA` | The ```talib.EMA()``` function is used to calculate **Exponential Moving Average**. |
| `talib.HT_TRENDLINE` | The ```talib.HT_TRENDLINE()``` function is used to calculate **Hilbert Transform - Instantaneous Trendline**. |
| `talib.KAMA` | The ```talib.KAMA()``` function is used to calculate **Kaufman Adaptive Moving Average**. |
| `talib.MA` | The ```talib.MA()``` function is used to calculate **Moving average**. |
| `talib.MAMA` | The ```talib.MAMA()``` function is used to calculate the **MESA Adaptive Moving Average**. |
| `talib.MIDPOINT` | The ```talib.MIDPOINT()``` function is used to calculate **MidPoint over period**. |
| `talib.MIDPRICE` | The ```talib.MIDPRICE()``` function is used to calculate **Midpoint Price over period**. |
| `talib.SAR` | The ```talib.SAR()``` function is used to calculate the **Parabolic SAR (Stop and Reverse)** indicator. |
| `talib.SAREXT` | The ```talib.SAREXT()``` function is used to calculate **Parabolic SAR - Extended**. |
| `talib.SMA` | The ```talib.SMA()``` function is used to calculate **Simple Moving Average**. |
| `talib.T3` | The ```talib.T3()``` function is used to calculate **Triple Exponential Moving Average (T3)**. |
| `talib.TEMA` | The ```talib.TEMA()``` function is used to calculate **Triple Exponential Moving Average**. |
| `talib.TRIMA` | The ```talib.TRIMA()``` function is used to calculate **Triangular Moving Average**. |
| `talib.WMA` | The ```talib.WMA()``` function is used to calculate **Weighted Moving Average**. |

#### Talib/MomentumIndicators

| Name | Description |
| - | - |
| `talib.ADX` | The ```talib.ADX()``` function is used to calculate the **Average Directional Movement Index**. |
| `talib.ADXR` | The ```talib.ADXR()``` function is used to calculate the **Average Directional Movement Index Rating**. |
| `talib.APO` | The ```talib.APO()``` function is used to calculate **Absolute Price Oscillator**. |
| `talib.AROON` | The ```talib.AROON()``` function is used to calculate **Aroon (Aroon Indicator)**. |
| `talib.AROONOSC` | The ```talib.AROONOSC()``` function is used to calculate the **Aroon Oscillator**. |
| `talib.BOP` | The ```talib.BOP()``` function is used to calculate **Balance Of Power**. |
| `talib.CCI` | The ```talib.CCI()``` function is used to calculate the **Commodity Channel Index**. |
| `talib.CMO` | The ```talib.CMO()``` function is used to calculate the **Chande Momentum Oscillator**. |
| `talib.DX` | The ```talib.DX()``` function is used to calculate the **Directional Movement Index**. |
| `talib.MACD` | The ```talib.MACD()``` function is used to calculate **Moving Average Convergence/Divergence**. |
| `talib.MACDEXT` | The ```talib.MACDEXT()``` function is used to calculate **MACD with controllable MA type**. |
| `talib.MACDFIX` | The ```talib.MACDFIX()``` function is used to calculate **Moving Average Convergence/Divergence Fix 12/26**. |
| `talib.MFI` | The ```talib.MFI()``` function is used to calculate **Money Flow Index**. |
| `talib.MINUS_DI` | The ```talib.MINUS_DI()``` function is used to calculate the **Minus Directional Indicator**. |
| `talib.MINUS_DM` | The ```talib.MINUS_DM()``` function is used to calculate **Minus Directional Movement**. |
| `talib.MOM` | The ```talib.MOM()``` function is used to calculate **Momentum (Momentum Indicator)**. |
| `talib.PLUS_DI` | The ```talib.PLUS_DI()``` function is used to calculate the **Plus Directional Indicator**. |
| `talib.PLUS_DM` | The ```talib.PLUS_DM()``` function is used to calculate **Plus Directional Movement**. |
| `talib.PPO` | The ```talib.PPO()``` function is used to calculate **Percentage Price Oscillator**. |
| `talib.ROC` | The ```talib.ROC()``` function is used to calculate the **Rate of Change indicator: ((price/prevPrice)-1)*100**. |
| `talib.ROCP` | The ```talib.ROCP()``` function is used to calculate **Rate of change Percentage: (price-prevPrice)/prevPrice**. |
| `talib.ROCR` | The ```talib.ROCR()``` function is used to calculate **Rate of change ratio: (price/prevPrice)**. |
| `talib.ROCR100` | The ```talib.ROCR100()``` function is used to calculate **Rate of change ratio 100 scale: (price/prevPrice)*100**. |
| `talib.RSI` | The ```talib.RSI()``` function is used to calculate the **Relative Strength Index**. |
| `talib.STOCH` | The ```talib.STOCH()``` function is used to calculate the **Stochastic Oscillator (STOCH indicator)**. |
| `talib.STOCHF` | The ```talib.STOCHF()``` function is used to calculate **Stochastic Fast**. |
| `talib.STOCHRSI` | The ```talib.STOCHRSI()``` function is used to calculate the **Stochastic Relative Strength Index**. |
| `talib.TRIX` | The ```talib.TRIX()``` function is used to calculate **1-day Rate-Of-Change (ROC) of a Triple Smooth EMA**. |
| `talib.ULTOSC` | The ```talib.ULTOSC()``` function is used to calculate the **Ultimate Oscillator**. |
| `talib.WILLR` | The ```talib.WILLR()``` function is used to calculate **Williams' %R (Williams Percent Range)**. |

#### Talib/VolumeIndicators

| Name | Description |
| - | - |
| `talib.AD` | The ```talib.AD()``` function is used to calculate the **Chaikin A/D Line (Accumulation/Distribution Line indicator)**. |
| `talib.ADOSC` | The ```talib.ADOSC()``` function is used to calculate **Chaikin A/D Oscillator**. |
| `talib.OBV` | The ```talib.OBV()``` function is used to calculate **On Balance Volume**. |

#### Talib/VolatilityIndicators

| Name | Description |
| - | - |
| `talib.ATR` | The ```talib.ATR()``` function is used to calculate the **Average True Range** indicator. |
| `talib.NATR` | The ```talib.NATR()``` function is used to calculate **Normalized Average True Range**. |
| `talib.TRANGE` | The ```talib.TRANGE()``` function is used to calculate the **True Range** indicator. |

#### Talib/CycleIndicators

| Name | Description |
| - | - |
| `talib.HT_DCPERIOD` | The ```talib.HT_DCPERIOD()``` function is used to calculate **Hilbert Transform - Dominant Cycle Period**. |
| `talib.HT_DCPHASE` | The ```talib.HT_DCPHASE()``` function is used to calculate the **Hilbert Transform - Dominant Cycle Phase**. |
| `talib.HT_PHASOR` | The ```talib.HT_PHASOR()``` function is used to calculate **Hilbert Transform - Phasor Components**. |
| `talib.HT_SINE` | The ```talib.HT_SINE()``` function is used to calculate **Hilbert Transform - SineWave**. |
| `talib.HT_TRENDMODE` | The ```talib.HT_TRENDMODE()``` function is used to calculate **Hilbert Transform - Trend vs Cycle Mode**. |

#### Talib/PriceTransform

| Name | Description |
| - | - |
| `talib.AVGPRICE` | The ```talib.AVGPRICE()``` function is used to calculate **Average Price**. |
| `talib.MEDPRICE` | The ```talib.MEDPRICE()``` function is used to calculate **Median Price**. |
| `talib.TYPPRICE` | The ```talib.TYPPRICE()``` function is used to calculate **Typical Price**. |
| `talib.WCLPRICE` | The ```talib.WCLPRICE()``` function is used to calculate **Weighted Close Price**. |

#### Talib/StatisticFunctions

| Name | Description |
| - | - |
| `talib.LINEARREG` | The ```talib.LINEARREG()``` function is used to calculate the **Linear Regression** indicator. |
| `talib.LINEARREG_ANGLE` | The ```talib.LINEARREG_ANGLE()``` function is used to calculate **Linear Regression Angle**. |
| `talib.LINEARREG_INTERCEPT` | The ```talib.LINEARREG_INTERCEPT()``` function is used to calculate the **Linear Regression Intercept**. |
| `talib.LINEARREG_SLOPE` | The ```talib.LINEARREG_SLOPE()``` function is used to calculate **Linear Regression Slope**. |
| `talib.STDDEV` | The ```talib.STDDEV()``` function is used to calculate **Standard Deviation**. |
| `talib.TSF` | The ```talib.TSF()``` function is used to calculate **Time Series Forecast**. |
| `talib.VAR` | The ```talib.VAR()``` function is used to calculate **Variance**. |

#### Talib/MathTransform

| Name | Description |
| - | - |
| `talib.ACOS` | The ```talib.ACOS()``` function is used to calculate **Vector Trigonometric ACos**. |
| `talib.ASIN` | The ```talib.ASIN()``` function is used to calculate **Vector Trigonometric ASin**. |
| `talib.ATAN` | The ```talib.ATAN()``` function is used to calculate **Vector Trigonometric ATan**. |
| `talib.CEIL` | The ```talib.CEIL()``` function is used to calculate **Vector Ceil**. |
| `talib.COS` | The ```talib.COS()``` function is used to calculate **Vector Trigonometric Cos**. |
| `talib.COSH` | The ```talib.COSH()``` function is used to calculate **Vector Trigonometric Cosh**. |
| `talib.EXP` | The ```talib.EXP()``` function is used to calculate **Vector Arithmetic Exp**. |
| `talib.FLOOR` | The ```talib.FLOOR()``` function is used to calculate **Vector Floor**. |
| `talib.LN` | The ```talib.LN()``` function is used to calculate **Vector Log Natural**. |
| `talib.LOG10` | The ```talib.LOG10()``` function is used to calculate **Vector Log10 (logarithm function)**. |
| `talib.SIN` | The ```talib.SIN()``` function is used to calculate **Vector Trigonometric Sin**. |
| `talib.SINH` | The ```talib.SINH()``` function is used to calculate **Vector Trigonometric Sinh**. |
| `talib.SQRT` | The ```talib.SQRT()``` function is used to calculate **Vector Square Root**. |
| `talib.TAN` | The ```talib.TAN()``` function is used to calculate **Vector Trigonometric Tan**. |
| `talib.TANH` | The ```talib.TANH()``` function is used to calculate **Vector Trigonometric Tanh**. |

#### Talib/MathOperators

| Name | Description |
| - | - |
| `talib.MAX` | The ```talib.MAX()``` function is used to calculate the **Highest value over a specified period**. |
| `talib.MAXINDEX` | The ```talib.MAXINDEX()``` function is used to calculate the **Index of highest value over a specified period**. |
| `talib.MIN` | The ```talib.MIN()``` function is used to calculate the **Lowest value over a specified period**. |
| `talib.MININDEX` | The ```talib.MININDEX()``` function is used to calculate the **Index of lowest value over a specified period**. |
| `talib.MINMAX` | The ```talib.MINMAX()``` function is used to calculate the **Lowest and highest values over a specified period**. |
| `talib.MINMAXINDEX` | The ```talib.MINMAXINDEX()``` function is used to calculate **Indexes of lowest and highest values over a specified period**. |
| `talib.SUM` | The ```talib.SUM()``` function is used to calculate **Summation**. |

#### Talib/PatternRecognition

| Name | Description |
| - | - |
| `talib.CDL2CROWS` | The ```talib.CDL2CROWS()``` function is used to calculate **Two Crows (K-line pattern - Two Crows)**. |
| `talib.CDL3BLACKCROWS` | The ```talib.CDL3BLACKCROWS()``` function is used to calculate **Three Black Crows (K-line pattern - Three Black Crows)**. |
| `talib.CDL3INSIDE` | The ```talib.CDL3INSIDE()``` function is used to calculate **Three Inside Up/Down (Candlestick Pattern: Three Inside Up/Down)**. |
| `talib.CDL3LINESTRIKE` | The ```talib.CDL3LINESTRIKE()``` function is used to calculate **Three-Line Strike (Candlestick Pattern: Three-Line Strike)**. |
| `talib.CDL3OUTSIDE` | The ```talib.CDL3OUTSIDE()``` function is used to calculate **Three Outside Up/Down (Candlestick Pattern: Three Outside)**. |
| `talib.CDL3STARSINSOUTH` | The ```talib.CDL3STARSINSOUTH()``` function is used to calculate **Three Stars In The South (Candlestick Pattern: Three Stars In The South)**. |
| `talib.CDL3WHITESOLDIERS` | The ```talib.CDL3WHITESOLDIERS()``` function is used to calculate **Three Advancing White Soldiers (K-line pattern: Three White Soldiers)**. |
| `talib.CDLABANDONEDBABY` | The ```talib.CDLABANDONEDBABY()``` function is used to calculate **Abandoned Baby (Candlestick Pattern: Abandoned Baby)**. |
| `talib.CDLADVANCEBLOCK` | The ```talib.CDLADVANCEBLOCK()``` function is used to calculate **Advance Block (Candlestick Pattern: Advance Block)**. |
| `talib.CDLBELTHOLD` | The ```talib.CDLBELTHOLD()``` function is used to calculate **Belt-hold (Candlestick Pattern: Belt-hold)**. |
| `talib.CDLBREAKAWAY` | The ```talib.CDLBREAKAWAY()``` function is used to calculate **Breakaway (Candlestick Pattern: Breakaway Pattern)**. |
| `talib.CDLCLOSINGMARUBOZU` | The ```talib.CDLCLOSINGMARUBOZU()``` function is used to calculate the **Closing Marubozu** candlestick pattern. |
| `talib.CDLCONCEALBABYSWALL` | The ```talib.CDLCONCEALBABYSWALL()``` function is used to calculate **Concealing Baby Swallow (Candlestick Pattern: Concealing Baby Swallow)**. |
| `talib.CDLCOUNTERATTACK` | The ```talib.CDLCOUNTERATTACK()``` function is used to calculate **Counterattack Lines (K-Line Pattern: Counterattack)**. |
| `talib.CDLDARKCLOUDCOVER` | The ```talib.CDLDARKCLOUDCOVER()``` function is used to calculate **Dark Cloud Cover candlestick pattern**. |
| `talib.CDLDOJI` | The ```talib.CDLDOJI()``` function is used to calculate **Doji (K-line pattern: Doji Star)**. |
| `talib.CDLDOJISTAR` | The ```talib.CDLDOJISTAR()``` function is used to calculate **Doji Star (Candlestick Pattern: Doji Star)**. |
| `talib.CDLDRAGONFLYDOJI` | The ```talib.CDLDRAGONFLYDOJI()``` function is used to calculate **Dragonfly Doji (Candlestick Pattern: Dragonfly Doji)**. |
| `talib.CDLENGULFING` | The ```talib.CDLENGULFING()``` function is used to calculate **Engulfing Pattern**. |
| `talib.CDLEVENINGDOJISTAR` | The ```talib.CDLEVENINGDOJISTAR()``` function is used to calculate **Evening Doji Star (K-line pattern: Evening Doji Star)**. |
| `talib.CDLEVENINGSTAR` | The ```talib.CDLEVENINGSTAR()``` function is used to calculate the **Evening Star** candlestick pattern. |
| `talib.CDLGAPSIDESIDEWHITE` | The ```talib.CDLGAPSIDESIDEWHITE()``` function is used to calculate **Up/Down-gap side-by-side white lines (K-line pattern: Up/Down-gap side-by-side white li... |
| `talib.CDLGRAVESTONEDOJI` | The ```talib.CDLGRAVESTONEDOJI()``` function is used to calculate the **Gravestone Doji** candlestick pattern. |
| `talib.CDLHAMMER` | The ```talib.CDLHAMMER()``` function is used to calculate **Hammer (Candlestick Pattern: Hammer)**. |
| `talib.CDLHANGINGMAN` | The ```talib.CDLHANGINGMAN()``` function is used to calculate **Hanging Man (Candlestick Pattern: Hanging Man)**. |
| `talib.CDLHARAMI` | The ```talib.CDLHARAMI()``` function is used to calculate **Harami Pattern (K-line chart: bullish/bearish pattern)**. |
| `talib.CDLHARAMICROSS` | The ```talib.CDLHARAMICROSS()``` function is used to calculate **Harami Cross Pattern (Candlestick Pattern: Harami Cross)**. |
| `talib.CDLHIGHWAVE` | The ```talib.CDLHIGHWAVE()``` function is used to calculate **High-Wave Candle (Candlestick Pattern: High Wave Candle)**. |
| `talib.CDLHIKKAKE` | The ```talib.CDLHIKKAKE()``` function is used to calculate **Hikkake Pattern (Candlestick: Trap Pattern)**. |
| `talib.CDLHIKKAKEMOD` | The ```talib.CDLHIKKAKEMOD()``` function is used to calculate **Modified Hikkake Pattern (Candlestick: Modified Hikkake Pattern)**. |
| `talib.CDLHOMINGPIGEON` | The ```talib.CDLHOMINGPIGEON()``` function is used to calculate **Homing Pigeon (Candlestick Pattern: Homing Pigeon)**. |
| `talib.CDLIDENTICAL3CROWS` | The ```talib.CDLIDENTICAL3CROWS()``` function is used to calculate **Identical Three Crows (Candlestick Pattern: Identical Three Crows)**. |
| `talib.CDLINNECK` | The ```talib.CDLINNECK()``` function is used to calculate **In-Neck Pattern (Candlestick Chart: In-Neck Pattern)**. |
| `talib.CDLINVERTEDHAMMER` | The ```talib.CDLINVERTEDHAMMER()``` function is used to calculate **Inverted Hammer (K-Line Pattern: Inverted Hammer)**. |
| `talib.CDLKICKING` | The ```talib.CDLKICKING()``` function is used to calculate **Kicking (Candlestick Pattern: Kicking Pattern)**. |
| `talib.CDLKICKINGBYLENGTH` | The ```talib.CDLKICKINGBYLENGTH()``` function is used to calculate **Kicking - bull/bear determined by the longer marubozu (K-line pattern: Kicking Bull/Bear... |
| `talib.CDLLADDERBOTTOM` | The ```talib.CDLLADDERBOTTOM()``` function is used to calculate **Ladder Bottom (Candlestick Pattern: Ladder Bottom)**. |
| `talib.CDLLONGLEGGEDDOJI` | The ```talib.CDLLONGLEGGEDDOJI()``` function is used to calculate **Long Legged Doji (Candlestick Pattern: Long Legged Doji)**. |
| `talib.CDLLONGLINE` | The ```talib.CDLLONGLINE()``` function is used to calculate **Long Line Candle Pattern (Candlestick Chart: Long Line)**. |
| `talib.CDLMARUBOZU` | The ```talib.CDLMARUBOZU()``` function is used to calculate the **Marubozu (Candlestick Pattern: Shaven Head and Bottom)** pattern. |
| `talib.CDLMATCHINGLOW` | The ```talib.CDLMATCHINGLOW()``` function is used to calculate **Matching Low (Candlestick Pattern: Matching Low)**. |
| `talib.CDLMATHOLD` | The ```talib.CDLMATHOLD()``` function is used to calculate **Mat Hold (Candlestick Pattern: Mat Hold)**. |
| `talib.CDLMORNINGDOJISTAR` | The ```talib.CDLMORNINGDOJISTAR()``` function is used to calculate **Morning Doji Star (Candlestick Pattern: Morning Doji Star)**. |
| `talib.CDLMORNINGSTAR` | The ```talib.CDLMORNINGSTAR()``` function is used to calculate **Morning Star (Candlestick Pattern: Morning Star)**. |
| `talib.CDLONNECK` | The ```talib.CDLONNECK()``` function is used to calculate **On-Neck Pattern (Candlestick Chart: On-Neck Pattern)**. |
| `talib.CDLPIERCING` | The ```talib.CDLPIERCING()``` function is used to calculate **Piercing Pattern (Candlestick Pattern: Piercing Pattern)**. |
| `talib.CDLRICKSHAWMAN` | The ```talib.CDLRICKSHAWMAN()``` function is used to calculate **Rickshaw Man (Candlestick Pattern: Rickshaw Man)**. |
| `talib.CDLRISEFALL3METHODS` | The ```talib.CDLRISEFALL3METHODS()``` function is used to calculate **Rising/Falling Three Methods (Candlestick Pattern: Rising/Falling Three Methods)**. |
| `talib.CDLSEPARATINGLINES` | The ```talib.CDLSEPARATINGLINES()``` function is used to calculate **Separating Lines Pattern (Candlestick Chart: Separating Lines)**. |
| `talib.CDLSHOOTINGSTAR` | The ```talib.CDLSHOOTINGSTAR()``` function is used to calculate **Shooting Star (Candlestick Pattern: Shooting Star)**. |
| `talib.CDLSHORTLINE` | The ```talib.CDLSHORTLINE()``` function is used to calculate **Short Line Candle Pattern (K-Line: Short Line)**. |
| `talib.CDLSPINNINGTOP` | The ```talib.CDLSPINNINGTOP()``` function is used to calculate **Spinning Top (Candlestick Pattern: Spinning Top)**. |
| `talib.CDLSTALLEDPATTERN` | The ```talib.CDLSTALLEDPATTERN()``` function is used to calculate **Stalled Pattern (Candlestick Pattern: Stalled Pattern)**. |
| `talib.CDLSTICKSANDWICH` | The ```talib.CDLSTICKSANDWICH()``` function is used to calculate **Stick Sandwich (Candlestick Pattern: Stick Sandwich)**. |
| `talib.CDLTAKURI` | The ```talib.CDLTAKURI()``` function is used to calculate **Takuri (Dragonfly Doji with very long lower shadow)** candlestick pattern. |
| `talib.CDLTASUKIGAP` | The ```talib.CDLTASUKIGAP()``` function is used to calculate **Tasuki Gap (Candlestick Pattern: Tasuki Gap)**. |
| `talib.CDLTHRUSTING` | The ```talib.CDLTHRUSTING()``` function is used to calculate **Thrusting Pattern (Candlestick Pattern: Thrusting Pattern)**. |
| `talib.CDLTRISTAR` | The ```talib.CDLTRISTAR()``` function is used to calculate **Tristar Pattern (Candlestick Chart: Tristar Pattern)**. |
| `talib.CDLUNIQUE3RIVER` | The ```talib.CDLUNIQUE3RIVER()``` function is used to calculate **Unique 3 River (Candlestick Pattern: Unique Three River)**. |
| `talib.CDLUPSIDEGAP2CROWS` | The ```talib.CDLUPSIDEGAP2CROWS()``` function is used to calculate **Upside Gap Two Crows (Candlestick Pattern: Two Crows)**. |
| `talib.CDLXSIDEGAP3METHODS` | The ```talib.CDLXSIDEGAP3METHODS()``` function is used to calculate **Upside/Downside Gap Three Methods (Candlestick Pattern Recognition)**. |

### OS

| Name | Description |
| - | - |
| `ListFilesResult` | File list object used to record directory listing information. |
| `FileStat` | File statistics information object. |

#### OS/os

| Name | Description |
| - | - |
| `open` | Open a file in the specified mode. |
| `fgets` | Read the entire file content at once. |
| `fputs` | Write content to a file. |
| `mmap` | Memory-mapped file, returns the binary data of the file. |
| `getRootDir` | Get the root directory path for file operations. |
| `listFiles` | List files and subdirectories in the specified directory. |
| `exists` | Check if the specified file or directory exists. |
| `remove` | Delete the specified file. |
| `mkdir` | Create a directory. |
| `rmdir` | Remove a directory and all its contents. |
| `rename` | Rename a file or move a file. |
| `stat` | Get detailed statistics information of a file. |
| `exit` | Exit the program. |

#### OS/File

| Name | Description |
| - | - |
| `close` | Close the file and release associated resources. |
| `puts` | Write one or more strings to a file. |
| `printf` | Write formatted data to file. |
| `flush` | Flush the file buffer to ensure data is written to disk. |
| `tell` | Get the current file pointer position. |
| `seek` | Move the file pointer to a specified position. |
| `eof` | Check if the file pointer has reached the end of file. |
| `read` | Read data from a file. |
| `write` | Write string data to a file. |
| `getline` | Read the next line from the file. |
| `toString` | Get the string representation of the file object. |

## Structures

| Name | Description |
| - | - |
| `Ticker` | Market data structure. |
| `Depth` | Market depth data structure. |
| `OrderBook` | Order structure in market depth. |
| `Trade` | Data structure for market trade records. |
| `Record` | Data structure for candlestick bars in standard OHLC format, used for charting candlesticks and calculating technical indicators. |
| `Market` | Data structure for trading symbol market information. |
| `Order` | Order structure. |
| `Condition` | Conditional order configuration structure, used to set trigger conditions and execution prices for conditional orders. |
| `Account` | Data structure for account information. |
| `Asset` | Data structure for specific currency asset information. |
| `Position` | Data structure for contract position information. |
| `Funding` | Data structure for trading instrument funding rate information, only cryptocurrency perpetual contracts support funding rate functionality. |

### OtherStruct

| Name | Description |
| - | - |
| `HttpQuery-options` | This JSON structure is used to configure various parameters for HTTP requests sent by HttpQuery and HttpQuery_Go functions. |
| `HttpQuery-return` | This JSON structure is the data structure returned by the HttpQuery function in debug mode, when the debug field is set to true in the ```options``` paramete... |
| `LogStatus-table` | This JSON structure is used to configure the table content displayed in the strategy status bar. |
| `LogStatus-btnTypeOne` | This JSON structure is used to configure button controls in the status bar. |
| `LogStatus-btnTypeTwo` | This JSON structure is used to configure button controls in the status bar. |
| `Chart-options` | This JSON is used to configure chart settings for the custom plotting function ```Chart()```. |
| `KLineChart-options` | This JSON is used to configure the chart settings for the custom drawing function ```KLineChart```. |
| `SetData-data` | This JSON is used to set the data to be loaded by the ```exchange.SetData()``` function. |
| `EventLoop-return` | This JSON is the data structure returned by the ```EventLoop()``` function. |
| `DBExec-return` | This JSON is the data structure returned by the ```DBExec()``` function; this JSON data structure is also returned when executing SQL statements using the ``... |
| `Thread.join-return` | This JSON is the data structure returned by the ```join()``` member function of the ```Thread``` object, used to store information related to concurrent thre... |

## Built-in Variables and Constants

### EXCHANGE

| Name | Description |
| - | - |
| `exchange` | exchange is an exchange object, and it is also the first exchange object added in the strategy live trading settings and backtesting settings. |
| `exchanges` | exchanges is an array of exchange objects that contains all the exchange objects added in the strategy's live trading settings or backtesting settings, where... |

### ORDER_STATE

| Name | Description |
| - | - |
| `ORDER_STATE_PENDING` | ORDER_STATE_PENDING is the value of the ```Status``` property in the Order structure, indicating that the order status is pending. |
| `ORDER_STATE_CLOSED` | ORDER_STATE_CLOSED is the value of the ```Status``` property in the Order structure, indicating that the order status is completed. |
| `ORDER_STATE_CANCELED` | ORDER_STATE_CANCELED is the value of the ```Status``` property in the Order structure, indicating that the order status is canceled. |
| `ORDER_STATE_UNKNOWN` | ORDER_STATE_UNKNOWN is the value of the ```Status``` property in the Order structure, indicating that the order status is unknown (other status). |

### ORDER_TYPE

| Name | Description |
| - | - |
| `ORDER_TYPE_BUY` | ORDER_TYPE_BUY is the value of the ```Type``` property in the Order structure, representing a buy order type. |
| `ORDER_TYPE_SELL` | ORDER_TYPE_SELL is the ```Type``` property value in the Order structure, used to indicate a sell order type. |

### ORDER_CONDITION_TYPE

| Name | Description |
| - | - |
| `ORDER_CONDITION_TYPE_OCO` | ORDER_CONDITION_TYPE_OCO is the value of the ```ConditionType``` property in the Condition structure, representing OCO orders (One-Cancels-the-Other). |
| `ORDER_CONDITION_TYPE_TP` | ORDER_CONDITION_TYPE_TP is the ```ConditionType``` attribute value in the Condition structure, representing a Take Profit order. |
| `ORDER_CONDITION_TYPE_SL` | ORDER_CONDITION_TYPE_SL is the ```ConditionType``` attribute value in the Condition structure, representing a Stop Loss order. |
| `ORDER_CONDITION_TYPE_GENERIC` | ORDER_CONDITION_TYPE_GENERIC is the ```ConditionType``` property value in the Condition structure, representing a generic conditional order. |

### POSITION_DIRECTION

| Name | Description |
| - | - |
| `PD_LONG` | PD_LONG is the value of the ```Type``` property in the Position structure, representing a long position type. |
| `PD_SHORT` | PD_SHORT is the value of the ```Type``` property in the Position structure, representing a short position type. |

### ORDER_OFFSET

| Name | Description |
| - | - |
| `ORDER_OFFSET_OPEN` | ORDER_OFFSET_OPEN is a value for the ```Offset``` property in the Order structure, indicating that the order is an opening position operation. |
| `ORDER_OFFSET_CLOSE` | ORDER_OFFSET_CLOSE is a value for the ```Offset``` property in the Order structure, indicating that the order is in the close position direction. |

### PERIOD

| Name | Description |
| - | - |
| `PERIOD_M1` | Constant representing 1-minute candlestick period, with a value of 60. |
| `PERIOD_M3` | Constant representing the 3-minute candlestick period, with a value of 180. |
| `PERIOD_M5` | Constant representing the 5-minute candlestick period, with a value of 300. |
| `PERIOD_M15` | Constant representing the 15-minute candlestick period, with a value of 900. |
| `PERIOD_M30` | Constant representing the 30-minute candlestick period, with a value of 1800 seconds. |
| `PERIOD_H1` | Constant representing 1-hour candlestick period, with a value of 3600. |
| `PERIOD_H2` | Constant representing the 2-hour candlestick period, with a value of 7200. |
| `PERIOD_H4` | Constant representing the 4-hour candlestick period, with a value of 14400. |
| `PERIOD_H6` | Constant representing the 6-hour candlestick period, with a value of 21600. |
| `PERIOD_H12` | Constant representing the 12-hour candlestick period, with a value of 43200. |
| `PERIOD_D1` | Constant representing 1-day candlestick period, with a value of 86400. |
| `PERIOD_D3` | Constant representing the 3-day candlestick period, with a value of 259200. |
| `PERIOD_W1` | Constant representing 1-week candlestick period, with a value of 604800 seconds. |

### LOG_TYPE

| Name | Description |
| - | - |
| `LOG_TYPE_BUY` | LOG_TYPE_BUY is an optional value for the ```LogType``` parameter of the exchange.Log function, used to set the log type printed by the ```exchange.Log``` fu... |
| `LOG_TYPE_SELL` | LOG_TYPE_SELL is an optional value for the ```LogType``` parameter of the exchange.Log function, used to set the ```exchange.Log``` function to print sell or... |
| `LOG_TYPE_CANCEL` | LOG_TYPE_CANCEL is an optional value for the ```LogType``` parameter of the exchange.Log function, used to set the ```exchange.Log``` function to print order... |

### Strategy Parameters

Parameters set in the strategy interface appear in the strategy code as global variables with the same names (global constants in Rust) and are accessed by name:
- ```JavaScript```, ```MyLanguage```: parameters can be read directly and the parameter variables can also be modified in code.
- ```Python```: parameters can be read directly; to assign a new value to one inside a function, declare it with ```global``` first.
- ```Rust```: parameters are constants that can only be read, not modified; see Programming Languages → Rust for the type of each kind of parameter.
- ```PINE```: interface parameters are created with the ```input()``` function.
- ```Blockly Visual```: there are no interface parameters.

![Strategy Parameter Settings Interface](https://www.fmz.com/upload/asset/2e46b5e593de3b2f11445.png)

#### Interface Parameter Types

| Variable (naming example) | Description | Type | Default Value (description) | Component Configuration (description) | Remarks |
| - | - | - | - | - | - |
| pNum       | Description of parameter pNum       | Numeric (number)     | Example: Set default value to 100; f64 in Rust strategies| Used to set the interface control bound to the current parameter: component type, minimum value, maximum value, grouping, filters, etc. | Remarks for parameter pNum, the value of pNum is numeric type |
| pBool      | Description of parameter pBool      | Boolean (true/false) | Use switch control to set default value, optional control not supported | Same as above                                                          | Remarks for parameter pBool, the value of pBool is boolean type |
| pStr       | Description of parameter pStr       | String (string)     | Example: Set default value to abc               | Same as above                                                          | Remarks for parameter pStr, the value of pStr is string type |
| pCombox    | Description of parameter pCombox    | Dropdown (selected)   | Set one or more options from the options      | Same as above                                                          | Remarks for parameter pCombox, the value of pCombox may have various forms |
| pSecretStr | Description of parameter pSecretStr | Encrypted string (string)     | Example: Set default value to xyz               | Same as above                                                          | Remarks for parameter pSecretStr, the value of pSecretStr is string type |

Interface parameters are configured in the strategy parameters area below the code editor on the strategy editing page. Please note the following:
1. In the default value option of parameter settings, the "Optional" control is optional by default. You can change the state of this control to set the current parameter as required. After setting a parameter as required, if the parameter is not set during backtesting or live trading, backtesting cannot be performed or live trading cannot be started.
2. Variable names for interface parameters in strategy code should not use reserved words (keywords) of the current programming language.
3. In the backtesting or live trading interface, hovering the mouse over the control bound to a parameter will display the parameter's remarks.
4. The "Description" of a parameter is the display name of the control bound to the parameter.
5. The "Variable" of a parameter refers to those in the table above: ```pNum```, ```pBool```, ```pStr```, ```pCombox```, ```pSecretStr```. They exist as global variables in the strategy code, so the values of strategy parameters can be modified in the code (except in Rust, where parameters are global constants and cannot be modified).
6. For "Encrypted string" and "String" type parameters, no quotes are needed when entering default values; all input is treated as strings. "Encrypted string" parameters are used the same way as "String" parameters, but encrypted strings are transmitted encrypted and not sent in plain text.
7. If a "String" type parameter is set to "Optional", when no parameter is filled in the control bound to the parameter, the value of the parameter variable is **empty string**;
  Similarly, the value of a "Numeric" parameter is **null**;
  Similarly, the value of a "Dropdown" parameter is **null**;
  Similarly, the value of an "Encrypted string" parameter is **null**.
  In ```Rust``` strategies, an optional parameter that is left empty has the zero value of its type: ```0``` for numbers, an empty string for strings and encrypted strings, ```false``` for booleans.
8. For dropdown type interface parameters (e.g., variable name ```pCombox```), when "Support multiple selection" is not enabled in "Component Configuration", the value of pCombox is the index or specific data of the currently selected option (when data is bound to options).
  If "Support multiple selection" is enabled, the value of pCombox is an array containing the indices or specific data of all currently selected options (when data is bound to options).

#### Component Configuration

Both strategy interface parameters and strategy interactive controls have a "Component Configuration" option. It sets the UI control used for the parameter (or interactive control), as well as the minimum, maximum, group, filter and so on.

Components supported by each type:
- Number (number)
  Input box (default), time picker, slider.
- Boolean (true/false)
  Switch only (default).
- String (string)
  Input box (default), text box, time picker, color picker, currency, trading symbol.
- Dropdown (selected)
  Dropdown (default), segmented control, currency, trading symbol.
- Encrypted string (string), strategy parameters only
  Encrypted input box only (default).
- Button (button), interactive controls only
  A single button (default), with no input.

**Group**

Enter a label in the "Group" box of the component configuration to put several strategy parameters in the same group (replacing the platform's old "Strategy Grouping" feature). Interactive controls can be grouped the same way (replacing the old "Interactive Control Grouping" feature).

**Filter**

In the component configuration of a strategy parameter, the "Filter" box takes a condition expression that controls whether the parameter is available (replacing the platform's old "Parameter Dependency" feature).
The filter is empty by default, meaning no filtering. Expressions such as ```a > b```, ```a == 1```, ```a```, ```!a``` and ```a >= 1 && a <= 10``` can be used. The parameter is available when the condition is true.
- With the filter ```a == 1```, the parameter's availability depends on the value of parameter ```a```: it is available when ```a``` equals 1, otherwise not.
- With the filter ```a >= 1 && a <= 10```, the parameter is available when ```a``` is greater than or equal to 1 and less than or equal to 10, otherwise not.
- With the filter ```!a```, the condition is "not a"; ```a``` can be a boolean or a number (```!0``` is true).

#### Save Parameter Settings

- Parameter saving in the backtesting system
  When backtesting, if you want to save the strategy parameters, you can click the "Save Backtest Settings" button after modifying the strategy parameters. For details, see Backtesting System → Backtest Configuration and Saving.

  | Variable | Description | Type | Default Value |
  | - | - | - | - |
  |number |Numeric type |Number (number) |1 |
  |string |String |String (string) |Hello FMZ |
  |combox |Dropdown box |Dropdown (selected) |1\|2\|3|
  |bool |Boolean value |Boolean (true/false) |true |
  |numberA@isShowA |Numeric A |Number (number) |2 |
  |isShowA |Whether to display the numberA parameter |Boolean (true/false) |false |

  The configured strategy parameters will be saved in the strategy in the form of code, for example:

  ```js
  /*backtest
  start: 2020-02-29 00:00:00
  end: 2020-03-29 00:00:00
  period: 1d
  args: [["number",2],["string","Hello FMZ.COM"],["combox",2],["bool",false],["numberA@isShowA",666],["isShowA",true]]
  */
  ```

  ```python
  '''backtest
  start: 2020-02-29 00:00:00
  end: 2020-03-29 00:00:00
  period: 1d
  args: [["number",2],["string","Hello FMZ.COM"],["combox",2],["bool",false],["numberA@isShowA",666],["isShowA",true]]
  '''
  ```

  ```rust
  /*backtest
  start: 2020-02-29 00:00:00
  end: 2020-03-29 00:00:00
  period: 1d
  args: [["number",2],["string","Hello FMZ.COM"],["combox",2],["bool",false],["numberA@isShowA",666],["isShowA",true]]
  */
  ```

  If a ```Rust``` strategy declares dependencies in a frontmatter block at the top, the backtest configuration block must come after the frontmatter (see Programming Languages → Rust).
- Importing and exporting live trading parameters
  When running live trading, if you need to save the parameter data of the live trading configuration, you can click the "Parameter Settings" option on the strategy live trading page, then click the "Export Parameters" button. The exported strategy parameters will be saved as a ```json``` file.
  The exported strategy parameter configuration can also be imported into live trading again. Click the "Import Parameters" button to import the saved strategy live trading parameters into the current live trading, and after importing, click the "Update Parameters" button to save and apply them.

### Interactive Controls

Strategies in ```JavaScript```, ```Python```, ```Rust``` and MyLanguage can have interactive controls, which send interaction commands to the strategy while it is running live. In ```JavaScript```, ```Python``` and ```Rust``` strategies, the messages produced by interactive controls are read with the `GetCommand` function. The "Component Configuration" of interactive controls is the same as for strategy parameters (see Strategy Parameters → Component Configuration).

![Interactive Controls](https://www.fmz.com/upload/asset/2e4320d0cc33c15eb935d.png)

With code in the strategy that handles interactive control messages, interactive controls in live trading can be used for (among other things):
- Manually closing the strategy's positions.
- Changing strategy parameters dynamically without restarting the live trading.
- Switching strategy logic.
- Printing debugging information or data to test a feature.

#### Types of Interactive Controls

| Variable (naming example) | Description | Type | Default Value (description) | Component Configuration (description) | Notes |
| - | - | - | - | - | - |
| cmdNum | Description of interactive control cmdNum | Number type (number) | Default value is optional, can be left empty | Used to set the component type, minimum value, maximum value, grouping, etc. of the interface control bound to the current interactive item | Notes for interactive control cmdNum |
| cmdBool | Description of interactive control cmdBool | Boolean type (true/false) | Default value is required, on or off | Same as above | Notes for interactive control cmdBool |
| cmdStr | Description of interactive control cmdStr | String type (string) | Default value is optional, can be left empty | Same as above | Notes for interactive control cmdStr |
| cmdCombox | Description of interactive control cmdCombox | Dropdown (selected) | Default value is optional, can be left empty | Same as above | Notes for interactive control cmdCombox |
| cmdBtn | Description of interactive control cmdBtn | Button (button) | Button control does not bind input items | Same as above | Notes for interactive control cmdBtn |

Messages (strings) sent to the strategy after interactive control is triggered:
- Number type
  After entering interactive data ```123``` in the input box of interactive control ```cmdNum```, click the button of interactive control cmdNum. The ```GetCommand()``` function in the strategy program will receive the message: ```cmdNum:123```.
- Boolean type
  After setting the switch control of interactive control ```cmdBool``` to on, click the button of interactive control cmdBool. The ```GetCommand()``` function in the strategy program will receive the message: ```cmdBool:true```.
- String type
  After entering interactive data ```abc``` in the input box of interactive control ```cmdStr```, click the button of interactive control cmdStr. The ```GetCommand()``` function in the strategy program will receive the message: ```cmdStr:abc```.
- Dropdown
  After selecting the second option in the dropdown of interactive control ```cmdCombox```, click the button of interactive control cmdCombox. The ```GetCommand()``` function in the strategy program will receive the message: ```cmdCombox:1```, where 1 represents the index of the selected option, the first option has index 0, the second option has index 1.
- Button
  Click the button of interactive control ```cmdBtn```. The ```GetCommand()``` function in the strategy program will receive the message: ```cmdBtn```.

The "Component Configuration" of interactive controls is the same as for strategy parameters (see Strategy Parameters → Component Configuration).

**Example: changing a strategy parameter with an interactive control**

On the strategy editing page, add a string interactive control named ```changeSymbol``` under "Strategy Interaction". The settings of the interactive control:

![Setting up an interactive control](https://www.fmz.com/upload/asset/1741a2b35e569c5e07e3.png)

While the strategy runs live, enter ```ETH_USDT``` in the control's input box and click its button; ```GetCommand()``` receives the message ```changeSymbol:ETH_USDT```. The strategy detects the message and updates the corresponding variable (parameters set in the strategy interface are global variables too; a global variable in the code is used here for demonstration):

```js
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

In addition to designing interactive controls in the "Strategy Interaction" section, you can also design interactive controls in the strategy status bar. Currently, the only supported interactive control type is the button type. See `LogStatus`.

Button controls in the status bar can be divided into:
- Regular button controls
  Data structure example:
  ```json
  {"type": "button", "name": "Button 1", "cmd": "button1", "description": "This is the first button"}
  ```
- Button controls with a single input data
  Use the ```input``` attribute to set input control options. Data structure example:
  ```json
  {"type": "button", "name": "Button 2", "cmd": "button2", "description": "This is the second button", "input": {"name": "Open Quantity", "type": "number", "defValue": 1}}
  ```

  ```json
  {
      "type": "button",
      "cmd": "test1",
      "name": "test1",
      "input": {
          "type": "selected",
          "name": "selected",
          "label": "Dropdown",
          "description": "description",
          "default": 100,
          "settings": {
              "multiple": true,
              "customizable": true,
              "options":[{"name": "A", "value": 100}, {"name": "B", "value": 200}]
          }
      }
  }
  ```
- Button controls with a group of input data
  Use the ```group``` attribute to set options for a group of input controls. Data structure example:
  ```json
  {
      "type": "button",
      "cmd": "open",
      "name": "Open",
      "group": [
          {"name": "orderType", "description": "Order Method|order type", "type": "selected", "defValue": "Market Order|Limit Order"},
          {"name": "tradePrice@orderType==1", "description": "Trade Price|trade price", "type": "number", "defValue": 100},
          {"name": "orderAmount", "description": "Order Quantity|order amount", "type": "string", "defValue": 100},
          {"name": "boolean", "description": "Yes/No|boolean", "type": "boolean", "defValue": true}
      ]
  }
  ```

  ```json
  {
      "type": "button",
      "cmd": "test2",
      "name": "test2",
      "group": [{
          "type": "selected",
          "name": "selected",
          "label": "Dropdown",
          "description": "description",
          "default": 200,
          "group": "group1",
          "settings": {
              "multiple": true,
              "options":[{"name": "A", "value": 100}, {"name": "B", "value": 200}]
          }
      }, {
          "type": "string",
          "name": "string",
          "label": "Input Box",
          "description": "description",
          "default": "ABC",
          "group": "group1"
      }]
  }
  ```

Encode the JSON data of these button controls as a JSON string, then wrap it with ``` ` ``` characters and output it in the status bar. Using JavaScript as an example:

```js
function main() {
    var btn = {"type": "button", "name": "Button 1", "cmd": "button1", "description": "This is the first button"}
    LogStatus("`" + JSON.stringify(btn) + "`")
}
```

These button controls can also be written into status bar tables. For detailed examples see `LogStatus`.

The ```input``` field structure is consistent with the single control structure in the ```group``` field. The following is a detailed explanation (an annotated JavaScript object):

```js
{
    "type": "selected",     // Control type (required field), supports: number, string, selected, boolean
    "name": "test",         // Name (required field when used in group)
    "label": "topic",       // Title (required field)
    "description": "desc",  // Tooltip information for the component
    "default": 1,           // Default value; if the settings field is not set in the current JSON structure, it is compatible with defValue, and defValue can be used instead of default
    "filter": "a>1",        // Selector, not setting this field means no filtering (display control); when this field is set, the control is not filtered (displayed) when the expression is true, and filtered (not displayed) when the expression is false
                            // For the selector, using the expression a>1 in this example, 'a' refers to the control value with name 'a' under the group field in the type=button structure, and this value is used to determine whether to filter
    "group": "group1",      // Grouping
    "settings": {}          // Component configuration, fields described below
}
```

Detailed explanation of each field in the component configuration ```settings```:
- ```settings.required```: Whether it is required.
- ```settings.disabled```: Whether it is disabled.
- ```settings.min```: Valid when ```type=number```, represents the minimum value.
- ```settings.max```: Valid when ```type=number```, represents the maximum value.
- ```settings.step```: Valid when ```type=number``` and ```render=slider```, represents the step size.
- ```settings.multiple```: Valid when ```type=selected```, indicates support for multiple selection.
- ```settings.customizable```: Valid when ```type=selected```, indicates support for customization; users can directly edit and add new options in the dropdown control. If a newly edited option is selected, the option's name will be used instead of the option's value when triggering the interaction.
- ```settings.options```: Valid when ```type=selected```, represents the selector's option data format: ```["Option 1", "Option 2"]```, ```[{'name':'xxx','value':0}, {'name':'xxx','value':1}]```.
- ```settings.render```: Render component type.
  When ```type=number```, ```settings.render``` is not set (defaults to number input box), options: ```slider``` (slider), ```date``` (date picker, returns timestamp).
  When ```type=string```, ```settings.render``` is not set (defaults to single-line input box), options: ```textarea``` (multi-line input), ```date``` (date picker, returns yyyy-MM-dd hh:mm:ss), ```color``` (color picker, returns #FF00FF).
  When ```type=selected```, ```settings.render``` is not set (defaults to dropdown), options: ```segment``` (segmented selector).
  When ```type=boolean```, currently only the default checkbox is available.

Bilingual settings are supported. For example, the text ```'选项|options'``` adapts to the current language. Using a single control in the ```group``` field as an example, a complete example (a JavaScript object):

```js
{
    type:'selected',
    name:'test',
    label:'选项|options',
    description:'描述|description',
    default:0,                            // Here the default value is set to 0, representing the value in {name:'xxx|yyy',value:0} option
    filter:'a>1&&a<10',
    group:'Group|group',
    settings:{
        multiple:true,
        customizable:true,
        options:[{name:'xxx|yyy',value:0}]
    }
}
```

### Template Library

A **template library** is a reusable code module on the FMZ Quant Trading Platform and a category of strategy code. Languages that support template libraries: ```JavaScript``` (including TypeScript), ```Python``` and ```Rust```; ```Blockly Visual``` strategies can use blocks provided by JavaScript template libraries. If the category is set to template library when a strategy is created, a template library is created in the strategy library of the logged-in account; its category cannot be changed to an ordinary strategy afterwards.

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

Export functions are the interface functions of template libraries, which can be called by strategies that reference the template library.

Different programming languages have different formats for writing template libraries. The following are example codes for declaring and implementing export functions in template libraries:

```javascript
/*
-- 策略引用该模板以后直接用 $.Test() 调用此方法
-- main 函数在策略中不会触发, 只做为模板调试的入口
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

# 导出Test函数, 主策略可以通过ext.Test()调用
ext.Test = Test
```

```rust
// after referencing this template, a strategy calls it as ext::Test()
// functions called by the strategy must be declared pub
pub fn Test() {
    Log!("template call");
}
```

Strategies written in ```Blockly visual``` mode can implement library functions through ```JavaScript``` language template libraries. Please use the following format.

```js
/*blockly
    {
        "type": "ext_testA",
        "message0": "testA|testA",
        "template": "function(){return 99;}()",
        "order": "ORDER_ATOMIC",
        "output": "Number"
    },{
        "type": "ext_MA",
        "message0": "MA 周期 %1| MA Period %1",
        "args0": [{
            "type": "input_value",
            "check": "Number"
        }],
        "template": "(function(){var r = exchange.GetRecords(); return (!r || r.length < %1) ? false : TA.MA(r, %1); })()",
        "order": "ORDER_ATOMIC",
        "output": null,
        "colour": 85
    }
*/
```

#### Template Library Parameters

Template libraries can also set their own interface parameters. Template library parameters are used as global variables in the template library code.

For example, we set a template library parameter:

![Template Parameter](https://www.fmz.com/upload/asset/2e4ab550b85e6a1cac08e.png)

| Variable Name in Strategy Code | Parameter Name Displayed on Strategy Interface | Type | Default Value |
| - | - | - | - |
| param1 | Template Parameter 1 | Number | 99 |

Parameters of a ```Rust``` template are constants that can only be read, not modified, so in Rust the example below can only read the parameter:

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

Template library code for testing the ```param1``` parameter:

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

```rust
// Rust template parameters are read-only constants; see above for how to read them
```

Strategy code referencing the above template library example, using the template library's exported functions to get parameter ```param1``` and modify parameter ```param1```.

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

```rust
// Rust template parameters are read-only constants; see above for how to read them
```

#### Reference Template Library

When a strategy references a template library, the currently logged-in FMZ Quant Trading Platform account must have available template libraries in its strategy library. On the [Strategy Edit Page](https://www.fmz.com/m/add-strategy), check the templates you need to reference in the Template section, then save the strategy to complete the reference.

![Template Reference Screenshot](https://www.fmz.com/upload/asset/2e4ee2ec7b3e7b1649af8.png)

### Built-in Libraries

The FMZ Quant Trading Platform has some commonly used libraries built in. Availability by language:

| Library | JavaScript / TypeScript | Python | Rust |
| - | - | - | - |
| ```TA``` indicators | yes | yes | yes |
| ```talib``` indicators | yes | requires TA-Lib and numpy installed on the docker's machine | no |
| JSON | the language's built-in ```JSON``` | the standard ```json``` module | ```JSONParse()```/```JsonValue``` |

For the full list of functions and their arguments see `TA` and `Talib` in the reference.

**TA indicator library**

The platform's ```TA``` library optimizes the common indicator algorithms ([open-source TA library code](https://www.fmz.com/bbs-topic/409)). Where there are not enough K-lines to compute an indicator, invalid values are returned at those positions.

```js
function main(){
    var records = exchange.GetRecords()
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

**talib indicator library**

```js
function main() {
    var records = exchange.GetRecords()
    var cci = talib.CCI(records, 14)
    Log(cci)
}
```

```python
# Python needs TA-Lib and numpy installed on the docker's machine; without them calling talib raises an error asking to install it
def main():
    records = exchange.GetRecords()
    cci = talib.CCI(records.High, records.Low, records.Close, 14)
    Log(cci)
```

**JavaScript: loading third-party libraries dynamically**

Other third-party JavaScript libraries can be downloaded at run time and loaded with ```eval```:

```js
function main() {
    // via. https://cdnjs.com/libraries
    eval(HttpQuery("https://cdnjs.cloudflare.com/ajax/libs/mathjs/13.2.0/math.min.js"))

    Log(math.round(math.e, 3))                // 2.718
    Log(math.atan2(3, -3) / math.pi)          // 0.75
    Log(math.log(10000, 10))                  // 4
    Log(math.sqrt(-4))                        // {"mathjs":"Complex","re":0,"im":2}
}
```

### Multi-language Support

Both the strategy name and the descriptions of strategy parameters can be written in the ```Chinese|English``` format, allowing the web page to automatically recognize and display the corresponding language. In other use cases—such as **strategy description**, **usage instructions**, and other ```Markdown```-formatted text—using ```[trans]Chinese|English[/trans]``` or ```[trans]Chinese||English[/trans]``` can likewise achieve automatic language recognition. After switching the language, refresh the web page for it to take effect. In addition, in strategy code, any function that can accept a string also supports language switching, such as the ```Log()``` function, the ```LogStatus()``` function, and so on.

```js
function main() {
    Log("[trans]日志|log[/trans]")
    var table = {
        type: "table",
        title: "[trans]操作|option[/trans]",
        cols: ["[trans]列1|col1[/trans]", "[trans]列2|col2[/trans]", "[trans]操作|option[/trans]"],
        rows: [
            ["[trans]比特币|BTC[/trans]", "[trans]以太坊|ETH[/trans]", {"type": "button", "cmd": "coverAll", "name": "平仓|cover", "description": "描述|description"}]  // Note: there is no need to add the [trans] tag inside buttons
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
    table = {
        "type": "table",
        "title": "[trans]操作|option[/trans]",
        "cols": ["[trans]列1|col1[/trans]", "[trans]列2|col2[/trans]", "[trans]操作|option[/trans]"],
        "rows": [
            ["[trans]比特币|BTC[/trans]", "[trans]以太坊|ETH[/trans]", {"type": "button", "cmd": "coverAll", "name": "平仓|cover", "description": "描述|description"}]
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
            ["[trans]比特币|BTC[/trans]", "[trans]以太坊|ETH[/trans]", {"type": "button", "cmd": "coverAll", "name": "平仓|cover", "description": "描述|description"}]
        ]
    }"#;
    LogStatus!("[trans]信息|message[/trans]", format!("\n`{}`", table));
    Panic!("[trans]错误|error[/trans]");
}
```

## Development Tools

Tools for writing and debugging strategies: the strategy editor, the debugging tool and remote editing from a local editor.

### Strategy Editor

Open the **edit page** from the [new strategy page](https://www.fmz.com/m/add-strategy) or by opening an existing strategy in the [Strategy Library](https://www.fmz.com/m/strategies) (for strategy ID 123456 the address is ```https://www.fmz.com/m/edit-strategy/123456```) to write strategies.

![Online strategy editor](https://www.fmz.com/upload/asset/2e50fff4160187be92248.png)

This chapter covers the editor's assistance features. Related features of the editing page:
- Remote editing: write in a local editor and sync to the platform automatically (see Development Tools → Remote Editing).
- Backtest configuration and saving: save the backtest configuration and strategy parameters with the strategy (see Backtesting System).
- Import and export of complete strategies: export and import a strategy with its parameters and everything else (see Platform Basics → Strategy Library).

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

Besides the assistant in the editor, you can connect the external AI assistant you already use to the platform and manage strategies, backtests and live robots through conversation (see Integrations → AI Integration).

#### Command Palette

Right-click in the strategy code editing area and select "Command Palette" from the context menu to view keyboard shortcuts and editor commands for various functions.

![Command Palette display in strategy editor menu](https://www.fmz.com/upload/asset/2e429269f02185dfbab3b.png)

#### Syntax Manual Quick Reference

In the "Code" editing area of the **Strategy Editor Page**, you can quickly access the "Syntax Manual". Use the corresponding keyboard shortcuts based on your operating system:

![Syntax Manual Quick Reference in Strategy Editor](https://www.fmz.com/upload/asset/2e4d0722af99164f69996.png)

- In browsers on Mac systems (Apple computers): Hold down the ```⌘``` key.
- In browsers on Windows systems: Hold down the ```Ctrl``` key.

Then when you hover your mouse over the **variable name** or **function name** you want to look up, a jump link will appear. Click the link to open the "Syntax Manual" popup, which will automatically navigate to the queried content.

#### Go to Definition and References

Select the content you want to query, then right-click to open the context menu.

- Go to Definition: Navigate to the definition location of the queried content.

- Go to References: Navigate to the reference locations of the queried content.

- Peek - Peek Definition: View the definition of the selected code without leaving the current line.

- Peek - Peek References: View references to the current code in other lines without leaving the current position, with support for quick navigation to better understand code logic and structure.

#### Strategy Documentation

The online strategy editing page keeps the code, description, usage instructions and development notes of a strategy separately.

![Strategy documentation options](https://www.fmz.com/upload/asset/2e47983c191c1779bd52e.png)

- Code: the source code of the strategy program.
  A complete strategy on the platform consists of the source code, the strategy parameter design, the interactive control design and the template library references (see Writing Strategies → Strategy Parameters, Interactive Controls and Template Libraries).
- Notes: notes taken while developing the strategy.
- Description: the introduction shown when the strategy is published.
- Manual: instructions visible only to those who rent the strategy.

#### History Version Management

The platform supports version iteration functionality during strategy development. On the **Strategy Editing Page**, click the "History Version" button in the "Code" editing area to open the strategy history version management page.

- When the current strategy has no history version snapshots, click the "Create Now" button to create a snapshot of the current strategy. Snapshot contents include: strategy code, notes, description, manual, parameter design, interaction design, etc.

- After creating a history snapshot, the saved history snapshot list will be displayed on the right side of the history version management page. Click the "Create History Version" button above the list to continue saving new history snapshots.

- Edit and use history snapshots: You can perform operations such as **modify history snapshot name**, **delete history snapshot**, and **restore to the strategy version of the history snapshot** on recorded strategy history snapshots.

- Preview the currently selected history snapshot: Click the "Preview" button at the bottom left of the history version management page to preview the strategy code, notes, description, manual, parameter design, interaction design, and other contents in the current history snapshot.

- Compare the differences between the currently selected history snapshot and the current strategy: Click the "Compare" button at the bottom left of the history version management page to compare the differences between the current history snapshot and the current strategy.

## Running History Versions in Live Trading

Strategy history versions can not only be used for code management and version rollback, but can also be run directly in live trading:

- **Set Default Running Version**: On the strategy editor page, click the "History Version" button, select a history version, then click the "Modify" button in the menu. In the popup, you can check the "Set as Default Version" option. If not set, the latest version will run by default.

- **Use History Version in Live Trading**: When creating a live trading instance or modifying live trading parameters, the strategy owner can select a specific history version of the strategy to run. This feature is only available to the strategy owner.

- **Version Control for Rented Strategies**: When a strategy is rented to other users, the renter can only run the "default running version" set by the strategy owner and cannot select other history versions. The strategy owner can control which version is used for rented strategies by setting the default running version.

### Debugging Tool

The [Debugging Tool](https://www.fmz.com/m/debug) page provides a free environment for quickly testing live trading code, currently supporting only the ```JavaScript``` language.

![Debugging Tool](https://www.fmz.com/upload/asset/2e48d6d1bc77e46099058.png)

When using the debugging tool to test code, the code will run directly on the specified docker, with a maximum runtime of 3 minutes. It supports calling all API functions of the FMZ Quant Trading Platform, but only supports a single exchange object.

### Remote Editing

You can write a strategy in a local editor and have it synced to FMZ automatically on save. ```VSCode```, ```Vim``` and ```Sublime Text 3``` are supported; ```JavaScript``` strategies can also use ```WebStorm``` and ```Python``` strategies ```PyCharm```. Blockly visual strategies do not support remote editing.

![Remote editing screenshot](https://www.fmz.com/upload/asset/2e4e8975d1e32517fd989.png)

**Steps**
1. Click "Remote Editing" on the strategy editing page. The top of the dialog has download links for the editor plugins; follow one to the plugin page and install it (installation differs slightly between editors).
2. The dialog shows the current strategy's remote sync token. If it is empty, click "Update Token" to generate one.
3. Save the strategy source locally and insert the token line shown in the dialog as the first line (e.g. ```// fmz@<token>``` for ```JavaScript```, ```# fmz@<token>``` for ```Python```); from then on every save is synced to the platform.

Without a plugin you can upload the local source with ```curl``` (the dialog shows the full command with your token), for example:

```bash
curl -T quant.js -H "Authorization: Bearer <token>" https://www.fmz.com/rsync
```

**Managing the token**
- "Update Token": generates a new token; the old one stops working at once.
- "Delete Token": deletes the strategy's token and turns remote editing off.

Anyone holding the token can overwrite the strategy's source code, so keep it private.

## Backtesting System

Test strategies on historical data: the backtesting system drives the strategy code with past market data, simulates order matching and accounts, and reports profit, drawdown and other results. A backtest only shows how a strategy behaved on past data; it does not predict future returns.

### Overview and Starting a Backtest

A backtest drives the strategy code with the platform's historical market data: the backtest engine keeps a virtual clock and one simulated account per exchange object, and answers every market, order and account call from history. A backtest only shows how the strategy would have behaved on past data; the past does not represent the future, so read backtest results with caution.

**Starting a backtest**

- Website: open the strategy editor, switch to the "Backtest" tab, set the backtest configuration and strategy parameters, then click "Start Backtest" (keyboard shortcuts: see Backtesting System → Backtest Page Shortcuts). The configuration can be saved into the strategy source, see Backtesting System → Backtest Configuration and Saving.
- AI assistant: start a backtest with the MCP tool ```run_backtest``` and read the result with ```get_backtest```, see Integrations → AI Integration. Backtests started through MCP always use the simulated-tick mode.
- Your own machine: use the open-source local backtest engine, see Backtesting System → Local Backtesting Engine.

**Configuration items**

| Item | Description |
| - | - |
| Time range | Start and end time of the backtest. |
| K-line period | The K-line period that ```GetRecords()``` returns by default. |
| Base K-line period | The K-line period from which ticks are generated in simulated-tick mode. Smaller is closer to real markets and slower. Strategy K-lines are built from base K-lines, so they cannot be shorter than the base period. |
| Mode | Simulated tick or real tick, see Backtesting System → Backtest Modes and Order Matching. |
| Exchange, trading pair | Each exchange object has its own simulated account; pairs are written like ```BTC_USDT```. For futures exchanges the strategy must call ```exchange.SetContractType()``` before requesting market data or placing orders. |
| Initial funds | Initial balances of the quote currency (e.g. USDT) and the base currency (e.g. BTC). Coin-margined contracts use the base currency as margin, so set the base-currency balance. |
| Fees | Maker and taker rates in percent; the defaults come from the exchange market's configuration. A limit order that fills immediately when placed pays the taker rate; one that rests in the book and is filled later pays the maker rate. |
| Slippage | Number of price ticks added outside the simulated best bid and best ask; default 0. |
| Network delay | In milliseconds; every exchange call advances the virtual clock by this amount; default 200. |
| Depth levels, amount per level | Number of levels ```GetDepth()``` returns (1-20) and the amount on each simulated level; in real-tick mode the depth levels are the real depth requested from the data source. |
| Max K-line bars | Upper limit of history bars returned by the first ```GetRecords()``` call (100-5000, default 300). |
| Log limits | Upper limits on kept runtime logs, profit logs and chart data points. |
| Data source | The platform's historical data by default; a custom data source can be used instead, see Backtesting System → Custom Data Source. |

**Fault-tolerance test**

The backtest page also offers a "fault-tolerance test": exchange calls fail with a given probability (0.5 by default), and the first call of each kind always fails; each failure is logged as the error ```FaultTolerant Test```. Use it to check how the strategy handles failed calls, e.g. whether it retries with ```_C()```.

**What the strategy sees in a backtest**

- ```IsVirtual()``` returns ```true```; logic that must not run in a backtest can be skipped based on it, see `IsVirtual`.
- Time is virtual: ```Unix()```, ```_D()``` and similar functions read the backtest clock, and ```Sleep()``` advances it. When the clock passes the end time, the engine throws an ```EOF``` exception and the backtest ends; ```onexit()``` is not called in that case.
- In a backtest ```GetCommand()``` receives no interactive commands, ```onerror()``` is not supported, and network request functions are restricted.

### Backtest Modes and Order Matching

There are two backtest modes, **simulated tick** and **real tick**. Both are based on real historical data: simulated tick generates ticks from K-lines, real tick replays recorded ticks. The latter is more accurate and slower.

**Simulated tick**

Within the price frame of each base K-line (open, high, low, close), the engine generates 2-14 simulated ticks along the path open → low/high → close and spreads the bar's volume over them; market calls return the data of the current simulated tick. Each base K-line therefore has several backtest time points, and a strategy can trade several times inside one bar instead of only at the close. The smaller the base K-line period, the closer the ticks follow the real price path, and the slower the backtest. Details: [Simulated-tick mechanism](https://www.fmz.com/bbs-topic/662), [Backtesting mechanism](https://www.fmz.com/digest-topic/4009).

Simulated order book: best ask = tick close + one tick + slippage, best bid = close − one tick − slippage (slippage counted in ticks); ```GetDepth()``` returns several simulated levels spaced by that amount, each with the configured "amount per level".

**Real tick**

Uses per-second ticks recorded by the platform, including order-book depth (configurable, up to 20 levels) and, optionally, replayed trade prints; ```GetDepth()``` and ```GetTrades()``` return the replayed real data. Because the data is large and the backtest slow, one backtest may use at most 50 MB of data, which limits the time range; to cover a longer range, lower the depth levels and do not use trade prints. Early periods may have no real-tick data, so do not choose a start time that is too early.

At a given market moment, calling each of ```GetTicker()```, ```GetDepth()```, ```GetTrades()``` and ```GetRecords()``` once does not move the backtest time; calling the same function again jumps to the next market moment. In real-tick mode keep the ```Sleep()``` in the strategy loop short (e.g. 100 ms).

**Order matching**

Both modes use the same matching rules:

- Orders fill when the price is touched, and always in full; there are no partial fills in a backtest.
- A market order fills on the current tick at the best ask/bid; the amount of a spot market buy order is in the quote currency.
- A limit buy fills when its price is at or above the best ask, a limit sell when its price is at or below the best bid; this is checked on every tick after the order is placed. An order that fills immediately when placed fills at the market price and pays the taker fee; an order that rests in the book and is touched later fills at its own price and pays the maker fee.
- In real-tick mode an order resting exactly at the best bid/ask fills only after the volume queued ahead of it has been consumed.
- Futures freeze margin of notional value ÷ leverage; when the market data includes funding rates, perpetual contracts are charged funding.

**Effect of data granularity**

The same strategy produces different trade counts and P&L at different data granularities (real tick, simulated tick with a small base period, simulated tick with a large base period, ...). Coarse data backtests faster but may give misleading results, so use fine granularity where possible. The following strategy can be backtested at several granularities for comparison:

```js
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

**Saving**

- Click "Save Backtest Settings": the configuration and strategy parameters are written as a comment block (the ```backtest``` block) at the top of the strategy source.
- Click "Save Strategy": the platform also records the current backtest configuration and strategy parameters.

**Loading**

- When the strategy editor is opened or refreshed, the configuration in the source's ```backtest``` block is loaded first.
- If the source has no ```backtest``` block, the configuration recorded by the last "Save Strategy" is loaded.
- After editing the ```backtest``` block by hand, click the "Backtest Settings" button above the block to apply the change to the backtest form.

**Block format**

The word ```backtest``` follows the language's block-comment opener directly, then one ```key: value``` per line:

```js
/*backtest
start: 2024-01-01 00:00:00
end: 2024-03-01 00:00:00
period: 1h
basePeriod: 15m
exchanges: [{"eid":"Binance","currency":"BTC_USDT","balance":10000,"stocks":0,"fee":[0.1,0.1]}]
args: [["fast",5],["slow",20]]
*/
```

Comment syntax per language: JavaScript, TypeScript, Rust and PINE use ```/*backtest ... */```; Python uses ```'''backtest ... '''```; MyLanguage uses ```(*backtest ... *)```.

| Key | Format | Description |
| - | - | - |
| start, end | ```YYYY-MM-DD HH:mm:ss``` | Start and end time, parsed in the browser's time zone. |
| period | ```1m```, ```1h```, ```1d``` etc., or seconds | Strategy K-line period. |
| basePeriod | same | Base K-line period; defaults to ```period```; ignored in real-tick mode. |
| mode | ```1``` | Real-tick mode; omit for simulated-tick mode. |
| exchanges | JSON array | One element per exchange object, fields below. |
| args | JSON array | Strategy parameters, ```[["name", value], ...]```; a third element with a template ID sets that template's parameter: ```["name", value, templateId]```. |

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
| feeder | Custom data source URL, see Backtesting System → Custom Data Source. |

"Save Backtest Settings" also writes some keys starting with ```bt``` (e.g. ```btSlipPoint``` slippage, ```btNetDelay``` network delay, ```btFaultTolerant``` failure probability, ```btMaxBarLen``` max K-line bars) that record the other options of the backtest form; editing them by hand is not recommended. The local backtest engines read the same block, see Backtesting System → Local Backtesting Engine.

### Supported Languages and Exchanges

**Programming languages**

The backtesting system supports strategies written in JavaScript, TypeScript, Python, Rust, [PINE](https://www.fmz.com/bbs-topic/9315), [MyLanguage](https://www.fmz.com/bbs-topic/2569), Blockly and Workflow.

- JavaScript strategies (TypeScript is compiled to JavaScript first) are backtested in the browser, where the backtest engine runs as WebAssembly; nothing needs to be installed. JavaScript strategies can be debugged with Chrome DevTools during a backtest, see [this guide](https://www.fmz.com/digest-topic/9459).
- Rust strategies are compiled by the platform's servers and the result is backtested in the browser; third-party crates declared in the strategy's frontmatter are fetched at compile time, so no local toolchain is needed.
- Python strategies are backtested on a docker, either the platform's public servers or your own docker. Both backtesting and live trading use the Python 3 environment of the docker's system; install the third-party libraries you need yourself. The public servers only provide common libraries.
- Workflow strategies show each node's execution state and data flow visually during a backtest.

**Exchanges**

Backtests use the platform's historical data; the exchanges selectable on the backtest page are the ones that can be backtested (the MCP tool ```list_exchanges``` also shows this: exchanges with ```backtest``` set to ```true``` have history data).

- Cryptocurrency: spot and futures of major exchanges, e.g. Binance and Futures_Binance, OKX and Futures_OKX, HTX and Futures_HTX, Bybit and Futures_Bybit, Bitget and Futures_Bitget, GateIO and Futures_GateIO, with all symbols of the exchange.
- Futu Securities (```Futures_Futu```): Hong Kong, US and other stock markets. Only daily data is available for backtesting; set ```currency``` to ```STOCK``` and select the stock code in the strategy with ```exchange.SetContractType()```:

```js
/*backtest
start: 2024-05-01 00:00:00
end: 2025-02-17 00:00:00
period: 1d
basePeriod: 1d
exchanges: [{"eid":"Futures_Futu","currency":"STOCK","fee":[0.03,0.03]}]
*/

function main() {
    var info = exchange.SetContractType("TSLA.US")   // Set the stock code: Tesla
    Log("info:", info)                               // Contract info: InstrumentID, PriceTick, LotTick, VolumeMultiple, ...
    Log(exchange.GetTicker())                        // Daily market data at the current backtest time
}
```

### Parameter Optimization

Parameter optimization generates several parameter sets from the ranges you configure and backtests each of them. In the strategy parameter section of the "Backtest" tab, tick the **Optimize** option to the right of a parameter to show its settings:

- Min: the starting value of the parameter.
- Max: the largest value the parameter is increased to.
- Step: the increment.
- Concurrent threads: how many backtests run at the same time during optimization. This option only applies to JavaScript, PINE and MyLanguage strategies, and not to template parameters.

The system generates parameter combinations from ```Min```, ```Max``` and ```Step``` and backtests every combination once. Only **number** parameters can be optimized.

### Reading Backtest Results

When a backtest finishes, the backtest page shows the profit curve, statistics, status information, logs and account information.

**Profit curve**

The profit curve consists of the values the strategy records with ```LogProfit()``` (`LogProfit`). If the strategy never calls ```LogProfit()```, there is no profit curve and the statistics below, which depend on that series, cannot be computed; only the final assets in the account information remain. The ```profit``` and ```max_drawdown``` returned by the MCP tool ```get_backtest``` also come from ```LogProfit()```.

**Statistics**

The statistics are computed from the profit series ```profits``` (each element ```[timestamp, profit]```) and the initial assets ```totalAssets``` with the algorithm below:

| Metric | Meaning |
| - | - |
| Return (totalReturns) | Last profit value ÷ initial assets. |
| Annualized return (annualizedReturns) | Return × one year (yearDays days) ÷ backtest duration, scaled linearly. |
| Max drawdown (maxDrawdown) | The largest fractional drop of assets (initial assets + profit) from their previous peak. maxDrawdownStartTime is the time of that peak, maxDrawdownTime the time of the deepest point. |
| Win rate (winningRate) | Share of points in the profit series that are higher than the previous point (the first point is compared with 0). It counts profit records, not individual trades. |
| Volatility (volatility) | The backtest period is cut into days; each day's profit ÷ initial assets is multiplied by yearDays to annualize it (days without profit records count as 0); volatility is the population standard deviation of these values. |
| Sharpe ratio (sharpeRatio) | (Annualized return − risk-free rate 3%) ÷ volatility; 0 when volatility is 0. |

yearDays is the number of days per year used for annualization, passed in by the backtest page. Note that daily returns are annualized by multiplying by yearDays rather than the usual √yearDays, so this Sharpe ratio should not be compared directly with values from other platforms.

Algorithm source:

```js
function returnAnalyze(totalAssets, profits, ts, te, period, yearDays) {
    // force by days
    period = 86400000
    if (profits.length == 0) {
        return null
    }
    var freeProfit = 0.03 // 0.04
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

**Downloading data**

- Status bar data: after the backtest finishes, click "Download Table" at the top right of the "Status" panel to download the final status bar data as a CSV file.
- Log data: click "Download Table" at the top right of the "Logs" panel to download the backtest logs as a CSV file.

### Custom Data Source

The FMZ Quant Trading Platform's backtesting system supports custom data sources. During a backtest the platform's data server requests the custom URL with the ```GET``` method, so the URL must be reachable from the public internet. The request carries these parameters:

| Parameter | Meaning | Description |
| - | - | - |
| symbol | Symbol name | Spot market data example: ```BTC_USDT```, Futures market data example: ```BTC_USDT.swap```, Perpetual futures funding rate data example: ```BTC_USDT.funding```, Perpetual futures price index data example: ```BTC_USDT.index``` |
| eid | Exchange | For example: OKX, Futures_OKX |
| round | Data precision | Always ```round=true```: prices and amounts are returned as integers scaled by their precision, which is given by ```quotePrecision``` and ```basePrecision``` in the returned ```detail```; see Backtesting System → Custom Data Source → Data Format. |
| period | K-line data period (milliseconds) | For example: ```60000``` represents a 1-minute period |
| depth | Order book depth levels | 1-20 |
| trades | Whether trade-by-trade data is required | Yes (1) / No (0) |
| from | Start time | Unix timestamp in seconds |
| to | End time | Unix timestamp in seconds |
| detail | Request detailed information of the symbol | When true, indicates that it needs to be provided by the custom data source. The request sent by the FMZ Quant Trading Platform backtesting system to the custom data source is fixed as: ```detail=true``` |
| custom | -- | This parameter can be ignored |

When the data source of spot exchange or futures exchange objects is set to custom data source (feeder), examples of requests sent by the backtesting system to the custom data source service:

```url
http://customserver:9090/data?custom=0&depth=20&detail=true&eid=Bitget&from=1351641600&period=86400000&round=true&symbol=BTC_USDT&to=1611244800&trades=1
http://customserver:9090/data?custom=0&depth=20&detail=true&eid=Futures_OKX&from=1351641600&period=86400000&round=true&symbol=BTC_USDT.swap&to=1611244800&trades=1
```

#### Data Format

The returned format must be one of the following two formats (automatically recognized by the system):
- Simulated-level Tick, here is a JSON data example:
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
          "quotePrecision": 2,
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
- Live-level Tick, here is a JSON data example:
  Tick-level backtest data (includes order book depth information, depth format is an array of ```[price, quantity]```. Can include multiple levels of depth, ```asks``` sorted in ascending order by price, ```bids``` sorted in descending order by price).
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
          "quotePrecision": 2,
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
          [1564315200000, [[9531300, 10]], [[9531300, 10]], [[1564315200000, 0, 9531300, 10]], 9497060, 787],
          [1564316100000, [[9531300, 10]], [[9531300, 10]], [[1564316100000, 0, 9531300, 10]], 9497060, 787]
      ]
  }
  ```

| Field | Description |
| - | - |
| detail | Detailed information of the requested instrument, including quote currency name, base currency name, precision, minimum order quantity, etc. |
| schema | Specifies the column attributes in the data array, case-sensitive. Limited to time, open, high, low, close, vol, asks, bids, trades |
| data | Data recorded according to the column structure set by schema |

**Numeric precision**

Requests always carry ```round=true```, and all values are returned as integers scaled by their precision, so that no floating-point precision is lost in transit:

- Prices (```open```, ```high```, ```low```, ```close```, and the prices in ```asks```/```bids``` and ```trades```) = actual value × 10^```quotePrecision```.
- Amounts (```vol```, and the amounts in ```asks```/```bids``` and ```trades```) = actual value × 10^```basePrecision```.

In the examples above ```quotePrecision``` is 2, so ```9531300``` means a price of 95313.00; ```basePrecision``` is 5, so ```787``` means an amount of 0.00787. Time columns (```time``` and the time in ```trades```) are millisecond timestamps and are not scaled.

**detail field**

| Field | Description |
| - | - |
| eid            | Exchange ID, note that spot and futures of the same exchange use different eids |
| symbol         | Trading instrument code |
| alias          | The corresponding symbol of the current trading instrument code on the exchange |
| baseCurrency   | Base currency |
| quoteCurrency  | Quote currency |
| marginCurrency | Margin currency |
| basePrecision  | Base currency precision |
| quotePrecision | Quote currency precision |
| minQty         | Minimum order quantity |
| maxQty         | Maximum order quantity |
| minNotional    | Minimum order amount |
| maxNotional    | Maximum order amount |
| priceTick      | Minimum price tick size |
| volumeTick     | Minimum volume tick size |
| marginLevel    | Futures leverage multiplier |
| contractType   | For perpetual contracts set to: ```swap```, the backtest system will continue to send funding rate and price index requests |

Special column attributes ```asks```, ```bids```, ```trades``` description:

| Field | Description | Remarks |
| - | - | - |
| asks / bids | [[price, quantity], ...]                      | For example, data in the ```Live-level Tick``` data example: ```[[9531300, 10]]``` |
| trades      | [[time, direction(0:buy,1:sell), price, quantity], ...] | For example, data in the ```Live-level Tick``` data example: ```[[1564315200000, 0, 9531300, 10]]``` |

When backtesting perpetual contracts on futures exchanges, custom data sources also need to provide additional funding rate data and price index data. Only when the requested market data is returned and the detail field in the return structure contains the ```"contractType": "swap"``` key-value pair, will the backtest system continue to send funding rate requests.
After the backtest system receives the funding rate data, it will continue to send price index data requests.

Funding rate data structure is as follows:
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
    "schema": [
        "time",
        "open",
        "high",
        "low",
        "close",
        "vol"
    ],
    "data": [
        [
            1584921600000,
            -16795,
            -16795,
            -16795,
            -16795,
            0
        ],
        [
            1584950400000,
            -16294,
            -16294,
            -16294,
            -16294,
            0
        ]
    ]
}
```

- Adjacent period interval is 8 hours
- Why is the funding rate -16795?
  Like K-line data it is an integer scaled by precision: ```quotePrecision``` of this data is 8, so -16795 means a funding rate of -0.00016795. Funding rates can be negative.

Example of funding rate data request sent by the backtest system:

```url
http://customserver:9090/data?custom=0&depth=20&detail=true&eid=Futures_Binance&from=1351641600&period=86400000&round=true&symbol=BTC_USDT.funding&to=1611244800&trades=0
```

Price index data structure is as follows:
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
    "schema": [
        "time",
        "open",
        "high",
        "low",
        "close",
        "vol"
    ],
    "data": [
        [1584921600000, 58172, 59167, 56902, 58962, 0],
        [1584922500000, 58975, 59428, 58581, 59154, 0]
    ]
}
```

Example of price index data request sent by the backtest system:
```url
http://customserver:9090/data?custom=0&depth=20&detail=true&eid=Futures_Binance&from=1351641600&period=86400000&round=true&symbol=BTC_USDT.index&to=1611244800&trades=0
```

#### Custom Data Source Example

Deploy the service below on a server reachable from the public internet; the data source URL is then ```http://<server>:9090/data``` (replace ```<server>``` with the server's public IP or domain name). The custom data source service is written in ```Golang```:

```golang
package main

import (
    "fmt"
    "net/http"
    "encoding/json"
)

func Handle (w http.ResponseWriter, r *http.Request) {
    // e.g. set on backtest DataSource: http://xxx.xx.x.xx:9090/data

    // request: GET http://xxx.xx.x.xx:9090/data?custom=0&depth=20&detail=true&eid=OKX&from=1584921600&period=86400000&round=true&symbol=BTC_USDT&to=1611244800&trades=1
    //              http://xxx.xx.x.xx:9090/data?custom=0&depth=20&detail=true&eid=Futures_Binance&from=1599958800&period=3600000&round=true&symbol=BTC_USDT.swap&to=1611244800&trades=0
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
                []int64{1610755200000, 3673743, 3795000, 3535780, 3599498, 8634843151},  // 1610755200000 : 2021-01-16 08:00:00
                []int64{1610841600000, 3599498, 3685250, 3385000, 3582861, 8015772738},  // 1610841600000 : 2021-01-17 08:00:00
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
                []interface{}{1610755200000, []interface{}{[]int64{9531300, 10}}, []interface{}{[]int64{9531300, 10}}, []interface{}{[]int64{1610755200000, 0, 9531300, 10}}, 9497060, 787},
                []interface{}{1610841600000, []interface{}{[]int64{9531300, 15}}, []interface{}{[]int64{9531300, 15}}, []interface{}{[]int64{1610841600000, 0, 9531300, 11}}, 9497061, 789},
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

Test strategy, ```JavaScript``` example:
```js
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

The platform publishes local backtest engines for JavaScript and Python. They use the same engine core and the same history data (downloaded from the platform's data server) as cloud backtests, and backtest JavaScript and Python strategies quickly on your own computer:

- [Python backtest engine](https://github.com/fmzquant/backtest_python)
- [JavaScript backtest engine](https://github.com/fmzquant/backtest_javascript)

**Python**

Install (requires Python 3 and pip):

```bash
pip install https://github.com/fmzquant/backtest_python/archive/master.zip
pip install pandas matplotlib   # only needed for Join(True) and Show()
```

On first use the package downloads the engine file for your system from the data server; afterwards only history data is downloaded. A strategy file is an ordinary FMZ strategy plus the ```backtest``` configuration comment at the top (format: see Backtesting System → Backtest Configuration and Saving) and a few lines that drive the engine:

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
task = VCtx(__doc__)  # Initialize the engine from the configuration above; exchange, Log, TA etc. become globals

# The strategy under test, copied from the platform as is
def main():
    Log(exchange.GetAccount())
    while True:
        r = exchange.GetRecords()
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

Run it with ```python strategy.py```. ```task.Join(False)``` returns the raw result as JSON, ```task.Join(True)``` returns the profit data as a pandas DataFrame, and ```task.Show()``` plots the profit curve.

**JavaScript**

```bash
npm install git+https://github.com/fmzquant/backtest_javascript.git
```

```js
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
        LogStatus(_D(), r[r.length - 1].Close)
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

**Differences from cloud backtests**

- Only JavaScript and Python strategies are supported and templates are not loaded automatically: paste the code of referenced templates into the file. PINE and MyLanguage strategies depend on trading libraries and therefore cannot be backtested locally.
- Strategy parameters are not injected; define them as global variables in the code.
- ```start``` and ```end``` in the comment are parsed in the machine's time zone; network delay is fixed at 200 ms; slippage and real-tick mode are not supported.
- As in the cloud, profit, drawdown and the profit curve exist only if the strategy calls ```LogProfit()```.

**Backtesting with an AI assistant**

An AI assistant can run backtests for you: it starts a cloud backtest with the MCP tool ```run_backtest``` and reads profit, drawdown, error logs and other results with ```get_backtest```, see Integrations → AI Integration. It can also install the local engine on your machine for a fast edit-and-run loop, then confirm once with a cloud backtest.

### Backtest Page Shortcuts

- Shortcut for switching between strategy editor and backtest page
  Use ```Ctrl + ,``` to switch between backtest page and strategy editor page. Hold ```Ctrl``` and press ```,```.
- Shortcut for saving strategy
  Use ```Ctrl + s``` to save strategy.
- Shortcut for starting backtest
  Use ```Ctrl + b``` to start backtest.

## Advanced Topics

Advanced usage: JavaScript multi-threading, communication between live tradings, API rate limiting, options trading and on-chain trading with Web3.

### JavaScript Multi-threading

JavaScript strategies can use the ```threading``` object to create threads that really run in parallel, and exchange data between them with messages, shared dictionaries, locks and similar objects. This page explains when to use threads and how to organize thread code; for the parameters and return values of each function see `Threads` in the syntax manual.

## Pick the right tool first

| Need | Recommended | Languages |
| - | - | - |
| Send several API requests at once (for example tickers from several exchanges) and wait for the results | `exchange.Go`, with `EventLoop` to wait for completion events | All languages |
| Long-running background work: separate market data collection, risk checks, heavy computation | `threading.Thread` | JavaScript only |
| Serve HTTP, WebSocket or TCP from inside the strategy | `threading.Serve` | JavaScript only |

When you only need a few concurrent requests, ```exchange.Go()``` is simpler and involves no data passing between threads. The ```threading``` object on this page is for JavaScript strategies only; Python and Rust strategies use ```exchange.Go()```.

These functions can be called in the backtesting system, but the threads actually run one after another there; this only keeps the code runnable in backtests.

## Threads run in isolated environments

The function passed to ```threading.Thread()``` runs in a separate JavaScript environment. This is the most important thing to keep in mind when writing thread code:

- A thread function **cannot reference outer variables or closures**, nor call other functions defined in the strategy. Pass the data it needs as arguments: ```threading.Thread(func, arg1, arg2, ...)```.
- Plain objects and arrays passed as arguments are **deep-copied**: changing them inside the thread does not affect other threads. When several threads need to see the same data, use a dictionary created by ```threading.Dict()```.
- Functions can be passed as arguments too; ```threading.Thread()``` also accepts function source strings, which can be used to load external libraries in the thread.
- Platform API functions such as ```exchange.GetTicker()``` and ```Log()``` can be called directly in a thread.
- The return value of the thread function is retrieved with ```join()```: ```t.join().ret```.

## Exchanging data between threads

| Method | Usage | Notes |
| - | - | - |
| Messages | ```t.postMessage(msg)``` sends to thread ```t```; inside a thread, ```threading.currentThread().peekMessage(timeout)``` reads the messages it received; a child thread sends back to the main thread with ```threading.mainThread().postMessage(msg)``` | Each thread has its own inbox, read in order. ```peekMessage(-1)``` does not block and returns an empty value when there is no message |
| Shared dictionary | ```var d = threading.Dict()```, pass it to threads as an argument, then each thread uses ```d.get(key)``` and ```d.set(key, value)``` | Good for holding the "latest state", such as the latest price or a running flag |
| Thread data | ```t.setData(key, value)```, ```t.getData(key)``` | Key-value pairs attached to a thread object; invalid after the thread ends (```join()```, ```terminate()```) |
| Synchronization objects | ```threading.Lock()```, ```threading.Event()```, ```threading.Condition()``` | Passed to threads as arguments for mutual exclusion and waiting for notifications |

A message received by a thread also raises an event, so the thread object's `eventLoop` can wait for messages and other events in one place.

## Thread lifecycle

- ```t.join()``` waits for the thread to end and returns its result, with an optional timeout; ```t.terminate()``` ends a thread forcibly.
- When a thread has ended and is no longer referenced, its resources are reclaimed automatically; there is no need to call ```join()``` just to free them. An error is raised when more than 2000 threads are kept referenced and cannot be reclaimed.
- ```threading.pending()``` returns the number of running threads (main thread included).
- All threads end when the live trading stops. Waits in ```peekMessage()```, ```join()```, locks and events are interrupted by the stop.

## Serving from inside the strategy

```threading.Serve(address, handler, ...args)``` starts an HTTP (WebSocket included) or TCP service inside the strategy process. Each request or connection calls the handler in its own thread. It returns a `Server` object (```addr()``` gives the actual listening address, ```close()``` shuts it down). Like thread functions, handlers run in isolated environments and receive what they need as arguments; a ```threading.Dict()``` is commonly used to share state with the main thread. For the address syntax and the methods of the ```ctx``` object see `Serve`.

The old global function ```__Serve()``` still works but only returns the listening address string; use ```threading.Serve()``` in new code.

## Examples

### Several threads compute in parallel, the main thread collects the results

Each thread fetches the K-lines of one symbol and computes a moving average; the result goes back to the main thread as the return value. Note that the symbol is passed as an argument and the thread function references no outer variables.

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
            return {symbol: symbol, close: records[records.length - 1].Close, ma20: ma[ma.length - 1]}
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

### A background thread collects prices, the main thread reads them and sends commands

The background thread writes the latest price into a shared dictionary and reports errors to the main thread through messages; the main thread tells it to exit with a message.

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

### A status endpoint with threading.Serve

The main thread writes the state into a shared dictionary; the HTTP handler gets the same dictionary as an argument and returns it as JSON.

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

Every live trading has a channel whose ID is the live trading ID. A live trading publishes data on its own channel with ```SetChannelData()```, and other live tradings read it with ```GetChannelData(liveTradingId)```. The data is relayed by the platform server, so it can travel across dockers and servers.

A channel holds the **latest state**, not a message queue: each publish overwrites the previous data, and a subscriber always reads the current latest copy. If history is needed, the subscriber keeps it itself.

Typical uses:

- **Master/follower**: a master strategy analyzes the market and publishes signals; several follower strategies read them and trade on their own accounts.
- **Status monitoring**: each strategy publishes its running status; a monitoring live trading collects them for display or alerts.
- **Data sharing**: one live trading computes indicators and publishes the results; others use them directly instead of computing them again.

## Key points

- **The first read subscribes**: the first ```GetChannelData()``` call for a channel subscribes to it and returns an empty value (```null```/```None```). From then on the server pushes the channel's updates to this live trading, and later calls return the latest data. A subscriber should start reading at startup and handle empty values.
- **Subscription limit**: a live trading can subscribe to at most 10 different channels (UUID channels below included). Beyond that, the call returns an empty value and logs the error ```channel subscriber exceed limit```.
- **Data format**: in JavaScript and Python, ```SetChannelData()``` accepts any JSON-serializable data and the subscriber reads the parsed object. Unchanged data is not sent again. For the data size limit see `SetChannelData`.
- **Rust**: ```SetChannelData(string)``` only accepts a string, so build the JSON text yourself; ```GetChannelData()``` takes no channel argument and cannot choose the channel to read, so it cannot subscribe to other live tradings or UUID channels. Rust strategies are suited to publishing; write subscribers in JavaScript or Python.
- **Cross-platform push**: an external system (a TradingView alert, your own program, etc.) can push data to a given live trading on a channel identified by a 32-character UUID through the extended API's ```method=pub```; the live trading reads it with ```GetChannelData(UUID)```. See `SetChannelData` and `GetChannelData` for details.
- **Live trading feature**: channels are meant for communication between live tradings; do not rely on them in backtests. The current live trading ID is available from ```_G()```.
- Do not pass keys or other sensitive information through channels.

## Basic usage

### Publisher: publish a market summary

```javascript
function main() {
    var robotId = _G()  // current live trading ID, which is also this live trading's channel ID
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
    robotId = _G()  # current live trading ID, which is also this live trading's channel ID
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
    let robotId = _G!();  // current live trading ID, which is also this live trading's channel ID
    let mut updateId = 0;

    loop {
        if let Ok(ticker) = exchange.GetTicker("BTC_USDT") {
            updateId += 1;
            // Rust's SetChannelData only accepts a string; build the JSON text yourself
            let state = format!(
                r#"{{"robotId": "{}", "updateId": {}, "timestamp": {}, "symbol": "BTC_USDT", "lastPrice": {}}}"#,
                robotId, updateId, Unix() * 1000, ticker.Last
            );
            SetChannelData(&state);
            LogStatus!("channel", robotId, "publish #", updateId, "last price:", ticker.Last);
        }
        Sleep(60000);  // publish once a minute
    }
}
```

### Subscriber: read two channels

```javascript
function main() {
    // live trading IDs to subscribe to (change as needed)
    var channels = ["632799", "632800"]

    while (true) {
        var msg = ""
        for (var i = 0; i < channels.length; i++) {
            // the first call subscribes and returns null; later calls return the latest data
            var state = GetChannelData(channels[i])
            if (state) {
                msg += "channel " + channels[i] + ": #" + state.updateId + " " + _D(state.timestamp) + " last " + state.lastPrice + "\n"
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
    # live trading IDs to subscribe to (change as needed)
    channels = ["632799", "632800"]

    while True:
        msg = ""
        for ch in channels:
            # the first call subscribes and returns None; later calls return the latest data
            state = GetChannelData(ch)
            if state:
                msg += "channel {}: #{} {} last {}\n".format(ch, state["updateId"], _D(state["timestamp"]), state["lastPrice"])
            else:
                msg += "channel {}: waiting for data\n".format(ch)
        LogStatus(msg)
        Sleep(5000)
```

```rust
// Rust's GetChannelData() takes no channel argument and cannot subscribe to other live tradings' channels
```

## Scenario: master/follower strategies

The master strategy computes a moving-average crossover signal and publishes it; the follower reads the signal and places an order when it changes.

**Master strategy (publishes signals)**

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

**Follower strategy (reads and executes signals)**

```javascript
function main() {
    var masterId = "632799"  // live trading ID of the master strategy
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
    masterId = "632799"  # live trading ID of the master strategy
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
// Rust's GetChannelData() takes no channel argument and cannot read the master strategy's channel
```

## Scenario: monitoring several strategies

Each strategy publishes its status as the publisher above does; the monitoring live trading reads every channel, shows them in a table and marks those without an update for over 2 minutes as abnormal.

```javascript
function main() {
    var monitorList = ["632799", "632800", "632801"]  // at most 10

    while (true) {
        var table = {type: "table", title: "Strategy status", cols: ["Live trading ID", "Status", "Last update", "Symbol", "Last price"], rows: []}
        for (var i = 0; i < monitorList.length; i++) {
            var data = GetChannelData(monitorList[i])
            if (data) {
                var status = Date.now() - data.timestamp < 120000 ? "running" : "abnormal"
                table.rows.push([monitorList[i], status, _D(data.timestamp), data.symbol || "-", data.lastPrice || "-"])
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
        table = {"type": "table", "title": "Strategy status", "cols": ["Live trading ID", "Status", "Last update", "Symbol", "Last price"], "rows": []}
        for robotId in monitorList:
            data = GetChannelData(robotId)
            if data:
                status = "running" if time.time() * 1000 - data["timestamp"] < 120000 else "abnormal"
                table["rows"].append([robotId, status, _D(data["timestamp"]), data.get("symbol", "-"), data.get("lastPrice", "-")])
            else:
                table["rows"].append([robotId, "waiting for data", "-", "-", "-"])
        LogStatus("`" + json.dumps(table) + "`")
        Sleep(10000)
```

```rust
// Rust's GetChannelData() takes no channel argument and cannot read other live tradings' channels
```

See also: `SetChannelData`, `GetChannelData`, `_G`

### API Rate Limiting Control

Exchanges limit how often their API may be called. Going over the limit gets requests rejected at best and the account temporarily banned at worst. With ```exchange.IO("rate", ...)``` or ```exchange.IO("quota", ...)``` you can cap the call frequency of standard functions locally on the docker: a call that exceeds the limit is never sent.

```js
exchange.IO("rate" | "quota", name, count, window[, "delay"])
```

## Two modes

- **rate (token bucket)**: the bucket capacity defaults to ```count```. It starts full and refills at a steady "count per window"; each call takes one token. Short bursts are allowed, while the long-run average never exceeds "count per window". Writing ```count``` as ```"10/5"``` means 10 refills per window with a bucket capacity of 5, which limits bursts.
- **quota (fixed window)**: at most ```count``` calls per window; the counter resets when the next window starts. Windows are aligned to the Unix epoch: ```"1s"``` to whole seconds, ```"1m"``` to whole minutes, ```"1h"``` to whole hours, ```"1d"``` to UTC midnight (08:00 Beijing time). For example, counting that starts at 12:00:00.900 is already in a new window at 12:00:01.000.

Use ```quota``` with a window matching the exchange's counting period when you must guarantee "no more than N calls in any of the exchange's periods"; use ```rate``` when you only need to control the average frequency.

## Parameters

| Parameter | Description |
| - | - |
| name | The function to limit, see the table below. Several names separated by commas (such as ```"GetTicker,GetDepth"```) share one rule and their calls are counted together. ```"*"``` is a fallback rule that applies only to functions without a rule of their own. |
| count | Calls allowed per window, must be greater than 0; in ```rate``` mode it can be written as ```"count/burst"```. Passing ```0``` or a negative number deletes the rule for that name. |
| window | A duration in the syntax of Go's ```time.ParseDuration```: units ```ns```, ```us``` (or ```µs```), ```ms```, ```s```, ```m```, ```h```, decimals allowed (```"1.5s"```), units can be combined (```"1h30m"```); ```"Nd"``` means N days (decimals allowed, such as ```"0.5d"```, not combinable with other units). ```"@HHMM"``` or ```"@HHMMSS"``` (such as ```"@0800"```) counts per day and resets at that time of day (Beijing time); it works with both ```rate``` and ```quota```. |
| action | When omitted, a call over the limit fails immediately; with ```"delay"``` the call blocks until a call is available and is then sent. Stopping the live trading interrupts the wait. |

## Function names that can be limited

| Category | Names |
| - | - |
| Market data | ```GetTicker```, ```GetTickers```, ```GetDepth```, ```GetTrades```, ```GetRecords```, ```GetMarkets```, ```GetFundings``` |
| Account | ```GetAccount```, ```GetAssets```, ```GetPositions```, ```SetMarginLevel``` |
| Trading | ```CreateOrder``` (```Buy``` and ```Sell``` count here too), ```CancelOrder```, ```ModifyOrder``` |
| Order queries | ```GetOrder```, ```GetOrders```, ```GetHistoryOrders``` |
| Conditional orders | ```CreateConditionOrder```, ```ModifyConditionOrder```, ```CancelConditionOrder```, ```GetConditionOrder```, ```GetConditionOrders```, ```GetHistoryConditionOrders``` |
| Custom requests | ```IO/api```: limits only ```exchange.IO("api", ...)```, other ```exchange.IO()``` commands are unaffected |

- ```GetAccount``` and ```GetAssets``` are the same underlying request; a rule under either name applies to both functions.
- Calls made concurrently through ```exchange.Go()``` are counted under the function actually called.

## Scope of rules

- Rules are set per exchange object: a rule on ```exchanges[0]``` does not affect ```exchanges[1]```.
- Rules last for the current run only. Set them again after the live trading restarts, usually at the beginning of ```main()```.
- Setting the same name again replaces its rule; an empty name (```exchange.IO("rate", "")```) clears all rules of that exchange object.
- Each call is counted under one rule only: a function with its own rule is no longer counted under ```"*"```, so ```"*"``` cannot be used as a "total quota for all calls" stacked on top of specific rules.

## When the limit is exceeded

With the default action, a call over the limit sends no request and is treated as a failed call (JavaScript returns ```null```, Python returns ```None```, Rust returns ```Err```). The error message looks like:

```
rate limit exceeded: GetTicker 10/1s
quota limit exceeded: GetTicker 10/1m
quota limit exceeded: GetRecords 2000/day (resets at 0800)
```

With the ```"delay"``` action the call blocks until a call is available, so the time recorded in the log is the time after the wait. With a rule that resets daily, ```"delay"``` may wait until the next day; use it with care.

## Examples

### Default action: calls over the limit fail

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

### Rules grouped after the exchange's own limits

Market data and trading each share one rule; trading calls wait instead of failing when over the limit; every other function without a rule of its own falls back to ```"*"```.

```javascript
function main() {
    // market data: GetTicker and GetDepth together at most 20 calls per second on average
    exchange.IO("rate", "GetTicker,GetDepth", 20, "1s")
    // trading: placing orders (Buy/Sell included) and cancelling together 5 per second, wait when over the limit
    exchange.IO("rate", "CreateOrder,CancelOrder", 5, "1s", "delay")
    // fallback: other functions (such as GetAccount, GetPositions) together 60 per minute, window aligned to whole minutes
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
    # market data: GetTicker and GetDepth together at most 20 calls per second on average
    exchange.IO("rate", "GetTicker,GetDepth", 20, "1s")
    # trading: placing orders (Buy/Sell included) and cancelling together 5 per second, wait when over the limit
    exchange.IO("rate", "CreateOrder,CancelOrder", 5, "1s", "delay")
    # fallback: other functions (such as GetAccount, GetPositions) together 60 per minute, window aligned to whole minutes
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
    // market data: GetTicker and GetDepth together at most 20 calls per second on average
    let _ = exchange.IO(("rate", "GetTicker,GetDepth", 20, "1s"));
    // trading: placing orders (Buy/Sell included) and cancelling together 5 per second, wait when over the limit
    let _ = exchange.IO(("rate", "CreateOrder,CancelOrder", 5, "1s", "delay"));
    // fallback: other functions (such as GetAccount, GetPositions) together 60 per minute, window aligned to whole minutes
    let _ = exchange.IO(("quota", "*", 60, "1m"));

    loop {
        if let (Ok(ticker), Ok(depth)) = (exchange.GetTicker("BTC_USDT"), exchange.GetDepth("BTC_USDT")) {
            Log!("last:", ticker.Last, "best bid:", depth.Bids[0].Price);
        }
        Sleep(1000);
    }
}
```

### Burst capacity, daily quota and deleting rules

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

The FMZ Quant Trading Platform supports options trading on the cryptocurrency futures exchanges below. Options are used the same way as futures contracts: set the contract to an option code with ```exchange.SetContractType()``` (the option code is the exchange's native code, and the format differs between exchanges). After that, market data functions such as ```GetTicker()``` and ```GetDepth()``` and trading functions such as ```Buy()```, ```Sell()``` (set the trade direction with ```exchange.SetDirection()``` before placing orders), ```CancelOrder()``` and ```GetPositions()``` all work on that option contract. You can also place orders with the full instrument code in the form ```pair.optionCode```, for example ```BTC_USDT.BTC-260925-145000-C```.

Option order books are usually thin: when there is no bid or ask, ```Buy``` and ```Sell``` in the ```Ticker``` are 0, and ```Last``` may be 0 for a contract that has never traded; see each exchange below. Whether ```exchange.GetMarkets()``` lists option contracts depends on the exchange; where it does not, get the option codes from the exchange's API or website.

## Futures_Deribit

After setting an option contract you can get market data, place and cancel orders and query positions. Option code examples: ```BTC-13SEP24-60000-C```, ```XRP_USDC-27SEP24-1-C```; combination examples: ```BTC-CS-6SEP24-57000_57500```, ```BTC-PCAL-20SEP24_13SEP24-55000```. The result of ```exchange.GetMarkets()``` includes option contracts.

Reference strategy: [Deribit options test strategy](https://www.fmz.com/strategy/179475)

## Futures_OKX

Used the same way as Deribit. Set the trading pair to ```BTC_USD``` or similar; option codes look like ```BTC-USD-200626-4500-C```. For an option that has never traded, ```Last``` in ```GetTicker()``` is the mark price. ```exchange.GetMarkets()``` does not list option contracts; the option contract list is available from OKX's ```/api/v5/public/instruments``` endpoint, for example BTC options:

```js
function main() {
    Log(HttpQuery("https://www.okx.com/api/v5/public/instruments?instType=OPTION&uly=BTC-USD"))
}
```

```python
import json
import urllib.request
def main():
    ret = json.loads(urllib.request.urlopen("https://www.okx.com/api/v5/public/instruments?instType=OPTION&uly=BTC-USD").read().decode('utf-8'))
    Log(ret)
```

```rust
fn main() {
    let body: String = HttpQuery("https://www.okx.com/api/v5/public/instruments?instType=OPTION&uly=BTC-USD", None);
    Log!(body);
}
```

## Futures_Binance

Binance European options (USDT-settled) are supported. Set the trading pair to ```BTC_USDT``` or similar; option codes look like ```BTC-260925-145000-C``` (underlying-expiry YYMMDD-strike-C/P). Options trading must be enabled on the account. Limitations:

- Only limit orders are supported; market orders, conditional orders and order amendment (```exchange.ModifyOrder()```) are not.
- Leverage and margin mode settings such as ```exchange.SetMarginLevel()``` are not supported.
- Unified (portfolio margin) accounts do not support options.
- ```exchange.GetMarkets()``` does not list option contracts.

## Futures_Bybit

Options with two settlement currencies are supported:

- USDC-settled: set the trading pair to ```ETH_USDC``` or similar; option codes look like ```ETH-25NOV22-1375-P```.
- USDT-settled: set the trading pair to ```ETH_USDT``` or similar; the option code has an extra settlement-currency suffix compared with USDC-settled ones, like ```ETH-25JUN27-2800-C-USDT```.

The result of ```exchange.GetMarkets()``` includes options of both settlement currencies. Bybit has no kline endpoint for options, so ```GetRecords()``` is built from trades.

## Futures_Aevo

USDC options on Aevo are supported. Set the trading pair to ```ETH_USDC``` or similar; option codes look like ```ETH-30JUN23-1600-C```. ```Last``` in ```GetTicker()``` is the mark price. Aevo has no kline endpoint, so ```GetRecords()``` is built from trades and is empty while the contract has no trades. The result of ```exchange.GetMarkets()``` includes option contracts.

## Futures_GateIO

USDT options on Gate are supported. Set the trading pair to ```BTC_USDT``` or similar; option codes look like ```BTC_USDT-20211130-65000-C```. The result of ```exchange.GetMarkets()``` includes option contracts. If options are not enabled on the account, order and position queries return the exchange's error.

## Futures_Kraken

Options on Kraken Futures are supported. Set the trading pair to ```ETH_USD``` or similar; option codes look like ```OF_ETHUSD_261225_4000_C``` (```OF_```, underlying and quote currency, expiry YYMMDD, strike, C/P). The underlying and quote currency in the code must match the trading pair, and BTC is written as ```XBT``` in the code (e.g. ```OF_XBTUSD_...```).

- Kraken has no option listing endpoint, so ```exchange.GetMarkets()``` does not include option contracts; get the option codes from the Kraken website.
- ```Last``` in ```GetTicker()``` is the mark price, and ```Buy```, ```Sell```, ```High``` and ```Low``` are 0; the raw data in ```Info``` carries the implied volatility, the greeks and other fields.
- Market data, klines, orders, positions and order history queries work; option orders go through the same order endpoint as futures contracts and have not been verified in live trading yet.
- Options have no funding rate, and ```exchange.SetMarginLevel()``` is not supported.

See also: `exchange.SetContractType`, `exchange.SetDirection`, `exchange.GetPositions`

### Web3

To swap tokens on the decentralized exchanges Uniswap and PancakeSwap, use the Uniswap exchange object (see Uniswap and PancakeSwap below). To read on-chain data, call smart contracts and send custom transactions, use the Web3 exchange object, which supports Ethereum and other EVM-compatible chains as well as TRON.

#### Uniswap and PancakeSwap

The Uniswap exchange object connects to the V2 and V3 pools of Uniswap or PancakeSwap on one chain and maps on-chain swaps to spot trading functions: check prices with ```exchange.GetTicker()``` and place orders with ```exchange.CreateOrder()```, with no ABIs to register and no contract calls to encode. Routing, quoting, token approval, price protection and sending transactions are all handled by the exchange object.

## When to use the Uniswap exchange object and when to use Web3

- To **swap tokens** on Uniswap or PancakeSwap: use the Uniswap exchange object.
- To call other contracts or other DEX features (such as providing liquidity or managing V3 positions), to use other chains, or to build custom transactions: use the Web3 exchange object, see Advanced Topics → Web3 → Ethereum (EVM).

A strategy can add both kinds of exchange objects and use the same wallet with them.

## Configure the exchange object

| Field | Description |
| - | - |
| DEX | ```Uniswap``` or ```PancakeSwap``` |
| Chain | ```Ethereum```, ```Arbitrum```, ```Base```, ```BNB Chain```. One exchange object is one DEX on one chain |
| Private Key | Wallet private key (hex string). The key can be deployed locally on the docker, see Getting Started → Key Security |
| Rpc Address | Node address of the chain; a public node is filled in when the chain is chosen (```https://ethereum-rpc.publicnode.com``` for Ethereum, for example). Several nodes separated by commas back each other up |
| Rpc Api Key | Node authentication, may be left empty. Written as ```Name: value``` it is sent as a request header with that name; otherwise it is sent as ```Authorization: Basic <value>``` |

On the first call the exchange object checks that the node is on the configured chain and reports an error otherwise, so transactions never go to another chain. The wallet needs the chain's native coin (ETH or BNB) to pay gas.

## Trading pairs

- Pairs are written as ```base_quote```, such as ```ETH_USDC``` or ```UNI_USDT```.
- Token names are resolved in this order: built-in common tokens (native coin, wrapped native coin, USDC, USDT, etc.) → tokens registered with ```exchange.IO("token", name, contractAddress)``` → the official token lists. When the official list has several tokens with the same name on a chain, use the contract address instead.
- Tokens not in the token table can be used directly by contract address as part of the pair, for example ```0x1f9840a85d5af5bf1d1762f925bdaddc4201f984_USDC```.
- **The native coin and its wrapped token are two different assets**: ```ETH``` and ```WETH```, ```BNB``` and ```WBNB``` are different currencies. When trading the native coin, the router wraps and unwraps automatically. Converting between the two cannot be done with orders; use ```exchange.IO("wrap", amount)``` and ```exchange.IO("unwrap", amount)```, which call the wrapped token contract directly, 1:1, costing only gas.
- ```exchange.GetMarkets()``` lists only common pairs; pairs not listed can be traded as well.

## What the standard functions do

| Function | Behavior |
| - | - |
| ```exchange.GetTicker()``` | Best bid and ask are executable prices from actual quotes of a certain size (pool fees included); there are no 24-hour statistics on chain |
| ```exchange.GetDepth()``` | Price levels derived from on-chain quotes of increasing size, not a real order book |
| ```exchange.GetTrades()``` | Recent on-chain swaps in the pair's pools |
| ```exchange.GetAccount()```, ```exchange.GetAssets()``` | Balances of the native coin and of the tokens in the token table |
| ```exchange.CreateOrder()``` | Swaps on chain immediately, see below |
| ```exchange.GetOrder()``` | The order ID is the transaction hash and the status comes from the receipt: unfinished before it is mined, filled or failed after |
| ```exchange.GetOrders()``` | Orders sent in the current run that are not mined yet |
| ```exchange.CancelOrder()``` | Sends a replacement transaction with the same nonce, best effort, see below |

```exchange.GetRecords()```, ```exchange.GetTickers()``` and ```exchange.GetHistoryOrders()``` are not supported.

## Placing orders

A DEX has no order book; every order is a swap executed on chain immediately. It either fills completely or reverts completely (losing only gas); it never fills partially and never rests waiting for a price.

- **Limit orders**: the limit price is the **worst execution price**. A quote is taken first; if the current price cannot reach the limit, an error is returned and no transaction is sent. Otherwise the minimum to receive / maximum to pay is written into the on-chain transaction, and if the price moves before the transaction is mined so that the limit can no longer be met, the whole swap reverts.
- **Market orders**: the minimum to receive / maximum to pay is the quote minus slippage. Slippage defaults to 0.5% and is changed with ```exchange.IO("slippage", ratio)```.
- **Amount**: for sells, the amount of base currency to sell; for limit buys, the amount of base currency to buy; **for market buys, the amount of quote currency to spend**.
- Settings for a single order can be appended after the side argument, for example ```exchange.CreateOrder("ETH_USDC", 'sell;{"slippage":0.01,"route":"v3"}', -1, 0.1)```: ```slippage``` is the slippage for this order, ```route``` restricts the route type (```v2```, ```v3```, ```hop``` for two hops, ```direct```).
- Before selling a token (ERC20), the router's allowance is checked; if it is not enough, an approval transaction is sent first and waited for. By default only the amount needed is approved; ```exchange.IO("approve", "max")``` switches to unlimited approval and saves later approval transactions.
- A transaction not mined before its deadline (120 seconds by default, change it with ```exchange.IO("deadline", seconds)```) reverts, so it cannot fill after the price has moved a lot.

## Cancelling orders

```exchange.CancelOrder()``` sends a zero-value transaction to yourself with the original order's nonce and a higher fee; if it is mined first, the original order becomes invalid. This is a best effort: the original order may be mined and filled before the replacement, and cancelling an order that is already mined returns an error. Check the final status with ```exchange.GetOrder()``` after cancelling.

## Common exchange.IO() commands

| Command | Purpose |
| - | - |
| ```exchange.IO("slippage", ratio)``` | Slippage for market orders, default ```0.005``` |
| ```exchange.IO("deadline", seconds)``` | Transaction deadline, default 120 seconds |
| ```exchange.IO("gasMultiplier", x)``` | Gas limit = node estimate × x, default 1.2 |
| ```exchange.IO("approve", "exact" or "max")``` | Approval mode |
| ```exchange.IO("token", name, contractAddress)``` | Register a token; without arguments, list the token table |
| ```exchange.IO("route", symbol, side, amount)``` | Quote only: prices of the candidate routes and the best one, no order |
| ```exchange.IO("simulate", symbol, side, amount[, price])``` | Build the transaction as an order would and only simulate it on chain, no gas spent |
| ```exchange.IO("transfer", toAddress, amount[, token])``` | Send the native coin or a token; the amount can be ```"all"``` |
| ```exchange.IO("receipt", txHash[, waitMs])``` | Receipt of a transfer or other transaction, optionally waiting for it to be mined |
| ```exchange.IO("wrap", amount)```, ```exchange.IO("unwrap", amount)``` | Convert between the native coin and the wrapped token 1:1 |
| ```exchange.IO("contracts")``` | Contract addresses of this DEX on this chain |
| ```exchange.IO("base", nodeAddress)```, ```exchange.IO("sendBase", nodeAddress)``` | Switch nodes; set a node used only for broadcasting transactions (private transaction channel) |
| ```exchange.IO("address")``` | Wallet address |

For the parameters and return values of each command see the `Uniswap` category of the syntax manual.

## Example: quote, simulate, then sell at market

Uses ```ETH_USDC``` on Ethereum. Note that ```CreateOrder``` sends a real transaction.

```javascript
function main() {
    var symbol = "ETH_USDC"
    exchange.IO("slippage", 0.003)   // 0.3% slippage for market orders

    var t = exchange.GetTicker(symbol)
    Log("bid:", t.Buy, "ask:", t.Sell)

    // quote only: best route for selling 0.1 ETH
    var r = exchange.IO("route", symbol, "sell", 0.1)
    Log("best route:", r.best, "price:", r.price)

    // simulate on chain first, no gas spent
    if (!exchange.IO("simulate", symbol, "sell", 0.1)) {
        Log("simulation failed:", GetLastError())
        return
    }

    // sell 0.1 ETH at market; the order ID is the transaction hash
    var id = exchange.CreateOrder(symbol, "sell", -1, 0.1)
    if (!id) {
        Log("order failed:", GetLastError())
        return
    }
    while (true) {
        var o = exchange.GetOrder(id)
        if (o && o.Status != ORDER_STATE_PENDING) {
            Log("status:", o.Status, "filled:", o.DealAmount, "average price:", o.AvgPrice)
            break
        }
        Sleep(3000)
    }
}
```

See also: `Uniswap`, `exchange.CreateOrder`, `exchange.CancelOrder`

#### Ethereum (EVM)

With ```ChainType``` set to ```ETH```, the Web3 exchange object connects to nodes of Ethereum and every EVM-compatible chain (BSC, Base, Arbitrum, Optimism, Polygon and so on), and uses the ```exchange.IO()``` commands to query balances, call contracts and send transactions. This page walks through the commands in the order of a typical on-chain operation; for the full parameters of each command see the corresponding ```exchange.IO("command", ...)``` in the `Web3` category of the syntax manual.

If you only want to swap tokens on Uniswap or PancakeSwap, use the Uniswap exchange object (see Advanced Topics → Web3 → Uniswap and PancakeSwap): it supports standard functions such as ```exchange.GetTicker()``` and ```exchange.CreateOrder()``` directly, with no contract calls to encode yourself.

## 1. Configure the exchange object

Add an exchange on the "Exchange" page (```/m/add-platform```), choose the protocol "Cryptocurrency" and the exchange ```Web3```:

| Field | Description |
| - | - |
| ChainType | ```ETH```: Ethereum and all EVM-compatible chains; ```TRON```: TRON, see Advanced Topics → Web3 → TRON |
| Private Key | Wallet private key (hex string, the ```0x``` prefix is optional). The key can be deployed locally on the docker, see Getting Started → Key Security |
| Rpc Address | Node address, by default ```https://ethereum-rpc.publicnode.com``` (a public Ethereum mainnet node). For other chains enter a node of that chain, for example BSC: ```https://bsc-dataseed.binance.org```. ```http(s)://``` and ```ws(s)://``` are supported. Several nodes separated by commas back each other up |
| Rpc Api Key | Node authentication, may be left empty. Written as ```Name: value``` (such as ```x-api-key: xxx```) it is sent as a request header with that name; otherwise it is sent as ```Authorization: Basic <value>``` |

With several nodes, requests start from the node that last succeeded and move on only when a node is unavailable (connection failure, timeout, rate limiting); errors such as a failed contract execution are returned directly. Nodes whose chain ID differs from the first node's are skipped, so transactions are never sent to another chain.

At runtime, ```exchange.IO("base", nodeAddress)``` switches nodes (several nodes can be passed as an array or a comma-separated string), ```exchange.IO("key", privateKey)``` switches the wallet private key, and `exchange.IO("address")` returns the current wallet address.

Among the standard functions only ```exchange.GetAccount()``` and ```exchange.GetAssets()``` are available; they return the wallet's native coin balance (the currency is recognized from the chain ID, ```BNB``` on BSC for example).

## 2. Query balances and read contracts

Read-only contract methods (```view```/```pure```) cost no gas and return decoded results directly:

```js
exchange.IO("api", "eth", "eth_getBalance", wallet, "latest")   // native coin balance, on-chain integer (hex string)
exchange.IO("api", tokenAddress, "balanceOf", wallet)           // ERC20 balance, on-chain integer
exchange.IO("api", tokenAddress, "decimals")                    // token decimals
```

- ```exchange.IO("api", "eth", method, ...args)``` calls the node's JSON-RPC methods directly, such as ```eth_gasPrice```, ```eth_blockNumber``` and ```eth_getTransactionReceipt```.
- ```exchange.IO("api", contractAddress, method, ...args)``` calls a contract method. The method can be a name, a full signature (such as ```"approve(address,uint256)"```, to tell overloads apart) or a selector (such as ```"0x095ea7b3"```).
- On-chain amounts are integers. ```exchange.IO("fromUnits", onChainInteger, decimals)``` converts to a readable amount and ```exchange.IO("toUnits", "1.5", decimals)``` converts back; a token contract address can be passed in place of the decimals. Both compute exactly on strings.
- Use ```exchange.IO("multicall", ...)``` to read many contracts in one request, and ```exchange.IO("logs", ...)``` to query event logs.

## 3. Register ABIs

Standard ERC20 methods (```balanceOf```, ```decimals```, ```allowance```, ```approve```, ```transfer``` and others) are built in and need no registration. Before calling methods of other contracts, register the contract's ABI with ```exchange.IO("abi", contractAddress, abi)```.

Common contracts can use built-in templates by passing the template name as the third argument: ```"weth"```, ```"uniswapV3Pool"```, ```"uniswapV3Factory"```, ```"uniswapV3QuoterV2"```, ```"uniswapV3SwapRouter02"```, ```"uniswapV3PositionManager"```, ```"permit2"``` (PancakeSwap V3 uses the same templates, aliases such as ```"pancakeV3Pool"``` also work). Addresses of common contracts are available from ```exchange.IO("contracts")```.

```js
exchange.IO("abi", poolAddress, "uniswapV3Pool")
var slot0 = exchange.IO("api", poolAddress, "slot0")
```

The ABI of other contracts can be obtained from a block explorer, for example Etherscan's V2 API (an Etherscan API key is required, ```chainid``` is the chain ID, take the ```result``` field of the response):

```url
https://api.etherscan.io/v2/api?chainid=1&module=contract&action=getabi&address=0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45&apikey=YourApiKey
```

## 4. Send transactions

When a write method of a contract is called, the exchange object signs the transaction with the configured private key, broadcasts it and returns the transaction hash. Before sending you can replace ```"api"``` with ```"call"``` and rehearse the same call with ```exchange.IO("call", ...)```: it is simulated on the node without signing or spending gas; on failure it returns an empty value and ```GetLastError()``` holds the reason given by the contract.

Taking approve as an example:

```js
var amount = exchange.IO("toUnits", "100", tokenAddress)                 // 100 tokens as an on-chain integer
var txHash = exchange.IO("api", tokenAddress, "approve", spender, amount)
```

When the method's ```stateMutability``` is ```payable```, pass one extra argument before the method arguments: the amount of native coin to attach (on-chain integer). The last argument can be an options object:

| Option | Description |
| - | - |
| gasLimit | Gas limit. Estimated by the node (```eth_estimateGas```) when omitted. Do not use ```21000``` for contract calls; that is only enough for a plain transfer |
| gasPrice | Fixed gas price; when given, a legacy transaction is sent. When omitted, chains that support EIP-1559 get an EIP-1559 transaction: the tip is the larger of the node's suggestion and the tips actually paid in recent blocks, and the max fee is ```2 × baseFee + tip``` |
| nonce | A specific nonce. Allocated automatically when omitted and kept in sync with the on-chain pending count, so consecutive sends never reuse a nonce |
| dryRun | When ```true```, sign without broadcasting and return fields such as ```hash```, ```raw``` (the signed transaction), ```nonce``` and ```gasLimit```, for checking the transaction or sending it through another channel |

Native coin is sent with ```exchange.IO("api", "eth", "send", toAddress, amount)```, where the amount is an on-chain integer (wei). Its options also accept ```data``` (hex call data) to send a transaction ```{to, data, value}``` returned by an aggregator API as is; gas is then estimated as for a contract call. Note: a plain transfer without ```gasPrice``` bids a fixed 100 Gwei with a gas limit of 21000, usually too high on Ethereum mainnet; query ```eth_gasPrice``` first and pass it in.

To send transactions through a private channel (such as Flashbots Protect or MEV Blocker) and avoid front-running, set a node used only for broadcasting with ```exchange.IO("sendBase", nodeAddress)```.

## 5. Wait for the transaction to be mined

```exchange.IO("waitReceipt", txHash, {timeout, confirmations})``` waits until the transaction is mined with the required confirmations and returns the receipt: ```status``` is ```1``` for success and ```0``` for failure (with the reason in ```revertReason```), and ```events``` holds the events decoded with the registered ABIs. It returns an empty value on timeout.

## 6. Nonce management, speeding up and cancelling

- ```exchange.IO("nonce")``` shows the on-chain and local nonce counts; ```exchange.IO("nonce", "sync")``` resyncs from the chain (use it after the same wallet has sent transactions elsewhere).
- When a transaction stays unmined for a long time, ```exchange.IO("speedUp", txHash)``` resends it with the same nonce and a higher fee, and ```exchange.IO("cancelTx", txHash)``` replaces it with a zero-value transaction to yourself using the same nonce. Both only work before the original transaction is mined.
- The local nonce record only exists inside the current live trading instance: instances that share one wallet cannot see each other's records and may still collide, so give each instance its own wallet.

## Other commands

- Encoding and decoding: ```exchange.IO("encode", ...)``` encodes contract call data or values by type (like Solidity's ```abi.encode```), ```exchange.IO("encodePacked", ...)``` does packed encoding (for example a Uniswap V3 swap path), and ```exchange.IO("decode", ...)``` decodes by type.
- Signing: ```exchange.IO("sign", ...)``` signs a 32-byte hash, ```exchange.IO("signTypedData", ...)``` signs EIP-712 typed data (such as ERC-20 Permit), and ```exchange.IO("signMessage", ...)``` signs a message with EIP-191.
- Uniswap V3 math: ```exchange.IO("uniswapV3", ...)``` converts between ticks, prices and sqrtPrice, and between liquidity and token amounts.
- Hashing: ```exchange.IO("hash", "keccak256", "raw", "hex", text)``` computes keccak256 and other digests, for example method selectors and EIP-712 digests; its parameters are the same as those of the ```Encode()``` function.
- Complete examples: a swap through an aggregator (quote, build the transaction, rehearse it with ```exchange.IO("call", ...)```, send it with ```data```) is in the examples of ```exchange.IO("call", ...)``` in the syntax manual; an ERC-20 Permit signature verified by the contract is in the examples of ```exchange.IO("sign", ...)``` and ```exchange.IO("signTypedData", ...)```.

## Example: query balances, approve and wait for the transaction

Uses USDC on Ethereum mainnet. Note that this code sends a real transaction and spends gas.

```javascript
function main() {
    var usdc = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"     // USDC on Ethereum mainnet
    var spender = "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45"  // the contract to approve, Uniswap SwapRouter02 here
    var wallet = exchange.IO("address")

    // balances: standard ERC20 methods need no ABI registration
    var eth = exchange.IO("fromUnits", exchange.IO("api", "eth", "eth_getBalance", wallet, "latest"), 18)
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

With ```ChainType``` set to ```TRON```, the Web3 exchange object connects to a TRON node. Usage is largely the same as on Ethereum (see Advanced Topics → Web3 → Ethereum (EVM)): the ```exchange.IO()``` commands for registering ABIs, calling contracts, encoding and decoding, signing and switching private keys are the same, addresses use the TRON format (starting with ```T```), and TRX amounts are in sun (1 TRX = 1000000 sun). This page covers the configuration and the TRON-specific parts.

## Configure the exchange object

| Field | Description |
| - | - |
| ChainType | Choose ```TRON``` |
| Private Key | Wallet private key (hex string). The key can be deployed locally on the docker, see Getting Started → Key Security |
| Rpc Address | HTTP address of a TRON full node, for example the official node ```https://api.trongrid.io``` (testnets: ```https://nile.trongrid.io```, ```https://api.shasta.trongrid.io```) |
| Rpc Api Key | TronGrid API key. Enter only the key itself; it is sent as the ```TRON-PRO-API-KEY``` request header. It works without a key, but TronGrid rate-limits keyless requests more strictly |

The docker accesses TRON through the full node's HTTP API (```/wallet/...```) and no longer uses gRPC. The old gRPC address ```grpc.trongrid.io:50051``` that the form fills in by default for TRON is replaced automatically with ```https://api.trongrid.io``` (```grpc.nile.trongrid.io:50051``` and ```grpc.shasta.trongrid.io:50051``` likewise become the HTTP addresses of the corresponding testnets); any other gRPC address is rejected, so enter the node's HTTP address instead.

At runtime, ```exchange.IO("base", nodeAddress)``` switches nodes, ```exchange.IO("key", privateKey)``` switches wallets, and ```exchange.IO("address")``` returns the current wallet address (starting with ```T```). The standard functions ```exchange.GetAccount()``` and ```exchange.GetAssets()``` return the wallet's TRX balance. An account that has not been activated yet (no on-chain record) reads as 0 TRX.

## Calling smart contracts

As on Ethereum, use ```exchange.IO("api", contractAddress, method, ...args)```: read-only methods return results directly, write methods sign and broadcast a transaction and return the transaction ID. Standard TRC20 methods are built in; for other contracts without a registered ABI, the ABI is read from the chain automatically, and only when that fails do you need to register it with ```exchange.IO("abi", contractAddress, abi)```. The last argument of a write method can be ```{gasLimit: amount}``` to set the fee limit (feeLimit, in sun).

```js
// USDT (TRC20) contract
var usdt = "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t"
Log(exchange.IO("api", usdt, "balanceOf", exchange.IO("address")))   // on-chain integer, USDT has 6 decimals
```

Encoding and decoding work as on Ethereum; address arguments can be written directly as ```T``` addresses:

```js
exchange.IO("encode", "address", "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t")
// 000000000000000000000000a614f803b6fd780986a42c78ec9c7f77e6ded13c
exchange.IO("encodePacked", "address", "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t")
// a614f803b6fd780986a42c78ec9c7f77e6ded13c
exchange.IO("decode", "string", "0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000a5465746865722055534400000000000000000000000000000000000000000000")
// Tether USD
```

## Calling TRON node methods

```exchange.IO("api", "tron", method, ...args)``` calls TRON node methods; method names are case-insensitive. Methods that need a signature (transfers, triggering contracts, etc.) are signed and broadcast automatically. Common methods:

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
| ```TriggerConstantContract``` | caller address (may be empty), contract address, method, encoded arguments | Read-only contract call; the result is in ```constant_result``` (hex strings, decode them with ```exchange.IO("decode", ...)```) |
| ```TRC20ContractBalance``` | address, contract address | TRC20 balance (on-chain integer) |
| ```TRC20GetName```, ```TRC20GetSymbol```, ```TRC20GetDecimals``` | contract address | Name, symbol and decimals of a TRC20 token |
| ```TRC20Send```, ```TRC20Approve``` | from address, to or spender address, contract address, amount, feeLimit | TRC20 transfer and approval |
| ```TRC20Call``` | caller address (may be empty), contract address, call data, read-only flag, feeLimit | Call a contract with raw call data |
| ```ParseTRC20NumericProperty```, ```ParseTRC20StringProperty``` | hex data | Parse numbers and strings returned by TRC20 |

Node endpoints not in the table can be called with a path and a request body: ```exchange.IO("api", "tron", "/wallet/endpointName", {body})```.

## Differences from Ethereum

The following commands only work on Ethereum (EVM) and report an error on TRON: ```call```, ```multicall```, ```logs```, ```waitReceipt```, ```nonce```, ```speedUp```, ```cancelTx``` and ```contracts```; ```sendBase``` and multiple fallback nodes also only apply to Ethereum. On TRON, simulate a contract call with the node method ```TriggerConstantContract```, and query a transaction's execution result with ```GetTransactionInfoByID```.

```toUnits```, ```fromUnits```, ```uniswapV3```, the encoding and decoding commands and the signing commands work on TRON as well, and a TRC20 contract address can be passed as the decimals:

```js
var usdt = "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t"
var raw = exchange.IO("api", usdt, "balanceOf", exchange.IO("address"))
Log(exchange.IO("fromUnits", raw, usdt))   // converted to a readable amount with the contract's decimals()
```

When the node rejects a contract call at validation time (for example because the contract does not exist), the error carries the node's reason, such as ```tron contract call rejected (CONTRACT_VALIDATE_ERROR): Smart contract is not exist.```; a contract execution failure (revert) reports ```tron contract execution failed``` with the reason.

## Signing

```exchange.IO("hash", "sign", "hex", "hex", txHash)``` signs a 32-byte hash with the current private key and returns the 65-byte signature ```r‖s‖v``` (v is 0 or 1); other ```hash``` algorithms (such as ```"sha256"```) compute digests, the same as the ```Encode()``` function. When r, s and v (v being 27 or 28) are needed separately for contract verification, use ```exchange.IO("sign", ...)```, see the `Web3` category of the syntax manual.

## Examples

### Query TRX and USDT balances and read token information

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

### Read several contract methods at once with a Multicall contract

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
    exchange.IO("abi", multicall, `[{"inputs":[{"components":[{"internalType":"address","name":"target","type":"address"},{"internalType":"bytes","name":"callData","type":"bytes"}],"internalType":"struct TronMulticall.Call[]","name":"calls","type":"tuple[]"}],"name":"aggregate","outputs":[{"internalType":"uint256","name":"blockNumber","type":"uint256"},{"internalType":"bytes[]","name":"returnData","type":"bytes[]"}],"stateMutability":"view","type":"function"}]`)
    var ret = exchange.IO("api", multicall, "aggregate", calls)
    Log("name:", exchange.IO("decode", "string", ret.returnData[0]))
    Log("decimals:", exchange.IO("decode", "uint8", ret.returnData[1]))
    Log("balanceOf:", exchange.IO("decode", "uint256", ret.returnData[2]))
}
```

See also: `Web3`, `exchange.IO`

## Data and Research

The data explorer and the alpha factor analysis tool.

### Data Explorer

**datadata**, developed by FMZ Quant, is a quantitative financial data platform. The [Data Explorer](https://www.fmz.com/m/database) module of FMZ integrates its services and features, and FMZ users can use it without registering a separate **datadata** account. Analyze large amounts of data with SQL, build various charts through a visual interface and share them with your team. For examples, see the [Data Explorer articles](https://www.fmz.com/digest-topic/10370).

- Data sources: the data sources provided by datadata are updated continuously in real time and cover many kinds of data; you can also upload CSV files as private data sources and preview them on the Data Explorer page.
- Queries: query data with SQL, with query parameters; results can be downloaded as CSV or JSON files.
- Saving research: click "Save" at the top right to save the current SQL query to the resource list of your Data Explorer (the resource list button is to the left of "Save").
- Visualization: query results can be shown as tables or with various visualization components.
- Sharing research: as a public link, embed code (e.g. in a community post), an embedded web page, a data link or a preview image link. A "data link" also feeds the data straight to strategies, in both backtests and live robots.

### Alpha Factor Analysis Tool

The analysis formulas reference the market calculation methods from ```worldquant```'s publicly available [```alpha101```](https://github.com/yli188/WorldQuant_alpha101_code/blob/master/101%20Formulaic%20Alphas.pdf), with basic compatibility for its syntax (unimplemented features are noted), and have been enhanced. This tool is used for rapid time series computation and validation of trading ideas. [Alpha Factor Analysis Tool Page](https://www.fmz.com/m/alpha).

#### Functions and Operators

**The ```{}``` below represents placeholders, all expressions are case-insensitive, x represents data time series**

- ```abs(x), log(x), sign(x)```: absolute value, logarithm and sign function respectively.

The following operators ``` +, -, *, /, >, < ``` also conform to their standard meanings, ```==```: equality check, ```||```: logical OR, ```x ? y : z```: ternary conditional operator.

- ```rank(x)``` : Cross-sectional ranking, returns the percentile position. Requires a candidate pool of several instruments; with a single instrument nothing can be ranked and the raw value is returned.
- ```delay(x, d)``` : Returns the value of series x from d periods ago.
- ```sma(x, d)``` : Calculates the simple moving average of series x over d periods.
- ```correlation(x, y, d)```: Calculates the correlation coefficient between time series x and y over the past d periods.
- ```covariance(x, y, d)``` : Calculates the covariance between time series x and y over the past d periods.
- ```scale(x, a)``` : Normalizes data such that ```sum(abs(x))=a``` (a defaults to 1).
- ```delta(x, d)``` : Calculates the current value of time series x minus the value from d periods ago.
- ```signedpower(x, a)``` : ```x^a```.
- ```decay_linear(x, d)``` : Calculates the d-period weighted moving average of time series x, with weights d,d-1,d-2....1 (normalized).
- ```indneutralize(x, g)``` : Industry neutralization based on industry classification g, currently not supported.
- ```ts_{O}(x, d)``` : Performs operation O on the past d periods of time series x (O can specifically represent min, max, etc., see below), d will be converted to integer.
- ```ts_min(x, d)``` : Minimum value over the past d periods.
- ```ts_max(x, d)``` : Maximum value over the past d periods.
- ```ts_argmax(x, d)``` : Position of ```ts_max(x, d)```.
- ```ts_argmin(x, d)``` : Position of ```ts_min(x, d)```.
- ```ts_rank(x, d)``` : Ranking of time series x over the past d periods (percentile ranking).
- ```min(x, d)``` : ```ts_min(x, d)```.
- ```max(x, d)```: ```ts_max(x, d)```.
- ```sum(x, d)``` : Cumulative sum over the past d periods.
- ```product(x, d)``` : Cumulative product over the past d periods.
- ```stddev(x, d)``` : Standard deviation over the past d periods.

#### Input Data

**Input data is case-insensitive. Default data is the instrument selected on the webpage, but can also be specified directly, for example: ```binance.ada_bnb```**

- ```returns```: Close price returns.
- ```open, close, high, low, volume```: Open price, close price, high price, low price and volume within the period.
- ```vwap```: Volume-weighted average price (not yet implemented, currently using close price).
- ```cap```: Total market capitalization (not yet implemented).
- ```IndClass```: Industry classification (not yet implemented).

#### Others

Supports outputting multiple results at once, represented as a list. For example, ```[sma(close, 10), sma(high, 30)]``` will plot two lines on the chart. Besides inputting time series data, it can also be used as a simple calculator.

## Integrations

Driving the platform from AI assistants or other programs: AI integration (the MCP service), the extended API and trading terminal plugins.

### AI Integration

Connect FMZ to an AI coding assistant (AI agent) such as Claude Code, Codex or Cursor, and you can write strategies, run backtests, create and manage live trading, and read logs and profit just by talking to it. The assistant reaches these functions through the platform's MCP (Model Context Protocol) service, with an API KEY created for it alone; you choose its permissions when you approve it and can change or revoke them at any time.

**Connect with one sentence**

Tell your AI assistant:

```
Read https://www.fmz.com/agent/setup.md and connect to FMZ
```

The assistant follows that page; your only step is one click in the browser:

1. The assistant requests authorization and shows you a link such as ```https://www.fmz.com/agent/authorize?code=XXXX-XXXX```, valid for 10 minutes.
2. Open it in a browser where you are logged in to FMZ, check the requester's name and the permissions, and approve. You can untick permissions you do not want to grant.
3. The assistant receives an API KEY, writes it into its own MCP configuration and connects. From then on you can simply ask it to "list my live trading" or "backtest this strategy".

The assistant names the key "name @ machine" (for example ```Claude Code @ MacBook```). When a request with the same name is approved again, the old key is revoked and replaced, so connecting again does not pile up keys.

**Permissions**

| Permission | Allows | Default |
| - | - | - |
| read | Lists and details of strategies, live trading, nodes and exchange accounts; logs, messages, account summary (never any secret) | Yes |
| backtest | Start, query and stop backtests | Yes |
| write | Save strategies and versions, groups, alert switches; change the configuration of stopped live trading | Yes |
| trade | Create, start and stop live trading, send interactive commands (costs balance and places real orders) | Yes |
| danger | Delete strategies, live trading and nodes; publish strategies | No |

```danger``` is never granted by default: the assistant has to request it explicitly and you have to tick it on the approval page. Before calling a ```[trade]``` or ```[danger]``` tool the assistant should ask you first.

**Manual configuration**

Clients that cannot run commands (for example Cherry Studio) can be configured by hand:

1. Create an API KEY under Account settings → API KEY (```https://www.fmz.com/m/account#apikey```) and note its Access Key and Secret Key.
2. Add an MCP server of type Streamable HTTP to the client:
   - URL: ```https://www.fmz.com/api/mcp/<Access Key>```
   - Header: ```Authorization: Bearer <Secret Key>```

The Secret Key goes in the header only, never in the URL. Examples:

```bash
# Claude Code
claude mcp add --transport http fmz "https://www.fmz.com/api/mcp/<Access Key>" --header "Authorization: Bearer <Secret Key>"
```

```json
{"mcpServers": {"fmz": {"url": "https://www.fmz.com/api/mcp/<Access Key>", "headers": {"Authorization": "Bearer <Secret Key>"}}}}
```

The JSON is for Cursor (```~/.cursor/mcp.json```) and other clients that speak Streamable HTTP; Claude Desktop needs the ```npx mcp-remote``` bridge described in the setup page.

**Install the skills (recommended)**

The skills are knowledge packs written for AI assistants: platform workflow, the full API reference, how to write strategies in each language, backtesting and indicators. With them installed the assistant writes noticeably more accurate strategies. In a terminal:

```bash
npx skills add fmzquant/skills --global --yes -a claude-code
```

Put your assistant's name after ```-a``` (claude-code, codex, cursor, gemini-cli, ...). They can also be read on GitHub: ```https://github.com/fmzquant/skills```.

**Available tools**

Once connected the assistant can use the tools below; the list the assistant sees is authoritative:

| Permission | Tools |
| - | - |
| read | ```ping```, ```get_account_summary```, ```list_exchanges```, ```list_platforms```, ```list_nodes```, ```list_strategies```, ```get_strategy```, ```list_strategy_versions```, ```get_strategy_version```, ```list_robots```, ```get_robot```, ```get_robot_logs```, ```get_robot_profit```, ```get_robot_output```, ```list_messages```, ```list_groups```, ```revoke_my_key``` |
| backtest | ```run_backtest```, ```get_backtest```, ```list_backtests```, ```stop_backtest``` |
| write | ```check_strategy```, ```save_strategy```, ```save_strategy_version```, ```delete_strategy_version```, ```update_robot```, ```save_group```, ```move_to_group```, ```delete_group```, ```set_robot_alert```, ```set_node_alert```, ```delete_messages``` |
| trade | ```create_robot```, ```start_robot```, ```stop_robot```, ```restart_robot```, ```send_robot_command```, and the trading terminal plugin tools ```plugin_*``` (market data, orders, ...) |
| danger | ```delete_strategy```, ```delete_robot```, ```delete_node```, ```publish_strategy``` |

A typical session: ```list_platforms``` and ```list_nodes``` to see which exchange accounts and nodes the account has; ```save_strategy``` to save a strategy and ```check_strategy``` to check it; ```run_backtest``` and ```get_backtest``` to backtest; then ```create_robot``` to go live and ```get_robot``` / ```get_robot_logs``` to watch it.

**Security and management**

- Exchange API KEYs never pass through the assistant: add them on the Exchanges page of the website and the assistant picks them by id. No tool result ever contains a secret.
- At ```https://www.fmz.com/m/account#apikey``` you can see the key the assistant uses, change its permissions or lock it. Besides the permission names above, permissions can list tool names, and ```!tool_name``` excludes one tool.
- When you are done, ask the assistant to call ```revoke_my_key``` to revoke its own key, or delete it on that page.
- ```stop_robot``` stops live trading; it does not close positions.
- The first time the assistant creates live trading, backtest first and then run on a demo account or with a small amount.

**Common problems**

- No online node: live trading needs at least one online node, see Platform Basics → Nodes.
- Too many backtests: concurrent backtests are limited; have the assistant ```stop_backtest``` the ones it no longer needs.
- The assistant says a tool is missing or a call is refused: the key lacks that permission; change it on the API KEY page and reconnect.

The same API KEY also works with the Extended API (Integrations → Extended API Interface) for scripts and schedulers; prefer MCP wherever it can be used.

### Extended API Interface

The extended API is the platform's HTTP interface (```https://www.fmz.com/api/v1```) for scripts, scheduled jobs and other programs: query the account, dockers, strategies and live trading bots, create, restart and stop bots, send interactive commands to bots, and so on.

To operate the platform interactively from an AI assistant (Claude Code, Cursor, ...), prefer AI Integration (the MCP service, see Integrations → AI Integration): it has more tools, takes named parameters, and can be authorized by permission category. Both can use the same API KEY.

Steps: create an API KEY (Create ApiKey), send requests as described in Authentication Methods, and look up methods and parameters in Extended API Interface Details.

#### Create ApiKey

On the [Account Settings → API KEY](https://www.fmz.com/m/account#apikey) page (```/m/account#apikey```), click "Create New ApiKey" to get an ```AccessKey``` and a ```SecretKey```. The ```SecretKey``` carries every permission of the key; keep it secret. The same page lets you change the permissions of existing keys, or disable and delete them.

**Permissions**

When creating or editing a key, enter a comma-separated list in the "API Permissions" field:

- ```*```: allow all extended API methods.
- Method names: allow only the listed methods, e.g. ```GetRobotList,GetRobotDetail,CommandRobot```.
- ```!MethodName```: exclude a method, usually together with ```*```, e.g. ```*,!DeleteRobot,!DeleteNode```.

The same API KEY can also be used for AI Integration (the MCP service, see Integrations → AI Integration). Besides tool names, MCP tools can be authorized by permission category: ```read```, ```backtest```, ```write```, ```trade```, ```danger``` (see the AI Integration page), and ```!name``` excludes as well. Categories only apply to MCP tools; the extended API only recognizes method names and ```*```.

With an empty permission list the extended API does not restrict methods (MCP allows every tool except ```danger```). Grant only what each use needs, e.g. a key used only for TradingView alerts should get ```CommandRobot``` and nothing else.

#### Authentication Methods

The extended API supports two authentication methods:

- Signature authentication: the request parameters are signed with the ```SecretKey```, which itself never travels over the network. Programs should use this method.
- Direct verification: the ```SecretKey``` is put into the request URL itself; meant for webhooks such as TradingView that accept only a single URL.

##### Signature Authentication

**Request format**

Send a ```POST``` request to ```https://www.fmz.com/api/v1``` with the parameters as a form (```application/x-www-form-urlencoded```). The server also accepts the same parameters in the URL query string of a ```GET``` request, but then they end up in access logs along the way, so ```POST``` is recommended.

| Parameter | Description |
| - | - |
| version | Version, always ```1.0```. |
| access_key | The ```AccessKey``` of the API KEY. |
| method | Method name, e.g. ```GetNodeList```. |
| args | Method parameters as a JSON string: an array in parameter order (e.g. ```[]```, ```[123, "ok"]```), or an object keyed by parameter name (e.g. ```{"robotId": 123}```), see Extended API Interface Details. Treated as ```[]``` when omitted. |
| nonce | Timestamp in milliseconds. It must be within 1 hour of server time and greater than the ```nonce``` of this API KEY's previous request. |
| sign | Signature, computed as described below. |

The request does not contain the ```SecretKey```.

**Signature**

Concatenate the string below, where ```args``` is the exact JSON string being submitted:

```plaintext
version + "|" + method + "|" + args + "|" + nonce + "|" + secretKey
```

Compute the MD5 of the result and use its 32-character lowercase hexadecimal form as ```sign```.

**Python example**

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
print(api('GetRobotList', appId='member2'))           # By name: bots labeled member2
print(api('CommandRobot', 123, 'ok'))                 # Send an interactive command to bot 123
print(api('GetRobotDetail', 123))                     # Details of bot 123
```

**Go example**

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

    // Restart bot 123 with a new configuration; settings fields: see the bot configuration section in Extended API Interface Details
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

##### Direct Verification

Direct verification computes no signature; the ```secret_key``` is put into the request parameters instead. This produces a fixed URL that can be entered into webhooks such as TradingView that accept only a single URL.

> **Security note**: a ```secret_key``` in a URL ends up in browser history, proxy and server access logs, and the webhook provider's configuration; anyone who obtains the URL can call the API with this key's permissions. Use direct verification only for ```CommandRobot``` webhooks, and create a dedicated API KEY for it that is granted ```CommandRobot``` only (see Create ApiKey). If it leaks, delete that API KEY immediately.

The request parameters are ```access_key```, ```secret_key```, ```method``` and ```args``` (a JSON array, URL-encoded); ```version```, ```nonce``` and ```sign``` are not needed. ```CommandRobot``` skips the ```nonce``` check; other methods are still checked: without a ```nonce``` the server uses the current time (to the second), so a second call within the same second returns a nonce error (```code``` 3).

For example, with an API KEY whose ```AccessKey``` is ```xxx``` and ```SecretKey``` is ```yyy```, opening the URL below sends the interactive command ```ok12345``` to the live trading bot with ID ```186515```:

```plaintext
https://www.fmz.com/api/v1?access_key=xxx&secret_key=yyy&method=CommandRobot&args=%5B186515%2C%22ok12345%22%5D
```

**Receiving a webhook body**

When the command argument of ```CommandRobot``` is an empty string and the request is a ```POST```, the server sends the request body to the bot as the interactive command. For example, set the TradingView webhook URL to:

```plaintext
https://www.fmz.com/api/v1?access_key=xxx&secret_key=yyy&method=CommandRobot&args=%5B186515%2C+%22%22%5D
```

The ```args``` value ```%5B186515%2C+%22%22%5D``` decodes to ```[186515, ""]``` (```+``` is a URL-encoded space): ```186515``` is the bot ID and the command is an empty string.

Simulating a TradingView webhook alert:

```js
function main() {
    var options = {
        method: "POST",
        body: `{"test": 123}`,
        headers: {"Content-Type": "application/json"}
    }

    // A webhook alert sends a POST request with the required headers automatically
    return HttpQuery("https://www.fmz.com/api/v1?access_key=xxx&secret_key=yyy&method=CommandRobot&args=%5B186515%2C+%22%22%5D", options)
}
```

The content of the TradingView alert message box is the request body:

- JSON format:

  ![](https://www.fmz.com/upload/asset/16d8a37ef80d9ccd0079.png)

  ```plaintext
  {"close": {{close}}, "name": "aaa"}
  ```

  The bot with ID ```186515``` receives the interactive command ```{"close": 39773.75, "name": "aaa"}```.

- Text format:

  ![](https://www.fmz.com/upload/asset/16d8a506dfbb6c60a077.png)

  ```plaintext
  BTCUSDTPERP Crossing 39700.00 close: {{close}}
  ```

  The bot with ID ```186515``` receives the interactive command ```BTCUSDTPERP Crossing 39700.00 close: 39739.4```.

**Python and Go examples**

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

#### Extended API Interface Details

All methods are called through ```https://www.fmz.com/api/v1```; for the request format and signature see Authentication Methods → Signature Authentication, for the response structure and error codes see Extended API Interface Return Codes. The ```api()``` used in the examples on the method pages is the function from the Python example on the signature authentication page.

**Method overview**

| Object | Method | Parameters (in order; bracketed ones may be omitted) | Description | Notes |
| - | - | - | - | - |
| Account | GetAccount | none | Account information | Read-only |
| Docker | GetNodeList | [offset, limit] | Docker list | Read-only |
| Docker | DeleteNode | nid | Delete a docker | Deletes, cannot be undone |
| Exchange | GetExchangeList | isSummary | Exchanges supported by the platform and their settings | Read-only |
| Exchange | GetPlatformList | [offset, limit] | Exchange accounts you added | Read-only |
| Strategy | GetStrategyList | offset, length, strategyType, category, language, kw[, groupId, orderBy] | Strategy list | Read-only |
| Live trading | GetRobotGroupList | none | Live trading groups | Read-only |
| Live trading | GetRobotList | [offset, length, customStatus, appId, kw, groupId, orderBy, strategyId] | Live trading list | Read-only |
| Live trading | GetRobotDetail | robotId | Live trading details | Read-only |
| Live trading | GetRobotLogs | robotId, logMinId, …, summaryLimit[, logExchange, logKeyword, logTypes] | Logs, profit, chart and status bar data | Read-only |
| Live trading | NewRobot | settings | Create and start a live trading bot | Charges fees; the bot trades for real |
| Live trading | RestartRobot | robotId[, settings] | Start (restart) a live trading bot | Charges fees; the bot trades for real |
| Live trading | StopRobot | robotId | Stop a live trading bot | Does not close positions |
| Live trading | CommandRobot | robotId, cmd | Send an interactive command | The strategy may place orders on it |
| Live trading | DeleteRobot | robotId[, removeLog] | Delete a live trading bot | Deletes, cannot be undone |
| Debugging | PluginRun | settings | Run a piece of code on a docker | The code can place real orders |

The API KEY needs permission for the method, see Create ApiKey.

**Passing parameters**

```args``` can be written in two ways:

- Array: positional parameters in the order of the table above, e.g. ```[123, "ok"]```.
- Object: values by parameter name, e.g. ```{"robotId": 123, "cmd": "ok"}```. Names are case-insensitive and underscores are ignored; omitted parameters take their defaults. Recommended for methods with many optional parameters (GetRobotList, GetRobotLogs, GetStrategyList).

**Live trading configuration (settings)**

The ```settings``` parameter of NewRobot, RestartRobot and PluginRun is a JSON object; common fields:

| Field | Description |
| - | - |
| name | Name of the live trading bot. |
| strategy | Strategy ID, see GetStrategyList. RestartRobot cannot change a bot's strategy. |
| args | Strategy parameters, each element ```["name", value]```, e.g. ```[["Interval", 500]]```; ```[]``` if the strategy has none. |
| exchanges | Array of exchange object configurations, one element per exchange object, see below. |
| period | Default K-line period in seconds, e.g. ```60```, ```3600```. |
| node | ID of the docker that runs the bot, see GetNodeList; omitted or ```-1``` means automatic assignment. |
| group | Live trading group ID, see GetRobotGroupList. |
| appid | Custom label; GetRobotList can filter by it. |

An ```exchanges``` element takes one of two forms, which cannot be mixed in one array (the first element decides):

- Reference an exchange account added on the platform: ```{"pid": 123, "pair": "BTC_USDT"}```. ```pid``` is the ```id``` returned by GetPlatformList.
- Pass the exchange configuration directly: ```{"eid": "Binance", "label": "test", "pair": "BTC_USDT", "meta": {"AccessKey": "...", "SecretKey": "..."}}```. ```eid``` is the exchange ID; the field names of ```meta``` are given by the ```meta``` returned by GetExchangeList; ```label``` is the exchange object's label, read in the strategy with ```exchange.GetLabel()```. The platform does not store the keys in ```meta``` but forwards them to the docker, so a bot created this way needs ```settings``` again on every restart.

For a custom-protocol exchange: ```{"eid": "Exchange", "label": "test", "pair": "BTC_USDT", "meta": {"AccessKey": "...", "SecretKey": "...", "Front": "http://127.0.0.1:6666/test"}}```, where ```Front``` is the address of the custom-protocol service.

###### GetAccount

The ```GetAccount``` method is used to retrieve account information for the FMZ Quant Trading Platform account corresponding to the ```API KEY``` in the request.

Parameters:

No parameters

Returns:

```json
{
    "code":0,
    "data":{
        "result":{
            "balance":22944702436,
            "concurrent":0,
            "consumed":211092719653,
            "email":"123@qq.com",
            "openai":false,
            "settings":null,
            "sns":{"wechat":true},
            "uid":"105ea6e51bcc177926a10fdbb7e2a1d6",
            "username":"abc"
        },
        "error":null
    }
}
```

- balance: Account balance in USD, stored as an integer for precision; divide by 1e8 (10 to the power of 8) to get the actual value, 229.44702436 in this example.
- consumed: Total amount spent, same unit and conversion as ```balance```.

###### GetNodeList

The ```GetNodeList``` method returns the dockers available to the platform account of the ```API KEY``` in the request, including your own dockers and the platform's public dockers.

Parameters:

- `offset` (number, optional): Paging offset, default 0.
- `limit` (number, optional): Page size; omitted or less than or equal to 0 returns everything.

Returns:

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

Return value field descriptions (fields with obvious literal meanings are not elaborated):
- all: Total number of dockers (public dockers included).
- nodes: List of detailed information for docker nodes.
  - build: Version number.
  - city: City location.
  - is_owner: true indicates private docker, false indicates public docker.
  - loaded: Load amount, i.e., the number of currently running strategy instances.
  - public: 0 indicates private docker, 1 indicates public docker.
  - region: Geographic location.
  - version: Detailed version information of the docker.
  - wd: Offline alarm switch, 0 indicates not enabled.

One-click deployed dockers contain additional information, with related fields prefixed by ```ecs_``` and ```unit_```, recording information about the one-click deployed docker server (operator name, configuration, status, etc.), billing cycle, price, and other information, which will not be detailed here.

###### DeleteNode

The ```DeleteNode``` method is used to delete a docker node under the FMZ Quant Trading Platform account corresponding to the ```API KEY``` in the request. The docker node ID to be deleted is specified by the ```nid``` parameter.

Parameters:

- `nid` (number, required): The ```nid``` parameter is used to specify the docker ID to be deleted. You can obtain the docker information under the account through the ```GetNodeList``` method.

Returns:

```json
{
    "code":0,
    "data":{
        "result":true,
        "error":null
    }
}
```

- result: Whether the associated docker program was successfully deleted.

###### GetExchangeList

The ```GetExchangeList``` method is used to get the list of exchanges supported by the FMZ quantitative trading platform and their configuration information.

Parameters:

- `isSummary` (bool, required): The ```isSummary``` parameter is used to specify whether the returned data is summary information.

Returns:

When the ```isSummary``` parameter is ```false```, the returned data:

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
                "meta": "[{\"desc\": \"Access Key\", \"qr\":\"apiKey\",\"required\": true, \"type\": \"string\", \"name\": \"AccessKey\", \"label\": \"Access Key\"}, {\"encrypt\": true, \"qr\":\"secretKey\",\"name\": \"SecretKey\", \"required\": true, \"label\": \"Secret Key\", \"type\": \"password\", \"desc\": \"Secret Key\"}]",
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

When the ```isSummary``` parameter is ```true```, the returned data:

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

- meta: Exchange configuration metadata.

###### GetPlatformList

The ```GetPlatformList``` method is used to get the list of configured exchanges under the FMZ Quant Trading Platform account corresponding to the ```API KEY``` in the request.

Parameters:

- `offset` (number, optional): Paging offset, default 0.
- `limit` (number, optional): Page size; omitted or less than or equal to 0 returns everything.

Returns:

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
                "label": "币安",
                "logo": "...",
                "name": "币安现货|Binance",
                "stocks": ["BTC_USDT", "LTC_USDT", "ETH_USDT", "ETC_USDT", "BTC_TUSD", "ETH_TUSD", "BNB_TUSD"],
                "website": "..."
            }, {
                "category": "通用协议|Custom Protocol",
                "date": "2020-11-09 11:23:48",
                "eid": "Exchange",
                "id": 123,
                "label": "XX交易所REST协议",
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

- all: Total number of configured exchange objects.
- platforms: Exchange related information.
  - eid: Exchange identifier on the FMZ Quant Trading Platform, ```eid``` is required in certain configurations and parameters.

###### GetStrategyList

The ```GetStrategyList``` method is used to retrieve platform strategy information.

Parameters:

- `offset` (number, required): Paging offset.
- `length` (number, required): Page size; less than or equal to 0 returns everything.
- `strategyType` (number, required): Scope of the query:
- ```-1```: your own and rented strategies (official strategies included).
- ```0```: your own and rented strategies (official strategies excluded).
- ```-3```: only your own strategies.
- ```-6```: only rented strategies (expired ones included).
- ```-4```: official strategies.
- ```-2```: public and paid strategies in the Strategy Square.
- ```1```: published strategies.
- ```2```: strategies pending review.
- `category` (number, required): Strategy type:
- ```-1```: all.
- ```0```: ordinary strategies.
- ```20```: template libraries.
- ```21```: trading plugins.
- `language` (number, required): Programming language of the strategy:
- ```-1```: all languages.
- ```0```: JavaScript (TypeScript strategies are stored as JavaScript with a ```//@ts-check``` line in the source).
- ```1```: Python.
- ```3```: Blockly.
- ```4```: MyLanguage.
- ```5```: PINE.
- ```6```: Workflow.
- ```7```: Rust.
- `kw` (string, required): Keywords matched against strategy names, separated by spaces; an empty string means no filter. Starting with ```id:``` queries by strategy ID, e.g. ```id:123,456```.
- `groupId` (number, optional): Strategy group: ```-1``` all (default), ```0``` ungrouped, greater than 0 a specific group. Only applies to your own strategies.
- `orderBy` (string, optional): Sort field: ```name```, ```last_modified```, ```date```, optionally followed by ``` asc``` for ascending order (default descending); an empty string keeps the default order.

Returns:

```json
{
    "code": 0,
    "data": {
        "result": {
            "all": 123,
            "strategies": [{
                "category": 9,
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

- all: Total number of strategies matching the filter criteria.
- strategies: Detailed information of the strategies found; ```category``` and ```language``` take the values described in the parameters above.

There is no ```needArgs``` parameter. Passing an extra parameter after ```category```, as older documentation did, shifts all following parameters; pass them in the order above, or by name:

```plaintext
api('GetStrategyList', 0, 10, -3, -1, -1, '')           # first 10 of your own strategies
api('GetStrategyList', strategyType=-3, language=7)     # all of your own Rust strategies
```

###### GetRobotGroupList

The ```GetRobotGroupList``` method is used to get the list of live trading groups under the FMZ Quant Trading Platform account corresponding to the ```API KEY``` in the request.

Parameters:

No parameters

Returns:

```json
{
    "code": 0,
    "data": {
        "result": {
            "items": [{
                "id": 3417,
                "name": "Test"
            }, {
                "id": 3608,
                "name": "Live Trading Demo"
            }]
        },
        "error": null
    }
}
```

- items: Live trading group information.
  - id: Live trading group ID.
  - name: Live trading group name.

The ```items``` field only records newly created groups, the "Default" group is not included in ```items```.

###### GetRobotList

The ```GetRobotList``` method returns the live trading bots of the platform account of the ```API KEY``` in the request. All parameters are optional.

Parameters:

- `offset` (number, optional): Paging offset, default 0.
- `length` (number, optional): Page size; less than or equal to 0 returns everything (default).
- `customStatus` (number, optional): Filter by live trading status code, see Live Trading Status Codes; ```-1``` returns all bots (default), ```-2``` returns all bots sorted by start time.
- `appId` (string, optional): Filter by the bot's custom label (```appid``` in ```settings``` when it was created); an empty string means no filter.
- `kw` (string, optional): Keyword matched against bot names; an empty string means no filter.
- `groupId` (number, optional): Live trading group: ```-1``` all (default), ```0``` ungrouped, greater than 0 a specific group.
- `orderBy` (string, optional): Sort field: ```name```, ```status```, ```node```, ```profit```, ```date```, ```refresh```, ```start_time```, ```strategy_name```, optionally followed by ``` asc``` for ascending order (default descending); an empty string keeps the default order.
- `strategyId` (number, optional): When greater than 0, only bots of this strategy are returned; default 0 (no filter).

Returns:

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
                "name": "Test",
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
                "strategy_name": "Test",
                "strategy_public": 0,
                "uid": "105ed6e511cc977921610fdbb7e2a1d6",
                "wd": 0
            }]
        },
        "error": null
    }
}
```

- all: Total number of bots matching the filters.
- robots: Live trading bot information; ```status``` is the live trading status code.
  - group_id: Live trading bot group ID; if the live trading bot is in the default group, the ```group_id``` field is not included.

Using ```api()``` from the Python example on the signature authentication page:

- ```api('GetRobotList')```: all live trading bots.
- ```api('GetRobotList', 'member2')```: a single string is taken as the label; all bots labeled member2.
- ```api('GetRobotList', 0, 100, -1, 'member2', '')```: positional parameters; up to 100 bots labeled member2, starting at offset 0.
- ```api('GetRobotList', appId='member2', length=100)```: the same by parameter name.

###### GetRobotDetail

The ```GetRobotDetail``` method is used to get detailed information of a live trading bot under the FMZ Quant Trading Platform account corresponding to the ```API KEY``` in the request. The detailed information of the live trading bot to be retrieved is specified by the ```robotId``` parameter.

Parameters:

- `robotId` (number, required): The ```robotId``` parameter is used to specify the ID of the live trading bot for which to retrieve detailed information. The live trading bot information under the account, including the bot ID, can be obtained through the ```GetRobotList``` method.

Returns:

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
                "name": "Test",
                "node_id": 123,
                "pexchanges": {
                    "123": "Futures_OKX"
                },
                "phash": {
                    "123": "ca1aca74b9cf7d8624f2af2dac01e36d"
                },
                "plabels": {
                    "123": "OKX Futures"
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
                "strategy_name": "Test",
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

- charge_time: Next billing time (Unix timestamp in seconds), i.e. the end of the period already paid for.
- charged: Total billed time in seconds.
- consumed: Total amount charged in USD, stored as an integer scaled by 1e8; 5375000000 in the example is 53.75 USD.
- date: Creation date.
- fixed_id: Docker ID assigned during live trading. If auto-assigned, this value is -1.
- is_manager: Whether has permission to manage this live trading bot.
- is_sandbox: Whether it is a simulated trading bot.
- name: Live trading bot name.
- node_id: Docker ID.
- pexchanges: Exchange objects configured for the live trading bot, where 123 is the pid and "Futures_OKX" is the exchange ID (eid).
- plabels: Label information for the exchange objects configured for the live trading bot.
- profit: Live trading bot profit data.
- public: Whether the live trading bot is public.
- refresh: Last active time.
- strategy_exchange_pairs: Configured exchange objects and their trading pair information.
- wd: Whether offline alert is enabled.

Explanation of the ```strategy_exchange_pairs``` attribute, using the following data as an example:

```plaintext
"[60,[44314,42960,15445,14703],[\"BTC_USDT\",\"BTC_USDT\",\"ETH_USDT\",\"ETH_USDT\"]]"
```

The first data ```60``` indicates that the default K-line period set for the live trading bot is 1 minute, i.e., 60 seconds.

```[44314,42960,15445,14703]``` are the ```pid``` values of the exchange objects configured for the live trading bot (arranged in the order they were added).

```[\"BTC_USDT\",\"BTC_USDT\",\"ETH_USDT\",\"ETH_USDT\"]``` are the trading pairs set for the exchange objects configured for the live trading bot (corresponding one-to-one with the pid values in the order they were added).

###### GetRobotLogs

The ```GetRobotLogs``` method is used to get the live trading log information under the FMZ Quant Trading Platform account corresponding to the ```API KEY``` in the request. The live trading ID for which to get log information is specified by the ```robotId``` parameter.

Parameters:

- `robotId` (number, required): The ```robotId``` parameter is used to specify the live trading ID for which to get log information. You can use the ```GetRobotList``` method to get the live trading information under the account, which includes the live trading ID.
- `logMinId` (number, required): The ```logMinId``` parameter is used to specify the minimum ID of log records.
- `logMaxId` (number, required): The ```logMaxId``` parameter is used to specify the maximum ID of log records.
- `logOffset` (number, required): The ```logOffset``` parameter is used to set the offset. Within the range determined by ```logMinId``` and ```logMaxId```, skip the specified number of records according to ```logOffset``` to determine the starting position for data retrieval.
- `logLimit` (number, required): The ```logLimit``` parameter is used to set the number of data records to retrieve starting from the initial position.
- `profitMinId` (number, required): The ```profitMinId``` parameter is used to set the minimum ID of profit logs.
- `profitMaxId` (number, required): The ```profitMaxId``` parameter is used to set the maximum ID of profit logs.
- `profitOffset` (number, required): The ```profitOffset``` parameter is used to set the offset, i.e., skip the specified number of records as the starting position.
- `profitLimit` (number, required): The ```profitLimit``` parameter is used to set the number of data records to retrieve starting from the initial position.
- `chartMinId` (number, required): The ```chartMinId``` parameter is used to set the minimum ID of chart data records.
- `chartMaxId` (number, required): The ```chartMaxId``` parameter is used to set the maximum ID of chart data records.
- `chartOffset` (number, required): The ```chartOffset``` parameter is used to set the offset.
- `chartLimit` (number, required): The ```chartLimit``` parameter is used to set the number of records to retrieve.
- `chartUpdateBaseId` (number, required): The ```chartUpdateBaseId``` parameter is used to set the base ID for querying update records.
- `chartUpdateDate` (number, required): The ```chartUpdateDate``` parameter is used to set the update timestamp of data records, and the system will filter out records greater than this timestamp.
- `summaryLimit` (number, required): The ```summaryLimit``` parameter is used to set the number of bytes of status bar data to query. This parameter is an integer used to query the status bar data of live trading.

Setting it to 0 means not querying status bar information; setting it to a non-zero value indicates the number of bytes of status bar information to query (this interface does not limit the amount of data, you can specify a larger summaryLimit parameter to get all status bar information). The status bar data is stored in the ```summary``` field of the returned data.
- `logExchange` (string, optional): Only logs of this exchange object (by label); an empty string means no filter.
- `logKeyword` (string, optional): Only logs whose content contains this keyword; an empty string means no filter.
- `logTypes` (string, optional): Only logs of these types, as comma-separated log type numbers, e.g. ```"0,1,2"``` for buy, sell and cancel logs; an empty string means all types.

Returns:

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

- logs: Log information; the queried log data entries are stored in the Arr field.
  The first data structure in logs contains log records from the strategy log table in the live trading database.
  The second data structure in logs contains log records from the profit log table in the live trading database.
  The third data structure in logs contains log records from the chart log table in the live trading database.
- summary: Live trading status bar data.

- Strategy log table in database
  The description of the ```Arr``` attribute value in the first element (log data) of the ```logs``` attribute value (array structure) in the returned data is as follows:

  ```plaintext
  "Arr": [
      [3977, 3, "Futures_OKX", "", 0, 0, "Sell(688.9, 2): 20016", 1526954372591, "", ""],
      [3976, 5, "", "", 0, 0, "this_week Position too large, long: 2", 1526954372410, "", ""]
  ],
  ```

  | id | logType | eid | orderId | price | amount | extra | date | contractType | direction |
  | - | - | - | - | - | - | - | - | - | - |
  | 3977 | 3 | "Futures_OKX" | "" | 0 | 0 | "Sell(688.9, 2): 20016" | 1526954372591 | "" | "" |
  | 3976 | 5 | "" | "" | 0 | 0 | "this_week Position too large, long: 2" | 1526954372410 | "" | "" |

  ```extra``` is the additional information for the printed log.

  The log type descriptions corresponding to ```logType``` values are as follows:

  | logType: | 0 | 1 | 2 | 3 | 4 | 5 | 6 |
  | - | - | - | - | - | - | - | - |
  | logType meaning: | BUY | SALE | RETRACT | ERROR | PROFIT | MESSAGE | RESTART |
  | English meaning | Buy order log | Sell order log | Cancel order | Error | Profit | Message | Restart |

- Profit chart log table in database
  The data in this chart log table is consistent with the profit logs in the strategy log table.

  ```plaintext
  "Arr": [
      [202, 2515.44, 1575896700315],
      [201, 1415.44, 1575896341568]
  ]
  ```

  Taking one log data as an example:

  ```plaintext
  [202, 2515.44, 1575896700315]
  ```

  ```202``` is the log ID, ```2515.44``` is the profit value, ```1575896700315``` is the timestamp.
- Chart log table in database

  ```plaintext
  "Arr": [
      [23637, 0, "{\"close\":648,\"high\":650.5,\"low\":647,\"open\":650,\"x\":1575960300000}"],
      [23636, 5, "{\"x\":1575960300000,\"y\":3.0735}"]
  ]
  ```

  Taking one log data as an example:

  ```plaintext
  [23637, 0, "{\"close\":648,\"high\":650.5,\"low\":647,\"open\":650,\"x\":1575960300000}"],
  ```

  ```23637``` is the log ID, ```0``` is the chart data series index, and the final data ```"{\"close\":648,\"high\":650.5,\"low\":647,\"open\":650,\"x\":1575960300000}"``` is the log data, which is the K-line data on the chart.

###### NewRobot

The ```NewRobot``` method creates a live trading bot under the platform account of the ```API KEY``` in the request and starts it; like creating a bot on the website, this charges fees.

Parameters:

- `settings` (JSON object, required): Live trading configuration; for its fields see "Live trading configuration (settings)" in Extended API Interface Details. For example:

```json
{
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
```

Returns:

```json
{
    "code":0,
    "data":{
        "result":591988,
        "error":null
    }
}
```

- result: The ID of the new bot on success; a negative number on failure, with the meaning of the abnormal codes in Live Trading Status Codes (e.g. ```-2``` no docker found, ```-5``` insufficient balance).

When the exchange configuration is passed directly with ```eid```, the platform does not store the keys in ```meta```, so every later ```RestartRobot``` of this bot must pass ```settings``` again.

###### RestartRobot

The ```RestartRobot``` method starts (restarts) a live trading bot of the platform account of the ```API KEY``` in the request; the bot is given by ```robotId```. Starting a bot charges fees.

Parameters:

- `robotId` (number, required): Live trading bot ID, see the ```GetRobotList``` method.
- `settings` (JSON object, optional): Live trading configuration; for its fields see "Live trading configuration (settings)" in Extended API Interface Details. When given, the bot's configuration (name, parameters, exchanges, K-line period, docker, group) is updated with it before starting; the strategy cannot be changed.

Returns:

```json
{
    "code":0,
    "data":{
        "result":1,
        "error":null
    }
}
```

- result: Live trading status code, 1 indicates running.

A bot created on the website with exchange accounts referenced by ```pid``` can be started with ```robotId``` alone, using its current configuration. A bot whose exchanges were passed directly with ```eid``` (usually created through the extended API) has no stored keys, so ```settings``` must be passed on every restart.

###### StopRobot

The ```StopRobot``` method is used to stop a live trading bot under the FMZ Quant Trading Platform account corresponding to the ```API KEY``` in the request. The bot Id to be stopped is specified by the ```robotId``` parameter.

Parameters:

- `robotId` (number, required): The ```robotId``` parameter is used to specify the bot Id to be stopped. You can obtain the bot information under the account through the ```GetRobotList``` method, which includes the bot Id.

Returns:

```json
{
    "code":0,
    "data":{
        "result":2,
        "error":null
    }
}
```

- result: Bot status code, 2 indicates stopping.

###### CommandRobot

The ```CommandRobot``` method is used to send interactive commands to a live trading bot under the FMZ Quant Trading Platform account corresponding to the ```API KEY``` in the request. The bot Id that receives the interactive command is specified by the ```robotId``` parameter, and the interactive command is captured and returned by the ```GetCommand()``` function called in the strategy.

Parameters:

- `robotId` (number, required): The ```robotId``` parameter is used to specify the bot Id that receives the interactive command. You can use the ```GetRobotList``` method to get information about bots under the account, which includes the bot Id.
- `cmd` (string, required): The interactive command sent to the bot; the strategy reads it with ```GetCommand()```, see `GetCommand`.

Returns:

```json
{
    "code":0,
    "data":{
        "result":true,
        "error":null
    }
}
```

- result: Whether the interactive command was sent successfully. When sending a command to a bot that is not running, the result in the returned data will be false.

Example of bot strategy (assuming this strategy bot is running with bot Id 123):
```js
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

Calling ```api("CommandRobot", 123, "test command")``` with ```api()``` from the Python example on the signature authentication page, the bot with Id 123 will receive the interactive command: ```test command```, and output it through the Log function.

###### DeleteRobot

The ```DeleteRobot``` method deletes a live trading bot of the platform account of the ```API KEY``` in the request; the bot is given by ```robotId```. A running bot must be stopped first. Deletion cannot be undone.

Parameters:

- `robotId` (number, required): ID of the bot to delete, see the ```GetRobotList``` method.
- `removeLog` (bool, optional): Whether to delete the bot's log data on the docker as well; default ```true```.

Returns:

```json
{
    "code":0,
    "data":{
        "result":0,
        "error":null
    }
}
```

- result: Result of the deletion.
  - 0: deleted.
  - -1: not deleted: the bot does not exist, or it is still running, starting or stopping.
  - -2: the bot was deleted, but its docker could not be reached, so the log data was not removed; delete it manually under ```logs/storage/<bot ID>/``` in the docker's directory (e.g. ```123.db3```).

###### PluginRun

The ```PluginRun``` method runs a piece of JavaScript code on a docker and returns the result. It uses the same execution mechanism as the "Debug Tool" among the development tools and trading terminal plugins (see Integrations → Trading Terminal → Plugin Principle and Development). No live trading bot is created and nothing is charged; one run lasts at most 5 minutes.

Parameters:

- `settings` (JSON object, required): Run configuration, for example:

```json
{
    "source": "function main() {Log(\"Hello FMZ\")}",
    "node": 123,
    "period": 60,
    "exchanges": [{"pid": 123, "pair": "SOL_USDT"}]
}
```

- source: the code to run. The entry point is ```main()```, whose return value is the result.
- strategy: when ```source``` is not given, run the account's strategy with this ID (e.g. a trading plugin).
- node: ID of the docker that runs the code; omitted or ```-1``` selects one automatically.
- exchanges: exchange object configuration, same as "Live trading configuration (settings)" in Extended API Interface Details.

Returns:

```json
{
    "code": 0,
    "data": {
        "result": "{\"logs\":[{\"PlatformId\":\"\",\"OrderId\":\"0\",\"LogType\":5,\"Price\":0,\"Amount\":0,\"Extra\":\"Hello FMZ\",\"Currency\":\"\",\"Instrument\":\"\",\"Direction\":\"\",\"Time\":1732267473108}],\"result\":\"\"}",
        "error": null
    }
}
```

- result: The result as a JSON string: ```logs``` holds the logs written with ```Log()```, ```result``` the JSON text of the value returned by ```main()```.

```exchanges``` can also pass the exchange configuration directly instead of referencing an exchange account on the platform, for example:

```plaintext
{"eid": "Binance", "pair": "ETH_BTC", "meta": {"AccessKey": "...", "SecretKey": "..."}}
```

The field names of ```meta``` are given by the ```meta``` returned by ```GetExchangeList```. Usually only one exchange object is set in ```exchanges``` (the debug tool page also supports only one); setting two causes no error, but accessing the second exchange object in the code does.

#### Extended API Interface Return Codes

The extended API returns this structure:

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
| Invalid arguments: ```args``` is not valid JSON, or the call failed | 5 |
| Internal error | 6 |
| The request's source IP is not in this API KEY's IP whitelist | 7 |

```code``` 0 only means the request was accepted. The method's result is in ```data.result```; when the method fails, ```data.error``` holds the error message (```null``` on success). For example, with the wrong number of arguments:

```json
{
    "code": 0,
    "data": {
        "result": null,
        "error": "Params number mismatch for StopRobot: expected 1, got 0"
    }
}
```

#### Live Trading Status Codes

The ```status``` field in the data returned by ```GetRobotList```, ```GetRobotDetail```, and ```GetRobotLogs``` interfaces represents: Live Trading Status Code.

- Normal Start
  | Status | Code |
  | - | - |
  | Idle | 0 |
  | Running | 1 |
  | Stopping | 2 |
  | Exited | 3 |
  | Stopped | 4 |
  | Strategy Error | 5 |
- Exception
  | Status | Code |
  | - | - |
  | Strategy expired, please contact author to repurchase | -1 |
  | Docker not found | -2 |
  | Strategy compilation error | -3 |
  | Live trading already running | -4 |
  | Insufficient balance | -5 |
  | Strategy concurrency limit exceeded | -6 |

### Trading Terminal

The platform provides a modular, customizable [Trading Terminal](https://www.fmz.com/m/trade) page: add market data, trading and other modules freely, drag and resize them, change the exchange and trading pair a module is bound to, and add several modules of the same kind, which makes manual and semi-automated trading convenient.

The trading terminal also supports trading plugins: code you write yourself that runs as a module on a selected docker to assist manual trading.

#### Plugin Principle and Development

**How it works**

A trading plugin is a short piece of code executed on a docker: when you click "Execute" on the trading terminal page, the platform sends the plugin code and the exchange account selected in the module to the selected docker, runs it, and shows the return value in the module. The following entry points share the same execution mechanism:

| Entry point | Code that runs | Notes |
| - | - | - |
| Trading terminal plugin | A strategy of type "Trading Plugin" in your strategy library | Added and executed on the trading terminal page |
| Debug Tool (development tools) | JavaScript code written on the page | For testing API calls |
| Extended API PluginRun | ```source``` in the request, or an existing strategy of the account | For programs |
| MCP ```plugin_*``` tools | Built-in functions for market data, orders and so on | For AI assistants, authorized by the ```trade``` permission, see Integrations → AI Integration |

No live trading bot is created and nothing is charged; one run lasts at most 5 minutes and is interrupted on timeout. It suits simple tasks that assist manual trading, such as iceberg orders, placing or cancelling orders in bulk, or calculations; logic that has to run for a long time should be a live trading bot.

**Writing a plugin**

Create a strategy and set its type to "Trading Plugin" on the new-strategy page. Trading plugins, the debugging tool and ```PluginRun``` support JavaScript only.

The plugin's entry point is ```main()```, and its return value is the result: a returned table or chart object is shown as a table or chart in the module (see Integrations → Trading Terminal → Plugin Examples). Logs written with ```Log()``` are not shown in the module.

**Using a plugin**

- Add: open the module menu on the trading terminal page; the trading plugins in your strategy library are listed there. Choose one to add it.
- Execute: click "Execute" in the plugin module to run it.

**Data directory**

When plugins and the debug tool run on a docker, their working directory is ```logs/storage/p<number>/``` under the docker's running directory (one directory starting with ```p``` per platform account, created on the first run). If an exchange account used by the trading terminal configures its key as a key file path (```file:///xxx.txt```), put the key file in this directory.

#### Plugin Examples

A plugin runs code for a limited time to do simple jobs such as iceberg orders, placing and cancelling orders, or calculations. It returns its result with ```return```; a returned table or chart object is displayed as a table or chart. Two examples follow; more can be found in the **Strategy Square**, e.g. buying or selling in small slices.

**Order book snapshot**

Show the top 15 levels of the current order book as a table:

```js
// Return an order book snapshot
function main() {
    var tbl = {
        type: 'table',
        title: 'Depth snapshot @ ' + _D(),
        cols: ['#', 'Amount', 'Ask', 'Bid', 'Amount'],
        rows: []
    }
    var d = exchange.GetDepth()
    var n = Math.min(d.Asks.length, d.Bids.length, 15)
    for (var i = 0; i < n; i++) {
        tbl.rows.push([i, d.Asks[i].Amount, d.Asks[i].Price + '#ff0000', d.Bids[i].Price + '#0000ff', d.Bids[i].Amount])
    }
    return tbl
}
```

**Calendar spread chart**

On a futures exchange object, take 5-minute K-lines of the quarterly and the weekly contract and chart the difference of their closes:

```js
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

    var n = Math.min(recordsA.length, recordsB.length)
    for (var i = 0; i < n; i++) {
        var a = recordsA[recordsA.length - n + i]
        var b = recordsB[recordsB.length - n + i]
        chart.series[0].data.push([a.Time, a.Close - b.Close])
    }
    return chart
}
```
