# FMZ platform user guide

Generated from https://www.fmz.com/user-guide: how the platform works (nodes, robots, strategies, templates, backtesting, extended API, MCP), as written for people; agents use it for concepts and limits.

## Welcome to FMZ Quant Trading Platform

FMZ Quant Trading Platform is the most professional quantitative community in the field of quantitative trading. Here, you can learn, write, share, and sell quantitative trading and algorithmic trading strategies; conduct online backtesting and paper trading; run, publish, and observe live trading strategies. FMZ Quant Trading Platform supports almost all mainstream cryptocurrency exchanges.

If you encounter any issues while learning and using FMZ Quant Trading Platform, you can post questions and discussions on the forum at any time, submit tickets on the platform, or @administrators in the [Telegram](https://t.me/fmzquant_cn) community. Questions are usually answered quickly. The platform supports ChatGPT-assisted development. FMZ Quant Trading Platform has integrated **ChatGPT** as an auxiliary development tool. You can click "ChatGPT" in the shortcut bar of the "Dashboard" to jump to the [ChatGPT Assistant Tool Page](https://www.fmz.com/m/chat).

On FMZ Quant Trading Platform, you can start your quantitative trading journey by registering and logging in. After logging in, visit the [main page](https://www.fmz.com/m), where you will see the following:
![Dashboard Overview](https://www.fmz.com/upload/asset/2e4e636a6fe51c8f620e8.png)

- Left navigation bar: Contains the main function navigation options for the user console.
- Top navigation bar: Provides navigation options for platform public resources.
- Page center: Displays account settings, debugging tools, analysis tools, development documentation, platform function shortcuts, and other content.

Main functions of the user console:
- [Dashboard](https://www.fmz.com/m/dashboard)
  Navigate to the "Dashboard" page. Running quantitative trading programs (i.e., live trading) on FMZ Quant Trading Platform requires three conditions: 1. Deploy an available docker. 2. Have an available strategy. 3. Configure exchange accounts for strategy program operations.
- [Live Trading](https://www.fmz.com/m/robots)
  Navigate to the "Live Trading" page. Live trading refers to instances of quantitative trading strategy programs. The live trading page is mainly used to manage, create, and control strategy live trading.
- [Strategy Library](https://www.fmz.com/m/strategies)
  Navigate to the "Strategy Library" page. The strategy library can categorize, save, manage, and write strategies in various programming languages.
- [Dockers](https://www.fmz.com/m/nodes)
  Navigate to the "Dockers" page. The dockers page can manage and deploy docker programs associated with the current account.
- [Exchanges](https://www.fmz.com/m/platforms)
  Navigate to the "Exchanges" page. The exchanges page can manage and configure exchange accounts needed for quantitative trading.

Platform public resources:
- [Strategies](https://www.fmz.com/square)
  In the strategy square, you can find public or rental strategies written in various programming languages, suitable for learning and reference.
- [Live Observation](https://www.fmz.com/live)
  The live observation page displays users' public strategy live trading.
- [Library](https://www.fmz.com/digest)
  The platform library stores original articles and other materials from the platform, facilitating your introductory learning.
- [Community](https://www.fmz.com/bbs)
  The community forum provides you with a platform for communication and discussion in the field of quantitative trading.
- [Crowdsourcing](https://www.fmz.com/markets)
  The crowdsourcing section builds an efficient communication channel for strategy designers and demanders.
- [Public Courses](https://www.fmz.com/class)
  The public courses page provides video tutorials for the platform.
- [API Documentation](https://www.fmz.com/api)
  The API documentation page provides technical documentation support for writing and designing strategies.

## Programming Languages

**What programming languages can I use to write my strategies on the FMZ Quant trading platform?**

  ![Supported Programming Languages](https://www.fmz.com/upload/asset/2e52c7501f57044f7f0ef.png)

  The FMZ Quant trading platform supports writing and designing trading strategies using ```JavaScript```, ```TypeScript```, ```Python```, ```Rust```, ```C++```, [```PINE```](https://www.fmz.com/bbs-topic/9315), [```My Language```](https://www.fmz.com/bbs-topic/2569), ```Blockly``` visual programming, and the ```Workflow``` workflow tool.

### JavaScript

Supports JavaScript language with the following integrated JavaScript libraries:
- http://mathjs.org/
- http://mikemcl.github.io/decimal.js/
- http://underscorejs.org/
- http://ta-lib.org/

Program exceptions and API business errors
In ```JavaScript``` language strategies, when program exceptions or API business errors occur, the error log will display the specific line number where the error occurred in the strategy code, facilitating strategy debugging and bug tracking.

Supports ```JavaScript``` asynchronous programming features:
- setTimeout / clearTimeout
  ```js
  function main() {
      let symbol = "ETH_USDT"
      let delay = 10
      let depth = exchange.GetDepth(symbol)
      let callback = function(e, id, msg) {
          Log(msg + ", canceling order.")
          e.CancelOrder(id)
      }

      let ordersLen = 3
      let arrTimerId = []
      for (let i = 1 ; i <= ordersLen ; i++) {
          let orderId = exchange.CreateOrder(symbol, "buy", depth.Bids[i * 3].Price, i * 0.1)
          let timerId = setTimeout(callback, delay * 1000, exchange, orderId, `Delayed ${delay} seconds`)
          Log("i:", i, ", timerId:", timerId)
          arrTimerId.push(timerId)
      }

      // clearTimeout
      let clearTimeoutIdx = 1
      Log("clearTimeoutIdx:", clearTimeoutIdx, `, arrTimerId[clearTimeoutIdx]:`, arrTimerId[clearTimeoutIdx])
      clearTimeout(arrTimerId[clearTimeoutIdx])

      Sleep(60 * 1000)
  }
  ```
- fetch
  The ```fetch``` function is an asynchronous version overload of the ```HttpQuery``` function.

  Using the ```await``` keyword to handle asynchronous operations with synchronous syntax:
  ```js
  function main() {
      let url = "https://www.okx.com/api/v5/market/books?instId=BTC-USDT"
      const promiseBooks = new Promise(async function(resolve, reject) {
          Log("Start execution")
          let data = await fetch(url)
          Log("data.ok:", data.ok, ", data.text():", data.text())
          if (data.ok) {
              Log("Successfully retrieved data:", data)
              return resolve(data.text())
          } else {
              return reject(new Error("data invalid"))
          }
      })

      promiseBooks.then(function(ret) {
          Log("ret:", ret)
      }).catch(function(err) {
          Log("err.name:", err.name, "err.stack:", err.stack, "err.message:", err.message)
      })
  }
  ```
- Using ```Promise.all``` to execute multiple asynchronous network requests concurrently:
  ```js
  async function main() {
      // let symbols = ["BTC-USDT", "ETH-USDT", "LTC-USDT"]                                   // Request waiting time: 99ms
      let symbols = ["BTC-USDT", "ETH-USDT", "LTC-USDT", "SOL-USDT", "BNB-USDT", "ADA-USDT"]  // Request waiting time: 99ms
      let arr = []

      let beginTs1 = new Date().getTime()
      for (let symbol of symbols) {
          let url = `https://www.okx.com/api/v5/market/books?instId=${symbol}`
          arr.push(fetch(url).then(function(resp) {
              if (resp.ok) {
                  return {"symbol": symbol, "json": resp.json()}
              } else {
                  throw "req failed"
              }
          }))
      }
      let endTs1 = new Date().getTime()

      let beginTs2 = new Date().getTime()
      const ret = await Promise.all(arr)
      for (let data of ret) {
          Log(data)
      }
      let endTs2 = new Date().getTime()

      Log("Request creation time:", endTs1 - beginTs1, "ms")
      Log("Request waiting time:", endTs2 - beginTs2, "ms")

      LogStatus(_D(), ret)
  }
  ```
- Using ```Promise.race``` to get the first ```resolved``` or ```rejected``` result from multiple asynchronous requests:
  ```js
  async function getTicker(e) {
      return Promise.resolve().then(function() {
          /* Test
          if (e.GetName() == "Huobi" || e.GetName() == "Binance") {
              Sleep(1000)
          }
          */
          let ret = e.GetTicker("BTC_USDT")
          return {"name": e.GetName(), "ret": ret}
      })
  }

  async function main() {
      Log("begin")
      let arrPromise = []
      for (let e of exchanges) {
          arrPromise.push(getTicker(e))
      }

      let ret = await Promise.race(arrPromise)
      Log(ret)
  }
  ```
- Using ```setTimeout()``` function in ```threading.Thread```:
  ```js
  function test() {
      Log("Test function started")                           // step 3. Test function started
      let timerId1 = setTimeout(function() {
          Log("Timeout callback executed after 5 seconds")   // step 5. Timeout callback executed after 5 seconds
      }, 5000)
      Log("Test function completed")                         // step 4. Test function completed
  }

  function main() {
      Log("Main function started")                           // step 1. Main function started
      let t1 = threading.Thread(test)
      Log("Worker thread created successfully")              // step 2. Worker thread created successfully
      t1.join()
      Log("Main function completed")                         // step 6. Main function completed
  }
  ```
- Example of asynchronous processing for multi-threaded concurrent ```ticker``` data retrieval:
  Since ```exchange.GetTicker()``` is a synchronous blocking operation, even when wrapped in a Promise, the internal execution is still synchronous; JavaScript is single-threaded, and synchronous operations will block the event loop; callback functions in the microtask queue are still executed serially.
  ```js
  async function getTicker(symbol) {
      Log("getTicker symbol:", symbol)
      return Promise.resolve().then(function() {
          // Note the difference from fetch request data
          let ret = exchange.GetTicker(symbol)
          Log(ret)
          return ret
      })
  }

  async function main() {
      let symbols = ["BTC_USDT", "ETH_USDT", "SOL_USDT"]
      let t1 = threading.Thread(async function(symbols, func) {
          let arrPromise = []
          for (let symbol of symbols) {
              arrPromise.push(func(symbol))
          }
          let ret = await Promise.all(arrPromise)
          Log("ret:", ret)
      }, symbols, getTicker)

      t1.join()
  }
  ```

### TypeScript

TypeScript language is supported. When creating a strategy, still set it as a JavaScript strategy, then write ```// @ts-check``` at the beginning of the strategy code or click the "TypeScript" button in the upper right corner of the strategy editing area to switch to TypeScript. The platform will automatically recognize the code as TypeScript and provide corresponding compilation and type checking support:

- Type Safety: TypeScript's static type checking helps you discover potential errors while writing code, improving code quality.

- Code Auto-completion: TypeScript's type system enables you to find required properties and methods faster when writing code, improving development efficiency.

- Clearer Code Structure: Using TypeScript, you can better organize and maintain code, making it easy to read and understand.

- Powerful Object-Oriented Programming Features: TypeScript provides powerful object-oriented programming features such as interfaces, classes, and generics, helping you write more robust and reusable strategy code.

### Python

- Setting the Python interpreter for Python strategy programs
  For strategies written in Python, during backtesting or live trading, if the host system has both Python2 and Python3 installed, you can set the Python version to launch at runtime in the first line of the strategy. For example: ```#!python3```, ```#!python2```, the system will automatically find the corresponding interpreter. You can also specify an absolute path, for example: ```#!/usr/bin/python3```.
- Security of Python-based strategies
  Strategies developed on the FMZ Quant Trading Platform are only visible to the holder of the FMZ Quant Trading Platform account. Additionally, complete localization of strategy code can be achieved on the FMZ Quant Trading Platform, such as packaging the strategy into a **Python library** and loading it in the strategy code, thus achieving strategy code localization.
  Python code security:
  Since Python is an open-source and easily decompilable language, if the strategy is not for personal use but for rental, and you are concerned about strategy leakage, you can run the strategy on your own deployed host and rent it out in the form of sub-account or fully managed management.

  Python strategy code encryption:
  By default, Python strategy code is not encrypted when used by the author themselves, but encrypted when rented to others. By writing the following code at the beginning of the Python strategy, you can specify whether to encrypt the strategy code when running for personal use or rental. Python versions that support strategy code encryption are: Python 2.7, Python 3.5, Python 3.6.

  - Encrypt strategy code both when the strategy author runs it themselves and when providing it to others via registration code:
    Use code ```#!python``` to specify the Python interpreter version, then use comma ```,``` as separator, and input the encryption command ```encrypt```. If you don't specify the Python version, you can directly add ```#!encrypt```.
    ```python
    #!python,encrypt
    ```
    or
    ```python
    #!encrypt
    ```
  - Do not encrypt strategy code when the strategy author runs it themselves or provides it to others via registration code:
    ```python
    #!python,not encrypted
    ```
    or
    ```python
    #!not encrypted
    ```

  To check if Python strategy code encryption is effective, use code ```os.getenv('__FMZ_ENV__')```, which returns the string ```"encrypt"``` to indicate it's effective. Only valid in live trading, backtesting will not encrypt Python strategy code.
  ```python
  #!encrypt
  def main():
      ret = os.getenv('__FMZ_ENV__')
      # Printing variable ret as string encrypt or ret == "encrypt" being true means encryption is effective
      Log(ret, ret == "encrypt")
  ```
- Python custom module import functionality
  The FMZ platform supports importing custom modules in Python strategies, enabling modular development and code reuse.

  For example, if we need to design a module: ```mymath```, save ```mymath.py``` as a separate file.

  ```python
  # mymath.py - save as a separate file
  """
  Simple math utility module
  """

  def add(a, b):
      """Addition"""
      return a + b
  ```

  Deploy the module file by placing ```mymath.py``` in the specified location under the host program directory (the folder name in the storage directory is the live trading Id, using live trading Id ```123456``` as an example):

  > Host program directory/logs/storage/123456/mymath.py

  Finally, directly import the ```mymath``` module in the Python strategy on the FMZ platform.

  ```python
  import mymath

  def main():
      Log("mymath.add(1, 2):", mymath.add(1, 2))
  ```

  The strategy bound to the live trading instance (strategy instance) with Id ```123456``` can then call methods from the ```mymath``` module.

### Rust

The platform supports writing strategies using the ```Rust``` programming language. Rust strategies run on a compile-first, then-execute basis: during backtesting, the strategy code is compiled by the platform server and runs in the backtesting system on the browser side; in live trading, Rust strategies run on the docker host after passing compilation.

Leveraging Rust's ownership model and static type system, you can write trading strategies that are both memory-safe and high-performance on the FMZ Quant trading platform.

- Automatic injection of platform APIs
  The strategy code only needs a single ```fn main()``` entry function. All platform APIs (```exchange```, ```exchanges```, ```TA```, ```Log!```/```LogStatus!```, ```_G!```/```_C!```, etc.) are automatically injected via the prelude and can be called directly without any ```use```/```mod``` declarations. API calls that may fail return a ```Result<T>``` type, which can be combined with the ```_C!``` macro for automatic retries.
  ```rust
  fn main() {
      // GetTicker returns Result<Ticker>; use the _C! macro to retry until the call succeeds
      let ticker = _C!(exchange.GetTicker(None));
      Log!("Last:", ticker.Last);
  }
  ```
- Strategy parameters injected as global constants
  Strategy parameters configured in the interface are injected into the strategy as global constants, whose Rust types are determined by the actual value of the parameter (numbers map to ```f64```, booleans to ```bool```, strings/passwords to ```&str```, etc.), and can be referenced directly by parameter name; you can also use the ```params()``` function to obtain the parameter set as JSON text and parse it yourself.
- Third-party crate support
  The strategy source is the only code file (there is no separate Cargo.toml). You can declare dependencies at the top of the source using cargo-script-style frontmatter, which is automatically merged into Cargo.toml at build time:
  ```rust
  ---
  [dependencies]
  serde_json = "1"
  ---
  fn main() {
      let v: serde_json::Value = serde_json::from_str(params()).unwrap();
      Log!("Parameters:", v.to_string());
  }
  ```
  Note: the compilation sandbox does not provide system OpenSSL, so for crates that require TLS (such as HTTP/WebSocket clients), please choose the pure-Rust ```rustls``` implementation (for example, enable the ```rustls-tls-webpki-roots``` feature for ```tokio-tungstenite```) and avoid depending on ```native-tls```/```openssl-sys```; for WebSocket connections, it is recommended to prefer the built-in ```Dial()``` function, which requires no third-party crate.
- Editor support
  The strategy editor integrates ```rust-analyzer``` for Rust strategies, providing code completion and real-time diagnostics.

### C++

The platform supports C++ programming language, compatible with ```C++ 11``` standard. C++ strategies need to be pre-compiled before execution. In the backtesting system, C++ strategies run on dedicated C++ backtesting servers; in live trading environments, C++ strategies run on the docker after compilation.

Leveraging the C++ programming language and ```C++ 11``` standard, you can develop high-performance trading strategies on the FMZ Quant Trading Platform. Using modern C++ features, you can build flexible and scalable trading algorithms to implement automated trading.

The following C++ libraries are integrated:

- https://nlohmann.github.io/json/

### MyLanguage

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

### PINE Language

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

### Blockly Visual Programming

The platform supports Blockly visual programming. With the Blockly editor, users can express code concepts such as variables, logical expressions, and loops by connecting graphical blocks (similar to building blocks). This approach allows the programming process to focus less on tedious syntax details and instead operate directly according to programming principles. Through the arrangement and combination of graphical blocks, users can easily understand programming logic and implement creative ideas, making it ideal for cultivating interest in strategy design and quickly getting started with programmatic and quantitative trading.

  - [Building Trading Strategies with Visual Modules - Introduction](https://www.fmz.com/digest-topic/4016)

  - [Building Trading Strategies with Visual Modules - Advanced](https://www.fmz.com/digest-topic/4046)

  - [Building Trading Strategies with Visual Modules - In-depth](https://www.fmz.com/digest-topic/4086)

  - [Building Trading Strategies with Visual Modules - Simplified](https://www.fmz.com/digest-topic/4107)

### Workflow

The platform supports writing strategies using the Workflow approach. Workflow is a visual strategy design method that builds trading logic through node connections and configurations, enabling strategy implementation without writing code.

**Workflow Features**:
- Visual drag-and-drop design, WYSIWYG
- Rich preset functional nodes (data retrieval, indicator calculation, conditional judgment, trade execution, etc.)
- Lower programming barrier, suitable for rapid strategy building and validation
- Supports backtesting functionality with visual node execution status viewing

**Learning Resources**:
- [Workflow Video Tutorial Series](https://www.fmz.com/class/workflow)

## Key Security

Sensitive data such as account information and encrypted strings in strategy parameters configured on the FMZ Quant Trading Platform are encrypted on the browser side. All information stored on the FMZ Quant Trading Platform is encrypted (not plaintext data). Only the user's private devices can decrypt and use it, greatly improving the security of sensitive data. If other sensitive information is included in strategy code, parameter settings, strategy descriptions, etc., please do not disclose or sell the strategy.

- The platform supports local configuration of exchange account information, keys and other sensitive information
  On the platform's exchange configuration page, all masked encrypted text box controls support loading local files from the docker's location via file path. Below is a detailed example using the exchange's ```RSA KEY``` authentication method to explain how to configure sensitive information locally on the device where the docker program is located.
  1. Create RSA public and private keys. For example, create public and private keys in PKCS#8 format. There are many tools available for creation, such as: openssl.
  2. Create an ```RSA KEY``` on the exchange, uploading the public key created in step 1.
  3. Save the private key created in step 1 as a txt file in the docker directory ```../logs/storage/xxx```, where xxx is the live trading Id; it can also be saved in other paths within the docker program's directory.
  4. When configuring the exchange on the FMZ Quant Platform, fill in the ```RSA KEY``` created on the exchange in the ```Access Key``` edit box.
  5. When configuring the exchange on the FMZ Quant Platform, fill in the path of the txt file placed in the docker directory from step 3 in the ```Secret Key``` edit box. For example, if the file name is: ```rsaKey.txt```, then fill in: ```file:///rsaKey.txt```. When running live trading and referencing this exchange (object), the docker will automatically load the file content from the directory ```../logs/storage/xxx/rsaKey.txt``` as the exchange object's configuration information, such as the ```RSA``` private key in this example.

  This way, storing the private key locally is more secure. For detailed process, please refer to the [video tutorial](https://www.bilibili.com/video/BV1UM41147Jj/)
- Changing the FMZ Quant Trading Platform account password will invalidate exchange configurations
  If you change the FMZ Quant Trading Platform account password, all exchange configurations will become invalid and need to be handled according to the following steps:
  1. Reconfigure exchange account related keys, passwords and other information on the ["Exchange" management page](https://www.fmz.com/m/platforms).
  2. Stop all dockers, and redeploy and run the dockers using the modified FMZ Quant Trading Platform account password.

## Live Trading

On the FMZ Quant Trading Platform, the concept of "Live Trading" is distinguished from "Backtesting". It refers to creating a real strategy program instance that interacts with exchanges (obtaining market data, querying positions, placing and canceling orders, etc.). Strategy program instances that interact with the exchange's production environment are called live trading, and strategy program instances that interact with the exchange's simulation environment (many exchanges provide test environments) are also called live trading.

Creating a [live trading instance](https://www.fmz.com/m/add-robot) on the FMZ Quant Trading Platform requires meeting three conditions:

**Conditions for Creating Live Trading**
- An available strategy
  You can create a strategy by clicking the "New Strategy" button on the platform's [Strategy Library page](https://www.fmz.com/m/strategies). After writing and designing the strategy and saving it, the strategy will be saved in the strategy library. When creating live trading, you can select strategies from the strategy library in the "Running Strategy" dropdown box under the "Live Trading Configuration" section on the [Live Trading Creation page](https://www.fmz.com/m/add-robot).
- At least one available docker deployed
  You can deploy a docker by clicking the "Deploy Docker" button on the platform's [Docker page](https://www.fmz.com/m/nodes). After successful docker deployment, when creating live trading, you can select the deployed docker in the "Docker Host" dropdown box under the "Live Trading Configuration" section on the [Live Trading Creation page](https://www.fmz.com/m/add-robot).
- At least one configured exchange
  You can add an exchange by clicking the "Add Exchange" button on the platform's [Exchange page](https://www.fmz.com/m/platforms) and configure the exchange account information. After the exchange configuration is complete, when creating live trading, you can select the configured exchange in the "Trading Platform" dropdown box under the "Trading Configuration" section on the [Live Trading Creation page](https://www.fmz.com/m/add-robot).

Finally, click the "Create Live Trading" button on the live trading creation page to create and run a quantitative trading strategy program instance (i.e., live trading on the FMZ Quant Trading Platform).

**Live Trading Grouping**
You can manage created live trading instances by grouping them, with support for custom group names.

**Live Trading Observation**
Live trading can be displayed publicly, or you can create private observation links to send to specific groups for display.

**Live Trading Billing**
Live trading is billed hourly at 0.05 USD per live trading instance per hour, with partial hours billed as full hours. Creating a new live trading instance will immediately start billing. "Stopping"/"Restarting" live trading will not result in duplicate billing.

You can check all billing "Transaction Details" on the [Recharge page](https://www.fmz.com/m/billing).

Important Notice: When recharging with ```USDT```, please pay attention to:
- 1. Whether the transfer network is correct (e.g., currently supports: TRC20, ERC20, BSC).
- 2. Whether the recharge asset selection is correct (e.g., USDT).
- 3. Whether the recharge address is consistent.

**Live Trading Monitoring**
In the live trading list on the [Live Trading Management page](https://www.fmz.com/m/robots), you can click the "Monitor" button in the **Actions column** on the right side of running live trading instances to enable live trading monitoring. After enabling monitoring, if the live trading exits without manual operation, the email address currently bound to the FMZ Quant Trading Platform will receive a notification message.

**Live Trading Database**
Taking live trading ID ```123456``` as an example, its corresponding database file is located in the path under the docker directory to which the live trading belongs: ```/logs/storage/123456/123456.db3```, where the database file name is ```123456.db3```.
The database contains the following tables:
- chart: Records chart data.
- kvdb: Records data persistently saved by the ```_G()``` function.
- log: Records live trading log data.
- profit: Records live trading profit data.

## Strategy Library

The [Strategy Library](https://www.fmz.com/m/strategies) page stores all strategies under the current account. Strategies can be designed using various programming languages and methods.

**Strategy Grouping**
Strategies support group management functionality, allowing custom group names.

**Strategy Publishing and Leasing**
You can generate a strategy's "Copy Code" for publishing strategies.
You can generate a strategy's "Registration Code" for leasing strategies.

**Strategy Export and Import**
On the Strategy Library page, clicking a strategy name will redirect to that strategy's editing page, which provides "Import" and "Export" functions.

A complete strategy includes:
- Strategy source code
- Strategy description
- Strategy notes
- Strategy documentation
- Strategy parameter configuration
- Strategy interaction configuration

Therefore, when exporting a strategy, the exported file is in XML format, containing all the above information. After creating a new blank strategy, importing this XML file can completely restore the strategy. Strategy migration cannot rely solely on copying source code; you must import the complete strategy file (or manually add strategy parameter design, interaction design, and other configurations).

## Docker

The Docker software of the FMZ Quant Trading Platform is the core component of the entire quantitative trading system. [Docker](https://www.fmz.com/m/add-node) can be understood as the executor of your trading strategy, responsible for complex data requests, data reception, network connections, log transmission, and other tasks. Live trading strategy programs run on the Docker software, not on the FMZ Quant Trading Platform website. The Docker runs on your server, so even if the **FMZ Quant Trading Platform** website experiences network failures, it will not affect your Docker's operation. Docker can run on systems such as ```Linux```, ```Windows```, ```Mac OS```, ```Android```, ```Raspberry Pi ARM Linux```, etc.

The live trading logs managed by the Docker are all saved in the ```./logs/storage``` directory where the Docker program is located. The files are ```Sqlite``` database files with the ```db3``` extension. You can use ```Sqlite``` management software to edit them directly. For these live trading database files with the ```db3``` extension, the filename is the live trading ```Id```.

The Docker program supports automatic detection and use of system proxy settings. When proxy software (such as ```Clash X```, ```V2Ray```, ```Shadowsocks```, etc.) is running on the system with enhanced mode or system proxy mode enabled, the Docker will automatically detect and use the proxy for network access without manual configuration. This is very convenient for users who need to access exchange APIs through a proxy, as the Docker can automatically adapt to the system's network environment after startup.

### Deploy Docker

You can view the dockers associated with your FMZ Quant Trading Platform account on the [Docker Management Page](https://www.fmz.com/m/nodes), with support for switching between list view and detailed information view. This page displays the docker's IP address, version number, compilation release time, and other related information. Click the **Deploy Docker** button to navigate to the [Docker Deployment Page](https://www.fmz.com/m/add-node). Docker deployment offers two modes: 1. One-click docker rental; 2. Manual docker deployment.

  ![Docker Deployment Page](https://www.fmz.com/upload/asset/2e527e497b3fa27ba497b.png)

#### One-Click Docker Rental

On the [Docker Deployment Page](https://www.fmz.com/m/add-node), click the **One-Click Docker Rental** tab and select the server to deploy based on your configuration requirements and server location preferences.

Click "Buy Now" and enter your FMZ Quant Trading Platform account credentials for verification. After successful verification, the docker program will be deployed automatically. The entire deployment process takes a few minutes, and the system will automatically install commonly used Python libraries.

After clicking "Buy Now", the rented server is provisioned through the platform on your behalf and has limited system permissions, with no support for remote login. If you need to use third-party Python libraries that are not pre-installed, it is recommended to use a private server for manual deployment.

Servers rented through the **One-Click Docker Rental** feature use independent billing, which is separate from live trading billing.

Clicking the "Redeploy" button will not delete the live trading logs and data files in the logs directory under the docker directory.

#### Manual Deployment of Bot

You can deploy the bot to various devices, such as: personal computers, servers, Raspberry Pi, etc., supporting multiple mainstream operating systems.
- Linux command-line version: Linux AMD64 / Linux 386 / Linux ARM64 / Linux ARMv7
- Mac command-line version: Mac Intel64 / Apple Silicon
- Windows command-line version, GUI version: 64-bit / 32-bit
- Docker image

After logging into the device where you need to deploy the bot program, download the corresponding bot program according to the device's operating system. The download link can be found in the content displayed after clicking the **Manual Bot Deployment** tab on the [Bot Deployment Page](https://www.fmz.com/m/add-node).
Deploying the bot program requires setting 2 parameters:
![Manual Bot Deployment Page](https://www.fmz.com/upload/asset/2e460507bc21582ba1448.png)

1. Communication address containing the FMZ Quant Trading Platform UID.
2. Password for the FMZ Quant Trading Platform account corresponding to the UID.

**Configuring "Communication Address" and "FMZ Quant Trading Platform Account Password" when deploying the bot:**
- Windows GUI version bot
  The Windows GUI version bot can directly fill these two parameters into the corresponding input box controls on the bot interface.

- Command-line version bot
  For other command-line version bot programs, different operating systems have different commands. Taking Linux & Mac as an example, use the command: ```./robot -s node.fmz.com/123456 -p 654321```, the following explains each part of the command:

  ```./robot``` means running the robot executable program (i.e., the bot program), where ```123456``` is the UID, and ```654321``` is the password for the FMZ Quant Trading Platform account corresponding to the UID.
  ```-s``` parameter represents "Communication address with FMZ Quant Trading Platform UID", the parameter value can be filled in, for example: ```node.fmz.com/123456```.
  ```-p``` parameter represents "Password for the FMZ Quant Trading Platform account corresponding to the UID", the parameter value can be filled in, for example: ```654321```.

  Please note that the parameters here are only examples. The actual parameters can be viewed after logging into FMZ.COM and clicking the **Manual Bot Deployment** tab on the [Bot Deployment Page](https://www.fmz.com/m/add-node). The ```-p``` parameter does not necessarily need to be written in plain text in the bot deployment command. You can use the ```./robot -s node.fmz.com/123456``` command to run, then it will prompt for password input, and you can manually enter the password. Also, please pay attention to issues such as program execution permissions, you need to grant the bot program sufficient permissions and remove running restrictions.

#### Docker Operation Precautions

Important Operation Tips
- Incorrect Operations:
  Do not forcibly terminate the docker process directly on servers or other devices (such as killing the process directly or restarting the server). Such operations may cause the docker to disconnect from the FMZ platform, leading to the following issues:
  - Live trading cannot be stopped normally
  - Live trading continues to run and incur charges
  When this happens, you need to delete the offline docker first before you can stop the live trading.

- Correct Operation Procedure:
  - Confirm that there are no running live trades on the docker
  - Then perform the operation to delete the docker or stop the docker process
  Operating Principle: Stop live trading first, then stop the docker.

### Global IP Address Specification

- The GUI version of the docker on ```Windows``` system can set the IP address directly in the docker software interface. The docker software defaults to automatic IP configuration.
- Dockers running in command-line environment use the ```-I``` parameter to specify the IP address.
  ```log
  -I string
      custom local ip address
  -c string
      config file
  -d string
      custom dns resolve server
  -e string
      docker node executable path
  -f string
      docker settings json
  -i string
      docker image name
  -n string
      node name
  -p string
      password
  -s string
      server address
  -u string
      run as system user
  -v  version info
  -vv
      show verbose log
  -w string
      working directory
  ```

### Command Line Parameters for Bot Program

After downloading the bot software, the executable file ```robot``` obtained from decompression is the bot program. You can specify parameters for the bot program when deploying it.
- ```-v```:
  View the current bot program version, compilation time and other information.
  Complete execution command example for ```Mac OS```: ```./robot -v```.
- ```-vv```:
  Detailed running logs and interaction messages of the bot program are not displayed by default and not written to the bot log file.
  This prevents frequent interaction commands from causing log expansion and occupying disk space. If you need to record detailed bot logs and display them during bot operation, you can use the ```-vv``` parameter to set detailed logs and interaction messages to be written to the bot log file.
- ```-s```:
  Specify the communication address with FMZ Quant Trading Platform when running the bot program.
  Complete execution command example for ```Mac OS```: ```./robot -s node.fmz.com/xxxxxxx```, where ```xxxxxxx``` is the unique identification ID for each FMZ Quant Trading Platform account. After executing the command, you will be prompted to enter the corresponding FMZ Quant Trading Platform account password.
- ```-p```:
  You can directly specify the password through parameters in the run command, which is not recommended as it will leave password parameters in the current system records. Assuming the password for address ```node.fmz.com/xxxxxxx``` is: ```abc123456```.
  Complete execution command example for ```Mac OS```: ```./robot -s node.fmz.com/xxxxxxx -p abc123456```.
- ```-n```:
  Add label information to the running bot program.
  Complete execution command example for ```Mac OS```: ```./robot -n macTest -s node.fmz.com/xxxxxxx```. The ```macTest``` text label will be displayed in the bot information on the platform's bot management page.
- ```-l```:
  Print the list of exchanges supported by the current bot.
  Complete execution command example for ```Mac OS```: ```./robot -l```. This will output the names of supported exchanges.

### Live Trading Data Migration

When you need to migrate live trading data to a bot on another device (server), you can move the live trading database file (database file with .db3 extension) to the corresponding path location in the bot directory on the target device (server).

Set the filename to the corresponding live trading ID on the platform, so that all previous live trading log information will not be lost due to migration to the new device.

### Docker Monitor

In the [Docker Management Page](https://www.fmz.com/m/nodes), you can enable the **Docker Monitor** function in the **Docker List Actions** or **Docker Details Actions**. After enabling monitoring, if the docker goes offline abnormally, the email address bound to the current FMZ Quant Trading Platform will receive a notification message.

## Exchange

The [Exchange](https://www.fmz.com/m/platforms) page is used to manage and display currently configured exchanges. In the FMZ Quant Trading Platform, "Exchange" is a core concept that refers to an object containing API key configurations, communication protocols, and interface encapsulations for fund accounts that can be operated by strategy programs.

On the Exchange Management page, click the "Add Exchange" button to navigate to the [Add Exchange page](https://www.fmz.com/m/add-platform), where you can select and fill in configuration information according to your needs. All configuration information is encrypted locally and stored on the FMZ Quant Trading Platform, so the platform does not record any plaintext data.

**Exchange Object**
Configured exchanges correspond to the ```exchange``` object at the strategy code level. For details, please refer to [```exchange```](https://www.fmz.com/syntax-guide#var_exchange) in the "Syntax Manual".
When configuring backtesting or live trading, you can add multiple exchanges. Therefore, at the strategy code level, there exists an ```exchanges``` object array (array of exchange objects). For details, please refer to [```exchanges```](https://www.fmz.com/syntax-guide#var_exchanges) in the "Syntax Manual".

**Using Exchange Objects**
In strategy code, you can call exchange objects to perform operations such as account queries, market data retrieval, order placement, and order cancellation. Using ```JavaScript``` as an example:

```js
function main() {
    let account = exchange.GetAccount()    // Query account information
    let ticker = exchange.GetTicker()      // Get ticker market data
    let id = exchange.Buy(1000, 1)         // Price is 1000, order quantity is 1
    exchange.CancelOrder(id)               // If the order is not filled, it can be cancelled
}
```

## Strategy Editor

You can write and design strategies by entering the **edit page** from the [Create New Strategy page](https://www.fmz.com/m/add-strategy) or by opening an existing strategy from the [Strategy Library](https://www.fmz.com/m/strategies) (for example, the URL for strategy ID 123456 is: ```https://www.fmz.com/m/edit-strategy/123456```).

The FMZ Quant Trading Platform's online strategy editor provides powerful strategy editing assistance features.

![Online Strategy Editor Interface](https://www.fmz.com/upload/asset/2e50fff4160187be92248.png)

### AI Assistant

FMZ Quant Trading Platform integrates advanced AI large model assistant functionality, providing users with intelligent strategy development and trading assistance services. Through deep integration with industry-leading large language models, the platform can help users quickly solve programming problems, optimize trading strategies, analyze market data, and provide professional quantitative trading guidance.

FMZ platform currently supports the following AI large models:
Claude Sonnet 4 - Anthropic's latest high-performance model with excellent code understanding and generation capabilities.

- How to invoke AI Assistant

  ![AI Assistant in Strategy Editor Menu](https://www.fmz.com/upload/asset/16b08991d9857b82a46b.png)

  Right-click in a blank area and select "AI Assistant" from the popup menu to invoke the AI Assistant, or use the shortcut key ```⌘K``` to invoke the AI Assistant.
- Using AI Assistant to explain code

  ![AI Assistant explaining code in Strategy Editor](https://www.fmz.com/upload/asset/16aa01684eda4e8163ed.png)

  The AI Assistant can not only help you write code but also explain code logic for you. After selecting the code snippet that needs explanation, right-click and select "Explain this code" from the popup menu to view the detailed code explanation provided by the AI Assistant.
- Optimize and improve code
  After selecting the code snippet that needs optimization, right-click and select "Suggest optimizations" or "Refactor code" from the popup menu. The AI Assistant will provide optimization suggestions or directly generate optimized code for you.

### Command Palette

Right-click in the strategy code editing area and select "Command Palette" from the context menu to view keyboard shortcuts and editor commands for various functions.

![Command Palette display in strategy editor menu](https://www.fmz.com/upload/asset/2e429269f02185dfbab3b.png)

### Syntax Manual Quick Reference

In the "Code" editing area of the **Strategy Editor Page**, you can quickly access the "Syntax Manual". Use the corresponding keyboard shortcuts based on your operating system:

![Syntax Manual Quick Reference in Strategy Editor](https://www.fmz.com/upload/asset/2e4d0722af99164f69996.png)

- In browsers on Mac systems (Apple computers): Hold down the ```⌘``` key.
- In browsers on Windows systems: Hold down the ```Ctrl``` key.

Then when you hover your mouse over the **variable name** or **function name** you want to look up, a jump link will appear. Click the link to open the "Syntax Manual" popup, which will automatically navigate to the queried content.

### Go to Definition and References

Select the content you want to query, then right-click to open the context menu.

- Go to Definition: Navigate to the definition location of the queried content.

- Go to References: Navigate to the reference locations of the queried content.

- Peek - Peek Definition: View the definition of the selected code without leaving the current line.

- Peek - Peek References: View references to the current code in other lines without leaving the current position, with support for quick navigation to better understand code logic and structure.

### Strategy Documentation

The online strategy editor provides comprehensive documentation features, allowing categorized management of strategy code, strategy descriptions, usage instructions, development logs, and other information.

![Strategy Documentation Options](https://www.fmz.com/upload/asset/2e47983c191c1779bd52e.png)

- Code: The source code of the strategy program.
  A complete strategy on the FMZ Quant Trading Platform includes: strategy source code, [strategy parameter design](https://www.fmz.com/user-guide#策略参数), [strategy interaction design](https://www.fmz.com/user-guide#交互控件), [strategy template references](https://www.fmz.com/user-guide#模板类库).
- Notes: For recording relevant content during the strategy development process.
- Description: For recording introductory information displayed when the strategy is publicly shown.
- Manual: For recording detailed information that can only be viewed after the strategy is rented.

### History Version Management

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

### Others

- [Remote Editing](https://www.fmz.com/user-guide#远程编辑)
  ![Remote Editing Screenshot](https://www.fmz.com/upload/asset/2e4e8975d1e32517fd989.png)
- [Save Backtest Settings](https://www.fmz.com/user-guide#保存回测设置)
  ![Save Backtest Settings Screenshot](https://www.fmz.com/upload/asset/2e51f69b120f9b6aadaee.png)
- [Strategy Import/Export](https://www.fmz.com/user-guide#完整策略的导入与导出)
  ![Strategy Import/Export Screenshot](https://www.fmz.com/upload/asset/2e52ccf44526f396fb795.png)

## Backtesting System

After completing the design of your quantitative trading strategy, how do you verify key metrics such as the strategy's logical correctness and expected returns? Obviously, you cannot test directly in the market with real funds. The correct approach is to backtest the strategy using historical data, evaluating its profitability and risk characteristics by analyzing the strategy's performance in historical market conditions.

### Backtesting System Modes

The FMZ Quant Trading Platform divides backtesting modes into **Real-tick Level** backtesting and **Simulated-tick Level** backtesting. **Real-tick Level** backtesting is completely based on complete historical data for backtesting; **Simulated-tick Level** backtesting generates **tick data** based on real candlestick data for backtesting. Both are based on real historical data for backtesting, but **Real-tick Level** backtesting has more accurate data and more reliable results. It should be noted that backtesting only reflects the performance of strategies under historical data, and historical data cannot fully represent future market conditions, so backtesting results should be treated with a rational and objective attitude.

**Simulated-tick Level** backtesting generates simulated **tick data** based on the underlying candlestick period, generating up to 12 backtesting time points on each underlying candlestick period. **Real-tick Level** backtesting uses real collected second-by-second tick data, which has a large amount of data and slower backtesting speed, so it is not suitable for backtesting particularly long time ranges. FMZ Quant's backtesting mechanism allows strategies to trade multiple times on a single candlestick, avoiding the limitation of only being able to trade at the closing price, ensuring accuracy while balancing backtesting speed.

[Backtesting System Mechanism Description](https://www.fmz.com/digest-topic/4009)

- Simulated-tick Level
  **Simulated-tick Level** backtesting generates tick data for backtesting based on the underlying candlestick data of the backtesting system, simulating tick data within the price framework composed of the high, low, open, and close prices of the given underlying candlestick bar according to specific algorithms, serving as real-time tick data on the backtesting time series, which is returned when the strategy program calls the interface. For details, please refer to: [Backtesting System Simulated Level Mechanism Description](https://www.fmz.com/bbs-topic/662).

- Real-tick Level
  Real-tick level backtesting uses real tick-level data in the bar time series. For strategies based on tick-level data, using real-tick level backtesting is closer to actual conditions. The ticks in real-tick level backtesting are real recorded data, not simulated. It supports depth data, market trade record data playback, supports custom depth, and supports trade-by-trade data. Real-tick level backtesting data supports a maximum of 50MB, with no limit on the backtesting time range within the data limit. To maximize the backtesting time range as much as possible, you can reduce the depth level value settings and not use trade-by-trade data to extend the backtesting time range. Call ```GetDepth``` and ```GetTrades``` functions to obtain playback market data. At a certain market data moment on the timeline, calling ```GetTicker```, ```GetTrades```, ```GetDepth```, ```GetRecords``` will not move time forward multiple times on the backtesting timeline (will not trigger jumping to the next market data moment). Repeated calls to any of the above functions will push the backtesting time forward on the backtesting timeline (jump to the next market data moment). When using real-tick level backtesting, it is not advisable to select too early a time, as earlier time periods may not have real-tick level data.

**Real-tick Level** and **Simulated-tick Level** mode backtesting system order matching mechanism: Order matching is executed based on price-taking and full-fill execution. Therefore, partial fill scenarios cannot be tested in the backtesting system.

### Impact of Backtest Data Granularity on Backtesting

The following test code will exhibit different performance for different data granularities (A. Live trading level backtest, B. Simulation level backtest (smaller underlying K-line period), C. Simulation level backtest (larger underlying K-line period), etc.). Both the number of trades and profit/loss results will vary. When backtesting, the smallest possible data granularity should be maintained. While backtesting may be faster with larger data granularity, the results obtained may lack objectivity.

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
            // Price rises above threshold -> Go short
            exchange.Sell(ticker.Last, lotSize)
            Log("Short @", ticker.Last)
            direction = "short"
        } else if ((!direction || direction == "short") && diff <= -delta) {
            // Price falls below threshold -> Go long
            exchange.Buy(ticker.Last, lotSize)
            Log("Long @", ticker.Last)
            direction = "long"
        }
        // Should be as short as possible in Tick mode, no impact in K-line backtest
        Sleep(100)
    }
}
```

### The backtesting system supports multiple programming languages

The backtesting system supports backtesting strategies written in the following languages: ```JavaScript```, ```TypeScript```, ```Python```, ```Rust```, ```C++```, [```PINE```](https://www.fmz.com/bbs-topic/9315), [```My Language```](https://www.fmz.com/bbs-topic/2569), ```Blockly``` visual programming, and the ```Workflow``` workflow.

  1. Backtesting of **JavaScript** and **C++** strategies is performed in the browser, and these strategies require no additional software, libraries, or modules to be installed when running in either live trading or backtesting.

  2. Backtesting of **Python** strategies is performed on the docker, and can be run either on FMZ Quant's public servers or on the user's own docker. Both live trading and backtesting depend on the Python environment installed on the system where the docker resides; if you need to use certain libraries, please install them yourself, as FMZ Quant's public servers only support commonly used **Python** libraries.

  3. Backtesting of **JavaScript** strategies supports debugging in Chrome's DevTools; see the [reference documentation](https://www.fmz.com/digest-topic/9459) for details.

  4. **Workflow** strategies support backtesting, allowing you to visually view node execution status and the data flow process.

  5. **Rust** strategies are compiled by the platform server during backtesting, and the compiled module runs in the browser-based backtesting system; third-party crate dependencies declared via frontmatter in the strategy are automatically fetched at compile time, with no need to install any toolchain locally.

### Exchanges Supported by Backtesting System

- Cryptocurrency
  Supports mainstream cryptocurrency spot and futures exchanges, covering all trading pairs data from exchanges.
- Futu Securities
  Supports multiple markets including Hong Kong stocks and US stocks.

  Backtesting Notes: The backtesting system currently only supports Futu daily level data:
  ```js
  /*backtest
  start: 2024-05-01 00:00:00
  end: 2025-02-17 00:00:00
  period: 1d
  basePeriod: 1d
  exchanges: [{"eid":"Futures_Futu","currency":"STOCK","fee":[0.03,0.03]}]
  */

  function main() {
      let info = exchange.SetContractType("TLSA.US")   // Set stock symbol: Tesla
      Log("info:", info)         // info: {"InstrumentID":"TLSA.US","LotTick":1,"PriceTick":0.01,"VolumeMultiple":1}
      Log(exchange.GetTicker())  // {"Time":1714482000000,"Symbol":"TLSA.US","Open":0.62,"High":0.63,"Low":0.61,"Sell":0.63,"Buy":0.61,"Last":0.62,"Volume":0,"OpenInterest":0}
  }
  ```

### Backtest System Parameter Optimization

The FMZ Quant Trading Platform backtest system parameter optimization feature allows you to set parameter combinations based on optimization options for each parameter during backtesting. On the "Simulation Backtest" page in the strategy parameters section, check the **Optimization** option on the right side of the strategy parameter to display optimization settings.

- Minimum Value: Set the starting value of the parameter.
- Maximum Value: Set the maximum value after the parameter increments.
- Step Size: The increment amount for parameter changes.
- Concurrent Threads:
  When optimizing parameters, set the number of threads for concurrent execution of each backtest parameter combination. This option only supports parameter optimization for ```JavaScript```, ```PINE```, and ```MyLanguage``` strategies, and does not support template parameter optimization.

The system generates parameter combinations based on ```Minimum Value```, ```Maximum Value```, and ```Step Size``` settings, and iterates through these parameter combinations for backtesting (i.e., executes one backtest for each parameter combination). Only strategy parameters of type **number** can be configured for parameter optimization in the backtest system.

### Save Backtest Settings

In the "Simulated Backtest" tab (i.e., the backtesting system) of the [Strategy Editing Page](https://www.fmz.com/m/add-strategy), you can configure options such as the backtest configuration and strategy parameters to run a strategy backtest. The backtest configuration is used to set conditions such as the backtest time range, exchanges, trading slippage, and fees; the strategy parameters are used to set the strategy's parameter options.

Once you have configured these parameters, you can run the strategy backtest according to your settings. So, how do you save these configured settings?

- 1. You can use the "Save Backtest Settings" button on the [Strategy Editing Page](https://www.fmz.com/m/add-strategy) to record all backtest configuration information (including backtest settings and strategy parameter settings) as code within the strategy source code.

- 2. When you click the "Save Strategy" button on the strategy editing page to save the strategy, the platform will automatically record the current backtest settings, strategy parameter configuration, and other information.

How does the backtesting system load the backtest configuration?

- 1. When you refresh or reopen the strategy editing page, the system will preferentially and automatically load the backtest configuration recorded by the "Save Backtest Settings" button.

- 2. If the current strategy code does not contain backtest configuration information recorded as a ```backtest``` comment (i.e., it was not saved in the strategy code via the "Save Backtest Settings" button), the backtesting system will automatically set the backtest configuration to the backtest settings from the last time the "Save Strategy" button was clicked for the current strategy.

- 3. If you modify the backtest configuration information recorded as a comment at the beginning of the strategy code on the strategy editing page and need to sync the updated backtest configuration to the options in the strategy backtest interface, you can click the "Backtest Settings" button above the ```backtest``` section in the strategy editing area.

When you click "Save Backtest Settings", the format in which ```JavaScript```/```Python```/```C++```/```My Language```/```PINE``` strategies save the backtest settings to the strategy code differs slightly:

```javascript
/*backtest
start: 2021-06-26 00:00:00
end: 2021-09-23 00:00:00
period: 1d
basePeriod: 1h
exchanges: [{"eid":"Binance","currency":"BTC_USDT"}]
*/
```

```python
'''backtest
start: 2021-06-26 00:00:00
end: 2021-09-23 00:00:00
period: 1d
basePeriod: 1h
exchanges: [{"eid":"Binance","currency":"BTC_USDT"}]
'''
```

```rust
/*backtest
start: 2021-06-26 00:00:00
end: 2021-09-23 00:00:00
period: 1d
basePeriod: 1h
exchanges: [{"eid":"Binance","currency":"BTC_USDT"}]
*/
```

```cpp
/*backtest
start: 2021-06-26 00:00:00
end: 2021-09-23 00:00:00
period: 1d
basePeriod: 1h
exchanges: [{"eid":"Binance","currency":"BTC_USDT"}]
*/
```

My Language:

```My
(*backtest
start: 2021-06-26 00:00:00
end: 2021-09-23 00:00:00
period: 1d
basePeriod: 1h
exchanges: [{"eid":"Binance","currency":"BTC_USDT"}]
*)
```

PINE Language:

```pine
/*backtest
start: 2021-06-26 00:00:00
end: 2021-09-23 00:00:00
period: 1d
basePeriod: 1h
exchanges: [{"eid":"Binance","currency":"BTC_USDT"}]
*/
```

### Custom Data Source

The FMZ Quant Trading Platform's backtesting system supports custom data sources. The backtesting system uses the ```GET``` method to request custom URLs (publicly accessible addresses) to obtain external data sources for backtesting. The additional request parameters are as follows:

| Parameter | Meaning | Description |
| - | - | - |
| symbol | Symbol name | Spot market data example: ```BTC_USDT```, Futures market data example: ```BTC_USDT.swap```, Perpetual futures funding rate data example: ```BTC_USDT.funding```, Perpetual futures price index data example: ```BTC_USDT.index``` |
| eid | Exchange | For example: OKX, Futures_OKX |
| round | Data precision | When true, indicates that the data returned by the custom data source defines specific precision. The request sent by the FMZ Quant Trading Platform backtesting system to the custom data source is fixed as: ```round=true``` |
| period | K-line data period (milliseconds) | For example: ```60000``` represents a 1-minute period |
| depth | Order book depth levels | 1-20 |
| trades | Whether tick data is required | True (1) / False (0) |
| from | Start time | Unix timestamp |
| to | End time | Unix timestamp |
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
        // ...
    ]
}
```

- Adjacent period interval is 8 hours
- For example, Binance funding rate updates every 8 hours, why is the funding rate data -16795?
  This is because, like K-line data, to avoid floating-point precision loss during network transmission, data is represented as integers; funding rate data can also be negative.

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
        [1584922500000, 58975, 59428, 58581, 59154, 0],
        // ...
    ]
}
```

Example of price index data request sent by the backtest system:
```url
http://customserver:9090/data?custom=0&depth=20&detail=true&eid=Futures_Binance&from=1351641600&period=86400000&round=true&symbol=BTC_USDT.index&to=1611244800&trades=0
```

#### Custom Data Source Example

Specify the data source address, for example: ```http://120.24.2.20:9090/data```. The custom data source service program is written in ```Golang```:

```golang
package main

import (
    "fmt"
    "net/http"
    "encoding/json"
)

func Handle (w http.ResponseWriter, r *http.Request) {
    // e.g. set on backtest DataSourse: http://xxx.xx.x.xx:9090/data

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
exchanges: [{"eid":"OKX","currency":"BTC_USDT","feeder":"http://120.24.2.20:9090/data"}]
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

FMZ Quant Trading Platform has open-sourced local backtesting engines for ```JavaScript``` and ```Python``` languages, supporting custom underlying K-line periods during backtesting.
- [JavaScript Backtesting Engine](https://github.com/fmzquant/backtest_javascript)
- [Python Backtesting Engine](https://github.com/fmzquant/backtest_python)

Using Python as an example, here's a brief guide on how to use the local backtesting engine:
```python
'''backtest
start: 2022-02-19 00:00:00
end: 2022-03-22 12:00:00
period: 15m
exchanges: [{"eid":"Binance","currency":"BTC_USDT","balance":10000,"stocks":0}]
'''

# Part 1 -----------------------------------
# Initialize the backtesting engine, backtest contains the engine configuration
# which is consistent with the FMZ platform's online backtesting system configuration
# Read the configuration string above via __doc__ and initialize the backtesting environment
from fmz import *
task = VCtx(__doc__) # initialize backtest engine from __doc__
# End    -----------------------------------

# Part 2 -----------------------------------
# Below is an example of strategy code to be tested (complete strategy code can be copied from FMZ platform)
# Note: When copying strategy code only, it does not include parameter design, interaction design, and other configurations
def onTick():
	ticker = _C(exchange.GetTicker)
	LogStatus(_D(), ticker.Last)

def main():
	exchange.SetCurrency("ETH_USDT")
	# exchange.SetContractType("swap")  # If testing futures exchange objects, you need to set the contract, for example, set to perpetual contract here
	Log(exchange.GetAccount())
	while True:
		onTick()
		Sleep(1000)
# End    -----------------------------------

# Part 3 -----------------------------------
# Execute backtesting and catch the termination signal, EOF exception will be triggered when backtesting ends
# After catching the exception, you can output backtesting result data or display backtesting charts
try:
	main()
except:
	print("Strategy testing completed.")
	print(task.Join(False)) # print backtest result
	# task.Show() # or show backtest chart
# End    -----------------------------------
```

### Backtest Page Shortcuts

- Shortcut for switching between strategy editor and backtest page
  Use ```Ctrl + ,``` to switch between backtest page and strategy editor page. Hold ```Ctrl``` and press ```,```.
- Shortcut for saving strategy
  Use ```Ctrl + s``` to save strategy.
- Shortcut for starting backtest
  Use ```Ctrl + b``` to start backtest.

### Backtest Data Download

- Backtest System Log Data Download
  Open the specific strategy and switch to the "Backtest Page" to run strategy backtesting. After the backtest is completed, there is a "Download Table" button in the upper right corner of the displayed "Status Information" bar. Click it to download the CSV format file of the status bar data at the end of the backtest.
- Backtest System Status Bar Data Download
  Open the specific strategy and switch to the "Backtest Page" to run strategy backtesting. After the backtest is completed, there is a "Download Table" button in the upper right corner of the displayed "Log Information" bar. Click it to download the CSV format file of the backtest log data.

### Backtest System Sharpe Ratio Algorithm

Backtesting system Sharpe ratio algorithm source code:
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

## Strategy Entry Functions

For strategies written in ```JavaScript```, ```Python```, ```Rust```, and ```C++```, the FMZ Quant Trading Platform has already defined the following entry functions.

  | Function Name | Description |
  | - | - |
  |```main()```| The entry function, i.e., the main function of the strategy. |

  |```onexit()```| The cleanup function executed upon normal exit, with a maximum execution time of 5 minutes; it does not have to be declared. If execution times out, an **interrupt** error will be reported. In live trading, if the ```onerror()``` function has already been triggered first, the ```onexit()``` function will no longer be triggered.

  |```onerror()```| The function triggered upon abnormal exit, with a maximum execution time of 5 minutes; it does not have to be declared. Strategies written in ```Python``` and ```C++``` do not support this function, and the backtesting system does not support this function either.

  |```init()```| The initialization function, which the strategy program automatically calls first when it starts running; it does not have to be declared. |

  **Notes:**

  - When the ```main()``` function finishes executing, all created child threads will be automatically terminated.

  - In ```Rust``` language strategies, you can directly define ```fn main()```, ```fn init()```, and ```fn onexit()``` (which are automatically called by the bootstrap layer); you can also call ```OnExit()``` in the strategy code to register additional exit hooks. For details, see "Rust Strategy Writing Guide".

### onexit()

The ```onexit()``` function is used to handle the cleanup work of a strategy. Its maximum execution time is 5 minutes, and it must be implemented by the user.

Test the ```onexit()``` function:

```javascript
function main(){
    Log("Starting, will stop after 5 seconds and execute cleanup function!")
    Sleep(1000 * 5)
}

// Implementation of the cleanup function
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

// Implementation of the cleanup function
fn onexit() {
    let beginTime = Unix() * 1000;
    loop {
        let nowTime = Unix() * 1000;
        Log!("Program stop countdown..cleanup started, elapsed time:", (nowTime - beginTime) / 1000, "seconds!");
        Sleep(1000);
    }
}
```

```cpp
void main() {
    Log("Starting, will stop after 5 seconds and execute cleanup function!");
    Sleep(1000 * 5);
}

void onexit() {
    auto beginTime = Unix() * 1000;
    while(true) {
        auto ts = Unix() * 1000;
        Log("Program stop countdown..cleanup started, elapsed time:", (ts - beginTime) / 1000, "seconds!");
        Sleep(1000);
    }
}
```

Since a strategy in the backtesting system is usually designed as an infinite loop that continuously polls and executes, the ```onexit()``` function implemented by the strategy cannot be triggered in the backtesting system. You can trigger the execution of the ```onexit()``` function by detecting the backtesting system's end marker (the EOF exception).

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
                // When the backtest ends, the API call returns Err; exit the loop so that main returns, thereby triggering the onexit() cleanup function
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

```cpp
#include <iostream>
#include <exception>
#include <string>

void onTick() {
    while (true) {
        auto ticker = exchange.GetTicker();
        LogStatus(_D(), ticker);
        Sleep(500);
    }
}

void main() {
    std::string prefix = "Futures_";
    bool startsWith = exchange.GetName().substr(0, prefix.length()) == prefix;
    if (startsWith) {
        Log("Exchange is futures");
        exchange.SetContractType("swap");
    } else {
        Log("Exchange is spot");
    }

    if (IsVirtual()) {
        try {
            onTick();
        } catch (...) {
            std::cerr << "Caught unknown exception" << std::endl;
        }
    } else {
        onTick();
    }
}

void onexit() {
    Log("Executing cleanup function");
}
```

### init()

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

```cpp
void main() {
    Log("First line of code executed!", "#FF0000");
    Log("Exiting!");
}

void init() {
    Log("Initializing!");
}
```

### onerror()

```onerror()```, triggered when an exception occurs, the ```onerror()``` function will be executed. This function is not supported in ```Python``` and ```C++``` language strategies. The ```onerror()``` function can accept a ```msg``` parameter, which contains the error message when the exception is triggered.

```javascript
function main() {
    var arr = []
    Log(arr[6].Close)  // Intentionally trigger a program exception here
}

function onerror(msg) {
    Log("Error:", msg)
}
```

```python
# Python not supported
```

```cpp
// C++ not supported
```

## Strategy Framework and API Functions

In strategies written in ```JavaScript```, ```Python```, ```Rust```, or ```C++```, you need to call the ```Sleep()``` function within the strategy's main loop. During backtesting, it is used to control the backtesting speed; in live trading, it is used to control the strategy's polling interval, thereby controlling the request frequency to the exchange's API interface.

### Global Functions

| Function Name | Description |
| - | - |
| [Version](/syntax-guide#fun_version)               | Returns the current system version number |
| [Sleep](/syntax-guide#fun_sleep)                   | Sleep function, parameter is the number of milliseconds to pause |
| [IsVirtual](/syntax-guide#fun_isvirtual)           | Determines the execution environment, returns true for backtesting environment |
| [Mail](/syntax-guide#fun_mail)                     | Send email |
| [Mail_Go](/syntax-guide#fun_mail_go)               | Asynchronous version of the ```Mail``` function |
| [SetErrorFilter](/syntax-guide#fun_seterrorfilter) | Filter error logs, parameter is a regular expression string, error logs matching this regex will not be uploaded to the log system |
| [GetPid](/syntax-guide#fun_getpid)                 | Get live trading process ID |
| [GetLastError](/syntax-guide#fun_getlasterror)     | Get the most recent error message |
| [GetCommand](/syntax-guide#fun_getcommand)         | Get strategy interaction commands, for strategy interaction control settings please refer to: [Interactive Controls](/user-guide#interactive-controls) |
| [GetMeta](/syntax-guide#fun_getmeta)               | Get the Meta value written when generating the strategy registration code |
| [Dial](/syntax-guide#fun_dial)                     | Used for raw Socket access |
| [HttpQuery](/syntax-guide#fun_httpquery)           | Send HTTP request |
| [HttpQuery_Go](/syntax-guide#fun_httpquery_go)     | Asynchronous version of the ```HttpQuery``` function |
| [Encode](/syntax-guide#fun_encode)                 | Data encoding function |
| [UnixNano](/syntax-guide#fun_unixnano)             | Get nanosecond timestamp |
| [Unix](/syntax-guide#fun_unix)                     | Get second-level timestamp |
| [GetOS](/syntax-guide#fun_getos)                   | Get system information |
| [MD5](/syntax-guide#fun_md5)                       | Calculate MD5 hash value |
| [DBExec](/syntax-guide#fun_dbexec)                 | Database function for executing SQL statements and performing database operations |
| [UUID](/syntax-guide#fun_uuid)                     | Generate UUID |
| [EventLoop](/syntax-guide#fun_eventloop)           | Listen for events, returns when any WebSocket is readable or concurrent tasks like ```exchange.Go```, ```HttpQuery_Go``` are completed, this function is only available for live trading |
| [_G](/syntax-guide#fun__g)                         | Persistently save data, this function implements a saveable global dictionary feature. The data structure is a key-value pair table, permanently saved in the docker's local database file |
| [_D](/syntax-guide#fun__d)                         | Timestamp processing function, converts millisecond timestamp or Date object to time string |
| [_N](/syntax-guide#fun__n)                         | Format floating-point numbers, for example ```_N(3.1415, 2)``` will remove digits after the second decimal place of 3.1415, the function returns 3.14 |
| [_C](/syntax-guide#fun__c)                         | Retry function for interface fault tolerance. Note that for fault tolerance of ```exchange.GetTicker``` function, use ```_C(exchange.GetTicker)``` instead of ```_C(exchange.GetTicker())``` |
| [_Cross](/syntax-guide#fun__cross)                 | Crossover detection function, ```_Cross()``` returns a positive number indicating the number of periods since upward crossover, negative number for downward crossover, 0 means current prices are equal |
| [JSONParse](/syntax-guide#fun_jsonparse)           | Parse JSON, can correctly parse JSON strings containing large numeric values, parsing large numbers as string type. The backtesting system does not support the ```JSONParse()``` function |
| [SetChannelData](/syntax-guide#fun_setchanneldata) | Publish latest status data on a channel for inter-bot communication |
| [GetChannelData](/syntax-guide#fun_getchanneldata) | Subscribe to channel data from specified live trading bot for inter-bot communication |

### Logging Functions

| Function Name | Description |
| - | - |
| [Log](/syntax-guide#fun_log)                       | Output logs, supports setting log text color, push notifications, and printing base64-encoded images |
| [LogProfit](/syntax-guide#fun_logprofit)           | Output profit/loss data, print P&L values and draw profit curves based on the values |
| [LogProfitReset](/syntax-guide#fun_logprofitreset) | Clear all profit logs and profit charts output by the ```LogProfit``` function |
| [LogStatus](/syntax-guide#fun_logstatus)           | Output information in the status bar, supports setting button controls and outputting tables in the status bar |
| [EnableLog](/syntax-guide#fun_enablelog)           | Enable or disable logging for order information |
| [Chart](/syntax-guide#fun_chart)                   | Chart drawing function, based on Highcharts/Highstocks chart library |
| [KLineChart](/syntax-guide#fun_klinechart)         | Pine language-style chart drawing function, used for custom drawing in a Pine-like manner during strategy execution |
| [LogReset](/syntax-guide#fun_logreset)             | Clear logs, supports retaining a specified number of recent log records through parameters |
| [LogVacuum](/syntax-guide#fun_logvacuum)           | Reclaim SQLite resources, reclaim storage space occupied by SQLite when deleting data after calling ```LogReset()``` function to clear logs |
| [console.log](/syntax-guide#fun_console.log)       | Output debug information in the "Debug Info" section of the live trading page |
| [console.error](/syntax-guide#fun_console.error)   | Output error information in the "Debug Info" section of the live trading page |

### Market Functions

| Function Name | Description |
| - | - |
| [exchange.GetTicker](/syntax-guide#fun_exchange.getticker)       | Get tick market data |
| [exchange.GetDepth](/syntax-guide#fun_exchange.getdepth)         | Get order book depth data |
| [exchange.GetTrades](/syntax-guide#fun_exchange.gettrades)       | Get market trade records |
| [exchange.GetRecords](/syntax-guide#fun_exchange.getrecords)     | Get K-line data |
| [exchange.GetPeriod](/syntax-guide#fun_exchange.getperiod)       | Get current K-line period |
| [exchange.SetMaxBarLen](/syntax-guide#fun_exchange.setmaxbarlen) | Set maximum K-line length |
| [exchange.GetRawJSON](/syntax-guide#fun_exchange.getrawjson)     | Get raw content returned from the most recent REST request |
| [exchange.GetRate](/syntax-guide#fun_exchange.getrate)           | Get current exchange rate value |
| [exchange.SetData](/syntax-guide#fun_exchange.setdata)           | Set data loaded at strategy runtime |
| [exchange.GetData](/syntax-guide#fun_exchange.getdata)           | Get loaded data or data provided by external links |
| [exchange.GetMarkets](/syntax-guide#fun_exchange.getmarkets)     | Get exchange market information |
| [exchange.GetTickers](/syntax-guide#fun_exchange.gettickers)     | Get exchange aggregated market data |

### Trading Functions

| Function Name | Description |
| - | - |
| [exchange.Buy](/syntax-guide#fun_exchange.buy)                          | Submit a buy order. When placing futures contract orders, ensure the trading direction is set correctly; an error will occur if the trading direction does not match the trading function |
| [exchange.Sell](/syntax-guide#fun_exchange.sell)                        | Submit a sell order. When placing futures contract orders, ensure the trading direction is set correctly; an error will occur if the trading direction does not match the trading function |
| [exchange.CreateOrder](/syntax-guide#fun_exchange.createorder)          | Submit an order by specifying the trading instrument, trading direction, price, and quantity through parameters |
| [exchange.ModifyOrder](/syntax-guide#fun_exchange.modifyorder)          | Modify the price and quantity of a regular order, supports modifying other order attributes through additional parameters |
| [exchange.ModifyConditionOrder](/syntax-guide#fun_exchange.modifyconditionorder) | Modify the quantity and trigger conditions of a conditional order, supports modifying other conditional order attributes through additional parameters |
| [exchange.CancelOrder](/syntax-guide#fun_exchange.cancelorder)          | Cancel an order |
| [exchange.GetOrder](/syntax-guide#fun_exchange.getorder)                | Get order information, data structure is [Order](/syntax-guide#struct_order) structure |
| [exchange.GetOrders](/syntax-guide#fun_exchange.getorders)              | Get unfilled orders, data structure is an array (list) of [Order](/syntax-guide#struct_order) structures |
| [exchange.GetHistoryOrders](/syntax-guide#fun_exchange.gethistoryorders)| Get historical orders for the current trading pair/contract, supports specifying specific trading instruments |
| [exchange.SetPrecision](/syntax-guide#fun_exchange.setprecision)        | Set the price and order quantity precision for the exchange object, the system will automatically truncate excess digits after setting |
| [exchange.SetRate](/syntax-guide#fun_exchange.setrate)                  | Set the exchange rate |
| [exchange.IO](/syntax-guide#fun_exchange.io)                            | Used for other interface calls related to the exchange object |
| [exchange.Log](/syntax-guide#fun_exchange.log)                          | Output and record trading logs without actually placing orders |
| [exchange.Encode](/syntax-guide#fun_exchange.encode)                    | Signature encryption calculation |
| [exchange.Go](/syntax-guide#fun_exchange.go)                            | Multi-threaded asynchronous support function |
| [exchange.GetAccount](/syntax-guide#fun_exchange.getaccount)            | Get account information |
| [exchange.GetAssets](/syntax-guide#fun_exchange.getassets)              | Request exchange account asset information |
| [exchange.GetName](/syntax-guide#fun_exchange.getname)                  | Get the name of the exchange object |
| [exchange.GetLabel](/syntax-guide#fun_exchange.getlabel)                | Get the label of the exchange object |
| [exchange.GetCurrency](/syntax-guide#fun_exchange.getcurrency)          | Get the current trading pair |
| [exchange.SetCurrency](/syntax-guide#fun_exchange.setcurrency)          | Switch trading pair |
| [exchange.GetQuoteCurrency](/syntax-guide#fun_exchange.getquotecurrency)| Get the quote currency name of the current trading pair |

### Futures Functions

| Function Name | Description |
| - | - |
| [exchange.GetPositions](/syntax-guide#fun_exchange.getpositions)       | Get futures position information, returns an array (list) of [Position](/syntax-guide#struct_position) structures |
| [exchange.SetMarginLevel](/syntax-guide#fun_exchange.setmarginlevel)   | Set leverage multiplier |
| [exchange.SetDirection](/syntax-guide#fun_exchange.setdirection)       | Set the order direction for [exchange.Buy](/syntax-guide#fun_exchange.buy) and [exchange.Sell](/syntax-guide#fun_exchange.sell) functions when placing orders in futures contracts |
| [exchange.SetContractType](/syntax-guide#fun_exchange.setcontracttype) | Set contract code, for example: ```exchange.SetContractType("swap")``` sets the contract code to ```swap```, setting the current operating contract to perpetual contract |
| [exchange.GetContractType](/syntax-guide#fun_exchange.getcontracttype) | Get the currently set contract code |
| [exchange.GetFundings](/syntax-guide#fun_exchange.getfundings)         | Get funding rate data for perpetual contracts on the current futures exchange |

### Network Functions

| Function Name | Description |
| - | - |
| [exchange.SetBase](/syntax-guide#fun_exchange.setbase)       | Set the base address of the exchange API interface |
| [exchange.GetBase](/syntax-guide#fun_exchange.getbase)       | Get the current base address of the exchange API interface |
| [exchange.SetProxy](/syntax-guide#fun_exchange.setproxy)     | Set network proxy |
| [exchange.SetTimeout](/syntax-guide#fun_exchange.settimeout) | Set timeout for REST protocol |

### API Rate Limiting Control

## Overview

The API rate limiting control feature is used to limit how frequently a strategy calls the exchange's API, preventing account bans or temporary restrictions caused by triggering the exchange's rate limits. The FMZ platform provides flexible rate limiting configuration options, supporting two rate limiting modes and multiple configuration strategies.

### Why API Rate Limiting Is Needed

- **Avoid triggering exchange limits**: Most exchanges impose strict limits on API call frequency; once exceeded, your account may be temporarily or permanently banned.

- **Allocate API quota sensibly**: In multi-strategy, multi-trading-pair scenarios, API call resources need to be allocated sensibly.

- **Improve strategy stability**: By proactively rate limiting, you avoid connection failures and data retrieval anomalies caused by frequent calls.

- **Comply with exchange rules**: Adhere to the exchange's API usage rules and maintain a healthy API usage relationship.

### Two Rate Limiting Modes

**rate mode (smooth rate limiting)**

- Suitable for general rate limiting needs

- Does not strictly align to time windows

- Distributes calls relatively smoothly

- Recommended for everyday API call limiting

**quota mode (quota-based rate limiting)**

- Strictly aligns to time windows

- For example: when set to ```"1s"```, the window aligns to whole seconds; when set to ```"1m"```, the window aligns to whole minutes

- Suitable for scenarios that require strict time window control

- Recommended for intraday quota management

## Basic Usage

### Basic rate Mode Example

```javascript
function main() {
    // Limit GetTicker to maximum 10 times per second
    exchange.IO("rate", "GetTicker", 10, "1s")

    // Normal API calls
    for (var i = 0; i < 20; i++) {
        var ticker = exchange.GetTicker("BTC_USDT")
        if (ticker) {
            Log("Success:", ticker.Last)
        } else {
            Log("Rate limit exceeded")  // Returns null when exceeding 10 times/second
        }
        Sleep(50)
    }
}
```

```python
def main():
    # Limit GetTicker to maximum 10 times per second
    exchange.IO("rate", "GetTicker", 10, "1s")

    # Normal API calls
    for i in range(20):
        ticker = exchange.GetTicker("BTC_USDT")
        if ticker:
            Log("Success:", ticker["Last"])
        else:
            Log("Rate limit exceeded")  # Returns None when exceeding 10 times/second
        Sleep(50)
```

```rust
fn main() {
    // Limit GetTicker to maximum 10 times per second
    let _ = exchange.IO(("rate", "GetTicker", 10, "1s"));

    // Normal API calls
    for _i in 0..20 {
        match exchange.GetTicker("BTC_USDT") {
            Ok(ticker) => Log!("Success:", ticker.Last),
            Err(_) => Log!("Rate limit exceeded"),  // Returns Err when exceeding 10 times/second
        }
        Sleep(50);
    }
}
```

```cpp
// C++ is not supported yet
```

### Basic quota Mode Example

```javascript
function main() {
    // Strict limit, time window aligned to whole seconds
    exchange.IO("quota", "GetTicker", 5, "1s")

    for (var i = 0; i < 10; i++) {
        var ticker = exchange.GetTicker("BTC_USDT")
        Log(_D(), "Call", i+1, ticker ? "Success" : "Quota exceeded")
        Sleep(150)  // About 6-7 calls per second, will trigger limit
    }
}
```

```python
def main():
    # Strict limit, time window aligned to whole seconds
    exchange.IO("quota", "GetTicker", 5, "1s")

    for i in range(10):
        ticker = exchange.GetTicker("BTC_USDT")
        Log(_D(), "Call", i+1, "Success" if ticker else "Quota exceeded")
        Sleep(150)  # About 6-7 calls per second, will trigger limit
```

```rust
fn main() {
    // Strict limit, time window aligned to whole seconds
    let _ = exchange.IO(("quota", "GetTicker", 5, "1s"));

    for i in 0..10 {
        match exchange.GetTicker("BTC_USDT") {
            Ok(_) => Log!(_D(None), "Call", i + 1, "Success"),
            Err(_) => Log!(_D(None), "Call", i + 1, "Quota exceeded"),
        }
        Sleep(150);  // About 6-7 calls per second, will trigger limit
    }
}
```

```cpp
// C++ is not supported yet
```

## Function Name Configuration

### Rate Limiting a Single Function

```javascript
function main() {
    // Only limit GetTicker function
    exchange.IO("rate", "GetTicker", 10, "1s")

    // GetTicker is limited, GetDepth is not limited
    exchange.GetTicker("BTC_USDT")
    exchange.GetDepth("BTC_USDT")
}
```

```python
def main():
    # Only limit GetTicker function
    exchange.IO("rate", "GetTicker", 10, "1s")

    # GetTicker is limited, GetDepth is not limited
    exchange.GetTicker("BTC_USDT")
    exchange.GetDepth("BTC_USDT")
```

```rust
fn main() {
    // Only limit GetTicker function
    let _ = exchange.IO(("rate", "GetTicker", 10, "1s"));

    // GetTicker is limited, GetDepth is not limited
    let _ = exchange.GetTicker("BTC_USDT");
    let _ = exchange.GetDepth("BTC_USDT");
}
```

```cpp
// C++ not supported yet
```

### Joint Rate Limiting Across Multiple Functions

```javascript
function main() {
    // GetTicker and GetDepth share quota, total 10 times per second
    exchange.IO("rate", "GetTicker,GetDepth", 10, "1s")

    for (var i = 0; i < 15; i++) {
        if (i % 2 == 0) {
            exchange.GetTicker("BTC_USDT")  // Counted in shared quota
        } else {
            exchange.GetDepth("BTC_USDT")   // Counted in shared quota
        }
    }
}
```

```python
def main():
    # GetTicker and GetDepth share quota, total 10 times per second
    exchange.IO("rate", "GetTicker,GetDepth", 10, "1s")

    for i in range(15):
        if i % 2 == 0:
            exchange.GetTicker("BTC_USDT")  # Counted in shared quota
        else:
            exchange.GetDepth("BTC_USDT")   # Counted in shared quota
```

```rust
fn main() {
    // GetTicker and GetDepth share quota, total 10 times per second
    let _ = exchange.IO(("rate", "GetTicker,GetDepth", 10, "1s"));

    for i in 0..15 {
        if i % 2 == 0 {
            let _ = exchange.GetTicker("BTC_USDT");  // Counted in shared quota
        } else {
            let _ = exchange.GetDepth("BTC_USDT");   // Counted in shared quota
        }
    }
}
```

```cpp
// C++ not supported yet
```

### Restrict All Functions Using Wildcards

```javascript
function main() {
    // Limit all API calls to total 100 times per minute
    exchange.IO("rate", "*", 100, "1m")

    // All calls are counted in total quota
    exchange.GetTicker("BTC_USDT")
    exchange.GetDepth("BTC_USDT")
    exchange.GetAccount()
    exchange.CreateOrder("BTC_USDT", "buy", 50000, 0.001)
}
```

```python
def main():
    # Limit all API calls to total 100 times per minute
    exchange.IO("rate", "*", 100, "1m")

    # All calls are counted in total quota
    exchange.GetTicker("BTC_USDT")
    exchange.GetDepth("BTC_USDT")
    exchange.GetAccount()
    exchange.CreateOrder("BTC_USDT", "buy", 50000, 0.001)
```

```rust
fn main() {
    // Limit all API calls to total 100 times per minute
    let _ = exchange.IO(("rate", "*", 100, "1m"));

    // All calls are counted in total quota
    let _ = exchange.GetTicker("BTC_USDT");
    let _ = exchange.GetDepth("BTC_USDT");
    let _ = exchange.GetAccount();
    let _ = exchange.CreateOrder("BTC_USDT", "buy", 50000, 0.001);
}
```

```cpp
// C++ not supported yet
```

## Time Period Configuration

### Supported Time Units

- ```ns```: nanoseconds

- ```us``` or ```µs```: microseconds

- ```ms```: milliseconds

- ```s```: seconds

- ```m```: minutes

- ```h```: hours

- ```d```: days

Example: ```"100ms"```, ```"1s"```, ```"5m"```, ```"1h"```, ```"1d"```

```javascript
function main() {
    // Different time period configurations
    exchange.IO("rate", "GetTicker", 10, "1s")     // 10 times per second
    exchange.IO("rate", "GetDepth", 30, "1m")      // 30 times per minute
    exchange.IO("rate", "GetAccount", 100, "1h")   // 100 times per hour
    exchange.IO("rate", "CreateOrder", 500, "1d")  // 500 times per day
}
```

```python
def main():
    # Configurations for different time periods
    exchange.IO("rate", "GetTicker", 10, "1s")     # 10 times per second
    exchange.IO("rate", "GetDepth", 30, "1m")      # 30 times per minute
    exchange.IO("rate", "GetAccount", 100, "1h")   # 100 times per hour
    exchange.IO("rate", "CreateOrder", 500, "1d")  # 500 times per day
```

```rust
fn main() {
    // Configurations for different time periods
    let _ = exchange.IO(("rate", "GetTicker", 10, "1s"));     // 10 times per second
    let _ = exchange.IO(("rate", "GetDepth", 30, "1m"));      // 30 times per minute
    let _ = exchange.IO(("rate", "GetAccount", 100, "1h"));   // 100 times per hour
    let _ = exchange.IO(("rate", "CreateOrder", 500, "1d"));  // 500 times per day
}
```

```cpp
// C++ not supported yet
```

### Reset Time Point Configuration

Use ```@HHMM``` or ```@HHMMSS``` format to specify the daily reset time point, valid only in quota mode.

```javascript
function main() {
    // Reset quota daily at 08:15
    exchange.IO("quota", "GetTicker", 1000, "@0815")

    // Reset quota daily at 00:00
    exchange.IO("quota", "CreateOrder", 500, "@0000")

    // Reset quota daily at 23:59:59
    exchange.IO("quota", "*", 5000, "@235959")
}
```

```python
def main():
    # Reset quota daily at 08:15
    exchange.IO("quota", "GetTicker", 1000, "@0815")

    # Reset quota daily at 00:00
    exchange.IO("quota", "CreateOrder", 500, "@0000")

    # Reset quota daily at 23:59:59
    exchange.IO("quota", "*", 5000, "@235959")
```

```rust
fn main() {
    // Reset quota daily at 08:15
    let _ = exchange.IO(("quota", "GetTicker", 1000, "@0815"));

    // Reset quota daily at 00:00
    let _ = exchange.IO(("quota", "CreateOrder", 500, "@0000"));

    // Reset quota daily at 23:59:59
    let _ = exchange.IO(("quota", "*", 5000, "@235959"));
}
```

```cpp
// C++ not supported yet
```

## Behavior Modes

### Default Mode (returns null when limit exceeded)

```javascript
function main() {
    exchange.IO("rate", "GetTicker", 5, "1s")  // behavior parameter not specified

    for (var i = 0; i < 10; i++) {
        var ticker = exchange.GetTicker("BTC_USDT")
        if (ticker) {
            Log("Call", i+1, "Success:", ticker.Last)
        } else {
            Log("Call", i+1, "Failed: rate limit exceeded")
            // Optionally Sleep to wait, or skip this call
            Sleep(200)
        }
    }
}
```

```python
def main():
    exchange.IO("rate", "GetTicker", 5, "1s")  # behavior parameter not specified

    for i in range(10):
        ticker = exchange.GetTicker("BTC_USDT")
        if ticker:
            Log("Call", i+1, "Success:", ticker["Last"])
        else:
            Log("Call", i+1, "Failed: rate limit exceeded")
            # Optionally Sleep to wait, or skip this call
            Sleep(200)
```

```rust
fn main() {
    let _ = exchange.IO(("rate", "GetTicker", 5, "1s"));  // behavior parameter not specified

    for i in 0..10 {
        match exchange.GetTicker("BTC_USDT") {
            Ok(ticker) => Log!("Call", i + 1, "Success:", ticker.Last),
            Err(_) => {
                Log!("Call", i + 1, "Failed: rate limit exceeded");
                // Optionally Sleep to wait, or skip this call
                Sleep(200);
            }
        }
    }
}
```

```cpp
// C++ not supported yet
```

### delay mode (automatically wait when rate limit is exceeded)

```javascript
function main() {
    exchange.IO("rate", "GetTicker", 5, "1s", "delay")  // Specify the delay parameter

    // When the call exceeds the rate limit, it automatically waits to ensure every call succeeds
    for (var i = 0; i < 10; i++) {
        var ticker = exchange.GetTicker("BTC_USDT")
        Log("Call", i+1, "Success:", ticker.Last)  // ticker will not be null
    }
}
```

```python
def main():
    exchange.IO("rate", "GetTicker", 5, "1s", "delay")  # Specify the delay parameter

    # When the call exceeds the rate limit, it automatically waits to ensure every call succeeds
    for i in range(10):
        ticker = exchange.GetTicker("BTC_USDT")
        Log("Call", i+1, "Success:", ticker["Last"])  # ticker will not be None
```

```rust
fn main() {
    let _ = exchange.IO(("rate", "GetTicker", 5, "1s", "delay"));  // Specify the delay parameter

    // When the call exceeds the rate limit, it automatically waits to ensure every call succeeds
    for i in 0..10 {
        let ticker = exchange.GetTicker("BTC_USDT").unwrap();
        Log!("Call", i + 1, "Success:", ticker.Last);  // ticker will not return Err
    }
}
```

```cpp
// Not yet supported in C++
```

## List of Supported Functions

### Trading Functions
- ```CreateOrder```: Create an order
- ```CancelOrder```: Cancel an order
- ```Buy```: Buy (subject to CreateOrder restrictions)
- ```Sell```: Sell (subject to CreateOrder restrictions)
- ```CreateConditionOrder```: Create a conditional order
- ```CancelConditionOrder```: Cancel a conditional order

### Account Functions
- ```GetAccount```: Get account information
- ```GetAssets```: Get asset information
- ```GetPositions```: Get position information

### Order Functions
- ```GetOrder```: Get a single order
- ```GetOrders```: Get all orders
- ```GetHistoryOrders```: Get historical orders
- ```GetConditionOrder```: Get a single conditional order
- ```GetConditionOrders```: Get all conditional orders
- ```GetHistoryConditionOrders```: Get historical conditional orders

### Market Data Functions
- ```GetTicker```: Get a single ticker
- ```GetTickers```: Get multiple tickers
- ```GetDepth```: Get market depth
- ```GetRecords```: Get K-line (candlestick) data
- ```GetTrades```: Get the latest trade records

### Other Functions
- ```GetMarkets```: Get the list of markets
- ```GetFundings```: Get funding rates
- ```SetMarginLevel```: Set the leverage level
- ```Go```: Concurrent call (subject to the restrictions of the actual function being called)
- ```IO/api```: Custom API call (limited to exchange.IO("api", ...))

## Practical Application Scenarios


    ### Scenario 1: Preventing Exchange Rate Limit Triggers

```javascript
function main() {
    // Assume exchange limits: GetTicker 20 times per second, CreateOrder 5 times per second
    // Set the rate slightly below the exchange limit to reserve a safety margin
    exchange.IO("rate", "GetTicker", 15, "1s")
    exchange.IO("rate", "CreateOrder", 4, "1s")

    while (true) {
        var ticker = exchange.GetTicker("BTC_USDT")
        if (ticker && ticker.Last < 50000) {
            exchange.CreateOrder("BTC_USDT", "buy", ticker.Last, 0.001)
        }
        Sleep(100)
    }
}
```

```python
def main():
    # Assume exchange limits: GetTicker 20 times per second, CreateOrder 5 times per second
    # Set the rate slightly below the exchange limit to reserve a safety margin
    exchange.IO("rate", "GetTicker", 15, "1s")
    exchange.IO("rate", "CreateOrder", 4, "1s")

    while True:
        ticker = exchange.GetTicker("BTC_USDT")
        if ticker and ticker["Last"] < 50000:
            exchange.CreateOrder("BTC_USDT", "buy", ticker["Last"], 0.001)
        Sleep(100)
```

```rust
fn main() {
    // Assume exchange limits: GetTicker 20 times per second, CreateOrder 5 times per second
    // Set the rate slightly below the exchange limit to reserve a safety margin
    let _ = exchange.IO(("rate", "GetTicker", 15, "1s"));
    let _ = exchange.IO(("rate", "CreateOrder", 4, "1s"));

    loop {
        if let Ok(ticker) = exchange.GetTicker("BTC_USDT") {
            if ticker.Last < 50000.0 {
                let _ = exchange.CreateOrder("BTC_USDT", "buy", ticker.Last, 0.001);
            }
        }
        Sleep(100);
    }
}
```

```cpp
// C++ not supported yet
```

### Scenario 2: Unified Rate Limiting Across Multiple Exchange Objects

```javascript
function main() {
    // Set rate limiting for each exchange object
    for (var i = 0; i < exchanges.length; i++) {
        exchanges[i].IO("rate", "GetTicker", 10, "1s")
        exchanges[i].IO("rate", "CreateOrder", 2, "1s")
    }

    // Concurrently fetch tickers from multiple exchanges
    while (true) {
        for (var i = 0; i < exchanges.length; i++) {
            var ticker = exchanges[i].GetTicker("BTC_USDT")
            if (ticker) {
                Log(exchanges[i].GetName(), "Price:", ticker.Last)
            }
        }
        Sleep(1000)
    }
}
```

```python
def main():
    # Set rate limiting for each exchange object
    for i in range(len(exchanges)):
        exchanges[i].IO("rate", "GetTicker", 10, "1s")
        exchanges[i].IO("rate", "CreateOrder", 2, "1s")

    # Concurrently fetch tickers from multiple exchanges
    while True:
        for i in range(len(exchanges)):
            ticker = exchanges[i].GetTicker("BTC_USDT")
            if ticker:
                Log(exchanges[i].GetName(), "Price:", ticker["Last"])
        Sleep(1000)
```

```rust
fn main() {
    // Set rate limiting for each exchange object
    for e in exchanges.iter() {
        let _ = e.IO(("rate", "GetTicker", 10, "1s"));
        let _ = e.IO(("rate", "CreateOrder", 2, "1s"));
    }

    // Concurrently fetch tickers from multiple exchanges
    loop {
        for e in exchanges.iter() {
            if let Ok(ticker) = e.GetTicker("BTC_USDT") {
                Log!(e.GetName(), "Price:", ticker.Last);
            }
        }
        Sleep(1000);
    }
}
```

```cpp
// C++ is not supported yet
```

### Scenario 3: Intraday Quota Management

```javascript
function main() {
    // Maximum 1000 API calls per day, resets at 08:00 every morning
    exchange.IO("quota", "*", 1000, "@0800")

    var callCount = 0
    while (true) {
        var ticker = exchange.GetTicker("BTC_USDT")
        if (ticker) {
            callCount++
            Log("Call count:", callCount, "Price:", ticker.Last)
        } else {
            Log("Daily quota exceeded, waiting for tomorrow 08:00")
            Sleep(60000)  // Wait 1 minute before retrying
        }
        Sleep(10000)
    }
}
```

```python
def main():
    # Maximum 1000 API calls per day, resets at 08:00 every morning
    exchange.IO("quota", "*", 1000, "@0800")

    callCount = 0
    while True:
        ticker = exchange.GetTicker("BTC_USDT")
        if ticker:
            callCount += 1
            Log("Call count:", callCount, "Price:", ticker["Last"])
        else:
            Log("Daily quota exceeded, waiting for tomorrow 08:00")
            Sleep(60000)  # Wait 1 minute before retrying
        Sleep(10000)
```

```rust
fn main() {
    // Maximum 1000 API calls per day, resets at 08:00 every morning
    let _ = exchange.IO(("quota", "*", 1000, "@0800"));

    let mut callCount = 0;
    loop {
        match exchange.GetTicker("BTC_USDT") {
            Ok(ticker) => {
                callCount += 1;
                Log!("Call count:", callCount, "Price:", ticker.Last);
            }
            Err(_) => {
                Log!("Daily quota exceeded, waiting for tomorrow 08:00");
                Sleep(60000);  // Wait 1 minute before retrying
            }
        }
        Sleep(10000);
    }
}
```

```cpp
// C++ is not supported yet
```

### Scenario 4: Combined Rate Limiting Strategy

```javascript
function main() {
    // Combine multiple rate limiting strategies
    // 1. Rate limit market data APIs per second
    exchange.IO("rate", "GetTicker,GetDepth", 20, "1s")

    // 2. Rate limit trading APIs per second
    exchange.IO("rate", "CreateOrder,CancelOrder", 5, "1s")

    // 3. Rate limit account query APIs per minute
    exchange.IO("rate", "GetAccount,GetPositions", 30, "1m")

    // 4. Total daily quota for all APIs
    exchange.IO("quota", "*", 10000, "@0000")

    Log("Multi-level rate limiting configured")

    // Main strategy loop
    while (true) {
        // Fetch market data
        var ticker = exchange.GetTicker("BTC_USDT")
        var depth = exchange.GetDepth("BTC_USDT")

        // Query account info
        if (Date.now() % 60000 < 1000) {  // Query once per minute
            var account = exchange.GetAccount()
            Log("Account:", account)
        }

        // Trading logic
        if (ticker && ticker.Last < 50000) {
            exchange.CreateOrder("BTC_USDT", "buy", ticker.Last, 0.001)
        }

        Sleep(500)
    }
}
```

```python
import time
def main():
    # Combine multiple rate limiting strategies
    # 1. Rate limit market data APIs per second
    exchange.IO("rate", "GetTicker,GetDepth", 20, "1s")

    # 2. Rate limit trading APIs per second
    exchange.IO("rate", "CreateOrder,CancelOrder", 5, "1s")

    # 3. Rate limit account query APIs per minute
    exchange.IO("rate", "GetAccount,GetPositions", 30, "1m")

    # 4. Total daily quota for all APIs
    exchange.IO("quota", "*", 10000, "@0000")

    Log("Multi-level rate limiting configured")

    # Main strategy loop
    while True:
        # Fetch market data
        ticker = exchange.GetTicker("BTC_USDT")
        depth = exchange.GetDepth("BTC_USDT")

        # Query account info
        if int(time.time() * 1000) % 60000 < 1000:  # Query once per minute
            account = exchange.GetAccount()
            Log("Account:", account)

        # Trading logic
        if ticker and ticker["Last"] < 50000:
            exchange.CreateOrder("BTC_USDT", "buy", ticker["Last"], 0.001)

        Sleep(500)
```

```rust
fn main() {
    // Combine multiple rate limiting strategies
    // 1. Rate limit market data APIs per second
    let _ = exchange.IO(("rate", "GetTicker,GetDepth", 20, "1s"));

    // 2. Rate limit trading APIs per second
    let _ = exchange.IO(("rate", "CreateOrder,CancelOrder", 5, "1s"));

    // 3. Rate limit account query APIs per minute
    let _ = exchange.IO(("rate", "GetAccount,GetPositions", 30, "1m"));

    // 4. Total daily quota for all APIs
    let _ = exchange.IO(("quota", "*", 10000, "@0000"));

    Log!("Multi-level rate limiting configured");

    // Main strategy loop
    loop {
        // Fetch market data
        let ticker = exchange.GetTicker("BTC_USDT");
        let depth = exchange.GetDepth("BTC_USDT");

        // Query account info
        if UnixNano() / 1000000 % 60000 < 1000 {  // Query once per minute
            let account = exchange.GetAccount();
            Log!("Account:", account);
        }

        // Trading logic
        if let Ok(t) = ticker {
            if t.Last < 50000.0 {
                let _ = exchange.CreateOrder("BTC_USDT", "buy", t.Last, 0.001);
            }
        }

        Sleep(500);
    }
}
```

```cpp
// C++ not supported yet
```

## Notes

### 1. Time Window Alignment in quota Mode

The quota mode strictly aligns to time windows:

- ```"1s"```: aligns to whole seconds (e.g., 12:00:00, 12:00:01, 12:00:02……)

- ```"1m"```: aligns to whole minutes (e.g., 12:00:00, 12:01:00, 12:02:00……)

- ```"1h"```: aligns to whole hours (e.g., 12:00:00, 13:00:00, 14:00:00……)

This means that even if counting starts at 12:00:00.500, the current time window will still reset at 12:00:01.000.

```javascript
function main() {
    // quota mode: strictly aligns to whole seconds
    exchange.IO("quota", "GetTicker", 3, "1s")

    // Assume the current time is 12:00:00.500
    exchange.GetTicker("BTC_USDT")  // 1st call, success
    exchange.GetTicker("BTC_USDT")  // 2nd call, success
    exchange.GetTicker("BTC_USDT")  // 3rd call, success
    exchange.GetTicker("BTC_USDT")  // 4th call, failed (limit exceeded)

    Sleep(500)  // Wait 500ms; the time is now 12:00:01.000

    // Window has been reset
    exchange.GetTicker("BTC_USDT")  // 1st call in the new window, success
}
```

```python
def main():
    # quota mode: strictly aligns to whole seconds
    exchange.IO("quota", "GetTicker", 3, "1s")

    # Assume the current time is 12:00:00.500
    exchange.GetTicker("BTC_USDT")  # 1st call, success
    exchange.GetTicker("BTC_USDT")  # 2nd call, success
    exchange.GetTicker("BTC_USDT")  # 3rd call, success
    exchange.GetTicker("BTC_USDT")  # 4th call, failed (limit exceeded)

    Sleep(500)  # Wait 500ms; the time is now 12:00:01.000

    # Window has been reset
    exchange.GetTicker("BTC_USDT")  # 1st call in the new window, success
```

```rust
fn main() {
    // quota mode: strictly aligns to whole seconds
    let _ = exchange.IO(("quota", "GetTicker", 3, "1s"));

    // Assume the current time is 12:00:00.500
    let _ = exchange.GetTicker("BTC_USDT");  // 1st call, success
    let _ = exchange.GetTicker("BTC_USDT");  // 2nd call, success
    let _ = exchange.GetTicker("BTC_USDT");  // 3rd call, success
    let _ = exchange.GetTicker("BTC_USDT");  // 4th call, failed (limit exceeded)

    Sleep(500);  // Wait 500ms; the time is now 12:00:01.000

    // Window has been reset
    let _ = exchange.GetTicker("BTC_USDT");  // 1st call in the new window, success
}
```

```cpp
// C++ is not supported yet
```

### 2. Time discrepancy in delay mode

When using the ```"delay"``` parameter, the actual API call time may not match the time recorded in the log. This is because the program enters a waiting state when rate limiting is triggered, while the log records the time after the wait ends.

```javascript
function main() {
    exchange.IO("rate", "GetTicker", 2, "1s", "delay")

    Log(_D(), "Call 1")  // 12:00:00.000
    exchange.GetTicker("BTC_USDT")

    Log(_D(), "Call 2")  // 12:00:00.100
    exchange.GetTicker("BTC_USDT")

    Log(_D(), "Call 3")  // 12:00:00.200, but it will actually wait until 12:00:01.000
    exchange.GetTicker("BTC_USDT")  // Triggers rate limiting, waits automatically

    Log(_D(), "Call 3 completed")  // Log shows 12:00:01.000+
    // It appears that 3 calls were made within one second, but the 3rd call was actually executed in a new window
}
```

```python
def main():
    exchange.IO("rate", "GetTicker", 2, "1s", "delay")

    Log(_D(), "Call 1")  # 12:00:00.000
    exchange.GetTicker("BTC_USDT")

    Log(_D(), "Call 2")  # 12:00:00.100
    exchange.GetTicker("BTC_USDT")

    Log(_D(), "Call 3")  # 12:00:00.200, but it will actually wait until 12:00:01.000
    exchange.GetTicker("BTC_USDT")  # Triggers rate limiting, waits automatically

    Log(_D(), "Call 3 completed")  # Log shows 12:00:01.000+
    # It appears that 3 calls were made within one second, but the 3rd call was actually executed in a new window
```

```rust
fn main() {
    let _ = exchange.IO(("rate", "GetTicker", 2, "1s", "delay"));

    Log!(_D(None), "Call 1");  // 12:00:00.000
    let _ = exchange.GetTicker("BTC_USDT");

    Log!(_D(None), "Call 2");  // 12:00:00.100
    let _ = exchange.GetTicker("BTC_USDT");

    Log!(_D(None), "Call 3");  // 12:00:00.200, but it will actually wait until 12:00:01.000
    let _ = exchange.GetTicker("BTC_USDT");  // Triggers rate limiting, waits automatically

    Log!(_D(None), "Call 3 completed");  // Log shows 12:00:01.000+
    // It appears that 3 calls were made within one second, but the 3rd call was actually executed in a new window
}
```

```cpp
// C++ is not supported yet
```

### 3. Rate limiting for the Buy/Sell functions

Both the ```Buy``` and ```Sell``` functions call ```CreateOrder``` under the hood, so their rate-limiting rules follow the ```CreateOrder``` settings.

```javascript
function main() {
    // Set CreateOrder rate limiting
    exchange.IO("rate", "CreateOrder", 5, "1s")

    // Buy and Sell are also subject to this limit
    for (var i = 0; i < 10; i++) {
        if (i % 2 == 0) {
            exchange.Buy(50000, 0.001)   // Subject to the CreateOrder limit
        } else {
            exchange.Sell(51000, 0.001)  // Subject to the CreateOrder limit
        }
    }
}
```

```python
def main():
    # Set CreateOrder rate limiting
    exchange.IO("rate", "CreateOrder", 5, "1s")

    # Buy and Sell are also subject to this limit
    for i in range(10):
        if i % 2 == 0:
            exchange.Buy(50000, 0.001)   # Subject to the CreateOrder limit
        else:
            exchange.Sell(51000, 0.001)  # Subject to the CreateOrder limit
```

```rust
fn main() {
    // Set CreateOrder rate limiting
    let _ = exchange.IO(("rate", "CreateOrder", 5, "1s"));

    // Buy and Sell are also subject to this limit
    for i in 0..10 {
        if i % 2 == 0 {
            let _ = exchange.Buy(50000, 0.001);   // Subject to the CreateOrder limit
        } else {
            let _ = exchange.Sell(51000, 0.001);  // Subject to the CreateOrder limit
        }
    }
}
```

```cpp
// C++ is not supported yet
```

### 4. Rate Limiting for Go Functions

    Rate limiting for the ```Go``` function depends on the actual function being called concurrently.

```javascript
function main() {
    // Rate limit GetTicker
    exchange.IO("rate", "GetTicker", 5, "1s")

    // Concurrent calls to GetTicker are rate limited
    var tasks = []
    for (var i = 0; i < 10; i++) {
        tasks.push(exchange.Go("GetTicker", "BTC_USDT"))
    }

    for (var i = 0; i < tasks.length; i++) {
        var ticker = tasks[i].wait()
        Log("Task", i, ticker ? "Success" : "Rate limited")
    }
}
```

```python
def main():
    # Rate limit GetTicker
    exchange.IO("rate", "GetTicker", 5, "1s")

    # Concurrent calls to GetTicker are rate limited
    tasks = []
    for i in range(10):
        tasks.append(exchange.Go("GetTicker", "BTC_USDT"))

    for i in range(len(tasks)):
        ticker = tasks[i].wait()
        Log("Task", i, "Success" if ticker else "Rate limited")
```

```rust
fn main() {
    // Rate limit GetTicker
    let _ = exchange.IO(("rate", "GetTicker", 5, "1s"));

    // Concurrent calls to GetTicker are rate limited
    // In Rust, exchange.Go uses a typed syntax with the Go::GetTicker token
    let mut tasks = Vec::new();
    for _i in 0..10 {
        tasks.push(exchange.Go(Go::GetTicker, ("BTC_USDT",)));
    }

    for (i, task) in tasks.iter().enumerate() {
        match task.wait(0) {
            Ok(_) => Log!("Task", i, "Success"),
            Err(_) => Log!("Task", i, "Rate limited"),
        }
    }
}
```

```cpp
// C++ is not supported yet
```

### 5. Rate Limiting for IO/api

    ```IO/api``` rate limiting only takes effect on ```exchange.IO("api", ...)``` calls, and does not affect other ```exchange.IO```
    functions.

```javascript
function main() {
    // Limit exchange.IO("api", ...) calls
    exchange.IO("rate", "IO/api", 10, "1s")

    // Rate limited
    for (var i = 0; i < 15; i++) {
        var ret = exchange.IO("api", "GET", "/api/v5/account/balance", "")
        Log("API call", i, ret ? "Success" : "Rate limited")
    }

    // Not rate limited
    exchange.IO("currency", "LTC_USDT")  // Switch trading pair, not rate limited
    exchange.IO("rate", "GetDepth", 5, "1s")  // Set other rate limits, not rate limited
}
```

```python
def main():
    # Limit exchange.IO("api", ...) calls
    exchange.IO("rate", "IO/api", 10, "1s")

    # Rate limited
    for i in range(15):
        ret = exchange.IO("api", "GET", "/api/v5/account/balance", "")
        Log("API call", i, "Success" if ret else "Rate limited")

    # Not rate limited
    exchange.IO("currency", "LTC_USDT")  # Switch trading pair, not rate limited
    exchange.IO("rate", "GetDepth", 5, "1s")  # Set other rate limits, not rate limited
```

```rust
fn main() {
    // Limit exchange.IO("api", ...) calls
    let _ = exchange.IO(("rate", "IO/api", 10, "1s"));

    // Rate limited
    for i in 0..15 {
        match exchange.IO(("api", "GET", "/api/v5/account/balance", "")) {
            Ok(_) => Log!("API call", i, "Success"),
            Err(_) => Log!("API call", i, "Rate limited"),
        }
    }

    // Not rate limited
    let _ = exchange.IO(("currency", "LTC_USDT"));  // Switch trading pair, not rate limited
    let _ = exchange.IO(("rate", "GetDepth", 5, "1s"));  // Set other rate limits, not rate limited
}
```

```cpp
// C++ is not supported yet
```

## Best Practices

    1. **Set according to exchange limits**: Please refer to the exchange's API documentation and set the rate limit value slightly below the exchange's limit.

    2. **Leave a safety margin**: Do not set the rate limit value to the maximum allowed by the exchange; it is recommended to set it to 70%-80% of the maximum.

    3. **Tiered rate limiting**: Set different rate limit values for different types of APIs, and reserve a larger margin for important APIs.

    4. **Use delay mode for critical calls**: For API calls that must succeed, use ```"delay"``` mode to ensure the call succeeds.

    5. **Monitor API usage**: Regularly check the strategy's API call frequency and continuously optimize the call logic.

    6. **Avoid excessive calls**: Design the strategy logic reasonably to avoid unnecessary API calls.

    7. **Test rate limit configuration**: Before running live, test whether the rate limit configuration is reasonable in a simulated environment.

See also: `exchange.IO`, `exchange.Go`, `exchange.Buy`, `exchange.Sell`

### Communication Between Live Trading Strategies

## Overview

  The inter-strategy communication feature allows different live trading strategies to share data and synchronize state with one another. Through a channel mechanism, one live strategy can broadcast its own state data to other live strategies, enabling data communication across strategies, across managers, and across servers.

  ### Core Concepts

  - **Channel**: Every live strategy owns an independent channel, and the channel ID is the live strategy ID

  - **Broadcaster**: A live strategy that publishes data on a channel using the ```SetChannelData()``` function

  - **Subscriber**: A live strategy that subscribes to another live strategy's channel data using the ```GetChannelData()``` function

  - **State Overwrite**: A channel retains only the latest state; new data overwrites old data rather than using a message queue mechanism

  ### Key Features

  - **Non-blocking Communication**: All function calls are non-blocking and will not affect the strategy's main workflow

  - **Cross-platform Support**: Supports data transmission across strategies, across managers, and across servers

  - **Multi-channel Subscription**: A single live strategy can subscribe to the channels of multiple different live strategies simultaneously

  - **Flexible Data Format**: Supports any JSON-serializable data structure

  ### Use Cases

  - **Master-slave Strategy Coordination**: The master strategy analyzes the market and broadcasts signals, while slave strategies receive the signals and execute trades

  - **Multi-account Synchronization**: Synchronize trading signals and position information across multiple trading accounts

  - **Strategy Monitoring**: Broadcast strategy running status, which a monitoring live strategy subscribes to for display or alerting

  - **Data Sharing**: Share results such as market analysis and indicator calculations to avoid redundant computation

  ## Basic Usage

### Broadcaster Example - Publishing Market Data

```javascript
function main() {
    var updateId = 0
    var robotId = _G()  // Get the current live bot ID

    while(true) {
        // Fetch market data
        var ticker = exchange.GetTicker("BTC_USDT")
        if (!ticker) {
            Sleep(5000)
            continue
        }

        // Prepare the channel state data
        var channelState = {
            robotId: robotId,
            updateId: ++updateId,
            timestamp: Date.now(),
            symbol: "BTC_USDT",
            lastPrice: ticker.Last,
            volume: ticker.Volume,
            high: ticker.High,
            low: ticker.Low
        }

        // Publish the latest state on the channel (overwrites the old state)
        SetChannelData(channelState)

        // Display the current channel state
        LogStatus("Channel Broadcaster [Bot ID: " + robotId + "]\n" +
                  "Update ID: #" + channelState.updateId + "\n" +
                  "Time: " + _D(channelState.timestamp) + "\n" +
                  "Symbol: " + channelState.symbol + "\n" +
                  "Last Price: $" + channelState.lastPrice.toFixed(2))

        Sleep(60000)  // Update the channel state once per minute
    }
}
```

```python
def main():
    updateId = 0
    robotId = _G()  # Get the current live bot ID

    while True:
        # Fetch market data
        ticker = exchange.GetTicker("BTC_USDT")
        if not ticker:
            Sleep(5000)
            continue

        # Prepare the channel state data
        channelState = {
            "robotId": robotId,
            "updateId": updateId + 1,
            "timestamp": time.time() * 1000,
            "symbol": "BTC_USDT",
            "lastPrice": ticker["Last"],
            "volume": ticker["Volume"],
            "high": ticker["High"],
            "low": ticker["Low"]
        }
        updateId += 1

        # Publish the latest state on the channel (overwrites the old state)
        SetChannelData(channelState)

        # Display the current channel state
        LogStatus("Channel Broadcaster [Bot ID: {}]\n".format(robotId) +
                  "Update ID: #{}\n".format(channelState["updateId"]) +
                  "Time: {}\n".format(_D(channelState["timestamp"])) +
                  "Last Price: ${:.2f}".format(channelState["lastPrice"]))

        Sleep(60000)  # Update the channel state once per minute
```

```rust
fn main() {
    let mut updateId = 0;
    let robotId = _G!();  // Get the current live bot ID

    loop {
        // Fetch market data
        let ticker = match exchange.GetTicker("BTC_USDT") {
            Ok(t) => t,
            Err(_) => {
                Sleep(5000);
                continue;
            }
        };

        // Prepare the channel state data
        // Rust's SetChannelData only accepts a string argument, so use format! to build the JSON text
        updateId += 1;
        let timestamp = Unix() * 1000;
        let channelState = format!(
            r#"{{"robotId": {}, "updateId": {}, "timestamp": {}, "symbol": "BTC_USDT", "lastPrice": {}, "volume": {}, "high": {}, "low": {}}}"#,
            robotId, updateId, timestamp, ticker.Last, ticker.Volume, ticker.High, ticker.Low
        );

        // Publish the latest state on the channel (overwrites the old state)
        SetChannelData(&channelState);

        // Display the current channel state
        LogStatus!(format!(
            "Channel Broadcaster [Bot ID: {}]\nUpdate ID: #{}\nTime: {}\nSymbol: BTC_USDT\nLast Price: ${:.2}",
            robotId, updateId, _D(timestamp), ticker.Last
        ));

        Sleep(60000);  // Update the channel state once per minute
    }
}
```

### Subscriber Example - Subscribe to Multiple Channels

```javascript
function main() {
    // Get the IDs of the two channels to subscribe to (please modify according to your actual situation)
    var channelId1 = "632799"  // Live trading ID of channel 1
    var channelId2 = "632800"  // Live trading ID of channel 2

    while(true) {
        // Get the current state of channel 1
        var state1 = GetChannelData(channelId1)

        // Get the current state of channel 2
        var state2 = GetChannelData(channelId2)

        // Build the status display message
        var statusMsg = "Channel Subscriber - Current Subscription Status\n\n"

        // Display the status of channel 1
        statusMsg += "═══ Channel1 [" + channelId1 + "] ═══\n"
        if (state1 !== null) {
            statusMsg += "Update ID: #" + state1.updateId + "\n"
            statusMsg += "Time: " + _D(state1.timestamp) + "\n"
            statusMsg += "Symbol: " + state1.symbol + "\n"
            statusMsg += "Last Price: $" + state1.lastPrice.toFixed(2) + "\n"
        } else {
            statusMsg += "Status: Waiting... (first call returns null)\n"
        }

        statusMsg += "\n"

        // Display the status of channel 2
        statusMsg += "═══ Channel2 [" + channelId2 + "] ═══\n"
        if (state2 !== null) {
            statusMsg += "Update ID: #" + state2.updateId + "\n"
            statusMsg += "Time: " + _D(state2.timestamp) + "\n"
            statusMsg += "Last Price: $" + state2.lastPrice.toFixed(2) + "\n"
        } else {
            statusMsg += "Status: Waiting... (first call returns null)\n"
        }

        LogStatus(statusMsg)

        Sleep(5000)  // Fetch channel data every 5 seconds
    }
}
```

```python
def main():
    # Get the IDs of the two channels to subscribe to (please modify according to your actual situation)
    channelId1 = "632799"  # Live trading ID of channel 1
    channelId2 = "632800"  # Live trading ID of channel 2

    while True:
        # Get the current state of channel 1
        state1 = GetChannelData(channelId1)

        # Get the current state of channel 2
        state2 = GetChannelData(channelId2)

        # Build the status display message
        statusMsg = "Channel Subscriber - Current Subscription Status\n\n"

        # Display the status of channel 1
        statusMsg += "═══ Channel1 [{}] ═══\n".format(channelId1)
        if state1 is not None:
            statusMsg += "Update ID: #{}\n".format(state1["updateId"])
            statusMsg += "Time: {}\n".format(_D(state1["timestamp"]))
            statusMsg += "Last Price: ${:.2f}\n".format(state1["lastPrice"])
        else:
            statusMsg += "Status: Waiting... (first call returns None)\n"

        statusMsg += "\n"

        # Display the status of channel 2
        statusMsg += "═══ Channel2 [{}] ═══\n".format(channelId2)
        if state2 is not None:
            statusMsg += "Update ID: #{}\n".format(state2["updateId"])
            statusMsg += "Time: {}\n".format(_D(state2["timestamp"]))
            statusMsg += "Last Price: ${:.2f}\n".format(state2["lastPrice"])
        else:
            statusMsg += "Status: Waiting... (first call returns None)\n"

        LogStatus(statusMsg)

        Sleep(5000)  # Fetch channel data every 5 seconds
```

```rust
fn main() {
    // Rust's GetChannelData() function does not accept a channel ID parameter and cannot subscribe to channels of other live trading bots,
    // it can only read the latest data of the current live trading bot's own channel (i.e. the data this bot publishes via SetChannelData())
    loop {
        // Read the current state of this bot's channel
        let state = GetChannelData();

        // Build the status display message
        let mut statusMsg = String::from("Channel Subscriber - Current Subscription Status\n\n");

        if !state.is_null() {
            statusMsg += &format!("Update ID: #{}\n", state["updateId"].as_f64().unwrap_or(0.0));
            statusMsg += &format!("Time: {}\n", _D(state["timestamp"].as_i64().unwrap_or(0)));
            statusMsg += &format!("Symbol: {}\n", state["symbol"].as_str().unwrap_or(""));
            statusMsg += &format!("Last Price: ${:.2}\n", state["lastPrice"].as_f64().unwrap_or(0.0));
        } else {
            statusMsg += "Status: Waiting... (first call returns null)\n";
        }

        LogStatus!(statusMsg);

        Sleep(5000);  // Read channel data every 5 seconds
    }
}
```

## Practical Application Scenarios

### Scenario 1: Master-Slave Strategy Collaborative Trading

**Master Strategy (Signal Broadcasting End)**

```javascript
function main() {
    var robotId = _G()
    Log("Main strategy started, Bot ID:", robotId)

    while(true) {
        // Analyze market conditions and generate trading signals
        var records = exchange.GetRecords("BTC_USDT")
        if (!records || records.length < 20) {
            Sleep(5000)
            continue
        }

        // Simple moving average crossover strategy
        var ma5 = TA.MA(records, 5)
        var ma20 = TA.MA(records, 20)
        var signal = "HOLD"

        if (ma5[ma5.length-1] > ma20[ma20.length-1] &&
            ma5[ma5.length-2] <= ma20[ma20.length-2]) {
            signal = "BUY"
        } else if (ma5[ma5.length-1] < ma20[ma20.length-1] &&
                   ma5[ma5.length-2] >= ma20[ma20.length-2]) {
            signal = "SELL"
        }

        // Broadcast the trading signal
        var signalData = {
            timestamp: Date.now(),
            symbol: "BTC_USDT",
            signal: signal,
            price: records[records.length-1].Close,
            ma5: ma5[ma5.length-1],
            ma20: ma20[ma20.length-1]
        }

        SetChannelData(signalData)
        LogStatus("Main Strategy - Signal Broadcast\n" +
                  "Signal: " + signal + "\n" +
                  "Price: $" + signalData.price.toFixed(2) + "\n" +
                  "MA5: " + signalData.ma5.toFixed(2) + "\n" +
                  "MA20: " + signalData.ma20.toFixed(2))

        Sleep(60000)
    }
}
```

```python
def main():
    robotId = _G()
    Log("Main strategy started, Bot ID:", robotId)

    while True:
        # Analyze market conditions and generate trading signals
        records = exchange.GetRecords("BTC_USDT")
        if not records or len(records) < 20:
            Sleep(5000)
            continue

        # Simple moving average crossover strategy
        ma5 = TA.MA(records, 5)
        ma20 = TA.MA(records, 20)
        signal = "HOLD"

        if ma5[-1] > ma20[-1] and ma5[-2] <= ma20[-2]:
            signal = "BUY"
        elif ma5[-1] < ma20[-1] and ma5[-2] >= ma20[-2]:
            signal = "SELL"

        # Broadcast the trading signal
        signalData = {
            "timestamp": time.time() * 1000,
            "symbol": "BTC_USDT",
            "signal": signal,
            "price": records[-1]["Close"],
            "ma5": ma5[-1],
            "ma20": ma20[-1]
        }

        SetChannelData(signalData)
        LogStatus("Main Strategy - Signal Broadcast\n" +
                  "Signal: {}\n".format(signal) +
                  "Price: ${:.2f}\n".format(signalData["price"]) +
                  "MA5: {:.2f}\n".format(signalData["ma5"]) +
                  "MA20: {:.2f}".format(signalData["ma20"]))

        Sleep(60000)
```

```rust
fn main() {
    let robotId = _G!();
    Log!("Main strategy started, Bot ID:", robotId);

    loop {
        // Analyze market conditions and generate trading signals
        let records = match exchange.GetRecords("BTC_USDT", None, None) {
            Ok(r) if r.len() >= 20 => r,
            _ => {
                Sleep(5000);
                continue;
            }
        };

        // Simple moving average crossover strategy
        let ma5 = TA.MA(&records, 5);
        let ma20 = TA.MA(&records, 20);
        let n = ma5.len();
        let mut signal = "HOLD";

        if ma5[n - 1] > ma20[n - 1] && ma5[n - 2] <= ma20[n - 2] {
            signal = "BUY";
        } else if ma5[n - 1] < ma20[n - 1] && ma5[n - 2] >= ma20[n - 2] {
            signal = "SELL";
        }

        // Broadcast the trading signal
        // Rust's SetChannelData only accepts a string argument, so use format! to build the JSON text
        let price = records[records.len() - 1].Close;
        let signalData = format!(
            r#"{{"timestamp": {}, "symbol": "BTC_USDT", "signal": "{}", "price": {}, "ma5": {}, "ma20": {}}}"#,
            Unix() * 1000, signal, price, ma5[n - 1], ma20[n - 1]
        );

        SetChannelData(&signalData);
        LogStatus!(format!(
            "Main Strategy - Signal Broadcast\nSignal: {}\nPrice: ${:.2}\nMA5: {:.2}\nMA20: {:.2}",
            signal, price, ma5[n - 1], ma20[n - 1]
        ));

        Sleep(60000);
    }
}
```

## Real-World Application Scenarios


### Scenario 1: Master-Follower Strategy Coordinated Trading


**Follower Strategy (Signal Receiving and Execution End)**

```javascript
function main() {
    var masterRobotId = "632799"  // Live trading ID of the master strategy
    var lastSignal = null

    Log("Follower strategy started, subscribing to main strategy:", masterRobotId)

    while(true) {
        // Get the signal from the master strategy
        var signalData = GetChannelData(masterRobotId)

        if (signalData === null) {
            LogStatus("Waiting for main strategy signal...")
            Sleep(5000)
            continue
        }

        // Check whether there is a new signal
        if (lastSignal !== signalData.signal) {
            Log("Received new signal:", signalData.signal, "Price:", signalData.price)

            // Execute the trade
            if (signalData.signal === "BUY") {
                var ticker = exchange.GetTicker(signalData.symbol)
                if (ticker) {
                    exchange.Buy(ticker.Last, 0.01)
                    Log("Executing buy, Price:", ticker.Last)
                }
            } else if (signalData.signal === "SELL") {
                var ticker = exchange.GetTicker(signalData.symbol)
                if (ticker) {
                    exchange.Sell(ticker.Last, 0.01)
                    Log("Executing sell, Price:", ticker.Last)
                }
            }

            lastSignal = signalData.signal
        }

        LogStatus("Follower Strategy - Following Main Strategy\n" +
                  "Current Signal: " + signalData.signal + "\n" +
                  "Signal Price: $" + signalData.price.toFixed(2) + "\n" +
                  "Signal Time: " + _D(signalData.timestamp))

        Sleep(5000)
    }
}
```

```python
def main():
    masterRobotId = "632799"  # Live trading ID of the master strategy
    lastSignal = None

    Log("Follower strategy started, subscribing to main strategy:", masterRobotId)

    while True:
        # Get the signal from the master strategy
        signalData = GetChannelData(masterRobotId)

        if signalData is None:
            LogStatus("Waiting for main strategy signal...")
            Sleep(5000)
            continue

        # Check whether there is a new signal
        if lastSignal != signalData["signal"]:
            Log("Received new signal:", signalData["signal"], "Price:", signalData["price"])

            # Execute the trade
            if signalData["signal"] == "BUY":
                ticker = exchange.GetTicker(signalData["symbol"])
                if ticker:
                    exchange.Buy(ticker["Last"], 0.01)
                    Log("Executing buy, Price:", ticker["Last"])
            elif signalData["signal"] == "SELL":
                ticker = exchange.GetTicker(signalData["symbol"])
                if ticker:
                    exchange.Sell(ticker["Last"], 0.01)
                    Log("Executing sell, Price:", ticker["Last"])

            lastSignal = signalData["signal"]

        LogStatus("Follower Strategy - Following Main Strategy\n" +
                  "Current Signal: {}\n".format(signalData["signal"]) +
                  "Signal Price: ${:.2f}\n".format(signalData["price"]) +
                  "Signal Time: {}".format(_D(signalData["timestamp"])))

        Sleep(5000)
```

```rust
fn main() {
    // Rust's GetChannelData() function does not accept a channel ID parameter, so it cannot subscribe to the master strategy's live trading channel,
    // it can only read the latest data from the current live trading instance's own channel (this demonstrates equivalent signal-processing logic)
    let mut lastSignal = String::new();

    Log!("Follower strategy started");

    loop {
        // Get the signal from the channel
        let signalData = GetChannelData();

        if signalData.is_null() {
            LogStatus!("Waiting for signal...");
            Sleep(5000);
            continue;
        }

        let signal = signalData["signal"].as_str().unwrap_or("").to_string();
        let price = signalData["price"].as_f64().unwrap_or(0.0);
        let symbol = signalData["symbol"].as_str().unwrap_or("BTC_USDT").to_string();

        // Check whether there is a new signal
        if lastSignal != signal {
            Log!("Received new signal:", &signal, "Price:", price);

            // Execute the trade
            if signal == "BUY" {
                if let Ok(ticker) = exchange.GetTicker(symbol.as_str()) {
                    let _ = exchange.Buy(ticker.Last, 0.01);
                    Log!("Executing buy, Price:", ticker.Last);
                }
            } else if signal == "SELL" {
                if let Ok(ticker) = exchange.GetTicker(symbol.as_str()) {
                    let _ = exchange.Sell(ticker.Last, 0.01);
                    Log!("Executing sell, Price:", ticker.Last);
                }
            }

            lastSignal = signal.clone();
        }

        LogStatus!(format!(
            "Follower Strategy\nCurrent Signal: {}\nSignal Price: ${:.2}\nSignal Time: {}",
            signal, price, _D(signalData["timestamp"].as_i64().unwrap_or(0))
        ));

        Sleep(5000);
    }
}
```

### Scenario 2: Multi-Strategy Status Monitoring

    **Monitoring Strategies**

```javascript
function main() {
    // List of live-trading bot IDs to monitor
    var monitorList = ["632799", "632800", "632801"]

    while(true) {
        var table = {
            type: "table",
            title: "Strategy Running Status Monitor",
            cols: ["Bot ID", "Status", "Last Update", "Symbol", "Current Price", "PnL"],
            rows: []
        }

        for (var i = 0; i < monitorList.length; i++) {
            var robotId = monitorList[i]
            var data = GetChannelData(robotId)

            if (data !== null) {
                var updateTime = _D(data.timestamp)
                var timeDiff = Date.now() - data.timestamp
                var status = timeDiff < 120000 ? "Running" : "Error"

                table.rows.push([
                    robotId,
                    status,
                    updateTime,
                    data.symbol || "-",
                    data.lastPrice ? "$" + data.lastPrice.toFixed(2) : "-",
                    data.profit ? data.profit.toFixed(2) + "%" : "-"
                ])
            } else {
                table.rows.push([
                    robotId,
                    "Waiting for Data",
                    "-",
                    "-",
                    "-",
                    "-"
                ])
            }
        }

        LogStatus("`" + JSON.stringify(table) + "`")
        Sleep(10000)
    }
}
```

```python
def main():
    # List of live-trading bot IDs to monitor
    monitorList = ["632799", "632800", "632801"]

    while True:
        table = {
            "type": "table",
            "title": "Strategy Running Status Monitor",
            "cols": ["Bot ID", "Status", "Last Update", "Symbol", "Current Price", "PnL"],
            "rows": []
        }

        for robotId in monitorList:
            data = GetChannelData(robotId)

            if data is not None:
                updateTime = _D(data["timestamp"])
                timeDiff = time.time() * 1000 - data["timestamp"]
                status = "Running" if timeDiff < 120000 else "Error"

                table["rows"].append([
                    robotId,
                    status,
                    updateTime,
                    data.get("symbol", "-"),
                    "${:.2f}".format(data["lastPrice"]) if "lastPrice" in data else "-",
                    "{:.2f}%".format(data["profit"]) if "profit" in data else "-"
                ])
            else:
                table["rows"].append([
                    robotId,
                    "Waiting for Data",
                    "-",
                    "-",
                    "-",
                    "-"
                ])

        LogStatus("`" + json.dumps(table) + "`")
        Sleep(10000)
```

```rust
fn main() {
    // Rust's GetChannelData() function does not accept a channel ID parameter, so it cannot subscribe to other bots' channels for monitoring;
    // it can only read the latest data from the current bot's own channel (this demonstrates the equivalent status-table display logic)
    loop {
        let data = GetChannelData();

        let row = if !data.is_null() {
            let timestamp = data["timestamp"].as_i64().unwrap_or(0);
            let updateTime = _D(timestamp);
            let timeDiff = Unix() * 1000 - timestamp;
            let status = if timeDiff < 120000 { "Running" } else { "Error" };
            format!(
                r#"["{}", "{}", "{}", "{}"]"#,
                _G!(), status, updateTime,
                data["symbol"].as_str().unwrap_or("-")
            )
        } else {
            format!(r#"["{}", "Waiting for Data", "-", "-"]"#, _G!())
        };

        // Build the table JSON text (Rust has no JSON serialization, so use format! to concatenate)
        let table = format!(
            r#"{{"type": "table", "title": "Strategy Running Status Monitor", "cols": ["Bot ID", "Status", "Last Update", "Symbol"], "rows": [{}]}}"#,
            row
        );

        LogStatus!(format!("`{}`", table));
        Sleep(10000);
    }
}
```

## API Function Reference


    ### SetChannelData(data)


    **Function**: Publishes the latest status data to a channel


    **Parameters**:

    - data: The data to publish, which can be any JSON-serializable data structure


    **Return Value**: None


    **Characteristics**:

    - Non-blocking call

    - Overwrites the previous data; does not accumulate historical records

    - Automatically uses the current live trading ID as the channel ID


    **Data Size Limit**:

    - Must not exceed 1024 bytes after JSON serialization

    - It is recommended to transmit only the necessary status information


    **Detailed Documentation**: [SetChannelData](/syntax-guide#fun_setchanneldata)


    ### GetChannelData(robotId)


    **Function**: Subscribes to the channel data of a specified live trading bot


    **Parameters**:

    - robotId: The live trading ID to subscribe to (string or number)


    **Return Value**:

    - Returns null on the first call; a retry is required

    - Returns the latest data of the channel upon success


    **Characteristics**:

    - Non-blocking call

    - Supports subscribing to multiple channels

    - Supports subscribing to its own channel


    **Detailed Documentation**: [GetChannelData](/syntax-guide#fun_getchanneldata)


    ## Notes


    - **First call returns null**: The ```GetChannelData()``` function returns ```null``` on its first call. This is normal behavior, as it needs to wait for data synchronization to complete. It is recommended to add a null check in your code.


    - **Data overwrite mechanism**: Only the latest status is stored on the channel. Calling ```SetChannelData()``` overwrites the previous data. If you need to preserve historical data, you should record it yourself on the subscriber side.


    - **Non-blocking characteristic**: All channel communication functions are non-blocking calls and will not affect the execution of the strategy's main flow. However, this also means the real-time delivery of data cannot be guaranteed.


    - **Data size limit**: The data passed to SetChannelData must not exceed 1024 bytes after JSON serialization. You should transmit only the necessary status information, such as key data like trading signals, prices, and positions, and avoid transmitting complete candlestick (K-line) arrays or large amounts of historical data.


    - **Live trading environment limitation**: The channel communication feature is primarily intended for the live trading environment and may be restricted or unavailable in the backtesting system.


    - **Obtaining the live trading ID**: You can obtain the current live trading ID via the ```_G()``` function, or view it in the platform interface.


    - **Security considerations**: Channel data may be subscribed to by other live trading bots with the appropriate permissions, so do not transmit sensitive information (such as API keys) through the channel.


    ## Best Practices


    - **Reasonable update frequency**: Set the data update frequency according to your actual needs to avoid wasting resources due to overly frequent updates.


    - **Data structure design**: Design a clear data structure and include the necessary metadata (such as timestamps and version numbers) to facilitate processing on the subscriber side.


    - **Error handling**: The subscriber side should handle null return values, and the broadcasting side should ensure the data format is correct.


    - **Status version control**: Include a version number or update ID in the data to help the subscriber side determine whether new data is available.


    - **Monitoring and alerting**: For critical communication links, it is recommended to implement timeout monitoring and alerting mechanisms.


    - **Testing and validation**: Before using it in production, first validate the stability and latency of channel communication in a test environment.


    - **Documentation**: Document the channel data format and communication protocol to facilitate future maintenance and team collaboration.

See also: `SetChannelData`; `GetChannelData`; `_G`

### JavaScript Multi-threading

The FMZ Quant Trading Platform provides true multi-threading support for ```JavaScript``` language strategies from the system level, implementing the following objects:

| Object | Description | Notes |
| - | - | - |
| threading | Global multi-threading object | Member functions: ```Thread```, ```getThread```, ```mainThread```, etc. |
| Thread | Thread object | Member functions: ```peekMessage```, ```postMessage```, ```join```, etc. |
| ThreadLock | Thread lock object | Member functions: ```acquire```, ```release```. Can be passed as a parameter to thread execution functions into the thread environment. |
| ThreadEvent | Event object | Member functions: ```set```, ```clear```, ```wait```, ```isSet```. Can be passed as a parameter to thread execution functions into the thread environment. |
| ThreadCondition | Condition object | Member functions: ```notify```, ```notifyAll```, ```wait```, ```acquire```, ```release```. Can be passed as a parameter to thread execution functions into the thread environment. |
| ThreadDict | Dictionary object | Member functions: ```get```, ```set```. Can be passed as a parameter to thread execution functions into the thread environment. |

FMZ Quant Trading Platform Syntax Manual: [JavaScript Multi-threading](https://www.fmz.com/syntax-guide/fun/threads)

### Web3

| Function Name | Description |
| - | - |
| [exchange.IO("abi", ...)](/syntax-guide#fun_exchange.ioabi-...) | Register ABI interface |
| [exchange.IO("api", "eth", ...)](/syntax-guide#fun_exchange.ioapi-eth-...) | Call Ethereum RPC methods |
| [exchange.IO("encode", ...)](/syntax-guide#fun_exchange.ioencode-...) | Encode function calls |
| [exchange.IO("encodePacked", ...)](/syntax-guide#fun_exchange.ioencodepacked-...) | Execute encodePacked encoding |
| [exchange.IO("decode", ...)](/syntax-guide#fun_exchange.iodecode-...) | Decode data |
| [exchange.IO("key", ...)](/syntax-guide#fun_exchange.iokey-...) | Switch private key |
| [exchange.IO("api", ...)](/syntax-guide#fun_exchange.ioapi-...) | Call smart contract methods |
| [exchange.IO("address")](/syntax-guide#fun_exchange.ioaddress) | Get current configured wallet address |
| [exchange.IO("base", ...)](/syntax-guide#fun_exchange.iobase-...) | Set RPC node address |

### TA Indicator Library

| Function Name | Description |
| - | - |
| [TA.MACD](/syntax-guide#fun_ta.macd)           | Calculate Moving Average Convergence Divergence indicator |
| [TA.KDJ](/syntax-guide#fun_ta.kdj)             | Calculate Stochastic Oscillator indicator |
| [TA.RSI](/syntax-guide#fun_ta.rsi)             | Calculate Relative Strength Index |
| [TA.ATR](/syntax-guide#fun_ta.atr)             | Calculate Average True Range indicator |
| [TA.OBV](/syntax-guide#fun_ta.obv)             | Calculate On Balance Volume indicator |
| [TA.MA](/syntax-guide#fun_ta.ma)               | Calculate Moving Average indicator |
| [TA.EMA](/syntax-guide#fun_ta.ema)             | Calculate Exponential Moving Average indicator |
| [TA.BOLL](/syntax-guide#fun_ta.boll)           | Calculate Bollinger Bands indicator |
| [TA.Alligator](/syntax-guide#fun_ta.alligator) | Calculate Alligator indicator |
| [TA.CMF](/syntax-guide#fun_ta.cmf)             | Calculate Chaikin Money Flow indicator |
| [TA.Highest](/syntax-guide#fun_ta.highest)     | Calculate the highest price within specified period |
| [TA.Lowest](/syntax-guide#fun_ta.lowest)       | Calculate the lowest price within specified period |
| [TA.SMA](/syntax-guide#fun_ta.sma)             | Calculate Simple Moving Average indicator |

### talib Indicator Library

The talib indicator library contains numerous technical analysis indicators, for example: [talib.CDL2CROWS](/syntax-guide#fun_talib.cdl2crows). Please refer to the syntax manual for detailed information.

## Template Library

**Template Library** is a reusable code module in the FMZ Quant Trading Platform, which belongs to a category of strategy code. The programming languages that support template library functionality on the FMZ Quant Trading Platform include: ```JavaScript```, ```Python```, ```C++```, ```Blockly Visual```. When creating a strategy, if the category is set to Template Library, the system will create a template library in the strategy repository of the currently logged-in account on the FMZ Quant Trading Platform. Once created, this category cannot be changed back to a regular strategy.

![Create Template Library Page](https://www.fmz.com/upload/asset/2e4c55da99fd457ca94a0.png)

### Export Functions of Template Libraries

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

```cpp
// 策略引用该模板以后直接用 ext::Test() 调用此方法
void Test() {
    Log("template call");
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

### Template Library Parameters

Template libraries can also set their own interface parameters. Template library parameters are used as global variables in the template library code.

For example, we set a template library parameter:

![Template Parameter](https://www.fmz.com/upload/asset/2e4ab550b85e6a1cac08e.png)

| Variable Name in Strategy Code | Parameter Name Displayed on Strategy Interface | Type | Default Value |
| - | - | - | - |
| param1 | Template Parameter 1 | Number | 99 |

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

```cpp
void SetParam1(float p1) {
    param1 = p1;
}

float GetParam1() {
    Log("param1:", param1);
    return param1;
}
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

```cpp
void main() {
    Log("Calling ext::GetParam1:", ext::GetParam1());
    Log("Calling ext::SetParam1:", "#FF0000");
    ext::SetParam1(20);
    Log("Calling ext::GetParam1:", ext::GetParam1());
}
```

### Reference Template Library

When a strategy references a template library, the currently logged-in FMZ Quant Trading Platform account must have available template libraries in its strategy library. On the [Strategy Edit Page](https://www.fmz.com/m/add-strategy), check the templates you need to reference in the Template section, then save the strategy to complete the reference.

![Template Reference Screenshot](https://www.fmz.com/upload/asset/2e4ee2ec7b3e7b1649af8.png)

## Strategy Parameters

Parameters configured in the strategy interface exist as global variables in the strategy code. ```JavaScript```, ```C++```, and ```MyLanguage``` strategy code can directly access and modify parameter values set in the strategy interface. ```Python``` strategies need to use the ```global``` keyword when modifying global variables or strategy interface parameters within functions. ```PINE``` language uses the ```input()``` function to create interface parameters. Strategies designed using ```Blockly Visual``` mode do not support interface parameters.

![Strategy Parameter Settings Interface](https://www.fmz.com/upload/asset/2e46b5e593de3b2f11445.png)

### Interface Parameter Types

| Variable (naming example) | Description | Type | Default Value (description) | Component Configuration (description) | Remarks |
| - | - | - | - | - | - |
| pNum       | Description of parameter pNum       | Numeric (number)     | Example: Set default value to 100, floating point type in C++ strategies| Used to set the interface control bound to the current parameter: component type, minimum value, maximum value, grouping, filters, etc. | Remarks for parameter pNum, the value of pNum is numeric type |
| pBool      | Description of parameter pBool      | Boolean (true/false) | Use switch control to set default value, optional control not supported | Same as above                                                          | Remarks for parameter pBool, the value of pBool is boolean type |
| pStr       | Description of parameter pStr       | String (string)     | Example: Set default value to abc               | Same as above                                                          | Remarks for parameter pStr, the value of pStr is string type |
| pCombox    | Description of parameter pCombox    | Dropdown (selected)   | Set one or more options from the options      | Same as above                                                          | Remarks for parameter pCombox, the value of pCombox may have various forms |
| pSecretStr | Description of parameter pSecretStr | Encrypted string (string)     | Example: Set default value to xyz               | Same as above                                                          | Remarks for parameter pSecretStr, the value of pSecretStr is string type |

Interface parameters are configured in the strategy parameters area below the code editor on the strategy editing page. Please note the following:
1. In the default value option of parameter settings, the "Optional" control is optional by default. You can change the state of this control to set the current parameter as required. After setting a parameter as required, if the parameter is not set during backtesting or live trading, backtesting cannot be performed or live trading cannot be started.
2. Variable names for interface parameters in strategy code should not use reserved words (keywords) of the current programming language.
3. In the backtesting or live trading interface, hovering the mouse over the control bound to a parameter will display the parameter's remarks.
4. The "Description" of a parameter is the display name of the control bound to the parameter.
5. The "Variable" of a parameter refers to those in the table above: ```pNum```, ```pBool```, ```pStr```, ```pCombox```, ```pSecretStr```. They exist as global variables in the strategy code, so the values of strategy parameters can be modified in the code.
6. For "Encrypted string" and "String" type parameters, no quotes are needed when entering default values; all input is treated as strings. "Encrypted string" parameters are used the same way as "String" parameters, but encrypted strings are transmitted encrypted and not sent in plain text.
7. If a "String" type parameter is set to "Optional", when no parameter is filled in the control bound to the parameter, the value of the parameter variable is **empty string**;
  Similarly, the value of a "Numeric" parameter is **null**;
  Similarly, the value of a "Dropdown" parameter is **null**;
  Similarly, the value of an "Encrypted string" parameter is **null**.
8. For dropdown type interface parameters (e.g., variable name ```pCombox```), when "Support multiple selection" is not enabled in "Component Configuration", the value of pCombox is the index or specific data of the currently selected option (when data is bound to options).
  If "Support multiple selection" is enabled, the value of pCombox is an array containing the indices or specific data of all currently selected options (when data is bound to options).

### Component Configuration

The "Component Configuration" option for strategy interface parameters is used to set controls corresponding to 5 parameter types on the platform, enhancing functionality and simplifying design.

Supported component types for the 5 interface parameters:
- Number type parameters
  Supported component types: Input box control (default), Time picker control, Slider control.
- Boolean (true/false) parameters
  Only supports switch control (default).
- String parameters
  Supported component types: Input box control (default), Text box control, Time picker control, Color picker control, Currency selector, Trading code selector.
- Dropdown (selected) parameters
  Supported component types: Dropdown control (default), Segmented control, Currency selector, Trading code selector.
- Encrypted string parameters
  Only supports encrypted input box control (default).

In addition to setting the control types for interface parameters, you can also set grouping and filtering for interface parameters.
- Grouping
  In the "Group" input box of component configuration, you can enter a label name to group several strategy interface parameters under the same group label (replacing the platform's old "Strategy Grouping" feature).
- Filter
  In the "Filter" input box of component configuration, you can enter filter condition expressions to control whether interface parameters take effect (replacing the platform's old "Parameter Dependency" feature).
  The filter is empty by default, with no parameter condition filtering; you can set: ```a > b```, ```a == 1```, ```a```, ```!a```, ```a >= 1 && a <= 10```, ```a > b```, etc. When the filter condition is true, the current parameter is available.
  - When a parameter has filter ```a == 1``` set, the availability of this parameter depends on the value of parameter ```a```. When parameter ```a``` equals 1, this parameter is available; otherwise, it is unavailable.
  - When a parameter has filter ```a >= 1 && a <= 10``` set, it means the filter condition is: a is greater than or equal to 1 and a is less than or equal to 10. When this condition is met, the parameter is available; otherwise, it is unavailable.
  - When a parameter has filter ```!a``` set, it means the filter condition is: not a; a can be a boolean value or a numeric value (!0 represents true).

### Save Parameter Settings

- Parameter saving in the backtesting system
  When backtesting, if you want to save the strategy parameters, you can click the "Save Backtest Settings" button after modifying the strategy parameters. For details, please refer to ["Save Backtest Settings"](/user-guide/回测系统/保存回测设置) in the backtesting system.

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

  ```cpp
  /*backtest
  start: 2020-02-29 00:00:00
  end: 2020-03-29 00:00:00
  period: 1d
  args: [["number",2],["string","Hello FMZ.COM"],["combox",2],["bool",false],["numberA@isShowA",666],["isShowA",true]]
  */
  ```
- Importing and exporting live trading parameters
  When running live trading, if you need to save the parameter data of the live trading configuration, you can click the "Parameter Settings" option on the strategy live trading page, then click the "Export Parameters" button. The exported strategy parameters will be saved as a ```json``` file.
  The exported strategy parameter configuration can also be imported into live trading again. Click the "Import Parameters" button to import the saved strategy live trading parameters into the current live trading, and after importing, click the "Update Parameters" button to save and apply them.

## Interactive Controls

```JavaScript```, ```Python```, ```Rust```, ```C++```, and My-language strategies can all be designed with interactive controls. A strategy's interactive controls are used to send interaction commands to a running strategy program while the strategy is running live. For strategies written in ```JavaScript```, ```Python```, ```Rust```, and ```C++```, you can use the [```GetCommand()```](https://www.fmz.com/syntax-guide#fun_getcommand) function in the strategy code to obtain the messages generated by the interactive controls.


  ![Interactive Controls](https://www.fmz.com/upload/asset/2e4320d0cc33c15eb935d.png)


  After writing the code to handle interactive control messages in your strategy, you can use the interactive controls during live trading to implement (but are not limited to) the following functions:

  - Manually close the strategy's positions.

  - Dynamically modify strategy parameters without restarting the live strategy.

  - Switch strategy logic.

  - Trigger the printing of certain debugging information or data to test specific features.

### Types of Interactive Controls

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

Application of interactive controls: Dynamically modify strategy parameters
For example, the strategy has a parameter called symbol. The strategy parameters added on the strategy interface are also global variables, so global variables in the code are used here for demonstration.

```js
// Strategy parameters
var symbol = "BTC_USDT"

function main() {
    while (true) {
        var cmd = GetCommand()
        if (cmd) {
            var arr = cmd.split(":")
            if (arr.length == 2 && arr[0] == "changeSymbol") {
                // When changeSymbol control is triggered, parameter update operation will be executed
                Log("Changed symbol parameter to:", arr[1])
                symbol = arr[1]
            }
        }

        LogStatus(_D(), ", Current symbol parameter value:", symbol)
        Sleep(3000)
    }
}
```

Setting up interactive controls:

/upload/asset/1741a2b35e569c5e07e3.png

### Component Configuration

The "Component Configuration" option for strategy interaction controls is used to set up controls corresponding to 5 types of interaction controls on the platform, enhancing functionality and simplifying design.

Supported component types for the 5 interaction controls:
- Number type interaction control
  Supported component types: Input box control (default), Time picker control, Slider input control.
- Boolean (true/false) interaction control
  Only supports Switch control (default).
- String type interaction control
  Supported component types: Input box control (default), Text box control, Time picker control, Color picker control, Currency selector, Trading code selector.
- Dropdown (selected) interaction control
  Supported component types: Dropdown control (default), Segmented controller control, Currency selector, Trading code selector.
- Button type interaction control
  Only supports Button control (default), no input controls.

Interaction controls support grouping functionality, same as interface parameter settings. Grouping can be configured in Component Configuration.
- Grouping
  In the "Group" input box of Component Configuration, you can enter a label name to group multiple strategy interaction controls under the same group label (this feature replaces the platform's original "Interaction Control Grouping" function).

### Interactive Controls in Status Bar

In addition to designing interactive controls in the "Strategy Interaction" section, you can also design interactive controls in the strategy status bar. Currently, the only supported interactive control type is the button type. Please refer to [the ```LogStatus``` function chapter in the "Syntax Guide"](https://www.fmz.com/syntax-guide#fun_logstatus).

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
      },
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
      }],
  }
  ```

Encode the JSON data of these button controls as a JSON string, then wrap it with ``` ` ``` characters and output it in the status bar. Using JavaScript as an example:

```js
function main() {
    var btn = {"type": "button", "name": "Button 1", "cmd": "button1", "description": "This is the first button"}
    LogStatus("`" + JSON.stringify(btn) + "`")
}
```

These button controls can also be written into status bar tables. For detailed examples, please refer to the [Syntax Guide](https://www.fmz.com/syntax-guide#fun_logstatus).

The ```input``` field structure is consistent with the single control structure in the ```group``` field. The following is a detailed explanation:

```desc
{
    "type": "selected",     // Control type (required field), supports: number, string, selected, boolean
    "name": "test",         // Name (required field when used in group)
    "label": "topic",       // Title (required field)
    "description": "desc",  // Tooltip information for the component
    "default": 1,           // Default value; if the settings field is not set in the current JSON structure, it is compatible with defValue, and defValue can be used instead of default
    "filter": "a>1",        // Selector, not setting this field means no filtering (display control); when this field is set, the control is not filtered (displayed) when the expression is true, and filtered (not displayed) when the expression is false
                            // For the selector, using the expression a>1 in this example, 'a' refers to the control value with name 'a' under the group field in the type=button structure, and this value is used to determine whether to filter
    "group": "group1",      // Grouping
    "settings": { ... },    // Component configuration
}
```

Detailed explanation of each field in the component configuration ```settings```:
- ```settings.required```: Whether it is required.
- ```settings.disabled```: Whether it is disabled.
- ```settings.min```: Valid when ```type=number```, represents the minimum value or minimum string length.
- ```settings.max```: Valid when ```type=number```, represents the maximum value or maximum string length.
- ```settings.step```: Valid when ```type=number``` and ```render=slider```, represents the step size.
- ```settings.multiple```: Valid when ```type=selected```, indicates support for multiple selection.
- ```settings.customizable```: Valid when ```type=selected```, indicates support for customization; users can directly edit and add new options in the dropdown control. If a newly edited option is selected, the option's name will be used instead of the option's value when triggering the interaction.
- ```settings.options```: Valid when ```type=selected```, represents the selector's option data format: ```["Option 1", "Option 2"]```, ```[{'name':'xxx','value':0}, {'name':'xxx','value':1}]```.
- ```settings.render```: Render component type.
  When ```type=number```, ```settings.render``` is not set (defaults to number input box), options: ```slider``` (slider), ```date``` (date picker, returns timestamp).
  When ```type=string```, ```settings.render``` is not set (defaults to single-line input box), options: ```textarea``` (multi-line input), ```date``` (date picker, returns yyyy-MM-dd hh:mm:ss), ```color``` (color picker, returns #FF00FF).
  When ```type=selected```, ```settings.render``` is not set (defaults to dropdown), options: ```segment``` (segmented selector).
  When ```type=boolean```, currently only the default checkbox is available.

Bilingual settings are supported. For example: ```'Option｜options'``` text content will automatically adapt based on the current language environment. Using a single control in the ```group``` field as an example, complete example:

```json
{
    type:'selected',
    name:'test',
    label:'Option｜options',
    description:'Description｜description',
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

## Options Trading

FMZ Quant Trading Platform supports cryptocurrency options trading.

### Cryptocurrency Options

Use the ```exchange.SetContractType()``` function to set the options contract. The format of options contract codes varies across different exchanges. The cryptocurrency options exchanges supported by the FMZ Quant Trading Platform are as follows:

- Futures_Deribit
  For the ```Deribit``` exchange, you only need to call the ```exchange.SetContractType()``` function to set the contract to an options contract. After setting the options contract, when you call market data interfaces such as ```GetTicker()```, the data obtained will be the market data of that options contract.
  Use the ```exchange.Sell()``` and ```exchange.Buy()``` functions to place orders. Pay attention to the trade direction when placing orders; you can use the ```exchange.SetDirection()``` function to set the trade direction.
  Use the ```exchange.CancelOrder()``` function to cancel orders, and the ```exchange.GetPositions()``` function to query positions.

  Reference strategy code: [Deribit Options Test Strategy](https://www.fmz.com/strategy/179475)
  Examples of options contract codes: ```BTC-13SEP24-60000-C```, ```XRP_USDC-27SEP24-1-C```, ```BTC-CS-6SEP24-57000_57500```, ```BTC-PCAL-20SEP24_13SEP24-55000```, etc.
- Futures_OKX
  Setting contracts, placing orders, canceling orders, querying orders, obtaining market data, and other operations are the same as with ```Deribit```. The contract code format is ```BTC-USD-200626-4500-C```.
  You can query contract-related information via the ```https://www.okx.com/api/v5/public/instruments``` interface.

  For example, to query the information of BTC options contracts:
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

  ```cpp
  void main() {
      Log(HttpQuery("https://www.okx.com/api/v5/public/instruments?instType=OPTION&uly=BTC-USD"));
  }
  ```
- Futures_HuobiDM
  Example of a Huobi options contract code: ```BTC-USDT-201225-P-13000```, where the underlying asset is ```BTC```, the exercise date is December 25, 2020, the option type is a put option (PUT), and the strike price is 13,000 USD.
  Call options: the premium paid by the buyer is in USDT, using the USDT in the account assets; the seller's margin is in coin, using the coin in the account assets as collateral.
  Put options: the premium paid by the buyer is in USDT, using the USDT in the account assets; the seller's margin is in USDT, using the USDT in the account assets as collateral.
- Futures_Bybit
  Supports USDC options on the Bybit exchange. Set the trading pair to ```ETH_USDC``` and call the ```exchange.SetContractType()``` function to set the contract to an options contract.
  Example of an options contract code: ```ETH-25NOV22-1375-P```.
- Futures_Aevo
  Supports USDC options on the Aevo exchange. Example of an options contract code: ```ETH-30JUN23-1600-C```.
- Futures_GateIO
  Supports USDT options on the GATE.IO exchange. Example of an options contract code: ```BTC_USDT-20211130-65000-C```

## Rust Strategy Development Guide

1. The difference between writing strategies in ```Rust``` and in ```JavaScript``` lies mainly in the different form of data returned by the platform API functions. Take the ```exchange.GetTicker()``` function as an example:
- JavaScript
  ```exchange.GetTicker()``` returns an object on a successful call; if the call fails (e.g., due to exchange server issues, network issues, etc.), it returns ```null```.

  ```js
  function main() {
      var ticker = exchange.GetTicker()
      // Check whether the exchange.GetTicker call failed (returns null)
      if (ticker) {
          Log(ticker)
      }
  }
  ```
- Rust
  API calls that may fail uniformly return the ```Result<T>``` type, and errors can be handled in idiomatic Rust style:

  ```rust
  fn main() {
      // Approach 1: pattern matching to check whether the exchange.GetTicker call succeeded
      if let Ok(ticker) = exchange.GetTicker(None) {
          Log!(ticker);
      }

      // Approach 2: use the _C! macro to retry automatically until the call succeeds
      let ticker = _C!(exchange.GetTicker(None));
      Log!(ticker);
  }
  ```
  Optional parameters (such as the ```symbol``` parameter of ```GetTicker```) use ```None``` as a placeholder when not passed, and are passed directly when a value is needed, e.g., ```exchange.GetTicker("BTC_USDT")```.

2. Strategy entry point and lifecycle: The entry point of a Rust strategy is ```fn main()``` (which shares the same name as the entry point of a standard Rust program, but is invoked by the platform and has no return value). As with JavaScript, you can optionally define ```fn init()``` (executed automatically first when the strategy starts running) and ```fn onexit()``` (executed to perform cleanup when the strategy exits), which the bootstrap layer will call automatically. In addition, you can also call ```OnExit()``` within the strategy code to register additional exit hooks:

```rust
fn main() {
    // Strategy logic...
}

fn init() {
    Log!("Initializing");
}

fn onexit() {
    Log!("Strategy exiting, performing cleanup");
}
```

3. Logging and global features are provided in the form of macros: ```Log!()```, ```LogStatus!()```, ```Panic!()```, ```_G!()```, ```_C!()```, etc. are Rust macros (note the trailing exclamation mark); whereas ```LogProfit()```, ```Sleep()```, ```_D()```, ```_N()```, ```HttpQuery()```, etc. are regular functions.

4. Strategy parameters are injected as global constants: strategy parameters configured in the UI are injected into the strategy code according to their value types (number maps to ```f64```, boolean to ```bool```, string/password to ```&str```, and dropdowns according to the value type of their options), and can be referenced directly by parameter name. If you need to use them as integers, convert them yourself, e.g., ```let n = Period as usize;```. The complete parameter set can be obtained as JSON text via the ```params()``` function and parsed yourself.

5. JSON data handling: The raw JSON text returned by the platform API (such as the return value of ```exchange.IO()``` and the ```Info``` field of various structs) can be parsed into a ```JsonValue``` using the built-in ```JSONParse()``` function, and navigated by indexing in the form of ```v["key"]``` and ```v[0]```, then obtaining scalar values via methods such as ```as_f64()```, ```as_str()```, and ```as_bool()```. Since the SDK does not have built-in JSON serialization, you can assemble JSON text using the ```format!``` macro, or introduce a third-party crate (such as ```serde_json```).

6. Third-party crates and TLS notes: The strategy source code is the only code file, and dependencies must be declared in a ```[dependencies]``` frontmatter block wrapped by ```---``` at the very top of the source code (see the "Programming Languages - Rust" section for details). Since the compilation sandbox does not have system OpenSSL, for crates that require TLS please choose the pure-Rust implementation ```rustls``` and avoid depending on ```native-tls```/```openssl-sys```; for WebSocket connections, prefer the built-in ```Dial()``` function.

## C++ Strategy Writing Guide

1. The main difference between writing strategies in ```C++``` and ```JavaScript``` lies in the data returned by API functions on the FMZ Quant Trading Platform. For example, the ```exchange.GetTicker()``` function:
- JavaScript
  ```exchange.GetTicker()``` returns an object when called successfully, and returns ```null``` if the call fails (e.g., exchange server issues, network problems, etc.).

  ```js
  function main() {
      var ticker = exchange.GetTicker()
      // Check if exchange.GetTicker function call failed and returned null
      if (ticker){
          Log(ticker)
      }
  }
  ```
- C++
  ```exchange.GetTicker()``` returns an object when called successfully, and still returns an object when the call fails. The objects returned from successful and failed calls are distinguished by the ```Valid``` property.

  ```cpp
  void main() {
      auto ticker = exchange.GetTicker();
      // Check if exchange.GetTicker() function call failed by checking if the Valid property in the returned object is false
      if (ticker.Valid) {
          Log(ticker);
      }
  }
  ```
2. The difference between the ```main()``` function in ```C++``` strategies and the ```main()``` function in standard C11:
The entry function ```main()``` in C11 C++ programs returns an ```int``` type, while in FMZ Quant's C++ strategies, the strategy's startup function is also ```main()```. However, these are not the same function, they just share the same name. The ```main()``` function in FMZ Quant's C++ strategies returns a ```void``` type.

```cpp
void main() {
    // Test using the Test function
    if (!Test("c++")) {
        // Throw an exception to terminate program execution
        Panic("Please download the latest version of the docker");
    }

    // All returned objects use the Valid property to determine validity
    LogProfitReset();
    LogReset();
    Log(_N(9.12345, 2));
    Log("use _C", _C(exchange.GetTicker), _C(exchange.GetAccount));
}
```

## JavaScript Strategy Writing Guide

Due to the inherent characteristics of the ```JavaScript``` language (JavaScript's built-in strings only support ASCII and UTF-16 encoding, to avoid data loss), when encountering strings that cannot be encoded, an ```ArrayBuffer``` type will be returned. In all API interfaces of the FMZ Quant platform, wherever string parameters can be passed, ```ArrayBuffer``` type is also supported.

The following example demonstrates this feature in detail:
```js
function stringToHex(str) {
    let hex = '';
    for (let i = 0; i < str.length; i++) {
        const charCode = str.charCodeAt(i).toString(16);
        hex += charCode.length === 1 ? '0' + charCode : charCode;
    }
    return hex;
}

function main() {
    const inputString = "abc𠮷123";  // The Unicode code point of this "𠮷" character exceeds the 16-bit range
    // const inputString = "abcG123"; // If using abcG123 string for testing, the variable outputD will not be assigned as ArrayBuffer

    // Use the Encode function to encode inputString to hexadecimal encoding
    const encodedHex = Encode("raw", "string", "hex", inputString);
    Log(encodedHex);  // Content: 61 62 63 f0a0aeb7 31 32 33

    // Use custom stringToHex function to encode, unable to handle "𠮷" character, resulting in incorrect hexadecimal encoding
    const manuallyEncodedHex = stringToHex(inputString);
    Log(manuallyEncodedHex);  // Content: 61 62 63 d842dfb7 31 32 33

    // Successfully restore from hexadecimal encoding to string (variable inputString)
    const decodedString = Encode("raw", "hex", "string", encodedHex);
    Log(decodedString);

    // Unable to decode, returns ArrayBuffer, i.e., variable outputD is of ArrayBuffer type
    const outputD = Encode("raw", "hex", "string", manuallyEncodedHex);
    Log(outputD);

    // Verify the returned ArrayBuffer type variable outputD
    const bufferD = new Uint8Array(outputD);
    let hexBufferD = '';
    for (let i = 0; i < bufferD.length; i++) {
        hexBufferD += bufferD[i].toString(16).padStart(2, '0');
    }
    Log(hexBufferD);    // 61 62 63 d842dfb7 31 32 33
}
```

## Web3

FMZ Quant Trading Platform supports ```Web3``` related features, enabling easy access to ```DeFi``` exchanges in the cryptocurrency market.

### Ethereum

On the FMZ Quant Trading Platform, use the ```exchange.IO()``` function to write strategy code to implement Ethereum blockchain RPC method calls and smart contract interactions.

#### Web3 Exchange Object Configuration

You need to configure access nodes on the FMZ Quant Trading Platform. Access nodes can be self-hosted nodes or third-party services, such as: ```infura```. On the FMZ Quant Trading Platform's ["Exchange"](https://www.fmz.com/m/add-platform) page, select protocol: **Cryptocurrency**, then select exchange as ```Web3```.

Configure ```Rpc Address``` (service address of the access node) and ```Private Key``` (private key). Supports local deployment of private keys. For details, please refer to ["Key Security"](/user-guide/密钥安全性).

#### Register ABI

When calling contracts, if using standard ```ERC20``` methods, you can call directly without registration. Calling methods outside of standard contracts requires registering the ABI content first: ```exchange.IO("abi", tokenAddress, abiContent)```.

To obtain the contract's ABI content, you can use the following URL and extract only the ```result``` field.

```url
https://api.etherscan.io/api?module=contract&action=getabi&address=0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45
```

#### Calling Ethereum RPC Methods

Use the ```exchange.IO()``` function to call Ethereum RPC methods.
- Query ETH balance in wallet
  ```
  exchange.IO("api", "eth", "eth_getBalance", owner, "latest")   // owner is the specific wallet address
  ```
- ETH transfer
  ```
  exchange.IO("api", "eth", "send", toAddress, toAmount)   // toAddress is the wallet address receiving ETH, toAmount is the transfer amount
  ```
- Query Gas price
  ```
  exchange.IO("api", "eth", "eth_gasPrice")
  ```
- Query estimated Gas fee
  ```
  exchange.IO("api", "eth", "eth_estimateGas", data)
  ```

#### Support for encode

The ```exchange.IO()``` function encapsulates the ```encode``` method, which can encode a function call into ```hex``` string format and return it. For specific usage, refer to the platform's publicly available ["Uniswap V3 Trading Library" template](https://www.fmz.com/strategy/397260).

The following takes encoding a call to the ```unwrapWETH9``` method as an example:
```js
function main() {
    // ContractV3SwapRouterV2 mainnet address : 0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45
    // The ABI must be registered before calling the unwrapWETH9 method; the registration step is omitted here
    // "owner" represents the wallet address and must be replaced with the actual address; 1 represents the unwrap amount, i.e. unwrapping 1 WETH into ETH
    var data = exchange.IO("encode", "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45", "unwrapWETH9(uint256,address)", 1, "owner")
    Log(data)
}
```

When calling the ```exchange.IO("encode", ...)``` function, if the second parameter (string type) starts with ```0x```, it means encoding a method call on a smart contract.
If the second parameter does not start with ```0x```, it means encoding the data according to the specified type order, which is functionally equivalent to ```abi.encode``` in ```solidity```. Refer to the following example.

```js
function main() {
    var x = 10
    var address = "0x02a5fBb259d20A3Ad2Fdf9CCADeF86F6C1c1Ccc9"
    var str = "Hello World"
    var array = [1, 2, 3]
    var ret = exchange.IO("encode", "uint256,address,string,uint256[]", x, address, str, array)   // uint means uint256 , the type length must be specified explicitly on FMZ
    Log("ret:", ret)
    /*
    000000000000000000000000000000000000000000000000000000000000000a    // x
    00000000000000000000000002a5fbb259d20a3ad2fdf9ccadef86f6c1c1ccc9    // address
    0000000000000000000000000000000000000000000000000000000000000080    // offset of str
    00000000000000000000000000000000000000000000000000000000000000c0    // offset of array
    000000000000000000000000000000000000000000000000000000000000000b    // length of str
    48656c6c6f20576f726c64000000000000000000000000000000000000000000    // data of str
    0000000000000000000000000000000000000000000000000000000000000003    // length of array
    0000000000000000000000000000000000000000000000000000000000000001    // first element of array
    0000000000000000000000000000000000000000000000000000000000000002    // second element of array
    0000000000000000000000000000000000000000000000000000000000000003    // third element of array
    */
}
```

Encoding of tuples, or of type orders containing tuples, is supported:
```js
function main() {
    var types = "(uint256,uint8,address),bytes"
    var ret = exchange.IO("encode", types, [30, 20, "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"], "0011")
    Log("encode: ", ret)
}
```

This type order consists of ```tuple``` and ```bytes```, so when calling the ```exchange.IO()``` function to perform ```encode```, two more parameters need to be passed in:
- The variable corresponding to the tuple type:
  ```json
  [30, 20, "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"]
  ```
  The tuple's values are passed in as an array by position; the number, order, and types of the elements must match ```(uint256,uint8,address)``` in the ```types``` parameter. A literal tuple has no field names; when decoding, the fields are named ```Field1```, ```Field2```, ... in order of position.
- The variable corresponding to the bytes type:
  ```string
  "0011"
  ```

Encoding of arrays, or of type orders containing arrays, is supported:
```js
function main() {
    var path = ["0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2", "0xdac17f958d2ee523a2206206994597c13d831ec7"]   // ETH address, USDT address
    var ret = exchange.IO("encode", "address[]", path)
    Log("encode: ", ret)
}
```

#### Support for encodePacked

For example, when calling methods on ```Uniswap V3``` decentralized exchange, you need to pass parameters such as swap path, which requires using the ```encodePacked``` operation:
```js
function main() {
    var fee = exchange.IO("encodePacked", "uint24", 3000)
    var tokenInAddress = "0x111111111117dC0aa78b770fA6A738034120C302"
    var tokenOutAddress = "0x6b175474e89094c44da98b954eedeac495271d0f"
    var path = tokenInAddress.slice(2).toLowerCase()
    path += fee + tokenOutAddress.slice(2).toLowerCase()
    Log("path:", path)
}
```

#### Decode Support

Data processing supports not only encoding (encode) but also decoding (decode). You can use the ```exchange.IO("decode", types, rawData)``` function to perform the ```decode``` operation.
```js
function main() {
    // register SwapRouter02 abi
    var walletAddress = "0x398a93ca23CBdd2642a07445bCD2b8435e0a373f"
    var routerAddress = "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45"
    var abi = `[{"inputs":[{"components":[{"internalType":"bytes","name":"path","type":"bytes"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"uint256","name":"amountInMaximum","type":"uint256"}],"internalType":"struct IV3SwapRouter.ExactOutputParams","name":"params","type":"tuple"}],"name":"exactOutput","outputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"}],"stateMutability":"payable","type":"function"}]`
    exchange.IO("abi", routerAddress, abi)   // The abi here contains only part of the content for the exactOutput method; the complete abi can be found online

    // encode path
    var fee = exchange.IO("encodePacked", "uint24", 3000)
    var tokenInAddress = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"
    var tokenOutAddress = "0xdac17f958d2ee523a2206206994597c13d831ec7"
    var path = tokenInAddress.slice(2).toLowerCase()
    path += fee + tokenOutAddress.slice(2).toLowerCase()
    Log("path:", path)

    var dataTuple = {
        "path" : path,
        "recipient" : walletAddress,
        "amountOut" : 1000,
        "amountInMaximum" : 1,
    }
    // encode SwapRouter02 exactOutput
    var rawData = exchange.IO("encode", routerAddress, "exactOutput", dataTuple)
    Log("method hash:", rawData.slice(0, 8))   // 09b81346
    Log("params hash:", rawData.slice(8))

    // decode exactOutput params
    var decodeRaw = exchange.IO("decode", "(bytes,address,uint256,uint256)", rawData.slice(8))
    Log("decodeRaw:", decodeRaw)
}
```

This example first performs ```encodePacked``` encoding on the ```path``` parameter, because the ```exactOutput``` method call to be encoded subsequently requires ```path``` as a parameter. It then performs ```encode``` encoding on the ```exactOutput``` method of the router contract, which has only one parameter, of type ```tuple```.
The method name ```exactOutput``` is encoded as ```0x09b81346```. Using the ```exchange.IO("decode", ...)``` method to decode according to the ```(bytes,address,uint256,uint256)``` types yields ```decodeRaw```, whose fields are numbered by position as ```Field1``` through ```Field4```, with each field's value corresponding in order to the contents of the variable ```dataTuple```.

#### Support Private Key Switching

Support private key switching to operate multiple wallet addresses, for example:
```js
function main() {
    exchange.IO("key", "Private Key")   // "Private Key" represents the private key string, you need to fill in the actual private key value
}
```

#### Call Smart Contract Method

The following are examples of smart contract method calls.
- decimals
  ```decimals``` method is a ```constant``` method of ```ERC20``` (no need to register ABI when calling standard ERC20 methods in FMZ quantitative strategy code), which does not consume ```gas``` and can query the precision data of a ```token```.
  The ```decimals``` method has no parameters and returns the precision data of the ```token```.

  ```js
  function main(){
      var tokenAddress = "0x111111111117dC0aa78b770fA6A738034120C302"    // Token contract address, the token in this example is 1INCH
      Log(exchange.IO("api", tokenAddress, "decimals"))                  // Query and print that the precision exponent of 1INCH token is 18
  }
  ```
- allowance
  ```allowance``` method is a ```constant``` method of ```ERC20```, which does not consume ```gas``` and can query the authorization amount of a ```token``` for a certain contract address.
  The ```allowance``` method requires 2 parameters, the first parameter is the wallet address, and the second parameter is the authorized address. The return value is the authorization amount of the ```token```.

  ```js
  function main(){
      // Token contract address, the token in this example is 1INCH
      var tokenAddress = "0x111111111117dC0aa78b770fA6A738034120C302"
      var owner = ""
      var spender = ""

      // For example, if the query returns 1000000000000000000, divide by the token's precision unit 1e18 to get that the wallet bound to the current exchange object has authorized 1 1INCH to the spender address
      Log(exchange.IO("api", tokenAddress, "allowance", owner, spender))
  }
  ```

  ```owner```: Wallet address, needs to be filled with the specific address in actual use.
  ```spender```: Authorized contract address, needs to be filled with the specific address in actual use, for example, it can be the ```Uniswap V3 router v1``` address.
- approve
  ```approve``` method is a non-```constant``` method of ```ERC20```, which consumes ```gas``` and is used to authorize a certain contract address with the operation amount of ```token```.
  The ```approve``` method requires 2 parameters, the first parameter is the authorized address, and the second parameter is the authorization amount. The return value is ```txid```.

  ```js
  function main(){
      // Token contract address, the token in this example is 1INCH
      var tokenAddress = "0x111111111117dC0aa78b770fA6A738034120C302"
      var spender = ""
      var amount = "0xde0b6b3a7640000"

      // Hexadecimal string of authorization amount: 0xde0b6b3a7640000, corresponding decimal string: 1e18, 1e18 divided by the token's precision unit equals 1 token amount, so this authorizes one token
      Log(exchange.IO("api", tokenAddress, "approve", spender, amount))
  }
  ```

  ```spender```: Authorized contract address, needs to be filled with the specific address in actual use, for example, it can be the ```Uniswap V3 router v1``` address.
  ```amount```: Authorization amount, represented here as a hexadecimal string. The corresponding decimal value is ```1e18```, divided by the ```token``` precision unit in the example (i.e., 1e18), resulting in authorization of 1 ```token```.

  The third parameter of the ```exchange.IO()``` function passes the method name ```approve```, which can also be written in the form of ```methodId```, for example: "0x571ac8b0". It can also be written as the complete standard method name, for example: "approve(address,uint256)".
- multicall
  ```multicall``` method is a non-constant method of ```Uniswap V3```, which consumes ```gas``` and is used for batch token swaps.
  The ```multicall``` method may have multiple parameter passing methods, you can check the ABI containing this method for details. The ABI needs to be registered before calling this method. The return value is ```txid```.

  For specific ```multicall``` method call examples, you can refer to the platform's public ["Uniswap V3 Trading Library" template](https://www.fmz.com/strategy/397260)

  ```js
  function main() {
      var ABI_Route = ""
      var contractV3SwapRouterV2 = ""
      var value = 0
      var deadline = (new Date().getTime() / 1000) + 3600
      var data = ""
      exchange.IO("abi", contractV3SwapRouterV2, ABI_Route)
      exchange.IO("api", contractV3SwapRouterV2, "multicall(uint256,bytes[])", value, deadline, data)
  }
  ```

  ```ABI_Route```: ABI of Uniswap V3's router v2 contract, needs to be filled according to actual situation.
  ```contractV3SwapRouterV2```: Uniswap V3's router v2 address, needs to be filled with the specific address in actual use.
  ```value```: Amount of ETH to transfer, set to 0 if the ```tokenIn``` token for the swap operation is not ETH, needs to be filled according to actual situation.
  ```deadline```: Can be set to ```(new Date().getTime() / 1000) + 3600```, indicating validity within one hour.
  ```data```: Packed operation data to be executed, needs to be filled according to actual situation.

  You can also specify ```gasLimit/gasPrice/nonce``` settings for method calls:

  ```js
  exchange.IO("api", contractV3SwapRouterV2, "multicall(uint256,bytes[])", value, deadline, data, {gasPrice: 5000000000, gasLimit: 21000})
  ```

  You can set ```{gasPrice: 5000000000, gasLimit: 21000, nonce: 100}``` parameters according to specific needs, this parameter is set as the last parameter of the ```exchange.IO()``` function.
  You can omit ```nonce``` to use the system default value, or not set ```gasLimit/gasPrice/nonce``` to use all system default values.

  Note that the ```stateMutability``` attribute of the ```multicall(uint256,bytes[])``` method in the example is ```payable```, which requires passing the ```value``` parameter.
  The ```stateMutability":"payable"``` attribute can be viewed from the ```ABI```, the ```exchange.IO()``` function will determine the required parameters based on the ```stateMutability``` attribute in the registered ```ABI```.
  If the ```stateMutability``` attribute is ```nonpayable```, there is no need to pass the ```value``` parameter.

#### Other Function Calls

- Get wallet address configured for exchange object
  ```js
  function main() {
      Log(exchange.IO("address"))         // Print the wallet address corresponding to the private key configured for the exchange object
  }
  ```
- Switch blockchain RPC node
  ```js
  function main() {
      var chainRpc = "https://bsc-dataseed.binance.org"

      // Switch to BSC chain, can also use SetBase function to switch
      e.IO("base", chainRpc)
  }
  ```

### TRON

On the FMZ Quant Trading Platform, you can use the ```exchange.IO()``` function to call gRPC methods and smart contracts on the TRON blockchain, enabling you to write related strategy code.

#### Web3 Exchange Object Configuration

Configuration method is similar to Ethereum exchange object configuration, ```ChainType``` needs to be selected as ```TRON```. ```RPC Address``` defaults to: ```grpc.trongrid.io:50051```, which is the official TRON node address.

#### Register ABI

TRC20 contract ABI is registered by default, with an underlying mechanism that automatically retrieves contract ABI based on contract address. Manual ABI registration is typically not required, only needed when certain contract ABIs cannot be automatically retrieved.

The method for registering ABI is the same as Ethereum, for example:

```js
// USDT contract address: TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t
let abi = `[{"constant":true,"inputs":[{"name":"who","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"}]`

// Register balanceOf method
exchange.IO("abi", "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t", abi)
```

#### Calling TRON RPC Methods

Use the ```exchange.IO()``` function to call TRON RPC methods. For methods requiring signatures, the underlying layer has automatically encapsulated the signing operations. The following lists commonly used methods. For other methods, please refer to the official TRON project documentation.
- GetAccount
  ```js
  exchange.IO("api", "tron", "GetAccount", "TKCG...")   // "TKCG..." is the TRON wallet address, this function returns the account information for the "TKCG..." address.
  ```
- GetAccountResource
  ```js
  exchange.IO("api", "tron", "GetAccountResource", "TKCG...") // Get resources for the specified wallet address, including energy and bandwidth.
  ```
- GetContractABI
  ```js
  exchange.IO("api", "tron", "GetContractABI", "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t")  // Get USDT TRC20 contract ABI
  ```
- GetAssetIssueByName
  ```js
  exchange.IO("api", "tron", "GetAssetIssueByName", "TRX")  // Get token asset information by token name
  ```
- GetNowBlock
  ```js
  exchange.IO("api", "tron", "GetNowBlock")   // Get current block information
  ```
- GetBlockByNum
  ```js
  exchange.IO("api", "tron", "GetBlockByNum", 70624300)
  ```
- GetTransactionByID
  ```js
  exchange.IO("api", "tron", "GetTransactionByID", "05a8fae2cd1cbf36b61d12e219588d25b4826436f055f93388a96e620ec3f3f2")   // Get Transaction by transaction hash
  ```
- TRC20ContractBalance
  ```js
  exchange.IO("api", "tron", "TRC20ContractBalance", "TKCG...", "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t")   // Get wallet USDT balance, note that the returned data is not precision-processed, for example, returned data: ```6890251``` means ```6.890251 USDT```.
  ```
- TriggerConstantContract
  ```js
  function main() {
      let ret = exchange.IO("api", "tron", "TriggerConstantContract", "", "TSUUVjysXV8YqHytSNjfkNXnnB49QDvZpx", "token0()", "")  // Call the token0() method of the smart contract, TriggerConstantContract is used to call read-only methods
      let data = exchange.IO("decode", "address", Encode("raw", "raw", "hex", ret["constant_result"][0]))                        // Decode data
      return data                                                                                                                 // data: 0x891cdb91d149f23b1a45d9c5ca78a88d0cb44c18
  }
  ```
- TRC20Call
  ```js
  function main() {
      let ret = exchange.IO("api", "tron", "TRC20Call", "", "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t", "0x06fdde03", true, 0)         // Use TRC20Call to call read-only method 0x06fdde03
      let data = Encode("raw", "raw", "hex", ret.constant_result[0])
      return exchange.IO("api", "tron", "ParseTRC20StringProperty", data)                                                        // Tether USD
  }
  ```
- Transfer
  ```js
  exchange.IO("api", "tron", "Transfer", "TWTbn...", "TKCG...", 1000000)            // Use Transfer method to transfer TRX, from "TWTbn..." to "TKCG...", 1000000 equals 1 TRX.
  ```

#### Encoding/Decoding

When the exchange object is set to Web3 and TRON is selected, encoding/decoding operations remain consistent with Ethereum's Web3 exchange object.
- encode:
  ```js
  let ret = exchange.IO("encode", "address", "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t")
  Log(ret) // ret: 000000000000000000000000a614f803b6fd780986a42c78ec9c7f77e6ded13c , encoding the TRON address of USDT token.
  ```
- decode:
  ```js
  let data = "0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000a5465746865722055534400000000000000000000000000000000000000000000"
  let ret = exchange.IO("decode", "string", data)
  Log(ret)  // ret: Tether USD , similar to the functionality of ParseTRC20StringProperty
  ```
- encodePacked:
  ```js
  let ret = exchange.IO("encodePacked", "address", "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t")
  Log(ret)  // ret: a614f803b6fd780986a42c78ec9c7f77e6ded13c
  ```

#### Support for Private Key Switching

The switching method is consistent with Web3 Ethereum exchange objects.

#### Calling Smart Contract Methods

Calling smart contract methods on TRON is basically the same as on Ethereum. Here is a specific example demonstrating how to:
- Call smart contract methods, calling multiple contract methods in a single request:
  ```js
  function main() {
      let usdtAddress = "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t"                  // token usdt contract address
      let data1 = exchange.IO("encode", usdtAddress, "name")                  // call function: name
      let data2 = exchange.IO("encode", usdtAddress, "decimals")              // call function: decimals
      let data3 = exchange.IO("encode", usdtAddress, "balanceOf", "TKCG...")  // call function: balanceOf

      var data = []
      data.push([usdtAddress, data1])
      data.push([usdtAddress, data2])
      data.push([usdtAddress, data3])

      exchange.IO("abi", "TGXuuKAb4bnrn137u39EKbYzKNXvdCes98", `[{"inputs":[{"components":[{"internalType":"address","name":"target","type":"address"},{"internalType":"bytes","name":"callData","type":"bytes"}],"internalType":"struct TronMulticall.Call[]","name":"calls","type":"tuple[]"}],"name":"aggregate","outputs":[{"internalType":"uint256","name":"blockNumber","type":"uint256"},{"internalType":"bytes[]","name":"returnData","type":"bytes[]"}],"stateMutability":"view","type":"function"}]`)
      let ret = exchange.IO("api", "TGXuuKAb4bnrn137u39EKbYzKNXvdCes98", "aggregate", data)
      Log("name:", exchange.IO("decode", "string", ret["returnData"][0]))
      Log("decimals:", exchange.IO("decode", "uint8", ret["returnData"][1]))
      Log("balanceOf:", exchange.IO("decode", "uint256", ret["returnData"][2]))
  }
  ```

  Output:
  ```log
  Info balanceOf: 6890251
  Info decimals: 6
  Info name: Tether USD
  ```

#### Other Function Calls

- Get the wallet address configured for the exchange object
  The usage is the same as for Ethereum.
- Switch the blockchain RPC node
  The usage is the same as for Ethereum.
- Calculate hash
  ```js
  let algo = "sign"                   // algo: the algorithm or method to use
  let inputFormat = "hex"             // inputFormat: the format of the input data; when signing, data is a 32-byte hash in hexadecimal
  let outputFormat = "hex"            // outputFormat: the format of the output data
  let data = "txHash"                 // txHash: the specific hash value (64 hexadecimal characters)
  let signature = exchange.IO("hash", algo, inputFormat, outputFormat, data)  // Returns the signature data
  ```

  When algo is set to ```"sign"```, it is used to calculate a signature. In this case, ```data``` must be a 32-byte hash and ```inputFormat``` must be ```"hex"```; it returns 65 bytes of signature data ```r‖s‖v```, where v is 0 or 1. When set to other algorithm parameters (for example: "sha256"), the function is equivalent to the ```Encode()``` function.

  If you need to obtain r, s, and v separately (with v being 27 or 28) for contract verification, you can use ```exchange.IO("sign", ...)``` (see the Web3 section of the Syntax Manual).

## Built-in Libraries

The FMZ Quant Trading Platform has integrated some commonly used libraries.

### TA Indicator Library

FMZ Quant's ```TA``` indicator library optimizes commonly used indicator algorithms and supports being called in strategies written in ```JavaScript```, ```Python```, ```Rust```, ```C++``` and other languages. [Open-source TA library code](https://www.fmz.com/bbs-topic/409), [FMZ Quant Trading Platform API Manual](https://www.fmz.com/syntax-guide).

```js
function main(){
    // The length of records; when the data length does not meet the calculation requirements of the indicator function parameters, an invalid value will be returned
    var records = exchange.GetRecords()
    var macd = TA.MACD(records)
    var atr = TA.ATR(records, 14)

    // Print the last set of indicator values
    Log(macd[0][records.length-1], macd[1][records.length-1], macd[2][records.length-1])
    Log(atr[atr.length-1])
}
```

```python
def main():
    r = exchange.GetRecords()
    macd = TA.MACD(r)
    atr = TA.ATR(r, 14)
    Log(macd[0][-1], macd[1][-1], macd[2][-1])
    Log(atr[-1])
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

```cpp
void main() {
    auto r = exchange.GetRecords();
    auto macd = TA.MACD(r);
    auto atr = TA.ATR(r, 14);
    Log(macd[0][macd[0].size() - 1], macd[1][macd[1].size() - 1], macd[2][macd[2].size() - 1]);
    Log(atr[atr.size() - 1]);
}
```

### talib Indicator Library

Below is example code for calling the ```CCI``` indicator. For more talib indicator functions, please refer to the [FMZ Quant Trading Platform API Manual](https://www.fmz.com/syntax-guide)

```js
function main() {
    var records = exchange.GetRecords()
    var cci = talib.CCI(records, 14)
    Log(cci)
}
```

```python
# Python requires separate installation of talib library

import talib

def main():
    records = exchange.GetRecords()
    # The parameter 14 can be omitted
    cci = talib.CCI(records.High, records.Low, records.Close, 14)
    Log(cci)
```

```cpp
void main() {
    auto records = exchange.GetRecords();
    auto cci = talib.CCI(records, 14);
    Log(cci);
}
```

### JavaScript Libraries

- http://mikemcl.github.io/decimal.js/
  ```javascript
  // Solve precision issues in JavaScript numerical calculations
  function main() {
      var x = -1.2
      var a = Decimal.abs(x)
      var b = new Decimal(x).abs()
      Log(a.equals(b))                           // true

      var y = 2.2
      var sum = Decimal.add(x, y)
      Log(sum.equals(new Decimal(x).plus(y)))    // true
  }
  ```
- http://underscorejs.org/
  ```javascript
  function main() {
      var sum = _.reduce([1, 2, 3], function(memo, num){return memo + num}, 0)
      Log(sum)
  }
  ```
- http://ta-lib.org/
  ```javascript
  function main(){
      var records = exchange.GetRecords()
      // Print all technical indicator data. On FMZ Quant Trading Platform, JavaScript strategies have the talib library built-in
      Log(talib.MACD(records))
      Log(talib.MACD(records, 12, 26, 9))
  }
  ```
- Dynamic Loading of JavaScript Libraries
  To use other third-party JavaScript libraries, you can dynamically load them as follows:
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

### C++ Library

- https://nlohmann.github.io/json/
  ```cpp
  void main() {
      json table = R"({"type": "table", "title": "Position Info", "cols": ["Column 1", "Column 2"], "rows": [["abc", "def"], ["ABC", "support color #ff0000"]]})"_json;
      LogStatus("`" + table.dump() + "`");
      LogStatus("First line message\n`" + table.dump() + "`\nThird line message");
      json arr = R"([])"_json;
      arr.push_back(table);
      arr.push_back(table);
      LogStatus("`" + arr.dump() + "`");

      table = R"({
          "type" : "table",
          "title" : "Position Operation",
          "cols" : ["Column 1", "Column 2", "Action"],
          "rows" : [
              ["abc", "def", {"type": "button", "cmd": "coverAll", "name": "Close"}]
          ]
      })"_json;
      LogStatus("`" + table.dump() + "`", "\n`" + R"({"type": "button", "cmd": "coverAll", "name": "Close"})"_json.dump() + "`");
  }
  ```

## Extended API Interface

FMZ Quant Trading Platform provides extended API interfaces, supporting programmatic access to various functions of the FMZ quantitative trading platform.

### Create ApiKey

FMZ Quant Trading Platform supports permission management for extended API interfaces, allowing you to set permissions for ```API KEY```. On the platform's [Account Settings](https://www.fmz.com/m/account) page under the "API Interface" option, click the "Create New ApiKey" button to create an extended ```API KEY```.

When creating an ```API KEY```, you can enter the ```*``` symbol in the "API Permissions" input box to enable all **extended API interface** permissions. To specify specific interface permissions, enter the corresponding extended API function names separated by commas, for example: ```GetRobotDetail,DeleteRobot```, which will grant this ```API KEY``` permission to call the **Get Live Trading Details** interface and **Delete Live Trading** interface.

On the ```API KEY``` management page, you can also perform operations such as **modify**, **disable**, and **delete** on created ```API KEY```s.

### Extended API Interface Return Codes

The data structure returned by the extended API interface is as follows:

```json
{
    "code":0,
    "data":{
        // ...
    }
}
```

The ```code``` field indicates the status code returned when calling the extended API interface.

| Description | Code |
| - | - |
| Execution successful | 0 |
| Invalid API KEY | 1 |
| Invalid signature | 2 |
| Nonce error | 3 |
| Incorrect method | 4 |
| Incorrect parameters | 5 |
| Internal unknown error | 6 |

### Live Trading Status Codes

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

### Authentication Methods

Two authentication methods are supported when calling extended API interfaces: ```token``` authentication and direct authentication.

#### Token Authentication

Use ```md5``` encryption for verification. Below are calling examples in ```Python``` and ```Golang```:

```python
#!/usr/bin/python
# -*- coding: utf-8 -*-
import time
import json
import ssl
ssl._create_default_https_context = ssl._create_unverified_context

try:
    import md5
    import urllib2
    from urllib import urlencode
except:
    import hashlib as md5
    import urllib.request as urllib2
    from urllib.parse import urlencode

accessKey = ''   # your API KEY
secretKey = ''

def api(method, *args):
    d = {
        'version': '1.0',
        'access_key': accessKey,
        'method': method,
        'args': json.dumps(list(args)),
        'nonce': int(time.time() * 1000),
        }

    d['sign'] = md5.md5(('%s|%s|%s|%d|%s' % (d['version'], d['method'], d['args'], d['nonce'], secretKey)).encode('utf-8')).hexdigest()
    # Note: urllib2.urlopen function may have timeout issues, you can set timeout, for example: urllib2.urlopen('https://www.fmz.com/api/v1', urlencode(d).encode('utf-8'), timeout=10) sets timeout to 10 seconds
    return json.loads(urllib2.urlopen('https://www.fmz.com/api/v1', urlencode(d).encode('utf-8')).read().decode('utf-8'))

# Return docker list
print(api('GetNodeList'))
# Return exchange list
print(api('GetPlatformList'))
# GetRobotList(offset, length, robotStatus, label), pass -1 to get all
print(api('GetRobotList', 0, 5, -1, 'member2'))
# CommandRobot(robotId, cmd) send command to live trading bot
print(api('CommandRobot', 123, 'ok'))
# StopRobot(robotId) return live trading bot status code
print(api('StopRobot', 123))
# RestartRobot(robotId) return live trading bot status code
print(api('RestartRobot', 123))
# GetRobotDetail(robotId) return live trading bot detailed information
print(api('GetRobotDetail', 123))
```

```go
package main

import (
    "fmt"
    "time"
    "encoding/json"
    "crypto/md5"
    "encoding/hex"
    "net/http"
    "io/ioutil"
    "strconv"
    "net/url"
)

// Fill in your FMZ platform API key
var apiKey string = ""
// Fill in your FMZ platform secret key
var secretKey string = ""
var baseApi string = "https://www.fmz.com/api/v1"

func api(method string, args ... interface{}) (ret interface{}) {
    // Process parameters
    jsonStr, err := json.Marshal(args)
    if err != nil {
        panic(err)
    }

    params := map[string]string{
        "version" : "1.0",
        "access_key" : apiKey,
        "method" : method,
        "args" : string(jsonStr),
        "nonce" : strconv.FormatInt(time.Now().UnixNano() / 1e6, 10),
    }

    data := fmt.Sprintf("%s|%s|%s|%v|%s", params["version"], params["method"], params["args"], params["nonce"], secretKey)
    h := md5.New()
    h.Write([]byte(data))
    sign := h.Sum(nil)

    params["sign"] = hex.EncodeToString(sign)

    // http request
    client := &http.Client{}

    // request
    urlValue := url.Values{}
    for k, v := range params {
        urlValue.Add(k, v)
    }
    urlStr := urlValue.Encode()
    request, err := http.NewRequest("GET", baseApi + "?" + urlStr, nil)
    if err != nil {
        panic(err)
    }

    resp, err := client.Do(request)
    if err != nil {
        panic(err)
    }

    defer resp.Body.Close()

    b, err := ioutil.ReadAll(resp.Body)
    if err != nil {
        panic(err)
    }

    ret = string(b)
    return
}

func main() {
    settings := map[string]interface{}{
        "name": "hedge test",
        "strategy": 104150,
        // K-line period parameter, 60 means 60 seconds
        "period": 60,
        "node" : 73938,
        "appid": "member2",
        "exchanges": []interface{}{
            map[string]interface{}{
                "eid": "Exchange",
                "label" : "test_bjex",
                "pair": "BTC_USDT",
                "meta" : map[string]interface{}{
                    // Fill in access key
                    "AccessKey": "",
                    // Fill in secret key
                    "SecretKey": "",
                    "Front" : "http://127.0.0.1:6666/exchange",
                },
            },
        },
    }

    method := "RestartRobot"
    fmt.Println("Call interface:", method)
    ret := api(method, 124577, settings)
    fmt.Println("main ret:", ret)
}
```

#### Direct Verification

Supports authentication without using ```token``` (direct ```secret_key``` authentication), allowing generation of URLs for direct access. For example, URLs for sending interactive commands directly to live trading bots can be used for ```Trading View``` or other ```WebHook``` callback scenarios. For the extended API interface ```CommandRobot()``` function, ```nonce``` verification is not performed, and there are no limits on access frequency or number of accesses for this interface.

For example: If the ```AccessKey``` in the created extended ```API KEY``` is: ```xxx```, and the ```SecretKey``` is: ```yyy```. Accessing the following link will send an interactive command message to the live trading bot with ID ```186515```, with the message content being the string: ```"ok12345"```.

```plaintext
https://www.fmz.com/api/v1?access_key=xxx&secret_key=yyy&method=CommandRobot&args=%5B186515%2C%22ok12345%22%5D
```

When direct authentication is supported, the ```Body``` data from the request can be obtained, only supporting the ```CommandRobot``` interface. For example, setting in ```Trading View```'s ```WebHook URL```:

```plaintext
https://www.fmz.com/api/v1?access_key=xxx&secret_key=yyy&method=CommandRobot&args=%5B186515%2C+%22%22%5D
```

Note that it must be set in this format: ```%5B186515%2C+%22%22%5D``` (before encoding: ```[186515, ""]```), where ```186515``` is the live trading bot ID on the FMZ Quant Trading Platform.

Simulating ```Trading View``` sending ```WebHook URL``` alerts:
```js
function main() {
    var options = {
        method: "POST",
        body: `{"test": 123}`,
        headers: {"Content-Type": "application/json"}
    }

    // WebHook URL alerts will automatically send POST requests, including required headers settings
    return HttpQuery("https://www.fmz.com/api/v1?access_key=xxx&secret_key=xxx&method=CommandRobot&args=%5B186515%2C+%22%22%5D", options)
}
```

Setting in ```Trading View``` message box (Body data to be sent in the request):
- JSON format:

  https://www.fmz.com/upload/asset/16d8a37ef80d9ccd0079.png

  ```plaintext
  {"close": {{close}}, "name": "aaa"}
  ```

  The live trading bot with ID ```186515``` will receive the interactive command string: ```{"close": 39773.75, "name": "aaa"}```.
- Text format:

  https://www.fmz.com/upload/asset/16d8a506dfbb6c60a077.png

  ```plaintext
  BTCUSDTPERP Crossing 39700.00 close: {{close}}
  ```

  The live trading bot with ID ```186515``` will receive the interactive command string: ```BTCUSDTPERP Crossing 39700.00 close: 39739.4```.

```Python```, ```Golang``` language call examples:

```python
#!/usr/bin/python
# -*- coding: utf-8 -*-

import json
import ssl

ssl._create_default_https_context = ssl._create_unverified_context

try:
    import urllib2
except:
    import urllib.request as urllib2

accessKey = 'your accessKey'
secretKey = 'your secretKey'

def api(method, *args):
    return json.loads(urllib2.urlopen(('https://www.fmz.com/api/v1?access_key=%s&secret_key=%s&method=%s&args=%s' % (accessKey, secretKey, method, json.dumps(list(args)))).replace(' ', '')).read().decode('utf-8'))

# If the API KEY doesn't have permission for this interface, calling print(api('RestartRobot', 186515)) will fail, returning data: {'code': 4, 'data': None}
# print(api('RestartRobot', 186515))

# Print detailed information of the live trading bot with ID: 186515
print(api('GetRobotDetail', 186515))
```

```go
package main

import (
    "fmt"
    "encoding/json"
    "net/http"
    "io/ioutil"
    "net/url"
)

// Fill in your own FMZ platform api key
var apiKey string = "your access_key"

// Fill in your own FMZ platform secret key
var secretKey string = "your secret_key"
var baseApi string = "https://www.fmz.com/api/v1"

func api(method string, args ... interface{}) (ret interface{}) {
    jsonStr, err := json.Marshal(args)
    if err != nil {
        panic(err)
    }

    params := map[string]string{
        "access_key" : apiKey,
        "secret_key" : secretKey,
        "method" : method,
        "args" : string(jsonStr),
    }

    // http request
    client := &http.Client{}

    // request
    urlValue := url.Values{}
    for k, v := range params {
        urlValue.Add(k, v)
    }
    urlStr := urlValue.Encode()
    request, err := http.NewRequest("GET", baseApi + "?" + urlStr, nil)
    if err != nil {
        panic(err)
    }

    resp, err := client.Do(request)
    if err != nil {
        panic(err)
    }

    defer resp.Body.Close()

    b, err := ioutil.ReadAll(resp.Body)
    if err != nil {
        panic(err)
    }

    ret = string(b)
    return
}

func main() {
    method := "GetRobotDetail"
    fmt.Println("Calling interface:", method)
    ret := api(method, 186515)
    fmt.Println("main ret:", ret)
}
```

[Implementing TradingView Alert Signal Trading Using FMZ Quant Trading Platform Extended API](https://www.fmz.com/digest-topic/5533)
[Implementing TradingView Alert Signal Trading Using FMZ Quant Trading Platform Extended API, Bilibili Video Link](https://www.bilibili.com/video/BV1Wk4y1k7zz/)

### Extended API Interface Details

- FMZ Quant Trading Platform Extended API Interface
  Append query parameters directly after ```https://www.fmz.com/api/v1``` (separated by ```?```). Below are the request parameters expressed in ```Python```:

  ```json
  {
      "version"   : "1.0",
      "access_key": "xxx",
      "method"    : "GetNodeList",
      "args"      : [],
      "nonce"     : 1516292399361,
      "sign"      : "085b63456c93hfb243a757366600f9c2"
  }
  ```

  | Field | Description |
  | - | - |
  | version    | Version number. |
  | access_key | AccessKey, apply on the account management page. |
  | method     | The specific method to call. |
  | args       | Parameter list for calling the method. |
  | nonce      | Timestamp in milliseconds, allowing a 1-hour deviation from standard timestamp. The nonce must be greater than the nonce value from the previous access. |
  | sign       | Signature. |

  Parameters are separated by ```&```, parameter names and values are connected by ```=```. Complete request URL (using ```method=GetNodeList``` as an example):

  ```plaintext
  https://www.fmz.com/api/v1?access_key=xxx&nonce=1516292399361&args=%5B%5D&sign=085b63456c93hfb243a757366600f9c2&version=1.0&method=GetNodeList
  ```

  Note: The request parameters do not include the ```secret_key``` parameter.
- Signature Method
  The encryption method for the ```sign``` parameter in the request is as follows, formatted as:

  ```plaintext
  version + "|" + method + "|" + args + "|" + nonce + "|" + secretKey
  ```

  After concatenating the string, use the ```MD5``` encryption algorithm to encrypt the string and convert it to a hexadecimal string. This value is used as the value of the ```sign``` parameter. For the signature part, refer to the ```Python``` code Extended API Interface ["Authentication Method"](/user-guide/extended-api-interface/authentication-method):

  ```python
  # Parameters
  d = {
      'version': '1.0',
      'access_key': accessKey,
      'method': method,
      'args': json.dumps(list(args)),
      'nonce': int(time.time() * 1000),
  }

  # Calculate sign signature
  d['sign'] = md5.md5(('%s|%s|%s|%d|%s' % (d['version'], d['method'], d['args'], d['nonce'], secretKey)).encode('utf-8')).hexdigest()
  ```
- Interface Business Errors:
  - Insufficient parameters:
    ```json
    {
        "code":0,
        "data":{
            "result":null,
            "error":"Params length incorrect"
        }
    }
    ```

##### GetNodeList

The ```GetNodeList``` method is used to retrieve the list of docker nodes under the FMZ Quant Trading Platform account corresponding to the ```API KEY``` in the request.

Parameters:

- N
- o
- 
- p
- a
- r
- a
- m
- e
- t
- e
- r
- s

Returns: `

Returns: `

Returns: `

Returns: j

Returns: s

Returns: o

Returns: n

Returns: 

Returns: {

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: c

Returns: o

Returns: d

Returns: e

Returns: "

Returns: :

Returns: 

Returns: 0

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: d

Returns: a

Returns: t

Returns: a

Returns: "

Returns: :

Returns: 

Returns: {

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: r

Returns: e

Returns: s

Returns: u

Returns: l

Returns: t

Returns: "

Returns: :

Returns: 

Returns: {

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: a

Returns: l

Returns: l

Returns: "

Returns: :

Returns: 

Returns: 1

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: n

Returns: o

Returns: d

Returns: e

Returns: s

Returns: "

Returns: :

Returns: 

Returns: [

Returns: {

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: b

Returns: u

Returns: i

Returns: l

Returns: d

Returns: "

Returns: :

Returns: 

Returns: "

Returns: 3

Returns: .

Returns: 7

Returns: "

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: c

Returns: i

Returns: t

Returns: y

Returns: "

Returns: :

Returns: 

Returns: "

Returns: .

Returns: .

Returns: .

Returns: "

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: c

Returns: r

Returns: e

Returns: a

Returns: t

Returns: e

Returns: d

Returns: "

Returns: :

Returns: 

Returns: "

Returns: 2

Returns: 0

Returns: 2

Returns: 4

Returns: -

Returns: 1

Returns: 1

Returns: -

Returns: 0

Returns: 8

Returns: 

Returns: 0

Returns: 9

Returns: :

Returns: 2

Returns: 1

Returns: :

Returns: 0

Returns: 8

Returns: "

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: d

Returns: a

Returns: t

Returns: e

Returns: "

Returns: :

Returns: 

Returns: "

Returns: 2

Returns: 0

Returns: 2

Returns: 4

Returns: -

Returns: 1

Returns: 1

Returns: -

Returns: 0

Returns: 8

Returns: 

Returns: 1

Returns: 6

Returns: :

Returns: 3

Returns: 7

Returns: :

Returns: 1

Returns: 6

Returns: "

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: f

Returns: o

Returns: r

Returns: w

Returns: a

Returns: r

Returns: d

Returns: "

Returns: :

Returns: 

Returns: "

Returns: .

Returns: .

Returns: .

Returns: "

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: g

Returns: u

Returns: i

Returns: d

Returns: "

Returns: :

Returns: 

Returns: "

Returns: .

Returns: .

Returns: .

Returns: "

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: h

Returns: o

Returns: s

Returns: t

Returns: "

Returns: :

Returns: 

Returns: "

Returns: n

Returns: o

Returns: d

Returns: e

Returns: .

Returns: f

Returns: m

Returns: z

Returns: .

Returns: c

Returns: o

Returns: m

Returns: :

Returns: 9

Returns: 9

Returns: 0

Returns: 2

Returns: "

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: i

Returns: d

Returns: "

Returns: :

Returns: 

Returns: 1

Returns: 2

Returns: 3

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: i

Returns: p

Returns: "

Returns: :

Returns: 

Returns: "

Returns: .

Returns: .

Returns: .

Returns: "

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: i

Returns: s

Returns: _

Returns: o

Returns: w

Returns: n

Returns: e

Returns: r

Returns: "

Returns: :

Returns: 

Returns: t

Returns: r

Returns: u

Returns: e

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: l

Returns: o

Returns: a

Returns: d

Returns: e

Returns: d

Returns: "

Returns: :

Returns: 

Returns: 0

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: n

Returns: a

Returns: m

Returns: e

Returns: "

Returns: :

Returns: 

Returns: "

Returns: M

Returns: a

Returns: c

Returns: B

Returns: o

Returns: o

Returns: k

Returns: -

Returns: P

Returns: r

Returns: o

Returns: -

Returns: 2

Returns: .

Returns: l

Returns: o

Returns: c

Returns: a

Returns: l

Returns: "

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: o

Returns: n

Returns: l

Returns: i

Returns: n

Returns: e

Returns: "

Returns: :

Returns: 

Returns: t

Returns: r

Returns: u

Returns: e

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: o

Returns: s

Returns: "

Returns: :

Returns: 

Returns: "

Returns: d

Returns: a

Returns: r

Returns: w

Returns: i

Returns: n

Returns: /

Returns: a

Returns: m

Returns: d

Returns: 6

Returns: 4

Returns: "

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: p

Returns: e

Returns: e

Returns: r

Returns: "

Returns: :

Returns: 

Returns: "

Returns: .

Returns: .

Returns: .

Returns: "

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: p

Returns: u

Returns: b

Returns: l

Returns: i

Returns: c

Returns: "

Returns: :

Returns: 

Returns: 0

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: r

Returns: e

Returns: g

Returns: i

Returns: o

Returns: n

Returns: "

Returns: :

Returns: 

Returns: "

Returns: .

Returns: .

Returns: .

Returns: "

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: t

Returns: u

Returns: n

Returns: n

Returns: e

Returns: l

Returns: "

Returns: :

Returns: 

Returns: f

Returns: a

Returns: l

Returns: s

Returns: e

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: v

Returns: e

Returns: r

Returns: s

Returns: i

Returns: o

Returns: n

Returns: "

Returns: :

Returns: 

Returns: "

Returns: .

Returns: .

Returns: .

Returns: "

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: w

Returns: d

Returns: "

Returns: :

Returns: 

Returns: 0

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: }

Returns: ]

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: }

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: e

Returns: r

Returns: r

Returns: o

Returns: r

Returns: "

Returns: :

Returns: 

Returns: n

Returns: u

Returns: l

Returns: l

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: }

Returns: 

Returns: }

Returns: 

Returns: `

Returns: `

Returns: `

Returns: 

Returns: 

Returns: R

Returns: e

Returns: t

Returns: u

Returns: r

Returns: n

Returns: 

Returns: v

Returns: a

Returns: l

Returns: u

Returns: e

Returns: 

Returns: f

Returns: i

Returns: e

Returns: l

Returns: d

Returns: 

Returns: d

Returns: e

Returns: s

Returns: c

Returns: r

Returns: i

Returns: p

Returns: t

Returns: i

Returns: o

Returns: n

Returns: s

Returns: 

Returns: (

Returns: f

Returns: i

Returns: e

Returns: l

Returns: d

Returns: s

Returns: 

Returns: w

Returns: i

Returns: t

Returns: h

Returns: 

Returns: o

Returns: b

Returns: v

Returns: i

Returns: o

Returns: u

Returns: s

Returns: 

Returns: l

Returns: i

Returns: t

Returns: e

Returns: r

Returns: a

Returns: l

Returns: 

Returns: m

Returns: e

Returns: a

Returns: n

Returns: i

Returns: n

Returns: g

Returns: s

Returns: 

Returns: a

Returns: r

Returns: e

Returns: 

Returns: n

Returns: o

Returns: t

Returns: 

Returns: e

Returns: l

Returns: a

Returns: b

Returns: o

Returns: r

Returns: a

Returns: t

Returns: e

Returns: d

Returns: )

Returns: :

Returns: 

Returns: -

Returns: 

Returns: a

Returns: l

Returns: l

Returns: :

Returns: 

Returns: T

Returns: o

Returns: t

Returns: a

Returns: l

Returns: 

Returns: n

Returns: u

Returns: m

Returns: b

Returns: e

Returns: r

Returns: 

Returns: o

Returns: f

Returns: 

Returns: d

Returns: o

Returns: c

Returns: k

Returns: e

Returns: r

Returns: 

Returns: n

Returns: o

Returns: d

Returns: e

Returns: s

Returns: 

Returns: a

Returns: s

Returns: s

Returns: o

Returns: c

Returns: i

Returns: a

Returns: t

Returns: e

Returns: d

Returns: 

Returns: w

Returns: i

Returns: t

Returns: h

Returns: 

Returns: t

Returns: h

Returns: e

Returns: 

Returns: c

Returns: u

Returns: r

Returns: r

Returns: e

Returns: n

Returns: t

Returns: 

Returns: a

Returns: c

Returns: c

Returns: o

Returns: u

Returns: n

Returns: t

Returns: .

Returns: 

Returns: -

Returns: 

Returns: n

Returns: o

Returns: d

Returns: e

Returns: s

Returns: :

Returns: 

Returns: L

Returns: i

Returns: s

Returns: t

Returns: 

Returns: o

Returns: f

Returns: 

Returns: d

Returns: e

Returns: t

Returns: a

Returns: i

Returns: l

Returns: e

Returns: d

Returns: 

Returns: i

Returns: n

Returns: f

Returns: o

Returns: r

Returns: m

Returns: a

Returns: t

Returns: i

Returns: o

Returns: n

Returns: 

Returns: f

Returns: o

Returns: r

Returns: 

Returns: d

Returns: o

Returns: c

Returns: k

Returns: e

Returns: r

Returns: 

Returns: n

Returns: o

Returns: d

Returns: e

Returns: s

Returns: .

Returns: 

Returns: 

Returns: 

Returns: -

Returns: 

Returns: b

Returns: u

Returns: i

Returns: l

Returns: d

Returns: :

Returns: 

Returns: V

Returns: e

Returns: r

Returns: s

Returns: i

Returns: o

Returns: n

Returns: 

Returns: n

Returns: u

Returns: m

Returns: b

Returns: e

Returns: r

Returns: .

Returns: 

Returns: 

Returns: 

Returns: -

Returns: 

Returns: c

Returns: i

Returns: t

Returns: y

Returns: :

Returns: 

Returns: C

Returns: i

Returns: t

Returns: y

Returns: 

Returns: l

Returns: o

Returns: c

Returns: a

Returns: t

Returns: i

Returns: o

Returns: n

Returns: .

Returns: 

Returns: 

Returns: 

Returns: -

Returns: 

Returns: i

Returns: s

Returns: _

Returns: o

Returns: w

Returns: n

Returns: e

Returns: r

Returns: :

Returns: 

Returns: t

Returns: r

Returns: u

Returns: e

Returns: 

Returns: i

Returns: n

Returns: d

Returns: i

Returns: c

Returns: a

Returns: t

Returns: e

Returns: s

Returns: 

Returns: p

Returns: r

Returns: i

Returns: v

Returns: a

Returns: t

Returns: e

Returns: 

Returns: d

Returns: o

Returns: c

Returns: k

Returns: e

Returns: r

Returns: ,

Returns: 

Returns: f

Returns: a

Returns: l

Returns: s

Returns: e

Returns: 

Returns: i

Returns: n

Returns: d

Returns: i

Returns: c

Returns: a

Returns: t

Returns: e

Returns: s

Returns: 

Returns: p

Returns: u

Returns: b

Returns: l

Returns: i

Returns: c

Returns: 

Returns: d

Returns: o

Returns: c

Returns: k

Returns: e

Returns: r

Returns: .

Returns: 

Returns: 

Returns: 

Returns: -

Returns: 

Returns: l

Returns: o

Returns: a

Returns: d

Returns: e

Returns: d

Returns: :

Returns: 

Returns: L

Returns: o

Returns: a

Returns: d

Returns: 

Returns: a

Returns: m

Returns: o

Returns: u

Returns: n

Returns: t

Returns: ,

Returns: 

Returns: i

Returns: .

Returns: e

Returns: .

Returns: ,

Returns: 

Returns: t

Returns: h

Returns: e

Returns: 

Returns: n

Returns: u

Returns: m

Returns: b

Returns: e

Returns: r

Returns: 

Returns: o

Returns: f

Returns: 

Returns: c

Returns: u

Returns: r

Returns: r

Returns: e

Returns: n

Returns: t

Returns: l

Returns: y

Returns: 

Returns: r

Returns: u

Returns: n

Returns: n

Returns: i

Returns: n

Returns: g

Returns: 

Returns: s

Returns: t

Returns: r

Returns: a

Returns: t

Returns: e

Returns: g

Returns: y

Returns: 

Returns: i

Returns: n

Returns: s

Returns: t

Returns: a

Returns: n

Returns: c

Returns: e

Returns: s

Returns: .

Returns: 

Returns: 

Returns: 

Returns: -

Returns: 

Returns: p

Returns: u

Returns: b

Returns: l

Returns: i

Returns: c

Returns: :

Returns: 

Returns: 0

Returns: 

Returns: i

Returns: n

Returns: d

Returns: i

Returns: c

Returns: a

Returns: t

Returns: e

Returns: s

Returns: 

Returns: p

Returns: r

Returns: i

Returns: v

Returns: a

Returns: t

Returns: e

Returns: 

Returns: d

Returns: o

Returns: c

Returns: k

Returns: e

Returns: r

Returns: ,

Returns: 

Returns: 1

Returns: 

Returns: i

Returns: n

Returns: d

Returns: i

Returns: c

Returns: a

Returns: t

Returns: e

Returns: s

Returns: 

Returns: p

Returns: u

Returns: b

Returns: l

Returns: i

Returns: c

Returns: 

Returns: d

Returns: o

Returns: c

Returns: k

Returns: e

Returns: r

Returns: .

Returns: 

Returns: 

Returns: 

Returns: -

Returns: 

Returns: r

Returns: e

Returns: g

Returns: i

Returns: o

Returns: n

Returns: :

Returns: 

Returns: G

Returns: e

Returns: o

Returns: g

Returns: r

Returns: a

Returns: p

Returns: h

Returns: i

Returns: c

Returns: 

Returns: l

Returns: o

Returns: c

Returns: a

Returns: t

Returns: i

Returns: o

Returns: n

Returns: .

Returns: 

Returns: 

Returns: 

Returns: -

Returns: 

Returns: v

Returns: e

Returns: r

Returns: s

Returns: i

Returns: o

Returns: n

Returns: :

Returns: 

Returns: D

Returns: e

Returns: t

Returns: a

Returns: i

Returns: l

Returns: e

Returns: d

Returns: 

Returns: v

Returns: e

Returns: r

Returns: s

Returns: i

Returns: o

Returns: n

Returns: 

Returns: i

Returns: n

Returns: f

Returns: o

Returns: r

Returns: m

Returns: a

Returns: t

Returns: i

Returns: o

Returns: n

Returns: 

Returns: o

Returns: f

Returns: 

Returns: t

Returns: h

Returns: e

Returns: 

Returns: d

Returns: o

Returns: c

Returns: k

Returns: e

Returns: r

Returns: .

Returns: 

Returns: 

Returns: 

Returns: -

Returns: 

Returns: w

Returns: d

Returns: :

Returns: 

Returns: O

Returns: f

Returns: f

Returns: l

Returns: i

Returns: n

Returns: e

Returns: 

Returns: a

Returns: l

Returns: a

Returns: r

Returns: m

Returns: 

Returns: s

Returns: w

Returns: i

Returns: t

Returns: c

Returns: h

Returns: ,

Returns: 

Returns: 0

Returns: 

Returns: i

Returns: n

Returns: d

Returns: i

Returns: c

Returns: a

Returns: t

Returns: e

Returns: s

Returns: 

Returns: n

Returns: o

Returns: t

Returns: 

Returns: e

Returns: n

Returns: a

Returns: b

Returns: l

Returns: e

Returns: d

Returns: .

Returns: 

Returns: O

Returns: n

Returns: e

Returns: -

Returns: c

Returns: l

Returns: i

Returns: c

Returns: k

Returns: 

Returns: d

Returns: e

Returns: p

Returns: l

Returns: o

Returns: y

Returns: e

Returns: d

Returns: 

Returns: d

Returns: o

Returns: c

Returns: k

Returns: e

Returns: r

Returns: s

Returns: 

Returns: c

Returns: o

Returns: n

Returns: t

Returns: a

Returns: i

Returns: n

Returns: 

Returns: a

Returns: d

Returns: d

Returns: i

Returns: t

Returns: i

Returns: o

Returns: n

Returns: a

Returns: l

Returns: 

Returns: i

Returns: n

Returns: f

Returns: o

Returns: r

Returns: m

Returns: a

Returns: t

Returns: i

Returns: o

Returns: n

Returns: ,

Returns: 

Returns: w

Returns: i

Returns: t

Returns: h

Returns: 

Returns: r

Returns: e

Returns: l

Returns: a

Returns: t

Returns: e

Returns: d

Returns: 

Returns: f

Returns: i

Returns: e

Returns: l

Returns: d

Returns: s

Returns: 

Returns: p

Returns: r

Returns: e

Returns: f

Returns: i

Returns: x

Returns: e

Returns: d

Returns: 

Returns: b

Returns: y

Returns: 

Returns: `

Returns: `

Returns: `

Returns: e

Returns: c

Returns: s

Returns: _

Returns: `

Returns: `

Returns: `

Returns: 

Returns: a

Returns: n

Returns: d

Returns: 

Returns: `

Returns: `

Returns: `

Returns: u

Returns: n

Returns: i

Returns: t

Returns: _

Returns: `

Returns: `

Returns: `

Returns: ,

Returns: 

Returns: r

Returns: e

Returns: c

Returns: o

Returns: r

Returns: d

Returns: i

Returns: n

Returns: g

Returns: 

Returns: i

Returns: n

Returns: f

Returns: o

Returns: r

Returns: m

Returns: a

Returns: t

Returns: i

Returns: o

Returns: n

Returns: 

Returns: a

Returns: b

Returns: o

Returns: u

Returns: t

Returns: 

Returns: t

Returns: h

Returns: e

Returns: 

Returns: o

Returns: n

Returns: e

Returns: -

Returns: c

Returns: l

Returns: i

Returns: c

Returns: k

Returns: 

Returns: d

Returns: e

Returns: p

Returns: l

Returns: o

Returns: y

Returns: e

Returns: d

Returns: 

Returns: d

Returns: o

Returns: c

Returns: k

Returns: e

Returns: r

Returns: 

Returns: s

Returns: e

Returns: r

Returns: v

Returns: e

Returns: r

Returns: 

Returns: (

Returns: o

Returns: p

Returns: e

Returns: r

Returns: a

Returns: t

Returns: o

Returns: r

Returns: 

Returns: n

Returns: a

Returns: m

Returns: e

Returns: ,

Returns: 

Returns: c

Returns: o

Returns: n

Returns: f

Returns: i

Returns: g

Returns: u

Returns: r

Returns: a

Returns: t

Returns: i

Returns: o

Returns: n

Returns: ,

Returns: 

Returns: s

Returns: t

Returns: a

Returns: t

Returns: u

Returns: s

Returns: ,

Returns: 

Returns: e

Returns: t

Returns: c

Returns: .

Returns: )

Returns: ,

Returns: 

Returns: b

Returns: i

Returns: l

Returns: l

Returns: i

Returns: n

Returns: g

Returns: 

Returns: c

Returns: y

Returns: c

Returns: l

Returns: e

Returns: ,

Returns: 

Returns: p

Returns: r

Returns: i

Returns: c

Returns: e

Returns: ,

Returns: 

Returns: a

Returns: n

Returns: d

Returns: 

Returns: o

Returns: t

Returns: h

Returns: e

Returns: r

Returns: 

Returns: i

Returns: n

Returns: f

Returns: o

Returns: r

Returns: m

Returns: a

Returns: t

Returns: i

Returns: o

Returns: n

Returns: ,

Returns: 

Returns: w

Returns: h

Returns: i

Returns: c

Returns: h

Returns: 

Returns: w

Returns: i

Returns: l

Returns: l

Returns: 

Returns: n

Returns: o

Returns: t

Returns: 

Returns: b

Returns: e

Returns: 

Returns: d

Returns: e

Returns: t

Returns: a

Returns: i

Returns: l

Returns: e

Returns: d

Returns: 

Returns: h

Returns: e

Returns: r

Returns: e

Returns: .

##### GetRobotGroupList

The ```GetRobotGroupList``` method is used to get the list of live trading groups under the FMZ Quant Trading Platform account corresponding to the ```API KEY``` in the request.

Parameters:

- N
- o
- 
- p
- a
- r
- a
- m
- e
- t
- e
- r
- s

Returns: `

Returns: `

Returns: `

Returns: j

Returns: s

Returns: o

Returns: n

Returns: 

Returns: {

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: c

Returns: o

Returns: d

Returns: e

Returns: "

Returns: :

Returns: 

Returns: 0

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: d

Returns: a

Returns: t

Returns: a

Returns: "

Returns: :

Returns: 

Returns: {

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: r

Returns: e

Returns: s

Returns: u

Returns: l

Returns: t

Returns: "

Returns: :

Returns: 

Returns: {

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: i

Returns: t

Returns: e

Returns: m

Returns: s

Returns: "

Returns: :

Returns: 

Returns: [

Returns: {

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: i

Returns: d

Returns: "

Returns: :

Returns: 

Returns: 3

Returns: 4

Returns: 1

Returns: 7

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: n

Returns: a

Returns: m

Returns: e

Returns: "

Returns: :

Returns: 

Returns: "

Returns: T

Returns: e

Returns: s

Returns: t

Returns: "

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: }

Returns: ,

Returns: 

Returns: {

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: i

Returns: d

Returns: "

Returns: :

Returns: 

Returns: 3

Returns: 6

Returns: 0

Returns: 8

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: n

Returns: a

Returns: m

Returns: e

Returns: "

Returns: :

Returns: 

Returns: "

Returns: L

Returns: i

Returns: v

Returns: e

Returns: 

Returns: T

Returns: r

Returns: a

Returns: d

Returns: i

Returns: n

Returns: g

Returns: 

Returns: D

Returns: e

Returns: m

Returns: o

Returns: "

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: }

Returns: ]

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: }

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: e

Returns: r

Returns: r

Returns: o

Returns: r

Returns: "

Returns: :

Returns: 

Returns: n

Returns: u

Returns: l

Returns: l

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: }

Returns: 

Returns: }

Returns: 

Returns: `

Returns: `

Returns: `

Returns: 

Returns: 

Returns: -

Returns: 

Returns: i

Returns: t

Returns: e

Returns: m

Returns: s

Returns: :

Returns: 

Returns: L

Returns: i

Returns: v

Returns: e

Returns: 

Returns: t

Returns: r

Returns: a

Returns: d

Returns: i

Returns: n

Returns: g

Returns: 

Returns: g

Returns: r

Returns: o

Returns: u

Returns: p

Returns: 

Returns: i

Returns: n

Returns: f

Returns: o

Returns: r

Returns: m

Returns: a

Returns: t

Returns: i

Returns: o

Returns: n

Returns: .

Returns: 

Returns: 

Returns: 

Returns: -

Returns: 

Returns: i

Returns: d

Returns: :

Returns: 

Returns: L

Returns: i

Returns: v

Returns: e

Returns: 

Returns: t

Returns: r

Returns: a

Returns: d

Returns: i

Returns: n

Returns: g

Returns: 

Returns: g

Returns: r

Returns: o

Returns: u

Returns: p

Returns: 

Returns: I

Returns: D

Returns: .

Returns: 

Returns: 

Returns: 

Returns: -

Returns: 

Returns: n

Returns: a

Returns: m

Returns: e

Returns: :

Returns: 

Returns: L

Returns: i

Returns: v

Returns: e

Returns: 

Returns: t

Returns: r

Returns: a

Returns: d

Returns: i

Returns: n

Returns: g

Returns: 

Returns: g

Returns: r

Returns: o

Returns: u

Returns: p

Returns: 

Returns: n

Returns: a

Returns: m

Returns: e

Returns: .

Returns: 

Returns: T

Returns: h

Returns: e

Returns: 

Returns: `

Returns: `

Returns: `

Returns: i

Returns: t

Returns: e

Returns: m

Returns: s

Returns: `

Returns: `

Returns: `

Returns: 

Returns: f

Returns: i

Returns: e

Returns: l

Returns: d

Returns: 

Returns: o

Returns: n

Returns: l

Returns: y

Returns: 

Returns: r

Returns: e

Returns: c

Returns: o

Returns: r

Returns: d

Returns: s

Returns: 

Returns: n

Returns: e

Returns: w

Returns: l

Returns: y

Returns: 

Returns: c

Returns: r

Returns: e

Returns: a

Returns: t

Returns: e

Returns: d

Returns: 

Returns: g

Returns: r

Returns: o

Returns: u

Returns: p

Returns: s

Returns: ,

Returns: 

Returns: t

Returns: h

Returns: e

Returns: 

Returns: "

Returns: D

Returns: e

Returns: f

Returns: a

Returns: u

Returns: l

Returns: t

Returns: "

Returns: 

Returns: g

Returns: r

Returns: o

Returns: u

Returns: p

Returns: 

Returns: i

Returns: s

Returns: 

Returns: n

Returns: o

Returns: t

Returns: 

Returns: i

Returns: n

Returns: c

Returns: l

Returns: u

Returns: d

Returns: e

Returns: d

Returns: 

Returns: i

Returns: n

Returns: 

Returns: `

Returns: `

Returns: `

Returns: i

Returns: t

Returns: e

Returns: m

Returns: s

Returns: `

Returns: `

Returns: `

Returns: .

##### GetPlatformList

The ```GetPlatformList``` method is used to get the list of configured exchanges under the FMZ Quant Trading Platform account corresponding to the ```API KEY``` in the request.

Parameters:

- N
- o
- 
- p
- a
- r
- a
- m
- e
- t
- e
- r
- s

Returns: `

Returns: `

Returns: `

Returns: j

Returns: s

Returns: o

Returns: n

Returns: 

Returns: {

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: c

Returns: o

Returns: d

Returns: e

Returns: "

Returns: :

Returns: 

Returns: 0

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: d

Returns: a

Returns: t

Returns: a

Returns: "

Returns: :

Returns: 

Returns: {

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: r

Returns: e

Returns: s

Returns: u

Returns: l

Returns: t

Returns: "

Returns: :

Returns: 

Returns: {

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: a

Returns: l

Returns: l

Returns: "

Returns: :

Returns: 

Returns: 2

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: p

Returns: l

Returns: a

Returns: t

Returns: f

Returns: o

Returns: r

Returns: m

Returns: s

Returns: "

Returns: :

Returns: 

Returns: [

Returns: {

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: c

Returns: a

Returns: t

Returns: e

Returns: g

Returns: o

Returns: r

Returns: y

Returns: "

Returns: :

Returns: 

Returns: "

Returns: 加

Returns: 密

Returns: 货

Returns: 币

Returns: |

Returns: |

Returns: C

Returns: r

Returns: y

Returns: p

Returns: t

Returns: o

Returns: "

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: d

Returns: a

Returns: t

Returns: e

Returns: "

Returns: :

Returns: 

Returns: "

Returns: 2

Returns: 0

Returns: 2

Returns: 3

Returns: -

Returns: 1

Returns: 2

Returns: -

Returns: 0

Returns: 7

Returns: 

Returns: 1

Returns: 3

Returns: :

Returns: 4

Returns: 4

Returns: :

Returns: 5

Returns: 2

Returns: "

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: e

Returns: i

Returns: d

Returns: "

Returns: :

Returns: 

Returns: "

Returns: B

Returns: i

Returns: n

Returns: a

Returns: n

Returns: c

Returns: e

Returns: "

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: i

Returns: d

Returns: "

Returns: :

Returns: 

Returns: 1

Returns: 2

Returns: 3

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: l

Returns: a

Returns: b

Returns: e

Returns: l

Returns: "

Returns: :

Returns: 

Returns: "

Returns: 币

Returns: 安

Returns: "

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: l

Returns: o

Returns: g

Returns: o

Returns: "

Returns: :

Returns: 

Returns: "

Returns: .

Returns: .

Returns: .

Returns: "

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: n

Returns: a

Returns: m

Returns: e

Returns: "

Returns: :

Returns: 

Returns: "

Returns: 币

Returns: 安

Returns: 现

Returns: 货

Returns: |

Returns: B

Returns: i

Returns: n

Returns: a

Returns: n

Returns: c

Returns: e

Returns: "

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: s

Returns: t

Returns: o

Returns: c

Returns: k

Returns: s

Returns: "

Returns: :

Returns: 

Returns: [

Returns: "

Returns: B

Returns: T

Returns: C

Returns: _

Returns: U

Returns: S

Returns: D

Returns: T

Returns: "

Returns: ,

Returns: 

Returns: "

Returns: L

Returns: T

Returns: C

Returns: _

Returns: U

Returns: S

Returns: D

Returns: T

Returns: "

Returns: ,

Returns: 

Returns: "

Returns: E

Returns: T

Returns: H

Returns: _

Returns: U

Returns: S

Returns: D

Returns: T

Returns: "

Returns: ,

Returns: 

Returns: "

Returns: E

Returns: T

Returns: C

Returns: _

Returns: U

Returns: S

Returns: D

Returns: T

Returns: "

Returns: ,

Returns: 

Returns: "

Returns: B

Returns: T

Returns: C

Returns: _

Returns: T

Returns: U

Returns: S

Returns: D

Returns: "

Returns: ,

Returns: 

Returns: "

Returns: E

Returns: T

Returns: H

Returns: _

Returns: T

Returns: U

Returns: S

Returns: D

Returns: "

Returns: ,

Returns: 

Returns: "

Returns: B

Returns: N

Returns: B

Returns: _

Returns: T

Returns: U

Returns: S

Returns: D

Returns: "

Returns: ]

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: w

Returns: e

Returns: b

Returns: s

Returns: i

Returns: t

Returns: e

Returns: "

Returns: :

Returns: 

Returns: "

Returns: .

Returns: .

Returns: .

Returns: "

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: }

Returns: ,

Returns: 

Returns: {

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: c

Returns: a

Returns: t

Returns: e

Returns: g

Returns: o

Returns: r

Returns: y

Returns: "

Returns: :

Returns: 

Returns: "

Returns: 通

Returns: 用

Returns: 协

Returns: 议

Returns: |

Returns: C

Returns: u

Returns: s

Returns: t

Returns: o

Returns: m

Returns: 

Returns: P

Returns: r

Returns: o

Returns: t

Returns: o

Returns: c

Returns: o

Returns: l

Returns: "

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: d

Returns: a

Returns: t

Returns: e

Returns: "

Returns: :

Returns: 

Returns: "

Returns: 2

Returns: 0

Returns: 2

Returns: 0

Returns: -

Returns: 1

Returns: 1

Returns: -

Returns: 0

Returns: 9

Returns: 

Returns: 1

Returns: 1

Returns: :

Returns: 2

Returns: 3

Returns: :

Returns: 4

Returns: 8

Returns: "

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: e

Returns: i

Returns: d

Returns: "

Returns: :

Returns: 

Returns: "

Returns: E

Returns: x

Returns: c

Returns: h

Returns: a

Returns: n

Returns: g

Returns: e

Returns: "

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: i

Returns: d

Returns: "

Returns: :

Returns: 

Returns: 1

Returns: 2

Returns: 3

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: l

Returns: a

Returns: b

Returns: e

Returns: l

Returns: "

Returns: :

Returns: 

Returns: "

Returns: X

Returns: X

Returns: 交

Returns: 易

Returns: 所

Returns: R

Returns: E

Returns: S

Returns: T

Returns: 协

Returns: 议

Returns: "

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: l

Returns: o

Returns: g

Returns: o

Returns: "

Returns: :

Returns: 

Returns: "

Returns: .

Returns: .

Returns: .

Returns: "

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: n

Returns: a

Returns: m

Returns: e

Returns: "

Returns: :

Returns: 

Returns: "

Returns: 通

Returns: 用

Returns: 协

Returns: 议

Returns: |

Returns: C

Returns: u

Returns: s

Returns: t

Returns: o

Returns: m

Returns: 

Returns: P

Returns: r

Returns: o

Returns: t

Returns: o

Returns: c

Returns: o

Returns: l

Returns: "

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: s

Returns: t

Returns: o

Returns: c

Returns: k

Returns: s

Returns: "

Returns: :

Returns: 

Returns: [

Returns: "

Returns: B

Returns: T

Returns: C

Returns: _

Returns: U

Returns: S

Returns: D

Returns: T

Returns: "

Returns: ,

Returns: 

Returns: "

Returns: E

Returns: T

Returns: H

Returns: _

Returns: U

Returns: S

Returns: D

Returns: T

Returns: "

Returns: ]

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: w

Returns: e

Returns: b

Returns: s

Returns: i

Returns: t

Returns: e

Returns: "

Returns: :

Returns: 

Returns: "

Returns: "

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: }

Returns: ]

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: }

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: e

Returns: r

Returns: r

Returns: o

Returns: r

Returns: "

Returns: :

Returns: 

Returns: n

Returns: u

Returns: l

Returns: l

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: }

Returns: 

Returns: }

Returns: 

Returns: `

Returns: `

Returns: `

Returns: 

Returns: 

Returns: -

Returns: 

Returns: a

Returns: l

Returns: l

Returns: :

Returns: 

Returns: T

Returns: o

Returns: t

Returns: a

Returns: l

Returns: 

Returns: n

Returns: u

Returns: m

Returns: b

Returns: e

Returns: r

Returns: 

Returns: o

Returns: f

Returns: 

Returns: c

Returns: o

Returns: n

Returns: f

Returns: i

Returns: g

Returns: u

Returns: r

Returns: e

Returns: d

Returns: 

Returns: e

Returns: x

Returns: c

Returns: h

Returns: a

Returns: n

Returns: g

Returns: e

Returns: 

Returns: o

Returns: b

Returns: j

Returns: e

Returns: c

Returns: t

Returns: s

Returns: .

Returns: 

Returns: -

Returns: 

Returns: p

Returns: l

Returns: a

Returns: t

Returns: f

Returns: o

Returns: r

Returns: m

Returns: s

Returns: :

Returns: 

Returns: E

Returns: x

Returns: c

Returns: h

Returns: a

Returns: n

Returns: g

Returns: e

Returns: 

Returns: r

Returns: e

Returns: l

Returns: a

Returns: t

Returns: e

Returns: d

Returns: 

Returns: i

Returns: n

Returns: f

Returns: o

Returns: r

Returns: m

Returns: a

Returns: t

Returns: i

Returns: o

Returns: n

Returns: .

Returns: 

Returns: 

Returns: 

Returns: -

Returns: 

Returns: e

Returns: i

Returns: d

Returns: :

Returns: 

Returns: E

Returns: x

Returns: c

Returns: h

Returns: a

Returns: n

Returns: g

Returns: e

Returns: 

Returns: i

Returns: d

Returns: e

Returns: n

Returns: t

Returns: i

Returns: f

Returns: i

Returns: e

Returns: r

Returns: 

Returns: o

Returns: n

Returns: 

Returns: t

Returns: h

Returns: e

Returns: 

Returns: F

Returns: M

Returns: Z

Returns: 

Returns: Q

Returns: u

Returns: a

Returns: n

Returns: t

Returns: 

Returns: T

Returns: r

Returns: a

Returns: d

Returns: i

Returns: n

Returns: g

Returns: 

Returns: P

Returns: l

Returns: a

Returns: t

Returns: f

Returns: o

Returns: r

Returns: m

Returns: ,

Returns: 

Returns: `

Returns: `

Returns: `

Returns: e

Returns: i

Returns: d

Returns: `

Returns: `

Returns: `

Returns: 

Returns: i

Returns: s

Returns: 

Returns: r

Returns: e

Returns: q

Returns: u

Returns: i

Returns: r

Returns: e

Returns: d

Returns: 

Returns: i

Returns: n

Returns: 

Returns: c

Returns: e

Returns: r

Returns: t

Returns: a

Returns: i

Returns: n

Returns: 

Returns: c

Returns: o

Returns: n

Returns: f

Returns: i

Returns: g

Returns: u

Returns: r

Returns: a

Returns: t

Returns: i

Returns: o

Returns: n

Returns: s

Returns: 

Returns: a

Returns: n

Returns: d

Returns: 

Returns: p

Returns: a

Returns: r

Returns: a

Returns: m

Returns: e

Returns: t

Returns: e

Returns: r

Returns: s

Returns: .

##### GetRobotList

The ```GetRobotList``` method is used to get the list of live trading bots under the FMZ Quant Trading Platform account corresponding to the ```API KEY``` in the request.

Parameters:

- `offset` (number, optional): Offset setting for pagination query.
- `length` (number, optional): Data length setting for pagination query.
- `robotStatus` (number, optional): Specify the status of live trading bots to query, refer to Extended API Interface ["Live Trading Status Codes"](/user-guide/extended-api-interface/live-trading-status-codes), pass ```-1``` to get all live trading bots.
- `label` (string, optional): Specify the custom label of live trading bots to query, can filter all live trading bots containing this label.
- `keyWord` (string, optional): Query keyword.

Returns: `

Returns: `

Returns: `

Returns: j

Returns: s

Returns: o

Returns: n

Returns: 

Returns: {

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: c

Returns: o

Returns: d

Returns: e

Returns: "

Returns: :

Returns: 

Returns: 0

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: d

Returns: a

Returns: t

Returns: a

Returns: "

Returns: :

Returns: 

Returns: {

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: r

Returns: e

Returns: s

Returns: u

Returns: l

Returns: t

Returns: "

Returns: :

Returns: 

Returns: {

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: a

Returns: l

Returns: l

Returns: "

Returns: :

Returns: 

Returns: 1

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: c

Returns: o

Returns: n

Returns: c

Returns: u

Returns: r

Returns: r

Returns: e

Returns: n

Returns: t

Returns: "

Returns: :

Returns: 

Returns: 0

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: r

Returns: o

Returns: b

Returns: o

Returns: t

Returns: s

Returns: "

Returns: :

Returns: 

Returns: [

Returns: {

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: c

Returns: h

Returns: a

Returns: r

Returns: g

Returns: e

Returns: _

Returns: t

Returns: i

Returns: m

Returns: e

Returns: "

Returns: :

Returns: 

Returns: 1

Returns: 7

Returns: 3

Returns: 1

Returns: 6

Returns: 5

Returns: 4

Returns: 8

Returns: 4

Returns: 6

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: d

Returns: a

Returns: t

Returns: e

Returns: "

Returns: :

Returns: 

Returns: "

Returns: 2

Returns: 0

Returns: 2

Returns: 4

Returns: -

Returns: 1

Returns: 1

Returns: -

Returns: 1

Returns: 2

Returns: 

Returns: 1

Returns: 4

Returns: :

Returns: 0

Returns: 5

Returns: :

Returns: 2

Returns: 9

Returns: "

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: e

Returns: n

Returns: d

Returns: _

Returns: t

Returns: i

Returns: m

Returns: e

Returns: "

Returns: :

Returns: 

Returns: "

Returns: 2

Returns: 0

Returns: 2

Returns: 4

Returns: -

Returns: 1

Returns: 1

Returns: -

Returns: 1

Returns: 5

Returns: 

Returns: 1

Returns: 4

Returns: :

Returns: 5

Returns: 6

Returns: :

Returns: 3

Returns: 2

Returns: "

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: f

Returns: i

Returns: x

Returns: e

Returns: d

Returns: _

Returns: i

Returns: d

Returns: "

Returns: :

Returns: 

Returns: 4

Returns: 5

Returns: 0

Returns: 9

Returns: 1

Returns: 5

Returns: 3

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: i

Returns: d

Returns: "

Returns: :

Returns: 

Returns: 5

Returns: 9

Returns: 1

Returns: 0

Returns: 2

Returns: 6

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: i

Returns: s

Returns: _

Returns: s

Returns: a

Returns: n

Returns: d

Returns: b

Returns: o

Returns: x

Returns: "

Returns: :

Returns: 

Returns: 0

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: n

Returns: a

Returns: m

Returns: e

Returns: "

Returns: :

Returns: 

Returns: "

Returns: T

Returns: e

Returns: s

Returns: t

Returns: "

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: n

Returns: o

Returns: d

Returns: e

Returns: _

Returns: g

Returns: u

Returns: i

Returns: d

Returns: "

Returns: :

Returns: 

Returns: "

Returns: 4

Returns: 5

Returns: 8

Returns: 9

Returns: 1

Returns: b

Returns: c

Returns: f

Returns: 3

Returns: d

Returns: 5

Returns: 7

Returns: f

Returns: 9

Returns: 9

Returns: b

Returns: 0

Returns: 8

Returns: a

Returns: 4

Returns: 3

Returns: d

Returns: f

Returns: f

Returns: 7

Returns: 6

Returns: e

Returns: e

Returns: 1

Returns: e

Returns: a

Returns: 1

Returns: "

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: n

Returns: o

Returns: d

Returns: e

Returns: _

Returns: i

Returns: d

Returns: "

Returns: :

Returns: 

Returns: 4

Returns: 5

Returns: 1

Returns: 9

Returns: 1

Returns: 5

Returns: 3

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: n

Returns: o

Returns: d

Returns: e

Returns: _

Returns: p

Returns: u

Returns: b

Returns: l

Returns: i

Returns: c

Returns: "

Returns: :

Returns: 

Returns: 0

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: p

Returns: r

Returns: o

Returns: f

Returns: i

Returns: t

Returns: "

Returns: :

Returns: 

Returns: 0

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: p

Returns: u

Returns: b

Returns: l

Returns: i

Returns: c

Returns: "

Returns: :

Returns: 

Returns: 0

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: r

Returns: e

Returns: f

Returns: r

Returns: e

Returns: s

Returns: h

Returns: "

Returns: :

Returns: 

Returns: 1

Returns: 7

Returns: 3

Returns: 1

Returns: 6

Returns: 5

Returns: 1

Returns: 2

Returns: 5

Returns: 7

Returns: 0

Returns: 0

Returns: 0

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: s

Returns: t

Returns: a

Returns: r

Returns: t

Returns: _

Returns: t

Returns: i

Returns: m

Returns: e

Returns: "

Returns: :

Returns: 

Returns: "

Returns: 2

Returns: 0

Returns: 2

Returns: 4

Returns: -

Returns: 1

Returns: 1

Returns: -

Returns: 1

Returns: 5

Returns: 

Returns: 1

Returns: 4

Returns: :

Returns: 5

Returns: 6

Returns: :

Returns: 3

Returns: 0

Returns: "

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: s

Returns: t

Returns: a

Returns: t

Returns: u

Returns: s

Returns: "

Returns: :

Returns: 

Returns: 3

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: s

Returns: t

Returns: r

Returns: a

Returns: t

Returns: e

Returns: g

Returns: y

Returns: _

Returns: i

Returns: d

Returns: "

Returns: :

Returns: 

Returns: 4

Returns: 1

Returns: 1

Returns: 6

Returns: 7

Returns: 0

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: s

Returns: t

Returns: r

Returns: a

Returns: t

Returns: e

Returns: g

Returns: y

Returns: _

Returns: i

Returns: s

Returns: o

Returns: w

Returns: n

Returns: e

Returns: r

Returns: "

Returns: :

Returns: 

Returns: t

Returns: r

Returns: u

Returns: e

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: s

Returns: t

Returns: r

Returns: a

Returns: t

Returns: e

Returns: g

Returns: y

Returns: _

Returns: l

Returns: a

Returns: n

Returns: g

Returns: u

Returns: a

Returns: g

Returns: e

Returns: "

Returns: :

Returns: 

Returns: 0

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: s

Returns: t

Returns: r

Returns: a

Returns: t

Returns: e

Returns: g

Returns: y

Returns: _

Returns: n

Returns: a

Returns: m

Returns: e

Returns: "

Returns: :

Returns: 

Returns: "

Returns: T

Returns: e

Returns: s

Returns: t

Returns: "

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: s

Returns: t

Returns: r

Returns: a

Returns: t

Returns: e

Returns: g

Returns: y

Returns: _

Returns: p

Returns: u

Returns: b

Returns: l

Returns: i

Returns: c

Returns: "

Returns: :

Returns: 

Returns: 0

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: u

Returns: i

Returns: d

Returns: "

Returns: :

Returns: 

Returns: "

Returns: 1

Returns: 0

Returns: 5

Returns: e

Returns: d

Returns: 6

Returns: e

Returns: 5

Returns: 1

Returns: 1

Returns: c

Returns: c

Returns: 9

Returns: 7

Returns: 7

Returns: 9

Returns: 2

Returns: 1

Returns: 6

Returns: 1

Returns: 0

Returns: f

Returns: d

Returns: b

Returns: b

Returns: 7

Returns: e

Returns: 2

Returns: a

Returns: 1

Returns: d

Returns: 6

Returns: "

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: w

Returns: d

Returns: "

Returns: :

Returns: 

Returns: 0

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: }

Returns: ]

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: }

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: e

Returns: r

Returns: r

Returns: o

Returns: r

Returns: "

Returns: :

Returns: 

Returns: n

Returns: u

Returns: l

Returns: l

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: }

Returns: 

Returns: }

Returns: 

Returns: `

Returns: `

Returns: `

Returns: 

Returns: 

Returns: -

Returns: 

Returns: r

Returns: o

Returns: b

Returns: o

Returns: t

Returns: s

Returns: :

Returns: 

Returns: L

Returns: i

Returns: v

Returns: e

Returns: 

Returns: t

Returns: r

Returns: a

Returns: d

Returns: i

Returns: n

Returns: g

Returns: 

Returns: b

Returns: o

Returns: t

Returns: 

Returns: i

Returns: n

Returns: f

Returns: o

Returns: r

Returns: m

Returns: a

Returns: t

Returns: i

Returns: o

Returns: n

Returns: 

Returns: 

Returns: 

Returns: -

Returns: 

Returns: g

Returns: r

Returns: o

Returns: u

Returns: p

Returns: _

Returns: i

Returns: d

Returns: :

Returns: 

Returns: L

Returns: i

Returns: v

Returns: e

Returns: 

Returns: t

Returns: r

Returns: a

Returns: d

Returns: i

Returns: n

Returns: g

Returns: 

Returns: b

Returns: o

Returns: t

Returns: 

Returns: g

Returns: r

Returns: o

Returns: u

Returns: p

Returns: 

Returns: I

Returns: D

Returns: ;

Returns: 

Returns: i

Returns: f

Returns: 

Returns: t

Returns: h

Returns: e

Returns: 

Returns: l

Returns: i

Returns: v

Returns: e

Returns: 

Returns: t

Returns: r

Returns: a

Returns: d

Returns: i

Returns: n

Returns: g

Returns: 

Returns: b

Returns: o

Returns: t

Returns: 

Returns: i

Returns: s

Returns: 

Returns: i

Returns: n

Returns: 

Returns: t

Returns: h

Returns: e

Returns: 

Returns: d

Returns: e

Returns: f

Returns: a

Returns: u

Returns: l

Returns: t

Returns: 

Returns: g

Returns: r

Returns: o

Returns: u

Returns: p

Returns: ,

Returns: 

Returns: t

Returns: h

Returns: e

Returns: 

Returns: `

Returns: `

Returns: `

Returns: g

Returns: r

Returns: o

Returns: u

Returns: p

Returns: _

Returns: i

Returns: d

Returns: `

Returns: `

Returns: `

Returns: 

Returns: f

Returns: i

Returns: e

Returns: l

Returns: d

Returns: 

Returns: i

Returns: s

Returns: 

Returns: n

Returns: o

Returns: t

Returns: 

Returns: i

Returns: n

Returns: c

Returns: l

Returns: u

Returns: d

Returns: e

Returns: d

Returns: .

Taking the Extended API Interface ["Authentication Method"](/user-guide/extended-api-interface/authentication-method) in ```Python``` language as an example:

```print(api('GetRobotList'))```: Get all live trading bot information.

```print(api('GetRobotList', 'member2'))```: Print all live trading bot information with custom label member2.

```print(api('GetRobotList', 0, 5, -1, 'member2'))```: Pagination query, starting from offset 0, returning at most 5 live trading bots with label member2.

##### CommandRobot

The ```CommandRobot``` method is used to send interactive commands to a live trading bot under the FMZ Quant Trading Platform account corresponding to the ```API KEY``` in the request. The bot Id that receives the interactive command is specified by the ```robotId``` parameter, and the interactive command is captured and returned by the ```GetCommand()``` function called in the strategy.

Parameters:

- `robotId` (number, required): The ```robotId``` parameter is used to specify the bot Id that receives the interactive command. You can use the ```GetRobotList``` method to get information about bots under the account, which includes the bot Id.
- `cmd` (string, required): The ```cmd``` parameter is the interactive command sent to the bot. The ```GetCommand()``` function in the bot strategy will capture this interactive command and trigger the strategy's interaction logic. For the specific implementation of interaction logic in the strategy code, please refer to the ```GetCommand()``` function description in the [FMZ Quant Trading Platform API Manual](https://www.fmz.com/syntax-guide#fun_getcommand).

Returns: `

Returns: `

Returns: `

Returns: j

Returns: s

Returns: o

Returns: n

Returns: 

Returns: {

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: c

Returns: o

Returns: d

Returns: e

Returns: "

Returns: :

Returns: 0

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: d

Returns: a

Returns: t

Returns: a

Returns: "

Returns: :

Returns: {

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: r

Returns: e

Returns: s

Returns: u

Returns: l

Returns: t

Returns: "

Returns: :

Returns: t

Returns: r

Returns: u

Returns: e

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: e

Returns: r

Returns: r

Returns: o

Returns: r

Returns: "

Returns: :

Returns: n

Returns: u

Returns: l

Returns: l

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: }

Returns: 

Returns: }

Returns: 

Returns: `

Returns: `

Returns: `

Returns: 

Returns: 

Returns: -

Returns: 

Returns: r

Returns: e

Returns: s

Returns: u

Returns: l

Returns: t

Returns: :

Returns: 

Returns: W

Returns: h

Returns: e

Returns: t

Returns: h

Returns: e

Returns: r

Returns: 

Returns: t

Returns: h

Returns: e

Returns: 

Returns: i

Returns: n

Returns: t

Returns: e

Returns: r

Returns: a

Returns: c

Returns: t

Returns: i

Returns: v

Returns: e

Returns: 

Returns: c

Returns: o

Returns: m

Returns: m

Returns: a

Returns: n

Returns: d

Returns: 

Returns: w

Returns: a

Returns: s

Returns: 

Returns: s

Returns: e

Returns: n

Returns: t

Returns: 

Returns: s

Returns: u

Returns: c

Returns: c

Returns: e

Returns: s

Returns: s

Returns: f

Returns: u

Returns: l

Returns: l

Returns: y

Returns: .

Returns: 

Returns: W

Returns: h

Returns: e

Returns: n

Returns: 

Returns: s

Returns: e

Returns: n

Returns: d

Returns: i

Returns: n

Returns: g

Returns: 

Returns: a

Returns: 

Returns: c

Returns: o

Returns: m

Returns: m

Returns: a

Returns: n

Returns: d

Returns: 

Returns: t

Returns: o

Returns: 

Returns: a

Returns: 

Returns: b

Returns: o

Returns: t

Returns: 

Returns: t

Returns: h

Returns: a

Returns: t

Returns: 

Returns: i

Returns: s

Returns: 

Returns: n

Returns: o

Returns: t

Returns: 

Returns: r

Returns: u

Returns: n

Returns: n

Returns: i

Returns: n

Returns: g

Returns: ,

Returns: 

Returns: t

Returns: h

Returns: e

Returns: 

Returns: r

Returns: e

Returns: s

Returns: u

Returns: l

Returns: t

Returns: 

Returns: i

Returns: n

Returns: 

Returns: t

Returns: h

Returns: e

Returns: 

Returns: r

Returns: e

Returns: t

Returns: u

Returns: r

Returns: n

Returns: e

Returns: d

Returns: 

Returns: d

Returns: a

Returns: t

Returns: a

Returns: 

Returns: w

Returns: i

Returns: l

Returns: l

Returns: 

Returns: b

Returns: e

Returns: 

Returns: f

Returns: a

Returns: l

Returns: s

Returns: e

Returns: .

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

If you use the Python test script in this section to access the FMZ Quant Trading Platform's extended API: ```api("CommandRobot", 123, "test command")```, the bot with Id 123 will receive the interactive command: ```test command```, and output it through the Log function.

##### StopRobot

The ```StopRobot``` method is used to stop a live trading bot under the FMZ Quant Trading Platform account corresponding to the ```API KEY``` in the request. The bot Id to be stopped is specified by the ```robotId``` parameter.

Parameters:

- `robotId` (number, required): The ```robotId``` parameter is used to specify the bot Id to be stopped. You can obtain the bot information under the account through the ```GetRobotList``` method, which includes the bot Id.

Returns: `

Returns: `

Returns: `

Returns: j

Returns: s

Returns: o

Returns: n

Returns: 

Returns: {

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: c

Returns: o

Returns: d

Returns: e

Returns: "

Returns: :

Returns: 0

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: d

Returns: a

Returns: t

Returns: a

Returns: "

Returns: :

Returns: {

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: r

Returns: e

Returns: s

Returns: u

Returns: l

Returns: t

Returns: "

Returns: :

Returns: 2

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: e

Returns: r

Returns: r

Returns: o

Returns: r

Returns: "

Returns: :

Returns: n

Returns: u

Returns: l

Returns: l

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: }

Returns: 

Returns: }

Returns: 

Returns: `

Returns: `

Returns: `

Returns: 

Returns: 

Returns: -

Returns: 

Returns: r

Returns: e

Returns: s

Returns: u

Returns: l

Returns: t

Returns: :

Returns: 

Returns: B

Returns: o

Returns: t

Returns: 

Returns: s

Returns: t

Returns: a

Returns: t

Returns: u

Returns: s

Returns: 

Returns: c

Returns: o

Returns: d

Returns: e

Returns: ,

Returns: 

Returns: 2

Returns: 

Returns: i

Returns: n

Returns: d

Returns: i

Returns: c

Returns: a

Returns: t

Returns: e

Returns: s

Returns: 

Returns: s

Returns: t

Returns: o

Returns: p

Returns: p

Returns: i

Returns: n

Returns: g

Returns: .

##### RestartRobot

The ```RestartRobot``` method is used to restart a live trading bot under the FMZ Quant Trading Platform account corresponding to the ```API KEY``` in the request. The bot ID to be restarted is specified by the ```robotId``` parameter.

Parameters:

- `robotId` (number, required): The ```robotId``` parameter is used to specify the ID of the live trading bot to be restarted. You can use the ```GetRobotList``` method to get information about live trading bots under the account, which includes the bot ID.
- `settings` (JSON object, optional): Live trading configuration parameters. The ```settings``` parameter format is as follows:

```json
{
    "appid":"test",
    "args":[],
    "exchanges":[
        {"pair":"SOL_USDT","pid":123},
        {"pair":"ETH_USDT","pid":456}
    ],
    "name":"Test",
    "node":123,
    "period":60,
    "strategy":123
}
```

- appid: Custom field
  Can be used to define labels.
- args: Strategy parameter settings
  Structure is an array, with each element being a parameter. For example, if the strategy has a parameter ```Interval``` and you want to set ```Interval``` to 500 when restarting the strategy, ```args``` should contain: ```["Interval", 500]```, i.e.: ```"args": [["Interval", 500]]```.
- exchanges: Exchange object configuration bound to the live trading bot
  Structure is an array, where each element is an exchange object configuration.
  - Can bind exchange objects already configured on the platform
    Using ```pid``` configuration: ```{"pair":"SOL_USDT","pid":123}```; ```pid``` can be queried through the ```GetPlatformList``` interface, where the ```id``` field in the returned data is the exchange ```pid```.
  - Can directly pass configuration information to bind exchange objects
    Using ```eid``` configuration: ```{"eid":"Huobi","label":"test Huobi","meta":{"AccessKey":"123","SecretKey":"123"},"pair":"BCH_BTC"}```; Sensitive information such as the passed ```API KEY``` will not be stored by the FMZ Quant Trading Platform, and this data will be directly forwarded to the docker program. If using this type of configuration, this information must be configured each time creating or restarting a live trading bot.
  - Can bind **General Protocol** exchange objects
    Can pass configuration information: ```{"eid":"Exchange","label":"test exchange","pair":"BTC_USDT","meta":{"AccessKey":"123","SecretKey":"123","Front":"http://127.0.0.1:6666/test"}}```.
    The ```label``` attribute is used to set a label for the current **General Protocol** connected exchange object, which can be retrieved in the strategy using the ```exchange.GetLabel()``` function.
- name: Strategy name
- node: Docker ID
  Specifies which docker to run on. If this attribute is not set, the system will automatically allocate.
- period: Default K-line period
  K-line period parameter, 60 means 60 seconds.
- strategy: Strategy ID
  Can be obtained using the ```GetStrategyList``` method.

Returns: `

Returns: `

Returns: `

Returns: j

Returns: s

Returns: o

Returns: n

Returns: 

Returns: {

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: c

Returns: o

Returns: d

Returns: e

Returns: "

Returns: :

Returns: 0

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: d

Returns: a

Returns: t

Returns: a

Returns: "

Returns: :

Returns: {

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: r

Returns: e

Returns: s

Returns: u

Returns: l

Returns: t

Returns: "

Returns: :

Returns: 1

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: e

Returns: r

Returns: r

Returns: o

Returns: r

Returns: "

Returns: :

Returns: n

Returns: u

Returns: l

Returns: l

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: }

Returns: 

Returns: }

Returns: 

Returns: `

Returns: `

Returns: `

Returns: 

Returns: 

Returns: -

Returns: 

Returns: r

Returns: e

Returns: s

Returns: u

Returns: l

Returns: t

Returns: :

Returns: 

Returns: L

Returns: i

Returns: v

Returns: e

Returns: 

Returns: t

Returns: r

Returns: a

Returns: d

Returns: i

Returns: n

Returns: g

Returns: 

Returns: s

Returns: t

Returns: a

Returns: t

Returns: u

Returns: s

Returns: 

Returns: c

Returns: o

Returns: d

Returns: e

Returns: ,

Returns: 

Returns: 1

Returns: 

Returns: i

Returns: n

Returns: d

Returns: i

Returns: c

Returns: a

Returns: t

Returns: e

Returns: s

Returns: 

Returns: r

Returns: u

Returns: n

Returns: n

Returns: i

Returns: n

Returns: g

Returns: .

If the live trading bot was created through the extended API interface, it must be restarted using the extended API interface ```RestartRobot```, and the ```settings``` parameter must be passed. For live trading bots created on the platform page, they can be restarted through the extended API interface or by clicking the button on the live trading page. The ```settings``` parameter can be passed or not. If only the ```robotId``` parameter is passed, it will start running according to the current settings of the live trading bot.

##### GetRobotDetail

The ```GetRobotDetail``` method is used to get detailed information of a live trading bot under the FMZ Quant Trading Platform account corresponding to the ```API KEY``` in the request. The detailed information of the live trading bot to be retrieved is specified by the ```robotId``` parameter.

Parameters:

- `robotId` (number, required): The ```robotId``` parameter is used to specify the ID of the live trading bot for which to retrieve detailed information. The live trading bot information under the account, including the bot ID, can be obtained through the ```GetRobotList``` method.

Returns: `

Returns: `

Returns: `

Returns: j

Returns: s

Returns: o

Returns: n

Returns: 

Returns: {

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: c

Returns: o

Returns: d

Returns: e

Returns: "

Returns: :

Returns: 

Returns: 0

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: d

Returns: a

Returns: t

Returns: a

Returns: "

Returns: :

Returns: 

Returns: {

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: r

Returns: e

Returns: s

Returns: u

Returns: l

Returns: t

Returns: "

Returns: :

Returns: 

Returns: {

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: r

Returns: o

Returns: b

Returns: o

Returns: t

Returns: "

Returns: :

Returns: 

Returns: {

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: c

Returns: h

Returns: a

Returns: r

Returns: g

Returns: e

Returns: _

Returns: t

Returns: i

Returns: m

Returns: e

Returns: "

Returns: :

Returns: 

Returns: 1

Returns: 7

Returns: 3

Returns: 2

Returns: 2

Returns: 4

Returns: 6

Returns: 5

Returns: 3

Returns: 9

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: c

Returns: h

Returns: a

Returns: r

Returns: g

Returns: e

Returns: d

Returns: "

Returns: :

Returns: 

Returns: 5

Returns: 8

Returns: 5

Returns: 0

Returns: 0

Returns: 0

Returns: 0

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: c

Returns: o

Returns: n

Returns: s

Returns: u

Returns: m

Returns: e

Returns: d

Returns: "

Returns: :

Returns: 

Returns: 5

Returns: 3

Returns: 7

Returns: 5

Returns: 0

Returns: 0

Returns: 0

Returns: 0

Returns: 0

Returns: 0

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: d

Returns: a

Returns: t

Returns: e

Returns: "

Returns: :

Returns: 

Returns: "

Returns: 2

Returns: 0

Returns: 1

Returns: 8

Returns: -

Returns: 1

Returns: 2

Returns: -

Returns: 2

Returns: 8

Returns: 

Returns: 1

Returns: 4

Returns: :

Returns: 3

Returns: 4

Returns: :

Returns: 5

Returns: 1

Returns: "

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: f

Returns: a

Returns: v

Returns: o

Returns: r

Returns: i

Returns: t

Returns: e

Returns: "

Returns: :

Returns: 

Returns: {

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: a

Returns: d

Returns: d

Returns: e

Returns: d

Returns: "

Returns: :

Returns: 

Returns: f

Returns: a

Returns: l

Returns: s

Returns: e

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: t

Returns: y

Returns: p

Returns: e

Returns: "

Returns: :

Returns: 

Returns: "

Returns: R

Returns: "

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: }

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: f

Returns: i

Returns: x

Returns: e

Returns: d

Returns: _

Returns: i

Returns: d

Returns: "

Returns: :

Returns: 

Returns: 1

Returns: 2

Returns: 3

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: h

Returns: i

Returns: t

Returns: s

Returns: "

Returns: :

Returns: 

Returns: 1

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: i

Returns: d

Returns: "

Returns: :

Returns: 

Returns: 1

Returns: 2

Returns: 3

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: i

Returns: s

Returns: _

Returns: d

Returns: e

Returns: l

Returns: e

Returns: t

Returns: e

Returns: d

Returns: "

Returns: :

Returns: 

Returns: 0

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: i

Returns: s

Returns: _

Returns: m

Returns: a

Returns: n

Returns: a

Returns: g

Returns: e

Returns: r

Returns: "

Returns: :

Returns: 

Returns: t

Returns: r

Returns: u

Returns: e

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: i

Returns: s

Returns: _

Returns: s

Returns: a

Returns: n

Returns: d

Returns: b

Returns: o

Returns: x

Returns: "

Returns: :

Returns: 

Returns: 0

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: n

Returns: a

Returns: m

Returns: e

Returns: "

Returns: :

Returns: 

Returns: "

Returns: T

Returns: e

Returns: s

Returns: t

Returns: "

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: n

Returns: o

Returns: d

Returns: e

Returns: _

Returns: i

Returns: d

Returns: "

Returns: :

Returns: 

Returns: 1

Returns: 2

Returns: 3

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: p

Returns: e

Returns: x

Returns: c

Returns: h

Returns: a

Returns: n

Returns: g

Returns: e

Returns: s

Returns: "

Returns: :

Returns: 

Returns: {

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: 1

Returns: 2

Returns: 3

Returns: "

Returns: :

Returns: 

Returns: "

Returns: F

Returns: u

Returns: t

Returns: u

Returns: r

Returns: e

Returns: s

Returns: _

Returns: O

Returns: K

Returns: C

Returns: o

Returns: i

Returns: n

Returns: "

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: }

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: p

Returns: h

Returns: a

Returns: s

Returns: h

Returns: "

Returns: :

Returns: 

Returns: {

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: 1

Returns: 2

Returns: 3

Returns: "

Returns: :

Returns: 

Returns: "

Returns: c

Returns: a

Returns: 1

Returns: a

Returns: c

Returns: a

Returns: 7

Returns: 4

Returns: b

Returns: 9

Returns: c

Returns: f

Returns: 7

Returns: d

Returns: 8

Returns: 6

Returns: 2

Returns: 4

Returns: f

Returns: 2

Returns: a

Returns: f

Returns: 2

Returns: d

Returns: a

Returns: c

Returns: 0

Returns: 1

Returns: e

Returns: 3

Returns: 6

Returns: d

Returns: "

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: }

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: p

Returns: l

Returns: a

Returns: b

Returns: e

Returns: l

Returns: s

Returns: "

Returns: :

Returns: 

Returns: {

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: 1

Returns: 2

Returns: 3

Returns: "

Returns: :

Returns: 

Returns: "

Returns: O

Returns: K

Returns: E

Returns: X

Returns: 

Returns: F

Returns: u

Returns: t

Returns: u

Returns: r

Returns: e

Returns: s

Returns: 

Returns: V

Returns: 5

Returns: "

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: }

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: p

Returns: r

Returns: i

Returns: o

Returns: r

Returns: i

Returns: t

Returns: y

Returns: "

Returns: :

Returns: 

Returns: 0

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: p

Returns: r

Returns: o

Returns: f

Returns: i

Returns: t

Returns: "

Returns: :

Returns: 

Returns: 0

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: p

Returns: u

Returns: b

Returns: l

Returns: i

Returns: c

Returns: "

Returns: :

Returns: 

Returns: 0

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: r

Returns: e

Returns: f

Returns: r

Returns: e

Returns: s

Returns: h

Returns: "

Returns: :

Returns: 

Returns: 1

Returns: 7

Returns: 3

Returns: 2

Returns: 2

Returns: 4

Returns: 4

Returns: 4

Returns: 5

Returns: 3

Returns: 0

Returns: 0

Returns: 0

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: r

Returns: o

Returns: b

Returns: o

Returns: t

Returns: _

Returns: a

Returns: r

Returns: g

Returns: s

Returns: "

Returns: :

Returns: 

Returns: "

Returns: [

Returns: ]

Returns: "

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: s

Returns: t

Returns: a

Returns: r

Returns: t

Returns: _

Returns: t

Returns: i

Returns: m

Returns: e

Returns: "

Returns: :

Returns: 

Returns: "

Returns: 2

Returns: 0

Returns: 2

Returns: 4

Returns: -

Returns: 1

Returns: 1

Returns: -

Returns: 2

Returns: 2

Returns: 

Returns: 1

Returns: 1

Returns: :

Returns: 0

Returns: 0

Returns: :

Returns: 4

Returns: 8

Returns: "

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: s

Returns: t

Returns: a

Returns: t

Returns: u

Returns: s

Returns: "

Returns: :

Returns: 

Returns: 1

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: s

Returns: t

Returns: r

Returns: a

Returns: t

Returns: e

Returns: g

Returns: y

Returns: _

Returns: a

Returns: r

Returns: g

Returns: s

Returns: "

Returns: :

Returns: 

Returns: "

Returns: [

Returns: ]

Returns: "

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: s

Returns: t

Returns: r

Returns: a

Returns: t

Returns: e

Returns: g

Returns: y

Returns: _

Returns: e

Returns: x

Returns: c

Returns: h

Returns: a

Returns: n

Returns: g

Returns: e

Returns: _

Returns: p

Returns: a

Returns: i

Returns: r

Returns: s

Returns: "

Returns: :

Returns: 

Returns: "

Returns: [

Returns: 6

Returns: 0

Returns: ,

Returns: [

Returns: 1

Returns: 2

Returns: 3

Returns: ]

Returns: ,

Returns: [

Returns: \

Returns: "

Returns: E

Returns: T

Returns: H

Returns: _

Returns: U

Returns: S

Returns: D

Returns: T

Returns: \

Returns: "

Returns: ]

Returns: ]

Returns: "

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: s

Returns: t

Returns: r

Returns: a

Returns: t

Returns: e

Returns: g

Returns: y

Returns: _

Returns: i

Returns: d

Returns: "

Returns: :

Returns: 

Returns: 1

Returns: 2

Returns: 3

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: s

Returns: t

Returns: r

Returns: a

Returns: t

Returns: e

Returns: g

Returns: y

Returns: _

Returns: l

Returns: a

Returns: s

Returns: t

Returns: _

Returns: m

Returns: o

Returns: d

Returns: i

Returns: f

Returns: i

Returns: e

Returns: d

Returns: "

Returns: :

Returns: 

Returns: "

Returns: 2

Returns: 0

Returns: 2

Returns: 4

Returns: -

Returns: 1

Returns: 1

Returns: -

Returns: 2

Returns: 1

Returns: 

Returns: 1

Returns: 6

Returns: :

Returns: 4

Returns: 9

Returns: :

Returns: 2

Returns: 5

Returns: "

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: s

Returns: t

Returns: r

Returns: a

Returns: t

Returns: e

Returns: g

Returns: y

Returns: _

Returns: n

Returns: a

Returns: m

Returns: e

Returns: "

Returns: :

Returns: 

Returns: "

Returns: T

Returns: e

Returns: s

Returns: t

Returns: "

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: s

Returns: t

Returns: r

Returns: a

Returns: t

Returns: e

Returns: g

Returns: y

Returns: _

Returns: p

Returns: u

Returns: b

Returns: l

Returns: i

Returns: c

Returns: "

Returns: :

Returns: 

Returns: "

Returns: 0

Returns: "

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: u

Returns: i

Returns: d

Returns: "

Returns: :

Returns: 

Returns: "

Returns: 1

Returns: 0

Returns: 5

Returns: e

Returns: d

Returns: 6

Returns: e

Returns: 5

Returns: 1

Returns: b

Returns: c

Returns: c

Returns: 1

Returns: 7

Returns: 7

Returns: 9

Returns: 2

Returns: a

Returns: 6

Returns: 1

Returns: 0

Returns: f

Returns: d

Returns: b

Returns: b

Returns: 7

Returns: e

Returns: 2

Returns: a

Returns: 1

Returns: d

Returns: 6

Returns: "

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: u

Returns: s

Returns: e

Returns: r

Returns: n

Returns: a

Returns: m

Returns: e

Returns: "

Returns: :

Returns: 

Returns: "

Returns: a

Returns: b

Returns: c

Returns: "

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: w

Returns: d

Returns: "

Returns: :

Returns: 

Returns: 0

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: }

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: }

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: e

Returns: r

Returns: r

Returns: o

Returns: r

Returns: "

Returns: :

Returns: 

Returns: n

Returns: u

Returns: l

Returns: l

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: }

Returns: 

Returns: }

Returns: 

Returns: `

Returns: `

Returns: `

Returns: 

Returns: 

Returns: -

Returns: 

Returns: c

Returns: h

Returns: a

Returns: r

Returns: g

Returns: e

Returns: _

Returns: t

Returns: i

Returns: m

Returns: e

Returns: :

Returns: 

Returns: N

Returns: e

Returns: x

Returns: t

Returns: 

Returns: b

Returns: i

Returns: l

Returns: l

Returns: i

Returns: n

Returns: g

Returns: 

Returns: t

Returns: i

Returns: m

Returns: e

Returns: ,

Returns: 

Returns: i

Returns: .

Returns: e

Returns: .

Returns: ,

Returns: 

Returns: t

Returns: h

Returns: e

Returns: 

Returns: v

Returns: a

Returns: l

Returns: i

Returns: d

Returns: 

Returns: e

Returns: x

Returns: p

Returns: i

Returns: r

Returns: a

Returns: t

Returns: i

Returns: o

Returns: n

Returns: 

Returns: t

Returns: i

Returns: m

Returns: e

Returns: 

Returns: a

Returns: f

Returns: t

Returns: e

Returns: r

Returns: 

Returns: c

Returns: u

Returns: r

Returns: r

Returns: e

Returns: n

Returns: t

Returns: 

Returns: b

Returns: i

Returns: l

Returns: l

Returns: i

Returns: n

Returns: g

Returns: .

Returns: 

Returns: -

Returns: 

Returns: c

Returns: h

Returns: a

Returns: r

Returns: g

Returns: e

Returns: d

Returns: :

Returns: 

Returns: T

Returns: i

Returns: m

Returns: e

Returns: 

Returns: c

Returns: o

Returns: n

Returns: s

Returns: u

Returns: m

Returns: e

Returns: d

Returns: .

Returns: 

Returns: -

Returns: 

Returns: c

Returns: o

Returns: n

Returns: s

Returns: u

Returns: m

Returns: e

Returns: d

Returns: :

Returns: 

Returns: A

Returns: m

Returns: o

Returns: u

Returns: n

Returns: t

Returns: 

Returns: c

Returns: o

Returns: n

Returns: s

Returns: u

Returns: m

Returns: e

Returns: d

Returns: 

Returns: (

Returns: 0

Returns: .

Returns: 1

Returns: 2

Returns: 5

Returns: 

Returns: U

Returns: S

Returns: D

Returns: 

Returns: =

Returns: 

Returns: 1

Returns: 2

Returns: 5

Returns: 0

Returns: 0

Returns: 0

Returns: 0

Returns: 0

Returns: 

Returns: /

Returns: 

Returns: 1

Returns: e

Returns: 8

Returns: )

Returns: .

Returns: 

Returns: -

Returns: 

Returns: d

Returns: a

Returns: t

Returns: e

Returns: :

Returns: 

Returns: C

Returns: r

Returns: e

Returns: a

Returns: t

Returns: i

Returns: o

Returns: n

Returns: 

Returns: d

Returns: a

Returns: t

Returns: e

Returns: .

Returns: 

Returns: -

Returns: 

Returns: f

Returns: i

Returns: x

Returns: e

Returns: d

Returns: _

Returns: i

Returns: d

Returns: :

Returns: 

Returns: D

Returns: o

Returns: c

Returns: k

Returns: e

Returns: r

Returns: 

Returns: I

Returns: D

Returns: 

Returns: a

Returns: s

Returns: s

Returns: i

Returns: g

Returns: n

Returns: e

Returns: d

Returns: 

Returns: d

Returns: u

Returns: r

Returns: i

Returns: n

Returns: g

Returns: 

Returns: l

Returns: i

Returns: v

Returns: e

Returns: 

Returns: t

Returns: r

Returns: a

Returns: d

Returns: i

Returns: n

Returns: g

Returns: .

Returns: 

Returns: I

Returns: f

Returns: 

Returns: a

Returns: u

Returns: t

Returns: o

Returns: -

Returns: a

Returns: s

Returns: s

Returns: i

Returns: g

Returns: n

Returns: e

Returns: d

Returns: ,

Returns: 

Returns: t

Returns: h

Returns: i

Returns: s

Returns: 

Returns: v

Returns: a

Returns: l

Returns: u

Returns: e

Returns: 

Returns: i

Returns: s

Returns: 

Returns: -

Returns: 1

Returns: .

Returns: 

Returns: -

Returns: 

Returns: i

Returns: s

Returns: _

Returns: m

Returns: a

Returns: n

Returns: a

Returns: g

Returns: e

Returns: r

Returns: :

Returns: 

Returns: W

Returns: h

Returns: e

Returns: t

Returns: h

Returns: e

Returns: r

Returns: 

Returns: h

Returns: a

Returns: s

Returns: 

Returns: p

Returns: e

Returns: r

Returns: m

Returns: i

Returns: s

Returns: s

Returns: i

Returns: o

Returns: n

Returns: 

Returns: t

Returns: o

Returns: 

Returns: m

Returns: a

Returns: n

Returns: a

Returns: g

Returns: e

Returns: 

Returns: t

Returns: h

Returns: i

Returns: s

Returns: 

Returns: l

Returns: i

Returns: v

Returns: e

Returns: 

Returns: t

Returns: r

Returns: a

Returns: d

Returns: i

Returns: n

Returns: g

Returns: 

Returns: b

Returns: o

Returns: t

Returns: .

Returns: 

Returns: -

Returns: 

Returns: i

Returns: s

Returns: _

Returns: s

Returns: a

Returns: n

Returns: d

Returns: b

Returns: o

Returns: x

Returns: :

Returns: 

Returns: W

Returns: h

Returns: e

Returns: t

Returns: h

Returns: e

Returns: r

Returns: 

Returns: i

Returns: t

Returns: 

Returns: i

Returns: s

Returns: 

Returns: a

Returns: 

Returns: s

Returns: i

Returns: m

Returns: u

Returns: l

Returns: a

Returns: t

Returns: e

Returns: d

Returns: 

Returns: t

Returns: r

Returns: a

Returns: d

Returns: i

Returns: n

Returns: g

Returns: 

Returns: b

Returns: o

Returns: t

Returns: .

Returns: 

Returns: -

Returns: 

Returns: n

Returns: a

Returns: m

Returns: e

Returns: :

Returns: 

Returns: L

Returns: i

Returns: v

Returns: e

Returns: 

Returns: t

Returns: r

Returns: a

Returns: d

Returns: i

Returns: n

Returns: g

Returns: 

Returns: b

Returns: o

Returns: t

Returns: 

Returns: n

Returns: a

Returns: m

Returns: e

Returns: .

Returns: 

Returns: -

Returns: 

Returns: n

Returns: o

Returns: d

Returns: e

Returns: _

Returns: i

Returns: d

Returns: :

Returns: 

Returns: D

Returns: o

Returns: c

Returns: k

Returns: e

Returns: r

Returns: 

Returns: I

Returns: D

Returns: .

Returns: 

Returns: -

Returns: 

Returns: p

Returns: e

Returns: x

Returns: c

Returns: h

Returns: a

Returns: n

Returns: g

Returns: e

Returns: s

Returns: :

Returns: 

Returns: E

Returns: x

Returns: c

Returns: h

Returns: a

Returns: n

Returns: g

Returns: e

Returns: 

Returns: o

Returns: b

Returns: j

Returns: e

Returns: c

Returns: t

Returns: s

Returns: 

Returns: c

Returns: o

Returns: n

Returns: f

Returns: i

Returns: g

Returns: u

Returns: r

Returns: e

Returns: d

Returns: 

Returns: f

Returns: o

Returns: r

Returns: 

Returns: t

Returns: h

Returns: e

Returns: 

Returns: l

Returns: i

Returns: v

Returns: e

Returns: 

Returns: t

Returns: r

Returns: a

Returns: d

Returns: i

Returns: n

Returns: g

Returns: 

Returns: b

Returns: o

Returns: t

Returns: ,

Returns: 

Returns: w

Returns: h

Returns: e

Returns: r

Returns: e

Returns: 

Returns: 1

Returns: 2

Returns: 3

Returns: 

Returns: i

Returns: s

Returns: 

Returns: t

Returns: h

Returns: e

Returns: 

Returns: p

Returns: i

Returns: d

Returns: 

Returns: a

Returns: n

Returns: d

Returns: 

Returns: "

Returns: F

Returns: u

Returns: t

Returns: u

Returns: r

Returns: e

Returns: s

Returns: _

Returns: O

Returns: K

Returns: C

Returns: o

Returns: i

Returns: n

Returns: "

Returns: 

Returns: i

Returns: s

Returns: 

Returns: t

Returns: h

Returns: e

Returns: 

Returns: e

Returns: x

Returns: c

Returns: h

Returns: a

Returns: n

Returns: g

Returns: e

Returns: 

Returns: n

Returns: a

Returns: m

Returns: e

Returns: .

Returns: 

Returns: -

Returns: 

Returns: p

Returns: l

Returns: a

Returns: b

Returns: e

Returns: l

Returns: s

Returns: :

Returns: 

Returns: L

Returns: a

Returns: b

Returns: e

Returns: l

Returns: 

Returns: i

Returns: n

Returns: f

Returns: o

Returns: r

Returns: m

Returns: a

Returns: t

Returns: i

Returns: o

Returns: n

Returns: 

Returns: f

Returns: o

Returns: r

Returns: 

Returns: t

Returns: h

Returns: e

Returns: 

Returns: e

Returns: x

Returns: c

Returns: h

Returns: a

Returns: n

Returns: g

Returns: e

Returns: 

Returns: o

Returns: b

Returns: j

Returns: e

Returns: c

Returns: t

Returns: s

Returns: 

Returns: c

Returns: o

Returns: n

Returns: f

Returns: i

Returns: g

Returns: u

Returns: r

Returns: e

Returns: d

Returns: 

Returns: f

Returns: o

Returns: r

Returns: 

Returns: t

Returns: h

Returns: e

Returns: 

Returns: l

Returns: i

Returns: v

Returns: e

Returns: 

Returns: t

Returns: r

Returns: a

Returns: d

Returns: i

Returns: n

Returns: g

Returns: 

Returns: b

Returns: o

Returns: t

Returns: .

Returns: 

Returns: -

Returns: 

Returns: p

Returns: r

Returns: o

Returns: f

Returns: i

Returns: t

Returns: :

Returns: 

Returns: L

Returns: i

Returns: v

Returns: e

Returns: 

Returns: t

Returns: r

Returns: a

Returns: d

Returns: i

Returns: n

Returns: g

Returns: 

Returns: b

Returns: o

Returns: t

Returns: 

Returns: p

Returns: r

Returns: o

Returns: f

Returns: i

Returns: t

Returns: 

Returns: d

Returns: a

Returns: t

Returns: a

Returns: .

Returns: 

Returns: -

Returns: 

Returns: p

Returns: u

Returns: b

Returns: l

Returns: i

Returns: c

Returns: :

Returns: 

Returns: W

Returns: h

Returns: e

Returns: t

Returns: h

Returns: e

Returns: r

Returns: 

Returns: t

Returns: h

Returns: e

Returns: 

Returns: l

Returns: i

Returns: v

Returns: e

Returns: 

Returns: t

Returns: r

Returns: a

Returns: d

Returns: i

Returns: n

Returns: g

Returns: 

Returns: b

Returns: o

Returns: t

Returns: 

Returns: i

Returns: s

Returns: 

Returns: p

Returns: u

Returns: b

Returns: l

Returns: i

Returns: c

Returns: .

Returns: 

Returns: -

Returns: 

Returns: r

Returns: e

Returns: f

Returns: r

Returns: e

Returns: s

Returns: h

Returns: :

Returns: 

Returns: L

Returns: a

Returns: s

Returns: t

Returns: 

Returns: a

Returns: c

Returns: t

Returns: i

Returns: v

Returns: e

Returns: 

Returns: t

Returns: i

Returns: m

Returns: e

Returns: .

Returns: 

Returns: -

Returns: 

Returns: s

Returns: t

Returns: r

Returns: a

Returns: t

Returns: e

Returns: g

Returns: y

Returns: _

Returns: e

Returns: x

Returns: c

Returns: h

Returns: a

Returns: n

Returns: g

Returns: e

Returns: _

Returns: p

Returns: a

Returns: i

Returns: r

Returns: s

Returns: :

Returns: 

Returns: C

Returns: o

Returns: n

Returns: f

Returns: i

Returns: g

Returns: u

Returns: r

Returns: e

Returns: d

Returns: 

Returns: e

Returns: x

Returns: c

Returns: h

Returns: a

Returns: n

Returns: g

Returns: e

Returns: 

Returns: o

Returns: b

Returns: j

Returns: e

Returns: c

Returns: t

Returns: s

Returns: 

Returns: a

Returns: n

Returns: d

Returns: 

Returns: t

Returns: h

Returns: e

Returns: i

Returns: r

Returns: 

Returns: t

Returns: r

Returns: a

Returns: d

Returns: i

Returns: n

Returns: g

Returns: 

Returns: p

Returns: a

Returns: i

Returns: r

Returns: 

Returns: i

Returns: n

Returns: f

Returns: o

Returns: r

Returns: m

Returns: a

Returns: t

Returns: i

Returns: o

Returns: n

Returns: .

Returns: 

Returns: -

Returns: 

Returns: w

Returns: d

Returns: :

Returns: 

Returns: W

Returns: h

Returns: e

Returns: t

Returns: h

Returns: e

Returns: r

Returns: 

Returns: o

Returns: f

Returns: f

Returns: l

Returns: i

Returns: n

Returns: e

Returns: 

Returns: a

Returns: l

Returns: e

Returns: r

Returns: t

Returns: 

Returns: i

Returns: s

Returns: 

Returns: e

Returns: n

Returns: a

Returns: b

Returns: l

Returns: e

Returns: d

Returns: .

Explanation of the ```strategy_exchange_pairs``` attribute, using the following data as an example:

```plaintext
"[60,[44314,42960,15445,14703],[\"BTC_USDT\",\"BTC_USDT\",\"ETH_USDT\",\"ETH_USDT\"]]"
```

The first data ```60``` indicates that the default K-line period set for the live trading bot is 1 minute, i.e., 60 seconds.

```[44314,42960,15445,14703]``` are the ```pid``` values of the exchange objects configured for the live trading bot (arranged in the order they were added).

```[\"BTC_USDT\",\"BTC_USDT\",\"ETH_USDT\",\"ETH_USDT\"]``` are the trading pairs set for the exchange objects configured for the live trading bot (corresponding one-to-one with the pid values in the order they were added).

##### GetAccount

The ```GetAccount``` method is used to retrieve account information for the FMZ Quant Trading Platform account corresponding to the ```API KEY``` in the request.

Returns: `

Returns: `

Returns: `

Returns: j

Returns: s

Returns: o

Returns: n

Returns: 

Returns: {

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: c

Returns: o

Returns: d

Returns: e

Returns: "

Returns: :

Returns: 0

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: d

Returns: a

Returns: t

Returns: a

Returns: "

Returns: :

Returns: {

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: r

Returns: e

Returns: s

Returns: u

Returns: l

Returns: t

Returns: "

Returns: :

Returns: {

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: b

Returns: a

Returns: l

Returns: a

Returns: n

Returns: c

Returns: e

Returns: "

Returns: :

Returns: 2

Returns: 2

Returns: 9

Returns: 4

Returns: 4

Returns: 7

Returns: 0

Returns: 2

Returns: 4

Returns: 3

Returns: 6

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: c

Returns: o

Returns: n

Returns: c

Returns: u

Returns: r

Returns: r

Returns: e

Returns: n

Returns: t

Returns: "

Returns: :

Returns: 0

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: c

Returns: o

Returns: n

Returns: s

Returns: u

Returns: m

Returns: e

Returns: d

Returns: "

Returns: :

Returns: 2

Returns: 1

Returns: 1

Returns: 0

Returns: 9

Returns: 2

Returns: 7

Returns: 1

Returns: 9

Returns: 6

Returns: 5

Returns: 3

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: c

Returns: u

Returns: r

Returns: r

Returns: e

Returns: n

Returns: c

Returns: y

Returns: "

Returns: :

Returns: "

Returns: U

Returns: S

Returns: D

Returns: "

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: e

Returns: m

Returns: a

Returns: i

Returns: l

Returns: "

Returns: :

Returns: "

Returns: 1

Returns: 2

Returns: 3

Returns: @

Returns: q

Returns: q

Returns: .

Returns: c

Returns: o

Returns: m

Returns: "

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: o

Returns: p

Returns: e

Returns: n

Returns: a

Returns: i

Returns: "

Returns: :

Returns: f

Returns: a

Returns: l

Returns: s

Returns: e

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: s

Returns: e

Returns: t

Returns: t

Returns: i

Returns: n

Returns: g

Returns: s

Returns: "

Returns: :

Returns: n

Returns: u

Returns: l

Returns: l

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: s

Returns: n

Returns: s

Returns: "

Returns: :

Returns: {

Returns: "

Returns: w

Returns: e

Returns: c

Returns: h

Returns: a

Returns: t

Returns: "

Returns: :

Returns: t

Returns: r

Returns: u

Returns: e

Returns: }

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: u

Returns: i

Returns: d

Returns: "

Returns: :

Returns: "

Returns: 1

Returns: 0

Returns: 5

Returns: e

Returns: a

Returns: 6

Returns: e

Returns: 5

Returns: 1

Returns: b

Returns: c

Returns: c

Returns: 1

Returns: 7

Returns: 7

Returns: 9

Returns: 2

Returns: 6

Returns: a

Returns: 1

Returns: 0

Returns: f

Returns: d

Returns: b

Returns: b

Returns: 7

Returns: e

Returns: 2

Returns: a

Returns: 1

Returns: d

Returns: 6

Returns: "

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: u

Returns: s

Returns: e

Returns: r

Returns: n

Returns: a

Returns: m

Returns: e

Returns: "

Returns: :

Returns: "

Returns: a

Returns: b

Returns: c

Returns: "

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: }

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: e

Returns: r

Returns: r

Returns: o

Returns: r

Returns: "

Returns: :

Returns: n

Returns: u

Returns: l

Returns: l

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: }

Returns: 

Returns: }

Returns: 

Returns: `

Returns: `

Returns: `

Returns: 

Returns: 

Returns: -

Returns: 

Returns: b

Returns: a

Returns: l

Returns: a

Returns: n

Returns: c

Returns: e

Returns: :

Returns: 

Returns: A

Returns: c

Returns: c

Returns: o

Returns: u

Returns: n

Returns: t

Returns: 

Returns: b

Returns: a

Returns: l

Returns: a

Returns: n

Returns: c

Returns: e

Returns: 

Returns: 

Returns: 

Returns: T

Returns: h

Returns: e

Returns: 

Returns: v

Returns: a

Returns: l

Returns: u

Returns: e

Returns: 

Returns: h

Returns: e

Returns: r

Returns: e

Returns: 

Returns: i

Returns: s

Returns: 

Returns: r

Returns: e

Returns: p

Returns: r

Returns: e

Returns: s

Returns: e

Returns: n

Returns: t

Returns: e

Returns: d

Returns: 

Returns: a

Returns: s

Returns: 

Returns: a

Returns: n

Returns: 

Returns: i

Returns: n

Returns: t

Returns: e

Returns: g

Returns: e

Returns: r

Returns: 

Returns: t

Returns: o

Returns: 

Returns: e

Returns: n

Returns: s

Returns: u

Returns: r

Returns: e

Returns: 

Returns: p

Returns: r

Returns: e

Returns: c

Returns: i

Returns: s

Returns: i

Returns: o

Returns: n

Returns: .

Returns: 

Returns: T

Returns: h

Returns: e

Returns: 

Returns: a

Returns: c

Returns: t

Returns: u

Returns: a

Returns: l

Returns: 

Returns: v

Returns: a

Returns: l

Returns: u

Returns: e

Returns: 

Returns: n

Returns: e

Returns: e

Returns: d

Returns: s

Returns: 

Returns: t

Returns: o

Returns: 

Returns: b

Returns: e

Returns: 

Returns: d

Returns: i

Returns: v

Returns: i

Returns: d

Returns: e

Returns: d

Returns: 

Returns: b

Returns: y

Returns: 

Returns: 1

Returns: e

Returns: 8

Returns: 

Returns: (

Returns: 1

Returns: 0

Returns: 

Returns: t

Returns: o

Returns: 

Returns: t

Returns: h

Returns: e

Returns: 

Returns: p

Returns: o

Returns: w

Returns: e

Returns: r

Returns: 

Returns: o

Returns: f

Returns: 

Returns: 8

Returns: )

Returns: 

Returns: f

Returns: o

Returns: r

Returns: 

Returns: c

Returns: o

Returns: n

Returns: v

Returns: e

Returns: r

Returns: s

Returns: i

Returns: o

Returns: n

Returns: .

Returns: 

Returns: I

Returns: n

Returns: 

Returns: t

Returns: h

Returns: i

Returns: s

Returns: 

Returns: e

Returns: x

Returns: a

Returns: m

Returns: p

Returns: l

Returns: e

Returns: ,

Returns: 

Returns: t

Returns: h

Returns: e

Returns: 

Returns: a

Returns: c

Returns: t

Returns: u

Returns: a

Returns: l

Returns: 

Returns: b

Returns: a

Returns: l

Returns: a

Returns: n

Returns: c

Returns: e

Returns: 

Returns: i

Returns: s

Returns: :

Returns: 

Returns: 2

Returns: 2

Returns: 9

Returns: .

Returns: 4

Returns: 4

Returns: 7

Returns: 0

Returns: 2

Returns: 4

Returns: 3

Returns: 6

##### GetExchangeList

The ```GetExchangeList``` method is used to get the list of exchanges supported by the FMZ quantitative trading platform and their configuration information.

Parameters:

- `isSummary` (bool, required): The ```isSummary``` parameter is used to specify whether the returned data is summary information.

Returns: W

Returns: h

Returns: e

Returns: n

Returns: 

Returns: t

Returns: h

Returns: e

Returns: 

Returns: `

Returns: `

Returns: `

Returns: i

Returns: s

Returns: S

Returns: u

Returns: m

Returns: m

Returns: a

Returns: r

Returns: y

Returns: `

Returns: `

Returns: `

Returns: 

Returns: p

Returns: a

Returns: r

Returns: a

Returns: m

Returns: e

Returns: t

Returns: e

Returns: r

Returns: 

Returns: i

Returns: s

Returns: 

Returns: `

Returns: `

Returns: `

Returns: f

Returns: a

Returns: l

Returns: s

Returns: e

Returns: `

Returns: `

Returns: `

Returns: ,

Returns: 

Returns: t

Returns: h

Returns: e

Returns: 

Returns: r

Returns: e

Returns: t

Returns: u

Returns: r

Returns: n

Returns: e

Returns: d

Returns: 

Returns: d

Returns: a

Returns: t

Returns: a

Returns: :

Returns: 

Returns: 

Returns: `

Returns: `

Returns: `

Returns: j

Returns: s

Returns: o

Returns: n

Returns: 

Returns: {

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: c

Returns: o

Returns: d

Returns: e

Returns: "

Returns: :

Returns: 

Returns: 0

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: d

Returns: a

Returns: t

Returns: a

Returns: "

Returns: :

Returns: 

Returns: {

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: r

Returns: e

Returns: s

Returns: u

Returns: l

Returns: t

Returns: "

Returns: :

Returns: 

Returns: {

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: e

Returns: x

Returns: c

Returns: h

Returns: a

Returns: n

Returns: g

Returns: e

Returns: s

Returns: "

Returns: :

Returns: 

Returns: [

Returns: {

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: c

Returns: a

Returns: t

Returns: e

Returns: g

Returns: o

Returns: r

Returns: y

Returns: "

Returns: :

Returns: 

Returns: "

Returns: 加

Returns: 密

Returns: 货

Returns: 币

Returns: |

Returns: |

Returns: C

Returns: r

Returns: y

Returns: p

Returns: t

Returns: o

Returns: "

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: e

Returns: i

Returns: d

Returns: "

Returns: :

Returns: 

Returns: "

Returns: F

Returns: u

Returns: t

Returns: u

Returns: r

Returns: e

Returns: s

Returns: _

Returns: B

Returns: i

Returns: n

Returns: a

Returns: n

Returns: c

Returns: e

Returns: "

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: i

Returns: d

Returns: "

Returns: :

Returns: 

Returns: 7

Returns: 4

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: l

Returns: o

Returns: g

Returns: o

Returns: "

Returns: :

Returns: 

Returns: "

Returns: /

Returns: u

Returns: p

Returns: l

Returns: o

Returns: a

Returns: d

Returns: /

Returns: a

Returns: s

Returns: s

Returns: e

Returns: t

Returns: /

Returns: d

Returns: 8

Returns: d

Returns: 8

Returns: 4

Returns: b

Returns: 2

Returns: 3

Returns: e

Returns: 5

Returns: 7

Returns: 3

Returns: e

Returns: 9

Returns: 3

Returns: 2

Returns: 6

Returns: b

Returns: 9

Returns: 9

Returns: .

Returns: s

Returns: v

Returns: g

Returns: "

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: m

Returns: e

Returns: t

Returns: a

Returns: "

Returns: :

Returns: 

Returns: "

Returns: [

Returns: {

Returns: \

Returns: "

Returns: d

Returns: e

Returns: s

Returns: c

Returns: \

Returns: "

Returns: :

Returns: 

Returns: \

Returns: "

Returns: A

Returns: c

Returns: c

Returns: e

Returns: s

Returns: s

Returns: 

Returns: K

Returns: e

Returns: y

Returns: \

Returns: "

Returns: ,

Returns: 

Returns: \

Returns: "

Returns: q

Returns: r

Returns: \

Returns: "

Returns: :

Returns: \

Returns: "

Returns: a

Returns: p

Returns: i

Returns: K

Returns: e

Returns: y

Returns: \

Returns: "

Returns: ,

Returns: \

Returns: "

Returns: r

Returns: e

Returns: q

Returns: u

Returns: i

Returns: r

Returns: e

Returns: d

Returns: \

Returns: "

Returns: :

Returns: 

Returns: t

Returns: r

Returns: u

Returns: e

Returns: ,

Returns: 

Returns: \

Returns: "

Returns: t

Returns: y

Returns: p

Returns: e

Returns: \

Returns: "

Returns: :

Returns: 

Returns: \

Returns: "

Returns: s

Returns: t

Returns: r

Returns: i

Returns: n

Returns: g

Returns: \

Returns: "

Returns: ,

Returns: 

Returns: \

Returns: "

Returns: n

Returns: a

Returns: m

Returns: e

Returns: \

Returns: "

Returns: :

Returns: 

Returns: \

Returns: "

Returns: A

Returns: c

Returns: c

Returns: e

Returns: s

Returns: s

Returns: K

Returns: e

Returns: y

Returns: \

Returns: "

Returns: ,

Returns: 

Returns: \

Returns: "

Returns: l

Returns: a

Returns: b

Returns: e

Returns: l

Returns: \

Returns: "

Returns: :

Returns: 

Returns: \

Returns: "

Returns: A

Returns: c

Returns: c

Returns: e

Returns: s

Returns: s

Returns: 

Returns: K

Returns: e

Returns: y

Returns: \

Returns: "

Returns: }

Returns: ,

Returns: 

Returns: {

Returns: \

Returns: "

Returns: e

Returns: n

Returns: c

Returns: r

Returns: y

Returns: p

Returns: t

Returns: \

Returns: "

Returns: :

Returns: 

Returns: t

Returns: r

Returns: u

Returns: e

Returns: ,

Returns: 

Returns: \

Returns: "

Returns: q

Returns: r

Returns: \

Returns: "

Returns: :

Returns: \

Returns: "

Returns: s

Returns: e

Returns: c

Returns: r

Returns: e

Returns: t

Returns: K

Returns: e

Returns: y

Returns: \

Returns: "

Returns: ,

Returns: \

Returns: "

Returns: n

Returns: a

Returns: m

Returns: e

Returns: \

Returns: "

Returns: :

Returns: 

Returns: \

Returns: "

Returns: S

Returns: e

Returns: c

Returns: r

Returns: e

Returns: t

Returns: K

Returns: e

Returns: y

Returns: \

Returns: "

Returns: ,

Returns: 

Returns: \

Returns: "

Returns: r

Returns: e

Returns: q

Returns: u

Returns: i

Returns: r

Returns: e

Returns: d

Returns: \

Returns: "

Returns: :

Returns: 

Returns: t

Returns: r

Returns: u

Returns: e

Returns: ,

Returns: 

Returns: \

Returns: "

Returns: l

Returns: a

Returns: b

Returns: e

Returns: l

Returns: \

Returns: "

Returns: :

Returns: 

Returns: \

Returns: "

Returns: S

Returns: e

Returns: c

Returns: r

Returns: e

Returns: t

Returns: 

Returns: K

Returns: e

Returns: y

Returns: \

Returns: "

Returns: ,

Returns: 

Returns: \

Returns: "

Returns: t

Returns: y

Returns: p

Returns: e

Returns: \

Returns: "

Returns: :

Returns: 

Returns: \

Returns: "

Returns: p

Returns: a

Returns: s

Returns: s

Returns: w

Returns: o

Returns: r

Returns: d

Returns: \

Returns: "

Returns: ,

Returns: 

Returns: \

Returns: "

Returns: d

Returns: e

Returns: s

Returns: c

Returns: \

Returns: "

Returns: :

Returns: 

Returns: \

Returns: "

Returns: S

Returns: e

Returns: c

Returns: r

Returns: e

Returns: t

Returns: 

Returns: K

Returns: e

Returns: y

Returns: \

Returns: "

Returns: }

Returns: ]

Returns: "

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: n

Returns: a

Returns: m

Returns: e

Returns: "

Returns: :

Returns: 

Returns: "

Returns: 币

Returns: 安

Returns: 期

Returns: 货

Returns: |

Returns: F

Returns: u

Returns: t

Returns: u

Returns: r

Returns: e

Returns: s

Returns: _

Returns: B

Returns: i

Returns: n

Returns: a

Returns: n

Returns: c

Returns: e

Returns: "

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: p

Returns: r

Returns: i

Returns: o

Returns: r

Returns: i

Returns: t

Returns: y

Returns: "

Returns: :

Returns: 

Returns: 2

Returns: 0

Returns: 0

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: s

Returns: t

Returns: o

Returns: c

Returns: k

Returns: s

Returns: "

Returns: :

Returns: 

Returns: "

Returns: B

Returns: T

Returns: C

Returns: _

Returns: U

Returns: S

Returns: D

Returns: T

Returns: ,

Returns: E

Returns: T

Returns: H

Returns: _

Returns: U

Returns: S

Returns: D

Returns: T

Returns: ,

Returns: E

Returns: T

Returns: H

Returns: _

Returns: U

Returns: S

Returns: D

Returns: "

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: w

Returns: e

Returns: b

Returns: s

Returns: i

Returns: t

Returns: e

Returns: "

Returns: :

Returns: 

Returns: "

Returns: h

Returns: t

Returns: t

Returns: p

Returns: s

Returns: :

Returns: /

Returns: /

Returns: a

Returns: c

Returns: c

Returns: o

Returns: u

Returns: n

Returns: t

Returns: s

Returns: .

Returns: b

Returns: i

Returns: n

Returns: a

Returns: n

Returns: c

Returns: e

Returns: .

Returns: c

Returns: o

Returns: m

Returns: /

Returns: z

Returns: h

Returns: -

Returns: T

Returns: C

Returns: /

Returns: r

Returns: e

Returns: g

Returns: i

Returns: s

Returns: t

Returns: e

Returns: r

Returns: ?

Returns: r

Returns: e

Returns: f

Returns: =

Returns: 4

Returns: 5

Returns: 1

Returns: 1

Returns: 0

Returns: 2

Returns: 7

Returns: 0

Returns: "

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: }

Returns: ]

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: }

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: e

Returns: r

Returns: r

Returns: o

Returns: r

Returns: "

Returns: :

Returns: 

Returns: n

Returns: u

Returns: l

Returns: l

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: }

Returns: 

Returns: }

Returns: 

Returns: `

Returns: `

Returns: `

Returns: 

Returns: 

Returns: W

Returns: h

Returns: e

Returns: n

Returns: 

Returns: t

Returns: h

Returns: e

Returns: 

Returns: `

Returns: `

Returns: `

Returns: i

Returns: s

Returns: S

Returns: u

Returns: m

Returns: m

Returns: a

Returns: r

Returns: y

Returns: `

Returns: `

Returns: `

Returns: 

Returns: p

Returns: a

Returns: r

Returns: a

Returns: m

Returns: e

Returns: t

Returns: e

Returns: r

Returns: 

Returns: i

Returns: s

Returns: 

Returns: `

Returns: `

Returns: `

Returns: t

Returns: r

Returns: u

Returns: e

Returns: `

Returns: `

Returns: `

Returns: ,

Returns: 

Returns: t

Returns: h

Returns: e

Returns: 

Returns: r

Returns: e

Returns: t

Returns: u

Returns: r

Returns: n

Returns: e

Returns: d

Returns: 

Returns: d

Returns: a

Returns: t

Returns: a

Returns: :

Returns: 

Returns: 

Returns: `

Returns: `

Returns: `

Returns: j

Returns: s

Returns: o

Returns: n

Returns: 

Returns: {

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: c

Returns: o

Returns: d

Returns: e

Returns: "

Returns: :

Returns: 

Returns: 0

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: d

Returns: a

Returns: t

Returns: a

Returns: "

Returns: :

Returns: 

Returns: {

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: r

Returns: e

Returns: s

Returns: u

Returns: l

Returns: t

Returns: "

Returns: :

Returns: 

Returns: {

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: e

Returns: x

Returns: c

Returns: h

Returns: a

Returns: n

Returns: g

Returns: e

Returns: s

Returns: "

Returns: :

Returns: 

Returns: [

Returns: {

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: c

Returns: a

Returns: t

Returns: e

Returns: g

Returns: o

Returns: r

Returns: y

Returns: "

Returns: :

Returns: 

Returns: "

Returns: 加

Returns: 密

Returns: 货

Returns: 币

Returns: |

Returns: |

Returns: C

Returns: r

Returns: y

Returns: p

Returns: t

Returns: o

Returns: "

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: e

Returns: i

Returns: d

Returns: "

Returns: :

Returns: 

Returns: "

Returns: F

Returns: u

Returns: t

Returns: u

Returns: r

Returns: e

Returns: s

Returns: _

Returns: B

Returns: i

Returns: n

Returns: a

Returns: n

Returns: c

Returns: e

Returns: "

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: i

Returns: d

Returns: "

Returns: :

Returns: 

Returns: 7

Returns: 4

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: l

Returns: o

Returns: g

Returns: o

Returns: "

Returns: :

Returns: 

Returns: "

Returns: /

Returns: u

Returns: p

Returns: l

Returns: o

Returns: a

Returns: d

Returns: /

Returns: a

Returns: s

Returns: s

Returns: e

Returns: t

Returns: /

Returns: d

Returns: 8

Returns: d

Returns: 8

Returns: 4

Returns: b

Returns: 2

Returns: 3

Returns: e

Returns: 5

Returns: 7

Returns: 3

Returns: e

Returns: 9

Returns: 3

Returns: 2

Returns: 6

Returns: b

Returns: 9

Returns: 9

Returns: .

Returns: s

Returns: v

Returns: g

Returns: "

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: n

Returns: a

Returns: m

Returns: e

Returns: "

Returns: :

Returns: 

Returns: "

Returns: 币

Returns: 安

Returns: 期

Returns: 货

Returns: |

Returns: F

Returns: u

Returns: t

Returns: u

Returns: r

Returns: e

Returns: s

Returns: _

Returns: B

Returns: i

Returns: n

Returns: a

Returns: n

Returns: c

Returns: e

Returns: "

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: p

Returns: r

Returns: i

Returns: o

Returns: r

Returns: i

Returns: t

Returns: y

Returns: "

Returns: :

Returns: 

Returns: 2

Returns: 0

Returns: 0

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: w

Returns: e

Returns: b

Returns: s

Returns: i

Returns: t

Returns: e

Returns: "

Returns: :

Returns: 

Returns: "

Returns: h

Returns: t

Returns: t

Returns: p

Returns: s

Returns: :

Returns: /

Returns: /

Returns: a

Returns: c

Returns: c

Returns: o

Returns: u

Returns: n

Returns: t

Returns: s

Returns: .

Returns: b

Returns: i

Returns: n

Returns: a

Returns: n

Returns: c

Returns: e

Returns: .

Returns: c

Returns: o

Returns: m

Returns: /

Returns: z

Returns: h

Returns: -

Returns: T

Returns: C

Returns: /

Returns: r

Returns: e

Returns: g

Returns: i

Returns: s

Returns: t

Returns: e

Returns: r

Returns: ?

Returns: r

Returns: e

Returns: f

Returns: =

Returns: 4

Returns: 5

Returns: 1

Returns: 1

Returns: 0

Returns: 2

Returns: 7

Returns: 0

Returns: "

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: }

Returns: ]

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: }

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: e

Returns: r

Returns: r

Returns: o

Returns: r

Returns: "

Returns: :

Returns: 

Returns: n

Returns: u

Returns: l

Returns: l

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: }

Returns: 

Returns: }

Returns: 

Returns: `

Returns: `

Returns: `

Returns: 

Returns: 

Returns: -

Returns: 

Returns: m

Returns: e

Returns: t

Returns: a

Returns: :

Returns: 

Returns: E

Returns: x

Returns: c

Returns: h

Returns: a

Returns: n

Returns: g

Returns: e

Returns: 

Returns: c

Returns: o

Returns: n

Returns: f

Returns: i

Returns: g

Returns: u

Returns: r

Returns: a

Returns: t

Returns: i

Returns: o

Returns: n

Returns: 

Returns: m

Returns: e

Returns: t

Returns: a

Returns: d

Returns: a

Returns: t

Returns: a

Returns: .

##### DeleteNode

The ```DeleteNode``` method is used to delete a docker node under the FMZ Quant Trading Platform account corresponding to the ```API KEY``` in the request. The docker node ID to be deleted is specified by the ```nid``` parameter.

Parameters:

- `nid` (number, required): The ```nid``` parameter is used to specify the docker ID to be deleted. You can obtain the docker information under the account through the ```GetNodeList``` method.

Returns: `

Returns: `

Returns: `

Returns: j

Returns: s

Returns: o

Returns: n

Returns: 

Returns: {

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: c

Returns: o

Returns: d

Returns: e

Returns: "

Returns: :

Returns: 0

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: d

Returns: a

Returns: t

Returns: a

Returns: "

Returns: :

Returns: {

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: r

Returns: e

Returns: s

Returns: u

Returns: l

Returns: t

Returns: "

Returns: :

Returns: t

Returns: r

Returns: u

Returns: e

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: e

Returns: r

Returns: r

Returns: o

Returns: r

Returns: "

Returns: :

Returns: n

Returns: u

Returns: l

Returns: l

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: }

Returns: 

Returns: }

Returns: 

Returns: `

Returns: `

Returns: `

Returns: 

Returns: 

Returns: -

Returns: 

Returns: r

Returns: e

Returns: s

Returns: u

Returns: l

Returns: t

Returns: :

Returns: 

Returns: W

Returns: h

Returns: e

Returns: t

Returns: h

Returns: e

Returns: r

Returns: 

Returns: t

Returns: h

Returns: e

Returns: 

Returns: a

Returns: s

Returns: s

Returns: o

Returns: c

Returns: i

Returns: a

Returns: t

Returns: e

Returns: d

Returns: 

Returns: d

Returns: o

Returns: c

Returns: k

Returns: e

Returns: r

Returns: 

Returns: p

Returns: r

Returns: o

Returns: g

Returns: r

Returns: a

Returns: m

Returns: 

Returns: w

Returns: a

Returns: s

Returns: 

Returns: s

Returns: u

Returns: c

Returns: c

Returns: e

Returns: s

Returns: s

Returns: f

Returns: u

Returns: l

Returns: l

Returns: y

Returns: 

Returns: d

Returns: e

Returns: l

Returns: e

Returns: t

Returns: e

Returns: d

Returns: .

##### DeleteRobot

The ```DeleteRobot``` method is used to delete a live trading bot under the FMZ Quant Trading Platform account corresponding to the ```API KEY``` in the request. The deleted bot ID is specified by the ```robotId``` parameter.

Parameters:

- `robotId` (number, required): The ```robotId``` parameter is used to specify the ID of the live trading bot to be deleted. You can use the ```GetRobotList``` method to get information about bots under the account, which includes the bot ID.
- `deleteLogs` (bool, required): The ```deleteLogs``` parameter is used to set whether to delete the bot logs. If a truthy value is passed (e.g., ```true```), the bot logs will be deleted.

Returns: `

Returns: `

Returns: `

Returns: j

Returns: s

Returns: o

Returns: n

Returns: 

Returns: {

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: c

Returns: o

Returns: d

Returns: e

Returns: "

Returns: :

Returns: 0

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: d

Returns: a

Returns: t

Returns: a

Returns: "

Returns: :

Returns: {

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: r

Returns: e

Returns: s

Returns: u

Returns: l

Returns: t

Returns: "

Returns: :

Returns: 0

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: e

Returns: r

Returns: r

Returns: o

Returns: r

Returns: "

Returns: :

Returns: n

Returns: u

Returns: l

Returns: l

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: }

Returns: 

Returns: }

Returns: 

Returns: `

Returns: `

Returns: `

Returns: 

Returns: 

Returns: -

Returns: 

Returns: r

Returns: e

Returns: s

Returns: u

Returns: l

Returns: t

Returns: :

Returns: 

Returns: F

Returns: e

Returns: e

Returns: d

Returns: b

Returns: a

Returns: c

Returns: k

Returns: 

Returns: r

Returns: e

Returns: s

Returns: u

Returns: l

Returns: t

Returns: 

Returns: o

Returns: f

Returns: 

Returns: t

Returns: h

Returns: e

Returns: 

Returns: b

Returns: o

Returns: t

Returns: 

Returns: d

Returns: e

Returns: l

Returns: e

Returns: t

Returns: i

Returns: o

Returns: n

Returns: 

Returns: o

Returns: p

Returns: e

Returns: r

Returns: a

Returns: t

Returns: i

Returns: o

Returns: n

Returns: .

Returns: 

Returns: 

Returns: 

Returns: -

Returns: 

Returns: 0

Returns: :

Returns: 

Returns: N

Returns: o

Returns: r

Returns: m

Returns: a

Returns: l

Returns: 

Returns: d

Returns: e

Returns: l

Returns: e

Returns: t

Returns: i

Returns: o

Returns: n

Returns: .

Returns: 

Returns: 

Returns: 

Returns: -

Returns: 

Returns: -

Returns: 2

Returns: :

Returns: 

Returns: D

Returns: e

Returns: l

Returns: e

Returns: t

Returns: i

Returns: o

Returns: n

Returns: 

Returns: s

Returns: u

Returns: c

Returns: c

Returns: e

Returns: s

Returns: s

Returns: f

Returns: u

Returns: l

Returns: ,

Returns: 

Returns: b

Returns: u

Returns: t

Returns: 

Returns: u

Returns: n

Returns: a

Returns: b

Returns: l

Returns: e

Returns: 

Returns: t

Returns: o

Returns: 

Returns: c

Returns: o

Returns: n

Returns: t

Returns: a

Returns: c

Returns: t

Returns: 

Returns: t

Returns: h

Returns: e

Returns: 

Returns: d

Returns: o

Returns: c

Returns: k

Returns: e

Returns: r

Returns: 

Returns: a

Returns: s

Returns: s

Returns: o

Returns: c

Returns: i

Returns: a

Returns: t

Returns: e

Returns: d

Returns: 

Returns: w

Returns: i

Returns: t

Returns: h

Returns: 

Returns: t

Returns: h

Returns: e

Returns: 

Returns: b

Returns: o

Returns: t

Returns: ,

Returns: 

Returns: p

Returns: l

Returns: e

Returns: a

Returns: s

Returns: e

Returns: 

Returns: m

Returns: a

Returns: n

Returns: u

Returns: a

Returns: l

Returns: l

Returns: y

Returns: 

Returns: d

Returns: e

Returns: l

Returns: e

Returns: t

Returns: e

Returns: 

Returns: t

Returns: h

Returns: e

Returns: 

Returns: f

Returns: i

Returns: l

Returns: e

Returns: 

Returns: 1

Returns: 2

Returns: 3

Returns: .

Returns: d

Returns: b

Returns: 3

Returns: !

##### GetStrategyList

The ```GetStrategyList``` method is used to retrieve platform strategy information.

Parameters:

- `offset` (number, required): The ```offset``` parameter is used to set the query offset.
- `length` (number, required): The ```length``` parameter is used to set the number of data entries returned by the query.
- `strategyType` (number, required): The ```strategyType``` parameter is used to set the type of strategy to query.

- Set ```strategyType``` parameter to ```0```: Query all strategies.

- Set ```strategyType``` parameter to ```1```: Query published strategies.

- Set ```strategyType``` parameter to ```2```: Query strategies pending review.
- `category` (number, required): The ```category``` parameter is used to set the strategy category to query.

- Set ```category``` parameter to ```-1```: Query all strategies.

- Set ```category``` parameter to ```0```: Query general strategies.
- `needArgs` (number, required): The ```needArgs``` parameter is used to set whether the queried strategy requires parameters.

- Set ```needArgs``` parameter to ```0```: Query all strategies.
- `language` (number, required): The ```language``` parameter is used to set the programming language of the strategy to query.

- Set ```language``` parameter to ```0```: JavaScript language.

- Set ```language``` parameter to ```1```: Python language.

- Set ```language``` parameter to ```2```: C++ language.

- Set ```language``` parameter to ```3```: Visual strategy.

- Set ```language``` parameter to ```4```: My language.

- Set ```language``` parameter to ```5```: PINE language.
- `kw` (string, required): The ```kw``` parameter is used to set keywords for querying strategies.

- Set to an empty string to not use keyword filtering.

Returns: `

Returns: `

Returns: `

Returns: j

Returns: s

Returns: o

Returns: n

Returns: 

Returns: {

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: c

Returns: o

Returns: d

Returns: e

Returns: "

Returns: :

Returns: 

Returns: 0

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: d

Returns: a

Returns: t

Returns: a

Returns: "

Returns: :

Returns: 

Returns: {

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: r

Returns: e

Returns: s

Returns: u

Returns: l

Returns: t

Returns: "

Returns: :

Returns: 

Returns: {

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: a

Returns: l

Returns: l

Returns: "

Returns: :

Returns: 

Returns: 1

Returns: 2

Returns: 3

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: s

Returns: t

Returns: r

Returns: a

Returns: t

Returns: e

Returns: g

Returns: i

Returns: e

Returns: s

Returns: "

Returns: :

Returns: 

Returns: [

Returns: {

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: c

Returns: a

Returns: t

Returns: e

Returns: g

Returns: o

Returns: r

Returns: y

Returns: "

Returns: :

Returns: 

Returns: 9

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: d

Returns: a

Returns: t

Returns: e

Returns: "

Returns: :

Returns: 

Returns: "

Returns: 2

Returns: 0

Returns: 2

Returns: 4

Returns: -

Returns: 1

Returns: 1

Returns: -

Returns: 1

Returns: 0

Returns: 

Returns: 2

Returns: 0

Returns: :

Returns: 4

Returns: 0

Returns: :

Returns: 0

Returns: 4

Returns: "

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: d

Returns: e

Returns: s

Returns: c

Returns: r

Returns: i

Returns: p

Returns: t

Returns: i

Returns: o

Returns: n

Returns: "

Returns: :

Returns: 

Returns: "

Returns: "

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: f

Returns: o

Returns: r

Returns: k

Returns: e

Returns: d

Returns: "

Returns: :

Returns: 

Returns: 0

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: h

Returns: i

Returns: t

Returns: s

Returns: "

Returns: :

Returns: 

Returns: 0

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: i

Returns: d

Returns: "

Returns: :

Returns: 

Returns: 1

Returns: 2

Returns: 3

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: i

Returns: s

Returns: _

Returns: b

Returns: u

Returns: y

Returns: "

Returns: :

Returns: 

Returns: f

Returns: a

Returns: l

Returns: s

Returns: e

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: i

Returns: s

Returns: _

Returns: o

Returns: w

Returns: n

Returns: e

Returns: r

Returns: "

Returns: :

Returns: 

Returns: f

Returns: a

Returns: l

Returns: s

Returns: e

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: l

Returns: a

Returns: n

Returns: g

Returns: u

Returns: a

Returns: g

Returns: e

Returns: "

Returns: :

Returns: 

Returns: 2

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: l

Returns: a

Returns: s

Returns: t

Returns: _

Returns: m

Returns: o

Returns: d

Returns: i

Returns: f

Returns: i

Returns: e

Returns: d

Returns: "

Returns: :

Returns: 

Returns: "

Returns: 2

Returns: 0

Returns: 2

Returns: 4

Returns: -

Returns: 1

Returns: 1

Returns: -

Returns: 1

Returns: 1

Returns: 

Returns: 1

Returns: 7

Returns: :

Returns: 2

Returns: 3

Returns: :

Returns: 5

Returns: 2

Returns: "

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: n

Returns: a

Returns: m

Returns: e

Returns: "

Returns: :

Returns: 

Returns: "

Returns: H

Returns: e

Returns: d

Returns: g

Returns: e

Returns: G

Returns: r

Returns: i

Returns: d

Returns: S

Returns: t

Returns: r

Returns: a

Returns: t

Returns: e

Returns: g

Returns: y

Returns: "

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: p

Returns: r

Returns: o

Returns: f

Returns: i

Returns: l

Returns: e

Returns: "

Returns: :

Returns: 

Returns: {

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: a

Returns: v

Returns: a

Returns: t

Returns: a

Returns: r

Returns: "

Returns: :

Returns: 

Returns: "

Returns: .

Returns: .

Returns: .

Returns: "

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: n

Returns: i

Returns: c

Returns: k

Returns: n

Returns: a

Returns: m

Returns: e

Returns: "

Returns: :

Returns: 

Returns: "

Returns: a

Returns: b

Returns: c

Returns: "

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: u

Returns: i

Returns: d

Returns: "

Returns: :

Returns: 

Returns: "

Returns: 4

Returns: e

Returns: d

Returns: 2

Returns: 2

Returns: 5

Returns: 4

Returns: 4

Returns: 0

Returns: d

Returns: b

Returns: 1

Returns: e

Returns: d

Returns: a

Returns: 2

Returns: 3

Returns: f

Returns: e

Returns: 0

Returns: 5

Returns: e

Returns: d

Returns: 1

Returns: 0

Returns: 1

Returns: 8

Returns: 4

Returns: 1

Returns: 1

Returns: 3

Returns: e

Returns: "

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: }

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: p

Returns: u

Returns: b

Returns: l

Returns: i

Returns: c

Returns: "

Returns: :

Returns: 

Returns: 0

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: t

Returns: a

Returns: g

Returns: s

Returns: "

Returns: :

Returns: 

Returns: "

Returns: "

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: u

Returns: i

Returns: d

Returns: "

Returns: :

Returns: 

Returns: "

Returns: 4

Returns: e

Returns: d

Returns: 2

Returns: 2

Returns: 5

Returns: 4

Returns: 4

Returns: 0

Returns: d

Returns: b

Returns: 1

Returns: e

Returns: d

Returns: a

Returns: 2

Returns: 3

Returns: f

Returns: e

Returns: 0

Returns: 5

Returns: e

Returns: d

Returns: 1

Returns: 0

Returns: 1

Returns: 8

Returns: 4

Returns: 1

Returns: 1

Returns: 3

Returns: e

Returns: "

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: u

Returns: s

Returns: e

Returns: r

Returns: n

Returns: a

Returns: m

Returns: e

Returns: "

Returns: :

Returns: 

Returns: "

Returns: a

Returns: b

Returns: c

Returns: "

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: }

Returns: ]

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: }

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: e

Returns: r

Returns: r

Returns: o

Returns: r

Returns: "

Returns: :

Returns: 

Returns: n

Returns: u

Returns: l

Returns: l

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: }

Returns: 

Returns: }

Returns: 

Returns: `

Returns: `

Returns: `

Returns: 

Returns: 

Returns: -

Returns: 

Returns: a

Returns: l

Returns: l

Returns: :

Returns: 

Returns: T

Returns: o

Returns: t

Returns: a

Returns: l

Returns: 

Returns: n

Returns: u

Returns: m

Returns: b

Returns: e

Returns: r

Returns: 

Returns: o

Returns: f

Returns: 

Returns: s

Returns: t

Returns: r

Returns: a

Returns: t

Returns: e

Returns: g

Returns: i

Returns: e

Returns: s

Returns: 

Returns: m

Returns: a

Returns: t

Returns: c

Returns: h

Returns: i

Returns: n

Returns: g

Returns: 

Returns: t

Returns: h

Returns: e

Returns: 

Returns: f

Returns: i

Returns: l

Returns: t

Returns: e

Returns: r

Returns: 

Returns: c

Returns: r

Returns: i

Returns: t

Returns: e

Returns: r

Returns: i

Returns: a

Returns: .

Returns: 

Returns: -

Returns: 

Returns: s

Returns: t

Returns: r

Returns: a

Returns: t

Returns: e

Returns: g

Returns: i

Returns: e

Returns: s

Returns: :

Returns: 

Returns: D

Returns: e

Returns: t

Returns: a

Returns: i

Returns: l

Returns: e

Returns: d

Returns: 

Returns: i

Returns: n

Returns: f

Returns: o

Returns: r

Returns: m

Returns: a

Returns: t

Returns: i

Returns: o

Returns: n

Returns: 

Returns: o

Returns: f

Returns: 

Returns: s

Returns: t

Returns: r

Returns: a

Returns: t

Returns: e

Returns: g

Returns: i

Returns: e

Returns: s

Returns: 

Returns: r

Returns: e

Returns: t

Returns: u

Returns: r

Returns: n

Returns: e

Returns: d

Returns: 

Returns: b

Returns: y

Returns: 

Returns: t

Returns: h

Returns: e

Returns: 

Returns: q

Returns: u

Returns: e

Returns: r

Returns: y

Returns: .

##### NewRobot

The ```NewRobot``` method is used to create a live trading bot under the FMZ Quant Trading Platform account corresponding to the ```API KEY``` in the request.

Parameters:

- `settings` (JSON Object, required): Live trading configuration parameters. The ```settings``` parameter format is as follows:

```json
{
    "appid":"test",
    "args":[],
    "exchanges":[
        {"pair":"SOL_USDT","pid":123}
    ],
    "group":123,
    "name":"test",
    "node":123,
    "period":60,
    "strategy":123
}
```

- group: Specify the live trading group.
- args: Strategy parameters, empty array if the strategy has no parameters.
- exchanges: Exchange object configuration, refer to the ```RestartRobot``` interface.

Returns: `

Returns: `

Returns: `

Returns: j

Returns: s

Returns: o

Returns: n

Returns: 

Returns: {

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: c

Returns: o

Returns: d

Returns: e

Returns: "

Returns: :

Returns: 0

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: d

Returns: a

Returns: t

Returns: a

Returns: "

Returns: :

Returns: {

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: r

Returns: e

Returns: s

Returns: u

Returns: l

Returns: t

Returns: "

Returns: :

Returns: 5

Returns: 9

Returns: 1

Returns: 9

Returns: 8

Returns: 8

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: e

Returns: r

Returns: r

Returns: o

Returns: r

Returns: "

Returns: :

Returns: n

Returns: u

Returns: l

Returns: l

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: }

Returns: 

Returns: }

Returns: 

Returns: `

Returns: `

Returns: `

Returns: 

Returns: 

Returns: -

Returns: 

Returns: r

Returns: e

Returns: s

Returns: u

Returns: l

Returns: t

Returns: :

Returns: 

Returns: S

Returns: u

Returns: c

Returns: c

Returns: e

Returns: s

Returns: s

Returns: f

Returns: u

Returns: l

Returns: l

Returns: y

Returns: 

Returns: c

Returns: r

Returns: e

Returns: a

Returns: t

Returns: e

Returns: d

Returns: ,

Returns: 

Returns: r

Returns: e

Returns: t

Returns: u

Returns: r

Returns: n

Returns: s

Returns: 

Returns: t

Returns: h

Returns: e

Returns: 

Returns: l

Returns: i

Returns: v

Returns: e

Returns: 

Returns: t

Returns: r

Returns: a

Returns: d

Returns: i

Returns: n

Returns: g

Returns: 

Returns: I

Returns: D

Returns: .

Sensitive information such as ```"meta":{"AccessKey": "123", "SecretKey": "123"}``` configured in the ```eid``` of the ```settings``` parameter will not be stored by the FMZ Quant Trading Platform. This data will be directly forwarded to the docker program, so this information must be configured each time a live trading bot is created or restarted.

When creating a live trading bot using a general protocol exchange object, the ```exchanges``` property can use the following settings when configuring the ```settings``` parameter:
```json
{
    "eid": "Exchange",
    "label": "test",
    "pair": "ETH_BTC",
    "meta": {
        "AccessKey": "123",
        "SecretKey": "123",
        "Front": "http://127.0.0.1:6666/test"
    }
}
```

The ```label``` property is used to set a label for the current general protocol connected exchange object, which can be retrieved in the strategy using the ```exchange.GetLabel()``` function.

##### PluginRun

The ```PluginRun``` method is used to call the **debugging tool** functionality of the FMZ Quant Trading Platform; only JavaScript language is supported.

Parameters:

- `settings` (JSON object, required): Setting parameters in the debugging tool, the ```settings``` configuration contains test code located in the ```source``` attribute. The ```settings``` parameter format is as follows:

```json
{
    "exchanges":[{"pair":"SOL_USDT","pid":123}],
    "node":123,
    "period":60,
    "source":"function main() {Log(\"Hello FMZ\")}"
}
```

- source: The code to be debugged.
- node: Docker ID, specifies which docker to run the live trading on. If this value is -1, it means automatic allocation.
- exchanges: Exchange object configuration, refer to the ```RestartRobot``` interface.

Returns: `

Returns: `

Returns: `

Returns: j

Returns: s

Returns: o

Returns: n

Returns: 

Returns: {

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: c

Returns: o

Returns: d

Returns: e

Returns: "

Returns: :

Returns: 

Returns: 0

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: d

Returns: a

Returns: t

Returns: a

Returns: "

Returns: :

Returns: 

Returns: {

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: r

Returns: e

Returns: s

Returns: u

Returns: l

Returns: t

Returns: "

Returns: :

Returns: 

Returns: "

Returns: {

Returns: \

Returns: "

Returns: l

Returns: o

Returns: g

Returns: s

Returns: \

Returns: "

Returns: :

Returns: [

Returns: {

Returns: \

Returns: "

Returns: P

Returns: l

Returns: a

Returns: t

Returns: f

Returns: o

Returns: r

Returns: m

Returns: I

Returns: d

Returns: \

Returns: "

Returns: :

Returns: \

Returns: "

Returns: \

Returns: "

Returns: ,

Returns: \

Returns: "

Returns: O

Returns: r

Returns: d

Returns: e

Returns: r

Returns: I

Returns: d

Returns: \

Returns: "

Returns: :

Returns: \

Returns: "

Returns: 0

Returns: \

Returns: "

Returns: ,

Returns: \

Returns: "

Returns: L

Returns: o

Returns: g

Returns: T

Returns: y

Returns: p

Returns: e

Returns: \

Returns: "

Returns: :

Returns: 5

Returns: ,

Returns: \

Returns: "

Returns: P

Returns: r

Returns: i

Returns: c

Returns: e

Returns: \

Returns: "

Returns: :

Returns: 0

Returns: ,

Returns: \

Returns: "

Returns: A

Returns: m

Returns: o

Returns: u

Returns: n

Returns: t

Returns: \

Returns: "

Returns: :

Returns: 0

Returns: ,

Returns: \

Returns: "

Returns: E

Returns: x

Returns: t

Returns: r

Returns: a

Returns: \

Returns: "

Returns: :

Returns: \

Returns: "

Returns: H

Returns: e

Returns: l

Returns: l

Returns: o

Returns: 

Returns: F

Returns: M

Returns: Z

Returns: \

Returns: "

Returns: ,

Returns: \

Returns: "

Returns: C

Returns: u

Returns: r

Returns: r

Returns: e

Returns: n

Returns: c

Returns: y

Returns: \

Returns: "

Returns: :

Returns: \

Returns: "

Returns: \

Returns: "

Returns: ,

Returns: \

Returns: "

Returns: I

Returns: n

Returns: s

Returns: t

Returns: r

Returns: u

Returns: m

Returns: e

Returns: n

Returns: t

Returns: \

Returns: "

Returns: :

Returns: \

Returns: "

Returns: \

Returns: "

Returns: ,

Returns: \

Returns: "

Returns: D

Returns: i

Returns: r

Returns: e

Returns: c

Returns: t

Returns: i

Returns: o

Returns: n

Returns: \

Returns: "

Returns: :

Returns: \

Returns: "

Returns: \

Returns: "

Returns: ,

Returns: \

Returns: "

Returns: T

Returns: i

Returns: m

Returns: e

Returns: \

Returns: "

Returns: :

Returns: 1

Returns: 7

Returns: 3

Returns: 2

Returns: 2

Returns: 6

Returns: 7

Returns: 4

Returns: 7

Returns: 3

Returns: 1

Returns: 0

Returns: 8

Returns: }

Returns: ]

Returns: ,

Returns: \

Returns: "

Returns: r

Returns: e

Returns: s

Returns: u

Returns: l

Returns: t

Returns: \

Returns: "

Returns: :

Returns: \

Returns: "

Returns: \

Returns: "

Returns: }

Returns: "

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: e

Returns: r

Returns: r

Returns: o

Returns: r

Returns: "

Returns: :

Returns: 

Returns: n

Returns: u

Returns: l

Returns: l

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: }

Returns: 

Returns: }

Returns: 

Returns: `

Returns: `

Returns: `

Returns: 

Returns: 

Returns: -

Returns: 

Returns: r

Returns: e

Returns: s

Returns: u

Returns: l

Returns: t

Returns: :

Returns: 

Returns: T

Returns: e

Returns: s

Returns: t

Returns: 

Returns: r

Returns: e

Returns: s

Returns: u

Returns: l

Returns: t

Returns: 

Returns: d

Returns: a

Returns: t

Returns: a

Returns: 

Returns: r

Returns: e

Returns: t

Returns: u

Returns: r

Returns: n

Returns: e

Returns: d

Returns: 

Returns: a

Returns: f

Returns: t

Returns: e

Returns: r

Returns: 

Returns: t

Returns: h

Returns: e

Returns: 

Returns: d

Returns: e

Returns: b

Returns: u

Returns: g

Returns: g

Returns: i

Returns: n

Returns: g

Returns: 

Returns: t

Returns: o

Returns: o

Returns: l

Returns: 

Returns: s

Returns: u

Returns: c

Returns: c

Returns: e

Returns: s

Returns: s

Returns: f

Returns: u

Returns: l

Returns: l

Returns: y

Returns: 

Returns: e

Returns: x

Returns: e

Returns: c

Returns: u

Returns: t

Returns: e

Returns: s

Returns: 

Returns: t

Returns: h

Returns: e

Returns: 

Returns: p

Returns: a

Returns: s

Returns: s

Returns: e

Returns: d

Returns: 

Returns: J

Returns: a

Returns: v

Returns: a

Returns: S

Returns: c

Returns: r

Returns: i

Returns: p

Returns: t

Returns: 

Returns: c

Returns: o

Returns: d

Returns: e

Returns: .

```{"eid": "OKEX", "pair": "ETH_BTC", "meta" :{"AccessKey": "123", "SecretKey": "123"}}```
```{"eid": "Huobi", "pair": "BCH_BTC", "meta" :{"AccessKey": "123", "SecretKey": "123"}}```

For the ```exchanges``` attribute in ```settings```, only one needs to be set when calling the ```PluginRun``` method (only one exchange object is supported when using the debugging tool page). Setting 2 exchange objects in ```settings``` will not cause an error, but accessing the second exchange object in the code will cause an error.

##### GetRobotLogs

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

Returns: `

Returns: `

Returns: `

Returns: j

Returns: s

Returns: o

Returns: n

Returns: 

Returns: {

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: c

Returns: o

Returns: d

Returns: e

Returns: "

Returns: :

Returns: 

Returns: 0

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: d

Returns: a

Returns: t

Returns: a

Returns: "

Returns: :

Returns: 

Returns: {

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: r

Returns: e

Returns: s

Returns: u

Returns: l

Returns: t

Returns: "

Returns: :

Returns: 

Returns: {

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: c

Returns: h

Returns: a

Returns: r

Returns: t

Returns: "

Returns: :

Returns: 

Returns: "

Returns: "

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: c

Returns: h

Returns: a

Returns: r

Returns: t

Returns: T

Returns: i

Returns: m

Returns: e

Returns: "

Returns: :

Returns: 

Returns: 0

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: l

Returns: o

Returns: g

Returns: s

Returns: "

Returns: :

Returns: 

Returns: [

Returns: {

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: T

Returns: o

Returns: t

Returns: a

Returns: l

Returns: "

Returns: :

Returns: 

Returns: 2

Returns: 0

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: M

Returns: a

Returns: x

Returns: "

Returns: :

Returns: 

Returns: 2

Returns: 0

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: M

Returns: i

Returns: n

Returns: "

Returns: :

Returns: 

Returns: 1

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: A

Returns: r

Returns: r

Returns: "

Returns: :

Returns: 

Returns: [

Returns: ]

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: }

Returns: ,

Returns: 

Returns: {

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: T

Returns: o

Returns: t

Returns: a

Returns: l

Returns: "

Returns: :

Returns: 

Returns: 0

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: M

Returns: a

Returns: x

Returns: "

Returns: :

Returns: 

Returns: 0

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: M

Returns: i

Returns: n

Returns: "

Returns: :

Returns: 

Returns: 0

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: A

Returns: r

Returns: r

Returns: "

Returns: :

Returns: 

Returns: [

Returns: ]

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: }

Returns: ,

Returns: 

Returns: {

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: T

Returns: o

Returns: t

Returns: a

Returns: l

Returns: "

Returns: :

Returns: 

Returns: 0

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: M

Returns: a

Returns: x

Returns: "

Returns: :

Returns: 

Returns: 0

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: M

Returns: i

Returns: n

Returns: "

Returns: :

Returns: 

Returns: 0

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: A

Returns: r

Returns: r

Returns: "

Returns: :

Returns: 

Returns: [

Returns: ]

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: }

Returns: ]

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: n

Returns: o

Returns: d

Returns: e

Returns: _

Returns: i

Returns: d

Returns: "

Returns: :

Returns: 

Returns: 1

Returns: 2

Returns: 3

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: o

Returns: n

Returns: l

Returns: i

Returns: n

Returns: e

Returns: "

Returns: :

Returns: 

Returns: t

Returns: r

Returns: u

Returns: e

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: r

Returns: e

Returns: f

Returns: r

Returns: e

Returns: s

Returns: h

Returns: "

Returns: :

Returns: 

Returns: 1

Returns: 7

Returns: 3

Returns: 2

Returns: 2

Returns: 0

Returns: 1

Returns: 5

Returns: 4

Returns: 4

Returns: 0

Returns: 0

Returns: 0

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: s

Returns: t

Returns: a

Returns: t

Returns: u

Returns: s

Returns: "

Returns: :

Returns: 

Returns: 4

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: s

Returns: u

Returns: m

Returns: m

Returns: a

Returns: r

Returns: y

Returns: "

Returns: :

Returns: 

Returns: "

Returns: .

Returns: .

Returns: .

Returns: "

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: u

Returns: p

Returns: d

Returns: a

Returns: t

Returns: e

Returns: T

Returns: i

Returns: m

Returns: e

Returns: "

Returns: :

Returns: 

Returns: 1

Returns: 7

Returns: 3

Returns: 2

Returns: 2

Returns: 0

Returns: 1

Returns: 5

Returns: 3

Returns: 2

Returns: 6

Returns: 3

Returns: 6

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: w

Returns: d

Returns: "

Returns: :

Returns: 

Returns: 0

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: }

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: e

Returns: r

Returns: r

Returns: o

Returns: r

Returns: "

Returns: :

Returns: 

Returns: n

Returns: u

Returns: l

Returns: l

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: }

Returns: 

Returns: }

Returns: 

Returns: `

Returns: `

Returns: `

Returns: 

Returns: 

Returns: -

Returns: 

Returns: l

Returns: o

Returns: g

Returns: s

Returns: :

Returns: 

Returns: L

Returns: o

Returns: g

Returns: 

Returns: i

Returns: n

Returns: f

Returns: o

Returns: r

Returns: m

Returns: a

Returns: t

Returns: i

Returns: o

Returns: n

Returns: ;

Returns: 

Returns: t

Returns: h

Returns: e

Returns: 

Returns: q

Returns: u

Returns: e

Returns: r

Returns: i

Returns: e

Returns: d

Returns: 

Returns: l

Returns: o

Returns: g

Returns: 

Returns: d

Returns: a

Returns: t

Returns: a

Returns: 

Returns: e

Returns: n

Returns: t

Returns: r

Returns: i

Returns: e

Returns: s

Returns: 

Returns: a

Returns: r

Returns: e

Returns: 

Returns: s

Returns: t

Returns: o

Returns: r

Returns: e

Returns: d

Returns: 

Returns: i

Returns: n

Returns: 

Returns: t

Returns: h

Returns: e

Returns: 

Returns: A

Returns: r

Returns: r

Returns: 

Returns: f

Returns: i

Returns: e

Returns: l

Returns: d

Returns: .

Returns: 

Returns: 

Returns: 

Returns: T

Returns: h

Returns: e

Returns: 

Returns: f

Returns: i

Returns: r

Returns: s

Returns: t

Returns: 

Returns: d

Returns: a

Returns: t

Returns: a

Returns: 

Returns: s

Returns: t

Returns: r

Returns: u

Returns: c

Returns: t

Returns: u

Returns: r

Returns: e

Returns: 

Returns: i

Returns: n

Returns: 

Returns: l

Returns: o

Returns: g

Returns: s

Returns: 

Returns: c

Returns: o

Returns: n

Returns: t

Returns: a

Returns: i

Returns: n

Returns: s

Returns: 

Returns: l

Returns: o

Returns: g

Returns: 

Returns: r

Returns: e

Returns: c

Returns: o

Returns: r

Returns: d

Returns: s

Returns: 

Returns: f

Returns: r

Returns: o

Returns: m

Returns: 

Returns: t

Returns: h

Returns: e

Returns: 

Returns: s

Returns: t

Returns: r

Returns: a

Returns: t

Returns: e

Returns: g

Returns: y

Returns: 

Returns: l

Returns: o

Returns: g

Returns: 

Returns: t

Returns: a

Returns: b

Returns: l

Returns: e

Returns: 

Returns: i

Returns: n

Returns: 

Returns: t

Returns: h

Returns: e

Returns: 

Returns: l

Returns: i

Returns: v

Returns: e

Returns: 

Returns: t

Returns: r

Returns: a

Returns: d

Returns: i

Returns: n

Returns: g

Returns: 

Returns: d

Returns: a

Returns: t

Returns: a

Returns: b

Returns: a

Returns: s

Returns: e

Returns: .

Returns: 

Returns: 

Returns: 

Returns: T

Returns: h

Returns: e

Returns: 

Returns: s

Returns: e

Returns: c

Returns: o

Returns: n

Returns: d

Returns: 

Returns: d

Returns: a

Returns: t

Returns: a

Returns: 

Returns: s

Returns: t

Returns: r

Returns: u

Returns: c

Returns: t

Returns: u

Returns: r

Returns: e

Returns: 

Returns: i

Returns: n

Returns: 

Returns: l

Returns: o

Returns: g

Returns: s

Returns: 

Returns: c

Returns: o

Returns: n

Returns: t

Returns: a

Returns: i

Returns: n

Returns: s

Returns: 

Returns: l

Returns: o

Returns: g

Returns: 

Returns: r

Returns: e

Returns: c

Returns: o

Returns: r

Returns: d

Returns: s

Returns: 

Returns: f

Returns: r

Returns: o

Returns: m

Returns: 

Returns: t

Returns: h

Returns: e

Returns: 

Returns: p

Returns: r

Returns: o

Returns: f

Returns: i

Returns: t

Returns: 

Returns: l

Returns: o

Returns: g

Returns: 

Returns: t

Returns: a

Returns: b

Returns: l

Returns: e

Returns: 

Returns: i

Returns: n

Returns: 

Returns: t

Returns: h

Returns: e

Returns: 

Returns: l

Returns: i

Returns: v

Returns: e

Returns: 

Returns: t

Returns: r

Returns: a

Returns: d

Returns: i

Returns: n

Returns: g

Returns: 

Returns: d

Returns: a

Returns: t

Returns: a

Returns: b

Returns: a

Returns: s

Returns: e

Returns: .

Returns: 

Returns: 

Returns: 

Returns: T

Returns: h

Returns: e

Returns: 

Returns: t

Returns: h

Returns: i

Returns: r

Returns: d

Returns: 

Returns: d

Returns: a

Returns: t

Returns: a

Returns: 

Returns: s

Returns: t

Returns: r

Returns: u

Returns: c

Returns: t

Returns: u

Returns: r

Returns: e

Returns: 

Returns: i

Returns: n

Returns: 

Returns: l

Returns: o

Returns: g

Returns: s

Returns: 

Returns: c

Returns: o

Returns: n

Returns: t

Returns: a

Returns: i

Returns: n

Returns: s

Returns: 

Returns: l

Returns: o

Returns: g

Returns: 

Returns: r

Returns: e

Returns: c

Returns: o

Returns: r

Returns: d

Returns: s

Returns: 

Returns: f

Returns: r

Returns: o

Returns: m

Returns: 

Returns: t

Returns: h

Returns: e

Returns: 

Returns: c

Returns: h

Returns: a

Returns: r

Returns: t

Returns: 

Returns: l

Returns: o

Returns: g

Returns: 

Returns: t

Returns: a

Returns: b

Returns: l

Returns: e

Returns: 

Returns: i

Returns: n

Returns: 

Returns: t

Returns: h

Returns: e

Returns: 

Returns: l

Returns: i

Returns: v

Returns: e

Returns: 

Returns: t

Returns: r

Returns: a

Returns: d

Returns: i

Returns: n

Returns: g

Returns: 

Returns: d

Returns: a

Returns: t

Returns: a

Returns: b

Returns: a

Returns: s

Returns: e

Returns: .

Returns: 

Returns: -

Returns: 

Returns: s

Returns: u

Returns: m

Returns: m

Returns: a

Returns: r

Returns: y

Returns: :

Returns: 

Returns: L

Returns: i

Returns: v

Returns: e

Returns: 

Returns: t

Returns: r

Returns: a

Returns: d

Returns: i

Returns: n

Returns: g

Returns: 

Returns: s

Returns: t

Returns: a

Returns: t

Returns: u

Returns: s

Returns: 

Returns: b

Returns: a

Returns: r

Returns: 

Returns: d

Returns: a

Returns: t

Returns: a

Returns: .

- Strategy log table in database
  The description of the ```Arr``` attribute value in the first element (log data) of the ```logs``` attribute value (array structure) in the returned data is as follows:

  ```plaintext
  "Arr": [
      [3977, 3, "Futures_OKCoin", "", 0, 0, "Sell(688.9, 2): 20016", 1526954372591, "", ""],
      [3976, 5, "", "", 0, 0, "OKCoin:this_week Position too large, long: 2", 1526954372410, "", ""]
  ],
  ```

  | id | logType | eid | orderId | price | amount | extra | date | contractType | direction |
  | - | - | - | - | - | - | - | - | - | - |
  | 3977 | 3 | "Futures_OKCoin" | "" | 0 | 0 | "Sell(688.9, 2): 20016" | 1526954372591 | "" | "" |
  | 3976 | 5 | "" | "" | 0 | 0 | "OKCoin:this_week Position too large, long: 2" | 1526954372410 | "" | "" |

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

## MCP Service

MCP (Model Context Protocol) service is a protocol service for model context management, providing a unified interface to manage and exchange context information of AI models. This service supports multiple data formats and communication protocols, ensuring interoperability and data consistency between different AI systems.

For configuration and usage scenarios, please refer to:

[FMZ Platform Claude Intelligent Trading Guide (1)](https://www.fmz.com/digest-topic/10690)

[FMZ Platform Claude Intelligent Trading Guide (2)](https://www.fmz.com/digest-topic/10692)

## Trading Terminal

FMZ Quant Trading Platform provides a modular and customizable [Trading Terminal](https://www.fmz.com/m/trade) page. Users can freely add various data modules, trading function modules, and even write code to develop custom modules (Trading Terminal plugins).

With its highly flexible and free usage approach, it greatly facilitates manual trading and semi-automated trading users. Various modules on the Trading Terminal page support dragging and resizing, can modify settings such as trading pairs and exchanges bound to modules, and can add multiple modules of the same type.

FMZ Quant Trading Platform continuously improves Trading Terminal functionality and has launched the Trading Terminal plugin feature to better support manual trading.

Trading Terminal related data is stored in the running directory of the docker program (robot executable file), specifically at: ```logs/storage/0```. If the exchange object used by the Trading Terminal is configured using API key file path method, the key file needs to be placed in this directory.

### Plugin Principle

The principle is the same as the **Debugging Tool** - it sends a code snippet to the selected docker on the trading terminal page for execution, supporting the return of charts and tables (the debugging tool has also been upgraded to support this feature). Like the **Debugging Tool**, it can only execute for 3 minutes, and this feature is free of charge. It can be used to implement simple functions to assist manual trading, while complex strategies still need to run in live trading.

### Plugin Development

Create trading terminal plugins by setting the strategy type to "Trading Plugin" on the **New Strategy** page. Trading plugins support ```JavaScript```, ```Python```, ```C++```, and ```MyLanguage```.

### Plugin Use Cases

A plugin can run a piece of code to perform some simple operations, such as iceberg orders, placing orders, canceling orders, calculations, and other tasks. Like the debugging tool, a plugin returns results via return, and it can also directly return charts and tables. Below are a few examples; you can explore other features on your own.

- Return a depth snapshot
  ```js
  // Return the depth snapshot
  function main() {
      var tbl = {
          type: 'table',
          title: 'Depth Snapshot @ ' + _D(),
          cols: ['#', 'Amount', 'Ask', 'Bid', 'Amount'],
          rows: []
      }
      var d = exchange.GetDepth()
      for (var i = 0; i < Math.min(Math.min(d.Asks.length, d.Bids.length), 15); i++) {
          tbl.rows.push([i, d.Asks[i].Amount, d.Asks[i].Price+'#ff0000', d.Bids[i].Price+'#0000ff', d.Bids[i].Amount])
      }
      return tbl
  }
  ```

  ```python
  def main():
      tbl = {
          "type": "table",
          "title": "Depth Snapshot @ " + _D(),
          "cols": ["#", "Amount", "Ask", "Bid", "Amount"],
          "rows": []
      }
      d = exchange.GetDepth()
      for i in range(min(min(len(d["Asks"]), len(d["Bids"])), 15)):
          tbl["rows"].append([i, d["Asks"][i]["Amount"], str(d["Asks"][i]["Price"]) + "#FF0000", str(d["Bids"][i]["Price"]) + "#0000FF", d["Bids"][i]["Amount"]])
      return tbl
  ```

  ```rust
  fn main() {
      let d = exchange.GetDepth(None).unwrap();
      let n = d.Asks.len().min(d.Bids.len()).min(15);
      let mut rows = Vec::new();
      for i in 0..n {
          rows.push(format!(r#"[{}, {}, "{}#ff0000", "{}#0000ff", {}]"#, i, d.Asks[i].Amount, d.Asks[i].Price, d.Bids[i].Price, d.Bids[i].Amount));
      }
      let tbl = format!(
          r##"{{"type": "table", "title": "Depth Snapshot @ {}", "cols": ["#", "Amount", "Ask", "Bid", "Amount"], "rows": [{}]}}"##,
          _D(None), rows.join(","));

      LogStatus!(format!("`{}`", tbl));
      // Rust does not support returning json to display a table; you can create a live trading bot to display a status bar table
  }
  ```

  ```cpp
  void main() {
      json tbl = R"({
          "type": "table",
          "title": "abc",
          "cols": ["#", "Amount", "Ask", "Bid", "Amount"],
          "rows": []
      })"_json;

      tbl["title"] = "Depth Snapshot @" + _D();
      auto d = exchange.GetDepth();
      for(int i = 0; i < 5; i++) {
          tbl["rows"].push_back({format("%d", i), format("%f", d.Asks[i].Amount), format("%f #FF0000", d.Asks[i].Price), format("%f #0000FF", d.Bids[i].Price), format("%f", d.Bids[i].Amount)});
      }

      LogStatus("`" + tbl.dump() + "`");
      // C++ does not support returning json to display a table; you can create a live trading bot to display a status bar table
  }
  ```
- Plot the calendar spread
  ```js
  // Plot the calendar spread
  var chart = {
      __isStock: true,
      title : { text : 'Spread Analysis Chart'},
      xAxis: { type: 'datetime'},
      yAxis : {
          title: {text: 'Spread'},
          opposite: false
      },
      series : [
          {name : "diff", data : []}
      ]
  }

  function main() {
      exchange.SetContractType('quarter')
      var recordsA = exchange.GetRecords(PERIOD_M5)
      exchange.SetContractType('this_week')
      var recordsB = exchange.GetRecords(PERIOD_M5)

      for(var i = 0; i < Math.min(recordsA.length, recordsB.length); i++){
          var diff = recordsA[recordsA.length - Math.min(recordsA.length, recordsB.length) + i].Close - recordsB[recordsB.length - Math.min(recordsA.length, recordsB.length) + i].Close
          chart.series[0].data.push([recordsA[recordsA.length - Math.min(recordsA.length, recordsB.length) + i].Time, diff])
      }
      return chart
  }
  ```

  ```python
  chart = {
      "__isStock": True,
      "title": {"text": "Spread Analysis Chart"},
      "xAxis": {"type": "datetime"},
      "yAxis": {
          "title": {"text": "Spread"},
          "opposite": False
      },
      "series": [
          {"name": "diff", "data": []}
      ]
  }

  def main():
      exchange.SetContractType("quarter")
      recordsA = exchange.GetRecords(PERIOD_M5)
      exchange.SetContractType("this_week")
      recordsB = exchange.GetRecords(PERIOD_M5)

      for i in range(min(len(recordsA), len(recordsB))):
          diff = recordsA[len(recordsA) - min(len(recordsA), len(recordsB)) + i].Close - recordsB[len(recordsB) - min(len(recordsA), len(recordsB)) + i].Close
          chart["series"][0]["data"].append([recordsA[len(recordsA) - min(len(recordsA), len(recordsB)) + i]["Time"], diff])
      return chart
  ```

  ```cpp
  // C++ does not support returning json structures to plot charts
  ```

The **Strategy Square** also contains other examples for reference, such as: tick-by-tick small-volume buying/selling.

### Usage

- Add Trading Terminal Plugin Module
  Open the module addition menu on the trading terminal page. Trading terminal plugins from the current FMZ account's strategy library will automatically appear in the list. Find the plugin you need to add and click to add it.
  - Run Plugin
  Click the "Execute" button to start running the trading terminal plugin. The plugin will not display log information, but can return and display data tables.
- Plugin Runtime
  The maximum runtime for trading terminal plugins is 3 minutes. Plugins will automatically stop running after 3 minutes.

## Data Explorer

The **datadata** platform, independently developed by FMZ Quant, is a quantitative financial data platform. The [Data Explorer](https://www.fmz.com/m/database) module of FMZ Quant Trading Platform has integrated the services and functions of the **datadata** platform.

FMZ Quant users can use it out of the box without registering a separate **datadata** account. This gives users advantages in multi-dimensional data analysis, mining, data visualization, and trading strategy exploration. Analyze massive data through SQL queries, configure via visual interface to generate various charts suitable for data analysis and share with your team, helping you easily grasp market dynamics and precisely capture investment opportunities! For usage examples, please refer to: [Data Explorer Module Topic Articles](https://www.fmz.com/digest-topic/10370).

### Data Sources

Data sources provided by the DataData platform are continuously updated in real-time, offering multi-dimensional and multi-type data support. Private data can be used as data sources, with support for uploading CSV format files, and data preview is available on the "Data Explorer" page.

### Data Query

Supports data querying using SQL statements with configurable query parameters. Supports the following data export formats: CSV files, JSON files.

### Save Exploration Research

To save the current data exploration research content, please click the "Save" button in the upper right corner to save this SQL query record to the resource list of "Data Exploration" in the current FMZ account (the resource list button is located to the left of the save button).

### Data Visualization

In addition to displaying data in tabular format, the analyzed and queried data can be adapted to various visualization components to present data in a richer and more dynamic way.

### Share Research

Supports sharing data exploration research results with multiple sharing formats: public links, embed codes (e.g., embedding in FMZ platform community posts), webpage embedding, data links, and preview image links. Research results from the data exploration module can not only be used for display but also provide data directly to strategies through created "data links", supporting both live trading and backtesting environments.

## Alpha Factor Analysis Tool

The analysis formulas reference the market calculation methods from ```worldquant```'s publicly available [```alpha101```](https://github.com/yli188/WorldQuant_alpha101_code/blob/master/101%20Formulaic%20Alphas.pdf), with basic compatibility for its syntax (unimplemented features are noted), and have been enhanced. This tool is used for rapid time series computation and validation of trading ideas. [Alpha Factor Analysis Tool Page](https://www.fmz.com/m/alpha).

### Functions and Operators

**The "{}" below represents placeholders, all expressions are case-insensitive, x represents data time series**

- ```abs(x), log(x), sign(x)``` Literal meaning, respectively absolute value, logarithm, sign function.

The following operators ``` +, -, *, /, >, < ``` also conform to their standard meanings, ```==```: equality check, ```||```: logical OR, ```x ? y : z```: ternary conditional operator.

- ```rank(x)``` : Cross-sectional ranking, returns percentile position. Requires specifying candidate universe pool, cannot be calculated for single ticker and will return raw result directly.
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

### Input Data

**Input data is case-insensitive. Default data is the instrument selected on the webpage, but can also be specified directly, for example: ```binance.ada_bnb```**

- ```returns```: Close price returns.
- ```open, close, high, low, volume```: Open price, close price, high price, low price and volume within the period.
- ```vwap```: Volume-weighted average price (not yet implemented, currently using close price).
- ```cap```: Total market capitalization (not yet implemented).
- ```IndClass```: Industry classification (not yet implemented).

### Others

Supports outputting multiple results at once, represented as a list. For example, ```[sma(close, 10), sma(high, 30)]``` will plot two lines on the chart. Besides inputting time series data, it can also be used as a simple calculator.

## General Protocol

For exchange API interfaces that have not yet been encapsulated and integrated by the FMZ Quant Trading Platform, you can access them by writing general protocol plugin programs.

![General Protocol Configuration Screenshot](https://www.fmz.com/upload/asset/2e43b059b3ec9f42ded6e.png)

This general protocol can be used to access any exchange that provides API interfaces, supporting the following two protocols:
- ```REST``` Protocol: [Reference Documentation](https://www.fmz.com/digest-topic/10518).
- ```FIX``` Protocol: [Reference Project](https://github.com/fmzquant/fixc).

The difference between ```FIX``` protocol plugin programs and ```REST``` protocol plugin programs lies only in the interaction method between the plugin program and the exchange interface. The interaction method, data format, and other implementation details between the protocol plugin program and the FMZ Quant docker program are exactly the same. For specific implementation, please refer to the examples in the above links.

## Debugging Tool

The [Debugging Tool](https://www.fmz.com/m/debug) page provides a free environment for quickly testing live trading code, currently supporting only the ```JavaScript``` language.

![Debugging Tool](https://www.fmz.com/upload/asset/2e48d6d1bc77e46099058.png)

When using the debugging tool to test code, the code will run directly on the specified docker, with a maximum runtime of 3 minutes. It supports calling all API functions of the FMZ Quant Trading Platform, but only supports a single exchange object.

## Remote Editing

![Remote Editing Screenshot](https://www.fmz.com/upload/asset/2e4e8975d1e32517fd989.png)

Supports remote synchronization of strategy code to FMZ Quant Trading Platform using local editors, including ```Sublime Text```/```Atom```/```Vim```/```VSCode``` editors.

![Supported Editor Plugins for Remote Editing](https://www.fmz.com/upload/asset/2e4da2d2a1fc4bc9bbce5.png)

Click "Remote Editing" on the strategy editing page to expand the plugin download buttons and display the current strategy's remote synchronization token.

- Click "Update Token" to refresh the current strategy's token.

- Click "Delete Token" to remove the current strategy's token.

Click the ```Sublime Text 3 Plugin```/```Atom Plugin```/```Vim Plugin```/```VSCode Plugin``` editor plugin download buttons on the page to navigate to the corresponding plugin projects. Installation methods vary slightly between different editors.

## Import and Export of Complete Strategies

![Strategy Import/Export Screenshot](https://www.fmz.com/upload/asset/2e52ccf44526f396fb795.png)

- Download Source Code
  Export strategy source code. The exported file type depends on the programming language used by the strategy. ```JavaScript``` strategies are exported as files with ```js``` extension; Python strategies are exported as files with ```py``` extension; C++ strategies are exported as files with ```cpp``` extension; MyLanguage strategies are exported as files with ```txt``` extension.
  Note: Only exports strategy source code, does not include strategy parameters, template references, or other configuration information.

- Export Strategy
  Export the complete strategy configuration, including strategy source code, parameter settings, and all other strategy-related information. The exported file format is ```xml```.

- Import Strategy
  Using the ```xml``` file exported via the "Export Strategy" function, click the "Import Strategy" button on the strategy editing page, select the ```xml``` file to import, and the complete strategy configuration will be imported.
  After import is complete, you need to click the "Save" button to save the strategy.

## Multi-language Support

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

```cpp
void main() {
    Log("[trans]日志|log[/trans]");
    json table = R"({
        "type": "table",
        "title": "[trans]操作|option[/trans]",
        "cols": ["[trans]列1|col1[/trans]", "[trans]列2|col2[/trans]", "[trans]操作|option[/trans]"],
        "rows": [
            ["[trans]比特币|BTC[/trans]", "[trans]以太坊|ETH[/trans]", {"type": "button", "cmd": "coverAll", "name": "平仓|cover", "description": "描述|description"}]
        ]
    })"_json;
    LogStatus("[trans]信息|message[/trans]", "\n`" + table.dump() + "`");
    Panic("[trans]错误|error[/trans]");
}
```

## Live Trading and Strategy Grouping

On the FMZ Quant Trading Platform's "Live Trading" page and "Strategy Library" page, you can click the **Group Management** button on the right side to manage strategies and live trading instances by groups.
For example, when managing strategy groups, you can group **template libraries** into one group, **JavaScript language strategies** into another group, and **test strategies** into another group.

- Strategy Grouping
  ![Strategy Grouping](https://www.fmz.com/upload/asset/2e482ba9b9aa272085d00.png)

- Live Trading Grouping
  ![Live Trading Grouping](https://www.fmz.com/upload/asset/2e577d050e817837bbfdf.png)

## Live Trading Display

FMZ Quant Trading Platform provides multiple ways to display the live trading status of strategies.

### Sub-accounts

After logging into the platform, click "Control Center" and "Account Settings" to navigate to the FMZ account [management page](https://www.fmz.com/m/account). Click "Sub-account Group" to see the sub-account creation page. In the **Operation Permissions** control, select the live trading accounts that the created sub-account can access. In the **User Information** control, set the sub-account's **username** and **sub-account login password**. Click the "Create Sub-account" button to create a sub-account. Created sub-accounts will be displayed on the current page, where you can perform "Modify", "Lock/Unlock", and "Delete" operations.

  Sub-accounts have limited permissions and can only view live trading accounts authorized in the **Operation Permissions** settings. For authorized live trading accounts, sub-accounts have permissions to modify parameters, stop live trading, and restart live trading, but cannot modify the exchange objects configured for live trading.

  ![Sub-account Settings](https://www.fmz.com/upload/asset/2e46d725dbe6b471f1b33.png)

  Common use cases for sub-accounts include:
  - 1. When quantitative trading teams manage multiple live trading strategies, facilitating login and management.
  - 2. When renting out strategies, used for users' live trading debugging work.

### Live Trading Observation

Click the "Public" button in the live trading list on the [Live Trading Page](https://www.fmz.com/m/robots) of FMZ Quant Trading Platform to publicly display the current live trading instance.

Live trading observation currently supports two methods:
- 1. Publicly display live trading on the [Live Trading Observation](https://www.fmz.com/live) page of FMZ Quant Trading Platform. Click the "Public" button and select **Public Sharing**.
- 2. Create a private link for live trading observation.
  Click the "Public" button and select **Internal Sharing**, set the validity period to generate a private link for accessing the private observation page of this strategy's live trading.

## Strategy Sharing and Renting

On the [Strategy Library](https://www.fmz.com/m/strategies) page, click the "Actions" button on the right side of a strategy to display a menu containing sharing and renting options.

Important Notice: When creating and distributing strategy **registration codes**, please carefully confirm whether it is a "Registration Code" or "Copy Code" to avoid accidentally leaking your strategy.

### Strategy Sharing

![Strategy Sharing](https://www.fmz.com/upload/asset/2e593d57dc36afc004ef6.png)

- Public Sharing
  After clicking the "Share" button, a dialog box will pop up where you can select "Public Sharing". The strategy will be fully shared to the platform's Strategy Square, where any user can copy the strategy.

- Private Sharing
  After clicking the "Share" button, a dialog box will pop up where you can select "Private Sharing". After selecting the sharing validity period and sharing limit, a **copy page URL** and **copy code** for the strategy will be generated. These can be distributed to designated FMZ platform users. Users who need the strategy can simply use the **copy page URL** link, log in to the **copy page** and enter the copy code to obtain the strategy. Once obtained, the strategy will automatically appear in their strategy library.

### Strategy Rental

![Strategy Rental](https://www.fmz.com/upload/asset/2e4e78f6c46c9dde1ce90.png)

- Public Sale
  After clicking the "Rent" button, a dialog box will pop up where you can select "Public Sale". The strategy can then be submitted for listing (requires approval).

- Internal Sale
  After clicking the "Rent" button, a dialog box will pop up where you can select "Internal Sale". After selecting the number of days, maximum concurrent instances, and number of registration codes, the system will generate a **registration page URL** and **registration codes** for this strategy. You can distribute these to designated FMZ platform users. Users who need this strategy only need to visit the **registration page URL** link, log in to the **registration page**, and enter the registration code to obtain access to the strategy. The strategy will also appear in the strategy library, but users will only have backtesting and live trading permissions, and cannot view the strategy source code or other information. When the number of concurrent live trading instances is set to 0, it means there is no limit on concurrent instances, allowing unlimited creation of live trading bots.

## Live Trading Message Push

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
- JavaScript/TypeScript/Python/Rust/C++ Languages
  In the strategy code, you can use the ```Log()``` function as well as other functions that output log information in the log area, such as ```exchange.CreateOrder()```, ```exchange.CancelOrder()```, etc.
  By passing an additional parameter ```"@"``` to these functions (i.e., adding an extra parameter beyond the required ones), for example ```Log("This is a push message", "@")```, the output log information will be pushed, and the platform will push the message according to the "Push Settings". In the Rust language, the corresponding ```Log!``` macro is used the same way: ```Log!("This is a push message", "@");```.
- PINE Language/My Language
  In the "Trading Library" parameters integrated into PINE Language/My Language strategies, you can enable trading log push, which will automatically push messages after a trading action is triggered.
- Blockly Visual
  In the "Tools" section, select the **Message Push** module to push specified information.

Message push is subject to a frequency limit, with the following rule: within each 20-second cycle of live trading, only the last message is retained and pushed, while all other messages are filtered out and not pushed.

## Common Causes of Live Trading Errors and Abnormal Exits

- Strategy static syntax errors

  ![Syntax error in editor](https://www.fmz.com/upload/asset/2e4daebbb80548adf3927.png)

  Such errors are relatively obvious and can usually be seen as error markers in the strategy editing page, which can be discovered and corrected during backtesting.
- Strategy runtime errors
  The most common situation is using function return values directly without validity checking.
- Excessive memory usage
  Storing too much content in global variables that cannot be garbage collected, resulting in excessive memory usage.
- Improper use of ```exchange.Go``` function for concurrent requests
  When using the asynchronous ```exchange.Go``` function, not properly using ```wait``` to wait for coroutines to finish, resulting in too many coroutines.
- Function recursive calls
  Function recursive calls with too deep nesting levels, exceeding the coroutine stack size limit.
- API business errors, network request errors, etc.
  Such errors will display relevant exchange object names, function names, error-related messages and reasons. These errors will not cause live trading to stop abnormally (such errors are usually the cause, but not the direct reason; the direct reason is usually **program exceptions caused by using API return values directly without validity checking**).
- Platform underlying errors
  Common ones include ```Decrypt: Secret key decrypt failed``` error, which will prevent live trading from starting. The error is caused by changing the FMZ Quant Trading Platform account password, causing all configured ```API KEYs``` to become invalid. You need to reconfigure the ```API KEY``` and restart the docker to resolve it.
- Python strategy encryption issues
  When renting out Python strategies, errors caused by incompatibility between the Python version used for platform strategy encryption and the Python version at runtime: ```ValueError: bad marshal data (unknown type code)```. This can be resolved by upgrading or installing the Python environment to any of the supported versions: ```Python 2.7```, ```Python 3.5```, or ```Python 3.6```.
- ```interrupt``` error
  This error occurs when the program is performing an operation (such as accessing exchange APIs) and the user clicks the **Stop Live Trading button** on the live trading page, interrupting the current operation. This error has no substantial impact and is merely a log record.

[FAQ Summary](https://www.fmz.com/bbs-topic/1427).

## Exchange-Specific Notes

- Futu Securities
  Supports Futu Niuniu live trading and simulated (paper) trading. You need to download the [```FutuOpenD```](https://www.futunn.com/download/OpenAPI?lang=zh-CN) software.
  When using ```FutuOpenD``` to access simulated trading, some stock codes are not supported and therefore cannot be traded; however, the Futu Niuniu mobile APP supports simulated trading.
  For operations such as configuring the exchange object on the FMZ Quant platform and running the ```FutuOpenD``` software, please refer to the [Futu Securities Configuration Documentation](https://www.fmz.com/bbs-topic/10185).

  - Interface Call Frequency
    The ```GetOrder```, ```GetOrders```, ```GetPositions```, and ```GetAccount``` functions use **cached data** by default, so there is no call frequency limit.
    When new data is available, ```FutuOpenD``` will automatically update the data, and the **cached data** will be synchronized accordingly.

    Calling the ```exchange.IO("refresh", true)``` function can disable the cache; after **disabling the cache**, the call frequency is limited to **a maximum of 10 queries within every 30 seconds**, and exceeding this frequency limit will report an error.

  - Stock Codes
    For example: ```600519.SH```
    - HK Hong Kong stocks
    - US US stocks
    - SH Shanghai stocks
    - SZ Shenzhen stocks

    Use the ```exchange.SetContractType()``` function in the strategy code to set the stock code, for example:

    ```js
    function main() {
        var info = exchange.SetContractType("600519.SH")    // Set to stock 600519.SH (Moutai), account switches to mainland market
        Log(info)
        Log(exchange.GetAccount())                          // Current stock is Moutai, calling GetAccount function gets account assets for mainland market
        Log(exchange.GetTicker())                           // Get current price information for Moutai stock
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
        let info = exchange.SetContractType("600519.SH");    // Set to stock 600519.SH (Moutai), account switches to mainland market
        Log!(info);
        Log!(exchange.GetAccount());                          // Current stock is Moutai, calling GetAccount function gets account assets for mainland market
        Log!(exchange.GetTicker(None));                       // Get current price information for Moutai stock
    }
    ```

    ```cpp
    void main() {
        auto info = exchange.SetContractType("600519.SH");
        Log(info);
        Log(exchange.GetAccount());
        Log(exchange.GetTicker());
    }
    ```

    The function for setting the trading direction ```exchange.SetDirection```, the order placement functions ```exchange.Buy```/```exchange.Sell```,
    the order cancellation function ```exchange.CancelOrder```, the order query function ```exchange.GetOrder```, etc., are all used in the same way as in the futures market.

  - Account Information Data Format:
    Use ```TrdMarket``` to define the market, in order to distinguish between the ```Hong Kong market```, ```US market```, and ```Mainland market```.

    Excerpted from the [```Futu API``` documentation](https://openapi.futunn.com/futu-api-doc/):
    ```
    const (
        TrdMarket_TrdMarket_Unknown TrdMarket = 0 //Unknown market
        TrdMarket_TrdMarket_HK      TrdMarket = 1 //Hong Kong market
        TrdMarket_TrdMarket_US      TrdMarket = 2 //US market
        TrdMarket_TrdMarket_CN      TrdMarket = 3 //Mainland market
        TrdMarket_TrdMarket_HKCC    TrdMarket = 4 //Hong Kong Stock Connect market
        TrdMarket_TrdMarket_Futures TrdMarket = 5 //Futures market
    )
    ```

    To obtain account information data, the ```exchange.GetAccount()``` function returns:
    ```json
    {
        "Info": [{
            "Header": {
                ...                 // Omitted
                "TrdMarket": 1      // Market ID in Info raw data, indicates account assets for Hong Kong market trading
            },
            "Funds": {              // Account asset information in this market
                ...
            }
        }, ...],
        "Stocks": 0,
        "FrozenStocks": 0,
        "Balance": 1000000,         // Asset value in current market
        "FrozenBalance": 0
    }
    ```

  - ```FutuOpenD``` distinguishes regions based on the logged-in **IP** address
    Accounts logged in with a non-Mainland IP address will be restricted when obtaining market data. For details, please refer to the official ```FutuOpenD``` (Futu) documentation.
- Interactive Brokers
  Configure the exchange:
  To use Interactive Brokers, you need to run the "IB Gateway" or "TWS (Trader Workstation)" software in the system environment where the docker (hosting node) is located. Here we take the "TWS" software as an example. After running "TWS" and logging in, click the configuration button in the upper right corner of the software to open the software configuration interface.
  - Select: "Configuration" -> "API" -> "Settings", do not check the "Read-Only API" option, and you need to check the "Enable ActiveX and Socket Clients" option; note the "Socket port" in the configuration (the default TWS port is 7496 for live / 7497 for simulation).
  - On the platform's add exchange page "https://www.fmz.com/m/platforms/add", select **Interactive Brokers**, and configure the parameters. In the "Server Address" configuration item, fill in the address corresponding to the "TWS" software (such as 127.0.0.1 or localhost) and the port, for example: ```localhost:7496```.

  Supported markets:
  - Currently only the US stock market is supported; other markets such as futures and forex are not yet supported.
  - Example of US stock market stock code format:
    The stock code of Apple Inc. on the NASDAQ exchange: ```AAPL.US```.
    The stock code of Tesla, Inc. on the NASDAQ exchange: ```TSLA.US```.
- Futures_Binance
  Supports Binance's Chinese trading pairs:

  ```js
  function main() {
      let ticker = exchange.GetTicker("币安人生_USDT.swap")
      Log("ticker:", ticker)   // {"Info":{...},"Symbol":"币安人生_USDT.swap","Open":0.29622,"High":0.31661, ...}
  }
  ```

  For the ```exchange.IO()``` switching functions of Binance Futures (dual-side position mode, isolated/cross margin, unified account, STP mode, etc.), please refer to the `exchange.IO` function documentation.
- Futures_HuobiDM
  - Switch address:
    Use ```exchange.IO("base", "https://xxx.xxx.xxx")``` or ```exchange.SetBase("https://xxx.xxx.xxx")``` to switch the base address of the exchange interface.

  Supports Huobi's Chinese trading pairs:

  ```js
  function main() {
      let ticker = exchange.GetTicker("币安人生_USDT.swap")
      Log("ticker:", ticker)   // {"Info":{...},"Symbol":"币安人生_USDT.swap","Open":0.29622,"High":0.31661, ...}
  }
  ```

  For the ```exchange.IO()``` switching functions of Huobi Futures (signHost, isolated/cross margin, one-way/two-way position mode, unified account, etc.), please refer to the `exchange.IO` function documentation.
- Huobi
  - Switch special trading pairs:
    Supports Huobi spot leveraged tokens, for example ```LINK*(-3)```; the code defined by the exchange is ```link3susdt```, and when setting this trading pair on the FMZ Quant trading platform it is written as ```LINK3S_USDT```.
    You can also switch the trading pair within the strategy:

    ```js
    function main() {
        exchange.SetCurrency("LINK3S_USDT")
        Log(exchange.GetTicker())
    }
    ```

    ```python
    def main():
        exchange.SetCurrency("LINK3S_USDT")
        Log(exchange.GetTicker())
    ```

    ```rust
    fn main() {
        exchange.SetCurrency("LINK3S_USDT");
        Log!(exchange.GetTicker(None));
    }
    ```

    ```cpp
    void main() {
        exchange.SetCurrency("LINK3S_USDT");
        Log(exchange.GetTicker());
    }
    ```

  Supports Huobi's Chinese trading pairs:

  ```js
  function main() {
      let ticker = exchange.GetTicker("币安人生_USDT")
      Log("ticker:", ticker)   // {"Info":{...},"Symbol":"币安人生_USDT","Open":0.29622,"High":0.31661, ...}
  }
  ```

- Futures_Bibox
  - Unsupported interfaces:
    This exchange does not provide interfaces for querying current pending orders or querying market historical trade records, so the ```GetOrders``` and ```GetTrades``` functions are not supported.
- BitMEX
  - Market order buy
    In the BitMEX spot trading order placement interface, the order quantity for a market buy order is not the amount, but the number of coins to trade.
- Bitfinex
  - Market order buy
    In the Bitfinex spot trading order placement interface, the order quantity for a market buy order is not the amount, but the number of coins to trade.
- AscendEx
  - Market order buy
    In the AscendEx spot trading order placement interface, the order quantity for a market buy order is not the amount, but the number of coins to trade.
- Futures_Phemex
  - K-line interface
    The data returned by this exchange's K-line interface does not include the current Bar data.
  - Switch isolated/cross margin:
    This exchange does not provide an interface for switching cross/isolated margin; it needs to be set on the exchange side.
- Futures_Aevo
  - Order ```Id``` description:
    This exchange's order ```Id``` consists of the actual ```Id``` and the order timestamp, separated by an English comma, in order to support the ```exchange.GetOrder(Id)``` function for querying orders. Since the order timestamp in the data returned by the exchange changes with the order status, if you need to record information such as the order ```Id``` locally, please separate out the actual order ```Id``` before recording it.
- Futures_dYdX
  Currently supports the dYdX v4 version. Please refer to the [dYdX v4 User Guide](https://www.fmz.com/digest-topic/10564).
- Futures_Hyperliquid
  Please refer to the [Hyperliquid User Guide](https://www.fmz.com/digest-topic/10574).

  For the ```exchange.IO()``` switching functions of Hyperliquid Futures (isolated/cross margin, mainnet/testnet, vaultAddress, walletAddress, expiresAfter, etc.), please refer to the `exchange.IO` function documentation.
- Futures_Lighter
  - Switch test environment:
    The test environment can be selected and set when configuring the exchange object, or you can use the ```exchange.SetBase()``` function to modify the REST API endpoint to switch to the test environment.

  For the ```exchange.IO()``` switching functions of Futures_Lighter (isolated/cross margin, order expiration time, etc.), please refer to the `exchange.IO` function documentation.
