# FMZ 策略 API 参考

由平台语法指南（https://www.fmz.com/syntax-guide）生成：全部内置函数、结构体与常量，示例覆盖 JavaScript、Python、Rust；其后是通用约定（`## 通用约定`：品种代码、失败与空值）与交易所参考（`## 交易所`：能力矩阵与每个品牌一页 `####`）。按函数名（如 `exchange.GetTicker`）或品牌（如 `#### 币安`）在本文件内搜索。

## 内置函数

策略代码可以直接调用的全部API，按用途分为全局工具、日志与图表、行情、交易、账户、期货、交易所对象设置、扩展指令、网络、存储、并发、指标库和文件系统。

函数页只写通用语义：调用失败与不支持时的返回见`失败与空值`，品种的写法见`品种代码`，各交易所的支持差异见`能力矩阵`和各交易所页。

### Global

全局函数不依赖交易所对象，提供休眠与时间、错误处理与重试、数值格式化、JSON与编码哈希，以及运行环境信息。

最常用的是`Sleep`（轮询间隔）、`_D`（格式化时间）、`_N`（截断小数位）、`_C`（失败重试）和`GetLastError`（读取最近的错误）。

#### Version

```
Version()
```

返回当前系统版本号。

Returns (string): 当前系统版本号，例如：```3.9.2```。

打印托管者程序的版本号。

```javascript
function main() {
    Log("版本", Version())
    // 输出：版本 3.9.2
}
```

```python
def main():
    Log("版本", Version())
    # 输出：版本 3.9.2
```

```rust
fn main() {
    Log!("版本", Version());
    // 输出：版本 3.9.2
}
```

系统版本号即托管者程序的版本号。

See also: `GetOS`, `GetPid`, `IsVirtual`

#### IsVirtual

```
IsVirtual()
```

用于判断策略的运行环境是否为回测系统。

Returns (bool): 当策略运行在回测系统环境中时，返回真值，例如：```true```；当策略运行在实盘环境中时，返回假值，例如：```false```。

根据运行环境（回测或实盘）输出不同日志。

```javascript
function main() {
    if (IsVirtual()) {
        Log("当前为回测环境")
    } else {
        Log("当前为实盘环境")
    }
    // 输出：回测中为「当前为回测环境」，实盘中为「当前为实盘环境」
}
```

```python
def main():
    if IsVirtual():
        Log("当前为回测环境")
    else:
        Log("当前为实盘环境")
    # 输出：回测中为「当前为回测环境」，实盘中为「当前为实盘环境」
```

```rust
fn main() {
    if IsVirtual() {
        Log!("当前为回测环境");
    } else {
        Log!("当前为实盘环境");
    }
    // 输出：回测中为「当前为回测环境」，实盘中为「当前为实盘环境」
}
```

用于判断当前运行环境是否为回测系统，以便兼容回测与实盘环境之间的差异。

See also: `GetOS`, `Version`, `GetPid`

#### GetOS

```
GetOS()
```

获取托管者所在设备的操作系统信息。

Returns (string): 操作系统信息。

打印托管者所在设备的系统与架构。

```javascript
function main() {
    Log(GetOS())
    // 输出：linux/amd64（Linux x86-64 设备上）
}
```

```python
def main():
    Log(GetOS())
    # 输出：linux/amd64（Linux x86-64 设备上）
```

```rust
fn main() {
    Log!(GetOS());
    // 输出：linux/amd64（Linux x86-64 设备上）
}
```

例如，在**Mac OS**操作系统下运行的托管者，调用```GetOS()```函数可能返回：```darwin/arm64```或```darwin/amd64```。由于苹果电脑采用多种硬件架构，返回值中会附带具体的架构信息。其中，```darwin```即**Mac OS**系统的内核名称。返回值格式为```系统/架构```，与Go语言的```GOOS/GOARCH```一致，例如Linux系统上为```linux/amd64```，Windows系统上为```windows/amd64```。

See also: `GetPid`, `Version`, `IsVirtual`

#### GetPid

```
GetPid()
```

获取实盘进程的 ID。

Returns (number): 返回实盘进程的 ID。

打印实盘进程的进程Id。

```javascript
function main() {
    var id = GetPid()
    Log(id)
    // 输出：进程Id，例如 12345
}
```

```python
def main():
    id = GetPid()
    Log(id)
    # 输出：进程Id，例如 12345
```

```rust
fn main() {
    let id = GetPid();
    Log!(id);
    // 输出：进程Id，例如 12345
}
```

See also: `GetOS`, `Version`, `_G`

#### GetMeta

```
GetMeta()
```

获取在生成策略注册码时写入的```Meta```值。

Returns (string): ```Meta```数据。

读取生成注册码时写入的Meta。

```javascript
function main() {
    var meta = GetMeta()
    Log("Meta", meta)
    // 输出：Meta level1（生成注册码时写入的值；没有设置时为null）
}
```

```python
def main():
    meta = GetMeta()
    Log("Meta", meta)
    # 输出：Meta level1（生成注册码时写入的值；没有设置时为null）
```

```rust
fn main() {
    let meta = GetMeta();
    Log!("Meta", meta);
    // 输出：Meta level1（生成注册码时写入的值；没有设置时为null）
}
```

应用场景范例：使用```Meta```限制策略可操作的资产数量。

```javascript
function main() {
    // 策略允许的计价币最大资产数值
    var maxBaseCurrency = null

    // 获取创建注册码时的元数据
    var level = GetMeta()

    // 检测Meta对应的条件
    if (level == "level1") {
        // -1为不限制
        maxBaseCurrency = -1
    } else if (level == "level2") {
        maxBaseCurrency = 10
    } else if (level == "level3") {
        maxBaseCurrency = 1
    } else {
        maxBaseCurrency = 0.5
    }

    while(1) {
        Sleep(1000)
        var ticker = exchange.GetTicker()

        // 检测资产数值
        var acc = exchange.GetAccount()
        if (maxBaseCurrency != -1 && maxBaseCurrency < acc.Stocks + acc.FrozenStocks) {
            // 停止执行策略交易逻辑
            LogStatus(_D(), "level:", level, "Position exceeds registration code limit, strategy trading logic will not execute!")
            continue
        }

        // 其它交易逻辑

        // 正常输出状态栏信息
        LogStatus(_D(), "level:", level, "Strategy running normally! ticker data:\n", ticker)
    }
}
```

```python
def main():
    maxBaseCurrency = None
    level = GetMeta()

    if level == "level1":
        maxBaseCurrency = -1
    elif level == "level2":
        maxBaseCurrency = 10
    elif level == "level3":
        maxBaseCurrency = 1
    else:
        maxBaseCurrency = 0.5

    while True:
        Sleep(1000)
        ticker = exchange.GetTicker()
        acc = exchange.GetAccount()
        if maxBaseCurrency != -1 and maxBaseCurrency < acc["Stocks"] + acc["FrozenStocks"]:
            LogStatus(_D(), "level:", level, "Position exceeds registration code limit, strategy trading logic will not execute!")
            continue

        # 其它交易逻辑

        # 正常输出状态栏信息
        LogStatus(_D(), "level:", level, "Strategy running normally! ticker data:\n", ticker)
```

```rust
fn main() {
    // 策略允许的计价币最大资产数值
    let maxBaseCurrency;

    // 获取创建注册码时的元数据，Rust 的 GetMeta() 返回 JsonValue 类型
    let meta = GetMeta();
    let level = meta.as_str().unwrap_or("");

    // 检测Meta对应的条件
    if level == "level1" {
        // -1为不限制
        maxBaseCurrency = -1.0;
    } else if level == "level2" {
        maxBaseCurrency = 10.0;
    } else if level == "level3" {
        maxBaseCurrency = 1.0;
    } else {
        maxBaseCurrency = 0.5;
    }

    loop {
        Sleep(1000);
        let ticker = exchange.GetTicker(None).unwrap();

        // 检测资产数值
        let acc = exchange.GetAccount().unwrap();
        if maxBaseCurrency != -1.0 && maxBaseCurrency < acc.Stocks + acc.FrozenStocks {
            // 停止执行策略交易逻辑
            LogStatus!(_D(None), "level:", level, "Position exceeds registration code limit, strategy trading logic will not execute!");
            continue;
        }

        // 其它交易逻辑

        // 正常输出状态栏信息
        LogStatus!(_D(None), "level:", level, "Strategy running normally! ticker data:\n", ticker);
    }
}
```

应用场景：需要对不同的策略租用者进行资金限制。生成注册码时设置的```Meta```值长度不能超过190个字符。```GetMeta()```函数仅支持实盘，在回测系统中不起作用。如果生成策略注册码时未设置元数据（```Meta```），```GetMeta()```函数将返回空值。

See also: `exchange.GetAccount`, `LogStatus`, `_G`

#### Sleep

```
Sleep(millisecond)
```

休眠函数，使程序暂停运行一段指定的时间。

Parameters:

- `millisecond` (number, required): 休眠时长，单位为毫秒。

暂停10秒后继续执行。

```javascript
function main() {
    Sleep(1000 * 10)   // 等待10秒
    Log("已等待10秒")
}
```

```python
def main():
    Sleep(1000 * 10)   # 等待10秒
    Log("已等待10秒")
```

```rust
fn main() {
    Sleep(1000 * 10);   // 等待10秒
    Log!("已等待10秒");
}
```

例如，执行```Sleep(1000)```函数时，程序将休眠1秒。该函数支持小于1毫秒的休眠操作，例如```Sleep(0.1)```。支持的最小参数为```0.000001```，即纳秒级休眠，1纳秒等于```1e-6```毫秒。

在使用```Python```语言编写策略时，对于轮询间隔、时间等待等操作，应当使用```Sleep(millisecond)```函数，而不建议使用```Python```中```time```库的```time.sleep(second)```函数。因为策略在回测时若使用```time.sleep(second)```函数，会使策略程序实际等待一段时间（而非在回测系统的时间序列上跳过），从而导致回测速度非常缓慢。

See also: `Unix`, `UnixNano`, `EventLoop`, `_C`

#### Unix

```
Unix()
```

获取当前时刻的秒级时间戳。

Returns (number): 返回秒级时间戳。

获取当前的秒级时间戳。

```javascript
function main() {
    var t = Unix()
    Log(t)
    // 输出：1728632400（秒级时间戳，10位整数）
}
```

```python
def main():
    t = Unix()
    Log(t)
    # 输出：1728632400（秒级时间戳，10位整数）
```

```rust
fn main() {
    let t = Unix();
    Log!(t);
    // 输出：1728632400（秒级时间戳，10位整数）
}
```

See also: `UnixNano`

#### UnixNano

```
UnixNano()
```

获取当前时刻的纳秒级时间戳。

Returns (number): 纳秒级时间戳。

如果需要获取毫秒级时间戳，可以使用如下代码。

```javascript
function main() {
    var time = UnixNano() / 1000000
    Log(_N(time, 0))
}
```

```python
def main():
    time = UnixNano() // 1000000
    Log(time)
```

```rust
fn main() {
    let time = UnixNano() / 1000000;
    Log!(_N(time, 0));
}
```

See also: `Unix`

#### _D

```
_D()
_D(timestamp)
_D(timestamp, fmt)
```

将毫秒时间戳或者```Date```对象转换为时间字符串。

Parameters:

- `timestamp` (number / object, optional): 毫秒时间戳或者```Date```对象。
- `fmt` (string, optional): 格式化字符串，```JavaScript```语言默认格式：```yyyy-MM-dd hh:mm:ss```；```Python```语言默认格式：```%Y-%m-%d %H:%M:%S```。

Returns (string): 时间字符串。

获取、打印当前时间字符串。

```javascript
function main(){
    var time = _D()
    Log(time)
}
```

```python
def main():
    strTime = _D()
    Log(strTime)
```

```rust
fn main() {
    let time = _D(None);
    Log!(time);
}
```

时间戳为1574993606000，使用代码转换。

```javascript
function main() {
    Log(_D(1574993606000))
}
```

```python
def main():
    # 北京时间的服务器上运行：2019-11-29 10:13:26 ，另一台其它地区的服务器上的托管者运行此代码结果则为：2019-11-29 02:13:26
    Log(_D(1574993606))
```

```rust
fn main() {
    Log!(_D(1574993606000));
}
```

使用参数```fmt```格式化，```JavaScript```、```Python```语言的格式化字符串有所不同，具体参看以下例子。

```javascript
function main() {
    Log(_D(1574993606000, "yyyy--MM--dd hh--mm--ss"))
    // 输出：2019--11--29 10--13--26
}
```

```python
def main():
    # 1574993606为秒级别时间戳
    Log(_D(1574993606, "%Y--%m--%d %H--%M--%S"))
    # 输出：2019--11--29 10--13--26
```

```rust
fn main() {
    // Rust 的 _D() 函数不支持 fmt 参数，仅支持默认格式：yyyy-MM-dd hh:mm:ss
    Log!(_D(1574993606000));
    // 输出：2019-11-29 02:13:26（UTC）
}
```

不传任何参数就返回当前时间字符串。```Python```策略中使用```_D()```函数时，需要注意传入的参数为秒级别时间戳（JavaScript、Rust策略中为毫秒级别时间戳，1秒等于1000毫秒）。在实盘时使用```_D()```函数解析一个时间戳为可读的时间字符串时，需要注意托管者程序所在的操作系统的时区、时间设置。```_D()```函数解析一个时间戳为可读时间字符串是根据托管者系统的时间而定的。```Rust```语言的```_D()```函数不受托管者系统时区影响，固定输出UTC时间。

See also: `UnixNano`, `Unix`

#### GetCommand

```
GetCommand()
GetCommand(timeout)
```

获取策略交互命令。

Parameters:

- `timeout` (number, optional): 等待交互命令的超时时间，单位毫秒。设置为```-1```时不等待，没有命令立即返回（```JavaScript```、```Python```不传该参数时即为```-1```）；设置为```0```时一直阻塞等待，直到收到命令；设置为正数时最多等待该毫秒数。```Rust```语言必须传入该参数，轮询时传入```-1```。

Returns (string / 空值): 返回的命令格式为```ControlName:Data```。```ControlName```是控件名称，```Data```是控件中输入的数据。如果交互控件没有输入框、下拉框等组件（例如：不带输入框的按钮控件）则返回的命令格式为```ControlName```，仅返回控件名称。没有交互命令时返回空值。

检测交互命令并且在检测到交互命令时使用```Log```函数输出交互命令。

```javascript
function main(){
    while(true) {
        var cmd = GetCommand()
        if (cmd) {
            Log(cmd)
        }
        Sleep(1000)
    }
}
```

```python
def main():
    while True:
        cmd = GetCommand()
        if cmd:
            Log(cmd)
        Sleep(1000)
```

```rust
fn main() {
    loop {
        // Rust 的 GetCommand() 需要传入超时参数（毫秒），传入 -1 表示不等待；返回 Option<String>，无命令时为 None
        if let Some(cmd) = GetCommand(-1) {
            Log!(cmd);
        }
        Sleep(1000);
    }
}
```

例如策略交互控件中添加了一个不带输入框的控件，交互控件命名为：```buy```，控件描述信息为：```买入```，这是一个按钮控件。继续添加一个带输入框的控件，交互控件名为：```sell```，控件描述信息为：```卖出```，这是一个由按钮和输入框组合起来的交互控件。策略中设计交互代码来响应不同交互控件。

```javascript
function main() {
    while (true) {
        LogStatus(_D())
        var cmd = GetCommand()
        if (cmd) {
            Log("cmd:", cmd)
            var arr = cmd.split(":")
            if (arr[0] == "buy") {
                Log("Buy, this control has no quantity")
            } else if (arr[0] == "sell") {
                Log("Sell, this control has quantity:", arr[1])
            } else {
                Log("Other control triggered:", arr)
            }
        }
        Sleep(1000)
    }
}
```

```python
def main():
    while True:
        LogStatus(_D())
        cmd = GetCommand()
        if cmd:
            Log("cmd:", cmd)
            arr = cmd.split(":")
            if arr[0] == "buy":
                Log("Buy, this control has no quantity")
            elif arr[0] == "sell":
                Log("Sell, this control has quantity:", arr[1])
            else:
                Log("Other control triggered:", arr)
        Sleep(1000)
```

```rust
fn main() {
    loop {
        LogStatus!(_D(None));
        if let Some(cmd) = GetCommand(-1) {
            Log!("cmd:", cmd);
            let arr: Vec<&str> = cmd.split(':').collect();
            if arr[0] == "buy" {
                Log!("Buy, this control has no quantity");
            } else if arr[0] == "sell" {
                Log!("Sell, this control has quantity:", arr[1]);
            } else {
                Log!("Other control triggered:", arr);
            }
        }
        Sleep(1000);
    }
}
```

回测系统中不起作用。

See also: `LogStatus`, `状态栏按钮`, `状态栏按钮（旧写法）`

#### GetLastError

```
GetLastError()
```

获取最近一次的错误信息。

Returns (string): 最近一次的错误信息。

查询不存在的订单后读取出错信息。

```javascript
function main(){
    // 由于不存在编号为 123 的订单，因此会触发错误
    exchange.GetOrder("123")
    var error = GetLastError()
    Log(error)
    // 输出：GetOrder 调用失败的出错信息
}
```

```python
def main():
    exchange.GetOrder("123")
    error = GetLastError()
    Log(error)
    # 输出：GetOrder 调用失败的出错信息
```

```rust
fn main() {
    // 由于不存在编号为 123 的订单，因此会触发错误
    // Rust 的 GetOrder 接受 &OrderId 参数，字符串 id 需放在 S 字段中
    let id = OrderId { S: "123".to_string(), ..Default::default() };
    let _ = exchange.GetOrder(&id);
    let error = GetLastError();
    Log!(error);
    // 输出：GetOrder 调用失败的出错信息
}
```

该函数在回测系统中不起作用。

See also: `SetErrorFilter`, `_C`, `Log`, `失败与空值`

#### SetErrorFilter

```
SetErrorFilter(filters)
```

过滤错误日志。

Parameters:

- `filters` (string, required): 正则表达式字符串。

过滤常见错误。

```javascript
function main() {
    SetErrorFilter("502:|503:|tcp|character|unexpected|network|timeout|WSARecv|Connect|GetAddr|no such|reset|http|received|EOF|reused")
}
```

```python
def main():
    SetErrorFilter("502:|503:|tcp|character|unexpected|network|timeout|WSARecv|Connect|GetAddr|no such|reset|http|received|EOF|reused")
```

```rust
fn main() {
    SetErrorFilter("502:|503:|tcp|character|unexpected|network|timeout|WSARecv|Connect|GetAddr|no such|reset|http|received|EOF|reused");
}
```

过滤指定接口的错误信息。

```javascript
function main() {
    // 查询一个不存在的订单（id 为 123），故意触发接口报错
    var order = exchange.GetOrder("123")
    Log(order)
    // 过滤 http 502 错误和 GetOrder 接口错误；设置错误过滤后，第二次调用 GetOrder 将不再报错
    SetErrorFilter("502:|GetOrder")
    order = exchange.GetOrder("123")
    Log(order)
}
```

```python
def main():
    order = exchange.GetOrder("123")
    Log(order)
    SetErrorFilter("502:|GetOrder")
    order = exchange.GetOrder("123")
    Log(order)
```

```rust
fn main() {
    // 查询一个不存在的订单（id 为 123），故意触发接口报错
    let orderId = OrderId { S: "123".to_string(), ..Default::default() };
    let order = exchange.GetOrder(&orderId);
    Log!(order);
    // 过滤 http 502 错误和 GetOrder 接口错误；设置错误过滤后，第二次调用 GetOrder 将不再报错
    SetErrorFilter("502:|GetOrder");
    let order = exchange.GetOrder(&orderId);
    Log!(order);
}
```

与此正则表达式匹配的错误日志将不再上传至日志系统。该函数可多次调用（无次数限制）以设置多个过滤条件，多次设置的正则表达式会累积并同时生效。可传入空字符串以重置用于过滤错误日志的正则表达式：```SetErrorFilter("")```。被过滤的日志将不再写入托管者目录下对应实盘 Id 的数据库文件中，从而防止因频繁报错导致数据库文件膨胀。

See also: `GetLastError`, `Log`, `失败与空值`

#### _N

```
_N(num)
_N(num, precision)
```

格式化一个浮点数。

Parameters:

- `num` (number, required): 需要格式化的浮点数。
- `precision` (number, optional): 格式化的精度设置，参数```precision```为整数，参数```precision```默认为4。

Returns (number): 根据精度设置，格式化后的浮点数。

例如```_N(3.1415, 2)```将删除```3.1415```小数点两位以后的值，函数返回```3.14```。

```javascript
function main(){
    var i = 3.1415
    Log(i)
    var ii = _N(i, 2)
    Log(ii)
}
```

```python
def main():
    i = 3.1415
    Log(i)
    ii = _N(i, 2)
    Log(ii)
```

```rust
fn main() {
    let i = 3.1415;
    Log!(i);
    let ii = _N(i, 2);
    Log!(ii);
}
```

如果需要将小数点左边的N个位数都变为0，可以这么写。

```javascript
function main(){
    var i = 1300
    Log(i)
    var ii = _N(i, -3)
    // 查看日志得知为1000
    Log(ii)
}
```

```python
def main():
    i = 1300
    Log(i)
    ii = _N(i, -3)
    Log(ii)
```

```rust
fn main() {
    let i = 1300;
    Log!(i);
    let ii = _N(i, -3);
    // 查看日志得知为1000
    Log!(ii);
}
```

参数```precision```可以为正整数、负整数。

See also: `exchange.SetPrecision`

#### _C

```
_C(pfn)
_C(pfn, ...args)
```

重试函数，用于接口容错。

Parameters:

- `pfn` (function, required): 函数引用，是一个**回调函数**。
- `arg` (string / number / bool / object / array / function / any, optional): **回调函数**的参数，参数```arg```可能有多个。参数```arg```的类型与个数根据**回调函数**的参数而定。

Returns (any): 回调函数执行时的返回值（不会是```null```、```undefined```、```false```）。

对于无参数的函数容错。

```javascript
function main(){
    var ticker = _C(exchange.GetTicker)
    // 调整_C()函数重试时间间隔为2秒
    _CDelay(2000)
    var depth = _C(exchange.GetDepth)
    Log(ticker)
    Log(depth)
}
```

```python
def main():
    ticker = _C(exchange.GetTicker)
    _CDelay(2000)
    depth = _C(exchange.GetDepth)
    Log(ticker)
    Log(depth)
```

```rust
fn main() {
    let ticker = _C!(exchange.GetTicker(None));
    // 调整_C!()宏重试时间间隔为2秒
    _CDelay(2000);
    let depth = _C!(exchange.GetDepth(None));
    Log!(ticker);
    Log!(depth);
}
```

对于有参数的函数容错。

```javascript
function main(){
    var records = _C(exchange.GetRecords, PERIOD_D1)
    Log(records)
}
```

```python
def main():
    records = _C(exchange.GetRecords, PERIOD_D1)
    Log(records)
```

```rust
fn main() {
    let records = _C!(exchange.GetRecords(None, PERIOD_D1, None));
    Log!(records);
}
```

也可以用于自定义函数的容错处理。

```javascript
var test = function(a, b){
    var time = new Date().getTime() / 1000
    if(time % b == 3){
        Log("Condition met!", "#FF0000")
        return true
    }
    Log("Retrying!", "#FF0000")
    return false
}

function main(){
    var ret = _C(test, 1, 5)
    Log(ret)
}
```

```python
import time
def test(a, b):
    ts = time.time()
    if ts % b == 3:
        Log("Condition met!", "#FF0000")
        return True
    Log("Retrying!", "#FF0000")
    return False

def main():
    ret = _C(test, 1, 5)
    Log(ret)
```

```rust
fn test(a: i64, b: i64) -> Result<bool> {
    let time = Unix();
    if time % b == 3 {
        Log!("Condition met!", "#FF0000");
        return Ok(true);
    }
    Log!("Retrying!", "#FF0000");
    Err(Error::Api("retry".to_string()))
}

fn main() {
    // Rust 中自定义函数返回 Result 类型即可使用 _C! 宏容错，返回 Err 时会重试
    let ret = _C!(test(1, 5));
    Log!(ret);
}
```

```_C()```函数会一直调用指定函数直到成功返回（参数```pfn```引用的函数调用时返回```null```、```undefined```或```false```会重试调用```pfn```，```Python```中为```None```或```False```；返回```0```、空字符串等其它值不会重试，直接作为结果返回）。
例如```_C(exchange.GetTicker)```。默认重试间隔为3秒，可以调用```_CDelay()```函数来设置重试间隔。
例如```_CDelay(1000)```，指改变```_C()```函数的重试间隔为1秒。

可以但不限于对以下函数做容错处理：

- ```exchange.GetTicker()```
- ```exchange.GetDepth()```
- ```exchange.GetTrades()```
- ```exchange.GetRecords()```
- ```exchange.GetAccount()```
- ```exchange.GetOrders()```
- ```exchange.GetOrder()```
- ```exchange.GetPositions()```

都可以通过```_C()```函数来调用进行容错。```_C()```函数不局限于以上列出的函数容错，参数```pfn```是函数引用并非函数调用，注意是```_C(exchange.GetTicker)```并不是```_C(exchange.GetTicker())```。

See also: `Sleep`, `GetLastError`, `SetErrorFilter`, `失败与空值`

#### _Cross

```
_Cross(arr1, arr2)
```

返回数组```arr1```与数组```arr2```的交叉周期数。

Parameters:

- `arr1` (array, required): 元素为```number```类型的数组。
- `arr2` (array, required): 元素为```number```类型的数组。

Returns (number): 数组```arr1```与数组```arr2```的交叉周期数。

可以模拟一组数据测试```_Cross(Arr1, Arr2)```函数。

```javascript
// 快线指标
var arr1 = [1,2,3,4,5,6,8,8,9]
// 慢线指标
var arr2 = [2,3,4,5,6,7,7,7,7]
function main(){
    Log("_Cross(arr1, arr2) : ", _Cross(arr1, arr2))
    Log("_Cross(arr2, arr1) : ", _Cross(arr2, arr1))
}
```

```python
arr1 = [1,2,3,4,5,6,8,8,9]
arr2 = [2,3,4,5,6,7,7,7,7]
def main():
    Log("_Cross(arr1, arr2) : ", _Cross(arr1, arr2))
    Log("_Cross(arr2, arr1) : ", _Cross(arr2, arr1))
```

```rust
fn main() {
    // 快线指标
    let arr1 = [1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 8.0, 8.0, 9.0];
    // 慢线指标
    let arr2 = [2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 7.0, 7.0, 7.0];
    Log!("_Cross(arr1, arr2) : ", _Cross(&arr1, &arr2));
    Log!("_Cross(arr2, arr1) : ", _Cross(&arr2, &arr1));
}
```

```_Cross()```函数的返回值是正数表示上穿的周期，负数表示下穿的周期，0指当前价格一样。具体使用说明：[内置函数_Cross分析及使用说明](https://www.fmz.com/bbs-topic/1140)。

See also: `TA.MA`, `TA.EMA`, `TA.MACD`, `exchange.GetRecords`

#### JSON.parse

```
JSON.parse(s)
JSON.parse(s, safeStr)
```

解码（解析）JSON字符串，是**ECMAScript**标准内建对象```JSON```的方法。发明者量化交易平台对其扩展了一个参数```safeStr```。JavaScript、Rust策略可用；Python策略使用标准库```json```（大数值可以借助第三方库处理）。

Parameters:

- `s` (string, required): 该参数为需要解码（解析）的```JSON```字符串。
- `safeStr` (bool, optional): 当该参数设置为```true```时，解析过程中若遇到可能超出精度范围的数值，会将其以字符串形式返回，以避免精度丢失或溢出问题。

Returns (object): 返回值为```JSON```对象。

解码（解析）一个包含大数值的```JSON```字符串。

```javascript
function main() {
    let s1 = '{"num": 8754613216564987646512354656874651651358}'
    Log("JSON.parse:", JSON.parse(s1))
    // 输出：JSON.parse: {"num":8.754613216564987e+39}
    Log("JSON.parse:", JSON.parse(s1, true))
    // 输出：JSON.parse: {"num":"8754613216564987646512354656874651651358"}

    let s2 = '{"num": 123}'
    Log("JSON.parse:", JSON.parse(s2))
    // 输出：JSON.parse: {"num":123}
    Log("JSON.parse:", JSON.parse(s2, true))
    // 输出：JSON.parse: {"num":123}
}
```

```rust
fn main() {
    // Rust 使用 JSONParse() 函数解析JSON字符串，没有 safeStr 参数
    // 超出精度范围的大数值会被解析为 f64 ，可能丢失精度
    let s1 = r#"{"num": 8754613216564987646512354656874651651358}"#;
    Log!("JSONParse:", JSONParse(s1).unwrap()["num"].as_f64().unwrap_or(0.0));
    // 输出：JSONParse: 8.754613216564987e39

    let s2 = r#"{"num": 123}"#;
    Log!("JSONParse:", JSONParse(s2).unwrap()["num"].as_f64().unwrap_or(0.0));
    // 输出：JSONParse: 123
}
```

```JSON.parse()```函数可以正确解析包含有较大数值的JSON字符串，设置```safeStr```参数为真值，会将较大的数值解析为字符串类型。

```safeStr```参数位也可以传入```reviver```函数，用法与标准```JSON.parse(text, reviver)```的```reviver```参数相同：解析结果的每个成员都会调用一次该函数，用它的返回值替换原值。

仅支持JavaScript语言。

回测系统中不支持```JSON.parse()```函数的```safeStr```参数功能。

See also: `JSON.stringify`, `HttpQuery`, `exchange.GetRawJSON`

#### JSON.stringify

```
JSON.stringify(obj)
```

编码JSON字符串，是**ECMAScript**标准内建对象```JSON```的方法。JavaScript、Rust策略可用；Python策略使用标准库```json```。

Parameters:

- `obj` (string / number / bool / object / array / function / any, required): 该参数为需要编码的对象。

Returns (string): 返回值为编码后的```JSON```字符串。

编码一个对象，输出编码后的JSON字符串。

```javascript
function main() {
    let s1 = {"num": "8754613216564987646512354656874651651358"}
    Log("JSON.stringify:", JSON.stringify(s1))
    // 输出：JSON.stringify: {"num":"8754613216564987646512354656874651651358"}
    // JSON.stringify(s1) 返回字符串
}
```

```rust
fn main() {
    // Rust 没有 JSON.stringify，JsonValue 的 to_string() 输出紧凑JSON（对象的键按字母序）
    let mut m = std::collections::BTreeMap::new();
    m.insert("num".to_string(),
        JsonValue::String("8754613216564987646512354656874651651358".to_string()));
    let s1 = JsonValue::Object(m);
    Log!("JSON.stringify:", s1.to_string());
    // 输出：JSON.stringify: {"num":"8754613216564987646512354656874651651358"}
}
```

仅支持JavaScript语言。

See also: `JSON.parse`, `LogStatus`, `HttpQuery`

#### Encode

```
Encode(algo, inputFormat, outputFormat, data)
Encode(algo, inputFormat, outputFormat, data, keyFormat, key)
```

该函数根据传入的参数对数据进行编码。

Parameters:

- `algo` (string, required): 编码、哈希、加密或压缩使用的算法，例如```raw```、```sha256```、```text.encoder.utf8```、```aes.encrypt```；全部取值见备注。
- `inputFormat` (string, required): 用于指定```data```参数的数据格式。```inputFormat```参数支持设置为："raw"，"hex"，"base64"，"string"其中之一。"raw"表示数据为原始数据，"hex"表示数据为```hex```编码，"base64"表示数据为```base64```编码，"string"表示数据为字符串。此外还支持"base64.url"、"base64.rawurl"（URL安全的base64编码，后者不带填充）以及"latin1"（每个字符的码点即一个字节）。
- `outputFormat` (string, required): 用于指定输出的数据格式。```outputFormat```参数支持设置为："raw"，"hex"，"base64"，"string"其中之一。"raw"表示数据为原始数据，"hex"表示数据为```hex```编码，"base64"表示数据为```base64```编码，"string"表示数据为字符串。此外还支持"base64.url"、"base64.rawurl"（URL安全的base64编码，后者不带填充）。"raw"、"string"输出时每个字节对应一个字符（按latin1）。
- `data` (string, required): 所要处理的数据。
- `keyFormat` (string, optional): 用于指定```key```参数的数据格式。```keyFormat```参数支持设置为："raw"，"hex"，"base64"，"string"其中之一。"raw"表示数据为原始数据，"hex"表示数据为```hex```编码，"base64"表示数据为```base64```编码，"string"表示数据为字符串。此外还支持"base64.url"、"base64.rawurl"（URL安全的base64编码，后者不带填充）以及"latin1"（每个字符的码点即一个字节）。
- `key` (string, optional): ```HMAC```加密时使用的秘钥。
参数```algo```设置为"sign"或者"signTx"时需要参数```key```。
参数```algo```设置为"raw"时不会使用```key```参数进行```HMAC```加密（因为HMAC加密必须指定算法）。

Returns (string): 编码、加密之后的数据。

Encode函数调用例子。

```javascript
function main() {
    Log(Encode("raw", "raw", "hex", "example", "raw", "123"))
    // 输出：6578616d706c65
    Log(Encode("raw", "raw", "hex", "example"))
    // 输出：6578616d706c65
    Log(Encode("sha256", "raw", "hex", "example", "raw", "123"))
    // 输出：698d54f0494528a759f19c8e87a9f99e75a5881b9267ee3926bcf62c992d84ba
    Log(Encode("sha256", "raw", "hex", "example", "", "123"))
    // 输出：50d858e0985ecc7f60418aaf0cc5ab587f42c2570a884095a9e8ccacd0f6545c
    Log(Encode("sha256", "raw", "hex", "example", null, "123"))
    // 输出：50d858e0985ecc7f60418aaf0cc5ab587f42c2570a884095a9e8ccacd0f6545c
    Log(Encode("sha256", "raw", "hex", "example", "string", "123"))
    // 输出：698d54f0494528a759f19c8e87a9f99e75a5881b9267ee3926bcf62c992d84ba

    Log(Encode("raw", "raw", "hex", "123"))
    // 输出：313233
    Log(Encode("raw", "raw", "base64", "123"))
    // 输出：MTIz

    Log(Encode("sha256", "raw", "hex", "example", "hex", "313233"))
    // 输出：698d54f0494528a759f19c8e87a9f99e75a5881b9267ee3926bcf62c992d84ba
    Log(Encode("sha256", "raw", "hex", "example", "base64", "MTIz"))
    // 输出：698d54f0494528a759f19c8e87a9f99e75a5881b9267ee3926bcf62c992d84ba
}
```

```python
def main():
    Log(Encode("raw", "raw", "hex", "example", "raw", "123"))
    # 输出：6578616d706c65
    Log(Encode("raw", "raw", "hex", "example", "", ""))
    # 输出：6578616d706c65
    Log(Encode("sha256", "raw", "hex", "example", "raw", "123"))
    # 输出：698d54f0494528a759f19c8e87a9f99e75a5881b9267ee3926bcf62c992d84ba
    Log(Encode("sha256", "raw", "hex", "example", "", "123"))
    # 输出：50d858e0985ecc7f60418aaf0cc5ab587f42c2570a884095a9e8ccacd0f6545c

    Log(Encode("sha256", "raw", "hex", "example", "string", "123"))
    # 输出：698d54f0494528a759f19c8e87a9f99e75a5881b9267ee3926bcf62c992d84ba

    Log(Encode("raw", "raw", "hex", "123", "", ""))
    # 输出：313233
    Log(Encode("raw", "raw", "base64", "123", "", ""))
    # 输出：MTIz

    Log(Encode("sha256", "raw", "hex", "example", "hex", "313233"))
    # 输出：698d54f0494528a759f19c8e87a9f99e75a5881b9267ee3926bcf62c992d84ba
    Log(Encode("sha256", "raw", "hex", "example", "base64", "MTIz"))
    # 输出：698d54f0494528a759f19c8e87a9f99e75a5881b9267ee3926bcf62c992d84ba
```

```rust
fn main() {
    // Rust 的 Encode() 函数6个参数均为必填，不加密时 keyFormat、key 传入空字符串
    Log!(Encode("raw", "raw", "hex", "example", "raw", "123"));
    // 输出：6578616d706c65
    Log!(Encode("raw", "raw", "hex", "example", "", ""));
    // 输出：6578616d706c65
    Log!(Encode("sha256", "raw", "hex", "example", "raw", "123"));
    // 输出：698d54f0494528a759f19c8e87a9f99e75a5881b9267ee3926bcf62c992d84ba
    Log!(Encode("sha256", "raw", "hex", "example", "", "123"));
    // 输出：50d858e0985ecc7f60418aaf0cc5ab587f42c2570a884095a9e8ccacd0f6545c

    Log!(Encode("sha256", "raw", "hex", "example", "string", "123"));
    // 输出：698d54f0494528a759f19c8e87a9f99e75a5881b9267ee3926bcf62c992d84ba

    Log!(Encode("raw", "raw", "hex", "123", "", ""));
    // 输出：313233
    Log!(Encode("raw", "raw", "base64", "123", "", ""));
    // 输出：MTIz

    Log!(Encode("sha256", "raw", "hex", "example", "hex", "313233"));
    // 输出：698d54f0494528a759f19c8e87a9f99e75a5881b9267ee3926bcf62c992d84ba
    Log!(Encode("sha256", "raw", "hex", "example", "base64", "MTIz"));
    // 输出：698d54f0494528a759f19c8e87a9f99e75a5881b9267ee3926bcf62c992d84ba
}
```

参数```algo```也支持："text.encoder.utf8"，"text.decoder.utf8"，"text.encoder.gbk"，"text.decoder.gbk"，对字符串编码、解码。

```javascript
function main(){
    var ret1 = Encode("text.encoder.utf8", "raw", "hex", "你好")
    Log(ret1)
    // 输出：e4bda0e5a5bd
    var ret2 = Encode("text.decoder.utf8", "hex", "string", ret1)
    Log(ret2)

    var ret3 = Encode("text.encoder.gbk", "raw", "hex", "你好")
    Log(ret3)
    // 输出：c4e3bac3
    var ret4 = Encode("text.decoder.gbk", "hex", "string", ret3)
    Log(ret4)
}
```

```python
def main():
    ret1 = Encode("text.encoder.utf8", "raw", "hex", "你好", "", "")
    Log(ret1)
    # 输出：e4bda0e5a5bd
    ret2 = Encode("text.decoder.utf8", "hex", "string", ret1, "", "")
    Log(ret2)

    ret3 = Encode("text.encoder.gbk", "raw", "hex", "你好", "", "")
    Log(ret3)
    # 输出：c4e3bac3
    ret4 = Encode("text.decoder.gbk", "hex", "string", ret3, "", "")
    Log(ret4)
```

```rust
fn main() {
    // Rust 的 Encode() 函数6个参数均为必填，不加密时 keyFormat、key 传入空字符串
    let ret1 = Encode("text.encoder.utf8", "raw", "hex", "你好", "", "");
    Log!(ret1);
    // 输出：e4bda0e5a5bd
    let ret2 = Encode("text.decoder.utf8", "hex", "string", &ret1, "", "");
    Log!(ret2);

    let ret3 = Encode("text.encoder.gbk", "raw", "hex", "你好", "", "");
    Log!(ret3);
    // 输出：c4e3bac3
    let ret4 = Encode("text.decoder.gbk", "hex", "string", &ret3, "", "");
    Log!(ret4);
}
```

```Encode()```函数仅支持实盘。不传```key```、```keyFormat```参数，则不使用```key```加密。

```algo```参数的取值：

| 类别 | 取值 |
| - | - |
| 不使用算法 | ```raw``` |
| 签名 | ```sign```、```signTx``` |
| 哈希（MD、SHA-1、SHA-2） | ```md4```、```md5```、```sha1```、```sha224```、```sha256```、```sha384```、```sha512```、```sha512.384```、```sha512.256```、```sha512.224``` |
| 哈希（SHA-3、Keccak） | ```keccak256```、```sha3.224```、```sha3.256```、```sha3.384```、```sha3.512```、```sha3.keccak256```、```sha3.keccak512``` |
| 哈希（其它） | ```ripemd160```、```blake2b.256```、```blake2b.512```、```blake2s.128```、```blake2s.256``` |
| 字符串编码、解码 | ```text.encoder.utf8```、```text.decoder.utf8```、```text.encoder.gbk```、```text.decoder.gbk``` |
| 其它字符集 | ```text.encoder.字符集名```、```text.decoder.字符集名```，例如```text.decoder.big5``` |
| Ed25519 | ```ed25519```、```ed25519.seed```；可以指定哈希算法，例如```ed25519.md5```、```ed25519.sha512``` |
| AES加密、解密 | ```aes.encrypt```、```aes.decrypt```，可加模式后缀```.cbc```（默认）、```.cfb```、```.ecb```，例如```aes.decrypt.ecb``` |
| 压缩、解压缩 | ```gzip.deflate```、```gzip.inflate```、```zlib.deflate```、```zlib.inflate```、```raw.deflate```、```raw.inflate``` |

AES的密钥由```key```参数传入，长度须为16、24或32字节（对应AES-128、AES-192、AES-256）；CBC、CFB模式使用密钥的前16字节作为IV，填充方式为PKCS7。

See also: `MD5`, `exchange.Encode`, `HttpQuery`, `Dial`

#### MD5

```
MD5(data)
```

计算参数```data```的 MD5 哈希值。

Parameters:

- `data` (string, required): 需要进行 MD5 计算的数据。

Returns (string): MD5 哈希值。

计算字符串 hello world 的MD5值。

```javascript
function main() {
    Log(MD5("hello world"))
    // 输出：5eb63bbbe01eeed093cb22bb8f5acdc3
}
```

```python
def main():
    Log(MD5("hello world"))
    # 输出：5eb63bbbe01eeed093cb22bb8f5acdc3
```

```rust
fn main() {
    Log!(MD5("hello world"));
    // 输出：5eb63bbbe01eeed093cb22bb8f5acdc3
}
```

调用```MD5("hello world")```函数后，返回值为：```5eb63bbbe01eeed093cb22bb8f5acdc3```。

See also: `Encode`

#### UUID

```
UUID()
```

创建一个 UUID。

Returns (string): 由 32 位大写十六进制字符组成的 UUID 字符串（不带连字符）。

生成两个UUID，每次调用结果都不同。

```javascript
function main() {
    var uuid1 = UUID()
    var uuid2 = UUID()
    Log(uuid1, uuid2)
    // 输出：两个不同的32位大写十六进制串，例如 3F2A8C1D9B7E4A6C8D0E1F2A3B4C5D6E
}
```

```python
def main():
    uuid1 = UUID()
    uuid2 = UUID()
    Log(uuid1, uuid2)
    # 输出：两个不同的32位大写十六进制串，例如 3F2A8C1D9B7E4A6C8D0E1F2A3B4C5D6E
```

```rust
fn main() {
    let uuid1 = UUID();
    let uuid2 = UUID();
    Log!(uuid1, uuid2);
    // 输出：两个不同的32位大写十六进制串，例如 3F2A8C1D9B7E4A6C8D0E1F2A3B4C5D6E
}
```

```UUID()``` 函数仅支持实盘。

See also: `MD5`, `Encode`, `UnixNano`

### Log

日志与图表函数把信息输出到实盘或回测页面：日志栏（`Log`，交易日志`exchange.Log`）、状态栏（`LogStatus`）、收益曲线（`LogProfit`）和自定义图表（`Chart`、`KLineChart`）。

日志写入实盘数据库，长期运行的策略用`LogReset`、`LogVacuum`控制数据量；`console.log`、`console.error`只写「调试信息」栏，不进日志栏。

#### Log

```
Log(...msgs)
```

输出日志。

Parameters:

- `msg` (string / number / bool / object / array / any, optional): 输出的内容，参数```msg```可以传多个。

可以传多个```msg```参数。

```javascript
function main() {
    Log("msg1", "msg2", "msg3")
}
```

```python
def main():
    Log("msg1", "msg2", "msg3")
```

```rust
fn main() {
    Log!("msg1", "msg2", "msg3");
}
```

支持设置输出消息的颜色，如果设置颜色和推送同时使用，需要先设置颜色，最后使用```@```字符设置推送。

```javascript
function main() {
    Log("Hello FMZ Quant !@")
    Sleep(1000 * 5)
    // 字符串内加入#ff0000，打印日志显示为红色，并且推送消息
    Log("Hello, #ff0000@")
}
```

```python
def main():
    Log("Hello FMZ Quant !@")
    Sleep(1000 * 5)
    Log("Hello, #ff0000@")
```

```rust
fn main() {
    Log!("Hello FMZ Quant !@");
    Sleep(1000 * 5);
    // 字符串内加入#ff0000，打印日志显示为红色，并且推送消息
    Log!("Hello, #ff0000@");
}
```

```Log()```函数支持打印```base64```编码后的图片，以``` ` ```开头，以``` ` ```结尾，例如。

```javascript
function main() {
    Log("`data:image/png;base64,AAAA`")
}
```

```python
def main():
    Log("`data:image/png;base64,AAAA`")
```

```rust
fn main() {
    Log!("`data:image/png;base64,AAAA`");
}
```

```Log()```函数支持直接打印```Python```的```matplotlib.pyplot```对象，只要对象包含```savefig```方法就可以直接使用```Log```函数打印，例如。

```python
import matplotlib.pyplot as plt
def main():
    plt.plot([3,6,2,4,7,1])
    Log(plt)
```

```Log()```函数支持语言切换，```Log()```函数输出文本，会根据平台页面上语言设置自动切换为对应的语言，例如。

```javascript
function main() {
    Log("[trans]中文|abc[/trans]")
}
```

```python
def main():
    Log("[trans]中文|abc[/trans]")
```

```rust
fn main() {
    Log!("[trans]中文|abc[/trans]");
}
```

```Log()```函数在实盘或者回测系统的日志区域输出一条日志信息，实盘运行时日志会保存在实盘的数据库中。```Log()```函数输出的内容以```@```字符结尾则这条日志会进入消息推送队列。推送到当前发明者量化交易平台账号[推送设置](https://www.fmz.com/m/account)中配置的邮箱、WebHook地址等。[调试工具](https://www.fmz.com/m/debug)、回测系统不支持消息推送。消息推送有频率限制，具体限制规则如下：一个实盘在一个状态上报周期（约20秒）内产生的多条推送消息会合并为一条推送发送，相邻的重复内容折叠为```内容 ×N```的形式，合并后的推送最多4096字节，超出部分会被截断并注明截断的数量；每个平台账号每小时最多发送50条推送，超出的推送不再发送；每条推送的正文最多保留200个字符（通过 Log 函数输出的推送日志会正常打印显示在日志区域）。

```Log()```函数输出的内容以```&```字符结尾，该条日志将标记为私密日志。当实盘公开展示时，该条日志对其他用户隐藏，但对实盘拥有者账户视角下不隐藏。可用于记录敏感信息如API密钥、账户余额等。例如：```Log("私密信息", "&")```。

推送渠道（邮箱、WebHook等）的设置方法与WebHook请求的格式见用户指南「平台基础 → 实盘 → 实盘消息推送」。

See also: `LogReset`, `LogVacuum`

#### LogStatus

```
LogStatus(...msgs)
```

刷新回测或实盘页面的状态栏：输出文字、表格、按钮，或带 `type` 的组件对象（指标卡、图表、标签页等）；每次调用替换上一次的内容。

Parameters:

- `msg` (string / number / bool / object / array, optional): 要显示的内容：文字、数字、表格或按钮对象、`状态栏组件`对象，或它们组成的数组。可以传多个，用空格拼接；`"\n"` 换行。

支持设置输出内容的颜色。

```javascript
function main() {
    LogStatus('This is a normal status message')
    LogStatus('This is a red font status message#ff0000')
    LogStatus('This is a multi-line status message\nI am the second line')
}
```

```python
def main():
    LogStatus('This is a normal status message')
    LogStatus('This is a red font status message#ff0000')
    LogStatus('This is a multi-line status message\nI am the second line')
```

```rust
fn main() {
    LogStatus!("This is a normal status message");
    LogStatus!("This is a red font status message#ff0000");
    LogStatus!("This is a multi-line status message\nI am the second line");
}
```

直接传组件对象：文字后面跟一张最新价指标卡。

```javascript
function main() {
    var ticker = exchange.GetTicker()
    if (!ticker) return
    // 组件对象直接传，不用 JSON.stringify，也不用加反引号
    LogStatus("更新时间 " + _D(), {type: "kpi", title: "最新价", value: ticker.Last})
    // 输出：一行「更新时间 …」文字，后面是最新价指标卡
}
```

```python
def main():
    ticker = exchange.GetTicker()
    if not ticker:
        return
    # 组件字典直接传，不用 json.dumps，也不用加反引号
    LogStatus("更新时间 " + _D(), {"type": "kpi", "title": "最新价", "value": ticker["Last"]})
    # 输出：一行「更新时间 …」文字，后面是最新价指标卡
```

```rust
fn main() {
    let Ok(t) = exchange.GetTicker(None) else { return };
    // 组件写成一行 JSON 文本跟在文字后面，不用加反引号
    let kpi = format!(r#"{{"type": "kpi", "title": "最新价", "value": {}}}"#, t.Last);
    LogStatus!(format!("更新时间 {}", _D(None)), kpi);
    // 输出：一行「更新时间 …」文字，后面是最新价指标卡
}
```

组合仪表盘：grid排列指标卡、权益曲线和持仓表。

```javascript
function main() {
    exchange.SetContractType("swap")
    var times = [], curve = [], f2 = {precision: 2}
    while (true) {
        var account = exchange.GetAccount()
        var positions = exchange.GetPositions()
        if (account && positions) {
            var profit = 0
            var rows = positions.map(function (p) {
                profit += p.Profit
                var side = p.Type == PD_LONG || p.Type == PD_LONG_YD ? "多" : "空"
                return [p.Symbol, side, p.Amount, p.Price, p.Profit]
            })
            // 期货账户有 Equity（权益），没有时用可用 + 冻结
            var equity = account.Equity || account.Balance + account.FrozenBalance
            times.push(Date.now())
            curve.push(equity)
            if (curve.length > 500) { times.shift(); curve.shift() }
            var color = profit >= 0 ? "up" : "down"
            LogStatus({type: "grid", cols: 3, items: [
                {type: "kpi", title: "权益", value: equity, unit: "USDT", format: f2},
                {type: "kpi", title: "可用", value: account.Balance, format: f2},
                {type: "kpi", title: "浮动盈亏", value: profit, color: color},
                {type: "chart", span: 3, kind: "area", title: "权益曲线", x: times,
                    series: [{name: "权益", data: curve}]},
                {type: "table", span: 3, title: "持仓", rows: rows,
                    cols: ["品种", "方向", "数量", "均价", "浮动盈亏"]}
            ]})
        }
        Sleep(60 * 1000)
    }
}
```

```python
import time

def main():
    exchange.SetContractType("swap")
    times, curve, f2 = [], [], {"precision": 2}
    while True:
        account = exchange.GetAccount()
        positions = exchange.GetPositions()
        if account and positions is not None:
            rows, profit = [], 0
            for p in positions:
                profit += p["Profit"]
                side = "多" if p["Type"] in (PD_LONG, PD_LONG_YD) else "空"
                rows.append([p["Symbol"], side, p["Amount"], p["Price"], p["Profit"]])
            # 期货账户有 Equity（权益），没有时用可用 + 冻结
            equity = account.get("Equity") or account["Balance"] + account["FrozenBalance"]
            times.append(int(time.time() * 1000))
            curve.append(equity)
            del times[:-500], curve[:-500]
            color = "up" if profit >= 0 else "down"
            LogStatus({"type": "grid", "cols": 3, "items": [
                {"type": "kpi", "title": "权益", "value": equity, "unit": "USDT", "format": f2},
                {"type": "kpi", "title": "可用", "value": account["Balance"], "format": f2},
                {"type": "kpi", "title": "浮动盈亏", "value": profit, "color": color},
                {"type": "chart", "span": 3, "kind": "area", "title": "权益曲线", "x": times,
                 "series": [{"name": "权益", "data": curve}]},
                {"type": "table", "span": 3, "title": "持仓", "rows": rows,
                 "cols": ["品种", "方向", "数量", "均价", "浮动盈亏"]}
            ]})
        Sleep(60 * 1000)
```

```rust
fn join<T: ToString>(v: &[T]) -> String {
    v.iter().map(|x| x.to_string()).collect::<Vec<_>>().join(",")
}

fn main() {
    if exchange.SetContractType("swap").is_err() { return; }
    let (mut times, mut curve) = (Vec::new(), Vec::new());
    loop {
        if let (Ok(a), Ok(ps)) = (exchange.GetAccount(), exchange.GetPositions(None)) {
            let profit: f64 = ps.iter().map(|p| p.Profit).sum();
            let rows: Vec<String> = ps.iter().map(|p| {
                let long = p.Type == PD_LONG || p.Type == PD_LONG_YD;
                let side = if long { "多" } else { "空" };
                format!(r#"["{}","{}",{},{},{}]"#, p.Symbol, side, p.Amount, p.Price, p.Profit)
            }).collect();
            // 期货账户有 Equity（权益），没有时用可用 + 冻结
            let equity = if a.Equity > 0.0 { a.Equity } else { a.Balance + a.FrozenBalance };
            times.push(UnixNano() / 1_000_000);
            curve.push(equity);
            if curve.len() > 500 { times.remove(0); curve.remove(0); }
            let color = if profit >= 0.0 { "up" } else { "down" };
            LogStatus!(format!(r#"{{"type": "grid", "cols": 3, "items": [
{{"type": "kpi", "title": "权益", "value": {}, "unit": "USDT", "format": {{"precision": 2}}}},
{{"type": "kpi", "title": "可用", "value": {}, "format": {{"precision": 2}}}},
{{"type": "kpi", "title": "浮动盈亏", "value": {}, "color": "{}"}},
{{"type": "chart", "span": 3, "kind": "area", "title": "权益曲线", "x": [{}],
  "series": [{{"name": "权益", "data": [{}]}}]}},
{{"type": "table", "span": 3, "title": "持仓", "rows": [{}],
  "cols": ["品种", "方向", "数量", "均价", "浮动盈亏"]}}]}}"#,
                equity, a.Balance, profit, color, join(&times), join(&curve), rows.join(",")));
        }
        Sleep(60 * 1000);
    }
}
```

表格增强：列设置格式、涨跌色和单位，点击表头按原始数值排序。

```javascript
function main() {
    exchange.SetContractType("swap")
    var positions = exchange.GetPositions()
    if (!positions) return
    var rows = positions.map(function (p) {
        var ratio = p.Margin > 0 ? p.Profit / p.Margin : 0
        // 单元格对象：单独指定这个格子的单位和颜色
        var lever = {value: p.MarginLevel, unit: "x",
            color: p.MarginLevel > 10 ? "warning" : "muted"}
        return [p.Symbol, p.Amount, p.Price, p.Profit, ratio, lever]
    })
    var f2 = {precision: 2}, pct = {percent: true, precision: 2}
    // 单独输出表格：JavaScript、Python 自动加反引号
    LogStatus({type: "table", title: "持仓", rows: rows, cols: [
        "品种",
        {title: "数量", align: "right"},
        {title: "均价", format: f2, align: "right"},
        {title: "浮动盈亏", format: f2, color: "sign", unit: "USDT", align: "right"},
        {title: "收益率", format: pct, color: "sign", align: "right"},
        {title: "杠杆", align: "right"}
    ]})
    // 输出：盈亏、收益率按正负着色，排序按数值而不是文字
}
```

```python
def main():
    exchange.SetContractType("swap")
    positions = exchange.GetPositions()
    if positions is None:
        return
    rows = []
    for p in positions:
        ratio = p["Profit"] / p["Margin"] if p["Margin"] > 0 else 0
        # 单元格对象：单独指定这个格子的单位和颜色
        lever = {"value": p["MarginLevel"], "unit": "x",
                 "color": "warning" if p["MarginLevel"] > 10 else "muted"}
        rows.append([p["Symbol"], p["Amount"], p["Price"], p["Profit"], ratio, lever])
    f2, pct = {"precision": 2}, {"percent": True, "precision": 2}
    # 单独输出表格：JavaScript、Python 自动加反引号
    LogStatus({"type": "table", "title": "持仓", "rows": rows, "cols": [
        "品种",
        {"title": "数量", "align": "right"},
        {"title": "均价", "format": f2, "align": "right"},
        {"title": "浮动盈亏", "format": f2, "color": "sign", "unit": "USDT", "align": "right"},
        {"title": "收益率", "format": pct, "color": "sign", "align": "right"},
        {"title": "杠杆", "align": "right"}
    ]})
    # 输出：盈亏、收益率按正负着色，排序按数值而不是文字
```

```rust
fn main() {
    if exchange.SetContractType("swap").is_err() { return; }
    let Ok(positions) = exchange.GetPositions(None) else { return };
    let rows: Vec<String> = positions.iter().map(|p| {
        let ratio = if p.Margin > 0.0 { p.Profit / p.Margin } else { 0.0 };
        let warn = if p.MarginLevel > 10.0 { "warning" } else { "muted" };
        // 单元格对象：单独指定这个格子的单位和颜色
        let lever = format!(r#"{{"value": {}, "unit": "x", "color": "{}"}}"#, p.MarginLevel, warn);
        format!(r#"["{}", {}, {}, {}, {}, {}]"#,
            p.Symbol, p.Amount, p.Price, p.Profit, ratio, lever)
    }).collect();
    let table = format!(r#"{{"type": "table", "title": "持仓", "rows": [{}], "cols": [
        "品种", {{"title": "数量", "align": "right"}},
        {{"title": "均价", "format": {{"precision": 2}}, "align": "right"}},
        {{"title": "浮动盈亏", "format": {{"precision": 2}}, "color": "sign",
          "unit": "USDT", "align": "right"}},
        {{"title": "收益率", "format": {{"percent": true, "precision": 2}},
          "color": "sign", "align": "right"}},
        {{"title": "杠杆", "align": "right"}}]}}"#, rows.join(","));
    // 单独输出表格要自己加反引号，且反引号里的 JSON 要在一行里
    LogStatus!(format!("`{}`", table.replace('\n', "")));
    // 输出：盈亏、收益率按正负着色，排序按数值而不是文字
}
```

用tabs分页显示行情、持仓和账户，刷新时保持当前选中的页。

```javascript
function main() {
    exchange.SetContractType("swap")
    while (true) {
        var ticker = exchange.GetTicker()
        var account = exchange.GetAccount()
        var positions = exchange.GetPositions()
        if (ticker && account && positions) {
            var rows = positions.map(function (p) { return [p.Symbol, p.Amount, p.Profit] })
            var table = {type: "table", cols: ["品种", "数量", "浮动盈亏"], rows: rows}
            LogStatus({type: "tabs", id: "main", items: [
                {title: "行情", cols: 3, items: [
                    {type: "kpi", title: "最新价", value: ticker.Last},
                    {type: "kpi", title: "买一", value: ticker.Buy},
                    {type: "kpi", title: "卖一", value: ticker.Sell}
                ]},
                {title: "持仓", items: [table]},
                {title: "账户", items: [{type: "stat", cols: 2, items: [
                    {label: "可用", value: account.Balance},
                    {label: "冻结", value: account.FrozenBalance}
                ]}]}
            ]})
        }
        Sleep(5000)
    }
}
```

```python
def main():
    exchange.SetContractType("swap")
    while True:
        ticker = exchange.GetTicker()
        account = exchange.GetAccount()
        positions = exchange.GetPositions()
        if ticker and account and positions is not None:
            rows = [[p["Symbol"], p["Amount"], p["Profit"]] for p in positions]
            table = {"type": "table", "cols": ["品种", "数量", "浮动盈亏"], "rows": rows}
            LogStatus({"type": "tabs", "id": "main", "items": [
                {"title": "行情", "cols": 3, "items": [
                    {"type": "kpi", "title": "最新价", "value": ticker["Last"]},
                    {"type": "kpi", "title": "买一", "value": ticker["Buy"]},
                    {"type": "kpi", "title": "卖一", "value": ticker["Sell"]}
                ]},
                {"title": "持仓", "items": [table]},
                {"title": "账户", "items": [{"type": "stat", "cols": 2, "items": [
                    {"label": "可用", "value": account["Balance"]},
                    {"label": "冻结", "value": account["FrozenBalance"]}
                ]}]}
            ]})
        Sleep(5000)
```

```rust
fn main() {
    if exchange.SetContractType("swap").is_err() { return; }
    loop {
        let t = exchange.GetTicker(None);
        let (a, ps) = (exchange.GetAccount(), exchange.GetPositions(None));
        if let (Ok(t), Ok(a), Ok(ps)) = (t, a, ps) {
            let rows: Vec<String> = ps.iter()
                .map(|p| format!(r#"["{}", {}, {}]"#, p.Symbol, p.Amount, p.Profit))
                .collect();
            LogStatus!(format!(r#"{{"type": "tabs", "id": "main", "items": [
{{"title": "行情", "cols": 3, "items": [{{"type": "kpi", "title": "最新价", "value": {}}},
  {{"type": "kpi", "title": "买一", "value": {}}}, {{"type": "kpi", "title": "卖一", "value": {}}}]}},
{{"title": "持仓", "items": [{{"type": "table",
  "cols": ["品种", "数量", "浮动盈亏"], "rows": [{}]}}]}},
{{"title": "账户", "items": [{{"type": "stat", "cols": 2, "items": [
  {{"label": "可用", "value": {}}}, {{"label": "冻结", "value": {}}}]}}]}}]}}"#,
                t.Last, t.Buy, t.Sell, rows.join(","), a.Balance, a.FrozenBalance));
        }
        Sleep(5000);
    }
}
```

多种图表：sparkline、gauge、progress、pie、histogram和heatmap。

```javascript
function main() {
    var r = exchange.GetRecords(PERIOD_H1)
    var account = exchange.GetAccount()
    if (!r || r.length < 73 || !account) return
    r = r.slice(-73)
    var closes = r.map(function (b) { return b.Close })
    var rets = closes.slice(1).map(function (c, i) { return c / closes[i] - 1 })
    var day = r.slice(-24)
    var hi = Math.max.apply(null, day.map(function (b) { return b.High }))
    var lo = Math.min.apply(null, day.map(function (b) { return b.Low }))
    var pos = hi > lo ? (closes[72] - lo) / (hi - lo) : 0.5
    var total = account.Balance + account.FrozenBalance
    var frozen = total > 0 ? account.FrozenBalance / total : 0
    var pct = {percent: true, precision: 2}
    LogStatus({type: "grid", cols: 3, items: [
        {type: "sparkline", title: "最近24小时", data: closes.slice(-24)},
        {type: "gauge", title: "24小时区间位置", value: pos, format: {percent: true},
            thresholds: [{value: 0.8, color: "up"}]},
        {type: "progress", title: "冻结资金占比", value: frozen},
        {type: "pie", title: "资金分布", items: [
            {name: "可用", value: account.Balance},
            {name: "冻结", value: account.FrozenBalance}]},
        {type: "histogram", title: "小时涨跌分布", data: rets, format: pct},
        {type: "heatmap", title: "逐小时涨跌", format: pct,
            x: day.map(function (b) { return _D(b.Time, "hh:00") }),
            y: ["前天", "昨天", "今天"],
            z: [rets.slice(0, 24), rets.slice(24, 48), rets.slice(48, 72)]}
    ]})
}
```

```python
def main():
    r = exchange.GetRecords(PERIOD_H1)
    account = exchange.GetAccount()
    if not r or len(r) < 73 or not account:
        return
    r = r[-73:]
    closes = [b["Close"] for b in r]
    rets = [closes[i] / closes[i - 1] - 1 for i in range(1, 73)]
    day = r[-24:]
    hi, lo = max(b["High"] for b in day), min(b["Low"] for b in day)
    pos = (closes[72] - lo) / (hi - lo) if hi > lo else 0.5
    total = account["Balance"] + account["FrozenBalance"]
    frozen = account["FrozenBalance"] / total if total > 0 else 0
    pct = {"percent": True, "precision": 2}
    LogStatus({"type": "grid", "cols": 3, "items": [
        {"type": "sparkline", "title": "最近24小时", "data": closes[-24:]},
        {"type": "gauge", "title": "24小时区间位置", "value": pos,
         "format": {"percent": True}, "thresholds": [{"value": 0.8, "color": "up"}]},
        {"type": "progress", "title": "冻结资金占比", "value": frozen},
        {"type": "pie", "title": "资金分布", "items": [
            {"name": "可用", "value": account["Balance"]},
            {"name": "冻结", "value": account["FrozenBalance"]}]},
        {"type": "histogram", "title": "小时涨跌分布", "data": rets, "format": pct},
        {"type": "heatmap", "title": "逐小时涨跌", "format": pct,
         "x": [_D(b["Time"] / 1000, "%H:00") for b in day],
         "y": ["前天", "昨天", "今天"],
         "z": [rets[0:24], rets[24:48], rets[48:72]]}
    ]})
```

```rust
fn join<T: ToString>(v: &[T]) -> String {
    v.iter().map(|x| x.to_string()).collect::<Vec<_>>().join(",")
}

fn main() {
    let Ok(r) = exchange.GetRecords(None, PERIOD_H1, None) else { return };
    let Ok(a) = exchange.GetAccount() else { return };
    if r.len() < 73 { return; }
    let r = &r[r.len() - 73..];
    let closes: Vec<f64> = r.iter().map(|b| b.Close).collect();
    let rets: Vec<f64> = closes.windows(2).map(|w| w[1] / w[0] - 1.0).collect();
    let day = &r[49..];
    let hi = day.iter().map(|b| b.High).fold(f64::MIN, f64::max);
    let lo = day.iter().map(|b| b.Low).fold(f64::MAX, f64::min);
    let pos = if hi > lo { (closes[72] - lo) / (hi - lo) } else { 0.5 };
    let total = a.Balance + a.FrozenBalance;
    let frozen = if total > 0.0 { a.FrozenBalance / total } else { 0.0 };
    // Rust 的 _D() 固定输出 UTC 时间
    let hours: Vec<String> = day.iter()
        .map(|b| format!("\"{}:00\"", &_D(b.Time)[11..13]))
        .collect();
    let z = format!("[{}],[{}],[{}]", join(&rets[..24]), join(&rets[24..48]), join(&rets[48..]));
    LogStatus!(format!(r#"{{"type": "grid", "cols": 3, "items": [
{{"type": "sparkline", "title": "最近24小时", "data": [{}]}},
{{"type": "gauge", "title": "24小时区间位置", "value": {}, "format": {{"percent": true}},
  "thresholds": [{{"value": 0.8, "color": "up"}}]}},
{{"type": "progress", "title": "冻结资金占比", "value": {}}},
{{"type": "pie", "title": "资金分布", "items": [{{"name": "可用", "value": {}}},
  {{"name": "冻结", "value": {}}}]}},
{{"type": "histogram", "title": "小时涨跌分布", "data": [{}],
  "format": {{"percent": true, "precision": 2}}}},
{{"type": "heatmap", "title": "逐小时涨跌", "format": {{"percent": true, "precision": 2}},
  "x": [{}], "y": ["前天", "昨天", "今天"], "z": [{}]}}]}}"#,
        join(&closes[49..]), pos, frozen, a.Balance, a.FrozenBalance,
        join(&rets), hours.join(","), z));
}
```

标题行加badge状态标签，下面是alert风控提示、markdown说明和timeline事件。

```javascript
function main() {
    var events = [{time: Date.now(), text: "策略启动", color: "primary"}]
    while (true) {
        var account = exchange.GetAccount()
        if (account) {
            var low = account.Balance < 100
            if (low) {
                events.unshift({time: Date.now(), text: "可用资金低于100", color: "down"})
            }
            events = events.slice(0, 10)
            var alert = low
                ? {type: "alert", level: "warning", title: "可用资金不足",
                    text: "低于100，暂停开新仓"}
                : {type: "alert", level: "success", title: "风控检查通过"}
            // 用 "\n" 分行：第一行文字加标签，第二行是组件数组（从上到下排列）
            LogStatus("网格策略", {type: "badge", items: [
                {text: IsVirtual() ? "回测" : "实盘", color: "muted"},
                {text: low ? "暂停开仓" : "运行中", color: low ? "warning" : "up"}
            ]}, "\n", [
                alert,
                {type: "markdown", text: "#### 策略说明\n- 网格间距 **0.5%**\n- 每格数量 0.01"},
                {type: "timeline", title: "最近事件", items: events}
            ])
        }
        Sleep(10 * 1000)
    }
}
```

```python
import time

def main():
    now = lambda: int(time.time() * 1000)
    events = [{"time": now(), "text": "策略启动", "color": "primary"}]
    while True:
        account = exchange.GetAccount()
        if account:
            low = account["Balance"] < 100
            if low:
                events.insert(0, {"time": now(), "text": "可用资金低于100", "color": "down"})
            del events[10:]
            if low:
                alert = {"type": "alert", "level": "warning", "title": "可用资金不足",
                         "text": "低于100，暂停开新仓"}
            else:
                alert = {"type": "alert", "level": "success", "title": "风控检查通过"}
            # 用 "\n" 分行：第一行文字加标签，第二行是组件数组（从上到下排列）
            LogStatus("网格策略", {"type": "badge", "items": [
                {"text": "回测" if IsVirtual() else "实盘", "color": "muted"},
                {"text": "暂停开仓" if low else "运行中", "color": "warning" if low else "up"}
            ]}, "\n", [
                alert,
                {"type": "markdown", "text": "#### 策略说明\n- 网格间距 **0.5%**\n- 每格数量 0.01"},
                {"type": "timeline", "title": "最近事件", "items": events}
            ])
        Sleep(10 * 1000)
```

```rust
fn item(text: &str, color: &str) -> String {
    format!(r#"{{"text": "{}", "color": "{}"}}"#, text, color)
}
fn ev(text: &str, color: &str) -> String {
    let ms = UnixNano() / 1_000_000;
    format!(r#"{{"time": {}, "text": "{}", "color": "{}"}}"#, ms, text, color)
}

fn main() {
    let mut events = vec![ev("策略启动", "primary")];
    loop {
        if let Ok(a) = exchange.GetAccount() {
            let low = a.Balance < 100.0;
            if low { events.insert(0, ev("可用资金低于100", "down")); events.truncate(10); }
            let mode = if IsVirtual() { "回测" } else { "实盘" };
            let (state, color) = if low { ("暂停开仓", "warning") } else { ("运行中", "up") };
            let badge = format!(r#"{{"type": "badge", "items": [{}, {}]}}"#,
                item(mode, "muted"), item(state, color));
            let (level, title, text) = match low {
                true => ("warning", "可用资金不足", "低于100，暂停开新仓"),
                false => ("success", "风控检查通过", ""),
            };
            let alert = format!(
                r#"{{"type": "alert", "level": "{}", "title": "{}", "text": "{}"}}"#,
                level, title, text
            );
            let notes = r"#### 策略说明\n- 网格间距 **0.5%**\n- 每格数量 0.01";
            let md = format!(r#"{{"type": "markdown", "text": "{}"}}"#, notes);
            let tl = format!(r#"{{"type": "timeline", "title": "最近事件", "items": [{}]}}"#,
                events.join(","));
            // 用 "\n" 分行：第一行文字加标签，第二行是组件数组（从上到下排列）（每段 JSON 都写成一行）
            LogStatus!("网格策略", badge, "\n", format!("[{},{},{}]", alert, md, tl));
        }
        Sleep(10 * 1000);
    }
}
```

与旧写法混用：反引号表格、按钮和新组件分行输出。

```javascript
function main() {
    var account = exchange.GetAccount()
    if (!account) return
    var table = {type: "table", title: "账户", cols: ["可用", "冻结"],
        rows: [[account.Balance, account.FrozenBalance]]}
    var btn = {type: "button", cmd: "pause", name: "暂停"}
    LogStatus(
        "`" + JSON.stringify(table) + "`",           // 旧写法：反引号包裹的 JSON，显示不变
        "\n汇总",
        {type: "grid", cols: 3, items: [             // 新组件放在这一行的最后
            {type: "kpi", title: "可用", value: account.Balance},
            table, btn                                // 表格、按钮放进 grid 时不用加反引号
        ]},
        "\n`" + JSON.stringify(btn) + "`"
    )
    // 输出：第一行旧表格；第二行文字加组件网格；第三行按钮，点击后用 GetCommand() 读取
}
```

```python
import json

def main():
    account = exchange.GetAccount()
    if not account:
        return
    table = {"type": "table", "title": "账户", "cols": ["可用", "冻结"],
             "rows": [[account["Balance"], account["FrozenBalance"]]]}
    btn = {"type": "button", "cmd": "pause", "name": "暂停"}
    LogStatus(
        "`" + json.dumps(table) + "`",               # 旧写法：反引号包裹的 JSON，显示不变
        "\n汇总",
        {"type": "grid", "cols": 3, "items": [       # 新组件放在这一行的最后
            {"type": "kpi", "title": "可用", "value": account["Balance"]},
            table, btn                                # 表格、按钮放进 grid 时不用加反引号
        ]},
        "\n`" + json.dumps(btn) + "`"
    )
    # 输出：第一行旧表格；第二行文字加组件网格；第三行按钮，点击后用 GetCommand() 读取
```

```rust
fn main() {
    let Ok(a) = exchange.GetAccount() else { return };
    // 反引号里、或和文字同一行的 JSON 要写成一行，去掉换行
    let table = format!(r#"{{"type": "table", "title": "账户", "cols": ["可用", "冻结"],
        "rows": [[{}, {}]]}}"#, a.Balance, a.FrozenBalance).replace('\n', "");
    let btn = r#"{"type": "button", "cmd": "pause", "name": "暂停"}"#;
    let kpi = format!(r#"{{"type": "kpi", "title": "可用", "value": {}}}"#, a.Balance);
    // 新组件放在这一行的最后；表格、按钮放进 grid 时不用加反引号
    let grid = format!(r#"{{"type": "grid", "cols": 3, "items": [{}, {}, {}]}}"#, kpi, table, btn);
    // 旧写法：反引号包裹的 JSON，显示不变
    LogStatus!(format!("`{}`", table), "\n汇总", grid, format!("\n`{}`", btn));
    // 输出：第一行旧表格；第二行文字加组件网格；第三行按钮，点击后用 GetCommand() 读取
}
```

状态栏中数据输出示例。

```javascript
function main() {
    var table = {type: 'table', title: 'Position Info', cols: ['Column 1', 'Column 2'], rows: [ ['abc', 'def'], ['ABC', 'support color #ff0000']]}
    // JSON序列化后两边加上`字符,视为一个复杂消息格式(当前支持表格)
    LogStatus('`' + JSON.stringify(table) + '`')
    // 表格信息也可以在多行中出现
    LogStatus('First line message\n`' + JSON.stringify(table) + '`\nThird line message')
    // 支持多个表格同时显示,将以TAB显示到一组里
    LogStatus('`' + JSON.stringify([table, table]) + '`')

    // 也可以构造一个按钮在表格中,策略用GetCommand接收cmd属性的内容
    var table = {
        type: 'table',
        title: 'Position Operation',
        cols: ['Column 1', 'Column 2', 'Action'],
        rows: [
            ['abc', 'def', {'type':'button', 'cmd': 'coverAll', 'name': 'Close All'}]
        ]
    }
    LogStatus('`' + JSON.stringify(table) + '`')
    // 或者构造一单独的按钮
    LogStatus('`' + JSON.stringify({'type':'button', 'cmd': 'coverAll', 'name': 'Close All'}) + '`')
    // 可以自定义按钮风格(bootstrap的按钮属性)
    LogStatus('`' + JSON.stringify({'type':'button', 'class': 'btn btn-xs btn-danger', 'cmd': 'coverAll', 'name': 'Close All'}) + '`')
}
```

```python
import json
def main():
    table = {"type": "table", "title": "Position Info", "cols": ["Column 1", "Column 2"], "rows": [["abc", "def"], ["ABC", "support color #ff0000"]]}
    LogStatus('`' + json.dumps(table) + '`')
    LogStatus('First line message\n`' + json.dumps(table) + '`\nThird line message')
    LogStatus('`' + json.dumps([table, table]) + '`')

    table = {
        "type" : "table",
        "title" : "Position Operation",
        "cols" : ["Column 1", "Column 2", "Action"],
        "rows" : [
            ["abc", "def", {"type": "button", "cmd": "coverAll", "name": "Close All"}]
        ]
    }
    LogStatus('`' + json.dumps(table) + '`')
    LogStatus('`' + json.dumps({"type": "button", "cmd": "coverAll", "name": "Close All"}) + '`')
    LogStatus('`' + json.dumps({"type": "button", "class": "btn btn-xs btn-danger", "cmd": "coverAll", "name": "Close All"}) + '`')
```

```rust
fn main() {
    let table = r#"{"type": "table", "title": "Position Info", "cols": ["Column 1", "Column 2"], "rows": [["abc", "def"], ["ABC", "support color #ff0000"]]}"#;
    // JSON字符串两边加上`字符,视为一个复杂消息格式(当前支持表格)
    LogStatus!(format!("`{}`", table));
    // 表格信息也可以在多行中出现
    LogStatus!(format!("First line message\n`{}`\nThird line message", table));
    // 支持多个表格同时显示,将以TAB显示到一组里
    LogStatus!(format!("`[{},{}]`", table, table));

    // 也可以构造一个按钮在表格中,策略用GetCommand接收cmd属性的内容
    let table = String::from(r#"{"type": "table", "title": "Position Operation", "cols": ["Column 1", "Column 2", "Action"], "rows": ["#)
        + r#"["abc", "def", {"type": "button", "cmd": "coverAll", "name": "Close All"}]"#
        + r#"]}"#;
    LogStatus!(format!("`{}`", table));
    // 或者构造一单独的按钮
    LogStatus!(format!("`{}`", r#"{"type": "button", "cmd": "coverAll", "name": "Close All"}"#));
    // 可以自定义按钮风格(bootstrap的按钮属性)
    LogStatus!(format!("`{}`", r#"{"type": "button", "class": "btn btn-xs btn-danger", "cmd": "coverAll", "name": "Close All"}"#));
}
```

支持状态栏中设计按钮控件。

```javascript
function main() {
    var table = {
        type: "table",
        title: "Status Bar Button Styles",
        cols: ["Default", "Primary", "Success", "Info", "Warning", "Danger"],
        rows: [
            [
                {"type":"button", "class": "btn btn-xs btn-default", "name": "Default"},
                {"type":"button", "class": "btn btn-xs btn-primary", "name": "Primary"},
                {"type":"button", "class": "btn btn-xs btn-success", "name": "Success"},
                {"type":"button", "class": "btn btn-xs btn-info", "name": "Info"},
                {"type":"button", "class": "btn btn-xs btn-warning", "name": "Warning"},
                {"type":"button", "class": "btn btn-xs btn-danger", "name": "Danger"}
            ]
        ]
    }
    LogStatus("`" + JSON.stringify(table) + "`")
}
```

```python
import json
def main():
    table = {
        "type": "table",
        "title": "Status Bar Button Styles",
        "cols": ["Default", "Primary", "Success", "Info", "Warning", "Danger"],
        "rows": [
            [
                {"type":"button", "class": "btn btn-xs btn-default", "name": "Default"},
                {"type":"button", "class": "btn btn-xs btn-primary", "name": "Primary"},
                {"type":"button", "class": "btn btn-xs btn-success", "name": "Success"},
                {"type":"button", "class": "btn btn-xs btn-info", "name": "Info"},
                {"type":"button", "class": "btn btn-xs btn-warning", "name": "Warning"},
                {"type":"button", "class": "btn btn-xs btn-danger", "name": "Danger"}
            ]
        ]
    }
    LogStatus("`" + json.dumps(table) + "`")
```

```rust
fn main() {
    let table = String::from(r#"{"type": "table", "title": "Status Bar Button Styles", "cols": ["Default", "Primary", "Success", "Info", "Warning", "Danger"], "rows": [["#)
        + r#"{"type": "button", "class": "btn btn-xs btn-default", "name": "Default"},"#
        + r#"{"type": "button", "class": "btn btn-xs btn-primary", "name": "Primary"},"#
        + r#"{"type": "button", "class": "btn btn-xs btn-success", "name": "Success"},"#
        + r#"{"type": "button", "class": "btn btn-xs btn-info", "name": "Info"},"#
        + r#"{"type": "button", "class": "btn btn-xs btn-warning", "name": "Warning"},"#
        + r#"{"type": "button", "class": "btn btn-xs btn-danger", "name": "Danger"}"#
        + r#"]]}"#;
    LogStatus!(format!("`{}`", table));
}
```

设置状态栏按钮的禁用、描述功能。

```javascript
function main() {
    var table = {
        type: "table",
        title: "Status Bar Button Disable and Description Test",
        cols: ["Column 1", "Column 2", "Column 3"],
        rows: []
    }
    var button1 = {"type": "button", "name": "Button 1", "cmd": "button1", "description": "This is the first button"}
    var button2 = {"type": "button", "name": "Button 2", "cmd": "button2", "description": "This is the second button, set to disabled", "disabled": true}
    var button3 = {"type": "button", "name": "Button 3", "cmd": "button3", "description": "This is the third button, set to enabled", "disabled": false}
    table.rows.push([button1, button2, button3])
    LogStatus("`" + JSON.stringify(table) + "`")
}
```

```python
import json
def main():
    table = {
        "type": "table",
        "title": "Status Bar Button Disable and Description Test",
        "cols": ["Column 1", "Column 2", "Column 3"],
        "rows": []
    }
    button1 = {"type": "button", "name": "Button 1", "cmd": "button1", "description": "This is the first button"}
    button2 = {"type": "button", "name": "Button 2", "cmd": "button2", "description": "This is the second button, set to disabled", "disabled": True}
    button3 = {"type": "button", "name": "Button 3", "cmd": "button3", "description": "This is the third button, set to enabled", "disabled": False}
    table["rows"].append([button1, button2, button3])
    LogStatus("`" + json.dumps(table) + "`")
```

```rust
fn main() {
    let button1 = r#"{"type": "button", "name": "Button 1", "cmd": "button1", "description": "This is the first button"}"#;
    let button2 = r#"{"type": "button", "name": "Button 2", "cmd": "button2", "description": "This is the second button, set to disabled", "disabled": true}"#;
    let button3 = r#"{"type": "button", "name": "Button 3", "cmd": "button3", "description": "This is the third button, set to enabled", "disabled": false}"#;
    let table = format!(
        r#"{{"type": "table", "title": "Status Bar Button Disable and Description Test", "cols": ["Column 1", "Column 2", "Column 3"], "rows": [[{}, {}, {}]]}}"#,
        button1, button2, button3
    );
    LogStatus!(format!("`{}`", table));
}
```

结合```GetCommand()```函数，构造状态栏按钮交互功能。

```javascript
function test1() {
    Log("Calling custom function")
}

function main() {
    while (true) {
        var table = {
            type: 'table',
            title: 'Operation',
            cols: ['Column 1', 'Column 2', 'Action'],
            rows: [
                ['a', '1', {
                    'type': 'button',
                    'cmd': "CoverAll",
                    'name': 'Close All'
                }],
                ['b', '1', {
                    'type': 'button',
                    'cmd': 10,
                    'name': 'Send Number'
                }],
                ['c', '1', {
                    'type': 'button',
                    'cmd': _D(),
                    'name': 'Call Function'
                }],
                ['d', '1', {
                    'type': 'button',
                    'cmd': 'test1',
                    'name': 'Call Custom Function'
                }]
            ]
        }
        LogStatus(_D(), "\n", '`' + JSON.stringify(table) + '`')

        var str_cmd = GetCommand()
        if (str_cmd) {
            Log("Received interaction data str_cmd:", "Type:", typeof(str_cmd), "Value:", str_cmd)
            if(str_cmd == "test1") {
                test1()
            }
        }

        Sleep(500)
    }
}
```

```python
import json
def test1():
    Log("Calling custom function")

def main():
    while True:
        table = {
            "type": "table",
            "title": "Operation",
            "cols": ["Column 1", "Column 2", "Action"],
            "rows": [
                ["a", "1", {
                    "type": "button",
                    "cmd": "CoverAll",
                    "name": "Close All"
                }],
                ["b", "1", {
                    "type": "button",
                    "cmd": 10,
                    "name": "Send Number"
                }],
                ["c", "1", {
                    "type": "button",
                    "cmd": _D(),
                    "name": "Call Function"
                }],
                ["d", "1", {
                    "type": "button",
                    "cmd": "test1",
                    "name": "Call Custom Function"
                }]
            ]
        }

        LogStatus(_D(), "\n", "`" + json.dumps(table) + "`")
        str_cmd = GetCommand()
        if str_cmd:
            Log("Received interaction data str_cmd", "Type:", type(str_cmd), "Value:", str_cmd)
            if str_cmd == "test1":
                test1()
        Sleep(500)
```

```rust
fn test1() {
    Log!("Calling custom function");
}

fn main() {
    loop {
        let table = String::from(r#"{"type": "table", "title": "Operation", "cols": ["Column 1", "Column 2", "Action"], "rows": ["#)
            + r#"["a", "1", {"type": "button", "cmd": "CoverAll", "name": "Close All"}],"#
            + r#"["b", "1", {"type": "button", "cmd": 10, "name": "Send Number"}],"#
            + &format!(r#"["c", "1", {{"type": "button", "cmd": "{}", "name": "Call Function"}}],"#, _D(None))
            + r#"["d", "1", {"type": "button", "cmd": "test1", "name": "Call Custom Function"}]"#
            + r#"]}"#;
        LogStatus!(_D(None), "\n", format!("`{}`", table));

        if let Some(str_cmd) = GetCommand(-1) {
            Log!("Received interaction data str_cmd:", "Type:", "String", "Value:", &str_cmd);
            if str_cmd == "test1" {
                test1();
            }
        }

        Sleep(500);
    }
}
```

状态栏表格中的按钮点击后弹出一组输入控件（```group```），其中价格控件只在选择限价单时显示；```GetCommand()```收到```open:{...}```后解析各控件的值。字段说明见上文「状态栏按钮」。

```javascript
function main() {
    var btnOpen = {
        type: "button",
        cmd: "open",
        name: "开仓|Open",
        group: [{
            type: "selected", name: "tradeType", label: "下单类型|Order type", default: 0,
            settings: {options: ["市价单|Market", "限价单|Limit"]}
        }, {
            type: "selected", name: "direction", label: "方向|Direction", default: "buy",
            settings: {render: "segment", options: [{name: "买入|Buy", value: "buy"}, {name: "卖出|Sell", value: "sell"}]}
        }, {
            // 只在选择限价单（tradeType为1）时显示
            type: "number", name: "price", label: "价格|Price", required: true,
            settings: {filter: "tradeType==1"}
        }, {
            type: "number", name: "amount", label: "数量|Amount", default: 0.01, required: true,
            settings: {min: 0}
        }]
    }
    var tbl = {type: "table", title: "操作|Actions", cols: ["品种|Symbol", "操作|Action"], rows: [["BTC_USDT", btnOpen]]}
    while (true) {
        LogStatus(_D(), "\n", "`" + JSON.stringify(tbl) + "`")
        var cmd = GetCommand()
        if (cmd && cmd.indexOf("open:") === 0) {
            // 例如：open:{"tradeType":1,"direction":"buy","price":60000,"amount":0.01}
            var msg = JSON.parse(cmd.slice(5))
            Log("direction:", msg.direction, "type:", msg.tradeType == 0 ? "market" : "limit", "price:", msg.price, "amount:", msg.amount)
        }
        Sleep(1000)
    }
}
```

```python
import json

def main():
    btnOpen = {
        "type": "button",
        "cmd": "open",
        "name": "开仓|Open",
        "group": [{
            "type": "selected", "name": "tradeType", "label": "下单类型|Order type", "default": 0,
            "settings": {"options": ["市价单|Market", "限价单|Limit"]}
        }, {
            "type": "selected", "name": "direction", "label": "方向|Direction", "default": "buy",
            "settings": {"render": "segment", "options": [{"name": "买入|Buy", "value": "buy"}, {"name": "卖出|Sell", "value": "sell"}]}
        }, {
            # 只在选择限价单（tradeType为1）时显示
            "type": "number", "name": "price", "label": "价格|Price", "required": True,
            "settings": {"filter": "tradeType==1"}
        }, {
            "type": "number", "name": "amount", "label": "数量|Amount", "default": 0.01, "required": True,
            "settings": {"min": 0}
        }]
    }
    tbl = {"type": "table", "title": "操作|Actions", "cols": ["品种|Symbol", "操作|Action"], "rows": [["BTC_USDT", btnOpen]]}
    while True:
        LogStatus(_D(), "\n", "`" + json.dumps(tbl) + "`")
        cmd = GetCommand()
        if cmd and cmd.startswith("open:"):
            # 例如：open:{"tradeType":1,"direction":"buy","price":60000,"amount":0.01}
            msg = json.loads(cmd[5:])
            Log("direction:", msg["direction"], "type:", "market" if msg["tradeType"] == 0 else "limit", "price:", msg.get("price"), "amount:", msg["amount"])
        Sleep(1000)
```

```rust
fn main() {
    // 只在选择限价单（tradeType为1）时显示price控件
    let btn_open = String::from(r#"{"type": "button", "cmd": "open", "name": "开仓|Open", "group": ["#)
        + r#"{"type": "selected", "name": "tradeType", "label": "下单类型|Order type", "default": 0, "settings": {"options": ["市价单|Market", "限价单|Limit"]}},"#
        + r#"{"type": "selected", "name": "direction", "label": "方向|Direction", "default": "buy", "settings": {"render": "segment", "options": [{"name": "买入|Buy", "value": "buy"}, {"name": "卖出|Sell", "value": "sell"}]}},"#
        + r#"{"type": "number", "name": "price", "label": "价格|Price", "required": true, "settings": {"filter": "tradeType==1"}},"#
        + r#"{"type": "number", "name": "amount", "label": "数量|Amount", "default": 0.01, "required": true, "settings": {"min": 0}}"#
        + r#"]}"#;
    let tbl = format!(r#"{{"type": "table", "title": "操作|Actions", "cols": ["品种|Symbol", "操作|Action"], "rows": [["BTC_USDT", {}]]}}"#, btn_open);
    loop {
        LogStatus!(_D(None), "\n", format!("`{}`", tbl));
        if let Some(cmd) = GetCommand(-1) {
            // 例如：open:{"tradeType":1,"direction":"buy","price":60000,"amount":0.01}
            if cmd.starts_with("open:") {
                if let Some(msg) = JSONParse(&cmd[5..]) {
                    Log!("direction:", msg["direction"].as_str().unwrap_or(""),
                        "type:", if msg["tradeType"].as_i64().unwrap_or(0) == 0 { "market" } else { "limit" },
                        "price:", msg["price"].as_f64().unwrap_or(0.0),
                        "amount:", msg["amount"].as_f64().unwrap_or(0.0));
                }
            }
        }
        Sleep(1000);
    }
}
```

实盘运行时```LogStatus()```函数输出的信息不写入日志记录，只更新当前实盘的状态栏内容；实盘数据库中只保存最新的一份状态栏内容，每次调用覆盖之前的内容。

##### 输入写法

多个参数先转成文字再用空格拼接：字符串原样，数字转成文字，对象和数组编码成JSON（JavaScript、Python中 `type` 为 `table` 的表格对象另加反引号）。拼好的内容按 `\n` 分行，下表是每一行的显示方式。

| 写法 | 显示 |
| - | - |
| 普通文字 | 文字；结尾写 `#ff0000` 设置颜色，`[trans]` 标记按页面语言显示 |
| 带 `type` 的组件对象，或含组件的数组 | `状态栏组件`，数组里的组件从上到下排列 |
| 反引号包裹的JSON：`` `{...}` `` | 表格、表格数组（显示为标签页）、按钮，也可以是组件 |
| 整个状态栏是一段（可以跨多行的）组件JSON | 整体识别为组件 |

- 一行最多一段JSON。不带反引号的组件要放在这一行的最后，前面可以有文字（如 `LogStatus("更新时间", kpi)`）；同一行要显示多个组件时放进数组或 `grid`，或者用 `"\n"` 分行。
- 带反引号的JSON前后都可以有文字。一行里已经有反引号时，这一行不带反引号的组件不再识别。
- 不带反引号时只识别组件：`type` 不是组件的对象（例如 `GetAccount()` 的返回值、单独的按钮对象）、只含表格的数组按JSON文字显示，与以前一致。

##### 状态栏组件

组件对象按 `type` 渲染：`grid`、`tabs` 负责布局，`kpi`、`stat`、`progress`、`gauge`、`sparkline`、`chart`、`heatmap`、`calendar`、`histogram`、`pie`、`timeline`、`markdown`、`alert`、`badge` 负责展示；表格和按钮对象也可以放进 `grid`、`tabs` 的 `items`。各组件的字段与示例见`状态栏组件`。

- `grid` 按容器宽度自动减少列数，窄屏上也能正常显示。
- 写错的组件（缺少必填字段、类型不认识、数据超出上限）只在自己的位置显示一张错误卡片，写明出错的字段并附上原始JSON，其它组件照常显示。
- 配色随页面的明暗主题切换；`up`、`down` 跟随页面的涨跌色设置（FMZ默认绿涨红跌）。
- 与旧写法完全兼容：文字、反引号表格和按钮的显示不变，可以和组件混用。表格还支持列格式、涨跌色与单位，见`LogStatus-table`。
- 组件只用于展示，交互用下文的状态栏按钮；按钮可以放进表格单元格，也可以放进 `grid`、`tabs`。
- 上限：图表每条序列5000个点，热力图40000格，`grid`、`tabs` 嵌套6层；超出的组件显示错误卡片。

##### 状态栏按钮

把按钮对象```JSON.stringify()```后用``` ` ```包裹输出到状态栏，或者放进状态栏表格的单元格（一个单元格放多个按钮时写成按钮数组）。状态栏的每一行只能有一段``` ` ```包裹的JSON，多个按钮要分行输出或者放进表格。点击按钮后，策略用`GetCommand`读取命令；实盘没有运行时点击按钮只会提示错误。

按钮字段：

| 字段 | 说明 |
| - | - |
| type | 固定为```button``` |
| name | 按钮上的文字 |
| cmd | 点击后发送给策略的命令；为空时点击无效 |
| description | 鼠标悬停时显示的说明 |
| disabled | ```true```为禁用 |
| class | 样式：含```btn-primary```、```btn-success```、```btn-info```、```btn-warning```、```btn-danger```时显示对应颜色；含```btn-sm```、```btn-lg```时为中、大尺寸，默认小尺寸 |
| input | 点击后弹出一个输入控件，字段见下文「输入控件」 |
| group | 点击后弹出一组输入控件，数组，每一项的字段见下文「输入控件」 |

```GetCommand()```收到的命令：

| 按钮 | 命令 | 例子 |
| - | - | - |
| 没有```input```、```group``` | ```cmd```原样（点击时先弹出确认框） | ```open``` |
| 有```input``` | ```cmd:输入值```，字符串不加引号，多选为数组 | ```open:1```、```open:abc```、```open:[0,2]``` |
| 有```group``` | ```cmd:JSON```，键为各控件的```name```，没有填写的控件不出现 | ```open:{"tradeType":0,"price":100}``` |

输入控件（```input```或```group```的每一项）字段：

| 字段 | 说明 |
| - | - |
| type | ```number```（数值）、```string```（字符串）、```selected```（下拉框）、```boolean```（开关） |
| name | ```group```中为该控件在命令JSON里的键名；```input```中没有```label```时用作标题 |
| label | 控件标题，不设置时使用```description``` |
| description | 控件说明 |
| default | 默认值，也可以写作```defValue```；下拉框的默认值为选项的下标或```value``` |
| required | ```true```表示必填 |
| settings | 控件配置，见下表 |

```settings```字段：

| 字段 | 说明 |
| - | - |
| options | 下拉框选项：```["A", "B"]```（命令中为选项下标）或```[{"name": "A", "value": "a"}]```（命令中为```value```） |
| multiple | 下拉框多选，命令中的值为数组 |
| customizable | 下拉框允许输入新选项，选中新选项时命令中为输入的文字 |
| filter | 显示条件表达式，引用同一组中其它控件的```name```，例如```"tradeType==1"```；表达式为假时隐藏该控件 |
| disabled | 禁用该控件 |
| min、max | ```number```的最小值、最大值 |
| step | ```number```使用滑动条时的步长 |
| unit | 显示在输入框后的单位文字 |
| render | 控件外观。```number```：```slider```（滑动条）、```date```（日期时间选择，值为毫秒时间戳）；```string```：```textarea```（多行）、```date```（值为```yyyy-MM-dd hh:mm:ss```）、```color```（值为```#FF00FF```）；```selected```：```segment```（分段选择）；```boolean```只有开关 |

不带```settings```的旧写法仍然可用：下拉框用```defValue: "A|B|C"```设置选项（命令中为下标），```name```写成```"price@tradeType==1"```设置显示条件。

按钮文字、控件标题与说明、下拉框选项、表格标题与列名支持中英文双语，写作```"中文|English"```，按页面语言显示；状态栏普通文本与表格单元格中的双语文本使用```[trans]中文|English[/trans]```。

按钮也可以放进`grid`、`tabs`的 `items`，和状态栏组件排在一起，此时不用加反引号。

```LogStatus()```函数支持打印```base64```编码后的图片，以``` ` ```开头，以``` ` ```结尾。例如： ```LogStatus("`data:image/png;base64,AAAA`")```。

策略实盘运行时，在实盘页面如果翻看历史记录，状态栏会进入休眠状态，停止更新。只有日志在第一页的时候状态栏数据才会刷新。支持在状态栏输出```base64```编码后的图片，也支持在状态栏显示的表格中输出```base64```编码后的图片。由于编码后的图片的字符串数据一般很长，所以不再展示范例代码。

Rust没有对象字面量：把组件写成JSON文本（用 `format!` 拼接时 `{`、`}` 写成 `{{`、`}}`），或者传 `JSONParse()` 得到的 `JsonValue`，前端同样识别。字符串参数不会自动加反引号，单独输出表格时写 ``format!("`{}`", table)``；表格放进 `grid`、`tabs` 或含组件的数组时不用加。数值要是有限数，`NaN` 会让整段JSON无法解析而按文字显示。

```LogStatus()```函数支持直接传入```Python```的```matplotlib.pyplot```对象，只要对象包含```savefig```方法就可以作为参数传入```LogStatus()```函数，例如：

```python
import matplotlib.pyplot as plt

def main():
    plt.plot([3,6,2,4,7,1])
    LogStatus(plt)
```

See also: `GetCommand`, `状态栏组件`, `LogStatus-table`, `Chart`

#### LogProfit

```
LogProfit(profit)
LogProfit(profit, ...args)
```

记录盈亏值，打印盈亏数值并根据盈亏数值绘制收益曲线。

Parameters:

- `profit` (number, required): 收益数据，该数据由策略中设计算法、计算给出。
- `arg` (string / number / bool / object / array / any, optional): 扩展参数，可以输出附带信息到这条收益日志中，```arg```参数可以传多个。

```LogProfit```函数如果以字符```&```结尾，不写入日志到数据库，只更新收益图表。使用```&```参数可以避免频繁的收益记录产生大量日志，保持日志清爽。例如。

```javascript
function main() {
    // 在收益图表上打印30个点
    for(var i = 0; i < 30; i++) {
        LogProfit(i, '&')
        Sleep(500)
    }
}
```

```python
def main():
    for i in range(30):
        LogProfit(i, '&')
        Sleep(500)
```

```rust
fn main() {
    // 在收益图表上打印30个点
    // Rust 中带附言的收益记录使用 LogProfitText()，附言为 "&" 时同样只更新收益图表
    for i in 0..30 {
        LogProfitText(i, "&");
        Sleep(500);
    }
}
```

See also: `LogProfitReset`

#### LogProfitReset

```
LogProfitReset()
LogProfitReset(remain)
```

清空所有收益日志及收益图表。

Parameters:

- `remain` (number, optional): 需要保留的日志条数（整数）。

在收益图表上画30个点，再重置为只保留最后10个点。

```javascript
function main() {
    // 在收益图表上打印30个数据点，然后重置，仅保留最后10个数据点
    for(var i = 0; i < 30; i++) {
        LogProfit(i)
        Sleep(500)
    }
    LogProfitReset(10)
}
```

```python
def main():
    for i in range(30):
        LogProfit(i)
        Sleep(500)
    LogProfitReset(10)
```

```rust
fn main() {
    // 在收益图表上打印30个数据点，然后重置，仅保留最后10个数据点
    for i in 0..30 {
        LogProfit(i);
        Sleep(500);
    }
    LogProfitReset(10);
}
```

See also: `LogProfit`

#### LogReset

```
LogReset()
LogReset(remain)
```

清除日志。

Parameters:

- `remain` (number, optional): 需要保留的最近日志条数。

保留最近10条日志，清除其余日志。

```javascript
function main() {
    // 保留最近10条日志，清除其余日志
    LogReset(10)
}
```

```python
def main():
    LogReset(10)
```

```rust
fn main() {
    // 保留最近10条日志，清除其余日志
    LogReset(10);
}
```

策略实盘每次启动时的启动日志会计为一条，因此如果不传入参数，且策略启动时没有任何日志输出，日志将完全不予显示，需等待托管者回传日志（此为正常现象，并非异常情况）。

See also: `Log`, `LogVacuum`

#### LogVacuum

```
LogVacuum()
```

用于在调用 ```LogReset()``` 函数清除日志后，回收 **SQLite** 删除数据时所占用的存储空间。

清除全部日志后回收数据库占用的空间。

```javascript
function main() {
    LogReset()
    LogVacuum()
}
```

```python
def main():
    LogReset()
    LogVacuum()
```

```rust
fn main() {
    LogReset(0);
    LogVacuum();
}
```

原因在于 ```SQLite``` 删除数据时并不会立即回收所占用的存储空间，需要执行 ```VACUUM``` 命令清理数据表以释放空间。该函数在调用时会触发文件移动操作，延迟较大，建议按合适的时间间隔调用。

See also: `LogReset`

#### EnableLog

```
EnableLog(enable)
```

启用或禁用订单信息的日志记录。

Parameters:

- `enable` (bool, required): 当```enable```参数设置为假值（例如```false```）时，将不打印订单日志（即```exchange.Buy()```等函数产生的日志），也不会写入实盘的数据库。

关闭订单信息的日志记录。

```javascript
function main() {
    EnableLog(false)
}
```

```python
def main():
    EnableLog(False)
```

```rust
fn main() {
    EnableLog(false);
}
```

See also: `exchange.Buy`, `exchange.Sell`, `exchange.CancelOrder`

#### Chart

```
Chart(options)
```

自定义图表画图函数。

Parameters:

- `options` (object / object数组, required): 图表配置。```Chart()```函数的参数```options```是可以```JSON```序列化的```HighStocks```的```Highcharts.StockChart```参数。比原生的参数增加一个```__isStock```属性，如果指定```__isStock:false```，则显示为普通图表。如果设置```__isStock```属性为假值例如：```false```，即使用的图表为```Highcharts```图表。如果设置```__isStock```属性为真值例如：```true```，即使用的图表为```Highstocks```图表（默认```__isStock```为真值，例如```true```）。可以查询[HighStocks图表库](http://api.highcharts.com/highstock)。

Returns (object): 图表对象，见`Chart-return`。

创建一条折线图，每5秒追加一个最新价数据点。

```javascript
function main() {
    var chart = Chart({
        title: {text: "最新价"},
        xAxis: {type: "datetime"},
        series: [{name: "Last", data: []}]
    })
    chart.reset()
    while (true) {
        var ticker = exchange.GetTicker()
        if (ticker) {
            chart.add(0, [Date.now(), ticker.Last])
        }
        Sleep(5000)
    }
}
```

```python
import time
def main():
    chart = Chart({
        "title": {"text": "最新价"},
        "xAxis": {"type": "datetime"},
        "series": [{"name": "Last", "data": []}]
    })
    chart.reset()
    while True:
        ticker = exchange.GetTicker()
        if ticker:
            chart.add(0, [time.time() * 1000, ticker["Last"]])
        Sleep(5000)
```

```rust
fn main() {
    let chart = Chart::new(r#"{"title": {"text": "最新价"}, "xAxis": {"type": "datetime"},
        "series": [{"name": "Last", "data": []}]}"#);
    chart.reset(0);
    loop {
        if let Ok(ticker) = exchange.GetTicker(None) {
            chart.add(0, &format!("[{}, {}]", Unix() * 1000, ticker.Last), -1);
        }
        Sleep(5000);
    }
}
```

多图表画图配置：
- ```extension.layout```属性
  如果设置此属性，值为"single"，则图表不会叠加（不会以分页标签方式显示），会单独显示（平铺显示）。
- ```extension.height```属性
  此属性用于设置图表的高度，值可以为数值类型，或以"300px"方式设置。
- ```extension.col```属性
  此属性用于设置图表的宽度，页面宽度一共划分为12个单元，设置8即该图表占用8个单元宽度。

```javascript
function main() {
    var cfgA = {
        extension: {
            layout: 'single', // 不参于分组，单独显示, 默认为分组 'group'
            height: 300, // 指定高度
        },
        title: {
            text: 'Order Book Chart'
        },
        xAxis: {
            type: 'datetime'
        },
        series: [{
            name: 'Bid 1',
            data: [],
        }, {
            name: 'Ask 1',
            data: [],
        }]
    }
    var cfgB = {
        title: {
            text: 'Spread Chart'
        },
        xAxis: {
            type: 'datetime'
        },
        series: [{
            name: 'Spread',
            type: 'column',
            data: [],
        }]
    }

    var cfgC = {
        __isStock: false,
        title: {
            text: 'Pie Chart'
        },
        series: [{
            type: 'pie',
            name: 'one',
            data: [
                ["A", 25],
                ["B", 25],
                ["C", 25],
                ["D", 25],
            ]  // 指定初始数据后不需要用add函数更新, 直接更改图表配置就可以更新序列.
        }]
    };
    var cfgD = {
        extension: {
            layout: 'single',
            col: 8, // 指定宽度占的单元值, 总值 为12
            height: '300px',
        },
        title: {
            text: 'Order Book Chart'
        },
        xAxis: {
            type: 'datetime'
        },
        series: [{
            name: 'Bid 1',
            data: [],
        }, {
            name: 'Ask 1',
            data: [],
        }]
    }
    var cfgE = {
        __isStock: false,
        extension: {
            layout: 'single',
            col: 4,
            height: '300px',
        },
        title: {
            text: 'Pie Chart 2'
        },
        series: [{
            type: 'pie',
            name: 'one',
            data: [
                ["A", 25],
                ["B", 25],
                ["C", 25],
                ["D", 25],
            ]
        }]
    };

    var chart = Chart([cfgA, cfgB, cfgC, cfgD, cfgE]);
    chart.reset()
        // 为饼图清加一个数点，add只能更新通过add方式添加的数据点, 内置的数据点无法后期更新
    chart.add(3, {
        name: "ZZ",
        y: Math.random() * 100
    });
    while (true) {
        Sleep(1000)
        var ticker = exchange.GetTicker()
        if (!ticker) {
            continue;
        }
        var diff = ticker.Sell - ticker.Buy
        cfgA.subtitle = {
            text: 'Bid ' + ticker.Buy + ', Ask ' + ticker.Sell,
        };
        cfgB.subtitle = {
            text: 'Spread ' + diff,
        };

        chart.add([0, [new Date().getTime(), ticker.Buy]]);
        chart.add([1, [new Date().getTime(), ticker.Sell]]);
        // 相当于更新第二个图表的第一个数据序列
        chart.add([2, [new Date().getTime(), diff]]);
        chart.add(4, [new Date().getTime(), ticker.Buy]);
        chart.add(5, [new Date().getTime(), ticker.Buy]);
        cfgC.series[0].data[0][1] = Math.random() * 100;
        cfgE.series[0].data[0][1] = Math.random() * 100;
        // update实际上等于重置了图表的配置
        chart.update([cfgA, cfgB, cfgC, cfgD, cfgE]);
    }
}
```

```python
import random
import time
def main():
    cfgA = {
        "extension" : {
            "layout" : "single",
            "height" : 300,
            "col" : 8
        },
        "title" : {
            "text" : "Order Book Chart"
        },
        "xAxis" : {
            "type" : "datetime"
        },
        "series" : [{
            "name" : "Bid 1",
            "data" : []
        }, {
            "name" : "Ask 1",
            "data" : []
        }]
    }

    cfgB = {
        "title" : {
            "text" : "Spread Chart"
        },
        "xAxis" : {
            "type" : "datetime",
        },
        "series" : [{
            "name" : "Spread",
            "type" : "column",
            "data" : []
        }]
    }

    cfgC = {
        "__isStock" : False,
        "title" : {
            "text" : "Pie Chart"
        },
        "series" : [{
            "type" : "pie",
            "name" : "one",
            "data" : [
                ["A", 25],
                ["B", 25],
                ["C", 25],
                ["D", 25],
            ]
        }]
    }

    cfgD = {
        "extension" : {
            "layout" : "single",
            "col" : 8,
            "height" : "300px"
        },
        "title" : {
            "text" : "Order Book Chart"
        },
        "series" : [{
            "name" : "Bid 1",
            "data" : []
        }, {
            "name" : "Ask 1",
            "data" : []
        }]
    }

    cfgE = {
        "__isStock" : False,
        "extension" : {
            "layout" : "single",
            "col" : 4,
            "height" : "300px"
        },
        "title" : {
            "text" : "Pie Chart 2"
        },
        "series" : [{
            "type" : "pie",
            "name" : "one",
            "data" : [
                ["A", 25],
                ["B", 25],
                ["C", 25],
                ["D", 25]
            ]
        }]
    }

    chart = Chart([cfgA, cfgB, cfgC, cfgD, cfgE])
    chart.reset()
    chart.add(3, {
        "name" : "ZZ",
        "y" : random.random() * 100
    })

    while True:
        Sleep(1000)
        ticker = exchange.GetTicker()
        if not ticker :
            continue
        diff = ticker["Sell"] - ticker["Buy"]
        cfgA["subtitle"] = {
            "text" : "Bid " + str(ticker["Buy"]) + " Ask " + str(ticker["Sell"])
        }
        cfgB["subtitle"] = {
            "text" : "Spread " + str(diff)
        }

        chart.add(0, [time.time() * 1000, ticker["Buy"]])
        chart.add(1, [time.time() * 1000, ticker["Sell"]])
        chart.add(2, [time.time() * 1000, diff])
        chart.add(4, [time.time() * 1000, ticker["Buy"]])
        chart.add(5, [time.time() * 1000, ticker["Buy"]])
        cfgC["series"][0]["data"][0][1] = random.random() * 100
        cfgE["series"][0]["data"][0][1] = random.random() * 100
        chart.update([cfgA, cfgB, cfgC, cfgD, cfgE])
```

```rust
fn main() {
    // Rust 中图表配置为 JSON 字符串，可变部分使用占位符表示，更新时替换占位符重新构建配置
    let cfg_a_tpl = r#"{
        "extension": {
            "layout": "single",
            "height": 300
        },
        "title": {"text": "Order Book Chart"},
        "subtitle": {"text": "__SUBTITLE__"},
        "xAxis": {"type": "datetime"},
        "series": [{"name": "Bid 1", "data": []}, {"name": "Ask 1", "data": []}]
    }"#;
    let cfg_b_tpl = r#"{
        "title": {"text": "Spread Chart"},
        "subtitle": {"text": "__SUBTITLE__"},
        "xAxis": {"type": "datetime"},
        "series": [{"name": "Spread", "type": "column", "data": []}]
    }"#;
    let cfg_c_tpl = r#"{
        "__isStock": false,
        "title": {"text": "Pie Chart"},
        "series": [{
            "type": "pie",
            "name": "one",
            "data": [["A", __Y__], ["B", 25], ["C", 25], ["D", 25]]
        }]
    }"#;
    let cfg_d = r#"{
        "extension": {
            "layout": "single",
            "col": 8,
            "height": "300px"
        },
        "title": {"text": "Order Book Chart"},
        "xAxis": {"type": "datetime"},
        "series": [{"name": "Bid 1", "data": []}, {"name": "Ask 1", "data": []}]
    }"#;
    let cfg_e_tpl = r#"{
        "__isStock": false,
        "extension": {
            "layout": "single",
            "col": 4,
            "height": "300px"
        },
        "title": {"text": "Pie Chart 2"},
        "series": [{
            "type": "pie",
            "name": "one",
            "data": [["A", __Y__], ["B", 25], ["C", 25], ["D", 25]]
        }]
    }"#;

    let cfg_a = cfg_a_tpl.replace("__SUBTITLE__", "");
    let cfg_b = cfg_b_tpl.replace("__SUBTITLE__", "");
    let cfg_c = cfg_c_tpl.replace("__Y__", "25");
    let cfg_e = cfg_e_tpl.replace("__Y__", "25");

    let chart = Chart::new(&format!("[{},{},{},{},{}]", cfg_a, cfg_b, cfg_c, cfg_d, cfg_e));
    chart.reset(0);
    // 为饼图追加一个数据点，add只能更新通过add方式添加的数据点，内置的数据点无法后期更新
    let y = (UnixNano() % 100) as f64;    // 用时间戳模拟随机数
    chart.add(3, &format!(r#"{{"name": "ZZ", "y": {}}}"#, y), -1);
    loop {
        Sleep(1000);
        let ticker = match exchange.GetTicker(None) {
            Ok(t) => t,
            Err(_) => continue,
        };
        let diff = ticker.Sell - ticker.Buy;
        let cfg_a = cfg_a_tpl.replace("__SUBTITLE__", &format!("Bid {}, Ask {}", ticker.Buy, ticker.Sell));
        let cfg_b = cfg_b_tpl.replace("__SUBTITLE__", &format!("Spread {}", diff));

        let now = Unix() * 1000;
        chart.add(0, &format!("[{}, {}]", now, ticker.Buy), -1);
        chart.add(1, &format!("[{}, {}]", now, ticker.Sell), -1);
        // 相当于更新第二个图表的第一个数据序列
        chart.add(2, &format!("[{}, {}]", now, diff), -1);
        chart.add(4, &format!("[{}, {}]", now, ticker.Buy), -1);
        chart.add(5, &format!("[{}, {}]", now, ticker.Buy), -1);
        let cfg_c = cfg_c_tpl.replace("__Y__", &format!("{}", (UnixNano() % 100) as f64));
        let cfg_e = cfg_e_tpl.replace("__Y__", &format!("{}", (UnixNano() % 100) as f64));
        // update实际上等于重置了图表的配置
        chart.update(&format!("[{},{},{},{},{}]", cfg_a, cfg_b, cfg_c, cfg_d, cfg_e));
    }
}
```

简单的画图例子。

```javascript
// 这个chart在JavaScript语言中是对象，在使用Chart函数之前我们需要声明一个配置图表的对象变量chart
var chart = {
    // 该字段标记图表是否为一般图表，有兴趣的可以改成false运行看看
    __isStock: true,
    // 缩放工具
    tooltip: {xDateFormat: '%Y-%m-%d %H:%M:%S, %A'},
    // 标题
    title : { text : '差价分析图'},
    // 选择范围
    rangeSelector: {
        buttons:  [{type: 'hour',count: 1, text: '1h'}, {type: 'hour',count: 3, text: '3h'},
            {type: 'hour', count: 8, text: '8h'}, {type: 'all',text: 'All'}],
        selected: 0,
        inputEnabled: false
    },
    // 坐标轴横轴即：x轴，当前设置的类型是：时间
    xAxis: { type: 'datetime'},
    // 坐标轴纵轴即：y轴，默认数值随数据大小调整
    yAxis : {
        // 标题
        title: {text: '差价'},
        // 是否启用右边纵轴
        opposite: false
    },
    // 数据系列，该属性保存的是各个数据系列（线，K线图，标签等...）
    series : [
        // 索引为0，data数组内存放的是该索引系列的数据
        {name : "line1", id : "Line 1,buy1Price", data : []},
        // 索引为1，设置了dashStyle:'shortdash'即：设置虚线
        {name : "line2", id : "Line 2,lastPrice", dashStyle : 'shortdash', data : []}
    ]
}

function main(){
    // 调用Chart函数，初始化图表
    var ObjChart = Chart(chart)
    // 清空
    ObjChart.reset()
    while(true){
        // 获取本次轮询的时间戳，即一个毫秒的时间戳。用来确定写入到图表的X轴的位置
        var nowTime = new Date().getTime()
        // 获取行情数据
        var ticker = _C(exchange.GetTicker)
        // 从行情数据的返回值取得买一价
        var buy1Price = ticker.Buy
        // 取得最后成交价，为了2条线不重合在一起，我们加1
        var lastPrice = ticker.Last + 1
        // 用时间戳作为X值，买一价作为Y值传入索引0的数据序列
        ObjChart.add(0, [nowTime, buy1Price])
        // 同上
        ObjChart.add(1, [nowTime, lastPrice])
        Sleep(2000)
    }
}
```

```python
import time
chart = {
    "__isStock" : True,
    "tooltip" : {"xDateFormat" : "%Y-%m-%d %H:%M:%S, %A"},
    "title" : {"text" : "Spread Analysis Chart"},
    "rangeSelector" : {
        "buttons" : [{"type": "hour", "count": 1, "text": "1h"}, {"type": "hour", "count": 3, "text": "3h"}, {"type": "hour", "count": 8, "text": "8h"}, {"type": "all", "text": "All"}],
        "selected": 0,
        "inputEnabled": False
    },
    "xAxis": {"type": "datetime"},
    "yAxis": {
        "title": {"text": "Spread"},
        "opposite": False
    },
    "series": [{
        "name": "line1", "id": "Line 1,buy1Price", "data": []
    }, {
        "name": "line2", "id": "Line 2,lastPrice", "dashStyle": "shortdash", "data": []
    }]
}
def main():
    ObjChart = Chart(chart)
    ObjChart.reset()
    while True:
        nowTime = time.time() * 1000
        ticker = exchange.GetTicker()
        buy1Price = ticker["Buy"]
        lastPrice = ticker["Last"] + 1
        ObjChart.add(0, [nowTime, buy1Price])
        ObjChart.add(1, [nowTime, lastPrice])
        Sleep(2000)
```

```rust
fn main() {
    // Rust 中图表配置为 JSON 字符串，在使用Chart::new函数之前先定义图表配置
    let chart = r#"{
        "__isStock": true,
        "tooltip": {"xDateFormat": "%Y-%m-%d %H:%M:%S, %A"},
        "title": {"text": "差价分析图"},
        "rangeSelector": {
            "buttons": [{"type": "hour", "count": 1, "text": "1h"}, {"type": "hour", "count": 3, "text": "3h"}, {"type": "hour", "count": 8, "text": "8h"}, {"type": "all", "text": "All"}],
            "selected": 0,
            "inputEnabled": false
        },
        "xAxis": {"type": "datetime"},
        "yAxis": {
            "title": {"text": "差价"},
            "opposite": false
        },
        "series": [
            {"name": "line1", "id": "Line 1,buy1Price", "data": []},
            {"name": "line2", "id": "Line 2,lastPrice", "dashStyle": "shortdash", "data": []}
        ]
    }"#;

    // 调用Chart::new函数，初始化图表
    let obj_chart = Chart::new(chart);
    // 清空
    obj_chart.reset(0);
    loop {
        // 获取本次轮询的时间戳，即一个毫秒的时间戳。用来确定写入到图表的X轴的位置
        let now_time = Unix() * 1000;
        // 获取行情数据
        let ticker = _C!(exchange.GetTicker(None));
        // 从行情数据的返回值取得买一价
        let buy1_price = ticker.Buy;
        // 取得最后成交价，为了2条线不重合在一起，我们加1
        let last_price = ticker.Last + 1.0;
        // 用时间戳作为X值，买一价作为Y值传入索引0的数据序列
        obj_chart.add(0, &format!("[{}, {}]", now_time, buy1_price), -1);
        // 同上
        obj_chart.add(1, &format!("[{}, {}]", now_time, last_price), -1);
        Sleep(2000);
    }
}
```

三角函数曲线画图例子。

```javascript
// 用于初始化图表的对象
var chart = {
    // 图表标题
    title: {text: "Line value triggers plotLines value"},
    // Y轴相关设置
    yAxis: {
        // 垂直于Y轴的水平线，用作触发线，是一个结构数组，可以设置多条触发线
        plotLines: [{
            // 触发线的值，设置多少这条线就在相应的数值位置显示
            value: 0,
            // 设置触发线的颜色
            color: 'red',
            // 宽度
            width: 2,
            // 显示的标签
            label: {
                // 标签文本
                text: 'Trigger Value',
                // 标签位置居中
                align: 'center'
            }
        }]
    },
    // X轴相关设置，这里设置类型是时间轴
    xAxis: {type: "datetime"},
    series: [
        {name: "sin", type: "spline", data: []},
        // 这个是比较重要的数据系列，可以设置多个数据系列，根据数组索引控制
        {name: "cos", type: "spline", data: []}
    ]
}
function main(){
    // 圆周率
    var pi = 3.1415926535897
    // 用于记录时间戳的变量
    var time = 0
    // 角度
    var angle = 0
    // 坐标y值，用于接收正弦值、余弦值
    var y = 0
    // 调用API接口用chart对象初始化图表
    var objChart = Chart(chart)
    // 初始，清空图表
    objChart.reset()
    // 设置触发线的值为1
    chart.yAxis.plotLines[0].value = 1
    // 循环
    while(true){
        // 获取当前时刻的时间戳
        time = new Date().getTime()
        // 每5秒角度angle增加5度，计算正弦值
        y = Math.sin(angle * 2 * pi / 360)
        // 把计算出来的y值写入图表相应索引的数据系列，add函数的第一个参数为指定的数据系列索引
        objChart.add(0, [time, y])
        // 计算余弦值
        y = Math.cos(angle * 2 * pi / 360)
        objChart.add(1, [time, y])
        // 增加5度
        angle += 5
        // 暂停5秒，以免画图太频繁，数据增长过快
        Sleep(5000)
    }
}
```

```python
import math
import time
chart = {
    "title": {"text": "Line value triggers plotLines value"},
    "yAxis": {
        "plotLines": [{
            "value": 0,
            "color": "red",
            "width": 2,
            "label": {
                "text": "Trigger Value",
                "align": "center"
            }
        }]
    },
    "xAxis": {"type": "datetime"},
    "series": [{"name": "sin", "type": "spline", "data": []},
               {"name": "cos", "type": "spline", "data": []}]
}
def main():
    pi = 3.1415926535897
    ts = 0
    angle = 0
    y = 0
    objChart = Chart(chart)
    objChart.reset()
    chart["yAxis"]["plotLines"][0]["value"] = 1
    while True:
        ts = time.time() * 1000
        y = math.sin(angle * 2 * pi / 360)
        objChart.add(0, [ts, y])
        y = math.cos(angle * 2 * pi / 360)
        objChart.add(1, [ts, y])
        angle += 5
        Sleep(5000)
```

```rust
fn main() {
    // 用于初始化图表的JSON配置字符串，触发线的值在配置中直接设置为1
    let chart = r#"{
        "title": {"text": "Line value triggers plotLines value"},
        "yAxis": {
            "plotLines": [{
                "value": 1,
                "color": "red",
                "width": 2,
                "label": {
                    "text": "Trigger Value",
                    "align": "center"
                }
            }]
        },
        "xAxis": {"type": "datetime"},
        "series": [{"name": "sin", "type": "spline", "data": []},
                   {"name": "cos", "type": "spline", "data": []}]
    }"#;
    // 圆周率
    let pi = 3.1415926535897_f64;
    // 角度
    let mut angle = 0.0_f64;
    // 调用API接口用chart配置初始化图表
    let obj_chart = Chart::new(chart);
    // 初始，清空图表
    obj_chart.reset(0);
    // 循环
    loop {
        // 获取当前时刻的毫秒时间戳
        let ts = Unix() * 1000;
        // 角度angle增加5度，计算正弦值
        let mut y = (angle * 2.0 * pi / 360.0).sin();
        // 把计算出来的y值写入图表相应索引的数据系列，add函数的第一个参数为指定的数据系列索引
        obj_chart.add(0, &format!("[{}, {}]", ts, y), -1);
        // 计算余弦值
        y = (angle * 2.0 * pi / 360.0).cos();
        obj_chart.add(1, &format!("[{}, {}]", ts, y), -1);
        // 增加5度
        angle += 5.0;
        // 暂停5秒，以免画图太频繁，数据增长过快
        Sleep(5000);
    }
}
```

使用混合图表的复杂例子。

```javascript
/*backtest
start: 2020-03-11 00:00:00
end: 2020-04-09 23:59:00
period: 1d
exchanges: [{"eid":"Bitfinex","currency":"BTC_USD"}]
*/

var chartCfg = {
    subtitle: {
        text: "subtitle",
    },
    yAxis: [{
        height: "40%",
        lineWidth: 2,
        title: {
            text: 'PnL',
        },
        tickPixelInterval: 20,
        minorGridLineWidth: 1,
        minorTickWidth: 0,
        opposite: true,
        labels: {
            align: "right",
            x: -3,
        }
    }, {
        title: {
            text: 'Profit',
        },
        top: "42%",
        height: "18%",
        offset: 0,
        lineWidth: 2
    }, {
        title: {
            text: 'Vol',
        },
        top: '62%',
        height: '18%',
        offset: 0,
        lineWidth: 2
    }, {
        title: {
            text: 'Asset',
        },
        top: '82%',
        height: '18%',
        offset: 0,
        lineWidth: 2
    }],
    series: [{
        name: 'PnL',
        data: [],
        id: 'primary',
        tooltip: {
            xDateFormat: '%Y-%m-%d %H:%M:%S'
        },
        yAxis: 0
    }, {
        type: 'column',
        lineWidth: 2,
        name: 'Profit',
        data: [],
        yAxis: 1,
    }, {
        type: 'column',
        name: 'Trade',
        data: [],
        yAxis: 2
    }, {
        type: 'area',
        step: true,
        lineWidth: 0,
        name: 'Long',
        data: [],
        yAxis: 2
    }, {
        type: 'area',
        step: true,
        lineWidth: 0,
        name: 'Short',
        data: [],
        yAxis: 2
    }, {
        type: 'line',
        step: true,
        color: '#5b4b00',
        name: 'Asset',
        data: [],
        yAxis: 3
    }, {
        type: 'pie',
        innerSize: '70%',
        name: 'Random',
        data: [],
        center: ['3%', '6%'],
        size: '15%',
        dataLabels: {
            enabled: false
        },
        startAngle: -90,
        endAngle: 90,
    }],
};

function main() {
    let c = Chart(chartCfg);
    let preTicker = null;
    while (true) {
        let t = exchange.GetTicker();

        c.add(0, [t.Time, t.Last]); // PnL
        c.add(1, [t.Time, preTicker ? t.Last - preTicker.Last : 0]); // profit
        let r = Math.random();
        var pos = parseInt(t.Time/86400);
        c.add(2, [t.Time, pos/2]); // Vol
        c.add(3, [t.Time, r > 0.8 ? pos : null]); // Long
        c.add(4, [t.Time, r < 0.8 ? -pos : null]); // Short
        c.add(5, [t.Time, Math.random() * 100]); // Asset
        // update pie
        chartCfg.series[chartCfg.series.length-1].data = [
            ["A", Math.random()*100],
            ["B", Math.random()*100],
         ];
        c.update(chartCfg)
        preTicker = t;
    }
}
```

```python
'''backtest
start: 2020-03-11 00:00:00
end: 2020-04-09 23:59:00
period: 1d
exchanges: [{"eid":"Bitfinex","currency":"BTC_USD"}]
'''

import random

chartCfg = {
    "subtitle": {
        "text": "subtitle"
    },
    "yAxis": [{
        "height": "40%",
        "lineWidth": 2,
        "title": {
            "text": 'PnL'
        },
        "tickPixelInterval": 20,
        "minorGridLineWidth": 1,
        "minorTickWidth": 0,
        "opposite": True,
        "labels": {
            "align": "right",
            "x": -3
        }
    }, {
        "title": {
            "text": 'Profit'
        },
        "top": "42%",
        "height": "18%",
        "offset": 0,
        "lineWidth": 2
    }, {
        "title": {
            "text": 'Vol'
        },
        "top": '62%',
        "height": '18%',
        "offset": 0,
        "lineWidth": 2
    }, {
        "title": {
            "text": 'Asset'
        },
        "top": '82%',
        "height": '18%',
        "offset": 0,
        "lineWidth": 2
    }],
    "series": [{
        "name": 'PnL',
        "data": [],
        "id": 'primary',
        "tooltip": {
            "xDateFormat": '%Y-%m-%d %H:%M:%S'
        },
        "yAxis": 0
    }, {
        "type": 'column',
        "lineWidth": 2,
        "name": 'Profit',
        "data": [],
        "yAxis": 1
    }, {
        "type": 'column',
        "name": 'Trade',
        "data": [],
        "yAxis": 2
    }, {
        "type": 'area',
        "step": True,
        "lineWidth": 0,
        "name": 'Long',
        "data": [],
        "yAxis": 2
    }, {
        "type": 'area',
        "step": True,
        "lineWidth": 0,
        "name": 'Short',
        "data": [],
        "yAxis": 2
    }, {
        "type": 'line',
        "step": True,
        "color": '#5b4b00',
        "name": 'Asset',
        "data": [],
        "yAxis": 3
    }, {
        "type": 'pie',
        "innerSize": '70%',
        "name": 'Random',
        "data": [],
        "center": ['3%', '6%'],
        "size": '15%',
        "dataLabels": {
            "enabled": False
        },
        "startAngle": -90,
        "endAngle": 90
    }]
}

def main():
    c = Chart(chartCfg)
    preTicker = None
    while True:
        t = exchange.GetTicker()
        c.add(0, [t["Time"], t["Last"]])
        profit = t["Last"] - preTicker["Last"] if preTicker else 0
        c.add(1, [t["Time"], profit])
        r = random.random()
        pos = t["Time"] / 86400
        c.add(2, [t["Time"], pos / 2])
        long = pos if r > 0.8 else None
        c.add(3, [t["Time"], long])
        short = -pos if r < 0.8 else None
        c.add(4, [t["Time"], short])
        c.add(5, [t["Time"], random.random() * 100])

        # update pie
        chartCfg["series"][len(chartCfg["series"]) - 1]["data"] = [
            ["A", random.random() * 100],
            ["B", random.random() * 100]
        ]
        c.update(chartCfg)
        preTicker = t
```

```rust
/*backtest
start: 2020-03-11 00:00:00
end: 2020-04-09 23:59:00
period: 1d
exchanges: [{"eid":"Bitfinex","currency":"BTC_USD"}]
*/

fn main() {
    // Rust 中图表配置为 JSON 字符串，饼图数据使用占位符__PIE_DATA__表示，更新时替换后重建配置
    let chart_cfg_tpl = r##"{
        "subtitle": {"text": "subtitle"},
        "yAxis": [{
            "height": "40%",
            "lineWidth": 2,
            "title": {"text": "PnL"},
            "tickPixelInterval": 20,
            "minorGridLineWidth": 1,
            "minorTickWidth": 0,
            "opposite": true,
            "labels": {"align": "right", "x": -3}
        }, {
            "title": {"text": "Profit"},
            "top": "42%",
            "height": "18%",
            "offset": 0,
            "lineWidth": 2
        }, {
            "title": {"text": "Vol"},
            "top": "62%",
            "height": "18%",
            "offset": 0,
            "lineWidth": 2
        }, {
            "title": {"text": "Asset"},
            "top": "82%",
            "height": "18%",
            "offset": 0,
            "lineWidth": 2
        }],
        "series": [{
            "name": "PnL",
            "data": [],
            "id": "primary",
            "tooltip": {"xDateFormat": "%Y-%m-%d %H:%M:%S"},
            "yAxis": 0
        }, {
            "type": "column",
            "lineWidth": 2,
            "name": "Profit",
            "data": [],
            "yAxis": 1
        }, {
            "type": "column",
            "name": "Trade",
            "data": [],
            "yAxis": 2
        }, {
            "type": "area",
            "step": true,
            "lineWidth": 0,
            "name": "Long",
            "data": [],
            "yAxis": 2
        }, {
            "type": "area",
            "step": true,
            "lineWidth": 0,
            "name": "Short",
            "data": [],
            "yAxis": 2
        }, {
            "type": "line",
            "step": true,
            "color": "#5b4b00",
            "name": "Asset",
            "data": [],
            "yAxis": 3
        }, {
            "type": "pie",
            "innerSize": "70%",
            "name": "Random",
            "data": __PIE_DATA__,
            "center": ["3%", "6%"],
            "size": "15%",
            "dataLabels": {"enabled": false},
            "startAngle": -90,
            "endAngle": 90
        }]
    }"##;

    let c = Chart::new(&chart_cfg_tpl.replace("__PIE_DATA__", "[]"));
    let mut pre_ticker: Option<Ticker> = None;
    loop {
        let t = exchange.GetTicker(None).unwrap();

        c.add(0, &format!("[{}, {}]", t.Time, t.Last), -1); // PnL
        let profit = if let Some(p) = &pre_ticker { t.Last - p.Last } else { 0.0 };
        c.add(1, &format!("[{}, {}]", t.Time, profit), -1); // profit
        let r = (UnixNano() % 100) as f64 / 100.0;          // 用时间戳模拟随机数
        let pos = (t.Time / 86400) as f64;
        c.add(2, &format!("[{}, {}]", t.Time, pos / 2.0), -1); // Vol
        c.add(3, &format!("[{}, {}]", t.Time, if r > 0.8 { pos.to_string() } else { "null".to_string() }), -1); // Long
        c.add(4, &format!("[{}, {}]", t.Time, if r < 0.8 { (-pos).to_string() } else { "null".to_string() }), -1); // Short
        c.add(5, &format!("[{}, {}]", t.Time, (UnixNano() % 10000) as f64 / 100.0), -1); // Asset
        // update pie
        let pie = format!(r#"[["A", {}], ["B", {}]]"#, (UnixNano() % 100) as f64, (UnixNano() % 100) as f64);
        c.update(&chart_cfg_tpl.replace("__PIE_DATA__", &pie));
        pre_ticker = Some(t);
    }
}
```

图表中```pie```类型的图是没有时间轴的图表，在更新数据时需要直接更新图表配置。例如以上范例中的代码，更新数据后使用```c.update(chartCfg)```更新图表，如下所示。

```javascript
// update pie
chartCfg.series[chartCfg.series.length-1].data = [
    ["A", Math.random()*100],
    ["B", Math.random()*100],
];
c.update(chartCfg)
```

```python
# update pie
chartCfg["series"][len(chartCfg["series"]) - 1]["data"] = [
    ["A", random.random() * 100],
    ["B", random.random() * 100]
]
c.update(chartCfg)
```

```rust
// update pie
// Rust 中图表配置为 JSON 字符串，重建包含新数据的配置后调用 update 更新图表
let pie = format!(r#"[["A", {}], ["B", {}]]"#, (UnixNano() % 100) as f64, (UnixNano() % 100) as f64);
c.update(&chart_cfg_tpl.replace("__PIE_DATA__", &pie));
```

```Chart()```返回的图表对象有```add()```、```reset()```、```update()```、```del()```四个方法，分别用于写入数据、清空数据、更新配置、删除数据系列或整张图表，参数见`Chart-return`。

See also: `KLineChart`

#### KLineChart

```
KLineChart(options)
```

该函数用于使用类似```Pine```语言的画图方式进行策略运行时的自定义画图。

Parameters:

- `options` (object / object数组, required): 图表配置对象：```overlay```为```true```时画在主图、```false```时画在副图；```pricePrecision```、```volumePrecision```为价格、成交量显示的小数位数（0为取整）。其它字段见`KLineChart-options`。

Returns (object): 图表对象，画图方法（```barcolor```、```bgcolor```、```plot```、```fill```、```hline```、```plotarrow```、```plotshape```、```plotchar```、```plotcandle```、```signal```、```reset```）的参数见`KLineChart-return`。在K线数据上遍历画图时，每根K线的画图操作必须以```begin(bar)```开始、以```close(bar)```结束。

画出K线，并在K线上叠加收盘价曲线。

```javascript
function main() {
    var c = KLineChart({overlay: true})
    var records = exchange.GetRecords()
    if (!records) return
    for (var bar of records) {
        c.begin(bar)                  // 每根K线以 begin 开始
        c.plot(bar.Close, "Close")
        c.close()                     // 以 close 结束
    }
}
```

```python
def main():
    c = KLineChart({"overlay": True})
    records = exchange.GetRecords()
    if not records:
        return
    for bar in records:
        c.begin(bar)                  # 每根K线以 begin 开始
        c.plot(bar["Close"], "Close")
        c.close()                     # 以 close 结束
```

```rust
fn main() {
    let mut c = KLineChart::new(r#"{"overlay": true}"#);
    let Ok(records) = exchange.GetRecords(None, None, None) else { return };
    for bar in &records {
        c.begin(bar);                 // 每根K线以 begin 开始
        c.plot(bar.Close, r#"{"title": "Close"}"#);
        c.close();                    // 以 close 结束
    }
}
```

如果在策略自定义画图区域画图必须有图表控制对象，使用```KLineChart()```函数创建该对象。```KLineChart()```函数的参数为一个图表配置结构，在参考代码中使用的图表结构很简单：```{overlay: true}```。
这个图表配置结构仅仅设置了画图内容在图表主图上输出，如果```overlay```设置为假值，例如：```false```，则图表上的内容都输出在副图上，如果需要指定某个画图函数在主图上画出也可以在具体函数调用中指定参数```overlay```为真值，例如：```true```。

```javascript
function main() {
    // 调用KLineChart函数创建图表控制对象c
    let c = KLineChart({
        overlay: true
    })

    // 使用现货交易所对象测试，获取K线数据。如果使用期货交易所对象测试，需要先设置合约
    let bars = exchange.GetRecords()
    if (!bars) {
        return
    }

    // 在K线数据上遍历执行画图操作，画图操作中必须以```c.begin(bar)```函数调用作为起始，以```c.close(bar)```函数调用作为结束。
    bars.forEach(function(bar, index) {
        c.begin(bar)
        c.barcolor(bar.Close > bar.Open ? 'rgba(255, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.2)')
        if (bar.Close > bar.Open) {
            c.bgcolor('rgba(0, 255, 0, 0.5)')
        }
        let h = c.plot(bar.High, 'high')
        let l = c.plot(bar.Low, 'low')

        c.fill(h, l, {
            color: bar.Close > bar.Open ? 'rgba(255, 0, 0, 0.2)' : 'rgba(255, 0, 0, 0.2)'
        })
        c.hline(bar.High)
        c.plotarrow(bar.Close - bar.Open)
        c.plotshape(bar.Low, {
            style: 'diamond'
        })
        c.plotchar(bar.Close, {
            char: 'X'
        })
        c.plotcandle(bar.Open*0.9, bar.High*0.9, bar.Low*0.9, bar.Close*0.9)
        if (bar.Close > bar.Open) {
            // long/short/closelong/closeshort
            c.signal("long", bar.High, 1.5)
        } else if (bar.Close < bar.Open) {
            c.signal("closelong", bar.Low, 1.5)
        }
        c.close(bar)
    })
}
```

```python
def main():
    # 调用KLineChart函数创建图表控制对象c
    c = KLineChart({
        "overlay": True
    })

    # 使用现货交易所对象测试，获取K线数据。如果使用期货交易所对象测试，需要先设置合约
    bars = exchange.GetRecords()
    if not bars:
        return

    for bar in bars:
        c.begin(bar)
        c.barcolor('rgba(255, 0, 0, 0.2)' if bar.Close > bar.Open else 'rgba(0, 0, 0, 0.2)')
        if bar.Close > bar.Open:
            c.bgcolor('rgba(0, 255, 0, 0.5)')

        h = c.plot(bar.High, 'high')
        l = c.plot(bar.Low, 'low')

        c.fill(h, l, 'rgba(255, 0, 0, 0.2)' if bar.Close > bar.Open else 'rgba(255, 0, 0, 0.2)')
        c.hline(bar.High)
        c.plotarrow(bar.Close - bar.Open)
        c.plotshape(bar.Low, style = 'diamond')
        c.plotchar(bar.Close, char = 'X')
        c.plotcandle(bar.Open*0.9, bar.High*0.9, bar.Low*0.9, bar.Close*0.9)
        if bar.Close > bar.Open:
            # long/short/closelong/closeshort
            c.signal("long", bar.High, 1.5)
        elif bar.Close < bar.Open:
            c.signal("closelong", bar.Low, 1.5)

        c.close(bar)
```

```rust
fn main() {
    // 调用KLineChart::new创建图表控制对象c
    let mut c = KLineChart::new(r#"{"overlay": true}"#);

    // 使用现货交易所对象测试，获取K线数据。如果使用期货交易所对象测试，需要先设置合约
    let bars = exchange.GetRecords(None, None, None).unwrap();

    // 在K线数据上遍历执行画图操作，画图操作中必须以c.begin(bar)函数调用作为起始，以c.close()函数调用作为结束。
    for bar in &bars {
        c.begin(bar);
        c.barcolor(if bar.Close > bar.Open { "rgba(255, 0, 0, 0.2)" } else { "rgba(0, 0, 0, 0.2)" }, "{}");
        if bar.Close > bar.Open {
            c.bgcolor("rgba(0, 255, 0, 0.5)", "{}");
        }
        let h = c.plot(bar.High, r#"{"title": "high"}"#);
        let l = c.plot(bar.Low, r#"{"title": "low"}"#);

        c.fill(h, l, if bar.Close > bar.Open { r#"{"color": "rgba(255, 0, 0, 0.2)"}"# } else { r#"{"color": "rgba(255, 0, 0, 0.2)"}"# });
        c.hline(bar.High, "{}");
        c.plotarrow(bar.Close - bar.Open, "{}");
        c.plotshape(bar.Low > 0.0, r#"{"style": "diamond"}"#);
        c.plotchar(bar.Close > 0.0, r#"{"char": "X"}"#);
        c.plotcandle(bar.Open * 0.9, bar.High * 0.9, bar.Low * 0.9, bar.Close * 0.9, "{}");
        if bar.Close > bar.Open {
            // long/short/closelong/closeshort
            c.signal("long", bar.High, 1.5, "long");
        } else if bar.Close < bar.Open {
            c.signal("closelong", bar.Low, 1.5, "closelong");
        }
        c.close();
    }
}
```

使用```pricePrecision```和```volumePrecision```参数控制图表数据精度。可以根据实际需求设置价格和成交量的显示精度，例如对于价格波动较大的品种可以设置为0显示整数，对于价格精确的品种可以设置为2或更高精度。

```javascript
function main() {
    // 创建图表控制对象，设置价格精度为0（整数），成交量精度为0（整数）
    let c = KLineChart({
        overlay: true,
        pricePrecision: 0,   // 价格数据精度，设置2即保留2位小数
        volumePrecision: 0   // 成交量数据精度
    })

    // 根据交易所类型选择合适的交易对
    let symbol = exchange.GetName().includes("Futures_") ? "ETH_USDT.swap" : "ETH_USDT"
    Log("Test symbol:", symbol)

    // 获取K线数据
    let bars = exchange.GetRecords(symbol)
    if (!bars) {
        return
    }

    // 遍历K线数据并绘制图表
    bars.forEach(function(bar, index) {
        c.begin(bar)
        c.barcolor(bar.Close > bar.Open ? 'rgba(255, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.2)')
        c.plot(bar.High, 'high')
        c.plot(bar.Low, 'low')
        c.close(bar)
    })
}
```

```python
def main():
    # 创建图表控制对象，设置价格精度为0（整数），成交量精度为0（整数）
    c = KLineChart({
        "overlay": True,
        "pricePrecision": 0,   # 价格数据精度，设置2即保留2位小数
        "volumePrecision": 0   # 成交量数据精度
    })

    # 根据交易所类型选择合适的交易对
    exName = exchange.GetName()
    symbol = "ETH_USDT.swap" if "Futures_" in exName else "ETH_USDT"
    Log("Test symbol:", symbol)

    # 获取K线数据
    bars = exchange.GetRecords(symbol)
    if not bars:
        return

    # 遍历K线数据并绘制图表
    for bar in bars:
        c.begin(bar)
        c.barcolor('rgba(255, 0, 0, 0.2)' if bar.Close > bar.Open else 'rgba(0, 0, 0, 0.2)')
        c.plot(bar.High, 'high')
        c.plot(bar.Low, 'low')
        c.close(bar)
```

```rust
fn main() {
    // 创建图表控制对象，设置价格精度为0（整数），成交量精度为0（整数）
    // pricePrecision为价格数据精度，设置2即保留2位小数；volumePrecision为成交量数据精度
    let mut c = KLineChart::new(r#"{"overlay": true, "pricePrecision": 0, "volumePrecision": 0}"#);

    // 根据交易所类型选择合适的交易对
    let symbol = if exchange.GetName().contains("Futures_") { "ETH_USDT.swap" } else { "ETH_USDT" };
    Log!("Test symbol:", symbol);

    // 获取K线数据
    let bars = exchange.GetRecords(symbol, None, None).unwrap();

    // 遍历K线数据并绘制图表
    for bar in &bars {
        c.begin(bar);
        c.barcolor(if bar.Close > bar.Open { "rgba(255, 0, 0, 0.2)" } else { "rgba(0, 0, 0, 0.2)" }, "{}");
        c.plot(bar.High, r#"{"title": "high"}"#);
        c.plot(bar.Low, r#"{"title": "low"}"#);
        c.close();
    }
}
```

策略自定义画图只能使用```KLineChart()```函数的方式或者```Chart()```函数的方式中的一种。```KLineChart()```函数调用时用到的一些颜色、样式等设置，参看[使用KLineChart函数画图的专题文章](https://www.fmz.com/bbs-topic/9482)

```pricePrecision```和```volumePrecision```参数用于控制图表中数据的显示精度。当不设置这些参数时，图表使用默认精度显示数据。设置精度参数后，图表中的价格和成交量数据将按照指定的小数位数进行四舍五入显示，这对于简化图表显示、提高可读性很有帮助

See also: `Chart`

#### console.log

```
console.log(...msgs)
```

用于在实盘页面中的「调试信息」栏中输出调试信息。举例实盘Id为```123456```，```console.log```函数输出的内容会写入实盘所属托管者目录下的```/logs/storage/123456/stdout.log```文件（多次运行追加写入，文件过大时自动轮转）；实盘停止时，本次运行输出内容的末尾部分会显示在实盘页面的「调试信息」栏中。仅支持JavaScript。

Parameters:

- `msg` (string / number / bool / object / array / any, optional): 输出的内容，参数```msg```可以传多个。

向「调试信息」栏和 stdout.log 输出一条调试信息。

```javascript
function main() {
    console.log("test console.log")
}
```

注意事项：
- 仅```JavaScript```语言支持该函数。
- 仅实盘支持该函数，「调试工具」和「回测系统」均不支持。
- 输出对象时会按JSON序列化后输出。

See also: `console.error`

#### console.error

```
console.error(...msgs)
```

用于在实盘页面中的「调试信息」栏中错误输出。举例实盘Id为```123456```，```console.error```函数输出的内容会写入实盘所属托管者目录下的```/logs/storage/123456/stderr.log```文件（多次运行追加写入，文件过大时自动轮转）；实盘停止时，本次运行错误输出的末尾部分会显示在实盘页面的「调试信息」栏中。仅支持JavaScript。

Parameters:

- `msg` (string / number / bool / object / array / any, optional): 输出的内容，参数```msg```可以传多个。

向「调试信息」栏和 stderr.log 输出一条错误信息。

```javascript
function main() {
    console.error("test console.error")
}
```

注意事项：
- 仅```JavaScript```语言支持该函数。
- 仅实盘支持该函数，「调试工具」和「回测系统」均不支持。
- 输出对象时会按JSON序列化后输出。

See also: `console.log`

#### exchange.Log

```
exchange.Log(orderType, price, amount)
exchange.Log(orderType, price, amount, ...args)
```

在日志栏区域输出下单、撤单日志。该函数被调用时不会实际下单，仅用于输出并记录交易日志。

Parameters:

- `orderType` (number, required): 输出的日志类型，可选值为`LOG_TYPE_BUY`、`LOG_TYPE_SELL`、`LOG_TYPE_CANCEL`。
- `price` (number, required): 日志中显示的价格。
- `amount` (number, required): 日志中显示的下单量。
- `arg` (string / number / bool / object / array / any, optional): 扩展参数，用于向该条日志中输出附带信息，```arg```参数可以传入多个。

Returns (string / bool): ```orderType```为```LOG_TYPE_BUY```、```LOG_TYPE_SELL```时返回一个虚拟订单号字符串，格式为```V```加5位递增序号，例如```V00001```；```orderType```为```LOG_TYPE_CANCEL```时```JavaScript```、```Python```返回```true```，```Rust```返回空字符串。

使用```exchange.Log(orderType, price, amount)```可以进行实盘跟单测试、模拟下单，也可以辅助记录下单信息。

    最常见的使用场景为：通过`exchange.IO`函数访问交易所的创建条件订单接口，但调用```exchange.IO()```函数并不会在实盘日志中输出交易日志信息。

    此时即可使用```exchange.Log()```函数补充输出日志，以便记录下单信息，撤单操作亦是如此。

```javascript
var id = 123
function main() {
    // 下单类型买入，价格999，数量 0.1
    exchange.Log(LOG_TYPE_BUY, 999, 0.1)
    // 取消订单
    exchange.Log(LOG_TYPE_CANCEL, id)
}
```

```python
id = 123
def main():
    exchange.Log(LOG_TYPE_BUY, 999, 0.1)
    exchange.Log(LOG_TYPE_CANCEL, id)
```

```rust
fn main() {
    let id = 123;
    // 下单类型买入，价格999，数量 0.1
    exchange.Log(LOG_TYPE_BUY, 999, 0.1);
    // 取消订单，orderType为LOG_TYPE_CANCEL时price参数为撤单的订单Id（Rust中amount参数必传，可传0）
    exchange.Log(LOG_TYPE_CANCEL, id, 0);
}
```

当```orderType```参数为```LOG_TYPE_CANCEL```时，```price```参数表示撤单的订单Id，用于在直接调用```exchange.IO()```函数撤单时打印撤单日志。

  ```exchange.Log()```函数是`exchange`交易所对象的成员函数，区别于全局函数`Log`。

See also: `Log`, `exchange`, `LOG_TYPE_BUY`, `LOG_TYPE_SELL`, `LOG_TYPE_CANCEL`

### Market

行情函数通过交易所对象获取市场数据：行情、深度、成交、K线和市场信息；不传```symbol```时取交易所对象当前的交易对与合约代码。

请求失败返回空值，使用前先判断（见`失败与空值`）；```symbol```的写法见`品种代码`。`exchange.GetRawJSON`读取最近一次请求的原始应答，`exchange.SetData`、`exchange.GetData`加载和读取自定义数据。

#### exchange.GetTicker

```
exchange.GetTicker()
exchange.GetTicker(symbol)
```

获取现货或合约的`Ticker`结构，即行情数据；不传```symbol```时取当前设置的交易对、合约代码的行情。```GetTicker()```是交易所对象`exchange`的成员函数，只作用于该交易所对象绑定的账户（多账户时用```exchanges[i].GetTicker()```指定账户）。

Parameters:

- `symbol` (string, optional): 品种代码，例如现货交易所对象上的```BTC_USDT```、期货交易所对象上的```BTC_USDT.swap```，写法（含期权）见`品种代码`。不传时请求当前交易对、合约代码的行情数据。

Returns (`Ticker` / 空值): 成功时返回`Ticker`结构；失败时返回空值。

加密货币期货交易所对象（即```exchange```或```exchanges[0]```）的默认合约为永续合约（```swap```），未调用```exchange.SetContractType()```函数时，行情函数获取的是永续合约的数据；需要其它合约时，先使用```exchange.SetContractType()```函数设置合约代码。见`品种代码`。

```javascript
function main(){
    // 期货交易所对象默认为永续合约，需要其它合约时先设置合约代码，例如设置为当季合约
    // exchange.SetContractType("quarter")

    var ticker = exchange.GetTicker()
    if (!ticker) return    // 获取失败（例如访问不到交易所接口）时为null
    Log("Symbol:", ticker.Symbol, "High:", ticker.High, "Low:", ticker.Low, "Sell:", ticker.Sell,
        "Buy:", ticker.Buy, "Last:", ticker.Last, "Open:", ticker.Open, "Volume:", ticker.Volume)
}
```

```python
def main():
    ticker = exchange.GetTicker()
    if not ticker:
        return
    Log("Symbol:", ticker["Symbol"], "High:", ticker["High"], "Low:", ticker["Low"],
        "Sell:", ticker["Sell"], "Buy:", ticker["Buy"], "Last:", ticker["Last"],
        "Open:", ticker["Open"], "Volume:", ticker["Volume"])
```

```rust
fn main() {
    // 期货交易所对象默认为永续合约，需要其它合约时先设置合约代码，例如设置为当季合约
    // exchange.SetContractType("quarter").unwrap();

    let Ok(ticker) = exchange.GetTicker(None) else { return };
    Log!("Symbol:", ticker.Symbol, "High:", ticker.High, "Low:", ticker.Low, "Sell:", ticker.Sell,
        "Buy:", ticker.Buy, "Last:", ticker.Last, "Open:", ticker.Open, "Volume:", ticker.Volume);
}
```

使用```symbol```参数请求具体品种（现货品种）的行情数据。

```javascript
function main() {
    var ticker = exchange.GetTicker("BTC_USDT")
    Log(ticker)
}
```

```python
def main():
    ticker = exchange.GetTicker("BTC_USDT")
    Log(ticker)
```

```rust
fn main() {
    let ticker = exchange.GetTicker("BTC_USDT").unwrap();
    Log!(ticker);
}
```

在回测系统中，```exchange.GetTicker()```函数返回的```Ticker```数据中，```High```、```Low```为模拟值，取自当时盘口的卖一价和买一价。

在实盘中，```exchange.GetTicker()```函数返回的```Ticker```数据中，```High```和```Low```的值根据所封装的交易所```Tick```接口返回的数据确定，这些数据包含一定周期内（通常为24小时周期）的最高价和最低价。

链上兑换类交易所（例如Uniswap、Jupiter）没有订单簿和24小时统计：```Buy```、```Sell```为一定规模（约1000美元）的实际可成交报价，```Last```为两者的中间价，```High```、```Low```、```Volume```等字段的取值见交易所页，例如`Uniswap`、`Jupiter`。

不支持的交易所：`Web3`。调用时报错并返回空值，所有交易所的对照见`能力矩阵`。

See also: `exchange.GetDepth`, `exchange.GetTrades`, `exchange.GetRecords`, `exchange.GetTickers`, `exchange.IO`, `API限流控制`

#### exchange.GetTickers

```
exchange.GetTickers()
```

获取交易所聚合行情数据（`Ticker`结构的数组）。```exchange```为现货交易所对象时返回所有交易对的ticker行情数据；```exchange```为期货交易所对象时返回所有合约的ticker行情数据。

Returns (`Ticker`数组 / 空值): 成功时返回`Ticker`结构数组；失败时返回空值。

调用```exchange.GetTickers()```函数，获取聚合行情数据。

```javascript
function main() {
    var tickers = exchange.GetTickers()
    if (tickers && tickers.length > 0) {
        Log("Number of tradable symbols:", tickers.length)
    }
}
```

```python
def main():
    tickers = exchange.GetTickers()
    if tickers and len(tickers) > 0:
        Log("Number of tradable symbols:", len(tickers))
```

```rust
fn main() {
    if let Ok(tickers) = exchange.GetTickers() {
        if tickers.len() > 0 {
            Log!("Number of tradable symbols:", tickers.len());
        }
    }
}
```

使用现货交易所对象，回测系统中调用```exchange.GetTickers()```函数。调用任何行情函数之前，GetTickers只返回当前默认交易对的ticker数据，调用行情函数之后会返回所有请求过的品种的ticker数据。可以参考以下测试例子。

```javascript
/*backtest
start: 2024-05-21 00:00:00
end: 2024-09-05 00:00:00
period: 5m
basePeriod: 1m
exchanges: [{"eid":"Binance","currency":"BTC_USDT"}]
*/

function main() {
    var arrSymbol = ["ADA_USDT", "LTC_USDT", "ETH_USDT", "SOL_USDT"]

    // 请求其它交易对行情数据之前，调用GetTickers
    var tickers1 = exchange.GetTickers()
    var tbl1 = {type: "table", title: "tickers1", cols: ["Symbol", "High", "Open", "Low", "Last", "Buy", "Sell", "Time", "Volume"], rows: []}
    for (var ticker of tickers1) {
        tbl1.rows.push([ticker.Symbol, ticker.High, ticker.Open, ticker.Low, ticker.Last, ticker.Buy, ticker.Sell, ticker.Time, ticker.Volume])
    }

    // 请求其它交易对行情数据
    for (var symbol of arrSymbol) {
        exchange.GetTicker(symbol)
    }

    // 再次调用GetTickers
    var tickers2 = exchange.GetTickers()
    var tbl2 = {type: "table", title: "tickers2", cols: ["Symbol", "High", "Open", "Low", "Last", "Buy", "Sell", "Time", "Volume"], rows: []}
    for (var ticker of tickers2) {
        tbl2.rows.push([ticker.Symbol, ticker.High, ticker.Open, ticker.Low, ticker.Last, ticker.Buy, ticker.Sell, ticker.Time, ticker.Volume])
    }

    LogStatus("`" + JSON.stringify([tbl1, tbl2]) +  "`")
}
```

```python
'''backtest
start: 2024-05-21 00:00:00
end: 2024-09-05 00:00:00
period: 5m
basePeriod: 1m
exchanges: [{"eid":"Binance","currency":"BTC_USDT"}]
'''

import json

def main():
    arrSymbol = ["ADA_USDT", "LTC_USDT", "ETH_USDT", "SOL_USDT"]

    tickers1 = exchange.GetTickers()
    tbl1 = {"type": "table", "title": "tickers1", "cols": ["Symbol", "High", "Open", "Low", "Last", "Buy", "Sell", "Time", "Volume"], "rows": []}
    for ticker in tickers1:
        tbl1["rows"].append([ticker["Symbol"], ticker["High"], ticker["Open"], ticker["Low"], ticker["Last"], ticker["Buy"], ticker["Sell"], ticker["Time"], ticker["Volume"]])

    for symbol in arrSymbol:
        exchange.GetTicker(symbol)

    tickers2 = exchange.GetTickers()
    tbl2 = {"type": "table", "title": "tickers2", "cols": ["Symbol", "High", "Open", "Low", "Last", "Buy", "Sell", "Time", "Volume"], "rows": []}
    for ticker in tickers2:
        tbl2["rows"].append([ticker["Symbol"], ticker["High"], ticker["Open"], ticker["Low"], ticker["Last"], ticker["Buy"], ticker["Sell"], ticker["Time"], ticker["Volume"]])

    LogStatus("`" + json.dumps([tbl1, tbl2]) +  "`")
```

```rust
/*backtest
start: 2024-05-21 00:00:00
end: 2024-09-05 00:00:00
period: 5m
basePeriod: 1m
exchanges: [{"eid":"Binance","currency":"BTC_USDT"}]
*/

fn tickerToJson(ticker: &Ticker) -> String {
    format!(r#"["{}", {}, {}, {}, {}, {}, {}, {}, {}]"#, ticker.Symbol, ticker.High, ticker.Open, ticker.Low, ticker.Last, ticker.Buy, ticker.Sell, ticker.Time, ticker.Volume)
}

fn main() {
    let arrSymbol = ["ADA_USDT", "LTC_USDT", "ETH_USDT", "SOL_USDT"];

    // 请求其它交易对行情数据之前，调用GetTickers
    // Rust SDK 没有JSON序列化，使用format!拼接表格的JSON文本
    let tickers1 = exchange.GetTickers().unwrap();
    let rows1 = tickers1.iter().map(tickerToJson).collect::<Vec<String>>().join(",");
    let tbl1 = format!(r#"{{"type": "table", "title": "tickers1", "cols": ["Symbol", "High", "Open", "Low", "Last", "Buy", "Sell", "Time", "Volume"], "rows": [{}]}}"#, rows1);

    // 请求其它交易对行情数据
    for symbol in arrSymbol {
        exchange.GetTicker(symbol);
    }

    // 再次调用GetTickers
    let tickers2 = exchange.GetTickers().unwrap();
    let rows2 = tickers2.iter().map(tickerToJson).collect::<Vec<String>>().join(",");
    let tbl2 = format!(r#"{{"type": "table", "title": "tickers2", "cols": ["Symbol", "High", "Open", "Low", "Last", "Buy", "Sell", "Time", "Volume"], "rows": [{}]}}"#, rows2);

    LogStatus!(format!("`[{},{}]`", tbl1, tbl2));
}
```

注意事项：
- 该函数请求交易所聚合行情接口，调用之前无需设置交易对、合约代码。仅返回交易所上线交易品种的行情数据。
- 回测系统支持该函数。
- 未提供聚合行情接口的交易所对象，不支持该函数。
- 该函数不支持期权合约。

不支持的交易所：`BitFlyer`、`Coincheck`、`Gemini`、`WOO`、`Futures_WOO`、`Zaif`、`Futures_EdgeX`、`Futures_Aevo`、`Pendle`、`Futures_Boros`、`Uniswap`、`Jupiter`、`KyberSwap`、`OneInch`、`Exchange`、`Web3`。调用时报错并返回空值，所有交易所的对照见`能力矩阵`。

See also: `Ticker`, `exchange.GetTicker`

#### exchange.GetDepth

```
exchange.GetDepth()
exchange.GetDepth(symbol)
```

获取当前设置的交易对、合约代码所对应的现货或合约的`Depth`结构，即订单簿数据。

Parameters:

- `symbol` (string, optional): 品种代码，例如现货交易所对象上的```BTC_USDT```、期货交易所对象上的```BTC_USDT.swap```，写法（含期权）见`品种代码`。不传时请求当前交易对、合约代码的订单薄数据。

Returns (`Depth` / 空值): 成功时返回`Depth`结构；失败时返回空值。

获取当前交易对的深度，打印卖二价。

```javascript
function main(){
    var depth = exchange.GetDepth()
    if (!depth || depth.Asks.length < 2) return    // 获取失败时为null
    var price = depth.Asks[1].Price
    Log("卖二价", price)
}
```

```python
def main():
    depth = exchange.GetDepth()
    if not depth or len(depth["Asks"]) < 2:
        return
    price = depth["Asks"][1]["Price"]
    Log("卖二价", price)
```

```rust
fn main() {
    let Ok(depth) = exchange.GetDepth(None) else { return };
    if depth.Asks.len() < 2 {
        return;
    }
    let price = depth.Asks[1].Price;
    Log!("卖二价", price);
}
```

当配置的```exchange```对象为期货交易所对象时，使用```symbol```参数请求指定品种（期货品种）的订单簿数据。

```javascript
function main() {
    // BTC的U本位永续合约
    var depth = exchange.GetDepth("BTC_USDT.swap")
    Log(depth)
}
```

```python
def main():
    depth = exchange.GetDepth("BTC_USDT.swap")
    Log(depth)
```

```rust
fn main() {
    // BTC的U本位永续合约
    let depth = exchange.GetDepth("BTC_USDT.swap").unwrap();
    Log!(depth);
}
```

回测系统中，使用**模拟级 Tick**回测时，```exchange.GetDepth()```函数返回数据的各档位均为模拟值。

回测系统中，使用**实盘级 Tick**回测时，```exchange.GetDepth()```函数返回的数据为秒级别的深度快照。

链上兑换类交易所（例如Uniswap、Jupiter）没有订单簿，返回的深度由逐档递增规模的询价推算：每档的```Amount```为该档新增的基础币数量，```Price```为该档的边际成交价。询价规模与请求次数见交易所页，例如`Uniswap`、`Jupiter`。

不支持的交易所：`OKX_DEX`、`Web3`。调用时报错并返回空值，所有交易所的对照见`能力矩阵`。

See also: `exchange.GetTicker`, `exchange.GetTrades`, `exchange.GetRecords`

#### exchange.GetTrades

```
exchange.GetTrades()
exchange.GetTrades(symbol)
```

获取当前设置的交易对、合约代码所对应的现货或合约的`Trade`结构数组，即市场的成交数据。

Parameters:

- `symbol` (string, optional): 品种代码，例如现货交易所对象上的```BTC_USDT```、期货交易所对象上的```BTC_USDT.swap```，写法（含期权）见`品种代码`。不传时请求当前交易对、合约代码的最近成交记录。

Returns (`Trade`数组 / 空值): 成功时返回`Trade`结构数组；失败时返回空值。

获取当前交易对的最近成交，打印第一条记录。

```javascript
function main(){
    var trades = exchange.GetTrades()
    if (!trades || trades.length == 0) return    // 获取失败时为null，没有成交时为空数组
    var t = trades[0]
    Log("Id:", t.Id, "Time:", t.Time, "Price:", t.Price, "Amount:", t.Amount, "Type:", t.Type)
}
```

```python
def main():
    trades = exchange.GetTrades()
    if not trades:
        return
    t = trades[0]
    Log("Id:", t["Id"], "Time:", t["Time"], "Price:", t["Price"],
        "Amount:", t["Amount"], "Type:", t["Type"])
```

```rust
fn main() {
    let Ok(trades) = exchange.GetTrades(None) else { return };
    let Some(t) = trades.first() else { return };
    Log!("Id:", t.Id, "Time:", t.Time, "Price:", t.Price, "Amount:", t.Amount, "Type:", t.Type);
}
```

当配置的```exchange```对象为期货交易所对象时，使用```symbol```参数请求具体品种（期货品种）的市场成交记录数据。

```javascript
function main() {
    // BTC的U本位永续合约
    var trades = exchange.GetTrades("BTC_USDT.swap")
    Log(trades)
}
```

```python
def main():
    trades = exchange.GetTrades("BTC_USDT.swap")
    Log(trades)
```

```rust
fn main() {
    // BTC的U本位永续合约
    let trades = exchange.GetTrades("BTC_USDT.swap").unwrap();
    Log!(trades);
}
```

```exchange.GetTrades()```函数用于获取当前交易对、合约所对应市场的成交历史（非自身成交）。部分交易所不支持该函数，且具体返回的成交记录范围因交易所而异，需要根据实际情况处理。返回数据为一个数组，其中每个元素的时间顺序与```exchange.GetRecords()```函数的返回数据顺序一致，即数组的最后一个元素为距离当前时间最近的数据。

在回测系统中，使用**模拟级 Tick**回测时，```exchange.GetTrades()```函数返回空数组。

在回测系统中，使用**实盘级 Tick**回测时，```exchange.GetTrades()```函数返回的数据为订单流快照数据，即`Trade`结构数组。

不支持的交易所：`Futures_EdgeX`、`Pendle`、`Jupiter`、`KyberSwap`、`OneInch`、`Futures_IB`、`Web3`。调用时报错并返回空值，所有交易所的对照见`能力矩阵`。

See also: `exchange.GetTicker`, `exchange.GetDepth`, `exchange.GetRecords`

#### exchange.GetRecords

```
exchange.GetRecords()
exchange.GetRecords(symbol)
exchange.GetRecords(symbol, period)
exchange.GetRecords(symbol, period, limit)
exchange.GetRecords(period)
exchange.GetRecords(period, limit)
```

获取当前设置的交易对、合约代码所对应的现货或合约的`Record`结构数组，即K线数据。

Parameters:

- `symbol` (string, optional): 品种代码，例如现货交易所对象上的```BTC_USDT```、期货交易所对象上的```BTC_USDT.swap```，写法（含期权）见`品种代码`。不传时请求当前交易对、合约代码的K线数据。
- `period` (number, optional): 所请求K线数据的周期，例如：`PERIOD_M1`、`PERIOD_M5`、`PERIOD_M15`等；参数```period```除了可以传入已定义的标准周期外，还可以传入整数数值，单位为秒。若不传该参数，则默认请求的K线数据周期为当前策略实盘/回测所配置的默认K线周期。
- `limit` (number, optional): 所请求K线数据的长度，若不传该参数，则默认请求长度为```exchange.SetMaxBarLen()```函数设置的K线长度（未设置时为200）；该参数可能会触发对交易所K线数据的分页查询，分页查询时该函数的调用耗时会相应增加。

Returns (`Record`数组 / 空值): 成功时返回`Record`结构数组；失败时返回空值。

获取1小时K线，读取最早一根和最新两根K线。

```javascript
function main() {
    var records = exchange.GetRecords(PERIOD_H1)
    if (!records || records.length < 2) return    // 获取失败时为null
    // records[0]是最早的一根，最后一个元素是最新的一根
    Log("最早一根 Time:", records[0].Time, "Open:", records[0].Open, "High:", records[0].High)
    Log("最新", records[records.length - 1], "上一根", records[records.length - 2])
    // 输出：最新 {"Time":...,"Open":...,"High":...,"Low":...,"Close":...,"Volume":...,...} 上一根 {...}
}
```

```python
def main():
    records = exchange.GetRecords(PERIOD_H1)
    if not records or len(records) < 2:
        return
    Log("最早一根 Time:", records[0]["Time"], "Open:", records[0]["Open"], "High:", records[0]["High"])
    Log("最新", records[-1], "上一根", records[-2])
    # 输出：最新 {"Time":...,"Open":...,"High":...,"Low":...,"Close":...,"Volume":...,...} 上一根 {...}
```

```rust
fn main() {
    let Ok(records) = exchange.GetRecords(None, PERIOD_H1, None) else { return };
    let n = records.len();
    if n < 2 {
        return;
    }
    Log!("最早一根 Time:", records[0].Time, "Open:", records[0].Open, "High:", records[0].High);
    Log!("最新", records[n - 1], "上一根", records[n - 2]);
}
```

获取自定义周期的 K 线数据。

```javascript
function main() {
    // 打印 K 线周期为 120 秒（2 分钟）的 K 线数据
    Log(exchange.GetRecords(60 * 2))
    // 打印 K 线周期为 5 分钟的 K 线数据
    Log(exchange.GetRecords(PERIOD_M5))
}
```

```python
def main():
    Log(exchange.GetRecords(60 * 2))
    Log(exchange.GetRecords(PERIOD_M5))
```

```rust
fn main() {
    // 打印 K 线周期为 120 秒（2 分钟）的 K 线数据
    Log!(exchange.GetRecords(None, 60 * 2, None));
    // 打印 K 线周期为 5 分钟的 K 线数据
    Log!(exchange.GetRecords(None, PERIOD_M5, None));
}
```

当配置的```exchange```对象为期货交易所对象时，可使用```symbol```、```period```、```limit```参数请求指定品种（期货品种）的K线数据。

```javascript
function main() {
    var records = exchange.GetRecords("BTC_USDT.swap", 60, 100)
    Log(records)
}
```

```python
def main():
    records = exchange.GetRecords("BTC_USDT.swap", 60, 100)
    Log(records)
```

```rust
fn main() {
    let records = exchange.GetRecords("BTC_USDT.swap", 60, 100).unwrap();
    Log!(records);
}
```

默认K线周期可在回测、实盘页面进行设置。调用```exchange.GetRecords()```函数时，如果指定了参数，则获取该参数所指定周期的K线数据；如果未指定参数，则返回回测、实盘参数中所设置周期的K线数据。

返回值为```Record```结构数组。返回的K线数据会随时间不断累积，累积的K线柱数量上限受```exchange.SetMaxBarLen()```函数设置的影响，未设置时默认上限为200个K线柱（本次调用传入的```limit```更大时，以```limit```为上限）。当K线数据达到累积上限后，每新增一根K线柱的同时会删除时间最早的一根K线柱（类似队列的先进先出）。部分交易所未提供K线接口，此时由托管者实时收集市场成交记录数据（```Trade```结构数组）来合成K线。

如果交易所的K线接口支持分页查询，当调用```exchange.SetMaxBarLen()```函数设置较大的K线长度时，系统会发起多次API请求。

初始调用```exchange.GetRecords()```函数时，所获取的K线柱数量在回测和实盘环境下有所不同：

  - 回测系统会预先获取回测时间范围起始时刻之前一定数量的K线柱（默认为5000个，回测系统的相关设置及数据量会影响最终返回的数量），作为初始K线数据。

  - 实盘时首次获取```limit```个K线柱（未传```limit```时为```exchange.SetMaxBarLen()```设置的长度，默认200），超过交易所K线接口单次可获取的数量时会分页请求。

将```period```参数设置为5，即表示请求获取以5秒为周期的K线数据。如果```period```参数不能被60整除（即所代表的周期无法以分钟为单位表示），系统底层会使用```exchange.GetTrades()```的相关接口获取成交记录数据，以合成所需的K线数据；如果```period```参数能被60整除，则最小使用1分钟K线数据（并尽可能使用较大的周期）来合成所需的K线数据。

在回测系统的模拟级别回测中，由于需要设置底层K线周期（模拟级别回测时，系统会根据设置的底层K线周期，使用对应的K线数据生成Tick数据），因此需要注意：策略中获取的K线数据周期不能小于底层K线周期。这是因为在模拟级别回测中，各个周期的K线数据均由底层K线周期对应的K线数据合成而来。

不支持的交易所：`Pendle`、`Uniswap`、`Jupiter`、`KyberSwap`、`OneInch`、`Web3`。调用时报错并返回空值，所有交易所的对照见`能力矩阵`。

以回退方式支持的交易所：交易所的接口不能完整提供本函数，由托管者补足。

交易所没有对应接口，由托管者实现：

- `BitFlyer`、`Coincheck`、`Zaif`、`Futures_Polymarket`：交易所没有K线接口，由托管者用成交记录合成：首次调用只有最近成交覆盖的少量K线，随调用逐步累积。
- `Futures_Aevo`：交易所没有K线接口，由托管者用成交记录合成：首次调用只有最近成交覆盖的少量K线，随调用逐步累积。合约没有成交时为空。

部分周期由托管者合成：

- `AscendEx`：原生周期为1分钟、5分钟、15分钟、30分钟、1小时、2小时、4小时、6小时、12小时、1天、1周、1月；其它周期由托管者合成。
- `Backpack`、`Futures_Backpack`、`Futures_Binance`、`Futures_ApolloX`、`Futures_Aster`：原生周期为1分钟、3分钟、5分钟、15分钟、30分钟、1小时、2小时、4小时、6小时、8小时、12小时、1天、3天、1周、1月；其它周期由托管者合成。
- `BigONE`：原生周期为1分钟、5分钟、15分钟、30分钟、1小时、3小时、4小时、6小时、12小时、1天、1周、1月；其它周期由托管者合成。
- `Binance`、`Aster`：原生周期为1秒、1分钟、3分钟、5分钟、15分钟、30分钟、1小时、2小时、4小时、6小时、8小时、12小时、1天、3天、1周、1月；其它周期由托管者合成。
- `Bitfinex`、`Futures_Bitfinex`：原生周期为1分钟、5分钟、15分钟、30分钟、1小时、3小时、6小时、12小时、1天、1周、14天、1月；其它周期由托管者合成。
- `Bitget`：原生周期为1分钟、3分钟、5分钟、15分钟、30分钟、1小时、4小时、6小时、12小时、1天、3天、1周、1月；其它周期由托管者合成。3分钟只在统一账户（v3）可用。
- `Futures_Bitget`：原生周期为1分钟、3分钟、5分钟、15分钟、30分钟、1小时、4小时、6小时、12小时、1天、3天、1周、1月；其它周期由托管者合成。统一账户（v3）的币本位交割合约没有3天周期。
- `Bithumb`：原生周期为1分钟、3分钟、5分钟、10分钟、15分钟、30分钟、1小时、4小时、1天、1周、1月；其它周期由托管者合成。
- `Bitstamp`：原生周期为1分钟、3分钟、5分钟、15分钟、30分钟、1小时、2小时、4小时、6小时、12小时、1天、3天；其它周期由托管者合成。
- `Bybit`：原生周期为1分钟、3分钟、5分钟、15分钟、30分钟、1小时、2小时、4小时、6小时、12小时、1天、1周、1月；其它周期由托管者合成。
- `Futures_Bybit`：原生周期为1分钟、3分钟、5分钟、15分钟、30分钟、1小时、2小时、4小时、6小时、12小时、1天、1周、1月；其它周期由托管者合成。期权没有K线接口，由托管者用成交记录合成。
- `Coinone`：原生周期为1分钟、3分钟、5分钟、10分钟、15分钟、30分钟、1小时、2小时、4小时、6小时、1天、1周、1月；其它周期由托管者合成。
- `Coinw`：原生周期为1分钟、3分钟、5分钟、15分钟、30分钟、1小时、2小时、4小时、1天、1周；其它周期由托管者合成。
- `Futures_Coinw`：原生周期为1分钟、3分钟、5分钟、15分钟、30分钟、1小时、4小时、1天、1周、1月；其它周期由托管者合成。单次最多返回300根。
- `Crypto`、`Futures_Crypto`：原生周期为1分钟、5分钟、15分钟、30分钟、1小时、2小时、4小时、6小时、12小时、1天、1周、14天、1月；其它周期由托管者合成。
- `DeepCoin`、`Futures_DeepCoin`：原生周期为1分钟、3分钟、5分钟、15分钟、30分钟、1小时、2小时、4小时、6小时、12小时、1天、1周、1月、1年；其它周期由托管者合成。
- `Futures_Deribit`：原生周期为1分钟、3分钟、5分钟、10分钟、15分钟、30分钟、1小时、2小时、3小时、6小时、12小时、1天；其它周期由托管者合成。
- `DigiFinex`、`Futures_DigiFinex`、`Futures_Kraken`、`Futures_WEEX`、`Futures_Lighter`：原生周期为1分钟、5分钟、15分钟、30分钟、1小时、4小时、12小时、1天、1周；其它周期由托管者合成。
- `GateIO`：原生周期为10秒、1分钟、5分钟、15分钟、30分钟、1小时、4小时、8小时、1天、1周、1月；其它周期由托管者合成。
- `Futures_GateIO`：原生周期为10秒、30秒、1分钟、5分钟、15分钟、30分钟、1小时、2小时、4小时、6小时、8小时、12小时、1天、1周、1月；其它周期由托管者合成。
- `Gemini`：原生周期为1分钟、5分钟、15分钟、30分钟、1小时、6小时、1天；其它周期由托管者合成。
- `HashKey`：原生周期为1分钟、3分钟、5分钟、15分钟、30分钟、1小时、2小时、4小时、6小时、8小时、12小时、1天、1周、1月；其它周期由托管者合成。
- `HitBTC`：原生周期为1分钟、3分钟、5分钟、15分钟、30分钟、1小时、4小时、1天、1周、1月；其它周期由托管者合成。
- `Huobi`：原生周期为1分钟、5分钟、15分钟、30分钟、1小时、4小时、1天、1周、1月、1年；其它周期由托管者合成。
- `Futures_HuobiDM`、`MEXC`：原生周期为1分钟、5分钟、15分钟、30分钟、1小时、4小时、1天、1周、1月；其它周期由托管者合成。
- `Korbit`：原生周期为1分钟、5分钟、15分钟、30分钟、1小时、4小时、1天、1周；其它周期由托管者合成。
- `Kraken`：原生周期为1分钟、5分钟、15分钟、30分钟、1小时、4小时、1天、1周、15天；其它周期由托管者合成。
- `KuCoin`：原生周期为1分钟、3分钟、5分钟、15分钟、30分钟、1小时、2小时、4小时、6小时、8小时、12小时、1天、1周；其它周期由托管者合成。
- `Futures_KuCoin`：原生周期为1分钟、5分钟、15分钟、30分钟、1小时、2小时、4小时、8小时、12小时、1天、1周；其它周期由托管者合成。
- `LBank`：原生周期为1分钟、5分钟、15分钟、30分钟、1小时、4小时、8小时、12小时、1天、1周、1月；其它周期由托管者合成。
- `Futures_MEXC`：原生周期为1分钟、5分钟、15分钟、30分钟、1小时、4小时、8小时、1天、1周、1月；其它周期由托管者合成。
- `OKEX`、`Futures_OKCoin`、`OKX_DEX`：原生周期为1分钟、3分钟、5分钟、15分钟、30分钟、1小时、2小时、4小时、6小时、12小时、1天、3天、1周、1月、3月；其它周期由托管者合成。
- `Poloniex`：原生周期为1分钟、5分钟、10分钟、15分钟、30分钟、1小时、2小时、4小时、6小时、12小时、1天、3天、1周、1月；其它周期由托管者合成。
- `Upbit`：原生周期为1秒、1分钟、3分钟、5分钟、10分钟、15分钟、30分钟、1小时、4小时、1天、1周、1月、1年；其它周期由托管者合成。
- `WEEX`：原生周期为1分钟、5分钟、15分钟、30分钟、1小时、2小时、4小时、6小时、8小时、12小时、1天、1周；其它周期由托管者合成。
- `WOO`：原生周期为1分钟、5分钟、15分钟、30分钟、1小时、4小时、12小时、1天、1周、1月；其它周期由托管者合成。
- `Futures_WOO`：原生周期为1分钟、5分钟、15分钟、30分钟、1小时、4小时、12小时、1天、1周、1月、1年；其它周期由托管者合成。
- `Hyperliquid`：原生周期为1分钟、3分钟、5分钟、15分钟、30分钟、1小时、2小时、4小时、8小时、12小时、1天、3天、1周、1月；其它周期由托管者合成。
- `Futures_Hyperliquid`：原生周期为1分钟、3分钟、5分钟、15分钟、30分钟、1小时、2小时、4小时、8小时、12小时、1天、3天、1周；其它周期由托管者合成。Outcome品种没有K线。
- `Futures_EdgeX`：原生周期为1分钟、5分钟、15分钟、30分钟、1小时、2小时、4小时、6小时、8小时、12小时、1天、1周、1月；其它60秒整数倍的周期由托管者用原生K线合成，其余周期（如秒级）不可用（交易所没有成交接口）。
- `Futures_WOOFi`：原生周期为1分钟、5分钟、15分钟、30分钟、1小时、4小时、12小时、1天、1周、1月、1年；其它周期由托管者合成。单次最多返回1000根。
- `Futures_Futu`：原生周期为1分钟、3分钟、5分钟、15分钟、30分钟、1小时、1天、1周、1月；其它周期由托管者合成。
- `Futures_IB`：原生周期为1分钟、3分钟、5分钟、15分钟、30分钟、1小时、2小时、4小时、6小时、1天、1周；其它60秒整数倍的周期由托管者用原生K线合成，其余周期（如秒级）不可用（本交易所对象不支持```exchange.GetTrades()```）。
- `Exchange`：网关的```records```只接受1分钟、3分钟、5分钟、15分钟、30分钟、1小时、1天周期，其它周期由托管者合成；不支持指定起始时间。

See also: `exchange.GetTicker`, `exchange.GetDepth`, `exchange.GetTrades`, `exchange.SetMaxBarLen`

#### exchange.GetMarkets

```
exchange.GetMarkets()
```

获取交易所市场信息。

Returns (object / 空值): 包含`Market`结构体的字典，请求失败或交易所不支持时返回空值。Rust中该函数返回字典而非```Result```，失败时返回空字典并输出错误日志。

期货交易所对象的调用例子。

```javascript
function main() {
    var markets = exchange.GetMarkets()
    if (!markets) return    // 获取失败时为null
    var currency = exchange.GetCurrency()

    // 获取当前合约代码也可以用exchange.GetContractType()函数
    var ct = "swap"

    var key = currency + "." + ct
    Log(key, ":", markets[key])
}
```

```python
def main():
    markets = exchange.GetMarkets()
    if markets is None:
        return
    currency = exchange.GetCurrency()
    ct = "swap"

    key = currency + "." + ct
    Log(key, ":", markets[key])
```

```rust
fn main() {
    let markets = exchange.GetMarkets();
    let currency = exchange.GetCurrency();

    // 获取当前合约代码也可以用exchange.GetContractType()函数
    let ct = "swap";

    let key = format!("{}.{}", currency, ct);
    Log!(key, ":", format!("{:?}", markets.get(&key)));
}
```

使用期货交易所对象，在回测系统中调用```exchange.GetMarkets()```函数。调用任何行情函数之前，GetMarkets只返回当前默认交易对的market数据，调用行情函数之后会返回所有请求过的品种的market数据。可以参考以下测试例子。

```javascript
/*backtest
start: 2023-05-10 00:00:00
end: 2023-05-20 00:00:00
period: 1m
basePeriod: 1m
exchanges: [{"eid":"Futures_Binance","currency":"BTC_USDT"}]
*/

function main() {
    var arrSymbol = ["SOL_USDT.swap", "BTC_USDT.quarter", "ETH_USDT.swap", "ETH_USDT.quarter"]

    var tbl1 = {
        type: "table",
        title: "markets1",
        cols: ["key", "Symbol", "BaseAsset", "QuoteAsset", "TickSize", "AmountSize", "PricePrecision", "AmountPrecision", "MinQty", "MaxQty", "MinNotional", "MaxNotional", "CtVal"],
        rows: []
    }

    var markets1 = exchange.GetMarkets()
    for (var key in markets1) {
        var market = markets1[key]
        tbl1.rows.push([key, market.Symbol, market.BaseAsset, market.QuoteAsset, market.TickSize, market.AmountSize, market.PricePrecision, market.AmountPrecision, market.MinQty, market.MaxQty, market.MinNotional, market.MaxNotional, market.CtVal])
    }

    for (var symbol of arrSymbol) {
        exchange.GetTicker(symbol)
    }

    var tbl2 = {
        type: "table",
        title: "markets2",
        cols: ["key", "Symbol", "BaseAsset", "QuoteAsset", "TickSize", "AmountSize", "PricePrecision", "AmountPrecision", "MinQty", "MaxQty", "MinNotional", "MaxNotional", "CtVal"],
        rows: []
    }

    var markets2 = exchange.GetMarkets()
    for (var key in markets2) {
        var market = markets2[key]
        tbl2.rows.push([key, market.Symbol, market.BaseAsset, market.QuoteAsset, market.TickSize, market.AmountSize, market.PricePrecision, market.AmountPrecision, market.MinQty, market.MaxQty, market.MinNotional, market.MaxNotional, market.CtVal])
    }

    LogStatus("`" + JSON.stringify([tbl1, tbl2]) + "`")
}
```

```python
'''backtest
start: 2023-05-10 00:00:00
end: 2023-05-20 00:00:00
period: 1m
basePeriod: 1m
exchanges: [{"eid":"Futures_Binance","currency":"BTC_USDT"}]
'''

import json

def main():
    arrSymbol = ["SOL_USDT.swap", "BTC_USDT.quarter", "ETH_USDT.swap", "ETH_USDT.quarter"]

    tbl1 = {
        "type": "table",
        "title": "markets1",
        "cols": ["key", "Symbol", "BaseAsset", "QuoteAsset", "TickSize", "AmountSize", "PricePrecision", "AmountPrecision", "MinQty", "MaxQty", "MinNotional", "MaxNotional", "CtVal"],
        "rows": []
    }

    markets1 = exchange.GetMarkets()
    for key in markets1:
        market = markets1[key]
        tbl1["rows"].append([key, market["Symbol"], market["BaseAsset"], market["QuoteAsset"], market["TickSize"], market["AmountSize"], market["PricePrecision"], market["AmountPrecision"], market["MinQty"], market["MaxQty"], market["MinNotional"], market["MaxNotional"], market["CtVal"]])

    for symbol in arrSymbol:
        exchange.GetTicker(symbol)

    tbl2 = {
        "type": "table",
        "title": "markets2",
        "cols": ["key", "Symbol", "BaseAsset", "QuoteAsset", "TickSize", "AmountSize", "PricePrecision", "AmountPrecision", "MinQty", "MaxQty", "MinNotional", "MaxNotional", "CtVal"],
        "rows": []
    }

    markets2 = exchange.GetMarkets()
    for key in markets2:
        market = markets2[key]
        tbl2["rows"].append([key, market["Symbol"], market["BaseAsset"], market["QuoteAsset"], market["TickSize"], market["AmountSize"], market["PricePrecision"], market["AmountPrecision"], market["MinQty"], market["MaxQty"], market["MinNotional"], market["MaxNotional"], market["CtVal"]])

    LogStatus("`" + json.dumps([tbl1, tbl2]) + "`")
```

```rust
/*backtest
start: 2023-05-10 00:00:00
end: 2023-05-20 00:00:00
period: 1m
basePeriod: 1m
exchanges: [{"eid":"Futures_Binance","currency":"BTC_USDT"}]
*/

fn marketToJson(key: &str, market: &Market) -> String {
    format!(r#"["{}", "{}", "{}", "{}", {}, {}, {}, {}, {}, {}, {}, {}, {}]"#, key, market.Symbol, market.BaseAsset, market.QuoteAsset, market.TickSize, market.AmountSize, market.PricePrecision, market.AmountPrecision, market.MinQty, market.MaxQty, market.MinNotional, market.MaxNotional, market.CtVal)
}

fn main() {
    let arrSymbol = ["SOL_USDT.swap", "BTC_USDT.quarter", "ETH_USDT.swap", "ETH_USDT.quarter"];

    // Rust SDK 没有JSON序列化，使用format!拼接表格的JSON文本
    let markets1 = exchange.GetMarkets();
    let mut rows1: Vec<String> = Vec::new();
    for (key, market) in &markets1 {
        rows1.push(marketToJson(key, market));
    }
    let tbl1 = format!(r#"{{"type": "table", "title": "markets1", "cols": ["key", "Symbol", "BaseAsset", "QuoteAsset", "TickSize", "AmountSize", "PricePrecision", "AmountPrecision", "MinQty", "MaxQty", "MinNotional", "MaxNotional", "CtVal"], "rows": [{}]}}"#, rows1.join(","));

    for symbol in arrSymbol {
        exchange.GetTicker(symbol);
    }

    let markets2 = exchange.GetMarkets();
    let mut rows2: Vec<String> = Vec::new();
    for (key, market) in &markets2 {
        rows2.push(marketToJson(key, market));
    }
    let tbl2 = format!(r#"{{"type": "table", "title": "markets2", "cols": ["key", "Symbol", "BaseAsset", "QuoteAsset", "TickSize", "AmountSize", "PricePrecision", "AmountPrecision", "MinQty", "MaxQty", "MinNotional", "MaxNotional", "CtVal"], "rows": [{}]}}"#, rows2.join(","));

    LogStatus!(format!("`[{},{}]`", tbl1, tbl2));
}
```

```exchange.GetMarkets()```函数返回值为一个字典，键名为交易品种的名称，对于现货固定格式为交易对，例如：
```json
{
    "BTC_USDT" : {...},  // 键值为Market结构
    "LTC_USDT" : {...},
    ...
}
```

对于期货合约交易所来说，因为一个品种可能有多个合约，例如：```BTC_USDT```交易对，有永续合约、季度合约等。```exchange.GetMarkets()```函数返回一个字典，键名为交易对与合约代码的组合，例如：
```json
{
    "BTC_USDT.swap" : {...},     // 键值为Market结构
    "BTC_USDT.quarter" : {...},
    "LTC_USDT.swap" : {...},
    ...
}
```

- ```exchange.GetMarkets()```函数支持实盘、回测系统。
- ```exchange.GetMarkets()```函数仅返回交易所上线交易的品种市场信息。
- 期权合约：部分交易期权的期货交易所返回的结果包含期权合约，键名为交易对加交易所的期权代码（形如```ETH_USDT.ETH-25JUN27-2800-C-USDT```，各交易所格式不同）；结果是否包含期权、键名的具体格式见各交易所页的「期权」一节。

不支持的交易所：`Coincheck`、`Exchange`、`Web3`。调用时报错并返回空值，所有交易所的对照见`能力矩阵`。

See also: `Market`

#### exchange.GetRawJSON

```
exchange.GetRawJSON()
```

获取当前交易所对象（`exchange`、`exchanges`）最近一次```rest```请求返回的原始内容。

Returns (string): ```rest```请求（包括`exchange.IO`的```api```调用）的响应数据；请求失败（没有收到应答或交易所返回错误）时为错误信息，与`GetLastError`获取的内容相同。

查询账户后读取并解析交易所返回的原始内容。

```javascript
function main(){
    exchange.GetAccount()
    var obj = JSON.parse(exchange.GetRawJSON())
    Log(obj)
    // 输出：账户接口返回的原始JSON对象，字段因交易所而异
}
```

```python
import json
def main():
    exchange.GetAccount()
    obj = json.loads(exchange.GetRawJSON())
    Log(obj)
    # 输出：账户接口返回的原始JSON对象，字段因交易所而异
```

```rust
fn main() {
    let _ = exchange.GetAccount();
    // Rust中GetRawJSON返回String，用JSONParse解析
    if let Some(obj) = JSONParse(&exchange.GetRawJSON()) {
        Log!(obj);
        // 输出：账户接口返回的原始JSON对象，字段因交易所而异
    }
}
```

```exchange.GetRawJSON()```函数仅支持实盘交易。

See also: `exchange`

#### exchange.SetData

```
exchange.SetData(key, value)
```

设置策略运行时所加载的数据。

Parameters:

- `key` (string, required): 数据集合的名称。
- `value` (array, required): ```exchange.SetData()```函数所要加载的数据，其数据结构为数组。该数据结构与```exchange.GetData()```函数请求外部数据时所要求的格式相同，即：```"schema": ["time", "data"]```。

Returns (number): 参数```value```经JSON编码后的字符串长度。

参数```value```所要求的数据格式如同以下例子中的```data```变量。可以看到，时间戳```1579622400000```对应的时间为```2020-01-22 00:00:00```。当策略程序运行时刻超过该时间之后、且在下一条数据的时间戳```1579708800000```（即时间```2020-01-23 00:00:00```）之前，调用```exchange.GetData()```函数获取到的均为```[1579622400000, 123]```这条数据的内容。随着程序继续运行、时间推移，以此类推即可逐条获取数据。

在以下例子中，运行时（回测或实盘）当前时刻到达或超过```1579795200000```这个时间戳时，调用```exchange.GetData()```函数，返回值为：```{"Time":1579795200000,"Data":["abc",123,{"price":123}]}```。其中```"Time":1579795200000```对应数据```[1579795200000, ["abc", 123, {"price": 123}]]```中的```1579795200000```；```"Data":["abc",123,{"price":123}]```对应数据```[1579795200000, ["abc", 123, {"price": 123}]]```中的```["abc", 123, {"price": 123}]```。

```javascript
/*backtest
start: 2020-01-21 00:00:00
end: 2020-02-12 00:00:00
period: 1d
basePeriod: 1d
exchanges: [{"eid":"Bitfinex","currency":"BTC_USD"}]
*/
function main() {
    var data = [
        [1579536000000, "abc"],
        [1579622400000, 123],
        [1579708800000, {"price": 123}],
        [1579795200000, ["abc", 123, {"price": 123}]]
    ]
    exchange.SetData("test", data)
    while(true) {
        Log(exchange.GetData("test"))
        Sleep(1000)
    }
}
```

```python
'''backtest
start: 2020-01-21 00:00:00
end: 2020-02-12 00:00:00
period: 1d
basePeriod: 1d
exchanges: [{"eid":"Bitfinex","currency":"BTC_USD"}]
'''

def main():
    data = [
        [1579536000000, "abc"],
        [1579622400000, 123],
        [1579708800000, {"price": 123}],
        [1579795200000, ["abc", 123, {"price": 123}]]
    ]
    exchange.SetData("test", data)
    while True:
        Log(exchange.GetData("test"))
        Sleep(1000)
```

```rust
/*backtest
start: 2020-01-21 00:00:00
end: 2020-02-12 00:00:00
period: 1d
basePeriod: 1d
exchanges: [{"eid":"Bitfinex","currency":"BTC_USD"}]
*/

fn main() {
    // Rust SDK 中SetData的数据参数为JSON字符串
    let data = r#"[
        [1579536000000, "abc"],
        [1579622400000, 123],
        [1579708800000, {"price": 123}],
        [1579795200000, ["abc", 123, {"price": 123}]]
    ]"#;
    exchange.SetData("test", data);
    loop {
        Log!(exchange.GetData("test"));
        Sleep(1000);
    }
}
```

加载的数据可以是任何经济指标、行业数据、相关指数等，用于在策略中量化评估各类可量化的信息。

See also: `exchange.GetData`

#### exchange.GetData

```
exchange.GetData(key)
exchange.GetData(key, timeout)
exchange.GetData(key, timeout, offset)
```

获取由```exchange.SetData()```函数加载的数据，或外部链接提供的数据。

Parameters:

- `key` (string, required): 数据集合的名称，或数据请求链接。
- `timeout` (number, optional): 用于设置请求外部链接数据时的缓存超时时间，单位为毫秒。实盘时若不传该参数，默认为60000（一分钟），最小为5000。```exchange.SetData()```加载的数据不会过期。
- `offset` (number, optional): 时间戳，单位为毫秒。返回数据集合中时间不晚于```offset```的最后一条记录；若不传该参数，则为当前时间，即只返回当前时刻已经到达的记录。

Returns (object): 返回```{"Time": ..., "Data": ...}```形式的对象，```Time```为记录的时间戳，```Data```为记录的数据内容。没有可用的记录时（数据未加载、请求外部链接失败，或所有记录的时间都晚于```offset```），```Data```为空值。

获取直接写入数据的调用方式。

```javascript
/*backtest
start: 2020-01-21 00:00:00
end: 2020-02-12 00:00:00
period: 1d
basePeriod: 1d
exchanges: [{"eid":"Bitfinex","currency":"BTC_USD"}]
*/
function main() {
    exchange.SetData("test", [[1579536000000, _D(1579536000000)], [1579622400000, _D(1579622400000)], [1579708800000, _D(1579708800000)]])
    while(true) {
        Log(exchange.GetData("test"))
        Sleep(1000 * 60 * 60 * 24)
    }
}
```

```python
'''backtest
start: 2020-01-21 00:00:00
end: 2020-02-12 00:00:00
period: 1d
basePeriod: 1d
exchanges: [{"eid":"Bitfinex","currency":"BTC_USD"}]
'''
def main():
    exchange.SetData("test", [[1579536000000, _D(1579536000000/1000)], [1579622400000, _D(1579622400000/1000)], [1579708800000, _D(1579708800000/1000)]])
    while True:
        Log(exchange.GetData("test"))
        Sleep(1000 * 60 * 60 * 24)
```

```rust
/*backtest
start: 2020-01-21 00:00:00
end: 2020-02-12 00:00:00
period: 1d
basePeriod: 1d
exchanges: [{"eid":"Bitfinex","currency":"BTC_USD"}]
*/
fn main() {
    // Rust SDK 中SetData的数据参数为JSON字符串，使用format!拼接数据
    let data = format!(r#"[[1579536000000, "{}"], [1579622400000, "{}"], [1579708800000, "{}"]]"#, _D(1579536000000), _D(1579622400000), _D(1579708800000));
    exchange.SetData("test", &data);
    loop {
        Log!(exchange.GetData("test"));
        Sleep(1000 * 60 * 60 * 24);
    }
}
```

支持通过外部链接请求数据，请求返回的数据格式如下：
```json
{
    "schema":["time","data"],
    "data":[
        [1579536000000, "abc"],
        [1579622400000, 123],
        [1579708800000, {"price": 123}],
        [1579795200000, ["abc", 123, {"price": 123}]]
    ]
}
```

其中```schema```定义了数据主体中每条记录的数据格式，该格式固定为```["time","data"]```，与```data```属性中逐条数据的格式一一对应。```data```属性用于存储数据主体，每条数据由毫秒级时间戳和数据内容构成（数据内容可以是任何可JSON编码的数据）。

以下是使用Go语言编写的测试服务程序：
```go
package main

import (
    "fmt"
    "net/http"
    "encoding/json"
)

func Handle (w http.ResponseWriter, r *http.Request) {
    defer func() {
        fmt.Println("req:", *r)
        ret := map[string]interface{}{
            "schema": []string{"time","data"},
            "data": []interface{}{
                []interface{}{1579536000000, "abc"},
                []interface{}{1579622400000, 123},
                []interface{}{1579708800000, map[string]interface{}{"price":123}},
                []interface{}{1579795200000, []interface{}{"abc", 123, map[string]interface{}{"price":123}}},
            },
        }
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

程序接收到请求后返回的应答数据：
```json
{
    "schema":["time","data"],
    "data":[
        [1579536000000, "abc"],
        [1579622400000, 123],
        [1579708800000, {"price": 123}],
        [1579795200000, ["abc", 123, {"price": 123}]]
    ]
}
```

测试策略代码如下：

```javascript
/*backtest
start: 2020-01-21 00:00:00
end: 2020-02-12 00:00:00
period: 1d
basePeriod: 1d
exchanges: [{"eid":"Bitfinex","currency":"BTC_USD"}]
*/
function main() {
    while(true) {
        Log(exchange.GetData("http://xxx.xx.x.xx:9090/data"))
        Sleep(1000)
    }
}
```

```python
'''backtest
start: 2020-01-21 00:00:00
end: 2020-02-12 00:00:00
period: 1d
basePeriod: 1d
exchanges: [{"eid":"Bitfinex","currency":"BTC_USD"}]
'''

def main():
    while True:
        Log(exchange.GetData("http://xxx.xx.x.xx:9090/data"))
        Sleep(1000)
```

```rust
/*backtest
start: 2020-01-21 00:00:00
end: 2020-02-12 00:00:00
period: 1d
basePeriod: 1d
exchanges: [{"eid":"Bitfinex","currency":"BTC_USD"}]
*/

fn main() {
    loop {
        Log!(exchange.GetData("http://xxx.xx.x.xx:9090/data"));
        Sleep(1000);
    }
}
```

获取外部链接数据的调用方式。

```javascript
function main() {
    Log(exchange.GetData("http://xxx.xx.x.xx:9090/data"))
    Log(exchange.GetData("https://www.fmz.com/upload/asset/32bf73a69fc12d36e76.json"))
}
```

```python
def main():
    Log(exchange.GetData("http://xxx.xx.x.xx:9090/data"))
    Log(exchange.GetData("https://www.fmz.com/upload/asset/32bf73a69fc12d36e76.json"))
```

```rust
fn main() {
    Log!(exchange.GetData("http://xxx.xx.x.xx:9090/data"));
    Log!(exchange.GetData("https://www.fmz.com/upload/asset/32bf73a69fc12d36e76.json"));
}
```

请求在[datadata](https://www.datadata.com)平台上创建的查询数据，应答的数据格式需满足以下要求（schema中必须描述time和data字段）：
```json
{
    "data": [],
    "schema": ["time", "data"]
}
```

其中"data"字段为所需的数据内容，且"data"字段中的数据须与"schema"中约定的字段一致。调用```exchange.GetData()```函数时，将返回一个JSON对象，例如：```{"Time":1579795200000, "Data":"..."}```。

```javascript
function main() {
    Log(exchange.GetData("https://www.datadata.com/api/v1/query/xxx/data"))   // 链接中xxx部分为查询数据的编码，此处xxx仅为示例
}
```

```python
def main():
    Log(exchange.GetData("https://www.datadata.com/api/v1/query/xxx/data"))
```

```rust
fn main() {
    Log!(exchange.GetData("https://www.datadata.com/api/v1/query/xxx/data"));   // 链接中xxx部分为查询数据的编码，此处xxx仅为示例
}
```

回测时一次性获取数据，实盘时缓存一分钟的数据。在回测系统中，当使用访问接口请求数据的方式时，回测系统会自动为请求添加```from```（时间戳，单位秒）、```to```（时间戳，单位秒）、```period```（底层K线周期，时间戳，单位毫秒）等参数，用于确定要获取数据的时间范围。

Rust中```exchange.GetData(key)```只接受```key```参数，返回```Result```（请求外部链接失败或不存在该数据集合时返回错误）；如需指定```timeout```、```offset```，请使用```exchange.GetDataWithOptions(key, timeout, offset)```。

See also: `exchange.SetData`

### Trade

交易函数负责下单、改单、撤单和查询订单，包括普通订单与条件单（止盈止损）；只作用于调用它的交易所对象绑定的账户。

下单推荐用`exchange.CreateOrder`，可以直接指定品种与方向；`exchange.Buy`、`exchange.Sell`按当前交易对下单，期货要先用`exchange.SetDirection`设置开平仓方向。订单结构见`Order`，条件单配置见`Condition`。

#### exchange.Buy

```
exchange.Buy(price, amount)
exchange.Buy(price, amount, ...args)
```

下买单。```Buy()```是交易所对象`exchange`的成员函数，只作用于该交易所对象绑定的账户（多账户时用```exchanges[i].Buy()```指定账户）。

Parameters:

- `price` (number, required): 订单价格。
- `amount` (number, required): 订单量。
- `arg` (string / number / bool / object / array / any, optional): 扩展参数，```arg```参数可以传多个。字符串、数字等参数会输出到这条下单日志中（多个参数以空格连接）。最后一个对象参数不会输出到日志，而是作为下单选项，支持的键：```type```（只能为```market```或```limit```，显式指定市价单或限价单）、```tif```、```reduceOnly```、```postOnly```。

Returns (string / 空值): 下单成功返回订单Id，下单失败返回空值。FMZ平台的订单`Order`结构的属性```Id```由交易所品种代码和交易所原始订单Id组成，以英文逗号分隔。例如OKX交易所现货交易对```ETH_USDT```订单的属性```Id```格式为：```ETH-USDT,1547130415509278720```。调用```exchange.Buy()```函数下单时，返回值订单```Id```与订单`Order`结构的```Id```属性一致。

```exchange.Buy()```返回的订单编号，可用于查询订单信息和取消订单。

```javascript
function main() {
    var id = exchange.Buy(100, 1);
    Log("id:", id);
}
```

```python
def main():
    id = exchange.Buy(100, 1)
    Log("id:", id)
```

```rust
fn main() {
    let id = exchange.Buy(100, 1).unwrap();
    Log!("id:", id);
}
```

加密货币期货合约下单前，使用```exchange.SetDirection()```函数设置交易方向。设置后```exchange.Buy()```、```exchange.Sell()```按所设方向下单，需要按对应关系配对使用：```buy```、```closesell```搭配```exchange.Buy()```，```sell```、```closebuy```搭配```exchange.Sell()```。方向与函数不匹配时不会报错，而是按所设方向下单（例如设置```sell```后调用```exchange.Buy()```，实际下的是开空仓的卖单），可能下出与预期相反的订单。

```javascript
function main() {
    exchange.SetContractType("quarter")

    // 开多仓：设置"buy"方向，调用Buy
    exchange.SetDirection("buy")
    var id1 = exchange.Buy(50, 1)

    // 平多仓：设置"closebuy"方向，调用Sell
    exchange.SetDirection("closebuy")
    var id2 = exchange.Sell(60, 1)

    // 开空仓：设置"sell"方向，调用Sell
    exchange.SetDirection("sell")
    var id3 = exchange.Sell(60, 1)

    // 平空仓：设置"closesell"方向，调用Buy
    exchange.SetDirection("closesell")
    var id4 = exchange.Buy(50, 1)
}
```

```python
def main():
    exchange.SetContractType("quarter")
    exchange.SetDirection("buy")
    id1 = exchange.Buy(50, 1)
    exchange.SetDirection("closebuy")
    id2 = exchange.Sell(60, 1)
    exchange.SetDirection("sell")
    id3 = exchange.Sell(60, 1)
    exchange.SetDirection("closesell")
    id4 = exchange.Buy(50, 1)
```

```rust
fn main() {
    let _ = exchange.SetContractType("quarter");

    // 开多仓：设置"buy"方向，调用Buy
    let _ = exchange.SetDirection("buy");
    let id1 = exchange.Buy(50, 1);

    // 平多仓：设置"closebuy"方向，调用Sell
    let _ = exchange.SetDirection("closebuy");
    let id2 = exchange.Sell(60, 1);

    // 开空仓：设置"sell"方向，调用Sell
    let _ = exchange.SetDirection("sell");
    let id3 = exchange.Sell(60, 1);

    // 平空仓：设置"closesell"方向，调用Buy
    let _ = exchange.SetDirection("closesell");
    let id4 = exchange.Buy(50, 1);
    Log!(id1, id2, id3, id4);
}
```

现货市价单。

```javascript
// 例如交易对：ETH_BTC ，市价单买入
function main() {
    // 下市价单买入，买入0.1个BTC（计价币）金额的ETH币
    exchange.Buy(-1, 0.1)
}
```

```python
def main():
    exchange.Buy(-1, 0.1)
```

```rust
// 例如交易对：ETH_BTC ，市价单买入
fn main() {
    // 下市价单买入，买入0.1个BTC（计价币）金额的ETH币
    let _ = exchange.Buy(-1, 0.1);
}
```

期货合约下单时必须注意交易方向是否设置正确，调用```exchange.SetDirection()```设置方向后，```exchange.Buy()```按所设方向下单，方向与函数不匹配时不会报错，可能下出与预期相反的订单。加密货币期货合约交易所的下单量如无特殊说明，则以合约张数为单位。

参数```price```设置为```-1```时用于下市价单，此功能需要交易所的下单接口支持市价单。以市价单方式对加密货币现货下买单时，下单量参数```amount```为以计价币计价的金额数量。以市价单方式对加密货币期货合约下单时，下单量参数```amount```的单位为合约张数。实盘时，有少数加密货币交易所不支持市价单接口。个别现货交易所的市价买单下单量为交易币数量而不是金额，见各交易所页的注意事项。

如使用较旧版本的托管者，```exchange.Buy()```函数返回的订单```Id```可能与当前文档中描述的返回值订单```Id```有所差别。

```exchange.Buy()```受```CreateOrder```的限流设置影响，见`API限流控制`。

不支持的交易所：`Web3`。调用时报错并返回空值，所有交易所的对照见`能力矩阵`。

See also: `exchange.Sell`, `exchange.SetContractType`, `exchange.SetDirection`, `exchange.IO`, `API限流控制`

#### exchange.Sell

```
exchange.Sell(price, amount)
exchange.Sell(price, amount, ...args)
```

下达卖单。

Parameters:

- `price` (number, required): 订单价格。
- `amount` (number, required): 下单量。
- `arg` (string / number / bool / object / array / any, optional): 扩展参数，```arg```参数可以传多个。字符串、数字等参数会输出到这条下单日志中（多个参数以空格连接）。最后一个对象参数不会输出到日志，而是作为下单选项，支持的键：```type```（只能为```market```或```limit```，显式指定市价单或限价单）、```tif```、```reduceOnly```、```postOnly```。

Returns (string / 空值): 下单成功时返回订单Id，下单失败时返回空值。FMZ平台的订单`Order`结构的属性```Id```由交易所品种代码和交易所原始订单Id组成，两者以英文逗号间隔。例如OKX交易所现货交易对```ETH_USDT```订单的属性```Id```格式为：```ETH-USDT,1547130415509278720```。调用```exchange.Sell()```函数下单时，返回值订单```Id```与订单`Order`结构的```Id```属性一致。

```exchange.Sell()```返回的订单编号，可用于查询订单信息和取消订单。

```javascript
function main(){
    var id = exchange.Sell(100, 1)
    Log("id:", id)
}
```

```python
def main():
    id = exchange.Sell(100, 1)
    Log("id:", id)
```

```rust
fn main() {
    let id = exchange.Sell(100, 1).unwrap();
    Log!("id:", id);
}
```

加密货币期货合约下单前，使用```exchange.SetDirection()```函数设置交易方向。设置后```exchange.Buy()```、```exchange.Sell()```按所设方向下单，需要按对应关系配对使用：```buy```、```closesell```搭配```exchange.Buy()```，```sell```、```closebuy```搭配```exchange.Sell()```。方向与函数不匹配时不会报错，而是按所设方向下单（例如设置```sell```后调用```exchange.Buy()```，实际下的是开空仓的卖单），可能下出与预期相反的订单。

```javascript
function main() {
    exchange.SetContractType("quarter")

    // 开多仓：设置"buy"方向，调用Buy
    exchange.SetDirection("buy")
    var id1 = exchange.Buy(50, 1)

    // 平多仓：设置"closebuy"方向，调用Sell
    exchange.SetDirection("closebuy")
    var id2 = exchange.Sell(60, 1)

    // 开空仓：设置"sell"方向，调用Sell
    exchange.SetDirection("sell")
    var id3 = exchange.Sell(60, 1)

    // 平空仓：设置"closesell"方向，调用Buy
    exchange.SetDirection("closesell")
    var id4 = exchange.Buy(50, 1)
}
```

```python
def main():
    exchange.SetContractType("quarter")
    exchange.SetDirection("buy")
    id1 = exchange.Buy(50, 1)
    exchange.SetDirection("closebuy")
    id2 = exchange.Sell(60, 1)
    exchange.SetDirection("sell")
    id3 = exchange.Sell(60, 1)
    exchange.SetDirection("closesell")
    id4 = exchange.Buy(50, 1)
```

```rust
fn main() {
    let _ = exchange.SetContractType("quarter");

    // 开多仓：设置"buy"方向，调用Buy
    let _ = exchange.SetDirection("buy");
    let id1 = exchange.Buy(50, 1);

    // 平多仓：设置"closebuy"方向，调用Sell
    let _ = exchange.SetDirection("closebuy");
    let id2 = exchange.Sell(60, 1);

    // 开空仓：设置"sell"方向，调用Sell
    let _ = exchange.SetDirection("sell");
    let id3 = exchange.Sell(60, 1);

    // 平空仓：设置"closesell"方向，调用Buy
    let _ = exchange.SetDirection("closesell");
    let id4 = exchange.Buy(50, 1);
    Log!(id1, id2, id3, id4);
}
```

现货市价单。

```javascript
// 例如交易对：ETH_BTC,市价单卖出
function main() {
    // 注意：下市价单卖出，卖出0.2个ETH
    exchange.Sell(-1, 0.2)
}
```

```python
def main():
    exchange.Sell(-1, 0.2)
```

```rust
// 例如交易对：ETH_BTC,市价单卖出
fn main() {
    // 注意：下市价单卖出，卖出0.2个ETH
    let _ = exchange.Sell(-1, 0.2);
}
```

期货合约下单时必须注意交易方向是否设置正确，调用```exchange.SetDirection()```设置方向后，```exchange.Sell()```按所设方向下单，方向与函数不匹配时不会报错，可能下出与预期相反的订单。加密货币期货合约交易所的下单量如无特殊说明则以合约张数为单位。

参数```price```设置为```-1```时用于下达市价单，需要交易所的下单接口支持市价单。以市价单方式交易加密货币现货时，下卖单时，下单量参数```amount```以交易币为单位。以市价单方式交易加密货币期货合约时，下单量参数```amount```以合约张数为单位。实盘时，有少数加密货币交易所不支持市价单接口。

如使用较旧版本的托管者，```exchange.Sell()```函数返回的订单```Id```可能与当前文档中描述的返回值订单```Id```有所差别。

```exchange.Sell()```受```CreateOrder```的限流设置影响，见`API限流控制`。

不支持的交易所：`Web3`。调用时报错并返回空值，所有交易所的对照见`能力矩阵`。

See also: `exchange.Buy`, `exchange.SetContractType`, `exchange.SetDirection`, `exchange.IO`, `API限流控制`

#### exchange.CreateOrder

```
exchange.CreateOrder(symbol, side, price, amount)
exchange.CreateOrder(symbol, side, price, amount, ...args)
```

下单。

Parameters:

- `symbol` (string, required): 订单的品种，例如现货交易所对象上的```BTC_USDT```、期货交易所对象上的```BTC_USDT.swap```，写法（含期权）见`品种代码`。
- `side` (string, required): 交易方向：现货为```buy```（买入）、```sell```（卖出）；期货为```buy```（开多）、```sell```（开空）、```closebuy```（平多）、```closesell```（平空）。可以附带交易所特定参数，见备注。
- `price` (number, required): 订单的价格。价格为-1时表示订单为市价单。
- `amount` (number, required): 订单的下单量。需要注意当订单为**现货市价单买单**时，下单量为买入金额；个别现货交易所的市价买单下单量为交易币数量而不是金额，见各交易所页的注意事项。对于期货交易所对象，使用```CreateOrder()```/```Buy()```/```Sell()```函数下单时如无特殊说明，下单量参数```amount```均为合约张数。
- `arg` (string / number / bool / object / array / any, optional): 扩展参数，```arg```参数可以传多个。字符串、数字等参数会输出到这条下单日志中（多个参数以空格连接）。最后一个对象参数不会输出到日志，而是作为下单选项，支持的键：```type```（只能为```market```或```limit```，显式指定市价单或限价单）、```tif```、```reduceOnly```、```postOnly```。

Returns (string / 空值): 下单成功返回订单Id，下单失败返回空值。 FMZ平台的订单`Order`结构的属性```Id```由交易所品种代码和交易所原始订单Id组成，以英文逗号间隔。例如OKX交易所的现货交易对```ETH_USDT```订单的属性```Id```格式为：```ETH-USDT,1547130415509278720```。
调用```exchange.CreateOrder(symbol, side, price, amount)```函数下单时，返回值订单```Id```与订单`Order`结构的```Id```属性一致。

现货交易所对象、期货交易所对象调用```exchange.CreateOrder()```函数下单。

```javascript
function main() {
    var id = exchange.CreateOrder("BTC_USDT", "buy", 60000, 0.01)           // 现货交易所对象下单币币交易BTC_USDT交易对
    // var id = exchange.CreateOrder("BTC_USDT.swap", "buy", 60000, 0.01)   // 期货交易所对象下单BTC的U本位永续合约
    Log("Order Id:", id)
}
```

```python
def main():
    id = exchange.CreateOrder("BTC_USDT", "buy", 60000, 0.01)          # 现货交易所对象下单币币交易BTC_USDT交易对
    # id = exchange.CreateOrder("BTC_USDT.swap", "buy", 60000, 0.01)   # 期货交易所对象下单BTC的U本位永续合约
    Log("Order Id:", id)
```

```rust
fn main() {
    let id = exchange.CreateOrder("BTC_USDT", "buy", 60000, 0.01);           // 现货交易所对象下单币币交易BTC_USDT交易对
    // let id = exchange.CreateOrder("BTC_USDT.swap", "buy", 60000, 0.01);   // 期货交易所对象下单BTC的U本位永续合约
    Log!("Order Id:", id);
}
```

使用附加参数（option）下单，传递交易所特定参数。

```javascript
function main() {
    // 使用JSON格式传递option参数
    var option = {
        "type": "TRAILING_STOP_MARKET",
        "activationPrice": "2300",
        "callbackRate": "0.1"
    }
    var sideWithOption = "buy;" + JSON.stringify(option)
    var id = exchange.CreateOrder("SOL_USDT.swap", sideWithOption, -1, 1)
    Log("Order Id:", id)

    Sleep(2000)
    Log(exchange.GetOrder(id))
}
```

```python
import json

def main():
    # 使用JSON格式传递option参数
    option = {
        "type": "TRAILING_STOP_MARKET",
        "activationPrice": "2300",
        "callbackRate": "0.1"
    }
    sideWithOption = "buy;" + json.dumps(option)
    id = exchange.CreateOrder("SOL_USDT.swap", sideWithOption, -1, 1)
    Log("Order Id:", id)

    Sleep(2000)
    Log(exchange.GetOrder(id))
```

```rust
fn main() {
    // 使用JSON格式传递option参数（Rust不支持JSON.stringify，直接使用原始字符串构造JSON文本）
    let option = r#"{"type": "TRAILING_STOP_MARKET", "activationPrice": "2300", "callbackRate": "0.1"}"#;
    let sideWithOption = format!("buy;{}", option);
    let id = exchange.CreateOrder("SOL_USDT.swap", &sideWithOption, -1, 1).unwrap();
    Log!("Order Id:", id);

    Sleep(2000);
    Log!(exchange.GetOrder(&id));
}
```

支持通过```side```参数传递附加参数（option），用于传递交易所特定的参数。附加参数需要与```side```参数合并传入，格式为```"side;{JSON对象}"```（推荐）或```"side;key=value&key=value"```（URL编码格式）。例如：```"buy;{\"type\":\"TRAILING_STOP_MARKET\"}"```。

不同交易所支持的option参数不同，具体支持的参数取决于交易所API文档。常见的参数包括：订单类型（type）、生效规则（timeInForce）、触发价格（activationPrice）、回调比率（callbackRate）等。

使用option参数时，```price```和```amount```参数仍然需要提供。如果交易所API中的某些参数已通过option传递，这些基础参数可能会被option中的对应参数覆盖，具体行为取决于交易所API实现。

链上兑换类交易所（例如Uniswap、Jupiter）下单即立即兑换，不会挂单等待：限价单的```price```是最差可接受成交价，写入链上交易强制执行，当前报价已经达不到时直接报错、不发交易；市价单（```price```为-1）按滑点设置保护，市价买入时```amount```为要花费的计价币数量。订单ID的格式、能否撤单以及支持的附加参数见交易所页，例如`Uniswap`、`Jupiter`。

```side```参数可以附带交易所特定的参数，用于传递交易所特定的参数（如订单类型、生效规则）：写成```"side;{JSON对象}"```或```"side;key=value&key=value"```，例如```'buy;{"type":"TRAILING_STOP_MARKET","activationPrice":"2300"}'```或```"buy;type=TRAILING_STOP_MARKET&activationPrice=2300"```。具体支持的参数取决于交易所API。

不支持的交易所：`Web3`。调用时报错并返回空值，所有交易所的对照见`能力矩阵`。

See also: `exchange.Buy`, `exchange.Sell`, `exchange.ModifyOrder`

#### exchange.ModifyOrder

```
exchange.ModifyOrder(orderId, side, price, amount)
```

修改现有的普通订单，可以修改订单的价格和数量。支持通过附加参数修改订单的其它属性（取决于交易所API支持）。

Parameters:

- `orderId` (string, required): 要修改的原订单ID。订单ID格式与`exchange.CreateOrder`函数返回的订单ID一致，由交易所品种代码和交易所原始订单Id组成，以英文逗号间隔。例如：```"ETH-USDT,1547130415509278720"```。
- `side` (string, required): 交易方向：现货为```buy```（买入）、```sell```（卖出）；期货为```buy```（开多）、```sell```（开空）、```closebuy```（平多）、```closesell```（平空）。可以附带交易所特定参数，见备注。
- `price` (number, required): 订单的新价格。价格为-1（或其它小于等于0的值）时表示不修改价格。
- `amount` (number, required): 订单的新下单量。数量为-1（或其它小于等于0的值）时表示不修改数量；价格和数量不能都不修改，否则报错并返回空值。需要注意当订单为**现货市价单买单**时，下单量为买入金额；个别现货交易所的市价单买单的下单量为交易币数。

Returns (string / 空值): 修改订单成功返回订单Id，修改失败返回空值。返回的订单ID可能与原订单ID相同，也可能不同，这取决于交易所API的实现方式。某些交易所修改订单后会返回新的订单ID，而有些交易所保持订单ID不变。

修改普通订单的价格和数量。

```javascript
function main() {
    // 创建一个限价买单
    var id = exchange.CreateOrder("SOL_USDT.swap", "buy", 88, 1)
    Log("Original Order ID:", id)
    Sleep(2000)

    // 查询原订单信息
    var order = exchange.GetOrder(id)
    Log("Original Order Info:", order)
    Sleep(1000)

    // 修改订单价格和数量
    var newId = exchange.ModifyOrder(id, "buy", 77, 2)
    Log("Modified Order ID:", newId)
    Sleep(2000)

    // 查询修改后的订单信息
    var newOrder = exchange.GetOrder(newId)
    Log("Modified Order Info:", newOrder)

    // 取消订单
    exchange.CancelOrder(newId)
}
```

```python
def main():
    # 创建一个限价买单
    id = exchange.CreateOrder("SOL_USDT.swap", "buy", 88, 1)
    Log("Original Order ID:", id)
    Sleep(2000)

    # 查询原订单信息
    order = exchange.GetOrder(id)
    Log("Original Order Info:", order)
    Sleep(1000)

    # 修改订单价格和数量
    newId = exchange.ModifyOrder(id, "buy", 77, 2)
    Log("Modified Order ID:", newId)
    Sleep(2000)

    # 查询修改后的订单信息
    newOrder = exchange.GetOrder(newId)
    Log("Modified Order Info:", newOrder)

    # 取消订单
    exchange.CancelOrder(newId)
```

```rust
fn main() {
    // 创建一个限价买单
    let id = exchange.CreateOrder("SOL_USDT.swap", "buy", 88, 1).unwrap();
    Log!("Original Order ID:", id);
    Sleep(2000);

    // 查询原订单信息
    let order = exchange.GetOrder(&id).unwrap();
    Log!("Original Order Info:", order);
    Sleep(1000);

    // 修改订单价格和数量
    let newId = exchange.ModifyOrder(&id, "buy", 77, 2).unwrap();
    Log!("Modified Order ID:", newId);
    Sleep(2000);

    // 查询修改后的订单信息
    let newOrder = exchange.GetOrder(&newId).unwrap();
    Log!("Modified Order Info:", newOrder);

    // 取消订单
    let _ = exchange.CancelOrder(&newId);
}
```

使用附加参数（option）修改订单的价格匹配模式。

```javascript
function main() {
    // 创建一个限价买单
    var id = exchange.CreateOrder("SOL_USDT.swap", "buy", 77, 1)
    Log("Original Order ID:", id)
    Sleep(2000)

    // 修改订单，并设置价格匹配模式为QUEUE_20
    // 通过side参数传递附加参数（JSON格式）
    var option = {"priceMatch": "QUEUE_20"}
    var sideWithOption = "buy;" + JSON.stringify(option)

    var newId = exchange.ModifyOrder(id, sideWithOption, -1, 2)
    Log("Modified Order ID:", newId)
    Sleep(2000)

    // 查询修改后的订单信息
    var newOrder = exchange.GetOrder(newId)
    Log("Modified Order Info:", newOrder)

    // 取消订单
    exchange.CancelOrder(newId)
}
```

```python
import json

def main():
    # 创建一个限价买单
    id = exchange.CreateOrder("SOL_USDT.swap", "buy", 77, 1)
    Log("Original Order ID:", id)
    Sleep(2000)

    # 修改订单，并设置价格匹配模式为QUEUE_20
    # 通过side参数传递附加参数（JSON格式）
    option = {"priceMatch": "QUEUE_20"}
    sideWithOption = "buy;" + json.dumps(option)

    newId = exchange.ModifyOrder(id, sideWithOption, -1, 2)
    Log("Modified Order ID:", newId)
    Sleep(2000)

    # 查询修改后的订单信息
    newOrder = exchange.GetOrder(newId)
    Log("Modified Order Info:", newOrder)

    # 取消订单
    exchange.CancelOrder(newId)
```

```rust
fn main() {
    // 创建一个限价买单
    let id = exchange.CreateOrder("SOL_USDT.swap", "buy", 77, 1).unwrap();
    Log!("Original Order ID:", id);
    Sleep(2000);

    // 修改订单，并设置价格匹配模式为QUEUE_20
    // 通过side参数传递附加参数（JSON格式），Rust不支持JSON.stringify，直接使用原始字符串构造JSON文本
    let option = r#"{"priceMatch": "QUEUE_20"}"#;
    let sideWithOption = format!("buy;{}", option);

    let newId = exchange.ModifyOrder(&id, &sideWithOption, -1, 2).unwrap();
    Log!("Modified Order ID:", newId);
    Sleep(2000);

    // 查询修改后的订单信息
    let newOrder = exchange.GetOrder(&newId).unwrap();
    Log!("Modified Order Info:", newOrder);

    // 取消订单
    let _ = exchange.CancelOrder(&newId);
}
```

```exchange.ModifyOrder()```函数返回的订单ID根据交易所API实现不同可能有不同行为。有些交易所API返回的订单ID会更新，有些则保持不变。建议使用返回的新订单ID进行后续操作。

```exchange.ModifyOrder()```函数的价格或数量传入-1（小于等于0的值）时，该项不会提交给交易所，表示不修改；两项都不修改时报错并返回空值。其它参数不会按交易所接口规则校验，直接提交给交易所API。

支持通过```side```参数传递附加参数（option），用于修改订单的其它属性。附加参数需要与```side```参数合并传入，格式为```"side;{JSON对象}"```（推荐）或```"side;key=value"```（URL编码格式）。例如修改价格匹配模式：```"buy;{\"priceMatch\":\"QUEUE_20\"}"```。

对于普通订单的市价单修改，需要具体查看交易所API是否支持。有些交易所不支持市价单的修改操作。

修改订单时，订单的其它属性（如订单类型、持仓模式、账户模式、杠杆、订单生效规则等）通常会保留原订单的设置。如果需要修改这些属性，可以通过附加参数（option）传入，前提是交易所API支持。

对于现货市价买单，需要注意订单数量单位可能是金额而非币数。

修改订单功能的支持情况取决于具体交易所，部分交易所可能不支持修改订单功能或仅支持部分参数的修改。使用前请查阅对应交易所的API文档。

```side```参数可以附带交易所特定的参数，用于修改订单的其它属性（如价格匹配模式）：写成```"side;{JSON对象}"```或```"side;key=value&key=value"```，例如```"buy;{\"priceMatch\":\"QUEUE_20\"}"```或```"buy;priceMatch=QUEUE_20"```。具体支持的参数取决于交易所API。

仅以下交易所支持：`Binance`、`Futures_Binance`、`Bitfinex`、`Futures_Bitfinex`、`Bitget`、`Futures_Bitget`、`Bybit`、`Futures_Bybit`、`Crypto`、`Futures_Crypto`、`Futures_DeepCoin`、`Futures_Deribit`、`GateIO`、`Futures_GateIO`、`HitBTC`、`Kraken`、`Futures_Kraken`、`KuCoin`、`Futures_MEXC`、`OKEX`、`Futures_OKCoin`、`Poloniex`、`Upbit`、`WOO`、`Futures_WOO`、`Hyperliquid`、`Futures_Hyperliquid`、`Futures_Lighter`、`Futures_Aevo`、`Futures_Boros`、`Futures_WOOFi`、`Futures_Futu`。其余交易所调用时报错并返回空值，所有交易所的对照见`能力矩阵`。

See also: `exchange.CreateOrder`, `exchange.CancelOrder`, `exchange.GetOrder`, `exchange.GetOrders`

#### exchange.CancelOrder

```
exchange.CancelOrder(orderId)
exchange.CancelOrder(orderId, ...args)
```

取消订单。FMZ平台的订单`Order`结构中，属性```Id```由交易所品种代码和交易所原始订单Id组成，两者之间以英文逗号分隔。例如，OKX交易所现货交易对```ETH_USDT```的订单，其属性```Id```的格式为：```ETH-USDT,1547130415509278720```。

调用```exchange.CancelOrder()```函数撤销订单时，传入的参数```orderId```与订单`Order`结构的```Id```属性一致。

Parameters:

- `orderId` (string, required): 所要取消的订单。
- `arg` (string / number / bool / object / array / any, optional): 扩展参数，用于将附带信息输出到本条撤单日志中；```arg```参数可以传入多个。

Returns (bool / 空值): 返回真值（例如```true```）表示取消订单请求发送成功，请求发送失败时返回空值。返回值仅代表请求发送成功或失败；若要判断交易所是否已取消订单，可以调用```exchange.GetOrders()```进行判断。

撤销订单。

```javascript
function main(){
    var id = exchange.Sell(99999, 1)
    if (!id) return
    exchange.CancelOrder(id)
}
```

```python
def main():
    id = exchange.Sell(99999, 1)
    if not id:
        return
    exchange.CancelOrder(id)
```

```rust
fn main() {
    let Ok(id) = exchange.Sell(99999, 1) else { return };
    let _ = exchange.CancelOrder(&id);
}
```

FMZ的API函数中，能够产生日志输出的函数（例如```Log()```、```exchange.Buy()```、```exchange.CancelOrder()```等）都可以在必要参数之后附带一些输出参数。

例如：```exchange.CancelOrder(orders[i].Id, orders[i])```，即在取消Id为```orders[i].Id```的订单时，附带输出该订单的信息，也就是```orders[i]```这个`Order`结构。

```javascript
function main() {
    if (exchange.GetName().includes("Futures_")) {
        Log("Set contract to: perpetual swap, set direction to: open long.")
        exchange.SetContractType("swap")
        exchange.SetDirection("buy")
    }

    var ticker = exchange.GetTicker()
    exchange.Buy(ticker.Last * 0.5, 0.1)

    var orders = exchange.GetOrders()
    for (var i = 0 ; i < orders.length ; i++) {
        exchange.CancelOrder(orders[i].Id, "Canceled order:", orders[i])
        Sleep(500)
    }
}
```

```python
def main():
    if exchange.GetName().find("Futures_") != -1:
        Log("Set contract to: perpetual swap, set direction to: open long.")
        exchange.SetContractType("swap")
        exchange.SetDirection("buy")

    ticker = exchange.GetTicker()
    exchange.Buy(ticker["Last"] * 0.5, 0.1)

    orders = exchange.GetOrders()
    for i in range(len(orders)):
        exchange.CancelOrder(orders[i]["Id"], "Canceled order:", orders[i])
        Sleep(500)
```

```rust
fn main() {
    if exchange.GetName().contains("Futures_") {
        Log!("Set contract to: perpetual swap, set direction to: open long.");
        let _ = exchange.SetContractType("swap");
        let _ = exchange.SetDirection("buy");
    }

    let ticker = exchange.GetTicker(None).unwrap();
    let _ = exchange.Buy(ticker.Last * 0.5, 0.1);

    let orders = exchange.GetOrders(None).unwrap();
    for i in 0..orders.len() {
        // Rust不支持在CancelOrder的必要参数后附带输出参数，撤单后单独调用Log!宏输出附带信息
        let _ = exchange.CancelOrder(&orders[i].Id);
        Log!("Canceled order:", orders[i]);
        Sleep(500);
    }
}
```

如果使用较旧版本的托管者，```exchange.CancelOrder()```函数的参数```orderId```可能与当前文档中描述的```orderId```有所差别。

不支持的交易所：`Jupiter`、`OKX_DEX`、`Web3`。调用时报错并返回空值，所有交易所的对照见`能力矩阵`。

See also: `exchange.Buy`, `exchange.Sell`, `exchange.GetOrders`, `exchange.ModifyOrder`

#### exchange.GetOrder

```
exchange.GetOrder(orderId)
```

获取订单信息。

Parameters:

- `orderId` (string, required): 要查询的订单。FMZ平台订单`Order`结构的```Id```属性由交易所品种代码和交易所原始订单Id组成，以英文逗号分隔。例如，OKX交易所现货交易对```ETH_USDT```订单的```Id```属性格式为：```ETH-USDT,1547130415509278720```。

调用```exchange.GetOrder()```函数查询订单时，传入的参数```orderId```与订单`Order`结构的```Id```属性一致。

Returns (`Order` / 空值): 根据订单号查询订单详情，查询成功时返回`Order`结构，查询失败时返回空值。

下一笔卖单，再用返回的订单Id查询订单信息。

```javascript
function main(){
    var id = exchange.Sell(1000, 1)
    if (!id) return
    var order = exchange.GetOrder(id)
    if (!order) return
    Log("Id:", order.Id, "Price:", order.Price, "Amount:", order.Amount, "DealAmount:",
        order.DealAmount, "Status:", order.Status, "Type:", order.Type)
}
```

```python
def main():
    id = exchange.Sell(1000, 1)
    if not id:
        return
    order = exchange.GetOrder(id)
    if not order:
        return
    Log("Id:", order["Id"], "Price:", order["Price"], "Amount:", order["Amount"], "DealAmount:",
        order["DealAmount"], "Status:", order["Status"], "Type:", order["Type"])
```

```rust
fn main() {
    let Ok(id) = exchange.Sell(1000, 1) else { return };
    let Ok(order) = exchange.GetOrder(&id) else { return };
    Log!("Id:", order.Id, "Price:", order.Price, "Amount:", order.Amount, "DealAmount:",
        order.DealAmount, "Status:", order.Status, "Type:", order.Type);
}
```

部分交易所不支持```exchange.GetOrder()```函数。返回值`Order`结构中的```AvgPrice```属性为成交均价，部分交易所不支持该字段，若不支持则将其设置为0。

如果使用较旧版本的托管者，```exchange.GetOrder()```函数的参数```orderId```可能与当前文档中描述的```orderId```存在差异。

不支持的交易所：`Web3`。调用时报错并返回空值，所有交易所的对照见`能力矩阵`。

以回退方式支持的交易所：交易所的接口不能完整提供本函数，由托管者补足。

交易所没有对应接口，由托管者实现：

- `Coincheck`：交易所没有查询单个订单的接口，在当前未完成订单中查找；交易所不提供历史订单查询，已成交或已撤销的订单查不到（返回空值）。
- `Zaif`：交易所没有查询单个订单的接口，在当前未完成订单和历史订单中查找该订单。

See also: `Order`, `exchange.GetOrders`, `exchange.GetHistoryOrders`, `exchange.ModifyOrder`

#### exchange.GetOrders

```
exchange.GetOrders()
exchange.GetOrders(symbol)
```

获取当前未完成的订单。

Parameters:

- `symbol` (string, optional): 要查询的品种（例如```BTC_USDT.swap```）或品种范围（例如```USDT.swap```）。不传或传空字符串时，现货交易所对象查询全部品种，期货交易所对象查询当前计价币种与合约类型的范围（例如当前品种为```BTC_USDT.swap```时即```USDT.swap```）。范围写法与缺省范围的完整规则见`品种代码`。

Returns (`Order`数组 / 空值): 成功时返回`Order`结构数组；失败时返回空值。

查询未完成订单（不传参数时按默认范围）并逐条打印。

```javascript
function main() {
    var orders = exchange.GetOrders()
    if (!orders) return    // 获取失败时为null，没有挂单时为空数组
    Log("未完成订单数", orders.length)
    for (var o of orders) {
        Log(o.Symbol, o.Id, "价格", o.Price, "数量", o.Amount, "已成交", o.DealAmount)
    }
}
```

```python
def main():
    orders = exchange.GetOrders()
    if orders is None:
        return
    Log("未完成订单数", len(orders))
    for o in orders:
        Log(o["Symbol"], o["Id"], "价格", o["Price"], "数量", o["Amount"], "已成交", o["DealAmount"])
```

```rust
fn main() {
    let Ok(orders) = exchange.GetOrders(None) else { return };
    Log!("未完成订单数", orders.len());
    for o in &orders {
        Log!(o.Symbol, o.Id, "价格", o.Price, "数量", o.Amount, "已成交", o.DealAmount);
    }
}
```

使用现货交易所对象，针对多个不同的交易对，以当前价格的一半作为下单价格挂出买单，随后查询未成交订单的信息。

```javascript
/*backtest
start: 2024-05-21 00:00:00
end: 2024-09-05 00:00:00
period: 5m
basePeriod: 1m
exchanges: [{"eid":"Binance","currency":"BTC_USDT"}]
*/

function main() {
    var arrSymbol = ["ETH_USDT", "BTC_USDT", "LTC_USDT", "SOL_USDT"]

    for (var symbol of arrSymbol) {
        var t = exchange.GetTicker(symbol)
        exchange.CreateOrder(symbol, "buy", t.Last / 2, 0.01)
    }

    var spotOrders = exchange.GetOrders()

    var tbls = []
    for (var orders of [spotOrders]) {
        var tbl = {type: "table", title: "test GetOrders", cols: ["Symbol", "Id", "Price", "Amount", "DealAmount", "AvgPrice", "Status", "Type", "Offset", "ContractType"], rows: []}
        for (var order of orders) {
            tbl.rows.push([order.Symbol, order.Id, order.Price, order.Amount, order.DealAmount, order.AvgPrice, order.Status, order.Type, order.Offset, order.ContractType])
        }
        tbls.push(tbl)
    }

    LogStatus("`" + JSON.stringify(tbls) +  "`")

    // 打印输出一次信息后返回，防止后续回测时订单成交，影响数据观察
    return
}
```

```python
'''backtest
start: 2024-05-21 00:00:00
end: 2024-09-05 00:00:00
period: 5m
basePeriod: 1m
exchanges: [{"eid":"Binance","currency":"BTC_USDT"}]
'''

import json

def main():
    arrSymbol = ["ETH_USDT", "BTC_USDT", "LTC_USDT", "SOL_USDT"]

    for symbol in arrSymbol:
        t = exchange.GetTicker(symbol)
        exchange.CreateOrder(symbol, "buy", t["Last"] / 2, 0.01)

    spotOrders = exchange.GetOrders()

    tbls = []
    for orders in [spotOrders]:
        tbl = {"type": "table", "title": "test GetOrders", "cols": ["Symbol", "Id", "Price", "Amount", "DealAmount", "AvgPrice", "Status", "Type", "Offset", "ContractType"], "rows": []}
        for order in orders:
            tbl["rows"].append([order.Symbol, order.Id, order.Price, order.Amount, order.DealAmount, order.AvgPrice, order.Status, order.Type, order.Offset, order.ContractType])
        tbls.append(tbl)

    LogStatus("`" + json.dumps(tbls) +  "`")

    return
```

```rust
/*backtest
start: 2024-05-21 00:00:00
end: 2024-09-05 00:00:00
period: 5m
basePeriod: 1m
exchanges: [{"eid":"Binance","currency":"BTC_USDT"}]
*/

fn main() {
    let arrSymbol = ["ETH_USDT", "BTC_USDT", "LTC_USDT", "SOL_USDT"];

    for symbol in arrSymbol {
        let t = exchange.GetTicker(symbol).unwrap();
        let _ = exchange.CreateOrder(symbol, "buy", t.Last / 2.0, 0.01);
    }

    let spotOrders = exchange.GetOrders(None).unwrap();

    // Rust不支持JSON.stringify，使用format!拼接表格的JSON文本
    let mut tbls = Vec::new();
    for orders in [&spotOrders] {
        let mut rows = Vec::new();
        for order in orders {
            rows.push(format!(r#"["{}", "{}", {}, {}, {}, {}, {}, {}, {}, "{}"]"#,
                order.Symbol, order.Id, order.Price, order.Amount, order.DealAmount, order.AvgPrice, order.Status, order.Type, order.Offset, order.ContractType));
        }
        let tbl = format!(r#"{{"type": "table", "title": "test GetOrders", "cols": ["Symbol", "Id", "Price", "Amount", "DealAmount", "AvgPrice", "Status", "Type", "Offset", "ContractType"], "rows": [{}]}}"#,
            rows.join(","));
        tbls.push(tbl);
    }

    LogStatus!(format!("`[{}]`", tbls.join(",")));

    // 打印输出一次信息后返回，防止后续回测时订单成交，影响数据观察
    return;
}
```

使用期货交易所对象，对多个不同交易对、不同合约代码的品种进行下单。下单价格远离盘口对手价，使订单保持未成交状态，并按多种方式查询订单。

```javascript
/*backtest
start: 2024-05-21 00:00:00
end: 2024-09-05 00:00:00
period: 5m
basePeriod: 1m
exchanges: [{"eid":"Futures_Binance","currency":"BTC_USDT"}]
*/

function main() {
    var arrSymbol = ["BTC_USDT.swap", "BTC_USDT.quarter", "ETH_USDT.swap", "ETH_USDT.quarter"]

    for (var symbol of arrSymbol) {
        var t = exchange.GetTicker(symbol)
        exchange.CreateOrder(symbol, "buy", t.Last / 2, 1)
        exchange.CreateOrder(symbol, "sell", t.Last * 2, 1)
    }

    var defaultOrders = exchange.GetOrders()
    var swapOrders = exchange.GetOrders("USDT.swap")
    var futuresOrders = exchange.GetOrders("USDT.futures")
    var btcUsdtSwapOrders = exchange.GetOrders("BTC_USDT.swap")

    var tbls = []
    var arr = [defaultOrders, swapOrders, futuresOrders, btcUsdtSwapOrders]
    var tblDesc = ["defaultOrders", "swapOrders", "futuresOrders", "btcUsdtSwapOrders"]
    for (var index in arr) {
        var orders = arr[index]
        var tbl = {type: "table", title: tblDesc[index], cols: ["Symbol", "Id", "Price", "Amount", "DealAmount", "AvgPrice", "Status", "Type", "Offset", "ContractType"], rows: []}
        for (var order of orders) {
            tbl.rows.push([order.Symbol, order.Id, order.Price, order.Amount, order.DealAmount, order.AvgPrice, order.Status, order.Type, order.Offset, order.ContractType])
        }
        tbls.push(tbl)
    }

    LogStatus("`" + JSON.stringify(tbls) +  "`")

    // 打印输出一次信息后立即返回，防止后续回测过程中订单成交而影响数据观察
    return
}
```

```python
'''backtest
start: 2024-05-21 00:00:00
end: 2024-09-05 00:00:00
period: 5m
basePeriod: 1m
exchanges: [{"eid":"Futures_Binance","currency":"BTC_USDT"}]
'''

import json

def main():
    arrSymbol = ["BTC_USDT.swap", "BTC_USDT.quarter", "ETH_USDT.swap", "ETH_USDT.quarter"]

    for symbol in arrSymbol:
        t = exchange.GetTicker(symbol)
        exchange.CreateOrder(symbol, "buy", t["Last"] / 2, 1)
        exchange.CreateOrder(symbol, "sell", t["Last"] * 2, 1)

    defaultOrders = exchange.GetOrders()
    swapOrders = exchange.GetOrders("USDT.swap")
    futuresOrders = exchange.GetOrders("USDT.futures")
    btcUsdtSwapOrders = exchange.GetOrders("BTC_USDT.swap")

    tbls = []
    arr = [defaultOrders, swapOrders, futuresOrders, btcUsdtSwapOrders]
    tblDesc = ["defaultOrders", "swapOrders", "futuresOrders", "btcUsdtSwapOrders"]
    for index in range(len(arr)):
        orders = arr[index]
        tbl = {"type": "table", "title": tblDesc[index], "cols": ["Symbol", "Id", "Price", "Amount", "DealAmount", "AvgPrice", "Status", "Type", "Offset", "ContractType"], "rows": []}
        for order in orders:
            tbl["rows"].append([order["Symbol"], order["Id"], order["Price"], order["Amount"], order["DealAmount"], order["AvgPrice"], order["Status"], order["Type"], order["Offset"], order["ContractType"]])
        tbls.append(tbl)

    LogStatus("`" + json.dumps(tbls) +  "`")

    return
```

```rust
/*backtest
start: 2024-05-21 00:00:00
end: 2024-09-05 00:00:00
period: 5m
basePeriod: 1m
exchanges: [{"eid":"Futures_Binance","currency":"BTC_USDT"}]
*/

fn main() {
    let arrSymbol = ["BTC_USDT.swap", "BTC_USDT.quarter", "ETH_USDT.swap", "ETH_USDT.quarter"];

    for symbol in arrSymbol {
        let t = exchange.GetTicker(symbol).unwrap();
        let _ = exchange.CreateOrder(symbol, "buy", t.Last / 2.0, 1);
        let _ = exchange.CreateOrder(symbol, "sell", t.Last * 2.0, 1);
    }

    let defaultOrders = exchange.GetOrders(None).unwrap();
    let swapOrders = exchange.GetOrders("USDT.swap").unwrap();
    let futuresOrders = exchange.GetOrders("USDT.futures").unwrap();
    let btcUsdtSwapOrders = exchange.GetOrders("BTC_USDT.swap").unwrap();

    // Rust 不支持 JSON.stringify，此处使用 format! 拼接表格的 JSON 文本
    let mut tbls = Vec::new();
    let arr = [&defaultOrders, &swapOrders, &futuresOrders, &btcUsdtSwapOrders];
    let tblDesc = ["defaultOrders", "swapOrders", "futuresOrders", "btcUsdtSwapOrders"];
    for index in 0..arr.len() {
        let orders = arr[index];
        let mut rows = Vec::new();
        for order in orders {
            rows.push(format!(r#"["{}", "{}", {}, {}, {}, {}, {}, {}, {}, "{}"]"#,
                order.Symbol, order.Id, order.Price, order.Amount, order.DealAmount, order.AvgPrice, order.Status, order.Type, order.Offset, order.ContractType));
        }
        let tbl = format!(r#"{{"type": "table", "title": "{}", "cols": ["Symbol", "Id", "Price", "Amount", "DealAmount", "AvgPrice", "Status", "Type", "Offset", "ContractType"], "rows": [{}]}}"#,
            tblDesc[index], rows.join(","));
        tbls.push(tbl);
    }

    LogStatus!(format!("`[{}]`", tbls.join(",")));

    // 打印输出一次信息后立即返回，防止后续回测过程中订单成交而影响数据观察
    return;
}
```

调用```exchange.GetOrders()```函数时，可传入```Symbol```参数以指定请求特定交易对或合约代码的订单数据。

```javascript
function main() {
    var orders = exchange.GetOrders("BTC_USDT")           // 现货品种示例
    // var orders = exchange.GetOrders("BTC_USDT.swap")   // 期货品种示例
    Log("orders:", orders)
}
```

```python
def main():
    orders = exchange.GetOrders("BTC_USDT")          # 现货品种示例
    # orders = exchange.GetOrders("BTC_USDT.swap")   # 期货品种示例
    Log("orders:", orders)
```

```rust
fn main() {
    let orders = exchange.GetOrders("BTC_USDT");           // 现货品种示例
    // let orders = exchange.GetOrders("BTC_USDT.swap");   // 期货品种示例
    Log!("orders:", orders);
}
```

范围写法（```USDT.swap```、```USD.futures```、```USDT.option```等）与不传```symbol```时的缺省范围见`品种代码`；交易所接口不支持的范围会报错并返回空值。

当交易所对象```exchange```所代表的账户在**查询范围内**或**指定的交易品种**上没有挂单（即处于未成交状态的活动订单）时，调用该函数将返回空数组，即：```[]```。

少数交易所查询未完成订单的接口必须指定品种：在这些交易所上不传```symbol```时只查询当前品种的未完成订单，而不是整个范围。哪些交易所属于这种情况见各交易所页的注意事项（所有交易所的入口见`能力矩阵`）。

不支持的交易所：`OKX_DEX`、`Web3`。调用时报错并返回空值，所有交易所的对照见`能力矩阵`。

See also: `Order`, `exchange.GetOrder`, `exchange.GetHistoryOrders`

#### exchange.GetHistoryOrders

```
exchange.GetHistoryOrders()
exchange.GetHistoryOrders(symbol)
exchange.GetHistoryOrders(symbol, since)
exchange.GetHistoryOrders(symbol, since, limit)
exchange.GetHistoryOrders(since)
exchange.GetHistoryOrders(since, limit)
```

获取当前交易对、合约的历史订单，并支持指定具体的交易品种。

Parameters:

- `symbol` (string, optional): 品种代码，例如现货交易所对象上的```BTC_USDT```、期货交易所对象上的```BTC_USDT.swap```，写法（含期权）见`品种代码`。不传时查询当前交易对、合约代码的历史订单。
- `since` (number, optional): 查询的起始时间戳，单位为毫秒。
- `limit` (number, optional): 查询的订单数量。

Returns (`Order`数组 / 空值): 成功时返回`Order`结构数组；失败时返回空值。

查询当前交易对的历史订单。

```javascript
function main() {
    var historyOrders = exchange.GetHistoryOrders()
    Log(historyOrders)
}
```

```python
def main():
    historyOrders = exchange.GetHistoryOrders()
    Log(historyOrders)
```

```rust
fn main() {
    let historyOrders = exchange.GetHistoryOrders(None, None, None);
    Log!(historyOrders);
}
```

- 未指定```symbol```、```since```、```limit```参数时，默认查询当前交易对、合约的历史订单，即查询距当前时间最近的一定范围内的历史订单，具体查询范围取决于交易所接口的单次查询范围。

- 指定```symbol```参数时，查询所设置交易品种的历史订单。

- 指定```since```参数时，以```since```时间戳为起始时间，向当前时间方向查询。

- 指定```limit```参数时，查询到足够条数后返回。

- 该函数仅支持提供历史订单查询接口的交易所。

不支持的交易所：`Bitstamp`、`Coincheck`、`Uniswap`、`Jupiter`、`KyberSwap`、`OneInch`、`OKX_DEX`、`Futures_IB`、`Web3`。调用时报错并返回空值，所有交易所的对照见`能力矩阵`。

See also: `Order`, `exchange.GetOrder`, `exchange.GetOrders`

#### exchange.CreateConditionOrder

```
exchange.CreateConditionOrder(symbol, side, amount, condition)
exchange.CreateConditionOrder(symbol, side, amount, condition, ...args)
```

创建条件单。条件单是一种在满足特定触发条件时自动执行的订单类型。

Parameters:

- `symbol` (string, required): 条件单的品种，例如现货交易所对象上的```BTC_USDT```、期货交易所对象上的```BTC_USDT.swap```，写法（含期权）见`品种代码`。
- `side` (string, required): 交易方向：现货为```buy```（买入）、```sell```（卖出）；期货为```buy```（开多）、```sell```（开空）、```closebuy```（平多）、```closesell```（平空）。可以附带交易所特定参数，见备注。
- `amount` (number, required): 条件单的下单量。需要注意当订单为**现货市价单买单**时，下单量为买入金额；个别现货交易所的市价买单下单量为交易币数量而不是金额，见各交易所页的注意事项。对于期货交易所对象，下单量参数```amount```均为合约张数。
- `condition` (object, required): 条件单的触发条件和执行价格，结构见`Condition`；各条件类型必须传入的价格见备注。
- `arg` (string / number / bool / object / array / any, optional): 扩展参数，```arg```参数可以传多个。字符串、数字等参数会输出到这条条件单日志中（多个参数以空格连接）。对象参数不会输出到日志，而是作为附加参数传给交易所接口（与```side```参数中的附加参数合并）。

Returns (string / 空值): 创建条件单成功返回条件单Id，创建失败返回空值。条件单Id格式与普通订单Id类似，由交易所品种代码和交易所原始条件单Id组成，以英文逗号间隔。

创建止盈单（TP）：当价格涨到目标价位时自动卖出。

```javascript
function main() {
    // 创建止盈单：当BTC_USDT价格涨到65000时，以65000价格卖出0.01个BTC
    var condition = {
        ConditionType: ORDER_CONDITION_TYPE_TP,  // 止盈单
        TpTriggerPrice: 65000,   // 触发价格
        TpOrderPrice: 65000      // 执行价格，也可以设置为-1表示市价单
    }
    var id = exchange.CreateConditionOrder("BTC_USDT", "sell", 0.01, condition)
    Log("TP order Id:", id)
}
```

```python
def main():
    # 创建止盈单：当BTC_USDT价格涨到65000时，以65000价格卖出0.01个BTC
    condition = {
        "ConditionType": ORDER_CONDITION_TYPE_TP,  # 止盈单
        "TpTriggerPrice": 65000,   # 触发价格
        "TpOrderPrice": 65000      # 执行价格，也可以设置为-1表示市价单
    }
    id = exchange.CreateConditionOrder("BTC_USDT", "sell", 0.01, condition)
    Log("TP order Id:", id)
```

```rust
fn main() {
    // 创建止盈单：当BTC_USDT价格涨到65000时，以65000价格卖出0.01个BTC
    let condition = OrderCondition {
        ConditionType: ORDER_CONDITION_TYPE_TP,  // 止盈单
        TpTriggerPrice: 65000.0,   // 触发价格
        TpOrderPrice: 65000.0,     // 执行价格，也可以设置为-1表示市价单
        ..Default::default()
    };
    let id = exchange.CreateConditionOrder("BTC_USDT", "sell", 0.01, &condition);
    Log!("TP order Id:", id);
}
```

创建止损单（SL）：当价格跌到止损价位时自动卖出。

```javascript
function main() {
    // 创建止损单：当BTC_USDT价格跌到58000时，以市价卖出0.01个BTC
    var condition = {
        ConditionType: ORDER_CONDITION_TYPE_SL,  // 止损单
        SlTriggerPrice: 58000,   // 触发价格
        SlOrderPrice: -1         // -1表示市价单
    }
    var id = exchange.CreateConditionOrder("BTC_USDT", "sell", 0.01, condition)
    Log("SL order Id:", id)
}
```

```python
def main():
    # 创建止损单：当BTC_USDT价格跌到58000时，以市价卖出0.01个BTC
    condition = {
        "ConditionType": ORDER_CONDITION_TYPE_SL,  # 止损单
        "SlTriggerPrice": 58000,   # 触发价格
        "SlOrderPrice": -1         # -1表示市价单
    }
    id = exchange.CreateConditionOrder("BTC_USDT", "sell", 0.01, condition)
    Log("SL order Id:", id)
```

```rust
fn main() {
    // 创建止损单：当BTC_USDT价格跌到58000时，以市价卖出0.01个BTC
    let condition = OrderCondition {
        ConditionType: ORDER_CONDITION_TYPE_SL,  // 止损单
        SlTriggerPrice: 58000.0,   // 触发价格
        SlOrderPrice: -1.0,        // -1表示市价单
        ..Default::default()
    };
    let id = exchange.CreateConditionOrder("BTC_USDT", "sell", 0.01, &condition);
    Log!("SL order Id:", id);
}
```

创建OCO订单：同时设置止盈和止损，任意一个触发后另一个自动取消。

```javascript
function main() {
    // 创建OCO订单：止盈价65000，止损价58000
    var condition = {
        ConditionType: ORDER_CONDITION_TYPE_OCO,  // OCO订单
        TpTriggerPrice: 65000,   // 止盈触发价格
        TpOrderPrice: 65000,     // 止盈执行价格
        SlTriggerPrice: 58000,   // 止损触发价格
        SlOrderPrice: 58000      // 止损执行价格
    }
    var id = exchange.CreateConditionOrder("BTC_USDT", "sell", 0.01, condition)
    Log("OCO order Id:", id)
}
```

```python
def main():
    # 创建OCO订单：止盈价65000，止损价58000
    condition = {
        "ConditionType": ORDER_CONDITION_TYPE_OCO,  # OCO订单
        "TpTriggerPrice": 65000,   # 止盈触发价格
        "TpOrderPrice": 65000,     # 止盈执行价格
        "SlTriggerPrice": 58000,   # 止损触发价格
        "SlOrderPrice": 58000      # 止损执行价格
    }
    id = exchange.CreateConditionOrder("BTC_USDT", "sell", 0.01, condition)
    Log("OCO order Id:", id)
```

```rust
fn main() {
    // 创建OCO订单：止盈价65000，止损价58000
    let condition = OrderCondition {
        ConditionType: ORDER_CONDITION_TYPE_OCO,  // OCO订单
        TpTriggerPrice: 65000.0,   // 止盈触发价格
        TpOrderPrice: 65000.0,     // 止盈执行价格
        SlTriggerPrice: 58000.0,   // 止损触发价格
        SlOrderPrice: 58000.0      // 止损执行价格
    };
    let id = exchange.CreateConditionOrder("BTC_USDT", "sell", 0.01, &condition);
    Log!("OCO order Id:", id);
}
```

使用附加参数（option）创建条件单，传递交易所特定参数。

```javascript
function main() {
    // 使用JSON格式传递option参数
    var option = {
        "type": "TRAILING_STOP_MARKET",
        "activatePrice": "300",
        "callbackRate": "0.1"
    }
    var sideWithOption = "buy;" + JSON.stringify(option)
    var condition = {
        ConditionType: ORDER_CONDITION_TYPE_TP,
        TpTriggerPrice: 77,
        TpOrderPrice: 71
    }
    var id = exchange.CreateConditionOrder("SOL_USDT.swap", sideWithOption, 1, condition)
    Log("Condition Order Id:", id)

    Sleep(2000)
    Log(exchange.GetConditionOrder(id))
}
```

```python
import json

def main():
    # 使用JSON格式传递option参数
    option = {
        "type": "TRAILING_STOP_MARKET",
        "activatePrice": "300",
        "callbackRate": "0.1"
    }
    sideWithOption = "buy;" + json.dumps(option)
    condition = {
        "ConditionType": ORDER_CONDITION_TYPE_TP,
        "TpTriggerPrice": 77,
        "TpOrderPrice": 71
    }
    id = exchange.CreateConditionOrder("SOL_USDT.swap", sideWithOption, 1, condition)
    Log("Condition Order Id:", id)

    Sleep(2000)
    Log(exchange.GetConditionOrder(id))
```

```rust
fn main() {
    // 使用JSON格式传递option参数（Rust无JSON序列化，直接用原始字符串构造）
    let option = r#"{"type": "TRAILING_STOP_MARKET", "activatePrice": "300", "callbackRate": "0.1"}"#;
    let sideWithOption = format!("buy;{}", option);
    let condition = OrderCondition {
        ConditionType: ORDER_CONDITION_TYPE_TP,
        TpTriggerPrice: 77.0,
        TpOrderPrice: 71.0,
        ..Default::default()
    };
    let id = exchange.CreateConditionOrder("SOL_USDT.swap", &sideWithOption, 1, &condition).unwrap();
    Log!("Condition Order Id:", id);

    Sleep(2000);
    Log!(exchange.GetConditionOrder(&id));
}
```

条件单功能支持情况取决于具体交易所，部分交易所可能不支持条件单功能。

条件单在触发前不会占用账户资金，触发后才会实际下单并占用资金。

不同交易所对条件单的支持程度和具体参数可能有所差异，使用前请查阅对应交易所的API文档。

支持通过```side```参数传递附加参数（option），用于传递交易所特定的参数。附加参数需要与```side```参数合并传入，格式为```"side;{JSON对象}"```（推荐）或```"side;key=value&key=value"```（URL编码格式）。例如：```"buy;{\"type\":\"TRAILING_STOP_MARKET\"}"```。

不同交易所支持的option参数不同，具体支持的参数取决于交易所API文档。常见的参数包括：订单类型（type）、生效规则（timeInForce）、触发价格（activatePrice）、回调比率（callbackRate）等。

使用option参数时，```amount```和```condition```参数仍然需要提供。如果交易所API中的某些参数已通过option传递，这些基础参数可能会被option中的对应参数覆盖，具体行为取决于交易所API实现。

```side```参数可以附带交易所特定的参数，用于传递交易所特定的参数（如订单类型、生效规则）：写成```"side;{JSON对象}"```或```"side;key=value&key=value"```，例如```"buy;{\"type\":\"TRAILING_STOP_MARKET\",\"activatePrice\":\"300\"}"```或```"buy;type=TRAILING_STOP_MARKET&activatePrice=300"```。具体支持的参数取决于交易所API。

```condition```的```ConditionType```取`ORDER_CONDITION_TYPE`中的OCO、TP、SL；`ORDER_CONDITION_TYPE_GENERIC`只出现在查询结果中（如追踪止损等交易所特有的条件单），创建或修改条件单时不能使用，传入会报错并返回空值。所选类型用到的触发价格和执行价格都必须传入且不能为0（OCO需要全部四项，TP需要止盈的两项，SL需要止损的两项），否则报错并返回空值；执行价格为-1表示触发后以市价单执行。

不支持的交易所：`AscendEx`、`Bithumb`、`Bitstamp`、`Coinw`、`DigiFinex`、`Futures_DigiFinex`、`Gemini`、`HashKey`、`Korbit`、`LBank`、`MEXC`、`Upbit`、`WEEX`、`Zaif`、`Hyperliquid`、`Pendle`、`Uniswap`、`Jupiter`、`KyberSwap`、`OneInch`、`OKX_DEX`、`Futures_Polymarket`、`Futures_Futu`、`Futures_IB`、`Exchange`、`Web3`。调用时报错并返回空值，所有交易所的对照见`能力矩阵`。

See also: `Condition`, `exchange.CancelConditionOrder`, `exchange.GetConditionOrder`, `exchange.GetConditionOrders`, `exchange.ModifyConditionOrder`

#### exchange.ModifyConditionOrder

```
exchange.ModifyConditionOrder(orderId, side, amount, condition)
```

修改现有的条件单，可以修改条件单的数量、触发条件和执行价格。支持通过附加参数修改条件单的其它属性（取决于交易所API支持）。

Parameters:

- `orderId` (string, required): 要修改的原条件单ID。条件单ID格式与`exchange.CreateConditionOrder`函数返回的条件单ID一致，由交易所品种代码和交易所原始条件单Id组成，以英文逗号间隔。例如：```"SOL-USDT-SWAP,3196255845130256384"```。
- `side` (string, required): 交易方向：现货为```buy```（买入）、```sell```（卖出）；期货为```buy```（开多）、```sell```（开空）、```closebuy```（平多）、```closesell```（平空）。可以附带交易所特定参数，见备注。
- `amount` (number, required): 条件单的新下单量。必须传入大于0的数量，传入-1等无效值会报错并返回空值。对于期货交易所对象，下单量参数```amount```均为合约张数。
- `condition` (object, required): 条件单新的触发条件和执行价格，结构见`Condition`；各条件类型必须传入的价格见备注。

Returns (string / 空值): 修改条件单成功返回条件单Id，修改失败返回空值。返回的条件单ID可能与原条件单ID相同，也可能不同，这取决于交易所API的实现方式。某些交易所修改条件单后会返回新的条件单ID，而有些交易所保持条件单ID不变。

修改条件单的数量和触发条件。

```javascript
function main() {
    // 创建一个止盈条件单
    var condition = {
        ConditionType: ORDER_CONDITION_TYPE_TP,
        TpTriggerPrice: 77,
        TpOrderPrice: 76
    }
    var id = exchange.CreateConditionOrder("SOL_USDT.swap", "buy", 1, condition)
    Log("Original Condition Order ID:", id)
    Sleep(2000)

    // 查询原条件单信息
    var order = exchange.GetConditionOrder(id)
    Log("Original Condition Order Info:", order)
    Sleep(1000)

    // 修改条件单的数量和触发条件
    var newCondition = {
        ConditionType: ORDER_CONDITION_TYPE_TP,
        TpTriggerPrice: 75,
        TpOrderPrice: 71
    }
    var newId = exchange.ModifyConditionOrder(id, "buy", 2, newCondition)
    Log("Modified Condition Order ID:", newId)
    Sleep(2000)

    // 查询修改后的条件单信息
    var newOrder = exchange.GetConditionOrder(newId)
    Log("Modified Condition Order Info:", newOrder)

    // 取消条件单
    exchange.CancelConditionOrder(newId)
}
```

```python
def main():
    # 创建一个止盈条件单
    condition = {
        "ConditionType": ORDER_CONDITION_TYPE_TP,
        "TpTriggerPrice": 77,
        "TpOrderPrice": 76
    }
    id = exchange.CreateConditionOrder("SOL_USDT.swap", "buy", 1, condition)
    Log("Original Condition Order ID:", id)
    Sleep(2000)

    # 查询原条件单信息
    order = exchange.GetConditionOrder(id)
    Log("Original Condition Order Info:", order)
    Sleep(1000)

    # 修改条件单的数量和触发条件
    newCondition = {
        "ConditionType": ORDER_CONDITION_TYPE_TP,
        "TpTriggerPrice": 75,
        "TpOrderPrice": 71
    }
    newId = exchange.ModifyConditionOrder(id, "buy", 2, newCondition)
    Log("Modified Condition Order ID:", newId)
    Sleep(2000)

    # 查询修改后的条件单信息
    newOrder = exchange.GetConditionOrder(newId)
    Log("Modified Condition Order Info:", newOrder)

    # 取消条件单
    exchange.CancelConditionOrder(newId)
```

```rust
fn main() {
    // 创建一个止盈条件单
    let condition = OrderCondition {
        ConditionType: ORDER_CONDITION_TYPE_TP,
        TpTriggerPrice: 77.0,
        TpOrderPrice: 76.0,
        ..Default::default()
    };
    let id = exchange.CreateConditionOrder("SOL_USDT.swap", "buy", 1, &condition).unwrap();
    Log!("Original Condition Order ID:", id);
    Sleep(2000);

    // 查询原条件单信息
    let order = exchange.GetConditionOrder(&id);
    Log!("Original Condition Order Info:", order);
    Sleep(1000);

    // 修改条件单的数量和触发条件
    let newCondition = OrderCondition {
        ConditionType: ORDER_CONDITION_TYPE_TP,
        TpTriggerPrice: 75.0,
        TpOrderPrice: 71.0,
        ..Default::default()
    };
    let newId = exchange.ModifyConditionOrder(&id, "buy", 2, &newCondition).unwrap();
    Log!("Modified Condition Order ID:", newId);
    Sleep(2000);

    // 查询修改后的条件单信息
    let newOrder = exchange.GetConditionOrder(&newId);
    Log!("Modified Condition Order Info:", newOrder);

    // 取消条件单
    let _ = exchange.CancelConditionOrder(&newId);
}
```

使用附加参数（option）修改条件单的触发价格类型。

```javascript
function main() {
    // 创建一个止盈条件单
    var condition = {
        ConditionType: ORDER_CONDITION_TYPE_TP,
        TpTriggerPrice: 77,
        TpOrderPrice: 76
    }
    var id = exchange.CreateConditionOrder("SOL_USDT.swap", "buy", 1, condition)
    Log("Original Condition Order ID:", id)
    Sleep(2000)

    // 修改条件单，并设置触发价格类型为指数价格（index）
    // 通过side参数传递附加参数（JSON格式）
    var option = {"newTpTriggerPxType": "index"}
    var sideWithOption = "buy;" + JSON.stringify(option)

    var newCondition = {
        ConditionType: ORDER_CONDITION_TYPE_TP,
        TpTriggerPrice: 75,
        TpOrderPrice: 71
    }
    var newId = exchange.ModifyConditionOrder(id, sideWithOption, 2, newCondition)
    Log("Modified Condition Order ID:", newId)
    Sleep(2000)

    // 查询修改后的条件单信息
    var newOrder = exchange.GetConditionOrder(newId)
    Log("Modified Condition Order Info:", newOrder)

    // 取消条件单
    exchange.CancelConditionOrder(newId)
}
```

```python
import json

def main():
    # 创建一个止盈条件单
    condition = {
        "ConditionType": ORDER_CONDITION_TYPE_TP,
        "TpTriggerPrice": 77,
        "TpOrderPrice": 76
    }
    id = exchange.CreateConditionOrder("SOL_USDT.swap", "buy", 1, condition)
    Log("Original Condition Order ID:", id)
    Sleep(2000)

    # 修改条件单，并设置触发价格类型为指数价格（index）
    # 通过side参数传递附加参数（JSON格式）
    option = {"newTpTriggerPxType": "index"}
    sideWithOption = "buy;" + json.dumps(option)

    newCondition = {
        "ConditionType": ORDER_CONDITION_TYPE_TP,
        "TpTriggerPrice": 75,
        "TpOrderPrice": 71
    }
    newId = exchange.ModifyConditionOrder(id, sideWithOption, 2, newCondition)
    Log("Modified Condition Order ID:", newId)
    Sleep(2000)

    # 查询修改后的条件单信息
    newOrder = exchange.GetConditionOrder(newId)
    Log("Modified Condition Order Info:", newOrder)

    # 取消条件单
    exchange.CancelConditionOrder(newId)
```

```rust
fn main() {
    // 创建一个止盈条件单
    let condition = OrderCondition {
        ConditionType: ORDER_CONDITION_TYPE_TP,
        TpTriggerPrice: 77.0,
        TpOrderPrice: 76.0,
        ..Default::default()
    };
    let id = exchange.CreateConditionOrder("SOL_USDT.swap", "buy", 1, &condition).unwrap();
    Log!("Original Condition Order ID:", id);
    Sleep(2000);

    // 修改条件单，并设置触发价格类型为指数价格（index）
    // 通过side参数传递附加参数（JSON格式，Rust无JSON序列化，直接用原始字符串构造）
    let sideWithOption = r#"buy;{"newTpTriggerPxType": "index"}"#;

    let newCondition = OrderCondition {
        ConditionType: ORDER_CONDITION_TYPE_TP,
        TpTriggerPrice: 75.0,
        TpOrderPrice: 71.0,
        ..Default::default()
    };
    let newId = exchange.ModifyConditionOrder(&id, sideWithOption, 2, &newCondition).unwrap();
    Log!("Modified Condition Order ID:", newId);
    Sleep(2000);

    // 查询修改后的条件单信息
    let newOrder = exchange.GetConditionOrder(&newId);
    Log!("Modified Condition Order Info:", newOrder);

    // 取消条件单
    let _ = exchange.CancelConditionOrder(&newId);
}
```

```exchange.ModifyConditionOrder()```函数返回的条件单ID根据交易所API实现不同可能有不同行为。有些交易所API返回的条件单ID会更新，有些则保持不变。建议使用返回的新条件单ID进行后续操作。

```exchange.ModifyConditionOrder()```函数会先校验参数：数量必须大于0，所选条件类型用到的触发价格和执行价格不能为0，不满足时报错并返回空值，不会提交给交易所。

支持通过```side```参数传递附加参数（option），用于修改条件单的其它属性。附加参数需要与```side```参数合并传入，格式为```"side;{JSON对象}"```（推荐）或```"side;key=value"```（URL编码格式）。例如修改触发价格类型：```"buy;{\"newTpTriggerPxType\":\"index\"}"```。

```condition```参数中的```TpOrderPrice```或```SlOrderPrice```设置为-1表示触发后以市价执行。能否通过修改在限价与市价之间切换取决于交易所：有些交易所（例如`Lighter`）不能改变限价/市价类型，限价条件单传-1或市价条件单传正数执行价格时报错，需要撤销后重新创建，具体见各交易所页。

修改条件单时，条件单的其它属性（如条件类型、持仓模式、账户模式、杠杆等）通常会保留原条件单的设置。如果需要修改这些属性，可以通过附加参数（option）传入，前提是交易所API支持。

可以通过附加参数修改触发价格类型，例如将触发价格类型从最新价（last）修改为指数价格（index）或标记价格（mark）。具体参数名称和支持情况取决于交易所API文档。

并非所有交易所都支持修改条件单：不支持的交易所调用时报错并返回空值，需要先撤销原条件单再重新创建；支持修改的交易所也可能只支持修改部分参数（例如只支持某类合约或某种账户模式）。不支持的交易所见本页的「不支持的交易所」名单，所有交易所的对照见`能力矩阵`，限制条件见各交易所页。

```side```参数可以附带交易所特定的参数，用于修改条件单的其它属性（如触发价格类型）：写成```"side;{JSON对象}"```或```"side;key=value&key=value"```，例如```"buy;{\"newTpTriggerPxType\":\"index\"}"```或```"buy;newTpTriggerPxType=index"```。具体支持的参数取决于交易所API。

```condition```的```ConditionType```取`ORDER_CONDITION_TYPE`中的OCO、TP、SL；`ORDER_CONDITION_TYPE_GENERIC`只出现在查询结果中（如追踪止损等交易所特有的条件单），创建或修改条件单时不能使用，传入会报错并返回空值。所选类型用到的触发价格和执行价格都必须传入且不能为0（OCO需要全部四项，TP需要止盈的两项，SL需要止损的两项），否则报错并返回空值；执行价格为-1表示触发后以市价单执行。

仅以下交易所支持：`Binance`、`Bitfinex`、`Futures_Bitfinex`、`Bitget`、`Futures_Bitget`、`Bybit`、`Futures_Bybit`、`Crypto`、`Futures_Crypto`、`DeepCoin`、`Futures_DeepCoin`、`Futures_Deribit`、`Futures_GateIO`、`HitBTC`、`Kraken`、`Futures_Kraken`、`OKEX`、`Futures_OKCoin`、`Futures_WEEX`、`WOO`、`Futures_WOO`、`Futures_Hyperliquid`、`Futures_Lighter`、`Futures_Aevo`、`Futures_WOOFi`。其余交易所调用时报错并返回空值，所有交易所的对照见`能力矩阵`。

See also: `Condition`, `exchange.CreateConditionOrder`, `exchange.CancelConditionOrder`, `exchange.GetConditionOrder`, `exchange.GetConditionOrders`

#### exchange.CancelConditionOrder

```
exchange.CancelConditionOrder(conditionOrderId)
exchange.CancelConditionOrder(conditionOrderId, ...args)
```

取消条件单。条件单Id的格式与普通订单Id类似，由交易所品种代码和交易所原始条件单Id组成，两者以英文逗号分隔。

调用```exchange.CancelConditionOrder()```函数撤销条件单时，传入的```conditionOrderId```参数与条件单结构的```Id```属性一致。

Parameters:

- `conditionOrderId` (string, required): 要取消的条件单。
- `arg` (string / number / bool / object / array / any, optional): 扩展参数，用于向该条撤销条件单的日志中输出附带信息，```arg```参数可以传入多个。

Returns (bool): 返回真值（例如```true```）表示撤销条件单的请求发送成功，返回假值（例如```false```）表示撤销条件单的请求发送失败。

撤销条件单。

```javascript
function main(){
    // 创建止损条件单
    var condition = {
        ConditionType: ORDER_CONDITION_TYPE_SL,
        SlTriggerPrice: 58000,
        SlOrderPrice: -1  // 市价单
    }
    var id = exchange.CreateConditionOrder("BTC_USDT", "sell", 0.01, condition)
    Sleep(1000)
    exchange.CancelConditionOrder(id)
}
```

```python
def main():
    # 创建止损条件单
    condition = {
        "ConditionType": ORDER_CONDITION_TYPE_SL,
        "SlTriggerPrice": 58000,
        "SlOrderPrice": -1  # 市价单
    }
    id = exchange.CreateConditionOrder("BTC_USDT", "sell", 0.01, condition)
    Sleep(1000)
    exchange.CancelConditionOrder(id)
```

```rust
fn main() {
    // 创建止损条件单
    let condition = OrderCondition {
        ConditionType: ORDER_CONDITION_TYPE_SL,
        SlTriggerPrice: 58000.0,
        SlOrderPrice: -1.0,  // 市价单
        ..Default::default()
    };
    let id = exchange.CreateConditionOrder("BTC_USDT", "sell", 0.01, &condition).unwrap();
    Sleep(1000);
    let _ = exchange.CancelConditionOrder(&id);
}
```

批量取消条件单，并附带输出条件单信息。

```javascript
function main() {
    // 创建几个条件单
    var condition1 = {
        ConditionType: ORDER_CONDITION_TYPE_TP,
        TpTriggerPrice: 65000,
        TpOrderPrice: 65000
    }
    exchange.CreateConditionOrder("BTC_USDT", "sell", 0.01, condition1)

    var condition2 = {
        ConditionType: ORDER_CONDITION_TYPE_SL,
        SlTriggerPrice: 58000,
        SlOrderPrice: 58000
    }
    exchange.CreateConditionOrder("BTC_USDT", "sell", 0.01, condition2)
    Sleep(1000)

    var orders = exchange.GetConditionOrders()
    for (var i = 0 ; i < orders.length ; i++) {
        exchange.CancelConditionOrder(orders[i].Id, "Canceled condition order:", orders[i])
        Sleep(500)
    }
}
```

```python
def main():
    # 创建几个条件单
    condition1 = {
        "ConditionType": ORDER_CONDITION_TYPE_TP,
        "TpTriggerPrice": 65000,
        "TpOrderPrice": 65000
    }
    exchange.CreateConditionOrder("BTC_USDT", "sell", 0.01, condition1)

    condition2 = {
        "ConditionType": ORDER_CONDITION_TYPE_SL,
        "SlTriggerPrice": 58000,
        "SlOrderPrice": 58000
    }
    exchange.CreateConditionOrder("BTC_USDT", "sell", 0.01, condition2)
    Sleep(1000)

    orders = exchange.GetConditionOrders()
    for i in range(len(orders)):
        exchange.CancelConditionOrder(orders[i]["Id"], "Canceled condition order:", orders[i])
        Sleep(500)
```

```rust
fn main() {
    // 创建几个条件单
    let condition1 = OrderCondition {
        ConditionType: ORDER_CONDITION_TYPE_TP,
        TpTriggerPrice: 65000.0,
        TpOrderPrice: 65000.0,
        ..Default::default()
    };
    let _ = exchange.CreateConditionOrder("BTC_USDT", "sell", 0.01, &condition1);

    let condition2 = OrderCondition {
        ConditionType: ORDER_CONDITION_TYPE_SL,
        SlTriggerPrice: 58000.0,
        SlOrderPrice: 58000.0,
        ..Default::default()
    };
    let _ = exchange.CreateConditionOrder("BTC_USDT", "sell", 0.01, &condition2);
    Sleep(1000);

    let orders = exchange.GetConditionOrders(None).unwrap();
    for i in 0..orders.len() {
        // Rust中CancelConditionOrder不支持扩展参数，附带信息用Log输出
        let _ = exchange.CancelConditionOrder(&orders[i].Id);
        Log!("Canceled condition order:", orders[i]);
        Sleep(500);
    }
}
```

```exchange.CancelConditionOrder()```函数的返回值仅代表撤销请求发送成功或失败。如需判断交易所是否已取消该条件单，可以调用```exchange.GetConditionOrders()```函数进行确认。

只有未触发的条件单可以被取消；已经触发并转为普通订单的条件单无法通过此函数取消。

不支持的交易所：`AscendEx`、`Bithumb`、`Bitstamp`、`Coinw`、`DigiFinex`、`Futures_DigiFinex`、`Gemini`、`HashKey`、`Korbit`、`LBank`、`MEXC`、`Upbit`、`WEEX`、`Zaif`、`Hyperliquid`、`Pendle`、`Uniswap`、`Jupiter`、`KyberSwap`、`OneInch`、`OKX_DEX`、`Futures_Polymarket`、`Futures_Futu`、`Futures_IB`、`Exchange`、`Web3`。调用时报错并返回空值，所有交易所的对照见`能力矩阵`。

See also: `exchange.CreateConditionOrder`, `exchange.GetConditionOrder`, `exchange.GetConditionOrders`, `exchange.ModifyConditionOrder`

#### exchange.GetConditionOrder

```
exchange.GetConditionOrder(conditionOrderId)
```

获取指定条件单的信息。

Parameters:

- `conditionOrderId` (string, required): 要查询的条件单。条件单Id的格式与普通订单Id类似，由交易所品种代码和交易所原始条件单Id组成，两者之间以英文逗号分隔。

调用```exchange.GetConditionOrder()```函数查询条件单时传入的```conditionOrderId```参数与条件单结构的```Id```属性一致。

Returns (`Order` / 空值): 根据条件单号查询条件单详情，查询成功时返回`Order`结构，查询失败时返回空值。

返回的Order结构中包含`Condition`字段，该字段包含条件单的详细配置信息（触发价格、执行价格、条件类型等）。

创建止盈条件单后按条件单Id查询其信息。

```javascript
function main(){
    // 创建止盈条件单
    var condition = {
        ConditionType: ORDER_CONDITION_TYPE_TP,
        TpTriggerPrice: 65000,
        TpOrderPrice: 65000
    }
    var id = exchange.CreateConditionOrder("BTC_USDT", "sell", 0.01, condition)
    Sleep(1000)

    // 参数id为条件单号码，需填入你想要查询的条件单的号码
    var order = exchange.GetConditionOrder(id)
    Log("Id:", order.Id, "Price:", order.Price, "Amount:", order.Amount,
        "Status:", order.Status, "Type:", order.Type, "Condition:", order.Condition)
}
```

```python
def main():
    # 创建止盈条件单
    condition = {
        "ConditionType": ORDER_CONDITION_TYPE_TP,
        "TpTriggerPrice": 65000,
        "TpOrderPrice": 65000
    }
    id = exchange.CreateConditionOrder("BTC_USDT", "sell", 0.01, condition)
    Sleep(1000)

    order = exchange.GetConditionOrder(id)
    Log("Id:", order["Id"], "Price:", order["Price"], "Amount:", order["Amount"],
        "Status:", order["Status"], "Type:", order["Type"], "Condition:", order["Condition"])
```

```rust
fn main() {
    // 创建止盈条件单
    let condition = OrderCondition {
        ConditionType: ORDER_CONDITION_TYPE_TP,
        TpTriggerPrice: 65000.0,
        TpOrderPrice: 65000.0,
        ..Default::default()
    };
    let id = exchange.CreateConditionOrder("BTC_USDT", "sell", 0.01, &condition).unwrap();
    Sleep(1000);

    // 参数id为条件单号码，需填入你想要查询的条件单的号码
    let order = exchange.GetConditionOrder(&id).unwrap();
    Log!("Id:", order.Id, "Price:", order.Price, "Amount:", order.Amount,
        "Status:", order.Status, "Type:", order.Type, "Condition:", order.Condition);
}
```

部分交易所不支持```exchange.GetConditionOrder()```函数。

返回的条件单结构包含触发条件、触发价格、订单状态等信息。

条件单状态包括：未触发、已触发、已取消等，具体的状态值由交易所而定。

不支持的交易所：`AscendEx`、`Bithumb`、`Bitstamp`、`Coinw`、`DigiFinex`、`Futures_DigiFinex`、`Gemini`、`HashKey`、`Korbit`、`LBank`、`MEXC`、`Upbit`、`WEEX`、`Zaif`、`Hyperliquid`、`Pendle`、`Uniswap`、`Jupiter`、`KyberSwap`、`OneInch`、`OKX_DEX`、`Futures_Polymarket`、`Futures_Futu`、`Futures_IB`、`Exchange`、`Web3`。调用时报错并返回空值，所有交易所的对照见`能力矩阵`。

See also: `Order`, `exchange.GetConditionOrders`, `exchange.GetHistoryConditionOrders`, `exchange.ModifyConditionOrder`

#### exchange.GetConditionOrders

```
exchange.GetConditionOrders()
exchange.GetConditionOrders(symbol)
```

获取未完成的条件单（尚未触发或尚未取消的条件单）。

Parameters:

- `symbol` (string, optional): 要查询的品种（例如```BTC_USDT.swap```）或品种范围（例如```USDT.swap```）。不传或传空字符串时，现货交易所对象查询全部品种，期货交易所对象查询当前计价币种与合约类型的范围（例如当前品种为```BTC_USDT.swap```时即```USDT.swap```）。范围写法与缺省范围的完整规则见`品种代码`。

Returns (`Order`数组 / 空值): 成功时返回`Order`结构数组；失败时返回空值。

返回的Order结构中包含`Condition`字段，该字段包含条件单的详细配置信息（触发价格、执行价格、条件类型等）。

使用现货交易所对象创建多个条件单，然后查询未完成的条件单信息。

```javascript
function main() {
    // 创建多个条件单
    var condition1 = {
        ConditionType: ORDER_CONDITION_TYPE_TP,
        TpTriggerPrice: 65000,
        TpOrderPrice: 65000
    }
    exchange.CreateConditionOrder("BTC_USDT", "sell", 0.01, condition1)

    var condition2 = {
        ConditionType: ORDER_CONDITION_TYPE_TP,
        TpTriggerPrice: 3200,
        TpOrderPrice: 3200
    }
    exchange.CreateConditionOrder("ETH_USDT", "sell", 0.1, condition2)
    Sleep(1000)

    // 查询所有未完成条件单
    var orders = exchange.GetConditionOrders()
    Log("Pending condition orders count:", orders.length)
    for (var i = 0; i < orders.length; i++) {
        Log("Condition order", i+1, ":", orders[i])
    }
}
```

```python
def main():
    # 创建多个条件单
    condition1 = {
        "ConditionType": ORDER_CONDITION_TYPE_TP,
        "TpTriggerPrice": 65000,
        "TpOrderPrice": 65000
    }
    exchange.CreateConditionOrder("BTC_USDT", "sell", 0.01, condition1)

    condition2 = {
        "ConditionType": ORDER_CONDITION_TYPE_TP,
        "TpTriggerPrice": 3200,
        "TpOrderPrice": 3200
    }
    exchange.CreateConditionOrder("ETH_USDT", "sell", 0.1, condition2)
    Sleep(1000)

    # 查询所有未完成条件单
    orders = exchange.GetConditionOrders()
    Log("Pending condition orders count:", len(orders))
    for i in range(len(orders)):
        Log("Condition order", i+1, ":", orders[i])
```

```rust
fn main() {
    // 创建多个条件单
    let condition1 = OrderCondition {
        ConditionType: ORDER_CONDITION_TYPE_TP,
        TpTriggerPrice: 65000.0,
        TpOrderPrice: 65000.0,
        ..Default::default()
    };
    let _ = exchange.CreateConditionOrder("BTC_USDT", "sell", 0.01, &condition1);

    let condition2 = OrderCondition {
        ConditionType: ORDER_CONDITION_TYPE_TP,
        TpTriggerPrice: 3200.0,
        TpOrderPrice: 3200.0,
        ..Default::default()
    };
    let _ = exchange.CreateConditionOrder("ETH_USDT", "sell", 0.1, &condition2);
    Sleep(1000);

    // 查询所有未完成条件单
    let orders = exchange.GetConditionOrders(None).unwrap();
    Log!("Pending condition orders count:", orders.len());
    for i in 0..orders.len() {
        Log!("Condition order", i + 1, ":", orders[i]);
    }
}
```

查询指定交易对的未成交条件单。

```javascript
function main() {
    // 查询 BTC_USDT 交易对的未成交条件单
    var orders = exchange.GetConditionOrders("BTC_USDT")
    Log("BTC_USDT pending condition orders:", orders)
}
```

```python
def main():
    # 查询 BTC_USDT 交易对的未成交条件单
    orders = exchange.GetConditionOrders("BTC_USDT")
    Log("BTC_USDT pending condition orders:", orders)
```

```rust
fn main() {
    // 查询 BTC_USDT 交易对的未成交条件单
    let orders = exchange.GetConditionOrders("BTC_USDT");
    Log!("BTC_USDT pending condition orders:", orders);
}
```

范围写法（```USDT.swap```、```USD.futures```、```USDT.option```等）与不传```symbol```时的缺省范围见`品种代码`；交易所接口不支持的范围会报错并返回空值。

当交易所对象```exchange```所代表的账户在**查询范围内**或**指定的交易品种**上没有未完成条件单时，调用该函数将返回空数组，即：```[]```。

少数交易所查询未完成条件单的接口必须指定品种：在这些交易所上不传```symbol```时只查询当前品种的未完成条件单，而不是整个范围。哪些交易所属于这种情况见各交易所页的注意事项（所有交易所的入口见`能力矩阵`）。

条件单功能的支持情况取决于具体交易所，部分交易所可能不支持条件单功能。

不支持的交易所：`AscendEx`、`Bithumb`、`Bitstamp`、`Coinw`、`DigiFinex`、`Futures_DigiFinex`、`Gemini`、`HashKey`、`Korbit`、`LBank`、`MEXC`、`Upbit`、`WEEX`、`Zaif`、`Hyperliquid`、`Pendle`、`Uniswap`、`Jupiter`、`KyberSwap`、`OneInch`、`OKX_DEX`、`Futures_Polymarket`、`Futures_IB`、`Exchange`、`Web3`。调用时报错并返回空值，所有交易所的对照见`能力矩阵`。

See also: `Order`, `exchange.GetConditionOrder`, `exchange.GetHistoryConditionOrders`

#### exchange.GetHistoryConditionOrders

```
exchange.GetHistoryConditionOrders()
exchange.GetHistoryConditionOrders(symbol)
exchange.GetHistoryConditionOrders(symbol, since)
exchange.GetHistoryConditionOrders(symbol, since, limit)
exchange.GetHistoryConditionOrders(since)
exchange.GetHistoryConditionOrders(since, limit)
```

获取当前交易对、合约的历史条件单（包括已触发、已取消、已过期的条件单），并支持指定具体的交易品种。

Parameters:

- `symbol` (string, optional): 品种代码，例如现货交易所对象上的```BTC_USDT```、期货交易所对象上的```BTC_USDT.swap```，写法（含期权）见`品种代码`。不传时查询当前交易对、合约代码的历史条件单。
- `since` (number, optional): 查询的起始时间戳，单位为毫秒。
- `limit` (number, optional): 查询的条件单数量。

Returns (`Order`数组 / 空值): 成功时返回`Order`结构数组；失败时返回空值。

返回的Order结构中包含`Condition`字段，该字段包含条件单的详细配置信息（触发价格、执行价格、条件类型等）。

查询历史条件单，返回的结果按时间升序排列。

```javascript
function main() {
    var historyConditionOrders = exchange.GetHistoryConditionOrders()
    Log("Historical condition orders count:", historyConditionOrders.length)

    // 遍历并显示，订单按 Time 属性升序排列
    for (var i = 0; i < historyConditionOrders.length; i++) {
        Log("Order", i+1, "Created at:", historyConditionOrders[i].Time,
            "ID:", historyConditionOrders[i].Id,
            "Status:", historyConditionOrders[i].Status)
    }
}
```

```python
def main():
    historyConditionOrders = exchange.GetHistoryConditionOrders()
    Log("Historical condition orders count:", len(historyConditionOrders))

    # 遍历并显示，订单按 Time 属性升序排列
    for i in range(len(historyConditionOrders)):
        Log("Order", i+1, "Created at:", historyConditionOrders[i]["Time"],
            "ID:", historyConditionOrders[i]["Id"],
            "Status:", historyConditionOrders[i]["Status"])
```

```rust
fn main() {
    let historyConditionOrders = exchange.GetHistoryConditionOrders(None, None, None).unwrap();
    Log!("Historical condition orders count:", historyConditionOrders.len());

    // 遍历并显示，订单按 Time 属性升序排列
    for i in 0..historyConditionOrders.len() {
        Log!("Order", i + 1, "Created at:", historyConditionOrders[i].Time,
            "ID:", historyConditionOrders[i].Id,
            "Status:", historyConditionOrders[i].Status);
    }
}
```

查询指定交易对的历史条件单，并限制返回的数量。

```javascript
function main() {
    // 查询BTC_USDT交易对最近的10条历史条件单
    var historyConditionOrders = exchange.GetHistoryConditionOrders("BTC_USDT", 0, 10)
    Log("BTC_USDT historical condition orders:", historyConditionOrders)
}
```

```python
def main():
    # 查询BTC_USDT交易对最近的10条历史条件单
    historyConditionOrders = exchange.GetHistoryConditionOrders("BTC_USDT", 0, 10)
    Log("BTC_USDT historical condition orders:", historyConditionOrders)
```

```rust
fn main() {
    // 查询BTC_USDT交易对最近的10条历史条件单
    let historyConditionOrders = exchange.GetHistoryConditionOrders("BTC_USDT", 0, 10);
    Log!("BTC_USDT historical condition orders:", historyConditionOrders);
}
```

按时间范围查询历史条件单。

```javascript
function main() {
    // 查询从指定时间戳开始的历史条件单
    var startTime = new Date("2024-01-01").getTime()
    var historyConditionOrders = exchange.GetHistoryConditionOrders(startTime, 50)
    Log("Historical condition orders since:", historyConditionOrders)
}
```

```python
def main():
    # 查询从指定时间戳开始的历史条件单
    import time
    startTime = int(time.mktime(time.strptime("2024-01-01", "%Y-%m-%d")) * 1000)
    historyConditionOrders = exchange.GetHistoryConditionOrders(startTime, 50)
    Log("Historical condition orders since:", historyConditionOrders)
```

```rust
fn main() {
    // 查询从指定时间戳开始的历史条件单
    let startTime: i64 = 1704067200000;  // 2024-01-01的时间戳
    // Rust中symbol参数传None表示当前交易对
    let historyConditionOrders = exchange.GetHistoryConditionOrders(None, startTime, 50);
    Log!("Historical condition orders since:", historyConditionOrders);
}
```

- 不指定```symbol```、```since```、```limit```参数时，默认查询当前交易对、合约的历史条件单，即查询距离当前时间最近的一定范围内的历史条件单，查询范围取决于交易所接口的单次查询范围。

- 指定```symbol```参数时，查询所设置交易品种的历史条件单。

- 指定```since```参数时，以```since```时间戳为起始时间，向当前时间方向查询。

- 指定```limit```参数时，在查询到足够条数后返回。

- 该函数仅支持提供历史条件单查询接口的交易所。

历史条件单包括：已触发（转为普通订单）、已取消、已过期等状态的条件单。

返回的历史条件单数组按订单创建时间（```Time```属性）升序排列，即时间最早的订单位于数组前面，时间最晚的订单位于数组后面。

对条件单功能的支持情况取决于具体的交易所，部分交易所可能不支持条件单功能或历史条件单查询功能。

不支持的交易所：`AscendEx`、`Bithumb`、`Bitstamp`、`Coincheck`、`Coinone`、`Coinw`、`DigiFinex`、`Futures_DigiFinex`、`Gemini`、`HashKey`、`Korbit`、`LBank`、`MEXC`、`Upbit`、`WEEX`、`Zaif`、`Hyperliquid`、`Pendle`、`Uniswap`、`Jupiter`、`KyberSwap`、`OneInch`、`OKX_DEX`、`Futures_Polymarket`、`Futures_IB`、`Exchange`、`Web3`。调用时报错并返回空值，所有交易所的对照见`能力矩阵`。

See also: `Order`, `exchange.GetConditionOrder`, `exchange.GetConditionOrders`

### Account

账户函数查询交易所对象绑定账户的资金：`exchange.GetAccount`返回当前交易对的计价币与交易币余额（期货为保证金与权益），`exchange.GetAssets`返回账户中各币种的资产列表。

查询失败返回空值。期货持仓用`exchange.GetPositions`查询；统一账户等跨币种保证金模式下各交易所的口径见交易所页。

#### exchange.GetAccount

```
exchange.GetAccount()
```

请求交易所账户信息。```GetAccount()```是交易所对象`exchange`的成员函数，只作用于该交易所对象绑定的账户（多账户时用```exchanges[i].GetAccount()```指定账户）。

Returns (`Account` / 空值): 查询账户资产信息，查询成功时返回`Account`结构，查询失败时返回空值。

获取当前账户的可用余额与冻结余额。

```javascript
function main() {
    var account = exchange.GetAccount()
    if (!account) return
    Log("可用", account.Balance, "冻结", account.FrozenBalance)
    // 输出：可用 <计价币可用数量> 冻结 <计价币冻结数量>
}
```

```python
def main():
    account = exchange.GetAccount()
    if not account:
        return
    Log("可用", account["Balance"], "冻结", account["FrozenBalance"])
    # 输出：可用 <计价币可用数量> 冻结 <计价币冻结数量>
```

```rust
fn main() {
    let Ok(account) = exchange.GetAccount() else { return };
    Log!("可用", account.Balance, "冻结", account.FrozenBalance);
    // 输出：可用 <计价币可用数量> 冻结 <计价币冻结数量>
}
```

设置交易对与合约代码，获取当前账户信息。

```javascript
function main(){
    // 切换交易对
    exchange.IO("currency", "BTC_USDT")
    // 以OKX期货为例，设置合约为当周合约，当前交易对为BTC_USDT，所以当前合约为BTC的U本位当周合约
    exchange.SetContractType("this_week")
    // 获取当前账户资产数据
    var account = exchange.GetAccount()
    // USDT作为保证金的可用余额
    Log(account.Balance)
    // USDT作为保证金的冻结金额
    Log(account.FrozenBalance)
    // 当前资产权益
    Log(account.Equity)
    // 当前资产作为保证金的所有持仓的未实现盈亏
    Log(account.UPnL)
}
```

```python
def main():
    exchange.IO("currency", "BTC_USDT")
    exchange.SetContractType("this_week")
    account = exchange.GetAccount()
    Log(account["Balance"])
    Log(account["FrozenBalance"])
    Log(account["Equity"])
    Log(account["UPnL"])
```

```rust
fn main() {
    // 切换交易对
    exchange.IO(("currency", "BTC_USDT")).unwrap();
    // 以OKX期货为例，设置合约为当周合约，当前交易对为BTC_USDT，所以当前合约为BTC的U本位当周合约
    exchange.SetContractType("this_week").unwrap();
    // 获取当前账户资产数据
    let account = exchange.GetAccount().unwrap();
    // USDT作为保证金的可用余额
    Log!(account.Balance);
    // USDT作为保证金的冻结金额
    Log!(account.FrozenBalance);
    // 当前资产权益
    Log!(account.Equity);
    // 当前资产作为保证金的所有持仓的未实现盈亏
    Log!(account.UPnL);
}
```

如果交易所对象设置为加密货币期货合约交易所，并且切换为以```USDT```作为保证金的合约（切换方法请参阅`exchange.SetCurrency`、`exchange.SetContractType`函数），此时资产以```USDT```作为保证金，记录在`Account`结构的```Balance```、```FrozenBalance```属性中。

如果交易所对象设置为加密货币期货合约交易所，并且切换为币本位合约，此时资产以币作为保证金，记录在`Account`结构的```Stocks```、```FrozenStocks```属性中。

使用统一账户（组合保证金）等跨币种保证金模式时，部分交易所的```Balance```是所有资产折算成USD的金额，例如`Futures_Binance`；各交易所的账户口径见交易所页的「保证金、账户与模拟盘」。

See also: `Account`, `exchange.SetCurrency`, `exchange.SetContractType`

#### exchange.GetAssets

```
exchange.GetAssets()
```

请求交易所账户的资产信息。

Returns (`Asset`数组 / 空值): 成功时返回`Asset`结构体数组；失败时返回空值。

获取交易所账户的资产信息，```exchange.GetAssets()```函数返回一个以Asset结构体为元素的数组。

```javascript
function main() {
    // exchange.SetCurrency("BTC_USDT")  // 可以设置交易对
    // exchange.SetContractType("swap")  // 可以设置合约
    var assets = exchange.GetAssets()
    Log(assets)
}
```

```python
def main():
    # exchange.SetCurrency("BTC_USDT")  # 可以设置交易对
    # exchange.SetContractType("swap")  # 可以设置合约
    assets = exchange.GetAssets()
    Log(assets)
```

```rust
fn main() {
    // exchange.SetCurrency("BTC_USDT");  // 可以设置交易对
    // exchange.SetContractType("swap").unwrap();  // 可以设置合约
    let assets = exchange.GetAssets().unwrap();
    Log!(assets);
}
```

期货交易所对象的```GetAssets()```函数按当前设置的合约查询保证金资产：按合约类型区分保证金账户的交易所（例如Futures_GateIO的永续合约与交割合约、USDT本位与币本位分属不同账户），返回当前合约所在账户的全部资产；不区分保证金账户的交易所返回账户的全部资产。

See also: `Asset`

### Futures

期货函数设置合约交易参数并查询持仓：合约代码、开平仓方向、杠杆、持仓和资金费率，只适用于期货交易所对象。

一般先用`exchange.SetContractType`选定合约（也可以在函数的```symbol```参数里写完整品种代码，见`品种代码`），再下单和查询持仓。各交易所可用的合约代码、保证金与持仓模式见交易所页。

#### exchange.SetContractType

```
exchange.SetContractType(symbol)
```

设置`exchange`交易所对象当前的合约代码。

Parameters:

- `symbol` (string, required): 合约代码，例如```swap```、```quarter```；常见取值见备注，各交易所实际支持的代码见「各交易所的合约代码」表与各交易所页。

Returns (object / 空值): 结构，包含当前合约代码对应的交易所合约代码。例如币安期货合约交易所，当前合约代码为```quarter```时，返回值为：```{"InstrumentID":"BTCUSD_260925","instrument":"BTCUSD_260925"}```。设置失败时返回空值。

设置当前合约为季度合约。

```javascript
function main() {
    // 设置为季度合约
    exchange.SetContractType("quarter")
}
```

```python
def main():
    exchange.SetContractType("quarter")
```

```rust
fn main() {
    // 设置为季度合约
    exchange.SetContractType("quarter").unwrap();
}
```

设置```USDT```作为保证金的合约时，需要在代码中切换交易对（也可以在添加交易所对象时直接设置交易对）。

```javascript
function main() {
    // 默认交易对为BTC_USD，设置合约为季度，合约为币本位合约
    exchange.SetContractType("quarter")
    Log("ticker:", exchange.GetTicker())

    // 切换交易对，然后设置合约，切换成USDT作为保证金的合约，区别于币本位合约
    exchange.IO("currency", "BTC_USDT")
    exchange.SetContractType("swap")
    Log("ticker:", exchange.GetTicker())
}
```

```python
def main():
    exchange.SetContractType("quarter")
    Log("ticker:", exchange.GetTicker())
    exchange.IO("currency", "BTC_USDT")
    exchange.SetContractType("swap")
    Log("ticker:", exchange.GetTicker())
```

```rust
fn main() {
    // 默认交易对为BTC_USD，设置合约为季度，合约为币本位合约
    exchange.SetContractType("quarter").unwrap();
    Log!("ticker:", exchange.GetTicker(None));

    // 切换交易对，然后设置合约，切换成USDT作为保证金的合约，区别于币本位合约
    exchange.IO(("currency", "BTC_USDT")).unwrap();
    exchange.SetContractType("swap").unwrap();
    Log!("ticker:", exchange.GetTicker(None));
}
```

打印```exchange.SetContractType()```函数的返回值。

```javascript
function main(){
    // 设置合约为季度
    var ret = exchange.SetContractType("quarter")
    // 返回季度合约的信息
    Log(ret)
}
```

```python
def main():
    ret = exchange.SetContractType("quarter")
    Log(ret)
```

```rust
fn main() {
    // 设置合约为季度
    let ret = exchange.SetContractType("quarter").unwrap();
    // 返回季度合约的信息
    Log!(ret);
}
```

在加密货币期货合约策略中，系统根据交易对来确定是**币本位合约**还是**USDT本位合约**（或USDC本位合约）。
例如：交易对设置为```BTC_USDT```时，使用```exchange.SetContractType("swap")```函数设置合约代码为```swap```，此时就设置为```BTC```的**USDT本位**永续合约。如果交易对为```BTC_USD```，使用```exchange.SetContractType("swap")```函数设置合约代码为```swap```，此时就设置为```BTC```的**币本位**永续合约。

使用```exchange.SetCurrency()```或者```exchange.IO("currency", ...)```切换交易对时，当前合约代码保持不变，切换后操作的是新交易对下同一合约代码的合约；需要换合约时再调用```exchange.SetContractType()```。
加密货币期货交易所对象没有设置过合约代码时，默认为当前交易对的永续合约（```swap```）。

合约代码按交易所对象的市场列表（`exchange.GetMarkets`返回的各品种合约代码部分）校验，不在列表中的合约代码设置失败。期权合约代码（含```-```的交易所原生合约代码，以及Kraken形如```OF_..._C```/```OF_..._P```的期权代码）不查市场列表，直接接受。
设置失败时函数返回空值，当前合约代码保持不变，可通过`GetLastError`获取错误信息。

加密货币期货常见的合约代码（没有特别说明时的含义；各交易所实际支持的不同）：

| 合约代码 | 含义 |
| - | - |
| ```this_week``` | 当周交割合约 |
| ```next_week``` | 次周交割合约 |
| ```quarter``` | 当季交割合约 |
| ```next_quarter``` | 次季交割合约 |
| ```swap``` | 永续合约 |

##### 各交易所的合约代码

✓ 可用；✗ 该交易所明确不支持（设置时报错）；空白表示没有该合约。各合约代码的含义、交易所原生代码的写法见交易所页。

| 交易所 | swap | this_week | next_week | month | next_month | quarter | next_quarter | third_quarter | fourth_quarter | 其它 |
| - | - | - | - | - | - | - | - | - | - | - |
| `Futures_Backpack` | ✓ |  |  |  |  |  |  |  |  |  |
| `Futures_Binance` | ✓ | ✗ | ✗ |  |  | ✓ | ✓ |  |  |  |
| `Futures_Bitfinex` | ✓ |  |  |  |  |  |  |  |  |  |
| `Futures_Bitget` | ✓ |  |  |  |  | ✓ | ✓ |  |  |  |
| `Futures_Bybit` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |  | ```delivery```、```third_week``` |
| `Futures_Coinw` | ✓ |  |  |  |  |  |  |  |  |  |
| `Futures_Crypto` | ✓ | ✗ | ✗ |  |  | ✗ | ✗ |  |  | ```January```、```February```、```March```、```April```、```May```、```June```、```July```、```August```、```September```、```October```、```November```、```December``` |
| `Futures_DeepCoin` | ✓ |  |  |  |  |  |  |  |  |  |
| `Futures_Deribit` | ✓ | ✓ | ✓ | ✓ |  | ✓ | ✓ | ✓ | ✓ | ```today```、```tomorrow``` |
| `Futures_DigiFinex` | ✓ |  |  |  |  |  |  |  |  |  |
| `Futures_GateIO` | ✓ | ✓ | ✓ |  |  | ✓ | ✓ |  |  |  |
| `Futures_HuobiDM` | ✓ | ✓ | ✓ |  |  | ✓ | ✓ |  |  |  |
| `Futures_Kraken` | ✓ | ✓ |  | ✓ |  | ✓ | ✓ | ✓ |  | ```swap_pf```、```month_ff```、```this_week_ff```、```quarter_ff```、```next_quarter_ff```、```third_quarter_ff``` |
| `Futures_KuCoin` | ✓ |  |  |  |  | ✓ | ✓ |  |  |  |
| `Futures_MEXC` | ✓ |  |  |  |  |  |  |  |  |  |
| `Futures_OKCoin` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |  |
| `Futures_WEEX` | ✓ |  |  |  |  |  |  |  |  |  |
| `Futures_WOO` | ✓ |  |  |  |  |  |  |  |  |  |
| `Futures_Hyperliquid` | ✓ |  |  |  |  |  |  |  |  |  |
| `Futures_Lighter` | ✓ |  |  |  |  |  |  |  |  |  |
| `Futures_EdgeX` | ✓ |  |  |  |  |  |  |  |  |  |
| `Futures_ApolloX` | ✓ |  |  |  |  |  |  |  |  |  |
| `Futures_Aster` | ✓ |  |  |  |  |  |  |  |  |  |
| `Futures_Aevo` | ✓ |  |  |  |  |  |  |  |  |  |
| `Futures_WOOFi` | ✓ |  |  |  |  |  |  |  |  |  |
| `Futures_Polymarket` |  |  |  |  |  |  |  |  |  | ```Yes```、```No```、```Up```、```Down``` |

See also: `exchange.GetContractType`, `exchange.SetCurrency`

#### exchange.GetContractType

```
exchange.GetContractType()
```

获取`exchange`交易所对象当前设置的合约代码。

Returns (string): 由FMZ平台定义的合约代码，例如：```this_week```、```swap```等。

设置为当周合约后读取当前合约代码。

```javascript
function main () {
    exchange.SetContractType("this_week")
    Log(exchange.GetContractType())
    // 输出：this_week
}
```

```python
def main():
    exchange.SetContractType("this_week")
    Log(exchange.GetContractType())
    # 输出：this_week
```

```rust
fn main() {
    let _ = exchange.SetContractType("this_week");
    Log!(exchange.GetContractType());
    // 输出：this_week
}
```

See also: `exchange.SetContractType`

#### exchange.SetDirection

```
exchange.SetDirection(direction)
```

设置调用`exchange.Buy`函数、`exchange.Sell`函数进行期货合约下单时的订单方向。

Parameters:

- `direction` (string, required): 期货合约下单时的方向，可选值为：```buy```、```closesell```、```sell```、```closebuy```。

设置方向为开多后下买单，再设置为平多后下卖单平仓。

```javascript
function main(){
    // 举例设置为OKX期货当周合约
    exchange.SetContractType("this_week")
    // 设置杠杆为5倍
    exchange.SetMarginLevel(5)
    // 设置下单方向为做多
    exchange.SetDirection("buy")
    // 以10000的价格、2张合约数量下单
    exchange.Buy(10000, 2)
    exchange.SetMarginLevel(5)
    exchange.SetDirection("closebuy")
    exchange.Sell(1000, 2)
}
```

```python
def main():
    exchange.SetContractType("this_week")
    exchange.SetMarginLevel(5)
    exchange.SetDirection("buy")
    exchange.Buy(10000, 2)
    exchange.SetMarginLevel(5)
    exchange.SetDirection("closebuy")
    exchange.Sell(1000, 2)
```

```rust
fn main() {
    // 注意：Rust SDK 中不推荐使用SetDirection、Buy、Sell函数，建议优先使用CreateOrder函数，
    // CreateOrder可直接指定side参数（"buy"、"sell"、"closebuy"、"closesell"），无需先调用SetDirection
    // 举例设置为OKX期货当周合约
    exchange.SetContractType("this_week").unwrap();
    // 设置杠杆为5倍
    exchange.SetMarginLevel(5);
    // 设置下单方向为做多
    exchange.SetDirection("buy").unwrap();
    // 以10000的价格、2张合约数量下单
    exchange.Buy(10000, 2).unwrap();
    exchange.SetMarginLevel(5);
    exchange.SetDirection("closebuy").unwrap();
    exchange.Sell(1000, 2).unwrap();
}
```

```exchange.SetDirection()```函数用于设置期货合约交易方向与下单函数之间的对应关系：

|下单函数|SetDirection函数设置的方向|备注|
|-|-|-|
|exchange.Buy|"buy"|买入开多仓|
|exchange.Buy|"closesell"|买入平空仓|
|exchange.Sell|"sell"|卖出开空仓|
|exchange.Sell|"closebuy"|卖出平多仓|

```exchange.SetDirection()```只用于期货交易所对象。现货交易所对象不需要也不应调用它：现货的买卖方向由```exchange.Buy()```（买入）、```exchange.Sell()```（卖出）本身决定。

See also: `exchange.Buy`, `exchange.Sell`

#### exchange.SetMarginLevel

```
exchange.SetMarginLevel(symbol, marginLevel)
exchange.SetMarginLevel(marginLevel)
```

设置```symbol```参数所指定的交易对、合约的杠杆值。同时兼容仅传入```marginLevel```参数的调用方式，用于设置`exchange`交易所对象当前交易对、合约的杠杆值。

Parameters:

- `symbol` (string, optional): 要调整杠杆值的品种，例如```BTC_USDT.swap```，写法见`品种代码`。
- `marginLevel` (number, required): 杠杆值。交易所的杠杆值通常为整数，部分交易所也支持浮点数形式的杠杆值设置。

设置当前合约的杠杆，再设置指定品种的杠杆。

```javascript
function main() {
    exchange.SetMarginLevel(10)
    // 设置BTC的USDT本位永续合约的杠杆为15
    exchange.SetMarginLevel("BTC_USDT.swap", 15)
}
```

```python
def main():
    exchange.SetMarginLevel(10)
    exchange.SetMarginLevel("BTC_USDT.swap", 15)
```

```rust
fn main() {
    exchange.SetMarginLevel(10);
    // Rust SDK 中SetMarginLevel函数不支持symbol参数，仅设置当前交易对、合约的杠杆值
    // 如需设置BTC_USDT.swap品种的杠杆为15，需先切换到该交易对、合约后再调用exchange.SetMarginLevel(15)
}
```

```exchange.SetMarginLevel()```函数仅支持加密货币期货合约交易所对象。回测系统支持调用```exchange.SetMarginLevel()```函数来设置杠杆值。

对于加密货币期货合约而言，由于各加密货币期货合约交易所的杠杆机制并不统一。

在某些交易所中，期货合约的杠杆值是下单接口中的一个参数，此时调用```exchange.SetMarginLevel()```函数并不会产生网络请求，仅设置FMZ系统底层中的杠杆变量（用于下单接口传参）。

在另一些交易所中，期货合约的杠杆值是交易所的一项独立设置，需要通过交易所网站页面或API接口进行设置。此时调用```exchange.SetMarginLevel()```函数则会产生网络请求，并且有可能设置失败。失败原因可能有多种，例如：当前存在持仓或挂单，导致该交易对、合约无法再设置新的杠杆值。

不支持的交易所：`Futures_Deribit`、`Futures_EdgeX`、`Futures_Boros`、`Futures_Polymarket`、`Futures_Futu`、`Futures_IB`。调用时报错并返回空值，所有交易所的对照见`能力矩阵`。

See also: `exchange`

#### exchange.GetPositions

```
exchange.GetPositions()
exchange.GetPositions(symbol)
```

获取持仓信息。```GetPositions()```是交易所对象`exchange`的成员函数，只作用于该交易所对象绑定的账户（多账户时用```exchanges[i].GetPositions()```指定账户）。

Parameters:

- `symbol` (string, optional): 要查询的品种（例如```BTC_USDT.swap```）或品种范围（例如```USDT.swap```）。不传或传空字符串时，查询当前计价币种与合约类型的范围（例如当前品种为```BTC_USDT.swap```时即```USDT.swap```）。范围写法与缺省范围的完整规则见`品种代码`。

Returns (`Position`数组 / 空值): 成功时返回`Position`结构数组；失败时返回空值。

查询持仓（不传参数时按默认范围）并逐条打印。

```javascript
function main() {
    var positions = exchange.GetPositions()
    if (!positions) return    // 获取失败时为null，没有持仓时为空数组
    for (var pos of positions) {
        Log(pos.Symbol, "数量", pos.Amount, "均价", pos.Price, "浮动盈亏", pos.Profit)
    }
    // 输出：每个持仓一行，依次为品种代码、持仓量、持仓均价、浮动盈亏
}
```

```python
def main():
    positions = exchange.GetPositions()
    if positions is None:
        return
    for pos in positions:
        Log(pos["Symbol"], "数量", pos["Amount"], "均价", pos["Price"], "浮动盈亏", pos["Profit"])
    # 输出：每个持仓一行，依次为品种代码、持仓量、持仓均价、浮动盈亏
```

```rust
fn main() {
    let Ok(positions) = exchange.GetPositions(None) else { return };
    for pos in &positions {
        Log!(pos.Symbol, "数量", pos.Amount, "均价", pos.Price, "浮动盈亏", pos.Profit);
    }
    // 输出：每个持仓一行，依次为品种代码、持仓量、持仓均价、浮动盈亏
}
```

使用期货交易所对象，对多个不同交易对、不同合约代码的品种下市价单，并通过多种方式查询持仓信息。

```javascript
/*backtest
start: 2024-05-21 00:00:00
end: 2024-09-05 00:00:00
period: 5m
basePeriod: 1m
exchanges: [{"eid":"Futures_Binance","currency":"BTC_USDT"}]
*/

function main() {
    var arrSymbol = ["BTC_USDT.swap", "BTC_USDT.quarter", "ETH_USDT.swap", "ETH_USDT.quarter"]

    for (var symbol of arrSymbol) {
        exchange.CreateOrder(symbol, "buy", -1, 1)
        exchange.CreateOrder(symbol, "sell", -1, 1)
    }

    var defaultPositions = exchange.GetPositions()
    var swapPositions = exchange.GetPositions("USDT.swap")
    var futuresPositions = exchange.GetPositions("USDT.futures")
    var btcUsdtSwapPositions = exchange.GetPositions("BTC_USDT.swap")

    var tbls = []
    var arr = [defaultPositions, swapPositions, futuresPositions, btcUsdtSwapPositions]
    var tblDesc = ["defaultPositions", "swapPositions", "futuresPositions", "btcUsdtSwapPositions"]
    for (var index in arr) {
        var positions = arr[index]
        var tbl = {type: "table", title: tblDesc[index], cols: ["Symbol", "MarginLevel", "Amount", "FrozenAmount", "Price", "Profit", "Type", "ContractType", "Margin"], rows: [] }
        for (var pos of positions) {
            tbl.rows.push([pos.Symbol, pos.MarginLevel, pos.Amount, pos.FrozenAmount, pos.Price, pos.Profit, pos.Type, pos.ContractType, pos.Margin])
        }
        tbls.push(tbl)
    }

    LogStatus("`" + JSON.stringify(tbls) + "`")

    // 打印输出一次信息后返回，防止后续回测时订单成交，影响数据观察
    return
}
```

```python
'''backtest
start: 2024-05-21 00:00:00
end: 2024-09-05 00:00:00
period: 5m
basePeriod: 1m
exchanges: [{"eid":"Futures_Binance","currency":"BTC_USDT"}]
'''

import json

def main():
    arrSymbol = ["BTC_USDT.swap", "BTC_USDT.quarter", "ETH_USDT.swap", "ETH_USDT.quarter"]

    for symbol in arrSymbol:
        exchange.CreateOrder(symbol, "buy", -1, 1)
        exchange.CreateOrder(symbol, "sell", -1, 1)

    defaultPositions = exchange.GetPositions()
    swapPositions = exchange.GetPositions("USDT.swap")
    futuresPositions = exchange.GetPositions("USDT.futures")
    btcUsdtSwapPositions = exchange.GetPositions("BTC_USDT.swap")

    tbls = []
    arr = [defaultPositions, swapPositions, futuresPositions, btcUsdtSwapPositions]
    tblDesc = ["defaultPositions", "swapPositions", "futuresPositions", "btcUsdtSwapPositions"]
    for index in range(len(arr)):
        positions = arr[index]
        tbl = {"type": "table", "title": tblDesc[index], "cols": ["Symbol", "MarginLevel", "Amount", "FrozenAmount", "Price", "Profit", "Type", "ContractType", "Margin"], "rows": []}
        for pos in positions:
            tbl["rows"].append([pos["Symbol"], pos["MarginLevel"], pos["Amount"], pos["FrozenAmount"], pos["Price"], pos["Profit"], pos["Type"], pos["ContractType"], pos["Margin"]])

        tbls.append(tbl)

    LogStatus("`" + json.dumps(tbls) + "`")

    return
```

```rust
/*backtest
start: 2024-05-21 00:00:00
end: 2024-09-05 00:00:00
period: 5m
basePeriod: 1m
exchanges: [{"eid":"Futures_Binance","currency":"BTC_USDT"}]
*/

fn main() {
    let arrSymbol = ["BTC_USDT.swap", "BTC_USDT.quarter", "ETH_USDT.swap", "ETH_USDT.quarter"];

    for symbol in arrSymbol {
        exchange.CreateOrder(symbol, "buy", -1, 1);
        exchange.CreateOrder(symbol, "sell", -1, 1);
    }

    let defaultPositions = exchange.GetPositions(None).unwrap();
    let swapPositions = exchange.GetPositions("USDT.swap").unwrap();
    let futuresPositions = exchange.GetPositions("USDT.futures").unwrap();
    let btcUsdtSwapPositions = exchange.GetPositions("BTC_USDT.swap").unwrap();

    // Rust SDK 没有JSON序列化，使用format!拼接表格的JSON文本
    let mut tbls: Vec<String> = Vec::new();
    let arr = [defaultPositions, swapPositions, futuresPositions, btcUsdtSwapPositions];
    let tblDesc = ["defaultPositions", "swapPositions", "futuresPositions", "btcUsdtSwapPositions"];
    for (index, positions) in arr.iter().enumerate() {
        let mut rows: Vec<String> = Vec::new();
        for pos in positions {
            rows.push(format!(r#"["{}", {}, {}, {}, {}, {}, {}, "{}", {}]"#, pos.Symbol, pos.MarginLevel, pos.Amount, pos.FrozenAmount, pos.Price, pos.Profit, pos.Type, pos.ContractType, pos.Margin));
        }
        let tbl = format!(r#"{{"type": "table", "title": "{}", "cols": ["Symbol", "MarginLevel", "Amount", "FrozenAmount", "Price", "Profit", "Type", "ContractType", "Margin"], "rows": [{}]}}"#, tblDesc[index], rows.join(","));
        tbls.push(tbl);
    }

    LogStatus!(format!("`[{}]`", tbls.join(",")));

    // 打印输出一次信息后返回，防止后续回测时订单成交，影响数据观察
    return;
}
```

加密货币期货合约与加密货币现货不同，现货仅有逻辑上的持仓概念。在FMZ量化交易平台的系统中，加密货币期货合约的具体品种由**交易对**、**合约代码**共同标识。可参阅`exchange.SetCurrency`、`exchange.SetContractType`函数。

范围写法（```USDT.swap```、```USD.futures```、```USDT.option```等）与不传```symbol```时的缺省范围见`品种代码`；交易所接口不支持的范围会报错并返回空值。

兼容```exchange.GetPosition()```调用，```GetPosition```与```GetPositions```的用法完全一致。

当交易所对象```exchange```所代表的账户在**查询范围内**或**指定的交易品种**上没有持仓时，```exchange.GetPositions()```函数返回空数组，例如：```[]```。

See also: `Position`, `exchange.SetCurrency`, `exchange.SetContractType`

#### exchange.GetFundings

```
exchange.GetFundings()
exchange.GetFundings(symbol)
```

获取当前周期资金费率数据。

Parameters:

- `symbol` (string, optional): 要查询的品种（例如```BTC_USDT.swap```）或品种范围（例如```USDT.swap```）。不传或传空字符串时，查询当前计价币种与合约类型的范围（例如当前品种为```BTC_USDT.swap```时即```USDT.swap```）。范围写法与缺省范围的完整规则见`品种代码`。

Returns (`Funding`数组 / 空值): 成功时返回`Funding`结构数组；失败时返回空值。

查询资金费率（不传参数时按默认范围）并逐条打印。

```javascript
function main() {
    var fundings = exchange.GetFundings()
    if (!fundings) return
    for (var f of fundings) {
        Log(f.Symbol, "费率", f.Rate * 100, "%", "间隔", f.Interval / 3600000, "小时", _D(f.Time))
    }
    // 输出：每个品种一行，依次为品种代码、资金费率（%）、结算间隔（小时）、时间
}
```

```python
def main():
    fundings = exchange.GetFundings()
    if fundings is None:
        return
    for f in fundings:
        hours = f["Interval"] / 3600000
        Log(f["Symbol"], "费率", f["Rate"] * 100, "%", "间隔", hours, "小时", _D(f["Time"] / 1000))
    # 输出：每个品种一行，依次为品种代码、资金费率（%）、结算间隔（小时）、时间
```

```rust
fn main() {
    let Ok(fundings) = exchange.GetFundings(None) else { return };
    for f in &fundings {
        let hours = f.Interval as f64 / 3600000.0;
        Log!(f.Symbol, "费率", f.Rate * 100.0, "%", "间隔", hours, "小时", _D(f.Time));
    }
    // 输出：每个品种一行，依次为品种代码、资金费率（%）、结算间隔（小时）、时间
}
```

使用期货交易所对象，在回测系统中调用```exchange.GetFundings()```函数。调用任何行情函数之前，GetFundings只返回当前默认交易对的Funding数据，调用行情函数之后会返回所有请求过的品种的Funding数据。可以参考以下测试例子。

```javascript
/*backtest
start: 2024-10-01 00:00:00
end: 2024-10-23 00:05:00
period: 1m
basePeriod: 1m
exchanges: [{"eid":"Futures_Binance","currency":"SOL_USDC"}]
*/

function main() {
    // LPT_USDT.swap 4小时周期
    var symbols = ["SOL_USDT.swap", "ETH_USDT.swap", "LTC_USDT.swap", "SOL_USDC.swap", "ETH_USDC.swap", "BTC_USD.swap", "BTC_USDT.quarter", "LPT_USDT.swap"]
    for (var symbol of symbols) {
        exchange.GetTicker(symbol)
    }

    var arr = []
    var arrParams = ["no param", "LTC_USDT.swap", "USDT.swap", "USD.swap", "USDC.swap", "USDT.futures", "BTC_USDT.quarter"]
    for (var p of arrParams) {
        if (p == "no param") {
            arr.push(exchange.GetFundings())
        } else {
            arr.push(exchange.GetFundings(p))
        }
    }

    var tbls = []
    var index = 0
    for (var fundings of arr) {
        var tbl = {
            "type": "table",
            "title": arrParams[index],
            "cols": ["Symbol", "Interval", "Time", "Rate"],
            "rows": [],
        }

        for (var f of fundings) {
            tbl["rows"].push([f.Symbol, f.Interval / 3600000, _D(f.Time), f.Rate * 100 + " %"])
        }
        tbls.push(tbl)
        index++
    }

    LogStatus(_D(), "\n Requested symbols:", symbols, "\n`" + JSON.stringify(tbls) + "`")
}
```

```python
'''backtest
start: 2024-10-01 00:00:00
end: 2024-10-23 00:05:00
period: 1m
basePeriod: 1m
exchanges: [{"eid":"Futures_Binance","currency":"SOL_USDC"}]
'''

import json

def main():
    # LPT_USDT.swap 4小时周期
    symbols = ["SOL_USDT.swap", "ETH_USDT.swap", "LTC_USDT.swap", "SOL_USDC.swap", "ETH_USDC.swap", "BTC_USD.swap", "BTC_USDT.quarter", "LPT_USDT.swap"]
    for symbol in symbols:
        exchange.GetTicker(symbol)

    arr = []
    arrParams = ["no param", "LTC_USDT.swap", "USDT.swap", "USD.swap", "USDC.swap", "USDT.futures", "BTC_USDT.quarter"]
    for p in arrParams:
        if p == "no param":
            arr.append(exchange.GetFundings())
        else:
            arr.append(exchange.GetFundings(p))

    tbls = []
    index = 0
    for fundings in arr:
        tbl = {
            "type": "table",
            "title": arrParams[index],
            "cols": ["Symbol", "Interval", "Time", "Rate"],
            "rows": [],
        }

        for f in fundings:
            tbl["rows"].append([f["Symbol"], f["Interval"] / 3600000, _D(f["Time"]), str(f["Rate"] * 100) + " %"])

        tbls.append(tbl)
        index += 1

    LogStatus(_D(), "\n Requested symbols:", symbols, "\n`" + json.dumps(tbls) + "`")
```

```rust
/*backtest
start: 2024-10-01 00:00:00
end: 2024-10-23 00:05:00
period: 1m
basePeriod: 1m
exchanges: [{"eid":"Futures_Binance","currency":"SOL_USDC"}]
*/

fn main() {
    // LPT_USDT.swap 4小时周期
    let symbols = ["SOL_USDT.swap", "ETH_USDT.swap", "LTC_USDT.swap", "SOL_USDC.swap", "ETH_USDC.swap", "BTC_USD.swap", "BTC_USDT.quarter", "LPT_USDT.swap"];
    for symbol in symbols {
        exchange.GetTicker(symbol);
    }

    let mut arr: Vec<Vec<Funding>> = Vec::new();
    let arrParams = ["no param", "LTC_USDT.swap", "USDT.swap", "USD.swap", "USDC.swap", "USDT.futures", "BTC_USDT.quarter"];
    for p in arrParams {
        if p == "no param" {
            arr.push(exchange.GetFundings(None).unwrap());
        } else {
            arr.push(exchange.GetFundings(p).unwrap());
        }
    }

    // Rust SDK 没有JSON序列化，使用format!拼接表格的JSON文本
    let mut tbls: Vec<String> = Vec::new();
    for (index, fundings) in arr.iter().enumerate() {
        let mut rows: Vec<String> = Vec::new();
        for f in fundings {
            rows.push(format!(r#"["{}", {}, "{}", "{} %"]"#, f.Symbol, f.Interval as f64 / 3600000.0, _D(f.Time), f.Rate * 100.0));
        }
        let tbl = format!(r#"{{"type": "table", "title": "{}", "cols": ["Symbol", "Interval", "Time", "Rate"], "rows": [{}]}}"#, arrParams[index], rows.join(","));
        tbls.push(tbl);
    }

    LogStatus!(_D(None), "\n Requested symbols:", format!("{:?}", symbols), format!("\n`[{}]`", tbls.join(",")));
}
```

对于不支持批量查询资金费率数据的期货交易所，如果指定```symbol```参数为查询范围，例如：```USDT.swap```或者不传```symbol```参数时接口会报错。使用这类期货交易所对象调用```GetFundings()```函数必须指定```symbol```参数为具体某个永续合约品种，才能查询到该品种的当期资金费率数据。

```exchange.GetFundings()```函数支持实盘、回测系统。

哪些期货交易所不支持批量查询资金费率、必须传入具体品种（例如```ETH_USDT.swap```），见各交易所页的注意事项（所有交易所的入口见`能力矩阵`）。

不支持的交易所：`Futures_Polymarket`、`Futures_Futu`、`Futures_IB`。调用时报错并返回空值，所有交易所的对照见`能力矩阵`。

See also: `Funding`

### Exchange

交易所对象（```exchange```、```exchanges[n]```）的属性与设置：名称和标签、当前交易对与计价币、K线周期、下单精度、汇率、接口基地址、代理与超时，以及按交易所规则签名编码。

#### exchange.GetName

```
exchange.GetName()
```

获取当前交易所对象所绑定的交易所名称。

Returns (string): 由FMZ量化交易平台定义的交易所名称。

打印交易所名称，并判断是否为币安现货。

```javascript
function main() {
    var name = exchange.GetName()
    Log(name)
    // 输出：Binance（以币安现货为例；币安U本位期货为 Futures_Binance）
    Log("是否为币安现货", name == "Binance")
}
```

```python
def main():
    name = exchange.GetName()
    Log(name)
    # 输出：Binance（以币安现货为例；币安U本位期货为 Futures_Binance）
    Log("是否为币安现货", name == "Binance")
```

```rust
fn main() {
    let name = exchange.GetName();
    Log!(name);
    // 输出：Binance（以币安现货为例；币安U本位期货为 Futures_Binance）
    Log!("是否为币安现货", name == "Binance");
}
```

```exchange.GetName()```函数通常用于识别策略代码中的```exchange```或```exchanges[1]```、```exchanges[2]```等交易所对象。加密货币期货合约交易所的名称带有固定前缀```Futures_```。

See also: `exchange.GetLabel`

#### exchange.GetLabel

```
exchange.GetLabel()
```

获取配置交易所对象时设置的自定义标签。

Returns (string): 配置交易所对象时设置的自定义标签。

打印配置交易所对象时设置的标签。

```javascript
function main() {
    Log("交易所标签", exchange.GetLabel())
    // 输出：交易所标签 <添加交易所对象时填写的标签>
}
```

```python
def main():
    Log("交易所标签", exchange.GetLabel())
    # 输出：交易所标签 <添加交易所对象时填写的标签>
```

```rust
fn main() {
    Log!("交易所标签", exchange.GetLabel());
    // 输出：交易所标签 <添加交易所对象时填写的标签>
}
```

通过设置的标签，可在策略代码中识别```exchange```或```exchanges[1]```、```exchanges[2]```等交易所对象。

See also: `exchange`

#### exchange.GetCurrency

```
exchange.GetCurrency()
```

获取当前设置的交易对。

Returns (string): 当前`exchange`交易所对象所设置的交易对。

打印交易所对象当前的交易对。

```javascript
function main() {
    Log("当前交易对", exchange.GetCurrency())
    // 输出：当前交易对 BTC_USDT
}
```

```python
def main():
    Log("当前交易对", exchange.GetCurrency())
    # 输出：当前交易对 BTC_USDT
```

```rust
fn main() {
    Log!("当前交易对", exchange.GetCurrency());
    // 输出：当前交易对 BTC_USDT
}
```

交易对格式统一采用大写形式，并使用下划线分隔```baseCurrency```与```quoteCurrency```，例如：```BTC_USDT```。个别交易所的交易对保留设置时的大小写（例如区分大小写的代币地址、小写的子市场前缀），见各交易所页的「交易对与合约代码」。

See also: `exchange.SetCurrency`

#### exchange.SetCurrency

```
exchange.SetCurrency(currency)
```

切换交易所对象`exchange`当前的交易对。

Parameters:

- `currency` (string, required): 要切换的交易对。交易对格式统一为大写，并使用下划线分隔```baseCurrency```与```quoteCurrency```，例如：```BTC_USDT```。个别交易所不转换大小写、按原样保存，见各交易所页的「交易对与合约代码」。

切换交易对，前后分别查询行情和账户信息。

```javascript
function main() {
    var ticker = exchange.GetTicker()
    Log(ticker)
    Log(exchange.GetAccount())
    // 切换交易对，注意切换后行情数据、账户信息的变化
    exchange.SetCurrency("LTC_USDT")
    Log("Switched to LTC_USDT")
    ticker = exchange.GetTicker()
    Log(ticker)
    Log(exchange.GetAccount())
}
```

```python
def main():
    ticker = exchange.GetTicker()
    Log(ticker)
    Log(exchange.GetAccount())
    exchange.SetCurrency("LTC_USDT")
    Log("Switched to LTC_USDT")
    ticker = exchange.GetTicker()
    Log(ticker)
    Log(exchange.GetAccount())
```

```rust
fn main() {
    let ticker = exchange.GetTicker(None).unwrap();
    Log!(ticker);
    Log!(exchange.GetAccount());
    // 切换交易对，注意切换后行情数据、账户信息的变化
    exchange.SetCurrency("LTC_USDT");
    Log!("Switched to LTC_USDT");
    let ticker = exchange.GetTicker(None).unwrap();
    Log!(ticker);
    Log!(exchange.GetAccount());
}
```

兼容```exchange.IO("currency", "BTC_USDT")```的切换方式，详见`exchange.IO`。

支持在回测系统中切换交易对，但回测系统中切换交易对时，计价币的名称不能改变。例如：```BTC_USDT```可以切换为```LTC_USDT```，但不能切换为```LTC_BTC```。

切换为非回测页面初始设置的交易对后，交易币的数量为0。例如：回测时回测页面上初始设置的交易对为```BTC_USDT```，```BTC```数量为3个，```USDT```数量为10000。此时立即切换为```LTC_USDT```，切换后交易币数量为0，即账户中```LTC```数量为0；切换后的交易对共享```USDT```数量，即数量仍为10000。

See also: `exchange.GetCurrency`

#### exchange.GetQuoteCurrency

```
exchange.GetQuoteCurrency()
```

获取当前交易对的计价币名称，即```quoteCurrency```。

Returns (string): 当前交易对的计价币名称。

切换交易对后读取计价币名称。

```javascript
function main() {
    exchange.SetCurrency("BTC_USDT")
    Log(exchange.GetQuoteCurrency())
    // 输出：USDT
    exchange.SetCurrency("ETH_BTC")
    Log(exchange.GetQuoteCurrency())
    // 输出：BTC
}
```

```python
def main():
    exchange.SetCurrency("BTC_USDT")
    Log(exchange.GetQuoteCurrency())
    # 输出：USDT
    exchange.SetCurrency("ETH_BTC")
    Log(exchange.GetQuoteCurrency())
    # 输出：BTC
```

```rust
fn main() {
    exchange.SetCurrency("BTC_USDT");
    Log!(exchange.GetQuoteCurrency());
    // 输出：USDT
    exchange.SetCurrency("ETH_BTC");
    Log!(exchange.GetQuoteCurrency());
    // 输出：BTC
}
```

例如：`exchange`交易所对象当前的交易对为```BTC_USDT```时，```exchange.GetQuoteCurrency()```函数返回```USDT```；如果当前交易对为```ETH_BTC```，则```exchange.GetQuoteCurrency()```函数返回```BTC```。

See also: `exchange.GetCurrency`, `exchange.SetCurrency`

#### exchange.GetPeriod

```
exchange.GetPeriod()
```

获取回测或实盘运行策略时，在发明者量化交易平台网站页面上所设置的 K 线周期，即调用 ```exchange.GetRecords()``` 函数且不传入参数时使用的默认 K 线周期。

Returns (number): K 线周期的秒数，为整数数值，单位为秒。

读取页面上设置的默认K线周期（秒）。

```javascript
function main() {
    var period = exchange.GetPeriod()
    Log("K线周期（秒）", period)
    // 输出：K线周期（秒） 3600（页面上设置的K线周期为1小时）
}
```

```python
def main():
    period = exchange.GetPeriod()
    Log("K线周期（秒）", period)
    # 输出：K线周期（秒） 3600（页面上设置的K线周期为1小时）
```

```rust
fn main() {
    let period = exchange.GetPeriod();
    Log!("K线周期（秒）", period);
    // 输出：K线周期（秒） 3600（页面上设置的K线周期为1小时）
}
```

See also: `exchange.GetRecords`

#### exchange.SetMaxBarLen

```
exchange.SetMaxBarLen(len)
```

设置K线的最大长度。

Parameters:

- `len` (number, required): K线的最大长度。

限制K线最多保留50根，再获取K线并打印数量。

```javascript
function main() {
    exchange.SetMaxBarLen(50)
    var records = exchange.GetRecords()
    if (!records) return
    Log(records.length)
    // 输出：不超过50的整数
}
```

```python
def main():
    exchange.SetMaxBarLen(50)
    records = exchange.GetRecords()
    if not records:
        return
    Log(len(records))
    # 输出：不超过50的整数
```

```rust
fn main() {
    exchange.SetMaxBarLen(50);
    let Ok(records) = exchange.GetRecords(None, None, None) else { return };
    Log!(records.len());
    // 输出：不超过50的整数
}
```

```exchange.SetMaxBarLen()```函数在加密货币策略运行时会影响以下两个方面：

- 影响首次调用时获取的K线线柱（Bar）数量。

- 影响K线线柱（Bar）数量的上限。

See also: `exchange.GetRecords`

#### exchange.SetPrecision

```
exchange.SetPrecision(pricePrecision, amountPrecision)
```

设置```exchange```交易所对象的**价格**与**下单量**的精度，设置后系统会自动忽略数据中超出精度的多余部分。

Parameters:

- `pricePrecision` (number, required): 价格数据的精度。
- `amountPrecision` (number, required): 下单量数据的精度。

设置价格保留2位小数、下单量保留3位小数。

```javascript
function main(){
    // 设置价格小数位精度为2位，下单量小数位精度为3位
    exchange.SetPrecision(2, 3)
}
```

```python
def main():
    exchange.SetPrecision(2, 3)
```

```rust
fn main() {
    // 设置价格小数位精度为2位，下单量小数位精度为3位
    exchange.SetPrecision(2, 3);
}
```

回测系统不支持该函数，回测系统的数值精度由系统自动处理。

See also: `exchange.Buy`, `exchange.Sell`

#### exchange.GetRate

```
exchange.GetRate()
```

获取交易所对象当前设置的汇率。

Returns (number): 交易所对象当前的汇率值。

读取默认汇率，设置汇率后再次读取。

```javascript
function main() {
    Log(exchange.GetRate())
    // 输出：1（未调用 SetRate 时的默认值）
    exchange.SetRate(7)
    Log(exchange.GetRate())
    // 输出：7
}
```

```python
def main():
    Log(exchange.GetRate())
    # 输出：1（未调用 SetRate 时的默认值）
    exchange.SetRate(7)
    Log(exchange.GetRate())
    # 输出：7
```

```rust
fn main() {
    Log!(exchange.GetRate());
    // 输出：1（未调用 SetRate 时的默认值）
    exchange.SetRate(7);
    Log!(exchange.GetRate());
    // 输出：7
}
```

如果未调用```exchange.SetRate()```设置过转换汇率，```exchange.GetRate()```函数将返回默认汇率值```1```，即当前显示的计价货币（quoteCurrency）相关数据未经过汇率转换。

如果已使用```exchange.SetRate()```设置过汇率值，例如```exchange.SetRate(7)```，那么通过```exchange```交易所对象获取的行情、深度、K线、订单、持仓等数据中的价格，都会乘以所设置的汇率```7```进行转换；下单时传入的价格按转换后的价格理解，发送前会除以汇率，详见`exchange.SetRate`。

如果```exchange```对应的是以美元为计价货币的交易所，在调用```exchange.SetRate(7)```后，实盘中的所有价格都会乘以```7```，转换为接近人民币（CNY）的价格。此时通过```exchange.GetRate()```获取的汇率值即为```7```。

See also: `exchange.SetRate`

#### exchange.SetRate

```
exchange.SetRate(rate)
```

设置交易所对象当前的汇率。

Parameters:

- `rate` (number, required): 转换汇率，小于等于0时按1处理（不转换）。

Returns (number): 设置之前的汇率值。

设置汇率为7，行情价格按7倍换算，再恢复为1。

```javascript
function main(){
    Log(exchange.GetTicker())
    // 设置汇率转换
    exchange.SetRate(7)
    Log(exchange.GetTicker())
    // 设置为1，不转换
    exchange.SetRate(1)
}
```

```python
def main():
    Log(exchange.GetTicker())
    exchange.SetRate(7)
    Log(exchange.GetTicker())
    exchange.SetRate(1)
```

```rust
fn main() {
    Log!(exchange.GetTicker(None));
    // 设置汇率转换
    exchange.SetRate(7);
    Log!(exchange.GetTicker(None));
    // 设置为1，不转换
    exchange.SetRate(1);
}
```

如果使用```exchange.SetRate()```函数设置过一个汇率值，例如设置为7。那么当前```exchange```这个交易所对象获取到的行情、深度、K线、订单、持仓等数据中的价格，以及账户中计价币的```Balance```、```FrozenBalance```，都会被乘以设置的汇率7，进行转换；数量不转换。
下单时（```exchange.Buy()```、```exchange.Sell()```、```exchange.CreateOrder()```）传入的价格按转换后的价格理解，发送给交易所之前会除以汇率换回原币价格；市价单的```-1```等非正数价格不转换。```exchange.ModifyOrder()```与条件单的价格不转换，需要按交易所原币价格传入。
例如```exchange```是以美元为计价货币的交易所。执行```exchange.SetRate(7)```之后，实盘所有价格都会被乘7转换成接近**CNY**计价的价格。

See also: `exchange.GetRate`

#### exchange.SetBase

```
exchange.SetBase(s)
```

设置`exchange`交易所对象所使用的交易所API接口基地址。

Parameters:

- `s` (string, required): 交易所API接口的基地址。

切换API基地址，前后各获取一次行情。

```javascript
function main() {
    // 使用默认基地址
    Log(exchange.GetTicker())
    // 切换为https://aws.okx.com
    exchange.SetBase("https://aws.okx.com")
    Log(exchange.GetTicker())
}
```

```python
def main():
    Log(exchange.GetTicker())
    exchange.SetBase("https://aws.okx.com")
    Log(exchange.GetTicker())
```

```rust
fn main() {
    // 使用默认基地址
    Log!(exchange.GetTicker(None));
    // 切换为https://aws.okx.com
    exchange.SetBase("https://aws.okx.com");
    Log!(exchange.GetTicker(None));
}
```

回测系统不支持切换交易所API接口基地址，因为回测系统是一个沙盒模拟环境，不会真正访问交易所的API接口。

See also: `exchange.IO`

#### exchange.GetBase

```
exchange.GetBase()
```

获取当前交易所 API 接口的基础地址。

Returns (string): 当前交易所 API 接口的基础地址。

打印当前交易所对象使用的API基地址。

```javascript
function main() {
    Log(exchange.GetBase())
    // 输出：https://api.binance.com（以币安现货为例）
}
```

```python
def main():
    Log(exchange.GetBase())
    # 输出：https://api.binance.com（以币安现货为例）
```

```rust
fn main() {
    Log!(exchange.GetBase());
    // 输出：https://api.binance.com（以币安现货为例）
}
```

See also: `exchange.SetBase`

#### exchange.SetProxy

```
exchange.SetProxy(proxy)
```

设置`exchange`交易所对象的代理配置。

Parameters:

- `proxy` (string, required): 代理配置，格式为```协议://[用户名:密码@]主机:端口```，传空字符串取消代理。

Returns (bool / 空值): 设置成功返回```true```；代理格式不正确（协议不支持或缺少主机、端口）时返回空值，可通过`GetLastError`获取错误信息，原有代理设置不变。

配置`exchange`交易所对象```socks5```代理。

```javascript
function main() {
    exchange.SetProxy("socks5://192.168.1.10:8080")
    // 如果访问不到交易所行情接口，设置一个可用的socks5代理，就可以访问到行情接口了
    Log(exchange.GetTicker())
}
```

```python
def main():
    exchange.SetProxy("socks5://192.168.1.10:8080")
    Log(exchange.GetTicker())
```

```rust
fn main() {
    exchange.SetProxy("socks5://192.168.1.10:8080");
    // 如果访问不到交易所行情接口，设置一个可用的socks5代理，就可以访问到行情接口了
    Log!(exchange.GetTicker(None));
}
```

每个`exchange`交易所对象可以设置一个代理，设置代理后该交易所对象访问交易所的网络请求（REST请求以及交易所连接器建立的WebSocket连接）都会通过代理访问。

支持的代理协议：```http://```、```https://```、```socks5://```、```socks5h://```（由代理服务器解析域名）、```ssocks5://```（基于TLS的socks5），都可以带用户名和密码。以第一个添加的交易所对象`exchange`即：```exchanges[0]```为例：
- 设置代理，无用户名，无密码：```exchange.SetProxy("socks5://127.0.0.1:8889")```。
- 设置代理，输入用户名和密码：```exchange.SetProxy("socks5://username:password@127.0.0.1:8889")```。```username```为用户名，```password```为密码。
- 切换为正常模式，不使用代理：```exchange.SetProxy("")```。

不支持按交易所对象指定发出请求的IP地址（旧版的```ip://```写法）。需要指定出口IP时，可以在启动托管者时用命令行参数```-I```全局指定。

See also: `exchange`

#### exchange.SetTimeout

```
exchange.SetTimeout(timeout)
```

设置`exchange`交易所对象```rest```请求的超时时间。

Parameters:

- `timeout` (number, required): 超时时间的毫秒数。

把REST请求超时设为3秒后获取行情。

```javascript
function main() {
    exchange.SetTimeout(3000)
    Log(exchange.GetTicker())
}
```

```python
def main():
    exchange.SetTimeout(3000)
    Log(exchange.GetTicker())
```

```rust
fn main() {
    exchange.SetTimeout(3000);
    Log!(exchange.GetTicker(None));
}
```

参数```timeout```为毫秒数值，1000毫秒等于1秒。该设置仅适用于```rest```协议，用于设置```rest```请求的超时时间，只需设置一次即可生效。例如：```exchange.SetTimeout(3000)```，将```exchange```交易所对象的```rest```请求超时时间设置为3秒；调用```exchange.GetTicker()```等涉及网络请求的函数时，若超过3秒未收到应答则判定为超时，发生超时的函数调用将返回空值。

```SetTimeout()```不是全局函数，而是`exchange`交易所对象的方法。

See also: `exchange`

#### exchange.Encode

```
exchange.Encode(algo, inputFormat, outputFormat, data)
exchange.Encode(algo, inputFormat, outputFormat, data, keyFormat, key)
```

签名加密计算。

Parameters:

- `algo` (string, required): 签名或哈希使用的算法，例如```sha256```、```ed25519```；全部取值见备注。
- `inputFormat` (string, required): 用于指定```data```参数的数据格式。```inputFormat```参数支持设置为："raw"，"hex"，"base64"，"string"其中之一。"raw"表示数据为原始数据，"hex"表示数据为```hex```编码，"base64"表示数据为```base64```编码，"string"表示数据为字符串。
- `outputFormat` (string, required): 用于指定输出的数据格式。```outputFormat```参数支持设置为："raw"，"hex"，"base64"，"string"其中之一。"raw"表示数据为原始数据，"hex"表示数据为```hex```编码，"base64"表示数据为```base64```编码，"string"表示数据为字符串。
- `data` (string, required): 所要处理的数据。
- `keyFormat` (string, optional): 用于指定```key```参数的数据格式。```keyFormat```参数支持设置为："raw"，"hex"，"base64"，"string"其中之一。"raw"表示数据为原始数据，"hex"表示数据为```hex```编码，"base64"表示数据为```base64```编码，"string"表示数据为字符串。
- `key` (string, optional): 签名计算时使用的密钥，可以使用明文字符串。也可以使用```"{{accesskey}}"```、```"{{secretkey}}"```代指`exchange`交易所对象中配置的```accessKey```和```secretKey```。

Returns (string): 计算出来的哈希值编码。

用交易所对象配置的secretKey对请求参数做HMAC-SHA256签名。

```javascript
function main() {
    var query = "symbol=BTCUSDT&timestamp=" + Date.now()
    var signature = exchange.Encode("sha256", "raw", "hex", query, "raw", "{{secretkey}}")
    Log(signature)
    // 输出：64个字符的十六进制签名
}
```

```python
import time
def main():
    query = "symbol=BTCUSDT&timestamp=" + str(int(time.time() * 1000))
    signature = exchange.Encode("sha256", "raw", "hex", query, "raw", "{{secretkey}}")
    Log(signature)
    # 输出：64个字符的十六进制签名
```

```rust
fn main() {
    let query = format!("symbol=BTCUSDT&timestamp={}", Unix() * 1000);
    let signature = exchange.Encode("sha256", "raw", "hex", &query, "raw", "{{secretkey}}");
    Log!(signature);
    // 输出：64个字符的十六进制签名
}
```

Bybit v5私有WebSocket鉴权并订阅仓位推送（wss协议）示例：传入```key```时按HMAC计算，签名为```HMAC_SHA256(secretKey, "GET/realtime" + expires)```的hex编码，```expires```为毫秒时间戳；```"{{secretkey}}"```引用交易所对象中配置的```secretKey```（按字符串使用，所以```keyFormat```为```string```），策略代码中不出现明文密钥。

```javascript
function main() {
    var APIKEY = "your Bybit API Key"
    // expires为毫秒时间戳；签名 = HMAC_SHA256(secretKey, "GET/realtime" + expires)，hex编码
    var expires = Date.now() + 10000
    var signature = exchange.Encode("sha256", "string", "hex", "GET/realtime" + expires, "string",
        "{{secretkey}}")
    var client = Dial("wss://stream.bybit.com/v5/private", 60)
    if (!client) {
        Log("连接失败")
        return
    }
    client.write(JSON.stringify({op: "auth", args: [APIKEY, expires, signature]}))
    client.write(JSON.stringify({op: "subscribe", args: ["position"]}))
    var positions = {}
    var lastPing = Date.now()
    while (true) {
        // Bybit建议每20秒发送一次心跳
        if (Date.now() - lastPing >= 20000) {
            client.write(JSON.stringify({op: "ping"}))
            lastPing = Date.now()
        }
        var buf = client.read(1000)
        if (buf === "") {
            break    // 连接已断开
        }
        if (!buf) {
            continue
        }
        var msg = JSON.parse(buf)
        if (msg.op == "auth" && !msg.success) {
            Log("auth failed", msg.ret_msg)
            break
        }
        if (msg.topic == "position") {
            msg.data.forEach(function(p) {
                var key = p.symbol + "/" + p.positionIdx
                var now = p.side + " " + p.size
                if (positions[key] !== now) {
                    Log("position change", key, positions[key], "->", now, "@")
                    positions[key] = now
                }
            })
        }
    }
}
```

```python
import time
import json
def main():
    APIKEY = "your Bybit API Key"
    # expires为毫秒时间戳；签名 = HMAC_SHA256(secretKey, "GET/realtime" + expires)，hex编码
    expires = int(time.time() * 1000) + 10000
    signature = exchange.Encode("sha256", "string", "hex", "GET/realtime" + str(expires), "string",
        "{{secretkey}}")
    client = Dial("wss://stream.bybit.com/v5/private", 60)
    if not client:
        Log("连接失败")
        return
    client.write(json.dumps({"op": "auth", "args": [APIKEY, expires, signature]}))
    client.write(json.dumps({"op": "subscribe", "args": ["position"]}))
    positions = {}
    lastPing = time.time()
    while True:
        # Bybit建议每20秒发送一次心跳
        if time.time() - lastPing >= 20:
            client.write(json.dumps({"op": "ping"}))
            lastPing = time.time()
        buf = client.read(1000)
        if buf == "":
            break    # 连接已断开
        if not buf:
            continue
        msg = json.loads(buf)
        if msg.get("op") == "auth" and not msg.get("success"):
            Log("auth failed", msg.get("ret_msg"))
            break
        if msg.get("topic") == "position":
            for p in msg["data"]:
                key = "%s/%s" % (p["symbol"], p["positionIdx"])
                now = p["side"] + " " + p["size"]
                if positions.get(key) != now:
                    Log("position change", key, positions.get(key), "->", now, "@")
                    positions[key] = now
```

```rust
use std::collections::HashMap;

fn main() {
    let apikey = "your Bybit API Key";
    // expires为毫秒时间戳；签名 = HMAC_SHA256(secretKey, "GET/realtime" + expires)，hex编码
    let expires = Unix() * 1000 + 10000;
    let signature = exchange.Encode("sha256", "string", "hex", &format!("GET/realtime{}", expires), "string", "{{secretkey}}");
    let mut client = Dial::new("wss://stream.bybit.com/v5/private", 60);
    if !client.Valid() {
        Log!("连接失败");
        return;
    }
    // Rust SDK没有JSON序列化功能，用字符串拼接构造请求
    client.write(&format!(r#"{{"op":"auth","args":["{}",{},"{}"]}}"#, apikey, expires, signature), 0);
    client.write(r#"{"op":"subscribe","args":["position"]}"#, 0);
    let mut positions: HashMap<String, String> = HashMap::new();
    let mut last_ping = Unix();
    while !client.IsClosed() {
        // Bybit建议每20秒发送一次心跳
        if Unix() - last_ping >= 20 {
            client.write(r#"{"op":"ping"}"#, 0);
            last_ping = Unix();
        }
        let buf = client.read(1000);
        if buf == "" {
            continue;
        }
        let msg = match JSONParse(&buf) {
            Some(v) => v,
            None => continue,
        };
        if msg["op"].as_str() == Some("auth") && msg["success"].as_bool() != Some(true) {
            Log!("auth failed", msg["ret_msg"].as_str().unwrap_or(""));
            break;
        }
        if msg["topic"].as_str() == Some("position") {
            if let Some(arr) = msg["data"].as_array() {
                for p in arr {
                    let key = format!("{}/{}", p["symbol"].as_str().unwrap_or(""), p["positionIdx"].as_i64().unwrap_or(0));
                    let now = format!("{} {}", p["side"].as_str().unwrap_or(""), p["size"].as_str().unwrap_or("0"));
                    if positions.get(&key) != Some(&now) {
                        Log!("position change", &key, &now, "@");
                        positions.insert(key, now);
                    }
                }
            }
        }
    }
}
```

仅实盘支持调用```exchange.Encode()```函数。```"{{accesskey}}"```、```"{{secretkey}}"```的引用方式仅在```exchange.Encode()```函数使用时有效。

```algo```参数的取值：

| 类别 | 取值 |
| - | - |
| 不使用算法 | ```raw``` |
| 签名 | ```sign```、```signTx``` |
| 哈希（MD、SHA-1、SHA-2） | ```md4```、```md5```、```sha1```、```sha256```、```sha512```、```sha512.384```、```sha512.256```、```sha512.224``` |
| 哈希（SHA-3、Keccak） | ```keccak256```、```sha3.224```、```sha3.256```、```sha3.384```、```sha3.512```、```sha3.keccak256```、```sha3.keccak512``` |
| 哈希（其它） | ```ripemd160```、```blake2b.256```、```blake2b.512```、```blake2s.128```、```blake2s.256``` |
| 字符串编码、解码 | ```text.encoder.utf8```、```text.decoder.utf8```、```text.encoder.gbk```、```text.decoder.gbk``` |
| Ed25519 | ```ed25519```、```ed25519.seed```；可以指定哈希算法，例如```ed25519.md5```、```ed25519.sha512``` |

See also: `exchange`, `Encode`

### IO

调用交易所对象的扩展功能，第一个参数是指令名。先看`exchange.IO`了解全部指令以及各交易所特有的指令，再按需查看各指令的详细说明。Web3、Uniswap、Jupiter等交易所对象的专属指令见各自的交易所页，例如`Web3`、`Uniswap`、`Jupiter`。

#### exchange.IO

```
exchange.IO(k, ...args)
```

调用交易所对象相关的其它接口。

Parameters:

- `k` (string, required): 调用类型标识符，不同的值对应不同的功能，详见下方各章节说明。
- `args` (string / number / bool / object / array / any, optional): 扩展参数，根据```k```值不同传入不同的参数，个数和类型不固定；部分指令不需要参数。

Returns (string / number / bool / object / array / any): 返回值由指令决定，部分指令成功时也返回空值；调用失败时返回空值，可通过`GetLastError`获取错误信息。

切换保证金模式并调用交易所原始接口（以币安期货为例）。

```javascript
function main() {
    exchange.SetContractType("swap")
    // 当前合约切换为逐仓
    exchange.IO("cross", false)
    // 第三个参数指定合约：ETH_USDT永续合约切换为全仓
    exchange.IO("cross", true, "ETH_USDT.swap")
    // 调用交易所未封装的接口
    var ret = exchange.IO("api", "GET", "/fapi/v1/time")
    Log(ret)
}
```

```python
def main():
    exchange.SetContractType("swap")
    exchange.IO("cross", False)
    exchange.IO("cross", True, "ETH_USDT.swap")
    ret = exchange.IO("api", "GET", "/fapi/v1/time")
    Log(ret)
```

```rust
fn main() {
    let _ = exchange.SetContractType("swap");
    // 当前合约切换为逐仓
    let _ = exchange.IO(("cross", false));
    // 第三个参数指定合约：ETH_USDT永续合约切换为全仓
    let _ = exchange.IO(("cross", true, "ETH_USDT.swap"));
    // 调用交易所未封装的接口
    let ret = exchange.IO(("api", "GET", "/fapi/v1/time"));
    Log!(ret);
}
```

##### 指令一览

| 指令 | 说明 |
| - | - |
| ```api``` | 调用交易所未封装的原始接口 |
| ```currency``` | 运行时切换交易对 |
| ```base``` | 查询或切换接口基地址 |
| ```simulate```、```cross```、```dual```、```unified```等 | 切换交易模式，见```exchange.IO(mode, value)``` |
| ```rate``` / ```quota``` | API调用限流 |

各指令的详细说明见本分类下的各个页面；各交易所对象特有的指令见下方索引，参数与说明见交易所页（入口见`能力矩阵`）。

##### 返回值与错误判断

返回值由指令决定。部分指令（例如一些期货交易所的```cross```、```dual```、```unified```）成功时也返回空值，与调用失败的返回值相同；需要确认是否成功时，调用后用`GetLastError`读取错误信息。交易所不支持的指令会报错（```unsupported io method```）并返回空值。

```cross```、```dual```、```unified```这类作用于具体合约的指令，可以在取值之后再传入一个```symbol```参数指定合约，例如```exchange.IO("cross", false, "ETH_USDT.swap")```；不传时作用于当前交易对、合约。指令是按合约还是对整个账户生效、各指令的返回值，见交易所页的专属IO指令表。

##### 各交易所专属指令

下表列出各交易所对象特有的```exchange.IO()```指令，参数与说明见交易所页。

| 指令 | 交易所 |
| - | - |
| ```abi``` | `Web3` |
| ```accountId``` | `Futures_Crypto`、`Poloniex` |
| ```accounts``` | `Futures_Futu`、`Futures_IB` |
| ```accountType``` | `Bybit`、`Futures_Bybit` |
| ```address``` | `Pendle`、`Uniswap`、`Jupiter`、`KyberSwap`、`OneInch`、`OKX_DEX`、`Web3` |
| ```addresses``` | `OKX_DEX` |
| ```agent``` | `Futures_Boros` |
| ```allChainBalance``` | `OKX_DEX` |
| ```allowance``` | `OKX_DEX` |
| ```allTokens``` | `OKX_DEX` |
| ```api``` | `Hyperliquid`、`Futures_Hyperliquid`、`Futures_Lighter`、`Futures_Polymarket`、`Futures_IB`、`Exchange`、`Web3` |
| ```approve``` | `Pendle`、`Uniswap`、`KyberSwap`、`OneInch`、`OKX_DEX` |
| ```approveAgent``` | `Futures_Boros` |
| ```apy``` | `Pendle` |
| ```autoTopUp``` | `Futures_Boros` |
| ```balanceSupportedChains``` | `OKX_DEX` |
| ```base``` | `Pendle`、`Futures_Boros`、`Uniswap`、`Jupiter`、`KyberSwap`、`OneInch`、`Futures_Polymarket`、`Web3` |
| ```batchOrders``` | `Futures_Polymarket` |
| ```broadcast``` | `OKX_DEX` |
| ```broadcastSupportedChains``` | `OKX_DEX` |
| ```calcOrderHashAndSign``` | `Futures_EdgeX` |
| ```call``` | `Web3` |
| ```cancelTx``` | `Web3` |
| ```cancelWait``` | `Pendle`、`Uniswap`、`KyberSwap`、`OneInch` |
| ```cancelWithdraw``` | `Futures_Boros` |
| ```clob``` | `Futures_Polymarket` |
| ```coinmBase``` | `Futures_Binance` |
| ```config``` | `OKX_DEX` |
| ```contracts``` | `Uniswap`、`KyberSwap`、`OneInch`、`Web3` |
| ```cross``` | `Futures_Binance`、`Futures_Bitget`、`Futures_Bybit`、`Futures_Coinw`、`Futures_DeepCoin`、`Futures_DigiFinex`、`Futures_GateIO`、`Futures_HuobiDM`、`Futures_Kraken`、`Futures_KuCoin`、`Futures_MEXC`、`Futures_OKCoin`、`Futures_WOO`、`Futures_Hyperliquid`、`Futures_Lighter`、`Futures_ApolloX`、`Futures_Aster` |
| ```data``` | `Futures_Polymarket` |
| ```deadline``` | `Uniswap`、`KyberSwap`、`OneInch` |
| ```debug``` | `Futures_IB` |
| ```decode``` | `Web3` |
| ```deposit``` | `Futures_Boros` |
| ```dex``` | `Futures_Hyperliquid` |
| ```dexes``` | `Jupiter` |
| ```dual``` | `Futures_Binance`、`Futures_Bitget`、`Futures_Bybit`、`Futures_GateIO`、`Futures_HuobiDM`、`Futures_OKCoin`、`Futures_WOO`、`Futures_ApolloX`、`Futures_Aster` |
| ```eapiBase``` | `Futures_Binance` |
| ```encode``` | `Web3` |
| ```encodePacked``` | `Web3` |
| ```expiresAfter``` | `Hyperliquid`、`Futures_Hyperliquid` |
| ```expiry``` | `Futures_Lighter` |
| ```fromUnits``` | `Web3` |
| ```gamma``` | `Futures_Polymarket` |
| ```gasBalance``` | `Futures_Boros` |
| ```gasLevel``` | `OKX_DEX` |
| ```gasMultiplier``` | `Pendle`、`Uniswap`、`KyberSwap`、`OneInch`、`OKX_DEX` |
| ```hash``` | `Web3` |
| ```historyKlines``` | `Futures_Futu` |
| ```ignore``` | `Futures_IB` |
| ```instrument``` | `Futures_Futu` |
| ```io``` | `Exchange` |
| ```isolatedTransfer``` | `Futures_Boros` |
| ```key``` | `OKX_DEX`、`Web3` |
| ```lock``` | `Futures_Futu` |
| ```logs``` | `Web3` |
| ```lp.add``` | `Uniswap` |
| ```lp.collect``` | `Uniswap` |
| ```lp.decrease``` | `Uniswap` |
| ```lp.history``` | `Uniswap` |
| ```lp.increase``` | `Uniswap` |
| ```lp.plan``` | `Uniswap` |
| ```lp.pool``` | `Uniswap` |
| ```lp.pools``` | `Uniswap` |
| ```lp.positions``` | `Uniswap` |
| ```lp.remove``` | `Uniswap` |
| ```lp.select``` | `Uniswap` |
| ```lp.simulate``` | `Uniswap` |
| ```lp.ticks``` | `Uniswap` |
| ```lp.track``` | `Uniswap` |
| ```market``` | `Pendle`、`Futures_Boros` |
| ```marketDataType``` | `Futures_IB` |
| ```markets_cursor``` | `Futures_Polymarket` |
| ```marketSupportedChains``` | `OKX_DEX` |
| ```mbase``` | `Futures_Bitfinex` |
| ```merge``` | `Futures_DeepCoin`、`Futures_Hyperliquid`、`Futures_Polymarket` |
| ```mergeQuestion``` | `Futures_Hyperliquid` |
| ```multicall``` | `Web3` |
| ```negate``` | `Futures_Hyperliquid` |
| ```nonce``` | `Web3` |
| ```orderExpiry``` | `Pendle` |
| ```orderId``` | `Futures_IB` |
| ```price``` | `Pendle` |
| ```priorityFee``` | `Jupiter` |
| ```proxyWalletAddress``` | `Futures_Polymarket` |
| ```quote``` | `OKX_DEX` |
| ```receipt``` | `Pendle`、`Uniswap`、`Jupiter`、`KyberSwap`、`OneInch` |
| ```redeem``` | `Futures_Polymarket` |
| ```refresh``` | `Futures_Futu` |
| ```regChain``` | `OKX_DEX` |
| ```regToken``` | `OKX_DEX` |
| ```reqId``` | `Futures_IB` |
| ```route``` | `Uniswap`、`Jupiter`、`KyberSwap`、`OneInch` |
| ```rpc``` | `Futures_Boros`、`OKX_DEX` |
| ```rps``` | `Jupiter` |
| ```scan``` | `Futures_IB` |
| ```selfTradePreventionMode``` | `Backpack`、`Futures_Backpack`、`Binance`、`Futures_Binance` |
| ```sendBase``` | `Uniswap`、`KyberSwap`、`OneInch`、`Web3` |
| ```sign``` | `Web3` |
| ```signHost``` | `Futures_HuobiDM` |
| ```signingKey``` | `Futures_Aevo` |
| ```signMessage``` | `Web3` |
| ```signTx``` | `OKX_DEX` |
| ```signTypedData``` | `Web3` |
| ```simulate``` | `Bitget`、`Futures_Bitget`、`Futures_DigiFinex`、`OKEX`、`Futures_OKCoin`、`Uniswap`、`KyberSwap`、`OneInch` |
| ```slippage``` | `Pendle`、`Futures_Boros`、`Uniswap`、`Jupiter`、`KyberSwap`、`OneInch`、`OKX_DEX` |
| ```source``` | `Hyperliquid`、`Futures_Hyperliquid` |
| ```speedUp``` | `Web3` |
| ```split``` | `Futures_Hyperliquid`、`Futures_Polymarket` |
| ```status``` | `Futures_Futu`、`Futures_IB` |
| ```statusDetail``` | `Futures_Futu` |
| ```subAccount``` | `Gemini` |
| ```swapSupportedChains``` | `OKX_DEX` |
| ```tdMode``` | `OKEX`、`Futures_OKCoin` |
| ```tick``` | `Futures_Boros` |
| ```tickers_cursor``` | `Futures_Polymarket` |
| ```time``` | `Futures_IB` |
| ```timeout``` | `Futures_Futu` |
| ```token``` | `Uniswap`、`Jupiter`、`KyberSwap`、`OneInch` |
| ```tokenSearch``` | `OKX_DEX` |
| ```topUpGas``` | `Futures_Boros` |
| ```toUnits``` | `Web3` |
| ```trade_margin``` | `AscendEx`、`Binance`、`Bybit`、`Crypto`、`GateIO`、`Huobi`、`OKEX`、`WOO` |
| ```trade_normal``` | `AscendEx`、`Binance`、`Bybit`、`Crypto`、`GateIO`、`Huobi`、`OKEX`、`WOO` |
| ```trade_super_margin``` | `Binance`、`GateIO`、`Huobi`、`OKEX` |
| ```transfer``` | `Uniswap`、`Jupiter`、`KyberSwap`、`OneInch` |
| ```unified``` | `Binance`、`Futures_Binance`、`GateIO`、`Futures_GateIO`、`Futures_HuobiDM` |
| ```uniswapV3``` | `Web3` |
| ```unlock``` | `Futures_Futu` |
| ```unwrap``` | `Uniswap`、`KyberSwap`、`OneInch` |
| ```vaultAddress``` | `Hyperliquid`、`Futures_Hyperliquid` |
| ```version``` | `Bitfinex` |
| ```wait``` | `Futures_Futu`、`Futures_IB` |
| ```waitReceipt``` | `Web3` |
| ```wallet``` | `Futures_Boros` |
| ```walletAddress``` | `Hyperliquid`、`Futures_Hyperliquid` |
| ```withdraw``` | `Futures_Boros` |
| ```wrap``` | `Uniswap`、`KyberSwap`、`OneInch` |

See also: `exchange.SetBase`, `exchange.SetCurrency`

#### exchange.IO("api", ...)

```
exchange.IO(k, httpMethod, resource)
exchange.IO(k, httpMethod, resource, params)
exchange.IO(k, httpMethod, resource, params, raw)
```

Forms:

- `exchange.IO("api", ...)`

调用交易所未封装的原始REST接口，签名由平台自动处理。Web3交易所对象上的同名指令用于调用智能合约，见`exchange.IO("api", ...)`。

Parameters:

- `k` (string, required): 固定为```api```，用于调用交易所原始接口。
- `httpMethod` (string, required): 请求方法，例如```GET```、```POST```、```DELETE```。
- `resource` (string, required): 接口路径，也可以写完整URL（主机部分替换当前基地址）。
- `params` (string, optional): URL编码格式的请求参数。
- `raw` (string, optional): 原始请求体，例如JSON字符串。

Returns (object / array / string / 空值): 返回交易所接口的完整应答，应答不是JSON时原样返回字符串；调用失败时返回空值。仅实盘支持。

使用```api```模式调用```Futures_OKCoin```（OKX期货）批量下单接口，通过```raw```参数传递JSON订单数据。

```javascript
function main() {
    var arrOrders = [
        {"instId":"BTC-USDT-SWAP","tdMode":"cross","side":"buy","ordType":"limit","px":"16000","sz":"1","posSide":"long"},
        {"instId":"BTC-USDT-SWAP","tdMode":"cross","side":"buy","ordType":"limit","px":"16000","sz":"2","posSide":"long"}
    ]

    // 调用 exchange.IO 直接访问交易所批量下单接口
    var ret = exchange.IO("api", "POST", "/api/v5/trade/batch-orders", "", JSON.stringify(arrOrders))
    Log(ret)
}
```

```python
import json
def main():
    arrOrders = [
        {"instId":"BTC-USDT-SWAP","tdMode":"cross","side":"buy","ordType":"limit","px":"16000","sz":"1","posSide":"long"},
        {"instId":"BTC-USDT-SWAP","tdMode":"cross","side":"buy","ordType":"limit","px":"16000","sz":"2","posSide":"long"}
    ]
    ret = exchange.IO("api", "POST", "/api/v5/trade/batch-orders", "", json.dumps(arrOrders))
    Log(ret)
```

```rust
fn main() {
    // Rust无JSON序列化，直接用原始字符串构造订单数组
    let arrOrders = r#"[
        {"instId":"BTC-USDT-SWAP","tdMode":"cross","side":"buy","ordType":"limit","px":"16000","sz":"1","posSide":"long"},
        {"instId":"BTC-USDT-SWAP","tdMode":"cross","side":"buy","ordType":"limit","px":"16000","sz":"2","posSide":"long"}
    ]"#;

    // 调用 exchange.IO 直接访问交易所批量下单接口，多参数以元组传入
    let ret = exchange.IO(("api", "POST", "/api/v5/trade/batch-orders", "", arrOrders));
    Log!(ret);
}
```

```params```参数中键值为字符串时，需要用单引号包裹参数值。

```javascript
var amount = 1
var price = 10
var basecurrency = "ltc"
function main () {
    // 注意 amount.toString() 和 price.toString() 左边右边都有一个 ' 字符
    var message = "symbol=" + basecurrency + "&amount='" + amount.toString() + "'&price='" + price.toString() + "'&side=buy" + "&type=limit"
    var id = exchange.IO("api", "POST", "/v1/order/new", message)
}
```

```python
amount = 1
price = 10
basecurrency = "ltc"
def main():
    message = "symbol=" + basecurrency + "&amount='" + str(amount) + "'&price='" + str(price) + "'&side=buy" + "&type=limit"
    id = exchange.IO("api", "POST", "/v1/order/new", message)
```

```rust
fn main() {
    let amount = 1;
    let price = 10;
    let basecurrency = "ltc";
    // 注意 amount 和 price 参数值的左边右边都有一个 ' 字符
    let message = format!("symbol={}&amount='{}'&price='{}'&side=buy&type=limit", basecurrency, amount, price);
    let id = exchange.IO(("api", "POST", "/v1/order/new", message));
}
```

```resource```参数支持完整URL。

```javascript
function main() {
    var ret = exchange.IO("api", "GET", "https://www.okx.com/api/v5/account/max-withdrawal", "ccy=BTC")
    Log(ret)
}
```

```python
def main():
    ret = exchange.IO("api", "GET", "https://www.okx.com/api/v5/account/max-withdrawal", "ccy=BTC")
    Log(ret)
```

```rust
fn main() {
    let ret = exchange.IO(("api", "GET", "https://www.okx.com/api/v5/account/max-withdrawal", "ccy=BTC"));
    Log!(ret);
}
```

不使用```raw```参数的GET请求。

```javascript
function main(){
    var ret = exchange.IO("api", "GET", "/api/v5/trade/orders-pending", "instType=SPOT")
    Log(ret)
}
```

```python
def main():
    ret = exchange.IO("api", "GET", "/api/v5/trade/orders-pending", "instType=SPOT")
    Log(ret)
```

```rust
fn main() {
    let ret = exchange.IO(("api", "GET", "/api/v5/trade/orders-pending", "instType=SPOT"));
    Log!(ret);
}
```

##### 直接调用交易所API（```api```模式）

```javascript
exchange.IO("api", httpMethod, resource, params, raw)
```

调用交易所未封装的原始API接口。FMZ自动处理签名验证，只需填请求参数。

| 参数 | 类型 | 必填 | 说明 |
| - | - | - | - |
| httpMethod | string | 是 | ```GET```、```POST```等 |
| resource | string | 是 | 请求路径或完整URL |
| params | string | 否 | URL编码格式的请求参数 |
| raw | string | 否 | 原始请求体（JSON等） |

调用失败返回空值。仅实盘支持。

See also: `exchange.IO`

#### exchange.IO("currency", ...)

```
exchange.IO(k, symbol)
```

Forms:

- `exchange.IO("currency", ...)`

在运行时切换交易所对象的当前交易对。

Parameters:

- `k` (string, required): 固定为```currency```，用于切换交易对。
- `symbol` (string, required): 交易对，大写、下划线分隔，例如```ETH_USDT```。

Returns (bool / 空值): 切换成功返回```true```；交易对格式不正确时返回空值，当前交易对不变。

运行时切换交易对。

```javascript
function main() {
    // 例如开始实盘上设置交易所对象目前交易对为BTC_USDT，打印目前交易对行情
    Log(exchange.GetTicker())
    // 切换交易对为LTC_BTC
    exchange.IO("currency", "LTC_BTC")
    Log(exchange.GetTicker())
}
```

```python
def main():
    Log(exchange.GetTicker())
    exchange.IO("currency", "LTC_BTC")
    Log(exchange.GetTicker())
```

```rust
fn main() {
    // 例如开始实盘上设置交易所对象目前交易对为BTC_USDT，打印目前交易对行情
    Log!(exchange.GetTicker(None));
    // 切换交易对为LTC_BTC
    let _ = exchange.IO(("currency", "LTC_BTC"));
    Log!(exchange.GetTicker(None));
}
```

##### 运行时切换交易对（```currency```模式）

```javascript
exchange.IO("currency", "ETH_USDT")
```

动态切换交易对，格式为大写下划线分隔。等同于`exchange.SetCurrency`。

> 回测仅支持现货且只能切换相同计价币的交易对。期货切换交易对后合约代码保持不变，需要换合约时再调用```exchange.SetContractType()```。

See also: `exchange.IO`

#### exchange.IO("base", ...)

```
exchange.IO(k)
exchange.IO(k, address)
```

Forms:

- `exchange.IO("base", ...)`

查询或切换交易所接口的基地址。Web3交易所对象上设置的是RPC节点地址，见`exchange.IO("base", ...)`。

Parameters:

- `k` (string, required): 固定为```base```，用于查询或切换接口基地址。
- `address` (string, optional): 新的基地址，例如```https://api.example.com```。不传时查询当前基地址。

Returns (string / 空值): 不传```address```时返回当前基地址；传入```address```时切换基地址，并返回切换之前的基地址。调用失败时返回空值。

切换交易所接口基地址。

```javascript
function main () {
    // exchanges[0]就是实盘创建时，第一个添加的交易所对象
    var old = exchanges[0].IO("base", "https://api.huobi.pro")
    Log("切换前的基地址：", old, "当前基地址：", exchanges[0].IO("base"))
}
```

```python
def main():
    old = exchanges[0].IO("base", "https://api.huobi.pro")
    Log("切换前的基地址：", old, "当前基地址：", exchanges[0].IO("base"))
```

```rust
fn main() {
    // exchanges[0]就是实盘创建时，第一个添加的交易所对象
    let old = exchanges[0].IO(("base", "https://api.huobi.pro"));
    Log!("切换前的基地址：", old, "当前基地址：", exchanges[0].IO("base"));
}
```

##### 查询与切换基地址（```base```模式）

- ```exchange.IO("base", address)```：切换交易所接口基地址，等同于`exchange.SetBase`。
- ```exchange.IO("base")```：查询当前基地址，没有切换过时返回交易所的默认接口地址，等同于`exchange.GetBase`。

个别交易所另有单独的基地址指令（例如币本位合约、期权或行情接口各自的基地址），见交易所页的专属IO指令表（入口见`能力矩阵`）。

See also: `exchange.IO`, `exchange.SetBase`, `exchange.GetBase`

#### exchange.IO(mode, value)

```
exchange.IO(mode)
exchange.IO(mode, value)
```

Forms:

- `exchange.IO(mode, value)`

切换交易所的交易模式，包括模拟盘/实盘、全仓/逐仓、双向/单向持仓、统一账户、杠杆模式及自成交预防等。

Parameters:

- `mode` (string, required): 模式指令，例如```simulate```、```cross```、```dual```，完整指令列表见下表。
- `value` (bool / string, optional): 指令的取值，类型与含义见下表；部分指令无需此参数。

Returns (string / number / bool / object / array / any): 返回值因指令而异，部分指令（例如某些交易所的```cross```、```dual```）即使调用成功也返回空值；调用失败时返回空值，可通过`GetLastError`获取错误信息。

切换模拟盘/实盘环境（以```Futures_OKCoin```（OKX期货）为例）。

```javascript
function main() {
    exchange.IO("simulate", true)    // Switch to demo trading environment
    // ... trading logic ...
    exchange.IO("simulate", false)   // Switch back to live trading environment
}
```

```python
def main():
    exchange.IO("simulate", True)
    # ... trading logic ...
    exchange.IO("simulate", False)
```

```rust
fn main() {
    let _ = exchange.IO(("simulate", true));    // Switch to demo trading environment
    // ... trading logic ...
    let _ = exchange.IO(("simulate", false));   // Switch back to live trading environment
}
```

切换合约的保证金模式和持仓模式（以币安期货为例）。

```javascript
function main() {
    exchange.IO("dual", true)    // Switch to hedge mode (dual position)
    exchange.IO("dual", false)   // Switch to one-way mode

    exchange.SetContractType("swap")
    exchange.IO("cross", true)    // Switch to cross margin
    exchange.IO("cross", false)   // Switch to isolated margin
}
```

```python
def main():
    exchange.IO("dual", True)
    exchange.IO("dual", False)

    exchange.SetContractType("swap")
    exchange.IO("cross", True)
    exchange.IO("cross", False)
```

```rust
fn main() {
    let _ = exchange.IO(("dual", true));    // Switch to hedge mode (dual position)
    let _ = exchange.IO(("dual", false));   // Switch to one-way mode

    let _ = exchange.SetContractType("swap");
    let _ = exchange.IO(("cross", true));    // Switch to cross margin
    let _ = exchange.IO(("cross", false));   // Switch to isolated margin
}
```

切换统一账户模式（以币安期货为例）。

```javascript
function main() {
    exchange.IO("unified", true)   // Switch to unified account mode
    exchange.IO("unified", false)  // Switch to normal mode
}
```

```python
def main():
    exchange.IO("unified", True)
    exchange.IO("unified", False)
```

```rust
fn main() {
    let _ = exchange.IO(("unified", true));   // Switch to unified account mode
    let _ = exchange.IO(("unified", false));  // Switch to normal mode
}
```

设置自成交预防（STP）模式（以币安为例）。

```javascript
function main() {
    // "NONE" means disable STP mode, other parameters: "EXPIRE_TAKER", "EXPIRE_MAKER", "EXPIRE_BOTH"
    exchange.IO("selfTradePreventionMode", "NONE")
}
```

```python
def main():
    exchange.IO("selfTradePreventionMode", "NONE")
```

```rust
fn main() {
    // "NONE" means disable STP mode, other parameters: "EXPIRE_TAKER", "EXPIRE_MAKER", "EXPIRE_BOTH"
    let _ = exchange.IO(("selfTradePreventionMode", "NONE"));
}
```

##### 通用交易模式指令

以下指令在多个交易所中通用。各交易所支持哪些指令见`能力矩阵`；取值含义、是否按合约生效以及返回值的差异，见各交易所页面。

| 指令 | 参数 | 功能 |
| - | - | - |
| ```simulate``` | bool | 模拟盘（true）/实盘（false）。建议在添加交易所时勾选“模拟盘”，此指令仅为兼容旧策略而保留 |
| ```cross``` | bool | 全仓（true）/逐仓（false） |
| ```dual``` | bool | 双向持仓（true）/单向持仓（false） |
| ```unified``` | bool | 统一账户（true）/普通账户（false） |
| ```trade_margin``` | 无 | 切换为逐仓杠杆模式 |
| ```trade_super_margin``` | 无 | 切换为全仓杠杆模式 |
| ```trade_normal``` | 无 | 切换回普通现货模式 |
| ```selfTradePreventionMode``` | string | 自成交预防（STP）模式 |

##### 模拟盘

支持模拟盘的交易所在添加时的配置中提供“模拟盘”勾选项。勾选后，该交易所对象自启动起即连接模拟盘（测试网），策略无需再切换。支持的交易所包括：币安现货与期货、Bybit现货与期货、OKX现货与期货、Bitget现货与期货、Gate.io现货与期货、Futures_DigiFinex、Hyperliquid现货与期货（测试网）、Futures_Lighter、富途（模拟交易账户）。

```exchange.IO("simulate", true/false)```仍可在运行中切换模拟盘/实盘，用于兼容旧策略（支持的交易所见下方各指令的支持表）；新策略应以添加交易所时的勾选为准。DigiFinex现货交易所本身不提供模拟环境。

See also: `exchange.IO`

#### exchange.IO("rate", ...)

```
exchange.IO(k, functionNames, maxCalls, period)
exchange.IO(k, functionNames, maxCalls, period, behavior)
```

Forms:

- `exchange.IO("rate", ...)`

按函数限制API函数的调用频率：```rate```为平滑限流，```quota```为额度限流。

Parameters:

- `k` (string, required): ```rate```为平滑限流（令牌桶，允许短时突发），```quota```为额度限流（按时间窗口计数，窗口按整点对齐）。
- `functionNames` (string, required): API函数名（如```GetTicker```、```CreateOrder```、```GetAccount```），多个用逗号分隔共用一条规则；```*```为兜底规则，只作用于没有单独设置规则的函数；```IO/api```对应```exchange.IO("api", ...)```。传空字符串清空全部规则。
- `maxCalls` (number, required): 一个周期内允许的最大调用次数，小于等于0时删除```functionNames```的规则。```rate```模式可以写成字符串```"次数/突发"```，例如```"10/5"```表示每周期10次、最多连续突发5次；不写突发时突发量等于次数。
- `period` (string, required): 周期，写法同Go语言的时间长度：```500ms```、```1s```、```1m```、```1h30m```（单位ns、us、ms、s、m、h），也可以写```1d```；或者每日重置时间点```@HHMM```、```@HHMMSS```（北京时间），例如```@0815```。
- `behavior` (string, optional): 超限时的行为：```delay```等待后执行，默认返回空值。

Returns (string / number / bool / object / array / any): 调用成功时返回指令的结果，调用失败时返回空值。

rate模式限流 - 限制GetTicker每秒最多调用10次，超限返回null。

```javascript
function main() {
    exchange.IO("rate", "GetTicker", 10, "1s")

    for (var i = 0; i < 20; i++) {
        var ticker = exchange.GetTicker("BTC_USDT")
        if (ticker) {
            Log("Ticker:", ticker.Last)
        } else {
            Log("Rate limit exceeded")
        }
    }
}
```

```python
def main():
    exchange.IO("rate", "GetTicker", 10, "1s")

    for i in range(20):
        ticker = exchange.GetTicker("BTC_USDT")
        if ticker:
            Log("Ticker:", ticker["Last"])
        else:
            Log("Rate limit exceeded")
```

```rust
fn main() {
    let _ = exchange.IO(("rate", "GetTicker", 10, "1s"));

    for _i in 0..20 {
        // 超限时GetTicker返回Err
        match exchange.GetTicker("BTC_USDT") {
            Ok(ticker) => Log!("Ticker:", ticker.Last),
            Err(_) => Log!("Rate limit exceeded"),
        }
    }
}
```

rate模式限流 - 使用```delay```参数，超限时自动等待而非返回null。

```javascript
function main() {
    exchange.IO("rate", "GetTicker", 10, "1s", "delay")

    for (var i = 0; i < 20; i++) {
        var ticker = exchange.GetTicker("BTC_USDT")
        Log("Call", i+1, "Ticker:", ticker.Last)
    }
}
```

```python
def main():
    exchange.IO("rate", "GetTicker", 10, "1s", "delay")

    for i in range(20):
        ticker = exchange.GetTicker("BTC_USDT")
        Log("Call", i+1, "Ticker:", ticker["Last"])
```

```rust
fn main() {
    let _ = exchange.IO(("rate", "GetTicker", 10, "1s", "delay"));

    for i in 0..20 {
        let ticker = exchange.GetTicker("BTC_USDT").unwrap();
        Log!("Call", i + 1, "Ticker:", ticker.Last);
    }
}
```

多个函数共享限流额度。

```javascript
function main() {
    // GetTicker和GetDepth共享限制，合计每秒最多10次
    exchange.IO("rate", "GetTicker,GetDepth", 10, "1s")

    for (var i = 0; i < 20; i++) {
        if (i % 2 == 0) {
            Log("Ticker:", exchange.GetTicker("BTC_USDT"))
        } else {
            Log("Depth:", exchange.GetDepth("BTC_USDT"))
        }
    }
}
```

```python
def main():
    exchange.IO("rate", "GetTicker,GetDepth", 10, "1s")

    for i in range(20):
        if i % 2 == 0:
            Log("Ticker:", exchange.GetTicker("BTC_USDT"))
        else:
            Log("Depth:", exchange.GetDepth("BTC_USDT"))
```

```rust
fn main() {
    // GetTicker和GetDepth共享限制，合计每秒最多10次
    let _ = exchange.IO(("rate", "GetTicker,GetDepth", 10, "1s"));

    for i in 0..20 {
        if i % 2 == 0 {
            Log!("Ticker:", exchange.GetTicker("BTC_USDT"));
        } else {
            Log!("Depth:", exchange.GetDepth("BTC_USDT"));
        }
    }
}
```

使用通配符限制所有API调用频率。

```javascript
function main() {
    exchange.IO("rate", "*", 100, "1m")

    for (var i = 0; i < 10; i++) {
        exchange.GetTicker("BTC_USDT")
        exchange.GetDepth("BTC_USDT")
        exchange.GetAccount()
        Log("Round", i+1, "completed")
        Sleep(1000)
    }
}
```

```python
def main():
    exchange.IO("rate", "*", 100, "1m")

    for i in range(10):
        exchange.GetTicker("BTC_USDT")
        exchange.GetDepth("BTC_USDT")
        exchange.GetAccount()
        Log("Round", i+1, "completed")
        Sleep(1000)
```

```rust
fn main() {
    let _ = exchange.IO(("rate", "*", 100, "1m"));

    for i in 0..10 {
        let _ = exchange.GetTicker("BTC_USDT");
        let _ = exchange.GetDepth("BTC_USDT");
        let _ = exchange.GetAccount();
        Log!("Round", i + 1, "completed");
        Sleep(1000);
    }
}
```

quota模式 - 严格时间窗口对齐限流。

```javascript
function main() {
    exchange.IO("quota", "GetTicker", 3, "1s")

    for (var i = 0; i < 10; i++) {
        var ticker = exchange.GetTicker("BTC_USDT")
        if (ticker) {
            Log(_D(), "Ticker:", ticker.Last)
        } else {
            Log(_D(), "Quota exceeded, waiting for next window")
        }
        Sleep(100)
    }
}
```

```python
def main():
    exchange.IO("quota", "GetTicker", 3, "1s")

    for i in range(10):
        ticker = exchange.GetTicker("BTC_USDT")
        if ticker:
            Log(_D(), "Ticker:", ticker["Last"])
        else:
            Log(_D(), "Quota exceeded, waiting for next window")
        Sleep(100)
```

```rust
fn main() {
    let _ = exchange.IO(("quota", "GetTicker", 3, "1s"));

    for _i in 0..10 {
        match exchange.GetTicker("BTC_USDT") {
            Ok(ticker) => Log!(_D(None), "Ticker:", ticker.Last),
            Err(_) => Log!(_D(None), "Quota exceeded, waiting for next window"),
        }
        Sleep(100);
    }
}
```

quota模式 - 日内配额，每天指定时间重置。

```javascript
function main() {
    exchange.IO("quota", "GetTicker", 1000, "@0815")

    var count = 0
    while (true) {
        var ticker = exchange.GetTicker("BTC_USDT")
        if (ticker) {
            count++
            Log("Call count:", count, "Ticker:", ticker.Last)
        } else {
            Log("Daily quota exceeded, waiting for reset at 08:15")
            Sleep(60000)  // Wait 1 minute
        }
        Sleep(1000)
    }
}
```

```python
def main():
    exchange.IO("quota", "GetTicker", 1000, "@0815")

    count = 0
    while True:
        ticker = exchange.GetTicker("BTC_USDT")
        if ticker:
            count += 1
            Log("Call count:", count, "Ticker:", ticker["Last"])
        else:
            Log("Daily quota exceeded, waiting for reset at 08:15")
            Sleep(60000)  # Wait 1 minute
        Sleep(1000)
```

```rust
fn main() {
    let _ = exchange.IO(("quota", "GetTicker", 1000, "@0815"));

    let mut count = 0;
    loop {
        match exchange.GetTicker("BTC_USDT") {
            Ok(ticker) => {
                count += 1;
                Log!("Call count:", count, "Ticker:", ticker.Last);
            }
            Err(_) => {
                Log!("Daily quota exceeded, waiting for reset at 08:15");
                Sleep(60000);  // Wait 1 minute
            }
        }
        Sleep(1000);
    }
}
```

组合使用多个限流规则。

```javascript
function main() {
    exchange.IO("rate", "GetTicker", 10, "1s")      // GetTicker每秒10次
    exchange.IO("rate", "GetDepth", 5, "1s")        // GetDepth每秒5次
    exchange.IO("rate", "CreateOrder", 2, "1s")     // CreateOrder每秒2次
    exchange.IO("quota", "*", 1000, "@0000")        // 所有API每天00:00重置，限1000次

    Log("Rate limits configured successfully")

    for (var i = 0; i < 5; i++) {
        exchange.GetTicker("BTC_USDT")
        exchange.GetDepth("BTC_USDT")
        Sleep(200)
    }
}
```

```python
def main():
    exchange.IO("rate", "GetTicker", 10, "1s")      # GetTicker每秒10次
    exchange.IO("rate", "GetDepth", 5, "1s")        # GetDepth每秒5次
    exchange.IO("rate", "CreateOrder", 2, "1s")     # CreateOrder每秒2次
    exchange.IO("quota", "*", 1000, "@0000")        # 所有API每天00:00重置，限1000次

    Log("Rate limits configured successfully")

    for i in range(5):
        exchange.GetTicker("BTC_USDT")
        exchange.GetDepth("BTC_USDT")
        Sleep(200)
```

```rust
fn main() {
    let _ = exchange.IO(("rate", "GetTicker", 10, "1s"));      // GetTicker每秒10次
    let _ = exchange.IO(("rate", "GetDepth", 5, "1s"));        // GetDepth每秒5次
    let _ = exchange.IO(("rate", "CreateOrder", 2, "1s"));     // CreateOrder每秒2次
    let _ = exchange.IO(("quota", "*", 1000, "@0000"));        // 所有API每天00:00重置，限1000次

    Log!("Rate limits configured successfully");

    for _i in 0..5 {
        let _ = exchange.GetTicker("BTC_USDT");
        let _ = exchange.GetDepth("BTC_USDT");
        Sleep(200);
    }
}
```

##### API限流控制（```rate``` / ```quota```模式）

```javascript
exchange.IO("rate", functionNames, maxCalls, period, [behavior])
exchange.IO("quota", functionNames, maxCalls, period, [behavior])
```

- **rate**：平滑限流（令牌桶）。桶容量为突发量，按「次数/周期」的速度补充，开始时是满的。
- **quota**：额度限流。每个周期最多调用指定次数，周期按整点对齐（例如```1m```在每分钟0秒重置，```1d```在UTC零点即北京时间8点重置）。

| 参数 | 类型 | 说明 |
| - | - | - |
| functionNames | string | 函数名，逗号分隔多个；```*```为兜底规则，只作用于没有单独规则的函数 |
| maxCalls | number / string | 时间周期内最大调用次数；```rate```可写```"次数/突发"```；小于等于0删除规则 |
| period | string | 时间周期（```500ms```/```1s```/```1h30m```/```1d```）或每日重置时间点（```@0815```，北京时间） |
| behavior | string | 可选，```delay```超限时等待，默认返回null |

> ```Buy```/```Sell```的限流遵循```CreateOrder```的设置。```Go```遵循实际并发函数的设置。```IO/api```仅对```exchange.IO("api", ...)```生效。

  规则按交易所对象分别设置，只在本次运行中有效。超限时默认报错并返回空值，错误信息形如```rate limit exceeded: GetTicker 10/1s```（```quota```规则为```quota limit exceeded: ...```，每日定点重置的规则形如```quota limit exceeded: GetTicker 1000/day (resets at 0815)```）；设置```delay```时等待到可以调用为止，停止实盘时等待会被打断。```GetAccount```与```GetAssets```是同一个请求，为其中任一个名字设置的规则对两者都生效。

##### 可以限流的函数名

| 类别 | 函数名 |
| - | - |
| 行情 | ```GetTicker```、```GetTickers```、```GetDepth```、```GetTrades```、```GetRecords```、```GetMarkets```、```GetFundings``` |
| 账户 | ```GetAccount```、```GetAssets```、```GetPositions```、```SetMarginLevel``` |
| 交易 | ```CreateOrder```（```Buy```、```Sell```也计入）、```CancelOrder```、```ModifyOrder``` |
| 订单查询 | ```GetOrder```、```GetOrders```、```GetHistoryOrders``` |
| 条件单 | ```CreateConditionOrder```、```ModifyConditionOrder```、```CancelConditionOrder```、```GetConditionOrder```、```GetConditionOrders```、```GetHistoryConditionOrders``` |
| 自定义请求 | ```IO/api```：只限制```exchange.IO("api", ...)```，不影响其它```exchange.IO()```指令 |
| 兜底 | ```*```：作用于没有单独规则的交易所请求 |

- 限流只作用于交易所对象发出的上述请求；```HttpQuery()```、```Dial()```以及```exchange.IO()```的其它指令不受影响。
- 一次调用只按一条规则计数：有单独规则的函数不再计入```*```。
- 通过```exchange.Go()```并发调用时按实际调用的函数计数。

See also: `exchange.IO`

### Network

网络请求与服务：HTTP请求、WebSocket/TCP等长连接、在策略内提供HTTP/TCP服务（`threading.Serve`）、发送邮件。函数名带```_Go```后缀的是并发版本，配合`EventLoop`等待结果。

#### HttpQuery

```
HttpQuery(url)
HttpQuery(url, options)
```

发送Http请求。

Parameters:

- `url` (string, required): Http请求url。
- `options` (object, optional): 请求设置，所有字段都可选：```method```、```body```（未设置时用```data```作为请求体）、```headers```、```cookie```、```timeout```（毫秒，默认300000）、```charset```、```proxy```、```debug```，字段说明见`HttpQuery-options`。

Returns (string / object): 应答数据：```debug```为false（默认）时是应答```Body```字符串，JSON需要自己解析（```JSON.parse()```、```json.loads()```、```JSONParse()```）；为true时是完整应答对象，见`HttpQuery-return`。请求失败时的返回值见备注。

访问OKX公共行情API接口的例子。

```javascript
function main(){
    // 一个GET访问不带参数的例子
    var info = JSON.parse(HttpQuery("https://www.okx.com/api/v5/public/time"))
    Log(info)
    // 一个GET访问带参数的例子
    var ticker = JSON.parse(HttpQuery("https://www.okx.com/api/v5/market/books?instId=BTC-USDT"))
    Log(ticker)
}
```

```python
import json
def main():
    # 一个GET访问不带参数的例子
    info = json.loads(HttpQuery("https://www.okx.com/api/v5/public/time"))
    Log(info)
    # 一个GET访问带参数的例子
    ticker = json.loads(HttpQuery("https://www.okx.com/api/v5/market/books?instId=BTC-USDT"))
    Log(ticker)
```

```rust
fn main() {
    // 一个GET访问不带参数的例子，Rust 中由返回值类型注解决定返回 Body 字符串（String）或者完整应答（HttpRet）
    let body: String = HttpQuery("https://www.okx.com/api/v5/public/time", None);
    let info = JSONParse(&body).unwrap();
    Log!(info);
    // 一个GET访问带参数的例子
    let body2: String = HttpQuery("https://www.okx.com/api/v5/market/books?instId=BTC-USDT", None);
    let ticker = JSONParse(&body2).unwrap();
    Log!(ticker);
}
```

HttpQuery函数使用代理设置。

```javascript
function main() {
    // 本次设置代理并发送http请求，无用户名，无密码，此次http请求会通过代理发送
    HttpQuery("socks5://127.0.0.1:8889/http://www.baidu.com/")

    // 本次设置代理并发送http请求，输入用户名和密码，仅HttpQuery当前调用生效，之后再次调用HttpQuery("http://www.baidu.com")这样不会使用代理
    HttpQuery("socks5://username:password@127.0.0.1:8889/http://www.baidu.com/")

    // 也可以在options参数中使用proxy字段为本次请求设置代理
    HttpQuery("http://www.baidu.com/", {proxy: "socks5://username:password@127.0.0.1:8889"})
}
```

```python
def main():
    # 本次设置代理并发送http请求，无用户名，无密码，此次http请求会通过代理发送
    HttpQuery("socks5://127.0.0.1:8889/http://www.baidu.com/")

    # 本次设置代理并发送http请求，输入用户名和密码，仅HttpQuery当前调用生效
    HttpQuery("socks5://username:password@127.0.0.1:8889/http://www.baidu.com/")

    # 也可以在options参数中使用proxy字段为本次请求设置代理
    HttpQuery("http://www.baidu.com/", {"proxy": "socks5://username:password@127.0.0.1:8889"})
```

```rust
fn main() {
    // 本次设置代理并发送http请求，无用户名，无密码，此次http请求会通过代理发送
    let ret1: String = HttpQuery("socks5://127.0.0.1:8889/http://www.baidu.com/", None);

    // 本次设置代理并发送http请求，输入用户名和密码，仅HttpQuery当前调用生效，之后再次调用HttpQuery("http://www.baidu.com")这样不会使用代理
    let ret2: String = HttpQuery("socks5://username:password@127.0.0.1:8889/http://www.baidu.com/", None);
}
```

```HttpQuery()```函数支持```JavaScript```、```Python```、```Rust```语言。```HttpQuery()```主要用于访问交易所不需要签名的接口，例如行情信息等公共接口。
回测系统中可以使用```HttpQuery()```发送请求（只支持```GET```请求）获取数据。回测时限制使用20次访问不同的```URL```，并且```HttpQuery()```访问会缓存数据，相同的```URL```第二次访问时```HttpQuery()```函数返回缓存数据，不再发生实际网络请求。

请求失败（没有收到应答，例如拒绝连接、DNS解析失败、超时、代理失败）时不返回空值，而是在日志中记录包含请求方法和URL的错误信息：```debug```为false时返回空字符串；```debug```为true时返回```StatusCode```为0、带```Error```字段（失败原因）的结构。HTTP状态码为4xx、5xx的应答不算请求失败。

See also: `HttpQuery_Go`

#### HttpQuery_Go

```
HttpQuery_Go(url)
HttpQuery_Go(url, options)
```

发送Http请求，```HttpQuery```函数的异步版本。

Parameters:

- `url` (string, required): Http请求url。
- `options` (object, optional): 请求设置，所有字段都可选，与`HttpQuery`的```options```相同（见`HttpQuery-options`）；```debug```为true时取回完整应答报文，```timeout```为超时毫秒数。

Returns (object): 立即返回一个并发对象，用它的```wait```方法取请求结果；结果（包括请求失败时的返回值）与`HttpQuery`的返回值相同。```wait```的超时与重复调用见备注。

异步访问交易所公共接口获取聚合行情数据。

```javascript
function main() {
    // 创建第一个异步线程
    var r1 = HttpQuery_Go("https://www.okx.com/api/v5/market/tickers?instType=SPOT")
    // 创建第二个异步线程
    var r2 = HttpQuery_Go("https://api.huobi.pro/market/tickers")

    // 获取第一个异步线程调用的返回值
    var tickers1 = r1.wait()
    // 获取第二个异步线程调用的返回值
    var tickers2 = r2.wait()

    // 打印结果
    Log("tickers1:", tickers1)
    Log("tickers2:", tickers2)
}
```

```python
def main():
    # 创建第一个异步请求
    r1 = HttpQuery_Go("https://www.okx.com/api/v5/market/tickers?instType=SPOT")
    # 创建第二个异步请求
    r2 = HttpQuery_Go("https://api.huobi.pro/market/tickers")

    # 获取第一个异步请求的返回值
    tickers1 = r1.wait()
    # 获取第二个异步请求的返回值
    tickers2 = r2.wait()

    # 打印结果
    Log("tickers1:", tickers1)
    Log("tickers2:", tickers2)
```

```rust
fn main() {
    // 创建第一个异步请求，参数与HttpQuery相同（无options时传None）
    let r1 = HttpQuery_Go("https://www.okx.com/api/v5/market/tickers?instType=SPOT", None);
    // 创建第二个异步请求
    let r2 = HttpQuery_Go("https://api.huobi.pro/market/tickers", None);

    // 获取第一个异步请求的返回值，wait(0)一直等待到请求完成（对应JS的无参wait()）
    // 由类型注解决定取Body字符串（String）或完整应答（HttpRet）
    let tickers1: String = r1.wait(0).unwrap_or_default();
    // 获取第二个异步请求的返回值
    let tickers2: String = r2.wait(0).unwrap_or_default();

    // 打印结果
    Log!("tickers1:", tickers1);
    Log!("tickers2:", tickers2);
}
```

```HttpQuery_Go()```函数支持```JavaScript```、```Python```、```Rust```语言。```HttpQuery_Go()```主要用于访问交易所不需要签名的接口，例如行情信息等公共接口。回测系统中不支持```HttpQuery_Go```函数。

```wait```方法可以传入超时参数（毫秒）：不传或传入```0```时一直等待到请求完成，传入```-1```时不等待，传入正数时最多等待该毫秒数。请求尚未完成时```JavaScript```返回```undefined```、```Python```返回```None```，之后可以再次调用```wait```获取结果；结果已被取走后再次调用```wait```时，```JavaScript```抛出异常```routine N already finished```，```Python```记录该错误并返回```None```。

```Rust```中```wait```方法返回```Result```，结果类型由返回值类型注解决定（```String```为应答```Body```，```HttpRet```为完整应答）；请求尚未完成时返回```Err```（```routine N not finished```），之后可以再次调用```wait```；结果取走后再调用```wait```返回```Err```（```routine N already finished```）。

See also: `HttpQuery`

#### Dial

```
Dial(address)
Dial(address, timeout)
Dial(address, options)
```

用于原始的```Socket```访问，支持```tcp```、```tls```（也可写作```ssl```）协议，以及WebSocket的```ws```、```wss```协议。支持连接数据库，支持的数据库有：```sqlite3```、```mysql```、```postgres```、```clickhouse```。

Parameters:

- `address` (string, required): 请求地址。
- `timeout` (number, optional): 建立连接的超时时间。```ws```、```wss```协议单位为毫秒（小于100时按秒计算），```tcp```、```tls```协议单位为秒；设置为0时使用默认超时。```JavaScript```、```Python```中不传该参数时为30，即30秒。```Rust```中```Dial(address)```使用默认超时，指定超时使用```Dial::new(address, timeout)```，```timeout```的单位与上述相同。
- `options` (object, optional): 配置选项，例如```headers```（WebSocket请求头）、```timeout```（单位与```timeout```参数相同，未设置时使用默认超时）。

Returns (object): 连接对象，有```read()```、```write()```、```close()```等方法（数据库连接另有```exec()```），见`Dial-return`。连接失败（例如超时）时返回空值并记录错误（```Rust```返回```Valid()```为```false```的连接对象）。

Dial函数调用例子。

```javascript
function main(){
    // Dial支持tcp://、tls://协议以及ws://、wss://协议，tcp://、tls://可加一个参数指定超时的秒数
    var client = Dial("tls://www.baidu.com:443")
    if (client) {
        // write可再跟一个数字参数指定超时,write返回成功发送的字节数
        client.write("GET / HTTP/1.1\nConnection: Closed\n\n")
        while (true) {
            // read可再跟一个数字参数指定超时，单位：毫秒。返回null指出错或者超时或者socket已经关闭
            var buf = client.read()
            if (!buf) {
                 break
            }
            Log(buf)
        }
        client.close()
    }
}
```

```python
def main():
    client = Dial("tls://www.baidu.com:443")
    if client:
        client.write("GET / HTTP/1.1\nConnection: Closed\n\n")
        while True:
            buf = client.read()
            if not buf:
                break
            Log(buf)
        client.close()
```

```rust
fn main() {
    // Dial支持tcp://、tls://协议以及ws://、wss://协议，tcp://、tls://可使用Dial::new(addr, timeout)指定超时的秒数
    let mut client = Dial("tls://www.baidu.com:443");
    if client.Valid() {
        // write的第二个数字参数指定超时，write返回成功发送的字节数
        client.write("GET / HTTP/1.1\nConnection: Closed\n\n", 0);
        loop {
            // read的数字参数指定超时，单位：毫秒。返回空字符串指出错或者超时或者socket已经关闭
            let buf = client.read(0);
            if buf == "" {
                break;
            }
            Log!(buf);
        }
        client.close();
    }
}
```

访问币安（binance）的WebSocket行情接口。

```javascript
function main() {
    LogStatus("Connecting...")
    // 访问币安的WebSocket接口
    var client = Dial("wss://stream.binance.com:9443/ws/!ticker@arr")
    if (!client) {
        Log("Connection failed, exiting")
        return
    }

    while (true) {
        // read只返回调用read之后获取的数据
        var buf = client.read()
        if (!buf) {
            break
        }
        var table = {
            type: 'table',
            title: '行情图表',
            cols: ['币种', '最高', '最低', '买一', '卖一', '最后成交价', '成交量', '更新时间'],
            rows: []
        }
        var obj = JSON.parse(buf)
        Object.values(obj).forEach(function(ticker) {
            table.rows.push([ticker.s, ticker.h, ticker.l, ticker.b, ticker.a, ticker.c, ticker.q, _D(ticker.E)])
        })
        LogStatus('`' + JSON.stringify(table) + '`')
    }
    client.close()
}
```

```python
import json
def main():
    LogStatus("Connecting...")
    client = Dial("wss://stream.binance.com:9443/ws/!ticker@arr")
    if not client:
        Log("Connection failed, exiting")
        return

    while True:
        buf = client.read()
        if not buf:
            break
        table = {
            "type" : "table",
            "title" : "行情图表",
            "cols" : ["币种", "最高", "最低", "买一", "卖一", "最后成交价", "成交量", "更新时间"],
            "rows" : []
        }
        obj = json.loads(buf)
        for i in range(len(obj)):
            table["rows"].append([obj[i]["s"], obj[i]["h"], obj[i]["l"], obj[i]["b"], obj[i]["a"], obj[i]["c"], obj[i]["q"], _D(int(obj[i]["E"]) / 1000)])
        LogStatus('`' + json.dumps(table) + '`')
    client.close()
```

```rust
fn main() {
    LogStatus!("Connecting...");
    // 访问币安的WebSocket接口
    let mut client = Dial("wss://stream.binance.com:9443/ws/!ticker@arr");
    if !client.Valid() {
        Log!("Connection failed, exiting");
        return;
    }

    loop {
        // read只返回调用read之后获取的数据
        let buf = client.read(0);
        if buf == "" {
            break;
        }
        let obj = JSONParse(&buf).unwrap();
        // Rust SDK 没有 JSON 序列化功能，使用字符串拼接构造状态栏表格的 JSON 文本
        let mut rows = String::new();
        if let Some(arr) = obj.as_array() {
            for ticker in arr {
                if !rows.is_empty() {
                    rows += ",";
                }
                rows += &format!(r#"["{}","{}","{}","{}","{}","{}","{}","{}"]"#,
                    ticker["s"].as_str().unwrap_or(""), ticker["h"].as_str().unwrap_or(""),
                    ticker["l"].as_str().unwrap_or(""), ticker["b"].as_str().unwrap_or(""),
                    ticker["a"].as_str().unwrap_or(""), ticker["c"].as_str().unwrap_or(""),
                    ticker["q"].as_str().unwrap_or(""), _D(ticker["E"].as_i64().unwrap_or(0)));
            }
        }
        let table = format!(r#"{{"type":"table","title":"行情图表","cols":["币种","最高","最低","买一","卖一","最后成交价","成交量","更新时间"],"rows":[{}]}}"#, rows);
        LogStatus!(format!("`{}`", table));
    }
    client.close();
}
```

连接```sqlite3```数据库，用连接对象的```exec()```方法执行SQL语句（见`Dial-return`）。

```javascript
var client = null
function main() {
    // client = Dial("sqlite3://:memory:")   // 使用内存数据库
    client = Dial("sqlite3://test1.db")      // 打开/连接实盘目录下的数据库文件

    // 查询数据库中的表
    var ret = client.exec("SELECT name FROM sqlite_master WHERE type='table'")
    Log(ret)
}

function onexit() {
    Log("Executing client.close()")
    client.close()
}
```

```python
client = None
def main():
    global client
    # client = Dial("sqlite3://:memory:")   # 使用内存数据库
    client = Dial("sqlite3://test1.db")      # 打开/连接实盘目录下的数据库文件

    # 查询数据库中的表
    ret = client.exec("SELECT name FROM sqlite_master WHERE type='table'")
    Log(ret)

def onexit():
    Log("Executing client.close()")
    client.close()
```

```rust
fn main() {
    // let mut client = Dial("sqlite3://:memory:");   // 使用内存数据库
    let mut client = Dial("sqlite3://test1.db");      // 打开/连接实盘目录下的数据库文件

    // Rust 的连接对象不支持 fd() 方法

    // 查询数据库中的表
    let ret = client.exec("SELECT name FROM sqlite_master WHERE type='table'");
    Log!(format!("{:?}", ret));

    Log!("Executing client.close()");
    client.close();
}
```

```address```参数的详细说明，在正常的地址：```wss://ws.okx.com:8443/ws/v5/public```后，以```|```符号分隔。如果参数字符串中有```|```字符，则以```||```作为分隔符号。之后的部分是一些功能参数设置，各个参数之间用```&```字符连接。

例如```ss5```代理和压缩参数一起设置时可以写作：
```Dial("wss://ws.okx.com:8443/ws/v5/public|proxy=socks5://xxx:9999&compress=gzip_raw&mode=recv")```

| Dial函数的address参数支持的功能 | 参数说明 |
| - | - |
| WebSocket协议数据压缩相关的参数：compress=参数值 | compress为压缩方式，可选gzip、gzip_raw（也可写作flate）、zlib（也可写作deflate）。gzip_raw为不带gzip头的原始deflate数据，接收的数据不是标准gzip格式时可以使用。设置不支持的值会报错。 |
| WebSocket协议数据压缩相关的参数：mode=参数值 | mode为压缩模式，只支持recv（接收压缩数据，本地解压缩），不设置时默认为recv。设置了compress时，mode设置为send或dual会报错。 |
| WebSocket协议启用compression设置：enableCompression=true | 该参数可以设置但不生效，不进行WebSocket的permessage-deflate压缩协商。 |
| WebSocket协议设置底层自动重连相关的参数：reconnect=参数值 | reconnect为是否设置重连，reconnect=true为启用重连。不设置该参数时默认不重连。 |
| WebSocket协议设置底层自动重连相关的参数：interval=参数值 | interval为重试时间间隔，单位毫秒，interval=10000为重试间隔10秒，不设置默认1秒，即interval=1000。 |
| WebSocket协议设置底层自动重连相关的参数：payload=参数值 | payload为WebSocket重连时需要发送的订阅消息，例如：payload=okok。 |
| socks5代理的相关参数：proxy=参数值 | proxy为ss5代理设置，参数值格式：socks5://name:pwd@192.168.0.1:1080，name为ss5服务端用户名，pwd为ss5服务端登录密码，1080为ss5服务的端口。 |
| WebSocket接收缓冲区上限：qsize=参数值 | qsize为接收缓冲区最多保存的消息条数，不设置时默认4096。 |
| WebSocket接收缓冲区上限：qbytes=参数值 | qbytes为接收缓冲区最多保存的字节数，不设置时默认16777216（16MB）。 |

```Dial()```函数仅支持实盘。

使用Dial函数连接数据库时，连接字符串的写法如下：

| 支持的数据库 | 连接字符串（Connection String） |
| - | - |
| sqlite3 | sqlite3://test1.db |
| mysql | mysql://username:yourpassword@tcp(localhost:3306)/yourdatabase?charset=utf8mb4&parseTime=true |
| postgres | postgres://user=username password=yourpassword host=localhost port=5432 dbname=yourdatabase sslmode=disable |
| clickhouse | clickhouse://tcp://localhost:9000?username=username&password=yourpassword&database=yourdatabase |

各数据库连接字符串的说明：

- sqlite3：```sqlite3://```前缀表示使用的是sqlite3数据库。相对路径的数据库文件位于实盘目录（```logs/storage/<实盘ID>/```）下；```sqlite3://:memory:```为内存数据库，不创建文件，连接关闭后数据即丢弃；也支持```sqlite3://file:test.db?cache=shared&mode=memory```这样的URI写法。
- mysql：```mysql://```之后的写法与Go语言MySQL驱动（go-sql-driver/mysql）的DSN相同。```charset```、```collation```、```timeout```、```readTimeout```、```writeTimeout```、```tls```（```true```、```false```、```skip-verify```、```preferred```）等参数生效，也可以用```ssl-mode```设置TLS；```parseTime```、```loc```只校验取值，不生效；不支持自定义TLS配置名；其它无法识别的参数作为会话变量，连接后执行```SET 参数名 = 参数值```。也可写作URL形式：```mysql://username:yourpassword@localhost:3306/yourdatabase```。
- postgres：libpq键值对写法，各项以空格分隔。```sslmode```按libpq的语义：```disable```不使用TLS，```require```等使用TLS但不校验证书，只有```verify-ca```、```verify-full```校验证书；不支持```sslrootcert```、```sslcert```、```sslkey```、```passfile```、```service```等需要读取文件的参数；其它无法识别的参数作为运行时参数设置。也可写作URL形式：```postgres://username:yourpassword@localhost:5432/yourdatabase?sslmode=disable```。
- clickhouse：```clickhouse://```之后的写法与Go语言ClickHouse驱动（clickhouse-go）的DSN相同：```tcp://```使用原生TCP协议（端口9000；端口9440或者参数```secure=true```时使用TLS，```skip_verify=true```时不校验证书），也可写作```http://```、```https://```使用HTTP接口；其它无法识别的参数作为ClickHouse设置（settings）。也可写作URL形式：```clickhouse://username:yourpassword@localhost:9000/yourdatabase```，默认使用原生TCP协议，使用```clickhouse+http://```、```clickhouse+https://```前缀或者端口8123、8443时使用HTTP接口。

```address```中```|```之后的参数以```&```连接、以```=```赋值，所以```payload```的内容含有```=```、```&```等字符（例如base64编码的签名、JSON）时会干扰解析。这种情况不要写进```payload```，而是连接成功后用```write()```发送订阅消息。

See also: `Dial返回对象`, `HttpQuery`, `EventLoop`, `DBExec`, `threading.Serve`, `exchange.Encode`

#### Mail

```
Mail(smtpServer, smtpUsername, smtpPassword, mailTo, title, body)
```

发送邮件。

Parameters:

- `smtpServer` (string, required): 用于指定邮件发送方的```SMTP```服务器地址。
- `smtpUsername` (string, required): 用于指定邮件发送方的邮箱地址。
- `smtpPassword` (string, required): 用于指定邮件发送方邮箱的```SMTP```服务密码。
- `mailTo` (string, required): 用于指定邮件接收方的邮箱地址。
- `title` (string, required): 邮件标题。
- `body` (string, required): 邮件正文。

Returns (bool): 邮件发送成功时返回真值，例如```true```；发送失败时返回假值，例如```false```。

通过163邮箱的SMTP服务发送一封邮件。

```javascript
function main(){
    Mail("smtp.163.com", "asdf@163.com", "password", "111@163.com", "title", "body")
}
```

```python
def main():
    Mail("smtp.163.com", "asdf@163.com", "password", "111@163.com", "title", "body")
```

```rust
fn main() {
    Mail("smtp.163.com", "asdf@163.com", "password", "111@163.com", "title", "body");
}
```

```smtpPassword```参数设置的是```SMTP```服务的密码，而非邮箱登录密码。

设置```smtpServer```参数时，如需更改端口，可直接在```smtpServer```参数中附加端口号。例如：QQ 邮箱的```smtp.qq.com:587```端口经测试可用。

如果出现报错```unencryped connection```，则需要修改```Mail```函数的```smtpServer```参数，其格式为```ssl://xxx.com:xxx```。例如，QQ 邮箱```SMTP```的```ssl```方式为```ssl://smtp.qq.com:465```，或使用```smtp://xxx.com:xxx```。

该函数在回测系统中不起作用。

See also: `Mail_Go`

#### Mail_Go

```
Mail_Go(smtpServer, smtpUsername, smtpPassword, mailTo, title, body)
```

```Mail```函数的异步版本。支持JavaScript、Rust，Python不提供。

Parameters:

- `smtpServer` (string, required): 用于指定邮件发送方的```SMTP```服务地址。
- `smtpUsername` (string, required): 用于指定邮件发送方的邮箱地址。
- `smtpPassword` (string, required): 邮件发送方邮箱的```SMTP```密码。
- `mailTo` (string, required): 用于指定邮件接收方的邮箱地址。
- `title` (string, required): 邮件标题。
- `body` (string, required): 邮件正文。

Returns (object): 立即返回一个并发对象，可以使用该并发对象的```wait```方法获取邮件发送结果，邮件发送成功返回真值，例如：```true```，发送失败返回假值，例如：```false```。结果已被取走后再次调用```wait```时，```JavaScript```抛出异常```routine N already finished```。```Rust```语言中```wait```方法返回```Result<bool>```，发送成功为```Ok(true)```，发送失败为```Ok(false)```；邮件尚未发送完成时返回```Err```（```routine N not finished```），之后可以再次调用```wait```；结果取走后再调用```wait```返回```Err```（```routine N already finished```）。

并发发送两封邮件，再分别等待发送结果。

```javascript
function main() {
    var r1 = Mail_Go("smtp.163.com", "asdf@163.com", "password", "111@163.com", "title", "body")
    var r2 = Mail_Go("smtp.163.com", "asdf@163.com", "password", "111@163.com", "title", "body")

    var ret1 = r1.wait()
    var ret2 = r2.wait()

    Log("ret1:", ret1)
    Log("ret2:", ret2)
    // 输出：发送成功时 ret1、ret2 均为 true
}
```

```rust
fn main() {
    let r1 = Mail_Go("smtp.163.com", "asdf@163.com", "password", "111@163.com", "title", "body");
    let r2 = Mail_Go("smtp.163.com", "asdf@163.com", "password", "111@163.com", "title", "body");

    // wait(0)一直等待到发送完成（对应JS的无参wait()），返回Result<bool>
    let ret1 = r1.wait(0);
    let ret2 = r2.wait(0);

    Log!("ret1:", ret1);
    Log!("ret2:", ret2);
}
```

回测系统中不起作用。

See also: `Mail`

### Storage

数据持久化与实盘间通信：`_G`键值存储、`DBExec`内置数据库、`SetChannelData`与`GetChannelData`在实盘之间广播数据。

#### _G

```
_G()
_G(k)
_G(k, v)
```

持久化保存数据。该函数实现了一个可持久化保存的全局字典功能，数据以键值对（KV）表的结构永久保存在托管者的本地数据库文件中。

Parameters:

- `k` (string / 空值, optional): 所保存键值对中的键名，区分大小写。
- `v` (string / number / bool / object / array / 空值, optional): 所保存键值对中的键值，可以是任何能够进行```JSON```序列化的数据。

Returns (string / number / bool / object / array / 空值): 持久化保存的```k-v```键值对中的键值数据。

设置、修改、删除持久化变量，并读取实盘ID。

```javascript
function main(){
    // 设置一个全局变量num，值为1
    _G("num", 1)
    // 更改一个全局变量num，值为字符串ok
    _G("num", "ok")
    // 删除全局变量num
    _G("num", null)
    // 返回全局变量num的值
    Log(_G("num"))
    // 输出：null（num 已被删除）
    // 删除所有全局变量
    _G(null)
    // 返回实盘ID
    var robotId = _G()
}
```

```python
def main():
    _G("num", 1)
    _G("num", "ok")
    _G("num", None)
    Log(_G("num"))
    # 输出：null（num 已被删除）
    _G(None)
    robotId = _G()
```

```rust
fn main() {
    // 设置一个全局变量num，值为1
    _G!("num", 1);
    // 更改一个全局变量num，值为字符串ok
    _G!("num", "ok");
    // 删除全局变量num
    _G!("num", null);
    // 返回全局变量num的值
    Log!(_G!("num"));
    // Rust 不支持 _G!(null) 删除所有全局变量的形式
    // 返回实盘ID
    let robotId = _G!();
}
```

每个实盘单独对应一个数据库。策略重启或托管者停止运行后，```_G()```函数保存的数据依然会持续存在。但回测结束后，```_G()```函数在回测系统中保存的数据将被清除。使用```_G()```函数持久化保存数据时，应根据硬件设备的内存与硬盘空间合理使用，切勿滥用。

在实盘运行中，当调用```_G()```函数且不传入任何参数时，```_G()```函数返回当前实盘的```Id```。

调用```_G()```函数时，参数```v```传入空值表示删除对应的```k-v```键值对。

调用```_G()```函数时，若仅参数```k```传入字符串，则```_G()```函数返回参数```k```对应的已保存键值。

调用```_G()```函数时，若仅参数```k```传入空值，则表示删除所有已记录的```k-v```键值对。

当```k-v```键值对已持久化保存后，再次调用```_G()```函数，并传入已持久化保存的键名作为参数```k```、新的键值作为参数```v```，即可更新该```k-v```键值对。

以实盘Id为```123456```为例，使用```_G()```函数持久化保存的K-V键值数据存储在该实盘（即策略实例程序）所属托管者目录下的```/logs/storage/123456/123456.db3```数据库文件中，数据记录在```kvdb```表内。

See also: `DBExec`

#### DBExec

```
DBExec(sql)
DBExec(sql, ...args)
```

数据库接口函数。

Parameters:

- `sql` (string, required): **sql**语句字符串。
- `arg` (string / number / bool / 空值, optional): **sql**语句中```?```占位符对应的参数值，按顺序传入，```arg```参数可以传多个。仅```JavaScript```、```Python```支持，```Rust```的```DBExec()```只接受**sql**语句一个参数。

Returns (object): SQL语句的执行结果：```columns```为列名数组，```values```为各行数据组成的二维数组，例如```{"columns":["TS","CLOSE"],"values":[[1518970320000,100]]}```；结构见`DBExec-return`。

支持内存数据库，对于```DBExec```函数的参数，如果**sql**语句是以```:```开头则在内存数据库中操作，不写文件速度更快。适合不需要持久化保存的数据库操作，例如。

```javascript
function main() {
    var strSql = [
        ":CREATE TABLE TEST_TABLE(",
        "TS INT PRIMARY KEY NOT NULL,",
        "HIGH REAL NOT NULL,",
        "OPEN REAL NOT NULL,",
        "LOW REAL NOT NULL,",
        "CLOSE REAL NOT NULL,",
        "VOLUME REAL NOT NULL)"
    ].join("")
    var ret = DBExec(strSql)
    Log(ret)

    // 增加一条数据
    Log(DBExec(":INSERT INTO TEST_TABLE (TS, HIGH, OPEN, LOW, CLOSE, VOLUME) VALUES (1518970320000, 100, 99.1, 90, 100, 12345.6);"))

    // 查询数据
    Log(DBExec(":SELECT * FROM TEST_TABLE;"))
}
```

```python
def main():
    arr = [
        ":CREATE TABLE TEST_TABLE(",
        "TS INT PRIMARY KEY NOT NULL,",
        "HIGH REAL NOT NULL,",
        "OPEN REAL NOT NULL,",
        "LOW REAL NOT NULL,",
        "CLOSE REAL NOT NULL,",
        "VOLUME REAL NOT NULL)"
    ]
    strSql = ""
    for i in range(len(arr)):
        strSql += arr[i]
    ret = DBExec(strSql)
    Log(ret)

    # 增加一条数据
    Log(DBExec(":INSERT INTO TEST_TABLE (TS, HIGH, OPEN, LOW, CLOSE, VOLUME) VALUES (1518970320000, 100, 99.1, 90, 100, 12345.6);"))

    # 查询数据
    Log(DBExec(":SELECT * FROM TEST_TABLE;"))
```

```rust
fn main() {
    let arr = [
        ":CREATE TABLE TEST_TABLE(",
        "TS INT PRIMARY KEY NOT NULL,",
        "HIGH REAL NOT NULL,",
        "OPEN REAL NOT NULL,",
        "LOW REAL NOT NULL,",
        "CLOSE REAL NOT NULL,",
        "VOLUME REAL NOT NULL)",
    ];
    let strSql = arr.join("");
    let ret = DBExec(&strSql);
    Log!(format!("{:?}", ret));

    // 增加一条数据
    Log!(format!("{:?}", DBExec(":INSERT INTO TEST_TABLE (TS, HIGH, OPEN, LOW, CLOSE, VOLUME) VALUES (1518970320000, 100, 99.1, 90, 100, 12345.6);")));

    // 查询数据
    Log!(format!("{:?}", DBExec(":SELECT * FROM TEST_TABLE;")));
}
```

使用```DBExec()```函数创建表。

```javascript
function main() {
    var strSql = [
        "CREATE TABLE TEST_TABLE(",
        "TS INT PRIMARY KEY NOT NULL,",
        "HIGH REAL NOT NULL,",
        "OPEN REAL NOT NULL,",
        "LOW REAL NOT NULL,",
        "CLOSE REAL NOT NULL,",
        "VOLUME REAL NOT NULL)"
    ].join("")
    var ret = DBExec(strSql)
    Log(ret)
}
```

```python
def main():
    arr = [
        "CREATE TABLE TEST_TABLE(",
        "TS INT PRIMARY KEY NOT NULL,",
        "HIGH REAL NOT NULL,",
        "OPEN REAL NOT NULL,",
        "LOW REAL NOT NULL,",
        "CLOSE REAL NOT NULL,",
        "VOLUME REAL NOT NULL)"
    ]
    strSql = ""
    for i in range(len(arr)):
        strSql += arr[i]
    ret = DBExec(strSql)
    Log(ret)
```

```rust
fn main() {
    let arr = [
        "CREATE TABLE TEST_TABLE(",
        "TS INT PRIMARY KEY NOT NULL,",
        "HIGH REAL NOT NULL,",
        "OPEN REAL NOT NULL,",
        "LOW REAL NOT NULL,",
        "CLOSE REAL NOT NULL,",
        "VOLUME REAL NOT NULL)",
    ];
    let strSql = arr.join("");
    let ret = DBExec(&strSql);
    Log!(format!("{:?}", ret));
}
```

表中记录的增删查改操作。

```javascript
function main() {
    var strSql = [
        "CREATE TABLE TEST_TABLE(",
        "TS INT PRIMARY KEY NOT NULL,",
        "HIGH REAL NOT NULL,",
        "OPEN REAL NOT NULL,",
        "LOW REAL NOT NULL,",
        "CLOSE REAL NOT NULL,",
        "VOLUME REAL NOT NULL)"
    ].join("")
    Log(DBExec(strSql))

    // 增加一条数据
    Log(DBExec("INSERT INTO TEST_TABLE (TS, HIGH, OPEN, LOW, CLOSE, VOLUME) VALUES (1518970320000, 100, 99.1, 90, 100, 12345.6);"))

    // 查询数据
    Log(DBExec("SELECT * FROM TEST_TABLE;"))

    // 修改数据
    Log(DBExec("UPDATE TEST_TABLE SET HIGH=? WHERE TS=?", 110, 1518970320000))

    // 删除数据
    Log(DBExec("DELETE FROM TEST_TABLE WHERE HIGH=?", 110))
}
```

```python
def main():
    arr = [
        "CREATE TABLE TEST_TABLE(",
        "TS INT PRIMARY KEY NOT NULL,",
        "HIGH REAL NOT NULL,",
        "OPEN REAL NOT NULL,",
        "LOW REAL NOT NULL,",
        "CLOSE REAL NOT NULL,",
        "VOLUME REAL NOT NULL)"
    ]
    strSql = ""
    for i in range(len(arr)):
        strSql += arr[i]
    Log(DBExec(strSql))

    # 增加一条数据
    Log(DBExec("INSERT INTO TEST_TABLE (TS, HIGH, OPEN, LOW, CLOSE, VOLUME) VALUES (1518970320000, 100, 99.1, 90, 100, 12345.6);"))

    # 查询数据
    Log(DBExec("SELECT * FROM TEST_TABLE;"))

    # 修改数据
    Log(DBExec("UPDATE TEST_TABLE SET HIGH=? WHERE TS=?", 110, 1518970320000))

    # 删除数据
    Log(DBExec("DELETE FROM TEST_TABLE WHERE HIGH=?", 110))
```

```rust
fn main() {
    let arr = [
        "CREATE TABLE TEST_TABLE(",
        "TS INT PRIMARY KEY NOT NULL,",
        "HIGH REAL NOT NULL,",
        "OPEN REAL NOT NULL,",
        "LOW REAL NOT NULL,",
        "CLOSE REAL NOT NULL,",
        "VOLUME REAL NOT NULL)",
    ];
    let strSql = arr.join("");
    Log!(format!("{:?}", DBExec(&strSql)));

    // 增加一条数据
    Log!(format!("{:?}", DBExec("INSERT INTO TEST_TABLE (TS, HIGH, OPEN, LOW, CLOSE, VOLUME) VALUES (1518970320000, 100, 99.1, 90, 100, 12345.6);")));

    // 查询数据
    Log!(format!("{:?}", DBExec("SELECT * FROM TEST_TABLE;")));

    // 修改数据，Rust 的 DBExec() 函数只接受单个SQL语句字符串参数，不支持 ? 占位符传参，参数值直接写在语句中
    Log!(format!("{:?}", DBExec("UPDATE TEST_TABLE SET HIGH=110 WHERE TS=1518970320000;")));

    // 删除数据
    Log!(format!("{:?}", DBExec("DELETE FROM TEST_TABLE WHERE HIGH=110;")));
}
```

- 函数```DBExec()```通过传入参数，可以操作实盘数据库（SQLite数据库）。
- 实现对实盘数据库中数据的增、删、查、改等操作，支持**SQLite**语法。
- 实盘数据库中系统保留表：```kvdb```、```cfg```、```log```、```profit```、```chart```，切勿对这些表进行操作。
- 目前不支持**事务**，不建议执行此类操作，会引起系统中的冲突。
- ```DBExec()```函数仅支持实盘。

See also: `_G`

#### SetChannelData

```
SetChannelData(data)
```

在频道上发布最新的状态数据。该函数用于实盘之间的通信，可将当前实盘的状态数据广播到频道上，供其他实盘订阅获取。

Parameters:

- `data` (object / array / string / number / bool / 空值, required): 需要发布到频道的数据，可以是任何支持```JSON```序列化的数据结构，通常为包含实盘状态信息的对象。

Returns (空值): 该函数无返回值。

每分钟把BTC_USDT最新价发布到本实盘的频道。

```javascript
function main() {
    while (true) {
        var ticker = exchange.GetTicker("BTC_USDT")
        if (ticker) {
            // 发布最新状态，覆盖上一次发布的数据
            SetChannelData({symbol: "BTC_USDT", last: ticker.Last, time: Date.now()})
        }
        Sleep(60000)
    }
}
```

```python
import time
def main():
    while True:
        ticker = exchange.GetTicker("BTC_USDT")
        if ticker:
            # 发布最新状态，覆盖上一次发布的数据
            data = {"symbol": "BTC_USDT", "last": ticker["Last"], "time": time.time() * 1000}
            SetChannelData(data)
        Sleep(60000)
```

```rust
fn main() {
    loop {
        if let Ok(ticker) = exchange.GetTicker("BTC_USDT") {
            // 发布最新状态，覆盖上一次发布的数据；Rust 传JSON字符串
            let data = format!(r#"{{"symbol": "BTC_USDT", "last": {}, "time": {}}}"#,
                ticker.Last, Unix() * 1000);
            SetChannelData(&data);
        }
        Sleep(60000);
    }
}
```

频道广播端示例 - 发布 BTC 行情价格数据

```javascript
function main() {
    var updateId = 0
    var robotId = _G()  // 获取当前实盘 ID

    while(true) {
        // 获取实时市场价格
        var ticker = exchange.GetTicker("BTC_USDT")
        if (!ticker) {
            Sleep(5000)
            continue
        }

        // 构造当前频道状态数据
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

        // 在频道上发布最新状态（覆盖旧状态）
        SetChannelData(channelState)

        // 显示当前频道状态
        LogStatus("Channel Broadcaster [Bot ID: " + robotId + "]\n" +
                  "Update ID: #" + channelState.updateId + "\n" +
                  "Time: " + _D(channelState.timestamp) + "\n" +
                  "Symbol: " + channelState.symbol + "\n" +
                  "Last Price: $" + channelState.lastPrice.toFixed(2) + "\n" +
                  "Volume: " + channelState.volume.toFixed(4) + "\n" +
                  "High: $" + channelState.high.toFixed(2) + "\n" +
                  "Low: $" + channelState.low.toFixed(2))

        Sleep(60000)  // 每分钟更新一次频道状态
    }
}
```

```python
import time

def main():
    updateId = 0
    robotId = _G()  # 获取当前实盘 ID

    while True:
        # 获取实时市场价格
        ticker = exchange.GetTicker("BTC_USDT")
        if not ticker:
            Sleep(5000)
            continue

        # 构造当前频道状态数据
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

        # 在频道上发布最新状态（覆盖旧状态）
        SetChannelData(channelState)

        # 显示当前频道状态
        LogStatus("Channel Broadcaster [Bot ID: {}]\n".format(robotId) +
                  "Update ID: #{}\n".format(channelState["updateId"]) +
                  "Time: {}\n".format(_D(channelState["timestamp"] / 1000)) +
                  "Symbol: {}\n".format(channelState["symbol"]) +
                  "Last Price: ${:.2f}\n".format(channelState["lastPrice"]) +
                  "Volume: {:.4f}\n".format(channelState["volume"]) +
                  "High: ${:.2f}\n".format(channelState["high"]) +
                  "Low: ${:.2f}".format(channelState["low"]))

        Sleep(60000)  # 每分钟更新一次频道状态
```

```rust
fn main() {
    let mut updateId = 0;
    let robotId = _G!();  // 获取当前实盘 ID

    loop {
        // 获取实时市场价格
        let ticker = match exchange.GetTicker("BTC_USDT") {
            Ok(t) => t,
            Err(_) => {
                Sleep(5000);
                continue;
            }
        };

        // 构造当前频道状态数据
        // Rust 的 SetChannelData 仅接受字符串参数，因此使用 format! 构造 JSON 文本
        updateId += 1;
        let timestamp = Unix() * 1000;
        let channelState = format!(
            r#"{{"robotId": {}, "updateId": {}, "timestamp": {}, "symbol": "BTC_USDT", "lastPrice": {}, "volume": {}, "high": {}, "low": {}}}"#,
            robotId, updateId, timestamp, ticker.Last, ticker.Volume, ticker.High, ticker.Low
        );

        // 在频道上发布最新状态（覆盖旧状态）
        SetChannelData(&channelState);

        // 显示当前频道状态
        LogStatus!(format!(
            "Channel Broadcaster [Bot ID: {}]\nUpdate ID: #{}\nTime: {}\nSymbol: BTC_USDT\nLast Price: ${:.2}\nVolume: {:.4}\nHigh: ${:.2}\nLow: ${:.2}",
            robotId, updateId, _D(timestamp), ticker.Last, ticker.Volume, ticker.High, ticker.Low
        ));

        Sleep(60000);  // 每分钟更新一次频道状态
    }
}
```

跨平台发送示例 - 模拟外部平台（如 TradingView）向 FMZ 实盘发送数据

```javascript
// 此示例演示如何使用 HttpQuery 发送 HTTP POST 请求，模拟外部平台向 FMZ 实盘发送数据
// 在实际场景中，外部平台（如 TradingView 的 Webhook 告警 URL、第三方交易系统等）会直接调用 FMZ API 端点

function main() {
    let uuid = "6BC42A119B5DBFA2188A8279DA3B5C30"
    let robotId = 123456  // 目标实盘 ID（用于接收数据的实盘）
    let baseUrl = "https://www.fmz.com"

    while (true) {
        // 准备待发送的数据（可以是 JSON、文本或其他格式）
        let sendData = {
            "action": "buy",
            "symbol": "BTC_USDT",
            "price": 50000,
            "timestamp": Date.now()
        }

        // 构造 HTTP POST 请求
        let options = {
            method: "POST",
            body: JSON.stringify(sendData)  // body 可以是 JSON 字符串、普通文本等
        }
        let url = `${baseUrl}/api/v1?method=pub&robot=${robotId}&channel=${uuid}`

        // 发送数据
        let ret = HttpQuery(url, options)
        Log("Simulated external platform sending data, result:", ret)

        Sleep(10000)  // 每 10 秒发送一次
    }
}
```

```python
# 此示例演示如何使用 HttpQuery 发送 HTTP POST 请求，模拟外部平台向 FMZ 实盘发送数据
# 在实际场景中，外部平台（如 TradingView 的 Webhook 告警 URL、第三方交易系统等）会直接调用 FMZ API 端点

import json
import time

def main():
    uuid = "6BC42A119B5DBFA2188A8279DA3B5C30"
    robotId = 123456  # 目标实盘 ID（用于接收数据的实盘）
    baseUrl = "https://www.fmz.com"

    while True:
        # 准备待发送的数据（可以是 JSON、文本或其他格式）
        sendData = {
            "action": "buy",
            "symbol": "BTC_USDT",
            "price": 50000,
            "timestamp": time.time() * 1000
        }

        # 构造 HTTP POST 请求
        options = {
            "method": "POST",
            "body": json.dumps(sendData)  # body 可以是 JSON 字符串、普通文本等
        }
        url = "{}/api/v1?method=pub&robot={}&channel={}".format(baseUrl, robotId, uuid)

        # 发送数据
        ret = HttpQuery(url, options)
        Log("Simulated external platform sending data, result:", ret)

        Sleep(10000)  # 每 10 秒发送一次
```

```rust
// 此示例演示如何使用 HttpQuery 发送 HTTP POST 请求，模拟外部平台向 FMZ 实盘发送数据
// 在实际场景中，外部平台（如 TradingView 的 Webhook 告警 URL、第三方交易系统等）会直接调用 FMZ API 端点

fn main() {
    let uuid = "6BC42A119B5DBFA2188A8279DA3B5C30";
    let robotId = 123456;  // 目标实盘 ID（用于接收数据的实盘）
    let baseUrl = "https://www.fmz.com";

    loop {
        // 准备待发送的数据（可以是 JSON、文本或其他格式）
        let sendData = format!(
            r#"{{"action": "buy", "symbol": "BTC_USDT", "price": 50000, "timestamp": {}}}"#,
            Unix() * 1000
        );

        let url = format!("{}/api/v1?method=pub&robot={}&channel={}", baseUrl, robotId, uuid);

        // 发送数据：Rust 的 HttpQuery() 第二个参数传入字符串时，以该字符串为请求体发送 POST 请求
        let ret: String = HttpQuery(&url, sendData.as_str());
        Log!("Simulated external platform sending data, result:", ret);

        Sleep(10000);  // 每 10 秒发送一次
    }
}
```

```SetChannelData()```函数为非阻塞调用，调用后立即返回，不会等待数据传输完成。

每个实盘都拥有一个独立的频道，频道ID即为实盘ID（可通过```_G()```函数获取）。

频道上仅保存最新的状态数据，每次调用```SetChannelData()```都会覆盖之前发布的数据，而非追加历史消息。

频道数据支持跨实盘、跨托管者、跨服务器进行广播，多个实盘可以订阅同一个频道。

订阅端使用```GetChannelData()```函数订阅频道数据。

频道通信适用于实盘环境，在回测系统中该功能可能受到限制。

传入的数据参数```data```在JSON序列化后的字节长度不得超过1024字节，超出部分会被截断后照常发布，订阅端收到的是不完整、无法解析为JSON的数据（```GetChannelData()```函数返回原始字符串）。建议仅传输必要的状态信息，避免传输过大的数据对象。

发布的数据应根据硬件设备的内存和网络带宽合理使用，避免发布过大的数据对象。

```SetChannelData()```函数发布的数据不仅可以被FMZ平台内的其他实盘订阅，还支持跨平台数据发送功能。外部平台（如TradingView的Webhook告警、第三方交易系统、监控软件等）可以通过HTTP POST请求向指定的FMZ实盘发送数据。

**跨平台发送数据的方式：** 外部系统通过HTTP POST请求将数据发送到FMZ平台API端点：```https://www.fmz.com/api/v1?method=pub&robot={robotId}&channel={uuid}```，其中```robotId```为目标实盘ID，```uuid```为32位字符的频道标识符。发送的数据在请求body中传递，可以是JSON格式、文本或其他格式。注意：必须先有实盘订阅该UUID频道，外部系统才能成功发送数据；广播的数据会发送到```robotId```实盘所在托管者下的所有实盘，同一托管者下订阅了该UUID频道的实盘均可接收数据。

See also: `GetChannelData`; `_G`

#### GetChannelData

```
GetChannelData(channelId)
```

订阅指定实盘的频道数据。该函数用于实盘间通信，可以获取其他实盘通过```SetChannelData()```函数发布的最新状态数据。

Parameters:

- `channelId` (string / number, required): 频道标识：其它实盘的实盘ID（实盘间通信，实盘ID可以用```_G()```获取），或32位UUID（订阅外部系统通过HTTP API发送到平台的数据）。

Returns (object / array / string / number / bool / 空值): 返回订阅频道的最新状态数据。首次调用返回```null```，需要重试。数据结构由广播端发布的数据决定。

每5秒读取另一个实盘频道发布的最新价。

```javascript
function main() {
    var channelId = "632799"    // 发布数据的实盘ID
    while (true) {
        var state = GetChannelData(channelId)
        // 非阻塞调用：首次调用或对方还没有发布时为null
        if (state) {
            Log(state.symbol, "最新价", state.last)
        }
        Sleep(5000)
    }
}
```

```python
def main():
    channelId = "632799"    # 发布数据的实盘ID
    while True:
        state = GetChannelData(channelId)
        # 非阻塞调用：首次调用或对方还没有发布时为None
        if state:
            Log(state["symbol"], "最新价", state["last"])
        Sleep(5000)
```

```rust
fn main() {
    let channelId = "632799";    // 发布数据的实盘ID
    loop {
        // Rust 读取指定实盘的频道用 GetChannelDataOf；首次调用或对方还没有发布时为null
        let state = GetChannelDataOf(channelId);
        if !state.is_null() {
            Log!(state["symbol"].clone(), "最新价", state["last"].clone());
        }
        Sleep(5000);
    }
}
```

频道订阅端示例 - 订阅两个实盘的频道数据

```javascript
function main() {
    // 需要订阅的两个频道ID(根据实际情况修改)
    var channelId1 = "632799"  // 频道1的实盘ID
    var channelId2 = "632800"  // 频道2的实盘ID

    while(true) {
        // 订阅频道1的当前状态
        var state1 = GetChannelData(channelId1)

        // 订阅频道2的当前状态
        var state2 = GetChannelData(channelId2)

        // 构建状态显示
        var statusMsg = "频道订阅端 - 当前订阅状态\n\n"

        // 显示频道1状态
        statusMsg += "═══ 频道1 [" + channelId1 + "] ═══\n"
        if (state1 !== null) {
            statusMsg += "更新ID: #" + state1.updateId + "\n"
            statusMsg += "时间: " + _D(state1.timestamp) + "\n"
            statusMsg += "交易对: " + state1.symbol + "\n"
            statusMsg += "最新价: $" + state1.lastPrice.toFixed(2) + "\n"
            statusMsg += "成交量: " + state1.volume.toFixed(4) + "\n"
        } else {
            statusMsg += "状态: 等待中... (首次调用返回 null)\n"
        }

        statusMsg += "\n"

        // 显示频道2状态
        statusMsg += "═══ 频道2 [" + channelId2 + "] ═══\n"
        if (state2 !== null) {
            statusMsg += "更新ID: #" + state2.updateId + "\n"
            statusMsg += "时间: " + _D(state2.timestamp) + "\n"
            statusMsg += "交易对: " + state2.symbol + "\n"
            statusMsg += "最新价: $" + state2.lastPrice.toFixed(2) + "\n"
            statusMsg += "成交量: " + state2.volume.toFixed(4) + "\n"
        } else {
            statusMsg += "状态: 等待中... (首次调用返回 null)\n"
        }

        LogStatus(statusMsg)

        Sleep(5000)  // 每5秒订阅一次频道
    }
}
```

```python
def main():
    # 需要订阅的两个频道ID(根据实际情况修改)
    channelId1 = "632799"  # 频道1的实盘ID
    channelId2 = "632800"  # 频道2的实盘ID

    while True:
        # 订阅频道1的当前状态
        state1 = GetChannelData(channelId1)

        # 订阅频道2的当前状态
        state2 = GetChannelData(channelId2)

        # 构建状态显示
        statusMsg = "频道订阅端 - 当前订阅状态\n\n"

        # 显示频道1状态
        statusMsg += "═══ 频道1 [{}] ═══\n".format(channelId1)
        if state1 is not None:
            statusMsg += "更新ID: #{}\n".format(state1["updateId"])
            statusMsg += "时间: {}\n".format(_D(state1["timestamp"] / 1000))
            statusMsg += "交易对: {}\n".format(state1["symbol"])
            statusMsg += "最新价: ${:.2f}\n".format(state1["lastPrice"])
            statusMsg += "成交量: {:.4f}\n".format(state1["volume"])
        else:
            statusMsg += "状态: 等待中... (首次调用返回 None)\n"

        statusMsg += "\n"

        # 显示频道2状态
        statusMsg += "═══ 频道2 [{}] ═══\n".format(channelId2)
        if state2 is not None:
            statusMsg += "更新ID: #{}\n".format(state2["updateId"])
            statusMsg += "时间: {}\n".format(_D(state2["timestamp"] / 1000))
            statusMsg += "交易对: {}\n".format(state2["symbol"])
            statusMsg += "最新价: ${:.2f}\n".format(state2["lastPrice"])
            statusMsg += "成交量: {:.4f}\n".format(state2["volume"])
        else:
            statusMsg += "状态: 等待中... (首次调用返回 None)\n"

        LogStatus(statusMsg)

        Sleep(5000)  # 每5秒订阅一次频道
```

```rust
fn main() {
    // 需要订阅的两个频道ID(根据实际情况修改)
    // Rust 中读取指定频道使用 GetChannelDataOf(channelId)；无参的 GetChannelData() 读取本实盘自身的频道
    let channelIds = ["632799", "632800"];  // 频道1、频道2的实盘ID

    loop {
        // 构建状态显示
        let mut statusMsg = String::from("频道订阅端 - 当前订阅状态\n\n");

        for (i, channelId) in channelIds.iter().enumerate() {
            // 订阅频道的当前状态
            let state = GetChannelDataOf(*channelId);

            statusMsg += &format!("═══ 频道{} [{}] ═══\n", i + 1, channelId);
            if !state.is_null() {
                statusMsg += &format!("更新ID: #{}\n", state["updateId"].as_i64().unwrap_or(0));
                statusMsg += &format!("时间: {}\n", _D(state["timestamp"].as_i64().unwrap_or(0)));
                statusMsg += &format!("交易对: {}\n", state["symbol"].as_str().unwrap_or(""));
                statusMsg += &format!("最新价: ${:.2}\n", state["lastPrice"].as_f64().unwrap_or(0.0));
                statusMsg += &format!("成交量: {:.4}\n", state["volume"].as_f64().unwrap_or(0.0));
            } else {
                statusMsg += "状态: 等待中... (首次调用返回 null)\n";
            }
            statusMsg += "\n";
        }

        LogStatus!(statusMsg);

        Sleep(5000);  // 每5秒订阅一次频道
    }
}
```

跨平台订阅示例 - 使用UUID订阅外部系统发送的数据

```javascript
function main() {
    // 使用32位UUID作为频道标识符
    let uuid = "6BC42A119B5DBFA2188A8279DA3B5C30"

    while (true) {
        // 订阅UUID频道的数据
        let data = GetChannelData(uuid)

        if (data !== null) {
            Log("Received cross-platform data:", data)
        } else {
            Log("Waiting for data... (first call returns null)")
        }

        Sleep(10000)  // 每10秒检查一次
    }
}
```

```python
def main():
    # 使用32位UUID作为频道标识符
    uuid = "6BC42A119B5DBFA2188A8279DA3B5C30"

    while True:
        # 订阅UUID频道的数据
        data = GetChannelData(uuid)

        if data is not None:
            Log("Received cross-platform data:", data)
        else:
            Log("Waiting for data... (first call returns None)")

        Sleep(10000)  # 每10秒检查一次
```

```rust
fn main() {
    // 使用32位UUID作为频道标识符，Rust 中读取指定频道使用 GetChannelDataOf()
    let uuid = "6BC42A119B5DBFA2188A8279DA3B5C30";

    loop {
        // 订阅UUID频道的数据
        let data = GetChannelDataOf(uuid);

        if !data.is_null() {
            Log!("Received cross-platform data:", data);
        } else {
            Log!("Waiting for data... (first call returns null)");
        }

        Sleep(10000);  // 每10秒检查一次
    }
}
```

```GetChannelData()```函数是非阻塞调用，调用后立即返回，不会等待数据接收完成。

首次调用```GetChannelData()```函数时会返回```null```，需要重试等待频道数据同步完成。

每次调用获取的都是频道上的最新状态数据，不是历史消息队列。

一个实盘可以同时订阅多个不同实盘的频道，只需多次调用```GetChannelData()```并传入不同的实盘ID。

每个实盘最多订阅10个不同的频道（实盘ID频道与UUID频道合计），第一次读取某个频道即为订阅该频道。超过上限时该次调用返回空值，并记录一条错误日志```channel subscriber exceed limit```，策略不会中止。

当前实盘也可以订阅自己的频道，即```robotId```参数可以是当前实盘ID。

频道数据可以跨实盘、跨托管者、跨服务器进行传输。

广播端使用```SetChannelData()```函数发布频道数据。

```Rust```中读取指定频道使用```GetChannelDataOf(channelId)```，无参的```GetChannelData()```读取本实盘自身的频道。

频道通信适用于实盘环境，回测系统中该功能可能受限。

```GetChannelData()```函数支持跨平台订阅功能。使用32位UUID作为频道标识符时，可以接收来自FMZ平台外部系统通过HTTP API发送的数据。外部系统需要指定实盘ID和UUID才能发送数据，同一托管者下的所有实盘都可以订阅到该UUID频道的数据，不同托管者的实盘无法订阅。

See also: `SetChannelData`; `_G`

### Threads

并发相关的函数都在这里。`exchange.Go`把耗时的调用放到后台执行，`EventLoop`等待并发调用的结果和事件，这两个函数所有编程语言都可以使用；下面的多线程对象仅支持```JavaScript```。`ctx.subscribe`、`ctx.poll`、`ctx.book`是托管者的事件订阅接口（```JavaScript```；```Rust```使用```ctx```模块的同名函数）。

发明者量化交易平台从系统底层真正支持```JavaScript```语言策略的多线程功能，实现了以下对象：

| 对象 | 说明 | 备注 |
| - | - | - |
| threading | 多线程全局对象 | 成员函数：```Thread```、```getThread```、```mainThread```等。 |
| Thread | 线程对象 | 成员函数：```peekMessage```、```postMessage```、```join```等。 |
| ThreadLock | 线程锁对象 | 成员函数：```acquire```、```release```。可作为线程执行函数的参数传入线程环境。 |
| ThreadEvent | 事件对象 | 成员函数：```set```、```clear```、```wait```、```isSet```。可作为线程执行函数的参数传入线程环境。 |
| ThreadCondition | 条件对象 | 成员函数：```notify```、```notifyAll```、```wait```、```acquire```、```release```。可作为线程执行函数的参数传入线程环境。 |
| ThreadDict | 字典对象 | 成员函数：```get```、```set```。可作为线程执行函数的参数传入线程环境。 |
| Server | 服务对象 | 由```threading.Serve()```返回。成员函数：```addr```、```close```、```stop```、```join```、```pending```。可作为线程执行函数的参数传入线程环境。 |

#### exchange.Go

```
exchange.Go(method)
exchange.Go(method, ...args)
```

多线程异步支持函数，可以把所有支持的函数的操作变成异步并发执行。

Parameters:

- `method` (string, required): 并发的函数名称，注意该参数是函数名称字符串，并非函数引用。
- `arg` (string / number / bool / object / array / function / any, optional): **并发执行函数**的参数，参数```arg```可能有多个。参数```arg```的类型与个数根据**并发执行函数**的参数而定。

Returns (object): 立即返回一个并发对象，用它的```wait()```方法取得并发调用的结果，见`exchange.Go-return`。

```exchange.Go()```函数使用范例，判断```undefined```要用```typeof(xx) === "undefined"```，因为```null == undefined```在JavaScript里是成立的。

```javascript
function main(){
    // 以下四种操作是并发多线程异步执行, 不会耗时, 立即返回的
    var a = exchange.Go("GetTicker")
    var b = exchange.Go("GetDepth")
    var c = exchange.Go("Buy", 1000, 0.1)
    var d = exchange.Go("GetRecords", PERIOD_H1)

    // 调用wait方法等待返回异步获取ticker结果
    var ticker = a.wait()
    // 返回深度, 如果获取失败也是有可能返回null的
    var depth = b.wait()
    // 返回订单号, 限定1秒超时, 超时返回undefined, 此对象可以继续调用wait等待如果上次wait超时
    var orderId = c.wait(1000)
    if(typeof(orderId) == "undefined") {
        // 超时，重新获取
        orderId = c.wait()
    }
    var records = d.wait()
}
```

```python
def main():
    a = exchange.Go("GetTicker")
    b = exchange.Go("GetDepth")
    c = exchange.Go("Buy", 1000, 0.1)
    d = exchange.Go("GetRecords", PERIOD_H1)

    ticker, ok = a.wait()
    depth, ok = b.wait()
    orderId, ok = c.wait(1000)
    if ok == False:
        orderId, ok = c.wait()
    records, ok = d.wait()
```

```rust
fn main() {
    // Rust中exchange.Go为类型化写法：用Go::方法token指定并发函数，无参传()，有参传元组
    // 以下四种操作是并发多线程异步执行, 不会耗时, 立即返回的
    let a = exchange.Go(Go::GetTicker, ());
    let b = exchange.Go(Go::GetDepth, ());
    // Rust中没有Buy的token，等价于CreateOrder，第一个参数""表示当前交易对
    let c = exchange.Go(Go::CreateOrder, ("", "buy", 1000, 0.1));
    let d = exchange.Go(Go::GetRecords, ("", PERIOD_H1));   // 参数依次为交易对（""表示当前交易对）、K线周期

    // 调用wait方法等待返回异步获取ticker结果，wait(0)阻塞直到并发线程运行完毕（对应JS的无参wait()）
    let ticker = a.wait(0);
    // 返回深度, 如果获取失败也是有可能返回Err的
    let depth = b.wait(0);
    // 返回订单号, 限定1秒超时, 超时返回Err, 此对象可以继续调用wait等待如果上次wait超时
    // 注意：Err也可能是下单本身失败（超时的错误信息为routine N not finished）；下单失败时结果已被取走，再次wait会返回Err（routine N already finished）
    let mut orderId = c.wait(1000);
    if orderId.is_err() {
        // 超时，重新获取
        orderId = c.wait(0);
    }
    let records = d.wait(0);
}
```

对已经释放的并发对象，调用其```wait()```方法会报错。

```javascript
function main() {
    var d = exchange.Go("GetRecords", PERIOD_H1)
    // 等待K线结果
    var records = d.wait()
    // 这里wait了一个已经wait过且结束的异步操作，会抛出异常：routine N already finished
    var ret = d.wait()
}
```

```python
def main():
    d = exchange.Go("GetRecords", PERIOD_H1)
    records, ok = d.wait()
    ret, ok = d.wait()
```

```rust
fn main() {
    // Rust中exchange.Go为类型化写法：用Go::方法token指定并发函数
    let d = exchange.Go(Go::GetRecords, ("", PERIOD_H1));   // 参数依次为交易对（""表示当前交易对）、K线周期
    // 等待K线结果，wait(0)阻塞直到运行完毕（对应JS的无参wait()）
    let records = d.wait(0);
    // 这里wait了一个已经wait过且结束的异步操作，会返回Err（routine N already finished）
    let ret = d.wait(0);
}
```

并发获取多个交易所行情。

```javascript
function main() {
    while(true) {
        var beginTS = new Date().getTime()
        var arrRoutine = []
        var arrTicker = []
        var arrName = []
        for(var i = 0; i < exchanges.length; i++) {
            arrRoutine.push(exchanges[i].Go("GetTicker"))
            arrName.push(exchanges[i].GetName())
        }

        for(var i = 0; i < arrRoutine.length; i++) {
            arrTicker.push(arrRoutine[i].wait())
        }
        var endTS = new Date().getTime()

        var tbl = {
            type: "table",
            title: "行情",
            cols: ["索引", "名称", "最新成交价"],
            rows: []
        }

        for(var i = 0; i < arrTicker.length; i++) {
            tbl.rows.push([i, arrName[i], arrTicker[i].Last])
        }

        LogStatus(_D(), "Total time for concurrent ticker retrieval:", endTS - beginTS, "ms", "\n", "`" + JSON.stringify(tbl) + "`")
        Sleep(500)
    }
}
```

```python
import time
import json
def main():
    while True:
        beginTS = time.time()
        arrRoutine = []
        arrTicker = []
        arrName = []
        for i in range(len(exchanges)):
            arrRoutine.append(exchanges[i].Go("GetTicker"))
            arrName.append(exchanges[i].GetName())

        for i in range(len(exchanges)):
            ticker, ok = arrRoutine[i].wait()
            arrTicker.append(ticker)

        endTS = time.time()
        tbl = {
            "type": "table",
            "title": "行情",
            "cols": ["索引", "名称", "最新成交价"],
            "rows": []
        }

        for i in range(len(arrTicker)):
            tbl["rows"].append([i, arrName[i], arrTicker[i]["Last"]])

        LogStatus(_D(), "Total time for concurrent ticker retrieval:", endTS - beginTS, "seconds", "\n", "`" + json.dumps(tbl) + "`")
        Sleep(500)
```

```rust
fn main() {
    loop {
        let beginTS = UnixNano() / 1000000;
        let mut arrRoutine = Vec::new();
        let mut arrTicker = Vec::new();
        let mut arrName = Vec::new();
        for e in exchanges.iter() {
            // Rust中exchange.Go为类型化写法，token为Go::GetTicker
            arrRoutine.push(e.Go(Go::GetTicker, ()));
            arrName.push(e.GetName());
        }

        // 失败时记None占位，保持与arrName按索引对齐
        for r in arrRoutine.iter() {
            arrTicker.push(r.wait(0).ok());
        }
        let endTS = UnixNano() / 1000000;

        // Rust无JSON序列化，用format!拼接表格的JSON文本
        let mut rows = String::new();
        for i in 0..arrTicker.len() {
            if let Some(ticker) = &arrTicker[i] {
                if !rows.is_empty() {
                    rows.push(',');
                }
                rows += &format!(r#"[{}, "{}", {}]"#, i, arrName[i], ticker.Last);
            }
        }
        let tbl = format!(r#"{{"type": "table", "title": "行情", "cols": ["索引", "名称", "最新成交价"], "rows": [{}]}}"#, rows);

        LogStatus!(_D(None), "Total time for concurrent ticker retrieval:", endTS - beginTS, "ms", "\n", format!("`{}`", tbl));
        Sleep(500);
    }
}
```

对```exchange.IO("api", ...)```函数并发调用。

```javascript
function main() {
    /*
        使用OKX期货下单接口测试
        POST /api/v5/trade/order
    */

    var beginTS = new Date().getTime()
    var param = {"instId":"BTC-USDT-SWAP","tdMode":"cross","side":"buy","ordType":"limit","px":"16000","sz":"1","posSide":"long"}
    var ret1 = exchange.Go("IO", "api", "POST", "/api/v5/trade/order", "", JSON.stringify(param))
    var ret2 = exchange.Go("IO", "api", "POST", "/api/v5/trade/order", "", JSON.stringify(param))
    var ret3 = exchange.Go("IO", "api", "POST", "/api/v5/trade/order", "", JSON.stringify(param))

    var id1 = ret1.wait()
    var id2 = ret2.wait()
    var id3 = ret3.wait()
    var endTS = new Date().getTime()

    Log("id1:", id1)
    Log("id2:", id2)
    Log("id3:", id3)
    Log("Concurrent order time:", endTS - beginTS, "ms")
}
```

```python
import time
import json
def main():
    beginTS = time.time()
    param = {"instId":"BTC-USDT-SWAP","tdMode":"cross","side":"buy","ordType":"limit","px":"16000","sz":"1","posSide":"long"}
    ret1 = exchange.Go("IO", "api", "POST", "/api/v5/trade/order", "", json.dumps(param))
    ret2 = exchange.Go("IO", "api", "POST", "/api/v5/trade/order", "", json.dumps(param))
    ret3 = exchange.Go("IO", "api", "POST", "/api/v5/trade/order", "", json.dumps(param))

    id1, ok1 = ret1.wait()
    id2, ok2 = ret2.wait()
    id3, ok3 = ret3.wait()
    endTS = time.time()

    Log("id1:", id1)
    Log("id2:", id2)
    Log("id3:", id3)
    Log("Concurrent order time:", endTS - beginTS, "seconds")
```

```rust
fn main() {
    /*
        使用OKX期货下单接口测试
        POST /api/v5/trade/order
    */

    let beginTS = UnixNano() / 1000000;
    // Rust无JSON序列化，直接用原始字符串构造参数
    let param = r#"{"instId":"BTC-USDT-SWAP","tdMode":"cross","side":"buy","ordType":"limit","px":"16000","sz":"1","posSide":"long"}"#;
    // Rust中exchange.Go为类型化写法，token为Go::IO，参数以元组传入
    let ret1 = exchange.Go(Go::IO, ("api", "POST", "/api/v5/trade/order", "", param));
    let ret2 = exchange.Go(Go::IO, ("api", "POST", "/api/v5/trade/order", "", param));
    let ret3 = exchange.Go(Go::IO, ("api", "POST", "/api/v5/trade/order", "", param));

    let id1 = ret1.wait(0);
    let id2 = ret2.wait(0);
    let id3 = ret3.wait(0);
    let endTS = UnixNano() / 1000000;

    Log!("id1:", id1);
    Log!("id2:", id2);
    Log!("id3:", id3);
    Log!("Concurrent order time:", endTS - beginTS, "ms");
}
```

针对自动释放机制的测试

```javascript
function main() {
    var counter = 0
    var arr = []                 // 用于测试持续引用并发的相关变量
    var symbols = ["BTC_USDT", "ETH_USDT", "SOL_USDT", "LTC_USDT", "EOS_USDT"]
    while (true) {
        var arrRoutine = []
        for (var symbol of symbols) {
            var r = exchange.Go("GetTicker", symbol)
            arrRoutine.push(r)   // 记录并发对象用于调用 r.wait() 函数获取结果，每一轮循环都清空
            // arr.push(r)       // 如果使用这句代码，运行时持续引用并发的对象，无法自动释放；未取结果的并发任务达到2000个后，再调用exchange.Go()会报错：too many routine wait, max is 2000
            counter++
        }

        // 遍历 arrRoutine 调用 r.wait()

        LogStatus(_D(), "routine number:", counter)
        Sleep(50)
    }
}
```

```rust
fn main() {
    let mut counter = 0;
    let mut arr: Vec<TypedRoutine<Go::GetTicker>> = Vec::new();   // 用于测试持续引用并发的相关变量
    let symbols = ["BTC_USDT", "ETH_USDT", "SOL_USDT", "LTC_USDT", "EOS_USDT"];
    loop {
        let mut arrRoutine = Vec::new();
        for symbol in symbols {
            // Rust中exchange.Go为类型化写法，token为Go::GetTicker
            let r = exchange.Go(Go::GetTicker, (symbol,));
            arrRoutine.push(r);   // 记录并发对象用于调用 r.wait(0) 函数获取结果，每一轮循环都清空
            // arr.push(r);       // 如果使用这句代码，运行时持续引用并发的对象，无法自动释放；未取结果的并发任务达到2000个后，再调用exchange.Go()会报错：too many routine wait, max is 2000
            counter += 1;
        }

        // 遍历 arrRoutine 调用 r.wait(0)

        LogStatus!(_D(None), "routine number:", counter);
        Sleep(50);
    }
}
```

该函数只在实盘运行时创建多线程执行任务，回测不支持多线程并发执行任务（回测可用，但是还是顺序执行）。

并发对象```wait()```方法的超时参数，以及各语言在完成、超时、重复调用时的返回值，见`exchange.Go-return`。```Python```中```wait()```返回```(结果, 是否成功)```两个值。

虽然系统底层有自动回收机制，但是如果持续引用相关变量，并发任务的结果并不会释放。未取结果的并发任务达到2000个时，再调用```exchange.Go()```提交新任务会当场报错：```"too many routine wait, max is 2000"```，该任务不会执行。

支持的函数：```GetTicker```，```GetDepth```，```GetTrades```，```GetRecords```，```GetAccount```，```GetOrders```，```GetOrder```，```CancelOrder```，```Buy```，```Sell```，```GetPositions```，```IO```等。这些函数并发调用时都基于当前`exchange`交易所对象执行。

See also: `Mail_Go`, `HttpQuery_Go`, `EventLoop`, `exchange.IO`, `API限流控制`

#### EventLoop

```
EventLoop()
EventLoop(timeout)
```

监听事件，在有任意```WebSocket```可读数据或者```exchange.Go()```、```HttpQuery_Go()```等并发的任务完成以后返回。

Parameters:

- `timeout` (number, optional): 超时时间（毫秒）：```0```等到有事件发生才返回，大于0为最长等待时间，小于0立即返回最近的事件。

Returns (object): 事件对象，```Event```为事件类型，例如```{"Seq":1,"Event":"Exchange_GetTrades","ThreadId":0,"Index":3,"Nano":1682068771309583400}```，结构见`EventLoop-return`；超时没有事件时返回空值。

并发获取行情、深度、成交记录，用EventLoop依次取回完成事件。

```javascript
function main() {
    var routine_getTicker = exchange.Go("GetTicker")
    var routine_getDepth = exchange.Go("GetDepth")
    var routine_getTrades = exchange.Go("GetTrades")

    // 并发任务在提交时就已登记：即使这里先Sleep(2000)，之后的EventLoop也不会错过这些任务的完成事件

    // Log("GetDepth:", routine_getDepth.wait()) 如果这里提前调用wait函数取出GetDepth函数并发调用的结果，
    // 此次GetDepth函数收到请求结果的事件便不会在EventLoop函数返回
    var ts1 = new Date().getTime()
    var ret1 = EventLoop(0)

    var ts2 = new Date().getTime()
    var ret2 = EventLoop(0)

    var ts3 = new Date().getTime()
    var ret3 = EventLoop(0)

    Log("First concurrent task completed:", _D(ts1), ret1)
    Log("Second concurrent task completed:", _D(ts2), ret2)
    Log("Third concurrent task completed:", _D(ts3), ret3)

    Log("GetTicker:", routine_getTicker.wait())
    Log("GetDepth:", routine_getDepth.wait())
    Log("GetTrades:", routine_getTrades.wait())
}
```

```python
import time
def main():
    routine_getTicker = exchange.Go("GetTicker")
    routine_getDepth = exchange.Go("GetDepth")
    routine_getTrades = exchange.Go("GetTrades")

    ts1 = time.time()
    ret1 = EventLoop(0)

    ts2 = time.time()
    ret2 = EventLoop(0)

    ts3 = time.time()
    ret3 = EventLoop(0)

    Log("First concurrent task completed:", _D(ts1), ret1)
    Log("Second concurrent task completed:", _D(ts2), ret2)
    Log("Third concurrent task completed:", _D(ts3), ret3)

    Log("GetTicker:", routine_getTicker.wait())
    Log("GetDepth:", routine_getDepth.wait())
    Log("GetTrades:", routine_getTrades.wait())
```

```rust
fn main() {
    // Rust 中 exchange.Go 使用类型化 token（如 Go::GetTicker）而非方法名字符串，无参时传 ()
    let routine_getTicker = exchange.Go(Go::GetTicker, ());
    let routine_getDepth = exchange.Go(Go::GetDepth, ());
    let routine_getTrades = exchange.Go(Go::GetTrades, ());

    // 并发任务在提交时就已登记：即使这里先Sleep(2000)，之后的EventLoop也不会错过这些任务的完成事件

    // Log!("GetDepth:", routine_getDepth.wait(0)) 如果这里提前调用wait函数取出GetDepth函数并发调用的结果，
    // 此次GetDepth函数收到请求结果的事件便不会在EventLoop函数返回
    let ts1 = Unix() * 1000;
    let ret1 = EventLoop(0);

    let ts2 = Unix() * 1000;
    let ret2 = EventLoop(0);

    let ts3 = Unix() * 1000;
    let ret3 = EventLoop(0);

    Log!("First concurrent task completed:", _D(ts1), ret1);
    Log!("Second concurrent task completed:", _D(ts2), ret2);
    Log!("Third concurrent task completed:", _D(ts3), ret3);

    Log!("GetTicker:", routine_getTicker.wait(0).unwrap());
    Log!("GetDepth:", routine_getDepth.wait(0).unwrap());
    Log!("GetTrades:", routine_getTrades.wait(0).unwrap());
}
```

```exchange.Go()```、```HttpQuery_Go()```等并发任务在提交时就已登记，即使任务在首次调用```EventLoop()```之前就已完成，也不会错过它的完成事件。底层系统封装的队列结构每个线程最多缓存10240个事件，如果程序执行过程中没有及时调用```EventLoop()```函数取出，超出上限时最早的事件会被丢弃。
```EventLoop()```函数的调用不会影响系统底层WebSocket的缓存队列，也不影响```exchange.Go()```等并发函数的缓存，对于这些缓存依然需要使用各自的方法取出数据。对于在```EventLoop()```函数返回之前，已经取出的数据，不会在```EventLoop()```函数中产生返回事件。
```EventLoop()```函数的主要用途就是通知策略层，系统底层接收到了新的网络数据。以事件驱动整个策略。当```EventLoop()```函数返回事件时，只需遍历所有数据来源。例如WebSocket连接、```exchange.Go()```创建的对象尝试获取数据。
```EventLoop()```函数仅支持实盘。

在主函数```main()```中调用时，监听主线程的事件。在```JavaScript```语言编写的策略中，```threading.Thread()```函数创建的线程，在线程的执行函数中也可以调用，监听当前线程的事件。

See also: `Dial`, `exchange.Go`, `HttpQuery_Go`

#### ctx.subscribe

```
ctx.subscribe(ex, symbol)
ctx.subscribe(ex, symbol, options)
```

订阅某个账户上一个品种的行情推送，或账户的订单回报，返回事件流ID。事件用`ctx.poll`取出，按事件的```kind```分别处理。

Parameters:

- `ex` (number, required): 账户在```exchanges```数组中的下标：```0```为```exchanges[0]```（即```exchange```），```1```为```exchanges[1]```，以此类推。也可以传数字字符串，例如```"0"```；不能传账户标签。
- `symbol` (string, required): 品种代码，例如```BTC_USDT```、```BTC_USDT.swap```，写法见`品种代码`。订阅订单回报（```channel```为```orders```）时传空字符串```""```，表示整个账户。
- `options` (object, optional): 订阅选项，不传时订阅```ticker```：

| 字段 | 说明 |
| - | - |
| channel | 频道：```ticker```（默认）、```bbo```（最优买卖价）、```depth```（订单簿）、```trade```（逐笔成交）、```kline```（K线）、```orders```（本账户的订单回报） |
| depth | ```depth```频道的档数 |
| interval | ```kline```频道的周期，单位秒，例如```60``` |
| mode | 设为```latest```时只保留最新一条，来不及取的旧事件被覆盖 |
| buffer | 有界缓冲的条数，溢出时丢弃最旧的事件 |

Returns (number): 事件流ID，可以传给```ctx.poll()```只取这一路事件。重复订阅同一路返回同一个ID。

订阅现货行情与订单回报，按```kind```分别处理。

```javascript
function onTicker(ev) {
    Log("ticker", ev.symbol, "bid:", ev.bid, "ask:", ev.ask, "last:", ev.last)
}

function onOrder(ev) {
    Log("order", ev.id, ev.state, "filled:", ev.filledQty, "/", ev.qty)
}

function main() {
    // 第一个参数是账户在exchanges中的下标，0即exchanges[0]
    ctx.subscribe(0, "BTC_USDT", {channel: "ticker"})
    // 订单回报是账户级的私有流，symbol传空字符串
    ctx.subscribe(0, "", {channel: "orders"})
    while (true) {
        var ev = ctx.poll([], 1000)   // []表示所有订阅，最多等1秒
        if (!ev) {
            continue
        }
        if (ev.kind === 1) {
            onTicker(ev)
        } else if (ev.kind === 16) {
            onOrder(ev)
        }
    }
}
```

订阅是惰性的：```ctx.subscribe()```立即返回并登记订阅，第一次调用```ctx.poll()```时才向交易所建立连接、发送订阅。连接状态的变化以网关状态事件（```kind```为```33```）通知。

各频道对应的事件```kind```：```ticker```、```bbo```为```1```，```depth```为```3```，```trade```为```4```，```kline```为```5```，```orders```为```16```。事件字段见`ctx.poll`。

取事件不及时的处理（投递模式）：```ticker```、```bbo```、```depth```默认只保留最新一条；```trade```、```kline```默认缓存最近```1024```条，溢出时丢弃最旧的；用```mode```、```buffer```可以改变。订单回报、网关状态不会被丢弃，所以订阅后要持续调用```ctx.poll()```。订单簿在托管者内持续更新，不受取事件快慢影响，任何时候用`ctx.book`读到的都是最新的完整订单簿。

参数有误时（例如未知的```channel```、行情频道没有传```symbol```）抛出异常。取消订阅使用```ctx.unsubscribe(ex, symbol, options)```，参数与```ctx.subscribe()```相同。

```ctx.subscribe()```、```ctx.poll()```与`EventLoop`从同一个事件队列取事件，同一个策略里只使用其中一种方式取事件。

```Rust```策略使用```ctx```模块的同名函数，签名为```ctx::subscribe(ex: u16, symbol: &str, opts: ctx::SubOpts) -> Result<u32, String>```，订阅选项用```ctx::SubOpts::ticker()```、```trade()```、```depth(n)```、```kline(秒数)```、```orders()```构造（没有```mode```、```buffer```选项），失败返回```Err```。```Python```没有这组接口。

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

See also: `ctx.subscribe`, `ctx.poll`, `ctx.book`, `EventLoop`

#### ctx.poll

```
ctx.poll()
ctx.poll(streams)
ctx.poll(streams, timeout)
ctx.poll(options, timeout)
```

取出下一条订阅事件，可以设置等待超时。事件由`ctx.subscribe`订阅产生，策略按事件的```kind```分别处理。

Parameters:

- `streams` (number / array, optional): 要取的事件流：```ctx.subscribe()```返回的ID，或ID数组。省略或传```[]```表示全部事件流，单线程的策略一般这样用。内置事件流：```ctx.STREAM_TIMER```（定时器）、```ctx.STREAM_STATUS```（网关状态）、```ctx.STREAM_REST```（所有没有被其它过滤条件点名的事件流）。
- `timeout` (number, optional): 等待超时，单位毫秒，必须是非负整数。省略时一直等到有事件；```0```表示不等待；正数表示最多等待这么久，超时返回空值。
- `options` (object, optional): 对象形式```{streams, sources}```：```streams```同上；```sources```为要等待的事件来源数组，可选```engine```（订阅事件，默认）、```thread```（线程消息）、```go```（```exchange.Go()```等并发任务完成）、```dial```（```Dial()```连接可读）、```task```，或```all```表示全部。使用这种形式时返回值包装为```{source, event, seq, nano, queue}```，```event```是对应来源的事件内容。

Returns (object / 空值): 事件对象，字段见下文；超时没有事件时返回空值。

订阅1分钟K线，只在K线收盘时处理，同时记录网关状态变化。

```javascript
function onKline(ev) {
    if (ev.prefill) {
        return                        // 首次订阅推送的历史K线
    }
    if (ev.closed) {
        Log("closed bar", _D(ev.openTimeMs), "close:", ev.close, "volume:", ev.volume)
    }
}

function main() {
    ctx.subscribe(0, "BTC_USDT", {channel: "kline", interval: 60})
    while (true) {
        var ev = ctx.poll([], 5000)
        if (!ev) {
            Log("no event in 5 seconds")
            continue
        }
        if (ev.kind === 5) {
            onKline(ev)
        } else if (ev.kind === 35) {
            Log("kline history ready:", JSON.stringify(ev))
        } else if (ev.kind === 33) {
            Log("gateway status:", JSON.stringify(ev))
        }
    }
}
```

所有事件都有以下字段：

| 字段 | 类型 | 说明 |
| - | - | - |
| kind | number | 事件类型：```1``` ticker，```3``` 深度，```4``` 成交，```5``` K线，```16``` 订单回报，```32``` 定时器，```33``` 网关状态，```35``` K线历史初始化状态 |
| ex | number | 账户在```exchanges```中的下标，可以直接传给```ctx.book()```等函数的第一个参数；不属于任何账户的事件为```-1``` |
| symbol | string | 品种代码，例如```BTC_USDT```、```BTC_USDT.swap``` |
| seq | number | 事件序号，单调递增 |
| ts | number | 托管者收到交易所数据的时间（毫秒时间戳，带小数）；```Date.now() - ev.ts```为托管者内部处理与取事件的延迟，不含交易所到托管者的网络延迟 |

各类事件的其它字段：

| kind | 字段 |
| - | - |
| 1（ticker、bbo） | ```bid```、```ask```、```last```、```bidQty```、```askQty```、```volume```、```openInterest```、```open```、```high```、```low```、```time```（交易所时间，毫秒）。```bbo```频道没有最新价时```last```为```0``` |
| 3（深度） | 没有档位字段，只表示订单簿已更新；档位用`ctx.book`读取 |
| 4（成交） | ```px```（价格）、```qty```（数量）、```side```（主动成交方向```buy```/```sell```，交易所未提供时为```""```）、```tradeId```、```time``` |
| 5（K线） | ```open```、```high```、```low```、```close```、```volume```、```openInterest```、```intervalSec```、```openTimeMs```、```closed```（该根K线已收盘）、```prefill```（首次订阅时推送的历史K线） |
| 16（订单回报） | ```id```（订单号）、```state```（```acked```、```partial```、```filled```、```canceled```、```rejected```）、```px```、```qty```、```filledQty```、```avgPx```、```reason```（拒单原因码，```0```为无）、```reasonText``` |
| 33（网关状态） | ```status```（```1```连接正常，```2```断开，```3```降级）、```detail``` |
| 35（K线历史初始化） | ```channel```、```intervalSec```、```prefillStatus```（```1```完成，```2```失败）、```message```（失败原因） |

价格、数量都是实数，已按合约精度换算。

使用```streams```过滤时，要保证每个事件流都有人取：订单回报、网关状态、定时器事件不会丢弃，没人取会一直积压。只在一处取事件时传```[]```；分开取时，其中一处要带上```ctx.STREAM_REST```。

等待期间仍会执行```Promise```、```setTimeout```回调和WebSocket、TCP连接的读写；```timeout```为```0```时也会处理一轮这些任务。

订阅事件只能在主线程中取；在```threading.Thread()```创建的线程中只能用```options```形式等待```thread```等其它来源。```ctx.poll()```与`EventLoop`从同一个事件队列取事件，同一个策略里只使用其中一种方式。

```Rust```中为```ctx::poll(streams: &[u32], timeout_ms: Option<u64>) -> ctx::Polled```：空切片表示全部，```None```表示一直等待；返回```Polled::Event(ev)```、```Polled::Empty```（超时）、```Polled::Stopped```（实盘停止）或```Polled::Error(rc)```。```Rust```的事件是原始结构，价格、数量是定点整数（精度用```ctx::scales_of```查询）。```Rust```可以在多个线程中分别```poll```不同的事件流。```Python```没有这组接口。

See also: `ctx.subscribe`, `ctx.poll`, `ctx.book`, `EventLoop`

#### ctx.book

```
ctx.book(ex, symbol)
ctx.book(ex, symbol, n)
```

读取托管者维护的订单簿。需要先用`ctx.subscribe`订阅该品种的```depth```频道。

Parameters:

- `ex` (number, required): 账户在```exchanges```数组中的下标，可以直接传深度事件的```ev.ex```。
- `symbol` (string, required): 品种代码，可以直接传深度事件的```ev.symbol```，写法见`品种代码`。
- `n` (number, optional): 每一侧返回的档数，不传时为```5```。

Returns (object): ```{bids: [[价格, 数量], ...], asks: [[价格, 数量], ...]}```，```bids```按价格从高到低，```asks```从低到高。还没有收到订单簿数据时两侧都是空数组；品种无法识别时返回```Error```对象（不抛出异常），用```instanceof Error```判断。

订阅订单簿，每次更新时读取买一、卖一。

```javascript
function main() {
    ctx.subscribe(0, "BTC_USDT", {channel: "depth", depth: 20})
    while (true) {
        var ev = ctx.poll([], 1000)
        if (!ev || ev.kind !== 3) {
            continue
        }
        // 深度事件只表示订单簿已更新，档位从ctx.book()读取
        var book = ctx.book(ev.ex, ev.symbol, 5)
        if (book instanceof Error) {
            Log("ctx.book failed:", book.message)
            continue
        }
        if (book.bids.length > 0 && book.asks.length > 0) {
            Log("bid1:", book.bids[0][0], book.bids[0][1], "ask1:", book.asks[0][0], book.asks[0][1])
        }
    }
}
```

深度事件（```kind```为```3```）只表示订单簿已更新，不带档位。订单簿在托管者内按交易所推送持续更新，与策略取事件的快慢无关，任何时候读到的都是最新的完整订单簿。

```Rust```中为```ctx::book(ex: u16, symbol: &str, n: usize) -> Result<String, String>```，返回同样结构的JSON字符串。```Python```没有这组接口。

See also: `ctx.subscribe`, `ctx.poll`, `ctx.book`, `EventLoop`, `exchange.GetDepth`

#### threading

全局多线程管理工具，提供了创建并发线程、线程锁、条件变量等功能。本章节介绍```threading```对象的成员函数。仅```JavaScript```语言策略支持该对象。

##### threading.Thread

```
Thread(func, ...args)
Thread(...items)
```

创建并发线程。

Parameters:

- `func` (function, required): 用于并发执行的函数（通过引用传递），支持传入匿名函数。```func```可接受多个参数，这些参数将在并发执行时通过```...args```传入。因此，```func```的参数列表需要与```...args```保持一致。
- `arg` (string / number / bool / object / array / function / any, optional): 在回调执行时传递给```func```（即并发线程执行函数）的实际参数；参数```arg```可以有多个，```func```的参数列表需要与```...args```保持一致。
- `item` (array, required): 一个数组，第一个元素是函数引用或函数源码字符串，其余元素是该函数的参数；调用```Thread```函数时，参数```item```可以传入多组。多组时在同一个线程里按以下顺序执行：先从最后一组倒序执行到第二组，最后执行第一组；第一组是主函数，其返回值作为```join()```结果中的```ret```。后面几组通常用来定义函数、加载库：源码字符串按全局脚本执行，其中定义的函数可以在主函数中调用（源码字符串不接收参数）。

Returns (`Thread`对象): ```Thread```对象，用于管理创建的并发线程、线程通信等。

同时创建一个自定义函数和一个匿名函数的并发线程。

```javascript
function test1(a, b, c) {
    Log("test1:", a, b, c)
}

function main() {
    var t1 = threading.Thread(test1, 1, 2, 3)
    var t2 = threading.Thread(function (msg) {
        Log("msg:", msg)
    }, "Hello thread2")

    t1.join()
    t2.join()
}
```

使用 ```Thread(...items)``` 形式创建并发线程，在一个线程里执行多组函数：先执行最后一组（源码字符串，定义 test2），再执行第二组（test1 调用 test2），最后执行第一组。

```javascript
function test1(msg) {
    Log("msg:", msg)
    test2("Hello test2")
}

function main() {
    var t1 = threading.Thread(
        [function(a, b, c) {Log(a, b, c)}, 1, 2, 3],
        [test1, "Hello test1"],
        [`function test2(msg) {Log("msg:", msg)}`])

    t1.join()
}
```

支持向并发执行函数的参数中传入函数。

```javascript
function testFunc1(p) {
    Log("testFunc1 p:", p)
}

function main() {
    threading.Thread(function(pfn) {
        var threadName = threading.currentThread().name()
        var threadId = threading.currentThread().id()
        pfn(`in thread threadName: ${threadName}, threadId: ${threadId}`)
    }, testFunc1).join()
}
```

支持传入函数字符串，可动态导入外部库进行并发计算。

```javascript
function ml(input) {
    const net = new brain.NeuralNetwork()
    net.train([
        { input: [0, 0], output: [0] },
        { input: [0, 1], output: [1] },
        { input: [1, 0], output: [1] },
        { input: [1, 1], output: [0] },
    ])
    return net.run(input)
}

function main() {
    var ret = threading.Thread([ml, [1, 0]], [HttpQuery("https://unpkg.com/brain.js")]).join()

    // ret: {"id":1,"terminated":false,"elapsed":337636000,"error":null,"ret":{"0":0.9339330196380615}}
    Log(ret)
}
```

传入```Thread()```函数用于并发执行的线程函数```func```运行在隔离环境中，因此无法直接引用线程外部的变量，引用时调用```Thread()```会报错：```external variables reference are not allowed```。同时，线程内不支持引用其他闭包函数。线程内部可以调用平台提供的所有API，但不能直接调用用户自定义的其他函数；需要用到的函数可以作为参数传入，或者用```Thread(...items)```形式在后面几组中定义。

当线程执行完毕且没有被持续引用时，系统底层会自动回收线程相关的资源，无需显式调用```join()```函数来释放资源。

支持回测系统、实盘环境；所有并发线程相关的函数在回测系统中仅作为代码兼容性支持，实际不会真正执行并发线程。

See also: `getThread`, `mainThread`, `currentThread`, `Lock`,  `Condition`, `Event`, `Dict`, `pending`,  `eventLoop`

##### threading.getThread

```
getThread(threadId)
```

根据指定的线程ID获取线程对象。

Parameters:

- `threadId` (number, required): 线程对象ID，通过指定该参数获取对应的线程对象。

Returns (`Thread`对象): 由参数threadId指定的```Thread```对象

通过```threadId```获取指定的线程对象。

```javascript
function main() {
    var t1 = threading.Thread(function () {
        // Thread 对象有方法：id()，用于获取线程的Id，可以查看文档对应Thread对象的章节
        var id = threading.currentThread().id()
        var thread1 = threading.getThread(id)

        Log("id:", id, ", thread1.id():", thread1.id())
        Log(`id == thread1.id():`, id == thread1.id())
    })
    t1.join()
}
```

支持回测系统、实盘环境。

如果目标线程已经执行完毕并被释放，则无法通过```threading.getThread(threadId)```获取该线程的线程对象。

See also: `Thread`, `mainThread`, `currentThread`, `Lock`,  `Condition`, `Event`, `Dict`, `pending`,  `eventLoop`

##### threading.mainThread

```
mainThread()
```

获取主线程的线程对象，即策略中```main()```函数所在的线程。

Returns (`Thread`对象): 主线程的线程对象。

获取主线程的```Thread```对象，输出主线程的```threadId```。

```javascript
function main() {
    Log("Main thread ID:", threading.mainThread().id())
}
```

在并发线程中也可以获取主线程的线程对象。

```javascript
function test() {
    Log("Main thread ID output in test function:", threading.mainThread().id())
}

function main() {
    var t1 = threading.Thread(test)
    t1.join()
}
```

支持回测系统、实盘环境。

See also: `getThread`, `Thread`, `currentThread`, `Lock`,  `Condition`, `Event`, `Dict`, `pending`,  `eventLoop`

##### threading.currentThread

```
currentThread()
```

获取当前线程的线程对象。

Returns (`Thread`对象): 当前线程的线程对象。

获取当前线程的```Thread```对象，输出当前线程的```threadId```。

```javascript
function test() {
    Log("Current thread ID:", threading.currentThread().id())
}

function main() {
    var t1 = threading.Thread(test)
    t1.join()
}
```

支持回测系统、实盘环境。

See also: `Thread`, `mainThread`, `Thread`, `Lock`,  `Condition`, `Event`, `Dict`, `pending`,  `eventLoop`

##### threading.Lock

```
Lock()
```

创建线程锁对象。

Returns (`ThreadLock`对象): 线程锁对象。

两个并发线程访问共享资源。

```javascript
function consumer(productionQuantity, dict, lock) {
    for (var i = 0; i < productionQuantity; i++) {
        lock.acquire()
        var count = dict.get("count")
        Log("consumer:", count)
        Sleep(1000)
        lock.release()
    }
}

function producer(productionQuantity, dict, lock) {
    for (var i = 0; i < productionQuantity; i++) {
        lock.acquire()
        dict.set("count", i)
        Log("producer:", i)
        Sleep(1000)
        lock.release()
    }
}

function main() {
    var dict = threading.Dict()
    dict.set("count", -1)
    var lock = threading.Lock()
    var productionQuantity = 10
    var producerThread = threading.Thread(producer, productionQuantity, dict, lock)
    var consumerThread = threading.Thread(consumer, productionQuantity, dict, lock)

    consumerThread.join()
    producerThread.join()
}
```

支持回测系统、实盘环境。

See also: `getThread`, `mainThread`, `currentThread`, `Thread`,  `Condition`, `Event`, `Dict`, `pending`,  `eventLoop`

##### threading.Condition

```
Condition()
```

创建一个条件变量对象，该对象用于在多线程并发环境中实现线程间的同步与通信。通过```Condition()```，一个线程可以在特定条件未满足时进入等待状态，直到另一个线程发出信号通知条件已满足。

Returns (`ThreadCondition`对象): ```ThreadCondition```对象。

两个并发线程访问共享资源。

```javascript
function consumer(productionQuantity, dict, condition) {
    for (var i = 0; i < productionQuantity; i++) {
        condition.acquire()
        while (dict.get("array").length == 0) {
            condition.wait()
        }
        var arr = dict.get("array")
        var count = arr.shift()
        dict.set("array", arr)
        Log("consumer:", count, ", array:", arr)
        condition.release()
        Sleep(1000)
    }
}

function producer(productionQuantity, dict, condition) {
    for (var i = 0; i < productionQuantity; i++) {
        condition.acquire()
        var arr = dict.get("array")
        arr.push(i)
        dict.set("array", arr)
        Log("producer:", i, ", array:", arr)
        condition.notify()
        condition.release()
        Sleep(1000)
    }
}

function main() {
    var dict = threading.Dict()
    dict.set("array", [])
    var condition = threading.Condition()
    var productionQuantity = 10
    var producerThread = threading.Thread(producer, productionQuantity, dict, condition)
    var consumerThread = threading.Thread(consumer, productionQuantity, dict, condition)
    consumerThread.join()
    producerThread.join()
}
```

回测系统暂不支持此功能，仅提供接口定义。

See also: `getThread`, `mainThread`, `currentThread`, `Lock`,  `Thread`, `Event`, `Dict`, `pending`,  `eventLoop`

##### threading.Event

```
Event()
```

创建一个*线程事件*对象，该对象用于线程间的同步，允许一个线程等待另一个线程的通知或信号。

Returns (`ThreadEvent`对象): ```ThreadEvent```对象。

两个并发线程访问共享资源。

```javascript
function consumer(productionQuantity, dict, pEvent, cEvent) {
    for (var i = 0; i < productionQuantity; i++) {
        while (dict.get("array").length == 0) {
            pEvent.wait()
        }
        if (pEvent.isSet()) {
            pEvent.clear()
        }

        var arr = dict.get("array")
        var count = arr.shift()
        dict.set("array", arr)
        Log("consumer:", count, ", array:", arr)
        cEvent.set()
        Sleep(1000)
    }
}

function producer(productionQuantity, dict, pEvent, cEvent) {
    for (var i = 0; i < productionQuantity; i++) {
        while (dict.get("array").length != 0) {
            cEvent.wait()
        }
        if (cEvent.isSet()) {
            cEvent.clear()
        }

        var arr = dict.get("array")
        arr.push(i)
        dict.set("array", arr)
        Log("producer:", i, ", array:", arr)
        pEvent.set()
        Sleep(1000)
    }
}

function main() {
    var dict = threading.Dict()
    dict.set("array", [])
    var pEvent = threading.Event()
    var cEvent = threading.Event()
    var productionQuantity = 10
    var producerThread = threading.Thread(producer, productionQuantity, dict, pEvent, cEvent)
    var consumerThread = threading.Thread(consumer, productionQuantity, dict, pEvent, cEvent)

    consumerThread.join()
    producerThread.join()
}
```

支持回测系统、实盘环境。

See also: `getThread`, `mainThread`, `currentThread`, `Lock`,  `Condition`, `Thread`, `Dict`, `pending`,  `eventLoop`

##### threading.Dict

```
Dict()
```

创建一个字典对象，用于在并发线程间传递和共享数据。

Returns (`ThreadDict`对象): ```ThreadDict```对象。

向并发线程执行函数传入普通对象，测试修改对象键值后是否会影响其他线程中的对象键值。

```javascript
function threadFun1(obj) {
    obj["age"] = 100
    while (true) {
        Log("threadFun1 obj:", obj)
        Sleep(5000)
    }
}

function threadFun2(obj) {
    while (true) {
        Log("threadFun2 obj:", obj)
        Sleep(5000)
    }
}

function main() {
    var obj = {"age": 10}
    var t1 = threading.Thread(threadFun1, obj)
    var t2 = threading.Thread(threadFun2, obj)
    t1.join()
    t2.join()
}
```

向并发线程执行函数传入通过```Dict()```函数创建的```ThreadDict```对象，测试修改对象键值后是否会影响其他线程中的对象键值。

```javascript
function threadFun1(threadDict) {
    threadDict.set("age", 100)
    while (true) {
        Log(`threadFun1 threadDict.get("age"):`, threadDict.get("age"))
        Sleep(5000)
    }
}

function threadFun2(threadDict) {
    while (true) {
        Log(`threadFun2 threadDict.get("age"):`, threadDict.get("age"))
        Sleep(5000)
    }
}

function main() {
    var threadDict = threading.Dict()
    threadDict.set("age", 10)
    var t1 = threading.Thread(threadFun1, threadDict)
    var t2 = threading.Thread(threadFun2, threadDict)

    t1.join()
    t2.join()
}
```

向并发线程函数传入普通对象时采用深拷贝方式传递，在并发线程中修改键值不会影响其他线程中的字典。

支持回测系统、实盘环境。

See also: `getThread`, `mainThread`, `currentThread`, `Lock`,  `Condition`, `Event`, `Thread`, `pending`,  `eventLoop`

##### threading.Serve

```
Serve(serveURI, handler)
Serve(serveURI, handler, ...args)
```

在策略进程内创建Http服务、TCP服务、Websocket服务（基于Http协议），返回`Server`对象。

Parameters:

- `serveURI` (string, required): 服务的协议、绑定地址、端口和可选设置，例如```http://0.0.0.0:8088?gzip=true```、```tcp://127.0.0.1:6666```；写法见备注。
- `handler` (function, required): 路由处理函数（Http协议）、消息处理函数（TCP协议）、Stream处理函数（Websocket）。每个TCP连接、每个Http请求都在独立的线程中调用一次该函数。
参数```handler```传入的回调函数可以定义多个参数，第一个参数为ctx对象（上下文对象）。
- `arg` (string / number / bool / object / array / function / any, optional): 传给回调函数```handler```的额外实参，可以有多个，依次对应回调函数中```ctx```之后的参数。

Returns (`Server`对象): 返回`Server`对象。用```addr()```获取实际监听的IP地址、端口，例如：```127.0.0.1:8088```、```0.0.0.0:8089```；用```close()```、```stop()```关闭服务。

启动一个Http服务，并从主线程请求它。

```javascript
function main() {
    var server = threading.Serve("http://127.0.0.1:8088", function (ctx) {
        ctx.write("hello " + ctx.path())
    })
    Log("serve on", server.addr())
    // 输出：serve on 127.0.0.1:8088
    Log(HttpQuery("http://127.0.0.1:8088/ping"))
    // 输出：hello /ping
    server.close()
}
```

在一个进程内启动Http（含WebSocket）和TCP回显服务，并逐一测试。

```javascript
function main() {
    let httpServer = threading.Serve("http://:8088?gzip=true", function (ctx) {
        Log("http connect from: ", ctx.remoteAddr(), "->", ctx.localAddr())
        let path = ctx.path()
        if (path == "/") {
            ctx.write(JSON.stringify({
                path: ctx.path(),
                method: ctx.method(),
                headers: ctx.headers(),
                cookie: ctx.header("Cookie"),
                remote: ctx.remoteAddr(),
                query: ctx.rawQuery()
            }))
        } else if (path == "/tickers") {
            let ret = exchange.GetTickers()
            if (!ret) {
                ctx.setStatus(500)
                ctx.write(GetLastError())
            } else {
                ctx.write(JSON.stringify(ret))
            }
        } else if (path == "/wss") {
            if (ctx.upgrade("websocket")) { // upgrade to websocket
                while (true) {
                    let r = ctx.read(10)
                    if (r == "") {
                        break
                    } else if (r) {
                        if (r == "ticker") {
                            ctx.write(JSON.stringify(exchange.GetTicker()))
                        } else {
                            ctx.write("not support")
                        }
                    }
                }
                Log("websocket closed", ctx.remoteAddr())
            }
        } else {
            ctx.setStatus(404)
        }
    })
    let echoServer = threading.Serve("tcp://:8089", function (ctx) {
        Log("tcp connect from: ", ctx.remoteAddr(), "->", ctx.localAddr())
        while (true) {
            let d = ctx.read()
            if (!d) {
                break
            }
            ctx.write(d)
        }
        Log("connect closed")
    })
    Log("http serve on", httpServer.addr(), "tcp serve on", echoServer.addr())

    for (var i = 0; i < 5; i++) {
        if (i == 2) {
            // test Http
            var retHttp = HttpQuery("http://127.0.0.1:8088?num=123&limit=100", {"debug": true})
            Log("retHttp:", retHttp)
        } else if (i == 3) {
            // test TCP
            var tcpConn = Dial("tcp://127.0.0.1:8089")
            tcpConn.write("Hello TCP Server")
            var retTCP = tcpConn.read()
            Log("retTCP:", retTCP)
        } else if (i == 4) {
            // test Websocket
            var wsConn = Dial("ws://127.0.0.1:8088/wss|compress=gzip")
            wsConn.write("ticker")
            var retWS = wsConn.read(1000)
            Log("retWS:", retWS)
            // no depth
            wsConn.write("depth")
            retWS = wsConn.read(1000)
            Log("retWS:", retWS)
        }
        Sleep(1000)
    }
    httpServer.close()
    echoServer.close()
}
```

- 该函数仅支持JavaScript语言策略。
- 处理函数与`Thread`创建的线程一样运行在隔离环境中，不能引用外部变量、闭包或自定义函数，需要的数据通过```...args```传入；可以调用平台所有的API函数。`ThreadDict`、`ThreadLock`等对象也可以作为参数传入，与其它线程共享数据。
- Http服务每个连接只处理一个请求，处理函数中```ctx.write()```写入的内容在函数返回后一次性发送。
- 每个服务同时执行的处理函数最多64个，超出时Http请求返回```503```，TCP连接直接断开。
- 策略停止时服务自动关闭；需要提前关闭时调用返回对象的```close()```或```stop()```。
- ```Websocket```服务基于Http协议实现，可以在path中设置一个路由分支，设计```Websocket```消息订阅/推送的实现代码，可以参考本节范例代码。
- 旧的全局函数```__Serve()```仍然可以使用，参数相同，返回值是监听地址字符串，相当于```threading.Serve(...).addr()```；新代码请使用```threading.Serve()```。

参数```handler```传入的回调处理函数接收一个```ctx```参数。```ctx```参数为一个上下文对象，用于获取数据和写入数据，有以下方法：
- ctx.proto()
  应用于Http/TCP协议，调用时返回协议名称。例如：```HTTP/1.1```、```tcp```。
- ctx.host()
  应用于Http协议，调用时返回主机信息：IP地址、端口。
- ctx.path()
  应用于Http协议，调用时返回请求路径。
- ctx.query(key)
  应用于Http协议，调用时返回请求中query查询中key对应的值。例如发送的请求为：```http://127.0.0.1:8088?num=123```，参数```handler```传入的回调处理函数中```ctx.query("num")```调用时返回```"123"```。
- ctx.rawQuery()
  应用于Http协议，调用时返回请求中的原始查询（Http请求的query）。
- ctx.headers()
  应用于Http协议，调用时返回请求中的请求头信息。
- ctx.header(key)
  应用于Http协议，调用时返回指定的请求头中的某个key对应的值。例如获取当前请求的headers中的```User-Agent```：```ctx.header("User-Agent")```。
- ctx.method()
  应用于Http协议，调用时返回请求方法，例如```GET```、```POST```等。
- ctx.body()
  应用于Http协议的POST请求，调用时返回请求的正文。
- ctx.setHeader(key, value)
  应用于Http协议，设置应答报文的请求头信息。
- ctx.setStatus(code)
  应用于Http协议，设置Http报文状态码，通常在路由分支最后设置Http状态码，默认为200。
- ctx.remoteAddr()
  应用于Http/TCP协议，调用时返回请求中的远程客户端地址、端口。
- ctx.localAddr()
  应用于Http/TCP协议，调用时返回服务本地地址、端口。
- ctx.upgrade("websocket")
  应用于基于Http协议的Websocket协议实现，切换```ctx```上下文对象为Websocket协议；切换成功返回布尔值（真），失败返回布尔值（假）。
- ctx.read(timeout_ms)
  应用于基于Http协议的Websocket协议实现/TCP协议，读取Websocket连接的数据，TCP连接的数据，普通Http协议中不支持使用该```read```方法；可以指定超时时间参数```timeout_ms```，单位毫秒。超时返回```null```，对方关闭连接返回空字符串```""```。
- ctx.write(s)
  应用于Http/TCP协议，用于写入字符串数据，可以使用```JSON.stringify()```编码JSON对象为字符串之后写入。对于```WebSocket```协议，可以使用该方法将编码后的字符串传递给客户端。

```serveURI```参数的写法：

- 协议前缀只支持```tcp://```（TCP服务）和```http://```（HTTP服务）。WebSocket服务也用```http://```，在处理函数中调用```ctx.upgrade("websocket")```切换。
- IP可以省略，写成```http://:8088```表示监听所有网卡；端口写```0```时随机分配空闲端口，实际地址用返回对象的```addr()```获取。
- ```?```后面可以加```gzip=true```（启用gzip压缩）、```tls=true```（启用TLS加密：Https、wss、TLS加密的TCP）。启用TLS时必须同时用```cert_pem```和```cert_key_pem```传入PEM格式的证书和私钥（内容需要URL编码），例如```http://:8443?tls=true&cert_pem=xxxx&cert_key_pem=xxxx```；Https服务写成```http://```加```tls=true```。

```arg```参数的用法：下面调用```Serve()```时传入的```1```、```2```、```3```依次成为回调函数的参数```a```、```b```、```c```。

```javascript
threading.Serve("http://:8088", function(ctx, a, b, c) {
    Log(`ctx.host():`, ctx.host(), ", a=", a, ", b=", b, ", c=", c)
}, 1, 2, 3)
```

See also: `Server`, `Dial`, `HttpQuery`, `Thread`

##### threading.pending

```
pending()
```

获取当前策略程序中正在运行的并发线程数量。

Returns (number): 当前策略程序中正在运行的并发线程数量。

创建两个并发运行的线程，并在不同时间点调用```pending()```函数。

```javascript
function threadFun1() {
    Log("threadFun1")
    Sleep(3000)
}

function threadFun2() {
    for (var i = 0; i < 3; i++) {
        LogStatus(_D(), "print from threadFun2")
        Sleep(3000)
    }
}

function main() {
    Log(`begin -- threading.pending():`, threading.pending())

    var t1 = threading.Thread(threadFun1)
    var t2 = threading.Thread(threadFun2)
    Log(`after threading.Thread -- threading.pending():`, threading.pending())

    t1.join()
    t2.join()
    Log(`after thread.join -- threading.pending():`, threading.pending())
}
```

当策略的```main()```函数开始运行时，直接调用```pending()```函数将返回1，这是因为```main()```函数所在的主线程本身也被计入正在运行的线程中。

支持回测系统和实盘环境。

See also: `getThread`, `mainThread`, `currentThread`, `Lock`,  `Condition`, `Event`, `Dict`, `Thread`,  `eventLoop`

#### Thread

线程对象，可以通过```threading.Thread()```、```threading.getThread()```、```threading.mainThread()```、```threading.currentThread()```创建或返回。

##### Thread.peekMessage

```
peekMessage()
peekMessage(timeout)
```

从线程接收消息。

Parameters:

- `timeout` (number, optional): 超时设置，按照该参数设置的毫秒数阻塞等待并返回数据；若无数据且超时则返回空值。如果```timeout```设置为0或不传```timeout```参数，则一直阻塞等待，直到接收到通道中的数据。如果```timeout```设置为-1，则不阻塞并立即返回数据，无数据时返回空值。

Returns (string / number / bool / object / array / any): 当前线程对象关联的线程所接收到的消息。

并发线程向主线程发送消息。

```javascript
function main() {
    var t1 = threading.Thread(function() {
        for (var i = 0; i < 10; i++) {
            Log("thread1 postMessage():", i)
            threading.mainThread().postMessage(i)
            Sleep(500)
        }
    })

    while (true) {
        var msg = threading.currentThread().peekMessage()
        Log("main peekMessage():", msg)
        if (msg == 9) {
            break
        }
        Sleep(1000)
    }

    t1.join()
}
```

编写程序时需注意避免线程死锁问题。

See also: `postMessage`, `join`, `terminate`, `getData`, `setData`, `id`, `name`, `eventLoop`

##### Thread.postMessage

```
postMessage(msg)
```

向线程发送消息。

Parameters:

- `msg` (string / number / bool / object / array / function / any, required): 要发送的消息。

在并发线程中发送消息，使用```eventLoop()```接收消息通知。

```javascript
function main() {
    var t1 = threading.Thread(function() {
        for (var i = 0; i < 10; i++) {
            Log("thread1 postMessage():", i)
            threading.mainThread().postMessage(i)
            Sleep(500)
        }
    })
    for (var i = 0; i < 10; i++) {
        var event = threading.mainThread().eventLoop()
        Log("main event:", event)
        Sleep(500)
    }
    t1.join()
}
```

支持发送函数。

```javascript
function main() {
    threading.mainThread().postMessage(function(msg) {
        Log("func from mainThread, msg:", msg)
    })

    threading.Thread(function() {
        var func = threading.mainThread().peekMessage()
        func("in " + threading.currentThread().name())
    }).join()
}
```

当线程的执行函数中调用```postMessage()```函数发送信号或数据时，会产生消息事件。可以使用```eventLoop()```函数接收消息通知。

每个线程的消息队列最多保存10240条消息、合计32MB，任一上限到达时丢弃最旧的消息并输出一条警告。接收消息的线程应及时调用```peekMessage()```取走消息。

See also: `peekMessage`, `join`, `terminate`, `getData`, `setData`, `id`, `name`, `eventLoop`

##### Thread.join

```
join()
join(timeout)
```

等待线程退出，并回收系统资源。

Parameters:

- `timeout` (number, optional): 等待线程结束的超时时间，单位为毫秒。```timeout```参数设置为0或者不设置```timeout```参数时```join()```函数会阻塞，等待到线程执行结束。```timeout```参数设置为-1时，```join()```函数会立即返回。

Returns (`ThreadRet`对象): `ThreadRet`对象：线程Id（```id```）、是否被强制结束（```terminated```）、运行时间（```elapsed```，纳秒）、异常信息（```error```，没有异常时为null）和线程函数的返回值（```ret```）。

测试```join()```函数超时，输出返回值。

```javascript
function main() {
    var t1 = threading.Thread(function() {
        Log("Hello thread1")
        Sleep(5000)
    })

    var ret = t1.join(1000)
    Log("ret:", ret)
    // 输出：ret: undefined

    ret = t1.join()
    Log("ret:", ret)
    // 输出：ret: {"id":1,"terminated":false,"elapsed":5003252000,"error":null}
}
```

```join()```函数超时，返回```undefined```。

See also: `peekMessage`, `postMessage`, `terminate`, `getData`, `setData`, `id`, `name`, `eventLoop`

##### Thread.terminate

```
terminate()
```

强制终止线程，释放创建线程时占用的硬件资源。

强制终止一个线程的执行。在强制终止线程后，日志中将不再显示该线程输出的内容。

```javascript
function main() {
    var t1 = threading.Thread(function() {
        for (var i = 0; i < 10; i++) {
            Log("thread1 i:", i)
            Sleep(1000)
        }
    })

    Sleep(3000)
    t1.terminate()
    Log("after t1.terminate()")

    while (true) {
        LogStatus(_D())
        Sleep(1000)
    }
}
```

对于使用```terminate()```函数强制终止的线程，仍然可以调用```join()```函数，它会很快返回```terminated```为```true```的结果。

See also: `peekMessage`, `postMessage`, `join`, `getData`, `setData`, `id`, `name`, `eventLoop`

##### Thread.getData

```
getData(key)
```

访问线程环境中记录的变量。数据随```Thread```对象保存，线程结束（```join()```或```terminate()```）之后，通过仍持有的```Thread```对象依然可以读取。

Parameters:

- `key` (string, required): 存储的键值对的键名。

Returns (string / number / bool / object / array / any): 当前线程环境中存储的键值对中```key```参数对应的键值。

在并发线程的环境中记录键名为```count```的值，然后在主线程中读取```count```的键值。

```javascript
function main() {
    var t1 = threading.Thread(function() {
        for (var i = 0; i < 5; i++) {
            threading.currentThread().setData("count", i)
            Log(`setData("count"):`, i)
            Sleep(1000)
        }
    })
    for (var i = 0; i < 5; i++) {
        var count = threading.getThread(t1.id()).getData("count")
        Log(`getData("count"):`, count)
        Sleep(1000)
    }
    t1.join()
}
```

See also: `peekMessage`, `postMessage`, `join`, `terminate`, `setData`, `id`, `name`, `eventLoop`

##### Thread.setData

```
setData(key, value)
```

在线程环境中存储变量。

Parameters:

- `key` (string, required): 存储的键值对的键名。
- `value` (string / number / bool / object / array / function / any, required): 存储的键值对的键值。

在并发线程中设置键值对，在主线程中读取该键值对。

```javascript
function main() {
    var t1 = threading.Thread(function() {
        threading.currentThread().setData("data", 100)
    })
    Sleep(1000)
    Log(`t1.getData("data"):`, t1.getData("data"))
    t1.join()
}
```

支持将函数作为键值传入。

```javascript
function main() {
    threading.mainThread().setData("func2", function(p) {
        Log("func2 p:", p)
    })

    var t1 = threading.Thread(function() {
        threading.currentThread().setData("func1", function(p) {
            Log("func1 p:", p)
        })

        var func2 = threading.mainThread().getData("func2")
        func2("test2")
    })

    Sleep(1000)
    var func1 = t1.getData("func1")
    func1("test1")
    t1.join()
}
```

数据随```Thread```对象保存，线程结束（```join()```或```terminate()```）之后，通过仍持有的```Thread```对象依然可以读取。参数```value```的值必须是可序列化的变量。

See also: `peekMessage`, `postMessage`, `join`, `terminate`, `getData`, `id`, `name`, `eventLoop`

##### Thread.id

```
id()
```

返回当前多线程对象实例的```threadId```。

Returns (number): 线程Id（```threadId```）。

创建一个并发运行的线程，在主线程中输出该并发线程的```threadId```。

```javascript
function main() {
    var t1 = threading.Thread(function() {
        threading.currentThread().setData("data", 100)
    })
    Log(`t1.id():`, t1.id())
    t1.join()
}
```

See also: `peekMessage`, `postMessage`, `join`, `terminate`, `getData`, `setData`, `name`, `eventLoop`

##### Thread.name

```
name()
```

返回当前多线程对象实例的名称。

Returns (string): 并发线程的名称。

创建一个并发运行的线程，在主线程中输出该并发线程的名称。

```javascript
function main() {
    var t1 = threading.Thread(function() {
        threading.currentThread().setData("data", 100)
    })
    Log(`t1.name():`, t1.name())
    // 输出：t1.name(): Thread-1
    t1.join()
}
```

See also: `peekMessage`, `postMessage`, `join`, `terminate`, `getData`, `setData`, `id`, `eventLoop`

##### Thread.eventLoop

```
eventLoop()
eventLoop(timeout)
```

监听当前线程（调用者所在线程）接收到的事件。

Parameters:

- `timeout` (number, optional): 超时时间，单位为毫秒。若 ```timeout``` 设置为 0，则一直阻塞等待，直到有事件发生才返回；若大于 0，则设置事件等待的超时时间；若小于 0，则立即返回最近的事件。

Returns (object / 空值): 当前线程接收到的事件信息，详见`事件信息结构`。

并发执行 3 个线程，输出接收到的事件信息；当超时或立即返回时，输出的是空值。

```javascript
function main() {
    var t1 = threading.Thread(function() {
        while (true) {
            var eventMsg = threading.currentThread().eventLoop()     // 阻塞等待
            Log(_D(), "thread1 eventMsg:", eventMsg)
            // 输出：2024-11-14 10:14:18 thread1 eventMsg: {"Seq":1,"Event":"thread","ThreadId":0,"Index":1,"Queue":0,"Nano":1731550458699947000}
        }
    })

    var t2 = threading.Thread(function() {
        while (true) {
            var eventMsg = threading.currentThread().eventLoop(-1)   // 立即返回
            Log(_D(), "thread2 eventMsg:", eventMsg)
            Sleep(5000)
        }
    })

    var t3 = threading.Thread(function() {
        while (true) {
            var eventMsg = threading.currentThread().eventLoop(3000) // 设置3秒超时
            Log(_D(), "thread3 eventMsg:", eventMsg)
        }
    })

    t1.postMessage("Hello " + t1.name())
    t2.postMessage("Hello " + t2.name())
    t3.postMessage("Hello " + t3.name())
    t1.join()
    t2.join()
    t3.join()
}
```

```eventLoop()``` 函数的处理机制与全局函数 ```EventLoop()``` 一致。监听的始终是调用者所在线程的事件，与通过哪个 ```Thread``` 对象调用无关，例如在主线程中调用 ```t1.eventLoop()``` 收到的是主线程的事件。

See also: `peekMessage`, `postMessage`, `join`, `terminate`, `getData`, `setData`, `id`, `name`

#### ThreadLock

线程锁对象，用于多线程同步处理。

##### ThreadLock.acquire

```
acquire()
acquire(timeout)
```

请求线程锁（加锁）。

Parameters:

- `timeout` (number, optional): 等待加锁的超时时间，单位为毫秒。不传或者小于等于 0 时一直等待，直到获得锁。

Returns (bool): 获得锁返回```true```，等待超时返回```false```。

```acquire()```函数用于请求线程锁。当线程调用某个线程锁对象的```acquire()```函数时，它会尝试获取该锁。如果锁当前未被其他线程占用，调用线程将成功获得锁并继续执行。如果锁已被其他线程持有，调用```acquire()```的线程将被阻塞，直到锁被释放。

See also: `Lock`, `release`

##### ThreadLock.release

```
release()
```

释放线程锁（解锁）。

测试死锁场景

```javascript
function consumer(productionQuantity, dict, pLock, cLock) {
    for (var i = 0; i < productionQuantity; i++) {
        pLock.acquire()
        cLock.acquire()
        var arr = dict.get("array")
        var count = arr.shift()
        dict.set("array", arr)
        Log("consumer:", count, ", array:", arr)
        cLock.release()
        Sleep(1000)
        pLock.release()
    }
}

function producer(productionQuantity, dict, pLock, cLock) {
    for (var i = 0; i < productionQuantity; i++) {
        cLock.acquire()   // cLock.acquire() 放在 pLock.acquire() 后不会产生死锁
        pLock.acquire()
        var arr = dict.get("array")
        arr.push(i)
        dict.set("array", arr)
        Log("producer:", i, ", array:", arr)
        pLock.release()
        Sleep(1000)
        cLock.release()
    }
}

function main() {
    var dict = threading.Dict()
    dict.set("array", [])
    var pLock = threading.Lock()
    var cLock = threading.Lock()
    var productionQuantity = 10
    var producerThread = threading.Thread(producer, productionQuantity, dict, pLock, cLock)
    var consumerThread = threading.Thread(consumer, productionQuantity, dict, pLock, cLock)

    consumerThread.join()
    producerThread.join()
}
```

需要注意，线程锁使用不当可能导致死锁。

See also: `Lock`, `acquire`

#### ThreadEvent

事件对象，用于多线程间的事件通知和信号传递。

##### ThreadEvent.set

```
set()
```

设置事件信号。

对已经通过```set()```设置的事件再次调用```set()```没有额外效果。调用```set()```时正在```wait()```的线程都会被唤醒，即使紧接着调用了```clear()```。

See also: `clear`, `wait`, `isSet`, `threading.Event`

##### ThreadEvent.clear

```
clear()
```

清除信号。

See also: `set`, `wait`, `isSet`, `threading.Event`

##### ThreadEvent.wait

```
wait()
wait(timeout)
```

设置事件（信号）等待，在事件（信号）被设置之前会阻塞；支持设置超时参数。

Parameters:

- `timeout` (number, optional): 等待超时时间，单位为毫秒。

Returns (bool): 返回是否超时，如果发生超时则返回真值。

测试```wait()```函数的返回值。

```javascript
function main() {
    var event = threading.Event()
    var t1 = threading.Thread(function(event) {
        var ret = event.wait(100)
        Log(`event.wait(100):`, ret)
        ret = event.wait()
        Log(`event.wait():`, ret)
    }, event)

    Sleep(1000)
    event.set()
    t1.join()
}
```

See also: `set`, `clear`, `isSet`

##### ThreadEvent.isSet

```
isSet()
```

判断事件（信号）是否已被设置。

Returns (bool): 事件（信号）的设置状态；如果事件（信号）已被设置，则返回真值。

See also: `set`, `clear`, `wait`, `threading.Event`

#### ThreadCondition

条件变量对象，用于实现多线程间的同步与通信。

##### ThreadCondition.notify

```
notify()
```

唤醒一个正在等待的线程（如果存在）。只有调用了```wait()```方法的线程才能被唤醒。

使用```notify()```函数唤醒等待中的线程。

```javascript
function consumer(dict, condition) {
    while (true) {
        condition.acquire()
        while (dict.get("array").length == 0) {
            Log(threading.currentThread().name(), "wait()...", ", array:", dict.get("array"))
            condition.wait()
        }
        var arr = dict.get("array")
        var num = arr.shift()
        Log(threading.currentThread().name(), ", num:", num, ", array:", arr, "#FF0000")
        dict.set("array", arr)
        Sleep(1000)
        condition.release()
    }
}

function main() {
    var condition = threading.Condition()
    var dict = threading.Dict()
    dict.set("array", [])
    var t1 = threading.Thread(consumer, dict, condition)
    var t2 = threading.Thread(consumer, dict, condition)
    var t3 = threading.Thread(consumer, dict, condition)
    Sleep(1000)
    var i = 0
    while (true) {
        condition.acquire()
        var msg = ""
        var arr = dict.get("array")
        var randomNum = Math.floor(Math.random() * 5) + 1
        if (arr.length >= 3) {
            condition.notifyAll()
            msg = "notifyAll"
        } else {
            arr.push(i)
            dict.set("array", arr)
            if (randomNum > 3 && arr.length > 0) {
                condition.notify()
                msg = "notify"
            } else {
                msg = "pass"
            }
            i++
        }

        Log(_D(), "randomNum:", randomNum, ", array:", arr, ", msg:", msg)
        condition.release()
        Sleep(1000)
    }
}
```

```notify()```函数会唤醒处于等待队列中的一个线程。

```notify()```函数唤醒线程时，该线程会重新获取线程锁。

See also: `notifyAll`, `wait`,  `acquire`, `release`

##### ThreadCondition.notifyAll

```
notifyAll()
```

唤醒所有正在等待的线程。

```notifyAll()```函数会逐个唤醒所有处于等待状态的线程，被唤醒的线程将重新获取线程锁。

See also: `notify`, `wait`,  `acquire`, `release`, `threading.Condition`

##### ThreadCondition.wait

```
wait()
```

在特定条件下使线程进入等待状态。

```wait()```函数会释放线程锁，当线程被唤醒时将重新获取线程锁。

See also: `notify`, `notifyAll`, `acquire`, `release`, `threading.Condition`

##### ThreadCondition.acquire

```
acquire()
```

请求线程锁（加锁）。

在调用```wait()```之前必须先请求当前条件对象的线程锁（加锁）。

See also: `notify`, `notifyAll`, `wait`,  `release`, `threading.Condition`

##### ThreadCondition.release

```
release()
```

释放线程锁（解锁）。

在调用```wait()```后需要释放当前条件对象的线程锁（解锁）。

See also: `notify`, `notifyAll`, `wait`,  `acquire`, `threading.Condition`

#### ThreadDict

线程安全的字典对象，用于在多线程环境中进行数据共享。

##### ThreadDict.get

```
get(key)
```

获取字典对象中记录的键值。

Parameters:

- `key` (string, required): 要获取的键名。

Returns (string / number / bool / object / array / any): 参数```key```指定的键对应的值。

使用事件对象通知线程读取和修改数据。

```javascript
function main() {
    var threadRead = threading.Event()     // 线程已读取数据
    var mainChanged = threading.Event()    // 主线程已修改数据
    var dict = threading.Dict()
    dict.set("data", 100)

    var t1 = threading.Thread(function(dict, threadRead, mainChanged) {
        Log(`thread1, dict.get("data"):`, dict.get("data"))
        threadRead.set()

        mainChanged.wait()
        Log(`after main change data, thread1 dict.get("data"):`, dict.get("data"))

        dict.set("data", 0)
    }, dict, threadRead, mainChanged)

    threadRead.wait()
    dict.set("data", 99)
    mainChanged.set()

    t1.join()
    Log(`main thread, dict.get("data"):`, dict.get("data"))
}
```

See also: `set`

##### ThreadDict.set

```
set(key, value)
```

设置键值对。

Parameters:

- `key` (string, required): 需要设置的键名。
- `value` (string / number / bool / object / array / function / any, required): 需要设置的键值。

支持将函数作为键值传入。

```javascript
function main() {
    var dict1 = threading.Dict()
    dict1.set("func1", function(p) {
        Log("func1 p:", p)
    })

    threading.Thread(function(dict1) {
        var func1 = dict1.get("func1")
        func1("test")
    }, dict1).join()
}
```

See also: `get`

#### Server

`threading.Serve`函数的返回值，代表一个正在运行的服务。可以作为线程执行函数的参数传入其它线程，在其它线程中查询或关闭服务。

##### Server.addr

```
addr()
```

返回服务实际监听的地址和端口。

Returns (string): 监听地址，例如```127.0.0.1:8088```、```0.0.0.0:8089```。端口写```0```时返回系统分配的端口。

在随机端口启动Http服务，观察处理中的请求数，再优雅关闭。

```javascript
function main() {
    // 端口写 0 表示随机分配空闲端口，实际地址用 addr() 获取
    var server = threading.Serve("http://127.0.0.1:0", function (ctx) {
        Sleep(1000)
        ctx.write("done")
    })
    Log("listen on", server.addr())
    // 输出：listen on 127.0.0.1:<随机端口>

    // 在另一个线程里发起请求，主线程观察服务状态
    threading.Thread(function (addr) {
        Log("response:", HttpQuery("http://" + addr + "/"))
        // 输出：response: done（约1秒后）
    }, server.addr())
    Sleep(200)
    Log("pending:", server.pending())
    // 输出：pending: 1（有一个请求正在处理）

    server.close()                      // 不再接收新连接，正在处理的请求继续执行
    Log("idle:", server.join(5000))
    // 输出：idle: true（服务已关闭且请求都处理完了）
}
```

See also: `close`, `stop`, `join`, `pending`, `Serve`

##### Server.close

```
close()
```

停止接收新连接，正在执行的处理函数继续执行完（优雅关闭）。

在随机端口启动Http服务，观察处理中的请求数，再优雅关闭。

```javascript
function main() {
    // 端口写 0 表示随机分配空闲端口，实际地址用 addr() 获取
    var server = threading.Serve("http://127.0.0.1:0", function (ctx) {
        Sleep(1000)
        ctx.write("done")
    })
    Log("listen on", server.addr())
    // 输出：listen on 127.0.0.1:<随机端口>

    // 在另一个线程里发起请求，主线程观察服务状态
    threading.Thread(function (addr) {
        Log("response:", HttpQuery("http://" + addr + "/"))
        // 输出：response: done（约1秒后）
    }, server.addr())
    Sleep(200)
    Log("pending:", server.pending())
    // 输出：pending: 1（有一个请求正在处理）

    server.close()                      // 不再接收新连接，正在处理的请求继续执行
    Log("idle:", server.join(5000))
    // 输出：idle: true（服务已关闭且请求都处理完了）
}
```

重复调用没有影响。需要等待正在执行的处理函数结束时，接着调用```join()```。

See also: `addr`, `stop`, `join`, `pending`, `Serve`

##### Server.stop

```
stop()
```

先关闭服务（同```close()```），再强制结束所有正在执行的处理函数线程。

在随机端口启动Http服务，观察处理中的请求数，再优雅关闭。

```javascript
function main() {
    // 端口写 0 表示随机分配空闲端口，实际地址用 addr() 获取
    var server = threading.Serve("http://127.0.0.1:0", function (ctx) {
        Sleep(1000)
        ctx.write("done")
    })
    Log("listen on", server.addr())
    // 输出：listen on 127.0.0.1:<随机端口>

    // 在另一个线程里发起请求，主线程观察服务状态
    threading.Thread(function (addr) {
        Log("response:", HttpQuery("http://" + addr + "/"))
        // 输出：response: done（约1秒后）
    }, server.addr())
    Sleep(200)
    Log("pending:", server.pending())
    // 输出：pending: 1（有一个请求正在处理）

    server.close()                      // 不再接收新连接，正在处理的请求继续执行
    Log("idle:", server.join(5000))
    // 输出：idle: true（服务已关闭且请求都处理完了）
}
```

强制结束的效果与`terminate`相同，处理函数中未发送的应答会丢失。

See also: `addr`, `close`, `join`, `pending`, `Serve`

##### Server.join

```
join()
join(timeout)
```

等待服务关闭且所有处理函数执行完毕。

Parameters:

- `timeout` (number, optional): 等待的超时时间，单位毫秒。省略或者为```0```时一直等待（策略停止时返回）。

Returns (bool): 服务已关闭且没有正在执行的处理函数时返回```true```，超时返回```false```。

在随机端口启动Http服务，观察处理中的请求数，再优雅关闭。

```javascript
function main() {
    // 端口写 0 表示随机分配空闲端口，实际地址用 addr() 获取
    var server = threading.Serve("http://127.0.0.1:0", function (ctx) {
        Sleep(1000)
        ctx.write("done")
    })
    Log("listen on", server.addr())
    // 输出：listen on 127.0.0.1:<随机端口>

    // 在另一个线程里发起请求，主线程观察服务状态
    threading.Thread(function (addr) {
        Log("response:", HttpQuery("http://" + addr + "/"))
        // 输出：response: done（约1秒后）
    }, server.addr())
    Sleep(200)
    Log("pending:", server.pending())
    // 输出：pending: 1（有一个请求正在处理）

    server.close()                      // 不再接收新连接，正在处理的请求继续执行
    Log("idle:", server.join(5000))
    // 输出：idle: true（服务已关闭且请求都处理完了）
}
```

服务没有关闭时```join()```会一直等到它被关闭，通常先调用```close()```再调用```join()```。

See also: `addr`, `close`, `stop`, `pending`, `Serve`

##### Server.pending

```
pending()
```

返回当前正在执行的处理函数数量，即正在处理的连接或请求数。

Returns (number): 正在执行的处理函数数量。

在随机端口启动Http服务，观察处理中的请求数，再优雅关闭。

```javascript
function main() {
    // 端口写 0 表示随机分配空闲端口，实际地址用 addr() 获取
    var server = threading.Serve("http://127.0.0.1:0", function (ctx) {
        Sleep(1000)
        ctx.write("done")
    })
    Log("listen on", server.addr())
    // 输出：listen on 127.0.0.1:<随机端口>

    // 在另一个线程里发起请求，主线程观察服务状态
    threading.Thread(function (addr) {
        Log("response:", HttpQuery("http://" + addr + "/"))
        // 输出：response: done（约1秒后）
    }, server.addr())
    Sleep(200)
    Log("pending:", server.pending())
    // 输出：pending: 1（有一个请求正在处理）

    server.close()                      // 不再接收新连接，正在处理的请求继续执行
    Log("idle:", server.join(5000))
    // 输出：idle: true（服务已关闭且请求都处理完了）
}
```

See also: `addr`, `close`, `stop`, `join`, `Serve`

### TA

平台内置的常用指标库，支持```JavaScript```、```Python```、```Rust```策略调用，三种语言的计算结果一致。

除```TA.Alligator()```外，返回的数组与输入等长、按位置一一对应。开头数据不足、尚无法计算的部分（预热期）在```JavaScript```、```Rust```中为```NaN```，在```Python```中为```None```，使用前请先判断。

需要最高价、最低价或成交量的指标（```TA.KDJ()```、```TA.ATR()```、```TA.OBV()```、```TA.Alligator()```、```TA.CMF()```）只接受K线数据。

#### TA.MACD

```
TA.MACD(inReal)
TA.MACD(inReal, optInFastPeriod, optInSlowPeriod, optInSignalPeriod)
```

计算**指数平滑异同移动平均线（MACD）指标**。

Parameters:

- `inReal` ({@struct/Record Record}数组 / 数值数组, required): K线数据。
- `optInFastPeriod` (number, optional): 快线周期。
- `optInSlowPeriod` (number, optional): 慢线周期。
- `optInSignalPeriod` (number, optional): 信号线周期。

Returns (array): 二维数组，其结构为：```[DIF, DEA, MACD]```。

用15分钟K线计算MACD(12,26,9)。

```javascript
function main() {
    var records = exchange.GetRecords(PERIOD_M15)
    if (!records) return
    var macd = TA.MACD(records, 12, 26, 9)
    Log("DIF:", macd[0], "DEA:", macd[1], "MACD:", macd[2])
    // 输出：DIF: [...] DEA: [...] MACD: [...]，三个数组各与K线等长
}
```

```python
def main():
    records = exchange.GetRecords(PERIOD_M15)
    if not records:
        return
    macd = TA.MACD(records, 12, 26, 9)
    Log("DIF:", macd[0], "DEA:", macd[1], "MACD:", macd[2])
    # 输出：DIF: [...] DEA: [...] MACD: [...]，三个数组各与K线等长
```

```rust
fn main() {
    let Ok(records) = exchange.GetRecords(None, PERIOD_M15, None) else { return };
    let macd = TA.MACD(&records, 12, 26, 9);
    Log!("DIF:", macd[0], "DEA:", macd[1], "MACD:", macd[2]);
    // 输出：DIF: [...] DEA: [...] MACD: [...]，三个数组各与K线等长
}
```

发明者量化的```TA```指标库对常用指标算法进行了优化，支持```JavaScript```、```Python```、```Rust```语言策略的调用，详见[开源TA库代码](https://www.fmz.com/bbs-topic/409)。

```TA.MACD()```函数的```optInFastPeriod```、```optInSlowPeriod```、```optInSignalPeriod```参数默认值分别为：```12```、```26```、```9```。

柱值```MACD``` = ```DIF``` - ```DEA```（不乘2）。EMA以前period根的简单平均作为初值，预热期为```NaN```（```Python```中为```None```）。

See also: `TA`, `TA.EMA`, `TA.MA`, `TA.KDJ`, `TA.RSI`, `talib.MACD`

#### TA.KDJ

```
TA.KDJ(inPriceHLC)
TA.KDJ(inPriceHLC, period, kPeriod, dPeriod)
```

计算**随机指标（KDJ）**。

Parameters:

- `inPriceHLC` ({@struct/Record Record}数组, required): K线数据（计算使用最高价、最低价与收盘价），只接受K线数据。
- `period` (number, optional): 计算周期 1。
- `kPeriod` (number, optional): 计算周期 2。
- `dPeriod` (number, optional): 计算周期 3。

Returns (array): 二维数组，其结构为：```[K, D, J]```。

用15分钟K线计算KDJ(9,3,3)。

```javascript
function main() {
    var records = exchange.GetRecords(PERIOD_M15)
    if (!records) return
    var kdj = TA.KDJ(records, 9, 3, 3)
    Log("k:", kdj[0], "d:", kdj[1], "j:", kdj[2])
    // 输出：k: [...] d: [...] j: [...]，三个数组各与K线等长
}
```

```python
def main():
    records = exchange.GetRecords(PERIOD_M15)
    if not records:
        return
    kdj = TA.KDJ(records, 9, 3, 3)
    Log("k:", kdj[0], "d:", kdj[1], "j:", kdj[2])
    # 输出：k: [...] d: [...] j: [...]，三个数组各与K线等长
```

```rust
fn main() {
    let Ok(records) = exchange.GetRecords(None, PERIOD_M15, None) else { return };
    let kdj = TA.KDJ(&records, 9, 3, 3);
    Log!("k:", kdj[0], "d:", kdj[1], "j:", kdj[2]);
    // 输出：k: [...] d: [...] j: [...]，三个数组各与K线等长
}
```

```TA.KDJ()```函数的```period```、```kPeriod```、```dPeriod```参数的默认值分别为：```9```、```3```、```3```。

See also: `TA`, `TA.RSI`, `TA.MACD`, `TA.Highest`, `TA.Lowest`, `talib.STOCH`

#### TA.RSI

```
TA.RSI(inReal)
TA.RSI(inReal, optInTimePeriod)
```

计算**相对强弱指标（RSI）**。

Parameters:

- `inReal` ({@struct/Record Record}数组 / 数值数组, required): K线数据。
- `optInTimePeriod` (number, optional): 计算周期。

Returns (array): 一维数组。

用30分钟K线计算14周期RSI。

```javascript
function main() {
    var records = exchange.GetRecords(PERIOD_M30)
    if (!records) return
    var rsi = TA.RSI(records, 14)
    Log(rsi)
    // 输出：与K线等长的数组，开头预热期为NaN
}
```

```python
def main():
    records = exchange.GetRecords(PERIOD_M30)
    if not records:
        return
    rsi = TA.RSI(records, 14)
    Log(rsi)
    # 输出：与K线等长的列表，开头预热期为None
```

```rust
fn main() {
    let Ok(records) = exchange.GetRecords(None, PERIOD_M30, None) else { return };
    let rsi = TA.RSI(&records, 14);
    Log!(rsi);
    // 输出：与K线等长的数组，开头预热期为NaN
}
```

```TA.RSI()```函数的```optInTimePeriod```参数的默认值为：```14```。

See also: `TA`, `TA.KDJ`, `TA.MACD`, `TA.SMA`, `talib.RSI`

#### TA.ATR

```
TA.ATR(inPriceHLC)
TA.ATR(inPriceHLC, optInTimePeriod)
```

计算**平均真实波幅指标（ATR）**。

Parameters:

- `inPriceHLC` ({@struct/Record Record}数组, required): K线数据。
- `optInTimePeriod` (number, optional): 计算周期。

Returns (array): 一维数组。

用30分钟K线计算14周期ATR。

```javascript
function main() {
    var records = exchange.GetRecords(PERIOD_M30)
    if (!records) return
    var atr = TA.ATR(records, 14)
    Log(atr)
    // 输出：与K线等长的数组，开头预热期为NaN
}
```

```python
def main():
    records = exchange.GetRecords(PERIOD_M30)
    if not records:
        return
    atr = TA.ATR(records, 14)
    Log(atr)
    # 输出：与K线等长的列表，开头预热期为None
```

```rust
fn main() {
    let Ok(records) = exchange.GetRecords(None, PERIOD_M30, None) else { return };
    let atr = TA.ATR(&records, 14);
    Log!(atr);
    // 输出：与K线等长的数组，开头预热期为NaN
}
```

```TA.ATR()```函数的```optInTimePeriod```参数默认值为：```14```。

See also: `TA`, `TA.BOLL`, `TA.Highest`, `TA.Lowest`, `talib.ATR`

#### TA.OBV

```
TA.OBV(inReal)
```

计算**能量潮指标（OBV）**。

Parameters:

- `inReal` ({@struct/Record Record}数组, required): K线数据（计算时使用K线数据中的收盘价与成交量）。

Returns (array): 一维数组。

用30分钟K线计算OBV。

```javascript
function main() {
    var records = exchange.GetRecords(PERIOD_M30)
    if (!records) return
    var obv = TA.OBV(records)
    Log(obv)
    // 输出：与K线等长的数组，开头预热期为NaN
}
```

```python
def main():
    records = exchange.GetRecords(PERIOD_M30)
    if not records:
        return
    obv = TA.OBV(records)
    Log(obv)
    # 输出：与K线等长的列表，开头预热期为None
```

```rust
fn main() {
    let Ok(records) = exchange.GetRecords(None, PERIOD_M30, None) else { return };
    let obv = TA.OBV(&records);
    Log!(obv);
    // 输出：与K线等长的数组，开头预热期为NaN
}
```

See also: `TA`, `TA.CMF`, `TA.MA`, `talib.OBV`

#### TA.MA

```
TA.MA(inReal)
TA.MA(inReal, optInTimePeriod)
```

计算**移动平均线指标（Moving Average）**。

Parameters:

- `inReal` ({@struct/Record Record}数组 / 数值数组, required): K线数据。
- `optInTimePeriod` (number, optional): 计算周期。

Returns (array): 一维数组。

用30分钟K线计算14周期均线。

```javascript
function main() {
    var records = exchange.GetRecords(PERIOD_M30)
    if (!records) return
    var ma = TA.MA(records, 14)
    Log(ma)
    // 输出：与K线等长的数组，开头预热期为NaN
}
```

```python
def main():
    records = exchange.GetRecords(PERIOD_M30)
    if not records:
        return
    ma = TA.MA(records, 14)
    Log(ma)
    # 输出：与K线等长的列表，开头预热期为None
```

```rust
fn main() {
    let Ok(records) = exchange.GetRecords(None, PERIOD_M30, None) else { return };
    let ma = TA.MA(&records, 14);
    Log!(ma);
    // 输出：与K线等长的数组，开头预热期为NaN
}
```

```TA.MA()```函数的```optInTimePeriod```参数的默认值为：```9```。

See also: `TA`, `TA.EMA`, `TA.SMA`, `TA.BOLL`, `TA.MACD`, `talib.MA`

#### TA.EMA

```
TA.EMA(inReal)
TA.EMA(inReal, optInTimePeriod)
```

计算**指数移动平均线（EMA）指标**。

Parameters:

- `inReal` ({@struct/Record Record}数组 / 数值数组, required): K线数据。
- `optInTimePeriod` (number, optional): 计算周期。

Returns (array): 一维数组。

K线数量足够时计算9周期EMA。

```javascript
function main() {
    var records = exchange.GetRecords()
    // 判断K线Bar数量是否满足指标计算所需的周期
    if (records && records.length > 9) {
        var ema = TA.EMA(records, 9)
        Log(ema)
        // 输出：与K线等长的数组，开头预热期为NaN
    }
}
```

```python
def main():
    records = exchange.GetRecords()
    if records and len(records) > 9:
        ema = TA.EMA(records, 9)
        Log(ema)
        # 输出：与K线等长的列表，开头预热期为None
```

```rust
fn main() {
    let Ok(records) = exchange.GetRecords(None, None, None) else { return };
    // 判断K线Bar数量是否满足指标计算所需的周期
    if records.len() > 9 {
        let ema = TA.EMA(&records, 9);
        Log!(ema);
        // 输出：与K线等长的数组，开头预热期为NaN
    }
}
```

```TA.EMA()```函数的```optInTimePeriod```参数的默认值为：```9```。

See also: `TA`, `TA.MA`, `TA.SMA`, `TA.MACD`, `talib.EMA`

#### TA.BOLL

```
TA.BOLL(inReal)
TA.BOLL(inReal, period, multiplier)
```

计算**布林带指标**。

Parameters:

- `inReal` ({@struct/Record Record}数组 / 数值数组, required): K线数据。
- `period` (number, optional): 计算周期。
- `multiplier` (number, optional): 乘数（标准差倍数）。

Returns (array): 二维数组，其结构为```[upLine, midLine, downLine]```。

K线数量足够时计算20周期、2倍标准差的布林带。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (records && records.length > 20) {
        var boll = TA.BOLL(records, 20, 2)
        var upLine = boll[0]
        var midLine = boll[1]
        var downLine = boll[2]
        Log(upLine)
        Log(midLine)
        Log(downLine)
        // 输出：上轨、中轨、下轨三个数组，各与K线等长
    }
}
```

```python
def main():
    records = exchange.GetRecords()
    if records and len(records) > 20:
        boll = TA.BOLL(records, 20, 2)
        upLine = boll[0]
        midLine = boll[1]
        downLine = boll[2]
        Log(upLine)
        Log(midLine)
        Log(downLine)
        # 输出：上轨、中轨、下轨三个数组，各与K线等长
```

```rust
fn main() {
    let Ok(records) = exchange.GetRecords(None, None, None) else { return };
    if records.len() > 20 {
        let boll = TA.BOLL(&records, 20, 2.0);
        let [upLine, midLine, downLine] = boll;
        Log!(upLine);
        Log!(midLine);
        Log!(downLine);
        // 输出：上轨、中轨、下轨三个数组，各与K线等长
    }
}
```

```TA.BOLL()```函数的```period```、```multiplier```参数的默认值分别为```20```和```2```。

See also: `TA`, `TA.MA`, `TA.ATR`, `TA.Highest`, `TA.Lowest`, `talib.BBANDS`

#### TA.Alligator

```
TA.Alligator(inPriceHL)
TA.Alligator(inPriceHL, jawLength, teethLength, lipsLength)
```

计算**鳄鱼线指标（Alligator）**。

Parameters:

- `inPriceHL` ({@struct/Record Record}数组, required): K线数据（计算使用最高价与最低价的中值），只接受K线数据。
- `jawLength` (number, optional): 下颚线（Jaw）的周期。
- `teethLength` (number, optional): 牙齿线（Teeth）的周期。
- `lipsLength` (number, optional): 上唇线（Lips）的周期。

Returns (array): 二维数组，其结构为：```[jawLine, teethLine, lipsLine]```。下颚线、牙齿线、上唇线分别向右平移8、5、3根Bar：数组开头依次补8、5、3个```NaN```（```Python```中为```None```），因此三个数组分别比输入长8、5、3。

用默认参数计算鳄鱼线的下颚线、牙齿线、上唇线。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var alligator = TA.Alligator(records)
    Log("jawLine:", alligator[0])
    Log("teethLine:", alligator[1])
    Log("lipsLine:", alligator[2])
    // 输出：三个数组分别比K线多8、5、3个元素（开头补NaN）
}
```

```python
def main():
    records = exchange.GetRecords()
    if not records:
        return
    alligator = TA.Alligator(records)
    Log("jawLine:", alligator[0])
    Log("teethLine:", alligator[1])
    Log("lipsLine:", alligator[2])
    # 输出：三个列表分别比K线多8、5、3个元素（开头补None）
```

```rust
fn main() {
    let Ok(records) = exchange.GetRecords(None, None, None) else { return };
    let alligator = TA.Alligator(&records, None, None, None);
    Log!("jawLine:", alligator[0]);
    Log!("teethLine:", alligator[1]);
    Log!("lipsLine:", alligator[2]);
    // 输出：三个数组分别比K线多8、5、3个元素（开头补NaN）
}
```

```TA.Alligator()```函数的```jawLength```、```teethLength```、```lipsLength```参数默认值分别为：```13```、```8```、```5```。

See also: `TA`, `TA.MA`, `TA.SMA`, `TA.EMA`

#### TA.CMF

```
TA.CMF(inReal)
TA.CMF(inReal, periods)
```

计算**蔡金资金流量指标（Chaikin Money Flow）**。

Parameters:

- `inReal` ({@struct/Record Record}数组, required): K线数据（计算时使用K线数据中的最高价、最低价、收盘价与成交量）。
- `periods` (number, optional): 计算周期，默认值为20。

Returns (array): 一维数组。

用默认周期计算CMF。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var cmf = TA.CMF(records)
    Log(cmf)
    // 输出：与K线等长的数组，开头预热期为NaN
}
```

```python
def main():
    records = exchange.GetRecords()
    if not records:
        return
    cmf = TA.CMF(records)
    Log(cmf)
    # 输出：与K线等长的列表，开头预热期为None
```

```rust
fn main() {
    let Ok(records) = exchange.GetRecords(None, None, None) else { return };
    let cmf = TA.CMF(&records, None);
    Log!(cmf);
    // 输出：与K线等长的数组，开头预热期为NaN
}
```

See also: `TA`, `TA.OBV`, `TA.ATR`, `talib.AD`

#### TA.Highest

```
TA.Highest(inReal, period)
TA.Highest(inReal, period, attr)
```

计算**周期内最高价**。

Parameters:

- `inReal` ({@struct/Record Record}数组 / 数值数组, required): K线数据或数值数组。
- `period` (number, required): 周期，必须传入；设为```0```表示计算所有```Bar```。
- `attr` (string, optional): 属性，可选值：```Open```、```Close```、```Low```、```High```、```Volume```、```OpenInterest```。不传时把```inReal```视为数值数组。

Returns (number): 最近指定周期内某个属性的最大值，不包含当前Bar。

计算最近10根K线（不含当前Bar）开盘价的最高值。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var highestForOpen = TA.Highest(records, 10, "Open")
    Log(highestForOpen)
    // 输出：一个数值，即这10根K线开盘价的最高值
}
```

```python
def main():
    records = exchange.GetRecords()
    if not records:
        return
    highestForOpen = TA.Highest(records, 10, "Open")
    Log(highestForOpen)
    # 输出：一个数值，即这10根K线开盘价的最高值
```

```rust
fn main() {
    let Ok(records) = exchange.GetRecords(None, None, None) else { return };
    // Rust 的 TA.Highest 无属性名参数，先提取开盘价数值序列再计算（不包含当前Bar）
    let opens: Vec<f64> = records.iter().map(|r| r.Open).collect();
    let highestForOpen = TA.Highest(&opens, 10);
    Log!(highestForOpen);
    // 输出：一个数值，即这10根K线开盘价的最高值
}
```

例如```TA.Highest(records, 30, "High")```返回当前Bar之前30根K线中```High```的最高值。```period```为```0```时计算```inReal```中当前Bar之前的所有```Bar```；不传```attr```时，把```inReal```视为普通数值数组。

```inReal```少于2个元素时返回```NaN```（```Python```中为```None```）。

```Rust```中```TA.Highest(src, n)```接受数值序列（传K线时取收盘价）；按字段计算请用```TA.HighestBy(&records, n, "High")```。

See also: `TA`, `TA.Lowest`, `TA.BOLL`, `TA.ATR`, `talib.MAX`

#### TA.Lowest

```
TA.Lowest(inReal, period)
TA.Lowest(inReal, period, attr)
```

计算**周期最低价**。

Parameters:

- `inReal` ({@struct/Record Record}数组 / 数值数组, required): K线数据或数值数组。
- `period` (number, required): 周期，必须传入；设为```0```表示计算所有```Bar```。
- `attr` (string, optional): 属性，可选值：```Open```、```Close```、```Low```、```High```、```Volume```、```OpenInterest```。不传时把```inReal```视为数值数组。

Returns (number): 最近一定周期内某个属性的最小值，不包含当前Bar。

计算最近10根K线（不含当前Bar）开盘价的最低值。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var lowestForOpen = TA.Lowest(records, 10, "Open")
    Log(lowestForOpen)
    // 输出：一个数值，即这10根K线开盘价的最低值
}
```

```python
def main():
    records = exchange.GetRecords()
    if not records:
        return
    lowestForOpen = TA.Lowest(records, 10, "Open")
    Log(lowestForOpen)
    # 输出：一个数值，即这10根K线开盘价的最低值
```

```rust
fn main() {
    let Ok(records) = exchange.GetRecords(None, None, None) else { return };
    // Rust 的 TA.Lowest 无属性名参数，先提取开盘价数值序列再计算（不包含当前Bar）
    let opens: Vec<f64> = records.iter().map(|r| r.Open).collect();
    let lowestForOpen = TA.Lowest(&opens, 10);
    Log!(lowestForOpen);
    // 输出：一个数值，即这10根K线开盘价的最低值
}
```

例如```TA.Lowest(records, 30, "Low")```返回当前Bar之前30根K线中```Low```的最低值。```period```为```0```时计算```inReal```中当前Bar之前的所有```Bar```；不传```attr```时，把```inReal```视为普通数值数组。

```inReal```少于2个元素时返回```NaN```（```Python```中为```None```）。

```Rust```中```TA.Lowest(src, n)```接受数值序列（传K线时取收盘价）；按字段计算请用```TA.LowestBy(&records, n, "Low")```。

See also: `TA`, `TA.Highest`, `TA.BOLL`, `TA.ATR`, `talib.MIN`

#### TA.SMA

```
TA.SMA(inReal)
TA.SMA(inReal, optInTimePeriod)
```

计算**简单移动平均线（SMA）指标**。

Parameters:

- `inReal` ({@struct/Record Record}数组 / 数值数组, required): K线数据。
- `optInTimePeriod` (number, optional): 计算周期。

Returns (array): 一维数组。

用30分钟K线计算14周期SMA。

```javascript
function main() {
    var records = exchange.GetRecords(PERIOD_M30)
    if (!records) return
    var sma = TA.SMA(records, 14)
    Log(sma)
    // 输出：与K线等长的数组，开头预热期为NaN
}
```

```python
def main():
    records = exchange.GetRecords(PERIOD_M30)
    if not records:
        return
    sma = TA.SMA(records, 14)
    Log(sma)
    # 输出：与K线等长的列表，开头预热期为None
```

```rust
fn main() {
    let Ok(records) = exchange.GetRecords(None, PERIOD_M30, None) else { return };
    let sma = TA.SMA(&records, 14);
    Log!(sma);
    // 输出：与K线等长的数组，开头预热期为NaN
}
```

```TA.SMA()```函数的```optInTimePeriod```参数默认值为：```9```。

```TA.SMA()```与```TA.MA()```相同，都是简单移动平均。

See also: `TA`, `TA.MA`, `TA.EMA`, `TA.RSI`, `talib.SMA`

### Talib

对接TA-Lib指标库，供`JavaScript`、`Python`策略调用（`Rust`不提供）。

`JavaScript`中可直接传入K线数组（自动取各函数需要的字段）或数值数组；多输出函数返回二维数组；开头不足计算所需根数的部分为`NaN`。

`Python`中的`talib`是托管者所在机器上安装的TA-Lib Python包（`pip install TA-Lib`，依赖`numpy`），未安装时调用会报错`Please install talib module for python`；需按函数要求传入`records.Close`等numpy数组，多输出函数返回由numpy数组组成的`tuple`。需要多个价格字段的函数（参数名为`inPriceHLC`、`inPriceOHLC`等）要按字段顺序分别传入，例如`talib.ATR(records.High, records.Low, records.Close)`。

#### 均线类型（MAType）

`optInMAType`、`optInFastMAType`等均线类型参数的取值如下，默认都是`0`（SMA）。

| 值 | 均线类型 |
| - | - |
| `0` | SMA（简单移动平均） |
| `1` | EMA（指数移动平均） |
| `2` | WMA（加权移动平均） |
| `3` | DEMA（双重指数移动平均） |
| `4` | TEMA（三重指数移动平均） |
| `5` | TRIMA（三角移动平均） |
| `6` | KAMA（考夫曼自适应移动平均） |
| `7` | MAMA（MESA自适应移动平均） |
| `8` | T3（T3三重指数移动平均） |

#### 均线与通道

与价格画在同一坐标上的指标（Overlap Studies，重叠研究），包括移动平均、布林带、抛物线SAR等。

##### talib.ACCBANDS

```
talib.ACCBANDS(inPriceHLC)
talib.ACCBANDS(inPriceHLC, optInTimePeriod)
```

计算加速带（Acceleration Bands），返回上轨、中轨、下轨。

Parameters:

- `inPriceHLC` ({@struct/Record Record}数组, required): K线数组，取最高价、最低价、收盘价；Python中依次传入`records.High`、`records.Low`、`records.Close`。
- `optInTimePeriod` (number, optional): 计算周期。默认 `20`。

Returns (array): 二维数组，依次为上轨、中轨、下轨数组（Python中为同样顺序的tuple）。

用最近的K线计算加速带。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var ret = talib.ACCBANDS(records)
    // 输出：[上轨数组, 中轨数组, 下轨数组]
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    if not records:
        return
    upper, middle, lower = talib.ACCBANDS(records.High, records.Low, records.Close)
    # 输出：(上轨数组, 中轨数组, 下轨数组)
    Log(upper, middle, lower)
```

对应TA-Lib：`ACCBANDS(Records[High,Low,Close],Time Period = 20) = [Array(outRealUpperBand),Array(outRealMiddleBand),Array(outRealLowerBand)]`。

上轨为`High * (1 + 4 * (High - Low) / (High + Low))`的简单移动平均，中轨为收盘价的简单移动平均，下轨为`Low * (1 - 4 * (High - Low) / (High + Low))`的简单移动平均，周期都是`optInTimePeriod`。

`Python`的TA-Lib从0.6版本（C库与Python包都要0.6及以上）开始提供此函数，旧版本调用会报属性不存在的错误。

See also: `talib.BBANDS`, `talib.SMA`, `talib.ATR`, `TA.BOLL`

##### talib.BBANDS

```
talib.BBANDS(inReal)
talib.BBANDS(inReal, optInTimePeriod)
talib.BBANDS(inReal, optInTimePeriod, optInNbDevUp)
talib.BBANDS(inReal, optInTimePeriod, optInNbDevUp, optInNbDevDn)
talib.BBANDS(inReal, optInTimePeriod, optInNbDevUp, optInNbDevDn, optInMAType)
```

计算布林带（Bollinger Bands），返回上轨、中轨、下轨。

Parameters:

- `inReal` ({@struct/Record Record}数组 / 数值数组, required): K线数组（取收盘价）或数值数组；Python中传入`records.Close`等数值数组。
- `optInTimePeriod` (number, optional): 计算周期。默认 `5`。
- `optInNbDevUp` (number, optional): 上轨的标准差倍数。默认 `2`。
- `optInNbDevDn` (number, optional): 下轨的标准差倍数。默认 `2`。
- `optInMAType` (number, optional): 均线类型，取值见`Talib`的MAType表。默认 `0`（SMA）。

Returns (array): 二维数组，依次为上轨、中轨、下轨数组（Python中为同样顺序的tuple）。

用最近的K线计算布林带。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var ret = talib.BBANDS(records)
    // 输出：[上轨数组, 中轨数组, 下轨数组]
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    if not records:
        return
    ret = talib.BBANDS(records.Close)
    # 输出：(上轨数组, 中轨数组, 下轨数组)
    Log(ret)
```

对应TA-Lib：`BBANDS(Records[Close],Time Period = 5,Deviations up = 2,Deviations down = 2,MA Type = 0) = [Array(outRealUpperBand),Array(outRealMiddleBand),Array(outRealLowerBand)]`。

See also: `talib.ACCBANDS`, `talib.SMA`, `talib.STDDEV`, `talib.MA`, `TA.BOLL`

##### talib.DEMA

```
talib.DEMA(inReal)
talib.DEMA(inReal, optInTimePeriod)
```

计算双重指数移动平均线（Double Exponential Moving Average）。

Parameters:

- `inReal` ({@struct/Record Record}数组 / 数值数组, required): K线数组（取收盘价）或数值数组；Python中传入`records.Close`等数值数组。
- `optInTimePeriod` (number, optional): 计算周期。默认 `30`。

Returns (数值数组): 与输入等长的指标值数组，开头数据不足的部分为`NaN`。

用最近的K线计算双重指数移动平均线。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var ret = talib.DEMA(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    if not records:
        return
    ret = talib.DEMA(records.Close)
    Log(ret)
```

对应TA-Lib：`DEMA(Records[Close],Time Period = 30) = Array(outReal)`。

See also: `talib.EMA`, `talib.TEMA`, `talib.T3`, `TA.EMA`

##### talib.EMA

```
talib.EMA(inReal)
talib.EMA(inReal, optInTimePeriod)
```

计算指数移动平均线（Exponential Moving Average）。

Parameters:

- `inReal` ({@struct/Record Record}数组 / 数值数组, required): K线数组（取收盘价）或数值数组；Python中传入`records.Close`等数值数组。
- `optInTimePeriod` (number, optional): 计算周期。默认 `30`。

Returns (数值数组): 与输入等长的指标值数组，开头数据不足的部分为`NaN`。

用最近的K线计算指数移动平均线。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var ret = talib.EMA(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    if not records:
        return
    ret = talib.EMA(records.Close)
    Log(ret)
```

对应TA-Lib：`EMA(Records[Close],Time Period = 30) = Array(outReal)`。

See also: `talib.SMA`, `talib.DEMA`, `talib.TEMA`, `talib.MA`, `TA.EMA`

##### talib.HT_TRENDLINE

```
talib.HT_TRENDLINE(inReal)
```

计算希尔伯特变换瞬时趋势线（Hilbert Transform - Instantaneous Trendline）。

Parameters:

- `inReal` ({@struct/Record Record}数组 / 数值数组, required): K线数组（取收盘价）或数值数组；Python中传入`records.Close`等数值数组。

Returns (数值数组): 与输入等长的指标值数组，开头数据不足的部分为`NaN`。

用最近的K线计算希尔伯特变换瞬时趋势线。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var ret = talib.HT_TRENDLINE(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    if not records:
        return
    ret = talib.HT_TRENDLINE(records.Close)
    Log(ret)
```

对应TA-Lib：`HT_TRENDLINE(Records[Close]) = Array(outReal)`。

See also: `talib.HT_DCPERIOD`, `talib.HT_TRENDMODE`, `talib.MAMA`, `talib.KAMA`

##### talib.KAMA

```
talib.KAMA(inReal)
talib.KAMA(inReal, optInTimePeriod)
```

计算考夫曼自适应移动平均线（Kaufman Adaptive Moving Average）。

Parameters:

- `inReal` ({@struct/Record Record}数组 / 数值数组, required): K线数组（取收盘价）或数值数组；Python中传入`records.Close`等数值数组。
- `optInTimePeriod` (number, optional): 计算周期。默认 `30`。

Returns (数值数组): 与输入等长的指标值数组，开头数据不足的部分为`NaN`。

用最近的K线计算考夫曼自适应移动平均线。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var ret = talib.KAMA(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    if not records:
        return
    ret = talib.KAMA(records.Close)
    Log(ret)
```

对应TA-Lib：`KAMA(Records[Close],Time Period = 30) = Array(outReal)`。

See also: `talib.MAMA`, `talib.EMA`, `talib.MA`, `TA.MA`

##### talib.MA

```
talib.MA(inReal)
talib.MA(inReal, optInTimePeriod)
talib.MA(inReal, optInTimePeriod, optInMAType)
```

计算移动平均线（Moving Average）。

Parameters:

- `inReal` ({@struct/Record Record}数组 / 数值数组, required): K线数组（取收盘价）或数值数组；Python中传入`records.Close`等数值数组。
- `optInTimePeriod` (number, optional): 计算周期。默认 `30`。
- `optInMAType` (number, optional): 均线类型，取值见`Talib`的MAType表。默认 `0`（SMA）。

Returns (数值数组): 与输入等长的指标值数组，开头数据不足的部分为`NaN`。

用最近的K线计算移动平均线。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var ret = talib.MA(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    if not records:
        return
    ret = talib.MA(records.Close)
    Log(ret)
```

对应TA-Lib：`MA(Records[Close],Time Period = 30,MA Type = 0) = Array(outReal)`。

See also: `talib.SMA`, `talib.EMA`, `talib.WMA`, `talib.MAVP`, `TA.MA`, `TA.EMA`

##### talib.MAMA

```
talib.MAMA(inReal)
talib.MAMA(inReal, optInFastLimit)
talib.MAMA(inReal, optInFastLimit, optInSlowLimit)
```

计算MESA自适应移动平均线（MESA Adaptive Moving Average），返回MAMA、FAMA。

Parameters:

- `inReal` ({@struct/Record Record}数组 / 数值数组, required): K线数组（取收盘价）或数值数组；Python中传入`records.Close`等数值数组。
- `optInFastLimit` (number, optional): 快速限制（Fast Limit）。默认 `0.5`。
- `optInSlowLimit` (number, optional): 慢速限制（Slow Limit）。默认 `0.05`。

Returns (array): 二维数组，依次为MAMA、FAMA数组（Python中为同样顺序的tuple）。

用最近的K线计算MESA自适应移动平均线。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var ret = talib.MAMA(records)
    // 输出：[MAMA数组, FAMA数组]
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    if not records:
        return
    ret = talib.MAMA(records.Close)
    # 输出：(MAMA数组, FAMA数组)
    Log(ret)
```

对应TA-Lib：`MAMA(Records[Close],Fast Limit = 0.5,Slow Limit = 0.05) = [Array(outMAMA),Array(outFAMA)]`。

See also: `talib.KAMA`, `talib.HT_TRENDLINE`, `talib.MA`

##### talib.MAVP

```
talib.MAVP(inReal, inPeriods)
talib.MAVP(inReal, inPeriods, optInMinPeriod)
talib.MAVP(inReal, inPeriods, optInMinPeriod, optInMaxPeriod)
talib.MAVP(inReal, inPeriods, optInMinPeriod, optInMaxPeriod, optInMAType)
```

计算可变周期移动平均线（Moving Average with Variable Period）。

Parameters:

- `inReal` (数值数组, required): 要计算均线的数据。
- `inPeriods` (数值数组, required): 每根K线使用的周期，长度必须与`inReal`相同；超出`[optInMinPeriod, optInMaxPeriod]`的值按边界计算。
- `optInMinPeriod` (number, optional): 最小周期。默认 `2`。
- `optInMaxPeriod` (number, optional): 最大周期。默认 `30`。
- `optInMAType` (number, optional): 均线类型，取值见`Talib`的MAType表。默认 `0`（SMA）。

Returns (数值数组): 与输入等长的指标值数组，开头数据不足的部分为`NaN`。

阳线用10、阴线用20作为周期，计算可变周期均线。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var closes = records.map(function(r) { return r.Close })
    // 每根K线的周期：阳线用10，阴线用20（仅作示例）
    var periods = records.map(function(r) { return r.Close > r.Open ? 10 : 20 })
    var ret = talib.MAVP(closes, periods, 10, 20)
    Log(ret)
}
```

```python
import talib
import numpy as np
def main():
    records = exchange.GetRecords()
    if not records:
        return
    # 每根K线的周期：阳线用10，阴线用20（仅作示例）
    periods = np.array([10.0 if r["Close"] > r["Open"] else 20.0 for r in records])
    ret = talib.MAVP(records.Close, periods, 10, 20)
    Log(ret)
```

对应TA-Lib：`MAVP(Array(inReal),Array(inPeriods),Min Period = 2,Max Period = 30,MA Type = 0) = Array(outReal)`。

第`i`个值是`inReal`截至第`i`个元素、周期为`inPeriods[i]`的移动平均；开头`optInMaxPeriod - 1`个值为`NaN`（与`inPeriods`的实际取值无关）。

两个输入都必须是数值数组：`JavaScript`中先用`map`从K线中取出字段，传入K线数组时两个输入都会取同一份K线的收盘价，结果没有意义；两个数组长度不同会报错。`Python`中两个输入都要是`float64`类型的numpy数组。

See also: `talib.MA`, `talib.SMA`, `talib.EMA`, `TA.MA`

##### talib.MIDPOINT

```
talib.MIDPOINT(inReal)
talib.MIDPOINT(inReal, optInTimePeriod)
```

计算周期中点（MidPoint over Period）。

Parameters:

- `inReal` ({@struct/Record Record}数组 / 数值数组, required): K线数组（取收盘价）或数值数组；Python中传入`records.Close`等数值数组。
- `optInTimePeriod` (number, optional): 计算周期。默认 `14`。

Returns (数值数组): 与输入等长的指标值数组，开头数据不足的部分为`NaN`。

用最近的K线计算周期中点。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var ret = talib.MIDPOINT(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    if not records:
        return
    ret = talib.MIDPOINT(records.Close)
    Log(ret)
```

对应TA-Lib：`MIDPOINT(Records[Close],Time Period = 14) = Array(outReal)`。

See also: `talib.MIDPRICE`, `talib.MAX`, `talib.MIN`

##### talib.MIDPRICE

```
talib.MIDPRICE(inPriceHL)
talib.MIDPRICE(inPriceHL, optInTimePeriod)
```

计算周期中点价格（Midpoint Price over Period）。

Parameters:

- `inPriceHL` ({@struct/Record Record}数组, required): K线数组，取最高价、最低价；Python中依次传入`records.High`、`records.Low`。
- `optInTimePeriod` (number, optional): 计算周期。默认 `14`。

Returns (数值数组): 与输入等长的指标值数组，开头数据不足的部分为`NaN`。

用最近的K线计算周期中点价格。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var ret = talib.MIDPRICE(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    if not records:
        return
    ret = talib.MIDPRICE(records.High, records.Low)
    Log(ret)
```

对应TA-Lib：`MIDPRICE(Records[High,Low],Time Period = 14) = Array(outReal)`。

See also: `talib.MIDPOINT`, `talib.MEDPRICE`, `talib.MAX`, `talib.MIN`, `TA.Highest`, `TA.Lowest`

##### talib.SAR

```
talib.SAR(inPriceHL)
talib.SAR(inPriceHL, optInAcceleration)
talib.SAR(inPriceHL, optInAcceleration, optInMaximum)
```

计算抛物线转向指标（Parabolic SAR）。

Parameters:

- `inPriceHL` ({@struct/Record Record}数组, required): K线数组，取最高价、最低价；Python中依次传入`records.High`、`records.Low`。
- `optInAcceleration` (number, optional): 加速因子（Acceleration Factor）。默认 `0.02`。
- `optInMaximum` (number, optional): 加速因子上限（AF Maximum）。默认 `0.2`。

Returns (数值数组): 与输入等长的指标值数组，开头数据不足的部分为`NaN`。

用最近的K线计算抛物线转向指标。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var ret = talib.SAR(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    if not records:
        return
    ret = talib.SAR(records.High, records.Low)
    Log(ret)
```

对应TA-Lib：`SAR(Records[High,Low],Acceleration Factor = 0.02,AF Maximum = 0.2) = Array(outReal)`。

See also: `talib.SAREXT`, `talib.ATR`, `talib.ADX`

##### talib.SAREXT

```
talib.SAREXT(inPriceHL)
talib.SAREXT(inPriceHL, optInStartValue)
talib.SAREXT(inPriceHL, optInStartValue, optInOffsetOnReverse)
talib.SAREXT(inPriceHL, optInStartValue, optInOffsetOnReverse, optInAccelerationInitLong)
talib.SAREXT(inPriceHL, optInStartValue, optInOffsetOnReverse, optInAccelerationInitLong, optInAccelerationLong)
talib.SAREXT(inPriceHL, optInStartValue, optInOffsetOnReverse, optInAccelerationInitLong, optInAccelerationLong, optInAccelerationMaxLong)
talib.SAREXT(inPriceHL, optInStartValue, optInOffsetOnReverse, optInAccelerationInitLong, optInAccelerationLong, optInAccelerationMaxLong, optInAccelerationInitShort)
talib.SAREXT(inPriceHL, optInStartValue, optInOffsetOnReverse, optInAccelerationInitLong, optInAccelerationLong, optInAccelerationMaxLong, optInAccelerationInitShort, optInAccelerationShort)
talib.SAREXT(inPriceHL, optInStartValue, optInOffsetOnReverse, optInAccelerationInitLong, optInAccelerationLong, optInAccelerationMaxLong, optInAccelerationInitShort, optInAccelerationShort, optInAccelerationMaxShort)
```

计算扩展抛物线转向指标（Parabolic SAR - Extended）。

Parameters:

- `inPriceHL` ({@struct/Record Record}数组, required): K线数组，取最高价、最低价；Python中依次传入`records.High`、`records.Low`。
- `optInStartValue` (number, optional): 起始值（Start Value）：`0`表示自动判断方向，正数按多头开始，负数按空头开始。默认 `0`。
- `optInOffsetOnReverse` (number, optional): 反转偏移（Offset on Reverse）。默认 `0`。
- `optInAccelerationInitLong` (number, optional): 多头初始加速因子（AF Init Long）。默认 `0.02`。
- `optInAccelerationLong` (number, optional): 多头加速因子（AF Long）。默认 `0.02`。
- `optInAccelerationMaxLong` (number, optional): 多头加速因子上限（AF Max Long）。默认 `0.2`。
- `optInAccelerationInitShort` (number, optional): 空头初始加速因子（AF Init Short）。默认 `0.02`。
- `optInAccelerationShort` (number, optional): 空头加速因子（AF Short）。默认 `0.02`。
- `optInAccelerationMaxShort` (number, optional): 空头加速因子上限（AF Max Short）。默认 `0.2`。

Returns (数值数组): 与输入等长的指标值数组，开头数据不足的部分为`NaN`。

用最近的K线计算扩展抛物线转向指标。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var ret = talib.SAREXT(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    if not records:
        return
    ret = talib.SAREXT(records.High, records.Low)
    Log(ret)
```

对应TA-Lib：`SAREXT(Records[High,Low],Start Value = 0,Offset on Reverse = 0,AF Init Long = 0.02,AF Long = 0.02,AF Max Long = 0.2,AF Init Short = 0.02,AF Short = 0.02,AF Max Short = 0.2) = Array(outReal)`。

See also: `talib.SAR`, `talib.ATR`, `talib.ADX`

##### talib.SMA

```
talib.SMA(inReal)
talib.SMA(inReal, optInTimePeriod)
```

计算简单移动平均线（Simple Moving Average）。

Parameters:

- `inReal` ({@struct/Record Record}数组 / 数值数组, required): K线数组（取收盘价）或数值数组；Python中传入`records.Close`等数值数组。
- `optInTimePeriod` (number, optional): 计算周期。默认 `30`。

Returns (数值数组): 与输入等长的指标值数组，开头数据不足的部分为`NaN`。

用最近的K线计算简单移动平均线。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var ret = talib.SMA(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    if not records:
        return
    ret = talib.SMA(records.Close)
    Log(ret)
```

对应TA-Lib：`SMA(Records[Close],Time Period = 30) = Array(outReal)`。

See also: `talib.EMA`, `talib.WMA`, `talib.TRIMA`, `talib.MA`, `TA.MA`, `TA.SMA`

##### talib.T3

```
talib.T3(inReal)
talib.T3(inReal, optInTimePeriod)
talib.T3(inReal, optInTimePeriod, optInVFactor)
```

计算T3三重指数移动平均线（Triple Exponential Moving Average (T3)）。

Parameters:

- `inReal` ({@struct/Record Record}数组 / 数值数组, required): K线数组（取收盘价）或数值数组；Python中传入`records.Close`等数值数组。
- `optInTimePeriod` (number, optional): 计算周期。默认 `5`。
- `optInVFactor` (number, optional): 平滑系数（Volume Factor），取值`0`~`1`。默认 `0.7`。

Returns (数值数组): 与输入等长的指标值数组，开头数据不足的部分为`NaN`。

用最近的K线计算T3三重指数移动平均线。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var ret = talib.T3(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    if not records:
        return
    ret = talib.T3(records.Close)
    Log(ret)
```

对应TA-Lib：`T3(Records[Close],Time Period = 5,Volume Factor = 0.7) = Array(outReal)`。

See also: `talib.TEMA`, `talib.DEMA`, `talib.EMA`, `TA.EMA`

##### talib.TEMA

```
talib.TEMA(inReal)
talib.TEMA(inReal, optInTimePeriod)
```

计算三重指数移动平均线（Triple Exponential Moving Average）。

Parameters:

- `inReal` ({@struct/Record Record}数组 / 数值数组, required): K线数组（取收盘价）或数值数组；Python中传入`records.Close`等数值数组。
- `optInTimePeriod` (number, optional): 计算周期。默认 `30`。

Returns (数值数组): 与输入等长的指标值数组，开头数据不足的部分为`NaN`。

用最近的K线计算三重指数移动平均线。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var ret = talib.TEMA(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    if not records:
        return
    ret = talib.TEMA(records.Close)
    Log(ret)
```

对应TA-Lib：`TEMA(Records[Close],Time Period = 30) = Array(outReal)`。

See also: `talib.DEMA`, `talib.T3`, `talib.EMA`, `talib.TRIX`, `TA.EMA`

##### talib.TRIMA

```
talib.TRIMA(inReal)
talib.TRIMA(inReal, optInTimePeriod)
```

计算三角移动平均线（Triangular Moving Average）。

Parameters:

- `inReal` ({@struct/Record Record}数组 / 数值数组, required): K线数组（取收盘价）或数值数组；Python中传入`records.Close`等数值数组。
- `optInTimePeriod` (number, optional): 计算周期。默认 `30`。

Returns (数值数组): 与输入等长的指标值数组，开头数据不足的部分为`NaN`。

用最近的K线计算三角移动平均线。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var ret = talib.TRIMA(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    if not records:
        return
    ret = talib.TRIMA(records.Close)
    Log(ret)
```

对应TA-Lib：`TRIMA(Records[Close],Time Period = 30) = Array(outReal)`。

See also: `talib.SMA`, `talib.WMA`, `talib.MA`, `TA.MA`

##### talib.WMA

```
talib.WMA(inReal)
talib.WMA(inReal, optInTimePeriod)
```

计算加权移动平均线（Weighted Moving Average）。

Parameters:

- `inReal` ({@struct/Record Record}数组 / 数值数组, required): K线数组（取收盘价）或数值数组；Python中传入`records.Close`等数值数组。
- `optInTimePeriod` (number, optional): 计算周期。默认 `30`。

Returns (数值数组): 与输入等长的指标值数组，开头数据不足的部分为`NaN`。

用最近的K线计算加权移动平均线。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var ret = talib.WMA(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    if not records:
        return
    ret = talib.WMA(records.Close)
    Log(ret)
```

对应TA-Lib：`WMA(Records[Close],Time Period = 30) = Array(outReal)`。

See also: `talib.SMA`, `talib.EMA`, `talib.TRIMA`, `talib.MA`, `TA.MA`

#### 动量指标

衡量价格变化的速度与强弱（Momentum Indicators），包括MACD、RSI、随机指标（STOCH）、ADX、CCI等。

##### talib.ADX

```
talib.ADX(inPriceHLC)
talib.ADX(inPriceHLC, optInTimePeriod)
```

计算平均趋向指数（Average Directional Movement Index）。

Parameters:

- `inPriceHLC` ({@struct/Record Record}数组, required): K线数组，取最高价、最低价、收盘价；Python中依次传入`records.High`、`records.Low`、`records.Close`。
- `optInTimePeriod` (number, optional): 计算周期。默认 `14`。

Returns (数值数组): 与输入等长的指标值数组，开头数据不足的部分为`NaN`。

用最近的K线计算平均趋向指数。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var ret = talib.ADX(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    if not records:
        return
    ret = talib.ADX(records.High, records.Low, records.Close)
    Log(ret)
```

对应TA-Lib：`ADX(Records[High,Low,Close],Time Period = 14) = Array(outReal)`。

See also: `talib.ADXR`, `talib.DX`, `talib.PLUS_DI`, `talib.MINUS_DI`

##### talib.ADXR

```
talib.ADXR(inPriceHLC)
talib.ADXR(inPriceHLC, optInTimePeriod)
```

计算平均趋向指数评估（Average Directional Movement Index Rating）。

Parameters:

- `inPriceHLC` ({@struct/Record Record}数组, required): K线数组，取最高价、最低价、收盘价；Python中依次传入`records.High`、`records.Low`、`records.Close`。
- `optInTimePeriod` (number, optional): 计算周期。默认 `14`。

Returns (数值数组): 与输入等长的指标值数组，开头数据不足的部分为`NaN`。

用最近的K线计算平均趋向指数评估。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var ret = talib.ADXR(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    if not records:
        return
    ret = talib.ADXR(records.High, records.Low, records.Close)
    Log(ret)
```

对应TA-Lib：`ADXR(Records[High,Low,Close],Time Period = 14) = Array(outReal)`。

See also: `talib.ADX`, `talib.DX`, `talib.PLUS_DI`, `talib.MINUS_DI`

##### talib.APO

```
talib.APO(inReal)
talib.APO(inReal, optInFastPeriod)
talib.APO(inReal, optInFastPeriod, optInSlowPeriod)
talib.APO(inReal, optInFastPeriod, optInSlowPeriod, optInMAType)
```

计算绝对价格振荡指标（Absolute Price Oscillator）。

Parameters:

- `inReal` ({@struct/Record Record}数组 / 数值数组, required): K线数组（取收盘价）或数值数组；Python中传入`records.Close`等数值数组。
- `optInFastPeriod` (number, optional): 快线周期。默认 `12`。
- `optInSlowPeriod` (number, optional): 慢线周期。默认 `26`。
- `optInMAType` (number, optional): 均线类型，取值见`Talib`的MAType表。默认 `0`（SMA）。

Returns (数值数组): 与输入等长的指标值数组，开头数据不足的部分为`NaN`。

用最近的K线计算绝对价格振荡指标。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var ret = talib.APO(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    if not records:
        return
    ret = talib.APO(records.Close)
    Log(ret)
```

对应TA-Lib：`APO(Records[Close],Fast Period = 12,Slow Period = 26,MA Type = 0) = Array(outReal)`。

See also: `talib.PPO`, `talib.MACD`, `talib.MOM`, `talib.EMA`, `TA.MACD`

##### talib.AROON

```
talib.AROON(inPriceHL)
talib.AROON(inPriceHL, optInTimePeriod)
```

计算阿隆指标（Aroon），返回阿隆下降线、阿隆上升线。

Parameters:

- `inPriceHL` ({@struct/Record Record}数组, required): K线数组，取最高价、最低价；Python中依次传入`records.High`、`records.Low`。
- `optInTimePeriod` (number, optional): 计算周期。默认 `14`。

Returns (array): 二维数组，依次为阿隆下降线、阿隆上升线数组（Python中为同样顺序的tuple）。

用最近的K线计算阿隆指标。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var ret = talib.AROON(records)
    // 输出：[阿隆下降线数组, 阿隆上升线数组]
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    if not records:
        return
    ret = talib.AROON(records.High, records.Low)
    # 输出：(阿隆下降线数组, 阿隆上升线数组)
    Log(ret)
```

对应TA-Lib：`AROON(Records[High,Low],Time Period = 14) = [Array(outAroonDown),Array(outAroonUp)]`。

See also: `talib.AROONOSC`, `talib.MAXINDEX`, `talib.MININDEX`, `TA.Highest`, `TA.Lowest`

##### talib.AROONOSC

```
talib.AROONOSC(inPriceHL)
talib.AROONOSC(inPriceHL, optInTimePeriod)
```

计算阿隆振荡指标（Aroon Oscillator）。

Parameters:

- `inPriceHL` ({@struct/Record Record}数组, required): K线数组，取最高价、最低价；Python中依次传入`records.High`、`records.Low`。
- `optInTimePeriod` (number, optional): 计算周期。默认 `14`。

Returns (数值数组): 与输入等长的指标值数组，开头数据不足的部分为`NaN`。

用最近的K线计算阿隆振荡指标。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var ret = talib.AROONOSC(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    if not records:
        return
    ret = talib.AROONOSC(records.High, records.Low)
    Log(ret)
```

对应TA-Lib：`AROONOSC(Records[High,Low],Time Period = 14) = Array(outReal)`。

See also: `talib.AROON`, `talib.ADX`, `talib.MOM`

##### talib.BOP

```
talib.BOP(inPriceOHLC)
```

计算均势指标（Balance Of Power）。

Parameters:

- `inPriceOHLC` ({@struct/Record Record}数组, required): K线数组，取开盘价、最高价、最低价、收盘价；Python中依次传入`records.Open`、`records.High`、`records.Low`、`records.Close`。

Returns (数值数组): 与输入等长的指标值数组，开头数据不足的部分为`NaN`。

用最近的K线计算均势指标。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var ret = talib.BOP(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    if not records:
        return
    ret = talib.BOP(records.Open, records.High, records.Low, records.Close)
    Log(ret)
```

对应TA-Lib：`BOP(Records[Open,High,Low,Close]) = Array(outReal)`。

See also: `talib.CCI`, `talib.WILLR`, `talib.AVGPRICE`

##### talib.CCI

```
talib.CCI(inPriceHLC)
talib.CCI(inPriceHLC, optInTimePeriod)
```

计算顺势指标（Commodity Channel Index）。

Parameters:

- `inPriceHLC` ({@struct/Record Record}数组, required): K线数组，取最高价、最低价、收盘价；Python中依次传入`records.High`、`records.Low`、`records.Close`。
- `optInTimePeriod` (number, optional): 计算周期。默认 `14`。

Returns (数值数组): 与输入等长的指标值数组，开头数据不足的部分为`NaN`。

用最近的K线计算顺势指标。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var ret = talib.CCI(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    if not records:
        return
    ret = talib.CCI(records.High, records.Low, records.Close)
    Log(ret)
```

对应TA-Lib：`CCI(Records[High,Low,Close],Time Period = 14) = Array(outReal)`。

See also: `talib.TYPPRICE`, `talib.WILLR`, `talib.RSI`, `talib.MFI`

##### talib.CMO

```
talib.CMO(inReal)
talib.CMO(inReal, optInTimePeriod)
```

计算钱德动量摆动指标（Chande Momentum Oscillator）。

Parameters:

- `inReal` ({@struct/Record Record}数组 / 数值数组, required): K线数组（取收盘价）或数值数组；Python中传入`records.Close`等数值数组。
- `optInTimePeriod` (number, optional): 计算周期。默认 `14`。

Returns (数值数组): 与输入等长的指标值数组，开头数据不足的部分为`NaN`。

用最近的K线计算钱德动量摆动指标。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var ret = talib.CMO(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    if not records:
        return
    ret = talib.CMO(records.Close)
    Log(ret)
```

对应TA-Lib：`CMO(Records[Close],Time Period = 14) = Array(outReal)`。

See also: `talib.RSI`, `talib.MOM`, `talib.STOCHRSI`, `TA.RSI`

##### talib.DX

```
talib.DX(inPriceHLC)
talib.DX(inPriceHLC, optInTimePeriod)
```

计算动向指数（Directional Movement Index）。

Parameters:

- `inPriceHLC` ({@struct/Record Record}数组, required): K线数组，取最高价、最低价、收盘价；Python中依次传入`records.High`、`records.Low`、`records.Close`。
- `optInTimePeriod` (number, optional): 计算周期。默认 `14`。

Returns (数值数组): 与输入等长的指标值数组，开头数据不足的部分为`NaN`。

用最近的K线计算动向指数。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var ret = talib.DX(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    if not records:
        return
    ret = talib.DX(records.High, records.Low, records.Close)
    Log(ret)
```

对应TA-Lib：`DX(Records[High,Low,Close],Time Period = 14) = Array(outReal)`。

See also: `talib.ADX`, `talib.ADXR`, `talib.PLUS_DI`, `talib.MINUS_DI`

##### talib.IMI

```
talib.IMI(inPriceOC)
talib.IMI(inPriceOC, optInTimePeriod)
```

计算日内动量指标（Intraday Momentum Index）。

Parameters:

- `inPriceOC` ({@struct/Record Record}数组, required): K线数组，取开盘价、收盘价；Python中依次传入`records.Open`、`records.Close`。
- `optInTimePeriod` (number, optional): 计算周期。默认 `14`。

Returns (数值数组): 与输入等长的指标值数组，开头数据不足的部分为`NaN`。

用最近的K线计算日内动量指标。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var ret = talib.IMI(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    if not records:
        return
    ret = talib.IMI(records.Open, records.Close)
    Log(ret)
```

对应TA-Lib：`IMI(Records[Open,Close],Time Period = 14) = Array(outReal)`。

最近`optInTimePeriod`根K线中，阳线实体（`Close - Open`）之和占全部实体长度之和的百分比，取值0~100。

`Python`的TA-Lib从0.6版本（C库与Python包都要0.6及以上）开始提供此函数，旧版本调用会报属性不存在的错误。

See also: `talib.RSI`, `talib.CMO`, `talib.MOM`, `TA.RSI`

##### talib.MACD

```
talib.MACD(inReal)
talib.MACD(inReal, optInFastPeriod)
talib.MACD(inReal, optInFastPeriod, optInSlowPeriod)
talib.MACD(inReal, optInFastPeriod, optInSlowPeriod, optInSignalPeriod)
```

计算指数平滑异同移动平均线（Moving Average Convergence/Divergence），返回MACD线、信号线、柱状线。

Parameters:

- `inReal` ({@struct/Record Record}数组 / 数值数组, required): K线数组（取收盘价）或数值数组；Python中传入`records.Close`等数值数组。
- `optInFastPeriod` (number, optional): 快线周期。默认 `12`。
- `optInSlowPeriod` (number, optional): 慢线周期。默认 `26`。
- `optInSignalPeriod` (number, optional): 信号线周期。默认 `9`。

Returns (array): 二维数组，依次为MACD线、信号线、柱状线数组（Python中为同样顺序的tuple）。

用最近的K线计算指数平滑异同移动平均线。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var ret = talib.MACD(records)
    // 输出：[MACD线数组, 信号线数组, 柱状线数组]
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    if not records:
        return
    ret = talib.MACD(records.Close)
    # 输出：(MACD线数组, 信号线数组, 柱状线数组)
    Log(ret)
```

对应TA-Lib：`MACD(Records[Close],Fast Period = 12,Slow Period = 26,Signal Period = 9) = [Array(outMACD),Array(outMACDSignal),Array(outMACDHist)]`。

See also: `talib.MACDEXT`, `talib.MACDFIX`, `talib.APO`, `talib.PPO`, `talib.EMA`, `TA.MACD`

##### talib.MACDEXT

```
talib.MACDEXT(inReal)
talib.MACDEXT(inReal, optInFastPeriod)
talib.MACDEXT(inReal, optInFastPeriod, optInFastMAType)
talib.MACDEXT(inReal, optInFastPeriod, optInFastMAType, optInSlowPeriod)
talib.MACDEXT(inReal, optInFastPeriod, optInFastMAType, optInSlowPeriod, optInSlowMAType)
talib.MACDEXT(inReal, optInFastPeriod, optInFastMAType, optInSlowPeriod, optInSlowMAType, optInSignalPeriod)
talib.MACDEXT(inReal, optInFastPeriod, optInFastMAType, optInSlowPeriod, optInSlowMAType, optInSignalPeriod, optInSignalMAType)
```

计算可指定均线类型的MACD（MACD with Controllable MA Type），返回MACD线、信号线、柱状线。

Parameters:

- `inReal` ({@struct/Record Record}数组 / 数值数组, required): K线数组（取收盘价）或数值数组；Python中传入`records.Close`等数值数组。
- `optInFastPeriod` (number, optional): 快线周期。默认 `12`。
- `optInFastMAType` (number, optional): 快线的均线类型，取值见`Talib`的MAType表。默认 `0`（SMA）。
- `optInSlowPeriod` (number, optional): 慢线周期。默认 `26`。
- `optInSlowMAType` (number, optional): 慢线的均线类型，取值见`Talib`的MAType表。默认 `0`（SMA）。
- `optInSignalPeriod` (number, optional): 信号线周期。默认 `9`。
- `optInSignalMAType` (number, optional): 信号线的均线类型，取值见`Talib`的MAType表。默认 `0`（SMA）。

Returns (array): 二维数组，依次为MACD线、信号线、柱状线数组（Python中为同样顺序的tuple）。

用最近的K线计算可指定均线类型的MACD。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var ret = talib.MACDEXT(records)
    // 输出：[MACD线数组, 信号线数组, 柱状线数组]
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    if not records:
        return
    ret = talib.MACDEXT(records.Close)
    # 输出：(MACD线数组, 信号线数组, 柱状线数组)
    Log(ret)
```

对应TA-Lib：`MACDEXT(Records[Close],Fast Period = 12,Fast MA = 0,Slow Period = 26,Slow MA = 0,Signal Period = 9,Signal MA = 0) = [Array(outMACD),Array(outMACDSignal),Array(outMACDHist)]`。

See also: `talib.MACD`, `talib.MACDFIX`, `TA.MACD`

##### talib.MACDFIX

```
talib.MACDFIX(inReal)
talib.MACDFIX(inReal, optInSignalPeriod)
```

计算快慢周期固定为12/26的MACD（Moving Average Convergence/Divergence Fix 12/26），返回MACD线、信号线、柱状线。

Parameters:

- `inReal` ({@struct/Record Record}数组 / 数值数组, required): K线数组（取收盘价）或数值数组；Python中传入`records.Close`等数值数组。
- `optInSignalPeriod` (number, optional): 信号线周期。默认 `9`。

Returns (array): 二维数组，依次为MACD线、信号线、柱状线数组（Python中为同样顺序的tuple）。

用最近的K线计算快慢周期固定为12/26的MACD。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var ret = talib.MACDFIX(records)
    // 输出：[MACD线数组, 信号线数组, 柱状线数组]
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    if not records:
        return
    ret = talib.MACDFIX(records.Close)
    # 输出：(MACD线数组, 信号线数组, 柱状线数组)
    Log(ret)
```

对应TA-Lib：`MACDFIX(Records[Close],Signal Period = 9) = [Array(outMACD),Array(outMACDSignal),Array(outMACDHist)]`。

See also: `talib.MACD`, `talib.MACDEXT`, `TA.MACD`

##### talib.MFI

```
talib.MFI(inPriceHLCV)
talib.MFI(inPriceHLCV, optInTimePeriod)
```

计算资金流量指标（Money Flow Index）。

Parameters:

- `inPriceHLCV` ({@struct/Record Record}数组, required): K线数组，取最高价、最低价、收盘价、成交量；Python中依次传入`records.High`、`records.Low`、`records.Close`、`records.Volume`。
- `optInTimePeriod` (number, optional): 计算周期。默认 `14`。

Returns (数值数组): 与输入等长的指标值数组，开头数据不足的部分为`NaN`。

用最近的K线计算资金流量指标。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var ret = talib.MFI(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    if not records:
        return
    ret = talib.MFI(records.High, records.Low, records.Close, records.Volume)
    Log(ret)
```

对应TA-Lib：`MFI(Records[High,Low,Close,Volume],Time Period = 14) = Array(outReal)`。

See also: `talib.RSI`, `talib.OBV`, `talib.AD`, `TA.CMF`

##### talib.MINUS_DI

```
talib.MINUS_DI(inPriceHLC)
talib.MINUS_DI(inPriceHLC, optInTimePeriod)
```

计算下降方向线（Minus Directional Indicator）。

Parameters:

- `inPriceHLC` ({@struct/Record Record}数组, required): K线数组，取最高价、最低价、收盘价；Python中依次传入`records.High`、`records.Low`、`records.Close`。
- `optInTimePeriod` (number, optional): 计算周期。默认 `14`。

Returns (数值数组): 与输入等长的指标值数组，开头数据不足的部分为`NaN`。

用最近的K线计算下降方向线。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var ret = talib.MINUS_DI(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    if not records:
        return
    ret = talib.MINUS_DI(records.High, records.Low, records.Close)
    Log(ret)
```

对应TA-Lib：`MINUS_DI(Records[High,Low,Close],Time Period = 14) = Array(outReal)`。

See also: `talib.PLUS_DI`, `talib.MINUS_DM`, `talib.DX`, `talib.ADX`

##### talib.MINUS_DM

```
talib.MINUS_DM(inPriceHL)
talib.MINUS_DM(inPriceHL, optInTimePeriod)
```

计算下降动向值（Minus Directional Movement）。

Parameters:

- `inPriceHL` ({@struct/Record Record}数组, required): K线数组，取最高价、最低价；Python中依次传入`records.High`、`records.Low`。
- `optInTimePeriod` (number, optional): 计算周期。默认 `14`。

Returns (数值数组): 与输入等长的指标值数组，开头数据不足的部分为`NaN`。

用最近的K线计算下降动向值。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var ret = talib.MINUS_DM(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    if not records:
        return
    ret = talib.MINUS_DM(records.High, records.Low)
    Log(ret)
```

对应TA-Lib：`MINUS_DM(Records[High,Low],Time Period = 14) = Array(outReal)`。

See also: `talib.PLUS_DM`, `talib.MINUS_DI`, `talib.DX`

##### talib.MOM

```
talib.MOM(inReal)
talib.MOM(inReal, optInTimePeriod)
```

计算动量（Momentum）。

Parameters:

- `inReal` ({@struct/Record Record}数组 / 数值数组, required): K线数组（取收盘价）或数值数组；Python中传入`records.Close`等数值数组。
- `optInTimePeriod` (number, optional): 计算周期。默认 `10`。

Returns (数值数组): 与输入等长的指标值数组，开头数据不足的部分为`NaN`。

用最近的K线计算动量。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var ret = talib.MOM(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    if not records:
        return
    ret = talib.MOM(records.Close)
    Log(ret)
```

对应TA-Lib：`MOM(Records[Close],Time Period = 10) = Array(outReal)`。

See also: `talib.ROC`, `talib.ROCP`, `talib.ROCR`, `talib.CMO`

##### talib.PLUS_DI

```
talib.PLUS_DI(inPriceHLC)
talib.PLUS_DI(inPriceHLC, optInTimePeriod)
```

计算上升方向线（Plus Directional Indicator）。

Parameters:

- `inPriceHLC` ({@struct/Record Record}数组, required): K线数组，取最高价、最低价、收盘价；Python中依次传入`records.High`、`records.Low`、`records.Close`。
- `optInTimePeriod` (number, optional): 计算周期。默认 `14`。

Returns (数值数组): 与输入等长的指标值数组，开头数据不足的部分为`NaN`。

用最近的K线计算上升方向线。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var ret = talib.PLUS_DI(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    if not records:
        return
    ret = talib.PLUS_DI(records.High, records.Low, records.Close)
    Log(ret)
```

对应TA-Lib：`PLUS_DI(Records[High,Low,Close],Time Period = 14) = Array(outReal)`。

See also: `talib.MINUS_DI`, `talib.PLUS_DM`, `talib.DX`, `talib.ADX`

##### talib.PLUS_DM

```
talib.PLUS_DM(inPriceHL)
talib.PLUS_DM(inPriceHL, optInTimePeriod)
```

计算上升动向值（Plus Directional Movement）。

Parameters:

- `inPriceHL` ({@struct/Record Record}数组, required): K线数组，取最高价、最低价；Python中依次传入`records.High`、`records.Low`。
- `optInTimePeriod` (number, optional): 计算周期。默认 `14`。

Returns (数值数组): 与输入等长的指标值数组，开头数据不足的部分为`NaN`。

用最近的K线计算上升动向值。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var ret = talib.PLUS_DM(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    if not records:
        return
    ret = talib.PLUS_DM(records.High, records.Low)
    Log(ret)
```

对应TA-Lib：`PLUS_DM(Records[High,Low],Time Period = 14) = Array(outReal)`。

See also: `talib.MINUS_DM`, `talib.PLUS_DI`, `talib.DX`

##### talib.PPO

```
talib.PPO(inReal)
talib.PPO(inReal, optInFastPeriod)
talib.PPO(inReal, optInFastPeriod, optInSlowPeriod)
talib.PPO(inReal, optInFastPeriod, optInSlowPeriod, optInMAType)
```

计算价格振荡百分比（Percentage Price Oscillator）。

Parameters:

- `inReal` ({@struct/Record Record}数组 / 数值数组, required): K线数组（取收盘价）或数值数组；Python中传入`records.Close`等数值数组。
- `optInFastPeriod` (number, optional): 快线周期。默认 `12`。
- `optInSlowPeriod` (number, optional): 慢线周期。默认 `26`。
- `optInMAType` (number, optional): 均线类型，取值见`Talib`的MAType表。默认 `0`（SMA）。

Returns (数值数组): 与输入等长的指标值数组，开头数据不足的部分为`NaN`。

用最近的K线计算价格振荡百分比。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var ret = talib.PPO(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    if not records:
        return
    ret = talib.PPO(records.Close)
    Log(ret)
```

对应TA-Lib：`PPO(Records[Close],Fast Period = 12,Slow Period = 26,MA Type = 0) = Array(outReal)`。

See also: `talib.APO`, `talib.MACD`, `talib.ROC`, `TA.MACD`

##### talib.ROC

```
talib.ROC(inReal)
talib.ROC(inReal, optInTimePeriod)
```

计算变动率（Rate of Change），公式为`((price/prevPrice)-1)*100`。

Parameters:

- `inReal` ({@struct/Record Record}数组 / 数值数组, required): K线数组（取收盘价）或数值数组；Python中传入`records.Close`等数值数组。
- `optInTimePeriod` (number, optional): 计算周期。默认 `10`。

Returns (数值数组): 与输入等长的指标值数组，开头数据不足的部分为`NaN`。

用最近的K线计算变动率。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var ret = talib.ROC(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    if not records:
        return
    ret = talib.ROC(records.Close)
    Log(ret)
```

对应TA-Lib：`ROC(Records[Close],Time Period = 10) = Array(outReal)`。

See also: `talib.ROCP`, `talib.ROCR`, `talib.ROCR100`, `talib.MOM`

##### talib.ROCP

```
talib.ROCP(inReal)
talib.ROCP(inReal, optInTimePeriod)
```

计算变动率百分比（Rate of Change Percentage），公式为`(price-prevPrice)/prevPrice`。

Parameters:

- `inReal` ({@struct/Record Record}数组 / 数值数组, required): K线数组（取收盘价）或数值数组；Python中传入`records.Close`等数值数组。
- `optInTimePeriod` (number, optional): 计算周期。默认 `10`。

Returns (数值数组): 与输入等长的指标值数组，开头数据不足的部分为`NaN`。

用最近的K线计算变动率百分比。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var ret = talib.ROCP(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    if not records:
        return
    ret = talib.ROCP(records.Close)
    Log(ret)
```

对应TA-Lib：`ROCP(Records[Close],Time Period = 10) = Array(outReal)`。

See also: `talib.ROC`, `talib.ROCR`, `talib.ROCR100`, `talib.MOM`

##### talib.ROCR

```
talib.ROCR(inReal)
talib.ROCR(inReal, optInTimePeriod)
```

计算变动率比值（Rate of Change Ratio），公式为`price/prevPrice`。

Parameters:

- `inReal` ({@struct/Record Record}数组 / 数值数组, required): K线数组（取收盘价）或数值数组；Python中传入`records.Close`等数值数组。
- `optInTimePeriod` (number, optional): 计算周期。默认 `10`。

Returns (数值数组): 与输入等长的指标值数组，开头数据不足的部分为`NaN`。

用最近的K线计算变动率比值。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var ret = talib.ROCR(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    if not records:
        return
    ret = talib.ROCR(records.Close)
    Log(ret)
```

对应TA-Lib：`ROCR(Records[Close],Time Period = 10) = Array(outReal)`。

See also: `talib.ROC`, `talib.ROCP`, `talib.ROCR100`, `talib.MOM`

##### talib.ROCR100

```
talib.ROCR100(inReal)
talib.ROCR100(inReal, optInTimePeriod)
```

计算百倍变动率比值（Rate of Change Ratio 100 Scale），公式为`(price/prevPrice)*100`。

Parameters:

- `inReal` ({@struct/Record Record}数组 / 数值数组, required): K线数组（取收盘价）或数值数组；Python中传入`records.Close`等数值数组。
- `optInTimePeriod` (number, optional): 计算周期。默认 `10`。

Returns (数值数组): 与输入等长的指标值数组，开头数据不足的部分为`NaN`。

用最近的K线计算百倍变动率比值。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var ret = talib.ROCR100(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    if not records:
        return
    ret = talib.ROCR100(records.Close)
    Log(ret)
```

对应TA-Lib：`ROCR100(Records[Close],Time Period = 10) = Array(outReal)`。

See also: `talib.ROC`, `talib.ROCP`, `talib.ROCR`, `talib.MOM`

##### talib.RSI

```
talib.RSI(inReal)
talib.RSI(inReal, optInTimePeriod)
```

计算相对强弱指标（Relative Strength Index）。

Parameters:

- `inReal` ({@struct/Record Record}数组 / 数值数组, required): K线数组（取收盘价）或数值数组；Python中传入`records.Close`等数值数组。
- `optInTimePeriod` (number, optional): 计算周期。默认 `14`。

Returns (数值数组): 与输入等长的指标值数组，开头数据不足的部分为`NaN`。

用最近的K线计算相对强弱指标。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var ret = talib.RSI(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    if not records:
        return
    ret = talib.RSI(records.Close)
    Log(ret)
```

对应TA-Lib：`RSI(Records[Close],Time Period = 14) = Array(outReal)`。

See also: `talib.STOCHRSI`, `talib.CMO`, `talib.MFI`, `talib.WILLR`, `TA.RSI`

##### talib.STOCH

```
talib.STOCH(inPriceHLC)
talib.STOCH(inPriceHLC, optInFastK_Period)
talib.STOCH(inPriceHLC, optInFastK_Period, optInSlowK_Period)
talib.STOCH(inPriceHLC, optInFastK_Period, optInSlowK_Period, optInSlowK_MAType)
talib.STOCH(inPriceHLC, optInFastK_Period, optInSlowK_Period, optInSlowK_MAType, optInSlowD_Period)
talib.STOCH(inPriceHLC, optInFastK_Period, optInSlowK_Period, optInSlowK_MAType, optInSlowD_Period, optInSlowD_MAType)
```

计算随机指标（Stochastic），返回慢速K、慢速D。

Parameters:

- `inPriceHLC` ({@struct/Record Record}数组, required): K线数组，取最高价、最低价、收盘价；Python中依次传入`records.High`、`records.Low`、`records.Close`。
- `optInFastK_Period` (number, optional): 快速K周期。默认 `5`。
- `optInSlowK_Period` (number, optional): 慢速K周期。默认 `3`。
- `optInSlowK_MAType` (number, optional): 慢速K的均线类型，取值见`Talib`的MAType表。默认 `0`（SMA）。
- `optInSlowD_Period` (number, optional): 慢速D周期。默认 `3`。
- `optInSlowD_MAType` (number, optional): 慢速D的均线类型，取值见`Talib`的MAType表。默认 `0`（SMA）。

Returns (array): 二维数组，依次为慢速K、慢速D数组（Python中为同样顺序的tuple）。

用最近的K线计算随机指标。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var ret = talib.STOCH(records)
    // 输出：[慢速K数组, 慢速D数组]
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    if not records:
        return
    ret = talib.STOCH(records.High, records.Low, records.Close)
    # 输出：(慢速K数组, 慢速D数组)
    Log(ret)
```

对应TA-Lib：`STOCH(Records[High,Low,Close],Fast-K Period = 5,Slow-K Period = 3,Slow-K MA = 0,Slow-D Period = 3,Slow-D MA = 0) = [Array(outSlowK),Array(outSlowD)]`。

See also: `talib.STOCHF`, `talib.STOCHRSI`, `talib.WILLR`, `TA.KDJ`

##### talib.STOCHF

```
talib.STOCHF(inPriceHLC)
talib.STOCHF(inPriceHLC, optInFastK_Period)
talib.STOCHF(inPriceHLC, optInFastK_Period, optInFastD_Period)
talib.STOCHF(inPriceHLC, optInFastK_Period, optInFastD_Period, optInFastD_MAType)
```

计算快速随机指标（Stochastic Fast），返回快速K、快速D。

Parameters:

- `inPriceHLC` ({@struct/Record Record}数组, required): K线数组，取最高价、最低价、收盘价；Python中依次传入`records.High`、`records.Low`、`records.Close`。
- `optInFastK_Period` (number, optional): 快速K周期。默认 `5`。
- `optInFastD_Period` (number, optional): 快速D周期。默认 `3`。
- `optInFastD_MAType` (number, optional): 快速D的均线类型，取值见`Talib`的MAType表。默认 `0`（SMA）。

Returns (array): 二维数组，依次为快速K、快速D数组（Python中为同样顺序的tuple）。

用最近的K线计算快速随机指标。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var ret = talib.STOCHF(records)
    // 输出：[快速K数组, 快速D数组]
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    if not records:
        return
    ret = talib.STOCHF(records.High, records.Low, records.Close)
    # 输出：(快速K数组, 快速D数组)
    Log(ret)
```

对应TA-Lib：`STOCHF(Records[High,Low,Close],Fast-K Period = 5,Fast-D Period = 3,Fast-D MA = 0) = [Array(outFastK),Array(outFastD)]`。

See also: `talib.STOCH`, `talib.STOCHRSI`, `talib.WILLR`, `TA.KDJ`

##### talib.STOCHRSI

```
talib.STOCHRSI(inReal)
talib.STOCHRSI(inReal, optInTimePeriod)
talib.STOCHRSI(inReal, optInTimePeriod, optInFastK_Period)
talib.STOCHRSI(inReal, optInTimePeriod, optInFastK_Period, optInFastD_Period)
talib.STOCHRSI(inReal, optInTimePeriod, optInFastK_Period, optInFastD_Period, optInFastD_MAType)
```

计算随机相对强弱指标（Stochastic Relative Strength Index），返回快速K、快速D。

Parameters:

- `inReal` ({@struct/Record Record}数组 / 数值数组, required): K线数组（取收盘价）或数值数组；Python中传入`records.Close`等数值数组。
- `optInTimePeriod` (number, optional): 计算周期。默认 `14`。
- `optInFastK_Period` (number, optional): 快速K周期。默认 `5`。
- `optInFastD_Period` (number, optional): 快速D周期。默认 `3`。
- `optInFastD_MAType` (number, optional): 快速D的均线类型，取值见`Talib`的MAType表。默认 `0`（SMA）。

Returns (array): 二维数组，依次为快速K、快速D数组（Python中为同样顺序的tuple）。

用最近的K线计算随机相对强弱指标。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var ret = talib.STOCHRSI(records)
    // 输出：[快速K数组, 快速D数组]
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    if not records:
        return
    ret = talib.STOCHRSI(records.Close)
    # 输出：(快速K数组, 快速D数组)
    Log(ret)
```

对应TA-Lib：`STOCHRSI(Records[Close],Time Period = 14,Fast-K Period = 5,Fast-D Period = 3,Fast-D MA = 0) = [Array(outFastK),Array(outFastD)]`。

See also: `talib.RSI`, `talib.STOCH`, `talib.STOCHF`, `TA.RSI`, `TA.KDJ`

##### talib.TRIX

```
talib.TRIX(inReal)
talib.TRIX(inReal, optInTimePeriod)
```

计算三重指数平滑平均线变动率（1-day Rate-Of-Change (ROC) of a Triple Smooth EMA）。

Parameters:

- `inReal` ({@struct/Record Record}数组 / 数值数组, required): K线数组（取收盘价）或数值数组；Python中传入`records.Close`等数值数组。
- `optInTimePeriod` (number, optional): 计算周期。默认 `30`。

Returns (数值数组): 与输入等长的指标值数组，开头数据不足的部分为`NaN`。

用最近的K线计算三重指数平滑平均线变动率。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var ret = talib.TRIX(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    if not records:
        return
    ret = talib.TRIX(records.Close)
    Log(ret)
```

对应TA-Lib：`TRIX(Records[Close],Time Period = 30) = Array(outReal)`。

See also: `talib.TEMA`, `talib.EMA`, `talib.ROC`

##### talib.ULTOSC

```
talib.ULTOSC(inPriceHLC)
talib.ULTOSC(inPriceHLC, optInTimePeriod1)
talib.ULTOSC(inPriceHLC, optInTimePeriod1, optInTimePeriod2)
talib.ULTOSC(inPriceHLC, optInTimePeriod1, optInTimePeriod2, optInTimePeriod3)
```

计算终极振荡指标（Ultimate Oscillator）。

Parameters:

- `inPriceHLC` ({@struct/Record Record}数组, required): K线数组，取最高价、最低价、收盘价；Python中依次传入`records.High`、`records.Low`、`records.Close`。
- `optInTimePeriod1` (number, optional): 第一周期。默认 `7`。
- `optInTimePeriod2` (number, optional): 第二周期。默认 `14`。
- `optInTimePeriod3` (number, optional): 第三周期。默认 `28`。

Returns (数值数组): 与输入等长的指标值数组，开头数据不足的部分为`NaN`。

用最近的K线计算终极振荡指标。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var ret = talib.ULTOSC(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    if not records:
        return
    ret = talib.ULTOSC(records.High, records.Low, records.Close)
    Log(ret)
```

对应TA-Lib：`ULTOSC(Records[High,Low,Close],First Period = 7,Second Period = 14,Third Period = 28) = Array(outReal)`。

See also: `talib.STOCH`, `talib.WILLR`, `talib.RSI`

##### talib.WILLR

```
talib.WILLR(inPriceHLC)
talib.WILLR(inPriceHLC, optInTimePeriod)
```

计算威廉指标（Williams' %R）。

Parameters:

- `inPriceHLC` ({@struct/Record Record}数组, required): K线数组，取最高价、最低价、收盘价；Python中依次传入`records.High`、`records.Low`、`records.Close`。
- `optInTimePeriod` (number, optional): 计算周期。默认 `14`。

Returns (数值数组): 与输入等长的指标值数组，开头数据不足的部分为`NaN`。

用最近的K线计算威廉指标。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var ret = talib.WILLR(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    if not records:
        return
    ret = talib.WILLR(records.High, records.Low, records.Close)
    Log(ret)
```

对应TA-Lib：`WILLR(Records[High,Low,Close],Time Period = 14) = Array(outReal)`。

See also: `talib.STOCH`, `talib.STOCHF`, `talib.CCI`, `talib.RSI`, `TA.KDJ`

#### 成交量指标

结合价格与成交量判断资金流向（Volume Indicators），包括AD、ADOSC、OBV。

##### talib.AD

```
talib.AD(inPriceHLCV)
```

计算蔡金累积/派发线（Chaikin A/D Line）。

Parameters:

- `inPriceHLCV` ({@struct/Record Record}数组, required): K线数组，取最高价、最低价、收盘价、成交量；Python中依次传入`records.High`、`records.Low`、`records.Close`、`records.Volume`。

Returns (数值数组): 与输入等长的指标值数组，开头数据不足的部分为`NaN`。

用最近的K线计算蔡金累积/派发线。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var ret = talib.AD(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    if not records:
        return
    ret = talib.AD(records.High, records.Low, records.Close, records.Volume)
    Log(ret)
```

对应TA-Lib：`AD(Records[High,Low,Close,Volume]) = Array(outReal)`。

See also: `talib.ADOSC`, `talib.OBV`, `talib.MFI`, `TA.CMF`

##### talib.ADOSC

```
talib.ADOSC(inPriceHLCV)
talib.ADOSC(inPriceHLCV, optInFastPeriod)
talib.ADOSC(inPriceHLCV, optInFastPeriod, optInSlowPeriod)
```

计算佳庆指标（Chaikin A/D Oscillator）。

Parameters:

- `inPriceHLCV` ({@struct/Record Record}数组, required): K线数组，取最高价、最低价、收盘价、成交量；Python中依次传入`records.High`、`records.Low`、`records.Close`、`records.Volume`。
- `optInFastPeriod` (number, optional): 快线周期。默认 `3`。
- `optInSlowPeriod` (number, optional): 慢线周期。默认 `10`。

Returns (数值数组): 与输入等长的指标值数组，开头数据不足的部分为`NaN`。

用最近的K线计算快线3、慢线10的佳庆指标。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var ret = talib.ADOSC(records, 3, 10)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    if not records:
        return
    ret = talib.ADOSC(records.High, records.Low, records.Close, records.Volume, 3, 10)
    Log(ret)
```

对应TA-Lib：`ADOSC(Records[High,Low,Close,Volume],Fast Period = 3,Slow Period = 10) = Array(outReal)`。

See also: `talib.AD`, `talib.OBV`, `talib.MFI`, `TA.CMF`

##### talib.OBV

```
talib.OBV(inReal)
talib.OBV(inReal, inPriceV)
```

计算能量潮（On Balance Volume）。

Parameters:

- `inReal` ({@struct/Record Record}数组 / 数值数组, required): K线数据（取收盘价与成交量）或收盘价数值数组。
- `inPriceV` ({@struct/Record Record}数组 / 数值数组, optional): 成交量：`inReal`为K线数据时无需传入；`inReal`为收盘价数组时必须传入（传K线数据则取其成交量，或传成交量数值数组）。

Returns (数值数组): 与输入等长的指标值数组，开头数据不足的部分为`NaN`。

用最近的K线计算能量潮。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var ret = talib.OBV(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    if not records:
        return
    ret = talib.OBV(records.Close, records.Volume)
    Log(ret)
```

对应TA-Lib：`OBV(Records[Close],Records[Volume]) = Array(outReal)`。

See also: `talib.AD`, `talib.ADOSC`, `talib.MFI`, `TA.OBV`

#### 波动率指标

衡量价格的波动幅度（Volatility Indicators），包括ATR、NATR、TRANGE。

##### talib.ATR

```
talib.ATR(inPriceHLC)
talib.ATR(inPriceHLC, optInTimePeriod)
```

计算平均真实波幅（Average True Range）。

Parameters:

- `inPriceHLC` ({@struct/Record Record}数组, required): K线数组，取最高价、最低价、收盘价；Python中依次传入`records.High`、`records.Low`、`records.Close`。
- `optInTimePeriod` (number, optional): 计算周期。默认 `14`。

Returns (数值数组): 与输入等长的指标值数组，开头数据不足的部分为`NaN`。

用最近的K线计算平均真实波幅。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var ret = talib.ATR(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    if not records:
        return
    ret = talib.ATR(records.High, records.Low, records.Close)
    Log(ret)
```

对应TA-Lib：`ATR(Records[High,Low,Close],Time Period = 14) = Array(outReal)`。

See also: `talib.NATR`, `talib.TRANGE`, `talib.STDDEV`, `TA.ATR`

##### talib.NATR

```
talib.NATR(inPriceHLC)
talib.NATR(inPriceHLC, optInTimePeriod)
```

计算归一化平均真实波幅（Normalized Average True Range）。

Parameters:

- `inPriceHLC` ({@struct/Record Record}数组, required): K线数组，取最高价、最低价、收盘价；Python中依次传入`records.High`、`records.Low`、`records.Close`。
- `optInTimePeriod` (number, optional): 计算周期。默认 `14`。

Returns (数值数组): 与输入等长的指标值数组，开头数据不足的部分为`NaN`。

用最近的K线计算归一化平均真实波幅。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var ret = talib.NATR(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    if not records:
        return
    ret = talib.NATR(records.High, records.Low, records.Close)
    Log(ret)
```

对应TA-Lib：`NATR(Records[High,Low,Close],Time Period = 14) = Array(outReal)`。

See also: `talib.ATR`, `talib.TRANGE`, `TA.ATR`

##### talib.TRANGE

```
talib.TRANGE(inPriceHLC)
```

计算真实波幅（True Range）。

Parameters:

- `inPriceHLC` ({@struct/Record Record}数组, required): K线数组，取最高价、最低价、收盘价；Python中依次传入`records.High`、`records.Low`、`records.Close`。

Returns (数值数组): 与输入等长的指标值数组，开头数据不足的部分为`NaN`。

用最近的K线计算真实波幅。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var ret = talib.TRANGE(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    if not records:
        return
    ret = talib.TRANGE(records.High, records.Low, records.Close)
    Log(ret)
```

对应TA-Lib：`TRANGE(Records[High,Low,Close]) = Array(outReal)`。

See also: `talib.ATR`, `talib.NATR`, `TA.ATR`

#### 周期指标

用希尔伯特变换估计价格的主导周期、相位和趋势模式（Cycle Indicators）。

##### talib.HT_DCPERIOD

```
talib.HT_DCPERIOD(inReal)
```

计算希尔伯特变换主导周期（Hilbert Transform - Dominant Cycle Period）。

Parameters:

- `inReal` ({@struct/Record Record}数组 / 数值数组, required): K线数组（取收盘价）或数值数组；Python中传入`records.Close`等数值数组。

Returns (数值数组): 与输入等长的指标值数组，开头数据不足的部分为`NaN`。

用最近的K线计算希尔伯特变换主导周期。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var ret = talib.HT_DCPERIOD(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    if not records:
        return
    ret = talib.HT_DCPERIOD(records.Close)
    Log(ret)
```

对应TA-Lib：`HT_DCPERIOD(Records[Close]) = Array(outReal)`。

See also: `talib.HT_DCPHASE`, `talib.HT_PHASOR`, `talib.HT_SINE`, `talib.HT_TRENDMODE`, `talib.HT_TRENDLINE`

##### talib.HT_DCPHASE

```
talib.HT_DCPHASE(inReal)
```

计算希尔伯特变换主导周期相位（Hilbert Transform - Dominant Cycle Phase）。

Parameters:

- `inReal` ({@struct/Record Record}数组 / 数值数组, required): K线数组（取收盘价）或数值数组；Python中传入`records.Close`等数值数组。

Returns (数值数组): 与输入等长的指标值数组，开头数据不足的部分为`NaN`。

用最近的K线计算希尔伯特变换主导周期相位。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var ret = talib.HT_DCPHASE(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    if not records:
        return
    ret = talib.HT_DCPHASE(records.Close)
    Log(ret)
```

对应TA-Lib：`HT_DCPHASE(Records[Close]) = Array(outReal)`。

See also: `talib.HT_DCPERIOD`, `talib.HT_PHASOR`, `talib.HT_SINE`, `talib.HT_TRENDMODE`

##### talib.HT_PHASOR

```
talib.HT_PHASOR(inReal)
```

计算希尔伯特变换相量分量（Hilbert Transform - Phasor Components），返回同相分量、正交分量。

Parameters:

- `inReal` ({@struct/Record Record}数组 / 数值数组, required): K线数组（取收盘价）或数值数组；Python中传入`records.Close`等数值数组。

Returns (array): 二维数组，依次为同相分量、正交分量数组（Python中为同样顺序的tuple）。

用最近的K线计算希尔伯特变换相量分量。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var ret = talib.HT_PHASOR(records)
    // 输出：[同相分量数组, 正交分量数组]
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    if not records:
        return
    ret = talib.HT_PHASOR(records.Close)
    # 输出：(同相分量数组, 正交分量数组)
    Log(ret)
```

对应TA-Lib：`HT_PHASOR(Records[Close]) = [Array(outInPhase),Array(outQuadrature)]`。

See also: `talib.HT_DCPHASE`, `talib.HT_SINE`, `talib.HT_DCPERIOD`

##### talib.HT_SINE

```
talib.HT_SINE(inReal)
```

计算希尔伯特变换正弦波（Hilbert Transform - SineWave），返回正弦线、超前正弦线。

Parameters:

- `inReal` ({@struct/Record Record}数组 / 数值数组, required): K线数组（取收盘价）或数值数组；Python中传入`records.Close`等数值数组。

Returns (array): 二维数组，依次为正弦线、超前正弦线数组（Python中为同样顺序的tuple）。

用最近的K线计算希尔伯特变换正弦波。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var ret = talib.HT_SINE(records)
    // 输出：[正弦线数组, 超前正弦线数组]
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    if not records:
        return
    ret = talib.HT_SINE(records.Close)
    # 输出：(正弦线数组, 超前正弦线数组)
    Log(ret)
```

对应TA-Lib：`HT_SINE(Records[Close]) = [Array(outSine),Array(outLeadSine)]`。

See also: `talib.HT_DCPHASE`, `talib.HT_PHASOR`, `talib.HT_TRENDMODE`

##### talib.HT_TRENDMODE

```
talib.HT_TRENDMODE(inReal)
```

计算希尔伯特变换趋势与周期模式（Hilbert Transform - Trend vs Cycle Mode）。

Parameters:

- `inReal` ({@struct/Record Record}数组 / 数值数组, required): K线数组（取收盘价）或数值数组；Python中传入`records.Close`等数值数组。

Returns (数值数组): 趋势模式数组：`1`表示趋势模式，`0`表示周期模式。

用最近的K线计算希尔伯特变换趋势与周期模式。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var ret = talib.HT_TRENDMODE(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    if not records:
        return
    ret = talib.HT_TRENDMODE(records.Close)
    Log(ret)
```

对应TA-Lib：`HT_TRENDMODE(Records[Close]) = Array(outInteger)`。

See also: `talib.HT_TRENDLINE`, `talib.HT_DCPERIOD`, `talib.HT_SINE`

#### 价格变换

把每根K线的开高低收合成一个价格（Price Transform），包括平均价、中间价、典型价、加权收盘价，另含平均绝对偏差（AVGDEV）。

##### talib.AVGDEV

```
talib.AVGDEV(inReal)
talib.AVGDEV(inReal, optInTimePeriod)
```

计算平均绝对偏差（Average Deviation）。

Parameters:

- `inReal` ({@struct/Record Record}数组 / 数值数组, required): K线数组（取收盘价）或数值数组；Python中传入`records.Close`等数值数组。
- `optInTimePeriod` (number, optional): 计算周期。默认 `14`。

Returns (数值数组): 与输入等长的指标值数组，开头数据不足的部分为`NaN`。

用最近的K线计算平均绝对偏差。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var ret = talib.AVGDEV(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    if not records:
        return
    ret = talib.AVGDEV(records.Close)
    Log(ret)
```

对应TA-Lib：`AVGDEV(Records[Close],Time Period = 14) = Array(outReal)`。

每个值是最近`optInTimePeriod`个数据与它们的平均值之差的绝对值的平均。

`Python`的TA-Lib从0.6版本（C库与Python包都要0.6及以上）开始提供此函数，旧版本调用会报属性不存在的错误。

See also: `talib.STDDEV`, `talib.VAR`, `talib.CCI`

##### talib.AVGPRICE

```
talib.AVGPRICE(inPriceOHLC)
```

计算平均价格（Average Price）。

Parameters:

- `inPriceOHLC` ({@struct/Record Record}数组, required): K线数组，取开盘价、最高价、最低价、收盘价；Python中依次传入`records.Open`、`records.High`、`records.Low`、`records.Close`。

Returns (数值数组): 与输入等长的指标值数组，开头数据不足的部分为`NaN`。

用最近的K线计算平均价格。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var ret = talib.AVGPRICE(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    if not records:
        return
    ret = talib.AVGPRICE(records.Open, records.High, records.Low, records.Close)
    Log(ret)
```

对应TA-Lib：`AVGPRICE(Records[Open,High,Low,Close]) = Array(outReal)`。

See also: `talib.MEDPRICE`, `talib.TYPPRICE`, `talib.WCLPRICE`

##### talib.MEDPRICE

```
talib.MEDPRICE(inPriceHL)
```

计算中间价（Median Price）。

Parameters:

- `inPriceHL` ({@struct/Record Record}数组, required): K线数组，取最高价、最低价；Python中依次传入`records.High`、`records.Low`。

Returns (数值数组): 与输入等长的指标值数组，开头数据不足的部分为`NaN`。

用最近的K线计算中间价。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var ret = talib.MEDPRICE(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    if not records:
        return
    ret = talib.MEDPRICE(records.High, records.Low)
    Log(ret)
```

对应TA-Lib：`MEDPRICE(Records[High,Low]) = Array(outReal)`。

See also: `talib.AVGPRICE`, `talib.TYPPRICE`, `talib.WCLPRICE`, `talib.MIDPRICE`, `TA.Alligator`

##### talib.TYPPRICE

```
talib.TYPPRICE(inPriceHLC)
```

计算典型价格（Typical Price）。

Parameters:

- `inPriceHLC` ({@struct/Record Record}数组, required): K线数组，取最高价、最低价、收盘价；Python中依次传入`records.High`、`records.Low`、`records.Close`。

Returns (数值数组): 与输入等长的指标值数组，开头数据不足的部分为`NaN`。

用最近的K线计算典型价格。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var ret = talib.TYPPRICE(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    if not records:
        return
    ret = talib.TYPPRICE(records.High, records.Low, records.Close)
    Log(ret)
```

对应TA-Lib：`TYPPRICE(Records[High,Low,Close]) = Array(outReal)`。

See also: `talib.AVGPRICE`, `talib.MEDPRICE`, `talib.WCLPRICE`, `talib.CCI`

##### talib.WCLPRICE

```
talib.WCLPRICE(inPriceHLC)
```

计算加权收盘价（Weighted Close Price）。

Parameters:

- `inPriceHLC` ({@struct/Record Record}数组, required): K线数组，取最高价、最低价、收盘价；Python中依次传入`records.High`、`records.Low`、`records.Close`。

Returns (数值数组): 与输入等长的指标值数组，开头数据不足的部分为`NaN`。

用最近的K线计算加权收盘价。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var ret = talib.WCLPRICE(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    if not records:
        return
    ret = talib.WCLPRICE(records.High, records.Low, records.Close)
    Log(ret)
```

对应TA-Lib：`WCLPRICE(Records[High,Low,Close]) = Array(outReal)`。

See also: `talib.AVGPRICE`, `talib.MEDPRICE`, `talib.TYPPRICE`

#### 统计函数

在滑动窗口上做统计计算（Statistic Functions），包括贝塔系数、皮尔逊相关系数、线性回归、标准差、方差、时间序列预测。

##### talib.BETA

```
talib.BETA(inReal0, inReal1)
talib.BETA(inReal0, inReal1, optInTimePeriod)
```

计算贝塔系数（Beta）。

Parameters:

- `inReal0` (数值数组, required): 第一组价格数据（作为基准）。
- `inReal1` (数值数组, required): 第二组价格数据，长度必须与`inReal0`相同。
- `optInTimePeriod` (number, optional): 计算周期。默认 `5`。

Returns (数值数组): 与输入等长的指标值数组，开头数据不足的部分为`NaN`。

计算第二个交易所对象的品种相对第一个（基准）的贝塔系数。

```javascript
function main() {
    // exchanges[0] 为基准，exchanges[1] 为要计算贝塔系数的品种
    var r0 = exchanges[0].GetRecords()
    var r1 = exchanges[1].GetRecords()
    if (!r0 || !r1) return
    var n = Math.min(r0.length, r1.length)
    var c0 = r0.slice(-n).map(function(r) { return r.Close })
    var c1 = r1.slice(-n).map(function(r) { return r.Close })
    var ret = talib.BETA(c0, c1, 5)
    Log(ret)
}
```

```python
import talib
def main():
    # exchanges[0] 为基准，exchanges[1] 为要计算贝塔系数的品种
    r0 = exchanges[0].GetRecords()
    r1 = exchanges[1].GetRecords()
    if not r0 or not r1:
        return
    n = min(len(r0), len(r1))
    ret = talib.BETA(r0.Close[-n:], r1.Close[-n:], 5)
    Log(ret)
```

对应TA-Lib：`BETA(Array(inReal0),Array(inReal1),Time Period = 5) = Array(outReal)`。

以`inReal0`逐根的涨跌幅为自变量、`inReal1`逐根的涨跌幅为因变量，在最近`optInTimePeriod`个涨跌幅上做线性回归，返回斜率。计算某个品种相对基准的贝塔系数时，`inReal0`传基准价格，`inReal1`传该品种价格。

`JavaScript`中两个输入都要传数值数组（可先用`map`从K线中取出字段）：传入K线数组时两个输入都会取同一份K线的收盘价，结果没有意义；两个数组长度不同会报错。

See also: `talib.CORREL`, `talib.LINEARREG_SLOPE`, `talib.VAR`

##### talib.CORREL

```
talib.CORREL(inReal0, inReal1)
talib.CORREL(inReal0, inReal1, optInTimePeriod)
```

计算皮尔逊相关系数（Pearson's Correlation Coefficient (r)）。

Parameters:

- `inReal0` (数值数组, required): 第一组数据。
- `inReal1` (数值数组, required): 第二组数据，长度必须与`inReal0`相同。
- `optInTimePeriod` (number, optional): 计算周期。默认 `30`。

Returns (数值数组): 与输入等长的指标值数组，开头数据不足的部分为`NaN`。

计算收盘价与成交量在30根K线上的相关系数。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var closes = records.map(function(r) { return r.Close })
    var volumes = records.map(function(r) { return r.Volume })
    var ret = talib.CORREL(closes, volumes, 30)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    if not records:
        return
    ret = talib.CORREL(records.Close, records.Volume, 30)
    Log(ret)
```

对应TA-Lib：`CORREL(Array(inReal0),Array(inReal1),Time Period = 30) = Array(outReal)`。

返回两组数据在最近`optInTimePeriod`根上的皮尔逊相关系数，取值范围[-1, 1]。

`JavaScript`中两个输入都要传数值数组（可先用`map`从K线中取出字段）：传入K线数组时两个输入都会取同一份K线的收盘价，结果没有意义；两个数组长度不同会报错。

See also: `talib.BETA`, `talib.LINEARREG`, `talib.STDDEV`

##### talib.LINEARREG

```
talib.LINEARREG(inReal)
talib.LINEARREG(inReal, optInTimePeriod)
```

计算线性回归（Linear Regression）。

Parameters:

- `inReal` ({@struct/Record Record}数组 / 数值数组, required): K线数组（取收盘价）或数值数组；Python中传入`records.Close`等数值数组。
- `optInTimePeriod` (number, optional): 计算周期。默认 `14`。

Returns (数值数组): 与输入等长的指标值数组，开头数据不足的部分为`NaN`。

用最近的K线计算线性回归。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var ret = talib.LINEARREG(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    if not records:
        return
    ret = talib.LINEARREG(records.Close)
    Log(ret)
```

对应TA-Lib：`LINEARREG(Records[Close],Time Period = 14) = Array(outReal)`。

See also: `talib.LINEARREG_SLOPE`, `talib.LINEARREG_INTERCEPT`, `talib.LINEARREG_ANGLE`, `talib.TSF`

##### talib.LINEARREG_ANGLE

```
talib.LINEARREG_ANGLE(inReal)
talib.LINEARREG_ANGLE(inReal, optInTimePeriod)
```

计算线性回归角度（Linear Regression Angle）。

Parameters:

- `inReal` ({@struct/Record Record}数组 / 数值数组, required): K线数组（取收盘价）或数值数组；Python中传入`records.Close`等数值数组。
- `optInTimePeriod` (number, optional): 计算周期。默认 `14`。

Returns (数值数组): 与输入等长的指标值数组，开头数据不足的部分为`NaN`。

用最近的K线计算线性回归角度。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var ret = talib.LINEARREG_ANGLE(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    if not records:
        return
    ret = talib.LINEARREG_ANGLE(records.Close)
    Log(ret)
```

对应TA-Lib：`LINEARREG_ANGLE(Records[Close],Time Period = 14) = Array(outReal)`。

See also: `talib.LINEARREG_SLOPE`, `talib.LINEARREG`, `talib.LINEARREG_INTERCEPT`

##### talib.LINEARREG_INTERCEPT

```
talib.LINEARREG_INTERCEPT(inReal)
talib.LINEARREG_INTERCEPT(inReal, optInTimePeriod)
```

计算线性回归截距（Linear Regression Intercept）。

Parameters:

- `inReal` ({@struct/Record Record}数组 / 数值数组, required): K线数组（取收盘价）或数值数组；Python中传入`records.Close`等数值数组。
- `optInTimePeriod` (number, optional): 计算周期。默认 `14`。

Returns (数值数组): 与输入等长的指标值数组，开头数据不足的部分为`NaN`。

用最近的K线计算线性回归截距。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var ret = talib.LINEARREG_INTERCEPT(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    if not records:
        return
    ret = talib.LINEARREG_INTERCEPT(records.Close)
    Log(ret)
```

对应TA-Lib：`LINEARREG_INTERCEPT(Records[Close],Time Period = 14) = Array(outReal)`。

See also: `talib.LINEARREG`, `talib.LINEARREG_SLOPE`, `talib.TSF`

##### talib.LINEARREG_SLOPE

```
talib.LINEARREG_SLOPE(inReal)
talib.LINEARREG_SLOPE(inReal, optInTimePeriod)
```

计算线性回归斜率（Linear Regression Slope）。

Parameters:

- `inReal` ({@struct/Record Record}数组 / 数值数组, required): K线数组（取收盘价）或数值数组；Python中传入`records.Close`等数值数组。
- `optInTimePeriod` (number, optional): 计算周期。默认 `14`。

Returns (数值数组): 与输入等长的指标值数组，开头数据不足的部分为`NaN`。

用最近的K线计算线性回归斜率。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var ret = talib.LINEARREG_SLOPE(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    if not records:
        return
    ret = talib.LINEARREG_SLOPE(records.Close)
    Log(ret)
```

对应TA-Lib：`LINEARREG_SLOPE(Records[Close],Time Period = 14) = Array(outReal)`。

See also: `talib.LINEARREG`, `talib.LINEARREG_ANGLE`, `talib.LINEARREG_INTERCEPT`

##### talib.STDDEV

```
talib.STDDEV(inReal)
talib.STDDEV(inReal, optInTimePeriod)
talib.STDDEV(inReal, optInTimePeriod, optInNbDev)
```

计算标准差（Standard Deviation）。

Parameters:

- `inReal` ({@struct/Record Record}数组 / 数值数组, required): K线数组（取收盘价）或数值数组；Python中传入`records.Close`等数值数组。
- `optInTimePeriod` (number, optional): 计算周期。默认 `5`。
- `optInNbDev` (number, optional): 标准差倍数（Deviations）。默认 `1`。

Returns (数值数组): 与输入等长的指标值数组，开头数据不足的部分为`NaN`。

用最近的K线计算标准差。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var ret = talib.STDDEV(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    if not records:
        return
    ret = talib.STDDEV(records.Close)
    Log(ret)
```

对应TA-Lib：`STDDEV(Records[Close],Time Period = 5,Deviations = 1) = Array(outReal)`。

See also: `talib.VAR`, `talib.AVGDEV`, `talib.BBANDS`

##### talib.TSF

```
talib.TSF(inReal)
talib.TSF(inReal, optInTimePeriod)
```

计算时间序列预测（Time Series Forecast）。

Parameters:

- `inReal` ({@struct/Record Record}数组 / 数值数组, required): K线数组（取收盘价）或数值数组；Python中传入`records.Close`等数值数组。
- `optInTimePeriod` (number, optional): 计算周期。默认 `14`。

Returns (数值数组): 与输入等长的指标值数组，开头数据不足的部分为`NaN`。

用最近的K线计算时间序列预测。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var ret = talib.TSF(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    if not records:
        return
    ret = talib.TSF(records.Close)
    Log(ret)
```

对应TA-Lib：`TSF(Records[Close],Time Period = 14) = Array(outReal)`。

See also: `talib.LINEARREG`, `talib.LINEARREG_SLOPE`, `talib.LINEARREG_INTERCEPT`

##### talib.VAR

```
talib.VAR(inReal)
talib.VAR(inReal, optInTimePeriod)
talib.VAR(inReal, optInTimePeriod, optInNbDev)
```

计算方差（Variance）。

Parameters:

- `inReal` ({@struct/Record Record}数组 / 数值数组, required): K线数组（取收盘价）或数值数组；Python中传入`records.Close`等数值数组。
- `optInTimePeriod` (number, optional): 计算周期。默认 `5`。
- `optInNbDev` (number, optional): 标准差倍数（Deviations）。默认 `1`。

Returns (数值数组): 与输入等长的指标值数组，开头数据不足的部分为`NaN`。

用最近的K线计算方差。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var ret = talib.VAR(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    if not records:
        return
    ret = talib.VAR(records.Close)
    Log(ret)
```

对应TA-Lib：`VAR(Records[Close],Time Period = 5,Deviations = 1) = Array(outReal)`。

See also: `talib.STDDEV`, `talib.AVGDEV`, `talib.BETA`

#### 数学变换

对数组逐个元素做数学运算（Math Transform），包括三角函数、指数、对数、取整、开方。

##### talib.ACOS

```
talib.ACOS(inReal)
```

逐个元素计算反余弦（Vector Trigonometric ACos）。

Parameters:

- `inReal` ({@struct/Record Record}数组 / 数值数组, required): K线数组（取收盘价）或数值数组；Python中传入`records.Close`等数值数组。

Returns (数值数组): 与输入等长的结果数组。

对一组数值计算反余弦。

```javascript
function main() {
    var data = [-1, 0, 1]
    var ret = talib.ACOS(data)
    // 输出：约 [3.1416, 1.5708, 0]
    Log(ret)
}
```

```python
import talib
import numpy as np
def main():
    data = [-1.0, 0, 1.0]
    ret = talib.ACOS(np.array(data))
    # 输出：约 [3.1416, 1.5708, 0]
    Log(ret)
```

对应TA-Lib：`ACOS(Records[Close]) = Array(outReal)`。

See also: `talib.ASIN`, `talib.ATAN`, `talib.COS`

##### talib.ASIN

```
talib.ASIN(inReal)
```

逐个元素计算反正弦（Vector Trigonometric ASin）。

Parameters:

- `inReal` ({@struct/Record Record}数组 / 数值数组, required): K线数组（取收盘价）或数值数组；Python中传入`records.Close`等数值数组。

Returns (数值数组): 与输入等长的结果数组。

对一组数值计算反正弦。

```javascript
function main() {
    var data = [-1, 0, 1]
    var ret = talib.ASIN(data)
    // 输出：约 [-1.5708, 0, 1.5708]
    Log(ret)
}
```

```python
import talib
import numpy as np
def main():
    data = [-1.0, 0, 1.0]
    ret = talib.ASIN(np.array(data))
    # 输出：约 [-1.5708, 0, 1.5708]
    Log(ret)
```

对应TA-Lib：`ASIN(Records[Close]) = Array(outReal)`。

See also: `talib.ACOS`, `talib.ATAN`, `talib.SIN`

##### talib.ATAN

```
talib.ATAN(inReal)
```

逐个元素计算反正切（Vector Trigonometric ATan）。

Parameters:

- `inReal` ({@struct/Record Record}数组 / 数值数组, required): K线数组（取收盘价）或数值数组；Python中传入`records.Close`等数值数组。

Returns (数值数组): 与输入等长的结果数组。

对一组数值计算反正切。

```javascript
function main() {
    var data = [-3.14/2, 0, 3.14/2]
    var ret = talib.ATAN(data)
    // 输出：约 [-1.0037, 0, 1.0037]
    Log(ret)
}
```

```python
import talib
import numpy as np
def main():
    data = [-3.14/2, 0, 3.14/2]
    ret = talib.ATAN(np.array(data))
    # 输出：约 [-1.0037, 0, 1.0037]
    Log(ret)
```

对应TA-Lib：`ATAN(Records[Close]) = Array(outReal)`。

See also: `talib.ACOS`, `talib.ASIN`, `talib.TAN`

##### talib.CEIL

```
talib.CEIL(inReal)
```

把每个元素向上取整（Vector Ceil）。

Parameters:

- `inReal` ({@struct/Record Record}数组 / 数值数组, required): K线数组（取收盘价）或数值数组；Python中传入`records.Close`等数值数组。

Returns (数值数组): 与输入等长的结果数组。

把最近K线的收盘价向上取整。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var ret = talib.CEIL(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    if not records:
        return
    ret = talib.CEIL(records.Close)
    Log(ret)
```

对应TA-Lib：`CEIL(Records[Close]) = Array(outReal)`。

See also: `talib.FLOOR`, `talib.DIV`, `talib.MULT`

##### talib.COS

```
talib.COS(inReal)
```

逐个元素计算余弦（Vector Trigonometric Cos）。

Parameters:

- `inReal` ({@struct/Record Record}数组 / 数值数组, required): K线数组（取收盘价）或数值数组；Python中传入`records.Close`等数值数组。

Returns (数值数组): 与输入等长的结果数组。

对一组数值计算余弦。

```javascript
function main() {
    var data = [-3.14, 0, 3.14]
    var ret = talib.COS(data)
    // 输出：约 [-1, 1, -1]
    Log(ret)
}
```

```python
import talib
import numpy as np
def main():
    data = [-3.14, 0, 3.14]
    ret = talib.COS(np.array(data))
    # 输出：约 [-1, 1, -1]
    Log(ret)
```

对应TA-Lib：`COS(Records[Close]) = Array(outReal)`。

See also: `talib.SIN`, `talib.TAN`, `talib.ACOS`, `talib.COSH`

##### talib.COSH

```
talib.COSH(inReal)
```

逐个元素计算双曲余弦（Vector Trigonometric Cosh）。

Parameters:

- `inReal` ({@struct/Record Record}数组 / 数值数组, required): K线数组（取收盘价）或数值数组；Python中传入`records.Close`等数值数组。

Returns (数值数组): 与输入等长的结果数组。

对一组数值计算双曲余弦。

```javascript
function main() {
    var data = [-1, 0, 1]
    var ret = talib.COSH(data)
    // 输出：约 [1.5431, 1, 1.5431]
    Log(ret)
}
```

```python
import talib
import numpy as np
def main():
    data = [-1.0, 0, 1.0]
    ret = talib.COSH(np.array(data))
    # 输出：约 [1.5431, 1, 1.5431]
    Log(ret)
```

对应TA-Lib：`COSH(Records[Close]) = Array(outReal)`。

See also: `talib.SINH`, `talib.TANH`, `talib.COS`

##### talib.EXP

```
talib.EXP(inReal)
```

逐个元素计算以e为底的指数（Vector Arithmetic Exp）。

Parameters:

- `inReal` ({@struct/Record Record}数组 / 数值数组, required): K线数组（取收盘价）或数值数组；Python中传入`records.Close`等数值数组。

Returns (数值数组): 与输入等长的结果数组。

对一组数值计算以e为底的指数。

```javascript
function main() {
    var data = [0, 1, 2]
    var ret = talib.EXP(data)
    // 输出：约 [1, 2.7183, 7.3891]
    Log(ret)
}
```

```python
import talib
import numpy as np
def main():
    data = [0, 1.0, 2.0]
    ret = talib.EXP(np.array(data))
    # 输出：约 [1, 2.7183, 7.3891]
    Log(ret)
```

对应TA-Lib：`EXP(Records[Close]) = Array(outReal)`。

See also: `talib.LN`, `talib.LOG10`, `talib.SQRT`

##### talib.FLOOR

```
talib.FLOOR(inReal)
```

把每个元素向下取整（Vector Floor）。

Parameters:

- `inReal` ({@struct/Record Record}数组 / 数值数组, required): K线数组（取收盘价）或数值数组；Python中传入`records.Close`等数值数组。

Returns (数值数组): 与输入等长的结果数组。

把最近K线的收盘价向下取整。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var ret = talib.FLOOR(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    if not records:
        return
    ret = talib.FLOOR(records.Close)
    Log(ret)
```

对应TA-Lib：`FLOOR(Records[Close]) = Array(outReal)`。

See also: `talib.CEIL`, `talib.DIV`, `talib.MULT`

##### talib.LN

```
talib.LN(inReal)
```

逐个元素计算自然对数（Vector Log Natural）。

Parameters:

- `inReal` ({@struct/Record Record}数组 / 数值数组, required): K线数组（取收盘价）或数值数组；Python中传入`records.Close`等数值数组。

Returns (数值数组): 与输入等长的结果数组。

对一组数值计算自然对数。

```javascript
function main() {
    var data = [1, 2, 3]
    var ret = talib.LN(data)
    // 输出：约 [0, 0.6931, 1.0986]
    Log(ret)
}
```

```python
import talib
import numpy as np
def main():
    data = [1.0, 2.0, 3.0]
    ret = talib.LN(np.array(data))
    # 输出：约 [0, 0.6931, 1.0986]
    Log(ret)
```

对应TA-Lib：`LN(Records[Close]) = Array(outReal)`。

See also: `talib.LOG10`, `talib.EXP`, `talib.SQRT`

##### talib.LOG10

```
talib.LOG10(inReal)
```

逐个元素计算常用对数（Vector Log10）。

Parameters:

- `inReal` ({@struct/Record Record}数组 / 数值数组, required): K线数组（取收盘价）或数值数组；Python中传入`records.Close`等数值数组。

Returns (数值数组): 与输入等长的结果数组。

对一组数值计算常用对数。

```javascript
function main() {
    var data = [10, 100, 1000]
    var ret = talib.LOG10(data)
    // 输出：[1, 2, 3]
    Log(ret)
}
```

```python
import talib
import numpy as np
def main():
    data = [10.0, 100.0, 1000.0]
    ret = talib.LOG10(np.array(data))
    # 输出：[1, 2, 3]
    Log(ret)
```

对应TA-Lib：`LOG10(Records[Close]) = Array(outReal)`。

See also: `talib.LN`, `talib.EXP`, `talib.SQRT`

##### talib.SIN

```
talib.SIN(inReal)
```

逐个元素计算正弦（Vector Trigonometric Sin）。

Parameters:

- `inReal` ({@struct/Record Record}数组 / 数值数组, required): K线数组（取收盘价）或数值数组；Python中传入`records.Close`等数值数组。

Returns (数值数组): 与输入等长的结果数组。

对一组数值计算正弦。

```javascript
function main() {
    var data = [-3.14/2, 0, 3.14/2]
    var ret = talib.SIN(data)
    // 输出：约 [-1, 0, 1]
    Log(ret)
}
```

```python
import talib
import numpy as np
def main():
    data = [-3.14/2, 0, 3.14/2]
    ret = talib.SIN(np.array(data))
    # 输出：约 [-1, 0, 1]
    Log(ret)
```

对应TA-Lib：`SIN(Records[Close]) = Array(outReal)`。

See also: `talib.COS`, `talib.TAN`, `talib.ASIN`, `talib.SINH`

##### talib.SINH

```
talib.SINH(inReal)
```

逐个元素计算双曲正弦（Vector Trigonometric Sinh）。

Parameters:

- `inReal` ({@struct/Record Record}数组 / 数值数组, required): K线数组（取收盘价）或数值数组；Python中传入`records.Close`等数值数组。

Returns (数值数组): 与输入等长的结果数组。

对一组数值计算双曲正弦。

```javascript
function main() {
    var data = [-1, 0, 1]
    var ret = talib.SINH(data)
    // 输出：约 [-1.1752, 0, 1.1752]
    Log(ret)
}
```

```python
import talib
import numpy as np
def main():
    data = [-1.0, 0, 1.0]
    ret = talib.SINH(np.array(data))
    # 输出：约 [-1.1752, 0, 1.1752]
    Log(ret)
```

对应TA-Lib：`SINH(Records[Close]) = Array(outReal)`。

See also: `talib.COSH`, `talib.TANH`, `talib.SIN`

##### talib.SQRT

```
talib.SQRT(inReal)
```

逐个元素计算平方根（Vector Square Root）。

Parameters:

- `inReal` ({@struct/Record Record}数组 / 数值数组, required): K线数组（取收盘价）或数值数组；Python中传入`records.Close`等数值数组。

Returns (数值数组): 与输入等长的结果数组。

对一组数值计算平方根。

```javascript
function main() {
    var data = [4, 64, 100]
    var ret = talib.SQRT(data)
    // 输出：[2, 8, 10]
    Log(ret)
}
```

```python
import talib
import numpy as np
def main():
    data = [4.0, 64.0, 100.0]
    ret = talib.SQRT(np.array(data))
    # 输出：[2, 8, 10]
    Log(ret)
```

对应TA-Lib：`SQRT(Records[Close]) = Array(outReal)`。

See also: `talib.EXP`, `talib.LN`, `talib.MULT`

##### talib.TAN

```
talib.TAN(inReal)
```

逐个元素计算正切（Vector Trigonometric Tan）。

Parameters:

- `inReal` ({@struct/Record Record}数组 / 数值数组, required): K线数组（取收盘价）或数值数组；Python中传入`records.Close`等数值数组。

Returns (数值数组): 与输入等长的结果数组。

对一组数值计算正切。

```javascript
function main() {
    var data = [-1, 0, 1]
    var ret = talib.TAN(data)
    // 输出：约 [-1.5574, 0, 1.5574]
    Log(ret)
}
```

```python
import talib
import numpy as np
def main():
    data = [-1.0, 0, 1.0]
    ret = talib.TAN(np.array(data))
    # 输出：约 [-1.5574, 0, 1.5574]
    Log(ret)
```

对应TA-Lib：`TAN(Records[Close]) = Array(outReal)`。

See also: `talib.SIN`, `talib.COS`, `talib.ATAN`, `talib.TANH`

##### talib.TANH

```
talib.TANH(inReal)
```

逐个元素计算双曲正切（Vector Trigonometric Tanh）。

Parameters:

- `inReal` ({@struct/Record Record}数组 / 数值数组, required): K线数组（取收盘价）或数值数组；Python中传入`records.Close`等数值数组。

Returns (数值数组): 与输入等长的结果数组。

对一组数值计算双曲正切。

```javascript
function main() {
    var data = [-1, 0, 1]
    var ret = talib.TANH(data)
    // 输出：约 [-0.7616, 0, 0.7616]
    Log(ret)
}
```

```python
import talib
import numpy as np
def main():
    data = [-1.0, 0, 1.0]
    ret = talib.TANH(np.array(data))
    # 输出：约 [-0.7616, 0, 0.7616]
    Log(ret)
```

对应TA-Lib：`TANH(Records[Close]) = Array(outReal)`。

See also: `talib.SINH`, `talib.COSH`, `talib.TAN`

#### 数学运算

两个数组的逐元素加减乘除（Math Operators），以及周期内的最大值、最小值、它们的位置和求和。

##### talib.ADD

```
talib.ADD(inReal0, inReal1)
```

把两个数组逐个元素相加（Vector Arithmetic Add）。

Parameters:

- `inReal0` (数值数组, required): 第一组数据。
- `inReal1` (数值数组, required): 第二组数据，长度必须与`inReal0`相同。

Returns (数值数组): 与输入等长的结果数组。

把每根K线的最高价与最低价相加。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    // 最高价加最低价
    var highs = records.map(function(r) { return r.High })
    var lows = records.map(function(r) { return r.Low })
    var ret = talib.ADD(highs, lows)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    if not records:
        return
    # 最高价加最低价
    ret = talib.ADD(records.High, records.Low)
    Log(ret)
```

对应TA-Lib：`ADD(Array(inReal0),Array(inReal1)) = Array(outReal)`。

逐个元素计算`inReal0[i] + inReal1[i]`。

`JavaScript`中两个输入都要传数值数组（可先用`map`从K线中取出字段）：传入K线数组时两个输入都会取同一份K线的收盘价，结果没有意义；两个数组长度不同会报错。

See also: `talib.SUB`, `talib.MULT`, `talib.DIV`

##### talib.DIV

```
talib.DIV(inReal0, inReal1)
```

用第一个数组逐个元素除以第二个数组（Vector Arithmetic Div）。

Parameters:

- `inReal0` (数值数组, required): 第一组数据。
- `inReal1` (数值数组, required): 第二组数据，长度必须与`inReal0`相同。

Returns (数值数组): 与输入等长的结果数组。

用每根K线的收盘价除以开盘价。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    // 收盘价除以开盘价
    var closes = records.map(function(r) { return r.Close })
    var opens = records.map(function(r) { return r.Open })
    var ret = talib.DIV(closes, opens)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    if not records:
        return
    # 收盘价除以开盘价
    ret = talib.DIV(records.Close, records.Open)
    Log(ret)
```

对应TA-Lib：`DIV(Array(inReal0),Array(inReal1)) = Array(outReal)`。

逐个元素计算`inReal0[i] / inReal1[i]`。

`JavaScript`中两个输入都要传数值数组（可先用`map`从K线中取出字段）：传入K线数组时两个输入都会取同一份K线的收盘价，结果没有意义；两个数组长度不同会报错。

See also: `talib.MULT`, `talib.ADD`, `talib.SUB`

##### talib.MAX

```
talib.MAX(inReal)
talib.MAX(inReal, optInTimePeriod)
```

计算周期最大值（Highest Value over a Specified Period）。

Parameters:

- `inReal` ({@struct/Record Record}数组 / 数值数组, required): K线数组（取收盘价）或数值数组；Python中传入`records.Close`等数值数组。
- `optInTimePeriod` (number, optional): 计算周期。默认 `30`。

Returns (数值数组): 与输入等长的指标值数组，开头数据不足的部分为`NaN`。

用最近的K线计算周期最大值。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var ret = talib.MAX(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    if not records:
        return
    ret = talib.MAX(records.Close)
    Log(ret)
```

对应TA-Lib：`MAX(Records[Close],Time Period = 30) = Array(outReal)`。

See also: `talib.MIN`, `talib.MAXINDEX`, `talib.MINMAX`, `TA.Highest`

##### talib.MAXINDEX

```
talib.MAXINDEX(inReal)
talib.MAXINDEX(inReal, optInTimePeriod)
```

计算周期最大值索引（Index of Highest Value over a Specified Period）。

Parameters:

- `inReal` ({@struct/Record Record}数组 / 数值数组, required): K线数组（取收盘价）或数值数组；Python中传入`records.Close`等数值数组。
- `optInTimePeriod` (number, optional): 计算周期。默认 `30`。

Returns (数值数组): 周期内最大值所在位置的索引数组。

求最近5根K线收盘价最大值所在的索引。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var ret = talib.MAXINDEX(records, 5)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    if not records:
        return
    ret = talib.MAXINDEX(records.Close, 5)
    Log(ret)
```

对应TA-Lib：`MAXINDEX(Records[Close],Time Period = 30) = Array(outInteger)`。

See also: `talib.MAX`, `talib.MININDEX`, `talib.MINMAXINDEX`, `TA.Highest`

##### talib.MIN

```
talib.MIN(inReal)
talib.MIN(inReal, optInTimePeriod)
```

计算周期最小值（Lowest Value over a Specified Period）。

Parameters:

- `inReal` ({@struct/Record Record}数组 / 数值数组, required): K线数组（取收盘价）或数值数组；Python中传入`records.Close`等数值数组。
- `optInTimePeriod` (number, optional): 计算周期。默认 `30`。

Returns (数值数组): 与输入等长的指标值数组，开头数据不足的部分为`NaN`。

用最近的K线计算周期最小值。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var ret = talib.MIN(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    if not records:
        return
    ret = talib.MIN(records.Close)
    Log(ret)
```

对应TA-Lib：`MIN(Records[Close],Time Period = 30) = Array(outReal)`。

See also: `talib.MAX`, `talib.MININDEX`, `talib.MINMAX`, `TA.Lowest`

##### talib.MININDEX

```
talib.MININDEX(inReal)
talib.MININDEX(inReal, optInTimePeriod)
```

计算周期最小值索引（Index of Lowest Value over a Specified Period）。

Parameters:

- `inReal` ({@struct/Record Record}数组 / 数值数组, required): K线数组（取收盘价）或数值数组；Python中传入`records.Close`等数值数组。
- `optInTimePeriod` (number, optional): 计算周期。默认 `30`。

Returns (数值数组): 周期内最小值所在位置的索引数组。

用最近的K线计算周期最小值索引。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var ret = talib.MININDEX(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    if not records:
        return
    ret = talib.MININDEX(records.Close)
    Log(ret)
```

对应TA-Lib：`MININDEX(Records[Close],Time Period = 30) = Array(outInteger)`。

See also: `talib.MIN`, `talib.MAXINDEX`, `talib.MINMAXINDEX`, `TA.Lowest`

##### talib.MINMAX

```
talib.MINMAX(inReal)
talib.MINMAX(inReal, optInTimePeriod)
```

计算周期最小值和最大值（Lowest and Highest Values over a Specified Period），返回最小值、最大值。

Parameters:

- `inReal` ({@struct/Record Record}数组 / 数值数组, required): K线数组（取收盘价）或数值数组；Python中传入`records.Close`等数值数组。
- `optInTimePeriod` (number, optional): 计算周期。默认 `30`。

Returns (array): 二维数组，依次为最小值、最大值数组（Python中为同样顺序的tuple）。

用最近的K线计算周期最小值和最大值。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var ret = talib.MINMAX(records)
    // 输出：[最小值数组, 最大值数组]
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    if not records:
        return
    ret = talib.MINMAX(records.Close)
    # 输出：(最小值数组, 最大值数组)
    Log(ret)
```

对应TA-Lib：`MINMAX(Records[Close],Time Period = 30) = [Array(outMin),Array(outMax)]`。

See also: `talib.MIN`, `talib.MAX`, `talib.MINMAXINDEX`, `TA.Highest`, `TA.Lowest`

##### talib.MINMAXINDEX

```
talib.MINMAXINDEX(inReal)
talib.MINMAXINDEX(inReal, optInTimePeriod)
```

计算周期最小值和最大值索引（Indexes of Lowest and Highest Values over a Specified Period），返回最小值索引、最大值索引。

Parameters:

- `inReal` ({@struct/Record Record}数组 / 数值数组, required): K线数组（取收盘价）或数值数组；Python中传入`records.Close`等数值数组。
- `optInTimePeriod` (number, optional): 计算周期。默认 `30`。

Returns (array): 二维数组，依次为最小值索引、最大值索引数组（Python中为同样顺序的tuple）。

用最近的K线计算周期最小值和最大值索引。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var ret = talib.MINMAXINDEX(records)
    // 输出：[最小值索引数组, 最大值索引数组]
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    if not records:
        return
    ret = talib.MINMAXINDEX(records.Close)
    # 输出：(最小值索引数组, 最大值索引数组)
    Log(ret)
```

对应TA-Lib：`MINMAXINDEX(Records[Close],Time Period = 30) = [Array(outMinIdx),Array(outMaxIdx)]`。

See also: `talib.MININDEX`, `talib.MAXINDEX`, `talib.MINMAX`

##### talib.MULT

```
talib.MULT(inReal0, inReal1)
```

把两个数组逐个元素相乘（Vector Arithmetic Mult）。

Parameters:

- `inReal0` (数值数组, required): 第一组数据。
- `inReal1` (数值数组, required): 第二组数据，长度必须与`inReal0`相同。

Returns (数值数组): 与输入等长的结果数组。

用每根K线的收盘价乘以成交量。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    // 收盘价乘以成交量
    var closes = records.map(function(r) { return r.Close })
    var volumes = records.map(function(r) { return r.Volume })
    var ret = talib.MULT(closes, volumes)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    if not records:
        return
    # 收盘价乘以成交量
    ret = talib.MULT(records.Close, records.Volume)
    Log(ret)
```

对应TA-Lib：`MULT(Array(inReal0),Array(inReal1)) = Array(outReal)`。

逐个元素计算`inReal0[i] * inReal1[i]`。

`JavaScript`中两个输入都要传数值数组（可先用`map`从K线中取出字段）：传入K线数组时两个输入都会取同一份K线的收盘价，结果没有意义；两个数组长度不同会报错。

See also: `talib.DIV`, `talib.ADD`, `talib.SUB`

##### talib.SUB

```
talib.SUB(inReal0, inReal1)
```

用第一个数组逐个元素减去第二个数组（Vector Arithmetic Subtraction）。

Parameters:

- `inReal0` (数值数组, required): 第一组数据。
- `inReal1` (数值数组, required): 第二组数据，长度必须与`inReal0`相同。

Returns (数值数组): 与输入等长的结果数组。

用每根K线的最高价减去最低价。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    // 最高价减最低价
    var highs = records.map(function(r) { return r.High })
    var lows = records.map(function(r) { return r.Low })
    var ret = talib.SUB(highs, lows)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    if not records:
        return
    # 最高价减最低价
    ret = talib.SUB(records.High, records.Low)
    Log(ret)
```

对应TA-Lib：`SUB(Array(inReal0),Array(inReal1)) = Array(outReal)`。

逐个元素计算`inReal0[i] - inReal1[i]`。

`JavaScript`中两个输入都要传数值数组（可先用`map`从K线中取出字段）：传入K线数组时两个输入都会取同一份K线的收盘价，结果没有意义；两个数组长度不同会报错。

See also: `talib.ADD`, `talib.MULT`, `talib.DIV`

##### talib.SUM

```
talib.SUM(inReal)
talib.SUM(inReal, optInTimePeriod)
```

计算周期求和（Summation）。

Parameters:

- `inReal` ({@struct/Record Record}数组 / 数值数组, required): K线数组（取收盘价）或数值数组；Python中传入`records.Close`等数值数组。
- `optInTimePeriod` (number, optional): 计算周期。默认 `30`。

Returns (数值数组): 与输入等长的指标值数组，开头数据不足的部分为`NaN`。

用最近的K线计算周期求和。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var ret = talib.SUM(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    if not records:
        return
    ret = talib.SUM(records.Close)
    Log(ret)
```

对应TA-Lib：`SUM(Records[Close],Time Period = 30) = Array(outReal)`。

See also: `talib.ADD`, `talib.SMA`, `talib.MAX`

#### K线形态识别

识别经典蜡烛图形态（Pattern Recognition），出现形态时返回非零值（正数为看涨形态、负数为看跌形态，通常为`100`或`-100`），否则返回`0`。JavaScript中开头不足计算所需根数的部分为`NaN`。

##### talib.CDL2CROWS

```
talib.CDL2CROWS(inPriceOHLC)
```

识别两只乌鸦（Two Crows）K线形态。

Parameters:

- `inPriceOHLC` ({@struct/Record Record}数组, required): K线数组，取开盘价、最高价、最低价、收盘价；Python中依次传入`records.Open`、`records.High`、`records.Low`、`records.Close`。

Returns (数值数组): 形态信号数组：看涨形态为正数、看跌形态为负数（通常为`100`或`-100`），未出现形态为`0`。

用最近的K线识别两只乌鸦形态。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var ret = talib.CDL2CROWS(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    if not records:
        return
    ret = talib.CDL2CROWS(records.Open, records.High, records.Low, records.Close)
    Log(ret)
```

对应TA-Lib：`CDL2CROWS(Records[Open,High,Low,Close]) = Array(outInteger)`。

See also: `talib.CDLUPSIDEGAP2CROWS`, `talib.CDL3BLACKCROWS`, `talib.CDLIDENTICAL3CROWS`

##### talib.CDL3BLACKCROWS

```
talib.CDL3BLACKCROWS(inPriceOHLC)
```

识别三只乌鸦（Three Black Crows）K线形态。

Parameters:

- `inPriceOHLC` ({@struct/Record Record}数组, required): K线数组，取开盘价、最高价、最低价、收盘价；Python中依次传入`records.Open`、`records.High`、`records.Low`、`records.Close`。

Returns (数值数组): 形态信号数组：看涨形态为正数、看跌形态为负数（通常为`100`或`-100`），未出现形态为`0`。

用最近的K线识别三只乌鸦形态。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var ret = talib.CDL3BLACKCROWS(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    if not records:
        return
    ret = talib.CDL3BLACKCROWS(records.Open, records.High, records.Low, records.Close)
    Log(ret)
```

对应TA-Lib：`CDL3BLACKCROWS(Records[Open,High,Low,Close]) = Array(outInteger)`。

See also: `talib.CDLIDENTICAL3CROWS`, `talib.CDL2CROWS`, `talib.CDL3WHITESOLDIERS`

##### talib.CDL3INSIDE

```
talib.CDL3INSIDE(inPriceOHLC)
```

识别三内部上涨和下跌（Three Inside Up/Down）K线形态。

Parameters:

- `inPriceOHLC` ({@struct/Record Record}数组, required): K线数组，取开盘价、最高价、最低价、收盘价；Python中依次传入`records.Open`、`records.High`、`records.Low`、`records.Close`。

Returns (数值数组): 形态信号数组：看涨形态为正数、看跌形态为负数（通常为`100`或`-100`），未出现形态为`0`。

用最近的K线识别三内部上涨和下跌形态。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var ret = talib.CDL3INSIDE(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    if not records:
        return
    ret = talib.CDL3INSIDE(records.Open, records.High, records.Low, records.Close)
    Log(ret)
```

对应TA-Lib：`CDL3INSIDE(Records[Open,High,Low,Close]) = Array(outInteger)`。

See also: `talib.CDLHARAMI`, `talib.CDL3OUTSIDE`, `talib.CDLENGULFING`

##### talib.CDL3LINESTRIKE

```
talib.CDL3LINESTRIKE(inPriceOHLC)
```

识别三线打击（Three-Line Strike）K线形态。

Parameters:

- `inPriceOHLC` ({@struct/Record Record}数组, required): K线数组，取开盘价、最高价、最低价、收盘价；Python中依次传入`records.Open`、`records.High`、`records.Low`、`records.Close`。

Returns (数值数组): 形态信号数组：看涨形态为正数、看跌形态为负数（通常为`100`或`-100`），未出现形态为`0`。

用最近的K线识别三线打击形态。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var ret = talib.CDL3LINESTRIKE(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    if not records:
        return
    ret = talib.CDL3LINESTRIKE(records.Open, records.High, records.Low, records.Close)
    Log(ret)
```

对应TA-Lib：`CDL3LINESTRIKE(Records[Open,High,Low,Close]) = Array(outInteger)`。

See also: `talib.CDL3BLACKCROWS`, `talib.CDL3WHITESOLDIERS`, `talib.CDLENGULFING`

##### talib.CDL3OUTSIDE

```
talib.CDL3OUTSIDE(inPriceOHLC)
```

识别三外部上涨和下跌（Three Outside Up/Down）K线形态。

Parameters:

- `inPriceOHLC` ({@struct/Record Record}数组, required): K线数组，取开盘价、最高价、最低价、收盘价；Python中依次传入`records.Open`、`records.High`、`records.Low`、`records.Close`。

Returns (数值数组): 形态信号数组：看涨形态为正数、看跌形态为负数（通常为`100`或`-100`），未出现形态为`0`。

用最近的K线识别三外部上涨和下跌形态。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var ret = talib.CDL3OUTSIDE(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    if not records:
        return
    ret = talib.CDL3OUTSIDE(records.Open, records.High, records.Low, records.Close)
    Log(ret)
```

对应TA-Lib：`CDL3OUTSIDE(Records[Open,High,Low,Close]) = Array(outInteger)`。

See also: `talib.CDLENGULFING`, `talib.CDL3INSIDE`, `talib.CDLHARAMI`

##### talib.CDL3STARSINSOUTH

```
talib.CDL3STARSINSOUTH(inPriceOHLC)
```

识别南方三星（Three Stars In The South）K线形态。

Parameters:

- `inPriceOHLC` ({@struct/Record Record}数组, required): K线数组，取开盘价、最高价、最低价、收盘价；Python中依次传入`records.Open`、`records.High`、`records.Low`、`records.Close`。

Returns (数值数组): 形态信号数组：看涨形态为正数、看跌形态为负数（通常为`100`或`-100`），未出现形态为`0`。

用最近的K线识别南方三星形态。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var ret = talib.CDL3STARSINSOUTH(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    if not records:
        return
    ret = talib.CDL3STARSINSOUTH(records.Open, records.High, records.Low, records.Close)
    Log(ret)
```

对应TA-Lib：`CDL3STARSINSOUTH(Records[Open,High,Low,Close]) = Array(outInteger)`。

See also: `talib.CDLMORNINGSTAR`, `talib.CDLTRISTAR`, `talib.CDLLADDERBOTTOM`

##### talib.CDL3WHITESOLDIERS

```
talib.CDL3WHITESOLDIERS(inPriceOHLC)
```

识别三个白兵（Three Advancing White Soldiers）K线形态。

Parameters:

- `inPriceOHLC` ({@struct/Record Record}数组, required): K线数组，取开盘价、最高价、最低价、收盘价；Python中依次传入`records.Open`、`records.High`、`records.Low`、`records.Close`。

Returns (数值数组): 形态信号数组：看涨形态为正数、看跌形态为负数（通常为`100`或`-100`），未出现形态为`0`。

用最近的K线识别三个白兵形态。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var ret = talib.CDL3WHITESOLDIERS(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    if not records:
        return
    ret = talib.CDL3WHITESOLDIERS(records.Open, records.High, records.Low, records.Close)
    Log(ret)
```

对应TA-Lib：`CDL3WHITESOLDIERS(Records[Open,High,Low,Close]) = Array(outInteger)`。

See also: `talib.CDL3BLACKCROWS`, `talib.CDLADVANCEBLOCK`, `talib.CDLSTALLEDPATTERN`

##### talib.CDLABANDONEDBABY

```
talib.CDLABANDONEDBABY(inPriceOHLC)
talib.CDLABANDONEDBABY(inPriceOHLC, optInPenetration)
```

识别弃婴（Abandoned Baby）K线形态。

Parameters:

- `inPriceOHLC` ({@struct/Record Record}数组, required): K线数组，取开盘价、最高价、最低价、收盘价；Python中依次传入`records.Open`、`records.High`、`records.Low`、`records.Close`。
- `optInPenetration` (number, optional): 穿透比例（Penetration），即一根K线实体穿入另一根K线实体的比例（非负数）。默认 `0.3`。

Returns (数值数组): 形态信号数组：看涨形态为正数、看跌形态为负数（通常为`100`或`-100`），未出现形态为`0`。

用最近的K线识别弃婴形态。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var ret = talib.CDLABANDONEDBABY(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    if not records:
        return
    ret = talib.CDLABANDONEDBABY(records.Open, records.High, records.Low, records.Close)
    Log(ret)
```

对应TA-Lib：`CDLABANDONEDBABY(Records[Open,High,Low,Close],Penetration = 0.3) = Array(outInteger)`。

See also: `talib.CDLMORNINGDOJISTAR`, `talib.CDLEVENINGDOJISTAR`, `talib.CDLDOJISTAR`

##### talib.CDLADVANCEBLOCK

```
talib.CDLADVANCEBLOCK(inPriceOHLC)
```

识别前进受阻（Advance Block）K线形态。

Parameters:

- `inPriceOHLC` ({@struct/Record Record}数组, required): K线数组，取开盘价、最高价、最低价、收盘价；Python中依次传入`records.Open`、`records.High`、`records.Low`、`records.Close`。

Returns (数值数组): 形态信号数组：看涨形态为正数、看跌形态为负数（通常为`100`或`-100`），未出现形态为`0`。

用最近的K线识别前进受阻形态。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var ret = talib.CDLADVANCEBLOCK(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    if not records:
        return
    ret = talib.CDLADVANCEBLOCK(records.Open, records.High, records.Low, records.Close)
    Log(ret)
```

对应TA-Lib：`CDLADVANCEBLOCK(Records[Open,High,Low,Close]) = Array(outInteger)`。

See also: `talib.CDL3WHITESOLDIERS`, `talib.CDLSTALLEDPATTERN`, `talib.CDL3BLACKCROWS`

##### talib.CDLBELTHOLD

```
talib.CDLBELTHOLD(inPriceOHLC)
```

识别捉腰带线（Belt-hold）K线形态。

Parameters:

- `inPriceOHLC` ({@struct/Record Record}数组, required): K线数组，取开盘价、最高价、最低价、收盘价；Python中依次传入`records.Open`、`records.High`、`records.Low`、`records.Close`。

Returns (数值数组): 形态信号数组：看涨形态为正数、看跌形态为负数（通常为`100`或`-100`），未出现形态为`0`。

用最近的K线识别捉腰带线形态。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var ret = talib.CDLBELTHOLD(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    if not records:
        return
    ret = talib.CDLBELTHOLD(records.Open, records.High, records.Low, records.Close)
    Log(ret)
```

对应TA-Lib：`CDLBELTHOLD(Records[Open,High,Low,Close]) = Array(outInteger)`。

See also: `talib.CDLMARUBOZU`, `talib.CDLCLOSINGMARUBOZU`, `talib.CDLLONGLINE`

##### talib.CDLBREAKAWAY

```
talib.CDLBREAKAWAY(inPriceOHLC)
```

识别脱离（Breakaway）K线形态。

Parameters:

- `inPriceOHLC` ({@struct/Record Record}数组, required): K线数组，取开盘价、最高价、最低价、收盘价；Python中依次传入`records.Open`、`records.High`、`records.Low`、`records.Close`。

Returns (数值数组): 形态信号数组：看涨形态为正数、看跌形态为负数（通常为`100`或`-100`），未出现形态为`0`。

用最近的K线识别脱离形态。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var ret = talib.CDLBREAKAWAY(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    if not records:
        return
    ret = talib.CDLBREAKAWAY(records.Open, records.High, records.Low, records.Close)
    Log(ret)
```

对应TA-Lib：`CDLBREAKAWAY(Records[Open,High,Low,Close]) = Array(outInteger)`。

See also: `talib.CDLXSIDEGAP3METHODS`, `talib.CDLRISEFALL3METHODS`, `talib.CDLTASUKIGAP`

##### talib.CDLCLOSINGMARUBOZU

```
talib.CDLCLOSINGMARUBOZU(inPriceOHLC)
```

识别收盘光头光脚线（Closing Marubozu）K线形态。

Parameters:

- `inPriceOHLC` ({@struct/Record Record}数组, required): K线数组，取开盘价、最高价、最低价、收盘价；Python中依次传入`records.Open`、`records.High`、`records.Low`、`records.Close`。

Returns (数值数组): 形态信号数组：看涨形态为正数、看跌形态为负数（通常为`100`或`-100`），未出现形态为`0`。

用最近的K线识别收盘光头光脚线形态。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var ret = talib.CDLCLOSINGMARUBOZU(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    if not records:
        return
    ret = talib.CDLCLOSINGMARUBOZU(records.Open, records.High, records.Low, records.Close)
    Log(ret)
```

对应TA-Lib：`CDLCLOSINGMARUBOZU(Records[Open,High,Low,Close]) = Array(outInteger)`。

See also: `talib.CDLMARUBOZU`, `talib.CDLBELTHOLD`, `talib.CDLLONGLINE`

##### talib.CDLCONCEALBABYSWALL

```
talib.CDLCONCEALBABYSWALL(inPriceOHLC)
```

识别藏婴吞没（Concealing Baby Swallow）K线形态。

Parameters:

- `inPriceOHLC` ({@struct/Record Record}数组, required): K线数组，取开盘价、最高价、最低价、收盘价；Python中依次传入`records.Open`、`records.High`、`records.Low`、`records.Close`。

Returns (数值数组): 形态信号数组：看涨形态为正数、看跌形态为负数（通常为`100`或`-100`），未出现形态为`0`。

用最近的K线识别藏婴吞没形态。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var ret = talib.CDLCONCEALBABYSWALL(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    if not records:
        return
    ret = talib.CDLCONCEALBABYSWALL(records.Open, records.High, records.Low, records.Close)
    Log(ret)
```

对应TA-Lib：`CDLCONCEALBABYSWALL(Records[Open,High,Low,Close]) = Array(outInteger)`。

See also: `talib.CDL3BLACKCROWS`, `talib.CDLENGULFING`, `talib.CDLMARUBOZU`

##### talib.CDLCOUNTERATTACK

```
talib.CDLCOUNTERATTACK(inPriceOHLC)
```

识别反击线（Counterattack）K线形态。

Parameters:

- `inPriceOHLC` ({@struct/Record Record}数组, required): K线数组，取开盘价、最高价、最低价、收盘价；Python中依次传入`records.Open`、`records.High`、`records.Low`、`records.Close`。

Returns (数值数组): 形态信号数组：看涨形态为正数、看跌形态为负数（通常为`100`或`-100`），未出现形态为`0`。

用最近的K线识别反击线形态。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var ret = talib.CDLCOUNTERATTACK(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    if not records:
        return
    ret = talib.CDLCOUNTERATTACK(records.Open, records.High, records.Low, records.Close)
    Log(ret)
```

对应TA-Lib：`CDLCOUNTERATTACK(Records[Open,High,Low,Close]) = Array(outInteger)`。

See also: `talib.CDLPIERCING`, `talib.CDLDARKCLOUDCOVER`, `talib.CDLMATCHINGLOW`

##### talib.CDLDARKCLOUDCOVER

```
talib.CDLDARKCLOUDCOVER(inPriceOHLC)
talib.CDLDARKCLOUDCOVER(inPriceOHLC, optInPenetration)
```

识别乌云压顶（Dark Cloud Cover）K线形态。

Parameters:

- `inPriceOHLC` ({@struct/Record Record}数组, required): K线数组，取开盘价、最高价、最低价、收盘价；Python中依次传入`records.Open`、`records.High`、`records.Low`、`records.Close`。
- `optInPenetration` (number, optional): 穿透比例（Penetration），即一根K线实体穿入另一根K线实体的比例（非负数）。默认 `0.5`。

Returns (数值数组): 形态信号数组：看涨形态为正数、看跌形态为负数（通常为`100`或`-100`），未出现形态为`0`。

用最近的K线识别乌云压顶形态。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var ret = talib.CDLDARKCLOUDCOVER(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    if not records:
        return
    ret = talib.CDLDARKCLOUDCOVER(records.Open, records.High, records.Low, records.Close)
    Log(ret)
```

对应TA-Lib：`CDLDARKCLOUDCOVER(Records[Open,High,Low,Close],Penetration = 0.5) = Array(outInteger)`。

See also: `talib.CDLPIERCING`, `talib.CDLENGULFING`, `talib.CDLCOUNTERATTACK`

##### talib.CDLDOJI

```
talib.CDLDOJI(inPriceOHLC)
```

识别十字星（Doji）K线形态。

Parameters:

- `inPriceOHLC` ({@struct/Record Record}数组, required): K线数组，取开盘价、最高价、最低价、收盘价；Python中依次传入`records.Open`、`records.High`、`records.Low`、`records.Close`。

Returns (数值数组): 形态信号数组：看涨形态为正数、看跌形态为负数（通常为`100`或`-100`），未出现形态为`0`。

用最近的K线识别十字星形态。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var ret = talib.CDLDOJI(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    if not records:
        return
    ret = talib.CDLDOJI(records.Open, records.High, records.Low, records.Close)
    Log(ret)
```

对应TA-Lib：`CDLDOJI(Records[Open,High,Low,Close]) = Array(outInteger)`。

See also: `talib.CDLDOJISTAR`, `talib.CDLLONGLEGGEDDOJI`, `talib.CDLDRAGONFLYDOJI`, `talib.CDLGRAVESTONEDOJI`, `talib.CDLRICKSHAWMAN`

##### talib.CDLDOJISTAR

```
talib.CDLDOJISTAR(inPriceOHLC)
```

识别跳空十字星（Doji Star）K线形态。

Parameters:

- `inPriceOHLC` ({@struct/Record Record}数组, required): K线数组，取开盘价、最高价、最低价、收盘价；Python中依次传入`records.Open`、`records.High`、`records.Low`、`records.Close`。

Returns (数值数组): 形态信号数组：看涨形态为正数、看跌形态为负数（通常为`100`或`-100`），未出现形态为`0`。

用最近的K线识别跳空十字星形态。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var ret = talib.CDLDOJISTAR(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    if not records:
        return
    ret = talib.CDLDOJISTAR(records.Open, records.High, records.Low, records.Close)
    Log(ret)
```

对应TA-Lib：`CDLDOJISTAR(Records[Open,High,Low,Close]) = Array(outInteger)`。

See also: `talib.CDLDOJI`, `talib.CDLMORNINGDOJISTAR`, `talib.CDLEVENINGDOJISTAR`, `talib.CDLABANDONEDBABY`

##### talib.CDLDRAGONFLYDOJI

```
talib.CDLDRAGONFLYDOJI(inPriceOHLC)
```

识别蜻蜓十字（Dragonfly Doji）K线形态。

Parameters:

- `inPriceOHLC` ({@struct/Record Record}数组, required): K线数组，取开盘价、最高价、最低价、收盘价；Python中依次传入`records.Open`、`records.High`、`records.Low`、`records.Close`。

Returns (数值数组): 形态信号数组：看涨形态为正数、看跌形态为负数（通常为`100`或`-100`），未出现形态为`0`。

用最近的K线识别蜻蜓十字形态。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var ret = talib.CDLDRAGONFLYDOJI(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    if not records:
        return
    ret = talib.CDLDRAGONFLYDOJI(records.Open, records.High, records.Low, records.Close)
    Log(ret)
```

对应TA-Lib：`CDLDRAGONFLYDOJI(Records[Open,High,Low,Close]) = Array(outInteger)`。

See also: `talib.CDLDOJI`, `talib.CDLGRAVESTONEDOJI`, `talib.CDLTAKURI`, `talib.CDLHAMMER`

##### talib.CDLENGULFING

```
talib.CDLENGULFING(inPriceOHLC)
```

识别吞没（Engulfing Pattern）K线形态。

Parameters:

- `inPriceOHLC` ({@struct/Record Record}数组, required): K线数组，取开盘价、最高价、最低价、收盘价；Python中依次传入`records.Open`、`records.High`、`records.Low`、`records.Close`。

Returns (数值数组): 形态信号数组：看涨形态为正数、看跌形态为负数（通常为`100`或`-100`），未出现形态为`0`。

用最近的K线识别吞没形态。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var ret = talib.CDLENGULFING(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    if not records:
        return
    ret = talib.CDLENGULFING(records.Open, records.High, records.Low, records.Close)
    Log(ret)
```

对应TA-Lib：`CDLENGULFING(Records[Open,High,Low,Close]) = Array(outInteger)`。

See also: `talib.CDLHARAMI`, `talib.CDL3OUTSIDE`, `talib.CDLPIERCING`, `talib.CDLDARKCLOUDCOVER`

##### talib.CDLEVENINGDOJISTAR

```
talib.CDLEVENINGDOJISTAR(inPriceOHLC)
talib.CDLEVENINGDOJISTAR(inPriceOHLC, optInPenetration)
```

识别黄昏十字星（Evening Doji Star）K线形态。

Parameters:

- `inPriceOHLC` ({@struct/Record Record}数组, required): K线数组，取开盘价、最高价、最低价、收盘价；Python中依次传入`records.Open`、`records.High`、`records.Low`、`records.Close`。
- `optInPenetration` (number, optional): 穿透比例（Penetration），即一根K线实体穿入另一根K线实体的比例（非负数）。默认 `0.3`。

Returns (数值数组): 形态信号数组：看涨形态为正数、看跌形态为负数（通常为`100`或`-100`），未出现形态为`0`。

用最近的K线识别黄昏十字星形态。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var ret = talib.CDLEVENINGDOJISTAR(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    if not records:
        return
    ret = talib.CDLEVENINGDOJISTAR(records.Open, records.High, records.Low, records.Close)
    Log(ret)
```

对应TA-Lib：`CDLEVENINGDOJISTAR(Records[Open,High,Low,Close],Penetration = 0.3) = Array(outInteger)`。

See also: `talib.CDLEVENINGSTAR`, `talib.CDLMORNINGDOJISTAR`, `talib.CDLABANDONEDBABY`, `talib.CDLDOJISTAR`

##### talib.CDLEVENINGSTAR

```
talib.CDLEVENINGSTAR(inPriceOHLC)
talib.CDLEVENINGSTAR(inPriceOHLC, optInPenetration)
```

识别黄昏之星（Evening Star）K线形态。

Parameters:

- `inPriceOHLC` ({@struct/Record Record}数组, required): K线数组，取开盘价、最高价、最低价、收盘价；Python中依次传入`records.Open`、`records.High`、`records.Low`、`records.Close`。
- `optInPenetration` (number, optional): 穿透比例（Penetration），即一根K线实体穿入另一根K线实体的比例（非负数）。默认 `0.3`。

Returns (数值数组): 形态信号数组：看涨形态为正数、看跌形态为负数（通常为`100`或`-100`），未出现形态为`0`。

用最近的K线识别黄昏之星形态。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var ret = talib.CDLEVENINGSTAR(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    if not records:
        return
    ret = talib.CDLEVENINGSTAR(records.Open, records.High, records.Low, records.Close)
    Log(ret)
```

对应TA-Lib：`CDLEVENINGSTAR(Records[Open,High,Low,Close],Penetration = 0.3) = Array(outInteger)`。

See also: `talib.CDLEVENINGDOJISTAR`, `talib.CDLMORNINGSTAR`, `talib.CDLSHOOTINGSTAR`

##### talib.CDLGAPSIDESIDEWHITE

```
talib.CDLGAPSIDESIDEWHITE(inPriceOHLC)
```

识别向上/向下跳空并列阳线（Up/Down-gap side-by-side white lines）K线形态。

Parameters:

- `inPriceOHLC` ({@struct/Record Record}数组, required): K线数组，取开盘价、最高价、最低价、收盘价；Python中依次传入`records.Open`、`records.High`、`records.Low`、`records.Close`。

Returns (数值数组): 形态信号数组：看涨形态为正数、看跌形态为负数（通常为`100`或`-100`），未出现形态为`0`。

用最近的K线识别向上/向下跳空并列阳线形态。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var ret = talib.CDLGAPSIDESIDEWHITE(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    if not records:
        return
    ret = talib.CDLGAPSIDESIDEWHITE(records.Open, records.High, records.Low, records.Close)
    Log(ret)
```

对应TA-Lib：`CDLGAPSIDESIDEWHITE(Records[Open,High,Low,Close]) = Array(outInteger)`。

See also: `talib.CDLTASUKIGAP`, `talib.CDLXSIDEGAP3METHODS`, `talib.CDLSEPARATINGLINES`

##### talib.CDLGRAVESTONEDOJI

```
talib.CDLGRAVESTONEDOJI(inPriceOHLC)
```

识别墓碑十字（Gravestone Doji）K线形态。

Parameters:

- `inPriceOHLC` ({@struct/Record Record}数组, required): K线数组，取开盘价、最高价、最低价、收盘价；Python中依次传入`records.Open`、`records.High`、`records.Low`、`records.Close`。

Returns (数值数组): 形态信号数组：看涨形态为正数、看跌形态为负数（通常为`100`或`-100`），未出现形态为`0`。

用最近的K线识别墓碑十字形态。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var ret = talib.CDLGRAVESTONEDOJI(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    if not records:
        return
    ret = talib.CDLGRAVESTONEDOJI(records.Open, records.High, records.Low, records.Close)
    Log(ret)
```

对应TA-Lib：`CDLGRAVESTONEDOJI(Records[Open,High,Low,Close]) = Array(outInteger)`。

See also: `talib.CDLDOJI`, `talib.CDLDRAGONFLYDOJI`, `talib.CDLSHOOTINGSTAR`, `talib.CDLINVERTEDHAMMER`

##### talib.CDLHAMMER

```
talib.CDLHAMMER(inPriceOHLC)
```

识别锤头线（Hammer）K线形态。

Parameters:

- `inPriceOHLC` ({@struct/Record Record}数组, required): K线数组，取开盘价、最高价、最低价、收盘价；Python中依次传入`records.Open`、`records.High`、`records.Low`、`records.Close`。

Returns (数值数组): 形态信号数组：看涨形态为正数、看跌形态为负数（通常为`100`或`-100`），未出现形态为`0`。

用最近的K线识别锤头线形态。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var ret = talib.CDLHAMMER(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    if not records:
        return
    ret = talib.CDLHAMMER(records.Open, records.High, records.Low, records.Close)
    Log(ret)
```

对应TA-Lib：`CDLHAMMER(Records[Open,High,Low,Close]) = Array(outInteger)`。

See also: `talib.CDLHANGINGMAN`, `talib.CDLINVERTEDHAMMER`, `talib.CDLTAKURI`, `talib.CDLDRAGONFLYDOJI`

##### talib.CDLHANGINGMAN

```
talib.CDLHANGINGMAN(inPriceOHLC)
```

识别上吊线（Hanging Man）K线形态。

Parameters:

- `inPriceOHLC` ({@struct/Record Record}数组, required): K线数组，取开盘价、最高价、最低价、收盘价；Python中依次传入`records.Open`、`records.High`、`records.Low`、`records.Close`。

Returns (数值数组): 形态信号数组：看涨形态为正数、看跌形态为负数（通常为`100`或`-100`），未出现形态为`0`。

用最近的K线识别上吊线形态。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var ret = talib.CDLHANGINGMAN(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    if not records:
        return
    ret = talib.CDLHANGINGMAN(records.Open, records.High, records.Low, records.Close)
    Log(ret)
```

对应TA-Lib：`CDLHANGINGMAN(Records[Open,High,Low,Close]) = Array(outInteger)`。

See also: `talib.CDLHAMMER`, `talib.CDLSHOOTINGSTAR`, `talib.CDLINVERTEDHAMMER`

##### talib.CDLHARAMI

```
talib.CDLHARAMI(inPriceOHLC)
```

识别母子线（Harami Pattern）K线形态。

Parameters:

- `inPriceOHLC` ({@struct/Record Record}数组, required): K线数组，取开盘价、最高价、最低价、收盘价；Python中依次传入`records.Open`、`records.High`、`records.Low`、`records.Close`。

Returns (数值数组): 形态信号数组：看涨形态为正数、看跌形态为负数（通常为`100`或`-100`），未出现形态为`0`。

用最近的K线识别母子线形态。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var ret = talib.CDLHARAMI(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    if not records:
        return
    ret = talib.CDLHARAMI(records.Open, records.High, records.Low, records.Close)
    Log(ret)
```

对应TA-Lib：`CDLHARAMI(Records[Open,High,Low,Close]) = Array(outInteger)`。

See also: `talib.CDLHARAMICROSS`, `talib.CDL3INSIDE`, `talib.CDLENGULFING`, `talib.CDLHOMINGPIGEON`

##### talib.CDLHARAMICROSS

```
talib.CDLHARAMICROSS(inPriceOHLC)
```

识别十字孕线（Harami Cross Pattern）K线形态。

Parameters:

- `inPriceOHLC` ({@struct/Record Record}数组, required): K线数组，取开盘价、最高价、最低价、收盘价；Python中依次传入`records.Open`、`records.High`、`records.Low`、`records.Close`。

Returns (数值数组): 形态信号数组：看涨形态为正数、看跌形态为负数（通常为`100`或`-100`），未出现形态为`0`。

用最近的K线识别十字孕线形态。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var ret = talib.CDLHARAMICROSS(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    if not records:
        return
    ret = talib.CDLHARAMICROSS(records.Open, records.High, records.Low, records.Close)
    Log(ret)
```

对应TA-Lib：`CDLHARAMICROSS(Records[Open,High,Low,Close]) = Array(outInteger)`。

See also: `talib.CDLHARAMI`, `talib.CDLDOJI`, `talib.CDL3INSIDE`

##### talib.CDLHIGHWAVE

```
talib.CDLHIGHWAVE(inPriceOHLC)
```

识别风高浪大线（High-Wave Candle）K线形态。

Parameters:

- `inPriceOHLC` ({@struct/Record Record}数组, required): K线数组，取开盘价、最高价、最低价、收盘价；Python中依次传入`records.Open`、`records.High`、`records.Low`、`records.Close`。

Returns (数值数组): 形态信号数组：看涨形态为正数、看跌形态为负数（通常为`100`或`-100`），未出现形态为`0`。

用最近的K线识别风高浪大线形态。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var ret = talib.CDLHIGHWAVE(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    if not records:
        return
    ret = talib.CDLHIGHWAVE(records.Open, records.High, records.Low, records.Close)
    Log(ret)
```

对应TA-Lib：`CDLHIGHWAVE(Records[Open,High,Low,Close]) = Array(outInteger)`。

See also: `talib.CDLSPINNINGTOP`, `talib.CDLLONGLEGGEDDOJI`, `talib.CDLRICKSHAWMAN`

##### talib.CDLHIKKAKE

```
talib.CDLHIKKAKE(inPriceOHLC)
```

识别陷阱（Hikkake Pattern）K线形态。

Parameters:

- `inPriceOHLC` ({@struct/Record Record}数组, required): K线数组，取开盘价、最高价、最低价、收盘价；Python中依次传入`records.Open`、`records.High`、`records.Low`、`records.Close`。

Returns (数值数组): 形态信号数组：看涨形态为正数、看跌形态为负数（通常为`100`或`-100`），未出现形态为`0`。

用最近的K线识别陷阱形态。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var ret = talib.CDLHIKKAKE(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    if not records:
        return
    ret = talib.CDLHIKKAKE(records.Open, records.High, records.Low, records.Close)
    Log(ret)
```

对应TA-Lib：`CDLHIKKAKE(Records[Open,High,Low,Close]) = Array(outInteger)`。

See also: `talib.CDLHIKKAKEMOD`, `talib.CDLHARAMI`, `talib.CDL3INSIDE`

##### talib.CDLHIKKAKEMOD

```
talib.CDLHIKKAKEMOD(inPriceOHLC)
```

识别修正陷阱（Modified Hikkake Pattern）K线形态。

Parameters:

- `inPriceOHLC` ({@struct/Record Record}数组, required): K线数组，取开盘价、最高价、最低价、收盘价；Python中依次传入`records.Open`、`records.High`、`records.Low`、`records.Close`。

Returns (数值数组): 形态信号数组：看涨形态为正数、看跌形态为负数（通常为`100`或`-100`），未出现形态为`0`。

用最近的K线识别修正陷阱形态。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var ret = talib.CDLHIKKAKEMOD(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    if not records:
        return
    ret = talib.CDLHIKKAKEMOD(records.Open, records.High, records.Low, records.Close)
    Log(ret)
```

对应TA-Lib：`CDLHIKKAKEMOD(Records[Open,High,Low,Close]) = Array(outInteger)`。

See also: `talib.CDLHIKKAKE`, `talib.CDLHARAMI`, `talib.CDL3INSIDE`

##### talib.CDLHOMINGPIGEON

```
talib.CDLHOMINGPIGEON(inPriceOHLC)
```

识别家鸽（Homing Pigeon）K线形态。

Parameters:

- `inPriceOHLC` ({@struct/Record Record}数组, required): K线数组，取开盘价、最高价、最低价、收盘价；Python中依次传入`records.Open`、`records.High`、`records.Low`、`records.Close`。

Returns (数值数组): 形态信号数组：看涨形态为正数、看跌形态为负数（通常为`100`或`-100`），未出现形态为`0`。

用最近的K线识别家鸽形态。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var ret = talib.CDLHOMINGPIGEON(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    if not records:
        return
    ret = talib.CDLHOMINGPIGEON(records.Open, records.High, records.Low, records.Close)
    Log(ret)
```

对应TA-Lib：`CDLHOMINGPIGEON(Records[Open,High,Low,Close]) = Array(outInteger)`。

See also: `talib.CDLHARAMI`, `talib.CDL3INSIDE`, `talib.CDLMATCHINGLOW`

##### talib.CDLIDENTICAL3CROWS

```
talib.CDLIDENTICAL3CROWS(inPriceOHLC)
```

识别三胞胎乌鸦（Identical Three Crows）K线形态。

Parameters:

- `inPriceOHLC` ({@struct/Record Record}数组, required): K线数组，取开盘价、最高价、最低价、收盘价；Python中依次传入`records.Open`、`records.High`、`records.Low`、`records.Close`。

Returns (数值数组): 形态信号数组：看涨形态为正数、看跌形态为负数（通常为`100`或`-100`），未出现形态为`0`。

用最近的K线识别三胞胎乌鸦形态。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var ret = talib.CDLIDENTICAL3CROWS(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    if not records:
        return
    ret = talib.CDLIDENTICAL3CROWS(records.Open, records.High, records.Low, records.Close)
    Log(ret)
```

对应TA-Lib：`CDLIDENTICAL3CROWS(Records[Open,High,Low,Close]) = Array(outInteger)`。

See also: `talib.CDL3BLACKCROWS`, `talib.CDL2CROWS`, `talib.CDLUPSIDEGAP2CROWS`

##### talib.CDLINNECK

```
talib.CDLINNECK(inPriceOHLC)
```

识别颈内线（In-Neck Pattern）K线形态。

Parameters:

- `inPriceOHLC` ({@struct/Record Record}数组, required): K线数组，取开盘价、最高价、最低价、收盘价；Python中依次传入`records.Open`、`records.High`、`records.Low`、`records.Close`。

Returns (数值数组): 形态信号数组：看涨形态为正数、看跌形态为负数（通常为`100`或`-100`），未出现形态为`0`。

用最近的K线识别颈内线形态。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var ret = talib.CDLINNECK(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    if not records:
        return
    ret = talib.CDLINNECK(records.Open, records.High, records.Low, records.Close)
    Log(ret)
```

对应TA-Lib：`CDLINNECK(Records[Open,High,Low,Close]) = Array(outInteger)`。

See also: `talib.CDLONNECK`, `talib.CDLTHRUSTING`, `talib.CDLPIERCING`

##### talib.CDLINVERTEDHAMMER

```
talib.CDLINVERTEDHAMMER(inPriceOHLC)
```

识别倒锤头线（Inverted Hammer）K线形态。

Parameters:

- `inPriceOHLC` ({@struct/Record Record}数组, required): K线数组，取开盘价、最高价、最低价、收盘价；Python中依次传入`records.Open`、`records.High`、`records.Low`、`records.Close`。

Returns (数值数组): 形态信号数组：看涨形态为正数、看跌形态为负数（通常为`100`或`-100`），未出现形态为`0`。

用最近的K线识别倒锤头线形态。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var ret = talib.CDLINVERTEDHAMMER(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    if not records:
        return
    ret = talib.CDLINVERTEDHAMMER(records.Open, records.High, records.Low, records.Close)
    Log(ret)
```

对应TA-Lib：`CDLINVERTEDHAMMER(Records[Open,High,Low,Close]) = Array(outInteger)`。

See also: `talib.CDLHAMMER`, `talib.CDLSHOOTINGSTAR`, `talib.CDLGRAVESTONEDOJI`

##### talib.CDLKICKING

```
talib.CDLKICKING(inPriceOHLC)
```

识别反冲（Kicking）K线形态。

Parameters:

- `inPriceOHLC` ({@struct/Record Record}数组, required): K线数组，取开盘价、最高价、最低价、收盘价；Python中依次传入`records.Open`、`records.High`、`records.Low`、`records.Close`。

Returns (数值数组): 形态信号数组：看涨形态为正数、看跌形态为负数（通常为`100`或`-100`），未出现形态为`0`。

用最近的K线识别反冲形态。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var ret = talib.CDLKICKING(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    if not records:
        return
    ret = talib.CDLKICKING(records.Open, records.High, records.Low, records.Close)
    Log(ret)
```

对应TA-Lib：`CDLKICKING(Records[Open,High,Low,Close]) = Array(outInteger)`。

See also: `talib.CDLKICKINGBYLENGTH`, `talib.CDLMARUBOZU`, `talib.CDLSEPARATINGLINES`

##### talib.CDLKICKINGBYLENGTH

```
talib.CDLKICKINGBYLENGTH(inPriceOHLC)
```

识别按较长光头光脚线定方向的反冲（Kicking - bull/bear determined by the longer marubozu）K线形态。

Parameters:

- `inPriceOHLC` ({@struct/Record Record}数组, required): K线数组，取开盘价、最高价、最低价、收盘价；Python中依次传入`records.Open`、`records.High`、`records.Low`、`records.Close`。

Returns (数值数组): 形态信号数组：看涨形态为正数、看跌形态为负数（通常为`100`或`-100`），未出现形态为`0`。

用最近的K线识别按较长光头光脚线定方向的反冲形态。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var ret = talib.CDLKICKINGBYLENGTH(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    if not records:
        return
    ret = talib.CDLKICKINGBYLENGTH(records.Open, records.High, records.Low, records.Close)
    Log(ret)
```

对应TA-Lib：`CDLKICKINGBYLENGTH(Records[Open,High,Low,Close]) = Array(outInteger)`。

See also: `talib.CDLKICKING`, `talib.CDLMARUBOZU`, `talib.CDLLONGLINE`

##### talib.CDLLADDERBOTTOM

```
talib.CDLLADDERBOTTOM(inPriceOHLC)
```

识别梯底（Ladder Bottom）K线形态。

Parameters:

- `inPriceOHLC` ({@struct/Record Record}数组, required): K线数组，取开盘价、最高价、最低价、收盘价；Python中依次传入`records.Open`、`records.High`、`records.Low`、`records.Close`。

Returns (数值数组): 形态信号数组：看涨形态为正数、看跌形态为负数（通常为`100`或`-100`），未出现形态为`0`。

用最近的K线识别梯底形态。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var ret = talib.CDLLADDERBOTTOM(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    if not records:
        return
    ret = talib.CDLLADDERBOTTOM(records.Open, records.High, records.Low, records.Close)
    Log(ret)
```

对应TA-Lib：`CDLLADDERBOTTOM(Records[Open,High,Low,Close]) = Array(outInteger)`。

See also: `talib.CDL3STARSINSOUTH`, `talib.CDLMATCHINGLOW`, `talib.CDLHOMINGPIGEON`

##### talib.CDLLONGLEGGEDDOJI

```
talib.CDLLONGLEGGEDDOJI(inPriceOHLC)
```

识别长脚十字（Long Legged Doji）K线形态。

Parameters:

- `inPriceOHLC` ({@struct/Record Record}数组, required): K线数组，取开盘价、最高价、最低价、收盘价；Python中依次传入`records.Open`、`records.High`、`records.Low`、`records.Close`。

Returns (数值数组): 形态信号数组：看涨形态为正数、看跌形态为负数（通常为`100`或`-100`），未出现形态为`0`。

用最近的K线识别长脚十字形态。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var ret = talib.CDLLONGLEGGEDDOJI(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    if not records:
        return
    ret = talib.CDLLONGLEGGEDDOJI(records.Open, records.High, records.Low, records.Close)
    Log(ret)
```

对应TA-Lib：`CDLLONGLEGGEDDOJI(Records[Open,High,Low,Close]) = Array(outInteger)`。

See also: `talib.CDLDOJI`, `talib.CDLRICKSHAWMAN`, `talib.CDLHIGHWAVE`

##### talib.CDLLONGLINE

```
talib.CDLLONGLINE(inPriceOHLC)
```

识别长蜡烛线（Long Line Candle）K线形态。

Parameters:

- `inPriceOHLC` ({@struct/Record Record}数组, required): K线数组，取开盘价、最高价、最低价、收盘价；Python中依次传入`records.Open`、`records.High`、`records.Low`、`records.Close`。

Returns (数值数组): 形态信号数组：看涨形态为正数、看跌形态为负数（通常为`100`或`-100`），未出现形态为`0`。

用最近的K线识别长蜡烛线形态。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var ret = talib.CDLLONGLINE(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    if not records:
        return
    ret = talib.CDLLONGLINE(records.Open, records.High, records.Low, records.Close)
    Log(ret)
```

对应TA-Lib：`CDLLONGLINE(Records[Open,High,Low,Close]) = Array(outInteger)`。

See also: `talib.CDLSHORTLINE`, `talib.CDLMARUBOZU`, `talib.CDLBELTHOLD`

##### talib.CDLMARUBOZU

```
talib.CDLMARUBOZU(inPriceOHLC)
```

识别光头光脚线（Marubozu）K线形态。

Parameters:

- `inPriceOHLC` ({@struct/Record Record}数组, required): K线数组，取开盘价、最高价、最低价、收盘价；Python中依次传入`records.Open`、`records.High`、`records.Low`、`records.Close`。

Returns (数值数组): 形态信号数组：看涨形态为正数、看跌形态为负数（通常为`100`或`-100`），未出现形态为`0`。

用最近的K线识别光头光脚线形态。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var ret = talib.CDLMARUBOZU(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    if not records:
        return
    ret = talib.CDLMARUBOZU(records.Open, records.High, records.Low, records.Close)
    Log(ret)
```

对应TA-Lib：`CDLMARUBOZU(Records[Open,High,Low,Close]) = Array(outInteger)`。

See also: `talib.CDLCLOSINGMARUBOZU`, `talib.CDLBELTHOLD`, `talib.CDLKICKING`, `talib.CDLLONGLINE`

##### talib.CDLMATCHINGLOW

```
talib.CDLMATCHINGLOW(inPriceOHLC)
```

识别相同低价（Matching Low）K线形态。

Parameters:

- `inPriceOHLC` ({@struct/Record Record}数组, required): K线数组，取开盘价、最高价、最低价、收盘价；Python中依次传入`records.Open`、`records.High`、`records.Low`、`records.Close`。

Returns (数值数组): 形态信号数组：看涨形态为正数、看跌形态为负数（通常为`100`或`-100`），未出现形态为`0`。

用最近的K线识别相同低价形态。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var ret = talib.CDLMATCHINGLOW(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    if not records:
        return
    ret = talib.CDLMATCHINGLOW(records.Open, records.High, records.Low, records.Close)
    Log(ret)
```

对应TA-Lib：`CDLMATCHINGLOW(Records[Open,High,Low,Close]) = Array(outInteger)`。

See also: `talib.CDLHOMINGPIGEON`, `talib.CDLSTICKSANDWICH`, `talib.CDLCOUNTERATTACK`

##### talib.CDLMATHOLD

```
talib.CDLMATHOLD(inPriceOHLC)
talib.CDLMATHOLD(inPriceOHLC, optInPenetration)
```

识别铺垫（Mat Hold）K线形态。

Parameters:

- `inPriceOHLC` ({@struct/Record Record}数组, required): K线数组，取开盘价、最高价、最低价、收盘价；Python中依次传入`records.Open`、`records.High`、`records.Low`、`records.Close`。
- `optInPenetration` (number, optional): 穿透比例（Penetration），即一根K线实体穿入另一根K线实体的比例（非负数）。默认 `0.5`。

Returns (数值数组): 形态信号数组：看涨形态为正数、看跌形态为负数（通常为`100`或`-100`），未出现形态为`0`。

用最近的K线识别铺垫形态。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var ret = talib.CDLMATHOLD(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    if not records:
        return
    ret = talib.CDLMATHOLD(records.Open, records.High, records.Low, records.Close)
    Log(ret)
```

对应TA-Lib：`CDLMATHOLD(Records[Open,High,Low,Close],Penetration = 0.5) = Array(outInteger)`。

See also: `talib.CDLRISEFALL3METHODS`, `talib.CDLXSIDEGAP3METHODS`, `talib.CDLTASUKIGAP`

##### talib.CDLMORNINGDOJISTAR

```
talib.CDLMORNINGDOJISTAR(inPriceOHLC)
talib.CDLMORNINGDOJISTAR(inPriceOHLC, optInPenetration)
```

识别十字晨星（Morning Doji Star）K线形态。

Parameters:

- `inPriceOHLC` ({@struct/Record Record}数组, required): K线数组，取开盘价、最高价、最低价、收盘价；Python中依次传入`records.Open`、`records.High`、`records.Low`、`records.Close`。
- `optInPenetration` (number, optional): 穿透比例（Penetration），即一根K线实体穿入另一根K线实体的比例（非负数）。默认 `0.3`。

Returns (数值数组): 形态信号数组：看涨形态为正数、看跌形态为负数（通常为`100`或`-100`），未出现形态为`0`。

用最近的K线识别十字晨星形态。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var ret = talib.CDLMORNINGDOJISTAR(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    if not records:
        return
    ret = talib.CDLMORNINGDOJISTAR(records.Open, records.High, records.Low, records.Close)
    Log(ret)
```

对应TA-Lib：`CDLMORNINGDOJISTAR(Records[Open,High,Low,Close],Penetration = 0.3) = Array(outInteger)`。

See also: `talib.CDLMORNINGSTAR`, `talib.CDLEVENINGDOJISTAR`, `talib.CDLABANDONEDBABY`, `talib.CDLDOJISTAR`

##### talib.CDLMORNINGSTAR

```
talib.CDLMORNINGSTAR(inPriceOHLC)
talib.CDLMORNINGSTAR(inPriceOHLC, optInPenetration)
```

识别晨星（Morning Star）K线形态。

Parameters:

- `inPriceOHLC` ({@struct/Record Record}数组, required): K线数组，取开盘价、最高价、最低价、收盘价；Python中依次传入`records.Open`、`records.High`、`records.Low`、`records.Close`。
- `optInPenetration` (number, optional): 穿透比例（Penetration），即一根K线实体穿入另一根K线实体的比例（非负数）。默认 `0.3`。

Returns (数值数组): 形态信号数组：看涨形态为正数、看跌形态为负数（通常为`100`或`-100`），未出现形态为`0`。

用最近的K线识别晨星形态。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var ret = talib.CDLMORNINGSTAR(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    if not records:
        return
    ret = talib.CDLMORNINGSTAR(records.Open, records.High, records.Low, records.Close)
    Log(ret)
```

对应TA-Lib：`CDLMORNINGSTAR(Records[Open,High,Low,Close],Penetration=0.3) = Array(outInteger)`。

See also: `talib.CDLMORNINGDOJISTAR`, `talib.CDLEVENINGSTAR`, `talib.CDL3STARSINSOUTH`

##### talib.CDLONNECK

```
talib.CDLONNECK(inPriceOHLC)
```

识别颈上线（On-Neck Pattern）K线形态。

Parameters:

- `inPriceOHLC` ({@struct/Record Record}数组, required): K线数组，取开盘价、最高价、最低价、收盘价；Python中依次传入`records.Open`、`records.High`、`records.Low`、`records.Close`。

Returns (数值数组): 形态信号数组：看涨形态为正数、看跌形态为负数（通常为`100`或`-100`），未出现形态为`0`。

用最近的K线识别颈上线形态。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var ret = talib.CDLONNECK(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    if not records:
        return
    ret = talib.CDLONNECK(records.Open, records.High, records.Low, records.Close)
    Log(ret)
```

对应TA-Lib：`CDLONNECK(Records[Open,High,Low,Close]) = Array(outInteger)`。

See also: `talib.CDLINNECK`, `talib.CDLTHRUSTING`, `talib.CDLPIERCING`

##### talib.CDLPIERCING

```
talib.CDLPIERCING(inPriceOHLC)
```

识别刺透（Piercing Pattern）K线形态。

Parameters:

- `inPriceOHLC` ({@struct/Record Record}数组, required): K线数组，取开盘价、最高价、最低价、收盘价；Python中依次传入`records.Open`、`records.High`、`records.Low`、`records.Close`。

Returns (数值数组): 形态信号数组：看涨形态为正数、看跌形态为负数（通常为`100`或`-100`），未出现形态为`0`。

用最近的K线识别刺透形态。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var ret = talib.CDLPIERCING(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    if not records:
        return
    ret = talib.CDLPIERCING(records.Open, records.High, records.Low, records.Close)
    Log(ret)
```

对应TA-Lib：`CDLPIERCING(Records[Open,High,Low,Close]) = Array(outInteger)`。

See also: `talib.CDLDARKCLOUDCOVER`, `talib.CDLENGULFING`, `talib.CDLTHRUSTING`, `talib.CDLINNECK`

##### talib.CDLRICKSHAWMAN

```
talib.CDLRICKSHAWMAN(inPriceOHLC)
```

识别黄包车夫（Rickshaw Man）K线形态。

Parameters:

- `inPriceOHLC` ({@struct/Record Record}数组, required): K线数组，取开盘价、最高价、最低价、收盘价；Python中依次传入`records.Open`、`records.High`、`records.Low`、`records.Close`。

Returns (数值数组): 形态信号数组：看涨形态为正数、看跌形态为负数（通常为`100`或`-100`），未出现形态为`0`。

用最近的K线识别黄包车夫形态。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var ret = talib.CDLRICKSHAWMAN(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    if not records:
        return
    ret = talib.CDLRICKSHAWMAN(records.Open, records.High, records.Low, records.Close)
    Log(ret)
```

对应TA-Lib：`CDLRICKSHAWMAN(Records[Open,High,Low,Close]) = Array(outInteger)`。

See also: `talib.CDLLONGLEGGEDDOJI`, `talib.CDLDOJI`, `talib.CDLHIGHWAVE`

##### talib.CDLRISEFALL3METHODS

```
talib.CDLRISEFALL3METHODS(inPriceOHLC)
```

识别上升/下降三法（Rising/Falling Three Methods）K线形态。

Parameters:

- `inPriceOHLC` ({@struct/Record Record}数组, required): K线数组，取开盘价、最高价、最低价、收盘价；Python中依次传入`records.Open`、`records.High`、`records.Low`、`records.Close`。

Returns (数值数组): 形态信号数组：看涨形态为正数、看跌形态为负数（通常为`100`或`-100`），未出现形态为`0`。

用最近的K线识别上升/下降三法形态。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var ret = talib.CDLRISEFALL3METHODS(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    if not records:
        return
    ret = talib.CDLRISEFALL3METHODS(records.Open, records.High, records.Low, records.Close)
    Log(ret)
```

对应TA-Lib：`CDLRISEFALL3METHODS(Records[Open,High,Low,Close]) = Array(outInteger)`。

See also: `talib.CDLMATHOLD`, `talib.CDLXSIDEGAP3METHODS`, `talib.CDL3LINESTRIKE`

##### talib.CDLSEPARATINGLINES

```
talib.CDLSEPARATINGLINES(inPriceOHLC)
```

识别分离线（Separating Lines）K线形态。

Parameters:

- `inPriceOHLC` ({@struct/Record Record}数组, required): K线数组，取开盘价、最高价、最低价、收盘价；Python中依次传入`records.Open`、`records.High`、`records.Low`、`records.Close`。

Returns (数值数组): 形态信号数组：看涨形态为正数、看跌形态为负数（通常为`100`或`-100`），未出现形态为`0`。

用最近的K线识别分离线形态。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var ret = talib.CDLSEPARATINGLINES(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    if not records:
        return
    ret = talib.CDLSEPARATINGLINES(records.Open, records.High, records.Low, records.Close)
    Log(ret)
```

对应TA-Lib：`CDLSEPARATINGLINES(Records[Open,High,Low,Close]) = Array(outInteger)`。

See also: `talib.CDLKICKING`, `talib.CDLBELTHOLD`, `talib.CDLGAPSIDESIDEWHITE`

##### talib.CDLSHOOTINGSTAR

```
talib.CDLSHOOTINGSTAR(inPriceOHLC)
```

识别射击之星（Shooting Star）K线形态。

Parameters:

- `inPriceOHLC` ({@struct/Record Record}数组, required): K线数组，取开盘价、最高价、最低价、收盘价；Python中依次传入`records.Open`、`records.High`、`records.Low`、`records.Close`。

Returns (数值数组): 形态信号数组：看涨形态为正数、看跌形态为负数（通常为`100`或`-100`），未出现形态为`0`。

用最近的K线识别射击之星形态。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var ret = talib.CDLSHOOTINGSTAR(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    if not records:
        return
    ret = talib.CDLSHOOTINGSTAR(records.Open, records.High, records.Low, records.Close)
    Log(ret)
```

对应TA-Lib：`CDLSHOOTINGSTAR(Records[Open,High,Low,Close]) = Array(outInteger)`。

See also: `talib.CDLINVERTEDHAMMER`, `talib.CDLHANGINGMAN`, `talib.CDLGRAVESTONEDOJI`, `talib.CDLEVENINGSTAR`

##### talib.CDLSHORTLINE

```
talib.CDLSHORTLINE(inPriceOHLC)
```

识别短蜡烛线（Short Line Candle）K线形态。

Parameters:

- `inPriceOHLC` ({@struct/Record Record}数组, required): K线数组，取开盘价、最高价、最低价、收盘价；Python中依次传入`records.Open`、`records.High`、`records.Low`、`records.Close`。

Returns (数值数组): 形态信号数组：看涨形态为正数、看跌形态为负数（通常为`100`或`-100`），未出现形态为`0`。

用最近的K线识别短蜡烛线形态。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var ret = talib.CDLSHORTLINE(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    if not records:
        return
    ret = talib.CDLSHORTLINE(records.Open, records.High, records.Low, records.Close)
    Log(ret)
```

对应TA-Lib：`CDLSHORTLINE(Records[Open,High,Low,Close]) = Array(outInteger)`。

See also: `talib.CDLLONGLINE`, `talib.CDLSPINNINGTOP`, `talib.CDLDOJI`

##### talib.CDLSPINNINGTOP

```
talib.CDLSPINNINGTOP(inPriceOHLC)
```

识别纺锤线（Spinning Top）K线形态。

Parameters:

- `inPriceOHLC` ({@struct/Record Record}数组, required): K线数组，取开盘价、最高价、最低价、收盘价；Python中依次传入`records.Open`、`records.High`、`records.Low`、`records.Close`。

Returns (数值数组): 形态信号数组：看涨形态为正数、看跌形态为负数（通常为`100`或`-100`），未出现形态为`0`。

用最近的K线识别纺锤线形态。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var ret = talib.CDLSPINNINGTOP(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    if not records:
        return
    ret = talib.CDLSPINNINGTOP(records.Open, records.High, records.Low, records.Close)
    Log(ret)
```

对应TA-Lib：`CDLSPINNINGTOP(Records[Open,High,Low,Close]) = Array(outInteger)`。

See also: `talib.CDLHIGHWAVE`, `talib.CDLDOJI`, `talib.CDLSHORTLINE`

##### talib.CDLSTALLEDPATTERN

```
talib.CDLSTALLEDPATTERN(inPriceOHLC)
```

识别停顿（Stalled Pattern）K线形态。

Parameters:

- `inPriceOHLC` ({@struct/Record Record}数组, required): K线数组，取开盘价、最高价、最低价、收盘价；Python中依次传入`records.Open`、`records.High`、`records.Low`、`records.Close`。

Returns (数值数组): 形态信号数组：看涨形态为正数、看跌形态为负数（通常为`100`或`-100`），未出现形态为`0`。

用最近的K线识别停顿形态。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var ret = talib.CDLSTALLEDPATTERN(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    if not records:
        return
    ret = talib.CDLSTALLEDPATTERN(records.Open, records.High, records.Low, records.Close)
    Log(ret)
```

对应TA-Lib：`CDLSTALLEDPATTERN(Records[Open,High,Low,Close]) = Array(outInteger)`。

See also: `talib.CDLADVANCEBLOCK`, `talib.CDL3WHITESOLDIERS`, `talib.CDLSPINNINGTOP`

##### talib.CDLSTICKSANDWICH

```
talib.CDLSTICKSANDWICH(inPriceOHLC)
```

识别条形三明治（Stick Sandwich）K线形态。

Parameters:

- `inPriceOHLC` ({@struct/Record Record}数组, required): K线数组，取开盘价、最高价、最低价、收盘价；Python中依次传入`records.Open`、`records.High`、`records.Low`、`records.Close`。

Returns (数值数组): 形态信号数组：看涨形态为正数、看跌形态为负数（通常为`100`或`-100`），未出现形态为`0`。

用最近的K线识别条形三明治形态。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var ret = talib.CDLSTICKSANDWICH(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    if not records:
        return
    ret = talib.CDLSTICKSANDWICH(records.Open, records.High, records.Low, records.Close)
    Log(ret)
```

对应TA-Lib：`CDLSTICKSANDWICH(Records[Open,High,Low,Close]) = Array(outInteger)`。

See also: `talib.CDLMATCHINGLOW`, `talib.CDLHOMINGPIGEON`, `talib.CDLLADDERBOTTOM`

##### talib.CDLTAKURI

```
talib.CDLTAKURI(inPriceOHLC)
```

识别探水竿（Takuri (Dragonfly Doji with very long lower shadow)）K线形态。

Parameters:

- `inPriceOHLC` ({@struct/Record Record}数组, required): K线数组，取开盘价、最高价、最低价、收盘价；Python中依次传入`records.Open`、`records.High`、`records.Low`、`records.Close`。

Returns (数值数组): 形态信号数组：看涨形态为正数、看跌形态为负数（通常为`100`或`-100`），未出现形态为`0`。

用最近的K线识别探水竿形态。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var ret = talib.CDLTAKURI(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    if not records:
        return
    ret = talib.CDLTAKURI(records.Open, records.High, records.Low, records.Close)
    Log(ret)
```

对应TA-Lib：`CDLTAKURI(Records[Open,High,Low,Close]) = Array(outInteger)`。

See also: `talib.CDLDRAGONFLYDOJI`, `talib.CDLHAMMER`, `talib.CDLDOJI`

##### talib.CDLTASUKIGAP

```
talib.CDLTASUKIGAP(inPriceOHLC)
```

识别跳空并列阴阳线（Tasuki Gap）K线形态。

Parameters:

- `inPriceOHLC` ({@struct/Record Record}数组, required): K线数组，取开盘价、最高价、最低价、收盘价；Python中依次传入`records.Open`、`records.High`、`records.Low`、`records.Close`。

Returns (数值数组): 形态信号数组：看涨形态为正数、看跌形态为负数（通常为`100`或`-100`），未出现形态为`0`。

用最近的K线识别跳空并列阴阳线形态。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var ret = talib.CDLTASUKIGAP(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    if not records:
        return
    ret = talib.CDLTASUKIGAP(records.Open, records.High, records.Low, records.Close)
    Log(ret)
```

对应TA-Lib：`CDLTASUKIGAP(Records[Open,High,Low,Close]) = Array(outInteger)`。

See also: `talib.CDLGAPSIDESIDEWHITE`, `talib.CDLXSIDEGAP3METHODS`, `talib.CDLMATHOLD`

##### talib.CDLTHRUSTING

```
talib.CDLTHRUSTING(inPriceOHLC)
```

识别插入线（Thrusting Pattern）K线形态。

Parameters:

- `inPriceOHLC` ({@struct/Record Record}数组, required): K线数组，取开盘价、最高价、最低价、收盘价；Python中依次传入`records.Open`、`records.High`、`records.Low`、`records.Close`。

Returns (数值数组): 形态信号数组：看涨形态为正数、看跌形态为负数（通常为`100`或`-100`），未出现形态为`0`。

用最近的K线识别插入线形态。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var ret = talib.CDLTHRUSTING(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    if not records:
        return
    ret = talib.CDLTHRUSTING(records.Open, records.High, records.Low, records.Close)
    Log(ret)
```

对应TA-Lib：`CDLTHRUSTING(Records[Open,High,Low,Close]) = Array(outInteger)`。

See also: `talib.CDLINNECK`, `talib.CDLONNECK`, `talib.CDLPIERCING`

##### talib.CDLTRISTAR

```
talib.CDLTRISTAR(inPriceOHLC)
```

识别三星（Tristar Pattern）K线形态。

Parameters:

- `inPriceOHLC` ({@struct/Record Record}数组, required): K线数组，取开盘价、最高价、最低价、收盘价；Python中依次传入`records.Open`、`records.High`、`records.Low`、`records.Close`。

Returns (数值数组): 形态信号数组：看涨形态为正数、看跌形态为负数（通常为`100`或`-100`），未出现形态为`0`。

用最近的K线识别三星形态。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var ret = talib.CDLTRISTAR(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    if not records:
        return
    ret = talib.CDLTRISTAR(records.Open, records.High, records.Low, records.Close)
    Log(ret)
```

对应TA-Lib：`CDLTRISTAR(Records[Open,High,Low,Close]) = Array(outInteger)`。

See also: `talib.CDLDOJI`, `talib.CDLDOJISTAR`, `talib.CDLMORNINGDOJISTAR`, `talib.CDLEVENINGDOJISTAR`

##### talib.CDLUNIQUE3RIVER

```
talib.CDLUNIQUE3RIVER(inPriceOHLC)
```

识别奇特三河床（Unique 3 River）K线形态。

Parameters:

- `inPriceOHLC` ({@struct/Record Record}数组, required): K线数组，取开盘价、最高价、最低价、收盘价；Python中依次传入`records.Open`、`records.High`、`records.Low`、`records.Close`。

Returns (数值数组): 形态信号数组：看涨形态为正数、看跌形态为负数（通常为`100`或`-100`），未出现形态为`0`。

用最近的K线识别奇特三河床形态。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var ret = talib.CDLUNIQUE3RIVER(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    if not records:
        return
    ret = talib.CDLUNIQUE3RIVER(records.Open, records.High, records.Low, records.Close)
    Log(ret)
```

对应TA-Lib：`CDLUNIQUE3RIVER(Records[Open,High,Low,Close]) = Array(outInteger)`。

See also: `talib.CDLMORNINGSTAR`, `talib.CDL3STARSINSOUTH`, `talib.CDLHAMMER`

##### talib.CDLUPSIDEGAP2CROWS

```
talib.CDLUPSIDEGAP2CROWS(inPriceOHLC)
```

识别向上跳空的两只乌鸦（Upside Gap Two Crows）K线形态。

Parameters:

- `inPriceOHLC` ({@struct/Record Record}数组, required): K线数组，取开盘价、最高价、最低价、收盘价；Python中依次传入`records.Open`、`records.High`、`records.Low`、`records.Close`。

Returns (数值数组): 形态信号数组：看涨形态为正数、看跌形态为负数（通常为`100`或`-100`），未出现形态为`0`。

用最近的K线识别向上跳空的两只乌鸦形态。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var ret = talib.CDLUPSIDEGAP2CROWS(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    if not records:
        return
    ret = talib.CDLUPSIDEGAP2CROWS(records.Open, records.High, records.Low, records.Close)
    Log(ret)
```

对应TA-Lib：`CDLUPSIDEGAP2CROWS(Records[Open,High,Low,Close]) = Array(outInteger)`。

See also: `talib.CDL2CROWS`, `talib.CDL3BLACKCROWS`, `talib.CDLEVENINGSTAR`

##### talib.CDLXSIDEGAP3METHODS

```
talib.CDLXSIDEGAP3METHODS(inPriceOHLC)
```

识别上升/下降跳空三法（Upside/Downside Gap Three Methods）K线形态。

Parameters:

- `inPriceOHLC` ({@struct/Record Record}数组, required): K线数组，取开盘价、最高价、最低价、收盘价；Python中依次传入`records.Open`、`records.High`、`records.Low`、`records.Close`。

Returns (数值数组): 形态信号数组：看涨形态为正数、看跌形态为负数（通常为`100`或`-100`），未出现形态为`0`。

用最近的K线识别上升/下降跳空三法形态。

```javascript
function main() {
    var records = exchange.GetRecords()
    if (!records) return
    var ret = talib.CDLXSIDEGAP3METHODS(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    if not records:
        return
    ret = talib.CDLXSIDEGAP3METHODS(records.Open, records.High, records.Low, records.Close)
    Log(ret)
```

对应TA-Lib：`CDLXSIDEGAP3METHODS(Records[Open,High,Low,Close]) = Array(outInteger)`。

See also: `talib.CDLTASUKIGAP`, `talib.CDLRISEFALL3METHODS`, `talib.CDLGAPSIDESIDEWHITE`

### OS

发明者量化交易平台支持文件读写操作，os库提供了完整的文件系统操作接口，帮助用户在策略开发中进行数据持久化、配置管理和日志记录等操作。
需要注意，该功能仅支持```JavaScript```语言策略。

os库支持：文件对象、文件列表对象、文件信息对象。
| 对象 | 说明 | 备注 |
| - | - | - |
| 文件对象：File | 提供文件读写、定位等操作。 | 通过```os.open()```获取，使用完毕需调用```close()```释放资源。 |
| 文件列表对象：ListFilesResult | 用于记录目录列表信息。 | 支持通配符匹配模式，由```os.listFiles()```函数返回。 |
| 文件信息对象：FileStat | 文件统计信息。 | 由```os.stat()```函数返回。 |

支持实盘、回测系统。
- 实盘环境：
  每个实盘有独立的文件目录：托管者目录下实盘数据库文件同级目录的```files```文件夹，即```logs/storage/xxx/files```（相对托管者目录），其中```xxx```为实盘Id，托管者程序（robot）与```logs```在同一级目录。不同实盘的文件互不影响。
- 回测系统环境：
  回测系统是一个沙盒环境，系统模拟一个文件目录，默认目录为：```/logs/storage/1/files```。
  当回测结束时，创建的文件内容将被清除。

#### os

为策略提供完整的文件系统操作接口。

##### os.open

```
open(filename)
open(filename, mode)
```

以指定模式打开文件。

Parameters:

- `filename` (string, required): 文件名称。参数```filename```是包含文件名的路径。由于托管者与回测系统都支持```os```操作，需要注意在**非回测环境**下，文件操作被限制在托管者目录下实盘数据库文件同级目录的```files```文件夹中，因此不支持使用绝对路径操作任何文件（路径开头的```/```会被忽略，路径中不能包含```..```）。其它```os```函数的路径参数遵循同样的限制，见`OS`。
- `mode` (string, optional): 指定文件的打开模式。

Returns (`File`对象): ```File```对象，用于操作文件。打开失败（如只读模式下文件不存在、模式串非法）时抛出异常。

创建文件，写入数据后再读取。

```javascript
function main() {
    let fileHandle = os.open("output.txt", "w+")
    let bytesWritten = fileHandle.write("Hello FMZ!")
    Log("Bytes written:", bytesWritten)
    // 输出：Bytes written: 10
    fileHandle.seek(0, 0)
    let fileContent = fileHandle.read()
    Log("File content read:", fileContent)
    // 输出：File content read: Hello FMZ!
    fileHandle.close()
}
```

文件打开模式：

  - ```r``` : read（只读，文件必须存在）

  - ```w``` : write（只写，文件不存在则创建，存在则清空内容）

  - ```a``` : append（追加写入，文件不存在则创建，存在则写入到末尾）

  - ```+``` : 在 r/w/a 后加 + 表示既可以读也可以写（例如 "r+", "w+", "a+"），文件不存在时会创建（"r+" 也是）

  - ```b``` : binary（二进制模式，例如 "rb", "rb+"：```read()```返回```ArrayBuffer```而不是字符串）

模式字符可以任意组合（如 "rb+"、"wb"），出现其它字符会抛出异常。

文件的打开/创建位于实盘数据库文件目录（xxx.db3，其中xxx为实盘Id）下的```files```文件夹中。以写入方式（```w```、```a```、```+```）打开时，路径中不存在的父目录会自动创建。

See also: `os`, `File`, `os.fgets`, `os.fputs`, `os.exists`

##### os.fgets

```
fgets(filename)
```

一次性读取整个文件的内容。

Parameters:

- `filename` (string, required): 文件路径，包含要读取的文件名。

Returns (string): 返回文件的完整内容。

读取配置文件的内容。

```javascript
function main() {
    // 先创建、写入文件
    // let fileHandle = os.open("config.json", "w+")
    // let objJson = {"name": "tom", "age": 18}
    // fileHandle.write(JSON.stringify(objJson))
    // fileHandle.close()

    let content = os.fgets("config.json")
    Log("Config content:", content)
    // 输出：Config content: {"name":"tom","age":18}
}
```

适用于小文件的快速读取，将整个文件内容一次性加载到内存中。

如果文件不存在，```fgets()```函数会抛出异常。

See also: `os`, `os.open`, `os.fputs`, `os.mmap`

##### os.fputs

```
fputs(filename, content)
fputs(filename, content, append)
```

向文件写入内容。

Parameters:

- `filename` (string, required): 文件路径。
- `content` (string, required): 要写入的内容。
- `append` (bool, optional): 是否以追加模式写入，默认为 false（覆盖模式）。

Returns (number): 返回实际写入的字节数。

保存策略配置到文件。

```javascript
function main() {
    let config = '{"strategy": "MA", "period": 20}'
    let bytesWritten = os.fputs("strategy_config.json", config)
    Log("Bytes written:", bytesWritten)
    // 输出：Bytes written: 32
    Log(`os.fgets("strategy_config.json"):`, os.fgets("strategy_config.json"))
    // 输出：os.fgets("strategy_config.json"): {"strategy": "MA", "period": 20}

    // 追加日志信息
    let logInfo = "\n[" + new Date().toISOString() + "] Config saved"
    os.fputs("strategy_config.json", logInfo, true)
    Log(`os.fgets("strategy_config.json"):`, os.fgets("strategy_config.json"))
    // 输出：os.fgets("strategy_config.json"): {"strategy": "MA", "period": 20}
    // [2025-09-08T07:20:30.563Z] Config saved
}
```

便捷的文件写入方法，默认覆盖文件内容。设置 append 为 true 可以追加到文件末尾。

See also: `os`, `os.fgets`, `os.open`

##### os.mmap

```
mmap(filename)
```

读取整个文件，以 ArrayBuffer 返回文件的二进制数据。

Parameters:

- `filename` (string, required): 文件路径。

Returns (ArrayBuffer): 返回文件内容的二进制数据。

映射文件的二进制数据。

```javascript
function ab2str(buf) {
    let arr = new Uint8Array(buf)
    return String.fromCharCode.apply(null, arr)
}

function main() {
    let buffer = os.mmap("strategyConfig/testData.txt")
    Log("File size in bytes:", buffer.byteLength)
    let arr = Array.from(new Uint8Array(buffer))
    Log("arr:",  arr)
    // 输出：arr: [72,101,108,108,111,32,70,77,90,33]
    Log("ab2str(buffer):", ab2str(buffer))
    // 输出：ab2str(buffer): Hello FMZ!
}
```

一次性将整个文件读入内存并作为 ArrayBuffer 返回（并非按需加载的内存映射，大文件会占用等量内存）。

See also: `os`, `os.fgets`, `os.open`

##### os.getRootDir

```
getRootDir()
```

获取文件操作的根目录路径。

Returns (string): 返回根目录的路径。

获取并显示根目录路径。

```javascript
function main() {
    let rootDir = os.getRootDir()
    Log("Root directory:", rootDir)
}
```

See also: `os`, `os.listFiles`, `os.mkdir`

##### os.listFiles

```
listFiles()
listFiles(pattern)
```

列出目录中的文件和子目录。

Parameters:

- `pattern` (string, optional): 可选的匹配模式，支持通配符（如*.txt, data_*.json），可以指定目录。

Returns (`ListFilesResult`对象): `ListFilesResult`对象：```files```为匹配到的文件名数组，```dirs```为当前目录下的子目录数组。

列出搜索的文件和目录。

```javascript
function main() {
    // 列出所有json文件
    let result = os.listFiles("*.json")
    Log("result:", result)

    // 列出所有内容
    let allFiles = os.listFiles()
    Log("allFiles:", allFiles)
}
```

不指定```pattern```参数时列出文件根目录（即`getRootDir`返回的目录）下所有文件和子目录。```pattern```为目录路径时列出该目录；通配符（```*```、```?```）只能用在最后一级，例如```data/*.json```，此时返回的名称带目录前缀（如```data/a.json```）。

See also: `os`, `ListFilesResult`, `os.getRootDir`, `os.stat`

##### os.exists

```
exists(filename)
```

检查指定的文件或目录是否存在。

Parameters:

- `filename` (string, required): 要检查的文件或目录路径。

Returns (bool): 如果文件或目录存在则返回 true，否则返回 false。

检查文件或路径是否存在。

```javascript
function main() {
    Log(`os.exists("./strategyConfig"):`, os.exists("./strategyConfig"))
    // 输出：os.exists("./strategyConfig"): true
    Log(`os.exists("./strategyConfig/testData.txt"):`, os.exists("./strategyConfig/testData.txt"))
    // 输出：os.exists("./strategyConfig/testData.txt"): true
    // Log(`os.exists("../strategyConfig"):`, os.exists("../strategyConfig"))   // 路径中含 ".." 会抛出异常：
    // invalid path: path traversal not allowed
    Log(`os.exists("test_1.txt"):`, os.exists("test_1.txt"))
    // 输出：os.exists("test_1.txt"): true
    Log(`os.exists("test_2.txt"):`, os.exists("test_2.txt"))
    // 输出：os.exists("test_2.txt"): false
}
```

See also: `os`, `os.stat`, `os.open`

##### os.remove

```
remove(filename)
```

删除指定文件或空目录。

Parameters:

- `filename` (string, required): 要删除的文件路径。

Returns (bool): 删除成功返回true；失败时抛出异常（可用try...catch捕获）。

删除文件示例。

```javascript
function main() {
    let tempFile = "test_1.txt"
    if (os.exists(tempFile)) {
        let success = os.remove(tempFile)
        Log("Temp file deleted:", success)
    }
}
```

此函数可以删除文件或空目录。如需删除非空目录，请使用```rmdir()```函数。

See also: `os`, `os.exists`, `os.rmdir`, `os.rename`

##### os.mkdir

```
mkdir(dirname)
```

创建目录。

Parameters:

- `dirname` (string, required): 要创建的目录路径。

Returns (bool): 创建成功返回 true；失败时抛出异常（可用 try...catch 捕获）。

创建数据存储目录，创建文件并写入数据。

```javascript
function main() {
    let success = os.mkdir("data/backtest/results")
    Log("Directory created:", success)

    if (success) {
        os.fputs("data/backtest/results/summary.txt", "Backtest completed")
    }
}
```

支持递归创建多级目录。如果父目录不存在，将自动创建。

See also: `os`, `os.rmdir`, `os.getRootDir`

##### os.rmdir

```
rmdir(dirname)
```

删除目录及其所有内容。

Parameters:

- `dirname` (string, required): 要删除的目录路径。

Returns (bool): 删除成功返回 true；失败时抛出异常（可用 try...catch 捕获）。

删除目录及其所有内容。

```javascript
function main() {
    let tempDir = "data"
    if (os.exists(tempDir)) {
        let success = os.rmdir(tempDir)
        Log("directory removed:", success)
    }
}
```

此操作将永久删除目录及其所有内容，请谨慎使用。

See also: `os`, `os.mkdir`, `os.remove`

##### os.rename

```
rename(oldName, newName)
```

重命名文件或移动文件。

Parameters:

- `oldName` (string, required): 原文件的名称或路径。
- `newName` (string, required): 新文件的名称或路径。

Returns (bool): 操作成功时返回 true；失败时抛出异常（可用 try...catch 捕获）。

重命名文件并将其移动到其他目录。

```javascript
function main() {
    let oldFileName = "output.txt"
    let newFileName = "outputFiles/" + new Date().getTime() + "output.txt"
    // let retRename = os.rename(oldFileName, newFileName)
    // Log("retRename:", retRename)  // 目标目录 outputFiles 不存在，rename 抛出异常

    os.mkdir("outputFiles")
    let retRename = os.rename(oldFileName, newFileName)
    Log("retRename:", retRename)
    // 输出：retRename: true
}
```

该函数可用于重命名文件，或将文件移动到其他目录。如果新路径所在的目录不存在，操作将会失败。

See also: `os`, `os.remove`, `os.exists`

##### os.stat

```
stat(filename)
```

获取文件的详细统计信息。

Parameters:

- `filename` (string, required): 文件路径。

Returns (`FileStat`对象): 返回包含文件统计信息的对象。

获取文件信息并检查文件大小。

```javascript
function main() {
    if (os.exists("strategyConfig/testData.txt")) {
        let stat = os.stat("strategyConfig/testData.txt")
        Log("stat:", stat)
        // 输出：stat: {"size":10,"mode":420,"mtime":1757312981796,"atime":1757312981796,"ctime":1757312981796}
    }
}
```

返回的```FileStat```对象包含以下字段：

- size: 文件大小。

- mode: 文件模式数值，低 9 位为权限位（普通 0644 文件为 420），目录等特殊文件另带类型标志位。

- mtime: 最后修改时间，毫秒时间戳。

- atime: 当前与 mtime 相同。

- ctime: 当前与 mtime 相同。

See also: `os`, `FileStat`, `os.exists`

##### os.exit

```
exit()
exit(status)
```

退出程序。

Parameters:

- `status` (number, optional): 可选的退出状态码，默认值为 0。

检查条件后退出程序。

```javascript
function main() {
    if (!os.exists("required_config.json")) {
        Log("Required configuration file not found!")
        os.exit(1)  // 异常退出
    }
    Log("Configuration found, continuing...")
    // 正常的策略逻辑...
}
```

立即终止策略进程，不会执行```onexit()```等收尾函数。状态码 0 表示正常结束（实盘状态显示为已完成），非零值表示异常退出（实盘状态显示为错误）。

See also: `os`, `os.getRootDir`

#### File

文件对象，提供文件读写、定位等操作。

##### File.close

```
close()
```

关闭文件并释放相关资源。

正确的文件操作流程示例。

```javascript
function main() {
    let file = os.open("data.txt", "w")
    file.write("Hello FMZ!")
    file.close()  // 必须关闭文件
}
```

使用完文件对象后必须调用此方法以释放系统资源。

See also: `File`, `os.open`, `File.flush`

##### File.puts

```
puts(data1, data2, ...dataN)
```

向文件写入一个或多个字符串。

Parameters:

- `data` (string, required): 要写入的字符串数据，可传入多个参数。

Returns (number): 返回实际写入的字节数。

向文件写入多个字符串。

```javascript
function main() {
    let file = os.open("output.txt", "w+")
    let bytes = file.puts("Hello", " ", "World", "!")
    Log("Bytes written:", bytes)
    // 输出：Bytes written: 12

    file.seek(0, 0)
    let data = file.read()
    Log("data:", data)
    // 输出：data: Hello World!
    // 如果用 os.open("output.txt", "w")（只写）打开文件，read() 会抛出异常

    // file.puts()                // error: puts requires at least 1 argument at main
    file.puts(", Hello FMZ!")

    file.seek(0, 0)
    data = file.read()
    Log("data:", data)
    // 输出：data: Hello World!, Hello FMZ!
    file.close()
}
```

可一次写入多个字符串参数，将按顺序连接后写入。

See also: `File`, `os.open`, `File.printf`, `File.write`, `File.flush`

##### File.printf

```
printf(format)
printf(format, arg1, arg2, ...argN)
```

格式化写入数据到文件。

Parameters:

- `format` (string, required): 格式化字符串。
- `args` (any, optional): 格式化参数。

Returns (number): 返回实际写入的字节数。

格式化写入交易数据。

```javascript
function main() {
    let file = os.open("trade_log.txt", "w+")
    let price = 100.25
    let volume = 1000
    let bytes = file.printf("Price: %.2f, Volume: %d\n", price, volume)
    Log("Formatted bytes written:", bytes)

    file.seek(0, 0)
    let data = file.read()
    Log("data:", data)
    // 输出：data: Price: 100.25, Volume: 1000

    // file.printf("| Price: %.2f, Volume: %d\n")   // "| Price: %!f(MISSING), Volume: %!d(MISSING)"
    // file.seek(0, 0)
    // data = file.read()
    // Log("data:", data)

    file.close()
}
```

支持的格式符：```%s```、```%d```、```%f```、```%v```、```%%```，可以带标志（```-```、```0```）、宽度和精度，例如```%.2f```、```%-8s```、```%08d```。参数不足时，对应位置写入```%!d(MISSING)```这样的占位文本。

See also: `File`, `os.open`, `File.puts`, `File.write`

##### File.flush

```
flush()
```

刷新文件缓冲区，确保数据写入磁盘。

实时写入重要日志数据。

```javascript
function main() {
    let logFile = os.open("critical.log", "a")
    logFile.printf("[%s] Critical event occurred\n", new Date().toISOString())   // [2025-09-09T03:15:43.895Z] Critical event occurred
    logFile.flush()  // 立即将数据写入磁盘
    // 继续其他操作...
    logFile.close()
}
```

See also: `File`, `os.open`, `File.close`, `File.write`

##### File.tell

```
tell()
```

获取当前文件指针的位置。

Returns (number): 返回当前文件指针的位置（以字节为单位的偏移量）。

记录文件操作过程中的位置。

```javascript
function main() {
    let file = os.open("data.txt", "r+")
    Log("Initial position:", file.tell())
    // 输出：Initial position: 0

    file.write("Hello")
    Log("After write position:", file.tell())
    // 输出：After write position: 5
    file.close()
}
```

返回当前文件指针相对于文件起始位置的字节偏移量。

See also: `File`, `os.open`, `File.seek`, `File.eof`

##### File.seek

```
seek(offset, whence)
```

将文件指针移动到指定位置。

Parameters:

- `offset` (number, required): 偏移量（以字节为单位）。
- `whence` (number, required): 基准位置：0=文件开头，1=当前位置，2=文件末尾。

Returns (number): 返回新的文件指针位置。

倒序读取字符。

```javascript
function main() {
    let str = "Hello FMZ!"
    let file = os.open("data.txt", "w+")
    file.write(str)

    // If i > str.length, seek() throws an exception (invalid argument)
    for (let i = 1; i <= str.length; i++) {
        file.seek(-i, 2)
        let data = file.read(1)
        Log("i:", i, ", data:", data)
    }

    file.close()
}
```

用于定位文件指针，```offset```参数可以为负数（表示向前移动）。

See also: `File`, `os.open`, `File.tell`, `File.eof`

##### File.eof

```
eof()
```

检查文件指针是否已到达文件末尾。

Returns (bool): 如果已到达文件末尾则返回true，否则返回false。

逐行读取文件直至文件结束。

```javascript
function main() {
    let file = os.open("data.txt", "r")
    let lineCount = 0

    while (!file.eof()) {
        let line = file.getline()
        if (line !== undefined) {
            lineCount++
            Log("Line", lineCount + ":", line)
        }
    }

    Log("Total lines:", lineCount)
    file.close()
}
```

用于在读取文件时判断是否已读取完所有内容。只有在某次读取碰到文件末尾后才返回```true```：例如```getline()```返回```undefined```、```read(size)```读不到数据，或不带参数的```read()```读完剩余内容；调用```seek()```后恢复为```false```。

See also: `File`, `os.open`, `File.read`, `File.getline`

##### File.read

```
read()
read(size)
```

从文件中读取数据。

Parameters:

- `size` (number, optional): 要读取的字节数。如果不指定，则读取文件中剩余的所有内容。

Returns (string / ArrayBuffer): 返回读取的内容。已到达文件末尾时返回空字符串```""```（```b```模式下为空的```ArrayBuffer```）。

分块读取文件内容。

```javascript
function main() {
    let file = os.open("data.txt", "r")

    // data.txt
    // This is a test line: Line 1.
    // This is a test line: Line 2.
    // ...

    let chunkSize = 29
    let totalBytes = 0

    while (!file.eof()) {
        let chunk = file.read(chunkSize)
        if (chunk) {
            totalBytes += chunk.length || chunk.byteLength
            Log("Read chunk, total bytes so far:", totalBytes, ", chunk:", chunk)
        }
    }

    file.close()
}
```

可以读取指定字节数的内容或文件中剩余的全部内容。文件以```b```模式（如```rb```）打开时返回```ArrayBuffer```，否则返回字符串。不带参数读完剩余内容，或某次读取已无数据可读之后，```eof()```返回```true```。

See also: `File`, `os.open`, `File.getline`, `File.eof`, `File.seek`

##### File.write

```
write(data)
```

向文件写入字符串数据。

Parameters:

- `data` (string, required): 要写入的字符串数据。

Returns (number): 返回实际写入的字节数。

写入交易记录

```javascript
function main() {
    let file = os.open("trades.log", "a")
    let timestamp = new Date().toISOString()
    let tradeInfo = `${timestamp},BUY,50000,1\n`
    let bytes = file.write(tradeInfo)
    Log("Trade record written, bytes:", bytes)
    file.close()
}
```

将字符串数据写入文件的当前位置。

See also: `File`, `os.open`, `File.puts`, `File.flush`

##### File.getline

```
getline()
```

从文件中读取下一行内容。

Returns (string / undefined): 返回下一行内容（不含换行符）；已读完全部内容时返回```undefined```。文件中的空行返回空字符串```""```。

逐行读取文件直至结束。

```javascript
function main() {
    let file = os.open("data.txt", "r")
    let lineCount = 0

    let line
    while ((line = file.getline()) !== undefined) {
        lineCount++
        Log("Line", lineCount + ":", line)
    }

    Log("Total lines:", lineCount)
    file.close()
}
```

按行顺序读取文件内容。

See also: `File`, `os.open`, `File.read`, `File.eof`

##### File.toString

```
toString()
```

获取文件对象的字符串表示形式。

Returns (string): 返回文件对象的字符串描述信息。

获取文件对象的描述信息。

```javascript
function main() {
    let file = os.open("data/data.txt", "r")
    Log("File info:", file.toString())
    // 输出：File info: File(data/data.txt)
    file.close()
}
```

返回文件对象的描述信息。

See also: `File`, `os.open`, `File.read`

#### ListFilesResult

文件列表对象，用于记录目录列表信息。该对象包含两个数组属性：```files```（文件列表）和```dirs```（目录列表）。

ListFilesResult对象结构：

```javascript
{
    files: string[],  // 搜索的文件名数组
    dirs: string[]    // 当前目录下，子目录名数组
}
```

此对象由```os.listFiles()```函数返回。

See also: `File`, `os`, `FileStat`

#### FileStat

文件统计信息对象。

FileStat对象结构：

```javascript
{
    size: number,   // 文件大小（字节）
    mode: number,   // 文件模式（低 9 位为权限位，普通 0644 文件为 420）
    mtime: number,  // 修改时间，毫秒时间戳
    atime: number,  // 毫秒时间戳，当前与 mtime 相同
    ctime: number   // 毫秒时间戳，当前与 mtime 相同
}
```

此对象由```os.stat()```函数返回。

See also: `File`, `os`, `ListFilesResult`

## 结构体

API函数返回的数据结构：行情、深度、成交、K线、市场信息、订单、条件单、账户、资产、持仓和资金费率，以及函数的选项与返回对象（`其它结构`）。

各结构的```Info```字段是交易所接口的原始数据（回测中没有），标准字段缺失时可以从这里读取。返回结构的函数调用失败时返回空值，见`失败与空值`。

### Ticker

```exchange.GetTicker()```返回的行情：最高价、最低价、卖一价、买一价、最新成交价、开盘价、成交量与持仓量。

Fields:

- `Info` (object): 交易所接口返回的原始数据，回测时无此属性。
- `Symbol` (string): FMZ定义的品种代码，写法见`品种代码`，例如现货```BTC_USDT```、期货```BTC_USDT.swap```（USDT本位永续合约），期权```BTC_USDT.BTC-240108-40000-C```（2024年1月8日行权、行权价40000的看涨期权）。
- `High` (number): 最高价。交易所接口没有提供24小时最高价时可能为0，部分交易所以卖一价格近似。
- `Low` (number): 最低价。交易所接口没有提供24小时最低价时可能为0，部分交易所以买一价格近似。
- `Sell` (number): 当前时刻的卖一价。部分交易所的行情接口不含盘口数据，此时为0，需要盘口价格请使用`exchange.GetDepth`。
- `Buy` (number): 当前时刻的买一价。部分交易所的行情接口不含盘口数据，此时为0。
- `Last` (number): 最新的成交价。
- `Open` (number): 周期开盘价。交易所接口没有提供24小时滚动周期的开盘价时可能为0。
- `Volume` (number): 最近成交量，原则上现货成交量单位为交易币种（baseCurrency），合约成交量单位为合约张数。如果交易所接口没有提供此类数据则使用交易所接口现有的数据填充，例如可能为计价币（quoteCurrency）为单位的成交量。
- `Time` (number): 毫秒级别时间戳。
- `OpenInterest` (number): 持仓量，大部分交易所接口不提供该数据，不支持该数据时值为0。

```exchange.GetTicker()```函数返回一个Ticker结构。

对于期权合约，盘口流动性通常较差，经常出现买一、卖一没有挂单的情况，此时```Ticker```结构的```Buy```、```Sell```字段为0；从未成交的期权合约```Last```也可能为0。个别交易所以标记价格作为```Last```（全部合约，或只在没有最新成交价时），各字段的取值见交易所页的「期权」与「注意事项」。使用期权行情前应检查这些字段。

See also: `exchange.GetTicker`, `exchange.GetTickers`

### Depth

```exchange.GetDepth()```返回的市场深度：卖盘```Asks```、买盘```Bids```（`OrderBook`数组）与时间戳。

Fields:

- `Info` (object): 交易所接口返回的原始数据，回测时不包含此属性。
- `Asks` (array): 卖单数组，即 OrderBook 数组，按价格从低到高排序，数组中第一个 OrderBook 结构的价格最低。
- `Bids` (array): 买单数组，即 OrderBook 数组，按价格从高到低排序，数组中第一个 OrderBook 结构的价格最高。
- `Time` (number): 毫秒级时间戳。

exchange.GetDepth() 函数返回一个 Depth 结构。

See also: `exchange.GetDepth`, `OrderBook`

### OrderBook

市场深度（`Depth`）里卖盘、买盘的一档：价格与数量。

Fields:

- `Price` (number): 订单价格。
- `Amount` (number): 订单数量。

```exchange.GetDepth()```函数返回的数据结构中，Bids和Asks的属性值为OrderBook数组。

See also: `exchange.GetDepth`, `Depth`

### Trade

```exchange.GetTrades()```返回的市场成交记录：成交Id、时间、价格、数量与方向。

Fields:

- `Id` (string): 市场成交记录的唯一标识符。交易所接口没有提供Id时由平台生成标识（可能是时间戳，也可能是以```syn:```开头的合成字符串），只保证在同一次返回结果中唯一。
- `Time` (number): 毫秒级时间戳。
- `Price` (number): 成交价格。
- `Amount` (number): 成交数量。
- `Type` (number): 订单类型，参考`ORDER_TYPE_BUY`、`ORDER_TYPE_SELL`。交易所没有提供成交方向、无法判定时为```2```，不要用「不是卖就是买」的方式判断方向。

```exchange.GetTrades()```函数返回Trade数组，没有数据时为空数组，调用失败时返回空值（JavaScript为```null```，Python为```None```）。

See also: `exchange.GetTrades`

### Record

K线柱的数据结构，标准的OHLC格式，用于绘制K线图和技术指标计算分析。

Fields:

- `Time` (number): 毫秒级时间戳，表示该K线柱周期的起始时间。
- `Open` (number): 开盘价。
- `High` (number): 最高价。
- `Low` (number): 最低价。
- `Close` (number): 收盘价。
- `OpenInterest` (number): 持仓量。大部分交易所接口不提供此数据，不支持时值为0。
- `Volume` (number): 成交量。现货成交量单位原则上为基础货币（baseCurrency），合约成交量单位为合约张数。若交易所接口未提供标准数据，则使用接口现有数据填充，例如可能为计价货币（quoteCurrency）单位的成交量。

```exchange.GetRecords()```函数返回Record数组，没有数据时为空数组，调用失败时返回空值（JavaScript为```null```，Python为```None```）。每个Record结构代表一根K线柱。

对于Python语言，不同版本的pandas包处理方式可能不同，例如：

```python
pandas.DataFrame(records)  # 可能需要调整为：pandas.DataFrame(list(records))
```

相关报错信息：```in getattr KeyError: 'dtype'```。

See also: `exchange.GetRecords`

### Market

```exchange.GetMarkets()```返回的品种市场信息：交易币与计价币、价格与数量的步长和精度、下单数量与金额的上下限、合约面值。

Fields:

- `Symbol` (string): 取值例如：```btcusdt```，```Symbol```字段记录该交易品种在交易所的原始名称。需要注意该属性的格式、定义与`Ticker`结构的```Symbol```字段不同。
- `BaseAsset` (string): 取值例如：```BTC```，```BaseAsset```字段记录交易币名称（即：baseCurrency），统一为大写字母。
- `QuoteAsset` (string): 取值例如：```USDT```，```QuoteAsset```字段记录计价币名称（即：quoteCurrency），统一为大写字母。
- `TickSize` (number): 取值例如：```0.01```，```TickSize```字段记录该交易品种在交易所的价格最小变动单位。
- `AmountSize` (number): 取值例如：```0.01```，```AmountSize```字段记录该交易品种在交易所的下单量最小变动单位。
- `PricePrecision` (number): 取值例如：```2```，```PricePrecision```字段记录该交易品种在交易所的价格精度，表示价格精确到2位小数。该值可能为负数，例如价格最小变动为10时为```-1```，表示价格取整到十位。
- `AmountPrecision` (number): 取值例如：```3```，```AmountPrecision```字段记录该交易品种在交易所的下单量精度，表示下单量精确到3位小数。与```PricePrecision```一样，该值可能为负数。
- `MinQty` (number): 取值例如：```0.001```，```MinQty```字段记录该交易品种在交易所的最小下单量。
- `MaxQty` (number): 取值例如：```1000```，```MaxQty```字段记录该交易品种在交易所的最大下单量。交易所没有提供最大下单量时为```9007199254740991```（2^53−1），表示没有限制。
- `MinNotional` (number): 取值例如：```5```，```MinNotional```字段记录该交易品种在交易所的最小下单金额。
- `MaxNotional` (number): 取值例如：```9999999```，```MaxNotional```字段记录该交易品种在交易所的最大下单金额。交易所没有提供最大下单金额时一般为```9007199254740991```（2^53−1），表示没有限制；部分交易所对象不返回该字段。
- `CtVal` (number): 该交易品种在交易所的单张合约对应的价值，单位为```CtValCcy```字段记录的币种。例如：```CtVal```为0.01，```CtValCcy```为```BTC```表示单张合约价值0.01个BTC。
- `CtValCcy` (string): 单张合约的价值单位，单张合约的价值单位可能是：```BTC```、```USD```、```ETH```等。
- `Info` (object): 交易所市场信息接口返回的该品种的原始数据。

```exchange.GetMarkets()```函数返回包含此```Market```结构的字典。

由于各个交易所对于市场信息数据支持程度不同，部分字段的取值需要注意：```MaxQty```、```MaxNotional```在交易所没有提供时为```9007199254740991```（表示没有限制）；```MaxNotional```、```CtVal```、```CtValCcy```没有数据时不包含该字段（现货品种一般没有```CtVal```、```CtValCcy```；Rust的```Market```结构字段固定存在，此时为```0```或空字符串）；```PricePrecision```、```AmountPrecision```可能为负数；没有市场列表接口的交易所无法给出原始名称，此时```Symbol```为FMZ平台定义的交易品种代码（如```BTC_USDT```）。以上各个字段数据取值均来自于交易所接口原始数据，具体也可以查询```Info```字段内容。

See also: `exchange.GetMarkets`

### Order

```exchange.GetOrder()```、```exchange.GetOrders()```等返回的订单：订单Id、价格、数量、成交数量、成交均价、状态、方向、开平仓、合约代码与条件单配置。

Fields:

- `Info` (object): 交易所接口应答的原始数据，回测时无此属性。
- `Symbol` (string): FMZ定义的品种代码，写法见`品种代码`，例如现货```BTC_USDT```、期货```BTC_USDT.swap```（USDT本位永续合约），格式与`Ticker`的```Symbol```相同。
- `Id` (string): 订单Id。大多数交易所的订单Id由交易所品种代码和交易所原始订单Id组成，以英文逗号间隔。例如OKX交易所的现货交易对```ETH_USDT```订单的属性```Id```格式为：```ETH-USDT,1547130415509278720```。少数交易所的订单Id就是交易所原始订单Id，不带品种代码。策略应把```Id```当作不透明的字符串原样使用（如传给```exchange.CancelOrder()```），不要自行拆分或拼接。
- `Price` (number): 下单价格，注意市价单的该属性可能为0或者-1。
- `Amount` (number): 下单数量，注意市价单的该属性可能为金额并非币数。
- `DealAmount` (number): 成交数量，如果交易所接口不提供该数据则可能使用0填充。
- `AvgPrice` (number): 成交均价，注意有些交易所不提供该数据。不提供、也无法计算得出的情况该属性设置为0。
- `Status` (number): 订单状态，参考`ORDER_STATE_PENDING`、`ORDER_STATE_CLOSED`、`ORDER_STATE_CANCELED`、`ORDER_STATE_UNKNOWN`。
- `Type` (number): 订单类型，参考`ORDER_TYPE_BUY`、`ORDER_TYPE_SELL`。
- `Offset` (number): 合约订单的开、平仓方向，参考`ORDER_OFFSET_OPEN`、`ORDER_OFFSET_CLOSE`。
- `ContractType` (string): 现货订单中该属性为```""```，即空字符串。合约订单中该属性为具体的合约代码。
- `Condition` (object): 条件单的触发条件和执行价格，结构见`Condition`。普通订单没有该字段，各语言的读取方式见备注。
- `Time` (number): 订单创建时间，毫秒级别时间戳。

```Order```订单结构可由```exchange.GetOrder()```、```exchange.GetOrders()```函数返回。```exchange.GetOrders()```函数返回的是```Order```结构的数组，如果当前没有未完成的订单，则返回```[]```即空数组；调用失败（网络错误、交易所报错等）时返回空值（JavaScript为```null```，Python为```None```）。```Order```订单结构的```Status```属性可以直接和```ORDER_STATE_PENDING```等常量比较，判断是否相等从而确定订单状态。

对于单向持仓模式下，对于无法判断订单是否是平仓（减仓）时，```Offset```字段默认设置为开仓方向，即```ORDER_OFFSET_OPEN```。

```Time```字段表示订单创建时间，为毫秒级别时间戳。部分交易所可能在```Info```字段中也包含时间信息，但```Time```字段统一提供标准化的时间戳格式。

普通订单没有```Condition```字段：JavaScript中读取结果为```undefined```；Python中该键不存在，直接按属性访问```order.Condition```会抛出```AttributeError```异常，应使用```order.get("Condition")```或```"Condition" in order```判断；Rust中```Order```结构始终带有```Condition```字段，普通订单的```Condition.ConditionType```为```-1```。

See also: `exchange.GetOrder`, `exchange.GetOrders`, `exchange.GetHistoryOrders`, `Condition`

### Condition

条件单的配置：条件单类型，以及止盈、止损的触发价与委托价。用于设置条件单的触发条件和执行价格。

Fields:

- `ConditionType` (number): 条件单类型，取值见`ORDER_CONDITION_TYPE`：OCO（```0```）、止盈（```1```）、止损（```2```）、通用（```3```，只出现在查询结果中）。
- `TpTriggerPrice` (number): 止盈触发价格。当条件单类型为TP或OCO时使用。当市场价格达到该价格时，触发止盈订单。
- `TpOrderPrice` (number): 止盈订单执行价格。止盈触发后的实际下单价格。下单时价格设置为-1表示以市价单执行；查询返回的条件单中，以市价执行的该价格通常为0。
- `SlTriggerPrice` (number): 止损触发价格。当条件单类型为SL或OCO时使用。当市场价格达到该价格时，触发止损订单。
- `SlOrderPrice` (number): 止损订单执行价格。止损触发后的实际下单价格。下单时价格设置为-1表示以市价单执行；查询返回的条件单中，以市价执行的该价格通常为0。

- OCO订单（ConditionType=`ORDER_CONDITION_TYPE_OCO`）同时设置止盈和止损条件，当其中一个条件触发时，另一个自动取消。
- TP订单（ConditionType=`ORDER_CONDITION_TYPE_TP`）仅使用TpTriggerPrice和TpOrderPrice字段。
- SL订单（ConditionType=`ORDER_CONDITION_TYPE_SL`）仅使用SlTriggerPrice和SlOrderPrice字段。
- GENERIC订单（ConditionType=`ORDER_CONDITION_TYPE_GENERIC`）为通用条件单，具体使用哪些字段取决于交易所实现。查询返回的GENERIC订单中，Tp*与Sl*两组字段的值相同（同一组触发价、委托价）。GENERIC类型只出现在查询结果中，`exchange.CreateConditionOrder`、`exchange.ModifyConditionOrder`不支持该类型，传入时返回空值并记录错误。

条件单功能支持情况取决于具体交易所，部分交易所可能不支持某些类型的条件单。

See also: `Order`, `exchange.CreateConditionOrder`, `exchange.GetConditionOrder`

### Account

```exchange.GetAccount()```返回的账户信息：计价币与交易币的可用、冻结数量，期货另有权益与未实现盈亏。

Fields:

- `Info` (object): 交易所接口返回的原始数据，回测模式下此属性不存在。
- `Balance` (number): 可用的计价币数量。现货交易中，如果交易对为BTC_USDT，Balance表示当前可用的USDT数量。U本位合约中，Balance表示可用保证金（USDT，quoteCurrency）的数量。
- `FrozenBalance` (number): 订单未成交时冻结的资产数值。
- `Stocks` (number): 可用交易币数量。现货交易中，如果交易对为BTC_USDT，Stocks表示当前可用的BTC数量。币本位合约中，Stocks表示可用保证金（币，baseCurrency）的数量。
- `FrozenStocks` (number): 订单未成交时冻结的资产数值。
- `Equity` (number): 仅期货交易所对象支持此字段。```Equity```字段表示当前合约设置下期货账户保证金的**总权益**。如果交易所接口未提供相关数据，则此字段值为0。
- `UPnL` (number): 仅期货交易所对象支持此字段。```UPnL```字段表示当前合约设置下期货账户保证金中所有开仓仓位的**未实现盈亏**总和。

```exchange.GetAccount()```函数返回一个Account结构。返回结构中的数据依赖于当前设置的交易对和合约代码。

See also: `exchange.GetAccount`

### Asset

```exchange.GetAssets()```返回的数组中的一项：一个币种的可用数量与冻结数量。

Fields:

- `Currency` (string): 交易所定义的币种资产名称。由于不同交易所的命名规则可能存在差异，同一币种在不同交易所可能使用不同的标识符，例如```BTC```在某些交易所可能被标识为```XBT```。
- `Amount` (number): 币种资产的可用余额数量。
- `FrozenAmount` (number): 币种资产的冻结数量。

币种资产的冻结数量```FrozenAmount```通常包含未成交订单锁定的资产以及期货持仓所需的保证金部分。

See also: `exchange.GetAssets`

### Position

```exchange.GetPositions()```返回的持仓：品种、杠杆、持仓量与冻结量、持仓均价、浮动盈亏、持仓方向、合约代码与保证金。

Fields:

- `Info` (object): 交易所接口返回的原始数据，回测时无此属性。
- `Symbol` (string): FMZ定义的品种代码，写法见`品种代码`，例如现货```BTC_USDT```、期货```BTC_USDT.swap```（USDT本位永续合约），格式与`Ticker`的```Symbol```相同。
- `MarginLevel` (number): 持仓杆杠大小，如果交易所接口没有提供该数据则通过计算填充，可能会有误差。
- `Amount` (number): 持仓量，通常是正整数（合约张数）。注意每个交易所的合约乘数、价值等合约规格可能不一样。
- `FrozenAmount` (number): 仓位冻结量，平仓单未成交时的临时冻结仓位数量。
- `Price` (number): 持仓均价，原则上该属性为仓位总体的平均价格（不参与结算）， 如果交易所接口没有提供该数据则用交易所接口现有的持仓均价填充（参与结算）。
- `Profit` (number): 持仓浮动盈亏，原则上为持仓的未实现盈亏，如果交易所接口没有提供该数据则用交易所接口其它盈亏数据填充，盈亏数值的单位和当前合约保证金的单位相同。
- `Type` (number): 仓位类型，参考`PD_LONG`, `PD_SHORT`。
- `ContractType` (string): 合约代码，具体可以参看`exchange.SetContractType`函数的描述内容。
- `Margin` (number): 仓位占用的保证金，如果交易所接口没有提供该数据则使用0填充。

```exchange.GetPositions()```函数返回一个Position数组，没有持仓时为空数组，调用失败时返回空值（JavaScript为```null```，Python为```None```）。

对于加密货币期货需要注意，```exchange.GetPositions()```函数返回的Position结构数组。
对于其中持仓数据结构中的FrozenAmount、Profit、Margin属性，由于交易所提供数据并不统一，不同交易所对象调用```exchange.GetPositions()```接口时返回的数据的定义可能不同。
例如，有些交易所持仓数据中无仓位冻结数据，此时FrozenAmount为0。 如果需要计算某些数据可以使用Info属性中的原始数据计算分析。

See also: `exchange.GetPositions`

### Funding

```exchange.GetFundings()```返回的资金费率信息：品种、结算周期、时间与费率；仅加密货币永续合约有资金费率。

Fields:

- `Info` (object): 加密货币期货交易所资金费率接口调用时返回的原始数据对象。
- `Symbol` (string): FMZ平台定义的标准化交易品种代码。
- `Interval` (number): 资金费率结算间隔周期，单位：毫秒。例如```28800000```表示8小时间隔。
- `Time` (number): 下一期资金费率开始时刻（当期结算时刻）的时间戳，单位：毫秒。
- `Rate` (number): 当期结算时将要应用的资金费率数值。

不同期货交易所的永续合约资金费率采用不同的计算方法和机制，结算周期包括1小时、4小时、8小时、24小时等。

期货交易所永续合约的当期资金费率可能为固定值，也可能为实时计算的浮动值。

```Rate```字段为不带```%```符号的资金费率数值，如需转换为百分比形式，可将数值乘以100并添加```%```符号。

See also: `exchange.GetFundings`

### 其它结构

函数的选项对象，以及函数返回的对象与结构（连接对象、图表对象、并发对象、状态栏组件与按钮结构等）。

#### HttpQuery-options

此JSON结构用于配置HttpQuery函数和HttpQuery_Go函数发送HTTP请求的各项参数。

Fields:

- `method` (string): HTTP请求方法，例如：```GET```、```POST```等。
- `body` (string): 请求体内容。例如在POST请求中，body可以包含表单数据、JSON数据、文本等。
- `charset` (string): 应答报文的字符集。设置后按该字符集把应答体解码为UTF-8文本，例如对GBK编码的网页设置为：```GBK```。返回结构中的```Length```仍为解码前的长度；无法识别的字符集会记录一条错误，应答体保持原样。该选项与请求体的编码无关。
- `cookie` (string): Cookie是用于在客户端（通常是浏览器）和服务器之间存储和交换状态信息的小型数据片段。
- `debug` (bool): 调试模式开关。设置为true时，HttpQuery函数调用将返回完整的HTTP响应报文；设置为false时仅返回响应报文Body中的数据。
- `headers` (object): HTTP请求头信息，以键值对形式存在（JSON结构），用于传递各种信息，如内容类型、认证信息、缓存控制等。
- `proxy` (string): 本次请求使用的代理，支持```http://```、```https://```、```socks5://```、```socks5h://```，例如：```"socks5://user:pass@127.0.0.1:1080"```。只作用于这一次请求，与```exchange.SetProxy()```设置的交易所代理互不影响。
- `timeout` (number): 超时时间设置，单位为毫秒。设置1000表示1秒钟超时。不设置时默认为300000（5分钟）。

使用范例：
```javascript
function main() {
    var options = {
        method: "POST",
        body: "a=10&b=20&c=30",
        charset: "UTF-8",
        cookie: "session_id=12345; lang=en",
        debug: false,
        headers: {"TEST-HTTP-QUERY": "123"},
        timeout: 1000
    }
    var ret = HttpQuery("http://127.0.0.1:8080", options)
    Log(ret)
}
```

以上代码执行时发出的HTTP报文：

```log
POST / HTTP/1.1
Content-Type: application/x-www-form-urlencoded
Cookie: session_id=12345; lang=en
Host: 127.0.0.1:8080
Test-Http-Query: 123
Content-Length: 14
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) ...
Accept-Encoding: gzip, br

a=10&b=20&c=30

```

See also: `HttpQuery`, `HttpQuery_Go`

#### HttpQuery-return

该JSON结构是调用HttpQuery函数时，在参数```options```结构中将debug字段指定为true后，HttpQuery函数在调试模式下返回的数据结构。

Fields:

- `StatusCode` (number): HTTP状态码。请求未收到应答（连接被拒绝、DNS解析失败、超时、代理失败等）时为0。
- `Header` (object): 应答头信息。每个键的值为字符串数组（同名应答头可能出现多次，例如多条```Set-Cookie```）。
- `Cookies` (array): 应答中各条```Set-Cookie```解析得到的数组，每个元素包含```Name```、```Value```、```Path```、```Domain```、```Expires```、```MaxAge```、```Secure```、```HttpOnly```、```SameSite```、```Raw```字段。
- `Trace` (object): 请求各阶段的耗时等诊断信息，包括```elapsed_ms```（总耗时）、```dns_ms```、```connect_ms```、```tls_ms```、```ttfb_ms```（首字节耗时）、```recv_ms```等毫秒数，以及```peer_addr```（对端地址）、```reused```（是否复用连接）、```version```（HTTP版本）等字段。仅在```debug```为true时存在。
- `Length` (number): 报文长度。设置了```charset```时为解码前的长度。
- `Body` (string): 报文内容。请求失败时为空字符串。
- `Error` (string): 请求失败的原因，包含请求方法、URL和底层错误信息，例如：```Get "https://www.okx.com/api/v5/public/time": timeout after 1000ms```。仅在请求失败（```StatusCode```为0）时出现。

返回的JSON数据结构示例：
```json
{
    "StatusCode": 302,
    "Header": {
        "Content-Type": ["text/html"],
        "Location": ["https://www.example.com/"]
    },
    "Cookies": [],
    "Trace": {
        "elapsed_ms": 152.4,
        "dns_ms": 3.1,
        "connect_ms": 20.5,
        "tls_ms": 45.2,
        "ttfb_ms": 150.8,
        "recv_ms": 1.6,
        "peer_addr": "93.184.216.34:443",
        "reused": false,
        "version": "HTTP/1.1"
    },
    "Length": 154,
    "Body": "..."
}
```

请求失败（未收到应答）时返回的数据结构示例：
```json
{
    "StatusCode": 0,
    "Header": {},
    "Cookies": [],
    "Length": 0,
    "Body": "",
    "Error": "Get \"https://www.okx.com/api/v5/public/time\": timeout after 1000ms"
}
```
HTTP状态码为4xx、5xx的应答不属于请求失败，此时```StatusCode```为实际状态码，且不包含```Error```字段。可以通过```StatusCode```统一判断：```if (ret.StatusCode !== 200) { ... }```。

Rust中```HttpQuery```返回的```HttpRet```结构只有```StatusCode```、```Header```、```Cookies```、```Body```、```Error```字段（没有```Length```、```Trace```，```Cookies```不填充）。

See also: `HttpQuery`, `HttpQuery_Go`

#### LogStatus-table

状态栏表格，用`LogStatus`输出：列可以设置数值格式、涨跌色和单位，单元格可以合并、放按钮，多个表格可以分页显示。

Fields:

- `type` (string): 必填，固定为 `table`。
- `title` (string): 表格标题。
- `cols` (array): 必填。列标题数组：每项是字符串，或带 `title` 的列定义对象。
- `rows` (array): 必填。二维数组，每行一个数组，元素与 `cols` 一一对应。单元格可以是文字（结尾 `#ff0000` 设置颜色）、数字、按钮对象（多个按钮写成数组）、合并单元格 `{body, colspan, rowspan}`，或格式化单元格 `{value, format, color, unit}`。
- `scroll` (string): 写 `auto` 时超过 20 行纵向滚动、列太多时横向滚动，数据量大时可以减少卡顿。
- `cols[].title` (string): 列标题。
- `cols[].format` (object): 本列数字的格式 `{precision, compact, percent}`，见`状态栏组件`。
- `cols[].color` (string): 本列数字的颜色：`sign` 按正负取涨跌色（`0` 不着色），或 `up`、`down`、`primary`、`warning`、`muted`。
- `cols[].unit` (string): 本列数字后面的单位。
- `cols[].align` (string): 对齐：`left`、`center`、`right`。
- `rows[][].value` (number / string): 格式化单元格的值。
- `rows[][].format` (object): 该单元格的数值格式，优先于本列的设置。
- `rows[][].color` (string): 该单元格的颜色，取值同 `cols[].color`。
- `rows[][].unit` (string): 该单元格的单位。

输出一个3行3列的表格。

```javascript
function main() {
    var tbl = {
        type: "table",
        title: "标题",
        cols: ["列1", "列2", "列3"],
        rows: [
            ["行1 列1", "行1 列2", "行1 列3"],
            ["行2 列1", "行2 列2", "行2 列3"],
            ["行3 列1", "行3 列2", "行3 列3"]
        ]
    }
    // 单独输出表格对象时自动加反引号
    LogStatus(tbl)
}
```

```python
def main():
    tbl = {
        "type": "table",
        "title": "标题",
        "cols": ["列1", "列2", "列3"],
        "rows": [
            ["行1 列1", "行1 列2", "行1 列3"],
            ["行2 列1", "行2 列2", "行2 列3"],
            ["行3 列1", "行3 列2", "行3 列3"]
        ]
    }
    # 单独输出表格字典时自动加反引号
    LogStatus(tbl)
```

```rust
fn main() {
    let tbl = r#"{"type": "table", "title": "标题", "cols": ["列1", "列2", "列3"],
        "rows": [["行1 列1", "行1 列2", "行1 列3"],
                 ["行2 列1", "行2 列2", "行2 列3"],
                 ["行3 列1", "行3 列2", "行3 列3"]]}"#;
    // Rust 的字符串不会自动加反引号；反引号里的 JSON 要在一行里
    LogStatus!(format!("`{}`", tbl.replace('\n', "")));
}
```

最近10根日K线：列设置格式与涨跌色，单元格对象单独设置颜色。

```javascript
function main() {
    var r = exchange.GetRecords(PERIOD_D1)
    if (!r || r.length < 11) return
    var rows = []
    for (var i = r.length - 1; i >= r.length - 10; i--) {
        var chg = r[i].Close / r[i - 1].Close - 1
        var note = Math.abs(chg) > 0.05 ? {value: "大幅波动", color: "warning"} : ""
        rows.push([_D(r[i].Time, "yyyy-MM-dd"), r[i].Close, chg, r[i].Volume, note])
    }
    LogStatus({type: "table", title: "最近10天", rows: rows, cols: [
        "日期",
        {title: "收盘", format: {precision: 2}, align: "right"},
        {title: "涨跌幅", format: {percent: true, precision: 2}, color: "sign", align: "right"},
        {title: "成交量", format: {compact: true}, align: "right"},
        "备注"
    ]})
}
```

```python
def main():
    r = exchange.GetRecords(PERIOD_D1)
    if not r or len(r) < 11:
        return
    rows = []
    for i in range(len(r) - 1, len(r) - 11, -1):
        chg = r[i]["Close"] / r[i - 1]["Close"] - 1
        note = {"value": "大幅波动", "color": "warning"} if abs(chg) > 0.05 else ""
        rows.append([_D(r[i]["Time"] / 1000, "%Y-%m-%d"), r[i]["Close"], chg, r[i]["Volume"], note])
    pct = {"percent": True, "precision": 2}
    LogStatus({"type": "table", "title": "最近10天", "rows": rows, "cols": [
        "日期",
        {"title": "收盘", "format": {"precision": 2}, "align": "right"},
        {"title": "涨跌幅", "format": pct, "color": "sign", "align": "right"},
        {"title": "成交量", "format": {"compact": True}, "align": "right"},
        "备注"
    ]})
```

```rust
fn main() {
    let Ok(r) = exchange.GetRecords(None, PERIOD_D1, None) else { return };
    if r.len() < 11 { return; }
    let rows: Vec<String> = (r.len() - 10..r.len()).rev().map(|i| {
        let chg = r[i].Close / r[i - 1].Close - 1.0;
        let big = r#"{"value": "大幅波动", "color": "warning"}"#;
        let note = if chg.abs() > 0.05 { big } else { r#""""# };
        let date = &_D(r[i].Time)[..10];
        format!(r#"["{}", {}, {}, {}, {}]"#, date, r[i].Close, chg, r[i].Volume, note)
    }).collect();
    let table = format!(r#"{{"type": "table", "title": "最近10天", "rows": [{}], "cols": [
        "日期", {{"title": "收盘", "format": {{"precision": 2}}, "align": "right"}},
        {{"title": "涨跌幅", "format": {{"percent": true, "precision": 2}},
          "color": "sign", "align": "right"}},
        {{"title": "成交量", "format": {{"compact": true}}, "align": "right"}},
        "备注"]}}"#, rows.join(","));
    // 反引号里的 JSON 要在一行里
    LogStatus!(format!("`{}`", table.replace('\n', "")));
}
```

横向合并```LogStatus()```函数画出的表格内的单元格。

```javascript
function main() {
    var table = {
        type: 'table',
        title: 'Position Operation',
        cols: ['Column 1', 'Column 2', 'Action'],
        rows: [
            ['abc', 'def', {'type':'button', 'cmd': 'coverAll', 'name': 'Close'}]
        ]
    }
    var ticker = exchange.GetTicker()
    // 添加一行数据，第一个和第二个单元格合并，并且输出ticker变量在合并后的单元格内
    table.rows.push([{body : JSON.stringify(ticker), colspan : 2}, "abc"])
    LogStatus('`' + JSON.stringify(table) + '`')
}
```

```python
import json
def main():
    table = {
        "type" : "table",
        "title" : "Position Operation",
        "cols" : ["Column 1", "Column 2", "Action"],
        "rows" : [
            ["abc", "def", {"type": "button", "cmd": "coverAll", "name": "Close"}]
        ]
    }
    ticker = exchange.GetTicker()
    table["rows"].append([{"body": json.dumps(ticker), "colspan": 2}, "abc"])
    LogStatus("`" + json.dumps(table) + "`")
```

```rust
fn main() {
    let table_tpl = String::from(r#"{"type": "table", "title": "Position Operation", "cols": ["Column 1", "Column 2", "Action"], "rows": ["#)
        + r#"["abc", "def", {"type": "button", "cmd": "coverAll", "name": "Close"}],"#
        + r#"__ROW2__"#
        + r#"]}"#;

    let ticker = exchange.GetTicker(None).unwrap();
    let json_ticker = format!(
        r#"{{"Buy": {}, "Sell": {}, "High": {}, "Low": {}, "Volume": {}, "Last": {}, "Time": {}}}"#,
        ticker.Buy, ticker.Sell, ticker.High, ticker.Low, ticker.Volume, ticker.Last, ticker.Time
    );
    // 添加一行数据，第一个和第二个单元格合并，并且输出ticker数据在合并后的单元格内
    // body为字符串（对应JS的JSON.stringify(ticker)），内部引号需转义后嵌入JSON
    let row2 = format!(r#"[{{"body": "{}", "colspan": 2}}, "abc"]"#, json_ticker.replace('"', "\\\""));
    let table = table_tpl.replace("__ROW2__", &row2);
    LogStatus!(format!("`{}`", table));
}
```

纵向合并```LogStatus()```函数画出的表格内的单元格。

```javascript
function main() {
    var table = {
        type: 'table',
        title: 'Table Demo',
        cols: ['Column A', 'Column B', 'Column C'],
        rows: [
            ['A1', 'B1', {'type':'button', 'cmd': 'coverAll', 'name': 'C1'}]
        ]
    }

    var ticker = exchange.GetTicker()
    var name = exchange.GetName()

    table.rows.push([{body : "A2 + B2:" + JSON.stringify(ticker), colspan : 2}, "C2"])
    table.rows.push([{body : "A3 + A4 + A5:" + name, rowspan : 3}, "B3", "C3"])
    // A4被上一行第一个单元格合并
    table.rows.push(["B4", "C4"])
    // A5被上一行第一个单元格合并
    table.rows.push(["B5", "C5"])
    table.rows.push(["A6", "B6", "C6"])
    LogStatus('`' + JSON.stringify(table) + '`')
}
```

```python
import json
def main():
    table = {
        "type" : "table",
        "title" : "Table Demo",
        "cols" : ["Column A", "Column B", "Column C"],
        "rows" : [
            ["A1", "B1", {"type": "button", "cmd": "coverAll", "name": "C1"}]
        ]
    }

    ticker = exchange.GetTicker()
    name = exchange.GetName()

    table["rows"].append([{"body": "A2 + B2:" + json.dumps(ticker), "colspan": 2}, "C2"])
    table["rows"].append([{"body": "A3 + A4 + A5:" + name, "rowspan": 3}, "B3", "C3"])
    table["rows"].append(["B4", "C4"])
    table["rows"].append(["B5", "C5"])
    table["rows"].append(["A6", "B6", "C6"])
    LogStatus("`" + json.dumps(table) + "`")
```

```rust
fn main() {
    // 为了测试，代码简短易读，这里使用构造的数据
    let json_ticker = r#"{"High": 0, "Low": 0, "Buy": 0, "Sell": 0, "Last": 0, "Time": 0, "Volume": 0}"#;
    let name = exchange.GetName();

    let mut rows: Vec<String> = Vec::new();
    rows.push(String::from(r#"["A1", "B1", {"type": "button", "cmd": "coverAll", "name": "C1"}]"#));
    // body为字符串，内部的引号需要转义后嵌入JSON
    let body = format!("A2 + B2:{}", json_ticker).replace('"', "\\\"");
    rows.push(format!(r#"[{{"body": "{}", "colspan": 2}}, "C2"]"#, body));
    rows.push(format!(r#"[{{"body": "A3 + A4 + A5:{}", "rowspan": 3}}, "B3", "C3"]"#, name));
    // A4被上一行第一个单元格合并
    rows.push(String::from(r#"["B4", "C4"]"#));
    // A5被上一行第一个单元格合并
    rows.push(String::from(r#"["B5", "C5"]"#));
    rows.push(String::from(r#"["A6", "B6", "C6"]"#));

    let table = format!(r#"{{"type": "table", "title": "Table Demo", "cols": ["Column A", "Column B", "Column C"], "rows": [{}]}}"#, rows.join(","));
    LogStatus!(format!("`{}`", table));
}
```

状态栏表格分页显示。

```javascript
function main() {
    var table1 = {type: 'table', title: 'table1', cols: ['Column 1', 'Column 2'], rows: [ ['abc', 'def'], ['ABC', 'support color #ff0000']]}
    var table2 = {type: 'table', title: 'table2', cols: ['Column 1', 'Column 2'], rows: [ ['abc', 'def'], ['ABC', 'support color #ff0000']]}
    LogStatus('`' + JSON.stringify([table1, table2]) + '`')
}
```

```python
import json
def main():
    table1 = {"type": "table", "title": "table1", "cols": ["Column 1", "Column 2"], "rows": [ ["abc", "def"], ["ABC", "support color #ff0000"]]}
    table2 = {"type": "table", "title": "table2", "cols": ["Column 1", "Column 2"], "rows": [ ["abc", "def"], ["ABC", "support color #ff0000"]]}
    LogStatus("`" + json.dumps([table1, table2]) + "`")
```

```rust
fn main() {
    let table1 = r#"{"type": "table", "title": "table1", "cols": ["Column 1", "Column 2"], "rows": [["abc", "def"], ["ABC", "support color #ff0000"]]}"#;
    let table2 = r#"{"type": "table", "title": "table2", "cols": ["Column 1", "Column 2"], "rows": [["abc", "def"], ["ABC", "support color #ff0000"]]}"#;
    LogStatus!(format!("`[{},{}]`", table1, table2));
}
```

除了可以分页显示表格，也可以多个表格自上而下排列显示。

```javascript
function main(){
    var tab1 = {
        type : "table",
        title : "Table 1",
        cols : ["1", "2"],
        rows : []
    }
    var tab2 = {
        type : "table",
        title : "Table 2",
        cols : ["1", "2", "3"],
        rows : []
    }
    var tab3 = {
        type : "table",
        title : "Table 3",
        cols : ["A", "B", "C"],
        rows : []
    }

    tab1.rows.push(["jack", "lucy"])
    tab2.rows.push(["A", "B", "C"])
    tab3.rows.push(["A", "B", "C"])

    LogStatus('`' + JSON.stringify(tab1) + '`\n' +
        '`' + JSON.stringify(tab2) + '`\n' +
        '`' + JSON.stringify(tab3) + '`')

    Log("exit")
}
```

```python
import json
def main():
    tab1 = {
        "type": "table",
        "title": "Table 1",
        "cols": ["1", "2"],
        "rows": []
    }
    tab2 = {
        "type": "table",
        "title": "Table 2",
        "cols": ["1", "2", "3"],
        "rows": []
    }
    tab3 = {
        "type": "table",
        "title": "Table 3",
        "cols": ["A", "B", "C"],
        "rows": []
    }

    tab1["rows"].append(["jack", "lucy"])
    tab2["rows"].append(["A", "B", "C"])
    tab3["rows"].append(["A", "B", "C"])
    LogStatus("`" + json.dumps(tab1) + "`\n" +
        "`" + json.dumps(tab2) + "`\n" +
        "`" + json.dumps(tab3) + "`")
```

```rust
fn main() {
    // Rust 中直接把行数据写入JSON字符串中
    let tab1 = r#"{"type": "table", "title": "Table 1", "cols": ["1", "2"], "rows": [["jack", "lucy"]]}"#;
    let tab2 = r#"{"type": "table", "title": "Table 2", "cols": ["1", "2", "3"], "rows": [["A", "B", "C"]]}"#;
    let tab3 = r#"{"type": "table", "title": "Table 3", "cols": ["A", "B", "C"], "rows": [["A", "B", "C"]]}"#;

    LogStatus!(format!("`{}`\n`{}`\n`{}`", tab1, tab2, tab3));

    Log!("exit");
}
```

支持设置状态栏表格横向、纵向滚动模式。设置```scroll```属性为```auto```，当状态栏表格纵向的行数超过20行时内容进行滚动显示，当横向的列数超出页面显示范围时进行横向滚动显示，使用```scroll```属性可以缓解实盘时状态栏中大量写入数据的卡顿问题。
参考以下测试例子：

```javascript
function main() {
    var tbl = {
        type : "table",
        title : "test scroll",
        scroll : "auto",
        cols : ["col 0", "col 1", "col 2", "col 3", "col 4", "col 5", "col 6", "col 7", "col 8", "col 9", "col 10",
            "col 11", "col 12", "col 13", "col 14", "col 15", "col 16", "col 17", "col 18", "col 19", "col 20"],
        rows : []
    }

    for (var i = 1 ; i < 100 ; i++) {
        tbl.rows.push([i, "1," + i, "2," + i, "3," + i, "4," + i, "5," + i, "6," + i, "7," + i, "8," + i, "9," + i, "10," + i,
            "11," + i, "12," + i, "13," + i, "14," + i, "15," + i, "16," + i, "17," + i, "18," + i, "19," + i, "20," + i])
    }

    LogStatus("`" + JSON.stringify(tbl) + "`")
}
```

```python
import json

def main():
    tbl = {
        "type" : "table",
        "title" : "test scroll",
        "scroll" : "auto",
        "cols" : ["col 0", "col 1", "col 2", "col 3", "col 4", "col 5", "col 6", "col 7", "col 8", "col 9", "col 10",
            "col 11", "col 12", "col 13", "col 14", "col 15", "col 16", "col 17", "col 18", "col 19", "col 20"],
        "rows" : []
    }

    for index in range(1, 100):
        i = str(index)
        tbl["rows"].append([i, "1," + i, "2," + i, "3," + i, "4," + i, "5," + i, "6," + i, "7," + i, "8," + i, "9," + i, "10," + i,
            "11," + i, "12," + i, "13," + i, "14," + i, "15," + i, "16," + i, "17," + i, "18," + i, "19," + i, "20," + i])

    LogStatus("`" + json.dumps(tbl) + "`")
```

```rust
fn main() {
    let tbl_tpl = String::from(r#"{"type": "table", "title": "test scroll", "scroll": "auto", "cols": ["#)
        + r#""col 0", "col 1", "col 2", "col 3", "col 4", "col 5", "col 6", "col 7", "col 8", "col 9", "col 10","#
        + r#""col 11", "col 12", "col 13", "col 14", "col 15", "col 16", "col 17", "col 18", "col 19", "col 20""#
        + r#"], "rows": [__ROWS__]}"#;

    let mut rows: Vec<String> = Vec::new();
    for index in 1..100 {
        let i = index.to_string();
        rows.push(format!(
            r#"[{}, "1,{}", "2,{}", "3,{}", "4,{}", "5,{}", "6,{}", "7,{}", "8,{}", "9,{}", "10,{}", "11,{}", "12,{}", "13,{}", "14,{}", "15,{}", "16,{}", "17,{}", "18,{}", "19,{}", "20,{}"]"#,
            i, i, i, i, i, i, i, i, i, i, i, i, i, i, i, i, i, i, i, i, i
        ));
    }

    let tbl = tbl_tpl.replace("__ROWS__", &rows.join(","));
    LogStatus!(format!("`{}`", tbl));
}
```

列定义只作用于该列的数字，字符串原样显示；单元格对象的设置优先于列定义。格式化后的文字仍按原始数值排序；表格里的搜索与导出CSV使用格式化后的文字。

单独输出表格时，JavaScript、Python直接传表格对象（自动加反引号），也可以写 ``LogStatus("`" + JSON.stringify(tbl) + "`")``；Rust写 ``format!("`{}`", table)``。放进 `grid`、`tabs` 或含组件的数组时不用加反引号。

多个表格组成数组、用反引号包裹输出时显示为标签页；分行输出时自上而下排列。按钮放进单元格的写法见`LogStatus-btnTypeTwo`。

See also: `LogStatus`, `状态栏组件`, `LogStatus-btnTypeTwo`

#### LogStatus-btnTypeOne

状态栏按钮JSON结构的旧写法（输入控件不带```settings```），平台仍然兼容；新代码使用`LogStatus-btnTypeTwo`，字段说明见`LogStatus`的「状态栏按钮」。

按钮可以单独输出到状态栏，也可以嵌入状态栏表格。点击按钮后弹框里的控件用```input```（一个控件）或```group```（一组控件）配置，提交的内容由`GetCommand`收到。例如点击后弹出一个数值输入框：

```json
{
    "type": "button",
    "cmd": "open",
    "name": "开仓",
    "input": {
        "name": "开仓数量",
        "type": "number",
        "defValue": 1
    }
}
```

Fields:

- `type` (string): 对于按钮控件来说固定设置为：```button```。
- `class` (string): 按钮样式，取Bootstrap按钮类名，例如```"btn btn-xs btn-danger"```；取值范例见备注。
- `name` (string): 按钮控件上的文本，即按钮名称。
- `cmd` (string): 按钮控件触发点击操作时，发送给策略的交互命令内容。
- `description` (string): 按钮控件的描述信息，在状态栏中鼠标放在该按钮上时显示的描述信息。
- `disabled` (bool): 设置按钮为禁用（true） / 启用（false）。
- `input` (object): 点击按钮后弹框中的输入控件，字段见备注中的「```input```字段」表。
- `group` (array): 点击按钮后弹框中的一组控件，每个元素的结构与```input```相同。

```input```字段（```group```的每个元素相同）：

| 字段 | 说明 |
| - | - |
| ```name``` | 弹框中控件的标题。 |
| ```description``` | 弹框中控件的描述信息。 |
| ```type``` | 控件类型：```number```数值输入框、```string```字符串输入框、```selected```下拉框、```boolean```开关。 |
| ```defValue``` | 控件的默认值。下拉框可以直接用它写选项（选项之间用竖线分隔）；设置了```options```时它是默认选项，多选时为数组。 |
| ```options``` | 下拉框的选项，元素为字符串或```{text: "描述", value: "值"}```。 |
| ```multiple``` | 为```true```时下拉框可以多选。 |

状态栏中按钮JSON结构的```class```取值范例：
```javascript
function main() {
    var table = {
        type: "table",
        title: "状态栏按钮样式",
        cols: ["默认", "原始", "成功", "信息", "警告", "危险"],
        rows: [
            [
                {"type":"button", "class": "btn btn-xs btn-default", "name": "默认"},
                {"type":"button", "class": "btn btn-xs btn-primary", "name": "原始"},
                {"type":"button", "class": "btn btn-xs btn-success", "name": "成功"},
                {"type":"button", "class": "btn btn-xs btn-info", "name": "信息"},
                {"type":"button", "class": "btn btn-xs btn-warning", "name": "警告"},
                {"type":"button", "class": "btn btn-xs btn-danger", "name": "危险"}
            ]
        ]
    }
    LogStatus("`" + JSON.stringify(table) + "`")
}
```

```group```字段与```input```字段使用范例：
```javascript
function main() {
    // 状态栏按钮控件（设置input字段实现）testBtn1按钮触发的页面中的下拉框控件使用options字段设置选项，使用defValue字段设置默认选项。区别于本章其它例子中直接使用defValue设置选项。
    var testBtn1 = {
        type: "button",
        name: "testBtn1",
        cmd: "cmdTestBtn1",
        input: {name: "testBtn1ComboBox", type: "selected", options: ["A", "B"], defValue: 1}
    }

    /*
      状态栏按钮控件（设置input字段实现）testBtn2按钮触发的页面中的下拉框控件使用options字段设置选项，options字段中的选项不仅支持字符串，
      也支持使用```{text: "描述", value: "值"}```结构。使用defValue字段设置默认选项，默认选项可以是多选（通过数组结构实现多选）。多选需要设置额外的字段multiple为真值（true）。
    */
    var testBtn2 = {
        type: "button",
        name: "testBtn2",
        cmd: "cmdTestBtn2",
        input: {
            name: "testBtn2MultiComboBox",
            type: "selected",
            description: "实现下拉框多选",
            options: [{text: "选项A", value: "A"}, {text: "选项B", value: "B"}, {text: "选项C", value: "C"}],
            defValue: ["A", "C"],
            multiple: true
        }
    }

    // 状态栏分组按钮控件（设置group字段实现）testBtn3按钮触发的页面中的下拉框控件使用options字段设置选项，也支持直接使用defValue设置选项。
    var testBtn3 = {
        type: "button",
        name: "testBtn3",
        cmd: "cmdTestBtn3",
        group: [
            {name: "comboBox1", label: "labelComboBox1", description: "下拉框1", type: "selected", defValue: 1, options: ["A", "B"]},
            {name: "comboBox2", label: "labelComboBox2", description: "下拉框2", type: "selected", defValue: "A|B"},
            {name: "comboBox3", label: "labelComboBox3", description: "下拉框3", type: "selected", defValue: [0, 2], multiple: true, options: ["A", "B", "C"]},
            {
                name: "comboBox4",
                label: "labelComboBox4",
                description: "下拉框4",
                type: "selected",
                defValue: ["A", "C"],
                multiple: true,
                options: [{text: "选项A", value: "A"}, {text: "选项B", value: "B"}, {text: "选项C", value: "C"}, {text: "选项D", value: "D"}]
            }
        ]
    }
    while (true) {
        LogStatus("`" + JSON.stringify(testBtn1) + "`\n", "`" + JSON.stringify(testBtn2) + "`\n", "`" + JSON.stringify(testBtn3) + "`\n")
        var cmd = GetCommand()
        if (cmd) {
            Log(cmd)
        }
        Sleep(5000)
    }
}
```

See also: `LogStatus`

#### LogStatus-btnTypeTwo

状态栏按钮的JSON结构（当前写法，输入控件带```settings```）。按钮可以直接输出到状态栏，也可以放进状态栏表格的单元格。字段、命令格式与```settings```的完整说明见`LogStatus`的「状态栏按钮」。

例如点击后弹出一组输入控件的按钮（```price```只在选择限价单时显示），点击确定后```GetCommand()```收到```open:{"tradeType":1,"direction":"buy","price":60000,"amount":1}```：
```json
{
    "type": "button",
    "cmd": "open",
    "name": "开仓|Open",
    "group": [{
        "type": "selected",
        "name": "tradeType",
        "label": "下单类型|Order type",
        "default": 0,
        "settings": {"options": ["市价单|Market", "限价单|Limit"]}
    }, {
        "type": "selected",
        "name": "direction",
        "label": "方向|Direction",
        "default": "buy",
        "settings": {"render": "segment", "options": [{"name": "买入|Buy", "value": "buy"}, {"name": "卖出|Sell", "value": "sell"}]}
    }, {
        "type": "number",
        "name": "price",
        "label": "价格|Price",
        "required": true,
        "settings": {"filter": "tradeType==1"}
    }, {
        "type": "number",
        "name": "amount",
        "label": "数量|Amount",
        "required": true
    }]
}
```

Fields:

- `type` (string): 固定为```button```。
- `name` (string): 按钮上的文字。
- `cmd` (string): 点击后发送给策略的命令，用```GetCommand()```读取。
- `description` (string): 鼠标悬停时显示的说明。
- `disabled` (bool): ```true```为禁用。
- `class` (string): 按钮样式，例如```"btn btn-xs btn-danger"```。
- `input` (object): 点击后弹出的一个输入控件：```type```、```name```、```label```、```description```、```default```、```required```、```settings```。命令格式为```cmd:输入值```。
- `group` (array): 点击后弹出的一组输入控件，每一项与```input```结构相同，```name```为该控件在命令JSON中的键名。命令格式为```cmd:JSON```。

See also: `LogStatus`, `LogStatus-btnTypeOne`, `GetCommand`

#### 状态栏组件

`LogStatus`直接传带 `type` 的对象，状态栏按类型显示成指标卡、图表、标签页等组件。组件只用于展示，交互用状态栏按钮。

下表列出全部组件，表格与按钮也可以和组件放在一起。

| 组件 | 用途 |
| - | - |
| `grid` | 网格布局，按容器宽度自动减列 |
| `tabs` | 标签页 |
| `kpi` | 指标卡 |
| `stat` | 键值列表 |
| `progress` | 进度条 |
| `gauge` | 仪表盘 |
| `sparkline` | 迷你走势图 |
| `chart` | 折线、柱状、面积图，支持右轴与买卖点 |
| `heatmap` | 热力图 |
| `calendar` | 收益日历 |
| `histogram` | 分布图 |
| `pie` | 饼图 |
| `timeline` | 时间线 |
| `markdown` | Markdown文本 |
| `alert` | 提示条 |
| `badge` | 状态标签 |
| `LogStatus-table` | 表格（`type` 为 `table`），支持列格式与涨跌色 |
| `LogStatus-btnTypeTwo` | 按钮（`type` 为 `button`），点击后策略用`GetCommand`读取 |

##### 通用字段

各组件都可以设置下面的字段，取值写法相同。

| 字段 | 说明 |
| - | - |
| `id` | 稳定标识。组件的个数或顺序会变化时设置，刷新时组件不重建（标签页保持选中，图表不闪动） |
| `span` | 在所在 `grid` 中占几列，默认 `1` |
| `color` | `up` 涨色、`down` 跌色（跟随页面的涨跌色设置，FMZ默认绿涨红跌）、`primary` 主题色、`warning` 警示色、`muted` 次要文字色；其它值被忽略 |
| `format` | 数值格式：`precision` 小数位数；`compact` 为 `true` 时用紧凑写法（1.2万、12.3K）；`percent` 为 `true` 时把比例显示为百分比（`0.12` 显示为 12%）。不设置时最多保留 8 位小数，千分位按页面语言 |

`title`、`label`、`text` 等文字与状态栏文字一样支持 `[trans]` 双语标记。配色随页面的明暗主题切换。写错的组件（缺少必填字段、类型不认识、超出上限）只在自己的位置显示一张错误卡片，写明出错的字段并附上原始 JSON 的前 200 个字符，其它组件照常显示。

##### grid

网格布局：把多个组件排成几列，容器变窄时自动减少列数。

Fields:

- `type` (string): 必填，固定为 `grid`。
- `items` (array): 必填。子组件数组：任意状态栏组件，也可以是表格、按钮对象。
- `cols` (number): 期望列数，`1`–`12`。默认等于子组件个数。
- `minColWidth` (number): 每列最小宽度（像素），放不下时减少列数。默认 `180`。
- `gap` (string): 间距：`sm`、`md`、`lg`。默认 `md`。
- `title` (string): 标题，显示在网格上方。
- `id` (string): 稳定标识。组件的个数或顺序会变化时设置，状态栏刷新时组件不重建。
- `span` (number): 在所在`grid`中占几列。默认 `1`。

一行三张指标卡，显示买一、卖一和最新价。

```javascript
function main() {
    var ticker = exchange.GetTicker()
    if (!ticker) return
    LogStatus({
        type: "grid", cols: 3, minColWidth: 160, items: [
            {type: "kpi", title: "买一", value: ticker.Buy},
            {type: "kpi", title: "卖一", value: ticker.Sell},
            {type: "kpi", title: "最新价", value: ticker.Last}
        ]
    })
}
```

```python
def main():
    ticker = exchange.GetTicker()
    if not ticker:
        return
    LogStatus({
        "type": "grid", "cols": 3, "minColWidth": 160, "items": [
            {"type": "kpi", "title": "买一", "value": ticker["Buy"]},
            {"type": "kpi", "title": "卖一", "value": ticker["Sell"]},
            {"type": "kpi", "title": "最新价", "value": ticker["Last"]}
        ]
    })
```

```rust
fn kpi(title: &str, value: f64) -> String {
    format!(r#"{{"type": "kpi", "title": "{}", "value": {}}}"#, title, value)
}

fn main() {
    let Ok(t) = exchange.GetTicker(None) else { return };
    let items = [kpi("买一", t.Buy), kpi("卖一", t.Sell), kpi("最新价", t.Last)];
    // 组件是一段 JSON 文本，直接传给 LogStatus!，不用加反引号
    LogStatus!(format!(
        r#"{{"type": "grid", "cols": 3, "minColWidth": 160, "items": [{}]}}"#,
        items.join(",")
    ));
}
```

实际列数取「不超过 `cols`、每列不窄于 `minColWidth`」的最大值。子组件的 `span` 按比例缩放：4 列中占 2 列的组件，减到 2 列时占 1 列，减到 1 列时占满一行。

`grid` 与`tabs`可以互相嵌套，最多 6 层，更深的部分显示错误卡片。

直接传组件数组（如 `LogStatus([a, b])`）等同于单列 `grid`，组件从上到下排列。

See also: `LogStatus`, `状态栏组件`, `tabs`, `kpi`

##### tabs

标签页：每页放一组组件，点击切换；状态栏刷新时保持当前选中的页。

Fields:

- `type` (string): 必填，固定为 `tabs`。
- `items` (object数组): 必填。每项是一页。
- `items[].title` (string): 标签文字。
- `items[].items` (array): 该页的组件，按`grid`排列。
- `items[].cols` (number): 该页的列数。默认 `1`。
- `id` (string): 稳定标识。组件的个数或顺序会变化时设置，状态栏刷新时组件不重建。
- `span` (number): 在所在`grid`中占几列。默认 `1`。

两个标签页分别显示行情和账户。

```javascript
function main() {
    var ticker = exchange.GetTicker()
    var account = exchange.GetAccount()
    if (!ticker || !account) return
    LogStatus({type: "tabs", items: [
        {title: "行情", cols: 2, items: [
            {type: "kpi", title: "最新价", value: ticker.Last},
            {type: "kpi", title: "24小时成交量", value: ticker.Volume, format: {compact: true}}
        ]},
        {title: "账户", items: [{type: "stat", items: [
            {label: "可用", value: account.Balance},
            {label: "冻结", value: account.FrozenBalance}
        ]}]}
    ]})
}
```

```python
def main():
    ticker = exchange.GetTicker()
    account = exchange.GetAccount()
    if not ticker or not account:
        return
    LogStatus({"type": "tabs", "items": [
        {"title": "行情", "cols": 2, "items": [
            {"type": "kpi", "title": "最新价", "value": ticker["Last"]},
            {"type": "kpi", "title": "24小时成交量", "value": ticker["Volume"],
             "format": {"compact": True}}
        ]},
        {"title": "账户", "items": [{"type": "stat", "items": [
            {"label": "可用", "value": account["Balance"]},
            {"label": "冻结", "value": account["FrozenBalance"]}
        ]}]}
    ]})
```

```rust
fn main() {
    let Ok(t) = exchange.GetTicker(None) else { return };
    let Ok(a) = exchange.GetAccount() else { return };
    let market = format!(
        r#"{{"title": "行情", "cols": 2, "items": [
            {{"type": "kpi", "title": "最新价", "value": {}}},
            {{"type": "kpi", "title": "24小时成交量", "value": {},
              "format": {{"compact": true}}}}]}}"#,
        t.Last, t.Volume
    );
    let account = format!(
        r#"{{"title": "账户", "items": [{{"type": "stat", "items": [
            {{"label": "可用", "value": {}}}, {{"label": "冻结", "value": {}}}]}}]}}"#,
        a.Balance, a.FrozenBalance
    );
    // 整个状态栏只有这一段组件 JSON 时，JSON 可以写成多行
    LogStatus!(format!(r#"{{"type": "tabs", "items": [{}, {}]}}"#, market, account));
}
```

`tabs` 没有自己的标题。各页内容与 `grid` 一样按容器宽度自动减列，嵌套最多 6 层。

只含表格的数组用反引号包裹输出时（旧写法）也显示为标签页，见`LogStatus-table`。

See also: `LogStatus`, `状态栏组件`, `grid`, `LogStatus-table`

##### kpi

指标卡：醒目显示一个数值，可带单位、涨跌幅和说明，适合权益、收益率、最新价。

Fields:

- `type` (string): 必填，固定为 `kpi`。
- `value` (number / string): 必填。显示的数值：数字按 `format` 格式化，字符串原样显示。
- `unit` (string): 单位，显示在数值后面。
- `delta` (number): 变化量：正数显示涨色 ▲，负数显示跌色 ▼，保留 2 位小数。
- `deltaUnit` (string): `delta` 的单位。默认 `%`。
- `format` (object): 数值格式 `{precision, compact, percent}`，见`状态栏组件`。
- `color` (string): 颜色：`up`、`down`、`primary`、`warning`、`muted`，见`状态栏组件`。
- `hint` (string): 数值下方的补充说明。
- `title` (string): 标题，显示在组件左上角。
- `id` (string): 稳定标识。组件的个数或顺序会变化时设置，状态栏刷新时组件不重建。
- `span` (number): 在所在`grid`中占几列。默认 `1`。

用指标卡显示最新价，以及它相对开盘价的涨跌幅。

```javascript
function main() {
    var ticker = exchange.GetTicker()
    if (!ticker) return
    var change = ticker.Open > 0 ? (ticker.Last / ticker.Open - 1) * 100 : 0
    LogStatus({type: "kpi", title: "最新价", value: ticker.Last,
        delta: change, hint: "相对开盘价"})
}
```

```python
def main():
    ticker = exchange.GetTicker()
    if not ticker:
        return
    change = (ticker["Last"] / ticker["Open"] - 1) * 100 if ticker["Open"] > 0 else 0
    LogStatus({"type": "kpi", "title": "最新价", "value": ticker["Last"],
               "delta": change, "hint": "相对开盘价"})
```

```rust
fn main() {
    let Ok(t) = exchange.GetTicker(None) else { return };
    let change = if t.Open > 0.0 { (t.Last / t.Open - 1.0) * 100.0 } else { 0.0 };
    LogStatus!(format!(
        r#"{{"type": "kpi", "title": "最新价", "value": {}, "delta": {}, "hint": "相对开盘价"}}"#,
        t.Last, change
    ));
}
```

`delta` 写变化量本身，不是比例：涨 3.2% 写 `3.2`。`value` 用 `format.percent` 显示百分比时传比例（`0.032`）。

See also: `LogStatus`, `状态栏组件`, `stat`, `sparkline`

##### stat

键值列表：一组「名称—数值」，适合账户余额、冻结资金、杠杆、强平价等明细。

Fields:

- `type` (string): 必填，固定为 `stat`。
- `items` (object数组): 必填。缺少 `label` 或 `value` 的项被跳过。
- `items[].label` (string): 必填。名称。
- `items[].value` (number / string): 必填。数值或文字。
- `items[].unit` (string): 单位。
- `items[].color` (string): 颜色：`up`、`down`、`primary`、`warning`、`muted`，见`状态栏组件`。
- `items[].format` (object): 数值格式 `{precision, compact, percent}`，见`状态栏组件`。
- `items[].hint` (string): 数值后的补充说明。
- `cols` (number): 并排几列，`1`–`4`。默认 `1`。
- `title` (string): 标题，显示在组件左上角。
- `id` (string): 稳定标识。组件的个数或顺序会变化时设置，状态栏刷新时组件不重建。
- `span` (number): 在所在`grid`中占几列。默认 `1`。

两列显示账户的可用资金、冻结资金和更新时间。

```javascript
function main() {
    var account = exchange.GetAccount()
    if (!account) return
    var f2 = {precision: 2}
    LogStatus({type: "stat", title: "账户", cols: 2, items: [
        {label: "可用", value: account.Balance, unit: "USDT", format: f2},
        {label: "冻结", value: account.FrozenBalance, unit: "USDT", format: f2},
        {label: "更新时间", value: _D()}
    ]})
}
```

```python
def main():
    account = exchange.GetAccount()
    if not account:
        return
    f2 = {"precision": 2}
    LogStatus({"type": "stat", "title": "账户", "cols": 2, "items": [
        {"label": "可用", "value": account["Balance"], "unit": "USDT", "format": f2},
        {"label": "冻结", "value": account["FrozenBalance"], "unit": "USDT", "format": f2},
        {"label": "更新时间", "value": _D()}
    ]})
```

```rust
fn main() {
    let Ok(a) = exchange.GetAccount() else { return };
    let item = |label: &str, v: f64| format!(
        r#"{{"label": "{}", "value": {}, "unit": "USDT", "format": {{"precision": 2}}}}"#,
        label, v
    );
    let items = [
        item("可用", a.Balance),
        item("冻结", a.FrozenBalance),
        format!(r#"{{"label": "更新时间", "value": "{}"}}"#, _D(None)),
    ];
    LogStatus!(format!(
        r#"{{"type": "stat", "title": "账户", "cols": 2, "items": [{}]}}"#,
        items.join(",")
    ));
}
```

See also: `LogStatus`, `状态栏组件`, `kpi`, `Account`

##### progress

进度条：显示一个比例，或「当前值 / 总数」。

Fields:

- `type` (string): 必填，固定为 `progress`。
- `value` (number): 必填。当前值。
- `max` (number): 总数，给出时显示 `value / max`；不给时 `value` 是 `0`–`1` 的比例，显示为百分比。
- `color` (string): 进度条颜色，默认 `primary`。取值见`状态栏组件`。
- `title` (string): 标题，显示在组件左上角。
- `id` (string): 稳定标识。组件的个数或顺序会变化时设置，状态栏刷新时组件不重建。
- `span` (number): 在所在`grid`中占几列。默认 `1`。

显示冻结资金的占比，以及今日下单次数相对上限的进度。

```javascript
function main() {
    var account = exchange.GetAccount()
    if (!account) return
    var total = account.Balance + account.FrozenBalance
    var frozen = total > 0 ? account.FrozenBalance / total : 0
    var orders = 3   // 策略自己统计的下单次数
    LogStatus([
        {type: "progress", title: "冻结资金占比", value: frozen},
        {type: "progress", title: "今日下单次数", value: orders, max: 20, color: "warning"}
    ])
}
```

```python
def main():
    account = exchange.GetAccount()
    if not account:
        return
    total = account["Balance"] + account["FrozenBalance"]
    frozen = account["FrozenBalance"] / total if total > 0 else 0
    orders = 3   # 策略自己统计的下单次数
    LogStatus([
        {"type": "progress", "title": "冻结资金占比", "value": frozen},
        {"type": "progress", "title": "今日下单次数", "value": orders, "max": 20,
         "color": "warning"}
    ])
```

```rust
fn main() {
    let Ok(a) = exchange.GetAccount() else { return };
    let total = a.Balance + a.FrozenBalance;
    let frozen = if total > 0.0 { a.FrozenBalance / total } else { 0.0 };
    let orders = 3; // 策略自己统计的下单次数
    LogStatus!(format!(
        r#"[{{"type": "progress", "title": "冻结资金占比", "value": {}}},
           {{"type": "progress", "title": "今日下单次数", "value": {}, "max": 20,
             "color": "warning"}}]"#,
        frozen, orders
    ));
}
```

See also: `LogStatus`, `状态栏组件`, `gauge`

##### gauge

仪表盘：用半圆刻度显示数值在区间中的位置，可按阈值变色，适合RSI、仓位、风险度。

Fields:

- `type` (string): 必填，固定为 `gauge`。
- `value` (number): 必填。当前值。
- `min` (number): 区间下限。默认 `0`。
- `max` (number): 区间上限，必须大于 `min`。默认 `1`。
- `unit` (string): 单位。
- `format` (object): 数值格式 `{precision, compact, percent}`，见`状态栏组件`。
- `color` (string): 没有命中阈值时的颜色，默认 `primary`。取值见`状态栏组件`。
- `thresholds` (object数组): 阈值：取 `value` 已达到的最大阈值的颜色。
- `thresholds[].value` (number): 达到这个值起使用 `color`。
- `thresholds[].color` (string): 颜色：`up`、`down`、`primary`、`warning`、`muted`，见`状态栏组件`。
- `title` (string): 标题，显示在组件左上角。
- `id` (string): 稳定标识。组件的个数或顺序会变化时设置，状态栏刷新时组件不重建。
- `span` (number): 在所在`grid`中占几列。默认 `1`。

显示最新价在最近24小时高低区间中的位置，靠近两端时变色。

```javascript
function main() {
    var r = exchange.GetRecords(PERIOD_H1)
    if (!r || r.length < 24) return
    var bars = r.slice(-24)
    var hi = Math.max.apply(null, bars.map(function (b) { return b.High }))
    var lo = Math.min.apply(null, bars.map(function (b) { return b.Low }))
    var pos = hi > lo ? (bars[23].Close - lo) / (hi - lo) : 0.5
    var levels = [{value: 0, color: "down"}, {value: 0.2, color: "primary"},
        {value: 0.8, color: "up"}]
    LogStatus({type: "gauge", title: "24小时区间位置", value: pos,
        format: {percent: true}, thresholds: levels})
}
```

```python
def main():
    r = exchange.GetRecords(PERIOD_H1)
    if not r or len(r) < 24:
        return
    bars = r[-24:]
    hi = max(b["High"] for b in bars)
    lo = min(b["Low"] for b in bars)
    pos = (bars[-1]["Close"] - lo) / (hi - lo) if hi > lo else 0.5
    levels = [{"value": 0, "color": "down"}, {"value": 0.2, "color": "primary"},
              {"value": 0.8, "color": "up"}]
    LogStatus({"type": "gauge", "title": "24小时区间位置", "value": pos,
               "format": {"percent": True}, "thresholds": levels})
```

```rust
fn main() {
    let Ok(r) = exchange.GetRecords(None, PERIOD_H1, None) else { return };
    if r.len() < 24 { return; }
    let bars = &r[r.len() - 24..];
    let hi = bars.iter().map(|b| b.High).fold(f64::MIN, f64::max);
    let lo = bars.iter().map(|b| b.Low).fold(f64::MAX, f64::min);
    let pos = if hi > lo { (bars[23].Close - lo) / (hi - lo) } else { 0.5 };
    LogStatus!(format!(
        r#"{{"type": "gauge", "title": "24小时区间位置", "value": {},
            "format": {{"percent": true}},
            "thresholds": [{{"value": 0, "color": "down"}}, {{"value": 0.2, "color": "primary"}},
                           {{"value": 0.8, "color": "up"}}]}}"#,
        pos
    ));
}
```

`max` 不大于 `min` 时显示错误卡片。

See also: `LogStatus`, `状态栏组件`, `progress`, `kpi`

##### sparkline

迷你走势图：一个数值加一条小折线，默认按首尾涨跌着色。

Fields:

- `type` (string): 必填，固定为 `sparkline`。
- `data` (数值数组): 必填。至少 2 个数字，非数字项被忽略。
- `value` (number / string): 大字显示的数值。默认取 `data` 的最后一个。
- `unit` (string): 单位。
- `format` (object): 数值格式 `{precision, compact, percent}`，见`状态栏组件`。
- `color` (string): 折线颜色，默认按首尾比较取 `up`、`down`。取值见`状态栏组件`。
- `title` (string): 标题，显示在组件左上角。
- `id` (string): 稳定标识。组件的个数或顺序会变化时设置，状态栏刷新时组件不重建。
- `span` (number): 在所在`grid`中占几列。默认 `1`。

显示最近24根小时K线收盘价的走势。

```javascript
function main() {
    var r = exchange.GetRecords(PERIOD_H1)
    if (!r || r.length < 24) return
    var closes = r.slice(-24).map(function (b) { return b.Close })
    LogStatus({type: "sparkline", title: "最近24小时", data: closes})
}
```

```python
def main():
    r = exchange.GetRecords(PERIOD_H1)
    if not r or len(r) < 24:
        return
    closes = [b["Close"] for b in r[-24:]]
    LogStatus({"type": "sparkline", "title": "最近24小时", "data": closes})
```

```rust
fn main() {
    let Ok(r) = exchange.GetRecords(None, PERIOD_H1, None) else { return };
    if r.len() < 24 { return; }
    let closes: Vec<String> = r[r.len() - 24..].iter().map(|b| b.Close.to_string()).collect();
    LogStatus!(format!(
        r#"{{"type": "sparkline", "title": "最近24小时", "data": [{}]}}"#,
        closes.join(",")
    ));
}
```

首尾两个数同号时，数值旁显示首尾变化的百分比；异号时（如资金费率由正转负）不显示。

See also: `LogStatus`, `状态栏组件`, `chart`, `kpi`

##### chart

简易图表：折线、柱状或面积，支持多条序列、右侧纵轴和买卖点标记；需要更多配置时用`Chart`。

Fields:

- `type` (string): 必填，固定为 `chart`。
- `series` (object数组): 必填。数据序列。
- `series[].data` (数值数组): 必填。与 `x` 一一对应；非数字处断开。
- `series[].name` (string): 图例名称。
- `series[].kind` (string): 该序列的类型，覆盖 `kind`。
- `series[].color` (string): 序列颜色，默认按顺序分配。取值见`状态栏组件`。
- `series[].axis` (string): 写 `right` 画在右侧纵轴，用于量级不同的数据（如价格与成交量）。
- `kind` (string): `line`、`bar` 或 `area`。默认 `line`。
- `x` (string数组 / 数值数组): 横轴刻度。全是毫秒时间戳时按时间轴显示；不给时按序号。
- `marks` (object数组): 标记点，如买卖点、调仓点。
- `marks[].x` (string / number): 必填。`x` 中的一个值；时间轴上取最近的点。
- `marks[].y` (number): 纵坐标。默认取第一条序列在该处的值。
- `marks[].text` (string): 标记文字。
- `marks[].color` (string): `up` 画 ▲（在线下方），`down` 画 ▼（在线上方），其它画圆点。
- `stacked` (bool): 堆叠显示。默认 `false`。
- `height` (number): 高度（像素），`120`–`600`。默认 `260`。
- `format` (object): 左轴数值格式，默认 `{"compact": true}`，见`状态栏组件`。
- `rightFormat` (object): 右轴数值格式。默认同 `format`。
- `title` (string): 标题，显示在组件左上角。
- `id` (string): 稳定标识。组件的个数或顺序会变化时设置，状态栏刷新时组件不重建。
- `span` (number): 在所在`grid`中占几列。默认 `1`。

收盘价折线叠加右轴成交量柱，并在最高收盘价处做标记。

```javascript
function main() {
    var r = exchange.GetRecords(PERIOD_H1)
    if (!r || r.length < 48) return
    r = r.slice(-48)
    var top = r.reduce(function (a, b) { return b.Close > a.Close ? b : a })
    LogStatus({
        type: "chart", title: "最近48小时",
        x: r.map(function (b) { return b.Time }),
        series: [
            {name: "收盘价", data: r.map(function (b) { return b.Close })},
            {name: "成交量", kind: "bar", axis: "right", color: "muted",
                data: r.map(function (b) { return b.Volume })}
        ],
        marks: [{x: top.Time, text: "最高", color: "up"}]
    })
}
```

```python
def main():
    r = exchange.GetRecords(PERIOD_H1)
    if not r or len(r) < 48:
        return
    r = r[-48:]
    top = max(r, key=lambda b: b["Close"])
    LogStatus({
        "type": "chart", "title": "最近48小时",
        "x": [b["Time"] for b in r],
        "series": [
            {"name": "收盘价", "data": [b["Close"] for b in r]},
            {"name": "成交量", "kind": "bar", "axis": "right", "color": "muted",
             "data": [b["Volume"] for b in r]}
        ],
        "marks": [{"x": top["Time"], "text": "最高", "color": "up"}]
    })
```

```rust
fn join<T: ToString>(v: impl Iterator<Item = T>) -> String {
    v.map(|x| x.to_string()).collect::<Vec<_>>().join(",")
}

fn main() {
    let Ok(r) = exchange.GetRecords(None, PERIOD_H1, None) else { return };
    if r.len() < 48 { return; }
    let r = &r[r.len() - 48..];
    let top = r.iter().fold(&r[0], |a, b| if b.Close > a.Close { b } else { a });
    LogStatus!(format!(
        r#"{{"type": "chart", "title": "最近48小时", "x": [{}], "series": [
            {{"name": "收盘价", "data": [{}]}},
            {{"name": "成交量", "kind": "bar", "axis": "right", "color": "muted", "data": [{}]}}],
            "marks": [{{"x": {}, "text": "最高", "color": "up"}}]}}"#,
        join(r.iter().map(|b| b.Time)),
        join(r.iter().map(|b| b.Close)),
        join(r.iter().map(|b| b.Volume)),
        top.Time
    ));
}
```

每条序列最多 5000 个点，超出时显示错误卡片。多条序列时显示图例；在图上拖动可以放大横轴区间。

See also: `LogStatus`, `状态栏组件`, `sparkline`, `Chart`, `KLineChart`

##### heatmap

热力图：二维网格按数值深浅着色，适合时段 × 品种的收益、相关性矩阵。

Fields:

- `type` (string): 必填，固定为 `heatmap`。
- `x` (string数组 / 数值数组): 必填。横轴刻度。
- `y` (string数组 / 数值数组): 必填。纵轴刻度，第一个在最下面。
- `z` (array): 必填。二维数值数组 `z[行][列]`：行数等于 `y` 的个数，每行的个数等于 `x` 的个数；非数字的格子留空。
- `min` (number): 颜色映射的下限。默认取数据最小值。
- `max` (number): 颜色映射的上限。默认取数据最大值。
- `color` (string): 单色深浅。不设置且数据有正有负时，正值涨色、负值跌色，深浅按绝对值。取值见`状态栏组件`。
- `format` (object): 数值格式 `{precision, compact, percent}`，见`状态栏组件`。
- `height` (number): 高度（像素），`120`–`600`。默认 `260`。
- `title` (string): 标题，显示在组件左上角。
- `id` (string): 稳定标识。组件的个数或顺序会变化时设置，状态栏刷新时组件不重建。
- `span` (number): 在所在`grid`中占几列。默认 `1`。

用小时K线画最近3天每个小时的涨跌幅。

```javascript
function main() {
    var r = exchange.GetRecords(PERIOD_H1)
    if (!r || r.length < 73) return
    var rets = r.slice(-73).map(function (b, i, a) { return i ? b.Close / a[i - 1].Close - 1 : 0 })
    var days = [1, 25, 49]   // 每天 24 根，第一行是最早的一天
    LogStatus({
        type: "heatmap", title: "最近3天逐小时涨跌", format: {percent: true, precision: 2},
        x: r.slice(-24).map(function (b) { return _D(b.Time, "hh:00") }),
        y: days.map(function (d) { return _D(r[r.length - 73 + d].Time, "MM-dd") }),
        z: days.map(function (d) { return rets.slice(d, d + 24) })
    })
}
```

```python
def main():
    r = exchange.GetRecords(PERIOD_H1)
    if not r or len(r) < 73:
        return
    bars = r[-73:]
    rets = [0] + [bars[i]["Close"] / bars[i - 1]["Close"] - 1 for i in range(1, 73)]
    days = [1, 25, 49]   # 每天 24 根，第一行是最早的一天
    LogStatus({
        "type": "heatmap", "title": "最近3天逐小时涨跌",
        "format": {"percent": True, "precision": 2},
        "x": [_D(b["Time"] / 1000, "%H:00") for b in bars[-24:]],
        "y": [_D(bars[d]["Time"] / 1000, "%m-%d") for d in days],
        "z": [rets[d:d + 24] for d in days]
    })
```

```rust
fn main() {
    let Ok(r) = exchange.GetRecords(None, PERIOD_H1, None) else { return };
    if r.len() < 73 { return; }
    let bars = &r[r.len() - 73..];
    let days = [1usize, 25, 49]; // 每天 24 根，第一行是最早的一天
    // Rust 的 _D() 固定输出 UTC 时间
    let x: Vec<String> = bars[49..].iter()
        .map(|b| format!("\"{}:00\"", &_D(b.Time)[11..13]))
        .collect();
    let y: Vec<String> = days.iter()
        .map(|&d| format!("\"{}\"", &_D(bars[d].Time)[5..10]))
        .collect();
    let ret = |i: usize| (bars[i].Close / bars[i - 1].Close - 1.0).to_string();
    let row = |d: usize| format!("[{}]", (d..d + 24).map(ret).collect::<Vec<_>>().join(","));
    let z: Vec<String> = days.iter().map(|&d| row(d)).collect();
    LogStatus!(format!(
        r#"{{"type": "heatmap", "title": "最近3天逐小时涨跌",
            "format": {{"percent": true, "precision": 2}},
            "x": [{}], "y": [{}], "z": [{}]}}"#,
        x.join(","), y.join(","), z.join(",")
    ));
}
```

`x` 与 `y` 个数的乘积不超过 40000，超出或 `z` 的行列数对不上时显示错误卡片。鼠标悬停显示格子的数值。

See also: `LogStatus`, `状态栏组件`, `calendar`, `chart`

##### calendar

收益日历：按日的热力格（类似贡献图），或按年 × 月的收益表。

Fields:

- `type` (string): 必填，固定为 `calendar`。
- `data` (array): 必填。`[日期, 数值]` 数组：日期为毫秒时间戳，或 `YYYY-MM-DD`、`YYYY-MM` 字符串；同一天的值相加。
- `mode` (string): `day`：按日热力格，最多显示 53 周；`month`：年 × 月表格，带全年合计。默认 `day`。
- `format` (object): 数值格式 `{precision, compact, percent}`，见`状态栏组件`。
- `title` (string): 标题，显示在组件左上角。
- `id` (string): 稳定标识。组件的个数或顺序会变化时设置，状态栏刷新时组件不重建。
- `span` (number): 在所在`grid`中占几列。默认 `1`。

用日K线的每日涨跌幅画收益日历。

```javascript
function main() {
    var r = exchange.GetRecords(PERIOD_D1)
    if (!r || r.length < 2) return
    var data = r.slice(1).map(function (b, i) { return [b.Time, b.Close / r[i].Close - 1] })
    LogStatus({type: "calendar", title: "每日涨跌", data: data,
        format: {percent: true, precision: 2}})
}
```

```python
def main():
    r = exchange.GetRecords(PERIOD_D1)
    if not r or len(r) < 2:
        return
    data = [[r[i]["Time"], r[i]["Close"] / r[i - 1]["Close"] - 1] for i in range(1, len(r))]
    LogStatus({"type": "calendar", "title": "每日涨跌", "data": data,
               "format": {"percent": True, "precision": 2}})
```

```rust
fn main() {
    let Ok(r) = exchange.GetRecords(None, PERIOD_D1, None) else { return };
    if r.len() < 2 { return; }
    let data: Vec<String> = r.windows(2)
        .map(|w| format!("[{}, {}]", w[1].Time, w[1].Close / w[0].Close - 1.0))
        .collect();
    LogStatus!(format!(
        r#"{{"type": "calendar", "title": "每日涨跌", "data": [{}],
            "format": {{"percent": true, "precision": 2}}}}"#,
        data.join(",")
    ));
}
```

正值涨色、负值跌色，深浅按绝对值。`day` 模式只显示精确到日的数据；`month` 模式把同一个月的值相加。时间戳按浏览器所在时区换算成日期。

See also: `LogStatus`, `状态栏组件`, `heatmap`, `histogram`

##### histogram

分布图：传原始数据，自动分组统计次数，并显示样本数、均值、中位数和正值占比。

Fields:

- `type` (string): 必填，固定为 `histogram`。
- `data` (数值数组): 必填。原始数据，至少 2 个数字。
- `bins` (number): 组数，`1`–`100`。默认取样本数的平方根，限制在 `5`–`40`。
- `format` (object): 分组边界与统计值的格式，见`状态栏组件`。
- `color` (string): 柱子颜色。默认正值组涨色、负值组跌色。取值见`状态栏组件`。
- `height` (number): 高度（像素），`120`–`600`。默认 `220`。
- `title` (string): 标题，显示在组件左上角。
- `id` (string): 稳定标识。组件的个数或顺序会变化时设置，状态栏刷新时组件不重建。
- `span` (number): 在所在`grid`中占几列。默认 `1`。

显示最近200根小时K线涨跌幅的分布。

```javascript
function main() {
    var r = exchange.GetRecords(PERIOD_H1)
    if (!r || r.length < 3) return
    r = r.slice(-201)
    var rets = r.slice(1).map(function (b, i) { return b.Close / r[i].Close - 1 })
    LogStatus({type: "histogram", title: "小时涨跌分布", data: rets,
        format: {percent: true, precision: 2}})
}
```

```python
def main():
    r = exchange.GetRecords(PERIOD_H1)
    if not r or len(r) < 3:
        return
    r = r[-201:]
    rets = [r[i]["Close"] / r[i - 1]["Close"] - 1 for i in range(1, len(r))]
    LogStatus({"type": "histogram", "title": "小时涨跌分布", "data": rets,
               "format": {"percent": True, "precision": 2}})
```

```rust
fn main() {
    let Ok(r) = exchange.GetRecords(None, PERIOD_H1, None) else { return };
    if r.len() < 3 { return; }
    let r = &r[r.len().saturating_sub(201)..];
    let rets: Vec<String> = r.windows(2)
        .map(|w| (w[1].Close / w[0].Close - 1.0).to_string())
        .collect();
    LogStatus!(format!(
        r#"{{"type": "histogram", "title": "小时涨跌分布", "data": [{}],
            "format": {{"percent": true, "precision": 2}}}}"#,
        rets.join(",")
    ));
}
```

数据有正有负时，`0` 落在分组边界上，盈利与亏损不会混在同一组。

See also: `LogStatus`, `状态栏组件`, `calendar`, `chart`

##### pie

饼图：各部分占总数的比例，默认环形，中心显示合计。

Fields:

- `type` (string): 必填，固定为 `pie`。
- `items` (object数组): 必填。各部分；缺少 `name`、`value` 或 `value` 为负的项被跳过。
- `items[].name` (string): 必填。名称。
- `items[].value` (number): 必填。数值，不小于 `0`。
- `items[].color` (string): 颜色，默认按顺序分配。取值见`状态栏组件`。
- `donut` (bool): 环形图；`false` 为实心饼图。默认 `true`。
- `legend` (bool): 在图旁列出各项。默认 `false`，鼠标悬停（手机上点按）时显示数值。
- `format` (object): 数值格式 `{precision, compact, percent}`，见`状态栏组件`。
- `title` (string): 标题，显示在组件左上角。
- `id` (string): 稳定标识。组件的个数或顺序会变化时设置，状态栏刷新时组件不重建。
- `span` (number): 在所在`grid`中占几列。默认 `1`。

显示各持仓占用保证金的比例。

```javascript
function main() {
    exchange.SetContractType("swap")
    var positions = exchange.GetPositions()
    if (!positions) return
    var items = positions.map(function (p) { return {name: p.Symbol, value: p.Margin} })
    LogStatus({type: "pie", title: "保证金占用", legend: true, items: items,
        format: {precision: 2}})
}
```

```python
def main():
    exchange.SetContractType("swap")
    positions = exchange.GetPositions()
    if positions is None:
        return
    items = [{"name": p["Symbol"], "value": p["Margin"]} for p in positions]
    LogStatus({"type": "pie", "title": "保证金占用", "legend": True, "items": items,
               "format": {"precision": 2}})
```

```rust
fn main() {
    if exchange.SetContractType("swap").is_err() { return; }
    let Ok(positions) = exchange.GetPositions(None) else { return };
    let items: Vec<String> = positions.iter()
        .map(|p| format!(r#"{{"name": "{}", "value": {}}}"#, p.Symbol, p.Margin))
        .collect();
    LogStatus!(format!(
        r#"{{"type": "pie", "title": "保证金占用", "legend": true, "items": [{}],
            "format": {{"precision": 2}}}}"#,
        items.join(",")
    ));
}
```

See also: `LogStatus`, `状态栏组件`, `stat`, `Position`

##### timeline

时间线：按顺序列出事件，适合成交记录、交易信号、风控事件。

Fields:

- `type` (string): 必填，固定为 `timeline`。
- `items` (object数组): 必填。事件，按数组顺序从上到下显示；缺少 `text` 的项被跳过。
- `items[].text` (string): 必填。事件内容。
- `items[].time` (number / string): 毫秒时间戳或任意文字；时间戳为零点时只显示日期。
- `items[].color` (string): 圆点颜色，默认 `primary`。取值见`状态栏组件`。
- `title` (string): 标题，显示在组件左上角。
- `id` (string): 稳定标识。组件的个数或顺序会变化时设置，状态栏刷新时组件不重建。
- `span` (number): 在所在`grid`中占几列。默认 `1`。

列出策略自己记录的最近几条事件，新的在上面。

```javascript
function main() {
    var events = []
    var add = function (text, color) {
        events.unshift({time: Date.now(), text: text, color: color})
        if (events.length > 10) events.pop()
    }
    add("策略启动", "primary")
    add("价格突破", "up")
    add("风控检查通过", "muted")
    LogStatus({type: "timeline", title: "最近事件", items: events})
}
```

```python
import time

def main():
    events = []
    def add(text, color):
        events.insert(0, {"time": int(time.time() * 1000), "text": text, "color": color})
        del events[10:]
    add("策略启动", "primary")
    add("价格突破", "up")
    add("风控检查通过", "muted")
    LogStatus({"type": "timeline", "title": "最近事件", "items": events})
```

```rust
fn main() {
    let mut events: Vec<String> = Vec::new();
    let mut add = |text: &str, color: &str| {
        let ms = UnixNano() / 1_000_000;
        let e = format!(r#"{{"time": {}, "text": "{}", "color": "{}"}}"#, ms, text, color);
        events.insert(0, e);
        events.truncate(10);
    };
    add("策略启动", "primary");
    add("价格突破", "up");
    add("风控检查通过", "muted");
    LogStatus!(format!(
        r#"{{"type": "timeline", "title": "最近事件", "items": [{}]}}"#,
        events.join(",")
    ));
}
```

See also: `LogStatus`, `状态栏组件`, `alert`, `chart`

##### markdown

按Markdown排版显示文本：标题、列表、粗体、表格等，适合策略说明与行情解读。

Fields:

- `type` (string): 必填，固定为 `markdown`。
- `text` (string): 必填。Markdown 文本。
- `id` (string): 稳定标识。组件的个数或顺序会变化时设置，状态栏刷新时组件不重建。
- `span` (number): 在所在`grid`中占几列。默认 `1`。

根据账户数据生成一段带标题和列表的说明。

```javascript
function main() {
    var account = exchange.GetAccount()
    if (!account) return
    var text = "#### 账户概况\n" +
        "- 可用资金：**" + _N(account.Balance, 2) + "** USDT\n" +
        "- 冻结资金：" + _N(account.FrozenBalance, 2) + " USDT\n" +
        "- 更新时间：" + _D()
    LogStatus({type: "markdown", text: text})
}
```

```python
def main():
    account = exchange.GetAccount()
    if not account:
        return
    text = ("#### 账户概况\n" +
        "- 可用资金：**" + str(_N(account["Balance"], 2)) + "** USDT\n" +
        "- 冻结资金：" + str(_N(account["FrozenBalance"], 2)) + " USDT\n" +
        "- 更新时间：" + _D())
    LogStatus({"type": "markdown", "text": text})
```

```rust
fn main() {
    let Ok(a) = exchange.GetAccount() else { return };
    let text = format!(
        "#### 账户概况\\n- 可用资金：**{}** USDT\\n- 冻结资金：{} USDT\\n- 更新时间：{}",
        _N(a.Balance, 2), _N(a.FrozenBalance, 2), _D(None)
    );
    // 换行写成 JSON 转义 \\n，放进 JSON 字符串里
    LogStatus!(format!(r#"{{"type": "markdown", "text": "{}"}}"#, text));
}
```

状态栏的普通文字不解析 Markdown，需要排版时用这个组件。

See also: `LogStatus`, `状态栏组件`, `alert`

##### alert

提示条：带图标的提示、成功、警告或错误信息，适合风控与异常提示。

Fields:

- `type` (string): 必填，固定为 `alert`。
- `level` (string): 级别：`info`、`success`、`warning`、`error`。默认 `info`。
- `title` (string): 标题。`title` 与 `text` 至少给一个。
- `text` (string): 说明文字；只给 `text` 时它作为标题显示。
- `id` (string): 稳定标识。组件的个数或顺序会变化时设置，状态栏刷新时组件不重建。
- `span` (number): 在所在`grid`中占几列。默认 `1`。

可用资金低于阈值时显示警告，否则显示检查通过。

```javascript
function main() {
    var account = exchange.GetAccount()
    if (!account) return
    var alert = account.Balance < 100
        ? {type: "alert", level: "warning", title: "可用资金不足", text: "低于100，暂停开新仓"}
        : {type: "alert", level: "success", title: "资金检查通过"}
    LogStatus(alert)
}
```

```python
def main():
    account = exchange.GetAccount()
    if not account:
        return
    if account["Balance"] < 100:
        alert = {"type": "alert", "level": "warning", "title": "可用资金不足",
                 "text": "低于100，暂停开新仓"}
    else:
        alert = {"type": "alert", "level": "success", "title": "资金检查通过"}
    LogStatus(alert)
```

```rust
fn main() {
    let Ok(a) = exchange.GetAccount() else { return };
    let alert = if a.Balance < 100.0 {
        r#"{"type": "alert", "level": "warning",
            "title": "可用资金不足", "text": "低于100，暂停开新仓"}"#
    } else {
        r#"{"type": "alert", "level": "success", "title": "资金检查通过"}"#
    };
    // 整段状态栏只有这一段 JSON，可以跨行
    LogStatus!(alert);
}
```

See also: `LogStatus`, `状态栏组件`, `badge`, `markdown`

##### badge

状态标签：一组带圆点的小标签，在行内显示，可以跟在一行文字后面。

Fields:

- `type` (string): 必填，固定为 `badge`。
- `items` (object数组): 必填。至少一个有 `text` 的标签。
- `items[].text` (string): 必填。标签文字。
- `items[].color` (string): 颜色，默认 `primary`。取值见`状态栏组件`。
- `id` (string): 稳定标识。组件的个数或顺序会变化时设置，状态栏刷新时组件不重建。
- `span` (number): 在所在`grid`中占几列。默认 `1`。

在标题文字后面显示运行模式和运行状态。

```javascript
function main() {
    LogStatus("均线策略", {type: "badge", items: [
        {text: IsVirtual() ? "回测" : "实盘", color: "muted"},
        {text: "运行中", color: "up"}
    ]})
}
```

```python
def main():
    LogStatus("均线策略", {"type": "badge", "items": [
        {"text": "回测" if IsVirtual() else "实盘", "color": "muted"},
        {"text": "运行中", "color": "up"}
    ]})
```

```rust
fn main() {
    let mode = if IsVirtual() { "回测" } else { "实盘" };
    let item = |text: &str, color: &str| format!(r#"{{"text": "{}", "color": "{}"}}"#, text, color);
    let badge = format!(
        r#"{{"type": "badge", "items": [{}, {}]}}"#,
        item(mode, "muted"), item("运行中", "up")
    );
    // 文字和组件在同一行：组件放在最后，JSON 写成一行
    LogStatus!("均线策略", badge);
}
```

See also: `LogStatus`, `状态栏组件`, `alert`, `kpi`

#### Chart-options

该JSON用于设置自定义画图函数```Chart()```的图表配置信息，图表库使用的是Highcharts。这里只列出几个基本的配置字段。

Fields:

- `__isStock` (bool): 平台扩展字段。设置为true，使用的是Highstocks图表；设置为false，使用的是Highcharts图表。
- `extension` (object): 平台扩展字段：```layout```为```single```时该图表不参与分组、单独显示（默认```group```）；```height```为图表高度，例如```{"layout": "single", "height": 300}```。
- `title` (object): 图表标题，为对象，例如：```{text: "差价分析图"}```。
- `xAxis` (object): X轴配置。
- `yAxis` (object): Y轴配置。
- `series` (object): 图表数据系列。

简单的画图例子：
```javascript
// 这个chart在JavaScript语言中是对象，在使用Chart函数之前我们需要声明一个配置图表的对象变量chart
var chart = {
    // 该字段标记图表是否为一般图表，有兴趣的可以改成false运行看看
    __isStock: true,
    // 悬停提示框
    tooltip: {xDateFormat: '%Y-%m-%d %H:%M:%S, %A'},
    // 标题
    title : { text : '差价分析图'},
    // 选择范围
    rangeSelector: {
        buttons:  [{type: 'hour',count: 1, text: '1h'}, {type: 'hour',count: 3, text: '3h'}, {type: 'hour', count: 8, text: '8h'}, {type: 'all',text: 'All'}],
        selected: 0,
        inputEnabled: false
    },
    // 坐标轴横轴即：x轴，当前设置的类型是：时间
    xAxis: { type: 'datetime'},
    // 坐标轴纵轴即：y轴，默认数值随数据大小调整
    yAxis : {
        // 标题
        title: {text: '差价'},
        // 是否启用右边纵轴
        opposite: false
    },
    // 数据系列，该属性保存的是各个数据系列（线，K线图，标签等...）
    series : [
        // 索引为0，data数组内存放的是该索引系列的数据
        {name : "line1", id : "线1,buy1Price", data : []},
        // 索引为1，设置了dashStyle:'shortdash'即：设置虚线
        {name : "line2", id : "线2,lastPrice", dashStyle : 'shortdash', data : []}
    ]
}
function main(){
    // 调用Chart函数，初始化图表
    var ObjChart = Chart(chart)
    // 清空
    ObjChart.reset()
    while(true){
        // 获取本次轮询的时间戳，即一个毫秒的时间戳。用来确定写入到图表的X轴的位置
        var nowTime = new Date().getTime()
        // 获取行情数据
        var ticker = _C(exchange.GetTicker)
        // 从行情数据的返回值取得买一价
        var buy1Price = ticker.Buy
        // 取得最后成交价，为了2条线不重合在一起，我们加1
        var lastPrice = ticker.Last + 1
        // 用时间戳作为X值，买一价作为Y值传入索引0的数据序列
        ObjChart.add(0, [nowTime, buy1Price])
        // 同上
        ObjChart.add(1, [nowTime, lastPrice])
        Sleep(2000)
    }
}
```

See also: `Chart`

#### Chart-return

`Chart`函数返回的图表对象，用于写入数据、更新配置和清空图表。

Fields:

- `add(series, data, index)` (function): 向图表写入数据。```series```为数据系列的索引（整数）；```data```为要写入的数据（数组），例如```[1574993606000, 13.5]```；```index```可选，指定修改第几个数据点，支持负数，```-1```为最后一个点，不传时追加到该数据系列末尾。例如修改```series[0]```最后一个点：```chart.add(0, [1574993606000, 13.5], -1)```。```Rust```中为```add(series, data_json, index)```，```index```必须传入，小于0表示追加。
- `update(options)` (function): 用新的图表配置（与```Chart()```的参数相同）替换当前配置。没有时间轴的图表（例如```pie```）更新数据时需要用```update()```更新整个配置。
- `reset(remain)` (function): 清空图表数据；```remain```为保留的数据条数，不传时清空全部。
- `del(series)` (function): 删除指定索引的数据系列；参数小于等于0或者不传时删除整张图表（包括配置）。```Python```中方法名为```dell()```（```del```是关键字），```Rust```没有此方法。

See also: `Chart`, `Chart-options`

#### KLineChart-options

此JSON用于设置自定义绘图函数```KLineChart```的图表配置信息。以下仅列出几个基本的配置字段。

Fields:

- `overlay` (bool): 是否绘制在主图上。
- `xAxis` (object): X轴配置参数。
- `yAxis` (object): Y轴配置参数。
- `candle` (object): 蜡烛图配置参数。

参考[使用KLineChart函数画图的专题文章](https://www.fmz.com/bbs-topic/9482)。

See also: `KLineChart`

#### KLineChart-return

`KLineChart`函数返回的图表对象，以类似```Pine```语言的方式在K线上画图。遍历K线时，每根K线的画图操作以```begin(bar)```开始、以```close(bar)```结束。

Fields:

- `begin(bar)` (function): 开始在一根K线上画图，参数为`Record`。每根K线的画图操作必须以```begin(bar)```开始、以```close(bar)```结束。
- `close(bar)` (function): 结束当前K线上的画图。```Rust```中为```close()```，不传参数。
- `barcolor(color, offset, editable, show_last, title, display)` (function): 设置K线颜色。```display```可选```none```、```all```。
- `bgcolor(color, offset, editable, show_last, title, display, overlay)` (function): 用指定颜色填充K线的背景。```display```可选```none```、```all```。
- `plot(series, title, color, linewidth, style, trackprice, histbase, offset, join, editable, show_last, display, overlay)` (function): 画一条数据线，返回线的编号（供```fill()```使用）。```style```、```display```的取值见备注。
- `fill(plot1, plot2, color, title, editable, show_last, fillgaps, display)` (function): 用颜色填充两条线（```plot()```或```hline()```的返回值）之间的背景。```display```可选```none```、```all```。
- `hline(price, title, color, linestyle, linewidth, editable, display, overlay)` (function): 在固定价格处画水平线。```linestyle```可选```dashed```、```dotted```、```solid```；```display```可选```none```、```all```。
- `plotarrow(series, title, colorup, colordown, offset, minheight, maxheight, editable, show_last, display, overlay)` (function): 画向上、向下的箭头（数值为正向上，为负向下）。```display```可选```none```、```all```。
- `plotshape(series, title, style, location, color, offset, text, textcolor, editable, size, show_last, display, overlay)` (function): 画形状。```style```、```location```、```size```、```display```的取值见备注。
- `plotchar(series, title, char, location, color, offset, text, textcolor, editable, size, show_last, display, overlay)` (function): 用任意Unicode字符画形状。```location```、```size```、```display```的取值同```plotshape()```。
- `plotcandle(open, high, low, close, title, color, wickcolor, editable, show_last, bordercolor, display, overlay)` (function): 画K线。```display```可选```none```、```all```。
- `signal(direction, price, qty, id)` (function): Pine语言没有的方法，画买卖信号。```direction```可选```long```、```closelong```、```short```、```closeshort```；```price```为标记的纵轴位置；```qty```为交易数量；```id```可选，替换默认显示的文字（默认为交易方向）。
- `reset(remain)` (function): Pine语言没有的方法，清空图表数据；```remain```为保留的数据条数，不传时清空全部。```Rust```中必须传入```remain```。

参数列表中第一个参数之后的参数都可以省略。```JavaScript```不能按参数名传参，用一个```{参数名: 值}```对象指定，例如```c.fill(h, l, {color: "rgba(255, 0, 0, 0.2)", title: "fill"})```、```c.plotshape(bar.Low, {style: "diamond"})```；```Python```使用关键字参数，例如```c.plotshape(bar.Low, style = "diamond")```；```Rust```中各方法的最后一个参数是JSON字符串形式的选项（没有选项时传```"{}"```），例如```c.plot(bar.High, r#"{"title": "high"}"#)```，```plotshape()```、```plotchar()```的第一个参数为布尔值，为真时在该K线上画出。

颜色可以写作```"rgba(255, 0, 0, 0.2)"```或```"#FF0000"```。

```plot()```参数的取值：```style```可选```stepline_diamond```、```stepline```、```cross```、```areabr```、```area```、```circles```、```columns```、```histogram```、```linebr```、```line```；```display```可选```none```、```all```。数值传```NaN```（```Python```为```None```）时该点不画，配合```linebr```可以画不连续的线。

```plotshape()```参数的取值：```style```可选```diamond```、```square```、```label_down```、```label_up```、```arrow_down```、```arrow_up```、```circle```、```flag```、```triangle_down```、```triangle_up```、```cross```、```xcross```；```location```可选```abovebar```、```belowbar```、```top```、```bottom```、```absolute```；```size```可选```10px```、```14px```、```20px```、```40px```、```80px```（对应Pine语言的```size.tiny```、```size.small```、```size.normal```、```size.large```、```size.huge```，```size.auto```即```size.small```）；```display```可选```none```、```all```。

See also: `KLineChart`, `KLineChart-options`

#### SetData-data

该JSON用于设置```exchange.SetData()```函数所要加载的数据。该JSON数据采用数组结构，其中每个元素也是一个数组，格式为```[time, data]```。

Fields:

- `time` (number): 数据的时间戳，用于标记该条数据（data）对应的时间。
- `data` (string / number / bool / object / array / any): data是```exchange.SetData()```函数加载的数据中某个时间对应的具体数据内容。策略运行时，```exchange.GetData()```函数根据当前时间获取对应时间戳的数据。

回测系统中加载数据，策略回测运行时取出数据的示例：
```javascript
/*backtest
start: 2020-01-21 00:00:00
end: 2020-02-12 00:00:00
period: 1d
basePeriod: 1d
exchanges: [{"eid":"Bitfinex","currency":"BTC_USD"}]
*/
function main() {
    exchange.SetData("test", [[1579536000000, _D(1579536000000)], [1579622400000, _D(1579622400000)], [1579708800000, _D(1579708800000)]])
    while(true) {
        Log(exchange.GetData("test"))
        Sleep(1000 * 60 * 60 * 24)
    }
}
```

See also: `exchange.SetData`, `exchange.GetData`

#### EventLoop-return

该JSON是```EventLoop()```函数返回的数据结构。```EventLoop()```函数监听以下事件：1、任意WebSocket可读数据事件；2、exchange.Go()、```HttpQuery_Go()```函数并发任务完成事件；3、JavaScript语言策略中```threading.Thread()```函数创建的线程发送的消息事件。

Fields:

- `Seq` (number): 事件序列号。
- `Event` (string): 事件名称。
- `ThreadId` (number): 事件线程ID。
- `Index` (number): 事件索引。
- `Queue` (number): 返回该事件时，队列中还在等待处理的事件数量。
- `Nano` (number): 纳秒时间戳。

使用```exchange.Go()```函数并发请求时，```EventLoop()```函数返回的事件数据结构。
```json
{
    "Seq":1,
    "Event":"Exchange_GetTrades",
    "ThreadId":0,
    "Index":3,
    "Queue":0,
    "Nano":1682068771309583400
}
```

JavaScript语言策略中的并发执行线程（由```threading.Thread()```函数创建）使用线程对象的```postMessage()```函数发送消息时，接收消息的线程中```EventLoop()```函数会监听到以下事件数据结构：
```json
{
    "Seq":4,
    "Event":"thread",
    "ThreadId":1,
    "Index":0,
    "Queue":0,
    "Nano":1727592066508674000
}
```

交易所推送的行情、订单事件（```Event```为```tick```、```order```，```Index```为交易所对象的索引）还带有```Symbol```字段，以及```Ticker```（`Ticker`结构）或```Order```（`Order`结构）字段。

See also: `EventLoop`

#### exchange.Go-return

`exchange.Go`函数返回的并发对象，用```wait()```方法取得并发调用的结果。```HttpQuery_Go()```、```Mail_Go()```返回的并发对象也有```wait()```方法，返回值见各自的函数页，结果被取走后再次调用```wait()```的处理与下表相同（```Python```的```HttpQuery_Go```返回```None```）。

Fields:

- `wait(timeout)` (function): 等待并取出并发调用的结果。```timeout```单位毫秒：不传或```0```时阻塞到任务完成；```-1```立即返回；正数为最长等待时间。

任务完成后，并发对象不再被引用时结果自动释放；一直持有并发对象而不取结果，结果不会释放。未取结果的并发任务达到2000个时，再调用```exchange.Go()```会报错```too many routine wait, max is 2000```。

```wait()```在各语言中的返回值：

| 情况 | JavaScript | Python | Rust |
| - | - | - | - |
| 完成 | 调用的返回值（调用失败时为```null```） | ```(返回值, True)```；调用失败时为```(None, False)``` | ```Ok(返回值)``` |
| 超时（任务未完成） | ```undefined``` | ```(None, False)``` | ```Err``` |
| 结果已被取走后再次调用 | 抛出异常```routine N already finished``` | 记录错误并返回```(None, False)``` | ```Err``` |

超时后可以继续调用```wait()```等待。```JavaScript```判断超时要用```typeof(r) === "undefined"```，因为```null == undefined```成立。

See also: `exchange.Go`, `EventLoop`, `HttpQuery_Go`

#### DBExec-return

该JSON是```DBExec()```函数返回的数据结构；使用```Dial()```函数创建的对象的```exec()```方法执行SQL语句时，也返回此JSON数据结构。

Fields:

- `columns` (array): 查询数据的列名，字符串数组。
- `values` (array): 查询的具体数据，其中每条数据与列名对应。values字段的值是一个二维数组，每个元素为一个数组，表示一条数据记录。

查询数据库中的数据举例：
```json
{
    "columns":["TS","HIGH","OPEN","LOW","CLOSE","VOLUME"],
    "values":[
        [1518970320000,100,99.1,90,100,12345.6],
        [1518960320000,100,99.1,90,100,12345.6]
    ]
}
```

See also: `DBExec`, `Dial`

#### Dial-return

`Dial`函数返回的连接对象。WebSocket（```ws```、```wss```）、TCP（```tcp```、```tls```）连接与数据库连接都返回这个对象，数据库连接另有```exec()```方法。连接失败时```Dial()```返回空值并记录错误（```Rust```返回```Valid()```为```false```的连接对象）。

Fields:

- `read(timeout)` (function): 读取一条数据。```timeout```单位毫秒：不传时阻塞到有数据；正数为最长等待时间，超时返回空值。以下两个取值只对WebSocket有效：```-1```不等待，没有数据立即返回空值；```-2```不等待，只返回最新的一条，缓冲区中更早的数据被丢弃。
- `write(data)` (function): 发送数据，返回发送的字节数；连接断开时返回```0```。
- `close()` (function): 关闭连接。设置了自动重连（地址参数```reconnect=true```）的WebSocket连接断开后由底层重连，不需要关闭；已经关闭的连接不能再使用。
- `exec(sql, ...args)` (function): 数据库连接独有：执行SQL语句，用法与返回值同`DBExec`（见`DBExec-return`）。```JavaScript```、```Python```中可以在SQL语句后继续传入```?```占位符对应的参数值。
- `fd()` (function): 仅```JavaScript```：返回指向同一连接的句柄。把句柄传给其它线程（例如作为```threading.Thread()```的参数），在线程中调用```Dial(handle)```得到同一连接的连接对象继续使用，WebSocket、TCP与数据库连接都适用；句柄的```valueOf()```为连接编号。
- `Valid()` (function): 仅```Rust```：连接是否建立成功。

```JavaScript```中，数据库连接对象本身也可以作为参数传给```threading.Thread()```创建的线程、存入```threading.Dict()```或者通过```postMessage()```发送给其它线程，在多个线程之间共享同一个连接；连接对象不再被引用时自动关闭连接。```Python```、```Rust```不支持在线程间共享连接。

```read()```的接收缓冲区与各种```timeout```取值下的行为：

WebSocket收到的数据先进入接收缓冲区（队列），两次```read()```间隔太长时数据会累积；缓冲区默认最多4096条或16MB（先到为准），超出后丢弃最旧的数据，上限可以用```Dial()```地址参数中的```qsize```、```qbytes```调整。

| 场景 | 不传参数 | -1 | -2 | 2000（毫秒） |
| - | - | - | - | - |
| 缓冲区已有数据 | 立即返回最旧的数据 | 立即返回最旧的数据 | 立即返回最新的数据，丢弃其余 | 立即返回最旧的数据 |
| 缓冲区没有数据 | 阻塞到有数据时返回 | 立即返回空值 | 立即返回空值 | 最多等待2000毫秒，没有数据返回空值 |
| 连接断开或底层正在重连 | 返回空字符串```""``` | -- | -- | -- |

See also: `Dial`, `DBExec`, `EventLoop`

#### Thread.join-return

该JSON是```Thread```对象的成员函数```join()```返回的数据结构，用于保存```JavaScript```语言策略中并发线程的相关信息。```Thread```对象指的是线程对象，通过```threading.Thread()```方式创建。

Fields:

- `id` (number): 线程ID。
- `terminated` (bool): 线程是否被强制终止。
- `elapsed` (number): 线程的运行时间（纳秒）。
- `error` (string): 线程执行出错（抛出异常）时的错误信息，没有出错时为```null```。
- `ret` (any): 线程函数的返回值，可以是任意类型；线程函数没有返回值时为```undefined```。

```join(timeout)```在超时时间内线程没有结束时返回```undefined```（不是```null```），之后可以再次调用```join()```等待。以下代码测试```Thread```对象的```join()```函数的超时机制，并打印输出```join()```函数的返回值。
```javascript
function testFunc() {
    for (var i = 0; i < 5; i++) {
        Log(i)
        Sleep(300)
    }
}

function main() {
    var t1 = threading.Thread(testFunc)
    Log(t1.join(1000))  // undefined
    Log(t1.join())      // {"id":1,"terminated":false,"elapsed":1506864000,"error":null}
}
```

See also: `join`

## 内置变量与常量

交易所对象`exchange`、`exchanges`，以及订单状态、订单方向、条件单类型、持仓方向、开平仓、K线周期和日志类型等常量组。

每个常量组的目录页有「常量｜值｜含义」总表；常量是数值，可以直接与结构体字段比较，例如```order.Status == ORDER_STATE_CLOSED```。

### EXCHANGE

交易所对象：`exchange`是实盘或回测配置里添加的第一个交易所对象，`exchanges`是全部交易所对象按添加顺序组成的数组，```exchanges[0]```就是```exchange```。

行情、交易、账户、期货等函数都是交易所对象的成员函数，例如```exchange.GetTicker()```、```exchanges[1].GetAccount()```，只作用于该对象绑定的账户。

#### exchange

在策略实盘设置、回测设置中添加的第一个交易所对象。所有与交易所的交互均通过该对象的成员函数实现。

打印第一个交易所对象的名称和标签。

```javascript
function main() {
    Log("First exchange object name:", exchange.GetName(), ", Label:", exchange.GetLabel())
}
```

```python
def main():
    Log("First exchange object name:", exchange.GetName(), ", Label:", exchange.GetLabel())
```

```rust
fn main() {
    Log!("First exchange object name:", exchange.GetName(), ", Label:", exchange.GetLabel());
}
```

See also: `exchanges`, `exchange.GetName`, `exchange.GetLabel`

#### exchanges

交易所对象数组，包含在策略实盘设置或回测设置中添加的所有交易所对象，其中 exchanges[0] 即为 `exchange`。

在策略实盘设置或回测设置中添加的交易所对象，将根据添加的先后顺序依次对应 exchanges[0]、exchanges[1]、exchanges[2]、…… exchanges[n]。

遍历所有交易所对象，打印各自的名称和标签。

```javascript
function main() {
    for(var i = 0; i < exchanges.length; i++) {
        Log("Exchange index:", i, "Name:", exchanges[i].GetName(), "Label:",
            exchanges[i].GetLabel())
    }
}
```

```python
def main():
    for i in range(len(exchanges)):
        Log("Exchange index:", i, "Name:", exchanges[i].GetName(), "Label:",
            exchanges[i].GetLabel())
```

```rust
fn main() {
    for i in 0..exchanges.len() {
        Log!("Exchange index:", i, "Name:", exchanges[i].GetName(), "Label:",
            exchanges[i].GetLabel());
    }
}
```

See also: `exchange`, `exchange.GetName`, `exchange.GetLabel`

### ORDER_STATE

订单状态常量：`Order`结构```Status```字段的取值，判断订单是否完成时直接与这些常量比较。

| 常量 | 值 | 含义 |
| - | - | - |
| `ORDER_STATE_PENDING` | ```0``` | 订单未完成（挂单中，可能已部分成交） |
| `ORDER_STATE_CLOSED` | ```1``` | 订单已完成（全部成交） |
| `ORDER_STATE_CANCELED` | ```2``` | 订单已取消 |
| `ORDER_STATE_UNKNOWN` | ```3``` | 订单状态未知（其它状态） |

#### ORDER_STATE_PENDING

订单未完成（挂单中，可能已部分成交），值为```0```。用于`Order`结构的```Status```字段。

See also: `ORDER_STATE`, `Order`, `exchange.GetOrder`, `exchange.GetOrders`

#### ORDER_STATE_CLOSED

订单已完成（全部成交），值为```1```。用于`Order`结构的```Status```字段。

See also: `ORDER_STATE`, `Order`, `exchange.GetOrder`, `exchange.GetOrders`

#### ORDER_STATE_CANCELED

订单已取消，值为```2```。用于`Order`结构的```Status```字段。

See also: `ORDER_STATE`, `Order`, `exchange.GetOrder`, `exchange.GetOrders`

#### ORDER_STATE_UNKNOWN

订单状态未知（其它状态），值为```3```。用于`Order`结构的```Status```字段。

订单处于```ORDER_STATE_UNKNOWN```状态时，可以调用`exchange.GetRawJSON`获取交易所返回的原始订单状态，对照交易所文档确认具体含义。

See also: `ORDER_STATE`, `Order`, `exchange.GetOrder`, `exchange.GetOrders`

### ORDER_TYPE

订单方向常量：`Order`结构```Type```字段的取值。

| 常量 | 值 | 含义 |
| - | - | - |
| `ORDER_TYPE_BUY` | ```0``` | 买单 |
| `ORDER_TYPE_SELL` | ```1``` | 卖单 |

#### ORDER_TYPE_BUY

买单，值为```0```。用于`Order`结构的```Type```字段。

See also: `ORDER_TYPE`, `Order`, `ORDER_OFFSET`

#### ORDER_TYPE_SELL

卖单，值为```1```。用于`Order`结构的```Type```字段。

See also: `ORDER_TYPE`, `Order`, `ORDER_OFFSET`

### ORDER_CONDITION_TYPE

条件单类型常量：`Condition`结构```ConditionType```字段的取值，创建、修改、查询条件单时使用。普通订单没有条件单配置（Rust中```Order```结构的```Condition.ConditionType```为```-1```）。

| 常量 | 值 | 含义 |
| - | - | - |
| `ORDER_CONDITION_TYPE_OCO` | ```0``` | OCO订单（One-Cancels-the-Other，二选一）：同时设置止盈和止损条件，其中一个触发后另一个自动取消 |
| `ORDER_CONDITION_TYPE_TP` | ```1``` | 止盈单（Take Profit）：价格达到止盈触发价时下单 |
| `ORDER_CONDITION_TYPE_SL` | ```2``` | 止损单（Stop Loss）：价格达到止损触发价时下单，用于限制损失 |
| `ORDER_CONDITION_TYPE_GENERIC` | ```3``` | 通用条件单：具体行为取决于交易所，只出现在查询结果中 |

#### ORDER_CONDITION_TYPE_OCO

OCO订单（One-Cancels-the-Other，二选一）：同时设置止盈和止损条件，其中一个触发后另一个自动取消，值为```0```。用于`Condition`结构的```ConditionType```字段。

See also: `ORDER_CONDITION_TYPE`, `Condition`, `exchange.CreateConditionOrder`, `exchange.GetConditionOrders`

#### ORDER_CONDITION_TYPE_TP

止盈单（Take Profit）：价格达到止盈触发价时下单，值为```1```。用于`Condition`结构的```ConditionType```字段。

See also: `ORDER_CONDITION_TYPE`, `Condition`, `exchange.CreateConditionOrder`, `exchange.GetConditionOrders`

#### ORDER_CONDITION_TYPE_SL

止损单（Stop Loss）：价格达到止损触发价时下单，用于限制损失，值为```2```。用于`Condition`结构的```ConditionType```字段。

See also: `ORDER_CONDITION_TYPE`, `Condition`, `exchange.CreateConditionOrder`, `exchange.GetConditionOrders`

#### ORDER_CONDITION_TYPE_GENERIC

通用条件单：具体行为取决于交易所，只出现在查询结果中，值为```3```。用于`Condition`结构的```ConditionType```字段。

GENERIC类型只出现在查询结果中，`exchange.CreateConditionOrder`、`exchange.ModifyConditionOrder`不支持该类型，传入时返回空值并记录错误。

See also: `ORDER_CONDITION_TYPE`, `Condition`, `exchange.CreateConditionOrder`, `exchange.GetConditionOrders`

### POSITION_DIRECTION

持仓方向常量：`Position`结构```Type```字段的取值。

| 常量 | 值 | 含义 |
| - | - | - |
| `PD_LONG` | ```0``` | 多头持仓 |
| `PD_SHORT` | ```1``` | 空头持仓 |

#### PD_LONG

多头持仓，值为```0```。用于`Position`结构的```Type```字段。

平掉多头持仓时，先用```exchange.SetDirection("closebuy")```设置平仓方向再下卖单。

See also: `POSITION_DIRECTION`, `Position`, `exchange.SetDirection`, `exchange.GetPositions`

#### PD_SHORT

空头持仓，值为```1```。用于`Position`结构的```Type```字段。

平掉空头持仓时，先用```exchange.SetDirection("closesell")```设置平仓方向再下买单。

See also: `POSITION_DIRECTION`, `Position`, `exchange.SetDirection`, `exchange.GetPositions`

### ORDER_OFFSET

开平仓常量：`Order`结构```Offset```字段的取值。单向持仓模式下无法判断是否为平仓（减仓）的订单，```Offset```按开仓处理。

| 常量 | 值 | 含义 |
| - | - | - |
| `ORDER_OFFSET_OPEN` | ```0``` | 开仓 |
| `ORDER_OFFSET_CLOSE` | ```1``` | 平仓 |

#### ORDER_OFFSET_OPEN

开仓，值为```0```。用于`Order`结构的```Offset```字段。

See also: `ORDER_OFFSET`, `Order`, `ORDER_TYPE`

#### ORDER_OFFSET_CLOSE

平仓，值为```1```。用于`Order`结构的```Offset```字段。

See also: `ORDER_OFFSET`, `Order`, `ORDER_TYPE`

### PERIOD

K线周期常量，值为周期的秒数，用作`exchange.GetRecords`等函数的```period```参数。其它周期直接传秒数（例如```60 * 10```为10分钟）。

| 常量 | 值 | 含义 |
| - | - | - |
| `PERIOD_M1` | ```60``` | 1分钟K线周期 |
| `PERIOD_M3` | ```180``` | 3分钟K线周期 |
| `PERIOD_M5` | ```300``` | 5分钟K线周期 |
| `PERIOD_M15` | ```900``` | 15分钟K线周期 |
| `PERIOD_M30` | ```1800``` | 30分钟K线周期 |
| `PERIOD_H1` | ```3600``` | 1小时K线周期 |
| `PERIOD_H2` | ```7200``` | 2小时K线周期 |
| `PERIOD_H4` | ```14400``` | 4小时K线周期 |
| `PERIOD_H6` | ```21600``` | 6小时K线周期 |
| `PERIOD_H12` | ```43200``` | 12小时K线周期 |
| `PERIOD_D1` | ```86400``` | 1天K线周期 |
| `PERIOD_D3` | ```259200``` | 3天K线周期 |
| `PERIOD_W1` | ```604800``` | 1周K线周期 |

#### PERIOD_M1

1分钟K线周期，值为```60```。用作`exchange.GetRecords`的```period```参数（单位秒）。

See also: `PERIOD`, `exchange.GetRecords`, `Record`

#### PERIOD_M3

3分钟K线周期，值为```180```。用作`exchange.GetRecords`的```period```参数（单位秒）。

See also: `PERIOD`, `exchange.GetRecords`, `Record`

#### PERIOD_M5

5分钟K线周期，值为```300```。用作`exchange.GetRecords`的```period```参数（单位秒）。

See also: `PERIOD`, `exchange.GetRecords`, `Record`

#### PERIOD_M15

15分钟K线周期，值为```900```。用作`exchange.GetRecords`的```period```参数（单位秒）。

See also: `PERIOD`, `exchange.GetRecords`, `Record`

#### PERIOD_M30

30分钟K线周期，值为```1800```。用作`exchange.GetRecords`的```period```参数（单位秒）。

See also: `PERIOD`, `exchange.GetRecords`, `Record`

#### PERIOD_H1

1小时K线周期，值为```3600```。用作`exchange.GetRecords`的```period```参数（单位秒）。

See also: `PERIOD`, `exchange.GetRecords`, `Record`

#### PERIOD_H2

2小时K线周期，值为```7200```。用作`exchange.GetRecords`的```period```参数（单位秒）。

See also: `PERIOD`, `exchange.GetRecords`, `Record`

#### PERIOD_H4

4小时K线周期，值为```14400```。用作`exchange.GetRecords`的```period```参数（单位秒）。

See also: `PERIOD`, `exchange.GetRecords`, `Record`

#### PERIOD_H6

6小时K线周期，值为```21600```。用作`exchange.GetRecords`的```period```参数（单位秒）。

See also: `PERIOD`, `exchange.GetRecords`, `Record`

#### PERIOD_H12

12小时K线周期，值为```43200```。用作`exchange.GetRecords`的```period```参数（单位秒）。

See also: `PERIOD`, `exchange.GetRecords`, `Record`

#### PERIOD_D1

1天K线周期，值为```86400```。用作`exchange.GetRecords`的```period```参数（单位秒）。

See also: `PERIOD`, `exchange.GetRecords`, `Record`

#### PERIOD_D3

3天K线周期，值为```259200```。用作`exchange.GetRecords`的```period```参数（单位秒）。

See also: `PERIOD`, `exchange.GetRecords`, `Record`

#### PERIOD_W1

1周K线周期，值为```604800```。用作`exchange.GetRecords`的```period```参数（单位秒）。

See also: `PERIOD`, `exchange.GetRecords`, `Record`

### LOG_TYPE

日志类型常量：`exchange.Log`的```orderType```参数取值，决定输出的是买单、卖单还是撤单日志（只输出日志，不下单）。

| 常量 | 值 | 含义 |
| - | - | - |
| `LOG_TYPE_BUY` | ```0``` | 买单日志 |
| `LOG_TYPE_SELL` | ```1``` | 卖单日志 |
| `LOG_TYPE_CANCEL` | ```2``` | 撤单日志 |

#### LOG_TYPE_BUY

买单日志，值为```0```。用作`exchange.Log`的```orderType```参数。

See also: `LOG_TYPE`, `exchange.Log`

#### LOG_TYPE_SELL

卖单日志，值为```1```。用作`exchange.Log`的```orderType```参数。

See also: `LOG_TYPE`, `exchange.Log`

#### LOG_TYPE_CANCEL

撤单日志，值为```2```。用作`exchange.Log`的```orderType```参数。

See also: `LOG_TYPE`, `exchange.Log`

## 通用约定

手册各页共用的约定：品种代码的写法、查询范围、调用失败与不支持时的返回值。函数页只写与本函数有关的内容，共同前提集中在这里。

### 品种代码

交易所对象的函数用字符串参数```symbol```指定品种。写法由平台统一定义，与交易所接口里的原始写法无关，换交易所不用改这部分代码。

#### 不传symbol

单个品种的函数（```GetTicker```、```GetDepth```、```GetTrades```、```GetRecords```、```GetHistoryOrders```等）不传```symbol```时作用于**当前品种**：当前交易对由`exchange.SetCurrency`设置（初始值为实盘、回测配置里的交易对），期货的合约代码由`exchange.SetContractType`设置。查询多个品种的函数不传时按「范围」查询，见下文「查询范围」。

#### 交易对

现货品种写作「交易币种_计价币种」，大写，以下划线```_```分隔：```BTC_USDT```是以USDT计价的BTC，```ETH_BTC```是以BTC计价的ETH。

#### 合约

期货交易所对象上的品种写作「交易对.合约代码」，以```.```分隔：

| 写法 | 含义 |
| - | - |
| ```BTC_USDT.swap``` | BTC的USDT本位永续合约 |
| ```BTC_USD.swap``` | BTC的币本位永续合约 |
| ```BTC_USDT.quarter``` | BTC的USDT本位季度合约 |
| ```BTC_USD.this_week``` | BTC的币本位当周合约 |

计价币种区分保证金类型：```USDT```、```USDC```等稳定币为U本位，```USD```为币本位。通用的合约代码有```swap```（永续）、```this_week```（当周）、```next_week```（次周）、```quarter```（季度）、```next_quarter```（次季度），各交易所实际支持哪些见`exchange.SetContractType`。

加密货币期货交易所对象的默认合约是永续合约```swap```：没有调用```exchange.SetContractType()```时，不传```symbol```的行情、交易函数作用于当前交易对的永续合约。

#### 期权

期权品种写作「交易对.期权合约代码」，期权合约代码使用交易所自己的写法。例如```Futures_Binance```（币安期货）的期权```BTC-240108-40000-C```写作```BTC_USDT.BTC-240108-40000-C```。

#### 原生代码

商品期货、股票类交易所（```Futures_CTP```（CTP商品期货）、```Futures_Futu```（富途）、```Futures_IB```（盈透证券））没有「交易对.合约代码」两段：品种就是交易所的原生合约代码，例如CTP的```rb2501```。富途、盈透的代码本身可能含```.```（例如```00700.HK```），整串作为一个品种，不拆分。

#### 查询范围

```GetOrders```、```GetPositions```、```GetConditionOrders```、```GetFundings```可以一次查询多个品种。```symbol```可以是具体品种，也可以是「计价币种.合约类型」形式的范围：

| symbol | 范围 |
| - | - |
| ```USDT.swap``` | USDT本位永续合约 |
| ```USDT.futures``` | USDT本位交割合约 |
| ```USD.swap``` | 币本位永续合约 |
| ```USD.futures``` | 币本位交割合约 |
| ```USDT.option``` | USDT本位期权 |
| ```USD.option``` | 币本位期权 |
| ```USD.futures_combo``` | 差价组合合约（```Futures_Deribit```的币本位组合） |
| ```USD.futures_ff``` | 线性交割合约（```Futures_Kraken```，合约代码以```_ff```结尾） |
| ```USD.swap_pf``` | 线性永续合约（```Futures_Kraken```，合约代码```swap_pf```） |

计价币种按交易所实际使用的写（例如```USDC.swap```）。交易所接口不支持的范围会报错并返回空值。

##### 不传```symbol```或传空字符串```""```时的缺省范围

- 现货交易所对象：查询全部品种。
- 加密货币期货交易所对象：查询「当前计价币种 + 当前合约所属的合约类型」。当前合约是组合合约（合约代码含英文逗号，如```quarter,swap```，或为Deribit原生组合代码，如```BTC-FS-26DEC25_PERP```）时为```futures_combo```；是期权时为```option```；是```swap_pf```时为```swap_pf```；以```_ff```结尾时为```futures_ff```；其它含```swap```的为```swap```，否则为```futures```；没有设置合约时按```swap```。例如当前品种为```BTC_USDT.swap```时等价于传```USDT.swap```，为```BTC_USD.quarter```时等价于传```USD.futures```，为```BTC_USD.quarter,swap```时等价于传```USD.futures_combo```。
- 没有「计价币种 + 合约类型」划分的期货交易所对象（```Futures_CTP```、```Futures_Futu```、```Futures_IB```、```Futures_Polymarket```）：查询全部品种。
- 少数交易所的查询接口必须指定品种，这些交易所上```GetOrders```、```GetConditionOrders```不传```symbol```时只查询当前交易对。

查询成功但范围内没有数据时返回空数组```[]```；调用失败时返回空值，见`失败与空值`。```GetHistoryOrders```、```GetHistoryConditionOrders```不使用范围，不传```symbol```时查询当前品种。

### 失败与空值

#### 调用失败返回空值

交易所对象的函数和大多数全局函数调用失败时（网络错误、超时、交易所拒绝请求、参数不被交易所接受等）**不会中止策略**，而是：

1. 记录一条错误日志（可以用`SetErrorFilter`过滤）；
2. 把错误信息记为最近一次错误，用`GetLastError`读取；
3. 返回空值：```JavaScript```返回```null```，```Python```返回```None```，```Rust```返回```Err```（错误信息在```Err```里）。

查询成功但没有数据时返回空数组```[]```（例如没有挂单时的```exchange.GetOrders()```），与失败的空值不同。判断结果时要区分这两种情况，不能把空值当成「没有数据」继续计算。少数函数的失败返回值不同，以各函数页「返回值」为准（例如```HttpQuery()```失败时返回空字符串）。

#### 不支持的接口

交易所或运行环境不支持某个函数、某种查询范围时，按调用失败处理：记录一条「不支持」的错误（错误日志 + ```GetLastError()```），返回空值，策略不中断。**不会**返回```[]```、```{}```、```0```这类看起来像正常数据的值。

#### 编程错误会抛出异常

调用方式本身有误时（例如没有设置交易对就调用不传```symbol```的函数、参数格式无法解析），```JavaScript```、```Python```抛出异常，没有捕获时策略停止；```Rust```返回```Err```。这类错误需要修改代码，重试没有意义。

#### 写法

调用后先判断空值，再使用结果；需要自动重试的调用可以用`_C`包装。

区分调用失败（空值）与查询成功但没有数据（空数组）。

```javascript
function main() {
    var ticker = exchange.GetTicker("BTC_USDT")
    if (ticker === null) {
        // 调用失败：错误日志已经记录，GetLastError()可以读取原因
        Log("GetTicker failed:", GetLastError())
        return
    }
    var orders = exchange.GetOrders("BTC_USDT")
    if (orders === null) {
        Log("GetOrders failed:", GetLastError())
    } else if (orders.length === 0) {
        Log("no open orders")
    } else {
        Log("open orders:", orders.length)
    }
}
```

```python
def main():
    ticker = exchange.GetTicker("BTC_USDT")
    if ticker is None:
        # 调用失败：错误日志已经记录，GetLastError()可以读取原因
        Log("GetTicker failed:", GetLastError())
        return
    orders = exchange.GetOrders("BTC_USDT")
    if orders is None:
        Log("GetOrders failed:", GetLastError())
    elif len(orders) == 0:
        Log("no open orders")
    else:
        Log("open orders:", len(orders))
```

```rust
fn main() {
    let ticker = match exchange.GetTicker("BTC_USDT") {
        Ok(t) => t,
        Err(e) => {
            // 调用失败：Err 里是错误信息
            Log!("GetTicker failed:", e);
            return;
        }
    };
    Log!("last:", ticker.Last);
    match exchange.GetOrders("BTC_USDT") {
        Ok(orders) if orders.is_empty() => Log!("no open orders"),
        Ok(orders) => Log!("open orders:", orders.len()),
        Err(e) => Log!("GetOrders failed:", e),
    }
}
```

## 交易所

本章是各交易所对象的参考：每个品牌一页，同品牌的现货、期货交易所对象写在同一页。页面依次给出名称（```exchange.GetName()```的返回值与别名）、配置项、交易对与合约代码、专属IO指令、不支持与合成的函数、保证金账户与模拟盘、期权和注意事项；各函数页只写通用语义，交易所之间的差异以本章为准。所有交易所的函数支持情况、交易模式指令汇总在`能力矩阵`。

### 名称对照

交易所对象的名称以```exchange.GetName()```的返回值为准，点击名称查看交易所页。

| ```exchange.GetName()``` | 品牌 | 类型 | 别名 |
| - | - | - | - |
| `AscendEx` | AscendEx | 现货 | AscendEX、BitMax |
| `Backpack` | Backpack | 现货 | Backpack Exchange |
| `Futures_Backpack` | Backpack | 期货 | — |
| `BigONE` | BigONE | 现货 | — |
| `Binance` | 币安 | 现货 | — |
| `Futures_Binance` | 币安 | 期货 | — |
| `Bitfinex` | Bitfinex | 现货 | — |
| `Futures_Bitfinex` | Bitfinex | 期货 | Bitfinex期货、Bitfinex Futures |
| `BitFlyer` | bitFlyer | 现货 | — |
| `Bitget` | Bitget | 现货 | Bitget现货 |
| `Futures_Bitget` | Bitget | 期货 | Bitget期货 |
| `Bithumb` | Bithumb | 现货 | — |
| `Bitstamp` | Bitstamp | 现货 | — |
| `Bybit` | Bybit | 现货 | Bybit现货 |
| `Futures_Bybit` | Bybit | 期货 | Bybit期货 |
| `Coincheck` | Coincheck | 现货 | — |
| `Coinone` | Coinone | 现货 | — |
| `Coinw` | CoinW | 现货 | 币赢 |
| `Futures_Coinw` | CoinW | 期货 | CoinW期货 |
| `Crypto` | Crypto.com | 现货 | — |
| `Futures_Crypto` | Crypto.com | 期货 | Crypto.com期货、Crypto.com Futures |
| `DeepCoin` | DeepCoin | 现货 | Deepcoin |
| `Futures_DeepCoin` | DeepCoin | 期货 | DeepCoin期货 |
| `Futures_Deribit` | Deribit | 期货 | — |
| `DigiFinex` | DigiFinex | 现货 | — |
| `Futures_DigiFinex` | DigiFinex | 期货 | DigiFinex期货 |
| `GateIO` | Gate | 现货 | Gate.io、Gate现货 |
| `Futures_GateIO` | Gate | 期货 | Gate期货 |
| `Gemini` | Gemini | 现货 | — |
| `HashKey` | HashKey | 现货 | — |
| `HitBTC` | HitBTC | 现货 | — |
| `Huobi` | 火币 | 现货 | 火币现货 |
| `Futures_HuobiDM` | 火币 | 期货 | Futures_HTX、HuobiDM、HTX期货、火币期货 |
| `Korbit` | Korbit | 现货 | — |
| `Kraken` | Kraken | 现货 | — |
| `Futures_Kraken` | Kraken | 期货 | Kraken期货、Kraken Futures |
| `KuCoin` | 库币 | 现货 | — |
| `Futures_KuCoin` | 库币 | 期货 | KuCoin期货、KuCoin Futures |
| `LBank` | LBank | 现货 | — |
| `MEXC` | MEXC | 现货 | 抹茶 |
| `Futures_MEXC` | MEXC | 期货 | 抹茶期货、MEXC期货、MEXC Futures |
| `OKEX` | OKX | 现货 | 欧易、OKX现货 |
| `Futures_OKCoin` | OKX | 期货 | Futures_OKX、OKX期货、欧易期货 |
| `Poloniex` | Poloniex | 现货 | — |
| `Upbit` | Upbit | 现货 | — |
| `WEEX` | WEEX | 现货 | 唯客 |
| `Futures_WEEX` | WEEX | 期货 | WEEX期货 |
| `WOO` | WOO X | 现货 | WOOX |
| `Futures_WOO` | WOO X | 期货 | WOO X期货 |
| `Zaif` | Zaif | 现货 | — |
| `Hyperliquid` | Hyperliquid | 现货 | Hyperliquid现货 |
| `Futures_Hyperliquid` | Hyperliquid | 期货 | Hyperliquid期货、HIP-3、HIP-4 |
| `Futures_Lighter` | Lighter | 期货 | zkLighter |
| `Futures_EdgeX` | edgeX | 期货 | EdgeX |
| `Aster` | Aster | 现货 | AsterDEX |
| `Futures_ApolloX` | Aster | 期货 | ApolloX、ApolloX DEX |
| `Futures_Aster` | Aster | 期货 | Aster期货 |
| `Futures_Aevo` | Aevo | 期货 | — |
| `Pendle` | Pendle | 现货 | Pendle Finance、PT、YT |
| `Futures_Boros` | Pendle | 期货 | Boros、Pendle Boros、Futures_Boros |
| `Futures_WOOFi` | WOOFi Pro | 期货 | WOOFi、Orderly |
| `Uniswap` | Uniswap | 现货 | PancakeSwap、Aerodrome |
| `Jupiter` | Jupiter | 现货 | — |
| `KyberSwap` | KyberSwap | 现货 | Kyber |
| `OneInch` | 1inch | 现货 | — |
| `OKX_DEX` | OKX DEX | 现货 | OKX Web3、欧易DEX |
| `Futures_Polymarket` | Polymarket | 预测市场 | — |
| `Futures_Futu` | 富途证券 | 证券与期货 | Futu |
| `Futures_IB` | 盈透证券 | 证券与期货 | IB、盈透 |
| `Exchange` | 通用协议 | 自定义接入 | 自定义交易所、Custom Exchange |
| `Web3` | Web3 | 自定义接入 | 以太坊、Ethereum、波场、TRON |

### 能力矩阵

各交易所对象对标准函数与交易模式指令的支持情况。✓ 支持；✗ 不支持（调用时报错并返回空值）；合成：交易所的接口不能完整提供该函数（没有对应接口，或缺少部分K线周期等），由托管者补足，说明见交易所页；— 不适用（现货交易所对象没有期货函数）。

#### 行情

| 交易所 | `GetTicker` | `GetTickers` | `GetDepth` | `GetTrades` | `GetRecords` | `GetMarkets` |
| - | - | - | - | - | - | - |
| **中心化交易所** |  |  |  |  |  |  |
| `AscendEx` | ✓ | ✓ | ✓ | ✓ | 合成 | ✓ |
| `Backpack` | ✓ | ✓ | ✓ | ✓ | 合成 | ✓ |
| `Futures_Backpack` | ✓ | ✓ | ✓ | ✓ | 合成 | ✓ |
| `BigONE` | ✓ | ✓ | ✓ | ✓ | 合成 | ✓ |
| `Binance` | ✓ | ✓ | ✓ | ✓ | 合成 | ✓ |
| `Futures_Binance` | ✓ | ✓ | ✓ | ✓ | 合成 | ✓ |
| `Bitfinex` | ✓ | ✓ | ✓ | ✓ | 合成 | ✓ |
| `Futures_Bitfinex` | ✓ | ✓ | ✓ | ✓ | 合成 | ✓ |
| `BitFlyer` | ✓ | ✗ | ✓ | ✓ | 合成 | ✓ |
| `Bitget` | ✓ | ✓ | ✓ | ✓ | 合成 | ✓ |
| `Futures_Bitget` | ✓ | ✓ | ✓ | ✓ | 合成 | ✓ |
| `Bithumb` | ✓ | ✓ | ✓ | ✓ | 合成 | ✓ |
| `Bitstamp` | ✓ | ✓ | ✓ | ✓ | 合成 | ✓ |
| `Bybit` | ✓ | ✓ | ✓ | ✓ | 合成 | ✓ |
| `Futures_Bybit` | ✓ | ✓ | ✓ | ✓ | 合成 | ✓ |
| `Coincheck` | ✓ | ✗ | ✓ | ✓ | 合成 | ✗ |
| `Coinone` | ✓ | ✓ | ✓ | ✓ | 合成 | ✓ |
| `Coinw` | ✓ | ✓ | ✓ | ✓ | 合成 | ✓ |
| `Futures_Coinw` | ✓ | ✓ | ✓ | ✓ | 合成 | ✓ |
| `Crypto` | ✓ | ✓ | ✓ | ✓ | 合成 | ✓ |
| `Futures_Crypto` | ✓ | ✓ | ✓ | ✓ | 合成 | ✓ |
| `DeepCoin` | ✓ | ✓ | ✓ | ✓ | 合成 | ✓ |
| `Futures_DeepCoin` | ✓ | ✓ | ✓ | ✓ | 合成 | ✓ |
| `Futures_Deribit` | ✓ | ✓ | ✓ | ✓ | 合成 | ✓ |
| `DigiFinex` | ✓ | ✓ | ✓ | ✓ | 合成 | ✓ |
| `Futures_DigiFinex` | ✓ | ✓ | ✓ | ✓ | 合成 | ✓ |
| `GateIO` | ✓ | ✓ | ✓ | ✓ | 合成 | ✓ |
| `Futures_GateIO` | ✓ | ✓ | ✓ | ✓ | 合成 | ✓ |
| `Gemini` | ✓ | ✗ | ✓ | ✓ | 合成 | ✓ |
| `HashKey` | ✓ | ✓ | ✓ | ✓ | 合成 | ✓ |
| `HitBTC` | ✓ | ✓ | ✓ | ✓ | 合成 | ✓ |
| `Huobi` | ✓ | ✓ | ✓ | ✓ | 合成 | ✓ |
| `Futures_HuobiDM` | ✓ | ✓ | ✓ | ✓ | 合成 | ✓ |
| `Korbit` | ✓ | ✓ | ✓ | ✓ | 合成 | ✓ |
| `Kraken` | ✓ | ✓ | ✓ | ✓ | 合成 | ✓ |
| `Futures_Kraken` | ✓ | ✓ | ✓ | ✓ | 合成 | ✓ |
| `KuCoin` | ✓ | ✓ | ✓ | ✓ | 合成 | ✓ |
| `Futures_KuCoin` | ✓ | ✓ | ✓ | ✓ | 合成 | ✓ |
| `LBank` | ✓ | ✓ | ✓ | ✓ | 合成 | ✓ |
| `MEXC` | ✓ | ✓ | ✓ | ✓ | 合成 | ✓ |
| `Futures_MEXC` | ✓ | ✓ | ✓ | ✓ | 合成 | ✓ |
| `OKEX` | ✓ | ✓ | ✓ | ✓ | 合成 | ✓ |
| `Futures_OKCoin` | ✓ | ✓ | ✓ | ✓ | 合成 | ✓ |
| `Poloniex` | ✓ | ✓ | ✓ | ✓ | 合成 | ✓ |
| `Upbit` | ✓ | ✓ | ✓ | ✓ | 合成 | ✓ |
| `WEEX` | ✓ | ✓ | ✓ | ✓ | 合成 | ✓ |
| `Futures_WEEX` | ✓ | ✓ | ✓ | ✓ | 合成 | ✓ |
| `WOO` | ✓ | ✗ | ✓ | ✓ | 合成 | ✓ |
| `Futures_WOO` | ✓ | ✗ | ✓ | ✓ | 合成 | ✓ |
| `Zaif` | ✓ | ✗ | ✓ | ✓ | 合成 | ✓ |
| **去中心化交易所** |  |  |  |  |  |  |
| `Hyperliquid` | ✓ | ✓ | ✓ | ✓ | 合成 | ✓ |
| `Futures_Hyperliquid` | ✓ | ✓ | ✓ | ✓ | 合成 | ✓ |
| `Futures_Lighter` | ✓ | ✓ | ✓ | ✓ | 合成 | ✓ |
| `Futures_EdgeX` | ✓ | ✗ | ✓ | ✗ | 合成 | ✓ |
| `Aster` | ✓ | ✓ | ✓ | ✓ | 合成 | ✓ |
| `Futures_ApolloX` | ✓ | ✓ | ✓ | ✓ | 合成 | ✓ |
| `Futures_Aster` | ✓ | ✓ | ✓ | ✓ | 合成 | ✓ |
| `Futures_Aevo` | ✓ | ✗ | ✓ | ✓ | 合成 | ✓ |
| `Pendle` | ✓ | ✗ | ✓ | ✗ | ✗ | ✓ |
| `Futures_Boros` | ✓ | ✗ | ✓ | ✓ | ✓ | ✓ |
| `Futures_WOOFi` | ✓ | ✓ | ✓ | ✓ | 合成 | ✓ |
| `Uniswap` | ✓ | ✗ | ✓ | ✓ | ✗ | ✓ |
| `Jupiter` | ✓ | ✗ | ✓ | ✗ | ✗ | ✓ |
| `KyberSwap` | ✓ | ✗ | ✓ | ✗ | ✗ | ✓ |
| `OneInch` | ✓ | ✗ | ✓ | ✗ | ✗ | ✓ |
| `OKX_DEX` | ✓ | ✓ | ✗ | ✓ | 合成 | ✓ |
| **预测市场** |  |  |  |  |  |  |
| `Futures_Polymarket` | ✓ | ✓ | ✓ | ✓ | 合成 | ✓ |
| **证券与期货** |  |  |  |  |  |  |
| `Futures_Futu` | ✓ | ✓ | ✓ | ✓ | 合成 | ✓ |
| `Futures_IB` | ✓ | ✓ | ✓ | ✗ | 合成 | ✓ |
| **链上与自定义接入** |  |  |  |  |  |  |
| `Exchange` | ✓ | ✗ | ✓ | ✓ | 合成 | ✗ |
| `Web3` | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |

#### 交易

| 交易所 | `CreateOrder` | `Buy` | `Sell` | `CancelOrder` | `ModifyOrder` | `GetOrder` | `GetOrders` | `GetHistoryOrders` |
| - | - | - | - | - | - | - | - | - |
| **中心化交易所** |  |  |  |  |  |  |  |  |
| `AscendEx` | ✓ | ✓ | ✓ | ✓ | ✗ | ✓ | ✓ | ✓ |
| `Backpack` | ✓ | ✓ | ✓ | ✓ | ✗ | ✓ | ✓ | ✓ |
| `Futures_Backpack` | ✓ | ✓ | ✓ | ✓ | ✗ | ✓ | ✓ | ✓ |
| `BigONE` | ✓ | ✓ | ✓ | ✓ | ✗ | ✓ | ✓ | ✓ |
| `Binance` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `Futures_Binance` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `Bitfinex` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `Futures_Bitfinex` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `BitFlyer` | ✓ | ✓ | ✓ | ✓ | ✗ | ✓ | ✓ | ✓ |
| `Bitget` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `Futures_Bitget` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `Bithumb` | ✓ | ✓ | ✓ | ✓ | ✗ | ✓ | ✓ | ✓ |
| `Bitstamp` | ✓ | ✓ | ✓ | ✓ | ✗ | ✓ | ✓ | ✗ |
| `Bybit` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `Futures_Bybit` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `Coincheck` | ✓ | ✓ | ✓ | ✓ | ✗ | 合成 | ✓ | ✗ |
| `Coinone` | ✓ | ✓ | ✓ | ✓ | ✗ | ✓ | ✓ | ✓ |
| `Coinw` | ✓ | ✓ | ✓ | ✓ | ✗ | ✓ | ✓ | ✓ |
| `Futures_Coinw` | ✓ | ✓ | ✓ | ✓ | ✗ | ✓ | ✓ | ✓ |
| `Crypto` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `Futures_Crypto` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `DeepCoin` | ✓ | ✓ | ✓ | ✓ | ✗ | ✓ | ✓ | ✓ |
| `Futures_DeepCoin` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `Futures_Deribit` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `DigiFinex` | ✓ | ✓ | ✓ | ✓ | ✗ | ✓ | ✓ | ✓ |
| `Futures_DigiFinex` | ✓ | ✓ | ✓ | ✓ | ✗ | ✓ | ✓ | ✓ |
| `GateIO` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `Futures_GateIO` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `Gemini` | ✓ | ✓ | ✓ | ✓ | ✗ | ✓ | ✓ | ✓ |
| `HashKey` | ✓ | ✓ | ✓ | ✓ | ✗ | ✓ | ✓ | ✓ |
| `HitBTC` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `Huobi` | ✓ | ✓ | ✓ | ✓ | ✗ | ✓ | ✓ | ✓ |
| `Futures_HuobiDM` | ✓ | ✓ | ✓ | ✓ | ✗ | ✓ | ✓ | ✓ |
| `Korbit` | ✓ | ✓ | ✓ | ✓ | ✗ | ✓ | ✓ | ✓ |
| `Kraken` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `Futures_Kraken` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `KuCoin` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `Futures_KuCoin` | ✓ | ✓ | ✓ | ✓ | ✗ | ✓ | ✓ | ✓ |
| `LBank` | ✓ | ✓ | ✓ | ✓ | ✗ | ✓ | ✓ | ✓ |
| `MEXC` | ✓ | ✓ | ✓ | ✓ | ✗ | ✓ | ✓ | ✓ |
| `Futures_MEXC` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `OKEX` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `Futures_OKCoin` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `Poloniex` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `Upbit` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `WEEX` | ✓ | ✓ | ✓ | ✓ | ✗ | ✓ | ✓ | ✓ |
| `Futures_WEEX` | ✓ | ✓ | ✓ | ✓ | ✗ | ✓ | ✓ | ✓ |
| `WOO` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `Futures_WOO` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `Zaif` | ✓ | ✓ | ✓ | ✓ | ✗ | 合成 | ✓ | ✓ |
| **去中心化交易所** |  |  |  |  |  |  |  |  |
| `Hyperliquid` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `Futures_Hyperliquid` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `Futures_Lighter` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `Futures_EdgeX` | ✓ | ✓ | ✓ | ✓ | ✗ | ✓ | ✓ | ✓ |
| `Aster` | ✓ | ✓ | ✓ | ✓ | ✗ | ✓ | ✓ | ✓ |
| `Futures_ApolloX` | ✓ | ✓ | ✓ | ✓ | ✗ | ✓ | ✓ | ✓ |
| `Futures_Aster` | ✓ | ✓ | ✓ | ✓ | ✗ | ✓ | ✓ | ✓ |
| `Futures_Aevo` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `Pendle` | ✓ | ✓ | ✓ | ✓ | ✗ | ✓ | ✓ | ✓ |
| `Futures_Boros` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `Futures_WOOFi` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `Uniswap` | ✓ | ✓ | ✓ | ✓ | ✗ | ✓ | ✓ | ✗ |
| `Jupiter` | ✓ | ✓ | ✓ | ✗ | ✗ | ✓ | ✓ | ✗ |
| `KyberSwap` | ✓ | ✓ | ✓ | ✓ | ✗ | ✓ | ✓ | ✗ |
| `OneInch` | ✓ | ✓ | ✓ | ✓ | ✗ | ✓ | ✓ | ✗ |
| `OKX_DEX` | ✓ | ✓ | ✓ | ✗ | ✗ | ✓ | ✗ | ✗ |
| **预测市场** |  |  |  |  |  |  |  |  |
| `Futures_Polymarket` | ✓ | ✓ | ✓ | ✓ | ✗ | ✓ | ✓ | ✓ |
| **证券与期货** |  |  |  |  |  |  |  |  |
| `Futures_Futu` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `Futures_IB` | ✓ | ✓ | ✓ | ✓ | ✗ | ✓ | ✓ | ✗ |
| **链上与自定义接入** |  |  |  |  |  |  |  |  |
| `Exchange` | ✓ | ✓ | ✓ | ✓ | ✗ | ✓ | ✓ | ✓ |
| `Web3` | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |

#### 条件单

| 交易所 | `CreateConditionOrder` | `ModifyConditionOrder` | `CancelConditionOrder` | `GetConditionOrder` | `GetConditionOrders` | `GetHistoryConditionOrders` |
| - | - | - | - | - | - | - |
| **中心化交易所** |  |  |  |  |  |  |
| `AscendEx` | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| `Backpack` | ✓ | ✗ | ✓ | ✓ | ✓ | ✓ |
| `Futures_Backpack` | ✓ | ✗ | ✓ | ✓ | ✓ | ✓ |
| `BigONE` | ✓ | ✗ | ✓ | ✓ | ✓ | ✓ |
| `Binance` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `Futures_Binance` | ✓ | ✗ | ✓ | ✓ | ✓ | ✓ |
| `Bitfinex` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `Futures_Bitfinex` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `BitFlyer` | ✓ | ✗ | ✓ | ✓ | ✓ | ✓ |
| `Bitget` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `Futures_Bitget` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `Bithumb` | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| `Bitstamp` | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| `Bybit` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `Futures_Bybit` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `Coincheck` | ✓ | ✗ | ✓ | ✓ | ✓ | ✗ |
| `Coinone` | ✓ | ✗ | ✓ | ✓ | ✓ | ✗ |
| `Coinw` | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| `Futures_Coinw` | ✓ | ✗ | ✓ | ✓ | ✓ | ✓ |
| `Crypto` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `Futures_Crypto` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `DeepCoin` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `Futures_DeepCoin` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `Futures_Deribit` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `DigiFinex` | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| `Futures_DigiFinex` | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| `GateIO` | ✓ | ✗ | ✓ | ✓ | ✓ | ✓ |
| `Futures_GateIO` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `Gemini` | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| `HashKey` | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| `HitBTC` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `Huobi` | ✓ | ✗ | ✓ | ✓ | ✓ | ✓ |
| `Futures_HuobiDM` | ✓ | ✗ | ✓ | ✓ | ✓ | ✓ |
| `Korbit` | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| `Kraken` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `Futures_Kraken` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `KuCoin` | ✓ | ✗ | ✓ | ✓ | ✓ | ✓ |
| `Futures_KuCoin` | ✓ | ✗ | ✓ | ✓ | ✓ | ✓ |
| `LBank` | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| `MEXC` | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| `Futures_MEXC` | ✓ | ✗ | ✓ | ✓ | ✓ | ✓ |
| `OKEX` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `Futures_OKCoin` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `Poloniex` | ✓ | ✗ | ✓ | ✓ | ✓ | ✓ |
| `Upbit` | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| `WEEX` | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| `Futures_WEEX` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `WOO` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `Futures_WOO` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `Zaif` | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| **去中心化交易所** |  |  |  |  |  |  |
| `Hyperliquid` | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| `Futures_Hyperliquid` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `Futures_Lighter` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `Futures_EdgeX` | ✓ | ✗ | ✓ | ✓ | ✓ | ✓ |
| `Aster` | ✓ | ✗ | ✓ | ✓ | ✓ | ✓ |
| `Futures_ApolloX` | ✓ | ✗ | ✓ | ✓ | ✓ | ✓ |
| `Futures_Aster` | ✓ | ✗ | ✓ | ✓ | ✓ | ✓ |
| `Futures_Aevo` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `Pendle` | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| `Futures_Boros` | ✓ | ✗ | ✓ | ✓ | ✓ | ✓ |
| `Futures_WOOFi` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `Uniswap` | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| `Jupiter` | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| `KyberSwap` | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| `OneInch` | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| `OKX_DEX` | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| **预测市场** |  |  |  |  |  |  |
| `Futures_Polymarket` | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| **证券与期货** |  |  |  |  |  |  |
| `Futures_Futu` | ✗ | ✗ | ✗ | ✗ | ✓ | ✓ |
| `Futures_IB` | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| **链上与自定义接入** |  |  |  |  |  |  |
| `Exchange` | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| `Web3` | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |

#### 账户与期货

| 交易所 | `GetAccount` | `GetAssets` | `GetPositions` | `SetMarginLevel` | `SetDirection` | `SetContractType` | `GetFundings` |
| - | - | - | - | - | - | - | - |
| **中心化交易所** |  |  |  |  |  |  |  |
| `AscendEx` | ✓ | ✓ | — | — | — | — | — |
| `Backpack` | ✓ | ✓ | — | — | — | — | — |
| `Futures_Backpack` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `BigONE` | ✓ | ✓ | — | — | — | — | — |
| `Binance` | ✓ | ✓ | — | — | — | — | — |
| `Futures_Binance` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `Bitfinex` | ✓ | ✓ | — | — | — | — | — |
| `Futures_Bitfinex` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `BitFlyer` | ✓ | ✓ | — | — | — | — | — |
| `Bitget` | ✓ | ✓ | — | — | — | — | — |
| `Futures_Bitget` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `Bithumb` | ✓ | ✓ | — | — | — | — | — |
| `Bitstamp` | ✓ | ✓ | — | — | — | — | — |
| `Bybit` | ✓ | ✓ | — | — | — | — | — |
| `Futures_Bybit` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `Coincheck` | ✓ | ✓ | — | — | — | — | — |
| `Coinone` | ✓ | ✓ | — | — | — | — | — |
| `Coinw` | ✓ | ✓ | — | — | — | — | — |
| `Futures_Coinw` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `Crypto` | ✓ | ✓ | — | — | — | — | — |
| `Futures_Crypto` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `DeepCoin` | ✓ | ✓ | — | — | — | — | — |
| `Futures_DeepCoin` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `Futures_Deribit` | ✓ | ✓ | ✓ | ✗ | ✓ | ✓ | ✓ |
| `DigiFinex` | ✓ | ✓ | — | — | — | — | — |
| `Futures_DigiFinex` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `GateIO` | ✓ | ✓ | — | — | — | — | — |
| `Futures_GateIO` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `Gemini` | ✓ | ✓ | — | — | — | — | — |
| `HashKey` | ✓ | ✓ | — | — | — | — | — |
| `HitBTC` | ✓ | ✓ | — | — | — | — | — |
| `Huobi` | ✓ | ✓ | — | — | — | — | — |
| `Futures_HuobiDM` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `Korbit` | ✓ | ✓ | — | — | — | — | — |
| `Kraken` | ✓ | ✓ | — | — | — | — | — |
| `Futures_Kraken` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `KuCoin` | ✓ | ✓ | — | — | — | — | — |
| `Futures_KuCoin` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `LBank` | ✓ | ✓ | — | — | — | — | — |
| `MEXC` | ✓ | ✓ | — | — | — | — | — |
| `Futures_MEXC` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `OKEX` | ✓ | ✓ | — | — | — | — | — |
| `Futures_OKCoin` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `Poloniex` | ✓ | ✓ | — | — | — | — | — |
| `Upbit` | ✓ | ✓ | — | — | — | — | — |
| `WEEX` | ✓ | ✓ | — | — | — | — | — |
| `Futures_WEEX` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `WOO` | ✓ | ✓ | — | — | — | — | — |
| `Futures_WOO` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `Zaif` | ✓ | ✓ | — | — | — | — | — |
| **去中心化交易所** |  |  |  |  |  |  |  |
| `Hyperliquid` | ✓ | ✓ | — | — | — | — | — |
| `Futures_Hyperliquid` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `Futures_Lighter` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `Futures_EdgeX` | ✓ | ✓ | ✓ | ✗ | ✓ | ✓ | ✓ |
| `Aster` | ✓ | ✓ | — | — | — | — | — |
| `Futures_ApolloX` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `Futures_Aster` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `Futures_Aevo` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `Pendle` | ✓ | ✓ | — | — | — | — | — |
| `Futures_Boros` | ✓ | ✓ | ✓ | ✗ | ✓ | ✓ | ✓ |
| `Futures_WOOFi` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `Uniswap` | ✓ | ✓ | — | — | — | — | — |
| `Jupiter` | ✓ | ✓ | — | — | — | — | — |
| `KyberSwap` | ✓ | ✓ | — | — | — | — | — |
| `OneInch` | ✓ | ✓ | — | — | — | — | — |
| `OKX_DEX` | ✓ | ✓ | — | — | — | — | — |
| **预测市场** |  |  |  |  |  |  |  |
| `Futures_Polymarket` | ✓ | ✓ | ✓ | ✗ | ✓ | ✓ | ✗ |
| **证券与期货** |  |  |  |  |  |  |  |
| `Futures_Futu` | ✓ | ✓ | ✓ | ✗ | ✓ | ✓ | ✗ |
| `Futures_IB` | ✓ | ✓ | ✓ | ✗ | ✓ | ✓ | ✗ |
| **链上与自定义接入** |  |  |  |  |  |  |  |
| `Exchange` | ✓ | ✓ | — | — | — | — | — |
| `Web3` | ✓ | ✓ | — | — | — | — | — |

#### 交易模式指令

各交易所对```exchange.IO()```交易模式指令的支持：✓ 支持，✗ 不支持（调用时报错）。指令语义见```exchange.IO(mode, value)```页（`IO`分类下）；未列出的交易所不支持其中任何一条。

| 交易所 | ```simulate``` | ```cross``` | ```dual``` | ```unified``` | ```trade_margin``` | ```trade_super_margin``` | ```trade_normal``` | ```selfTradePreventionMode``` |
| - | - | - | - | - | - | - | - | - |
| **中心化交易所** |  |  |  |  |  |  |  |  |
| `AscendEx` | ✗ | ✗ | ✗ | ✗ | ✓ | ✗ | ✓ | ✗ |
| `Backpack` | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ |
| `Futures_Backpack` | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ |
| `Binance` | ✗ | ✗ | ✗ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `Futures_Binance` | ✗ | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ | ✓ |
| `Bitget` | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| `Futures_Bitget` | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ |
| `Bybit` | ✗ | ✗ | ✗ | ✗ | ✓ | ✗ | ✓ | ✗ |
| `Futures_Bybit` | ✗ | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ |
| `Futures_Coinw` | ✗ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| `Crypto` | ✗ | ✗ | ✗ | ✗ | ✓ | ✗ | ✓ | ✗ |
| `Futures_DeepCoin` | ✗ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| `Futures_DigiFinex` | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| `GateIO` | ✗ | ✗ | ✗ | ✓ | ✓ | ✓ | ✓ | ✗ |
| `Futures_GateIO` | ✗ | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ |
| `Huobi` | ✗ | ✗ | ✗ | ✗ | ✓ | ✓ | ✓ | ✗ |
| `Futures_HuobiDM` | ✗ | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ |
| `Futures_Kraken` | ✗ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| `Futures_KuCoin` | ✗ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| `Futures_MEXC` | ✗ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| `OKEX` | ✓ | ✗ | ✗ | ✗ | ✓ | ✓ | ✓ | ✗ |
| `Futures_OKCoin` | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ |
| `WOO` | ✗ | ✗ | ✗ | ✗ | ✓ | ✗ | ✓ | ✗ |
| `Futures_WOO` | ✗ | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ |
| **去中心化交易所** |  |  |  |  |  |  |  |  |
| `Futures_Hyperliquid` | ✗ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| `Futures_Lighter` | ✗ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| `Futures_ApolloX` | ✗ | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ |
| `Futures_Aster` | ✗ | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ |
| `Uniswap` | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| `KyberSwap` | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| `OneInch` | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |

### 中心化交易所

加密货币交易所，每个品牌一页，同品牌的现货、期货交易所对象写在同一页。

#### AscendEx

现货，支持现货钱包与杠杆钱包（用```exchange.IO("trade_margin")```切换）。

##### 名称与配置

```exchange.GetName()```：```AscendEx```（现货）；别名：AscendEX、BitMax。

| 配置项 | 必填 |
| - | - |
| Access Key | 是 |
| Secret Key | 是 |

##### 交易对与合约代码

交易对示例：```BTC_USDT```、```ETH_USDT```

交易对写作```BASE_QUOTE```，对应AscendEx原生代码```BTC/USDT```。

##### 专属IO指令

| 指令 | 说明 |
| - | - |
| ```trade_margin``` | 切换为杠杆钱包。之后账户、下单、撤单、查单、挂单与历史订单、```exchange.GetMarkets()```都使用杠杆钱包的接口；杠杆钱包下```exchange.GetTickers()```报错。 |
| ```trade_normal``` | 切换回现货钱包（默认）。 |

通用指令```api```、```base```、```currency```见`exchange.IO`。

##### 函数支持差异

不支持（调用时报错并返回空值）：`exchange.ModifyOrder`、`exchange.CreateConditionOrder`、`exchange.ModifyConditionOrder`、`exchange.CancelConditionOrder`、`exchange.GetConditionOrder`、`exchange.GetConditionOrders`、`exchange.GetHistoryConditionOrders`。

以回退方式支持：

- `exchange.GetRecords`：原生周期为1分钟、5分钟、15分钟、30分钟、1小时、2小时、4小时、6小时、12小时、1天、1周、1月；其它周期由托管者合成。

##### 注意事项

- 交易所已停止服务。
- 现货市价买单的下单量是交易币数，不是计价币金额。

#### Backpack

```Backpack```（现货）：Backpack Exchange的现货交易（主要以USDC计价），包括交易所上线的代币化股票。永续合约见Futures_Backpack交易所对象。

```Futures_Backpack```（期货）：Backpack Exchange的USDC永续合约，包括代币化股票的永续合约。现货见Backpack交易所对象。

##### 名称与配置

| ```exchange.GetName()``` | 类型 | 别名 |
| - | - | - |
| ```Backpack``` | 现货 | Backpack Exchange |
| ```Futures_Backpack``` | 期货 | — |

| 配置项 | 必填 |
| - | - |
| Access Key | 是 |
| Secret Key | 是 |

##### 交易对与合约代码

###### ```Backpack```（现货）

交易对示例：```SOL_USDC```、```BTC_USDC```、```SPCX-US_USDC```

交易对写作```SOL_USDC```。代币化股票的交易所币名带```.```（如```SPCX.US```），在交易对和资产名中写作```-```：```SPCX-US_USDC```。

###### ```Futures_Backpack```（期货）

交易对示例：```BTC_USDC```、```ETH_USDC```

Backpack永续合约以USDC计价，交易对写作```ETH_USDC```（省略计价币时按USDC处理）。代币化股票的交易所币名带```.```（如```MU.US```），在交易对和资产名中写作```-```：```MU-US_USDC```。

| 合约代码 | 说明 |
| - | - |
| ```swap``` | 永续合约（交易所代码```ETH_USDC_PERP```），完整品种代码形如```ETH_USDC.swap```。 |

Backpack只有永续合约，其它合约代码都会报错。

##### 专属IO指令

###### ```Backpack```（现货）

| 指令 | 参数 | 说明 | 返回值 |
| - | - | - | - |
| ```selfTradePreventionMode``` | string | 自成交预防，可选```Allow```、```RejectTaker```、```RejectMaker```、```RejectBoth```（区分大小写），设置后之后的订单和条件单随单带上。 | 成功返回空值；取值不在上述范围内时报错。 |

通用指令```api```、```base```、```currency```见`exchange.IO`。

###### ```Futures_Backpack```（期货）

| 指令 | 参数 | 说明 | 返回值 |
| - | - | - | - |
| ```selfTradePreventionMode``` | string | 自成交预防，可选```Allow```、```RejectTaker```、```RejectMaker```、```RejectBoth```（区分大小写），设置后之后的订单和条件单随单带上。 | 成功返回设置的取值；取值不在上述范围内时报错。 |

通用指令```api```、```base```、```currency```见`exchange.IO`。

##### 函数支持差异

不支持（调用时报错并返回空值）：`exchange.ModifyOrder`、`exchange.ModifyConditionOrder`。

以回退方式支持：

- `exchange.GetRecords`：原生周期为1分钟、3分钟、5分钟、15分钟、30分钟、1小时、2小时、4小时、6小时、8小时、12小时、1天、3天、1周、1月；其它周期由托管者合成。

##### 保证金、账户与模拟盘

###### ```Futures_Backpack```（期货）

保证金模式：Backpack是统一抵押账户，只有全仓，没有全仓/逐仓切换指令。```exchange.SetMarginLevel()```修改的是账户级的杠杆上限（```leverageLimit```），对所有合约生效；调用时同时把账户的自动借贷设置（```autoBorrowSettlements```、```autoLend```、```autoRepayBorrows```）设为开启。

持仓模式：只有单向（净）持仓，没有双向持仓。平仓单（```closebuy```、```closesell```）以只减仓（```reduceOnly```）方式下单。```exchange.GetPositions()```的```MarginLevel```为初始保证金率的倒数。

账户：```exchange.GetAccount()```读取抵押品账户：```Balance```为可用净权益，```FrozenBalance```为占用的净权益，```Equity```为净权益；各抵押币种在```exchange.GetAssets()```中逐币列出。

##### 注意事项

###### 全部交易所对象

- 客户端订单号```clientId```必须是0～4294967295之间的整数，其它值报错，订单不会发出。
- ```exchange.GetTickers()```的批量行情没有盘口，```Buy```、```Sell```取最新成交价；需要真实买一、卖一时用```exchange.GetTicker()```。
- 条件单只支持止盈、止损单，不支持OCO；Backpack的触发单不区分止盈、止损，查询时按触发价与当前最新价的关系判定类型。委托价为0时触发后以市价成交。不支持修改条件单，需要先撤销再重新创建。
- ```exchange.GetHistoryOrders()```、```exchange.GetHistoryConditionOrders()```只能按单个品种查询，不支持```since```参数（交易所的历史订单接口没有时间范围），传入大于0的```since```或空字符串品种会报错。

###### ```Backpack```（现货）

- 市价买单的下单量是要花费的计价币金额（按Backpack的```quoteQuantity```下单），市价卖单为交易币数量。按计价币金额下的市价买单在订单查询中没有委托价，```Price```为0。
- ```exchange.GetAccount()```、```exchange.GetAssets()```只统计可用与冻结数量，不包含质押中的数量。

###### ```Futures_Backpack```（期货）

- 市价单的下单量是合约数量（交易币数量），买卖相同。
- 各合约的资金费率结算间隔不同，```exchange.GetFundings()```按交易所合约信息给出。

#### BigONE

现货交易。

##### 名称与配置

```exchange.GetName()```：```BigONE```（现货）。

| 配置项 | 必填 |
| - | - |
| Access Key | 是 |
| Secret Key | 是 |

##### 交易对与合约代码

交易对示例：```BTC_USDT```、```ETH_BTC```

交易对写作```BASE_QUOTE```，对应BigONE原生代码```BTC-USDT```。

##### 函数支持差异

不支持（调用时报错并返回空值）：`exchange.ModifyOrder`、`exchange.ModifyConditionOrder`。

以回退方式支持：

- `exchange.GetRecords`：原生周期为1分钟、5分钟、15分钟、30分钟、1小时、3小时、4小时、6小时、12小时、1天、1周、1月；其它周期由托管者合成。

##### 注意事项

- 不支持市价单，只能下限价单；不支持FOK（```tif```为```fok```时报错），支持IOC与只做Maker（```postOnly```）。
- 查询未完成订单、未完成条件单的接口必须指定交易对：```exchange.GetOrders()```、```exchange.GetConditionOrders()```不传```symbol```参数时只查询当前交易对。
- ```exchange.GetHistoryOrders()```、```exchange.GetHistoryConditionOrders()```不支持```since```参数（交易所接口没有时间范围参数），传入时报错；不传时返回最近的订单。
- 条件单支持止盈、止损（不填委托价为触发后市价成交），不支持OCO。

#### 币安

```Binance```（现货）：币安现货，以及币安杠杆账户（逐仓、全仓）和统一账户（组合保证金）下的全仓杠杆交易。

```Futures_Binance```（期货）：币安U本位（USDT、USDC保证金）、币本位永续与交割合约，以及币安欧式期权（USDT结算）。

##### 名称与配置

| ```exchange.GetName()``` | 类型 |
| - | - |
| ```Binance``` | 现货 |
| ```Futures_Binance``` | 期货 |

| 配置项 | 必填 | 默认值 |
| - | - | - |
| Access Key | 是 | — |
| Secret Key | 是 | — |
| 模拟盘 | 否 | 不勾选 |

##### 交易对与合约代码

###### ```Binance```（现货）

交易对示例：```BTC_USDT```、```ETH_BTC```

交易对写作```BTC_USDT```，不带合约代码；带```.swap```等合约后缀的品种代码会报错（合约请使用Futures_Binance交易所对象）。

###### ```Futures_Binance```（期货）

交易对示例：```BTC_USDT```、```BTC_USDC```、```BTC_USD```

计价币决定合约类型：```BTC_USDT```、```BTC_USDC```为U本位合约，```BTC_USD```为币本位合约。支持币安的中文交易对，例如```币安人生_USDT.swap```。

| 合约代码 | 说明 |
| - | - |
| ```swap``` | 永续合约（默认）。U本位、币本位都有。 |
| ```quarter``` | 当季交割合约。币本位都有；U本位只有部分币种挂牌。 |
| ```next_quarter``` | 次季交割合约，挂牌范围同```quarter```。 |

不可用的通用合约代码：```this_week```、```next_week```。

币安没有周合约，```this_week```、```next_week```会报错。

原生合约代码示例：```BTCUSDT_260925```、```BTCUSD_260925```

交割合约也可以直接写币安的原生合约代码（交易对去掉下划线、加```_```和交割日期）。

##### 专属IO指令

###### ```Binance```（现货）

| 指令 | 参数 | 说明 | 返回值 |
| - | - | - | - |
| ```trade_margin``` | — | 切换为逐仓杠杆账户，之后账户、下单、订单查询都使用逐仓杠杆接口。模拟盘没有杠杆接口，会报错。 | 指令名本身。 |
| ```trade_super_margin``` | — | 切换为全仓杠杆账户（模拟盘不支持）。账户为统一账户时使用统一账户（papi.binance.com）的全仓杠杆接口。 | 指令名本身。 |
| ```trade_normal``` | — | 切换回普通现货账户（默认）。 | 指令名本身。 |
| ```unified``` | bool | 统一账户（组合保证金），只在全仓杠杆（```trade_super_margin```）下生效。不调用时，切换到全仓杠杆后首次请求自动探测。 | 成功也返回空值，需要确认时调用后读取GetLastError()。 |
| ```selfTradePreventionMode``` | string | 自成交预防，可选```EXPIRE_TAKER```、```EXPIRE_MAKER```、```EXPIRE_BOTH```、```NONE```，之后的订单随单带上。 | 成功也返回空值，需要确认时调用后读取GetLastError()。 |

通用指令```api```、```base```、```currency```见`exchange.IO`。

###### ```Futures_Binance```（期货）

| 指令 | 参数 | 说明 | 返回值 |
| - | - | - | - |
| ```cross``` | bool[, symbol] | 全仓（true）/逐仓（false）。 | 成功也返回空值，需要确认时调用后读取GetLastError()。 |
| ```dual``` | bool[, symbol] | 双向（true）/单向（false）持仓，U本位、币本位分别设置。 | 成功也返回空值，需要确认时调用后读取GetLastError()。 |
| ```unified``` | bool[, symbol] | 统一账户（组合保证金），切换后使用papi.binance.com；不调用时首次私有请求自动探测。当前合约为期权时报错。 | — |
| ```selfTradePreventionMode``` | string | 自成交预防，可选```EXPIRE_TAKER```、```EXPIRE_MAKER```、```EXPIRE_BOTH```、```NONE```，之后的订单随单带上。 | — |
| ```coinmBase``` | [string] | 查询或切换币本位合约接口基地址（```base```指令只作用于U本位）。 | 修改前的地址。 |
| ```eapiBase``` | [string] | 查询或切换期权接口基地址。 | 修改前的地址。 |

通用指令```api```、```base```、```currency```见`exchange.IO`。

##### 函数支持差异

###### ```Binance```（现货）

没有不支持的标准函数。

以回退方式支持：

- `exchange.GetRecords`：原生周期为1秒、1分钟、3分钟、5分钟、15分钟、30分钟、1小时、2小时、4小时、6小时、8小时、12小时、1天、3天、1周、1月；其它周期由托管者合成。

###### ```Futures_Binance```（期货）

不支持（调用时报错并返回空值）：`exchange.ModifyConditionOrder`。

以回退方式支持：

- `exchange.GetRecords`：原生周期为1分钟、3分钟、5分钟、15分钟、30分钟、1小时、2小时、4小时、6小时、8小时、12小时、1天、3天、1周、1月；其它周期由托管者合成。

##### 保证金、账户与模拟盘

###### ```Binance```（现货）

账户：默认为普通现货账户，用```exchange.IO("trade_margin")```、```exchange.IO("trade_super_margin")```切换到逐仓、全仓杠杆账户，切换后所有账户与订单调用都换到对应的杠杆接口，直到```exchange.IO("trade_normal")```切回。逐仓杠杆下```exchange.GetAssets()```把各逐仓交易对中同一币种的余额相加。

模拟盘：勾选「模拟盘」使用币安demo环境（```demo-api.binance.com```）。demo环境没有杠杆接口，只能交易普通现货。

###### ```Futures_Binance```（期货）

保证金模式：用```exchange.IO("cross", bool)```按合约切换全仓/逐仓；```exchange.SetMarginLevel()```设置杠杆。统一账户恒为全仓，切换逐仓会报错。

持仓模式：用```exchange.IO("dual", bool)```切换双向/单向持仓，U本位与币本位各自独立。下单时按账户实际的持仓模式带仓位参数，也可以在下单附加参数中显式传```positionSide```。

账户：统一账户（组合保证金）在首次私有请求时自动探测，也可以用```exchange.IO("unified", bool)```指定。统一账户下```exchange.GetAccount()```的```Balance```是所有资产折算成USD的金额；其它资产的折算金额可用USD金额除以该资产的指数价格再除以质押率得到。

模拟盘：勾选「模拟盘」使用币安demo环境（```demo-fapi```、```demo-dapi```）。demo环境没有期权接口，模拟盘下期权相关调用报错（可以用```exchange.IO("eapiBase", url)```显式指定期权接口地址）。

##### 期权

###### ```Futures_Binance```（期货）

支持币安欧式期权（USDT结算），需要账户已开通期权交易；交易所可能要求单独申请期权卖方资格。限制：

- 只支持限价单，不支持市价单、条件单和改单（```exchange.ModifyOrder()```）。
- 不支持```exchange.SetMarginLevel()```、```exchange.GetFundings()```，期权合约不能切换保证金模式。
- 当前合约为期权时```exchange.IO("unified", true)```报错；账户本身是统一账户时，期权照常通过期权接口交易。
- ```exchange.GetMarkets()```不列出期权合约，期权代码需要从币安接口或网页获取。

期权代码示例：```BTC-260925-145000-C```、```XRP-240112-0.5-C```

期权代码为币安原生代码：标的-到期日（YYMMDD）-行权价-C/P，C为看涨、P为看跌。币安期权以USDT结算，交易对设置为```BTC_USDT```，完整品种代码形如```BTC_USDT.BTC-260925-145000-C```。

##### 注意事项

###### ```Binance```（现货）

- ```exchange.ModifyOrder()```、```exchange.ModifyConditionOrder()```使用币安的撤单再下单接口（```cancelReplace```，撤单失败则不下新单），返回新订单的ID，之后按新ID操作；只支持普通现货账户，杠杆账户下报错。
- 条件单只支持止盈、止损单，不支持OCO，需要时分别创建止盈单和止损单。

###### ```Futures_Binance```（期货）

- 条件单只支持止盈、止损单，不支持OCO（币安合约没有OCO接口）；不支持修改条件单，需要先撤销再重新创建。

#### Bitfinex

```Bitfinex```（现货）：Bitfinex现货交易（交易所钱包），使用Bitfinex v2接口。

```Futures_Bitfinex```（期货）：Bitfinex衍生品：USDT结算的永续合约。

##### 名称与配置

| ```exchange.GetName()``` | 类型 | 别名 |
| - | - | - |
| ```Bitfinex``` | 现货 | — |
| ```Futures_Bitfinex``` | 期货 | Bitfinex期货、Bitfinex Futures |

| 配置项 | 必填 |
| - | - |
| Access Key | 是 |
| Secret Key | 是 |

##### 交易对与合约代码

###### ```Bitfinex```（现货）

交易对示例：```BTC_USD```、```BTC_USDT```、```AAVE_USD```

交易对写作```BASE_QUOTE```，对应Bitfinex的```tBTCUSD```、```tAAVE:USD```。Bitfinex把USDT写作```UST```，交易对用```USDT```即可，返回的品种代码统一用```USDT```。

###### ```Futures_Bitfinex```（期货）

交易对示例：```BTC_USDT```、```ETH_USDT```

交易对如```BTC_USDT```，对应Bitfinex的```tBTCF0:USTF0```。

| 合约代码 | 说明 |
| - | - |
| ```swap``` | 永续合约（唯一的合约代码）。 |

Bitfinex只有永续合约，其它合约代码会报错。

##### 专属IO指令

###### ```Bitfinex```（现货）

| 指令 | 说明 | 返回值 |
| - | - | - |
| ```version``` | 获取API版本号。 | 固定返回```v2```。 |

通用指令```api```、```base```、```currency```见`exchange.IO`。

###### ```Futures_Bitfinex```（期货）

| 指令 | 参数 | 说明 | 返回值 |
| - | - | - | - |
| ```mbase``` | [string] | 查询或切换行情（公开）接口基地址，与交易接口基地址（```base```指令）分开；未设置时与交易接口相同。 | 修改前的地址。 |

通用指令```api```、```base```、```currency```见`exchange.IO`。

##### 函数支持差异

没有不支持的标准函数。

以回退方式支持：

- `exchange.GetRecords`：原生周期为1分钟、5分钟、15分钟、30分钟、1小时、3小时、6小时、12小时、1天、1周、14天、1月；其它周期由托管者合成。

##### 保证金、账户与模拟盘

###### ```Futures_Bitfinex```（期货）

账户：合约保证金在Bitfinex保证金钱包（margin）中带```F0```后缀的币种上（如```USTF0```），`exchange.GetAccount`返回的币种去掉了后缀（```USTF0```显示为```USDT```）。Bitfinex没有设置杠杆的接口：```exchange.SetMarginLevel()```只在本地记下每个合约的杠杆，下单时随订单发送（未设置时为10倍）。

##### 注意事项

###### 全部交易所对象

- 条件单只支持止盈、止损单，不支持OCO。
- 下单的```clientId```只接受正整数（Bitfinex的```cid```），其它值报错。限价单支持```tif```的IOC、FOK与只做Maker（```postOnly```）；市价单不支持FOK与只做Maker，条件单不支持IOC、FOK，传入时报错。

###### ```Bitfinex```（现货）

- 现货市价买单的下单量是交易币数，不是计价币金额。
- Bitfinex价格精度为5位有效数字，没有固定的价格步长；`exchange.GetMarkets`返回的```TickSize```、```PricePrecision```按当前最新价换算，价格量级变化后会随之变化。

###### ```Futures_Bitfinex```（期货）

- 下单量的单位是币数，不是合约张数。
- Bitfinex价格精度为5位有效数字，`exchange.GetMarkets`返回的```TickSize```、```PricePrecision```按当前最新价换算。

#### bitFlyer

日本交易所的现货交易。只提供现货交易对，不含bitFlyer的FX与期货产品。

##### 名称与配置

```exchange.GetName()```：```BitFlyer```（现货）。

| 配置项 | 必填 |
| - | - |
| Access Key | 是 |
| Secret Key | 是 |

##### 交易对与合约代码

交易对示例：```BTC_JPY```、```ETH_JPY```

交易对写作```BASE_QUOTE```，与bitFlyer原生```product_code```同形。

##### 函数支持差异

不支持（调用时报错并返回空值）：`exchange.GetTickers`、`exchange.ModifyOrder`、`exchange.ModifyConditionOrder`。

以回退方式支持：

- `exchange.GetRecords`：交易所没有K线接口，由托管者用成交记录合成：首次调用只有最近成交覆盖的少量K线，随调用逐步累积。

##### 注意事项

- 现货市价买单的下单量是交易币数，不是计价币金额（按bitFlyer的```size```下单）。
- 不支持只做Maker（```postOnly```）。
- 查询未完成订单、未完成条件单的接口必须指定交易对：```exchange.GetOrders()```、```exchange.GetConditionOrders()```不传```symbol```参数时只查询当前交易对。
- ```exchange.GetHistoryOrders()```、```exchange.GetHistoryConditionOrders()```不支持```since```参数（交易所只能按订单号翻页），传入时报错；不传时返回最近的订单。
- 条件单使用bitFlyer的父订单（SIMPLE），支持止盈、止损（不填委托价为触发后市价成交），不支持OCO。
- ```exchange.GetMarkets()```不提供价格、数量精度与下单量限制（交易所接口不给），相应字段为0。

#### Bitget

```Bitget```（现货）：Bitget现货，支持统一账户（UTA，配置项「Version」选v3）与经典账户（选v2）。

```Futures_Bitget```（期货）：Bitget USDT、USDC永续合约，币本位永续与交割合约。支持统一账户（UTA，配置项「Version」选v3）与经典账户（选v2）。

##### 名称与配置

| ```exchange.GetName()``` | 类型 | 别名 |
| - | - | - |
| ```Bitget``` | 现货 | Bitget现货 |
| ```Futures_Bitget``` | 期货 | Bitget期货 |

| 配置项 | 必填 | 默认值 | 说明 |
| - | - | - | - |
| Access Key | 是 | — | — |
| Secret Key | 是 | — | — |
| Passphrase | 是 | — | — |
| Version | 是 | ```v3``` | 账户类型：v3为统一账户（UTA），v2为经典账户。可选：```v3```、```v2``` |
| 模拟盘 | 否 | 不勾选 | — |

##### 交易对与合约代码

###### ```Bitget```（现货）

交易对示例：```BTC_USDT```、```ETH_BTC```

交易对写作```BTC_USDT```，不带合约代码；合约请使用Futures_Bitget交易所对象。

###### ```Futures_Bitget```（期货）

交易对示例：```BTC_USDT```、```BTC_USDC```、```BTC_USD```

计价币决定合约类型：```BTC_USDT```、```BTC_USDC```为USDT、USDC结算的合约（USDC永续对应Bitget的```BTCPERP```），```BTC_USD```为币本位合约。模拟盘的币种名称都带```S```前缀，例如```SBTC_SUSDT```、```SBTC_SUSDC```、```SBTC_SUSD```。

| 合约代码 | 说明 |
| - | - |
| ```swap``` | 永续合约（默认）。 |
| ```quarter``` | 当季交割合约（币本位）。 |
| ```next_quarter``` | 次季交割合约（币本位）。 |

原生合约代码示例：```BTCUSDU26```、```ETHCMZ26```

交割合约也可以直接写Bitget的原生合约代码，例如```BTC_USD.BTCUSDU26```；统一账户（v3）的币本位交割合约代码形如```ETHCMZ26```。

##### 专属IO指令

###### ```Bitget```（现货）

| 指令 | 参数 | 说明 | 返回值 |
| - | - | - | - |
| ```simulate``` | bool | 模拟盘（true）/实盘（false）切换，模拟盘请求带```paptrading```请求头，接口地址不变。 | 设置后的值。 |

通用指令```api```、```base```、```currency```见`exchange.IO`。

###### ```Futures_Bitget```（期货）

| 指令 | 参数 | 说明 | 返回值 |
| - | - | - | - |
| ```simulate``` | bool | 模拟盘（true）/实盘（false）切换，模拟盘请求带```paptrading```请求头，接口地址不变。模拟盘交易对的币种名称带```S```前缀。 | 成功也返回空值。 |
| ```cross``` | bool[, symbol] | 全仓（true，crossed）/逐仓（false，isolated），向交易所发送切换请求。统一账户（v3）不能切换，固定全仓，调用报错。 | 成功也返回空值，需要确认时调用后读取GetLastError()。 |
| ```dual``` | bool[, symbol] | 双向（true，hedge_mode）/单向（false，one_way_mode）持仓，向交易所发送切换请求。经典账户（v2）按合约类型（USDT、USDC、币本位）分别设置，统一账户（v3）为账户级设置。 | 成功返回```true```。 |

通用指令```api```、```base```、```currency```见`exchange.IO`。

##### 函数支持差异

###### 全部交易所对象

没有不支持的标准函数。

###### ```Bitget```（现货）

以回退方式支持：

- `exchange.GetRecords`：原生周期为1分钟、3分钟、5分钟、15分钟、30分钟、1小时、4小时、6小时、12小时、1天、3天、1周、1月；其它周期由托管者合成。3分钟只在统一账户（v3）可用。

###### ```Futures_Bitget```（期货）

以回退方式支持：

- `exchange.GetRecords`：原生周期为1分钟、3分钟、5分钟、15分钟、30分钟、1小时、4小时、6小时、12小时、1天、3天、1周、1月；其它周期由托管者合成。统一账户（v3）的币本位交割合约没有3天周期。

##### 保证金、账户与模拟盘

###### 全部交易所对象

账户：配置项「Version」决定账户类型：v3为统一账户（私有接口使用```/api/v3```），v2为经典账户（使用```/api/v2```）。统一账户调用经典账户接口会被交易所拒绝（40085），请按账户实际类型选择。

###### ```Bitget```（现货）

模拟盘：添加交易所时勾选「模拟盘」使用Bitget模拟盘，需要使用模拟盘的API KEY；```exchange.IO("simulate", true)```仍可在运行中切换，用于兼容旧策略。

###### ```Futures_Bitget```（期货）

保证金模式：经典账户（v2）用```exchange.IO("cross", bool)```按合约切换全仓/逐仓；统一账户（v3）固定全仓。```exchange.SetMarginLevel()```设置杠杆。

持仓模式：下单时按账户实际的持仓模式带开平参数，用```exchange.IO("dual", bool)```切换。

模拟盘：添加交易所时勾选「模拟盘」（或用```exchange.IO("simulate", true)```在运行中切换，用于兼容旧策略）使用Bitget模拟盘，需要使用模拟盘的API KEY，交易对写作```SBTC_SUSDT```等。统一账户（v3）的接口不支持模拟盘品种，模拟盘请选择v2。

##### 注意事项

###### ```Bitget```（现货）

- 统一账户（v3）没有现货条件单接口，条件单相关函数（```exchange.CreateConditionOrder()```、```exchange.GetConditionOrders()```等）报错并返回空值；经典账户（v2）支持止盈、止损条件单（不支持OCO）和```exchange.ModifyConditionOrder()```。
- ```exchange.ModifyOrder()```：统一账户原地改单；经典账户使用撤单再下单接口（```cancel-replace-order```），返回新订单的ID。

###### ```Futures_Bitget```（期货）

- ```exchange.GetFundings()```不支持批量查询，需要传入具体的永续合约，例如```exchange.GetFundings("ETH_USDT.swap")```。
- 条件单只支持止盈、止损单，不支持OCO，需要时分别创建止盈单和止损单。
- 经典账户（v2）的```exchange.ModifyOrder()```由交易所撤旧单下新单，订单ID会变，返回新订单的ID；统一账户（v3）原地改单。

#### Bithumb

韩国交易所的现货交易。

##### 名称与配置

```exchange.GetName()```：```Bithumb```（现货）。

| 配置项 | 必填 |
| - | - |
| Access Key | 是 |
| Secret Key | 是 |

##### 交易对与合约代码

交易对示例：```BTC_KRW```、```ETH_KRW```

交易对写作```BASE_QUOTE```，Bithumb原生市场代码是计价币在前（```BTC_KRW```对应```KRW-BTC```），由连接器转换。

##### 函数支持差异

不支持（调用时报错并返回空值）：`exchange.ModifyOrder`、`exchange.CreateConditionOrder`、`exchange.ModifyConditionOrder`、`exchange.CancelConditionOrder`、`exchange.GetConditionOrder`、`exchange.GetConditionOrders`、`exchange.GetHistoryConditionOrders`。

以回退方式支持：

- `exchange.GetRecords`：原生周期为1分钟、3分钟、5分钟、10分钟、15分钟、30分钟、1小时、4小时、1天、1周、1月；其它周期由托管者合成。

##### 注意事项

- 只支持GTC限价单与市价单：指定```tif```为```ioc```、```fok```或```postOnly```时报错。
- ```exchange.GetMarkets()```中KRW市场的价格精度按最新价所在的价格档位计算（Bithumb的KRW报价单位随价格分段），其它市场不提供价格、数量精度。

#### Bitstamp

现货交易。

##### 名称与配置

```exchange.GetName()```：```Bitstamp```（现货）。

| 配置项 | 必填 | 说明 |
| - | - | - |
| Access Key | 是 | — |
| Secret Key | 是 | — |
| Client ID | 是 | Bitstamp账户的客户号（Customer ID），参与私有接口签名。 |

##### 交易对与合约代码

交易对示例：```BTC_USD```、```ETH_EUR```、```BTC_USDT```

交易对写作```BASE_QUOTE```，对应Bitstamp原生代码```btcusd```。

##### 函数支持差异

不支持（调用时报错并返回空值）：`exchange.GetHistoryOrders`、`exchange.ModifyOrder`、`exchange.CreateConditionOrder`、`exchange.ModifyConditionOrder`、`exchange.CancelConditionOrder`、`exchange.GetConditionOrder`、`exchange.GetConditionOrders`、`exchange.GetHistoryConditionOrders`。

以回退方式支持：

- `exchange.GetRecords`：原生周期为1分钟、3分钟、5分钟、15分钟、30分钟、1小时、2小时、4小时、6小时、12小时、1天、3天；其它周期由托管者合成。

##### 注意事项

- 现货市价买单的下单量是交易币数，不是计价币金额（使用Bitstamp的市价单接口）。
- 交易所没有历史订单接口，不支持```exchange.GetHistoryOrders()```；```exchange.GetOrder()```可以查询已完成的订单。

#### Bybit

```Bybit```（现货）：Bybit现货，以及现货杠杆（下单时借贷）。统一交易账户（UTA）与经典账户都支持，使用Bybit V5接口。

```Futures_Bybit```（期货）：Bybit USDT、USDC永续与交割合约（linear），币本位永续与交割合约（inverse），以及USDT结算期权。统一交易账户（UTA）与经典账户都支持，使用Bybit V5接口。

##### 名称与配置

| ```exchange.GetName()``` | 类型 | 别名 |
| - | - | - |
| ```Bybit``` | 现货 | Bybit现货 |
| ```Futures_Bybit``` | 期货 | Bybit期货 |

| 配置项 | 必填 | 默认值 | 说明 |
| - | - | - | - |
| Access Key | 是 | — | — |
| Secret Key | 是 | — | — |
| Version | 是 | ```v5``` | 兼容保留，连接器始终使用Bybit V5接口，选择哪个版本都不影响。可选：```v3```、```v5``` |
| 模拟盘 | 否 | 不勾选 | — |

##### 交易对与合约代码

###### ```Bybit```（现货）

交易对示例：```BTC_USDT```、```ETH_BTC```

交易对写作```BTC_USDT```，不带合约代码；合约请使用Futures_Bybit交易所对象。

###### ```Futures_Bybit```（期货）

交易对示例：```BTC_USDT```、```BTC_USDC```、```BTC_USD```

计价币决定合约类型：```BTC_USDT```、```BTC_USDC```为U本位（linear）合约，```BTC_USD```为币本位（inverse）合约。USDC永续对应Bybit的```BTCPERP```。

| 合约代码 | 说明 |
| - | - |
| ```swap``` | 永续合约（默认）。 |
| ```delivery``` | 最近到期的交割合约。 |
| ```this_week``` | 当周交割合约。 |
| ```next_week``` | 次周交割合约。 |
| ```third_week``` | 第三周交割合约。 |
| ```month``` | 月度交割合约。 |
| ```next_month``` | 次月交割合约。 |
| ```quarter``` | 季度交割合约。 |
| ```next_quarter``` | 次季度交割合约。 |
| ```third_quarter``` | 第三季度交割合约。 |

交割合约按Bybit合约列表中实际挂牌的到期时间选取：周档依次对应未来三个七天窗口内到期的合约，月档取月末到期的合约，季档取3、6、9、12月月末到期的合约。交易所没有挂牌对应档位时报错。

原生合约代码示例：```BTCUSDU26```、```ETHUSDT-04APR25```

交割合约也可以直接写Bybit的原生合约代码。Bybit有些交割合约没有明确的周期，这类合约直接使用原生代码，例如交易对```ETH_USDT```、合约代码```ETHUSDT-04APR25```。

##### 专属IO指令

###### ```Bybit```（现货）

| 指令 | 参数 | 说明 | 返回值 |
| - | - | - | - |
| ```trade_margin``` | — | 现货杠杆：之后的订单带```isLeverage=1```，下单时自动借贷。只保存在本地，不发请求。 | 指令名本身。 |
| ```trade_normal``` | — | 切换回普通现货（默认）。 | 指令名本身。 |
| ```accountType``` | string | 指定账户类型：```UNIFIED```（统一交易账户）或```SPOT```（经典账户的现货钱包）。不调用时首次私有请求自动探测。 | 设置后的账户类型。 |

通用指令```api```、```base```、```currency```见`exchange.IO`。

###### ```Futures_Bybit```（期货）

| 指令 | 参数 | 说明 | 返回值 |
| - | - | - | - |
| ```cross``` | bool[, symbol] | 全仓（true）/逐仓（false），向交易所发送切换请求；切逐仓时同时设置买卖杠杆（沿用最近一次```exchange.SetMarginLevel()```的值，没有设置过为10倍）。期权不支持。 | 成功也返回空值，需要确认时调用后读取GetLastError()。 |
| ```dual``` | bool[, symbol] | 双向（true）/单向（false）持仓，向交易所发送切换请求。期权不支持。 | 成功也返回空值，需要确认时调用后读取GetLastError()。 |
| ```accountType``` | string | 指定账户类型：```UNIFIED```（统一交易账户）、```CONTRACT```（经典账户的合约钱包），```auto```恢复自动探测（默认）。 | 设置后的账户类型（自动探测时为```auto```）。 |

通用指令```api```、```base```、```currency```见`exchange.IO`。

##### 函数支持差异

###### 全部交易所对象

没有不支持的标准函数。

###### ```Bybit```（现货）

以回退方式支持：

- `exchange.GetRecords`：原生周期为1分钟、3分钟、5分钟、15分钟、30分钟、1小时、2小时、4小时、6小时、12小时、1天、1周、1月；其它周期由托管者合成。

###### ```Futures_Bybit```（期货）

以回退方式支持：

- `exchange.GetRecords`：原生周期为1分钟、3分钟、5分钟、15分钟、30分钟、1小时、2小时、4小时、6小时、12小时、1天、1周、1月；其它周期由托管者合成。期权没有K线接口，由托管者用成交记录合成。

##### 保证金、账户与模拟盘

###### 全部交易所对象

模拟盘：勾选「模拟盘」使用Bybit模拟交易（Demo Trading，```api-demo.bybit.com```），API KEY需要在Bybit主站切换到模拟交易模式后创建；与测试网（testnet）不是同一个环境。

###### ```Bybit```（现货）

账户：统一交易账户与经典账户的现货资产在不同的钱包，连接器首次私有请求时查询账户类型（也可以用```exchange.IO("accountType", ...)```指定）。现货杠杆用```exchange.IO("trade_margin")```开启，之后的订单在下单时借贷。

###### ```Futures_Bybit```（期货）

保证金模式：用```exchange.IO("cross", bool)```按合约切换全仓/逐仓；```exchange.SetMarginLevel()```设置杠杆（买卖同一杠杆）。

持仓模式：下单前自动查询该合约的持仓模式，双向持仓时自动带```positionIdx```；也可以在下单附加参数中显式传```positionIdx```，或用```exchange.IO("dual", bool)```切换。

账户：账户类型在首次私有请求时自动探测。统一交易账户1.0的U本位资产在统一钱包、币本位资产在合约钱包，```exchange.GetAssets()```会同时查询两个钱包。

##### 期权

###### ```Futures_Bybit```（期货）

支持Bybit的USDT结算期权（Bybit目前只挂牌USDT结算的期权）。

- ```exchange.GetMarkets()```的结果包含期权合约。
- 不支持条件单，不支持```exchange.SetMarginLevel()```，不能用```cross```、```dual```切换保证金模式与持仓模式。

期权代码示例：```ETH-25JUN27-2800-C-USDT```

期权代码为Bybit原生代码：标的-到期日-行权价-C/P-结算币。Bybit期权以USDT结算，交易对设置为```ETH_USDT```，完整品种代码形如```ETH_USDT.ETH-25JUN27-2800-C-USDT```；交易对的计价币必须与结算币一致。

##### 注意事项

###### 全部交易所对象

- 条件单只支持止盈、止损单，不支持OCO，需要时分别创建止盈单和止损单。

###### ```Futures_Bybit```（期货）

- ```exchange.GetMarkets()```的结果包含盘前交易（PreLaunch）合约。

#### Coincheck

日本交易所的现货交易。

##### 名称与配置

```exchange.GetName()```：```Coincheck```（现货）。

| 配置项 | 必填 |
| - | - |
| Access Key | 是 |
| Secret Key | 是 |

##### 交易对与合约代码

交易对示例：```BTC_JPY```、```ETH_JPY```

交易对写作```BASE_QUOTE```，对应Coincheck原生代码```btc_jpy```；可交易的交易对以交易所为准。

##### 函数支持差异

不支持（调用时报错并返回空值）：`exchange.GetTickers`、`exchange.GetMarkets`、`exchange.GetHistoryOrders`、`exchange.ModifyOrder`、`exchange.ModifyConditionOrder`、`exchange.GetHistoryConditionOrders`。

以回退方式支持：

- `exchange.GetRecords`：交易所没有K线接口，由托管者用成交记录合成：首次调用只有最近成交覆盖的少量K线，随调用逐步累积。
- `exchange.GetOrder`：交易所没有查询单个订单的接口，在当前未完成订单中查找；交易所不提供历史订单查询，已成交或已撤销的订单查不到（返回空值）。

##### 注意事项

- 下单支持只做Maker（```postOnly```，仅限价单），不支持```tif```（IOC、FOK）选项，传入时报错。
- 条件单通过Coincheck下单接口的```stop_loss_rate```（触发价）实现，支持止盈、止损（不填委托价为触发后市价成交），不支持OCO；撤销条件单与撤销普通订单使用同一接口。
- ```exchange.GetConditionOrders()```不传```symbol```参数时，无法按现价区分条件单是止盈还是止损，返回的条件单类型为通用类型。

#### Coinone

韩国交易所的现货交易，KRW市场。

##### 名称与配置

```exchange.GetName()```：```Coinone```（现货）。

| 配置项 | 必填 |
| - | - |
| Access Key | 是 |
| Secret Key | 是 |

##### 交易对与合约代码

交易对示例：```BTC_KRW```、```ETH_KRW```

交易对写作```BASE_QUOTE```，计价币为KRW。

##### 函数支持差异

不支持（调用时报错并返回空值）：`exchange.ModifyOrder`、`exchange.ModifyConditionOrder`、`exchange.GetHistoryConditionOrders`。

以回退方式支持：

- `exchange.GetRecords`：原生周期为1分钟、3分钟、5分钟、10分钟、15分钟、30分钟、1小时、2小时、4小时、6小时、1天、1周、1月；其它周期由托管者合成。

##### 注意事项

- ```exchange.GetTickers()```返回KRW市场全部交易对的行情。
- 下单支持只做Maker（```postOnly```，仅限价单），不支持```tif```（IOC、FOK）选项，传入时报错。
- 条件单使用Coinone的```STOP_LIMIT```订单，支持止盈、止损，必须填写触发后的委托价（不支持触发后市价成交），不支持OCO；撤销条件单与撤销普通订单使用同一接口。
- ```exchange.GetOrders()```返回的未完成订单包含未触发的条件单（```STOP_LIMIT```）。
- 交易所的已完成订单不带订单类型，无法查询历史条件单。

#### CoinW

```Coinw```（现货）：CoinW现货交易。

```Futures_Coinw```（期货）：CoinW U本位永续合约（USDT、USDC保证金）。

##### 名称与配置

| ```exchange.GetName()``` | 类型 | 别名 |
| - | - | - |
| ```Coinw``` | 现货 | 币赢 |
| ```Futures_Coinw``` | 期货 | CoinW期货 |

| 配置项 | 必填 |
| - | - |
| Access Key | 是 |
| Secret Key | 是 |

##### 交易对与合约代码

###### ```Coinw```（现货）

交易对示例：```BTC_USDT```、```ETH_USDT```

交易对写作```BTC_USDT```，与CoinW现货的原生代码相同（大写）。本交易所对象只交易现货，带合约后缀的品种会报错，永续合约请使用```Futures_Coinw```。

###### ```Futures_Coinw```（期货）

交易对示例：```BTC_USDT```、```BTC_USDC```

计价币决定保证金币种：```BTC_USDT```为USDT本位，```BTC_USDC```为USDC本位，其它计价币会报错。原生合约名为```BTCUSDT```、```BTCUSDC```。

| 合约代码 | 说明 |
| - | - |
| ```swap``` | 永续合约。 |

CoinW只有永续合约，其它合约代码会报错。下单数量单位为张，每张对应的币数为```exchange.GetMarkets()```中的```CtVal```。

##### 专属IO指令

###### ```Coinw```（现货）

没有专属指令，通用指令见`exchange.IO`。

###### ```Futures_Coinw```（期货）

| 指令 | 参数 | 说明 |
| - | - | - |
| ```cross``` | bool | 全仓（true）/逐仓（false），账户级设置，向交易所发出设置请求；有未平仓的持仓时交易所会拒绝并报错（错误码9042）。 |

通用指令```api```、```base```、```currency```见`exchange.IO`。

##### 函数支持差异

###### ```Coinw```（现货）

不支持（调用时报错并返回空值）：`exchange.ModifyOrder`、`exchange.CreateConditionOrder`、`exchange.ModifyConditionOrder`、`exchange.CancelConditionOrder`、`exchange.GetConditionOrder`、`exchange.GetConditionOrders`、`exchange.GetHistoryConditionOrders`。

以回退方式支持：

- `exchange.GetRecords`：原生周期为1分钟、3分钟、5分钟、15分钟、30分钟、1小时、2小时、4小时、1天、1周；其它周期由托管者合成。

###### ```Futures_Coinw```（期货）

不支持（调用时报错并返回空值）：`exchange.ModifyOrder`、`exchange.ModifyConditionOrder`。

以回退方式支持：

- `exchange.GetRecords`：原生周期为1分钟、3分钟、5分钟、15分钟、30分钟、1小时、4小时、1天、1周、1月；其它周期由托管者合成。单次最多返回300根。

##### 保证金、账户与模拟盘

###### ```Futures_Coinw```（期货）

保证金模式：用```exchange.IO("cross", bool)```切换账户的全仓/逐仓；没有切换过时，每次下单前查询账户当前模式并随单带上。CoinW没有设置杠杆的接口：```exchange.SetMarginLevel()```只记录杠杆倍数（必须是不小于1的整数），之后按合约随每张订单发送，没有设置过时按10倍下单；也可以在下单附加参数中传```leverage```指定单张订单的杠杆。

持仓模式：只有单向持仓，不支持```exchange.IO("dual", ...)```。平仓（```closebuy```、```closesell```）通过平掉对应方向的已有持仓实现，没有该方向的持仓时报错。

##### 注意事项

###### ```Coinw```（现货）

- 查询未完成订单的接口必须带交易对：```exchange.GetOrders()```不传参数时只查询当前交易对的未完成订单，不是所有交易对。

###### ```Futures_Coinw```（期货）

- 条件单只支持止盈、止损单，不支持OCO；不支持改单和修改条件单，需要先撤单再重新下单。
- 查询未完成订单和未完成条件单的接口必须带交易对：```exchange.GetOrders()```、```exchange.GetConditionOrders()```不传参数时只查询当前合约，不是所有合约。
- ```exchange.GetHistoryOrders()```、```exchange.GetHistoryConditionOrders()```不支持```since```参数（交易所的历史订单接口没有时间范围参数），传入时报错，只能查询最近的订单。

#### Crypto.com

```Crypto```（现货）：Crypto.com Exchange现货交易，支持现货杠杆下单。

```Futures_Crypto```（期货）：Crypto.com Exchange衍生品：永续合约与交割合约。账户中的代币可以折算为USD计价的额度，用作合约保证金。

##### 名称与配置

| ```exchange.GetName()``` | 类型 | 别名 |
| - | - | - |
| ```Crypto``` | 现货 | — |
| ```Futures_Crypto``` | 期货 | Crypto.com期货、Crypto.com Futures |

| 配置项 | 必填 |
| - | - |
| Access Key | 是 |
| Secret Key | 是 |

##### 交易对与合约代码

###### ```Crypto```（现货）

交易对示例：```BTC_USDT```、```CRO_USD```

交易对写作```BASE_QUOTE```，与Crypto.com的交易对名称一致。

###### ```Futures_Crypto```（期货）

交易对示例：```BTC_USD```、```ETH_USD```

交易对如```BTC_USD```，对应Crypto.com的```BTCUSD-PERP```（永续）、```BTCUSD-YYMMDD```（交割）。

| 合约代码 | 说明 |
| - | - |
| ```swap``` | 永续合约。 |
| ```January``` | 一月到期的交割合约。 |
| ```February``` | 二月到期的交割合约。 |
| ```March``` | 三月到期的交割合约。 |
| ```April``` | 四月到期的交割合约。 |
| ```May``` | 五月到期的交割合约。 |
| ```June``` | 六月到期的交割合约。 |
| ```July``` | 七月到期的交割合约。 |
| ```August``` | 八月到期的交割合约。 |
| ```September``` | 九月到期的交割合约。 |
| ```October``` | 十月到期的交割合约。 |
| ```November``` | 十一月到期的交割合约。 |
| ```December``` | 十二月到期的交割合约。 |

不可用的通用合约代码：```this_week```、```next_week```、```quarter```、```next_quarter```。

交割合约以到期月份的英文名为合约代码，例如交易对```BTC_USD```、合约代码```October```，指最近一个该月份里到期最晚的交割合约（月度合约）。同月如果还有其它交割合约（例如周度合约），它们以原生合约代码为合约代码，例如```BTC_USD.BTCUSD-261009```。`exchange.GetMarkets`中的交割合约也按这一规则命名，每张合约只出现一次，```exchange.SetContractType()```按它校验，因此```this_week```、```next_week```、```quarter```、```next_quarter```不能用作合约代码。

原生合约代码示例：```BTCUSD-261030```

也可以直接使用Crypto.com的交割合约代码，形如```BTCUSD-YYMMDD```。

##### 专属IO指令

###### ```Crypto```（现货）

| 指令 | 说明 | 返回值 |
| - | - | - |
| ```trade_margin``` | 切换为现货杠杆：之后的订单（含条件单）带```spot_margin=MARGIN```下单。只影响下单，不向交易所发请求。 | 指令名本身。 |
| ```trade_normal``` | 切换回普通现货下单（默认）。 | 指令名本身。 |

通用指令```api```、```base```、```currency```见`exchange.IO`。

###### ```Futures_Crypto```（期货）

| 指令 | 参数 | 说明 | 返回值 |
| - | - | - | - |
| ```accountId``` | string | 设置交易账户ID（账户uuid），用于查询持仓和设置杠杆；不设置时自动使用主账户。 | 形如```{"accountId": "..."}```的对象。 |

通用指令```api```、```base```、```currency```见`exchange.IO`。

##### 函数支持差异

没有不支持的标准函数。

以回退方式支持：

- `exchange.GetRecords`：原生周期为1分钟、5分钟、15分钟、30分钟、1小时、2小时、4小时、6小时、12小时、1天、1周、14天、1月；其它周期由托管者合成。

##### 保证金、账户与模拟盘

###### ```Futures_Crypto```（期货）

账户：```exchange.SetMarginLevel()```设置的是整个交易账户的杠杆（Crypto.com的账户级杠杆），必须是1到100的整数。

##### 注意事项

###### 全部交易所对象

- 条件单只支持止盈、止损单，不支持OCO。

###### ```Crypto```（现货）

- 普通市价买单的下单量是交易币数（Crypto.com的```quantity```），不是计价币金额；触发后为市价的条件买单则以计价币金额（```notional```）下单。

###### ```Futures_Crypto```（期货）

- `exchange.GetFundings`不支持批量查询，不传参数或传入范围（如```USD.swap```）时报错并返回空值，需要传入具体的永续合约品种代码，例如```BTC_USD.swap```。

#### DeepCoin

```DeepCoin```（现货）：DeepCoin现货交易。API KEY需要同时配置Access Key、Secret Key和Passphrase。

```Futures_DeepCoin```（期货）：DeepCoin U本位（USDT保证金）与币本位永续合约。API KEY需要同时配置Access Key、Secret Key和Passphrase。

##### 名称与配置

| ```exchange.GetName()``` | 类型 | 别名 |
| - | - | - |
| ```DeepCoin``` | 现货 | Deepcoin |
| ```Futures_DeepCoin``` | 期货 | DeepCoin期货 |

| 配置项 | 必填 |
| - | - |
| Access Key | 是 |
| Secret Key | 是 |
| Passphrase | 是 |

##### 交易对与合约代码

###### ```DeepCoin```（现货）

交易对示例：```BTC_USDT```、```ETH_USDT```

交易对写作```BTC_USDT```，对应DeepCoin的原生代码```BTC-USDT```。本交易所对象只交易现货，永续合约请使用```Futures_DeepCoin```。

###### ```Futures_DeepCoin```（期货）

交易对示例：```BTC_USDT```、```BTC_USD```

计价币决定合约类型：```BTC_USDT```为USDT本位合约（原生代码```BTC-USDT-SWAP```），```BTC_USD```为币本位合约（原生代码```BTC-USD-SWAP```）。

| 合约代码 | 说明 |
| - | - |
| ```swap``` | 永续合约。U本位、币本位都有。 |

DeepCoin只有永续合约，其它合约代码会报错。下单数量单位为张，每张对应的数量为```exchange.GetMarkets()```中的```CtVal```（单位见```CtValCcy```）。

##### 专属IO指令

###### ```DeepCoin```（现货）

没有专属指令，通用指令见`exchange.IO`。

###### ```Futures_DeepCoin```（期货）

| 指令 | 参数 | 说明 |
| - | - | - |
| ```cross``` | bool | 全仓（true）/逐仓（false），只修改本地设置，不发请求，之后的下单、条件单和```exchange.SetMarginLevel()```随请求带上；默认全仓。 |
| ```merge``` | bool | 合并持仓（true）/拆分持仓（false），只修改本地设置，不发请求，之后的下单、条件单和```exchange.SetMarginLevel()```随请求带上；默认合并持仓。 |

通用指令```api```、```base```、```currency```见`exchange.IO`。

##### 函数支持差异

###### 全部交易所对象

以回退方式支持：

- `exchange.GetRecords`：原生周期为1分钟、3分钟、5分钟、15分钟、30分钟、1小时、2小时、4小时、6小时、12小时、1天、1周、1月、1年；其它周期由托管者合成。

###### ```DeepCoin```（现货）

不支持（调用时报错并返回空值）：`exchange.ModifyOrder`。

###### ```Futures_DeepCoin```（期货）

没有不支持的标准函数。

##### 保证金、账户与模拟盘

###### ```Futures_DeepCoin```（期货）

保证金模式：用```exchange.IO("cross", bool)```选择全仓/逐仓，这是本地设置，随每次下单带上（默认全仓）；连接器没有读取账户实际保证金模式的途径。```exchange.SetMarginLevel()```按合约设置杠杆，同时带上当前的全仓/逐仓与合并/拆分持仓设置，交易所回执与请求不符时报错。

持仓模式：用```exchange.IO("merge", bool)```选择合并持仓/拆分持仓（默认合并）。下单时按方向带上持仓方向（开多、平空为long，开空、平多为short），拆分持仓模式需要它区分多空仓位。

##### 注意事项

###### 全部交易所对象

- ```exchange.GetHistoryOrders()```、```exchange.GetHistoryConditionOrders()```不支持```since```参数（交易所的历史订单接口没有时间范围参数），传入时报错，只能查询最近的订单。

###### ```DeepCoin```（现货）

- 不支持改单（```exchange.ModifyOrder()```），需要先撤单再重新下单；未触发的条件单可以用```exchange.ModifyConditionOrder()```修改。
- 条件单只支持止盈、止损单，不支持OCO（需要分成止盈、止损两张条件单下单）。
- ```exchange.GetOrders()```、```exchange.GetConditionOrders()```只能按交易对查询：不传或传空字符串时查询当前交易对。

###### ```Futures_DeepCoin```（期货）

- 条件单只支持止盈、止损单，不支持OCO（需要分成止盈、止损两张条件单下单）；未触发的条件单可以用```exchange.ModifyConditionOrder()```修改。
- 查询未完成条件单的接口必须带交易对：```exchange.GetConditionOrders()```不传参数时只查询当前合约，不能传范围（如```USDT.swap```）；单次最多返回100条。
- 交易币本位合约需要账户已在DeepCoin开通币本位合约账户，否则下单会被交易所拒绝。

#### Deribit

币本位（反向）永续与交割合约、USDC线性永续与交割合约、差价组合合约（future_combo），以及期权与组合期权。

##### 名称与配置

```exchange.GetName()```：```Futures_Deribit```（期货）。

| 配置项 | 必填 |
| - | - |
| Access Key | 是 |
| Secret Key | 是 |

##### 交易对与合约代码

交易对示例：```BTC_USD```、```ETH_USD```、```BTC_USDC```、```XRP_USDC```

计价币决定合约类型：```BTC_USD```、```ETH_USD```为币本位（反向）合约，原生代码形如```BTC-PERPETUAL```；```BTC_USDC```、```XRP_USDC```等为USDC线性合约，原生代码形如```BTC_USDC-PERPETUAL```（Deribit的线性合约代码本身带下划线）。

| 合约代码 | 说明 |
| - | - |
| ```swap``` | 永续合约。 |
| ```today``` | 按日到期的交割合约中最近到期的一张（Deribit的日合约）。 |
| ```tomorrow``` | 按日到期的交割合约中第二近的一张。 |
| ```this_week``` | 周合约中最近到期的一张。 |
| ```next_week``` | 周合约中第二近的一张。 |
| ```month``` | 月度合约（含季月）中最近到期的一张。 |
| ```quarter``` | 3、6、9、12月到期的月度合约中最近的一张，但跳过```month```已指向的那张。 |
| ```next_quarter``` | 同上季月序列中的第二张。 |
| ```third_quarter``` | 同上季月序列中的第三张。 |
| ```fourth_quarter``` | 同上季月序列中的第四张。 |

交割合约代码不在本地按日期推算，而是按Deribit合约列表的到期周期（日、周、月）和到期时间排序选取（列表缓存10分钟）；该周期没有挂出对应序号的合约时报错。

差价组合合约（future_combo）写成```"远期代码,近期代码"```，两个代码以英文逗号分隔，例如```"quarter,swap"```、```"next_week,swap"```、```"next_quarter,this_week"```、```"month,next_week"```；远期一腿必须是交割代码，近期一腿可以是交割代码或```swap```，对应Deribit的```BTC-FS-25DEC26_PERP```一类组合合约。组合合约只用于币本位交易对（```BTC_USD```、```ETH_USD```），在USDC等线性交易对上写组合代码会报错。

原生合约代码示例：```BTC-30JUL26```、```BTC_USDC-30JUL26```、```BTC-FS-25DEC26_PERP```

任何交割或组合合约都可以直接写Deribit的原生代码（日期为日月年缩写），超出上述代码范围的远期合约就用这种写法，例如交易对```BTC_USD```、合约代码```BTC-30JUL26```。查询结果中映射不回上述代码的合约也以原生代码返回。

##### 函数支持差异

不支持（调用时报错并返回空值）：`exchange.SetMarginLevel`。

以回退方式支持：

- `exchange.GetRecords`：原生周期为1分钟、3分钟、5分钟、10分钟、15分钟、30分钟、1小时、2小时、3小时、6小时、12小时、1天；其它周期由托管者合成。

##### 保证金、账户与模拟盘

保证金模式：Deribit按币种的保证金账户统一计算保证金，没有逐合约的保证金模式和杠杆设置：```exchange.SetMarginLevel()```不支持，```exchange.IO("cross", ...)```报错。```exchange.GetPositions()```的```MarginLevel```取Deribit持仓返回的杠杆，期权持仓为0；```Margin```为初始保证金与维持保证金之和。

持仓模式：每个合约只有一个净持仓（单向持仓），```exchange.IO("dual", ...)```报错。

账户：```exchange.GetAssets()```按币种（BTC、ETH、USDC、USDT等）分别返回余额，各币种以自身计价，不折算汇总。

模拟盘：配置里没有模拟盘选项。使用Deribit测试网时，填入测试网的API Key，并在策略开始时调用```exchange.IO("base", "https://test.deribit.com")```切换接口地址。

##### 期权

设置期权合约后即可获取行情、下单、撤单、查询持仓，BTC、ETH期权的下单量单位是币数。

- ```exchange.GetMarkets()```不传参数时列出全部期权与组合期权；传入期权品种时只查期权。
- ```exchange.GetTickers()```只返回期货（永续、交割），不含期权和组合合约，期权行情用```exchange.GetTicker()```逐个获取。
- 期权不支持```exchange.GetFundings()```。
- 查询范围```USD.option```为BTC、ETH期权，```USDC.option```为USDC结算期权，均包含组合期权。

期权代码示例：```BTC-25DEC26-100000-C```、```SOL_USDC-25DEC26-148-C```、```XRP_USDC-27NOV26-2d3-P```、```BTC_USDC-CS-11OCT26-82500_83000```

期权代码为Deribit原生代码：标的-到期日（日月年缩写）-行权价-C/P，C为看涨、P为看跌，行权价的小数点写作```d```（如```2d3```即2.3）。BTC、ETH期权以币结算，交易对设置为```BTC_USD```、```ETH_USD```，完整品种代码形如```BTC_USD.BTC-25DEC26-100000-C```；USDC结算的期权代码自带```_USDC```，交易对设置为对应的```_USDC```交易对，例如```SOL_USDC.SOL_USDC-25DEC26-148-C```。组合期权（如```BTC-CS-6SEP24-57000_57500```、```BTC-PCAL-20SEP24_13SEP24-55000```）同样直接写原生代码。

##### 注意事项

- 下单量单位：币本位（反向）合约是USD金额（```BTC-PERPETUAL```最小10且为10的倍数），USDC线性合约与期权是币数。```exchange.GetMarkets()```的```CtVal```恒为1，最小下单量与精度以```MinQty```、```AmountPrecision```为准。
- ```exchange.GetFundings()```传具体永续合约品种（如```BTC_USD.swap```）返回该合约当前一条；不传参数时按当前合约的计价币查询该计价币的全部永续（如```USD.swap```为BTC、ETH币本位永续，```USDC.swap```为全部USDC线性永续），也可直接传这类范围。费率取Deribit按8小时折算的```current_interest```。Deribit没有批量资金费率接口，范围查询每个永续发一次请求，```USDC.swap```有一百多个永续、耗时十几秒，频繁调用请传具体品种。交割合约、期权与组合合约没有资金费率，传入会报错。
- 条件单只支持止盈、止损单，不支持OCO；支持```exchange.ModifyConditionOrder()```。触发价默认按最新成交价，可在附加参数中传```trigger```（```mark_price```、```index_price```）改用标记价格或指数价格。
- ```exchange.GetHistoryOrders()```、```exchange.GetHistoryConditionOrders()```按品种查询，不支持```since```参数（传了会报错），返回最近的记录。
- 范围查询```USD.swap```、```USD.futures```等的```USD```覆盖BTC、ETH币本位合约；差价组合合约的范围是```USD.futures_combo```。当前合约为组合合约时，不传参数默认```USD.futures_combo```（含以原生代码返回的远月组合）；```USD.futures```不含组合合约。

#### DigiFinex

```DigiFinex```（现货）：DigiFinex现货交易。

```Futures_DigiFinex```（期货）：DigiFinex U本位与币本位永续合约。

##### 名称与配置

| ```exchange.GetName()``` | 类型 | 别名 |
| - | - | - |
| ```DigiFinex``` | 现货 | — |
| ```Futures_DigiFinex``` | 期货 | DigiFinex期货 |

✓ 表示该交易所对象有这个配置项。

| 配置项 | ```DigiFinex``` | ```Futures_DigiFinex``` | 必填 | 默认值 |
| - | - | - | - | - |
| Access Key | ✓ | ✓ | 是 | — |
| Secret Key | ✓ | ✓ | 是 | — |
| 模拟盘 |  | ✓ | 否 | 不勾选 |

##### 交易对与合约代码

###### ```DigiFinex```（现货）

交易对示例：```BTC_USDT```、```ETH_USDT```

交易对写作```BTC_USDT```，对应DigiFinex的原生代码```btc_usdt```（小写）。本交易所对象只交易现货，带合约后缀的品种会报错，永续合约请使用```Futures_DigiFinex```。

###### ```Futures_DigiFinex```（期货）

交易对示例：```BTC_USDT```、```BTC_USD```

计价币决定合约类型：```BTC_USDT```为U本位合约（原生代码```BTCUSDTPERP```），```BTC_USD```为币本位反向合约（原生代码```BTCPERP```）。

| 合约代码 | 说明 |
| - | - |
| ```swap``` | 永续合约。U本位、币本位都有。 |

DigiFinex只有永续合约，其它合约代码会报错。下单数量单位为张，每张对应的数量为```exchange.GetMarkets()```中的```CtVal```（单位见```CtValCcy```）。

##### 专属IO指令

###### ```DigiFinex```（现货）

没有专属指令，通用指令见`exchange.IO`。

###### ```Futures_DigiFinex```（期货）

| 指令 | 参数 | 说明 | 返回值 |
| - | - | - | - |
| ```simulate``` | bool | 模拟盘（true）/实盘（false）切换，只修改本地设置。切换后行情列表（```exchange.GetTickers()```）、合约列表、账户余额和持仓查询带模拟盘参数（```type=1```），下单、撤单等其它接口不带。 | 成功返回空值。 |
| ```cross``` | bool[, symbol] | 全仓（true）/逐仓（false），按合约向交易所发出设置请求，不传symbol时作用于当前合约。 | 设置的值（切换为逐仓时返回```false```），交易所拒绝时返回空值。 |

通用指令```api```、```base```、```currency```见`exchange.IO`。

##### 函数支持差异

不支持（调用时报错并返回空值）：`exchange.ModifyOrder`、`exchange.CreateConditionOrder`、`exchange.ModifyConditionOrder`、`exchange.CancelConditionOrder`、`exchange.GetConditionOrder`、`exchange.GetConditionOrders`、`exchange.GetHistoryConditionOrders`。

以回退方式支持：

- `exchange.GetRecords`：原生周期为1分钟、5分钟、15分钟、30分钟、1小时、4小时、12小时、1天、1周；其它周期由托管者合成。

##### 保证金、账户与模拟盘

###### ```Futures_DigiFinex```（期货）

保证金模式：用```exchange.IO("cross", bool)```按合约切换全仓/逐仓，交易所回执与请求不符时报错。```exchange.SetMarginLevel()```按合约设置杠杆；逐仓且双向持仓的账户需要按方向设置，交易所提示持仓模式错误时，连接器补上保证金模式（默认逐仓，可在附加参数中传```margin_mode```）和方向（取```exchange.SetDirection()```设置的方向，或附加参数中的```side```：```long```/```short```）重试一次。

模拟盘：添加交易所时勾选「模拟盘」使用DigiFinex合约模拟盘；```exchange.IO("simulate", true)```仍可在运行中切换，用于兼容旧策略。模拟盘只影响行情列表、合约列表、账户余额和持仓查询（带```type=1```参数）。

##### 注意事项

###### ```DigiFinex```（现货）

DigiFinex现货没有模拟盘环境，配置里也没有模拟盘选项；模拟盘只有合约（```Futures_DigiFinex```）支持。

###### ```Futures_DigiFinex```（期货）

- 不支持批量查询资金费率：```exchange.GetFundings()```必须传入具体永续合约品种（例如```BTC_USDT.swap```），不传或传范围（如```USDT.swap```）时报错。

#### Gate

```GateIO```（现货）：Gate现货，以及杠杆账户（逐仓、全仓）和统一账户下的现货交易。

```Futures_GateIO```（期货）：Gate USDT本位永续与交割合约、币本位（BTC结算）永续合约，以及USDT期权。经典账户与统一账户都支持。

##### 名称与配置

| ```exchange.GetName()``` | 类型 | 别名 |
| - | - | - |
| ```GateIO``` | 现货 | Gate.io、Gate现货 |
| ```Futures_GateIO``` | 期货 | Gate期货 |

| 配置项 | 必填 | 默认值 |
| - | - | - |
| Access Key | 是 | — |
| Secret Key | 是 | — |
| 模拟盘 | 否 | 不勾选 |

##### 交易对与合约代码

###### ```GateIO```（现货）

交易对示例：```BTC_USDT```、```ETH_BTC```

交易对写作```BTC_USDT```，不带合约代码；合约请使用Futures_GateIO交易所对象。

###### ```Futures_GateIO```（期货）

交易对示例：```BTC_USDT```、```BTC_USD```

计价币决定合约类型：```BTC_USDT```为USDT本位合约，```BTC_USD```为币本位合约（Gate的BTC结算合约）。交割合约为USDT本位。

| 合约代码 | 说明 |
| - | - |
| ```swap``` | 永续合约（默认）。 |
| ```this_week``` | 当周交割合约（7天内到期）。 |
| ```next_week``` | 次周交割合约（7至14天内到期）。 |
| ```quarter``` | 季度交割合约（除上两张外最早一张季末到期的合约）。 |
| ```next_quarter``` | 次季度交割合约。 |

交割合约只在交易所实际挂牌的合约中按到期时间选取，没有挂牌对应档位时报错。

原生合约代码示例：```BTC_USDT_20260807```

交割合约也可以直接写Gate的原生合约名，例如```BTC_USDT.BTC_USDT_20260807```。

##### 专属IO指令

###### ```GateIO```（现货）

| 指令 | 参数 | 说明 | 返回值 |
| - | - | - | - |
| ```trade_margin``` | — | 切换为逐仓杠杆账户。只保存在本地，之后下单带```account=margin```。 | 指令名本身。 |
| ```trade_super_margin``` | — | 切换为全仓杠杆账户。只保存在本地，之后下单与查询带```account=cross_margin```。 | 指令名本身。 |
| ```trade_normal``` | — | 切换回普通现货账户（默认）。 | 指令名本身。 |
| ```unified``` | bool | 统一账户（true）/经典账户（false）。不调用时首次私有请求自动探测。统一账户下下单、查询都使用统一账户（```account=unified```），优先于杠杆账户设置。 | 成功也返回空值，需要确认时调用后读取GetLastError()。 |

通用指令```api```、```base```、```currency```见`exchange.IO`。

###### ```Futures_GateIO```（期货）

| 指令 | 参数 | 说明 | 返回值 |
| - | - | - | - |
| ```cross``` | bool[, symbol] | 全仓（true）/逐仓（false），向交易所发送请求。（详见表下） | 成功也返回空值，需要确认时调用后读取GetLastError()。 |
| ```dual``` | bool[, symbol] | 双向（true）/单向（false）持仓，向交易所发送请求。按结算币（USDT、BTC）分别设置，只适用于永续合约。 | 成功也返回空值，需要确认时调用后读取GetLastError()。 |
| ```unified``` | bool | 统一账户（true）/经典账户（false）。不调用时首次私有请求自动探测。 | 成功也返回空值，需要确认时调用后读取GetLastError()。 |

表中长说明的其余部分：

- ```cross```：Gate用杠杆值表示保证金模式，切换时杠杆重设为10倍（逐仓杠杆10倍；永续全仓杠杆上限10倍），需要其它杠杆时之后再调用```exchange.SetMarginLevel()```。期权不支持。

通用指令```api```、```base```、```currency```见`exchange.IO`。

##### 函数支持差异

###### ```GateIO```（现货）

不支持（调用时报错并返回空值）：`exchange.ModifyConditionOrder`。

以回退方式支持：

- `exchange.GetRecords`：原生周期为10秒、1分钟、5分钟、15分钟、30分钟、1小时、4小时、8小时、1天、1周、1月；其它周期由托管者合成。

###### ```Futures_GateIO```（期货）

没有不支持的标准函数。

以回退方式支持：

- `exchange.GetRecords`：原生周期为10秒、30秒、1分钟、5分钟、15分钟、30分钟、1小时、2小时、4小时、6小时、8小时、12小时、1天、1周、1月；其它周期由托管者合成。

##### 保证金、账户与模拟盘

###### 全部交易所对象

模拟盘：勾选「模拟盘」使用Gate测试网（```api-testnet.gateapi.io```），需要使用测试网的API KEY。

###### ```GateIO```（现货）

账户：默认为普通现货账户，用```exchange.IO("trade_margin")```、```exchange.IO("trade_super_margin")```切换到逐仓、全仓杠杆账户。账户是否为统一账户在首次私有请求时自动探测，也可以用```exchange.IO("unified", bool)```指定。

###### ```Futures_GateIO```（期货）

保证金模式：Gate用杠杆值表示保证金模式（杠杆为0即全仓）。```exchange.SetMarginLevel()```先查询该合约当前的模式再设置杠杆，不会改变全仓/逐仓：全仓永续调整的是全仓杠杆上限；交割合约全仓时杠杆固定为0。用```exchange.IO("cross", bool)```切换全仓/逐仓。

持仓模式：双向持仓按结算币设置、只适用于永续合约，用```exchange.IO("dual", bool)```切换。

账户：账户是否为统一账户在首次私有请求时自动探测，也可以用```exchange.IO("unified", bool)```指定。经典账户的永续、交割、期权分属不同钱包，USDT本位与币本位也分开：```exchange.GetAccount()```、```exchange.GetAssets()```只返回当前合约所在钱包的资产。

##### 期权

###### ```Futures_GateIO```（期货）

支持Gate的USDT期权，```exchange.GetMarkets()```的结果包含期权合约。账户没有开通期权时，查询订单、持仓会返回交易所的错误。期权不支持条件单、改单（```exchange.ModifyOrder()```）、```exchange.SetMarginLevel()```，也不能用```cross```切换保证金模式。

期权代码示例：```BTC_USDT-20261225-65000-C```

期权代码为Gate原生代码：标的-到期日（YYYYMMDD）-行权价-C/P，代码中的标的必须与交易对一致。交易对设置为```BTC_USDT```，完整品种代码形如```BTC_USDT.BTC_USDT-20261225-65000-C```。

##### 注意事项

###### ```GateIO```（现货）

- 市价单默认以```fok```（全部成交或撤销）提交，可以在下单附加参数中传```time_in_force```覆盖。
- 条件单只支持止盈、止损单，不支持OCO；不支持修改条件单，需要先撤销再重新创建。

###### ```Futures_GateIO```（期货）

- 条件单只支持止盈、止损单，不支持OCO。```exchange.ModifyConditionOrder()```只支持永续合约（原地修改），交割合约需要先撤销再重新创建。
- ```exchange.GetHistoryConditionOrders()```不支持```since```参数（交易所接口不能按时间过滤），传入时报错。

#### Gemini

现货交易。

##### 名称与配置

```exchange.GetName()```：```Gemini```（现货）。

| 配置项 | 必填 |
| - | - |
| Access Key | 是 |
| Secret Key | 是 |

##### 交易对与合约代码

交易对示例：```BTC_USD```、```ETH_BTC```、```BTC_USDT```

交易对写作```BASE_QUOTE```，对应Gemini原生代码```btcusd```。

##### 专属IO指令

| 指令 | 参数 | 说明 |
| - | - | - |
| ```subAccount``` | string | 设置子账户名称。只对主账户密钥（以```master-```开头的Access Key）生效，私有请求带上该子账户；未设置时使用```primary```。 |

通用指令```api```、```base```、```currency```见`exchange.IO`。

##### 函数支持差异

不支持（调用时报错并返回空值）：`exchange.GetTickers`、`exchange.ModifyOrder`、`exchange.CreateConditionOrder`、`exchange.ModifyConditionOrder`、`exchange.CancelConditionOrder`、`exchange.GetConditionOrder`、`exchange.GetConditionOrders`、`exchange.GetHistoryConditionOrders`。

以回退方式支持：

- `exchange.GetRecords`：原生周期为1分钟、5分钟、15分钟、30分钟、1小时、6小时、1天；其它周期由托管者合成。

##### 注意事项

- 不支持市价单，只能下限价单；支持IOC、FOK与只做Maker（```postOnly```）。
- ```exchange.GetHistoryOrders()```不支持```since```参数，传入时报错；单次最多返回500条。
- K线接口不分页，每个周期只能取到交易所返回的最近一批K线（1分钟K线约为最近一天）。

#### HashKey

现货交易（接口地址```https://api-pro.hashkey.com```）。

##### 名称与配置

```exchange.GetName()```：```HashKey```（现货）。

| 配置项 | 必填 |
| - | - |
| Access Key | 是 |
| Secret Key | 是 |

##### 交易对与合约代码

交易对示例：```BTC_USDT```、```ETH_USD```、```BTC_HKD```

交易对写作```BASE_QUOTE```，对应HashKey原生代码```BTCUSDT```；有HKD计价的交易对。

##### 函数支持差异

不支持（调用时报错并返回空值）：`exchange.ModifyOrder`、`exchange.CreateConditionOrder`、`exchange.ModifyConditionOrder`、`exchange.CancelConditionOrder`、`exchange.GetConditionOrder`、`exchange.GetConditionOrders`、`exchange.GetHistoryConditionOrders`。

以回退方式支持：

- `exchange.GetRecords`：原生周期为1分钟、3分钟、5分钟、15分钟、30分钟、1小时、2小时、4小时、6小时、8小时、12小时、1天、1周、1月；其它周期由托管者合成。

##### 注意事项

- 限价单支持IOC、FOK与只做Maker（```postOnly```，对应HashKey的```LIMIT_MAKER```）；市价单不支持只做Maker与FOK，传入时报错。

#### HitBTC

现货交易。

##### 名称与配置

```exchange.GetName()```：```HitBTC```（现货）。

| 配置项 | 必填 |
| - | - |
| Access Key | 是 |
| Secret Key | 是 |

##### 交易对与合约代码

交易对示例：```BTC_USDT```、```ETH_BTC```

交易对写作```BASE_QUOTE```，对应HitBTC原生代码```BTCUSDT```。

##### 函数支持差异

没有不支持的标准函数。

以回退方式支持：

- `exchange.GetRecords`：原生周期为1分钟、3分钟、5分钟、15分钟、30分钟、1小时、4小时、1天、1周、1月；其它周期由托管者合成。

##### 注意事项

- 现货市价买单的下单量是交易币数，不是计价币金额（按HitBTC的```quantity```下单）。
- 限价单支持IOC、FOK与只做Maker（```postOnly```）。
- 订单号使用HitBTC的```client_order_id```（查单、撤单、改单都按它寻址）。
- 条件单支持止盈、止损（不填委托价为触发后市价成交），不支持OCO；```exchange.ModifyConditionOrder()```可以修改触发价、委托价与数量，撤销条件单与撤销普通订单使用同一接口。

#### 火币

```Huobi```（现货）：HTX（火币）现货，以及逐仓、全仓杠杆账户。

```Futures_HuobiDM```（期货）：HTX（火币）U本位（USDT）永续与交割合约、币本位永续与交割合约。经典账户、统一账户与多资产保证金模式都支持。

##### 名称与配置

| ```exchange.GetName()``` | 类型 | 别名 |
| - | - | - |
| ```Huobi``` | 现货 | 火币现货 |
| ```Futures_HuobiDM``` | 期货 | Futures_HTX、HuobiDM、HTX期货、火币期货 |

| 配置项 | 必填 |
| - | - |
| Access Key | 是 |
| Secret Key | 是 |

##### 交易对与合约代码

###### ```Huobi```（现货）

交易对示例：```BTC_USDT```、```ETH_BTC```

交易对写作```BTC_USDT```，不带合约代码；合约请使用Futures_HuobiDM交易所对象。支持火币的中文交易对，例如```币安人生_USDT```。

###### ```Futures_HuobiDM```（期货）

交易对示例：```BTC_USDT```、```BTC_USD```

计价币决定合约类型：```BTC_USDT```为U本位合约，```BTC_USD```为币本位合约；不支持其它计价币。

| 合约代码 | 说明 |
| - | - |
| ```swap``` | 永续合约（默认）。 |
| ```this_week``` | 当周交割合约。 |
| ```next_week``` | 次周交割合约。 |
| ```quarter``` | 当季交割合约。 |
| ```next_quarter``` | 次季交割合约。 |

交割合约按HTX合约列表中的合约类型查找，交易所没有挂牌对应档位时报错。

原生合约代码示例：```BTC-USDT-260925```、```BTC260925```

交割合约也可以直接写HTX的原生合约代码：U本位形如```BTC_USDT.BTC-USDT-260925```，币本位形如```BTC_USD.BTC260925```。

##### 专属IO指令

###### ```Huobi```（现货）

| 指令 | 说明 | 返回值 |
| - | - | - |
| ```trade_margin``` | 切换为逐仓杠杆账户，之后下单使用该交易对的逐仓杠杆账户（```source=margin-api```）。 | 指令名本身。 |
| ```trade_super_margin``` | 切换为全仓杠杆账户，之后下单与查询余额使用全仓杠杆账户（```source=super-margin-api```）。 | 指令名本身。 |
| ```trade_normal``` | 切换回普通现货账户（默认）。 | 指令名本身。 |

通用指令```api```、```base```、```currency```见`exchange.IO`。

###### ```Futures_HuobiDM```（期货）

| 指令 | 参数 | 说明 | 返回值 |
| - | - | - | - |
| ```cross``` | bool | 全仓（true，默认）/逐仓（false），只对U本位合约有效。只保存在本地，下单时使用，不向交易所发请求，也不区分合约。 | 成功也返回空值，需要确认时调用后读取GetLastError()。 |
| ```dual``` | bool[, symbol] | 双向（true，dual_side）/单向（false，single_side）持仓，向交易所发送切换请求，只支持U本位合约。 | 成功也返回空值，需要确认时调用后读取GetLastError()。 |
| ```unified``` | bool | 向交易所发送请求，把账户切换为统一账户（true）/经典账户（false）。 | 成功也返回空值，需要确认时调用后读取GetLastError()。 |
| ```signHost``` | string | 设置API签名使用的Host。HTX把域名算进签名，通过代理或备用域名访问时用它指定签名域名；不设置时使用接口基地址的域名。 | 成功也返回空值。 |

通用指令```api```、```base```、```currency```见`exchange.IO`。

##### 函数支持差异

###### 全部交易所对象

不支持（调用时报错并返回空值）：`exchange.ModifyOrder`、`exchange.ModifyConditionOrder`。

###### ```Huobi```（现货）

以回退方式支持：

- `exchange.GetRecords`：原生周期为1分钟、5分钟、15分钟、30分钟、1小时、4小时、1天、1周、1月、1年；其它周期由托管者合成。

###### ```Futures_HuobiDM```（期货）

以回退方式支持：

- `exchange.GetRecords`：原生周期为1分钟、5分钟、15分钟、30分钟、1小时、4小时、1天、1周、1月；其它周期由托管者合成。

##### 保证金、账户与模拟盘

###### ```Huobi```（现货）

账户：钱包模式只保存在本地，切换后下单与查询余额使用对应的杠杆账户。逐仓杠杆账户按交易对区分，```exchange.GetAccount()```、```exchange.GetAssets()```不能确定是哪个交易对的逐仓账户，在逐仓模式下调用会报错。

###### ```Futures_HuobiDM```（期货）

保证金模式：U本位合约默认全仓，用```exchange.IO("cross", false)```切换为逐仓（只影响之后的下单）；币本位合约为逐仓。

持仓模式：U本位合约用```exchange.IO("dual", bool)```切换双向/单向持仓。

账户：连接器自动探测U本位账户的形态（经典、统一账户、多资产保证金），按形态使用对应的接口；用```exchange.IO("unified", bool)```切换账户类型后重新探测。

##### 注意事项

###### ```Huobi```（现货）

- 条件单只支持普通现货账户，只支持止盈、止损单，不支持OCO。

###### ```Futures_HuobiDM```（期货）

- 条件单只支持止盈、止损单，不支持OCO；多资产保证金模式下同样可以使用条件单。

#### Korbit

韩国交易所的现货交易，KRW市场。

##### 名称与配置

```exchange.GetName()```：```Korbit```（现货）。

| 配置项 | 必填 |
| - | - |
| Access Key | 是 |
| Secret Key | 是 |

##### 交易对与合约代码

交易对示例：```BTC_KRW```、```ETH_KRW```

交易对写作```BASE_QUOTE```，对应Korbit原生代码```btc_krw```。

##### 函数支持差异

不支持（调用时报错并返回空值）：`exchange.ModifyOrder`、`exchange.CreateConditionOrder`、`exchange.ModifyConditionOrder`、`exchange.CancelConditionOrder`、`exchange.GetConditionOrder`、`exchange.GetConditionOrders`、`exchange.GetHistoryConditionOrders`。

以回退方式支持：

- `exchange.GetRecords`：原生周期为1分钟、5分钟、15分钟、30分钟、1小时、4小时、1天、1周；其它周期由托管者合成。

##### 注意事项

- 只支持GTC限价单与市价单：指定```tif```为```ioc```、```fok```或```postOnly```时报错。
- ```exchange.GetOrders()```不传```symbol```参数时只查询当前交易对。

#### Kraken

```Kraken```（现货）：Kraken现货交易。

```Futures_Kraken```（期货）：Kraken期货：反向（币本位）永续与交割合约、多币种抵押（线性）永续与交割合约，以及Kraken期货的期权。

##### 名称与配置

| ```exchange.GetName()``` | 类型 | 别名 |
| - | - | - |
| ```Kraken``` | 现货 | — |
| ```Futures_Kraken``` | 期货 | Kraken期货、Kraken Futures |

| 配置项 | 必填 |
| - | - |
| Access Key | 是 |
| Secret Key | 是 |

##### 交易对与合约代码

###### ```Kraken```（现货）

交易对示例：```BTC_USD```、```ETH_USDT```、```BTC_EUR```

交易对写作```BASE_QUOTE```。Kraken把BTC写作```XBT```、DOGE写作```XDG```，交易对用```BTC```、```DOGE```即可（写```XBT_USD```也可以），返回的品种代码统一用```BTC```、```DOGE```。

###### ```Futures_Kraken```（期货）

交易对示例：```BTC_USD```、```ETH_USD```

交易对如```BTC_USD```，合约代码决定合约类型：不带后缀的合约代码为反向合约（Kraken的```PI_```、```FI_```），带```_pf```、```_ff```后缀的为多币种抵押合约（```PF_```、```FF_```）。合约代码里BTC写作```XBT```，交易对用```BTC```即可，返回的品种代码统一用```BTC```。

| 合约代码 | 说明 |
| - | - |
| ```swap``` | 反向永续合约（默认）。 |
| ```month``` | 最近到期的反向交割合约。 |
| ```this_week``` | 同```month```。 |
| ```quarter``` | 反向季度合约（3、6、9、12月到期中最近的一个）。 |
| ```next_quarter``` | 反向次季合约。 |
| ```third_quarter``` | 反向第三季度合约。 |
| ```swap_pf``` | 多币种抵押永续合约。 |
| ```month_ff``` | 最近到期的多币种抵押交割合约。 |
| ```this_week_ff``` | 同```month_ff```。 |
| ```quarter_ff``` | 多币种抵押季度合约。 |
| ```next_quarter_ff``` | 多币种抵押次季合约。 |
| ```third_quarter_ff``` | 多币种抵押第三季度合约。 |

Kraken只挂月度和季度交割合约，```this_week```、```month```都指最近到期的那个。交割合约按交易所合约列表中的到期时间选取。查询持仓、挂单时可以用范围```USD.swap_pf```（多币种抵押永续）、```USD.futures_ff```（多币种抵押交割）。

原生合约代码示例：```FF_ETHUSD_250307```、```PF_XBTUSD```

也可以直接使用Kraken的原生合约代码（```PI_```、```PF_```、```FI_```、```FF_```前缀），例如```ETH_USD.FF_ETHUSD_250307```。

##### 专属IO指令

###### ```Kraken```（现货）

没有专属指令，通用指令见`exchange.IO`。

###### ```Futures_Kraken```（期货）

| 指令 | 参数 | 说明 | 返回值 |
| - | - | - | - |
| ```cross``` | bool[, symbol] | 全仓（true）/逐仓（false），只支持多币种抵押合约。切换为逐仓时杠杆上限设为10倍，之后可用```exchange.SetMarginLevel()```修改。 | 成功也返回空值，需要确认时调用后读取GetLastError()。 |

通用指令```api```、```base```、```currency```见`exchange.IO`。

##### 函数支持差异

###### 全部交易所对象

没有不支持的标准函数。

###### ```Kraken```（现货）

以回退方式支持：

- `exchange.GetRecords`：原生周期为1分钟、5分钟、15分钟、30分钟、1小时、4小时、1天、1周、15天；其它周期由托管者合成。

###### ```Futures_Kraken```（期货）

以回退方式支持：

- `exchange.GetRecords`：原生周期为1分钟、5分钟、15分钟、30分钟、1小时、4小时、12小时、1天、1周；其它周期由托管者合成。

##### 保证金、账户与模拟盘

###### ```Futures_Kraken```（期货）

保证金模式：只有多币种抵押合约（```swap_pf```、```*_ff```）可以切换全仓/逐仓和设置杠杆，反向合约与期权调用```exchange.IO("cross", ...)```、```exchange.SetMarginLevel()```报错。Kraken以杠杆偏好表达保证金模式：```exchange.SetMarginLevel()```设置杠杆上限的同时会把该合约切换为逐仓，```exchange.IO("cross", true)```取消杠杆上限、恢复全仓。

账户：反向合约使用各自的单币种钱包，```exchange.GetAccount()```的```Stocks```为该钱包的可用币数；多币种抵押合约与期权使用多币种抵押钱包，```Balance```为以USD计价的可用保证金。

##### 期权

###### ```Futures_Kraken```（期货）

支持Kraken期货的期权。限制：

- Kraken没有期权合约列表接口，```exchange.GetMarkets()```不包含期权合约，期权代码需要从Kraken网页获取。
- ```exchange.GetTicker()```在合约没有成交价时```Last```取标记价格；无人报价时```Buy```、```Sell```、```High```、```Low```为0；原始数据```Info```中有隐含波动率、希腊值等字段。
- 期权没有资金费率，不支持```exchange.SetMarginLevel()```与保证金模式切换。

期权代码示例：```OF_ETHUSD_261225_4000_C```、```OF_XBTUSD_261225_100000_P```

期权代码为Kraken原生代码：```OF_```、标的与计价币、到期日（YYMMDD）、行权价、C/P，C为看涨、P为看跌。代码中的标的与计价币必须与交易对一致，BTC写作```XBT```，完整品种代码形如```ETH_USD.OF_ETHUSD_261225_4000_C```。

##### 注意事项

###### ```Kraken```（现货）

- 现货市价买单的下单量是交易币数（Kraken的```volume```），不是计价币金额。
- 条件单只支持止盈、止损单，不支持OCO。
- 下单支持```tif```的IOC与只做Maker（```postOnly```，仅限价委托），不支持FOK，传入时报错。

###### ```Futures_Kraken```（期货）

- 下单量为Kraken的合约数量：反向合约每张1 USD，多币种抵押合约以标的币数计（见`exchange.GetMarkets`的```CtVal```、```CtValCcy```）。
- Kraken的资金费率原始值是每张合约的绝对金额，```exchange.GetFundings()```已换算为相对费率；永续合约每小时结算一次。
- 条件单只支持止盈、止损单，不支持OCO；条件单以最新成交价触发。
- 限价单支持```tif```的IOC与只做Maker（```postOnly```），不支持FOK；市价单与条件单不支持这些选项，传入时报错。

#### 库币

```KuCoin```（现货）：KuCoin现货交易。

```Futures_KuCoin```（期货）：KuCoin合约：USDT、USDC保证金永续合约，币本位永续与交割合约。

##### 名称与配置

| ```exchange.GetName()``` | 类型 | 别名 |
| - | - | - |
| ```KuCoin``` | 现货 | — |
| ```Futures_KuCoin``` | 期货 | KuCoin期货、KuCoin Futures |

✓ 表示该交易所对象有这个配置项。

| 配置项 | ```KuCoin``` | ```Futures_KuCoin``` | 必填 | 说明 |
| - | - | - | - | - |
| Access Key | ✓ | ✓ | 是 | — |
| Secret Key | ✓ | ✓ | 是 | — |
| Password | ✓ |  | 是 | 创建API Key时设置的Passphrase。 |
| Passphrase |  | ✓ | 是 | — |

##### 交易对与合约代码

###### ```KuCoin```（现货）

交易对示例：```BTC_USDT```、```ETH_BTC```

交易对写作```BASE_QUOTE```，对应KuCoin的```BASE-QUOTE```交易对，大小写不敏感。

###### ```Futures_KuCoin```（期货）

交易对示例：```BTC_USDT```、```BTC_USDC```、```BTC_USD```

计价币决定合约类型：```BTC_USDT```、```BTC_USDC```为USDT、USDC保证金合约，```BTC_USD```为币本位合约；计价币只能是```USDT```、```USDC```、```USD```。KuCoin合约把BTC写作```XBT```，交易对写```BTC_USDT```或```XBT_USDT```都可以，返回的品种代码统一用```BTC```。

| 合约代码 | 说明 |
| - | - |
| ```swap``` | 永续合约。 |
| ```quarter``` | 该交易对最近到期的交割合约（币本位）。 |
| ```next_quarter``` | 该交易对第二近到期的交割合约（币本位）。 |

```quarter```、```next_quarter```按交易所合约列表中的到期时间排序选取。

原生合约代码示例：```XBTMZ26```

更远期的交割合约使用KuCoin的原生合约代码（全大写、带数字），例如交易对```BTC_USD```、合约代码```XBTMZ26```；`exchange.GetMarkets`中第三个及以后到期的交割合约也以原生代码为合约代码。

##### 专属IO指令

###### ```KuCoin```（现货）

没有专属指令，通用指令见`exchange.IO`。

###### ```Futures_KuCoin```（期货）

| 指令 | 参数 | 说明 | 返回值 |
| - | - | - | - |
| ```cross``` | bool[, symbol] | 全仓（true）/逐仓（false），向交易所切换当前合约（或指定合约）的保证金模式，并作为之后所有订单的保证金模式。 | 成功也返回空值，需要确认时调用后读取GetLastError()。 |

通用指令```api```、```base```、```currency```见`exchange.IO`。

##### 函数支持差异

###### ```KuCoin```（现货）

不支持（调用时报错并返回空值）：`exchange.ModifyConditionOrder`。

以回退方式支持：

- `exchange.GetRecords`：原生周期为1分钟、3分钟、5分钟、15分钟、30分钟、1小时、2小时、4小时、6小时、8小时、12小时、1天、1周；其它周期由托管者合成。

###### ```Futures_KuCoin```（期货）

不支持（调用时报错并返回空值）：`exchange.ModifyOrder`、`exchange.ModifyConditionOrder`。

以回退方式支持：

- `exchange.GetRecords`：原生周期为1分钟、5分钟、15分钟、30分钟、1小时、2小时、4小时、8小时、12小时、1天、1周；其它周期由托管者合成。

##### 保证金、账户与模拟盘

###### ```Futures_KuCoin```（期货）

保证金模式：用```exchange.IO("cross", bool)```切换全仓/逐仓（默认全仓）。交易所的保证金模式按合约设置，但交易所对象只记住最后一次切换的模式并随所有订单带上；KuCoin要求订单的保证金模式与该合约的当前设置一致，切换了A合约后再给保证金模式不同的B合约下单会被交易所拒绝。

持仓模式：按单向持仓下单（不带持仓方向参数），平仓单以只减仓（reduceOnly）方式提交。

账户：KuCoin合约没有设置杠杆的接口，```exchange.SetMarginLevel()```只在本地记下每个合约的杠杆，下单时随订单发送（未设置时为10倍）。全仓模式下交易所按该合约在交易所的杠杆设置计算，不按订单里的杠杆。

##### 注意事项

###### ```KuCoin```（现货）

- 条件单只支持止盈、止损单，不支持OCO（KuCoin没有OCO接口）；不支持修改条件单，需要先撤销再重新创建。条件单与普通订单分属两个订单空间，撤销、查询条件单使用条件单函数。

###### ```Futures_KuCoin```（期货）

- 下单量为合约张数，必须是正整数。
- 限价单支持```tif```的IOC与只做Maker（```postOnly```），不支持FOK；市价单不支持这些选项，传入时报错。
- 条件单只支持止盈、止损单，不支持OCO（KuCoin合约没有OCO接口）；条件单以最新成交价触发。

#### LBank

现货交易。

##### 名称与配置

```exchange.GetName()```：```LBank```（现货）。

| 配置项 | 必填 |
| - | - |
| Access Key | 是 |
| Secret Key | 是 |

##### 交易对与合约代码

交易对示例：```BTC_USDT```、```ETH_USDT```

交易对写作```BASE_QUOTE```，对应LBank原生代码```btc_usdt```。

##### 函数支持差异

不支持（调用时报错并返回空值）：`exchange.ModifyOrder`、`exchange.CreateConditionOrder`、`exchange.ModifyConditionOrder`、`exchange.CancelConditionOrder`、`exchange.GetConditionOrder`、`exchange.GetConditionOrders`、`exchange.GetHistoryConditionOrders`。

以回退方式支持：

- `exchange.GetRecords`：原生周期为1分钟、5分钟、15分钟、30分钟、1小时、4小时、8小时、12小时、1天、1周、1月；其它周期由托管者合成。

##### 注意事项

- 限价单支持只做Maker（```postOnly```）与```tif```（IOC、FOK）选项；市价单不支持这些选项，传入时报错。
- 查询未完成订单的接口必须指定交易对：```exchange.GetOrders()```不传```symbol```参数时只查询当前交易对。
- ```exchange.GetHistoryOrders()```不支持```since```参数（交易所接口不按时间过滤），传入时报错；不传时返回最近的订单。
- ```exchange.GetTickers()```同时包含现货与杠杆代币（ETF）交易对的行情。

#### MEXC

```MEXC```（现货）：MEXC（抹茶）现货交易，使用MEXC V3接口。

```Futures_MEXC```（期货）：MEXC（抹茶）永续合约：USDT、USDC保证金合约与币本位合约。

##### 名称与配置

| ```exchange.GetName()``` | 类型 | 别名 |
| - | - | - |
| ```MEXC``` | 现货 | 抹茶 |
| ```Futures_MEXC``` | 期货 | 抹茶期货、MEXC期货、MEXC Futures |

✓ 表示该交易所对象有这个配置项。

| 配置项 | ```MEXC``` | ```Futures_MEXC``` | 必填 | 默认值 | 说明 |
| - | - | - | - | - | - |
| Access Key | ✓ | ✓ | 是 | — | — |
| Secret Key | ✓ | ✓ | 是 | — | — |
| V3协议 | ✓ |  | 否 | 勾选 | 兼容旧配置保留的选项，连接器固定使用V3接口，勾选与否不影响。 |

##### 交易对与合约代码

###### ```MEXC```（现货）

交易对示例：```BTC_USDT```、```ETH_USDC```

交易对写作```BASE_QUOTE```，大小写不敏感。

###### ```Futures_MEXC```（期货）

交易对示例：```BTC_USDT```、```BTC_USDC```、```BTC_USD```

交易对设置为```BTC_USDT```、```BTC_USDC```为USDT、USDC保证金合约，```BTC_USD```为币本位合约。

| 合约代码 | 说明 |
| - | - |
| ```swap``` | 永续合约（唯一的合约代码）。 |

MEXC合约只有永续合约，其它合约代码会报错。

##### 专属IO指令

###### ```MEXC```（现货）

没有专属指令，通用指令见`exchange.IO`。

###### ```Futures_MEXC```（期货）

| 指令 | 参数 | 说明 | 返回值 |
| - | - | - | - |
| ```cross``` | bool | 全仓（true，默认）/逐仓（false）。只记在交易所对象上，下单时使用，不向交易所发请求。 | 设置的值。 |

通用指令```api```、```base```、```currency```见`exchange.IO`。

##### 函数支持差异

###### ```MEXC```（现货）

不支持（调用时报错并返回空值）：`exchange.ModifyOrder`、`exchange.CreateConditionOrder`、`exchange.ModifyConditionOrder`、`exchange.CancelConditionOrder`、`exchange.GetConditionOrder`、`exchange.GetConditionOrders`、`exchange.GetHistoryConditionOrders`。

以回退方式支持：

- `exchange.GetRecords`：原生周期为1分钟、5分钟、15分钟、30分钟、1小时、4小时、1天、1周、1月；其它周期由托管者合成。

###### ```Futures_MEXC```（期货）

不支持（调用时报错并返回空值）：`exchange.ModifyConditionOrder`。

以回退方式支持：

- `exchange.GetRecords`：原生周期为1分钟、5分钟、15分钟、30分钟、1小时、4小时、8小时、1天、1周、1月；其它周期由托管者合成。

##### 保证金、账户与模拟盘

###### ```Futures_MEXC```（期货）

保证金模式：用```exchange.IO("cross", bool)```选择全仓/逐仓，下单时随订单发送；`exchange.GetPositions`只返回与当前选择的保证金模式一致的持仓。

账户：```exchange.SetMarginLevel()```在全仓模式下向交易所修改该合约多、空两侧的杠杆；逐仓模式下只在本地记下杠杆，下单时随订单发送。逐仓下单时没有设置过杠杆，会先向交易所查询该合约当前的逐仓杠杆。

##### 注意事项

###### ```MEXC```（现货）

- MEXC现货查询挂单的接口必须指定交易对：```exchange.GetOrders()```不传参数时只查询当前交易对的挂单，不是所有交易对的挂单。

###### ```Futures_MEXC```（期货）

- `exchange.GetFundings`不支持批量查询，需要传入具体品种代码，例如```BTC_USDT.swap```。
- 条件单只支持止盈、止损单，不支持OCO；不支持修改条件单；条件单不能使用自定义订单号（clientId）。条件单以最新成交价触发，有效期为24小时，到期自动失效。
- 改单（```exchange.ModifyOrder()```）只能修改限价单，改单后交易所会撤销原订单并挂出新订单，返回值是新订单的Id，之后的查询、撤单应使用新Id。

#### OKX

```OKEX```（现货）：OKX（欧易）现货，以及同一账户下的现货杠杆交易（逐仓、全仓）。使用OKX V5接口。

```Futures_OKCoin```（期货）：OKX（欧易）永续合约（USDT、USDC保证金与币本位）、交割合约（币本位、USDT保证金、USD保证金）以及期权。使用OKX V5接口。

##### 名称与配置

| ```exchange.GetName()``` | 类型 | 别名 |
| - | - | - |
| ```OKEX``` | 现货 | 欧易、OKX现货 |
| ```Futures_OKCoin``` | 期货 | Futures_OKX、OKX期货、欧易期货 |

| 配置项 | 必填 | 默认值 | 说明 |
| - | - | - | - |
| Access Key | 是 | — | — |
| Secret Key | 是 | — | — |
| Passphrase | 是 | — | — |
| V5协议 | 否 | 勾选 | 兼容保留，连接器始终使用OKX V5接口，勾选与否不影响。 |
| 模拟盘 | 否 | 不勾选 | — |

##### 交易对与合约代码

###### ```OKEX```（现货）

交易对示例：```BTC_USDT```、```ETH_BTC```

交易对写作```BTC_USDT```（对应OKX的```BTC-USDT```），不带合约代码；合约请使用Futures_OKCoin交易所对象。

###### ```Futures_OKCoin```（期货）

交易对示例：```BTC_USDT```、```BTC_USDC```、```BTC_USD```、```BTC_USD_UM```

计价币决定合约类型：```BTC_USDT```、```BTC_USDC```为USDT、USDC保证金合约，```BTC_USD```为币本位合约。OKX的USD保证金交割合约（交易所合约族为```BTC-USD_UM```）交易对写作```BTC_USD_UM```，例如```BTC_USD_UM.quarter```。

| 合约代码 | 说明 |
| - | - |
| ```swap``` | 永续合约（默认）。 |
| ```this_week``` | 当周交割合约。 |
| ```next_week``` | 次周交割合约。 |
| ```month``` | 当月交割合约。 |
| ```next_month``` | 次月交割合约。 |
| ```quarter``` | 当季交割合约。 |
| ```next_quarter``` | 次季交割合约。 |
| ```third_quarter``` | 第三季度交割合约。 |
| ```fourth_quarter``` | 第四季度交割合约。 |

交割合约按OKX合约列表中的档位查找，交易所没有挂牌该档位时报错（例如```no quarter futures for BTC-USDT on okx```）。

原生合约代码示例：```BTC-USD-260925```、```HMSTR-USDT-250207```

交割合约也可以直接写OKX的原生合约代码，包括没有固定周期的盘前交易合约：交易对设置为```HMSTR_USDT```，再```exchange.SetContractType("HMSTR-USDT-250207")```；支持```symbol```参数的函数可以写成```HMSTR_USDT.HMSTR-USDT-250207```。

##### 专属IO指令

###### ```OKEX```（现货）

| 指令 | 参数 | 说明 | 返回值 |
| - | - | - | - |
| ```simulate``` | bool | 模拟盘（true）/实盘（false）切换，模拟盘请求带```x-simulated-trading: 1```请求头，接口地址不变。 | 设置后的值。 |
| ```trade_margin``` | — | 切换为杠杆账户、逐仓（tdMode=isolated）。 | 指令名本身。 |
| ```trade_super_margin``` | — | 切换为杠杆账户、全仓（tdMode=cross）。 | 指令名本身。 |
| ```trade_normal``` | — | 切换回普通现货（tdMode=cash，默认）。 | 指令名本身。 |
| ```tdMode``` | string | 直接设置交易模式：```cash```（现货）、```cross```、```isolated```（杠杆全仓、逐仓）。 | 设置后的模式。 |

通用指令```api```、```base```、```currency```见`exchange.IO`。

###### ```Futures_OKCoin```（期货）

| 指令 | 参数 | 说明 | 返回值 |
| - | - | - | - |
| ```simulate``` | bool | 模拟盘（true）/实盘（false）切换，模拟盘请求带```x-simulated-trading: 1```请求头，接口地址不变。 | 设置后的值。 |
| ```cross``` | bool | 全仓（true，默认）/逐仓（false）。只保存在本地，之后下单、条件单和```exchange.SetMarginLevel()```作为tdMode/mgnMode传入，不向交易所发请求，也不区分合约。 | 设置后的值。 |
| ```tdMode``` | string | 直接设置下单的tdMode：```cross```、```isolated```、```cash```。 | 设置后的模式。 |
| ```dual``` | bool | 双向（true，long_short_mode）/单向（false，net_mode）持仓。OKX的持仓模式是账户级设置，调用时向交易所发送切换请求。 | 设置后的值。 |

通用指令```api```、```base```、```currency```见`exchange.IO`。

##### 函数支持差异

没有不支持的标准函数。

以回退方式支持：

- `exchange.GetRecords`：原生周期为1分钟、3分钟、5分钟、15分钟、30分钟、1小时、2小时、4小时、6小时、12小时、1天、3天、1周、1月、3月；其它周期由托管者合成。

##### 保证金、账户与模拟盘

###### 全部交易所对象

模拟盘：勾选「模拟盘」或调用```exchange.IO("simulate", true)```使用OKX模拟盘，需要使用在OKX模拟盘页面创建的API KEY。

###### ```OKEX```（现货）

账户：现货与杠杆共用OKX的同一套接口，区别在下单的```tdMode```和订单查询的品种类型。切换到杠杆后，连接器首次请求时查询账户模式（acctLv）：现货模式的账户不能下杠杆单（报错```acctLv is 1```）；单币种保证金模式下杠杆单带借币币种（买单借计价币、卖单借交易币）；跨币种、组合保证金模式下全仓杠杆的订单登记在现货品种下，查询时自动按此处理。可以在下单附加参数中显式传```tdMode```、```ccy```覆盖。

###### ```Futures_OKCoin```（期货）

保证金模式：默认全仓，用```exchange.IO("cross", false)```或```exchange.IO("tdMode", "isolated")```切换为逐仓；也可以在下单附加参数中显式传```tdMode```。```exchange.SetMarginLevel()```按当前的全仓/逐仓设置杠杆。

持仓模式：下单前自动查询账户的持仓模式，双向持仓时按开平方向带```posSide```；也可以用```exchange.IO("dual", bool)```切换。

##### 期权

###### ```Futures_OKCoin```（期货）

支持OKX期权，用法与期货合约相同。

- ```exchange.GetMarkets()```不列出期权合约，可以通过OKX的```/api/v5/public/instruments?instType=OPTION&uly=BTC-USD```接口查询期权合约列表。
- 从未成交的期权合约，```exchange.GetTicker()```的```Last```取标记价格。
- 期权订单不带```posSide```。

期权代码示例：```BTC-USD-260925-60000-C```

期权代码为OKX原生代码：标的-计价币-到期日（YYMMDD）-行权价-C/P。交易对设置为```BTC_USD```，完整品种代码形如```BTC_USD.BTC-USD-260925-60000-C```。

##### 注意事项

###### ```OKEX```（现货）

- 条件单支持止盈、止损和OCO；```exchange.ModifyConditionOrder()```使用OKX的改算法单接口（```amend-algos```）原地修改，不撤单重下。

###### ```Futures_OKCoin```（期货）

- ```exchange.GetFundings()```不支持批量查询，需要传入具体的永续合约，例如```exchange.GetFundings("ETH_USDT.swap")```；不传或传范围（如```USDT.swap```）时报错。
- 条件单支持止盈、止损和OCO；```exchange.ModifyOrder()```、```exchange.ModifyConditionOrder()```使用OKX的改单接口原地修改，订单ID不变。

#### Poloniex

现货交易（SPOT账户）。

##### 名称与配置

```exchange.GetName()```：```Poloniex```（现货）。

| 配置项 | 必填 |
| - | - |
| Access Key | 是 |
| Secret Key | 是 |

##### 交易对与合约代码

交易对示例：```BTC_USDT```、```ETH_USDT```

交易对写作```BASE_QUOTE```，与Poloniex原生代码同形。

##### 专属IO指令

| 指令 | 参数 | 说明 | 返回值 |
| - | - | - | - |
| ```accountId``` | string | 指定`exchange.GetAccount`读取的现货账户ID：设置后只读这个现货账户，找不到该账户时报错；传空字符串恢复默认（读取第一个现货账户）。不影响`exchange.GetAssets`，它总是汇总全部现货账户。 | 空值。 |

通用指令```api```、```base```、```currency```见`exchange.IO`。

##### 函数支持差异

不支持（调用时报错并返回空值）：`exchange.ModifyConditionOrder`。

以回退方式支持：

- `exchange.GetRecords`：原生周期为1分钟、5分钟、10分钟、15分钟、30分钟、1小时、2小时、4小时、6小时、12小时、1天、3天、1周、1月；其它周期由托管者合成。

##### 注意事项

- 限价单支持IOC、FOK与只做Maker（```postOnly```）。
- 现货条件单只支持止损（```ORDER_CONDITION_TYPE_SL```）：买单在价格涨到触发价时触发，卖单在价格跌到触发价时触发。止盈（```ORDER_CONDITION_TYPE_TP```）和OCO条件单会直接报错，不会下单。不填委托价为触发后市价成交。
- ```exchange.GetAccount()```只读一个SPOT账户：```exchange.IO("accountId", id)```指定的账户，未指定时为第一个SPOT账户；```exchange.GetAssets()```汇总所有SPOT账户的资产。

#### Upbit

韩国交易所的现货交易，KRW、BTC、USDT市场。

##### 名称与配置

```exchange.GetName()```：```Upbit```（现货）。

| 配置项 | 必填 |
| - | - |
| Access Key | 是 |
| Secret Key | 是 |

##### 交易对与合约代码

交易对示例：```BTC_KRW```、```ETH_BTC```、```XRP_USDT```

交易对写作```BASE_QUOTE```，Upbit原生市场代码是计价币在前（```BTC_KRW```对应```KRW-BTC```），由连接器转换。

##### 函数支持差异

不支持（调用时报错并返回空值）：`exchange.CreateConditionOrder`、`exchange.ModifyConditionOrder`、`exchange.CancelConditionOrder`、`exchange.GetConditionOrder`、`exchange.GetConditionOrders`、`exchange.GetHistoryConditionOrders`。

以回退方式支持：

- `exchange.GetRecords`：原生周期为1秒、1分钟、3分钟、5分钟、10分钟、15分钟、30分钟、1小时、4小时、1天、1周、1月、1年；其它周期由托管者合成。

##### 注意事项

- 限价单支持IOC、FOK与只做Maker（```postOnly```）。
- ```exchange.ModifyOrder()```使用Upbit的撤单并重新下单接口（```cancel_and_new```），由交易所原子地撤销原订单并下新订单，返回新订单的订单号，之后应使用新订单号。

#### WEEX

```WEEX```（现货）：WEEX现货交易（V3接口）。API KEY需要同时配置Access Key、Secret Key和Passphrase。

```Futures_WEEX```（期货）：WEEX USDT本位永续合约（V3接口）。API KEY需要同时配置Access Key、Secret Key和Passphrase。

##### 名称与配置

| ```exchange.GetName()``` | 类型 | 别名 |
| - | - | - |
| ```WEEX``` | 现货 | 唯客 |
| ```Futures_WEEX``` | 期货 | WEEX期货 |

| 配置项 | 必填 |
| - | - |
| Access Key | 是 |
| Secret Key | 是 |
| Passphrase | 是 |

##### 交易对与合约代码

###### 全部交易所对象

交易对示例：```BTC_USDT```、```ETH_USDT```

###### ```WEEX```（现货）

交易对写作```BTC_USDT```，对应WEEX的原生代码```BTCUSDT```。

###### ```Futures_WEEX```（期货）

交易对写作```BTC_USDT```，对应WEEX的原生代码```BTCUSDT```；可交易的合约以```exchange.GetMarkets()```为准。

| 合约代码 | 说明 |
| - | - |
| ```swap``` | 永续合约。 |

WEEX没有交割合约，其它合约代码会报错。下单数量单位为基础币（交易所不支持按张下单，```exchange.GetMarkets()```中```CtVal```为1）。

##### 函数支持差异

###### ```WEEX```（现货）

不支持（调用时报错并返回空值）：`exchange.ModifyOrder`、`exchange.CreateConditionOrder`、`exchange.ModifyConditionOrder`、`exchange.CancelConditionOrder`、`exchange.GetConditionOrder`、`exchange.GetConditionOrders`、`exchange.GetHistoryConditionOrders`。

以回退方式支持：

- `exchange.GetRecords`：原生周期为1分钟、5分钟、15分钟、30分钟、1小时、2小时、4小时、6小时、8小时、12小时、1天、1周；其它周期由托管者合成。

###### ```Futures_WEEX```（期货）

不支持（调用时报错并返回空值）：`exchange.ModifyOrder`。

以回退方式支持：

- `exchange.GetRecords`：原生周期为1分钟、5分钟、15分钟、30分钟、1小时、4小时、12小时、1天、1周；其它周期由托管者合成。

##### 保证金、账户与模拟盘

###### ```Futures_WEEX```（期货）

保证金模式：没有切换全仓/逐仓的IO指令，保证金模式按交易所账户中该合约的设置。```exchange.SetMarginLevel()```先查询该合约当前的保证金模式：逐仓时同时设置多、空两侧杠杆，全仓时设置全仓杠杆。

持仓模式：每张订单都带持仓方向```positionSide```，由下单方向推出：开多、平多为```LONG```，开空、平空为```SHORT```；也可以在附加参数中显式传```positionSide```。条件单同样带持仓方向。

##### 注意事项

###### ```WEEX```（现货）

- 市价买单的数量为计价币金额：WEEX现货接口不支持按金额下市价单，连接器按当前卖盘把金额折算成基础币数量（按数量步长向下取整）后下单，实际成交金额可能与传入的金额略有差异。在附加参数中显式传```quantity```时直接使用该数量。
- 不支持只做Maker（post-only）订单，限价单的有效方式只有GTC、IOC、FOK。

###### ```Futures_WEEX```（期货）

- 条件单只支持止盈、止损单，不支持OCO（需要分成止盈、止损两张条件单下单）。
- ```exchange.ModifyConditionOrder()```调用交易所的改条件单接口原地修改，订单号不变，只能修改未触发的止盈、止损条件单。可改的是触发价和委托价：取```condition```中对应条件类型的```TpTriggerPrice```/```TpOrderPrice```或```SlTriggerPrice```/```SlOrderPrice```，委托价为```-1```（或不大于0）时改为触发后市价执行。交易所不支持修改数量和买卖方向：传入的数量或方向与原单不同时报错并返回空值，不会忽略。触发价类型沿用原单（标记价格或最新成交价），也可以在附加参数中传```triggerPriceType```（```CONTRACT_PRICE```或```MARK_PRICE```）。修改后止盈还是止损由交易所按新触发价判定，可能与```ConditionType```不同，以```exchange.GetConditionOrder()```查询结果为准。
- 订单与条件单的```Offset```按买卖方向与持仓方向推出：卖出+多仓方向（平多）、买入+空仓方向（平空）为平仓，其余为开仓。双向持仓下交易所给平仓条件单返回的```reduceOnly```也是```false```，不作为开平依据；只有持仓方向为单向（```BOTH```）或缺省时才按```reduceOnly```/```closePosition```判断。

#### WOO X

```WOO```（现货）：WOO X现货交易。API KEY需要同时配置Access Key、Secret Key和Application Id。

```Futures_WOO```（期货）：WOO X永续合约。API KEY需要同时配置Access Key、Secret Key和Application Id。

##### 名称与配置

| ```exchange.GetName()``` | 类型 | 别名 |
| - | - | - |
| ```WOO``` | 现货 | WOOX |
| ```Futures_WOO``` | 期货 | WOO X期货 |

✓ 表示该交易所对象有这个配置项。

| 配置项 | ```WOO``` | ```Futures_WOO``` | 必填 | 说明 |
| - | - | - | - | - |
| Access Key | ✓ | ✓ | 是 | — |
| Secret Key | ✓ | ✓ | 是 | — |
| Application Id | ✓ |  | 是 | WOO X API管理页面中API KEY对应的Application ID，用于核对账户余额应答属于本账户，必须填写。 |
| Application Id |  | ✓ | 是 | WOO X API管理页面中API KEY对应的Application ID，用于核对账户应答属于本账户，必须填写。 |

##### 交易对与合约代码

###### ```WOO```（现货）

交易对示例：```BTC_USDT```、```ETH_USDT```

交易对写作```BTC_USDT```，对应WOO X的原生代码```SPOT_BTC_USDT```。本交易所对象只交易现货，带合约后缀的品种（如```BTC_USDT.swap```）会报错，永续合约请使用```Futures_WOO```。

###### ```Futures_WOO```（期货）

交易对示例：```BTC_USDT```

交易对写作```BTC_USDT```，对应WOO X的原生代码```PERP_BTC_USDT```。

| 合约代码 | 说明 |
| - | - |
| ```swap``` | 永续合约。 |

WOO X只有永续合约，其它合约代码会报错。下单数量单位为基础币（```exchange.GetMarkets()```中```CtVal```为1）。

##### 专属IO指令

###### ```WOO```（现货）

| 指令 | 说明 |
| - | - |
| ```trade_margin``` | 账户切换为杠杆模式（MARGIN），向交易所发出设置请求（```POST /v1/client/account_mode```），交易所确认后返回```true```。是账户级设置。 |
| ```trade_normal``` | 账户切换为纯现货模式（PURE_SPOT），向交易所发出设置请求，交易所确认后返回```true```。是账户级设置。 |

通用指令```api```、```base```、```currency```见`exchange.IO`。

###### ```Futures_WOO```（期货）

| 指令 | 参数 | 说明 |
| - | - | - |
| ```cross``` | bool | 全仓（true）/逐仓（false），只修改本地设置，不发请求，之后的下单、条件单和```exchange.SetMarginLevel()```随请求带上；默认全仓。 |
| ```dual``` | bool | 双向（true）/单向（false）持仓，向交易所发出设置请求（```POST /v1/client/position_mode```），成功后连接器按双向持仓下单（普通单和条件单都带持仓方向）。 |

通用指令```api```、```base```、```currency```见`exchange.IO`。

##### 函数支持差异

###### 全部交易所对象

不支持（调用时报错并返回空值）：`exchange.GetTickers`。

###### ```WOO```（现货）

以回退方式支持：

- `exchange.GetRecords`：原生周期为1分钟、5分钟、15分钟、30分钟、1小时、4小时、12小时、1天、1周、1月；其它周期由托管者合成。

###### ```Futures_WOO```（期货）

以回退方式支持：

- `exchange.GetRecords`：原生周期为1分钟、5分钟、15分钟、30分钟、1小时、4小时、12小时、1天、1周、1月、1年；其它周期由托管者合成。

##### 保证金、账户与模拟盘

###### ```Futures_WOO```（期货）

保证金模式：用```exchange.IO("cross", bool)```选择全仓/逐仓，这是本地设置，随每次下单带上（默认全仓）。```exchange.SetMarginLevel()```按合约设置杠杆，同时带上当前的全仓/逐仓设置。

持仓模式：用```exchange.IO("dual", bool)```切换双向/单向持仓。连接器不自动探测账户的持仓模式：账户已经是双向持仓时，每次运行策略都要先调用```exchange.IO("dual", true)```，否则下单不带持仓方向会被交易所拒绝。双向持仓下```exchange.SetMarginLevel()```按```exchange.SetDirection()```设置的方向只设置多头或空头一侧（未设置方向时为多头），也可以在附加参数中传```{"position_side": "LONG"|"SHORT"|"BOTH"}```指定。

##### 注意事项

###### ```WOO```（现货）

- WOO X现货没有24小时行情接口，```exchange.GetTicker()```由最近24根1小时K线（开高低价、成交量）和盘口（买一、卖一价）拼成，每次调用请求两个接口。
- 条件单支持止盈、止损和OCO；```exchange.ModifyConditionOrder()```只能修改止盈、止损单，不能修改OCO条件单。
- ```exchange.GetConditionOrders()```只能按交易对查询：不传或传空字符串时查询当前交易对。

###### ```Futures_WOO```（期货）

- 条件单支持止盈、止损和OCO，触发价类型固定为```MARKET_PRICE```；```exchange.ModifyConditionOrder()```只能修改止盈、止损单，不能修改OCO条件单。

#### Zaif

日本交易所的现货交易。

##### 名称与配置

```exchange.GetName()```：```Zaif```（现货）。

| 配置项 | 必填 |
| - | - |
| Access Key | 是 |
| Secret Key | 是 |

##### 交易对与合约代码

交易对示例：```BTC_JPY```、```ETH_JPY```

交易对写作```BASE_QUOTE```，对应Zaif原生代码```btc_jpy```。

##### 函数支持差异

不支持（调用时报错并返回空值）：`exchange.GetTickers`、`exchange.ModifyOrder`、`exchange.CreateConditionOrder`、`exchange.ModifyConditionOrder`、`exchange.CancelConditionOrder`、`exchange.GetConditionOrder`、`exchange.GetConditionOrders`、`exchange.GetHistoryConditionOrders`。

以回退方式支持：

- `exchange.GetRecords`：交易所没有K线接口，由托管者用成交记录合成：首次调用只有最近成交覆盖的少量K线，随调用逐步累积。
- `exchange.GetOrder`：交易所没有查询单个订单的接口，在当前未完成订单和历史订单中查找该订单。

##### 注意事项

- 不支持市价单，只能下GTC限价单：指定```tif```为```ioc```、```fok```或```postOnly```时报错。
- ```exchange.GetOrders()```不传```symbol```参数时只查询当前交易对。

### 去中心化交易所

链上订单簿交易所与兑换聚合器，交易由配置的钱包或密钥签名。

#### 订单簿永续合约

链上订单簿撮合的永续合约交易所：`Hyperliquid`、`Lighter`、`edgeX`、`Aster`、`Aevo`、`Pendle`、`WOOFi Pro`。

#### 兑换与聚合器

AMM池子与兑换聚合器，把链上兑换映射为现货交易函数：`Uniswap`、`Jupiter`、`KyberSwap`、`1inch`、`OKX DEX`。

#### Hyperliquid

```Hyperliquid```（现货）：Hyperliquid链上订单簿的现货市场。行情与账户查询只需要钱包地址；下单、撤单、改单由API钱包（代理钱包）私钥做EIP-712签名后提交，不需要链上gas。永续合约与HIP-3、HIP-4（Outcome）品种由Futures_Hyperliquid交易所对象负责。

```Futures_Hyperliquid```（期货）：Hyperliquid链上订单簿的USDC保证金永续合约，包括主dex的永续、HIP-3（由builder部署的dex上的永续，代码带```dex:```前缀）以及HIP-4 Outcome（预测）品种。行情与账户查询只需要钱包地址；下单、撤单、改单、设置杠杆由API钱包（代理钱包）私钥做EIP-712签名后提交，不需要链上gas。现货由Hyperliquid交易所对象负责。

参考[Hyperliquid 使用指南](https://www.fmz.com/digest-topic/10574)。

##### 名称与配置

| ```exchange.GetName()``` | 类型 | 别名 |
| - | - | - |
| ```Hyperliquid``` | 现货 | Hyperliquid现货 |
| ```Futures_Hyperliquid``` | 期货 | Hyperliquid期货、HIP-3、HIP-4 |

✓ 表示该交易所对象有这个配置项。

| 配置项 | ```Hyperliquid``` | ```Futures_Hyperliquid``` | 必填 | 默认值 | 说明 |
| - | - | - | - | - | - |
| 钱包地址 | ✓ | ✓ | 是 | — | 主账户钱包地址（```0x```开头），行情以外的所有查询都以它为```user```。 |
| 钱包私钥 | ✓ | ✓ | 否 | — | 主账户私钥，可选。只用于签名转账类动作（通过```exchange.IO("api", "POST", "/exchange", ...)```发送的```usdSend```、```withdraw3```等），下单不需要。 |
| API钱包私钥 | ✓ |  | 是 | — | 在Hyperliquid网页「API」页面创建的API钱包（代理钱包）私钥，用于签名下单、撤单、改单。不填时只能查询行情和账户。 |
| 模拟盘（测试网） | ✓ | ✓ | 否 | 不勾选 | 勾选后使用Hyperliquid测试网：接口地址换成```https://api.hyperliquid-testnet.xyz```，交易与转账按测试网签名（```source```为```b```）。配置了节点地址时仍使用该地址，签名网络按勾选。 |
| API钱包私钥 |  | ✓ | 是 | — | 在Hyperliquid网页「API」页面创建的API钱包（代理钱包）私钥，用于签名下单、撤单、改单、设置杠杆。不填时只能查询行情和账户。 |

##### 交易对与合约代码

###### ```Hyperliquid```（现货）

交易对示例：```HYPE_USDC```、```PURR_USDC```

交易对写作```币名_计价币```，币名取Hyperliquid现货代币名（例如```HYPE```、```PURR```；跨链资产按交易所的代币名书写，如```UBTC```），不区分大小写。交易所内部的```@1```、```@2```这类交易对名由连接器按现货元数据换算，不需要直接使用。

###### ```Futures_Hyperliquid```（期货）

交易对示例：```BTC_USD```、```xyz:XYZ100_USD```、```BTC-above-100k---Dec_USD```

永续合约的交易对写作```币名_USD```（也接受```币名_USDC```，返回的品种代码统一为```USD```），保证金是USDC，例如```BTC_USD.swap```。币名大小写由连接器按交易所的品种表还原（如```kPEPE```）。HIP-3品种的交易对带dex前缀，前缀保持小写，例如```xyz:XYZ100_USD.swap```。

HIP-4 Outcome品种的交易对为市场名称（空格、```/```换成```-```）加```_USD```，合约代码为结果方的名称，例如```BTC-above-100k---Dec_USD.Yes```；多个市场同名时，名称后追加```-市场编号```区分（如```Recurring-1399_USD.Yes```），只写名称会报歧义错误。可用的Outcome品种代码见```exchange.GetMarkets()```。

| 合约代码 | 说明 |
| - | - |
| ```swap``` | 永续合约，主dex与HIP-3品种都只有永续。 |

没有交割合约。Outcome品种的合约代码是结果方名称（如```Yes```、```No```），不是```swap```。

##### 专属IO指令

###### ```Hyperliquid```（现货）

| 指令 | 参数 | 说明 | 返回值 |
| - | - | - | - |
| ```walletAddress``` | address | 设置只读查询（资产、订单、历史订单）使用的地址，可以查询其它地址的资产；不改变签名下单的钱包。要恢复查询本账户，传回配置的钱包地址。 | 设置的地址。 |
| ```vaultAddress``` | address | 以金库或子账户的身份下单、撤单、改单（地址进入签名与请求体），空字符串取消。查询仍使用钱包地址，查询金库的资产与订单需要同时用```walletAddress```设置为金库地址。 | 设置的地址。 |
| ```expiresAfter``` | timestamp | 设置之后所有签名动作（下单、撤单、改单等）携带的```expiresAfter```：毫秒级Unix时间戳，超过这个时间交易所拒绝该动作；0取消（默认）。设置值一直生效，过期后的动作都会被拒绝，需要重新设置或改回0。 | 设置的值。 |
| ```source``` | "a" \| "b" | 签名使用的网络：```a```为主网（默认；配置勾选「模拟盘（测试网）」时为```b```），```b```为测试网。（详见表下） | 设置的值。 |
| ```api``` | method, path[, params[, body]] | 直接调用Hyperliquid接口。（详见表下） | 交易所的原始应答。 |

表中长说明的其余部分：

- ```source```：影响交易类动作Agent签名的```source```字段，以及转账类动作（```usdSend```、```spotSend```、```withdraw3```等）EIP-712签名的chainId（主网Arbitrum 42161，测试网Arbitrum Sepolia 421614）。不改变接口地址，连接测试网还需要用```exchange.IO("base", "https://api.hyperliquid-testnet.xyz")```切换。
- ```api```：```POST```到```/exchange```时，参数是一个action对象，连接器自动加nonce并签名：转账类动作（```usdSend```、```spotSend```、```withdraw3```、```usdClassTransfer```、```approveAgent```、```approveBuilderFee```、```userSetAbstraction```）用钱包私钥```WalletPrivateKey```签名，动作里的```hyperliquidChain```等字段需要自己填写；其它动作用API钱包私钥签名。其它路径（如```POST /info```）原样发送，不签名。

通用指令```base```、```currency```见`exchange.IO`。

###### ```Futures_Hyperliquid```（期货）

| 指令 | 参数 | 说明 | 返回值 |
| - | - | - | - |
| ```cross``` | bool | 全仓（true，默认）/逐仓（false）。只在连接器里记录，下次调用```exchange.SetMarginLevel()```时随杠杆一起提交，调用本指令本身不发请求。 | ```cross```或```isolated```。 |
| ```dex``` | name | 设置默认的HIP-3 dex名称，空字符串为主dex。（详见表下） | 设置的dex名称。 |
| ```walletAddress``` | address | 设置只读查询（账户、持仓、订单）使用的地址，可以查询其它地址的持仓；不改变签名下单的钱包。要恢复查询本账户，传回配置的钱包地址。 | 设置的地址。 |
| ```vaultAddress``` | address | 以金库或子账户的身份下单、撤单、改单、设置杠杆（地址进入签名与请求体），空字符串取消。查询仍使用钱包地址，查询金库的账户与持仓需要同时用```walletAddress```设置为金库地址。 | 设置的地址。 |
| ```expiresAfter``` | timestamp | 设置之后所有签名动作（下单、撤单、改单、设置杠杆等）携带的```expiresAfter```：毫秒级Unix时间戳，超过这个时间交易所拒绝该动作；0取消（默认）。设置值一直生效，过期后的动作都会被拒绝，需要重新设置或改回0。 | 设置的值。 |
| ```source``` | "a" \| "b" | 签名使用的网络：```a```为主网（默认；配置勾选「模拟盘（测试网）」时为```b```），```b```为测试网。（详见表下） | 设置的值。 |
| ```split``` | symbol, amount | HIP-4 Outcome拆分（```splitOutcome```动作）：按```amount```为```symbol```所属的Outcome拆分出各结果方的头寸。（详见表下） | 交易所的原始应答（```status```为```ok```）。 |
| ```merge``` | symbol[, amount] | HIP-4 Outcome合并（```mergeOutcome```动作）：把```symbol```所属Outcome各结果方的头寸合并回去，```amount```可省略。 | 交易所的原始应答（```status```为```ok```）。 |
| ```mergeQuestion``` | symbol[, amount] | HIP-4按问题合并（```mergeQuestion```动作）：对```symbol```所属Outcome所在的问题（question）做合并，```amount```可省略。该Outcome不属于任何问题时报错。 | 交易所的原始应答（```status```为```ok```）。 |
| ```negate``` | symbol, amount | HIP-4取反（```negateOutcome```动作）：在```symbol```所属的问题中对该Outcome做取反转换，```amount```必须大于0。该Outcome不属于任何问题时报错。 | 交易所的原始应答（```status```为```ok```）。 |
| ```api``` | method, path[, params[, body]] | 直接调用Hyperliquid接口。（详见表下） | 交易所的原始应答。 |

表中长说明的其余部分：

- ```dex```：设置后，不带品种的范围查询（```GetPositions()```、```GetOrders()```、```GetConditionOrders()```、```GetTickers()```、```GetMarkets()```）只查这个dex；不设置时这些查询遍历全部dex汇总。带品种的调用总是按品种自身的dex前缀。
- ```source```：影响交易类动作Agent签名的```source```字段，以及转账类动作（```usdSend```、```withdraw3```、```usdClassTransfer```等）EIP-712签名的chainId（主网Arbitrum 42161，测试网Arbitrum Sepolia 421614）。不改变接口地址，连接测试网还需要用```exchange.IO("base", "https://api.hyperliquid-testnet.xyz")```切换；测试网没有HIP-3，范围查询只查主dex。
- ```split```：```symbol```为Outcome品种代码（如```BTC-above-100k---Dec_USD.Yes```），写法与行情、下单相同：同名市场写带```-市场编号```的代码（如```Recurring-1399_USD.Yes```），只写名称报歧义错误；```merge```、```mergeQuestion```、```negate```的```symbol```同此规则。```amount```必须大于0。
- ```api```：```POST```到```/exchange```时，参数是一个action对象，连接器自动加nonce并签名：转账类动作（```usdSend```、```spotSend```、```withdraw3```、```usdClassTransfer```、```approveAgent```、```approveBuilderFee```、```userSetAbstraction```）用钱包私钥```WalletPrivateKey```签名，动作里的```hyperliquidChain```等字段需要自己填写；其它动作用API钱包私钥签名。其它路径（如```POST /info```）原样发送，不签名。

通用指令```base```、```currency```见`exchange.IO`。

##### 函数支持差异

###### ```Hyperliquid```（现货）

不支持（调用时报错并返回空值）：`exchange.CreateConditionOrder`、`exchange.ModifyConditionOrder`、`exchange.CancelConditionOrder`、`exchange.GetConditionOrder`、`exchange.GetConditionOrders`、`exchange.GetHistoryConditionOrders`。

以回退方式支持：

- `exchange.GetRecords`：原生周期为1分钟、3分钟、5分钟、15分钟、30分钟、1小时、2小时、4小时、8小时、12小时、1天、3天、1周、1月；其它周期由托管者合成。

###### ```Futures_Hyperliquid```（期货）

没有不支持的标准函数。

以回退方式支持：

- `exchange.GetRecords`：原生周期为1分钟、3分钟、5分钟、15分钟、30分钟、1小时、2小时、4小时、8小时、12小时、1天、3天、1周；其它周期由托管者合成。Outcome品种没有K线。

##### 保证金、账户与模拟盘

###### ```Futures_Hyperliquid```（期货）

保证金模式：用```exchange.IO("cross", bool)```选择全仓/逐仓，在下一次```exchange.SetMarginLevel()```时随杠杆一起提交（交易所的```updateLeverage```动作）；杠杆向下取整为整数。HIP-3品种的保证金按dex分账。

持仓模式：只有单向持仓。平仓单（```closebuy```、```closesell```）以只减仓方式提交。

账户：账户为统一账户或组合保证金模式时，```exchange.GetAccount()```的余额与权益取现货USDC余额，未实现盈亏取永续账户；普通账户取永续账户（HIP-3按当前品种所在的dex）。余额币为USDC。

##### 注意事项

###### ```Hyperliquid```（现货）

- 市价单按中间价±0.5%作为限价、以IOC方式提交；市价买单的数量是要买入的币数，不是计价币金额。
- ```exchange.ModifyOrder()```成功后订单ID会改变，返回值是新的订单ID。
- ```exchange.GetTicker()```的```Buy```、```Sell```为盘口买一、卖一（一侧没有挂单时用中间价），```Last```、```High```、```Low```都是中间价，交易所没有24小时最高、最低价；```exchange.GetTickers()```的```Buy```、```Sell```也是中间价。
- ```exchange.GetHistoryOrders()```只能取交易所返回的最近订单，不支持```since```参数，传入大于0的```since```会报错。

###### ```Futures_Hyperliquid```（期货）

- 市价单按中间价±0.5%作为限价、以IOC方式提交；Outcome品种为中间价±1%（限制在0.001到0.999之间）。条件单触发后按市价执行时同样按中间价±0.5%定价。
- 条件单支持止盈、止损，不支持OCO；止盈、止损各是一张独立的触发单。```exchange.ModifyOrder()```、```exchange.ModifyConditionOrder()```成功后订单ID会改变，返回值是新的订单ID。
- ```exchange.GetTicker()```、```exchange.GetTickers()```的```Last```为中间价，```Buy```、```Sell```为交易所给出的买、卖冲击价（不是盘口买一、卖一，需要时用```exchange.GetDepth()```），```High```、```Low```也取这两个冲击价，交易所没有24小时最高、最低价。
- ```exchange.GetFundings()```：主dex取预测资金费率（每小时结算）；HIP-3品种需要传入品种代码，返回最近24小时的资金费率记录。
- ```exchange.GetHistoryOrders()```、```exchange.GetHistoryConditionOrders()```只能取交易所返回的最近订单，不支持```since```参数，传入大于0的```since```会报错。
- HIP-4 Outcome品种是现货式头寸：用买入、卖出交易（下单数量为整数），不支持只减仓，平仓单（```closebuy```、```closesell```）会报错；持仓来自现货账户中的Outcome代币。Outcome品种没有K线、资金费率，```GetTicker()```的```Last```为中间价，```Buy```、```Sell```为0。

#### Lighter

zk rollup上的永续合约DEX，以USDC计价和结算。交易所对象连接Lighter的永续合约：下单、改单、撤单和设置杠杆都是用API密钥私钥签名的L2交易，查询挂单、历史订单要用同一把私钥生成的鉴权令牌。接入前需要在Lighter创建API密钥，并记下API密钥索引与账户索引。

##### 名称与配置

```exchange.GetName()```：```Futures_Lighter```（期货）；别名：zkLighter。

| 配置项 | 必填 | 默认值 | 说明 |
| - | - | - | - |
| API密钥私钥 | 是 | — | 在Lighter创建的API密钥私钥（40字节十六进制，可带```0x```前缀），用于签名L2交易和生成鉴权令牌。 |
| API密钥索引 | 是 | — | API密钥的索引号，范围3-254（0-2为系统保留） |
| 账户索引 | 是 | — | Lighter账户索引，用于标识主账户或子账户 |
| 模拟盘 | 否 | 不勾选 | 勾选后连接Lighter测试网。 |

##### 交易对与合约代码

交易对示例：```BTC_USDC```、```ETH_USDC```

只有USDC计价的永续合约，交易对写作```BTC_USDC```，完整代码形如```BTC_USDC.swap```，其它计价币报错。交易对不区分大小写，返回数据中统一为大写。

| 合约代码 | 说明 |
| - | - |
| ```swap``` | USDC永续合约（唯一的合约类型）。 |

Lighter只有永续合约，```swap```以外的合约代码会报错。

##### 专属IO指令

| 指令 | 参数 | 说明 | 返回值 |
| - | - | - | - |
| ```cross``` | bool[, symbol] | 全仓（true）/逐仓（false），不传```symbol```时作用于当前合约。（详见表下） | ```{symbol, leverage, marginMode, initialMarginFraction, txHash, ok}```，```txHash```为这笔链上交易的哈希。 |
| ```expiry``` | number | 之后所下限价单和条件单的存活时长（毫秒，必须大于0），默认29天（交易所允许的上限）；订单的过期时间为下单时刻加10分钟再加该时长。市价单不受影响。 | ```true``` |
| ```api``` | method, path[, params[, raw]] | 直接调用Lighter接口，只支持```GET```、```POST```。（详见表下） | 交易所的原始应答；应答```code```不是200时报错。 |

表中长说明的其余部分：

- ```cross```：Lighter的保证金模式与杠杆在同一笔链上交易里设置，这笔交易同时写入该品种当前的杠杆（先读交易所账户数据中该品种的设置；本次运行60秒内刚设置过的以刚设置的为准；都没有时取该市场的缺省杠杆）。
- ```api```：默认附带用API密钥私钥生成的鉴权令牌（需要填写私钥与账户索引）；签名参数传```false```时不带令牌，只能用于公开```GET```接口。```raw```不是请求体而是参数表（JSON对象或```a=1&b=2```），非空时整体替换```params```；```GET```编入查询串，```POST```编成表单。不会替调用方签名L2交易。

通用指令```base```、```currency```见`exchange.IO`。

##### 函数支持差异

没有不支持的标准函数。

以回退方式支持：

- `exchange.GetRecords`：原生周期为1分钟、5分钟、15分钟、30分钟、1小时、4小时、12小时、1天、1周；其它周期由托管者合成。

##### 保证金、账户与模拟盘

保证金模式：用```exchange.IO("cross", bool)```按合约切换全仓/逐仓，用```exchange.SetMarginLevel()```设置杠杆。两者在Lighter是同一笔链上交易（UpdateLeverage），每次调用都会发出一笔交易，并且总是同时写入杠杆和保证金模式，另一项保持该品种当前的值：```exchange.SetMarginLevel()```保留当前保证金模式，```exchange.IO("cross", ...)```保留当前杠杆。当前值读取交易所账户数据中该品种的设置（没有持仓的品种也有）；本次运行60秒内刚设置过的以刚设置的为准（交易所数据更新有延迟）；都没有时为该市场的缺省杠杆、全仓。```exchange.SetMarginLevel()```也可在附加参数中传```{marginMode: "isolated"}```（或```cross```）同时指定保证金模式。持仓的```MarginLevel```由交易所持仓数据中的初始保证金率换算。

持仓模式：单向（净）持仓，不支持双向持仓。

账户：「账户索引」决定交易的是主账户还是子账户；账户和持仓按账户索引查询，资产只有USDC一种。

模拟盘：勾选「模拟盘」连接Lighter测试网（```https://testnet.zklighter.elliot.ai```）。也可以用```exchange.SetBase()```（或```exchange.IO("base", url)```）切换接口地址：地址中含```testnet```时按测试网签名，否则按主网签名。

##### 注意事项

| 函数 | Futures_Lighter的行为 |
| - | - |
| exchange.GetTicker() | 买一、卖一取自盘口；交易所行情不带时间戳，```Time```为本地时间 |
| exchange.GetTickers() | ```Buy```、```Sell```是各品种的最新成交价（交易所没有批量盘口接口）；需要买一、卖一价时用```exchange.GetTicker()```或```exchange.GetDepth()```。最新价、24小时最高最低价和成交量都为0的占位品种不返回 |
| exchange.GetDepth() | 交易所返回逐笔挂单，每笔挂单单独成一档、不按价格合并，同一价格可能出现多档 |
| exchange.GetFundings() | ```Rate```为交易所费率除以8（每小时费率），```Interval```为1小时，```Time```为下一个整点 |
| exchange.CreateOrder() | 限价单支持GTC（按```exchange.IO("expiry", ...)```的存活时长挂单）、IOC和只做Maker，不支持FOK。市价单是以下单时对手一价为限价的IOC单（买单不高于卖一、卖单不低于买一），没有额外滑点，对手一价上的挂单量不足时剩余部分撤销 |
| exchange.CreateConditionOrder() | 只支持止盈、止损，不支持OCO。带委托价时为限价条件单；委托价为-1（市价）时触发后按市价成交（IOC），最差成交价为触发价±5%（买单上浮、卖单下浮），可在附加参数中用```{slippage: 0.1}```调整 |
| exchange.ModifyOrder() | 原地改单，订单ID不变；不传的价格或数量沿用原值 |
| exchange.GetOrders()、exchange.GetConditionOrders() | 交易所接口必须指定品种：不传或传空字符串时只查当前品种。```GetOrders```只返回限价、市价单，```GetConditionOrders```只返回止盈止损单（TWAP等其它类型不出现在两者中）；不支持```USDC.swap```这类范围参数 |
| exchange.GetOrder() | 只在挂单和该品种最近100条历史订单中查找，更早的订单返回空值 |
| exchange.ModifyConditionOrder() | 原地修改数量、触发价和委托价，订单ID不变。不能改变限价/市价类型：限价条件单传委托价-1、市价条件单传正数委托价时报错，需要撤销后重新创建；市价条件单的最差成交价按新的触发价重新计算 |
| exchange.GetHistoryOrders()、exchange.GetHistoryConditionOrders() | 交易所接口必须指定品种：不传时查当前品种，传空字符串或范围报错；不支持```since```参数，传入时报错；不传```limit```时分别返回最近100条、500条 |

#### edgeX

永续合约DEX（V2接口），合约以USDC计价。私有接口使用edgeX Perps V2的API Key、API Secret、API Passphrase做HMAC认证，下单另用交易签名私钥（SDK Signer）做EIP-712签名；配置交易所对象前需要在edgeX创建这两套凭据并记下账户ID。

##### 名称与配置

```exchange.GetName()```：```Futures_EdgeX```（期货）；别名：EdgeX。

| 配置项 | 必填 | 说明 |
| - | - | - |
| AccountID | 是 | edgeX账户ID（数字）。 |
| API Key | 是 | edgeX Perps V2的API Key，与API Secret、API Passphrase一起用于私有接口的HMAC认证。 |
| API Secret | 是 | edgeX Perps V2的API Secret（HMAC密钥）。 |
| API Passphrase | 是 | edgeX Perps V2的API Passphrase。 |
| Trading Private Key | 是 | edgeX Perps V2 SDK Signer的私钥（十六进制），用于订单的EIP-712签名；IO指令```calcOrderHashAndSign```也用它做Stark签名。 |

##### 交易对与合约代码

交易对示例：```BTC_USDC```、```ETH_USDC```

edgeX的永续合约都以USDC计价，交易对写作```BTC_USDC```等，完整代码形如```BTC_USDC.swap```；写成```BTC_USDT```、```BTC_USD```会报错```symbol not found: BTCUSDT```（或```BTCUSD```）。```exchange.SetCurrency()```保留设置时的大小写（```exchange.GetCurrency()```原样返回），查找合约时不区分大小写；订单、持仓等由交易所返回的数据中品种代码为大写，```exchange.GetTicker()```返回的```Symbol```沿用传入或当前设置的写法，建议统一用大写。

| 合约代码 | 说明 |
| - | - |
| ```swap``` | USDC永续合约（唯一的合约类型）。 |

edgeX只有永续合约，```swap```以外的合约代码会报错。

##### 专属IO指令

| 指令 | 参数 | 说明 | 返回值 |
| - | - | - | - |
| ```calcOrderHashAndSign``` | json | 旧版（StarkEx）限价单签名，仅供旧策略继续调用：计算LIMIT_ORDER_WITH_FEES的Pedersen哈希，并用配置的TradingPrivateKey做Stark ECDSA签名。（详见表下） | 128个字符的小写十六进制字符串（r、s各64个字符，不带```0x```）。 |

表中长说明的其余部分：

- ```calcOrderHashAndSign```：参数是含10个键的JSON字符串或对象，见注意事项。edgeX V2下单使用EIP-712签名，不接受这个签名，本交易所对象下单也不用它。

通用指令```api```、```base```、```currency```见`exchange.IO`。

##### 函数支持差异

不支持（调用时报错并返回空值）：`exchange.GetTickers`、`exchange.GetTrades`、`exchange.ModifyOrder`、`exchange.ModifyConditionOrder`、`exchange.SetMarginLevel`。

以回退方式支持：

- `exchange.GetRecords`：原生周期为1分钟、5分钟、15分钟、30分钟、1小时、2小时、4小时、6小时、8小时、12小时、1天、1周、1月；其它60秒整数倍的周期由托管者用原生K线合成，其余周期（如秒级）不可用（交易所没有成交接口）。

##### 保证金、账户与模拟盘

保证金模式：edgeX为全仓保证金，持仓的```MarginLevel```为交易所返回的当前杠杆。不支持```exchange.SetMarginLevel()```，杠杆需要在edgeX上自行设置。

持仓模式：单向（净）持仓。

账户：账户、持仓、订单都按配置的「AccountID」查询。```exchange.GetAssets()```按币种列出抵押资产，```exchange.GetAccount()```取当前交易对计价币（USDC）那一行。

##### 注意事项

| 函数 | Futures_EdgeX的行为 |
| - | - |
| exchange.GetTicker() | 行情接口不含买一、卖一，每次调用另取一次盘口填写（共两次请求），盘口请求失败时整个调用失败 |
| exchange.GetFundings() | 传入品种（如```BTC_USDC.swap```）返回该合约一条；不传参数时查询当前计价币的全部可交易永续（如```USDC.swap```，也可直接传这类范围）。edgeX没有批量资金费率接口，范围查询每个合约发一次请求，一百多个合约耗时十几秒，频繁调用请传具体品种。```Rate```为交易所的预测费率（下一期），```Time```为下一次结算时间 |
| exchange.CreateOrder() | 下单数量以币为单位（1张=1个币）。限价单支持GTC、IOC、FOK和只做Maker；市价单默认为IOC，不能设为只做Maker，并按预言机价格限定成交价格：买单不高于其1.2倍，卖单不低于其0.8倍 |
| exchange.CreateConditionOrder() | 只支持止盈、止损，不支持OCO（止盈、止损分两张下），按最新成交价触发；委托价为-1（市价）时触发后按市价成交，价格界限按创建时的预言机价格计算。修改条件单需要先撤销再重新创建 |
| exchange.GetOrders()、exchange.GetConditionOrders() | 不传品种时返回所有合约的挂单。条件单与普通单在同一张订单表里，未触发的条件单也会出现在```exchange.GetOrders()```的结果中 |
| exchange.GetHistoryOrders() | 不传```limit```时最多返回100条；结果中包含已结束的条件单 |
| exchange.GetHistoryConditionOrders() | 第三个参数沿用旧版语义，不表示条数：大于1e12时视为截止时间（毫秒时间戳），否则忽略；返回条数不受限制。不传```since```时会翻遍该合约的全部历史订单，超过约1万条时报错，建议传入```since``` |

```exchange.IO("calcOrderHashAndSign", json)```的参数必须恰好包含10个键：```assetIdSynthetic```、```assetIdCollateral```、```assetIdFee```（十六进制）、```isBuyingSynthetic```（布尔）、```amountSynthetic```、```amountCollateral```、```amountFee```、```nonce```、```accountID```、```expirationTimestamp```（整数）。缺键或值格式错误报```argument X error```，多出键报```argument error```。签名私钥是配置的TradingPrivateKey（按Stark私钥解释），不是旧版账户的Stark私钥；签名随机数是确定性的（RFC 6979），同一输入每次签名相同，与旧托管者签出的值不同但同样有效。

#### Aster

```Aster```（现货）：Aster现货（接口地址```https://sapi.asterdex.com```）。私有接口使用钱包签名（EIP-712）：配置主账户钱包地址，以及在Aster上为该账户授权的API签名钱包的地址和私钥，不需要API Key。永续合约使用Futures_Aster交易所对象。

```Futures_ApolloX```（期货）：ApolloX已并入Aster并更名。Futures_ApolloX用API Key（HMAC签名）接入同一交易所的旧版合约接口（```https://fapi.apollox.finance```，币安U本位同构的v1/v2接口），只有永续合约。用钱包签名接入v3接口的是Futures_Aster交易所对象。

```Futures_Aster```（期货）：Aster永续合约（接口地址```https://fapi.asterdex.com```，币安U本位同构的v3接口）。私有接口使用钱包签名（EIP-712）：配置主账户钱包地址，以及在Aster上为该账户授权的API签名钱包的地址和私钥，不需要API Key。用API Key（HMAC）接入同一交易所旧版接口的是Futures_ApolloX交易所对象；现货使用Aster交易所对象。

##### 名称与配置

| ```exchange.GetName()``` | 类型 | 别名 |
| - | - | - |
| ```Aster``` | 现货 | AsterDEX |
| ```Futures_ApolloX``` | 期货 | ApolloX、ApolloX DEX |
| ```Futures_Aster``` | 期货 | Aster期货 |

✓ 表示该交易所对象有这个配置项。

| 配置项 | ```Aster``` | ```Futures_ApolloX``` | ```Futures_Aster``` | 必填 | 说明 |
| - | - | - | - | - | - |
| 主账户地址 | ✓ |  | ✓ | 是 | 主账户（资产所在账户）的钱包地址。 |
| 签名钱包地址 | ✓ |  | ✓ | 是 | 在Aster上为主账户授权的API签名钱包（代理钱包）地址。 |
| 签名钱包私钥 | ✓ |  | ✓ | 是 | 上述签名钱包的私钥，用于对私有请求签名。 |
| Access Key |  | ✓ |  | 是 | 在交易所API管理中创建的API Key。 |
| Secret Key |  | ✓ |  | 是 | 与API Key配对的Secret Key，用于HMAC签名。 |

##### 交易对与合约代码

###### 全部交易所对象

交易对示例：```BTC_USDT```、```ETH_USDT```

###### ```Futures_ApolloX```（期货）、```Futures_Aster```（期货）

交易对按交易所给出的交易币、计价币拼成```BASE_QUOTE```；计价币主要是USDT，也有USD1等，以```exchange.GetMarkets()```为准。

| 合约代码 | 说明 |
| - | - |
| ```swap``` | 永续合约，完整品种代码形如```BTC_USDT.swap```。 |

只有永续合约，其它合约代码报错。

###### ```Aster```（现货）

交易对按交易所给出的交易币、计价币拼成```BASE_QUOTE```（大写）；计价币除USDT外还有USD1等，以```exchange.GetMarkets()```为准。现货交易对不能带合约后缀。

##### 专属IO指令

###### ```Aster```（现货）

没有专属指令，通用指令见`exchange.IO`。

###### ```Futures_ApolloX```（期货）

| 指令 | 参数 | 说明 | 返回值 |
| - | - | - | - |
| ```cross``` | bool[, symbol] | 全仓（true）/逐仓（false），按合约设置；不传```symbol```时使用当前合约。同一实盘中已成功把该合约设为相同模式时直接返回，不再请求交易所。 | 成功也返回空值，需要确认时调用后读取GetLastError()。合约本来就处于目标模式时，首次设置交易所可能报错（币安系```-4046```）。 |
| ```dual``` | bool | 双向（true）/单向（false）持仓，账户级设置。 | 成功返回设置的布尔值。 |

通用指令```api```、```base```、```currency```见`exchange.IO`。

###### ```Futures_Aster```（期货）

| 指令 | 参数 | 说明 | 返回值 |
| - | - | - | - |
| ```cross``` | bool[, symbol] | 全仓（true）/逐仓（false），按合约设置；不传```symbol```时使用当前合约。 | 成功也返回空值，需要确认时调用后读取GetLastError()。账户已处于目标模式时交易所报错（```-4046```）。 |
| ```dual``` | bool | 双向（true）/单向（false）持仓，账户级设置。 | 成功也返回空值，需要确认时调用后读取GetLastError()。 |

通用指令```api```、```base```、```currency```见`exchange.IO`。

##### 函数支持差异

###### 全部交易所对象

不支持（调用时报错并返回空值）：`exchange.ModifyOrder`、`exchange.ModifyConditionOrder`。

###### ```Futures_ApolloX```（期货）、```Futures_Aster```（期货）

以回退方式支持：

- `exchange.GetRecords`：原生周期为1分钟、3分钟、5分钟、15分钟、30分钟、1小时、2小时、4小时、6小时、8小时、12小时、1天、3天、1周、1月；其它周期由托管者合成。

###### ```Aster```（现货）

以回退方式支持：

- `exchange.GetRecords`：原生周期为1秒、1分钟、3分钟、5分钟、15分钟、30分钟、1小时、2小时、4小时、6小时、8小时、12小时、1天、3天、1周、1月；其它周期由托管者合成。

##### 保证金、账户与模拟盘

###### ```Futures_ApolloX```（期货）、```Futures_Aster```（期货）

持仓模式：用```exchange.IO("dual", bool)```切换双向/单向持仓。首次下单前查询一次账户的持仓模式并缓存，双向持仓下单时自动带```positionSide```（平仓不带```reduceOnly```），也可以在下单附加参数中显式传```positionSide```；下单失败后下一单重新查询持仓模式。

###### ```Futures_ApolloX```（期货）

保证金模式：用```exchange.IO("cross", bool)```按合约切换全仓/逐仓；```exchange.SetMarginLevel()```按合约设置杠杆。

###### ```Futures_Aster```（期货）

保证金模式：用```exchange.IO("cross", bool)```按合约切换全仓/逐仓；```exchange.SetMarginLevel()```按合约设置杠杆。账户开启联合保证金（Multi-Assets）模式时，交易所拒绝切换为逐仓。

##### 注意事项

###### ```Aster```（现货）、```Futures_Aster```（期货）

- 用```exchange.IO("base", url)```切换到地址中含```testnet```的测试网时，签名自动改用测试网的链ID。

###### ```Futures_ApolloX```（期货）、```Futures_Aster```（期货）

- 下单量是交易币数量（合约面值为1个交易币），市价买单同样按交易币数量下单。
- 条件单只支持止盈、止损单，不支持OCO，需要时分别创建止盈单和止损单；不支持修改条件单（```exchange.ModifyConditionOrder()```），需要先撤销再重新创建。
- ```exchange.GetHistoryOrders()```、```exchange.GetHistoryConditionOrders()```必须指定合约。

###### ```Aster```（现货）

- 市价买单的下单量是计价币金额（按Aster的```quoteOrderQty```下单），市价卖单是交易币数量。条件单不论买卖，数量一律是交易币数量。
- 条件单只支持止盈、止损单，不支持OCO，需要时分别创建止盈单和止损单；不支持修改条件单（```exchange.ModifyConditionOrder()```），需要先撤销再重新创建。```exchange.GetConditionOrder()```传入普通订单的编号时报错（该订单不是条件单）。
- ```exchange.GetHistoryOrders()```、```exchange.GetHistoryConditionOrders()```必须指定交易对。

#### Aevo

USDC永续合约与USDC期权。查询、撤单、设置杠杆使用API Key签名；下单、改单、条件单还要用注册在Aevo账户上的签名密钥（配置项「Signing Key」）对订单做EIP-712签名。

##### 名称与配置

```exchange.GetName()```：```Futures_Aevo```（期货）。

| 配置项 | 必填 | 说明 |
| - | - | - |
| Access Key | 是 | — |
| Secret Key | 是 | — |
| Signing Key | 是 | Aevo账户上注册的EIP-712 API签名私钥（```0x```加64位十六进制），用于下单、改单和条件单；也可以运行时用```exchange.IO("signingKey", key)```设置。 |

##### 交易对与合约代码

交易对示例：```BTC_USDC```、```ETH_USDC```

Aevo以USDC计价和结算，交易对写作```ETH_USDC```；计价币写成USDC以外的币会报错。

| 合约代码 | 说明 |
| - | - |
| ```swap``` | 永续合约（交易所代码```ETH-PERP```），完整品种代码形如```ETH_USDC.swap```。 |

Aevo没有交割合约，除```swap```与期权代码外的合约代码都会报错。

##### 专属IO指令

| 指令 | 参数 | 说明 | 返回值 |
| - | - | - | - |
| ```signingKey``` | string | 设置本交易所对象下单用的EIP-712签名私钥（```0x```加64位十六进制），覆盖配置项「Signing Key」，只在本次运行中有效。签名密钥在Aevo网页创建API Key时生成并注册到账户，有有效期，过期后需要重新生成。 | 该私钥对应的钱包地址，可以与Aevo网页上的签名密钥列表核对；私钥格式不对时报错。调用时不检查是否已注册，未注册的密钥在下单时报错。 |

通用指令```api```、```base```、```currency```见`exchange.IO`。

##### 函数支持差异

不支持（调用时报错并返回空值）：`exchange.GetTickers`。

以回退方式支持：

- `exchange.GetRecords`：交易所没有K线接口，由托管者用成交记录合成：首次调用只有最近成交覆盖的少量K线，随调用逐步累积。合约没有成交时为空。

##### 保证金、账户与模拟盘

保证金模式：Aevo是统一保证金账户，没有全仓/逐仓切换指令；```exchange.GetPositions()```的保证金模式按交易所返回（持仓的```margin_type```，缺省时取账户里该合约的设置），没有逐合约设置的期权持仓为全仓。```exchange.SetMarginLevel()```按永续合约设置杠杆，期权不支持。

持仓模式：只有单向（净）持仓，没有双向持仓。平仓单（```closebuy```、```closesell```）以只减仓（reduce-only）方式下单。

账户：```exchange.GetAccount()```的```Balance```为USDC可用余额，```FrozenBalance```为占用的初始保证金，```Equity```为账户权益；USDC以外的抵押品在```exchange.GetAssets()```中逐币列出。

##### 期权

支持Aevo的USDC期权，下单、撤单、查询与永续走同一套接口。限制：

- ```exchange.GetMarkets()```的结果包含期权合约（只列出交易中的合约），```exchange.SetContractType()```按其中的代码校验。
- ```exchange.GetTicker()```的```Last```为标记价格；无人报价时```Buy```、```Sell```为0；```Open```、```High```、```Low```为0。
- 不支持```exchange.SetMarginLevel()```、```exchange.GetFundings()```。
- 价格和数量按6位小数定点签名，小于0.000001的非零价格或数量会报错。

期权代码示例：```ETH-30JUN23-1600-C```、```ETH-24SEP27-2800-P```

期权代码为Aevo原生代码：标的-到期日（DDMMMYY）-行权价-C/P，C为看涨、P为看跌。期权以USDC结算，交易对设置为标的币加```_USDC```（标的必须与交易对的交易币一致），完整品种代码形如```ETH_USDC.ETH-30JUN23-1600-C```。

##### 注意事项

- 只支持限价单，市价单报错；条件单（止盈、止损）的委托价必须是限价，不支持市价止盈止损和OCO。
- ```exchange.ModifyOrder()```、```exchange.ModifyConditionOrder()```由交易所重新签发订单，返回新的订单号，此后应使用新订单号；```exchange.ModifyOrder()```沿用原订单的只减仓（reduce-only）属性。
- 永续合约```exchange.GetTicker()```的```Last```为标记价格、```Open```为24小时前的标记价格，没有最高价、最低价（```High```、```Low```为0），```Volume```为24小时成交张数。
- 资金费率每小时结算一次；```exchange.GetFundings()```只返回永续合约。
- ```exchange.GetHistoryOrders()```、```exchange.GetHistoryConditionOrders()```只能按单个品种查询，传空字符串（查询全部品种）会报错。

#### Pendle

```Pendle```（现货）：交易Pendle的PT（本金代币）和YT（收益代币）。一个交易所对象对应一条链上的一个钱包：市价单通过Pendle的兑换接口生成交易，限价单挂在Pendle的限价单簿上，交易与订单都由托管者用配置的私钥签名。支持Ethereum、Arbitrum、Base、BNB Chain、HyperEVM、Plasma、Robinhood、Monad、X Layer。

```Futures_Boros```（期货）：交易Pendle Boros的资金费率互换（收益率单位YU）：在Arbitrum上的链上订单簿里按固定年化利率买卖各永续交易所（Hyperliquid、Binance、OKX、Gate、KuCoin、Bybit、Lighter等）的资金费率，到期前每小时结算一次。一个交易所对象对应一个钱包的一个Boros子账户（全仓）。下单不花钱包的ETH：托管者用钱包私钥派生一个代理密钥，第一次下单时由钱包签名授权它，之后每笔订单由代理签名、经Pendle中继上链，中继费用从Boros账户的gas余额扣除。

##### 名称与配置

| ```exchange.GetName()``` | 类型 | 别名 |
| - | - | - |
| ```Pendle``` | 现货 | Pendle Finance、PT、YT |
| ```Futures_Boros``` | 期货 | Boros、Pendle Boros、Futures_Boros |

✓ 表示该交易所对象有这个配置项。

| 配置项 | ```Pendle``` | ```Futures_Boros``` | 必填 | 默认值 | 说明 |
| - | - | - | - | - | - |
| 链 | ✓ |  | 是 | ```Ethereum``` | 可选：```Ethereum```、```Arbitrum```、```Base```、```BNB Chain```、```HyperEVM```、```Plasma```、```Robinhood```、```Monad```、```X Layer``` |
| 钱包私钥 | ✓ |  | 是 | — | EVM钱包私钥（十六进制）。 |
| 节点地址 | ✓ |  | 否 | ```https://ethereum-rpc.publicnode.com,https://eth.drpc.org``` | RPC节点，多个用逗号分隔，某个节点出错时自动换下一个。选择链时自动填入该链的默认节点。 |
| 节点认证 | ✓ |  | 否 | — | 可选。RPC节点需要认证时填写：```Header-Name: value```形式的请求头，或Basic认证的值。 |
| 钱包私钥 |  | ✓ | 是 | — | EVM钱包私钥（十六进制）。托管者用它派生交易代理并签一次授权，充值、提现也用它签名。 |
| 子账户 |  | ✓ | 否 | ```0``` | Boros子账户编号，0为主账户（只有主账户能充值、提现），范围0到254。 |
| API地址 |  | ✓ | 否 | ```https://api-boros.pendle.finance/apis``` | Boros API地址，一般不用改。 |
| 节点地址 |  | ✓ | 否 | ```https://arb1.arbitrum.io/rpc,https://arbitrum-one-rpc.publicnode.com``` | Arbitrum RPC节点（充值、提现与读链上nonce用），多个用逗号分隔，某个节点出错时自动换下一个。 |

##### 交易对与合约代码

###### ```Pendle```（现货）

交易对示例：```PT-apyUSD-5NOV2026_apyUSD```、```YT-apyUSD-5NOV2026_USDC```

前半段是PT或YT的名称（含到期日，取自Pendle资产表，见```exchange.GetMarkets()```），后半段是计价币。价格是1个PT/YT值多少计价币。计价币可以是市场的底层资产、计价资产，或本链上Pendle能兑换的其它代币（市价单经聚合器），也可以写代币合约地址。交易对不转大写，按原样书写。

###### ```Futures_Boros```（期货）

交易对示例：```BTC_USDT```、```ETH_ETH```、```BTC_BTC```

交易对为```标的_保证金币```：标的是被交易资金费率的资产，保证金币是市场使用的抵押币（WBTC写作```BTC```、WETH写作```ETH```、USD₮0写作```USDT```，另有```BNB```、```HYPE```）。同一个市场名可以有不同保证金币的两个市场（如USDT保证金和BTC保证金的Hyperliquid BTC），用保证金币区分。价格是年化利率的小数（```0.065```即6.5%），可以为负；数量是YU，以保证金币计（USDT保证金的市场里1个YU = 1 USDT名义本金的资金费）。

合约代码是Boros的市场名换成下划线：```资金费率来源_品种_到期日```，如```HYPERLIQUID_BTC_30OCT2026```、```BINANCE_ETHUSDT_25DEC2026```，完整品种代码如```BTC_USDT.HYPERLIQUID_BTC_30OCT2026```；Boros原名（```HYPERLIQUID-BTC-30OCT2026```）也认。可用的市场见```exchange.GetMarkets()```（只列未到期的）。也可以写Boros的数字市场编号（如```206```）。

##### 专属IO指令

###### ```Pendle```（现货）

| 指令 | 参数 | 说明 | 返回值 |
| - | - | - | - |
| ```market``` | symbol | 查询交易对所在市场：到期时间、距到期年数、当前隐含年化、PT/YT/SY与底层资产、计价资产地址，以及1个计价币值多少计价资产（限价单换算用）。 | ```{symbol, market, name, kind, expiry, yearsToExpiry, impliedApy, pt, yt, sy, underlying, accounting, accountingPerQuote, chainId}``` |
| ```apy``` | symbol, price | 把PT/YT价格换算成隐含年化（与限价单同一换算）：计价币按SY汇率换成计价资产，PT价格 = (1+年化)^(−距到期年数)，YT价格 = 1 − PT价格。 | 隐含年化（0.16即16%）；价格无法对应年化（PT不低于1个计价资产、YT不在0到1之间）时返回空值。 |
| ```price``` | symbol, apy | ```apy```的反向换算：隐含年化换算成以计价币计的价格。 | 价格。 |
| ```slippage``` | [ratio] | 市价单的滑点保护比例，范围```[0, 0.5)```，默认```0.005```（0.5%），写进兑换交易。下单附加参数```slippage```覆盖本单。不传参数时查询。 | 当前滑点比例。 |
| ```orderExpiry``` | [seconds] | 限价单默认有效期（秒），默认604800（7天），不超过市场到期时间。下单附加参数```expiry```（秒或毫秒时间戳）单独指定。不传参数时查询。 | 当前有效期（秒）。 |
| ```cancelWait``` | [seconds] | 撤单时等待撤单交易上链的最长时间，默认30，范围0到600。等待超时```exchange.CancelOrder()```仍返回```true```，表示撤单已提交。不传参数时查询。 | 当前等待时间（秒）。 |
| ```approve``` | [mode] | 授权额度：```max```无限授权，```exact```只授权本次所需（默认）。兑换授权给Pendle Router，限价单授权给Pendle限价单合约。不传参数时查询。 | 当前模式。 |
| ```gasMultiplier``` | [x] | gasLimit = 估算的gas × x，范围1到5，默认1.2。不传参数时查询。 | 当前倍数。 |
| ```receipt``` | txHash[, waitMs] | 查询交易回执：状态、区块、gas与手续费；可等待到上链（最多10分钟）。查询兑换订单时传订单ID中逗号后面的交易哈希。 | ```{txHash, status, blockNumber, gasUsed, fee}```，```status```为```success```、```reverted```或```pending```。 |
| ```base``` | [url] | 不传参数时返回当前RPC节点地址；传入地址时切换节点（多个用逗号分隔），换节点后第一次请求会核对节点所在的链。 | 切换前的地址。 |
| ```address``` | — | 钱包地址。 | — |

通用指令```api```、```currency```见`exchange.IO`。

###### ```Futures_Boros```（期货）

| 指令 | 参数 | 说明 | 返回值 |
| - | - | - | - |
| ```agent``` | — | 查询交易代理：代理地址、子账户、授权到期时间（Unix秒，0为未授权）。只读；第一次下单时自动授权，授权剩不到1天时自动续期。 | ```{agent, accountId, expiry, approved}``` |
| ```approveAgent``` | — | 立即由钱包签名（重新）授权交易代理，有效30天。授权经Pendle中继上链，不花钱包的ETH。代理只能下单、撤单和付gas，不能提现。 | ```{agent, expiry}``` |
| ```gasBalance``` | — | Boros中继的gas余额（美元）。每笔下单、撤单约0.02到0.04美元，余额低于下限时中继拒绝提交。 | 余额（美元），可能为负（欠费）。 |
| ```topUpGas``` | usd[, currency] | 从全仓账户的现金付gas余额，```usd```为美元金额（不超过100），```currency```为用哪种保证金币付，默认```USDT```。 | ```{txHash, usd, paid, currency}``` |
| ```autoTopUp``` | [enabled[, usd]] | 自动付gas：开启时（默认），gas余额低于0.3美元则下单前在同一批调用里先从该市场保证金币的全仓现金付```usd```美元（默认1，另加欠费）。不传参数时查询。 | ```{enabled, usd}``` |
| ```slippage``` | [rate] | 市价单相对标记利率的最大偏离（小数利率，默认```0.01```即1个百分点），范围0到0.5。下单附加参数```slippage```覆盖本单。不传参数时查询。 | 当前值。 |
| ```base``` | [url] | 查询或切换Boros API地址（默认```https://api-boros.pendle.finance/apis```）。 | 切换前的地址。 |
| ```rpc``` | [url] | 查询或切换Arbitrum RPC节点（充值、提现与读链上nonce用），多个用逗号分隔。 | 切换前的地址。 |
| ```market``` | symbol | 市场的原始数据：费率、保证金参数、标记利率、底层资金费率、到期时间等。 | Boros ```/v1/markets/by-ids```的应答。 |
| ```tick``` | symbol, rate[, side] | 利率换算成限价tick：做多（```buy```，默认）取不高于该利率的最近一档，做空（```sell```）取不低于它的最近一档，与下单的取整相同。 | ```{market, marketId, tick, rate, tickStep}```，```rate```为该tick的实际利率。 |
| ```deposit``` | currency, amount | 钱包交易：把钱包里的保证金币充进Boros全仓账户（先授权给Boros Router），花钱包的ETH gas，等上链后返回。 | ```{txHash, currency, amount, accountId}``` |
| ```withdraw``` | currency, amount | 钱包交易：申请从全仓账户提现到钱包，只能从主账户（子账户0）提。冷却期（目前约15分钟）后由Boros自动到账；冷却中再申请会叠加数量并重新计时。 | ```{txHash, currency, amount, note}``` |
| ```cancelWithdraw``` | currency | 钱包交易：取消未完成的提现申请。 | ```{txHash, currency}``` |
| ```isolatedTransfer``` | symbol, amount | 在全仓账户与只能逐仓的市场的逐仓账户之间划现金：```amount```（保证金币）为正时从全仓划进逐仓，为负时划回全仓。经中继上链，扣gas余额。提现只能从全仓提，逐仓里的钱要先划回来。 | ```{txHash, symbol, amount, account}``` |
| ```wallet``` | — | 钱包（不是Boros账户）在Arbitrum上的ETH与各保证金币余额，充值前查看用。 | ```[{currency, amount, token}]``` |

通用指令```api```、```currency```见`exchange.IO`。

##### 函数支持差异

###### ```Pendle```（现货）

不支持（调用时报错并返回空值）：`exchange.GetTickers`、`exchange.GetRecords`、`exchange.GetTrades`、`exchange.ModifyOrder`、`exchange.CreateConditionOrder`、`exchange.ModifyConditionOrder`、`exchange.CancelConditionOrder`、`exchange.GetConditionOrder`、`exchange.GetConditionOrders`、`exchange.GetHistoryConditionOrders`。

###### ```Futures_Boros```（期货）

不支持（调用时报错并返回空值）：`exchange.GetTickers`、`exchange.SetMarginLevel`、`exchange.ModifyConditionOrder`。

##### 保证金、账户与模拟盘

###### ```Futures_Boros```（期货）

保证金模式：一般市场用全仓账户（每种保证金币一个，所有同币种市场共用）；只能逐仓交易的市场（如部分商品资金费率市场）自动用它的逐仓账户，保证金要先用```exchange.IO("isolatedTransfer", ...)```划进去，或下单时用附加参数```cashIn```随单划入。Boros没有杠杆设置：初始保证金按持仓规模、利率与距到期时间计算。

持仓模式：单向持仓。Boros没有只减仓标志：平仓单（```closebuy```、```closesell```）是反向订单，数量夹到当前持仓（与持仓相差不到十亿分之一时按持仓的精确数量），没有对应方向的持仓时报错不下单。

账户：```exchange.GetAccount()```按当前交易对的保证金币取全仓账户（只能逐仓的市场取它的逐仓账户）：```Balance```为可用初始保证金，```FrozenBalance```为已用初始保证金，```Equity```为账户净值（现金 + 持仓市值）。```exchange.GetPositions()```的```Price```为开仓的固定年化利率，```Profit```为未实现盈亏（保证金币计）。

##### 注意事项

###### ```Pendle```（现货）

| 函数 | Pendle交易所的行为 |
| - | - |
| exchange.GetTicker() | 买一、卖一为Pendle实时的可成交兑换率（AMM与限价单撮合后，含手续费）；```Info```中有```impliedApy```（隐含年化）和```expiry```（到期时间，毫秒）。没有24小时统计，```High```、```Low```、```Open```为当前价，```Volume```为0 |
| exchange.GetDepth() | Pendle订单簿（限价单与AMM合并），按隐含年化0.01%分档并换算成价格 |
| exchange.GetMarkets() | 各活跃市场的PT、YT分别对底层资产、计价资产的交易对；```Info```中有市场地址、到期时间、隐含年化、PT/YT/SY地址 |
| exchange.GetAssets() | 原生币和余额不为0的PT、YT、底层资产等 |
| exchange.CreateOrder() | 价格为-1时立即兑换：市价买入时```amount```为要花费的计价币数量，卖出为PT/YT数量，按滑点保护。价格大于0时在Pendle限价单簿上挂限价单：价格按计价资产汇率与距到期年数换算成隐含年化（见```exchange.IO("apy", ...)```），附加参数```impliedApy```可直接按年化挂单 |
| exchange.GetOrder() | 兑换的订单ID为```交易对,交易哈希```，状态来自交易回执；限价单的订单ID为```交易对,lo-订单哈希```，状态、成交数量、成交均价来自Pendle（部分成交时状态仍为未完成） |
| exchange.GetOrders() | 本钱包挂着的限价单，以及本程序发出、尚未上链的兑换 |
| exchange.CancelOrder() | 限价单：发送一笔链上撤单交易并等待上链（见```exchange.IO("cancelWait", ...)```）。兑换交易不能撤单 |
| exchange.GetHistoryOrders() | 本钱包已结束（全部成交、撤销、过期）的限价单；兑换不在其中 |

限价单只能用Pendle的SY能接受的代币付款或收款（通常是底层资产、计价资产），用了其它计价币会报错并列出可用的代币。挂单前会自动把付出的代币授权给Pendle限价单合约；挂单本身不上链、不花gas，撤单是一笔链上交易。

Pendle接口按计算单位限流（每分钟200个单位：兑换报价每次至少5个、订单簿5个、实时价格1个）。行情查询请保持合理频率，被限流时连接器会等到下一分钟自动重试一次。

###### ```Futures_Boros```（期货）

| 函数 | Boros交易所的行为 |
| - | - |
| exchange.GetTicker() | ```Last```为最近成交利率，```Buy```、```Sell```为最优买卖利率，```High```、```Low```、```Open```取最近24根1小时K线，```Volume```为24小时成交量（YU）；```Info```中有标记利率```markApr```、底层资金费率```floatingApr```、下次结算时间等 |
| exchange.GetDepth() | Boros订单簿（含AMM），按0.0001的利率分档 |
| exchange.GetTrades() | 市场最近的成交；Boros没有成交ID，```Id```由交易哈希、数量、利率合成 |
| exchange.GetRecords() | 原生周期为5分钟、1小时、1天、1周，其它周期由托管者合成；K线值为利率，无成交的时段沿用上一根收盘 |
| exchange.GetFundings() | 底层永续交易所当前的资金费率：```Rate```为年化```floatingApr```折到每个结算周期（1小时），```Interval```为结算周期 |
| exchange.CreateOrder() | 限价单默认GTC（附加参数```tif```可选```ioc```、```fok```、```postOnly```），利率按对自己有利的方向取整到tick（做多不高于、做空不低于给定利率），并以给定利率作为平均成交利率保护；价格为-1时为市价单：在标记利率±滑点（见```exchange.IO("slippage", ...)```）内IOC成交，没成交任何数量时报错。订单价值须大于10美元（全部平仓除外）。第一次在某个市场下单时自动进入该市场（Boros收一次入场费）。只能逐仓的市场可用附加参数```cashIn```（保证金币数量）在下单前把现金划进逐仓账户 |
| exchange.GetOrder() | 订单ID为```市场编号,订单号```；立即全部成交、未挂上订单簿的市价单按本程序下单时记录的成交返回 |
| exchange.CancelOrder() | 经中继撤单，订单已不在挂单中（已成交或已撤销）时返回错误 |
| exchange.ModifyOrder() | 原子地撤旧单、下新单（Boros的```idToStrictCancel```），返回新订单ID；旧单已不在时整笔失败 |
| exchange.CreateConditionOrder() | Boros止盈止损单：利率越过触发价（```TpTriggerPrice```或```SlTriggerPrice```，必须大于0）后按市价平仓，只减仓。方向写平仓方向（平多```closebuy```、平空```closesell```），数量不小于持仓时平全部持仓；委托价只能是-1（市价），不支持OCO。只用于主账户（子账户0）。止损单接口需要API签名密钥：连接器第一次用到时由交易代理签名自动申请一把（名为```fmz-…```，7天有效，快过期时换新；名额满时撤掉本代理申请过、最久没用的一把） |
| exchange.GetConditionOrders() | 等待触发与执行中的止盈止损单；```Price```为-1，触发价在```Condition```里 |

每笔下单、撤单经Pendle中继上链，从Boros账户的gas余额扣费（约0.02到0.04美元，见```exchange.IO("gasBalance")```），默认余额不足时自动从全仓现金补（见```exchange.IO("autoTopUp", ...)```）。同一交易所对象的提交按顺序进行。

Boros API按计算单位限流：每个IP每分钟200个单位（下单、撤单各5个，市场列表、订单簿各2个，其余多为1个）。被限流时连接器会等到下一个窗口自动重试一次，行情查询请保持合理频率。

风险：资金费率互换的盈亏取决于底层资金费率与成交利率之差，以及隐含利率变动带来的持仓市值变化；保证金不足时会被强平。到期前每小时结算一次资金费。

#### WOOFi Pro

永续合约（WOO生态基于Orderly Network的永续合约DEX，与WOO X交易所是不同的产品和账户）。只有USDC结算的永续合约，账户为全仓、单向持仓。需要配置Orderly账户ID和Orderly API密钥（ed25519密钥对）。

##### 名称与配置

```exchange.GetName()```：```Futures_WOOFi```（期货）；别名：WOOFi、Orderly。

| 配置项 | 必填 | 说明 |
| - | - | - |
| AccountID | 是 | Orderly账户ID。 |
| Access Key | 是 | Orderly API密钥的公钥（ed25519），带不带```ed25519:```前缀均可。 |
| Secret Key | 是 | Orderly API密钥的私钥（base58编码），带不带```ed25519:```前缀均可。 |

##### 交易对与合约代码

交易对示例：```BTC_USDC```、```ETH_USDC```

只有USDC结算的合约，计价币必须是```USDC```，例如```ETH_USDC```对应原生代码```PERP_ETH_USDC```，其它计价币会报错。

| 合约代码 | 说明 |
| - | - |
| ```swap``` | 永续合约。 |

只有永续合约，其它合约代码会报错。下单数量单位为基础币（```exchange.GetMarkets()```中```CtVal```为1）。

##### 函数支持差异

没有不支持的标准函数。

以回退方式支持：

- `exchange.GetRecords`：原生周期为1分钟、5分钟、15分钟、30分钟、1小时、4小时、12小时、1天、1周、1月、1年；其它周期由托管者合成。单次最多返回1000根。

##### 保证金、账户与模拟盘

保证金模式：账户恒为全仓，没有逐仓，不支持```exchange.IO("cross", ...)```。```exchange.SetMarginLevel()```设置杠杆；交易所按整个账户生效，设置一个合约的杠杆会同时改变其它合约的杠杆。

持仓模式：只有单向（净）持仓，不支持```exchange.IO("dual", ...)```，```exchange.SetDirection()```只用于区分开平仓。

##### 注意事项

- 条件单只支持止盈、止损单，不支持OCO（需要分成止盈、止损两张条件单下单）；触发价按标记价格。
- 盘口和K线接口也需要签名：```exchange.GetDepth()```、```exchange.GetRecords()```以及```exchange.GetTicker()```（买一、卖一价取自盘口）都要求配置好API密钥；```exchange.GetTickers()```、```exchange.GetTrades()```、```exchange.GetFundings()```、```exchange.GetMarkets()```不需要签名。

#### Uniswap

在一条链上连接一个DEX（配置项「DEX」选Uniswap、PancakeSwap或Aerodrome）的池子，把链上兑换映射为现货交易函数：

- Uniswap：Ethereum、Arbitrum、Base、BNB Chain、Unichain、Polygon、OP Mainnet、Robinhood、Arc。V3池子；V4池子（只使用不带hook的池子，原生币ETH/BNB/POL直接参与兑换、不经包装币）；V2池子在Ethereum、Unichain、Robinhood、Arc上使用。
- PancakeSwap：Ethereum、Arbitrum、Base、BNB Chain上的V2和V3池子；BNB Chain与Base上还有Infinity CL池子（只使用不带hook、手续费不超过1%的池子；Infinity没有固定费率档，连接器从最近的链上成交中收集池子，长时间没有成交的池子不会被使用）。
- Aerodrome：只在Base上。使用Slipstream集中流动性池子（新旧两代部署都使用，池子按tick间距区分，手续费由池子自己设定）和基础池子（volatile为恒定乘积，stable为稳定币曲线）。基础池子只支持精确输入：限价买入（按买到的数量成交）只能走Slipstream池子。

每笔兑换在所有可用池子的直连路径和经中转币的两跳路径中选报价最好的一条。V4与Infinity路径通过各自的Universal Router兑换，代币授权经过各自的Permit2合约（见```exchange.IO("approve", ...)```）。Aerodrome的基础池子和两代Slipstream各有自己的路由合约，代币分别授权给本次兑换所用的那个路由。

##### 名称与配置

```exchange.GetName()```：```Uniswap```（现货）；别名：PancakeSwap、Aerodrome。

| 配置项 | 必填 | 默认值 | 说明 |
| - | - | - | - |
| DEX | 是 | ```Uniswap``` | 可选：```Uniswap```、```PancakeSwap```、```Aerodrome (Base)``` |
| 链 | 是 | ```Ethereum``` | 可选：```Ethereum```、```Arbitrum```、```Base```、```BNB Chain```、```Unichain```、```Polygon```、```OP Mainnet```、```Robinhood```、```Arc``` |
| 钱包私钥 | 是 | — | 钱包私钥（十六进制）。 |
| 节点地址 | 否 | ```https://ethereum-rpc.publicnode.com,https://eth.drpc.org``` | RPC节点地址；多个节点用逗号分隔，某个节点出错或缺少数据时自动换下一个；不填时使用各链内置的默认节点（主节点加备用节点，逗号分隔）。（详见表下） |
| 节点认证 | 否 | — | RPC节点认证：```Header-Name: value```形式的请求头，或Basic认证值。 |

表中长说明的其余部分：

- 节点地址：查询订单状态需要节点能查到已上链交易的回执：publicnode的Base、BNB Chain、Arbitrum公共节点查不到回执（要求归档权限），不要单独使用。

##### 交易对与合约代码

交易对示例：```ETH_USDC```、```WETH_USDC```、```ETH_USDG```

交易对写作```ETH_USDC```，原生币（ETH、BNB、POL）与包装币（WETH、WBNB、WPOL）是两个不同的资产。代币表以外的代币用```exchange.IO("token", name, address)```登记后即可写在交易对里。Polygon的原生币为POL；Arc链用USDC支付gas，原生余额与USDC代币（```0x3600000000000000000000000000000000000000```）是同一笔资金，交易对写作```WETH_USDC```、```EURC_USDC```；Robinhood链上没有USDC和USDT，主流稳定币为USDG，交易对写作```ETH_USDG```；Unichain、Polygon上的USDT写作```USDT0```。

##### 专属IO指令

| 指令 | 参数 | 说明 | 返回值 |
| - | - | - | - |
| ```transfer``` | to, amount[, token] | 从配置的钱包转出原生币或ERC20代币（```token```为代币名或合约地址，不传为原生币；Arc链上为USDC）；```amount```可传```all```转出全部（原生币扣除手续费）。只等交易广播，不等上链。见子页`exchange.IO("transfer", ...)`。 | ```{txHash, from, to, token, tokenAddress, amount, raw}``` |
| ```receipt``` | txHash[, waitMs] | 查询本交易所对象发出的交易（下单、转账等）的回执，可以等待上链（最多10分钟）。查询订单时传订单ID中逗号后面的交易哈希。见子页`exchange.IO("receipt", ...)`。 | 已上链返回```{txHash, status, blockNumber, gasUsed, fee}```，未上链返回```{txHash, pending: true, known}```。 |
| ```route``` | symbol, side, qty | 只询价不下单：列出一笔兑换各条候选路径的报价和最优路径。见子页`exchange.IO("route", ...)`。 | ```{symbol, side, qty, best, quote, price, candidates}``` |
| ```simulate``` | symbol, side, qty[, price[, stateOverride[, route]]] | 按下单逻辑（选路、询价、价格保护）构造兑换交易，只用```eth_call```模拟执行，不签名、不广播、不花费gas。见子页`exchange.IO("simulate", ...)`。 | ```{route, exactIn, amountIn, amountOut, quoted, executed, value, calls}``` |
| ```token``` | [name, address] | 登记代币，登记后的代币可以直接写在交易对里；不传参数时列出代币表。见子页`exchange.IO("token", ...)`。 | 登记时返回```{symbol, address, decimals}```，列表时返回```{symbol, address, decimals, native}```数组。 |
| ```wrap``` | amount | 原生币包装成包装币（例如ETH→WETH），1:1、无滑点、只花gas；不接受```all```（要留gas）。见子页`exchange.IO("wrap", ...)`。 | ```{txHash, action, from, to, amount, raw}``` |
| ```unwrap``` | amount | 包装币解包成原生币（例如WETH→ETH），```amount```可传```all```。见子页`exchange.IO("unwrap", ...)`。 | ```{txHash, action, from, to, amount, raw}``` |
| ```approve``` | ["exact" \| "max"] | 代币授权模式：```exact```（默认）每次只授权本次兑换需要的数量，```max```授权无限额度。不传参数时查询。见子页`exchange.IO("approve", ...)`。 | 当前模式。 |
| ```slippage``` | [ratio] | 市价单的滑点保护比例，范围```[0, 0.5)```，默认```0.005```（0.5%）。不传参数时查询。见子页`exchange.IO("slippage", ...)`。 | 当前滑点比例。 |
| ```deadline``` | [seconds] | 交易有效期（秒），范围10到86400，默认120。不传参数时查询。见子页`exchange.IO("deadline", ...)`。 | 当前截止时间（秒）。 |
| ```cancelWait``` | [seconds] | 撤单时等待结果的最长时间（秒），范围0到600，默认30；0表示发出撤单交易后立即返回。不传参数时查询。见子页`exchange.IO("cancelWait", ...)`。 | 当前等待时间（秒）。 |
| ```gasMultiplier``` | [x] | gas上限倍数，范围1到5，默认1.2：交易的gasLimit为节点估算的gas乘以该倍数。不传参数时查询。见子页`exchange.IO("gasMultiplier", ...)`。 | 当前倍数。 |
| ```base``` | [url] | 不传参数时返回当前节点地址；传入地址时切换节点。多个节点写成逗号分隔的字符串（传数组时只使用第一个地址）。换节点后第一次请求会核对节点所在的链，与配置的链不一致时报错。 | 切换前的地址。 |
| ```sendBase``` | url | 设置只用来广播交易的节点（私有交易通道）。与Web3不同：不返回设置前的地址，不传参数时不查询，传空字符串不会清除设置。 | ```true``` |
| ```address``` | — | 配置的私钥对应的钱包地址（```0x```开头的小写地址）。 | — |
| ```contracts``` | — | 本交易所对象所用DEX在本链上的部署信息：合约地址、手续费档和内置代币列表快照。 | 对象：```dex```、```chainId```、```chain```、```router```、```quoterV2```、```v3Factory```、```v3Fees```、```v2Factory```、```v2Fee```（百万分之一，3000即0.3%）、```wrappedNative```、```v4```（Uniswap V4或PancakeSwap Infinity CL的合约，含LP用的```positionManager```）、```aerodrome```（Aerodrome的合约）、```tokenList```（代币列表快照的生成时间```embeddedAt```、代币数```tokens```、常用币数```core```）；本链没有的部署为```null```。 |
| ```lp.pools``` | token[, quote] | 列出代币的全部V3与V4池子（指定计价币，或本链的包装币、USDC、USDT）：费率、tick间距、现价、流动性、池子两种代币的余额与TVL；24小时成交与手续费取自GeckoTerminal（取不到时为```null```）。（详见表下） | ```[{id, protocol, dex, symbol, fee, feeRate, tickSpacing, tick, price, liquidity, reserveBase, reserveQuote, tvlQuote, tvlUsd, volume24hUsd, fees24hUsd, empty}]```，```price```为计价币/代币。 |
| ```lp.select``` | token, budget[, options] | 按规则自动选池：```options.fee```指定费率时该费率的池子满足流动性门槛就选它（```exact```为```true```时只用该费率）；否则在TVL不低于max(5000美元, 预算)的池子里选24小时成交最大的，没有成交数据时选TVL最大的。（详见表下） | ```lp.pools```的一行，另带```reason```（选择理由）。 |
| ```lp.pool``` | poolId | 池子实时状态。```poolId```为V3池子合约地址（只认本DEX工厂创建的）或V4的PoolId（```0x```加64位十六进制，只认不带hook的）。 | ```{id, protocol, currency0, currency1, token0, token1, fee, tickSpacing, tick, sqrtPriceX96, price0, price1, liquidity}```，```price0```为1个token0值多少token1；V4原生币的```currency```为零地址。 |
| ```lp.ticks``` | poolId, tickLower, tickUpper[, step] | tick区间内的流动性分布：每段的流动性和两种代币数量（按已初始化的tick细分求和），```step```为合并成的段宽（tick，默认等于tick间距）。区间超过120个位图字时报错。 | ```{pool, tick, token0, token1, segments: [{tickLower, tickUpper, price0Lower, price0Upper, liquidity, amount0, amount1, current}]}``` |
| ```lp.plan``` | params | 建仓计划（只读，不花钱）。（详见表下） | ```{params, symbol, pool, protocol, fee, tickSpacing, tick, price, shape, budget, budgetUsd, positions: [{tickLower, tickUpper, priceLower, priceUpper, liquidity, amountBase, amountQuote, share}], needBase, needQuote, haveBase, haveQuote, swap, shortfall, shareOfPool, volume24hUsd, estDailyFeesUsd, slippageBps}```；```swap```为建仓前需要换的币（```{side, amount, currency}```或```null```）。 |
| ```lp.simulate``` | plan[, stateOverride] | 按计划用```eth_call```执行建仓交易（不签名、不广播），确认能成交及实际投入数量。（详见表下） | ```{pool, positions: [{liquidity, amountBase, amountQuote}], value, swapNeeded, note}``` |
| ```lp.add``` | plan | 按计划建仓：需要时先用市价单换币，再授权（V3授权PositionManager；V4代币先授权Permit2，再在Permit2里给PositionManager额度），一笔交易创建全部仓位，等上链后返回。（详见表下） | ```{txHash, swapTxHash, pool, positions: [{id, tickLower, tickUpper, priceLower, priceUpper, liquidity, amountBase, amountQuote}]}``` |
| ```lp.increase``` | positionId, budget[, options] | 给仓位加仓：```budget```（计价币）按仓位区间与现价的配比拆成两种代币，缺的那种先换。```options.symbol```指定朝向（默认稳定币为计价币），```options.slippage```价格保护。 | ```{txHash, swapTxHash, id, liquidity, amountBase, amountQuote}``` |
| ```lp.decrease``` | positionId, ratio[, options] | 按比例（0到1）减仓，同时领取全部手续费，仓位保留。```options.slippage```价格保护，```options.sell```为```true```时把拿回的代币卖成计价币。 | ```{txHash, positions: [{id, symbol, principalBase, principalQuote, feesBase, feesQuote, receivedBase, receivedQuote}], sells}``` |
| ```lp.collect``` | positionIds[, sell] | 领取手续费，多个仓位合成一笔交易；```sell```为```true```时把领到的代币卖成计价币。 | 同```lp.decrease```。 |
| ```lp.remove``` | positionIds[, ratio[, sell]] | 撤出流动性并领取手续费，多个仓位合成一笔交易；```ratio```默认1（全部撤出并销毁仓位NFT），小于1时只撤一部分；```sell```为```true```时卖回计价币。 | 同```lp.decrease```。 |
| ```lp.positions``` | [filter[, wallet]] | 钱包的全部V3与V4仓位：区间、是否在区间内、流动性、当前数量与价值、未领手续费。（详见表下） | ```[{id, pool, protocol, symbol, fee, tickLower, tickUpper, priceLower, priceUpper, price, tick, inRange, liquidity, amountBase, amountQuote, value, feesBase, feesQuote, feesValue, closed}]```，```value```、```feesValue```按计价币计。 |
| ```lp.history``` | positionId | 仓位资金流水：存入、撤出本金、领取手续费，以及按当前池价折算的盈亏（现值 + 已领手续费 + 已撤本金 − 存入本金，不含gas）。（详见表下） | ```{id, symbol, events: [{action, block, txHash, liquidity, amountBase, amountQuote}], depositedBase, depositedQuote, withdrawnBase, withdrawnQuote, feesCollectedBase, feesCollectedQuote, price, pnlQuote, note}```；V4仓位为```{id, pool, symbol, events: [{action, block, txHash, liquidity}], position, note}```。 |
| ```lp.track``` | positionIds | 登记V4仓位ID（如```["v4:123456"]```），之后```lp.positions```会查这些仓位（归属每次按链上核对，转走的不列）。节点查不到全部历史日志时用它找回以前建的V4仓位；策略可以把```lp.add```返回的ID存起来（如```_G```），重启后登记。 | 本进程记住的全部V4仓位ID。 |

表中长说明的其余部分：

- ```lp.pools```：按TVL降序。V4池子（```protocol```为```v4```）只列不带hook的，原生币池子与包装币池子分开列（如```ETH_USDC```与```WETH_USDC```）；V4是单例合约，池子余额```reserveBase```、```reserveQuote```为```null```，TVL取自GeckoTerminal。
- ```lp.select```：```budget```按计价币计，```options.quote```指定计价币。
- ```lp.plan```：```params```：```symbol```（如```ETH_USDC```）、```budget```（计价币）、```range```（```{lower, upper}```价格，或```{pct: [-5, 5]}```相对现价百分比，或```{ticks: [lo, hi]}```，自动对齐tick间距）、```shape```（```spot```单一区间、```curve```多层嵌套现价附近最厚、```bidask```两侧分段越远越厚）、```layers```（默认3）、```pool```（不填按```lp.select```选）、```fee```、```slippage```（默认0.01）。钱包不够时照样给出计划，```shortfall```说明差额。
- ```lp.simulate```：计划需要先换币时按换完的数量模拟；钱包余额或授权不够时可用```stateOverride```补上（V4池子的代币经Permit2付款，要补代币对Permit2的授权和Permit2里给PositionManager的额度）。V4的PositionManager不返回数量，结果中的数量为计划量。
- ```lp.add```：传计划或计划的```params```都可以（执行时按最新池价重算）。V3池子：交易对写原生币（如```ETH_USDC```）时可以直接用原生币余额，领回来的是包装币。V4池子：原生币池子用原生币余额、领回原生币，包装币池子用包装币；V4的付款上限比计划量多出滑点，流动性按持有量的(1 − 滑点)计算。
- ```lp.positions```：```filter```为交易对（给定价格朝向）或代币（只列含它的仓位），```*```或不传为全部；```wallet```为其它钱包地址时只读查看那个钱包。V4仓位的```id```形如```v4:123456```。V4的PositionManager不能按钱包列出仓位，靠转入钱包的NFT日志查找：节点支持查询全部历史日志时能找全；公共节点通常只能查最近一段区块，更早的仓位要用```lp.track```登记（本进程```lp.add```建的会自动记住）。
- ```lp.history```：V4的事件不记录代币数量，V4仓位只给每次流动性变化（```add```、```remove```、```collect```）和当前仓位。需要能查历史日志的节点；公共节点常常不支持。

通用指令```api```、```currency```见`exchange.IO`。

##### 函数支持差异

不支持（调用时报错并返回空值）：`exchange.GetTickers`、`exchange.GetRecords`、`exchange.GetHistoryOrders`、`exchange.ModifyOrder`、`exchange.CreateConditionOrder`、`exchange.ModifyConditionOrder`、`exchange.CancelConditionOrder`、`exchange.GetConditionOrder`、`exchange.GetConditionOrders`、`exchange.GetHistoryConditionOrders`。

##### 注意事项

| 函数 | Uniswap交易所的行为 |
| - | - |
| exchange.GetTicker() | 买一、卖一为约1000美元规模的实际可成交价；链上没有24小时统计 |
| exchange.GetDepth() | 由逐档递增规模的链上询价推算 |
| exchange.GetTrades() | 该交易对各个池子最近的链上成交 |
| exchange.GetAssets() | 原生币和代币表中各代币的钱包余额 |
| exchange.CreateOrder() | 立即在链上兑换：限价为最差成交价，市价按滑点保护；市价买入时数量为要花费的计价币。下单附加参数```slippage```覆盖本单滑点，```route```（```v2```、```v3```、```v4```、```hop```、```direct```）限定路径类型（Aerodrome的```v2```为基础池子、```v3```为Slipstream） |
| exchange.GetOrder() | 订单ID形如```ETH_USDC,0x…```（交易对、逗号、交易哈希），状态来自交易回执；原交易的nonce已被撤单交易（或其它交易）占用时显示为已撤销。订单号只含交易对和交易哈希，不含链；```Info```中有```chainId```与链名```chain```，跨链汇总订单时用它找回所属的链；在别的链的交易所对象上查询会报错“not found on <链>” |
| exchange.CancelOrder() | 发送同nonce的替换交易，并等待结果（默认最多30秒，见```exchange.IO("cancelWait", ...)```）：撤单交易先上链返回```true```；原订单先上链返回```false```；等待超时返回```true```，表示撤单已提交 |

##### 区间流动性（LP）

```exchange.IO("lp.*", ...)```指令提供V3池子（Uniswap V3、PancakeSwap V3）与不带hook的Uniswap V4池子的区间流动性：选池、规划与模拟、建仓、加减仓、领手续费、撤出和仓位查询。仓位是PositionManager的NFT：V3仓位的```id```即NFT编号，V4仓位写成```v4:编号```（两个合约的编号会重复）；V3与V4仓位可以在同一条指令里一起传，各发一笔交易。V4在Ethereum、Base、Arbitrum、BNB Chain、Unichain、Polygon、OP Mainnet、Robinhood、Arc上可用（Arc只用ERC20形态的USDC，原生USDC的池子看不到）；PancakeSwap Infinity、Aerodrome的仓位不支持；KyberSwap、1inch交易所对象没有LP指令。

监控与撤退由策略自己做：```lp.positions```给出是否在区间内、当前价值与未领手续费，策略据此决定调仓或止损（参考示例策略```examples/strategies/uniswap-lp-monitor.js```）。

风险：
- 无常损失：价格偏离建仓价越远，仓位价值相对单纯持有越低；单边上涨时仓位逐步卖出代币，下跌时逐步买入。
- 价格出区间后仓位只剩一种代币，不再赚手续费，直到价格回到区间。
- 每次建仓、调仓、领取、撤出都是链上交易，频繁调仓的gas成本可能超过手续费收入；更适合Base、Arbitrum、Robinhood等低gas的链。
- 计划中的预估日手续费按过去24小时成交与当前占池比例估算，不代表未来收益。

##### exchange.IO("transfer", ...)

```
exchange.IO(k, to, amount)
exchange.IO(k, to, amount, token)
```

Forms:

- `exchange.IO("transfer", ...)`

从Uniswap交易所对象配置的钱包转出链上原生币（ETH、BNB）或ERC20代币。

Parameters:

- `k` (string, required): 固定为```transfer```，用于执行转账。
- `to` (string, required): 收款地址，即以```0x```开头的20字节十六进制地址，且必须是交易所对象所在链上的地址。
- `amount` (string / number, required): 转账数量，采用可读单位（例如```"0.05"```表示0.05个ETH）。建议以字符串形式传入，函数会按代币精度进行精确换算；若小数位数超出代币精度则直接报错，不会静默截断。设置为```all```表示全部转出：转原生币时，按本次交易手续费上限预留后转出剩余全部余额；转代币时，转出全部代币余额。
- `token` (string, optional): 要转出的代币，可以是代币名称（如```USDC```，按交易对中代币名的同样规则解析：代币表中的内置或登记过的代币，以及官方代币列表中的代币，参看```exchange.IO("token", ...)```），也可以是代币合约地址。不传入该参数时表示转出原生币。

Returns (object / 空值): 交易广播成功时返回```{txHash, from, to, token, tokenAddress, amount, raw}```：其中```txHash```为交易哈希；```amount```为转出数量（可读单位）；```raw```为以最小单位表示的十进制字符串；转出原生币时```tokenAddress```为```null```。该函数仅等待交易广播完成，不等待交易上链确认；上链结果需通过```exchange.IO("receipt", ...)```查询。调用失败时返回空值，可通过```GetLastError()```获取失败原因。

转出ETH和USDC，并等待交易上链。

```javascript
function main() {
    var TO = "0x收款地址"
    // 转0.05个ETH；转出全部用 "all"
    var r = exchange.IO("transfer", TO, "0.05")
    if (!r) {
        Log("转账失败:", GetLastError())
        return
    }
    Log("已发出", r.amount, r.token, "交易:", r.txHash)

    // 最多等3分钟上链
    var rc = exchange.IO("receipt", r.txHash, 180000)
    if (rc.pending) {
        Log("尚未上链")
    } else {
        Log("结果:", rc.status, "区块:", rc.blockNumber, "手续费:", rc.fee)
    }

    // 转10个USDC
    var r2 = exchange.IO("transfer", TO, "10", "USDC")
    Log(r2 ? r2.txHash : GetLastError())
}
```

出现以下情况时，函数会在签名前直接报错，不会发出交易：地址格式错误、收款地址为零地址、收款地址为钱包自身、转账数量为0、转账数量超过余额、代币无法识别。

原生币全部转出（```all```）时，在EIP-1559链上会按本次报价的最高手续费进行预留。由于实际扣除的手续费低于预留值，钱包中会剩余极少量零头。

优先费（小费）取节点建议值与最近区块实际优先费中位数两者中的较大值，以避免节点建议值为0时交易长时间无法上链。

转账为链上真实交易，一经发出无法撤回。向交易所充值地址转账前，请确认对方支持该链上的充值。

See also: `Uniswap`, `exchange.IO`, `exchange.IO("receipt")`, `exchange.IO("token")`, `exchange.IO("wrap")`

##### exchange.IO("receipt", ...)

```
exchange.IO(k, txHash)
exchange.IO(k, txHash, waitMs)
```

Forms:

- `exchange.IO("receipt", ...)`

查询Uniswap交易所对象发出的交易（下单、转账等）的回执，可以等待交易上链。

Parameters:

- `k` (string, required): 固定为```receipt```，用于查询交易回执。
- `txHash` (string, required): 交易哈希，即以```0x```开头、长度为32字节的十六进制字符串，例如```exchange.IO("transfer", ...)```返回的```txHash```。查询订单的交易时，传订单ID（形如```ETH_USDC,0x…```）中逗号后面的部分。
- `waitMs` (number, optional): 最长等待时间，单位为毫秒。交易未上链时，每1.5秒查询一次，最长等待10分钟。未传入该参数或传入0时，仅查询一次。

Returns (object): 交易已上链时，返回```{txHash, status, blockNumber, gasUsed, fee}```。其中，```status```的值为```success```或```reverted```；```fee```为实际支付的手续费，以原生币计价，采用可读单位。等待时间内交易仍未上链时，返回```{txHash, pending: true, known}```。其中，```known```表示节点能否查询到该笔交易；如果查询不到，通常是因为交易已被丢弃或交易哈希有误。

等待一笔交易上链。

```javascript
function main() {
    var txHash = "TX_HASH"     // 待查询的交易哈希
    var rc = exchange.IO("receipt", txHash, 120000)
    if (rc.pending) {
        Log("2分钟内未上链，节点", rc.known ? "可以查询到" : "无法查询到", "该笔交易")
        return
    }
    Log("状态:", rc.status, "区块:", rc.blockNumber, "gasUsed:", rc.gasUsed, "手续费:", rc.fee)
}
```

查询订单成交情况时，使用```exchange.GetOrder()```即可。```exchange.IO("receipt", ...)```主要用于查询转账等非下单类交易。

See also: `Uniswap`, `exchange.IO`, `exchange.IO("transfer")`, `exchange.IO("cancelWait")`, `exchange.IO("wrap")`, `exchange.IO("unwrap")`

##### exchange.IO("route", ...)

```
exchange.IO(k, symbol, side, qty)
```

Forms:

- `exchange.IO("route", ...)`

在Uniswap交易所对象上询价：列出一笔兑换各条候选路径的报价和最优路径，不下单。

Parameters:

- `k` (string, required): 固定为```route```，用于询价。
- `symbol` (string, required): 交易对，例如```ETH_USDC```。
- `side` (string, required): 方向：```sell```表示卖出```qty```个基础币，```buy```表示买入```qty```个基础币。
- `qty` (number, required): 基础币数量。

Returns (object / 空值): 返回```{symbol, side, qty, best, quote, price, candidates}```：最优路径、最优报价、平均价格和各候选路径的报价，字段说明见备注。出错时返回空值，原因见```GetLastError()```。

比较卖出1个ETH的各条路径。

```javascript
function main() {
    var r = exchange.IO("route", "ETH_USDC", "sell", 1)
    if (!r) {
        Log("询价出错:", GetLastError())
        return
    }
    if (r.best === null) {
        Log("没有可用的池子")
        return
    }
    Log("最优路径:", r.best, "可得:", r.quote, "USDC")
    r.candidates.forEach(function (c) {
        Log(c.route, c.quote)
    })
}
```

候选路径包括：V3各费率档的直连池子、V2池子、经包装币或USDC/USDT中转的两跳路径，以及Uniswap V4不带hook的池子（直连和经原生币或USDC/USDT中转的两跳）。路径写法如```v3:WETH-500-USDC```（V3，费率500即0.05%）、```v2:WETH-USDC```、```v3:UNI-3000-USDT-100-USDC```（两跳）、```v4:ETH-500/10-USDC```（V4，费率500、tick间距10，ETH为原生币）、```infinity:BNB-67/1-USDT```（PancakeSwap Infinity CL）；Aerodrome为```cl:WETH-100-USDC```（第一代Slipstream，数字为tick间距）、```cl2:WETH-500-USDC```（第二代Slipstream）、```volatile:AERO-USDC```、```stable:USDC-USDbC```（基础池子）。

V3路径用链上QuoterV2询价（把整笔兑换模拟一遍），V2按池子储备本地计算，报价不含gas。

返回对象的字段：```best```为最优路径，```quote```为最优报价（卖出时为可得到的计价币数量，买入时为需要花费的计价币数量），```price```为对应的平均价格，```candidates```为每条候选路径```{route, quote}```（报不出价的路径```quote```为```null```）。没有可用的池子时仍返回对象：```best```、```quote```、```price```为```null```，```candidates```为空数组（有池子但都报不出价时，```candidates```各项的```quote```为```null```）。交易对中的代币无法识别、节点所在的链与配置不一致等出错时返回空值，```GetLastError()```中有原因。

See also: `Uniswap`, `exchange.IO`, `exchange.IO("simulate")`, `exchange.IO("slippage")`, `exchange.IO("token")`, `exchange.CreateOrder`

##### exchange.IO("simulate", ...)

```
exchange.IO(k, symbol, side, qty)
exchange.IO(k, symbol, side, qty, price)
exchange.IO(k, symbol, side, qty, price, stateOverride)
exchange.IO(k, symbol, side, qty, price, stateOverride, route)
```

Forms:

- `exchange.IO("simulate", ...)`

按Uniswap交易所对象的下单逻辑（选路、询价、价格保护）构造兑换交易，只在链上模拟执行（```eth_call```），不签名、不广播、不花费gas。

Parameters:

- `k` (string, required): 固定为```simulate```，用于模拟下单。
- `symbol` (string, required): 交易对，例如```ETH_USDC```。
- `side` (string, required): 方向，```buy```或```sell```。
- `qty` (number, required): 数量，含义与```exchange.CreateOrder()```相同（市价买入时为要花费的计价币数量）。
- `price` (number, optional): 限价，不传或传```null```表示市价单。
- `stateOverride` (object, optional): 节点```eth_call```的状态覆盖（geth的state override set），用于模拟时给钱包临时补充余额或授权，例如```{"0x钱包地址": {"balance": "0x56bc75e2d63100000"}}```。只在本次模拟中生效。
- `route` (string, optional): 限定路径类型：```v2```、```v3```、```v4```、```hop```（两跳）或```direct```（直连）；Aerodrome的```v2```为基础池子、```v3```为Slipstream池子。不传表示在所有路径中选最优。

Returns (object / 空值): 返回```{route, exactIn, amountIn, amountOut, quoted, executed, value, calls}```，主要看下单时的报价```quoted```与模拟执行得到的数量```executed```，字段说明见备注。不能成交时返回空值并报错。

给钱包临时补100个ETH，模拟卖出1个ETH。

```javascript
function main() {
    var ov = {}
    ov[exchange.IO("address")] = { balance: "0x56bc75e2d63100000" }
    var r = exchange.IO("simulate", "ETH_USDC", "sell", 1, null, ov)
    Log("路径:", r.route, "报价:", r.quoted, "模拟执行:", r.executed)
}
```

模拟用的是最新区块状态，与真实下单相比，只差在交易实际上链前价格可能变化。

钱包余额不足或代币未授权时，模拟会因为路由合约转账失败而报错，可以用```stateOverride```覆盖。

返回对象的字段：```quoted```为下单时的报价，```executed```为模拟执行得到的实际数量（精确输入时为得到的数量，精确输出时为花费的数量），两者均为最小单位的十进制字符串。V4路径（含PancakeSwap Infinity）经Universal Router执行，路由不返回成交数量，```executed```为```null```：模拟不报错即说明按这组参数（含最少得到/最多花费）能够成交。限价达不到、余额或授权不足（未覆盖时）等情况返回空值并报错。

See also: `Uniswap`, `exchange.IO`, `exchange.IO("route")`, `exchange.IO("slippage")`, `exchange.IO("gasMultiplier")`, `exchange.CreateOrder`

##### exchange.IO("token", ...)

```
exchange.IO(k)
exchange.IO(k, name, address)
```

Forms:

- `exchange.IO("token", ...)`

在Uniswap交易所对象上登记代币，或列出代币表；登记后的代币可以直接写在交易对里。

Parameters:

- `k` (string, required): 固定为```token```，用于代币登记。
- `name` (string, optional): 代币在交易对中使用的名字，例如```UNI```。
- `address` (string, optional): 代币合约地址，精度从链上读取。

Returns (object / array / 空值): 登记时返回```{symbol, address, decimals}```；不传参数时返回代币表数组，每项为```{symbol, address, decimals, native}```（```native```为```true```的是链上原生币）。地址不是ERC20代币时返回空值。

登记UNI后查询UNI_USDC行情。

```javascript
function main() {
    exchange.IO("token", "UNI", "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984")
    var t = exchange.GetTicker("UNI_USDC")
    Log("买一:", t.Buy, "卖一:", t.Sell)
}
```

按名字解析代币的顺序：①代币表，包括人工核对过的内置代币（原生币、包装币、USDC、USDT、该链的BTC等）和```exchange.IO("token", ...)```登记过的代币，登记与内置代币同名的代币会替换内置条目；②官方代币列表：以太坊、Arbitrum使用Uniswap Labs默认列表（tokens.uniswap.org），BNB链合并PancakeSwap列表（tokens.pancakeswap.finance）与Uniswap Labs列表，Base合并Uniswap Labs列表与PancakeSwap列表，从官方列表解析到的代币会登记进代币表。连接器内置一份列表快照，名字在快照里找不到时再拉取一次最新列表（24小时内只拉一次）。

官方列表中同一条链上有多个同名代币（例如桥接版与原生版）时，名字不能直接使用，报错信息会列出各个候选地址，请用合约地址指定。列表中代币的精度以链上合约为准，与列表不一致时拒绝使用。

不在代币表中的代币也可以直接用合约地址作为交易对的一部分，例如```0x1f9840a85d5af5bf1d1762f925bdaddc4201f984_USDC```。

```exchange.GetMarkets()```只列出代币表中各代币（内置及已登记的代币）之间、以及流动性排名靠前的常用币与包装币/USDC/USDT之间的交易对；列表里的其他代币同样可以直接交易。

原生币（ETH、BNB）与包装币（WETH、WBNB）是两个不同的资产：交易原生币时由路由合约自动包装和解包。

See also: `Uniswap`, `exchange.IO`, `exchange.IO("route")`, `exchange.IO("transfer")`, `exchange.IO("approve")`

##### exchange.IO("wrap", ...)

```
exchange.IO(k, amount)
```

Forms:

- `exchange.IO("wrap", ...)`

在Uniswap交易所对象上把原生币（ETH、BNB）包装成包装币（WETH、WBNB），1:1兑换，没有滑点，只花gas。

Parameters:

- `k` (string, required): 固定为```wrap```，用于包装原生币。
- `amount` (string / number, required): 要包装的原生币数量（可读单位，建议写成字符串，例如```"0.01"```）。不支持```all```：原生币还要留着支付gas。

Returns (object / 空值): 交易广播成功返回```{txHash, action, from, to, amount, raw}```，```from```、```to```为兑换前后的币种名。只等交易广播，不等上链，上链结果用```exchange.IO("receipt", ...)```查询。余额不足等情况返回空值并报错。

把0.01个ETH包装成WETH。

```javascript
function main() {
    var r = exchange.IO("wrap", "0.01")
    if (!r) {
        Log("包装失败:", GetLastError())
        return
    }
    var rc = exchange.IO("receipt", r.txHash, 120000)
    Log(r.from, "→", r.to, r.amount, "结果:", rc.status)
}
```

直接调用包装币合约的```deposit()```，不经过Uniswap路由和资金池。```ETH_WETH```这样的交易对不能下单，原生币与包装币之间的转换请用```exchange.IO("wrap", ...)```和```exchange.IO("unwrap", ...)```。

See also: `Uniswap`, `exchange.IO`, `exchange.IO("unwrap")`, `exchange.IO("receipt")`, `exchange.IO("transfer")`

##### exchange.IO("unwrap", ...)

```
exchange.IO(k, amount)
```

Forms:

- `exchange.IO("unwrap", ...)`

在Uniswap交易所对象上把包装币（WETH、WBNB）解包成原生币（ETH、BNB），1:1兑换，没有滑点，只花gas。

Parameters:

- `k` (string, required): 固定为```unwrap```，用于解包包装币。
- `amount` (string / number, required): 要解包的包装币数量（可读单位，建议写成字符串）；设置为```all```表示解包全部包装币。

Returns (object / 空值): 交易广播成功返回```{txHash, action, from, to, amount, raw}```。包装币余额不足或为0时返回空值并报错。

把全部WETH换回ETH。

```javascript
function main() {
    var r = exchange.IO("unwrap", "all")
    if (!r) {
        Log("解包失败:", GetLastError())
        return
    }
    var rc = exchange.IO("receipt", r.txHash, 120000)
    Log(r.from, "→", r.to, r.amount, "结果:", rc.status)
}
```

直接调用包装币合约的```withdraw(uint256)```，不经过Uniswap路由和资金池。

See also: `Uniswap`, `exchange.IO`, `exchange.IO("wrap")`, `exchange.IO("receipt")`, `exchange.IO("transfer")`

##### exchange.IO("approve", ...)

```
exchange.IO(k)
exchange.IO(k, mode)
```

Forms:

- `exchange.IO("approve", ...)`

以```exchange.IO("approve", ...)```方式调用该函数，可在Uniswap交易所对象上设置代币授权模式。

Parameters:

- `k` (string, required): 固定为```approve```，用于设置代币授权模式。
- `mode` (string, optional): 授权模式：```exact```（默认）表示每次仅授权本次兑换所需的数量；```max```表示授权无限额度，此后同一代币无需再次授权。不传入该参数时，表示查询当前授权模式。

Returns (string): 返回当前的授权模式：```exact```或```max```。

设置代币授权模式。

```javascript
function main() {
    exchange.IO("approve", "max")
    Log("当前授权模式:", exchange.IO("approve"))
}
```

卖出代币（输入为ERC20代币）前，连接器会检查路由合约的授权额度。若额度不足，会先发送授权交易并等待其上链确认，再发送兑换交易。若现有授权额度不为0但仍不足，则先将额度清零再重新授权（USDT等代币有此要求）。

走Uniswap V4或PancakeSwap Infinity路径时分两步：先把代币授权给Permit2合约（规则同上；两家各有自己的Permit2），再在Permit2中授权对应的Universal Router使用（```exact```模式只授权本次数量、1天后过期，```max```模式授权无限额度、30天后过期）。两步都只在额度不够或已过期时才发送交易。

```max```模式可省去后续的授权交易及相应的gas费用，但路由合约将有权动用该代币的全部余额，请根据实际需要选择。

See also: `Uniswap`, `exchange.IO`, `exchange.IO("transfer")`, `exchange.IO("simulate")`, `exchange.IO("gasMultiplier")`

##### exchange.IO("slippage", ...)

```
exchange.IO(k)
exchange.IO(k, ratio)
```

Forms:

- `exchange.IO("slippage", ...)`

设置Uniswap交易所对象市价单的滑点保护。

Parameters:

- `k` (string, required): 固定为```slippage```，用于设置市价单的滑点保护。
- `ratio` (number, optional): 滑点比例，取值范围为```[0, 0.5)```，默认值为```0.005```（即0.5%）。不传入该参数时，表示查询当前的滑点比例。

Returns (number): 返回当前的滑点比例。

设置市价单的滑点保护。

```javascript
function main() {
    exchange.IO("slippage", 0.01)     // 1%
    Log("滑点:", exchange.IO("slippage"))
}
```

市价单以下单时的报价扣除滑点，计算出最少可得数量，并将其写入链上交易。如果成交时价格的变动幅度超过了滑点比例，整笔交易将会回滚（仅损失gas费用）。

也可以在```exchange.CreateOrder()```函数的方向参数后附加```;{"slippage":0.01}```，为单笔订单单独指定滑点。限价单不使用滑点，因为限价本身就是最差成交价。

See also: `Uniswap`, `exchange.IO`, `exchange.IO("route")`, `exchange.IO("simulate")`, `exchange.IO("deadline")`, `exchange.CreateOrder`

##### exchange.IO("deadline", ...)

```
exchange.IO(k)
exchange.IO(k, seconds)
```

Forms:

- `exchange.IO("deadline", ...)`

在Uniswap交易所对象上设置交易的截止时间。

Parameters:

- `k` (string, required): 固定为```deadline```，用于设置交易的截止时间。
- `seconds` (number, optional): 交易有效期，单位为秒，取值范围为10至86400，默认值为120。不传入该参数时，表示查询当前设置值。

Returns (number): 返回当前设置的交易截止时间，单位为秒。

设置交易的截止时间。

```javascript
function main() {
    exchange.IO("deadline", 300)
    Log("截止时间:", exchange.IO("deadline"), "秒")
}
```

兑换交易发出后，若超过截止时间仍未上链，执行时将被回滚。这样可以避免长时间挂起的交易在价格大幅波动后才成交。

See also: `Uniswap`, `exchange.IO`, `exchange.IO("slippage")`, `exchange.IO("gasMultiplier")`, `exchange.IO("cancelWait")`

##### exchange.IO("cancelWait", ...)

```
exchange.IO(k)
exchange.IO(k, seconds)
```

Forms:

- `exchange.IO("cancelWait", ...)`

在Uniswap交易所对象上设置撤单时等待结果的最长时间。

Parameters:

- `k` (string, required): 固定为```cancelWait```，用于设置撤单等待结果的最长时间。
- `seconds` (number, optional): 等待时间（秒），范围0到600，默认30。设置为0表示发出撤单交易后立即返回。不传表示查询当前值。

Returns (number): 返回当前等待时间（秒）。

撤单前把等待时间调长，并处理撤单失败的情况。

```javascript
function main() {
    exchange.IO("cancelWait", 60)
    var id = exchange.CreateOrder("ETH_USDC", "buy", 2000, 0.01)
    if (id && !exchange.CancelOrder(id)) {
        Log("撤单失败:", GetLastError())
    }
    Log(exchange.GetOrder(id))
}
```

链上撤单是用同一个nonce发一笔替换交易，原订单和撤单交易谁先上链不确定。```exchange.CancelOrder()```发出撤单交易后在等待时间内查看结果：撤单交易先上链返回```true```；原订单先上链（已成交或执行失败）返回```false```，可用`GetLastError`查看原因；等待超时返回```true```，表示撤单已提交，最终状态以`exchange.GetOrder`为准。

以太坊主网约12秒出一个块，默认的30秒约等于两三个块；出块快的链（Base、Arbitrum、BNB Chain）通常几秒内就有结果。

See also: `Uniswap`, `exchange.IO`, `exchange.IO("receipt")`, `exchange.IO("deadline")`, `exchange.CancelOrder`

##### exchange.IO("gasMultiplier", ...)

```
exchange.IO(k)
exchange.IO(k, x)
```

Forms:

- `exchange.IO("gasMultiplier", ...)`

在Uniswap交易所对象上设置gas上限倍数。

Parameters:

- `k` (string, required): 固定为```gasMultiplier```，用于设置gas上限倍数。
- `x` (number, optional): gas上限倍数，取值范围为1到5，默认值为1.2。交易的gasLimit等于节点估算的gas用量乘以该倍数。不传入该参数时，表示查询当前倍数。

Returns (number): 返回当前的gas上限倍数。

设置gas上限倍数。

```javascript
function main() {
    exchange.IO("gasMultiplier", 1.5)
    Log("gas倍数:", exchange.IO("gasMultiplier"))
}
```

gasLimit仅为gas用量上限，实际手续费按实际消耗的gas计算，因此适当调高倍数不会增加实际花费；但钱包余额需足以覆盖gasLimit对应的最高手续费，否则交易可能无法发送。

See also: `Uniswap`, `exchange.IO`, `exchange.IO("deadline")`, `exchange.IO("simulate")`, `exchange.IO("slippage")`

#### Jupiter

连接Solana链上的Jupiter聚合器，把兑换映射为现货交易函数。一个交易所对象对应一个Solana钱包：报价和兑换交易由Jupiter Swap API生成（它在Solana上的众多DEX和做市商之间拆单选路），托管者用配置的私钥签名后经Solana节点广播。不填Jupiter API Key时使用免费的```lite-api.jup.ag```，填写后使用```api.jup.ag```。

##### 名称与配置

```exchange.GetName()```：```Jupiter```（现货）。

| 配置项 | 必填 | 默认值 | 说明 |
| - | - | - | - |
| 钱包私钥 | 是 | — | Solana钱包私钥：Phantom、Solflare导出的base58字符串，或solana-keygen生成的JSON字节数组。 |
| 节点地址 | 否 | ```https://api.mainnet-beta.solana.com,https://solana-rpc.publicnode.com``` | Solana RPC节点，多个用逗号分隔，某个节点出错时自动换下一个。默认为官方公共节点和publicnode。 |
| Jupiter API Key | 否 | — | 可选。不填时使用免费的```lite-api.jup.ag```；填写后使用```api.jup.ag```，请求速率可按套餐提高（见```exchange.IO("rps", ...)```）。 |
| 流动性来源 | 否 | — | 可选。（详见表下） |

表中长说明的其余部分：

- 流动性来源：只经过这些流动性来源兑换，例如```pump```（pump.fun的bonding curve与PumpSwap）、```meteora```、```raydium```、```orca```，或Jupiter的来源名；不填表示全部来源。运行中可用```exchange.IO("dexes", ...)```修改。

##### 交易对与合约代码

交易对示例：```SOL_USDC```、```JUP_USDC```、```BONK_SOL```

SOL为原生币，兑换时自动包装、解包。内置代币：SOL、USDC、USDT、JUP、BONK、WIF、JTO、PYTH、RAY、JitoSOL、mSOL、JupSOL、TRUMP、PENGU、POPCAT。其它代币有三种写法：直接写代币名，按Jupiter代币列表中经过认证、名称完全一致的代币识别（同名的多个认证代币时报错）；直接写mint地址；或者先用```exchange.IO("token", ...)```登记。交易对不转大写（mint地址与```mSOL```这类币名区分大小写），按原样书写，例如```DB5QKorV9KHY54y73h5xWQqYyuD8P3jC1p5Ea8DBpump_SOL```。

##### 专属IO指令

| 指令 | 参数 | 说明 | 返回值 |
| - | - | - | - |
| ```route``` | symbol, side, qty | 只询价不下单：卖出（```sell```）按精确输入、买入（```buy```）按精确输出询价```qty```个基础币，返回报价和经过的流动性来源。报价不含Solana交易手续费。见子页`exchange.IO("route", ...)`。 | ```{symbol, side, qty, route, quote, price, priceImpactPct}```；没有路由时```route```、```quote```、```price```为```null```。 |
| ```token``` | [name, mint] | 登记代币（只在本次运行中有效），登记后的代币名可以直接写在交易对里；不传参数时列出代币表。见子页`exchange.IO("token", ...)`。 | 登记时返回```{symbol, mint, decimals}```，列表时返回```{symbol, mint, decimals, native}```数组。 |
| ```transfer``` | to, amount | 从钱包转出SOL；```amount```可传```all```转出全部余额（扣除手续费）。只支持SOL，第三个参数传其它代币会报错。只等广播，不等上链。见子页`exchange.IO("transfer", ...)`。 | ```{signature, amount, lastValidBlockHeight}``` |
| ```receipt``` | signature[, waitMs] | 查询一笔Solana交易的状态，可等待到确认或失败（最多10分钟）。查询订单时传订单ID中逗号后面的交易签名。见子页`exchange.IO("receipt", ...)`。 | ```{signature, state, slot, confirmationStatus, err, fee, blockTime}```，```state```为```success```、```failed```或```pending```。 |
| ```slippage``` | [ratio] | 市价单的滑点保护比例，范围```[0, 0.5)```，默认```0.005```（0.5%），由链上程序强制执行。限价单不使用这个设置。不传参数时查询。见子页`exchange.IO("slippage", ...)`。 | 当前滑点比例。 |
| ```priorityFee``` | [sol] | 每笔兑换交易的优先费上限（SOL），范围0到0.1，默认0.001；实际优先费由Jupiter按网络拥堵情况估算，不超过上限。不传参数时查询。见子页`exchange.IO("priorityFee", ...)`。 | 当前上限（SOL）。 |
| ```dexes``` | [sources] | 限定兑换经过的流动性来源（逗号分隔）：分组简写```pump```、```meteora```、```raydium```、```orca```，或Jupiter的来源名（区分大小写）；```""```表示不限定。行情、询价和下单都只经过这些来源。不传参数时查询。见子页`exchange.IO("dexes", ...)`。 | 当前限定的来源名数组（分组已展开；空数组表示不限定）。 |
| ```rps``` | [n] | 请求Jupiter API的每秒最多请求数，范围0.1到500，默认1。请求依次排队，相邻两次至少间隔```1/n```秒。不传参数时查询。见子页`exchange.IO("rps", ...)`。 | 当前每秒最多请求数。 |
| ```base``` | [url] | 不传参数时返回当前Solana节点地址；传入地址时切换节点（多个用逗号分隔）。 | 切换前的地址。 |
| ```address``` | — | 钱包地址（base58）。 | — |

通用指令```api```、```currency```见`exchange.IO`。

##### 函数支持差异

不支持（调用时报错并返回空值）：`exchange.GetTickers`、`exchange.GetRecords`、`exchange.GetTrades`、`exchange.GetHistoryOrders`、`exchange.CancelOrder`、`exchange.ModifyOrder`、`exchange.CreateConditionOrder`、`exchange.ModifyConditionOrder`、`exchange.CancelConditionOrder`、`exchange.GetConditionOrder`、`exchange.GetConditionOrders`、`exchange.GetHistoryConditionOrders`。

##### 注意事项

| 函数 | Jupiter交易所的行为 |
| - | - |
| exchange.GetTicker() | 买一、卖一为约1000美元规模的实际可成交价（两次询价）；吃不下1000美元的小币依次缩小到100、10美元，卖方规模不够时再缩小，实际规模见```Info```的```sizeQuote```、```bidSize```。没有24小时统计，```High```、```Low```、```Open```为当前价，```Volume```为0 |
| exchange.GetDepth() | 由约1000美元起逐档递增规模的询价推算，每档两次询价 |
| exchange.GetMarkets() | 代币表中的币与USDC、USDT、SOL组成的交易对（不逐个验证路由） |
| exchange.GetAssets() | SOL与代币表中各代币的钱包余额，单独持有的wSOL记为```WSOL```；代币表以外的持仓不进余额列表，列在```Info```的```unlisted```中（```{mint, amount}```） |
| exchange.CreateOrder() | 立即兑换：限价为最差成交价，由链上程序按滑点强制执行，当前报价已经达不到时直接报错、不发交易；市价按滑点保护；市价买入时数量为要花费的计价币。下单附加参数```slippage```覆盖本单滑点。Jupiter生成交易时会先模拟一遍，余额不足等会直接报错 |
| exchange.GetOrder() | 订单ID形如```SOL_USDC,5VERv8…```（交易对、逗号、交易签名）。交易确认后为已成交，成交数量按交易前后的钱包余额计算；链上执行失败为已撤销（手续费照扣）；超过有效期（约1分钟）仍未上链为已撤销 |
| exchange.GetOrders() | 本程序发出、尚未确认也未过期的兑换 |
| exchange.CancelOrder() | 不支持：Solana交易发出后无法撤回，未上链的交易约1分钟后自动过期 |

- 请求速率：Jupiter按每秒请求数限流，超过后返回429。连接器按```exchange.IO("rps", ...)```（默认每秒1次）给请求排队，同一个托管者进程中使用同一个Jupiter API地址的交易所对象共用这个节奏。默认设置下```exchange.GetTicker()```约需2秒，5档```exchange.GetDepth()```约需10秒；需要更快时申请Jupiter API Key，并按套餐调高```rps```。
- 手续费：每笔交易的Solana基础费与优先费（上限见```exchange.IO("priorityFee", ...)```）从SOL余额中扣除，订单的```Info```中有```fee```。第一次买入某个代币时，钱包需要新建该代币的账户，押金约0.002 SOL；押金仍归钱包所有，不计入成交。

##### exchange.IO("route", ...)

```
exchange.IO(k, symbol, side, qty)
```

Forms:

- `exchange.IO("route", ...)`

在Jupiter交易所对象上询价：返回一笔兑换的报价和路由，不下单。

Parameters:

- `k` (string, required): 固定为```route```，用于询价。
- `symbol` (string, required): 交易对，例如```SOL_USDC```。
- `side` (string, required): 方向：```sell```表示卖出```qty```个基础币，```buy```表示买入```qty```个基础币。
- `qty` (number, required): 基础币数量。

Returns (object / 空值): 返回```{symbol, side, qty, route, quote, price, priceImpactPct}```：```route```为经过的流动性来源名称数组，```quote```为卖出时可得到、买入时需花费的计价币数量，```price```为平均价格，```priceImpactPct```为Jupiter估计的价格冲击（比例，0.001即0.1%）。没有路由时仍返回对象，```route```、```quote```、```price```为```null```。代币无法识别、请求失败时返回空值，```GetLastError()```中有原因。

询价卖出2个SOL。

```javascript
function main() {
    var r = exchange.IO("route", "SOL_USDC", "sell", 2)
    if (!r) {
        Log("询价出错:", GetLastError())
        return
    }
    if (r.route === null) {
        Log("没有路由")
        return
    }
    Log("可得:", r.quote, "USDC", "均价:", r.price, "路由:", r.route.join(" + "))
}
```

卖出按精确输入询价，买入按精确输出询价（能走精确输出的流动性来源较少，个别小币买入询价可能没有路由，此时可以用卖出方向询价估算）。报价不含Solana交易手续费。

See also: `Jupiter`, `exchange.IO`, `exchange.IO("slippage")`, `exchange.IO("dexes")`, `exchange.IO("token")`, `exchange.CreateOrder`

##### exchange.IO("token", ...)

```
exchange.IO(k)
exchange.IO(k, name, mint)
```

Forms:

- `exchange.IO("token", ...)`

在Jupiter交易所对象上登记代币，或列出代币表。

Parameters:

- `k` (string, required): 固定为```token```，用于登记代币。
- `name` (string, optional): 在交易对中使用的代币名，不能包含```_```和```,```，不能与内置代币重名。
- `mint` (string, optional): 代币的mint地址，精度从链上读取。

Returns (object / array / 空值): 登记时返回```{symbol, mint, decimals}```；不传参数时返回代币表数组，每项为```{symbol, mint, decimals, native}```（```native```为```true```的是原生币SOL）。mint地址不是代币、节点出错时返回空值。

登记代币后查询行情。

```javascript
function main() {
    var t = exchange.IO("token", "MEW", "MEW1gQWJ3nEXg2qgERiKu7FAFj79PHvQVREQUzScPP5")
    Log("已登记:", t)
    Log(exchange.GetTicker("MEW_USDC"))
}
```

登记只在本次运行中有效。不登记也可以直接在交易对中写代币名（按Jupiter认证代币列表识别）或mint地址；同名代币有多个时必须登记或写mint地址。

See also: `Jupiter`, `exchange.IO`, `exchange.IO("route")`, `exchange.IO("transfer")`, `exchange.IO("dexes")`

##### exchange.IO("transfer", ...)

```
exchange.IO(k, to, amount)
```

Forms:

- `exchange.IO("transfer", ...)`

从Jupiter交易所对象的钱包转出SOL。

Parameters:

- `k` (string, required): 固定为```transfer```，用于转账。
- `to` (string, required): 收款的Solana地址。
- `amount` (number / string, required): SOL数量；传```all```表示转出全部余额（扣除手续费）。

Returns (object / 空值): 广播成功时返回```{signature, amount, lastValidBlockHeight}```：```signature```为交易签名，可用```exchange.IO("receipt", ...)```查询是否上链。地址无效、余额不足、广播失败时返回空值。

转出0.1 SOL并等待确认。

```javascript
function main() {
    var r = exchange.IO("transfer", "收款地址", 0.1)
    if (!r) {
        Log("转账失败:", GetLastError())
        return
    }
    Log(exchange.IO("receipt", r.signature, 60000))
}
```

只支持转出SOL，暂不支持转出其它代币。转出全部余额后钱包无法再支付兑换手续费。

See also: `Jupiter`, `exchange.IO`, `exchange.IO("receipt")`, `exchange.IO("priorityFee")`, `exchange.IO("token")`

##### exchange.IO("receipt", ...)

```
exchange.IO(k, signature)
exchange.IO(k, signature, waitMs)
```

Forms:

- `exchange.IO("receipt", ...)`

在Jupiter交易所对象上查询一笔Solana交易的状态，可以等待到确认。

Parameters:

- `k` (string, required): 固定为```receipt```，用于查询交易状态。
- `signature` (string, required): 交易签名。查询订单时传订单ID中逗号后面的部分。
- `waitMs` (number, optional): 最长等待毫秒数（最多600000），交易确认或失败时提前返回。不传表示不等待。

Returns (object / 空值): 返回```{signature, state, slot, confirmationStatus, err, fee, blockTime}```：```state```为```success```（已确认）、```failed```（链上执行失败，```err```为原因）或```pending```（未确认；节点还查不到时另有```visible: false```）；确认后带```fee```（SOL）和```blockTime```（秒）。节点请求失败时返回空值。

查询订单的交易状态。

```javascript
function main() {
    var id = exchange.CreateOrder("SOL_USDC", "sell", -1, 0.1)
    if (!id) return
    var r = exchange.IO("receipt", String(id).split(",")[1], 60000)
    Log(r.state, r.fee)
}
```

See also: `Jupiter`, `exchange.IO`, `exchange.IO("transfer")`, `exchange.IO("priorityFee")`, `exchange.IO("route")`

##### exchange.IO("slippage", ...)

```
exchange.IO(k)
exchange.IO(k, ratio)
```

Forms:

- `exchange.IO("slippage", ...)`

设置Jupiter交易所对象市价单的滑点保护。

Parameters:

- `k` (string, required): 固定为```slippage```，用于设置市价单的滑点保护。
- `ratio` (number, optional): 滑点比例，范围```[0, 0.5)```，默认```0.005```（0.5%）。不传表示查询当前值。

Returns (number): 返回当前滑点比例。

设置市价单的滑点保护。

```javascript
function main() {
    exchange.IO("slippage", 0.01)     // 1%
    Log("滑点:", exchange.IO("slippage"))
}
```

市价单按报价扣除滑点得到最少到手数量，由链上程序强制执行；成交时价格变动超过滑点则交易失败（只损失手续费），订单显示为已撤销。

单笔订单也可以在```exchange.CreateOrder()```的方向参数后附加```;{"slippage":0.01}```单独指定。限价单不使用这个设置：连接器按限价算出恰好的滑点，限价本身就是最差成交价。

See also: `Jupiter`, `exchange.IO`, `exchange.IO("route")`, `exchange.IO("dexes")`, `exchange.IO("priorityFee")`, `exchange.CreateOrder`

##### exchange.IO("priorityFee", ...)

```
exchange.IO(k)
exchange.IO(k, sol)
```

Forms:

- `exchange.IO("priorityFee", ...)`

在Jupiter交易所对象上设置兑换交易的优先费上限。

Parameters:

- `k` (string, required): 固定为```priorityFee```，用于设置优先费上限。
- `sol` (number, optional): 每笔交易的优先费上限（单位SOL），范围0~0.1，默认0.001。不传表示查询当前值。

Returns (number): 返回当前优先费上限（SOL）。

调高优先费上限。

```javascript
function main() {
    exchange.IO("priorityFee", 0.005)
    Log("优先费上限:", exchange.IO("priorityFee"), "SOL")
}
```

实际优先费由Jupiter按当前网络拥堵情况估算（较高档），不超过这个上限。交易确认后，`exchange.GetOrder`返回的订单```Info```中```fee```为本笔交易实际支付的手续费（SOL，含基础费与优先费）。上限过低时网络拥堵期间交易可能无法及时上链而过期。

See also: `Jupiter`, `exchange.IO`, `exchange.IO("slippage")`, `exchange.IO("receipt")`, `exchange.IO("transfer")`, `exchange.CreateOrder`

##### exchange.IO("dexes", ...)

```
exchange.IO(k)
exchange.IO(k, sources)
```

Forms:

- `exchange.IO("dexes", ...)`

在Jupiter交易所对象上限定兑换经过的流动性来源，例如只在pump.fun、Meteora或Raydium上成交。

Parameters:

- `k` (string, required): 固定为```dexes```，用于限定流动性来源。
- `sources` (string, optional): 逗号分隔的来源列表，可以写分组简写```pump```（Pump.fun、Pump.fun Amm）、```meteora```（Meteora、Meteora DAMM v2、Meteora DLMM）、```raydium```（Raydium、Raydium CLMM、Raydium CP、Raydium Launchlab）、```orca```（Whirlpool、Orca V1、Orca V2），也可以写Jupiter的来源名（区分大小写）。传空字符串```""```表示不限定。不传表示查询当前设置。

Returns (array / 空值): 返回当前限定的来源名数组（分组已展开；空数组表示不限定）。来源名不在Jupiter的来源表中时返回空值，设置不变，```GetLastError()```中列出可用的来源名。

只在pump.fun上交易一个新币。

```javascript
function main() {
    exchange.IO("dexes", "pump")
    exchange.IO("token", "POUT", "DB5QKorV9KHY54y73h5xWQqYyuD8P3jC1p5Ea8DBpump")
    var t = exchange.GetTicker("POUT_SOL")
    Log("买一", t.Buy, "卖一", t.Sell, "经过", t.Info.askRoute)
}
```

限定后行情（```exchange.GetTicker()```、```exchange.GetDepth()```）、询价和下单都只经过这些来源；路由找不到时报“没有路由”。配置中的“流动性来源”是同一个设置的初始值。

See also: `Jupiter`, `exchange.IO`, `exchange.IO("route")`, `exchange.IO("slippage")`, `exchange.IO("priorityFee")`, `exchange.CreateOrder`

##### exchange.IO("rps", ...)

```
exchange.IO(k)
exchange.IO(k, n)
```

Forms:

- `exchange.IO("rps", ...)`

在Jupiter交易所对象上设置请求Jupiter API的速率。

Parameters:

- `k` (string, required): 固定为```rps```，用于设置请求速率。
- `n` (number, optional): 每秒最多请求数，范围0.1~500，默认1。不传表示查询当前值。

Returns (number): 返回当前每秒最多请求数。

配置了Developer套餐的API Key时调高速率。

```javascript
function main() {
    exchange.IO("rps", 10)
    var t = Date.now()
    exchange.GetDepth("SOL_USDC")
    Log("深度耗时:", Date.now() - t, "毫秒")
}
```

Jupiter按每秒请求数限流：不带API Key约0.5~1次每秒，免费API Key为1次每秒，付费套餐为10~150次每秒。连接器让请求依次排队，相邻两次至少间隔```1/n```秒；仍收到429时退避重试，多次失败返回空值。设置值高于套餐允许的速率会频繁触发限流。

See also: `Jupiter`, `exchange.IO`, `exchange.IO("route")`, `exchange.IO("token")`, `exchange.IO("receipt")`

#### KyberSwap

接入KyberSwap聚合器：报价和交易数据来自KyberSwap Aggregator API（在众多DEX和做市商之间拆单选路，不需要API Key），由托管者用配置的私钥签名后发给KyberSwap的路由合约MetaAggregationRouterV2（```0x6131B5fae19EA4f9D964eAc0408E4408b66337b5```）。一个交易所对象对应一条链，可选Ethereum、Arbitrum、Base、BNB Chain、Unichain、Polygon、OP Mainnet、Robinhood。

它与Uniswap交易所对象是同一套实现的聚合器版本：代币表、余额、授权、订单、撤单、转账与包装的用法都相同，区别是没有DEX选项，兑换路径由KyberSwap给出。

##### 名称与配置

```exchange.GetName()```：```KyberSwap```（现货）；别名：Kyber。

| 配置项 | 必填 | 默认值 | 说明 |
| - | - | - | - |
| 链 | 是 | ```Ethereum``` | 可选：```Ethereum```、```Arbitrum```、```Base```、```BNB Chain```、```Unichain```、```Polygon```、```OP Mainnet```、```Robinhood``` |
| 钱包私钥 | 是 | — | 钱包私钥（十六进制）。 |
| 节点地址 | 否 | ```https://ethereum-rpc.publicnode.com,https://eth.drpc.org``` | RPC节点地址；多个节点用逗号分隔，某个节点出错或缺少数据时自动换下一个。查询订单状态需要节点能查到已上链交易的回执：publicnode的Base、BNB Chain、Arbitrum公共节点查不到回执（要求归档权限），不要单独使用。 |
| 节点认证 | 否 | — | RPC节点认证：```Header-Name: value```形式的请求头，或Basic认证值。 |

##### 交易对与合约代码

交易对示例：```ETH_USDC```、```WETH_USDC```、```ETH_USDG```

交易对写作```ETH_USDC```，原生币（ETH、BNB、POL）与包装币（WETH、WBNB、WPOL）是两个不同的资产。代币表沿用该链Uniswap交易所对象的代币表，表外的代币用```exchange.IO("token", name, address)```登记后即可写在交易对里。Polygon的原生币为POL；Robinhood链上没有USDC和USDT，主流稳定币为USDG，交易对写作```ETH_USDG```；Unichain、Polygon上的USDT写作```USDT0```。```exchange.GetMarkets()```列出代币表中在该链Uniswap上有池子的交易对。

##### 专属IO指令

| 指令 | 参数 | 说明 | 返回值 |
| - | - | - | - |
| ```transfer``` | to, amount[, token] | 从配置的钱包转出原生币或ERC20代币（```token```为代币名或合约地址，不传为原生币）；```amount```可传```all```转出全部（原生币扣除手续费）。只等交易广播，不等上链。 | ```{txHash, from, to, token, tokenAddress, amount, raw}``` |
| ```receipt``` | txHash[, waitMs] | 查询本交易所对象发出的交易（下单、转账等）的回执，可以等待上链（最多10分钟）。查询订单时传订单ID中逗号后面的交易哈希。 | 已上链返回```{txHash, status, blockNumber, gasUsed, fee}```，未上链返回```{txHash, pending: true, known}```。 |
| ```route``` | symbol, side, qty | 只询价不下单。聚合器只有一条候选路径（形如```kyberswap:ETH-USDC```）；```buy```按买到```qty```个base询价（由多次精确输入询价近似），```sell```按卖出```qty```个base询价。 | ```{symbol, side, qty, best, quote, price, candidates}``` |
| ```simulate``` | symbol, side, qty[, price[, stateOverride]] | 按下单逻辑（询价、价格保护、向KyberSwap生成交易）构造兑换交易，只用```eth_call```模拟执行，不签名、不广播、不花费gas；这时的路径描述中列出经过的流动性来源。第6个参数（限定路径类型）对聚合器不适用，传入会报错。 | ```{route, exactIn, amountIn, amountOut, quoted, executed, value, calls}``` |
| ```token``` | [name, address] | 登记代币，登记后的代币可以直接写在交易对里；不传参数时列出代币表。 | 登记时返回```{symbol, address, decimals}```，列表时返回```{symbol, address, decimals, native}```数组。 |
| ```wrap``` | amount | 原生币包装成包装币（例如ETH→WETH），1:1、无滑点、只花gas；不接受```all```（要留gas）。 | ```{txHash, action, from, to, amount, raw}``` |
| ```unwrap``` | amount | 包装币解包成原生币（例如WETH→ETH），```amount```可传```all```。 | ```{txHash, action, from, to, amount, raw}``` |
| ```approve``` | ["exact" \| "max"] | 代币授权模式（代币直接授权给KyberSwap路由合约，不经过Permit2）：```exact```（默认）每次只授权本次兑换需要的数量，```max```授权无限额度。不传参数时查询。 | 当前模式。 |
| ```slippage``` | [ratio] | 市价单的滑点保护比例，范围```[0, 0.5)```，默认```0.005```（0.5%）。不传参数时查询。 | 当前滑点比例。 |
| ```deadline``` | [seconds] | 交易有效期（秒），范围10到86400，默认120，生成兑换交易时传给KyberSwap。不传参数时查询。 | 当前截止时间（秒）。 |
| ```cancelWait``` | [seconds] | 撤单时等待结果的最长时间（秒），范围0到600，默认30；0表示发出撤单交易后立即返回。不传参数时查询。 | 当前等待时间（秒）。 |
| ```gasMultiplier``` | [x] | gas上限倍数，范围1到5，默认1.2：交易的gasLimit为节点估算的gas乘以该倍数。不传参数时查询。 | 当前倍数。 |
| ```base``` | [url] | 不传参数时返回当前节点地址；传入地址时切换节点。多个节点写成逗号分隔的字符串（传数组时只使用第一个地址）。换节点后第一次请求会核对节点所在的链，与配置的链不一致时报错。 | 切换前的地址。 |
| ```sendBase``` | url | 设置只用来广播交易的节点（私有交易通道）。与Web3不同：不返回设置前的地址，不传参数时不查询，传空字符串不会清除设置。 | ```true``` |
| ```address``` | — | 配置的私钥对应的钱包地址（```0x```开头的小写地址）。 | — |
| ```contracts``` | — | 本链上的部署信息，字段与Uniswap交易所对象相同：```dex```为```KyberSwap```，```router```为KyberSwap路由合约；```quoterV2```、```v3Factory```、```v4```等是该链Uniswap的部署（用来列出市场、估算美元价），```aerodrome```为```null```。 | — |

通用指令```api```、```currency```见`exchange.IO`。

##### 函数支持差异

不支持（调用时报错并返回空值）：`exchange.GetTickers`、`exchange.GetRecords`、`exchange.GetTrades`、`exchange.GetHistoryOrders`、`exchange.ModifyOrder`、`exchange.CreateConditionOrder`、`exchange.ModifyConditionOrder`、`exchange.CancelConditionOrder`、`exchange.GetConditionOrder`、`exchange.GetConditionOrders`、`exchange.GetHistoryConditionOrders`。

##### 注意事项

| 函数 | KyberSwap交易所的行为 |
| - | - |
| exchange.GetTicker() | 买一、卖一为约1000美元规模的KyberSwap报价；没有24小时统计。两个方向分别询价，报价交叉时两边都给中间价 |
| exchange.GetDepth() | 由KyberSwap在逐档递增规模上的报价推算；卖一侧每档按精确输出近似，需要3~5次询价，耗时相应增加 |
| exchange.GetAssets() | 原生币和代币表中各代币的钱包余额 |
| exchange.CreateOrder() | 立即在链上兑换：限价为最差成交价，市价按滑点保护；市价买入时数量为要花费的计价币。KyberSwap只支持精确输入：限价买入按“最多花费数量×价格、至少买到数量”执行，实际买到的数量可能略多于下单数量。下单附加参数```slippage```覆盖本单滑点；```route```对聚合器不适用，传入会报错 |
| exchange.GetOrder() | 订单ID形如```ETH_USDC,0x…```（交易对、逗号、交易哈希），状态来自交易回执；原交易的nonce已被撤单交易（或其它交易）占用时显示为已撤销。成交量取路由合约的```Swapped```事件（原生币进出也在其中） |
| exchange.CancelOrder() | 发送同nonce的替换交易，并等待结果（默认最多30秒，见```exchange.IO("cancelWait", ...)```）：撤单交易先上链返回```true```；原订单先上链返回```false```；等待超时返回```true```，表示撤单已提交 |

#### 1inch

OneInch交易所对象接入1inch聚合器：报价和交易数据来自1inch Swap API v6.0（在1inch的众多流动性来源之间拆单选路），由托管者用配置的私钥签名后发给1inch的路由合约AggregationRouterV6（```0x111111125421cA6dc452d289314280a0f8842A65```）。一个交易所对象对应一条链，可选Ethereum、Arbitrum、Base、BNB Chain、Unichain、Polygon、OP Mainnet。

它与Uniswap交易所对象是同一套实现的聚合器版本：代币表、余额、授权、订单、撤单、转账与包装的用法都相同，区别是兑换路径由1inch给出。使用前需要在1inch开发者门户申请API Key，填在交易所配置中（必填）。

##### 名称与配置

```exchange.GetName()```：```OneInch```（现货）。

| 配置项 | 必填 | 默认值 | 说明 |
| - | - | - | - |
| 链 | 是 | ```Ethereum``` | 可选：```Ethereum```、```Arbitrum```、```Base```、```BNB Chain```、```Unichain```、```Polygon```、```OP Mainnet``` |
| 钱包私钥 | 是 | — | 钱包私钥（十六进制）。 |
| 节点地址 | 否 | ```https://ethereum-rpc.publicnode.com,https://eth.drpc.org``` | RPC节点地址；多个节点用逗号分隔，某个节点出错或缺少数据时自动换下一个。（详见表下） |
| 1inch API Key | 是 | — | 1inch开发者门户申请的API Key（必填），请求时以```Authorization: Bearer <key>```发送。 |

表中长说明的其余部分：

- 节点地址：查询订单状态需要节点能查到已上链交易的回执：publicnode的Base、BNB Chain、Arbitrum公共节点查不到回执（要求归档权限），不要单独使用。RPC节点不带认证。

##### 交易对与合约代码

交易对示例：```ETH_USDC```、```WETH_USDC```、```POL_USDT0```

交易对写作```ETH_USDC```，原生币（ETH、BNB、POL）与包装币（WETH、WBNB、WPOL）是两个不同的资产。代币表沿用该链Uniswap交易所对象的代币表，表外的代币用```exchange.IO("token", name, address)```登记后即可写在交易对里。Polygon的原生币为POL；Unichain、Polygon上的USDT写作```USDT0```。```exchange.GetMarkets()```列出代币表中在该链Uniswap上有池子的交易对。

##### 专属IO指令

| 指令 | 参数 | 说明 | 返回值 |
| - | - | - | - |
| ```transfer``` | to, amount[, token] | 从配置的钱包转出原生币或ERC20代币（```token```为代币名或合约地址，不传为原生币）；```amount```可传```all```转出全部（原生币扣除手续费）。只等交易广播，不等上链。 | ```{txHash, from, to, token, tokenAddress, amount, raw}``` |
| ```receipt``` | txHash[, waitMs] | 查询本交易所对象发出的交易（下单、转账等）的回执，可以等待上链（最多10分钟）。查询订单时传订单ID中逗号后面的交易哈希。 | 已上链返回```{txHash, status, blockNumber, gasUsed, fee}```，未上链返回```{txHash, pending: true, known}```。 |
| ```route``` | symbol, side, qty | 只询价不下单。聚合器只有一条候选路径（形如```1inch:ETH-USDC```）；```buy```按买到```qty```个base询价（由多次精确输入询价近似），```sell```按卖出```qty```个base询价。 | ```{symbol, side, qty, best, quote, price, candidates}``` |
| ```simulate``` | symbol, side, qty[, price[, stateOverride]] | 按下单逻辑（询价、价格保护、向1inch生成交易）构造兑换交易，只用```eth_call```模拟执行，不签名、不广播、不花费gas；这时的路径描述中列出经过的流动性来源。第6个参数（限定路径类型）对聚合器不适用，传入会报错。 | ```{route, exactIn, amountIn, amountOut, quoted, executed, value, calls}``` |
| ```token``` | [name, address] | 登记代币，登记后的代币可以直接写在交易对里；不传参数时列出代币表。 | 登记时返回```{symbol, address, decimals}```，列表时返回```{symbol, address, decimals, native}```数组。 |
| ```wrap``` | amount | 原生币包装成包装币（例如ETH→WETH），1:1、无滑点、只花gas；不接受```all```（要留gas）。 | ```{txHash, action, from, to, amount, raw}``` |
| ```unwrap``` | amount | 包装币解包成原生币（例如WETH→ETH），```amount```可传```all```。 | ```{txHash, action, from, to, amount, raw}``` |
| ```approve``` | ["exact" \| "max"] | 代币授权模式（代币直接授权给1inch路由合约，不经过Permit2）：```exact```（默认）每次只授权本次兑换需要的数量，```max```授权无限额度。不传参数时查询。 | 当前模式。 |
| ```slippage``` | [ratio] | 市价单的滑点保护比例，范围```[0, 0.5)```，默认```0.005```（0.5%）。不传参数时查询。 | 当前滑点比例。 |
| ```deadline``` | [seconds] | 交易有效期（秒），范围10到86400，默认120。不传参数时查询。1inch生成的交易不带有效期，设置对OneInch交易所对象的兑换不起作用。 | 当前截止时间（秒）。 |
| ```cancelWait``` | [seconds] | 撤单时等待结果的最长时间（秒），范围0到600，默认30；0表示发出撤单交易后立即返回。不传参数时查询。 | 当前等待时间（秒）。 |
| ```gasMultiplier``` | [x] | gas上限倍数，范围1到5，默认1.2：交易的gasLimit为节点估算的gas乘以该倍数。不传参数时查询。 | 当前倍数。 |
| ```base``` | [url] | 不传参数时返回当前节点地址；传入地址时切换节点。多个节点写成逗号分隔的字符串（传数组时只使用第一个地址）。换节点后第一次请求会核对节点所在的链，与配置的链不一致时报错。 | 切换前的地址。 |
| ```sendBase``` | url | 设置只用来广播交易的节点（私有交易通道）。与Web3不同：不返回设置前的地址，不传参数时不查询，传空字符串不会清除设置。 | ```true``` |
| ```address``` | — | 配置的私钥对应的钱包地址（```0x```开头的小写地址）。 | — |
| ```contracts``` | — | 本链上的部署信息，字段与Uniswap交易所对象相同：```dex```为```1inch```，```router```为1inch路由合约；```quoterV2```、```v3Factory```、```v4```等是该链Uniswap的部署（用来列出市场、估算美元价），```aerodrome```为```null```。 | — |

通用指令```api```、```currency```见`exchange.IO`。

##### 函数支持差异

不支持（调用时报错并返回空值）：`exchange.GetTickers`、`exchange.GetRecords`、`exchange.GetTrades`、`exchange.GetHistoryOrders`、`exchange.ModifyOrder`、`exchange.CreateConditionOrder`、`exchange.ModifyConditionOrder`、`exchange.CancelConditionOrder`、`exchange.GetConditionOrder`、`exchange.GetConditionOrders`、`exchange.GetHistoryConditionOrders`。

##### 注意事项

| 函数 | OneInch交易所的行为 |
| - | - |
| exchange.GetTicker() | 买一、卖一为约1000美元规模的1inch报价；没有24小时统计。两个方向分别询价，报价交叉时两边都给中间价 |
| exchange.GetDepth() | 由1inch在逐档递增规模上的报价推算；卖一侧每档按精确输出近似，需要3~5次询价，耗时相应增加 |
| exchange.GetAssets() | 原生币和代币表中各代币的钱包余额 |
| exchange.CreateOrder() | 立即在链上兑换：限价为最差成交价，市价按滑点保护；市价买入时数量为要花费的计价币。1inch只支持精确输入：限价买入按“最多花费数量×价格、至少买到数量”执行，实际买到的数量可能略多于下单数量。下单附加参数```slippage```覆盖本单滑点；```route```对聚合器不适用，传入会报错 |
| exchange.GetOrder() | 订单ID形如```ETH_USDC,0x…```（交易对、逗号、交易哈希），状态来自交易回执；原交易的nonce已被撤单交易（或其它交易）占用时显示为已撤销。1inch路由没有统一的成交事件：代币按交易回执中钱包的转入转出计算；得到原生币时按交易所在区块与上一区块的余额差加手续费计算（同一区块内钱包有其它交易时会不准） |
| exchange.CancelOrder() | 发送同nonce的替换交易，并等待结果（默认最多30秒，见```exchange.IO("cancelWait", ...)```）：撤单交易先上链返回```true```；原订单先上链返回```false```；等待超时返回```true```，表示撤单已提交 |

1inch免费档每秒1次请求，连接器自动排队，遇到限频（HTTP 429）会稍等重试。

#### OKX DEX

通过OKX DEX聚合器接口在链上兑换代币，钱包由配置的助记词派生（EVM链、Tron、Solana、TON、Aptos、SUI、Starknet）。只支持同一条链上的市价兑换；行情、K线、成交、代币列表来自OKX DEX的行情接口。接口凭据默认使用平台内置的项目凭据，也可以用```exchange.IO("config", ...)```换成自己的OKX API凭据。

##### 名称与配置

```exchange.GetName()```：```OKX_DEX```（现货）；别名：OKX Web3、欧易DEX。

| 配置项 | 必填 | 说明 |
| - | - | - |
| 助记词 | 是 | 钱包助记词（BIP39，12或24个单词），各链钱包地址由它派生。 |

##### 交易对与合约代码

交易对示例：```1:ETH_USD```、```501:SOL_USD```、```1:ETH_1:USDC```

品种代码写作```<链>:<代币>_USD```（例如```1:ETH_USD```、```501:SOL_USD```），用于行情、K线、成交；下单（兑换）使用双边写法```<链>:<代币>_<链>:<代币>```，例如```1:ETH_1:USDC```，两边必须是同一条链。链可以写OKX的链号（chainIndex）或链名（```ETH```、```SOL```、```TRX```、```APT```、```SUI```、```TON```、```STRK```等，其它别名可用```regChain```注册）。

代币可以写代币名或合约地址（如```1:0xa0b8..._USD```）。**代币名区分大小写**（OKX把```BAX```与```BAx```当作两个代币）。同一条链上名字相同的多个合约（例如GALA的新旧合约）不出现在代币列表中，也不能按名字使用，需要写合约地址或用```regToken```把名字绑定到某个地址。

##### 专属IO指令

| 指令 | 参数 | 说明 |
| - | - | - |
| ```config``` | string(JSON) | 设置OKX API凭据，字段```ApiKey```、```SecretKey```、```Passphrase```、```Project```缺一不可。不设置时使用平台内置的项目凭据。 |
| ```key``` | string | 运行时更换钱包助记词（12或24个单词），解析失败时保留原钱包。 |
| ```address``` | [chainIndex] | 获取钱包在某条链上的地址，不传时为以太坊（1）。 |
| ```addresses``` | — | 导出钱包在全部链上的地址。 |
| ```slippage``` | [number] | 无参数时读取，带参数时设置兑换滑点（百分比，大于0且不超过50，默认0.5）。 |
| ```gasLevel``` | [string] | 无参数时读取，带参数时设置Gas档位：```average```（默认）、```fast```、```slow```。 |
| ```gasMultiplier``` | [number] | 无参数时读取，带参数时设置Gas倍数（≥1，默认1.5）。 |
| ```allChainBalance``` | [bool] | 无参数时读取，带参数时设置```exchange.GetAccount()```、```exchange.GetAssets()```是否查询全部链的余额（默认只查以太坊）。 |
| ```rpc``` | [chain[, url]] | 查询或设置各链的自定义RPC地址：无参数返回全部，只传链返回该链的地址，url为空字符串时删除。查询授权额度等链上读操作需要配置RPC。 |
| ```regChain``` | chainId, alias | 注册链别名，之后可以在品种代码中用别名代替链号。 |
| ```regToken``` | chainId, alias, address | 把代币名绑定到某条链上的合约地址。 |
| ```quote``` | symbol, amount | 只读报价预览（双边品种代码，例如```1:USDC_1:ETH```），不构造链上交易。 |
| ```allowance``` | symbol[, spender] | 查询钱包对spender的ERC-20授权额度（最小单位），不传spender时使用OKX DEX的路由合约。 |
| ```approve``` | symbol[, amount] | ERC-20授权（品种代码第一个代币），不传amount时为最大额度；等待交易上链。返回：交易哈希。 |
| ```signTx``` | tx, chainIndex | 只签名不广播。 |
| ```broadcast``` | signedTx, chainIndex | 广播已签名的交易。 |
| ```marketSupportedChains``` | — | 只读查询行情接口支持的链。 |
| ```balanceSupportedChains``` | — | 只读查询余额接口支持的链。 |
| ```swapSupportedChains``` | — | 只读查询兑换接口支持的链。 |
| ```broadcastSupportedChains``` | — | 只读查询广播接口支持的链。 |
| ```tokenSearch``` | chains, search | 按名称或地址搜索代币（```chains```为逗号分隔的链号）。 |
| ```allTokens``` | chainIndex | 列出某条链上可兑换的全部代币。 |

通用指令```api```、```base```、```currency```见`exchange.IO`。

##### 函数支持差异

不支持（调用时报错并返回空值）：`exchange.GetDepth`、`exchange.GetOrders`、`exchange.GetHistoryOrders`、`exchange.CancelOrder`、`exchange.ModifyOrder`、`exchange.CreateConditionOrder`、`exchange.ModifyConditionOrder`、`exchange.CancelConditionOrder`、`exchange.GetConditionOrder`、`exchange.GetConditionOrders`、`exchange.GetHistoryConditionOrders`。

以回退方式支持：

- `exchange.GetRecords`：原生周期为1分钟、3分钟、5分钟、15分钟、30分钟、1小时、2小时、4小时、6小时、12小时、1天、3天、1周、1月、3月；其它周期由托管者合成。

##### 注意事项

- 只支持市价单（```price```为-1），限价单报错；不支持跨链兑换。卖出时```amount```是品种代码第一个代币的数量，买入时是第二个代币（花费）的数量。订单ID为```<品种代码>,<交易哈希>```，用```exchange.GetOrder()```查询兑换结果。
- EVM链上花费ERC-20代币（非原生币）的兑换，下单前自动检查授权额度，不足时先发送授权交易并等待上链；检查额度需要该链的RPC，没有用```exchange.IO("rpc", chain, url)```配置时下单报错。
- 链上没有订单簿和挂单：```exchange.GetDepth()```、```exchange.GetOrders()```、```exchange.CancelOrder()```等函数报错并返回空值。
- ```exchange.GetTickers()```返回某条链的成交量排行榜，不是全部代币。
- ```exchange.GetAccount()```、```exchange.GetAssets()```默认只查询以太坊上的余额，资产名写作```链名:代币名```；用```exchange.IO("allChainBalance", true)```查询全部链。

### 预测市场

按事件结果买卖份额的市场。

#### Polymarket

Polygon链上的预测市场。交易所对象通过Polymarket的CLOB（中央限价订单簿）接口下单、查询订单簿、订单、余额和账户成交，通过Gamma接口查询市场信息，通过data接口查询持仓和市场成交；赎回、合并、拆分经Polymarket的免Gas中继（relayer）提交链上交易。全部是REST轮询，没有行情和订单推送。

##### 名称与配置

```exchange.GetName()```：```Futures_Polymarket```（预测市场）。

| 配置项 | 必填 | 说明 |
| - | - | - |
| 存款钱包地址 | 是 | Polymarket存款钱包（POLY_1271智能合约钱包）地址，即在Polymarket存入资金的钱包地址，必须是合法的0x地址，否则启动失败。订单以它为下单方，持仓和账户成交按它查询；赎回、合并、拆分要求它已在链上部署。 |
| 钱包私钥 | 是 | 用于 API 认证和订单签名的私钥。邮箱登录用户请从 reveal.magic.link/polymarket 导出；浏览器钱包用户使用 MetaMask 等钱包私钥（请妥善保管，切勿泄露） |
| Builder API Key | 是 | Polymarket Builder API Key。（详见表下） |
| Builder API Secret | 是 | Polymarket Builder API Secret，与```BuilderKey```、```BuilderPassphrase```一起用于relayer认证。 |
| Builder API Passphrase | 是 | Polymarket Builder API Passphrase，与```BuilderKey```、```BuilderSecret```一起用于relayer认证。 |

表中长说明的其余部分：

- Builder API Key：与```BuilderSecret```、```BuilderPassphrase```三项都必须填写（缺一项启动时报错），用于赎回、合并、拆分时向relayer认证；下单用的CLOB接口凭据由私钥自动派生，不用这三项。

##### 交易对与合约代码

交易对示例：```will-btc-100k_USDC```

交易对为市场（market）的标识（slug）加```_USDC```，计价币只能是```USDC```。slug区分大小写，```exchange.SetCurrency()```按原样保存、不转大写。注意是市场的slug而不是事件（event）的slug：一个多选项事件（例如「谁会赢得选举」）下的每个候选都是一个独立的二元市场，各有自己的slug。

| 合约代码 | 说明 |
| - | - |
| ```Yes``` | 结果选项「Yes」，大多数市场的两个选项是```Yes```、```No```。 |
| ```No``` | 结果选项「No」。 |
| ```Up``` | 涨跌类市场（如加密货币短周期涨跌）的结果选项，另一个是```Down```。 |
| ```Down``` | 涨跌类市场的结果选项。 |

预测市场没有永续、交割之分，也没有默认合约：合约代码就是市场的结果选项名称，每个市场恰好两个选项（体育等市场的选项可能是队名）。选项名中的空格换成```-```（例如选项「Donald Trump」写作```Donald-Trump```），完整品种代码形如```will-btc-100k_USDC.Yes```。选项名本身含```-```或```.```也照写（例如选项「Non-Fed」写作```Non-Fed```、「U.S. Fed」写作```U.S.-Fed```）。下单、行情按选项名不区分大小写匹配，但```exchange.GetPositions()```按品种代码精确比较、赎回按持仓的品种代码匹配，所以请照搬```exchange.GetMarkets()```、```exchange.GetPositions()```返回的写法。

```exchange.SetContractType()```只检查形式（不能为空、不能含空白和```.```），```swap```等写法不会当场报错，而是在之后的调用中报「outcome not found」。

获取品种代码：```exchange.GetMarkets()```每个选项一行，键就是完整品种代码；也可以用```exchange.IO("gamma", "/markets/slug/<市场slug>")```查询某个市场的```outcomes```，或用```exchange.IO("gamma", "/events/slug/<事件slug>")```列出一个事件下的各个市场。

```exchange.GetMarkets()```里每行的```Symbol```（交易所原生代码）是该选项的CLOB token ID，只用于对照交易所接口，不能当作合约代码使用。

##### 专属IO指令

| 指令 | 参数 | 说明 | 返回值 |
| - | - | - | - |
| ```proxyWalletAddress``` | — | 获取配置的存款钱包地址（EIP-55校验和格式）。 | 地址字符串。 |
| ```redeem``` | symbol[, wait] | 市场结算后，把存款钱包持有的该市场份额赎回成USDC（两个选项一起赎回，经relayer免Gas）。（详见表下） | ```wait```为```true```时返回relayer确认后的交易记录对象（```state```为```STATE_CONFIRMED```）；为```false```时立即返回```{"transactionID": "..."}```，不等确认、不刷新余额缓存。（详见表下） |
| ```merge``` | symbol[, amount[, wait]] | 把等量的两个选项份额合并回USDC（经relayer免Gas）。（详见表下） | 同```redeem```。 |
| ```split``` | symbol, amount[, wait] | 把USDC拆分成等量的两个选项份额（经relayer免Gas）。（详见表下） | 同```redeem```。 |
| ```batchOrders``` | orders | 批量下单，```orders```为1~15个订单对象的数组，全部签名后一次提交，不写交易日志。（详见表下） | 交易所原始应答数组，与```orders```逐项对应：成功的项带```orderID```，被拒的项带```errorMsg```。部分订单被拒时照常返回该数组，被拒的每一项另报一条错误日志；全部被拒或应答格式异常时报错并返回空值。 |
| ```markets_cursor``` | [string] | 查询或设置```exchange.GetMarkets()```的分页游标（传空串清除，回到第一页）；传```next```把游标推进到下一页，用法见注意事项。 | 当前（设置或推进后）的游标字符串；推进到最后一页之后为空串。当前游标还没有取过页时传```next```报错。 |
| ```tickers_cursor``` | [string] | 同```markets_cursor```，作用于```exchange.GetTickers()```，两个游标相互独立。 | 同```markets_cursor```。 |
| ```base``` | [url] / kind, url | 不传参数返回当前CLOB接口地址；传一个URL时切换CLOB地址（下单、订单、余额、账户成交、订单簿都走它），```exchange.GetBase()```、```exchange.SetBase()```即此形式。（详见表下） | 无参、一参时返回地址字符串（当前地址或修改前的地址）；```kind, url```形式返回空值。 |
| ```api``` | method, path[, params[, raw]] | 向CLOB发请求，默认带L2签名：```GET```的```params```拼成查询串，其它方法作为JSON请求体；```path```可以写完整URL（例如data接口地址）；```raw```传字符串时作为原样的查询串或请求体，传```false```时不签名。 | 交易所原始应答（JSON自动解析）；请求失败报错并返回空值。 |
| ```gamma``` | path | 向Gamma接口（市场信息）发不签名的GET请求，```path```含查询串，例如```exchange.IO("gamma", "/markets/slug/will-btc-100k")```；地址跟随```exchange.IO("base", "gamma", url)```。（详见表下） | 交易所原始应答（JSON自动解析）；请求失败返回空值。 |
| ```clob``` | path | 向CLOB接口发不签名的GET请求，例如```exchange.IO("clob", "/book?token_id=...")```；需要签名的私有接口用```exchange.IO("api", ...)```。 | 交易所原始应答（JSON自动解析）；请求失败返回空值。 |
| ```data``` | path | 向data接口（持仓、市场成交）发不签名的GET请求，例如```exchange.IO("data", "/trades?market=<conditionId>")```；地址跟随```exchange.IO("base", "data", url)```。 | 交易所原始应答（JSON自动解析）；请求失败返回空值。 |

表中长说明的其余部分：

- ```redeem```：```symbol```须与```exchange.GetPositions()```中一个可赎回（持仓原始数据的```redeemable```为```true```）且份额大于0的持仓的品种代码完全一致；存款钱包须已在链上部署。```wait```默认```true```：每2秒查询一次relayer，最多约2分钟，确认后刷新CLOB的余额缓存。也可以传对象```{symbol, wait}```。
- ```redeem```的返回值：relayer报告交易失败（```STATE_FAILED```、```STATE_INVALID```）、等待超时或刷新缓存失败时报错，错误信息带```transactionID```；后两种情况交易已经提交（超时的交易之后仍可能上链），重试前先用```exchange.GetPositions()```、```exchange.GetAccount()```核对。等待超时后，同一市场的同一操作在该交易确认或失败之前再次调用会直接报错、不重复提交。
- ```merge```：```symbol```取该市场任一选项的品种代码；```amount```为份额数（截断到6位小数），为0或不传时自动取两个选项持仓中较小的一个。```wait```同```redeem```。也可以传对象```{symbol, amount, wait}```。
- ```split```：```symbol```取该市场任一选项的品种代码；```amount```为USDC数量，必须大于0（截断到6位小数），拆出两个选项各```amount```份。```wait```同```redeem```。也可以传对象```{symbol, amount, wait}```。
- ```batchOrders```：每个对象：```symbol```（完整品种代码）、```side```（```buy```/```sell```）、```price```（小于等于0为市价单）、```amount```（份额），可选```option```对象，键与下单参数相同（```orderType```、```expiration```、```postOnly```、```deferExec```、```slippage```，见注意事项）。
- ```base```：```exchange.IO("base", kind, url)```切换各服务的地址，```kind```只能是```gamma```（市场信息、市场列表）、```data```（持仓、市场成交）、```relayer```（赎回、合并、拆分）或```clob```（同一参形式，切换CLOB地址）。一参形式只接受```http://```、```https://```开头的地址，其它值报错。
- ```gamma```：也可以把指令名写成完整的服务地址、第二个参数写路径，例如```exchange.IO("https://gamma-api.polymarket.com", "/markets/slug/will-btc-100k")```。

通用指令```currency```见`exchange.IO`。

##### 函数支持差异

不支持（调用时报错并返回空值）：`exchange.ModifyOrder`、`exchange.SetMarginLevel`、`exchange.GetFundings`、`exchange.CreateConditionOrder`、`exchange.ModifyConditionOrder`、`exchange.CancelConditionOrder`、`exchange.GetConditionOrder`、`exchange.GetConditionOrders`、`exchange.GetHistoryConditionOrders`。

以回退方式支持：

- `exchange.GetRecords`：交易所没有K线接口，由托管者用成交记录合成：首次调用只有最近成交覆盖的少量K线，随调用逐步累积。

##### 保证金、账户与模拟盘

保证金模式：没有保证金和杠杆：买入份额用USDC全额支付，```exchange.IO("cross", ...)```等保证金指令报错。

持仓模式：持仓只有多头：每个选项的份额是一个持仓（```Type```为多头），看空某个选项就买入另一个选项。```Price```为持仓均价，```Profit```为交易所给出的盈亏（```cashPnl```），```Margin```为持仓当前市值；持仓原始数据中```redeemable```为```true```表示市场已结算、可以用```redeem```赎回。没有平仓方向：用```exchange.SetDirection()```设为```closebuy```或```closesell```后下单、或下单方向写```closebuy```/```closesell```都会被拒绝，卖出就是卖出持有的份额。

账户：资金和持仓都在存款钱包（配置项```ProxyWalletAddress```）里，订单的下单方和签名方都是存款钱包，由私钥按POLY_1271（签名类型3）签名。```exchange.GetAccount()```的```Balance```为CLOB报告的可用USDC，```Equity```为```Balance```加全部持仓市值，```UPnL```为各持仓```cashPnl```之和，```FrozenBalance```恒为0。

模拟盘：没有模拟盘，所有调用都在Polygon主网上使用真实资金。

##### 注意事项

- 价格是每份的USDC价格，在0~1之间，按市场的价格步长（```exchange.GetMarkets()```的```TickSize```，0.1/0.01/0.001/0.0001）截断，大于1时按1减一个步长下单。数量单位是份额，截断到2位小数；最小下单量见```MinQty```（常见为5份），不预先检查，由交易所拒单。
- 市价单（价格传```-1```，或在下单参数中写明```type: "market"```，此时忽略价格）：CLOB只有限价单，连接器沿对手盘累计到下单量所在档位（深度不够取最后一档），以该档价格×（1±滑点）作为限价发出，滑点默认0.01，对手盘为空时报错；买卖的数量都是份额。这样下出的仍是GTC订单，未成交部分会留在盘口；需要立即成交否则撤销时，在最后一个参数传```{tif: "ioc"}```（FAK）或```{tif: "fok"}```，例如```exchange.CreateOrder(symbol, "buy", -1, 10, {tif: "ioc"})```。
- 其它下单参数写在下单方向后面，例如```exchange.CreateOrder(symbol, "buy;{\"orderType\":\"GTD\",\"expiration\":1830000000}", price, amount)```或```"buy;slippage=0.02"```：```orderType```（```GTC```默认、```GTD```、```FOK```、```FAK```）、```expiration```（GTD必填，Unix秒，须晚于当前60秒以上；非GTD订单传入会报错）、```postOnly```（仅GTC/GTD）、```deferExec```（原样传给交易所）、```slippage```（市价单滑点）。
- ```exchange.GetOrders()```、```exchange.GetPositions()```不传品种时返回全部市场；```exchange.GetHistoryOrders()```不传品种时只查当前品种，传空串查全部。
- ```exchange.GetHistoryOrders()```由账户成交记录生成：每笔成交一行（状态为已成交，同一订单多次成交会出现多行），已撤销或从未成交的订单不会出现；```since```可传毫秒或秒，不传```limit```时最多300条。
- ```exchange.GetTicker()```取该选项自己的订单簿和最新成交价，```High```、```Low```就是当前卖一、买一价（没有24小时高低价），```Volume```是整个市场（两个选项合计）的24小时成交额。```exchange.GetTickers()```取自Gamma市场列表，第二个选项的价格由第一个选项按```1 - x```换算。
- ```exchange.GetMarkets()```、```exchange.GetTickers()```每次只返回一页（约100个市场）。游标为空时只返回Gamma市场列表的第一页；调用返回当前游标处的一页，不移动游标（```exchange.SetContractType()```等内部查询也不会推进它）；取过一页后用```exchange.IO("markets_cursor", "next")```（或```tickers_cursor```）推进到下一页，最后一页之后游标回到空串。逐页翻：```exchange.IO("markets_cursor", "")```，然后循环调用```exchange.GetMarkets()```与```exchange.IO("markets_cursor", "next")```直到返回空串。也可以直接设置游标，例如Gamma接口```/markets/keyset```应答中的```next_cursor```。

### 证券与期货

证券经纪商与期货：需要托管者能访问到经纪商的网关或交易终端。

#### 富途证券

通过富途的```FutuOpenD```网关交易港股、美股、A股（A股通）和期货，支持实盘与模拟交易。需要运行托管者能访问到的[```FutuOpenD```](https://www.futunn.com/download/OpenAPI?lang=zh-CN)（交易所配置中的服务器地址，默认为本机```127.0.0.1:11111```），配置交易所对象、运行```FutuOpenD```等操作参看[富途证券配置说明文档](https://www.fmz.com/bbs-topic/10185)。

##### 名称与配置

```exchange.GetName()```：```Futures_Futu```（证券与期货）；别名：Futu。

| 配置项 | 必填 | 默认值 | 说明 |
| - | - | - | - |
| 服务器地址 | 是 | ```127.0.0.1:11111``` | FutuOpenD监听的IP和端口，例如```127.0.0.1:11111```。 |
| 交易密码 | 是 | — | 富途交易密码，用于解锁交易、访问账户信息。 |
| 模拟盘 | 否 | 不勾选 | — |

##### 交易对与合约代码

交易对示例：```00700.HK```、```AAPL.US```、```600519.SH```

品种代码格式为```代码.市场```，用```exchange.SetContractType()```（或```exchange.SetCurrency()```）设置，整段代码作为当前品种。市场后缀：```HK```港股、```US```美股、```SH```沪市、```SZ```深市、```SG```新加坡期货、```JP```日本期货。查询、撤单、改单也接受旧写法```HK.00700```。```exchange.GetMarkets()```只列出本策略已经设置过的品种。

##### 专属IO指令

| 指令 | 参数 | 说明 |
| - | - | - |
| ```refresh``` | bool | 交易类查询（GetOrder、GetOrders、GetPositions、GetAccount）是否刷新OpenD缓存，默认刷新；传```false```后使用缓存。刷新缓存的查询受富途频率限制（每30秒最多10次）。 |
| ```accounts``` | — | 获取所有交易账户列表。 |
| ```lock``` | — | 锁定交易。 |
| ```unlock``` | — | 解锁交易。 |
| ```instrument``` | symbol | 获取品种静态信息，例如```exchange.IO("instrument", "00700.HK")```。 |
| ```timeout``` | number | 设置与OpenD通信的超时时间（毫秒）。 |
| ```statusDetail``` | — | 获取连接状态详情。返回：```{"connected":..., "server":..., "simulate":...}``` |
| ```historyKlines``` | object | 获取历史K线，参数```{symbol, interval, begin, end, limit}```，```interval```单位为秒，```begin```、```end```、```limit```可省略。 |
| ```status``` | — | 固定返回```true```（兼容旧版），连接状态请用```statusDetail```。 |
| ```wait``` | [number] | JavaScript和Python策略中等待当前合约的下一笔行情或本交易所对象的下一条订单回报，返回与EventLoop事件相同结构的对象；参数为超时毫秒数，负数表示不等待，0或不传使用默认超时，超时返回空值。（详见表下） |

表中长说明的其余部分：

- ```wait```：Rust策略中固定返回```true```。

通用指令```api```、```base```、```currency```见`exchange.IO`。

##### 函数支持差异

不支持（调用时报错并返回空值）：`exchange.GetFundings`、`exchange.SetMarginLevel`、`exchange.CreateConditionOrder`、`exchange.ModifyConditionOrder`、`exchange.CancelConditionOrder`、`exchange.GetConditionOrder`。

以回退方式支持：

- `exchange.GetRecords`：原生周期为1分钟、3分钟、5分钟、15分钟、30分钟、1小时、1天、1周、1月；其它周期由托管者合成。

##### 保证金、账户与模拟盘

账户：富途用```TrdMarket```区分市场（1香港、2美国、3大陆、4香港A股通、5期货）。```exchange.GetAccount()```的```Balance```、```FrozenBalance```、```Equity```、```UPnL```取当前品种所在市场的币种（例如```00700.HK```为HKD，未设置带市场后缀的品种时为香港市场），```Stocks```、```FrozenStocks```为0；```Info```中有```accounts```（交易账户列表）和```funds```（各市场的```trdMarket```、```currency```与资金明细）。```exchange.GetAssets()```按币种汇总所有已授权市场的资金。

模拟盘：勾选「模拟盘」接入富途模拟交易。通过```FutuOpenD```接入模拟交易时，有些股票代码不支持，因而无法交易（富途牛牛手机App上可以模拟交易）。

##### 注意事项

- 不支持```exchange.IO("api", ...)```。
- ```exchange.SetDirection()```、```exchange.Buy()```/```exchange.Sell()```、```exchange.CancelOrder()```、```exchange.ModifyOrder()```、```exchange.GetOrder()```等交易函数的用法与期货市场相同。
- 富途下单只有买入、卖出两个方向，没有开平仓标志：```closebuy```（平多）按卖出提交，```closesell```（平空）按买入提交，股票与期货相同。为避免平仓单在没有持仓时开出反向仓位，托管者提交平仓单前先查询该品种的持仓：没有对应方向的持仓、可平数量（持有数量减去冻结数量）小于下单数量，或持仓查询失败时，不下单、报错并返回空值。期货持仓按具体月份合约记录，用主连代码平仓会因查不到持仓而被拒绝。同一品种不能同时持有多头和空头。查询到的订单不区分开平，```Offset```按开仓给出（富途回报为「买回」的订单除外）。
- 交易类查询默认每次都向富途服务端刷新，受富途频率限制（每30秒最多10次），超过会报错；高频轮询时用```exchange.IO("refresh", false)```改为使用```FutuOpenD```的缓存，```FutuOpenD```收到新数据时自动更新缓存。
- ```FutuOpenD```按登录的IP地址区分地区，非大陆IP登录的账户获取行情时有所限制，具体查阅富途官方文档。

#### 盈透证券

通过TWS API（socket协议）直连托管者所在机器上运行的「IB Gateway」或「TWS（Trader Workstation）」，交易盈透证券账户中的股票、期货、期权等。以TWS为例：登录后点击右上角的配置按钮，选择「配置」→「API」→「设置」，**不要**勾选「只读API」，勾选「启用ActiveX和套接字客户端」，并记下「套接字端口」（TWS默认实盘7496、模拟盘7497；IB Gateway默认实盘4001、模拟盘4002），填入交易所配置的服务器地址。鉴权在TWS或IB Gateway的登录状态中完成，交易所配置不需要密钥。

##### 名称与配置

```exchange.GetName()```：```Futures_IB```（证券与期货）；别名：IB、盈透。

| 配置项 | 必填 | 默认值 | 说明 |
| - | - | - | - |
| 服务器地址 | 是 | ```localhost:7496``` | TWS或IB Gateway的API地址和端口，例如```localhost:7496```。 |
| 行情类型 | 是 | ```1``` | 实时数据、冻结数据、延迟数据、延迟冻结数据之一。没有订阅实时行情的账户可以选择延迟数据。运行中可用```exchange.IO("marketDataType", n)```切换。可选：```实时数据```、```冻结数据```、```延迟数据```、```延迟冻结数据``` |

##### 交易对与合约代码

交易对示例：```AAPL.US```、```TSLA.US```

用```exchange.SetContractType()```设置，格式为```代码.货币[.类型[.交易所]]```，类型缺省为股票```STK```，交易所缺省为```SMART```，整串作为一个品种：

- 美股：```AAPL.US```、```TSLA.US```（```US```表示美元计价，```HK```表示港币计价，其它货币直接写货币代码）。
- 期货（```FUT```）：```代码-到期月份[-乘数].货币.FUT.交易所```，到期月份写成```YYYYMM```，交易所为IB的交易所代码。
- 期权（```OPT```）与期货期权（```FOP```）：```代码-到期-C或P-行权价×100[-乘数].货币.OPT或FOP.交易所```，行权价乘以100后写成整数。
- 纯数字：直接作为IB的合约ID（conId）。

持仓、订单的```Symbol```是简写形式（如```Z74.SGD```），```exchange.GetPositions()```、```exchange.GetOrders()```传入简写或下单时用的完整代码（如```Z74.SGD.STK.SGX```）都可以。

##### 专属IO指令

| 指令 | 参数 | 说明 |
| - | - | - |
| ```status``` | — | 与TWS/IB Gateway的会话是否已建立（不主动建立连接）。 |
| ```time``` | — | 获取IB服务器时间（毫秒时间戳）。 |
| ```accounts``` | — | 获取托管账户列表。 |
| ```reqId``` | — | 强制获取新请求ID。 |
| ```orderId``` | — | 获取下一个可用订单ID。 |
| ```ignore``` | codes | 设置同步请求时忽略的TWS错误码，参数为错误码数组或数组的JSON字符串。返回：设置后的错误码列表。 |
| ```scan``` | object | 执行市场扫描器，参数为扫描订阅字段（对象或JSON字符串），必须包含```Instrument```，例如```STK```配合```LocationCode```为```STK.US.MAJOR```。 |
| ```wait``` | [number] | JavaScript和Python策略中等待当前合约的下一笔行情或本交易所对象的下一条订单回报，返回与EventLoop事件相同结构的对象；参数为超时毫秒数，负数表示不等待，0或不传使用默认超时，超时返回空值。（详见表下） |
| ```debug``` | [bool] | 查询或设置调试模式：开启后把与TWS/IB Gateway收发的每一帧按TWS API日志的格式输出到日志。 |
| ```marketDataType``` | number | 切换行情数据类型（1实时、2冻结、3延迟、4延迟冻结）。返回：```true``` |
| ```api``` | msgId, ...fields \| name[, params[, filterMsgId[, timeout]]] | 发送原始TWS消息（```[消息ID, 字段...]```，发送后返回```true```）；或按旧版请求名调用（如```ReqCurrentTime```、```ReqContractDetails```），等待并返回指定消息ID的应答。 |

表中长说明的其余部分：

- ```wait```：Rust策略中返回下一条完整的TWS消息。

通用指令```base```、```currency```见`exchange.IO`。

##### 函数支持差异

不支持（调用时报错并返回空值）：`exchange.GetTrades`、`exchange.GetHistoryOrders`、`exchange.GetFundings`、`exchange.SetMarginLevel`、`exchange.ModifyOrder`、`exchange.CreateConditionOrder`、`exchange.ModifyConditionOrder`、`exchange.CancelConditionOrder`、`exchange.GetConditionOrder`、`exchange.GetConditionOrders`、`exchange.GetHistoryConditionOrders`。

以回退方式支持：

- `exchange.GetRecords`：原生周期为1分钟、3分钟、5分钟、15分钟、30分钟、1小时、2小时、4小时、6小时、1天、1周；其它60秒整数倍的周期由托管者用原生K线合成，其余周期（如秒级）不可用（本交易所对象不支持```exchange.GetTrades()```）。

##### 注意事项

- 托管者以实盘ID作为连接TWS的客户端号（clientId），实盘重启后客户端号不变，仍可撤销此前挂出的订单。TWS只允许订单的原始客户端号（或主客户端）撤销订单；```exchange.GetOrder()```只能查到本客户端号的订单。
- 行情为快照：```exchange.GetDepth()```只有买一、卖一一档；```exchange.GetTickers()```返回本次运行中已经使用过的合约的行情。
- ```exchange.GetMarkets()```通过市场扫描器（```STK```、```STK.US.MAJOR```）取得合约列表，再逐个查询合约详情取精度。
- 订单被网关拒绝时，订单```Info```中的```Reject```字段记录拒单原因。

### 链上与自定义接入

直接访问区块链节点的交易所对象，以及按通用协议接入自建交易所。

#### 通用协议

用于接入平台还未封装的交易所（```exchange.GetName()```为```Exchange```）：标准函数不直接访问任何交易所，而是把请求转发给用户自建的协议插件程序（网关），由它对接交易所的REST、FIX等接口。协议插件程序的写法参看[REST协议参考文档](https://www.fmz.com/digest-topic/10518)与[FIX协议参考项目](https://github.com/fmzquant/fixc)。

每次调用都是向配置的服务地址发送一次HTTP POST，请求体为JSON：```{"access_key", "secret_key", "nonce", "method", "params"}```（```nonce```为纳秒时间戳），请求头```Http-Method```为```POST```（```exchange.IO("api", ...)```时为调用方指定的方法），```Content-Type```为```application/x-www-form-urlencoded```。应答顶层有```error```键即为失败（```null```、空字符串也算失败），业务数据在```data```中。

| 函数 | 网关方法 | params |
| - | - | - |
| exchange.GetTicker() | ticker | symbol |
| exchange.GetDepth() | depth | symbol, limit |
| exchange.GetTrades() | trades | symbol |
| exchange.GetRecords() | records | symbol, limit（默认200）, period（分钟） |
| exchange.GetAccount() | accounts（网关报错时改用assets） | 无 |
| exchange.GetAssets() | assets | 无 |
| exchange.CreateOrder() / exchange.Buy() / exchange.Sell() | trade | symbol, type, price, amount |
| exchange.GetOrders() | orders | symbol |
| exchange.GetHistoryOrders() | historyorders | symbol, since, limit |
| exchange.GetOrder() | order | id, symbol |
| exchange.CancelOrder() | cancel | id, symbol |

##### 名称与配置

```exchange.GetName()```：```Exchange```（自定义接入）；别名：自定义交易所、Custom Exchange。

| 配置项 | 必填 | 说明 |
| - | - | - |
| 服务地址 | 是 | 协议插件程序（网关）的完整地址，只支持```http://```、```https://```，请求直接POST到这个地址。 |
| Access Key | 是 | 原样放进请求体的```access_key```。 |
| Secret Key | 是 | 原样放进请求体的```secret_key```。 |

##### 交易对与合约代码

交易对示例：```BTC_USDT```

交易对按```BTC_USDT```书写，发给网关时转为小写（```btc_usdt```）。

##### 专属IO指令

| 指令 | 参数 | 说明 | 返回值 |
| - | - | - | - |
| ```api``` | httpMethod, name[, params] | 调用网关的自定义方法```__api_<name>```，请求头```Http-Method```为```httpMethod```；```params```为对象，或```"a=1&b=2"```形式的字符串（值按整数、浮点数、JSON、字符串的顺序识别类型）。 | 网关的整个应答（不只是```data```）。 |
| ```io``` | code, ...args | 把数字指令```code```和参数转发给网关的```io```方法（params为```{code, args}```）；也可以直接写```exchange.IO(code, ...args)```。```code```为4时不转发，第一个参数作为本地的IO指令执行。 | 网关应答的```data```。 |

通用指令```base```、```currency```见`exchange.IO`。

##### 函数支持差异

不支持（调用时报错并返回空值）：`exchange.GetTickers`、`exchange.GetMarkets`、`exchange.ModifyOrder`、`exchange.CreateConditionOrder`、`exchange.ModifyConditionOrder`、`exchange.CancelConditionOrder`、`exchange.GetConditionOrder`、`exchange.GetConditionOrders`、`exchange.GetHistoryConditionOrders`。

以回退方式支持：

- `exchange.GetRecords`：网关的```records```只接受1分钟、3分钟、5分钟、15分钟、30分钟、1小时、1天周期，其它周期由托管者合成；不支持指定起始时间。

##### 注意事项

- 下单（网关方法```trade```）：```type```为```buy```、```sell```，平仓单为```closebuy```、```closesell```，也可以在下单附加参数中用```direction```直接指定；市价单```price```为```"-1"```；其余附加参数原样并入```params```。不支持只做Maker（postOnly）和GTC以外的有效期。
- ```exchange.GetAccount()```先调用网关的```accounts```方法，网关应答错误（例如不支持该方法）时改调```assets```方法，因此只实现```assets```的网关也可以使用；```exchange.GetAssets()```只调用```assets```方法。两个方法的应答```data```都是```[{currency, free, frozen}]```。
- 请求默认超时30秒。

#### Web3

连接EVM链或TRON链的节点（配置项「ChainType」选ETH或TRON），通过```exchange.IO()```的各个指令读写链上数据：注册ABI后调用合约、编码解码、签名、批量查询、事件日志、发送交易和管理nonce等。EVM侧使用节点的JSON-RPC，节点所在的链由节点决定（Ethereum、BNB Smart Chain、Base、Arbitrum等任意EVM链）；TRON侧使用全节点的HTTP接口（```/wallet/*```）。

标准交易函数中只支持```exchange.GetAssets()```、```exchange.GetAccount()```（钱包的原生币余额）。在去中心化交易所兑换代币请使用Uniswap交易所对象：它可以直接使用```exchange.GetTicker()```、```exchange.CreateOrder()```等标准函数。

##### 名称与配置

```exchange.GetName()```：```Web3```（自定义接入）；别名：以太坊、Ethereum、波场、TRON。

| 配置项 | 必填 | 默认值 | 说明 |
| - | - | - | - |
| 链类型 | 是 | ```ETH``` | ETH表示EVM链（具体哪条链由节点决定），TRON表示波场。可选：```ETH```、```TRON``` |
| 钱包私钥 | 是 | — | 钱包私钥（十六进制，```0x```前缀可选）。只读用法可以不填，运行中可用```exchange.IO("key", ...)```切换。 |
| 节点地址 | 否 | ```http://127.0.0.1:8545``` | EVM为JSON-RPC节点地址，多个节点用逗号分隔互为备用；TRON为全节点HTTP地址（只能一个，旧的gRPC地址会换成对应的HTTP地址）。 |
| 节点认证 | 否 | — | EVM：```Header-Name: value```形式的请求头，或Basic认证值；TRON：作为```TRON-PRO-API-KEY```请求头发送。 |

##### 交易对与合约代码

交易对示例：```ETH_USDT```

交易对不参与链上操作，任意```BASE_QUOTE```形式都可以设置。合约、代币用地址指定：EVM为```0x```开头的地址，TRON为```T```开头的地址。

##### 专属IO指令

| 指令 | 参数 | 说明 | 返回值 |
| - | - | - | - |
| ```abi``` | address, abiContent | 为合约地址注册ABI（JSON字符串，或内置模板名```weth```、```uniswapV3Pool```、```uniswapV3Factory```、```uniswapV3QuoterV2```、```uniswapV3SwapRouter02```、```uniswapV3PositionManager```、```permit2```，PancakeSwap V3有对应的```pancakeV3*```别名）。见子页`exchange.IO("abi", ...)`。 | — |
| ```api``` | address \| "eth" \| "tron", method, ...args[, options] | 第一个参数为合约地址时调用合约方法：只读方法（```view```、```pure```）返回解码后的值，写方法签名并广播后返回交易哈希（```options```可设```gasLimit```、```gasPrice```、```nonce```、```dryRun```）。见子页`exchange.IO("api", ...)`。 | — |
| ```call``` | address, method \| calldata, ...args[, options] | 以```eth_call```模拟执行合约的任意方法（包括写方法），不签名、不广播、不消耗gas，用于询价、交易预演；```options```为```{from, value, block, gasLimit}```。仅EVM。见子页`exchange.IO("call", ...)`。 | 方法名调用返回解码后的值（没有返回值时为```true```）；calldata调用返回原始返回数据（十六进制字符串）。 |
| ```multicall``` | calls[, options] | 通过Multicall3合约在同一区块状态上一次读取多个合约调用，```calls```每项为```[合约地址, 方法, ...参数]```；```options```为```{allowFailure, block, multicall}```。见子页`exchange.IO("multicall", ...)`。 | 与```calls```顺序一致的结果数组。 |
| ```logs``` | query | 查询合约的事件日志（```eth_getLogs```）并按ABI解码；```query```为```{address, event, filter, fromBlock, toBlock, topics, blockHash}```。仅EVM。见子页`exchange.IO("logs", ...)`。 | 日志数组，能解码时每项另有```event```、```args```。 |
| ```waitReceipt``` | txHash[, options] | 等待交易上链并达到确认数，```options```为```{timeout, confirmations, interval}```（默认最长等待120秒）。仅EVM。见子页`exchange.IO("waitReceipt", ...)`。 | 交易回执（```status```为数字，```events```为解码后的事件）；超时返回空值。 |
| ```nonce``` | ["sync" \| number] | 查看发送交易使用的nonce计数；传```sync```按节点的pending计数重新同步，传数字设置本地下一个nonce。仅EVM。见子页`exchange.IO("nonce", ...)`。 | ```{address, latest, pending, local}```（数值均为字符串）。 |
| ```speedUp``` | txHash[, options] | 给还未上链的交易加价重发（同nonce，接收地址、金额、调用数据和gas上限不变）；```options```为```{multiplier, dryRun}```，```multiplier```范围1.1到10，默认1.125。仅EVM。见子页`exchange.IO("speedUp", ...)`。 | 替换交易的哈希；```dryRun```时返回替换交易的内容。 |
| ```cancelTx``` | txHash[, options] | 取消还未上链的交易：用同一个nonce发送一笔转给自己的0金额交易，手续费更高；```options```同```speedUp```。不保证成功。仅EVM。见子页`exchange.IO("cancelTx", ...)`。 | 取消交易的哈希；```dryRun```时返回取消交易的内容。 |
| ```encode``` | [address, ]dataFormat, ...args | 按类型表做标准ABI编码（同Solidity的```abi.encode```）；第一个参数为合约地址时编码该合约的方法调用（calldata）。见子页`exchange.IO("encode", ...)`。 | 不带```0x```的十六进制字符串。 |
| ```encodePacked``` | dataFormat, ...args | 按类型表做紧凑编码（同Solidity的```abi.encodePacked```）。见子页`exchange.IO("encodePacked", ...)`。 | 不带```0x```的十六进制字符串。 |
| ```decode``` | dataFormat, data | 按类型表解码十六进制数据。见子页`exchange.IO("decode", ...)`。 | 只有一个类型时直接返回值，多个类型时返回数组。 |
| ```hash``` | algo, inputFormat, outputFormat, data[, keyFormat, key] | 计算哈希摘要、HMAC，或用配置的私钥签名等，参数与`Encode`函数相同；常用于计算```keccak256```。见子页`exchange.IO("hash", ...)`。 | — |
| ```key``` | privateKey | 切换交易所对象使用的私钥（十六进制，```0x```前缀可选）；私钥无效时报错，不切换。不能并发切换。见子页`exchange.IO("key", ...)`。 | — |
| ```sign``` | hash[, key] | 用secp256k1私钥对32字节哈希签名（不再做哈希），用于EIP-712等链下签名；不传```key```时用配置的私钥。见子页`exchange.IO("sign", ...)`。 | ```{r, s, v, signature, vs}```（```v```为27或28，```vs```为EIP-2098紧凑签名）。 |
| ```signTypedData``` | typedData[, key] \| domain, types, message[, key] | 按EIP-712对结构化数据签名，一步完成类型哈希、域分隔符、结构体哈希和摘要计算。见子页`exchange.IO("signTypedData", ...)`。 | 同```sign```，另有```digest```（EIP-712摘要）。 |
| ```signMessage``` | message[, key] | 按EIP-191（```personal_sign```）对消息签名；字符串按UTF-8签名，原始字节传```{hex: "0x..."}```。见子页`exchange.IO("signMessage", ...)`。 | 同```sign```，另有```digest```（EIP-191消息哈希）。 |
| ```toUnits``` | amount, decimals | 把可读数量换算为链上整数，按字符串精确计算；```decimals```可以是数字或代币合约地址（自动读取```decimals()```）。小数位多于精度时报错。见子页`exchange.IO("toUnits", ...)`。 | 十进制字符串。 |
| ```fromUnits``` | amount, decimals | 把链上整数换算为可读数量，按字符串精确计算；```decimals```同```toUnits```。见子页`exchange.IO("fromUnits", ...)`。 | 十进制字符串（去掉末尾的0）。 |
| ```uniswapV3``` | fn, ...args | 集中流动性计算：```tickToPrice```、```priceToTick```、```sqrtPriceToPrice```、```tickToSqrtPrice```、```sqrtPriceToTick```、```nearestUsableTick```、```amountsForLiquidity```、```liquidityForAmounts```；精度参数可以是数字或代币地址。见子页`exchange.IO("uniswapV3", ...)`。 | — |
| ```contracts``` | [chainId] | 当前链（或指定链）的常用合约地址：主流代币、Multicall3、Permit2，以及Uniswap V3、PancakeSwap V3的Factory、路由、QuoterV2、头寸管理合约。见子页`exchange.IO("contracts", ...)`。 | ```{chainId, name, wrappedNative, tokens, multicall3, permit2, uniswapV3, pancakeV3}``` |
| ```address``` | [key] | 配置的钱包地址（EVM为```0x```开头的小写地址，TRON为```T```开头的地址）；传入私钥时返回该私钥的地址，不切换私钥。见子页`exchange.IO("address")`。 | — |
| ```base``` | [address] | 查询或设置RPC节点地址。EVM支持多个节点互为备用（数组或逗号分隔），每个节点第一次使用时核对chainId；TRON只支持一个全节点HTTP地址，旧的gRPC地址```grpc.trongrid.io:50051```等换成对应的HTTP地址。见子页`exchange.IO("base", ...)`。 | 设置前的节点地址；不传参数时返回当前地址。 |
| ```sendBase``` | [url] | 设置只用来广播交易的节点（Flashbots Protect、MEV Blocker等私有交易通道），读取、查nonce、估算gas仍用配置的节点；传空字符串清除。仅EVM。见子页`exchange.IO("sendBase", ...)`。 | 设置前的发送节点地址，未设置时为空字符串。 |

通用指令```currency```见`exchange.IO`。

##### 函数支持差异

不支持（调用时报错并返回空值）：`exchange.GetTicker`、`exchange.GetTickers`、`exchange.GetDepth`、`exchange.GetTrades`、`exchange.GetRecords`、`exchange.GetMarkets`、`exchange.CreateOrder`、`exchange.Buy`、`exchange.Sell`、`exchange.CancelOrder`、`exchange.ModifyOrder`、`exchange.GetOrder`、`exchange.GetOrders`、`exchange.GetHistoryOrders`、`exchange.CreateConditionOrder`、`exchange.ModifyConditionOrder`、`exchange.CancelConditionOrder`、`exchange.GetConditionOrder`、`exchange.GetConditionOrders`、`exchange.GetHistoryConditionOrders`。

##### 注意事项

- ```exchange.GetAssets()```返回钱包的原生币余额：EVM按节点的chainId确定币名（ETH、BNB、POL、AVAX等，认不出的链报错），TRON为TRX；```exchange.GetAccount()```按当前交易对从中取值（例如交易对为```ETH_USDT```时```Stocks```为ETH余额）。代币余额用```exchange.IO("api", 代币地址, "balanceOf", 地址)```查询。

##### exchange.IO("abi", ...)

```
exchange.IO(k, address, abiContent)
```

Forms:

- `exchange.IO("abi", ...)`

在发明者量化交易平台主要通过```exchange.IO()```函数实现区块链相关的各种功能、调用。以下文档把```exchange.IO()```函数根据其功能分别描述。 ```exchange.IO("abi", ...)```函数的调用方式用于注册ABI。
- 支持以太坊（eth）
- 支持波场（tron）

Parameters:

- `k` (string, required): 固定为```abi```，用于注册```ABI```。
- `address` (string, required): 智能合约的地址。
- `abiContent` (string, required): 智能合约的```ABI```（JSON字符串），或内置模板名，例如```weth```、```uniswapV3Pool```、```permit2```；全部模板名见备注。

注册Uniswap SwapRouter02合约exactOutput方法的ABI片段。

```javascript
function main() {
    // register Uniswap SwapRouter02 abi
    var routerAddress = "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45"
    var abi = `[{"inputs":[{"components":[{"internalType":"bytes","name":"path","type":"bytes"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"uint256","name":"amountInMaximum","type":"uint256"}],"internalType":"struct IV3SwapRouter.ExactOutputParams","name":"params","type":"tuple"}],"name":"exactOutput","outputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"}],"stateMutability":"payable","type":"function"}]`

    // abi只使用了局部的exactOutput方法的内容，完整的abi可以在网上搜索
    exchange.IO("abi", routerAddress, abi)
}
```

使用内置模板注册Uniswap V3头寸管理合约，并查询最近的头寸。

```javascript
function main() {
    var npm = "0xC36442b4a4522E871399CD717aBDD847Ab11FE88"   // Uniswap V3 头寸管理合约（以太坊主网）
    // 第二个参数传模板名，使用内置的常用合约 ABI
    exchange.IO("abi", npm, "uniswapV3PositionManager")
    // 模板中包含事件定义：查询最近 100 个区块新增流动性的头寸
    var logs = exchange.IO("logs", { address: npm, event: "IncreaseLiquidity", fromBlock: -100 })
    if (logs.length > 0) {
        var id = logs[logs.length - 1].args.tokenId
        var pos = exchange.IO("api", npm, "positions", id)
        Log("头寸", id, "持有人:", exchange.IO("api", npm, "ownerOf", id))
        Log("区间 tick:", pos.tickLower, "~", pos.tickUpper, "流动性:", pos.liquidity)
    }
}
```

调用的智能合约方法如果是标准ERC20方法，则不需要注册。

获取合约的```ABI```内容可以使用Etherscan的V2接口（需要Etherscan的API Key，```chainid```为链ID），只取```result```字段，例如：
```url
https://api.etherscan.io/v2/api?chainid=1&module=contract&action=getabi&address=0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45&apikey=YourApiKey
```

使用方法名调用时，优先使用该地址注册的ABI中的方法，其次是内置的ERC20方法；同名的重载方法需要使用完整的方法签名区分，例如```"permit(address,((address,uint160,uint48,uint48),address,uint256),bytes)"```。

内置模板包含常用的函数和事件定义，事件可以配合```exchange.IO("logs", ...)```、```exchange.IO("waitReceipt", ...)```解码；常用合约地址可以通过```exchange.IO("contracts", ...)```获取。

波场（TRON）上调用没有注册ABI的合约方法时，会自动从链上读取该合约的ABI并缓存；链上读取不到时报错，需要用```exchange.IO("abi", ...)```手动注册。

```abiContent```也可以传入内置模板名：```weth```（包装币的```deposit```、```withdraw```方法，别名```wbnb```、```wrappedNative```）、```uniswapV3Pool```、```uniswapV3Factory```、```uniswapV3QuoterV2```、```uniswapV3SwapRouter02```、```uniswapV3PositionManager```、```permit2```。PancakeSwap V3对应的合约使用相同模板，也可以写```pancakeV3Pool```、```pancakeV3Factory```、```pancakeV3QuoterV2```、```pancakeV3SmartRouter```、```pancakeV3PositionManager```，或通用别名```v3Pool```、```v3Factory```、```v3QuoterV2```、```v3Router```、```v3PositionManager```。模板名不存在时报错。

See also: `Web3`, `exchange.IO`, `exchange.IO("api")`, `exchange.IO("encode")`, `exchange.IO("decode")`, `exchange.IO("logs")`

##### exchange.IO("api", blockChain, ...)

```
exchange.IO(k, blockChain, rpcMethod)
exchange.IO(k, blockChain, rpcMethod, ...args)
```

Forms:

- `exchange.IO("api", "eth", ...)`

调用以太坊RPC方法（需要Web3交易所对象配置时选择eth）。
```exchange.IO("api", "tron", ...)```函数的调用方式，用于调用波场RPC方法（需要Web3交易所对象配置时选择tron）。

Parameters:

- `k` (string, required): 固定为```api```，用于扩展调用请求。
- `blockChain` (string, required): 区块链网络：```eth```表示调用以太坊网络的RPC方法；```tron```表示调用波场的RPC方法。
- `rpcMethod` (string, required): ```exchange.IO()```函数调用的RPC方法。
- `arg` (string / number / bool / object / array / any, optional): 要调用的RPC方法的参数。
```arg```参数可能有多个，```arg```参数的类型与个数根据```rpcMethod```参数指定的RPC方法而定。

Returns (string / number / bool / object / array / any): 调用的RPC方法的返回值。

查询钱包中ETH的余额。

```javascript
// 链上整数数量 -> 可读数量。decimals为代币精度，ETH是18，USDT/USDC是6。
// 十进制串、0x串都收：eth_getBalance等RPC方法返回的就是0x串。
function toAmount(raw, decimals) {
    var t = String(raw).trim()
    if (t.slice(0, 2).toLowerCase() == "0x") t = BigInt(t).toString()
    var d = Number(decimals) || 0
    if (d == 0) return Number(t)
    var s = t.length > d ? t : new Array(d - t.length + 2).join("0") + t
    var frac = s.slice(s.length - d).replace(/0+$/, "")
    return Number(s.slice(0, s.length - d) + (frac ? "." + frac : ""))
}

function main() {
    // "owner" 需要替换为具体钱包地址
    // "latest"字符串位置的参数标签：'latest'、'earliest'或'pending'，
    // 参考https://eth.wiki/json-rpc/API#the-default-block-parameter
    // 返回值 ethBalance 为十六进制字符串：0x9b19ce56113070
    var ethBalance = exchange.IO("api", "eth", "eth_getBalance", "owner", "latest")

    // ETH的精度单位为1e18
    var ethDecimal = 18

    // 链上数量都是整数，换算成可读数量要按精度移小数点。小数点按字符串移动，只有最后 Number() 转成数字时
    // 可能有末位舍入：0x9b19ce56113070（43656995388076144）打印为0.043656995388076145，精确值是0.043656995388076144。
    // 需要精确结果时用 exchange.IO("fromUnits", ethBalance, 18)，返回十进制字符串
    Log(toAmount(ethBalance, ethDecimal))
}
```

ETH转账，可以根据具体需求设置```{gasPrice: 11, gasLimit: 111, nonce: 111}```参数，该参数设置在```exchange.IO()```函数的最后一个参数上。不需要的选项可以省略。注意普通转账不设置```gasPrice```时按固定的100 Gwei出价、```gasLimit```默认为21000，建议先用```eth_gasPrice```查询gas价格后传入。

该参数还支持```data```和```dryRun```：```data```为任意调用数据（```0x```开头的十六进制字符串），用于直接发送聚合器、Pendle等API返回的交易```{to, data, value}```，设置```data```时gas价格和gasLimit按合约调用的方式由节点估算；```dryRun```设置为```true```时只签名不广播，返回包含```hash```、```raw```（签名后的交易）、```nonce```、```gasLimit```等字段的对象，可用于检查交易内容或交给其它渠道发送。例如：```exchange.IO("api", "eth", "send", router, value, {data: calldata, dryRun: true})```。发送前可以先用```exchange.IO("call", router, calldata, {value: value})```预演。不设置```nonce```时自动分配并与链上同步，连续发送不会重复使用nonce，参看```exchange.IO("nonce", ...)```；交易长时间未上链可以用```exchange.IO("speedUp", ...)```加价重发或用```exchange.IO("cancelTx", ...)```取消。

```javascript
// 可读数量 -> 链上整数数量（字符串）。全程按字符串移小数点，不经过浮点数，
// 超过2^53的数量也不会丢位。要表示17位以上有效数字时，amount请传字符串。
function toInnerAmount(amount, decimals) {
    var t = String(amount), d = Number(decimals) || 0
    var m = /^([0-9]*)(?:\.([0-9]*))?[eE]([+-]?[0-9]+)$/.exec(t)
    if (m) {   // 摊平科学计数法：0.0000001 会被JavaScript写成 1e-7
        var digits = (m[1] || "") + (m[2] || ""), point = (m[1] || "").length + parseInt(m[3], 10)
        t = point <= 0 ? "0." + new Array(1 - point).join("0") + digits
            : point >= digits.length ? digits + new Array(point - digits.length + 1).join("0")
            : digits.slice(0, point) + "." + digits.slice(point)
    }
    var dot = t.indexOf("."), int = dot < 0 ? t : t.slice(0, dot)
    var frac = dot < 0 ? "" : t.slice(dot + 1)
    frac = frac.slice(0, d)                       // 超出精度的小数位直接截掉
    while (frac.length < d) frac += "0"
    return (int + frac).replace(/^0+(?=[0-9])/, "")
}

function main() {
    // ETH的精度单位为1e18
    var ethDecimal = 18

    // 转账数量，可读的数量例如：0.01个ETH
    var sendAmount = 0.01

    // 转换为链上处理的数据：0.01 -> "10000000000000000"
    var amount = toInnerAmount(sendAmount, ethDecimal)

    // "toAddress"为转账时接收方的ETH钱包地址，需要具体填写，amount为转账数量
    exchange.IO("api", "eth", "send", "toAddress", amount)
}
```

查询```gasPrice```。

```javascript
// toAmount函数可以把hex编码的数值转换为十进制数值，decimals传0表示不移小数点
function toAmount(raw, decimals) {
    var t = String(raw).trim()
    if (t.slice(0, 2).toLowerCase() == "0x") t = BigInt(t).toString()
    var d = Number(decimals) || 0
    if (d == 0) return Number(t)
    var s = t.length > d ? t : new Array(d - t.length + 2).join("0") + t
    var frac = s.slice(s.length - d).replace(/0+$/, "")
    return Number(s.slice(0, s.length - d) + (frac ? "." + frac : ""))
}

function main() {
    var gasPrice = exchange.IO("api", "eth", "eth_gasPrice")
    Log("gasPrice:", toAmount(gasPrice, 0))
    // 输出：gasPrice: 5000000000（单位wei，即5 gwei）
    Log("gasPrice:", toAmount(gasPrice, 9), "gwei")   // gwei的精度单位为1e9
}
```

查询```eth_estimateGas```。

```javascript
// toAmount函数可以把hex编码的数值转换为十进制数值
function toAmount(raw, decimals) {
    var t = String(raw).trim()
    if (t.slice(0, 2).toLowerCase() == "0x") t = BigInt(t).toString()
    var d = Number(decimals) || 0
    if (d == 0) return Number(t)
    var s = t.length > d ? t : new Array(d - t.length + 2).join("0") + t
    var frac = s.slice(s.length - d).replace(/0+$/, "")
    return Number(s.slice(0, s.length - d) + (frac ? "." + frac : ""))
}

function main() {
    // 编码approve（授权）方法的调用
    var data = exchange.IO("encode", "0x111111111117dC0aa78b770fA6A738034120C302", "approve", "0xe592427a0aece92de3edee1f18e0157c05861564", "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff")
    Log("data:", data)
    var gasPrice = exchange.IO("api", "eth", "eth_gasPrice")
    Log("gasPrice:", toAmount(gasPrice, 0))
    var obj = {
        "from" : "0x0xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",   // walletAddress
        "to"  : "0x111111111117dC0aa78b770fA6A738034120C302",
        "gasPrice" : gasPrice,
        "value" : "0x0",
        "data" : "0x" + data,
    }

    var gasLimit = exchange.IO("api", "eth", "eth_estimateGas", obj)
    Log("gasLimit:", toAmount(gasLimit, 0))

    // 手续费 = gasLimit * gasPrice，两个都是wei单位的大整数，用BigInt相乘避免丢精度，
    // 再按1e18换算成可读的ETH数量
    Log("gas fee", toAmount((BigInt(gasLimit) * BigInt(gasPrice)).toString(), 18))
}
```

```exchange.IO()```函数的第二个参数为```eth```时，可以直接调用以太坊节点服务器可用的RPC方法。

调用节点方法时原样返回节点给出的```result```。节点返回```null```时（例如交易还未上链时的```eth_getTransactionReceipt```）返回空值，不报错；节点返回错误时返回空值，```GetLastError()```中有错误信息，合约revert的原因会解码为可读文本。

```exchange.IO("api", "eth", "send", toAddress, value[, options])```从当前钱包转出原生币，```value```为链上整数（wei），返回交易哈希。不带```data```的普通转账发送传统（legacy）交易：不设置```gasPrice```时固定按100 Gwei（附加一个很小的随机值）出价，不设置```gasLimit```时为21000，在以太坊主网上通常偏高，建议先用```eth_gasPrice```查询后传入。设置```data```时按合约调用处理：gas上限由节点估算，gas价格与合约写方法相同（支持EIP-1559的链发送EIP-1559交易，参看```exchange.IO("api", ...)```）。

波场（TRON）上第二个参数写```tron```，方法名不区分大小写，例如```GetNowBlock```、```GetAccount```、```GetTransactionInfoByID```、```TRC20ContractBalance```。```send```的参数为收款地址和TRX数量（单位sun，1 TRX = 1000000 sun），返回不带```0x```的交易ID。需要签名的方法（转账、触发合约等）会自动签名并广播。未内置的全节点接口可以直接传路径和请求体：```exchange.IO("api", "tron", "/wallet/接口名", {请求体})```。

See also: `Web3`, `exchange.IO`, `exchange.IO("fromUnits")`, `exchange.IO("toUnits")`, `exchange.IO("api")`, `exchange.IO("nonce")`

##### exchange.IO("encode", ...)

```
exchange.IO(k, dataFormat, ...args)
exchange.IO(k, address, dataFormat)
exchange.IO(k, address, dataFormat, ...args)
```

Forms:

- `exchange.IO("encode", ...)`

数据编码。

Parameters:

- `k` (string, required): 固定为```encode```，用于数据编码。
- `address` (string, optional): 智能合约的地址。 在调用```exchange.IO("encode", ...)```函数时，如果传入```address```参数表示编码（encode）智能合约上的方法调用。在调用```exchange.IO("encode", ...)```函数时，如果未传入```address```参数，则该函数用于编码指定的类型顺序，功能等同```Solidity```中的```abi.encode```。
- `dataFormat` (string, required): 编码数据的方法、类型、顺序。
- `arg` (string / number / array / any, optional): 与```dataFormat```参数匹配的具体数据值。
```arg```参数可能有多个，```arg```参数的类型与个数根据```dataFormat```参数设置而定。元组（tuple）按数组传入。

Returns (string): 编码后的数据。

编码```unwrapWETH9```方法的调用为例。

```javascript
function main() {
    // ContractV3SwapRouterV2 主网地址 : 0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45
    // 调用unwrapWETH9方法需要先注册ABI，此处省略注册
    // "owner"代表钱包地址，需要具体填写；1为amountMinimum，即最少解包装数量，单位为wei（不是1个WETH）：
    // 路由合约把自己持有的全部WETH解包装为ETH转给owner，数量少于amountMinimum时交易失败
    var data = exchange.IO("encode", "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45",
        "unwrapWETH9(uint256,address)", 1, "owner")
    Log(data)
}
```

等同```Solidity```中```abi.encode```的编码范例。

```javascript
function main() {
    var x = 10
    var address = "0x02a5fBb259d20A3Ad2Fdf9CCADeF86F6C1c1Ccc9"
    var str = "Hello World"
    var array = [1, 2, 3]
    // uint 等同 uint256，也可以直接写 uint
    var ret = exchange.IO("encode", "uint256,address,string,uint256[]", x, address, str, array)
    Log("ret:", ret)
    // 输出：ret 为以下32字节字段依次拼接的十六进制串
    // 000000000000000000000000000000000000000000000000000000000000000a  x
    // 00000000000000000000000002a5fbb259d20a3ad2fdf9ccadef86f6c1c1ccc9  address
    // 0000000000000000000000000000000000000000000000000000000000000080  str 的偏移
    // 00000000000000000000000000000000000000000000000000000000000000c0  array 的偏移
    // 000000000000000000000000000000000000000000000000000000000000000b  str 的长度
    // 48656c6c6f20576f726c64000000000000000000000000000000000000000000  str 数据
    // 0000000000000000000000000000000000000000000000000000000000000003  array 的长度
    // 0000000000000000000000000000000000000000000000000000000000000001  array 第一个数据
    // 0000000000000000000000000000000000000000000000000000000000000002  array 第二个数据
    // 0000000000000000000000000000000000000000000000000000000000000003  array 第三个数据
}
```

支持对元组（tuple）或者包含元组的类型顺序编码，这个类型顺序由```tuple```、```bytes```组成，所以在调用```exchange.IO()```进行encode时需要继续传入两个参数：
- 1、对应tuple类型的变量：
  ```json
  [30, 20, "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"]
  ```
  元组的值按位置传数组，个数、顺序和类型都要与```types```参数里的```(uint256,uint8,address)```一致。字面元组没有字段名，解码时字段按位置编号为```Field1```、```Field2```……
- 2、对应```bytes```类型的变量：
  ```json
  "0011"
  ```

```javascript
function main() {
    var types = "(uint256,uint8,address),bytes"
    var ret = exchange.IO("encode", types, [30, 20, "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"],
        "0011")
    Log("encode: ", ret)
}
```

支持对数组或者包含数组的类型顺序编码。

```javascript
function main() {
    var path = ["0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
        "0xdac17f958d2ee523a2206206994597c13d831ec7"]   // ETH address, USDT address
    var ret = exchange.IO("encode", "address[]", path)
    Log("encode: ", ret)
}
```

```exchange.IO()```函数封装了```encode```方法，可以把函数调用编码返回为```hex```字符串格式。在Uniswap / PancakeSwap上兑换可以直接使用`Uniswap`交易所对象，不需要自己编码调用。

编码智能合约上的方法调用时，方法可以写方法名、完整的方法签名或方法选择器；标准ERC20方法已内置，其它方法需要先注册对应的ABI。

返回不带```0x```前缀的十六进制字符串。```bytesN```类型的值可以传十六进制字符串（```0x```前缀可选）或字节数值数组；```address```类型可以传波场```T```开头的地址。

```exchange.IO("pack", ...)```是```exchange.IO("encode", ...)```的别名。

See also: `Web3`, `exchange.IO`, `exchange.IO("decode")`, `exchange.IO("encodePacked")`, `exchange.IO("abi")`, `exchange.IO("call")`

##### exchange.IO("encodePacked", ...)

```
exchange.IO(k, dataFormat, ...args)
```

Forms:

- `exchange.IO("encodePacked", ...)`

```encodePacked```编码。

Parameters:

- `k` (string, required): 固定为```encodePacked```，用于数据```encodePacked```编码。
- `dataFormat` (string, required): ```encodePacked```编码数据的类型、顺序。
- `arg` (string / number / array / any, required): 与```dataFormat```参数匹配的具体数据值。
```arg```参数可能有多个，```arg```参数的类型与个数根据```dataFormat```参数设置而定。元组（tuple）按数组传入。

Returns (string): ```encodePacked```编码后的数据。

使用```Uniswap V3```时需要传入兑换路径之类的参数，就需要使用```encodePacked```编码操作。

```javascript
function main() {
    var fee = exchange.IO("encodePacked", "uint24", 3000)
    var tokenInAddress = "0x111111111117dC0aa78b770fA6A738034120C302"
    var tokenOutAddress = "0x6b175474e89094c44da98b954eedeac495271d0f"
    var path = tokenInAddress.slice(2).toLowerCase()
    path += fee + tokenOutAddress.slice(2).toLowerCase()
    Log("path:", path)
}
```

See also: `Web3`, `exchange.IO`, `exchange.IO("encode")`, `exchange.IO("decode")`, `exchange.IO("hash")`

##### exchange.IO("decode", ...)

```
exchange.IO(k, dataFormat, data)
```

Forms:

- `exchange.IO("decode", ...)`

解码。

Parameters:

- `k` (string, required): 固定为```decode```，用于数据解码。
- `dataFormat` (string, required): 解码数据的类型、顺序。
- `data` (string, required): 要解码的数据，十六进制字符串，```0x```前缀可选。

Returns (string / number / bool / object / array): ```dataFormat```只有一个类型时直接返回解码后的值，有多个类型时返回数组。整数中```uint64```、```int64```及以下位宽为数字，更大位宽为十进制字符串（JavaScript、Python中绝对值不小于2^53的整数也返回十进制字符串，避免丢失精度）；```address```为```0x```开头的小写地址（波场上同样返回```0x```格式）；```bytes```为不带```0x```的十六进制字符串；```bytes32```等定长```bytesN```为字节数值数组；字面元组为以```Field1```、```Field2```……为键的对象。

```exchange.IO("encode", ...)```函数的反向操作。

```javascript
function main() {
    // 元组写在圆括号里，字段按位置排列；这里是一个三字段元组，外加一个bytes参数
    var types = "(uint256,uint8,address),bytes"

    // 元组的值按位置传数组
    var ret = exchange.IO("encode", types, [30, 20, "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"],
        "0011")
    Log("encode: ", ret)
    // 字面元组没有字段名，按位置编号为Field1、Field2……要用有意义的字段名，
    // 需要先用exchange.IO("abi", ...)注册合约ABI，参考下一个例子
    var rawData = exchange.IO("decode", types, ret)
    Log("decode:", rawData)

    // 输出：decode: [{"Field1":"30","Field2":20,"Field3":"0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"}, "0011"]
}
```

以下例子首先在```path```参数处理时进行了```encodePacked```操作，因为之后需要编码的```exactOutput```方法调用需要```path```作为参数。然后```encode```路由合约的```exactOutput```方法，该方法只有一个参数，参数类型是```tuple```类型。```exactOutput```这个方法名编码后即：```0x09b81346```，使用```exchange.IO("decode", ...)```方法按```(bytes,address,uint256,uint256)```解码得出```decodeRaw```，其字段按位置编号为```Field1```～```Field4```，值与变量```dataTuple```依次对应。

```javascript
function main() {
    // register SwapRouter02 abi
    var walletAddress = "0x398a93ca23CBdd2642a07445bCD2b8435e0a373f"
    var routerAddress = "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45"
    var abi = `[{"inputs":[{"components":[{"internalType":"bytes","name":"path","type":"bytes"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"uint256","name":"amountInMaximum","type":"uint256"}],"internalType":"struct IV3SwapRouter.ExactOutputParams","name":"params","type":"tuple"}],"name":"exactOutput","outputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"}],"stateMutability":"payable","type":"function"}]`
    exchange.IO("abi", routerAddress, abi)   // abi只使用了局部的exactOutput方法的内容，完整的abi可以在网上搜索

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
    Log("method hash:", rawData.slice(0, 8))
    // 输出：09b81346
    Log("params hash:", rawData.slice(8))

    // decode exactOutput params
    var decodeRaw = exchange.IO("decode", "(bytes,address,uint256,uint256)", rawData.slice(8))
    Log("decodeRaw:", decodeRaw)
}
```

对于数据的处理，```exchange.IO()```函数不仅支持编码（encode），也支持解码（decode）。

```exchange.IO("unpack", ...)```是```exchange.IO("decode", ...)```的别名。

See also: `Web3`, `exchange.IO`, `exchange.IO("encode")`, `exchange.IO("encodePacked")`, `exchange.IO("abi")`

##### exchange.IO("hash", ...)

```
exchange.IO(k, algo, inputFormat, outputFormat, data)
exchange.IO(k, algo, inputFormat, outputFormat, data, keyFormat, key)
```

Forms:

- `exchange.IO("hash", ...)`

计算哈希摘要、HMAC，以及使用交易所对象配置的私钥签名等，参数与`Encode`函数相同。在Web3交易所对象上常用于计算```keccak256```哈希，例如方法选择器、EIP-712摘要。

Parameters:

- `k` (string, required): 固定为```hash```，用于哈希、签名等计算。
- `algo` (string, required): 算法：摘要（如```sha256```、```keccak256```，可计算HMAC）、格式转换（```raw```、```string```）、签名（```sign```、```signTx```）、ABI编码（```abi.类型```），以及Ed25519、字符集转换、AES和压缩；全部取值见备注。
- `inputFormat` (string, required): ```data```的格式：```raw```、```string```（按字符串的字节）、```hex```（```0x```前缀可选）、```base64```、```base64.url```、```base64.rawurl```。
- `outputFormat` (string, required): 输出格式：```hex```（不带```0x```）、```base64```、```base64.url```、```base64.rawurl```、```raw```、```string```（输出必须是有效的UTF-8文本）。
- `data` (string, required): 要处理的数据，按```inputFormat```解析。
- `keyFormat` (string, optional): ```key```的格式，取值同```inputFormat```。
- `key` (string, optional): 密钥：HMAC的密钥、```sign```使用的私钥（例如```keyFormat```为```hex```时传私钥的十六进制）、ed25519和AES的密钥。```ed25519```、```aes.*```必须传入。AES的密钥为16、24或32字节，初始向量取密钥的前16字节，不做填充（cbc、ecb要求数据长度为16的整数倍）。

Returns (string / object): 返回按```outputFormat```编码的结果；```unzip```返回以文件名为键的对象。调用失败返回空值，```GetLastError()```中有错误信息。

计算方法选择器、HMAC、ABI编码，以及用配置的私钥对哈希签名。

```javascript
function main() {
    // 方法选择器：keccak256("transfer(address,uint256)") 的前 4 字节
    var h = exchange.IO("hash", "keccak256", "raw", "hex", "transfer(address,uint256)")
    Log("selector:", "0x" + h.slice(0, 8))
    // 输出：0xa9059cbb

    // 对十六进制数据求哈希，输出不带 0x
    Log(exchange.IO("hash", "keccak256", "hex", "hex", "0x1234"))

    // HMAC-SHA256：最后两个参数为密钥的格式和密钥
    Log(exchange.IO("hash", "sha256", "string", "base64", "message", "string", "secret"))

    // 按 ABI 编码一个 uint256
    Log(exchange.IO("hash", "abi.uint256", "string", "hex", "1000"))

    // 用配置的私钥对 32 字节哈希签名：65 字节 r‖s‖v，v 为 0 或 1
    Log(exchange.IO("hash", "sign", "hex", "hex", h))
}
```

```python
def main():
    # 方法选择器：keccak256("transfer(address,uint256)") 的前 4 字节
    h = exchange.IO("hash", "keccak256", "raw", "hex", "transfer(address,uint256)")
    Log("selector:", "0x" + h[:8])
    # 输出：0xa9059cbb

    # 对十六进制数据求哈希，输出不带 0x
    Log(exchange.IO("hash", "keccak256", "hex", "hex", "0x1234"))

    # HMAC-SHA256：最后两个参数为密钥的格式和密钥
    Log(exchange.IO("hash", "sha256", "string", "base64", "message", "string", "secret"))

    # 按 ABI 编码一个 uint256
    Log(exchange.IO("hash", "abi.uint256", "string", "hex", "1000"))

    # 用配置的私钥对 32 字节哈希签名：65 字节 r‖s‖v，v 为 0 或 1
    Log(exchange.IO("hash", "sign", "hex", "hex", h))
```

```rust
fn main() {
    // 方法选择器：keccak256("transfer(address,uint256)") 的前 4 字节
    let hv = exchange.IO(("hash", "keccak256", "raw", "hex", "transfer(address,uint256)"));
    let Ok(hv) = hv else { return };
    let h = hv.as_str().unwrap_or("").to_string();
    Log!("selector:", format!("0x{}", &h[..8]));
    // 输出：0xa9059cbb

    // 对十六进制数据求哈希，输出不带 0x
    Log!(exchange.IO(("hash", "keccak256", "hex", "hex", "0x1234")));

    // HMAC-SHA256：最后两个参数为密钥的格式和密钥；超过6个参数时用 Vec<Arg> 传参
    let args: Vec<Arg> = ["hash", "sha256", "string", "base64", "message", "string", "secret"]
        .iter().map(|s| Arg::Str(s.to_string())).collect();
    Log!(exchange.IO(args));

    // 按 ABI 编码一个 uint256
    Log!(exchange.IO(("hash", "abi.uint256", "string", "hex", "1000")));

    // 用配置的私钥对 32 字节哈希签名：65 字节 r‖s‖v，v 为 0 或 1
    Log!(exchange.IO(("hash", "sign", "hex", "hex", h.as_str())));
}
```

参数个数必须是4个或6个（不含```hash```）。

```sign```返回的签名v为0或1，与旧版本一致；需要分别取得```r```、```s```、```v```（v为27或28）或EIP-2098紧凑签名用于合约校验时，使用```exchange.IO("sign", ...)```。

以太坊（EVM）和波场（TRON）的交易所对象都可以使用。

```algo```参数的取值：

- 摘要：```md4```、```md5```、```sha1```、```sha224```、```sha256```、```sha384```（同```sha512.384```）、```sha512```、```sha512.224```、```sha512.256```、```keccak256```（同```sha3.keccak256```）、```sha3.keccak512```、```sha3.224```、```sha3.256```、```sha3.384```、```sha3.512```、```ripemd160```、```blake2b.256```、```blake2b.512```、```blake2s.128```、```blake2s.256```。传入```keyFormat```和```key```时计算HMAC（blake2s为带密钥的MAC）。
- ```raw```、```string```：不计算，只做格式转换。
- ```sign```：用secp256k1私钥对32字节的```data```签名，返回65字节的```r‖s‖v```，其中v为0或1；不传```key```时使用交易所对象配置的私钥。
- ```signTx```：```data```为传统（legacy）交易的JSON，字段为```Nonce```、```GasPrice```、```GasLimit```、```To```、```Value```、```Data```、```ChainId```（字段名不区分大小写，缺少的数值按0处理），可以带```Key```字段指定私钥；返回签名后的交易。
- ```abi.类型```：按ABI编码一个值，例如```abi.uint256```、```abi.address```。
- 另外支持```ed25519```（及```ed25519.seed```、```ed25519.sha512```）签名，```text.encoder.字符集```、```text.decoder.字符集```字符集转换，```aes.encrypt```、```aes.decrypt```（可加```.cbc```、```.ecb```、```.cfb```，默认cbc），```zlib```、```gzip```、```flate```、```br```、```zstd```、```lz4```加```.deflate```（压缩）或```.inflate```（解压），以及```unzip```（返回以文件名为键的对象）。

See also: `Web3`, `exchange.IO`, `exchange.IO("sign")`, `exchange.IO("signTypedData")`, `exchange.IO("encodePacked")`, `Encode`

##### exchange.IO("key", ...)

```
exchange.IO(k, key)
```

Forms:

- `exchange.IO("key", ...)`

切换私钥。

Parameters:

- `k` (string, required): 固定为```key```，用于切换私钥。
- `key` (string, required): 私钥字符串。

切换交易所对象使用的私钥。

```javascript
function main() {
    exchange.IO("key", "Private Key")   // "Private Key"代表私钥字符串，需要具体填写
}
```

```exchange.IO()```函数支持切换私钥功能，可以操作多个钱包地址。也可以添加多个交易所对象（参考：`exchanges`）来操作多个钱包地址。

对于切换私钥的操作：```exchange.IO("key", "xxx")```，不能使用并发方式进行切换。

私钥为十六进制字符串，```0x```前缀可选。私钥无效时报错，不会切换。私钥只保存在内存中，不会写入日志；切换后，获取地址、签名和发送交易都使用新的私钥。

See also: `Web3`, `exchange.IO`, `exchange.IO("address")`, `exchange.IO("sign")`, `exchange.IO("signMessage")`

##### exchange.IO("sign", ...)

```
exchange.IO(k, hash)
exchange.IO(k, hash, key)
```

Forms:

- `exchange.IO("sign", ...)`

使用secp256k1私钥对32字节哈希进行签名，返回r、s、v等签名数据，适用于EIP-712结构化数据签名（如ERC-20 Permit授权、1inch限价单）等需要链下签名的场景。

Parameters:

- `k` (string, required): 固定为```sign```，用于对哈希进行签名。
- `hash` (string, required): 待签名的32字节哈希，格式为十六进制字符串，```0x```前缀可选。该函数不会对```hash```再次进行哈希处理，EIP-712摘要需预先计算完成，请参考范例。
- `key` (string, optional): 签名所使用的私钥，未传入时使用`exchange`交易所对象配置的私钥。

Returns (object): 签名对象，包含以下字段：```r```（32字节，十六进制字符串）、```s```（32字节，十六进制字符串）、```v```（数值，27或28）、```signature```（65字节```r‖s‖v```，十六进制字符串）、```vs```（EIP-2098紧凑签名，32字节，十六进制字符串）。调用失败时返回空值。

以以太坊主网USDC的ERC-20 Permit（EIP-2612）授权签名为例：首先读取链上参数，使用```exchange.IO("encode", ...)```和```exchange.IO("hash", "keccak256", ...)```计算EIP-712摘要，然后使用```exchange.IO("sign", ...)```对摘要进行签名，最后通过```eth_call```模拟调用USDC合约的```permit```方法以验证签名（仅模拟执行，不发送交易，不消耗gas）。```bytes32```类型的返回值以字节数组形式返回，范例中使用```bytesToHex```函数将其转换为十六进制字符串。

```javascript
// 为以太坊主网 USDC 签署 EIP-2612 Permit，并通过 eth_call 由 USDC 合约验证签名（仅模拟执行，不发送交易、不消耗 gas）
var USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"      // 以太坊主网 USDC 合约地址
var SPENDER = "0x1111111254EEB25477B68fb85Ed929f73A960582"   // 被授权方地址（示例：1inch Router v5）
var VALUE = "1000000"                                         // 授权额度：1 USDC（精度为 6 位）

// keccak256 → 以 0x 开头的 hex 字符串。fmt = "raw"（按字符串处理）或 "hex"（按十六进制数据处理）
function keccak(fmt, data) {
    return "0x" + String(exchange.IO("hash", "keccak256", fmt, "hex", data)).replace(/^0x/, "")
}
function strip0x(h) { return String(h).replace(/^0x/, "") }
// bytesN 类型的返回值为字节数组（与旧版一致），此处转换为以 0x 开头的 hex 字符串
function bytesToHex(v) {
    if (typeof v === "string") return "0x" + strip0x(v).toLowerCase()
    return "0x" + v.map(function (b) { return ("0" + b.toString(16)).slice(-2) }).join("")
}
// 函数选择器 + 标准 ABI 编码参数 → calldata
function calldata(signature, types, values) {
    var args = exchange.IO.apply(exchange, ["encode", types].concat(values))
    return keccak("raw", signature).slice(0, 10) + strip0x(args)
}
// eth_call 模拟执行：成功时返回 true，revert 时返回错误原因
function simulate(data) {
    var r = exchange.IO("api", "eth", "eth_call", { from: SPENDER, to: USDC, data: data }, "latest")
    return r === null ? GetLastError() : true
}

function main() {
    // 1. 注册所需的 ABI 片段，读取链上参数
    exchange.IO("abi", USDC, JSON.stringify([
        { type: "function", name: "name", stateMutability: "view", inputs: [],
            outputs: [{ type: "string" }] },
        { type: "function", name: "version", stateMutability: "view", inputs: [],
            outputs: [{ type: "string" }] },
        { type: "function", name: "nonces", stateMutability: "view", inputs: [{ type: "address" }],
            outputs: [{ type: "uint256" }] },
        { type: "function", name: "DOMAIN_SEPARATOR", stateMutability: "view", inputs: [],
            outputs: [{ type: "bytes32" }] }
    ]))
    var owner = exchange.IO("address")
    var name = exchange.IO("api", USDC, "name")
    var version = exchange.IO("api", USDC, "version")
    var nonce = exchange.IO("api", USDC, "nonces", owner)
    var chainId = parseInt(exchange.IO("api", "eth", "eth_chainId"), 16)
    var deadline = Math.floor(Date.now() / 1000) + 3600
    Log("owner:", owner, "| token:", name, "v" + version, "| nonce:", nonce, "| chainId:", chainId)

    // 2. 计算 EIP-712 域分隔符，并与合约的 DOMAIN_SEPARATOR() 返回值比对
    var domainSeparator = keccak("hex", exchange.IO("encode",
        "bytes32,bytes32,bytes32,uint256,address",
        keccak("raw",
            "EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"),
        keccak("raw", name), keccak("raw", version), chainId, USDC))
    var onchain = bytesToHex(exchange.IO("api", USDC, "DOMAIN_SEPARATOR"))
    Log("domainSeparator:", domainSeparator,
        domainSeparator === onchain ? "与链上一致" : "与链上不一致: " + onchain)

    // 3. Permit 结构体哈希 → EIP-712 摘要 → 签名
    var structHash = keccak("hex", exchange.IO("encode",
        "bytes32,address,address,uint256,uint256,uint256",
        keccak("raw",
            "Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline)"),
        owner, SPENDER, VALUE, nonce, deadline))
    var digest = keccak("hex", "1901" + strip0x(domainSeparator) + strip0x(structHash))
    var sig = exchange.IO("sign", digest)
    Log("digest:", digest)
    Log("sign:", sig)

    // 4. 由 USDC 合约验证签名：permit(owner, spender, value, deadline, v, r, s)
    Log("permit(v,r,s) 模拟:", simulate(calldata(
        "permit(address,address,uint256,uint256,uint8,bytes32,bytes32)",
        "address,address,uint256,uint256,uint8,bytes32,bytes32",
        [owner, SPENDER, VALUE, deadline, sig.v, sig.r, sig.s])))

    // USDC v2.2 另提供接收 bytes 类型签名的重载方法：permit(owner, spender, value, deadline, signature)
    Log("permit(bytes) 模拟:", simulate(calldata(
        "permit(address,address,uint256,uint256,bytes)",
        "address,address,uint256,uint256,bytes",
        [owner, SPENDER, VALUE, deadline, sig.signature])))

    // 5. 反例：篡改 v 值后，合约应当拒绝
    Log("篡改 v 后模拟:", simulate(calldata(
        "permit(address,address,uint256,uint256,uint8,bytes32,bytes32)",
        "address,address,uint256,uint256,uint8,bytes32,bytes32",
        [owner, SPENDER, VALUE, deadline, sig.v === 27 ? 28 : 27, sig.r, sig.s])))
}
```

EIP-712结构化数据签名可以直接使用```exchange.IO("signTypedData", ...)```，传入domain、types、message即可，不需要自己计算摘要；EIP-191消息签名使用```exchange.IO("signMessage", ...)```。

返回的```s```均为低位值（不大于曲线阶的一半），符合EIP-2规范，可直接用于OpenZeppelin ```ECDSA.recover```等校验场景。

合约接收```(v, r, s)```三个参数时（如ERC-20 Permit的```permit(owner, spender, value, deadline, v, r, s)```），使用```v```、```r```、```s```字段；接收```bytes signature```时，使用```signature```字段；接收EIP-2098紧凑签名```(r, vs)```时（如1inch限价单协议），使用```r```、```vs```字段。

```exchange.IO("hash", "sign", ...)```同样可以对32字节哈希进行签名，但其返回的是拼接后的65字节数据，且v为0或1，与旧版本行为保持一致；对于EIP-712等链上校验场景，建议使用```exchange.IO("sign", ...)```。

```hash```不是32字节时报错。签名与链无关，波场（TRON）的交易所对象同样可用。

See also: `Web3`, `exchange.IO`, `exchange.IO("hash")`, `exchange.IO("signTypedData")`, `exchange.IO("signMessage")`

##### exchange.IO("signTypedData", ...)

```
exchange.IO(k, typedData)
exchange.IO(k, typedData, key)
exchange.IO(k, domain, types, message)
exchange.IO(k, domain, types, message, key)
```

Forms:

- `exchange.IO("signTypedData", ...)`

按照EIP-712标准对结构化数据进行签名，一次调用即可完成类型哈希、域分隔符、结构体哈希和摘要的计算并签名，适用于ERC-20 Permit、Permit2、UniswapX、CoW、1inch限价单等场景。

Parameters:

- `k` (string, required): 固定为```signTypedData```，用于进行EIP-712签名。
- `typedData` (object / string, optional): 包含```domain```、```types```、```primaryType```、```message```的对象（即MetaMask ```eth_signTypedData_v4```的格式，```types```中可以包含```EIP712Domain```），也可以传入该对象的JSON字符串。
- `domain` (object, optional): EIP-712域，例如```{name, version, chainId, verifyingContract}```。使用```domain```、```types```、```message```三个参数的调用方式与ethers的```signTypedData```相同：```types```中无需包含```EIP712Domain```（根据```domain```中出现的字段自动推导），主类型为未被其它类型引用的类型。
- `types` (object, optional): 类型定义，例如```{Permit: [{name: "owner", type: "address"}, ...]}```，支持嵌套结构体和数组。
- `message` (object, optional): 待签名的数据。大整数可以以字符串形式传入。
- `key` (string, optional): 签名所使用的私钥，不传该参数时使用`exchange`交易所对象配置的私钥。

Returns (object): 返回签名对象，字段与```exchange.IO("sign", ...)```的返回值相同：```r```、```s```、```v```（27或28）、```signature```（65字节）、```vs```（EIP-2098紧凑签名），此外还包含```digest```字段，即EIP-712摘要。调用失败时返回空值。

对以太坊主网USDC的Permit进行签名，并通过```exchange.IO("call", ...)```由USDC合约验证签名。

```javascript
function main() {
    var USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"      // 以太坊主网 USDC
    var spender = "0x1111111254EEB25477B68fb85Ed929f73A960582"   // 被授权方，按实际填写
    var owner = exchange.IO("address")
    var deadline = Math.floor(Date.now() / 1000) + 3600
    // nonce 必须等于合约里的 nonces(owner)：钱包用过一次 permit 后就不再是 0
    exchange.IO("abi", USDC, JSON.stringify([{ type: "function", name: "nonces",
        stateMutability: "view",
        inputs: [{ type: "address" }], outputs: [{ type: "uint256" }] }]))
    var nonce = exchange.IO("api", USDC, "nonces", owner)

    // ethers 写法：domain、types（不含 EIP712Domain）、message，主类型自动推断
    var domain = { name: "USD Coin", version: "2", chainId: 1, verifyingContract: USDC }
    var types = {
        Permit: [
            { name: "owner", type: "address" }, { name: "spender", type: "address" },
            { name: "value", type: "uint256" }, { name: "nonce", type: "uint256" },
            { name: "deadline", type: "uint256" }
        ]
    }
    var message = { owner: owner, spender: spender, value: "1000000", nonce: nonce,
        deadline: deadline }
    var sig = exchange.IO("signTypedData", domain, types, message)
    Log("digest:", sig.digest, "v:", sig.v, "r:", sig.r, "s:", sig.s)

    // 单对象写法（MetaMask eth_signTypedData_v4 的格式）结果相同
    var sig2 = exchange.IO("signTypedData", { domain: domain, types: types, primaryType: "Permit",
        message: message })
    Log("两种写法一致:", sig.signature === sig2.signature)

    // 用 eth_call 模拟 USDC 的 permit，由合约验证签名（不发送交易）
    var calldata = "0x" + String(exchange.IO("hash", "keccak256", "raw", "hex",
        "permit(address,address,uint256,uint256,uint8,bytes32,bytes32)")).replace(/^0x/, "").slice(0, 8) +
        exchange.IO("encode", "address,address,uint256,uint256,uint8,bytes32,bytes32",
            owner, spender, "1000000", deadline, sig.v, sig.r, sig.s)
    Log("permit 模拟:", exchange.IO("call", USDC, calldata) !== null ? "签名有效" : GetLastError())
}
```

```message```中缺少类型定义中的字段时会报错，不会将缺失字段补零后签名。

私钥仅在交易所对象内部使用，策略代码无法获取私钥。

See also: `Web3`, `exchange.IO`, `exchange.IO("sign")`, `exchange.IO("signMessage")`, `exchange.IO("hash")`

##### exchange.IO("signMessage", ...)

```
exchange.IO(k, message)
exchange.IO(k, message, key)
```

Forms:

- `exchange.IO("signMessage", ...)`

按照EIP-191标准（```personal_sign```）对消息进行签名，签名结果与ethers的```signMessage```、钱包的```personal_sign```一致，常用于DApp登录、链下鉴权等场景。

Parameters:

- `k` (string, required): 固定为```signMessage```，用于对消息进行签名。
- `message` (string / object, required): 待签名的消息：传入字符串时，按UTF-8编码进行签名；需要对原始字节签名时，传入```{hex: "0x..."}```格式的对象。
- `key` (string, optional): 签名所使用的私钥，未传入该参数时，默认使用`exchange`交易所对象配置的私钥。

Returns (object): 返回签名对象，其字段与```exchange.IO("sign", ...)```的返回值相同（```r```、```s```、```v```、```signature```、```vs```），此外还包含```digest```字段，表示EIP-191消息哈希。调用失败时返回空值。

对消息进行签名，并通过ecrecover预编译合约还原出签名地址。

```javascript
function main() {
    // 文本按 UTF-8 编码签名（结果与 ethers signMessage、钱包 personal_sign 一致）
    var sig = exchange.IO("signMessage", "hello fmz")
    Log("digest:", sig.digest, "signature:", sig.signature)

    // 原始字节通过 {hex: ...} 传入
    var sig2 = exchange.IO("signMessage", { hex: "0x68656c6c6f20666d7a" })
    Log("与文本签名一致:", sig.signature === sig2.signature)

    // 使用 ecrecover 预编译合约还原签名地址，结果应与当前钱包地址一致
    var ret = exchange.IO("call", "0x0000000000000000000000000000000000000001",
        "0x" + sig.digest.slice(2) + exchange.IO("encode", "uint8,bytes32,bytes32", sig.v, sig.r,
            sig.s))
    Log("还原地址:", "0x" + String(ret).slice(-40), "钱包地址:", exchange.IO("address").toLowerCase())
}
```

See also: `Web3`, `exchange.IO`, `exchange.IO("sign")`, `exchange.IO("signTypedData")`, `exchange.IO("address")`

##### exchange.IO("api", ...)

```
exchange.IO(k, address, method)
exchange.IO(k, address, method, ...args)
exchange.IO(k, address, method, value, ...args)
exchange.IO(k, address, method, ...args, options)
```

Forms:

- `exchange.IO("api", ...)`

在Web3交易所对象上调用智能合约的方法：只读方法返回解码后的值，写方法签名并广播交易。

Parameters:

- `k` (string, required): 固定为```api```，用于扩展调用请求。
- `address` (string, required): 智能合约的地址。
- `method` (string, required): 要调用的智能合约的方法。
- `value` (number / string, optional): 调用时附带的原生币数量（链上整数，以太坊为wei，波场为sun）。只有方法的```stateMutability```为```payable```时才需要传，并且放在方法参数之前；```exchange.IO()```函数根据已注册ABI中的```stateMutability```判断是否需要该参数，```nonpayable```、```view```等方法不传```value```参数。```stateMutability```属性可以从ABI中查看。
- `arg` (string / number / bool / any, optional): 要调用智能合约的方法的参数。
```arg```参数可能有多个，```arg```参数的类型与个数根据所要调用的智能合约的方法而定。
- `options` (object, optional): 发送交易的选项，只对写方法有效，作为最后一个参数传入（参数个数比方法参数多一个时识别为选项）：```gasLimit```为gas上限，不设置时由节点估算（```eth_estimateGas```）；```gasPrice```为gas价格，设置后发送传统（legacy）交易；```nonce```指定nonce，不设置时自动分配；```dryRun```为```true```时只签名不广播。波场（TRON）只支持```gasLimit```，表示手续费上限feeLimit（单位sun）。

Returns (string / number / bool / object / array): 只读方法返回解码后的值，写方法返回交易哈希（设置```dryRun```时返回签名后的交易对象）；调用失败返回空值，```GetLastError()```中有错误信息。值的类型与```dryRun```返回的字段见备注。

```decimals```方法是ERC20的一个```constant```的方法，不会产生gas消耗，可以查询某个token的精度数据。
```decimals```方法没有参数。返回值：token的精度数据。

```javascript
function main(){
    var tokenAddress = "0x111111111117dC0aa78b770fA6A738034120C302"    // 代币的合约地址，例子中的代币为1INCH
    Log(exchange.IO("api", tokenAddress, "decimals"))
    // 输出：18（1INCH代币的精度）
}
```

```allowance```方法是ERC20的一个```constant```的方法，不会产生gas消耗，可以查询某个token对于某个合约地址的授权额度。
```allowance```方法需要传2个参数，第一个参数为钱包地址，第二个参数为被授权的地址。返回值：token的授权额度。
```owner```：钱包地址，例子中以字符串"owner"代替，实际使用需要具体填写地址。
```spender```：被授权的合约地址，例子中以字符串"spender"代替，实际使用需要具体填写地址，例如可以是```Uniswap V3 router v1```地址。

```javascript
function main(){
    // 代币的合约地址，例子中的代币为1INCH
    var tokenAddress = "0x111111111117dC0aa78b770fA6A738034120C302"

    // 例如查询得出1000000000000000000，除以该token的精度单位1e18，得出当前交易所对象绑定的钱包给spender地址授权了1个1INCH数量
    Log(exchange.IO("api", tokenAddress, "allowance", "owner", "spender"))
}
```

```approve```方法是ERC20的一个非```constant```的方法，会产生gas消耗，用来给某个合约地址授权token的操作额度。
```approve```方法需要传2个参数，第一个参数为被授权的地址，第二个参数为授权的额度。返回值：txid。
```spender```：被授权的合约地址，例子中以字符串"spender"代替，实际使用需要具体填写地址，例如可以是```Uniswap V3 router v1```地址。
```0xde0b6b3a7640000```：授权数量，这里使用的是十六进制字符串表示，对应的十进制数值为1e18，除以例子中的token精度单位（即1e18），得出授权了1个token。
```exchange.IO()```函数的第三个参数传入方法名```approve```，也可以写methodId的形式，例如："0x095ea7b3"。也可以写完整标准方法名，例如："approve(address,uint256)"。

```javascript
function main(){
    // 代币的合约地址，例子中的代币为1INCH
    var tokenAddress = "0x111111111117dC0aa78b770fA6A738034120C302"

    // 授权量的十六进制字符串: 0xde0b6b3a7640000 , 对应的十进制字符串: 1e18 , 1e18除以该token的精度单位，即1个代币数量 , 所以这里指授权一个代币
    Log(exchange.IO("api", tokenAddress, "approve", "spender", "0xde0b6b3a7640000"))
}
```

```multicall```方法是```Uniswap V3```的一个非```constant```的方法，会产生gas消耗，用来多路兑换代币。
```multicall```方法可能有多种传参方式，具体可以查询包含该方法的ABI，调用该方法之前需要先注册ABI。返回值：txid。
在Uniswap / PancakeSwap上兑换可以直接使用`Uniswap`交易所对象，不需要自己编码调用。

这里使用伪代码来描述一些细节：
```javascript
exchange.IO("api", ContractV3SwapRouterV2, "multicall(uint256,bytes[])", value, deadline, data)
```

```ContractV3SwapRouterV2```：Uniswap V3的router v2地址。
```value```：随交易附带的原生币数量，单位为wei（链上整数，可以用```exchange.IO("toUnits", "0.01", 18)```换算）；兑换操作的tokenIn代币不是ETH时设置为0。
```deadline```：```deadline```是```multicall```方法的参数，可以设置为```(new Date().getTime() / 1000) + 3600```，表示一小时内有效。
```data```：```data```是```multicall```方法的参数，类型为```bytes[]```，即需要执行的各个操作的调用数据（```0x```开头的十六进制字符串）组成的数组。与```exchange.IO("api", "eth", "send", "toAddress", toAmount)```类似，在调用```multicall```方法时也可以指定方法调用的```gasLimit/gasPrice/nonce```设置，同样使用伪代码来描述：

```javascript
exchange.IO("api", ContractV3SwapRouterV2, "multicall(uint256,bytes[])", value, deadline, data, {gasPrice: 123456, gasLimit: 300000})
```

可以根据具体需求设置```{gasPrice: 11, gasLimit: 111, nonce: 111}```参数，该参数设置在```exchange.IO()```函数的最后一个参数上。
可以省略其中的```nonce```使用系统默认的值，或者不设置```gasLimit/gasPrice/nonce```，全部使用系统默认值。

该参数中设置```dryRun: true```时只签名不广播，返回包含```hash```、```raw```（签名后的交易）等字段的对象。需要先确认调用能否成功时，可以把```api```换成```call```，使用```exchange.IO("call", ...)```模拟执行（不签名、不消耗gas），参看```exchange.IO("call", ...)```。

```javascript
function main() {
    var ContractV3SwapRouterV2 = "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45"
    var tokenInName = "ETH"
    // 0.01 ETH 换算为 wei：payable 方法的 value 是链上整数
    var amountIn = exchange.IO("toUnits", "0.01", 18)
    var options = {gasPrice: 5000000000, gasLimit: 300000, nonce: 100}   // 此处为举例，具体要根据实际场景设置
    // bytes[]：各个操作编码后的调用数据（0x 开头的十六进制字符串），此处为空数组，具体要根据实际场景设置
    var data = []
    var tx = exchange.IO("api", ContractV3SwapRouterV2, "multicall(uint256,bytes[])", (tokenInName == 'ETH' ? amountIn : 0), (new Date().getTime() / 1000) + 3600, data, options || {})
}
```

只读方法通过```eth_call```在最新区块上执行，不签名、不消耗gas。

写方法用配置的私钥签名后广播。不设置```gasPrice```时，支持EIP-1559的链发送EIP-1559（type 2）交易：小费取节点建议值（```eth_maxPriorityFeePerGas```）与最近20个区块实际小费中位数（```eth_feeHistory```）中的较大者，最高费用为```2 × baseFee + 小费```；不支持EIP-1559的链按节点的```eth_gasPrice```出价。

不设置```nonce```时自动分配并与链上待处理计数同步，连续发送不会重复使用nonce，参看```exchange.IO("nonce", ...)```。交易发送后可以用```exchange.IO("waitReceipt", ...)```等待上链，长时间未上链时可以用```exchange.IO("speedUp", ...)```加价重发或用```exchange.IO("cancelTx", ...)```取消。

声明为```nonpayable```的询价方法（如Uniswap QuoterV2）会被当作写方法签名并发送交易。只想取得返回值或预演写操作时，使用```exchange.IO("call", ...)```模拟执行。

调用只读方法（```view```、```pure```）时返回解码后的返回值：只有一个返回值时直接返回该值；有多个返回值时返回以输出参数名为键的对象，没有名字的输出依次为```ret0```、```ret1```……。```uint64```及以下位宽的整数为数字，更大的整数为十进制字符串（JavaScript、Python中绝对值不小于2^53的整数也返回十进制字符串，避免丢失精度）；```address```为```0x```开头的小写地址（波场为```T```开头的地址）；```bytes```为不带```0x```的十六进制字符串；```bytes32```等定长```bytesN```为字节数值数组（例如```[17, 17, ...]```）。

调用写方法时返回交易哈希（以太坊为```0x```开头的字符串，波场为不带```0x```的交易ID）；设置```dryRun```时返回包含```hash```、```raw```（签名后的交易）、```from```、```to```、```value```、```data```、```nonce```、```gasLimit```、```chainId```、```type```、```gasPrice```、```maxFeePerGas```、```maxPriorityFeePerGas```的对象。调用失败返回空值，```GetLastError()```中有错误信息。

See also: `Web3`, `exchange.IO`, `exchange.IO("abi")`, `exchange.IO("call")`, `exchange.IO("multicall")`, `exchange.IO("waitReceipt")`

##### exchange.IO("call", ...)

```
exchange.IO(k, address, method, ...args)
exchange.IO(k, address, calldata)
exchange.IO(k, address, calldata, options)
```

Forms:

- `exchange.IO("call", ...)`

通过```eth_call```模拟执行智能合约的任意方法（包括会修改链上状态的写入方法），该过程不签名、不广播交易、不消耗gas，适用于链上询价、交易预演以及检查交易能否成功执行。

Parameters:

- `k` (string, required): 固定为```call```，用于模拟执行合约方法。
- `address` (string, required): 智能合约的地址。
- `method` (string, optional): 要模拟执行的方法，可以是方法名、完整的方法签名（例如```"transfer(address,uint256)"```，用于区分重载方法）或方法选择器。使用方法名时，需要先通过```exchange.IO("abi", ...)```注册合约ABI（ERC20标准方法已内置，无需注册）。
- `calldata` (string, optional): 完整的调用数据（以```0x```开头的十六进制字符串，由方法选择器和编码后的参数组成），例如聚合器API返回的交易```data```。传入```calldata```时无需注册ABI，函数返回原始返回数据。
- `args` (string / number / bool / object / array / any, optional): 方法的参数，排列方式与```exchange.IO("api", ...)```调用合约方法时完全相同（```payable```方法第一个参数为附带的原生币数量），把```api```换成```call```即可预演同一笔调用。最后一个参数可以是选项对象```{from, value, block, gasLimit}```：```from```指定以哪个地址的身份执行（默认为配置的钱包地址，没有配置私钥时为零地址），```value```为附带的原生币数量，```block```为执行时的区块（默认```latest```，可设置区块高度或```pending```等标签），```gasLimit```为执行的gas上限。

Returns (string / number / bool / object / array): 使用方法名调用时，返回按ABI解码后的返回值（有多个返回值时为对象）；方法没有返回值时，执行成功返回```true```。使用```calldata```调用时，返回原始返回数据（以```0x```开头的十六进制字符串），可以使用```exchange.IO("decode", ...)```进行解码。执行失败（合约revert）时返回空值，可以通过```GetLastError()```获取合约给出的失败原因。

使用 Uniswap QuoterV2 进行询价，并模拟执行写入操作。

```javascript
function main() {
    var WETH = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
    var USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
    var QUOTER = "0x61fFE014bA17989E743c5F6cB21bF9697530B21e"   // Uniswap V3 QuoterV2（以太坊主网）
    // QuoterV2 的询价方法的状态可变性为 nonpayable，使用 exchange.IO("api", ...) 调用时会被视为写入操作并发送交易；
    // 使用 exchange.IO("call", ...) 调用时仅模拟执行，不签名、不广播、不消耗 gas
    exchange.IO("abi", QUOTER, JSON.stringify([{
        type: "function", name: "quoteExactInputSingle", stateMutability: "nonpayable",
        inputs: [{ name: "params", type: "tuple", components: [
            { name: "tokenIn", type: "address" }, { name: "tokenOut", type: "address" },
            { name: "amountIn", type: "uint256" }, { name: "fee", type: "uint24" },
            { name: "sqrtPriceLimitX96", type: "uint160" }] }],
        outputs: [{ name: "amountOut", type: "uint256" }, { name: "sqrtPriceX96After",
            type: "uint160" },
            { name: "initializedTicksCrossed", type: "uint32" }, { name: "gasEstimate",
                type: "uint256" }]
    }]))
    // 询价：1 WETH 在 0.05% 费率池中可兑换多少 USDC
    var q = exchange.IO("call", QUOTER, "quoteExactInputSingle", [WETH, USDC, "1000000000000000000",
        500, 0])
    Log("amountOut:", q.amountOut, "gasEstimate:", q.gasEstimate)

    // 模拟写入：以当前钱包地址的身份执行 transfer，余额不足时返回 null，可通过 GetLastError() 获取合约返回的失败原因
    var ok = exchange.IO("call", USDC, "transfer", "0x1111111254EEB25477B68fb85Ed929f73A960582", 1)
    Log("transfer 模拟:", ok, GetLastError())
    // 通过 from 参数指定以其他地址的身份进行模拟
    Log("指定 from 模拟:", exchange.IO("call", USDC, "transfer",
        "0x1111111254EEB25477B68fb85Ed929f73A960582", 1,
        { from: "0x55FE002aefF02F77364de339a1292923A15844B8" }))
}
```

使用聚合器（KyberSwap 公开 API）完成询价、生成交易、预演和发送交易的完整流程。```DRY_RUN```为```true```时，仅签名而不广播交易。

```javascript
// 聚合器询价与兑换示例（使用 KyberSwap 公开 API，无需 key）：询价 → 生成交易 → eth_call 预演 → 发送
// DRY_RUN = true 时仅签名、不广播
var DRY_RUN = true
// KyberSwap 使用的链名称：ethereum / bsc / base / arbitrum …
var CHAIN = "ethereum"
var NATIVE = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"       // 聚合器约定的原生代币地址
var TOKEN_IN = NATIVE                                           // 卖出：ETH
var TOKEN_OUT = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"    // 买入：USDC
var AMOUNT_IN = "10000000000000000"                             // 0.01 ETH（以最小单位表示）
var SLIPPAGE_BPS = 50                                           // 0.5%
// 预演使用的发送方地址：默认为当前钱包；钱包余额不足时预演必然失败，可临时改为持币地址，仅用于验证路由能否成交
var SIMULATE_FROM = ""

var API = "https://aggregator-api.kyberswap.com/" + CHAIN + "/api/v1"
var HEADERS = { "x-client-id": "fmz-example", "Content-Type": "application/json" }

function getJSON(url, opts) {
    var r = JSON.parse(HttpQuery(url, opts || { headers: HEADERS }))
    if (r.code !== 0) throw "aggregator error: " + JSON.stringify(r)
    return r.data
}

// 卖出 ERC20 代币前需先授权给路由合约；原生代币无需授权
function ensureAllowance(token, spender, amount) {
    if (token.toLowerCase() === NATIVE.toLowerCase()) return
    var owner = exchange.IO("address")
    var allowance = BigInt(exchange.IO("api", token, "allowance", owner, spender))
    if (allowance >= BigInt(amount)) return
    Log("授权", token, "→", spender)
    var tx = exchange.IO("api", token, "approve", spender, amount, DRY_RUN ? { dryRun: true } : {})
    Log("approve:", DRY_RUN ? tx.hash + "（dryRun，未广播）" : tx)
}

function main() {
    var wallet = exchange.IO("address")

    // 1. 询价
    var route = getJSON(API + "/routes?tokenIn=" + TOKEN_IN + "&tokenOut=" + TOKEN_OUT + "&amountIn=" + AMOUNT_IN, { headers: HEADERS })
    var s = route.routeSummary
    Log("询价：", s.amountIn, "→", s.amountOut,
        "（约 $" + Number(s.amountOutUsd).toFixed(2) + "），gas≈" + s.gas)

    // 2. 生成交易：聚合器返回路由合约地址、calldata 以及需附带的原生代币数量
    var from = SIMULATE_FROM || wallet
    var built = getJSON(API + "/route/build", {
        method: "POST",
        headers: HEADERS,
        body: JSON.stringify({
            routeSummary: s,
            sender: from,
            recipient: from,
            slippageTolerance: SLIPPAGE_BPS,
            deadline: Math.floor(Date.now() / 1000) + 600,
        }),
    })
    var router = built.routerAddress
    var value = built.transactionValue || "0"
    Log("路由合约：", router, "| calldata", (built.data.length - 2) / 2, "字节 | value", value)

    // 3. 预演：将完整的 calldata 交给 IO("call") 执行，不签名、不广播；失败时返回合约给出的 revert 原因
    var ret = exchange.IO("call", router, built.data, { from: from, value: value })
    if (ret === null) {
        Log("预演失败，不发送：", GetLastError())
        return
    }
    var decoded = exchange.IO("decode", "uint256,uint256", String(ret).replace(/^0x/, ""))
    Log("预演成功，实际可得：", decoded[0], "（报价", s.amountOut + "）")

    // 4. 发送：授权（卖出 ERC20 代币时）→ 附带 calldata 发送交易；gasLimit 取预估值的 1.3 倍
    ensureAllowance(TOKEN_IN, router, AMOUNT_IN)
    var opts = { data: built.data, gasLimit: Math.ceil(Number(built.gas || s.gas) * 1.3) }
    if (DRY_RUN) opts.dryRun = true
    var tx = exchange.IO("api", "eth", "send", router, value, opts)
    if (DRY_RUN) {
        Log("已签名（dryRun，未广播）：hash", tx && tx.hash, "| nonce", tx && tx.nonce, "| type",
            tx && tx.type)
    } else {
        Log("已发送：", tx)
    }
}
```

Uniswap QuoterV2等合约的询价方法声明为```nonpayable```，使用```exchange.IO("api", ...)```调用时会被当作写操作，签名并发送交易，因此询价应使用```exchange.IO("call", ...)```。

合约revert的原因会被解析为可读文本：```Error(string)```返回原因字符串，```Panic(uint256)```返回错误码及其含义，自定义错误返回错误选择器和原始数据。

需要实际发送交易时，可以使用```exchange.IO("api", "eth", "send", toAddress, value, {data: calldata})```发送任意调用数据；设置```dryRun: true```时只签名、不广播。

目前仅支持以太坊（EVM）链，不支持波场（TRON）。

See also: `Web3`, `exchange.IO`, `exchange.IO("api")`, `exchange.IO("multicall")`, `exchange.IO("encode")`, `exchange.IO("decode")`

##### exchange.IO("multicall", ...)

```
exchange.IO(k, calls)
exchange.IO(k, calls, options)
```

Forms:

- `exchange.IO("multicall", ...)`

通过Multicall3合约在一次请求中批量读取多个合约调用的结果，适用于批量查询余额、流动池状态、报价等数据，可有效减少RPC请求次数。

Parameters:

- `k` (string, required): 固定为```multicall```，用于批量读取合约调用结果。
- `calls` (array, required): 调用数组，数组中每一项的格式为```[合约地址, 方法, ...参数]```，写法与```exchange.IO("call", ...)```相同，其中方法也可以是完整的调用数据（calldata）。不支持附带原生代币的```payable```调用。
- `options` (object, optional): 可选设置项：```allowFailure```设置为```true```时，调用失败的项返回空值；否则（默认）任意一项调用失败时整体返回空值，并可通过```GetLastError()```获取失败项的序号和原因。```block```用于指定读取的区块（默认为```latest```，负数表示相对于最新区块的偏移）。```multicall```用于指定Multicall3合约地址（默认为```0xcA11bde05977b3631167028862bE2a173976CA11```，主流EVM链均在该地址部署了此合约）。

Returns (array): 返回与```calls```顺序一致的结果数组，每一项的解码方式与```exchange.IO("call", ...)```相同。注意每个子调用的调用者（```msg.sender```）是Multicall3合约，而```exchange.IO("call", ...)```默认以钱包地址调用，依赖调用者的方法（如```transfer```、按调用者检查余额或授权的写方法）结果会不同，```exchange.IO("multicall", ...)```只适合与调用者无关的读取。

一次请求同时读取钱包余额和Uniswap流动池状态。

```javascript
function main() {
    var USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
    var WETH = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
    var POOL = "0x88e6A0c2dDD26FEEb64F039a2c41296FcB3f5640"   // Uniswap V3 USDC/WETH 0.05% 池
    var owner = exchange.IO("address")
    exchange.IO("abi", POOL, JSON.stringify([
        { type: "function", name: "slot0", stateMutability: "view", inputs: [], outputs: [
            { name: "sqrtPriceX96", type: "uint160" }, { name: "tick", type: "int24" },
            { name: "observationIndex", type: "uint16" }, { name: "observationCardinality",
                type: "uint16" },
            { name: "observationCardinalityNext", type: "uint16" }, { name: "feeProtocol",
                type: "uint8" },
            { name: "unlocked", type: "bool" }] },
        { type: "function", name: "liquidity", stateMutability: "view", inputs: [],
            outputs: [{ type: "uint128" }] }
    ]))

    // 每项写法与 exchange.IO("call", ...) 相同：[合约地址, 方法, ...参数]，一次请求读完
    var ret = exchange.IO("multicall", [
        [USDC, "balanceOf", owner],
        [WETH, "balanceOf", owner],
        [POOL, "slot0"],
        [POOL, "liquidity"]
    ])
    Log("USDC余额:", ret[0], "WETH余额:", ret[1])
    Log("池子 tick:", ret[2].tick, "流动性:", ret[3])

    // 默认任何一项失败就整体返回 null；allowFailure 为 true 时失败项为 null
    var ret2 = exchange.IO("multicall", [[USDC, "decimals"], [USDC, "transfer", POOL, 1]],
        { allowFailure: true })
    Log("decimals:", ret2[0], "transfer（调用者是Multicall3合约，不是钱包）:", ret2[1])
}
```

所有调用均基于同一区块状态执行，返回结果相互一致。

目前仅支持以太坊（EVM）链，暂不支持波场（TRON）。

See also: `Web3`, `exchange.IO`, `exchange.IO("api")`, `exchange.IO("call")`, `exchange.IO("contracts")`

##### exchange.IO("logs", ...)

```
exchange.IO(k, query)
```

Forms:

- `exchange.IO("logs", ...)`

查询合约的事件日志（```eth_getLogs```），并按ABI进行解码。支持按区块范围和事件的indexed参数进行过滤，可用于监控成交、到账、流动性池变化等链上事件。

Parameters:

- `k` (string, required): 固定为```logs```，用于查询事件日志。
- `query` (object, required): 查询条件：```address```为合约地址（字符串或数组）；```event```为事件名称或完整的事件签名（例如```"Transfer(address,address,uint256)"```）；```filter```为按indexed参数名进行过滤的对象，值为数组时表示匹配其中任意一个值；```fromBlock```、```toBlock```用于指定区块范围（可为数字或```latest```等标签，负数表示相对于最新区块的偏移，默认均为```latest```）；也可以直接设置```topics```或```blockHash```。

Returns (array): 返回日志数组，每项包含```address```（小写）、```blockNumber```、```logIndex```、```transactionIndex```（数字）、```transactionHash```、```blockHash```、```topics```、```data```、```removed```，能按ABI解码时另有```event```（事件名）和```args```（参数）。

查询USDC转账事件和Uniswap流动性池的Swap事件。

```javascript
function main() {
    var USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
    var POOL = "0x88e6A0c2dDD26FEEb64F039a2c41296FcB3f5640"   // Uniswap V3 USDC/WETH 0.05% 池

    // 代币的 Transfer 事件内置支持；fromBlock 为负数表示相对最新区块
    var transfers = exchange.IO("logs", { address: USDC, event: "Transfer", fromBlock: -2 })
    Log("最近3个区块的 USDC 转账:", transfers.length, "条")
    if (transfers.length > 0) {
        var t = transfers[0]
        Log(t.blockNumber, t.transactionHash, t.args.from, "→", t.args.to, t.args.value)
        // 按 indexed 参数过滤
        var mine = exchange.IO("logs", { address: USDC, event: "Transfer", fromBlock: -2,
            filter: { from: t.args.from } })
        Log("同一发送方:", mine.length, "条")
    }

    // 其它合约的事件需要先注册包含该事件的 ABI
    exchange.IO("abi", POOL, JSON.stringify([{ type: "event", name: "Swap", anonymous: false,
        inputs: [
        { indexed: true, name: "sender", type: "address" }, { indexed: true, name: "recipient",
            type: "address" },
        { indexed: false, name: "amount0", type: "int256" }, { indexed: false, name: "amount1",
            type: "int256" },
        { indexed: false, name: "sqrtPriceX96", type: "uint160" }, { indexed: false,
            name: "liquidity", type: "uint128" },
        { indexed: false, name: "tick", type: "int24" }] }]))
    var swaps = exchange.IO("logs", { address: POOL, event: "Swap", fromBlock: -20 })
    swaps.forEach(function (s) {
        Log("Swap 区块", s.blockNumber, "amount0:", s.args.amount0, "amount1:", s.args.amount1,
            "tick:", s.args.tick)
    })
}
```

代币的```Transfer```、```Approval```事件已内置支持；其他事件需要先通过```exchange.IO("abi", ...)```注册包含该事件的ABI。

当节点对查询的区块跨度或返回条数有限制时，将返回节点给出的错误信息，此时可缩小区块范围进行分段查询。

目前仅支持以太坊（EVM）链，不支持波场（TRON）。

See also: `Web3`, `exchange.IO`, `exchange.IO("abi")`, `exchange.IO("waitReceipt")`, `exchange.IO("decode")`

##### exchange.IO("waitReceipt", ...)

```
exchange.IO(k, txHash)
exchange.IO(k, txHash, options)
```

Forms:

- `exchange.IO("waitReceipt", ...)`

等待交易上链并达到指定的确认数，返回交易回执及解码后的事件日志。

Parameters:

- `k` (string, required): 固定为```waitReceipt```，用于等待交易回执。
- `txHash` (string, required): 交易哈希（以```0x```开头的32字节十六进制字符串），即发送交易时```exchange.IO("api", ...)```返回的值。
- `options` (object, optional): 可选设置```{timeout, confirmations, interval}```：```timeout```为最长等待时间（毫秒，默认120000，范围1000～600000），```confirmations```为需要的确认数（默认1），```interval```为查询间隔（毫秒，默认1500，范围200～60000）。

Returns (object): 返回交易回执，保留节点返回的原始字段，并做如下处理：```status```为数值（1表示成功，0表示失败），```blockNumber```为数值，```gasUsed```、```effectiveGasPrice```等字段为十进制字符串；```events```为解码后的事件数组，每个元素包含```address```、```event```、```args```、```logIndex```字段；交易执行失败时，```revertReason```为失败原因。若超时仍未上链，则返回空值，可通过```GetLastError()```获取具体的错误信息。

发送交易后等待其上链，并检查执行结果和事件。

```javascript
function main() {
    // 发送交易后会得到交易哈希，例如：
    // var txHash = exchange.IO("api", "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", "approve",
    // spender, amount)
    var txHash = "TX_HASH"     // 需要等待的交易哈希

    // 最多等待 2 分钟，直到达到 2 个确认
    var rec = exchange.IO("waitReceipt", txHash, { timeout: 120000, confirmations: 2 })
    if (!rec) {
        Log("等待失败:", GetLastError())
        return
    }
    if (rec.status !== 1) {
        Log("交易执行失败:", rec.revertReason)
        return
    }
    Log("区块:", rec.blockNumber, "gasUsed:", rec.gasUsed, "gas价格:", rec.effectiveGasPrice)
    // events 为解码后的事件；代币的 Transfer/Approval 事件无需注册 ABI
    rec.events.forEach(function (e) {
        Log(e.address, e.event, JSON.stringify(e.args))
    })
}
```

事件按照通过```exchange.IO("abi", ...)```注册的ABI进行解码；代币的```Transfer```、```Approval```事件已内置支持，无需注册。没有匹配ABI的日志不会出现在```events```中，可在```logs```中查看其原始数据。

目前仅支持以太坊（EVM）链，暂不支持波场（TRON）。

See also: `Web3`, `exchange.IO`, `exchange.IO("logs")`, `exchange.IO("speedUp")`, `exchange.IO("cancelTx")`, `exchange.IO("api")`

##### exchange.IO("nonce", ...)

```
exchange.IO(k)
exchange.IO(k, "sync")
exchange.IO(k, nonce)
```

Forms:

- `exchange.IO("nonce", ...)`

查看、同步或设置发送交易时使用的nonce计数。

Parameters:

- `k` (string, required): 固定为```nonce```，用于管理nonce。
- `nonce` (string / number, optional): 不传该参数时仅查询nonce状态；传入```sync```时，按节点返回的pending计数重新同步本地记录；传入数值时，将本地记录的下一个nonce设置为该值。

Returns (object): 返回```{address, latest, pending, local}```对象：```latest```为已上链的交易数；```pending```为节点返回的包含待处理交易在内的计数；```local```为本地记录的下一个nonce（尚未发送过交易时为空值）。各数值均以字符串形式返回。

查看nonce状态并重新同步。

```javascript
function main() {
    // latest：已上链的交易数；pending：节点看到的含待处理交易的计数；local：本地下一个要用的 nonce
    var st = exchange.IO("nonce")
    Log("地址:", st.address, "latest:", st.latest, "pending:", st.pending, "local:", st.local)
    if (Number(st.pending) > Number(st.latest)) {
        Log("有", Number(st.pending) - Number(st.latest), "笔交易还未上链")
    }
    // 在其它地方（钱包、其它程序）用同一地址发过交易后，可以手动按链上重新同步
    st = exchange.IO("nonce", "sync")
    Log("同步后 local:", st.local)
}
```

发送交易时自动分配nonce：取节点返回的pending计数与本地记录的下一个nonce中的较大值。节点计数较大，说明该地址在其它地方发送过交易，此时采用节点的值；本地记录较大，说明自己发送的交易尚未被节点感知（例如通过```exchange.IO("sendBase", ...)```的私有通道发送），此时沿用本地的值，因此连续发送交易时不会重复使用nonce。当节点返回nonce过低或该nonce已存在待处理交易时，自动重新同步并重发一次；当本地记录领先于节点且长时间（5分钟）没有新交易上链时，判定中间有交易被丢弃，自动回退到节点的计数。

本地记录仅在同一个交易所对象（同一个机器人）内有效。多个机器人共用一个钱包时，彼此无法获取对方的记录，仍可能发生nonce冲突，建议每个机器人使用独立的钱包。

发送交易时，也可以在```exchange.IO("api", ...)```的最后一个参数中设置```nonce```，手动指定nonce。

目前仅支持以太坊（EVM）链，暂不支持波场（TRON）。

See also: `Web3`, `exchange.IO`, `exchange.IO("cancelTx")`, `exchange.IO("speedUp")`, `exchange.IO("sendBase")`

##### exchange.IO("speedUp", ...)

```
exchange.IO(k, txHash)
exchange.IO(k, txHash, options)
```

Forms:

- `exchange.IO("speedUp", ...)`

对卡住（长时间未上链）的交易进行加价重发：保持接收地址、金额、调用数据和gas上限不变，仅提高手续费。

Parameters:

- `k` (string, required): 固定为```speedUp```，用于加价重发交易。
- `txHash` (string, required): 待替换的、尚未上链的交易哈希，该交易必须由当前钱包发出。
- `options` (object, optional): 可选设置：```multiplier```为手续费放大倍数，范围1.1～10，默认1.125；```dryRun```为```true```时只签名不发送，返回替换交易的内容（字段与```exchange.IO("api", ...)```设置```dryRun```时相同，另有```replaces```为被替换的交易哈希）。

Returns (string / object): 返回替换交易的哈希；```dryRun```为```true```时返回替换交易的内容。

交易在一段时间内未上链时加价重发。

```javascript
function main() {
    var USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
    var spender = "0x1111111254EEB25477B68fb85Ed929f73A960582"
    var txHash = exchange.IO("api", USDC, "approve", spender, "1000000")
    Log("已发送:", txHash)
    var rec = exchange.IO("waitReceipt", txHash, { timeout: 30000 })
    if (!rec) {
        // 30 秒后仍未上链：使用相同的 nonce 加价重发（tip 和 maxFee 至少上涨 12.5%）
        txHash = exchange.IO("speedUp", txHash)
        Log("已加价重发:", txHash)
        rec = exchange.IO("waitReceipt", txHash, { timeout: 30000 })
    }
    Log(rec ? "已上链，status: " + rec.status : "仍未上链: " + GetLastError())
}
```

替换交易沿用原交易的nonce，手续费按```multiplier```放大（默认值为1.125，最小值为1.1；节点要求替换交易的tip和maxFee均至少上涨10%），且不低于当前网络的建议值。

当原交易已上链、节点查询不到原交易（例如通过私有通道发送）或原交易并非由当前钱包发出时，函数返回空值并报错。

目前仅支持以太坊（EVM）链，暂不支持波场（TRON）。

手续费的计算：原交易为EIP-1559交易时，小费取原小费×```multiplier```与当前建议小费中的较大者，最高费用取原最高费用×```multiplier```与```2 × baseFee + 小费```中的较大者；原交易为传统交易时，gas价格取原gas价格×```multiplier```与节点```eth_gasPrice```中的较大者。接收地址、金额、调用数据和gas上限与原交易相同。

原交易在交易所对象配置的节点上查询；设置了```exchange.IO("sendBase", ...)```时，替换交易从该节点广播。

See also: `Web3`, `exchange.IO`, `exchange.IO("cancelTx")`, `exchange.IO("nonce")`, `exchange.IO("waitReceipt")`

##### exchange.IO("cancelTx", ...)

```
exchange.IO(k, txHash)
exchange.IO(k, txHash, options)
```

Forms:

- `exchange.IO("cancelTx", ...)`

取消尚未上链的交易：使用与原交易相同的nonce，以更高的手续费发送一笔转给自己的0金额交易；该交易先上链后，原交易即失效。

Parameters:

- `k` (string, required): 固定为```cancelTx```，用于取消交易。
- `txHash` (string, required): 待替换的、尚未上链的交易哈希，该交易必须由当前钱包发出。
- `options` (object, optional): 可选设置：```multiplier```为手续费放大倍数，范围1.1～10，默认1.125；```dryRun```为```true```时只签名不发送，返回替换交易的内容（字段与```exchange.IO("api", ...)```设置```dryRun```时相同，另有```replaces```为被替换的交易哈希）。

Returns (string / object): 返回取消交易的哈希；启用```dryRun```时返回取消交易的内容。

取消一笔已发送的交易。

```javascript
function main() {
    var USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
    var spender = "0x1111111254EEB25477B68fb85Ed929f73A960582"
    var txHash = exchange.IO("api", USDC, "approve", spender, "1000000")
    Log("已发送:", txHash)
    // 先使用 dryRun 查看替换交易的手续费（不发送）
    Log(JSON.stringify(exchange.IO("cancelTx", txHash, { dryRun: true, multiplier: 1.5 })))
    // 不再需要这笔交易：使用同一个 nonce 发送一笔转给自己的 0 金额交易，手续费更高，先上链即可替换原交易
    var cancelHash = exchange.IO("cancelTx", txHash)
    Log("取消交易:", cancelHash)
}
```

替换交易沿用原交易的nonce，手续费按```multiplier```放大（默认值为1.125，最小值为1.1；节点要求替换交易的tip和maxFee均至少提高10%），且不低于当前网络的建议值。

取消操作不保证成功：如果原交易先被打包，取消交易将因nonce已被使用而失效。

当原交易已上链、节点查询不到原交易（例如通过私有通道发送），或原交易并非由当前钱包发出时，函数返回空值并报错。

目前仅支持以太坊（EVM）链，暂不支持波场（TRON）。

手续费的计算：原交易为EIP-1559交易时，小费取原小费×```multiplier```与当前建议小费中的较大者，最高费用取原最高费用×```multiplier```与```2 × baseFee + 小费```中的较大者；原交易为传统交易时，gas价格取原gas价格×```multiplier```与节点```eth_gasPrice```中的较大者。取消交易的gas上限为21000。

原交易在交易所对象配置的节点上查询；设置了```exchange.IO("sendBase", ...)```时，替换交易从该节点广播。

See also: `Web3`, `exchange.IO`, `exchange.IO("speedUp")`, `exchange.IO("nonce")`, `exchange.IO("waitReceipt")`

##### exchange.IO("toUnits", ...)

```
exchange.IO(k, amount, decimals)
```

Forms:

- `exchange.IO("toUnits", ...)`

将可读数量换算为链上整数。换算全程以字符串形式进行精确计算，不经过浮点数运算。

Parameters:

- `k` (string, required): 固定为```toUnits```，用于将可读数量换算为链上整数。
- `amount` (string / number, required): 可读数量，例如```"1.5"```。建议以字符串形式传入，以避免JavaScript数值类型的精度问题；不支持科学计数法。
- `decimals` (number / string, required): 精度，可以传入数字（例如USDC为6，ETH为18），也可以传入代币合约地址，此时将自动调用该代币合约的```decimals()```方法读取精度。

Returns (string): 返回链上整数（十进制字符串）。当小数位数超过精度时，返回空值并报错，不会静默截断。

换算USDC与ETH的数量。

```javascript
function main() {
    var USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
    // 可读数量 -> 链上整数，精度可以传数字，也可以传代币地址（自动读取 decimals）
    Log(exchange.IO("toUnits", "1.5", 6))
    // 输出：1500000
    Log(exchange.IO("toUnits", "1.5", USDC))
    // 输出：1500000
    Log(exchange.IO("toUnits", "0.01", 18))
    // 输出：10000000000000000
    // 链上整数 -> 可读数量
    Log(exchange.IO("fromUnits", "1500000", 6))
    // 输出：1.5
    var raw = exchange.IO("api", USDC, "balanceOf", exchange.IO("address"))
    Log("USDC余额:", exchange.IO("fromUnits", raw, USDC))
    // 小数位多于精度时报错，不会静默截断
    Log(exchange.IO("toUnits", "1.0000001", 6), GetLastError())
}
```

与```exchange.IO("fromUnits", ...)```互为逆运算。

See also: `Web3`, `exchange.IO`, `exchange.IO("fromUnits")`, `以太坊/波场RPC调用`, `exchange.IO("api")`

##### exchange.IO("fromUnits", ...)

```
exchange.IO(k, amount, decimals)
```

Forms:

- `exchange.IO("fromUnits", ...)`

将链上整数值换算为可读数量，整个换算过程基于字符串进行精确计算，不经过浮点数运算，避免精度损失。

Parameters:

- `k` (string, required): 固定为```fromUnits```，用于将链上整数值换算为可读数量。
- `amount` (string / number, required): 待换算的链上整数值，可以是十进制字符串、以```0x```开头的十六进制字符串或数值。
- `decimals` (number / string, required): 精度，可以传入数值（例如USDC为6，ETH为18），也可以传入代币合约地址，此时将自动调用该代币合约的```decimals()```方法读取精度。

Returns (string): 返回可读数量（十进制字符串，已去除末尾多余的0）。

USDC与ETH的数量换算。

```javascript
function main() {
    var USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
    // 可读数量 -> 链上整数，精度可以传数字，也可以传代币地址（自动读取 decimals）
    Log(exchange.IO("toUnits", "1.5", 6))
    // 输出：1500000
    Log(exchange.IO("toUnits", "1.5", USDC))
    // 输出：1500000
    Log(exchange.IO("toUnits", "0.01", 18))
    // 输出：10000000000000000
    // 链上整数 -> 可读数量
    Log(exchange.IO("fromUnits", "1500000", 6))
    // 输出：1.5
    var raw = exchange.IO("api", USDC, "balanceOf", exchange.IO("address"))
    Log("USDC余额:", exchange.IO("fromUnits", raw, USDC))
    // 小数位多于精度时报错，不会静默截断
    Log(exchange.IO("toUnits", "1.0000001", 6), GetLastError())
}
```

与```exchange.IO("toUnits", ...)```互为逆运算。

See also: `Web3`, `exchange.IO`, `exchange.IO("toUnits")`, `以太坊/波场RPC调用`, `exchange.IO("api")`

##### exchange.IO("uniswapV3", ...)

```
exchange.IO(k, fn, ...args)
```

Forms:

- `exchange.IO("uniswapV3", ...)`

集中流动性（Uniswap V3）相关的计算：tick、价格、sqrtPriceX96之间的换算，以及流动性与代币数量之间的换算。适用于Uniswap v3/v4、PancakeSwap v3、Aerodrome Slipstream、SushiSwap v3等使用相同公式的协议。

Parameters:

- `k` (string, required): 固定为```uniswapV3```，用于集中流动性计算。
- `fn` (string, required): 要调用的计算函数名，例如```tickToPrice```、```priceToTick```；全部函数及其参数见备注。
- `args` (string / number, required): 计算函数的参数。精度参数```decimals0```、```decimals1```可以是数字，也可以是代币地址（自动读取```decimals()```）。大整数参数可以使用字符串。

Returns (number / string / object): 价格类函数返回数字（浮点数，用于显示和价位估算）；tick类函数返回整数；sqrtPriceX96和流动性、数量类函数返回十进制字符串（精确值）。

读取Uniswap V3池子价格，并计算在当前价格附近提供流动性所需的数量。

```javascript
function main() {
    var C = exchange.IO("contracts")
    var T = C.tokens, U = C.uniswapV3
    exchange.IO("abi", U.factory, "uniswapV3Factory")
    var pool = exchange.IO("api", U.factory, "getPool", T.USDC.address, T.WETH.address, 500)
    exchange.IO("abi", pool, "uniswapV3Pool")
    var s = exchange.IO("api", pool, "slot0")
    // 该池 token0 为 USDC（6 位精度），token1 为 WETH（18 位精度）：价格表示 1 USDC 值多少 WETH
    var p = exchange.IO("uniswapV3", "sqrtPriceToPrice", s.sqrtPriceX96, 6, 18)
    Log("tick:", s.tick, "ETH 价格:", (1 / p).toFixed(2), "USDC")

    // 以当前价格为中心 ±5% 设置区间，tick 向下对齐到 tickSpacing（0.05% 费率池为 10）
    var lower = exchange.IO("uniswapV3", "priceToTick", p * 0.95, 6, 18, 10)
    var upper = exchange.IO("uniswapV3", "priceToTick", p * 1.05, 6, 18, 10) + 10
    // 最多投入 1000 USDC 和 0.4 WETH 时能提供的流动性，以及实际用掉的数量
    var liq = exchange.IO("uniswapV3", "liquidityForAmounts", s.sqrtPriceX96, lower, upper,
        exchange.IO("toUnits", "1000", 6), exchange.IO("toUnits", "0.4", 18))
    var used = exchange.IO("uniswapV3", "amountsForLiquidity", s.sqrtPriceX96, lower, upper, liq)
    Log("区间 tick:", lower, "~", upper, "流动性:", liq)
    Log("实际投入:", exchange.IO("fromUnits", used.amount0, 6), "USDC +", exchange.IO("fromUnits",
        used.amount1, 18), "WETH")
}
```

tick与sqrtPriceX96的换算、流动性与数量的换算是合约TickMath、LiquidityAmounts算法的逐位移植，结果与链上合约完全一致；价格换算使用浮点数，存在浮点精度误差。

池子中token0、token1按地址大小排序，价格的方向是1个token0值多少token1，计算前需要确认池子的```token0```。

```fn```支持的计算函数（函数名后为它的参数）：

- ```tickToPrice(tick, decimals0, decimals1)```：tick对应的价格（1个token0值多少token1）。
- ```priceToTick(price, decimals0, decimals1[, tickSpacing])```：不高于该价格的最大tick，传tickSpacing时向下对齐到其整数倍。
- ```sqrtPriceToPrice(sqrtPriceX96, decimals0, decimals1)```：池子slot0中的sqrtPriceX96换算为价格。
- ```tickToSqrtPrice(tick)```：tick对应的sqrtPriceX96（与合约TickMath.getSqrtRatioAtTick结果一致）。
- ```sqrtPriceToTick(sqrtPriceX96)```：sqrtPriceX96所在的tick（与合约TickMath.getTickAtSqrtRatio一致）。
- ```nearestUsableTick(tick, tickSpacing)```：四舍五入到tickSpacing的整数倍。
- ```amountsForLiquidity(sqrtPriceX96, tickLower, tickUpper, liquidity)```：区间内流动性在当前价格下对应的代币数量{amount0, amount1}（与合约取出流动性的计算一致）。
- ```liquidityForAmounts(sqrtPriceX96, tickLower, tickUpper, amount0, amount1)```：最多投入给定数量时能提供的流动性。。

See also: `Web3`, `exchange.IO`, `exchange.IO("contracts")`, `exchange.IO("multicall")`, `exchange.IO("api")`

##### exchange.IO("contracts", ...)

```
exchange.IO(k)
exchange.IO(k, chainId)
```

Forms:

- `exchange.IO("contracts", ...)`

获取当前链（或指定链）的常用合约地址，包括主流代币、Multicall3、Permit2，以及Uniswap V3、PancakeSwap V3的Factory、路由、QuoterV2和头寸管理合约。

Parameters:

- `k` (string, required): 固定为```contracts```，用于获取常用合约地址。
- `chainId` (number, optional): 链ID，未传入时默认使用当前节点所在的链。目前支持的链：以太坊（1）、BNB Smart Chain（56）、Base（8453）、Arbitrum One（42161）。

Returns (object): 返回```{chainId, name, wrappedNative, tokens, multicall3, permit2, uniswapV3, pancakeV3}```：```name```为链名称；```wrappedNative```为包装币在```tokens```中的名称（如```WETH```、```WBNB```）；```tokens```的每一项为```{address, decimals}```；```uniswapV3```、```pancakeV3```包含```factory```、```router```（Uniswap为SwapRouter02，PancakeSwap为SmartRouter）、```quoterV2```、```positionManager```。不支持的链返回空值并报错。

查看当前链的常用合约地址，并使用QuoterV2进行询价。

```javascript
function main() {
    // 获取当前链的常用合约地址表
    var C = exchange.IO("contracts")
    Log(C.name, "chainId:", C.chainId, "包装币:", C.wrappedNative)
    for (var sym in C.tokens) {
        Log(sym, C.tokens[sym].address, "decimals:", C.tokens[sym].decimals)
    }
    Log("Uniswap V3:", JSON.stringify(C.uniswapV3))

    // 使用地址表中的地址和内置 ABI 模板进行询价
    var quoter = C.uniswapV3.quoterV2
    exchange.IO("abi", quoter, "uniswapV3QuoterV2")
    var q = exchange.IO("call", quoter, "quoteExactInputSingle",
        [C.tokens.WETH.address, C.tokens.USDC.address, exchange.IO("toUnits", "1", 18), 500, 0])
    Log("1 WETH ≈", exchange.IO("fromUnits", q.amountOut, 6), "USDC")

    // 查看其他链的地址表
    Log("BSC PancakeSwap V3:", JSON.stringify(exchange.IO("contracts", 56).pancakeV3))
}
```

地址表中的每个地址均已在链上核验：合约代码存在；代币的symbol、decimals与链上查询结果一致；路由、询价、头寸管理合约中记录的factory均指向同一个Factory合约，并且能够查询到包装币/USDC的流动性池。

配合```exchange.IO("abi", ...)```的内置模板使用，无需手动编写ABI即可直接调用这些合约。

目前仅支持以太坊（EVM）链，在波场（TRON）上调用返回空值，```GetLastError()```中有错误信息。

See also: `Web3`, `exchange.IO`, `exchange.IO("api")`, `exchange.IO("multicall")`, `exchange.IO("uniswapV3")`, `exchange.IO("abi")`

##### exchange.IO("address")

```
exchange.IO(k)
exchange.IO(k, key)
```

Forms:

- `exchange.IO("address")`

获取`exchange`交易所对象配置的钱包的地址。传入私钥时返回该私钥对应的钱包地址。

Parameters:

- `k` (string, required): 固定为```address```，用于获取已配置的钱包地址。
- `key` (string, optional): 私钥（十六进制字符串，```0x```前缀可选），返回该私钥对应的钱包地址，不会切换交易所对象使用的私钥（切换请使用```exchange.IO("key", ...)```）。不传时使用配置的私钥。

Returns (string): 返回钱包地址：以太坊（EVM）为```0x```开头的小写地址，波场（TRON）为```T```开头的地址。私钥无效时返回空值。

打印交易所对象所配置私钥的钱包地址。

```javascript
function main() {
    Log(exchange.IO("address"))
    // 输出：0x开头的钱包地址
}
```

See also: `Web3`, `exchange.IO`, `exchange.IO("key")`, `exchange.IO("sign")`, `exchange.IO("signMessage")`

##### exchange.IO("base", ...)

```
exchange.IO(k)
exchange.IO(k, address)
```

Forms:

- `exchange.IO("base", ...)`

设置Web3交易所对象的RPC节点地址，EVM链可以设置多个节点互为备用。

Parameters:

- `k` (string, required): 固定为```base```，用于切换RPC节点。
- `address` (string / array, optional): 节点地址。以太坊（EVM）支持```http(s)://```和```ws(s)://```地址；设置多个节点时传入地址数组，或用逗号（也可以是空格、换行）分隔的字符串。波场（TRON）只支持一个全节点HTTP地址，传入多个地址（数组或逗号分隔的字符串）时报错；旧的gRPC地址```grpc.trongrid.io:50051```、```grpc.nile.trongrid.io:50051```、```grpc.shasta.trongrid.io:50051```会换成对应的HTTP地址，其它非HTTP地址报错。不传时只查询当前的节点地址。

Returns (string): 设置时返回设置前的节点地址（多个节点时为逗号分隔的字符串）；不传```address```时返回当前的节点地址。

把RPC节点切换到BSC链。

```javascript
function main() {
    var chainRpc = "https://bsc-dataseed.binance.org"
    exchange.IO("base", chainRpc)    // 切换到BSC链
}
```

设置多个节点互为备用。

```javascript
function main() {
    // 多个节点互为备用：节点不可用或限流时自动切换到下一个，chainId 与第一个节点不一致的节点不会被使用
    exchange.IO("base", ["https://bsc-dataseed.bnbchain.org", "https://bsc-rpc.publicnode.com"])
    Log("节点:", exchange.IO("base"))
    Log("区块高度:", parseInt(exchange.IO("api", "eth", "eth_blockNumber"), 16))
}
```

设置多个节点时，优先从上次请求成功的节点开始使用；当节点出现连接失败、请求超时、返回非2xx的HTTP状态码、响应不是有效的JSON-RPC格式或被限流等情况时，自动切换到下一个节点。合约执行失败（revert）等正常的JSON-RPC错误不会触发节点切换。

每个节点首次使用时会校验chainId，与第一个可用节点所在链不一致的节点将不会被使用，以避免将交易发送到其他链。日志中的节点地址仅显示协议和域名，不包含路径中的API Key。

切换节点后重新获取链ID。多个节点互为备用只适用于以太坊（EVM），波场（TRON）不支持。

See also: `Web3`, `exchange.IO`, `exchange.IO("sendBase")`, `以太坊/波场RPC调用`, `exchange.IO("contracts")`

##### exchange.IO("sendBase", ...)

```
exchange.IO(k)
exchange.IO(k, url)
```

Forms:

- `exchange.IO("sendBase", ...)`

设置仅用于广播交易的节点。设置后，读取数据、查询nonce、估算gas等请求仍使用交易所对象配置的节点，而签名后的交易仅发送至该节点。该功能适用于Flashbots Protect、MEV Blocker等私有交易通道，可避免交易进入公开交易池后遭到抢跑或三明治攻击。

Parameters:

- `k` (string, required): 固定为```sendBase```，用于设置广播交易的节点。
- `url` (string, optional): 节点的JSON-RPC地址（支持http或https协议），例如```"https://rpc.mevblocker.io"```、```"https://rpc.flashbots.net"```。传入空字符串时清除该设置，恢复为通过交易所对象配置的节点发送交易；不传入该参数时，仅查询当前设置。

Returns (string): 返回设置前的发送节点地址；此前未设置时返回空字符串。

通过MEV Blocker发送交易。

```javascript
function main() {
    // 读请求仍走交易所对象配置的节点，签名后的交易只发给 MEV Blocker
    var old = exchange.IO("sendBase", "https://rpc.mevblocker.io")
    Log("原发送节点:", old, "当前发送节点:", exchange.IO("sendBase"))
    // 之后的交易都从私有通道发送，例如：
    // var txHash = exchange.IO("api", "eth", "send", toAddress, value)
    // 传空字符串清除，恢复从配置的节点发送
    exchange.IO("sendBase", "")
}
```

通过私有通道发送的交易不会计入公开节点的pending计数；连续发送交易时，由本地nonce记录确保nonce不被重复使用，详见```exchange.IO("nonce", ...)```。

发送至该节点的请求不会携带交易所对象所配置节点的鉴权信息（ApiKey）。

影响```exchange.IO("api", ...)```发送的交易（转账和合约写操作）以及```exchange.IO("speedUp", ...)```、```exchange.IO("cancelTx", ...)```的替换交易，```dryRun```时不会发送。

目前仅支持以太坊（EVM）链，在波场（TRON）上调用返回空值，```GetLastError()```中有错误信息。

See also: `Web3`, `exchange.IO`, `exchange.IO("base")`, `exchange.IO("nonce")`, `exchange.IO("speedUp")`
