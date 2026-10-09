# FMZ 策略 API 参考

由平台语法指南（https://www.fmz.com/syntax-guide）生成：全部内置函数、结构体与常量，示例覆盖 JavaScript、Python、Rust。按函数名（如 `exchange.GetTicker`）在本文件内搜索。

## 内置函数

### Global

#### Version

```
Version()
```

返回当前系统版本号。

Returns (string): 当前系统版本号，例如：```3.6```。

```javascript
function main() {
    Log("version:", Version())
}
```

```python
def main():
    Log("version:", Version())
```

```rust
fn main() {
    Log!("version:", Version());
}
```

系统版本号即托管者程序的版本号。

#### IsVirtual

```
IsVirtual()
```

用于判断策略的运行环境是否为回测系统。

Returns (bool): 当策略运行在回测系统环境中时，返回真值，例如：```true```；当策略运行在实盘环境中时，返回假值，例如：```false```。

```javascript
function main() {
    if (IsVirtual()) {
        Log("Currently in backtest environment.")
    } else {
        Log("Currently in live trading environment.")
    }
}
```

```python
def main():
    if IsVirtual():
        Log("Currently in backtest environment.")
    else:
        Log("Currently in live trading environment.")
```

```rust
fn main() {
    if IsVirtual() {
        Log!("Currently in backtest environment.");
    } else {
        Log!("Currently in live trading environment.");
    }
}
```

用于判断当前运行环境是否为回测系统，以便兼容回测与实盘环境之间的差异。

#### GetOS

```
GetOS()
```

获取托管者所在设备的操作系统信息。

Returns (string): 操作系统信息。

```javascript
function main() {
    Log("GetOS:", GetOS())
}
```

```python
def main():
    Log("GetOS:", GetOS())
```

```rust
fn main() {
    Log!("GetOS:", GetOS());
}
```

例如，在**Mac OS**操作系统下运行的托管者，调用```GetOS()```函数可能返回：```darwin/amd64```。由于苹果电脑采用多种硬件架构，返回值中会附带具体的架构信息。其中，```darwin```即**Mac OS**系统的内核名称。

#### GetPid

```
GetPid()
```

获取实盘进程的 ID。

Returns (string): 返回实盘进程的 ID。

```javascript
function main(){
    var id = GetPid()
    Log(id)
}
```

```python
def main():
    id = GetPid()
    Log(id)
```

```rust
fn main() {
    let id = GetPid();
    Log!(id);
}
```

#### GetMeta

```
GetMeta()
```

获取在生成策略注册码时写入的```Meta```值。

Returns (string): ```Meta```数据。

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
    maxBaseCurrency = null
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

#### Sleep

```
Sleep(millisecond)
```

休眠函数，使程序暂停运行一段指定的时间。

Parameters:

- `millisecond` (number, required): ```millisecond```参数用于设置休眠时长，单位为毫秒。

```javascript
function main() {
    Sleep(1000 * 10)   // 等待10秒钟
    Log("Waited for 10 seconds")
}
```

```python
def main():
    Sleep(1000 * 10)
    Log("Waited for 10 seconds")
```

```rust
fn main() {
    Sleep(1000 * 10);   // 等待10秒钟
    Log!("Waited for 10 seconds");
}
```

例如，执行```Sleep(1000)```函数时，程序将休眠1秒。该函数支持小于1毫秒的休眠操作，例如```Sleep(0.1)```。支持的最小参数为```0.000001```，即纳秒级休眠，1纳秒等于```1e-6```毫秒。

在使用```Python```语言编写策略时，对于轮询间隔、时间等待等操作，应当使用```Sleep(millisecond)```函数，而不建议使用```Python```中```time```库的```time.sleep(second)```函数。因为策略在回测时若使用```time.sleep(second)```函数，会使策略程序实际等待一段时间（而非在回测系统的时间序列上跳过），从而导致回测速度非常缓慢。

#### Unix

```
Unix()
```

获取当前时刻的秒级时间戳。

Returns (number): 返回秒级时间戳。

```javascript
function main() {
    var t = Unix()
    Log(t)
}
```

```python
def main():
    t = Unix()
    Log(t)
```

```rust
fn main() {
    let t = Unix();
    Log!(t);
}
```

See also: `UnixNano`

#### UnixNano

```
UnixNano()
```

获取当前时刻的纳秒级时间戳。

Returns (number): ```UnixNano()```函数返回纳秒级时间戳。

如果需要获取毫秒级时间戳，可以使用以下代码：

```javascript
function main() {
    var time = UnixNano() / 1000000
    Log(_N(time, 0))
}
```

```python
def main():
    time = UnixNano()
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

将毫秒级时间戳或```Date```对象转换为时间字符串。

Parameters:

- `timestamp` (number / object, optional): 毫秒级时间戳或```Date```对象。
- `fmt` (string, optional): 格式化字符串，```JavaScript```语言默认格式：```yyyy-MM-dd hh:mm:ss```；```Python```语言默认格式：```%Y-%m-%d %H:%M:%S```。

Returns (string): 时间字符串。

获取并打印当前时间字符串：

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

时间戳为1574993606000，使用代码进行转换：

```javascript
function main() {
    Log(_D(1574993606000))
}
```

```python
def main():
    # 在北京时间的服务器上运行结果为：2019-11-29 10:13:26；而在其他地区服务器上的托管者运行此代码，结果则为：2019-11-29 02:13:26
    Log(_D(1574993606))
```

```rust
fn main() {
    Log!(_D(1574993606000));
}
```

使用参数```fmt```进行格式化，```JavaScript```、```Python```语言的格式化字符串有所不同，具体请参看以下示例：

```javascript
function main() {
    Log(_D(1574993606000, "yyyy--MM--dd hh--mm--ss"))   // 2019--11--29 10--13--26
}
```

```python
def main():
    # 1574993606 为秒级时间戳
    Log(_D(1574993606, "%Y--%m--%d %H--%M--%S"))        #  2019--11--29 10--13--26
```

```rust
fn main() {
    // Rust 的 _D() 函数不支持 fmt 参数，仅支持默认格式：yyyy-MM-dd hh:mm:ss
    Log!(_D(1574993606000));    // 2019-11-29 10:13:26
}
```

若不传入任何参数，则返回当前时间字符串。在```Python```策略中使用```_D()```函数时，需要注意传入的参数为秒级时间戳（JavaScript、Rust策略中为毫秒级时间戳，1秒等于1000毫秒）。在实盘中使用```_D()```函数将时间戳解析为可读时间字符串时，需要注意托管者程序所在操作系统的时区与时间设置，因为```_D()```函数的解析结果取决于托管者系统的时间。

See also: `UnixNano`, `Unix`

#### GetCommand

```
GetCommand()
```

获取策略的交互命令。

Returns (string): 返回的命令格式为```ControlName:Data```，其中```ControlName```为控件名称，```Data```为控件中输入的数据。如果交互控件不包含输入框、下拉框等输入组件（例如：不带输入框的按钮控件），则返回的命令格式为```ControlName```，即仅返回控件名称。

检测交互命令，并在检测到交互命令时使用```Log```函数将其输出。

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
        // Rust 的 GetCommand() 需要传入超时参数（毫秒），返回 Option<String>，无命令时为 None
        if let Some(cmd) = GetCommand(0) {
            Log!(cmd);
        }
        Sleep(1000);
    }
}
```

例如，在策略交互控件中添加一个不带输入框的控件，将其命名为```buy```，控件描述信息为```买入```，这是一个按钮控件；再添加一个带输入框的控件，将其命名为```sell```，控件描述信息为```卖出```，这是一个由按钮和输入框组合而成的交互控件。在策略中编写交互代码，以响应不同的交互控件：

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
        if let Some(cmd) = GetCommand(0) {
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

该函数在回测系统中无效。

#### GetLastError

```
GetLastError()
```

获取最近一次的错误信息。

Returns (string): 最近一次的错误信息。

```javascript
function main(){
    // 由于不存在编号为 123 的订单，因此会触发错误
    exchange.GetOrder("123")
    var error = GetLastError()
    Log(error)
}
```

```python
def main():
    exchange.GetOrder("123")
    error = GetLastError()
    Log(error)
```

```rust
fn main() {
    // 由于不存在编号为 123 的订单，因此会触发错误
    // Rust 的 GetOrder 接受 &OrderId 参数，字符串 id 需放在 S 字段中
    let id = OrderId { S: "123".to_string(), ..Default::default() };
    let _ = exchange.GetOrder(&id);
    let error = GetLastError();
    Log!(error);
}
```

该函数在回测系统中不起作用。

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

#### _N

```
_N()
_N(num)
_N(num, precision)
```

格式化浮点数。

Parameters:

- `num` (number, required): 待格式化的浮点数。
- `precision` (number, optional): 用于设置格式化精度，参数```precision```为整数，默认值为4。

Returns (number): 根据精度设置格式化后的浮点数。

例如```_N(3.1415, 2)```会保留```3.1415```小数点后两位，删除其余数位，函数返回```3.14```。

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

如果需要将小数点左边的N位数字都置为0，可以这样编写：

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

参数```precision```可以为正整数或负整数。

See also: `exchange.SetPrecision`

#### _C

```
_C(pfn)
_C(pfn, ...args)
```

重试函数，用于对接口调用进行容错处理。

Parameters:

- `pfn` (function, required): 参数```pfn```为函数引用，即一个**回调函数**。
- `arg` (string / number / bool / object / array / function / any (平台支持的任意类型), optional): **回调函数**的参数，参数```arg```可以有多个。参数```arg```的类型与个数由**回调函数**的参数决定。

Returns (除**假值**和**空值**以外的所有平台支持的类型（any）。): 回调函数执行后的返回值。

对无参数的函数进行容错处理：

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

对带参数的函数进行容错处理：

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

也可用于对自定义函数进行容错处理：

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

```_C()```函数会反复调用指定的函数，直到其成功返回为止（当参数```pfn```所引用的函数被调用时返回**空值**或**假值**，则会重试调用```pfn```）。

例如```_C(exchange.GetTicker)```。默认重试间隔为3秒，可调用```_CDelay()```函数来设置重试间隔。

例如```_CDelay(1000)```，表示将```_C()```函数的重试间隔改为1秒。

可以对以下函数进行容错处理（但不限于此）：

- ```exchange.GetTicker()```
- ```exchange.GetDepth()```
- ```exchange.GetTrades()```
- ```exchange.GetRecords()```
- ```exchange.GetAccount()```
- ```exchange.GetOrders()```
- ```exchange.GetOrder()```
- ```exchange.GetPositions()```

以上函数均可通过```_C()```函数调用以实现容错。```_C()```函数的容错并不局限于上述列出的函数。请注意，参数```pfn```为函数引用而非函数调用，即应写作```_C(exchange.GetTicker)```，而非```_C(exchange.GetTicker())```。

#### _Cross

```
_Cross(arr1, arr2)
```

返回数组```arr1```与数组```arr2```的交叉周期数。

Parameters:

- `arr1` (array, required): 元素为```number```类型的数组。
- `arr2` (array, required): 元素为```number```类型的数组。

Returns (number): 数组```arr1```与数组```arr2```的交叉周期数。

可以模拟一组数据来测试_Cross(Arr1, Arr2)函数：

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

```_Cross()```函数的返回值为正数时表示上穿的周期数，为负数时表示下穿的周期数，为0时表示当前价格相等。详细使用说明请参阅：[内置函数_Cross分析及使用说明](https://www.fmz.com/bbs-topic/1140)。

#### JSON.parse

```
JSON.parse(s)
JSON.parse(s, safeStr)
```

```JSON.parse```函数是**ECMAScript**标准内建对象```JSON```的方法，用于解码（解析）JSON字符串。发明者量化交易平台在此基础上为其扩展了一个参数```safeStr```。

Parameters:

- `s` (string, required): 该参数为需要解码（解析）的```JSON```字符串。
- `safeStr` (bool, optional): 当该参数设置为```true```时，若解析过程中遇到可能超出精度范围的数值，会将其以字符串形式返回，以避免精度丢失或数值溢出问题。

Returns (object): 返回值为```JSON```对象。

解码（解析）一个包含大数值的```JSON```字符串。

```javascript
function main() {
    let s1 = '{"num": 8754613216564987646512354656874651651358}'
    Log("JSON.parse:", JSON.parse(s1))          // JSON.parse: {"num":8.754613216564987e+39}
    Log("JSON.parse:", JSON.parse(s1, true))    // JSON.parse: {"num":"8754613216564987646512354656874651651358"}

    let s2 = '{"num": 123}'
    Log("JSON.parse:", JSON.parse(s2))          // JSON.parse: {"num":123}
    Log("JSON.parse:", JSON.parse(s2, true))    // JSON.parse: {"num":123}
}
```

```python
# 可以使用Python的第三方库处理大数值数据。
```

```rust
fn main() {
    // Rust 使用 JSONParse() 函数解析JSON字符串，没有 safeStr 参数
    // 超出精度范围的大数值会被解析为 f64 ，可能丢失精度
    let s1 = r#"{"num": 8754613216564987646512354656874651651358}"#;
    Log!("JSONParse:", JSONParse(s1).unwrap()["num"].as_f64().unwrap_or(0.0));    // JSONParse: 8.754613216564987e39

    let s2 = r#"{"num": 123}"#;
    Log!("JSONParse:", JSONParse(s2).unwrap()["num"].as_f64().unwrap_or(0.0));    // JSONParse: 123
}
```

```JSON.parse()```函数能够正确解析包含较大数值的JSON字符串；当```safeStr```参数设置为真值时，会将较大的数值解析为字符串类型。

```safeStr```参数位同样支持传入```reviver```参数，即一个用于转换结果的函数，该函数会针对对象的每个成员调用一次；具体用法可查阅相关资料，此处不再赘述。

仅支持JavaScript语言。

回测系统中不支持```JSON.parse()```函数的```safeStr```参数功能。

#### JSON.stringify

```
JSON.stringify(obj)
```

```JSON.stringify```函数是**ECMAScript**标准内置对象```JSON```的方法，用于将JavaScript值转换为JSON字符串。

Parameters:

- `obj` (string / number / bool / object / array / function / any (平台支持的任意类型), required): 需要序列化为JSON字符串的值。

Returns (string): 返回序列化后的```JSON```字符串。

将对象序列化为JSON字符串并输出。

```javascript
function main() {
    let s1 = {"num": "8754613216564987646512354656874651651358"}
    Log("JSON.stringify:", JSON.stringify(s1))

    // JSON.stringify: {"num":"8754613216564987646512354656874651651358"}
    // JSON.stringify(s1) 返回的变量为一个字符串类型
}
```

```python
// 略
```

仅支持JavaScript语言。

#### Encode

```
Encode(algo, inputFormat, outputFormat, data)
Encode(algo, inputFormat, outputFormat, data, keyFormat, key)
```

该函数根据传入的参数对数据进行编码。

Parameters:

- `algo` (string, required): 参数```algo```用于指定编码计算时使用的算法，支持设置为以下值之一："raw"（不使用算法）、"sign"、"signTx"、"md4"、"md5"、"sha256"、"sha512"、"sha1"、"keccak256"、"sha3.224"、"sha3.256"、"sha3.384"、"sha3.512"、"sha3.keccak256"、"sha3.keccak512"、"sha512.384"、"sha512.256"、"sha512.224"、"ripemd160"、"blake2b.256"、"blake2b.512"、"blake2s.128"、"blake2s.256"。

参数```algo```还支持"text.encoder.utf8"、"text.decoder.utf8"、"text.encoder.gbk"、"text.decoder.gbk"，用于对字符串进行编码或解码。

参数```algo```同时支持"ed25519"算法，并可搭配不同的哈希算法使用，例如参数```algo```可写为"ed25519.md5"、"ed25519.sha512"等，也支持```ed25519.seed```计算。
- `inputFormat` (string, required): 用于指定```data```参数的数据格式。```inputFormat```参数支持设置为"raw"、"hex"、"base64"、"string"其中之一。"raw"表示原始数据，"hex"表示```hex```编码数据，"base64"表示```base64```编码数据，"string"表示字符串数据。
- `outputFormat` (string, required): 用于指定输出的数据格式。```outputFormat```参数支持设置为"raw"、"hex"、"base64"、"string"其中之一。"raw"表示原始数据，"hex"表示```hex```编码数据，"base64"表示```base64```编码数据，"string"表示字符串数据。
- `data` (string, required): 参数```data```为所要处理的数据。
- `keyFormat` (string, optional): 用于指定```key```参数的数据格式。```keyFormat```参数支持设置为"raw"、"hex"、"base64"、"string"其中之一。"raw"表示原始数据，"hex"表示```hex```编码数据，"base64"表示```base64```编码数据，"string"表示字符串数据。
- `key` (string, optional): 参数```key```为```HMAC```加密时使用的密钥。

当参数```algo```设置为"sign"或"signTx"时，需要传入参数```key```。

当参数```algo```设置为"raw"时，不会使用```key```参数进行```HMAC```加密（因为HMAC加密必须指定算法）。

Returns (string): ```Encode```函数返回编码、加密之后的数据。

Encode 函数调用示例。

```javascript
function main() {
    Log(Encode("raw", "raw", "hex", "example", "raw", "123"))            // 6578616d706c65
    Log(Encode("raw", "raw", "hex", "example"))                          // 6578616d706c65
    Log(Encode("sha256", "raw", "hex", "example", "raw", "123"))         // 698d54f0494528a759f19c8e87a9f99e75a5881b9267ee3926bcf62c992d84ba
    Log(Encode("sha256", "raw", "hex", "example", "", "123"))            // 50d858e0985ecc7f60418aaf0cc5ab587f42c2570a884095a9e8ccacd0f6545c
    Log(Encode("sha256", "raw", "hex", "example", null, "123"))          // 50d858e0985ecc7f60418aaf0cc5ab587f42c2570a884095a9e8ccacd0f6545c
    Log(Encode("sha256", "raw", "hex", "example", "string", "123"))      // 698d54f0494528a759f19c8e87a9f99e75a5881b9267ee3926bcf62c992d84ba

    Log(Encode("raw", "raw", "hex", "123"))           // 313233
    Log(Encode("raw", "raw", "base64", "123"))        // MTIz

    Log(Encode("sha256", "raw", "hex", "example", "hex", "313233"))      // 698d54f0494528a759f19c8e87a9f99e75a5881b9267ee3926bcf62c992d84ba
    Log(Encode("sha256", "raw", "hex", "example", "base64", "MTIz"))     // 698d54f0494528a759f19c8e87a9f99e75a5881b9267ee3926bcf62c992d84ba
}
```

```python
def main():
    Log(Encode("raw", "raw", "hex", "example", "raw", "123"))            # 6578616d706c65
    Log(Encode("raw", "raw", "hex", "example", "", ""))                  # 6578616d706c65
    Log(Encode("sha256", "raw", "hex", "example", "raw", "123"))         # 698d54f0494528a759f19c8e87a9f99e75a5881b9267ee3926bcf62c992d84ba
    Log(Encode("sha256", "raw", "hex", "example", "", "123"))            # 50d858e0985ecc7f60418aaf0cc5ab587f42c2570a884095a9e8ccacd0f6545c

    Log(Encode("sha256", "raw", "hex", "example", "string", "123"))      # 698d54f0494528a759f19c8e87a9f99e75a5881b9267ee3926bcf62c992d84ba

    Log(Encode("raw", "raw", "hex", "123", "", ""))           # 313233
    Log(Encode("raw", "raw", "base64", "123", "", ""))        # MTIz

    Log(Encode("sha256", "raw", "hex", "example", "hex", "313233"))      # 698d54f0494528a759f19c8e87a9f99e75a5881b9267ee3926bcf62c992d84ba
    Log(Encode("sha256", "raw", "hex", "example", "base64", "MTIz"))     # 698d54f0494528a759f19c8e87a9f99e75a5881b9267ee3926bcf62c992d84ba
```

```rust
fn main() {
    // Rust 的 Encode() 函数 6 个参数均为必填；不加密时，keyFormat 和 key 传入空字符串即可
    Log!(Encode("raw", "raw", "hex", "example", "raw", "123"));            // 6578616d706c65
    Log!(Encode("raw", "raw", "hex", "example", "", ""));                  // 6578616d706c65
    Log!(Encode("sha256", "raw", "hex", "example", "raw", "123"));         // 698d54f0494528a759f19c8e87a9f99e75a5881b9267ee3926bcf62c992d84ba
    Log!(Encode("sha256", "raw", "hex", "example", "", "123"));            // 50d858e0985ecc7f60418aaf0cc5ab587f42c2570a884095a9e8ccacd0f6545c

    Log!(Encode("sha256", "raw", "hex", "example", "string", "123"));      // 698d54f0494528a759f19c8e87a9f99e75a5881b9267ee3926bcf62c992d84ba

    Log!(Encode("raw", "raw", "hex", "123", "", ""));           // 313233
    Log!(Encode("raw", "raw", "base64", "123", "", ""));        // MTIz

    Log!(Encode("sha256", "raw", "hex", "example", "hex", "313233"));      // 698d54f0494528a759f19c8e87a9f99e75a5881b9267ee3926bcf62c992d84ba
    Log!(Encode("sha256", "raw", "hex", "example", "base64", "MTIz"));     // 698d54f0494528a759f19c8e87a9f99e75a5881b9267ee3926bcf62c992d84ba
}
```

参数```algo```还支持以下取值："text.encoder.utf8"、"text.decoder.utf8"、"text.encoder.gbk"、"text.decoder.gbk"，用于对字符串进行编码和解码。

```javascript
function main(){
    var ret1 = Encode("text.encoder.utf8", "raw", "hex", "你好")     // e4bda0e5a5bd
    Log(ret1)
    var ret2 = Encode("text.decoder.utf8", "hex", "string", ret1)
    Log(ret2)

    var ret3 = Encode("text.encoder.gbk", "raw", "hex", "你好")      // c4e3bac3
    Log(ret3)
    var ret4 = Encode("text.decoder.gbk", "hex", "string", ret3)
    Log(ret4)
}
```

```python
def main():
    ret1 = Encode("text.encoder.utf8", "raw", "hex", "你好", "", "")     # e4bda0e5a5bd
    Log(ret1)
    ret2 = Encode("text.decoder.utf8", "hex", "string", ret1, "", "")
    Log(ret2)

    ret3 = Encode("text.encoder.gbk", "raw", "hex", "你好", "", "")      # c4e3bac3
    Log(ret3)
    ret4 = Encode("text.decoder.gbk", "hex", "string", ret3, "", "")
    Log(ret4)
```

```rust
fn main() {
    // Rust 的 Encode() 函数6个参数均为必填，不加密时 keyFormat、key 传入空字符串
    let ret1 = Encode("text.encoder.utf8", "raw", "hex", "你好", "", "");     // e4bda0e5a5bd
    Log!(ret1);
    let ret2 = Encode("text.decoder.utf8", "hex", "string", &ret1, "", "");
    Log!(ret2);

    let ret3 = Encode("text.encoder.gbk", "raw", "hex", "你好", "", "");      // c4e3bac3
    Log!(ret3);
    let ret4 = Encode("text.decoder.gbk", "hex", "string", &ret3, "", "");
    Log!(ret4);
}
```

```Encode()```函数仅支持实盘。若不传入```key```、```keyFormat```参数，则不进行```key```加密。

#### MD5

```
MD5(data)
```

计算参数```data```的 MD5 哈希值。

Parameters:

- `data` (string, required): 需要进行 MD5 计算的数据。

Returns (string): MD5 哈希值。

```javascript
function main() {
    Log("MD5", MD5("hello world"))
}
```

```python
def main():
    Log("MD5", MD5("hello world"))
```

```rust
fn main() {
    Log!("MD5", MD5("hello world"));
}
```

调用```MD5("hello world")```函数后，返回值为：```5eb63bbbe01eeed093cb22bb8f5acdc3```。

See also: `Encode`

#### UUID

```
UUID()
```

创建一个 UUID。

Returns (string): 32 位的 UUID。

```javascript
function main() {
    var uuid1 = UUID()
    var uuid2 = UUID()
    Log(uuid1, uuid2)
}
```

```python
def main():
    uuid1 = UUID()
    uuid2 = UUID()
    Log(uuid1, uuid2)
```

```rust
fn main() {
    let uuid1 = UUID();
    let uuid2 = UUID();
    Log!(uuid1, uuid2);
}
```

```UUID()``` 函数仅支持实盘。

### Log

#### Log

```
Log(...msgs)
```

```Log()```函数用于输出日志。

Parameters:

- `msg` (string / number / bool / object / array / any (平台支持的任意类型), optional): 参数```msg```为需要输出的内容，可传入多个```msg```参数。

可以传入多个```msg```参数：

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

支持设置输出消息的颜色。若需同时设置颜色和推送，需先设置颜色，最后再使用```@```字符设置推送。

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

```Log()```函数支持打印```base64```编码后的图片，内容以``` ` ```开头，以``` ` ```结尾，例如：

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

```Log()```函数支持直接打印```Python```的```matplotlib.pyplot```对象，只要该对象包含```savefig```方法，即可直接使用```Log```函数打印，例如：

```python
import matplotlib.pyplot as plt
def main():
    plt.plot([3,6,2,4,7,1])
    Log(plt)
```

```Log()```函数支持语言切换，其输出的文本会根据平台页面的语言设置自动切换为对应的语言，例如：

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

```Log()```函数会在实盘或回测系统的日志区域输出一条日志信息，实盘运行时日志将保存在实盘的数据库中。若```Log()```函数输出的内容以```@```字符结尾，该条日志会进入消息推送队列，并推送至当前发明者量化交易平台账号在[推送设置](https://www.fmz.com/m/account)中配置的邮箱、WebHook地址等。[调试工具](https://www.fmz.com/m/debug)和回测系统不支持消息推送。消息推送存在频率限制，具体规则如下：在实盘的每个20秒周期内，仅保留并推送最后一条推送消息，其余消息将被过滤而不推送（通过 Log 函数输出的推送日志仍会正常打印显示在日志区域）。

若```Log()```函数输出的内容以```&```字符结尾，该条日志将被标记为私密日志。当实盘公开展示时，该条日志对其他用户隐藏，但在实盘拥有者账户视角下仍然可见。此功能可用于记录API密钥、账户余额等敏感信息。例如：```Log("私密信息", "&")```。

关于```WebHook```推送，可以使用```Golang```编写的服务程序：
```golang
package main

import (
    "fmt"
    "net/http"
)

func Handle (w http.ResponseWriter, r *http.Request) {
    defer func() {
        fmt.Println("req:", *r)
    }()
}

func main () {
    fmt.Println("listen http://localhost:9090")
    http.HandleFunc("/data", Handle)
    http.ListenAndServe(":9090", nil)
}
```

在[推送设置](https://www.fmz.com/m/account)中设置```WebHook```：```http://XXX.XX.XXX.XX:9090/data?data=Hello_FMZ```，运行编写好的```Golang```服务程序后，即可开始运行实盘策略。以下为使用```JavaScript```语言编写的策略，策略运行时会执行```Log()```函数并推送消息：
```js
function main() {
    Log("msg", "@")
}
```

```Golang```语言编写的服务程序接收到推送后，打印如下信息：
```log
listen http://localhost:9090

req: {GET /data?data=Hello_FMZ HTTP/1.1 1 1
map[User-Agent:[Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3)
AppleWebKit/537.36 (KHTML, like Gecko) Chrome/xx.x.xxxx.xxx
Safari/537.36] Accept-Encoding:[gzip]] {} <nil> 0 [] false
1XX.XX.X.XX:9090 map[] map[] <nil> map[] XXX.XX.XXX.XX:4xxx2
/data?data=Hello_FMZ <nil> <nil> <nil> 0xc420056300
```

See also: `LogReset`, `LogVacuum`

#### LogStatus

```
LogStatus(...msgs)
```

在回测系统或实盘页面的状态栏中输出信息。

Parameters:

- `msg` (string / number / bool / object / array / any (平台支持的任意类型), optional): 参数```msg```为要输出的内容，可传入多个```msg```参数。

支持设置输出内容的颜色：

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

状态栏中的数据输出示例：

```javascript
function main() {
    var table = {type: 'table', title: 'Position Info', cols: ['Column 1', 'Column 2'], rows: [ ['abc', 'def'], ['ABC', 'support color #ff0000']]}
    // JSON 序列化后，在字符串两端添加 ` 字符，即可将其识别为复杂消息格式（当前支持表格）
    LogStatus('`' + JSON.stringify(table) + '`')
    // 表格信息也可以显示在多行文本中
    LogStatus('First line message\n`' + JSON.stringify(table) + '`\nThird line message')
    // 支持同时显示多个表格，将以标签页（TAB）形式归为一组显示
    LogStatus('`' + JSON.stringify([table, table]) + '`')

    // 也可以在表格中构造按钮，策略通过 GetCommand 接收 cmd 属性的内容
    var table = {
        type: 'table',
        title: 'Position Operation',
        cols: ['Column 1', 'Column 2', 'Action'],
        rows: [
            ['abc', 'def', {'type':'button', 'cmd': 'coverAll', 'name': 'Close All'}]
        ]
    }
    LogStatus('`' + JSON.stringify(table) + '`')
    // 或者构造一个单独的按钮
    LogStatus('`' + JSON.stringify({'type':'button', 'cmd': 'coverAll', 'name': 'Close All'}) + '`')
    // 可以自定义按钮样式（bootstrap 的按钮属性）
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
    // 在 JSON 字符串两端添加 ` 字符，即可将其识别为复杂消息格式（当前支持表格）
    LogStatus!(format!("`{}`", table));
    // 表格信息也可以显示在多行文本中
    LogStatus!(format!("First line message\n`{}`\nThird line message", table));
    // 支持同时显示多个表格，将以标签页（TAB）形式归为一组显示
    LogStatus!(format!("`[{},{}]`", table, table));

    // 也可以在表格中构造按钮，策略通过 GetCommand 接收 cmd 属性的内容
    let table = String::from(r#"{"type": "table", "title": "Position Operation", "cols": ["Column 1", "Column 2", "Action"], "rows": ["#)
        + r#"["abc", "def", {"type": "button", "cmd": "coverAll", "name": "Close All"}]"#
        + r#"]}"#;
    LogStatus!(format!("`{}`", table));
    // 或者构造一个单独的按钮
    LogStatus!(format!("`{}`", r#"{"type": "button", "cmd": "coverAll", "name": "Close All"}"#));
    // 可以自定义按钮样式（bootstrap 的按钮属性）
    LogStatus!(format!("`{}`", r#"{"type": "button", "class": "btn btn-xs btn-danger", "cmd": "coverAll", "name": "Close All"}"#));
}
```

支持在状态栏中设计按钮控件（旧版按钮结构）：

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

设置状态栏按钮的禁用与描述功能（旧版按钮结构）：

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

结合 ```GetCommand()``` 函数，构建状态栏按钮的交互功能（旧版按钮结构）：

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

        if let Some(str_cmd) = GetCommand(0) {
            Log!("Received interaction data str_cmd:", "Type:", "String", "Value:", &str_cmd);
            if str_cmd == "test1" {
                test1();
            }
        }

        Sleep(500);
    }
}
```

在构造状态栏按钮进行交互时，同样支持输入数据，交互指令最终由```GetCommand()```函数捕获。

在状态栏按钮控件的数据结构中增加```input```项（旧版按钮结构），例如为```{"type": "button", "cmd": "open", "name": "Open"}```添加```"input": {"name": "Quantity", "type": "number", "defValue": 1}```，即可使按钮在被点击时弹出一个带输入框控件的弹窗（输入框中的默认值为1，即```defValue```所设置的数据），从而可以输入一个数据并与按钮命令一起发送。例如运行以下测试代码时，点击「开仓」按钮后会弹出一个带输入框的弹窗，在输入框中输入111并点击「确定」，```GetCommand()```函数便会捕获消息：```open:111```。

```javascript
function main() {
    var tbl = {
        type: "table",
        title: "Operation",
        cols: ["Column 1", "Column 2"],
        rows: [
            ["Open Position", {"type": "button", "cmd": "open", "name": "Open", "input": {"name": "Quantity", "type": "number", "defValue": 1}}],
            ["Close Position", {"type": "button", "cmd": "coverAll", "name": "Close All"}]
        ]
    }

    LogStatus(_D(), "\n", "`" + JSON.stringify(tbl) + "`")
    while (true) {
        var cmd = GetCommand()
        if (cmd) {
            Log("cmd:", cmd)
        }
        Sleep(1000)
    }
}
```

```python
import json

def main():
    tbl = {
        "type": "table",
        "title": "Operation",
        "cols": ["Column 1", "Column 2"],
        "rows": [
            ["Open Position", {"type": "button", "cmd": "open", "name": "Open", "input": {"name": "Quantity", "type": "number", "defValue": 1}}],
            ["Close Position", {"type": "button", "cmd": "coverAll", "name": "Close All"}]
        ]
    }

    LogStatus(_D(), "\n", "`" + json.dumps(tbl) + "`")
    while True:
        cmd = GetCommand()
        if cmd:
            Log("cmd:", cmd)
        Sleep(1000)
```

```rust
fn main() {
    let tbl = String::from(r#"{"type": "table", "title": "Operation", "cols": ["Column 1", "Column 2"], "rows": ["#)
        + r#"["Open Position", {"type": "button", "cmd": "open", "name": "Open", "input": {"name": "Quantity", "type": "number", "defValue": 1}}],"#
        + r#"["Close Position", {"type": "button", "cmd": "coverAll", "name": "Close All"}]"#
        + r#"]}"#;

    LogStatus!(_D(None), "\n", format!("`{}`", tbl));
    loop {
        if let Some(cmd) = GetCommand(0) {
            Log!("cmd:", cmd);
        }
        Sleep(1000);
    }
}
```

支持分组按钮控件（旧版按钮结构），其功能与**支持输入数据的状态栏按钮**（通过"input"字段设置）一致，交互指令最终均由```GetCommand()```函数捕获。区别在于分组按钮通过```"group"```字段设置：当点击按钮触发交互时，页面弹出的对话框中会显示预先设置好的**一组**输入控件，可一次性输入一组数据。
关于状态栏按钮控件和分组按钮控件结构中的```"group"```字段，需要注意以下几点：
- group中```type```属性仅支持以下4种类型，```defValue```属性用于设置默认值。
  "selected"：下拉框控件，设置下拉框中的各个选项时使用```|```符号分隔。
  "number"：数值输入框控件。
  "string"：字符串输入框控件。
  "boolean"：勾选框控件，勾选表示（布尔值）真，不勾选表示（布尔值）假。
- 交互输入时的控件支持依赖设置：
  例如以下例子中的```"name": "tradePrice@orderType==1"```设置，使**交易价格**（```tradePrice```）输入控件仅在**下单方式**（orderType）下拉框控件选择为**挂单**时可用。
- 交互输入时的控件名称支持双语设置。
  例如以下例子中的"description": "下单方式|order type"设置，使用```|```符号分隔中英文描述内容。
- group中的```name```、```description```与按钮结构中的```name```、```description```虽然字段名一致，但定义并不相同。
  group中的```name```与input中的```name```定义也不相同。
- 分组按钮控件触发后，发送的交互内容格式为：按钮的cmd字段值加group字段相关数据。例如以下例子测试时```Log("cmd:", cmd)```语句输出的内容为：
  ```cmd: open:{"orderType":1,"tradePrice":99,"orderAmount":"99","boolean":true}```，即发生交互操作时```GetCommand()```函数返回的内容：```open:{"orderType":1,"tradePrice":99,"orderAmount":"99","boolean":true}```。
- 按钮控件的```type```属性仅支持```"button"```：
  支持输入数据的按钮控件，即设置了```input```属性的控件，其```input```字段配置信息中的```type```属性支持多种控件类型。

参考以下例子：

```javascript
function main() {
    var tbl = {
        type: "table",
        title: "Group Button Control Demo",
        cols: ["Operation"],
        rows: []
    }

    // 创建分组按钮控件结构
    var groupBtn = {
        type: "button",
        cmd: "open",
        name: "Open",
        group: [
            {"name": "orderType", "description": "下单方式|order type", "type": "selected", "defValue": "市价单|挂单"},
            {"name": "tradePrice@orderType==1", "description": "交易价格|trade price", "type": "number", "defValue": 100},
            {"name": "orderAmount", "description": "委托数量|order amount", "type": "string", "defValue": 100},
            {"name": "boolean", "description": "是/否|boolean", "type": "boolean", "defValue": true}
        ]
    }

    // 测试按钮1
    var testBtn1 = {"type": "button", "name": "Button 1", "cmd": "button1", "description": "This is the first button"}
    var testBtn2 = {"type": "button", "name": "Button 2", "cmd": "button2", "description": "This is the second button", "input": {"name": "Quantity", "type": "number", "defValue": 1}}

    // 在tbl中添加groupBtn
    tbl.rows.push([groupBtn])
    // 支持状态栏表格的一个单元格内设置多个按钮，即一个单元格内的数据为一个按钮结构数组：[testBtn1, testBtn2]
    tbl.rows.push([[testBtn1, testBtn2]])

    while (true) {
        LogStatus("`" + JSON.stringify(tbl) + "`", "\n", "Group button controls can be set directly on the status bar in addition to status bar tables:", "`" + JSON.stringify(groupBtn) + "`")
        var cmd = GetCommand()
        if (cmd) {
            Log("cmd:", cmd)
        }
        Sleep(5000)
    }
}
```

```python
import json

def main():
    tbl = {
        "type": "table",
        "title": "Group Button Control Demo",
        "cols": ["Operation"],
        "rows": []
    }

    groupBtn = {
        "type": "button",
        "cmd": "open",
        "name": "Open",
        "group": [
            {"name": "orderType", "description": "下单方式|order type", "type": "selected", "defValue": "市价单|挂单"},
            {"name": "tradePrice@orderType==1", "description": "交易价格|trade price", "type": "number", "defValue": 100},
            {"name": "orderAmount", "description": "委托数量|order amount", "type": "string", "defValue": 100},
            {"name": "boolean", "description": "是/否|boolean", "type": "boolean", "defValue": True}
        ]
    }

    testBtn1 = {"type": "button", "name": "Button 1", "cmd": "button1", "description": "This is the first button"}
    testBtn2 = {"type": "button", "name": "Button 2", "cmd": "button2", "description": "This is the second button", "input": {"name": "Quantity", "type": "number", "defValue": 1}}

    tbl["rows"].append([groupBtn])
    tbl["rows"].append([[testBtn1, testBtn2]])

    while True:
        LogStatus("`" + json.dumps(tbl) + "`", "\n", "Group button controls can be set directly on the status bar in addition to status bar tables:", "`" + json.dumps(groupBtn) + "`")
        cmd = GetCommand()
        if cmd:
            Log("cmd:", cmd)
        Sleep(5000)
```

```rust
fn main() {
    // 创建分组按钮控件结构
    let group_btn = String::from(r#"{"type": "button", "cmd": "open", "name": "Open", "group": ["#)
        + r#"{"name": "orderType", "description": "下单方式|order type", "type": "selected", "defValue": "市价单|挂单"},"#
        + r#"{"name": "tradePrice@orderType==1", "description": "交易价格|trade price", "type": "number", "defValue": 100},"#
        + r#"{"name": "orderAmount", "description": "委托数量|order amount", "type": "string", "defValue": 100},"#
        + r#"{"name": "boolean", "description": "是/否|boolean", "type": "boolean", "defValue": true}"#
        + r#"]}"#;

    // 测试按钮1、测试按钮2
    let test_btn1 = r#"{"type": "button", "name": "Button 1", "cmd": "button1", "description": "This is the first button"}"#;
    let test_btn2 = r#"{"type": "button", "name": "Button 2", "cmd": "button2", "description": "This is the second button", "input": {"name": "Quantity", "type": "number", "defValue": 1}}"#;

    // 在tbl中添加groupBtn；支持状态栏表格的一个单元格内设置多个按钮，即一个单元格内的数据为一个按钮结构数组：[testBtn1, testBtn2]
    let tbl = format!(
        r#"{{"type": "table", "title": "Group Button Control Demo", "cols": ["Operation"], "rows": [[{}], [[{}, {}]]]}}"#,
        group_btn, test_btn1, test_btn2
    );

    loop {
        LogStatus!(format!("`{}`", tbl), "\n", "Group button controls can be set directly on the status bar in addition to status bar tables:", format!("`{}`", group_btn));
        if let Some(cmd) = GetCommand(0) {
            Log!("cmd:", cmd);
        }
        Sleep(5000);
    }
}
```

当状态栏分组按钮控件（通过设置```group```字段实现）与状态栏按钮控件（通过设置```input```字段实现）被点击触发交互时（旧版按钮结构），页面弹出的对话框中的下拉框控件同样支持多选。以下示例演示如何设计包含多选选项的下拉框控件：

```javascript
function main() {
    // 状态栏按钮控件（通过设置input字段实现）testBtn1按钮所触发的页面中，下拉框控件使用options字段设置选项，并使用defValue字段设置默认选项。区别于本章其它示例中直接使用defValue设置选项的方式。
    var testBtn1 = {
        type: "button",
        name: "testBtn1",
        cmd: "cmdTestBtn1",
        input: {name: "testBtn1ComboBox", type: "selected", options: ["A", "B"], defValue: 1}
    }

    /*
      状态栏按钮控件（通过设置input字段实现）testBtn2按钮所触发的页面中，下拉框控件使用options字段设置选项。options字段中的选项不仅支持字符串，
      也支持使用```{text: "描述", value: "值"}```结构。使用defValue字段设置默认选项，默认选项支持多选（通过数组结构实现）。多选时需额外设置multiple字段为真值（true）。
    */
    var testBtn2 = {
        type: "button",
        name: "testBtn2",
        cmd: "cmdTestBtn2",
        input: {
            name: "testBtn2MultiComboBox",
            type: "selected",
            description: "Implement multi-select dropdown",
            options: [{text: "Option A", value: "A"}, {text: "Option B", value: "B"}, {text: "Option C", value: "C"}],
            defValue: ["A", "C"],
            multiple: true
        }
    }

    // 状态栏分组按钮控件（通过设置group字段实现）testBtn3按钮所触发的页面中，下拉框控件使用options字段设置选项，也支持直接使用defValue设置选项。
    var testBtn3 = {
        type: "button",
        name: "testBtn3",
        cmd: "cmdTestBtn3",
        group: [
            {name: "comboBox1", label: "labelComboBox1", description: "Dropdown 1", type: "selected", defValue: 1, options: ["A", "B"]},
            {name: "comboBox2", label: "labelComboBox2", description: "下拉框2", type: "selected", defValue: "A|B"},
            {name: "comboBox3", label: "labelComboBox3", description: "Dropdown 3", type: "selected", defValue: [0, 2], multiple: true, options: ["A", "B", "C"]},
            {
                name: "comboBox4",
                label: "labelComboBox4",
                description: "Dropdown 4",
                type: "selected",
                defValue: ["A", "C"],
                multiple: true,
                options: [{text: "Option A", value: "A"}, {text: "Option B", value: "B"}, {text: "Option C", value: "C"}, {text: "Option D", value: "D"}]
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

```python
import json

def main():
    testBtn1 = {
        "type": "button",
        "name": "testBtn1",
        "cmd": "cmdTestBtn1",
        "input": {"name": "testBtn1ComboBox", "type": "selected", "options": ["A", "B"], "defValue": 1}
    }

    testBtn2 = {
        "type": "button",
        "name": "testBtn2",
        "cmd": "cmdTestBtn2",
        "input": {
            "name": "testBtn2MultiComboBox",
            "type": "selected",
            "description": "Implement multi-select dropdown",
            "options": [{"text": "Option A", "value": "A"}, {"text": "Option B", "value": "B"}, {"text": "Option C", "value": "C"}],
            "defValue": ["A", "C"],
            "multiple": True
        }
    }

    testBtn3 = {
        "type": "button",
        "name": "testBtn3",
        "cmd": "cmdTestBtn3",
        "group": [
            {"name": "comboBox1", "label": "labelComboBox1", "description": "Dropdown 1", "type": "selected", "defValue": 1, "options": ["A", "B"]},
            {"name": "comboBox2", "label": "labelComboBox2", "description": "Dropdown 2", "type": "selected", "defValue": "A|B"},
            {"name": "comboBox3", "label": "labelComboBox3", "description": "Dropdown 3", "type": "selected", "defValue": [0, 2], "multiple": True, "options": ["A", "B", "C"]},
            {
                "name": "comboBox4",
                "label": "labelComboBox4",
                "description": "Dropdown 4",
                "type": "selected",
                "defValue": ["A", "C"],
                "multiple": True,
                "options": [{"text": "Option A", "value": "A"}, {"text": "Option B", "value": "B"}, {"text": "Option C", "value": "C"}, {"text": "Option D", "value": "D"}]
            }
        ]
    }

    while True:
        LogStatus("`" + json.dumps(testBtn1) + "`\n", "`" + json.dumps(testBtn2) + "`\n", "`" + json.dumps(testBtn3) + "`\n")
        cmd = GetCommand()
        if cmd:
            Log(cmd)
        Sleep(5000)
```

```rust
fn main() {
    // 状态栏按钮控件（通过设置input字段实现）testBtn1按钮所触发的页面中，下拉框控件使用options字段设置选项，并使用defValue字段设置默认选项。区别于本章其它示例中直接使用defValue设置选项的方式。
    let test_btn1 = r#"{"type": "button", "name": "testBtn1", "cmd": "cmdTestBtn1", "input": {"name": "testBtn1ComboBox", "type": "selected", "options": ["A", "B"], "defValue": 1}}"#;

    /*
      状态栏按钮控件（通过设置input字段实现）testBtn2按钮所触发的页面中，下拉框控件使用options字段设置选项。options字段中的选项不仅支持字符串，
      也支持使用{"text": "描述", "value": "值"}结构。使用defValue字段设置默认选项，默认选项支持多选（通过数组结构实现）。多选时需额外设置multiple字段为真值（true）。
    */
    let test_btn2 = String::from(r#"{"type": "button", "name": "testBtn2", "cmd": "cmdTestBtn2", "input": {"#)
        + r#""name": "testBtn2MultiComboBox", "type": "selected", "description": "Implement multi-select dropdown","#
        + r#""options": [{"text": "Option A", "value": "A"}, {"text": "Option B", "value": "B"}, {"text": "Option C", "value": "C"}],"#
        + r#""defValue": ["A", "C"], "multiple": true}}"#;

    // 状态栏分组按钮控件（通过设置group字段实现）testBtn3按钮所触发的页面中，下拉框控件使用options字段设置选项，也支持直接使用defValue设置选项。
    let test_btn3 = String::from(r#"{"type": "button", "name": "testBtn3", "cmd": "cmdTestBtn3", "group": ["#)
        + r#"{"name": "comboBox1", "label": "labelComboBox1", "description": "Dropdown 1", "type": "selected", "defValue": 1, "options": ["A", "B"]},"#
        + r#"{"name": "comboBox2", "label": "labelComboBox2", "description": "下拉框2", "type": "selected", "defValue": "A|B"},"#
        + r#"{"name": "comboBox3", "label": "labelComboBox3", "description": "Dropdown 3", "type": "selected", "defValue": [0, 2], "multiple": true, "options": ["A", "B", "C"]},"#
        + r#"{"name": "comboBox4", "label": "labelComboBox4", "description": "Dropdown 4", "type": "selected", "defValue": ["A", "C"], "multiple": true, "options": [{"text": "Option A", "value": "A"}, {"text": "Option B", "value": "B"}, {"text": "Option C", "value": "C"}, {"text": "Option D", "value": "D"}]}"#
        + r#"]}"#;

    loop {
        LogStatus!(format!("`{}`\n", test_btn1), format!("`{}`\n", test_btn2), format!("`{}`\n", test_btn3));
        if let Some(cmd) = GetCommand(0) {
            Log!(cmd);
        }
        Sleep(5000);
    }
}
```

基于当前最新的按钮结构，构造状态栏表格中的按钮；点击按钮触发交互时，弹出一个包含多个控件的弹窗。

详细内容可参考：[用户指南-状态栏中的交互控件](/user-guide/编写策略/交互控件/状态栏中的交互控件)。

```javascript
var symbols = ["BTC_USDT.swap", "ETH_USDT.swap", "LTC_USDT.swap", "BNB_USDT.swap", "SOL_USDT.swap"]

function createBtn(tmp, group) {
    var btn = JSON.parse(JSON.stringify(tmp))

    _.each(group, function(eleByGroup) {
        btn["group"].unshift(eleByGroup)
    })

    return btn
}

function main() {
    var arrManager = []

    _.each(symbols, function(symbol) {
        arrManager.push({
            "symbol": symbol,
        })
    })

    // Btn
    var tmpBtnOpen = {
        "type": "button",
        "cmd": "open",
        "name": "Open Position",
        "group": [{
            "type": "selected",
            "name": "tradeType",
            "label": "Order Type",
            "description": "Market order, Limit order",
            "default": 0,
            "group": "Trade Settings",
            "settings": {
                "options": ["Market Order", "Limit Order"],
                "required": true,
            }
        }, {
            "type": "selected",
            "name": "direction",
            "label": "Trade Direction",
            "description": "Buy, Sell",
            "default": "buy",
            "group": "Trade Settings",
            "settings": {
                "render": "segment",
                "required": true,
                "options": [{"name": "Buy", "value": "buy"}, {"name": "Sell", "value": "sell"}],
            }
        }, {
            "type": "number",
            "name": "price",
            "label": "Price",
            "description": "Order price",
            "group": "Trade Settings",
            "filter": "tradeType==1",
            "settings": {
                "required": true,
            }
        }, {
            "type": "number",
            "name": "amount",
            "label": "Order Amount",
            "description": "Order amount",
            "group": "Trade Settings",
            "settings": {
                "required": true,
            }
        }],
    }

    while (true) {
        var tbl = {"type": "table", "title": "dashboard", "cols": ["symbol", "actionOpen"], "rows": []}

        _.each(arrManager, function(m) {
            var btnOpen = createBtn(tmpBtnOpen, [{"type": "string", "name": "symbol", "label": "Symbol", "default": m["symbol"], "settings": {"required": true}}])
            tbl["rows"].push([m["symbol"], btnOpen])
        })

        var cmd = GetCommand()
        if (cmd) {
            Log("Received interaction:", cmd)

            // 解析交互消息: open:{"symbol":"LTC_USDT.swap","tradeType":0,"direction":"buy","amount":111}
            // 根据第一个冒号:之前的指令判断是哪种按钮模板触发的消息
            var arrCmd = cmd.split(":", 2)
            if (arrCmd[0] == "open") {
                var msg = JSON.parse(cmd.slice(5))
                Log("Symbol:", msg["symbol"], ", Direction:", msg["direction"], ", Order type:", msg["tradeType"] == 0 ? "Market order" : "Limit order", msg["tradeType"] == 0 ? ", Price: Current market price" : ", Price:" + msg["price"], ", Amount:", msg["amount"])
            }
        }

        LogStatus(_D(), "\n", "`" + JSON.stringify(tbl) + "`")
        Sleep(1000)
    }
}
```

```python
import json

symbols = ["BTC_USDT.swap", "ETH_USDT.swap", "LTC_USDT.swap", "BNB_USDT.swap", "SOL_USDT.swap"]

def createBtn(tmp, group):
    btn = json.loads(json.dumps(tmp))
    for eleByGroup in group:
        btn["group"].insert(0, eleByGroup)
    return btn

def main():
    arrManager = []

    for symbol in symbols:
        arrManager.append({"symbol": symbol})

    # Btn
    tmpBtnOpen = {
        "type": "button",
        "cmd": "open",
        "name": "Open Position",
        "group": [{
            "type": "selected",
            "name": "tradeType",
            "label": "Order Type",
            "description": "Market order, Limit order",
            "default": 0,
            "group": "Trade Settings",
            "settings": {
                "options": ["Market Order", "Limit Order"],
                "required": True,
            }
        }, {
            "type": "selected",
            "name": "direction",
            "label": "Trade Direction",
            "description": "Buy, Sell",
            "default": "buy",
            "group": "Trade Settings",
            "settings": {
                "render": "segment",
                "required": True,
                "options": [{"name": "Buy", "value": "buy"}, {"name": "Sell", "value": "sell"}],
            }
        }, {
            "type": "number",
            "name": "price",
            "label": "Price",
            "description": "Order price",
            "group": "Trade Settings",
            "filter": "tradeType==1",
            "settings": {
                "required": True,
            }
        }, {
            "type": "number",
            "name": "amount",
            "label": "Order Amount",
            "description": "Order amount",
            "group": "Trade Settings",
            "settings": {
                "required": True,
            }
        }],
    }

    while True:
        tbl = {"type": "table", "title": "dashboard", "cols": ["symbol", "actionOpen"], "rows": []}
        for m in arrManager:
            btnOpen = createBtn(tmpBtnOpen, [{"type": "string", "name": "symbol", "label": "Symbol", "default": m["symbol"], "settings": {"required": True}}])
            tbl["rows"].append([m["symbol"], btnOpen])

        cmd = GetCommand()

        if cmd != "" and cmd != None:
            Log("Received interaction:", cmd)

            # 解析交互消息: open:{"symbol":"LTC_USDT.swap","tradeType":0,"direction":"buy","amount":111}
            # 根据第一个冒号:之前的指令判断是哪种按钮模板触发的消息
            arrCmd = cmd.split(":")
            if arrCmd[0] == "open":
                msg = json.loads(cmd[5:])
                Log("Symbol:", msg["symbol"], ", Direction:", msg["direction"], ", Order type:", "Market order" if msg["tradeType"] == 0 else "Limit order", ", Price: Current market price" if msg["tradeType"] == 0 else ", Price:" + str(msg["price"]), ", Amount:", msg["amount"])

        # 输出状态栏信息
        LogStatus(_D(), "\n", "`" + json.dumps(tbl) + "`")
        Sleep(1000)
```

```rust
fn main() {
    let symbols = ["BTC_USDT.swap", "ETH_USDT.swap", "LTC_USDT.swap", "BNB_USDT.swap", "SOL_USDT.swap"];

    // Btn：按钮模板，"group"的第一个元素为交易品种控件，__SYMBOL__为占位符，构造按钮时替换
    let tmp_btn_open = String::from(r#"{"type": "button", "cmd": "open", "name": "Open Position", "group": ["#)
        + r#"{"type": "string", "name": "symbol", "label": "Symbol", "default": "__SYMBOL__", "settings": {"required": true}},"#
        + r#"{"type": "selected", "name": "tradeType", "label": "Order Type", "description": "Market order, Limit order", "default": 0, "group": "Trade Settings", "settings": {"options": ["Market Order", "Limit Order"], "required": true}},"#
        + r#"{"type": "selected", "name": "direction", "label": "Trade Direction", "description": "Buy, Sell", "default": "buy", "group": "Trade Settings", "settings": {"render": "segment", "required": true, "options": [{"name": "Buy", "value": "buy"}, {"name": "Sell", "value": "sell"}]}},"#
        + r#"{"type": "number", "name": "price", "label": "Price", "description": "Order price", "group": "Trade Settings", "filter": "tradeType==1", "settings": {"required": true}},"#
        + r#"{"type": "number", "name": "amount", "label": "Order Amount", "description": "Order amount", "group": "Trade Settings", "settings": {"required": true}}"#
        + r#"]}"#;

    loop {
        let mut rows: Vec<String> = Vec::new();
        for symbol in &symbols {
            let btn_open = tmp_btn_open.replace("__SYMBOL__", symbol);
            rows.push(format!(r#"["{}", {}]"#, symbol, btn_open));
        }
        let tbl = format!(r#"{{"type": "table", "title": "dashboard", "cols": ["symbol", "actionOpen"], "rows": [{}]}}"#, rows.join(","));

        if let Some(cmd) = GetCommand(0) {
            Log!("Received interaction:", &cmd);

            // 解析交互消息: open:{"symbol":"LTC_USDT.swap","tradeType":0,"direction":"buy","amount":111}
            // 根据第一个冒号:之前的指令判断是哪种按钮模板触发的消息
            if cmd.starts_with("open:") {
                let msg = JSONParse(&cmd[5..]).unwrap();
                let trade_type = msg["tradeType"].as_i64().unwrap_or(0);
                Log!("Symbol:", msg["symbol"].as_str().unwrap_or(""),
                    ", Direction:", msg["direction"].as_str().unwrap_or(""),
                    ", Order type:", if trade_type == 0 { "Market order" } else { "Limit order" },
                    if trade_type == 0 { ", Price: Current market price".to_string() } else { format!(", Price:{}", msg["price"].as_f64().unwrap_or(0.0)) },
                    ", Amount:", msg["amount"].as_f64().unwrap_or(0.0));
            }
        }

        LogStatus!(_D(None), "\n", format!("`{}`", tbl));
        Sleep(1000);
    }
}
```

横向合并```LogStatus()```函数绘制的表格中的单元格：

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
    // 添加一行数据，将第一个和第二个单元格合并，并在合并后的单元格内输出 ticker 变量
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
    // 添加一行数据，将第一个和第二个单元格合并，并在合并后的单元格内输出 ticker 数据
    // body 为字符串（对应 JS 的 JSON.stringify(ticker)），内部引号需转义后嵌入 JSON
    let row2 = format!(r#"[{{"body": "{}", "colspan": 2}}, "abc"]"#, json_ticker.replace('"', "\\\""));
    let table = table_tpl.replace("__ROW2__", &row2);
    LogStatus!(format!("`{}`", table));
}
```

纵向合并 ```LogStatus()``` 函数绘制的表格中的单元格：

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
    // A3 被上一行的第一个单元格合并
    table.rows.push(["B4", "C4"])
    // A2 被上一行的第一个单元格合并
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
    // 为便于测试，此处使用构造的数据以保持代码简短易读
    let json_ticker = r#"{"High": 0, "Low": 0, "Buy": 0, "Sell": 0, "Last": 0, "Time": 0, "Volume": 0}"#;
    let name = exchange.GetName();

    let mut rows: Vec<String> = Vec::new();
    rows.push(String::from(r#"["A1", "B1", {"type": "button", "cmd": "coverAll", "name": "C1"}]"#));
    // body 为字符串，其内部的引号需要转义后才能嵌入 JSON
    let body = format!("A2 + B2:{}", json_ticker).replace('"', "\\\"");
    rows.push(format!(r#"[{{"body": "{}", "colspan": 2}}, "C2"]"#, body));
    rows.push(format!(r#"[{{"body": "A3 + A4 + A5:{}", "rowspan": 3}}, "B3", "C3"]"#, name));
    // A3 被上一行的第一个单元格合并
    rows.push(String::from(r#"["B4", "C4"]"#));
    // A2 被上一行的第一个单元格合并
    rows.push(String::from(r#"["B5", "C5"]"#));
    rows.push(String::from(r#"["A6", "B6", "C6"]"#));

    let table = format!(r#"{{"type": "table", "title": "Table Demo", "cols": ["Column A", "Column B", "Column C"], "rows": [{}]}}"#, rows.join(","));
    LogStatus!(format!("`{}`", table));
}
```

状态栏中分页显示表格：

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

除了可以分页显示表格之外，还可以将多个表格自上而下排列显示：

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

支持设置状态栏表格的横向和纵向滚动模式。将```scroll```属性设置为```"auto"```后，当状态栏表格的纵向行数超过 20 行时，内容将自动滚动显示；当横向列数超出页面显示范围时，则进行横向滚动显示。使用```scroll```属性可以缓解实盘运行时因状态栏写入大量数据而导致的卡顿问题。

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

实盘运行时，```LogStatus()```函数输出的信息不会保存到实盘数据库，仅更新当前实盘的状态栏内容。

```LogStatus()```函数支持打印```base64```编码后的图片，图片字符串以``` ` ```开头，以``` ` ```结尾。例如： ```LogStatus("`data:image/png;base64,AAAA`")```。

```LogStatus()```函数支持直接传入```Python```的```matplotlib.pyplot```对象。只要对象包含```savefig```方法，即可作为参数传入```LogStatus()```函数，例如：

```python
import matplotlib.pyplot as plt

def main():
    plt.plot([3,6,2,4,7,1])
    LogStatus(plt)
```

策略实盘运行时，在实盘页面翻看历史记录时，状态栏会进入休眠状态，停止更新；只有当日志处于第一页时，状态栏数据才会刷新。状态栏支持输出```base64```编码后的图片，也支持在状态栏显示的表格中输出```base64```编码后的图片。由于编码后的图片字符串数据通常很长，因此此处不再展示示例代码。

See also: `GetCommand`

#### LogProfit

```
LogProfit(profit)
LogProfit(profit, ...args)
```

记录并打印盈亏数值，并根据盈亏数值绘制收益曲线。

Parameters:

- `profit` (number, required): 参数```profit```为收益数据，该数据由策略中设计的算法计算得出。
- `arg` (string / number / bool / object / array / any (平台支持的任意类型), optional): 扩展参数，用于向该条收益日志中输出附带信息，```arg```参数可传入多个。

调用```LogProfit```函数时，如果最后一个参数为字符```&```，则不会将日志写入数据库，仅更新收益图表。使用```&```参数可以避免频繁的收益记录产生大量日志，从而保持日志整洁。例如：

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
    // Rust 中 LogProfit 只接受收益数值参数，不支持 '&' 等扩展参数
    for i in 0..30 {
        LogProfit(i);
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

- `remain` (number, optional): ```remain```参数用于指定需要保留的日志条数（整数）。

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
LogReset(remain)
```

清除日志。

Parameters:

- `remain` (number, optional): ```remain``` 参数用于设置需要保留的最近日志条数。

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

自定义图表绘图函数。

Parameters:

- `options` (object / object数组, required): ```options```参数为图表配置。```Chart()```函数的参数```options```是可以进行```JSON```序列化的```HighStocks```的```Highcharts.StockChart```参数，相比原生参数增加了一个```__isStock```属性。如果将```__isStock```属性设置为假值（例如```false```），则显示为普通图表，即使用```Highcharts```图表；如果将```__isStock```属性设置为真值（例如```true```），则使用```Highstocks```图表（默认```__isStock```为真值，例如```true```）。详情可查询[HighStocks图表库](http://api.highcharts.com/highstock)。

Returns (object): 图表对象。

多图表绘制配置说明：
- ```extension.layout``` 属性
  当此属性设置为 "single" 时，该图表不会与其他图表叠加显示（即不以分页标签方式呈现），而是单独平铺显示。
- ```extension.height``` 属性
  此属性用于设置图表的高度，取值可以为数值类型，也可以采用 "300px" 的形式设置。
- ```extension.col``` 属性
  此属性用于设置图表的宽度。页面宽度共划分为 12 个单元，设置为 8 即表示该图表占用 8 个单元的宽度。

```javascript
function main() {
    var cfgA = {
        extension: {
            layout: 'single', // 不参与分组，单独显示，默认为分组 'group'
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
            ]  // 指定初始数据后无需使用 add 函数更新，直接修改图表配置即可更新数据序列。
        }]
    };
    var cfgD = {
        extension: {
            layout: 'single',
            col: 8, // 指定宽度所占的单元数，总单元数为 12
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
        // 为饼图追加一个数据点，add 只能更新通过 add 方式添加的数据点，内置的数据点无法在后期更新
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
        // update 实际上等同于重置图表的配置
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
```

```rust
fn main() {
    // Rust 中图表配置为 JSON 字符串，可变部分使用占位符表示，更新时替换占位符以重新构建配置
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
    // 为饼图追加一个数据点，add 只能更新通过 add 方式添加的数据点，内置的数据点无法在后期更新
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
        // update 实际上等同于重置图表的配置
        chart.update(&format!("[{},{},{},{},{}]", cfg_a, cfg_b, cfg_c, cfg_d, cfg_e));
    }
}
```

简单的绘图示例：

```javascript
// 在 JavaScript 中，chart 是一个对象；在调用 Chart 函数之前，我们需要先声明一个用于配置图表的对象变量 chart
var chart = {
    // 该字段用于标记图表是否为普通图表，感兴趣的读者可以改为 false 运行查看效果
    __isStock: true,
    // 提示框
    tooltip: {xDateFormat: '%Y-%m-%d %H:%M:%S, %A'},
    // 标题
    title : { text : '差价分析图'},
    // 选择范围
    rangeSelector: {
        buttons:  [{type: 'hour',count: 1, text: '1h'}, {type: 'hour',count: 3, text: '3h'}, {type: 'hour', count: 8, text: '8h'}, {type: 'all',text: 'All'}],
        selected: 0,
        inputEnabled: false
    },
    // 横轴（即 x 轴），当前设置的类型为：时间
    xAxis: { type: 'datetime'},
    // 纵轴（即 y 轴），默认数值随数据大小自动调整
    yAxis : {
        // 标题
        title: {text: '差价'},
        // 是否启用右侧纵轴
        opposite: false
    },
    // 数据系列，该属性保存各个数据系列（折线、K 线图、标签等……）
    series : [
        // 索引为 0，data 数组中存放的是该索引系列的数据
        {name : "line1", id : "Line 1,buy1Price", data : []},
        // 索引为 1，设置了 dashStyle: 'shortdash'，即将其设置为虚线
        {name : "line2", id : "Line 2,lastPrice", dashStyle : 'shortdash', data : []}
    ]
}

function main(){
    // 调用 Chart 函数，初始化图表
    var ObjChart = Chart(chart)
    // 清空
    ObjChart.reset()
    while(true){
        // 获取本次轮询的时间戳（即毫秒级时间戳），用于确定写入图表的 X 轴位置
        var nowTime = new Date().getTime()
        // 获取行情数据
        var ticker = _C(exchange.GetTicker)
        // 从行情数据的返回值中取得买一价
        var buy1Price = ticker.Buy
        // 取得最新成交价，为避免两条线相互重合，此处将其加 1
        var lastPrice = ticker.Last + 1
        // 以时间戳作为 X 值、买一价作为 Y 值，传入索引 0 的数据序列
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
        "buttons" : [{"type": "count", "count": 1, "text": "1h"}, {"type": "hour", "count": 3, "text": "3h"}, {"type": "hour", "count": 8, "text": "8h"}, {"type": "all", "text": "All"}],
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
    // 在 Rust 中，图表配置为 JSON 字符串；在调用 Chart::new 函数之前，先定义图表配置
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

    // 调用 Chart::new 函数，初始化图表
    let obj_chart = Chart::new(chart);
    // 清空
    obj_chart.reset(0);
    loop {
        // 获取本次轮询的时间戳（即毫秒级时间戳），用于确定写入图表的 X 轴位置
        let now_time = Unix() * 1000;
        // 获取行情数据
        let ticker = _C!(exchange.GetTicker(None));
        // 从行情数据的返回值中取得买一价
        let buy1_price = ticker.Buy;
        // 取得最新成交价，为避免两条线相互重合，此处将其加 1
        let last_price = ticker.Last + 1.0;
        // 以时间戳作为 X 值、买一价作为 Y 值，传入索引 0 的数据序列
        obj_chart.add(0, &format!("[{}, {}]", now_time, buy1_price), -1);
        // 同上
        obj_chart.add(1, &format!("[{}, {}]", now_time, last_price), -1);
        Sleep(2000);
    }
}
```

绘制三角函数曲线的示例：

```javascript
// 用于初始化图表的配置对象
var chart = {
    // 图表标题
    title: {text: "Line value triggers plotLines value"},
    // Y 轴相关设置
    yAxis: {
        // 垂直于 Y 轴的水平线，用作触发线；这是一个结构体数组，可设置多条触发线
        plotLines: [{
            // 触发线的值，该线将显示在对应的数值位置
            value: 0,
            // 设置触发线的颜色
            color: 'red',
            // 线宽
            width: 2,
            // 显示的标签
            label: {
                // 标签文本
                text: 'Trigger Value',
                // 标签居中对齐
                align: 'center'
            }
        }]
    },
    // X 轴相关设置，此处将类型设置为时间轴
    xAxis: {type: "datetime"},
    series: [
        {name: "sin", type: "spline", data: []},
        // 数据系列，可设置多个，并通过数组索引进行控制
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
    // 坐标 y 值，用于接收正弦值或余弦值
    var y = 0
    // 调用 API 接口，使用 chart 对象初始化图表
    var objChart = Chart(chart)
    // 初始化时清空图表
    objChart.reset()
    // 将触发线的值设置为 1
    chart.yAxis.plotLines[0].value = 1
    // 循环
    while(true){
        // 获取当前时刻的时间戳
        time = new Date().getTime()
        // 每 500ms 将角度 angle 增加 5 度，并计算正弦值
        y = Math.sin(angle * 2 * pi / 360)
        // 将计算得到的 y 值写入图表对应索引的数据系列，add 函数的第一个参数为指定的数据系列索引
        objChart.add(0, [time, y])
        // 计算余弦值
        y = Math.cos(angle * 2 * pi / 360)
        objChart.add(1, [time, y])
        // 增加 5 度
        angle += 5
        // 暂停 5 秒，避免绘图过于频繁、数据增长过快
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
    // 用于初始化图表的 JSON 配置字符串，触发线的值在配置中直接设置为 1
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
    // 调用 API 接口，使用 chart 配置初始化图表
    let obj_chart = Chart::new(chart);
    // 初始化时清空图表
    obj_chart.reset(0);
    // 循环
    loop {
        // 获取当前时刻的毫秒时间戳
        let ts = Unix() * 1000;
        // 将角度 angle 增加 5 度，并计算正弦值
        let mut y = (angle * 2.0 * pi / 360.0).sin();
        // 将计算得到的 y 值写入图表对应索引的数据系列，add 函数的第一个参数为指定的数据系列索引
        obj_chart.add(0, &format!("[{}, {}]", ts, y), -1);
        // 计算余弦值
        y = (angle * 2.0 * pi / 360.0).cos();
        obj_chart.add(1, &format!("[{}, {}]", ts, y), -1);
        // 增加 5 度
        angle += 5.0;
        // 暂停 5 秒，避免绘图过于频繁、数据增长过快
        Sleep(5000);
    }
}
```

使用混合图表的复杂示例：

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
    // 在 Rust 中，图表配置以 JSON 字符串形式表示；饼图数据使用占位符 __PIE_DATA__ 标记，更新时替换该占位符后重建配置
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
        let r = (UnixNano() % 100) as f64 / 100.0;          // 使用时间戳模拟随机数
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

图表中```pie```类型的图表没有时间轴，因此在更新数据时需要直接更新图表配置。例如，在上述范例的代码中，更新数据后调用```c.update(chartCfg)```即可刷新图表，如下所示：

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

```Chart()```函数返回一个图表对象，该对象包含4个方法：```add()```、```reset()```、```update()```、```del()```。
- 1、```update()```方法：
  ```update()```方法用于更新图表的配置信息，其参数为Chart图表配置对象（JSON）。
- 2、```del()```方法：
  ```del()```方法根据传入的series参数，删除指定索引的数据系列。
- 3、```add()```方法：
  ```add()```方法用于向图表中写入数据，参数依次为：
  - ```series```：用于设置数据系列的索引，为整数。
  - ```data```：用于设置写入的具体数据，为一个数组。
  - ```index```（可选）：用于设置数据索引，为整数，指定要修改数据的具体索引位置，支持使用负数表示，设置为```-1```表示数据集的最后一个数据。
    例如画线时，修改线上最后一个点的数据：```chart.add(0, [1574993606000, 13.5], -1)```，即更改图表```series[0].data```中倒数第一个点的数据。不设置```index```参数时，表示向当前数据系列（series）末尾添加数据。
- 4、```reset()```方法：
  ```reset()```方法用于清空图表数据，可带一个参数```remain```，用于指定保留数据的条数。不传入参数```remain```时，表示清除全部数据。

See also: `KLineChart`

#### KLineChart

```
KLineChart(options)
```

该函数用于采用类似```Pine```语言的绘图方式，在策略运行时进行自定义绘图。

Parameters:

- `options` (object / object数组, required): ```options```参数为图表配置对象，支持以下属性：

- ```overlay```：布尔值，用于设置绘图内容是否叠加输出到主图。设置为```true```时在主图显示，设置为```false```时在副图显示。

- ```pricePrecision```：数字，价格数据精度，用于控制图表中价格数据的小数位数。例如，设置为2表示保留2位小数，设置为0表示不保留小数（四舍五入为整数）。

- ```volumePrecision```：数字，成交量数据精度，用于控制图表中成交量数据的小数位数。例如，设置为2表示保留2位小数，设置为0表示不保留小数（四舍五入为整数）。

Returns (object): 图表对象。

```KLineChart()```函数返回的图表对象包含多个方法，其中需要特别注意```begin(bar)```和```close(bar)```。在遍历K线数据执行绘图操作时，绘图操作必须以```begin(bar)```函数调用作为起始，并以```close(bar)```函数调用作为结束。

如果需要在策略自定义画图区域进行画图，必须先创建图表控制对象，使用```KLineChart()```函数即可创建该对象。```KLineChart()```函数的参数为一个图表配置结构，参考代码中使用的图表配置结构非常简单：```{overlay: true}```。

该图表配置结构仅设置将画图内容输出在图表主图上。如果```overlay```设置为假值（例如```false```），则图表内容将全部输出在副图上；如果需要指定某个画图函数在主图上绘制，也可以在具体的函数调用中将参数```overlay```指定为真值（例如```true```）。

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

    // 遍历K线数据执行画图操作，每次画图操作必须以```c.begin(bar)```函数调用作为起始，以```c.close(bar)```函数调用作为结束。
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

    // 遍历K线数据执行画图操作，每次画图操作必须以c.begin(bar)函数调用作为起始，以c.close()函数调用作为结束。
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

使用 ```pricePrecision``` 和 ```volumePrecision``` 参数控制图表数据的显示精度。可根据实际需求设置价格与成交量的显示精度，例如对于价格波动较大的品种，可将精度设置为 0 以显示整数；对于价格较为精细的品种，可设置为 2 或更高精度。

```javascript
function main() {
    // 创建图表控制对象，将价格精度与成交量精度均设置为 0（即显示整数）
    let c = KLineChart({
        overlay: true,
        pricePrecision: 0,   // 价格数据精度，设置为 2 即保留 2 位小数
        volumePrecision: 0   // 成交量数据精度
    })

    // 根据交易所类型选择合适的交易对
    let symbol = exchange.GetName().includes("Futures_") ? "ETH_USDT.swap" : "ETH_USDT"
    Log("Test symbol:", symbol)

    // 获取 K 线数据
    let bars = exchange.GetRecords(symbol)
    if (!bars) {
        return
    }

    // 遍历 K 线数据并绘制图表
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
    # 创建图表控制对象，将价格精度与成交量精度均设置为 0（即显示整数）
    c = KLineChart({
        "overlay": True,
        "pricePrecision": 0,   # 价格数据精度，设置为 2 即保留 2 位小数
        "volumePrecision": 0   # 成交量数据精度
    })

    # 根据交易所类型选择合适的交易对
    exName = exchange.GetName()
    symbol = "ETH_USDT.swap" if "Futures_" in exName else "ETH_USDT"
    Log("Test symbol:", symbol)

    # 获取 K 线数据
    bars = exchange.GetRecords(symbol)
    if not bars:
        return

    # 遍历 K 线数据并绘制图表
    for bar in bars:
        c.begin(bar)
        c.barcolor('rgba(255, 0, 0, 0.2)' if bar.Close > bar.Open else 'rgba(0, 0, 0, 0.2)')
        c.plot(bar.High, 'high')
        c.plot(bar.Low, 'low')
        c.close(bar)
```

```rust
fn main() {
    // 创建图表控制对象，将价格精度与成交量精度均设置为 0（即显示整数）
    // pricePrecision 为价格数据精度，设置为 2 即保留 2 位小数；volumePrecision 为成交量数据精度
    let mut c = KLineChart::new(r#"{"overlay": true, "pricePrecision": 0, "volumePrecision": 0}"#);

    // 根据交易所类型选择合适的交易对
    let symbol = if exchange.GetName().contains("Futures_") { "ETH_USDT.swap" } else { "ETH_USDT" };
    Log!("Test symbol:", symbol);

    // 获取 K 线数据
    let bars = exchange.GetRecords(symbol, None, None).unwrap();

    // 遍历 K 线数据并绘制图表
    for bar in &bars {
        c.begin(bar);
        c.barcolor(if bar.Close > bar.Open { "rgba(255, 0, 0, 0.2)" } else { "rgba(0, 0, 0, 0.2)" }, "{}");
        c.plot(bar.High, r#"{"title": "high"}"#);
        c.plot(bar.Low, r#"{"title": "low"}"#);
        c.close();
    }
}
```

绘图操作中支持的```Pine```语言绘图接口函数如下：

```barcolor```：设置K线颜色。

> barcolor(color, offset, editable, show_last, title, display)

> display参数的可选值为："none", "all"

```javascript
c.barcolor(bar.Close > bar.Open ? 'rgba(255, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.2)')   // 用法同上例中的参考代码，此处不再赘述
```

```python
c.barcolor('rgba(255, 0, 0, 0.2)' if bar.Close > bar.Open else 'rgba(0, 0, 0, 0.2)')
```

```rust
c.barcolor(if bar.Close > bar.Open { "rgba(255, 0, 0, 0.2)" } else { "rgba(0, 0, 0, 0.2)" }, "{}");   // 用法同上例中的参考代码，此处不再赘述
```

```bgcolor```：使用指定颜色填充K线背景。

> bgcolor(color, offset, editable, show_last, title, display, overlay)

> display参数的可选值为："none", "all"

```javascript
c.bgcolor('rgba(0, 255, 0, 0.5)')
```

```python
c.bgcolor('rgba(0, 255, 0, 0.5)')
```

```rust
c.bgcolor("rgba(0, 255, 0, 0.5)", "{}");
```

```plot```：在图表上绘制一系列数据。

> plot(series, title, color, linewidth, style, trackprice, histbase, offset, join, editable, show_last, display)

> style参数的可选值为："stepline_diamond", "stepline", "cross", "areabr", "area", "circles", "columns", "histogram", "linebr", "line"

> display参数的可选值为："none", "all"

```javascript
c.plot(bar.High, 'high')

c.plot(bar.Open < bar.Close ? NaN : bar.Close, "Close", {style: "linebr"})  // 支持绘制不连续的数据线
```

```python
h = c.plot(bar.High, 'high')

h = c.plot(None if bar.Open < bar.Close else bar.Close, "Close", style = "linebr")  # 支持绘制不连续的数据线
```

```rust
let h = c.plot(bar.High, r#"{"title": "high"}"#);

c.plot(if bar.Open < bar.Close { f64::NAN } else { bar.Close }, r#"{"title": "Close", "style": "linebr"}"#);  // 支持绘制不连续的数据线
```

```fill```，使用指定的颜色填充两个绘图或```hline```之间的背景区域。 > fill(hline1, hline2, color, title, editable, fillgaps, display) > display参数可选："none", "all"

由于```JavaScript```语言无法根据函数形参名称指定传入参数，为解决此问题，可以使用```{key: value}```结构为指定的形参名称传入参数。例如，参考代码中使用```{color: bar.Close > bar.Open ? 'rgba(255, 0, 0, 0.2)' : 'rgba(255, 0, 0, 0.2)'}```为```fill```函数的```color```参数赋值。

如需连续为多个形参名称指定参数，可以使用```{key1: value1, key2: value2, key3: value3}```。

例如，本示例中额外指定了一个```title```参数：```{color: bar.Close > bar.Open ? 'rgba(255, 0, 0, 0.2)' : 'rgba(255, 0, 0, 0.2)', title: 'fill'}```。

颜色值既可以使用```'rgba(255, 0, 0, 0.2)'```方式设置，也可以使用```'#FF0000'```方式设置。

```javascript
let h = c.plot(bar.High, 'high')
let l = c.plot(bar.Low, 'low')
c.fill(h, l, {color: bar.Close > bar.Open ? 'rgba(255, 0, 0, 0.2)' : 'rgba(255, 0, 0, 0.2)'})
```

```python
h = c.plot(bar.High, 'high')
l = c.plot(bar.Low, 'low')
c.fill(h, l, color = 'rgba(255, 0, 0, 0.2)' if bar.Close > bar.Open else 'rgba(255, 0, 0, 0.2)')
```

```rust
let h = c.plot(bar.High, r#"{"title": "high"}"#);
let l = c.plot(bar.Low, r#"{"title": "low"}"#);
c.fill(h, l, if bar.Close > bar.Open { r#"{"color": "rgba(255, 0, 0, 0.2)"}"# } else { r#"{"color": "rgba(255, 0, 0, 0.2)"}"# });
```

```hline```，在给定的固定价格水平上绘制水平线。

> hline(price, title, color, linestyle, linewidth, editable, display)

> linestyle参数可选："dashed", "dotted", "solid"

> display参数可选："none", "all"

```javascript
c.hline(bar.High)
```

```python
c.hline(bar.High)
```

```rust
c.hline(bar.High, "{}");
```

```plotarrow```，在图表上绘制向上和向下的箭头。

> plotarrow(series, title, colorup, colordown, offset, minheight, maxheight, editable, show_last, display)

> display参数可选："none", "all"

```javascript
c.plotarrow(bar.Close - bar.Open)
```

```python
c.plotarrow(bar.Close - bar.Open)
```

```rust
c.plotarrow(bar.Close - bar.Open, "{}");
```

```plotshape```，在图表上绘制可视化形状。
> plotshape(series, title, style, location, color, offset, text, textcolor, editable, size, show_last, display)
> style参数可选："diamond", "square", "label_down", "label_up", "arrow_down", "arrow_up", "circle", "flag", "triangle_down", "triangle_up", "cross", "xcross"
> location参数可选："abovebar", "belowbar", "top", "bottom", "absolute"
> size参数可选："10px", "14px", "20px", "40px", "80px"，分别对应Pine语言中的size.tiny、size.small、size.normal、size.large、size.huge
> size.auto等同于size.small。
> display参数可选："none", "all"

```javascript
c.plotshape(bar.Low, {style: 'diamond'})
```

```python
c.plotshape(bar.Low, style = 'diamond')
```

```rust
c.plotshape(bar.Low > 0.0, r#"{"style": "diamond"}"#);
```

```plotchar```，在图表上使用任意给定的Unicode字符绘制可视化形状。
> plotchar(series, title, char, location, color, offset, text, textcolor, editable, size, show_last, display)
> location参数可选："abovebar", "belowbar", "top", "bottom", "absolute"
> size参数可选："10px", "14px", "20px", "40px", "80px"，分别对应Pine语言中的size.tiny、size.small、size.normal、size.large、size.huge
> size.auto等同于size.small。
> display参数可选："none", "all"

```javascript
c.plotchar(bar.Close, {char: 'X'})
```

```python
c.plotchar(bar.Close, char = 'X')
```

```rust
c.plotchar(bar.Close > 0.0, r#"{"char": "X"}"#);
```

```plotcandle```，在图表上绘制K线图。
> plotcandle(open, high, low, close, title, color, wickcolor, editable, show_last, bordercolor, display)
> display参数可选："none", "all"

```javascript
c.plotcandle(bar.Open*0.9, bar.High*0.9, bar.Low*0.9, bar.Close*0.9)
```

```python
c.plotcandle(bar.Open*0.9, bar.High*0.9, bar.Low*0.9, bar.Close*0.9)
```

```rust
c.plotcandle(bar.Open * 0.9, bar.High * 0.9, bar.Low * 0.9, bar.Close * 0.9, "{}");
```

```signal```，此为Pine语言中不存在的函数，此处用于绘制买卖信号。
> signal(direction, price, qty, id)

传入的参数"long"表示交易方向，可选"long"、"closelong"、"short"、"closeshort"。传入的参数```bar.High```表示标记信号在Y轴上的位置。
传入的参数1.5表示信号的交易数量。可传入第四个参数以替换默认绘制的文本内容；信号标记的默认文本为交易方向，例如："closelong"。

```javascript
c.signal("long", bar.High, 1.5)
```

```python
c.signal("long", bar.High, 1.5)
```

```rust
c.signal("long", bar.High, 1.5, "long");
```

```reset```，此为Pine语言中不存在的函数，用于清空图表数据。
> reset(remain)

```reset()```方法可接受一个参数```remain```，用于指定保留数据的条数。若不传入```remain```参数，则表示清除全部数据。

```javascript
c.reset()
```

```python
c.reset()
```

```rust
c.reset(0);
```

策略自定义绘图只能选用```KLineChart()```函数或```Chart()```函数两种方式中的一种。有关```KLineChart()```函数调用时所涉及的颜色、样式等设置，请参阅[使用KLineChart函数绘图的专题文章](https://www.fmz.com/bbs-topic/9482)。

```pricePrecision```和```volumePrecision```参数用于控制图表中数据的显示精度。当未设置这些参数时，图表将使用默认精度显示数据。设置精度参数后，图表中的价格和成交量数据将按照指定的小数位数进行四舍五入显示，这有助于简化图表显示、提升可读性。

See also: `Chart`

#### console.log

```
console.log(...msgs)
```

用于在实盘页面的「调试信息」栏中输出调试信息。例如，实盘ID为```123456```时，```console.log```函数在实盘页面输出调试信息的同时，会在实盘所属托管者目录```/logs/storage/123456/```下创建一个扩展名为```.log```的日志文件并写入调试信息，文件名前缀为```stdout_```。

Parameters:

- `msg` (string / number / bool / object / array / any (平台支持的任意类型), optional): 参数```msg```为输出的内容，可以传递多个参数。

```javascript
function main() {
    console.log("test console.log")
}
```

```python
# 不支持
```

注意事项：
- 仅```JavaScript```语言支持此函数。
- 仅实盘环境支持此函数，「调试工具」和「回测系统」均不支持。
- 输出对象时会被转换为字符串```[object Object]```，因此建议输出可读的信息。

See also: `console.error`

#### console.error

```
console.error(...msgs)
```

用于在实盘页面的「调试信息」栏中输出错误信息。例如，实盘ID为```123456```时，```console.error```函数在实盘页面输出错误信息的同时，会在实盘所属托管者目录```/logs/storage/123456/```下创建一个以```stderr_```为前缀、```.log```为扩展名的日志文件，并将错误信息写入该文件。

Parameters:

- `msg` (string / number / bool / object / array / any (平台支持的任意类型), optional): 参数```msg```为需要输出的内容，可以传入多个参数。

```javascript
function main() {
    console.error("test console.error")
}
```

```python
# 不支持
```

注意事项：
- 仅```JavaScript```语言支持此函数。
- 仅实盘环境支持此函数，「调试工具」和「回测系统」不支持。
- 输出对象时会被转换为字符串```[object Object]```，建议输出可读性强的信息。

See also: `console.log`

#### exchange.Log

```
exchange.Log(orderType, price, amount)
exchange.Log(orderType, price, amount, ...args)
```

```exchange.Log()```函数用于在日志栏区域输出下单、撤单日志。该函数被调用时不会实际下单，仅用于输出并记录交易日志。

Parameters:

- `orderType` (number, required): ```orderType```参数用于设置输出的日志类型，可选值为`LOG_TYPE_BUY`、`LOG_TYPE_SELL`、`LOG_TYPE_CANCEL`。
- `price` (number, required): ```price```参数用于设置日志中显示的价格。
- `amount` (number, required): ```amount```参数用于设置日志中显示的下单量。
- `arg` (string / number / bool / object / array / any (平台支持的任意类型), optional): 扩展参数，用于向该条日志中输出附带信息，```arg```参数可以传入多个。

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

#### exchange.GetTicker

```
exchange.GetTicker()
exchange.GetTicker(symbol)
```

获取当前设置的交易对、合约代码所对应现货或合约的`Ticker`结构，即行情数据。```GetTicker()```函数是交易所对象`exchange`的成员函数，```exchange```对象的成员函数（方法）的用途仅与```exchange```相关，后续文档中不再赘述。

Parameters:

- `symbol` (string, optional): 参数```symbol```用于指定所请求的`Ticker`数据对应的具体交易对、合约代码。若不传该参数，则默认请求当前设置的交易对、合约代码的行情数据。

当调用```exchange.GetTicker(symbol)```函数且```exchange```为现货交易所对象时，若需请求计价币种为USDT、交易币种为BTC的行情数据，则参数```symbol```为：```"BTC_USDT"```，其格式为FMZ平台定义的交易对格式。

当调用```exchange.GetTicker(symbol)```函数且```exchange```为期货交易所对象时，若需请求BTC的U本位永续合约的行情数据，则参数```symbol```为：```"BTC_USDT.swap"```，其格式为FMZ平台定义的**交易对**与**合约代码**的组合，两者之间以字符"."分隔。

当调用```exchange.GetTicker(symbol)```函数且```exchange```为期货交易所对象时，若需请求BTC的U本位期权合约的行情数据，则参数```symbol```为：```"BTC_USDT.BTC-240108-40000-C"```（以币安期权BTC-240108-40000-C为例），其格式为FMZ平台定义的**交易对**与交易所定义的具体期权合约代码的组合，两者之间以字符"."分隔。

Returns (`Ticker` / 空值): ```exchange.GetTicker()```函数请求数据成功时返回`Ticker`结构，请求数据失败时返回空值。

对于期货交易所对象（即```exchange```或```exchanges[0]```），在调用行情函数前需要先使用```exchange.SetContractType()```函数设置合约代码，后续文档中不再赘述。

```javascript
function main(){
    // 如果是期货交易所对象，先设置合约代码，例如设置为永续合约
    // exchange.SetContractType("swap")

    var ticker = exchange.GetTicker()
    /*
        可能由于网络原因，访问不到交易所接口（即使托管者程序所在设备能打开交易所网站，但是API接口也可能访问不通）
        此时ticker为null，当访问ticker.High时，会导致错误，所以在测试该代码时，确保可以访问到交易所接口
    */
    Log("Symbol:", ticker.Symbol, "High:", ticker.High, "Low:", ticker.Low, "Sell:", ticker.Sell, "Buy:", ticker.Buy, "Last:", ticker.Last, "Open:", ticker.Open, "Volume:", ticker.Volume)
}
```

```python
def main():
    ticker = exchange.GetTicker()
    Log("Symbol:", ticker["Symbol"], "High:", ticker["High"], "Low:", ticker["Low"], "Sell:", ticker["Sell"], "Buy:", ticker["Buy"], "Last:", ticker["Last"], "Open:", ticker["Open"], "Volume:", ticker["Volume"])
```

```rust
fn main() {
    // 如果是期货交易所对象，先设置合约代码，例如设置为永续合约
    // exchange.SetContractType("swap").unwrap();

    let ticker = exchange.GetTicker(None).unwrap();
    Log!("Symbol:", ticker.Symbol, "High:", ticker.High, "Low:", ticker.Low, "Sell:", ticker.Sell, "Buy:", ticker.Buy, "Last:", ticker.Last, "Open:", ticker.Open, "Volume:", ticker.Volume);
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

不支持```exchange.GetTicker()```函数的交易所：

| 函数名 | 不支持的现货交易所 | 不支持的期货交易所 |
| - | - | - |
| GetTicker | -- | Futures_Aevo |

Uniswap交易所（链上兑换）返回的```Buy```、```Sell```为约1000美元规模的实际可成交价（含池子手续费），```Last```为两者的中间价；链上池子没有24小时统计，```High```、```Low```、```Open```为当前价，```Volume```为0。

See also: `exchange.GetDepth`, `exchange.GetTrades`, `exchange.GetRecords`, `exchange.GetTickers`, `exchange.IO`（API限流控制）

#### exchange.GetTickers

```
exchange.GetTickers()
```

```exchange.GetTickers()```函数用于获取交易所的聚合行情数据（`Ticker`结构的数组）。当```exchange```为现货交易所对象时，返回所有交易对的 ticker 行情数据；当```exchange```为期货交易所对象时，返回所有合约的 ticker 行情数据。

Returns (`Ticker`数组 / 空值): ```exchange.GetTickers()```函数在请求数据成功时返回`Ticker`结构数组，请求数据失败时返回空值。

调用 ```exchange.GetTickers()``` 函数，获取聚合行情数据。

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

使用现货交易所对象，在回测系统中调用```exchange.GetTickers()```函数。在调用任何行情函数之前，GetTickers仅返回当前默认交易对的ticker数据；在调用行情函数之后，则会返回所有已请求过的交易对的ticker数据。可参考以下测试示例：

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

- 该函数请求交易所的聚合行情接口，调用前无需设置交易对或合约代码，且仅返回交易所已上线交易品种的行情数据。

- 回测系统支持该函数。

- 未提供聚合行情接口的交易所对象不支持该函数。

- 该函数不支持期权合约。

不支持```exchange.GetTickers()```函数的交易所：

| 函数名 | 不支持的现货交易所 | 不支持的期货交易所 |
| - | - | - |
| GetTickers | Zaif / WOO / Gemini / Coincheck / BitFlyer / Bibox / Uniswap | Futures_WOO / Futures_dYdX / Futures_Deribit / Futures_Bibox / Futures_Aevo / Futures_edgeX |

See also: `Ticker`, `exchange.GetTicker`

#### exchange.GetDepth

```
exchange.GetDepth()
exchange.GetDepth(symbol)
```

获取当前设置的交易对、合约代码所对应的现货或合约的`Depth`结构，即订单簿数据。

Parameters:

- `symbol` (string, optional): 参数```symbol```用于指定所请求的`Depth`数据对应的具体交易对或合约代码。若不传该参数，则默认请求当前设置的交易对、合约代码的订单簿数据。

当调用```exchange.GetDepth(symbol)```函数时，若```exchange```为现货交易所对象，且需要请求计价币种为USDT、交易币种为BTC的订单簿数据，则参数```symbol```应为```"BTC_USDT"```，其格式为FMZ平台定义的交易对格式。

当调用```exchange.GetDepth(symbol)```函数时，若```exchange```为期货交易所对象，且需要请求BTC的U本位永续合约的订单簿数据，则参数```symbol```应为```"BTC_USDT.swap"```，其格式为FMZ平台定义的**交易对**与**合约代码**的组合，并以字符"."间隔。

当调用```exchange.GetDepth(symbol)```函数时，若```exchange```为期货交易所对象，且需要请求BTC的U本位期权合约的订单簿数据，则参数```symbol```应为```"BTC_USDT.BTC-240108-40000-C"```（以币安期权BTC-240108-40000-C为例），其格式为FMZ平台定义的**交易对**与交易所定义的具体期权合约代码的组合，并以字符"."间隔。

Returns (`Depth` / 空值): ```exchange.GetDepth()```函数在请求数据成功时返回`Depth`结构，请求数据失败时返回空值。

测试```exchange.GetDepth()```函数：

```javascript
function main(){
    var depth = exchange.GetDepth()
    /*
        可能由于网络原因，访问不到交易所接口（即使托管者程序所在设备能打开交易所网站，但是API接口也可能访问不通）
        此时depth为null，当访问depth.Asks[1].Price时，会导致错误，所以在测试该代码时，确保可以访问到交易所接口
    */
    var price = depth.Asks[1].Price
    Log("Second ask price:", price)
}
```

```python
def main():
    depth = exchange.GetDepth()
    price = depth["Asks"][1]["Price"]
    Log("Second ask price:", price)
```

```rust
fn main() {
    let depth = exchange.GetDepth(None).unwrap();
    let price = depth.Asks[1].Price;
    Log!("Second ask price:", price);
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

Uniswap交易所（链上兑换）没有订单簿，返回的深度由从约1000美元起逐档递增规模的链上询价推算：每档的```Amount```为该档新增的基础币数量，```Price```为该档的边际成交价。

See also: `exchange.GetTicker`, `exchange.GetTrades`, `exchange.GetRecords`

#### exchange.GetTrades

```
exchange.GetTrades()
exchange.GetTrades(symbol)
```

获取当前设置的交易对、合约代码所对应的现货或合约的`Trade`结构数组，即市场的成交数据。

Parameters:

- `symbol` (string, optional): 参数```symbol```用于指定所请求的`Trade`数组数据对应的具体交易对、合约代码。若不传该参数，则默认请求当前设置的交易对、合约代码的最近成交记录数据。

当调用```exchange.GetTrades(symbol)```函数时，若```exchange```为现货交易所对象，需要请求计价币种为USDT、交易币种为BTC的成交数据，则参数```symbol```为：```"BTC_USDT"```，其格式为FMZ平台定义的交易对格式。

当调用```exchange.GetTrades(symbol)```函数时，若```exchange```为期货交易所对象，需要请求BTC的U本位永续合约的成交数据，则参数```symbol```为：```"BTC_USDT.swap"```，其格式为FMZ平台定义的**交易对**与**合约代码**组合，并以字符"."间隔。

当调用```exchange.GetTrades(symbol)```函数时，若```exchange```为期货交易所对象，需要请求BTC的U本位期权合约的成交数据，则参数```symbol```为：```"BTC_USDT.BTC-240108-40000-C"```（以币安期权BTC-240108-40000-C为例），其格式为FMZ平台定义的**交易对**与交易所定义的具体期权合约代码组合，并以字符"."间隔。

Returns (`Trade`数组 / 空值): ```exchange.GetTrades()```函数在请求数据成功时返回`Trade`结构数组，在请求数据失败时返回空值。

测试```exchange.GetTrades()```函数：

```javascript
function main(){
    var trades = exchange.GetTrades()
    /*
        可能由于网络原因，访问不到交易所接口（即使托管者程序所在设备能打开交易所网站，但是API接口也可能访问不通）
        此时trades为null，当访问trades[0].Id时，会导致错误，所以在测试该代码时，确保可以访问到交易所接口
    */
    Log("id:", trades[0].Id, "time:", trades[0].Time, "Price:", trades[0].Price, "Amount:", trades[0].Amount, "type:", trades[0].Type)
}
```

```python
def main():
    trades = exchange.GetTrades()
    Log("id:", trades[0]["Id"], "time:", trades[0]["Time"], "Price:", trades[0]["Price"], "Amount:", trades[0]["Amount"], "type:", trades[0]["Type"])
```

```rust
fn main() {
    let trades = exchange.GetTrades(None).unwrap();
    Log!("id:", trades[0].Id, "time:", trades[0].Time, "Price:", trades[0].Price, "Amount:", trades[0].Amount, "type:", trades[0].Type);
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

不支持```exchange.GetTrades()```函数的交易所：

| 函数名 | 不支持的现货交易所 | 不支持的期货交易所 |
| - | - | - |
| GetTrades | Hyperliquid | Futures_BitMart / Futures_Bibox / Futures_Hyperliquid / Futures_edgeX |

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

- `symbol` (string, optional): 参数```symbol```用于指定所请求的`Record`数组数据对应的具体交易对、合约代码。若不传该参数，则默认请求当前设置的交易对、合约代码的K线数据。

当调用```exchange.GetRecords(symbol)```函数时，若```exchange```为现货交易所对象，需要请求计价币种为USDT、交易币种为BTC的K线数据，则参数```symbol```为：```"BTC_USDT"```，其格式为FMZ平台定义的交易对格式。

当调用```exchange.GetRecords(symbol)```函数时，若```exchange```为期货交易所对象，需要请求BTC的U本位永续合约K线数据，则参数```symbol```为：```"BTC_USDT.swap"```，其格式为FMZ平台定义的**交易对**与**合约代码**组合，并以字符"."间隔。

当调用```exchange.GetRecords(symbol)```函数时，若```exchange```为期货交易所对象，需要请求BTC的U本位期权合约K线数据，则参数```symbol```为：```"BTC_USDT.BTC-240108-40000-C"```（以币安期权BTC-240108-40000-C为例），其格式为FMZ平台定义的**交易对**与交易所定义的具体期权合约代码组合，并以字符"."间隔。
- `period` (number, optional): 参数```period```用于指定所请求K线数据的周期，例如：`PERIOD_M1`、`PERIOD_M5`、`PERIOD_M15`等；参数```period```除了可以传入已定义的标准周期外，还可以传入整数数值，单位为秒。若不传该参数，则默认请求的K线数据周期为当前策略实盘/回测所配置的默认K线周期。
- `limit` (number, optional): 参数```limit```用于指定所请求K线数据的长度，若不传该参数，则默认请求长度为交易所K线接口单次最大请求的K线柱数量；该参数可能会触发对交易所K线数据的分页查询，分页查询时该函数的调用耗时会相应增加。

Returns (`Record`数组 / 空值): ```exchange.GetRecords()```函数请求数据成功时返回`Record`结构数组，请求数据失败时返回空值。

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

输出 K 线柱数据：

```javascript
function main() {
    var records = exchange.GetRecords(PERIOD_H1)
    /*
        可能由于网络原因，无法访问交易所接口（即使托管者程序所在设备能够打开交易所网站，API 接口仍可能无法访问）
        此时 records 为 null，访问 records[0].Time 时会导致错误。因此在测试该代码时，请确保能够正常访问交易所接口
    */
    Log("First K-line data: Time:", records[0].Time, "Open:", records[0].Open, "High:", records[0].High)
    Log("Second K-line data: Time:", records[1].Time ,"Close:", records[1].Close)
    Log("Current K-line (latest)", records[records.length-1], "Previous K-line", records[records.length-2])
}
```

```python
def main():
    records = exchange.GetRecords(PERIOD_H1)
    Log("First K-line data: Time:", records[0]["Time"], "Open:", records[0]["Open"], "High:", records[0]["High"])
    Log("Second K-line data: Time:", records[1]["Time"], "Close:", records[1]["Close"])
    Log("Current K-line (latest)", records[-1], "Previous K-line", records[-2])
```

```rust
fn main() {
    let records = exchange.GetRecords(None, PERIOD_H1, None).unwrap();
    Log!("First K-line data: Time:", records[0].Time, "Open:", records[0].Open, "High:", records[0].High);
    Log!("Second K-line data: Time:", records[1].Time, "Close:", records[1].Close);
    Log!("Current K-line (latest)", records[records.len() - 1], "Previous K-line", records[records.len() - 2]);
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

返回值为```Record```结构数组。返回的K线数据会随时间不断累积，累积的K线柱数量上限受```exchange.SetMaxBarLen()```函数设置的影响，未设置时默认上限为5000个K线柱。当K线数据达到累积上限后，每新增一根K线柱的同时会删除时间最早的一根K线柱（类似队列的先进先出）。部分交易所未提供K线接口，此时由托管者实时收集市场成交记录数据（```Trade```结构数组）来合成K线。

如果交易所的K线接口支持分页查询，当调用```exchange.SetMaxBarLen()```函数设置较大的K线长度时，系统会发起多次API请求。

初始调用```exchange.GetRecords()```函数时，所获取的K线柱数量在回测和实盘环境下有所不同：

  - 回测系统会预先获取回测时间范围起始时刻之前一定数量的K线柱（默认为5000个，回测系统的相关设置及数据量会影响最终返回的数量），作为初始K线数据。

  - 实盘时具体获取的K线柱数量取决于交易所K线接口所能提供的最大数据量。

将```period```参数设置为5，即表示请求获取以5秒为周期的K线数据。如果```period```参数不能被60整除（即所代表的周期无法以分钟为单位表示），系统底层会使用```exchange.GetTrades()```的相关接口获取成交记录数据，以合成所需的K线数据；如果```period```参数能被60整除，则最小使用1分钟K线数据（并尽可能使用较大的周期）来合成所需的K线数据。

在回测系统的模拟级别回测中，由于需要设置底层K线周期（模拟级别回测时，系统会根据设置的底层K线周期，使用对应的K线数据生成Tick数据），因此需要注意：策略中获取的K线数据周期不能小于底层K线周期。这是因为在模拟级别回测中，各个周期的K线数据均由底层K线周期对应的K线数据合成而来。

不支持```exchange.GetRecords()```函数的交易所：

  | 函数名 | 不支持的现货交易所 | 不支持的期货交易所 |
  | - | - | - |
  | GetRecords | Zaif / Coincheck / BitFlyer / Uniswap | Futures_Aevo |

See also: `exchange.GetTicker`, `exchange.GetDepth`, `exchange.GetTrades`, `exchange.SetMaxBarLen`

#### exchange.GetMarkets

```
exchange.GetMarkets()
```

```exchange.GetMarkets()```函数用于获取交易所的市场信息。

Returns (object / 空值): 包含`Market`结构体的字典。

期货交易所对象的调用示例：

```javascript
function main() {
    var markets = exchange.GetMarkets()
    var currency = exchange.GetCurrency()

    // 获取当前合约代码也可以使用exchange.GetContractType()函数
    var ct = "swap"

    var key = currency + "." + ct
    Log(key, ":", markets[key])
}
```

```python
def main():
    markets = exchange.GetMarkets()
    currency = exchange.GetCurrency()
    ct = "swap"

    key = currency + "." + ct
    Log(key, ":", markets[key])
```

```rust
fn main() {
    let markets = exchange.GetMarkets();
    let currency = exchange.GetCurrency();

    // 获取当前合约代码也可以使用exchange.GetContractType()函数
    let ct = "swap";

    let key = format!("{}.{}", currency, ct);
    Log!(key, ":", format!("{:?}", markets.get(&key)));
}
```

在回测系统中，使用期货交易所对象调用```exchange.GetMarkets()```函数。在调用任何行情函数之前，GetMarkets仅返回当前默认交易对的market数据；在调用行情函数之后，则会返回所有已请求过品种的market数据。可参考以下测试示例：

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

    // Rust SDK 没有JSON序列化功能，此处使用format!拼接表格的JSON文本
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

```exchange.GetMarkets()```函数的返回值为一个字典。对于现货交易所，键名为交易品种名称，格式固定为交易对，例如：
```json
{
    "BTC_USDT" : {...},  // 键值为Market结构
    "LTC_USDT" : {...},
    ...
}
```

对于期货合约交易所而言，由于同一品种可能存在多个合约，例如```BTC_USDT```交易对包含永续合约、季度合约等，因此```exchange.GetMarkets()```函数返回的字典中，键名为交易对与合约代码的组合，例如：
```json
{
    "BTC_USDT.swap" : {...},     // 键值为Market结构
    "BTC_USDT.quarter" : {...},
    "LTC_USDT.swap" : {...},
    ...
}
```

- ```exchange.GetMarkets()```函数支持实盘与回测系统。
- ```exchange.GetMarkets()```函数仅返回交易所已上线交易品种的市场信息。
- 期权合约：Futures_Deribit、Futures_Bybit、Futures_GateIO、Futures_Aevo返回的结果包含期权合约（键名形如```ETH_USDT.ETH-25JUN27-2800-C-USDT```）；其它交易所（如Futures_Binance、Futures_OKX、Futures_Kraken）的结果不包含期权合约。

不支持```exchange.GetMarkets()```函数的交易所：
| 函数名 | 不支持的现货交易所 | 不支持的期货交易所 |
| - | - | - |
| GetMarkets | Coincheck / Bithumb / BitFlyer | -- |

See also: `Market`

#### exchange.GetRawJSON

```
exchange.GetRawJSON()
```

获取当前交易所对象（`exchange`、`exchanges`）最近一次```rest```请求返回的原始内容。

Returns (string): ```rest```请求的响应数据。

```javascript
function main(){
    exchange.GetAccount();
    var obj = JSON.parse(exchange.GetRawJSON());
    Log(obj);
}
```

```python
import json
def main():
    exchange.GetAccount()
    obj = json.loads(exchange.GetRawJSON())
    Log(obj)
```

```exchange.GetRawJSON()```函数仅支持实盘交易。

See also: `exchange`

#### exchange.SetData

```
exchange.SetData(key, value)
```

```exchange.SetData()```函数用于设置策略运行时所加载的数据。

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
```

```exchange.GetData()```函数用于获取由```exchange.SetData()```函数加载的数据，或外部链接提供的数据。

Parameters:

- `key` (string, required): 数据集合的名称，或数据请求链接。
- `timeout` (number, optional): 用于设置缓存超时时间，单位为毫秒。实盘时默认缓存超时时间为一分钟。

Returns (object / 空值): 数据集合中的记录，或请求返回的数据。

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
```golang
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

回测时一次性获取数据，实盘时缓存一分钟的数据。在回测系统中，当使用访问接口请求数据的方式时，回测系统会自动为请求添加```from```(时间戳，单位秒)、```to```(时间戳，单位秒)、```period```(底层K线周期，时间戳，单位毫秒)等参数，用于确定要获取数据的时间范围。

See also: `exchange.SetData`

### Trade

#### exchange.Buy

```
exchange.Buy(price, amount)
exchange.Buy(price, amount, ...args)
```

```exchange.Buy()```函数用于下买单。```Buy()```函数是交易所对象`exchange`的成员函数。```Buy()```函数操作交易所对象```exchange```所绑定的交易所账户。```exchange```对象的成员函数（方法）的用途仅与```exchange```相关，本文档后续不再赘述。

Parameters:

- `price` (number, required): ```price```参数用于设置订单价格。
- `amount` (number, required): ```amount```参数用于设置订单量。
- `arg` (string / number / bool / object / array / any (平台支持的任意类型), optional): 扩展参数，用于将附带信息输出到该条下单日志中，```arg```参数可传入多个。

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

加密货币期货合约下单时必须注意交易方向是否设置正确，如果交易方向与交易函数不匹配将会报错：

    ```log

    direction is sell, invalid order type Buy

    direction is buy, invalid order type Sell

    direction is closebuy, invalid order type Buy

    direction is closesell, invalid order type Sell

    ```

```javascript
// 以下为错误调用
function main() {
    exchange.SetContractType("quarter")

    // 设置做空方向
    exchange.SetDirection("sell")
    // 下买单，会报错，做空只能卖出
    var id = exchange.Buy(50, 1)

    // 设置做多方向
    exchange.SetDirection("buy")
    // 下卖单，会报错，做多只能买入
    var id2 = exchange.Sell(60, 1)

    // 设置平多方向
    exchange.SetDirection("closebuy")
    // 下买单，会报错，平多只能卖出
    var id3 = exchange.Buy(-1, 1)

    // 设置平空方向
    exchange.SetDirection("closesell")
    // 下卖单,会报错,平空只能买入
    var id4 = exchange.Sell(-1, 1)
}
```

```python
# 以下为错误调用
def main():
    exchange.SetContractType("quarter")
    exchange.SetDirection("sell")
    id = exchange.Buy(50, 1)
    exchange.SetDirection("buy")
    id2 = exchange.Sell(60, 1)
    exchange.SetDirection("closebuy")
    id3 = exchange.Buy(-1, 1)
    exchange.SetDirection("closesell")
    id4 = exchange.Sell(-1, 1)
```

```rust
// 以下为错误调用
fn main() {
    let _ = exchange.SetContractType("quarter");

    // 设置做空方向
    let _ = exchange.SetDirection("sell");
    // 下买单，会报错，做空只能卖出
    let id = exchange.Buy(50, 1);

    // 设置做多方向
    let _ = exchange.SetDirection("buy");
    // 下卖单，会报错，做多只能买入
    let id2 = exchange.Sell(60, 1);

    // 设置平多方向
    let _ = exchange.SetDirection("closebuy");
    // 下买单，会报错，平多只能卖出
    let id3 = exchange.Buy(-1, 1);

    // 设置平空方向
    let _ = exchange.SetDirection("closesell");
    // 下卖单,会报错,平空只能买入
    let id4 = exchange.Sell(-1, 1);
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

期货合约下单时必须注意交易方向是否设置正确，如果交易方向与交易函数不匹配将会报错。加密货币期货合约交易所的下单量如无特殊说明，则以合约张数为单位。

参数```price```设置为```-1```时用于下市价单，此功能需要交易所的下单接口支持市价单。以市价单方式对加密货币现货下买单时，下单量参数```amount```为以计价币计价的金额数量。以市价单方式对加密货币期货合约下单时，下单量参数```amount```的单位为合约张数。实盘时，有少数加密货币交易所不支持市价单接口。个别现货交易所市价单买单的下单量为交易币数量，具体请查看「用户指南」中的**交易所特殊说明**。

如使用较旧版本的托管者，```exchange.Buy()```函数返回的订单```Id```可能与当前文档中描述的返回值订单```Id```有所差别。

需要注意，以下三家交易所的下单接口较为特殊。对于现货市价单的买单，其下单量为币数，而非金额。

  - ```AscendEx```

  - ```BitMEX```

  - ```Bitfinex```

See also: `exchange.Sell`, `exchange.SetContractType`, `exchange.SetDirection`, `exchange.IO`（API限流控制，Buy函数受CreateOrder限流设置影响）

#### exchange.Sell

```
exchange.Sell(price, amount)
exchange.Sell(price, amount, ...args)
```

```exchange.Sell()```函数用于下达卖单。

Parameters:

- `price` (number, required): ```price```参数用于设置订单价格。
- `amount` (number, required): ```amount```参数用于设置下单量。
- `arg` (string / number / bool / object / array / any (平台支持的任意类型), optional): 扩展参数，用于向这条下单日志中输出附带信息，```arg```参数可以传入多个。

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

加密货币期货合约下单时必须注意交易方向是否设置正确，如果交易方向与交易函数不匹配将会报错：

```log
direction is sell, invalid order type Buy
direction is buy, invalid order type Sell
direction is closebuy, invalid order type Buy
direction is closesell, invalid order type Sell
```

```javascript
// 以下为错误调用
function main() {
    exchange.SetContractType("quarter")

    // 设置做空方向
    exchange.SetDirection("sell")
    // 下买单，会报错，做空只能卖出
    var id = exchange.Buy(50, 1)

    // 设置做多方向
    exchange.SetDirection("buy")
    // 下卖单，会报错，做多只能买入
    var id2 = exchange.Sell(60, 1)

    // 设置平多方向
    exchange.SetDirection("closebuy")
    // 下买单，会报错，平多只能卖出
    var id3 = exchange.Buy(-1, 1)

    // 设置平空方向
    exchange.SetDirection("closesell")
    // 下卖单,会报错,平空只能买入
    var id4 = exchange.Sell(-1, 1)
}
```

```python
# 以下为错误调用
def main():
    exchange.SetContractType("quarter")
    exchange.SetDirection("sell")
    id = exchange.Buy(50, 1)
    exchange.SetDirection("buy")
    id2 = exchange.Sell(60, 1)
    exchange.SetDirection("closebuy")
    id3 = exchange.Buy(-1, 1)
    exchange.SetDirection("closesell")
    id4 = exchange.Sell(-1, 1)
```

```rust
// 以下为错误调用
fn main() {
    let _ = exchange.SetContractType("quarter");

    // 设置做空方向
    let _ = exchange.SetDirection("sell");
    // 下买单，会报错，做空只能卖出
    let id = exchange.Buy(50, 1);

    // 设置做多方向
    let _ = exchange.SetDirection("buy");
    // 下卖单，会报错，做多只能买入
    let id2 = exchange.Sell(60, 1);

    // 设置平多方向
    let _ = exchange.SetDirection("closebuy");
    // 下买单，会报错，平多只能卖出
    let id3 = exchange.Buy(-1, 1);

    // 设置平空方向
    let _ = exchange.SetDirection("closesell");
    // 下卖单,会报错,平空只能买入
    let id4 = exchange.Sell(-1, 1);
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

期货合约下单时必须注意交易方向是否设置正确，如果交易方向与交易函数不匹配将会报错。加密货币期货合约交易所的下单量如无特殊说明则以合约张数为单位。

参数```price```设置为```-1```时用于下达市价单，需要交易所的下单接口支持市价单。以市价单方式交易加密货币现货时，下卖单时，下单量参数```amount```以交易币为单位。以市价单方式交易加密货币期货合约时，下单量参数```amount```以合约张数为单位。实盘时，有少数加密货币交易所不支持市价单接口。

如使用较旧版本的托管者，```exchange.Sell()```函数返回的订单```Id```可能与当前文档中描述的返回值订单```Id```有所差别。

See also: `exchange.Buy`, `exchange.SetContractType`, `exchange.SetDirection`, `exchange.IO`（API限流控制，Sell函数受CreateOrder限流设置影响）

#### exchange.CreateOrder

```
exchange.CreateOrder(symbol, side, price, amount)
exchange.CreateOrder(symbol, side, price, amount, ...args)
```

```exchange.CreateOrder()```函数用于下单。

Parameters:

- `symbol` (string, required): 参数```symbol```用于指定订单对应的交易对、合约代码。

当调用```exchange.CreateOrder(symbol, side, price, amount)```函数下单时，若```exchange```为现货交易所对象，且订单的计价币种为USDT、交易币种为BTC，则参数```symbol```为：```"BTC_USDT"```，采用FMZ平台定义的交易对格式。

当调用```exchange.CreateOrder(symbol, side, price, amount)```函数下单时，若```exchange```为期货交易所对象，且订单为BTC的U本位永续合约订单，则参数```symbol```为：```"BTC_USDT.swap"```，采用FMZ平台定义的**交易对**与**合约代码**组合的格式，两者之间以字符"."分隔。

当调用```exchange.CreateOrder(symbol, side, price, amount)```函数下单时，若```exchange```为期货交易所对象，且订单为BTC的U本位期权合约订单，则参数```symbol```为：```"BTC_USDT.BTC-240108-40000-C"```（以币安期权BTC-240108-40000-C为例），采用FMZ平台定义的**交易对**与交易所定义的具体期权合约代码组合的格式，两者之间以字符"."分隔。
- `side` (string, required): 参数```side```用于指定订单的交易方向。

对于现货交易所对象，```side```参数的可选值为：```buy```、```sell```。其中```buy```表示买入，```sell```表示卖出。

对于期货交易所对象，```side```参数的可选值为：```buy```、```closebuy```、```sell```、```closesell```。其中```buy```表示开多仓，```closebuy```表示平多仓，```sell```表示开空仓，```closesell```表示平空仓。

**支持附加参数（option）**：可以通过```side```参数传递附加参数，格式为：```"side;{JSON对象}"```或```"side;key=value&key=value"```。

例如：```'buy;{"type":"TRAILING_STOP_MARKET","activationPrice":"2300"}'```或```"buy;type=TRAILING_STOP_MARKET&activationPrice=2300"```。

附加参数用于传递交易所特定的参数（如订单类型、生效规则等），具体支持的参数取决于交易所API。
- `price` (number, required): 参数```price```用于设置订单的价格。当价格为-1时，表示该订单为市价单。
- `amount` (number, required): 参数```amount```用于设置订单的下单量。需要注意，当订单为**现货市价买单**时，下单量表示买入金额；个别现货交易所的市价买单下单量为交易币数量，具体请查看「用户指南」中的**交易所特殊说明**。对于期货交易所对象，使用```CreateOrder()```/```Buy()```/```Sell()```函数下单时，如无特殊说明，下单量参数```amount```均以合约张数为单位。
- `arg` (string / number / bool / object / array / any (平台支持的任意类型), optional): 扩展参数，用于将附带信息输出到本次下单日志中，```arg```参数可以传入多个。

Returns (string / 空值): 下单成功时返回订单Id，下单失败时返回空值。FMZ平台的订单`Order`结构的属性```Id```由交易所品种代码和交易所原始订单Id组成，两者以英文逗号分隔。例如OKX交易所现货交易对```ETH_USDT```订单的属性```Id```格式为：```ETH-USDT,1547130415509278720```。

调用```exchange.CreateOrder(symbol, side, price, amount)```函数下单时，返回值订单```Id```与订单`Order`结构的```Id```属性一致。

现货交易所对象与期货交易所对象均通过调用```exchange.CreateOrder()```函数进行下单。

```javascript
function main() {
    var id = exchange.CreateOrder("BTC_USDT", "buy", 60000, 0.01)           // 现货交易所对象下单，交易BTC_USDT币币交易对
    // var id = exchange.CreateOrder("BTC_USDT.swap", "buy", 60000, 0.01)   // 期货交易所对象下单，交易BTC的U本位永续合约
    Log("Order Id:", id)
}
```

```python
def main():
    id = exchange.CreateOrder("BTC_USDT", "buy", 60000, 0.01)          # 现货交易所对象下单，交易BTC_USDT币币交易对
    # id = exchange.CreateOrder("BTC_USDT.swap", "buy", 60000, 0.01)   # 期货交易所对象下单，交易BTC的U本位永续合约
    Log("Order Id:", id)
```

```rust
fn main() {
    let id = exchange.CreateOrder("BTC_USDT", "buy", 60000, 0.01);           // 现货交易所对象下单，交易BTC_USDT币币交易对
    // let id = exchange.CreateOrder("BTC_USDT.swap", "buy", 60000, 0.01);   // 期货交易所对象下单，交易BTC的U本位永续合约
    Log!("Order Id:", id);
}
```

通过附加参数（option）下单，用于传递交易所的特定参数。

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

支持通过```side```参数传递附加参数（option），用于指定交易所特定的参数。附加参数需与```side```参数合并传入，格式为```"side;{JSON对象}"```（推荐）或```"side;key=value&key=value"```（URL编码格式）。例如：```"buy;{\"type\":\"TRAILING_STOP_MARKET\"}"```。

不同交易所支持的option参数各不相同，具体支持的参数以交易所API文档为准。常见参数包括：订单类型（type）、生效规则（timeInForce）、触发价格（activationPrice）、回调比率（callbackRate）等。

使用option参数时，仍需提供```price```和```amount```参数。若某些参数已通过option传递，则这些基础参数可能会被option中的对应参数覆盖，具体行为取决于交易所API的实现。

Uniswap交易所（链上兑换）：下单即在链上立即兑换，不会挂单等待。限价单的```price```是最差可接受成交价，写入链上交易强制执行，当前报价已经达不到时直接报错、不发交易；市价单（```price```为-1）按```exchange.IO("slippage", ...)```设置的滑点保护。市价买入时```amount```为要花费的计价币数量，其他情况为基础币数量。订单ID是交易哈希，撤单是发送同nonce的替换交易，交易已上链则无法撤单。附加参数支持```slippage```（本单滑点）和```route```（```v2```、```v3```、```hop```、```direct```，限定路径类型），例如```"sell;{\"route\":\"v2\"}"```。

See also: `exchange.Buy`, `exchange.Sell`,
  `exchange.ModifyOrder`

#### exchange.ModifyOrder

```
exchange.ModifyOrder(orderId, side, price, amount)
```

```exchange.ModifyOrder()```函数用于修改现有的普通订单，可修改订单的价格和数量。该函数支持通过附加参数修改订单的其它属性（具体取决于交易所 API 的支持情况）。

Parameters:

- `orderId` (string, required): 参数```orderId```用于指定待修改的原订单 ID。订单 ID 的格式与`exchange.CreateOrder`函数返回的订单 ID 一致，由交易所品种代码和交易所原始订单 ID 组成，两者以英文逗号分隔。例如：```"ETH-USDT,1547130415509278720"```。
- `side` (string, required): 参数```side```用于指定订单的交易方向。

对于现货交易所对象，```side```参数的可选值为：```buy```、```sell```。其中```buy```表示买入，```sell```表示卖出。

对于期货交易所对象，```side```参数的可选值为：```buy```、```closebuy```、```sell```、```closesell```。其中```buy```表示开多仓，```closebuy```表示平多仓，```sell```表示开空仓，```closesell```表示平空仓。

**支持附加参数（option）**：可通过```side```参数传递附加参数，格式为```"side;{JSON对象}"```或```"side;key=value&key=value"```。

例如：```"buy;{\"priceMatch\":\"QUEUE_20\"}"```或```"buy;priceMatch=QUEUE_20"```。

附加参数用于修改订单的其它属性（如价格匹配模式等），具体支持的参数取决于交易所 API。
- `price` (number, required): 参数```price```用于设置订单的新价格。当价格为 -1 时表示不修改价格，或根据交易所 API 的实现，可能转为市价单。
- `amount` (number, required): 参数```amount```用于设置订单的新下单量。当数量为 -1 时表示不修改数量。需要注意的是，当订单为**现货市价买单**时，下单量表示买入金额；个别现货交易所的市价买单，其下单量为交易币的数量。

Returns (string / 空值): 修改订单成功时返回订单 ID，修改失败时返回空值。返回的订单 ID 可能与原订单 ID 相同，也可能不同，这取决于交易所 API 的实现方式。某些交易所在修改订单后会返回新的订单 ID，而有些交易所则保持订单 ID 不变。

修改普通订单的价格和数量。

```javascript
function main() {
    // 创建一个限价买单
    var id = exchange.CreateOrder("SOL_USDT.swap", "buy", 88, 1)
    Log("Original Order ID:", id)
    Sleep(2000)

    // 查询原始订单信息
    var order = exchange.GetOrder(id)
    Log("Original Order Info:", order)
    Sleep(1000)

    // 修改订单的价格和数量
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

    # 查询原始订单信息
    order = exchange.GetOrder(id)
    Log("Original Order Info:", order)
    Sleep(1000)

    # 修改订单的价格和数量
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

    // 查询原始订单信息
    let order = exchange.GetOrder(&id).unwrap();
    Log!("Original Order Info:", order);
    Sleep(1000);

    // 修改订单的价格和数量
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

    // 修改订单，并将价格匹配模式设置为 QUEUE_20
    // 通过 side 参数传递附加参数（JSON 格式）
    var option = {"priceMatch": "QUEUE_20"}
    var sideWithOption = "buy;" + JSON.stringify(option)

    var newId = exchange.ModifyOrder(id, sideWithOption, -1, 2)
    Log("Modified Order ID:", newId)
    Sleep(2000)

    // 查询修改后的订单信息
    var newOrder = exchange.GetOrder(newId)
    Log("Modified Order Info:", newOrder)

    // 撤销订单
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

    # 修改订单，并将价格匹配模式设置为 QUEUE_20
    # 通过 side 参数传递附加参数（JSON 格式）
    option = {"priceMatch": "QUEUE_20"}
    sideWithOption = "buy;" + json.dumps(option)

    newId = exchange.ModifyOrder(id, sideWithOption, -1, 2)
    Log("Modified Order ID:", newId)
    Sleep(2000)

    # 查询修改后的订单信息
    newOrder = exchange.GetOrder(newId)
    Log("Modified Order Info:", newOrder)

    # 撤销订单
    exchange.CancelOrder(newId)
```

```rust
fn main() {
    // 创建一个限价买单
    let id = exchange.CreateOrder("SOL_USDT.swap", "buy", 77, 1).unwrap();
    Log!("Original Order ID:", id);
    Sleep(2000);

    // 修改订单，并将价格匹配模式设置为 QUEUE_20
    // 通过 side 参数传递附加参数（JSON 格式）；Rust 不支持 JSON.stringify，因此直接使用原始字符串构造 JSON 文本
    let option = r#"{"priceMatch": "QUEUE_20"}"#;
    let sideWithOption = format!("buy;{}", option);

    let newId = exchange.ModifyOrder(&id, &sideWithOption, -1, 2).unwrap();
    Log!("Modified Order ID:", newId);
    Sleep(2000);

    // 查询修改后的订单信息
    let newOrder = exchange.GetOrder(&newId).unwrap();
    Log!("Modified Order Info:", newOrder);

    // 撤销订单
    let _ = exchange.CancelOrder(&newId);
}
```

```exchange.ModifyOrder()```函数返回的订单 ID 因交易所 API 的实现不同而可能有不同的行为。有些交易所 API 返回的订单 ID 会更新，有些则保持不变。建议使用返回的新订单 ID 进行后续操作。

```exchange.ModifyOrder()```函数不会依据交易所接口规则校验参数的有效性，而是将参数直接提交给交易所 API。传入无效参数时（如价格或数量为 -1），参数可能会被交易所忽略，订单将保持原有属性不变。

支持通过```side```参数传递附加参数（option），用于修改订单的其它属性。附加参数需与```side```参数合并后传入，格式为```"side;{JSON对象}"```（推荐）或```"side;key=value"```（URL 编码格式）。例如，修改价格匹配模式：```"buy;{\"priceMatch\":\"QUEUE_20\"}"```。

对于普通订单的市价单修改，需具体查看交易所 API 是否支持。有些交易所不支持对市价单进行修改操作。

修改订单时，订单的其它属性（如订单类型、持仓模式、账户模式、杠杆、订单生效规则等）通常会保留原订单的设置。如需修改这些属性，可通过附加参数（option）传入，前提是交易所 API 支持。

个别交易所 API 在未接收到价格参数时（price 为 -1 或 null），可能会将订单转为市价单。对于现货市价买单，需要注意其下单量单位可能是金额而非币数。

修改订单功能的支持情况取决于具体交易所，部分交易所可能不支持修改订单功能，或仅支持修改部分参数。使用前请查阅对应交易所的 API 文档。

See also: `exchange.CreateOrder`, `exchange.CancelOrder`, `exchange.GetOrder`, `exchange.GetOrders`

#### exchange.CancelOrder

```
exchange.CancelOrder(orderId)
exchange.CancelOrder(orderId, ...args)
```

```exchange.CancelOrder()```函数用于取消订单。FMZ平台的订单`Order`结构中，属性```Id```由交易所品种代码和交易所原始订单Id组成，两者之间以英文逗号分隔。例如，OKX交易所现货交易对```ETH_USDT```的订单，其属性```Id```的格式为：```ETH-USDT,1547130415509278720```。

调用```exchange.CancelOrder()```函数撤销订单时，传入的参数```orderId```与订单`Order`结构的```Id```属性一致。

Parameters:

- `orderId` (string, required): 参数```orderId```用于指定所要取消的订单。
- `arg` (string / number / bool / object / array / any (平台支持的任意类型), optional): 扩展参数，用于将附带信息输出到本条撤单日志中；```arg```参数可以传入多个。

Returns (bool): ```exchange.CancelOrder()```函数返回真值（例如```true```）表示取消订单请求发送成功，返回假值（例如```false```）表示取消订单请求发送失败。返回值仅代表请求发送成功或失败；若要判断交易所是否已取消订单，可以调用```exchange.GetOrders()```进行判断。

撤销订单。

```javascript
function main(){
    var id = exchange.Sell(99999, 1)
    exchange.CancelOrder(id)
}
```

```python
def main():
    id = exchange.Sell(99999, 1)
    exchange.CancelOrder(id)
```

```rust
fn main() {
    let id = exchange.Sell(99999, 1).unwrap();
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

See also: `exchange.Buy`, `exchange.Sell`, `exchange.GetOrders`, `exchange.ModifyOrder`

#### exchange.GetOrder

```
exchange.GetOrder(orderId)
```

```exchange.GetOrder()```函数用于获取订单信息。

Parameters:

- `orderId` (string, required): ```orderId```参数用于指定要查询的订单。FMZ平台订单`Order`结构的```Id```属性由交易所品种代码和交易所原始订单Id组成，以英文逗号分隔。例如，OKX交易所现货交易对```ETH_USDT```订单的```Id```属性格式为：```ETH-USDT,1547130415509278720```。

调用```exchange.GetOrder()```函数查询订单时，传入的参数```orderId```与订单`Order`结构的```Id```属性一致。

Returns (`Order` / 空值): 根据订单号查询订单详情，查询成功时返回`Order`结构，查询失败时返回空值。

```javascript
function main(){
    var id = exchange.Sell(1000, 1)
    // 参数id为订单号码，需填入你想要查询的订单的号码
    var order = exchange.GetOrder(id)
    Log("Id:", order.Id, "Price:", order.Price, "Amount:", order.Amount, "DealAmount:",
        order.DealAmount, "Status:", order.Status, "Type:", order.Type)
}
```

```python
def main():
    id = exchange.Sell(1000, 1)
    order = exchange.GetOrder(id)
    Log("Id:", order["Id"], "Price:", order["Price"], "Amount:", order["Amount"], "DealAmount:",
        order["DealAmount"], "Status:", order["Status"], "Type:", order["Type"])
```

```rust
fn main() {
    let id = exchange.Sell(1000, 1).unwrap();
    // 参数id为订单号码，需填入你想要查询的订单的号码
    let order = exchange.GetOrder(&id).unwrap();
    Log!("Id:", order.Id, "Price:", order.Price, "Amount:", order.Amount, "DealAmount:",
        order.DealAmount, "Status:", order.Status, "Type:", order.Type);
}
```

部分交易所不支持```exchange.GetOrder()```函数。返回值`Order`结构中的```AvgPrice```属性为成交均价，部分交易所不支持该字段，若不支持则将其设置为0。

如果使用较旧版本的托管者，```exchange.GetOrder()```函数的参数```orderId```可能与当前文档中描述的```orderId```存在差异。

不支持```exchange.GetOrder()```函数的交易所：

  | 函数名 | 不支持的现货交易所 | 不支持的期货交易所 |
  | - | - | - |
  | GetOrder | Zaif / Coincheck / Bitstamp | -- |

See also: `Order`, `exchange.GetOrders`, `exchange.GetHistoryOrders`, `exchange.ModifyOrder`

#### exchange.GetOrders

```
exchange.GetOrders()
exchange.GetOrders(symbol)
```

```exchange.GetOrders()```函数用于获取当前未完成的订单。

Parameters:

- `symbol` (string, optional): 参数```symbol```用于指定所要查询的**交易品种**或**交易品种范围**。

对于现货交易所对象，若不传入```symbol```参数，则请求所有现货品种的未完成订单数据。

对于期货交易所对象，若不传入```symbol```参数，则默认以当前交易对、合约代码所在的维度范围，请求该范围内所有品种的未完成订单数据。

Returns (`Order`数组 / 空值): ```exchange.GetOrders()```函数请求数据成功时返回`Order`结构数组，请求数据失败时返回空值。

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

在```GetOrders```函数中，symbol参数的使用场景归纳如下：

| 交易所对象分类 | symbol参数 | 查询范围 | 备注 |
| - | - | - | - |
| 现货 | 不传symbol参数 | 查询所有现货交易对 | 适用于所有调用场景；若交易所接口不支持，则报错返回空值，以下不再赘述 |
| 现货 | 指定交易品种，symbol参数为："BTC_USDT" | 查询指定的BTC_USDT交易对 | 对于现货交易所对象，参数symbol的格式为："BTC_USDT" |
| 期货 | 不传symbol参数 | 查询当前交易对、合约代码维度范围内的所有交易品种 | 假如当前交易对为BTC_USDT，合约代码为swap，即查询所有USDT本位永续合约。等价于调用```GetOrders("USDT.swap")``` |
| 期货 | 指定交易品种，symbol参数为："BTC_USDT.swap" | 查询指定的BTC的USDT本位永续合约 | 对于期货交易所对象，参数symbol的格式为：FMZ平台定义的**交易对**与**合约代码**的组合，以字符```"."```间隔。 |
| 期货 | 指定交易品种范围，symbol参数为："USDT.swap" | 查询所有USDT本位永续合约 | - |
| 支持期权的期货交易所 | 不传symbol参数 | 查询当前交易对维度范围内的所有期权合约 | 假如当前交易对为BTC_USDT，且合约设置为期权合约，例如币安期权合约：BTC-240108-40000-C |
| 支持期权的期货交易所 | 指定具体交易品种 | 查询指定的期权合约 | 例如对于币安期货交易所，symbol参数为：BTC_USDT.BTC-240108-40000-C |
| 支持期权的期货交易所 | 指定交易品种范围，symbol参数为："USDT.option" | 查询所有USDT本位期权合约 | - |

在```GetOrders```函数中，期货交易所对象的查询维度范围归纳如下：

| symbol参数 | 请求范围定义 | 备注 |
| - | - | - |
| USDT.swap          | USDT本位永续合约范围。  | 对于交易所API接口不支持的维度，调用时会报错返回空值。 |
| USDT.futures       | USDT本位交割合约范围。  | - |
| USD.swap           | 币本位永续合约范围。    | - |
| USD.futures        | 币本位交割合约范围。    | - |
| USDT.option        | USDT本位期权合约范围。  | - |
| USD.option         | 币本位期权合约范围。    | - |
| USDT.futures_combo | 差价组合合约范围。      | Futures_Deribit交易所 |
| USD.futures_ff     | 混合保证金交割合约范围。 | Futures_Kraken交易所 |
| USD.swap_pf        | 混合保证金永续合约范围。 | Futures_Kraken交易所 |

当交易所对象```exchange```所代表的账户在**查询范围内**或**指定的交易品种**上没有挂单（即处于未成交状态的活动订单）时，调用该函数将返回空数组，即：```[]```。

以下交易所查询当前未完成订单的接口必须传入品种参数。使用这些交易所调用GetOrders函数时，若未传入symbol参数，则仅请求当前品种的未完成订单，而非所有品种的未完成订单（因为交易所接口不支持）。

Zaif、MEXC、LBank、Korbit、Coinw、BitMart、Bithumb、BitFlyer、BigONE。

不支持```exchange.GetOrders()```函数的交易所：

| 函数名 | 不支持的现货交易所 | 不支持的期货交易所 |
| - | - | - |
| GetOrders | -- | Futures_Bibox |

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

```exchange.GetHistoryOrders()```函数用于获取当前交易对、合约的历史订单，并支持指定具体的交易品种。

Parameters:

- `symbol` (string, optional): ```symbol```参数用于指定交易品种。以```BTC_USDT```交易对为例：当```exchange```为现货交易所对象时，```symbol```参数格式为```BTC_USDT```；当```exchange```为期货交易所对象时，以永续合约为例，```symbol```参数格式为```BTC_USDT.swap```。

如果查询的是期权合约的订单数据，参数```symbol```需设置为```"BTC_USDT.BTC-240108-40000-C"```（以币安期权BTC-240108-40000-C为例），其格式为FMZ平台定义的**交易对**与交易所定义的具体期权合约代码的组合，两者之间以字符"."间隔。若不传该参数，则默认请求当前设置的交易对、合约代码的订单数据。
- `since` (number, optional): ```since```参数用于指定查询的起始时间戳，单位为毫秒。
- `limit` (number, optional): ```limit```参数用于指定查询的订单数量。

Returns (`Order`数组 / 空值): ```exchange.GetHistoryOrders()```函数在请求数据成功时返回`Order`结构数组，请求数据失败时返回空值。

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

不支持```exchange.GetHistoryOrders()```函数的交易所：

| 函数名 | 不支持的现货交易所 | 不支持的期货交易所 |
| - | - | - |
| GetHistoryOrders | Zaif / Upbit / Coincheck / Bitstamp / Bithumb / BitFlyer / BigONE / Uniswap | Futures_Bibox / Futures_ApolloX |

See also: `Order`, `exchange.GetOrder`, `exchange.GetOrders`

#### exchange.CreateConditionOrder

```
exchange.CreateConditionOrder(symbol, side, amount, condition)
exchange.CreateConditionOrder(symbol, side, amount, condition, ...args)
```

```exchange.CreateConditionOrder()```函数用于创建条件单。条件单是一种在满足特定触发条件时自动执行的订单类型。

Parameters:

- `symbol` (string, required): 参数```symbol```用于指定条件单对应的交易对或合约代码。

当调用```exchange.CreateConditionOrder(symbol, side, amount, condition)```函数下条件单时，若```exchange```为现货交易所对象，且订单的计价币种为USDT、交易币种为BTC，则参数```symbol```为：```"BTC_USDT"```，其格式为FMZ平台定义的交易对格式。

当调用```exchange.CreateConditionOrder(symbol, side, amount, condition)```函数下条件单时，若```exchange```为期货交易所对象，且订单为BTC的U本位永续合约订单，则参数```symbol```为：```"BTC_USDT.swap"```，其格式为FMZ平台定义的**交易对**与**合约代码**的组合，两者之间以字符"."分隔。

当调用```exchange.CreateConditionOrder(symbol, side, amount, condition)```函数下条件单时，若```exchange```为期货交易所对象，且订单为BTC的U本位期权合约订单，则参数```symbol```为：```"BTC_USDT.BTC-240108-40000-C"```（以币安期权BTC-240108-40000-C为例），其格式为FMZ平台定义的**交易对**与交易所定义的具体期权合约代码的组合，两者之间以字符"."分隔。
- `side` (string, required): 参数```side```用于指定条件单的交易方向。

对于现货交易所对象，```side```参数的可选值为：```buy```、```sell```。```buy```表示买入，```sell```表示卖出。

对于期货交易所对象，```side```参数的可选值为：```buy```、```closebuy```、```sell```、```closesell```。其中```buy```表示开多仓，```closebuy```表示平多仓，```sell```表示开空仓，```closesell```表示平空仓。

**支持附加参数（option）**：可以通过```side```参数传递附加参数，格式为：```"side;{JSON对象}"```或```"side;key=value&key=value"```。

例如：```"buy;{\"type\":\"TRAILING_STOP_MARKET\",\"activatePrice\":\"300\"}"```或```"buy;type=TRAILING_STOP_MARKET&activatePrice=300"```。

附加参数用于传递交易所特定的参数（如订单类型、生效规则等），具体支持的参数取决于交易所API。
- `amount` (number, required): 参数```amount```用于设置条件单的下单量。需要注意的是，当订单为**现货市价买单**时，下单量表示买入金额；个别现货交易所的市价买单下单量为交易币数量，具体请查看「用户指南」中的**交易所特殊说明**。对于期货交易所对象，下单量参数```amount```均以合约张数为单位。
- `condition` (object, required): 参数```condition```是一个对象，用于设置条件单的触发条件和执行价格。该对象的结构参考`Condition`结构，包含以下属性：

- ```ConditionType```（number）：条件类型，参考`ORDER_CONDITION_TYPE_OCO`、`ORDER_CONDITION_TYPE_TP`、`ORDER_CONDITION_TYPE_SL`、`ORDER_CONDITION_TYPE_GENERIC`。

- ```TpTriggerPrice```（number）：止盈触发价格。

- ```TpOrderPrice```（number）：止盈执行价格，-1表示市价单。

- ```SlTriggerPrice```（number）：止损触发价格。

- ```SlOrderPrice```（number）：止损执行价格，-1表示市价单。
- `arg` (string / number / bool / object / array / any (平台支持的任意类型), optional): 扩展参数，用于将附带信息输出到该条条件单的日志中，```arg```参数可以传入多个。

Returns (string / 空值): 创建条件单成功时返回条件单Id，创建失败时返回空值。条件单Id的格式与普通订单Id类似，由交易所品种代码和交易所原始条件单Id组成，两者之间以英文逗号分隔。

创建止盈单（TP）：当价格上涨至目标价位时自动卖出。

```javascript
function main() {
    // 创建止盈单：当BTC_USDT价格上涨至65000时，以65000的价格卖出0.01个BTC
    var condition = {
        ConditionType: ORDER_CONDITION_TYPE_TP,  // 止盈单
        TpTriggerPrice: 65000,   // 触发价格
        TpOrderPrice: 65000      // 执行价格，也可设置为-1表示市价单
    }
    var id = exchange.CreateConditionOrder("BTC_USDT", "sell", 0.01, condition)
    Log("TP order Id:", id)
}
```

```python
def main():
    # 创建止盈单：当BTC_USDT价格上涨至65000时，以65000的价格卖出0.01个BTC
    condition = {
        "ConditionType": ORDER_CONDITION_TYPE_TP,  # 止盈单
        "TpTriggerPrice": 65000,   # 触发价格
        "TpOrderPrice": 65000      # 执行价格，也可设置为-1表示市价单
    }
    id = exchange.CreateConditionOrder("BTC_USDT", "sell", 0.01, condition)
    Log("TP order Id:", id)
```

```rust
fn main() {
    // 创建止盈单：当BTC_USDT价格上涨至65000时，以65000的价格卖出0.01个BTC
    let condition = OrderCondition {
        ConditionType: ORDER_CONDITION_TYPE_TP,  // 止盈单
        TpTriggerPrice: 65000.0,   // 触发价格
        TpOrderPrice: 65000.0,     // 执行价格，也可设置为-1表示市价单
        ..Default::default()
    };
    let id = exchange.CreateConditionOrder("BTC_USDT", "sell", 0.01, &condition);
    Log!("TP order Id:", id);
}
```

创建止损单（SL）：当价格下跌至止损触发价位时，自动以设定方式卖出。

```javascript
function main() {
    // 创建止损单：当BTC_USDT价格下跌至58000时，以市价卖出0.01个BTC
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
    # 创建止损单：当BTC_USDT价格下跌至58000时，以市价卖出0.01个BTC
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
    // 创建止损单：当BTC_USDT价格下跌至58000时，以市价卖出0.01个BTC
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

创建 OCO 订单：同时设置止盈和止损，任意一个触发后，另一个将自动取消。

```javascript
function main() {
    // 创建 OCO 订单：止盈价 65000，止损价 58000
    var condition = {
        ConditionType: ORDER_CONDITION_TYPE_OCO,  // OCO 订单
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
    # 创建 OCO 订单：止盈价 65000，止损价 58000
    condition = {
        "ConditionType": ORDER_CONDITION_TYPE_OCO,  # OCO 订单
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
    // 创建 OCO 订单：止盈价 65000，止损价 58000
    let condition = OrderCondition {
        ConditionType: ORDER_CONDITION_TYPE_OCO,  // OCO 订单
        TpTriggerPrice: 65000.0,   // 止盈触发价格
        TpOrderPrice: 65000.0,     // 止盈执行价格
        SlTriggerPrice: 58000.0,   // 止损触发价格
        SlOrderPrice: 58000.0      // 止损执行价格
    };
    let id = exchange.CreateConditionOrder("BTC_USDT", "sell", 0.01, &condition);
    Log!("OCO order Id:", id);
}
```

使用附加参数（option）创建条件单，用于传递交易所特定的参数。

```javascript
function main() {
    // 以 JSON 格式传递 option 参数
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
    # 以 JSON 格式传递 option 参数
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
    // 以 JSON 格式传递 option 参数（Rust 无 JSON 序列化功能，此处直接使用原始字符串构造）
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

条件单功能的支持情况取决于具体交易所，部分交易所可能不支持条件单功能。

条件单在触发前不会占用账户资金，仅在触发后才会实际下单并占用资金。

不同交易所对条件单的支持程度及具体参数可能有所差异，使用前请查阅对应交易所的 API 文档。

支持通过```side```参数传递附加参数（option），用于传递交易所特定的参数。附加参数需与```side```参数合并传入，格式为```"side;{JSON对象}"```（推荐）或```"side;key=value&key=value"```（URL 编码格式）。例如：```"buy;{\"type\":\"TRAILING_STOP_MARKET\"}"```。

不同交易所支持的 option 参数各不相同，具体支持的参数取决于交易所 API 文档。常见参数包括：订单类型（type）、生效规则（timeInForce）、触发价格（activatePrice）、回调比率（callbackRate）等。

使用 option 参数时，仍需提供```amount```和```condition```参数。如果交易所 API 中的某些参数已通过 option 传递，这些基础参数可能会被 option 中的对应参数覆盖，具体行为取决于交易所 API 的实现。

See also: `Condition`, `exchange.CancelConditionOrder`, `exchange.GetConditionOrder`, `exchange.GetConditionOrders`, `exchange.ModifyConditionOrder`

#### exchange.ModifyConditionOrder

```
exchange.ModifyConditionOrder(orderId, side, amount, condition)
```

```exchange.ModifyConditionOrder()```函数用于修改现有的条件单，可修改条件单的下单量、触发条件和执行价格。支持通过附加参数修改条件单的其它属性（具体取决于交易所API的支持情况）。

Parameters:

- `orderId` (string, required): 参数```orderId```用于指定待修改的原条件单ID。条件单ID的格式与`exchange.CreateConditionOrder`函数返回的条件单ID一致，由交易所品种代码和交易所原始条件单ID组成，两者以英文逗号分隔。例如：```"SOL-USDT-SWAP,3196255845130256384"```。
- `side` (string, required): 参数```side```用于指定条件单的交易方向。
对于现货交易所对象，```side```参数的可选值为：```buy```、```sell```。```buy```表示买入，```sell```表示卖出。
对于期货交易所对象，```side```参数的可选值为：```buy```、```closebuy```、```sell```、```closesell```。```buy```表示开多仓，```closebuy```表示平多仓，```sell```表示开空仓，```closesell```表示平空仓。

**支持附加参数（option）**：可以通过```side```参数传递附加参数，格式为：```"side;{JSON对象}"```或```"side;key=value&key=value"```。
例如：```"buy;{\"newTpTriggerPxType\":\"index\"}"```或```"buy;newTpTriggerPxType=index"```。
附加参数用于修改条件单的其它属性（如触发价格类型等），具体支持的参数取决于交易所API。
- `amount` (number, required): 参数```amount```用于设置条件单的新下单量。当数量为-1时表示不修改下单量。对于期货交易所对象，下单量参数```amount```均以合约张数为单位。
- `condition` (object, required): 参数```condition```是一个对象，用于设置条件单的新触发条件和执行价格。该对象的结构参考`Condition`结构，包含以下属性：
- ```ConditionType```（number）：条件类型，参考`ORDER_CONDITION_TYPE_OCO`、`ORDER_CONDITION_TYPE_TP`、`ORDER_CONDITION_TYPE_SL`、`ORDER_CONDITION_TYPE_GENERIC`。
- ```TpTriggerPrice```（number）：止盈触发价格。
- ```TpOrderPrice```（number）：止盈执行价格，-1表示市价单。
- ```SlTriggerPrice```（number）：止损触发价格。
- ```SlOrderPrice```（number）：止损执行价格，-1表示市价单。

Returns (string / 空值): 修改条件单成功时返回条件单ID，修改失败时返回空值。返回的条件单ID可能与原条件单ID相同，也可能不同，这取决于交易所API的具体实现方式。某些交易所在修改条件单后会返回新的条件单ID，而有些交易所则保持条件单ID不变。

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

    // 查询原始条件单信息
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

    # 查询原始条件单信息
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

    // 查询原始条件单信息
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

    // 修改条件单，并将触发价格类型设置为指数价格（index）
    // 通过 side 参数传递附加参数（JSON 格式）
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

    # 修改条件单，并将触发价格类型设置为指数价格（index）
    # 通过 side 参数传递附加参数（JSON 格式）
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

    // 修改条件单，并将触发价格类型设置为指数价格（index）
    // 通过 side 参数传递附加参数（JSON 格式；Rust 无 JSON 序列化，故直接使用原始字符串构造）
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

```exchange.ModifyConditionOrder()```函数返回的条件单ID因交易所API实现的不同而可能表现出不同行为。有些交易所API返回的条件单ID会更新，有些则保持不变。建议使用返回的新条件单ID进行后续操作。

```exchange.ModifyConditionOrder()```函数不会依据交易所接口规则校验参数的有效性，而是将参数直接提交给交易所API。传入无效参数时（如数量为-1），该参数可能会被交易所忽略，条件单保持原有属性不变。

支持通过```side```参数传递附加参数（option），用于修改条件单的其它属性。附加参数需要与```side```参数合并传入，格式为```"side;{JSON对象}"```（推荐）或```"side;key=value"```（URL编码格式）。例如修改触发价格类型：```"buy;{\"newTpTriggerPxType\":\"index\"}"```。

对于条件单的市价单修改，需要具体查看交易所API是否支持。将```condition```参数中的```TpOrderPrice```或```SlOrderPrice```设置为-1表示市价单。

修改条件单时，条件单的其它属性（如条件类型、持仓模式、账户模式、杠杆等）通常会保留原条件单的设置。如需修改这些属性，可以通过附加参数（option）传入，前提是交易所API支持。

可以通过附加参数修改触发价格类型，例如将触发价格类型从最新价（last）修改为指数价格（index）或标记价格（mark）。具体的参数名称和支持情况取决于交易所API文档。

修改条件单功能的支持情况取决于具体交易所，部分交易所可能不支持修改条件单功能，或仅支持修改部分参数。使用前请查阅对应交易所的API文档。

See also: `Condition`, `exchange.CreateConditionOrder`, `exchange.CancelConditionOrder`, `exchange.GetConditionOrder`, `exchange.GetConditionOrders`

#### exchange.CancelConditionOrder

```
exchange.CancelConditionOrder(conditionOrderId)
exchange.CancelConditionOrder(conditionOrderId, ...args)
```

```exchange.CancelConditionOrder()```函数用于取消条件单。条件单Id的格式与普通订单Id类似，由交易所品种代码和交易所原始条件单Id组成，两者以英文逗号分隔。

调用```exchange.CancelConditionOrder()```函数撤销条件单时，传入的```conditionOrderId```参数与条件单结构的```Id```属性一致。

Parameters:

- `conditionOrderId` (string, required): ```conditionOrderId```参数用于指定要取消的条件单。
- `arg` (string / number / bool / object / array / any (平台支持的任意类型), optional): 扩展参数，用于向该条撤销条件单的日志中输出附带信息，```arg```参数可以传入多个。

Returns (bool): ```exchange.CancelConditionOrder()```函数返回真值（例如```true```）表示撤销条件单的请求发送成功，返回假值（例如```false```）表示撤销条件单的请求发送失败。

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

See also: `exchange.CreateConditionOrder`, `exchange.GetConditionOrder`, `exchange.GetConditionOrders`, `exchange.ModifyConditionOrder`

#### exchange.GetConditionOrder

```
exchange.GetConditionOrder(conditionOrderId)
```

```exchange.GetConditionOrder()```函数用于获取指定条件单的信息。

Parameters:

- `conditionOrderId` (string, required): ```conditionOrderId```参数用于指定所要查询的条件单。条件单Id的格式与普通订单Id类似，由交易所品种代码和交易所原始条件单Id组成，两者之间以英文逗号分隔。

调用```exchange.GetConditionOrder()```函数查询条件单时传入的```conditionOrderId```参数与条件单结构的```Id```属性一致。

Returns (`Order` / 空值): 根据条件单号查询条件单详情，查询成功时返回`Order`结构，查询失败时返回空值。

返回的Order结构中包含`Condition`字段，该字段包含条件单的详细配置信息（触发价格、执行价格、条件类型等）。

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

See also: `Order`, `exchange.GetConditionOrders`, `exchange.GetHistoryConditionOrders`, `exchange.ModifyConditionOrder`

#### exchange.GetConditionOrders

```
exchange.GetConditionOrders()
exchange.GetConditionOrders(symbol)
```

```exchange.GetConditionOrders()```函数用于获取未完成的条件单（尚未触发或尚未取消的条件单）。

Parameters:

- `symbol` (string, optional): 参数```symbol```用于指定所要查询的**交易品种**或**交易品种范围**。

对于现货交易所对象，未传入```symbol```参数时，将请求所有现货品种的未完成条件单数据。

对于期货交易所对象，未传入```symbol```参数时，默认按当前交易对、合约代码所在的维度范围，请求该范围内所有品种的未完成条件单数据。

Returns (`Order`数组 / 空值): ```exchange.GetConditionOrders()```函数在请求数据成功时返回`Order`结构数组，在请求数据失败时返回空值。

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

在```GetConditionOrders```函数中，symbol参数的使用场景归纳如下：
| 交易所对象分类 | symbol参数 | 查询范围 | 备注 |
| - | - | - | - |
| 现货 | 不传symbol参数 | 查询所有现货交易对 | 适用于所有调用场景；若交易所接口不支持则报错并返回空值，以下不再赘述 |
| 现货 | 指定交易品种，symbol参数为："BTC_USDT" | 查询指定的BTC_USDT交易对 | 对于现货交易所对象，参数symbol的格式为："BTC_USDT" |
| 期货 | 不传symbol参数 | 查询当前交易对、合约代码维度范围内的所有交易品种 | 假如当前交易对为BTC_USDT，合约代码为swap，即查询所有USDT本位永续合约。等价于调用```GetConditionOrders("USDT.swap")``` |
| 期货 | 指定交易品种，symbol参数为："BTC_USDT.swap" | 查询指定的BTC的USDT本位永续合约 | 对于期货交易所对象，参数symbol的格式为：FMZ平台定义的**交易对**与**合约代码**组合，两者以字符```"."```间隔。 |
| 期货 | 指定交易品种范围，symbol参数为："USDT.swap" | 查询所有USDT本位永续合约 | - |
| 支持期权的期货交易所 | 不传symbol参数 | 查询当前交易对维度范围内的所有期权合约 | 假如当前交易对为BTC_USDT，且合约设置为期权合约，例如币安期权合约：BTC-240108-40000-C |
| 支持期权的期货交易所 | 指定具体交易品种 | 查询指定的期权合约 | 例如对于币安期货交易所，symbol参数为：BTC_USDT.BTC-240108-40000-C |
| 支持期权的期货交易所 | 指定交易品种范围，symbol参数为："USDT.option" | 查询所有USDT本位期权合约 | - |

在```GetConditionOrders```函数中，期货交易所对象的查询维度范围归纳如下：
| symbol参数 | 请求范围定义 | 备注 |
| - | - | - |
| USDT.swap          | USDT本位永续合约范围。  | 对于交易所API接口不支持的维度，调用时会报错并返回空值。 |
| USDT.futures       | USDT本位交割合约范围。  | - |
| USD.swap           | 币本位永续合约范围。    | - |
| USD.futures        | 币本位交割合约范围。    | - |
| USDT.option        | USDT本位期权合约范围。  | - |
| USD.option         | 币本位期权合约范围。    | - |
| USDT.futures_combo | 差价组合合约范围。      | Futures_Deribit交易所 |
| USD.futures_ff     | 混合保证金交割合约范围。 | Futures_Kraken交易所 |
| USD.swap_pf        | 混合保证金永续合约范围。 | Futures_Kraken交易所 |

当交易所对象```exchange```所代表的账户在**查询范围内**或**指定的交易品种**上没有未完成条件单时，调用该函数将返回空数组，即：```[]```。

条件单功能的支持情况取决于具体交易所，部分交易所可能不支持条件单功能。

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

```exchange.GetHistoryConditionOrders()```函数用于获取当前交易对、合约的历史条件单（包括已触发、已取消、已过期的条件单），并支持指定具体的交易品种。

Parameters:

- `symbol` (string, optional): ```symbol```参数用于指定交易品种。以```BTC_USDT```交易对为例，当```exchange```为现货交易所对象时，```symbol```参数的格式为：```BTC_USDT```；如果为期货交易所对象，以永续合约为例，```symbol```参数的格式为：```BTC_USDT.swap```。

如果查询的是期权合约的条件单数据，则将```symbol```参数设置为```"BTC_USDT.BTC-240108-40000-C"```（以币安期权BTC-240108-40000-C为例），其格式为FMZ平台定义的**交易对**与交易所定义的具体期权合约代码的组合，两者之间以字符"."间隔。若不传入该参数，则默认请求当前所设置交易对、合约代码的条件单数据。
- `since` (number, optional): ```since```参数用于指定查询的起始时间戳，单位为毫秒。
- `limit` (number, optional): ```limit```参数用于指定查询的条件单数量。

Returns (`Order`数组 / 空值): ```exchange.GetHistoryConditionOrders()```函数在请求数据成功时返回`Order`结构数组，在请求数据失败时返回空值。

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

See also: `Order`, `exchange.GetConditionOrder`, `exchange.GetConditionOrders`

### Account

#### exchange.GetAccount

```
exchange.GetAccount()
```

```exchange.GetAccount()```函数用于请求交易所账户信息。```GetAccount()```函数是交易所对象`exchange`的成员函数，```exchange```对象的成员函数（方法）仅与```exchange```相关，后续文档不再赘述。

Returns (`Account` / 空值): 查询账户资产信息，查询成功时返回`Account`结构，查询失败时返回空值。

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

使用币安期货统一账户时，调用```exchange.GetAccount()```函数请求账户信息，封装的数据为所有资产折算为**USD**后的金额，显示在`Account`结构的```Balance```字段中。如需计算其它资产的折算金额，可将USD折算金额除以（待折算资产的）指数价格，再除以（待折算资产的）质押率即可算出。

See also: `Account`, `exchange.SetCurrency`, `exchange.SetContractType`

#### exchange.GetAssets

```
exchange.GetAssets()
```

```exchange.GetAssets```函数用于请求交易所账户的资产信息。

Returns (`Asset`数组 / 空值): ```exchange.GetAssets()```函数请求数据成功时返回`Asset`结构体数组，请求数据失败时返回空值。

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

期货交易所对象的```GetAssets()```函数返回当前交易对（币本位、USDT本位、USDC本位等）下的保证金资产。

See also: `Asset`

### Futures

#### exchange.SetContractType

```
exchange.SetContractType(symbol)
```

```exchange.SetContractType()```函数用于设置`exchange`交易所对象当前的合约代码。

Parameters:

- `symbol` (string, required): ```symbol```参数用于设置合约代码，可选值为：```"this_week"```、```"next_week"```、```"quarter"```、```"next_quarter"```、```"swap"```等。

加密货币期货合约中的**交割合约**代码如无特殊说明，一般包括：

- ```this_week```：当周合约。

- ```next_week```：次周合约。

- ```quarter```：当季合约。

- ```next_quarter```：次季合约。

加密货币期货合约中的**永续合约**代码如无特殊说明，一般包括：

- ```swap```：永续合约。

Returns (object): ```exchange.SetContractType()```函数返回一个结构体，其中包含当前合约代码对应的交易所合约代码。例如，在币安期货合约交易所中，当前合约代码为```quarter```时，该函数的返回值结构为：```{"InstrumentID":"BTCUSD_230630","instrument":"BTCUSD_230630"}```。

将当前合约设置为当周合约：

```javascript
function main() {
    // 设置为当周合约
    exchange.SetContractType("this_week")
}
```

```python
def main():
    exchange.SetContractType("this_week")
```

```rust
fn main() {
    // 设置为当周合约
    exchange.SetContractType("this_week").unwrap();
}
```

在设置以```USDT```作为保证金的合约时，需要在代码中切换交易对（也可以在添加交易所对象时直接设置交易对）：

```javascript
function main() {
    // 默认交易对为BTC_USD，设置合约为当周，合约为币本位合约
    exchange.SetContractType("this_week")
    Log("ticker:", exchange.GetTicker())

    // 切换交易对，然后设置合约，切换成USDT作为保证金的合约，区别于币本位合约
    exchange.IO("currency", "BTC_USDT")
    exchange.SetContractType("swap")
    Log("ticker:", exchange.GetTicker())
}
```

```python
def main():
    exchange.SetContractType("this_week")
    Log("ticker:", exchange.GetTicker())
    exchange.IO("currency", "BTC_USDT")
    exchange.SetContractType("swap")
    Log("ticker:", exchange.GetTicker())
```

```rust
fn main() {
    // 默认交易对为BTC_USD，设置合约为当周，合约为币本位合约
    exchange.SetContractType("this_week").unwrap();
    Log!("ticker:", exchange.GetTicker(None));

    // 切换交易对，然后设置合约，切换成USDT作为保证金的合约，区别于币本位合约
    exchange.IO(("currency", "BTC_USDT")).unwrap();
    exchange.SetContractType("swap").unwrap();
    Log!("ticker:", exchange.GetTicker(None));
}
```

打印```exchange.SetContractType()```函数的返回值：

```javascript
function main(){
    // 设置合约为当周
    var ret = exchange.SetContractType("this_week")
    // 返回当周合约的信息
    Log(ret)
}
```

```python
def main():
    ret = exchange.SetContractType("this_week")
    Log(ret)
```

```rust
fn main() {
    // 设置合约为当周
    let ret = exchange.SetContractType("this_week").unwrap();
    // 返回当周合约的信息
    Log!(ret);
}
```

在加密货币期货合约策略中，以切换至```BTC_USDT```交易对为例：

当使用```exchange.SetCurrency("BTC_USDT")```或```exchange.IO("currency", "BTC_USDT")```函数切换交易对后，需要再次调用```exchange.SetContractType()```函数重新设置合约，才能在新的交易对下确定当前需要操作的合约。系统会根据交易对来判定该合约为**币本位合约**还是**USDT本位合约**。

例如：当交易对设置为```BTC_USDT```时，使用```exchange.SetContractType("swap")```函数将合约代码设置为```swap```，此时即设置为```BTC```的**USDT本位**永续合约。若交易对为```BTC_USD```，使用```exchange.SetContractType("swap")```函数将合约代码设置为```swap```，此时则设置为```BTC```的**币本位**永续合约。

详细介绍平台支持的加密货币期货合约交易所，各交易所的合约命名方式如下：
- Futures_OKCoin（OKX）
  设置为永续合约：```exchange.SetContractType("swap")```
  设置为当周合约：```exchange.SetContractType("this_week")```
  设置为次周合约：```exchange.SetContractType("next_week")```
  设置为月度合约：```exchange.SetContractType("month")```
  设置为次月合约：```exchange.SetContractType("next_month")```
  设置为季度合约：```exchange.SetContractType("quarter")```
  设置为次季合约：```exchange.SetContractType("next_quarter")```

  OKX提供盘前交易合约，此类合约的交割日期为固定时间。以交易所定义的合约代码```HMSTR-USDT-250207```为例，先在发明者平台将交易对设置为```HMSTR_USDT```，然后使用```exchange.SetContractType("HMSTR-USDT-250207")```设置该合约。
  对于支持```symbol```参数的函数（例如```exchange.GetTicker()```、```exchange.CreateOrder()```等），可以将```symbol```参数指定为```HMSTR_USDT.HMSTR-USDT-250207```，以获取该合约的行情数据或进行下单等操作。
- Futures_HuobiDM（火币期货）
  设置为当周合约：```exchange.SetContractType("this_week")```。
  设置为次周合约：```exchange.SetContractType("next_week")```。
  设置为季度合约：```exchange.SetContractType("quarter")```。
  设置为次季合约：```exchange.SetContractType("next_quarter")```。
  设置为永续合约：```exchange.SetContractType("swap")```。
  支持以```USDT```作为保证金的合约。以```BTC```合约为例：调用```exchange.IO("currency", "BTC_USDT")```即可切换为以```USDT```作为保证金的合约，
  或在配置实盘参数、添加交易所对象时直接将当前交易对设置为```BTC_USDT```。切换交易对后需重新调用```exchange.SetContractType()```函数设置合约。
- Futures_BitMEX（BitMEX）
  设置为永续合约：```exchange.SetContractType("swap")```。
  Futures_BitMEX交易所的交割合约为月度合约，合约代码如下（一月至十二月）：
  ```code
  "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
  ```
  设置交割合约：```exchange.SetContractType("December")```。例如，将交易对设置为```XBT_USDT```时，调用```exchange.SetContractType("December")```函数即可设置BTC的USDT本位十二月交割合约（对应的实际合约代码为```XBTUSDTZ23```）。

  Futures_BitMEX合约信息汇总
  |Futures_BitMEX定义的合约代码|在FMZ对应的交易对|在FMZ对应的合约代码|备注|
  | - | - | - | - |
  | DOGEUSD | DOGE_USD | swap | 美元计价，XBT结算。XBT即BTC。 |
  | DOGEUSDT | DOGE_USDT | swap | USDT计价，USDT结算。 |
  | XBTETH | XBT_ETH | swap | ETH计价，XBT结算。 |
  | XBTEUR | XBT_EUR | swap | 欧元计价（EUR），XBT结算。 |
  | USDTUSDC | USDT_USDC | swap | USDC计价，XBT结算。 |
  | ETHUSD_ETH | ETH_USD_ETH | swap | 美元计价，ETH结算。 |
  | XBTH24 | XBT_USD | March | 到期日：24年3月，月份代码为H；美元计价，XBT结算。 |
  | ETHUSDZ23 | ETH_USD | December | 到期日：23年12月，月份代码为Z；美元计价，XBT结算。 |
  | XBTUSDTZ23 | XBT_USDT | December | 到期日：23年12月，月份代码为Z；USDT计价，USDT结算。 |
  | ADAZ23 | ADA_XBT | December | 到期日：23年12月，月份代码为Z；XBT计价，XBT结算。 |
  | P_XBTETFX23 | USDT_XXX | P_XBTETFX23 | 到期日：23年11月；以百分比计价，USDT结算。 |
- Futures_GateIO
  设置为当周合约：```exchange.SetContractType("this_week")```。
  设置为次周合约：```exchange.SetContractType("next_week")```。
  设置为季度合约：```exchange.SetContractType("quarter")```。
  设置为次季合约：```exchange.SetContractType("next_quarter")```。
  设置为永续合约：```exchange.SetContractType("swap")```。
  支持以```USDT```作为保证金的合约。以```BTC```合约为例，调用```exchange.IO("currency", "BTC_USDT")```即可切换为以```USDT```作为保证金的合约，
  或在配置实盘参数、添加交易所对象时直接将当前交易对设置为```BTC_USDT```。切换交易对后需重新调用```exchange.SetContractType()```函数设置合约。
- Futures_Deribit
  设置为永续合约：```exchange.SetContractType("swap")```。
  支持Deribit的```USDC```合约。
  交割合约有：```"this_week"```, ```"next_week"```, ```"month"```, ```"quarter"```, ```"next_quarter"```, ```"third_quarter"```, ```"fourth_quarter"```。
  差价合约（future_combo）：```"this_week,swap"```, ```"next_week,swap"```, ```"next_quarter,this_week"```, ```"third_quarter,this_week"```, ```"month,next_week"```等多种组合。
  对于期权合约，需要传入交易所定义的具体期权合约代码，详情请参阅Deribit官网。
- Futures_KuCoin
  币本位合约：例如将交易对设置为```BTC_USD```，再设置合约代码，即为币本位合约。
  设置为永续合约：```exchange.SetContractType("swap")```。
  设置为当季合约：```exchange.SetContractType("quarter")```。
  设置为次季合约：```exchange.SetContractType("next_quarter")```。

  以USDT作为保证金的合约：
  例如将交易对设置为```BTC_USDT```，再设置合约代码，即为以USDT作为保证金的合约。
  设置为永续合约：```exchange.SetContractType("swap")```。
- Futures_Binance
  币安期货交易所默认为当前交易对的永续合约，合约代码：```swap```。
  设置为永续合约：```exchange.SetContractType("swap")```。币安的永续合约支持以```USDT```作为保证金，例如```BTC```的```USDT```本位永续合约，需将交易对设置为```BTC_USDT```；币安也支持以币作为保证金的永续合约，例如```BTC```的币本位永续合约，需将交易对设置为```BTC_USD```。
  设置为季度合约：```exchange.SetContractType("quarter")```。交割合约包含币本位合约（即以币作为保证金），例如设置```BTC```的季度合约时，将交易对设置为```BTC_USD```，再调用```exchange.SetContractType("quarter")```，即可设置为```BTC```的币本位季度合约。
  设置为次季合约：```exchange.SetContractType("next_quarter")```。例如设置```BTC```的币本位次季度合约时，将交易对设置为```BTC_USD```，再调用```exchange.SetContractType("next_quarter")```。
  币安支持部分以```USDT```作为保证金的交割合约，以```BTC```为例，将交易对设置为```BTC_USDT```，再设置合约代码即可。

  支持币安期权合约：
  期权合约代码格式以交易所定义的为准，例如```BTC-241227-15000-C```、```XRP-240112-0.5-C```、```BTC-241227-15000-P```。以币安期权合约代码```BTC-241227-15000-P```为例：BTC为期权币种代码，241227为行权日期，15000为行权价格，P表示看跌期权，C表示看涨期权。
  期权的具体类型（欧式期权或美式期权）可查阅交易所期权合约的相关资料。
  交易所可能对期权卖方有所限制，需单独申请资格。币安期权即需要申请卖方资格。
- Futures_Bibox
  Bibox永续合约的合约代码：```swap```。
  设置为永续合约：```exchange.SetContractType("swap")```。
- Futures_Bybit
  默认为当前交易对的永续合约，合约代码：```swap```。
  当周合约代码：```this_week```。
  次周合约代码：```next_week```。
  第三周合约代码：```third_week```。
  月度合约代码：```month```。
  次月合约代码：```next_month```。
  季度合约代码：```quarter```。
  次季度合约代码：```next_quarter```。
  第三季度合约代码：```third_quarter```。
  直接使用交易所的合约命名：例如```ETHUSDT-04APR25```。由于bybit交易所的部分合约品种并无明确的周期性，因此直接使用交易所定义的合约代码进行命名。
- Futures_Kraken
  默认为当前交易对的永续合约，合约代码：```swap```。
  ```swap```：永续合约。
  ```month```：当月合约。
  ```quarter```：季度合约。
  ```next_quarter```：次季合约。
  ```third_quarter```：第三季度合约。
  ```swap_pf```：混合保证金永续合约。
  ```quarter_ff```：混合保证金季度合约。
  ```month_ff```：混合保证金当月合约。
  ```next_quarter_ff```：混合保证金次季度合约。
  ```third_quarter_ff```：混合保证金第三季度合约。
  直接使用交易所的合约命名：例如```FF_ETHUSD_250307```。由于Kraken交易所的部分合约品种并无明确的周期性，因此直接使用交易所定义的合约代码进行命名。
  期权合约：直接使用交易所的期权合约代码，形如```OF_ETHUSD_261225_4000_C```（交易对为```ETH_USD```）。
- Futures_Bitfinex
  默认为当前交易对的永续合约，合约代码：```swap```。
- Futures_Bitget
  默认为当前交易对的永续合约，合约代码：```swap```。
  将交易对设置为```BTC_USD```即为币本位合约，将交易对设置为```BTC_USDT```即为```USDT```结算的合约。模拟合约可将交易对设置为```SBTC_USD```、```BTC_SUSDT```。
- Futures_dYdX (v4)
  dYdX永续合约的合约代码：```swap```。
  设置为永续合约：```exchange.SetContractType("swap")```。dYdX仅有```USD.swap```品种维度，使用的保证金为USDC。
- Futures_MEXC
  MEXC（抹茶）永续合约的合约代码：```swap```。
  设置为永续合约：```exchange.SetContractType("swap")```。将交易对设置为```BTC_USD```即为币本位合约，将交易对设置为```BTC_USDT```即为```USDT```结算的合约。
- Futures_Crypto
  crypto.com交易所账户中的代币可折算为以USD计价的额度，用作合约交易的保证金。
  设置为永续合约：```exchange.SetContractType("swap")```。例如，将交易对设置为```BTC_USD```时，调用```exchange.SetContractType("swap")```函数即可设置BTC的永续合约。
  crypto.com交易所的交割合约为月度合约，合约代码如下（一月至十二月）：
  ```code
  "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
  ```
  设置交割合约：```exchange.SetContractType("October")```。例如，将交易对设置为```BTC_USD```时，调用```exchange.SetContractType("October")```函数即可设置BTC的十月交割合约。
  当前时刻对应的合约代码为```BTCUSD-231027```。
- Futures_WOO
  Futures_WOO交易所支持```USDT```本位合约，永续合约代码为```swap```。例如，将交易对设置为```BTC_USDT```时，调用```exchange.SetContractType("swap")```函数即可将当前合约设置为BTC的USDT本位永续合约。
- Futures_Hyperliquid
  Futures_Hyperliquid交易所支持```USDC```本位合约，永续合约代码为```swap```。例如，将交易对设置为```ETH_USD```时，调用```exchange.SetContractType("swap")```函数即可将当前合约设置为ETH的USDC本位永续合约。
  Futures_Hyperliquid仅有```USD.swap```品种维度，使用的保证金为USDC。
  Futures_Hyperliquid支持HIP-3品种。
- Futures_Lighter
  Futures_Lighter交易所支持```USDC```本位合约，永续合约代码为```swap```。例如，将交易对设置为```BTC_USDC```时，调用```exchange.SetContractType("swap")```函数即可将当前合约设置为BTC的USDC本位永续合约。
  Futures_Lighter仅支持永续合约。
- Futures_Backpack
  Futures_Backpack交易所支持```USDC```本位合约，永续合约代码为```swap```。例如，将交易对设置为```ETH_USDC```时，调用```exchange.SetContractType("swap")```函数即可将当前合约设置为ETH的USDC本位永续合约。
- Futures_edgeX
  Futures_edgeX交易所支持```USDC```本位合约，永续合约代码为```swap```。例如，将交易对设置为```BTC_USDC```时，调用```exchange.SetContractType("swap")```函数即可将当前合约设置为BTC的USDC本位永续合约，完整代码为```BTC_USDC.swap```。
- Futures_WOOFI
  Futures_WOOFI交易所支持```USDC```本位合约，永续合约代码为```swap```。例如，将交易对设置为```ETH_USDC```时，调用```exchange.SetContractType("swap")```函数即可将当前合约设置为ETH的USDC本位永续合约。
- Futures_Coinw
  Futures_Coinw交易所支持```USDT```本位合约，永续合约代码为```swap```。例如，将交易对设置为```ETH_USDT```时，调用```exchange.SetContractType("swap")```函数即可将当前合约设置为ETH的USDT本位永续合约。
- Futures_Aster
  Futures_Aster交易所支持```USDT```本位合约，永续合约代码为```swap```。例如，将交易对设置为```ETH_USDT```时，调用```exchange.SetContractType("swap")```函数即可将当前合约设置为ETH的USDT本位永续合约。
- Futures_DeepCoin
  币本位合约：例如将交易对设置为```BTC_USD```，再设置合约代码，即为币本位合约。
  设置为永续合约：```exchange.SetContractType("swap")```。

  以USDT作为保证金的合约：
  例如将交易对设置为```BTC_USDT```，再设置合约代码，即为以USDT作为保证金的合约。
  设置为永续合约：```exchange.SetContractType("swap")```。

See also: `exchange.GetContractType`, `exchange.SetCurrency`

#### exchange.GetContractType

```
exchange.GetContractType()
```

```exchange.GetContractType()```函数用于获取`exchange`交易所对象当前设置的合约代码。

Returns (string): ```exchange.GetContractType()```函数返回由FMZ平台定义的合约代码，例如：```this_week```、```swap```等。

```javascript
function main () {
    Log(exchange.SetContractType("this_week"))
    Log(exchange.GetContractType())
}
```

```python
def main():
    Log(exchange.SetContractType("this_week"))
    Log(exchange.GetContractType())
```

```rust
fn main() {
    Log!(exchange.SetContractType("this_week"));
    Log!(exchange.GetContractType());
}
```

See also: `exchange.SetContractType`

#### exchange.SetDirection

```
exchange.SetDirection(direction)
```

```exchange.SetDirection()```函数用于设置调用`exchange.Buy`函数、`exchange.Sell`函数进行期货合约下单时的订单方向。

Parameters:

- `direction` (string, required): ```direction```参数用于设置期货合约下单时的方向，可选值为：```"buy"```、```"closesell"```、```"sell"```、```"closebuy"```。

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

```exchange.SetMarginLevel()```函数用于设置```symbol```参数所指定的交易对、合约的杠杆值。同时兼容仅传入```marginLevel```参数的调用方式，用于设置`exchange`交易所对象当前交易对、合约的杠杆值。

Parameters:

- `symbol` (string, optional): ```symbol```参数用于指定需要调整杠杆值的交易对、合约。```SetMarginLevel()```函数中```symbol```参数的格式与```GetTicker()```函数中```symbol```参数的格式一致。
- `marginLevel` (number, required): ```marginLevel```参数用于设置杠杆值。交易所的杠杆值通常为整数，部分交易所也支持浮点数形式的杠杆值设置。

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

不支持```exchange.SetMarginLevel()```函数的交易所：

| 函数名 | 不支持的现货交易所 | 不支持的期货交易所 |
| - | - | - |
| SetMarginLevel | -- | Futures_dYdX / Futures_Deribit / Futures_edgeX |

See also: `exchange`

#### exchange.GetPositions

```
exchange.GetPositions()
exchange.GetPositions(symbol)
```

```exchange.GetPositions()```函数用于获取持仓信息；```GetPositions()```函数是交易所对象`exchange`的成员函数。

```GetPositions()```函数用于获取交易所对象```exchange```所绑定的交易所账户的持仓信息。```exchange```对象的成员函数（方法）的用途仅与```exchange```相关，本文档之后不再赘述。

Parameters:

- `symbol` (string, optional): 参数```symbol```用于指定所要查询的**交易品种**或**交易品种范围**。

未传入```symbol```参数时，默认以当前交易对、合约代码所在的维度范围请求所有品种的持仓数据。

Returns (`Position`数组 / 空值): ```exchange.GetPositions()```函数在请求数据成功时返回`Position`结构数组，在请求数据失败时返回空值。

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

在```GetPositions```函数中，symbol参数的使用场景归纳如下：

| 交易所对象分类 | symbol参数 | 查询范围 | 备注 |
| - | - | - | - |
| 期货 | 不传symbol参数 | 查询当前交易对、合约代码维度范围内的所有交易品种 | 若当前交易对为BTC_USDT，合约代码为swap，则查询所有USDT本位永续合约。等价于调用```GetPositions("USDT.swap")``` |
| 期货 | 指定交易品种，symbol参数为："BTC_USDT.swap" | 查询指定的BTC USDT本位永续合约 | 对于期货交易所对象，symbol参数的格式为：FMZ平台定义的**交易对**与**合约代码**的组合，以字符```"."```分隔。 |
| 期货 | 指定交易品种范围，symbol参数为："USDT.swap" | 查询所有USDT本位永续合约 | - |
| 支持期权的期货交易所 | 不传symbol参数 | 查询当前交易对维度范围内的所有期权合约 | 若当前交易对为BTC_USDT，且合约设置为期权合约，例如币安期权合约：BTC-240108-40000-C |
| 支持期权的期货交易所 | 指定具体交易品种 | 查询指定的期权合约 | 例如对于币安期货交易所，symbol参数为：BTC_USDT.BTC-240108-40000-C |
| 支持期权的期货交易所 | 指定交易品种范围，symbol参数为："USDT.option" | 查询所有USDT本位期权合约 | - |

在```GetPositions```函数中，期货交易所对象的查询维度范围归纳如下：

| symbol参数 | 请求范围定义 | 备注 |
| - | - | - |
| USDT.swap          | USDT本位永续合约范围。  | 对于交易所API接口不支持的维度，调用时会报错并返回空值。 |
| USDT.futures       | USDT本位交割合约范围。  | - |
| USD.swap           | 币本位永续合约范围。    | - |
| USD.futures        | 币本位交割合约范围。    | - |
| USDT.option        | USDT本位期权合约范围。  | - |
| USD.option         | 币本位期权合约范围。    | - |
| USDT.futures_combo | 差价组合合约范围。      | Futures_Deribit交易所 |
| USD.futures_ff     | 混合保证金交割合约范围。 | Futures_Kraken交易所 |
| USD.swap_pf        | 混合保证金永续合约范围。 | Futures_Kraken交易所 |

兼容```exchange.GetPosition()```调用，```GetPosition```与```GetPositions```的用法完全一致。

当交易所对象```exchange```所代表的账户在**查询范围内**或**指定的交易品种**上没有持仓时，```exchange.GetPositions()```函数返回空数组，例如：```[]```。

See also: `Position`, `exchange.SetCurrency`, `exchange.SetContractType`

#### exchange.GetFundings

```
exchange.GetFundings()
exchange.GetFundings(symbol)
```

```exchange.GetFundings()```函数用于获取当前周期的资金费率数据。

Parameters:

- `symbol` (string, optional): 参数```symbol```用于指定所要查询的**交易品种**或**交易品种范围**。若不传入```symbol```参数，则默认以当前交易对、合约代码所在的维度范围，请求所有品种的当期资金费率数据。

Returns (`Funding`数组 / 空值): ```exchange.GetFundings()```函数请求数据成功时返回`Funding`结构数组，请求数据失败时返回空值。

使用期货交易所对象，在回测系统中调用```exchange.GetFundings()```函数。在调用任何行情函数之前，GetFundings 仅返回当前默认交易对的 Funding 数据；在调用行情函数之后，则会返回所有已请求过的品种的 Funding 数据。可参考以下测试示例：

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

对于不支持批量查询资金费率数据的期货交易所，若将```symbol```参数指定为查询范围（例如```USDT.swap```）或不传入```symbol```参数，接口将会报错。使用这类期货交易所对象调用```GetFundings()```函数时，必须将```symbol```参数指定为具体的某个永续合约品种，才能查询到该品种的当期资金费率数据。

```exchange.GetFundings()```函数支持实盘与回测系统。

不支持批量获取资金费率数据的交易所：Futures_Bitget、Futures_OKX、Futures_MEXC、Futures_Deribit、Futures_Crypto。调用时需传入```symbol```参数指定具体的品种代码，例如：```ETH_USDT.swap```。

不支持```exchange.GetFundings()```函数的交易所：

  | 函数名 | 不支持的现货交易所 | 不支持的期货交易所 |
  | - | - | - |
  | GetFundings | -- | Futures_DigiFinex |

See also: `Funding`

### Exchange

交易所对象（```exchange```、```exchanges[n]```）的属性与设置：名称和标签、当前交易对与计价币、K线周期、下单精度、汇率、接口基地址、代理与超时，以及按交易所规则签名编码。

#### exchange.GetName

```
exchange.GetName()
```

```exchange.GetName()```函数用于获取当前交易所对象所绑定的交易所名称。

Returns (string): ```exchange.GetName()```函数返回由FMZ量化交易平台定义的交易所名称。

```javascript
function main() {
    Log("Check if exchange object is Binance spot, result:", exchange.GetName() == "Binance")
}
```

```python
def main():
    Log("Check if exchange object is Binance spot, result:", exchange.GetName() == "Binance")
```

```rust
fn main() {
    Log!("Check if exchange object is Binance spot, result:", exchange.GetName() == "Binance");
}
```

```exchange.GetName()```函数通常用于识别策略代码中的```exchange```或```exchanges[1]```、```exchanges[2]```等交易所对象。加密货币期货合约交易所的名称带有固定前缀```Futures_```。

See also: `exchange.GetLabel`

#### exchange.GetLabel

```
exchange.GetLabel()
```

```exchange.GetLabel()```函数用于获取配置交易所对象时设置的自定义标签。

Returns (string): ```exchange.GetLabel()```函数返回配置交易所对象时设置的自定义标签。

```javascript
function main() {
    Log("exchange label:", exchange.GetLabel())
}
```

```python
def main():
    Log("exchange label:", exchange.GetLabel())
```

```rust
fn main() {
    Log!("exchange label:", exchange.GetLabel());
}
```

通过设置的标签，可在策略代码中识别```exchange```或```exchanges[1]```、```exchanges[2]```等交易所对象。

See also: `exchange`

#### exchange.GetCurrency

```
exchange.GetCurrency()
```

```exchange.GetCurrency()```函数用于获取当前设置的交易对。

Returns (string): ```exchange.GetCurrency()```函数返回当前`exchange`交易所对象所设置的交易对。

```javascript
function main() {
    Log("Current trading pair:", exchange.GetCurrency())
}
```

```python
def main():
    Log("Current trading pair:", exchange.GetCurrency())
```

```rust
fn main() {
    Log!("Current trading pair:", exchange.GetCurrency());
}
```

交易对格式统一采用大写形式，并使用下划线分隔```baseCurrency```与```quoteCurrency```，例如：```BTC_USDT```。

See also: `exchange.SetCurrency`

#### exchange.SetCurrency

```
exchange.SetCurrency(currency)
```

```exchange.SetCurrency()```函数用于切换交易所对象`exchange`当前的交易对。

Parameters:

- `currency` (string, required): ```currency```参数用于指定要切换的交易对。交易对格式统一为大写，并使用下划线分隔```baseCurrency```与```quoteCurrency```，例如：```BTC_USDT```。

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

1、兼容```exchange.IO("currency", "BTC_USDT")```的切换方式，详见`exchange.IO`。

  2、支持在回测系统中切换交易对，但回测系统中切换交易对时，计价币的名称不能改变。例如：```BTC_USDT```可以切换为```LTC_USDT```，但不能切换为```LTC_BTC```。

  3、切换为非回测页面初始设置的交易对后，交易币的数量为0。例如：回测时回测页面上初始设置的交易对为```BTC_USDT```，```BTC```数量为3个，```USDT```数量为10000。此时立即切换为```LTC_USDT```，切换后交易币数量为0，即账户中```LTC```数量为0；切换后的交易对共享```USDT```数量，即数量仍为10000。

See also: `exchange.GetCurrency`

#### exchange.GetQuoteCurrency

```
exchange.GetQuoteCurrency()
```

```exchange.GetQuoteCurrency()```函数用于获取当前交易对的计价币名称，即```quoteCurrency```。

Returns (string): ```exchange.GetQuoteCurrency()```函数返回当前交易对的计价币名称。

```javascript
function main() {
    exchange.SetCurrency("BTC_USDT")
    Log("Quote currency for BTC_USDT:", exchange.GetQuoteCurrency())
    // exchange.SetCurrency("ETH_BTC")
    // Log("Quote currency for ETH_BTC:", exchange.GetQuoteCurrency())
}
```

```python
def main():
    exchange.SetCurrency("BTC_USDT")
    Log("Quote currency for BTC_USDT:", exchange.GetQuoteCurrency())
    # exchange.SetCurrency("ETH_BTC")
    # Log("Quote currency for ETH_BTC:", exchange.GetQuoteCurrency())
```

```rust
fn main() {
    exchange.SetCurrency("BTC_USDT");
    Log!("Quote currency for BTC_USDT:", exchange.GetQuoteCurrency());
    // exchange.SetCurrency("ETH_BTC");
    // Log!("Quote currency for ETH_BTC:", exchange.GetQuoteCurrency());
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

```javascript
function main() {
    // 例如，回测或实盘时在发明者量化交易平台网站页面上设置的 K 线周期为 1 小时
    var period = exchange.GetPeriod()
    Log("K-line period:", period / (60 * 60), "hours")
}
```

```python
def main():
    period = exchange.GetPeriod()
    Log("K-line period:", period / (60 * 60), "hours")
```

```rust
fn main() {
    // 例如，回测或实盘时在发明者量化交易平台网站页面上设置的 K 线周期为 1 小时
    let period = exchange.GetPeriod();
    Log!("K-line period:", period as f64 / (60.0 * 60.0), "hours");
}
```

See also: `exchange.GetRecords`

#### exchange.SetMaxBarLen

```
exchange.SetMaxBarLen(len)
```

设置K线的最大长度。

Parameters:

- `len` (number, required): 参数```len```用于指定K线的最大长度。

```javascript
function main() {
    exchange.SetMaxBarLen(50)
    var records = exchange.GetRecords()
    Log(records.length, records)
}
```

```python
def main():
    exchange.SetMaxBarLen(50)
    r = exchange.GetRecords()
    Log(len(r), r)
```

```rust
fn main() {
    exchange.SetMaxBarLen(50);
    let records = exchange.GetRecords(None, None, None).unwrap();
    Log!(records.len(), records);
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

```exchange.SetPrecision()```函数用于设置```exchange```交易所对象的**价格**与**下单量**的精度，设置后系统会自动忽略数据中超出精度的多余部分。

Parameters:

- `pricePrecision` (number, required): ```pricePrecision```参数用于设置价格数据的精度。
- `amountPrecision` (number, required): ```amountPrecision```参数用于设置下单量数据的精度。

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

```javascript
function main(){
    Log(exchange.GetTicker())
    // 设置汇率转换
    exchange.SetRate(7)
    Log(exchange.GetTicker())
    Log("Current rate:", exchange.GetRate())
}
```

```python
def main():
    Log(exchange.GetTicker())
    exchange.SetRate(7)
    Log(exchange.GetTicker())
    Log("Current rate:", exchange.GetRate())
```

```rust
fn main() {
    Log!(exchange.GetTicker(None));
    // 设置汇率转换
    exchange.SetRate(7);
    Log!(exchange.GetTicker(None));
    Log!("Current rate:", exchange.GetRate());
}
```

如果未调用```exchange.SetRate()```设置过转换汇率，```exchange.GetRate()```函数将返回默认汇率值```1```，即当前显示的计价货币（quoteCurrency）相关数据未经过汇率转换。

如果已使用```exchange.SetRate()```设置过汇率值，例如```exchange.SetRate(7)```，那么通过```exchange```交易所对象获取的行情、深度、下单价格等所有价格信息，都会乘以所设置的汇率```7```进行转换。

如果```exchange```对应的是以美元为计价货币的交易所，在调用```exchange.SetRate(7)```后，实盘中的所有价格都会乘以```7```，转换为接近人民币（CNY）的价格。此时通过```exchange.GetRate()```获取的汇率值即为```7```。

See also: `exchange.SetRate`

#### exchange.SetRate

```
exchange.SetRate(rate)
```

设置交易所对象当前的汇率。

Parameters:

- `rate` (number, required): ```rate``` 参数用于指定转换汇率。

```javascript
function main(){
    Log(exchange.GetTicker())
    // 设置汇率转换
    exchange.SetRate(7)
    Log(exchange.GetTicker())
    // 设置为 1，不转换
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
    // 设置为 1，不转换
    exchange.SetRate(1);
}
```

如果使用 ```exchange.SetRate()``` 函数设置了汇率值（例如设置为 7），那么当前 ```exchange``` 交易所对象所代表交易所的行情、深度、下单价格等所有价格信息，都会被乘以所设置的汇率 7 进行转换。

例如，```exchange``` 是以美元为计价货币的交易所。执行 ```exchange.SetRate(7)``` 之后，实盘中的所有价格都会被乘以 7，转换为接近 **CNY** 计价的价格。

See also: `exchange.GetRate`

#### exchange.SetBase

```
exchange.SetBase(s)
```

```exchange.SetBase()```函数用于设置`exchange`交易所对象所使用的交易所API接口基地址。

Parameters:

- `s` (string, required): ```s```参数用于指定交易所API接口的基地址。

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

```exchange.GetBase()``` 函数用于获取当前交易所 API 接口的基础地址。

Returns (string): 当前交易所 API 接口的基础地址。

```javascript
function main() {
    Log(exchange.GetBase())
}
```

```python
def main():
    Log(exchange.GetBase())
```

```rust
fn main() {
    Log!(exchange.GetBase());
}
```

See also: `exchange.SetBase`

#### exchange.SetProxy

```
exchange.SetProxy(proxy)
```

```exchange.SetProxy()```函数用于设置`exchange`交易所对象的代理配置。

Parameters:

- `proxy` (string, required): ```proxy```参数用于指定代理配置。

为`exchange`交易所对象配置```socks5```代理：

```javascript
function main() {
    exchange.SetProxy("socks5://192.168.1.10:8080")
    // 如果无法访问交易所行情接口，设置一个可用的socks5代理即可访问行情接口
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
    // 如果无法访问交易所行情接口，设置一个可用的socks5代理即可访问行情接口
    Log!(exchange.GetTicker(None));
}
```

除了**全局指定**`exchange`交易所对象发出请求所使用的IP地址外，也支持基于`exchange`单独指定IP地址：

```javascript
function main(){
    exchange.SetProxy("ip://10.0.3.15")
    // 发出请求的IP地址为10.0.3.15
    exchange.GetTicker()
}
```

```python
def main():
    exchange.SetProxy("ip://10.0.3.15")
    exchange.GetTicker()
```

```rust
fn main() {
    exchange.SetProxy("ip://10.0.3.15");
    // 发出请求的IP地址为10.0.3.15
    let _ = exchange.GetTicker(None);
}
```

如果代理设置失败，调用```exchange.SetProxy()```函数时将返回空值。

```exchange.SetProxy()```函数的代理设置功能仅支持```rest```协议。每个`exchange`交易所对象可以设置一个代理，设置代理后，对该`exchange`交易所对象所绑定交易所接口的访问都会通过该代理进行。

支持设置```socks5```代理，以第一个添加的交易所对象`exchange`（即```exchanges[0]```）为例：

- 设置代理，无用户名、无密码：```exchange.SetProxy("socks5://127.0.0.1:8889")```。

- 设置代理，指定用户名和密码：```exchange.SetProxy("socks5://username:password@127.0.0.1:8889")```，其中```username```为用户名，```password```为密码。

- 切换为正常模式，不使用代理：```exchange.SetProxy("")```。

支持指定`exchange`交易所对象发出请求所使用的IP地址，详见[全局指定](/user-guide/平台基础/托管者/命令行参数)。

See also: `exchange`

#### exchange.SetTimeout

```
exchange.SetTimeout(timeout)
```

```exchange.SetTimeout()```函数用于设置`exchange`交易所对象```rest```请求的超时时间。

Parameters:

- `timeout` (number, required): ```timeout```参数用于指定超时时间的毫秒数。

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

```exchange.Encode()```函数用于执行签名与加密计算。

Parameters:

- `algo` (string, required): 参数```algo```用于指定编码计算时所使用的算法。
支持设置为："raw"（不使用算法）、"sign"、"signTx"、"md4"、"md5"、"sha256"、"sha512"、"sha1"、"keccak256"、"sha3.224"、"sha3.256"、"sha3.384"、"sha3.512"、"sha3.keccak256"、"sha3.keccak512"、"sha512.384"、"sha512.256"、"sha512.224"、"ripemd160"、"blake2b.256"、"blake2b.512"、"blake2s.128"、"blake2s.256"。

参数```algo```还支持："text.encoder.utf8"、"text.decoder.utf8"、"text.encoder.gbk"、"text.decoder.gbk"，用于对字符串进行编码、解码。
参数```algo```也支持"ed25519"算法，并可搭配不同的哈希算法使用，例如参数```algo```可写为"ed25519.md5"、"ed25519.sha512"等，同时支持```ed25519.seed```计算。
- `inputFormat` (string, required): 用于指定```data```参数的数据格式。```inputFormat```参数支持设置为："raw"、"hex"、"base64"、"string"其中之一。"raw"表示原始数据，"hex"表示```hex```编码数据，"base64"表示```base64```编码数据，"string"表示字符串数据。
- `outputFormat` (string, required): 用于指定输出的数据格式。```outputFormat```参数支持设置为："raw"、"hex"、"base64"、"string"其中之一。"raw"表示原始数据，"hex"表示```hex```编码数据，"base64"表示```base64```编码数据，"string"表示字符串数据。
- `data` (string, required): 参数```data```为所要处理的数据。
- `keyFormat` (string, optional): 用于指定```key```参数的数据格式。```keyFormat```参数支持设置为："raw"、"hex"、"base64"、"string"其中之一。"raw"表示原始数据，"hex"表示```hex```编码数据，"base64"表示```base64```编码数据，"string"表示字符串数据。
- `key` (string, optional): ```key```参数用于指定签名计算时使用的密钥，可以使用明文字符串，也可以使用```"{{accesskey}}"```、```"{{secretkey}}"```分别代指`exchange`交易所对象中配置的```accessKey```和```secretKey```。

Returns (string): ```exchange.Encode()```函数返回计算得到的哈希值编码。

BitMEX仓位变化推送（wss协议）示例：

```javascript
function main() {
    var APIKEY = "your Access Key(Bitmex API ID)"
    var expires = parseInt(Date.now() / 1000) + 10
    var signature = exchange.Encode("sha256", "string", "hex", "GET/realtime" + expires, "hex", "{{secretkey}}")
    var client = Dial("wss://www.bitmex.com/realtime", 60)
    var auth = JSON.stringify({args: [APIKEY, expires, signature], op: "authKeyExpires"})
    var pos = 0
    client.write(auth)
    client.write('{"op": "subscribe", "args": "position"}')
    while (true) {
        var bitmexData = JSON.parse(client.read())
        if(bitmexData.table == 'position' && pos != parseInt(bitmexData.data[0].currentQty)){
            Log('position change', pos, parseInt(bitmexData.data[0].currentQty), '@')
            pos = parseInt(bitmexData.data[0].currentQty)
        }
    }
}
```

```python
import time
def main():
    APIKEY = "your Access Key(Bitmex API ID)"
    expires = int(time.time() + 10)
    signature = exchange.Encode("sha256", "string", "hex", "GET/realtime" + expires, "hex", "{{secretkey}}")
    client = Dial("wss://www.bitmex.com/realtime", 60)
    auth = json.dumps({"args": [APIKEY, expires, signature], "op": "authKeyExpires"})
    pos = 0
    client.write(auth)
    client.write('{"op": "subscribe", "args": "position"}')
    while True:
        bitmexData = json.loads(client.read())
        if "table" in bitmexData and bitmexData["table"] == "position" and len(bitmexData["data"]) != 0 and pos != bitmexData["data"][0]["currentQty"]:
            Log("position change", pos, bitmexData["data"][0]["currentQty"], "@")
            pos = bitmexData["data"][0]["currentQty"]
```

仅实盘支持调用```exchange.Encode()```函数。```"{{accesskey}}"```、```"{{secretkey}}"```的引用方式仅在调用```exchange.Encode()```函数时有效。

See also: `exchange`, `Encode`

### IO

```exchange.IO()```调用交易所对象的扩展功能，第一个参数是指令名。先看`exchange.IO`了解全部指令以及各交易所特有的指令，再按需查看各指令的详细说明。Web3、Uniswap交易所对象的指令另见Web3、Uniswap分类。

#### exchange.IO

```
exchange.IO(k, ...args)
```

```exchange.IO()```函数用于调用交易所对象相关的其它接口。

Parameters:

- `k` (string, required): 调用类型标识符，不同的取值对应不同的功能，具体请参见下方各章节的说明。
- `arg` (string / number / bool / object / array / any, required): 扩展参数，根据```k```值的不同需要传入不同的参数，其个数和类型均不固定。

Returns (string / number / bool / object / array / any): ```exchange.IO()```函数用于调用交易所对象的其它相关接口，调用成功时返回请求的应答数据，调用失败时返回空值。

Futures_edgeX计算订单Hash并签名：

```javascript
function main() {
    var strJson = `{
        "assetIdSynthetic":    "0x4554482d3900000000000000000000",
        "assetIdCollateral":   "0x2ce625e94458d39dd0bf3b45a843544dd4a14b8169045a3a3d15aa564b936c5",
        "assetIdFee":          "0x2ce625e94458d39dd0bf3b45a843544dd4a14b8169045a3a3d15aa564b936c5",
        "isBuyingSynthetic":   true,
        "amountSynthetic":     10000000,
        "amountCollateral":    13020000,
        "amountFee":           6250,
        "nonce":               676432751,
        "accountID":           601416704693633632,
        "expirationTimestamp": 484831
    }`
    var signature = exchange.IO("calcOrderHashAndSign", strJson)
    Log(signature)
}
```

```python
import json
def main():
    params = {
        "assetIdSynthetic":    "0x4554482d3900000000000000000000",
        "assetIdCollateral":   "0x2ce625e94458d39dd0bf3b45a843544dd4a14b8169045a3a3d15aa564b936c5",
        "assetIdFee":          "0x2ce625e94458d39dd0bf3b45a843544dd4a14b8169045a3a3d15aa564b936c5",
        "isBuyingSynthetic":   True,
        "amountSynthetic":     10000000,
        "amountCollateral":    13020000,
        "amountFee":           6250,
        "nonce":               676432751,
        "accountID":           601416704693633632,
        "expirationTimestamp": 484831
    }
    signature = exchange.IO("calcOrderHashAndSign", json.dumps(params))
    Log(signature)
```

```rust
fn main() {
    let strJson = r#"{
        "assetIdSynthetic":    "0x4554482d3900000000000000000000",
        "assetIdCollateral":   "0x2ce625e94458d39dd0bf3b45a843544dd4a14b8169045a3a3d15aa564b936c5",
        "assetIdFee":          "0x2ce625e94458d39dd0bf3b45a843544dd4a14b8169045a3a3d15aa564b936c5",
        "isBuyingSynthetic":   true,
        "amountSynthetic":     10000000,
        "amountCollateral":    13020000,
        "amountFee":           6250,
        "nonce":               676432751,
        "accountID":           601416704693633632,
        "expirationTimestamp": 484831
    }"#;
    let signature = exchange.IO(("calcOrderHashAndSign", strJson));
    Log!(signature);
}
```

**指令一览**

| 指令 | 说明 |
| - | - |
| ```"api"``` | 调用交易所未封装的原始接口 |
| ```"currency"``` | 运行时切换交易对 |
| ```"base"``` / ```"mbase"``` | 切换交易 / 行情接口基地址 |
| ```"simulate"```、```"cross"```、```"dual"```、```"unified"```等 | 切换交易模式，见```exchange.IO(mode, value)``` |
| ```"rate"``` / ```"quota"``` | API调用限流 |

各指令的详细说明见本分类下的各个页面；下面列出各交易所特有的指令。

**各交易所IO指令**

所有交易所均支持```"api"```和```"currency"```指令，下方仅列出各交易所的特有指令。

---

#### 现货交易所

**Binance（币安）**

| 指令 | 参数 | 说明 |
| - | - | - |
| ```trade_margin``` | 无 | 切换至逐仓杠杆模式 |
| ```trade_super_margin``` | 无 | 切换至全仓杠杆模式 |
| ```trade_normal``` | 无 | 切换回普通现货模式 |
| ```unified``` | bool | 统一账户模式 |
| ```selfTradePreventionMode``` | string | 自成交防护，可选：```EXPIRE_TAKER```/```EXPIRE_MAKER```/```EXPIRE_BOTH```/```NONE``` |

**OKX（欧易）**

| 指令 | 参数 | 说明 |
| - | - | - |
| ```simulate``` | bool | 模拟盘/实盘切换 |
| ```trade_margin``` | 无 | 逐仓杠杆（tdMode=isolated） |
| ```trade_super_margin``` | 无 | 全仓杠杆（tdMode=cross） |
| ```trade_normal``` | 无 | 切换回普通现货模式 |
| ```tdMode``` | string | 直接设置交易模式，组合保证金模式下须使用全仓 |

**Huobi（火币）**

| 指令 | 参数 | 说明 |
| - | - | - |
| ```trade_margin``` | 无 | 切换至逐仓杠杆模式 |
| ```trade_super_margin``` | 无 | 切换至全仓杠杆模式 |
| ```trade_normal``` | 无 | 切换回普通现货模式 |

**Bybit**

| 指令 | 参数 | 说明 |
| - | - | - |
| ```trade_margin``` | 无 | 切换至杠杆模式 |
| ```trade_normal``` | 无 | 切换回普通现货模式 |

**Gate.io**

| 指令 | 参数 | 说明 |
| - | - | - |
| ```trade_margin``` | 无 | 切换至逐仓杠杆模式 |
| ```trade_super_margin``` | 无 | 切换至全仓杠杆模式 |
| ```trade_normal``` | 无 | 切换回普通现货模式 |
| ```unified``` | bool | 统一账户模式 |

**Bitget**

| 指令 | 参数 | 说明 |
| - | - | - |
| ```simulate``` | bool | 模拟盘/实盘切换 |

**CoinEx**

| 指令 | 参数 | 说明 |
| - | - | - |
| ```trade_margin``` | 无 | 切换至杠杆模式 |
| ```trade_normal``` | 无 | 切换回普通模式 |

**WOO**

| 指令 | 参数 | 说明 |
| - | - | - |
| ```trade_margin``` | 无 | 切换至杠杆模式 |
| ```trade_normal``` | 无 | 切换回普通模式 |

**Crypto.com**

| 指令 | 参数 | 说明 |
| - | - | - |
| ```trade_margin``` | 无 | 切换至杠杆模式 |
| ```trade_normal``` | 无 | 切换回普通模式 |

**AscendEx**

| 指令 | 参数 | 说明 |
| - | - | - |
| ```trade_margin``` | 无 | 切换至杠杆模式 |
| ```trade_normal``` | 无 | 切换回普通模式 |

**Gemini**

| 指令 | 参数 | 说明 |
| - | - | - |
| ```subAccount``` | string | 设置子账户名称 |

**Poloniex**

| 指令 | 参数 | 说明 |
| - | - | - |
| ```accountId``` | string | 设置账户ID |

**Bitfinex**

| 指令 | 参数 | 说明 |
| - | - | - |
| ```version``` | 无 | 获取当前API版本号 |

**Backpack**

| 指令 | 参数 | 说明 |
| - | - | - |
| ```selfTradePreventionMode``` | string | 自成交防护，可选：```Allow```/```RejectTaker```/```RejectMaker```/```RejectBoth```/```Ban``` |

**Hyperliquid（现货）**

| 指令 | 参数 | 说明 |
| - | - | - |
| ```source``` | "a"/"b" | 切换API数据源 |
| ```vaultAddress``` | string | 设置金库地址，传入空字符串则禁用 |
| ```walletAddress``` | string | 设置钱包地址 |
| ```expiresAfter``` | number | 订单过期时间（毫秒），设为0则禁用 |

---

#### 合约交易所

**Futures_Binance（币安合约）**

| 指令 | 参数 | 说明 |
| - | - | - |
| ```cross``` | bool | 全仓/逐仓 |
| ```dual``` | bool | 双向/单向持仓 |
| ```unified``` | bool | 统一账户（切换后使用papi.binance.com） |
| ```selfTradePreventionMode``` | string | 自成交防护，可选：```EXPIRE_TAKER```/```EXPIRE_MAKER```/```EXPIRE_BOTH```/```NONE``` |
| ```extend_key``` | string | 设置API响应扩展字段（以逗号分隔） |

**Futures_OKX（欧易合约）**

| 指令 | 参数 | 说明 |
| - | - | - |
| ```simulate``` | bool | 模拟盘/实盘切换 |
| ```cross``` | bool | 全仓/逐仓，默认全仓 |
| ```dual``` | bool | 双向(long_short_mode)/单向(net_mode)持仓 |

**Futures_HuobiDM（火币合约）**

| 指令 | 参数 | 说明 |
| - | - | - |
| ```cross``` | bool | 全仓/逐仓，默认逐仓。仅```XXX_USDT```永续合约(swap)支持 |
| ```dual``` | bool | 双向(dual_side)/单向(single_side)持仓 |
| ```unified``` | bool | 统一账户模式 |
| ```signHost``` | string | 设置API签名Host地址，传入空字符串则禁用 |

**Futures_Bybit**

| 指令 | 参数 | 说明 |
| - | - | - |
| ```cross``` | bool | 全仓/逐仓 |
| ```dual``` | bool | 双向/单向持仓 |

**Futures_KuCoin**

| 指令 | 参数 | 说明 |
| - | - | - |
| ```cross``` | bool | 全仓/逐仓 |

**Futures_GateIO**

| 指令 | 参数 | 说明 |
| - | - | - |
| ```cross``` | bool | 全仓/逐仓 |
| ```dual``` | bool | 双向/单向持仓 |
| ```unified``` | bool | 统一账户模式 |

**Futures_Bitget**

| 指令 | 参数 | 说明 |
| - | - | - |
| ```simulate``` | bool | 模拟盘/实盘切换 |
| ```cross``` | bool | 全仓(crossed)/逐仓(isolated) |
| ```dual``` | bool | 双向(hedge_mode)/单向(one_way_mode)持仓 |

**Futures_MEXC**

| 指令 | 参数 | 说明 |
| - | - | - |
| ```cross``` | bool | 全仓/逐仓 |

**Futures_BitMEX**

| 指令 | 参数 | 说明 |
| - | - | - |
| ```cross``` | bool | 全仓/逐仓 |

**Futures_CoinEx**

| 指令 | 参数 | 说明 |
| - | - | - |
| ```cross``` | bool | 全仓/逐仓 |

**Futures_WOO**

| 指令 | 参数 | 说明 |
| - | - | - |
| ```cross``` | bool | 全仓/逐仓 |
| ```dual``` | bool | 双向/单向持仓 |

**Futures_Kraken**

| 指令 | 参数 | 说明 |
| - | - | - |
| ```cross``` | bool | 全仓/逐仓（仅multi-collateral账户支持） |

**Futures_Aevo**

| 指令 | 参数 | 说明 |
| - | - | - |
| ```signingKey``` | string | 设置签名密钥，返回公钥。需从交易所API Key页面获取，请注意其存在时效性 |

**Futures_Hyperliquid**

| 指令 | 参数 | 说明 |
| - | - | - |
| ```cross``` | bool | 全仓/逐仓 |
| ```source``` | "a"/"b" | 切换API数据源 |
| ```vaultAddress``` | string | 设置金库地址，传入空字符串则禁用 |
| ```walletAddress``` | string | 设置钱包地址 |
| ```expiresAfter``` | number | 订单过期时间（毫秒），设为0则禁用 |

**Futures_Deepcoin**

| 指令 | 参数 | 说明 |
| - | - | - |
| ```cross``` | bool | 全仓/逐仓 |
| ```merge``` | bool | 合并持仓(true)/拆分持仓(false) |

**Futures_DigiFinex**

| 指令 | 参数 | 说明 |
| - | - | - |
| ```simulate``` | bool | 模拟盘/实盘切换 |
| ```cross``` | bool | 全仓/逐仓 |

**Futures_ApolloX**

| 指令 | 参数 | 说明 |
| - | - | - |
| ```cross``` | bool | 全仓/逐仓 |

**Futures_Aster**

| 指令 | 参数 | 说明 |
| - | - | - |
| ```cross``` | bool | 全仓/逐仓 |
| ```dual``` | bool | 双向/单向持仓 |

**Futures_CoinW**

| 指令 | 参数 | 说明 |
| - | - | - |
| ```cross``` | bool | 全仓/逐仓 |

**Futures_BitMart**

| 指令 | 参数 | 说明 |
| - | - | - |
| ```cross``` | bool | 全仓/逐仓 |

**Futures_Backpack**

| 指令 | 参数 | 说明 |
| - | - | - |
| ```selfTradePreventionMode``` | string | 自成交防护，可选：```Allow```/```RejectTaker```/```RejectMaker```/```RejectBoth```/```Ban``` |

**Futures_Lighter**

| 指令 | 参数 | 说明 |
| - | - | - |
| ```cross``` | bool | 全仓/逐仓 |
| ```expiry``` | number | 订单过期时间戳（毫秒），默认29天，最小4分钟 |

**Futures_Crypto.com**

| 指令 | 参数 | 说明 |
| - | - | - |
| ```accountId``` | string | 设置交易账户ID |

**Futures_Bitfinex**

| 指令 | 参数 | 说明 |
| - | - | - |
| ```mbase``` | string | 设置行情API基础地址 |

**Futures_edgeX**

| 指令 | 参数 | 说明 |
| - | - | - |
| ```calcOrderHashAndSign``` | string(JSON) | 计算订单哈希并签名，返回签名字符串 |

**Futures_Bibox**

| 指令 | 参数 | 说明 |
| - | - | - |
| ```cross``` | bool | 全仓/逐仓，默认全仓 |

**Futures_Pionex**

| 指令 | 参数 | 说明 |
| - | - | - |
| ```cross``` | bool | 全仓/逐仓 |
| ```dual``` | bool | 双向/单向持仓 |

**Futures_Phemex**

| 指令 | 参数 | 说明 |
| - | - | - |
| ```dual``` | bool | 双向/单向持仓。全仓/逐仓需在交易所网页端设置 |

**Futures_WooFi**

> 仅支持通用指令```"api"```和```"currency"```，无特有指令。

**特殊平台IO指令**

**Polymarket（预测市场）**

| 指令 | 参数 | 说明 |
| - | - | - |
| ```nonce``` | [number] | 获取或设置订单的 nonce 值。不传参数时返回当前 nonce，传入数值时设置新的 nonce |
| ```proxyWalletAddress``` | 无 | 获取代理钱包地址 |
| ```redeem``` | symbol, [wait] | 赎回已结算头寸（通过 Relayer 免 Gas）。wait 默认为 true，等待交易确认；wait 为 false 时立即返回```{"transactionID": "..."}``` |
| ```merge``` | symbol, [amount], [wait] | 将 YES+NO 代币合并赎回为 USDC（通过 Relayer 免 Gas）。amount 为 0 或不传时，自动取两个 outcome 中较小的持仓量。wait 默认为 true，等待交易确认 |
| ```l2_credentials``` | 无 | 获取 L2 认证信息，返回```{"apiKey":"","secret":"","passphrase":""}```，用于 WebSocket 连接等场景 |
| ```batchOrders``` | array | 批量下单，参数为订单对象数组，每个对象包含```symbol```、```side```、```price```、```amount```字段，以及可选的```option```字段 |

**Web3（区块链）**

| 指令 | 参数 | 说明 |
| - | - | - |
| ```abi``` | 合约地址, ABI字符串 | 注册合约 ABI |
| ```address``` | [私钥] | 获取钱包地址 |
| ```encode``` / ```pack``` | 类型, 数据... | ABI 编码数据 |
| ```encodePacked``` | 类型, 数据... | ABI 紧密编码数据 |
| ```hash``` | 参数1-4 | 计算哈希值 |
| ```decode``` / ```unpack``` | 类型, 数据... | ABI 解码数据 |
| ```key``` | string | 切换操作所使用的私钥 |

**IB（盈透证券）**

| 指令 | 参数 | 说明 |
| - | - | - |
| ```status``` | 无 | 获取连接状态 |
| ```time``` | 无 | 获取 IB 服务器时间 |
| ```reqId``` | 无 | 强制获取新的请求 ID |
| ```orderId``` | 无 | 获取下一个可用的订单 ID |
| ```ignore``` | string(数组) | 忽略指定的错误码 |
| ```scan``` | string(JSON) | 执行市场扫描器 |
| ```wait``` | [number] | 等待行情事件，可设置超时秒数 |
| ```debug``` | bool | 调试模式：开启后把与TWS/IB Gateway收发的每一帧按网关API日志的格式输出到日志 |
| ```marketDataType``` | number | 行情数据类型（1 实时 / 2 冻结 / 3 延迟 / 4 延迟冻结） |

**Futu（富途证券）**

| 指令 | 参数 | 说明 |
| - | - | - |
| ```refresh``` | bool | 缓存刷新，禁用缓存后频率限制为每 30 秒最多 10 次 |
| ```accounts``` | 无 | 获取所有账户列表 |
| ```status``` | 无 | 获取连接状态 |
| ```lock``` | 无 | 锁定交易 |
| ```unlock``` | 无 | 解锁交易 |
| ```wait``` | 无 | 等待行情事件 |

See also: `exchange.SetBase`, `exchange.SetCurrency`

#### exchange.IO("api", ...)

```
exchange.IO(k, httpMethod, resource)
exchange.IO(k, httpMethod, resource, params)
exchange.IO(k, httpMethod, resource, params, raw)
```

Forms:

- `exchange.IO("api", ...)`

```exchange.IO("api", ...)```调用交易所未封装的原始REST接口，签名由平台自动处理。

Parameters:

- `k` (string, required): ```k```参数用于设置```exchange.IO()```函数的功能，设置为```"api"```表示调用交易所原始接口。
- `httpMethod` (string, required): ```httpMethod```参数为请求方法，例如```GET```、```POST```、```DELETE```。
- `resource` (string, required): ```resource```参数为接口路径，也可以写完整URL（主机部分替换当前基地址）。
- `params` (string, optional): ```params```参数为URL编码格式的请求参数。
- `raw` (string, optional): ```raw```参数为原始请求体，例如JSON字符串。

Returns (object / array / 空值): 返回交易所接口的完整应答，调用失败时返回空值。仅实盘支持。

使用 ```"api"``` 模式调用 OKX 期货批量下单接口，并通过 ```raw``` 参数传递 JSON 格式的订单数据：

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

```params```参数中的键值为字符串类型时，需要使用单引号将参数值包裹起来：

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

```resource```参数支持传入完整的URL：

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

不使用```raw```参数的GET请求：

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

**直接调用交易所API（```"api"```模式）**

```javascript
exchange.IO("api", httpMethod, resource, params, raw)
```

用于调用交易所未封装的原生API接口。FMZ会自动处理签名验证，您只需填写请求参数即可。

| 参数 | 类型 | 必填 | 说明 |
| - | - | - | - |
| httpMethod | string | 是 | ```GET```、```POST```等 |
| resource | string | 是 | 请求路径或完整URL |
| params | string | 否 | URL编码格式的请求参数 |
| raw | string | 否 | 原始请求体（JSON等） |

调用失败时返回空值，且该模式仅支持实盘。

See also: `exchange.IO`

#### exchange.IO("currency", ...)

```
exchange.IO(k, symbol)
```

Forms:

- `exchange.IO("currency", ...)`

```exchange.IO("currency", ...)```在运行时切换交易所对象的当前交易对。

Parameters:

- `k` (string, required): ```k```参数用于设置```exchange.IO()```函数的功能，设置为```"currency"```表示切换交易对。
- `symbol` (string, required): ```symbol```参数为交易对，大写、下划线分隔，例如```ETH_USDT```。

Returns (string / number / bool / object / array / any): 调用成功时返回指令的结果，调用失败时返回空值。

运行时切换交易对：

```javascript
function main() {
    // 例如，实盘启动时交易所对象当前的交易对为BTC_USDT，打印当前交易对的行情
    Log(exchange.GetTicker())
    // 将交易对切换为LTC_BTC
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
    // 例如，实盘启动时交易所对象当前的交易对为BTC_USDT，打印当前交易对的行情
    Log!(exchange.GetTicker(None));
    // 将交易对切换为LTC_BTC
    let _ = exchange.IO(("currency", "LTC_BTC"));
    Log!(exchange.GetTicker(None));
}
```

**运行时切换交易对（```"currency"```模式）**

```javascript
exchange.IO("currency", "ETH_USDT")
```

用于在运行时动态切换交易对，交易对格式为大写字母加下划线分隔。此指令等同于`exchange.SetCurrency`。

> 回测模式下仅支持现货，且只能切换至相同计价币种的交易对。期货切换交易对后，需再次调用```exchange.SetContractType()```。

See also: `exchange.IO`

#### exchange.IO("base", ...)

```
exchange.IO(k, address)
```

Forms:

- `exchange.IO("base", ...)`

```exchange.IO("base", ...)```切换交易接口的基地址，```exchange.IO("mbase", ...)```切换行情接口的基地址。

Parameters:

- `k` (string, required): ```k```参数用于设置```exchange.IO()```函数的功能，设置为```"base"```表示切换交易接口基地址（```"mbase"```切换行情接口基地址）。
- `address` (string, required): ```address```参数为新的基地址，例如```https://api.example.com```。

Returns (string / number / bool / object / array / any): 调用成功时返回指令的结果，调用失败时返回空值。

切换交易所接口基地址：

```javascript
function main () {
    // exchanges[0]即实盘创建时添加的第一个交易所对象
    exchanges[0].IO("base", "https://api.huobi.pro")
}
```

```python
def main():
    exchanges[0].IO("base", "https://api.huobi.pro")
```

```rust
fn main() {
    // exchanges[0]即实盘创建时添加的第一个交易所对象
    let _ = exchanges[0].IO(("base", "https://api.huobi.pro"));
}
```

通过```"mbase"```切换行情接口基地址（以Bitfinex为例）：

```javascript
function main() {
    exchange.SetBase("https://api.bitfinex.com")
    exchange.IO("mbase", "https://api-pub.bitfinex.com")
}
```

```python
def main():
    exchange.SetBase("https://api.bitfinex.com")
    exchange.IO("mbase", "https://api-pub.bitfinex.com")
```

```rust
fn main() {
    exchange.SetBase("https://api.bitfinex.com");
    let _ = exchange.IO(("mbase", "https://api-pub.bitfinex.com"));
}
```

**切换基地址（```"base"``` / ```"mbase"```模式）**

- ```"base"```：切换交易接口的基地址，等同于```exchange.SetBase()```。
- ```"mbase"```：切换行情接口的基地址，适用于行情与交易采用不同域名的交易所。

See also: `exchange.IO`

#### exchange.IO(mode, value)

```
exchange.IO(mode)
exchange.IO(mode, value)
```

Forms:

- `exchange.IO(mode, value)`

```exchange.IO(mode, value)```切换交易所的交易模式：模拟盘/实盘、全仓/逐仓、双向/单向持仓、统一账户、杠杆模式、自成交预防等。

Parameters:

- `mode` (string, required): ```mode```参数为模式指令，例如```"simulate"```、```"cross"```、```"dual"```，全部指令见下表。
- `value` (bool / string, optional): ```value```参数为模式的取值，类型和含义见下表；部分指令不需要。

Returns (string / number / bool / object / array / any): 调用成功时返回指令的结果，调用失败时返回空值。

切换模拟盘/实盘环境（以OKX期货为例）：

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

切换合约保证金模式与持仓模式（以币安期货为例）：

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

切换统一账户模式（以币安期货为例）：

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

设置自成交预防模式（以币安为例）：

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

**通用交易模式指令**

以下指令在多个交易所中通用，各交易所的具体支持情况请参见`exchange.IO`。

| 指令 | 参数 | 功能 |
| - | - | - |
| ```simulate``` | bool | 模拟盘(true)/实盘(false) |
| ```cross``` | bool | 全仓(true)/逐仓(false) |
| ```dual``` | bool | 双向持仓(true)/单向持仓(false) |
| ```unified``` | bool | 统一账户(true)/普通账户(false) |
| ```trade_margin``` | 无 | 切换至逐仓杠杆模式 |
| ```trade_super_margin``` | 无 | 切换至全仓杠杆模式 |
| ```trade_normal``` | 无 | 切换回普通现货模式 |
| ```selfTradePreventionMode``` | string | 自成交预防（STP）模式 |

See also: `exchange.IO`

#### exchange.IO("rate", ...)

```
exchange.IO(k, functionNames, maxCalls, period)
exchange.IO(k, functionNames, maxCalls, period, behavior)
```

Forms:

- `exchange.IO("rate", ...)`

```exchange.IO("rate", ...)```与```exchange.IO("quota", ...)```限制API函数的调用频率。

Parameters:

- `k` (string, required): ```k```参数用于设置```exchange.IO()```函数的功能：```"rate"```为平滑限流（令牌桶，允许短时突发），```"quota"```为额度限流（按时间窗口计数，窗口按整点对齐）。
- `functionNames` (string, required): ```functionNames```参数为API函数名（如```GetTicker```、```CreateOrder```、```GetAccount```），多个用逗号分隔共用一条规则；```*```为兜底规则，只作用于没有单独设置规则的函数；```IO/api```对应```exchange.IO("api", ...)```。传空字符串清空全部规则。
- `maxCalls` (number, required): ```maxCalls```参数为一个周期内允许的最大调用次数，小于等于0时删除```functionNames```的规则。```"rate"```模式可以写成字符串```"次数/突发"```，例如```"10/5"```表示每周期10次、最多连续突发5次；不写突发时突发量等于次数。
- `period` (string, required): ```period```参数为周期，写法同Go语言的时间长度：```"500ms"```、```"1s"```、```"1m"```、```"1h30m"```（单位ns、us、ms、s、m、h），也可以写```"1d"```；或者每日重置时间点```"@HHMM"```、```"@HHMMSS"```（北京时间），例如```"@0815"```。
- `behavior` (string, optional): ```behavior```参数为超限时的行为：```"delay"```等待后执行，默认返回空值。

Returns (string / number / bool / object / array / any): 调用成功时返回指令的结果，调用失败时返回空值。

rate模式限流 - 限制GetTicker每秒最多调用10次，超限返回null：

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

rate模式限流 - 使用```"delay"```参数，超限时自动等待而非返回null：

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

多个函数共享限流额度：

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

使用通配符限制所有API调用频率：

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

quota模式 - 严格时间窗口对齐限流：

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

quota模式 - 日内配额，每天指定时间重置：

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

组合使用多个限流规则：

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

**API限流控制（```"rate"``` / ```"quota"```模式）**

```javascript
exchange.IO("rate", functionNames, maxCalls, period, [behavior])
exchange.IO("quota", functionNames, maxCalls, period, [behavior])
```

- **rate**：平滑限流（令牌桶）。桶容量为突发量，按「次数/周期」的速度补充，开始时是满的。
- **quota**：额度限流。每个周期最多调用指定次数，周期按整点对齐（例如```"1m"```在每分钟0秒重置，```"1d"```在UTC零点即北京时间8点重置）。

| 参数 | 类型 | 说明 |
| - | - | - |
| functionNames | string | 函数名，逗号分隔多个；```*```为兜底规则，只作用于没有单独规则的函数 |
| maxCalls | number / string | 时间周期内最大调用次数；```"rate"```可写```"次数/突发"```；小于等于0删除规则 |
| period | string | 时间周期（```"500ms"```/```"1s"```/```"1h30m"```/```"1d"```）或每日重置时间点（```"@0815"```，北京时间） |
| behavior | string | 可选，```"delay"```超限时等待，默认返回null |

> ```Buy```/```Sell```的限流遵循```CreateOrder```的设置。```Go```遵循实际并发函数的设置。```IO/api```仅对```exchange.IO("api", ...)```生效。

  规则按交易所对象分别设置，只在本次运行中有效。超限时默认报错并返回空值，错误信息形如```rate limit exceeded: GetTicker 10/1s```；设置```"delay"```时等待到可以调用为止，停止实盘时等待会被打断。```GetAccount```与```GetAssets```是同一个请求，为其中任一个名字设置的规则对两者都生效。

See also: `exchange.IO`

### Network

网络请求与服务：HTTP请求、WebSocket/TCP等长连接、在策略内提供HTTP/TCP服务（`threading.Serve`）、发送邮件。函数名带```_Go```后缀的是并发版本，配合`EventLoop`等待结果。

#### HttpQuery

```
HttpQuery(url)
HttpQuery(url, options)
```

发送HTTP请求。

Parameters:

- `url` (string, required): HTTP请求的URL地址。
- `options` (object, optional): HTTP请求的相关设置，例如可以采用以下结构：
```json
{
    method: "POST",
    body: "a=10&b=20&c=30",
    charset: "UTF-8",
    cookie: "session_id=12345; lang=en",
    debug: false,
    headers: {"TEST-HTTP-QUERY": "123"},
    timeout: 1000
}
```

- method: 用于设置请求方法。
- body: 用于设置请求体内容，通常用于 POST、PUT 等请求。
- cookie: 用于设置请求中的 Cookie，一般用于携带身份验证信息或会话标识。
- headers: 用于设置请求头信息，可用于指定内容类型、身份验证信息等。
- debug: 设置为```true```时，此次```HttpQuery```函数调用返回完整的应答报文；设置为```false```时，仅返回应答报文```Body```中的数据。
- timeout: 用于设置超时时间，单位为毫秒，例如设置为1000表示超时时间为1秒。
- charset: 用于对请求的应答数据进行转码，例如：GB18030。支持常用编码。

此结构中的所有字段均为可选字段，例如可以不设置```headers```字段。

Returns (string / object): 返回请求的应答数据。如果返回值为```JSON```字符串，在```JavaScript```语言的策略中可以使用```JSON.parse()```函数解析，在```Rust```语言的策略中可以使用```JSONParse()```函数解析。参数```options```结构中的```debug```设置为true时，返回值为对象（JSON）；```debug```设置为false时，返回值为字符串。

请求失败（未收到应答，例如连接被拒绝、DNS解析失败、超时、代理失败）时不会返回```null```，并且会在日志中记录包含请求方法和URL的错误信息：```debug```设置为false时返回空字符串；```debug```设置为true时返回```StatusCode```为0且带有```Error```字段（失败原因）的结构，结构说明参见```HttpQuery-return```。HTTP状态码为4xx、5xx的应答不属于请求失败。

访问OKX公共行情API接口的示例。

```javascript
function main(){
    // GET请求不带参数的示例
    var info = JSON.parse(HttpQuery("https://www.okx.com/api/v5/public/time"))
    Log(info)
    // GET请求带参数的示例
    var ticker = JSON.parse(HttpQuery("https://www.okx.com/api/v5/market/books?instId=BTC-USDT"))
    Log(ticker)
}
```

```python
import json
import urllib.request
def main():
    # HttpQuery不支持Python，可以使用urllib/urllib2库代替
    info = json.loads(urllib.request.urlopen("https://www.okx.com/api/v5/public/time").read().decode('utf-8'))
    Log(info)
    ticker = json.loads(urllib.request.urlopen("https://www.okx.com/api/v5/market/books?instId=BTC-USDT").read().decode('utf-8'))
    Log(ticker)
```

```rust
fn main() {
    // GET请求不带参数的示例，Rust 中由返回值的类型注解决定返回 Body 字符串（String）还是完整应答（HttpRet）
    let body: String = HttpQuery("https://www.okx.com/api/v5/public/time", None);
    let info = JSONParse(&body).unwrap();
    Log!(info);
    // GET请求带参数的示例
    let body2: String = HttpQuery("https://www.okx.com/api/v5/market/books?instId=BTC-USDT", None);
    let ticker = JSONParse(&body2).unwrap();
    Log!(ticker);
}
```

HttpQuery函数使用代理设置的示例。

```javascript
function main() {
    // 本次调用设置代理并发送HTTP请求，不使用用户名和密码，此次HTTP请求将通过代理发送
    HttpQuery("socks5://127.0.0.1:8889/http://www.baidu.com/")

    // 本次调用设置代理并发送HTTP请求，使用用户名和密码，代理设置仅对当前HttpQuery调用生效，之后再次调用HttpQuery("http://www.baidu.com")时不会使用代理
    HttpQuery("socks5://username:password@127.0.0.1:8889/http://www.baidu.com/")
}
```

```python
# HttpQuery不支持Python，可以使用Python的urllib2库
```

```rust
fn main() {
    // 本次调用设置代理并发送HTTP请求，不使用用户名和密码，此次HTTP请求将通过代理发送
    let ret1: String = HttpQuery("socks5://127.0.0.1:8889/http://www.baidu.com/", None);

    // 本次调用设置代理并发送HTTP请求，使用用户名和密码，代理设置仅对当前HttpQuery调用生效，之后再次调用HttpQuery("http://www.baidu.com")时不会使用代理
    let ret2: String = HttpQuery("socks5://username:password@127.0.0.1:8889/http://www.baidu.com/", None);
}
```

```HttpQuery()```函数支持```JavaScript```、```Rust```语言，```Python```语言可以使用```urllib```库直接发送HTTP请求。```HttpQuery()```主要用于访问交易所无需签名的接口，例如行情信息等公共接口。
回测系统中可以使用```HttpQuery()```发送请求（仅支持```GET```请求）获取数据。回测时最多允许访问20个不同的```URL```，并且```HttpQuery()```会缓存访问数据：再次访问相同的```URL```时，```HttpQuery()```函数直接返回缓存数据，不再发起实际的网络请求。

See also: `HttpQuery_Go`

#### HttpQuery_Go

```
HttpQuery_Go(url)
HttpQuery_Go(url, options)
```

发送Http请求，是```HttpQuery```函数的异步版本。

Parameters:

- `url` (string, required): Http请求的URL地址。
- `options` (object, optional): Http请求的相关设置，例如可以采用以下结构：
```json
{
    method: "POST",
    body: "a=10&b=20&c=30",
    charset: "UTF-8",
    cookie: "session_id=12345; lang=en",
    debug: false,
    headers: {"TEST-HTTP-QUERY": "123"},
    timeout: 1000
}
```

- debug：设置为```true```时，此次```HttpQuery_Go```函数调用返回完整的应答报文；设置为```false```时，仅返回应答报文```Body```中的数据。
- timeout：超时设置，单位为毫秒，例如设置为1000表示超时时间为1秒。

此结构中的所有字段均为可选字段，例如可以不设置```headers```字段。
```HttpQuery_Go```函数的```options```参数与```HttpQuery```函数的```options```参数一致，此处不再赘述。

Returns (object): ```HttpQuery_Go()```函数会立即返回一个并发对象，可以调用该并发对象的```wait```方法获取Http请求的结果，在```JavaScript```语言的策略中可以使用```JSON.parse()```函数解析该结果。```wait```方法获取的结果与```HttpQuery```函数的返回值相同，请求失败时的返回值也相同（```debug```为false时返回空字符串，为true时返回```StatusCode```为0且包含```Error```字段的结构）。

异步访问交易所公共接口，获取聚合行情数据。

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
# 不支持
```

```HttpQuery_Go()```函数仅支持```JavaScript```语言，```Python```语言可以使用```urllib```库直接发送Http请求。```HttpQuery_Go()```函数主要用于访问交易所无需签名的接口，例如行情信息等公共接口。回测系统不支持```HttpQuery_Go```函数。

See also: `HttpQuery`

#### Dial

```
Dial(address)
Dial(address, timeout)
Dial(address, options)
```

用于原始 ```Socket``` 访问，支持 ```tcp```、```udp```、```tls```、```unix``` 协议。支持 4 种主流通信协议：```mqtt```、```nats```、```amqp```、```kafka```。同时支持连接数据库，可用的数据库包括：```sqlite3```、```mysql```、```postgres```、```clickhouse```。

Parameters:

- `address` (string, required): 请求地址。
- `timeout` (number, optional): 超时时间（单位：秒）。
- `options` (object, optional): 配置选项。

Returns (object): 

Dial 函数调用示例：

```javascript
function main(){
    // Dial 支持 tcp://、udp://、tls://、unix:// 协议，可传入一个参数指定超时秒数
    var client = Dial("tls://www.baidu.com:443")
    if (client) {
        // write 可额外传入一个数字参数指定超时，返回成功发送的字节数
        client.write("GET / HTTP/1.1\nConnection: Closed\n\n")
        while (true) {
            // read 可额外传入一个数字参数指定超时，单位：毫秒；返回 null 表示出错、超时或 socket 已关闭
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
    // Dial 支持 tcp://、udp://、tls://、unix:// 协议，可使用 Dial::new(addr, timeout) 指定超时秒数
    let mut client = Dial("tls://www.baidu.com:443");
    if client.Valid() {
        // write 的第二个数字参数用于指定超时，返回成功发送的字节数
        client.write("GET / HTTP/1.1\nConnection: Closed\n\n", 0);
        loop {
            // read 的数字参数用于指定超时，单位：毫秒；返回空字符串表示出错、超时或 socket 已关闭
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

访问币安（Binance）的 WebSocket 行情接口：

```javascript
function main() {
    LogStatus("Connecting...")
    // 访问币安的 WebSocket 接口
    var client = Dial("wss://stream.binance.com:9443/ws/!ticker@arr")
    if (!client) {
        Log("Connection failed, exiting")
        return
    }

    while (true) {
        // read 仅返回调用 read 之后接收到的数据
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
        _.each(obj, function(ticker) {
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
            table["rows"].append([obj[i]["s"], obj[i]["h"], obj[i]["l"], obj[i]["b"], obj[i]["a"], obj[i]["c"], obj[i]["q"], _D(int(obj[i]["E"]))])
        LogStatus('`' + json.dumps(table) + '`')
    client.close()
```

```rust
fn main() {
    LogStatus!("Connecting...");
    // 访问币安的 WebSocket 接口
    let mut client = Dial("wss://stream.binance.com:9443/ws/!ticker@arr");
    if !client.Valid() {
        Log!("Connection failed, exiting");
        return;
    }

    loop {
        // read 仅返回调用 read 之后接收到的数据
        let buf = client.read(0);
        if buf == "" {
            break;
        }
        let obj = JSONParse(&buf).unwrap();
        // Rust SDK 没有 JSON 序列化功能，此处使用字符串拼接来构造状态栏表格的 JSON 文本
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

访问币安（Binance）的 WebSocket 接口，并设置 wss 请求头。

```javascript
function main() {
    let options = {"headers": {"X-MBX-APIKEY": "your access key"}}
    let random = `fmz${UnixNano()}`
    let ts = new Date().getTime()
    let secretKey = "your secret key"
    let topic = "com_announcement_en"
    let payload = `random=${random}&topic=${topic}&recvWindow=30000&timestamp=${ts}`
    let signature = Encode("sha256", "string", "hex", payload, "string", secretKey)
    let query = `?${payload}&signature=${signature}`

    Log("query:", query)
    let conn = Dial(`wss://api.binance.com/sapi/wss${query}`, options)

    for (var i = 0 ; i < 10 ; i++) {
        let ret = conn.read()
        Log(ret)
    }
}
```

```python
import time

def main():
    options = {"headers": {"X-MBX-APIKEY": "your access key"}}
    random = "fmz" + str(UnixNano())
    ts = int(time.time() * 1000)
    secretKey = "your secret key"
    topic = "com_announcement_en"
    payload = f"random={random}&topic={topic}&recvWindow=30000&timestamp={ts}"
    signature = Encode("sha256", "string", "hex", payload, "string", secretKey)
    query = f"?{payload}&signature={signature}"

    Log("query:", query)
    conn = Dial(f"wss://api.binance.com/sapi/wss{query}", options)

    for i in range(10):
        ret = conn.read()
        Log(ret)
```

```rust
fn main() {
    // Rust 中使用 Dial::with_options()，以 JSON 字符串形式传入 options 设置请求头
    let options = r#"{"headers": {"X-MBX-APIKEY": "your access key"}}"#;
    let random = format!("fmz{}", UnixNano());
    let ts = Unix() * 1000;
    let secretKey = "your secret key";
    let topic = "com_announcement_en";
    let payload = format!("random={}&topic={}&recvWindow=30000&timestamp={}", random, topic, ts);
    let signature = Encode("sha256", "string", "hex", &payload, "string", secretKey);
    let query = format!("?{}&signature={}", payload, signature);

    Log!("query:", query);
    let mut conn = Dial::with_options(&format!("wss://api.binance.com/sapi/wss{}", query), options);

    for _i in 0..10 {
        let ret = conn.read(0);
        Log!(ret);
    }
}
```

访问 OKX 的 WebSocket 行情接口：

```javascript
var ws = null
function main(){
    var param = {
        "op": "subscribe",
        "args": [{
            "channel": "tickers",
            "instId": "BTC-USDT"
        }]
    }
    // 调用 Dial 函数时，指定 reconnect=true 即可启用重连模式，指定 payload 即为重连时发送的消息。当 WebSocket 连接断开后，将自动重连并自动发送该消息
    ws = Dial("wss://ws.okx.com:8443/ws/v5/public|compress=gzip_raw&mode=recv&reconnect=true&payload="+ JSON.stringify(param))
    if(ws){
        var pingCyc = 1000 * 20
        var lastPingTime = new Date().getTime()
        while(true){
            var nowTime = new Date().getTime()
            var ret = ws.read()
            Log("ret:", ret)
            if(nowTime - lastPingTime > pingCyc){
                var retPing = ws.write("ping")
                lastPingTime = nowTime
                Log("Sending: ping", "#FF0000")
            }
            LogStatus("Current time:", _D())
            Sleep(1000)
        }
    }
}

function onexit() {
    ws.close()
    Log("Exiting")
}
```

```python
import json
import time

ws = None
def main():
    global ws
    param = {
        "op": "subscribe",
        "args": [{
            "channel": "tickers",
            "instId": "BTC-USDT"
        }]
    }
    ws = Dial("wss://ws.okx.com:8443/ws/v5/public|compress=gzip_raw&mode=recv&reconnect=true&payload=" + json.dumps(param))
    if ws:
        pingCyc = 1000 * 20
        lastPingTime = time.time() * 1000
        while True:
            nowTime = time.time() * 1000
            ret = ws.read()
            Log("ret:", ret)
            if nowTime - lastPingTime > pingCyc:
                retPing = ws.write("ping")
                lastPingTime = nowTime
                Log("Sending: ping", "#FF0000")
            LogStatus("Current time:", _D())
            Sleep(1000)

def onexit():
    ws.close()
    Log("Exiting")
```

```rust
fn main() {
    let param = r#"{"op":"subscribe","args":[{"channel":"tickers","instId":"BTC-USDT"}]}"#;
    // 调用 Dial 函数时，指定 reconnect=true 即可启用重连模式，指定 payload 即为重连时发送的消息。当 WebSocket 连接断开后，将自动重连并自动发送该消息
    let mut ws = Dial(&format!("wss://ws.okx.com:8443/ws/v5/public|compress=gzip_raw&mode=recv&reconnect=true&payload={}", param));
    if ws.Valid() {
        let pingCyc = 1000 * 20;
        let mut lastPingTime = Unix() * 1000;
        loop {
            let nowTime = Unix() * 1000;
            let ret = ws.read(0);
            Log!("ret:", ret);
            if nowTime - lastPingTime > pingCyc {
                let retPing = ws.write("ping", 0);
                lastPingTime = nowTime;
                Log!("Sending: ping", "#FF0000");
            }
            LogStatus!("Current time:", _D(None));
            Sleep(1000);
        }
    }
    // 在 Rust 中，连接对象在离开作用域时会自动关闭，也可以显式调用 ws.close()
}
```

访问火币交易所的 WebSocket 行情接口：

```javascript
var ws = null

function main(){
    var param = {"sub": "market.btcusdt.detail", "id": "id1"}
    ws = Dial("wss://api.huobi.pro/ws|compress=gzip&mode=recv&reconnect=true&payload="+ JSON.stringify(param))
    if(ws){
        while(1){
            var ret = ws.read()
            Log("ret:", ret)
            // 响应心跳包操作
            try {
                var jsonRet = JSON.parse(ret)
                if(typeof(jsonRet.ping) == "number") {
                    var strPong = JSON.stringify({"pong" : jsonRet.ping})
                    ws.write(strPong)
                    Log("Responding to ping, sending pong:", strPong, "#FF0000")
                }
            } catch(e) {
                Log("e.name:", e.name, "e.stack:", e.stack, "e.message:", e.message)
            }

            LogStatus("Current time:", _D())
            Sleep(1000)
        }
    }
}

function onexit() {
    ws.close()
    Log("Executing ws.close()")
}
```

```python
import json
ws = None

def main():
    global ws
    param = {"sub" : "market.btcusdt.detail", "id" : "id1"}
    ws = Dial("wss://api.huobi.pro/ws|compress=gzip&mode=recv&reconnect=true&payload=" + json.dumps(param))
    if ws:
        while True:
            ret = ws.read()
            Log("ret:", ret)
            # 响应心跳包操作
            try:
                jsonRet = json.loads(ret)
                if "ping" in jsonRet and type(jsonRet["ping"]) == int:
                    strPong = json.dumps({"pong" : jsonRet["ping"]})
                    ws.write(strPong)
                    Log("Responding to ping, sending pong:", strPong, "#FF0000")
            except Exception as e:
                Log("e:", e)

            LogStatus("Current time:", _D())
            Sleep(1000)

def onexit():
    ws.close()
    Log("Executing ws.close()")
```

```rust
fn main() {
    let param = r#"{"sub":"market.btcusdt.detail","id":"id1"}"#;
    let mut ws = Dial(&format!("wss://api.huobi.pro/ws|compress=gzip&mode=recv&reconnect=true&payload={}", param));
    if ws.Valid() {
        loop {
            let ret = ws.read(0);
            Log!("ret:", ret);
            // 响应心跳包操作，Rust 中使用 JSONParse() 解析，解析失败返回 None
            if let Some(jsonRet) = JSONParse(&ret) {
                if jsonRet["ping"].is_number() {
                    let strPong = format!(r#"{{"pong":{}}}"#, jsonRet["ping"].as_i64().unwrap_or(0));
                    ws.write(&strPong, 0);
                    Log!("Responding to ping, sending pong:", strPong, "#FF0000");
                }
            }

            LogStatus!("Current time:", _D(None));
            Sleep(1000);
        }
    }
    // Rust 中连接对象在离开作用域时自动关闭，也可以显式调用 ws.close()
}
```

访问 OKX 的 WebSocket 验证接口：

```javascript
function getLogin(pAccessKey, pSecretKey, pPassphrase) {
    // 签名函数，用于生成登录请求
    var ts = (new Date().getTime() / 1000).toString()
    var login = {
        "op": "login",
        "args":[{
            "apiKey"    : pAccessKey,
            "passphrase" : pPassphrase,
            "timestamp" : ts,
            "sign" : exchange.Encode("sha256", "string", "base64", ts + "GET" + "/users/self/verify", "string", pSecretKey)
        }]
    }
    return login
}

var client_private = null
function main() {
    // 由于 read 函数设置了超时，需过滤超时报错，否则会产生冗余的错误输出
    SetErrorFilter("timeout")

    // 持仓频道的订阅信息
    var posSubscribe = {
        "op": "subscribe",
        "args": [{
            "channel": "positions",
            "instType": "ANY"
        }]
    }

    var accessKey = "xxx"
    var secretKey = "xxx"
    var passphrase = "xxx"

    client_private = Dial("wss://ws.okx.com:8443/ws/v5/private")
    client_private.write(JSON.stringify(getLogin(accessKey, secretKey, passphrase)))
    Sleep(3000)  // 登录后不能立即订阅私有频道，需等待服务器响应
    client_private.write(JSON.stringify(posSubscribe))
    if (client_private) {
        var lastPingTS = new Date().getTime()
        while (true) {
            var buf = client_private.read(-1)
            if (buf) {
                Log(buf)
            }

            // 检测到连接断开后重连
            if (buf == "" && client_private.write(JSON.stringify(posSubscribe)) == 0) {
                Log("Detected disconnection, closing connection, reconnecting")
                client_private.close()
                client_private = Dial("wss://ws.okx.com:8443/ws/v5/private")
                client_private.write(JSON.stringify(getLogin(accessKey, secretKey, passphrase)))
                Sleep(3000)
                client_private.write(JSON.stringify(posSubscribe))
            }

            // 发送心跳包
            var nowPingTS = new Date().getTime()
            if (nowPingTS - lastPingTS > 10 * 1000) {
                client_private.write("ping")
                lastPingTS = nowPingTS
            }
        }
    }
}

function onexit() {
    var ret = client_private.close()
    Log("Connection closed!", ret)
}
```

```python
import json
import time

def getLogin(pAccessKey, pSecretKey, pPassphrase):
    ts = str(time.time())
    login = {
        "op": "login",
        "args":[{
            "apiKey"    : pAccessKey,
            "passphrase" : pPassphrase,
            "timestamp" : ts,
            "sign" : exchange.Encode("sha256", "string", "base64", ts + "GET" + "/users/self/verify", "string", pSecretKey)
        }]
    }
    return login

client_private = None
def main():
    global client_private
    SetErrorFilter("timeout")

    posSubscribe = {
        "op": "subscribe",
        "args": [{
            "channel": "positions",
            "instType": "ANY"
        }]
    }

    accessKey = "xxx"
    secretKey = "xxx"
    passphrase = "xxx"

    client_private = Dial("wss://ws.okx.com:8443/ws/v5/private")
    client_private.write(json.dumps(getLogin(accessKey, secretKey, passphrase)))
    Sleep(3000)
    client_private.write(json.dumps(posSubscribe))
    if client_private:
        lastPingTS = time.time() * 1000
        while True:
            buf = client_private.read(-1)
            if buf:
                Log(buf)

            if buf == "" and client_private.write(json.dumps(posSubscribe)) == 0:
                Log("Detected disconnection, closing connection, reconnecting")
                ret = client_private.close()
                client_private = Dial("wss://ws.okx.com:8443/ws/v5/private")
                client_private.write(json.dumps(getLogin(accessKey, secretKey, passphrase)))
                Sleep(3000)
                client_private.write(json.dumps(posSubscribe))

            nowPingTS = time.time() * 1000
            if nowPingTS - lastPingTS > 10 * 1000:
                client_private.write("ping")
                lastPingTS = nowPingTS

def onexit():
    ret = client_private.close()
    Log("Connection closed!", ret)
```

```rust
fn getLogin(pAccessKey: &str, pSecretKey: &str, pPassphrase: &str) -> String {
    // 签名函数，用于生成登录请求。Rust 中没有 exchange.Encode 成员函数，因此使用全局 Encode 函数计算签名
    let ts = format!("{}", Unix());
    let sign = Encode("sha256", "string", "base64", &format!("{}GET/users/self/verify", ts), "string", pSecretKey);
    format!(r#"{{"op":"login","args":[{{"apiKey":"{}","passphrase":"{}","timestamp":"{}","sign":"{}"}}]}}"#, pAccessKey, pPassphrase, ts, sign)
}

fn main() {
    // 由于 read 函数设置了超时，需过滤超时报错，否则会产生冗余的错误输出
    SetErrorFilter("timeout");

    // 持仓频道的订阅信息
    let posSubscribe = r#"{"op":"subscribe","args":[{"channel":"positions","instType":"ANY"}]}"#;

    let accessKey = "xxx";
    let secretKey = "xxx";
    let passphrase = "xxx";

    let mut client_private = Dial("wss://ws.okx.com:8443/ws/v5/private");
    client_private.write(&getLogin(accessKey, secretKey, passphrase), 0);
    Sleep(3000);  // 登录后不能立即订阅私有频道，需等待服务器响应
    client_private.write(posSubscribe, 0);
    if client_private.Valid() {
        let mut lastPingTS = Unix() * 1000;
        loop {
            let buf = client_private.read(-1);
            if buf != "" {
                Log!(buf);
            }

            // 检测到连接断开后重连
            if buf == "" && client_private.write(posSubscribe, 0) == 0 {
                Log!("Detected disconnection, closing connection, reconnecting");
                client_private.close();
                client_private = Dial("wss://ws.okx.com:8443/ws/v5/private");
                client_private.write(&getLogin(accessKey, secretKey, passphrase), 0);
                Sleep(3000);
                client_private.write(posSubscribe, 0);
            }

            // 发送心跳包
            let nowPingTS = Unix() * 1000;
            if nowPingTS - lastPingTS > 10 * 1000 {
                client_private.write("ping", 0);
                lastPingTS = nowPingTS;
            }
        }
    }
}
```

访问 CoinEx 的 WebSocket 验证接口：

```javascript
var conn = null
function main() {
    var accessKey = "your accessKey"

    var ts = new Date().getTime()
    var signature = exchange.Encode("sha256", "string", "hex", String(ts), "string", "{{secretkey}}")
    Log("signature:", signature)

    var payload = {
        "id": 1,
        "method": "server.sign",
        "params": {
            "access_id": accessKey,
            "signed_str": signature,
            "timestamp": ts,
        }
    }
    Log(`JSON.stringify(payload):`, JSON.stringify(payload))

    conn = Dial("wss://socket.coinex.com/v2/futures|compress=gzip&mode=recv&payload=" + JSON.stringify(payload))
    if (!conn) {
        throw "stop"
    }
    Log("Dial ... ", conn.read())

    // 订阅持仓推送
    conn.write(JSON.stringify({
        "method": "position.subscribe",
        "params": {"market_list": ["BTCUSDT"]},
        "id": 1
    }))

    while (true) {
        var msg = conn.read()
        if (msg) {
            Log("msg:", msg)
        }
    }
}

function onexit() {
    conn.close()
}
```

```python
// 略
```

```rust
fn main() {
    let accessKey = "your accessKey";

    let ts = Unix() * 1000;
    // Rust 没有 exchange.Encode 成员函数，无法使用 {{secretkey}} 模板替换，使用全局 Encode 函数直接传入秘钥计算签名
    let signature = Encode("sha256", "string", "hex", &format!("{}", ts), "string", "your secretKey");
    Log!("signature:", signature);

    // Rust SDK 没有 JSON 序列化功能，使用字符串拼接构造 payload 的 JSON 文本
    let payload = format!(r#"{{"id":1,"method":"server.sign","params":{{"access_id":"{}","signed_str":"{}","timestamp":{}}}}}"#, accessKey, signature, ts);
    Log!("payload:", payload);

    let mut conn = Dial(&format!("wss://socket.coinex.com/v2/futures|compress=gzip&mode=recv&payload={}", payload));
    if !conn.Valid() {
        Panic!("stop");
    }
    Log!("Dial ... ", conn.read(0));

    // 订阅持仓推送
    conn.write(r#"{"method":"position.subscribe","params":{"market_list":["BTCUSDT"]},"id":1}"#, 0);

    loop {
        let msg = conn.read(0);
        if msg != "" {
            Log!("msg:", msg);
        }
    }
}
```

以下示例演示如何访问 MEXC 交易所的```Websocket```接口，订阅```public.aggre.deals.v3.api.pb```频道，并使用```protobuf.js```解码二进制数据：

```javascript
let strPushDataV3ApiWrapper = `syntax = "proto3";


option java_package = "com.mxc.push.common.protobuf";
option optimize_for = SPEED;
option java_multiple_files = true;
option java_outer_classname = "PushDataV3ApiWrapperProto";

message PublicAggreDealsV3Api {

  repeated PublicAggreDealsV3ApiItem deals  = 1;
  string eventType = 2;
}

message PublicAggreDealsV3ApiItem {
  string price = 1;
  string quantity = 2;
  int32 tradeType = 3;
  int64 time = 4;
}

message PushDataV3ApiWrapper {
  string channel = 1;
  oneof body {
    PublicAggreDealsV3Api publicAggreDeals = 314;
  }

  optional string symbol = 3;
  optional string symbolId = 4;
  optional int64 createTime = 5;
  optional int64 sendTime = 6;
}`

let code = HttpQuery("https://cdnjs.cloudflare.com/ajax/libs/protobufjs/7.5.3/protobuf.js")
let exports = {}
let module = { exports }
new Function("module", "exports", code)(module, exports)
let protobuf = module.exports

function main() {
    const PushDataV3ApiWrapper = protobuf.parse(strPushDataV3ApiWrapper).root.lookupType("PushDataV3ApiWrapper")

    var payload = {
        "method": "SUBSCRIPTION",
        "params": [
            "spot@public.aggre.deals.v3.api.pb@100ms@BTCUSDT"
        ]
    }

    // proxy=socks5://x.x.x.x:xxxx
    var conn = Dial("wss://wbs-api.mexc.com/ws|payload=" + JSON.stringify(payload))

    var data = null
    while (true) {
        var ret = conn.read()
        if (ret) {
            const uint8arrayData = new Uint8Array(ret)
            const message = PushDataV3ApiWrapper.decode(uint8arrayData)

            data = PushDataV3ApiWrapper.toObject(message, {
              longs: String,
              enums: String,
              bytes: String,
              defaults: true,
              arrays: true,
              objects: true
            })
            Log("data:", data)
        }
        LogStatus(_D(), data)
    }
}
```

```python
# 可以使用 Python 中相应的库实现编码与解码。
```

Dial函数连接数据库时返回的连接对象具有2个独有的方法函数：

- ```exec(sqlString)```：用于执行SQL语句，用法与```DBExec()```函数类似。

- ```fd()```：该函数返回一个句柄（例如句柄变量为handle），用于在其它线程中重连。即使由Dial创建的连接对象已通过```close()```函数关闭，也可将该句柄传入```Dial()```函数（例如```Dial(handle)```）以重用连接。

以下是使用Dial函数连接```sqlite3```数据库的示例。

```javascript
var client = null
function main() {
    // client = Dial("sqlite3://:memory:")   // 使用内存数据库
    client = Dial("sqlite3://test1.db")      // 打开/连接托管者所在目录的数据库文件

    // 记录句柄
    var sqlite3Handle = client.fd()
    Log("sqlite3Handle:", sqlite3Handle)

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
// 不支持
```

```rust
fn main() {
    // let mut client = Dial("sqlite3://:memory:");   // 使用内存数据库
    let mut client = Dial("sqlite3://test1.db");      // 打开/连接托管者所在目录的数据库文件

    // Rust 的连接对象不支持 fd() 方法

    // 查询数据库中的表
    let ret = client.exec("SELECT name FROM sqlite_master WHERE type='table'");
    Log!(format!("{:?}", ret));

    Log!("Executing client.close()");
    client.close();
}
```

```address```参数的详细说明：在标准地址```wss://ws.okx.com:8443/ws/v5/public```之后，使用```|```符号进行分隔。如果参数字符串中包含```|```字符，则使用```||```作为分隔符。分隔符之后的部分为功能参数设置，各参数之间使用```&```字符连接。

例如，同时设置```ss5```代理和压缩参数时，可以写作：

```Dial("wss://ws.okx.com:8443/ws/v5/public|proxy=socks5://xxx:9999&compress=gzip_raw&mode=recv")```

| Dial函数的address参数支持的功能 | 参数说明 |
| - | - |
| WebSocket协议数据压缩相关的参数：compress=参数值 | compress用于指定压缩方式，可选值包括gzip_raw、gzip等。如果所用的gzip并非标准gzip，可以使用扩展方式：gzip_raw |
| WebSocket协议数据压缩相关的参数：mode=参数值 | mode用于指定压缩模式，可选dual、send、recv三种。dual表示双向压缩，即同时发送和接收压缩数据；send表示仅发送压缩数据；recv表示仅接收压缩数据并在本地解压缩。 |
| WebSocket协议启用compression设置：enableCompression=true | 使用enableCompression=false可关闭该设置，默认不启用。 |
| WebSocket协议设置底层自动重连相关的参数：reconnect=参数值 | reconnect用于设置是否自动重连，reconnect=true表示启用重连。未设置该参数时默认不重连。 |
| WebSocket协议设置底层自动重连相关的参数：interval=参数值 | interval为重试的时间间隔，单位为毫秒。例如interval=10000表示重试间隔为10秒；未设置时默认为1秒，即interval=1000。 |
| WebSocket协议设置底层自动重连相关的参数：payload=参数值 | payload为WebSocket重连时需要发送的订阅消息，例如：payload=okok。 |
| socks5代理的相关参数：proxy=参数值 | proxy用于设置ss5代理，参数值格式为：socks5://name:pwd@192.168.0.1:1080。其中name为ss5服务端的用户名，pwd为ss5服务端的登录密码，1080为ss5服务的端口。 |
| WebSocket接收缓冲区上限：qsize=参数值 | qsize为接收缓冲区最多保存的消息条数，不设置时默认4096。 |
| WebSocket接收缓冲区上限：qbytes=参数值 | qbytes为接收缓冲区最多保存的字节数，不设置时默认16777216（16MB）。 |

```Dial()```函数仅支持实盘。

使用Dial函数连接数据库时，连接字符串的编写方式可参考各数据库对应的Go语言驱动项目。

| 支持的数据库 | 驱动项目 | 连接字符串（Connection String） | 备注 |
| - | - | - | - |
| sqlite3 | github.com/mattn/go-sqlite3 | sqlite3://file:test.db?cache=shared&mode=memory | ```sqlite3://```前缀表示使用的是sqlite3数据库，调用示例：```Dial("sqlite3://test1.db")``` |
| mysql | github.com/go-sql-driver/mysql | mysql://username:yourpassword@tcp(localhost:3306)/yourdatabase?charset=utf8mb4 | -- |
| postgres | github.com/lib/pq | postgres://user=postgres dbname=yourdatabase sslmode=disable password=yourpassword host=localhost port=5432 | -- |
| clickhouse | github.com/ClickHouse/clickhouse-go | clickhouse://tcp://host:9000?username=username&password=yourpassword&database=youdatabase | -- |

需要注意，当```address```参数中设置的```payload```内容包含字符```=```或其它特殊字符时，可能会影响```Dial```函数对```address```参数的解析，示例如下。

backPack交易所websocket私有接口调用示例：
```js
var client = null

function main() {
    // base64编码的秘钥对公钥，即在FMZ上配置的access key
    var base64ApiKey = "xxx"

    var ts = String(new Date().getTime())
    var data = "instruction=subscribe&timestamp=" + ts + "&window=5000"

    // 由于signEd25519最终返回的是base64编码，其中会有字符"="
    var signature = signEd25519(data)

    // payload 被JSON编码后可能包含字符"="
    payload = {
        "method": "SUBSCRIBE",
        "params": ["account.orderUpdate"],
        "signature": [base64ApiKey, signature, ts, "5000"]
    }

    client = Dial("wss://ws.backpack.exchange")
    client.write(JSON.stringify(payload))
    if (!client) {
        Log("Connection failed, exiting")
        return
    }

    while (true) {
        var buf = client.read()
        Log(buf)
    }
}

function onexit() {
    client.close()
}

function signEd25519(data) {
    return exchange.Encode("ed25519.seed", "raw", "base64", data, "base64", "{{secretkey}}")
}
```

代码中采用以下调用方式可以正常工作：
```js
client = Dial("wss://ws.backpack.exchange")
client.write(JSON.stringify(payload))
```

如果直接写在```payload```中则无法正常工作，例如：
```js
client = Dial("wss://ws.backpack.exchange|payload=" +
JSON.stringify(payload))
```

目前仅JavaScript语言支持在Dial函数中使用```mqtt```、```nats```、```amqp```、```kafka```通信协议，下面以JavaScript语言策略代码为例，演示```mqtt```、```nats```、```amqp```、```kafka```四种协议的使用方法：

```js
// 需要先配置并部署完成各个协议的代理服务器
// 为了便于演示，主题test_topic的订阅（read操作）与发布（write操作）都在当前这个策略中进行

var arrConn = []
var arrName = []

function main() {
    LogReset(1)
    conn_nats = Dial("nats://admin@127.0.0.1:4222?topic=test_topic")
    conn_mqtt = Dial("mqtt://127.0.0.1:1883?topic=test_topic")
    conn_amqp = Dial("amqp://q:admin@127.0.0.1:5672/?queue=test_Queue")
    conn_kafka = Dial("kafka://localhost:9092/test_topic")
    arrConn = [conn_nats, conn_amqp, conn_mqtt, conn_kafka]
    arrName = ["nats", "amqp", "mqtt", "kafka"]

    while (true) {
        for (var i in arrConn) {
            var conn = arrConn[i]
            var name = arrName[i]

            // 写数据
            conn.write(name + ", time: " + _D() + ", test msg.")

            // 读数据
            var readMsg = conn.read(1000)
            Log(name + " readMsg: ", readMsg, "#FF0000")
        }

        Sleep(1000)
    }
}

function onexit() {
    for (var i in arrConn) {
        arrConn[i].close()
        Log("Closing", arrName[i], "connection")
    }
}
```

详细介绍请参考文档：[探索FMZ：交易策略实盘间通信协议实践](https://www.fmz.com/bbs-topic/10479)

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

```Mail```函数的异步版本。

Parameters:

- `smtpServer` (string, required): 用于指定邮件发送方的```SMTP```服务器地址。
- `smtpUsername` (string, required): 用于指定邮件发送方的邮箱地址。
- `smtpPassword` (string, required): 邮件发送方邮箱的```SMTP```授权密码。
- `mailTo` (string, required): 用于指定邮件接收方的邮箱地址。
- `title` (string, required): 邮件标题。
- `body` (string, required): 邮件正文内容。

Returns (object): ```Mail_Go```函数立即返回一个并发对象，可以使用该并发对象的```wait```方法获取邮件发送结果。邮件发送成功返回真值（例如：```true```），发送失败返回假值（例如：```false```）。

```javascript
function main() {
    var r1 = Mail_Go("smtp.163.com", "asdf@163.com", "password", "111@163.com", "title", "body")
    var r2 = Mail_Go("smtp.163.com", "asdf@163.com", "password", "111@163.com", "title", "body")

    var ret1 = r1.wait()
    var ret2 = r2.wait()

    Log("ret1:", ret1)
    Log("ret2:", ret2)
}
```

```python
# 不支持
```

在回测系统中不起作用。

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

- `k` (string / 空值, optional): 参数```k```为所保存键值对中的键名，不区分大小写。
- `v` (string / number / bool / object / array / 空值, optional): 参数```v```为所保存键值对中的键值，可以是任何能够进行```JSON```序列化的数据。

Returns (string / number / bool / object / array / 空值): 持久化保存的```k-v```键值对中的键值数据。

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
```

数据库接口函数。

Parameters:

- `sql` (string, required): **sql**语句字符串。

Returns (object): 包含**sql**语句执行结果的对象，例如：

    ```json

    {"columns":["TS","HIGH","OPEN","LOW","CLOSE","VOLUME"],"values":[[1518970320000,100,99.1,90,100,12345.6]]}

    ```

支持内存数据库。对于```DBExec```函数的参数，如果**sql**语句以```:```开头，则在内存数据库中执行操作；由于无需写入文件，速度更快。此方式适用于无需持久化保存的数据库操作，例如：

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

使用 ```DBExec()``` 函数创建数据表。

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

对数据表中的记录执行增、删、查、改操作。

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

- 通过向函数```DBExec()```传入参数，可对实盘数据库（SQLite 数据库）进行操作。

  - 可实现对实盘数据库中数据的增、删、查、改等操作，并支持**SQLite**语法。

  - 实盘数据库中的系统保留表包括：```kvdb```、```cfg```、```log```、```profit```、```chart```，请勿对这些表进行操作。

  - 目前不支持**事务**，不建议执行此类操作，否则会引发系统冲突。

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
                  "Time: {}\n".format(_D(channelState["timestamp"])) +
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

        // 构造 HTTP POST 请求，{:?} 会将 body 转义为合法的 JSON 字符串值
        let options = format!(r#"{{"method": "POST", "body": {:?}}}"#, sendData);
        let url = format!("{}/api/v1?method=pub&robot={}&channel={}", baseUrl, robotId, uuid);

        // 发送数据
        let ret: String = HttpQuery(&url, options.as_str());
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

传入的数据参数```data```在JSON序列化后的字节长度不得超过1024字节，超出限制可能导致数据发布失败。建议仅传输必要的状态信息，避免传输过大的数据对象。

发布的数据应根据硬件设备的内存和网络带宽合理使用，避免发布过大的数据对象。

```SetChannelData()```函数发布的数据不仅可以被FMZ平台内的其他实盘订阅，还支持跨平台数据发送功能。外部平台（如TradingView的Webhook告警、第三方交易系统、监控软件等）可以通过HTTP POST请求向指定的FMZ实盘发送数据。

**跨平台发送数据的方式：** 外部系统通过HTTP POST请求将数据发送到FMZ平台API端点：```https://www.fmz.com/api/v1?method=pub&robot={robotId}&channel={uuid}```，其中```robotId```为目标实盘ID，```uuid```为32位字符的频道标识符。发送的数据在请求body中传递，可以是JSON格式、文本或其他格式。注意：必须先有实盘订阅该UUID频道，外部系统才能成功发送数据；广播的数据会发送到```robotId```实盘所在托管者下的所有实盘，同一托管者下订阅了该UUID频道的实盘均可接收数据。

See also: `GetChannelData`; `_G`

#### GetChannelData

```
GetChannelData(channelId)
```

订阅指定实盘的频道数据。该函数用于实盘间通信，可获取其他实盘通过```SetChannelData()```函数发布的最新状态数据。

Parameters:

- `channelId` (string / number, required): 频道标识符，支持以下两种类型：

1. **实盘ID**：用于订阅其他实盘的频道数据（即实盘间通信），可通过```_G()```函数获取实盘ID。

2. **32位UUID**：用于订阅跨平台发送的数据（即外部系统通过HTTP API向FMZ平台发送的数据）。

Returns (object / array / string / number / bool / 空值): 返回所订阅频道的最新状态数据。首次调用时返回```null```，需要重试。数据结构由广播端发布的数据决定。

频道订阅端示例 - 订阅两个实盘的频道数据

```javascript
function main() {
    // 需要订阅的两个频道 ID（请根据实际情况修改）
    var channelId1 = "632799"  // 频道 1 的实盘 ID
    var channelId2 = "632800"  // 频道 2 的实盘 ID

    while(true) {
        // 订阅频道 1 的当前状态
        var state1 = GetChannelData(channelId1)

        // 订阅频道 2 的当前状态
        var state2 = GetChannelData(channelId2)

        // 构建状态显示
        var statusMsg = "频道订阅端 - 当前订阅状态\n\n"

        // 显示频道 1 状态
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

        // 显示频道 2 状态
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

        Sleep(5000)  // 每 5 秒订阅一次频道
    }
}
```

```python
def main():
    # 需要订阅的两个频道 ID（请根据实际情况修改）
    channelId1 = "632799"  # 频道 1 的实盘 ID
    channelId2 = "632800"  # 频道 2 的实盘 ID

    while True:
        # 订阅频道 1 的当前状态
        state1 = GetChannelData(channelId1)

        # 订阅频道 2 的当前状态
        state2 = GetChannelData(channelId2)

        # 构建状态显示
        statusMsg = "频道订阅端 - 当前订阅状态\n\n"

        # 显示频道 1 状态
        statusMsg += "═══ 频道1 [{}] ═══\n".format(channelId1)
        if state1 is not None:
            statusMsg += "更新ID: #{}\n".format(state1["updateId"])
            statusMsg += "时间: {}\n".format(_D(state1["timestamp"]))
            statusMsg += "交易对: {}\n".format(state1["symbol"])
            statusMsg += "最新价: ${:.2f}\n".format(state1["lastPrice"])
            statusMsg += "成交量: {:.4f}\n".format(state1["volume"])
        else:
            statusMsg += "状态: 等待中... (首次调用返回 None)\n"

        statusMsg += "\n"

        # 显示频道 2 状态
        statusMsg += "═══ 频道2 [{}] ═══\n".format(channelId2)
        if state2 is not None:
            statusMsg += "更新ID: #{}\n".format(state2["updateId"])
            statusMsg += "时间: {}\n".format(_D(state2["timestamp"]))
            statusMsg += "交易对: {}\n".format(state2["symbol"])
            statusMsg += "最新价: ${:.2f}\n".format(state2["lastPrice"])
            statusMsg += "成交量: {:.4f}\n".format(state2["volume"])
        else:
            statusMsg += "状态: 等待中... (首次调用返回 None)\n"

        LogStatus(statusMsg)

        Sleep(5000)  # 每 5 秒订阅一次频道
```

```rust
fn main() {
    // Rust 的 GetChannelData() 函数不接受频道 ID 参数，只能读取当前实盘自身频道
    // （即本实盘通过 SetChannelData() 发布）的最新数据，无法订阅其它实盘的频道
    loop {
        // 订阅频道的当前状态
        let state = GetChannelData();

        // 构建状态显示
        let mut statusMsg = String::from("频道订阅端 - 当前订阅状态\n\n");

        if !state.is_null() {
            statusMsg += &format!("更新ID: #{}\n", state["updateId"].as_i64().unwrap_or(0));
            statusMsg += &format!("时间: {}\n", _D(state["timestamp"].as_i64().unwrap_or(0)));
            statusMsg += &format!("交易对: {}\n", state["symbol"].as_str().unwrap_or(""));
            statusMsg += &format!("最新价: ${:.2}\n", state["lastPrice"].as_f64().unwrap_or(0.0));
            statusMsg += &format!("成交量: {:.4}\n", state["volume"].as_f64().unwrap_or(0.0));
        } else {
            statusMsg += "状态: 等待中... (首次调用返回 null)\n";
        }

        LogStatus!(statusMsg);

        Sleep(5000);  // 每 5 秒订阅一次频道
    }
}
```

跨平台订阅示例 - 使用 UUID 订阅外部系统发送的数据

```javascript
function main() {
    // 使用 32 位 UUID 作为频道标识符
    let uuid = "6BC42A119B5DBFA2188A8279DA3B5C30"

    while (true) {
        // 订阅 UUID 频道的数据
        let data = GetChannelData(uuid)

        if (data !== null) {
            Log("Received cross-platform data:", data)
        } else {
            Log("Waiting for data... (first call returns null)")
        }

        Sleep(10000)  // 每 10 秒检查一次
    }
}
```

```python
def main():
    # 使用 32 位 UUID 作为频道标识符
    uuid = "6BC42A119B5DBFA2188A8279DA3B5C30"

    while True:
        # 订阅 UUID 频道的数据
        data = GetChannelData(uuid)

        if data is not None:
            Log("Received cross-platform data:", data)
        else:
            Log("Waiting for data... (first call returns None)")

        Sleep(10000)  # 每 10 秒检查一次
```

```rust
fn main() {
    // Rust 的 GetChannelData() 函数不接受频道 ID 参数，无法使用 32 位 UUID 订阅跨平台数据，
    // 只能读取当前实盘自身频道（即本实盘通过 SetChannelData() 发布）的最新数据
    loop {
        // 订阅频道的数据
        let data = GetChannelData();

        if !data.is_null() {
            Log!("Received cross-platform data:", data);
        } else {
            Log!("Waiting for data... (first call returns null)");
        }

        Sleep(10000);  // 每 10 秒检查一次
    }
}
```

```GetChannelData()```函数为非阻塞调用，调用后立即返回，不会等待数据接收完成。

首次调用```GetChannelData()```函数时会返回```null```，需要重试并等待频道数据同步完成。

每次调用获取的均为频道上的最新状态数据，而非历史消息队列。

一个实盘可同时订阅多个不同实盘的频道，只需多次调用```GetChannelData()```并分别传入不同的实盘ID即可。

当前实盘也可以订阅自身的频道，即```robotId```参数可以是当前实盘的ID。

频道数据可跨实盘、跨托管者、跨服务器进行传输。

广播端使用```SetChannelData()```函数发布频道数据。

频道通信适用于实盘环境，在回测系统中该功能可能受限。

```GetChannelData()```函数支持跨平台订阅功能。当使用32位UUID作为频道标识符时，可接收来自FMZ平台外部系统通过HTTP API发送的数据。外部系统需同时指定实盘ID和UUID才能发送数据；同一托管者下的所有实盘均可订阅该UUID频道的数据，而不同托管者的实盘则无法订阅。

See also: `SetChannelData`; `_G`

### Threads

并发相关的函数都在这里。`exchange.Go`把耗时的调用放到后台执行，`EventLoop`等待并发调用的结果和事件，这两个函数所有编程语言都可以使用；下面的多线程对象仅支持```JavaScript```。

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

多线程异步支持函数，可将所有受支持函数的操作转换为异步并发执行。

Parameters:

- `method` (string, required): ```method```参数用于指定要并发执行的函数名称，请注意该参数为函数名称字符串，而非函数引用。
- `arg` (string / number / bool / object / array / function / any (平台支持的任意类型), optional): **并发执行函数**的参数，参数```arg```可以有多个。参数```arg```的类型与数量取决于**并发执行函数**的参数定义。

Returns (object): ```exchange.Go()```函数会立即返回一个并发对象，可使用该并发对象的```wait()```方法获取并发请求的结果。

```exchange.Go()```函数的使用范例。判断```undefined```时需使用```typeof(xx) === "undefined"```，因为```null == undefined```在 JavaScript 中是成立的。

```javascript
function main(){
    // 以下四种操作为并发多线程异步执行，不会耗时，会立即返回
    var a = exchange.Go("GetTicker")
    var b = exchange.Go("GetDepth")
    var c = exchange.Go("Buy", 1000, 0.1)
    var d = exchange.Go("GetRecords", PERIOD_H1)

    // 调用 wait 方法等待异步获取 ticker 的结果
    var ticker = a.wait()
    // 返回深度数据，如果获取失败也有可能返回 null
    var depth = b.wait()
    // 返回订单号，限定 1 秒超时，超时返回 undefined，若上次 wait 超时，此对象可继续调用 wait 等待
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
    // Rust 中 exchange.Go 为类型化写法：使用 Go:: 方法 token 指定并发函数，无参数传 ()，有参数传元组
    // 以下四种操作为并发多线程异步执行，不会耗时，会立即返回
    let a = exchange.Go(Go::GetTicker, ());
    let b = exchange.Go(Go::GetDepth, ());
    // Rust 中没有 Buy 的 token，等价于 CreateOrder，第一个参数 "" 表示当前交易对
    let c = exchange.Go(Go::CreateOrder, ("", "buy", 1000, 0.1));
    let d = exchange.Go(Go::GetRecords, (PERIOD_H1,));

    // 调用 wait 方法等待异步获取 ticker 的结果，wait(0) 会阻塞直到并发线程运行完毕（对应 JS 的无参 wait()）
    let ticker = a.wait(0);
    // 返回深度数据，如果获取失败也有可能返回 Err
    let depth = b.wait(0);
    // 返回订单号，限定 1 秒超时，超时返回 Err，若上次 wait 超时，此对象可继续调用 wait 等待
    // 注意：Err 也可能是下单本身失败（与超时无法区分），此时再次 wait 会返回 Err 并记录出错信息
    let mut orderId = c.wait(1000);
    if orderId.is_err() {
        // 超时，重新获取
        orderId = c.wait(0);
    }
    let records = d.wait(0);
}
```

对已释放的并发对象调用其```wait()```方法会报错：

```javascript
function main() {
    var d = exchange.Go("GetRecords", PERIOD_H1)
    // 等待 K 线数据返回结果
    var records = d.wait()
    // 此处对已经 wait 过且已结束的异步操作再次调用 wait，将返回 null，并记录错误信息
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
    // Rust 中 exchange.Go 采用类型化写法：通过 Go:: 方法 token 指定并发函数
    let d = exchange.Go(Go::GetRecords, (PERIOD_H1,));
    // 等待 K 线数据返回结果，wait(0) 会阻塞直到运行完毕（对应 JS 的无参 wait()）
    let records = d.wait(0);
    // 此处对已经 wait 过且已结束的异步操作再次调用 wait，将返回 Err，并记录错误信息
    let ret = d.wait(0);
}
```

并发获取多个交易所行情：

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

并发调用```exchange.IO("api", ...)```函数：

```javascript
function main() {
    /*
        测试OKX期货下单接口
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
        测试OKX期货下单接口
        POST /api/v5/trade/order
    */

    let beginTS = UnixNano() / 1000000;
    // Rust不支持JSON序列化，直接使用原始字符串构造参数
    let param = r#"{"instId":"BTC-USDT-SWAP","tdMode":"cross","side":"buy","ordType":"limit","px":"16000","sz":"1","posSide":"long"}"#;
    // 在Rust中，exchange.Go采用类型化写法，token为Go::IO，参数以元组形式传入
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

自动释放机制的测试

```javascript
function main() {
    var counter = 0
    var arr = []                 // 用于测试持续引用并发对象的相关变量
    var symbols = ["BTC_USDT", "ETH_USDT", "SOL_USDT", "LTC_USDT", "EOS_USDT"]
    while (true) {
        var arrRoutine = []
        for (var symbol of symbols) {
            var r = exchange.Go("GetTicker", symbol)
            arrRoutine.push(r)   // 记录并发对象，用于调用 r.wait() 函数获取结果，每轮循环都会清空
            // arr.push(r)       // 若使用这句代码，运行时会持续引用并发对象，导致其无法自动释放；当并发数超过 2000 时，会报错：```InternalError: too many routine wait, max is 2000```。
            counter++
        }

        // 遍历 arrRoutine 并调用 r.wait() 获取结果

        LogStatus(_D(), "routine number:", counter)
        Sleep(50)
    }
}
```

```rust
fn main() {
    let mut counter = 0;
    let mut arr: Vec<TypedRoutine<Go::GetTicker>> = Vec::new();   // 用于测试持续引用并发对象的相关变量
    let symbols = ["BTC_USDT", "ETH_USDT", "SOL_USDT", "LTC_USDT", "EOS_USDT"];
    loop {
        let mut arrRoutine = Vec::new();
        for symbol in symbols {
            // Rust 中 exchange.Go 为类型化写法，token 为 Go::GetTicker
            let r = exchange.Go(Go::GetTicker, (symbol,));
            arrRoutine.push(r);   // 记录并发对象，用于调用 r.wait(0) 函数获取结果，每轮循环都会清空
            // arr.push(r);       // 若使用这句代码，运行时会持续引用并发对象，导致其无法自动释放；当并发数超过 2000 时，会报错：InternalError: too many routine wait, max is 2000。
            counter += 1;
        }

        // 遍历 arrRoutine 并调用 r.wait(0) 获取结果

        LogStatus!(_D(None), "routine number:", counter);
        Sleep(50);
    }
}
```

该函数仅在实盘运行时创建多线程执行任务，回测不支持多线程并发执行任务（回测中可用，但仍为顺序执行）。

```exchange.Go()```函数返回对象后，可通过该对象调用其```wait()```函数获取线程返回的数据。当并发的多线程任务执行完毕且相关变量不再被引用时，系统底层会自动处理资源回收。

```wait()```方法支持超时参数：

  1、不设置超时参数，即```wait()```，或将超时参数设置为0，即```wait(0)```。此时```wait()```函数会阻塞等待，直到并发线程运行完毕，并返回并发线程的执行结果。

  2、将超时参数设置为-1，即```wait(-1)```。此时```wait()```函数会立即返回，不同编程语言的返回值有所不同，具体可参考本小节的调用示例。

  3、设置具体的超时参数，即```wait(300)```，此时```wait()```函数最多等待300毫秒后返回。

虽然系统底层具有自动回收机制，但如果持续引用相关变量，并发线程将不会被释放。当并发线程数量超过2000个时会报错：```"too many routine wait, max is 2000"```。

支持的函数：```GetTicker```，```GetDepth```，```GetTrades```，```GetRecords```，```GetAccount```，```GetOrders```，```GetOrder```，```CancelOrder```，```Buy```，```Sell```，```GetPositions```，```IO```等。这些函数并发调用时均基于当前`exchange`交易所对象执行。

Python语言与JavaScript语言的区别在于，Python语言中并发对象的```wait()```函数返回两个值，第一个为异步API调用返回的结果，第二个表示异步调用是否完成。

```python
def main():
    d = exchange.Go("GetRecords", PERIOD_D1)
    # ok是一定返回True的, 除非策略被停止
    ret, ok = d.wait()
    # 如果等待超时, 或者wait了一个已经结束的实例，ok返回False
    ret, ok = d.wait(100)
```

See also: `Mail_Go`, `HttpQuery_Go`, `EventLoop`, `exchange.IO`（API 限流控制）

#### EventLoop

```
EventLoop()
EventLoop(timeout)
```

监听事件，当任意```WebSocket```有可读数据，或```exchange.Go()```、```HttpQuery_Go()```等并发任务完成后返回。

Parameters:

- `timeout` (number, optional): 参数```timeout```用于设置超时时间，单位为毫秒。
当```timeout```设置为0时，函数会一直等待，直到有事件发生才返回；当```timeout```大于0时，表示设置事件等待的超时时间；当```timeout```小于0时，则立即返回最近的事件。

Returns (object): 如果返回的对象不为空值，则返回内容中的```Event```字段表示事件的触发类型。例如以下返回值结构：

```json

{"Seq":1,"Event":"Exchange_GetTrades","ThreadId":0,"Index":3,"Nano":1682068771309583400}

```

```javascript
function main() {
    var routine_getTicker = exchange.Go("GetTicker")
    var routine_getDepth = exchange.Go("GetDepth")
    var routine_getTrades = exchange.Go("GetTrades")

    // Sleep(2000)，如果这里使用Sleep语句，会导致之后的EventLoop函数错过之前的事件。因为等待了2秒，并发的函数已经收到了数据，之后才开始EventLoop监听机制，就会错过这些事件
    // 除非在第一行代码就开始调用EventLoop(-1)，先初始化EventLoop的监听机制，才不会错过这些事件

    // Log("GetDepth:", routine_getDepth.wait()) 如果这里提前调用wait函数取出GetDepth函数并发调用的结果，本次GetDepth函数收到请求结果的事件便不会在EventLoop函数中返回
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

    // Sleep(2000)，如果这里使用Sleep语句，会导致之后的EventLoop函数错过之前的事件。因为等待了2秒，并发的函数已经收到了数据，之后才开始EventLoop监听机制，就会错过这些事件
    // 除非在第一行代码就开始调用EventLoop(-1)，先初始化EventLoop的监听机制，才不会错过这些事件

    // Log!("GetDepth:", routine_getDepth.wait(0)) 如果这里提前调用wait函数取出GetDepth函数并发调用的结果，本次GetDepth函数收到请求结果的事件便不会在EventLoop函数中返回
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

代码中首次调用```EventLoop()```函数时，才会初始化该事件监听机制。如果在事件回调发生之后才首次调用```EventLoop()```，则会错过此前的事件。系统底层封装的队列结构最多可缓存500个事件回调，如果程序运行过程中没有及时调用```EventLoop()```函数取出，超出500个缓存上限的较晚事件回调将会丢失。

```EventLoop()```函数的调用不会影响系统底层WebSocket的缓存队列，也不会影响```exchange.Go()```等并发函数的缓存，这些缓存中的数据仍需使用各自的方法取出。对于在```EventLoop()```函数返回之前已经取出的数据，不会在```EventLoop()```函数中再次产生返回事件。

```EventLoop()```函数的主要用途是通知策略层：系统底层已接收到新的网络数据，从而以事件驱动整个策略。当```EventLoop()```函数返回事件时，只需遍历所有数据来源（例如WebSocket连接、```exchange.Go()```创建的对象）尝试获取数据即可。

```EventLoop()```函数仅支持实盘。

在主函数```main()```中调用时，监听主线程的事件。在使用```JavaScript```语言编写的策略中，也可以在```threading.Thread()```函数创建的线程的执行函数中调用，用于监听当前线程的事件。

See also: `Dial`, `exchange.Go`, `HttpQuery_Go`

#### threading

```threading```对象作为全局多线程管理工具，提供了创建并发线程、线程锁、条件变量等功能。本章节介绍```threading```对象的成员函数。仅```JavaScript```语言策略支持该对象。

##### Thread

```
Thread(func, ...args)
Thread(...items)
```

```Thread()```函数用于创建并发线程。

Parameters:

- `func` (function, required): 参数```func```是用于并发执行的函数（通过引用传递），支持传入匿名函数。```func```可接受多个参数，这些参数将在并发执行时通过```...args```传入。因此，```func```的参数列表需要与```...args```保持一致。
- `arg` (string / number / bool / object / array / function / any (平台支持的任意类型), optional): 参数```arg```是在回调执行时传递给```func```（即并发线程执行函数）的实际参数；参数```arg```可以有多个，```func```的参数列表需要与```...args```保持一致。
- `item` (array, required): 参数```item```是一个数组，包含待并发执行的函数引用及其参数。调用```Thread```函数时，参数```item```可以传入多组。

Returns (```Thread```对象): ```Thread()```函数返回一个```Thread```对象，用于管理创建的并发线程、线程通信等。

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

使用 ```Thread(...items)``` 形式创建并发线程，按顺序执行多个函数。

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

    // ret: {"id":1,"terminated":false,"elapsed":337636000,"ret":{"0":0.9339330196380615}}
    Log(ret)
}
```

传入```Thread()```函数用于并发执行的线程函数```func```运行在隔离环境中，因此无法直接引用线程外部的变量，引用时会导致编译失败。同时，线程内不支持引用其他闭包函数。线程内部可以调用平台提供的所有API，但不能调用用户自定义的其他函数。

当线程执行完毕且没有被持续引用时，系统底层会自动回收线程相关的资源，无需显式调用```join()```函数来释放资源。如果存在持续引用导致无法释放资源，当并发数量超过2000个时会报错：```InternalError: too many routine wait, max is 2000```。

支持回测系统、实盘环境；所有并发线程相关的函数在回测系统中仅作为代码兼容性支持，实际不会真正执行并发线程，本章不再赘述。

See also: `getThread`, `mainThread`, `currentThread`, `Lock`,  `Condition`, `Event`, `Dict`, `pending`,  `eventLoop`

##### getThread

```
getThread(threadId)
```

```getThread()```函数用于根据指定的线程ID获取线程对象。

Parameters:

- `threadId` (number, required): 参数```threadId```为线程对象ID，通过指定该参数获取对应的线程对象。

Returns (```Thread```对象): ```getThread()```函数返回由参数threadId指定的```Thread```对象

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

##### mainThread

```
mainThread()
```

```mainThread()```函数用于获取主线程的线程对象，即策略中```main()```函数所在的线程。

Returns (```Thread```对象): ```mainThread()```函数返回主线程的线程对象。

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

##### currentThread

```
currentThread()
```

```currentThread()```函数用于获取当前线程的线程对象。

Returns (```Thread```对象): ```currentThread()```函数返回当前线程的线程对象。

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

##### Lock

```
Lock()
```

```Lock()```函数用于创建线程锁对象。

Returns (```ThreadLock```对象): ```Lock()```函数返回一个线程锁对象。

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

##### Condition

```
Condition()
```

```Condition()```函数用于创建一个条件变量对象，该对象用于在多线程并发环境中实现线程间的同步与通信。通过```Condition()```，一个线程可以在特定条件未满足时进入等待状态，直到另一个线程发出信号通知条件已满足。

Returns (```ThreadCondition```对象): ```Condition()```函数返回一个```ThreadCondition```对象。

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

##### Event

```
Event()
```

```Event()```函数用于创建一个*线程事件*对象，该对象用于线程间的同步，允许一个线程等待另一个线程的通知或信号。

Returns (```ThreadEvent```对象): ```Event()```函数返回一个```ThreadEvent```对象。

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

##### Dict

```
Dict()
```

```Dict()```函数用于创建一个字典对象，用于在并发线程间传递和共享数据。

Returns (```ThreadDict```对象): ```Dict()```函数返回一个```ThreadDict```对象。

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

##### Serve

```
Serve(serveURI, handler)
Serve(serveURI, handler, ...args)
```

```Serve()```函数在策略进程内创建Http服务、TCP服务、Websocket服务（基于Http协议），返回`Server`对象。

Parameters:

- `serveURI` (string, required): ```serveURI```参数配置服务的协议、绑定地址、端口以及可选的设置，例如：```http://0.0.0.0:8088?gzip=true```，可以省略IP写成```http://:8088?gzip=true```（监听所有网卡）；端口写```0```时随机分配空闲端口，实际地址用返回对象的```addr()```获取。
- TCP协议
  ```serveURI```参数设置例如：```tcp://127.0.0.1:6666```。
- Http协议
  ```serveURI```参数设置例如：```http://127.0.0.1:6666```。Websocket服务也使用Http协议，在处理函数中调用```ctx.upgrade("websocket")```切换。

可以在```?```后面加入以下设置：
- ```gzip=true```：启用gzip压缩。
- ```tls=true```：启用TLS加密（Https、wss、TLS加密的TCP），必须同时用```cert_pem```和```cert_key_pem```传入PEM格式的证书和私钥（内容需要URL编码），例如：```http://:8443?tls=true&cert_pem=xxxx&cert_key_pem=xxxx```。协议前缀只支持```tcp://```和```http://```，Https服务写成```http://```加```tls=true```。
- `handler` (function, required): ```handler```参数用于传入路由处理函数（Http协议）、消息处理函数（TCP协议）、Stream处理函数（Websocket）。每个TCP连接、每个Http请求都在独立的线程中调用一次该函数。
参数```handler```传入的回调函数可以定义多个参数，第一个参数为ctx对象（上下文对象）。
- `arg` (string / number / bool / object / array / function / any (平台支持的任意类型), optional): 作为参数```handler```传入的**回调函数**的参数的实参，参数```arg```可能有多个，例如：
```js
threading.Serve("http://:8088", function(ctx, a, b, c) {
    Log(`ctx.host():`, ctx.host(), ", a=", a, ", b=", b, ", c=", c)
}, 1, 2, 3)
```
调用```Serve()```函数时传入的参数```1```, ```2```, ```3```对应传入回调函数的参数```a```, ```b```, ```c```。

Returns (Server对象): 返回`Server`对象。用```addr()```获取实际监听的IP地址、端口，例如：```127.0.0.1:8088```、```[::]:8089```；用```close()```、```stop()```关闭服务。

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

```python
# 不支持
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

See also: `Server`, `Dial`, `HttpQuery`, `Thread`

##### pending

```
pending()
```

```pending```函数用于获取当前策略程序中正在运行的并发线程数量。

Returns (number): ```pending()```函数返回当前策略程序中正在运行的并发线程数量。

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

```Thread```对象可以通过```threading.Thread()```、```threading.getThread()```、```threading.mainThread()```、```threading.currentThread()```创建或返回。

##### peekMessage

```
peekMessage()
peekMessage(timeout)
```

```peekMessage()```函数用于从线程接收消息。

Parameters:

- `timeout` (number, optional): 参数```timeout```为超时设置，按照该参数设置的毫秒数阻塞等待并返回数据；若无数据且超时则返回空值。如果```timeout```设置为0或不传```timeout```参数，则一直阻塞等待，直到接收到通道中的数据。如果```timeout```设置为-1，则不阻塞并立即返回数据，无数据时返回空值。

Returns (string / number / bool / object / array / any (平台支持的任意类型)): ```peekMessage()```函数返回当前线程对象关联的线程所接收到的消息。

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

##### postMessage

```
postMessage(msg)
```

```postMessage()```函数用于向线程发送消息。

Parameters:

- `msg` (string / number / bool / object / array / function / any (平台支持的任意类型), required): 参数```msg```为要发送的消息。

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

##### join

```
join()
join(timeout)
```

```join()```函数用于等待线程退出，并回收系统资源。

Parameters:

- `timeout` (number, optional): ```timeout```参数用于设置等待线程结束的超时时间，单位为毫秒。当```timeout```参数设置为0或不设置```timeout```参数时，```join()```函数会阻塞，直到线程执行结束。当```timeout```参数设置为-1时，```join()```函数会立即返回。

Returns (```ThreadRet```对象): [```ThreadRet```对象](/syntax-guide/struct/otherstruct/thread.join-return)包含执行结果的相关数据，包含以下属性：

- id: 线程ID。
- terminated: 线程是否被强制终止。
- elapsed: 线程的运行时间（纳秒）。
- ret: 线程函数的返回值。

测试```join()```函数超时，输出返回值。

```javascript
function main() {
    var t1 = threading.Thread(function() {
        Log("Hello thread1")
        Sleep(5000)
    })

    var ret = t1.join(1000)
    Log("ret:", ret)   // ret: undefined

    ret = t1.join()
    Log("ret:", ret)   // ret: {"id":1,"terminated":false,"elapsed":5003252000}
}
```

当```join()```函数超时时，返回```undefined```。

See also: `peekMessage`, `postMessage`, `terminate`, `getData`, `setData`, `id`, `name`, `eventLoop`

##### terminate

```
terminate()
```

```terminate()```函数用于强制终止线程，释放创建线程时占用的硬件资源。

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

对于使用```terminate()```函数强制终止的线程，无法再使用```join()```函数等待其结束。

See also: `peekMessage`, `postMessage`, `join`, `getData`, `setData`, `id`, `name`, `eventLoop`

##### getData

```
getData()
getData(key)
```

```getData()```函数用于访问线程环境中记录的变量。数据在线程未执行```join()```函数（等待退出成功）且未执行```terminate()```函数（强制终止线程）的情况下有效。

Parameters:

- `key` (string, required): ```key```参数为存储的键值对的键名。

Returns (string / number / bool / object / array / any (平台支持的任意类型)): ```getData()```函数返回当前线程环境中存储的键值对中```key```参数对应的键值。

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

##### setData

```
setData(key, value)
```

```setData()```函数用于在线程环境中存储变量。

Parameters:

- `key` (string, required): ```key```参数用于指定存储的键值对的键名。
- `value` (string / number / bool / object / array / function / any (平台支持的任意类型), required): ```value```参数用于指定存储的键值对的键值。

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

数据在线程未执行```join()```函数（等待退出成功）且未执行```terminate()```函数（强制终止线程）的情况下有效。参数```value```的值必须是可序列化的变量。

See also: `peekMessage`, `postMessage`, `join`, `terminate`, `getData`, `id`, `name`, `eventLoop`

##### id

```
id()
```

```id()```函数用于返回当前多线程对象实例的```threadId```。

Returns (number): ```id()```函数返回```threadId```。

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

##### name

```
name()
```

```name()```函数用于返回当前多线程对象实例的名称。

Returns (string): ```name()```函数返回并发线程的名称。

创建一个并发运行的线程，在主线程中输出该并发线程的名称。

```javascript
function main() {
    var t1 = threading.Thread(function() {
        threading.currentThread().setData("data", 100)
    })
    Log(`t1.name():`, t1.name())  // t1.name(): Thread-1
    t1.join()
}
```

See also: `peekMessage`, `postMessage`, `join`, `terminate`, `getData`, `setData`, `id`, `eventLoop`

##### eventLoop

```
eventLoop()
eventLoop(timeout)
```

```eventLoop()``` 函数用于监听当前线程接收到的事件。

Parameters:

- `timeout` (number, optional): 参数 ```timeout``` 用于设置超时时间，单位为毫秒。若 ```timeout``` 设置为 0，则一直阻塞等待，直到有事件发生才返回；若大于 0，则设置事件等待的超时时间；若小于 0，则立即返回最近的事件。

Returns (object / 空值): ```eventLoop()``` 函数返回当前线程接收到的事件信息，详见[事件信息结构](/syntax-guide/struct/otherstruct/eventloop-return)。

并发执行 3 个线程，输出接收到的事件信息；当超时或立即返回时，输出的是空值。

```javascript
function main() {
    var t1 = threading.Thread(function() {
        while (true) {
            var eventMsg = threading.currentThread().eventLoop()     // 阻塞等待
            // 2024-11-14 10:14:18 thread1 eventMsg: {"Seq":1,"Event":"thread","ThreadId":0,"Index":1,"Queue":0,"Nano":1731550458699947000}
            Log(_D(), "thread1 eventMsg:", eventMsg)
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

```eventLoop()``` 函数的处理机制与全局函数 ```EventLoop()``` 一致。

See also: `peekMessage`, `postMessage`, `join`, `terminate`, `getData`, `setData`, `id`, `name`

#### ThreadLock

线程锁对象，用于多线程同步处理。

##### acquire

```
acquire()
```

```acquire()```函数用于请求线程锁（加锁）。

示例请参考```threading.Lock()```章节的内容。

```acquire()```函数用于请求线程锁。当线程调用某个线程锁对象的```acquire()```函数时，它会尝试获取该锁。如果锁当前未被其他线程占用，调用线程将成功获得锁并继续执行。如果锁已被其他线程持有，调用```acquire()```的线程将被阻塞，直到锁被释放。

See also: `Lock`, `release`

##### release

```
release()
```

```release()```函数用于释放线程锁（解锁）。

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

##### set

```
set()
```

```set()```函数用于设置事件信号。

请参考```threading.Event()```章节中的示例。

如果事件已经通过```set()```设置，则不能重复设置，需要先调用清空操作后才能重新设置信号。

See also: `clear`, `wait`, `isSet`

##### clear

```
clear()
```

```clear()```函数用于清除信号。

请参考```threading.Event()```章节中的示例。

See also: `set`, `wait`, `isSet`

##### wait

```
wait()
wait(timeout)
```

```wait()```函数用于设置事件（信号）等待，在事件（信号）被设置之前会阻塞；支持设置超时参数。

Parameters:

- `timeout` (number, optional): 参数```timeout```用于设置等待超时时间，单位为毫秒。

Returns (bool): ```wait()```函数返回是否超时，如果发生超时则返回真值。

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

##### isSet

```
isSet()
```

```isSet()```函数用于判断事件（信号）是否已被设置。

Returns (bool): ```isSet()```函数返回事件（信号）的设置状态；如果事件（信号）已被设置，则返回真值。

请参考```threading.Event()```章节中的示例。

See also: `set`, `clear`, `wait`

#### ThreadCondition

条件变量对象，用于实现多线程间的同步与通信。

##### notify

```
notify()
```

```notify()```函数用于唤醒一个正在等待的线程（如果存在）。只有调用了```wait()```方法的线程才能被唤醒。

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

##### notifyAll

```
notifyAll()
```

```notifyAll()```函数用于唤醒所有正在等待的线程。

示例请参考```ThreadCondition.notify()```章节的内容。

```notifyAll()```函数会逐个唤醒所有处于等待状态的线程，被唤醒的线程将重新获取线程锁。

See also: `notify`, `wait`,  `acquire`, `release`

##### wait

```
wait()
```

```wait()```函数用于在特定条件下使线程进入等待状态。

示例请参考```ThreadCondition.notify()```章节的内容。

```wait()```函数会释放线程锁，当线程被唤醒时将重新获取线程锁。

See also: `notify`, `notifyAll`, `acquire`, `release`

##### acquire

```
acquire()
```

```acquire()```函数用于请求线程锁（加锁）。

示例请参考```ThreadCondition.notify()```章节的内容。

在调用```wait()```之前必须先请求当前条件对象的线程锁（加锁）。

See also: `notify`, `notifyAll`, `wait`,  `release`

##### release

```
release()
```

```release()```函数用于释放线程锁（解锁）。

示例请参考```ThreadCondition.notify()```章节的内容。

在调用```wait()```后需要释放当前条件对象的线程锁（解锁）。

See also: `notify`, `notifyAll`, `wait`,  `acquire`

#### ThreadDict

线程安全的字典对象，用于在多线程环境中进行数据共享。

##### get

```
get(key)
```

```get()```函数用于获取字典对象中记录的键值。

Parameters:

- `key` (string, required): 参数```key```用于指定要获取的键名。

Returns (string / number / bool / object / array / any (平台支持的任意类型)): ```get()```函数返回参数```key```指定的键对应的值。

使用事件对象通知线程读取和修改数据。

```javascript
function main() {
    var event = threading.Event()
    var dict = threading.Dict()
    dict.set("data", 100)

    var t1 = threading.Thread(function(dict, event) {
        Log(`thread1, dict.get("data"):`, dict.get("data"))

        event.set()
        event.clear()

        event.wait()
        Log(`after main change data, thread1 dict.get("data"):`, dict.get("data"))

        dict.set("data", 0)
    }, dict, event)

    event.wait()

    dict.set("data", 99)

    event.set()
    event.clear()

    t1.join()
    Log(`main thread, dict.get("data"):`, dict.get("data"))
}
```

See also: `set`

##### set

```
set(key, value)
```

```set()```函数用于设置键值对。

Parameters:

- `key` (string, required): 参数```key```用于指定需要设置的键名。
- `value` (string / number / bool / object / array / function / any (平台支持的任意类型), required): 参数```value```用于指定需要设置的键值。

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

```Server```对象由`threading.Serve()`返回，代表一个正在运行的服务。可以作为线程执行函数的参数传入其它线程，在其它线程中查询或关闭服务。

##### addr

```
addr()
```

```addr()```函数返回服务实际监听的地址和端口。

Returns (string): 监听地址，例如```127.0.0.1:8088```、```[::]:8089```。端口写```0```时返回系统分配的端口。

```javascript
function main() {
    // 端口写 0 表示随机分配空闲端口，实际地址用 addr() 获取
    var server = threading.Serve("http://127.0.0.1:0", function (ctx) {
        Sleep(1000)
        ctx.write("done")
    })
    Log("listen on", server.addr())

    // 在另一个线程里发起请求，主线程观察服务状态
    threading.Thread(function (addr) {
        Log("response:", HttpQuery("http://" + addr + "/"))
    }, server.addr())
    Sleep(200)
    Log("pending:", server.pending())  // 1：有一个请求正在处理

    server.close()                      // 不再接收新连接，正在处理的请求继续执行
    Log("idle:", server.join(5000))     // true：服务已关闭且请求都处理完了
}
```

See also: `close`, `stop`, `join`, `pending`, `Serve`

##### close

```
close()
```

```close()```函数停止接收新连接，正在执行的处理函数继续执行完（优雅关闭）。

```javascript
function main() {
    // 端口写 0 表示随机分配空闲端口，实际地址用 addr() 获取
    var server = threading.Serve("http://127.0.0.1:0", function (ctx) {
        Sleep(1000)
        ctx.write("done")
    })
    Log("listen on", server.addr())

    // 在另一个线程里发起请求，主线程观察服务状态
    threading.Thread(function (addr) {
        Log("response:", HttpQuery("http://" + addr + "/"))
    }, server.addr())
    Sleep(200)
    Log("pending:", server.pending())  // 1：有一个请求正在处理

    server.close()                      // 不再接收新连接，正在处理的请求继续执行
    Log("idle:", server.join(5000))     // true：服务已关闭且请求都处理完了
}
```

重复调用没有影响。需要等待正在执行的处理函数结束时，接着调用```join()```。

See also: `addr`, `stop`, `join`, `pending`, `Serve`

##### stop

```
stop()
```

```stop()```函数先关闭服务（同```close()```），再强制结束所有正在执行的处理函数线程。

```javascript
function main() {
    // 端口写 0 表示随机分配空闲端口，实际地址用 addr() 获取
    var server = threading.Serve("http://127.0.0.1:0", function (ctx) {
        Sleep(1000)
        ctx.write("done")
    })
    Log("listen on", server.addr())

    // 在另一个线程里发起请求，主线程观察服务状态
    threading.Thread(function (addr) {
        Log("response:", HttpQuery("http://" + addr + "/"))
    }, server.addr())
    Sleep(200)
    Log("pending:", server.pending())  // 1：有一个请求正在处理

    server.close()                      // 不再接收新连接，正在处理的请求继续执行
    Log("idle:", server.join(5000))     // true：服务已关闭且请求都处理完了
}
```

强制结束的效果与`terminate`相同，处理函数中未发送的应答会丢失。

See also: `addr`, `close`, `join`, `pending`, `Serve`

##### join

```
join()
join(timeout)
```

```join()```函数等待服务关闭且所有处理函数执行完毕。

Parameters:

- `timeout` (number, optional): 等待的超时时间，单位毫秒。省略或者为```0```时一直等待（策略停止时返回）。

Returns (bool): 服务已关闭且没有正在执行的处理函数时返回```true```，超时返回```false```。

```javascript
function main() {
    // 端口写 0 表示随机分配空闲端口，实际地址用 addr() 获取
    var server = threading.Serve("http://127.0.0.1:0", function (ctx) {
        Sleep(1000)
        ctx.write("done")
    })
    Log("listen on", server.addr())

    // 在另一个线程里发起请求，主线程观察服务状态
    threading.Thread(function (addr) {
        Log("response:", HttpQuery("http://" + addr + "/"))
    }, server.addr())
    Sleep(200)
    Log("pending:", server.pending())  // 1：有一个请求正在处理

    server.close()                      // 不再接收新连接，正在处理的请求继续执行
    Log("idle:", server.join(5000))     // true：服务已关闭且请求都处理完了
}
```

服务没有关闭时```join()```会一直等到它被关闭，通常先调用```close()```再调用```join()```。

See also: `addr`, `close`, `stop`, `pending`, `Serve`

##### pending

```
pending()
```

```pending()```函数返回当前正在执行的处理函数数量，即正在处理的连接或请求数。

Returns (number): 正在执行的处理函数数量。

```javascript
function main() {
    // 端口写 0 表示随机分配空闲端口，实际地址用 addr() 获取
    var server = threading.Serve("http://127.0.0.1:0", function (ctx) {
        Sleep(1000)
        ctx.write("done")
    })
    Log("listen on", server.addr())

    // 在另一个线程里发起请求，主线程观察服务状态
    threading.Thread(function (addr) {
        Log("response:", HttpQuery("http://" + addr + "/"))
    }, server.addr())
    Sleep(200)
    Log("pending:", server.pending())  // 1：有一个请求正在处理

    server.close()                      // 不再接收新连接，正在处理的请求继续执行
    Log("idle:", server.join(5000))     // true：服务已关闭且请求都处理完了
}
```

See also: `addr`, `close`, `stop`, `join`, `Serve`

### Web3

Web3交易所对象连接EVM链或TRON链的节点，通过```exchange.IO()```的各个指令读写链上数据：注册ABI后调用合约、编码解码、签名、批量查询、事件日志、发送交易和管理nonce等。本分类的文档用```exchange.IO("指令", ...)```表示每个指令，第一个参数是指令名。

在去中心化交易所兑换代币请使用Uniswap交易所对象（见Uniswap分类）：它可以直接使用```exchange.GetTicker()```、```exchange.CreateOrder()```等标准函数。

#### exchange.IO("abi", ...)

```
exchange.IO(k, address, abiContent)
```

Forms:

- `exchange.IO("abi", ...)`

在发明者量化交易平台中，区块链相关的各种功能和调用主要通过```exchange.IO()```函数实现。以下文档按照功能对```exchange.IO()```函数的各种调用方式分别进行描述。 ```exchange.IO("abi", ...)```这一调用方式用于注册ABI。

- 支持以太坊（eth）

- 支持波场（tron）

Parameters:

- `k` (string, required): ```k```参数用于指定```exchange.IO()```函数的功能，设置为```"abi"```时表示该函数用于注册```ABI```。
- `address` (string, required): ```address```参数用于指定智能合约的地址。
- `abiContent` (string, required): ```abiContent```参数用于指定智能合约的```ABI```（JSON字符串）。也可以传入内置模板名：```"weth"```（包装币的```deposit```、```withdraw```方法，别名```"wbnb"```、```"wrappedNative"```）、```"uniswapV3Pool"```、```"uniswapV3Factory"```、```"uniswapV3QuoterV2"```、```"uniswapV3SwapRouter02"```、```"uniswapV3PositionManager"```、```"permit2"```。PancakeSwap V3对应的合约使用相同模板，也可以写```"pancakeV3Pool"```、```"pancakeV3Factory"```、```"pancakeV3QuoterV2"```、```"pancakeV3SmartRouter"```、```"pancakeV3PositionManager"```，或通用别名```"v3Pool"```、```"v3Factory"```、```"v3QuoterV2"```、```"v3Router"```、```"v3PositionManager"```。模板名不存在时报错。

```javascript
function main() {
    // register Uniswap SwapRouter02 abi
    var routerAddress = "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45"
    var abi = `[{"inputs":[{"components":[{"internalType":"bytes","name":"path","type":"bytes"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"uint256","name":"amountInMaximum","type":"uint256"}],"internalType":"struct IV3SwapRouter.ExactOutputParams","name":"params","type":"tuple"}],"name":"exactOutput","outputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"}],"stateMutability":"payable","type":"function"}]`

    // abi只使用了局部的exactOutput方法的内容，完整的abi可以在网上搜索
    exchange.IO("abi", routerAddress, abi)
}
```

使用内置模板注册Uniswap V3头寸管理合约，并查询最近新增的头寸。

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

如果调用的智能合约方法是标准的ERC20方法，则无需注册ABI。

合约的```ABI```内容可以通过Etherscan的V2接口获取（需要Etherscan的API Key，```chainid```为链ID），只需取其中的```result```字段，例如：
```url
https://api.etherscan.io/v2/api?chainid=1&module=contract&action=getabi&address=0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45&apikey=YourApiKey
```

通过方法名调用时，优先匹配该地址所注册ABI中的方法，其次匹配内置的ERC20方法；对于同名的重载方法，需要使用完整的方法签名加以区分，例如```"permit(address,((address,uint160,uint48,uint48),address,uint256),bytes)"```。

内置模板包含常用的函数和事件定义，其中的事件定义可配合```exchange.IO("logs", ...)```、```exchange.IO("waitReceipt", ...)```进行解码；常用合约的地址可以通过```exchange.IO("contracts", ...)```获取。

波场（TRON）上调用没有注册ABI的合约方法时，会自动从链上读取该合约的ABI并缓存；链上读取不到时报错，需要用```exchange.IO("abi", ...)```手动注册。

#### exchange.IO("api", blockChain, ...)

```
exchange.IO(k, blockChain, rpcMethod)
exchange.IO(k, blockChain, rpcMethod, ...args)
```

Forms:

- `exchange.IO("api", "eth", ...)`

```exchange.IO("api", "eth", ...)```调用方式用于调用以太坊RPC方法（配置Web3交易所对象时需选择eth）。
```exchange.IO("api", "tron", ...)```调用方式用于调用波场RPC方法（配置Web3交易所对象时需选择tron）。

Parameters:

- `k` (string, required): ```k```参数用于设置```exchange.IO()```函数的功能，设置为```"api"```时表示该函数用于扩展调用请求。
- `blockChain` (string, required): ```blockChain```参数用于指定```exchange.IO()```函数调用的区块链网络，设置为```"eth"```时表示调用以太坊网络的RPC方法；设置为```"tron"```时表示调用波场网络的RPC方法。
- `rpcMethod` (string, required): ```rpcMethod```参数用于指定```exchange.IO()```函数所要调用的RPC方法。
- `arg` (string / number / bool / object / array / function / any (平台支持的任意类型), optional): ```arg```参数用于指定所要调用的RPC方法的参数。
```arg```参数可以有多个，其类型与个数取决于```rpcMethod```参数所指定的RPC方法。

Returns (string / number / bool / object / array / any (平台支持的任意类型)): ```exchange.IO("api", "eth", ...)```函数返回所调用RPC方法的返回值。

查询钱包中的ETH余额：

```javascript
// 将链上整数数量转换为可读数量。decimals为代币精度：ETH为18，USDT/USDC为6。
// 同时支持十进制字符串和0x开头的十六进制字符串：eth_getBalance等RPC方法返回的即为0x开头的十六进制字符串。
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
    // "owner" 需替换为实际的钱包地址
    // "latest"所在位置为区块参数，可选值：'latest'、'earliest'或'pending'，详见https://eth.wiki/json-rpc/API#the-default-block-parameter
    // 返回值 ethBalance 为十六进制字符串，例如：0x9b19ce56113070
    var ethBalance = exchange.IO("api", "eth", "eth_getBalance", "owner", "latest")

    // ETH的精度为18，即1 ETH等于1e18个最小单位
    var ethDecimal = 18

    // 链上数量均为整数，换算为可读数量时需按精度移动小数点。整个换算过程不涉及浮点运算，
    // 因此不存在JavaScript数值精度丢失的问题：0x9b19ce56113070转换为0.043656995388076145
    Log(toAmount(ethBalance, ethDecimal))
}
```

ETH转账时，可以根据具体需求设置```{gasPrice: 11, gasLimit: 111, nonce: 111}```参数，该参数作为```exchange.IO()```函数的最后一个参数传入。不需要的选项可以省略。注意普通转账不设置```gasPrice```时按固定的100 Gwei出价、```gasLimit```默认为21000，建议先用```eth_gasPrice```查询gas价格后传入。

该参数还支持```data```和```dryRun```字段：```data```为任意调用数据（以```0x```开头的十六进制字符串），用于直接发送聚合器、Pendle等API返回的交易```{to, data, value}```；设置```data```时，gas价格和gasLimit按合约调用的方式由节点估算。```dryRun```设置为```true```时仅签名、不广播，返回包含```hash```、```raw```（签名后的交易）、```nonce```、```gasLimit```等字段的对象，可用于检查交易内容或交由其它渠道发送。例如：```exchange.IO("api", "eth", "send", router, value, {data: calldata, dryRun: true})```。发送前可以先使用```exchange.IO("call", router, calldata, {value: value})```进行模拟调用。未设置```nonce```时，系统会自动分配nonce并与链上保持同步，连续发送交易不会重复使用nonce，详见```exchange.IO("nonce", ...)```；交易长时间未上链时，可以使用```exchange.IO("speedUp", ...)```提高gas价格重新发送，或使用```exchange.IO("cancelTx", ...)```取消交易。

```javascript
// 可读数量 -> 链上整数数量（字符串）。全程以字符串方式移动小数点，不经过浮点数运算，
// 超过2^53的数量也不会丢失精度。需要表示17位以上有效数字时，amount请传入字符串。
function toInnerAmount(amount, decimals) {
    var t = String(amount), d = Number(decimals) || 0
    var m = /^([0-9]*)(?:\.([0-9]*))?[eE]([+-]?[0-9]+)$/.exec(t)
    if (m) {   // 展开科学计数法：0.0000001 会被JavaScript表示为 1e-7
        var digits = (m[1] || "") + (m[2] || ""), point = (m[1] || "").length + parseInt(m[3], 10)
        t = point <= 0 ? "0." + new Array(1 - point).join("0") + digits
            : point >= digits.length ? digits + new Array(point - digits.length + 1).join("0")
            : digits.slice(0, point) + "." + digits.slice(point)
    }
    var dot = t.indexOf("."), int = dot < 0 ? t : t.slice(0, dot)
    var frac = dot < 0 ? "" : t.slice(dot + 1)
    frac = frac.slice(0, d)                       // 超出精度的小数位直接截断
    while (frac.length < d) frac += "0"
    return (int + frac).replace(/^0+(?=[0-9])/, "")
}

function main() {
    // ETH的精度单位为1e18
    var ethDecimal = 18

    // 转账数量（可读数量），例如：0.01个ETH
    var sendAmount = 0.01

    // 转换为链上使用的整数数量：0.01 -> "10000000000000000"
    var amount = toInnerAmount(sendAmount, ethDecimal)

    // "toAddress"为转账接收方的ETH钱包地址，需根据实际情况填写；amount为转账数量
    exchange.IO("api", "eth", "send", "toAddress", amount)
}
```

查询```gasPrice```：

```javascript
// toAmount函数用于将hex编码的数值转换为十进制数值，decimals传入0表示不移动小数点
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
    Log("gasPrice:", toAmount(gasPrice, 0))   // 5000000000 , in wei (5 gwei)
    Log("gasPrice:", toAmount(gasPrice, 9), "gwei")   // gwei的精度单位为1e9
}
```

调用```eth_estimateGas```估算交易所需的Gas：

```javascript
// toAmount函数用于将十六进制编码的数值转换为十进制数值
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
    // 对approve（授权）方法的调用进行编码
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

    // 手续费 = gasLimit * gasPrice，两者均为以wei为单位的大整数，使用BigInt相乘以避免精度丢失，
    // 再按1e18换算为便于阅读的ETH数量
    Log("gas fee", toAmount((BigInt(gasLimit) * BigInt(gasPrice)).toString(), 18))
}
```

当```exchange.IO()```函数的第二个参数设置为```"eth"```时，可以直接调用以太坊节点服务器支持的RPC方法。

调用节点方法时原样返回节点给出的```result```。节点返回```null```时（例如交易还未上链时的```eth_getTransactionReceipt```）返回空值，不报错；节点返回错误时返回空值，```GetLastError()```中有错误信息，合约revert的原因会解码为可读文本。

```exchange.IO("api", "eth", "send", toAddress, value[, options])```从当前钱包转出原生币，```value```为链上整数（wei），返回交易哈希。不带```data```的普通转账发送传统（legacy）交易：不设置```gasPrice```时固定按100 Gwei（附加一个很小的随机值）出价，不设置```gasLimit```时为21000，在以太坊主网上通常偏高，建议先用```eth_gasPrice```查询后传入。设置```data```时按合约调用处理：gas上限由节点估算，gas价格与合约写方法相同（支持EIP-1559的链发送EIP-1559交易，参看```exchange.IO("api", ...)```）。

波场（TRON）上第二个参数写```"tron"```，方法名不区分大小写，例如```GetNowBlock```、```GetAccount```、```GetTransactionInfoByID```、```TRC20ContractBalance```。```send```的参数为收款地址和TRX数量（单位sun，1 TRX = 1000000 sun），返回不带```0x```的交易ID。需要签名的方法（转账、触发合约等）会自动签名并广播。未内置的全节点接口可以直接传路径和请求体：```exchange.IO("api", "tron", "/wallet/接口名", {请求体})```。

#### exchange.IO("encode", ...)

```
exchange.IO(k, dataFormat, ...args)
exchange.IO(k, address, dataFormat)
exchange.IO(k, address, dataFormat, ...args)
```

Forms:

- `exchange.IO("encode", ...)`

```exchange.IO("encode", ...)```函数的这种调用方式用于数据编码。

Parameters:

- `k` (string, required): ```k```参数用于设置```exchange.IO()```函数的功能，设置为```"encode"```表示该函数用于数据编码。
- `address` (string, optional): ```address```参数用于设置智能合约的地址。调用```exchange.IO("encode", ...)```函数时，如果传入```address```参数，表示对智能合约的方法调用进行编码（encode）；如果未传入```address```参数，则该函数用于按指定的类型顺序对数据进行编码，功能等同于```Solidity```中的```abi.encode```。
- `dataFormat` (string, required): ```dataFormat```参数用于指定编码数据的方法、类型和顺序。
- `arg` (string / number / tuple / array / any (平台支持的任意类型), optional): ```arg```参数用于指定与```dataFormat```参数匹配的具体数据值。
```arg```参数可以有多个，其类型与个数取决于```dataFormat```参数的设置。

Returns (string): ```exchange.IO("encode", ...)```函数返回编码后的数据。

以编码```unwrapWETH9```方法的调用为例：

```javascript
function main() {
    // ContractV3SwapRouterV2 主网地址 : 0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45
    // 调用unwrapWETH9方法需要先注册ABI，此处省略注册步骤
    // "owner"代表钱包地址，需要填写实际地址；1代表解包装数量，即把1个WETH解包装为ETH
    var data = exchange.IO("encode", "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45", "unwrapWETH9(uint256,address)", 1, "owner")
    Log(data)
}
```

等同于```Solidity```中```abi.encode```的编码范例：

```javascript
function main() {
    var x = 10
    var address = "0x02a5fBb259d20A3Ad2Fdf9CCADeF86F6C1c1Ccc9"
    var str = "Hello World"
    var array = [1, 2, 3]
    var ret = exchange.IO("encode", "uint256,address,string,uint256[]", x, address, str, array)   // uint 即 uint256 , FMZ上需要指定类型长度
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

支持对元组（tuple）或者包含元组的类型顺序进行编码。本例中的类型顺序由```tuple```、```bytes```组成，因此在调用```exchange.IO()```进行encode时需要继续传入两个参数：
- 1、对应tuple类型的变量：
  ```
  [30, 20, "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"]
  ```
  元组的值以数组形式按位置传入，元素的个数、顺序和类型都必须与```types```参数中的```(uint256,uint8,address)```一致。字面量元组没有字段名，解码时各字段按位置依次编号为```Field1```、```Field2```……
- 2、对应```bytes```类型的变量：
  ```
  "0011"
  ```

```javascript
function main() {
    var types = "(uint256,uint8,address),bytes"
    var ret = exchange.IO("encode", types, [30, 20, "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"], "0011")
    Log("encode: ", ret)
}
```

支持对数组或者包含数组的类型顺序进行编码：

```javascript
function main() {
    var path = ["0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2", "0xdac17f958d2ee523a2206206994597c13d831ec7"]   // ETH address, USDT address
    var ret = exchange.IO("encode", "address[]", path)
    Log("encode: ", ret)
}
```

```exchange.IO()```函数封装了```encode```方法，可以将函数调用编码为```hex```字符串格式并返回。在Uniswap / PancakeSwap上兑换可以直接使用`Uniswap`交易所对象，不需要自己编码调用。

编码智能合约上的方法调用时，方法可以写方法名、完整的方法签名或方法选择器；标准ERC20方法已内置，其它方法需要先注册对应的ABI。

返回不带```0x```前缀的十六进制字符串。```bytesN```类型的值可以传十六进制字符串（```0x```前缀可选）或字节数值数组；```address```类型可以传波场```T```开头的地址。

```exchange.IO("pack", ...)```是```exchange.IO("encode", ...)```的别名。

#### exchange.IO("encodePacked", ...)

```
exchange.IO(k, dataFormat, ...args)
```

Forms:

- `exchange.IO("encodePacked", ...)`

```exchange.IO("encodePacked", ...)```函数用于执行```encodePacked```编码操作。

Parameters:

- `k` (string, required): ```k```参数用于设置```exchange.IO()```函数的功能模式，当设置为```"encodePacked"```时，表示该函数执行数据```encodePacked```编码操作。
- `dataFormat` (string, required): ```dataFormat```参数用于指定```encodePacked```编码时数据的类型格式和排列顺序。
- `arg` (string / number / tuple / array / any (平台支持的任意类型), required): ```arg```参数用于指定与```dataFormat```参数格式相匹配的具体数据值。

```arg```参数可以有多个，其类型和数量由```dataFormat```参数的设置决定。

Returns (string): ```exchange.IO("encodePacked", ...)```函数返回经过```encodePacked```编码处理后的数据字符串。

在使用```Uniswap V3```时需要传入交易路径等参数，此时需要使用```encodePacked```编码操作：

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

#### exchange.IO("decode", ...)

```
exchange.IO(k, dataFormat, data)
```

Forms:

- `exchange.IO("decode", ...)`

```exchange.IO("decode", ...)```调用方式用于对数据进行解码。

Parameters:

- `k` (string, required): ```k```参数用于设置```exchange.IO()```函数的功能，设置为```"decode"```时表示该函数用于数据解码。
- `dataFormat` (string, required): ```dataFormat```参数用于指定待解码数据的类型和顺序。
- `data` (string, required): ```data```参数为要解码的数据，十六进制字符串，```0x```前缀可选。

Returns (string / number / bool / object / array): ```dataFormat```只有一个类型时直接返回解码后的值，有多个类型时返回数组。整数中```uint64```、```int64```及以下位宽为数字，更大位宽为十进制字符串；```address```为```0x```开头的小写地址（波场上同样返回```0x```格式）；```bytes```为不带```0x```的十六进制字符串；```bytes32```等定长```bytesN```为字节数值数组；字面元组为以```Field1```、```Field2```……为键的对象。

```exchange.IO("encode", ...)```函数的逆向操作：

```javascript
function main() {
    // 元组写在圆括号里，字段按位置排列；这里是一个三字段元组，外加一个bytes参数
    var types = "(uint256,uint8,address),bytes"

    // 元组的值按位置传数组
    var ret = exchange.IO("encode", types, [30, 20, "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"], "0011")
    Log("encode: ", ret)

    // 解码结果：[{"Field1":"30","Field2":20,"Field3":"0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"}, "0011"]
    // 字面元组没有字段名，按位置编号为Field1、Field2……要用有意义的字段名，
    // 需要先用exchange.IO("abi", ...)注册合约ABI，参考下一个例子
    var rawData = exchange.IO("decode", types, ret)
    Log("decode:", rawData)
}
```

以下例子首先对```path```参数进行```encodePacked```编码处理，因为后续需要编码的```exactOutput```方法调用要以```path```作为参数。然后对路由合约的```exactOutput```方法进行```encode```编码，该方法只有一个参数，参数类型为```tuple```。方法名```exactOutput```编码后为：```0x09b81346```。最后使用```exchange.IO("decode", ...)```方法按```(bytes,address,uint256,uint256)```解码得到```decodeRaw```，其字段按位置编号为```Field1```～```Field4```，各字段的值与变量```dataTuple```中的内容依次对应。

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
    Log("method hash:", rawData.slice(0, 8))   // 09b81346
    Log("params hash:", rawData.slice(8))

    // decode exactOutput params
    var decodeRaw = exchange.IO("decode", "(bytes,address,uint256,uint256)", rawData.slice(8))
    Log("decodeRaw:", decodeRaw)
}
```

在数据处理方面，```exchange.IO()```函数不仅支持编码（encode），也支持解码（decode）。

```exchange.IO("unpack", ...)```是```exchange.IO("decode", ...)```的别名。

#### exchange.IO("hash", ...)

```
exchange.IO(k, algo, inputFormat, outputFormat, data)
exchange.IO(k, algo, inputFormat, outputFormat, data, keyFormat, key)
```

Forms:

- `exchange.IO("hash", ...)`

```exchange.IO("hash", ...)```函数的调用方式用于计算哈希摘要、HMAC，以及使用交易所对象配置的私钥签名等，参数与`Encode`函数相同。在Web3交易所对象上常用于计算```keccak256```哈希，例如方法选择器、EIP-712摘要。

Parameters:

- `k` (string, required): ```k```参数用于设置```exchange.IO()```函数的功能，设置为```"hash"```表示该函数用于哈希、签名等计算。
- `algo` (string, required): ```algo```参数为算法：
- 摘要：```"md4"```、```"md5"```、```"sha1"```、```"sha224"```、```"sha256"```、```"sha384"```（同```"sha512.384"```）、```"sha512"```、```"sha512.224"```、```"sha512.256"```、```"keccak256"```（同```"sha3.keccak256"```）、```"sha3.keccak512"```、```"sha3.224"```、```"sha3.256"```、```"sha3.384"```、```"sha3.512"```、```"ripemd160"```、```"blake2b.256"```、```"blake2b.512"```、```"blake2s.128"```、```"blake2s.256"```。传入```keyFormat```和```key```时计算HMAC（blake2s为带密钥的MAC）。
- ```"raw"```、```"string"```：不计算，只做格式转换。
- ```"sign"```：用secp256k1私钥对32字节的```data```签名，返回65字节的```r‖s‖v```，其中v为0或1；不传```key```时使用交易所对象配置的私钥。
- ```"signTx"```：```data```为传统（legacy）交易的JSON，字段为```Nonce```、```GasPrice```、```GasLimit```、```To```、```Value```、```Data```、```ChainId```（字段名不区分大小写，缺少的数值按0处理），可以带```Key```字段指定私钥；返回签名后的交易。
- ```"abi.类型"```：按ABI编码一个值，例如```"abi.uint256"```、```"abi.address"```。
- 另外支持```"ed25519"```（及```"ed25519.seed"```、```"ed25519.sha512"```）签名，```"text.encoder.字符集"```、```"text.decoder.字符集"```字符集转换，```"aes.encrypt"```、```"aes.decrypt"```（可加```.cbc```、```.ecb```、```.cfb```，默认cbc），```"zlib"```、```"gzip"```、```"flate"```、```"br"```、```"zstd"```、```"lz4"```加```.deflate```（压缩）或```.inflate```（解压），以及```"unzip"```（返回以文件名为键的对象）。
- `inputFormat` (string, required): ```data```的格式：```"raw"```、```"string"```（按字符串的字节）、```"hex"```（```0x```前缀可选）、```"base64"```、```"base64.url"```、```"base64.rawurl"```。
- `outputFormat` (string, required): 输出格式：```"hex"```（不带```0x```）、```"base64"```、```"base64.url"```、```"base64.rawurl"```、```"raw"```、```"string"```（输出必须是有效的UTF-8文本）。
- `data` (string, required): 要处理的数据，按```inputFormat```解析。
- `keyFormat` (string, optional): ```key```的格式，取值同```inputFormat```。
- `key` (string, optional): 密钥：HMAC的密钥、```"sign"```使用的私钥（例如```keyFormat```为```"hex"```时传私钥的十六进制）、ed25519和AES的密钥。```"ed25519"```、```"aes.*"```必须传入。AES的密钥为16、24或32字节，初始向量取密钥的前16字节，不做填充（cbc、ecb要求数据长度为16的整数倍）。

Returns (string / object): 返回按```outputFormat```编码的结果；```"unzip"```返回以文件名为键的对象。调用失败返回空值，```GetLastError()```中有错误信息。

计算方法选择器、HMAC、ABI编码，以及用配置的私钥对哈希签名。

```javascript
function main() {
    // 方法选择器：keccak256("transfer(address,uint256)") 的前 4 字节
    var h = exchange.IO("hash", "keccak256", "raw", "hex", "transfer(address,uint256)")
    Log("selector:", "0x" + h.slice(0, 8))      // 0xa9059cbb

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
    Log("selector:", "0x" + h[:8])      # 0xa9059cbb

    # 对十六进制数据求哈希，输出不带 0x
    Log(exchange.IO("hash", "keccak256", "hex", "hex", "0x1234"))

    # HMAC-SHA256：最后两个参数为密钥的格式和密钥
    Log(exchange.IO("hash", "sha256", "string", "base64", "message", "string", "secret"))

    # 按 ABI 编码一个 uint256
    Log(exchange.IO("hash", "abi.uint256", "string", "hex", "1000"))

    # 用配置的私钥对 32 字节哈希签名：65 字节 r‖s‖v，v 为 0 或 1
    Log(exchange.IO("hash", "sign", "hex", "hex", h))
```

参数个数必须是4个或6个（不含```"hash"```）。

```"sign"```返回的签名v为0或1，与旧版本一致；需要分别取得```r```、```s```、```v```（v为27或28）或EIP-2098紧凑签名用于合约校验时，使用```exchange.IO("sign", ...)```。

以太坊（EVM）和波场（TRON）的交易所对象都可以使用。

#### exchange.IO("key", ...)

```
exchange.IO(k, key)
```

Forms:

- `exchange.IO("key", ...)`

```exchange.IO("key", ...)```函数用于切换私钥的调用方式。

Parameters:

- `k` (string, required): ```k```参数用于设置```exchange.IO()```函数的功能，当设置为```"key"```时，表示该函数用于切换私钥。
- `key` (string, required): ```key```参数用于设置私钥字符串。

```javascript
function main() {
    exchange.IO("key", "Private Key")   // "Private Key"代表私钥字符串，需要具体填写
}
```

```exchange.IO()```函数支持切换私钥功能，可以操作多个钱包地址。也可以添加多个交易所对象（参考：`exchanges`）来操作多个钱包地址。

对于切换私钥的操作：```exchange.IO("key", "xxx")```，不能使用并发方式进行切换。

私钥为十六进制字符串，```0x```前缀可选。私钥无效时报错，不会切换。私钥只保存在内存中，不会写入日志；切换后，获取地址、签名和发送交易都使用新的私钥。

#### exchange.IO("sign", ...)

```
exchange.IO(k, hash)
exchange.IO(k, hash, key)
```

Forms:

- `exchange.IO("sign", ...)`

```exchange.IO("sign", ...)```调用方式用于使用secp256k1私钥对32字节哈希进行签名，返回r、s、v等签名数据，适用于EIP-712结构化数据签名（如ERC-20 Permit授权、1inch限价单）等需要链下签名的场景。

Parameters:

- `k` (string, required): ```k```参数用于设置```exchange.IO()```函数的功能，设置为```"sign"```表示该函数用于对哈希进行签名。
- `hash` (string, required): ```hash```参数为待签名的32字节哈希，格式为十六进制字符串，```0x```前缀可选。该函数不会对```hash```再次进行哈希处理，EIP-712摘要需预先计算完成，请参考范例。
- `key` (string, optional): ```key```参数用于指定签名所使用的私钥，未传入时使用`exchange`交易所对象配置的私钥。

Returns (object): ```exchange.IO("sign", ...)```函数返回签名对象，包含以下字段：```r```（32字节，十六进制字符串）、```s```（32字节，十六进制字符串）、```v```（数值，27或28）、```signature```（65字节```r‖s‖v```，十六进制字符串）、```vs```（EIP-2098紧凑签名，32字节，十六进制字符串）。调用失败时返回空值。

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
        { type: "function", name: "name", stateMutability: "view", inputs: [], outputs: [{ type: "string" }] },
        { type: "function", name: "version", stateMutability: "view", inputs: [], outputs: [{ type: "string" }] },
        { type: "function", name: "nonces", stateMutability: "view", inputs: [{ type: "address" }], outputs: [{ type: "uint256" }] },
        { type: "function", name: "DOMAIN_SEPARATOR", stateMutability: "view", inputs: [], outputs: [{ type: "bytes32" }] }
    ]))
    var owner = exchange.IO("address")
    var name = exchange.IO("api", USDC, "name")
    var version = exchange.IO("api", USDC, "version")
    var nonce = exchange.IO("api", USDC, "nonces", owner)
    var chainId = parseInt(exchange.IO("api", "eth", "eth_chainId"), 16)
    var deadline = Math.floor(Date.now() / 1000) + 3600
    Log("owner:", owner, "| token:", name, "v" + version, "| nonce:", nonce, "| chainId:", chainId)

    // 2. 计算 EIP-712 域分隔符，并与合约的 DOMAIN_SEPARATOR() 返回值比对
    var domainSeparator = keccak("hex", exchange.IO("encode", "bytes32,bytes32,bytes32,uint256,address",
        keccak("raw", "EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"),
        keccak("raw", name), keccak("raw", version), chainId, USDC))
    var onchain = bytesToHex(exchange.IO("api", USDC, "DOMAIN_SEPARATOR"))
    Log("domainSeparator:", domainSeparator, domainSeparator === onchain ? "与链上一致" : "与链上不一致: " + onchain)

    // 3. Permit 结构体哈希 → EIP-712 摘要 → 签名
    var structHash = keccak("hex", exchange.IO("encode", "bytes32,address,address,uint256,uint256,uint256",
        keccak("raw", "Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline)"),
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

#### exchange.IO("signTypedData", ...)

```
exchange.IO(k, typedData)
exchange.IO(k, typedData, key)
exchange.IO(k, domain, types, message)
exchange.IO(k, domain, types, message, key)
```

Forms:

- `exchange.IO("signTypedData", ...)`

```exchange.IO("signTypedData", ...)```函数的调用方式用于按照EIP-712标准对结构化数据进行签名，一次调用即可完成类型哈希、域分隔符、结构体哈希和摘要的计算并签名，适用于ERC-20 Permit、Permit2、UniswapX、CoW、1inch限价单等场景。

Parameters:

- `k` (string, required): ```k```参数用于设置```exchange.IO()```函数的功能，设置为```"signTypedData"```表示使用该函数进行EIP-712签名。
- `typedData` (object, string, optional): ```typedData```参数为包含```domain```、```types```、```primaryType```、```message```的对象（即MetaMask ```eth_signTypedData_v4```的格式，```types```中可以包含```EIP712Domain```），也可以传入该对象的JSON字符串。
- `domain` (object, optional): ```domain```参数为EIP-712域，例如```{name, version, chainId, verifyingContract}```。使用```domain```、```types```、```message```三个参数的调用方式与ethers的```signTypedData```相同：```types```中无需包含```EIP712Domain```（根据```domain```中出现的字段自动推导），主类型为未被其它类型引用的类型。
- `types` (object, optional): ```types```参数为类型定义，例如```{Permit: [{name: "owner", type: "address"}, ...]}```，支持嵌套结构体和数组。
- `message` (object, optional): ```message```参数为待签名的数据。大整数可以以字符串形式传入。
- `key` (string, optional): ```key```参数用于指定签名所使用的私钥，不传该参数时使用`exchange`交易所对象配置的私钥。

Returns (object): 返回签名对象，字段与```exchange.IO("sign", ...)```的返回值相同：```r```、```s```、```v```（27或28）、```signature```（65字节）、```vs```（EIP-2098紧凑签名），此外还包含```digest```字段，即EIP-712摘要。调用失败时返回空值。

对以太坊主网USDC的Permit进行签名，并通过```exchange.IO("call", ...)```由USDC合约验证签名。

```javascript
function main() {
    var USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"      // 以太坊主网 USDC
    var spender = "0x1111111254EEB25477B68fb85Ed929f73A960582"   // 被授权方，按实际填写
    var owner = exchange.IO("address")
    var deadline = Math.floor(Date.now() / 1000) + 3600

    // ethers 写法：domain、types（不含 EIP712Domain）、message，主类型自动推断
    var domain = { name: "USD Coin", version: "2", chainId: 1, verifyingContract: USDC }
    var types = {
        Permit: [
            { name: "owner", type: "address" }, { name: "spender", type: "address" },
            { name: "value", type: "uint256" }, { name: "nonce", type: "uint256" },
            { name: "deadline", type: "uint256" }
        ]
    }
    var message = { owner: owner, spender: spender, value: "1000000", nonce: 0, deadline: deadline }
    var sig = exchange.IO("signTypedData", domain, types, message)
    Log("digest:", sig.digest, "v:", sig.v, "r:", sig.r, "s:", sig.s)

    // 单对象写法（MetaMask eth_signTypedData_v4 的格式）结果相同
    var sig2 = exchange.IO("signTypedData", { domain: domain, types: types, primaryType: "Permit", message: message })
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

#### exchange.IO("signMessage", ...)

```
exchange.IO(k, message)
exchange.IO(k, message, key)
```

Forms:

- `exchange.IO("signMessage", ...)`

```exchange.IO("signMessage", ...)```调用方式用于按照EIP-191标准（```personal_sign```）对消息进行签名，签名结果与ethers的```signMessage```、钱包的```personal_sign```一致，常用于DApp登录、链下鉴权等场景。

Parameters:

- `k` (string, required): ```k```参数用于设置```exchange.IO()```函数的功能，设置为```"signMessage"```时表示该函数用于对消息进行签名。
- `message` (string, object, required): ```message```参数用于指定待签名的消息：传入字符串时，按UTF-8编码进行签名；需要对原始字节签名时，传入```{hex: "0x..."}```格式的对象。
- `key` (string, optional): ```key```参数用于指定签名所使用的私钥，未传入该参数时，默认使用`exchange`交易所对象配置的私钥。

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
        "0x" + sig.digest.slice(2) + exchange.IO("encode", "uint8,bytes32,bytes32", sig.v, sig.r, sig.s))
    Log("还原地址:", "0x" + String(ret).slice(-40), "钱包地址:", exchange.IO("address").toLowerCase())
}
```

#### exchange.IO("api", ...)

```
exchange.IO(k, address, method)
exchange.IO(k, address, method, ...args)
exchange.IO(k, address, method, value, ...args)
exchange.IO(k, address, method, ...args, options)
```

Forms:

- `exchange.IO("api", ...)`

```exchange.IO("api", ...)```调用方式用于调用智能合约的方法。

Parameters:

- `k` (string, required): ```k```参数用于设置```exchange.IO()```函数的功能，设置为```"api"```时表示该函数用于扩展调用请求。
- `address` (string, required): ```address```参数用于指定智能合约的地址。
- `method` (string, required): ```method```参数用于指定所要调用的智能合约方法。
- `value` (number / string, optional): ```value```参数为调用时附带的原生币数量（链上整数，以太坊为wei，波场为sun）。只有方法的```stateMutability```为```payable```时才需要传，并且放在方法参数之前；```exchange.IO()```函数根据已注册ABI中的```stateMutability```判断是否需要该参数，```nonpayable```、```view```等方法不传```value```参数。```stateMutability```属性可以从ABI中查看。
- `arg` (string / number / bool / any (平台支持的任意类型), optional): ```arg```参数用于指定所要调用的智能合约方法的参数。
```arg```参数可能有多个，其类型与个数取决于所要调用的智能合约方法。
- `options` (object, optional): ```options```参数为发送交易的选项，只对写方法有效，作为最后一个参数传入（参数个数比方法参数多一个时识别为选项）：```gasLimit```为gas上限，不设置时由节点估算（```eth_estimateGas```）；```gasPrice```为gas价格，设置后发送传统（legacy）交易；```nonce```指定nonce，不设置时自动分配；```dryRun```为```true```时只签名不广播。波场（TRON）只支持```gasLimit```，表示手续费上限feeLimit（单位sun）。

Returns (string / number / bool / object / array): 调用只读方法（```view```、```pure```）时返回解码后的返回值：只有一个返回值时直接返回该值；有多个返回值时返回以输出参数名为键的对象，没有名字的输出依次为```ret0```、```ret1```……。```uint64```及以下位宽的整数为数字，更大的整数为十进制字符串；```address```为```0x```开头的小写地址（波场为```T```开头的地址）；```bytes```为不带```0x```的十六进制字符串；```bytes32```等定长```bytesN```为字节数值数组（例如```[17, 17, ...]```）。

调用写方法时返回交易哈希（以太坊为```0x```开头的字符串，波场为不带```0x```的交易ID）；设置```dryRun```时返回包含```hash```、```raw```（签名后的交易）、```from```、```to```、```value```、```data```、```nonce```、```gasLimit```、```chainId```、```type```、```gasPrice```、```maxFeePerGas```、```maxPriorityFeePerGas```的对象。调用失败返回空值，```GetLastError()```中有错误信息。

```decimals```方法是ERC20的一个```constant```方法，不会产生gas消耗，可用于查询某个token的精度数据。
```decimals```方法没有参数。返回值：token的精度数据。

```javascript
function main(){
    var tokenAddress = "0x111111111117dC0aa78b770fA6A738034120C302"    // 代币的合约地址，例子中的代币为1INCH
    Log(exchange.IO("api", tokenAddress, "decimals"))                  // 查询并打印1INCH代币的精度指数，结果为18
}
```

```allowance```方法是ERC20的一个```constant```方法，不会产生gas消耗，可用于查询某个token对某个合约地址的授权额度。
```allowance```方法需要传入2个参数，第一个参数为钱包地址，第二个参数为被授权的地址。返回值：token的授权额度。
```owner```：钱包地址，例子中以字符串"owner"代替，实际使用时需要填写具体地址。
```spender```：被授权的合约地址，例子中以字符串"spender"代替，实际使用时需要填写具体地址，例如可以是```Uniswap V3 router v1```地址。

```javascript
function main(){
    // 代币的合约地址，例子中的代币为1INCH
    var tokenAddress = "0x111111111117dC0aa78b770fA6A738034120C302"

    // 例如查询结果为1000000000000000000，除以该token的精度单位1e18，可知当前交易所对象绑定的钱包给spender地址授权了1个1INCH
    Log(exchange.IO("api", tokenAddress, "allowance", "owner", "spender"))
}
```

```approve```方法是ERC20的一个非```constant```方法，会产生gas消耗，用于给某个合约地址授权token的操作额度。
```approve```方法需要传入2个参数，第一个参数为被授权的地址，第二个参数为授权的额度。返回值：txid。
```spender```：被授权的合约地址，例子中以字符串"spender"代替，实际使用时需要填写具体地址，例如可以是```Uniswap V3 router v1```地址。
```0xde0b6b3a7640000```：授权数量，此处使用十六进制字符串表示，对应的十进制数值为1e18，除以例子中的token精度单位（即1e18），即授权了1个token。
```exchange.IO()```函数的第三个参数传入方法名```approve```，也可以写为methodId的形式，例如："0x095ea7b3"；还可以写为完整的标准方法名，例如："approve(address,uint256)"。

```javascript
function main(){
    // 代币的合约地址，例子中的代币为1INCH
    var tokenAddress = "0x111111111117dC0aa78b770fA6A738034120C302"

    // 授权量的十六进制字符串: 0xde0b6b3a7640000 , 对应的十进制数值: 1e18 , 1e18除以该token的精度单位，即1个代币 , 所以这里表示授权1个代币
    Log(exchange.IO("api", tokenAddress, "approve", "spender", "0xde0b6b3a7640000"))
}
```

```multicall```方法是```Uniswap V3```的一个非```constant```方法，会产生gas消耗，用于多路径兑换代币。
```multicall```方法可能有多种传参方式，具体可以查询包含该方法的ABI，调用该方法之前需要先注册ABI。返回值：txid。
在Uniswap / PancakeSwap上兑换可以直接使用`Uniswap`交易所对象，不需要自己编码调用。

以下使用伪代码来描述一些细节：
```
exchange.IO("api", ContractV3SwapRouterV2, "multicall(uint256,bytes[])", value, deadline, data)
```

```ContractV3SwapRouterV2```：Uniswap V3的router v2地址。
```value```：转账的ETH数量，如果兑换操作的tokenIn代币不是ETH，则设置为0。
```deadline```：```deadline```是```multicall```方法的参数，可以设置为(new Date().getTime() / 1000) + 3600，表示一小时内有效。
```data```：```data```是```multicall```方法的参数，即需要执行的打包操作数据。与```exchange.IO("api", "eth", "send", "toAddress", toAmount)```类似，调用```multicall```方法时也可以指定方法调用的```gasLimit/gasPrice/nonce```设置，同样使用伪代码来描述：

```
exchange.IO("api", ContractV3SwapRouterV2, "multicall(uint256,bytes[])", value, deadline, data, {gasPrice: 123456, gasLimit: 300000})
```

可以根据具体需求设置```{gasPrice: 11, gasLimit: 111, nonce: 111}```参数，该参数作为```exchange.IO()```函数的最后一个参数传入。
可以省略其中的```nonce```，使用系统默认值；也可以不设置```gasLimit/gasPrice/nonce```，全部使用系统默认值。

在该参数中设置```dryRun: true```时，只签名不广播，返回包含```hash```、```raw```（签名后的交易）等字段的对象。如需预先确认调用能否成功，可以将```"api"```替换为```"call"```，使用```exchange.IO("call", ...)```模拟执行（不签名、不消耗gas），详见```exchange.IO("call", ...)```。

```javascript
function main() {
    var ContractV3SwapRouterV2 = "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45"
    var tokenInName = "ETH"
    var amountIn = 0.01
    var options = {gasPrice: 5000000000, gasLimit: 300000, nonce: 100}   // 此处仅为示例，具体需根据实际场景设置
    var data = ""                                                       // 编码后的数据，此处为空字符串，具体需根据实际场景设置
    var tx = exchange.IO("api", ContractV3SwapRouterV2, "multicall(uint256,bytes[])", (tokenInName == 'ETH' ? amountIn : 0), (new Date().getTime() / 1000) + 3600, data, options || {})
}
```

只读方法通过```eth_call```在最新区块上执行，不签名、不消耗gas。

写方法用配置的私钥签名后广播。不设置```gasPrice```时，支持EIP-1559的链发送EIP-1559（type 2）交易：小费取节点建议值（```eth_maxPriorityFeePerGas```）与最近20个区块实际小费中位数（```eth_feeHistory```）中的较大者，最高费用为```2 × baseFee + 小费```；不支持EIP-1559的链按节点的```eth_gasPrice```出价。

不设置```nonce```时自动分配并与链上待处理计数同步，连续发送不会重复使用nonce，参看```exchange.IO("nonce", ...)```。交易发送后可以用```exchange.IO("waitReceipt", ...)```等待上链，长时间未上链时可以用```exchange.IO("speedUp", ...)```加价重发或用```exchange.IO("cancelTx", ...)```取消。

声明为```nonpayable```的询价方法（如Uniswap QuoterV2）会被当作写方法签名并发送交易。只想取得返回值或预演写操作时，使用```exchange.IO("call", ...)```模拟执行。

#### exchange.IO("call", ...)

```
exchange.IO(k, address, method, ...args)
exchange.IO(k, address, calldata)
exchange.IO(k, address, calldata, options)
```

Forms:

- `exchange.IO("call", ...)`

```exchange.IO("call", ...)```调用方式通过```eth_call```模拟执行智能合约的任意方法（包括会修改链上状态的写入方法），该过程不签名、不广播交易、不消耗gas，适用于链上询价、交易预演以及检查交易能否成功执行。

Parameters:

- `k` (string, required): ```k```参数用于设置```exchange.IO()```函数的功能，设置为```"call"```时表示该函数用于模拟执行合约方法。
- `address` (string, required): ```address```参数用于指定智能合约的地址。
- `method` (string, optional): ```method```参数用于指定要模拟执行的方法，可以是方法名、完整的方法签名（例如```"transfer(address,uint256)"```，用于区分重载方法）或方法选择器。使用方法名时，需要先通过```exchange.IO("abi", ...)```注册合约ABI（ERC20标准方法已内置，无需注册）。
- `calldata` (string, optional): ```calldata```参数为完整的调用数据（以```0x```开头的十六进制字符串，由方法选择器和编码后的参数组成），例如聚合器API返回的交易```data```。传入```calldata```时无需注册ABI，函数返回原始返回数据。
- `args` (string, number, bool, object, array, any (platform supported type), optional): ```args```参数为方法的参数，排列方式与```exchange.IO("api", ...)```调用合约方法时完全相同（```payable```方法第一个参数为附带的原生币数量），把```"api"```换成```"call"```即可预演同一笔调用。最后一个参数可以是选项对象```{from, value, block, gasLimit}```：```from```指定以哪个地址的身份执行（默认为配置的钱包地址，没有配置私钥时为零地址），```value```为附带的原生币数量，```block```为执行时的区块（默认```"latest"```，可设置区块高度或```"pending"```等标签），```gasLimit```为执行的gas上限。

Returns (string, number, bool, object, array): 使用方法名调用时，返回按ABI解码后的返回值（有多个返回值时为对象）；方法没有返回值时，执行成功返回```true```。使用```calldata```调用时，返回原始返回数据（以```0x```开头的十六进制字符串），可以使用```exchange.IO("decode", ...)```进行解码。执行失败（合约revert）时返回空值，可以通过```GetLastError()```获取合约给出的失败原因。

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
        outputs: [{ name: "amountOut", type: "uint256" }, { name: "sqrtPriceX96After", type: "uint160" },
            { name: "initializedTicksCrossed", type: "uint32" }, { name: "gasEstimate", type: "uint256" }]
    }]))
    // 询价：1 WETH 在 0.05% 费率池中可兑换多少 USDC
    var q = exchange.IO("call", QUOTER, "quoteExactInputSingle", [WETH, USDC, "1000000000000000000", 500, 0])
    Log("amountOut:", q.amountOut, "gasEstimate:", q.gasEstimate)

    // 模拟写入：以当前钱包地址的身份执行 transfer，余额不足时返回 null，可通过 GetLastError() 获取合约返回的失败原因
    var ok = exchange.IO("call", USDC, "transfer", "0x1111111254EEB25477B68fb85Ed929f73A960582", 1)
    Log("transfer 模拟:", ok, GetLastError())
    // 通过 from 参数指定以其他地址的身份进行模拟
    Log("指定 from 模拟:", exchange.IO("call", USDC, "transfer", "0x1111111254EEB25477B68fb85Ed929f73A960582", 1,
        { from: "0x55FE002aefF02F77364de339a1292923A15844B8" }))
}
```

使用聚合器（KyberSwap 公开 API）完成询价、生成交易、预演和发送交易的完整流程。```DRY_RUN```为```true```时，仅签名而不广播交易。

```javascript
// 聚合器询价与兑换示例（使用 KyberSwap 公开 API，无需 key）：询价 → 生成交易 → eth_call 预演 → 发送
// DRY_RUN = true 时仅签名、不广播
var DRY_RUN = true
var CHAIN = "ethereum"                                          // KyberSwap 使用的链名称：ethereum / bsc / base / arbitrum …
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
    Log("询价：", s.amountIn, "→", s.amountOut, "（约 $" + Number(s.amountOutUsd).toFixed(2) + "），gas≈" + s.gas)

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
        Log("已签名（dryRun，未广播）：hash", tx && tx.hash, "| nonce", tx && tx.nonce, "| type", tx && tx.type)
    } else {
        Log("已发送：", tx)
    }
}
```

Uniswap QuoterV2等合约的询价方法声明为```nonpayable```，使用```exchange.IO("api", ...)```调用时会被当作写操作，签名并发送交易，因此询价应使用```exchange.IO("call", ...)```。

合约revert的原因会被解析为可读文本：```Error(string)```返回原因字符串，```Panic(uint256)```返回错误码及其含义，自定义错误返回错误选择器和原始数据。

需要实际发送交易时，可以使用```exchange.IO("api", "eth", "send", toAddress, value, {data: calldata})```发送任意调用数据；设置```dryRun: true```时只签名、不广播。

目前仅支持以太坊（EVM）链，不支持波场（TRON）。

#### exchange.IO("multicall", ...)

```
exchange.IO(k, calls)
exchange.IO(k, calls, options)
```

Forms:

- `exchange.IO("multicall", ...)`

```exchange.IO("multicall", ...)```调用方式用于通过Multicall3合约在一次请求中批量读取多个合约调用的结果，适用于批量查询余额、流动池状态、报价等数据，可有效减少RPC请求次数。

Parameters:

- `k` (string, required): ```k```参数用于设置```exchange.IO()```函数的功能，设置为```"multicall"```时表示使用该函数批量读取合约调用结果。
- `calls` (array, required): ```calls```参数为调用数组，数组中每一项的格式为```[合约地址, 方法, ...参数]```，写法与```exchange.IO("call", ...)```相同，其中方法也可以是完整的调用数据（calldata）。不支持附带原生代币的```payable```调用。
- `options` (object, optional): ```options```参数为可选设置项：```allowFailure```设置为```true```时，调用失败的项返回空值；否则（默认）任意一项调用失败时整体返回空值，并可通过```GetLastError()```获取失败项的序号和原因。```block```用于指定读取的区块（默认为```"latest"```，负数表示相对于最新区块的偏移）。```multicall```用于指定Multicall3合约地址（默认为```0xcA11bde05977b3631167028862bE2a173976CA11```，主流EVM链均在该地址部署了此合约）。

Returns (array): 返回与```calls```顺序一致的结果数组，每一项均按ABI解码，与单独调用```exchange.IO("call", ...)```所得的结果相同。

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
            { name: "observationIndex", type: "uint16" }, { name: "observationCardinality", type: "uint16" },
            { name: "observationCardinalityNext", type: "uint16" }, { name: "feeProtocol", type: "uint8" },
            { name: "unlocked", type: "bool" }] },
        { type: "function", name: "liquidity", stateMutability: "view", inputs: [], outputs: [{ type: "uint128" }] }
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
    var ret2 = exchange.IO("multicall", [[USDC, "decimals"], [USDC, "transfer", POOL, 1]], { allowFailure: true })
    Log("decimals:", ret2[0], "transfer（余额不足）:", ret2[1])
}
```

所有调用均基于同一区块状态执行，返回结果相互一致。

目前仅支持以太坊（EVM）链，暂不支持波场（TRON）。

#### exchange.IO("logs", ...)

```
exchange.IO(k, query)
```

Forms:

- `exchange.IO("logs", ...)`

```exchange.IO("logs", ...)```调用方式用于查询合约的事件日志（```eth_getLogs```），并按ABI进行解码。支持按区块范围和事件的indexed参数进行过滤，可用于监控成交、到账、流动性池变化等链上事件。

Parameters:

- `k` (string, required): ```k```参数用于设置```exchange.IO()```函数的功能，设置为```"logs"```时表示该函数用于查询事件日志。
- `query` (object, required): ```query```参数用于设置查询条件：```address```为合约地址（字符串或数组）；```event```为事件名称或完整的事件签名（例如```"Transfer(address,address,uint256)"```）；```filter```为按indexed参数名进行过滤的对象，值为数组时表示匹配其中任意一个值；```fromBlock```、```toBlock```用于指定区块范围（可为数字或```"latest"```等标签，负数表示相对于最新区块的偏移，默认均为```"latest"```）；也可以直接设置```topics```或```blockHash```。

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
        var mine = exchange.IO("logs", { address: USDC, event: "Transfer", fromBlock: -2, filter: { from: t.args.from } })
        Log("同一发送方:", mine.length, "条")
    }

    // 其它合约的事件需要先注册包含该事件的 ABI
    exchange.IO("abi", POOL, JSON.stringify([{ type: "event", name: "Swap", anonymous: false, inputs: [
        { indexed: true, name: "sender", type: "address" }, { indexed: true, name: "recipient", type: "address" },
        { indexed: false, name: "amount0", type: "int256" }, { indexed: false, name: "amount1", type: "int256" },
        { indexed: false, name: "sqrtPriceX96", type: "uint160" }, { indexed: false, name: "liquidity", type: "uint128" },
        { indexed: false, name: "tick", type: "int24" }] }]))
    var swaps = exchange.IO("logs", { address: POOL, event: "Swap", fromBlock: -20 })
    swaps.forEach(function (s) {
        Log("Swap 区块", s.blockNumber, "amount0:", s.args.amount0, "amount1:", s.args.amount1, "tick:", s.args.tick)
    })
}
```

代币的```Transfer```、```Approval```事件已内置支持；其他事件需要先通过```exchange.IO("abi", ...)```注册包含该事件的ABI。

当节点对查询的区块跨度或返回条数有限制时，将返回节点给出的错误信息，此时可缩小区块范围进行分段查询。

目前仅支持以太坊（EVM）链，不支持波场（TRON）。

#### exchange.IO("waitReceipt", ...)

```
exchange.IO(k, txHash)
exchange.IO(k, txHash, options)
```

Forms:

- `exchange.IO("waitReceipt", ...)`

```exchange.IO("waitReceipt", ...)```调用方式用于等待交易上链并达到指定的确认数，返回交易回执及解码后的事件日志。

Parameters:

- `k` (string, required): ```k```参数用于设置```exchange.IO()```函数的功能，设置为```"waitReceipt"```时表示该函数用于等待交易回执。
- `txHash` (string, required): ```txHash```参数为交易哈希（以```0x```开头的32字节十六进制字符串），即发送交易时```exchange.IO("api", ...)```返回的值。
- `options` (object, optional): ```options```参数为可选设置```{timeout, confirmations, interval}```：```timeout```为最长等待时间（毫秒，默认120000，范围1000～600000），```confirmations```为需要的确认数（默认1），```interval```为查询间隔（毫秒，默认1500，范围200～60000）。

Returns (object): 返回交易回执，保留节点返回的原始字段，并做如下处理：```status```为数值（1表示成功，0表示失败），```blockNumber```为数值，```gasUsed```、```effectiveGasPrice```等字段为十进制字符串；```events```为解码后的事件数组，每个元素包含```address```、```event```、```args```、```logIndex```字段；交易执行失败时，```revertReason```为失败原因。若超时仍未上链，则返回空值，可通过```GetLastError()```获取具体的错误信息。

发送交易后等待其上链，并检查执行结果和事件。

```javascript
function main() {
    // 发送交易后会得到交易哈希，例如：
    // var txHash = exchange.IO("api", "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", "approve", spender, amount)
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

#### exchange.IO("nonce", ...)

```
exchange.IO(k)
exchange.IO(k, "sync")
exchange.IO(k, nonce)
```

Forms:

- `exchange.IO("nonce", ...)`

```exchange.IO("nonce", ...)```函数的调用方式用于查看、同步或设置发送交易时使用的nonce计数。

Parameters:

- `k` (string, required): ```k```参数用于设置```exchange.IO()```函数的功能，设置为```"nonce"```时表示该函数用于管理nonce。
- `nonce` (string, number, optional): 不传该参数时仅查询nonce状态；传入```"sync"```时，按节点返回的pending计数重新同步本地记录；传入数值时，将本地记录的下一个nonce设置为该值。

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

#### exchange.IO("speedUp", ...)

```
exchange.IO(k, txHash)
exchange.IO(k, txHash, options)
```

Forms:

- `exchange.IO("speedUp", ...)`

```exchange.IO("speedUp", ...)```调用方式用于对卡住（长时间未上链）的交易进行加价重发：保持接收地址、金额、调用数据和gas上限不变，仅提高手续费。

Parameters:

- `k` (string, required): ```k```参数用于设置```exchange.IO()```函数的功能，设置为```"speedUp"```表示该函数用于加价重发交易。
- `txHash` (string, required): ```txHash```参数为待替换的、尚未上链的交易哈希，该交易必须由当前钱包发出。
- `options` (object, optional): ```options```参数为可选设置：```multiplier```为手续费放大倍数，范围1.1～10，默认1.125；```dryRun```为```true```时只签名不发送，返回替换交易的内容（字段与```exchange.IO("api", ...)```设置```dryRun```时相同，另有```replaces```为被替换的交易哈希）。

Returns (string, object): 返回替换交易的哈希；```dryRun```为```true```时返回替换交易的内容。

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

#### exchange.IO("cancelTx", ...)

```
exchange.IO(k, txHash)
exchange.IO(k, txHash, options)
```

Forms:

- `exchange.IO("cancelTx", ...)`

```exchange.IO("cancelTx", ...)```调用方式用于取消尚未上链的交易：使用与原交易相同的nonce，以更高的手续费发送一笔转给自己的0金额交易；该交易先上链后，原交易即失效。

Parameters:

- `k` (string, required): ```k```参数用于设置```exchange.IO()```函数的功能，设置为```"cancelTx"```时表示该函数用于取消交易。
- `txHash` (string, required): ```txHash```参数为待替换的、尚未上链的交易哈希，该交易必须由当前钱包发出。
- `options` (object, optional): ```options```参数为可选设置：```multiplier```为手续费放大倍数，范围1.1～10，默认1.125；```dryRun```为```true```时只签名不发送，返回替换交易的内容（字段与```exchange.IO("api", ...)```设置```dryRun```时相同，另有```replaces```为被替换的交易哈希）。

Returns (string, object): 返回取消交易的哈希；启用```dryRun```时返回取消交易的内容。

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

#### exchange.IO("toUnits", ...)

```
exchange.IO(k, amount, decimals)
```

Forms:

- `exchange.IO("toUnits", ...)`

```exchange.IO("toUnits", ...)```函数的调用方式用于将可读数量换算为链上整数。换算全程以字符串形式进行精确计算，不经过浮点数运算。

Parameters:

- `k` (string, required): ```k```参数用于设置```exchange.IO()```函数的功能，设置为```"toUnits"```表示该函数用于将可读数量换算为链上整数。
- `amount` (string, number, required): ```amount```参数为可读数量，例如```"1.5"```。建议以字符串形式传入，以避免JavaScript数值类型的精度问题；不支持科学计数法。
- `decimals` (number, string, required): ```decimals```参数为精度，可以传入数字（例如USDC为6，ETH为18），也可以传入代币合约地址，此时将自动调用该代币合约的```decimals()```方法读取精度。

Returns (string): 返回链上整数（十进制字符串）。当小数位数超过精度时，返回空值并报错，不会静默截断。

换算USDC与ETH的数量。

```javascript
function main() {
    var USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
    // 可读数量 -> 链上整数，精度可以传数字，也可以传代币地址（自动读取 decimals）
    Log(exchange.IO("toUnits", "1.5", 6))           // 1500000
    Log(exchange.IO("toUnits", "1.5", USDC))        // 1500000
    Log(exchange.IO("toUnits", "0.01", 18))         // 10000000000000000
    // 链上整数 -> 可读数量
    Log(exchange.IO("fromUnits", "1500000", 6))     // 1.5
    var raw = exchange.IO("api", USDC, "balanceOf", exchange.IO("address"))
    Log("USDC余额:", exchange.IO("fromUnits", raw, USDC))
    // 小数位多于精度时报错，不会静默截断
    Log(exchange.IO("toUnits", "1.0000001", 6), GetLastError())
}
```

与```exchange.IO("fromUnits", ...)```互为逆运算。

#### exchange.IO("fromUnits", ...)

```
exchange.IO(k, amount, decimals)
```

Forms:

- `exchange.IO("fromUnits", ...)`

```exchange.IO("fromUnits", ...)```调用方式用于将链上整数值换算为可读数量，整个换算过程基于字符串进行精确计算，不经过浮点数运算，避免精度损失。

Parameters:

- `k` (string, required): ```k```参数用于设置```exchange.IO()```函数的功能，设置为```"fromUnits"```时表示该函数用于将链上整数值换算为可读数量。
- `amount` (string, number, required): ```amount```参数为待换算的链上整数值，可以是十进制字符串、以```0x```开头的十六进制字符串或数值。
- `decimals` (number, string, required): ```decimals```参数用于指定精度，可以传入数值（例如USDC为6，ETH为18），也可以传入代币合约地址，此时将自动调用该代币合约的```decimals()```方法读取精度。

Returns (string): 返回可读数量（十进制字符串，已去除末尾多余的0）。

USDC与ETH的数量换算。

```javascript
function main() {
    var USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
    // 可读数量 -> 链上整数，精度可以传数字，也可以传代币地址（自动读取 decimals）
    Log(exchange.IO("toUnits", "1.5", 6))           // 1500000
    Log(exchange.IO("toUnits", "1.5", USDC))        // 1500000
    Log(exchange.IO("toUnits", "0.01", 18))         // 10000000000000000
    // 链上整数 -> 可读数量
    Log(exchange.IO("fromUnits", "1500000", 6))     // 1.5
    var raw = exchange.IO("api", USDC, "balanceOf", exchange.IO("address"))
    Log("USDC余额:", exchange.IO("fromUnits", raw, USDC))
    // 小数位多于精度时报错，不会静默截断
    Log(exchange.IO("toUnits", "1.0000001", 6), GetLastError())
}
```

与```exchange.IO("toUnits", ...)```互为逆运算。

#### exchange.IO("uniswapV3", ...)

```
exchange.IO(k, fn, ...args)
```

Forms:

- `exchange.IO("uniswapV3", ...)`

```exchange.IO("uniswapV3", ...)```调用方式用于集中流动性（Uniswap V3）相关的计算，包括tick、价格与sqrtPriceX96之间的换算，以及流动性与代币数量之间的换算。适用于Uniswap v3/v4、PancakeSwap v3、Aerodrome Slipstream、SushiSwap v3等采用相同公式的协议。

Parameters:

- `k` (string, required): ```k```参数用于设置```exchange.IO()```函数的功能，设置为```"uniswapV3"```时表示该函数用于集中流动性计算。
- `fn` (string, required): 需要调用的计算函数，支持以下函数：
tickToPrice(tick, decimals0, decimals1)：计算tick对应的价格（1个token0可兑换的token1数量）；
priceToTick(price, decimals0, decimals1[, tickSpacing])：计算不高于该价格的最大tick，传入tickSpacing时向下对齐到其整数倍；
sqrtPriceToPrice(sqrtPriceX96, decimals0, decimals1)：将池子slot0中的sqrtPriceX96换算为价格；
tickToSqrtPrice(tick)：计算tick对应的sqrtPriceX96（与合约TickMath.getSqrtRatioAtTick的结果一致）；
sqrtPriceToTick(sqrtPriceX96)：计算sqrtPriceX96所在的tick（与合约TickMath.getTickAtSqrtRatio的结果一致）；
nearestUsableTick(tick, tickSpacing)：将tick四舍五入到tickSpacing的整数倍；
amountsForLiquidity(sqrtPriceX96, tickLower, tickUpper, liquidity)：计算区间内的流动性在当前价格下对应的代币数量{amount0, amount1}（与合约移除流动性时的计算一致）；
liquidityForAmounts(sqrtPriceX96, tickLower, tickUpper, amount0, amount1)：计算在不超过给定代币数量的前提下可提供的最大流动性。
- `args` (string, number, required): 计算函数的参数。精度参数```decimals0```、```decimals1```可以传入数字，也可以传入代币地址（此时自动调用```decimals()```读取精度）。大整数参数可以使用字符串传入。

Returns (number, string, object): 价格类函数返回数值（浮点数，用于显示和价位估算）；tick类函数返回整数；sqrtPriceX96、流动性及数量类函数返回十进制字符串（精确值）。

读取Uniswap V3池子的价格，并计算在当前价格附近提供流动性所需的代币数量。

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
    Log("实际投入:", exchange.IO("fromUnits", used.amount0, 6), "USDC +", exchange.IO("fromUnits", used.amount1, 18), "WETH")
}
```

tick与sqrtPriceX96之间的换算、流动性与代币数量之间的换算，均为合约TickMath、LiquidityAmounts算法的逐位移植，计算结果与链上合约完全一致；价格换算使用浮点数运算，存在浮点精度误差。

池子中的token0、token1按合约地址大小排序，价格方向为1个token0可兑换的token1数量，计算前需要先确认池子的```token0```。

#### exchange.IO("contracts", ...)

```
exchange.IO(k)
exchange.IO(k, chainId)
```

Forms:

- `exchange.IO("contracts", ...)`

```exchange.IO("contracts", ...)```调用方式用于获取当前链（或指定链）的常用合约地址，包括主流代币、Multicall3、Permit2，以及Uniswap V3、PancakeSwap V3的Factory、路由、QuoterV2和头寸管理合约。

Parameters:

- `k` (string, required): ```k```参数用于设置```exchange.IO()```函数的功能，设置为```"contracts"```时表示该函数用于获取常用合约地址。
- `chainId` (number, optional): ```chainId```参数用于指定链ID，未传入时默认使用当前节点所在的链。目前支持的链：以太坊（1）、BNB Smart Chain（56）、Base（8453）、Arbitrum One（42161）。

Returns (object): 返回```{chainId, name, wrappedNative, tokens, multicall3, permit2, uniswapV3, pancakeV3}```：```name```为链名称；```wrappedNative```为包装币在```tokens```中的名称（如```"WETH"```、```"WBNB"```）；```tokens```的每一项为```{address, decimals}```；```uniswapV3```、```pancakeV3```包含```factory```、```router```（Uniswap为SwapRouter02，PancakeSwap为SmartRouter）、```quoterV2```、```positionManager```。不支持的链返回空值并报错。

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

目前仅支持以太坊（EVM）链，波场（TRON）不支持。

#### exchange.IO("address")

```
exchange.IO(k)
exchange.IO(k, key)
```

Forms:

- `exchange.IO("address")`

```exchange.IO("address")```函数的调用方式用于获取`exchange`交易所对象配置的钱包的地址。传入私钥时返回该私钥对应的钱包地址。

Parameters:

- `k` (string, required): ```k```参数用于设置```exchange.IO()```函数的功能。当设置为```"address"```时，表示该函数用于获取已配置的钱包地址。
- `key` (string, optional): ```key```参数为私钥（十六进制字符串，```0x```前缀可选），返回该私钥对应的钱包地址，不会切换交易所对象使用的私钥（切换请使用```exchange.IO("key", ...)```）。不传时使用配置的私钥。

Returns (string): 返回钱包地址：以太坊（EVM）为```0x```开头的小写地址，波场（TRON）为```T```开头的地址。私钥无效时返回空值。

```javascript
function main() {
    Log(exchange.IO("address"))         // 打印exchange交易所对象上配置的私钥对应的钱包地址
}
```

#### exchange.IO("base", ...)

```
exchange.IO(k)
exchange.IO(k, address)
```

Forms:

- `exchange.IO("base", ...)`

```exchange.IO("base", ...)```调用方式用于设置RPC节点地址，支持设置多个节点互为备用。

Parameters:

- `k` (string, required): ```k```参数用于指定```exchange.IO()```函数的功能，设置为```"base"```时表示该函数用于切换RPC节点。
- `address` (string, array, optional): ```address```参数为节点地址。以太坊（EVM）支持```http(s)://```和```ws(s)://```地址；设置多个节点时传入地址数组，或用逗号（也可以是空格、换行）分隔的字符串。波场（TRON）只支持一个全节点HTTP地址，旧的gRPC地址```grpc.trongrid.io:50051```、```grpc.nile.trongrid.io:50051```、```grpc.shasta.trongrid.io:50051```会换成对应的HTTP地址，其它非HTTP地址报错。不传时只查询当前的节点地址。

Returns (string): 设置时返回设置前的节点地址（多个节点时为逗号分隔的字符串）；不传```address```时返回当前的节点地址。

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

设置多个节点时，优先从上次请求成功的节点开始使用；当节点出现连接失败、请求超时、返回HTTP 429或5xx状态码、响应不是有效的JSON-RPC格式或被限流等情况时，自动切换到下一个节点。合约执行失败（revert）等正常的JSON-RPC错误不会触发节点切换。

每个节点首次使用时会校验chainId，与第一个可用节点所在链不一致的节点将不会被使用，以避免将交易发送到其他链。日志中的节点地址仅显示协议和域名，不包含路径中的API Key。

切换节点后重新获取链ID。多个节点互为备用只适用于以太坊（EVM），波场（TRON）不支持。

#### exchange.IO("sendBase", ...)

```
exchange.IO(k)
exchange.IO(k, url)
```

Forms:

- `exchange.IO("sendBase", ...)`

```exchange.IO("sendBase", ...)```调用方式用于设置仅用于广播交易的节点。设置后，读取数据、查询nonce、估算gas等请求仍使用交易所对象配置的节点，而签名后的交易仅发送至该节点。该功能适用于Flashbots Protect、MEV Blocker等私有交易通道，可避免交易进入公开交易池后遭到抢跑或三明治攻击。

Parameters:

- `k` (string, required): ```k```参数用于设置```exchange.IO()```函数的功能，设置为```"sendBase"```时表示该函数用于设置广播交易的节点。
- `url` (string, optional): ```url```参数为节点的JSON-RPC地址（支持http或https协议），例如```"https://rpc.mevblocker.io"```、```"https://rpc.flashbots.net"```。传入空字符串时清除该设置，恢复为通过交易所对象配置的节点发送交易；不传入该参数时，仅查询当前设置。

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

目前仅支持以太坊（EVM）链，暂不支持波场（TRON）。

### Uniswap

Uniswap交易所对象在一条链上（Ethereum、Arbitrum、Base、BNB Chain）连接Uniswap或PancakeSwap的V2、V3池子，把链上兑换映射为现货交易函数：

| 函数 | Uniswap交易所的行为 |
| - | - |
| exchange.GetTicker() | 买一、卖一为约1000美元规模的实际可成交价；链上没有24小时统计 |
| exchange.GetDepth() | 由逐档递增规模的链上询价推算 |
| exchange.GetTrades() | 该交易对各个池子最近的链上成交 |
| exchange.GetAssets() | 原生币和代币表中各代币的钱包余额 |
| exchange.CreateOrder() | 立即在链上兑换：限价为最差成交价，市价按滑点保护；市价买入时数量为要花费的计价币 |
| exchange.GetOrder() | 订单ID是交易哈希，状态来自交易回执 |
| exchange.CancelOrder() | 发送同nonce的替换交易；交易上链后无法撤单 |

不支持```exchange.GetRecords()```、```exchange.GetHistoryOrders()```、```exchange.GetTickers()```。交易对写作```ETH_USDC```，原生币（ETH、BNB）与包装币（WETH、WBNB）是两个不同的资产。下面的```exchange.IO()```指令用于转账、询价、模拟下单和兑换参数设置。

#### exchange.IO("transfer", ...)

```
exchange.IO(k, to, amount)
exchange.IO(k, to, amount, token)
```

Forms:

- `exchange.IO("transfer", ...)`

```exchange.IO("transfer", ...)```调用方式用于从Uniswap交易所对象所配置的钱包中转出链上原生币（如ETH、BNB）或ERC20代币。

Parameters:

- `k` (string, required): ```k```参数用于指定```exchange.IO()```函数的功能。设置为```"transfer"```时，该函数用于执行转账。
- `to` (string, required): ```to```参数为收款地址，即以```0x```开头的20字节十六进制地址，且必须是交易所对象所在链上的地址。
- `amount` (string / number, required): ```amount```参数为转账数量，采用可读单位（例如```"0.05"```表示0.05个ETH）。建议以字符串形式传入，函数会按代币精度进行精确换算；若小数位数超出代币精度则直接报错，不会静默截断。设置为```"all"```表示全部转出：转原生币时，按本次交易手续费上限预留后转出剩余全部余额；转代币时，转出全部代币余额。
- `token` (string, optional): ```token```参数用于指定要转出的代币，可以是代币名称（如```"USDC"```，须为内置代币或已通过```exchange.IO("token", ...)```登记的代币），也可以是代币合约地址。不传入该参数时表示转出原生币。

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

出现以下情况时，函数会在签名前直接报错，不会发出交易：地址格式错误、收款地址为零地址、收款地址为钱包自身、转账数量为0、转账数量超过余额、代币未登记。

原生币全部转出（```"all"```）时，在EIP-1559链上会按本次报价的最高手续费进行预留。由于实际扣除的手续费低于预留值，钱包中会剩余极少量零头。

优先费（小费）取节点建议值与最近区块实际优先费中位数两者中的较大值，以避免节点建议值为0时交易长时间无法上链。

转账为链上真实交易，一经发出无法撤回。向交易所充值地址转账前，请确认对方支持该链上的充值。

#### exchange.IO("receipt", ...)

```
exchange.IO(k, txHash)
exchange.IO(k, txHash, waitMs)
```

Forms:

- `exchange.IO("receipt", ...)`

以```exchange.IO("receipt", ...)```方式调用该函数，可查询Uniswap交易所对象所发出交易（如下单、转账等）的回执，也可等待交易上链。

Parameters:

- `k` (string, required): ```k```参数用于设置```exchange.IO()```函数的功能。设置为```"receipt"```时，该函数用于查询交易回执。
- `txHash` (string, required): ```txHash```参数为交易哈希，即以```0x```开头、长度为32字节的十六进制字符串，例如```exchange.IO("transfer", ...)```返回的```txHash```。
- `waitMs` (number, optional): ```waitMs```参数为最长等待时间，单位为毫秒。交易未上链时，每1.5秒查询一次，最长等待10分钟。未传入该参数或传入0时，仅查询一次。

Returns (object): 交易已上链时，返回```{txHash, status, blockNumber, gasUsed, fee}```。其中，```status```的值为```"success"```或```"reverted"```；```fee```为实际支付的手续费，以原生币计价，采用可读单位。等待时间内交易仍未上链时，返回```{txHash, pending: true, known}```。其中，```known```表示节点能否查询到该笔交易；如果查询不到，通常是因为交易已被丢弃或交易哈希有误。

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

#### exchange.IO("route", ...)

```
exchange.IO(k, symbol, side, qty)
```

Forms:

- `exchange.IO("route", ...)`

```exchange.IO("route", ...)```调用用于在Uniswap交易所对象上询价：列出一笔兑换在各条候选路径上的报价以及最优路径，不会实际下单。

Parameters:

- `k` (string, required): ```k```参数用于设置```exchange.IO()```函数的功能，设置为```"route"```时，该函数用于询价。
- `symbol` (string, required): ```symbol```参数为交易对，例如```"ETH_USDC"```。
- `side` (string, required): ```side```参数为交易方向：```"sell"```表示卖出```qty```个基础币，```"buy"```表示买入```qty```个基础币。
- `qty` (number, required): ```qty```参数为基础币的数量。

Returns (object / 空值): 返回```{symbol, side, qty, best, quote, price, candidates}```。其中，```best```为最优路径；```quote```为最优报价（卖出时为可获得的计价币数量，买入时为需支付的计价币数量）；```price```为对应的平均成交价格；```candidates```为各条候选路径的报价，每项格式为```{route, quote}```（无法报价的路径，其```quote```为```null```）。没有可用的流动性池时返回空值。

比较卖出1个ETH时各条路径的报价。

```javascript
function main() {
    var r = exchange.IO("route", "ETH_USDC", "sell", 1)
    Log("最优路径:", r.best, "可得:", r.quote, "USDC")
    r.candidates.forEach(function (c) {
        Log(c.route, c.quote)
    })
}
```

候选路径包括：V3各费率档位的直连池、V2池，以及经由包装币（如WETH）或USDC/USDT中转的两跳路径。路径的表示形式如```v3:WETH-500-USDC```（V3池，费率500即0.05%）、```v2:WETH-USDC```、```v3:UNI-3000-USDT-100-USDC```（两跳路径）。

V3路径通过链上QuoterV2合约询价（对整笔兑换进行完整模拟），V2路径根据池子储备在本地计算。报价均不含gas费用。

#### exchange.IO("simulate", ...)

```
exchange.IO(k, symbol, side, qty)
exchange.IO(k, symbol, side, qty, price)
exchange.IO(k, symbol, side, qty, price, stateOverride)
exchange.IO(k, symbol, side, qty, price, stateOverride, route)
```

Forms:

- `exchange.IO("simulate", ...)`

```exchange.IO("simulate", ...)```调用方式按照Uniswap交易所对象的下单逻辑（路径选择、询价、价格保护）构造兑换交易，仅在链上进行模拟执行（```eth_call```），不签名、不广播，也不消耗gas。

Parameters:

- `k` (string, required): ```k```参数用于指定```exchange.IO()```函数的功能，设置为```"simulate"```时表示模拟下单。
- `symbol` (string, required): ```symbol```参数为交易对，例如```"ETH_USDC"```。
- `side` (string, required): ```side```参数为交易方向，取值为```"buy"```或```"sell"```。
- `qty` (number, required): ```qty```参数为下单数量，含义与```exchange.CreateOrder()```中的数量参数相同（市价买入时为要花费的计价币数量）。
- `price` (number, optional): ```price```参数为限价价格，不传或传入```null```时表示市价单。
- `stateOverride` (object, optional): ```stateOverride```参数为节点```eth_call```调用的状态覆盖（即geth的state override set），用于在模拟时为钱包临时补充余额或授权额度，例如```{"0x钱包地址": {"balance": "0x56bc75e2d63100000"}}```。该覆盖仅在本次模拟中生效。
- `route` (string, optional): ```route```参数用于限定路径类型，可选值为```"v2"```、```"v3"```、```"hop"```（两跳）或```"direct"```（直连）。不传时在所有路径中选择最优路径。

Returns (object / 空值): 返回```{route, exactIn, amountIn, amountOut, quoted, executed, value, calls}```。其中，```quoted```为下单时的报价数量，```executed```为模拟执行得到的实际数量（精确输入时为实际获得的数量，精确输出时为实际花费的数量），两者均为以最小单位表示的十进制字符串。当限价无法满足，或余额、授权不足（且未通过状态覆盖补足）时，返回空值并输出错误信息。

为钱包临时补充100个ETH，模拟卖出1个ETH。

```javascript
function main() {
    var ov = {}
    ov[exchange.IO("address")] = { balance: "0x56bc75e2d63100000" }
    var r = exchange.IO("simulate", "ETH_USDC", "sell", 1, null, ov)
    Log("路径:", r.route, "报价:", r.quoted, "模拟执行:", r.executed)
}
```

模拟基于最新区块状态执行，与真实下单相比，唯一的差异在于交易实际上链前价格可能发生变化。

当钱包余额不足或代币未授权时，模拟会因路由合约转账失败而报错，此时可以使用```stateOverride```参数进行状态覆盖。

#### exchange.IO("token", ...)

```
exchange.IO(k)
exchange.IO(k, name, address)
```

Forms:

- `exchange.IO("token", ...)`

```exchange.IO("token", ...)```函数的调用方式用于在Uniswap交易所对象上登记代币，或者列出代币表。登记后的代币可以直接写在交易对里使用。

Parameters:

- `k` (string, required): ```k```参数用于设置```exchange.IO()```函数的功能，设置为```"token"```表示该函数用于代币登记。
- `name` (string, optional): ```name```参数为代币在交易对中使用的名字，例如```"UNI"```。
- `address` (string, optional): ```address```参数为代币合约地址，精度从链上读取。

Returns (object / array / 空值): 登记时返回```{symbol, address, decimals}```；不传参数时返回代币表数组，每项为```{symbol, address, decimals, native}```（```native```为```true```的是链上原生币）。地址不是ERC20代币时返回空值。

登记UNI后查询UNI_USDC行情。

```javascript
function main() {
    exchange.IO("token", "UNI", "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984")
    var t = exchange.GetTicker("UNI_USDC")
    Log("买一:", t.Buy, "卖一:", t.Sell)
}
```

按名字解析代币的顺序：①人工核对过的内置代币（原生币、包装币、USDC、USDT、该链的BTC等）；②```exchange.IO("token", ...)```登记过的代币；③官方代币列表：以太坊、Arbitrum、Base使用Uniswap Labs默认列表（tokens.uniswap.org），BNB链使用PancakeSwap列表（tokens.pancakeswap.finance，Base也会参考）。连接器内置一份列表快照，名字在快照里找不到时再拉取一次最新列表（24小时内只拉一次）。

官方列表中同一条链上有多个同名代币（例如桥接版与原生版）时，名字不能直接使用，报错信息会列出各个候选地址，请用合约地址指定。列表中代币的精度以链上合约为准，与列表不一致时拒绝使用。

不在代币表中的代币也可以直接用合约地址作为交易对的一部分，例如```"0x1f9840a85d5af5bf1d1762f925bdaddc4201f984_USDC"```。

```exchange.GetMarkets()```只列出内置代币之间、以及流动性排名靠前的常用币与包装币/USDC/USDT之间的交易对；列表里的其他代币同样可以直接交易。

原生币（ETH、BNB）与包装币（WETH、WBNB）是两个不同的资产：交易原生币时由路由合约自动包装和解包。

#### exchange.IO("wrap", ...)

```
exchange.IO(k, amount)
```

Forms:

- `exchange.IO("wrap", ...)`

```exchange.IO("wrap", ...)```函数的调用方式用于在Uniswap交易所对象上把原生币（ETH、BNB）包装成包装币（WETH、WBNB），1:1兑换，没有滑点，只花gas。

Parameters:

- `k` (string, required): ```k```参数用于设置```exchange.IO()```函数的功能，设置为```"wrap"```表示该函数用于包装原生币。
- `amount` (string / number, required): ```amount```参数为要包装的原生币数量（可读单位，建议写成字符串，例如```"0.01"```）。不支持```"all"```：原生币还要留着支付gas。

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

#### exchange.IO("unwrap", ...)

```
exchange.IO(k, amount)
```

Forms:

- `exchange.IO("unwrap", ...)`

```exchange.IO("unwrap", ...)```函数的调用方式用于在Uniswap交易所对象上把包装币（WETH、WBNB）解包成原生币（ETH、BNB），1:1兑换，没有滑点，只花gas。

Parameters:

- `k` (string, required): ```k```参数用于设置```exchange.IO()```函数的功能，设置为```"unwrap"```表示该函数用于解包包装币。
- `amount` (string / number, required): ```amount```参数为要解包的包装币数量（可读单位，建议写成字符串）；设置为```"all"```表示解包全部包装币。

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

#### exchange.IO("approve", ...)

```
exchange.IO(k)
exchange.IO(k, mode)
```

Forms:

- `exchange.IO("approve", ...)`

以```exchange.IO("approve", ...)```方式调用该函数，可在Uniswap交易所对象上设置代币授权模式。

Parameters:

- `k` (string, required): ```k```参数用于指定```exchange.IO()```函数的功能。设置为```"approve"```时，表示该函数用于设置代币授权模式。
- `mode` (string, optional): ```mode```参数为授权模式：```"exact"```（默认）表示每次仅授权本次兑换所需的数量；```"max"```表示授权无限额度，此后同一代币无需再次授权。不传入该参数时，表示查询当前授权模式。

Returns (string): 返回当前的授权模式：```"exact"```或```"max"```。

设置代币授权模式。

```javascript
function main() {
    exchange.IO("approve", "max")
    Log("当前授权模式:", exchange.IO("approve"))
}
```

卖出代币（输入为ERC20代币）前，连接器会检查路由合约的授权额度。若额度不足，会先发送授权交易并等待其上链确认，再发送兑换交易。若现有授权额度不为0但仍不足，则先将额度清零再重新授权（USDT等代币有此要求）。

```"max"```模式可省去后续的授权交易及相应的gas费用，但路由合约将有权动用该代币的全部余额，请根据实际需要选择。

#### exchange.IO("slippage", ...)

```
exchange.IO(k)
exchange.IO(k, ratio)
```

Forms:

- `exchange.IO("slippage", ...)`

```exchange.IO("slippage", ...)```函数的此种调用方式用于为Uniswap交易所对象设置市价单的滑点保护。

Parameters:

- `k` (string, required): ```k```参数用于设置```exchange.IO()```函数的功能。设置为```"slippage"```时，表示该函数用于设置市价单的滑点保护。
- `ratio` (number, optional): ```ratio```参数为滑点比例，取值范围为```[0, 0.5)```，默认值为```0.005```（即0.5%）。不传入该参数时，表示查询当前的滑点比例。

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

#### exchange.IO("deadline", ...)

```
exchange.IO(k)
exchange.IO(k, seconds)
```

Forms:

- `exchange.IO("deadline", ...)`

```exchange.IO("deadline", ...)```调用方式用于在Uniswap交易所对象上设置交易的截止时间。

Parameters:

- `k` (string, required): ```k```参数用于指定```exchange.IO()```函数的功能，设置为```"deadline"```时，表示该函数用于设置交易的截止时间。
- `seconds` (number, optional): ```seconds```参数为交易有效期，单位为秒，取值范围为10至86400，默认值为120。不传入该参数时，表示查询当前设置值。

Returns (number): 返回当前设置的交易截止时间，单位为秒。

设置交易的截止时间。

```javascript
function main() {
    exchange.IO("deadline", 300)
    Log("截止时间:", exchange.IO("deadline"), "秒")
}
```

兑换交易发出后，若超过截止时间仍未上链，执行时将被回滚。这样可以避免长时间挂起的交易在价格大幅波动后才成交。

#### exchange.IO("gasMultiplier", ...)

```
exchange.IO(k)
exchange.IO(k, x)
```

Forms:

- `exchange.IO("gasMultiplier", ...)`

```exchange.IO("gasMultiplier", ...)```调用方式用于在Uniswap交易所对象上设置gas上限倍数。

Parameters:

- `k` (string, required): ```k```参数用于指定```exchange.IO()```函数的功能，设置为```"gasMultiplier"```时，表示该函数用于设置gas上限倍数。
- `x` (number, optional): ```x```参数为gas上限倍数，取值范围为1到5，默认值为1.2。交易的gasLimit等于节点估算的gas用量乘以该倍数。不传入该参数时，表示查询当前倍数。

Returns (number): 返回当前的gas上限倍数。

设置gas上限倍数。

```javascript
function main() {
    exchange.IO("gasMultiplier", 1.5)
    Log("gas倍数:", exchange.IO("gasMultiplier"))
}
```

gasLimit仅为gas用量上限，实际手续费按实际消耗的gas计算，因此适当调高倍数不会增加实际花费；但钱包余额需足以覆盖gasLimit对应的最高手续费，否则交易可能无法发送。

### TA

#### TA.MACD

```
TA.MACD(inReal)
TA.MACD(inReal, optInFastPeriod, optInSlowPeriod, optInSignalPeriod)
```

```TA.MACD()```函数用于计算**指数平滑异同移动平均线（MACD）指标**。

Parameters:

- `inReal` ({@struct/Record Record}结构数组 / 数值数组, required): ```inReal```参数用于指定K线数据。
- `optInFastPeriod` (number, optional): ```optInFastPeriod```参数用于设置快线周期。
- `optInSlowPeriod` (number, optional): ```optInSlowPeriod```参数用于设置慢线周期。
- `optInSignalPeriod` (number, optional): ```optInSignalPeriod```参数用于设置信号线周期。

Returns (array): ```TA.MACD()```函数的返回值为二维数组，其结构为：```[DIF, DEA, MACD]```。

```javascript
function main(){
    // 可以填入不同k线周期，比如PERIOD_M1,PERIOD_M30,PERIOD_H1......
    var records = exchange.GetRecords(PERIOD_M15)
    var macd = TA.MACD(records, 12, 26, 9)
    // 观看日志可得知返回三个数组，分别对应DIF，DEA，MACD
    Log("DIF:", macd[0], "DEA:", macd[1], "MACD:", macd[2])
}
```

```python
def main():
    r = exchange.GetRecords(PERIOD_M15)
    macd = TA.MACD(r, 12, 26, 9)
    Log("DIF:", macd[0], "DEA:", macd[1], "MACD:", macd[2])
```

```rust
fn main() {
    // 可以填入不同k线周期，比如PERIOD_M1,PERIOD_M30,PERIOD_H1......
    let records = exchange.GetRecords(None, PERIOD_M15, None).unwrap();
    let macd = TA.MACD(&records, 12, 26, 9);
    // 观看日志可得知返回三个数组，分别对应DIF，DEA，MACD
    Log!("DIF:", macd[0], "DEA:", macd[1], "MACD:", macd[2]);
}
```

发明者量化的```TA```指标库对常用指标算法进行了优化，支持```JavaScript```、```Python```、```Rust```语言策略的调用，详见[开源TA库代码](https://www.fmz.com/bbs-topic/409)。

```TA.MACD()```函数的```optInFastPeriod```、```optInSlowPeriod```、```optInSignalPeriod```参数默认值分别为：```12```、```26```、```9```。

See also: `TA.KDJ`, `TA.RSI`, `TA.ATR`, `TA.OBV`,  `TA.MA`, `TA.EMA`, `TA.BOLL`, `TA.Alligator`, `TA.CMF`, `TA.Highest`, `TA.Lowest`

#### TA.KDJ

```
TA.KDJ(inReal)
TA.KDJ(inReal, period, kPeriod, dPeriod)
```

```TA.KDJ()```函数用于计算**随机指标（KDJ）**。

Parameters:

- `inReal` ({@struct/Record Record}结构数组 / 数值数组, required): ```inReal```参数用于传入 K 线数据。
- `period` (number, optional): ```period```参数用于设置计算周期 1。
- `kPeriod` (number, optional): ```kPeriod```参数用于设置计算周期 2。
- `dPeriod` (number, optional): ```dPeriod```参数用于设置计算周期 3。

Returns (array): ```TA.KDJ()```函数的返回值为二维数组，其结构为：```[K, D, J]```。

```javascript
function main(){
    var records = exchange.GetRecords(PERIOD_M15)
    var kdj = TA.KDJ(records, 9, 3, 3)
    Log("k:", kdj[0], "d:", kdj[1], "j:", kdj[2])
}
```

```python
def main():
    r = exchange.GetRecords(PERIOD_M15)
    kdj = TA.KDJ(r, 9, 3, 3)
    Log("k:", kdj[0], "d:", kdj[1], "j:", kdj[2])
```

```rust
fn main() {
    let records = exchange.GetRecords(None, PERIOD_M15, None).unwrap();
    let kdj = TA.KDJ(&records, 9, 3, 3);
    Log!("k:", kdj[0], "d:", kdj[1], "j:", kdj[2]);
}
```

```TA.KDJ()```函数的```period```、```kPeriod```、```dPeriod```参数的默认值分别为：```9```、```3```、```3```。

See also: `TA.MACD`, `TA.RSI`, `TA.ATR`, `TA.OBV`,  `TA.MA`, `TA.EMA`, `TA.BOLL`, `TA.Alligator`, `TA.CMF`, `TA.Highest`, `TA.Lowest`

#### TA.RSI

```
TA.RSI(inReal)
TA.RSI(inReal, optInTimePeriod)
```

```TA.RSI()```函数用于计算**相对强弱指标（RSI）**。

Parameters:

- `inReal` ({@struct/Record Record}结构数组 / 数值数组, required): ```inReal```参数用于指定K线数据。
- `optInTimePeriod` (number, optional): ```optInTimePeriod```参数用于设置计算周期。

Returns (array): ```TA.RSI()```函数的返回值为一维数组。

```javascript
function main(){
    var records = exchange.GetRecords(PERIOD_M30)
    var rsi = TA.RSI(records, 14)
    Log(rsi)
}
```

```python
def main():
    r = exchange.GetRecords(PERIOD_M30)
    rsi = TA.RSI(r, 14)
    Log(rsi)
```

```rust
fn main() {
    let records = exchange.GetRecords(None, PERIOD_M30, None).unwrap();
    let rsi = TA.RSI(&records, 14);
    Log!(rsi);
}
```

```TA.RSI()```函数的```optInTimePeriod```参数的默认值为：```14```。

See also: `TA.MACD`, `TA.KDJ`, `TA.ATR`, `TA.OBV`,  `TA.MA`, `TA.EMA`, `TA.BOLL`, `TA.Alligator`, `TA.CMF`, `TA.Highest`, `TA.Lowest`

#### TA.ATR

```
TA.ATR(inPriceHLC)
TA.ATR(inPriceHLC, optInTimePeriod)
```

```TA.ATR()```函数用于计算**平均真实波幅指标（ATR）**。

Parameters:

- `inPriceHLC` ({@struct/Record Record}结构数组, required): ```inPriceHLC```参数用于指定K线数据。
- `optInTimePeriod` (number, optional): ```optInTimePeriod```参数用于设置计算周期。

Returns (array): ```TA.ATR()```函数的返回值为一维数组。

```javascript
function main(){
    var records = exchange.GetRecords(PERIOD_M30)
    var atr = TA.ATR(records, 14)
    Log(atr)
}
```

```python
def main():
    r = exchange.GetRecords(PERIOD_M30)
    atr = TA.ATR(r, 14)
    Log(atr)
```

```rust
fn main() {
    let records = exchange.GetRecords(None, PERIOD_M30, None).unwrap();
    let atr = TA.ATR(&records, 14);
    Log!(atr);
}
```

```TA.ATR()```函数的```optInTimePeriod```参数默认值为：```14```。

See also: `TA.MACD`, `TA.KDJ`, `TA.RSI`, `TA.OBV`,  `TA.MA`, `TA.EMA`, `TA.BOLL`, `TA.Alligator`, `TA.CMF`, `TA.Highest`, `TA.Lowest`

#### TA.OBV

```
TA.OBV(inReal)
```

```TA.OBV()```函数用于计算**能量潮指标（OBV）**。

Parameters:

- `inReal` ({@struct/Record Record}结构数组, required): ```inReal```参数用于指定K线数据（计算时使用K线数据中的收盘价与成交量）。

Returns (array): ```TA.OBV()```函数的返回值为一维数组。

```javascript
function main(){
    var records = exchange.GetRecords(PERIOD_M30)
    var obv = TA.OBV(records)
    Log(obv)
}
```

```python
def main():
    r = exchange.GetRecords(PERIOD_M30)
    obv = TA.OBV(r)
    Log(obv)
```

```rust
fn main() {
    let records = exchange.GetRecords(None, PERIOD_M30, None).unwrap();
    let obv = TA.OBV(&records);
    Log!(obv);
}
```

See also: `TA.MACD`, `TA.KDJ`, `TA.RSI`, `TA.ATR`,  `TA.MA`, `TA.EMA`, `TA.BOLL`, `TA.Alligator`, `TA.CMF`, `TA.Highest`, `TA.Lowest`

#### TA.MA

```
TA.MA(inReal)
TA.MA(inReal, optInTimePeriod)
```

```TA.MA()```函数用于计算**移动平均线指标（Moving Average）**。

Parameters:

- `inReal` ({@struct/Record Record}结构数组 / 数值数组, required): ```inReal```参数用于指定K线数据。
- `optInTimePeriod` (number, optional): ```optInTimePeriod```参数用于设置计算周期。

Returns (array): ```TA.MA()```函数的返回值为一维数组。

```javascript
function main(){
    var records = exchange.GetRecords(PERIOD_M30)
    var ma = TA.MA(records, 14)
    Log(ma)
}
```

```python
def main():
    r = exchange.GetRecords(PERIOD_M30)
    ma = TA.MA(r, 14)
    Log(ma)
```

```rust
fn main() {
    let records = exchange.GetRecords(None, PERIOD_M30, None).unwrap();
    let ma = TA.MA(&records, 14);
    Log!(ma);
}
```

```TA.MA()```函数的```optInTimePeriod```参数的默认值为：```9```。

See also: `TA.MACD`, `TA.KDJ`, `TA.RSI`, `TA.ATR`, `TA.OBV`,  `TA.EMA`, `TA.BOLL`, `TA.Alligator`, `TA.CMF`, `TA.Highest`, `TA.Lowest`

#### TA.EMA

```
TA.EMA(inReal)
TA.EMA(inReal, optInTimePeriod)
```

```TA.EMA()```函数用于计算**指数移动平均线（EMA）指标**。

Parameters:

- `inReal` ({@struct/Record Record}结构数组 / 数值数组, required): ```inReal```参数用于传入K线数据。
- `optInTimePeriod` (number, optional): ```optInTimePeriod```参数用于设置计算周期。

Returns (array): ```TA.EMA()```函数的返回值为：一维数组。

```javascript
function main(){
    var records = exchange.GetRecords()
    // 判断K线Bar数量是否满足指标计算所需的周期
    if (records && records.length > 9) {
        var ema = TA.EMA(records, 9)
        Log(ema)
    }
}
```

```python
def main():
    r = exchange.GetRecords()
    if r and len(r) > 9:
        ema = TA.EMA(r, 9)
        Log(ema)
```

```rust
fn main() {
    let records = exchange.GetRecords(None, None, None).unwrap();
    // 判断K线Bar数量是否满足指标计算所需的周期
    if records.len() > 9 {
        let ema = TA.EMA(&records, 9);
        Log!(ema);
    }
}
```

```TA.EMA()```函数的```optInTimePeriod```参数的默认值为：```9```。

See also: `TA.MACD`, `TA.KDJ`, `TA.RSI`, `TA.ATR`, `TA.OBV`,  `TA.MA`, `TA.BOLL`, `TA.Alligator`, `TA.CMF`, `TA.Highest`, `TA.Lowest`

#### TA.BOLL

```
TA.BOLL(inReal)
TA.BOLL(inReal, period, multiplier)
```

```TA.BOLL()```函数用于计算**布林带指标**。

Parameters:

- `inReal` ({@struct/Record Record}结构数组 / 数值数组, required): ```inReal```参数用于指定K线数据。
- `period` (number, optional): ```period```参数用于设置计算周期。
- `multiplier` (number, optional): ```multiplier```参数用于设置乘数（标准差倍数）。

Returns (array): ```TA.BOLL()```函数的返回值为二维数组，其结构为```[upLine, midLine, downLine]```。

```javascript
function main() {
    var records = exchange.GetRecords()
    if(records && records.length > 20) {
        var boll = TA.BOLL(records, 20, 2)
        var upLine = boll[0]
        var midLine = boll[1]
        var downLine = boll[2]
        Log(upLine)
        Log(midLine)
        Log(downLine)
    }
}
```

```python
def main():
    r = exchange.GetRecords()
    if r and len(r) > 20:
        boll = TA.BOLL(r, 20, 2)
        upLine = boll[0]
        midLine = boll[1]
        downLine = boll[2]
        Log(upLine)
        Log(midLine)
        Log(downLine)
```

```rust
fn main() {
    let records = exchange.GetRecords(None, None, None).unwrap();
    if records.len() > 20 {
        let boll = TA.BOLL(&records, 20, 2.0);
        let [upLine, midLine, downLine] = boll;
        Log!(upLine);
        Log!(midLine);
        Log!(downLine);
    }
}
```

```TA.BOLL()```函数的```period```、```multiplier```参数的默认值分别为```20```和```2```。

See also: `TA.MACD`, `TA.KDJ`, `TA.RSI`, `TA.ATR`, `TA.OBV`,  `TA.MA`, `TA.EMA`, `TA.Alligator`, `TA.CMF`, `TA.Highest`, `TA.Lowest`

#### TA.Alligator

```
TA.Alligator(inReal)
TA.Alligator(inReal, jawLength, teethLength, lipsLength)
```

```TA.Alligator()```函数用于计算**鳄鱼线指标（Alligator）**。

Parameters:

- `inReal` ({@struct/Record Record}结构数组 / 数值数组, required): ```inReal```参数用于指定K线数据。
- `jawLength` (number, optional): ```jawLength```参数用于设置下颚线（Jaw）的周期。
- `teethLength` (number, optional): ```teethLength```参数用于设置牙齿线（Teeth）的周期。
- `lipsLength` (number, optional): ```lipsLength```参数用于设置上唇线（Lips）的周期。

Returns (array): ```TA.Alligator()```函数的返回值为二维数组，其结构为：```[jawLine, teethLine, lipsLine]```。

```javascript
function main(){
    var records = exchange.GetRecords()
    var alligator = TA.Alligator(records)
    Log("jawLine:", alligator[0])
    Log("teethLine:", alligator[1])
    Log("lipsLine:", alligator[2])
}
```

```python
def main():
    records = exchange.GetRecords()
    alligator = TA.Alligator(records)
    Log("jawLine:", alligator[0])
    Log("teethLine:", alligator[1])
    Log("lipsLine:", alligator[2])
```

```rust
fn main() {
    let records = exchange.GetRecords(None, None, None).unwrap();
    let alligator = TA.Alligator(&records, None, None, None);
    Log!("jawLine:", alligator[0]);
    Log!("teethLine:", alligator[1]);
    Log!("lipsLine:", alligator[2]);
}
```

```TA.Alligator()```函数的```jawLength```、```teethLength```、```lipsLength```参数默认值分别为：```13```、```8```、```5```。

See also: `TA.MACD`, `TA.KDJ`, `TA.RSI`, `TA.ATR`, `TA.OBV`,  `TA.MA`, `TA.EMA`, `TA.BOLL`, `TA.CMF`, `TA.Highest`, `TA.Lowest`

#### TA.CMF

```
TA.CMF(inReal)
TA.CMF(inReal, periods)
```

```TA.CMF()```函数用于计算**蔡金资金流量指标（Chaikin Money Flow）**。

Parameters:

- `inReal` ({@struct/Record Record}结构数组, required): ```inReal```参数用于指定K线数据（计算时使用K线数据中的最高价、最低价、收盘价与成交量）。
- `periods` (number, optional): ```periods```参数用于指定计算周期，默认值为20。

Returns (array): ```TA.CMF()```函数的返回值为一维数组。

```javascript
function main() {
    var records = exchange.GetRecords()
    var cmf = TA.CMF(records)
    Log(cmf)
}
```

```python
def main():
    records = exchange.GetRecords()
    cmf = TA.CMF(records)
    Log(cmf)
```

```rust
fn main() {
    let records = exchange.GetRecords(None, None, None).unwrap();
    let cmf = TA.CMF(&records, None);
    Log!(cmf);
}
```

See also: `TA.MACD`, `TA.KDJ`, `TA.RSI`, `TA.ATR`, `TA.OBV`,  `TA.MA`, `TA.EMA`, `TA.BOLL`, `TA.Alligator`, `TA.Highest`, `TA.Lowest`

#### TA.Highest

```
TA.Highest(inReal)
TA.Highest(inReal, period, attr)
```

```TA.Highest()```函数用于计算**周期内最高价**。

Parameters:

- `inReal` ({@struct/Record Record}结构数组 / 数值数组, required): ```inReal```参数用于指定K线数据。
- `period` (number, optional): ```period```参数用于设置计算周期。
- `attr` (string, optional): ```attr```参数用于指定属性，可选值：```Open```、```Close```、```Low```、```High```、```Volume```、```OpenInterest```。

Returns (number): ```TA.Highest()```函数返回最近指定周期内某个属性的最大值，不包含当前Bar。

```javascript
function main() {
    var records = exchange.GetRecords()
    var highestForOpen = TA.Highest(records, 10, "Open")
    Log(highestForOpen)
}
```

```python
def main():
    records = exchange.GetRecords()
    highestForOpen = TA.Highest(records, 10, "Open")
    Log(highestForOpen)
```

```rust
fn main() {
    let records = exchange.GetRecords(None, None, None).unwrap();
    // Rust 的 TA.Highest 无属性名参数，先提取开盘价数值序列再计算（不包含当前Bar）
    let opens: Vec<f64> = records.iter().map(|r| r.Open).collect();
    let highestForOpen = TA.Highest(&opens, 10);
    Log!(highestForOpen);
}
```

例如调用```TA.Highest(records, 30, "High")```函数时，如果周期参数```period```设置为```0```，表示计算```inReal```参数传入的K线数据中的所有```Bar```；如果不指定属性参数```attr```，则将```inReal```参数传入的数据视为普通数组处理。

See also: `TA.MACD`, `TA.KDJ`, `TA.RSI`, `TA.ATR`, `TA.OBV`,  `TA.MA`, `TA.EMA`, `TA.BOLL`, `TA.Alligator`, `TA.CMF`, `TA.Lowest`

#### TA.Lowest

```
TA.Lowest(inReal)
TA.Lowest(inReal, period, attr)
```

```TA.Lowest()```函数用于计算**周期最低价**。

Parameters:

- `inReal` ({@struct/Record Record}结构数组 / 数值数组, required): ```inReal```参数用于指定K线数据。
- `period` (number, optional): ```period```参数用于设置计算周期。
- `attr` (string, optional): ```attr```参数用于设置属性，可选值：```Open```、```Close```、```Low```、```High```、```Volume```、```OpenInterest```。

Returns (number): ```TA.Lowest()```函数返回最近一定周期内某个属性的最小值，不包含当前Bar。

```javascript
function main() {
    var records = exchange.GetRecords()
    var lowestForOpen = TA.Lowest(records, 10, "Open")
    Log(lowestForOpen)
}
```

```python
def main():
    records = exchange.GetRecords()
    lowestForOpen = TA.Lowest(records, 10, "Open")
    Log(lowestForOpen)
```

```rust
fn main() {
    let records = exchange.GetRecords(None, None, None).unwrap();
    // Rust 的 TA.Lowest 无属性名参数，先提取开盘价数值序列再计算（不包含当前Bar）
    let opens: Vec<f64> = records.iter().map(|r| r.Open).collect();
    let lowestForOpen = TA.Lowest(&opens, 10);
    Log!(lowestForOpen);
}
```

例如调用```TA.Lowest(records, 30, "Low")```函数：如果周期参数```period```设置为```0```，则表示计算```inReal```参数传入的K线数据的所有```Bar```；如果不指定属性参数```attr```，则视```inReal```参数传入的K线数据为普通数组。

See also: `TA.MACD`, `TA.KDJ`, `TA.RSI`, `TA.ATR`, `TA.OBV`,  `TA.MA`, `TA.EMA`, `TA.BOLL`, `TA.Alligator`, `TA.CMF`, `TA.Highest`

#### TA.SMA

```
TA.SMA(inReal)
TA.SMA(inReal, optInTimePeriod)
```

```TA.SMA()```函数用于计算**简单移动平均线（SMA）指标**。

Parameters:

- `inReal` ({@struct/Record Record}结构数组 / 数值数组, required): ```inReal```参数用于传入K线数据。
- `optInTimePeriod` (number, optional): ```optInTimePeriod```参数用于设置计算周期。

Returns (array): ```TA.SMA()```函数的返回值为：一维数组。

```javascript
function main(){
    var records = exchange.GetRecords(PERIOD_M30)
    var sma = TA.SMA(records, 14)
    Log(sma)
}
```

```python
def main():
    r = exchange.GetRecords(PERIOD_M30)
    sma = TA.SMA(r, 14)
    Log(sma)
```

```rust
fn main() {
    let records = exchange.GetRecords(None, PERIOD_M30, None).unwrap();
    let sma = TA.SMA(&records, 14);
    Log!(sma);
}
```

```TA.SMA()```函数的```optInTimePeriod```参数默认值为：```9```。

See also: `TA.MACD`, `TA.KDJ`, `TA.RSI`, `TA.ATR`, `TA.OBV`,  `TA.MA`, `TA.EMA`, `TA.BOLL`, `TA.Alligator`, `TA.CMF`, `TA.Highest`, `TA.Lowest`

### Talib

#### OverlapStudies

均线与通道类指标（重叠研究）：移动平均、布林带、抛物线SAR等。

##### talib.BBANDS

```
talib.BBANDS(inReal)
talib.BBANDS(inReal, optInTimePeriod)
talib.BBANDS(inReal, optInTimePeriod, optInNbDevUp)
talib.BBANDS(inReal, optInTimePeriod, optInNbDevUp, optInNbDevDn)
talib.BBANDS(inReal, optInTimePeriod, optInNbDevUp, optInNbDevDn, optInMAType)
```

```talib.BBANDS()```函数用于计算**Bollinger Bands（布林带）**。

Parameters:

- `inReal` ({@struct/Record Record}结构数组 / 数值数组, required): ```inReal```参数用于指定K线数据。
- `optInTimePeriod` (number, optional): ```optInTimePeriod```参数用于设置计算周期，默认值为5。
- `optInNbDevUp` (number, optional): ```optInNbDevUp```参数用于设置上轨标准差倍数，默认值为2。
- `optInNbDevDn` (number, optional): ```optInNbDevDn```参数用于设置下轨标准差倍数，默认值为2。
- `optInMAType` (number, optional): ```optInMAType```参数用于设置移动平均线类型，默认值为0。

Returns (array): ```talib.BBANDS()```函数返回一个二维数组，该数组包含三个元素，分别为：上轨数组、中轨数组、下轨数组。

```javascript
function main() {
    var records = exchange.GetRecords()
    var ret = talib.BBANDS(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    ret = talib.BBANDS(records.Close)
    Log(ret)
```

```BBANDS()```函数在talib库文档中的描述为：```BBANDS(Records[Close],Time Period = 5,Deviations up = 2,Deviations down = 2,MA Type = 0) = [Array(outRealUpperBand),Array(outRealMiddleBand),Array(outRealLowerBand)]```

##### talib.DEMA

```
talib.DEMA(inReal)
talib.DEMA(inReal, optInTimePeriod)
```

```talib.DEMA()```函数用于计算**Double Exponential Moving Average（双指数移动平均线）**。

Parameters:

- `inReal` ({@struct/Record Record}结构数组 / 数值数组, required): ```inReal```参数用于指定K线数据。
- `optInTimePeriod` (number, optional): ```optInTimePeriod```参数用于设置计算周期，默认值为30。

Returns (array): ```talib.DEMA()```函数返回一维数组。

```javascript
function main() {
    var records = exchange.GetRecords()
    var ret = talib.DEMA(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    ret = talib.DEMA(records.Close)
    Log(ret)
```

```DEMA()```函数在talib库文档中的描述为：```DEMA(Records[Close],Time Period = 30) = Array(outReal)```

##### talib.EMA

```
talib.EMA(inReal)
talib.EMA(inReal, optInTimePeriod)
```

```talib.EMA()```函数用于计算**Exponential Moving Average（指数移动平均线）**。

Parameters:

- `inReal` ({@struct/Record Record}结构数组 / 数值数组, required): ```inReal```参数用于指定K线数据。
- `optInTimePeriod` (number, optional): ```optInTimePeriod```参数用于设置计算周期，默认值为30。

Returns (array): ```talib.EMA()```函数返回一维数组。

```javascript
function main() {
    var records = exchange.GetRecords()
    var ret = talib.EMA(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    ret = talib.EMA(records.Close)
    Log(ret)
```

```EMA()```函数在talib库文档中的描述为：```EMA(Records[Close],Time Period = 30) = Array(outReal)```

##### talib.HT_TRENDLINE

```
talib.HT_TRENDLINE(inReal)
```

```talib.HT_TRENDLINE()```函数用于计算**Hilbert Transform - Instantaneous Trendline（希尔伯特变换瞬时趋势线）**。

Parameters:

- `inReal` ({@struct/Record Record}结构数组 / 数值数组, required): ```inReal```参数用于指定K线数据。

Returns (array): ```talib.HT_TRENDLINE()```函数返回一维数组。

```javascript
function main() {
    var records = exchange.GetRecords()
    var ret = talib.HT_TRENDLINE(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    ret = talib.HT_TRENDLINE(records.Close)
    Log(ret)
```

```HT_TRENDLINE()```函数在talib库文档中的描述为：```HT_TRENDLINE(Records[Close]) = Array(outReal)```

##### talib.KAMA

```
talib.KAMA(inReal)
talib.KAMA(inReal, optInTimePeriod)
```

```talib.KAMA()```函数用于计算**Kaufman自适应移动平均线（Kaufman Adaptive Moving Average）**。

Parameters:

- `inReal` ({@struct/Record Record}结构数组 / 数值数组, required): ```inReal```参数用于指定K线数据。
- `optInTimePeriod` (number, optional): ```optInTimePeriod```参数用于设置计算周期，默认值为30。

Returns (array): ```talib.KAMA()```函数返回一维数组。

```javascript
function main() {
    var records = exchange.GetRecords()
    var ret = talib.KAMA(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    ret = talib.KAMA(records.Close)
    Log(ret)
```

```KAMA()```函数在talib库文档中的描述为：```KAMA(Records[Close],Time Period = 30) = Array(outReal)```

##### talib.MA

```
talib.MA(inReal)
talib.MA(inReal, optInTimePeriod)
talib.MA(inReal, optInTimePeriod, optInMAType)
```

```talib.MA()```函数用于计算**Moving average（移动平均线）**。

Parameters:

- `inReal` ({@struct/Record Record}结构数组 / 数值数组, required): ```inReal```参数用于指定K线数据。
- `optInTimePeriod` (number, optional): ```optInTimePeriod```参数用于设置计算周期，默认值为30。
- `optInMAType` (number, optional): ```optInMAType```参数用于设置移动平均线类型，默认值为0。

Returns (array): ```talib.MA()```函数返回一维数组。

```javascript
function main() {
    var records = exchange.GetRecords()
    var ret = talib.MA(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    ret = talib.MA(records.Close)
    Log(ret)
```

```MA()```函数在talib库文档中的描述为：```MA(Records[Close],Time Period = 30,MA Type = 0) = Array(outReal)```

##### talib.MAMA

```
talib.MAMA(inReal)
talib.MAMA(inReal, optInFastLimit)
talib.MAMA(inReal, optInFastLimit, optInSlowLimit)
```

```talib.MAMA()```函数用于计算**MESA自适应移动平均线（MESA Adaptive Moving Average）**。

Parameters:

- `inReal` ({@struct/Record Record}结构数组 / 数值数组, required): ```inReal```参数用于指定K线数据。
- `optInFastLimit` (number, optional): ```optInFastLimit```参数用于设置快速限制值，默认值为0.5。
- `optInSlowLimit` (number, optional): ```optInSlowLimit```参数用于设置慢速限制值，默认值为0.05。

Returns (array): ```talib.MAMA()```函数返回二维数组。

```javascript
function main() {
    var records = exchange.GetRecords()
    var ret = talib.MAMA(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    ret = talib.MAMA(records.Close)
    Log(ret)
```

```MAMA()```函数在talib库文档中的描述为：```MAMA(Records[Close],Fast Limit = 0.5,Slow Limit = 0.05) = [Array(outMAMA),Array(outFAMA)]```

##### talib.MIDPOINT

```
talib.MIDPOINT(inReal)
talib.MIDPOINT(inReal, optInTimePeriod)
```

```talib.MIDPOINT()```函数用于计算**MidPoint over period（中点价格）**。

Parameters:

- `inReal` ({@struct/Record Record}结构数组 / 数值数组, required): ```inReal```参数用于指定K线数据。
- `optInTimePeriod` (number, optional): ```optInTimePeriod```参数用于设置计算周期，默认值为14。

Returns (array): ```talib.MIDPOINT()```函数返回一维数组。

```javascript
function main() {
    var records = exchange.GetRecords()
    var ret = talib.MIDPOINT(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    ret = talib.MIDPOINT(records.Close)
    Log(ret)
```

```MIDPOINT()```函数在talib库文档中的描述为：```MIDPOINT(Records[Close],Time Period = 14) = Array(outReal)```

##### talib.MIDPRICE

```
talib.MIDPRICE(inPriceHL)
talib.MIDPRICE(inPriceHL, optInTimePeriod)
```

```talib.MIDPRICE()```函数用于计算**Midpoint Price over period（中点价格）**。

Parameters:

- `inPriceHL` ({@struct/Record Record}结构数组, required): ```inPriceHL```参数用于指定K线数据。
- `optInTimePeriod` (number, optional): ```optInTimePeriod```参数用于设置时间周期，默认值为14。

Returns (array): ```talib.MIDPRICE()```函数返回一维数组。

```javascript
function main() {
    var records = exchange.GetRecords()
    var ret = talib.MIDPRICE(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    ret = talib.MIDPRICE(records.High, records.Low)
    Log(ret)
```

```MIDPRICE()```函数在talib库文档中的描述为：```MIDPRICE(Records[High,Low],Time Period = 14) = Array(outReal)```

##### talib.SAR

```
talib.SAR(inPriceHL)
talib.SAR(inPriceHL, optInAcceleration)
talib.SAR(inPriceHL, optInAcceleration, optInMaximum)
```

```talib.SAR()```函数用于计算**抛物线转向指标（Parabolic SAR）**。

Parameters:

- `inPriceHL` ({@struct/Record Record}结构数组, required): ```inPriceHL```参数用于指定K线数据。
- `optInAcceleration` (number, optional): ```optInAcceleration```参数用于设置加速因子（Acceleration Factor），默认值为0.02。
- `optInMaximum` (number, optional): ```optInMaximum```参数用于设置加速因子最大值（AF Maximum），默认值为0.2。

Returns (array): ```talib.SAR()```函数返回一维数组。

```javascript
function main() {
    var records = exchange.GetRecords()
    var ret = talib.SAR(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    ret = talib.SAR(records.High, records.Low)
    Log(ret)
```

```SAR()```函数在talib库文档中的描述为：```SAR(Records[High,Low],Acceleration Factor = 0.02,AF Maximum = 0.2) = Array(outReal)```

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

```talib.SAREXT()```函数用于计算**Parabolic SAR - Extended（增强型抛物线转向指标）**。

Parameters:

- `inPriceHL` ({@struct/Record Record}结构数组, required): ```inPriceHL```参数用于指定K线数据。
- `optInStartValue` (number, optional): ```optInStartValue```参数用于设置起始值（Start Value），默认值为0。
- `optInOffsetOnReverse` (number, optional): ```optInOffsetOnReverse```参数用于设置反转偏移量（Offset on Reverse），默认值为0。
- `optInAccelerationInitLong` (number, optional): ```optInAccelerationInitLong```参数用于设置多头初始加速因子（AF Init Long），默认值为0.02。
- `optInAccelerationLong` (number, optional): ```optInAccelerationLong```参数用于设置多头加速因子（AF Long），默认值为0.02。
- `optInAccelerationMaxLong` (number, optional): ```optInAccelerationMaxLong```参数用于设置多头最大加速因子（AF Max Long），默认值为0.2。
- `optInAccelerationInitShort` (number, optional): ```optInAccelerationInitShort```参数用于设置空头初始加速因子（AF Init Short），默认值为0.02。
- `optInAccelerationShort` (number, optional): ```optInAccelerationShort```参数用于设置空头加速因子（AF Short），默认值为0.02。
- `optInAccelerationMaxShort` (number, optional): ```optInAccelerationMaxShort```参数用于设置空头最大加速因子（AF Max Short），默认值为0.2。

Returns (array): ```talib.SAREXT()```函数返回一维数组。

```javascript
function main() {
    var records = exchange.GetRecords()
    var ret = talib.SAREXT(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    ret = talib.SAREXT(records.High, records.Low)
    Log(ret)
```

```SAREXT()```函数在talib库文档中的描述为：```SAREXT(Records[High,Low],Start Value = 0,Offset on Reverse = 0,AF Init Long = 0.02,AF Long = 0.02,AF Max Long = 0.2,AF Init Short = 0.02,AF Short = 0.02,AF Max Short = 0.2) = Array(outReal)```

##### talib.SMA

```
talib.SMA(inReal)
talib.SMA(inReal, optInTimePeriod)
```

```talib.SMA()```函数用于计算**Simple Moving Average（简单移动平均线）**。

Parameters:

- `inReal` ({@struct/Record Record}结构数组 / 数值数组, required): ```inReal```参数用于指定K线数据。
- `optInTimePeriod` (number, optional): ```optInTimePeriod```参数用于设置计算周期，默认值为30。

Returns (array): ```talib.SMA()```函数返回一维数组。

```javascript
function main() {
    var records = exchange.GetRecords()
    var ret = talib.SMA(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    ret = talib.SMA(records.Close)
    Log(ret)
```

```SMA()```函数在talib库文档中的描述为：```SMA(Records[Close],Time Period = 30) = Array(outReal)```

##### talib.T3

```
talib.T3(inReal)
talib.T3(inReal, optInTimePeriod)
talib.T3(inReal, optInTimePeriod, optInVFactor)
```

```talib.T3()```函数用于计算**Triple Exponential Moving Average (T3) (三重指数移动平均)**。

Parameters:

- `inReal` ({@struct/Record Record}结构数组 / 数值数组, required): ```inReal```参数用于指定K线数据。
- `optInTimePeriod` (number, optional): ```optInTimePeriod```参数用于设置计算周期，默认值为5。
- `optInVFactor` (number, optional): ```optInVFactor```参数用于设置成交量因子，默认值为0.7。

Returns (array): ```talib.T3()```函数返回一维数组。

```javascript
function main() {
    var records = exchange.GetRecords()
    var ret = talib.T3(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    ret = talib.T3(records.Close)
    Log(ret)
```

```T3()```函数在talib库文档中的描述为：```T3(Records[Close],Time Period = 5,Volume Factor = 0.7) = Array(outReal)```

##### talib.TEMA

```
talib.TEMA(inReal)
talib.TEMA(inReal, optInTimePeriod)
```

```talib.TEMA()```函数用于计算**Triple Exponential Moving Average（三重指数移动平均线）**。

Parameters:

- `inReal` ({@struct/Record Record}结构数组 / 数值数组, required): ```inReal```参数用于指定K线数据。
- `optInTimePeriod` (number, optional): ```optInTimePeriod```参数用于设置计算周期，默认值为30。

Returns (array): ```talib.TEMA()```函数返回一维数组。

```javascript
function main() {
    var records = exchange.GetRecords()
    var ret = talib.TEMA(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    ret = talib.TEMA(records.Close)
    Log(ret)
```

```TEMA()```函数在talib库文档中的描述为：```TEMA(Records[Close],Time Period = 30) = Array(outReal)```

##### talib.TRIMA

```
talib.TRIMA(inReal)
talib.TRIMA(inReal, optInTimePeriod)
```

```talib.TRIMA()```函数用于计算**Triangular Moving Average（三角移动平均线）**。

Parameters:

- `inReal` ({@struct/Record Record}结构数组 / 数值数组, required): ```inReal```参数用于指定K线数据。
- `optInTimePeriod` (number, optional): ```optInTimePeriod```参数用于设置计算周期，默认值为30。

Returns (array): ```talib.TRIMA()```函数返回一维数组。

```javascript
function main() {
    var records = exchange.GetRecords()
    var ret = talib.TRIMA(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    ret = talib.TRIMA(records.Close)
    Log(ret)
```

```TRIMA()```函数在talib库文档中的描述为：```TRIMA(Records[Close],Time Period = 30) = Array(outReal)```

##### talib.WMA

```
talib.WMA(inReal)
talib.WMA(inReal, optInTimePeriod)
```

```talib.WMA()```函数用于计算**Weighted Moving Average（加权移动平均）**。

Parameters:

- `inReal` ({@struct/Record Record}结构数组 / 数值数组, required): ```inReal```参数用于指定K线数据。
- `optInTimePeriod` (number, optional): ```optInTimePeriod```参数用于设置计算周期，默认值为30。

Returns (array): ```talib.WMA()```函数返回一维数组。

```javascript
function main() {
    var records = exchange.GetRecords()
    var ret = talib.WMA(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    ret = talib.WMA(records.Close)
    Log(ret)
```

```WMA()```函数在talib库文档中的描述为：```WMA(Records[Close],Time Period = 30) = Array(outReal)```

#### MomentumIndicators

动量类指标：MACD、RSI、随机指标（STOCH）、ADX、CCI等。

##### talib.ADX

```
talib.ADX(inPriceHLC)
talib.ADX(inPriceHLC, optInTimePeriod)
```

```talib.ADX()```函数用于计算**Average Directional Movement Index（平均趋向指数）**。

Parameters:

- `inPriceHLC` ({@struct/Record Record}结构数组, required): ```inPriceHLC```参数用于指定K线数据。
- `optInTimePeriod` (number, optional): ```optInTimePeriod```参数用于设置计算周期，默认值为14。

Returns (array): ```talib.ADX()```函数返回一维数组。

```javascript
function main() {
    var records = exchange.GetRecords()
    var ret = talib.ADX(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    ret = talib.ADX(records.High, records.Low, records.Close)
    Log(ret)
```

```ADX()```函数在talib库文档中的描述为：```ADX(Records[High,Low,Close],Time Period = 14) = Array(outReal)```

##### talib.ADXR

```
talib.ADXR(inPriceHLC)
talib.ADXR(inPriceHLC, optInTimePeriod)
```

```talib.ADXR()```函数用于计算**平均趋向指数评级（Average Directional Movement Index Rating）**。

Parameters:

- `inPriceHLC` ({@struct/Record Record}结构数组, required): ```inPriceHLC```参数用于指定K线数据。
- `optInTimePeriod` (number, optional): ```optInTimePeriod```参数用于设置计算周期，默认值为14。

Returns (array): ```talib.ADXR()```函数返回一维数组。

```javascript
function main() {
    var records = exchange.GetRecords()
    var ret = talib.ADXR(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    ret = talib.ADXR(records.High, records.Low, records.Close)
    Log(ret)
```

```ADXR()```函数在talib库文档中的描述为：```ADXR(Records[High,Low,Close],Time Period = 14) = Array(outReal)```

##### talib.APO

```
talib.APO(inReal)
talib.APO(inReal, optInFastPeriod)
talib.APO(inReal, optInFastPeriod, optInSlowPeriod)
talib.APO(inReal, optInFastPeriod, optInSlowPeriod, optInMAType)
```

```talib.APO()```函数用于计算**Absolute Price Oscillator（绝对价格振荡器）**。

Parameters:

- `inReal` ({@struct/Record Record}结构数组 / 数值数组, required): ```inReal```参数用于指定K线数据。
- `optInFastPeriod` (number, optional): ```optInFastPeriod```参数用于设置快速周期，默认值为12。
- `optInSlowPeriod` (number, optional): ```optInSlowPeriod```参数用于设置慢速周期，默认值为26。
- `optInMAType` (number, optional): ```optInMAType```参数用于设置移动平均线类型，默认值为0。

Returns (array): ```talib.APO()```函数返回一维数组。

```javascript
function main() {
    var records = exchange.GetRecords()
    var ret = talib.APO(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    ret = talib.APO(records.Close)
    Log(ret)
```

```APO()```函数在talib库文档中的描述为：```APO(Records[Close],Fast Period = 12,Slow Period = 26,MA Type = 0) = Array(outReal)```

##### talib.AROON

```
talib.AROON(inPriceHL)
talib.AROON(inPriceHL, optInTimePeriod)
```

```talib.AROON()```函数用于计算**Aroon（阿隆指标）**。

Parameters:

- `inPriceHL` ({@struct/Record Record}结构数组, required): ```inPriceHL```参数用于指定K线数据。
- `optInTimePeriod` (number, optional): ```optInTimePeriod```参数用于设置计算周期，默认值为14。

Returns (array): ```talib.AROON()```函数返回二维数组。

```javascript
function main() {
    var records = exchange.GetRecords()
    var ret = talib.AROON(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    ret = talib.AROON(records.High, records.Low)
    Log(ret)
```

```AROON()```函数在talib库文档中的描述为：```AROON(Records[High,Low],Time Period = 14) = [Array(outAroonDown),Array(outAroonUp)]```

##### talib.AROONOSC

```
talib.AROONOSC(inPriceHL)
talib.AROONOSC(inPriceHL, optInTimePeriod)
```

```talib.AROONOSC()```函数用于计算**Aroon Oscillator（阿隆震荡指标）**。

Parameters:

- `inPriceHL` ({@struct/Record Record}结构数组, required): ```inPriceHL```参数用于指定K线数据。
- `optInTimePeriod` (number, optional): ```optInTimePeriod```参数用于设置计算周期，默认值为14。

Returns (array): ```talib.AROONOSC()```函数返回一维数组。

```javascript
function main() {
    var records = exchange.GetRecords()
    var ret = talib.AROONOSC(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    ret = talib.AROONOSC(records.High, records.Low)
    Log(ret)
```

```AROONOSC()```函数在talib库文档中的描述为：```AROONOSC(Records[High,Low],Time Period = 14) = Array(outReal)```

##### talib.BOP

```
talib.BOP(inPriceOHLC)
```

```talib.BOP()```函数用于计算**Balance Of Power（均势指标）**。

Parameters:

- `inPriceOHLC` ({@struct/Record Record}结构数组, required): ```inPriceOHLC```参数用于指定K线数据。

Returns (array): ```talib.BOP()```函数返回一维数组。

```javascript
function main() {
    var records = exchange.GetRecords()
    var ret = talib.BOP(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    ret = talib.BOP(records.Open, records.High, records.Low, records.Close)
    Log(ret)
```

```BOP()```函数在talib库文档中的描述为：```BOP(Records[Open,High,Low,Close]) = Array(outReal)```

##### talib.CCI

```
talib.CCI(inPriceHLC)
talib.CCI(inPriceHLC, optInTimePeriod)
```

```talib.CCI()```函数用于计算**Commodity Channel Index（商品通道指数）**。

Parameters:

- `inPriceHLC` ({@struct/Record Record}结构数组, required): ```inPriceHLC```参数用于指定K线数据。
- `optInTimePeriod` (number, optional): ```optInTimePeriod```参数用于设置计算周期，默认值为14。

Returns (array): ```talib.CCI()```函数返回一维数组。

```javascript
function main() {
    var records = exchange.GetRecords()
    var ret = talib.CCI(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    ret = talib.CCI(records.High, records.Low, records.Close)
    Log(ret)
```

```CCI()```函数在talib库文档中的描述为：```CCI(Records[High,Low,Close],Time Period = 14) = Array(outReal)```

##### talib.CMO

```
talib.CMO(inReal)
talib.CMO(inReal, optInTimePeriod)
```

```talib.CMO()```函数用于计算**Chande Momentum Oscillator（钱德动量摆动指标）**。

Parameters:

- `inReal` ({@struct/Record Record}结构数组 / 数值数组, required): ```inReal```参数用于指定K线数据。
- `optInTimePeriod` (number, optional): ```optInTimePeriod```参数用于设置计算周期，默认值为14。

Returns (array): ```talib.CMO()```函数返回一维数组。

```javascript
function main() {
    var records = exchange.GetRecords()
    var ret = talib.CMO(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    ret = talib.CMO(records.Close)
    Log(ret)
```

```CMO()```函数在talib库文档中的描述为：```CMO(Records[Close],Time Period = 14) = Array(outReal)```

##### talib.DX

```
talib.DX(inPriceHLC)
talib.DX(inPriceHLC, optInTimePeriod)
```

```talib.DX()```函数用于计算**Directional Movement Index（动向指数）**。

Parameters:

- `inPriceHLC` ({@struct/Record Record}结构数组, required): ```inPriceHLC```参数用于指定K线数据。
- `optInTimePeriod` (number, optional): ```optInTimePeriod```参数用于设置计算周期，默认值为14。

Returns (array): ```talib.DX()```函数返回一维数组。

```javascript
function main() {
    var records = exchange.GetRecords()
    var ret = talib.DX(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    ret = talib.DX(records.High, records.Low, records.Close)
    Log(ret)
```

```DX()```函数在talib库文档中的描述为：```DX(Records[High,Low,Close],Time Period = 14) = Array(outReal)```

##### talib.MACD

```
talib.MACD(inReal)
talib.MACD(inReal, optInFastPeriod)
talib.MACD(inReal, optInFastPeriod, optInSlowPeriod)
talib.MACD(inReal, optInFastPeriod, optInSlowPeriod, optInSignalPeriod)
```

```talib.MACD()```函数用于计算**Moving Average Convergence/Divergence（移动平均收敛发散指标）**。

Parameters:

- `inReal` ({@struct/Record Record}结构数组 / 数值数组, required): ```inReal```参数用于指定K线数据。
- `optInFastPeriod` (number, optional): ```optInFastPeriod```参数用于设置快速周期，默认值为12。
- `optInSlowPeriod` (number, optional): ```optInSlowPeriod```参数用于设置慢速周期，默认值为26。
- `optInSignalPeriod` (number, optional): ```optInSignalPeriod```参数用于设置信号线周期，默认值为9。

Returns (array): ```talib.MACD()```函数返回二维数组。

```javascript
function main() {
    var records = exchange.GetRecords()
    var ret = talib.MACD(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    ret = talib.MACD(records.Close)
    Log(ret)
```

```MACD()```函数在talib库文档中的描述为：```MACD(Records[Close],Fast Period = 12,Slow Period = 26,Signal Period = 9) = [Array(outMACD),Array(outMACDSignal),Array(outMACDHist)]```

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

```talib.MACDEXT()```函数用于计算**MACD with controllable MA type（可控移动平均类型的MACD）**。

Parameters:

- `inReal` ({@struct/Record Record}结构数组 / 数值数组, required): ```inReal```参数用于指定K线数据。
- `optInFastPeriod` (number, optional): ```optInFastPeriod```参数用于设置快速周期，默认值为12。
- `optInFastMAType` (number, optional): ```optInFastMAType```参数用于设置快速移动平均线类型，默认值为0。
- `optInSlowPeriod` (number, optional): ```optInSlowPeriod```参数用于设置慢速周期，默认值为26。
- `optInSlowMAType` (number, optional): ```optInSlowMAType```参数用于设置慢速移动平均线类型，默认值为0。
- `optInSignalPeriod` (number, optional): ```optInSignalPeriod```参数用于设置信号线周期，默认值为9。
- `optInSignalMAType` (number, optional): ```optInSignalMAType```参数用于设置信号线移动平均类型，默认值为0。

Returns (array): ```talib.MACDEXT()```函数返回一个二维数组。

```javascript
function main() {
    var records = exchange.GetRecords()
    var ret = talib.MACDEXT(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    ret = talib.MACDEXT(records.Close)
    Log(ret)
```

```MACDEXT()```函数在talib库文档中的描述为：```MACDEXT(Records[Close],Fast Period = 12,Fast MA = 0,Slow Period = 26,Slow MA = 0,Signal Period = 9,Signal MA = 0) = [Array(outMACD),Array(outMACDSignal),Array(outMACDHist)]```

##### talib.MACDFIX

```
talib.MACDFIX(inReal)
talib.MACDFIX(inReal, optInSignalPeriod)
```

```talib.MACDFIX()```函数用于计算**Moving Average Convergence/Divergence Fix 12/26（移动平均收敛/发散固定12/26）**。

Parameters:

- `inReal` ({@struct/Record Record}结构数组 / 数值数组, required): ```inReal```参数用于指定K线数据。
- `optInSignalPeriod` (number, optional): ```optInSignalPeriod```参数用于设置信号周期，默认值为9。

Returns (array): ```talib.MACDFIX()```函数返回二维数组。

```javascript
function main() {
    var records = exchange.GetRecords()
    var ret = talib.MACDFIX(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    ret = talib.MACDFIX(records.Close)
    Log(ret)
```

```MACDFIX()```函数在talib库文档中的描述为：```MACDFIX(Records[Close],Signal Period = 9) = [Array(outMACD),Array(outMACDSignal),Array(outMACDHist)]```

##### talib.MFI

```
talib.MFI(inPriceHLCV)
talib.MFI(inPriceHLCV, optInTimePeriod)
```

```talib.MFI()```函数用于计算**Money Flow Index（资金流量指数）**。

Parameters:

- `inPriceHLCV` ({@struct/Record Record}结构数组, required): ```inPriceHLCV```参数用于指定K线数据。
- `optInTimePeriod` (number, optional): ```optInTimePeriod```参数用于设置计算周期，默认值为14。

Returns (array): ```talib.MFI()```函数返回一维数组。

```javascript
function main() {
    var records = exchange.GetRecords()
    var ret = talib.MFI(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    ret = talib.MFI(records.High, records.Low, records.Close, records.Volume)
    Log(ret)
```

```MFI()```函数在talib库文档中的描述为：```MFI(Records[High,Low,Close,Volume],Time Period = 14) = Array(outReal)```

##### talib.MINUS_DI

```
talib.MINUS_DI(inPriceHLC)
talib.MINUS_DI(inPriceHLC, optInTimePeriod)
```

```talib.MINUS_DI()```函数用于计算**负向指标（Minus Directional Indicator）**。

Parameters:

- `inPriceHLC` ({@struct/Record Record}结构数组, required): ```inPriceHLC```参数用于指定K线数据。
- `optInTimePeriod` (number, optional): ```optInTimePeriod```参数用于设置计算周期，默认值为14。

Returns (array): ```talib.MINUS_DI()```函数返回一维数组。

```javascript
function main() {
    var records = exchange.GetRecords()
    var ret = talib.MINUS_DI(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    ret = talib.MINUS_DI(records.High, records.Low, records.Close)
    Log(ret)
```

```MINUS_DI()```函数在talib库文档中的描述为：```MINUS_DI(Records[High,Low,Close],Time Period = 14) = Array(outReal)```

##### talib.MINUS_DM

```
talib.MINUS_DM(inPriceHL)
talib.MINUS_DM(inPriceHL, optInTimePeriod)
```

```talib.MINUS_DM()```函数用于计算**负向运动指标（Minus Directional Movement）**。

Parameters:

- `inPriceHL` ({@struct/Record Record}结构数组, required): ```inPriceHL```参数用于指定K线数据。
- `optInTimePeriod` (number, optional): ```optInTimePeriod```参数用于设置计算周期，默认值为14。

Returns (array): ```talib.MINUS_DM()```函数返回一维数组。

```javascript
function main() {
    var records = exchange.GetRecords()
    var ret = talib.MINUS_DM(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    ret = talib.MINUS_DM(records.High, records.Low)
    Log(ret)
```

```MINUS_DM()```函数在talib库文档中的描述为：```MINUS_DM(Records[High,Low],Time Period = 14) = Array(outReal)```

##### talib.MOM

```
talib.MOM(inReal)
talib.MOM(inReal, optInTimePeriod)
```

```talib.MOM()```函数用于计算**Momentum（动量指标）**。

Parameters:

- `inReal` ({@struct/Record Record}结构数组 / 数值数组, required): ```inReal```参数用于指定K线数据。
- `optInTimePeriod` (number, optional): ```optInTimePeriod```参数用于设置计算周期，默认值为10。

Returns (array): ```talib.MOM()```函数返回一维数组。

```javascript
function main() {
    var records = exchange.GetRecords()
    var ret = talib.MOM(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    ret = talib.MOM(records.Close)
    Log(ret)
```

```MOM()```函数在talib库文档中的描述为：```MOM(Records[Close],Time Period = 10) = Array(outReal)```

##### talib.PLUS_DI

```
talib.PLUS_DI(inPriceHLC)
talib.PLUS_DI(inPriceHLC, optInTimePeriod)
```

```talib.PLUS_DI()```函数用于计算**Plus Directional Indicator（正向指标）**。

Parameters:

- `inPriceHLC` ({@struct/Record Record}结构数组, required): ```inPriceHLC```参数用于指定K线数据。
- `optInTimePeriod` (number, optional): ```optInTimePeriod```参数用于设置时间周期，默认值为14。

Returns (array): ```talib.PLUS_DI()```函数返回一维数组。

```javascript
function main() {
    var records = exchange.GetRecords()
    var ret = talib.PLUS_DI(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    ret = talib.PLUS_DI(records.High, records.Low, records.Close)
    Log(ret)
```

```PLUS_DI()```函数在talib库文档中的描述为：```PLUS_DI(Records[High,Low,Close],Time Period = 14) = Array(outReal)```

##### talib.PLUS_DM

```
talib.PLUS_DM(inPriceHL)
talib.PLUS_DM(inPriceHL, optInTimePeriod)
```

```talib.PLUS_DM()```函数用于计算**Plus Directional Movement（正向运动指标）**。

Parameters:

- `inPriceHL` ({@struct/Record Record}结构数组, required): ```inPriceHL```参数用于指定K线数据。
- `optInTimePeriod` (number, optional): ```optInTimePeriod```参数用于设置计算周期，默认值为14。

Returns (array): ```talib.PLUS_DM()```函数返回一维数组。

```javascript
function main() {
    var records = exchange.GetRecords()
    var ret = talib.PLUS_DM(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    ret = talib.PLUS_DM(records.High, records.Low)
    Log(ret)
```

```PLUS_DM()```函数在talib库文档中的描述为：```PLUS_DM(Records[High,Low],Time Period = 14) = Array(outReal)```

##### talib.PPO

```
talib.PPO(inReal)
talib.PPO(inReal, optInFastPeriod)
talib.PPO(inReal, optInFastPeriod, optInSlowPeriod)
talib.PPO(inReal, optInFastPeriod, optInSlowPeriod, optInMAType)
```

```talib.PPO()```函数用于计算**Percentage Price Oscillator（价格振荡百分比）**。

Parameters:

- `inReal` ({@struct/Record Record}结构数组 / 数值数组, required): ```inReal```参数用于指定K线数据。
- `optInFastPeriod` (number, optional): ```optInFastPeriod```参数用于设置快速周期，默认值为12。
- `optInSlowPeriod` (number, optional): ```optInSlowPeriod```参数用于设置慢速周期，默认值为26。
- `optInMAType` (number, optional): ```optInMAType```参数用于设置移动平均线类型，默认值为0。

Returns (array): ```talib.PPO()```函数返回一维数组。

```javascript
function main() {
    var records = exchange.GetRecords()
    var ret = talib.PPO(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    ret = talib.PPO(records.Close)
    Log(ret)
```

```PPO()```函数在talib库文档中的描述为：```PPO(Records[Close],Fast Period = 12,Slow Period = 26,MA Type = 0) = Array(outReal)```

##### talib.ROC

```
talib.ROC(inReal)
talib.ROC(inReal, optInTimePeriod)
```

```talib.ROC()```函数用于计算**变动率指标（Rate of change）：((price/prevPrice)-1)*100**。

Parameters:

- `inReal` ({@struct/Record Record}结构数组 / 数值数组, required): ```inReal```参数用于指定K线数据。
- `optInTimePeriod` (number, optional): ```optInTimePeriod```参数用于设置计算周期，默认值为10。

Returns (array): ```talib.ROC()```函数返回一维数组。

```javascript
function main() {
    var records = exchange.GetRecords()
    var ret = talib.ROC(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    ret = talib.ROC(records.Close)
    Log(ret)
```

```ROC()```函数在talib库文档中的描述为：```ROC(Records[Close],Time Period = 10) = Array(outReal)```

##### talib.ROCP

```
talib.ROCP(inReal)
talib.ROCP(inReal, optInTimePeriod)
```

```talib.ROCP()```函数用于计算**价格变化率百分比：(price-prevPrice)/prevPrice**。

Parameters:

- `inReal` ({@struct/Record Record}结构数组 / 数值数组, required): ```inReal```参数用于指定K线数据。
- `optInTimePeriod` (number, optional): ```optInTimePeriod```参数用于设置计算周期，默认值为10。

Returns (array): ```talib.ROCP()```函数返回一维数组。

```javascript
function main() {
    var records = exchange.GetRecords()
    var ret = talib.ROCP(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    ret = talib.ROCP(records.Close)
    Log(ret)
```

```ROCP()```函数在talib库文档中的描述为：```ROCP(Records[Close],Time Period = 10) = Array(outReal)```

##### talib.ROCR

```
talib.ROCR(inReal)
talib.ROCR(inReal, optInTimePeriod)
```

```talib.ROCR()```函数用于计算**价格变化率比值：(price/prevPrice)**。

Parameters:

- `inReal` ({@struct/Record Record}结构数组 / 数值数组, required): ```inReal```参数用于指定K线数据。
- `optInTimePeriod` (number, optional): ```optInTimePeriod```参数用于设置计算周期，默认值为10。

Returns (array): ```talib.ROCR()```函数返回一维数组。

```javascript
function main() {
    var records = exchange.GetRecords()
    var ret = talib.ROCR(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    ret = talib.ROCR(records.Close)
    Log(ret)
```

```ROCR()```函数在talib库文档中的描述为：```ROCR(Records[Close],Time Period = 10) = Array(outReal)```

##### talib.ROCR100

```
talib.ROCR100(inReal)
talib.ROCR100(inReal, optInTimePeriod)
```

```talib.ROCR100()```函数用于计算**Rate of change ratio 100 scale: (price/prevPrice)*100（价格变化率比例100倍）**。

Parameters:

- `inReal` ({@struct/Record Record}结构数组 / 数值数组, required): ```inReal```参数用于指定K线数据。
- `optInTimePeriod` (number, optional): ```optInTimePeriod```参数用于设置计算周期，默认值为10。

Returns (array): ```talib.ROCR100()```函数返回一维数组。

```javascript
function main() {
    var records = exchange.GetRecords()
    var ret = talib.ROCR100(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    ret = talib.ROCR100(records.Close)
    Log(ret)
```

```ROCR100()```函数在talib库文档中的描述为：```ROCR100(Records[Close],Time Period = 10) = Array(outReal)```

##### talib.RSI

```
talib.RSI(inReal)
talib.RSI(inReal, optInTimePeriod)
```

```talib.RSI()```函数用于计算**Relative Strength Index（相对强弱指标）**。

Parameters:

- `inReal` ({@struct/Record Record}结构数组 / 数值数组, required): ```inReal```参数用于指定K线数据。
- `optInTimePeriod` (number, optional): ```optInTimePeriod```参数用于设置计算周期，默认值为14。

Returns (array): ```talib.RSI()```函数返回一维数组。

```javascript
function main() {
    var records = exchange.GetRecords()
    var ret = talib.RSI(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    ret = talib.RSI(records.Close)
    Log(ret)
```

```RSI()```函数在talib库文档中的描述为：```RSI(Records[Close],Time Period = 14) = Array(outReal)```

##### talib.STOCH

```
talib.STOCH(inPriceHLC)
talib.STOCH(inPriceHLC, optInFastK_Period)
talib.STOCH(inPriceHLC, optInFastK_Period, optInSlowK_Period)
talib.STOCH(inPriceHLC, optInFastK_Period, optInSlowK_Period, optInSlowK_MAType)
talib.STOCH(inPriceHLC, optInFastK_Period, optInSlowK_Period, optInSlowK_MAType, optInSlowD_Period)
talib.STOCH(inPriceHLC, optInFastK_Period, optInSlowK_Period, optInSlowK_MAType, optInSlowD_Period, optInSlowD_MAType)
```

```talib.STOCH()```函数用于计算**随机指标（STOCH指标）**。

Parameters:

- `inPriceHLC` ({@struct/Record Record}结构数组, required): ```inPriceHLC```参数用于指定K线数据。
- `optInFastK_Period` (number, optional): ```optInFastK_Period```参数用于设置快速K值周期，默认值为5。
- `optInSlowK_Period` (number, optional): ```optInSlowK_Period```参数用于设置慢速K值周期，默认值为3。
- `optInSlowK_MAType` (number, optional): ```optInSlowK_MAType```参数用于设置慢速K值移动平均线类型，默认值为0。
- `optInSlowD_Period` (number, optional): ```optInSlowD_Period```参数用于设置慢速D值周期，默认值为3。
- `optInSlowD_MAType` (number, optional): ```optInSlowD_MAType```参数用于设置慢速D值移动平均线类型，默认值为0。

Returns (array): ```talib.STOCH()```函数返回二维数组。

```javascript
function main() {
    var records = exchange.GetRecords()
    var ret = talib.STOCH(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    ret = talib.STOCH(records.High, records.Low, records.Close)
    Log(ret)
```

```STOCH()```函数在talib库文档中的描述为：```STOCH(Records[High,Low,Close],Fast-K Period = 5,Slow-K Period = 3,Slow-K MA = 0,Slow-D Period = 3,Slow-D MA = 0) = [Array(outSlowK),Array(outSlowD)]```

##### talib.STOCHF

```
talib.STOCHF(inPriceHLC)
talib.STOCHF(inPriceHLC, optInFastK_Period)
talib.STOCHF(inPriceHLC, optInFastK_Period, optInFastD_Period)
talib.STOCHF(inPriceHLC, optInFastK_Period, optInFastD_Period, optInFastD_MAType)
```

```talib.STOCHF()```函数用于计算**快速随机指标（Stochastic Fast）**。

Parameters:

- `inPriceHLC` ({@struct/Record Record}结构数组, required): ```inPriceHLC```参数用于指定K线数据。
- `optInFastK_Period` (number, optional): ```optInFastK_Period```参数用于设置Fast-K周期，默认值为5。
- `optInFastD_Period` (number, optional): ```optInFastD_Period```参数用于设置Fast-D周期，默认值为3。
- `optInFastD_MAType` (number, optional): ```optInFastD_MAType```参数用于设置Fast-D移动平均线类型，默认值为0。

Returns (array): ```talib.STOCHF()```函数返回二维数组。

```javascript
function main() {
    var records = exchange.GetRecords()
    var ret = talib.STOCHF(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    ret = talib.STOCHF(records.High, records.Low, records.Close)
    Log(ret)
```

```STOCHF()```函数在talib库文档中的描述为：```STOCHF(Records[High,Low,Close],Fast-K Period = 5,Fast-D Period = 3,Fast-D MA = 0) = [Array(outFastK),Array(outFastD)]```

##### talib.STOCHRSI

```
talib.STOCHRSI(inReal)
talib.STOCHRSI(inReal, optInTimePeriod)
talib.STOCHRSI(inReal, optInTimePeriod, optInFastK_Period)
talib.STOCHRSI(inReal, optInTimePeriod, optInFastK_Period, optInFastD_Period)
talib.STOCHRSI(inReal, optInTimePeriod, optInFastK_Period, optInFastD_Period, optInFastD_MAType)
```

```talib.STOCHRSI()```函数用于计算**随机相对强弱指数（Stochastic Relative Strength Index）**。

Parameters:

- `inReal` ({@struct/Record Record}结构数组 / 数值数组, required): ```inReal```参数用于指定价格数据。
- `optInTimePeriod` (number, optional): ```optInTimePeriod```参数用于设置计算周期，默认值为14。
- `optInFastK_Period` (number, optional): ```optInFastK_Period```参数用于设置Fast-K线周期，默认值为5。
- `optInFastD_Period` (number, optional): ```optInFastD_Period```参数用于设置Fast-D线周期，默认值为3。
- `optInFastD_MAType` (number, optional): ```optInFastD_MAType```参数用于设置Fast-D线移动平均类型，默认值为0。

Returns (array): ```talib.STOCHRSI()```函数返回二维数组，包含Fast-K和Fast-D两个数组。

```javascript
function main() {
    var records = exchange.GetRecords()
    var ret = talib.STOCHRSI(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    ret = talib.STOCHRSI(records.Close)
    Log(ret)
```

```STOCHRSI()```函数在talib库文档中的描述为：```STOCHRSI(Records[Close],Time Period = 14,Fast-K Period = 5,Fast-D Period = 3,Fast-D MA = 0) = [Array(outFastK),Array(outFastD)]```

##### talib.TRIX

```
talib.TRIX(inReal)
talib.TRIX(inReal, optInTimePeriod)
```

```talib.TRIX()```函数用于计算**1-day Rate-Of-Change (ROC) of a Triple Smooth EMA（三重指数平滑移动平均线的一日变化率）**。

Parameters:

- `inReal` ({@struct/Record Record}结构数组 / 数值数组, required): ```inReal```参数用于指定K线数据。
- `optInTimePeriod` (number, optional): ```optInTimePeriod```参数用于设置计算周期，默认值为30。

Returns (array): ```talib.TRIX()```函数返回一维数组。

```javascript
function main() {
    var records = exchange.GetRecords()
    var ret = talib.TRIX(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    ret = talib.TRIX(records.Close)
    Log(ret)
```

```TRIX()```函数在talib库文档中的描述为：```TRIX(Records[Close],Time Period = 30) = Array(outReal)```

##### talib.ULTOSC

```
talib.ULTOSC(inPriceHLC)
talib.ULTOSC(inPriceHLC, optInTimePeriod1)
talib.ULTOSC(inPriceHLC, optInTimePeriod1, optInTimePeriod2)
talib.ULTOSC(inPriceHLC, optInTimePeriod1, optInTimePeriod2, optInTimePeriod3)
```

```talib.ULTOSC()```函数用于计算**Ultimate Oscillator（极限振荡器）**。

Parameters:

- `inPriceHLC` ({@struct/Record Record}结构数组, required): ```inPriceHLC```参数用于指定K线数据。
- `optInTimePeriod1` (number, optional): ```optInTimePeriod1```参数用于设置第一个时间周期，默认值为7。
- `optInTimePeriod2` (number, optional): ```optInTimePeriod2```参数用于设置第二个时间周期，默认值为14。
- `optInTimePeriod3` (number, optional): ```optInTimePeriod3```参数用于设置第三个时间周期，默认值为28。

Returns (array): ```talib.ULTOSC()```函数返回一维数组。

```javascript
function main() {
    var records = exchange.GetRecords()
    var ret = talib.ULTOSC(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    ret = talib.ULTOSC(records.High, records.Low, records.Close)
    Log(ret)
```

```ULTOSC()```函数在talib库文档中的描述为：```ULTOSC(Records[High,Low,Close],First Period = 7,Second Period = 14,Third Period = 28) = Array(outReal)```

##### talib.WILLR

```
talib.WILLR(inPriceHLC)
talib.WILLR(inPriceHLC, optInTimePeriod)
```

```talib.WILLR()```函数用于计算**Williams' %R（威廉指标）**。

Parameters:

- `inPriceHLC` ({@struct/Record Record}结构数组, required): ```inPriceHLC```参数用于指定K线数据。
- `optInTimePeriod` (number, optional): ```optInTimePeriod```参数用于设置计算周期，默认值为14。

Returns (array): ```talib.WILLR()```函数返回一维数组。

```javascript
function main() {
    var records = exchange.GetRecords()
    var ret = talib.WILLR(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    ret = talib.WILLR(records.High, records.Low, records.Close)
    Log(ret)
```

```WILLR()```函数在talib库文档中的描述为：```WILLR(Records[High,Low,Close],Time Period = 14) = Array(outReal)```

#### VolumeIndicators

成交量类指标：AD、ADOSC、OBV。

##### talib.AD

```
talib.AD(inPriceHLCV)
```

```talib.AD()```函数用于计算**Chaikin A/D Line（累积/派发线指标）**。

Parameters:

- `inPriceHLCV` ({@struct/Record Record}结构数组, required): ```inPriceHLCV```参数用于指定K线数据。

Returns (array): ```talib.AD()```函数返回一维数组。

```javascript
function main() {
    var records = exchange.GetRecords()
    var ret = talib.AD(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    ret = talib.AD(records.High, records.Low, records.Close, records.Volume)
    Log(ret)
```

```AD()```函数在talib库文档中的描述为：```AD(Records[High,Low,Close,Volume]) = Array(outReal)```

##### talib.ADOSC

```
talib.ADOSC(inPriceHLCV)
talib.ADOSC(inPriceHLCV, optInFastPeriod, optInSlowPeriod)
```

```talib.ADOSC()```函数用于计算**Chaikin A/D Oscillator（佳庆指标）**。

Parameters:

- `inPriceHLCV` ({@struct/Record Record}结构数组, required): ```inPriceHLCV```参数用于指定K线数据。
- `optInFastPeriod` (number, optional): ```optInFastPeriod```参数用于设置快速周期。
- `optInSlowPeriod` (number, optional): ```optInSlowPeriod```参数用于设置慢速周期。

Returns (array): ```talib.ADOSC()```函数返回一维数组。

```javascript
function main() {
    var records = exchange.GetRecords()
    var ret = talib.ADOSC(records, 3, 10)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    ret = talib.ADOSC(records.High, records.Low, records.Close, records.Volume, 3, 10)
    Log(ret)
```

```ADOSC()```函数在talib库文档中的描述为：```ADOSC(Records[High,Low,Close,Volume],Fast Period = 3,Slow Period = 10) = Array(outReal)```

##### talib.OBV

```
talib.OBV(inReal)
talib.OBV(inReal, inPriceV)
```

```talib.OBV()```函数用于计算**On Balance Volume（能量潮指标）**。

Parameters:

- `inReal` ({@struct/Record Record}结构数组 / 数值数组, required): ```inReal```参数用于指定K线数据。
- `inPriceV` ({@struct/Record Record}结构数组, optional): ```inPriceV```参数用于指定K线数据。

Returns (array): ```talib.OBV()```函数返回一维数组。

```javascript
function main() {
    var records = exchange.GetRecords()
    var ret = talib.OBV(records, records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    ret = talib.OBV(records.Close, records.Volume)
    Log(ret)
```

```OBV()```函数在talib库文档中的描述为：```OBV(Records[Close],Records[Volume]) = Array(outReal)```

#### VolatilityIndicators

波动率类指标：ATR、NATR、TRANGE。

##### talib.ATR

```
talib.ATR(inPriceHLC)
talib.ATR(inPriceHLC, optInTimePeriod)
```

```talib.ATR()```函数用于计算**Average True Range（平均真实波幅）**指标。

Parameters:

- `inPriceHLC` ({@struct/Record Record}结构数组, required): ```inPriceHLC```参数用于指定K线数据。
- `optInTimePeriod` (number, optional): ```optInTimePeriod```参数用于设置计算周期，默认值为14。

Returns (array): ```talib.ATR()```函数返回一维数组。

```javascript
function main() {
    var records = exchange.GetRecords()
    var ret = talib.ATR(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    ret = talib.ATR(records.High, records.Low, records.Close)
    Log(ret)
```

```ATR()```函数在talib库文档中的描述为：```ATR(Records[High,Low,Close],Time Period = 14) = Array(outReal)```

##### talib.NATR

```
talib.NATR(inPriceHLC)
talib.NATR(inPriceHLC, optInTimePeriod)
```

```talib.NATR()```函数用于计算**Normalized Average True Range（归一化平均真实范围）**。

Parameters:

- `inPriceHLC` ({@struct/Record Record}结构数组, required): ```inPriceHLC```参数用于指定K线数据。
- `optInTimePeriod` (number, optional): ```optInTimePeriod```参数用于设置计算周期，默认值为14。

Returns (array): ```talib.NATR()```函数返回一维数组。

```javascript
function main() {
    var records = exchange.GetRecords()
    var ret = talib.NATR(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    ret = talib.NATR(records.High, records.Low, records.Close)
    Log(ret)
```

```NATR()```函数在talib库文档中的描述为：```NATR(Records[High,Low,Close],Time Period = 14) = Array(outReal)```

##### talib.TRANGE

```
talib.TRANGE(inPriceHLC)
```

```talib.TRANGE()```函数用于计算**True Range（真实范围）**指标。

Parameters:

- `inPriceHLC` ({@struct/Record Record}结构数组, required): ```inPriceHLC```参数用于指定K线数据。

Returns (array): ```talib.TRANGE()```函数返回一维数组。

```javascript
function main() {
    var records = exchange.GetRecords()
    var ret = talib.TRANGE(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    ret = talib.TRANGE(records.High, records.Low, records.Close)
    Log(ret)
```

```TRANGE()```函数在talib库文档中的描述为：```TRANGE(Records[High,Low,Close]) = Array(outReal)```

#### CycleIndicators

周期类指标（希尔伯特变换）。

##### talib.HT_DCPERIOD

```
talib.HT_DCPERIOD(inReal)
```

```talib.HT_DCPERIOD()```函数用于计算**Hilbert Transform - Dominant Cycle Period（希尔伯特变换主导周期）**。

Parameters:

- `inReal` ({@struct/Record Record}结构数组 / 数值数组, required): ```inReal```参数用于指定K线数据。

Returns (array): ```talib.HT_DCPERIOD()```函数返回一维数组。

```javascript
function main() {
    var records = exchange.GetRecords()
    var ret = talib.HT_DCPERIOD(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    ret = talib.HT_DCPERIOD(records.Close)
    Log(ret)
```

```HT_DCPERIOD()```函数在talib库文档中的描述为：```HT_DCPERIOD(Records[Close]) = Array(outReal)```

##### talib.HT_DCPHASE

```
talib.HT_DCPHASE(inReal)
```

```talib.HT_DCPHASE()```函数用于计算**希尔伯特变换主周期相位（Hilbert Transform - Dominant Cycle Phase）**。

Parameters:

- `inReal` ({@struct/Record Record}结构数组 / 数值数组, required): ```inReal```参数用于指定输入的K线数据。

Returns (array): ```talib.HT_DCPHASE()```函数返回一维数组。

```javascript
function main() {
    var records = exchange.GetRecords()
    var ret = talib.HT_DCPHASE(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    ret = talib.HT_DCPHASE(records.Close)
    Log(ret)
```

```HT_DCPHASE()```函数在talib库文档中的描述为：```HT_DCPHASE(Records[Close]) = Array(outReal)```

##### talib.HT_PHASOR

```
talib.HT_PHASOR(inReal)
```

```talib.HT_PHASOR()```函数用于计算**Hilbert Transform - Phasor Components（希尔伯特变换-相量分量）**。

Parameters:

- `inReal` ({@struct/Record Record}结构数组 / 数值数组, required): ```inReal```参数用于指定输入的K线数据。

Returns (array): ```talib.HT_PHASOR()```函数返回一个二维数组。

```javascript
function main() {
    var records = exchange.GetRecords()
    var ret = talib.HT_PHASOR(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    ret = talib.HT_PHASOR(records.Close)
    Log(ret)
```

```HT_PHASOR()```函数在talib库文档中的描述为：```HT_PHASOR(Records[Close]) = [Array(outInPhase),Array(outQuadrature)]```

##### talib.HT_SINE

```
talib.HT_SINE(inReal)
```

```talib.HT_SINE()```函数用于计算**Hilbert Transform - SineWave（希尔伯特变换 - 正弦波）**。

Parameters:

- `inReal` ({@struct/Record Record}结构数组 / 数值数组, required): ```inReal```参数用于指定K线数据。

Returns (array): ```talib.HT_SINE()```函数返回二维数组。

```javascript
function main() {
    var records = exchange.GetRecords()
    var ret = talib.HT_SINE(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    ret = talib.HT_SINE(records.Close)
    Log(ret)
```

```HT_SINE()```函数在talib库文档中的描述为：```HT_SINE(Records[Close]) = [Array(outSine),Array(outLeadSine)]```

##### talib.HT_TRENDMODE

```
talib.HT_TRENDMODE(inReal)
```

```talib.HT_TRENDMODE()```函数用于计算**Hilbert Transform - Trend vs Cycle Mode（希尔伯特变换 - 趋势与周期模式）**。

Parameters:

- `inReal` ({@struct/Record Record}结构数组 / 数值数组, required): ```inReal```参数用于指定K线数据。

Returns (array): ```talib.HT_TRENDMODE()```函数返回一维数组。

```javascript
function main() {
    var records = exchange.GetRecords()
    var ret = talib.HT_TRENDMODE(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    ret = talib.HT_TRENDMODE(records.Close)
    Log(ret)
```

```HT_TRENDMODE()```函数在talib库文档中的描述为：```HT_TRENDMODE(Records[Close]) = Array(outInteger)```

#### PriceTransform

价格变换：平均价、中间价、典型价、加权收盘价。

##### talib.AVGPRICE

```
talib.AVGPRICE(inPriceOHLC)
```

```talib.AVGPRICE()```函数用于计算**Average Price（平均价格）**。

Parameters:

- `inPriceOHLC` ({@struct/Record Record}结构数组, required): ```inPriceOHLC```参数用于指定K线数据。

Returns (array): ```talib.AVGPRICE()```函数返回一维数组。

```javascript
function main() {
    var records = exchange.GetRecords()
    var ret = talib.AVGPRICE(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    ret = talib.AVGPRICE(records.Open, records.High, records.Low, records.Close)
    Log(ret)
```

```AVGPRICE()```函数在talib库文档中的描述为：```AVGPRICE(Records[Open,High,Low,Close]) = Array(outReal)```

##### talib.MEDPRICE

```
talib.MEDPRICE(inPriceHL)
```

```talib.MEDPRICE()```函数用于计算**Median Price（中位数价格）**。

Parameters:

- `inPriceHL` ({@struct/Record Record}结构数组, required): ```inPriceHL```参数用于指定K线数据。

Returns (array): ```talib.MEDPRICE()```函数返回一维数组。

```javascript
function main() {
    var records = exchange.GetRecords()
    var ret = talib.MEDPRICE(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    ret = talib.MEDPRICE(records.High, records.Low)
    Log(ret)
```

```MEDPRICE()```函数在talib库文档中的描述为：```MEDPRICE(Records[High,Low]) = Array(outReal)```

##### talib.TYPPRICE

```
talib.TYPPRICE(inPriceHLC)
```

```talib.TYPPRICE()```函数用于计算**典型价格（Typical Price）**。

Parameters:

- `inPriceHLC` ({@struct/Record Record}结构数组, required): ```inPriceHLC```参数用于指定K线数据。

Returns (array): ```talib.TYPPRICE()```函数返回一维数组。

```javascript
function main() {
    var records = exchange.GetRecords()
    var ret = talib.TYPPRICE(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    ret = talib.TYPPRICE(records.High, records.Low, records.Close)
    Log(ret)
```

```TYPPRICE()```函数在talib库文档中的描述为：```TYPPRICE(Records[High,Low,Close]) = Array(outReal)```

##### talib.WCLPRICE

```
talib.WCLPRICE(inPriceHLC)
```

```talib.WCLPRICE()```函数用于计算**Weighted Close Price（加权收盘价）**。

Parameters:

- `inPriceHLC` ({@struct/Record Record}结构数组, required): ```inPriceHLC```参数用于指定K线数据。

Returns (array): ```talib.WCLPRICE()```函数返回一维数组。

```javascript
function main() {
    var records = exchange.GetRecords()
    var ret = talib.WCLPRICE(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    ret = talib.WCLPRICE(records.High, records.Low, records.Close)
    Log(ret)
```

```WCLPRICE()```函数在talib库文档中的描述为：```WCLPRICE(Records[High,Low,Close]) = Array(outReal)```

#### StatisticFunctions

统计函数：线性回归、标准差、方差、时间序列预测。

##### talib.LINEARREG

```
talib.LINEARREG(inReal)
talib.LINEARREG(inReal, optInTimePeriod)
```

```talib.LINEARREG()```函数用于计算**Linear Regression（线性回归）**指标。

Parameters:

- `inReal` ({@struct/Record Record}结构数组 / 数值数组, required): ```inReal```参数用于指定输入的K线数据。
- `optInTimePeriod` (number, optional): ```optInTimePeriod```参数用于设置计算周期，默认值为14。

Returns (array): ```talib.LINEARREG()```函数返回一维数组，包含线性回归计算结果。

```javascript
function main() {
    var records = exchange.GetRecords()
    var ret = talib.LINEARREG(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    ret = talib.LINEARREG(records.Close)
    Log(ret)
```

```LINEARREG()```函数在talib库文档中的描述为：```LINEARREG(Records[Close],Time Period = 14) = Array(outReal)```

##### talib.LINEARREG_ANGLE

```
talib.LINEARREG_ANGLE(inReal)
talib.LINEARREG_ANGLE(inReal, optInTimePeriod)
```

```talib.LINEARREG_ANGLE()```函数用于计算**Linear Regression Angle（线性回归角度）**。

Parameters:

- `inReal` ({@struct/Record Record}结构数组 / 数值数组, required): ```inReal```参数用于指定K线数据。
- `optInTimePeriod` (number, optional): ```optInTimePeriod```参数用于设置计算周期，默认值为14。

Returns (array): ```talib.LINEARREG_ANGLE()```函数返回一维数组。

```javascript
function main() {
    var records = exchange.GetRecords()
    var ret = talib.LINEARREG_ANGLE(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    ret = talib.LINEARREG_ANGLE(records.Close)
    Log(ret)
```

```LINEARREG_ANGLE()```函数在talib库文档中的描述为：```LINEARREG_ANGLE(Records[Close],Time Period = 14) = Array(outReal)```

##### talib.LINEARREG_INTERCEPT

```
talib.LINEARREG_INTERCEPT(inReal)
talib.LINEARREG_INTERCEPT(inReal, optInTimePeriod)
```

```talib.LINEARREG_INTERCEPT()```函数用于计算**线性回归截距（Linear Regression Intercept）**。

Parameters:

- `inReal` ({@struct/Record Record}结构数组 / 数值数组, required): ```inReal```参数用于指定K线数据。
- `optInTimePeriod` (number, optional): ```optInTimePeriod```参数用于设置计算周期，默认值为14。

Returns (array): ```talib.LINEARREG_INTERCEPT()```函数返回一维数组。

```javascript
function main() {
    var records = exchange.GetRecords()
    var ret = talib.LINEARREG_INTERCEPT(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    ret = talib.LINEARREG_INTERCEPT(records.Close)
    Log(ret)
```

```LINEARREG_INTERCEPT()```函数在talib库文档中的描述为：```LINEARREG_INTERCEPT(Records[Close],Time Period = 14) = Array(outReal)```

##### talib.LINEARREG_SLOPE

```
talib.LINEARREG_SLOPE(inReal)
talib.LINEARREG_SLOPE(inReal, optInTimePeriod)
```

```talib.LINEARREG_SLOPE()```函数用于计算**Linear Regression Slope（线性回归斜率）**。

Parameters:

- `inReal` ({@struct/Record Record}结构数组 / 数值数组, required): ```inReal```参数用于指定K线数据。
- `optInTimePeriod` (number, optional): ```optInTimePeriod```参数用于设置计算周期，默认值为14。

Returns (array): ```talib.LINEARREG_SLOPE()```函数返回一维数组。

```javascript
function main() {
    var records = exchange.GetRecords()
    var ret = talib.LINEARREG_SLOPE(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    ret = talib.LINEARREG_SLOPE(records.Close)
    Log(ret)
```

```LINEARREG_SLOPE()```函数在talib库文档中的描述为：```LINEARREG_SLOPE(Records[Close],Time Period = 14) = Array(outReal)```

##### talib.STDDEV

```
talib.STDDEV(inReal)
talib.STDDEV(inReal, optInTimePeriod)
talib.STDDEV(inReal, optInTimePeriod, optInNbDev)
```

```talib.STDDEV()```函数用于计算**标准偏差（Standard Deviation）**。

Parameters:

- `inReal` ({@struct/Record Record}结构数组 / 数值数组, required): ```inReal```参数用于指定K线数据。
- `optInTimePeriod` (number, optional): ```optInTimePeriod```参数用于设置计算周期，默认值为5。
- `optInNbDev` (number, optional): ```optInNbDev```参数用于设置偏差倍数，默认值为1。

Returns (array): ```talib.STDDEV()```函数返回一维数组。

```javascript
function main() {
    var records = exchange.GetRecords()
    var ret = talib.STDDEV(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    ret = talib.STDDEV(records.Close)
    Log(ret)
```

```STDDEV()```函数在talib库文档中的描述为：```STDDEV(Records[Close],Time Period = 5,Deviations = 1) = Array(outReal)```

##### talib.TSF

```
talib.TSF(inReal)
talib.TSF(inReal, optInTimePeriod)
```

```talib.TSF()```函数用于计算**Time Series Forecast（时间序列预测）**。

Parameters:

- `inReal` ({@struct/Record Record}结构数组 / 数值数组, required): ```inReal```参数用于指定K线数据。
- `optInTimePeriod` (number, optional): ```optInTimePeriod```参数用于设置计算周期，默认值为14。

Returns (array): ```talib.TSF()```函数返回一维数组。

```javascript
function main() {
    var records = exchange.GetRecords()
    var ret = talib.TSF(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    ret = talib.TSF(records.Close)
    Log(ret)
```

```TSF()```函数在talib库文档中的描述为：```TSF(Records[Close],Time Period = 14) = Array(outReal)```

##### talib.VAR

```
talib.VAR(inReal)
talib.VAR(inReal, optInTimePeriod)
talib.VAR(inReal, optInTimePeriod, optInNbDev)
```

```talib.VAR()```函数用于计算**方差（Variance）**。

Parameters:

- `inReal` ({@struct/Record Record}结构数组 / 数值数组, required): ```inReal```参数用于指定K线数据。
- `optInTimePeriod` (number, optional): ```optInTimePeriod```参数用于设置计算周期，默认值为5。
- `optInNbDev` (number, optional): ```optInNbDev```参数用于设置标准差倍数，默认值为1。

Returns (array): ```talib.VAR()```函数返回一维数组。

```javascript
function main() {
    var records = exchange.GetRecords()
    var ret = talib.VAR(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    ret = talib.VAR(records.Close)
    Log(ret)
```

```VAR()```函数在talib库文档中的描述为：```VAR(Records[Close],Time Period = 5,Deviations = 1) = Array(outReal)```

#### MathTransform

数学变换：三角函数、指数、对数、取整、开方。

##### talib.ACOS

```
talib.ACOS(inReal)
```

```talib.ACOS()```函数用于计算**向量三角反余弦函数（Vector Trigonometric ACos）**。

Parameters:

- `inReal` ({@struct/Record Record}结构数组 / 数值数组, required): ```inReal```参数用于指定输入的实数数据。

Returns (array): ```talib.ACOS()```函数返回一维数组，包含计算得出的反余弦值。

```javascript
function main() {
    var data = [-1, 0, 1]
    var ret = talib.ACOS(data)
    Log(ret)
}
```

```python
import talib
import numpy as np
def main():
    data = [-1.0, 0, 1.0]
    ret = talib.ACOS(np.array(data))
    Log(ret)
```

```ACOS()```函数在talib库文档中的描述为：```ACOS(Records[Close]) = Array(outReal)```

##### talib.ASIN

```
talib.ASIN(inReal)
```

```talib.ASIN()```函数用于计算**向量三角反正弦函数（Vector Trigonometric ASin）**。

Parameters:

- `inReal` ({@struct/Record Record}结构数组 / 数值数组, required): ```inReal```参数用于指定输入的实数数据。

Returns (array): ```talib.ASIN()```函数返回一维数组，包含计算得出的反正弦值。

```javascript
function main() {
    var data = [-1, 0, 1]
    var ret = talib.ASIN(data)
    Log(ret)
}
```

```python
import talib
import numpy as np
def main():
    data = [-1.0, 0, 1.0]
    ret = talib.ASIN(np.array(data))
    Log(ret)
```

```ASIN()```函数在talib库文档中的描述为：```ASIN(Records[Close]) = Array(outReal)```

##### talib.ATAN

```
talib.ATAN(inReal)
```

```talib.ATAN()```函数用于计算**向量三角反正切函数（Vector Trigonometric ATan）**。

Parameters:

- `inReal` ({@struct/Record Record}结构数组 / 数值数组, required): ```inReal```参数用于指定输入的实数数据。

Returns (array): ```talib.ATAN()```函数返回一维数组，包含计算得出的反正切值。

```javascript
function main() {
    var data = [-3.14/2, 0, 3.14/2]
    var ret = talib.ATAN(data)
    Log(ret)
}
```

```python
import talib
import numpy as np
def main():
    data = [-3.14/2, 0, 3.14/2]
    ret = talib.ATAN(np.array(data))
    Log(ret)
```

```ATAN()```函数在talib库文档中的描述为：```ATAN(Records[Close]) = Array(outReal)```

##### talib.CEIL

```
talib.CEIL(inReal)
```

```talib.CEIL()```函数用于计算**向上取整（Vector Ceil）**。

Parameters:

- `inReal` ({@struct/Record Record}结构数组 / 数值数组, required): ```inReal```参数用于指定输入的K线数据。

Returns (array): ```talib.CEIL()```函数返回一维数组。

```javascript
function main() {
    var records = exchange.GetRecords()
    var ret = talib.CEIL(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    ret = talib.CEIL(records.Close)
    Log(ret)
```

```CEIL()```函数在talib库文档中的描述为：```CEIL(Records[Close]) = Array(outReal)```

##### talib.COS

```
talib.COS(inReal)
```

```talib.COS()```函数用于计算**Vector Trigonometric Cos（向量三角余弦函数）**。

Parameters:

- `inReal` ({@struct/Record Record}结构数组 / 数值数组, required): ```inReal```参数用于指定输入的实数数据序列。

Returns (array): ```talib.COS()```函数返回一个包含余弦计算结果的一维数组。

```javascript
function main() {
    var data = [-3.14, 0, 3.14]
    var ret = talib.COS(data)
    Log(ret)
}
```

```python
import talib
import numpy as np
def main():
    data = [-3.14, 0, 3.14]
    ret = talib.COS(np.array(data))
    Log(ret)
```

```COS()```函数在talib库文档中的描述为：```COS(Records[Close]) = Array(outReal)```

##### talib.COSH

```
talib.COSH(inReal)
```

```talib.COSH()```函数用于计算**向量三角双曲余弦值（Vector Trigonometric Cosh）**。

Parameters:

- `inReal` ({@struct/Record Record}结构数组 / 数值数组, required): ```inReal```参数用于指定输入的K线数据。

Returns (array): ```talib.COSH()```函数返回一维数组，包含计算得出的双曲余弦值。

```javascript
function main() {
    var data = [-1, 0, 1]
    var ret = talib.COSH(data)
    Log(ret)
}
```

```python
import talib
import numpy as np
def main():
    data = [-1.0, 0, 1.0]
    ret = talib.COSH(np.array(data))
    Log(ret)
```

```COSH()```函数在talib库文档中的描述为：```COSH(Records[Close]) = Array(outReal)```

##### talib.EXP

```
talib.EXP(inReal)
```

```talib.EXP()```函数用于计算**向量算术指数函数（Vector Arithmetic Exp）**。

Parameters:

- `inReal` ({@struct/Record Record}结构数组 / 数值数组, required): ```inReal```参数用于指定输入的实数数据。

Returns (array): ```talib.EXP()```函数返回一维数组，包含输入数据的指数计算结果。

```javascript
function main() {
    var data = [0, 1, 2]
    var ret = talib.EXP(data)    // e^0, e^1, e^2
    Log(ret)
}
```

```python
import talib
import numpy as np
def main():
    data = [0, 1.0, 2.0]
    ret = talib.EXP(np.array(data))
    Log(ret)
```

```EXP()```函数在talib库文档中的描述为：```EXP(Records[Close]) = Array(outReal)```

##### talib.FLOOR

```
talib.FLOOR(inReal)
```

```talib.FLOOR()```函数用于计算**向量向下取整（Vector Floor）**。

Parameters:

- `inReal` ({@struct/Record Record}结构数组 / 数值数组, required): ```inReal```参数用于指定输入的K线数据。

Returns (array): ```talib.FLOOR()```函数返回一维数组。

```javascript
function main() {
    var records = exchange.GetRecords()
    var ret = talib.FLOOR(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    ret = talib.FLOOR(records.Close)
    Log(ret)
```

```FLOOR()```函数在talib库文档中的描述为：```FLOOR(Records[Close]) = Array(outReal)```

##### talib.LN

```
talib.LN(inReal)
```

```talib.LN()```函数用于计算**向量自然对数（Vector Log Natural）**。

Parameters:

- `inReal` ({@struct/Record Record}结构数组 / 数值数组, required): ```inReal```参数用于指定输入的K线数据。

Returns (array): ```talib.LN()```函数返回一维数组。

```javascript
function main() {
    var data = [1, 2, 3]
    var ret = talib.LN(data)
    Log(ret)
}
```

```python
import talib
import numpy as np
def main():
    data = [1.0, 2.0, 3.0]
    ret = talib.LN(np.array(data))
    Log(ret)
```

```LN()```函数在talib库文档中的描述为：```LN(Records[Close]) = Array(outReal)```

##### talib.LOG10

```
talib.LOG10(inReal)
```

```talib.LOG10()```函数用于计算**Vector Log10（对数函数）**。

Parameters:

- `inReal` ({@struct/Record Record}结构数组 / 数值数组, required): ```inReal```参数用于指定K线数据。

Returns (array): ```talib.LOG10()```函数的返回值为一维数组。

```javascript
function main() {
    var data = [10, 100, 1000]
    var ret = talib.LOG10(data)
    Log(ret)
}
```

```python
import talib
import numpy as np
def main():
    data = [10.0, 100.0, 1000.0]
    ret = talib.LOG10(np.array(data))
    Log(ret)
```

```LOG10()```函数在talib库文档中的描述为：```LOG10(Records[Close]) = Array(outReal)```

##### talib.SIN

```
talib.SIN(inReal)
```

```talib.SIN()```函数用于计算**Vector Trigonometric Sin（正弦值）**。

Parameters:

- `inReal` ({@struct/Record Record}结构数组 / 数值数组, required): ```inReal```参数用于指定K线数据。

Returns (array): ```talib.SIN()```函数返回一维数组。

```javascript
function main() {
    var data = [-3.14/2, 0, 3.14/2]
    var ret = talib.SIN(data)
    Log(ret)
}
```

```python
import talib
import numpy as np
def main():
    data = [-3.14/2, 0, 3.14/2]
    ret = talib.SIN(np.array(data))
    Log(ret)
```

```SIN()```函数在talib库文档中的描述为：```SIN(Records[Close]) = Array(outReal)```

##### talib.SINH

```
talib.SINH(inReal)
```

```talib.SINH()```函数用于计算**向量三角双曲正弦函数（Vector Trigonometric Sinh）**。

Parameters:

- `inReal` ({@struct/Record Record}结构数组 / 数值数组, required): ```inReal```参数用于指定输入的实数数据。

Returns (array): ```talib.SINH()```函数返回一维数组，包含计算得出的双曲正弦值。

```javascript
function main() {
    var data = [-1, 0, 1]
    var ret = talib.SINH(data)
    Log(ret)
}
```

```python
import talib
import numpy as np
def main():
    data = [-1.0, 0, 1.0]
    ret = talib.SINH(np.array(data))
    Log(ret)
```

```SINH()```函数在talib库文档中的描述为：```SINH(Records[Close]) = Array(outReal)```

##### talib.SQRT

```
talib.SQRT(inReal)
```

```talib.SQRT()```函数用于计算**向量平方根（Vector Square Root）**。

Parameters:

- `inReal` ({@struct/Record Record}结构数组 / 数值数组, required): ```inReal```参数用于指定输入的数值数据。

Returns (array): ```talib.SQRT()```函数返回一维数组，包含输入数据的平方根值。

```javascript
function main() {
    var data = [4, 64, 100]
    var ret = talib.SQRT(data)
    Log(ret)
}
```

```python
import talib
import numpy as np
def main():
    data = [4.0, 64.0, 100.0]
    ret = talib.SQRT(np.array(data))
    Log(ret)
```

```SQRT()```函数在talib库文档中的描述为：```SQRT(Records[Close]) = Array(outReal)```

##### talib.TAN

```
talib.TAN(inReal)
```

```talib.TAN()```函数用于计算**向量三角正切值（Vector Trigonometric Tan）**。

Parameters:

- `inReal` ({@struct/Record Record}结构数组 / 数值数组, required): ```inReal```参数用于指定输入的K线数据。

Returns (array): ```talib.TAN()```函数返回一维数组。

```javascript
function main() {
    var data = [-1, 0, 1]
    var ret = talib.TAN(data)
    Log(ret)
}
```

```python
import talib
import numpy as np
def main():
    data = [-1.0, 0, 1.0]
    ret = talib.TAN(np.array(data))
    Log(ret)
```

```TAN()```函数在talib库文档中的描述为：```TAN(Records[Close]) = Array(outReal)```

##### talib.TANH

```
talib.TANH(inReal)
```

```talib.TANH()```函数用于计算**向量三角双曲正切函数（Vector Trigonometric Tanh）**。

Parameters:

- `inReal` ({@struct/Record Record}结构数组 / 数值数组, required): ```inReal```参数用于指定输入的实数数据序列。

Returns (array): ```talib.TANH()```函数返回一个包含双曲正切计算结果的一维数组。

```javascript
function main() {
    var data = [-1, 0, 1]
    var ret = talib.TANH(data)
    Log(ret)
}
```

```python
import talib
import numpy as np
def main():
    data = [-1.0, 0, 1.0]
    ret = talib.TANH(np.array(data))
    Log(ret)
```

```TANH()```函数在talib库文档中的描述为：```TANH(Records[Close]) = Array(outReal)```

#### MathOperators

数学运算：区间最大值、最小值及其位置、求和。

##### talib.MAX

```
talib.MAX(inReal)
talib.MAX(inReal, optInTimePeriod)
```

```talib.MAX()```函数用于计算**指定周期内的最大值（Highest value over a specified period）**。

Parameters:

- `inReal` ({@struct/Record Record}结构数组 / 数值数组, required): ```inReal```参数用于指定K线数据。
- `optInTimePeriod` (number, optional): ```optInTimePeriod```参数用于设置计算周期，默认值为30。

Returns (array): ```talib.MAX()```函数返回一维数组。

```javascript
function main() {
    var records = exchange.GetRecords()
    var ret = talib.MAX(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    ret = talib.MAX(records.Close)
    Log(ret)
```

```MAX()```函数在talib库文档中的描述为：```MAX(Records[Close],Time Period = 30) = Array(outReal)```

##### talib.MAXINDEX

```
talib.MAXINDEX(inReal)
talib.MAXINDEX(inReal, optInTimePeriod)
```

```talib.MAXINDEX()```函数用于计算**指定周期内最大值的索引位置（Index of highest value over a specified period）**。

Parameters:

- `inReal` ({@struct/Record Record}结构数组 / 数值数组, required): ```inReal```参数用于指定输入的K线数据。
- `optInTimePeriod` (number, optional): ```optInTimePeriod```参数用于设置计算周期，默认值为30。

Returns (array): ```talib.MAXINDEX()```函数返回一个一维数组，包含指定周期内最大值的索引位置。

```javascript
function main() {
    var records = exchange.GetRecords()
    var ret = talib.MAXINDEX(records, 5)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    ret = talib.MAXINDEX(records.Close, 5)
    Log(ret)
```

```MAXINDEX()```函数在talib库文档中的描述为：```MAXINDEX(Records[Close],Time Period = 30) = Array(outInteger)```

##### talib.MIN

```
talib.MIN(inReal)
talib.MIN(inReal, optInTimePeriod)
```

```talib.MIN()```函数用于计算**指定周期内的最小值（Lowest value over a specified period）**。

Parameters:

- `inReal` ({@struct/Record Record}结构数组 / 数值数组, required): ```inReal```参数用于指定K线数据。
- `optInTimePeriod` (number, optional): ```optInTimePeriod```参数用于设置计算周期，默认值为30。

Returns (array): ```talib.MIN()```函数返回一维数组。

```javascript
function main() {
    var records = exchange.GetRecords()
    var ret = talib.MIN(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    ret = talib.MIN(records.Close)
    Log(ret)
```

```MIN()```函数在talib库文档中的描述为：```MIN(Records[Close],Time Period = 30) = Array(outReal)```

##### talib.MININDEX

```
talib.MININDEX(inReal)
talib.MININDEX(inReal, optInTimePeriod)
```

```talib.MININDEX()```函数用于计算**指定周期内最小值的索引位置（Index of lowest value over a specified period）**。

Parameters:

- `inReal` ({@struct/Record Record}结构数组 / 数值数组, required): ```inReal```参数用于指定输入的K线数据。
- `optInTimePeriod` (number, optional): ```optInTimePeriod```参数用于设置计算周期，默认值为30。

Returns (array): ```talib.MININDEX()```函数返回一个一维数组，包含指定周期内最小值的索引位置。

```javascript
function main() {
    var records = exchange.GetRecords()
    var ret = talib.MININDEX(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    ret = talib.MININDEX(records.Close)
    Log(ret)
```

```MININDEX()```函数在talib库文档中的描述为：```MININDEX(Records[Close],Time Period = 30) = Array(outInteger)```

##### talib.MINMAX

```
talib.MINMAX(inReal)
talib.MINMAX(inReal, optInTimePeriod)
```

```talib.MINMAX()```函数用于计算**指定周期内的最小值和最大值（Lowest and highest values over a specified period）**。

Parameters:

- `inReal` ({@struct/Record Record}结构数组 / 数值数组, required): ```inReal```参数用于指定输入的K线数据。
- `optInTimePeriod` (number, optional): ```optInTimePeriod```参数用于设置计算周期，默认值为30。

Returns (array): ```talib.MINMAX()```函数返回一个二维数组。该二维数组的第一个元素为最小值数组，第二个元素为最大值数组。

```javascript
function main() {
    var records = exchange.GetRecords()
    var ret = talib.MINMAX(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    ret = talib.MINMAX(records.Close)
    Log(ret)
```

```MINMAX()```函数在talib库文档中的描述为：```MINMAX(Records[Close],Time Period = 30) = [Array(outMin),Array(outMax)]```

##### talib.MINMAXINDEX

```
talib.MINMAXINDEX(inReal)
talib.MINMAXINDEX(inReal, optInTimePeriod)
```

```talib.MINMAXINDEX()```函数用于计算**指定周期内最低值和最高值的索引位置（Indexes of lowest and highest values over a specified period）**。

Parameters:

- `inReal` ({@struct/Record Record}结构数组 / 数值数组, required): ```inReal```参数用于指定输入的K线数据。
- `optInTimePeriod` (number, optional): ```optInTimePeriod```参数用于设置计算周期，默认值为30。

Returns (array): ```talib.MINMAXINDEX()```函数返回一个二维数组。该数组的第一个元素为最小值索引数组，第二个元素为最大值索引数组。

```javascript
function main() {
    var records = exchange.GetRecords()
    var ret = talib.MINMAXINDEX(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    ret = talib.MINMAXINDEX(records.Close)
    Log(ret)
```

```MINMAXINDEX()```函数在talib库文档中的描述为：```MINMAXINDEX(Records[Close],Time Period = 30) = [Array(outMinIdx),Array(outMaxIdx)]```

##### talib.SUM

```
talib.SUM(inReal)
talib.SUM(inReal, optInTimePeriod)
```

```talib.SUM()```函数用于计算**求和（Summation）**。

Parameters:

- `inReal` ({@struct/Record Record}结构数组 / 数值数组, required): ```inReal```参数用于指定K线数据。
- `optInTimePeriod` (number, optional): ```optInTimePeriod```参数用于设置计算周期，默认值为30。

Returns (array): ```talib.SUM()```函数返回一维数组。

```javascript
function main() {
    var records = exchange.GetRecords()
    var ret = talib.SUM(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    ret = talib.SUM(records.Close)
    Log(ret)
```

```SUM()```函数在talib库文档中的描述为：```SUM(Records[Close],Time Period = 30) = Array(outReal)```

#### PatternRecognition

K线形态识别：出现形态时返回非零值（正数为看涨形态、负数为看跌形态），否则返回0。

##### talib.CDL2CROWS

```
talib.CDL2CROWS(inPriceOHLC)
```

```talib.CDL2CROWS()```函数用于计算**Two Crows（K线形态--两只乌鸦）**。

Parameters:

- `inPriceOHLC` ({@struct/Record Record}结构数组, required): ```inPriceOHLC```参数用于指定K线数据。

Returns (array): ```talib.CDL2CROWS()```函数返回一维数组。

```javascript
function main() {
    var records = exchange.GetRecords()
    var ret = talib.CDL2CROWS(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    ret = talib.CDL2CROWS(records.Open, records.High, records.Low, records.Close)
    Log(ret)
```

```CDL2CROWS()```函数在talib库文档中的描述为：```CDL2CROWS(Records[Open,High,Low,Close]) = Array(outInteger)```

对于```Python```语言中的调用，传参方式有所不同，需要根据上述描述中的：```Records[Open,High,Low,Close]```进行传参。

例如，将一个变量```records```（即参数```inPriceOHLC```，类型为`Record`结构数组）拆分为：

```Open```列表：在Python中表示为```records.Open```。

```High```列表：在Python中表示为```records.High```。

```Low```列表：在Python中表示为```records.Low```。

```Close```列表：在Python中表示为```records.Close```。

Python策略代码中的调用方式：

```

talib.CDL2CROWS(records.Open, records.High, records.Low, records.Close)

```

其他```talib```指标的调用方式与此类似，不再赘述。

##### talib.CDL3BLACKCROWS

```
talib.CDL3BLACKCROWS(inPriceOHLC)
```

```talib.CDL3BLACKCROWS()```函数用于计算**Three Black Crows（K线图形态--三只黑乌鸦）**。

Parameters:

- `inPriceOHLC` ({@struct/Record Record}结构数组, required): ```inPriceOHLC```参数用于指定K线数据。

Returns (array): ```talib.CDL3BLACKCROWS()```函数返回一维数组。

```javascript
function main() {
    var records = exchange.GetRecords()
    var ret = talib.CDL3BLACKCROWS(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    ret = talib.CDL3BLACKCROWS(records.Open, records.High, records.Low, records.Close)
    Log(ret)
```

```CDL3BLACKCROWS()```函数在talib库文档中的描述为：```CDL3BLACKCROWS(Records[Open,High,Low,Close]) = Array(outInteger)```

##### talib.CDL3INSIDE

```
talib.CDL3INSIDE(inPriceOHLC)
```

```talib.CDL3INSIDE()```函数用于计算**Three Inside Up/Down（K线形态：三内上下震荡）**。

Parameters:

- `inPriceOHLC` ({@struct/Record Record}结构数组, required): ```inPriceOHLC```参数用于指定K线数据。

Returns (array): ```talib.CDL3INSIDE()```函数返回一维数组。

```javascript
function main() {
    var records = exchange.GetRecords()
    var ret = talib.CDL3INSIDE(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    ret = talib.CDL3INSIDE(records.Open, records.High, records.Low, records.Close)
    Log(ret)
```

```CDL3INSIDE()```函数在talib库文档中的描述为：```CDL3INSIDE(Records[Open,High,Low,Close]) = Array(outInteger)```

##### talib.CDL3LINESTRIKE

```
talib.CDL3LINESTRIKE(inPriceOHLC)
```

```talib.CDL3LINESTRIKE()```函数用于计算**Three-Line Strike（K线图：三线震荡）**。

Parameters:

- `inPriceOHLC` ({@struct/Record Record}结构数组, required): ```inPriceOHLC```参数用于指定K线数据。

Returns (array): ```talib.CDL3LINESTRIKE()```函数返回一维数组。

```javascript
function main() {
    var records = exchange.GetRecords()
    var ret = talib.CDL3LINESTRIKE(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    ret = talib.CDL3LINESTRIKE(records.Open, records.High, records.Low, records.Close)
    Log(ret)
```

```CDL3LINESTRIKE()```函数在talib库文档中的描述为：```CDL3LINESTRIKE(Records[Open,High,Low,Close]) = Array(outInteger)```

##### talib.CDL3OUTSIDE

```
talib.CDL3OUTSIDE(inPriceOHLC)
```

```talib.CDL3OUTSIDE()```函数用于计算**Three Outside Up/Down（K线形态：三外包线）**。

Parameters:

- `inPriceOHLC` ({@struct/Record Record}结构数组, required): ```inPriceOHLC```参数用于指定K线数据。

Returns (array): ```talib.CDL3OUTSIDE()```函数返回一维数组。

```javascript
function main() {
    var records = exchange.GetRecords()
    var ret = talib.CDL3OUTSIDE(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    ret = talib.CDL3OUTSIDE(records.Open, records.High, records.Low, records.Close)
    Log(ret)
```

```CDL3OUTSIDE()```函数在talib库文档中的描述为：```CDL3OUTSIDE(Records[Open,High,Low,Close]) = Array(outInteger)```

##### talib.CDL3STARSINSOUTH

```
talib.CDL3STARSINSOUTH(inPriceOHLC)
```

```talib.CDL3STARSINSOUTH()```函数用于计算**Three Stars In The South（K线形态：南方三星）**。

Parameters:

- `inPriceOHLC` ({@struct/Record Record}结构数组, required): ```inPriceOHLC```参数用于指定K线数据。

Returns (array): ```talib.CDL3STARSINSOUTH()```函数返回一维数组。

```javascript
function main() {
    var records = exchange.GetRecords()
    var ret = talib.CDL3STARSINSOUTH(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    ret = talib.CDL3STARSINSOUTH(records.Open, records.High, records.Low, records.Close)
    Log(ret)
```

```CDL3STARSINSOUTH()```函数在talib库文档中的描述为：```CDL3STARSINSOUTH(Records[Open,High,Low,Close]) = Array(outInteger)```

##### talib.CDL3WHITESOLDIERS

```
talib.CDL3WHITESOLDIERS(inPriceOHLC)
```

```talib.CDL3WHITESOLDIERS()```函数用于计算**Three Advancing White Soldiers（K线形态：三白兵）**。

Parameters:

- `inPriceOHLC` ({@struct/Record Record}结构数组, required): ```inPriceOHLC```参数用于指定K线数据。

Returns (array): ```talib.CDL3WHITESOLDIERS()```函数返回一维数组。

```javascript
function main() {
    var records = exchange.GetRecords()
    var ret = talib.CDL3WHITESOLDIERS(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    ret = talib.CDL3WHITESOLDIERS(records.Open, records.High, records.Low, records.Close)
    Log(ret)
```

```CDL3WHITESOLDIERS()```函数在talib库文档中的描述为：```CDL3WHITESOLDIERS(Records[Open,High,Low,Close]) = Array(outInteger)```

##### talib.CDLABANDONEDBABY

```
talib.CDLABANDONEDBABY(inPriceOHLC)
talib.CDLABANDONEDBABY(inPriceOHLC, optInPenetration)
```

```talib.CDLABANDONEDBABY()```函数用于计算**弃婴形态（K线图：Abandoned Baby）**。

Parameters:

- `inPriceOHLC` ({@struct/Record Record}结构数组, required): ```inPriceOHLC```参数用于指定K线数据。
- `optInPenetration` (number, optional): ```optInPenetration```参数用于设置穿透度，默认值为0.3。

Returns (array): ```talib.CDLABANDONEDBABY()```函数返回一维数组。

```javascript
function main() {
    var records = exchange.GetRecords()
    var ret = talib.CDLABANDONEDBABY(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    ret = talib.CDLABANDONEDBABY(records.Open, records.High, records.Low, records.Close)
    Log(ret)
```

```CDLABANDONEDBABY()```函数在talib库文档中的描述为：```CDLABANDONEDBABY(Records[Open,High,Low,Close],Penetration = 0.3) = Array(outInteger)```

##### talib.CDLADVANCEBLOCK

```
talib.CDLADVANCEBLOCK(inPriceOHLC)
```

```talib.CDLADVANCEBLOCK()```函数用于计算**Advance Block（K线形态：推进阻挡）**。

Parameters:

- `inPriceOHLC` ({@struct/Record Record}结构数组, required): ```inPriceOHLC```参数用于指定K线数据。

Returns (array): ```talib.CDLADVANCEBLOCK()```函数返回一维数组。

```javascript
function main() {
    var records = exchange.GetRecords()
    var ret = talib.CDLADVANCEBLOCK(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    ret = talib.CDLADVANCEBLOCK(records.Open, records.High, records.Low, records.Close)
    Log(ret)
```

```CDLADVANCEBLOCK()```函数在talib库文档中的描述为：```CDLADVANCEBLOCK(Records[Open,High,Low,Close]) = Array(outInteger)```

##### talib.CDLBELTHOLD

```
talib.CDLBELTHOLD(inPriceOHLC)
```

```talib.CDLBELTHOLD()```函数用于计算**Belt-hold（K线形态：腰带线）**。

Parameters:

- `inPriceOHLC` ({@struct/Record Record}结构数组, required): ```inPriceOHLC```参数用于指定K线数据。

Returns (array): ```talib.CDLBELTHOLD()```函数返回一维数组。

```javascript
function main() {
    var records = exchange.GetRecords()
    var ret = talib.CDLBELTHOLD(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    ret = talib.CDLBELTHOLD(records.Open, records.High, records.Low, records.Close)
    Log(ret)
```

```CDLBELTHOLD()```函数在talib库文档中的描述为：```CDLBELTHOLD(Records[Open,High,Low,Close]) = Array(outInteger)```

##### talib.CDLBREAKAWAY

```
talib.CDLBREAKAWAY(inPriceOHLC)
```

```talib.CDLBREAKAWAY()```函数用于计算**Breakaway（K线形态：分离形态）**。

Parameters:

- `inPriceOHLC` ({@struct/Record Record}结构数组, required): ```inPriceOHLC```参数用于指定K线数据。

Returns (array): ```talib.CDLBREAKAWAY()```函数返回一维数组。

```javascript
function main() {
    var records = exchange.GetRecords()
    var ret = talib.CDLBREAKAWAY(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    ret = talib.CDLBREAKAWAY(records.Open, records.High, records.Low, records.Close)
    Log(ret)
```

```CDLBREAKAWAY()```函数在talib库文档中的描述为：```CDLBREAKAWAY(Records[Open,High,Low,Close]) = Array(outInteger)```

##### talib.CDLCLOSINGMARUBOZU

```
talib.CDLCLOSINGMARUBOZU(inPriceOHLC)
```

```talib.CDLCLOSINGMARUBOZU()```函数用于计算**收盘光头光脚线（Closing Marubozu）**K线形态。

Parameters:

- `inPriceOHLC` ({@struct/Record Record}结构数组, required): ```inPriceOHLC```参数用于指定K线数据。

Returns (array): ```talib.CDLCLOSINGMARUBOZU()```函数返回一维数组。

```javascript
function main() {
    var records = exchange.GetRecords()
    var ret = talib.CDLCLOSINGMARUBOZU(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    ret = talib.CDLCLOSINGMARUBOZU(records.Open, records.High, records.Low, records.Close)
    Log(ret)
```

```CDLCLOSINGMARUBOZU()```函数在talib库文档中的描述为：```CDLCLOSINGMARUBOZU(Records[Open,High,Low,Close]) = Array(outInteger)```

##### talib.CDLCONCEALBABYSWALL

```
talib.CDLCONCEALBABYSWALL(inPriceOHLC)
```

```talib.CDLCONCEALBABYSWALL()```函数用于计算**Concealing Baby Swallow（K线图：藏婴吞没形态）**。

Parameters:

- `inPriceOHLC` ({@struct/Record Record}结构数组, required): ```inPriceOHLC```参数用于指定K线数据。

Returns (array): ```talib.CDLCONCEALBABYSWALL()```函数返回一维数组。

```javascript
function main() {
    var records = exchange.GetRecords()
    var ret = talib.CDLCONCEALBABYSWALL(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    ret = talib.CDLCONCEALBABYSWALL(records.Open, records.High, records.Low, records.Close)
    Log(ret)
```

```CDLCONCEALBABYSWALL()```函数在talib库文档中的描述为：```CDLCONCEALBABYSWALL(Records[Open,High,Low,Close]) = Array(outInteger)```

##### talib.CDLCOUNTERATTACK

```
talib.CDLCOUNTERATTACK(inPriceOHLC)
```

```talib.CDLCOUNTERATTACK()```函数用于计算**反击线形态（K线图：反击）**。

Parameters:

- `inPriceOHLC` ({@struct/Record Record}结构数组, required): ```inPriceOHLC```参数用于指定K线数据。

Returns (array): ```talib.CDLCOUNTERATTACK()```函数返回一维数组。

```javascript
function main() {
    var records = exchange.GetRecords()
    var ret = talib.CDLCOUNTERATTACK(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    ret = talib.CDLCOUNTERATTACK(records.Open, records.High, records.Low, records.Close)
    Log(ret)
```

```CDLCOUNTERATTACK()```函数在talib库文档中的描述为：```CDLCOUNTERATTACK(Records[Open,High,Low,Close]) = Array(outInteger)```

##### talib.CDLDARKCLOUDCOVER

```
talib.CDLDARKCLOUDCOVER(inPriceOHLC)
talib.CDLDARKCLOUDCOVER(inPriceOHLC, optInPenetration)
```

```talib.CDLDARKCLOUDCOVER()```函数用于计算**乌云盖顶（Dark Cloud Cover）K线形态**。

Parameters:

- `inPriceOHLC` ({@struct/Record Record}结构数组, required): ```inPriceOHLC```参数用于指定K线数据。
- `optInPenetration` (number, optional): ```optInPenetration```参数用于设置穿透比例，默认值为0.5。

Returns (array): ```talib.CDLDARKCLOUDCOVER()```函数返回一维数组。

```javascript
function main() {
    var records = exchange.GetRecords()
    var ret = talib.CDLDARKCLOUDCOVER(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    ret = talib.CDLDARKCLOUDCOVER(records.Open, records.High, records.Low, records.Close)
    Log(ret)
```

```CDLDARKCLOUDCOVER()```函数在talib库文档中的描述为：```CDLDARKCLOUDCOVER(Records[Open,High,Low,Close],Penetration = 0.5) = Array(outInteger)```

##### talib.CDLDOJI

```
talib.CDLDOJI(inPriceOHLC)
```

```talib.CDLDOJI()```函数用于计算**Doji（K线图：十字星）**。

Parameters:

- `inPriceOHLC` ({@struct/Record Record}结构数组, required): ```inPriceOHLC```参数用于指定K线数据。

Returns (array): ```talib.CDLDOJI()```函数返回一维数组。

```javascript
function main() {
    var records = exchange.GetRecords()
    var ret = talib.CDLDOJI(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    ret = talib.CDLDOJI(records.Open, records.High, records.Low, records.Close)
    Log(ret)
```

```CDLDOJI()```函数在talib库文档中的描述为：```CDLDOJI(Records[Open,High,Low,Close]) = Array(outInteger)```

##### talib.CDLDOJISTAR

```
talib.CDLDOJISTAR(inPriceOHLC)
```

```talib.CDLDOJISTAR()```函数用于计算**Doji Star（K线图：十字星）**。

Parameters:

- `inPriceOHLC` ({@struct/Record Record}结构数组, required): ```inPriceOHLC```参数用于指定K线数据。

Returns (array): ```talib.CDLDOJISTAR()```函数返回一维数组。

```javascript
function main() {
    var records = exchange.GetRecords()
    var ret = talib.CDLDOJISTAR(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    ret = talib.CDLDOJISTAR(records.Open, records.High, records.Low, records.Close)
    Log(ret)
```

```CDLDOJISTAR()```函数在talib库文档中的描述为：```CDLDOJISTAR(Records[Open,High,Low,Close]) = Array(outInteger)```

##### talib.CDLDRAGONFLYDOJI

```
talib.CDLDRAGONFLYDOJI(inPriceOHLC)
```

```talib.CDLDRAGONFLYDOJI()```函数用于计算**Dragonfly Doji（K线形态：蜻蜓十字星）**。

Parameters:

- `inPriceOHLC` ({@struct/Record Record}结构数组, required): ```inPriceOHLC```参数用于指定K线数据。

Returns (array): ```talib.CDLDRAGONFLYDOJI()```函数返回一维数组。

```javascript
function main() {
    var records = exchange.GetRecords()
    var ret = talib.CDLDRAGONFLYDOJI(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    ret = talib.CDLDRAGONFLYDOJI(records.Open, records.High, records.Low, records.Close)
    Log(ret)
```

```CDLDRAGONFLYDOJI()```函数在talib库文档中的描述为：```CDLDRAGONFLYDOJI(Records[Open,High,Low,Close]) = Array(outInteger)```

##### talib.CDLENGULFING

```
talib.CDLENGULFING(inPriceOHLC)
```

```talib.CDLENGULFING()```函数用于计算**吞没形态（Engulfing Pattern）**。

Parameters:

- `inPriceOHLC` ({@struct/Record Record}结构数组, required): ```inPriceOHLC```参数用于指定K线数据。

Returns (array): ```talib.CDLENGULFING()```函数返回一维数组。

```javascript
function main() {
    var records = exchange.GetRecords()
    var ret = talib.CDLENGULFING(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    ret = talib.CDLENGULFING(records.Open, records.High, records.Low, records.Close)
    Log(ret)
```

```CDLENGULFING()```函数在talib库文档中的描述为：```CDLENGULFING(Records[Open,High,Low,Close]) = Array(outInteger)```

##### talib.CDLEVENINGDOJISTAR

```
talib.CDLEVENINGDOJISTAR(inPriceOHLC)
talib.CDLEVENINGDOJISTAR(inPriceOHLC, optInPenetration)
```

```talib.CDLEVENINGDOJISTAR()```函数用于计算**Evening Doji Star（K线形态：黄昏十字星）**。

Parameters:

- `inPriceOHLC` ({@struct/Record Record}结构数组, required): ```inPriceOHLC```参数用于指定K线数据。
- `optInPenetration` (number, optional): ```optInPenetration```参数用于设置穿透率，默认值为0.3。

Returns (array): ```talib.CDLEVENINGDOJISTAR()```函数返回一维数组。

```javascript
function main() {
    var records = exchange.GetRecords()
    var ret = talib.CDLEVENINGDOJISTAR(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    ret = talib.CDLEVENINGDOJISTAR(records.Open, records.High, records.Low, records.Close)
    Log(ret)
```

```CDLEVENINGDOJISTAR()```函数在talib库文档中的描述为：```CDLEVENINGDOJISTAR(Records[Open,High,Low,Close],Penetration = 0.3) = Array(outInteger)```

##### talib.CDLEVENINGSTAR

```
talib.CDLEVENINGSTAR(inPriceOHLC)
talib.CDLEVENINGSTAR(inPriceOHLC, optInPenetration)
```

```talib.CDLEVENINGSTAR()```函数用于计算**Evening Star（K线图：黄昏之星）**形态。

Parameters:

- `inPriceOHLC` ({@struct/Record Record}结构数组, required): ```inPriceOHLC```参数用于指定K线数据。
- `optInPenetration` (number, optional): ```optInPenetration```参数用于设置穿透度（Penetration），默认值为0.3。

Returns (array): ```talib.CDLEVENINGSTAR()```函数返回一维数组。

```javascript
function main() {
    var records = exchange.GetRecords()
    var ret = talib.CDLEVENINGSTAR(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    ret = talib.CDLEVENINGSTAR(records.Open, records.High, records.Low, records.Close)
    Log(ret)
```

```CDLEVENINGSTAR()```函数在talib库文档中的描述为：```CDLEVENINGSTAR(Records[Open,High,Low,Close],Penetration = 0.3) = Array(outInteger)```

##### talib.CDLGAPSIDESIDEWHITE

```
talib.CDLGAPSIDESIDEWHITE(inPriceOHLC)
```

```talib.CDLGAPSIDESIDEWHITE()```函数用于计算**Up/Down-gap side-by-side white lines (K线图：上/下间隙并排白色线条)**。

Parameters:

- `inPriceOHLC` ({@struct/Record Record}结构数组, required): ```inPriceOHLC```参数用于指定K线数据。

Returns (array): ```talib.CDLGAPSIDESIDEWHITE()```函数返回一维数组。

```javascript
function main() {
    var records = exchange.GetRecords()
    var ret = talib.CDLGAPSIDESIDEWHITE(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    ret = talib.CDLGAPSIDESIDEWHITE(records.Open, records.High, records.Low, records.Close)
    Log(ret)
```

```CDLGAPSIDESIDEWHITE()```函数在talib库文档中的描述为：```CDLGAPSIDESIDEWHITE(Records[Open,High,Low,Close]) = Array(outInteger)```

##### talib.CDLGRAVESTONEDOJI

```
talib.CDLGRAVESTONEDOJI(inPriceOHLC)
```

```talib.CDLGRAVESTONEDOJI()```函数用于计算**墓碑十字线（Gravestone Doji）**K线形态。

Parameters:

- `inPriceOHLC` ({@struct/Record Record}结构数组, required): ```inPriceOHLC```参数用于指定K线数据。

Returns (array): ```talib.CDLGRAVESTONEDOJI()```函数返回一维数组。

```javascript
function main() {
    var records = exchange.GetRecords()
    var ret = talib.CDLGRAVESTONEDOJI(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    ret = talib.CDLGRAVESTONEDOJI(records.Open, records.High, records.Low, records.Close)
    Log(ret)
```

```CDLGRAVESTONEDOJI()```函数在talib库文档中的描述为：```CDLGRAVESTONEDOJI(Records[Open,High,Low,Close]) = Array(outInteger)```

##### talib.CDLHAMMER

```
talib.CDLHAMMER(inPriceOHLC)
```

```talib.CDLHAMMER()```函数用于计算**锤子线（K线形态：锤子）**。

Parameters:

- `inPriceOHLC` ({@struct/Record Record}结构数组, required): ```inPriceOHLC```参数用于指定K线数据。

Returns (array): ```talib.CDLHAMMER()```函数返回一维数组。

```javascript
function main() {
    var records = exchange.GetRecords()
    var ret = talib.CDLHAMMER(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    ret = talib.CDLHAMMER(records.Open, records.High, records.Low, records.Close)
    Log(ret)
```

```CDLHAMMER()```函数在talib库文档中的描述为：```CDLHAMMER(Records[Open,High,Low,Close]) = Array(outInteger)```

##### talib.CDLHANGINGMAN

```
talib.CDLHANGINGMAN(inPriceOHLC)
```

```talib.CDLHANGINGMAN()```函数用于计算**Hanging Man（K线形态：吊人线）**。

Parameters:

- `inPriceOHLC` ({@struct/Record Record}结构数组, required): ```inPriceOHLC```参数用于指定K线数据。

Returns (array): ```talib.CDLHANGINGMAN()```函数返回一维数组。

```javascript
function main() {
    var records = exchange.GetRecords()
    var ret = talib.CDLHANGINGMAN(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    ret = talib.CDLHANGINGMAN(records.Open, records.High, records.Low, records.Close)
    Log(ret)
```

```CDLHANGINGMAN()```函数在talib库文档中的描述为：```CDLHANGINGMAN(Records[Open,High,Low,Close]) = Array(outInteger)```

##### talib.CDLHARAMI

```
talib.CDLHARAMI(inPriceOHLC)
```

```talib.CDLHARAMI()```函数用于计算**Harami Pattern（K线图：阴阳线模式）**。

Parameters:

- `inPriceOHLC` ({@struct/Record Record}结构数组, required): ```inPriceOHLC```参数用于指定K线数据。

Returns (array): ```talib.CDLHARAMI()```函数返回一维数组。

```javascript
function main() {
    var records = exchange.GetRecords()
    var ret = talib.CDLHARAMI(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    ret = talib.CDLHARAMI(records.Open, records.High, records.Low, records.Close)
    Log(ret)
```

```CDLHARAMI()```函数在talib库文档中的描述为：```CDLHARAMI(Records[Open,High,Low,Close]) = Array(outInteger)```

##### talib.CDLHARAMICROSS

```
talib.CDLHARAMICROSS(inPriceOHLC)
```

```talib.CDLHARAMICROSS()```函数用于计算**Harami Cross Pattern（K线图：十字星孕线形态）**。

Parameters:

- `inPriceOHLC` ({@struct/Record Record}结构数组, required): ```inPriceOHLC```参数用于指定K线数据。

Returns (array): ```talib.CDLHARAMICROSS()```函数返回一维数组。

```javascript
function main() {
    var records = exchange.GetRecords()
    var ret = talib.CDLHARAMICROSS(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    ret = talib.CDLHARAMICROSS(records.Open, records.High, records.Low, records.Close)
    Log(ret)
```

```CDLHARAMICROSS()```函数在talib库文档中的描述为：```CDLHARAMICROSS(Records[Open,High,Low,Close]) = Array(outInteger)```

##### talib.CDLHIGHWAVE

```
talib.CDLHIGHWAVE(inPriceOHLC)
```

```talib.CDLHIGHWAVE()```函数用于计算**High-Wave Candle（K线图：长脚十字线）**。

Parameters:

- `inPriceOHLC` ({@struct/Record Record}结构数组, required): ```inPriceOHLC```参数用于指定K线数据。

Returns (array): ```talib.CDLHIGHWAVE()```函数返回一维数组。

```javascript
function main() {
    var records = exchange.GetRecords()
    var ret = talib.CDLHIGHWAVE(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    ret = talib.CDLHIGHWAVE(records.Open, records.High, records.Low, records.Close)
    Log(ret)
```

```CDLHIGHWAVE()```函数在talib库文档中的描述为：```CDLHIGHWAVE(Records[Open,High,Low,Close]) = Array(outInteger)```

##### talib.CDLHIKKAKE

```
talib.CDLHIKKAKE(inPriceOHLC)
```

```talib.CDLHIKKAKE()```函数用于计算**Hikkake Pattern（K线图：陷阱模式）**。

Parameters:

- `inPriceOHLC` ({@struct/Record Record}结构数组, required): ```inPriceOHLC```参数用于指定K线数据。

Returns (array): ```talib.CDLHIKKAKE()```函数返回一维数组。

```javascript
function main() {
    var records = exchange.GetRecords()
    var ret = talib.CDLHIKKAKE(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    ret = talib.CDLHIKKAKE(records.Open, records.High, records.Low, records.Close)
    Log(ret)
```

```CDLHIKKAKE()```函数在talib库文档中的描述为：```CDLHIKKAKE(Records[Open,High,Low,Close]) = Array(outInteger)```

##### talib.CDLHIKKAKEMOD

```
talib.CDLHIKKAKEMOD(inPriceOHLC)
```

```talib.CDLHIKKAKEMOD()```函数用于计算**Modified Hikkake Pattern（K线图：改良陷阱模式）**。

Parameters:

- `inPriceOHLC` ({@struct/Record Record}结构数组, required): ```inPriceOHLC```参数用于指定K线数据。

Returns (array): ```talib.CDLHIKKAKEMOD()```函数返回一维数组。

```javascript
function main() {
    var records = exchange.GetRecords()
    var ret = talib.CDLHIKKAKEMOD(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    ret = talib.CDLHIKKAKEMOD(records.Open, records.High, records.Low, records.Close)
    Log(ret)
```

```CDLHIKKAKEMOD()```函数在talib库文档中的描述为：```CDLHIKKAKEMOD(Records[Open,High,Low,Close]) = Array(outInteger)```

##### talib.CDLHOMINGPIGEON

```
talib.CDLHOMINGPIGEON(inPriceOHLC)
```

```talib.CDLHOMINGPIGEON()```函数用于计算**Homing Pigeon（K线形态：信鸽形态）**。

Parameters:

- `inPriceOHLC` ({@struct/Record Record}结构数组, required): ```inPriceOHLC```参数用于指定K线数据。

Returns (array): ```talib.CDLHOMINGPIGEON()```函数返回一维数组。

```javascript
function main() {
    var records = exchange.GetRecords()
    var ret = talib.CDLHOMINGPIGEON(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    ret = talib.CDLHOMINGPIGEON(records.Open, records.High, records.Low, records.Close)
    Log(ret)
```

```CDLHOMINGPIGEON()```函数在talib库文档中的描述为：```CDLHOMINGPIGEON(Records[Open,High,Low,Close]) = Array(outInteger)```

##### talib.CDLIDENTICAL3CROWS

```
talib.CDLIDENTICAL3CROWS(inPriceOHLC)
```

```talib.CDLIDENTICAL3CROWS()```函数用于计算**Identical Three Crows（K线形态：相同三只乌鸦）**。

Parameters:

- `inPriceOHLC` ({@struct/Record Record}结构数组, required): ```inPriceOHLC```参数用于指定K线数据。

Returns (array): ```talib.CDLIDENTICAL3CROWS()```函数返回一维数组。

```javascript
function main() {
    var records = exchange.GetRecords()
    var ret = talib.CDLIDENTICAL3CROWS(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    ret = talib.CDLIDENTICAL3CROWS(records.Open, records.High, records.Low, records.Close)
    Log(ret)
```

```CDLIDENTICAL3CROWS()```函数在talib库文档中的描述为：```CDLIDENTICAL3CROWS(Records[Open,High,Low,Close]) = Array(outInteger)```

##### talib.CDLINNECK

```
talib.CDLINNECK(inPriceOHLC)
```

```talib.CDLINNECK()```函数用于计算**颈内线形态（K线图：颈内线）**。

Parameters:

- `inPriceOHLC` ({@struct/Record Record}结构数组, required): ```inPriceOHLC```参数用于指定K线数据。

Returns (array): ```talib.CDLINNECK()```函数返回一维数组。

```javascript
function main() {
    var records = exchange.GetRecords()
    var ret = talib.CDLINNECK(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    ret = talib.CDLINNECK(records.Open, records.High, records.Low, records.Close)
    Log(ret)
```

```CDLINNECK()```函数在talib库文档中的描述为：```CDLINNECK(Records[Open,High,Low,Close]) = Array(outInteger)```

##### talib.CDLINVERTEDHAMMER

```
talib.CDLINVERTEDHAMMER(inPriceOHLC)
```

```talib.CDLINVERTEDHAMMER()```函数用于计算**倒锤形态（K线图：倒锤）**。

Parameters:

- `inPriceOHLC` ({@struct/Record Record}结构数组, required): ```inPriceOHLC```参数用于指定K线数据。

Returns (array): ```talib.CDLINVERTEDHAMMER()```函数返回一维数组。

```javascript
function main() {
    var records = exchange.GetRecords()
    var ret = talib.CDLINVERTEDHAMMER(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    ret = talib.CDLINVERTEDHAMMER(records.Open, records.High, records.Low, records.Close)
    Log(ret)
```

```CDLINVERTEDHAMMER()```函数在talib库文档中的描述为：```CDLINVERTEDHAMMER(Records[Open,High,Low,Close]) = Array(outInteger)```

##### talib.CDLKICKING

```
talib.CDLKICKING(inPriceOHLC)
```

```talib.CDLKICKING()```函数用于计算**Kicking（K线形态：踢腿形态）**。

Parameters:

- `inPriceOHLC` ({@struct/Record Record}结构数组, required): ```inPriceOHLC```参数用于指定K线数据。

Returns (array): ```talib.CDLKICKING()```函数返回一维数组。

```javascript
function main() {
    var records = exchange.GetRecords()
    var ret = talib.CDLKICKING(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    ret = talib.CDLKICKING(records.Open, records.High, records.Low, records.Close)
    Log(ret)
```

```CDLKICKING()```函数在talib库文档中的描述为：```CDLKICKING(Records[Open,High,Low,Close]) = Array(outInteger)```

##### talib.CDLKICKINGBYLENGTH

```
talib.CDLKICKINGBYLENGTH(inPriceOHLC)
```

```talib.CDLKICKINGBYLENGTH()```函数用于计算**Kicking - bull/bear determined by the longer marubozu (K线图：踢牛/踢熊)**。

Parameters:

- `inPriceOHLC` ({@struct/Record Record}结构数组, required): ```inPriceOHLC```参数用于指定K线数据。

Returns (array): ```talib.CDLKICKINGBYLENGTH()```函数返回一维数组。

```javascript
function main() {
    var records = exchange.GetRecords()
    var ret = talib.CDLKICKINGBYLENGTH(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    ret = talib.CDLKICKINGBYLENGTH(records.Open, records.High, records.Low, records.Close)
    Log(ret)
```

```CDLKICKINGBYLENGTH()```函数在talib库文档中的描述为：```CDLKICKINGBYLENGTH(Records[Open,High,Low,Close]) = Array(outInteger)```

##### talib.CDLLADDERBOTTOM

```
talib.CDLLADDERBOTTOM(inPriceOHLC)
```

```talib.CDLLADDERBOTTOM()```函数用于计算**Ladder Bottom（K线形态：梯底）**。

Parameters:

- `inPriceOHLC` ({@struct/Record Record}结构数组, required): ```inPriceOHLC```参数用于指定K线数据。

Returns (array): ```talib.CDLLADDERBOTTOM()```函数返回一维数组。

```javascript
function main() {
    var records = exchange.GetRecords()
    var ret = talib.CDLLADDERBOTTOM(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    ret = talib.CDLLADDERBOTTOM(records.Open, records.High, records.Low, records.Close)
    Log(ret)
```

```CDLLADDERBOTTOM()```函数在talib库文档中的描述为：```CDLLADDERBOTTOM(Records[Open,High,Low,Close]) = Array(outInteger)```

##### talib.CDLLONGLEGGEDDOJI

```
talib.CDLLONGLEGGEDDOJI(inPriceOHLC)
```

```talib.CDLLONGLEGGEDDOJI()```函数用于计算**长腿十字线（K线形态：Long Legged Doji）**。

Parameters:

- `inPriceOHLC` ({@struct/Record Record}结构数组, required): ```inPriceOHLC```参数用于指定K线数据。

Returns (array): ```talib.CDLLONGLEGGEDDOJI()```函数返回一维数组。

```javascript
function main() {
    var records = exchange.GetRecords()
    var ret = talib.CDLLONGLEGGEDDOJI(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    ret = talib.CDLLONGLEGGEDDOJI(records.Open, records.High, records.Low, records.Close)
    Log(ret)
```

```CDLLONGLEGGEDDOJI()```函数在talib库文档中的描述为：```CDLLONGLEGGEDDOJI(Records[Open,High,Low,Close]) = Array(outInteger)```

##### talib.CDLLONGLINE

```
talib.CDLLONGLINE(inPriceOHLC)
```

```talib.CDLLONGLINE()```函数用于计算**长线蜡烛形态（K线图：长线）**。

Parameters:

- `inPriceOHLC` ({@struct/Record Record}结构数组, required): ```inPriceOHLC```参数用于指定K线数据。

Returns (array): ```talib.CDLLONGLINE()```函数返回一维数组。

```javascript
function main() {
    var records = exchange.GetRecords()
    var ret = talib.CDLLONGLINE(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    ret = talib.CDLLONGLINE(records.Open, records.High, records.Low, records.Close)
    Log(ret)
```

```CDLLONGLINE()```函数在talib库文档中的描述为：```CDLLONGLINE(Records[Open,High,Low,Close]) = Array(outInteger)```

##### talib.CDLMARUBOZU

```
talib.CDLMARUBOZU(inPriceOHLC)
```

```talib.CDLMARUBOZU()```函数用于计算**Marubozu（K线图：光头光脚）**模式。

Parameters:

- `inPriceOHLC` ({@struct/Record Record}结构数组, required): ```inPriceOHLC```参数用于指定K线数据。

Returns (array): ```talib.CDLMARUBOZU()```函数返回一维数组。

```javascript
function main() {
    var records = exchange.GetRecords()
    var ret = talib.CDLMARUBOZU(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    ret = talib.CDLMARUBOZU(records.Open, records.High, records.Low, records.Close)
    Log(ret)
```

```CDLMARUBOZU()```函数在talib库文档中的描述为：```CDLMARUBOZU(Records[Open,High,Low,Close]) = Array(outInteger)```

##### talib.CDLMATCHINGLOW

```
talib.CDLMATCHINGLOW(inPriceOHLC)
```

```talib.CDLMATCHINGLOW()```函数用于计算**Matching Low（K线图：匹配低点）**。

Parameters:

- `inPriceOHLC` ({@struct/Record Record}结构数组, required): ```inPriceOHLC```参数用于指定K线数据。

Returns (array): ```talib.CDLMATCHINGLOW()```函数返回一维数组。

```javascript
function main() {
    var records = exchange.GetRecords()
    var ret = talib.CDLMATCHINGLOW(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    ret = talib.CDLMATCHINGLOW(records.Open, records.High, records.Low, records.Close)
    Log(ret)
```

```CDLMATCHINGLOW()```函数在talib库文档中的描述为：```CDLMATCHINGLOW(Records[Open,High,Low,Close]) = Array(outInteger)```

##### talib.CDLMATHOLD

```
talib.CDLMATHOLD(inPriceOHLC)
talib.CDLMATHOLD(inPriceOHLC, optInPenetration)
```

```talib.CDLMATHOLD()```函数用于计算**Mat Hold（K线形态：垫住）**。

Parameters:

- `inPriceOHLC` ({@struct/Record Record}结构数组, required): ```inPriceOHLC```参数用于指定K线数据。
- `optInPenetration` (number, optional): ```optInPenetration```参数为可选参数，用于指定上升/下降趋势线的穿透比例，默认值为0.5。

Returns (array): ```talib.CDLMATHOLD()```函数返回一维数组。

```javascript
function main() {
    var records = exchange.GetRecords()
    var ret = talib.CDLMATHOLD(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    ret = talib.CDLMATHOLD(records.Open, records.High, records.Low, records.Close)
    Log(ret)
```

```CDLMATHOLD()```函数在talib库文档中的描述为：```CDLMATHOLD(Records[Open,High,Low,Close],Penetration = 0.5) = Array(outInteger)```

##### talib.CDLMORNINGDOJISTAR

```
talib.CDLMORNINGDOJISTAR(inPriceOHLC)
talib.CDLMORNINGDOJISTAR(inPriceOHLC, optInPenetration)
```

```talib.CDLMORNINGDOJISTAR()```函数用于计算**Morning Doji Star（K线形态：早晨十字星）**。

Parameters:

- `inPriceOHLC` ({@struct/Record Record}结构数组, required): ```inPriceOHLC```参数用于指定K线数据。
- `optInPenetration` (number, optional): ```optInPenetration```参数用于指定验证开盘价与实体部分重合的程度，默认值为0.3。

Returns (array): ```talib.CDLMORNINGDOJISTAR()```函数返回一维数组。

```javascript
function main() {
    var records = exchange.GetRecords()
    var ret = talib.CDLMORNINGDOJISTAR(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    ret = talib.CDLMORNINGDOJISTAR(records.Open, records.High, records.Low, records.Close)
    Log(ret)
```

```CDLMORNINGDOJISTAR()```函数在talib库文档中的描述为：```CDLMORNINGDOJISTAR(Records[Open,High,Low,Close],Penetration = 0.3) = Array(outInteger)```

##### talib.CDLMORNINGSTAR

```
talib.CDLMORNINGSTAR(inPriceOHLC)
talib.CDLMORNINGSTAR(inPriceOHLC, optInPenetration)
```

```talib.CDLMORNINGSTAR()```函数用于计算**Morning Star（K线形态：晨星）**。

Parameters:

- `inPriceOHLC` ({@struct/Record Record}结构数组, required): ```inPriceOHLC```参数用于指定K线数据。
- `optInPenetration` (number, optional): ```optInPenetration```参数为趋势确认所需的价格穿透百分比阈值，取值范围为[0,1]，默认值为0.3。

Returns (array): ```talib.CDLMORNINGSTAR()```函数返回一维数组。

```javascript
function main() {
    var records = exchange.GetRecords()
    var ret = talib.CDLMORNINGSTAR(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    ret = talib.CDLMORNINGSTAR(records.Open, records.High, records.Low, records.Close)
    Log(ret)
```

```CDLMORNINGSTAR()```函数在talib库文档中的描述为：```CDLMORNINGSTAR(Records[Open,High,Low,Close],Penetration=0.3) = Array(outInteger)```

##### talib.CDLONNECK

```
talib.CDLONNECK(inPriceOHLC)
```

```talib.CDLONNECK()```函数用于计算**On-Neck Pattern（K线图：颈上线形态）**。

Parameters:

- `inPriceOHLC` ({@struct/Record Record}结构数组, required): ```inPriceOHLC```参数用于指定K线数据。

Returns (array): ```talib.CDLONNECK()```函数返回一维数组。

```javascript
function main() {
    var records = exchange.GetRecords()
    var ret = talib.CDLONNECK(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    ret = talib.CDLONNECK(records.Open, records.High, records.Low, records.Close)
    Log(ret)
```

```CDLONNECK()```函数在talib库文档中的描述为：```CDLONNECK(Records[Open,High,Low,Close]) = Array(outInteger)```

##### talib.CDLPIERCING

```
talib.CDLPIERCING(inPriceOHLC)
```

```talib.CDLPIERCING()```函数用于计算**Piercing Pattern（K线图：穿透形态）**。

Parameters:

- `inPriceOHLC` ({@struct/Record Record}结构数组, required): ```inPriceOHLC```参数用于指定K线数据。

Returns (array): ```talib.CDLPIERCING()```函数返回一维数组。

```javascript
function main() {
    var records = exchange.GetRecords()
    var ret = talib.CDLPIERCING(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    ret = talib.CDLPIERCING(records.Open, records.High, records.Low, records.Close)
    Log(ret)
```

```CDLPIERCING()```函数在talib库文档中的描述为：```CDLPIERCING(Records[Open,High,Low,Close]) = Array(outInteger)```

##### talib.CDLRICKSHAWMAN

```
talib.CDLRICKSHAWMAN(inPriceOHLC)
```

```talib.CDLRICKSHAWMAN()```函数用于计算**Rickshaw Man（K线形态：车夫线）**。

Parameters:

- `inPriceOHLC` ({@struct/Record Record}结构数组, required): ```inPriceOHLC```参数用于指定K线数据。

Returns (array): ```talib.CDLRICKSHAWMAN()```函数返回一维数组。

```javascript
function main() {
    var records = exchange.GetRecords()
    var ret = talib.CDLRICKSHAWMAN(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    ret = talib.CDLRICKSHAWMAN(records.Open, records.High, records.Low, records.Close)
    Log(ret)
```

```CDLRICKSHAWMAN()```函数在talib库文档中的描述为：```CDLRICKSHAWMAN(Records[Open,High,Low,Close]) = Array(outInteger)```

##### talib.CDLRISEFALL3METHODS

```
talib.CDLRISEFALL3METHODS(inPriceOHLC)
```

```talib.CDLRISEFALL3METHODS()```函数用于计算**Rising/Falling Three Methods（K线形态：上升/下降三法）**。

Parameters:

- `inPriceOHLC` ({@struct/Record Record}结构数组, required): ```inPriceOHLC```参数用于指定K线数据。

Returns (array): ```talib.CDLRISEFALL3METHODS()```函数返回一维数组。

```javascript
function main() {
    var records = exchange.GetRecords()
    var ret = talib.CDLRISEFALL3METHODS(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    ret = talib.CDLRISEFALL3METHODS(records.Open, records.High, records.Low, records.Close)
    Log(ret)
```

```CDLRISEFALL3METHODS()```函数在talib库文档中的描述为：```CDLRISEFALL3METHODS(Records[Open,High,Low,Close]) = Array(outInteger)```

##### talib.CDLSEPARATINGLINES

```
talib.CDLSEPARATINGLINES(inPriceOHLC)
```

```talib.CDLSEPARATINGLINES()```函数用于计算**分离线形态（K线图：分离线）**。

Parameters:

- `inPriceOHLC` ({@struct/Record Record}结构数组, required): ```inPriceOHLC```参数用于指定K线数据。

Returns (array): ```talib.CDLSEPARATINGLINES()```函数返回一维数组。

```javascript
function main() {
    var records = exchange.GetRecords()
    var ret = talib.CDLSEPARATINGLINES(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    ret = talib.CDLSEPARATINGLINES(records.Open, records.High, records.Low, records.Close)
    Log(ret)
```

```CDLSEPARATINGLINES()```函数在talib库文档中的描述为：```CDLSEPARATINGLINES(Records[Open,High,Low,Close]) = Array(outInteger)```

##### talib.CDLSHOOTINGSTAR

```
talib.CDLSHOOTINGSTAR(inPriceOHLC)
```

```talib.CDLSHOOTINGSTAR()```函数用于计算**Shooting Star（K线形态：流星）**。

Parameters:

- `inPriceOHLC` ({@struct/Record Record}结构数组, required): ```inPriceOHLC```参数用于指定K线数据。

Returns (array): ```talib.CDLSHOOTINGSTAR()```函数返回一维数组。

```javascript
function main() {
    var records = exchange.GetRecords()
    var ret = talib.CDLSHOOTINGSTAR(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    ret = talib.CDLSHOOTINGSTAR(records.Open, records.High, records.Low, records.Close)
    Log(ret)
```

```CDLSHOOTINGSTAR()```函数在talib库文档中的描述为：```CDLSHOOTINGSTAR(Records[Open,High,Low,Close]) = Array(outInteger)```

##### talib.CDLSHORTLINE

```
talib.CDLSHORTLINE(inPriceOHLC)
```

```talib.CDLSHORTLINE()```函数用于计算**短线蜡烛图形态（K线图：短线）**。

Parameters:

- `inPriceOHLC` ({@struct/Record Record}结构数组, required): ```inPriceOHLC```参数用于指定K线价格数据。

Returns (array): ```talib.CDLSHORTLINE()```函数返回一维数组。

```javascript
function main() {
    var records = exchange.GetRecords()
    var ret = talib.CDLSHORTLINE(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    ret = talib.CDLSHORTLINE(records.Open, records.High, records.Low, records.Close)
    Log(ret)
```

```CDLSHORTLINE()```函数在talib库文档中的描述为：```CDLSHORTLINE(Records[Open,High,Low,Close]) = Array(outInteger)```

##### talib.CDLSPINNINGTOP

```
talib.CDLSPINNINGTOP(inPriceOHLC)
```

```talib.CDLSPINNINGTOP()```函数用于计算**Spinning Top（K线形态：陀螺）**。

Parameters:

- `inPriceOHLC` ({@struct/Record Record}结构数组, required): ```inPriceOHLC```参数用于指定K线数据。

Returns (array): ```talib.CDLSPINNINGTOP()```函数返回一维数组。

```javascript
function main() {
    var records = exchange.GetRecords()
    var ret = talib.CDLSPINNINGTOP(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    ret = talib.CDLSPINNINGTOP(records.Open, records.High, records.Low, records.Close)
    Log(ret)
```

```CDLSPINNINGTOP()```函数在talib库文档中的描述为：```CDLSPINNINGTOP(Records[Open,High,Low,Close]) = Array(outInteger)```

##### talib.CDLSTALLEDPATTERN

```
talib.CDLSTALLEDPATTERN(inPriceOHLC)
```

```talib.CDLSTALLEDPATTERN()```函数用于计算**Stalled Pattern（K线图：停滞模式）**。

Parameters:

- `inPriceOHLC` ({@struct/Record Record}结构数组, required): ```inPriceOHLC```参数用于指定K线数据。

Returns (array): ```talib.CDLSTALLEDPATTERN()```函数返回一维数组。

```javascript
function main() {
    var records = exchange.GetRecords()
    var ret = talib.CDLSTALLEDPATTERN(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    ret = talib.CDLSTALLEDPATTERN(records.Open, records.High, records.Low, records.Close)
    Log(ret)
```

```CDLSTALLEDPATTERN()```函数在talib库文档中的描述为：```CDLSTALLEDPATTERN(Records[Open,High,Low,Close]) = Array(outInteger)```

##### talib.CDLSTICKSANDWICH

```
talib.CDLSTICKSANDWICH(inPriceOHLC)
```

```talib.CDLSTICKSANDWICH()```函数用于计算**Stick Sandwich（K线形态：棍子三明治）**。

Parameters:

- `inPriceOHLC` ({@struct/Record Record}结构数组, required): ```inPriceOHLC```参数用于指定K线数据。

Returns (array): ```talib.CDLSTICKSANDWICH()```函数返回一维数组。

```javascript
function main() {
    var records = exchange.GetRecords()
    var ret = talib.CDLSTICKSANDWICH(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    ret = talib.CDLSTICKSANDWICH(records.Open, records.High, records.Low, records.Close)
    Log(ret)
```

```CDLSTICKSANDWICH()```函数在talib库文档中的描述为：```CDLSTICKSANDWICH(Records[Open,High,Low,Close]) = Array(outInteger)```

##### talib.CDLTAKURI

```
talib.CDLTAKURI(inPriceOHLC)
```

```talib.CDLTAKURI()```函数用于计算**Takuri (Dragonfly Doji with very long lower shadow) (K线图:托里)**蜡烛图形态。

Parameters:

- `inPriceOHLC` ({@struct/Record Record}结构数组, required): ```inPriceOHLC```参数用于指定K线数据。

Returns (array): ```talib.CDLTAKURI()```函数返回一维数组。

```javascript
function main() {
    var records = exchange.GetRecords()
    var ret = talib.CDLTAKURI(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    ret = talib.CDLTAKURI(records.Open, records.High, records.Low, records.Close)
    Log(ret)
```

```CDLTAKURI()```函数在talib库文档中的描述为：```CDLTAKURI(Records[Open,High,Low,Close]) = Array(outInteger)```

##### talib.CDLTASUKIGAP

```
talib.CDLTASUKIGAP(inPriceOHLC)
```

```talib.CDLTASUKIGAP()```函数用于计算**Tasuki Gap（K线图：翼隙）**。

Parameters:

- `inPriceOHLC` ({@struct/Record Record}结构数组, required): ```inPriceOHLC```参数用于指定K线数据。

Returns (array): ```talib.CDLTASUKIGAP()```函数返回一维数组。

```javascript
function main() {
    var records = exchange.GetRecords()
    var ret = talib.CDLTASUKIGAP(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    ret = talib.CDLTASUKIGAP(records.Open, records.High, records.Low, records.Close)
    Log(ret)
```

```CDLTASUKIGAP()```函数在talib库文档中的描述为：```CDLTASUKIGAP(Records[Open,High,Low,Close]) = Array(outInteger)```

##### talib.CDLTHRUSTING

```
talib.CDLTHRUSTING(inPriceOHLC)
```

```talib.CDLTHRUSTING()```函数用于计算**Thrusting Pattern（K线图：推进模式）**。

Parameters:

- `inPriceOHLC` ({@struct/Record Record}结构数组, required): ```inPriceOHLC```参数用于指定K线数据。

Returns (array): ```talib.CDLTHRUSTING()```函数返回一维数组。

```javascript
function main() {
    var records = exchange.GetRecords()
    var ret = talib.CDLTHRUSTING(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    ret = talib.CDLTHRUSTING(records.Open, records.High, records.Low, records.Close)
    Log(ret)
```

```CDLTHRUSTING()```函数在talib库文档中的描述为：```CDLTHRUSTING(Records[Open,High,Low,Close]) = Array(outInteger)```

##### talib.CDLTRISTAR

```
talib.CDLTRISTAR(inPriceOHLC)
```

```talib.CDLTRISTAR()```函数用于计算**三星形态（K线图：三星模式）**。

Parameters:

- `inPriceOHLC` ({@struct/Record Record}结构数组, required): ```inPriceOHLC```参数用于指定K线数据。

Returns (array): ```talib.CDLTRISTAR()```函数返回一维数组。

```javascript
function main() {
    var records = exchange.GetRecords()
    var ret = talib.CDLTRISTAR(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    ret = talib.CDLTRISTAR(records.Open, records.High, records.Low, records.Close)
    Log(ret)
```

```CDLTRISTAR()```函数在talib库文档中的描述为：```CDLTRISTAR(Records[Open,High,Low,Close]) = Array(outInteger)```

##### talib.CDLUNIQUE3RIVER

```
talib.CDLUNIQUE3RIVER(inPriceOHLC)
```

```talib.CDLUNIQUE3RIVER()```函数用于计算**Unique 3 River（K线形态：独特三河）**。

Parameters:

- `inPriceOHLC` ({@struct/Record Record}结构数组, required): ```inPriceOHLC```参数用于指定K线数据。

Returns (array): ```talib.CDLUNIQUE3RIVER()```函数返回一维数组。

```javascript
function main() {
    var records = exchange.GetRecords()
    var ret = talib.CDLUNIQUE3RIVER(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    ret = talib.CDLUNIQUE3RIVER(records.Open, records.High, records.Low, records.Close)
    Log(ret)
```

```CDLUNIQUE3RIVER()```函数在talib库文档中的描述为：```CDLUNIQUE3RIVER(Records[Open,High,Low,Close]) = Array(outInteger)```

##### talib.CDLUPSIDEGAP2CROWS

```
talib.CDLUPSIDEGAP2CROWS(inPriceOHLC)
```

```talib.CDLUPSIDEGAP2CROWS()```函数用于计算**向上跳空双乌鸦形态（K线图：双飞乌鸦）**。

Parameters:

- `inPriceOHLC` ({@struct/Record Record}结构数组, required): ```inPriceOHLC```参数用于指定K线数据。

Returns (array): ```talib.CDLUPSIDEGAP2CROWS()```函数返回一维数组。

```javascript
function main() {
    var records = exchange.GetRecords()
    var ret = talib.CDLUPSIDEGAP2CROWS(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    ret = talib.CDLUPSIDEGAP2CROWS(records.Open, records.High, records.Low, records.Close)
    Log(ret)
```

```CDLUPSIDEGAP2CROWS()```函数在talib库文档中的描述为：```CDLUPSIDEGAP2CROWS(Records[Open,High,Low,Close]) = Array(outInteger)```

##### talib.CDLXSIDEGAP3METHODS

```
talib.CDLXSIDEGAP3METHODS(inPriceOHLC)
```

```talib.CDLXSIDEGAP3METHODS()```函数用于计算**上行/下行缺口三方法（K线形态识别）**。

Parameters:

- `inPriceOHLC` ({@struct/Record Record}结构数组, required): ```inPriceOHLC```参数用于指定K线数据。

Returns (array): ```talib.CDLXSIDEGAP3METHODS()```函数返回一维数组。

```javascript
function main() {
    var records = exchange.GetRecords()
    var ret = talib.CDLXSIDEGAP3METHODS(records)
    Log(ret)
}
```

```python
import talib
def main():
    records = exchange.GetRecords()
    ret = talib.CDLXSIDEGAP3METHODS(records.Open, records.High, records.Low, records.Close)
    Log(ret)
```

```CDLXSIDEGAP3METHODS()```函数在talib库文档中的描述为：```CDLXSIDEGAP3METHODS(Records[Open,High,Low,Close]) = Array(outInteger)```

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
  实盘默认目录为托管者目录下实盘数据库文件同级目录的```files```文件夹中，即：```/logs/storage/xxx/files```，其中```xxx```为实盘Id，托管者程序（robot）与```logs```在同一级目录。
- 回测系统环境：
  回测系统是一个沙盒环境，系统模拟一个文件目录，默认目录为：```/logs/storage/1/files```。
  当回测结束时，创建的文件内容将被清除。

#### os

os库为发明者量化交易平台提供完整的文件系统操作接口。

##### open

```
open(filename)
open(filename, mode)
```

以指定模式打开文件。

Parameters:

- `filename` (string, required): 文件名称。参数```filename```是包含文件名的路径。由于托管者与回测系统都支持```os```操作，需要注意在**非回测环境**下，文件操作被限制在托管者目录下实盘数据库文件同级目录的```files```文件夹中，因此不支持使用绝对路径操作任何文件。关于参数```filename```的这个注意事项后续不再赘述。
- `mode` (string, optional): 指定文件的打开模式。

Returns (```File```对象): ```open()```函数返回一个```File```对象，用于操作文件。

创建文件，写入数据后再读取。

```javascript
function main() {
    let fileHandle = os.open("output.txt", "w+")
    if (!fileHandle) {
        Log("Failed to open file")
        return
    }
    let bytesWritten = fileHandle.write("Hello FMZ!")
    Log("Bytes written:", bytesWritten)     // Bytes written: 10
    fileHandle.seek(0, 0)
    let fileContent = fileHandle.read()
    Log("File content read:", fileContent)  // File content read: Hello FMZ!
    fileHandle.close()
}
```

文件打开模式：

  - ```r``` : read（只读，文件必须存在）

  - ```w``` : write（只写，文件不存在则创建，存在则清空内容）

  - ```a``` : append（追加写入，文件不存在则创建，存在则写入到末尾）

  - ```+``` : 在 r/w/a 后加 + 表示既可以读也可以写（例如 "r+", "w+", "a+"）

  - ```b``` : binary（二进制模式，常用于 Windows 区分文本/二进制文件，例如 "rb", "wb"）

文件的打开/创建位于实盘数据库文件目录（xxx.db3，其中xxx为实盘Id）下的```files```文件夹中。

See also: `File`, `ListFilesResult`, `FileStat`,  `open`, `fgets`, `fputs`, `mmap`, `getRootDir`, `listFiles`, `exists`, `remove`, `mkdir`, `rmdir`, `rename`, `stat`, `exit`,

##### fgets

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
    // if (!fileHandle) {
    //     Log("Failed to open file")
    //     return
    // }
    // let objJson = {"name": "tom", "age": 18}
    // fileHandle.write(JSON.stringify(objJson))
    // fileHandle.close()

    let content = os.fgets("config.json")
    Log("Config content:", content)  // Config content: {"name":"tom","age":18}
}
```

适用于小文件的快速读取，将整个文件内容一次性加载到内存中。

如果文件不存在，```fgets()```函数会抛出错误：```InternalError: failed to open file: openat config.json: no such file or directory at main```。

See also: `File`, `ListFilesResult`, `FileStat`,  `open`, `fgets`, `fputs`, `mmap`, `getRootDir`, `listFiles`, `exists`, `remove`, `mkdir`, `rmdir`, `rename`, `stat`, `exit`,

##### fputs

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
    Log("Bytes written:", bytesWritten)                                          // Bytes written: 32
    Log(`os.fgets("strategy_config.json"):`, os.fgets("strategy_config.json"))   // os.fgets("strategy_config.json"): {"strategy": "MA", "period": 20}

    // 追加日志信息
    let logInfo = "\n[" + new Date().toISOString() + "] Config saved"
    os.fputs("strategy_config.json", logInfo, true)
    Log(`os.fgets("strategy_config.json"):`, os.fgets("strategy_config.json"))   // os.fgets("strategy_config.json"): {"strategy": "MA", "period": 20} [2025-09-08T07:20:30.563Z] Config saved
}
```

便捷的文件写入方法，默认覆盖文件内容。设置 append 为 true 可以追加到文件末尾。

See also: `File`, `ListFilesResult`, `FileStat`,  `open`, `fgets`, `fputs`, `mmap`, `getRootDir`, `listFiles`, `exists`, `remove`, `mkdir`, `rmdir`, `rename`, `stat`, `exit`,

##### mmap

```
mmap(filename)
```

内存映射文件，返回文件的二进制数据。

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
    Log("arr:",  arr)                        // arr: [72,101,108,108,111,32,70,77,90,33]
    Log("ab2str(buffer):", ab2str(buffer))   // ab2str(buffer): Hello FMZ!
}
```

适用于大文件的高效读取和处理，将文件映射到内存中并作为 ArrayBuffer 返回。

See also: `File`, `ListFilesResult`, `FileStat`,  `open`, `fgets`, `fputs`, `mmap`, `getRootDir`, `listFiles`, `exists`, `remove`, `mkdir`, `rmdir`, `rename`, `stat`, `exit`,

##### getRootDir

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

See also: `File`, `ListFilesResult`, `FileStat`,  `open`, `fgets`, `fputs`, `mmap`, `getRootDir`, `listFiles`, `exists`, `remove`, `mkdir`, `rmdir`, `rename`, `stat`, `exit`,

##### listFiles

```
listFiles()
listFiles(pattern)
```

列出指定目录中的文件和子目录。

Parameters:

- `pattern` (string, optional): 可选的匹配模式，支持通配符（如 *.txt、data_*.json），可以指定目录路径。

Returns (ListFilesResult 对象): 返回包含 ```files``` 和 ```dirs``` 数组的对象。

- files：匹配到的文件名数组。

- dirs：当前目录下的子目录名数组。

列出匹配的文件和目录。

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

不指定 ```pattern``` 参数时，列出当前目录（```../files```）下的所有文件和子目录。

See also: `File`, `ListFilesResult`, `FileStat`,  `open`, `fgets`, `fputs`, `mmap`, `getRootDir`, `listFiles`, `exists`, `remove`, `mkdir`, `rmdir`, `rename`, `stat`, `exit`,

##### exists

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
    Log(`os.exists("./strategyConfig"):`, os.exists("./strategyConfig"))    // os.exists("./strategyConfig"): true
    Log(`os.exists("./strategyConfig/testData.txt"):`, os.exists("./strategyConfig/testData.txt"))  // os.exists("./strategyConfig/testData.txt"): true
    // Log(`os.exists("/strategyConfig"):`, os.exists("/strategyConfig"))   // InternalError: invalid filename: path traversal or absolute path not allowed at main
    Log(`os.exists("test_1.txt"):`, os.exists("test_1.txt"))                // os.exists("test_1.txt"): true
    Log(`os.exists("test_2.txt"):`, os.exists("test_2.txt"))                // os.exists("test_2.txt"): false
}
```

See also: `File`, `ListFilesResult`, `FileStat`,  `open`, `fgets`, `fputs`, `mmap`, `getRootDir`, `listFiles`, `exists`, `remove`, `mkdir`, `rmdir`, `rename`, `stat`, `exit`,

##### remove

```
remove(filename)
```

删除指定文件。

Parameters:

- `filename` (string, required): 要删除的文件路径。

Returns (bool): 删除成功返回true，失败返回false。

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

此函数仅用于删除文件，不支持删除目录。如需删除目录，请使用```rmdir()```函数。

See also: `File`, `ListFilesResult`, `FileStat`,  `open`, `fgets`, `fputs`, `mmap`, `getRootDir`, `listFiles`, `exists`, `remove`, `mkdir`, `rmdir`, `rename`, `stat`, `exit`,

##### mkdir

```
mkdir(dirname)
```

创建目录。

Parameters:

- `dirname` (string, required): 要创建的目录路径。

Returns (bool): 创建成功返回 true，否则返回 false。

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

See also: `File`, `ListFilesResult`, `FileStat`,  `open`, `fgets`, `fputs`, `mmap`, `getRootDir`, `listFiles`, `exists`, `remove`, `mkdir`, `rmdir`, `rename`, `stat`, `exit`,

##### rmdir

```
rmdir(dirname)
```

删除目录及其所有内容。

Parameters:

- `dirname` (string, required): 要删除的目录路径。

Returns (bool): 删除成功返回 true，失败返回 false。

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

See also: `File`, `ListFilesResult`, `FileStat`,  `open`, `fgets`, `fputs`, `mmap`, `getRootDir`, `listFiles`, `exists`, `remove`, `mkdir`, `rmdir`, `rename`, `stat`, `exit`,

##### rename

```
rename(oldName, newName)
```

重命名文件或移动文件。

Parameters:

- `oldName` (string, required): 原文件的名称或路径。
- `newName` (string, required): 新文件的名称或路径。

Returns (bool): 操作成功时返回 true，否则返回 false。

重命名文件并将其移动到其他目录。

```javascript
function main() {
    let oldFileName = "output.txt"
    let newFileName = "outputFiles/" + new Date().getTime() + "output.txt"
    // let retRename = os.rename(oldFileName, newFileName)
    // Log("retRename:", retRename)  // InternalError: failed to rename file: renameat output.txt outputFiles/1757322073139output.txt: no such file or directory at main

    os.mkdir("outputFiles")
    let retRename = os.rename(oldFileName, newFileName)
    Log("retRename:", retRename)     // retRename: true
}
```

该函数可用于重命名文件，或将文件移动到其他目录。如果新路径所在的目录不存在，操作将会失败。

See also: `File`, `ListFilesResult`, `FileStat`,  `open`, `fgets`, `fputs`, `mmap`, `getRootDir`, `listFiles`, `exists`, `remove`, `mkdir`, `rmdir`, `rename`, `stat`, `exit`,

##### stat

```
stat(filename)
```

获取文件的详细统计信息。

Parameters:

- `filename` (string, required): 文件路径。

Returns (FileStat 对象): 返回包含文件统计信息的对象。

获取文件信息并检查文件大小。

```javascript
function main() {
    if (os.exists("strategyConfig/testData.txt")) {
        let stat = os.stat("strategyConfig/testData.txt")  // stat: {"size":10,"mode":420,"mtime":1757312981796,"atime":1757312981796,"ctime":1757312981796}
        Log("stat:", stat)
    }
}
```

返回的```FileStat```对象包含以下字段：

- size: 文件大小。

- mode: 文件权限。

- mtime: 最后修改时间。

- atime: 最后访问时间。

- ctime: 创建时间。

See also: `File`, `ListFilesResult`, `FileStat`,  `open`, `fgets`, `fputs`, `mmap`, `getRootDir`, `listFiles`, `exists`, `remove`, `mkdir`, `rmdir`, `rename`, `stat`, `exit`,

##### exit

```
exit()
exit(status)
```

退出程序。

Parameters:

- `status` (number, optional): 可选的退出状态码，默认值为 0。

Returns (never): 此函数不会返回值，程序将直接终止执行。

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

立即终止程序执行。状态码 0 表示正常退出，非零值表示异常退出（实盘中将显示为错误）。

See also: `File`, `ListFilesResult`, `FileStat`,  `open`, `fgets`, `fputs`, `mmap`, `getRootDir`, `listFiles`, `exists`, `remove`, `mkdir`, `rmdir`, `rename`, `stat`, `exit`,

#### File

文件对象，提供文件读写、定位等操作。

##### close

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

See also: `close`, `puts`, `printf`, `flush`, `tell`, `seek`,  `eof`, `read`, `write`, `getline`, `toString`

##### puts

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
    Log("Bytes written:", bytes)  // Bytes written: 12

    file.seek(0, 0)
    let data = file.read()
    Log("data:", data)            // If using os.open("output.txt", "w") may result in data being undefined
                                  // data: Hello World!

    // file.puts()                // error: puts requires at least 1 argument at main
    file.puts(", Hello FMZ!")

    file.seek(0, 0)
    data = file.read()
    Log("data:", data)            // data: Hello World!, Hello FMZ!
    file.close()
}
```

可一次写入多个字符串参数，将按顺序连接后写入。

See also: `close`, `puts`, `printf`, `flush`, `tell`, `seek`,  `eof`, `read`, `write`, `getline`, `toString`

##### printf

```
printf(format)
printf(format, arg1, arg2, ...argN)
```

格式化写入数据到文件。

Parameters:

- `format` (string, required): 格式化字符串。
- `args` (any (平台支持的任意类型), optional): 格式化参数。

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
    Log("data:", data)                              // data: Price: 100.25, Volume: 1000

    // file.printf("| Price: %.2f, Volume: %d\n")   // "| Price: %!f(MISSING), Volume: %!d(MISSING)"
    // file.seek(0, 0)
    // data = file.read()
    // Log("data:", data)

    file.close()
}
```

See also: `close`, `puts`, `printf`, `flush`, `tell`, `seek`,  `eof`, `read`, `write`, `getline`, `toString`

##### flush

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

See also: `close`, `puts`, `printf`, `flush`, `tell`, `seek`,  `eof`, `read`, `write`, `getline`, `toString`

##### tell

```
tell()
```

获取当前文件指针的位置。

Returns (number): 返回当前文件指针的位置（以字节为单位的偏移量）。

记录文件操作过程中的位置。

```javascript
function main() {
    let file = os.open("data.txt", "r+")
    Log("Initial position:", file.tell())      // Initial position: 0

    file.write("Hello")
    Log("After write position:", file.tell())  // After write position: 5
    file.close()
}
```

返回当前文件指针相对于文件起始位置的字节偏移量。

See also: `close`, `puts`, `printf`, `flush`, `tell`, `seek`,  `eof`, `read`, `write`, `getline`, `toString`

##### seek

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

    // If i > str.length: will throw InternalError: seek .../xxx/data.txt: invalid argument at main
    for (let i = 1; i <= str.length; i++) {
        file.seek(-i, 2)
        let data = file.read(1)
        Log("i:", i, ", data:", data)
    }

    file.close()
}
```

用于定位文件指针，```offset```参数可以为负数（表示向前移动）。

See also: `close`, `puts`, `printf`, `flush`, `tell`, `seek`,  `eof`, `read`, `write`, `getline`, `toString`

##### eof

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
        if (line) {
            lineCount++
            Log("Line", lineCount + ":", line)
        }
    }

    Log("Total lines:", lineCount)
    file.close()
}
```

用于在读取文件时判断是否已读取完所有内容。

See also: `close`, `puts`, `printf`, `flush`, `tell`, `seek`,  `eof`, `read`, `write`, `getline`, `toString`

##### read

```
read()
read(size)
```

从文件中读取数据。

Parameters:

- `size` (number, optional): 要读取的字节数。如果不指定，则读取文件中剩余的所有内容。

Returns (string / ArrayBuffer / undefined): 返回读取的内容。当到达文件末尾时返回```undefined```。

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

可以读取指定字节数的内容或文件中剩余的全部内容。返回类型可能是**字符串**或```ArrayBuffer```。

See also: `close`, `puts`, `printf`, `flush`, `tell`, `seek`,  `eof`, `read`, `write`, `getline`, `toString`

##### write

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

See also: `close`, `puts`, `printf`, `flush`, `tell`, `seek`,  `eof`, `read`, `write`, `getline`, `toString`

##### getline

```
getline()
```

从文件中读取下一行内容。

Returns (string / undefined): 返回下一行内容，到达文件末尾时返回```undefined```。

逐行读取文件直至结束。

```javascript
function main() {
    let file = os.open("data.txt", "r")
    let lineCount = 0

    while (!file.eof()) {
        let line = file.getline()
        if (line) {
            lineCount++
            Log("Line", lineCount + ":", line)
        }
    }

    Log("Total lines:", lineCount)
    file.close()
}
```

按行顺序读取文件内容。

See also: `close`, `puts`, `printf`, `flush`, `tell`, `seek`,  `eof`, `read`, `write`, `getline`, `toString`

##### toString

```
toString()
```

获取文件对象的字符串表示形式。

Returns (string): 返回文件对象的字符串描述信息。

获取文件对象的描述信息。

```javascript
function main() {
    let file = os.open("data/data.txt", "r")
    Log("File info:", file.toString())           // File info: File(data/data.txt)
    file.close()
}
```

返回文件对象的描述信息。

See also: `close`, `puts`, `printf`, `flush`, `tell`, `seek`,  `eof`, `read`, `write`, `getline`, `toString`

#### ListFilesResult

文件列表对象，用于记录目录列表信息。该对象包含两个数组属性：```files```（文件列表）和```dirs```（目录列表）。

ListFilesResult对象结构：

```js
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

```js
{
    size: number,   // 文件大小（字节）
    mode: number,   // 文件权限模式
    mtime: number,  // 修改时间，毫秒时间戳
    atime: number,  // 访问时间，毫秒时间戳
    ctime: number   // 创建时间，毫秒时间戳
}
```

此对象由```os.stat()```函数返回。

See also: `File`, `os`, `ListFilesResult`

## 结构体

### Ticker

市场行情数据结构。

Fields:

- `Info` (object): 交易所接口返回的原始数据，回测时不包含此属性。
- `Symbol` (string): ```Symbol```字段为FMZ平台定义的交易品种代码。

- 对于现货交易所对象，```Symbol```字段值的格式为（示例）：```BTC_USDT```，表示BTC_USDT现货交易对。

- 对于期货交易所对象，```Symbol```字段值的格式为（示例）：```BTC_USDT.swap```，表示BTC的USDT本位永续合约。

- 对于期货交易所对象（期权相关功能也封装在期货交易所对象中），```Symbol```字段值的格式为（示例）：```BTC_USDT.BTC-240108-40000-C```，表示BTC的USDT本位期权合约，行权日期为2024年1月8日，行权价格为40000的看涨期权合约。
- `High` (number): 最高价。如果交易所接口未提供24小时最高价，则使用卖一价格填充。
- `Low` (number): 最低价。如果交易所接口未提供24小时最低价，则使用买一价格填充。
- `Sell` (number): 当前卖一价格。
- `Buy` (number): 当前买一价格。
- `Last` (number): 最新成交价。
- `Open` (number): 周期开盘价。如果交易所接口未提供24小时滚动周期的开盘价，则使用当前价格填充。
- `Volume` (number): 最近成交量。原则上，现货成交量单位为交易币种（baseCurrency），合约成交量单位为合约张数。如果交易所接口未提供此类数据，则使用交易所接口现有数据填充，例如可能为计价币种（quoteCurrency）为单位的成交量。
- `Time` (number): 毫秒级时间戳。
- `OpenInterest` (number): 持仓量。大部分交易所接口不提供该数据，不支持时值为0。

exchange.GetTicker()函数返回一个Ticker结构。

对于期权合约，盘口流动性通常较差，经常出现买一、卖一没有挂单的情况，此时```Ticker```结构的```Buy```、```Sell```字段为0；从未成交的期权合约```Last```也可能为0。Futures_Aevo的期权```Last```为标记价格，Futures_OKX、Futures_Kraken在期权没有最新成交价时以标记价格作为```Last```。使用期权行情前应检查这些字段。

See also: `exchange.GetTicker`, `exchange.GetTickers`

### Depth

市场深度数据结构。

Fields:

- `Asks` (array): 卖单数组，即 OrderBook 数组，按价格从低到高排序，数组中第一个 OrderBook 结构的价格最低。
- `Bids` (array): 买单数组，即 OrderBook 数组，按价格从高到低排序，数组中第一个 OrderBook 结构的价格最高。
- `Time` (number): 毫秒级时间戳。

exchange.GetDepth() 函数返回一个 Depth 结构。

See also: `exchange.GetDepth`, `OrderBook`

### OrderBook

市场深度中的订单结构。

Fields:

- `Price` (number): 订单价格。
- `Amount` (number): 订单数量。

exchange.GetDepth()函数返回的数据结构中，Bids和Asks的属性值为OrderBook数组。

See also: `exchange.GetDepth`, `Depth`

### Trade

市场成交记录的数据结构。

Fields:

- `Id` (string): 市场成交记录的唯一标识符，若交易所接口未提供Id则使用时间戳填充。
- `Time` (number): 毫秒级时间戳。
- `Price` (number): 成交价格。
- `Amount` (number): 成交数量。
- `Type` (number): 订单类型，参考`ORDER_TYPE_BUY`、`ORDER_TYPE_SELL`。

exchange.GetTrades()函数返回Trade数组或空数组。

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

exchange.GetRecords()函数返回Record数组或空数组。每个Record结构代表一根K线柱。

对于Python语言，不同版本的pandas包处理方式可能不同，例如：

```python
pandas.DataFrame(records)  // 可能需要调整为：pandas.DataFrame(list(records))
```

相关报错信息：```in getattr KeyError: 'dtype'```。

See also: `exchange.GetRecords`

### Market

交易品种市场信息的数据结构。

Fields:

- `Symbol` (string): 取值例如：```"btcusdt"```，```Symbol```字段记录该交易品种在交易所的原始名称。需要注意该属性的格式、定义与`Ticker`结构的```Symbol```字段不同。
- `BaseAsset` (string): 取值例如：```"BTC"```，```BaseAsset```字段记录交易币名称（即：baseCurrency），统一为大写字母。
- `QuoteAsset` (string): 取值例如：```"USDT"```，```QuoteAsset```字段记录计价币名称（即：quoteCurrency），统一为大写字母。
- `TickSize` (number): 取值例如：```0.01```，```TickSize```字段记录该交易品种在交易所的价格最小变动单位。
- `AmountSize` (number): 取值例如：```0.01```，```AmountSize```字段记录该交易品种在交易所的下单量最小变动单位。
- `PricePrecision` (number): 取值例如：```2```，```PricePrecision```字段记录该交易品种在交易所的价格精度，表示价格精确到2位小数。
- `AmountPrecision` (number): 取值例如：```3```，```AmountPrecision```字段记录该交易品种在交易所的下单量精度，表示下单量精确到3位小数。
- `MinQty` (number): 取值例如：```0.001```，```MinQty```字段记录该交易品种在交易所的最小下单量。
- `MaxQty` (number): 取值例如：```1000```，```MaxQty```字段记录该交易品种在交易所的最大下单量。
- `MinNotional` (number): 取值例如：```5```，```MinNotional```字段记录该交易品种在交易所的最小下单金额。
- `MaxNotional` (number): 取值例如：```9999999```，```MaxNotional```字段记录该交易品种在交易所的最大下单金额。
- `CtVal` (number): ```CtVal```字段记录该交易品种在交易所的单张合约对应的价值，单位为```CtValCcy```字段记录的币种。例如：```CtVal```为0.01，```CtValCcy```为```"BTC"```表示单张合约价值0.01个BTC。
- `CtValCcy` (number): ```CtValCcy```字段记录单张合约的价值单位，单张合约的价值单位可能是：```BTC```、```USD```、```ETH```等。
- `Info` (object): ```Info```字段记录交易所市场信息接口返回的该品种的原始数据。

exchange.GetMarkets()函数返回包含此```Market```结构的字典。

由于各个交易所对于市场信息数据支持程度不同，对于交易所不支持的字段会被忽略。以上各个字段数据取值均来自于交易所接口原始数据，具体也可以查询```Info```字段内容。

See also: `exchange.GetMarkets`

### Order

订单结构。

Fields:

- `Info` (object): 交易所接口返回的原始数据，回测时无此属性。
- `Symbol` (string): ```Symbol```字段为FMZ平台定义的交易品种代码，格式与`Ticker`结构的```Symbol```字段一致。

- 对于现货交易所对象，```Symbol```字段值的格式（示例）为：```BTC_USDT```，表示BTC_USDT现货交易对。

- 对于期货交易所对象，```Symbol```字段值的格式（示例）为：```BTC_USDT.swap```，表示BTC的USDT本位永续合约。
- `Id` (string): 订单ID，该属性由交易所品种代码和交易所原始订单ID组成，以英文逗号分隔。例如OKX交易所的现货交易对```ETH_USDT```订单的属性```Id```格式为：```ETH-USDT,1547130415509278720```。
- `Price` (number): 下单价格，注意市价单的该属性可能为0或-1。
- `Amount` (number): 下单数量，注意市价单的该属性可能为金额而非币数。
- `DealAmount` (number): 成交数量，如果交易所接口不提供该数据，则可能使用0填充。
- `AvgPrice` (number): 成交均价，注意部分交易所不提供该数据。不提供且无法计算得出的情况下，该属性设置为0。
- `Status` (number): 订单状态，参考`ORDER_STATE_PENDING`、`ORDER_STATE_CLOSED`、`ORDER_STATE_CANCELED`、`ORDER_STATE_UNKNOWN`。
- `Type` (number): 订单类型，参考`ORDER_TYPE_BUY`、`ORDER_TYPE_SELL`。
- `Offset` (number): 合约订单的开平仓方向，参考`ORDER_OFFSET_OPEN`、`ORDER_OFFSET_CLOSE`。
- `ContractType` (string): 现货订单中该属性为```""```，即空字符串。合约订单中该属性为具体的合约代码。
- `Condition` (object): 条件单配置信息。当订单为条件单时，该字段包含条件单的触发条件和执行价格配置。普通订单该字段为空值。

该字段的结构参考`Condition`结构。
- `Time` (number): 订单创建时间，毫秒级时间戳。

```Order```订单结构可由```exchange.GetOrder()```、```exchange.GetOrders()```函数返回。```exchange.GetOrders()```函数返回```Order```结构的数组或空数组，如果当前没有未完成的订单，则返回```[]```即空数组。```Order```订单结构的```Status```属性可以直接与```ORDER_STATE_PENDING```等常量比较，判断是否相等从而确定订单状态。

对于单向持仓模式，当无法判断订单是否为平仓（减仓）时，```Offset```字段默认设置为开仓方向，即```ORDER_OFFSET_OPEN```。

```Time```字段表示订单创建时间，为毫秒级时间戳。部分交易所可能在```Info```字段中也包含时间信息，但```Time```字段统一提供标准化的时间戳格式。

See also: `exchange.GetOrder`, `exchange.GetOrders`, `exchange.GetHistoryOrders`, `Condition`

### Condition

条件单配置信息结构，用于设置条件单的触发条件和执行价格。

Fields:

- `ConditionType` (number): 条件单类型，可选值：
- `ORDER_CONDITION_TYPE_OCO`（值为0）：OCO订单（One-Cancels-the-Other，二择一订单）
- `ORDER_CONDITION_TYPE_TP`（值为1）：止盈单（Take Profit）
- `ORDER_CONDITION_TYPE_SL`（值为2）：止损单（Stop Loss）
- `ORDER_CONDITION_TYPE_GENERIC`（值为3）：通用条件单
- `TpTriggerPrice` (number): 止盈触发价格。当条件单类型为TP或OCO时使用，当市场价格达到该价格时触发止盈订单。
- `TpOrderPrice` (number): 止盈订单执行价格，即止盈触发后的实际下单价格。价格为-1时表示以市价单执行。
- `SlTriggerPrice` (number): 止损触发价格。当条件单类型为SL或OCO时使用，当市场价格达到该价格时触发止损订单。
- `SlOrderPrice` (number): 止损订单执行价格，即止损触发后的实际下单价格。价格为-1时表示以市价单执行。

- OCO订单（ConditionType=`ORDER_CONDITION_TYPE_OCO`）同时设置止盈和止损条件，当其中一个条件触发时，另一个自动取消。
- TP订单（ConditionType=`ORDER_CONDITION_TYPE_TP`）仅使用TpTriggerPrice和TpOrderPrice字段。
- SL订单（ConditionType=`ORDER_CONDITION_TYPE_SL`）仅使用SlTriggerPrice和SlOrderPrice字段。
- GENERIC订单（ConditionType=`ORDER_CONDITION_TYPE_GENERIC`）为通用条件单，具体使用的字段取决于交易所的实现。

条件单功能的支持情况取决于具体交易所，部分交易所可能不支持某些类型的条件单。

See also: `Order`, `exchange.CreateConditionOrder`, `exchange.GetConditionOrder`

### Account

账户信息的数据结构。

Fields:

- `Info` (object): 交易所接口返回的原始数据，回测模式下此属性不存在。
- `Balance` (number): 可用的计价币数量。现货交易中，如果交易对为BTC_USDT，Balance表示当前可用的USDT数量。U本位合约中，Balance表示可用保证金（USDT，quoteCurrency）的数量。
- `FrozenBalance` (number): 订单未成交时冻结的资产数值。
- `Stocks` (number): 可用交易币数量。现货交易中，如果交易对为BTC_USDT，Stocks表示当前可用的BTC数量。币本位合约中，Stocks表示可用保证金（币，baseCurrency）的数量。
- `FrozenStocks` (number): 订单未成交时冻结的资产数值。
- `Equity` (number): 仅期货交易所对象支持此字段。```Equity```字段表示当前合约设置下期货账户保证金的**总权益**。如果交易所接口未提供相关数据，则此字段值为0。
- `UPnL` (number): 仅期货交易所对象支持此字段。```UPnL```字段表示当前合约设置下期货账户保证金中所有开仓仓位的**未实现盈亏**总和。

exchange.GetAccount()函数返回一个Account结构。返回结构中的数据依赖于当前设置的交易对和合约代码。

See also: `exchange.GetAccount`

### Asset

具体币种资产信息的数据结构。

Fields:

- `Currency` (string): 交易所定义的币种资产名称。由于不同交易所的命名规则可能存在差异，同一币种在不同交易所可能使用不同的标识符，例如```BTC```在某些交易所可能被标识为```XBT```。
- `Amount` (number): 币种资产的可用余额数量。
- `FrozenAmount` (number): 币种资产的冻结数量。

币种资产的冻结数量```FrozenAmount```通常包含未成交订单锁定的资产以及期货持仓所需的保证金部分。

See also: `exchange.GetAssets`

### Position

合约仓位信息的数据结构。

Fields:

- `Info` (object): 交易所接口返回的原始数据，回测模式下此属性不存在。
- `Symbol` (string): ```Symbol```字段为FMZ平台定义的交易品种代码，格式与`Ticker`结构的```Symbol```字段保持一致。

- 对于现货交易所对象，```Symbol```字段值的格式（示例）为：```BTC_USDT```，表示BTC_USDT现货交易对。

- 对于期货交易所对象，```Symbol```字段值的格式（示例）为：```BTC_USDT.swap```，表示BTC的USDT本位永续合约。
- `MarginLevel` (number): 持仓杠杆倍数，如果交易所接口未提供该数据则通过计算填充，可能存在误差。
- `Amount` (number): 持仓数量，通常为正整数（合约张数）。注意各交易所的合约乘数、价值等合约规格可能存在差异。
- `FrozenAmount` (number): 仓位冻结数量，平仓订单未成交时的临时冻结仓位数量。
- `Price` (number): 持仓均价，原则上该属性为仓位整体的平均价格（不参与结算），如果交易所接口未提供该数据则使用交易所接口现有的持仓均价填充（参与结算）。
- `Profit` (number): 持仓浮动盈亏，原则上为持仓的未实现盈亏，如果交易所接口未提供该数据则使用交易所接口其他盈亏数据填充，盈亏数值的单位与当前合约保证金的单位相同。
- `Type` (number): 仓位类型，参考`PD_LONG`、`PD_SHORT`。
- `ContractType` (string): 合约代码，具体内容请参考`exchange.SetContractType`函数的描述。
- `Margin` (number): 仓位占用的保证金，如果交易所接口未提供该数据则使用0填充。

exchange.GetPositions()函数返回一个Position数组或空数组。

对于加密货币期货需要注意，exchange.GetPositions()函数返回的Position结构数组中，持仓数据结构的FrozenAmount、Profit、Margin属性由于交易所提供的数据并不统一，不同交易所对象调用exchange.GetPositions()接口时返回数据的定义可能存在差异。

例如，某些交易所持仓数据中无仓位冻结数据，此时FrozenAmount为0。如需计算特定数据，可使用Info属性中的原始数据进行计算分析。

See also: `exchange.GetPositions`

### Funding

交易品种资金费率信息的数据结构，仅加密货币永续合约支持资金费率功能。

Fields:

- `Info` (object): 加密货币期货交易所资金费率接口调用时返回的原始数据对象。
- `Symbol` (string): ```Symbol```字段为FMZ平台定义的标准化交易品种代码。
- `Interval` (number): 资金费率结算间隔周期，单位：毫秒。例如```28800000```表示8小时间隔。
- `Time` (number): 下一期资金费率开始时刻（当期结算时刻）的时间戳，单位：毫秒。
- `Rate` (number): 当期结算时将要应用的资金费率数值。

不同期货交易所的永续合约资金费率采用不同的计算方法和机制，结算周期包括1小时、4小时、8小时、24小时等。

期货交易所永续合约的当期资金费率可能为固定值，也可能为实时计算的浮动值。

```Rate```字段为不带```%```符号的资金费率数值，如需转换为百分比形式，可将数值乘以100并添加```%```符号。

See also: `exchange.GetFundings`

### OtherStruct

#### HttpQuery-options

此JSON结构用于配置HttpQuery函数和HttpQuery_Go函数发送HTTP请求的各项参数。

Fields:

- `method` (string): HTTP请求方法，例如：```GET```、```POST```等。
- `body` (string): 请求体内容。例如在POST请求中，body可以包含表单数据、JSON数据、文本等。
- `charset` (string): 字符集编码。用于指定请求体中文本数据的编码方式，例如：```"UTF-8"```。
- `cookie` (string): Cookie是用于在客户端（通常是浏览器）和服务器之间存储和交换状态信息的小型数据片段。
- `debug` (bool): 调试模式开关。设置为true时，HttpQuery函数调用将返回完整的HTTP响应报文；设置为false时仅返回响应报文Body中的数据。
- `headers` (JSON): HTTP请求头信息，以键值对形式存在（JSON结构），用于传递各种信息，如内容类型、认证信息、缓存控制等。
- `timeout` (number): 超时时间设置，单位为毫秒。设置1000表示1秒钟超时。

使用范例：
```js
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
Transfer-Encoding: chunked
User-Agent: Mozilla/5.0 (Macintosh; ...
Accept-Encoding: gzip, deflate, br

e
a=10&b=20&c=30
0

```

See also: `HttpQuery`, `HttpQuery_Go`

#### HttpQuery-return

该JSON结构是调用HttpQuery函数时，在参数```options```结构中将debug字段指定为true后，HttpQuery函数在调试模式下返回的数据结构。

Fields:

- `StatusCode` (number): HTTP状态码。请求未收到应答（连接被拒绝、DNS解析失败、超时、代理失败等）时为0。
- `Header` (JSON): 应答头信息。
- `Cookies` (array): Cookies信息。
- `Trace` (JSON): 请求的完整链路追踪信息。
- `Length` (number): 报文长度。
- `Body` (string): 报文内容。请求失败时为空字符串。
- `Error` (string): 请求失败的原因，包含请求方法、URL和底层错误信息，例如：```Get "https://www.okx.com/api/v5/public/time": timeout after 1000ms```。仅在请求失败（```StatusCode```为0）时出现。

返回的JSON数据结构示例：
```json
{
    "StatusCode": 302,
    "Header": {
        "Content-Type": ["text/html"],
        // ...
    },
    "Cookies": [{
        // ...
    }],
    "Trace": {},
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

See also: `HttpQuery`, `HttpQuery_Go`

#### LogStatus-table

此JSON结构用于配置策略状态栏中显示的表格内容。

Fields:

- `type` (string): 用于设置要解析显示的UI控件类型，对于状态栏表格固定设置为：```table```。
- `title` (string): 用于设置状态栏表格的标题。
- `cols` (array): 用于设置状态栏表格的列标题，数组的第一个元素为第一列的标题，依此类推。
- `rows` (array): 用于设置状态栏表格的行数据。该rows数组（二维数组）的第一个元素也是数组结构，此数组结构的长度应当与表格列数一致（数组中的元素与表格列名一一对应），即表格中的第一行数据。

```js
function main() {
    var tbl = {
        type: "table",
        title: "标题",
        cols: ["列1", "列2", "列3"],
        rows: [
            ["行1列1", "行1列2", "行1列3"],
            ["行2列1", "行2列2", "行2列3"],
            ["行3列1", "行3列2", "行3列3"],
        ]
    }
    LogStatus("`" + JSON.stringify(tbl) + "`")
}
```

See also: `LogStatus`

#### LogStatus-btnTypeOne

该JSON结构用于配置状态栏中的按钮控件，按钮控件JSON结构可以嵌入到状态栏表格JSON结构中。此结构为旧版本结构，平台目前仍然兼容，建议使用最新版本的按钮JSON结构。
状态栏按钮控件构造示例（按钮触发点击后，弹框中包含单个输入控件，通过input字段构造）：
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
状态栏按钮控件点击触发后的弹框中的控件通过```input```或```group```字段设置。

Fields:

- `type` (string): 对于按钮控件，固定设置为：```button```。
- `class` (string): 按钮类型设置。
- `name` (string): 按钮控件上显示的文本，即按钮名称。
- `cmd` (string): 按钮控件触发点击操作时，发送给策略的交互命令内容。
- `description` (string): 按钮控件的描述信息。当鼠标悬停在状态栏中该按钮上时显示此描述信息。
- `disabled` (bool): 设置按钮为禁用（true）或启用（false）。
- `input` (JSON): 在构造状态栏按钮进行交互时支持输入数据，交互指令最终由```GetCommand()```函数捕获。在状态栏按钮控件的JSON数据结构中添加```input```项，用于配置按钮触发时显示的弹框中的输入控件。
例如，设置```input```字段值为：
```json
{
    "name": "开仓数量",
    "type": "number",
    "defValue": 1,
    "description": "test"
}
```

上述JSON结构中各字段描述：
- name
  状态栏按钮触发点击操作后，弹出的弹框中控件的标题。
- description
  状态栏按钮触发点击操作后，弹出的弹框中控件的描述信息。
- type
  状态栏按钮触发点击操作后，弹出的弹框中控件的类型。type字段可取以下值：
  1、```"number"```：数值输入控件。
  2、```"string"```：字符串输入控件。
  3、```"selected"```：下拉框控件。
  4、```"boolean"```：开关控件。
- defValue
  状态栏按钮触发点击操作后，弹出的弹框中控件的默认值。
  如果是下拉框类型控件（selected），defValue字段用于设置下拉框选项，例如：```"input": {"name": "开仓数量", "type": "selected", "defValue": "A|B|C"}```，下拉框选项的文本描述被设置为A、B、C。

对于下拉框类型控件的扩展字段：
- options
  状态栏按钮控件触发的页面中的下拉框控件，可以使用options字段设置选项。options字段中的选项不仅支持字符串，还支持使用```{text: "描述", value: "值"}```结构。使用defValue字段设置默认选项，默认选项可以多选。
- multiple
  当该字段设置为true时，支持下拉框多选。
- `group` (array): ```input```字段配置状态栏按钮触发点击后弹出的弹框中的单个控件，而```group```字段用于配置一组控件。```group```中的元素与```input```字段值的数据结构一致，请参考```input```字段的相关描述说明。

状态栏中按钮JSON结构的```class```属性取值示例：
```js
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
                {"type":"button", "class": "btn btn-xs btn-warning", "name": "告警"},
                {"type":"button", "class": "btn btn-xs btn-danger", "name": "危险"}
            ]
        ]
    }
    LogStatus("`" + JSON.stringify(table) + "`")
}
```

```group```字段与```input```字段使用示例：
```js
function main() {
    // 状态栏按钮控件（设置input字段实现）testBtn1按钮触发的页面中的下拉框控件使用options字段设置选项，使用defValue字段设置默认选项。区别于本章其他示例中直接使用defValue设置选项。
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

此JSON结构用于配置状态栏中的按钮控件，按钮控件JSON结构可以嵌入到状态栏表格JSON结构中。这是目前最新版本的按钮JSON结构。
状态栏按钮控件构造示例（按钮触发点击后，弹框中包含多个输入控件，通过group字段构造）：
```json
{
    "type": "button",
    "cmd": "open",
    "name": "开仓下单",
    "group": [{
        "type": "selected",
        "name": "tradeType",
        "label": "下单类型",
        "description": "市价单、限价单",
        "default": 0,
        "group": "交易设置",
        "settings": {
            "options": ["市价单", "限价单"],
            "required": true,
        }
    }, {
        "type": "selected",
        "name": "direction",
        "label": "交易方向",
        "description": "买入、卖出",
        "default": "buy",
        "group": "交易设置",
        "settings": {
            "render": "segment",
            "required": true,
            "options": [{"name": "买入", "value": "buy"}, {"name": "卖出", "value": "sell"}],
        }
    }, {
        "type": "number",
        "name": "price",
        "label": "价格",
        "description": "订单的价格",
        "group": "交易设置",
        "filter": "tradeType==1",
        "settings": {
            "required": true,
        }
    }, {
        "type": "number",
        "name": "amount",
        "label": "下单量",
        "description": "订单的下单量",
        "group": "交易设置",
        "settings": {
            "required": true,
        }
    }],
}
```
状态栏按钮控件点击触发后的弹框中的控件通过```input```或```group```字段设置。

Fields:

- `type` (string): 对于按钮控件，此字段固定设置为：```button```。
- `name` (string): 按钮控件上显示的文本，即按钮名称。
- `cmd` (string): 按钮控件触发点击操作时，发送给策略的交互命令内容。
- `input` (JSON): 在构造状态栏按钮进行交互时也支持输入数据，交互指令最终由```GetCommand()```函数捕获。在状态栏按钮控件的JSON数据结构中增加```input```项，用于配置按钮触发时显示的弹框中的输入控件。
相对于旧版本的input结构，新版本增加了一些新字段和改动：
```json
{
    "type": "selected",
    "name": "test",
    "label": "topic",
    "description": "desc",
    "default": 1,
    "filter": "a>1",
    "group": "group1",
    "settings": { ... },    // 组件配置
}
```

以上JSON结构中各字段的描述和说明：
- type
  控件类型（必要字段），支持设置为：```"number"```数值输入框、```"string"```字符串输入框、```"selected"```下拉框、```"boolean"```开关控件。
- name
  如果当前JSON结构是input字段的字段值，当没有设置label字段时，name为状态栏按钮点击触发后弹出的弹框中的控件标题。
  如果当前JSON结构是group字段的字段值（数组结构）中的一个元素，name不作为控件标题使用，name字段用于表示控件输入内容的字段名。例如以下group字段的代码片段说明：
  ```json
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
  ```
  根据这个代码片段可知，如果状态栏按钮触发交互，会弹出一个弹框，其中有4个控件，均为下拉框控件。设置好各个控件的选项，点击确定发送交互消息后，策略中的GetCommand函数就会收到```cmdTestBtn3:{"comboBox1":1,"comboBox2":0,"comboBox3":[0,2],"comboBox4":["A","C"]}```。
  JSON结构中name的值都作为返回交互信息的字段名，例如：comboBox1、comboBox2等。
- label
  用于设置控件的标题。
- description
  控件的描述信息。如果当前JSON结构是group字段的字段值（数组结构）中的一个元素，当没有设置label字段时，description为状态栏按钮点击触发后弹出的弹框中的控件标题。
- default
  控件的默认值。
- filter
  选择器，用来隐藏控件。不设置该字段表示不过滤（显示控件）；设置该字段时，当表达式为真时不过滤（显示控件），当表达式为假时过滤（不显示控件）。
- group
  用来控制控件分组，可折叠。
- settings
  组件配置，控件有多种UI可以选择，用此选项可以进行具体设置。例如：
  ```json
  settings:{
      multiple:true,
      customizable:true,
      options:[{name:'xxx|yyy',value:0}]
  }
  ```

  settings相关设置：
  settings.required：是否必选。
  settings.disabled：是否禁用。
  settings.min：type=number时有效，表示最小值或字符串最小长度。
  settings.max：type=number时有效，表示最大值或字符串最大长度。
  settings.step：type=number，render=slider时有效，表示步长。
  settings.multiple：type=selected时有效，表示支持多选。
  settings.customizable：type=selected时有效，表示支持自定义；用户可以直接在下拉框控件中编辑添加新选项，如果选中新编辑的选项，在触发交互时使用该选项的名称而不是选项代表的值。
  settings.options：type=selected时有效，表示选择器的选项数据格式：["选项1"，"选项2"]、[{'name':'xxx','value':0}, {'name':'xxx','value':1}]。
  settings.render：渲染组件类型。
  type=number时，settings.render不设置（默认数字输入框），可选：slider（滑动条）、date（时间选择器返回时间戳）。
  type=string时，settings.render不设置（默认单行输入框），可选：textarea（多行输入）、date（时间选择器返回yyyy-MM-dd hh:mm:ss）、color（颜色选择器返回#FF00FF）。
  type=selected时，settings.render不设置（默认下拉框），可选：segment（分段选择器）。
  type=boolean时，目前只有默认复选框。
- `group` (array): ```input```字段配置状态栏按钮触发点击后弹出的弹框中的一个控件，```group```与```input```的区别在于配置一组控件，```group```中的元素与```input```字段值的数据结构一致，参考以上```input```字段相关描述说明。

支持双语设置：
```json
{
    type:'selected',
    name:'test',
    label:'选项｜options',
    description:'描述｜description',
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

See also: `LogStatus`

#### Chart-options

此JSON用于配置自定义绘图函数```Chart()```的图表设置信息，图表库使用Highcharts。以下列出几个基本的配置字段。

Fields:

- `__isStock` (string): 平台扩展字段。设置为true时使用Highstocks图表；设置为false时使用Highcharts图表。
- `extension` (JSON): ```json
{
    layout: 'single', // 不参于分组，单独显示, 默认为分组 'group'
    height: 300,      // 指定高度
}
```
- `title` (string): 图表标题
- `xAxis` (JSON): X轴配置。
- `yAxis` (JSON): Y轴配置。
- `series` (JSON): 图表数据系列。

简单的绘图示例：
```js
// 此chart在JavaScript语言中是对象，在使用Chart函数之前需要声明一个配置图表的对象变量chart
var chart = {
    // 该字段标记图表是否为股票图表，有兴趣的可以改成false运行查看效果
    __isStock: true,
    // 缩放工具
    tooltip: {xDateFormat: '%Y-%m-%d %H:%M:%S, %A'},
    // 标题
    title : { text : '差价分析图'},
    // 选择范围
    rangeSelector: {
        buttons: [{type: 'hour',count: 1, text: '1h'}, {type: 'hour',count: 3, text: '3h'}, {type: 'hour', count: 8, text: '8h'}, {type: 'all',text: 'All'}],
        selected: 0,
        inputEnabled: false
    },
    // 坐标轴横轴即X轴，当前设置的类型为时间
    xAxis: { type: 'datetime'},
    // 坐标轴纵轴即Y轴，默认数值随数据大小调整
    yAxis : {
        // 标题
        title: {text: '差价'},
        // 是否启用右侧纵轴
        opposite: false
    },
    // 数据系列，该属性保存各个数据系列（线条、K线图、标签等）
    series : [
        // 索引为0，data数组内存放该索引系列的数据
        {name : "line1", id : "线1,buy1Price", data : []},
        // 索引为1，设置了dashStyle:'shortdash'即设置为虚线
        {name : "line2", id : "线2,lastPrice", dashStyle : 'shortdash', data : []}
    ]
}
function main(){
    // 调用Chart函数，初始化图表
    var ObjChart = Chart(chart)
    // 清空
    ObjChart.reset()
    while(true){
        // 获取本次轮询的时间戳，即毫秒级时间戳，用于确定写入图表X轴的位置
        var nowTime = new Date().getTime()
        // 获取行情数据
        var ticker = _C(exchange.GetTicker)
        // 从行情数据的返回值中获取买一价
        var buy1Price = ticker.Buy
        // 获取最后成交价，为了使两条线不重合，我们加1
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

#### KLineChart-options

此JSON用于设置自定义绘图函数```KLineChart```的图表配置信息。以下仅列出几个基本的配置字段。

Fields:

- `overlay` (bool): 是否绘制在主图上。
- `xAxis` (JSON): X轴配置参数。
- `yAxis` (JSON): Y轴配置参数。
- `candle` (JSON): 蜡烛图配置参数。

参考[使用KLineChart函数画图的专题文章](https://www.fmz.com/bbs-topic/9482)。

See also: `KLineChart`

#### SetData-data

该JSON用于设置```exchange.SetData()```函数所要加载的数据。该JSON数据采用数组结构，其中每个元素也是一个数组，格式为```[time, data]```。

Fields:

- `time` (number): 数据的时间戳，用于标记该条数据(data)对应的时间。
- `data` (string / number / bool / object / array / any (平台支持的任意类型)): data是```exchange.SetData()```函数加载的数据中某个时间对应的具体数据内容。策略运行时，```exchange.GetData()```函数根据当前时间获取对应时间戳的数据。

回测系统中加载数据，策略回测运行时取出数据的示例：
```js
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

该JSON是```EventLoop()```函数返回的数据结构。```EventLoop()```函数监听以下事件：1、任意WebSocket可读数据事件；2、exchange.Go()、HttpQuery_Go()函数并发任务完成事件；3、JavaScript语言策略中```threading.Thread()```函数创建的线程发送的消息事件。

Fields:

- `Seq` (number): 事件序列号。
- `Event` (string): 事件名称。
- `ThreadId` (number): 事件线程ID。
- `Index` (number): 事件索引。
- `Nano` (number): 纳秒时间戳。

使用```exchange.Go()```函数并发请求时，```EventLoop()```函数返回的事件数据结构。
```json
{
    "Seq":1,
    "Event":"Exchange_GetTrades",
    "ThreadId":0,
    "Index":3,
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
    "Nano":1727592066508674000
}
```

See also: `EventLoop`

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

#### Thread.join-return

该JSON是```Thread```对象的成员函数```join()```返回的数据结构，用于保存```JavaScript```语言策略中并发线程的相关信息。```Thread```对象指的是线程对象，通过```threading.Thread()```方式创建。

Fields:

- `id` (number): 线程ID。
- `terminated` (bool): 线程是否被强制终止。
- `elapsed` (number): 线程的运行时间（纳秒）。
- `ret` (number): 线程函数的返回值。

以下代码测试```Thread```对象的```join()```函数的超时机制，并打印输出```join()```函数的返回值。
```js
function testFunc() {
    for (var i = 0; i < 5; i++) {
        Log(i)
        Sleep(300)
    }
}

function main() {
    var t1 = threading.Thread(testFunc)
    Log(t1.join(1000))  // undefined
    Log(t1.join())      // {"id":1,"terminated":false,"elapsed":1506864000}
}
```

See also: `join`

## 内置变量

### EXCHANGE

#### exchange

exchange 是一个交易所对象，也是在策略实盘设置、回测设置中添加的第一个交易所对象。所有与交易所的交互均通过该对象的成员函数实现。

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

exchanges 是一个交易所对象数组，包含在策略实盘设置或回测设置中添加的所有交易所对象，其中 exchanges[0] 即为 `exchange`。

在策略实盘设置或回测设置中添加的交易所对象，将根据添加的先后顺序依次对应 exchanges[0]、exchanges[1]、exchanges[2]、…… exchanges[n]。

```javascript
function main() {
    for(var i = 0; i < exchanges.length; i++) {
        Log("Exchange index:", i, "Name:", exchanges[i].GetName(), "Label:", exchanges[i].GetLabel())
    }
}
```

```python
def main():
    for i in range(len(exchanges)):
        Log("Exchange index:", i, "Name:", exchanges[i].GetName(), "Label:", exchanges[i].GetLabel())
```

```rust
fn main() {
    for i in 0..exchanges.len() {
        Log!("Exchange index:", i, "Name:", exchanges[i].GetName(), "Label:", exchanges[i].GetLabel());
    }
}
```

See also: `exchange`, `exchange.GetName`, `exchange.GetLabel`

### ORDER_STATE

#### ORDER_STATE_PENDING

ORDER_STATE_PENDING是`Order`结构中的```Status```属性的值，表示订单状态为待处理状态。

ORDER_STATE_PENDING的值为0。

See also: `ORDER_STATE_CLOSED`, `ORDER_STATE_CANCELED`, `ORDER_STATE_UNKNOWN`

#### ORDER_STATE_CLOSED

ORDER_STATE_CLOSED是`Order`结构中的```Status```属性的值，表示订单状态为已完成。

ORDER_STATE_CLOSED的值为1。

See also: `ORDER_STATE_PENDING`, `ORDER_STATE_CANCELED`, `ORDER_STATE_UNKNOWN`

#### ORDER_STATE_CANCELED

ORDER_STATE_CANCELED 是 `Order` 结构中 ```Status``` 属性的值，表示订单状态为已取消。

ORDER_STATE_CANCELED 的值为 2。

See also: `ORDER_STATE_PENDING`, `ORDER_STATE_CLOSED`, `ORDER_STATE_UNKNOWN`

#### ORDER_STATE_UNKNOWN

ORDER_STATE_UNKNOWN是`Order`结构中的```Status```属性的值，表示订单状态为未知状态（其他状态）。

ORDER_STATE_UNKNOWN的值为3。

对于```ORDER_STATE_UNKNOWN```状态，可以调用`exchange.GetRawJSON`函数获取原始订单的状态信息，根据交易所文档查看具体描述。

See also: `ORDER_STATE_PENDING`, `ORDER_STATE_CLOSED`, `ORDER_STATE_CANCELED`

### ORDER_TYPE

#### ORDER_TYPE_BUY

ORDER_TYPE_BUY是`Order`结构中的```Type```属性值，表示买入订单类型。

ORDER_TYPE_BUY的值为0。

See also: `ORDER_TYPE_SELL`

#### ORDER_TYPE_SELL

ORDER_TYPE_SELL是`Order`结构中的```Type```属性值，用于表示卖单类型。

ORDER_TYPE_SELL的值为1。

See also: `ORDER_TYPE_BUY`

### ORDER_CONDITION_TYPE

#### ORDER_CONDITION_TYPE_OCO

ORDER_CONDITION_TYPE_OCO是`Condition`结构中的```ConditionType```属性的值，表示OCO订单（One-Cancels-the-Other，一触即撤订单）。OCO订单同时设置止盈和止损条件，当其中一个条件触发时，另一个条件自动取消。

ORDER_CONDITION_TYPE_OCO的值为0。

See also: `Condition`, `ORDER_CONDITION_TYPE_TP`, `ORDER_CONDITION_TYPE_SL`

#### ORDER_CONDITION_TYPE_TP

ORDER_CONDITION_TYPE_TP 是 `Condition` 结构中的 ```ConditionType``` 属性值，表示止盈单（Take Profit）。止盈单在市场价格达到预设的目标盈利价格时自动触发订单。

ORDER_CONDITION_TYPE_TP 的值为 1。

See also: `Condition`, `ORDER_CONDITION_TYPE_OCO`, `ORDER_CONDITION_TYPE_SL`

#### ORDER_CONDITION_TYPE_SL

ORDER_CONDITION_TYPE_SL 是 `Condition` 结构中的 ```ConditionType``` 属性值，表示止损单（Stop Loss）。止损单在市场价格触及预设止损价格时自动触发，用于限制潜在损失。

ORDER_CONDITION_TYPE_SL 的值为 2。

See also: `Condition`, `ORDER_CONDITION_TYPE_OCO`, `ORDER_CONDITION_TYPE_TP`

#### ORDER_CONDITION_TYPE_GENERIC

ORDER_CONDITION_TYPE_GENERIC 是 `Condition` 结构中的 ```ConditionType``` 属性值，表示通用条件单。通用条件单的具体行为取决于交易所的实现。

ORDER_CONDITION_TYPE_GENERIC 的值为 3。

See also: `Condition`, `ORDER_CONDITION_TYPE_OCO`, `ORDER_CONDITION_TYPE_TP`

### POSITION_DIRECTION

#### PD_LONG

PD_LONG是`Position`结构中的```Type```属性值，表示多头仓位类型。

PD_LONG的值为0。

对于合约市场多头持仓，使用exchange.SetDirection("closebuy")设置平仓方向来平掉该类型的持仓。

See also: `PD_SHORT`

#### PD_SHORT

PD_SHORT是`Position`结构中的```Type```属性值，表示空头仓位类型。

PD_SHORT的值为1。

对于合约市场空头持仓，使用exchange.SetDirection("closesell")设置平仓方向，以平掉该类型的持仓。

See also: `PD_LONG`

### ORDER_OFFSET

#### ORDER_OFFSET_OPEN

ORDER_OFFSET_OPEN是`Order`结构中```Offset```属性的取值，表示该订单为开仓操作。

ORDER_OFFSET_OPEN的数值为0。

See also: `ORDER_OFFSET_CLOSE`

#### ORDER_OFFSET_CLOSE

ORDER_OFFSET_CLOSE是`Order`结构中```Offset```属性的取值，表示订单为平仓方向。

ORDER_OFFSET_CLOSE的值为1。

See also: `ORDER_OFFSET_OPEN`

### PERIOD

#### PERIOD_M1

表示1分钟K线周期的常量，数值为60。

See also: `exchange.GetRecords`, `PERIOD_M3`, `PERIOD_M5`, `PERIOD_M15`,  `PERIOD_M30`, `PERIOD_H1`, `PERIOD_H2`, `PERIOD_H4`,  `PERIOD_H6`, `PERIOD_H12`, `PERIOD_D1`, `PERIOD_D3`, `PERIOD_W1`

#### PERIOD_M3

表示3分钟K线周期的常量，其值为180。

See also: `exchange.GetRecords`, `PERIOD_M1`, `PERIOD_M5`, `PERIOD_M15`, `PERIOD_M30`, `PERIOD_H1`, `PERIOD_H2`, `PERIOD_H4`, `PERIOD_H6`, `PERIOD_H12`, `PERIOD_D1`, `PERIOD_D3`, `PERIOD_W1`

#### PERIOD_M5

表示5分钟K线周期的常量，数值为300。

See also: `exchange.GetRecords`, `PERIOD_M1`, `PERIOD_M3`, `PERIOD_M15`, `PERIOD_M30`, `PERIOD_H1`, `PERIOD_H2`, `PERIOD_H4`, `PERIOD_H6`, `PERIOD_H12`, `PERIOD_D1`, `PERIOD_D3`, `PERIOD_W1`

#### PERIOD_M15

表示15分钟K线周期的常量，其值为900。

See also: `exchange.GetRecords`, `PERIOD_M1`, `PERIOD_M3`, `PERIOD_M5`, `PERIOD_M30`, `PERIOD_H1`, `PERIOD_H2`, `PERIOD_H4`, `PERIOD_H6`, `PERIOD_H12`, `PERIOD_D1`, `PERIOD_D3`, `PERIOD_W1`

#### PERIOD_M30

表示30分钟K线周期的常量，其值为1800秒。

See also: `exchange.GetRecords`, `PERIOD_M1`, `PERIOD_M3`, `PERIOD_M5`, `PERIOD_M15`, `PERIOD_H1`, `PERIOD_H2`, `PERIOD_H4`, `PERIOD_H6`, `PERIOD_H12`, `PERIOD_D1`, `PERIOD_D3`, `PERIOD_W1`

#### PERIOD_H1

表示1小时K线周期的常量，数值为3600。

See also: `exchange.GetRecords`, `PERIOD_M1`, `PERIOD_M3`, `PERIOD_M5`, `PERIOD_M15`, `PERIOD_M30`, `PERIOD_H2`, `PERIOD_H4`, `PERIOD_H6`, `PERIOD_H12`, `PERIOD_D1`, `PERIOD_D3`, `PERIOD_W1`

#### PERIOD_H2

表示2小时K线周期的常量，数值为7200。

See also: `exchange.GetRecords`, `PERIOD_M1`, `PERIOD_M3`, `PERIOD_M5`, `PERIOD_M15`, `PERIOD_M30`, `PERIOD_H1`, `PERIOD_H4`, `PERIOD_H6`, `PERIOD_H12`, `PERIOD_D1`, `PERIOD_D3`, `PERIOD_W1`

#### PERIOD_H4

表示4小时K线周期的常量，数值为14400。

See also: `exchange.GetRecords`, `PERIOD_M1`, `PERIOD_M3`, `PERIOD_M5`, `PERIOD_M15`, `PERIOD_M30`, `PERIOD_H1`, `PERIOD_H2`, `PERIOD_H6`, `PERIOD_H12`, `PERIOD_D1`, `PERIOD_D3`, `PERIOD_W1`

#### PERIOD_H6

表示6小时K线周期的常量，数值为21600。

See also: `exchange.GetRecords`, `PERIOD_M1`, `PERIOD_M3`, `PERIOD_M5`, `PERIOD_M15`, `PERIOD_M30`, `PERIOD_H1`, `PERIOD_H2`, `PERIOD_H4`, `PERIOD_H12`, `PERIOD_D1`, `PERIOD_D3`, `PERIOD_W1`

#### PERIOD_H12

表示12小时K线周期的常量，数值为43200。

See also: `exchange.GetRecords`, `PERIOD_M1`, `PERIOD_M3`, `PERIOD_M5`, `PERIOD_M15`, `PERIOD_M30`, `PERIOD_H1`, `PERIOD_H2`, `PERIOD_H4`, `PERIOD_H6`, `PERIOD_D1`, `PERIOD_D3`, `PERIOD_W1`

#### PERIOD_D1

表示1日K线周期的常量，数值为86400。

See also: `exchange.GetRecords`, `PERIOD_M1`, `PERIOD_M3`, `PERIOD_M5`, `PERIOD_M15`, `PERIOD_M30`, `PERIOD_H1`, `PERIOD_H2`, `PERIOD_H4`, `PERIOD_H6`, `PERIOD_H12`, `PERIOD_D3`, `PERIOD_W1`

#### PERIOD_D3

表示3日K线周期的常量，数值为259200。

See also: `exchange.GetRecords`, `PERIOD_M1`, `PERIOD_M3`, `PERIOD_M5`, `PERIOD_M15`, `PERIOD_M30`, `PERIOD_H1`, `PERIOD_H2`, `PERIOD_H4`, `PERIOD_H6`, `PERIOD_H12`, `PERIOD_D1`, `PERIOD_W1`

#### PERIOD_W1

表示1周K线周期的常量，数值为604800秒。

See also: `exchange.GetRecords`, `PERIOD_M1`, `PERIOD_M3`, `PERIOD_M5`, `PERIOD_M15`, `PERIOD_M30`, `PERIOD_H1`, `PERIOD_H2`, `PERIOD_H4`, `PERIOD_H6`, `PERIOD_H12`, `PERIOD_D1`, `PERIOD_D3`

### LOG_TYPE

#### LOG_TYPE_BUY

LOG_TYPE_BUY是`exchange.Log`函数的```LogType```参数可选值，用于设置```exchange.Log```函数打印的日志类型为买单日志。

LOG_TYPE_BUY的值为0。

See also: `LOG_TYPE_SELL`, `LOG_TYPE_CANCEL`

#### LOG_TYPE_SELL

LOG_TYPE_SELL是`exchange.Log`函数的```LogType```参数可选值，用于设置```exchange.Log```函数打印卖单日志。

LOG_TYPE_SELL的值为1。

See also: `LOG_TYPE_BUY`, `LOG_TYPE_CANCEL`

#### LOG_TYPE_CANCEL

LOG_TYPE_CANCEL是`exchange.Log`函数的```LogType```参数可选值，用于设置```exchange.Log```函数打印撤销订单日志。

LOG_TYPE_CANCEL的值为2。

See also: `LOG_TYPE_BUY`, `LOG_TYPE_SELL`
