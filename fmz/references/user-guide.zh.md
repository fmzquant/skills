# FMZ 平台使用指南

由 https://www.fmz.com/user-guide 生成：平台如何运作（托管者、实盘、策略、模板、回测、扩展 API、MCP），面向人写的说明；agent 用它理解概念与限制。

## 入门

第一次使用先读这里：认识平台，按六个步骤从注册走到运行第一个实盘，并做好交易所密钥的安全设置。

### 欢迎使用发明者量化交易平台

发明者量化交易平台（FMZ量化）是一个量化交易平台：在网页上编写策略、在线回测，然后在自己部署或租用的托管者上运行实盘；也可以在策略广场学习、分享、出租策略，或公开展示自己的实盘。

#### 支持的市场
- 加密货币：主流中心化交易所的现货、期货与永续合约，以及部分链上交易所。
- 证券与期货：富途证券、盈透证券（Interactive Brokers）等。
- 平台尚未对接的交易所，可以通过`通用协议`自行接入。

#### 支持的策略语言
JavaScript、Python、Rust、PINE、My语言（麦语言）和Workflow工作流，见`编程语言`。

#### AI 辅助
- 策略编辑器内置`AI助手`，可以生成、解释、修改策略代码并分析回测结果。
- 也可以把自己使用的外部 AI 助手接入平台，通过对话管理策略、回测和实盘，见`AI接入`。

#### 控制台
注册并登录后进入[控制台](https://www.fmz.com/m)：

![控制中心概览](https://www.fmz.com/upload/asset/2e4e636a6fe51c8f620e8.png)

- [控制中心](https://www.fmz.com/m/dashboard)：账户概况和常用功能入口。运行一个实盘需要三样东西：一个在线的托管者、一个策略、一个配置好的交易所账户。
- [实盘](https://www.fmz.com/m/robots)：创建、管理、控制实盘。实盘即运行中的策略程序实例。
- [策略库](https://www.fmz.com/m/strategies)：编写、保存、分组管理各种语言的策略。
- [托管者](https://www.fmz.com/m/nodes)：部署和管理运行策略的托管者程序。
- [交易所](https://www.fmz.com/m/platforms)：添加和管理交易所账户。

#### 平台公共资源
- [策略广场](https://www.fmz.com/square)：公开分享或上架出租的策略，适合学习和参考。
- [实盘围观](https://www.fmz.com/live)：用户公开展示的实盘。
- [文库](https://www.fmz.com/digest)：平台原创文章。
- [社区](https://www.fmz.com/bbs)：交流、讨论量化交易的论坛。
- [众包](https://www.fmz.com/markets)：发布和承接策略开发需求。
- [公开课](https://www.fmz.com/class)：视频教程。
- [API文档](https://www.fmz.com/api)：策略编写的API语法手册。

#### 获取帮助
遇到问题可以在社区发帖、在控制台提交工单，或在[Telegram](https://t.me/fmzquant_cn)社群联系管理员。

### 快速开始

从注册到运行第一个实盘，按下面六步完成，每一步后面链接了详细说明。

#### 1. 注册账号

在[注册页面](https://www.fmz.com/sign-up)注册并登录。添加交易所时要输入账号密码（交易所密钥在浏览器端用它加密），用第三方账号登录、还没有设置密码的用户会被要求先设置密码，见`密钥安全性`。

#### 2. 添加交易所账户

在交易所官网创建API KEY（只开启读取和交易权限，不要开启提现），然后在[交易所页面](https://www.fmz.com/m/platforms)点击「添加交易所」，选择交易所并填写密钥。第一次使用建议先用交易所的模拟盘或小额子账号。步骤与各配置项见`交易所`。

#### 3. 部署托管者

托管者是运行策略的程序，实盘都运行在托管者上。可以`一键租用托管者`，也可以`手动部署托管者`到自己的服务器上。

#### 4. 编写策略

在[新建策略页面](https://www.fmz.com/m/add-strategy)选择编程语言，把下面的最小策略粘贴进去保存。它每5秒读取一次行情和账户，显示在状态栏，不会下单。策略由入口函数```main()```和其中的主循环构成，见`策略结构`；全部函数见`API函数速查`；编辑器的用法见`策略编辑器`。也可以从策略广场复制一个公开策略开始。

#### 5. 回测

在策略编辑页面的回测面板中选择交易所、交易对、时间范围和K线周期后开始回测，检查收益曲线、交易记录和日志。回测通过后再上实盘，见`概述与发起回测`。

#### 6. 创建实盘

在[实盘创建页面](https://www.fmz.com/m/add-robot)选择策略、托管者和交易所账户，设置策略参数后启动。实盘按小时计费，启动前账户里需要有余额，见`实盘计费与充值`。运行状态、日志和收益在实盘页面查看，见`实盘`。

之后可以按需阅读：「开发工具」介绍编辑与调试，「进阶专题」介绍限流、实盘间通信、多线程和链上交易，「扩展API接口」介绍用程序或AI助手操作平台。

最小可运行策略：每5秒在状态栏显示行情和账户，不下单，回测和实盘都可以直接运行。

```javascript
function main() {
    Log("交易所:", exchange.GetName(), "交易对:", exchange.GetCurrency())
    while (true) {
        var ticker = exchange.GetTicker()
        var account = exchange.GetAccount()
        if (ticker && account) {
            LogStatus(_D(), "最新价:", ticker.Last,
                "可用计价币:", account.Balance, "可用币数:", account.Stocks)
        }
        Sleep(5000)
    }
}
```

```python
def main():
    Log("交易所:", exchange.GetName(), "交易对:", exchange.GetCurrency())
    while True:
        ticker = exchange.GetTicker()
        account = exchange.GetAccount()
        if ticker and account:
            LogStatus(_D(), "最新价:", ticker["Last"],
                      "可用计价币:", account["Balance"], "可用币数:", account["Stocks"])
        Sleep(5000)
```

```rust
fn main() {
    Log!("交易所:", exchange.GetName(), "交易对:", exchange.GetCurrency());
    loop {
        if let (Ok(ticker), Ok(account)) = (exchange.GetTicker(None), exchange.GetAccount()) {
            LogStatus!(_D(None), "最新价:", ticker.Last,
                "可用计价币:", account.Balance, "可用币数:", account.Stocks);
        }
        Sleep(5000);
    }
}
```

### 密钥安全性

配置交易所账户前，按下面的清单检查密钥的安全设置；交易所密钥一旦泄露，损失的是交易所账户里的资产。

- **只开交易权限**：API KEY只开启读取和交易权限，**不要开启提现**。
- **绑定 IP 白名单**：在交易所把API KEY绑定到托管者所在服务器的出口IP。服务器有多个IP时，用托管者的```-I```参数固定出口IP，见`命令行参数`。
- **私钥留在本地**：交易所支持RSA等非对称密钥时优先使用；私钥以凭据文件的形式放在托管者所在的机器上，平台只保存文件路径，见`本地凭据文件`。
- **先小额试运行**：第一次运行新策略时使用交易所的模拟盘或小额子账号。
- **不公开敏感信息**：策略代码、参数、描述里如果写了密钥、账号等信息，不要公开或出售该策略。

平台如何保存密钥：在交易所配置页面填写的密钥等加密字段，在浏览器端用平台账号密码加密后才上传，平台不保存明文；只有用账号密码启动的托管者能在本地解密。因此修改平台账号密码后，原有的交易所配置会失效，处理方法见`实盘报错、异常退出的常见原因`。

## 平台基础

平台的几个基本对象：交易所账户、运行策略的托管者、策略库、实盘，以及手动交易用的交易终端和账号与计费。

### 交易所

[交易所](https://www.fmz.com/m/platforms)页面管理已配置的交易所账户。在发明者量化交易平台中，「交易所」指一个可供策略程序操作的账户：它包含资金账户的密钥配置，以及与该交易所通信的协议和接口封装。

#### 添加交易所账户

1. **在交易所创建 API 密钥**：只开启读取和交易权限，不要开启提现；交易所支持 IP 白名单时，绑定运行实盘的托管者的出口 IP（检查清单见`密钥安全性`）。
2. **打开添加页面**：在交易所页面点击「添加交易所」，进入[交易所添加页面](https://www.fmz.com/m/add-platform)。
3. **选择协议**：按分类选择交易所，或在搜索框输入交易所名称、ID 搜索。现货和期货（合约）是两个不同的交易所对象，需要分别添加，期货交易所带「合约」标记；例如币安现货是```Binance```，币安期货是```Futures_Binance```。
4. **填写配置**：「标签」是这个账户在平台上的名称，默认是交易所名，同一交易所有多个账户时用它区分；其余配置项因交易所而异，常见的见下表，每个交易所的完整配置项见语法手册的交易所页（所有交易所见`能力矩阵`）。没有标「选填」的都要填写。
5. **确认添加**：点击「确认添加」并输入平台账号密码。密钥等加密字段在浏览器端用账号密码加密后才上传，平台不保存明文。
6. **使用**：创建实盘或回测时选择这个交易所账户。使用平台公用托管者时，添加页面下方会列出这些托管者的 IP，需要加入交易所的 IP 白名单。

#### 常见配置项

| 配置项 | 说明 |
| - | - |
| Access Key、Secret Key | 交易所的 API Key 和密钥。Secret Key 是加密字段 |
| Passphrase | 创建 API Key 时设置的口令，部分交易所需要（见下方说明） |
| 模拟盘 | 勾选后连接交易所的模拟盘（测试网），通常要在交易所单独创建 API Key |
| Version、V5协议、V3协议 | 交易所 API 版本，多数交易所保持默认即可 |
| 钱包地址、私钥类 | 链上交易所签名用的钱包地址、钱包私钥或交易所生成的 API 私钥 |
| Rpc Address、Chain、ChainType | 链上兑换和 Web3 交易所对象的节点地址和链，见`Web3` |
| 服务器地址、交易密码 | 富途、盈透等证券期货账户，见语法手册`证券与期货`中的交易所页 |

- Passphrase：```OKEX```（OKX）、```Futures_OKCoin```（OKX 期货）、Bitget、DeepCoin、```Futures_KuCoin```、```WEEX```、```Futures_WEEX```等需要；```KuCoin```现货的这一项显示为 Password。
- 模拟盘：币安、OKX、Bybit、Gate、DigiFinex 的部分交易所对象支持。
- API 版本：个别交易所的版本对应不同的账户类型，例如 Bitget 的 v3 为统一账户、v2 为经典账户，见交易所页。
- 钱包地址、私钥类：用于 Hyperliquid、Lighter、EdgeX、Aster、Polymarket 等链上交易所，具体字段见语法手册`去中心化交易所`、`预测市场`中的交易所页。

所有带掩码的加密输入框都可以改填一个凭据文件路径，让私钥只保存在托管者所在的机器上，见`本地凭据文件`。

#### 交易所对象
配置好的交易所在策略代码中就是交易所对象`exchange`。配置回测或实盘时可以添加多个交易所，在代码中对应交易所对象数组`exchanges`。```exchange.GetName()```返回交易所对象的名称（如```Futures_Binance```），文档中提到具体交易所时都用这个名称，必要时括注常用名。

在策略代码中通过交易所对象读取账户和行情、下单、撤单，以```JavaScript```为例：

```javascript
function main() {
    let account = exchange.GetAccount()    // 查询账户信息
    let ticker = exchange.GetTicker()      // 获取ticker行情
    let id = exchange.Buy(1000, 1)         // 价格为1000，下单量为1
    if (id) {
        exchange.CancelOrder(id)           // 下单成功才有订单Id，订单未成交时可以撤单
    }
}
```

#### 交易所特殊说明

各交易所的配置、合约代码、专属指令与注意事项已移到语法手册「交易所」章节。所有交易所的函数与交易模式指令支持情况见`能力矩阵`；各交易所页按分组列在`中心化交易所`、`去中心化交易所`、`预测市场`、`证券与期货`、`链上与自定义接入`。

#### 本地凭据文件

配置交易所时，所有带掩码的加密输入框（Secret Key、私钥、密码等）都可以不填写内容本身，而填写一个凭据文件路径```file:///文件名.txt```。实盘运行时，托管者从本机读取该文件的内容作为这一项的值。这样私钥只存在于托管者所在的机器上，平台上保存的只是一个路径。

##### 路径规则
- 路径相对于**本实盘的目录**```logs/storage/<实盘ID>/```解析（```logs```位于托管者的工作目录下）。例如实盘ID为```123456```时，```file:///rsaKey.txt```对应```logs/storage/123456/rsaKey.txt```。
- 可以有子目录，例如```file:///keys/rsaKey.txt```。
- 只认```.txt```后缀；其它后缀不会当作文件读取，而是把这串文字原样作为配置值。
- 路径不能是绝对路径，不能包含```..```，解析后也不能跳出实盘目录（指向目录外的符号链接同样不行）。
- 凭据文件按实盘目录读取，多个实盘使用同一个交易所配置时，每个实盘的目录里都要放一份。
- 文件读不到时实盘启动失败：文件不存在时报错中包含```resolve key file```，文件存在但无法读取时包含```read key file```；路径不合法时报错为```key file path must be relative and cannot contain '..'```或```key file path escapes the robot directory```。

##### 示例：使用 RSA 密钥
以支持```RSA KEY```验证的交易所为例：
1. 生成RSA公钥和私钥，例如用```openssl```生成PKCS#8格式的密钥对。
2. 在交易所创建```RSA KEY```，上传第1步生成的公钥。
3. 在平台配置交易所：```Access Key```填写交易所创建的```RSA KEY```，```Secret Key```填写```file:///rsaKey.txt```。
4. 创建实盘，得到实盘ID（例如```123456```）。
5. 把第1步生成的私钥保存为```logs/storage/123456/rsaKey.txt```，然后启动（或重启）实盘。

详细过程可以参考[视频讲解](https://www.bilibili.com/video/BV1UM41147Jj/)。

#### 通用协议

平台尚未对接的交易所，可以通过编写通用协议插件程序接入：插件程序一端调用交易所的API，另一端按统一的格式与托管者交互。

![通用协议配置截图](https://www.fmz.com/upload/asset/2e43b059b3ec9f42ded6e.png)

任何提供API交易接口的交易所都可以这样接入，插件支持两种协议：
- ```REST```协议：[参考文档](https://www.fmz.com/digest-topic/10518)。
- ```FIX```协议：[参考项目](https://github.com/fmzquant/fixc)。

两种插件的区别只在于与交易所接口的交互方式；与托管者的交互方式、数据格式等完全相同，具体实现见以上链接中的示例。

### 托管者

[托管者](https://www.fmz.com/m/nodes)是运行策略的程序：实盘策略运行在托管者上，而不是运行在发明者量化交易平台网站上。托管者负责与平台通信、启动和停止策略进程、回传日志；策略访问交易所的网络请求也都从托管者所在的机器发出。托管者运行在你自己的服务器（或一键租用的服务器）上，平台网站出现网络故障也不影响托管者上正在运行的实盘。

#### 支持的系统
托管者只发布64位版本：Linux（x86_64、ARM64）、macOS（Intel、Apple Silicon）、Windows（x64、ARM64，另有界面版）。不支持32位系统。

#### 数据目录
托管者的数据都在工作目录（默认为启动目录，可用```-w```指定）下的```logs```目录中：
- ```logs/storage/<实盘ID>/<实盘ID>.db3```：实盘数据库（```SQLite```），保存日志、收益、图表、状态栏和```_G()```数据，可以用```SQLite```管理软件打开。
- ```logs/storage/<实盘ID>/stdout.log```、```stderr.log```：策略进程的标准输出和标准错误。
- ```logs/docker.log```：托管者自身的运行日志。
- ```logs/docker.pid```：托管者的身份信息，保留它，重启后平台会沿用原来的托管者ID。

如需把实盘目录放到其他磁盘，可在启动托管者前设置环境变量```QUANT_ROBOT_LOG_DIR```，它会替代```logs/storage```作为各实盘目录的上级目录。

#### 网络代理
托管者不读取操作系统的代理设置。托管者进程环境中的```HTTP_PROXY```、```HTTPS_PROXY```、```ALL_PROXY```（及```NO_PROXY```）等环境变量会作用于策略发出的HTTP请求（```HttpQuery```和交易所REST接口），但不作用于WebSocket连接。需要通过代理访问交易所时，推荐：
- 在策略中用`exchange.SetProxy`给交易所对象设置代理；
- 或使用在网络层接管流量的透明代理（例如 Clash 的 TUN 模式），托管者无需任何配置。

#### 部署托管者

可以在平台一键租用服务器，或在自己的设备上手动部署。在[托管者管理页面](https://www.fmz.com/m/nodes)点击**部署托管者**进入[托管者部署页面](https://www.fmz.com/m/add-node)选择方式。

托管者管理页面列出当前账号下的托管者，可以切换列表或详细信息展示，查看托管者的IP地址、版本、编译时间等信息。

![托管者部署页面](https://www.fmz.com/upload/asset/2e527e497b3fa27ba497b.png)

##### 一键租用托管者

由平台代为租用一台服务器并自动部署托管者，不需要自己准备服务器，几分钟后托管者即可上线。

###### 步骤
1. 在[托管者部署页面](https://www.fmz.com/m/add-node)点击**一键租用托管者**标签，按配置、服务器机房地区等需求选择服务器。
2. 点击「立即购买」，输入发明者量化交易平台的账号密码验证。
3. 验证通过后自动部署托管者程序并安装常用的Python库，整个过程需要几分钟。

###### 注意事项
- 服务器由平台代为租用，只有有限的系统权限，不支持远程登录。需要使用没有预装的第三方Python库时，建议用自己的服务器`手动部署托管者`。
- 租用的服务器单独计费，与实盘计费无关。
- 点击「重新部署」不会删除托管者目录下```logs```目录中的实盘日志和数据文件。

##### 手动部署托管者

可以把托管者部署在个人电脑、服务器、树莓派（64位系统）等设备上。托管者只发布64位版本：
- Linux命令行版：x86_64（amd64）、ARM64（aarch64）
- macOS命令行版：Intel、Apple Silicon
- Windows：x64、ARM64，各有命令行版和界面版

在[托管者部署页面](https://www.fmz.com/m/add-node)点击**手动部署托管者**，按系统下载对应的托管者程序并解压，可执行文件```robot```即托管者程序。同一页面还显示部署需要的两项信息：

![手动部署托管者页面](https://www.fmz.com/upload/asset/2e460507bc21582ba1448.png)

1. 通信地址：包含账号UID，形如```node.fmz.com/123456```。
2. 密码：UID对应的发明者量化交易平台账号的密码。

###### Windows界面版
运行```robot.exe```，在界面上填写通信地址和密码，点击启动。

###### 命令行版
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

###### 在后台运行
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

###### 升级托管者
策略运行时和交易所连接器由平台按需下发，不需要手动更新。升级托管者程序本身：先停止托管者（见`托管者操作注意事项`），用新版本替换```robot```可执行文件，再在**同一工作目录**启动。工作目录下的```logs```目录保留了托管者身份和实盘数据，启动后沿用原来的托管者ID。

###### 用Docker容器隔离策略进程
Linux和macOS的命令行版可以用```-i```参数让每个策略进程运行在独立的Docker容器里（需要本机已安装并运行Docker）。这是策略进程的隔离方式，不是托管者本身的Docker镜像，参数见`命令行参数`。

##### 托管者操作注意事项

停止或删除托管者时要注意的事项：先停实盘，用正常的方式停止，避免强制结束进程。

###### 先停实盘，再停托管者
删除托管者或停止托管者进程前，先确认它上面没有运行中的实盘。

###### 正常停止托管者
- 命令行版：在终端按一次```Ctrl+C```，或向进程发送```SIGTERM```（```kill <PID>```、```systemctl stop```）。
- Windows界面版：点击界面上的停止按钮。

托管者收到停止指令后会优雅退出：先停止其上的所有实盘、上报最终状态，再从平台下线。收尾期间再按一次```Ctrl+C```会跳过状态上报和下线，直接退出，一般不要这样做。

###### 避免强制结束
不要用```kill -9```结束托管者进程，也不要直接断电或强制关机。这样托管者来不及下线，平台上的实盘可能仍显示为运行中并继续计费；出现这种情况，需要先删除已离线的托管者，才能停止这些实盘。重启服务器前先停止托管者；用systemd等服务管理器运行时，系统关机会自动发送```SIGTERM```。

#### 命令行参数

命令行版托管者程序```robot```的启动参数和配置文件```robot.conf```的写法。常用的启动方式：

```bash
./robot -s node.fmz.com/123456            # 启动后交互输入密码（不回显）
./robot node.fmz.com/123456               # 简写：robot 地址 [密码]
./robot -c robot.conf                     # 从配置文件读取参数
./robot -v                                # 查看版本
```

通信地址和账号UID在[托管者部署页面](https://www.fmz.com/m/add-node)查看。

##### 参数

| 参数 | 说明 |
| --- | --- |
| ```-s 地址``` | 与平台通信的地址，形如```node.fmz.com/123456```（```123456```为账号UID），可带```ws://```或```wss://```前缀。 |
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

##### 配置文件 robot.conf
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
- 键先按原样匹配、匹配不到再按小写匹配，所以只有```I```（出口IP）与```i```（Docker镜像）区分大小写，其余键（如```S=```）大小写均可。
- 配置文件路径相对启动目录解析（在```-w```切换目录之前）；```-f @文件```在```-w```切换目录之后读取，相对路径按工作目录解析。
- 配置文件里有密码，记得设置只有自己可读（```chmod 600 robot.conf```）。

##### 指定出口IP（-I）
服务器有多个IP地址，而交易所API KEY绑定了其中某个IP的白名单时，用```-I```指定出口IP，例如```./robot -s node.fmz.com/123456 -I 192.168.1.100```。指定后托管者与平台的连接、策略访问交易所的连接都从该地址发出。使用```-i```容器隔离时，容器的网络里可能没有这个地址，此时需要让容器使用宿主机网络。

Windows界面版没有IP设置，需要指定出口IP时请使用命令行版。界面版只接受```-s```、```-p```、```-n```三个启动参数，用于预填界面，同时给出```-s```和```-p```时自动启动。

#### 实盘数据迁移

每个实盘的数据都在托管者工作目录下的```logs/storage/<实盘ID>/```目录里（数据库```<实盘ID>.db3```、```stdout.log```、```stderr.log```等）。平台显示的实盘日志、收益、图表都是从运行该实盘的托管者上读取的。

##### 把单个实盘迁移到另一台机器的托管者
1. 停止该实盘。
2. 把整个```logs/storage/<实盘ID>/```目录复制到新托管者工作目录下的相同位置，目录名保持为实盘ID。
3. 在实盘配置中把托管者改为新托管者，再启动实盘。

这样实盘原有的日志、收益等数据不会因为换了机器而丢失。

##### 整体迁移托管者
1. 停止旧托管者上的实盘，再停止旧托管者。
2. 把旧托管者工作目录下的整个```logs```目录复制到新机器的工作目录。
3. 在新机器上启动托管者。

```logs/docker.pid```保存了托管者的身份，旧托管者已离线时，新机器上的托管者会沿用原来的托管者ID，实盘配置无需修改。不要让两台机器同时使用同一份```logs```目录运行托管者。

#### 托管者监控

在[托管者管理页面](https://www.fmz.com/m/nodes)，托管者列表或托管者详情的操作项中可以开启**托管者监控**。开启后，托管者异常离线以及恢复在线时，平台会按[推送设置](https://www.fmz.com/m/account#push)发送通知（App、邮箱、Telegram，不发送到WebHook）。

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

把自己的策略交给他人使用有两种方式：分享（对方得到策略的完整副本，包括源码）和出租（对方只得到回测、实盘使用权，看不到源码）。在[策略库](https://www.fmz.com/m/strategies)页面点击策略右侧的「操作项」按钮，在弹出的菜单中选择分享或出租。

创建、分发**注册码**（出租）时务必确认生成的是「注册码」而不是「复制码」（分享），以免误把策略源码分享出去。

##### 策略分享

分享策略后，对方得到策略的完整副本（包括源码）。点击策略的「分享」按钮，在弹出的对话框中选择分享方式：

- **公开分享**：策略完整地分享到平台的策略广场，任何用户都可以复制。
- **内部分享**：选择分享有效期和分享次数后，生成该策略的**复制页面地址**和**复制码**，分发给指定的平台用户。对方打开复制页面地址并登录，输入复制码即可获取该策略，策略随即出现在对方的策略库中。

![策略分享](https://www.fmz.com/upload/asset/2e593d57dc36afc004ef6.png)

##### 策略出租

出租策略后，对方只获得回测和实盘的使用权，看不到策略源码等信息。点击策略的「出租」按钮，在弹出的对话框中选择出租方式：

- **公开出售**：申请把策略上架到策略广场出售，需要通过审核。
- **内部出售**：选择使用天数、最多并发实盘数和注册码个数后，生成该策略的**注册页面地址**和**注册码**，分发给指定的平台用户。对方打开注册页面地址并登录，输入注册码即可获得使用权，策略随即出现在对方的策略库中。最多并发实盘数设置为0时不限制并发数，可以无限制地创建实盘。

![策略出租](https://www.fmz.com/upload/asset/2e4e78f6c46c9dde1ce90.png)

租用的策略到期后，使用它的实盘会被停止且不能再启动；达到最多并发实盘数后不能再启动新的实盘。

### 实盘

「实盘」区别于「回测」，指真正与交易所交互（获取行情、查询持仓、下单撤单等）的策略程序实例。连接交易所生产环境的是实盘，连接交易所模拟环境（很多交易所提供测试环境）的同样是实盘。

#### 创建实盘
在[实盘创建页面](https://www.fmz.com/m/add-robot)选择策略、托管者和交易所账户后创建，需要事先准备好三样东西：
- 一个策略：在[策略库](https://www.fmz.com/m/strategies)点击「新建策略」编写并保存。
- 一个在线的托管者：在[托管者页面](https://www.fmz.com/m/nodes)点击「部署托管者」，见`托管者`。
- 一个交易所账户：在[交易所页面](https://www.fmz.com/m/platforms)点击「添加交易所」配置，见`交易所`。

实盘按小时计费，账户余额不足时无法启动，见`实盘计费与充值`。

#### 实盘监控
在[实盘管理页面](https://www.fmz.com/m/robots)，运行中的实盘右侧操作栏可以点击「监控」开启实盘监控。开启后，实盘不是因手动操作而退出时，平台会按[推送设置](https://www.fmz.com/m/account#push)发送通知（App、邮箱、Telegram，不发送到WebHook）。

#### 实盘数据库
以实盘ID```123456```为例，它的数据库文件位于所属托管者工作目录下的```logs/storage/123456/123456.db3```（```SQLite```格式），包含以下表：
- chart：图表数据。
- cfg：状态栏内容、图表配置等最新状态。
- kvdb：```_G()```函数持久化保存的数据。
- log：实盘日志。
- profit：收益数据。

同一目录下还有策略进程的标准输出```stdout.log```和标准错误```stderr.log```。

让他人查看、操作部分实盘可以使用`子账号`。

#### 分组

在「实盘」页面和「策略库」页面点击右侧的**分组管理**按钮，可以给实盘、策略分组，分组名称可以自定义。例如给策略分组时，可以把模板类库、JavaScript策略、测试用策略各分一组。

策略分组：

![策略分组](https://www.fmz.com/upload/asset/2e482ba9b9aa272085d00.png)

实盘分组：

![实盘分组](https://www.fmz.com/upload/asset/2e577d050e817837bbfdf.png)

#### 实盘围观

在[实盘页面](https://www.fmz.com/m/robots)的实盘列表中点击某个实盘的「公开」按钮，可以让他人围观这个实盘。围观有两种方式：

1. **公开分享**：实盘展示在平台公开的[实盘围观](https://www.fmz.com/live)页面上。
2. **内部分享**：设置有效期后生成一个私有链接，持有链接的人可以打开该实盘的私有围观页面。

#### 实盘消息推送

实盘可以把日志作为消息推送到手机App、邮箱、Telegram或WebHook；推送渠道在[推送设置页面](https://www.fmz.com/m/account#push)中开启。

![推送设置](https://www.fmz.com/upload/asset/2e4ad17706aa842c914ce.png)

##### 推送渠道
- 移动端（App）：开启后，推送消息发送到发明者量化移动端App。
- 邮箱：先验证邮箱，验证通过后即可接收推送消息。
- Telegram：在推送设置中绑定Telegram并开启推送。
- WebHook：开启并设置推送地址，例如```http://abc.com/push.php?data={body}```，写法见下文。

托管者监控、实盘监控、额度预警等告警通知同样按推送设置发送，但不会发送到WebHook。

##### WebHook地址
实盘发出推送消息时，平台向推送地址发送```GET```请求：地址中的```{body}```替换为推送内容，```{subject}```替换为消息标题，两者都经过URL编码；写成```{{body}}```、```{{subject}}```则原样替换，不做编码。

需要发送```POST```请求时，把推送地址写成```请求地址||请求体```，例如```http://abc.com/push.php||text={body}```：```||```之前是请求地址，之后是请求体，两部分都可以使用上述占位符。推送地址必须是可从公网访问的```http```或```https```地址。

##### 在策略中推送
- JavaScript、Python、Rust：调用`Log`以及其它会在日志区域输出日志的函数（如```exchange.CreateOrder()```、```exchange.CancelOrder()```）时，在必要参数之后再传一个参数```@```，这条日志就会按推送设置推送，例如```Log("This is a push message", "@")```；Rust中用```Log!```宏，写法相同：```Log!("This is a push message", "@");```。
- PINE语言、My语言：在策略集成的「交易类库」的参数中开启交易日志推送，触发交易动作后自动推送。

##### 推送限制
推送消息由托管者随心跳（约20秒一次）上报，同一周期内的多条推送合并为一条；每个账号每小时最多推送50条（合并后的一条计为一条），每条正文最长200个字符。回测系统和调试工具不推送消息。完整规则见`Log`。

#### 实盘报错、异常退出的常见原因

实盘无法启动、运行中报错或异常退出时，按下面的分类排查原因。

##### 实盘无法启动
- 没有在线的托管者
  实盘所选的托管者离线时实盘无法启动。在[托管者页面](https://www.fmz.com/m/nodes)确认托管者在线，或换一个在线的托管者。
- 账户余额不足
  启动实盘需要预付第一个小时的费用，余额不足时无法启动；运行中余额耗尽，实盘会被平台停止。充值后重新启动，见`实盘计费与充值`。
- 租用的策略到期或并发数已满
  租用的策略到期后，使用它的实盘会被停止且无法再启动；达到租用的最多并发实盘数后，无法再启动新的实盘。
- 密钥解密失败
  报错形如```decrypt connector config (<交易所标签>): field '<字段>': AES decrypt failed (wrong password?)```（少数情况下为```secret key decrypt failed (wrong password)```）。原因是修改了发明者量化交易平台的账号密码，原先配置的交易所密钥无法再解密。处理方法：
  1. 在[「交易所」管理页面](https://www.fmz.com/m/platforms)重新填写交易所的密钥、密码等信息。
  2. 停止所有托管者，用新密码重新启动托管者。
- 凭据文件读不到
  交易所配置中使用了```file:///xxx.txt```凭据文件，而实盘目录里没有该文件，报错中包含```resolve key file```（文件存在但无法读取时为```read key file```）；路径不合法时报```key file path must be relative and cannot contain '..'```或```key file path escapes the robot directory```。见`本地凭据文件`。

##### 策略代码导致的错误
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

##### 其它报错
- 接口业务错误、网络请求错误
  此类报错会显示相关的交易所对象名称、函数名称、错误消息和原因，本身不会导致实盘异常停止。它们通常是起因而不是直接原因，直接原因一般是**没有判断接口返回值是否合法就直接使用而引发的程序异常**。
- ```interrupt```错误
  程序正在执行某个操作（例如访问交易所接口）时，用户点击了实盘页面上的**停止**按钮，停止中断了当前操作而打印的日志。它没有影响，只是一条记录。

更多问题见[常见问题汇总](https://www.fmz.com/bbs-topic/1427)。

### 交易终端

平台提供模块化、可定制的[交易终端](https://www.fmz.com/m/trade)页面：可以自由添加行情、交易等各种模块，模块可以拖动、缩放，可以修改模块绑定的交易所、交易对，同一类模块可以添加多个，方便手动交易和半程序化交易。

交易终端还支持交易插件：自己编写一段代码作为模块，在选定的托管者上执行，辅助手动交易。

#### 插件原理与编写

交易插件是一段在托管者上执行的短代码：在交易终端页面点击「执行」时，平台把插件代码和模块选定的交易所账户发送到选定的托管者执行，执行结束后把返回值显示在模块中。下面几个入口使用同一种执行机制：

| 入口 | 执行的代码 | 说明 |
| - | - | - |
| 交易终端插件 | 策略库中类型为「交易插件」的策略 | 在交易终端页面添加、执行 |
| 调试工具（开发工具） | 页面中临时编写的JavaScript代码 | 用于测试API调用 |
| 扩展API接口`PluginRun` | 请求中的```source```，或账号中已有的策略 | 供程序调用 |
| MCP的```plugin_*```工具 | 平台内置的查询行情、下单等函数 | 供AI助手调用，按```trade```权限授权，见`AI接入` |

这种执行方式不创建实盘、不计费，单次执行最长5分钟，超时中断。适合辅助手动交易的简单任务，例如冰山委托、批量挂单撤单、计算；需要长期运行的逻辑应创建实盘。

##### 编写

在新建策略页面把策略类型设置为「交易插件」即可创建交易插件。交易插件、调试工具和```PluginRun```都只支持JavaScript。

插件的入口是```main()```，返回值就是执行结果：返回表格对象、图表对象时，在模块中显示为表格、图表（示例见`插件示例`）。插件中```Log()```输出的日志不会在模块中显示。

##### 使用

- 添加：在交易终端页面打开模块添加菜单，账号策略库中的交易插件会出现在列表中，选择需要的插件添加。
- 执行：点击插件模块中的「执行」运行插件。

##### 数据目录

插件和调试工具在托管者上执行时，以托管者运行目录下的```logs/storage/p<数字>/```为工作目录（每个平台账号一个以```p```开头的目录，第一次执行后创建）。如果交易终端使用的交易所账户以密钥文件路径（```file:///xxx.txt```）的方式配置密钥，需要把密钥文件放在这个目录中。

#### 插件示例

插件可以在一段时间内执行代码，完成一些简单的操作，例如冰山委托、挂单、撤单、计算等。插件用```return```返回结果，返回表格、图表对象时直接显示为表格、图表。下面是两个例子，更多范例可以在**策略广场**中查找，例如逐笔小量买入/卖出。

##### 返回深度快照

以表格显示当前盘口前15档：

```javascript
// 返回深度快照
function main() {
    var tbl = {
        type: 'table',
        title: '深度快照 @ ' + _D(),
        cols: ['#', 'Amount', 'Ask', 'Bid', 'Amount'],
        rows: []
    }
    var d = exchange.GetDepth()
    if (!d) {
        return '获取深度失败'
    }
    var n = Math.min(d.Asks.length, d.Bids.length, 15)
    for (var i = 0; i < n; i++) {
        tbl.rows.push([i, d.Asks[i].Amount, d.Asks[i].Price + '#ff0000',
                       d.Bids[i].Price + '#0000ff', d.Bids[i].Amount])
    }
    return tbl
}
```

##### 画跨期差价

期货交易所对象上，取季度合约与当周合约的5分钟K线，画出收盘价差：

```javascript
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
    if (!recordsA || !recordsB) {
        return '获取K线失败'
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

### 账号与计费

实盘怎样计费、如何充值，以及如何用子账号把部分实盘交给他人管理。账号的其它设置（推送、二次验证、API接口等）在[账号设置页面](https://www.fmz.com/m/account)。

#### 实盘计费与充值

实盘按小时计费，费用从平台账户余额中扣除；本页说明计费规则、账单与余额预警，以及充值时的注意事项。

##### 实盘计费
- 实盘按小时计费，每个实盘每小时 0.05 USD，不足一小时按一小时计费。
- 创建实盘即开始计费，启动时需要预付第一个小时，账户余额不足时实盘无法启动。实盘「停止」/「重启」不会重复计费。
- 实盘运行中账户余额耗尽时，平台会停止该实盘；租用的策略到期时，使用该策略的实盘同样会被停止。
- 一键租用托管者的服务器费用单独计费，与实盘计费无关，见`一键租用托管者`。

##### 查询账单与余额预警
- 在[充值页面](https://www.fmz.com/m/billing)可以查看余额、充值记录和所有计费的账单明细。
- 在[账号设置的额度预警](https://www.fmz.com/m/account#alertthreshold)中设置预警阈值：可用余额低于该值时，平台会按[推送设置](https://www.fmz.com/m/account#push)发送通知（App、邮箱、Telegram；24小时内最多通知一次，充值或修改设置后重新计算）；设置为0表示关闭。

##### 充值
在[充值页面](https://www.fmz.com/m/billing)选择充值方式和金额。使用```USDT```充值时务必注意：
- 转账网络必须与充值页面选择的网络一致，目前支持TRC20、ERC20、BSC。ERC20与BSC的地址都以```0x```开头，格式相同，最容易选错。
- 充值资产选择```USDT```。
- 转账地址与充值页面显示的地址一致。

#### 子账号

把部分实盘交给他人查看和操作，而不交出主账号。

##### 创建子账号
在[账号设置页面](https://www.fmz.com/m/account#shadowmember)打开子账号页签，在操作权限中选择该子账号可以访问的实盘，填写子账号的用户名和登录密码后创建。创建后的子账号显示在同一页面，可以修改、锁定/解锁、删除。

![子账号设置](https://www.fmz.com/upload/asset/2e46d725dbe6b471f1b33.png)

##### 子账号的权限
子账号只能看到授权给它的实盘。对这些实盘可以查看日志和图表、修改策略参数、发送交互命令、停止和重启；不能修改实盘的托管者、策略、版本、名称和交易所对象等配置。

##### 常见用途
- 量化团队分工管理多个实盘。
- 出租策略时，让租用方协助调试实盘。

## 编写策略

介绍策略结构（生命周期、主循环、事件驱动）、各编程语言的说明、策略参数、交互控件、模板类库、内置库、策略界面文字的中英文写法，以及全部 API 函数的分类速查。

### 策略结构

```JavaScript```、```Python```、```Rust```策略由几个约定名称的函数组成，托管者在固定的时机调用它们。My语言、PINE、Workflow 策略不需要编写这些函数。

#### 生命周期函数

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

#### 注意事项
- ```onexit()```、```onerror()```最长执行 5 分钟（时长由服务端按任务下发，默认 5 分钟），超时会被强制结束。
- 回测中策略通常是不停轮询的死循环，回测结束时```main()```并没有正常返回，```JavaScript```、```Python```策略因此不会执行```onexit()```，处理方法见 `onexit()`；```Rust```策略在回测结束时会自动执行```onexit()```。
- ```JavaScript```策略的```main()```返回时，用```threading```创建的子线程会被终止；还没有到期的```setTimeout```回调会先执行完，再调用```onexit()```。
- ```JavaScript```、```Python```模板类库可以定义自己的```init()```，在模板加载时执行，早于策略的```init()```。

#### 主循环与事件驱动

大多数策略在```main()```中写一个循环：每轮获取数据、计算、下单，然后```Sleep()```等待下一轮，见 `主循环`。也可以等待行情、订单等事件到达后再处理，见 `事件驱动`。全部 API 函数的分类速查见 `API函数速查`。

#### init()

可选的初始化函数：策略开始运行时，在```main()```之前自动调用一次，用于完成初始化任务。

```init()```先于```main()```执行，先输出「初始化」，再输出```main()```中的两行日志。

```javascript
function main(){
    Log("main()的第一行", "#FF0000")
    Log("退出")
}

// 初始化函数
function init(){
    Log("初始化")
}
```

```python
def main():
    Log("main()的第一行", "#FF0000")
    Log("退出")

# 初始化函数
def init():
    Log("初始化")
```

```rust
fn main() {
    Log!("main()的第一行", "#FF0000");
    Log!("退出");
}

// 初始化函数
fn init() {
    Log!("初始化");
}
```

#### onexit()

可选的扫尾函数：策略退出时调用，用于撤单、平仓、保存状态等。最长执行 5 分钟，超时会被强制结束。各语言在哪些情况下调用```onexit()```，见 `策略结构`。

回测中策略通常是不停轮询的死循环，回测数据结束时```main()```并没有正常返回，```JavaScript```、```Python```策略因此不会执行```onexit()```。可以在回测中（```IsVirtual()```为真）捕获回测结束时抛出的异常（EOF），让```main()```返回，从而执行```onexit()```，见第二个示例。```Rust```策略不需要处理：回测结束时 SDK 会先自动执行```onexit()```，再结束策略。

```main()```5秒后返回，```onexit()```每秒输出一次已执行的时间，直到超过5分钟被强制结束。

```javascript
function main(){
    Log("开始运行，5秒后停止并执行扫尾函数")
    Sleep(1000 * 5)
}

// 扫尾函数实现
function onexit(){
    var beginTime = new Date().getTime()
    while(true){
        var nowTime = new Date().getTime()
        Log("扫尾中，已执行", (nowTime - beginTime) / 1000, "秒")
        Sleep(1000)
    }
}
```

```python
import time
def main():
    Log("开始运行，5秒后停止并执行扫尾函数")
    Sleep(1000 * 5)

# 扫尾函数实现
def onexit():
    beginTime = time.time() * 1000
    while True:
        ts = time.time() * 1000
        Log("扫尾中，已执行", (ts - beginTime) / 1000, "秒")
        Sleep(1000)
```

```rust
fn main() {
    Log!("开始运行，5秒后停止并执行扫尾函数");
    Sleep(1000 * 5);
}

// 扫尾函数实现
fn onexit() {
    let beginTime = Unix() * 1000;
    loop {
        let nowTime = Unix() * 1000;
        Log!("扫尾中，已执行", (nowTime - beginTime) / 1000, "秒");
        Sleep(1000);
    }
}
```

回测中捕获回测结束时的异常，让```main()```返回，从而执行```onexit()```。

```javascript
function main() {
    if (exchange.GetName().startsWith("Futures_")) {
        Log("交易所为期货")
        exchange.SetContractType("swap")
    } else {
        Log("交易所为现货")
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
    Log("执行扫尾函数")
}
```

```python
def main():
    if exchange.GetName().startswith("Futures_"):
        Log("交易所为期货")
        exchange.SetContractType("swap")
    else:
        Log("交易所为现货")

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
    Log("执行扫尾函数")
```

```rust
fn onTick() {
    loop {
        // 回测结束时SDK先自动执行onexit()，再结束策略，这里不需要特别处理
        match exchange.GetTicker(None) {
            Ok(ticker) => LogStatus!(_D(None), ticker.Last),
            Err(e) => Log!("error:", e),
        }
        Sleep(500);
    }
}

fn main() {
    if exchange.GetName().starts_with("Futures_") {
        Log!("交易所为期货");
        let _ = exchange.SetContractType("swap");
    } else {
        Log!("交易所为现货");
    }

    onTick();
}

fn onexit() {
    Log!("执行扫尾函数");
}
```

#### onerror()

可选的异常处理函数，仅支持```JavaScript```：```main()```因未捕获的异常结束时调用，参数```msg```为异常的错误信息。调用了```onerror()```就不再调用```onexit()```。最长执行 5 分钟，超时会被强制结束。

回测系统不支持该函数；```Python```、```Rust```策略也不支持。

```main()```中访问不存在的数组元素引发异常，```onerror()```输出错误信息。

```javascript
function main() {
    var arr = []
    Log(arr[6].Close)  // 这里故意引发一个程序异常
}

function onerror(msg) {
    Log("错误:", msg)
}
```

#### 主循环

策略通常在```main()```中写一个循环：每轮获取行情、计算信号、下单，然后调用 `Sleep` 等待下一轮。```Sleep()```在回测中推进回测时间、控制回溯速度，在实盘中控制轮询间隔，从而控制访问交易所 API 的频率。循环中不调用```Sleep()```会以最快速度反复请求交易所接口，容易触发交易所的频率限制。需要在托管者上限制 API 调用频率时，见 `API限流控制`。

基本框架：每轮执行一次```onTick()```，再用```Sleep()```等待60秒。

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

每隔1秒挂一个价格为100、数量为1的买单（仅作演示，会很快把资金全部用于下单）。

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

按K线更新处理（On Bar）：最新一根K线的时间变化时才执行```onTick()```。

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

除了按固定间隔轮询，策略也可以等待事件到达后再处理，这样既能减少无效请求，又能更快地响应行情变化。

##### EventLoop

`EventLoop` 用于等待```exchange.Go()```、```HttpQuery_Go()```等并发任务完成、WebSocket 连接有数据可读、收到线程消息等事件；有事件发生时返回事件信息，策略再读取相应的数据。首次调用```EventLoop()```时才开始记录事件，因此应先调用一次```EventLoop(-1)```再发起并发任务：

```javascript
function main() {
    EventLoop(-1)                       // 开始记录事件，避免遗漏之后发生的事件
    var r1 = exchange.Go("GetTicker")
    var r2 = exchange.Go("GetDepth")
    var ev = EventLoop(1000)            // 等待任一并发任务完成，最多等待 1 秒
    Log("event:", ev)
    Log("ticker:", r1.wait(), "depth:", r2.wait())
}
```

##### ctx.subscribe / ctx.poll

策略还可以直接使用交易所的 WebSocket 推送：`ctx.subscribe` 订阅指定账户的行情、全市场 ticker 或账户私有流，返回 `Subscription` 订阅对象；`ctx.poll` 取出下一条推送事件（可设置等待超时），策略根据事件的```channel```分别处理。```JavaScript```、```Python```策略使用全局的```ctx```对象，```Rust```策略使用```ctx```模块的同名函数。

```javascript
function main() {
    // 第一个参数传入交易所对象，未传 symbol 时使用其当前交易对
    var tk = ctx.subscribe(exchange, {channel: "ticker"})
    var book = ctx.subscribe(exchange, {channel: "depth", depth: 20})    // 20 档订单簿
    // 账户私有流：订单回报、持仓、余额均通过这一路推送
    var acct = ctx.subscribe(exchange, {channel: "private"})
    while (true) {
        const ev = ctx.poll([], 1000)                    // [] 表示本线程的全部订阅，最多等待 1 秒
        if (!ev) {
            continue
        }
        if (ev.type === "status") {                      // 网关状态、订阅状态事件先单独处理
            if (ev.kind === 35 && ev.prefillStatus === 2) {
                Log("subscription failed:", ev.channel, ev.message)
            }
            continue
        }
        if (ev.channel === "ticker") {
            Log("ticker:", ev.symbol, ev.bid, ev.ask, ev.last)
        } else if (ev.channel === "depth") {
            // 深度事件不携带档位数据，需从该订阅自身的订单簿读取
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

```Python```的写法相同：选项为字典，事件也是字典（也可以使用```ev.kind```这样的属性访问方式）：

```python
def main():
    tk = ctx.subscribe(exchange, {"channel": "ticker"})
    book = ctx.subscribe(exchange, {"channel": "depth", "depth": 20})
    acct = ctx.subscribe(exchange, {"channel": "private"})
    while True:
        ev = ctx.poll([], 1000)                          # 超时返回 None
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

- 第一个参数为交易所对象（```exchange```、```exchanges[1]```），或账户在```exchanges```中的下标；第二个参数为选项对象```{channel, symbol, depth, interval, mode, buffer}```，品种在```symbol```中指定。
- ```channel```可选```ticker```、```bbo```、```depth```（```depth```为档数）、```trade```、```kline```（```interval```为 K 线周期，单位为秒）、```tickers```、```private```。```private```不指定品种，订单回报、持仓、余额均通过这一路推送，对应事件的```channel```分别为```orders```、```positions```、```balance```；订阅后会先推送一次账户快照，就绪后通过订阅对象的```positions()```、```balances()```可获取最新的持仓和余额。
- ```tickers```不指定品种，一路订阅即可收到交易所全部品种的 ticker，事件的```symbol```为对应品种。仅提供全市场推送的交易所支持此频道，详见 `能力矩阵` 的「推送」列；不支持时，该订阅会收到一条失败的状态事件。
- ```symbol```传入数组时可一次订阅多个品种，返回顺序一致的订阅对象数组：整批先统一校验，任一品种不合法则整批均不订阅；该数组可直接传给```ctx.poll()```，调用数组的```unsubscribe()```可一次性全部退订。
- 每条事件都包含```stream```（所属订阅的```id```）、```type```、```channel```等字段，字段说明详见 `ctx.poll`。深度事件仅表示订单簿已更新，档位数据需通过```ev.book(n)```或订阅对象的```book(n)```读取。
- 完全相同的订阅共用同一路推送；退订时调用订阅对象的```unsubscribe()```，直到最后一个订阅对象退订时才真正取消订阅。交易所不支持的订阅不会抛出异常，而是在该订阅上收到一条```prefillStatus```为```2```的状态事件。
- 行情类订阅若消费不及时，会只保留最新数据或丢弃最旧的数据；订单回报、持仓、余额则不会丢弃。策略需要持续调用```ctx.poll()```。是否处理及时可查看```ctx.connectors()```每个交易所的```feed```计数。
- 推送与 REST 接口互不影响：```exchange.GetTicker()```、```exchange.GetDepth()```等函数仍会每次请求交易所的 REST 接口，不读取推送数据。各交易所支持的推送频道详见对应的交易所页面。
- ```JavaScript```、```Rust```中，同一线程内的```EventLoop()```与```ctx.poll()```从同一个事件队列获取事件，因此一个线程只应使用其中一种；```Python```的```EventLoop()```拥有独立的队列，与```ctx.poll()```互不争抢。

订阅归属于调用```ctx.subscribe()```的线程：事件只投递给该线程，```ctx.poll()```只获取本线程订阅的事件，也只有该线程能够退订。若要让某个线程专门处理一组行情，就在该线程内订阅；不同线程订阅相同内容时，交易所侧只订阅一次，但每个线程各自收到一份：

```javascript
function main() {
    var t = threading.Thread(function(symbols) {
        var subs = ctx.subscribe(0, {channel: "depth", symbol: symbols, depth: 5})
        while (true) {
            var ev = ctx.poll([], 1000)                  // 仅包含本线程订阅的这两路
            if (ev && ev.kind === 3) {
                var b = ev.book(1)
                if (b.bids.length > 0 && b.asks.length > 0) {
                    Log(ev.symbol, "bid1:", b.bids[0][0], "ask1:", b.asks[0][0])
                }
            }
        }
    }, ["ETH_USDT", "SOL_USDT"])
    var acct = ctx.subscribe(0, {channel: "private"})   // 主线程只处理账户私有流
    while (true) {
        var ev = ctx.poll([acct], 1000)
        if (ev && ev.kind === 16) {
            Log("order:", ev.id, ev.state)
        }
    }
}
```

```Python```使用标准库的```threading.Thread```创建线程，写法相同；线程结束时，其订阅会自动退订。

```Rust```策略中的写法为```ctx::subscribe()```、```ctx::poll()```，订阅选项通过```ctx::SubOpts```构造，批量订阅使用```ctx::subscribe_many()```，任意线程均可订阅；事件为原始结构体，引入```sdk::ctx::EventExt```后可使用```ev.channel()```、```ev.book(n)```、```ev.ticker()```、```ev.order()```、```ev.feed_status()```等方法按事件类型读取（价格、数量已换算为实数，无需编写```unsafe```）：

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

### 编程语言

平台支持用```JavaScript```、```Python```、```Rust```、[```PINE```](https://www.fmz.com/bbs-topic/9315)、[```My语言```](https://www.fmz.com/bbs-topic/2569)（麦语言）和```Workflow```工作流编写策略。

```JavaScript```、```Python```、```Rust```策略直接调用平台的全部API；PINE、My语言兼容TradingView、文华的脚本语法；Workflow工作流用可视化节点搭建策略，不需要写代码。

#### JavaScript

平台支持用```JavaScript```编写策略。运行时基于 QuickJS 引擎，支持```async```/```await```、```class```、```BigInt```等现代语法；实盘时策略在托管者上运行，回测时在浏览器端的回测系统中运行。也可以用 TypeScript 编写，见本页末尾「用 TypeScript 编写」。

##### 策略结构与参数

策略入口为```function main()```，可选的```init()```、```onexit()```、```onerror(msg)```由托管者自动调用，见 `策略结构`。界面参数是同名的全局变量，可以直接读取，也可以在代码中修改，见 `策略参数`。

##### 错误与返回值

API 函数调用失败（交易所返回错误、网络问题等）时返回```null```，并在日志中输出错误信息。使用返回值之前先判断，或者用 `_C` 重试：

```javascript
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

##### 字符串与ArrayBuffer

JavaScript 的字符串是 UTF-16 编码。平台 API 返回的文本如果不是合法的 UTF-8 字节序列，为了不丢失数据，会返回```ArrayBuffer```（原始字节）。所有可以传入字符串的 API 参数也都接受```ArrayBuffer```。

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

##### 异步与多线程

- ```setTimeout```/```clearTimeout```：回调在主线程调用```Sleep()```等待期间执行；```main()```返回时还没到期的定时器会先执行完，再调用```onexit()```。
- ```fetch(url)```：返回```Promise```，结果为响应对象（```ok```、```status```、```headers```属性，```text()```、```json()```直接返回内容）。托管者中的```fetch```在调用时就同步完成请求，返回的是已经完成的```Promise```，所以用```Promise.all```组合多个```fetch```并不会并发请求。
- 交易所 API（例如```exchange.GetTicker()```）是同步阻塞调用，包装进```Promise```或```async```函数也不会并发执行。
- 需要并发时使用 `exchange.Go`、`HttpQuery_Go`，或者用 `Thread` 创建线程，见 `JavaScript多线程`。

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

##### 库与依赖

JavaScript 策略可以直接使用内置的```TA```指标库和```talib```指标库，各语言可用的内置库见 `内置库`。其它第三方 JavaScript 库可以在运行时下载后用```eval```加载，示例见同一页。

##### 用 TypeScript 编写

TypeScript 不是单独的语言选项：创建策略时选择```JavaScript```，在代码中（通常是首行）写一行```//@ts-check```注释（或点击策略编辑区右上角的「TypeScript」按钮），平台就按 TypeScript 处理，在回测和实盘运行前先编译为 JavaScript。通过 AI/MCP 工具保存策略时，语言可以写```typescript```，平台按 JavaScript 策略保存，并在代码开头自动加上```//@ts-check```，见 `AI接入`。

平台 API 的类型声明由策略编辑器内置提供，不需要在代码中引用：全局函数、```exchange```对象、```ITicker```、```IRecord```、```IOrder```、```IPosition```等数据结构接口，以及```TA```、```talib```等。静态类型检查能在编写时发现参数个数、属性名、类型用错之类的问题。运行时的语言特性、API 和库与 JavaScript 相同。

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

平台支持用```Python 3```编写策略，不支持 Python 2。实盘以及在托管者上进行的回测，使用托管者所在机器上安装的 Python 解释器运行策略。

##### 解释器

实盘按以下顺序查找解释器，使用第一个能启动、并且版本为 Python 3 的程序：
1. 策略代码首行```#!```指定的解释器，例如```#!/opt/venv/bin/python3```；写成```#!/usr/bin/env python3.11```时取```python3.11```；
2. 环境变量```PYTHON_BIN```指定的解释器；
3. ```python3```；
4. ```python```。

首行指定的解释器不可用时，托管者退回后面的候选，并在实盘目录的```stderr.log```中留一行说明。不想改策略代码时，也可以在启动托管者之前设置环境变量来指定解释器（例如虚拟环境中的 Python）：

```bash
export PYTHON_BIN=/opt/venv/bin/python3
```

在托管者上进行的回测不读```PYTHON_BIN```：按首行```#!```指定的解释器、```python3```、```python```的顺序，在```PATH```中查找第一个存在的程序。

##### 策略结构与参数

策略入口为```def main()```，可选的```init()```、```onexit()```由托管者自动调用（Python 不支持```onerror()```），见 `策略结构`。界面参数是同名的全局变量；在函数中给参数重新赋值时，需要先用```global```声明。

##### 错误与返回值

API 函数调用失败时返回```None```，并在日志中输出错误信息。使用返回值之前先判断，或者用```_C()```重试。策略中未捕获的异常会结束运行，错误信息记录在日志中。

##### 输出

```print()```的输出写入托管者目录下的```logs/storage/<实盘ID>/stdout.log```（错误输出写入同目录的```stderr.log```），不会出现在实盘日志里。需要显示在日志中的内容请用 `Log`。

##### 第三方库

策略可以导入解释器中已经安装的任何库。安装时要使用托管者运行策略的那个解释器，例如：

```bash
python3 -m pip install numpy
# 首行用 #! 指定了解释器时，用该解释器安装，例如
/opt/venv/bin/python3 -m pip install numpy
# 设置了 PYTHON_BIN 时
$PYTHON_BIN -m pip install numpy
```

使用```talib```需要在托管者所在机器上安装 TA-Lib（```talib```包）和```numpy```。

##### 自定义模块

策略运行时的当前目录是实盘目录```logs/storage/<实盘ID>/```（用相对路径打开的文件落在这里，随实盘保留）；```PYTHONPATH```是托管者为本次运行创建的临时目录，运行结束后会被删除。当前目录不在模块搜索路径中，放在实盘目录下的```.py```文件不会被自动找到。导入自己编写的模块有两种方式：
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

平台支持用```Rust```编写策略。Rust 策略先编译再运行：回测时由平台服务器编译，默认在云端（平台服务器）回测，也可以选择「本地」回测节点在浏览器中运行；实盘时编译通过后在托管者上运行。策略编辑器为 Rust 集成了```rust-analyzer```，提供代码补全与实时诊断。

##### 策略结构

策略代码只需要一个```fn main()```。平台 API（```exchange```、```exchanges```、```TA```、```Log!```、```_C!```等）已经自动导入，不需要写```use```或```mod```声明。

可选的```fn init()```、```fn onexit()```由托管者自动调用，定义即可，不需要注册：```init()```在```main()```之前执行；```onexit()```在```main()```正常返回、实盘被停止、策略```panic```、回测结束时都会执行。Rust 不支持```onerror()```。详见 `策略结构`。

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

##### 参数类型

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

##### 错误与返回值

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

##### JSON

平台 API 返回的原始 JSON 文本（例如```exchange.IO()```的返回值、各结构体的```Info```字段）用内置的```JSONParse()```解析，得到```Option<JsonValue>```；用```v["key"]```、```v[0]```取子节点，用```as_f64()```、```as_str()```、```as_bool()```等方法取值。```JsonValue```实现了```Display```，```v.to_string()```或```format!("{}", v)```得到紧凑的 JSON 文本。SDK 没有提供构造 JSON 的便捷接口，生成 JSON 文本可以用```format!```拼接，或者引入```serde_json```。

##### 第三方 crate

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

- frontmatter 必须在源码开头，前面只能有空行或以```#!```开头的行；```/*backtest ... */```回测配置块要放在 frontmatter 结束的```---```之后。策略中还没有回测配置块时，「保存回测设置」会把配置块插入到源码最前面，这时需要把它移到 frontmatter 之后（之后再保存会在原位置更新）。
- 策略和它引用的模板类库中，依赖块只能写在其中一处，两处都写会编译失败。
- 编译环境中没有系统 OpenSSL，需要 TLS 的 crate（HTTP/WebSocket 客户端等）请选用纯 Rust 实现的```rustls```（例如```tokio-tungstenite```开启```rustls-tls-webpki-roots```特性），避免依赖```native-tls```/```openssl-sys```；WebSocket 连接优先使用内置的 `Dial` 函数，不需要第三方 crate。

##### 内置库

Rust 策略可以使用```TA```指标库，不支持```talib```，见 `内置库`。

#### My语言（麦语言）

平台支持用My语言（麦语言）编写策略，兼容文华麦语言的大部分语法、指令和函数。My语言把复杂算法拆解成函数，用简洁的语法和金融函数库描述交易逻辑。

策略示例：基于平移布林通道的系统

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

平台支持并兼容```Trading View```的PINE语言脚本。PINE语言用于编写可以回测和实盘交易的指标与策略，社区已有超过10万个公开的PINE脚本，可以直接借用来实现自己的交易想法，不必从零开始编写。

策略示例：超级趋势策略

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

#### Workflow工作流

平台支持Workflow工作流方式编写策略。工作流是一种可视化的策略设计方式，通过节点连接和配置来构建交易逻辑，无需编写代码即可实现策略。

##### 工作流特点
- 可视化拖拽设计，所见即所得
- 预置丰富的功能节点（数据获取、指标计算、条件判断、交易执行等）
- 降低编程门槛，适合快速搭建和验证策略
- 支持回测功能，可视化查看节点执行状态

##### 学习资源
- [工作流系列视频教程](https://www.fmz.com/class/workflow)

### 策略参数

在策略界面上设置，在策略代码中以同名的全局变量（Rust 中为全局常量）出现，直接用变量名访问。各语言的差异：
- ```JavaScript```、```My语言```：可以直接读取参数，也可以在代码中修改参数变量。
- ```Python```：可以直接读取；在函数中给参数变量重新赋值时，需要先用```global```声明。
- ```Rust```：参数是常量，只能读取，不能修改；各种参数对应的类型见 `Rust`。
- ```PINE```：使用```input()```函数创建界面参数。

![策略参数设置界面](https://www.fmz.com/upload/asset/2e46b5e593de3b2f11445.png)

#### 界面参数种类

界面参数在策略编辑页面代码编辑区下方的策略参数区设置，共有5种类型。下表中的变量名只是示例：

| 类型 | 变量示例 | 代码中的值 | 默认值 |
| - | - | - | - |
| 数字型（number） | ```pNum``` | 数值；Rust 中为```f64``` | 输入数值，例如```100``` |
| 布尔型（true/false） | ```pBool``` | 布尔值 | 用开关控件设置，不能设为选填 |
| 字符串（string） | ```pStr``` | 字符串 | 直接输入，例如```abc```，不加引号 |
| 下拉框（selected） | ```pCombox``` | 选中选项的索引或绑定的数据；支持多选时为数组 | 选中一个或多个选项 |
| 加密串（string） | ```pSecretStr``` | 字符串 | 直接输入，例如```xyz```，不加引号 |

##### 参数的设置项
- 变量：参数在策略代码中的全局变量名，不要使用当前编程语言的保留字（关键字）。
- 描述：参数绑定的控件的显示名称。
- 备注：在回测、实盘界面上鼠标停在参数控件上时显示的说明。
- 默认值与「选填」：默认值旁的「选填」控件默认为选填状态，可以改为必填。必填参数在回测、实盘时没有设置，就无法开始回测或启动实盘。
- 组件配置：参数绑定的界面控件类型，以及最小值、最大值、分组、过滤器等，见`组件配置`。

##### 注意事项
- 参数在代码中是全局变量，可以在代码中修改（Rust 除外：Rust 中参数是全局常量，不能修改）。
- 「加密串」参数的用法与「字符串」参数相同，只是加密发送，不会明文传输。
- 选填参数没有填写时：字符串参数的值为空字符串；数字型、下拉框、加密串参数的值为空值。```Rust```策略中为该类型的零值：数字为```0```，字符串、加密串为空字符串，布尔为```false```。
- 下拉框参数在「组件配置」中没有开启「支持多选」时，值为当前选中选项的索引，给选项绑定了数据时为该数据；开启「支持多选」后，值为包含所有选中选项的索引（或绑定数据）的数组。

#### 组件配置

策略界面参数和策略交互控件都有「组件配置」选项，用于设置参数（或交互控件）对应的界面控件，以及最小值、最大值、分组、过滤器等。

各种类型可选的组件（第一个为默认组件）：

| 类型 | 组件 |
| - | - |
| 数字型（number） | 输入框、时间选择器、滑动输入条 |
| 布尔型（true/false） | 开关 |
| 字符串（string） | 输入框、文本框、时间选择器、颜色选择器、币种、交易代码 |
| 下拉框（selected） | 下拉框、分段控制器、币种、交易代码 |
| 加密串（string），仅策略参数 | 加密输入框 |
| 按钮（button），仅交互控件 | 按钮（没有输入项） |

##### 分组

在组件配置的「分组」输入框中输入一个标签名，可以把若干个策略参数划分到同一个分组中（代替平台旧功能「策略分组」）。交互控件同样可以分组（代替旧功能「交互控件分组」）。

##### 过滤器

策略参数的组件配置中，「过滤器」输入框可以填写判定表达式，控制参数是否可用（代替平台旧功能「参数依赖」）。过滤器默认为空，不做任何过滤；过滤条件为真时，当前参数可用。可以使用```a > b```、```a == 1```、```a```、```!a```、```a >= 1 && a <= 10```等表达式，例如：
- ```a == 1```：参数```a```等于1时可用，否则不可用。
- ```a >= 1 && a <= 10```：```a```大于等于1并且小于等于10时可用，否则不可用。
- ```!a```：过滤条件为「非a」；```a```可以是布尔值，也可以是数值（```!0```为真）。

#### 保存参数设置

回测时设置的策略参数可以保存到策略代码中；实盘的参数可以导出为文件，再导入到其它实盘。

##### 保存回测参数
在回测页面修改策略参数后点击「保存回测设置」，参数和回测配置一起以注释块的形式保存在策略代码开头，见 `回测配置与保存`。例如策略有以下参数：

| 变量 | 描述 | 类型 | 默认值 |
| - | - | - | - |
| number | 数值类型 | 数字型（number） | 1 |
| string | 字符串 | 字符串（string） | Hello FMZ |
| combox | 下拉框 | 下拉框（selected） | 1\|2\|3 |
| bool | 布尔值 | 布尔型（true/false） | true |
| numberA | 数值A（过滤器为```isShowA```，```isShowA```为真时才可用） | 数字型（number） | 2 |
| isShowA | 是否显示numberA参数 | 布尔型（true/false） | false |

修改参数值后保存，策略代码开头得到的配置块如下（```JavaScript```、```Rust```用```/*backtest ... */```，```Python```用```'''backtest ... '''```）：

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

```Rust```策略如果在开头用 frontmatter 声明了依赖，回测配置块要放在 frontmatter 之后，见 `Rust`。

##### 导入导出实盘参数
1. 在实盘页面点击「参数设置」，再点击「导出参数」，参数保存为一个```json```文件。
2. 在要导入的实盘页面点击「导入参数」，选择导出的文件。
3. 点击「更新参数」保存，导入的参数才会生效。

### 交互控件

```JavaScript```、```Python```、```Rust```、My语言策略可以设计交互控件，策略的交互控件用来在策略实盘运行时给运行的策略程序发送交互指令。对于```JavaScript```、```Python```、```Rust```语言类型的策略，在策略代码中使用 `GetCommand` 函数获取交互控件产生的消息。交互控件的「组件配置」与策略参数相同，见 `组件配置`。

![交互控件](https://www.fmz.com/upload/asset/2e4320d0cc33c15eb935d.png)

在策略中设计好处理交互控件消息的代码，在实盘时使用交互控件可以实现（不限于）诸如以下功能：
- 手动平掉策略持仓。
- 动态修改策略参数，避免重启策略实盘。
- 切换策略逻辑。
- 触发打印某些调试信息、数据，用来测试某些功能。

#### 交互控件种类

交互控件有5种类型，点击控件的按钮后，策略中的`GetCommand`收到一条字符串消息。下表中的变量名只是示例：

| 类型 | 变量示例 | 默认值 | ```GetCommand()```收到的消息 |
| - | - | - | - |
| 数字型（number） | ```cmdNum``` | 选填，可留空 | 输入```123```后点击：```cmdNum:123``` |
| 布尔型（true/false） | ```cmdBool``` | 必选，开启或关闭 | 开关打开时点击：```cmdBool:true``` |
| 字符串（string） | ```cmdStr``` | 选填，可留空 | 输入```abc```后点击：```cmdStr:abc``` |
| 下拉框（selected） | ```cmdCombox``` | 选填，可留空 | 选中第二个选项后点击：```cmdCombox:1```（选项索引，从0开始） |
| 按钮（button） | ```cmdBtn``` | 不绑定输入项 | 点击：```cmdBtn``` |

消息的格式是```变量名:值```，按钮只有变量名。交互控件的描述、备注、组件配置与策略参数相同，见`界面参数种类`和`组件配置`。

##### 示例：用交互控件动态修改策略参数

在策略编辑页面的「策略交互」中添加一个字符串类型的交互控件，变量名为```changeSymbol```。交互控件的设置界面：

![设置交互控件](https://www.fmz.com/upload/asset/1741a2b35e569c5e07e3.png)

实盘运行时，在该控件的输入框中填入```ETH_USDT```并点击按钮，```GetCommand()```会收到消息```changeSymbol:ETH_USDT```。策略检测到这条消息后更新对应的变量（策略界面上的参数也是全局变量，这里用代码中的全局变量演示）：

```javascript
// 策略参数
var symbol = "BTC_USDT"

function main() {
    while (true) {
        var cmd = GetCommand()
        if (cmd) {
            var arr = cmd.split(":")
            if (arr.length == 2 && arr[0] == "changeSymbol") {
                // 检测到 changeSymbol 控件触发，更新参数
                Log("symbol参数改为：", arr[1])
                symbol = arr[1]
            }
        }

        LogStatus(_D(), "，当前symbol参数：", symbol)
        Sleep(3000)
    }
}
```

#### 状态栏中的交互控件

除了在「策略交互」栏中设计交互控件，还可以在策略状态栏中输出交互控件。状态栏中的交互控件只有按钮，按钮与输入控件的全部字段、点击后`GetCommand`收到的命令格式见`LogStatus`的「状态栏按钮」，本页只介绍常见写法。

状态栏中的按钮分为三种：
- 普通按钮：点击后弹出确认框，确认后策略收到```cmd```。
  ```json
  {"type": "button", "name": "平仓|Close", "cmd": "close",
   "description": "平掉全部持仓|close all positions"}
  ```
- 带一个输入控件的按钮：用```input```设置输入控件，策略收到```cmd:输入值```。
  ```json
  {
      "type": "button",
      "name": "开仓|Open",
      "cmd": "open",
      "input": {"type": "number", "name": "amount", "label": "开仓数量|amount",
                "default": 1, "required": true}
  }
  ```
- 带一组输入控件的按钮：用```group```设置一组输入控件，策略收到```cmd:JSON```，键为各控件的```name```。下例中「价格」控件只在下单方式选「限价单」时显示：
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

写这些控件时注意：
- 显示条件写在```settings.filter```里（例如```"filter": "orderType==1"```），引用同一组中其它控件的```name```；写在控件顶层的```filter```不起作用。
- 必填写在控件顶层（```"required": true```）；写在```settings```里的```required```不起作用。
- 状态栏的每一行只能有一段用``` ` ```包裹的JSON。多个按钮要分行输出，或者放进状态栏表格（一个单元格放多个按钮时写成按钮数组）。
- 文字支持中英文双语，写作```"中文|English"```，按页面语言显示。

输出时把按钮对象编码成JSON字符串，用``` ` ```包裹后传给```LogStatus()```。以JavaScript为例：

```javascript
function main() {
    var btnClose = {"type": "button", "name": "平仓|Close", "cmd": "close"}
    var btnOpen = {
        "type": "button", "name": "开仓|Open", "cmd": "open",
        "input": {"type": "number", "name": "amount", "label": "开仓数量|amount", "default": 1}
    }
    // 每行一段JSON：两个按钮分两行输出
    LogStatus("`" + JSON.stringify(btnClose) + "`\n`" + JSON.stringify(btnOpen) + "`")
    while (true) {
        var cmd = GetCommand()
        if (cmd) {
            Log("收到命令：", cmd)   // "close", "open:2"
        }
        Sleep(1000)
    }
}
```

把按钮放进状态栏表格、按钮的颜色与尺寸（```class```）、下拉框多选与自定义选项、滑动条和日期选择等控件外观，见`LogStatus`。

##### 状态栏展示组件

除了文字、表格和按钮，`LogStatus`还可以直接传带 `type` 的对象，状态栏按类型显示成组件：`grid`、`tabs` 负责布局，`kpi`（指标卡）、`stat`（键值列表）、`chart`（折线、柱状、面积图）、`sparkline`、`gauge`、`progress`、`pie`、`histogram`、`heatmap`、`calendar`、`timeline`、`markdown`、`alert`、`badge` 负责展示。组件只用于展示，可以和按钮、表格放进同一个 `grid`：

```javascript
function main() {
    var btn = {type: "button", name: "平仓|Close", cmd: "close"}
    while (true) {
        var ticker = exchange.GetTicker()
        if (ticker) {
            LogStatus({type: "grid", cols: 2, items: [
                {type: "kpi", title: "最新价", value: ticker.Last},
                btn   // 按钮放进 grid 时不用加反引号
            ]})
        }
        var cmd = GetCommand()
        if (cmd) {
            Log("收到命令：", cmd)
        }
        Sleep(1000)
    }
}
```

各组件的字段与三种语言的示例见`状态栏组件`，直接传对象、反引号、多个参数的输入写法见`LogStatus`。

### 模板类库

发明者量化交易平台中可复用的代码模块，是策略代码的一种类别。支持模板类库的语言有：```JavaScript```、```Python```、```Rust```。创建策略时如果类别设置为模板类库，会在当前登录账号的策略库中创建一个模板类库，创建后不能再修改类别为普通策略。

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

导出函数是模板类库对外提供的接口，引用该模板类库的策略可以调用它们；各语言的导出方式见`模板类库`。

各语言在模板类库中声明并实现导出函数```Test```。

```javascript
/*
-- 策略引用该模板以后直接用 $.Test() 调用此方法
-- main 函数在策略中不会执行，只作为调试模板的入口
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

# 导出Test函数，策略可以通过ext.Test()调用
ext.Test = Test
```

```rust
// 策略引用该模板以后直接用 ext::Test() 调用此函数
// 供策略调用的函数必须声明为 pub
pub fn Test() {
    Log!("template call");
}
```

#### 模板类库的参数

模板类库也可以设置自己的界面参数，模板类库的参数在模板类库代码中是以全局变量的形式使用的（Rust 中为全局常量）。例如给模板类库设置一个参数：

![模板参数](https://www.fmz.com/upload/asset/2e4ab550b85e6a1cac08e.png)

| 策略代码中参数的变量名 | 策略界面上显示的参数名称 | 类型 | 默认值 |
| - | - | - | - |
| param1 | 模板参数1 | 数字型（number） | 99 |

下面的示例中，模板导出读取、修改参数的函数，策略调用它们。```Rust```模板的参数是常量，只能读取，不能修改，所以 Rust 中只能实现读取参数：

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
    Log!("调用 ext::GetParam1:", ext::GetParam1());
}
```

模板类库代码：导出读取和修改```param1```参数的函数。

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

引用上面模板类库的策略代码：用导出函数读取、修改```param1```参数。

```javascript
function main () {
    Log("调用 $.GetParam1:", $.GetParam1())
    Log("调用 $.SetParam1", "#FF0000")
    $.SetParam1(20)
    Log("调用 $.GetParam1:", $.GetParam1())
}
```

```python
def main():
    Log("调用 ext.GetParam1:", ext.GetParam1())
    Log("调用 ext.SetParam1", "#FF0000")
    ext.SetParam1(20)
    Log("调用 ext.GetParam1:", ext.GetParam1())
```

#### 引用模板类库

策略引用模板类库时，需要当前登录的发明者量化交易平台账号的策略库中存在可用的模板类库。在[策略编辑页面](https://www.fmz.com/m/add-strategy)的模板栏中勾选需要引用的模板，保存策略后即可完成引用。

![模板引用截图](https://www.fmz.com/upload/asset/2e4ee2ec7b3e7b1649af8.png)

### 内置库

策略可以直接使用平台内置的```TA```、```talib```指标库和各语言的JSON支持，不需要另外引入。各语言可用情况：

| 库 | JavaScript | Python | Rust |
| - | - | - | - |
| ```TA```指标库 | ✓ | ✓ | ✓ |
| ```talib```指标库 | ✓ | ✓（需在托管者所在机器安装 TA-Lib 和 numpy） | ✗ |
| JSON | 语言内置```JSON``` | 标准库```json``` | ```JSONParse()```/```JsonValue``` |

完整的函数列表与参数见手册 `TA`、`Talib`。

#### TA指标库

平台的```TA```指标库优化了常用指标算法（[开源TA库代码](https://www.fmz.com/bbs-topic/409)）。K 线数量不足以计算指标时，对应位置返回无效值。

```javascript
function main(){
    var records = exchange.GetRecords()
    if (!records) {
        return
    }
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

#### talib指标库

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
# Python 需要在托管者所在机器安装 TA-Lib 与 numpy，未安装时调用 talib 会报错提示安装
def main():
    records = exchange.GetRecords()
    if not records:
        return
    cci = talib.CCI(records.High, records.Low, records.Close, 14)
    Log(cci)
```

#### JavaScript：动态加载第三方库

其它第三方 JavaScript 库可以在运行时下载后用```eval```加载：

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

### 界面文字中英文

策略界面上的文字可以同时写中文和英文，网页按当前语言显示其中一种，切换语言后刷新网页生效：
- 策略名称、策略参数的描述：写成```中文|英文```。
- 策略描述、使用说明等```Markdown```文本：写成```[trans]中文|英文[/trans]```或```[trans]中文||英文[/trans]```。
- 策略代码中输出字符串的函数，例如```Log()```、```LogStatus()```：写法与```Markdown```文本相同；状态栏按钮的文字直接写```中文|英文```，不加```[trans]```标签。

```javascript
function main() {
    Log("[trans]日志|log[/trans]")
    // 按钮中不用加[trans]标签
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

### API函数速查

按API手册的分类列出全部函数、结构体和常量，每项一句话说明，点击名称查看完整文档。本页由```doc_tools/gen_api_index.py```根据手册生成。

#### 内置函数

##### Global

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
| `_D` | 将毫秒时间戳或者```Date```对象转换为时间字符串。 |
| `GetCommand` | 获取策略交互命令。 |
| `GetLastError` | 获取最近一次的错误信息。 |
| `SetErrorFilter` | 过滤错误日志。 |
| `_N` | 格式化一个浮点数。 |
| `_C` | 重试函数，用于接口容错。 |
| `_Cross` | 返回数组```arr1```与数组```arr2```的交叉周期数。 |
| `JSON.parse` | 解码（解析）JSON字符串，是ECMAScript标准内建对象```JSON```的方法。 |
| `JSON.stringify` | 编码JSON字符串，是ECMAScript标准内建对象```JSON```的方法。 |
| `Encode` | 该函数根据传入的参数对数据进行编码。 |
| `MD5` | 计算参数```data```的 MD5 哈希值。 |
| `UUID` | 创建一个 UUID。 |

##### Log

| 名称 | 说明 |
| - | - |
| `Log` | 输出日志。 |
| `LogStatus` | 刷新回测或实盘页面的状态栏：输出文字、表格、按钮，或带 `type` 的组件对象（指标卡、图表、标签页等）；每次调用替换上一次的内容。 |
| `LogProfit` | 记录盈亏值，打印盈亏数值并根据盈亏数值绘制收益曲线。 |
| `LogProfitReset` | 清空所有收益日志及收益图表。 |
| `LogReset` | 清除日志。 |
| `LogVacuum` | 用于在调用 ```LogReset()``` 函数清除日志后，回收 SQLite 删除数据时所占用的存储空间。 |
| `EnableLog` | 启用或禁用订单信息的日志记录。 |
| `Chart` | 自定义图表画图函数。 |
| `KLineChart` | 该函数用于使用类似```Pine```语言的画图方式进行策略运行时的自定义画图。 |
| `console.log` | 用于在实盘页面中的「调试信息」栏中输出调试信息。 |
| `console.error` | 用于在实盘页面中的「调试信息」栏中错误输出。 |
| `exchange.Log` | 在日志栏区域输出下单、撤单日志。 |

##### Market

| 名称 | 说明 |
| - | - |
| `exchange.GetTicker` | 获取现货或合约的Ticker结构，即行情数据；不传```symbol```时取当前设置的交易对、合约代码的行情。 |
| `exchange.GetTickers` | 获取交易所聚合行情数据（Ticker结构的数组）。 |
| `exchange.GetDepth` | 获取当前设置的交易对、合约代码所对应的现货或合约的Depth结构，即订单簿数据。 |
| `exchange.GetTrades` | 获取当前设置的交易对、合约代码所对应的现货或合约的Trade结构数组，即市场的成交数据。 |
| `exchange.GetRecords` | 获取当前设置的交易对、合约代码所对应的现货或合约的Record结构数组，即K线数据。 |
| `exchange.GetMarkets` | 获取交易所市场信息。 |
| `exchange.GetRawJSON` | 获取当前交易所对象（exchange、exchanges）最近一次```rest```请求返回的原始内容。 |
| `exchange.SetData` | 设置策略运行时所加载的数据。 |
| `exchange.GetData` | 获取由```exchange.SetData()```函数加载的数据，或外部链接提供的数据。 |

##### Trade

| 名称 | 说明 |
| - | - |
| `exchange.Buy` | 提交买单。 |
| `exchange.Sell` | 提交卖出订单。 |
| `exchange.CreateOrder` | 下单。 |
| `exchange.ModifyOrder` | 修改现有普通订单的价格和数量；也可通过附加参数修改订单的其他属性（取决于交易所API是否支持）。 |
| `exchange.CancelOrder` | 取消订单。 |
| `exchange.GetOrder` | 获取订单信息。 |
| `exchange.GetOrders` | 获取当前未完成的订单。 |
| `exchange.GetHistoryOrders` | 获取当前交易对、合约的历史订单，并支持指定具体的交易品种。 |
| `exchange.CreateConditionOrder` | 创建条件单。 |
| `exchange.ModifyConditionOrder` | 修改现有条件单，可修改条件单的下单量、触发条件和执行价格。 |
| `exchange.CancelConditionOrder` | 取消条件单。 |
| `exchange.GetConditionOrder` | 获取指定条件单的信息。 |
| `exchange.GetConditionOrders` | 获取未完成的条件单（尚未触发或尚未取消的条件单）。 |
| `exchange.GetHistoryConditionOrders` | 获取当前交易对、合约的历史条件单（包括已触发、已取消、已过期的条件单），并支持指定具体的交易品种。 |

##### Account

| 名称 | 说明 |
| - | - |
| `exchange.GetAccount` | 请求交易所账户信息。 |
| `exchange.GetAssets` | 请求交易所账户的资产信息。 |

##### Futures

| 名称 | 说明 |
| - | - |
| `exchange.SetContractType` | 设置exchange交易所对象当前的合约代码。 |
| `exchange.GetContractType` | 获取exchange交易所对象当前设置的合约代码。 |
| `exchange.SetDirection` | 设置调用exchange.Buy函数、exchange.Sell函数进行期货合约下单时的订单方向。 |
| `exchange.SetMarginLevel` | 设置```symbol```参数所指定的交易对、合约的杠杆值。 |
| `exchange.GetPositions` | 获取持仓信息。 |
| `exchange.GetFundings` | 获取当前周期资金费率数据。 |

##### Exchange

| 名称 | 说明 |
| - | - |
| `exchange.GetName` | 获取当前交易所对象所绑定的交易所名称。 |
| `exchange.GetLabel` | 获取配置交易所对象时设置的自定义标签。 |
| `exchange.GetCurrency` | 获取当前设置的交易对。 |
| `exchange.SetCurrency` | 切换交易所对象exchange当前的交易对。 |
| `exchange.GetQuoteCurrency` | 获取当前交易对的计价币名称，即```quoteCurrency```。 |
| `exchange.GetPeriod` | 获取回测或实盘运行策略时，在发明者量化交易平台网站页面上所设置的 K 线周期，即调用 ```exchange.GetRecords()``` 函数且不传入参数时使用的默认 K 线周期。 |
| `exchange.SetMaxBarLen` | 设置K线的最大长度。 |
| `exchange.SetPrecision` | 设置```exchange```交易所对象的价格与下单量的精度，设置后系统会自动忽略数据中超出精度的多余部分。 |
| `exchange.GetRate` | 获取交易所对象当前设置的汇率。 |
| `exchange.SetRate` | 设置交易所对象当前的汇率。 |
| `exchange.SetBase` | 设置exchange交易所对象所使用的交易所API接口基地址。 |
| `exchange.GetBase` | 获取当前交易所 API 接口的基础地址。 |
| `exchange.SetProxy` | 设置exchange交易所对象的代理配置。 |
| `exchange.SetTimeout` | 设置exchange交易所对象```rest```请求的超时时间。 |
| `exchange.Encode` | 签名加密计算。 |

##### IO

| 名称 | 说明 |
| - | - |
| `exchange.IO` | 调用交易所对象相关的其它接口。 |
| ```exchange.IO("api", ...)``` | 调用交易所未封装的原始REST接口，签名由平台自动处理。 |
| ```exchange.IO("currency", ...)``` | 在运行时切换交易所对象的当前交易对。 |
| ```exchange.IO("base", ...)``` | 查询或切换交易所接口的基地址。 |
| ```exchange.IO(mode, value)``` | 切换交易所的交易模式，包括模拟盘/实盘、全仓/逐仓、双向/单向持仓、统一账户、杠杆模式及自成交预防等。 |
| ```exchange.IO("rate", ...)``` | 按函数限制API函数的调用频率：```rate```为平滑限流，```quota```为额度限流。 |
| ```exchange.IO("extend", ...)``` | 向交易所对象发出的请求注入参数（例如交易所的自成交保护模式、```recvWindow```、合作方标识），无需修改下单等函数的调用方式。 |

##### Network

| 名称 | 说明 |
| - | - |
| `HttpQuery` | 发送Http请求。 |
| `HttpQuery_Go` | 发送Http请求，```HttpQuery```函数的异步版本。 |
| `Dial` | 用于原始的```Socket```访问，支持```tcp```、```tls```（也可写作```ssl```）协议，以及WebSocket的```ws```、```wss```协议。 |
| `Mail` | 发送邮件。 |
| `Mail_Go` | ```Mail```函数的异步版本。 |

##### Storage

| 名称 | 说明 |
| - | - |
| `_G` | 持久化保存数据。 |
| `DBExec` | 执行SQL语句，操作实盘数据库的数据库接口函数。 |
| `SetChannelData` | 在频道上发布最新的状态数据。 |
| `GetChannelData` | 订阅指定实盘的频道数据。 |

##### Threads

| 名称 | 说明 |
| - | - |
| `exchange.Go` | 多线程异步支持函数，可以把所有支持的函数的操作变成异步并发执行。 |
| `EventLoop` | 监听事件：当任意```WebSocket```有可读数据，或```exchange.Go()```、```HttpQuery_Go()```等并发任务完成时返回。 |
| `ctx.subscribe` | 订阅WebSocket推送，可订阅品种行情、全市场ticker或账户私有数据流，返回Subscription对象。 |
| `ctx.poll` | 获取本线程订阅的下一条推送事件，可以设置等待超时时间。 |
| `ctx.order` | 通过交易所的REST接口下单，收到交易所返回的订单号后返回。 |
| `ctx.cancel` | 通过交易所的REST接口撤销一个订单，等待交易所确认后返回。 |
| `ctx.submit` | 通过交易所的WebSocket交易接口提交下单、撤单请求：请求发送后立即返回请求号，不等待交易所应答；每笔请求的结果通过一条应答事件（```kind```为```20```）发送给发起调用的线程，通过ctx.poll获取。 |

##### Threads/Subscription

| 名称 | 说明 |
| - | - |
| `Subscription.book` | 读取本路深度订阅自身维护的订单簿，仅适用于```channel```为```depth```的订阅。 |
| `Subscription.positions` | 读取私有订阅根据推送维护的最新持仓，仅适用于```channel```为```private```的订阅。 |
| `Subscription.balances` | 读取私有订阅根据推送维护的最新余额，仅适用于```channel```为```private```的订阅。 |
| `Subscription.unsubscribe` | 退订：释放此订阅对象持有的引用；只有最后一个引用被释放时，才真正向交易所退订。 |

##### Threads/threading

| 名称 | 说明 |
| - | - |
| `threading.Thread` | 创建并发线程。 |
| `threading.getThread` | 根据指定的线程ID获取线程对象。 |
| `threading.mainThread` | 获取主线程的线程对象，即策略中```main()```函数所在的线程。 |
| `threading.currentThread` | 获取当前线程的线程对象。 |
| `threading.Lock` | 创建线程锁对象。 |
| `threading.Condition` | 创建一个条件变量对象，该对象用于在多线程并发环境中实现线程间的同步与通信。 |
| `threading.Event` | 创建一个*线程事件*对象，该对象用于线程间的同步，允许一个线程等待另一个线程的通知或信号。 |
| `threading.Dict` | 创建一个字典对象，用于在并发线程间传递和共享数据。 |
| `threading.Serve` | 在策略进程内创建Http服务、TCP服务、Websocket服务（基于Http协议），返回Server对象。 |
| `threading.pending` | 获取当前策略程序中正在运行的并发线程数量。 |

##### Threads/Thread

| 名称 | 说明 |
| - | - |
| `Thread.peekMessage` | 从线程接收消息。 |
| `Thread.postMessage` | 向线程发送消息。 |
| `Thread.join` | 等待线程退出，并回收系统资源。 |
| `Thread.terminate` | 强制终止线程，释放创建线程时占用的硬件资源。 |
| `Thread.getData` | 访问线程环境中记录的变量。 |
| `Thread.setData` | 在线程环境中存储变量。 |
| `Thread.id` | 返回当前多线程对象实例的```threadId```。 |
| `Thread.name` | 返回当前多线程对象实例的名称。 |
| `Thread.eventLoop` | 监听当前线程（调用者所在线程）接收到的事件。 |

##### Threads/ThreadLock

| 名称 | 说明 |
| - | - |
| `ThreadLock.acquire` | 请求线程锁（加锁）。 |
| `ThreadLock.release` | 释放线程锁（解锁）。 |

##### Threads/ThreadEvent

| 名称 | 说明 |
| - | - |
| `ThreadEvent.set` | 设置事件信号。 |
| `ThreadEvent.clear` | 清除信号。 |
| `ThreadEvent.wait` | 设置事件（信号）等待，在事件（信号）被设置之前会阻塞；支持设置超时参数。 |
| `ThreadEvent.isSet` | 判断事件（信号）是否已被设置。 |

##### Threads/ThreadCondition

| 名称 | 说明 |
| - | - |
| `ThreadCondition.notify` | 唤醒一个正在等待的线程（如果存在）。 |
| `ThreadCondition.notifyAll` | 唤醒所有正在等待的线程。 |
| `ThreadCondition.wait` | 在特定条件下使线程进入等待状态。 |
| `ThreadCondition.acquire` | 请求线程锁（加锁）。 |
| `ThreadCondition.release` | 释放线程锁（解锁）。 |

##### Threads/ThreadDict

| 名称 | 说明 |
| - | - |
| `ThreadDict.get` | 获取字典对象中记录的键值。 |
| `ThreadDict.set` | 设置键值对。 |

##### Threads/Server

| 名称 | 说明 |
| - | - |
| `Server.addr` | 返回服务实际监听的地址和端口。 |
| `Server.close` | 停止接收新连接，正在执行的处理函数继续执行完（优雅关闭）。 |
| `Server.stop` | 先关闭服务（同```close()```），再强制结束所有正在执行的处理函数线程。 |
| `Server.join` | 等待服务关闭且所有处理函数执行完毕。 |
| `Server.pending` | 返回当前正在执行的处理函数数量，即正在处理的连接或请求数。 |

##### TA

| 名称 | 说明 |
| - | - |
| `TA.MACD` | 计算指数平滑异同移动平均线（MACD）指标。 |
| `TA.KDJ` | 计算随机指标（KDJ）。 |
| `TA.RSI` | 计算相对强弱指标（RSI）。 |
| `TA.ATR` | 计算平均真实波幅指标（ATR）。 |
| `TA.OBV` | 计算能量潮指标（OBV）。 |
| `TA.MA` | 计算移动平均线指标（Moving Average）。 |
| `TA.EMA` | 计算指数移动平均线（EMA）指标。 |
| `TA.BOLL` | 计算布林带指标。 |
| `TA.Alligator` | 计算鳄鱼线指标（Alligator）。 |
| `TA.CMF` | 计算蔡金资金流量指标（Chaikin Money Flow）。 |
| `TA.Highest` | 计算周期内最高价。 |
| `TA.Lowest` | 计算周期最低价。 |
| `TA.SMA` | 计算简单移动平均线（SMA）指标。 |

##### Talib/OverlapStudies

| 名称 | 说明 |
| - | - |
| `talib.ACCBANDS` | 计算加速带（Acceleration Bands），返回上轨、中轨、下轨。 |
| `talib.BBANDS` | 计算布林带（Bollinger Bands），返回上轨、中轨、下轨。 |
| `talib.DEMA` | 计算双重指数移动平均线（Double Exponential Moving Average）。 |
| `talib.EMA` | 计算指数移动平均线（Exponential Moving Average）。 |
| `talib.HT_TRENDLINE` | 计算希尔伯特变换瞬时趋势线（Hilbert Transform - Instantaneous Trendline）。 |
| `talib.KAMA` | 计算考夫曼自适应移动平均线（Kaufman Adaptive Moving Average）。 |
| `talib.MA` | 计算移动平均线（Moving Average）。 |
| `talib.MAMA` | 计算MESA自适应移动平均线（MESA Adaptive Moving Average），返回MAMA、FAMA。 |
| `talib.MAVP` | 计算可变周期移动平均线（Moving Average with Variable Period）。 |
| `talib.MIDPOINT` | 计算周期中点（MidPoint over Period）。 |
| `talib.MIDPRICE` | 计算周期中点价格（Midpoint Price over Period）。 |
| `talib.SAR` | 计算抛物线转向指标（Parabolic SAR）。 |
| `talib.SAREXT` | 计算扩展抛物线转向指标（Parabolic SAR - Extended）。 |
| `talib.SMA` | 计算简单移动平均线（Simple Moving Average）。 |
| `talib.T3` | 计算T3三重指数移动平均线（Triple Exponential Moving Average (T3)）。 |
| `talib.TEMA` | 计算三重指数移动平均线（Triple Exponential Moving Average）。 |
| `talib.TRIMA` | 计算三角移动平均线（Triangular Moving Average）。 |
| `talib.WMA` | 计算加权移动平均线（Weighted Moving Average）。 |

##### Talib/MomentumIndicators

| 名称 | 说明 |
| - | - |
| `talib.ADX` | 计算平均趋向指数（Average Directional Movement Index）。 |
| `talib.ADXR` | 计算平均趋向指数评估（Average Directional Movement Index Rating）。 |
| `talib.APO` | 计算绝对价格振荡指标（Absolute Price Oscillator）。 |
| `talib.AROON` | 计算阿隆指标（Aroon），返回阿隆下降线、阿隆上升线。 |
| `talib.AROONOSC` | 计算阿隆振荡指标（Aroon Oscillator）。 |
| `talib.BOP` | 计算均势指标（Balance Of Power）。 |
| `talib.CCI` | 计算顺势指标（Commodity Channel Index）。 |
| `talib.CMO` | 计算钱德动量摆动指标（Chande Momentum Oscillator）。 |
| `talib.DX` | 计算动向指数（Directional Movement Index）。 |
| `talib.IMI` | 计算日内动量指标（Intraday Momentum Index）。 |
| `talib.MACD` | 计算指数平滑异同移动平均线（Moving Average Convergence/Divergence），返回MACD线、信号线、柱状线。 |
| `talib.MACDEXT` | 计算可指定均线类型的MACD（MACD with Controllable MA Type），返回MACD线、信号线、柱状线。 |
| `talib.MACDFIX` | 计算快慢周期固定为12/26的MACD（Moving Average Convergence/Divergence Fix 12/26），返回MACD线、信号线、柱状线。 |
| `talib.MFI` | 计算资金流量指标（Money Flow Index）。 |
| `talib.MINUS_DI` | 计算下降方向线（Minus Directional Indicator）。 |
| `talib.MINUS_DM` | 计算下降动向值（Minus Directional Movement）。 |
| `talib.MOM` | 计算动量（Momentum）。 |
| `talib.PLUS_DI` | 计算上升方向线（Plus Directional Indicator）。 |
| `talib.PLUS_DM` | 计算上升动向值（Plus Directional Movement）。 |
| `talib.PPO` | 计算价格振荡百分比（Percentage Price Oscillator）。 |
| `talib.ROC` | 计算变动率（Rate of Change），公式为`((price/prevPrice)-1)*100`。 |
| `talib.ROCP` | 计算变动率百分比（Rate of Change Percentage），公式为`(price-prevPrice)/prevPrice`。 |
| `talib.ROCR` | 计算变动率比值（Rate of Change Ratio），公式为`price/prevPrice`。 |
| `talib.ROCR100` | 计算百倍变动率比值（Rate of Change Ratio 100 Scale），公式为`(price/prevPrice)*100`。 |
| `talib.RSI` | 计算相对强弱指标（Relative Strength Index）。 |
| `talib.STOCH` | 计算随机指标（Stochastic），返回慢速K、慢速D。 |
| `talib.STOCHF` | 计算快速随机指标（Stochastic Fast），返回快速K、快速D。 |
| `talib.STOCHRSI` | 计算随机相对强弱指标（Stochastic Relative Strength Index），返回快速K、快速D。 |
| `talib.TRIX` | 计算三重指数平滑平均线变动率（1-day Rate-Of-Change (ROC) of a Triple Smooth EMA）。 |
| `talib.ULTOSC` | 计算终极振荡指标（Ultimate Oscillator）。 |
| `talib.WILLR` | 计算威廉指标（Williams' %R）。 |

##### Talib/VolumeIndicators

| 名称 | 说明 |
| - | - |
| `talib.AD` | 计算蔡金累积/派发线（Chaikin A/D Line）。 |
| `talib.ADOSC` | 计算佳庆指标（Chaikin A/D Oscillator）。 |
| `talib.OBV` | 计算能量潮（On Balance Volume）。 |

##### Talib/VolatilityIndicators

| 名称 | 说明 |
| - | - |
| `talib.ATR` | 计算平均真实波幅（Average True Range）。 |
| `talib.NATR` | 计算归一化平均真实波幅（Normalized Average True Range）。 |
| `talib.TRANGE` | 计算真实波幅（True Range）。 |

##### Talib/CycleIndicators

| 名称 | 说明 |
| - | - |
| `talib.HT_DCPERIOD` | 计算希尔伯特变换主导周期（Hilbert Transform - Dominant Cycle Period）。 |
| `talib.HT_DCPHASE` | 计算希尔伯特变换主导周期相位（Hilbert Transform - Dominant Cycle Phase）。 |
| `talib.HT_PHASOR` | 计算希尔伯特变换相量分量（Hilbert Transform - Phasor Components），返回同相分量、正交分量。 |
| `talib.HT_SINE` | 计算希尔伯特变换正弦波（Hilbert Transform - SineWave），返回正弦线、超前正弦线。 |
| `talib.HT_TRENDMODE` | 计算希尔伯特变换趋势与周期模式（Hilbert Transform - Trend vs Cycle Mode）。 |

##### Talib/PriceTransform

| 名称 | 说明 |
| - | - |
| `talib.AVGDEV` | 计算平均绝对偏差（Average Deviation）。 |
| `talib.AVGPRICE` | 计算平均价格（Average Price）。 |
| `talib.MEDPRICE` | 计算中间价（Median Price）。 |
| `talib.TYPPRICE` | 计算典型价格（Typical Price）。 |
| `talib.WCLPRICE` | 计算加权收盘价（Weighted Close Price）。 |

##### Talib/StatisticFunctions

| 名称 | 说明 |
| - | - |
| `talib.BETA` | 计算贝塔系数（Beta）。 |
| `talib.CORREL` | 计算皮尔逊相关系数（Pearson's Correlation Coefficient (r)）。 |
| `talib.LINEARREG` | 计算线性回归（Linear Regression）。 |
| `talib.LINEARREG_ANGLE` | 计算线性回归角度（Linear Regression Angle）。 |
| `talib.LINEARREG_INTERCEPT` | 计算线性回归截距（Linear Regression Intercept）。 |
| `talib.LINEARREG_SLOPE` | 计算线性回归斜率（Linear Regression Slope）。 |
| `talib.STDDEV` | 计算标准差（Standard Deviation）。 |
| `talib.TSF` | 计算时间序列预测（Time Series Forecast）。 |
| `talib.VAR` | 计算方差（Variance）。 |

##### Talib/MathTransform

| 名称 | 说明 |
| - | - |
| `talib.ACOS` | 逐个元素计算反余弦（Vector Trigonometric ACos）。 |
| `talib.ASIN` | 逐个元素计算反正弦（Vector Trigonometric ASin）。 |
| `talib.ATAN` | 逐个元素计算反正切（Vector Trigonometric ATan）。 |
| `talib.CEIL` | 把每个元素向上取整（Vector Ceil）。 |
| `talib.COS` | 逐个元素计算余弦（Vector Trigonometric Cos）。 |
| `talib.COSH` | 逐个元素计算双曲余弦（Vector Trigonometric Cosh）。 |
| `talib.EXP` | 逐个元素计算以e为底的指数（Vector Arithmetic Exp）。 |
| `talib.FLOOR` | 把每个元素向下取整（Vector Floor）。 |
| `talib.LN` | 逐个元素计算自然对数（Vector Log Natural）。 |
| `talib.LOG10` | 逐个元素计算常用对数（Vector Log10）。 |
| `talib.SIN` | 逐个元素计算正弦（Vector Trigonometric Sin）。 |
| `talib.SINH` | 逐个元素计算双曲正弦（Vector Trigonometric Sinh）。 |
| `talib.SQRT` | 逐个元素计算平方根（Vector Square Root）。 |
| `talib.TAN` | 逐个元素计算正切（Vector Trigonometric Tan）。 |
| `talib.TANH` | 逐个元素计算双曲正切（Vector Trigonometric Tanh）。 |

##### Talib/MathOperators

| 名称 | 说明 |
| - | - |
| `talib.ADD` | 把两个数组逐个元素相加（Vector Arithmetic Add）。 |
| `talib.DIV` | 用第一个数组逐个元素除以第二个数组（Vector Arithmetic Div）。 |
| `talib.MAX` | 计算周期最大值（Highest Value over a Specified Period）。 |
| `talib.MAXINDEX` | 计算周期最大值索引（Index of Highest Value over a Specified Period）。 |
| `talib.MIN` | 计算周期最小值（Lowest Value over a Specified Period）。 |
| `talib.MININDEX` | 计算周期最小值索引（Index of Lowest Value over a Specified Period）。 |
| `talib.MINMAX` | 计算周期最小值和最大值（Lowest and Highest Values over a Specified Period），返回最小值、最大值。 |
| `talib.MINMAXINDEX` | 计算周期最小值和最大值索引（Indexes of Lowest and Highest Values over a Specified Period），返回最小值索引、最大值索引。 |
| `talib.MULT` | 把两个数组逐个元素相乘（Vector Arithmetic Mult）。 |
| `talib.SUB` | 用第一个数组逐个元素减去第二个数组（Vector Arithmetic Subtraction）。 |
| `talib.SUM` | 计算周期求和（Summation）。 |

##### Talib/PatternRecognition

| 名称 | 说明 |
| - | - |
| `talib.CDL2CROWS` | 识别两只乌鸦（Two Crows）K线形态。 |
| `talib.CDL3BLACKCROWS` | 识别三只乌鸦（Three Black Crows）K线形态。 |
| `talib.CDL3INSIDE` | 识别三内部上涨和下跌（Three Inside Up/Down）K线形态。 |
| `talib.CDL3LINESTRIKE` | 识别三线打击（Three-Line Strike）K线形态。 |
| `talib.CDL3OUTSIDE` | 识别三外部上涨和下跌（Three Outside Up/Down）K线形态。 |
| `talib.CDL3STARSINSOUTH` | 识别南方三星（Three Stars In The South）K线形态。 |
| `talib.CDL3WHITESOLDIERS` | 识别三个白兵（Three Advancing White Soldiers）K线形态。 |
| `talib.CDLABANDONEDBABY` | 识别弃婴（Abandoned Baby）K线形态。 |
| `talib.CDLADVANCEBLOCK` | 识别前进受阻（Advance Block）K线形态。 |
| `talib.CDLBELTHOLD` | 识别捉腰带线（Belt-hold）K线形态。 |
| `talib.CDLBREAKAWAY` | 识别脱离（Breakaway）K线形态。 |
| `talib.CDLCLOSINGMARUBOZU` | 识别收盘光头光脚线（Closing Marubozu）K线形态。 |
| `talib.CDLCONCEALBABYSWALL` | 识别藏婴吞没（Concealing Baby Swallow）K线形态。 |
| `talib.CDLCOUNTERATTACK` | 识别反击线（Counterattack）K线形态。 |
| `talib.CDLDARKCLOUDCOVER` | 识别乌云压顶（Dark Cloud Cover）K线形态。 |
| `talib.CDLDOJI` | 识别十字星（Doji）K线形态。 |
| `talib.CDLDOJISTAR` | 识别跳空十字星（Doji Star）K线形态。 |
| `talib.CDLDRAGONFLYDOJI` | 识别蜻蜓十字（Dragonfly Doji）K线形态。 |
| `talib.CDLENGULFING` | 识别吞没（Engulfing Pattern）K线形态。 |
| `talib.CDLEVENINGDOJISTAR` | 识别黄昏十字星（Evening Doji Star）K线形态。 |
| `talib.CDLEVENINGSTAR` | 识别黄昏之星（Evening Star）K线形态。 |
| `talib.CDLGAPSIDESIDEWHITE` | 识别向上/向下跳空并列阳线（Up/Down-gap side-by-side white lines）K线形态。 |
| `talib.CDLGRAVESTONEDOJI` | 识别墓碑十字（Gravestone Doji）K线形态。 |
| `talib.CDLHAMMER` | 识别锤头线（Hammer）K线形态。 |
| `talib.CDLHANGINGMAN` | 识别上吊线（Hanging Man）K线形态。 |
| `talib.CDLHARAMI` | 识别母子线（Harami Pattern）K线形态。 |
| `talib.CDLHARAMICROSS` | 识别十字孕线（Harami Cross Pattern）K线形态。 |
| `talib.CDLHIGHWAVE` | 识别风高浪大线（High-Wave Candle）K线形态。 |
| `talib.CDLHIKKAKE` | 识别陷阱（Hikkake Pattern）K线形态。 |
| `talib.CDLHIKKAKEMOD` | 识别修正陷阱（Modified Hikkake Pattern）K线形态。 |
| `talib.CDLHOMINGPIGEON` | 识别家鸽（Homing Pigeon）K线形态。 |
| `talib.CDLIDENTICAL3CROWS` | 识别三胞胎乌鸦（Identical Three Crows）K线形态。 |
| `talib.CDLINNECK` | 识别颈内线（In-Neck Pattern）K线形态。 |
| `talib.CDLINVERTEDHAMMER` | 识别倒锤头线（Inverted Hammer）K线形态。 |
| `talib.CDLKICKING` | 识别反冲（Kicking）K线形态。 |
| `talib.CDLKICKINGBYLENGTH` | 识别按较长光头光脚线定方向的反冲（Kicking - bull/bear determined by the longer marubozu）K线形态。 |
| `talib.CDLLADDERBOTTOM` | 识别梯底（Ladder Bottom）K线形态。 |
| `talib.CDLLONGLEGGEDDOJI` | 识别长脚十字（Long Legged Doji）K线形态。 |
| `talib.CDLLONGLINE` | 识别长蜡烛线（Long Line Candle）K线形态。 |
| `talib.CDLMARUBOZU` | 识别光头光脚线（Marubozu）K线形态。 |
| `talib.CDLMATCHINGLOW` | 识别相同低价（Matching Low）K线形态。 |
| `talib.CDLMATHOLD` | 识别铺垫（Mat Hold）K线形态。 |
| `talib.CDLMORNINGDOJISTAR` | 识别十字晨星（Morning Doji Star）K线形态。 |
| `talib.CDLMORNINGSTAR` | 识别晨星（Morning Star）K线形态。 |
| `talib.CDLONNECK` | 识别颈上线（On-Neck Pattern）K线形态。 |
| `talib.CDLPIERCING` | 识别刺透（Piercing Pattern）K线形态。 |
| `talib.CDLRICKSHAWMAN` | 识别黄包车夫（Rickshaw Man）K线形态。 |
| `talib.CDLRISEFALL3METHODS` | 识别上升/下降三法（Rising/Falling Three Methods）K线形态。 |
| `talib.CDLSEPARATINGLINES` | 识别分离线（Separating Lines）K线形态。 |
| `talib.CDLSHOOTINGSTAR` | 识别射击之星（Shooting Star）K线形态。 |
| `talib.CDLSHORTLINE` | 识别短蜡烛线（Short Line Candle）K线形态。 |
| `talib.CDLSPINNINGTOP` | 识别纺锤线（Spinning Top）K线形态。 |
| `talib.CDLSTALLEDPATTERN` | 识别停顿（Stalled Pattern）K线形态。 |
| `talib.CDLSTICKSANDWICH` | 识别条形三明治（Stick Sandwich）K线形态。 |
| `talib.CDLTAKURI` | 识别探水竿（Takuri (Dragonfly Doji with very long lower shadow)）K线形态。 |
| `talib.CDLTASUKIGAP` | 识别跳空并列阴阳线（Tasuki Gap）K线形态。 |
| `talib.CDLTHRUSTING` | 识别插入线（Thrusting Pattern）K线形态。 |
| `talib.CDLTRISTAR` | 识别三星（Tristar Pattern）K线形态。 |
| `talib.CDLUNIQUE3RIVER` | 识别奇特三河床（Unique 3 River）K线形态。 |
| `talib.CDLUPSIDEGAP2CROWS` | 识别向上跳空的两只乌鸦（Upside Gap Two Crows）K线形态。 |
| `talib.CDLXSIDEGAP3METHODS` | 识别上升/下降跳空三法（Upside/Downside Gap Three Methods）K线形态。 |

##### OS

| 名称 | 说明 |
| - | - |
| `ListFilesResult` | 文件列表对象，用于记录目录列表信息。 |
| `FileStat` | 文件统计信息对象。 |

##### OS/os

| 名称 | 说明 |
| - | - |
| `os.open` | 以指定模式打开文件。 |
| `os.fgets` | 一次性读取整个文件的内容。 |
| `os.fputs` | 向文件写入内容。 |
| `os.mmap` | 读取整个文件，以 ArrayBuffer 返回文件的二进制数据。 |
| `os.getRootDir` | 获取文件操作的根目录路径。 |
| `os.listFiles` | 列出目录中的文件和子目录。 |
| `os.exists` | 检查指定的文件或目录是否存在。 |
| `os.remove` | 删除指定文件或空目录。 |
| `os.mkdir` | 创建目录。 |
| `os.rmdir` | 删除目录及其所有内容。 |
| `os.rename` | 重命名文件或移动文件。 |
| `os.stat` | 获取文件的详细统计信息。 |
| `os.exit` | 退出程序。 |

##### OS/File

| 名称 | 说明 |
| - | - |
| `File.close` | 关闭文件并释放相关资源。 |
| `File.puts` | 向文件写入一个或多个字符串。 |
| `File.printf` | 格式化写入数据到文件。 |
| `File.flush` | 刷新文件缓冲区，确保数据写入磁盘。 |
| `File.tell` | 获取当前文件指针的位置。 |
| `File.seek` | 将文件指针移动到指定位置。 |
| `File.eof` | 检查文件指针是否已到达文件末尾。 |
| `File.read` | 从文件中读取数据。 |
| `File.write` | 向文件写入字符串数据。 |
| `File.getline` | 从文件中读取下一行内容。 |
| `File.toString` | 获取文件对象的字符串表示形式。 |

#### 结构体

| 名称 | 说明 |
| - | - |
| `Ticker` | ```exchange.GetTicker()```返回的行情：最高价、最低价、卖一价、买一价、最新成交价、开盘价、成交量与持仓量。 |
| `Depth` | ```exchange.GetDepth()```返回的市场深度：卖盘```Asks```、买盘```Bids```（OrderBook数组）与时间戳。 |
| `OrderBook` | 市场深度（Depth）里卖盘、买盘的一档：价格与数量。 |
| `Trade` | ```exchange.GetTrades()```返回的市场成交记录，包含成交Id、时间、价格、数量和方向。 |
| `Record` | K线柱的数据结构，标准的OHLC格式，用于绘制K线图和技术指标计算分析。 |
| `Market` | ```exchange.GetMarkets()```返回的品种市场信息：交易币与计价币、价格与数量的步长和精度、下单数量与金额的上下限、合约面值。 |
| `Order` | ```exchange.GetOrder()```、```exchange.GetOrders()```等返回的订单：订单Id、价格、数量、成交数量、成交均价、状态、方向、开平仓、合约代码与条件单配置。 |
| `Condition` | 条件单的配置：条件单类型，以及止盈、止损的触发价与委托价。 |
| `Account` | ```exchange.GetAccount()```返回的账户信息：计价币与交易币的可用、冻结数量，期货另有权益与未实现盈亏。 |
| `Asset` | ```exchange.GetAssets()```返回的数组中的一项：一个币种的可用数量与冻结数量。 |
| `Position` | ```exchange.GetPositions()```返回的持仓：品种、杠杆、持仓量与冻结量、持仓均价、浮动盈亏、持仓方向、合约代码与保证金。 |
| `Funding` | ```exchange.GetFundings()```返回的资金费率信息：品种、结算周期、时间与费率；仅加密货币永续合约有资金费率。 |

##### OtherStruct

| 名称 | 说明 |
| - | - |
| `HttpQuery-options` | 此JSON结构用于配置HttpQuery函数和HttpQuery_Go函数发送HTTP请求的各项参数。 |
| `HttpQuery-return` | 该JSON结构是调用HttpQuery函数时，在参数```options```结构中将debug字段指定为true后，HttpQuery函数在调试模式下返回的数据结构。 |
| `LogStatus-table` | 状态栏表格，用LogStatus输出：列可以设置数值格式、涨跌色和单位，单元格可以合并、放按钮，多个表格可以分页显示。 |
| `LogStatus-btnTypeOne` | 状态栏按钮JSON结构的旧写法（输入控件不带```settings```），平台仍然兼容；新代码使用LogStatus-btnTypeTwo，字段说明见LogStatus的「状态栏按钮」。 |
| `LogStatus-btnTypeTwo` | 状态栏按钮的JSON结构（当前写法，输入控件带```settings```）。 |
| `Chart-options` | 该JSON用于设置自定义画图函数```Chart()```的图表配置信息，图表库使用的是Highcharts。 |
| `Chart-return` | Chart函数返回的图表对象，用于写入数据、更新配置和清空图表。 |
| `KLineChart-options` | 此JSON用于设置自定义绘图函数```KLineChart```的图表配置信息。 |
| `KLineChart-return` | KLineChart函数返回的图表对象，以类似```Pine```语言的方式在K线上画图。 |
| `SetData-data` | 该JSON用于设置```exchange.SetData()```函数所要加载的数据。 |
| `EventLoop-return` | 该JSON是```EventLoop()```函数返回的数据结构。 |
| `exchange.Go-return` | exchange.Go函数返回的并发对象，用```wait()```方法取得并发调用的结果。 |
| `DBExec-return` | 该JSON是```DBExec()```函数返回的数据结构；使用```Dial()```函数创建的对象的```exec()```方法执行SQL语句时，也返回此JSON数据结构。 |
| `Dial-return` | Dial函数返回的连接对象。 |
| `Thread.join-return` | 该JSON是```Thread```对象的成员函数```join()```返回的数据结构，用于保存```JavaScript```语言策略中并发线程的相关信息。 |

##### OtherStruct/LogStatus-display

| 名称 | 说明 |
| - | - |
| `grid` | 网格布局：把多个组件排成几列，容器变窄时自动减少列数。 |
| `tabs` | 标签页：每页放一组组件，点击切换；状态栏刷新时保持当前选中的页。 |
| `kpi` | 指标卡：醒目显示一个数值，可带单位、涨跌幅和说明，适合权益、收益率、最新价。 |
| `stat` | 键值列表：一组「名称—数值」，适合账户余额、冻结资金、杠杆、强平价等明细。 |
| `progress` | 进度条：显示一个比例，或「当前值 / 总数」。 |
| `gauge` | 仪表盘：用半圆刻度显示数值在区间中的位置，可按阈值变色，适合RSI、仓位、风险度。 |
| `sparkline` | 迷你走势图：一个数值加一条小折线，默认按首尾涨跌着色。 |
| `chart` | 简易图表：折线、柱状或面积，支持多条序列、右侧纵轴和买卖点标记；需要更多配置时用Chart。 |
| `heatmap` | 热力图：二维网格按数值深浅着色，适合时段 × 品种的收益、相关性矩阵。 |
| `calendar` | 收益日历：按日的热力格（类似贡献图），或按年 × 月的收益表。 |
| `histogram` | 分布图：传原始数据，自动分组统计次数，并显示样本数、均值、中位数和正值占比。 |
| `pie` | 饼图：各部分占总数的比例，默认环形，中心显示合计。 |
| `timeline` | 时间线：按顺序列出事件，适合成交记录、交易信号、风控事件。 |
| `markdown` | 按Markdown排版显示文本：标题、列表、粗体、表格等，适合策略说明与行情解读。 |
| `alert` | 提示条：带图标的提示、成功、警告或错误信息，适合风控与异常提示。 |
| `badge` | 状态标签：一组带圆点的小标签，在行内显示，可以跟在一行文字后面。 |

#### 内置变量与常量

##### EXCHANGE

| 名称 | 说明 |
| - | - |
| `exchange` | 在策略实盘设置、回测设置中添加的第一个交易所对象。 |
| `exchanges` | 交易所对象数组，包含在策略实盘设置或回测设置中添加的所有交易所对象，其中 exchanges[0] 即为 exchange。 |

##### ORDER_STATE

| 名称 | 说明 |
| - | - |
| `ORDER_STATE_PENDING` | 订单未完成（挂单中，可能已部分成交），值为```0```。 |
| `ORDER_STATE_CLOSED` | 订单已完成（全部成交），值为```1```。 |
| `ORDER_STATE_CANCELED` | 订单已取消，值为```2```。 |
| `ORDER_STATE_UNKNOWN` | 订单状态未知（其它状态），值为```3```。 |

##### ORDER_TYPE

| 名称 | 说明 |
| - | - |
| `ORDER_TYPE_BUY` | 买单，值为```0```。 |
| `ORDER_TYPE_SELL` | 卖单，值为```1```。 |
| `ORDER_TYPE_NONE` | 无方向，值为```2```。 |

##### ORDER_CONDITION_TYPE

| 名称 | 说明 |
| - | - |
| `ORDER_CONDITION_TYPE_OCO` | OCO订单（One-Cancels-the-Other，二选一）：同时设置止盈和止损条件，其中一个触发后另一个自动取消，值为```0```。 |
| `ORDER_CONDITION_TYPE_TP` | 止盈单（Take Profit）：价格达到止盈触发价时下单，值为```1```。 |
| `ORDER_CONDITION_TYPE_SL` | 止损单（Stop Loss）：价格达到止损触发价时下单，用于限制损失，值为```2```。 |
| `ORDER_CONDITION_TYPE_GENERIC` | 通用条件单：具体行为取决于交易所，只出现在查询结果中，值为```3```。 |

##### POSITION_DIRECTION

| 名称 | 说明 |
| - | - |
| `PD_LONG` | 多头持仓，值为```0```。 |
| `PD_SHORT` | 空头持仓，值为```1```。 |

##### ORDER_OFFSET

| 名称 | 说明 |
| - | - |
| `ORDER_OFFSET_OPEN` | 开仓，值为```0```。 |
| `ORDER_OFFSET_CLOSE` | 平仓，值为```1```。 |

##### PERIOD

| 名称 | 说明 |
| - | - |
| `PERIOD_M1` | 1分钟K线周期，值为```60```。 |
| `PERIOD_M3` | 3分钟K线周期，值为```180```。 |
| `PERIOD_M5` | 5分钟K线周期，值为```300```。 |
| `PERIOD_M15` | 15分钟K线周期，值为```900```。 |
| `PERIOD_M30` | 30分钟K线周期，值为```1800```。 |
| `PERIOD_H1` | 1小时K线周期，值为```3600```。 |
| `PERIOD_H2` | 2小时K线周期，值为```7200```。 |
| `PERIOD_H4` | 4小时K线周期，值为```14400```。 |
| `PERIOD_H6` | 6小时K线周期，值为```21600```。 |
| `PERIOD_H12` | 12小时K线周期，值为```43200```。 |
| `PERIOD_D1` | 1天K线周期，值为```86400```。 |
| `PERIOD_D3` | 3天K线周期，值为```259200```。 |
| `PERIOD_W1` | 1周K线周期，值为```604800```。 |

##### LOG_TYPE

| 名称 | 说明 |
| - | - |
| `LOG_TYPE_BUY` | 买单日志，值为```0```。 |
| `LOG_TYPE_SELL` | 卖单日志，值为```1```。 |
| `LOG_TYPE_CANCEL` | 撤单日志，值为```2```。 |

#### 通用约定

| 名称 | 说明 |
| - | - |
| `品种代码` | 交易所对象的函数用字符串参数```symbol```指定品种。 |
| `失败与空值` | ### 调用失败返回空值 |

#### 交易所

| 名称 | 说明 |
| - | - |
| `能力矩阵` | 各交易所对象对标准函数与交易模式指令的支持情况。 |

## 开发工具

编写和调试策略的工具：策略编辑器（含AI助手和历史版本）、调试工具，以及用本地编辑器远程编辑策略。

### 策略编辑器

在[新建策略页面](https://www.fmz.com/m/add-strategy)或者从[策略库](https://www.fmz.com/m/strategies)打开一个现有策略，进入**编辑页面**（例如策略ID为123456的地址为```https://www.fmz.com/m/edit-strategy/123456```）编写策略。

![线上策略编辑器界面](https://www.fmz.com/upload/asset/2e50fff4160187be92248.png)

本章介绍编辑器的辅助功能。与编辑页面相关的其它功能：
- `远程编辑`：用本地编辑器编写，自动同步到平台。
- `回测配置与保存`：把回测配置和策略参数随策略保存。
- `完整策略的导入与导出`：导出、导入包含参数等全部信息的完整策略。

#### 编辑器快捷操作

- **命令面板**：在代码编辑区点击鼠标右键，选择「命令面板」，可以查看各项功能的快捷键和编辑器命令。

  ![策略编辑器中菜单的命令面板显示](https://www.fmz.com/upload/asset/2e429269f02185dfbab3b.png)

- **定义与引用跳转**：选中要查询的内容，点击鼠标右键：
  - 转到定义：跳转到所查询内容的定义位置。
  - 转到引用：跳转到所查询内容的引用位置。
  - 快速查看-速览定义：不离开当前代码行，查看选中代码的定义。
  - 快速查看-查看引用：不离开当前代码行，查看其它代码行对它的引用，并可快速跳转。

- **语法手册速查**：在「代码」编辑区按住```⌘```（Mac）或```Ctrl```（Windows）不放，把鼠标移到**变量名**或**函数名**上会出现跳转链接，点击后弹出「语法手册」并定位到该内容。

  ![策略编辑器中语法手册速查](https://www.fmz.com/upload/asset/2e4d0722af99164f69996.png)

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

#### 策略文档

线上策略编辑页面把策略代码、策略描述、使用说明、开发记录等信息分开记录。

![策略文档选项说明](https://www.fmz.com/upload/asset/2e47983c191c1779bd52e.png)

- 代码：策略程序的源码。
  平台上一个完整的策略包含：策略源码、`策略参数`设计、`交互控件`设计、`模板类库`引用。
- 笔记：记录策略开发过程中的内容。
- 描述：策略公开展示时显示的介绍。
- 手册：只有租用策略后才能看到的说明。

#### 历史版本管理

历史版本是策略在某一时刻的快照，可以用来回滚、对比代码，也可以让实盘运行指定的版本。在**策略编辑页面**「代码」编辑区内点击「历史版本」按钮，打开历史版本管理页面。

##### 创建与管理快照
- 创建：当前策略还没有快照时，点击「立即创建」；已有快照时，点击右侧快照列表上方的「创建历史版本」。快照包括策略代码、笔记、描述、手册、参数设计、交互设计等。
- 管理：可以修改快照名称、删除快照，或把策略恢复到某个快照的版本。
- 预览：点击页面左下角的「预览」，查看选中快照中的代码、笔记、描述、手册、参数设计、交互设计等。
- 对比：点击页面左下角的「对比」，比较选中快照与当前策略的差异。

##### 实盘运行历史版本
- **设置默认运行版本**：在历史版本管理页面选中某个版本，点击菜单中的「修改」，在弹框中勾选「设置为默认版本」。不设置时默认运行最新版本。
- **在实盘中使用历史版本**：创建实盘或修改实盘参数时，策略所有者可以选择策略的某个历史版本来运行；此功能仅对策略所有者有效。
- **出租策略的版本控制**：租用方只能运行策略所有者设置的默认运行版本，不能选择其他历史版本；所有者通过设置默认运行版本控制出租策略使用的版本。

### 调试工具

[调试工具](https://www.fmz.com/m/debug)页面提供了一个用于快速测试实盘代码的免费环境，目前仅支持```JavaScript```语言。

![调试工具](https://www.fmz.com/upload/asset/2e48d6d1bc77e46099058.png)

使用调试工具测试代码时，代码将直接在指定的托管者上运行，最长运行时间为5分钟。支持调用发明者量化交易平台的所有API函数，但仅支持单个交易所对象。

### 远程编辑

可以用本地编辑器编写策略，保存时自动同步到发明者量化交易平台。支持```VSCode```、```Vim```、```Sublime Text 3```，```JavaScript```策略还可以用```WebStorm```，```Python```策略还可以用```PyCharm```。

![远程编辑截图](https://www.fmz.com/upload/asset/2e4e8975d1e32517fd989.png)

#### 使用步骤
1. 在策略编辑页面点击「远程编辑」。弹出的窗口上方是各编辑器插件的下载链接，点击跳转到对应的插件页面安装，不同编辑器的安装方式略有差别。
2. 窗口中显示当前策略的远程同步密钥（token）。密钥为空时，点击「更新密钥」生成。
3. 把策略源码保存到本地，在源码第一行插入窗口中给出的密钥行（例如```JavaScript```为```// fmz@<密钥>```，```Python```为```# fmz@<密钥>```），之后每次保存都会自动同步到平台。

也可以不装插件，用```curl```直接上传本地源码（窗口中有带密钥的完整命令），例如：

```bash
curl -T quant.js -H "Authorization: Bearer <密钥>" https://www.fmz.com/rsync
```

#### 管理密钥
- 「更新密钥」：生成新密钥，原密钥随即失效。
- 「删除密钥」：删除当前策略的密钥，关闭远程编辑。
- 策略超过30天没有任何修改（网页保存或远程同步）时，同步会被拒绝（返回码405）；在网页上保存一次策略或「更新密钥」即可恢复。
- 用```curl```上传时，源码不能超过8MB。

拿到密钥的人可以改写这个策略的源码，不要把密钥公开。

## 回测系统

用历史数据检验策略：回测系统用历史行情驱动策略代码，模拟撮合与账户，给出收益、回撤等结果。回测只反映策略在历史行情下的表现，不代表未来收益。

### 概述与发起回测

回测用平台的历史行情驱动策略代码：回测引擎维护一个虚拟时钟，为每个交易所对象维护一个模拟账户，策略调用的行情、下单、账户等函数都由引擎按历史数据应答。回测结果只反映策略在历史行情下的表现，历史行情不能代表未来，对回测结果要理性、客观地看待。

#### 发起回测

- 网页：打开策略编辑页面，切换到「模拟回测」分页，设置回测配置和策略参数后点击「开始回测」（快捷键见`回测页面快捷键`）。回测配置可以保存进策略源码，见`回测配置与保存`。
- AI助手：通过MCP工具```run_backtest```发起回测、```get_backtest```读取结果，见`AI接入`。MCP发起的回测只使用模拟级Tick模式。
- 本机：使用开源的本地回测引擎，见`本地回测引擎`。

#### 回测配置项

| 配置项 | 说明 |
| - | - |
| 时间范围 | 回测的开始时间和结束时间。 |
| K线周期 | 策略调用```GetRecords()```默认得到的K线周期。 |
| 底层K线周期 | 模拟级Tick模式下用来生成tick的K线周期。 |
| 模式 | 模拟级Tick或实盘级Tick，见`回测模式与撮合`。 |
| 交易所、交易对 | 每个交易所对象有各自的模拟账户；交易对写成```BTC_USDT```的形式。 |
| 初始资金 | 计价币（如USDT）和交易币（如BTC）的初始余额。 |
| 手续费 | 挂单（maker）和吃单（taker）费率，单位为百分比。 |
| 滑点 | 加在模拟盘口买一价、卖一价外侧的跳数（价格最小变动单位的个数），默认为0。 |
| 网络延迟 | 策略每调用一次交易所接口，虚拟时钟前进的毫秒数，默认为200。 |
| 深度档位、每档数量 | ```GetDepth()```返回的档位数（1～20）和模拟盘口每档的数量。 |
| K线最大条数 | 第一次调用```GetRecords()```时返回的历史K线条数上限（100～5000，默认300）。 |
| 日志条数 | 回测保留的运行日志、收益日志、图表数据的条数上限。 |
| 数据源 | 默认使用平台的历史数据，也可以使用`自定义数据源`。 |

补充说明：
- 底层K线周期越小，生成的tick越接近真实行情，回测也越慢；策略K线由底层K线合成，K线周期不能小于底层K线周期。
- 加密货币期货交易所的合约默认为```swap```（永续合约），要使用其它合约时先在策略中调用```exchange.SetContractType()```设置。
- 币本位合约以交易币作保证金，需要设置交易币余额。
- 手续费默认取该交易所市场的配置。限价单下单时立即成交按吃单费率计算，挂在盘口上之后才成交按挂单费率计算。
- 滑点只在模拟级Tick模式下生效，实盘级Tick模式直接使用回放的真实盘口；实盘级Tick模式下，深度档位是向数据源请求的真实深度档数。

#### 容错测试

回测页面另外提供「容错测试」：按一定概率（默认0.5）让交易所接口调用失败，并且每种接口的第一次调用一定失败，失败时记录错误日志```FaultTolerant Test```。用于检验策略对接口失败的处理，例如是否用```_C()```重试。

#### 回测中的策略

- ```IsVirtual()```返回```true```，不应在回测中执行的逻辑可以据此跳过，见`IsVirtual`。
- 时间是虚拟时间：```Unix()```、```_D()```等读取的是回测时钟，```Sleep()```推动时钟前进。时钟越过结束时间时，引擎抛出```EOF```异常结束回测，此时```JavaScript```、```Python```策略不会调用```onexit()```（处理方法见 `onexit()`）；```Rust```策略会自动调用```onexit()```。
- 回测中```GetCommand()```收不到交互命令，不支持```onerror()```，网络请求类功能受限。

### 回测模式与撮合

回测分为**模拟级Tick**和**实盘级Tick**两种模式。两者都基于真实的历史数据：模拟级Tick由K线生成tick，实盘级Tick回放真实记录的tick，后者更精确，也更慢。

#### 模拟级Tick

回测引擎在每根底层K线的开盘价、最高价、最低价、收盘价构成的价格框架内，沿 开盘→最低/最高→收盘 的路径生成2～14个模拟tick，K线的成交量分摊到这些tick上；策略调用行情接口时得到的是当前模拟tick的数据。因此每根底层K线上有多个回测时间点，策略可以在一根K线内多次交易，而不是只能按收盘价成交。底层K线周期越小，生成的tick越接近真实走势，回测也越慢。机制详见[回测系统模拟级别机制说明](https://www.fmz.com/bbs-topic/662)、[回测系统机制说明](https://www.fmz.com/digest-topic/4009)。

模拟盘口：卖一价 = 当前tick收盘价 + 一跳 + 滑点，买一价 = 收盘价 − 一跳 − 滑点（滑点以跳数计）；```GetDepth()```从买一、卖一开始向外返回若干档模拟深度，相邻两档的间隔等于买一与卖一的价差（2跳 + 2倍滑点），每档数量为配置中的「每档数量」。

#### 实盘级Tick

使用平台真实记录的逐秒tick数据，包含盘口深度（档位可设置，最多20档），可以选择回放逐笔成交数据；```GetDepth()```、```GetTrades()```返回回放的真实数据。平台数据服务对每个品种的单次数据请求有上限（50MB，另有53万条记录的上限），两种模式都受此限制（自定义数据源不受限），实盘级Tick数据量大、回测慢，受到的影响最明显，可回测的时间范围因此受限；需要更长的时间范围时，可以降低深度档位、不使用逐笔成交数据。较早的时间段可能没有实盘级数据，时间范围不宜选得过早。实盘级Tick模式下，策略循环中的```Sleep()```宜设得短一些（例如100毫秒）。

#### 行情时刻的推进

两种模式下，在某个行情时刻，```GetTicker()```、```GetDepth()```、```GetTrades()```、```GetRecords()```各调用一次不会推动回测时间；再次调用其中同一个函数时，回测时间跳到下一个行情时刻。

#### 撮合规则

两种模式使用相同的撮合规则：

- 按价格触及成交，并且一次全部成交，回测中不会出现部分成交。
- 市价单在当前tick按卖一价/买一价成交；现货市价买单的数量是计价币金额。
- 限价买单价格大于等于卖一价、限价卖单价格小于等于买一价时成交，挂单后的每个tick都会检查。下单时立即成交的，按市场价成交并收取吃单（taker）手续费；挂在盘口之后被价格触及而成交的，按委托价成交并收取挂单（maker）手续费。
- 实盘级Tick模式下，挂在买一/卖一价位上的订单，要等排在它前面的挂单量被消耗后才成交。
- 期货开仓按 名义价值 ÷ 杠杆 冻结保证金，另外冻结预估的手续费；行情数据中包含资金费率时，永续合约按资金费率结算资金费。

#### 数据粒度的影响

同一个策略在不同的数据粒度下（实盘级Tick、底层K线周期较小的模拟级Tick、底层K线周期较大的模拟级Tick等）回测，交易次数和盈亏都会不同。数据粒度大时回测快，但结果可能失真，回测时应尽量使用较小的数据粒度。可以用下面的策略在几种粒度下分别回测对比：

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

#### 保存

- 点击「保存回测设置」：把回测配置和策略参数以注释（```backtest```注释块）的形式写在策略源码开头。
- 点击「保存策略」：平台同时记录当前的回测配置和策略参数。

#### 载入

- 打开或刷新策略编辑页面时，优先载入源码中```backtest```注释块记录的配置。
- 源码中没有```backtest```注释块时，载入最后一次「保存策略」时记录的配置。
- 在源码中手动修改了```backtest```注释块后，点击注释块上方的「回测设置」按钮，把修改同步到回测页面的选项中。

#### 注释块格式

在该语言的块注释起始符后紧接着写```backtest```，之后每行一个```键: 值```：

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

各语言的注释写法：JavaScript、Rust、PINE语言使用```/*backtest ... */```；Python使用```'''backtest ... '''```；My语言使用```(*backtest ... *)```。

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

回测页面上的其他选项（滑点、网络延迟、容错概率、K线最大条数等）不写进注释块，而是在「保存策略」时随策略记录保存。本地回测引擎也读取这个注释块，但只读取其中一部分键，见`本地回测引擎`。

### 支持范围

回测系统支持哪些编程语言和交易所，以及各语言策略在哪里回测。

#### 编程语言

回测系统支持以下语言编写的策略：JavaScript、Python、Rust、[PINE语言](https://www.fmz.com/bbs-topic/9315)、[My语言](https://www.fmz.com/bbs-topic/2569)、Workflow工作流。

- JavaScript策略在浏览器中回测，回测引擎以WebAssembly形式运行，不需要安装任何软件。JavaScript策略回测时可以在Chrome浏览器的DevTools中调试，见[参考说明](https://www.fmz.com/digest-topic/9459)。
- Rust策略由平台服务器编译；策略中通过frontmatter声明的第三方crate在编译时自动获取，本地不需要安装工具链。回测节点默认为「云端」（在平台服务器上运行），也可以选择「本地」，在浏览器中运行。
- Python策略的回测节点默认为「云端」（平台的公共服务器），也可以选择自己的托管者，或者选择「本地: Python3」在浏览器中回测（以Pyodide运行）。在托管者上回测与实盘一样依赖托管者所在系统的Python 3环境，需要的第三方库要自行安装；公共服务器只提供常用的库。
- Workflow工作流策略回测时可以可视化查看各节点的执行状态和数据流转。

#### 交易所

回测数据来自平台的历史数据，可以回测的交易所以回测页面中可选的为准（也可以通过MCP工具```list_exchanges```查看，```backtest```为```true```的交易所有历史数据）。

- 加密货币：主流交易所的现货和期货，例如```Binance```与```Futures_Binance```、```OKX```与```Futures_OKX```、```HTX```与```Futures_HTX```、```Bybit```与```Futures_Bybit```、```Bitget```与```Futures_Bitget```、```GateIO```与```Futures_GateIO```，支持交易所的全部品种。

  这里列的是回测用的交易所ID（回测配置```/*backtest*/```与MCP工具```run_backtest```中的```eid```，与历史数据服务器的名称一致）。大多数交易所与实盘中```exchange.GetName()```的返回值相同，少数不同：回测的```OKX```、```Futures_OKX```对应实盘的```OKEX```、```Futures_OKCoin```（OKX 期货）；回测的```HTX```、```Futures_HTX```对应实盘的```Huobi```、```Futures_HuobiDM```（HTX 期货）。策略中按交易所名称分支时，要同时考虑这两种写法。
- 富途证券（```Futures_Futu```）：港股、美股等市场。回测只支持日线级别数据，```currency```设置为```STOCK```，在策略中用```exchange.SetContractType()```设置股票代码：

```javascript
/*backtest
start: 2024-05-01 00:00:00
end: 2025-02-17 00:00:00
period: 1d
basePeriod: 1d
exchanges: [{"eid":"Futures_Futu","currency":"STOCK","fee":[0.03,0.03]}]
*/

function main() {
    // 设置股票代码：特斯拉
    var info = exchange.SetContractType("TSLA.US")
    // 合约信息：InstrumentID、PriceTick、LotTick、VolumeMultiple等
    Log("info:", info)
    // 回测时间点的日线行情
    Log(exchange.GetTicker())
}
```

### 结果解读

回测结束后，回测页面显示收益曲线、统计指标、状态信息、日志信息和账户信息。

#### 收益曲线

策略调用```LogProfit()```（`LogProfit`）时，收益曲线由记录的收益值组成，下面的统计指标也按这个收益序列计算。策略不调用```LogProfit()```时，回测页面按回测引擎记录的账户快照计算盈亏，据此画出曲线、计算统计指标（使用第一个交易所账户的盈亏）。

MCP工具```get_backtest```返回的```profit```、```max_drawdown```来自```LogProfit()```记录的收益，其中```max_drawdown```是收益序列从峰值到谷值的最大回落（绝对值，不是比例）；策略没有收益记录时，```profit```为回测引擎统计的收益，并且不返回```max_drawdown```。

#### 统计指标

统计指标由收益序列```profits```（每个元素为```[时间戳, 收益]```）和初始资产```totalAssets```按下面的算法计算：

| 指标 | 含义 |
| - | - |
| 收益率（totalReturns） | 最后一个收益值 ÷ 初始资产。 |
| 年化收益（annualizedReturns） | 收益率 × 一年的时长（yearDays天）÷ 回测时长，按比例线性折算。 |
| 最大回撤（maxDrawdown） | 资产（初始资产 + 收益）相对此前最高点下跌的最大比例。 |
| 胜率（winningRate） | 收益序列中高于前一个点的点所占的比例（第一个点与0比较）。 |
| 波动率（volatility） | 每天的收益额 ÷ 初始资产，乘以yearDays折算为年化值，取这些值的总体标准差。 |
| 夏普比率（sharpeRatio） | （年化收益 − 无风险利率3%）÷ 波动率；波动率为0时为0。 |

- 最大回撤：maxDrawdownStartTime为回撤开始前资产最高点的时间，maxDrawdownTime为回撤最深的时间。
- 胜率：统计的是收益记录，不是逐笔交易的胜率。
- 波动率：把回测时间按天切分计算每天的收益，没有收益记录的日子按0计。
- yearDays是年化时使用的一年天数，固定为365。波动率是把每日收益率直接乘以yearDays年化，而不是常见的乘以√yearDays，因此这里的夏普比率不宜与其他平台的数值直接比较。

算法源码：

```javascript
function returnAnalyze(totalAssets, profits, ts, te, period, yearDays) {
    // 按天统计
    period = 86400000
    if (profits.length == 0) {
        return null
    }
    var freeProfit = 0.03   // 无风险利率
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

#### 数据下载

- 状态栏数据下载：回测结束后，在「状态信息」栏右上角点击「下载表格」，下载回测结束时状态栏数据的CSV文件。
- 日志数据下载：在「日志信息」栏右上角点击「下载表格」，下载回测日志的CSV文件。

### 参数调优

回测时按设置的范围生成多组参数，逐组回测。在「模拟回测」分页的策略参数部分，勾选参数右侧的**调优**选项后出现调优设置：

- 最小值：参数的起始值。
- 最大值：参数递增后的最大值。
- 步长：每次递增的量。
- 并发线程：参数调优时同时执行的回测数。该选项只对在浏览器中运行的回测生效：JavaScript、PINE、My语言策略，以及回测节点选择「本地」的Python、Rust策略；其它情况按1个并发执行。引用的模板的参数同样可以勾选调优，参与参数组合。

回测系统按```最小值```、```最大值```、```步长```生成参数组合，对每种组合各回测一次。只有**数字型（number）**的策略参数可以设置调优。

### 自定义数据源

回测系统可以使用自定义数据源代替平台的历史数据：在回测配置中把交易所的数据源设为自定义数据源（feeder）的地址，回测时由平台的数据服务器用```GET```方法请求这个URL获取数据，因此该URL必须能从公网访问。请求附加的参数如下：

| 参数 | 意义 | 说明 |
| - | - | - |
| symbol | 品种名 | 现货如```BTC_USDT```，期货如```BTC_USDT.swap```；资金费率、价格指数见下方说明 |
| eid | 交易所 | 例如：OKX、Futures_OKX |
| round | 数据精度 | 固定为```round=true```，数值按精度放大为整数，见`数据格式` |
| period | K线数据的周期（毫秒） | 例如：```60000```为1分钟周期 |
| depth | 深度档数 | 1-20 |
| trades | 是否需要逐笔成交数据 | 是（1）/否（0）；模拟级Tick回测时固定为0 |
| from | 开始时间 | Unix时间戳，单位为秒 |
| to | 结束时间 | Unix时间戳，单位为秒 |
| detail | 品种详细信息 | 固定为```detail=true```，要求返回数据中带有品种详细信息 |
| event | 请求类型 | ```feed```：回测开始时请求行情数据；```fill```：K线不足时补取更早的K线 |
| custom | -- | 可以忽略该参数 |

- 永续合约回测时还会请求资金费率数据（```symbol```形如```BTC_USDT.funding```）和价格指数数据（```symbol```形如```BTC_USDT.index```），见`数据格式`。
- ```event=fill```的请求固定为```depth=2&trades=0&custom=0```，```period```为```900000```或```86400000```。

回测系统向自定义数据源发送的请求示例（现货、期货交易所对象各一条）：

```url
http://customserver:9090/data?custom=0&depth=20&detail=true&eid=Bitget&event=feed&from=1351641600&period=86400000&round=true&symbol=BTC_USDT&to=1611244800&trades=0
http://customserver:9090/data?custom=0&depth=20&detail=true&eid=Futures_OKX&event=feed&from=1351641600&period=86400000&round=true&symbol=BTC_USDT.swap&to=1611244800&trades=0
```

#### 数据格式

自定义数据源返回JSON数据，格式为下面两种之一，系统自动识别：模拟级Tick用K线数据，实盘级Tick用盘口深度和逐笔成交数据。数值都按精度放大为整数，见下文「数值精度」。

##### 模拟级Tick

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

##### 实盘级Tick

数据中包含盘口深度，深度格式为```[价格, 量]```的数组，可以有多档：```asks```按价格升序，```bids```按价格降序。

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

##### 顶层字段

| 字段 | 说明 |
| - | - |
| detail | 请求品种的详细信息，例如交易币、计价币、精度、最小下单量，见下文「detail字段」 |
| schema | ```data```数组中各列的属性，区分大小写 |
| data | 按```schema```的列结构记录的数据 |

```schema```可用的列：```time```、```open```、```high```、```low```、```close```、```vol```、```asks```、```bids```、```trades```、```position```（持仓量）、```data```（自定义数据）。其中```asks```、```bids```、```trades```的格式：

| 列 | 格式 | 示例（实盘级Tick范例中的数据） |
| - | - | - |
| asks / bids | ```[[价格, 数量], ...]``` | ```[[9531300, 10]]``` |
| trades | ```[[时间, 方向, 价格, 数量], ...]```，方向0为买、1为卖 | ```[[1564315200000, 0, 9531300, 10]]``` |

##### 数值精度

请求中固定带```round=true```，返回的数值都写成按精度放大后的整数，以免传输过程中丢失浮点数精度：

- 价格类数值（```open```、```high```、```low```、```close```，```asks```/```bids```和```trades```中的价格）= 实际值 × 10^```quotePrecision```。
- 数量类数值（```vol```，```asks```/```bids```和```trades```中的数量）= 实际值 × 10^```basePrecision```。

例如上面的范例中```quotePrecision```为3，```9531300```表示价格9531.300；```basePrecision```为5，```787```表示数量0.00787。时间列（```time```及```trades```中的时间）是毫秒时间戳，不放大。

##### detail字段

| 字段 | 说明 |
| - | - |
| eid | 交易所Id，注意同一交易所的现货与期货是不同的eid |
| symbol | 交易品种代码 |
| alias | 该品种在交易所中的symbol |
| baseCurrency | 交易币种 |
| quoteCurrency | 计价币种 |
| marginCurrency | 保证金币种 |
| basePrecision | 交易币种精度 |
| quotePrecision | 计价币种精度 |
| minQty | 最小下单量 |
| maxQty | 最大下单量 |
| minNotional | 最小下单金额 |
| maxNotional | 最大下单金额 |
| priceTick | 价格一跳 |
| volumeTick | 下单量最小变动数值（下单量一跳） |
| marginLevel | 期货杠杆值 |
| contractType | 永续合约设置为```swap```，回测系统会继续请求资金费率、价格指数数据 |

##### 永续合约的资金费率与价格指数

期货交易所的永续合约回测时，自定义数据源还需要提供资金费率数据和价格指数数据：

- 行情数据的```detail```中包含```"contractType": "swap"```时，回测系统才会继续请求资金费率数据，并且只在策略持有该永续合约的仓位、或者调用```GetFundings()```时才请求。声明了```swap```却拿不到资金费率数据时，回测报错```symbol ... not found```。
- 收到资金费率数据后，回测系统才会继续请求价格指数数据。
- 资金费率数据只读取```open```列作为费率值，并按资金费率数据```detail```中的```priceTick```截断，所以其```priceTick```要足够小（例如```0.00000001```）。
- 资金费率数据相邻两条间隔8小时，与K线数据一样按精度放大为整数，可以为负值。下例中```quotePrecision```为8，```-16795```表示资金费率-0.00016795。

资金费率数据（请求的```symbol```形如```BTC_USDT.funding```）：

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

回测系统发出的资金费率数据请求示例：

```url
http://customserver:9090/data?custom=0&depth=20&detail=true&eid=Futures_Binance&from=1351641600&period=86400000&round=true&symbol=BTC_USDT.funding&to=1611244800&trades=0
```

价格指数数据（请求的```symbol```形如```BTC_USDT.index```）：

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

回测系统发出的价格指数数据请求示例：

```url
http://customserver:9090/data?custom=0&depth=20&detail=true&eid=Futures_Binance&from=1351641600&period=86400000&round=true&symbol=BTC_USDT.index&to=1611244800&trades=0
```

#### 自定义数据源范例

本页给出一个用Go编写的最简自定义数据源服务，以及验证它的测试策略。使用步骤：

1. 把下面的服务程序部署在能从公网访问的服务器上，数据源地址即为```http://<服务器地址>:9090/data```（```<服务器地址>```替换为该服务器的公网IP或域名）。
2. 在回测配置中把交易所的数据源（```feeder```）设为这个地址，用后面的测试策略回测。

服务程序：

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

测试策略（```JavaScript```）：

```javascript
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

平台开源了JavaScript和Python的本地回测引擎，与云端回测使用相同的引擎核心和历史数据（从平台的数据服务器下载），可以在自己的电脑上快速回测JavaScript、Python策略。源码：

- [Python回测引擎](https://github.com/fmzquant/backtest_python)
- [JavaScript回测引擎](https://github.com/fmzquant/backtest_javascript)

#### Python

安装（需要Python 3和pip）：

```bash
pip install https://github.com/fmzquant/backtest_python/archive/master.zip
pip install pandas matplotlib   # 仅在使用 Join(True)、Show() 时需要
```

第一次使用时会从数据服务器下载对应系统的引擎文件，之后除了历史数据不再联网。策略文件就是普通的FMZ策略，加上开头的```backtest```配置注释（格式见`回测配置与保存`，本地引擎只读取其中一部分键，见下文「与云端回测的区别」）和几行引擎调用代码：

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
# 按上方注释中的配置初始化回测引擎，exchange、Log、TA 等成为全局对象
task = VCtx(__doc__)

# 以下为待测试的策略代码，可以从平台直接复制
def main():
    Log(exchange.GetAccount())
    while True:
        r = exchange.GetRecords()
        if r:
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

用```python strategy.py```运行。```task.Join(False)```返回原始回测结果的JSON，```task.Join(True)```返回第一个交易所账户在各快照时刻的盈亏（PnL）和资金占用率（Utilization）组成的pandas表格，```task.Show()```根据账户快照画出权益、盈亏和资金占用图表；两者都不依赖```LogProfit()```。

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
// 从这里开始 exchange、Log、TA 等成为全局对象，粘贴策略代码后调用 main()

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
    // 虚拟时钟到达结束时间时，引擎抛出 "EOF"
}
var result = JSON.parse(task.Join())    // 与 Python 引擎 Join(False) 的结果相同
console.log(result.LogsCount)
```

#### 与云端回测的区别

- 只支持JavaScript和Python策略，不会自动加载模板：策略引用的模板代码需要粘贴到文件中，因此依赖交易类库的PINE、My语言策略不能在本地回测。
- 策略参数不会自动注入，需要在代码中定义为全局变量。
- 注释中的```start```、```end```按本机时区解析；网络延迟固定为200毫秒，不支持滑点和实盘级Tick模式。
- 只读取注释中的```start```、```end```、```period```、```basePeriod```和```exchanges```（其中的```eid```、```currency```、```balance```、```stocks```、```fee```、```feeMin```），忽略```mode```、```args```以及```depthDeep```、```tradesMode```、```feeder```等。没有写```basePeriod```时按```period```推导（1d→1h、1h→30m、30m→15m、15m→5m、5m→1m），没有写```stocks```时默认为3，没有写```fee```时使用引擎内置的费率表，建议都显式写出。

#### AI回测

在AI助手中可以直接让它回测：AI助手通过MCP工具```run_backtest```发起云端回测，用```get_backtest```读取收益、回撤、错误日志等结果，见`AI接入`。也可以让AI助手在本机安装本地回测引擎，快速修改、回测，再用云端回测确认一次。

### 回测页面快捷键

在策略编辑页面和回测页面，可以用下表中的快捷键切换页面、保存策略和开始回测。

| 快捷键 | 作用 |
| - | - |
| ```Ctrl + ,``` | 在策略编辑页面和回测页面之间切换（按住```Ctrl```再按```,```） |
| ```Ctrl + s``` | 保存策略 |
| ```Ctrl + b``` | 开始回测 |

## 进阶专题

进阶用法：JavaScript多线程、实盘之间通信、API限流、期权交易、Web3链上交易。

### JavaScript多线程

JavaScript策略可以用```threading```对象创建真正并行执行的线程，并用消息、共享字典、锁等对象在线程之间通信。本页说明怎么选用、怎么组织线程代码；各函数的参数和返回值见语法手册`Threads`。

#### 先选对工具

| 需求 | 推荐 | 适用语言 |
| - | - | - |
| 同时发出几个API请求（如同时取多个交易所的行情），等结果回来 | `exchange.Go`，配合`EventLoop`等待完成事件 | 所有语言 |
| 长时间在后台运行的任务：独立的行情采集、风控巡检、耗时计算 | `threading.Thread` | 仅JavaScript |
| 在策略内提供HTTP、WebSocket或TCP服务 | `threading.Serve` | 仅JavaScript |

只是并发几个请求时，```exchange.Go()```更简单，也不需要处理线程间的数据传递。本页的```threading```对象只适用于JavaScript策略，Python、Rust策略请使用```exchange.Go()```。

回测系统中可以调用这些函数，但线程实际是按顺序执行的，只用于保证代码在回测中能运行。

#### 线程运行在隔离的环境中

传给```threading.Thread()```的函数在一个独立的JavaScript环境中执行，这是写线程代码时最需要注意的一点：

- 线程函数**不能引用外部的变量和闭包**，也不能调用策略里自定义的其它函数。需要的数据通过```threading.Thread(func, arg1, arg2, ...)```的参数传入。
- 普通对象、数组作为参数时是**深拷贝**：线程里修改它不影响其它线程。需要多个线程看到同一份数据时，使用```threading.Dict()```创建的字典。
- 函数也可以作为参数传入；```threading.Thread()```还支持传入函数源码字符串，用于在线程中加载外部库。
- 线程里可以直接调用平台的API函数，如```exchange.GetTicker()```、```Log()```。
- 线程函数的返回值通过```join()```取回：```t.join().ret```。

#### 线程之间怎样交换数据

| 方式 | 用法 | 说明 |
| - | - | - |
| 消息 | ```postMessage(msg)```发送，```peekMessage(timeout)```读取，见表后说明 | 每个线程有自己的收件箱，按顺序读取 |
| 共享字典 | ```var d = threading.Dict()```，作为参数传入线程后各线程```d.get(key)```、```d.set(key, value)``` | 适合保存「最新状态」，例如最新行情、运行标志 |
| 线程数据 | ```t.setData(key, value)```、```t.getData(key)``` | 挂在某个线程对象上的键值，线程结束（```join()```、```terminate()```）后失效 |
| 同步对象 | ```threading.Lock()```、```threading.Event()```、```threading.Condition()``` | 作为参数传入线程，用于互斥访问和等待通知 |

消息的收发：```t.postMessage(msg)```发给线程```t```；线程内用```threading.currentThread().peekMessage(timeout)```读取自己收到的消息，```peekMessage(-1)```不阻塞，没有消息时返回空值；子线程用```threading.mainThread().postMessage(msg)```发回主线程。

线程收到消息时也会产生事件，可以用线程对象的`eventLoop`统一等待消息和其它事件。

#### 线程的生命周期

- ```t.join()```等待线程结束并取回返回值，可以设置超时；```t.terminate()```强制结束线程。
- 线程结束且不再被引用时，资源会自动回收，不必为了释放资源调用```join()```。线程数量没有固定上限（2000个的上限只针对```exchange.Go()```、```HttpQuery_Go()```尚未取走结果的并发任务）。
- ```threading.pending()```返回正在运行的线程数（包括主线程）。
- 实盘停止时所有线程一起结束。```peekMessage()```、```join()```、锁和事件的等待都会被停止打断。

#### 在策略内提供服务

```threading.Serve(地址, 处理函数, ...参数)```在策略进程内启动HTTP（含WebSocket）或TCP服务，每个请求或连接在独立的线程中调用处理函数，返回`Server`对象（```addr()```取实际监听地址，```close()```关闭）。处理函数与线程函数一样运行在隔离环境中，需要的数据通过参数传入，常用```threading.Dict()```与主线程共享状态。地址写法、```ctx```对象的方法见`Serve`。

旧的全局函数```__Serve()```仍可使用，它只返回监听地址字符串，新代码请使用```threading.Serve()```。

多个线程并行计算，主线程汇总结果；交易对通过参数传入，线程函数不引用外部变量。

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
            var close = records[records.length - 1].Close
            return {symbol: symbol, close: close, ma20: ma[ma.length - 1]}
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

后台线程把最新价写进共享字典、用消息报告异常，主线程用消息通知它退出。

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

用```threading.Serve```提供状态查询接口：HTTP处理函数从参数取到共享字典，返回JSON。

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

#### 使用要点

- **首次读取即订阅**：对某个频道第一次调用```GetChannelData()```时完成订阅并返回空值（```null```/```None```），之后服务端把该频道的更新推送到本实盘，再调用就能读到最新数据。订阅端应在启动时就开始读取，并处理空值。
- **订阅上限**：每个实盘最多订阅10个不同的频道（包括下面的UUID频道）。超出时该次调用返回空值（```null```/```None```），并记录一条错误日志```channel subscriber exceed limit```，策略不会因此中止。
- **数据格式**：JavaScript、Python的```SetChannelData()```可以传入任何可以JSON序列化的数据，订阅端读到的是解析后的对象。数据不变时不会重复发送。数据大小限制见`SetChannelData`。
- **Rust**：```SetChannelData(string)```只接受字符串，需要自己拼好JSON文本；```GetChannelData()```不带参数，读取的是本实盘自己的频道；读取其它实盘或UUID频道用```GetChannelDataOf(频道ID)```，返回```JsonValue```（首次调用为```Null```，数据是JSON时为解析后的值，否则为字符串）。
- **跨平台推送**：外部系统（如TradingView告警、自建程序）可以通过扩展API的```method=pub```向指定实盘推送一个以32位UUID标识的频道数据，实盘用```GetChannelData(UUID)```读取，请求格式与投递规则见`pub`，另见`GetChannelData`。
- **实盘功能**：频道通信用于实盘之间，回测时不要依赖它。当前实盘ID可以用```_G()```获取。
- 不要在频道中传递密钥等敏感信息。

广播端：发布行情摘要。

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
                r#"{{"robotId": "{}", "updateId": {}, "timestamp": {},
                    "symbol": "BTC_USDT", "lastPrice": {}}}"#,
                robotId, updateId, Unix() * 1000, ticker.Last
            );
            SetChannelData(&state);
            LogStatus!("频道", robotId, "第", updateId, "次发布，最新价:", ticker.Last);
        }
        Sleep(60000);  // 每分钟发布一次
    }
}
```

订阅端：读取两个频道。

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
                msg += "频道 " + channels[i] + "：#" + state.updateId + " " +
                    _D(state.timestamp) + " 最新价 " + state.lastPrice + "\n"
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
                msg += "频道 {}：#{} {} 最新价 {}\n".format(
                    ch, state["updateId"], _D(state["timestamp"]), state["lastPrice"])
            else:
                msg += "频道 {}：等待数据\n".format(ch)
        LogStatus(msg)
        Sleep(5000)
```

```rust
fn main() {
    // 要订阅的实盘ID（按实际情况修改）
    let channels = ["632799", "632800"];

    loop {
        let mut msg = String::new();
        for ch in channels.iter() {
            // 第一次调用完成订阅并返回 Null，之后返回最新数据
            let state = GetChannelDataOf(*ch);
            if !state.is_null() {
                msg += &format!("频道 {}：#{} {} 最新价 {}\n", ch,
                    state["updateId"].as_i64().unwrap_or(0),
                    _D(state["timestamp"].as_i64().unwrap_or(0)),
                    state["lastPrice"].as_f64().unwrap_or(0.0));
            } else {
                msg += &format!("频道 {}：等待数据\n", ch);
            }
        }
        LogStatus!(msg);
        Sleep(5000);
    }
}
```

场景一，主从策略协同：主策略计算均线交叉信号并发布。

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

场景一，主从策略协同：从策略读取信号，在信号变化时下单。

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
fn main() {
    let masterId = "632799";  // 主策略的实盘ID
    let mut lastSignal = String::new();

    loop {
        let data = GetChannelDataOf(masterId);
        if data.is_null() {
            LogStatus!("等待主策略信号...");
        } else {
            let signal = data["signal"].as_str().unwrap_or("").to_string();
            let symbol = data["symbol"].as_str().unwrap_or("BTC_USDT");
            if signal != lastSignal {
                Log!("收到新信号:", signal.as_str(), "信号价格:", data["price"].as_f64().unwrap_or(0.0));
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
            LogStatus!("当前信号:", signal.as_str(), "信号时间:", _D(ts));
        }
        Sleep(5000);
    }
}
```

场景二，多策略状态监控：各策略按广播端的方式发布状态，监控实盘读取所有频道并用表格展示，超过2分钟没有更新的标记为异常。

```javascript
function main() {
    var monitorList = ["632799", "632800", "632801"]  // 最多10个

    while (true) {
        var table = {
            type: "table", title: "策略运行状态",
            cols: ["实盘ID", "状态", "最后更新", "交易对", "最新价"], rows: []
        }
        for (var i = 0; i < monitorList.length; i++) {
            var data = GetChannelData(monitorList[i])
            if (data) {
                var status = Date.now() - data.timestamp < 120000 ? "运行中" : "异常"
                table.rows.push([monitorList[i], status, _D(data.timestamp),
                                 data.symbol || "-", data.lastPrice || "-"])
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
        table = {
            "type": "table", "title": "策略运行状态",
            "cols": ["实盘ID", "状态", "最后更新", "交易对", "最新价"], "rows": []
        }
        for robotId in monitorList:
            data = GetChannelData(robotId)
            if data:
                status = "运行中" if time.time() * 1000 - data["timestamp"] < 120000 else "异常"
                table["rows"].append([robotId, status, _D(data["timestamp"]),
                                      data.get("symbol", "-"), data.get("lastPrice", "-")])
            else:
                table["rows"].append([robotId, "等待数据", "-", "-", "-"])
        LogStatus("`" + json.dumps(table) + "`")
        Sleep(10000)
```

```rust
fn main() {
    let monitorList = ["632799", "632800", "632801"];  // 最多10个

    loop {
        let mut rows = Vec::new();
        for robotId in monitorList.iter() {
            let data = GetChannelDataOf(*robotId);
            if !data.is_null() {
                let ts = data["timestamp"].as_i64().unwrap_or(0);
                let status = if Unix() * 1000 - ts < 120000 { "运行中" } else { "异常" };
                let price = data["lastPrice"].as_f64()
                    .map(|p| p.to_string()).unwrap_or("-".to_string());
                rows.push(format!(r#"["{}", "{}", "{}", "{}", "{}"]"#, robotId, status, _D(ts),
                    data["symbol"].as_str().unwrap_or("-"), price));
            } else {
                rows.push(format!(r#"["{}", "等待数据", "-", "-", "-"]"#, robotId));
            }
        }
        let table = format!(
            r#"{{"type": "table", "title": "策略运行状态",
                "cols": ["实盘ID", "状态", "最后更新", "交易对", "最新价"], "rows": [{}]}}"#,
            rows.join(", "));
        LogStatus!(format!("`{}`", table));
        Sleep(10000);
    }
}
```

See also: `SetChannelData`, `GetChannelData`, `_G`

### API限流控制

交易所对API调用频率有限制，超限轻则请求被拒，重则账号被临时封禁。用```exchange.IO("rate", ...)```或```exchange.IO("quota", ...)```可以在托管者本地给标准函数设置调用频率上限：超限的调用不会发出请求。

```javascript
exchange.IO("rate" | "quota", 名字, 次数, 窗口[, "delay"])
```

#### 两种模式

- **rate（令牌桶）**：桶容量默认等于```次数```，开始时是满的，之后按「次数/窗口」的速度匀速补充，每次调用消耗一个。允许短时间连续调用，长期平均不超过「次数/窗口」。```次数```写成```"10/5"```时表示每个窗口补充10次、桶容量为5，用来限制突发。
- **quota（固定窗口）**：每个窗口内最多调用```次数```次，进入下一个窗口时清零。窗口按时间纪元对齐：```1s```对齐整秒，```1m```对齐整分钟，```1h```对齐整点，```1d```对齐UTC零点（即北京时间08:00）。例如12:00:00.900开始计数，到12:00:01.000就进入了新窗口。

需要严格保证「任意一个交易所计数周期内不超过N次」时用```quota```并让窗口与交易所的计数周期一致；只需要控制平均频率时用```rate```。

#### 参数

参数写法（多个函数名用逗号分隔、```*```兜底规则、```rate```模式的```"次数/突发"```、窗口时长与```@HHMM```每日定时清零、```delay```动作、删除规则）见语法手册`exchange.IO`分类中的```exchange.IO("rate", ...)```。

#### 可以限制的函数名

| 类别 | 名字 |
| - | - |
| 行情 | ```GetTicker```、```GetTickers```、```GetDepth```、```GetTrades```、```GetRecords```、```GetMarkets```、```GetFundings``` |
| 账户 | ```GetAccount```、```GetAssets```、```GetPositions```、```SetMarginLevel``` |
| 交易 | ```CreateOrder```（```Buy```、```Sell```也计入）、```CancelOrder```、```ModifyOrder``` |
| 订单查询 | ```GetOrder```、```GetOrders```、```GetHistoryOrders``` |
| 条件单 | ```CreateConditionOrder```、```ModifyConditionOrder```、```CancelConditionOrder``` |
| 条件单查询 | ```GetConditionOrder```、```GetConditionOrders```、```GetHistoryConditionOrders``` |
| 自定义请求 | ```IO/api```：只限制```exchange.IO("api", ...)```，不影响其它```exchange.IO()```指令 |

- ```GetAccount```和```GetAssets```是同一个底层请求，写其中任何一个名字的规则对两个函数都生效。
- 通过```exchange.Go()```并发调用时，按实际调用的函数计数。

#### 规则的作用范围

- 规则按交易所对象分别设置：```exchanges[0]```上的规则不影响```exchanges[1]```。
- 规则只在本次运行中有效，实盘重启后需要重新设置，通常写在```main()```开头。
- 同一个名字再次设置时覆盖原规则；名字传空字符串（```exchange.IO("rate", "")```）清空该交易所对象上的全部规则。
- 一次调用只按一条规则计数：有专属规则的函数不再计入```*```，所以```*```不能当作「所有调用的总配额」叠加在专属规则之上。

#### 超限时的表现

默认动作下，超限的调用不发请求，按调用失败处理（JavaScript返回```null```，Python返回```None```，Rust返回```Err```），错误信息形如：

```text
rate limit exceeded: GetTicker 10/1s
quota limit exceeded: GetTicker 10/1m
quota limit exceeded: GetRecords 2000/day (resets at 0800)
```

使用```delay```动作时调用会阻塞到有可用次数，日志中记录的调用时间是等待结束之后的时间。对每天清零的规则使用```delay```，最长可能等待到第二天，请谨慎使用。

默认动作：超限的调用直接失败。

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

按交易所的限频规则分组设置：行情和交易各共用一条规则，交易类超限时等待而不是失败，其余函数用```*```兜底。

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
        let (t, d) = (exchange.GetTicker("BTC_USDT"), exchange.GetDepth("BTC_USDT"));
        if let (Ok(ticker), Ok(depth)) = (t, d) {
            Log!("最新价:", ticker.Last, "买一:", depth.Bids[0].Price);
        }
        Sleep(1000);
    }
}
```

突发容量、每日配额，以及删除规则。

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

发明者量化交易平台支持在下表的加密货币期货交易所交易期权。期权的用法与期货合约相同：用```exchange.SetContractType()```把合约设为期权代码（期权代码就是交易所的原生代码，各交易所写法不同），之后```GetTicker()```、```GetDepth()```等行情函数，```Buy()```、```Sell()```（下单前用```exchange.SetDirection()```设置交易方向）、```CancelOrder()```、```GetPositions()```等交易函数都作用于该期权合约。也可以用完整的交易品种代码直接下单，形如```交易对.期权代码```，例如```BTC_USDT.BTC-261225-100000-C```。

期权合约的盘口通常较薄：买一、卖一没有挂单时```Ticker```的```Buy```、```Sell```为0，从未成交的合约```Last```也可能为0，各交易所的处理见交易所页。```exchange.GetMarkets()```是否列出期权合约因交易所而异；不列出时，期权代码需要从交易所的接口或网页获取。

| 交易所对象 | 交易对示例 | 期权代码示例 | GetMarkets列出期权 |
| - | - | - | - |
| `Futures_Deribit` | ```BTC_USD``` | ```BTC-25DEC26-100000-C``` | 是 |
| `Futures_OKCoin`（OKX 期货） | ```BTC_USD``` | ```BTC-USD-261225-100000-C``` | 否 |
| `Futures_Binance` | ```BTC_USDT``` | ```BTC-261225-100000-C``` | 否 |
| `Futures_Bybit` | ```ETH_USDT``` | ```ETH-25JUN27-2800-C-USDT``` | 是 |
| `Futures_Aevo` | ```ETH_USDC``` | ```ETH-25DEC26-3000-C``` | 是 |
| `Futures_GateIO` | ```BTC_USDT``` | ```BTC_USDT-20261225-100000-C``` | 是 |
| `Futures_Kraken` | ```ETH_USD``` | ```OF_ETHUSD_261225_4000_C``` | 否 |

以上代码中的到期日、行权价只是示例，实际可交易的合约以交易所当前挂牌为准。

期权的具体规则因交易所而异，写在各交易所页的「期权」一节：期权代码的写法（例如Deribit的组合期权、Kraken代码中BTC写作```XBT```）、```exchange.GetMarkets()```不列出期权时从哪里获取期权代码、下单限制（有的交易所只支持限价单，不支持改单、条件单或```exchange.SetMarginLevel()```），以及```Ticker```的```Last```在没有成交时是否取标记价格。点击上表中的交易所名称查看。

See also: `exchange.SetContractType`, `exchange.SetDirection`, `exchange.GetPositions`

### Web3

链上交易：选哪个交易所对象。

| 需求 | 交易所对象 | 说明 |
| - | - | - |
| 在EVM链的DEX上兑换代币 | ```Uniswap```（Uniswap、PancakeSwap、Aerodrome）、```KyberSwap```、```OneInch```（1inch） | 用现货交易函数下单，见`EVM链上兑换（Uniswap、KyberSwap、1inch）` |
| 在Solana上兑换代币 | ```Jupiter``` | 见`Solana兑换（Jupiter）` |
| 通过OKX DEX聚合器在多条链上兑换 | ```OKX_DEX``` | 用助记词配置；交易对写作```{链编号}:{代币}_USD```，代币名区分大小写，见`OKX_DEX`交易所页 |
| 查询链上数据、调用智能合约、发送自定义交易 | ```Web3``` | 支持以太坊等EVM兼容链（见`以太坊（EVM）`）和波场（见`波场（TRON）`） |

Hyperliquid、Lighter、EdgeX、Aster、Polymarket等链上交易所与中心化交易所一样，用标准交易函数操作，配置见语法手册`去中心化交易所`、`预测市场`中的交易所页。

#### EVM链上兑换（Uniswap、KyberSwap、1inch）

Uniswap交易所对象（```exchange.GetName()```返回```Uniswap```）在一条EVM链上连接Uniswap、PancakeSwap或Aerodrome的池子，把链上兑换映射为现货交易函数：用```exchange.GetTicker()```看价格、用```exchange.CreateOrder()```下单，不需要自己注册ABI、编码合约调用。选路、询价、代币授权、价格保护、发送交易都由交易所对象完成。同一套实现还有两个聚合器版本：```KyberSwap```与```OneInch```（1inch），报价和交易数据来自聚合器，在众多DEX和做市商之间拆单选路。

##### 选哪个交易所对象

| 需求 | 交易所对象 |
| - | - |
| 在指定DEX的池子上兑换，能控制路径（V2/V3/V4、直连或两跳） | ```Uniswap```，配置DEX为Uniswap、PancakeSwap或Aerodrome |
| 由聚合器在全网DEX中找最优价，不需要API Key | ```KyberSwap``` |
| 由1inch聚合器找最优价（需要1inch API Key） | ```OneInch``` |
| 调用其它合约、提供流动性、管理V3头寸、自定义交易 | ```Web3```，见`以太坊（EVM）` |
| Solana链上兑换 | ```Jupiter```，见`Solana兑换（Jupiter）` |

一个策略可以同时添加多个交易所对象，使用同一个钱包，例如用```Uniswap```和```KyberSwap```比价，用```Web3```做其它链上操作。

##### 配置交易所对象

- ```DEX```：只有```Uniswap```交易所对象有：```Uniswap```、```PancakeSwap```、```Aerodrome```（只在Base上）
- ```Chain```：一个交易所对象只对应一条链，可选的链见下表
- ```Private Key```：钱包私钥（十六进制字符串）。可以把私钥本地化部署在托管者上，见`本地凭据文件`
- ```Rpc Address```：该链的节点地址，选择Chain时自动填入默认节点（```主节点,备用节点```）。多个节点用逗号分隔，某个节点出错或缺少数据时自动换下一个
- ```Rpc Api Key```：节点鉴权，可以留空。写成```名称: 值```时作为该名称的请求头发送，否则作为```Authorization: Basic <值>```发送。```OneInch```没有这一项
- ```1inch Api Key```：只有```OneInch```有，必填：在1inch开发者门户申请

各链可用的DEX与聚合器：

| 链 | Uniswap | PancakeSwap | Aerodrome | KyberSwap | OneInch |
| - | - | - | - | - | - |
| Ethereum | V2、V3、V4 | V2、V3 | — | ✓ | ✓ |
| Arbitrum | V3、V4 | V2、V3 | — | ✓ | ✓ |
| Base | V3、V4 | V2、V3、Infinity | Slipstream、基础池子 | ✓ | ✓ |
| BNB Chain | V3、V4 | V2、V3、Infinity | — | ✓ | ✓ |
| Unichain | V2、V3、V4 | — | — | ✓ | ✓ |
| Polygon | V3、V4 | — | — | ✓ | ✓ |
| OP Mainnet | V3、V4 | — | — | ✓ | ✓ |
| Robinhood | V2、V3、V4 | — | — | ✓ | — |
| Arc | V2、V3、V4 | — | — | — | — |

- V4（Uniswap）和Infinity（PancakeSwap Infinity CL）只使用不带hook的池子；原生币直接参与兑换，不经包装币。
- 钱包里需要有该链的原生币支付gas：ETH、BNB；Polygon为POL（包装币WPOL）；Arc用USDC支付gas。
- 第一次请求时会核对节点所在的链与Chain是否一致，不一致时报错，不会把交易发到别的链上。
- 节点要能查询已上链交易的回执，否则查不到订单状态。publicnode的Base、BNB Chain、Arbitrum公共节点查不到回执，不要单独使用；自己配置节点时先确认这一点。

##### 交易对

- 交易对写作```ETH_USDC```、```UNI_USDT```这样的```基础币_计价币```。
- 代币名先查代币表（内置的原生币、包装币、USDC、USDT等常用代币，以及用```exchange.IO("token", 名字, 合约地址)```登记的代币），再查内置的官方代币列表。同一条链上有同名代币时请改用合约地址，例如```0x1f9840a85d5af5bf1d1762f925bdaddc4201f984_USDC```；直接写合约地址时会从链上读取精度并自动登记。
- **原生币与包装币是两种资产**：```ETH```与```WETH```、```BNB```与```WBNB```是不同的币。两者之间不能下单，用```exchange.IO("wrap", 数量)```、```exchange.IO("unwrap", 数量)```1:1互换，只花gas。
- 链上的特殊写法：Unichain、Polygon上的USDT写作```USDT0```；Robinhood链上没有USDC、USDT，稳定币为USDG（```ETH_USDG```）；Arc上原生余额就是USDC，交易对写作```WETH_USDC```、```EURC_USDC```。
- ```exchange.GetMarkets()```只列出常用的交易对，没有列出的交易对同样可以交易。

##### 下单

DEX没有挂单簿，每笔订单都是一次立即执行的链上兑换：要么整笔成交，要么整笔回滚（只损失gas），不会部分成交、也不会挂着等价格。

- **限价单**：限价是**最差成交价**。下单时先询价，按当前价格达不到限价时直接报错，不发交易；达得到时把「最少得到/最多支付」写进交易，上链前价格变动导致达不到时整笔回滚。
- **市价单**：按询价结果扣除滑点保护，滑点默认0.5%，用```exchange.IO("slippage", 比例)```修改。
- **数量**：卖出时是卖出的基础币数量；限价买入时是要买到的基础币数量；**市价买入时是要花费的计价币数量**。
- **聚合器只支持精确输入**：```KyberSwap```、```OneInch```的限价买入按“最多花费数量×价格、至少买到数量”执行，实际买到的可能略多。Aerodrome的基础池子同样只支持精确输入，限价买入只走Slipstream池子。
- **单笔设置**：方向参数后可以附加JSON，例如```exchange.CreateOrder("ETH_USDC", 'sell;{"slippage":0.01,"route":"v3"}', -1, 0.1)```：```slippage```为本单滑点；```route```限定路径类型：```v2```、```v3```、```v4```、```hop```（两跳）、```direct```（直连）。Aerodrome上```v2```指基础池子，```v3```指Slipstream。
- **授权**：卖出ERC20代币前会检查授权额度，不够时先发授权交易并等待上链。V2、V3池子授权给路由合约；V4与Infinity经各自的Permit2合约；聚合器直接授权给聚合器的路由合约。默认只授权本次需要的数量，```exchange.IO("approve", "max")```改为无限授权。
- **截止时间**：交易超过截止时间（默认120秒，```exchange.IO("deadline", 秒数)```修改）仍未上链时会回滚，避免价格大幅变化后才成交。

下单前可以用```exchange.IO("route", ...)```只询价（列出各候选路径的报价），用```exchange.IO("simulate", ...)```按下单逻辑构造交易并在链上模拟执行，不花gas。

##### 订单与撤单

- 订单ID形如```ETH_USDC,0x…```：交易对、逗号、交易哈希。```exchange.GetOrder()```的状态来自交易回执；订单```Info```中有```chainId```和链名```chain```，跨链汇总或保存订单时用它找回所属的链。用```exchange.IO("receipt", ...)```查回执时传逗号后面的交易哈希。
- ```exchange.GetOrders()```返回本次运行发出、还没有上链的订单。
- ```exchange.CancelOrder()```用原订单的nonce发送一笔替换交易，并等待结果（默认最多30秒，```exchange.IO("cancelWait", 秒数)```修改）：替换交易先上链返回```true```；原订单先上链（或撤单前已经上链）返回```false```；等待超时返回```true```，表示撤单已提交。最终状态以```exchange.GetOrder()```为准：原交易的nonce被替换交易占用时显示为已撤销。

##### 与中心化交易所的差异

- ```exchange.GetTicker()```的买一、卖一是约1000美元规模的实际可成交价，链上没有24小时统计；```exchange.GetDepth()```由逐档递增规模的询价推算，不是真实挂单簿。
- ```exchange.GetTrades()```返回该交易对各池子最近的链上成交；聚合器（```KyberSwap```、```OneInch```）不支持。
- 不支持```exchange.GetRecords()```、```exchange.GetTickers()```、```exchange.GetHistoryOrders()```。
- 1inch免费档每秒1次请求，连接器自动排队，```exchange.GetDepth()```耗时相应较长。

各函数的详细行为、```exchange.IO()```指令（```route```、```simulate```、```token```、```transfer```、```receipt```、```wrap```、```unwrap```、```approve```、```slippage```、```deadline```、```cancelWait```、```gasMultiplier```、```contracts```、```base```、```sendBase```、```address```）的参数与返回值见语法手册的`Uniswap`交易所页。

询价、模拟，然后市价卖出（以太坊上的```ETH_USDC```，同样适用于```KyberSwap```、```OneInch```）；```CreateOrder```会发出真实交易。

```javascript
function main() {
    var symbol = "ETH_USDC"
    exchange.IO("slippage", 0.003)   // 市价单滑点 0.3%

    var t = exchange.GetTicker(symbol)
    Log("买一:", t.Buy, "卖一:", t.Sell)

    // 只询价：卖出 0.1 ETH 的最优路径
    var r = exchange.IO("route", symbol, "sell", 0.1)
    if (!r || r.best === null) {
        Log("没有可用路径:", GetLastError())
        return
    }
    Log("最优路径:", r.best, "均价:", r.price)

    // 链上模拟一遍，不花 gas
    if (!exchange.IO("simulate", symbol, "sell", 0.1)) {
        Log("模拟失败:", GetLastError())
        return
    }

    // 市价卖出 0.1 ETH，订单 ID 形如 ETH_USDC,0x…
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

#### Solana兑换（Jupiter）

Jupiter交易所对象（```exchange.GetName()```返回```Jupiter```）连接Solana链上的Jupiter聚合器，把兑换映射为现货交易函数。一个交易所对象对应一个Solana钱包：报价和兑换交易由Jupiter生成（它在Solana上的众多DEX和做市商之间拆单选路），托管者用配置的私钥签名后经Solana节点广播。EVM链上的兑换见`EVM链上兑换（Uniswap、KyberSwap、1inch）`。

##### 配置交易所对象

- ```Private Key```：Solana钱包私钥：Phantom、Solflare导出的base58字符串，或solana-keygen生成的JSON字节数组。可以把私钥本地化部署在托管者上，见`本地凭据文件`
- ```Rpc Address```：Solana RPC节点，多个用逗号分隔，某个节点出错时自动换下一个；默认为官方公共节点和publicnode
- ```Jupiter Api Key```：可选。不填时使用免费的```lite-api.jup.ag```；填写后使用```api.jup.ag```，可以按套餐调高请求速率
- ```Liquidity Sources```：可选，限定兑换经过的流动性来源，逗号分隔：```pump```（pump.fun的bonding curve与PumpSwap）、```meteora```、```raydium```、```orca```，或Jupiter的来源名（如```Meteora DLMM```）；不填表示全部来源

钱包里需要有SOL支付手续费：每笔交易的基础费与优先费从SOL余额中扣除（优先费上限默认0.001 SOL，可用```exchange.IO("priorityFee", ...)```修改）。第一次买入某个代币时，钱包要新建该代币的账户，押金约0.002 SOL，押金仍归钱包所有。

##### 交易对

- 交易对写作```SOL_USDC```、```JUP_USDC```、```BONK_SOL```。SOL是原生币，兑换时自动包装、解包。
- 内置的常用代币可以直接写名字。其它代币可以写Jupiter代币列表中经过认证、名称完全一致的代币名，或直接写mint地址，或先用```exchange.IO("token", 名字, mint地址)```登记。
- 交易对**不转大写**：mint地址和```mSOL```这类币名区分大小写，按原样书写，例如```DB5QKorV9KHY54y73h5xWQqYyuD8P3jC1p5Ea8DBpump_SOL```。
- ```exchange.GetMarkets()```列出代币表中的币与USDC、USDT、SOL组成的交易对；```exchange.GetAssets()```只列出SOL和代币表中代币的余额。

##### 下单与订单

- 每笔订单都是一次立即执行的兑换。限价为最差成交价，由链上程序按滑点强制执行，当前报价已经达不到限价时直接报错、不发交易；市价单按滑点保护（默认0.5%，```exchange.IO("slippage", 比例)```修改）。市价买入时数量为要花费的计价币。
- Jupiter生成交易时会先模拟一遍，余额不足等问题会在下单时直接报错。
- 订单ID形如```SOL_USDC,5VERv8…```（交易对、逗号、交易签名）。交易确认后为已成交，成交数量按交易前后的钱包余额计算；链上执行失败为已撤销（手续费照扣）；约1分钟内没有上链的交易过期，显示为已撤销。
- ```exchange.GetOrders()```返回本程序发出、尚未确认也未过期的兑换。
- **不能撤单**：Solana交易发出后无法撤回，```exchange.CancelOrder()```报错并返回失败，等交易过期即可。
- 不支持```exchange.GetTrades()```、```exchange.GetRecords()```、```exchange.GetTickers()```、```exchange.GetHistoryOrders()```。

##### 请求速率

Jupiter按每秒请求数限流，超过后返回429。连接器按```exchange.IO("rps", ...)```设置的速率（默认每秒1次）给请求排队，同一个托管者进程中的多个Jupiter交易所对象共用这个节奏。一次```exchange.GetTicker()```需要两次询价（约2秒），5档```exchange.GetDepth()```约10秒。需要更快时申请Jupiter API Key，并按套餐调高```rps```。

##### 常用指令

```route```（只询价）、```token```（登记代币）、```transfer```（转出SOL）、```receipt```（查询交易状态）、```slippage```、```priorityFee```、```dexes```（运行中修改流动性来源）、```rps```，以及```base```（切换节点）、```address```（钱包地址）。各指令的参数与返回值、各函数的详细行为见语法手册的`Jupiter`交易所页。

询价，然后市价卖出；```CreateOrder```会发出真实交易。

```javascript
function main() {
    exchange.IO("slippage", 0.01)      // 市价单滑点 1%

    var t = exchange.GetTicker("SOL_USDC")
    Log("买一:", t.Buy, "卖一:", t.Sell)

    // 只询价：卖出 0.1 SOL 能得到多少 USDC
    var r = exchange.IO("route", "SOL_USDC", "sell", 0.1)
    if (!r || r.route === null) {
        Log("没有路由:", GetLastError())
        return
    }
    Log("可得:", r.quote, "USDC", "均价:", r.price, "路由:", r.route.join(" + "))

    // 市价卖出 0.1 SOL，订单 ID 形如 SOL_USDC,5VERv8…
    var id = exchange.CreateOrder("SOL_USDC", "sell", -1, 0.1)
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
        Sleep(2000)
    }
}
```

See also: `Jupiter`, `exchange.CreateOrder`

#### 以太坊（EVM）

Web3交易所对象选择```ChainType```为```ETH```时，可以连接以太坊以及所有EVM兼容链（BSC、Base、Arbitrum、Optimism、Polygon等）的节点，用```exchange.IO()```的各个指令查询余额、调用合约、发送交易。本页按一笔链上操作的流程介绍常用指令，每个指令的完整参数见语法手册的`Web3`交易所页中对应的```exchange.IO("指令", ...)```。

只是想在DEX上兑换代币时，请使用```Uniswap```、```KyberSwap```、```OneInch```交易所对象（见`EVM链上兑换（Uniswap、KyberSwap、1inch）`）：它直接支持```exchange.GetTicker()```、```exchange.CreateOrder()```等标准函数，不需要自己编码合约调用。

##### 1. 配置交易所对象

在「交易所」页面（```/m/add-platform```）添加交易所，协议选择「加密货币」，交易所选择```Web3```：

- ```ChainType```：```ETH```：以太坊及所有EVM兼容链；```TRON```：波场，见`波场（TRON）`
- ```Private Key```：钱包私钥（十六进制字符串，可以带```0x```前缀）。支持把私钥本地化部署在托管者上，参看`密钥安全性`
- ```Rpc Address```：节点地址，默认```https://ethereum-rpc.publicnode.com```（以太坊主网公共节点）。连接其它链时填写该链的节点，例如BSC：```https://bsc-dataseed.binance.org```。支持```http(s)://```和```ws(s)://```。可以写多个节点，用逗号分隔，互为备用
- ```Rpc Api Key```：节点鉴权，可以留空。写成```名称: 值```（如```x-api-key: xxx```）时作为该名称的请求头发送；否则作为```Authorization: Basic <值>```发送

多个节点时，从上次成功的节点开始依次尝试：只有节点不可用（连接失败、超时、限流）时才换下一个，合约执行失败之类的错误直接返回；链ID与第一个节点不同的节点会被跳过，避免把交易发到另一条链。

运行中可以用```exchange.IO("base", 节点地址)```切换节点（多个节点可以传数组或逗号分隔的字符串），用```exchange.IO("key", 私钥)```切换钱包私钥；获取当前钱包地址用`exchange.IO("address")`。

标准函数中只有```exchange.GetAccount()```、```exchange.GetAssets()```可用，返回钱包的原生币余额（币种按链ID识别，如BSC为```BNB```）。

##### 2. 查询余额与读取合约

调用合约的只读方法（```view```/```pure```）不消耗gas，直接返回解码后的结果：

```javascript
exchange.IO("api", "eth", "eth_getBalance", wallet, "latest")   // 原生币余额，链上整数（十六进制字符串）
exchange.IO("api", tokenAddress, "balanceOf", wallet)           // ERC20余额，链上整数
exchange.IO("api", tokenAddress, "decimals")                    // 代币精度
```

- ```exchange.IO("api", "eth", 方法, ...参数)```直接调用节点的JSON-RPC方法，如```eth_gasPrice```、```eth_blockNumber```、```eth_getTransactionReceipt```。
- ```exchange.IO("api", 合约地址, 方法, ...参数)```调用合约方法。方法可以写方法名、完整签名（如```"approve(address,uint256)"```，用于区分重载）或方法选择器（如```"0x095ea7b3"```）。
- 链上数量都是整数。用```exchange.IO("fromUnits", 链上整数, 精度)```换算成可读数量，用```exchange.IO("toUnits", "1.5", 精度)```换算回链上整数；精度也可以直接传代币合约地址。两者都按字符串精确计算。
- 批量读取多个合约时用```exchange.IO("multicall", ...)```一次请求完成；查询事件日志用```exchange.IO("logs", ...)```。

##### 3. 注册ABI

标准ERC20方法（```balanceOf```、```decimals```、```allowance```、```approve```、```transfer```等）已内置，不需要注册。调用其它合约的方法前，需要用```exchange.IO("abi", 合约地址, ABI)```注册该合约的ABI。

常用合约可以直接使用内置模板，第三个参数传模板名：```weth```、```uniswapV3Pool```、```uniswapV3Factory```、```uniswapV3QuoterV2```、```uniswapV3SwapRouter02```、```uniswapV3PositionManager```、```permit2```（PancakeSwap V3使用相同的模板，也可以写```pancakeV3Pool```等别名）。常用合约的地址可以用```exchange.IO("contracts")```查询。

```javascript
exchange.IO("abi", poolAddress, "uniswapV3Pool")
var slot0 = exchange.IO("api", poolAddress, "slot0")
```

其它合约的ABI可以从区块浏览器获取，例如Etherscan的V2接口（需要Etherscan的API Key，```chainid```为链ID，取返回结果中的```result```字段）：

```url
https://api.etherscan.io/v2/api?chainid=1&module=contract&action=getabi&address=0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45&apikey=YourApiKey
```

##### 4. 发送交易

调用合约的写方法时，交易所对象用配置的私钥签名并广播交易，返回交易哈希。发送前可以把```api```换成```call```，用```exchange.IO("call", ...)```预演同一笔调用：在节点上模拟执行，不签名、不消耗gas，执行失败时返回空值，```GetLastError()```中有合约给出的失败原因。

以授权（approve）为例：

```javascript
var amount = exchange.IO("toUnits", "100", tokenAddress)                 // 100个代币换算成链上整数
var txHash = exchange.IO("api", tokenAddress, "approve", spender, amount)
```

方法的```stateMutability```为```payable```时，方法参数之前要多传一个参数：附带的原生币数量（链上整数）。最后一个参数可以传选项对象：

- ```gasLimit```：gas上限。不传时由节点估算（```eth_estimateGas```）。合约调用不要写```21000```，那只够普通转账
- ```gasPrice```：固定gas价格，传入时发送传统（legacy）交易。不传时，支持EIP-1559的链发送EIP-1559交易：小费取节点建议值与最近区块实际小费的较大者，最高费用为```2 × baseFee + 小费```
- ```nonce```：指定nonce。不传时自动分配，并与链上待处理计数同步，连续发送不会重复使用nonce
- ```dryRun```：设为```true```时只签名不广播，返回```hash```、```raw```（签名后的交易）、```nonce```、```gasLimit```等字段，可用于检查交易或交给其它渠道发送

转出原生币使用```exchange.IO("api", "eth", "send", 收款地址, 数量)```，数量是链上整数（wei）。它的选项还支持```data```（十六进制调用数据），用于原样发送聚合器等API返回的交易```{to, data, value}```，此时gas按合约调用估算。注意：普通转账不传```gasPrice```时按固定的100 Gwei出价、gas上限为21000，在以太坊主网上通常偏高，建议先用```eth_gasPrice```查询后传入。

需要把交易发到私有交易通道（如Flashbots Protect、MEV Blocker）避免被抢跑时，用```exchange.IO("sendBase", 节点地址)```设置只用于广播交易的节点。

##### 5. 等待交易上链

```exchange.IO("waitReceipt", 交易哈希, {timeout, confirmations})```等待交易上链并达到确认数，返回交易回执：```status```为```1```表示成功、```0```表示失败（```revertReason```为失败原因），```events```为按已注册ABI解码的事件。超时未上链时返回空值。

##### 6. nonce管理、加速与取消

- ```exchange.IO("nonce")```查看链上与本地的nonce计数；```exchange.IO("nonce", "sync")```按链上重新同步（在别处用同一个钱包发过交易后使用）。
- 交易长时间未上链时，用```exchange.IO("speedUp", 交易哈希)```以同一个nonce、更高的手续费重发；用```exchange.IO("cancelTx", 交易哈希)```发送一笔同nonce、转给自己的0金额交易顶替原交易。两者都在原交易上链前才有效。
- 本地nonce记录只在当前实盘内有效：多个实盘共用一个钱包时彼此看不到对方的记录，仍可能冲突，建议每个实盘使用独立的钱包。

##### 其它指令

- 编码与解码：```exchange.IO("encode", ...)```编码合约调用数据或按类型编码（同Solidity的```abi.encode```），```exchange.IO("encodePacked", ...)```紧凑编码（如Uniswap V3的兑换路径），```exchange.IO("decode", ...)```按类型解码。
- 签名：```exchange.IO("sign", ...)```对32字节哈希签名，```exchange.IO("signTypedData", ...)```对EIP-712结构化数据签名（如ERC-20 Permit），```exchange.IO("signMessage", ...)```对消息做EIP-191签名。
- Uniswap V3数学：```exchange.IO("uniswapV3", ...)```在tick、价格、sqrtPrice之间换算，在流动性与代币数量之间换算。
- 哈希：```exchange.IO("hash", "keccak256", "raw", "hex", 文本)```计算keccak256等摘要，可用于计算方法选择器、EIP-712摘要，参数与```Encode()```函数相同。
- 完整范例：通过聚合器兑换（询价、生成交易、用```exchange.IO("call", ...)```预演、带```data```发送）见手册中```exchange.IO("call", ...)```的范例；ERC-20 Permit签名并由合约验签见```exchange.IO("sign", ...)```、```exchange.IO("signTypedData", ...)```的范例。

查余额、授权并等待上链（以太坊主网USDC）；这段代码会发出真实交易、消耗gas。

```javascript
function main() {
    var usdc = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"     // 以太坊主网 USDC
    // 被授权的合约，这里以 Uniswap SwapRouter02 为例
    var spender = "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45"
    var wallet = exchange.IO("address")

    // 查余额：标准 ERC20 方法不需要注册 ABI
    var wei = exchange.IO("api", "eth", "eth_getBalance", wallet, "latest")
    var eth = exchange.IO("fromUnits", wei, 18)
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

##### 配置交易所对象

- ```ChainType```：选择```TRON```
- ```Private Key```：钱包私钥（十六进制字符串）。支持把私钥本地化部署在托管者上，参看`密钥安全性`
- ```Rpc Address```：波场全节点的HTTP地址，例如官方节点```https://api.trongrid.io```（测试网：```https://nile.trongrid.io```、```https://api.shasta.trongrid.io```）
- ```Rpc Api Key```：TronGrid的API Key，只填Key本身，会作为```TRON-PRO-API-KEY```请求头发送。不填也能使用，但TronGrid对没有Key的请求限频更严格

托管者通过全节点的HTTP接口（```/wallet/...```）访问波场，不再使用gRPC。选择TRON时表单默认填入的旧gRPC地址```grpc.trongrid.io:50051```会自动换成```https://api.trongrid.io```（```grpc.nile.trongrid.io:50051```、```grpc.shasta.trongrid.io:50051```同样换成对应测试网的HTTP地址）；其它gRPC地址会报错，请改填节点的HTTP地址。

运行中可以用```exchange.IO("base", 节点地址)```切换节点，用```exchange.IO("key", 私钥)```切换钱包，用```exchange.IO("address")```获取当前钱包地址（```T```开头）。标准函数```exchange.GetAccount()```、```exchange.GetAssets()```返回钱包的TRX余额。账户还未激活（链上没有记录）时余额为0。

##### 调用智能合约

与以太坊相同，使用```exchange.IO("api", 合约地址, 方法, ...参数)```：只读方法直接返回结果，写方法签名并广播交易，返回交易ID。TRC20标准方法已内置；其它合约没有注册ABI时，会自动从链上读取该合约的ABI，读取不到时再用```exchange.IO("abi", 合约地址, ABI)```手动注册。写方法的最后一个参数可以传```{gasLimit: 数量}```设置手续费上限（feeLimit，单位sun）。

```javascript
// USDT（TRC20）合约
var usdt = "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t"
Log(exchange.IO("api", usdt, "balanceOf", exchange.IO("address")))   // 链上整数，USDT精度为6
```

编码解码与以太坊一致，地址参数可以直接写```T```开头的地址：

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

##### 调用波场节点的方法

```exchange.IO("api", "tron", 方法, ...参数)```调用波场节点的方法，方法名不区分大小写（```send```除外，必须写成小写）。需要签名的方法（转账、触发合约等）会自动签名并广播。常用方法：

| 方法 | 参数 | 说明 |
| - | - | - |
| ```send``` | 收款地址，数量（sun） | 从当前钱包转出TRX |
| ```Transfer``` | 付款地址，收款地址，数量（sun） | 转出TRX，付款地址必须是当前钱包 |
| ```GetAccount``` | 地址 | 账户信息 |
| ```GetAccountResource``` | 地址 | 账户的能量、带宽资源 |
| ```GetContractABI``` | 合约地址 | 合约在链上的ABI |
| ```GetAssetIssueByName``` | 名称 | TRC10资产信息 |
| ```GetNowBlock``` | 无 | 当前区块 |
| ```GetBlockByNum``` | 区块高度 | 指定区块 |
| ```GetTransactionByID``` | 交易ID | 交易内容 |
| ```GetTransactionInfoByID``` | 交易ID | 交易执行结果（手续费、能量消耗、日志等） |
| ```GetChainParameters``` | 无 | 链参数 |
| ```TriggerConstantContract``` | 调用者地址（可为空），合约地址，方法签名，参数值（见表后说明） | 只读调用合约，结果在```constant_result```中 |
| ```TRC20ContractBalance``` | 地址，合约地址 | TRC20余额（链上整数） |
| ```TRC20GetName```、```TRC20GetSymbol```、```TRC20GetDecimals``` | 合约地址 | TRC20的名称、符号、精度 |
| ```TRC20Send```、```TRC20Approve``` | 付款地址，收款或被授权地址，合约地址，数量，feeLimit | TRC20转账、授权 |
| ```TRC20Call``` | 调用者地址（可为空），合约地址，调用数据，是否只读，feeLimit | 用原始调用数据调用合约 |
| ```ParseTRC20NumericProperty```、```ParseTRC20StringProperty``` | 十六进制数据 | 解析TRC20返回的数值、字符串 |

```TriggerConstantContract```的方法签名要带参数类型（如```"balanceOf(address)"```），参数值写成JSON数组字符串（如```'["T..."]'```，没有参数时传空串）；返回的```constant_result```是十六进制字符串，可以用```exchange.IO("decode", ...)```解码。

表中没有的节点接口，可以直接传路径和请求体：```exchange.IO("api", "tron", "/wallet/接口名", {请求体})```。

##### 与以太坊的差异

以下指令只支持以太坊（EVM），在波场上调用会报错：```call```、```multicall```、```logs```、```waitReceipt```、```nonce```、```speedUp```、```cancelTx```、```contracts```、```sendBase```。多个节点互为备用也只对以太坊有效，波场的节点地址只能填一个，用逗号分隔填写多个会报错。在波场上模拟执行合约调用可以用节点方法```TriggerConstantContract```，查询交易的执行结果用```GetTransactionInfoByID```。

```toUnits```、```fromUnits```、```uniswapV3```、编码解码和签名指令在波场上同样可用，精度参数可以直接传TRC20合约地址：

```javascript
var usdt = "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t"
var raw = exchange.IO("api", usdt, "balanceOf", exchange.IO("address"))
Log(exchange.IO("fromUnits", raw, usdt))   // 按合约的 decimals() 换算为可读数量
```

合约调用在节点校验阶段被拒绝时（例如合约不存在），错误信息中是节点给出的原因，例如```tron contract call rejected (CONTRACT_VALIDATE_ERROR): Smart contract is not exist.```；合约执行失败（revert）时报```tron contract execution failed```及失败原因。

##### 签名

```exchange.IO("hash", "sign", "hex", "hex", 交易哈希)```用当前私钥对32字节哈希签名，返回65字节签名```r‖s‖v```（v为0或1）；```hash```的其它算法（如```sha256```）用于计算摘要，功能与```Encode()```函数相同。需要分别取得r、s、v（v为27或28）用于合约校验时，使用```exchange.IO("sign", ...)```，见语法手册的`Web3`交易所页。

查询TRX与USDT余额，读取代币信息。

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

用Multicall合约一次读取多个合约方法。

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

## 数据与研究

研究行情数据的两个工具：用SQL查询、可视化金融数据的数据探索，以及用公式快速计算、验证因子的Alpha因子分析工具。

### 数据探索

发明者量化自研的**datadata**是一个量化金融数据平台，发明者量化交易平台的[数据探索](https://www.fmz.com/m/database)模块集成了它的服务和功能，发明者量化用户无需另外注册**datadata**账号即可使用。可以用SQL查询分析海量数据，通过可视化界面生成多种图表，并与团队分享。使用例子可以参考[数据探索模块专题文章](https://www.fmz.com/digest-topic/10370)。

- 数据源：datadata提供的数据源实时、持续更新，涵盖多种类型的数据；也可以上传CSV文件作为私有数据源，并在「数据探索」页面预览。
- 数据查询：用SQL语句查询数据，支持查询参数；查询结果可以下载为CSV或JSON文件。
- 保存研究：点击右上角的「保存」，把当前SQL查询保存到账号「数据探索」的资源列表中（资源列表按钮在「保存」按钮左侧）。
- 数据图形化：查询结果除了以表格展示，还可以用多种可视化组件展示。
- 分享研究：支持公开链接、嵌入代码（例如嵌入平台社区帖子）、嵌入网页、数据链接、预览图链接等形式。用「数据链接」还可以把数据直接提供给策略使用，回测和实盘都支持。

### Alpha因子分析工具

[Alpha因子分析工具](https://www.fmz.com/m/alpha)用公式对行情时间序列快速运算，用来验证交易想法。公式参考了```worldquant```公开的[```alpha101```](https://github.com/yli188/WorldQuant_alpha101_code/blob/master/101%20Formulaic%20Alphas.pdf)中行情计算的方法，基本兼容其语法（未实现的有说明），并做了增强。

一个公式可以一次输出多个结果，写成列表即可，例如```[sma(close, 10), sma(high, 30)]```会在图中画两条线。不引用时间序列数据时，也可以当作简单的计算器使用。函数、操作符与可用的输入数据见下面两节。

#### 函数和操作符

Alpha因子分析工具的公式中可以使用的函数和操作符。表达式不区分大小写；下文中```x```、```y```代表时间序列，```d```代表周期数，```{}```代表占位符。

##### 操作符

```+```、```-```、```*```、```/```、```>```、```<```按标准含义计算；```==```判断是否相等，```||```为逻辑或，```x ? y : z```为三元条件运算符。

##### 函数

| 函数 | 说明 |
| - | - |
| ```abs(x)```、```log(x)```、```sign(x)``` | 绝对值、对数、符号函数 |
| ```rank(x)``` | 横截面排序，返回所在的百分位；需要由多个标的组成的候选池，只有单个行情时无法排序，直接返回原值 |
| ```delay(x, d)``` | x在d个周期前的值 |
| ```sma(x, d)``` | x在d个周期内的简单移动平均值 |
| ```correlation(x, y, d)``` | x和y在过去d个周期内的相关系数 |
| ```covariance(x, y, d)``` | x和y在过去d个周期内的协方差 |
| ```scale(x, a)``` | 归一化，使```sum(abs(x)) = a```（a默认为1） |
| ```delta(x, d)``` | x的当前值减去d个周期前的值 |
| ```signedpower(x, a)``` | ```x^a``` |
| ```decay_linear(x, d)``` | x的d周期加权移动平均，权重为d, d-1, …, 1（经过归一化） |
| ```indneutralize(x, g)``` | 按行业分类g做中性化处理，目前不支持 |
| ```ts_{O}(x, d)``` | 对x的过去d个周期执行O操作（O为min、max等，见下面几行），d会转换为整数 |
| ```ts_min(x, d)```、```min(x, d)``` | 过去d个周期的最小值 |
| ```ts_max(x, d)```、```max(x, d)``` | 过去d个周期的最大值 |
| ```ts_argmin(x, d)``` | ```ts_min(x, d)```的位置 |
| ```ts_argmax(x, d)``` | ```ts_max(x, d)```的位置 |
| ```ts_rank(x, d)``` | x在过去d个周期内的排序（百分位） |
| ```sum(x, d)``` | 过去d个周期的累计和 |
| ```product(x, d)``` | 过去d个周期的累计积 |
| ```stddev(x, d)``` | 过去d个周期的标准差 |

#### 输入数据

公式中可以引用的行情数据。输入数据不区分大小写，默认为网页上选择的品种，也可以直接指定品种，例如```binance.ada_bnb```。

| 数据 | 说明 |
| - | - |
| ```returns``` | 收盘价收益率 |
| ```open```、```close```、```high```、```low```、```volume``` | 周期内的开盘价、收盘价、最高价、最低价、成交量 |
| ```vwap``` | 成交量加权平均价，暂未实现，当前为收盘价 |
| ```cap``` | 总市值，暂未实现 |
| ```IndClass``` | 行业分类，暂未实现 |

## 扩展API接口

平台的HTTP接口（```https://www.fmz.com/api/v1```），供脚本、定时任务等程序调用平台功能：查询账号、托管者、策略和实盘，创建、重启、停止实盘，向实盘发送交互命令等。

在AI助手（Claude Code、Cursor等）中交互式地操作平台时，优先使用`AI接入`（MCP服务）：工具更全，参数按名称传递，权限可以按类别授予。两者可以使用同一把API KEY。

使用步骤：`创建ApiKey`，按`验证方式`发送请求，方法与参数见`扩展API接口详解`。

### AI接入

把发明者量化接入Claude Code、Codex、Cursor等AI编程助手（AI agent）后，可以直接用对话完成写策略、回测、创建和管理实盘、查看日志与收益。AI助手通过平台提供的MCP（Model Context Protocol）服务调用这些功能，用的是一把专门为它创建的API KEY，权限由你在授权时决定，随时可以修改或吊销。

#### 一句话接入

在AI助手里输入：

```text
读 https://www.fmz.com/agent/setup.zh-CN.md 然后接入发明者量化
```

AI助手会按这份说明完成以下步骤，你只需要在浏览器里点一次同意：

1. AI助手向平台申请授权，然后给出一个授权链接（形如```https://www.fmz.com/agent/authorize?code=XXXX-XXXX```），链接10分钟内有效。
2. 在已登录发明者量化的浏览器中打开链接，确认申请者名称和权限后点击同意。可以在页面上取消勾选不想给的权限。
3. AI助手取得API KEY，写入自己的MCP配置并连接。之后就可以直接对它说「列出我的实盘」「给这个策略跑一次回测」。

申请时AI助手会用「名字 @ 机器名」（例如```Claude Code @ MacBook```）作为这把API KEY的名称。同一个名称再次申请并同意时，旧的API KEY会被吊销、换成新的，重复接入不会累积多余的API KEY。

#### 权限

| 权限 | 允许的操作 | 默认 |
| - | - | - |
| read | 查看策略、实盘、托管者、交易所账户列表与详情，读取日志、消息、账户概览（不含任何密钥） | 是 |
| backtest | 发起、查询、停止回测 | 是 |
| write | 保存策略与版本、分组、告警开关，修改已停止实盘的配置 | 是 |
| trade | 创建、启动、停止实盘，给实盘发送交互命令（会扣费并真实下单） | 是 |
| danger | 删除策略、实盘、托管者，公开策略 | 否 |

```danger```权限默认不授予，只有AI助手明确申请、并在授权页面勾选时才会获得。AI助手调用```[trade]```或```[danger]```类工具前，应当先向你确认。

#### 手动配置

不能执行命令的客户端（例如Cherry Studio）可以手动配置：

1. 在「账号设置 → API KEY」（```https://www.fmz.com/m/account#apikey```）创建API KEY，记下Access Key和Secret Key。
2. 在客户端添加一个MCP服务，类型选Streamable HTTP：
   - URL：```https://www.fmz.com/api/mcp/<Access Key>```
   - 请求头：```Authorization: Bearer <Secret Key>```

Secret Key只能放在请求头里，不能写进URL。各客户端的配置示例：

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

上面的JSON用于Cursor（```~/.cursor/mcp.json```）等支持Streamable HTTP的客户端；Claude Desktop需要通过```npx mcp-remote```转接，见接入说明原文。

#### 安装skills（推荐）

skills是给AI助手阅读的平台知识包：平台操作流程、完整的API文档、各编程语言的策略写法、回测和指标。装上之后AI助手写出的策略更准确。在终端执行：

```bash
npx skills add fmzquant/skills --global --yes -a claude-code
```

```-a```后面填你使用的AI助手名称（claude-code、codex、cursor、gemini-cli等）。也可以直接在GitHub阅读：```https://github.com/fmzquant/skills```。

#### 可用的工具

连接后AI助手可以使用以下工具，完整说明以AI助手看到的工具列表为准：

- ```read```：```ping```、```get_account_summary```、```list_exchanges```、```list_platforms```、```list_nodes```、```list_strategies```、```get_strategy```、```list_strategy_versions```、```get_strategy_version```、```list_robots```、```get_robot```、```get_robot_logs```、```get_robot_profit```、```get_robot_output```、```list_messages```、```list_groups```、```revoke_my_key```
- ```backtest```：```run_backtest```、```get_backtest```、```list_backtests```、```stop_backtest```
- ```write```：```check_strategy```、```save_strategy```、```save_strategy_version```、```delete_strategy_version```、```update_robot```、```save_group```、```move_to_group```、```delete_group```、```set_robot_alert```、```set_node_alert```、```delete_messages```
- ```trade```：```create_robot```、```start_robot```、```stop_robot```、```restart_robot```、```send_robot_command```，以及交易终端插件工具```plugin_*```（查询行情、下单等）
- ```danger```：```delete_strategy```、```delete_robot```、```delete_node```、```publish_strategy```

一个典型的流程：```list_platforms```和```list_nodes```了解账户里有哪些交易所账户和托管者；```save_strategy```保存策略并用```check_strategy```检查语法；```run_backtest```和```get_backtest```回测；确认后```create_robot```创建实盘，再用```get_robot```、```get_robot_logs```观察运行情况。

#### 安全与管理

- 交易所的API KEY不经过AI助手：在网页的「交易所」页面添加，AI助手按编号选择。所有工具的返回结果里都不包含任何密钥。
- 在```https://www.fmz.com/m/account#apikey```可以查看AI助手使用的API KEY，修改权限或锁定。权限除了填写上表的权限名，还可以填工具名，用```!工具名```排除某个工具。
- 不再使用时，让AI助手调用```revoke_my_key```吊销它自己的API KEY，或在上面的页面中删除。
- ```stop_robot```只停止实盘，不会平仓。
- 第一次让AI助手创建实盘时，建议先回测，再用模拟盘或小额资金运行。

#### 常见问题

- 提示没有在线托管者：创建实盘需要至少一个在线的托管者，见「平台基础 → 托管者」。
- 提示回测任务过多：同时运行的回测数量有上限，让AI助手先用```stop_backtest```停止不再需要的回测。
- AI助手说没有某个工具，或者调用被拒绝：这把API KEY没有对应的权限，在API KEY页面修改权限后重新连接。

同一把API KEY也可以用于`扩展API接口`，供脚本和定时任务调用；能用MCP的场景优先使用MCP。

### 创建ApiKey

在[账号设置 → API KEY](https://www.fmz.com/m/account#apikey)页面（```/m/account#apikey```）点击「创建新的ApiKey」，得到一对```AccessKey```和```SecretKey```。```SecretKey```代表这把API KEY的全部权限，不要泄露。在该页面也可以修改已有API KEY的权限，或者禁用、删除API KEY。

#### 权限

创建或修改时，在「API权限」输入框中填写逗号分隔的列表：

- ```*```：允许全部扩展API接口。
- 方法名：只允许列出的方法，例如```GetRobotList,GetRobotDetail,CommandRobot```。
- ```!方法名```：排除某个方法，通常与```*```搭配，例如```*,!DeleteRobot,!DeleteNode```。

同一把API KEY也可以用于`AI接入`（MCP服务）。除了按方法名（MCP为工具名）授权，还可以按权限类别授权：```read```、```backtest```、```write```、```trade```、```danger```（含义见AI接入页面），同样支持用```!名称```排除。权限类别对MCP工具和扩展API接口同样生效，扩展API接口各方法所属的类别：

- ```read```：```GetAccount```、```GetExchangeList```、```GetNodeList```、```GetPlatformList```、```GetRobotGroupList```、```GetRobotList```、```GetRobotDetail```、```GetRobotLogs```、```GetStrategyList```；
- ```trade```：```NewRobot```、```RestartRobot```、```StopRobot```、```CommandRobot```、```PluginRun```；
- ```danger```：```DeleteRobot```、```DeleteNode```。

判定顺序：明写的方法名（含```!方法名```排除）优先，其次是权限类别，最后是```*```。例如只填```read```的API KEY可以调用```GetRobotList```，不能调用```NewRobot```；```*,!trade```允许除```trade```类别以外的全部方法。

权限留空时，扩展API接口不限制方法（MCP开放```danger```以外的全部工具）。建议按用途只授予需要的方法，例如只用于TradingView警报的API KEY只授予```CommandRobot```。

### 验证方式

调用扩展API接口有两种验证方式：签名验证和直接验证。

- `签名验证`：用```SecretKey```对请求参数签名，```SecretKey```本身不在网络上传输。程序调用应使用这种方式。
- `直接验证`：把```SecretKey```直接放进请求URL，主要用于TradingView等只能填写一个URL的Webhook场景。

#### token验证

签名验证用```SecretKey```对请求参数计算MD5签名，```SecretKey```本身不在网络上传输；程序调用扩展API接口应使用这种方式。

##### 请求格式

向```https://www.fmz.com/api/v1```发送```POST```请求，参数以表单（```application/x-www-form-urlencoded```）提交。服务端也接受把同样的参数放在URL查询串中的```GET```请求，但参数会留在各处的访问日志里，推荐使用```POST```。

| 参数 | 说明 |
| - | - |
| version | 版本号，固定为```1.0```。 |
| access_key | API KEY的```AccessKey```。 |
| method | 调用的方法名，例如```GetNodeList```。 |
| args | 方法参数组成的JSON字符串（数组或对象，见表后说明）；不传时按```[]```处理。 |
| nonce | 毫秒时间戳。与服务器时间相差不能超过1小时，并且必须大于这把API KEY上一次请求使用的```nonce```。 |
| sign | 签名，计算方法见下文。 |

```args```可以是按顺序排列的数组（如```[]```、```[123, "ok"]```），也可以是按参数名传值的对象（如```{"robotId": 123}```），见`扩展API接口详解`。请求中不包含```SecretKey```。

##### 签名方式

按下面的格式拼接字符串，其中```args```是实际提交的JSON字符串原文：

```plaintext
version + "|" + method + "|" + args + "|" + nonce + "|" + secretKey
```

对拼接结果计算MD5，转换为32位小写十六进制字符串，作为```sign```的值。

##### Python示例

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

##### Go示例

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

    // 用新的配置重启实盘 123；settings 字段见「扩展API接口详解」的实盘配置
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

#### 直接验证

不计算签名，而是把```secret_key```直接放在请求参数中，因此可以生成一个固定的URL，填到TradingView等只能设置一个URL的Webhook回调里。

> **安全提示**：```secret_key```写在URL中，会留在浏览器历史、代理和服务器的访问日志、Webhook服务方的配置里，任何拿到这个URL的人都能以这把API KEY的权限调用接口。建议只在```CommandRobot```的Webhook中使用直接验证，并为它单独创建一把只授权```CommandRobot```的API KEY（见`创建ApiKey`）；一旦泄露，立即删除这把API KEY。

请求参数为```access_key```、```secret_key```、```method```、```args```（JSON数组，需要URL编码），不需要```version```、```nonce```、```sign```。```CommandRobot```不做```nonce```校验；其他方法仍会校验：不传```nonce```时服务器以当前时间（精确到秒）代替，同一秒内的第二次调用会返回Nonce错误（```code```为3）。

例如API KEY的```AccessKey```为```xxx```、```SecretKey```为```yyy```，访问下面的URL即可向Id为```186515```的实盘发送交互命令```ok12345```：

```plaintext
https://www.fmz.com/api/v1?access_key=xxx&secret_key=yyy&method=CommandRobot&args=%5B186515%2C%22ok12345%22%5D
```

##### 接收Webhook请求体

```CommandRobot```的命令参数为空字符串、请求为```POST```时，服务器把请求体（Body）作为交互命令发给实盘。请求体须为JSON或纯文本，不能是表单编码（```Content-Type: application/x-www-form-urlencoded```的请求体会先被当作表单解析掉，命令变为空字符串）。例如在TradingView的Webhook URL中设置：

```plaintext
https://www.fmz.com/api/v1?access_key=xxx&secret_key=yyy&method=CommandRobot&args=%5B186515%2C+%22%22%5D
```

其中```args```的值```%5B186515%2C+%22%22%5D```解码后为```[186515, ""]```（```+```是URL编码中的空格），```186515```是实盘Id，命令为空字符串。

模拟TradingView发送Webhook警报：

```javascript
function main() {
    var options = {
        method: "POST",
        body: `{"test": 123}`,
        headers: {"Content-Type": "application/json"}
    }

    // Webhook 警报会自动发送 POST 请求，并带上需要的 headers
    var url = "https://www.fmz.com/api/v1?access_key=xxx&secret_key=yyy" +
        "&method=CommandRobot&args=%5B186515%2C+%22%22%5D"
    return HttpQuery(url, options)
}
```

TradingView警报消息框中的内容就是请求体：

- JSON格式：

  ![TradingView警报消息（JSON格式）](https://www.fmz.com/upload/asset/16d8a37ef80d9ccd0079.png)

  ```plaintext
  {"close": {{close}}, "name": "aaa"}
  ```

  Id为```186515```的实盘收到交互命令：```{"close": 39773.75, "name": "aaa"}```。

- 文本格式：

  ![TradingView警报消息（文本格式）](https://www.fmz.com/upload/asset/16d8a506dfbb6c60a077.png)

  ```plaintext
  BTCUSDTPERP 穿过(Crossing) 39700.00 close: {{close}}
  ```

  Id为```186515```的实盘收到交互命令：```BTCUSDTPERP 穿过(Crossing) 39700.00 close: 39739.4```。

##### Python、Go示例

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

### 扩展API接口详解

所有方法都通过```https://www.fmz.com/api/v1```调用，请求格式与签名见`签名验证`，返回结构与错误码见`扩展API接口返回码`。各方法页面示例中的```api()```即签名验证页面Python示例中的函数。

#### 方法一览

| 对象 | 方法 | 参数（按顺序，方括号内为可选参数） | 说明 | 注意 |
| - | - | - | - | - |
| 账号 | `GetAccount` | 无 | 账号信息 | 只读 |
| 托管者 | `GetNodeList` | [offset, limit] | 托管者列表 | 只读 |
| 托管者 | `DeleteNode` | nid | 删除托管者 | 删除，不可恢复 |
| 交易所 | `GetExchangeList` | isSummary | 平台支持的交易所及配置项 | 只读 |
| 交易所 | `GetPlatformList` | [offset, limit] | 已添加的交易所账户 | 只读 |
| 策略 | `GetStrategyList` | offset, length, strategyType, category, language, kw[, groupId, orderBy] | 策略列表 | 只读 |
| 实盘 | `GetRobotGroupList` | 无 | 实盘分组 | 只读 |
| 实盘 | `GetRobotList` | [offset, length, customStatus, appId, kw, groupId, orderBy, strategyId] | 实盘列表 | 只读 |
| 实盘 | `GetRobotDetail` | robotId | 实盘详细信息 | 只读 |
| 实盘 | `GetRobotLogs` | robotId, logMinId, …, summaryLimit[, logExchange, logKeyword, logTypes] | 日志、收益、图表与状态栏数据 | 只读 |
| 实盘 | `NewRobot` | settings | 创建并启动实盘 | 扣费；实盘会真实交易 |
| 实盘 | `RestartRobot` | robotId[, settings] | 启动（重启）实盘 | 扣费；实盘会真实交易 |
| 实盘 | `StopRobot` | robotId | 停止实盘 | 不会平仓 |
| 实盘 | `CommandRobot` | robotId, cmd | 向实盘发送交互命令 | 策略可能据此下单 |
| 实盘 | `DeleteRobot` | robotId[, removeLog] | 删除实盘 | 删除，不可恢复 |
| 调试 | `PluginRun` | settings | 在托管者上执行一段代码 | 代码可以真实下单 |
| 频道 | `pub` | robot, channel（URL参数），消息放在请求体 | 向实盘订阅的频道推送一条消息 | 不需要API KEY、不签名 |

API KEY需要有对应方法的权限，见`创建ApiKey`。

#### 参数传法

```args```有两种写法：

- 数组：按上表的顺序传位置参数，例如```[123, "ok"]```。按位置传参时，服务端只接受特定的参数个数，个数不符时返回```Params number mismatch```错误：
  - GetNodeList、GetPlatformList：0个或2个。
  - GetStrategyList：0、6、7、8个；不传参数时```language```为```1```（只返回Python策略），见`GetStrategyList`。
  - GetRobotList：0、1、3、5、6、7、8个；只传1个参数时，它被当作```appId```。
  - GetRobotLogs：15～19个（15个时不查询状态栏）。
  - RestartRobot、DeleteRobot：1个或2个；DeleteRobot只传```robotId```时```removeLog```为```false```。
- 对象：按参数名传值，例如```{"robotId": 123, "cmd": "ok"}```。参数名不区分大小写、忽略下划线，没有传的参数取默认值。可选参数多的方法（GetRobotList、GetRobotLogs、GetStrategyList）建议用这种写法。

#### 实盘配置（settings）

NewRobot、RestartRobot、PluginRun的```settings```参数是一个JSON对象，常用字段如下：

| 字段 | 说明 |
| - | - |
| name | 实盘名称。 |
| strategy | 策略Id，可用GetStrategyList查询。RestartRobot不能更换实盘的策略。 |
| args | 策略参数，每个元素为```["参数名", 值]```，例如```[["Interval", 500]]```；策略没有参数时为```[]```。 |
| exchanges | 交易所对象配置数组，每个元素对应一个交易所对象，写法见下文。 |
| period | 默认K线周期，单位为秒，例如```60```、```3600```；不写时为60秒。请传60及以上的秒数，见表后说明。 |
| node | 运行实盘的托管者Id，可用GetNodeList查询；不写或为```-1```时自动分配。 |
| group | 实盘分组Id，可用GetRobotGroupList查询。 |
| appid | 自定义标签，GetRobotList可以按标签筛选。 |

```period```为```0```、```1```、```2```、```3```、```4```、```5```、```10```、```12```时按旧的周期编号解释（依次为1分钟、3分钟、5分钟、15分钟、30分钟、1小时、1天、1周），例如传```1```实际是180秒。

```exchanges```的元素有两种写法，同一个数组中不能混用（以第一个元素的写法为准）：

- 引用平台上已添加的交易所账户：```{"pid": 123, "pair": "BTC_USDT"}```。```pid```可用GetPlatformList查询（返回数据中的```id```）。
- 直接传入交易所配置：```{"eid": "Binance", "label": "test", "pair": "BTC_USDT", "meta": {"AccessKey": "...", "SecretKey": "..."}}```。```eid```为交易所Id；```meta```的字段名见GetExchangeList返回的```meta```；```label```是交易所对象的标签，策略中用```exchange.GetLabel()```获取。平台不保存```meta```中的密钥，而是直接转发给托管者，所以用这种写法创建的实盘，每次重启时都必须重新传入```settings```。

通用协议交易所的写法：```{"eid": "Exchange", "label": "test", "pair": "BTC_USDT", "meta": {"AccessKey": "...", "SecretKey": "...", "Front": "http://127.0.0.1:6666/test"}}```，```Front```为通用协议服务的地址。

##### GetAccount

获取当前API KEY所属账号的账户信息，包括余额和累计消费金额。

Fields:

- `balance` (number): 账户余额，单位为USD，按1e8放大为整数，除以1e8得到实际数值；示例中为229.44702436。
- `consumed` (number): 累计消费金额，单位与换算方式同```balance```。
- `username` (string): 用户名。
- `email` (string): 账号邮箱。
- `uid` (string): 账号UID。

Returns (object): 成功时```data.result```为账户信息，字段见下方属性表。

查询账户余额。

```python
# api() 见「签名验证」页面的Python示例
r = api('GetAccount')
print(r['data']['result']['balance'] / 1e8)   # 输出：229.44702436（USD）
```

###### 返回示例

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

获取当前账号可以使用的托管者列表，包括自己的托管者和平台的公共托管者。

Parameters:

- `offset` (number, optional): 分页偏移，默认为0。
- `limit` (number, optional): 每页数量；不传或小于等于0时返回全部。

Fields:

- `all` (number): 托管者总数（包括公共托管者）。
- `nodes` (array): 托管者数组，每个元素的字段见下面几行（字面意思明显的字段不再列出）。
- `nodes[].id` (number): 托管者Id，即实盘配置中的```node```。
- `nodes[].build` (string): 版本号。
- `nodes[].version` (string): 托管者详细版本信息。
- `nodes[].online` (bool): 是否在线。
- `nodes[].is_owner` (bool): ```true```为私有托管者，```false```为公共托管者。
- `nodes[].public` (number): ```0```为私有托管者，```1```为公共托管者。
- `nodes[].loaded` (number): 负载，即运行在该托管者上的策略实例个数。
- `nodes[].city` (string): 所在城市。
- `nodes[].region` (string): 地理位置。
- `nodes[].wd` (number): 是否开启离线报警，```0```表示未开启。

Returns (object): 成功时```data.result```包含托管者总数```all```和托管者数组```nodes```，字段见下方属性表。

列出全部托管者及其在线状态。

```python
# api() 见「签名验证」页面的Python示例
r = api('GetNodeList')
for node in r['data']['result']['nodes']:
    print(node['id'], node['name'], node['online'])
```

一键租用的托管者还有以```ecs_```、```unit_```开头的字段，记录服务器的运营商、配置、状态以及计费周期、价格等信息。

###### 返回示例

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

删除当前账号下的一个托管者；在线的托管者会被强制退出登录，其上的实盘全部变为「策略有错误」。删除后不可恢复。

Parameters:

- `nid` (number, required): 要删除的托管者Id，可以用```GetNodeList```查询。

Returns (bool): ```data.result```为```true```表示托管者记录已删除：平台让在线的该托管者强制退出登录，其上的实盘全部被置为「策略有错误」（状态码```5```）。托管者不存在、不属于该账号，或者无法让它退出登录时为```false```。

删除Id为123的托管者。

```python
# api() 见「签名验证」页面的Python示例
r = api('DeleteNode', 123)
print(r)   # 输出：{'code': 0, 'data': {'result': True, 'error': None}}
```

##### GetExchangeList

获取平台支持的交易所列表，以及每个交易所需要填写的配置项。

Parameters:

- `isSummary` (bool, required): ```true```只返回概要信息，不含```meta```、```stocks```；```false```返回完整信息。

Fields:

- `exchanges[].eid` (string): 交易所Id，例如```Futures_Binance```；实盘配置中直接传入交易所配置时用它。
- `exchanges[].name` (string): 显示名称，写作```中文|英文```。
- `exchanges[].category` (string): 分类。
- `exchanges[].meta` (string): 交易所配置项的元数据（JSON文本），只在```isSummary```为```false```时返回；实盘配置中```meta```的字段名取自这里。
- `exchanges[].stocks` (string): 常用交易对，逗号分隔，只在```isSummary```为```false```时返回。

Returns (object): 成功时```data.result.exchanges```为交易所数组，字段见下方属性表。

列出支持的交易所Id和名称（概要信息）。

```python
# api() 见「签名验证」页面的Python示例
r = api('GetExchangeList', True)
for e in r['data']['result']['exchanges']:
    print(e['eid'], e['name'])
```

###### 返回示例（isSummary为false）

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

其中```meta```是JSON文本，解析后为配置项数组：

```json
[
    {"desc": "Access Key", "qr": "apiKey", "required": true, "type": "string",
     "name": "AccessKey", "label": "Access Key"},
    {"encrypt": true, "qr": "secretKey", "name": "SecretKey", "required": true,
     "label": "Secret Key", "type": "password", "desc": "Secret Key"}
]
```

###### 返回示例（isSummary为true）

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

获取当前账号已添加的交易所账户列表。

Parameters:

- `offset` (number, optional): 分页偏移，默认为0。
- `limit` (number, optional): 每页数量；不传或小于等于0时返回全部。

Fields:

- `all` (number): 已添加的交易所账户个数。
- `platforms[].id` (number): 交易所账户Id，即实盘配置```exchanges```中的```pid```。
- `platforms[].eid` (string): 交易所Id，一些配置、参数中会用到。
- `platforms[].label` (string): 添加时设置的标签。
- `platforms[].stocks` (array): 常用交易对。

Returns (object): 成功时```data.result```包含账户总数```all```和交易所账户数组```platforms```，字段见下方属性表。

列出已添加的交易所账户，取得实盘配置要用的```pid```。

```python
# api() 见「签名验证」页面的Python示例
r = api('GetPlatformList')
for p in r['data']['result']['platforms']:
    print(p['id'], p['eid'], p['label'])
```

###### 返回示例

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
                "stocks": ["BTC_USDT", "LTC_USDT", "ETH_USDT", "ETC_USDT",
                           "BTC_TUSD", "ETH_TUSD", "BNB_TUSD"],
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

##### GetStrategyList

按范围、类型、语言、关键字等条件查询策略列表。

Parameters:

- `offset` (number, required): 分页偏移。
- `length` (number, required): 每页数量；小于等于0时返回全部。
- `strategyType` (number, required): 查询范围，例如```-3```只查自己的策略；取值见备注。
- `category` (number, required): 策略类型：```-1```全部，```0```普通策略，```20```模板类库，```21```交易插件。
- `language` (number, required): 策略的编程语言，```-1```为全部语言；取值见备注。
- `kw` (string, required): 按策略名称模糊匹配的关键字，多个词用空格分隔；空字符串表示不筛选。以```id:```开头时按策略Id查询，例如```id:123,456```。
- `groupId` (number, optional): 策略分组：```-1```全部（默认），```0```未分组，大于0为指定分组。只对自己的策略生效。
- `orderBy` (string, optional): 排序字段：```name```、```last_modified```、```date```，后面加``` asc```为升序（默认降序）；空字符串为默认排序。

Fields:

- `all` (number): 符合条件的策略总数。
- `strategies` (array): 策略数组。
- `strategies[].id` (number): 策略Id，即实盘配置中的```strategy```。
- `strategies[].category` (number): 策略类型，取值同参数```category```。
- `strategies[].language` (number): 编程语言，取值同参数```language```。

Returns (object): 成功时```data.result```包含策略总数```all```和策略数组```strategies```，字段见下方属性表。

按位置传参查询自己的前10个策略，或按参数名查询自己的全部Rust策略。

```python
# api() 见「签名验证」页面的Python示例
r = api('GetStrategyList', 0, 10, -3, -1, -1, '')          # 自己的前10个策略
r = api('GetStrategyList', strategyType=-3, language=7)    # 自己的全部Rust策略
for s in r['data']['result']['strategies']:
    print(s['id'], s['name'])
```

参数中没有```needArgs```：按旧版文档在```category```之后多传一个参数，会使后面的参数错位，请按上面的顺序传参，或按参数名传值。

按位置传参时只接受0、6、7、8个参数。不传任何参数（```args```为```[]```）时，服务端补上的是```(-1, -1, -1, -1, 1, "")```，即```language```为```1```，只返回Python策略；要查询全部语言，请传```language```为```-1```，或按参数名传值（按参数名传值时```language```缺省为```-1```）。

###### 参数取值

```strategyType```（查询范围）：

| 取值 | 含义 |
| - | - |
| ```-1``` | 自己的策略和租用的策略（含官方策略） |
| ```0``` | 自己的策略和租用的策略（不含官方策略） |
| ```-3``` | 只查自己的策略 |
| ```-6``` | 只查租用的策略（含已过期的） |
| ```-4``` | 官方策略 |
| ```-2``` | 策略广场中公开的策略和付费策略 |
| ```1``` | 已公开的策略 |
| ```2``` | 待审核的策略 |

```category```（策略类型）：```-1```全部，```0```普通策略，```20```模板类库，```21```交易插件。

```language```（编程语言）：

| 取值 | 含义 |
| - | - |
| ```-1``` | 全部语言 |
| ```0``` | JavaScript |
| ```1``` | Python |
| ```3``` | 已停用的策略类型，只会出现在存量策略中 |
| ```4``` | My语言 |
| ```5``` | PINE语言 |
| ```6``` | Workflow工作流 |
| ```7``` | Rust |

###### 返回示例

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

获取当前账号的实盘分组列表；「默认」分组不在列表中。

Fields:

- `items[].id` (number): 实盘分组Id，即实盘配置中的```group```。
- `items[].name` (string): 实盘分组名称。

Returns (object): 成功时```data.result.items```为分组数组，只包含新建的分组，「默认」分组不在其中。

列出实盘分组。

```python
# api() 见「签名验证」页面的Python示例
r = api('GetRobotGroupList')
for g in r['data']['result']['items']:
    print(g['id'], g['name'])
```

###### 返回示例

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

##### GetRobotList

获取当前账号的实盘列表，可以按状态、标签、名称、分组、策略筛选；参数都可以省略。

Parameters:

- `offset` (number, optional): 分页偏移，默认为0。
- `length` (number, optional): 每页数量；小于等于0时返回全部（默认）。
- `customStatus` (number, optional): 按实盘状态码筛选，见`实盘状态码`；```-1```为全部实盘（默认），```-2```为全部实盘并按启动时间排序。
- `appId` (string, optional): 按实盘的自定义标签（创建时```settings```中的```appid```）筛选，空字符串表示不筛选。
- `kw` (string, optional): 按实盘名称模糊匹配的关键字，空字符串表示不筛选。
- `groupId` (number, optional): 实盘分组：```-1```全部（默认），```0```未分组，大于0为指定分组。
- `orderBy` (string, optional): 排序字段：```name```、```status```、```node```、```profit```、```date```、```refresh```、```start_time```、```strategy_name```，后面加``` asc```为升序（默认降序）；空字符串为默认排序。
- `strategyId` (number, optional): 大于0时只返回该策略的实盘，默认为0（不筛选）。

Fields:

- `all` (number): 符合条件的实盘总数。
- `robots` (array): 实盘数组。
- `robots[].id` (number): 实盘Id。
- `robots[].status` (number): 实盘状态码，见`实盘状态码`。
- `robots[].group_id` (number): 实盘分组Id；在默认分组中的实盘没有这个字段。

Returns (object): 成功时```data.result```包含实盘总数```all```和实盘数组```robots```，字段见下方属性表。

获取全部实盘、按标签筛选，以及按位置或按参数名传参。

```python
# api() 见「签名验证」页面的Python示例
r = api('GetRobotList')                              # 全部实盘
r = api('GetRobotList', 'member2')                   # 只传一个字符串时视为标签：标签为member2的全部实盘
r = api('GetRobotList', 0, 100, -1, 'member2', '')   # 按位置传参：从第0条开始最多100个标签为member2的实盘
r = api('GetRobotList', appId='member2', length=100) # 按参数名传值，效果同上
for robot in r['data']['result']['robots']:
    print(robot['id'], robot['name'], robot['status'])
```

###### 返回示例

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

##### GetRobotDetail

获取当前账号下一个实盘的详细信息，包括状态、计费、交易所配置和策略参数。

Parameters:

- `robotId` (number, required): 实盘Id，可以用```GetRobotList```查询。

Fields:

- `robot.status` (number): 实盘状态码，见`实盘状态码`。
- `robot.name` (string): 实盘名称。
- `robot.date` (string): 创建日期。
- `robot.charge_time` (number): 下次扣费时间（Unix时间戳，秒），即当前已付费时段的截止时间。
- `robot.charged` (number): 累计计费时长，单位为秒。
- `robot.consumed` (number): 累计扣费金额，单位为USD，按1e8放大为整数；示例中5375000000即53.75 USD。
- `robot.node_id` (number): 托管者Id。
- `robot.fixed_id` (number): 实盘配置中指定的托管者Id；自动分配时为```-1```。
- `robot.is_manager` (bool): 是否有权限管理该实盘。
- `robot.is_sandbox` (number): 是否是模拟盘。
- `robot.pexchanges` (object): 实盘配置的交易所对象：键为```pid```，值为交易所Id（```eid```），如```{"123": "Futures_OKX"}```。
- `robot.plabels` (object): 实盘配置的交易所对象的标签，键为```pid```。
- `robot.strategy_exchange_pairs` (string): 默认K线周期、交易所对象和交易对（JSON文本），格式见备注。
- `robot.profit` (number): 实盘收益。
- `robot.public` (number): 实盘是否公开。
- `robot.refresh` (number): 最近活跃时间（毫秒时间戳）。
- `robot.wd` (number): 是否开启离线报警。

Returns (object): 成功时```data.result.robot```为实盘信息，字段见下方属性表。

查询实盘123的状态和交易所配置。

```python
# api() 见「签名验证」页面的Python示例
r = api('GetRobotDetail', 123)
robot = r['data']['result']['robot']
print(robot['status'], robot['pexchanges'], robot['strategy_exchange_pairs'])
```

```strategy_exchange_pairs```是一个JSON数组的文本，例如```"[60,[44314,42960,15445,14703],[\"BTC_USDT\",\"BTC_USDT\",\"ETH_USDT\",\"ETH_USDT\"]]"```：

- ```60```：实盘设置的默认K线周期，单位为秒（这里为1分钟）。
- ```[44314,42960,15445,14703]```：实盘配置的交易所对象的```pid```，按添加顺序排列。
- ```["BTC_USDT","BTC_USDT","ETH_USDT","ETH_USDT"]```：各交易所对象设置的交易对，与```pid```按顺序一一对应。

###### 返回示例

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

##### GetRobotLogs

获取当前账号下一个实盘的策略日志、收益日志、图表数据和状态栏数据。

Parameters:

- `robotId` (number, required): 实盘Id，可以用```GetRobotList```查询。
- `logMinId` (number, required): 策略日志的最小Id。
- `logMaxId` (number, required): 策略日志的最大Id。
- `logOffset` (number, required): 在```logMinId```、```logMaxId```确定的范围内跳过的记录条数。
- `logLimit` (number, required): 从起始位置开始取的记录条数。
- `profitMinId` (number, required): 收益日志的最小Id。
- `profitMaxId` (number, required): 收益日志的最大Id。
- `profitOffset` (number, required): 跳过的记录条数。
- `profitLimit` (number, required): 取的记录条数。
- `chartMinId` (number, required): 图表日志的最小Id。
- `chartMaxId` (number, required): 图表日志的最大Id。
- `chartOffset` (number, required): 跳过的记录条数。
- `chartLimit` (number, required): 取的记录条数。
- `chartUpdateBaseId` (number, required): 查询更新后的基础Id。
- `chartUpdateDate` (number, required): 数据记录更新时间戳，只返回比它新的记录。
- `summaryLimit` (number, required): 是否返回状态栏数据：```0```不返回；大于0时返回，放在```summary```字段中（数值本身不起作用，最多返回2MB）。
- `logExchange` (string, optional): 只返回该交易所对象（按标签）的日志，空字符串表示不筛选。
- `logKeyword` (string, optional): 只返回内容包含该关键字的日志，空字符串表示不筛选。
- `logTypes` (string, optional): 只返回这些类型的日志，类型号用逗号分隔，例如```"0,1,2"```只看买单、卖单、撤单；空字符串表示全部类型。

Fields:

- `logs` (array): 三个对象，依次是实盘数据库中策略日志表、收益日志表、图表日志表的查询结果；每个对象的```Arr```为日志记录，格式见备注。
- `summary` (string): 实盘状态栏数据（```summaryLimit```大于0时返回）。
- `status` (number): 实盘状态码，见`实盘状态码`。

Returns (object): 成功时```data.result```包含日志```logs```和状态栏数据```summary```等，字段见下方属性表。

按参数名查询实盘123最近的10条策略日志和状态栏数据。

```python
# api() 见「签名验证」页面的Python示例
r = api('GetRobotLogs', robotId=123, logLimit=10, summaryLimit=1)
result = r['data']['result']
for row in result['logs'][0]['Arr']:
    print(row)
print(result['summary'])   # 状态栏数据
```

参数较多，建议按参数名传值，没有传的参数取默认值；按位置传参时要传15～19个（15个时不查询状态栏）。```logExchange```、```logKeyword```、```logTypes```三个筛选参数只在新版托管者上生效，旧版托管者会忽略它们，返回全部日志。

###### logs[0]：策略日志

```logs[0].Arr```中的每条日志是一个数组，依次为：日志Id（```id```）、日志类型（```logType```）、交易所对象的标签（```platformId```）、订单Id（```orderId```）、价格（```price```）、数量（```amount```）、日志的附加消息（```extra```）、时间戳（```date```）、合约代码（```contractType```）、方向（```direction```）。例如：

```plaintext
"Arr": [
    [3977, 3, "Futures_OKX", "", 0, 0, "Sell(688.9, 2): 20016", 1526954372591, "", ""],
    [3976, 5, "", "", 0, 0, "this_week 仓位过多, 多: 2", 1526954372410, "", ""]
]
```

```logType```的取值：

| logType | 名称 | 含义 |
| - | - | - |
| 0 | BUY | 买单 |
| 1 | SALE | 卖单 |
| 2 | RETRACT | 撤单 |
| 3 | ERROR | 错误 |
| 4 | PROFIT | 收益 |
| 5 | MESSAGE | 日志 |
| 6 | RESTART | 重启 |

###### logs[1]：收益日志

与策略日志中的收益日志一致，每条依次为日志Id、收益数值、时间戳。例如```[202, 2515.44, 1575896700315]```中```202```为日志Id，```2515.44```为收益，```1575896700315```为时间戳：

```plaintext
"Arr": [
    [202, 2515.44, 1575896700315],
    [201, 1415.44, 1575896341568]
]
```

###### logs[2]：图表日志

每条依次为日志Id、图表数据系列索引、数据（JSON文本）。例如```[23637, 0, "{\"close\":648, ...}"]```中```23637```为日志Id，```0```为数据系列索引，最后的JSON文本是图表上的一根K线：

```plaintext
"Arr": [
    [23637, 0, "{\"close\":648,\"high\":650.5,\"low\":647,\"open\":650,\"x\":1575960300000}"],
    [23636, 5, "{\"x\":1575960300000,\"y\":3.0735}"]
]
```

###### 返回示例

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

在当前账号下创建一个实盘并启动运行；与在网页上创建实盘一样会扣费，实盘会真实交易。

Parameters:

- `settings` (object, required): 实盘配置，字段见`扩展API接口详解`中的「实盘配置（settings）」。

Returns (number): ```data.result```：成功创建时为新实盘的Id；```0```表示```settings```中的```args```不是数组；负数表示没有创建实盘，见备注。

用已添加的交易所账户（```pid```）创建并启动实盘。

```python
# api() 见「签名验证」页面的Python示例
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
print(r['data']['result'])   # 输出：591988（新实盘的Id）
```

通过扩展API接口创建时，平台等启动流程执行完再返回。启动失败（例如策略编译出错）时同样返回新实盘的Id，实盘处于「策略有错误」状态（状态码```5```），所以创建后要用```GetRobotDetail```确认实盘状态。

返回负数时没有创建实盘，含义见`实盘状态码`中的「启动失败的返回值」，例如```-2```没有找到托管者，```-5```余额不足。账号可运行的实盘数量超限时，返回```code```为6的错误。

用```eid```方式直接传入交易所配置时，平台不保存```meta```中的密钥，之后每次用```RestartRobot```重启这个实盘都必须传入```settings```。

##### RestartRobot

启动（重启）当前账号下的一个实盘，可以同时用新的配置替换原配置；启动会扣费。

Parameters:

- `robotId` (number, required): 实盘Id，可以用```GetRobotList```查询。
- `settings` (object, optional): 新的实盘配置，传入时整份覆盖原配置再启动，见备注；字段见`扩展API接口详解`中的「实盘配置（settings）」。

Returns (number): ```data.result```：正常情况下为```0```（准备中），表示启动流程已执行完；启动是否成功要用```GetRobotDetail```查询。其它返回值见备注。

按实盘当前的配置启动实盘123。

```python
# api() 见「签名验证」页面的Python示例
r = api('RestartRobot', 123)
print(r['data']['result'])   # 输出：0（准备中，启动流程已执行完）
```

在平台页面创建、使用已添加交易所账户（```pid```）的实盘，可以只传```robotId```，按实盘当前的配置启动。用```eid```方式直接传入交易所配置的实盘（通常由扩展API接口创建），平台没有保存密钥，每次重启都必须传入```settings```。

传入```settings```时，先用它**整份覆盖**实盘的配置（名称、参数、交易所、K线周期、托管者），再启动；不能更换策略。没有写的字段不会保留原值：```name```变为空字符串，```args```变为```[]```（参数全部恢复默认值），没写```exchanges```会删除实盘的全部交易所配置，```period```变为60秒，```node```变为自动分配；只有```group```不写或为```0```时保留原分组。所以传入```settings```时必须写出完整配置，建议先用```GetRobotDetail```取得当前配置再修改。

实盘处于准备中、运行中或停止中时传入```settings```，返回```code```为6的错误（```robot is running```）；不传```settings```时不会重新启动，直接返回当前的状态码（```0```、```1```、```2```）。

返回负数表示启动失败，含义见`实盘状态码`中的「启动失败的返回值」。启动后实盘是运行中，还是因编译出错等进入「策略有错误」，要用```GetRobotDetail```查询。

##### StopRobot

停止当前账号下的一个实盘；停止不会自动平仓。

Parameters:

- `robotId` (number, required): 实盘Id，可以用```GetRobotList```查询。

Returns (number): ```data.result```为实盘状态码：```2```（停止中）表示已向托管者发出停止命令；```4```（被停止）表示实盘所在的托管者已被删除，实盘直接置为被停止；```3```、```4```、```5```也可能表示实盘本来就已经结束。

停止实盘123。

```python
# api() 见「签名验证」页面的Python示例
r = api('StopRobot', 123)
print(r['data']['result'])   # 输出：2（停止中）
```

实盘正在启动或停止的过程中（```robot is busy```）、托管者不在线（```docker not found```）时，返回```code```为6的错误。

##### CommandRobot

向当前账号下运行中的实盘发送一条交互命令，策略用`GetCommand`接收。

Parameters:

- `robotId` (number, required): 接收命令的实盘Id，可以用```GetRobotList```查询。
- `cmd` (string, required): 交互命令，策略中用```GetCommand()```获取。

Returns (bool): ```data.result```表示交互命令是否发送成功；向没有运行的实盘发送命令时为```false```。

向运行中的实盘123发送命令```test command```，实盘的策略用```GetCommand()```收到后打印（策略代码见备注）。

```python
# api() 见「签名验证」页面的Python示例
r = api('CommandRobot', 123, 'test command')
print(r['data']['result'])   # 输出：True
```

接收命令的策略示例：

```javascript
// 实盘123运行的策略：收到交互命令后打印出来
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

在TradingView等只能填写一个URL的Webhook中调用```CommandRobot```，见`直接验证`。

##### DeleteRobot

删除当前账号下的一个实盘；运行中的实盘要先停止才能删除，删除后不可恢复。

Parameters:

- `robotId` (number, required): 实盘Id，可以用```GetRobotList```查询。
- `removeLog` (bool, optional): 是否同时删除托管者上的实盘日志数据。按参数名传值时默认为```true```；按位置只传```[robotId]```时为```false```。建议显式传入。

Returns (number): ```data.result```：```0```删除成功；```-1```没有删除（实盘不存在，或者仍在运行、启动中、停止中）；```-2```实盘已删除，但无法联系实盘所在的托管者，日志数据没有删除，需要到托管者目录```logs/storage/<实盘Id>/```下手动删除（例如```123.db3```）。

删除已停止的实盘123，同时删除托管者上的日志数据。

```python
# api() 见「签名验证」页面的Python示例
r = api('DeleteRobot', robotId=123, removeLog=True)
print(r['data']['result'])   # 输出：0（删除成功）
```

##### PluginRun

在托管者上执行一段JavaScript代码并返回结果，不创建实盘、不计费，单次执行最长5分钟；代码可以真实下单。

Parameters:

- `settings` (object, required): 执行配置，字段见下方属性表。

Fields:

- `settings.source` (string): 要执行的代码，入口为```main()```，返回值就是执行结果。
- `settings.strategy` (number): 不传```source```时，执行账号中这个Id的策略（例如交易插件）。
- `settings.node` (number): 执行代码的托管者Id；不写或为```-1```时自动选择。
- `settings.exchanges` (array): 交易所对象配置，写法同`扩展API接口详解`中的「实盘配置（settings）」。

Returns (string): ```data.result```是JSON文本：```logs```为代码中```Log()```输出的日志，```result```为```main()```返回值的JSON文本。

在托管者123上执行一段代码，取回日志和返回值。

```python
# api() 见「签名验证」页面的Python示例
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

与开发工具中的「调试工具」、交易终端插件使用同一种执行机制，见`插件原理与编写`。

```exchanges```也可以不引用平台上的交易所账户，直接传入交易所配置，例如```{"eid": "Binance", "pair": "ETH_BTC", "meta": {"AccessKey": "...", "SecretKey": "..."}}```，```meta```的字段名见```GetExchangeList```返回的```meta```。```exchanges```中通常只设置一个交易所对象（调试工具页面也只支持一个）；设置两个不会报错，但代码中访问第二个交易所对象时会报错。

###### 返回示例

```json
{
    "code": 0,
    "data": {
        "result": "{\"logs\": [...], \"result\": \"\"}",
        "error": null
    }
}
```

其中```result```解析后为：

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

把一条消息推送到运行中实盘订阅的频道，供平台外部的系统（TradingView 的 Webhook 告警、自建交易系统、监控脚本等）向实盘发送数据。实盘用`GetChannelData`读取，频道机制见`策略实盘间通信`。

与其它方法不同，```pub```**不需要API KEY，也不签名**：请求地址是```https://www.fmz.com/api/v1?method=pub&robot={robotId}&channel={channel}```，消息放在请求体中（```POST```）。知道实盘Id和频道名的任何人都能推送，所以频道名要用难以猜到的随机字符串，策略也要把收到的内容当作不可信的输入来校验。

Parameters:

- `robot` (number, required): 接收消息的实盘Id（URL参数）。该实盘必须正在运行，并且已经订阅了```channel```频道。
- `channel` (string, required): 频道名（URL参数），建议用32位随机字符串（UUID去掉连字符）。不能是纯数字（纯数字会被当作实盘Id，即实盘自己的频道）；少于10个字符的频道名不会投递。
- `message` (string, optional): 消息内容。```POST```请求时取整个请求体，可以是JSON、普通文本等任意文本；不是```POST```时取URL参数```message```。

Fields:

- `data.status` (string): 推送成功时为```ok```。
- `data.robot` (number): 本次请求的```robot```参数。
- `data.channel` (string): 本次请求的```channel```参数。
- `data.message` (string): 本次推送的消息。
- `data.affected` (number): 收到消息的托管者数量。

Returns (object): 推送成功时```code```为0，```data```字段见下方属性表；没有实盘订阅该频道（或频道名不合规、```robot```为空）时，HTTP状态码为500，```code```为5。

接收端策略：订阅频道，把收到的JSON消息解析出来，并用```id```区分新旧消息。

```javascript
// 接收端实盘（假设实盘Id为123456）
var CHANNEL = "6BC42A119B5DBFA2188A8279DA3B5C30"

function main() {
    var lastId = null
    while (true) {
        var msg = GetChannelData(CHANNEL)    // 第一次调用即订阅，返回null
        if (typeof msg == "string") {
            var obj = null
            try {
                obj = JSON.parse(msg)          // 请求体是JSON文本时再解析一次
            } catch (e) {
                Log("非JSON消息：", msg)
            }
            if (obj && obj.id != lastId) {     // 频道只保存最新一条，用id判断是否是新消息
                lastId = obj.id
                Log("收到外部消息：", obj)
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
        msg = GetChannelData(CHANNEL)    # 第一次调用即订阅，返回None
        if isinstance(msg, str):
            try:
                obj = json.loads(msg)    # 请求体是JSON文本时再解析一次
            except ValueError:
                obj = None
                Log("非JSON消息：", msg)
            if isinstance(obj, dict) and obj.get("id") != lastId:
                lastId = obj.get("id")
                Log("收到外部消息：", obj)
        Sleep(1000)
```

###### 投递规则

- 先订阅、后推送：实盘第一次调用```GetChannelData(channel)```即订阅该频道（返回空值），订阅随托管者心跳上报，稍等片刻后外部系统才能推送成功。没有实盘订阅时请求失败。
- 消息投递到```robot```实盘所在的托管者，该托管者上所有订阅了同一频道的实盘都会收到；其它托管者上的实盘收不到。
- 频道只保存最新一条消息，不排队：```GetChannelData()```每次返回最近收到的一条，读取不会清除它。需要区分新旧消息时，在消息中带上递增的编号或时间戳。
- 每个实盘最多订阅10个频道（含其它实盘的频道），超出时```GetChannelData()```返回空值并记录错误日志```channel subscriber exceed limit```。
- 实盘收到的是**字符串**（请求体原文）。请求体是JSON文本时，策略需要自己再解析一次。

###### 推送请求示例

外部系统推送一条消息：

```bash
curl -X POST \
     "https://www.fmz.com/api/v1?method=pub&robot=123456&channel=6BC42A119B5DBFA2188A8279DA3B5C30" \
     -d '{"id": 1, "action": "buy", "symbol": "BTC_USDT"}'
```

在TradingView中使用时，把上面的URL填入告警的Webhook地址，告警消息内容就是请求体。

###### 返回示例

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

没有实盘订阅该频道时：

```json
{
    "code": 5,
    "error": "No subscribers for channel: 6BC42A119B5DBFA2188A8279DA3B5C30",
    "data": null
}
```

### 扩展API接口返回码

扩展API接口的每个响应都是下面的JSON结构：```code```表示请求本身是否成功，方法的结果在```data```中。

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
| 参数不正确：```args```不是合法的JSON，或请求无法分发（例如```method```与```args```的个数不一致） | 5 |
| 方法执行出错（例如没有操作该实盘的权限、实盘正忙、超出可运行的实盘数量），见下文 | 6 |
| 请求来源IP不在这把API KEY的IP白名单内 | 7 |

```code```为0时，方法的结果在```data.result```中。参数个数或类型与方法不符时，```code```仍为0，```data.result```为```null```，```data.error```为错误信息（成功时为```null```）。例如参数个数不对：

```json
{
    "code": 0,
    "data": {
        "result": null,
        "error": "Params number mismatch for StopRobot: expected 1, got 0"
    }
}
```

方法执行过程中出错时，返回```code```为6，错误信息在顶层```error```字段，```data```为```null```。例如操作不属于自己的实盘：

```json
{
    "code": 6,
    "error": "Access Denied",
    "data": null
}
```

### 实盘状态码

```GetRobotList```、```GetRobotDetail```、```GetRobotLogs```返回数据中的```status```字段是实盘状态码，取值如下。

| 状态 | 代码 |
| - | - |
| 准备中（排队、编译中） | 0 |
| 运行中 | 1 |
| 停止中 | 2 |
| 已退出 | 3 |
| 被停止 | 4 |
| 策略有错误 | 5 |

#### 启动失败的返回值

负数代码不会出现在```status```字段中，只作为```NewRobot```、```RestartRobot```启动失败时的返回值：

| 含义 | 代码 |
| - | - |
| 策略不可用：租用已过期、既不是自己的策略也没有租用、策略已删除，或指定的策略版本不存在 | -1 |
| 没有找到可用的托管者：指定的托管者不在线，或者没有在线的托管者 | -2 |
| 读取实盘或账户数据失败 | -3 |
| 启动时实盘状态被同时修改（仅```RestartRobot```），重新查询后再试 | -4 |
| 余额不足 | -5 |
| 租用策略的并发实盘数达到上限，且策略没有设置超额单价 | -6 |

账号可运行的实盘数量超限、没有操作该实盘的权限等错误不以返回值表示，而是返回```code```为6的错误，见`扩展API接口返回码`。
