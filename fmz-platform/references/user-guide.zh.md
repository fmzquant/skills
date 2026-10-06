# FMZ 平台使用指南

由 https://www.fmz.com/user-guide 生成：平台如何运作（托管者、实盘、策略、模板、回测、扩展 API、MCP），面向人写的说明；agent 用它理解概念与限制。

## 欢迎使用发明者量化交易平台

发明者量化交易平台是量化交易领域最专业的量化社区。在这里，您可以学习、编写、分享、出售量化交易和程序化交易策略；进行在线回测和模拟盘交易；运行、公开、围观策略实盘。发明者量化交易平台（FMZ量化）支持几乎所有主流加密货币交易所。
在发明者量化交易平台学习和使用过程中遇到问题，可以随时到论坛发帖提问、讨论，在平台提交工单，或在[Telegram](https://t.me/fmzquant_cn)社群@管理员，问题通常会得到快速解答。平台支持ChatGPT辅助开发，发明者量化交易平台已接入**ChatGPT**作为辅助开发工具，您可以在「控制中心」的快捷方式栏内点击「ChatGPT」跳转至[ChatGPT辅助工具页面](https://www.fmz.com/m/chat)。

在发明者量化交易平台，您可以通过注册和登录开始您的量化交易之旅。登录后，访问[主页面](https://www.fmz.com/m)，您将看到以下内容：
![控制中心概览](https://www.fmz.com/upload/asset/2e4e636a6fe51c8f620e8.png)

- 左侧导航栏：包含用户控制台的主要功能跳转选项。
- 顶端导航栏：提供平台公共资源的跳转选项。
- 页面中部：展示账户设置、调试工具、分析工具、开发文档、平台功能快捷跳转等内容。

用户控制台主要功能：
- [控制中心](https://www.fmz.com/m/dashboard)
  跳转至『控制中心』页面。在发明者量化交易平台运行量化交易程序（即实盘）需要满足三个条件：1、部署一个可用的托管者。2、拥有一个可用的策略。3、配置交易所账户供策略程序操作。
- [实盘](https://www.fmz.com/m/robots)
  跳转至『实盘』页面。实盘即量化交易策略程序实例。实盘页面主要用于管理、创建和控制策略实盘。
- [策略库](https://www.fmz.com/m/strategies)
  跳转至『策略库』页面。策略库可以分类保存、管理和编写各种编程语言的策略。
- [托管者](https://www.fmz.com/m/nodes)
  跳转至『托管者』页面。托管者页面可以管理和部署当前账户关联的托管者程序。
- [交易所](https://www.fmz.com/m/platforms)
  跳转至『交易所』页面。交易所页面可以管理和配置需要进行量化交易的交易所账户。

平台公共资源：
- [策略](https://www.fmz.com/square)
  在策略广场，您可以找到各种编程语言编写的公开或出租策略，适合学习和参考。
- [围观](https://www.fmz.com/live)
  实盘围观页面展示用户公开的策略实盘。
- [文库](https://www.fmz.com/digest)
  平台文库保存了平台原创文章等资料，方便您入门学习。
- [社区](https://www.fmz.com/bbs)
  社区论坛为您提供交流和讨论量化交易领域的平台。
- [众包](https://www.fmz.com/markets)
  众包版块为策略设计者和需求者搭建高效的沟通渠道。
- [公开课](https://www.fmz.com/class)
  公开课页面提供平台的视频教程。
- [API文档](https://www.fmz.com/api)
  API文档页面为您编写和设计策略提供技术资料支持。

## 编程语言

**在发明者量化交易平台上，可以使用哪些编程语言来编写我的策略呢？**

![支持的编程语言](https://www.fmz.com/upload/asset/2e52c7501f57044f7f0ef.png)

发明者量化交易平台支持使用```JavaScript```、```TypeScript```、```Python```、```Rust```、```C++```、[```PINE```](https://www.fmz.com/bbs-topic/9315)、[```My语言```](https://www.fmz.com/bbs-topic/2569)、```Blockly```可视化以及```Workflow```工作流来编写和设计交易策略。

### JavaScript

支持JavaScript语言，集成了以下JavaScript库：
- http://mathjs.org/
- http://mikemcl.github.io/decimal.js/
- http://underscorejs.org/
- http://ta-lib.org/

程序异常报错、接口业务报错
在```JavaScript```语言策略中，发生程序异常报错或接口业务报错时，错误日志将显示策略代码中发生错误的具体行号，便于策略调试与BUG排查。

支持```JavaScript```异步编程特性：
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
  ```fetch```函数是```HttpQuery```函数的异步版本重载。

  使用```await```关键字以同步语法处理异步操作：
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
              return reject(new Error("data 无效"))
          }
      })

      promiseBooks.then(function(ret) {
          Log("ret:", ret)
      }).catch(function(err) {
          Log("err.name:", err.name, "err.stack:", err.stack, "err.message:", err.message)
      })
  }
  ```
- 使用```Promise.all```并发执行多个异步网络请求：
  ```js
  async function main() {
      // let symbols = ["BTC-USDT", "ETH-USDT", "LTC-USDT"]                                   // 等待请求耗时：99毫秒
      let symbols = ["BTC-USDT", "ETH-USDT", "LTC-USDT", "SOL-USDT", "BNB-USDT", "ADA-USDT"]  // 等待请求耗时：99毫秒
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
- 使用```Promise.race```获取多个异步请求中最先```resolved```或```rejected```的结果：
  ```js
  async function getTicker(e) {
      return Promise.resolve().then(function() {
          /* 测试
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
- 在```threading.Thread```中使用```setTimeout()```函数：
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
- 多线程并发获取```ticker```数据的异步处理示例：
  由于```exchange.GetTicker()```是同步阻塞操作，即使包装在Promise中，内部执行仍是同步的；JavaScript是单线程的，同步操作会阻塞事件循环；微任务队列中的回调函数仍然是串行执行的。
  ```js
  async function getTicker(symbol) {
      Log("getTicker symbol:", symbol)
      return Promise.resolve().then(function() {
          // 注意与fetch请求数据时的区别
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

支持TypeScript语言，在策略创建时仍设置为JavaScript策略，然后在策略代码开头写入```// @ts-check```或点击策略编辑区域右上角的「TypeScript」按钮，即可切换到TypeScript。平台将自动识别代码为TypeScript，并提供相应的编译和类型检查支持：

- 类型安全：TypeScript的静态类型检查功能可帮助您在编写代码时发现潜在错误，提高代码质量。

- 代码自动补全：TypeScript的类型系统使您在编写代码时能够更快地找到所需的属性和方法，提高开发效率。

- 更清晰的代码结构：使用TypeScript，您可以更好地组织和维护代码，使其易于阅读和理解。

- 强大的面向对象编程特性：TypeScript提供了接口、类、泛型等强大的面向对象编程特性，帮助您编写更加健壮、可重用的策略代码。

### Python

- 设置Python策略程序使用的Python解释器
  使用Python编写的策略，在回测或实盘时，如果托管者所在系统环境同时安装了Python2和Python3，可以在策略开始的第一行设置策略运行时启动的Python版本。例如：```#!python3```、```#!python2```，系统将自动查找对应的解释器。也可以指定绝对路径，例如：```#!/usr/bin/python3```。
- 基于Python的策略安全性
  在发明者量化交易平台上开发的策略，仅对发明者量化交易平台账户的持有者可见。此外，在发明者量化交易平台上可以实现策略代码的完全本地化，例如将策略封装成一个**Python库**，在策略代码中加载，从而实现策略代码本地化。
  Python代码的安全性：
  由于Python是开源且易于反编译的语言，如果策略非自用而是出租，担心策略泄露可以让策略运行在自己部署的托管者上，并以子账号或全托管管理的形式出租。

  Python策略代码加密：
  默认情况下，Python策略代码作者自用时不加密，租给他人使用时加密。在Python策略开头编写如下代码，可以指定自用或租出Python策略运行时是否加密策略代码。支持策略代码加密的Python版本为：Python 2.7版本、Python 3.5版本、Python 3.6版本。

  - 策略作者自己运行、通过注册码给他人使用时，均加密策略代码：
    使用代码```#!python```指定Python解释器版本，之后使用逗号```,```间隔，输入加密指令```encrypt```。如果不指定Python版本，可以直接添加```#!encrypt```。
    ```python
    #!python,encrypt
    ```
    或
    ```python
    #!encrypt
    ```
  - 策略作者自己运行、通过注册码给他人使用时均不加密策略代码：
    ```python
    #!python,not encrypted
    ```
    或者
    ```python
    #!not encrypted
    ```

  判断Python策略代码加密是否生效，使用代码```os.getenv('__FMZ_ENV__')```，返回字符串```"encrypt"```表示已经生效。仅在实盘有效，回测不会加密Python策略代码。
  ```python
  #!encrypt
  def main():
      ret = os.getenv('__FMZ_ENV__')
      # 打印变量ret为字符串encrypt或者ret == "encrypt"为真，即代表加密生效
      Log(ret, ret == "encrypt")
  ```
- Python自定义模块导入功能
  FMZ平台支持在Python策略中导入自定义模块，实现代码的模块化开发和复用。

  例如，我们需要设计一个模块：```mymath```，将```mymath.py```保存为一个单独的文件。

  ```python
  # mymath.py - 保存为一个单独的文件
  """
  简单的数学工具模块
  """

  def add(a, b):
      """加法"""
      return a + b
  ```

  部署模块文件，将```mymath.py```文件放置到托管者程序目录下的指定位置（storage目录中的文件夹名称是实盘Id，以实盘Id为```123456```为例）：

  > 托管者程序目录/logs/storage/123456/mymath.py

  最后在FMZ平台上的Python策略中直接导入```mymath```模块。

  ```python
  import mymath

  def main():
      Log("mymath.add(1, 2):", mymath.add(1, 2))
  ```

  Id为```123456```的实盘（策略实例）所绑定的策略中即可调用```mymath```模块中的方法。

### Rust

平台支持使用```Rust```编程语言编写策略。Rust语言的策略采用预先编译、再执行的方式运行：回测时，策略代码由平台服务器编译，并在浏览器端的回测系统中运行；实盘环境中，Rust语言的策略在编译通过后基于托管者运行。

借助Rust的所有权模型与静态类型系统，您可以在FMZ量化交易平台上编写兼具内存安全与高性能的交易策略。

- 平台API自动注入
  策略代码只需一个```fn main()```入口函数。所有平台API（```exchange```、```exchanges```、```TA```、```Log!```/```LogStatus!```、```_G!```/```_C!```等）均通过prelude自动注入，无需任何```use```/```mod```声明即可直接调用。可能失败的API调用会返回```Result<T>```类型，可配合```_C!```宏实现自动重试。
  ```rust
  fn main() {
      // GetTicker返回Result<Ticker>，用_C!宏重试直到调用成功
      let ticker = _C!(exchange.GetTicker(None));
      Log!("Last:", ticker.Last);
  }
  ```
- 策略参数注入为全局常量
  界面上配置的策略参数会以全局常量的形式注入策略，其Rust类型由参数的实际值决定（数字对应```f64```、布尔对应```bool```、字符串/密码对应```&str```等），可直接通过参数名引用；您也可以通过```params()```函数获取参数集的JSON文本并自行解析。
- 支持第三方crate
  策略源码是唯一的代码文件（不含单独的Cargo.toml），可在源码顶部使用cargo-script风格的frontmatter声明依赖，构建时会自动合并至Cargo.toml：
  ```rust
  ---
  [dependencies]
  serde_json = "1"
  ---
  fn main() {
      let v: serde_json::Value = serde_json::from_str(params()).unwrap();
      Log!("参数:", v.to_string());
  }
  ```
  注意：编译沙盒中未提供系统OpenSSL，因此需要TLS的crate（如HTTP/WebSocket客户端等）请选择基于纯Rust实现的```rustls```（例如为```tokio-tungstenite```开启```rustls-tls-webpki-roots```特性），避免依赖```native-tls```/```openssl-sys```；WebSocket连接建议优先使用内置的```Dial()```函数，无需引入第三方crate。
- 编辑器支持
  策略编辑器为Rust策略集成了```rust-analyzer```，可提供代码补全与实时诊断功能。

### C++

平台支持C++编程语言，兼容```C++ 11```标准。C++策略需要预先编译后执行，在回测系统中，C++策略运行于专用的C++回测服务器；在实盘环境中，C++策略编译通过后基于托管者运行。

借助C++编程语言和```C++ 11```标准，您可以在FMZ量化交易平台上开发高性能的交易策略。利用C++的现代特性，您能够构建灵活、可扩展的交易算法，实现自动化交易。

集成了以下C++库：

- https://nlohmann.github.io/json/

### My语言（麦语言）

平台支持My语言（麦语言）编写和设计策略，兼容文华麦语言的大部分语法、指令和函数。My语言鼓励积木式编程，将复杂算法拆解为函数模块。通过简洁的语法、专用数据结构和强大的金融函数库，支持复杂金融逻辑的实现。以模块化方式构建应用，提升开发效率和代码可维护性。

My语言策略范例：基于平移布林通道的系统

```My
M := 12;          // 参数范围 1, 20
N := 3;           // 参数范围 1, 10
SDEV := 2;        // 参数范围 1, 10
P := 16;          // 参数范围 1, 20

// 该策略为趋势跟踪交易策略，适用较大周期，如日线。
// 该模型仅用作模型开发案例，依此入市，风险自负。

////////////////////////////////////////////////////////

// 平移BOLL通道计算
MID:=MA(C,N);                 // 计算中轨
TMP:=STD(C,M)*SDEV;           // 计算标准差
DISPTOP:=REF(MID,P)+TMP;      // 平移BOLL通道上轨
DISPBOTTOM:=REF(MID,P)-TMP;   // 平移BOLL通道下轨

// 系统入场
H>=DISPTOP,BPK;
L<=DISPBOTTOM,SPK;
AUTOFILTER;
```

- [FMZ量化My语言文档](https://www.fmz.com/bbs-topic/2569)
- [FMZ量化My语言--My语言交易类库参数](https://www.fmz.com/bbs-topic/5768)

### PINE语言

平台支持并兼容```Trading View```的PINE语言脚本。PINE语言是一种轻量级但功能强大的策略编程语言，用于创建可进行回测和实盘交易的技术指标与策略。活跃的社区已创作了超过10万个PINE脚本。
用户可以轻松获取并应用各种技术分析工具和交易策略；能够借助社区脚本快速实现交易想法，无需从零开始编写代码，从而大幅缩短开发周期；帮助新手和资深交易员学习并理解不同的技术指标、策略及编程概念。

PINE语言策略示例：超级趋势策略
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

- [PINE Script 文档](https://www.fmz.com/bbs-topic/9315)

### Blockly可视化

平台支持Blockly可视化编程方式。借助Blockly编辑器，用户可以通过拼接图形块（类似积木）来表达代码概念，如变量、逻辑表达式、循环等。这种方式使编程过程无需过多关注繁琐的语法细节，而是可以直接按照编程原则进行操作。通过图形块的排列组合，用户能够轻松理解编程逻辑，实现创意想法，非常适合培养策略设计兴趣，快速入门程序化和量化交易。

  - [可视化模块搭建交易策略--初识](https://www.fmz.com/digest-topic/4016)

  - [可视化模块搭建交易策略--进阶](https://www.fmz.com/digest-topic/4046)

  - [可视化模块搭建交易策略--深入](https://www.fmz.com/digest-topic/4086)

  - [可视化模块搭建交易策略--浅出](https://www.fmz.com/digest-topic/4107)

### Workflow工作流

平台支持 Workflow 工作流方式编写策略。工作流是一种可视化的策略设计方式，通过节点连接和配置来构建交易逻辑，无需编写代码即可实现策略。

**工作流特点**：
- 可视化拖拽设计，所见即所得
- 预置丰富的功能节点（数据获取、指标计算、条件判断、交易执行等）
- 降低编程门槛，适合快速搭建和验证策略
- 支持回测功能，可视化查看节点执行状态

**学习资源**：
- [工作流系列视频教程](https://www.fmz.com/class/workflow)

## 密钥安全性

在发明者量化交易平台上配置的账户信息、策略参数中的加密字符串等敏感数据均在浏览器端进行加密。这些存储在发明者量化交易平台上的信息均为加密信息（非明文数据）。只有用户的私有设备可以解密使用，从而极大地提高了敏感数据的安全性。如果在策略代码、参数设置、策略描述等信息中包含了其他敏感信息，请勿公开或出售该策略。

- 平台支持将交易所账户相关信息、密钥等敏感信息本地化配置
  在平台配置交易所信息的页面，所有带掩码的加密文本框控件都支持以配置文件路径的方式载入托管者本地文件。下面以交易所的```RSA KEY```验证方式为例，详细说明如何将敏感信息配置在托管者程序所在设备的本地。
  1、创建RSA公钥、私钥。例如创建格式为PKCS#8的公钥、私钥，有很多工具可以创建，例如：openssl。
  2、在交易所创建```RSA KEY```，创建时上传第一步中创建的公钥。
  3、将第一步中创建的私钥以txt文件格式保存在托管者目录```../logs/storage/xxx```路径下，xxx为实盘Id；也可以保存在托管者程序所在目录中的其他路径。
  4、在FMZ量化平台上配置交易所时，在```Access Key```的编辑框中填写在交易所创建的```RSA KEY```。
  5、在FMZ量化平台上配置交易所时，在```Secret Key```的编辑框中填写第三步中在托管者目录放置的txt文件的路径，例如放置的文件名为：```rsaKey.txt```，则填写：```file:///rsaKey.txt```。在运行实盘并引用该交易所（对象）时，托管者会自动载入目录```../logs/storage/xxx/rsaKey.txt```的文件内容作为交易所对象的配置信息，例如本例中的```RSA```私钥。

  这样私钥本地化保存更加安全，详细过程可以参考[视频讲解](https://www.bilibili.com/video/BV1UM41147Jj/)
- 修改发明者量化交易平台的账号密码会导致交易所配置失效
  如果修改了发明者量化交易平台的账号密码，会导致所有交易所配置失效，需要按照以下步骤处理：
  1、重新在[「交易所」管理页面](https://www.fmz.com/m/platforms)配置交易所账户相关密钥、密码等信息。
  2、停止所有托管者，使用修改后的发明者量化交易平台账户密码重新部署、运行托管者。

## 实盘

在发明者量化交易平台上，「实盘」的概念区别于「回测」，指的是创建一个真正与交易所交互（获取行情、查询持仓、下单撤单等）的策略程序实例。与交易所生产环境交互的策略程序实例称为实盘，与交易所模拟环境（许多交易所提供测试环境）交互的策略程序实例也称为实盘。
在发明者量化交易平台上[创建一个实盘](https://www.fmz.com/m/add-robot)需要满足三个条件：

**创建实盘的条件**
- 一个可用的策略
  可以在平台[策略库页面](https://www.fmz.com/m/strategies)点击「新建策略」按钮创建策略。编写并设计策略后保存，策略将保存在策略库中。创建实盘时，在[实盘创建页面](https://www.fmz.com/m/add-robot)的「实盘配置」栏目下「运行策略」下拉框中即可选择策略库中的策略。
- 至少部署一个可用的托管者
  可以在平台[托管者页面](https://www.fmz.com/m/nodes)点击「部署托管者」按钮进行托管者部署。托管者部署成功后，创建实盘时在[实盘创建页面](https://www.fmz.com/m/add-robot)的「实盘配置」栏目下「托管主机」下拉框中即可选择已部署的托管者。
- 至少配置一个可用的交易所
  可以在平台[交易所页面](https://www.fmz.com/m/platforms)点击「添加交易所」按钮添加交易所，配置交易所账号信息。交易所配置完成后，创建实盘时在[实盘创建页面](https://www.fmz.com/m/add-robot)的「交易配置」栏目下「交易平台」下拉框中即可选择已配置的交易所。

最后在实盘创建页面点击「创建实盘」按钮即可创建并运行一个量化交易策略程序实例（即发明者量化交易平台的实盘）。

**实盘分组**
可以对已创建的实盘进行分组管理，支持自定义分组名称。

**实盘围观**
实盘可以公开展示，也可以创建私有围观链接发送给特定群体展示。

**实盘计费**
实盘按小时计费，每个实盘每小时 0.05 USD，不足一小时按一小时计费。创建新实盘将立即开始计费，实盘「停止」/「重启」不会重复计费。

可以在[充值页面](https://www.fmz.com/m/billing)查询所有计费的「账单明细」。

重要提示：使用```USDT```充值时务必注意：
- 1、转账网络是否正确（例如目前支持：TRC20、ERC20、BSC）。
- 2、充值资产选择是否正确（例如：USDT）。
- 3、充值地址是否一致。

**实盘监控**
在[实盘管理页面](https://www.fmz.com/m/robots)的实盘列表中，处于运行中的实盘右侧**操作栏**中可以点击「监控」按钮开启实盘监控。开启监控后，如果实盘非手动操作退出，当前发明者量化交易平台绑定的邮箱将收到通知消息。

**实盘数据库**
以实盘Id```123456```为例，其对应的数据库文件位于该实盘所属托管者目录下的路径：```/logs/storage/123456/123456.db3```，其中数据库文件名为```123456.db3```。
数据库中包含以下表：
- chart：记录图表数据。
- kvdb：记录```_G()```函数持久化保存的数据。
- log：记录实盘日志数据。
- profit：记录实盘收益数据。

## 策略库

[策略库](https://www.fmz.com/m/strategies)页面保存当前账号下的所有策略，策略可以使用多种编程语言和方式进行设计。

**策略分组**
策略支持分组管理功能，可以自定义分组名称。

**策略公开、出租**
可以生成策略的「复制码」用于公开策略。
可以生成策略的「注册码」用于出租策略。

**策略导出、导入**
在策略库页面中，点击策略名称即可跳转至该策略的编辑页面，编辑页面提供「导入」、「导出」功能。

一个完整的策略包含：
- 策略源码
- 策略描述
- 策略笔记
- 策略说明书
- 策略参数配置
- 策略交互配置

因此在导出策略时，导出的文件为XML格式，包含上述所有信息。新建空白策略后，导入该XML文件即可完整还原策略。策略迁移不能仅复制源码，必须导入完整的策略文件（或手动添加策略参数设计、交互设计等配置）。

## 托管者

发明者量化交易平台的托管者软件是整个量化交易系统的核心组件。[托管者](https://www.fmz.com/m/add-node)可以理解为您交易策略的执行者，负责复杂的数据请求、数据接收、网络连接、日志回传等工作。实盘策略程序运行在托管者软件上，而非运行在发明者量化交易平台网站上。托管者运行在您的服务器上，即使**发明者量化交易平台**网站出现网络故障，也不会影响您的托管者运行。托管者可运行在```Linux```、```Windows```、```Mac OS```、```Android```、```树莓派 ARM Linux```等系统上。

托管者管理的实盘日志均保存在托管者程序所在目录```./logs/storage```内，文件为扩展名```db3```的```Sqlite```数据库文件。可以使用```Sqlite```管理软件直接编辑。对于这些扩展名为```db3```的实盘数据库文件，文件名即为实盘的```Id```。

托管者程序支持自动识别和使用系统代理设置。当系统中运行了代理软件（例如```Clash X```、```V2Ray```、```Shadowsocks```等）并开启增强模式或系统代理模式时，托管者会自动检测并使用该代理进行网络访问，无需手动配置。这对于需要通过代理访问交易所API的用户来说非常便捷，托管者启动后即可自动适配系统的网络环境。

### 部署托管者

在[托管者管理页面](https://www.fmz.com/m/nodes)可以查看当前发明者量化交易平台账号部署关联的托管者，支持列表视图和详细信息视图切换。该页面显示托管者的IP地址、版本号、编译发布时间等相关信息。点击**部署托管者**按钮可跳转至[托管者部署页面](https://www.fmz.com/m/add-node)。托管者部署提供两种模式：1、一键租用托管者；2、手动部署托管者。

  ![托管者部署页面](https://www.fmz.com/upload/asset/2e527e497b3fa27ba497b.png)

#### 一键租用托管者

在[托管者部署页面](https://www.fmz.com/m/add-node)点击**一键租用托管者**标签，根据配置、服务器机房地区等需求选择需要部署的服务器。

点击「立即购买」并输入当前发明者量化交易平台的账号密码进行验证，验证通过后将自动进行托管者程序部署。整个部署过程需要几分钟时间，系统会自动安装常用的Python库。

点击「立即购买」后租用的服务器由于是通过平台代为租用，仅具有有限的系统权限，不支持远程登录。如果需要使用未预装的第三方Python库，建议使用私有服务器进行手动部署。

通过**一键租用托管者**功能租用的服务器采用独立计费方式，与实盘计费相互独立。

点击「重新部署」按钮不会删除托管者目录下logs目录中的实盘日志和数据文件。

#### 手动部署托管者

您可以将托管者部署到各种设备上，例如：个人电脑、服务器、树莓派等，支持多种主流操作系统。
- Linux 命令行版本：Linux AMD64 / Linux 386 / Linux ARM64 / Linux ARMv7
- Mac 命令行版本：Mac Intel64 / Apple Silicon
- Windows 命令行版本、界面版本：64位 / 32位
- Docker 镜像

登录需要部署托管者程序的设备后，根据设备的操作系统下载对应的托管者程序。下载链接可以在[托管者部署页面](https://www.fmz.com/m/add-node)点击**手动部署托管者**标签后显示的内容中找到。
部署托管者程序需要设置2个参数：
![手动部署托管者页面](https://www.fmz.com/upload/asset/2e460507bc21582ba1448.png)

1、包含发明者量化交易平台UID的通信地址。
2、UID对应的发明者量化交易平台账号的密码。

**部署托管者时配置「通信地址」和「发明者量化交易平台账号密码」：**
- Windows界面版托管者
  Windows界面版托管者可以直接将这两个参数填写到托管者界面上对应的输入框控件中。

- 命令行版托管者
  对于其他命令行版托管者程序，不同的操作系统有不同的指令。以Linux & Mac为例，使用命令：```./robot -s node.fmz.com/123456 -p 654321```，以下说明命令中的各个部分：

  ```./robot```表示运行robot这个可执行程序（即托管者程序），其中```123456```为UID，```654321```为UID对应的发明者量化交易平台账户的密码。
  ```-s```参数表示「发明者量化交易平台UID的通信地址」，参数值可以填写例如：```node.fmz.com/123456```。
  ```-p```参数表示「UID对应的发明者量化交易平台账号的密码」，参数值可以填写例如：```654321```。

  请注意这里的参数仅为示例，实际参数可以登录FMZ.COM后，在[托管者部署页面](https://www.fmz.com/m/add-node)点击**手动部署托管者**标签后查看。```-p```参数并非必须明文写在部署托管者的命令中，可以使用```./robot -s node.fmz.com/123456```命令运行，然后会提示输入密码，再手动输入密码即可。另外请注意执行程序的权限等问题，需要给予托管者程序足够的权限，解除运行限制。

#### 托管者操作注意事项

重要操作提示
- 错误操作：
  请勿直接在服务器等设备上强制终止托管者进程（如直接杀死进程或重启服务器）。此类操作可能导致托管者与FMZ平台断开连接，引发以下问题：
  - 实盘无法正常停止
  - 实盘持续运行并产生费用
  出现此类情况时，需要先删除已离线的托管者，才能停止实盘。

- 正确操作流程：
  - 确认托管者上没有任何运行中的实盘
  - 再执行删除托管者或停止托管者进程的操作
  操作原则：先停止实盘，再停止托管者。

### 全局指定IP地址

- ```Windows```系统的界面版托管者可以直接在托管者软件界面上设置IP地址，托管者软件默认为自动设置IP。
- 命令行环境运行的托管者使用```-I```参数指定IP地址。
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

### 命令行版本托管者程序的参数

下载托管者软件后，解压缩得到的可执行文件```robot```即为托管者程序，在部署托管者时可以为托管者程序指定参数。
- ```-v```：
  查看当前托管者程序的版本、编译时间等信息。
  完整的执行命令以```苹果电脑Mac系统```为例：```./robot -v```。
- ```-vv```：
  托管者程序的运行详细日志和交互消息，默认不显示且不写入托管者日志文件。
  这样可以防止频繁的交互指令导致日志记录膨胀并占用硬盘空间。如果您需要记录托管者的详细日志并在托管者运行时显示出来，可以通过使用```-vv```参数来设置详细日志和交互消息写入托管者日志文件。
- ```-s```：
  运行托管者程序时指定与发明者量化交易平台通信的地址。
  完整的执行命令以```苹果电脑Mac系统```为例：```./robot -s node.fmz.com/xxxxxxx```，```xxxxxxx```部分为每个发明者量化交易平台账号的唯一识别ID，命令执行后会提示要求输入对应的发明者量化交易平台账号密码。
- ```-p```：
  可以直接在运行命令中通过参数指定密码，不建议这样做，因为会在当前系统记录中留下密码参数。假设地址```node.fmz.com/xxxxxxx```对应的账号密码为：```abc123456```。
  完整的执行命令以```苹果电脑Mac系统```为例：```./robot -s node.fmz.com/xxxxxxx -p abc123456```。
- ```-n```：
  为运行的托管者程序添加标签信息。
  完整的执行命令以```苹果电脑Mac系统```为例：```./robot -n macTest -s node.fmz.com/xxxxxxx```。在平台托管者管理页面的托管者信息中会显示```macTest```文本标记。
- ```-l```：
  打印当前托管者支持的交易所列表。
  完整的执行命令以```苹果电脑Mac系统```为例：```./robot -l```。即可输出所支持的交易所名称。

### 实盘数据迁移

当需要将实盘数据迁移到其他设备（服务器）上的托管者时，可以将实盘的数据库文件（扩展名为db3的数据库文件）移动到目标设备（服务器）上托管者目录中的对应路径位置。

将文件名设置为平台上对应的实盘ID，这样之前实盘的所有日志信息就不会因为迁移到新设备而丢失。

### 托管者监控

在[托管者管理页面](https://www.fmz.com/m/nodes)的**托管者列表操作项**或**托管者详情操作项**中，可以开启**托管者监控**功能。开启监控后，若托管者异常离线，当前发明者量化交易平台绑定的邮箱将收到通知消息。

## 交易所

[交易所](https://www.fmz.com/m/platforms)页面用于管理和展示当前配置的交易所。在发明者量化交易平台中，「交易所」是一个核心概念，它指的是包含可供策略程序操作的资金账户相关密钥配置、通信协议和接口封装的对象。

在交易所管理页面，点击「添加交易所」按钮即可跳转至[交易所添加页面](https://www.fmz.com/m/add-platform)，根据需求选择并填写配置信息。所有配置信息在本地加密后存储于发明者量化交易平台，因此平台不会记录任何明文数据。

**交易所对象**
已配置的交易所在策略代码层面对应```exchange```对象（交易所对象）。详情请参阅「语法手册」中的[```exchange```](https://www.fmz.com/syntax-guide#var_exchange)。
在配置回测或实盘时，可以添加多个交易所。因此在策略代码层面存在```exchanges```对象数组（交易所对象数组）。详情请参阅「语法手册」中的[```exchanges```](https://www.fmz.com/syntax-guide#var_exchanges)。

**使用交易所对象**
在策略代码中可以调用交易所对象执行账户查询、行情获取、下单、撤单等操作。以```JavaScript```语言为例：

```js
function main() {
    let account = exchange.GetAccount()    // 查询账户信息
    let ticker = exchange.GetTicker()      // 获取ticker行情
    let id = exchange.Buy(1000, 1)         // 价格为1000，下单量为1
    exchange.CancelOrder(id)               // 如果订单没成交，则可以撤单
}
```

## 策略编辑器

在[新建策略页面](https://www.fmz.com/m/add-strategy)或者在[策略库](https://www.fmz.com/m/strategies)中打开一个现有策略进入**编辑页面**（例如策略ID为123456的地址为：```https://www.fmz.com/m/edit-strategy/123456```），即可编写和设计策略。

发明者量化交易平台的在线策略编辑器提供了强大的策略编辑辅助功能。

![线上策略编辑器界面](https://www.fmz.com/upload/asset/2e50fff4160187be92248.png)

### AI助手

FMZ量化交易平台集成了先进的AI大模型助手功能，为用户提供智能化的策略开发和交易辅助服务。通过与业界领先的大语言模型深度集成，平台能够帮助用户快速解决编程问题、优化交易策略、分析市场数据，并提供专业的量化交易指导。

FMZ平台目前支持以下AI大模型：
Claude Sonnet 4 - Anthropic最新发布的高性能模型，具备卓越的代码理解和生成能力。

- 如何调用AI助手

  ![策略编辑器菜单中的AI助手](https://www.fmz.com/upload/asset/16b08991d9857b82a46b.png)

  在空白处点击右键，在弹出的菜单中选择「AI助手」选项，即可调用AI助手，或者使用快捷键```⌘K```调用AI助手。
- 使用AI助手解释代码

  ![策略编辑器中的AI助手解释代码](https://www.fmz.com/upload/asset/16aa01684eda4e8163ed.png)

  AI助手不仅能够帮助您编写代码，还能为您解释代码逻辑。选中需要解释的代码片段后点击右键，在弹出的菜单中选择「解释这段代码」，即可查看AI助手提供的详细代码解释。
- 优化和改进代码
  选中需要优化的代码片段后点击右键，在弹出的菜单中选择「提出优化建议」或「重新优化代码」，AI助手将为您提供优化建议或直接生成优化后的代码。

### 命令面板

在策略代码编辑区域点击鼠标右键，选择弹出菜单中的「命令面板」选项，可查看各种功能的快捷键组合和编辑器命令。

![策略编辑器中菜单的命令面板显示](https://www.fmz.com/upload/asset/2e429269f02185dfbab3b.png)

### 语法手册速查

在**策略编辑页面**的「代码」编辑区内，可以快速查询「语法手册」。根据操作系统不同，使用相应的快捷键：

![策略编辑器中语法手册速查](https://www.fmz.com/upload/asset/2e4d0722af99164f69996.png)

- Mac系统（苹果电脑）的浏览器中：按住```⌘```键不放。
- Windows系统的浏览器中：按住```Ctrl```键不放。

然后将鼠标移动到需要查询的**变量名**或**函数名**上时，会出现跳转链接。点击该链接即可弹出「语法手册」，并自动定位到查询的内容。

### 定义与引用跳转

选中需要查询的内容，点击鼠标右键弹出菜单。
- 转到定义：跳转至所查询内容的定义位置。
- 转到引用：跳转至所查询内容的引用位置。
- 快速查看-速览定义：在不离开当前代码行的情况下查看所选代码的定义。
- 快速查看-查看引用：在不离开当前代码行的情况下查看其他代码行中对当前代码的引用情况，支持快速跳转，便于更好地理解代码逻辑和结构。

### 策略文档

线上策略编辑页面提供了完善的文档记录功能，可将策略代码、策略描述、使用说明、开发日志等信息分类管理。

![策略文档选项说明](https://www.fmz.com/upload/asset/2e47983c191c1779bd52e.png)

- 代码：策略程序的源代码。
  发明者量化交易平台上的完整策略包含：策略源码、[策略参数设计](https://www.fmz.com/user-guide#策略参数)、[策略交互设计](https://www.fmz.com/user-guide#交互控件)、[策略模板引用](https://www.fmz.com/user-guide#模板类库)。
- 笔记：用于记录策略开发过程中的相关内容。
- 描述：用于记录策略公开展示时的介绍信息。
- 手册：用于记录仅在策略租用后才可查看的详细信息。

### 历史版本管理

平台支持策略开发过程中的版本迭代功能，在**策略编辑页面**「代码」编辑区内，点击「历史版本」按钮可以打开策略历史版本管理页面。

- 当前策略没有任何历史版本快照时，点击「立即创建」按钮创建当前策略的快照。快照内容包括：策略代码、笔记、描述、手册、参数设计、交互设计等。

- 创建历史快照后，历史版本管理页面右侧会显示已保存的历史快照列表。点击该列表上方的「创建历史版本」按钮可以继续保存新的历史快照。

- 编辑、使用历史快照：可以对已记录的策略历史快照进行**修改历史快照名称**、**删除历史快照**、**恢复到历史快照的策略版本**等操作。

- 预览当前选定的历史快照：点击历史版本管理页面左下角的「预览」按钮，可以预览当前历史快照中的策略代码、笔记、描述、手册、参数设计、交互设计等内容。

- 对比当前选定的历史快照与当前策略的差异：点击历史版本管理页面左下角的「对比」按钮，可以对比当前历史快照与当前策略之间的差异。

## 实盘运行历史版本

策略的历史版本不仅可以用于代码管理和版本回滚，还可以直接在实盘中运行：

- **设置默认运行版本**：在策略编辑器页面点击「历史版本」按钮，选中某个历史版本后，点击菜单中的「修改」按钮，在弹框中可以勾选「设置为默认版本」选项。如果不设置，默认运行最新版本。

- **在实盘中使用历史版本**：创建实盘或修改实盘参数时，策略所有者可以选择策略的某个历史版本来运行。此功能仅对策略所有者有效。

- **出租策略的版本控制**：当策略出租给其他用户时，租用方只能运行策略所有者设置的「默认运行版本」，无法选择其他历史版本。策略所有者可以通过设置默认运行版本来控制出租策略使用的版本。

### 其它

- [远程编辑](https://www.fmz.com/user-guide#远程编辑)
  ![远程编辑截图](https://www.fmz.com/upload/asset/2e4e8975d1e32517fd989.png)
- [保存回测设置](https://www.fmz.com/user-guide#保存回测设置)
  ![保存回测设置截图](https://www.fmz.com/upload/asset/2e51f69b120f9b6aadaee.png)
- [策略导入、导出](https://www.fmz.com/user-guide#完整策略的导入与导出)
  ![策略导入导出截图](https://www.fmz.com/upload/asset/2e52ccf44526f396fb795.png)

## 回测系统

当您完成量化交易策略的设计后，如何验证策略的逻辑正确性、收益预期等关键指标？显然不能直接使用真实资金在市场中测试。正确的做法是使用历史数据对策略进行回测，通过分析策略在历史行情中的表现来评估其盈利能力和风险特征。

### 回测系统模式

发明者量化交易平台将回测模式分为**实盘级 Tick**回测和**模拟级 Tick**回测。**实盘级 Tick**回测完全基于完整的历史数据进行回测；**模拟级 Tick**回测则根据真实K线数据生成**tick数据**来进行回测。两者都基于真实历史数据进行回测，但**实盘级 Tick**回测的数据更精准，结果更加可信。需要注意的是，回测仅反映策略在历史数据下的表现，历史数据并不能完全代表未来的行情，因此对待回测结果应保持理性、客观的态度。

**模拟级 Tick**回测根据底层K线周期生成模拟的**tick数据**，每个底层K线周期上最多生成12个回测时间点。而**实盘级 Tick**回测使用真实收集的逐秒tick数据，数据量大，回测速度较慢，因此不适合回测特别长的时间范围。FMZ量化的回测机制允许策略在一根K线上进行多次交易，避免了仅能在收盘价成交的局限性，在保证精准度的同时兼顾了回测速度。

[回测系统机制说明](https://www.fmz.com/digest-topic/4009)

- 模拟级 Tick
  **模拟级 Tick**回测根据回测系统的底层K线数据，按照特定算法在给定的底层K线Bar的最高价、最低价、开盘价、收盘价构成的价格框架内模拟生成tick数据进行回测，作为回测时间序列上的实时tick数据，在策略程序调用接口时返回。具体可参考：[回测系统模拟级别机制说明](https://www.fmz.com/bbs-topic/662)。

- 实盘级 Tick
  实盘级别回测使用Bar时间序列中的真实tick级别数据。对于基于tick级别数据的策略，使用实盘级别回测更贴近实际情况。实盘级别回测的tick是真实记录的数据，并非模拟生成。支持深度数据、市场成交记录数据回放，支持自定义深度，支持分笔数据。实盘级别回测数据最大支持50MB，在数据上限内不限制回测时间范围。如需尽可能增大回测时间范围，可降低深度档位数值设置，不使用分笔数据以扩展回测时间范围。调用```GetDepth```、```GetTrades```函数获取回放行情数据。在时间轴上某个行情数据时刻，调用```GetTicker```、```GetTrades```、```GetDepth```、```GetRecords```，不会多次推动时间在回测时间轴上移动（不会触发跳转到下一个行情数据时刻）。对于以上某个函数的重复调用，将推动回测时间在回测时间轴上移动（跳转到下一个行情数据时刻）。回测时使用实盘级别回测不宜选择过早的时间，因为过早的时间段可能没有实盘级别数据。

**实盘级Tick**和**模拟级Tick**模式的回测系统成交撮合机制：订单成交撮合按照见价成交、全量成交进行。因此回测系统中无法测试部分成交的场景。

### 回测数据粒度对回测的影响

以下测试代码针对不同的数据粒度（A. 实盘级别回测、B. 模拟级别回测（较小底层K线周期）、C. 模拟级别回测（较大底层K线周期）等）会呈现不同的表现。交易次数和盈亏结果均会有所差异。进行回测时应尽可能保持较小的数据粒度。虽然数据粒度较大时回测速度可能更快，但所得结果可能缺乏客观性。

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
            // 价格上涨超过阈值 -> 做空
            exchange.Sell(ticker.Last, lotSize)
            Log("Short @", ticker.Last)
            direction = "short"
        } else if ((!direction || direction == "short") && diff <= -delta) {
            // 价格下跌超过阈值 -> 做多
            exchange.Buy(ticker.Last, lotSize)
            Log("Long @", ticker.Last)
            direction = "long"
        }
        // Tick模式中应尽可能短，K线回测中无影响
        Sleep(100)
    }
}
```

### 回测系统支持多种编程语言

回测系统支持对以下语言编写的策略进行回测：```JavaScript```、```TypeScript```、```Python```、```Rust```、```C++```、[```PINE```](https://www.fmz.com/bbs-topic/9315)、[```My语言```](https://www.fmz.com/bbs-topic/2569)、```Blockly``` 可视化以及 ```Workflow``` 工作流。

  1、**JavaScript** 和 **C++** 策略的回测在浏览器端进行，其策略在实盘和回测运行时均无需安装任何其它软件、库或模块。

  2、**Python** 语言的策略回测在托管者上进行，既可以在 FMZ 量化的公共服务器上回测，也可以在用户自己的托管者上回测。实盘和回测均依赖托管者所在系统中安装的 Python 环境，如需使用某些库，请自行安装，FMZ 量化的公共服务器仅支持常用的 **Python** 库。

  3、**JavaScript** 语言的策略回测支持在 Chrome 浏览器的 DevTools 中进行调试，详见[参考说明](https://www.fmz.com/digest-topic/9459)。

  4、**Workflow** 工作流策略支持回测，可视化查看节点执行状态和数据流转过程。

  5、**Rust** 语言的策略在回测时由平台服务器编译，编译后的模块在浏览器端的回测系统中运行；策略中通过 frontmatter 声明的第三方 crate 依赖在编译时自动获取，无需在本地安装任何工具链。

### 回测系统支持的交易所

- 加密货币
  支持主流加密货币现货及期货交易所，覆盖交易所全部交易品种数据。
- 富途证券
  支持港股、美股等多个市场。

  回测注意事项：回测系统目前仅支持富途日线级别数据：
  ```js
  /*backtest
  start: 2024-05-01 00:00:00
  end: 2025-02-17 00:00:00
  period: 1d
  basePeriod: 1d
  exchanges: [{"eid":"Futures_Futu","currency":"STOCK","fee":[0.03,0.03]}]
  */

  function main() {
      let info = exchange.SetContractType("TLSA.US")   // 设置股票代码：特斯拉
      Log("info:", info)         // info: {"InstrumentID":"TLSA.US","LotTick":1,"PriceTick":0.01,"VolumeMultiple":1}
      Log(exchange.GetTicker())  // {"Time":1714482000000,"Symbol":"TLSA.US","Open":0.62,"High":0.63,"Low":0.61,"Sell":0.63,"Buy":0.61,"Last":0.62,"Volume":0,"OpenInterest":0}
  }
  ```

### 回测系统参数调优

发明者量化交易平台回测系统参数调优功能允许在回测时根据各个参数的调优选项设置参数组合。在「模拟回测」页面的策略参数部分，勾选策略参数右侧的**调优**选项即可显示调优设置。

- 最小值：设定参数的起始值。
- 最大值：设定参数递增变化后的最大值。
- 步长：参数递增的变化量。
- 并发线程：
  参数调优时，设置各个回测参数组合并发执行的线程数。该选项仅支持```JavaScript```、```PINE```、```My语言```的策略参数调优，不支持模板参数的调优。

系统根据```最小值```、```最大值```、```步长```设置生成参数组合，并遍历这些参数组合进行回测（即对每种参数组合都执行一次回测）。策略参数只有类型为**数字型(number)**的参数才能在回测系统中进行参数调优设置。

### 保存回测设置

在[策略编辑页面](https://www.fmz.com/m/add-strategy)的「模拟回测」分页（即回测系统）中，可以设置回测配置、策略参数等选项进行策略回测。回测配置用于设置回测的时间范围、交易所、交易滑点、手续费等条件；策略参数则用于设置策略的参数选项。

设置好这些参数配置后，即可按照设定进行策略回测。那么，如何保存这些已设置好的配置信息呢？

- 1、可以使用[策略编辑页面](https://www.fmz.com/m/add-strategy)的「保存回测设置」按钮，将所有回测配置信息（包含回测设置、策略参数设置）以代码形式记录在策略源码中。

- 2、在策略编辑页面点击「保存策略」按钮保存策略时，平台会自动记录当前的回测设置、策略参数配置等信息。

回测系统如何载入回测配置呢？

- 1、刷新或重新打开策略编辑页面时，系统会优先自动载入「保存回测设置」按钮所记录的回测配置信息。

- 2、如果当前策略代码中没有以注释形式```backtest```记录的回测配置信息（即未通过「保存回测设置」按钮保存在策略代码中），回测系统会自动将回测设置配置为当前策略最后一次点击「保存策略」按钮时的回测配置信息。

- 3、如果在策略编辑页面中修改了策略代码开头部分以注释形式记录的回测配置信息，需要将更新后的回测配置信息同步到策略回测界面的选项，可以点击策略编辑区域```backtest```上方的「回测设置」按钮。

点击「保存回测设置」时，```JavaScript```/```Python```/```C++```/```My语言```/```PINE```语言的策略将回测设置保存到策略代码时，格式略有差别：

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

My语言：

```My
(*backtest
start: 2021-06-26 00:00:00
end: 2021-09-23 00:00:00
period: 1d
basePeriod: 1h
exchanges: [{"eid":"Binance","currency":"BTC_USDT"}]
*)
```

PINE语言：

```pine
/*backtest
start: 2021-06-26 00:00:00
end: 2021-09-23 00:00:00
period: 1d
basePeriod: 1h
exchanges: [{"eid":"Binance","currency":"BTC_USDT"}]
*/
```

### 自定义数据源

发明者量化交易平台的回测系统支持自定义数据源，回测系统使用```GET```方法请求自定义的URL（可公开访问的网址）来获取外部数据源进行回测，附加的请求参数如下：

| 参数 | 意义 | 说明 |
| - | - | - |
| symbol | 品种名称 | 现货行情数据示例：```BTC_USDT```，期货行情数据示例：```BTC_USDT.swap```，期货永续合约资金费率数据示例：```BTC_USDT.funding```，期货永续合约价格指数数据示例：```BTC_USDT.index``` |
| eid | 交易所 | 例如：OKX、Futures_OKX |
| round | 数据精度 | 为true时，表示由自定义数据源返回的数据中定义具体精度。发明者量化交易平台回测系统向自定义数据源发送的请求固定为：```round=true``` |
| period | K线数据的周期（毫秒） | 例如：```60000```表示1分钟周期 |
| depth | 深度档数 | 1-20 |
| trades | 是否需要逐笔成交数据 | 真（1）/假（0） |
| from | 开始时间 | unix时间戳 |
| to | 结束时间 | unix时间戳 |
| detail | 请求品种的详细信息 | 为true时，表示需要由自定义数据源提供。发明者量化交易平台回测系统向自定义数据源发送的请求固定为：```detail=true``` |
| custom | -- | 可忽略此参数 |

现货交易所、期货交易所对象的数据源设置为自定义数据源（feeder）时，回测系统向自定义数据源服务发送请求的示例：

```url
http://customserver:9090/data?custom=0&depth=20&detail=true&eid=Bitget&from=1351641600&period=86400000&round=true&symbol=BTC_USDT&to=1611244800&trades=1
http://customserver:9090/data?custom=0&depth=20&detail=true&eid=Futures_OKX&from=1351641600&period=86400000&round=true&symbol=BTC_USDT.swap&to=1611244800&trades=1
```

#### 数据格式

返回的格式必须为以下两种格式之一（系统自动识别）：
- 模拟级Tick，以下是JSON数据示例：
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
- 实盘级Tick，以下是JSON数据示例：
  Tick级回测数据（包含盘口深度信息，深度格式为```[价格, 数量]```的数组。可包含多级深度，```asks```按价格升序排列，```bids```按价格降序排列）。
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

| 字段 | 说明 |
| - | - |
| detail | 请求数据的品种详细信息，包含计价币名称、交易币名称、精度、最小下单量等 |
| schema | 指定data数组中列的属性，区分大小写。仅限于 time, open, high, low, close, vol, asks, bids, trades |
| data | 按照schema设置的列结构记录的数据 |

**detail字段**

| 字段 | 说明 |
| - | - |
| eid            | 交易所ID，注意同一交易所的现货与期货使用不同的eid |
| symbol         | 交易品种代码 |
| alias          | 当前交易品种代码在交易所中对应的symbol |
| baseCurrency   | 交易币种 |
| quoteCurrency  | 计价币种 |
| marginCurrency | 保证金币种 |
| basePrecision  | 交易币种精度 |
| quotePrecision | 计价币种精度 |
| minQty         | 最小下单量 |
| maxQty         | 最大下单量 |
| minNotional    | 最小下单金额 |
| maxNotional    | 最大下单金额 |
| priceTick      | 价格最小变动单位 |
| volumeTick     | 下单量最小变动单位 |
| marginLevel    | 期货杠杆倍数 |
| contractType   | 对于永续合约设置为：```swap```，回测系统将继续发送资金费率、价格指数请求 |

特殊列属性```asks```、```bids```、```trades```说明：

| 字段 | 说明 | 备注 |
| - | - | - |
| asks / bids | [[价格, 数量], ...]                      | 例如```实盘级 Tick```数据示例中的数据：```[[9531300, 10]]``` |
| trades      | [[时间, 方向(0:买,1:卖), 价格, 数量], ...] | 例如```实盘级 Tick```数据示例中的数据：```[[1564315200000, 0, 9531300, 10]]``` |

期货交易所的永续合约回测时，自定义数据源还需要提供额外的资金费率数据和价格指数数据。只有当请求的行情数据返回时，返回结构中的detail字段包含```"contractType": "swap"```键值对，回测系统才会继续发送资金费率请求。
当回测系统收到资金费率数据后，才会继续发送价格指数数据请求。

资金费率数据结构如下：
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

- 相邻周期间隔为8小时
- 例如币安资金费率每8小时更新一次，资金费率数据为何是 -16795？
  这是因为与K线数据一样，为避免网络传输过程中浮点数精度丢失，数据采用整型表示；资金费率数据也可能为负值。

回测系统发出的资金费率数据请求示例：

```url
http://customserver:9090/data?custom=0&depth=20&detail=true&eid=Futures_Binance&from=1351641600&period=86400000&round=true&symbol=BTC_USDT.funding&to=1611244800&trades=0
```

价格指数数据结构如下：
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

回测系统发出的价格指数数据请求示例：
```url
http://customserver:9090/data?custom=0&depth=20&detail=true&eid=Futures_Binance&from=1351641600&period=86400000&round=true&symbol=BTC_USDT.index&to=1611244800&trades=0
```

#### 自定义数据源范例

指定数据源地址，例如：```http://120.24.2.20:9090/data```。自定义数据源服务程序使用```Golang```编写：

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

        // /* 模拟级Tick
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

        /* 实盘级Tick
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

测试策略，```JavaScript```示例：
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

### 本地回测引擎

发明者量化交易平台开源了```JavaScript```语言和```Python```语言的本地回测引擎，支持回测时设置底层K线周期。
- [JavaScript语言回测引擎](https://github.com/fmzquant/backtest_javascript)
- [Python语言回测引擎](https://github.com/fmzquant/backtest_python)

以Python语言为例，简要说明本地回测引擎的使用方法：
```python
'''backtest
start: 2022-02-19 00:00:00
end: 2022-03-22 12:00:00
period: 15m
exchanges: [{"eid":"Binance","currency":"BTC_USDT","balance":10000,"stocks":0}]
'''

# Part 1 -----------------------------------
# 初始化回测引擎，backtest 为回测引擎配置信息，与 FMZ 平台线上回测系统配置保持一致
# 通过 __doc__ 读取上方的配置字符串并初始化回测环境
from fmz import *
task = VCtx(__doc__) # initialize backtest engine from __doc__
# End    -----------------------------------

# Part 2 -----------------------------------
# 以下为待测试的策略代码示例（可以从 FMZ 平台复制完整的策略代码）
# 注意：仅复制策略代码时不包含参数设计、交互设计等其他配置内容
def onTick():
	ticker = _C(exchange.GetTicker)
	LogStatus(_D(), ticker.Last)

def main():
	exchange.SetCurrency("ETH_USDT")
	# exchange.SetContractType("swap")  # 如果测试期货交易所对象，需要设置合约，例如这里设置为永续合约
	Log(exchange.GetAccount())
	while True:
		onTick()
		Sleep(1000)
# End    -----------------------------------

# Part 3 -----------------------------------
# 执行回测并捕获结束信号，回测结束时会触发 EOF 异常
# 捕获异常后可以输出回测结果数据或展示回测图表
try:
	main()
except:
	print("Strategy testing completed.")
	print(task.Join(False)) # print backtest result
	# task.Show() # or show backtest chart
# End    -----------------------------------
```

### 回测页面快捷键

- 策略编辑页面和策略回测页面切换的快捷键
  使用```Ctrl + ,```键切换回测页面和策略编辑页面，按住```Ctrl```键后，单按```,```键。
- 策略保存的快捷键
  使用```Ctrl + s```键保存策略。
- 启动回测的快捷键
  使用```Ctrl + b```键启动回测。

### 回测数据下载

- 回测系统日志数据下载
  打开具体策略，切换到「回测页面」进行策略回测。回测结束后，在显示的「状态信息」栏右上角有「下载表格」按钮，点击即可下载回测结束时状态栏数据的CSV格式文件。
- 回测系统状态栏数据下载
  打开具体策略，切换到「回测页面」进行策略回测。回测结束后，在显示的「日志信息」栏右上角有「下载表格」按钮，点击即可下载回测日志数据的CSV格式文件。

### 回测系统夏普算法

回测系统夏普比率算法源码：
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

## 策略入口函数

对于```JavaScript```、```Python```、```Rust```、```C++```语言的策略，发明者量化交易平台已经定义了以下入口函数。

| 函数名 | 说明 |
| - | - |
|```main()```| 入口函数，即策略的主函数。 |
|```onexit()```| 正常退出时执行的收尾函数，最长执行时间为5分钟，可以不声明；如果执行超时，将报出**interrupt**错误。在实盘中，若已先触发```onerror()```函数，则不会再触发```onexit()```函数。
|```onerror()```| 异常退出时触发执行的函数，最长执行时间为5分钟，可以不声明。```Python```语言、```C++```语言编写的策略不支持该函数，回测系统也不支持该函数。
|```init()```| 初始化函数，策略程序在开始运行时会首先自动调用该函数，可以不声明。 |

**注意事项：**

- 当```main()```函数执行结束时，所有已创建的子线程都会被自动终止。

- 在```Rust```语言策略中，直接定义```fn main()```、```fn init()```、```fn onexit()```即可（由引导层自动调用）；也可以在策略代码中调用```OnExit()```注册额外的退出钩子，详见「Rust策略编写说明」。

### onexit()

```onexit()```函数用于处理策略的扫尾工作，最长执行时间为5分钟，需由用户自行实现。

测试```onexit()```函数：

```javascript
function main(){
    Log("Starting, will stop after 5 seconds and execute cleanup function!")
    Sleep(1000 * 5)
}

// 扫尾函数的实现
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

// 扫尾函数的实现
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

由于回测系统中的策略通常被设计为一个死循环，不断轮询执行，因此在回测系统中无法触发策略所实现的```onexit()```函数。可以通过检测回测系统的结束标记（EOF 异常）来触发```onexit()```函数的执行。

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
                // 回测结束时，API 调用返回 Err，退出循环使 main 返回，从而触发 onexit() 扫尾函数
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

```init()``` 为用户实现的初始化函数。策略开始运行时，会首先自动执行 ```init()``` 函数，以完成策略中设计的初始化任务。

```javascript
function main(){
    Log("First line of code executed!", "#FF0000")
    Log("Exiting!")
}

// 初始化函数
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

// 初始化函数
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

```onerror()```，当发生异常时会触发```onerror()```函数执行，该函数不支持```Python```、```C++```语言的策略。```onerror()```函数可以接收一个```msg```参数，该```msg```参数为异常触发时的错误信息。

```javascript
function main() {
    var arr = []
    Log(arr[6].Close)  // 这里故意引发一个程序异常
}

function onerror(msg) {
    Log("Error:", msg)
}
```

```python
# python不支持
```

```cpp
// C++不支持
```

## 策略框架与API函数

在使用```JavaScript```、```Python```、```Rust```、```C++```语言编写的策略中，需要在策略主循环中调用```Sleep()```函数。回测时用于控制回测速度，实盘时用于控制策略的轮询间隔，从而控制对交易所API接口的请求频率。

### 全局函数

| 函数名称 | 简介 |
| - | - |
| [Version](/syntax-guide#fun_version)               | 返回系统当前版本号 |
| [Sleep](/syntax-guide#fun_sleep)                   | 休眠函数，参数为暂停的毫秒数 |
| [IsVirtual](/syntax-guide#fun_isvirtual)           | 判断执行环境，返回真值表示回测环境 |
| [Mail](/syntax-guide#fun_mail)                     | 发送邮件 |
| [Mail_Go](/syntax-guide#fun_mail_go)               | ```Mail```函数的异步版本 |
| [SetErrorFilter](/syntax-guide#fun_seterrorfilter) | 过滤错误日志，参数为正则表达式字符串，匹配该正则表达式的错误日志将不会上传到日志系统 |
| [GetPid](/syntax-guide#fun_getpid)                 | 获取实盘进程ID |
| [GetLastError](/syntax-guide#fun_getlasterror)     | 获取最近一次的错误信息 |
| [GetCommand](/syntax-guide#fun_getcommand)         | 获取策略交互命令，策略交互控件设置请参考：[交互控件](/user-guide#交互控件) |
| [GetMeta](/syntax-guide#fun_getmeta)               | 获取生成策略注册码时写入的Meta值 |
| [Dial](/syntax-guide#fun_dial)                     | 用于原始Socket访问 |
| [HttpQuery](/syntax-guide#fun_httpquery)           | 发送HTTP请求 |
| [HttpQuery_Go](/syntax-guide#fun_httpquery_go)     | ```HttpQuery```函数的异步版本 |
| [Encode](/syntax-guide#fun_encode)                 | 数据编码函数 |
| [UnixNano](/syntax-guide#fun_unixnano)             | 获取纳秒级时间戳 |
| [Unix](/syntax-guide#fun_unix)                     | 获取秒级时间戳 |
| [GetOS](/syntax-guide#fun_getos)                   | 获取系统信息 |
| [MD5](/syntax-guide#fun_md5)                       | 计算MD5哈希值 |
| [DBExec](/syntax-guide#fun_dbexec)                 | 数据库函数，用于执行SQL语句并进行数据库操作 |
| [UUID](/syntax-guide#fun_uuid)                     | 生成UUID |
| [EventLoop](/syntax-guide#fun_eventloop)           | 监听事件，在任意WebSocket可读或```exchange.Go```、```HttpQuery_Go```等并发任务完成后返回，该函数仅适用于实盘 |
| [_G](/syntax-guide#fun__g)                         | 持久化保存数据，该函数实现了一个可保存的全局字典功能。数据结构为键值对表，永久保存在托管者本地数据库文件中 |
| [_D](/syntax-guide#fun__d)                         | 时间戳处理函数，将毫秒时间戳或Date对象转换为时间字符串 |
| [_N](/syntax-guide#fun__n)                         | 格式化浮点数，例如```_N(3.1415, 2)```将删除3.1415小数点后两位以后的数值，函数返回3.14 |
| [_C](/syntax-guide#fun__c)                         | 重试函数，用于接口容错。注意，例如对```exchange.GetTicker```函数进行容错，应使用```_C(exchange.GetTicker)```而非```_C(exchange.GetTicker())``` |
| [_Cross](/syntax-guide#fun__cross)                 | 交叉判断函数，```_Cross()```函数返回正数表示上穿周期数，负数表示下穿周期数，0表示当前价格相同 |
| [JSONParse](/syntax-guide#fun_jsonparse)           | 解析JSON，能够正确解析包含大数值的JSON字符串，将大数值解析为字符串类型。回测系统不支持```JSONParse()```函数 |
| [SetChannelData](/syntax-guide#fun_setchanneldata) | 在频道上发布最新状态数据，用于实盘间通信 |
| [GetChannelData](/syntax-guide#fun_getchanneldata) | 订阅指定实盘的频道数据，用于实盘间通信 |

### 日志函数

| 函数名称 | 简介 |
| - | - |
| [Log](/syntax-guide#fun_log)                       | 输出日志，支持设置日志文本颜色、推送功能，以及打印base64编码的图片 |
| [LogProfit](/syntax-guide#fun_logprofit)           | 输出盈亏数据，打印盈亏数值并根据数值绘制收益曲线 |
| [LogProfitReset](/syntax-guide#fun_logprofitreset) | 清空```LogProfit```函数输出的所有收益日志和收益图表 |
| [LogStatus](/syntax-guide#fun_logstatus)           | 在状态栏输出信息，支持在状态栏中设置按钮控件和输出表格 |
| [EnableLog](/syntax-guide#fun_enablelog)           | 开启或关闭订单信息的日志记录功能 |
| [Chart](/syntax-guide#fun_chart)                   | 图表绘制函数，基于Highcharts/Highstocks图表库 |
| [KLineChart](/syntax-guide#fun_klinechart)         | Pine语言风格的图表绘制函数，用于在策略运行时以类似Pine语言的方式进行自定义绘图 |
| [LogReset](/syntax-guide#fun_logreset)             | 清除日志，支持通过参数设置保留最近指定数量的日志记录 |
| [LogVacuum](/syntax-guide#fun_logvacuum)           | 回收SQLite资源，在调用```LogReset()```函数清除日志后，回收SQLite删除数据时占用的存储空间 |
| [console.log](/syntax-guide#fun_console.log)       | 在实盘页面的「调试信息」栏中输出调试信息 |
| [console.error](/syntax-guide#fun_console.error)   | 在实盘页面的「调试信息」栏中输出错误信息 |

### 行情函数

| 函数名称 | 简介 |
| - | - |
| [exchange.GetTicker](/syntax-guide#fun_exchange.getticker)       | 获取Tick行情数据 |
| [exchange.GetDepth](/syntax-guide#fun_exchange.getdepth)         | 获取订单簿深度数据 |
| [exchange.GetTrades](/syntax-guide#fun_exchange.gettrades)       | 获取市场成交记录 |
| [exchange.GetRecords](/syntax-guide#fun_exchange.getrecords)     | 获取K线数据 |
| [exchange.GetPeriod](/syntax-guide#fun_exchange.getperiod)       | 获取当前K线周期 |
| [exchange.SetMaxBarLen](/syntax-guide#fun_exchange.setmaxbarlen) | 设置K线最大长度 |
| [exchange.GetRawJSON](/syntax-guide#fun_exchange.getrawjson)     | 获取最近一次REST请求返回的原始内容 |
| [exchange.GetRate](/syntax-guide#fun_exchange.getrate)           | 获取当前设置的汇率值 |
| [exchange.SetData](/syntax-guide#fun_exchange.setdata)           | 设置策略运行时加载的数据 |
| [exchange.GetData](/syntax-guide#fun_exchange.getdata)           | 获取已加载的数据或外部链接提供的数据 |
| [exchange.GetMarkets](/syntax-guide#fun_exchange.getmarkets)     | 获取交易所市场信息 |
| [exchange.GetTickers](/syntax-guide#fun_exchange.gettickers)     | 获取交易所聚合行情数据 |

### 交易函数

| 函数名称 | 简介 |
| - | - |
| [exchange.Buy](/syntax-guide#fun_exchange.buy)                          | 提交买单，期货合约下单时必须注意交易方向是否设置正确，如果交易方向与交易函数不匹配将报错 |
| [exchange.Sell](/syntax-guide#fun_exchange.sell)                        | 提交卖单，期货合约下单时必须注意交易方向是否设置正确，如果交易方向与交易函数不匹配将报错 |
| [exchange.CreateOrder](/syntax-guide#fun_exchange.createorder)          | 提交订单，通过参数指定交易品种、交易方向、价格、数量 |
| [exchange.ModifyOrder](/syntax-guide#fun_exchange.modifyorder)          | 修改普通订单的价格和数量，支持通过附加参数修改订单的其他属性 |
| [exchange.ModifyConditionOrder](/syntax-guide#fun_exchange.modifyconditionorder) | 修改条件单的数量和触发条件，支持通过附加参数修改条件单的其他属性 |
| [exchange.CancelOrder](/syntax-guide#fun_exchange.cancelorder)          | 取消订单 |
| [exchange.GetOrder](/syntax-guide#fun_exchange.getorder)                | 获取订单信息，数据结构为[Order](/syntax-guide#struct_order)结构 |
| [exchange.GetOrders](/syntax-guide#fun_exchange.getorders)              | 获取未完成的订单，数据结构为[Order](/syntax-guide#struct_order)结构数组（列表） |
| [exchange.GetHistoryOrders](/syntax-guide#fun_exchange.gethistoryorders)| 获取当前交易对、合约的历史订单，支持指定具体交易品种 |
| [exchange.SetPrecision](/syntax-guide#fun_exchange.setprecision)        | 设置exchange交易所对象的价格与下单量精度，设置后系统将自动忽略数据的多余部分 |
| [exchange.SetRate](/syntax-guide#fun_exchange.setrate)                  | 设置汇率 |
| [exchange.IO](/syntax-guide#fun_exchange.io)                            | 用于交易所对象相关的其他接口调用 |
| [exchange.Log](/syntax-guide#fun_exchange.log)                          | 输出并记录交易日志，不实际下单 |
| [exchange.Encode](/syntax-guide#fun_exchange.encode)                    | 签名加密计算 |
| [exchange.Go](/syntax-guide#fun_exchange.go)                            | 多线程异步支持函数 |
| [exchange.GetAccount](/syntax-guide#fun_exchange.getaccount)            | 获取账户信息 |
| [exchange.GetAssets](/syntax-guide#fun_exchange.getassets)              | 请求交易所账户资产信息 |
| [exchange.GetName](/syntax-guide#fun_exchange.getname)                  | 获取交易所对象的名称 |
| [exchange.GetLabel](/syntax-guide#fun_exchange.getlabel)                | 获取交易所对象的标签 |
| [exchange.GetCurrency](/syntax-guide#fun_exchange.getcurrency)          | 获取当前交易对 |
| [exchange.SetCurrency](/syntax-guide#fun_exchange.setcurrency)          | 切换交易对 |
| [exchange.GetQuoteCurrency](/syntax-guide#fun_exchange.getquotecurrency)| 获取当前交易对的计价币名称 |

### 期货函数

| 函数名称 | 简介 |
| - | - |
| [exchange.GetPositions](/syntax-guide#fun_exchange.getpositions)       | 获取期货持仓信息，返回[Position](/syntax-guide#struct_position)结构数组（列表） |
| [exchange.SetMarginLevel](/syntax-guide#fun_exchange.setmarginlevel)   | 设置杠杆倍数 |
| [exchange.SetDirection](/syntax-guide#fun_exchange.setdirection)       | 设置[exchange.Buy](/syntax-guide#fun_exchange.buy)函数、[exchange.Sell](/syntax-guide#fun_exchange.sell)函数在期货合约下单时的订单方向 |
| [exchange.SetContractType](/syntax-guide#fun_exchange.setcontracttype) | 设置合约代码，例如：```exchange.SetContractType("swap")```设置合约代码为```swap```，将当前操作的合约设置为永续合约 |
| [exchange.GetContractType](/syntax-guide#fun_exchange.getcontracttype) | 获取当前设置的合约代码 |
| [exchange.GetFundings](/syntax-guide#fun_exchange.getfundings)         | 获取当前期货交易所永续合约的资金费率数据 |

### 网络函数

| 函数名称 | 简介 |
| - | - |
| [exchange.SetBase](/syntax-guide#fun_exchange.setbase)       | 设置交易所API接口的基础地址 |
| [exchange.GetBase](/syntax-guide#fun_exchange.getbase)       | 获取当前交易所API接口的基础地址 |
| [exchange.SetProxy](/syntax-guide#fun_exchange.setproxy)     | 设置网络代理 |
| [exchange.SetTimeout](/syntax-guide#fun_exchange.settimeout) | 设置REST协议的超时时间 |

### API限流控制

## 功能概述

API限流控制功能用于限制策略对交易所API的调用频率，防止因触发交易所的频率限制而导致账号被封禁或临时受限。FMZ平台提供了灵活的限流配置方式，支持两种限流模式和多种配置策略。

### 为什么需要API限流

- **避免触发交易所限制**：大多数交易所对API调用频率有严格限制，一旦超限，可能导致账号被临时或永久封禁。

- **合理分配API配额**：在多策略、多交易对场景下，需要合理分配API调用资源。

- **提高策略稳定性**：通过主动限流，避免因频繁调用导致的连接失败和数据获取异常。

- **符合交易所规范**：遵守交易所的API使用规范，维护良好的API使用关系。

### 两种限流模式

**rate模式（平滑限流）**

- 适用于一般的限流需求

- 不严格对齐时间窗口

- 调用分布相对平滑

- 推荐用于日常的API调用限制

**quota模式（额度限流）**

- 严格对齐时间窗口

- 例如：设置```"1s"```时，窗口对齐到整秒；设置```"1m"```时，窗口对齐到整分钟

- 适用于需要严格控制时间窗口的场景

- 推荐用于日内配额管理

## 基本用法

### rate模式基本示例

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
// C++暂不支持
```

### quota模式基本示例

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
// C++暂不支持
```

## 函数名配置

### 单个函数限流

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
// C++暂不支持
```

### 多个函数联合限流

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
// C++暂不支持
```

### 使用通配符限制所有函数

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
// C++暂不支持
```

## 时间周期配置

### 支持的时间单位

- ```ns```：纳秒

- ```us``` 或 ```µs```：微秒

- ```ms```：毫秒

- ```s```：秒

- ```m```：分钟

- ```h```：小时

- ```d```：天

示例：```"100ms"```, ```"1s"```, ```"5m"```, ```"1h"```, ```"1d"```

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
    # 不同时间周期的配置
    exchange.IO("rate", "GetTicker", 10, "1s")     # 每秒10次
    exchange.IO("rate", "GetDepth", 30, "1m")      # 每分钟30次
    exchange.IO("rate", "GetAccount", 100, "1h")   # 每小时100次
    exchange.IO("rate", "CreateOrder", 500, "1d")  # 每天500次
```

```rust
fn main() {
    // 不同时间周期的配置
    let _ = exchange.IO(("rate", "GetTicker", 10, "1s"));     // 每秒10次
    let _ = exchange.IO(("rate", "GetDepth", 30, "1m"));      // 每分钟30次
    let _ = exchange.IO(("rate", "GetAccount", 100, "1h"));   // 每小时100次
    let _ = exchange.IO(("rate", "CreateOrder", 500, "1d"));  // 每天500次
}
```

```cpp
// C++暂不支持
```

### 重置时间点配置

使用 ```@HHMM``` 或 ```@HHMMSS``` 格式指定每日的重置时间点，仅在 quota 模式下有效。

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
// C++暂不支持
```

## 行为模式

### 默认模式（超限返回null）

```javascript
function main() {
    exchange.IO("rate", "GetTicker", 5, "1s")  // 不指定 behavior 参数

    for (var i = 0; i < 10; i++) {
        var ticker = exchange.GetTicker("BTC_USDT")
        if (ticker) {
            Log("Call", i+1, "Success:", ticker.Last)
        } else {
            Log("Call", i+1, "Failed: rate limit exceeded")
            // 可选择 Sleep 等待，或跳过本次调用
            Sleep(200)
        }
    }
}
```

```python
def main():
    exchange.IO("rate", "GetTicker", 5, "1s")  # 不指定 behavior 参数

    for i in range(10):
        ticker = exchange.GetTicker("BTC_USDT")
        if ticker:
            Log("Call", i+1, "Success:", ticker["Last"])
        else:
            Log("Call", i+1, "Failed: rate limit exceeded")
            # 可选择 Sleep 等待，或跳过本次调用
            Sleep(200)
```

```rust
fn main() {
    let _ = exchange.IO(("rate", "GetTicker", 5, "1s"));  // 不指定 behavior 参数

    for i in 0..10 {
        match exchange.GetTicker("BTC_USDT") {
            Ok(ticker) => Log!("Call", i + 1, "Success:", ticker.Last),
            Err(_) => {
                Log!("Call", i + 1, "Failed: rate limit exceeded");
                // 可选择 Sleep 等待，或跳过本次调用
                Sleep(200);
            }
        }
    }
}
```

```cpp
// C++暂不支持
```

### delay模式（超限自动等待）

```javascript
function main() {
    exchange.IO("rate", "GetTicker", 5, "1s", "delay")  // 指定delay参数

    // 调用超限时会自动等待，确保每次调用都成功
    for (var i = 0; i < 10; i++) {
        var ticker = exchange.GetTicker("BTC_USDT")
        Log("Call", i+1, "Success:", ticker.Last)  // ticker不会为null
    }
}
```

```python
def main():
    exchange.IO("rate", "GetTicker", 5, "1s", "delay")  # 指定delay参数

    # 调用超限时会自动等待，确保每次调用都成功
    for i in range(10):
        ticker = exchange.GetTicker("BTC_USDT")
        Log("Call", i+1, "Success:", ticker["Last"])  # ticker不会为None
```

```rust
fn main() {
    let _ = exchange.IO(("rate", "GetTicker", 5, "1s", "delay"));  // 指定delay参数

    // 调用超限时会自动等待，确保每次调用都成功
    for i in 0..10 {
        let ticker = exchange.GetTicker("BTC_USDT").unwrap();
        Log!("Call", i + 1, "Success:", ticker.Last);  // ticker不会返回Err
    }
}
```

```cpp
// C++暂不支持
```

## 支持的函数列表

### 交易类函数
- ```CreateOrder```：创建订单
- ```CancelOrder```：取消订单
- ```Buy```：买入（受CreateOrder限制）
- ```Sell```：卖出（受CreateOrder限制）
- ```CreateConditionOrder```：创建条件单
- ```CancelConditionOrder```：取消条件单

### 账户类函数
- ```GetAccount```：获取账户信息
- ```GetAssets```：获取资产信息
- ```GetPositions```：获取持仓信息

### 订单类函数
- ```GetOrder```：获取单个订单
- ```GetOrders```：获取所有订单
- ```GetHistoryOrders```：获取历史订单
- ```GetConditionOrder```：获取单个条件单
- ```GetConditionOrders```：获取所有条件单
- ```GetHistoryConditionOrders```：获取历史条件单

### 行情类函数
- ```GetTicker```：获取单个行情（ticker）
- ```GetTickers```：获取多个行情（ticker）
- ```GetDepth```：获取市场深度
- ```GetRecords```：获取K线数据
- ```GetTrades```：获取最新成交记录

### 其它函数
- ```GetMarkets```：获取市场列表
- ```GetFundings```：获取资金费率
- ```SetMarginLevel```：设置杠杆倍数
- ```Go```：并发调用（受实际调用函数限制）
- ```IO/api```：自定义API调用（仅限exchange.IO("api", ...)）

## 实际应用场景

### 场景1：防止触发交易所的频率限制

```javascript
function main() {
    // 假设交易所限制：GetTicker 每秒 20 次，CreateOrder 每秒 5 次
    // 将频率设置为略低于交易所限制的值，以预留安全余量
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
    # 假设交易所限制：GetTicker 每秒 20 次，CreateOrder 每秒 5 次
    # 将频率设置为略低于交易所限制的值，以预留安全余量
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
    // 假设交易所限制：GetTicker 每秒 20 次，CreateOrder 每秒 5 次
    // 将频率设置为略低于交易所限制的值，以预留安全余量
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
// C++ 暂不支持
```

### 场景2：多交易所对象统一限流

```javascript
function main() {
    // 为每个交易所对象设置限流
    for (var i = 0; i < exchanges.length; i++) {
        exchanges[i].IO("rate", "GetTicker", 10, "1s")
        exchanges[i].IO("rate", "CreateOrder", 2, "1s")
    }

    // 并发获取多个交易所的行情
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
    # 为每个交易所对象设置限流
    for i in range(len(exchanges)):
        exchanges[i].IO("rate", "GetTicker", 10, "1s")
        exchanges[i].IO("rate", "CreateOrder", 2, "1s")

    # 并发获取多个交易所的行情
    while True:
        for i in range(len(exchanges)):
            ticker = exchanges[i].GetTicker("BTC_USDT")
            if ticker:
                Log(exchanges[i].GetName(), "Price:", ticker["Last"])
        Sleep(1000)
```

```rust
fn main() {
    // 为每个交易所对象设置限流
    for e in exchanges.iter() {
        let _ = e.IO(("rate", "GetTicker", 10, "1s"));
        let _ = e.IO(("rate", "CreateOrder", 2, "1s"));
    }

    // 并发获取多个交易所的行情
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
// C++ 暂不支持
```

### 场景3：日内配额管理

```javascript
function main() {
    // 每天最多 1000 次 API 调用，每天早上 8 点重置
    exchange.IO("quota", "*", 1000, "@0800")

    var callCount = 0
    while (true) {
        var ticker = exchange.GetTicker("BTC_USDT")
        if (ticker) {
            callCount++
            Log("Call count:", callCount, "Price:", ticker.Last)
        } else {
            Log("Daily quota exceeded, waiting for tomorrow 08:00")
            Sleep(60000)  // 等待 1 分钟后重试
        }
        Sleep(10000)
    }
}
```

```python
def main():
    # 每天最多 1000 次 API 调用，每天早上 8 点重置
    exchange.IO("quota", "*", 1000, "@0800")

    callCount = 0
    while True:
        ticker = exchange.GetTicker("BTC_USDT")
        if ticker:
            callCount += 1
            Log("Call count:", callCount, "Price:", ticker["Last"])
        else:
            Log("Daily quota exceeded, waiting for tomorrow 08:00")
            Sleep(60000)  # 等待 1 分钟后重试
        Sleep(10000)
```

```rust
fn main() {
    // 每天最多 1000 次 API 调用，每天早上 8 点重置
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
                Sleep(60000);  // 等待 1 分钟后重试
            }
        }
        Sleep(10000);
    }
}
```

```cpp
// C++ 暂不支持
```

### 场景4：组合限流策略

```javascript
function main() {
    // 组合使用多种限流策略
    // 1. 行情类API每秒限流
    exchange.IO("rate", "GetTicker,GetDepth", 20, "1s")

    // 2. 交易类API每秒限流
    exchange.IO("rate", "CreateOrder,CancelOrder", 5, "1s")

    // 3. 账户查询类API每分钟限流
    exchange.IO("rate", "GetAccount,GetPositions", 30, "1m")

    // 4. 所有API每日总配额
    exchange.IO("quota", "*", 10000, "@0000")

    Log("Multi-level rate limiting configured")

    // 策略主循环
    while (true) {
        // 获取行情数据
        var ticker = exchange.GetTicker("BTC_USDT")
        var depth = exchange.GetDepth("BTC_USDT")

        // 查询账户信息
        if (Date.now() % 60000 < 1000) {  // 每分钟查询一次
            var account = exchange.GetAccount()
            Log("Account:", account)
        }

        // 交易逻辑
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
    # 组合使用多种限流策略
    # 1. 行情类API每秒限流
    exchange.IO("rate", "GetTicker,GetDepth", 20, "1s")

    # 2. 交易类API每秒限流
    exchange.IO("rate", "CreateOrder,CancelOrder", 5, "1s")

    # 3. 账户查询类API每分钟限流
    exchange.IO("rate", "GetAccount,GetPositions", 30, "1m")

    # 4. 所有API每日总配额
    exchange.IO("quota", "*", 10000, "@0000")

    Log("Multi-level rate limiting configured")

    # 策略主循环
    while True:
        # 获取行情数据
        ticker = exchange.GetTicker("BTC_USDT")
        depth = exchange.GetDepth("BTC_USDT")

        # 查询账户信息
        if int(time.time() * 1000) % 60000 < 1000:  # 每分钟查询一次
            account = exchange.GetAccount()
            Log("Account:", account)

        # 交易逻辑
        if ticker and ticker["Last"] < 50000:
            exchange.CreateOrder("BTC_USDT", "buy", ticker["Last"], 0.001)

        Sleep(500)
```

```rust
fn main() {
    // 组合使用多种限流策略
    // 1. 行情类API每秒限流
    let _ = exchange.IO(("rate", "GetTicker,GetDepth", 20, "1s"));

    // 2. 交易类API每秒限流
    let _ = exchange.IO(("rate", "CreateOrder,CancelOrder", 5, "1s"));

    // 3. 账户查询类API每分钟限流
    let _ = exchange.IO(("rate", "GetAccount,GetPositions", 30, "1m"));

    // 4. 所有API每日总配额
    let _ = exchange.IO(("quota", "*", 10000, "@0000"));

    Log!("Multi-level rate limiting configured");

    // 策略主循环
    loop {
        // 获取行情数据
        let ticker = exchange.GetTicker("BTC_USDT");
        let depth = exchange.GetDepth("BTC_USDT");

        // 查询账户信息
        if UnixNano() / 1000000 % 60000 < 1000 {  // 每分钟查询一次
            let account = exchange.GetAccount();
            Log!("Account:", account);
        }

        // 交易逻辑
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
// C++ 暂不支持
```

## 注意事项

### 1. quota模式时间窗口对齐

quota模式严格对齐时间窗口：
- ```"1s"```：对齐到整秒（例如：12:00:00、12:00:01、12:00:02……）
- ```"1m"```：对齐到整分钟（例如：12:00:00、12:01:00、12:02:00……）
- ```"1h"```：对齐到整小时（例如：12:00:00、13:00:00、14:00:00……）

这意味着即使从12:00:00.500开始计数，到12:00:01.000时，当前时间窗口也会重置。

```javascript
function main() {
    // quota模式：严格对齐到整秒
    exchange.IO("quota", "GetTicker", 3, "1s")

    // 假设当前时间为 12:00:00.500
    exchange.GetTicker("BTC_USDT")  // 第1次，成功
    exchange.GetTicker("BTC_USDT")  // 第2次，成功
    exchange.GetTicker("BTC_USDT")  // 第3次，成功
    exchange.GetTicker("BTC_USDT")  // 第4次，失败（超限）

    Sleep(500)  // 等待500ms，此时时间为 12:00:01.000

    // 窗口已重置
    exchange.GetTicker("BTC_USDT")  // 新窗口第1次，成功
}
```

```python
def main():
    # quota模式：严格对齐到整秒
    exchange.IO("quota", "GetTicker", 3, "1s")

    # 假设当前时间为 12:00:00.500
    exchange.GetTicker("BTC_USDT")  # 第1次，成功
    exchange.GetTicker("BTC_USDT")  # 第2次，成功
    exchange.GetTicker("BTC_USDT")  # 第3次，成功
    exchange.GetTicker("BTC_USDT")  # 第4次，失败（超限）

    Sleep(500)  # 等待500ms，此时时间为 12:00:01.000

    # 窗口已重置
    exchange.GetTicker("BTC_USDT")  # 新窗口第1次，成功
```

```rust
fn main() {
    // quota模式：严格对齐到整秒
    let _ = exchange.IO(("quota", "GetTicker", 3, "1s"));

    // 假设当前时间为 12:00:00.500
    let _ = exchange.GetTicker("BTC_USDT");  // 第1次，成功
    let _ = exchange.GetTicker("BTC_USDT");  // 第2次，成功
    let _ = exchange.GetTicker("BTC_USDT");  // 第3次，成功
    let _ = exchange.GetTicker("BTC_USDT");  // 第4次，失败（超限）

    Sleep(500);  // 等待500ms，此时时间为 12:00:01.000

    // 窗口已重置
    let _ = exchange.GetTicker("BTC_USDT");  // 新窗口第1次，成功
}
```

```cpp
// C++暂不支持
```

### 2. delay模式下的时间差异

使用```"delay"```参数时，实际的API调用时间与日志记录的时间可能并不一致。这是因为触发限流时程序会进入等待，而日志记录的是等待结束后的时间。

```javascript
function main() {
    exchange.IO("rate", "GetTicker", 2, "1s", "delay")

    Log(_D(), "Call 1")  // 12:00:00.000
    exchange.GetTicker("BTC_USDT")

    Log(_D(), "Call 2")  // 12:00:00.100
    exchange.GetTicker("BTC_USDT")

    Log(_D(), "Call 3")  // 12:00:00.200，但实际会等待到12:00:01.000
    exchange.GetTicker("BTC_USDT")  // 触发限流，自动等待

    Log(_D(), "Call 3 completed")  // 日志显示12:00:01.000+
    // 看起来一秒内调用了3次，但实际第3次是在新窗口执行的
}
```

```python
def main():
    exchange.IO("rate", "GetTicker", 2, "1s", "delay")

    Log(_D(), "Call 1")  # 12:00:00.000
    exchange.GetTicker("BTC_USDT")

    Log(_D(), "Call 2")  # 12:00:00.100
    exchange.GetTicker("BTC_USDT")

    Log(_D(), "Call 3")  # 12:00:00.200，但实际会等待到12:00:01.000
    exchange.GetTicker("BTC_USDT")  # 触发限流，自动等待

    Log(_D(), "Call 3 completed")  # 日志显示12:00:01.000+
    # 看起来一秒内调用了3次，但实际第3次是在新窗口执行的
```

```rust
fn main() {
    let _ = exchange.IO(("rate", "GetTicker", 2, "1s", "delay"));

    Log!(_D(None), "Call 1");  // 12:00:00.000
    let _ = exchange.GetTicker("BTC_USDT");

    Log!(_D(None), "Call 2");  // 12:00:00.100
    let _ = exchange.GetTicker("BTC_USDT");

    Log!(_D(None), "Call 3");  // 12:00:00.200，但实际会等待到12:00:01.000
    let _ = exchange.GetTicker("BTC_USDT");  // 触发限流，自动等待

    Log!(_D(None), "Call 3 completed");  // 日志显示12:00:01.000+
    // 看起来一秒内调用了3次，但实际第3次是在新窗口执行的
}
```

```cpp
// C++暂不支持
```

### 3. Buy/Sell函数的限流

```Buy```和```Sell```函数在底层均调用```CreateOrder```，因此其限流规则遵循```CreateOrder```的设置。

```javascript
function main() {
    // 设置CreateOrder限流
    exchange.IO("rate", "CreateOrder", 5, "1s")

    // Buy和Sell也会受到此限制
    for (var i = 0; i < 10; i++) {
        if (i % 2 == 0) {
            exchange.Buy(50000, 0.001)   // 受CreateOrder限制
        } else {
            exchange.Sell(51000, 0.001)  // 受CreateOrder限制
        }
    }
}
```

```python
def main():
    # 设置CreateOrder限流
    exchange.IO("rate", "CreateOrder", 5, "1s")

    # Buy和Sell也会受到此限制
    for i in range(10):
        if i % 2 == 0:
            exchange.Buy(50000, 0.001)   # 受CreateOrder限制
        else:
            exchange.Sell(51000, 0.001)  # 受CreateOrder限制
```

```rust
fn main() {
    // 设置CreateOrder限流
    let _ = exchange.IO(("rate", "CreateOrder", 5, "1s"));

    // Buy和Sell也会受到此限制
    for i in 0..10 {
        if i % 2 == 0 {
            let _ = exchange.Buy(50000, 0.001);   // 受CreateOrder限制
        } else {
            let _ = exchange.Sell(51000, 0.001);  // 受CreateOrder限制
        }
    }
}
```

```cpp
// C++暂不支持
```

### 4. Go函数的限流

```Go```函数的限流取决于实际被并发调用的函数。

```javascript
function main() {
    // 限制GetTicker
    exchange.IO("rate", "GetTicker", 5, "1s")

    // 并发调用GetTicker时受限
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
    # 限制GetTicker
    exchange.IO("rate", "GetTicker", 5, "1s")

    # 并发调用GetTicker时受限
    tasks = []
    for i in range(10):
        tasks.append(exchange.Go("GetTicker", "BTC_USDT"))

    for i in range(len(tasks)):
        ticker = tasks[i].wait()
        Log("Task", i, "Success" if ticker else "Rate limited")
```

```rust
fn main() {
    // 限制GetTicker
    let _ = exchange.IO(("rate", "GetTicker", 5, "1s"));

    // 并发调用GetTicker时受限
    // Rust中exchange.Go为类型化写法，使用Go::GetTicker token
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
// C++暂不支持
```

### 5. IO/api的限流

```IO/api``` 限流仅对 ```exchange.IO("api", ...)``` 调用生效，不会影响其他 ```exchange.IO``` 功能。

```javascript
function main() {
    // 限制exchange.IO("api", ...)调用
    exchange.IO("rate", "IO/api", 10, "1s")

    // 受限制
    for (var i = 0; i < 15; i++) {
        var ret = exchange.IO("api", "GET", "/api/v5/account/balance", "")
        Log("API call", i, ret ? "Success" : "Rate limited")
    }

    // 不受限制
    exchange.IO("currency", "LTC_USDT")  // 切换交易对，不受限
    exchange.IO("rate", "GetDepth", 5, "1s")  // 设置其它限流，不受限
}
```

```python
def main():
    # 限制exchange.IO("api", ...)调用
    exchange.IO("rate", "IO/api", 10, "1s")

    # 受限制
    for i in range(15):
        ret = exchange.IO("api", "GET", "/api/v5/account/balance", "")
        Log("API call", i, "Success" if ret else "Rate limited")

    # 不受限制
    exchange.IO("currency", "LTC_USDT")  # 切换交易对，不受限
    exchange.IO("rate", "GetDepth", 5, "1s")  # 设置其它限流，不受限
```

```rust
fn main() {
    // 限制exchange.IO("api", ...)调用
    let _ = exchange.IO(("rate", "IO/api", 10, "1s"));

    // 受限制
    for i in 0..15 {
        match exchange.IO(("api", "GET", "/api/v5/account/balance", "")) {
            Ok(_) => Log!("API call", i, "Success"),
            Err(_) => Log!("API call", i, "Rate limited"),
        }
    }

    // 不受限制
    let _ = exchange.IO(("currency", "LTC_USDT"));  // 切换交易对，不受限
    let _ = exchange.IO(("rate", "GetDepth", 5, "1s"));  // 设置其它限流，不受限
}
```

```cpp
// C++暂不支持
```

## 最佳实践

1. **根据交易所限制设置**：请参考交易所的 API 文档，将限流值设置为略低于交易所限制的水平。

2. **留出安全余量**：请勿将限流值设置为交易所允许的最大值，建议设置为最大值的 70%-80%。

3. **分层限流**：针对不同类型的 API 设置不同的限流值，并为重要 API 保留更多余量。

4. **使用 delay 模式处理关键调用**：对于必须成功的 API 调用，请使用 ```"delay"``` 模式以确保调用成功。

5. **监控 API 使用情况**：定期检查策略的 API 调用频率，并持续优化调用逻辑。

6. **避免过度调用**：合理设计策略逻辑，避免不必要的 API 调用。

7. **测试限流配置**：在实盘运行前，先在模拟环境中测试限流配置是否合理。

See also: `exchange.IO`, `exchange.Go`, `exchange.Buy`, `exchange.Sell`

### 策略实盘间通信

## 功能概述

  策略实盘间通信功能允许不同的实盘策略之间共享数据并同步状态。通过频道机制，一个实盘可以将自身的状态数据广播给其他实盘，从而实现跨实盘、跨托管者、跨服务器的数据通信。

  ### 核心概念

  - **频道(Channel)**：每个实盘都拥有一个独立的频道，频道ID即为实盘ID

  - **广播端**：使用```SetChannelData()```函数在频道上发布数据的实盘

  - **订阅端**：使用```GetChannelData()```函数订阅其他实盘频道数据的实盘

  - **状态覆盖**：频道上仅保存最新状态，新数据会覆盖旧数据，而非采用消息队列机制

  ### 主要特性

  - **非阻塞通信**：所有函数调用均为非阻塞，不会影响策略主流程

  - **跨平台支持**：支持跨实盘、跨托管者、跨服务器进行数据传输

  - **多频道订阅**：单个实盘可同时订阅多个不同实盘的频道

  - **灵活的数据格式**：支持任何可JSON序列化的数据结构

  ### 应用场景

  - **主从策略协同**：主策略分析市场并广播信号，从策略接收信号并执行交易

  - **多账户同步**：在多个交易账户之间同步交易信号和仓位信息

  - **策略监控**：广播策略运行状态，由监控实盘订阅并进行展示或告警

  - **数据共享**：共享行情分析、指标计算等结果，避免重复计算

  ## 基本用法

### 广播端示例 - 发布市场数据

```javascript
function main() {
    var updateId = 0
    var robotId = _G()  // 获取当前实盘ID

    while(true) {
        // 获取市场数据
        var ticker = exchange.GetTicker("BTC_USDT")
        if (!ticker) {
            Sleep(5000)
            continue
        }

        // 准备频道状态数据
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

        // 在频道上发布最新状态(覆盖旧状态)
        SetChannelData(channelState)

        // 显示当前频道状态
        LogStatus("Channel Broadcaster [Bot ID: " + robotId + "]\n" +
                  "Update ID: #" + channelState.updateId + "\n" +
                  "Time: " + _D(channelState.timestamp) + "\n" +
                  "Symbol: " + channelState.symbol + "\n" +
                  "Last Price: $" + channelState.lastPrice.toFixed(2))

        Sleep(60000)  // 每分钟更新一次频道状态
    }
}
```

```python
def main():
    updateId = 0
    robotId = _G()  # 获取当前实盘ID

    while True:
        # 获取市场数据
        ticker = exchange.GetTicker("BTC_USDT")
        if not ticker:
            Sleep(5000)
            continue

        # 准备频道状态数据
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

        # 在频道上发布最新状态(覆盖旧状态)
        SetChannelData(channelState)

        # 显示当前频道状态
        LogStatus("Channel Broadcaster [Bot ID: {}]\n".format(robotId) +
                  "Update ID: #{}\n".format(channelState["updateId"]) +
                  "Time: {}\n".format(_D(channelState["timestamp"])) +
                  "Last Price: ${:.2f}".format(channelState["lastPrice"]))

        Sleep(60000)  # 每分钟更新一次频道状态
```

```rust
fn main() {
    let mut updateId = 0;
    let robotId = _G!();  // 获取当前实盘ID

    loop {
        // 获取市场数据
        let ticker = match exchange.GetTicker("BTC_USDT") {
            Ok(t) => t,
            Err(_) => {
                Sleep(5000);
                continue;
            }
        };

        // 准备频道状态数据
        // Rust 的 SetChannelData 只接受字符串参数，使用 format! 构造JSON文本
        updateId += 1;
        let timestamp = Unix() * 1000;
        let channelState = format!(
            r#"{{"robotId": {}, "updateId": {}, "timestamp": {}, "symbol": "BTC_USDT", "lastPrice": {}, "volume": {}, "high": {}, "low": {}}}"#,
            robotId, updateId, timestamp, ticker.Last, ticker.Volume, ticker.High, ticker.Low
        );

        // 在频道上发布最新状态(覆盖旧状态)
        SetChannelData(&channelState);

        // 显示当前频道状态
        LogStatus!(format!(
            "Channel Broadcaster [Bot ID: {}]\nUpdate ID: #{}\nTime: {}\nSymbol: BTC_USDT\nLast Price: ${:.2}",
            robotId, updateId, _D(timestamp), ticker.Last
        ));

        Sleep(60000);  // 每分钟更新一次频道状态
    }
}
```

### 订阅端示例 - 订阅多个频道

```javascript
function main() {
    // 获取需要订阅的两个频道 ID（请根据实际情况修改）
    var channelId1 = "632799"  // 频道 1 的实盘 ID
    var channelId2 = "632800"  // 频道 2 的实盘 ID

    while(true) {
        // 获取频道 1 的当前状态
        var state1 = GetChannelData(channelId1)

        // 获取频道 2 的当前状态
        var state2 = GetChannelData(channelId2)

        // 构建状态显示信息
        var statusMsg = "频道订阅端 - 当前订阅状态\n\n"

        // 显示频道 1 的状态
        statusMsg += "═══ 频道1 [" + channelId1 + "] ═══\n"
        if (state1 !== null) {
            statusMsg += "更新ID: #" + state1.updateId + "\n"
            statusMsg += "时间: " + _D(state1.timestamp) + "\n"
            statusMsg += "交易对: " + state1.symbol + "\n"
            statusMsg += "最新价: $" + state1.lastPrice.toFixed(2) + "\n"
        } else {
            statusMsg += "状态: 等待中... (首次调用返回 null)\n"
        }

        statusMsg += "\n"

        // 显示频道 2 的状态
        statusMsg += "═══ 频道2 [" + channelId2 + "] ═══\n"
        if (state2 !== null) {
            statusMsg += "更新ID: #" + state2.updateId + "\n"
            statusMsg += "时间: " + _D(state2.timestamp) + "\n"
            statusMsg += "最新价: $" + state2.lastPrice.toFixed(2) + "\n"
        } else {
            statusMsg += "状态: 等待中... (首次调用返回 null)\n"
        }

        LogStatus(statusMsg)

        Sleep(5000)  // 每 5 秒获取一次频道数据
    }
}
```

```python
def main():
    # 获取需要订阅的两个频道 ID（请根据实际情况修改）
    channelId1 = "632799"  # 频道 1 的实盘 ID
    channelId2 = "632800"  # 频道 2 的实盘 ID

    while True:
        # 获取频道 1 的当前状态
        state1 = GetChannelData(channelId1)

        # 获取频道 2 的当前状态
        state2 = GetChannelData(channelId2)

        # 构建状态显示信息
        statusMsg = "频道订阅端 - 当前订阅状态\n\n"

        # 显示频道 1 的状态
        statusMsg += "═══ 频道1 [{}] ═══\n".format(channelId1)
        if state1 is not None:
            statusMsg += "更新ID: #{}\n".format(state1["updateId"])
            statusMsg += "时间: {}\n".format(_D(state1["timestamp"]))
            statusMsg += "最新价: ${:.2f}\n".format(state1["lastPrice"])
        else:
            statusMsg += "状态: 等待中... (首次调用返回 None)\n"

        statusMsg += "\n"

        # 显示频道 2 的状态
        statusMsg += "═══ 频道2 [{}] ═══\n".format(channelId2)
        if state2 is not None:
            statusMsg += "更新ID: #{}\n".format(state2["updateId"])
            statusMsg += "时间: {}\n".format(_D(state2["timestamp"]))
            statusMsg += "最新价: ${:.2f}\n".format(state2["lastPrice"])
        else:
            statusMsg += "状态: 等待中... (首次调用返回 None)\n"

        LogStatus(statusMsg)

        Sleep(5000)  # 每 5 秒获取一次频道数据
```

```rust
fn main() {
    // Rust 的 GetChannelData() 函数不接受频道 ID 参数，无法订阅其他实盘的频道，
    // 只能读取当前实盘自身频道（即本实盘通过 SetChannelData() 发布）的最新数据
    loop {
        // 读取本实盘频道的当前状态
        let state = GetChannelData();

        // 构建状态显示信息
        let mut statusMsg = String::from("频道订阅端 - 当前订阅状态\n\n");

        if !state.is_null() {
            statusMsg += &format!("更新ID: #{}\n", state["updateId"].as_f64().unwrap_or(0.0));
            statusMsg += &format!("时间: {}\n", _D(state["timestamp"].as_i64().unwrap_or(0)));
            statusMsg += &format!("交易对: {}\n", state["symbol"].as_str().unwrap_or(""));
            statusMsg += &format!("最新价: ${:.2}\n", state["lastPrice"].as_f64().unwrap_or(0.0));
        } else {
            statusMsg += "状态: 等待中... (首次调用返回 null)\n";
        }

        LogStatus!(statusMsg);

        Sleep(5000);  // 每 5 秒读取一次频道数据
    }
}
```

## 实际应用场景

### 场景1：主从策略协同交易

**主策略（信号广播端）**

```javascript
function main() {
    var robotId = _G()
    Log("Main strategy started, Bot ID:", robotId)

    while(true) {
        // 分析市场行情，生成交易信号
        var records = exchange.GetRecords("BTC_USDT")
        if (!records || records.length < 20) {
            Sleep(5000)
            continue
        }

        // 简单的均线交叉策略
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

        // 广播交易信号
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
        # 分析市场行情，生成交易信号
        records = exchange.GetRecords("BTC_USDT")
        if not records or len(records) < 20:
            Sleep(5000)
            continue

        # 简单的均线交叉策略
        ma5 = TA.MA(records, 5)
        ma20 = TA.MA(records, 20)
        signal = "HOLD"

        if ma5[-1] > ma20[-1] and ma5[-2] <= ma20[-2]:
            signal = "BUY"
        elif ma5[-1] < ma20[-1] and ma5[-2] >= ma20[-2]:
            signal = "SELL"

        # 广播交易信号
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
        // 分析市场行情，生成交易信号
        let records = match exchange.GetRecords("BTC_USDT", None, None) {
            Ok(r) if r.len() >= 20 => r,
            _ => {
                Sleep(5000);
                continue;
            }
        };

        // 简单的均线交叉策略
        let ma5 = TA.MA(&records, 5);
        let ma20 = TA.MA(&records, 20);
        let n = ma5.len();
        let mut signal = "HOLD";

        if ma5[n - 1] > ma20[n - 1] && ma5[n - 2] <= ma20[n - 2] {
            signal = "BUY";
        } else if ma5[n - 1] < ma20[n - 1] && ma5[n - 2] >= ma20[n - 2] {
            signal = "SELL";
        }

        // 广播交易信号
        // Rust 的 SetChannelData 仅接受字符串参数，因此使用 format! 构造 JSON 文本
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

## 实际应用场景

### 场景1：主从策略协同交易

**从策略（信号接收执行端）**

```javascript
function main() {
    var masterRobotId = "632799"  // 主策略的实盘ID
    var lastSignal = null

    Log("Follower strategy started, subscribing to main strategy:", masterRobotId)

    while(true) {
        // 获取主策略的信号
        var signalData = GetChannelData(masterRobotId)

        if (signalData === null) {
            LogStatus("Waiting for main strategy signal...")
            Sleep(5000)
            continue
        }

        // 检查是否有新信号
        if (lastSignal !== signalData.signal) {
            Log("Received new signal:", signalData.signal, "Price:", signalData.price)

            // 执行交易
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
    masterRobotId = "632799"  # 主策略的实盘ID
    lastSignal = None

    Log("Follower strategy started, subscribing to main strategy:", masterRobotId)

    while True:
        # 获取主策略的信号
        signalData = GetChannelData(masterRobotId)

        if signalData is None:
            LogStatus("Waiting for main strategy signal...")
            Sleep(5000)
            continue

        # 检查是否有新信号
        if lastSignal != signalData["signal"]:
            Log("Received new signal:", signalData["signal"], "Price:", signalData["price"])

            # 执行交易
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
    // Rust 的 GetChannelData() 函数不接受频道 ID 参数，无法订阅主策略实盘的频道，
    // 只能读取当前实盘自身频道的最新数据（此处演示等价的信号处理逻辑）
    let mut lastSignal = String::new();

    Log!("Follower strategy started");

    loop {
        // 获取频道中的信号
        let signalData = GetChannelData();

        if signalData.is_null() {
            LogStatus!("Waiting for signal...");
            Sleep(5000);
            continue;
        }

        let signal = signalData["signal"].as_str().unwrap_or("").to_string();
        let price = signalData["price"].as_f64().unwrap_or(0.0);
        let symbol = signalData["symbol"].as_str().unwrap_or("BTC_USDT").to_string();

        // 检查是否有新信号
        if lastSignal != signal {
            Log!("Received new signal:", &signal, "Price:", price);

            // 执行交易
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

### 场景2：多策略状态监控

**监控策略**

```javascript
function main() {
    // 需要监控的策略实盘ID列表
    var monitorList = ["632799", "632800", "632801"]

    while(true) {
        var table = {
            type: "table",
            title: "策略运行状态监控",
            cols: ["实盘ID", "状态", "最后更新", "交易对", "当前价格", "盈亏"],
            rows: []
        }

        for (var i = 0; i < monitorList.length; i++) {
            var robotId = monitorList[i]
            var data = GetChannelData(robotId)

            if (data !== null) {
                var updateTime = _D(data.timestamp)
                var timeDiff = Date.now() - data.timestamp
                var status = timeDiff < 120000 ? "运行中" : "异常"

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
                    "等待数据",
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
    # 需要监控的策略实盘ID列表
    monitorList = ["632799", "632800", "632801"]

    while True:
        table = {
            "type": "table",
            "title": "策略运行状态监控",
            "cols": ["实盘ID", "状态", "最后更新", "交易对", "当前价格", "盈亏"],
            "rows": []
        }

        for robotId in monitorList:
            data = GetChannelData(robotId)

            if data is not None:
                updateTime = _D(data["timestamp"])
                timeDiff = time.time() * 1000 - data["timestamp"]
                status = "运行中" if timeDiff < 120000 else "异常"

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
                    "等待数据",
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
    // Rust 的 GetChannelData() 函数不接受频道 ID 参数，无法订阅其它实盘的频道进行监控，
    // 只能读取当前实盘自身频道的最新数据（此处演示等价的状态表格展示逻辑）
    loop {
        let data = GetChannelData();

        let row = if !data.is_null() {
            let timestamp = data["timestamp"].as_i64().unwrap_or(0);
            let updateTime = _D(timestamp);
            let timeDiff = Unix() * 1000 - timestamp;
            let status = if timeDiff < 120000 { "运行中" } else { "异常" };
            format!(
                r#"["{}", "{}", "{}", "{}"]"#,
                _G!(), status, updateTime,
                data["symbol"].as_str().unwrap_or("-")
            )
        } else {
            format!(r#"["{}", "等待数据", "-", "-"]"#, _G!())
        };

        // 构造表格JSON文本(Rust无JSON序列化,使用format!拼接)
        let table = format!(
            r#"{{"type": "table", "title": "策略运行状态监控", "cols": ["实盘ID", "状态", "最后更新", "交易对"], "rows": [{}]}}"#,
            row
        );

        LogStatus!(format!("`{}`", table));
        Sleep(10000);
    }
}
```

## API函数说明

### SetChannelData(data)

**功能**：在频道上发布最新的状态数据

**参数**：

- data：待发布的数据，可以是任意可进行JSON序列化的数据结构

**返回值**：无

**特性**：

- 非阻塞调用

- 覆盖此前的数据，不累积历史记录

- 自动使用当前实盘ID作为频道ID

**数据长度限制**：

- JSON序列化后不得超过1024字节

- 建议仅传输必要的状态信息

**详细文档**：[SetChannelData](/syntax-guide#fun_setchanneldata)

### GetChannelData(robotId)

**功能**：订阅指定实盘的频道数据

**参数**：

- robotId：待订阅的实盘ID（字符串或数字）

**返回值**：

- 首次调用返回null，需要重试

- 成功后返回该频道的最新数据

**特性**：

- 非阻塞调用

- 支持订阅多个频道

- 支持订阅自身的频道

**详细文档**：[GetChannelData](/syntax-guide#fun_getchanneldata)

## 注意事项

- **首次调用返回null**：```GetChannelData()```函数在首次调用时会返回```null```，这是正常现象，需要等待数据同步完成。建议在代码中进行null判断。

- **数据覆盖机制**：频道上仅保存最新状态，调用```SetChannelData()```会覆盖此前的数据。如需保存历史数据，应在订阅端自行记录。

- **非阻塞特性**：所有频道通信函数均为非阻塞调用，不会影响策略主流程的执行。但这也意味着无法保证数据的实时性。

- **数据大小限制**：传入SetChannelData的数据经JSON序列化后不得超过1024字节。应仅传输必要的状态信息，如交易信号、价格、持仓等关键数据，避免传输完整的K线数组或大量历史数据。

- **实盘环境限制**：频道通信功能主要适用于实盘环境，在回测系统中可能受限或不可用。

- **实盘ID获取**：可通过```_G()```函数获取当前实盘ID，也可在平台界面中查看实盘ID。

- **安全性考虑**：频道数据可能被其他具有相应权限的实盘订阅，请勿在频道中传输敏感信息（如API密钥等）。

## 最佳实践

- **合理的更新频率**：根据实际需求设置数据更新频率，避免因更新过于频繁而造成资源浪费。

- **数据结构设计**：设计清晰的数据结构，并包含必要的元数据（如时间戳、版本号等），以便于订阅端处理。

- **错误处理**：订阅端应处理null返回值，广播端应确保数据格式正确。

- **状态版本控制**：在数据中包含版本号或更新ID，帮助订阅端判断是否存在新数据。

- **监控与告警**：对于关键的通信链路，建议实现超时监控与告警机制。

- **测试验证**：在正式使用前，应先在测试环境中验证频道通信的稳定性与延迟。

- **文档记录**：记录频道数据格式与通信协议，以便于后续维护与多人协作。

See also: `SetChannelData`; `GetChannelData`; `_G`

### JavaScript多线程

发明者量化交易平台从系统底层真正支持```JavaScript```语言策略的多线程功能，实现了以下对象：

| 对象 | 说明 | 备注 |
| - | - | - |
| threading | 多线程全局对象 | 成员函数：```Thread```、```getThread```、```mainThread```等。 |
| Thread | 线程对象 | 成员函数：```peekMessage```、```postMessage```、```join```等。 |
| ThreadLock | 线程锁对象 | 成员函数：```acquire```、```release```。可作为线程执行函数的参数传入线程环境。 |
| ThreadEvent | 事件对象 | 成员函数：```set```、```clear```、```wait```、```isSet```。可作为线程执行函数的参数传入线程环境。 |
| ThreadCondition | 条件对象 | 成员函数：```notify```、```notifyAll```、```wait```、```acquire```、```release```。可作为线程执行函数的参数传入线程环境。 |
| ThreadDict | 字典对象 | 成员函数：```get```、```set```。可作为线程执行函数的参数传入线程环境。 |

发明者量化交易平台语法手册：[JavaScript多线程](https://www.fmz.com/syntax-guide/fun/threads)

### Web3

| 函数名称 | 简介 |
| - | - |
| [exchange.IO("abi", ...)](/syntax-guide#fun_exchange.ioabi-...) | 注册ABI接口 |
| [exchange.IO("api", "eth", ...)](/syntax-guide#fun_exchange.ioapi-eth-...) | 调用以太坊RPC方法 |
| [exchange.IO("encode", ...)](/syntax-guide#fun_exchange.ioencode-...) | 对函数调用进行编码 |
| [exchange.IO("encodePacked", ...)](/syntax-guide#fun_exchange.ioencodepacked-...) | 执行encodePacked编码 |
| [exchange.IO("decode", ...)](/syntax-guide#fun_exchange.iodecode-...) | 对数据进行解码 |
| [exchange.IO("key", ...)](/syntax-guide#fun_exchange.iokey-...) | 切换私钥 |
| [exchange.IO("api", ...)](/syntax-guide#fun_exchange.ioapi-...) | 调用智能合约方法 |
| [exchange.IO("address")](/syntax-guide#fun_exchange.ioaddress) | 获取当前配置的钱包地址 |
| [exchange.IO("base", ...)](/syntax-guide#fun_exchange.iobase-...) | 设置RPC节点地址 |

### TA指标库

| 函数名称 | 简介 |
| - | - |
| [TA.MACD](/syntax-guide#fun_ta.macd)           | 计算指数平滑异同移动平均线指标 |
| [TA.KDJ](/syntax-guide#fun_ta.kdj)             | 计算随机指标 |
| [TA.RSI](/syntax-guide#fun_ta.rsi)             | 计算相对强弱指标 |
| [TA.ATR](/syntax-guide#fun_ta.atr)             | 计算真实波动幅度均值指标 |
| [TA.OBV](/syntax-guide#fun_ta.obv)             | 计算能量潮指标 |
| [TA.MA](/syntax-guide#fun_ta.ma)               | 计算移动平均线指标 |
| [TA.EMA](/syntax-guide#fun_ta.ema)             | 计算指数移动平均线指标 |
| [TA.BOLL](/syntax-guide#fun_ta.boll)           | 计算布林带指标 |
| [TA.Alligator](/syntax-guide#fun_ta.alligator) | 计算鳄鱼线指标 |
| [TA.CMF](/syntax-guide#fun_ta.cmf)             | 计算蔡金资金流量指标 |
| [TA.Highest](/syntax-guide#fun_ta.highest)     | 计算指定周期内的最高价 |
| [TA.Lowest](/syntax-guide#fun_ta.lowest)       | 计算指定周期内的最低价 |
| [TA.SMA](/syntax-guide#fun_ta.sma)             | 计算简单移动平均线指标 |

### talib指标库

talib指标库包含众多技术分析指标，例如：[talib.CDL2CROWS](/syntax-guide#fun_talib.cdl2crows)。详细信息请参阅语法手册。

## 模板类库

**模板类库**是发明者量化交易平台中可复用的代码模块，属于策略代码的一种类别。发明者量化交易平台支持模板类库功能的编程语言包括：```JavaScript```、```Python```、```C++```、```Blockly可视化```。创建策略时，如果将类别设置为模板类库，系统会在发明者量化交易平台当前登录账号的策略库中创建一个模板类库。创建后，该类别无法再修改为普通策略。

![创建模板类库页面](https://www.fmz.com/upload/asset/2e4c55da99fd457ca94a0.png)

### 模板类库的导出函数

导出函数是模板类库的接口函数，可被引用该模板类库的策略调用。

不同编程语言的模板类库编写格式有所不同，以下是导出函数在模板类库中声明和实现的示例代码：

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

```Blockly可视化```方式编写的策略可通过```JavaScript```语言的模板类库实现类库功能，请使用以下格式编写。

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

### 模板类库的参数

模板类库也可以设置自己的界面参数，模板类库的参数在模板类库代码中以全局变量的形式使用。

例如，我们设置了一个模板类库的参数：

![模板参数](https://www.fmz.com/upload/asset/2e4ab550b85e6a1cac08e.png)

| 策略代码中参数的变量名 | 策略界面上显示的参数名称 | 类型 | 默认值 |
| - | - | - | - |
| param1 | 模板参数1 | 数字型(number) | 99 |

用于测试```param1```参数的模板类库代码：

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

引用上述模板类库示例的策略代码，使用模板类库的导出函数获取参数```param1```并修改参数```param1```。

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

### 引用模板类库

策略引用模板类库时，需要当前登录的发明者量化交易平台账号的策略库中存在可用的模板类库。在[策略编辑页面](https://www.fmz.com/m/add-strategy)的模板栏中勾选需要引用的模板，保存策略后即可完成引用。

![模板引用截图](https://www.fmz.com/upload/asset/2e4ee2ec7b3e7b1649af8.png)

## 策略参数

策略界面上设置的参数在策略代码中以全局变量的形式存在。```JavaScript```、```C++```、```My语言```策略代码可以直接访问和修改策略界面上设置的参数值。```Python```策略在函数中修改全局变量或策略界面参数时需要使用```global```关键字。```PINE```语言使用```input()```函数创建界面参数。```Blockly可视化```方式设计的策略不支持界面参数。

![策略参数设置界面](https://www.fmz.com/upload/asset/2e46b5e593de3b2f11445.png)

### 界面参数种类

| 变量(命名举例) | 描述 | 类型 | 默认值(说明) | 组件配置(说明) | 备注 |
| - | - | - | - | - | - |
| pNum       | 参数pNum的描述       | 数字型(number)     | 举例：设置默认值为100，C++策略中为浮点型| 用于设置当前参数绑定的界面控件：组件类型、最小值、最大值、分组、过滤器等 | 参数pNum的备注信息，pNum的值为数值类型 |
| pBool      | 参数pBool的描述      | 布尔型(true/false) | 使用开关控件设置默认值，不支持选填控件 | 同上                                                          | 参数pBool的备注信息，pBool的值为布尔类型 |
| pStr       | 参数pStr的描述       | 字符串(string)     | 举例：设置默认值为abc               | 同上                                                          | 参数pStr的备注信息，pStr的值为字符串类型 |
| pCombox    | 参数pCombox的描述    | 下拉框(selected)   | 设置选项中的一个或多个选项      | 同上                                                          | 参数pCombox的备注信息，pCombox的值可能有多种形式 |
| pSecretStr | 参数pSecretStr的描述 | 加密串(string)     | 举例：设置默认值为xyz               | 同上                                                          | 参数pSecretStr的备注信息，pSecretStr的值为字符串类型 |

界面参数在策略编辑页面代码编辑区下方的策略参数区进行设置，需要注意以下几点：
1、参数设置的默认值选项中，「选填」控件默认为选填状态，可以更改该控件的状态，将当前参数设置为必填。设置参数为必填后，如果策略在回测或实盘时未设置该参数，则无法进行回测或启动实盘。
2、界面参数在策略代码中的变量名不应使用当前编程语言的保留字（关键字）。
3、在回测或实盘界面，将鼠标悬停在参数绑定的控件上时，会显示该参数的备注信息。
4、参数的「描述」即为参数绑定控件的显示名称。
5、参数的「变量」即上表中的：```pNum```、```pBool```、```pStr```、```pCombox```、```pSecretStr```。在策略代码中以全局变量形式存在，因此可以在代码中修改策略参数的值。
6、对于「加密串」和「字符串」类型的参数，输入默认值时无需添加引号，所有输入均作为字符串处理。「加密串」参数的使用方式与「字符串」参数相同，但加密字符串会被加密传输，不会以明文形式发送。
7、「字符串」类型的参数如果设置为「选填」，当参数绑定的控件中未填写参数时，参数变量的值为**空字符串**；
  同理，「数字型」参数的值为**空值**；
  同理，「下拉框」参数的值为**空值**；
  同理，「加密串」参数的值为**空值**。
8、对于下拉框类型的界面参数（例如变量名为```pCombox```），在「组件配置」中未开启「支持多选」时，pCombox的值为当前选中选项的索引或具体数据（当给选项绑定数据时）。
  如果开启了「支持多选」，pCombox的值为一个数组，包含所有当前选中选项的索引或具体数据（当给选项绑定数据时）。

### 组件配置

策略界面参数的「组件配置」选项用于设置平台上5种参数类型对应的控件，增强功能并简化设计。

5种界面参数支持的组件类型：
- 数字型（number）参数
  支持的组件类型：输入框控件（默认）、时间选择器控件、滑动输入条控件。
- 布尔型（true/false）参数
  仅支持开关控件（默认）。
- 字符串（string）参数
  支持的组件类型：输入框控件（默认）、文本框控件、时间选择器控件、颜色选择器控件、币种选择器、交易代码选择器。
- 下拉框（selected）参数
  支持的组件类型：下拉框控件（默认）、分段控制器控件、币种选择器、交易代码选择器。
- 加密串（string）参数
  仅支持加密输入框控件（默认）。

除了设置界面参数对应的控件类型外，还可以设置界面参数的分组和过滤。
- 分组
  在组件配置的「分组」输入框中，可以输入一个标签名称，将若干个策略界面参数划分到同一个分组标签中（替代平台旧功能「策略分组」）。
- 过滤器
  在组件配置的「过滤器」输入框中，可以输入过滤判定的表达式，控制界面参数是否生效（替代平台旧功能「参数依赖」）。
  过滤器默认为空，不进行任何参数条件过滤；可以设置：```a > b```、```a == 1```、```a```、```!a```、```a >= 1 && a <= 10```、```a > b```等。当过滤器条件为真时，当前参数可用。
  - 当某个参数设置了过滤器```a == 1```时，该参数的可用性依赖于参数```a```的取值。当参数```a```等于1时该参数可用，否则该参数不可用。
  - 当某个参数设置了过滤器```a >= 1 && a <= 10```时，表示过滤条件为：a大于等于1且a小于等于10。符合此条件时参数可用，否则参数不可用。
  - 当某个参数设置了过滤器```!a```时，表示过滤条件为：非a；a可以是布尔值，也可以是数值（!0表示真值）。

### 保存参数设置

- 回测系统中的参数保存
  在回测时，如果希望保存策略参数，可以在修改策略参数后点击「保存回测设置」按钮，具体可参考回测系统的[「保存回测设置」](/user-guide/回测系统/保存回测设置)。

  | 变量 | 描述 | 类型 | 默认值 |
  | - | - | - | - |
  |number |数值类型 |数字型(number) |1 |
  |string |字符串 |字符串(string) |Hello FMZ |
  |combox |下拉框 |下拉框(selected) |1\|2\|3|
  |bool |布尔值 |布尔型(true/false) |true |
  |numberA@isShowA |数值A |数字型(number) |2 |
  |isShowA |是否显示 numberA 参数 |布尔型(true/false) |false |

  设置后的策略参数会以代码形式保存在策略中，例如：

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
- 实盘参数导入导出
  运行实盘时如需保存实盘配置的参数数据，可以在策略实盘页面中点击「参数设置」选项，再点击「导出参数」按钮，导出的策略参数将以```json```文件形式保存。
  导出的策略参数配置也可以再次导入实盘，点击「导入参数」按钮即可将保存的策略实盘参数导入到当前实盘，导入后点击「更新参数」按钮即可保存生效。

## 交互控件

```JavaScript```、```Python```、```Rust```、```C++```、My语言策略均可设计交互控件。策略的交互控件用于在策略实盘运行时向正在运行的策略程序发送交互指令。对于```JavaScript```、```Python```、```Rust```、```C++```语言类型的策略，可在策略代码中使用[```GetCommand()```](https://www.fmz.com/syntax-guide#fun_getcommand)函数获取交互控件产生的消息。

![交互控件](https://www.fmz.com/upload/asset/2e4320d0cc33c15eb935d.png)

在策略中编写好处理交互控件消息的代码后，实盘运行时使用交互控件即可实现（但不限于）以下功能：

- 手动平掉策略持仓。

- 动态修改策略参数，无需重启策略实盘。

- 切换策略逻辑。

- 触发打印某些调试信息或数据，用于测试特定功能。

### 交互控件种类

| 变量(命名举例) | 描述 | 类型 | 默认值(说明) | 组件配置(说明) | 备注 |
| - | - | - | - | - | - |
| cmdNum | 交互控件cmdNum的描述 | 数字型(number) | 默认值选填，可留空 | 用于设置当前交互项绑定的界面控件的组件类型、最小值、最大值、分组等 | 交互控件cmdNum的备注 |
| cmdBool | 交互控件cmdBool的描述 | 布尔型(true/false) | 默认值必填，开启或关闭 | 同上 | 交互控件cmdBool的备注 |
| cmdStr | 交互控件cmdStr的描述 | 字符串(string) | 默认值选填，可留空 | 同上 | 交互控件cmdStr的备注 |
| cmdCombox | 交互控件cmdCombox的描述 | 下拉框(selected) | 默认值选填，可留空 | 同上 | 交互控件cmdCombox的备注 |
| cmdBtn | 交互控件cmdBtn的描述 | 按钮(button) | 按钮控件不绑定输入项 | 同上 | 交互控件cmdBtn的备注 |

交互控件触发后发送给策略的消息（字符串）：
- 数字型
  在交互控件```cmdNum```的输入框中输入交互数据```123```后，点击交互控件cmdNum的按钮。策略程序中的```GetCommand()```函数将收到消息：```cmdNum:123```。
- 布尔型
  在交互控件```cmdBool```的开关控件上设置为打开，点击交互控件cmdBool的按钮。策略程序中的```GetCommand()```函数将收到消息：```cmdBool:true```。
- 字符串
  在交互控件```cmdStr```的输入框中输入交互数据```abc```后，点击交互控件cmdStr的按钮。策略程序中的```GetCommand()```函数将收到消息：```cmdStr:abc```。
- 下拉框
  在交互控件```cmdCombox```的下拉框中选中第二个选项后，点击交互控件cmdCombox的按钮。策略程序中的```GetCommand()```函数将收到消息：```cmdCombox:1```，其中1表示所选选项的索引，第一个选项索引为0，第二个选项索引为1。
- 按钮
  点击交互控件```cmdBtn```的按钮。策略程序中的```GetCommand()```函数将收到消息：```cmdBtn```。

交互控件的应用：动态修改策略参数
例如，策略有一个参数为symbol，在策略界面上添加的策略参数也是全局变量，因此这里使用代码中的全局变量作为演示。

```js
// 策略参数
var symbol = "BTC_USDT"

function main() {
    while (true) {
        var cmd = GetCommand()
        if (cmd) {
            var arr = cmd.split(":")
            if (arr.length == 2 && arr[0] == "changeSymbol") {
                // 检测到 changeSymbol 控件触发，就会执行参数更新操作
                Log("Changed symbol parameter to:", arr[1])
                symbol = arr[1]
            }
        }

        LogStatus(_D(), ", Current symbol parameter value:", symbol)
        Sleep(3000)
    }
}
```

设置交互控件：

/upload/asset/1741a2b35e569c5e07e3.png

### 组件配置

策略交互控件的「组件配置」选项用于设置平台上5种交互控件类型对应的控件，增强功能并简化设计。

5种交互控件支持的组件类型：
- 数字型(number)交互控件
  支持的组件类型：输入框控件（默认）、时间选择器控件、滑动输入条控件。
- 布尔型(true/false)交互控件
  仅支持开关控件（默认）。
- 字符串(string)交互控件
  支持的组件类型：输入框控件（默认）、文本框控件、时间选择器控件、颜色选择器控件、币种选择器、交易代码选择器。
- 下拉框(selected)交互控件
  支持的组件类型：下拉框控件（默认）、分段控制器控件、币种选择器、交易代码选择器。
- 按钮(button)交互控件
  仅支持按钮控件（默认），无输入项控件。

交互控件与界面参数设置相同，均支持分组功能。在组件配置中可进行分组设置。
- 分组
  在组件配置的「分组」输入框中，可以输入标签名称，将多个策略交互控件划分到同一分组标签下（此功能替代平台原有的「交互控件分组」功能）。

### 状态栏中的交互控件

除了在「策略交互」栏中设计交互控件，还可以在策略状态栏中设计交互控件。目前支持的交互控件类型仅有按钮类型，可以参考[「语法手册」中```LogStatus```函数章节](https://www.fmz.com/syntax-guide#fun_logstatus)。

状态栏中的按钮控件可以分为：
- 普通按钮控件
  数据结构示例：
  ```json
  {"type": "button", "name": "Button 1", "cmd": "button1", "description": "This is the first button"}
  ```
- 带单个输入数据的按钮控件
  使用```input```属性设置输入控件选项，数据结构示例：
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
- 带一组输入数据的按钮控件
  使用```group```属性设置一组输入控件的选项，数据结构示例：
  ```json
  {
      "type": "button",
      "cmd": "open",
      "name": "Open",
      "group": [
          {"name": "orderType", "description": "下单方式|order type", "type": "selected", "defValue": "市价单|挂单"},
          {"name": "tradePrice@orderType==1", "description": "交易价格|trade price", "type": "number", "defValue": 100},
          {"name": "orderAmount", "description": "委托数量|order amount", "type": "string", "defValue": 100},
          {"name": "boolean", "description": "是/否|boolean", "type": "boolean", "defValue": true}
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

将这些按钮控件的JSON数据编码为JSON字符串，然后使用``` ` ```字符包裹，在状态栏中输出。以JavaScript语言为例：

```js
function main() {
    var btn = {"type": "button", "name": "Button 1", "cmd": "button1", "description": "This is the first button"}
    LogStatus("`" + JSON.stringify(btn) + "`")
}
```

这些按钮控件也可以写入状态栏表格中，详细示例请参阅[语法手册](https://www.fmz.com/syntax-guide#fun_logstatus)。

```input```字段结构与```group```字段中单个控件结构一致，以下为详细说明：

```desc
{
    "type": "selected",     // 控件类型（必填字段），支持设置为：number、string、selected、boolean
    "name": "test",         // 名称（在group中使用时为必填字段）
    "label": "topic",       // 标题（必填字段）
    "description": "desc",  // 组件的提示信息
    "default": 1,           // 默认值；当前JSON结构中如果不设置settings字段，兼容defValue，可以用defValue代替default
    "filter": "a>1",        // 选择器，不设置该字段表示不过滤（显示控件）；设置该字段时，当表达式为真时不过滤（显示控件），当表达式为假时过滤（不显示控件）
                            // 对于选择器，以当前示例中表达式a>1为例，a指的是type=button结构中group字段下name为a的控件值，根据此数值判断是否过滤
    "group": "group1",      // 分组
    "settings": { ... },    // 组件配置
}
```

组件配置```settings```各字段详细说明：
- ```settings.required```：是否必填。
- ```settings.disabled```：是否禁用。
- ```settings.min```：```type=number```时有效，表示最小值或字符串最小长度。
- ```settings.max```：```type=number```时有效，表示最大值或字符串最大长度。
- ```settings.step```：```type=number```且```render=slider```时有效，表示步长。
- ```settings.multiple```：```type=selected```时有效，表示支持多选。
- ```settings.customizable```：```type=selected```时有效，表示支持自定义；用户可以直接在下拉框控件中编辑添加新选项，如果选中新编辑的选项，触发交互时将使用该选项的名称而非选项代表的值。
- ```settings.options```：```type=selected```时有效，表示选择器的选项数据格式：```["Option 1", "Option 2"]```、```[{'name':'xxx','value':0}, {'name':'xxx','value':1}]```。
- ```settings.render```：渲染组件类型。
  ```type=number```时，```settings.render```不设置（默认为数字输入框），可选：```slider```（滑动条）、```date```（时间选择器，返回时间戳）。
  ```type=string```时，```settings.render```不设置（默认为单行输入框），可选：```textarea```（多行输入）、```date```（时间选择器，返回yyyy-MM-dd hh:mm:ss）、```color```（颜色选择器，返回#FF00FF）。
  ```type=selected```时，```settings.render```不设置（默认为下拉框），可选：```segment```（分段选择器）。
  ```type=boolean```时，目前仅有默认复选框。

支持双语设置，例如：```'选项｜options'```文本内容会根据当前语言环境自动适配；以```group```字段中单个控件为例，完整示例：

```json
{
    type:'selected',
    name:'test',
    label:'选项｜options',
    description:'描述｜description',
    default:0,                            // 此处default默认值设置为0，表示{name:'xxx|yyy',value:0}选项中的value值
    filter:'a>1&&a<10',
    group:'分组|group',
    settings:{
        multiple:true,
        customizable:true,
        options:[{name:'xxx|yyy',value:0}]
    }
}
```

## 期权交易

发明者量化交易平台支持加密货币期权交易。

### 加密货币期权

使用```exchange.SetContractType()```函数设置期权合约，不同交易所的期权合约代码格式各不相同。发明者量化交易平台支持的加密货币期权交易所如下：

- Futures_Deribit
  对于```Deribit```交易所，只需调用```exchange.SetContractType()```函数将合约设置为期权合约即可。设置期权合约后，调用```GetTicker()```等行情接口时，获取的均为该期权合约的行情数据。
  下单使用```exchange.Sell()```、```exchange.Buy()```函数，下单时需注意交易方向，可使用```exchange.SetDirection()```函数设置交易方向。
  撤单使用```exchange.CancelOrder()```函数，查询持仓使用```exchange.GetPositions()```函数。

  可供参考的策略代码：[Deribit期权测试策略](https://www.fmz.com/strategy/179475)
  期权合约代码示例：```BTC-13SEP24-60000-C```、```XRP_USDC-27SEP24-1-C```、```BTC-CS-6SEP24-57000_57500```、```BTC-PCAL-20SEP24_13SEP24-55000```等。
- Futures_OKX
  设置合约、下单、撤单、查询订单、获取行情等操作与```Deribit```相同，合约代码形式为```BTC-USD-200626-4500-C```。
  可通过```https://www.okx.com/api/v5/public/instruments```接口查询合约相关信息。

  例如，查询BTC期权合约的信息：
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
  火币期权合约代码示例：```BTC-USDT-201225-P-13000```，其中合约标的为```BTC```，行权日为2020年12月25日，期权类型为看跌期权（PUT），行权价格为13000美元。
  看涨期权：买方支付的权利金为USDT，使用账户资产中的USDT；卖方保证金为币，使用账户资产中的币作为担保。
  看跌期权：买方支付的权利金为USDT，使用账户资产中的USDT；卖方保证金为USDT，使用账户资产中的USDT作为担保。
- Futures_Bybit
  支持Bybit交易所的USDC期权，交易对设置为```ETH_USDC```，调用```exchange.SetContractType()```函数将合约设置为期权合约即可。
  期权合约代码示例：```ETH-25NOV22-1375-P```。
- Futures_Aevo
  支持Aevo交易所的USDC期权，期权合约代码示例：```ETH-30JUN23-1600-C```。
- Futures_GateIO
  支持GATE.IO交易所的USDT期权，期权合约代码示例：```BTC_USDT-20211130-65000-C```

## Rust策略编写说明

1、使用```Rust```编写策略与使用```JavaScript```编写策略的区别，主要在于平台API函数返回数据形式的不同，例如```exchange.GetTicker()```函数：
- JavaScript
  ```exchange.GetTicker()```调用成功时返回一个对象；若调用失败（如交易所服务器问题、网络问题等）则返回```null```。

  ```js
  function main() {
      var ticker = exchange.GetTicker()
      // 判断exchange.GetTicker函数是否调用失败（返回null）
      if (ticker) {
          Log(ticker)
      }
  }
  ```
- Rust
  可能失败的API调用统一返回```Result<T>```类型，可采用Rust惯用的方式处理错误：

  ```rust
  fn main() {
      // 方式一：模式匹配，判断exchange.GetTicker函数是否调用成功
      if let Ok(ticker) = exchange.GetTicker(None) {
          Log!(ticker);
      }

      // 方式二：使用_C!宏自动重试，直到调用成功返回
      let ticker = _C!(exchange.GetTicker(None));
      Log!(ticker);
  }
  ```
  可选参数（例如```GetTicker```的```symbol```参数）在不传时使用```None```占位，需要传值时直接传入，例如```exchange.GetTicker("BTC_USDT")```。

2、策略入口与生命周期：Rust策略的入口为```fn main()```（与标准Rust程序的入口同名，但由平台调用，且无返回值）。与JavaScript一样，可以选择性地定义```fn init()```（策略开始运行时首先自动执行）和```fn onexit()```（策略退出时执行扫尾工作），引导层会自动调用；此外，也可以在策略代码中调用```OnExit()```注册额外的退出钩子：

```rust
fn main() {
    // 策略逻辑...
}

fn init() {
    Log!("初始化");
}

fn onexit() {
    Log!("策略退出，执行扫尾处理");
}
```

3、日志与全局功能以宏的形式提供：```Log!()```、```LogStatus!()```、```Panic!()```、```_G!()```、```_C!()```等为Rust宏（注意末尾的感叹号）；而```LogProfit()```、```Sleep()```、```_D()```、```_N()```、```HttpQuery()```等则为普通函数。

4、策略参数注入为全局常量：界面上配置的策略参数按其值类型注入策略代码（number对应```f64```、boolean对应```bool```、string/密码对应```&str```、下拉框按其选项值类型），可直接以参数名引用。若需用作整数，请自行转换，例如```let n = Period as usize;```。完整的参数集可通过```params()```函数获取JSON文本后自行解析。

5、JSON数据处理：平台API返回的原始JSON文本（例如```exchange.IO()```的返回值、各结构体的```Info```字段）可使用内置的```JSONParse()```函数解析为```JsonValue```，并以```v["key"]```、```v[0]```的形式进行索引导航，再通过```as_f64()```、```as_str()```、```as_bool()```等方法获取标量值。由于SDK未内置JSON序列化功能，构造JSON文本时可使用```format!```宏拼接，或引入第三方crate（如```serde_json```）。

6、第三方crate与TLS注意事项：策略源码是唯一的代码文件，需在源码最顶部用```---```包裹的```[dependencies]``` frontmatter中声明依赖（详见「编程语言 - Rust」一节）。由于编译沙盒中没有系统OpenSSL，对于需要TLS的crate，请选择纯Rust实现的```rustls```，避免依赖```native-tls```/```openssl-sys```；WebSocket连接则优先使用内置的```Dial()```函数。

## C++策略编写说明

1、使用```C++```编写策略与```JavaScript```编写策略的主要区别在于发明者量化交易平台的API函数返回数据的差异，例如```exchange.GetTicker()```函数：
- JavaScript
  ```exchange.GetTicker()```调用成功时返回一个对象，如果调用失败（如交易所服务器问题、网络问题等）返回```null```。

  ```js
  function main() {
      var ticker = exchange.GetTicker()
      // 判断exchange.GetTicker函数是否调用失败，返回null
      if (ticker){
          Log(ticker)
      }
  }
  ```
- C++
  ```exchange.GetTicker()```调用成功时返回一个对象，调用失败时返回的仍然是一个对象。成功调用与失败调用返回的对象通过```Valid```属性来区分。

  ```cpp
  void main() {
      auto ticker = exchange.GetTicker();
      // 判断exchange.GetTicker()函数是否调用失败，检查返回对象中Valid属性是否为false
      if (ticker.Valid) {
          Log(ticker);
      }
  }
  ```
2、```C++```策略中的```main()```函数与标准C11中```main()```函数的区别：
C11中的C++程序入口函数```main()```返回值为```int```类型，而在FMZ量化的C++策略中，策略的启动函数也是```main()```函数。但这两者并非同一个函数，仅是同名而已。FMZ量化的C++策略中```main()```函数的返回值为```void```类型。

```cpp
void main() {
    // 使用Test函数测试
    if (!Test("c++")) {
        // 抛出异常，终止程序运行
        Panic("请下载最新版本托管者");
    }

    // 所有返回的对象使用Valid属性判断是否有效
    LogProfitReset();
    LogReset();
    Log(_N(9.12345, 2));
    Log("use _C", _C(exchange.GetTicker), _C(exchange.GetAccount));
}
```

## JavaScript策略编写说明

由于```JavaScript```语言自身的特性（JavaScript语言内置字符串仅支持ASCII与UTF-16编码，为避免数据丢失），当遇到无法编码的字符串时会返回```ArrayBuffer```类型。FMZ量化平台的所有API接口中，可以传入字符串参数的地方均支持传入```ArrayBuffer```类型。

以下示例详细说明了这一特性：
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
    const inputString = "abc𠮷123";  // 此"𠮷"字符的Unicode码点超出了16位范围
    // const inputString = "abcG123"; // 如果使用abcG123字符串测试，则变量outputD不会被赋值为ArrayBuffer

    // 使用Encode函数将inputString编码为十六进制编码
    const encodedHex = Encode("raw", "string", "hex", inputString);
    Log(encodedHex);  // 内容为：61 62 63 f0a0aeb7 31 32 33

    // 使用自定义的stringToHex函数编码，由于无法处理"𠮷"字符，导致十六进制编码错误
    const manuallyEncodedHex = stringToHex(inputString);
    Log(manuallyEncodedHex);  // 内容为：61 62 63 d842dfb7 31 32 33

    // 成功从十六进制编码还原为字符串（变量inputString）
    const decodedString = Encode("raw", "hex", "string", encodedHex);
    Log(decodedString);

    // 无法解码，返回ArrayBuffer，即变量outputD为ArrayBuffer类型
    const outputD = Encode("raw", "hex", "string", manuallyEncodedHex);
    Log(outputD);

    // 验证返回的ArrayBuffer类型变量outputD
    const bufferD = new Uint8Array(outputD);
    let hexBufferD = '';
    for (let i = 0; i < bufferD.length; i++) {
        hexBufferD += bufferD[i].toString(16).padStart(2, '0');
    }
    Log(hexBufferD);    // 61 62 63 d842dfb7 31 32 33
}
```

## Web3

发明者量化交易平台支持```Web3```相关功能，可轻松接入加密货币市场的```DeFi```交易所。

### 以太坊

在发明者量化交易平台，通过```exchange.IO()```函数编写策略代码，实现以太坊链上RPC方法调用和智能合约交互。

#### Web3交易所对象配置

需要在发明者量化交易平台上配置接入节点。接入节点可以是自建节点或使用第三方服务，例如：```infura```。在发明者量化交易平台的[「交易所」](https://www.fmz.com/m/add-platform)页面，选择协议：**加密货币**，然后选择交易所为```Web3```。

配置```Rpc Address```（接入节点的服务地址）和```Private Key```（私钥）。支持私钥本地化部署，详情请参考[「密钥安全性」](/user-guide/密钥安全性)。

#### 注册ABI

调用合约时，如果使用标准的```ERC20```方法，则无需注册即可直接调用。调用标准合约以外的方法需要先注册ABI内容：```exchange.IO("abi", tokenAddress, abiContent)```。

获取合约的ABI内容可以通过以下URL获取，仅需提取```result```字段。

```url
https://api.etherscan.io/api?module=contract&action=getabi&address=0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45
```

#### 调用以太坊RPC方法

使用```exchange.IO()```函数调用以太坊RPC方法。
- 查询钱包中ETH余额
  ```
  exchange.IO("api", "eth", "eth_getBalance", owner, "latest")   // owner为具体的钱包地址
  ```
- ETH转账
  ```
  exchange.IO("api", "eth", "send", toAddress, toAmount)   // toAddress为接收ETH的钱包地址，toAmount为转账数量
  ```
- 查询Gas价格
  ```
  exchange.IO("api", "eth", "eth_gasPrice")
  ```
- 查询预估Gas费用
  ```
  exchange.IO("api", "eth", "eth_estimateGas", data)
  ```

#### 支持encode

```exchange.IO()```函数封装了```encode```方法，可以将函数调用编码为```hex```字符串格式并返回。具体用法可以参考平台公开的[「Uniswap V3 交易类库」模板](https://www.fmz.com/strategy/397260)。

以下以编码```unwrapWETH9```方法的调用为例：
```js
function main() {
    // ContractV3SwapRouterV2 主网地址 : 0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45
    // 调用unwrapWETH9方法前需要先注册ABI，此处省略注册步骤
    // "owner"代表钱包地址，需要填写实际地址；1代表解包装数量，即把1个WETH解包装为ETH
    var data = exchange.IO("encode", "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45", "unwrapWETH9(uint256,address)", 1, "owner")
    Log(data)
}
```

调用```exchange.IO("encode", ...)```函数时，如果第二个参数（字符串类型）以```0x```开头，表示对智能合约的方法调用进行编码（encode）。
如果第二个参数不以```0x```开头，则表示按指定的类型顺序对数据进行编码，功能等同于```solidity```中的```abi.encode```，可参考以下例子。

```js
function main() {
    var x = 10
    var address = "0x02a5fBb259d20A3Ad2Fdf9CCADeF86F6C1c1Ccc9"
    var str = "Hello World"
    var array = [1, 2, 3]
    var ret = exchange.IO("encode", "uint256,address,string,uint256[]", x, address, str, array)   // uint 即 uint256 , FMZ上需要明确指定类型长度
    Log("ret:", ret)
    /*
    000000000000000000000000000000000000000000000000000000000000000a    // x
    00000000000000000000000002a5fbb259d20a3ad2fdf9ccadef86f6c1c1ccc9    // address
    0000000000000000000000000000000000000000000000000000000000000080    // str 的偏移量
    00000000000000000000000000000000000000000000000000000000000000c0    // array 的偏移量
    000000000000000000000000000000000000000000000000000000000000000b    // str 的长度
    48656c6c6f20576f726c64000000000000000000000000000000000000000000    // str 的数据
    0000000000000000000000000000000000000000000000000000000000000003    // array 的长度
    0000000000000000000000000000000000000000000000000000000000000001    // array 的第一个元素
    0000000000000000000000000000000000000000000000000000000000000002    // array 的第二个元素
    0000000000000000000000000000000000000000000000000000000000000003    // array 的第三个元素
    */
}
```

支持对元组（tuple）或者包含元组的类型顺序进行编码：
```js
function main() {
    var types = "(uint256,uint8,address),bytes"
    var ret = exchange.IO("encode", types, [30, 20, "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"], "0011")
    Log("encode: ", ret)
}
```

该类型顺序由```tuple```和```bytes```组成，因此调用```exchange.IO()```函数进行```encode```时，需要继续传入两个参数：
- 对应tuple类型的变量：
  ```json
  [30, 20, "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"]
  ```
  元组的值以数组形式按位置传入，元素的个数、顺序和类型必须与```types```参数中的```(uint256,uint8,address)```一致。字面量元组没有字段名，解码时各字段按位置依次命名为```Field1```、```Field2```……
- 对应bytes类型的变量：
  ```string
  "0011"
  ```

支持对数组或者包含数组的类型顺序进行编码：
```js
function main() {
    var path = ["0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2", "0xdac17f958d2ee523a2206206994597c13d831ec7"]   // ETH address, USDT address
    var ret = exchange.IO("encode", "address[]", path)
    Log("encode: ", ret)
}
```

#### 支持encodePacked

例如在```Uniswap V3```这个去中心化交易所的方法调用时，需要传入兑换路径等参数，就需要使用```encodePacked```操作：
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

#### 支持decode

数据处理不仅支持编码（encode），还支持解码（decode）。可使用```exchange.IO("decode", types, rawData)```函数执行```decode```操作。
```js
function main() {
    // register SwapRouter02 abi
    var walletAddress = "0x398a93ca23CBdd2642a07445bCD2b8435e0a373f"
    var routerAddress = "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45"
    var abi = `[{"inputs":[{"components":[{"internalType":"bytes","name":"path","type":"bytes"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"uint256","name":"amountInMaximum","type":"uint256"}],"internalType":"struct IV3SwapRouter.ExactOutputParams","name":"params","type":"tuple"}],"name":"exactOutput","outputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"}],"stateMutability":"payable","type":"function"}]`
    exchange.IO("abi", routerAddress, abi)   // 此处abi仅包含exactOutput方法的部分内容，完整的abi可自行在网上查询

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

该示例首先对```path```参数进行```encodePacked```编码，因为后续需要编码的```exactOutput```方法调用要以```path```作为参数。随后对路由合约的```exactOutput```方法进行```encode```编码，该方法只有一个参数，其类型为```tuple```。
方法名```exactOutput```编码后为```0x09b81346```。使用```exchange.IO("decode", ...)```方法按```(bytes,address,uint256,uint256)```类型解码得到```decodeRaw```，其字段按位置依次编号为```Field1```～```Field4```，各字段的值与变量```dataTuple```中的内容依次对应。

#### 支持切换私钥

支持切换私钥，可以操作多个钱包地址，例如：
```js
function main() {
    exchange.IO("key", "Private Key")   // "Private Key"代表私钥字符串，需要填写实际的私钥值
}
```

#### 调用智能合约方法

以下内容是一些智能合约方法的调用示例。
- decimals
  ```decimals```方法是```ERC20```的一个```constant```方法（在FMZ量化策略代码中调用标准ERC20方法时无需注册ABI），不会产生```gas```消耗，可以查询某个```token```的精度数据。
  ```decimals```方法没有参数，返回值为```token```的精度数据。

  ```js
  function main(){
      var tokenAddress = "0x111111111117dC0aa78b770fA6A738034120C302"    // 代币的合约地址，例子中的代币为1INCH
      Log(exchange.IO("api", tokenAddress, "decimals"))                  // 查询，打印1INCH代币的精度指数为18
  }
  ```
- allowance
  ```allowance```方法是```ERC20```的一个```constant```方法，不会产生```gas```消耗，可以查询某个```token```对某个合约地址的授权额度。
  ```allowance```方法需要传入2个参数，第一个参数为钱包地址，第二个参数为被授权的地址。返回值为```token```的授权额度。

  ```js
  function main(){
      // 代币的合约地址，例子中的代币为1INCH
      var tokenAddress = "0x111111111117dC0aa78b770fA6A738034120C302"
      var owner = ""
      var spender = ""

      // 例如查询得出1000000000000000000，除以该token的精度单位1e18，得出当前交易所对象绑定的钱包给spender地址授权了1个1INCH数量
      Log(exchange.IO("api", tokenAddress, "allowance", owner, spender))
  }
  ```

  ```owner```：钱包地址，实际使用时需要填写具体地址。
  ```spender```：被授权的合约地址，实际使用时需要填写具体地址，例如可以是```Uniswap V3 router v1```地址。
- approve
  ```approve```方法是```ERC20```的一个非```constant```方法，会产生```gas```消耗，用于给某个合约地址授权```token```的操作额度。
  ```approve```方法需要传入2个参数，第一个参数为被授权的地址，第二个参数为授权的额度。返回值为```txid```。

  ```js
  function main(){
      // 代币的合约地址，例子中的代币为1INCH
      var tokenAddress = "0x111111111117dC0aa78b770fA6A738034120C302"
      var spender = ""
      var amount = "0xde0b6b3a7640000"

      // 授权量的十六进制字符串: 0xde0b6b3a7640000 , 对应的十进制字符串: 1e18 , 1e18除以该token的精度单位，即1个代币数量 , 所以这里指授权一个代币
      Log(exchange.IO("api", tokenAddress, "approve", spender, amount))
  }
  ```

  ```spender```：被授权的合约地址，实际使用时需要填写具体地址，例如可以是```Uniswap V3 router v1```地址。
  ```amount```：授权数量，这里使用的是十六进制字符串表示。对应的十进制数值为```1e18```，除以示例中的```token```精度单位（即1e18），得出授权了1个```token```。

  ```exchange.IO()```函数的第三个参数传入方法名```approve```，也可以写成```methodId```的形式，例如："0x571ac8b0"。也可以写成完整的标准方法名，例如："approve(address,uint256)"。
- multicall
  ```multicall```方法是```Uniswap V3```的一个非constant方法，会产生```gas```消耗，用于批量兑换代币。
  ```multicall```方法可能有多种传参方式，具体可以查询包含该方法的ABI，调用该方法之前需要先注册ABI。返回值为```txid```。

  具体的```multicall```方法调用示例，可以参考平台公开的[「Uniswap V3 交易类库」模板](https://www.fmz.com/strategy/397260)

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

  ```ABI_Route```：Uniswap V3的router v2合约的ABI，需要根据实际情况填写。
  ```contractV3SwapRouterV2```：Uniswap V3的router v2地址，实际使用时需要填写具体地址。
  ```value```：转账的ETH数量，如果兑换操作的```tokenIn```代币不是ETH则设置为0，需要根据实际情况填写。
  ```deadline```：可以设置为```(new Date().getTime() / 1000) + 3600```，表示一小时内有效。
  ```data```：需要执行的打包操作数据，需要根据实际情况填写。

  也可以指定方法调用的```gasLimit/gasPrice/nonce```设置：

  ```js
  exchange.IO("api", contractV3SwapRouterV2, "multicall(uint256,bytes[])", value, deadline, data, {gasPrice: 5000000000, gasLimit: 21000})
  ```

  可以根据具体需求设置```{gasPrice: 5000000000, gasLimit: 21000, nonce: 100}```参数，该参数设置在```exchange.IO()```函数的最后一个参数上。
  可以省略其中的```nonce```使用系统默认值，或者不设置```gasLimit/gasPrice/nonce```，全部使用系统默认值。

  需要注意示例中的```multicall(uint256,bytes[])```方法的```stateMutability```属性是```payable```，需要传入```value```参数。
  ```stateMutability":"payable"```属性可以从```ABI```中查看，```exchange.IO()```函数会根据已注册的```ABI```中的```stateMutability```属性判断所需的参数，
  如果```stateMutability```属性是```nonpayable```则不需要传入```value```参数。

#### 其它功能调用

- 获取交易所对象配置的钱包地址
  ```js
  function main() {
      Log(exchange.IO("address"))         // 打印交易所对象配置的私钥对应的钱包地址
  }
  ```
- 切换区块链RPC节点
  ```js
  function main() {
      var chainRpc = "https://bsc-dataseed.binance.org"

      // 切换至BSC链，也可使用SetBase函数进行切换
      e.IO("base", chainRpc)
  }
  ```

### 波场

在发明者量化交易平台，通过```exchange.IO()```函数可以实现对波场（TRON）链上gRPC方法和智能合约的调用，从而编写相关策略代码。

#### Web3交易所对象配置

配置方式与以太坊交易所对象配置类似，```ChainType```需要选择为```TRON```。```RPC Address```默认为：```grpc.trongrid.io:50051```，即波场官方节点地址。

#### 注册ABI

默认已注册TRC20的合约ABI，底层封装了自动根据合约地址获取合约ABI的机制。通常情况下无需手动注册ABI，仅在某些合约ABI无法自动获取时才需要手动注册。

注册ABI的方式与以太坊一致，例如：
```js
// USDT合约地址：TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t
let abi = `[{"constant":true,"inputs":[{"name":"who","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"}]`

// 注册 balanceOf 方法
exchange.IO("abi", "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t", abi)
```

#### 调用TRON的RPC方法

使用```exchange.IO()```函数调用TRON的RPC方法。对于需要签名的方法，底层已自动封装签名操作。以下列举常用方法，其他方法请参考TRON官方项目文档。
- GetAccount
  ```js
  exchange.IO("api", "tron", "GetAccount", "TKCG...")   // "TKCG..."为TRON钱包地址，该函数返回"TKCG..."地址的账户信息。
  ```
- GetAccountResource
  ```js
  exchange.IO("api", "tron", "GetAccountResource", "TKCG...") // 获取指定钱包地址的资源，包括能量和带宽。
  ```
- GetContractABI
  ```js
  exchange.IO("api", "tron", "GetContractABI", "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t")  // 获取 USDT TRC20合约ABI
  ```
- GetAssetIssueByName
  ```js
  exchange.IO("api", "tron", "GetAssetIssueByName", "TRX")  // 根据代币名称获取代币资产信息
  ```
- GetNowBlock
  ```js
  exchange.IO("api", "tron", "GetNowBlock")   // 获取当前区块信息
  ```
- GetBlockByNum
  ```js
  exchange.IO("api", "tron", "GetBlockByNum", 70624300)
  ```
- GetTransactionByID
  ```js
  exchange.IO("api", "tron", "GetTransactionByID", "05a8fae2cd1cbf36b61d12e219588d25b4826436f055f93388a96e620ec3f3f2")   // 根据交易哈希值获取Transaction
  ```
- TRC20ContractBalance
  ```js
  exchange.IO("api", "tron", "TRC20ContractBalance", "TKCG...", "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t")   // 获取钱包 USDT 余额，注意返回的数据未经精度处理，例如返回数据为：```6890251```，即```6.890251 USDT```。
  ```
- TriggerConstantContract
  ```js
  function main() {
      let ret = exchange.IO("api", "tron", "TriggerConstantContract", "", "TSUUVjysXV8YqHytSNjfkNXnnB49QDvZpx", "token0()", "")  // 调用智能合约的token0()方法，TriggerConstantContract用于调用只读方法
      let data = exchange.IO("decode", "address", Encode("raw", "raw", "hex", ret["constant_result"][0]))                        // 解码数据
      return data                                                                                                                 // data: 0x891cdb91d149f23b1a45d9c5ca78a88d0cb44c18
  }
  ```
- TRC20Call
  ```js
  function main() {
      let ret = exchange.IO("api", "tron", "TRC20Call", "", "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t", "0x06fdde03", true, 0)         // 使用TRC20Call调用只读方法0x06fdde03
      let data = Encode("raw", "raw", "hex", ret.constant_result[0])
      return exchange.IO("api", "tron", "ParseTRC20StringProperty", data)                                                        // Tether USD
  }
  ```
- Transfer
  ```js
  exchange.IO("api", "tron", "Transfer", "TWTbn...", "TKCG...", 1000000)            // 使用Transfer方法转账TRX，从"TWTbn..."转至"TKCG..."，1000000即1TRX。
  ```

#### 编码/解码

当交易所对象设置为Web3并选择TRON时，编码/解码等操作与以太坊的Web3交易所对象保持一致。
- encode：
  ```js
  let ret = exchange.IO("encode", "address", "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t")
  Log(ret) // ret: 000000000000000000000000a614f803b6fd780986a42c78ec9c7f77e6ded13c , 对USDT代币的TRON地址进行编码。
  ```
- decode：
  ```js
  let data = "0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000a5465746865722055534400000000000000000000000000000000000000000000"
  let ret = exchange.IO("decode", "string", data)
  Log(ret)  // ret: Tether USD , 类似于ParseTRC20StringProperty的功能
  ```
- encodePacked：
  ```js
  let ret = exchange.IO("encodePacked", "address", "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t")
  Log(ret)  // ret: a614f803b6fd780986a42c78ec9c7f77e6ded13c
  ```

#### 支持切换私钥

切换方式与Web3以太坊交易所对象保持一致。

#### 调用智能合约方法

TRON上智能合约方法的调用与以太坊基本一致，以下是一个具体示例，演示如何：
- 调用智能合约方法，在一次请求中调用多个合约方法：
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

  输出内容：
  ```log
  信息 balanceOf: 6890251
  信息 decimals: 6
  信息 name: Tether USD
  ```

#### 其它功能调用

- 获取交易所对象配置的钱包地址
  与以太坊的使用方式一致。
- 切换区块链RPC节点
  与以太坊的使用方式一致。
- 计算hash
  ```js
  let algo = "sign"                   // algo: 使用的算法或方式
  let inputFormat = "hex"             // inputFormat: 输入数据的格式，签名时data为十六进制的32字节哈希
  let outputFormat = "hex"            // outputFormat: 输出数据的格式
  let data = "txHash"                 // txHash: 具体的hash值（64个十六进制字符）
  let signature = exchange.IO("hash", algo, inputFormat, outputFormat, data)  // 返回签名数据
  ```

  algo设置为```"sign"```时，表示用于计算签名，此时```data```必须为32字节哈希，```inputFormat```须使用```"hex"```；返回65字节的签名数据```r‖s‖v```，其中v为0或1。设置为其它算法参数时（例如："sha256"），功能等同于```Encode()```函数。

  如需分别获取r、s、v（v为27或28）用于合约校验，可以使用```exchange.IO("sign", ...)```（参见语法手册Web3章节）。

## 内置库

发明者量化交易平台内置集成了一些常用库。

### TA指标库

发明者量化的```TA```指标库对常用指标算法进行了优化，支持在```JavaScript```、```Python```、```Rust```、```C++```等语言的策略中调用。[开源TA库代码](https://www.fmz.com/bbs-topic/409)、[发明者量化交易平台API手册](https://www.fmz.com/syntax-guide)。

```js
function main(){
    // records 的长度；当数据长度不满足指标函数参数的计算要求时，将返回无效值
    var records = exchange.GetRecords()
    var macd = TA.MACD(records)
    var atr = TA.ATR(records, 14)

    // 打印最后一组指标值
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

### talib指标库

以下是```CCI```指标调用示例代码，更多talib指标函数请参阅[发明者量化交易平台API手册](https://www.fmz.com/syntax-guide)

```js
function main() {
    var records = exchange.GetRecords()
    var cci = talib.CCI(records, 14)
    Log(cci)
}
```

```python
# Python需要单独安装talib库

import talib

def main():
    records = exchange.GetRecords()
    # 14这个参数可以缺省
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

### JavaScript库

- http://mikemcl.github.io/decimal.js/
  ```javascript
  // 解决JavaScript语言数值计算时的精度问题
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
      // 打印所有技术指标数据，在发明者量化交易平台上，JavaScript语言策略已内置talib库
      Log(talib.MACD(records))
      Log(talib.MACD(records, 12, 26, 9))
  }
  ```
- 动态加载JavaScript库
  如需使用其他第三方JavaScript库，可通过以下方式动态加载：
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

### C++库

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

## 扩展API接口

发明者量化平台开放了扩展API接口，支持通过程序化方式调用发明者量化交易平台的各项功能。

### 创建ApiKey

发明者量化交易平台支持扩展API接口的权限管理，可以设置```API KEY```的权限。在平台[账号设置](https://www.fmz.com/m/account)页面的「API接口」选项中，点击「创建新的ApiKey」按钮即可创建扩展```API KEY```。

创建```API KEY```时，可在「API权限」输入框中输入```*```符号以开启所有**扩展API接口**权限。如需指定具体接口权限，请输入对应的扩展API函数名，使用英文逗号分隔，例如：```GetRobotDetail,DeleteRobot```，这将授予该```API KEY```调用**获取实盘详细信息**接口和**删除实盘**接口的权限。

在```API KEY```管理页面，您还可以对已创建的```API KEY```进行**修改**、**禁用**、**删除**等操作。

### 扩展API接口返回码

扩展API接口返回的数据结构示例如下：

```json
{
    "code":0,
    "data":{
        // ...
    }
}
```

```code```字段表示扩展API接口调用时返回的状态码。

| 描述 | 代码 |
| - | - |
| 执行成功 | 0 |
| 错误的API KEY | 1 |
| 错误的签名 | 2 |
| Nonce错误 | 3 |
| 方法不正确 | 4 |
| 参数不正确 | 5 |
| 内部未知错误 | 6 |

### 实盘状态码

```GetRobotList```接口、```GetRobotDetail```接口、```GetRobotLogs```接口返回的数据中```status```字段为：实盘状态码。

- 正常启动
  | 状态 | 代码 |
  | - | - |
  | 空闲中 | 0 |
  | 运行中 | 1 |
  | 停止中 | 2 |
  | 已退出 | 3 |
  | 被停止 | 4 |
  | 策略有错误 | 5 |
- 异常
  | 状态 | 代码 |
  | - | - |
  | 策略已过期，请联系作者重新购买 | -1 |
  | 未找到托管者 | -2 |
  | 策略编译错误 | -3 |
  | 实盘已处于运行状态 | -4 |
  | 余额不足 | -5 |
  | 策略并发数超限 | -6 |

### 验证方式

调用扩展API接口时支持两种验证方式：```token```验证和直接验证。

#### token验证

使用```md5```加密方式进行验证，以下是```Python```、```Golang```语言的调用示例：

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
    # 注意：urllib2.urlopen 函数可能存在超时问题，可以设置超时时间，例如：urllib2.urlopen('https://www.fmz.com/api/v1', urlencode(d).encode('utf-8'), timeout=10) 设置超时时间为10秒
    return json.loads(urllib2.urlopen('https://www.fmz.com/api/v1', urlencode(d).encode('utf-8')).read().decode('utf-8'))

# 返回托管者列表
print(api('GetNodeList'))
# 返回交易所列表
print(api('GetPlatformList'))
# GetRobotList(offset, length, robotStatus, label)，传入-1表示获取全部
print(api('GetRobotList', 0, 5, -1, 'member2'))
# CommandRobot(robotId, cmd)向实盘发送命令
print(api('CommandRobot', 123, 'ok'))
# StopRobot(robotId)返回实盘状态码
print(api('StopRobot', 123))
# RestartRobot(robotId)返回实盘状态码
print(api('RestartRobot', 123))
# GetRobotDetail(robotId)返回实盘详细信息
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

// 填写您的FMZ平台API密钥
var apiKey string = ""
// 填写您的FMZ平台密钥
var secretKey string = ""
var baseApi string = "https://www.fmz.com/api/v1"

func api(method string, args ... interface{}) (ret interface{}) {
    // 处理参数
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
        // K线周期参数，60表示60秒
        "period": 60,
        "node" : 73938,
        "appid": "member2",
        "exchanges": []interface{}{
            map[string]interface{}{
                "eid": "Exchange",
                "label" : "test_bjex",
                "pair": "BTC_USDT",
                "meta" : map[string]interface{}{
                    // 填写访问密钥
                    "AccessKey": "",
                    // 填写密钥
                    "SecretKey": "",
                    "Front" : "http://127.0.0.1:6666/exchange",
                },
            },
        },
    }

    method := "RestartRobot"
    fmt.Println("调用接口：", method)
    ret := api(method, 124577, settings)
    fmt.Println("main ret:", ret)
}
```

#### 直接验证

支持不使用```token```验证（直接传递```secret_key```验证），可以生成一个用于直接访问的URL。例如直接向实盘发送交互指令的URL，可用于```Trading View```或其他场景的```WebHook```回调。对于扩展API接口```CommandRobot()```函数，不进行```nonce```校验，不限制该接口的访问频率和访问次数。

例如：创建的扩展```API KEY```中的```AccessKey```为：```xxx```，```SecretKey```为：```yyy```。访问以下链接即可向ID为```186515```的实盘发送交互指令消息，消息内容为字符串：```"ok12345"```。

```plaintext
https://www.fmz.com/api/v1?access_key=xxx&secret_key=yyy&method=CommandRobot&args=%5B186515%2C%22ok12345%22%5D
```

在支持直接验证方式下，可获取请求中的```Body```数据，仅支持```CommandRobot```接口。例如在```Trading View```的```WebHook URL```中设置：

```plaintext
https://www.fmz.com/api/v1?access_key=xxx&secret_key=yyy&method=CommandRobot&args=%5B186515%2C+%22%22%5D
```

注意需要按照此格式设置：```%5B186515%2C+%22%22%5D```（编码前为：```[186515, ""]```），其中```186515```是发明者量化交易平台的实盘ID。

模拟```Trading View```发送```WebHook URL```警报：
```js
function main() {
    var options = {
        method: "POST",
        body: `{"test": 123}`,
        headers: {"Content-Type": "application/json"}
    }

    // WebHook URL 警报会自动发送POST请求，包含需要的 headers 设置
    return HttpQuery("https://www.fmz.com/api/v1?access_key=xxx&secret_key=xxx&method=CommandRobot&args=%5B186515%2C+%22%22%5D", options)
}
```

```Trading View```消息框中设置（要发送的请求中的Body数据）：
- JSON格式：

  https://www.fmz.com/upload/asset/16d8a37ef80d9ccd0079.png

  ```plaintext
  {"close": {{close}}, "name": "aaa"}
  ```

  ID为```186515```的实盘即可收到交互命令字符串：```{"close": 39773.75, "name": "aaa"}```。
- 文本格式：

  https://www.fmz.com/upload/asset/16d8a506dfbb6c60a077.png

  ```plaintext
  BTCUSDTPERP 穿过(Crossing) 39700.00 close: {{close}}
  ```

  ID为```186515```的实盘即可收到交互命令字符串：```BTCUSDTPERP 穿过(Crossing) 39700.00 close: 39739.4```。

```Python```、```Golang```语言调用示例：

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

# 如果API KEY没有该接口权限，调用print(api('RestartRobot', 186515)) 会失败，返回数据：{'code': 4, 'data': None}
# print(api('RestartRobot', 186515))

# 打印Id为：186515的实盘详细信息
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

// 填写自己的FMZ平台api key
var apiKey string = "your access_key"

// 填写自己的FMZ平台secret key
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
    fmt.Println("调用接口：", method)
    ret := api(method, 186515)
    fmt.Println("main ret:", ret)
}
```

[使用发明者量化交易平台扩展API实现TradingView报警信号交易](https://www.fmz.com/digest-topic/5533)
[使用发明者量化交易平台扩展API实现TradingView报警信号交易，B站视频链接](https://www.bilibili.com/video/BV1Wk4y1k7zz/)

### 扩展API接口详解

- 发明者量化交易平台扩展API接口
  在```https://www.fmz.com/api/v1```后直接附加请求的查询参数（以```?```分隔），以下是使用```Python```表达的请求参数：

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

  | 字段 | 说明 |
  | - | - |
  | version    | 版本号。 |
  | access_key | AccessKey，在账户管理页面申请。 |
  | method     | 具体调用的方法。 |
  | args       | 调用method方法的参数列表。 |
  | nonce      | 时间戳，单位为毫秒，允许与标准时间戳前后误差1小时，nonce必须大于上一次访问时的nonce值。 |
  | sign       | 签名。 |

  各参数以字符```&```分隔，参数名和参数值用符号```=```连接，完整的请求URL（以```method=GetNodeList```为例）：

  ```plaintext
  https://www.fmz.com/api/v1?access_key=xxx&nonce=1516292399361&args=%5B%5D&sign=085b63456c93hfb243a757366600f9c2&version=1.0&method=GetNodeList
  ```

  注意：请求参数中不包含```secret_key```参数。
- 签名方式
  请求参数中```sign```参数的加密方式如下，按照以下格式：

  ```plaintext
  version + "|" + method + "|" + args + "|" + nonce + "|" + secretKey
  ```

  拼接字符串后，使用```MD5```加密算法对字符串进行加密，并转换为十六进制字符串，该值作为参数```sign```的值。签名部分可参考```Python```代码扩展API接口[「验证方式」](/user-guide/扩展api接口/验证方式)：

  ```python
  # 参数
  d = {
      'version': '1.0',
      'access_key': accessKey,
      'method': method,
      'args': json.dumps(list(args)),
      'nonce': int(time.time() * 1000),
  }

  # 计算sign签名
  d['sign'] = md5.md5(('%s|%s|%s|%d|%s' % (d['version'], d['method'], d['args'], d['nonce'], secretKey)).encode('utf-8')).hexdigest()
  ```
- 接口业务错误：
  - 参数不足：
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

```GetNodeList```方法用于获取请求中```API KEY```对应的发明者量化交易平台账号下的托管者列表。

Parameters:

- 无
- 参
- 数

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

Returns: 返

Returns: 回

Returns: 值

Returns: 字

Returns: 段

Returns: 说

Returns: 明

Returns: （

Returns: 字

Returns: 面

Returns: 意

Returns: 思

Returns: 明

Returns: 显

Returns: 的

Returns: 字

Returns: 段

Returns: 不

Returns: 再

Returns: 赘

Returns: 述

Returns: ）

Returns: ：

Returns: 

Returns: -

Returns: 

Returns: a

Returns: l

Returns: l

Returns: :

Returns: 

Returns: 当

Returns: 前

Returns: 账

Returns: 户

Returns: 关

Returns: 联

Returns: 的

Returns: 托

Returns: 管

Returns: 者

Returns: 总

Returns: 数

Returns: 。

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

Returns: 托

Returns: 管

Returns: 者

Returns: 节

Returns: 点

Returns: 的

Returns: 详

Returns: 细

Returns: 信

Returns: 息

Returns: 列

Returns: 表

Returns: 。

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

Returns: 版

Returns: 本

Returns: 号

Returns: 。

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

Returns: 所

Returns: 在

Returns: 城

Returns: 市

Returns: 。

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

Returns: 表

Returns: 示

Returns: 私

Returns: 有

Returns: 托

Returns: 管

Returns: 者

Returns: ，

Returns: f

Returns: a

Returns: l

Returns: s

Returns: e

Returns: 表

Returns: 示

Returns: 公

Returns: 共

Returns: 托

Returns: 管

Returns: 者

Returns: 。

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

Returns: 负

Returns: 载

Returns: 量

Returns: ，

Returns: 即

Returns: 当

Returns: 前

Returns: 运

Returns: 行

Returns: 的

Returns: 策

Returns: 略

Returns: 实

Returns: 例

Returns: 数

Returns: 量

Returns: 。

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

Returns: 表

Returns: 示

Returns: 私

Returns: 有

Returns: 托

Returns: 管

Returns: 者

Returns: ，

Returns: 1

Returns: 表

Returns: 示

Returns: 公

Returns: 共

Returns: 托

Returns: 管

Returns: 者

Returns: 。

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

Returns: 地

Returns: 理

Returns: 位

Returns: 置

Returns: 。

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

Returns: 托

Returns: 管

Returns: 者

Returns: 的

Returns: 详

Returns: 细

Returns: 版

Returns: 本

Returns: 信

Returns: 息

Returns: 。

Returns: 

Returns: 

Returns: 

Returns: -

Returns: 

Returns: w

Returns: d

Returns: :

Returns: 

Returns: 离

Returns: 线

Returns: 报

Returns: 警

Returns: 开

Returns: 关

Returns: ，

Returns: 0

Returns: 表

Returns: 示

Returns: 未

Returns: 开

Returns: 启

Returns: 。

Returns: 

Returns: 一

Returns: 键

Returns: 部

Returns: 署

Returns: 的

Returns: 托

Returns: 管

Returns: 者

Returns: 包

Returns: 含

Returns: 额

Returns: 外

Returns: 信

Returns: 息

Returns: ，

Returns: 相

Returns: 关

Returns: 字

Returns: 段

Returns: 以

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

Returns: 、

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

Returns: 为

Returns: 前

Returns: 缀

Returns: ，

Returns: 记

Returns: 录

Returns: 了

Returns: 一

Returns: 键

Returns: 部

Returns: 署

Returns: 托

Returns: 管

Returns: 者

Returns: 服

Returns: 务

Returns: 器

Returns: 的

Returns: 相

Returns: 关

Returns: 信

Returns: 息

Returns: （

Returns: 运

Returns: 营

Returns: 商

Returns: 名

Returns: 称

Returns: 、

Returns: 配

Returns: 置

Returns: 、

Returns: 状

Returns: 态

Returns: 等

Returns: ）

Returns: 、

Returns: 计

Returns: 费

Returns: 周

Returns: 期

Returns: 、

Returns: 价

Returns: 格

Returns: 等

Returns: 信

Returns: 息

Returns: ，

Returns: 此

Returns: 处

Returns: 不

Returns: 再

Returns: 详

Returns: 述

Returns: 。

##### GetRobotGroupList

```GetRobotGroupList```方法用于获取请求中```API KEY```对应的发明者量化交易平台账号下的实盘分组列表。

Parameters:

- 无
- 参
- 数

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

Returns: 测

Returns: 试

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

Returns: 实

Returns: 盘

Returns: 演

Returns: 示

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

Returns: 实

Returns: 盘

Returns: 分

Returns: 组

Returns: 信

Returns: 息

Returns: 。

Returns: 

Returns: 

Returns: 

Returns: -

Returns: 

Returns: i

Returns: d

Returns: :

Returns: 

Returns: 实

Returns: 盘

Returns: 分

Returns: 组

Returns: I

Returns: D

Returns: 。

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

Returns: 实

Returns: 盘

Returns: 分

Returns: 组

Returns: 名

Returns: 称

Returns: 。

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

Returns: 字

Returns: 段

Returns: 仅

Returns: 记

Returns: 录

Returns: 创

Returns: 建

Returns: 的

Returns: 新

Returns: 分

Returns: 组

Returns: ，

Returns: 「

Returns: 默

Returns: 认

Returns: 」

Returns: 分

Returns: 组

Returns: 不

Returns: 包

Returns: 含

Returns: 在

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

Returns: 中

Returns: 。

##### GetPlatformList

```GetPlatformList```方法用于获取请求中```API KEY```对应的发明者量化交易平台账号下已配置的交易所列表。

Parameters:

- 无
- 参
- 数

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

Returns: 已

Returns: 配

Returns: 置

Returns: 的

Returns: 交

Returns: 易

Returns: 所

Returns: 对

Returns: 象

Returns: 总

Returns: 数

Returns: 。

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

Returns: 交

Returns: 易

Returns: 所

Returns: 相

Returns: 关

Returns: 信

Returns: 息

Returns: 。

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

Returns: 发

Returns: 明

Returns: 者

Returns: 量

Returns: 化

Returns: 交

Returns: 易

Returns: 平

Returns: 台

Returns: 上

Returns: 的

Returns: 交

Returns: 易

Returns: 所

Returns: 标

Returns: 识

Returns: 符

Returns: ，

Returns: 在

Returns: 某

Returns: 些

Returns: 配

Returns: 置

Returns: 和

Returns: 参

Returns: 数

Returns: 中

Returns: 需

Returns: 要

Returns: 使

Returns: 用

Returns: `

Returns: `

Returns: `

Returns: e

Returns: i

Returns: d

Returns: `

Returns: `

Returns: `

Returns: 。

##### GetRobotList

```GetRobotList```方法用于获取请求中```API KEY```对应的发明者量化交易平台账号下的实盘列表。

Parameters:

- `offset` (number, optional): 分页查询的偏移量设置。
- `length` (number, optional): 分页查询的数据长度设置。
- `robotStatus` (number, optional): 指定要查询的实盘状态，参考扩展API接口[「实盘状态码」](/user-guide/扩展api接口/实盘状态码)，传入```-1```表示获取全部实盘。
- `label` (string, optional): 指定要查询的实盘自定义标签，可筛选出包含该标签的所有实盘。
- `keyWord` (string, optional): 查询关键字。

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

Returns: 测

Returns: 试

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

Returns: 测

Returns: 试

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

Returns: 实

Returns: 盘

Returns: 信

Returns: 息

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

Returns: 实

Returns: 盘

Returns: 分

Returns: 组

Returns: I

Returns: D

Returns: ；

Returns: 如

Returns: 果

Returns: 实

Returns: 盘

Returns: 位

Returns: 于

Returns: 默

Returns: 认

Returns: 分

Returns: 组

Returns: 中

Returns: ，

Returns: 则

Returns: 不

Returns: 包

Returns: 含

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

Returns: 字

Returns: 段

Returns: 。

以```Python```语言的扩展API接口[「验证方式」](/user-guide/扩展api接口/验证方式)为例：

```print(api('GetRobotList'))```：获取全部实盘信息。

```print(api('GetRobotList', 'member2'))```：打印所有自定义标签为member2的实盘信息。

```print(api('GetRobotList', 0, 5, -1, 'member2'))```：分页查询，从偏移量0开始，最多返回5个标签为member2的实盘。

##### CommandRobot

```CommandRobot```方法用于向请求中```API KEY```对应的发明者量化交易平台账号下的实盘发送交互命令。接收交互命令的实盘Id由```robotId```参数指定，交互命令由策略中调用的```GetCommand()```函数捕获并返回。

Parameters:

- `robotId` (number, required): ```robotId```参数用于指定接收交互指令的实盘Id。可以使用```GetRobotList```方法获取账号下实盘的信息，其中包含实盘Id。
- `cmd` (string, required): ```cmd```参数是发送给实盘的交互指令。实盘策略中的```GetCommand()```函数会捕获该交互命令，触发策略的交互逻辑。策略代码中的具体交互逻辑实现，请参考[发明者量化交易平台API手册](https://www.fmz.com/syntax-guide#fun_getcommand)中的```GetCommand()```函数说明。

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

Returns: 交

Returns: 互

Returns: 指

Returns: 令

Returns: 是

Returns: 否

Returns: 发

Returns: 送

Returns: 成

Returns: 功

Returns: 。

Returns: 向

Returns: 未

Returns: 运

Returns: 行

Returns: 的

Returns: 实

Returns: 盘

Returns: 发

Returns: 送

Returns: 指

Returns: 令

Returns: 时

Returns: ，

Returns: 返

Returns: 回

Returns: 数

Returns: 据

Returns: 中

Returns: 的

Returns: r

Returns: e

Returns: s

Returns: u

Returns: l

Returns: t

Returns: 为

Returns: f

Returns: a

Returns: l

Returns: s

Returns: e

Returns: 。

实盘策略示例（假设该策略实盘正在运行，实盘Id为123）：
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

如果使用本章节的Python测试脚本访问发明者量化交易平台的扩展API：```api("CommandRobot", 123, "test command")```，Id为123的实盘将收到交互指令：```test command```，并通过Log函数输出打印。

##### StopRobot

```StopRobot```方法用于停止请求中```API KEY```对应的发明者量化交易平台账号下的实盘。停止运行的实盘Id由```robotId```参数指定。

Parameters:

- `robotId` (number, required): ```robotId```参数用于指定要停止的实盘Id。可以通过```GetRobotList```方法获取账号下的实盘信息，其中包含实盘Id。

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

Returns: 实

Returns: 盘

Returns: 状

Returns: 态

Returns: 码

Returns: ，

Returns: 2

Returns: 表

Returns: 示

Returns: 停

Returns: 止

Returns: 中

Returns: 。

##### RestartRobot

```RestartRobot```方法用于重启请求中```API KEY```对应的发明者量化交易平台账号下的实盘。重启的实盘ID由```robotId```参数指定。

Parameters:

- `robotId` (number, required): ```robotId```参数用于指定要重启的实盘ID。可以使用```GetRobotList```方法获取账号下实盘的信息，其中包含实盘ID。
- `settings` (JSON对象, optional): 实盘配置参数，```settings```参数格式如下：

```json
{
    "appid":"test",
    "args":[],
    "exchanges":[
        {"pair":"SOL_USDT","pid":123},
        {"pair":"ETH_USDT","pid":456}
    ],
    "name":"测试",
    "node":123,
    "period":60,
    "strategy":123
}
```

- appid: 自定义字段
  可以定义标签。
- args: 策略参数设置
  结构为数组，每个元素为一个参数。例如，策略有一个参数```Interval```，重启策略时希望将```Interval```设置为500，则```args```中应包含：```["Interval", 500]```，即：```"args": [["Interval", 500]]```。
- exchanges: 实盘绑定的交易所对象配置
  结构为数组，其中每个元素为一个交易所对象配置。
  - 可以绑定已在平台配置的交易所对象
    使用```pid```配置：```{"pair":"SOL_USDT","pid":123}```；```pid```可以通过```GetPlatformList```接口查询，返回数据中的```id```字段即为交易所```pid```。
  - 可以直接传入配置信息，绑定交易所对象
    使用```eid```配置：```{"eid":"Huobi","label":"test Huobi","meta":{"AccessKey":"123","SecretKey":"123"},"pair":"BCH_BTC"}```；传入的```API KEY```等敏感信息，发明者量化交易平台不会存储，这些数据将直接转发给托管者程序。如果使用此类配置，每次创建或重启实盘时必须配置该信息。
  - 可以绑定**通用协议**交易所对象
    可以传入配置信息：```{"eid":"Exchange","label":"test exchange","pair":"BTC_USDT","meta":{"AccessKey":"123","SecretKey":"123","Front":"http://127.0.0.1:6666/test"}}```。
    ```label```属性用于为当前**通用协议**接入的交易所对象设置标签，在策略中可以使用```exchange.GetLabel()```函数获取。
- name: 策略名称
- node: 托管者ID
  指定在哪个托管者上运行。如果不设置该属性，系统将自动分配运行。
- period: 默认K线周期
  K线周期参数，60表示60秒。
- strategy: 策略ID
  可以使用```GetStrategyList```方法获取。

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

Returns: 实

Returns: 盘

Returns: 状

Returns: 态

Returns: 码

Returns: ，

Returns: 1

Returns: 表

Returns: 示

Returns: 运

Returns: 行

Returns: 中

Returns: 。

如果实盘是通过扩展API接口创建的，重启时必须使用扩展API接口```RestartRobot```进行重启，并且必须传入```settings```参数。对于在平台页面上创建的实盘，可以通过扩展API接口重启或点击实盘页面上的按钮重启。可以传入```settings```参数或不传入。如果只传入```robotId```参数，则按照实盘的当前设置启动运行。

##### GetRobotDetail

```GetRobotDetail```方法用于获取请求中```API KEY```对应的发明者量化交易平台账号下的实盘详细信息。所要获取的实盘详细信息由```robotId```参数指定。

Parameters:

- `robotId` (number, required): ```robotId```参数用于指定要获取详细信息的实盘ID。可通过```GetRobotList```方法获取账号下的实盘信息，其中包含实盘ID。

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

Returns: 测

Returns: 试

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

Returns: 期

Returns: 货

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

Returns: 测

Returns: 试

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

Returns: 下

Returns: 次

Returns: 扣

Returns: 费

Returns: 时

Returns: 间

Returns: ，

Returns: 即

Returns: 当

Returns: 前

Returns: 扣

Returns: 费

Returns: 后

Returns: 的

Returns: 有

Returns: 效

Returns: 截

Returns: 止

Returns: 时

Returns: 间

Returns: 。

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

Returns: 已

Returns: 消

Returns: 耗

Returns: 的

Returns: 时

Returns: 间

Returns: 。

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

Returns: 已

Returns: 消

Returns: 耗

Returns: 的

Returns: 金

Returns: 额

Returns: （

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

Returns: ）

Returns: 。

Returns: 

Returns: -

Returns: 

Returns: d

Returns: a

Returns: t

Returns: e

Returns: :

Returns: 

Returns: 创

Returns: 建

Returns: 日

Returns: 期

Returns: 。

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

Returns: 实

Returns: 盘

Returns: 运

Returns: 行

Returns: 时

Returns: 分

Returns: 配

Returns: 的

Returns: 托

Returns: 管

Returns: 者

Returns: I

Returns: D

Returns: ，

Returns: 如

Returns: 果

Returns: 是

Returns: 自

Returns: 动

Returns: 分

Returns: 配

Returns: ，

Returns: 该

Returns: 值

Returns: 为

Returns: -

Returns: 1

Returns: 。

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

Returns: 是

Returns: 否

Returns: 有

Returns: 权

Returns: 限

Returns: 管

Returns: 理

Returns: 该

Returns: 实

Returns: 盘

Returns: 。

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

Returns: 是

Returns: 否

Returns: 为

Returns: 模

Returns: 拟

Returns: 盘

Returns: 。

Returns: 

Returns: -

Returns: 

Returns: n

Returns: a

Returns: m

Returns: e

Returns: :

Returns: 

Returns: 实

Returns: 盘

Returns: 名

Returns: 称

Returns: 。

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

Returns: 托

Returns: 管

Returns: 者

Returns: I

Returns: D

Returns: 。

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

Returns: 实

Returns: 盘

Returns: 配

Returns: 置

Returns: 的

Returns: 交

Returns: 易

Returns: 所

Returns: 对

Returns: 象

Returns: ，

Returns: 1

Returns: 2

Returns: 3

Returns: 为

Returns: p

Returns: i

Returns: d

Returns: ，

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

Returns: 为

Returns: 交

Returns: 易

Returns: 所

Returns: 名

Returns: 称

Returns: 。

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

Returns: 实

Returns: 盘

Returns: 配

Returns: 置

Returns: 的

Returns: 交

Returns: 易

Returns: 所

Returns: 对

Returns: 象

Returns: 的

Returns: 标

Returns: 签

Returns: 信

Returns: 息

Returns: 。

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

Returns: 实

Returns: 盘

Returns: 收

Returns: 益

Returns: 数

Returns: 据

Returns: 。

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

Returns: 实

Returns: 盘

Returns: 是

Returns: 否

Returns: 公

Returns: 开

Returns: 。

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

Returns: 最

Returns: 近

Returns: 活

Returns: 跃

Returns: 时

Returns: 间

Returns: 。

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

Returns: 配

Returns: 置

Returns: 的

Returns: 交

Returns: 易

Returns: 所

Returns: 对

Returns: 象

Returns: 及

Returns: 其

Returns: 交

Returns: 易

Returns: 对

Returns: 信

Returns: 息

Returns: 。

Returns: 

Returns: -

Returns: 

Returns: w

Returns: d

Returns: :

Returns: 

Returns: 是

Returns: 否

Returns: 开

Returns: 启

Returns: 离

Returns: 线

Returns: 报

Returns: 警

Returns: 。

```strategy_exchange_pairs```属性说明，以下列数据为例：

```plaintext
"[60,[44314,42960,15445,14703],[\"BTC_USDT\",\"BTC_USDT\",\"ETH_USDT\",\"ETH_USDT\"]]"
```

其中第一个数据```60```表示实盘设置的默认K线周期为1分钟，即60秒。

```[44314,42960,15445,14703]```为实盘配置的交易所对象的```pid```（按添加顺序排列）。

```[\"BTC_USDT\",\"BTC_USDT\",\"ETH_USDT\",\"ETH_USDT\"]```为实盘配置的交易所对象设置的交易对（按添加顺序与pid一一对应）。

##### GetAccount

```GetAccount```方法用于获取请求中```API KEY```对应的发明者量化交易平台账号的账户信息。

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

Returns: 账

Returns: 户

Returns: 余

Returns: 额

Returns: 

Returns: 

Returns: 

Returns: 此

Returns: 处

Returns: 的

Returns: 数

Returns: 值

Returns: 采

Returns: 用

Returns: 整

Returns: 数

Returns: 表

Returns: 示

Returns: 以

Returns: 确

Returns: 保

Returns: 精

Returns: 度

Returns: ，

Returns: 实

Returns: 际

Returns: 数

Returns: 值

Returns: 需

Returns: 除

Returns: 以

Returns: 1

Returns: e

Returns: 8

Returns: （

Returns: 即

Returns: 1

Returns: 0

Returns: 的

Returns: 8

Returns: 次

Returns: 方

Returns: ）

Returns: 进

Returns: 行

Returns: 换

Returns: 算

Returns: 。

Returns: 本

Returns: 例

Returns: 中

Returns: 实

Returns: 际

Returns: 余

Returns: 额

Returns: 为

Returns: ：

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

```GetExchangeList```方法用于获取FMZ量化交易平台支持的交易所列表及其配置信息。

Parameters:

- `isSummary` (bool, required): ```isSummary```参数用于指定返回的数据是否为摘要信息。

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

Returns: 参

Returns: 数

Returns: 为

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

Returns: 时

Returns: ，

Returns: 返

Returns: 回

Returns: 的

Returns: 数

Returns: 据

Returns: ：

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

Returns: 参

Returns: 数

Returns: 为

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

Returns: 时

Returns: ，

Returns: 返

Returns: 回

Returns: 的

Returns: 数

Returns: 据

Returns: ：

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

Returns: 交

Returns: 易

Returns: 所

Returns: 配

Returns: 置

Returns: 元

Returns: 数

Returns: 据

Returns: 。

##### DeleteNode

```DeleteNode```方法用于删除请求中```API KEY```对应的发明者量化交易平台账号下的托管者节点，删除的托管者节点ID为```nid```参数指定的托管者ID。

Parameters:

- `nid` (number, required): ```nid```参数用于指定要删除的托管者ID，可通过```GetNodeList```方法获取账号下托管者的信息。

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

Returns: 是

Returns: 否

Returns: 成

Returns: 功

Returns: 删

Returns: 除

Returns: 关

Returns: 联

Returns: 的

Returns: 托

Returns: 管

Returns: 者

Returns: 程

Returns: 序

Returns: 。

##### DeleteRobot

```DeleteRobot```方法用于删除请求中```API KEY```对应的发明者量化交易平台账号下的实盘。删除的实盘ID为```robotId```参数指定的实盘ID。

Parameters:

- `robotId` (number, required): ```robotId```参数用于指定要删除的实盘ID。可以使用```GetRobotList```方法获取账号下实盘的信息，其中包含实盘ID。
- `deleteLogs` (bool, required): ```deleteLogs```参数用于设置是否删除实盘日志。如果传入真值（例如：```true```），则删除实盘日志。

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

Returns: 实

Returns: 盘

Returns: 删

Returns: 除

Returns: 操

Returns: 作

Returns: 的

Returns: 反

Returns: 馈

Returns: 结

Returns: 果

Returns: 。

Returns: 

Returns: 

Returns: 

Returns: -

Returns: 

Returns: 0

Returns: :

Returns: 

Returns: 正

Returns: 常

Returns: 删

Returns: 除

Returns: 。

Returns: 

Returns: 

Returns: 

Returns: -

Returns: 

Returns: -

Returns: 2

Returns: :

Returns: 

Returns: 删

Returns: 除

Returns: 成

Returns: 功

Returns: ，

Returns: 但

Returns: 无

Returns: 法

Returns: 与

Returns: 实

Returns: 盘

Returns: 关

Returns: 联

Returns: 的

Returns: 托

Returns: 管

Returns: 者

Returns: 联

Returns: 系

Returns: ，

Returns: 请

Returns: 手

Returns: 动

Returns: 删

Returns: 除

Returns: 文

Returns: 件

Returns: 

Returns: 1

Returns: 2

Returns: 3

Returns: .

Returns: d

Returns: b

Returns: 3

Returns: ！

##### GetStrategyList

```GetStrategyList```方法用于获取平台策略信息。

Parameters:

- `offset` (number, required): ```offset```参数用于设置查询的偏移量。
- `length` (number, required): ```length```参数用于设置查询返回的数据条数。
- `strategyType` (number, required): ```strategyType```参数用于设置要查询的策略类型。

- ```strategyType```参数设置为```0```：查询所有策略。

- ```strategyType```参数设置为```1```：查询已公开的策略。

- ```strategyType```参数设置为```2```：查询待审核的策略。
- `category` (number, required): ```category```参数用于设置要查询的策略类别。

- ```category```参数设置为```-1```：查询所有策略。

- ```category```参数设置为```0```：查询通用策略。
- `needArgs` (number, required): ```needArgs```参数用于设置查询的策略是否需要参数。

- ```needArgs```参数设置为```0```：查询所有策略。
- `language` (number, required): ```language```参数用于设置要查询的策略编程语言。

- ```language```参数设置为```0```：JavaScript语言。

- ```language```参数设置为```1```：Python语言。

- ```language```参数设置为```2```：C++语言。

- ```language```参数设置为```3```：可视化策略。

- ```language```参数设置为```4```：My语言。

- ```language```参数设置为```5```：PINE语言。
- `kw` (string, required): ```kw```参数用于设置查询策略的关键字。

- 设置为空字符串表示不使用关键字筛选。

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

Returns: 符

Returns: 合

Returns: 筛

Returns: 选

Returns: 条

Returns: 件

Returns: 的

Returns: 策

Returns: 略

Returns: 总

Returns: 数

Returns: 。

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

Returns: 查

Returns: 询

Returns: 返

Returns: 回

Returns: 的

Returns: 策

Returns: 略

Returns: 详

Returns: 细

Returns: 信

Returns: 息

Returns: 。

##### NewRobot

```NewRobot```方法用于创建请求中```API KEY```对应的发明者量化交易平台账号下的实盘。

Parameters:

- `settings` (JSON对象, required): 实盘配置参数，```settings```参数格式如下：

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

- group: 指定实盘分组。
- args: 策略参数，如果策略没有参数则为空数组。
- exchanges: 交易所对象配置，可参考```RestartRobot```接口。

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

Returns: 创

Returns: 建

Returns: 成

Returns: 功

Returns: ，

Returns: 返

Returns: 回

Returns: 实

Returns: 盘

Returns: I

Returns: D

Returns: 。

```settings```参数中```eid```配置的```"meta":{"AccessKey": "123", "SecretKey": "123"}```等敏感信息，发明者量化交易平台不会存储。这些数据将直接转发给托管者程序，因此每次创建或重启实盘时必须配置此信息。

如果创建使用通用协议交易所对象的实盘，在配置```settings```参数时，```exchanges```属性可使用如下设置：
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

```label```属性用于为当前通用协议接入的交易所对象设置标签，在策略中可使用```exchange.GetLabel()```函数获取。

##### PluginRun

```PluginRun```方法用于调用发明者量化交易平台的**调试工具**功能；仅支持JavaScript语言。

Parameters:

- `settings` (JSON对象, required): 调试工具中的设置参数，```settings```配置中包含测试代码，位于```source```属性中。```settings```参数格式如下：

```json
{
    "exchanges":[{"pair":"SOL_USDT","pid":123}],
    "node":123,
    "period":60,
    "source":"function main() {Log(\"Hello FMZ\")}"
}
```

- source: 需要调试的代码。
- node: 托管者ID，可指定在哪个托管者上运行实盘。若该值为-1，则表示自动分配。
- exchanges: 交易所对象配置，可参考```RestartRobot```接口。

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

Returns: 调

Returns: 试

Returns: 工

Returns: 具

Returns: 成

Returns: 功

Returns: 执

Returns: 行

Returns: 传

Returns: 入

Returns: 的

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

Returns: 代

Returns: 码

Returns: 后

Returns: 返

Returns: 回

Returns: 的

Returns: 测

Returns: 试

Returns: 结

Returns: 果

Returns: 数

Returns: 据

Returns: 。

```{"eid": "OKEX", "pair": "ETH_BTC", "meta" :{"AccessKey": "123", "SecretKey": "123"}}```
```{"eid": "Huobi", "pair": "BCH_BTC", "meta" :{"AccessKey": "123", "SecretKey": "123"}}```

对于```settings```中的```exchanges```属性，调用```PluginRun```方法时只需设置一个（在调试工具页面使用时也仅支持一个交易所对象）。在```settings```中设置2个交易所对象不会引发报错，但在代码中访问第二个交易所对象时将会报错。

##### GetRobotLogs

```GetRobotLogs```方法用于获取请求中```API KEY```对应的FMZ量化交易平台账号下的实盘日志信息。要获取日志信息的实盘ID由```robotId```参数指定。

Parameters:

- `robotId` (number, required): ```robotId```参数用于指定要获取日志信息的实盘ID。可以使用```GetRobotList```方法获取账号下的实盘信息，其中包含实盘ID。
- `logMinId` (number, required): ```logMinId```参数用于指定日志记录的最小ID。
- `logMaxId` (number, required): ```logMaxId```参数用于指定日志记录的最大ID。
- `logOffset` (number, required): ```logOffset```参数用于设置偏移量。在由```logMinId```和```logMaxId```确定的范围内，根据```logOffset```跳过指定数量的记录，从而确定数据获取的起始位置。
- `logLimit` (number, required): ```logLimit```参数用于设置从起始位置开始要获取的数据记录条数。
- `profitMinId` (number, required): ```profitMinId```参数用于设置收益日志的最小ID。
- `profitMaxId` (number, required): ```profitMaxId```参数用于设置收益日志的最大ID。
- `profitOffset` (number, required): ```profitOffset```参数用于设置偏移量，即跳过指定数量的记录作为起始位置。
- `profitLimit` (number, required): ```profitLimit```参数用于设置从起始位置开始要获取的数据记录条数。
- `chartMinId` (number, required): ```chartMinId```参数用于设置图表数据记录的最小ID。
- `chartMaxId` (number, required): ```chartMaxId```参数用于设置图表数据记录的最大ID。
- `chartOffset` (number, required): ```chartOffset```参数用于设置偏移量。
- `chartLimit` (number, required): ```chartLimit```参数用于设置要获取的记录条数。
- `chartUpdateBaseId` (number, required): ```chartUpdateBaseId```参数用于设置查询更新记录的基准ID。
- `chartUpdateDate` (number, required): ```chartUpdateDate```参数用于设置数据记录的更新时间戳，系统将筛选出大于此时间戳的记录。
- `summaryLimit` (number, required): ```summaryLimit```参数用于设置要查询的状态栏数据字节数。该参数为整型，用于查询实盘的状态栏数据。

设置为0表示不查询状态栏信息；设置为非0值表示要查询的状态栏信息字节数（此接口不限制数据量，可以指定一个较大的summaryLimit参数来获取所有状态栏信息）。状态栏数据存储在返回数据的```summary```字段中。

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

Returns: 日

Returns: 志

Returns: 信

Returns: 息

Returns: ；

Returns: 查

Returns: 询

Returns: 出

Returns: 的

Returns: 若

Returns: 干

Returns: 条

Returns: 日

Returns: 志

Returns: 数

Returns: 据

Returns: 存

Returns: 储

Returns: 在

Returns: A

Returns: r

Returns: r

Returns: 字

Returns: 段

Returns: 中

Returns: 。

Returns: 

Returns: 

Returns: 

Returns: l

Returns: o

Returns: g

Returns: s

Returns: 中

Returns: 第

Returns: 一

Returns: 个

Returns: 数

Returns: 据

Returns: 结

Returns: 构

Returns: 为

Returns: 实

Returns: 盘

Returns: 数

Returns: 据

Returns: 库

Returns: 中

Returns: 策

Returns: 略

Returns: 日

Returns: 志

Returns: 表

Returns: 的

Returns: 日

Returns: 志

Returns: 记

Returns: 录

Returns: 。

Returns: 

Returns: 

Returns: 

Returns: l

Returns: o

Returns: g

Returns: s

Returns: 中

Returns: 第

Returns: 二

Returns: 个

Returns: 数

Returns: 据

Returns: 结

Returns: 构

Returns: 为

Returns: 实

Returns: 盘

Returns: 数

Returns: 据

Returns: 库

Returns: 中

Returns: 收

Returns: 益

Returns: 日

Returns: 志

Returns: 表

Returns: 的

Returns: 日

Returns: 志

Returns: 记

Returns: 录

Returns: 。

Returns: 

Returns: 

Returns: 

Returns: l

Returns: o

Returns: g

Returns: s

Returns: 中

Returns: 第

Returns: 三

Returns: 个

Returns: 数

Returns: 据

Returns: 结

Returns: 构

Returns: 为

Returns: 实

Returns: 盘

Returns: 数

Returns: 据

Returns: 库

Returns: 中

Returns: 图

Returns: 表

Returns: 日

Returns: 志

Returns: 表

Returns: 的

Returns: 日

Returns: 志

Returns: 记

Returns: 录

Returns: 。

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

Returns: 实

Returns: 盘

Returns: 状

Returns: 态

Returns: 栏

Returns: 数

Returns: 据

Returns: 。

- 数据库中的策略日志表
  返回数据中```logs```的属性值（数组结构）的第一个元素中（日志数据）```Arr```属性值描述如下：

  ```plaintext
  "Arr": [
      [3977, 3, "Futures_OKCoin", "", 0, 0, "Sell(688.9, 2): 20016", 1526954372591, "", ""],
      [3976, 5, "", "", 0, 0, "OKCoin:this_week 仓位过多, 多: 2", 1526954372410, "", ""]
  ],
  ```

  | id | logType | eid | orderId | price | amount | extra | date | contractType | direction |
  | - | - | - | - | - | - | - | - | - | - |
  | 3977 | 3 | "Futures_OKCoin" | "" | 0 | 0 | "Sell(688.9, 2): 20016" | 1526954372591 | "" | "" |
  | 3976 | 5 | "" | "" | 0 | 0 | "OKCoin:this_week 仓位过多, 多: 2" | 1526954372410 | "" | "" |

  ```extra```为打印日志的附加信息。

  ```logType```值对应的日志类型描述如下：

  | logType: | 0 | 1 | 2 | 3 | 4 | 5 | 6 |
  | - | - | - | - | - | - | - | - |
  | logType意义: | BUY | SALE | RETRACT | ERROR | PROFIT | MESSAGE | RESTART |
  | 中文意义 | 买入订单日志 | 卖出订单日志 | 撤单 | 错误 | 收益 | 消息 | 重启 |

- 数据库中的收益图表日志表
  该图表日志表数据与策略日志表中的收益日志保持一致。

  ```plaintext
  "Arr": [
      [202, 2515.44, 1575896700315],
      [201, 1415.44, 1575896341568]
  ]
  ```

  以其中一条日志数据为例：

  ```plaintext
  [202, 2515.44, 1575896700315]
  ```

  ```202```为日志ID，```2515.44```为收益数值，```1575896700315```为时间戳。
- 数据库中的图表日志表

  ```plaintext
  "Arr": [
      [23637, 0, "{\"close\":648,\"high\":650.5,\"low\":647,\"open\":650,\"x\":1575960300000}"],
      [23636, 5, "{\"x\":1575960300000,\"y\":3.0735}"]
  ]
  ```

  以其中一条日志数据为例：

  ```plaintext
  [23637, 0, "{\"close\":648,\"high\":650.5,\"low\":647,\"open\":650,\"x\":1575960300000}"],
  ```

  ```23637```为日志ID，```0```为图表数据系列索引，最后的数据```"{\"close\":648,\"high\":650.5,\"low\":647,\"open\":650,\"x\":1575960300000}"```为日志数据，该条数据为图表上的K线数据。

## MCP 服务

MCP（Model Context Protocol）服务是一个用于模型上下文管理的协议服务，提供统一的接口来管理和交换AI模型的上下文信息。该服务支持多种数据格式和通信协议，确保不同AI系统之间的互操作性和数据一致性。

配置及使用场景请参考：

[FMZ平台Claude智能交易指南（1）](https://www.fmz.com/digest-topic/10690)

[FMZ平台Claude智能交易指南（2）](https://www.fmz.com/digest-topic/10692)

## 交易终端

发明者量化交易平台提供模块化、可定制的[交易终端](https://www.fmz.com/m/trade)页面。用户可以自由添加各种数据模块、交易功能模块，甚至可以编写代码开发自定义模块（交易终端插件）。

凭借高度灵活、自由的使用方式，极大地方便了手动交易和半程序化交易用户。交易终端页面上的各种模块均支持拖动、缩放，可以修改模块绑定的交易对、交易所等设置，并可添加多个同类型模块。

发明者量化交易平台持续完善交易终端功能，为更好地支持手动交易，推出了交易终端插件功能。

交易终端的相关数据存储在托管者程序（robot可执行文件）的运行目录下，具体路径为：```logs/storage/0```。如果交易终端使用的交易所对象采用密钥文件路径方式配置，需要将密钥文件放置在该目录中。

### 插件原理

原理与**调试工具**相同，将一段代码发送到交易终端页面选定的托管者执行，支持返回图表和表格（调试工具目前也已升级支持此功能）。与**调试工具**功能相同，仅能执行3分钟，该功能不计费。可用于实现辅助手动交易的简单功能，复杂策略仍需运行实盘。

### 插件编写

创建交易终端插件，可在**新建策略**页面将策略类型设置为「交易插件」。交易插件支持```JavaScript```、```Python```、```C++```、```My语言```。

### 插件用途

插件可以运行一段代码，执行一些简单的操作，例如冰山委托、挂单、撤单、计算等任务。与调试工具一样，插件通过 return 返回结果，也可以直接返回图表和表格。下面列举几个示例，其他功能可自行探索。

- 返回深度快照
  ```js
  // 返回深度的快照
  function main() {
      var tbl = {
          type: 'table',
          title: '深度快照 @ ' + _D(),
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
          "title": "深度快照 @ " + _D(),
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
          r##"{{"type": "table", "title": "深度快照 @ {}", "cols": ["#", "Amount", "Ask", "Bid", "Amount"], "rows": [{}]}}"##,
          _D(None), rows.join(","));

      LogStatus!(format!("`{}`", tbl));
      // Rust 不支持return json 显示表格，可以创建实盘显示状态栏表格
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

      tbl["title"] = "深度快照 @" + _D();
      auto d = exchange.GetDepth();
      for(int i = 0; i < 5; i++) {
          tbl["rows"].push_back({format("%d", i), format("%f", d.Asks[i].Amount), format("%f #FF0000", d.Asks[i].Price), format("%f #0000FF", d.Bids[i].Price), format("%f", d.Bids[i].Amount)});
      }

      LogStatus("`" + tbl.dump() + "`");
      // C++ 不支持return json 显示表格，可以创建实盘显示状态栏表格
  }
  ```
- 绘制跨期差价
  ```js
  // 画跨期差价
  var chart = {
      __isStock: true,
      title : { text : '差价分析图'},
      xAxis: { type: 'datetime'},
      yAxis : {
          title: {text: '差价'},
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
      "title": {"text": "差价分析图"},
      "xAxis": {"type": "datetime"},
      "yAxis": {
          "title": {"text": "差价"},
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
  // C++ 不支持 return json 结构画图
  ```

**策略广场**中还有其他范例可供参考，例如：逐笔小量买入/卖出。

### 使用方式

- 添加交易终端插件模块
  在交易终端页面打开模块添加菜单，当前FMZ账号策略库中的交易终端插件将自动显示在列表中，找到需要添加的插件并点击添加。
  - 运行插件
  点击「执行」按钮，交易终端插件即开始运行。插件不会显示日志信息，但可以返回并显示数据表格。
- 插件运行时间
  交易终端插件的最长运行时间为3分钟，超过3分钟将自动停止运行。

## 数据探索

发明者量化自研的**datadata**平台是一个量化金融数据平台，发明者量化交易平台[数据探索](https://www.fmz.com/m/database)模块已集成**datadata**平台的服务和功能。

发明者量化用户无需重新注册**datadata**账号，即可开箱即用。使用户在多维度数据分析、挖掘、数据可视化、交易策略探索等方面更具优势。通过SQL查询分析海量数据，并借助可视化界面进行配置，生成适用于数据分析的多种图表并与团队共享，助您轻松掌握市场动态，精准把握投资机会！使用示例请参考：[数据探索模块专题文章](https://www.fmz.com/digest-topic/10370)。

### 数据源

DataData平台提供的数据源实时持续更新，提供多维度、多类型的数据支持。支持使用私有数据作为数据源，支持上传CSV格式文件，并可在「数据探索」页面预览数据。

### 数据查询

支持使用SQL语句查询数据，并可配置查询参数。支持以下数据导出格式：CSV文件、JSON文件。

### 保存探索研究

如需保存当前数据探索研究的内容，请点击右上角的「保存」按钮，将此SQL查询记录保存至当前FMZ账户「数据探索」的资源列表中（资源列表按钮位于保存按钮左侧）。

### 数据图形化

分析和查询得出的数据除了可以使用表格形式展示外，还可以适配多种可视化组件，以更加丰富生动的方式展示数据。

### 分享研究

支持分享数据探索研究成果，支持多种分享形式：公开链接、嵌入代码（例如在FMZ平台社区帖子中嵌入）、嵌入网页、数据链接、预览图链接。数据探索模块的研究成果除了用于展示外，还可以通过创建的「数据链接」直接为策略提供数据，支持实盘和回测环境。

## Alpha因子分析工具

分析公式参考了```worldquant```公开的[```alpha101```](https://github.com/yli188/WorldQuant_alpha101_code/blob/master/101%20Formulaic%20Alphas.pdf)中的行情计算方法，基本兼容其语法（未实现的功能已说明），并进行了增强。该工具用于快速对时间序列进行运算和验证交易想法。[Alpha因子分析工具页面](https://www.fmz.com/m/alpha)。

### 函数和操作符

**下面的"{}"代表占位符，所有表达式大小写不敏感，x代表数据时间序列**

- ```abs(x), log(x), sign(x)```字面意思，分别是绝对值、对数、符号函数。

以下操作符``` +, -, *, /, >, < ```也符合其标准的含义，```==```：是否相等，```||```：逻辑或，```x ? y : z```：三元条件运算符。

- ```rank(x)``` ：横截面排序，返回所在百分位。需要指定候选标的池，用于单个行情时无法计算，将直接返回原始结果。
- ```delay(x, d)``` ： 返回序列x在d个周期前的值。
- ```sma(x, d)``` ： 计算序列x在d个周期内的简单移动平均值。
- ```correlation(x, y, d)```：计算时间序列x和y在过去d个周期内的相关系数。
- ```covariance(x, y, d)``` ：计算时间序列x和y在过去d个周期内的协方差。
- ```scale(x, a)``` ：归一化数据，使得```sum(abs(x))=a```(a默认为1)。
- ```delta(x, d)``` ：计算时间序列x的当前值减去d个周期前的值。
- ```signedpower(x, a)``` ： ```x^a```。
- ```decay_linear(x, d)``` ：计算时间序列x的d周期加权移动平均值，权重为d,d-1,d-2....1(经过归一化处理)。
- ```indneutralize(x, g)``` ： 针对行业分类g进行中性化处理，目前不支持。
- ```ts_{O}(x, d)``` ： 对时间序列x的过去d个周期执行O操作(O可具体代表min、max等，详见下文），d会转换为整数。
- ```ts_min(x, d)``` ： 过去d个周期的最小值。
- ```ts_max(x, d)``` ： 过去d个周期的最大值。
- ```ts_argmax(x, d)``` ： ```ts_max(x, d)```的位置。
- ```ts_argmin(x, d)``` ： ```ts_min(x, d)```的位置。
- ```ts_rank(x, d)``` ： 时间序列x在过去d个周期内的排序（百分位排序）。
- ```min(x, d)``` ： ```ts_min(x, d)```。
- ```max(x, d)```： ```ts_max(x, d)```。
- ```sum(x, d)``` ：过去d个周期的累计和。
- ```product(x, d)``` ：过去d个周期的累计积。
- ```stddev(x, d)``` ：过去d个周期的标准差。

### 输入数据

**输入数据不区分大小写，默认数据为网页上选择的品种，也可直接指定，例如：```binance.ada_bnb```**

- ```returns```：收盘价收益率。
- ```open, close, high, low, volume```：周期内的开盘价、收盘价、最高价、最低价和成交量。
- ```vwap```：成交量加权平均价（暂未实现，当前使用收盘价）。
- ```cap```：总市值（暂未实现）。
- ```IndClass```：行业分类（暂未实现）。

### 其它

支持一次输出多个结果，使用列表形式表示。例如```[sma(close, 10), sma(high, 30)]```将在图表中绘制两条线。除了输入时间序列数据外，还可以作为简单的计算器使用。

## 通用协议

对于发明者量化交易平台尚未封装对接的交易所API接口，可通过编写通用协议插件程序进行接入。

![通用协议配置截图](https://www.fmz.com/upload/asset/2e43b059b3ec9f42ded6e.png)

该通用协议可用于接入任何提供API接口的交易所，支持以下两种协议：
- ```REST```协议：[参考文档](https://www.fmz.com/digest-topic/10518)。
- ```FIX```协议：[参考项目](https://github.com/fmzquant/fixc)。

```FIX```协议插件程序与```REST```协议插件程序的区别仅在于插件程序与交易所接口的交互方式不同。协议插件程序与发明者量化托管者程序的交互方式、数据格式等细节处理完全相同，具体实现可参考上述链接中的示例。

## 调试工具

[调试工具](https://www.fmz.com/m/debug)页面提供了一个用于快速测试实盘代码的免费环境，目前仅支持```JavaScript```语言。

![调试工具](https://www.fmz.com/upload/asset/2e48d6d1bc77e46099058.png)

使用调试工具测试代码时，代码将直接在指定的托管者上运行，最长运行时间为3分钟。支持调用发明者量化交易平台的所有API函数，但仅支持单个交易所对象。

## 远程编辑

![远程编辑截图](https://www.fmz.com/upload/asset/2e4e8975d1e32517fd989.png)

支持使用本地编辑器远程同步策略代码至发明者量化交易平台，支持```Sublime Text```/```Atom```/```Vim```/```VSCode```编辑器。

![远程编辑支持的编辑器插件](https://www.fmz.com/upload/asset/2e4da2d2a1fc4bc9bbce5.png)

在策略编辑页面点击「远程编辑」展开插件下载地址按钮，显示当前策略的远程同步密钥（token）。
- 点击「更新密钥」可刷新当前策略的密钥（token）。
- 点击「删除密钥」可删除当前策略的密钥（token）。

点击页面上的```Sublime Text 3 Plugin```/```Atom Plugin```/```Vim Plugin```/```VSCode Plugin```编辑器插件下载按钮即可跳转至对应的插件项目，不同编辑器的插件安装方式略有差异。

## 完整策略的导入与导出

![策略导入导出截图](https://www.fmz.com/upload/asset/2e52ccf44526f396fb795.png)

- 下载源码
  导出策略源代码，导出的文件类型取决于策略所使用的编程语言。```JavaScript```策略导出为扩展名为```js```的文件；Python策略导出为扩展名为```py```的文件；C++策略导出为扩展名为```cpp```的文件；My语言（麦语言）策略导出为扩展名为```txt```的文件。
  注意：仅导出策略源代码，不包含策略参数、模板引用等配置信息。

- 导出策略
  导出完整的策略配置，包含策略源代码、参数设置等所有策略相关信息，导出的文件格式为```xml```。

- 导入策略
  使用「导出策略」功能导出的```xml```文件，在策略编辑页面点击「导入策略」按钮，选择需要导入的```xml```文件即可导入完整的策略配置。
  导入完成后需要点击「保存」按钮以保存策略。

## 多语言支持

策略名称和策略参数的描述均可采用```中文|英文```的格式书写，使网页能够自动识别并显示相应的语言。在其它使用场景中，例如**策略描述**、**使用说明**等```Markdown```格式的文本，使用```[trans]中文|英文[/trans]```或```[trans]中文||英文[/trans]```同样可以实现语言的自动识别。切换语言后，刷新网页即可生效。此外，在策略代码中，凡是可以写入字符串的函数也支持语言切换，例如```Log()```函数、```LogStatus()```函数等。

```js
function main() {
    Log("[trans]日志|log[/trans]")
    var table = {
        type: "table",
        title: "[trans]操作|option[/trans]",
        cols: ["[trans]列1|col1[/trans]", "[trans]列2|col2[/trans]", "[trans]操作|option[/trans]"],
        rows: [
            ["[trans]比特币|BTC[/trans]", "[trans]以太坊|ETH[/trans]", {"type": "button", "cmd": "coverAll", "name": "平仓|cover", "description": "描述|description"}]  // 注意：按钮中不用加[trans]标签
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

## 实盘、策略分组

在发明者量化交易平台的「实盘」页面和「策略库」页面，可以点击右侧的**分组管理**按钮，对策略和实盘进行分组管理。
例如，在进行策略分组管理时，可以将**模板类库**归为一组、**JavaScript语言的策略**归为一组、**测试用策略**归为一组。

- 策略分组
  ![策略分组](https://www.fmz.com/upload/asset/2e482ba9b9aa272085d00.png)

- 实盘分组
  ![实盘分组](https://www.fmz.com/upload/asset/2e577d050e817837bbfdf.png)

## 实盘展示

发明者量化交易平台提供多种展示策略实盘运行状态的方式。

### 子账号

登录平台后，点击「控制中心」、「账号设置」跳转到FMZ账户[管理页面](https://www.fmz.com/m/account)。点击「子账户组」可以看到子账户创建页面，在**操作权限**控件中选择所创建子账号可以访问的实盘，在**用户信息**控件中设置子账号的**用户名**和**子账号登录密码**。点击「创建子账户」按钮即可创建一个子账号。创建后的子账号会在当前页面显示，并且可以进行「修改」、「锁定/解锁」、「删除」操作。

  子账号仅拥有有限权限，只能查看**操作权限**设置中授权的实盘。对于已授权的实盘，子账号拥有修改参数、停止实盘、重启实盘的权限，但无法修改实盘配置的交易所对象。

  ![子账号设置](https://www.fmz.com/upload/asset/2e46d725dbe6b471f1b33.png)

  子账号的使用场景通常包括：
  - 1、量化团队管理多个实盘策略时，便于登录和管理。
  - 2、策略出租时，用于用户的实盘调试工作。

### 实盘围观

在发明者量化交易平台[实盘页面](https://www.fmz.com/m/robots)的实盘列表中点击「公开」按钮即可公开展示当前行的实盘。

实盘围观目前支持两种方式：
- 1、在发明者量化交易平台的[实盘围观](https://www.fmz.com/live)页面公开展示实盘。点击「公开」按钮后选择**公开分享**即可。
- 2、创建实盘围观私有链接。
  点击「公开」按钮后选择**内部分享**，设置有效期后即可生成私有链接，用于访问该策略实盘的私有围观页面。

## 策略分享与出租

在[策略库](https://www.fmz.com/m/strategies)页面，点击策略右侧的「操作项」按钮后，弹出菜单中包含分享和出租操作选项。

重要提示：创建和分发策略**注册码**时，请务必仔细确认是「注册码」还是「复制码」，以免误将策略泄露。

### 策略分享

![策略分享](https://www.fmz.com/upload/asset/2e593d57dc36afc004ef6.png)

- 公开分享
  点击「分享」按钮后会弹出对话框，可以选择「公开分享」。策略将完整地分享到平台的策略广场，任何用户都可以复制该策略。

- 内部分享
  点击「分享」按钮后会弹出对话框，可以选择「内部分享」。选择分享有效期、分享次数后会生成该策略的**复制页面地址**和**复制码**。可以分发给指定的FMZ平台用户，需要该策略的用户只需使用**复制页面地址**链接，登录**复制页面**后输入复制码即可获取该策略，获取后策略会自动出现在策略库中。

### 策略出租

![策略出租](https://www.fmz.com/upload/asset/2e4e78f6c46c9dde1ce90.png)

- 公开出售
  点击「出租」按钮后会弹出对话框，可以选择「公开出售」。策略即可申请上架（需要通过审核）。

- 内部出售
  点击「出租」按钮后会弹出对话框，可以选择「内部出售」。选择使用天数、最大并发数、注册码数量后，系统会生成该策略的**注册页面地址**和**注册码**。您可以将其分发给指定的FMZ平台用户，需要该策略的用户只需访问**注册页面地址**链接，登录**注册页面**后输入注册码即可获取策略的使用权。策略也会出现在策略库中，但用户只有回测和实盘使用权限，无法查看策略源码等信息。并发实盘个数设置为0时表示不限制并发数量，允许无限制地创建实盘。

## 实盘消息推送

[推送设置页面](https://www.fmz.com/m/account#push)中可以开启消息推送功能。

![推送设置](https://www.fmz.com/upload/asset/2e4ad17706aa842c914ce.png)

- 移动端（App）
  开启移动端App推送后，实盘程序发出的推送消息将发送至发明者量化移动端App。
- 邮箱
  开启邮箱推送需先验证邮箱，验证通过后即可接收实盘程序发出的推送消息。
- WebHook
  开启WebHook推送后，可自定义推送地址，例如设置为：```http://abc.com/push.php?data={body}```。
  当实盘程序发出推送消息时，平台会向所设置的地址```http://abc.com/push.php?data={body}```发送一个请求（仅支持```GET```方法），推送的消息内容将替换到```{body}```位置。

策略中推送消息
- JavaScript/TypeScript/Python/Rust/C++语言
  在策略代码中，可使用```Log()```函数以及其它能在日志区域输出日志信息的函数，例如：```exchange.CreateOrder()```、```exchange.CancelOrder()```等。
  为这些函数传入一个附带参数```"@"```（即在必要参数之外再增加一个附带参数），例如：```Log("This is a push message", "@")```，即可将这条输出的日志信息进行推送，平台会根据「推送设置」进行消息推送。Rust语言中对应```Log!```宏，用法相同：```Log!("This is a push message", "@");```。
- PINE语言/My语言
  在PINE语言/My语言策略所集成的「交易类库」参数中，可开启交易日志推送，触发交易动作后将自动进行推送。
- Blockly可视化
  在「工具」一栏中选择**消息推送**模块，即可实现指定信息的推送。

消息推送存在频率限制，具体规则如下：在实盘的每个20秒周期内，仅保留并推送最后一条消息，其余消息将被过滤，不予推送。

## 实盘报错、异常退出的常见原因

- 策略静态语法错误

  ![编辑器中语法错误](https://www.fmz.com/upload/asset/2e4daebbb80548adf3927.png)

  此类错误较为明显，通常在策略编辑页面可以看到错误标记，在回测时即可发现并纠正。
- 策略运行时错误
  最常见的情况是对函数返回值不进行合法性判断就直接使用。
- 内存占用过度
  在全局变量中保存过多无法进行垃圾回收的内容，导致内存占用过大。
- 未合理使用```exchange.Go```函数并发请求
  使用异步```exchange.Go```函数时，没有合理使用```wait```等待协程结束，导致协程数量过多。
- 函数递归调用
  函数递归调用层数过深，导致超出协程堆栈大小限制。
- 接口业务错误、网络请求错误等
  此类报错会显示相关的交易所对象名称、函数名称、错误相关的消息和原因等信息。此类错误不会导致实盘异常停止（此类报错通常是起因，但并非直接原因，直接原因通常是**未对接口返回值进行合法性判断就直接使用而引起的程序异常**）。
- 平台底层报错
  常见的有```Decrypt: Secret key decrypt failed```错误，该错误会导致实盘无法启动。错误原因是修改了发明者量化交易平台的账号密码，导致所有已配置的```API KEY```失效，需要重新配置```API KEY```并重启托管者即可。
- Python策略加密问题
  Python策略出租时，由于平台加密策略的Python版本与策略运行时的Python版本不兼容导致的报错：```ValueError: bad marshal data (unknown type code) ```，将策略运行的Python环境升级或安装为```Python 2.7```、```Python 3.5```、```Python 3.6```中任一策略支持的版本即可。
- ```interrupt```错误
  该错误是由于程序在执行某个操作（例如访问交易所接口）时，用户点击了实盘页面上的**停止实盘按钮**，实盘停止中断了当前操作而打印的报错信息。该报错不会产生实质影响，仅是一条日志记录。

[常见问题汇总](https://www.fmz.com/bbs-topic/1427)。

## 交易所特殊说明

- 富途证券
  支持富途牛牛实盘交易、模拟盘交易，需要下载[```FutuOpenD```](https://www.futunn.com/download/OpenAPI?lang=zh-CN)软件。
  使用```FutuOpenD```接入模拟交易时，部分股票代码不受支持，因此无法交易；但富途牛牛手机APP支持模拟交易。
  在发明者量化平台上配置交易所对象、运行```FutuOpenD```软件等操作，请参阅[富途证券配置说明文档](https://www.fmz.com/bbs-topic/10185)。

  - 接口调用频率
    ```GetOrder```、```GetOrders```、```GetPositions```、```GetAccount```函数默认使用**缓存数据**，因此不限制调用频率。
    当有新数据时，```FutuOpenD```会自动更新数据，**缓存数据**也会随之同步更新。

    调用```exchange.IO("refresh", true)```函数可以禁用缓存；**禁用缓存**后，调用频率限制为**每30秒内最多请求10次查询**，超过该频率限制将会报错。

  - 股票代码
    例如：```600519.SH```
    - HK 港股
    - US 美股
    - SH 沪股
    - SZ 深股

    在策略代码中使用```exchange.SetContractType()```函数设置股票代码，例如：

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

    设置交易方向的函数```exchange.SetDirection```、下单函数```exchange.Buy```/```exchange.Sell```、
    撤单函数```exchange.CancelOrder```、查询订单函数```exchange.GetOrder```等，使用方法均与期货市场相同。

  - 账户信息数据格式：
    使用```TrdMarket```定义市场，用以区分```香港市场```、```美国市场```和```大陆市场```。

    摘录自[```Futu API```文档](https://openapi.futunn.com/futu-api-doc/)：
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

    获取账户信息数据，```exchange.GetAccount()```函数返回：
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

  - ```FutuOpenD```根据登录的**IP**地址进行地区区分
    使用非大陆IP地址登录的账户在获取行情数据时会受到限制，具体请查阅```FutuOpenD```（富途）官方文档。
- 盈透证券
  配置交易所：
  使用盈透需要在托管者所在的系统环境中运行「IB Gateway」或「TWS (Trader Workstation)」软件，此处以「TWS」软件为例。运行「TWS」并登录后，点击软件右上角的配置按钮打开软件配置界面。
  - 选择：「配置」->「API」->「设置」，不要勾选「只读API」选项，需要勾选「启用ActiveX和套接字客户端」选项，注意配置中的「套接字端口」（TWS默认端口为7496实盘/7497模拟盘）。
  - 在平台的添加交易所页面「https://www.fmz.com/m/platforms/add」选择**盈透证券(Interactive Brokers)**，并配置参数。在「服务器地址」配置项中填写「TWS」软件对应的地址（如127.0.0.1或localhost）与端口即可，例如：```localhost:7496```。

  支持市场：
  - 目前仅支持美股市场，暂不支持期货、外汇等其它市场。
  - 美股市场股票代码格式示例：
    苹果公司(Apple Inc.)在纳斯达克(NASDAQ)交易所的股票代码：```AAPL.US```。
    特斯拉公司(Tesla, Inc.)在纳斯达克(NASDAQ)交易所的股票代码：```TSLA.US```。
- Futures_Binance
  支持币安的中文交易对：

  ```js
  function main() {
      let ticker = exchange.GetTicker("币安人生_USDT.swap")
      Log("ticker:", ticker)   // {"Info":{...},"Symbol":"币安人生_USDT.swap","Open":0.29622,"High":0.31661, ...}
  }
  ```

  关于币安期货的```exchange.IO()```切换功能（双向持仓、逐仓/全仓、统一账户、STP模式等），请参考`exchange.IO`函数文档。
- Futures_HuobiDM
  - 切换地址：
    使用```exchange.IO("base", "https://xxx.xxx.xxx")```或```exchange.SetBase("https://xxx.xxx.xxx")```切换交易所接口的基础地址。

  支持火币的中文交易对：

  ```js
  function main() {
      let ticker = exchange.GetTicker("币安人生_USDT.swap")
      Log("ticker:", ticker)   // {"Info":{...},"Symbol":"币安人生_USDT.swap","Open":0.29622,"High":0.31661, ...}
  }
  ```

  关于火币期货的```exchange.IO()```切换功能（signHost、逐仓/全仓、持仓单向/双向、统一账户等），请参考`exchange.IO`函数文档。
- Huobi
  - 切换特殊交易对：
    支持火币现货杠杆代币，例如```LINK*(-3)```，交易所定义的代码为```link3susdt```，在发明者量化交易平台上设置该交易对时写作```LINK3S_USDT```。
    也可以在策略中切换交易对：

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

  支持火币的中文交易对：

  ```js
  function main() {
      let ticker = exchange.GetTicker("币安人生_USDT")
      Log("ticker:", ticker)   // {"Info":{...},"Symbol":"币安人生_USDT","Open":0.29622,"High":0.31661, ...}
  }
  ```

- Futures_Bibox
  - 不支持的接口：
    该交易所不提供查询当前挂单和查询市场历史成交记录的接口，因此不支持```GetOrders```、```GetTrades```函数。
- BitMEX
  - 市价单买单
    BitMEX现货交易下单接口中，市价单买单的下单量不是金额，而是交易币数。
- Bitfinex
  - 市价单买单
    Bitfinex现货交易下单接口中，市价单买单的下单量不是金额，而是交易币数。
- AscendEx
  - 市价单买单
    AscendEx现货交易下单接口中，市价单买单的下单量不是金额，而是交易币数。
- Futures_Phemex
  - K线接口
    该交易所K线接口返回的数据不包含当前Bar数据。
  - 切换逐仓/全仓：
    该交易所未提供切换全仓/逐仓的接口，需要在交易所端进行设置。
- Futures_Aevo
  - 订单```Id```说明：
    该交易所订单```Id```由实际```Id```和订单时间戳组成，二者之间使用英文逗号分隔，目的是为了支持```exchange.GetOrder(Id)```函数查询订单。由于交易所返回数据中的订单时间戳会随订单状态变化，如果本地需要记录订单```Id```等信息，请分离出实际订单```Id```后再进行记录。
- Futures_dYdX
  目前支持dYdX v4版本，请参考[dYdX v4 使用指南](https://www.fmz.com/digest-topic/10564)。
- Futures_Hyperliquid
  请参考[Hyperliquid 使用指南](https://www.fmz.com/digest-topic/10574)。

  关于Hyperliquid期货的```exchange.IO()```切换功能（逐仓/全仓、主网/测试网、vaultAddress、walletAddress、expiresAfter等），请参考`exchange.IO`函数文档。
- Futures_Lighter
  - 切换测试环境：
    测试环境可以在配置交易所对象时勾选设置，也可以使用```exchange.SetBase()```函数修改REST API端点以切换到测试环境。

  关于Futures_Lighter的```exchange.IO()```切换功能（逐仓/全仓、订单过期时间等），请参考`exchange.IO`函数文档。
