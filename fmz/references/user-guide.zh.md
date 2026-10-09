# FMZ 平台使用指南

由 https://www.fmz.com/user-guide 生成：平台如何运作（托管者、实盘、策略、模板、回测、扩展 API、MCP），面向人写的说明；agent 用它理解概念与限制。

## 入门

第一次使用先读这里：认识平台、从添加交易所到运行实盘的五个步骤、密钥的安全设置。

### 欢迎使用发明者量化交易平台

发明者量化交易平台（FMZ量化）是一个量化交易平台：在网页上编写策略、在线回测，然后在自己部署或租用的托管者上运行实盘；也可以在策略广场学习、分享、出租策略，或公开展示自己的实盘。

**支持的市场**
- 加密货币：主流中心化交易所的现货、期货与永续合约，以及部分链上交易所。
- 证券与期货：富途证券、盈透证券（Interactive Brokers）等。
- 平台尚未对接的交易所，可以通过`通用协议`自行接入。

**支持的策略语言**
JavaScript、TypeScript、Python、Rust、PINE、My语言（麦语言）、Blockly可视化和Workflow工作流，见`编程语言`。

**AI 辅助**
- 策略编辑器内置`AI助手`，可以生成、解释、修改策略代码并分析回测结果。
- 也可以把自己使用的外部 AI 助手接入平台，通过对话管理策略、回测和实盘，见`AI接入`。

**控制台**
注册并登录后进入[控制台](https://www.fmz.com/m)：

![控制中心概览](https://www.fmz.com/upload/asset/2e4e636a6fe51c8f620e8.png)

- [控制中心](https://www.fmz.com/m/dashboard)：账户概况和常用功能入口。运行一个实盘需要三样东西：一个在线的托管者、一个策略、一个配置好的交易所账户。
- [实盘](https://www.fmz.com/m/robots)：创建、管理、控制实盘。实盘即运行中的策略程序实例。
- [策略库](https://www.fmz.com/m/strategies)：编写、保存、分组管理各种语言的策略。
- [托管者](https://www.fmz.com/m/nodes)：部署和管理运行策略的托管者程序。
- [交易所](https://www.fmz.com/m/platforms)：添加和管理交易所账户。

**平台公共资源**
- [策略广场](https://www.fmz.com/square)：公开分享或上架出租的策略，适合学习和参考。
- [实盘围观](https://www.fmz.com/live)：用户公开展示的实盘。
- [文库](https://www.fmz.com/digest)：平台原创文章。
- [社区](https://www.fmz.com/bbs)：交流、讨论量化交易的论坛。
- [众包](https://www.fmz.com/markets)：发布和承接策略开发需求。
- [公开课](https://www.fmz.com/class)：视频教程。
- [API文档](https://www.fmz.com/api)：策略编写的API语法手册。

**获取帮助**
遇到问题可以在社区发帖、在控制台提交工单，或在[Telegram](https://t.me/fmzquant_cn)社群联系管理员。

### 快速开始

从添加交易所到运行第一个实盘，按下面五步完成，每一步后面标了详细说明所在的章节。

**1. 添加交易所账户**

在控制中心的「交易所」页面添加交易所的API KEY。API KEY只开启读取和交易权限，不要开启提现；第一次使用建议先用交易所的模拟盘或小额子账号。见`交易所`和`密钥安全性`。

**2. 部署托管者**

托管者是运行策略的程序，策略和实盘都运行在托管者上。可以一键租用平台提供的托管者，也可以部署在自己的服务器上。见`托管者`。

**3. 编写策略**

在「策略库」新建策略并选择编程语言。策略由入口函数```main()```和其中的主循环构成：每轮获取行情、计算信号、下单，然后休眠等待下一轮。见「编写策略」，其中`策略结构`有各语言的主循环模板和全部API函数的速查表。也可以从策略广场复制一个公开策略开始。

**4. 回测**

在策略编辑页面选择交易所、交易对、时间范围和K线周期后开始回测，检查收益曲线、交易记录和日志。回测通过后再上实盘。见`回测系统`。

**5. 创建实盘**

在控制中心的「实盘」页面新建实盘，选择策略、托管者和交易所账户，设置策略参数后启动。实盘按小时计费，启动前账户里需要有余额，见`实盘计费与充值`。运行状态、日志和收益在实盘页面查看，异常可以推送到手机。见`实盘`。

之后可以按需阅读：「开发工具」介绍编辑与调试，「进阶专题」介绍限流、实盘间通信、多线程和链上交易，「对外接口」介绍用程序或AI助手操作平台。

### 密钥安全性

交易所密钥一旦泄露，损失的是交易所账户里的资产。配置交易所账户前，按下面的清单检查一遍：

- **只开交易权限**：API KEY只开启读取和交易权限，**不要开启提现**。
- **绑定 IP 白名单**：在交易所把API KEY绑定到托管者所在服务器的出口IP。服务器有多个IP时，用托管者的```-I```参数固定出口IP，见`命令行参数`。
- **私钥留在本地**：交易所支持RSA等非对称密钥时优先使用；私钥以凭据文件的形式放在托管者所在的机器上，平台只保存文件路径，见`本地凭据文件`。
- **先小额试运行**：第一次运行新策略时使用交易所的模拟盘或小额子账号。
- **不公开敏感信息**：策略代码、参数、描述里如果写了密钥、账号等信息，不要公开或出售该策略。

平台如何保存密钥：在交易所配置页面填写的密钥等加密字段，在浏览器端用平台账号密码加密后才上传，平台不保存明文；只有用账号密码启动的托管者能在本地解密。因此修改平台账号密码后，原有的交易所配置会失效，处理方法见`实盘报错、异常退出的常见原因`。

## 平台基础

平台的几个基本对象：账号与计费、交易所账户、运行策略的托管者、策略库和实盘。

### 账号与计费

实盘怎样计费、如何充值，以及如何用子账号把部分实盘交给他人管理。账号的其它设置（推送、二次验证、API接口等）在[账号设置页面](https://www.fmz.com/m/account)。

#### 实盘计费与充值

**实盘计费**
- 实盘按小时计费，每个实盘每小时 0.05 USD，不足一小时按一小时计费。
- 创建实盘即开始计费，启动时需要预付第一个小时，账户余额不足时实盘无法启动。实盘「停止」/「重启」不会重复计费。
- 实盘运行中账户余额耗尽时，平台会停止该实盘；租用的策略到期时，使用该策略的实盘同样会被停止。
- 一键租用托管者的服务器费用单独计费，与实盘计费无关，见`一键租用托管者`。

**查询账单与余额预警**
- 在[充值页面](https://www.fmz.com/m/billing)可以查看余额、充值记录和所有计费的账单明细。
- 在[账号设置的额度预警](https://www.fmz.com/m/account#alertthreshold)中设置预警阈值：可用余额低于该值时会收到邮件和微信通知（24小时内最多通知一次，充值或修改设置后重新计算）；设置为0表示关闭。

**充值**
在[充值页面](https://www.fmz.com/m/billing)选择充值方式和金额。使用```USDT```充值时务必注意：
- 转账网络必须与充值页面选择的网络一致，目前支持TRC20、ERC20、BSC。ERC20与BSC的地址都以```0x```开头，格式相同，最容易选错。
- 充值资产选择```USDT```。
- 转账地址与充值页面显示的地址一致。

#### 子账号

子账号用来把部分实盘交给他人查看和操作，而不交出主账号。

**创建子账号**
在[账号设置页面](https://www.fmz.com/m/account#shadowmember)打开子账号页签，在操作权限中选择该子账号可以访问的实盘，填写子账号的用户名和登录密码后创建。创建后的子账号显示在同一页面，可以修改、锁定/解锁、删除。

![子账号设置](https://www.fmz.com/upload/asset/2e46d725dbe6b471f1b33.png)

**子账号的权限**
子账号只能看到授权给它的实盘。对这些实盘可以修改参数、停止、重启，但不能修改实盘配置的交易所对象。

**常见用途**
- 量化团队分工管理多个实盘。
- 出租策略时，让租用方协助调试实盘。

### 交易所

[交易所](https://www.fmz.com/m/platforms)页面用来管理已配置的交易所账户。在发明者量化交易平台中，「交易所」指一个可供策略程序操作的账户：它包含资金账户的密钥配置，以及与该交易所通信的协议和接口封装。

在交易所管理页面点击「添加交易所」进入[交易所添加页面](https://www.fmz.com/m/add-platform)，按需选择交易所并填写配置。密钥等加密字段在浏览器端加密后才保存到平台，平台不记录明文，见`密钥安全性`。

**交易所对象**
配置好的交易所在策略代码中就是交易所对象`exchange`。配置回测或实盘时可以添加多个交易所，在代码中对应交易所对象数组`exchanges`。

**使用交易所对象**
在策略代码中通过交易所对象读取账户和行情、下单、撤单，以```JavaScript```为例：

```js
function main() {
    let account = exchange.GetAccount()    // 查询账户信息
    let ticker = exchange.GetTicker()      // 获取ticker行情
    let id = exchange.Buy(1000, 1)         // 价格为1000，下单量为1
    if (id) {
        exchange.CancelOrder(id)           // 下单成功才有订单Id，订单未成交时可以撤单
    }
}
```

本章其余内容：
- `通用协议`：接入平台尚未对接的交易所。
- `本地凭据文件`：把私钥等敏感信息只保存在托管者所在的机器上。
- `交易所特殊说明`：个别交易所的配置方法和与通用行为不同之处。

#### 通用协议

对于发明者量化交易平台尚未封装对接的交易所API接口，可通过编写通用协议插件程序进行接入。

![通用协议配置截图](https://www.fmz.com/upload/asset/2e43b059b3ec9f42ded6e.png)

该通用协议可用于接入任何提供API接口的交易所，支持以下两种协议：
- ```REST```协议：[参考文档](https://www.fmz.com/digest-topic/10518)。
- ```FIX```协议：[参考项目](https://github.com/fmzquant/fixc)。

```FIX```协议插件程序与```REST```协议插件程序的区别仅在于插件程序与交易所接口的交互方式不同。协议插件程序与发明者量化托管者程序的交互方式、数据格式等细节处理完全相同，具体实现可参考上述链接中的示例。

#### 本地凭据文件

配置交易所时，所有带掩码的加密输入框（Secret Key、私钥、密码等）都可以不填写内容本身，而填写一个凭据文件路径```file:///文件名.txt```。实盘运行时，托管者从本机读取该文件的内容作为这一项的值。这样私钥只存在于托管者所在的机器上，平台上保存的只是一个路径。

**路径规则**
- 路径相对于**本实盘的目录**```logs/storage/<实盘ID>/```解析（```logs```位于托管者的工作目录下）。例如实盘ID为```123456```时，```file:///rsaKey.txt```对应```logs/storage/123456/rsaKey.txt```。
- 可以有子目录，例如```file:///keys/rsaKey.txt```。
- 只认```.txt```后缀；其它后缀不会当作文件读取，而是把这串文字原样作为配置值。
- 路径不能是绝对路径，不能包含```..```，解析后也不能跳出实盘目录（指向目录外的符号链接同样不行）。
- 凭据文件按实盘目录读取，多个实盘使用同一个交易所配置时，每个实盘的目录里都要放一份。
- 文件读不到时实盘启动失败，报错中包含```read key file```；路径不合法时报错为```key file path must be relative and cannot contain '..'```或```key file path escapes the robot directory```。

**示例：使用 RSA 密钥**
以支持```RSA KEY```验证的交易所为例：
1. 生成RSA公钥和私钥，例如用```openssl```生成PKCS#8格式的密钥对。
2. 在交易所创建```RSA KEY```，上传第1步生成的公钥。
3. 在平台配置交易所：```Access Key```填写交易所创建的```RSA KEY```，```Secret Key```填写```file:///rsaKey.txt```。
4. 创建实盘，得到实盘ID（例如```123456```）。
5. 把第1步生成的私钥保存为```logs/storage/123456/rsaKey.txt```，然后启动（或重启）实盘。

详细过程可以参考[视频讲解](https://www.bilibili.com/video/BV1UM41147Jj/)。

#### 交易所特殊说明

个别交易所的配置方法，以及与通用接口行为不同的地方。没有列出的交易所按语法手册中的通用说明使用；各交易所```exchange.IO()```支持的切换功能见`exchange.IO`。

##### 证券与期货

**富途证券**

支持富途牛牛的实盘交易和模拟交易，需要在托管者所在的机器上运行[```FutuOpenD```](https://www.futunn.com/download/OpenAPI?lang=zh-CN)。配置交易所对象、运行```FutuOpenD```等操作参看[富途证券配置说明文档](https://www.fmz.com/bbs-topic/10185)。

使用```FutuOpenD```接入模拟交易时，有些股票代码不支持，因而无法交易（富途牛牛手机App上可以模拟交易）。

- 接口调用频率
  ```GetOrder```、```GetOrders```、```GetPositions```、```GetAccount```默认使用**缓存数据**，不限制调用频率；```FutuOpenD```收到新数据时会自动更新缓存。
  调用```exchange.IO("refresh", true)```可以禁用缓存，禁用后的调用频率为**每30秒内最多10次查询**，超过会报错。

- 股票代码
  格式为```代码.市场```，例如```600519.SH```。市场后缀：
  - HK：港股
  - US：美股
  - SH：沪市
  - SZ：深市
  - SG：新加坡期货
  - JP：日本期货

  在策略中用```exchange.SetContractType()```设置股票代码，例如：

  ```js
  function main() {
      var info = exchange.SetContractType("600519.SH")    // 设置为股票600519.SH（贵州茅台），账户切换到A股市场
      Log(info)
      Log(exchange.GetAccount())                          // 当前股票是茅台，GetAccount返回A股市场的账户资产
      Log(exchange.GetTicker())                           // 获取茅台的当前行情
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
      let info = exchange.SetContractType("600519.SH");    // 设置为股票600519.SH（贵州茅台），账户切换到A股市场
      Log!(info);
      Log!(exchange.GetAccount());                          // 当前股票是茅台，GetAccount返回A股市场的账户资产
      Log!(exchange.GetTicker(None));                       // 获取茅台的当前行情
  }
  ```

  设置交易方向的```exchange.SetDirection```、下单的```exchange.Buy```/```exchange.Sell```、撤单的```exchange.CancelOrder```、查询订单的```exchange.GetOrder```等函数，用法与期货市场相同。

- 账户信息
  富途用```TrdMarket```区分香港市场、美国市场、大陆市场等。以下摘自[```Futu API```文档](https://openapi.futunn.com/futu-api-doc/)：

  ```go
  const (
      TrdMarket_TrdMarket_Unknown TrdMarket = 0 // 未知市场
      TrdMarket_TrdMarket_HK      TrdMarket = 1 // 香港市场
      TrdMarket_TrdMarket_US      TrdMarket = 2 // 美国市场
      TrdMarket_TrdMarket_CN      TrdMarket = 3 // 大陆市场
      TrdMarket_TrdMarket_HKCC    TrdMarket = 4 // 香港A股通市场
      TrdMarket_TrdMarket_Futures TrdMarket = 5 // 期货市场
  )
  ```

  ```exchange.GetAccount()```返回的数据：

  ```json
  {
      "Info": [{
          "Header": {
              ...                 // 省略
              "TrdMarket": 1      // Info原始数据中的市场ID，表示香港市场的账户资产
          },
          "Funds": {              // 该市场的账户资产信息
              ...
          }
      }, ...],
      "Stocks": 0,
      "FrozenStocks": 0,
      "Balance": 1000000,         // 当前市场的资产
      "FrozenBalance": 0
  }
  ```

- ```FutuOpenD```按登录的**IP**地址区分地区，非大陆IP登录的账户获取行情时有所限制，具体查阅```FutuOpenD```（富途）官方文档。

**盈透证券（Interactive Brokers）**

- 配置交易所
  需要在托管者所在的机器上运行「IB Gateway」或「TWS（Trader Workstation）」。以TWS为例：登录后点击右上角的配置按钮，选择「配置」→「API」→「设置」，**不要**勾选「只读API」，勾选「启用ActiveX和套接字客户端」，并记下「套接字端口」（TWS默认实盘7496、模拟盘7497；IB Gateway默认实盘4001、模拟盘4002）。
  然后在平台的[交易所添加页面](https://www.fmz.com/m/add-platform)选择**盈透证券（Interactive Brokers）**：
  - 服务器地址：TWS或IB Gateway的地址和端口，例如```localhost:7496```。
  - 行情类型：实时数据、冻结数据、延迟数据、延迟冻结数据之一。没有订阅实时行情的账户可以选择延迟数据。运行中也可以用```exchange.IO("marketDataType", n)```切换（```n```为1到4，顺序同上）。

- 合约代码
  用```exchange.SetContractType()```设置，格式为```代码.货币[.类型[.交易所]]```，类型缺省为股票```STK```，交易所缺省为```SMART```：
  - 美股：```AAPL.US```、```TSLA.US```（```US```表示美元计价）。
  - 港股：```代码.HK```（```HK```表示港币计价）。
  - 期货（```FUT```）：```代码-到期月份[-乘数].货币.FUT.交易所```，到期月份写成```YYYYMM```，交易所为IB的交易所代码。
  - 期权（```OPT```）与期货期权（```FOP```）：```代码-到期-C或P-行权价×100[-乘数].货币.OPT或FOP.交易所```，行权价乘以100后写成整数。
  - 纯数字：直接作为IB的合约ID（conId）。

- 其它说明
  - 托管者以实盘ID作为连接TWS的客户端号（clientId），实盘重启后客户端号不变，仍可撤销、修改此前挂出的订单。TWS只允许订单的原始客户端号（或主客户端）修改、撤销订单。
  - 持仓、订单的```Symbol```是简写形式（如```Z74.SGD```），```exchange.GetPositions()```、```exchange.GetOrders()```传入简写或下单时用的完整代码（如```Z74.SGD.STK.SGX```）都可以。
  - 订单被网关拒绝时，订单```Info```中的```Reject```字段记录拒单原因。
  - ```exchange.IO("debug", true)```开启后，与TWS收发的每一帧按TWS API日志的格式输出到日志，便于与网关日志对照排查。

##### 加密货币

- Futures_Binance
  支持币安的中文交易对：

  ```js
  function main() {
      let ticker = exchange.GetTicker("币安人生_USDT.swap")
      Log("ticker:", ticker)   // {"Info":{...},"Symbol":"币安人生_USDT.swap","Open":0.29622,"High":0.31661, ...}
  }
  ```

  币安期货的```exchange.IO()```切换功能（双向持仓、逐仓/全仓、统一账户、STP模式等）见`exchange.IO`。
- Futures_HuobiDM
  使用```exchange.IO("base", "https://xxx.xxx.xxx")```或```exchange.SetBase("https://xxx.xxx.xxx")```切换交易所接口的基地址。

  火币期货的```exchange.IO()```切换功能（signHost、逐仓/全仓、单向/双向持仓、统一账户等）见`exchange.IO`。

  条件单不支持OCO类型（```ORDER_CONDITION_TYPE_OCO```）；多资产保证金模式下同样可以使用条件单。
- Huobi
  支持火币的中文交易对：

  ```js
  function main() {
      let ticker = exchange.GetTicker("币安人生_USDT")
      Log("ticker:", ticker)   // {"Info":{...},"Symbol":"币安人生_USDT","Open":0.29622,"High":0.31661, ...}
  }
  ```
- Bitfinex
  现货市价买单的下单量是交易币数，不是金额。
- AscendEx
  现货市价买单的下单量是交易币数，不是金额。
- Futures_Hyperliquid
  参考[Hyperliquid 使用指南](https://www.fmz.com/digest-topic/10574)。

  Hyperliquid期货的```exchange.IO()```切换功能（逐仓/全仓、主网/测试网、vaultAddress、walletAddress、expiresAfter等）见`exchange.IO`。
- Futures_Lighter
  测试环境可以在配置交易所对象时勾选，也可以用```exchange.SetBase()```修改REST API端点切换到测试环境。

  Futures_Lighter的```exchange.IO()```切换功能（逐仓/全仓、订单过期时间等）见`exchange.IO`。

  ```exchange.GetTickers()```返回的```Buy```、```Sell```是各品种的最新成交价（交易所没有批量盘口接口）；需要买一、卖一价时用```exchange.GetTicker()```或```exchange.GetDepth()```。
- Futures_edgeX
  edgeX的永续合约都以USDC计价，交易对写作```BTC_USDC```等，完整代码形如```BTC_USDC.swap```；写成```BTC_USDT```、```BTC_USD```会提示合约不存在。
- Poloniex
  现货条件单只支持止损（```ORDER_CONDITION_TYPE_SL```）：买单在价格涨到触发价时触发，卖单在价格跌到触发价时触发。止盈（```ORDER_CONDITION_TYPE_TP```）和OCO条件单会直接报错，不会下单。

### 托管者

[托管者](https://www.fmz.com/m/nodes)是运行策略的程序：实盘策略运行在托管者上，而不是运行在发明者量化交易平台网站上。托管者负责与平台通信、启动和停止策略进程、回传日志；策略访问交易所的网络请求也都从托管者所在的机器发出。托管者运行在你自己的服务器（或一键租用的服务器）上，平台网站出现网络故障也不影响托管者上正在运行的实盘。

**支持的系统**
托管者只发布64位版本：Linux（x86_64、ARM64）、macOS（Intel、Apple Silicon）、Windows（x64、ARM64，另有界面版）。不支持32位系统。

**数据目录**
托管者的数据都在工作目录（默认为启动目录，可用```-w```指定）下的```logs```目录中：
- ```logs/storage/<实盘ID>/<实盘ID>.db3```：实盘数据库（```SQLite```），保存日志、收益、图表、状态栏和```_G()```数据，可以用```SQLite```管理软件打开。
- ```logs/storage/<实盘ID>/stdout.log```、```stderr.log```：策略进程的标准输出和标准错误。
- ```logs/docker.log```：托管者自身的运行日志。
- ```logs/docker.pid```：托管者的身份信息，保留它，重启后平台会沿用原来的托管者ID。

**网络代理**
托管者不会读取系统代理设置或```HTTP_PROXY```等环境变量。需要通过代理访问交易所时：
- 在策略中用`exchange.SetProxy`给交易所对象设置代理；
- 或使用在网络层接管流量的透明代理（例如 Clash 的 TUN 模式），托管者无需任何配置。

本章内容：`部署托管者`（手动部署、一键租用、操作注意事项）、`命令行参数`、`实盘数据迁移`、`托管者监控`。

#### 部署托管者

[托管者管理页面](https://www.fmz.com/m/nodes)列出当前账号下的托管者，可以切换列表或详细信息展示，查看托管者的IP地址、版本、编译时间等信息。点击**部署托管者**进入[托管者部署页面](https://www.fmz.com/m/add-node)，有两种方式：一键租用托管者、手动部署托管者。

![托管者部署页面](https://www.fmz.com/upload/asset/2e527e497b3fa27ba497b.png)

##### 一键租用托管者

在[托管者部署页面](https://www.fmz.com/m/add-node)点击**一键租用托管者**标签，根据配置、服务器机房地区等需求选择需要部署的服务器。

点击「立即购买」并输入当前发明者量化交易平台的账号密码进行验证，验证通过后将自动进行托管者程序部署。整个部署过程需要几分钟时间，系统会自动安装常用的Python库。

点击「立即购买」后租用的服务器由于是通过平台代为租用，仅具有有限的系统权限，不支持远程登录。如果需要使用未预装的第三方Python库，建议使用私有服务器进行手动部署。

通过**一键租用托管者**功能租用的服务器采用独立计费方式，与实盘计费相互独立。

点击「重新部署」按钮不会删除托管者目录下logs目录中的实盘日志和数据文件。

##### 手动部署托管者

可以把托管者部署在个人电脑、服务器、树莓派（64位系统）等设备上。托管者只发布64位版本：
- Linux命令行版：x86_64（amd64）、ARM64（aarch64）
- macOS命令行版：Intel、Apple Silicon
- Windows：x64、ARM64，各有命令行版和界面版

在[托管者部署页面](https://www.fmz.com/m/add-node)点击**手动部署托管者**，按系统下载对应的托管者程序并解压，可执行文件```robot```即托管者程序。同一页面还显示部署需要的两项信息：

![手动部署托管者页面](https://www.fmz.com/upload/asset/2e460507bc21582ba1448.png)

1. 通信地址：包含账号UID，形如```node.fmz.com/123456```。
2. 密码：UID对应的发明者量化交易平台账号的密码。

**Windows界面版**
运行```robot.exe```，在界面上填写通信地址和密码，点击启动。

**命令行版**
```bash
chmod +x robot                      # Linux/macOS 首次运行前加上执行权限
./robot -s node.fmz.com/123456      # 启动后提示输入密码，输入时不回显
```

```123456```只是示例，实际的通信地址在托管者部署页面查看。不要用```-p```在命令行里写明文密码，它会留在shell历史和进程列表里；需要无人值守启动时，把地址和密码写进只有自己可读的配置文件```robot.conf```：

```bash
cat > robot.conf <<'EOF'
s=node.fmz.com/123456
p=你的密码
EOF
chmod 600 robot.conf
./robot -c robot.conf               # 启动目录下有robot.conf时，直接 ./robot 也会自动加载
```

全部参数和配置文件格式见`命令行参数`。

**在后台运行**
托管者忽略终端挂断信号：在SSH里前台启动后直接断开连接，托管者会继续运行，运行日志同时写在```logs/docker.log```。需要开机自启或崩溃后自动拉起时，可以用systemd等服务管理器运行，例如```/etc/systemd/system/robot.service```：

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

```systemctl stop robot```发送的```SIGTERM```会让托管者优雅退出：先停止其上的所有实盘、上报状态，再从平台下线。```TimeoutStopSec```留出足够的时间，避免收尾未完成就被强制结束。

**升级托管者**
策略运行时和交易所连接器由平台按需下发，不需要手动更新。升级托管者程序本身：先停止托管者（见`托管者操作注意事项`），用新版本替换```robot```可执行文件，再在**同一工作目录**启动。工作目录下的```logs```目录保留了托管者身份和实盘数据，启动后沿用原来的托管者ID。

**用Docker容器隔离策略进程**
Linux和macOS的命令行版可以用```-i```参数让每个策略进程运行在独立的Docker容器里（需要本机已安装并运行Docker）。这是策略进程的隔离方式，不是托管者本身的Docker镜像，参数见`命令行参数`。

##### 托管者操作注意事项

**先停实盘，再停托管者**
删除托管者或停止托管者进程前，先确认它上面没有运行中的实盘。

**正常停止托管者**
- 命令行版：在终端按一次```Ctrl+C```，或向进程发送```SIGTERM```（```kill <PID>```、```systemctl stop```）。
- Windows界面版：点击界面上的停止按钮。

托管者收到停止指令后会优雅退出：先停止其上的所有实盘、上报最终状态，再从平台下线。收尾期间再按一次```Ctrl+C```会跳过状态上报和下线，直接退出，一般不要这样做。

**避免强制结束**
不要用```kill -9```结束托管者进程，也不要直接断电或强制关机。这样托管者来不及下线，平台上的实盘可能仍显示为运行中并继续计费；出现这种情况，需要先删除已离线的托管者，才能停止这些实盘。重启服务器前先停止托管者；用systemd等服务管理器运行时，系统关机会自动发送```SIGTERM```。

#### 命令行参数

命令行版托管者程序```robot```的启动方式：

```bash
./robot -s node.fmz.com/123456            # 启动后交互输入密码（不回显）
./robot node.fmz.com/123456               # 简写：robot 地址 [密码]
./robot -c robot.conf                     # 从配置文件读取参数
./robot -v                                # 查看版本
```

**参数**

| 参数 | 说明 |
| --- | --- |
| ```-s 地址``` | 与平台通信的地址，形如```node.fmz.com/123456```（```123456```为账号UID），可带```ws://```或```wss://```前缀。在[托管者部署页面](https://www.fmz.com/m/add-node)查看。 |
| ```-p 密码``` | 账号密码。不建议使用：明文密码会留在shell历史和进程列表中。不给时启动后交互输入，或写在配置文件里。 |
| ```-n 名称``` | 托管者名称，显示在平台的托管者页面上。 |
| ```-w 目录``` | 工作目录。```logs```（实盘数据、托管者日志、身份文件）都在这个目录下。 |
| ```-c 文件``` | 配置文件，格式见下文。 |
| ```-u 用户``` | 仅Linux/macOS：以该系统用户运行策略进程，托管者本身需要以root运行。使用```-i```时忽略。 |
| ```-I IP``` | 指定本机出口IP，托管者与平台的连接以及策略访问交易所的连接都绑定这个地址，见下文。 |
| ```-i 镜像``` | 仅Linux/macOS：用该Docker镜像为每个策略进程创建独立容器运行，需要本机已安装并运行Docker。 |
| ```-e 路径``` | 配合```-i```：容器内的可执行文件路径。 |
| ```-f JSON``` | 配合```-i```：Docker容器设置，可以直接写JSON，也可以写```@文件路径```从文件读取。 |
| ```-H 地址``` | 配合```-i```：容器回连宿主机的地址。 |
| ```-vv``` | 输出详细日志（托管者与平台的交互消息等），默认不输出，以免日志膨胀。 |
| ```-d DNS``` | 旧版的自定义DNS参数，仍可接受但会被忽略，托管者一律使用系统的DNS解析。 |
| ```-v```、```-V```、```--version``` | 打印版本和编译信息后退出。 |
| ```-h```、```--help``` | 打印用法。 |
| ```--ctl-stdin``` | 从标准输入读取控制指令（没有```-p```时第一行为密码），收到```stop```或输入结束时优雅退出。供把托管者封装成服务的程序使用。 |

取值型参数也可以写成```-参数=值```，例如```-n=server01```。参数写错时打印用法并退出。

**配置文件 robot.conf**
每行一个```键=值```，键是参数名去掉```-```（```s p n w u I d i e f H vv```），```#```开头的行是注释：

```ini
# robot.conf
s=node.fmz.com/123456
p=你的密码
n=server01
vv=true
```

- 用```-c```指定配置文件；没有```-c```也没有给出通信地址时，如果启动目录下有```robot.conf```，会自动加载。
- 同一项命令行和配置文件都给了时，以命令行为准。
- 键区分大小写：```I```是出口IP，```i```是Docker镜像。
- 配置文件路径和```-f @文件```都相对启动目录解析（在```-w```切换目录之前）。
- 配置文件里有密码，记得设置只有自己可读（```chmod 600 robot.conf```）。

**指定出口IP（-I）**
服务器有多个IP地址，而交易所API KEY绑定了其中某个IP的白名单时，用```-I```指定出口IP，例如```./robot -s node.fmz.com/123456 -I 192.168.1.100```。指定后托管者与平台的连接、策略访问交易所的连接都从该地址发出。使用```-i```容器隔离时，容器的网络里可能没有这个地址，此时需要让容器使用宿主机网络。

Windows界面版没有IP设置，需要指定出口IP时请使用命令行版。界面版只接受```-s```、```-p```、```-n```三个启动参数，用于预填界面，同时给出```-s```和```-p```时自动启动。

#### 实盘数据迁移

每个实盘的数据都在托管者工作目录下的```logs/storage/<实盘ID>/```目录里（数据库```<实盘ID>.db3```、```stdout.log```、```stderr.log```等）。平台显示的实盘日志、收益、图表都是从运行该实盘的托管者上读取的。

**把单个实盘迁移到另一台机器的托管者**
1. 停止该实盘。
2. 把整个```logs/storage/<实盘ID>/```目录复制到新托管者工作目录下的相同位置，目录名保持为实盘ID。
3. 在实盘配置中把托管者改为新托管者，再启动实盘。

这样实盘原有的日志、收益等数据不会因为换了机器而丢失。

**整体迁移托管者**
1. 停止旧托管者上的实盘，再停止旧托管者。
2. 把旧托管者工作目录下的整个```logs```目录复制到新机器的工作目录。
3. 在新机器上启动托管者。

```logs/docker.pid```保存了托管者的身份，旧托管者已离线时，新机器上的托管者会沿用原来的托管者ID，实盘配置无需修改。不要让两台机器同时使用同一份```logs```目录运行托管者。

#### 托管者监控

在[托管者管理页面](https://www.fmz.com/m/nodes)，托管者列表或托管者详情的操作项中可以开启**托管者监控**。开启后，托管者异常离线时，平台会向账号绑定的邮箱发送通知。

### 策略库

[策略库](https://www.fmz.com/m/strategies)页面保存当前账号下的所有策略，策略可以用多种编程语言或可视化方式编写。

- 分组：策略和实盘一样可以分组管理，见`分组`。
- 导入与导出：一个完整的策略除了源码，还包括参数、交互、描述、笔记、手册、模板引用等，迁移策略要导出、导入完整策略，见`完整策略的导入与导出`。
- 分享与出租：生成「复制码」分享策略，生成「注册码」出租策略，见`策略分享与出租`。

#### 完整策略的导入与导出

迁移策略不能只复制源码：参数设计、交互设计、模板引用等都不在源码里。在策略编辑页面使用「导出策略」和「导入策略」可以完整地迁移一个策略。

![策略导入导出截图](https://www.fmz.com/upload/asset/2e52ccf44526f396fb795.png)

- 导出策略
  导出为一个```xml```文件，所有编程语言的策略都一样。导出时可以勾选要包含的内容：策略名称、源码、笔记、描述、手册、模板引用、策略参数、交互控件、回测设置。

- 导入策略
  在策略编辑页面点击「导入策略」，选择用「导出策略」得到的```xml```文件，再勾选要导入的内容。导入后点击「保存」保存策略。

#### 策略分享与出租

在[策略库](https://www.fmz.com/m/strategies)页面，点击策略右侧的「操作项」按钮后，弹出菜单中包含分享和出租操作选项。

重要提示：创建和分发策略**注册码**时，请务必仔细确认是「注册码」还是「复制码」，以免误将策略泄露。

##### 策略分享

![策略分享](https://www.fmz.com/upload/asset/2e593d57dc36afc004ef6.png)

- 公开分享
  点击「分享」按钮后会弹出对话框，可以选择「公开分享」。策略将完整地分享到平台的策略广场，任何用户都可以复制该策略。

- 内部分享
  点击「分享」按钮后会弹出对话框，可以选择「内部分享」。选择分享有效期、分享次数后会生成该策略的**复制页面地址**和**复制码**。可以分发给指定的FMZ平台用户，需要该策略的用户只需使用**复制页面地址**链接，登录**复制页面**后输入复制码即可获取该策略，获取后策略会自动出现在策略库中。

##### 策略出租

![策略出租](https://www.fmz.com/upload/asset/2e4e78f6c46c9dde1ce90.png)

- 公开出售
  点击「出租」按钮后会弹出对话框，可以选择「公开出售」。策略即可申请上架（需要通过审核）。

- 内部出售
  点击「出租」按钮后会弹出对话框，可以选择「内部出售」。选择使用天数、最大并发数、注册码数量后，系统会生成该策略的**注册页面地址**和**注册码**。您可以将其分发给指定的FMZ平台用户，需要该策略的用户只需访问**注册页面地址**链接，登录**注册页面**后输入注册码即可获取策略的使用权。策略也会出现在策略库中，但用户只有回测和实盘使用权限，无法查看策略源码等信息。并发实盘个数设置为0时表示不限制并发数量，允许无限制地创建实盘。

### 实盘

「实盘」区别于「回测」，指真正与交易所交互（获取行情、查询持仓、下单撤单等）的策略程序实例。连接交易所生产环境的是实盘，连接交易所模拟环境（很多交易所提供测试环境）的同样是实盘。

**创建实盘**
在[实盘创建页面](https://www.fmz.com/m/add-robot)选择运行策略、托管主机和交易所后创建，需要事先准备好三样东西：
- 一个策略：在[策略库](https://www.fmz.com/m/strategies)点击「新建策略」编写并保存。
- 一个在线的托管者：在[托管者页面](https://www.fmz.com/m/nodes)点击「部署托管者」，见`托管者`。
- 一个交易所账户：在[交易所页面](https://www.fmz.com/m/platforms)点击「添加交易所」配置，见`交易所`。

实盘按小时计费，账户余额不足时无法启动，见`实盘计费与充值`。

**实盘监控**
在[实盘管理页面](https://www.fmz.com/m/robots)，运行中的实盘右侧操作栏可以点击「监控」开启实盘监控。开启后，实盘不是因手动操作而退出时，平台会向账号绑定的邮箱发送通知。

**实盘数据库**
以实盘ID```123456```为例，它的数据库文件位于所属托管者工作目录下的```logs/storage/123456/123456.db3```（```SQLite```格式），包含以下表：
- chart：图表数据。
- cfg：状态栏内容、图表配置等最新状态。
- kvdb：```_G()```函数持久化保存的数据。
- log：实盘日志。
- profit：收益数据。

同一目录下还有策略进程的标准输出```stdout.log```和标准错误```stderr.log```。

**本章内容**
- `分组`：实盘和策略的分组管理。
- `实盘围观`：公开展示实盘，或生成私有围观链接。
- `实盘消息推送`：把日志推送到手机App、邮箱或WebHook。
- `实盘报错、异常退出的常见原因`。

让他人查看、操作部分实盘可以使用`子账号`。

#### 分组

在「实盘」页面和「策略库」页面点击右侧的**分组管理**按钮，可以给实盘、策略分组管理，分组名称可以自定义。
例如给策略分组时，可以把**模板类库**分为一组、**JavaScript语言的策略**分为一组、**测试用策略**分为一组。

- 策略分组
  ![策略分组](https://www.fmz.com/upload/asset/2e482ba9b9aa272085d00.png)

- 实盘分组
  ![实盘分组](https://www.fmz.com/upload/asset/2e577d050e817837bbfdf.png)

#### 实盘围观

在发明者量化交易平台[实盘页面](https://www.fmz.com/m/robots)的实盘列表中点击「公开」按钮即可公开展示当前行的实盘。

实盘围观目前支持两种方式：
- 1、在发明者量化交易平台的[实盘围观](https://www.fmz.com/live)页面公开展示实盘。点击「公开」按钮后选择**公开分享**即可。
- 2、创建实盘围观私有链接。
  点击「公开」按钮后选择**内部分享**，设置有效期后即可生成私有链接，用于访问该策略实盘的私有围观页面。

#### 实盘消息推送

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
- JavaScript/TypeScript/Python/Rust语言
  在策略代码中，可使用```Log()```函数以及其它能在日志区域输出日志信息的函数，例如：```exchange.CreateOrder()```、```exchange.CancelOrder()```等。
  为这些函数传入一个附带参数```"@"```（即在必要参数之外再增加一个附带参数），例如：```Log("This is a push message", "@")```，即可将这条输出的日志信息进行推送，平台会根据「推送设置」进行消息推送。Rust语言中对应```Log!```宏，用法相同：```Log!("This is a push message", "@");```。
- PINE语言/My语言
  在PINE语言/My语言策略所集成的「交易类库」参数中，可开启交易日志推送，触发交易动作后将自动进行推送。
- Blockly可视化
  在「工具」一栏中选择**消息推送**模块，即可实现指定信息的推送。

消息推送存在频率限制，具体规则如下：在实盘的每个20秒周期内，仅保留并推送最后一条消息，其余消息将被过滤，不予推送。

#### 实盘报错、异常退出的常见原因

**实盘无法启动**
- 没有在线的托管者
  实盘所选的托管者离线时实盘无法启动。在[托管者页面](https://www.fmz.com/m/nodes)确认托管者在线，或换一个在线的托管者。
- 账户余额不足
  启动实盘需要预付第一个小时的费用，余额不足时无法启动；运行中余额耗尽，实盘会被平台停止。充值后重新启动，见`实盘计费与充值`。
- 租用的策略到期或并发数已满
  租用的策略到期后，使用它的实盘会被停止且无法再启动；达到租用的最多并发实盘数后，无法再启动新的实盘。
- 密钥解密失败
  报错中包含```secret key decrypt failed (wrong password)```。原因是修改了发明者量化交易平台的账号密码，原先配置的交易所密钥无法再解密。处理方法：
  1. 在[「交易所」管理页面](https://www.fmz.com/m/platforms)重新填写交易所的密钥、密码等信息。
  2. 停止所有托管者，用新密码重新启动托管者。
- 凭据文件读不到
  交易所配置中使用了```file:///xxx.txt```凭据文件，而实盘目录里没有该文件，报错中包含```read key file```；路径不合法时报```key file path must be relative and cannot contain '..'```或```key file path escapes the robot directory```。见`本地凭据文件`。

**策略代码导致的错误**
- 静态语法错误

  ![编辑器中语法错误](https://www.fmz.com/upload/asset/2e4daebbb80548adf3927.png)

  此类错误比较明显，通常在策略编辑页面就能看到错误标记，回测时也能发现。
- 运行时错误
  最常见的是对函数返回值不做合法性判断就直接使用。
- 过度占用内存
  在全局变量里保存过多无法被垃圾回收的内容，导致内存占用过大。
- 未合理使用```exchange.Go```并发请求
  调用异步的```exchange.Go```后没有及时```wait```等待结果，导致并发任务数量过多。
- 递归调用过深
  递归层数过多，超出调用栈大小。

**其它报错**
- 接口业务错误、网络请求错误
  此类报错会显示相关的交易所对象名称、函数名称、错误消息和原因，本身不会导致实盘异常停止。它们通常是起因而不是直接原因，直接原因一般是**没有判断接口返回值是否合法就直接使用而引发的程序异常**。
- ```interrupt```错误
  程序正在执行某个操作（例如访问交易所接口）时，用户点击了实盘页面上的**停止**按钮，停止中断了当前操作而打印的日志。它没有影响，只是一条记录。

更多问题见[常见问题汇总](https://www.fmz.com/bbs-topic/1427)。

## 编写策略

用各种编程语言编写策略：各语言的说明，策略结构（生命周期、主循环、事件驱动），策略参数，交互控件，模板类库，内置库，以及策略界面文字的多语言写法。

### 编程语言

**在发明者量化交易平台上，可以使用哪些编程语言来编写我的策略呢？**

![支持的编程语言](https://www.fmz.com/upload/asset/2e52c7501f57044f7f0ef.png)

发明者量化交易平台支持使用```JavaScript```、```TypeScript```、```Python```、```Rust```、[```PINE```](https://www.fmz.com/bbs-topic/9315)、[```My语言```](https://www.fmz.com/bbs-topic/2569)、```Blockly```可视化以及```Workflow```工作流来编写和设计交易策略。

#### JavaScript

平台支持用```JavaScript```编写策略。运行时基于 QuickJS 引擎，支持```async```/```await```、```class```、```BigInt```等现代语法；实盘时策略在托管者上运行，回测时在浏览器端的回测系统中运行。在代码中加入```// @ts-check```即可改用 TypeScript 编写，见 `TypeScript`。

**策略结构与参数**

策略入口为```function main()```，可选的```init()```、```onexit()```、```onerror(msg)```由托管者自动调用，见 `策略结构`。界面参数是同名的全局变量，可以直接读取，也可以在代码中修改，见 `策略参数`。

**错误与返回值**

API 函数调用失败（交易所返回错误、网络问题等）时返回```null```，并在日志中输出错误信息。使用返回值之前先判断，或者用 `_C` 重试：

```js
function main() {
    var ticker = exchange.GetTicker()
    // 调用失败时返回 null
    if (ticker) {
        Log(ticker)
    }

    // 失败时自动重试，直到返回有效数据
    var account = _C(exchange.GetAccount)
    Log(account)
}
```

程序异常（例如读取```undefined```的属性）和接口业务报错的日志中会显示出错位置在策略代码中的行号，便于调试和排查。

**字符串与ArrayBuffer**

JavaScript 的字符串是 UTF-16 编码。平台 API 返回的文本如果不是合法的 UTF-8 字节序列，为了不丢失数据，会返回```ArrayBuffer```（原始字节）。所有可以传入字符串的 API 参数也都接受```ArrayBuffer```。

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
    // “𠮷”的 Unicode 码点超出 16 位，在 JavaScript 字符串中占两个 UTF-16 码元
    const inputString = "abc𠮷123"

    // Encode 按 UTF-8 编码后输出 hex
    const encodedHex = Encode("raw", "string", "hex", inputString)
    Log(encodedHex)                       // 616263f0a0aeb7313233

    // charCodeAt 取的是 UTF-16 码元，“𠮷”被写成 d842、dfb7，结果不是 UTF-8 编码
    const manuallyEncodedHex = stringToHex(inputString)
    Log(manuallyEncodedHex)               // 616263d842dfb7313233

    // 合法的 UTF-8 字节可以还原为字符串
    const decodedString = Encode("raw", "hex", "string", encodedHex)
    Log(decodedString)                    // abc𠮷123

    // 不是合法的 UTF-8 字节，返回 ArrayBuffer
    // （如果 inputString 改为 "abcG123"，两种编码结果相同，这里得到的是字符串）
    const outputD = Encode("raw", "hex", "string", manuallyEncodedHex)
    Log(outputD instanceof ArrayBuffer)   // true

    // 查看 ArrayBuffer 中的原始字节
    const bufferD = new Uint8Array(outputD)
    let hexBufferD = ''
    for (let i = 0; i < bufferD.length; i++) {
        hexBufferD += bufferD[i].toString(16).padStart(2, '0')
    }
    Log(hexBufferD)                       // 616263d842dfb7313233
}
```

**异步与多线程**

- ```setTimeout```/```clearTimeout```：回调在主线程调用```Sleep()```等待期间执行；```main()```返回时还没到期的定时器会先执行完，再调用```onexit()```。
- ```fetch(url)```：返回```Promise```，结果为响应对象（```ok```、```status```、```headers```属性，```text()```、```json()```直接返回内容）。托管者中的```fetch```在调用时就同步完成请求，返回的是已经完成的```Promise```，所以用```Promise.all```组合多个```fetch```并不会并发请求。
- 交易所 API（例如```exchange.GetTicker()```）是同步阻塞调用，包装进```Promise```或```async```函数也不会并发执行。
- 需要并发时使用 `exchange.Go`、`HttpQuery_Go`，或者用 `Thread` 创建线程，见 `JavaScript多线程`。

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

**库与依赖**

JavaScript 策略可以直接使用内置的```TA```指标库和```talib```指标库，各语言可用的内置库见 `内置库`。其它第三方 JavaScript 库可以在运行时下载后用```eval```加载，示例见同一页。

#### TypeScript

TypeScript 不是单独的语言选项：创建策略时选择```JavaScript```，在代码中加入一行```// @ts-check```（或点击策略编辑区右上角的「TypeScript」按钮），平台就按 TypeScript 处理，在回测和实盘运行前先编译为 JavaScript。通过 AI/MCP 工具保存策略时，语言可以直接写```typescript```，平台按 JavaScript 策略保存，并在代码开头自动加上```//@ts-check```，见 `AI接入`。

静态类型检查能在编写时发现参数个数、属性名、类型用错之类的问题，编辑器的补全也更准确。

最小示例：

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

平台 API 的类型声明由策略编辑器内置提供，不需要在代码中引用：全局函数、```exchange```对象、```ITicker```、```IRecord```、```IOrder```、```IPosition```等数据结构接口，以及```TA```、```talib```等。运行时的语言特性、API 和库与 JavaScript 策略相同，见 `JavaScript`。

#### Python

平台支持用```Python 3```编写策略，不支持 Python 2。实盘以及在托管者上进行的回测，使用托管者所在机器上安装的 Python 解释器运行策略。

**解释器**

托管者按以下顺序查找解释器，使用第一个能启动、并且版本为 Python 3 的程序：
1. 环境变量```PYTHON_BIN```指定的解释器；
2. ```python3```；
3. ```python```。

需要使用指定的解释器（例如虚拟环境中的 Python）时，在启动托管者之前设置环境变量：

```bash
export PYTHON_BIN=/opt/venv/bin/python3
```

策略代码首行的```#!python3```、```#!python2```等写法不再用于选择解释器。

**策略结构与参数**

策略入口为```def main()```，可选的```init()```、```onexit()```由托管者自动调用（Python 不支持```onerror()```），见 `策略结构`。界面参数是同名的全局变量；在函数中给参数重新赋值时，需要先用```global```声明。

**错误与返回值**

API 函数调用失败时返回```None```，并在日志中输出错误信息。使用返回值之前先判断，或者用```_C()```重试。策略中未捕获的异常会结束运行，错误信息记录在日志中。

**输出**

```print()```的输出写到托管者进程的标准输出，不会出现在实盘日志里。需要显示在日志中的内容请用 `Log`。

**第三方库**

策略可以导入解释器中已经安装的任何库。安装时要使用托管者运行策略的那个解释器，例如：

```bash
python3 -m pip install numpy
# 设置了 PYTHON_BIN 时
$PYTHON_BIN -m pip install numpy
```

使用```talib```需要在托管者所在机器上安装 TA-Lib（```talib```包）和```numpy```。

**自定义模块**

策略运行时的当前目录和```PYTHONPATH```是托管者为本次运行创建的临时目录，运行结束后会被删除；放在托管者程序目录下（例如```logs/storage/<实盘ID>/```）的```.py```文件不会被自动找到。导入自己编写的模块有两种方式：
- 把模块安装到解释器的```site-packages```中（例如做成包用```pip install```安装，或者直接复制到```site-packages```目录）；
- 在策略中先把模块所在目录的绝对路径加入```sys.path```，再导入。

例如模块文件```/home/user/fmz_modules/mymath.py```：

```python
# mymath.py
def add(a, b):
    return a + b
```

策略代码：

```python
import sys
sys.path.append("/home/user/fmz_modules")   # 模块所在目录的绝对路径

import mymath

def main():
    Log("mymath.add(1, 2):", mymath.add(1, 2))
```

把核心代码做成模块放在自己的托管者上，策略代码中只保留调用部分，也是一种不把核心代码上传到平台的做法。

#### Rust

平台支持用```Rust```编写策略。Rust 策略先编译再运行：回测时由平台服务器编译，在浏览器端的回测系统中运行；实盘时编译通过后在托管者上运行。策略编辑器为 Rust 集成了```rust-analyzer```，提供代码补全与实时诊断。

**策略结构**

策略代码只需要一个```fn main()```。平台 API（```exchange```、```exchanges```、```TA```、```Log!```、```_C!```等）已经自动导入，不需要写```use```或```mod```声明。

可选的```fn init()```、```fn onexit()```由托管者自动调用，定义即可，不需要注册：```init()```在```main()```之前执行；```onexit()```在```main()```正常返回、实盘被停止、策略```panic```时都会执行。Rust 不支持```onerror()```。详见 `策略结构`。

```rust
fn init() {
    Log!("初始化");
}

fn main() {
    // 可能失败的 API 返回 Result<T>，_C! 宏在失败时重试，直到调用成功
    let ticker = _C!(exchange.GetTicker(None));
    Log!("Last:", ticker.Last);
}

fn onexit() {
    Log!("策略退出，执行扫尾处理");
}
```

日志等部分功能以宏的形式提供（注意感叹号）：```Log!()```、```LogStatus!()```、```Panic!()```、```_G!()```、```_C!()```；```LogProfit()```、```Sleep()```、```_D()```、```_N()```、```HttpQuery()```等是普通函数。

**参数类型**

界面参数以同名的全局常量注入策略，只能读取，不能在代码中修改（需要变化的值请复制到局部变量）。类型由参数种类决定：

| 参数种类 | Rust 类型 |
| - | - |
| 数字型 | ```f64``` |
| 布尔型 | ```bool``` |
| 字符串 | ```&str``` |
| 下拉框（单选） | ```f64```（选项索引）；选项绑定了字符串数据时为```&str``` |
| 下拉框（多选） | ```&[i64]```、```&[f64]```或```&[&str]```；选项值类型混杂时为 JSON 文本```&str``` |
| 加密串 | ```&str```或```Decrypted```（可解引用为```str```） |

- 整数用途需要自行转换，例如```let n = Period as usize;```。
- 选填参数没有填写时为该类型的零值：```0.0```、```""```、```false```，多选下拉框为空。
- 加密串参数在服务端不能预先解密时（例如私有托管者），注入为```static```的```Decrypted```类型，第一次使用时才解密。它实现了```Display```，可以直接用于```format!```；传给```Log!```或其它需要```&str```的地方写```&*参数名```（对```&str```类型的参数同样适用）：

```rust
fn main() {
    let key: &str = &*ApiKey;   // ApiKey 为加密串参数
    Log!("key length:", key.len());
}
```

- 参数名与代码中的其它名字冲突时，可以用```args::参数名```引用参数。

**错误与返回值**

可能失败的 API 调用返回```Result<T>```，用 Rust 惯用的方式处理（JavaScript 中失败返回```null```）：

```rust
fn main() {
    // 方式一：模式匹配
    if let Ok(ticker) = exchange.GetTicker(None) {
        Log!(ticker);
    }

    // 方式二：_C! 宏在失败时重试，直到调用成功
    let ticker = _C!(exchange.GetTicker(None));
    Log!(ticker);
}
```

可选参数（例如```GetTicker```的```symbol```参数）不传时用```None```占位，传值时直接传入，例如```exchange.GetTicker("BTC_USDT")```。

**JSON**

平台 API 返回的原始 JSON 文本（例如```exchange.IO()```的返回值、各结构体的```Info```字段）用内置的```JSONParse()```解析，得到```Option<JsonValue>```；用```v["key"]```、```v[0]```取子节点，用```as_f64()```、```as_str()```、```as_bool()```等方法取值。```JsonValue```实现了```Display```，```v.to_string()```或```format!("{}", v)```得到紧凑的 JSON 文本。SDK 没有提供构造 JSON 的便捷接口，生成 JSON 文本可以用```format!```拼接，或者引入```serde_json```。

**第三方 crate**

策略源码是唯一的代码文件（没有单独的```Cargo.toml```）。在源码最顶部用```---```包裹的 frontmatter 声明依赖，构建时合并进```Cargo.toml```：

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

- frontmatter 必须在源码开头，前面只能有空行；```/*backtest ... */```回测配置块要放在 frontmatter 结束的```---```之后。策略中还没有回测配置块时，「保存回测设置」会把配置块插入到源码最前面，这时需要把它移到 frontmatter 之后（之后再保存会在原位置更新）。
- 策略和它引用的模板类库中，依赖块只能写在其中一处，两处都写会编译失败。
- 编译环境中没有系统 OpenSSL，需要 TLS 的 crate（HTTP/WebSocket 客户端等）请选用纯 Rust 实现的```rustls```（例如```tokio-tungstenite```开启```rustls-tls-webpki-roots```特性），避免依赖```native-tls```/```openssl-sys```；WebSocket 连接优先使用内置的 `Dial` 函数，不需要第三方 crate。

**内置库**

Rust 策略可以使用```TA```指标库，不支持```talib```，见 `内置库`。

#### My语言（麦语言）

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

#### PINE语言

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

#### Blockly可视化

平台支持Blockly可视化编程方式。借助Blockly编辑器，用户可以通过拼接图形块（类似积木）来表达代码概念，如变量、逻辑表达式、循环等。这种方式使编程过程无需过多关注繁琐的语法细节，而是可以直接按照编程原则进行操作。通过图形块的排列组合，用户能够轻松理解编程逻辑，实现创意想法，非常适合培养策略设计兴趣，快速入门程序化和量化交易。

  - [可视化模块搭建交易策略--初识](https://www.fmz.com/digest-topic/4016)

  - [可视化模块搭建交易策略--进阶](https://www.fmz.com/digest-topic/4046)

  - [可视化模块搭建交易策略--深入](https://www.fmz.com/digest-topic/4086)

  - [可视化模块搭建交易策略--浅出](https://www.fmz.com/digest-topic/4107)

#### Workflow工作流

平台支持 Workflow 工作流方式编写策略。工作流是一种可视化的策略设计方式，通过节点连接和配置来构建交易逻辑，无需编写代码即可实现策略。

**工作流特点**：
- 可视化拖拽设计，所见即所得
- 预置丰富的功能节点（数据获取、指标计算、条件判断、交易执行等）
- 降低编程门槛，适合快速搭建和验证策略
- 支持回测功能，可视化查看节点执行状态

**学习资源**：
- [工作流系列视频教程](https://www.fmz.com/class/workflow)

### 策略结构

```JavaScript```（含 TypeScript）、```Python```、```Rust```策略由几个约定名称的函数组成，托管者在固定的时机调用它们。My语言、PINE、Blockly、Workflow 策略不需要编写这些函数。

**生命周期函数**

| 函数 | 是否必须 | 调用时机 |
| - | - | - |
| ```main()``` | 必须 | 入口函数，策略的主体。```main()```返回，策略即运行结束。 |
| ```init()``` | 可选 | 在```main()```之前调用一次，用于初始化。 |
| ```onexit()``` | 可选 | 策略退出时调用，用于扫尾（撤单、平仓、保存状态等）。 |
| ```onerror(msg)``` | 可选 | 仅```JavaScript```：```main()```因未捕获的异常结束时调用，```msg```为错误信息。调用了```onerror()```就不再调用```onexit()```。 |
| ```destroy()``` | 可选 | 仅```JavaScript```模板类库：策略退出时，在```onexit()```或```onerror()```之后调用，见 `模板类库`。 |

退出时调用哪个函数：

| 退出原因 | JavaScript | Python | Rust |
| - | - | - | - |
| ```main()```正常返回 | ```onexit()``` | ```onexit()``` | ```onexit()``` |
| 停止实盘 | ```onexit()``` | ```onexit()``` | ```onexit()``` |
| 未捕获的异常、```panic``` | ```onerror(msg)``` | 都不调用 | ```onexit()``` |

**注意事项：**
- ```onexit()```、```onerror()```最长执行 5 分钟（时长由服务端按任务下发，默认 5 分钟），超时会被强制结束。
- 回测中策略通常是不停轮询的死循环，回测结束时```main()```并没有正常返回，处理方法见 `onexit()`。
- ```JavaScript```策略的```main()```返回时，用```threading```创建的子线程会被终止；还没有到期的```setTimeout```回调会先执行完，再调用```onexit()```。
- ```JavaScript```、```Python```模板类库可以定义自己的```init()```，在模板加载时执行，早于策略的```init()```。

**主循环与事件驱动**

大多数策略在```main()```中写一个循环：每轮获取数据、计算、下单，然后```Sleep()```等待下一轮，见 `主循环`。也可以等待行情、订单等事件到达后再处理，见 `事件驱动`。全部 API 函数的分类速查见 `API函数速查`。

#### init()

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

#### onexit()

```onexit()```由用户实现，在策略退出时处理扫尾工作，可以不定义。最长执行 5 分钟，超时会被强制结束。各语言在哪些情况下调用```onexit()```，见 `策略结构`。

测试```onexit()```函数：

```javascript
function main(){
    Log("Starting, will stop after 5 seconds and execute cleanup function!")
    Sleep(1000 * 5)
}

// 扫尾函数实现
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

// 扫尾函数实现
fn onexit() {
    let beginTime = Unix() * 1000;
    loop {
        let nowTime = Unix() * 1000;
        Log!("Program stop countdown..cleanup started, elapsed time:", (nowTime - beginTime) / 1000, "seconds!");
        Sleep(1000);
    }
}
```

回测系统中，策略通常写成不停轮询的死循环，回测数据结束时```main()```并没有正常返回，```JavaScript```、```Python```策略因此不会执行```onexit()```。可以在回测中（```IsVirtual()```为真）捕获回测结束时抛出的异常（EOF），让```main()```返回，从而执行```onexit()```。```Rust```策略在回测结束时 API 调用返回```Err```，退出循环即可。

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
                // 回测结束时API调用返回Err，退出循环使main返回，从而触发onexit()扫尾函数
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

```onerror(msg)```只有```JavaScript```（含 TypeScript）策略支持：```main()```因未捕获的异常结束时调用，参数```msg```为异常的错误信息。调用了```onerror()```就不再调用```onexit()```。最长执行 5 分钟，超时会被强制结束。回测系统不支持该函数。

```Python```、```Rust```策略不支持```onerror()```。

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
# Python 不支持
```

```rust
// Rust 不支持
```

#### 主循环

策略通常在```main()```中写一个循环：每轮获取行情、计算信号、下单，然后调用 `Sleep` 等待下一轮。```Sleep()```在回测中推进回测时间、控制回溯速度，在实盘中控制轮询间隔，从而控制访问交易所 API 的频率。循环中不调用```Sleep()```会以最快速度反复请求交易所接口，容易触发交易所的频率限制。需要在托管者上限制 API 调用频率时，见 `API限流控制`。

基本框架：

```javascript
function onTick(){
    // 在这里写策略逻辑，将会不断调用，例如打印行情信息
    Log(exchange.GetTicker())
}

function main(){
    while(true){
        onTick()
        // Sleep函数主要用于数字货币策略的轮询频率控制，防止访问交易所API接口过于频繁
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
    // 在这里写策略逻辑，将会不断调用，例如打印行情信息
    Log!(exchange.GetTicker(None));
}

fn main() {
    loop {
        onTick();
        // Sleep函数主要用于数字货币策略的轮询频率控制，防止访问交易所API接口过于频繁
        Sleep(60000);
    }
}
```

举个最简单的例子：每隔1秒钟在交易所挂一个价格为100、数量为1的买单，可以这样写：

```javascript
function onTick(){
    // 这个仅仅是例子，回测或者实盘会很快把资金全部用于下单，实盘请勿使用
    exchange.Buy(100, 1)
}

function main(){
    while(true){
        onTick()
        // 暂停多久可自定义，单位为毫秒，1秒等于1000毫秒
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
    // 这个仅仅是例子，回测或者实盘会很快把资金全部用于下单，实盘请勿使用
    let _ = exchange.Buy(100, 1);
}

fn main() {
    loop {
        onTick();
        // 暂停多久可自定义，单位为毫秒，1秒等于1000毫秒
        Sleep(1000);
    }
}
```

按K线更新处理的策略（On Bar）：最新一根K线的时间变化时才执行```onTick()```：

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

#### 事件驱动

除了按固定间隔轮询，策略也可以等待事件到达后再处理，减少无效请求，也能更快地响应行情变化。

**EventLoop**

`EventLoop` 等待```exchange.Go()```、```HttpQuery_Go()```等并发任务完成、WebSocket 连接有可读数据、线程消息等事件；有事件时返回事件信息，策略再去读取对应的数据。第一次调用```EventLoop()```时才开始记录事件，所以先调用一次```EventLoop(-1)```再发起并发任务：

```js
function main() {
    EventLoop(-1)                       // 开始记录事件，避免错过之后发生的事件
    var r1 = exchange.Go("GetTicker")
    var r2 = exchange.Go("GetDepth")
    var ev = EventLoop(1000)            // 等待任意一个并发任务完成，最多等 1 秒
    Log("event:", ev)
    Log("ticker:", r1.wait(), "depth:", r2.wait())
}
```

**ctx.subscribe / ctx.poll**

```JavaScript```和```Rust```策略还可以使用托管者的事件订阅接口：```ctx.subscribe()```订阅某个账户、某个品种的行情或订单回报，返回流 ID；```ctx.poll()```取出下一条事件（可以设置等待超时），策略按事件的```kind```分别处理。```Python```策略不支持。

```js
function main() {
    ctx.subscribe(0, "BTC_USDT", {channel: "ticker"})   // 第一个参数是账户在 exchanges 中的下标
    ctx.subscribe(0, "", {channel: "orders"})           // 订单回报
    while (true) {
        const ev = ctx.poll([], 1000)                    // [] 表示所有订阅，最多等 1 秒
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

- ```channel```可选```"ticker"```、```"bbo"```、```"depth"```、```"trade"```、```"kline"```（```interval```为周期秒数）、```"orders"```。
- 事件的```kind```：1 为 ticker，3 为深度（事件只表示订单簿已更新，档位用```ctx.book(ev.ex, ev.symbol, n)```读取），4 为成交，5 为 K 线，16 为订单回报。
- 行情类订阅消费不及时会只保留最新数据或丢弃最旧的数据，订单回报不会丢弃，策略需要持续调用```ctx.poll()```。

```Rust```策略中的写法为```ctx::subscribe()```、```ctx::poll()```，事件为原始结构，价格、数量是定点整数：

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

#### API函数速查

按API手册的分类列出全部函数、结构体和常量，每项一句话说明，点击名称查看完整文档。本页由```doc_tools/gen_api_index.py```根据手册生成。

## 内置函数

### Global

| 名称 | 说明 |
| - | - |
| `Version` | 返回当前系统版本号。 |
| `IsVirtual` | 用于判断策略的运行环境是否为回测系统。 |
| `GetOS` | 获取托管者所在设备的操作系统信息。 |
| `GetPid` | 获取实盘进程的 ID。 |
| `GetMeta` | 获取在生成策略注册码时写入的```Meta```值。 |
| `Sleep` | 休眠函数，使程序暂停运行一段指定的时间。 |
| `Unix` | 获取当前时刻的秒级时间戳。 |
| `UnixNano` | 获取当前时刻的纳秒级时间戳。 |
| `_D` | 将毫秒级时间戳或```Date```对象转换为时间字符串。 |
| `GetCommand` | 获取策略的交互命令。 |
| `GetLastError` | 获取最近一次的错误信息。 |
| `SetErrorFilter` | 过滤错误日志。 |
| `_N` | 格式化浮点数。 |
| `_C` | 重试函数，用于对接口调用进行容错处理。 |
| `_Cross` | 返回数组```arr1```与数组```arr2```的交叉周期数。 |
| `JSON.parse` | ```JSON.parse```函数是**ECMAScript**标准内建对象```JSON```的方法，用于解码（解析）JSON字符串。 |
| `JSON.stringify` | ```JSON.stringify```函数是**ECMAScript**标准内置对象```JSON```的方法，用于将JavaScript值转换为JSON字符串。 |
| `Encode` | 该函数根据传入的参数对数据进行编码。 |
| `MD5` | 计算参数```data```的 MD5 哈希值。 |
| `UUID` | 创建一个 UUID。 |

### Log

| 名称 | 说明 |
| - | - |
| `Log` | ```Log()```函数用于输出日志。 |
| `LogStatus` | 在回测系统或实盘页面的状态栏中输出信息。 |
| `LogProfit` | 记录并打印盈亏数值，并根据盈亏数值绘制收益曲线。 |
| `LogProfitReset` | 清空所有收益日志及收益图表。 |
| `LogReset` | 清除日志。 |
| `LogVacuum` | 用于在调用 ```LogReset()``` 函数清除日志后，回收 **SQLite** 删除数据时所占用的存储空间。 |
| `EnableLog` | 启用或禁用订单信息的日志记录。 |
| `Chart` | 自定义图表绘图函数。 |
| `KLineChart` | 该函数用于采用类似```Pine```语言的绘图方式，在策略运行时进行自定义绘图。 |
| `console.log` | 用于在实盘页面的「调试信息」栏中输出调试信息。 |
| `console.error` | 用于在实盘页面的「调试信息」栏中输出错误信息。 |
| `exchange.Log` | ```exchange.Log()```函数用于在日志栏区域输出下单、撤单日志。 |

### Market

| 名称 | 说明 |
| - | - |
| `exchange.GetTicker` | 获取当前设置的交易对、合约代码所对应现货或合约的Ticker结构，即行情数据。 |
| `exchange.GetTickers` | ```exchange.GetTickers()```函数用于获取交易所的聚合行情数据（Ticker结构的数组）。 |
| `exchange.GetDepth` | 获取当前设置的交易对、合约代码所对应的现货或合约的Depth结构，即订单簿数据。 |
| `exchange.GetTrades` | 获取当前设置的交易对、合约代码所对应的现货或合约的Trade结构数组，即市场的成交数据。 |
| `exchange.GetRecords` | 获取当前设置的交易对、合约代码所对应的现货或合约的Record结构数组，即K线数据。 |
| `exchange.GetMarkets` | ```exchange.GetMarkets()```函数用于获取交易所的市场信息。 |
| `exchange.GetRawJSON` | 获取当前交易所对象（exchange、exchanges）最近一次```rest```请求返回的原始内容。 |
| `exchange.SetData` | ```exchange.SetData()```函数用于设置策略运行时所加载的数据。 |
| `exchange.GetData` | ```exchange.GetData()```函数用于获取由```exchange.SetData()```函数加载的数据，或外部链接提供的数据。 |

### Trade

| 名称 | 说明 |
| - | - |
| `exchange.Buy` | ```exchange.Buy()```函数用于下买单。 |
| `exchange.Sell` | ```exchange.Sell()```函数用于下达卖单。 |
| `exchange.CreateOrder` | ```exchange.CreateOrder()```函数用于下单。 |
| `exchange.ModifyOrder` | ```exchange.ModifyOrder()```函数用于修改现有的普通订单，可修改订单的价格和数量。 |
| `exchange.CancelOrder` | ```exchange.CancelOrder()```函数用于取消订单。 |
| `exchange.GetOrder` | ```exchange.GetOrder()```函数用于获取订单信息。 |
| `exchange.GetOrders` | ```exchange.GetOrders()```函数用于获取当前未完成的订单。 |
| `exchange.GetHistoryOrders` | ```exchange.GetHistoryOrders()```函数用于获取当前交易对、合约的历史订单，并支持指定具体的交易品种。 |
| `exchange.CreateConditionOrder` | ```exchange.CreateConditionOrder()```函数用于创建条件单。 |
| `exchange.ModifyConditionOrder` | ```exchange.ModifyConditionOrder()```函数用于修改现有的条件单，可修改条件单的下单量、触发条件和执行价格。 |
| `exchange.CancelConditionOrder` | ```exchange.CancelConditionOrder()```函数用于取消条件单。 |
| `exchange.GetConditionOrder` | ```exchange.GetConditionOrder()```函数用于获取指定条件单的信息。 |
| `exchange.GetConditionOrders` | ```exchange.GetConditionOrders()```函数用于获取未完成的条件单（尚未触发或尚未取消的条件单）。 |
| `exchange.GetHistoryConditionOrders` | ```exchange.GetHistoryConditionOrders()```函数用于获取当前交易对、合约的历史条件单（包括已触发、已取消、已过期的条件单），并支持指定具体的交易品种。 |

### Account

| 名称 | 说明 |
| - | - |
| `exchange.GetAccount` | ```exchange.GetAccount()```函数用于请求交易所账户信息。 |
| `exchange.GetAssets` | ```exchange.GetAssets```函数用于请求交易所账户的资产信息。 |

### Futures

| 名称 | 说明 |
| - | - |
| `exchange.SetContractType` | ```exchange.SetContractType()```函数用于设置exchange交易所对象当前的合约代码。 |
| `exchange.GetContractType` | ```exchange.GetContractType()```函数用于获取exchange交易所对象当前设置的合约代码。 |
| `exchange.SetDirection` | ```exchange.SetDirection()```函数用于设置调用exchange.Buy函数、exchange.Sell函数进行期货合约下单时的订单方向。 |
| `exchange.SetMarginLevel` | ```exchange.SetMarginLevel()```函数用于设置```symbol```参数所指定的交易对、合约的杠杆值。 |
| `exchange.GetPositions` | ```exchange.GetPositions()```函数用于获取持仓信息；```GetPositions()```函数是交易所对象exchange的成员函数。 |
| `exchange.GetFundings` | ```exchange.GetFundings()```函数用于获取当前周期的资金费率数据。 |

### Exchange

| 名称 | 说明 |
| - | - |
| `exchange.GetName` | ```exchange.GetName()```函数用于获取当前交易所对象所绑定的交易所名称。 |
| `exchange.GetLabel` | ```exchange.GetLabel()```函数用于获取配置交易所对象时设置的自定义标签。 |
| `exchange.GetCurrency` | ```exchange.GetCurrency()```函数用于获取当前设置的交易对。 |
| `exchange.SetCurrency` | ```exchange.SetCurrency()```函数用于切换交易所对象exchange当前的交易对。 |
| `exchange.GetQuoteCurrency` | ```exchange.GetQuoteCurrency()```函数用于获取当前交易对的计价币名称，即```quoteCurrency```。 |
| `exchange.GetPeriod` | 获取回测或实盘运行策略时，在发明者量化交易平台网站页面上所设置的 K 线周期，即调用 ```exchange.GetRecords()``` 函数且不传入参数时使用的默认 K 线周期。 |
| `exchange.SetMaxBarLen` | 设置K线的最大长度。 |
| `exchange.SetPrecision` | ```exchange.SetPrecision()```函数用于设置```exchange```交易所对象的**价格**与**下单量**的精度，设置后系统会自动忽略数据中超出精度的多余部分。 |
| `exchange.GetRate` | 获取交易所对象当前设置的汇率。 |
| `exchange.SetRate` | 设置交易所对象当前的汇率。 |
| `exchange.SetBase` | ```exchange.SetBase()```函数用于设置exchange交易所对象所使用的交易所API接口基地址。 |
| `exchange.GetBase` | ```exchange.GetBase()``` 函数用于获取当前交易所 API 接口的基础地址。 |
| `exchange.SetProxy` | ```exchange.SetProxy()```函数用于设置exchange交易所对象的代理配置。 |
| `exchange.SetTimeout` | ```exchange.SetTimeout()```函数用于设置exchange交易所对象```rest```请求的超时时间。 |
| `exchange.Encode` | ```exchange.Encode()```函数用于执行签名与加密计算。 |

### IO

| 名称 | 说明 |
| - | - |
| `exchange.IO` | ```exchange.IO()```函数用于调用交易所对象相关的其它接口。 |
| ```exchange.IO("api", ...)``` | ```exchange.IO("api", ...)```调用交易所未封装的原始REST接口，签名由平台自动处理。 |
| ```exchange.IO("currency", ...)``` | ```exchange.IO("currency", ...)```在运行时切换交易所对象的当前交易对。 |
| ```exchange.IO("base", ...)``` | ```exchange.IO("base", ...)```切换交易接口的基地址，```exchange.IO("mbase", ...)```切换行情接口的基地址。 |
| ```exchange.IO(mode, value)``` | ```exchange.IO(mode, value)```切换交易所的交易模式：模拟盘/实盘、全仓/逐仓、双向/单向持仓、统一账户、杠杆模式、自成交预防等。 |
| ```exchange.IO("rate", ...)``` | ```exchange.IO("rate", ...)```与```exchange.IO("quota", ...)```限制API函数的调用频率。 |

### Network

| 名称 | 说明 |
| - | - |
| `HttpQuery` | 发送HTTP请求。 |
| `HttpQuery_Go` | 发送Http请求，是```HttpQuery```函数的异步版本。 |
| `Dial` | 用于原始 ```Socket``` 访问，支持 ```tcp```、```udp```、```tls```、```unix``` 协议。 |
| `Mail` | 发送邮件。 |
| `Mail_Go` | ```Mail```函数的异步版本。 |

### Storage

| 名称 | 说明 |
| - | - |
| `_G` | 持久化保存数据。 |
| `DBExec` | 数据库接口函数。 |
| `SetChannelData` | 在频道上发布最新的状态数据。 |
| `GetChannelData` | 订阅指定实盘的频道数据。 |

### Threads

| 名称 | 说明 |
| - | - |
| `exchange.Go` | 多线程异步支持函数，可将所有受支持函数的操作转换为异步并发执行。 |
| `EventLoop` | 监听事件，当任意```WebSocket```有可读数据，或```exchange.Go()```、```HttpQuery_Go()```等并发任务完成后返回。 |

#### Threads/threading

| 名称 | 说明 |
| - | - |
| `Thread` | ```Thread()```函数用于创建并发线程。 |
| `getThread` | ```getThread()```函数用于根据指定的线程ID获取线程对象。 |
| `mainThread` | ```mainThread()```函数用于获取主线程的线程对象，即策略中```main()```函数所在的线程。 |
| `currentThread` | ```currentThread()```函数用于获取当前线程的线程对象。 |
| `Lock` | ```Lock()```函数用于创建线程锁对象。 |
| `Condition` | ```Condition()```函数用于创建一个条件变量对象，该对象用于在多线程并发环境中实现线程间的同步与通信。 |
| `Event` | ```Event()```函数用于创建一个*线程事件*对象，该对象用于线程间的同步，允许一个线程等待另一个线程的通知或信号。 |
| `Dict` | ```Dict()```函数用于创建一个字典对象，用于在并发线程间传递和共享数据。 |
| `Serve` | ```Serve()```函数在策略进程内创建Http服务、TCP服务、Websocket服务（基于Http协议），返回Server对象。 |
| `pending` | ```pending```函数用于获取当前策略程序中正在运行的并发线程数量。 |

#### Threads/Thread

| 名称 | 说明 |
| - | - |
| `peekMessage` | ```peekMessage()```函数用于从线程接收消息。 |
| `postMessage` | ```postMessage()```函数用于向线程发送消息。 |
| `join` | ```join()```函数用于等待线程退出，并回收系统资源。 |
| `terminate` | ```terminate()```函数用于强制终止线程，释放创建线程时占用的硬件资源。 |
| `getData` | ```getData()```函数用于访问线程环境中记录的变量。 |
| `setData` | ```setData()```函数用于在线程环境中存储变量。 |
| `id` | ```id()```函数用于返回当前多线程对象实例的```threadId```。 |
| `name` | ```name()```函数用于返回当前多线程对象实例的名称。 |
| `eventLoop` | ```eventLoop()``` 函数用于监听当前线程接收到的事件。 |

#### Threads/ThreadLock

| 名称 | 说明 |
| - | - |
| `acquire` | ```acquire()```函数用于请求线程锁（加锁）。 |
| `release` | ```release()```函数用于释放线程锁（解锁）。 |

#### Threads/ThreadEvent

| 名称 | 说明 |
| - | - |
| `set` | ```set()```函数用于设置事件信号。 |
| `clear` | ```clear()```函数用于清除信号。 |
| `wait` | ```wait()```函数用于设置事件（信号）等待，在事件（信号）被设置之前会阻塞；支持设置超时参数。 |
| `isSet` | ```isSet()```函数用于判断事件（信号）是否已被设置。 |

#### Threads/ThreadCondition

| 名称 | 说明 |
| - | - |
| `notify` | ```notify()```函数用于唤醒一个正在等待的线程（如果存在）。 |
| `notifyAll` | ```notifyAll()```函数用于唤醒所有正在等待的线程。 |
| `wait` | ```wait()```函数用于在特定条件下使线程进入等待状态。 |
| `acquire` | ```acquire()```函数用于请求线程锁（加锁）。 |
| `release` | ```release()```函数用于释放线程锁（解锁）。 |

#### Threads/ThreadDict

| 名称 | 说明 |
| - | - |
| `get` | ```get()```函数用于获取字典对象中记录的键值。 |
| `set` | ```set()```函数用于设置键值对。 |

#### Threads/Server

| 名称 | 说明 |
| - | - |
| `addr` | ```addr()```函数返回服务实际监听的地址和端口。 |
| `close` | ```close()```函数停止接收新连接，正在执行的处理函数继续执行完（优雅关闭）。 |
| `stop` | ```stop()```函数先关闭服务（同```close()```），再强制结束所有正在执行的处理函数线程。 |
| `join` | ```join()```函数等待服务关闭且所有处理函数执行完毕。 |
| `pending` | ```pending()```函数返回当前正在执行的处理函数数量，即正在处理的连接或请求数。 |

### Web3

| 名称 | 说明 |
| - | - |
| ```exchange.IO("abi", ...)``` | 在发明者量化交易平台中，区块链相关的各种功能和调用主要通过```exchange.IO()```函数实现。 |
| ```exchange.IO("api", blockChain, ...)``` | ```exchange.IO("api", "eth", ...)```调用方式用于调用以太坊RPC方法（配置Web3交易所对象时需选择eth）。 |
| ```exchange.IO("encode", ...)``` | ```exchange.IO("encode", ...)```函数的这种调用方式用于数据编码。 |
| ```exchange.IO("encodePacked", ...)``` | ```exchange.IO("encodePacked", ...)```函数用于执行```encodePacked```编码操作。 |
| ```exchange.IO("decode", ...)``` | ```exchange.IO("decode", ...)```调用方式用于对数据进行解码。 |
| ```exchange.IO("hash", ...)``` | ```exchange.IO("hash", ...)```函数的调用方式用于计算哈希摘要、HMAC，以及使用交易所对象配置的私钥签名等，参数与Encode函数相同。 |
| ```exchange.IO("key", ...)``` | ```exchange.IO("key", ...)```函数用于切换私钥的调用方式。 |
| ```exchange.IO("sign", ...)``` | ```exchange.IO("sign", ...)```调用方式用于使用secp256k1私钥对32字节哈希进行签名，返回r、s、v等签名数据，适用于EIP-712结构化数据签名（如ERC-20 Permit授权、1inch限价单）等需要链下签名的场景。 |
| ```exchange.IO("signTypedData", ...)``` | ```exchange.IO("signTypedData", ...)```函数的调用方式用于按照EIP-712标准对结构化数据进行签名，一次调用即可完成类型哈希、域分隔符、结构体哈希和摘要的计算并签名，适用于ERC-20 Permit、Permit2、UniswapX、CoW、1inch限价单等场景。 |
| ```exchange.IO("signMessage", ...)``` | ```exchange.IO("signMessage", ...)```调用方式用于按照EIP-191标准（```personal_sign```）对消息进行签名，签名结果与ethers的```signMessage```、钱包的```personal_sign```一致，常用于DApp登录、链下鉴权等场景。 |
| ```exchange.IO("api", ...)``` | ```exchange.IO("api", ...)```调用方式用于调用智能合约的方法。 |
| ```exchange.IO("call", ...)``` | ```exchange.IO("call", ...)```调用方式通过```eth_call```模拟执行智能合约的任意方法（包括会修改链上状态的写入方法），该过程不签名、不广播交易、不消耗gas，适用于链上询价、交易预演以及检查交易能否成功执行。 |
| ```exchange.IO("multicall", ...)``` | ```exchange.IO("multicall", ...)```调用方式用于通过Multicall3合约在一次请求中批量读取多个合约调用的结果，适用于批量查询余额、流动池状态、报价等数据，可有效减少RPC请求次数。 |
| ```exchange.IO("logs", ...)``` | ```exchange.IO("logs", ...)```调用方式用于查询合约的事件日志（```eth_getLogs```），并按ABI进行解码。 |
| ```exchange.IO("waitReceipt", ...)``` | ```exchange.IO("waitReceipt", ...)```调用方式用于等待交易上链并达到指定的确认数，返回交易回执及解码后的事件日志。 |
| ```exchange.IO("nonce", ...)``` | ```exchange.IO("nonce", ...)```函数的调用方式用于查看、同步或设置发送交易时使用的nonce计数。 |
| ```exchange.IO("speedUp", ...)``` | ```exchange.IO("speedUp", ...)```调用方式用于对卡住（长时间未上链）的交易进行加价重发：保持接收地址、金额、调用数据和gas上限不变，仅提高手续费。 |
| ```exchange.IO("cancelTx", ...)``` | ```exchange.IO("cancelTx", ...)```调用方式用于取消尚未上链的交易：使用与原交易相同的nonce，以更高的手续费发送一笔转给自己的0金额交易；该交易先上链后，原交易即失效。 |
| ```exchange.IO("toUnits", ...)``` | ```exchange.IO("toUnits", ...)```函数的调用方式用于将可读数量换算为链上整数。 |
| ```exchange.IO("fromUnits", ...)``` | ```exchange.IO("fromUnits", ...)```调用方式用于将链上整数值换算为可读数量，整个换算过程基于字符串进行精确计算，不经过浮点数运算，避免精度损失。 |
| ```exchange.IO("uniswapV3", ...)``` | ```exchange.IO("uniswapV3", ...)```调用方式用于集中流动性（Uniswap V3）相关的计算，包括tick、价格与sqrtPriceX96之间的换算，以及流动性与代币数量之间的换算。 |
| ```exchange.IO("contracts", ...)``` | ```exchange.IO("contracts", ...)```调用方式用于获取当前链（或指定链）的常用合约地址，包括主流代币、Multicall3、Permit2，以及Uniswap V3、PancakeSwap V3的Factory、路由、QuoterV2和头寸管理合约。 |
| `exchange.IO("address")` | ```exchange.IO("address")```函数的调用方式用于获取exchange交易所对象配置的钱包的地址。 |
| ```exchange.IO("base", ...)``` | ```exchange.IO("base", ...)```调用方式用于设置RPC节点地址，支持设置多个节点互为备用。 |
| ```exchange.IO("sendBase", ...)``` | ```exchange.IO("sendBase", ...)```调用方式用于设置仅用于广播交易的节点。 |

### Uniswap

| 名称 | 说明 |
| - | - |
| ```exchange.IO("transfer", ...)``` | ```exchange.IO("transfer", ...)```调用方式用于从Uniswap交易所对象所配置的钱包中转出链上原生币（如ETH、BNB）或ERC20代币。 |
| ```exchange.IO("receipt", ...)``` | 以```exchange.IO("receipt", ...)```方式调用该函数，可查询Uniswap交易所对象所发出交易（如下单、转账等）的回执，也可等待交易上链。 |
| ```exchange.IO("route", ...)``` | ```exchange.IO("route", ...)```调用用于在Uniswap交易所对象上询价：列出一笔兑换在各条候选路径上的报价以及最优路径，不会实际下单。 |
| ```exchange.IO("simulate", ...)``` | ```exchange.IO("simulate", ...)```调用方式按照Uniswap交易所对象的下单逻辑（路径选择、询价、价格保护）构造兑换交易，仅在链上进行模拟执行（```eth_call```），不签名、不广播，也不消耗gas。 |
| ```exchange.IO("token", ...)``` | ```exchange.IO("token", ...)```函数的调用方式用于在Uniswap交易所对象上登记代币，或者列出代币表。 |
| ```exchange.IO("wrap", ...)``` | ```exchange.IO("wrap", ...)```函数的调用方式用于在Uniswap交易所对象上把原生币（ETH、BNB）包装成包装币（WETH、WBNB），1:1兑换，没有滑点，只花gas。 |
| ```exchange.IO("unwrap", ...)``` | ```exchange.IO("unwrap", ...)```函数的调用方式用于在Uniswap交易所对象上把包装币（WETH、WBNB）解包成原生币（ETH、BNB），1:1兑换，没有滑点，只花gas。 |
| ```exchange.IO("approve", ...)``` | 以```exchange.IO("approve", ...)```方式调用该函数，可在Uniswap交易所对象上设置代币授权模式。 |
| ```exchange.IO("slippage", ...)``` | ```exchange.IO("slippage", ...)```函数的此种调用方式用于为Uniswap交易所对象设置市价单的滑点保护。 |
| ```exchange.IO("deadline", ...)``` | ```exchange.IO("deadline", ...)```调用方式用于在Uniswap交易所对象上设置交易的截止时间。 |
| ```exchange.IO("gasMultiplier", ...)``` | ```exchange.IO("gasMultiplier", ...)```调用方式用于在Uniswap交易所对象上设置gas上限倍数。 |

### TA

| 名称 | 说明 |
| - | - |
| `TA.MACD` | ```TA.MACD()```函数用于计算**指数平滑异同移动平均线（MACD）指标**。 |
| `TA.KDJ` | ```TA.KDJ()```函数用于计算**随机指标（KDJ）**。 |
| `TA.RSI` | ```TA.RSI()```函数用于计算**相对强弱指标（RSI）**。 |
| `TA.ATR` | ```TA.ATR()```函数用于计算**平均真实波幅指标（ATR）**。 |
| `TA.OBV` | ```TA.OBV()```函数用于计算**能量潮指标（OBV）**。 |
| `TA.MA` | ```TA.MA()```函数用于计算**移动平均线指标（Moving Average）**。 |
| `TA.EMA` | ```TA.EMA()```函数用于计算**指数移动平均线（EMA）指标**。 |
| `TA.BOLL` | ```TA.BOLL()```函数用于计算**布林带指标**。 |
| `TA.Alligator` | ```TA.Alligator()```函数用于计算**鳄鱼线指标（Alligator）**。 |
| `TA.CMF` | ```TA.CMF()```函数用于计算**蔡金资金流量指标（Chaikin Money Flow）**。 |
| `TA.Highest` | ```TA.Highest()```函数用于计算**周期内最高价**。 |
| `TA.Lowest` | ```TA.Lowest()```函数用于计算**周期最低价**。 |
| `TA.SMA` | ```TA.SMA()```函数用于计算**简单移动平均线（SMA）指标**。 |

#### Talib/OverlapStudies

| 名称 | 说明 |
| - | - |
| `talib.BBANDS` | ```talib.BBANDS()```函数用于计算**Bollinger Bands（布林带）**。 |
| `talib.DEMA` | ```talib.DEMA()```函数用于计算**Double Exponential Moving Average（双指数移动平均线）**。 |
| `talib.EMA` | ```talib.EMA()```函数用于计算**Exponential Moving Average（指数移动平均线）**。 |
| `talib.HT_TRENDLINE` | ```talib.HT_TRENDLINE()```函数用于计算**Hilbert Transform - Instantaneous Trendline（希尔伯特变换瞬时趋势线）**。 |
| `talib.KAMA` | ```talib.KAMA()```函数用于计算**Kaufman自适应移动平均线（Kaufman Adaptive Moving Average）**。 |
| `talib.MA` | ```talib.MA()```函数用于计算**Moving average（移动平均线）**。 |
| `talib.MAMA` | ```talib.MAMA()```函数用于计算**MESA自适应移动平均线（MESA Adaptive Moving Average）**。 |
| `talib.MIDPOINT` | ```talib.MIDPOINT()```函数用于计算**MidPoint over period（中点价格）**。 |
| `talib.MIDPRICE` | ```talib.MIDPRICE()```函数用于计算**Midpoint Price over period（中点价格）**。 |
| `talib.SAR` | ```talib.SAR()```函数用于计算**抛物线转向指标（Parabolic SAR）**。 |
| `talib.SAREXT` | ```talib.SAREXT()```函数用于计算**Parabolic SAR - Extended（增强型抛物线转向指标）**。 |
| `talib.SMA` | ```talib.SMA()```函数用于计算**Simple Moving Average（简单移动平均线）**。 |
| `talib.T3` | ```talib.T3()```函数用于计算**Triple Exponential Moving Average (T3) (三重指数移动平均)**。 |
| `talib.TEMA` | ```talib.TEMA()```函数用于计算**Triple Exponential Moving Average（三重指数移动平均线）**。 |
| `talib.TRIMA` | ```talib.TRIMA()```函数用于计算**Triangular Moving Average（三角移动平均线）**。 |
| `talib.WMA` | ```talib.WMA()```函数用于计算**Weighted Moving Average（加权移动平均）**。 |

#### Talib/MomentumIndicators

| 名称 | 说明 |
| - | - |
| `talib.ADX` | ```talib.ADX()```函数用于计算**Average Directional Movement Index（平均趋向指数）**。 |
| `talib.ADXR` | ```talib.ADXR()```函数用于计算**平均趋向指数评级（Average Directional Movement Index Rating）**。 |
| `talib.APO` | ```talib.APO()```函数用于计算**Absolute Price Oscillator（绝对价格振荡器）**。 |
| `talib.AROON` | ```talib.AROON()```函数用于计算**Aroon（阿隆指标）**。 |
| `talib.AROONOSC` | ```talib.AROONOSC()```函数用于计算**Aroon Oscillator（阿隆震荡指标）**。 |
| `talib.BOP` | ```talib.BOP()```函数用于计算**Balance Of Power（均势指标）**。 |
| `talib.CCI` | ```talib.CCI()```函数用于计算**Commodity Channel Index（商品通道指数）**。 |
| `talib.CMO` | ```talib.CMO()```函数用于计算**Chande Momentum Oscillator（钱德动量摆动指标）**。 |
| `talib.DX` | ```talib.DX()```函数用于计算**Directional Movement Index（动向指数）**。 |
| `talib.MACD` | ```talib.MACD()```函数用于计算**Moving Average Convergence/Divergence（移动平均收敛发散指标）**。 |
| `talib.MACDEXT` | ```talib.MACDEXT()```函数用于计算**MACD with controllable MA type（可控移动平均类型的MACD）**。 |
| `talib.MACDFIX` | ```talib.MACDFIX()```函数用于计算**Moving Average Convergence/Divergence Fix 12/26（移动平均收敛/发散固定12/26）**。 |
| `talib.MFI` | ```talib.MFI()```函数用于计算**Money Flow Index（资金流量指数）**。 |
| `talib.MINUS_DI` | ```talib.MINUS_DI()```函数用于计算**负向指标（Minus Directional Indicator）**。 |
| `talib.MINUS_DM` | ```talib.MINUS_DM()```函数用于计算**负向运动指标（Minus Directional Movement）**。 |
| `talib.MOM` | ```talib.MOM()```函数用于计算**Momentum（动量指标）**。 |
| `talib.PLUS_DI` | ```talib.PLUS_DI()```函数用于计算**Plus Directional Indicator（正向指标）**。 |
| `talib.PLUS_DM` | ```talib.PLUS_DM()```函数用于计算**Plus Directional Movement（正向运动指标）**。 |
| `talib.PPO` | ```talib.PPO()```函数用于计算**Percentage Price Oscillator（价格振荡百分比）**。 |
| `talib.ROC` | ```talib.ROC()```函数用于计算**变动率指标（Rate of change）：((price/prevPrice)-1)*100**。 |
| `talib.ROCP` | ```talib.ROCP()```函数用于计算**价格变化率百分比：(price-prevPrice)/prevPrice**。 |
| `talib.ROCR` | ```talib.ROCR()```函数用于计算**价格变化率比值：(price/prevPrice)**。 |
| `talib.ROCR100` | ```talib.ROCR100()```函数用于计算**Rate of change ratio 100 scale: (price/prevPrice)*100（价格变化率比例100倍）**。 |
| `talib.RSI` | ```talib.RSI()```函数用于计算**Relative Strength Index（相对强弱指标）**。 |
| `talib.STOCH` | ```talib.STOCH()```函数用于计算**随机指标（STOCH指标）**。 |
| `talib.STOCHF` | ```talib.STOCHF()```函数用于计算**快速随机指标（Stochastic Fast）**。 |
| `talib.STOCHRSI` | ```talib.STOCHRSI()```函数用于计算**随机相对强弱指数（Stochastic Relative Strength Index）**。 |
| `talib.TRIX` | ```talib.TRIX()```函数用于计算**1-day Rate-Of-Change (ROC) of a Triple Smooth EMA（三重指数平滑移动平均线的一日变化率）**。 |
| `talib.ULTOSC` | ```talib.ULTOSC()```函数用于计算**Ultimate Oscillator（极限振荡器）**。 |
| `talib.WILLR` | ```talib.WILLR()```函数用于计算**Williams' %R（威廉指标）**。 |

#### Talib/VolumeIndicators

| 名称 | 说明 |
| - | - |
| `talib.AD` | ```talib.AD()```函数用于计算**Chaikin A/D Line（累积/派发线指标）**。 |
| `talib.ADOSC` | ```talib.ADOSC()```函数用于计算**Chaikin A/D Oscillator（佳庆指标）**。 |
| `talib.OBV` | ```talib.OBV()```函数用于计算**On Balance Volume（能量潮指标）**。 |

#### Talib/VolatilityIndicators

| 名称 | 说明 |
| - | - |
| `talib.ATR` | ```talib.ATR()```函数用于计算**Average True Range（平均真实波幅）**指标。 |
| `talib.NATR` | ```talib.NATR()```函数用于计算**Normalized Average True Range（归一化平均真实范围）**。 |
| `talib.TRANGE` | ```talib.TRANGE()```函数用于计算**True Range（真实范围）**指标。 |

#### Talib/CycleIndicators

| 名称 | 说明 |
| - | - |
| `talib.HT_DCPERIOD` | ```talib.HT_DCPERIOD()```函数用于计算**Hilbert Transform - Dominant Cycle Period（希尔伯特变换主导周期）**。 |
| `talib.HT_DCPHASE` | ```talib.HT_DCPHASE()```函数用于计算**希尔伯特变换主周期相位（Hilbert Transform - Dominant Cycle Phase）**。 |
| `talib.HT_PHASOR` | ```talib.HT_PHASOR()```函数用于计算**Hilbert Transform - Phasor Components（希尔伯特变换-相量分量）**。 |
| `talib.HT_SINE` | ```talib.HT_SINE()```函数用于计算**Hilbert Transform - SineWave（希尔伯特变换 - 正弦波）**。 |
| `talib.HT_TRENDMODE` | ```talib.HT_TRENDMODE()```函数用于计算**Hilbert Transform - Trend vs Cycle Mode（希尔伯特变换 - 趋势与周期模式）**。 |

#### Talib/PriceTransform

| 名称 | 说明 |
| - | - |
| `talib.AVGPRICE` | ```talib.AVGPRICE()```函数用于计算**Average Price（平均价格）**。 |
| `talib.MEDPRICE` | ```talib.MEDPRICE()```函数用于计算**Median Price（中位数价格）**。 |
| `talib.TYPPRICE` | ```talib.TYPPRICE()```函数用于计算**典型价格（Typical Price）**。 |
| `talib.WCLPRICE` | ```talib.WCLPRICE()```函数用于计算**Weighted Close Price（加权收盘价）**。 |

#### Talib/StatisticFunctions

| 名称 | 说明 |
| - | - |
| `talib.LINEARREG` | ```talib.LINEARREG()```函数用于计算**Linear Regression（线性回归）**指标。 |
| `talib.LINEARREG_ANGLE` | ```talib.LINEARREG_ANGLE()```函数用于计算**Linear Regression Angle（线性回归角度）**。 |
| `talib.LINEARREG_INTERCEPT` | ```talib.LINEARREG_INTERCEPT()```函数用于计算**线性回归截距（Linear Regression Intercept）**。 |
| `talib.LINEARREG_SLOPE` | ```talib.LINEARREG_SLOPE()```函数用于计算**Linear Regression Slope（线性回归斜率）**。 |
| `talib.STDDEV` | ```talib.STDDEV()```函数用于计算**标准偏差（Standard Deviation）**。 |
| `talib.TSF` | ```talib.TSF()```函数用于计算**Time Series Forecast（时间序列预测）**。 |
| `talib.VAR` | ```talib.VAR()```函数用于计算**方差（Variance）**。 |

#### Talib/MathTransform

| 名称 | 说明 |
| - | - |
| `talib.ACOS` | ```talib.ACOS()```函数用于计算**向量三角反余弦函数（Vector Trigonometric ACos）**。 |
| `talib.ASIN` | ```talib.ASIN()```函数用于计算**向量三角反正弦函数（Vector Trigonometric ASin）**。 |
| `talib.ATAN` | ```talib.ATAN()```函数用于计算**向量三角反正切函数（Vector Trigonometric ATan）**。 |
| `talib.CEIL` | ```talib.CEIL()```函数用于计算**向上取整（Vector Ceil）**。 |
| `talib.COS` | ```talib.COS()```函数用于计算**Vector Trigonometric Cos（向量三角余弦函数）**。 |
| `talib.COSH` | ```talib.COSH()```函数用于计算**向量三角双曲余弦值（Vector Trigonometric Cosh）**。 |
| `talib.EXP` | ```talib.EXP()```函数用于计算**向量算术指数函数（Vector Arithmetic Exp）**。 |
| `talib.FLOOR` | ```talib.FLOOR()```函数用于计算**向量向下取整（Vector Floor）**。 |
| `talib.LN` | ```talib.LN()```函数用于计算**向量自然对数（Vector Log Natural）**。 |
| `talib.LOG10` | ```talib.LOG10()```函数用于计算**Vector Log10（对数函数）**。 |
| `talib.SIN` | ```talib.SIN()```函数用于计算**Vector Trigonometric Sin（正弦值）**。 |
| `talib.SINH` | ```talib.SINH()```函数用于计算**向量三角双曲正弦函数（Vector Trigonometric Sinh）**。 |
| `talib.SQRT` | ```talib.SQRT()```函数用于计算**向量平方根（Vector Square Root）**。 |
| `talib.TAN` | ```talib.TAN()```函数用于计算**向量三角正切值（Vector Trigonometric Tan）**。 |
| `talib.TANH` | ```talib.TANH()```函数用于计算**向量三角双曲正切函数（Vector Trigonometric Tanh）**。 |

#### Talib/MathOperators

| 名称 | 说明 |
| - | - |
| `talib.MAX` | ```talib.MAX()```函数用于计算**指定周期内的最大值（Highest value over a specified period）**。 |
| `talib.MAXINDEX` | ```talib.MAXINDEX()```函数用于计算**指定周期内最大值的索引位置（Index of highest value over a specified period）**。 |
| `talib.MIN` | ```talib.MIN()```函数用于计算**指定周期内的最小值（Lowest value over a specified period）**。 |
| `talib.MININDEX` | ```talib.MININDEX()```函数用于计算**指定周期内最小值的索引位置（Index of lowest value over a specified period）**。 |
| `talib.MINMAX` | ```talib.MINMAX()```函数用于计算**指定周期内的最小值和最大值（Lowest and highest values over a specified period）**。 |
| `talib.MINMAXINDEX` | ```talib.MINMAXINDEX()```函数用于计算**指定周期内最低值和最高值的索引位置（Indexes of lowest and highest values over a specified period）**。 |
| `talib.SUM` | ```talib.SUM()```函数用于计算**求和（Summation）**。 |

#### Talib/PatternRecognition

| 名称 | 说明 |
| - | - |
| `talib.CDL2CROWS` | ```talib.CDL2CROWS()```函数用于计算**Two Crows（K线形态--两只乌鸦）**。 |
| `talib.CDL3BLACKCROWS` | ```talib.CDL3BLACKCROWS()```函数用于计算**Three Black Crows（K线图形态--三只黑乌鸦）**。 |
| `talib.CDL3INSIDE` | ```talib.CDL3INSIDE()```函数用于计算**Three Inside Up/Down（K线形态：三内上下震荡）**。 |
| `talib.CDL3LINESTRIKE` | ```talib.CDL3LINESTRIKE()```函数用于计算**Three-Line Strike（K线图：三线震荡）**。 |
| `talib.CDL3OUTSIDE` | ```talib.CDL3OUTSIDE()```函数用于计算**Three Outside Up/Down（K线形态：三外包线）**。 |
| `talib.CDL3STARSINSOUTH` | ```talib.CDL3STARSINSOUTH()```函数用于计算**Three Stars In The South（K线形态：南方三星）**。 |
| `talib.CDL3WHITESOLDIERS` | ```talib.CDL3WHITESOLDIERS()```函数用于计算**Three Advancing White Soldiers（K线形态：三白兵）**。 |
| `talib.CDLABANDONEDBABY` | ```talib.CDLABANDONEDBABY()```函数用于计算**弃婴形态（K线图：Abandoned Baby）**。 |
| `talib.CDLADVANCEBLOCK` | ```talib.CDLADVANCEBLOCK()```函数用于计算**Advance Block（K线形态：推进阻挡）**。 |
| `talib.CDLBELTHOLD` | ```talib.CDLBELTHOLD()```函数用于计算**Belt-hold（K线形态：腰带线）**。 |
| `talib.CDLBREAKAWAY` | ```talib.CDLBREAKAWAY()```函数用于计算**Breakaway（K线形态：分离形态）**。 |
| `talib.CDLCLOSINGMARUBOZU` | ```talib.CDLCLOSINGMARUBOZU()```函数用于计算**收盘光头光脚线（Closing Marubozu）**K线形态。 |
| `talib.CDLCONCEALBABYSWALL` | ```talib.CDLCONCEALBABYSWALL()```函数用于计算**Concealing Baby Swallow（K线图：藏婴吞没形态）**。 |
| `talib.CDLCOUNTERATTACK` | ```talib.CDLCOUNTERATTACK()```函数用于计算**反击线形态（K线图：反击）**。 |
| `talib.CDLDARKCLOUDCOVER` | ```talib.CDLDARKCLOUDCOVER()```函数用于计算**乌云盖顶（Dark Cloud Cover）K线形态**。 |
| `talib.CDLDOJI` | ```talib.CDLDOJI()```函数用于计算**Doji（K线图：十字星）**。 |
| `talib.CDLDOJISTAR` | ```talib.CDLDOJISTAR()```函数用于计算**Doji Star（K线图：十字星）**。 |
| `talib.CDLDRAGONFLYDOJI` | ```talib.CDLDRAGONFLYDOJI()```函数用于计算**Dragonfly Doji（K线形态：蜻蜓十字星）**。 |
| `talib.CDLENGULFING` | ```talib.CDLENGULFING()```函数用于计算**吞没形态（Engulfing Pattern）**。 |
| `talib.CDLEVENINGDOJISTAR` | ```talib.CDLEVENINGDOJISTAR()```函数用于计算**Evening Doji Star（K线形态：黄昏十字星）**。 |
| `talib.CDLEVENINGSTAR` | ```talib.CDLEVENINGSTAR()```函数用于计算**Evening Star（K线图：黄昏之星）**形态。 |
| `talib.CDLGAPSIDESIDEWHITE` | ```talib.CDLGAPSIDESIDEWHITE()```函数用于计算**Up/Down-gap side-by-side white lines (K线图：上/下间隙并排白色线条)**。 |
| `talib.CDLGRAVESTONEDOJI` | ```talib.CDLGRAVESTONEDOJI()```函数用于计算**墓碑十字线（Gravestone Doji）**K线形态。 |
| `talib.CDLHAMMER` | ```talib.CDLHAMMER()```函数用于计算**锤子线（K线形态：锤子）**。 |
| `talib.CDLHANGINGMAN` | ```talib.CDLHANGINGMAN()```函数用于计算**Hanging Man（K线形态：吊人线）**。 |
| `talib.CDLHARAMI` | ```talib.CDLHARAMI()```函数用于计算**Harami Pattern（K线图：阴阳线模式）**。 |
| `talib.CDLHARAMICROSS` | ```talib.CDLHARAMICROSS()```函数用于计算**Harami Cross Pattern（K线图：十字星孕线形态）**。 |
| `talib.CDLHIGHWAVE` | ```talib.CDLHIGHWAVE()```函数用于计算**High-Wave Candle（K线图：长脚十字线）**。 |
| `talib.CDLHIKKAKE` | ```talib.CDLHIKKAKE()```函数用于计算**Hikkake Pattern（K线图：陷阱模式）**。 |
| `talib.CDLHIKKAKEMOD` | ```talib.CDLHIKKAKEMOD()```函数用于计算**Modified Hikkake Pattern（K线图：改良陷阱模式）**。 |
| `talib.CDLHOMINGPIGEON` | ```talib.CDLHOMINGPIGEON()```函数用于计算**Homing Pigeon（K线形态：信鸽形态）**。 |
| `talib.CDLIDENTICAL3CROWS` | ```talib.CDLIDENTICAL3CROWS()```函数用于计算**Identical Three Crows（K线形态：相同三只乌鸦）**。 |
| `talib.CDLINNECK` | ```talib.CDLINNECK()```函数用于计算**颈内线形态（K线图：颈内线）**。 |
| `talib.CDLINVERTEDHAMMER` | ```talib.CDLINVERTEDHAMMER()```函数用于计算**倒锤形态（K线图：倒锤）**。 |
| `talib.CDLKICKING` | ```talib.CDLKICKING()```函数用于计算**Kicking（K线形态：踢腿形态）**。 |
| `talib.CDLKICKINGBYLENGTH` | ```talib.CDLKICKINGBYLENGTH()```函数用于计算**Kicking - bull/bear determined by the longer marubozu (K线图：踢牛/踢熊)**。 |
| `talib.CDLLADDERBOTTOM` | ```talib.CDLLADDERBOTTOM()```函数用于计算**Ladder Bottom（K线形态：梯底）**。 |
| `talib.CDLLONGLEGGEDDOJI` | ```talib.CDLLONGLEGGEDDOJI()```函数用于计算**长腿十字线（K线形态：Long Legged Doji）**。 |
| `talib.CDLLONGLINE` | ```talib.CDLLONGLINE()```函数用于计算**长线蜡烛形态（K线图：长线）**。 |
| `talib.CDLMARUBOZU` | ```talib.CDLMARUBOZU()```函数用于计算**Marubozu（K线图：光头光脚）**模式。 |
| `talib.CDLMATCHINGLOW` | ```talib.CDLMATCHINGLOW()```函数用于计算**Matching Low（K线图：匹配低点）**。 |
| `talib.CDLMATHOLD` | ```talib.CDLMATHOLD()```函数用于计算**Mat Hold（K线形态：垫住）**。 |
| `talib.CDLMORNINGDOJISTAR` | ```talib.CDLMORNINGDOJISTAR()```函数用于计算**Morning Doji Star（K线形态：早晨十字星）**。 |
| `talib.CDLMORNINGSTAR` | ```talib.CDLMORNINGSTAR()```函数用于计算**Morning Star（K线形态：晨星）**。 |
| `talib.CDLONNECK` | ```talib.CDLONNECK()```函数用于计算**On-Neck Pattern（K线图：颈上线形态）**。 |
| `talib.CDLPIERCING` | ```talib.CDLPIERCING()```函数用于计算**Piercing Pattern（K线图：穿透形态）**。 |
| `talib.CDLRICKSHAWMAN` | ```talib.CDLRICKSHAWMAN()```函数用于计算**Rickshaw Man（K线形态：车夫线）**。 |
| `talib.CDLRISEFALL3METHODS` | ```talib.CDLRISEFALL3METHODS()```函数用于计算**Rising/Falling Three Methods（K线形态：上升/下降三法）**。 |
| `talib.CDLSEPARATINGLINES` | ```talib.CDLSEPARATINGLINES()```函数用于计算**分离线形态（K线图：分离线）**。 |
| `talib.CDLSHOOTINGSTAR` | ```talib.CDLSHOOTINGSTAR()```函数用于计算**Shooting Star（K线形态：流星）**。 |
| `talib.CDLSHORTLINE` | ```talib.CDLSHORTLINE()```函数用于计算**短线蜡烛图形态（K线图：短线）**。 |
| `talib.CDLSPINNINGTOP` | ```talib.CDLSPINNINGTOP()```函数用于计算**Spinning Top（K线形态：陀螺）**。 |
| `talib.CDLSTALLEDPATTERN` | ```talib.CDLSTALLEDPATTERN()```函数用于计算**Stalled Pattern（K线图：停滞模式）**。 |
| `talib.CDLSTICKSANDWICH` | ```talib.CDLSTICKSANDWICH()```函数用于计算**Stick Sandwich（K线形态：棍子三明治）**。 |
| `talib.CDLTAKURI` | ```talib.CDLTAKURI()```函数用于计算**Takuri (Dragonfly Doji with very long lower shadow) (K线图:托里)**蜡烛图形态。 |
| `talib.CDLTASUKIGAP` | ```talib.CDLTASUKIGAP()```函数用于计算**Tasuki Gap（K线图：翼隙）**。 |
| `talib.CDLTHRUSTING` | ```talib.CDLTHRUSTING()```函数用于计算**Thrusting Pattern（K线图：推进模式）**。 |
| `talib.CDLTRISTAR` | ```talib.CDLTRISTAR()```函数用于计算**三星形态（K线图：三星模式）**。 |
| `talib.CDLUNIQUE3RIVER` | ```talib.CDLUNIQUE3RIVER()```函数用于计算**Unique 3 River（K线形态：独特三河）**。 |
| `talib.CDLUPSIDEGAP2CROWS` | ```talib.CDLUPSIDEGAP2CROWS()```函数用于计算**向上跳空双乌鸦形态（K线图：双飞乌鸦）**。 |
| `talib.CDLXSIDEGAP3METHODS` | ```talib.CDLXSIDEGAP3METHODS()```函数用于计算**上行/下行缺口三方法（K线形态识别）**。 |

### OS

| 名称 | 说明 |
| - | - |
| `ListFilesResult` | 文件列表对象，用于记录目录列表信息。 |
| `FileStat` | 文件统计信息对象。 |

#### OS/os

| 名称 | 说明 |
| - | - |
| `open` | 以指定模式打开文件。 |
| `fgets` | 一次性读取整个文件的内容。 |
| `fputs` | 向文件写入内容。 |
| `mmap` | 内存映射文件，返回文件的二进制数据。 |
| `getRootDir` | 获取文件操作的根目录路径。 |
| `listFiles` | 列出指定目录中的文件和子目录。 |
| `exists` | 检查指定的文件或目录是否存在。 |
| `remove` | 删除指定文件。 |
| `mkdir` | 创建目录。 |
| `rmdir` | 删除目录及其所有内容。 |
| `rename` | 重命名文件或移动文件。 |
| `stat` | 获取文件的详细统计信息。 |
| `exit` | 退出程序。 |

#### OS/File

| 名称 | 说明 |
| - | - |
| `close` | 关闭文件并释放相关资源。 |
| `puts` | 向文件写入一个或多个字符串。 |
| `printf` | 格式化写入数据到文件。 |
| `flush` | 刷新文件缓冲区，确保数据写入磁盘。 |
| `tell` | 获取当前文件指针的位置。 |
| `seek` | 将文件指针移动到指定位置。 |
| `eof` | 检查文件指针是否已到达文件末尾。 |
| `read` | 从文件中读取数据。 |
| `write` | 向文件写入字符串数据。 |
| `getline` | 从文件中读取下一行内容。 |
| `toString` | 获取文件对象的字符串表示形式。 |

## 结构体

| 名称 | 说明 |
| - | - |
| `Ticker` | 市场行情数据结构。 |
| `Depth` | 市场深度数据结构。 |
| `OrderBook` | 市场深度中的订单结构。 |
| `Trade` | 市场成交记录的数据结构。 |
| `Record` | K线柱的数据结构，标准的OHLC格式，用于绘制K线图和技术指标计算分析。 |
| `Market` | 交易品种市场信息的数据结构。 |
| `Order` | 订单结构。 |
| `Condition` | 条件单配置信息结构，用于设置条件单的触发条件和执行价格。 |
| `Account` | 账户信息的数据结构。 |
| `Asset` | 具体币种资产信息的数据结构。 |
| `Position` | 合约仓位信息的数据结构。 |
| `Funding` | 交易品种资金费率信息的数据结构，仅加密货币永续合约支持资金费率功能。 |

### OtherStruct

| 名称 | 说明 |
| - | - |
| `HttpQuery-options` | 此JSON结构用于配置HttpQuery函数和HttpQuery_Go函数发送HTTP请求的各项参数。 |
| `HttpQuery-return` | 该JSON结构是调用HttpQuery函数时，在参数```options```结构中将debug字段指定为true后，HttpQuery函数在调试模式下返回的数据结构。 |
| `LogStatus-table` | 此JSON结构用于配置策略状态栏中显示的表格内容。 |
| `LogStatus-btnTypeOne` | 该JSON结构用于配置状态栏中的按钮控件，按钮控件JSON结构可以嵌入到状态栏表格JSON结构中。 |
| `LogStatus-btnTypeTwo` | 此JSON结构用于配置状态栏中的按钮控件，按钮控件JSON结构可以嵌入到状态栏表格JSON结构中。 |
| `Chart-options` | 此JSON用于配置自定义绘图函数```Chart()```的图表设置信息，图表库使用Highcharts。 |
| `KLineChart-options` | 此JSON用于设置自定义绘图函数```KLineChart```的图表配置信息。 |
| `SetData-data` | 该JSON用于设置```exchange.SetData()```函数所要加载的数据。 |
| `EventLoop-return` | 该JSON是```EventLoop()```函数返回的数据结构。 |
| `DBExec-return` | 该JSON是```DBExec()```函数返回的数据结构；使用```Dial()```函数创建的对象的```exec()```方法执行SQL语句时，也返回此JSON数据结构。 |
| `Thread.join-return` | 该JSON是```Thread```对象的成员函数```join()```返回的数据结构，用于保存```JavaScript```语言策略中并发线程的相关信息。 |

## 内置变量与常量

### EXCHANGE

| 名称 | 说明 |
| - | - |
| `exchange` | exchange 是一个交易所对象，也是在策略实盘设置、回测设置中添加的第一个交易所对象。 |
| `exchanges` | exchanges 是一个交易所对象数组，包含在策略实盘设置或回测设置中添加的所有交易所对象，其中 exchanges[0] 即为 exchange。 |

### ORDER_STATE

| 名称 | 说明 |
| - | - |
| `ORDER_STATE_PENDING` | ORDER_STATE_PENDING是Order结构中的```Status```属性的值，表示订单状态为待处理状态。 |
| `ORDER_STATE_CLOSED` | ORDER_STATE_CLOSED是Order结构中的```Status```属性的值，表示订单状态为已完成。 |
| `ORDER_STATE_CANCELED` | ORDER_STATE_CANCELED 是 Order 结构中 ```Status``` 属性的值，表示订单状态为已取消。 |
| `ORDER_STATE_UNKNOWN` | ORDER_STATE_UNKNOWN是Order结构中的```Status```属性的值，表示订单状态为未知状态（其他状态）。 |

### ORDER_TYPE

| 名称 | 说明 |
| - | - |
| `ORDER_TYPE_BUY` | ORDER_TYPE_BUY是Order结构中的```Type```属性值，表示买入订单类型。 |
| `ORDER_TYPE_SELL` | ORDER_TYPE_SELL是Order结构中的```Type```属性值，用于表示卖单类型。 |

### ORDER_CONDITION_TYPE

| 名称 | 说明 |
| - | - |
| `ORDER_CONDITION_TYPE_OCO` | ORDER_CONDITION_TYPE_OCO是Condition结构中的```ConditionType```属性的值，表示OCO订单（One-Cancels-the-Other，一触即撤订单）。 |
| `ORDER_CONDITION_TYPE_TP` | ORDER_CONDITION_TYPE_TP 是 Condition 结构中的 ```ConditionType``` 属性值，表示止盈单（Take Profit）。 |
| `ORDER_CONDITION_TYPE_SL` | ORDER_CONDITION_TYPE_SL 是 Condition 结构中的 ```ConditionType``` 属性值，表示止损单（Stop Loss）。 |
| `ORDER_CONDITION_TYPE_GENERIC` | ORDER_CONDITION_TYPE_GENERIC 是 Condition 结构中的 ```ConditionType``` 属性值，表示通用条件单。 |

### POSITION_DIRECTION

| 名称 | 说明 |
| - | - |
| `PD_LONG` | PD_LONG是Position结构中的```Type```属性值，表示多头仓位类型。 |
| `PD_SHORT` | PD_SHORT是Position结构中的```Type```属性值，表示空头仓位类型。 |

### ORDER_OFFSET

| 名称 | 说明 |
| - | - |
| `ORDER_OFFSET_OPEN` | ORDER_OFFSET_OPEN是Order结构中```Offset```属性的取值，表示该订单为开仓操作。 |
| `ORDER_OFFSET_CLOSE` | ORDER_OFFSET_CLOSE是Order结构中```Offset```属性的取值，表示订单为平仓方向。 |

### PERIOD

| 名称 | 说明 |
| - | - |
| `PERIOD_M1` | 表示1分钟K线周期的常量，数值为60。 |
| `PERIOD_M3` | 表示3分钟K线周期的常量，其值为180。 |
| `PERIOD_M5` | 表示5分钟K线周期的常量，数值为300。 |
| `PERIOD_M15` | 表示15分钟K线周期的常量，其值为900。 |
| `PERIOD_M30` | 表示30分钟K线周期的常量，其值为1800秒。 |
| `PERIOD_H1` | 表示1小时K线周期的常量，数值为3600。 |
| `PERIOD_H2` | 表示2小时K线周期的常量，数值为7200。 |
| `PERIOD_H4` | 表示4小时K线周期的常量，数值为14400。 |
| `PERIOD_H6` | 表示6小时K线周期的常量，数值为21600。 |
| `PERIOD_H12` | 表示12小时K线周期的常量，数值为43200。 |
| `PERIOD_D1` | 表示1日K线周期的常量，数值为86400。 |
| `PERIOD_D3` | 表示3日K线周期的常量，数值为259200。 |
| `PERIOD_W1` | 表示1周K线周期的常量，数值为604800秒。 |

### LOG_TYPE

| 名称 | 说明 |
| - | - |
| `LOG_TYPE_BUY` | LOG_TYPE_BUY是exchange.Log函数的```LogType```参数可选值，用于设置```exchange.Log```函数打印的日志类型为买单日志。 |
| `LOG_TYPE_SELL` | LOG_TYPE_SELL是exchange.Log函数的```LogType```参数可选值，用于设置```exchange.Log```函数打印卖单日志。 |
| `LOG_TYPE_CANCEL` | LOG_TYPE_CANCEL是exchange.Log函数的```LogType```参数可选值，用于设置```exchange.Log```函数打印撤销订单日志。 |

### 策略参数

策略界面上设置的策略参数，在策略代码中以同名的全局变量（Rust 中为全局常量）出现，直接用变量名访问：
- ```JavaScript```、```My语言```：可以直接读取参数，也可以在代码中修改参数变量。
- ```Python```：可以直接读取；在函数中给参数变量重新赋值时，需要先用```global```声明。
- ```Rust```：参数是常量，只能读取，不能修改；各种参数对应的类型见 `Rust`。
- ```PINE```：使用```input()```函数创建界面参数。
- ```Blockly可视化```：没有界面参数。

![策略参数设置界面](https://www.fmz.com/upload/asset/2e46b5e593de3b2f11445.png)

#### 界面参数种类

| 变量(命名举例) | 描述 | 类型 | 默认值(说明) | 组件配置(说明) | 备注 |
| - | - | - | - | - | - |
| pNum       | 参数pNum的描述       | 数字型(number)     | 举例设置默认值为:100，Rust策略中为f64| 用于设置当前参数绑定的界面控件的：组件类型、最小值、最大值、分组、过滤器等 | 参数pNum的备注，pNum的值为数值类型 |
| pBool      | 参数pBool的描述      | 布尔型(true/false) | 使用开关控件设置默认值，不具备选填控件 | 同上                                                          | 参数pBool的备注，pBool的值为布尔类型 |
| pStr       | 参数pStr的描述       | 字符串(string)     | 举例设置默认值为:abc               | 同上                                                          | 参数pStr的备注，pStr的值为字符串类型 |
| pCombox    | 参数pCombox的描述    | 下拉框(selected)   | 设置选项中的某一个选项或多个选项      | 同上                                                          | 参数pCombox的备注，pCombox的值可能有多种形式 |
| pSecretStr | 参数pSecretStr的描述 | 加密串(string)     | 举例设置默认值为:xyz               | 同上                                                          | 参数pSecretStr的备注，pSecretStr的值为字符串类型 |

界面参数，在策略编辑页面代码编辑区下方策略参数区设置，需要注意：
1、参数设置的默认值选项中「选填」控件默认为选填状态，可以改变该控件的状态，设置当前参数为必填。设置参数默认值为必填后，如果策略在回测/实盘时没有设置该参数则无法进行回测/启动实盘。
2、界面参数在策略代码中的变量名不要设置为当前编程语言的保留字（关键字）。
3、在回测/实盘界面鼠标放在参数绑定的控件上时，会显示设置的参数备注信息。
4、参数的「描述」即参数绑定的控件的显示名称。
5、参数的「变量」即以上表格中的：```pNum```、```pBool```、```pStr```、```pCombox```、```pSecretStr```。在策略代码中是以全局变量形式存在的，也就是说可以在代码中修改策略参数（Rust 除外：Rust 中参数是全局常量，不能修改）。
6、对于「加密串」和「字符串」类型的参数，默认值输入时不需要加引号，输入均作为字符串处理。「加密串」参数的使用与「字符串」参数相同，加密字符串会被加密发送，不会明文传输。
7、「字符串」类型的参数如果设置为「选填」，当参数绑定的控件中不填写参数时，参数变量的值为**空字符串**；
  同理，如果是「数字型」的参数，参数变量的值为**空值**。
  同理，如果是「下拉框」的参数，参数变量的值为**空值**。
  同理，如果是「加密串」的参数，参数变量的值为**空值**。
  ```Rust```策略中，没有填写的选填参数为该类型的零值：数字为```0```，字符串、加密串为空字符串，布尔为```false```。
8、对于下拉框类型的界面参数，例如变量名为```pCombox```。在「组件配置」中没有开启「支持多选」时，pCombox的值为当前选中的选项索引或具体数据（给选项绑定数据时）。
  如果开启了「支持多选」时，pCombox的值为一个数组，数组包含所有当前选中的选项的索引或具体数据（给选项绑定数据时）。

#### 组件配置

策略界面参数和策略交互控件都有「组件配置」选项，用于设置参数（或交互控件）对应的界面控件，以及最小值、最大值、分组、过滤器等。

各种类型支持的组件：
- 数字型(number)
  输入框控件（默认）、时间选择器控件、滑动输入条控件。
- 布尔型(true/false)
  仅支持开关控件（默认）。
- 字符串(string)
  输入框控件（默认）、文本框控件、时间选择器控件、颜色选择器控件、币种、交易代码。
- 下拉框(selected)
  下拉框控件（默认）、分段控制器控件、币种、交易代码。
- 加密串(string)，仅策略参数
  仅支持加密输入框控件（默认）。
- 按钮(button)，仅交互控件
  只有一个按钮控件（默认），没有输入项。

**分组**

在组件配置的「分组」输入框中输入一个标签名，可以把若干个策略参数划分到同一个分组中（代替平台旧功能「策略分组」）。交互控件同样可以分组（代替旧功能「交互控件分组」）。

**过滤器**

策略参数的组件配置中，「过滤器」输入框可以填写判定表达式，控制参数是否可用（代替平台旧功能「参数依赖」）。
过滤器默认为空，不做任何过滤；可以设置：```a > b```、```a == 1```、```a```、```!a```、```a >= 1 && a <= 10```等。过滤条件为真时，当前参数可用。
- 设置过滤器```a == 1```：该参数是否可用取决于参数```a```的值，```a```等于1时可用，否则不可用。
- 设置过滤器```a >= 1 && a <= 10```：```a```大于等于1并且小于等于10时可用，否则不可用。
- 设置过滤器```!a```：过滤条件为「非a」；```a```可以是布尔值，也可以是数值（```!0```为真）。

#### 保存参数设置

- 回测系统中的参数保存
  在回测时如果希望将策略参数保存，可以在策略参数修改后点击「保存回测设置」按钮，参考 `回测配置与保存`。

  | 变量 | 描述 | 类型 | 默认值 |
  | - | - | - | - |
  |number |数值类型 |数字型(number) |1 |
  |string |字符串 |字符串(string) |Hello FMZ |
  |combox |下拉框 |下拉框(selected) |1\|2\|3|
  |bool |布尔值 |布尔型(true/false) |true |
  |numberA@isShowA |数值A |数字型(number) |2 |
  |isShowA |是否显示numberA参数 |布尔型(true/false) |false |

  设置后的策略参数以代码形式保存在策略中，例如：

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

  ```Rust```策略如果在开头用 frontmatter 声明了依赖，回测配置块要放在 frontmatter 之后，见 `Rust`。
- 实盘参数导入导出
  运行实盘时需要保存实盘配置的参数数据，可以点击策略实盘页面中「参数设置」选项，再点击「导出参数」按钮，导出的策略参数将以```json```文件保存。
  导出的策略参数配置也可以再次导入实盘，点击「导入参数」按钮即可把保存的策略实盘参数导入到当前实盘，导入后点击「更新参数」按钮保存生效。

### 交互控件

```JavaScript```、```Python```、```Rust```、My语言策略可以设计交互控件，策略的交互控件用来在策略实盘运行时给运行的策略程序发送交互指令。对于```JavaScript```、```Python```、```Rust```语言类型的策略，在策略代码中使用 `GetCommand` 函数获取交互控件产生的消息。交互控件的「组件配置」与策略参数相同，见 `组件配置`。

![交互控件](https://www.fmz.com/upload/asset/2e4320d0cc33c15eb935d.png)

在策略中设计好处理交互控件消息的代码，在实盘时使用交互控件可以实现（不限于）诸如以下功能：
- 手动平掉策略持仓。
- 动态修改策略参数，避免重启策略实盘。
- 切换策略逻辑。
- 触发打印某些调试信息、数据，用来测试某些功能。

#### 交互控件种类

| 变量(命名举例) | 描述 | 类型 | 默认值(说明) | 组件配置(说明) | 备注 |
| - | - | - | - | - | - |
| cmdNum | 交互控件cmdNum的描述 | 数字型(number) | 默认值选填，可留空 | 用于设置当前交互项绑定的界面控件的：组件类型、最小值、最大值、分组等 | 交互控件cmdNum的备注 |
| cmdBool | 交互控件cmdBool的描述 | 布尔型(true/false) | 默认值必选，开启或关闭 | 同上 | 交互控件cmdBool的备注 |
| cmdStr | 交互控件cmdStr的描述 | 字符串(string) | 默认值选填，可留空 | 同上 | 交互控件cmdStr的备注 |
| cmdCombox | 交互控件cmdCombox的描述 | 下拉框(selected) | 默认值选填，可留空 | 同上 | 交互控件cmdCombox的备注 |
| cmdBtn | 交互控件cmdBtn的描述 | 按钮(button) | 按钮控件不绑定输入项 | 同上 | 交互控件cmdBtn的备注 |

交互控件触发后发送给策略的消息（字符串）：
- 数字型
  在交互控件```cmdNum```的输入框中输入交互数据：```123```后，点击交互控件cmdNum的按钮。策略程序中的```GetCommand()```函数会收到消息：```cmdNum:123```。
- 布尔型
  在交互控件```cmdBool```的开关控件上设置为打开，点击交互控件cmdBool的按钮。策略程序中的```GetCommand()```函数会收到消息：```cmdBool:true```。
- 字符串
  在交互控件```cmdStr```的输入框中输入交互数据：```abc```后，点击交互控件cmdStr的按钮。策略程序中的```GetCommand()```函数会收到消息：```cmdStr:abc```。
- 下拉框
  在交互控件```cmdCombox```的下拉框中选中第二个选项后，点击交互控件cmdCombox的按钮。策略程序中的```GetCommand()```函数会收到消息：```cmdCombox:1```，1表示选中的选项的索引，第一个选项索引为0，第二个选项索引为1。
- 按钮
  点击交互控件```cmdBtn```的按钮。策略程序中的```GetCommand()```函数会收到消息：```cmdBtn```。

交互控件的「组件配置」与策略参数相同，见 `组件配置`。

**示例：用交互控件动态修改策略参数**

在策略编辑页面的「策略交互」中添加一个字符串类型的交互控件，变量名为```changeSymbol```。交互控件的设置界面：

![设置交互控件](https://www.fmz.com/upload/asset/1741a2b35e569c5e07e3.png)

实盘运行时，在该控件的输入框中填入```ETH_USDT```并点击按钮，```GetCommand()```会收到消息```changeSymbol:ETH_USDT```。策略检测到这条消息后更新对应的变量（策略界面上的参数也是全局变量，这里用代码中的全局变量演示）：

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

#### 状态栏中的交互控件

除了在「策略交互」栏中设计交互控件，还可以在策略状态栏中设计交互控件。目前支持的交互控件种类仅有按钮类型，见 `LogStatus`。

状态栏中的按钮控件可以分为：
- 普通按钮控件
  数据结构举例为：
  ```json
  {"type": "button", "name": "Button 1", "cmd": "button1", "description": "This is the first button"}
  ```
- 带一个输入数据的按钮控件
  使用```input```属性设置输入控件选项，数据结构举例为：
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
- 带一组输入数据的按钮控件
  使用```group```属性设置一组输入控件的选项，数据结构举例为：
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
      }]
  }
  ```

将这些按钮控件JSON数据编码为JSON字符串，然后使用``` ` ```字符包裹住，在状态栏输出。以JavaScript语言为例：

```js
function main() {
    var btn = {"type": "button", "name": "Button 1", "cmd": "button1", "description": "This is the first button"}
    LogStatus("`" + JSON.stringify(btn) + "`")
}
```

这些按钮控件也可以写入状态栏表格中，详细例子见 `LogStatus`。

```input```字段结构与```group```字段中单个控件结构一致，以下为详细说明（带注释的 JavaScript 对象）：

```js
{
    "type": "selected",     // 控件类型（必要字段），支持设置为：number, string, selected, boolean
    "name": "test",         // 名称（group中使用时，为必要字段）
    "label": "topic",       // 标题（必要字段）
    "description": "desc",  // 组件的提示
    "default": 1,           // 默认值；当前JSON结构中如果不设置settings字段，兼容defValue，可以用defValue代替default
    "filter": "a>1",        // 选择器，不设置该字段表示不过滤（显示控件）；设置该字段时，当表达式为真时不过滤（显示控件）。当表达式为假时过滤（不显示控件）
                            // 对于选择器，以当前例子中表达式a>1为例，a指的是type=button的结构中group字段下name为a的控件值，根据此数值判断是否过滤
    "group": "group1",      // 分组
    "settings": {}          // 组件配置，各字段见下文
}
```

组件配置```settings```各个字段详细说明：
- ```settings.required```：是否必选。
- ```settings.disabled```：是否禁用。
- ```settings.min```：```type=number```时有效，表示最小值。
- ```settings.max```：```type=number```时有效，表示最大值。
- ```settings.step```：```type=number```，```render=slider```时有效，表示步长。
- ```settings.multiple```：```type=selected```时有效，表示支持多选。
- ```settings.customizable```：```type=selected```时有效，表示支持自定义；用户可以直接在下拉框控件中编辑添加新选项，如果选中新编辑的选项，在触发交互时使用该选项的名称而不是选项代表的值。
- ```settings.options```：```type=selected```时有效，表示选择器的选项数据格式：```["Option 1", "Option 2"]```、```[{'name':'xxx','value':0}, {'name':'xxx','value':1}]```。
- ```settings.render```：渲染组件类型。
  ```type=number```时，```settings.render```不设置(默认数字输入框)，可选：```slider```(滑动条)、```date```(时间选择器返回时间戳)。
  ```type=string```时，```settings.render```不设置(默认单行输入框)，可选：```textarea```(多行输入)、```date```(时间选择器返回yyyy-MM-dd hh:mm:ss)、```color```(颜色选择器返回#FF00FF)。
  ```type=selected```时，```settings.render```不设置(默认下拉框)，可选：```segment```(分段选择器)。
  ```type=boolean```时，目前只有默认复选框。

支持双语设置，例如：```'选项|options'```文本内容会根据当前语言环境适配；以```group```字段中单个控件为例，完整的例子（JavaScript 对象）：

```js
{
    type:'selected',
    name:'test',
    label:'选项|options',
    description:'描述|description',
    default:0,                            // 这里default默认值设置0，表示{name:'xxx|yyy',value:0}选项中的value值
    filter:'a>1&&a<10',
    group:'分组|group',
    settings:{
        multiple:true,
        customizable:true,
        options:[{name:'xxx|yyy',value:0}]
    }
}
```

### 模板类库

**模板类库**是发明者量化交易平台中可复用的代码模块，是策略代码的一种类别。支持模板类库的语言有：```JavaScript```（含 TypeScript）、```Python```、```Rust```；```Blockly可视化```策略可以使用 JavaScript 模板类库提供的积木。创建策略时如果类别设置为模板类库，会在当前登录账号的策略库中创建一个模板类库，创建后不能再修改类别为普通策略。

![创建模板类库页面](https://www.fmz.com/upload/asset/2e4c55da99fd457ca94a0.png)

各语言中导出、调用模板函数的方式：

| 语言 | 模板中导出 | 策略中调用 |
| - | - | - |
| JavaScript | 挂到```$```上：```$.Test = function() {...}``` | ```$.Test()``` |
| Python | 挂到```ext```上：```ext.Test = Test``` | ```ext.Test()``` |
| Rust | 模板代码并入```ext```模块，供策略调用的函数声明为```pub fn``` | ```ext::Test()``` |

- 模板中的```main()```函数在策略中不会执行，只作为单独回测、调试模板时的入口。
- ```JavaScript```模板可以定义```init()```和```destroy()```：```init()```在模板加载时执行（早于策略的```init()```），```destroy()```在策略退出时、```onexit()```或```onerror()```之后执行。```Python```模板可以定义```init()```，在模板加载时执行。
- ```Rust```模板和策略都可以用 frontmatter 声明第三方 crate，但依赖块只能写在其中一处，两处都写会编译失败。

#### 模板类库的导出函数

导出函数为模板类库的接口函数，可以被引用该模板类库的策略调用。

不同的编程语言的模板类库书写格式有所不同，导出函数在模板类库中声明以及实现的例子代码如下：

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
// 策略引用该模板以后直接用 ext::Test() 调用此函数
// 供策略调用的函数必须声明为 pub
pub fn Test() {
    Log!("template call");
}
```

```Blockly可视化```方式编写的策略使用类库功能可以藉由```JavaScript```语言的模板类库编写实现，使用以下书写格式编写。

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

#### 模板类库的参数

模板类库也可以设置自己的界面参数，模板类库的参数在模板类库代码中是以全局变量的形式使用的（Rust 中为全局常量）。
例如我们设置了一个模板类库的参数：

![模板参数](https://www.fmz.com/upload/asset/2e4ab550b85e6a1cac08e.png)

| 策略代码中参数的变量名 | 策略界面上显示的参数名称 | 类型 | 默认值 |
| - | - | - | - |
| param1 | 模板参数1 | 数字型(number) | 99 |

```Rust```模板的参数是常量，只能读取，不能修改，所以下面的例子在 Rust 中只能实现读取参数：

```rust
// 模板代码
pub fn GetParam1() -> f64 {
    Log!("param1:", param1);
    param1
}
```

```rust
// 策略代码
fn main() {
    Log!("Calling ext::GetParam1:", ext::GetParam1());
}
```

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

```rust
// Rust 模板参数是只读常量，不能修改，读取参数的写法见上文
```

引用以上模板类库例子的策略代码，使用模板类库的导出函数获取参数```param1```和修改参数```param1```。

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
// Rust 模板参数是只读常量，不能修改，读取参数的写法见上文
```

#### 引用模板类库

策略引用模板类库时，需要当前登录的发明者量化交易平台账号的策略库中存在可用的模板类库。在[策略编辑页面](https://www.fmz.com/m/add-strategy)的模板栏中勾选需要引用的模板，保存策略后即可完成引用。

![模板引用截图](https://www.fmz.com/upload/asset/2e4ee2ec7b3e7b1649af8.png)

### 内置库

发明者量化交易平台内置了一些常用库。各语言可用情况：

| 库 | JavaScript / TypeScript | Python | Rust |
| - | - | - | - |
| ```TA```指标库 | 支持 | 支持 | 支持 |
| ```talib```指标库 | 支持 | 需在托管者所在机器安装 TA-Lib 和 numpy | 不支持 |
| JSON | 语言内置```JSON``` | 标准库```json``` | ```JSONParse()```/```JsonValue``` |

完整的函数列表与参数见手册 `TA`、`Talib`。

**TA指标库**

平台的```TA```指标库优化了常用指标算法（[开源TA库代码](https://www.fmz.com/bbs-topic/409)）。K 线数量不足以计算指标时，对应位置返回无效值。

```js
function main(){
    var records = exchange.GetRecords()
    var macd = TA.MACD(records)
    var atr = TA.ATR(records, 14)

    // 打印最后一组指标值
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

**talib指标库**

```js
function main() {
    var records = exchange.GetRecords()
    var cci = talib.CCI(records, 14)
    Log(cci)
}
```

```python
# Python 需要在托管者所在机器安装 TA-Lib 与 numpy，未安装时调用 talib 会报错提示安装
def main():
    records = exchange.GetRecords()
    cci = talib.CCI(records.High, records.Low, records.Close, 14)
    Log(cci)
```

**JavaScript：动态加载第三方库**

其它第三方 JavaScript 库可以在运行时下载后用```eval```加载：

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

### 多语言支持

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

## 开发工具

编写和调试策略的工具：策略编辑器、调试工具、在本地编辑器里远程编辑。

### 策略编辑器

在[新建策略页面](https://www.fmz.com/m/add-strategy)或者从[策略库](https://www.fmz.com/m/strategies)打开一个现有策略，进入**编辑页面**（例如策略ID为123456的地址为```https://www.fmz.com/m/edit-strategy/123456```）编写策略。

![线上策略编辑器界面](https://www.fmz.com/upload/asset/2e50fff4160187be92248.png)

本章介绍编辑器的辅助功能。与编辑页面相关的其它功能：
- `远程编辑`：用本地编辑器编写，自动同步到平台。
- `回测配置与保存`：把回测配置和策略参数随策略保存。
- `完整策略的导入与导出`：导出、导入包含参数等全部信息的完整策略。

#### AI助手

策略编辑器内置AI助手，可以根据描述生成策略代码，解释、修改选中的代码，调整策略参数和交互控件，并自动回测、分析回测结果。

- AI助手面板
  代码编辑区右侧是AI助手面板，可以收起和展开。在输入框中描述需求即可对话；先在编辑器中选中代码，选中的代码会作为对话的上下文。
  AI给出的代码、参数和交互控件修改以差异形式显示，可以逐处「接受」或「拒绝」，也可以全部接受；修改策略或自动回测前会先询问是否允许。
- 选中代码的快捷操作
  选中代码后点击鼠标右键，菜单中有AI操作（例如解释这段代码、优化代码），也可以用```⌘1```、```⌘2```……（Windows为```Ctrl+1```、```Ctrl+2```……）触发。

  ![策略编辑器中的AI助手解释代码](https://www.fmz.com/upload/asset/16aa01684eda4e8163ed.png)
- 智能补全
  在右键菜单中选择开启或关闭智能补全，快捷键为```⌘J```（Windows为```Ctrl+J```）。

AI助手按使用量从账户余额扣费，对话中会显示本次费用。

除了编辑器内的AI助手，也可以把自己使用的外部AI助手接入平台，通过对话管理策略、回测和实盘，见`AI接入`。

#### 命令面板

在策略代码编辑区域点击鼠标右键，选择弹出菜单中的「命令面板」选项，可查看各种功能的快捷键组合和编辑器命令。

![策略编辑器中菜单的命令面板显示](https://www.fmz.com/upload/asset/2e429269f02185dfbab3b.png)

#### 语法手册速查

在**策略编辑页面**的「代码」编辑区内，可以快速查询「语法手册」。根据操作系统不同，使用相应的快捷键：

![策略编辑器中语法手册速查](https://www.fmz.com/upload/asset/2e4d0722af99164f69996.png)

- Mac系统（苹果电脑）的浏览器中：按住```⌘```键不放。
- Windows系统的浏览器中：按住```Ctrl```键不放。

然后将鼠标移动到需要查询的**变量名**或**函数名**上时，会出现跳转链接。点击该链接即可弹出「语法手册」，并自动定位到查询的内容。

#### 定义与引用跳转

选中需要查询的内容，点击鼠标右键弹出菜单。
- 转到定义：跳转至所查询内容的定义位置。
- 转到引用：跳转至所查询内容的引用位置。
- 快速查看-速览定义：在不离开当前代码行的情况下查看所选代码的定义。
- 快速查看-查看引用：在不离开当前代码行的情况下查看其他代码行中对当前代码的引用情况，支持快速跳转，便于更好地理解代码逻辑和结构。

#### 策略文档

线上策略编辑页面把策略代码、策略描述、使用说明、开发记录等信息分开记录。

![策略文档选项说明](https://www.fmz.com/upload/asset/2e47983c191c1779bd52e.png)

- 代码：策略程序的源码。
  平台上一个完整的策略包含：策略源码、`策略参数`设计、`交互控件`设计、`模板类库`引用。
- 笔记：记录策略开发过程中的内容。
- 描述：策略公开展示时显示的介绍。
- 手册：只有租用策略后才能看到的说明。

#### 历史版本管理

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

### 调试工具

[调试工具](https://www.fmz.com/m/debug)页面提供了一个用于快速测试实盘代码的免费环境，目前仅支持```JavaScript```语言。

![调试工具](https://www.fmz.com/upload/asset/2e48d6d1bc77e46099058.png)

使用调试工具测试代码时，代码将直接在指定的托管者上运行，最长运行时间为3分钟。支持调用发明者量化交易平台的所有API函数，但仅支持单个交易所对象。

### 远程编辑

可以用本地编辑器编写策略，保存时自动同步到发明者量化交易平台。支持```VSCode```、```Vim```、```Sublime Text 3```，```JavaScript```策略还可以用```WebStorm```，```Python```策略还可以用```PyCharm```。Blockly可视化策略不支持远程编辑。

![远程编辑截图](https://www.fmz.com/upload/asset/2e4e8975d1e32517fd989.png)

**使用步骤**
1. 在策略编辑页面点击「远程编辑」。弹出的窗口上方是各编辑器插件的下载链接，点击跳转到对应的插件页面安装，不同编辑器的安装方式略有差别。
2. 窗口中显示当前策略的远程同步密钥（token）。密钥为空时，点击「更新密钥」生成。
3. 把策略源码保存到本地，在源码第一行插入窗口中给出的密钥行（例如```JavaScript```为```// fmz@<密钥>```，```Python```为```# fmz@<密钥>```），之后每次保存都会自动同步到平台。

也可以不装插件，用```curl```直接上传本地源码（窗口中有带密钥的完整命令），例如：

```bash
curl -T quant.js -H "Authorization: Bearer <密钥>" https://www.fmz.com/rsync
```

**管理密钥**
- 「更新密钥」：生成新密钥，原密钥随即失效。
- 「删除密钥」：删除当前策略的密钥，关闭远程编辑。

拿到密钥的人可以改写这个策略的源码，不要把密钥公开。

## 回测系统

用历史数据检验策略：回测系统用历史行情驱动策略代码，模拟撮合与账户，给出收益、回撤等结果。回测只反映策略在历史行情下的表现，不代表未来收益。

### 概述与发起回测

回测用平台的历史行情驱动策略代码：回测引擎维护一个虚拟时钟，为每个交易所对象维护一个模拟账户，策略调用的行情、下单、账户等函数都由引擎按历史数据应答。回测结果只反映策略在历史行情下的表现，历史行情不能代表未来，对回测结果要理性、客观地看待。

**发起回测**

- 网页：打开策略编辑页面，切换到「模拟回测」分页，设置回测配置和策略参数后点击「开始回测」（快捷键见`回测页面快捷键`）。回测配置可以保存进策略源码，见`回测配置与保存`。
- AI助手：通过MCP工具```run_backtest```发起回测、```get_backtest```读取结果，见`AI接入`。MCP发起的回测只使用模拟级Tick模式。
- 本机：使用开源的本地回测引擎，见`本地回测引擎`。

**回测配置项**

| 配置项 | 说明 |
| - | - |
| 时间范围 | 回测的开始时间和结束时间。 |
| K线周期 | 策略调用```GetRecords()```默认得到的K线周期。 |
| 底层K线周期 | 模拟级Tick模式下用来生成tick的K线周期。越小越接近真实行情，回测也越慢；策略K线由底层K线合成，不能小于底层K线周期。 |
| 模式 | 模拟级Tick或实盘级Tick，见`回测模式与撮合`。 |
| 交易所、交易对 | 每个交易所对象有各自的模拟账户；交易对写成```BTC_USDT```的形式。期货交易所需要在策略中先调用```exchange.SetContractType()```设置合约，才能获取行情、下单。 |
| 初始资金 | 计价币（如USDT）和交易币（如BTC）的初始余额。币本位合约以交易币作保证金，需要设置交易币余额。 |
| 手续费 | 挂单（maker）和吃单（taker）费率，单位为百分比，默认取该交易所市场的配置。限价单下单时立即成交按吃单费率计算，挂在盘口上之后才成交按挂单费率计算。 |
| 滑点 | 单位为价格最小变动单位（一跳）的个数，加在模拟盘口买一价、卖一价的外侧，默认为0。 |
| 网络延迟 | 单位为毫秒，策略每调用一次交易所接口，虚拟时钟前进相应时间，默认为200。 |
| 深度档位、每档数量 | ```GetDepth()```返回的档位数（1～20）和模拟盘口每档的数量；实盘级Tick模式下深度档位是向数据源请求的真实深度档数。 |
| K线最大条数 | 第一次调用```GetRecords()```时返回的历史K线条数上限（100～5000，默认300）。 |
| 日志条数 | 回测保留的运行日志、收益日志、图表数据的条数上限。 |
| 数据源 | 默认使用平台的历史数据，也可以使用自定义数据源，见`自定义数据源`。 |

**容错测试**

回测页面另外提供「容错测试」：按一定概率（默认0.5）让交易所接口调用失败，并且每种接口的第一次调用一定失败，失败时记录错误日志```FaultTolerant Test```。用于检验策略对接口失败的处理，例如是否用```_C()```重试。

**回测中的策略**

- ```IsVirtual()```返回```true```，不应在回测中执行的逻辑可以据此跳过，见`IsVirtual`。
- 时间是虚拟时间：```Unix()```、```_D()```等读取的是回测时钟，```Sleep()```推动时钟前进。时钟越过结束时间时，引擎抛出```EOF```异常结束回测，此时不会调用```onexit()```。
- 回测中```GetCommand()```收不到交互命令，不支持```onerror()```，网络请求类功能受限。

### 回测模式与撮合

回测分为**模拟级Tick**和**实盘级Tick**两种模式。两者都基于真实的历史数据：模拟级Tick由K线生成tick，实盘级Tick回放真实记录的tick，后者更精确，也更慢。

**模拟级Tick**

回测引擎在每根底层K线的开盘价、最高价、最低价、收盘价构成的价格框架内，沿 开盘→最低/最高→收盘 的路径生成2～14个模拟tick，K线的成交量分摊到这些tick上；策略调用行情接口时得到的是当前模拟tick的数据。因此每根底层K线上有多个回测时间点，策略可以在一根K线内多次交易，而不是只能按收盘价成交。底层K线周期越小，生成的tick越接近真实走势，回测也越慢。机制详见[回测系统模拟级别机制说明](https://www.fmz.com/bbs-topic/662)、[回测系统机制说明](https://www.fmz.com/digest-topic/4009)。

模拟盘口：卖一价 = 当前tick收盘价 + 一跳 + 滑点，买一价 = 收盘价 − 一跳 − 滑点（滑点以跳数计）；```GetDepth()```返回按此间隔排列的若干档模拟深度，每档数量为配置中的「每档数量」。

**实盘级Tick**

使用平台真实记录的逐秒tick数据，包含盘口深度（档位可设置，最多20档），可以选择回放逐笔成交数据；```GetDepth()```、```GetTrades()```返回回放的真实数据。由于数据量大、回测速度慢，单次回测的数据上限为50MB，可回测的时间范围因此受限；需要更长的时间范围时，可以降低深度档位、不使用逐笔成交数据。较早的时间段可能没有实盘级数据，时间范围不宜选得过早。

在某个行情时刻，```GetTicker()```、```GetDepth()```、```GetTrades()```、```GetRecords()```各调用一次不会推动回测时间；再次调用其中同一个函数时，回测时间跳到下一个行情时刻。实盘级Tick模式下，策略循环中的```Sleep()```宜设得短一些（例如100毫秒）。

**撮合规则**

两种模式使用相同的撮合规则：

- 按价格触及成交，并且一次全部成交，回测中不会出现部分成交。
- 市价单在当前tick按卖一价/买一价成交；现货市价买单的数量是计价币金额。
- 限价买单价格大于等于卖一价、限价卖单价格小于等于买一价时成交，挂单后的每个tick都会检查。下单时立即成交的，按市场价成交并收取吃单（taker）手续费；挂在盘口之后被价格触及而成交的，按委托价成交并收取挂单（maker）手续费。
- 实盘级Tick模式下，挂在买一/卖一价位上的订单，要等排在它前面的挂单量被消耗后才成交。
- 期货按 名义价值 ÷ 杠杆 冻结保证金；行情数据中包含资金费率时，永续合约按资金费率结算资金费。

**数据粒度的影响**

同一个策略在不同的数据粒度下（实盘级Tick、底层K线周期较小的模拟级Tick、底层K线周期较大的模拟级Tick等）回测，交易次数和盈亏都会不同。数据粒度大时回测快，但结果可能失真，回测时应尽量使用较小的数据粒度。可以用下面的策略在几种粒度下分别回测对比：

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
        // Tick 模式中尽量短，K线模式中没有影响
        Sleep(100)
    }
}
```

### 回测配置与保存

「模拟回测」分页中的回测配置（时间范围、交易所、手续费等）和策略参数可以随策略保存，再次打开策略时自动载入。

**保存**

- 点击「保存回测设置」：把回测配置和策略参数以注释（```backtest```注释块）的形式写在策略源码开头。
- 点击「保存策略」：平台同时记录当前的回测配置和策略参数。

**载入**

- 打开或刷新策略编辑页面时，优先载入源码中```backtest```注释块记录的配置。
- 源码中没有```backtest```注释块时，载入最后一次「保存策略」时记录的配置。
- 在源码中手动修改了```backtest```注释块后，点击注释块上方的「回测设置」按钮，把修改同步到回测页面的选项中。

**注释块格式**

在该语言的块注释起始符后紧接着写```backtest```，之后每行一个```键: 值```：

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

各语言的注释写法：JavaScript、TypeScript、Rust、PINE语言使用```/*backtest ... */```；Python使用```'''backtest ... '''```；My语言使用```(*backtest ... *)```。

| 键 | 格式 | 说明 |
| - | - | - |
| start、end | ```YYYY-MM-DD HH:mm:ss``` | 开始、结束时间，按浏览器所在时区解析。 |
| period | ```1m```、```1h```、```1d```等，或秒数 | 策略K线周期。 |
| basePeriod | 同上 | 底层K线周期，不写时与```period```相同；实盘级Tick模式下忽略。 |
| mode | ```1``` | 实盘级Tick模式；不写为模拟级Tick模式。 |
| exchanges | JSON数组 | 每个元素对应一个交易所对象，字段见下表。 |
| args | JSON数组 | 策略参数，```[["参数名", 值], ...]```；第三个元素为模板Id时设置该模板的参数：```["参数名", 值, 模板Id]```。 |

```exchanges```元素的字段，除```eid```、```currency```外都可以省略：

| 字段 | 说明 |
| - | - |
| eid | 交易所Id，例如```Binance```、```Futures_OKX```。 |
| currency | 交易对，例如```BTC_USDT```。 |
| balance、stocks | 计价币、交易币的初始余额。 |
| fee | ```[挂单费率, 吃单费率]```，单位为百分比。 |
| feeMin | 每笔成交的最低手续费，只对部分市场生效。 |
| depthDeep、depthAmount | 深度档位、模拟盘口每档的数量。 |
| tradesMode | 实盘级Tick模式下是否回放逐笔成交：```"0"```回放，```"1"```不回放。 |
| feeder | 自定义数据源地址，见`自定义数据源`。 |

「保存回测设置」还会写入一些以```bt```开头的键（例如```btSlipPoint```滑点、```btNetDelay```网络延迟、```btFaultTolerant```容错概率、```btMaxBarLen```K线最大条数），记录回测页面上其他选项的取值，不建议手工修改。本地回测引擎也读取同样的注释块，见`本地回测引擎`。

### 支持范围

**编程语言**

回测系统支持以下语言编写的策略：JavaScript、TypeScript、Python、Rust、[PINE语言](https://www.fmz.com/bbs-topic/9315)、[My语言](https://www.fmz.com/bbs-topic/2569)、Blockly可视化、Workflow工作流。

- JavaScript策略（TypeScript先编译为JavaScript）在浏览器中回测，回测引擎以WebAssembly形式运行，不需要安装任何软件。JavaScript策略回测时可以在Chrome浏览器的DevTools中调试，见[参考说明](https://www.fmz.com/digest-topic/9459)。
- Rust策略由平台服务器编译，编译结果在浏览器中回测；策略中通过frontmatter声明的第三方crate在编译时自动获取，本地不需要安装工具链。
- Python策略在托管者上回测，可以使用平台的公共服务器，也可以使用自己的托管者。回测与实盘都依赖托管者所在系统的Python 3环境，需要的第三方库要自行安装；公共服务器只提供常用的库。
- Workflow工作流策略回测时可以可视化查看各节点的执行状态和数据流转。

**交易所**

回测数据来自平台的历史数据，可以回测的交易所以回测页面中可选的为准（也可以通过MCP工具```list_exchanges```查看，```backtest```为```true```的交易所有历史数据）。

- 加密货币：主流交易所的现货和期货，例如Binance与Futures_Binance、OKX与Futures_OKX、HTX与Futures_HTX、Bybit与Futures_Bybit、Bitget与Futures_Bitget、GateIO与Futures_GateIO，支持交易所的全部品种。
- 富途证券（```Futures_Futu```）：港股、美股等市场。回测只支持日线级别数据，```currency```设置为```STOCK```，在策略中用```exchange.SetContractType()```设置股票代码：

```js
/*backtest
start: 2024-05-01 00:00:00
end: 2025-02-17 00:00:00
period: 1d
basePeriod: 1d
exchanges: [{"eid":"Futures_Futu","currency":"STOCK","fee":[0.03,0.03]}]
*/

function main() {
    var info = exchange.SetContractType("TSLA.US")   // 设置股票代码：特斯拉
    Log("info:", info)                               // 合约信息：InstrumentID、PriceTick、LotTick、VolumeMultiple等
    Log(exchange.GetTicker())                        // 回测时间点的日线行情
}
```

### 参数调优

参数调优在回测时按设置的范围生成多组参数，逐组回测。在「模拟回测」分页的策略参数部分，勾选参数右侧的**调优**选项后出现调优设置：

- 最小值：参数的起始值。
- 最大值：参数递增后的最大值。
- 步长：每次递增的量。
- 并发线程：参数调优时同时执行的回测数。该选项只支持JavaScript、PINE、My语言策略的参数调优，不支持模板上的参数调优。

回测系统按```最小值```、```最大值```、```步长```生成参数组合，对每种组合各回测一次。只有**数字型（number）**的策略参数可以设置调优。

### 结果解读

回测结束后，回测页面显示收益曲线、统计指标、状态信息、日志信息和账户信息。

**收益曲线**

收益曲线由策略调用```LogProfit()```记录的收益值组成（`LogProfit`）。策略不调用```LogProfit()```时没有收益曲线，下面依赖收益序列的统计指标也无法计算，只能从账户信息中查看回测结束时的资产。MCP工具```get_backtest```返回的```profit```、```max_drawdown```同样来自```LogProfit()```。

**统计指标**

统计指标由收益序列```profits```（每个元素为```[时间戳, 收益]```）和初始资产```totalAssets```按下面的算法计算：

| 指标 | 含义 |
| - | - |
| 收益率（totalReturns） | 最后一个收益值 ÷ 初始资产。 |
| 年化收益（annualizedReturns） | 收益率 × 一年的时长（yearDays天）÷ 回测时长，按比例线性折算。 |
| 最大回撤（maxDrawdown） | 资产（初始资产 + 收益）相对此前最高点下跌的最大比例。maxDrawdownStartTime为该最高点的时间，maxDrawdownTime为回撤最深的时间。 |
| 胜率（winningRate） | 收益序列中高于前一个点的点所占的比例（第一个点与0比较）。统计的是收益记录，不是逐笔交易的胜率。 |
| 波动率（volatility） | 把回测时间按天切分，每天的收益额 ÷ 初始资产，再乘以yearDays折算为年化值（没有收益记录的日子按0计），取这些值的总体标准差。 |
| 夏普比率（sharpeRatio） | （年化收益 − 无风险利率3%）÷ 波动率；波动率为0时为0。 |

yearDays是年化时使用的一年天数，由回测页面传入。注意波动率是把每日收益率直接乘以yearDays年化，而不是常见的乘以√yearDays，因此这里的夏普比率不宜与其他平台的数值直接比较。

算法源码：

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

**数据下载**

- 状态栏数据下载：回测结束后，在「状态信息」栏右上角点击「下载表格」，下载回测结束时状态栏数据的CSV文件。
- 日志数据下载：在「日志信息」栏右上角点击「下载表格」，下载回测日志的CSV文件。

### 自定义数据源

发明者量化交易平台的回测系统支持自定义数据源，回测时由平台的数据服务器使用```GET```方法请求自定义的URL获取数据，因此该URL必须能从公网访问。请求附加的参数如下：

| 参数 | 意义 | 说明 |
| - | - | - |
| symbol | 品种名 | 现货行情数据例如：```BTC_USDT```，期货行情数据例如：```BTC_USDT.swap```，期货永续合约资金费率数据例如：```BTC_USDT.funding```，期货永续合约价格指数数据例如：```BTC_USDT.index``` |
| eid | 交易所 | 例如：OKX、Futures_OKX |
| round | 数据精度 | 固定为```round=true```：返回的价格、数量都写成按精度放大后的整数，精度由返回数据```detail```中的```quotePrecision```、```basePrecision```给出，见`数据格式`。 |
| period | K线数据的周期(毫秒) | 例如：```60000```为1分钟周期 |
| depth | 深度档数 | 1-20 |
| trades | 是否需要逐笔成交数据 | 是（1）/否（0） |
| from | 开始时间 | Unix时间戳，单位为秒 |
| to | 结束时间 | Unix时间戳，单位为秒 |
| detail | 请求数据的品种详细信息 | 为true，表示需要由自定义数据源提供。发明者量化交易平台回测系统向自定义数据源发送的请求固定为：```detail=true``` |
| custom | -- | 可以忽略该参数 |

现货交易所、期货交易所对象的数据源设置为自定义数据源（feeder）时回测系统向自定义数据源服务发送请求的例子：

```url
http://customserver:9090/data?custom=0&depth=20&detail=true&eid=Bitget&from=1351641600&period=86400000&round=true&symbol=BTC_USDT&to=1611244800&trades=1
http://customserver:9090/data?custom=0&depth=20&detail=true&eid=Futures_OKX&from=1351641600&period=86400000&round=true&symbol=BTC_USDT.swap&to=1611244800&trades=1
```

#### 数据格式

返回的格式必须为以下两种格式其中之一（系统自动识别）：
- 模拟级Tick，以下是JSON数据范例：
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
- 实盘级Tick，以下是JSON数据范例：
  Tick级回测的数据（包含盘口深度信息，深度格式为```[价格, 量]```的数组。可有多级深度，```asks```为价格升序，```bids```为价格倒序）。
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
| detail | 请求数据的品种详细信息，包含计价币名称、交易币名称，精度，最小下单量等 |
| schema | 指定data数组中列的属性，区分大小写。仅限于 time, open, high, low, close, vol, asks, bids, trades|
| data | 按照schema设置的列结构，记录的数据。|

**数值精度**

请求中固定带```round=true```，返回的数值都写成按精度放大后的整数，以免传输过程中丢失浮点数精度：

- 价格类数值（```open```、```high```、```low```、```close```，```asks```/```bids```和```trades```中的价格）= 实际值 × 10^```quotePrecision```。
- 数量类数值（```vol```，```asks```/```bids```和```trades```中的数量）= 实际值 × 10^```basePrecision```。

例如上面的范例中```quotePrecision```为2，```9531300```表示价格95313.00；```basePrecision```为5，```787```表示数量0.00787。时间列（```time```及```trades```中的时间）是毫秒时间戳，不放大。

**detail字段**

| 字段 | 说明 |
| - | - |
| eid            | 交易所Id，注意某个交易所现货与期货是不同的eid |
| symbol         | 交易品种代码 |
| alias          | 当前交易品种代码对应的交易所中的symbol |
| baseCurrency   | 交易币种 |
| quoteCurrency  | 计价币种 |
| marginCurrency | 保证金币种 |
| basePrecision  | 交易币种精度 |
| quotePrecision | 计价币种精度 |
| minQty         | 最小下单量 |
| maxQty         | 最大下单量 |
| minNotional    | 最小下单金额 |
| maxNotional    | 最大下单金额 |
| priceTick      | 价格一跳 |
| volumeTick     | 下单量最小变动数值（下单量一跳） |
| marginLevel    | 期货杠杆值 |
| contractType   | 对于永续合约设置为：```swap```，回测系统会继续发送资金费率、价格指数请求 |

特殊的列属性```asks```、```bids```、```trades```：

| 字段 | 说明 | 备注 |
| - | - | - |
| asks / bids | [[价格, 数量], ...]                      | 例如```实盘级Tick```数据范例中的数据：```[[9531300, 10]]``` |
| trades      | [[时间, 方向(0:买,1:卖), 价格, 数量], ...] | 例如```实盘级Tick```数据范例中的数据：```[[1564315200000, 0, 9531300, 10]]``` |

期货交易所的永续合约回测时，自定义数据源还需要额外的资金费率数据、价格指数数据。只有当请求的行情数据返回时，返回的结构中detail字段包含```"contractType": "swap"```键值对，回测系统才会继续发送对于资金费率的请求。
当回测系统收到资金费率数据时，才会继续发送对于价格指数数据的请求。

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
    ]
}
```

- 相邻的周期间隔8小时
- 资金费率数据为什么是 -16795？
  与K线数据一样按精度放大为整数：该数据的```quotePrecision```为8，-16795表示资金费率-0.00016795。资金费率可以为负值。

回测系统发出的资金费率数据请求，举例为：

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
        [1584922500000, 58975, 59428, 58581, 59154, 0]
    ]
}
```

回测系统发出的价格指数数据请求，举例为：
```url
http://customserver:9090/data?custom=0&depth=20&detail=true&eid=Futures_Binance&from=1351641600&period=86400000&round=true&symbol=BTC_USDT.index&to=1611244800&trades=0
```

#### 自定义数据源范例

把下面的服务程序部署在能从公网访问的服务器上，数据源地址即为```http://<服务器地址>:9090/data```（```<服务器地址>```替换为该服务器的公网IP或域名）。自定义数据源服务程序使用```Golang```编写：

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

测试策略，```JavaScript```范例：
```js
/*backtest
start: 2021-01-16 08:00:00
end: 2021-01-22 00:00:00
period: 1d
basePeriod: 1d
exchanges: [{"eid":"OKX","currency":"BTC_USDT","feeder":"http://<服务器地址>:9090/data"}]
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

平台开源了JavaScript和Python的本地回测引擎，与云端回测使用相同的引擎核心和历史数据（从平台的数据服务器下载），可以在自己的电脑上快速回测JavaScript、Python策略：

- [Python回测引擎](https://github.com/fmzquant/backtest_python)
- [JavaScript回测引擎](https://github.com/fmzquant/backtest_javascript)

**Python**

安装（需要Python 3和pip）：

```bash
pip install https://github.com/fmzquant/backtest_python/archive/master.zip
pip install pandas matplotlib   # 仅在使用 Join(True)、Show() 时需要
```

第一次使用时会从数据服务器下载对应系统的引擎文件，之后除了历史数据不再联网。策略文件就是普通的FMZ策略，加上开头的```backtest```配置注释（格式见`回测配置与保存`）和几行引擎调用代码：

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
task = VCtx(__doc__)  # 按上方注释中的配置初始化回测引擎，exchange、Log、TA 等成为全局对象

# 以下为待测试的策略代码，可以从平台直接复制
def main():
    Log(exchange.GetAccount())
    while True:
        r = exchange.GetRecords()
        LogStatus(_D(), r[-1]["Close"])
        Sleep(60 * 60 * 1000)

try:
    main()
except EOFError:      # 虚拟时钟到达结束时间时，引擎抛出 EOFError
    pass
result = json.loads(task.Join(False))   # 原始回测结果（JSON）
print(result["LogsCount"], result["Elapsed"] / 1e6)
# task.Show()                           # 或者显示收益图表（需要 matplotlib）
```

用```python strategy.py```运行。```task.Join(False)```返回原始回测结果的JSON，```task.Join(True)```返回收益数据的pandas表格，```task.Show()```画出收益曲线。

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
// 从这里开始 exchange、Log、TA 等成为全局对象，粘贴策略代码后调用 main()

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
    // 虚拟时钟到达结束时间时，引擎抛出 "EOF"
}
var result = JSON.parse(task.Join())    // 与 Python 引擎 Join(False) 的结果相同
console.log(result.LogsCount)
```

**与云端回测的区别**

- 只支持JavaScript和Python策略，不会自动加载模板：策略引用的模板代码需要粘贴到文件中，因此依赖交易类库的PINE、My语言策略不能在本地回测。
- 策略参数不会自动注入，需要在代码中定义为全局变量。
- 注释中的```start```、```end```按本机时区解析；网络延迟固定为200毫秒，不支持滑点和实盘级Tick模式。
- 收益、回撤和收益曲线同样只在策略调用```LogProfit()```时才有。

**AI回测**

在AI助手中可以直接让它回测：AI助手通过MCP工具```run_backtest```发起云端回测，用```get_backtest```读取收益、回撤、错误日志等结果，见`AI接入`。也可以让AI助手在本机安装本地回测引擎，快速修改、回测，再用云端回测确认一次。

### 回测页面快捷键

- 策略编辑页面和策略回测页面切换的快捷键
  使用```Ctrl + ,```键切换回测页面和策略编辑页面，按住```Ctrl```键后，单按```,```键。
- 策略保存的快捷键
  使用```Ctrl + s```键保存策略。
- 启动回测的快捷键
  使用```Ctrl + b```键启动回测。

## 进阶专题

进阶用法：JavaScript多线程、实盘之间通信、API限流、期权交易、Web3链上交易。

### JavaScript多线程

JavaScript策略可以用```threading```对象创建真正并行执行的线程，并用消息、共享字典、锁等对象在线程之间通信。本页说明怎么选用、怎么组织线程代码；各函数的参数和返回值见语法手册`Threads`。

## 先选对工具

| 需求 | 推荐 | 适用语言 |
| - | - | - |
| 同时发出几个API请求（如同时取多个交易所的行情），等结果回来 | `exchange.Go`，配合`EventLoop`等待完成事件 | 所有语言 |
| 长时间在后台运行的任务：独立的行情采集、风控巡检、耗时计算 | `threading.Thread` | 仅JavaScript |
| 在策略内提供HTTP、WebSocket或TCP服务 | `threading.Serve` | 仅JavaScript |

只是并发几个请求时，```exchange.Go()```更简单，也不需要处理线程间的数据传递。本页的```threading```对象只适用于JavaScript策略，Python、Rust策略请使用```exchange.Go()```。

回测系统中可以调用这些函数，但线程实际是按顺序执行的，只用于保证代码在回测中能运行。

## 线程运行在隔离的环境中

传给```threading.Thread()```的函数在一个独立的JavaScript环境中执行，这是写线程代码时最需要注意的一点：

- 线程函数**不能引用外部的变量和闭包**，也不能调用策略里自定义的其它函数。需要的数据通过```threading.Thread(func, arg1, arg2, ...)```的参数传入。
- 普通对象、数组作为参数时是**深拷贝**：线程里修改它不影响其它线程。需要多个线程看到同一份数据时，使用```threading.Dict()```创建的字典。
- 函数也可以作为参数传入；```threading.Thread()```还支持传入函数源码字符串，用于在线程中加载外部库。
- 线程里可以直接调用平台的API函数，如```exchange.GetTicker()```、```Log()```。
- 线程函数的返回值通过```join()```取回：```t.join().ret```。

## 线程之间怎样交换数据

| 方式 | 用法 | 说明 |
| - | - | - |
| 消息 | ```t.postMessage(msg)```发给线程```t```；线程内用```threading.currentThread().peekMessage(timeout)```读取自己收到的消息；子线程用```threading.mainThread().postMessage(msg)```发回主线程 | 每个线程有自己的收件箱，按顺序读取。```peekMessage(-1)```不阻塞，没有消息时返回空值 |
| 共享字典 | ```var d = threading.Dict()```，作为参数传入线程后各线程```d.get(key)```、```d.set(key, value)``` | 适合保存「最新状态」，例如最新行情、运行标志 |
| 线程数据 | ```t.setData(key, value)```、```t.getData(key)``` | 挂在某个线程对象上的键值，线程结束（```join()```、```terminate()```）后失效 |
| 同步对象 | ```threading.Lock()```、```threading.Event()```、```threading.Condition()``` | 作为参数传入线程，用于互斥访问和等待通知 |

线程收到消息时也会产生事件，可以用线程对象的`eventLoop`统一等待消息和其它事件。

## 线程的生命周期

- ```t.join()```等待线程结束并取回返回值，可以设置超时；```t.terminate()```强制结束线程。
- 线程结束且不再被引用时，资源会自动回收，不必为了释放资源调用```join()```。持续引用、无法回收的线程累计超过2000个时会报错。
- ```threading.pending()```返回正在运行的线程数（包括主线程）。
- 实盘停止时所有线程一起结束。```peekMessage()```、```join()```、锁和事件的等待都会被停止打断。

## 在策略内提供服务

```threading.Serve(地址, 处理函数, ...参数)```在策略进程内启动HTTP（含WebSocket）或TCP服务，每个请求或连接在独立的线程中调用处理函数，返回`Server`对象（```addr()```取实际监听地址，```close()```关闭）。处理函数与线程函数一样运行在隔离环境中，需要的数据通过参数传入，常用```threading.Dict()```与主线程共享状态。地址写法、```ctx```对象的方法见`Serve`。

旧的全局函数```__Serve()```仍可使用，它只返回监听地址字符串，新代码请使用```threading.Serve()```。

## 示例

### 多个线程并行计算，主线程汇总结果

每个线程拉取一个交易对的K线并计算均线，结果通过返回值交给主线程。注意交易对通过参数传入，线程函数里没有引用外部变量。

```javascript
function main() {
    var symbols = ["BTC_USDT", "ETH_USDT", "SOL_USDT"]
    var threads = []
    for (var i = 0; i < symbols.length; i++) {
        threads.push(threading.Thread(function(symbol, period) {
            // 在线程中运行：只能使用参数和平台API
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
            Log(r.symbol, "收盘价:", r.close, "MA20:", r.ma20)
        }
    }
}
```

### 后台线程采集行情，主线程读取与下发指令

后台线程把最新价写进共享字典，并把异常通过消息报告给主线程；主线程通过消息通知后台线程退出。

```javascript
function main() {
    var shared = threading.Dict()
    var worker = threading.Thread(function(dict, symbol) {
        while (true) {
            // 读取主线程发来的指令，-1 表示不阻塞
            var cmd = threading.currentThread().peekMessage(-1)
            if (cmd == "stop") {
                break
            }
            var ticker = exchange.GetTicker(symbol)
            if (ticker) {
                dict.set("last", ticker.Last)
                dict.set("time", ticker.Time)
            } else {
                threading.mainThread().postMessage("行情获取失败: " + GetLastError())
            }
            Sleep(1000)
        }
        return "worker exited"
    }, shared, "BTC_USDT")

    for (var i = 0; i < 10; i++) {
        // 最多等 1 秒后台线程的消息
        var msg = threading.currentThread().peekMessage(1000)
        if (msg) {
            Log("后台线程报告:", msg)
        }
        LogStatus("最新价:", shared.get("last"), "时间:", _D(shared.get("time")))
    }
    worker.postMessage("stop")
    Log(worker.join().ret)
}
```

### 用threading.Serve提供状态查询接口

主线程把状态写进共享字典，HTTP处理函数从参数取到同一个字典并返回JSON。

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
    Log("服务地址:", server.addr())

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

### 策略实盘间通信

每个实盘都有一个频道，频道ID就是实盘ID。实盘用```SetChannelData()```在自己的频道上发布数据，其它实盘用```GetChannelData(实盘ID)```读取。数据经平台服务端转发，可以跨托管者、跨服务器传递。

频道保存的是**最新状态**，不是消息队列：每次发布都覆盖上一次的数据，订阅端每次读到的都是当前最新的一份。需要历史记录时由订阅端自己保存。

常见用途：

- **主从协同**：主策略分析行情并发布信号，多个从策略读取信号在各自账户上执行。
- **状态监控**：各策略发布运行状态，监控实盘汇总展示或告警。
- **数据共享**：一个实盘计算指标、发布结果，其它实盘直接使用，避免重复计算。

## 使用要点

- **首次读取即订阅**：对某个频道第一次调用```GetChannelData()```时完成订阅并返回空值（```null```/```None```），之后服务端把该频道的更新推送到本实盘，再调用就能读到最新数据。订阅端应在启动时就开始读取，并处理空值。
- **订阅上限**：每个实盘最多订阅10个不同的频道（包括下面的UUID频道）。超出时该次调用返回空值，并记录一条错误日志```channel subscriber exceed limit```。
- **数据格式**：JavaScript、Python的```SetChannelData()```可以传入任何可以JSON序列化的数据，订阅端读到的是解析后的对象。数据不变时不会重复发送。数据大小限制见`SetChannelData`。
- **Rust**：```SetChannelData(string)```只接受字符串，需要自己拼好JSON文本；```GetChannelData()```没有频道参数，不能指定要读取的频道，因此不能订阅其它实盘或UUID频道。Rust策略适合作为广播端，订阅端请使用JavaScript或Python。
- **跨平台推送**：外部系统（如TradingView告警、自建程序）可以通过扩展API的```method=pub```向指定实盘推送一个以32位UUID标识的频道数据，实盘用```GetChannelData(UUID)```读取，具体方法见`SetChannelData`、`GetChannelData`。
- **实盘功能**：频道通信用于实盘之间，回测时不要依赖它。当前实盘ID可以用```_G()```获取。
- 不要在频道中传递密钥等敏感信息。

## 基本用法

### 广播端：发布行情摘要

```javascript
function main() {
    var robotId = _G()  // 当前实盘ID，也就是本实盘的频道ID
    var updateId = 0

    while (true) {
        var ticker = exchange.GetTicker("BTC_USDT")
        if (ticker) {
            // 发布最新状态，覆盖上一次的数据
            SetChannelData({
                robotId: robotId,
                updateId: ++updateId,
                timestamp: Date.now(),
                symbol: "BTC_USDT",
                lastPrice: ticker.Last
            })
            LogStatus("频道", robotId, "第", updateId, "次发布，最新价:", ticker.Last)
        }
        Sleep(60000)  // 每分钟发布一次
    }
}
```

```python
import time

def main():
    robotId = _G()  # 当前实盘ID，也就是本实盘的频道ID
    updateId = 0

    while True:
        ticker = exchange.GetTicker("BTC_USDT")
        if ticker:
            updateId += 1
            # 发布最新状态，覆盖上一次的数据
            SetChannelData({
                "robotId": robotId,
                "updateId": updateId,
                "timestamp": int(time.time() * 1000),
                "symbol": "BTC_USDT",
                "lastPrice": ticker["Last"]
            })
            LogStatus("频道", robotId, "第", updateId, "次发布，最新价:", ticker["Last"])
        Sleep(60000)  # 每分钟发布一次
```

```rust
fn main() {
    let robotId = _G!();  // 当前实盘ID，也就是本实盘的频道ID
    let mut updateId = 0;

    loop {
        if let Ok(ticker) = exchange.GetTicker("BTC_USDT") {
            updateId += 1;
            // Rust 的 SetChannelData 只接受字符串，自己拼 JSON 文本
            let state = format!(
                r#"{{"robotId": "{}", "updateId": {}, "timestamp": {}, "symbol": "BTC_USDT", "lastPrice": {}}}"#,
                robotId, updateId, Unix() * 1000, ticker.Last
            );
            SetChannelData(&state);
            LogStatus!("频道", robotId, "第", updateId, "次发布，最新价:", ticker.Last);
        }
        Sleep(60000);  // 每分钟发布一次
    }
}
```

### 订阅端：读取两个频道

```javascript
function main() {
    // 要订阅的实盘ID（按实际情况修改）
    var channels = ["632799", "632800"]

    while (true) {
        var msg = ""
        for (var i = 0; i < channels.length; i++) {
            // 第一次调用完成订阅并返回 null，之后返回最新数据
            var state = GetChannelData(channels[i])
            if (state) {
                msg += "频道 " + channels[i] + "：#" + state.updateId + " " + _D(state.timestamp) + " 最新价 " + state.lastPrice + "\n"
            } else {
                msg += "频道 " + channels[i] + "：等待数据\n"
            }
        }
        LogStatus(msg)
        Sleep(5000)
    }
}
```

```python
def main():
    # 要订阅的实盘ID（按实际情况修改）
    channels = ["632799", "632800"]

    while True:
        msg = ""
        for ch in channels:
            # 第一次调用完成订阅并返回 None，之后返回最新数据
            state = GetChannelData(ch)
            if state:
                msg += "频道 {}：#{} {} 最新价 {}\n".format(ch, state["updateId"], _D(state["timestamp"]), state["lastPrice"])
            else:
                msg += "频道 {}：等待数据\n".format(ch)
        LogStatus(msg)
        Sleep(5000)
```

```rust
// Rust 的 GetChannelData() 没有频道参数，不能订阅其它实盘的频道
```

## 场景：主从策略协同

主策略计算均线交叉信号并发布；从策略读取信号，在信号变化时下单。

**主策略（发布信号）**

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
            LogStatus("当前信号:", signal, "价格:", records[n - 1].Close)
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
            LogStatus("当前信号:", signal, "价格:", records[-1]["Close"])
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
                // Rust 的 SetChannelData 只接受字符串，自己拼 JSON 文本
                let data = format!(
                    r#"{{"timestamp": {}, "symbol": "BTC_USDT", "signal": "{}", "price": {}}}"#,
                    Unix() * 1000, signal, price
                );
                SetChannelData(&data);
                LogStatus!("当前信号:", signal, "价格:", price);
            }
        }
        Sleep(60000);
    }
}
```

**从策略（读取信号并执行）**

```javascript
function main() {
    var masterId = "632799"  // 主策略的实盘ID
    var lastSignal = null

    while (true) {
        var data = GetChannelData(masterId)
        if (!data) {
            LogStatus("等待主策略信号...")
        } else {
            if (data.signal !== lastSignal) {
                Log("收到新信号:", data.signal, "信号价格:", data.price)
                var ticker = exchange.GetTicker(data.symbol)
                if (ticker && data.signal === "BUY") {
                    exchange.CreateOrder(data.symbol, "buy", ticker.Last, 0.01)
                } else if (ticker && data.signal === "SELL") {
                    exchange.CreateOrder(data.symbol, "sell", ticker.Last, 0.01)
                }
                lastSignal = data.signal
            }
            LogStatus("当前信号:", data.signal, "信号时间:", _D(data.timestamp))
        }
        Sleep(5000)
    }
}
```

```python
def main():
    masterId = "632799"  # 主策略的实盘ID
    lastSignal = None

    while True:
        data = GetChannelData(masterId)
        if not data:
            LogStatus("等待主策略信号...")
        else:
            if data["signal"] != lastSignal:
                Log("收到新信号:", data["signal"], "信号价格:", data["price"])
                ticker = exchange.GetTicker(data["symbol"])
                if ticker and data["signal"] == "BUY":
                    exchange.CreateOrder(data["symbol"], "buy", ticker["Last"], 0.01)
                elif ticker and data["signal"] == "SELL":
                    exchange.CreateOrder(data["symbol"], "sell", ticker["Last"], 0.01)
                lastSignal = data["signal"]
            LogStatus("当前信号:", data["signal"], "信号时间:", _D(data["timestamp"]))
        Sleep(5000)
```

```rust
// Rust 的 GetChannelData() 没有频道参数，不能读取主策略实盘的频道
```

## 场景：多策略状态监控

各策略按上面广播端的方式发布状态，监控实盘读取所有频道，用表格展示，超过2分钟没有更新的标记为异常。

```javascript
function main() {
    var monitorList = ["632799", "632800", "632801"]  // 最多10个

    while (true) {
        var table = {type: "table", title: "策略运行状态", cols: ["实盘ID", "状态", "最后更新", "交易对", "最新价"], rows: []}
        for (var i = 0; i < monitorList.length; i++) {
            var data = GetChannelData(monitorList[i])
            if (data) {
                var status = Date.now() - data.timestamp < 120000 ? "运行中" : "异常"
                table.rows.push([monitorList[i], status, _D(data.timestamp), data.symbol || "-", data.lastPrice || "-"])
            } else {
                table.rows.push([monitorList[i], "等待数据", "-", "-", "-"])
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
    monitorList = ["632799", "632800", "632801"]  # 最多10个

    while True:
        table = {"type": "table", "title": "策略运行状态", "cols": ["实盘ID", "状态", "最后更新", "交易对", "最新价"], "rows": []}
        for robotId in monitorList:
            data = GetChannelData(robotId)
            if data:
                status = "运行中" if time.time() * 1000 - data["timestamp"] < 120000 else "异常"
                table["rows"].append([robotId, status, _D(data["timestamp"]), data.get("symbol", "-"), data.get("lastPrice", "-")])
            else:
                table["rows"].append([robotId, "等待数据", "-", "-", "-"])
        LogStatus("`" + json.dumps(table) + "`")
        Sleep(10000)
```

```rust
// Rust 的 GetChannelData() 没有频道参数，不能读取其它实盘的频道
```

See also: `SetChannelData`, `GetChannelData`, `_G`

### API限流控制

交易所对API调用频率有限制，超限轻则请求被拒，重则账号被临时封禁。用```exchange.IO("rate", ...)```或```exchange.IO("quota", ...)```可以在托管者本地给标准函数设置调用频率上限：超限的调用不会发出请求。

```js
exchange.IO("rate" | "quota", 名字, 次数, 窗口[, "delay"])
```

## 两种模式

- **rate（令牌桶）**：桶容量默认等于```次数```，开始时是满的，之后按「次数/窗口」的速度匀速补充，每次调用消耗一个。允许短时间连续调用，长期平均不超过「次数/窗口」。```次数```写成```"10/5"```时表示每个窗口补充10次、桶容量为5，用来限制突发。
- **quota（固定窗口）**：每个窗口内最多调用```次数```次，进入下一个窗口时清零。窗口按时间纪元对齐：```"1s"```对齐整秒，```"1m"```对齐整分钟，```"1h"```对齐整点，```"1d"```对齐UTC零点（即北京时间08:00）。例如12:00:00.900开始计数，到12:00:01.000就进入了新窗口。

需要严格保证「任意一个交易所计数周期内不超过N次」时用```quota```并让窗口与交易所的计数周期一致；只需要控制平均频率时用```rate```。

## 参数

| 参数 | 说明 |
| - | - |
| 名字 | 要限制的函数名，见下表。多个名字用逗号分隔（如```"GetTicker,GetDepth"```）时共用一条规则，调用次数合并计算。```"*"```是兜底规则，只对没有专属规则的函数生效。 |
| 次数 | 每个窗口允许的调用次数，必须大于0；```rate```模式可以写成```"次数/突发"```。传```0```或负数表示删除该名字的规则。 |
| 窗口 | 时长，写法同Go语言的```time.ParseDuration```：单位```ns```、```us```（或```µs```）、```ms```、```s```、```m```、```h```，可以带小数（```"1.5s"```），可以组合（```"1h30m"```）；另外支持```"Nd"```表示N天（可以带小数，如```"0.5d"```，不能与其它单位组合）。写成```"@HHMM"```或```"@HHMMSS"```（如```"@0800"```）表示按天计数、每天在该时刻（北京时间）清零，```rate```和```quota```都可以使用。 |
| 动作 | 省略时超限的调用立即失败；写```"delay"```时阻塞等待，直到有可用次数再发出请求。等待期间停止实盘会打断等待。 |

## 可以限制的函数名

| 类别 | 名字 |
| - | - |
| 行情 | ```GetTicker```、```GetTickers```、```GetDepth```、```GetTrades```、```GetRecords```、```GetMarkets```、```GetFundings``` |
| 账户 | ```GetAccount```、```GetAssets```、```GetPositions```、```SetMarginLevel``` |
| 交易 | ```CreateOrder```（```Buy```、```Sell```也计入）、```CancelOrder```、```ModifyOrder``` |
| 订单查询 | ```GetOrder```、```GetOrders```、```GetHistoryOrders``` |
| 条件单 | ```CreateConditionOrder```、```ModifyConditionOrder```、```CancelConditionOrder```、```GetConditionOrder```、```GetConditionOrders```、```GetHistoryConditionOrders``` |
| 自定义请求 | ```IO/api```：只限制```exchange.IO("api", ...)```，不影响其它```exchange.IO()```指令 |

- ```GetAccount```和```GetAssets```是同一个底层请求，写其中任何一个名字的规则对两个函数都生效。
- 通过```exchange.Go()```并发调用时，按实际调用的函数计数。

## 规则的作用范围

- 规则按交易所对象分别设置：```exchanges[0]```上的规则不影响```exchanges[1]```。
- 规则只在本次运行中有效，实盘重启后需要重新设置，通常写在```main()```开头。
- 同一个名字再次设置时覆盖原规则；名字传空字符串（```exchange.IO("rate", "")```）清空该交易所对象上的全部规则。
- 一次调用只按一条规则计数：有专属规则的函数不再计入```"*"```，所以```"*"```不能当作「所有调用的总配额」叠加在专属规则之上。

## 超限时的表现

默认动作下，超限的调用不发请求，按调用失败处理（JavaScript返回```null```，Python返回```None```，Rust返回```Err```），错误信息形如：

```
rate limit exceeded: GetTicker 10/1s
quota limit exceeded: GetTicker 10/1m
quota limit exceeded: GetRecords 2000/day (resets at 0800)
```

使用```"delay"```动作时调用会阻塞到有可用次数，日志中记录的调用时间是等待结束之后的时间。对每天清零的规则使用```"delay"```，最长可能等待到第二天，请谨慎使用。

## 示例

### 默认动作：超限时调用失败

```javascript
function main() {
    // GetTicker 平均每秒最多 5 次（令牌桶，容量 5）
    exchange.IO("rate", "GetTicker", 5, "1s")

    for (var i = 0; i < 10; i++) {
        var ticker = exchange.GetTicker("BTC_USDT")
        if (ticker) {
            Log("第", i + 1, "次成功:", ticker.Last)
        } else {
            // 超限的调用不发请求，返回 null
            Log("第", i + 1, "次被限流:", GetLastError())
        }
    }
}
```

```python
def main():
    # GetTicker 平均每秒最多 5 次（令牌桶，容量 5）
    exchange.IO("rate", "GetTicker", 5, "1s")

    for i in range(10):
        ticker = exchange.GetTicker("BTC_USDT")
        if ticker:
            Log("第", i + 1, "次成功:", ticker["Last"])
        else:
            # 超限的调用不发请求，返回 None
            Log("第", i + 1, "次被限流:", GetLastError())
```

```rust
fn main() {
    // GetTicker 平均每秒最多 5 次（令牌桶，容量 5）
    let _ = exchange.IO(("rate", "GetTicker", 5, "1s"));

    for i in 0..10 {
        match exchange.GetTicker("BTC_USDT") {
            Ok(ticker) => Log!("第", i + 1, "次成功:", ticker.Last),
            // 超限的调用不发请求，返回 Err
            Err(e) => Log!("第", i + 1, "次被限流:", e),
        }
    }
}
```

### 按交易所的限频规则分组设置

行情和交易分别共用一条规则；交易类超限时等待而不是失败；其余没有专属规则的函数用```"*"```兜底。

```javascript
function main() {
    // 行情：GetTicker、GetDepth 合计平均每秒 20 次
    exchange.IO("rate", "GetTicker,GetDepth", 20, "1s")
    // 交易：下单（含 Buy/Sell）、撤单合计每秒 5 次，超限时等待
    exchange.IO("rate", "CreateOrder,CancelOrder", 5, "1s", "delay")
    // 兜底：其它函数（如 GetAccount、GetPositions）合计每分钟 60 次，窗口对齐整分钟
    exchange.IO("quota", "*", 60, "1m")

    while (true) {
        var ticker = exchange.GetTicker("BTC_USDT")
        var depth = exchange.GetDepth("BTC_USDT")
        if (ticker && depth) {
            Log("最新价:", ticker.Last, "买一:", depth.Bids[0].Price)
        }
        Sleep(1000)
    }
}
```

```python
def main():
    # 行情：GetTicker、GetDepth 合计平均每秒 20 次
    exchange.IO("rate", "GetTicker,GetDepth", 20, "1s")
    # 交易：下单（含 Buy/Sell）、撤单合计每秒 5 次，超限时等待
    exchange.IO("rate", "CreateOrder,CancelOrder", 5, "1s", "delay")
    # 兜底：其它函数（如 GetAccount、GetPositions）合计每分钟 60 次，窗口对齐整分钟
    exchange.IO("quota", "*", 60, "1m")

    while True:
        ticker = exchange.GetTicker("BTC_USDT")
        depth = exchange.GetDepth("BTC_USDT")
        if ticker and depth:
            Log("最新价:", ticker["Last"], "买一:", depth["Bids"][0]["Price"])
        Sleep(1000)
```

```rust
fn main() {
    // 行情：GetTicker、GetDepth 合计平均每秒 20 次
    let _ = exchange.IO(("rate", "GetTicker,GetDepth", 20, "1s"));
    // 交易：下单（含 Buy/Sell）、撤单合计每秒 5 次，超限时等待
    let _ = exchange.IO(("rate", "CreateOrder,CancelOrder", 5, "1s", "delay"));
    // 兜底：其它函数（如 GetAccount、GetPositions）合计每分钟 60 次，窗口对齐整分钟
    let _ = exchange.IO(("quota", "*", 60, "1m"));

    loop {
        if let (Ok(ticker), Ok(depth)) = (exchange.GetTicker("BTC_USDT"), exchange.GetDepth("BTC_USDT")) {
            Log!("最新价:", ticker.Last, "买一:", depth.Bids[0].Price);
        }
        Sleep(1000);
    }
}
```

### 突发容量、每日配额与删除规则

```javascript
function main() {
    // 平均每秒 10 次，但最多连续突发 2 次
    exchange.IO("rate", "GetDepth", "10/2", "1s")
    // 每天北京时间 08:00 清零，每天最多 2000 次
    exchange.IO("quota", "GetRecords", 2000, "@0800")
    // 窗口可以组合单位：每 1 小时 30 分钟最多 100 次
    exchange.IO("rate", "GetOrders", 100, "1h30m")

    // 次数传 0：删除 GetOrders 的规则
    exchange.IO("rate", "GetOrders", 0)
    // 名字传空字符串：清空本交易所对象上的全部规则
    exchange.IO("rate", "")
}
```

```python
def main():
    # 平均每秒 10 次，但最多连续突发 2 次
    exchange.IO("rate", "GetDepth", "10/2", "1s")
    # 每天北京时间 08:00 清零，每天最多 2000 次
    exchange.IO("quota", "GetRecords", 2000, "@0800")
    # 窗口可以组合单位：每 1 小时 30 分钟最多 100 次
    exchange.IO("rate", "GetOrders", 100, "1h30m")

    # 次数传 0：删除 GetOrders 的规则
    exchange.IO("rate", "GetOrders", 0)
    # 名字传空字符串：清空本交易所对象上的全部规则
    exchange.IO("rate", "")
```

```rust
fn main() {
    // 平均每秒 10 次，但最多连续突发 2 次
    let _ = exchange.IO(("rate", "GetDepth", "10/2", "1s"));
    // 每天北京时间 08:00 清零，每天最多 2000 次
    let _ = exchange.IO(("quota", "GetRecords", 2000, "@0800"));
    // 窗口可以组合单位：每 1 小时 30 分钟最多 100 次
    let _ = exchange.IO(("rate", "GetOrders", 100, "1h30m"));

    // 次数传 0：删除 GetOrders 的规则
    let _ = exchange.IO(("rate", "GetOrders", 0));
    // 名字传空字符串：清空本交易所对象上的全部规则
    let _ = exchange.IO(("rate", ""));
}
```

See also: `exchange.IO`, `exchange.Go`, `GetLastError`

### 期权交易

发明者量化交易平台支持在以下加密货币期货交易所交易期权。期权的用法与期货合约相同：用```exchange.SetContractType()```把合约设为期权代码（期权代码就是交易所的原生代码，各交易所写法不同），之后```GetTicker()```、```GetDepth()```等行情函数，```Buy()```、```Sell()```（下单前用```exchange.SetDirection()```设置交易方向）、```CancelOrder()```、```GetPositions()```等交易函数都作用于该期权合约。也可以用完整的交易品种代码直接下单，形如```交易对.期权代码```，例如```BTC_USDT.BTC-260925-145000-C```。

期权合约的盘口通常较薄：买一、卖一没有挂单时```Ticker```的```Buy```、```Sell```为0，从未成交的合约```Last```也可能为0，各交易所的处理见下文。```exchange.GetMarkets()```是否列出期权合约因交易所而异；不列出时，期权代码需要从交易所的接口或网页获取。

## Futures_Deribit

设置期权合约后即可获取行情、下单、撤单、查询持仓。期权代码例子：```BTC-13SEP24-60000-C```、```XRP_USDC-27SEP24-1-C```，组合合约例子：```BTC-CS-6SEP24-57000_57500```、```BTC-PCAL-20SEP24_13SEP24-55000```。```exchange.GetMarkets()```的结果包含期权合约。

可供参考的策略代码：[Deribit期权测试策略](https://www.fmz.com/strategy/179475)

## Futures_OKX

用法与Deribit相同，交易对设置为```BTC_USD```等，期权代码形如```BTC-USD-200626-4500-C```。从未成交的期权合约，```GetTicker()```的```Last```取标记价格。```exchange.GetMarkets()```不列出期权合约，可以通过OKX的```/api/v5/public/instruments```接口查询期权合约列表，例如查询BTC期权：

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

支持币安欧式期权（USDT结算），交易对设置为```BTC_USDT```等，期权代码形如```BTC-260925-145000-C```（标的-到期日YYMMDD-行权价-C/P）。需要账户已开通期权交易。限制：

- 只支持限价单，不支持市价单、条件单和改单（```exchange.ModifyOrder()```）。
- 不支持```exchange.SetMarginLevel()```等杠杆、保证金模式设置。
- 统一账户（组合保证金）不支持期权。
- ```exchange.GetMarkets()```不列出期权合约。

## Futures_Bybit

支持两种结算的期权：

- USDC结算：交易对设置为```ETH_USDC```等，期权代码形如```ETH-25NOV22-1375-P```。
- USDT结算：交易对设置为```ETH_USDT```等，期权代码比USDC结算的多一段结算币后缀，形如```ETH-25JUN27-2800-C-USDT```。

```exchange.GetMarkets()```的结果包含两种结算的期权合约。Bybit期权没有K线接口，```GetRecords()```由成交记录合成。

## Futures_Aevo

支持Aevo交易所的USDC期权，交易对设置为```ETH_USDC```等，期权代码形如```ETH-30JUN23-1600-C```。```GetTicker()```的```Last```为标记价格。Aevo没有K线接口，```GetRecords()```由成交记录合成，合约没有成交时为空。```exchange.GetMarkets()```的结果包含期权合约。

## Futures_GateIO

支持Gate交易所的USDT期权，交易对设置为```BTC_USDT```等，期权代码形如```BTC_USDT-20211130-65000-C```。```exchange.GetMarkets()```的结果包含期权合约。账户没有开通期权时，查询订单、持仓会返回交易所的错误。

## Futures_Kraken

支持Kraken期货的期权，交易对设置为```ETH_USD```等，期权代码形如```OF_ETHUSD_261225_4000_C```（```OF_```、标的与计价币、到期日YYMMDD、行权价、C/P），代码中的标的与计价币必须与交易对一致，BTC在代码中写作```XBT```（如```OF_XBTUSD_...```）。

- Kraken没有期权合约列表接口，```exchange.GetMarkets()```不包含期权合约，期权代码需要从Kraken网页获取。
- ```GetTicker()```的```Last```取标记价格，```Buy```、```Sell```、```High```、```Low```为0，原始数据```Info```中有隐含波动率、希腊值等字段。
- 行情、K线、订单、持仓、历史订单的查询可用；期权下单与期货合约走同一个下单接口，尚未经过实盘验证。
- 期权没有资金费率，不支持```exchange.SetMarginLevel()```。

See also: `exchange.SetContractType`, `exchange.SetDirection`, `exchange.GetPositions`

### Web3

在去中心化交易所Uniswap、PancakeSwap上兑换代币，请使用Uniswap交易所对象，见`Uniswap与PancakeSwap`；查询链上数据、调用智能合约、发送自定义交易，请使用Web3交易所对象，它支持以太坊等EVM兼容链和波场。

#### Uniswap与PancakeSwap

Uniswap交易所对象在一条链上连接Uniswap或PancakeSwap的V2、V3资金池，把链上兑换映射为现货交易函数：用```exchange.GetTicker()```看价格、用```exchange.CreateOrder()```下单，不需要自己注册ABI、编码合约调用。选路、询价、代币授权、价格保护、发送交易都由交易所对象完成。

## 什么时候用Uniswap交易所对象，什么时候用Web3

- 在Uniswap、PancakeSwap上**兑换代币**：用Uniswap交易所对象。
- 调用其它合约、DEX的其它功能（如提供流动性、管理V3头寸）、其它链、自定义交易：用Web3交易所对象，见`以太坊（EVM）`。

一个策略可以同时添加两种交易所对象，使用同一个钱包。

## 配置交易所对象

| 字段 | 说明 |
| - | - |
| DEX | ```Uniswap```或```PancakeSwap``` |
| Chain | ```Ethereum```、```Arbitrum```、```Base```、```BNB Chain```。一个交易所对象只对应一条链上的一个DEX |
| Private Key | 钱包私钥（十六进制字符串）。支持把私钥本地化部署在托管者上，参看`密钥安全性` |
| Rpc Address | 该链的节点地址，选择Chain时自动填入公共节点（如以太坊为```https://ethereum-rpc.publicnode.com```）。可以写多个节点，用逗号分隔，互为备用 |
| Rpc Api Key | 节点鉴权，可以留空。写成```名称: 值```时作为该名称的请求头发送，否则作为```Authorization: Basic <值>```发送 |

第一次调用时会核对节点所在的链与Chain是否一致，不一致时报错，不会把交易发到别的链上。钱包里需要有该链的原生币（ETH或BNB）支付gas。

## 交易对

- 交易对写作```ETH_USDC```、```UNI_USDT```这样的```基础币_计价币```。
- 代币名按以下顺序解析：内置的常用代币（原生币、包装币、USDC、USDT等）→ 用```exchange.IO("token", 名字, 合约地址)```登记的代币 → 官方代币列表。官方列表中同一条链上有同名代币时，请改用合约地址。
- 不在代币表中的代币可以直接用合约地址作为交易对的一部分，例如```0x1f9840a85d5af5bf1d1762f925bdaddc4201f984_USDC```。
- **原生币与包装币是两种资产**：```ETH```与```WETH```、```BNB```与```WBNB```分别是不同的币。交易原生币时路由合约会自动包装、解包。两者之间的转换不能下单，用```exchange.IO("wrap", 数量)```、```exchange.IO("unwrap", 数量)```直接调用包装币合约，1:1兑换，只花gas。
- ```exchange.GetMarkets()```只列出常用的交易对，没有列出的交易对同样可以交易。

## 标准函数的含义

| 函数 | 行为 |
| - | - |
| ```exchange.GetTicker()``` | 买一、卖一是按一定规模实际询价得到的可成交价格（已包含池子手续费）；链上没有24小时统计 |
| ```exchange.GetDepth()``` | 按逐档递增的规模在链上询价，推算出的价位，不是真实的挂单簿 |
| ```exchange.GetTrades()``` | 该交易对资金池最近的链上兑换记录 |
| ```exchange.GetAccount()```、```exchange.GetAssets()``` | 钱包中原生币和代币表中各代币的余额 |
| ```exchange.CreateOrder()``` | 立即在链上兑换，见下文 |
| ```exchange.GetOrder()``` | 订单ID就是交易哈希，状态来自交易回执：上链前为未完成，上链后为成交或失败 |
| ```exchange.GetOrders()``` | 本次运行发出、还没有上链的订单 |
| ```exchange.CancelOrder()``` | 用同一个nonce发送一笔替换交易，尽力撤销，见下文 |

不支持```exchange.GetRecords()```、```exchange.GetTickers()```、```exchange.GetHistoryOrders()```。

## 下单

DEX没有挂单簿，每笔订单都是一次立即执行的链上兑换：要么整笔成交，要么整笔回滚（只损失gas），不会部分成交、也不会挂在那里等价格。

- **限价单**：限价是**最差成交价**。下单时先询价，按当前价格达不到限价时直接报错，不发交易；达得到时把「最少得到/最多支付」写进链上交易，交易上链前价格变动导致达不到时整笔回滚。
- **市价单**：按询价结果扣除滑点得到最少得到/最多支付的数量，滑点默认0.5%，用```exchange.IO("slippage", 比例)```修改。
- **数量**：卖出时是卖出的基础币数量；限价买入时是要买到的基础币数量；**市价买入时是要花费的计价币数量**。
- 单笔订单可以在方向参数后附加设置，例如```exchange.CreateOrder("ETH_USDC", 'sell;{"slippage":0.01,"route":"v3"}', -1, 0.1)```：```slippage```为本单滑点，```route```限定路径类型（```v2```、```v3```、```hop```两跳、```direct```直连）。
- 卖出代币（ERC20）前会检查路由合约的授权额度，不够时先发送授权交易并等待上链。默认只授权本次需要的数量，```exchange.IO("approve", "max")```改为无限授权，省去之后的授权交易。
- 交易超过截止时间（默认120秒，```exchange.IO("deadline", 秒数)```修改）仍未上链时会回滚，避免在价格大幅变化后才成交。

## 撤单

```exchange.CancelOrder()```用原订单的nonce发送一笔转给自己的0金额交易，手续费更高，先上链则原订单失效。这只是尽力撤销：原订单可能在替换交易之前上链并成交；原订单已经上链时撤单直接报错。撤单后用```exchange.GetOrder()```确认最终状态。

## 常用的exchange.IO()指令

| 指令 | 作用 |
| - | - |
| ```exchange.IO("slippage", 比例)``` | 市价单滑点，默认```0.005``` |
| ```exchange.IO("deadline", 秒数)``` | 交易截止时间，默认120秒 |
| ```exchange.IO("gasMultiplier", 倍数)``` | gas上限 = 节点估算值 × 倍数，默认1.2 |
| ```exchange.IO("approve", "exact" 或 "max")``` | 授权模式 |
| ```exchange.IO("token", 名字, 合约地址)``` | 登记代币；不传参数时列出代币表 |
| ```exchange.IO("route", 交易对, 方向, 数量)``` | 只询价：各候选路径的报价和最优路径，不下单 |
| ```exchange.IO("simulate", 交易对, 方向, 数量[, 价格])``` | 按下单逻辑构造交易，只在链上模拟执行，不花gas |
| ```exchange.IO("transfer", 收款地址, 数量[, 代币])``` | 转出原生币或代币，数量可以写```"all"``` |
| ```exchange.IO("receipt", 交易哈希[, 等待毫秒])``` | 查询转账等交易的回执，可以等待上链 |
| ```exchange.IO("wrap", 数量)```、```exchange.IO("unwrap", 数量)``` | 原生币与包装币1:1互换 |
| ```exchange.IO("contracts")``` | 当前DEX在当前链上的合约地址 |
| ```exchange.IO("base", 节点地址)```、```exchange.IO("sendBase", 节点地址)``` | 切换节点；设置只用于广播交易的节点（私有交易通道） |
| ```exchange.IO("address")``` | 钱包地址 |

各指令的参数与返回值见语法手册`Uniswap`分类。

## 示例：询价、模拟，然后市价卖出

以以太坊上的```ETH_USDC```为例。注意```CreateOrder```会发出真实交易。

```javascript
function main() {
    var symbol = "ETH_USDC"
    exchange.IO("slippage", 0.003)   // 市价单滑点 0.3%

    var t = exchange.GetTicker(symbol)
    Log("买一:", t.Buy, "卖一:", t.Sell)

    // 只询价：卖出 0.1 ETH 的最优路径
    var r = exchange.IO("route", symbol, "sell", 0.1)
    Log("最优路径:", r.best, "价格:", r.price)

    // 链上模拟一遍，不花 gas
    if (!exchange.IO("simulate", symbol, "sell", 0.1)) {
        Log("模拟失败:", GetLastError())
        return
    }

    // 市价卖出 0.1 ETH，订单 ID 是交易哈希
    var id = exchange.CreateOrder(symbol, "sell", -1, 0.1)
    if (!id) {
        Log("下单失败:", GetLastError())
        return
    }
    while (true) {
        var o = exchange.GetOrder(id)
        if (o && o.Status != ORDER_STATE_PENDING) {
            Log("状态:", o.Status, "成交数量:", o.DealAmount, "成交均价:", o.AvgPrice)
            break
        }
        Sleep(3000)
    }
}
```

See also: `Uniswap`, `exchange.CreateOrder`, `exchange.CancelOrder`

#### 以太坊（EVM）

Web3交易所对象选择```ChainType```为```ETH```时，可以连接以太坊以及所有EVM兼容链（BSC、Base、Arbitrum、Optimism、Polygon等）的节点，用```exchange.IO()```的各个指令查询余额、调用合约、发送交易。本页按一笔链上操作的流程介绍常用指令，每个指令的完整参数见语法手册`Web3`分类中对应的```exchange.IO("指令", ...)```。

只是想在Uniswap、PancakeSwap上兑换代币时，请使用`Uniswap交易所对象`：它直接支持```exchange.GetTicker()```、```exchange.CreateOrder()```等标准函数，不需要自己编码合约调用。

## 1. 配置交易所对象

在「交易所」页面（```/m/add-platform```）添加交易所，协议选择「加密货币」，交易所选择```Web3```：

| 字段 | 说明 |
| - | - |
| ChainType | ```ETH```：以太坊及所有EVM兼容链；```TRON```：波场，见`波场（TRON）` |
| Private Key | 钱包私钥（十六进制字符串，可以带```0x```前缀）。支持把私钥本地化部署在托管者上，参看`密钥安全性` |
| Rpc Address | 节点地址，默认```https://ethereum-rpc.publicnode.com```（以太坊主网公共节点）。连接其它链时填写该链的节点，例如BSC：```https://bsc-dataseed.binance.org```。支持```http(s)://```和```ws(s)://```。可以写多个节点，用逗号分隔，互为备用 |
| Rpc Api Key | 节点鉴权，可以留空。写成```名称: 值```（如```x-api-key: xxx```）时作为该名称的请求头发送；否则作为```Authorization: Basic <值>```发送 |

多个节点时，从上次成功的节点开始依次尝试：只有节点不可用（连接失败、超时、限流）时才换下一个，合约执行失败之类的错误直接返回；链ID与第一个节点不同的节点会被跳过，避免把交易发到另一条链。

运行中可以用```exchange.IO("base", 节点地址)```切换节点（多个节点可以传数组或逗号分隔的字符串），用```exchange.IO("key", 私钥)```切换钱包私钥，用`exchange.IO("address")`获取当前钱包地址。

标准函数中只有```exchange.GetAccount()```、```exchange.GetAssets()```可用，返回钱包的原生币余额（币种按链ID识别，如BSC为```BNB```）。

## 2. 查询余额与读取合约

调用合约的只读方法（```view```/```pure```）不消耗gas，直接返回解码后的结果：

```js
exchange.IO("api", "eth", "eth_getBalance", wallet, "latest")   // 原生币余额，链上整数（十六进制字符串）
exchange.IO("api", tokenAddress, "balanceOf", wallet)           // ERC20余额，链上整数
exchange.IO("api", tokenAddress, "decimals")                    // 代币精度
```

- ```exchange.IO("api", "eth", 方法, ...参数)```直接调用节点的JSON-RPC方法，如```eth_gasPrice```、```eth_blockNumber```、```eth_getTransactionReceipt```。
- ```exchange.IO("api", 合约地址, 方法, ...参数)```调用合约方法。方法可以写方法名、完整签名（如```"approve(address,uint256)"```，用于区分重载）或方法选择器（如```"0x095ea7b3"```）。
- 链上数量都是整数。用```exchange.IO("fromUnits", 链上整数, 精度)```换算成可读数量，用```exchange.IO("toUnits", "1.5", 精度)```换算回链上整数；精度也可以直接传代币合约地址。两者都按字符串精确计算。
- 批量读取多个合约时用```exchange.IO("multicall", ...)```一次请求完成；查询事件日志用```exchange.IO("logs", ...)```。

## 3. 注册ABI

标准ERC20方法（```balanceOf```、```decimals```、```allowance```、```approve```、```transfer```等）已内置，不需要注册。调用其它合约的方法前，需要用```exchange.IO("abi", 合约地址, ABI)```注册该合约的ABI。

常用合约可以直接使用内置模板，第三个参数传模板名：```"weth"```、```"uniswapV3Pool"```、```"uniswapV3Factory"```、```"uniswapV3QuoterV2"```、```"uniswapV3SwapRouter02"```、```"uniswapV3PositionManager"```、```"permit2"```（PancakeSwap V3使用相同的模板，也可以写```"pancakeV3Pool"```等别名）。常用合约的地址可以用```exchange.IO("contracts")```查询。

```js
exchange.IO("abi", poolAddress, "uniswapV3Pool")
var slot0 = exchange.IO("api", poolAddress, "slot0")
```

其它合约的ABI可以从区块浏览器获取，例如Etherscan的V2接口（需要Etherscan的API Key，```chainid```为链ID，取返回结果中的```result```字段）：

```url
https://api.etherscan.io/v2/api?chainid=1&module=contract&action=getabi&address=0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45&apikey=YourApiKey
```

## 4. 发送交易

调用合约的写方法时，交易所对象用配置的私钥签名并广播交易，返回交易哈希。发送前可以把```"api"```换成```"call"```，用```exchange.IO("call", ...)```预演同一笔调用：在节点上模拟执行，不签名、不消耗gas，执行失败时返回空值，```GetLastError()```中有合约给出的失败原因。

以授权（approve）为例：

```js
var amount = exchange.IO("toUnits", "100", tokenAddress)                 // 100个代币换算成链上整数
var txHash = exchange.IO("api", tokenAddress, "approve", spender, amount)
```

方法的```stateMutability```为```payable```时，方法参数之前要多传一个参数：附带的原生币数量（链上整数）。最后一个参数可以传选项对象：

| 选项 | 说明 |
| - | - |
| gasLimit | gas上限。不传时由节点估算（```eth_estimateGas```）。合约调用不要写```21000```，那只够普通转账 |
| gasPrice | 固定gas价格，传入时发送传统（legacy）交易。不传时，支持EIP-1559的链发送EIP-1559交易：小费取节点建议值与最近区块实际小费的较大者，最高费用为```2 × baseFee + 小费``` |
| nonce | 指定nonce。不传时自动分配，并与链上待处理计数同步，连续发送不会重复使用nonce |
| dryRun | 设为```true```时只签名不广播，返回```hash```、```raw```（签名后的交易）、```nonce```、```gasLimit```等字段，可用于检查交易或交给其它渠道发送 |

转出原生币使用```exchange.IO("api", "eth", "send", 收款地址, 数量)```，数量是链上整数（wei）。它的选项还支持```data```（十六进制调用数据），用于原样发送聚合器等API返回的交易```{to, data, value}```，此时gas按合约调用估算。注意：普通转账不传```gasPrice```时按固定的100 Gwei出价、gas上限为21000，在以太坊主网上通常偏高，建议先用```eth_gasPrice```查询后传入。

需要把交易发到私有交易通道（如Flashbots Protect、MEV Blocker）避免被抢跑时，用```exchange.IO("sendBase", 节点地址)```设置只用于广播交易的节点。

## 5. 等待交易上链

```exchange.IO("waitReceipt", 交易哈希, {timeout, confirmations})```等待交易上链并达到确认数，返回交易回执：```status```为```1```表示成功、```0```表示失败（```revertReason```为失败原因），```events```为按已注册ABI解码的事件。超时未上链时返回空值。

## 6. nonce管理、加速与取消

- ```exchange.IO("nonce")```查看链上与本地的nonce计数；```exchange.IO("nonce", "sync")```按链上重新同步（在别处用同一个钱包发过交易后使用）。
- 交易长时间未上链时，用```exchange.IO("speedUp", 交易哈希)```以同一个nonce、更高的手续费重发；用```exchange.IO("cancelTx", 交易哈希)```发送一笔同nonce、转给自己的0金额交易顶替原交易。两者都在原交易上链前才有效。
- 本地nonce记录只在当前实盘内有效：多个实盘共用一个钱包时彼此看不到对方的记录，仍可能冲突，建议每个实盘使用独立的钱包。

## 其它指令

- 编码与解码：```exchange.IO("encode", ...)```编码合约调用数据或按类型编码（同Solidity的```abi.encode```），```exchange.IO("encodePacked", ...)```紧凑编码（如Uniswap V3的兑换路径），```exchange.IO("decode", ...)```按类型解码。
- 签名：```exchange.IO("sign", ...)```对32字节哈希签名，```exchange.IO("signTypedData", ...)```对EIP-712结构化数据签名（如ERC-20 Permit），```exchange.IO("signMessage", ...)```对消息做EIP-191签名。
- Uniswap V3数学：```exchange.IO("uniswapV3", ...)```在tick、价格、sqrtPrice之间换算，在流动性与代币数量之间换算。
- 哈希：```exchange.IO("hash", "keccak256", "raw", "hex", 文本)```计算keccak256等摘要，可用于计算方法选择器、EIP-712摘要，参数与```Encode()```函数相同。
- 完整范例：通过聚合器兑换（询价、生成交易、用```exchange.IO("call", ...)```预演、带```data```发送）见手册中```exchange.IO("call", ...)```的范例；ERC-20 Permit签名并由合约验签见```exchange.IO("sign", ...)```、```exchange.IO("signTypedData", ...)```的范例。

## 示例：查余额、授权并等待上链

以以太坊主网的USDC为例。注意这段代码会发出真实交易、消耗gas。

```javascript
function main() {
    var usdc = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"     // 以太坊主网 USDC
    var spender = "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45"  // 被授权的合约，这里以 Uniswap SwapRouter02 为例
    var wallet = exchange.IO("address")

    // 查余额：标准 ERC20 方法不需要注册 ABI
    var eth = exchange.IO("fromUnits", exchange.IO("api", "eth", "eth_getBalance", wallet, "latest"), 18)
    var usdcBalance = exchange.IO("fromUnits", exchange.IO("api", usdc, "balanceOf", wallet), usdc)
    Log("ETH:", eth, "USDC:", usdcBalance)

    // 读合约：当前授权额度
    var allowance = exchange.IO("api", usdc, "allowance", wallet, spender)
    Log("当前授权:", exchange.IO("fromUnits", allowance, usdc))

    // 授权 100 USDC：先预演，再发送
    var amount = exchange.IO("toUnits", "100", usdc)
    if (!exchange.IO("call", usdc, "approve", spender, amount)) {
        Log("预演失败:", GetLastError())
        return
    }
    var txHash = exchange.IO("api", usdc, "approve", spender, amount)
    Log("交易哈希:", txHash)

    // 等待上链，最多 3 分钟
    var receipt = exchange.IO("waitReceipt", txHash, {timeout: 180000})
    if (receipt && receipt.status == 1) {
        Log("授权成功，区块:", receipt.blockNumber)
    } else if (receipt) {
        Log("交易失败:", receipt.revertReason)
    } else {
        // 未上链：可以用 speedUp 加价重发，或 cancelTx 取消
        Log("超时未上链:", GetLastError())
    }
}
```

See also: `Web3`, `exchange.IO`

#### 波场（TRON）

Web3交易所对象选择```ChainType```为```TRON```时连接波场节点。用法与`以太坊（EVM）`基本一致：注册ABI、调用合约、编码解码、签名、切换私钥等```exchange.IO()```指令相同，地址使用波场格式（```T```开头），TRX数量的单位是sun（1 TRX = 1000000 sun）。本页说明配置和波场特有的部分。

## 配置交易所对象

| 字段 | 说明 |
| - | - |
| ChainType | 选择```TRON``` |
| Private Key | 钱包私钥（十六进制字符串）。支持把私钥本地化部署在托管者上，参看`密钥安全性` |
| Rpc Address | 波场全节点的HTTP地址，例如官方节点```https://api.trongrid.io```（测试网：```https://nile.trongrid.io```、```https://api.shasta.trongrid.io```） |
| Rpc Api Key | TronGrid的API Key，只填Key本身，会作为```TRON-PRO-API-KEY```请求头发送。不填也能使用，但TronGrid对没有Key的请求限频更严格 |

托管者通过全节点的HTTP接口（```/wallet/...```）访问波场，不再使用gRPC。选择TRON时表单默认填入的旧gRPC地址```grpc.trongrid.io:50051```会自动换成```https://api.trongrid.io```（```grpc.nile.trongrid.io:50051```、```grpc.shasta.trongrid.io:50051```同样换成对应测试网的HTTP地址）；其它gRPC地址会报错，请改填节点的HTTP地址。

运行中可以用```exchange.IO("base", 节点地址)```切换节点，用```exchange.IO("key", 私钥)```切换钱包，用```exchange.IO("address")```获取当前钱包地址（```T```开头）。标准函数```exchange.GetAccount()```、```exchange.GetAssets()```返回钱包的TRX余额。账户还未激活（链上没有记录）时余额为0。

## 调用智能合约

与以太坊相同，使用```exchange.IO("api", 合约地址, 方法, ...参数)```：只读方法直接返回结果，写方法签名并广播交易，返回交易ID。TRC20标准方法已内置；其它合约没有注册ABI时，会自动从链上读取该合约的ABI，读取不到时再用```exchange.IO("abi", 合约地址, ABI)```手动注册。写方法的最后一个参数可以传```{gasLimit: 数量}```设置手续费上限（feeLimit，单位sun）。

```js
// USDT（TRC20）合约
var usdt = "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t"
Log(exchange.IO("api", usdt, "balanceOf", exchange.IO("address")))   // 链上整数，USDT精度为6
```

编码解码与以太坊一致，地址参数可以直接写```T```开头的地址：

```js
exchange.IO("encode", "address", "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t")
// 000000000000000000000000a614f803b6fd780986a42c78ec9c7f77e6ded13c
exchange.IO("encodePacked", "address", "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t")
// a614f803b6fd780986a42c78ec9c7f77e6ded13c
exchange.IO("decode", "string", "0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000a5465746865722055534400000000000000000000000000000000000000000000")
// Tether USD
```

## 调用波场节点的方法

```exchange.IO("api", "tron", 方法, ...参数)```调用波场节点的方法，方法名不区分大小写。需要签名的方法（转账、触发合约等）会自动签名并广播。常用方法：

| 方法 | 参数 | 说明 |
| - | - | - |
| ```send``` | 收款地址, 数量(sun) | 从当前钱包转出TRX |
| ```Transfer``` | 付款地址, 收款地址, 数量(sun) | 转出TRX，付款地址必须是当前钱包 |
| ```GetAccount``` | 地址 | 账户信息 |
| ```GetAccountResource``` | 地址 | 账户的能量、带宽资源 |
| ```GetContractABI``` | 合约地址 | 合约在链上的ABI |
| ```GetAssetIssueByName``` | 名称 | TRC10资产信息 |
| ```GetNowBlock``` | 无 | 当前区块 |
| ```GetBlockByNum``` | 区块高度 | 指定区块 |
| ```GetTransactionByID``` | 交易ID | 交易内容 |
| ```GetTransactionInfoByID``` | 交易ID | 交易执行结果（手续费、能量消耗、日志等） |
| ```GetChainParameters``` | 无 | 链参数 |
| ```TriggerConstantContract``` | 调用者地址（可为空）, 合约地址, 方法, 参数编码 | 只读调用合约，结果在```constant_result```中（十六进制字符串，可以用```exchange.IO("decode", ...)```解码） |
| ```TRC20ContractBalance``` | 地址, 合约地址 | TRC20余额（链上整数） |
| ```TRC20GetName```、```TRC20GetSymbol```、```TRC20GetDecimals``` | 合约地址 | TRC20的名称、符号、精度 |
| ```TRC20Send```、```TRC20Approve``` | 付款地址, 收款或被授权地址, 合约地址, 数量, feeLimit | TRC20转账、授权 |
| ```TRC20Call``` | 调用者地址（可为空）, 合约地址, 调用数据, 是否只读, feeLimit | 用原始调用数据调用合约 |
| ```ParseTRC20NumericProperty```、```ParseTRC20StringProperty``` | 十六进制数据 | 解析TRC20返回的数值、字符串 |

表中没有的节点接口，可以直接传路径和请求体：```exchange.IO("api", "tron", "/wallet/接口名", {请求体})```。

## 与以太坊的差异

以下指令只支持以太坊（EVM），在波场上调用会报错：```call```、```multicall```、```logs```、```waitReceipt```、```nonce```、```speedUp```、```cancelTx```、```contracts```；```sendBase```和多个节点互为备用也只对以太坊有效。在波场上模拟执行合约调用可以用节点方法```TriggerConstantContract```，查询交易的执行结果用```GetTransactionInfoByID```。

```toUnits```、```fromUnits```、```uniswapV3```、编码解码和签名指令在波场上同样可用，精度参数可以直接传TRC20合约地址：

```js
var usdt = "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t"
var raw = exchange.IO("api", usdt, "balanceOf", exchange.IO("address"))
Log(exchange.IO("fromUnits", raw, usdt))   // 按合约的 decimals() 换算为可读数量
```

合约调用在节点校验阶段被拒绝时（例如合约不存在），错误信息中是节点给出的原因，例如```tron contract call rejected (CONTRACT_VALIDATE_ERROR): Smart contract is not exist.```；合约执行失败（revert）时报```tron contract execution failed```及失败原因。

## 签名

```exchange.IO("hash", "sign", "hex", "hex", 交易哈希)```用当前私钥对32字节哈希签名，返回65字节签名```r‖s‖v```（v为0或1）；```hash```的其它算法（如```"sha256"```）用于计算摘要，功能与```Encode()```函数相同。需要分别取得r、s、v（v为27或28）用于合约校验时，使用```exchange.IO("sign", ...)```，见语法手册`Web3`分类。

## 示例

### 查询TRX与USDT余额，读取代币信息

```javascript
function main() {
    var usdt = "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t"
    var wallet = exchange.IO("address")

    // TRX 余额（标准函数，单位 TRX）
    Log("账户:", exchange.GetAccount())

    // USDT 余额：链上整数，按精度换算
    var raw = exchange.IO("api", "tron", "TRC20ContractBalance", wallet, usdt)
    var decimals = exchange.IO("api", "tron", "TRC20GetDecimals", usdt)
    Log("USDT:", raw / Math.pow(10, decimals))

    // 用 TRC20Call 只读调用 name()（选择器 0x06fdde03），再解析返回的字符串
    var ret = exchange.IO("api", "tron", "TRC20Call", "", usdt, "0x06fdde03", true, 0)
    // constant_result 中是十六进制字符串，直接解析
    Log("名称:", exchange.IO("api", "tron", "ParseTRC20StringProperty", ret.constant_result[0]))
}
```

### 用Multicall合约一次读取多个合约方法

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
    // 注册 Multicall 合约的 aggregate 方法
    exchange.IO("abi", multicall, `[{"inputs":[{"components":[{"internalType":"address","name":"target","type":"address"},{"internalType":"bytes","name":"callData","type":"bytes"}],"internalType":"struct TronMulticall.Call[]","name":"calls","type":"tuple[]"}],"name":"aggregate","outputs":[{"internalType":"uint256","name":"blockNumber","type":"uint256"},{"internalType":"bytes[]","name":"returnData","type":"bytes[]"}],"stateMutability":"view","type":"function"}]`)
    var ret = exchange.IO("api", multicall, "aggregate", calls)
    Log("name:", exchange.IO("decode", "string", ret.returnData[0]))
    Log("decimals:", exchange.IO("decode", "uint8", ret.returnData[1]))
    Log("balanceOf:", exchange.IO("decode", "uint256", ret.returnData[2]))
}
```

See also: `Web3`, `exchange.IO`

## 数据与研究

数据探索和Alpha因子分析工具。

### 数据探索

发明者量化自研的**datadata**是一个量化金融数据平台，发明者量化交易平台的[数据探索](https://www.fmz.com/m/database)模块集成了它的服务和功能，发明者量化用户无需另外注册**datadata**账号即可使用。可以用SQL查询分析海量数据，通过可视化界面生成多种图表，并与团队分享。使用例子可以参考[数据探索模块专题文章](https://www.fmz.com/digest-topic/10370)。

- 数据源：datadata提供的数据源实时、持续更新，涵盖多种类型的数据；也可以上传CSV文件作为私有数据源，并在「数据探索」页面预览。
- 数据查询：用SQL语句查询数据，支持查询参数；查询结果可以下载为CSV或JSON文件。
- 保存研究：点击右上角的「保存」，把当前SQL查询保存到账号「数据探索」的资源列表中（资源列表按钮在「保存」按钮左侧）。
- 数据图形化：查询结果除了以表格展示，还可以用多种可视化组件展示。
- 分享研究：支持公开链接、嵌入代码（例如嵌入平台社区帖子）、嵌入网页、数据链接、预览图链接等形式。用「数据链接」还可以把数据直接提供给策略使用，回测和实盘都支持。

### Alpha因子分析工具

分析公式参考了```worldquant```公开的[```alpha101```](https://github.com/yli188/WorldQuant_alpha101_code/blob/master/101%20Formulaic%20Alphas.pdf)中的行情计算方法，基本兼容其语法（未实现的功能已说明），并进行了增强。该工具用于快速对时间序列进行运算和验证交易想法。[Alpha因子分析工具页面](https://www.fmz.com/m/alpha)。

#### 函数和操作符

**下面的```{}```代表占位符，所有表达式大小写不敏感，x代表数据时间序列**

- ```abs(x), log(x), sign(x)```：分别是绝对值、对数、符号函数。

以下操作符``` +, -, *, /, >, < ```也符合其标准的含义，```==```：是否相等，```||```：逻辑或，```x ? y : z```：三元条件运算符。

- ```rank(x)``` ：横截面排序，返回所在的百分位。需要指定由多个标的组成的候选池；只有单个行情时无法排序，直接返回原值。
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

#### 输入数据

**输入数据不区分大小写，默认数据为网页上选择的品种，也可直接指定，例如：```binance.ada_bnb```**

- ```returns```：收盘价收益率。
- ```open, close, high, low, volume```：周期内的开盘价、收盘价、最高价、最低价和成交量。
- ```vwap```：成交量加权平均价（暂未实现，当前使用收盘价）。
- ```cap```：总市值（暂未实现）。
- ```IndClass```：行业分类（暂未实现）。

#### 其它

支持一次输出多个结果，使用列表形式表示。例如```[sma(close, 10), sma(high, 30)]```将在图表中绘制两条线。除了输入时间序列数据外，还可以作为简单的计算器使用。

## 对外接口

从AI助手或外部程序操作平台：AI接入（MCP服务）、扩展API接口、交易终端插件。

### AI接入

把发明者量化接入Claude Code、Codex、Cursor等AI编程助手（AI agent）后，可以直接用对话完成写策略、回测、创建和管理实盘、查看日志与收益。AI助手通过平台提供的MCP（Model Context Protocol）服务调用这些功能，用的是一把专门为它创建的API KEY，权限由你在授权时决定，随时可以修改或吊销。

**一句话接入**

在AI助手里输入：

```
读 https://www.fmz.com/agent/setup.zh-CN.md 然后接入发明者量化
```

AI助手会按这份说明完成以下步骤，你只需要在浏览器里点一次同意：

1. AI助手向平台申请授权，然后给出一个授权链接（形如```https://www.fmz.com/agent/authorize?code=XXXX-XXXX```），链接10分钟内有效。
2. 在已登录发明者量化的浏览器中打开链接，确认申请者名称和权限后点击同意。可以在页面上取消勾选不想给的权限。
3. AI助手取得API KEY，写入自己的MCP配置并连接。之后就可以直接对它说「列出我的实盘」「给这个策略跑一次回测」。

申请时AI助手会用「名字 @ 机器名」（例如```Claude Code @ MacBook```）作为这把API KEY的名称。同一个名称再次申请并同意时，旧的API KEY会被吊销、换成新的，重复接入不会累积多余的API KEY。

**权限**

| 权限 | 允许的操作 | 默认 |
| - | - | - |
| read | 查看策略、实盘、托管者、交易所账户列表与详情，读取日志、消息、账户概览（不含任何密钥） | 是 |
| backtest | 发起、查询、停止回测 | 是 |
| write | 保存策略与版本、分组、告警开关，修改已停止实盘的配置 | 是 |
| trade | 创建、启动、停止实盘，给实盘发送交互命令（会扣费并真实下单） | 是 |
| danger | 删除策略、实盘、托管者，公开策略 | 否 |

```danger```权限默认不授予，只有AI助手明确申请、并在授权页面勾选时才会获得。AI助手调用```[trade]```或```[danger]```类工具前，应当先向你确认。

**手动配置**

不能执行命令的客户端（例如Cherry Studio）可以手动配置：

1. 在「账号设置 → API KEY」（```https://www.fmz.com/m/account#apikey```）创建API KEY，记下Access Key和Secret Key。
2. 在客户端添加一个MCP服务，类型选Streamable HTTP：
   - URL：```https://www.fmz.com/api/mcp/<Access Key>```
   - 请求头：```Authorization: Bearer <Secret Key>```

Secret Key只能放在请求头里，不能写进URL。各客户端的配置示例：

```bash
# Claude Code
claude mcp add --transport http fmz "https://www.fmz.com/api/mcp/<Access Key>" --header "Authorization: Bearer <Secret Key>"
```

```json
{"mcpServers": {"fmz": {"url": "https://www.fmz.com/api/mcp/<Access Key>", "headers": {"Authorization": "Bearer <Secret Key>"}}}}
```

上面的JSON用于Cursor（```~/.cursor/mcp.json```）等支持Streamable HTTP的客户端；Claude Desktop需要通过```npx mcp-remote```转接，见接入说明原文。

**安装skills（推荐）**

skills是给AI助手阅读的平台知识包：平台操作流程、完整的API文档、各编程语言的策略写法、回测和指标。装上之后AI助手写出的策略更准确。在终端执行：

```bash
npx skills add fmzquant/skills --global --yes -a claude-code
```

```-a```后面填你使用的AI助手名称（claude-code、codex、cursor、gemini-cli等）。也可以直接在GitHub阅读：```https://github.com/fmzquant/skills```。

**可用的工具**

连接后AI助手可以使用以下工具，完整说明以AI助手看到的工具列表为准：

| 权限 | 工具 |
| - | - |
| read | ```ping```、```get_account_summary```、```list_exchanges```、```list_platforms```、```list_nodes```、```list_strategies```、```get_strategy```、```list_strategy_versions```、```get_strategy_version```、```list_robots```、```get_robot```、```get_robot_logs```、```get_robot_profit```、```get_robot_output```、```list_messages```、```list_groups```、```revoke_my_key``` |
| backtest | ```run_backtest```、```get_backtest```、```list_backtests```、```stop_backtest``` |
| write | ```check_strategy```、```save_strategy```、```save_strategy_version```、```delete_strategy_version```、```update_robot```、```save_group```、```move_to_group```、```delete_group```、```set_robot_alert```、```set_node_alert```、```delete_messages``` |
| trade | ```create_robot```、```start_robot```、```stop_robot```、```restart_robot```、```send_robot_command```，以及交易终端插件工具```plugin_*```（查询行情、下单等） |
| danger | ```delete_strategy```、```delete_robot```、```delete_node```、```publish_strategy``` |

一个典型的流程：```list_platforms```和```list_nodes```了解账户里有哪些交易所账户和托管者；```save_strategy```保存策略并用```check_strategy```检查语法；```run_backtest```和```get_backtest```回测；确认后```create_robot```创建实盘，再用```get_robot```、```get_robot_logs```观察运行情况。

**安全与管理**

- 交易所的API KEY不经过AI助手：在网页的「交易所」页面添加，AI助手按编号选择。所有工具的返回结果里都不包含任何密钥。
- 在```https://www.fmz.com/m/account#apikey```可以查看AI助手使用的API KEY，修改权限或锁定。权限除了填写上表的权限名，还可以填工具名，用```!工具名```排除某个工具。
- 不再使用时，让AI助手调用```revoke_my_key```吊销它自己的API KEY，或在上面的页面中删除。
- ```stop_robot```只停止实盘，不会平仓。
- 第一次让AI助手创建实盘时，建议先回测，再用模拟盘或小额资金运行。

**常见问题**

- 提示没有在线托管者：创建实盘需要至少一个在线的托管者，见「平台基础 → 托管者」。
- 提示回测任务过多：同时运行的回测数量有上限，让AI助手先用```stop_backtest```停止不再需要的回测。
- AI助手说没有某个工具，或者调用被拒绝：这把API KEY没有对应的权限，在API KEY页面修改权限后重新连接。

同一把API KEY也可以用于`扩展API接口`，供脚本和定时任务调用；能用MCP的场景优先使用MCP。

### 扩展API接口

扩展API接口是平台的HTTP接口（```https://www.fmz.com/api/v1```），供脚本、定时任务等程序调用平台功能：查询账号、托管者、策略和实盘，创建、重启、停止实盘，向实盘发送交互命令等。

在AI助手（Claude Code、Cursor等）中交互式地操作平台时，优先使用`AI接入`（MCP服务）：工具更全，参数按名称传递，权限可以按类别授予。两者可以使用同一把API KEY。

使用步骤：`创建ApiKey`，按`验证方式`发送请求，方法与参数见`扩展API接口详解`。

#### 创建ApiKey

在[账号设置 → API KEY](https://www.fmz.com/m/account#apikey)页面（```/m/account#apikey```）点击「创建新的ApiKey」，得到一对```AccessKey```和```SecretKey```。```SecretKey```代表这把API KEY的全部权限，不要泄露。在该页面也可以修改已有API KEY的权限，或者禁用、删除API KEY。

**权限**

创建或修改时，在「API权限」输入框中填写逗号分隔的列表：

- ```*```：允许全部扩展API接口。
- 方法名：只允许列出的方法，例如```GetRobotList,GetRobotDetail,CommandRobot```。
- ```!方法名```：排除某个方法，通常与```*```搭配，例如```*,!DeleteRobot,!DeleteNode```。

同一把API KEY也可以用于`AI接入`（MCP服务）。MCP工具除了按工具名授权，还可以按权限类别授权：```read```、```backtest```、```write```、```trade```、```danger```（含义见AI接入页面），同样支持用```!名称```排除。权限类别只对MCP工具生效；扩展API接口只认方法名和```*```。

权限留空时，扩展API接口不限制方法（MCP开放```danger```以外的全部工具）。建议按用途只授予需要的方法，例如只用于TradingView警报的API KEY只授予```CommandRobot```。

#### 验证方式

调用扩展API接口时有两种验证方式：

- `签名验证`：用```SecretKey```对请求参数签名，```SecretKey```本身不在网络上传输。程序调用应使用这种方式。
- `直接验证`：把```SecretKey```直接放进请求URL，主要用于TradingView等只能填写一个URL的Webhook场景。

##### 签名验证

**请求格式**

向```https://www.fmz.com/api/v1```发送```POST```请求，参数以表单（```application/x-www-form-urlencoded```）提交。服务端也接受把同样的参数放在URL查询串中的```GET```请求，但参数会留在各处的访问日志里，推荐使用```POST```。

| 参数 | 说明 |
| - | - |
| version | 版本号，固定为```1.0```。 |
| access_key | API KEY的```AccessKey```。 |
| method | 调用的方法名，例如```GetNodeList```。 |
| args | 方法参数组成的JSON字符串：按顺序排列的数组（如```[]```、```[123, "ok"]```），或按参数名传值的对象（如```{"robotId": 123}```），见`扩展API接口详解`。不传时按```[]```处理。 |
| nonce | 毫秒时间戳。与服务器时间相差不能超过1小时，并且必须大于这把API KEY上一次请求使用的```nonce```。 |
| sign | 签名，计算方法见下文。 |

请求中不包含```SecretKey```。

**签名方式**

按下面的格式拼接字符串，其中```args```是实际提交的JSON字符串原文：

```plaintext
version + "|" + method + "|" + args + "|" + nonce + "|" + secretKey
```

对拼接结果计算MD5，转换为32位小写十六进制字符串，作为```sign```的值。

**Python示例**

```python
import hashlib
import json
import time
import urllib.parse
import urllib.request

ACCESS_KEY = ''   # API KEY 的 AccessKey
SECRET_KEY = ''   # API KEY 的 SecretKey

def api(method, *args, **kwargs):
    d = {
        'version': '1.0',
        'access_key': ACCESS_KEY,
        'method': method,
        # 位置参数传数组，关键字参数传对象（按参数名传值）
        'args': json.dumps(kwargs if kwargs else list(args)),
        'nonce': int(time.time() * 1000),
    }
    s = '%s|%s|%s|%d|%s' % (d['version'], d['method'], d['args'], d['nonce'], SECRET_KEY)
    d['sign'] = hashlib.md5(s.encode('utf-8')).hexdigest()
    body = urllib.parse.urlencode(d).encode('utf-8')
    with urllib.request.urlopen('https://www.fmz.com/api/v1', body, timeout=10) as resp:
        return json.loads(resp.read().decode('utf-8'))

print(api('GetNodeList'))                             # 托管者列表
print(api('GetRobotList', appId='member2'))           # 按参数名传值：标签为 member2 的实盘
print(api('CommandRobot', 123, 'ok'))                 # 向实盘 123 发送交互命令
print(api('GetRobotDetail', 123))                     # 实盘 123 的详细信息
```

**Go示例**

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
    accessKey = "" // API KEY 的 AccessKey
    secretKey = "" // API KEY 的 SecretKey
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

    // 用新的配置重启实盘 123，settings 字段见「扩展API接口详解」中的实盘配置说明
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

##### 直接验证

直接验证不计算签名，而是把```secret_key```直接放在请求参数中，因此可以生成一个固定的URL，填到TradingView等只能设置一个URL的Webhook回调里。

> **安全提示**：```secret_key```写在URL中，会留在浏览器历史、代理和服务器的访问日志、Webhook服务方的配置里，任何拿到这个URL的人都能以这把API KEY的权限调用接口。建议只在```CommandRobot```的Webhook中使用直接验证，并为它单独创建一把只授权```CommandRobot```的API KEY（见`创建ApiKey`）；一旦泄露，立即删除这把API KEY。

请求参数为```access_key```、```secret_key```、```method```、```args```（JSON数组，需要URL编码），不需要```version```、```nonce```、```sign```。```CommandRobot```不做```nonce```校验；其他方法仍会校验：不传```nonce```时服务器以当前时间（精确到秒）代替，同一秒内的第二次调用会返回Nonce错误（```code```为3）。

例如API KEY的```AccessKey```为```xxx```、```SecretKey```为```yyy```，访问下面的URL即可向Id为```186515```的实盘发送交互命令```ok12345```：

```plaintext
https://www.fmz.com/api/v1?access_key=xxx&secret_key=yyy&method=CommandRobot&args=%5B186515%2C%22ok12345%22%5D
```

**接收Webhook请求体**

```CommandRobot```的命令参数为空字符串、请求为```POST```时，服务器把请求体（Body）作为交互命令发给实盘。例如在TradingView的Webhook URL中设置：

```plaintext
https://www.fmz.com/api/v1?access_key=xxx&secret_key=yyy&method=CommandRobot&args=%5B186515%2C+%22%22%5D
```

其中```args```的值```%5B186515%2C+%22%22%5D```解码后为```[186515, ""]```（```+```是URL编码中的空格），```186515```是实盘Id，命令为空字符串。

模拟TradingView发送Webhook警报：

```js
function main() {
    var options = {
        method: "POST",
        body: `{"test": 123}`,
        headers: {"Content-Type": "application/json"}
    }

    // Webhook 警报会自动发送 POST 请求，并带上需要的 headers
    return HttpQuery("https://www.fmz.com/api/v1?access_key=xxx&secret_key=yyy&method=CommandRobot&args=%5B186515%2C+%22%22%5D", options)
}
```

TradingView警报消息框中的内容就是请求体：

- JSON格式：

  ![](https://www.fmz.com/upload/asset/16d8a37ef80d9ccd0079.png)

  ```plaintext
  {"close": {{close}}, "name": "aaa"}
  ```

  Id为```186515```的实盘收到交互命令：```{"close": 39773.75, "name": "aaa"}```。

- 文本格式：

  ![](https://www.fmz.com/upload/asset/16d8a506dfbb6c60a077.png)

  ```plaintext
  BTCUSDTPERP 穿过(Crossing) 39700.00 close: {{close}}
  ```

  Id为```186515```的实盘收到交互命令：```BTCUSDTPERP 穿过(Crossing) 39700.00 close: 39739.4```。

**Python、Go示例**

```python
import json
import urllib.parse
import urllib.request

ACCESS_KEY = ''   # 只授权了 CommandRobot 的 API KEY 的 AccessKey
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

# API KEY 没有该方法的权限时返回 {'code': 4, 'data': None}
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
    accessKey = "" // 只授权了 CommandRobot 的 API KEY 的 AccessKey
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

参考：

- [使用发明者量化交易平台扩展API实现TradingView报警信号交易](https://www.fmz.com/digest-topic/5533)
- [使用发明者量化交易平台扩展API实现TradingView报警信号交易（B站视频）](https://www.bilibili.com/video/BV1Wk4y1k7zz/)

#### 扩展API接口详解

所有方法都通过```https://www.fmz.com/api/v1```调用，请求格式与签名见`签名验证`，返回结构与错误码见`扩展API接口返回码`。各方法页面示例中的```api()```即签名验证页面Python示例中的函数。

**方法一览**

| 对象 | 方法 | 参数（按顺序，方括号内可省略） | 说明 | 注意 |
| - | - | - | - | - |
| 账号 | GetAccount | 无 | 账号信息 | 只读 |
| 托管者 | GetNodeList | [offset, limit] | 托管者列表 | 只读 |
| 托管者 | DeleteNode | nid | 删除托管者 | 删除，不可恢复 |
| 交易所 | GetExchangeList | isSummary | 平台支持的交易所及配置项 | 只读 |
| 交易所 | GetPlatformList | [offset, limit] | 已添加的交易所账户 | 只读 |
| 策略 | GetStrategyList | offset, length, strategyType, category, language, kw[, groupId, orderBy] | 策略列表 | 只读 |
| 实盘 | GetRobotGroupList | 无 | 实盘分组 | 只读 |
| 实盘 | GetRobotList | [offset, length, customStatus, appId, kw, groupId, orderBy, strategyId] | 实盘列表 | 只读 |
| 实盘 | GetRobotDetail | robotId | 实盘详细信息 | 只读 |
| 实盘 | GetRobotLogs | robotId, logMinId, …, summaryLimit[, logExchange, logKeyword, logTypes] | 日志、收益、图表与状态栏数据 | 只读 |
| 实盘 | NewRobot | settings | 创建并启动实盘 | 扣费；实盘会真实交易 |
| 实盘 | RestartRobot | robotId[, settings] | 启动（重启）实盘 | 扣费；实盘会真实交易 |
| 实盘 | StopRobot | robotId | 停止实盘 | 不会平仓 |
| 实盘 | CommandRobot | robotId, cmd | 向实盘发送交互命令 | 策略可能据此下单 |
| 实盘 | DeleteRobot | robotId[, removeLog] | 删除实盘 | 删除，不可恢复 |
| 调试 | PluginRun | settings | 在托管者上执行一段代码 | 代码可以真实下单 |

API KEY需要有对应方法的权限，见`创建ApiKey`。

**参数传法**

```args```有两种写法：

- 数组：按上表的顺序传位置参数，例如```[123, "ok"]```。
- 对象：按参数名传值，例如```{"robotId": 123, "cmd": "ok"}```。参数名不区分大小写、忽略下划线，没有传的参数取默认值。可选参数多的方法（GetRobotList、GetRobotLogs、GetStrategyList）建议用这种写法。

**实盘配置（settings）**

NewRobot、RestartRobot、PluginRun的```settings```参数是一个JSON对象，常用字段如下：

| 字段 | 说明 |
| - | - |
| name | 实盘名称。 |
| strategy | 策略Id，可用GetStrategyList查询。RestartRobot不能更换实盘的策略。 |
| args | 策略参数，每个元素为```["参数名", 值]```，例如```[["Interval", 500]]```；策略没有参数时为```[]```。 |
| exchanges | 交易所对象配置数组，每个元素对应一个交易所对象，写法见下文。 |
| period | 默认K线周期，单位为秒，例如```60```、```3600```。 |
| node | 运行实盘的托管者Id，可用GetNodeList查询；不写或为```-1```时自动分配。 |
| group | 实盘分组Id，可用GetRobotGroupList查询。 |
| appid | 自定义标签，GetRobotList可以按标签筛选。 |

```exchanges```的元素有两种写法，同一个数组中不能混用（以第一个元素的写法为准）：

- 引用平台上已添加的交易所账户：```{"pid": 123, "pair": "BTC_USDT"}```。```pid```可用GetPlatformList查询（返回数据中的```id```）。
- 直接传入交易所配置：```{"eid": "Binance", "label": "test", "pair": "BTC_USDT", "meta": {"AccessKey": "...", "SecretKey": "..."}}```。```eid```为交易所Id；```meta```的字段名见GetExchangeList返回的```meta```；```label```是交易所对象的标签，策略中用```exchange.GetLabel()```获取。平台不保存```meta```中的密钥，而是直接转发给托管者，所以用这种写法创建的实盘，每次重启时都必须重新传入```settings```。

通用协议交易所的写法：```{"eid": "Exchange", "label": "test", "pair": "BTC_USDT", "meta": {"AccessKey": "...", "SecretKey": "...", "Front": "http://127.0.0.1:6666/test"}}```，```Front```为通用协议服务的地址。

###### GetAccount

```GetAccount```方法用于获取请求中的```API KEY```对应的发明者量化交易平台账号的账户信息。

Parameters:

无参数

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

- balance: 账户余额，单位为USD。为了控制精度使用整数表示，除以1e8（10的8次方）得到实际数值，示例中为229.44702436。
- consumed: 累计消费金额，单位与换算方式同```balance```。

###### GetNodeList

```GetNodeList```方法用于获取请求中的```API KEY```对应的平台账号可以使用的托管者列表，包括自己的托管者和平台的公共托管者。

Parameters:

- `offset` (number, optional): 分页偏移，默认为0。
- `limit` (number, optional): 每页数量；不传或小于等于0时返回全部。

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

返回值字段说明（字面意思较明显的不再赘述）：
- all: 托管者总数（包括公共托管者）。
- nodes: 记录托管者节点详细信息。
  - build: 版本号。
  - city: 所在城市。
  - is_owner: true表示是私有托管者，false表示是公共托管者。
  - loaded: 负载，搭载策略实例的个数。
  - public: 0表示私有托管者，1表示公共托管者。
  - region: 地理位置。
  - version: 托管者详细版本信息。
  - wd: 是否开启离线报警，0表示未开启。

一键部署的托管者包含一些额外信息，字段以```ecs_```、```unit_```前缀开头，记录了一键部署托管者服务器的相关信息（运营商名称、配置、状态等），计费周期、价格等信息，不再赘述。

###### DeleteNode

```DeleteNode```方法用于删除请求中```API KEY```对应的发明者量化交易平台账号下的托管者节点，删除的托管者节点ID为```nid```参数指定的托管者ID。

Parameters:

- `nid` (number, required): ```nid```参数用于指定要删除的托管者ID，可通过```GetNodeList```方法获取账号下托管者的信息。

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

- result: 是否成功删除关联的托管者程序。

###### GetExchangeList

```GetExchangeList```方法用于获取FMZ量化交易平台支持的交易所列表及其配置信息。

Parameters:

- `isSummary` (bool, required): ```isSummary```参数用于指定返回的数据是否为摘要信息。

Returns:

```isSummary```参数为```false```时，返回的数据：

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

```isSummary```参数为```true```时，返回的数据：

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

- meta: 交易所配置元数据。

###### GetPlatformList

```GetPlatformList```方法用于获取请求中的```API KEY```对应的发明者量化交易平台账号下的已添加的交易所列表。

Parameters:

- `offset` (number, optional): 分页偏移，默认为0。
- `limit` (number, optional): 每页数量；不传或小于等于0时返回全部。

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

- all: 已添加/配置的交易所对象个数。
- platforms: 交易所相关信息。
  - eid: 在发明者量化交易平台上交易所的Id，一些配置、参数中会使用到```eid```。

###### GetStrategyList

```GetStrategyList```方法用于获取平台策略信息。

Parameters:

- `offset` (number, required): 分页偏移。
- `length` (number, required): 每页数量；小于等于0时返回全部。
- `strategyType` (number, required): 查询范围：
- ```-1```：自己的策略和租用的策略（含官方策略）。
- ```0```：自己的策略和租用的策略（不含官方策略）。
- ```-3```：只查自己的策略。
- ```-6```：只查租用的策略（含已过期的）。
- ```-4```：官方策略。
- ```-2```：策略广场中公开的策略和付费策略。
- ```1```：已公开的策略。
- ```2```：待审核的策略。
- `category` (number, required): 策略类型：
- ```-1```：全部。
- ```0```：普通策略。
- ```20```：模板类库。
- ```21```：交易插件。
- `language` (number, required): 策略的编程语言：
- ```-1```：全部语言。
- ```0```：JavaScript（TypeScript策略也按JavaScript保存，源码中带```//@ts-check```）。
- ```1```：Python。
- ```3```：Blockly可视化。
- ```4```：My语言。
- ```5```：PINE语言。
- ```6```：Workflow工作流。
- ```7```：Rust。
- `kw` (string, required): 按策略名称模糊匹配的关键字，多个词用空格分隔；空字符串表示不筛选。以```id:```开头时按策略Id查询，例如```id:123,456```。
- `groupId` (number, optional): 策略分组：```-1```全部（默认），```0```未分组，大于0为指定分组。只对自己的策略生效。
- `orderBy` (string, optional): 排序字段：```name```、```last_modified```、```date```，可在后面加``` asc```表示升序（默认降序）；空字符串为默认排序。

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

- all: 筛选查询出的策略总数。
- strategies: 查询出的具体策略信息，其中```category```、```language```的取值同上面的参数说明。

参数中没有```needArgs```。按旧版文档在```category```之后多传一个参数，会使后面的参数错位，请按上面的顺序传参，或按参数名传值：

```plaintext
api('GetStrategyList', 0, 10, -3, -1, -1, '')           # 自己的前10个策略
api('GetStrategyList', strategyType=-3, language=7)     # 自己的全部Rust策略
```

###### GetRobotGroupList

```GetRobotGroupList```方法用于获取请求中的```API KEY```对应的发明者量化交易平台账号下的实盘分组列表。

Parameters:

无参数

Returns:

```json
{
    "code": 0,
    "data": {
        "result": {
            "items": [{
                "id": 3417,
                "name": "测试"
            }, {
                "id": 3608,
                "name": "实盘演示"
            }]
        },
        "error": null
    }
}
```

- items: 实盘分组信息。
  - id: 实盘分组Id。
  - name: 实盘分组名称。

```items```字段只记录创建的新分组，「默认」分组不在```items```中。

###### GetRobotList

```GetRobotList```方法用于获取请求中的```API KEY```对应的平台账号下的实盘列表。参数都可以省略。

Parameters:

- `offset` (number, optional): 分页偏移，默认为0。
- `length` (number, optional): 每页数量；小于等于0时返回全部（默认）。
- `customStatus` (number, optional): 按实盘状态码筛选，见`实盘状态码`；```-1```为全部实盘（默认），```-2```为全部实盘并按启动时间排序。
- `appId` (string, optional): 按实盘的自定义标签（创建时```settings```中的```appid```）筛选，空字符串表示不筛选。
- `kw` (string, optional): 按实盘名称模糊匹配的关键字，空字符串表示不筛选。
- `groupId` (number, optional): 实盘分组：```-1```全部（默认），```0```未分组，大于0为指定分组。
- `orderBy` (string, optional): 排序字段：```name```、```status```、```node```、```profit```、```date```、```refresh```、```start_time```、```strategy_name```，可在后面加``` asc```表示升序（默认降序）；空字符串为默认排序。
- `strategyId` (number, optional): 大于0时只返回该策略的实盘，默认为0（不筛选）。

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
                "name": "测试",
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
                "strategy_name": "测试",
                "strategy_public": 0,
                "uid": "105ed6e511cc977921610fdbb7e2a1d6",
                "wd": 0
            }]
        },
        "error": null
    }
}
```

- all: 符合条件的实盘总数。
- robots: 实盘信息，```status```为实盘状态码。
  - group_id: 实盘分组Id；如果策略实盘在默认分组中则没有```group_id```字段。

以签名验证页面Python示例中的```api()```为例：

- ```api('GetRobotList')```：获取全部实盘。
- ```api('GetRobotList', 'member2')```：只传一个字符串时视为标签，获取标签为member2的全部实盘。
- ```api('GetRobotList', 0, 100, -1, 'member2', '')```：按位置传参，从第0条开始最多获取100个标签为member2的实盘。
- ```api('GetRobotList', appId='member2', length=100)```：按参数名传值，效果同上。

###### GetRobotDetail

```GetRobotDetail```方法用于获取请求中的```API KEY```对应的发明者量化交易平台账号下的实盘详细信息，所要被获取详细信息的实盘Id为```robotId```参数指定的实盘Id。

Parameters:

- `robotId` (number, required): ```robotId```参数用于指定所要获取详细信息的实盘Id，可以用```GetRobotList```方法获取账号下实盘的信息，其中包含实盘Id。

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
                "name": "测试",
                "node_id": 123,
                "pexchanges": {
                    "123": "Futures_OKX"
                },
                "phash": {
                    "123": "ca1aca74b9cf7d8624f2af2dac01e36d"
                },
                "plabels": {
                    "123": "OKX期货"
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
                "strategy_name": "测试",
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

- charge_time: 下次扣费时间（Unix时间戳，秒），即当前已付费时段的截止时间。
- charged: 累计计费时长，单位为秒。
- consumed: 累计扣费金额，单位为USD，按1e8放大为整数，示例中5375000000即53.75 USD。
- date: 创建日期。
- fixed_id: 实盘运行时指派的托管者ID，如果是自动，该值为-1。
- is_manager: 是否有权限管理该实盘。
- is_sandbox: 是否是模拟盘。
- name: 实盘名称。
- node_id: 托管者ID。
- pexchanges: 实盘配置的交易所对象，123为pid，"Futures_OKX"为交易所Id（eid）。
- plabels: 实盘配置的交易所对象的标签信息。
- profit: 实盘收益数据。
- public: 实盘是否公开。
- refresh: 最近活跃时间。
- strategy_exchange_pairs: 配置的交易所对象，设置的交易对信息。
- wd: 是否开启离线报警。

```strategy_exchange_pairs```属性说明，用以下数据为例：

```plaintext
"[60,[44314,42960,15445,14703],[\"BTC_USDT\",\"BTC_USDT\",\"ETH_USDT\",\"ETH_USDT\"]]"
```

其中第一个数据```60```，代表实盘设置的默认K线周期为1分钟，即60秒。

```[44314,42960,15445,14703]```为实盘配置的交易所对象的```pid```（按添加顺序）。

```[\"BTC_USDT\",\"BTC_USDT\",\"ETH_USDT\",\"ETH_USDT\"]```为实盘配置的交易所对象设置的交易对（按添加顺序与pid一一对应）。

###### GetRobotLogs

```GetRobotLogs```方法用于获取请求中的```API KEY```对应的发明者量化交易平台账号下的实盘日志信息，所要被获取日志信息的实盘Id为```robotId```参数指定的实盘Id。

Parameters:

- `robotId` (number, required): ```robotId```参数用于指定所要获取日志信息的实盘Id，可以用```GetRobotList```方法获取账号下实盘的信息，其中包含实盘Id。
- `logMinId` (number, required): ```logMinId```参数用于指定Log日志的最小Id。
- `logMaxId` (number, required): ```logMaxId```参数用于指定Log日志的最大Id。
- `logOffset` (number, required): ```logOffset```参数用于设置偏移，由```logMinId```和```logMaxId```确定范围后，根据```logOffset```偏移（跳过多少条记录），开始作为获取数据的起始位置。
- `logLimit` (number, required): ```logLimit```参数用于设置确定起始位置后，选取的数据记录条数。
- `profitMinId` (number, required): ```profitMinId```参数用于设置收益日志的最小Id。
- `profitMaxId` (number, required): ```profitMaxId```参数用于设置收益日志的最大Id。
- `profitOffset` (number, required): ```profitOffset```参数用于设置偏移（跳过多少条记录），作为起始位置。
- `profitLimit` (number, required): ```profitLimit```参数用于设置确定起始位置后，选取的数据记录条数。
- `chartMinId` (number, required): ```chartMinId```参数用于设置图表数据记录的最小Id。
- `chartMaxId` (number, required): ```chartMaxId```参数用于设置图表数据记录的最大Id。
- `chartOffset` (number, required): ```chartOffset```参数用于设置偏移。
- `chartLimit` (number, required): ```chartLimit```参数用于设置获取的记录条数。
- `chartUpdateBaseId` (number, required): ```chartUpdateBaseId```参数用于设置查询更新后的基础Id。
- `chartUpdateDate` (number, required): ```chartUpdateDate```参数用于设置数据记录更新时间戳，会筛选出比这个时间戳大的记录。
- `summaryLimit` (number, required): ```summaryLimit```参数用于设置查询的状态栏数据字节数。查询实盘的状态栏数据，该参数类型为整型。
设置0表示不需要查询状态栏信息，设置为非0表示需要查询的状态栏信息字节数（该接口不限制数据量，可以指定一个较大的summaryLimit参数来获取所有状态栏信息），状态栏数据储存在返回的数据的```summary```字段中。
- `logExchange` (string, optional): 只返回该交易所对象（按标签）的日志，空字符串表示不筛选。
- `logKeyword` (string, optional): 只返回日志内容包含该关键字的日志，空字符串表示不筛选。
- `logTypes` (string, optional): 只返回这些类型的日志，日志类型号用逗号分隔，例如```"0,1,2"```只看买单、卖单、撤单日志；空字符串表示全部类型。

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

- logs: 日志信息；查询出的若干条日志数据在Arr字段中。
  logs中第一个数据结构为实盘数据库中策略日志表中的日志记录。
  logs中第二个数据结构为实盘数据库中收益日志表中的日志记录。
  logs中第三个数据结构为实盘数据库中图表日志表中的日志记录。
- summary: 实盘状态栏数据。

- 数据库中的策略日志表
  返回数据中```logs```的属性值（数组结构）的第一个元素中（日志数据）```Arr```属性值描述如下：

  ```plaintext
  "Arr": [
      [3977, 3, "Futures_OKX", "", 0, 0, "Sell(688.9, 2): 20016", 1526954372591, "", ""],
      [3976, 5, "", "", 0, 0, "this_week 仓位过多, 多: 2", 1526954372410, "", ""]
  ],
  ```

  | id | logType | eid | orderId | price | amount | extra | date | contractType | direction |
  | - | - | - | - | - | - | - | - | - | - |
  | 3977 | 3 | "Futures_OKX" | "" | 0 | 0 | "Sell(688.9, 2): 20016" | 1526954372591 | "" | "" |
  | 3976 | 5 | "" | "" | 0 | 0 | "this_week 仓位过多, 多: 2" | 1526954372410 | "" | "" |

  ```extra```为打印的日志的附加消息。

  ```logType```值具体代表的日志类型描述如下：

  | logType: | 0 | 1 | 2 | 3 | 4 | 5 | 6 |
  | - | - | - | - | - | - | - | - |
  | logType意义: | BUY | SALE | RETRACT | ERROR | PROFIT | MESSAGE | RESTART |
  | 中文意义 | 买单类型日志 | 卖单类型日志 | 撤销 | 错误 | 收益 | 日志 | 重启 |

- 数据库中的收益图表日志表
  该图表日志表数据与策略日志表中的收益日志一致。

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

  ```202```为日志Id，```2515.44```为收益数值，```1575896700315```为时间戳。
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

  ```23637```为日志Id，```0```为图表数据系列索引，最后的数据```"{\"close\":648,\"high\":650.5,\"low\":647,\"open\":650,\"x\":1575960300000}"```为日志数据，这条数据为图表上的K线数据。

###### NewRobot

```NewRobot```方法用于在请求中的```API KEY```对应的平台账号下创建一个实盘并启动运行，与在网页上创建实盘一样会扣费。

Parameters:

- `settings` (JSON对象, required): 实盘配置，字段见`扩展API接口详解`中的「实盘配置（settings）」。例如：

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

- result: 创建成功时为新实盘的Id；失败时为负数，含义同`实盘状态码`中的异常代码（例如```-2```没有找到托管者，```-5```余额不足）。

用```eid```方式直接传入交易所配置时，平台不保存```meta```中的密钥，之后每次用```RestartRobot```重启这个实盘都必须传入```settings```。

###### RestartRobot

```RestartRobot```方法用于启动（重启）请求中的```API KEY```对应的平台账号下的实盘，实盘Id由```robotId```参数指定。启动会扣费。

Parameters:

- `robotId` (number, required): 实盘Id，可以用```GetRobotList```方法查询。
- `settings` (JSON对象, optional): 实盘配置，字段见`扩展API接口详解`中的「实盘配置（settings）」。传入时先用它更新实盘的配置（名称、参数、交易所、K线周期、托管者、分组），再启动；不能更换策略。

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

- result: 实盘状态码，1即运行中。

在平台页面创建、使用已添加交易所账户（```pid```）的实盘，可以只传```robotId```，按实盘当前的配置启动。用```eid```方式直接传入交易所配置的实盘（通常由扩展API接口创建），平台没有保存密钥，每次重启都必须传入```settings```。

###### StopRobot

```StopRobot```方法用于停止请求中```API KEY```对应的发明者量化交易平台账号下的实盘。停止运行的实盘Id由```robotId```参数指定。

Parameters:

- `robotId` (number, required): ```robotId```参数用于指定要停止的实盘Id。可以通过```GetRobotList```方法获取账号下的实盘信息，其中包含实盘Id。

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

- result: 实盘状态码，2表示停止中。

###### CommandRobot

```CommandRobot```方法用于向请求中的```API KEY```对应的发明者量化交易平台账号下的实盘发送交互命令，接收交互命令的实盘Id为```robotId```参数指定的实盘Id，交互命令由策略中调用的```GetCommand()```函数捕获返回。

Parameters:

- `robotId` (number, required): ```robotId```参数用于指定接收交互指令的实盘Id，可以用```GetRobotList```方法获取账号下实盘的信息，其中包含实盘Id。
- `cmd` (string, required): 发送给实盘的交互命令，策略中用```GetCommand()```函数获取，见`GetCommand`。

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

- result: 交互指令是否发送成功；向一个没有运行的实盘发送指令，返回的数据中result为false。

实盘策略，假设这个策略实盘处于运行中，实盘Id为123：
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

用签名验证页面Python示例中的```api()```调用```api("CommandRobot", 123, "test command")```，Id为123的实盘会收到交互指令：```test command```，然后通过Log函数输出打印出来。

###### DeleteRobot

```DeleteRobot```方法用于删除请求中的```API KEY```对应的平台账号下的实盘，实盘Id由```robotId```参数指定。运行中的实盘需要先停止才能删除。删除后不可恢复。

Parameters:

- `robotId` (number, required): 要删除的实盘Id，可以用```GetRobotList```方法查询。
- `removeLog` (bool, optional): 是否同时删除托管者上的实盘日志数据，默认为```true```。

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

- result: 删除操作的结果。
  - 0：删除成功。
  - -1：没有删除：实盘不存在，或者仍在运行、启动中、停止中。
  - -2：实盘已删除，但无法与实盘所在的托管者联系，日志数据没有删除；需要到托管者目录```logs/storage/<实盘Id>/```下手动删除（例如```123.db3```）。

###### PluginRun

```PluginRun```方法在托管者上执行一段JavaScript代码并返回结果，与开发工具中的「调试工具」、交易终端插件使用同一种执行机制（见`插件原理与编写`）。执行时不创建实盘、不计费，单次执行最长5分钟。

Parameters:

- `settings` (JSON对象, required): 执行配置，例如：

```json
{
    "source": "function main() {Log(\"Hello FMZ\")}",
    "node": 123,
    "period": 60,
    "exchanges": [{"pid": 123, "pair": "SOL_USDT"}]
}
```

- source：要执行的代码。入口为```main()```，其返回值就是执行结果。
- strategy：不传```source```时，执行账号中这个Id的策略（例如交易插件）。
- node：执行代码的托管者Id；不写或为```-1```时自动选择。
- exchanges：交易所对象配置，写法同`扩展API接口详解`中的「实盘配置（settings）」。

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

- result: 执行结果，是一个JSON字符串：```logs```为代码中```Log()```输出的日志，```result```为```main()```返回值的JSON文本。

```exchanges```也可以不引用平台上的交易所账户，直接传入交易所配置，例如：

```plaintext
{"eid": "Binance", "pair": "ETH_BTC", "meta": {"AccessKey": "...", "SecretKey": "..."}}
```

```meta```的字段名见```GetExchangeList```返回的```meta```。```exchanges```中通常只设置一个交易所对象（调试工具页面也只支持一个）；设置两个不会报错，但代码中访问第二个交易所对象时会报错。

#### 扩展API接口返回码

扩展API接口返回的结构如下：

```json
{
    "code": 0,
    "data": {
        "result": null,
        "error": null
    }
}
```

```code```是请求本身的状态码：

| 描述 | 代码 |
| - | - |
| 执行成功 | 0 |
| 错误的API KEY：```AccessKey```不存在或已禁用；直接验证时```secret_key```不正确 | 1 |
| 错误的签名 | 2 |
| Nonce错误：```nonce```不大于上次请求的值，或与服务器时间相差超过1小时 | 3 |
| 方法不正确：方法不存在、不对外开放，或这把API KEY没有该方法的权限 | 4 |
| 参数不正确：```args```不是合法的JSON，或调用失败 | 5 |
| 内部未知错误 | 6 |
| 请求来源IP不在这把API KEY的IP白名单内 | 7 |

```code```为0只表示请求被受理。方法的结果在```data.result```中；方法执行出错时，```data.error```为错误信息（成功时为```null```）。例如参数个数不对：

```json
{
    "code": 0,
    "data": {
        "result": null,
        "error": "Params number mismatch for StopRobot: expected 1, got 0"
    }
}
```

#### 实盘状态码

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

### 交易终端

平台提供模块化、可定制的[交易终端](https://www.fmz.com/m/trade)页面：可以自由添加行情、交易等各种模块，模块可以拖动、缩放，可以修改模块绑定的交易所、交易对，同一类模块可以添加多个，方便手动交易和半程序化交易。

交易终端还支持交易插件：自己编写一段代码作为模块，在选定的托管者上执行，辅助手动交易。

#### 插件原理与编写

**原理**

交易插件是一段在托管者上执行的短代码：在交易终端页面点击「执行」时，平台把插件代码和模块选定的交易所账户发送到选定的托管者执行，执行结束后把返回值显示在模块中。下面几个入口使用同一种执行机制：

| 入口 | 执行的代码 | 说明 |
| - | - | - |
| 交易终端插件 | 策略库中类型为「交易插件」的策略 | 在交易终端页面添加、执行 |
| 调试工具（开发工具） | 页面中临时编写的JavaScript代码 | 用于测试API调用 |
| 扩展API接口`PluginRun` | 请求中的```source```，或账号中已有的策略 | 供程序调用 |
| MCP的```plugin_*```工具 | 平台内置的查询行情、下单等函数 | 供AI助手调用，按```trade```权限授权，见`AI接入` |

这种执行方式不创建实盘、不计费，单次执行最长5分钟，超时中断。适合辅助手动交易的简单任务，例如冰山委托、批量挂单撤单、计算；需要长期运行的逻辑应创建实盘。

**编写**

在新建策略页面把策略类型设置为「交易插件」即可创建交易插件。交易插件、调试工具和```PluginRun```都只支持JavaScript。

插件的入口是```main()```，返回值就是执行结果：返回表格对象、图表对象时，在模块中显示为表格、图表（示例见`插件示例`）。插件中```Log()```输出的日志不会在模块中显示。

**使用**

- 添加：在交易终端页面打开模块添加菜单，账号策略库中的交易插件会出现在列表中，选择需要的插件添加。
- 执行：点击插件模块中的「执行」运行插件。

**数据目录**

插件和调试工具在托管者上执行时，以托管者运行目录下的```logs/storage/p<数字>/```为工作目录（每个平台账号一个以```p```开头的目录，第一次执行后创建）。如果交易终端使用的交易所账户以密钥文件路径（```file:///xxx.txt```）的方式配置密钥，需要把密钥文件放在这个目录中。

#### 插件示例

插件可以在一段时间内执行代码，完成一些简单的操作，例如冰山委托、挂单、撤单、计算等。插件用```return```返回结果，返回表格、图表对象时直接显示为表格、图表。下面是两个例子，更多范例可以在**策略广场**中查找，例如逐笔小量买入/卖出。

**返回深度快照**

以表格显示当前盘口前15档：

```js
// 返回深度快照
function main() {
    var tbl = {
        type: 'table',
        title: '深度快照 @ ' + _D(),
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

**画跨期差价**

期货交易所对象上，取季度合约与当周合约的5分钟K线，画出收盘价差：

```js
// 画跨期差价
var chart = {
    __isStock: true,
    title: {text: '差价分析图'},
    xAxis: {type: 'datetime'},
    yAxis: {
        title: {text: '差价'},
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
