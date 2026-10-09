# FMZ strategy API reference

Generated from the platform's syntax guide (https://www.fmz.com/syntax-guide). Every built-in function, structure and constant, with examples in JavaScript, Python and Rust. Search this file by function name (e.g. `exchange.GetTicker`).

## Built-in Functions

### Global

#### Version

```
Version()
```

Returns the current system version number.

Returns (string): The current system version number, for example: ```3.6```.

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

The system version number is the version number of the hosting program (docker/agent).

#### IsVirtual

```
IsVirtual()
```

Used to determine whether the strategy's runtime environment is the backtesting system.

Returns (bool): When the strategy runs in the backtesting system environment, it returns a truthy value, for example: ```true```; when the strategy runs in the live trading environment, it returns a falsy value, for example: ```false```.

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

Used to determine whether the current runtime environment is the backtesting system, in order to accommodate the differences between the backtesting and live trading environments.

#### GetOS

```
GetOS()
```

Retrieves the operating system information of the device hosting the bot.

Returns (string): Operating system information.

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

For example, a bot running on the **Mac OS** operating system may return ```darwin/amd64``` when calling the ```GetOS()``` function. Since Apple computers use various hardware architectures, the return value includes the specific architecture information. Here, ```darwin``` is the kernel name of the **Mac OS** system.

#### GetPid

```
GetPid()
```

Get the ID of the live trading process.

Returns (string): Returns the ID of the live trading process.

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

Get the ```Meta``` value written when generating the strategy registration code.

Returns (string): ```Meta``` data.

Application scenario example: Use ```Meta``` to limit the number of assets the strategy can operate.

```javascript
function main() {
    // The maximum asset value of the quote currency allowed by the strategy
    var maxBaseCurrency = null

    // Get the metadata when creating the registration code
    var level = GetMeta()

    // Check the condition corresponding to Meta
    if (level == "level1") {
        // -1 means no limit
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

        // Check the asset value
        var acc = exchange.GetAccount()
        if (maxBaseCurrency != -1 && maxBaseCurrency < acc.Stocks + acc.FrozenStocks) {
            // Stop executing the strategy trading logic
            LogStatus(_D(), "level:", level, "Position exceeds registration code limit, strategy trading logic will not execute!")
            continue
        }

        // Other trading logic

        // Normally output the status bar information
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

        # Other trading logic

        # Normally output the status bar information
        LogStatus(_D(), "level:", level, "Strategy running normally! ticker data:\n", ticker)
```

```rust
fn main() {
    // The maximum asset value of the quote currency allowed by the strategy
    let maxBaseCurrency;

    // Get the metadata when creating the registration code, Rust's GetMeta() returns a JsonValue type
    let meta = GetMeta();
    let level = meta.as_str().unwrap_or("");

    // Check the condition corresponding to Meta
    if level == "level1" {
        // -1 means no limit
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

        // Check the asset value
        let acc = exchange.GetAccount().unwrap();
        if maxBaseCurrency != -1.0 && maxBaseCurrency < acc.Stocks + acc.FrozenStocks {
            // Stop executing the strategy trading logic
            LogStatus!(_D(None), "level:", level, "Position exceeds registration code limit, strategy trading logic will not execute!");
            continue;
        }

        // Other trading logic

        // Normally output the status bar information
        LogStatus!(_D(None), "level:", level, "Strategy running normally! ticker data:\n", ticker);
    }
}
```

Application scenario: You need to impose fund restrictions on different strategy lessees. The length of the ```Meta``` value set when generating the registration code cannot exceed 190 characters. The ```GetMeta()``` function is only supported in live trading and does not work in the backtesting system. If the metadata (```Meta```) is not set when generating the strategy registration code, the ```GetMeta()``` function will return an empty value.

#### Sleep

```
Sleep(millisecond)
```

The sleep function pauses program execution for a specified period of time.

Parameters:

- `millisecond` (number, required): The ```millisecond``` parameter is used to set the sleep duration, in milliseconds.

```javascript
function main() {
    Sleep(1000 * 10)   // Wait for 10 seconds
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
    Sleep(1000 * 10);   // Wait for 10 seconds
    Log!("Waited for 10 seconds");
}
```

For example, when executing the ```Sleep(1000)``` function, the program will sleep for 1 second. This function supports sleep operations of less than 1 millisecond, such as ```Sleep(0.1)```. The minimum supported parameter is ```0.000001```, i.e. nanosecond-level sleep, where 1 nanosecond equals ```1e-6``` milliseconds.

When writing strategies in ```Python```, for operations such as polling intervals and time waiting, you should use the ```Sleep(millisecond)``` function rather than the ```time.sleep(second)``` function from ```Python```'s ```time``` library. This is because if a strategy uses the ```time.sleep(second)``` function during backtesting, it will cause the strategy program to actually wait for a period of time (instead of skipping ahead on the backtesting system's time series), resulting in very slow backtesting speed.

#### Unix

```
Unix()
```

Get the second-level timestamp of the current moment.

Returns (number): Returns the second-level timestamp.

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

Get the nanosecond-level timestamp of the current moment.

Returns (number): The ```UnixNano()``` function returns a nanosecond-level timestamp.

If you need to get a millisecond-level timestamp, you can use the following code:

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

Convert a millisecond-level timestamp or a ```Date``` object into a time string.

Parameters:

- `timestamp` (number / object, optional): A millisecond-level timestamp or a ```Date``` object.
- `fmt` (string, optional): The format string. Default format for ```JavaScript```: ```yyyy-MM-dd hh:mm:ss```; default format for ```Python```: ```%Y-%m-%d %H:%M:%S```.

Returns (string): The time string.

Get and print the current time string:

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

The timestamp is 1574993606000; convert it with code:

```javascript
function main() {
    Log(_D(1574993606000))
}
```

```python
def main():
    # Running on a server set to Beijing time, the result is: 2019-11-29 10:13:26; while running this code on a docker on a server in another region gives the result: 2019-11-29 02:13:26
    Log(_D(1574993606))
```

```rust
fn main() {
    Log!(_D(1574993606000));
}
```

Format using the ```fmt``` argument. The format strings for ```JavaScript``` and ```Python``` differ; please refer to the following examples for details:

```javascript
function main() {
    Log(_D(1574993606000, "yyyy--MM--dd hh--mm--ss"))   // 2019--11--29 10--13--26
}
```

```python
def main():
    # 1574993606 is a second-level timestamp
    Log(_D(1574993606, "%Y--%m--%d %H--%M--%S"))        #  2019--11--29 10--13--26
```

```rust
fn main() {
    // Rust's _D() function does not support the fmt argument; it only supports the default format: yyyy-MM-dd hh:mm:ss
    Log!(_D(1574993606000));    // 2019-11-29 10:13:26
}
```

If no argument is passed, the current time string is returned. When using the ```_D()``` function in a ```Python``` strategy, note that the argument passed in is a second-level timestamp (in JavaScript and Rust strategies it is a millisecond-level timestamp; 1 second equals 1000 milliseconds). When using the ```_D()``` function in live trading to parse a timestamp into a readable time string, note the time zone and time settings of the operating system on which the docker (hosting program) runs, because the parsing result of the ```_D()``` function depends on the docker system's time.

See also: `UnixNano`, `Unix`

#### GetCommand

```
GetCommand()
```

Get the strategy's interactive command.

Returns (string): The returned command format is ```ControlName:Data```, where ```ControlName``` is the name of the control and ```Data``` is the data entered in the control. If the interactive control does not contain input components such as an input box or dropdown box (for example, a button control without an input box), then the returned command format is ```ControlName```, i.e. only the control name is returned.

Detect interactive commands, and when an interactive command is detected, use the ```Log``` function to output it.

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
        // Rust's GetCommand() requires a timeout parameter (milliseconds) and returns Option<String>, which is None when there is no command
        if let Some(cmd) = GetCommand(0) {
            Log!(cmd);
        }
        Sleep(1000);
    }
}
```

For example, in the strategy's interactive controls, add a control without an input box, name it ```buy```, with the control description ```Buy```; this is a button control. Then add a control with an input box, name it ```sell```, with the control description ```Sell```; this is an interactive control composed of a button and an input box. Write interactive code in the strategy to respond to the different interactive controls:

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

This function is invalid in the backtesting system.

#### GetLastError

```
GetLastError()
```

Retrieves the most recent error message.

Returns (string): The most recent error message.

```javascript
function main(){
    // Since order number 123 does not exist, this will trigger an error
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
    // Since order number 123 does not exist, this will trigger an error
    // Rust's GetOrder accepts a &OrderId parameter; the string id must be placed in the S field
    let id = OrderId { S: "123".to_string(), ..Default::default() };
    let _ = exchange.GetOrder(&id);
    let error = GetLastError();
    Log!(error);
}
```

This function does not work in the backtesting system.

#### SetErrorFilter

```
SetErrorFilter(filters)
```

Filters error logs.

Parameters:

- `filters` (string, required): A regular expression string.

Filter common errors.

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

Filter error messages from a specific interface.

```javascript
function main() {
    // Query a non-existent order (id 123) to deliberately trigger an interface error
    var order = exchange.GetOrder("123")
    Log(order)
    // Filter http 502 errors and GetOrder interface errors; after setting the error filter, the second call to GetOrder will no longer report an error
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
    // Query a non-existent order (id 123) to deliberately trigger an interface error
    let orderId = OrderId { S: "123".to_string(), ..Default::default() };
    let order = exchange.GetOrder(&orderId);
    Log!(order);
    // Filter http 502 errors and GetOrder interface errors; after setting the error filter, the second call to GetOrder will no longer report an error
    SetErrorFilter("502:|GetOrder");
    let order = exchange.GetOrder(&orderId);
    Log!(order);
}
```

Error logs that match this regular expression will no longer be uploaded to the logging system. This function can be called multiple times (with no limit on the number of calls) to set multiple filter conditions; regular expressions set across multiple calls accumulate and take effect simultaneously. You can pass an empty string to reset the regular expression used to filter error logs: ```SetErrorFilter("")```. Filtered logs will no longer be written to the database file corresponding to the live trading Id under the docker directory, thereby preventing the database file from bloating due to frequent errors.

#### _N

```
_N()
_N(num)
_N(num, precision)
```

Format a floating-point number.

Parameters:

- `num` (number, required): The floating-point number to be formatted.
- `precision` (number, optional): Used to set the formatting precision. The parameter ```precision``` is an integer, with a default value of 4.

Returns (number): The floating-point number formatted according to the precision setting.

For example, ```_N(3.1415, 2)``` keeps ```3.1415``` to two decimal places, removes the remaining digits, and the function returns ```3.14```.

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

If you need to set the N digits to the left of the decimal point all to 0, you can write it like this:

```javascript
function main(){
    var i = 1300
    Log(i)
    var ii = _N(i, -3)
    // Check the log and you will see it is 1000
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
    // Check the log and you will see it is 1000
    Log!(ii);
}
```

The parameter ```precision``` can be a positive integer or a negative integer.

See also: `exchange.SetPrecision`

#### _C

```
_C(pfn)
_C(pfn, ...args)
```

A retry function used for fault-tolerant handling of interface calls.

Parameters:

- `pfn` (function, required): The parameter ```pfn``` is a function reference, i.e. a **callback function**.
- `arg` (string / number / bool / object / array / function / any (any type supported by the platform), optional): The parameters of the **callback function**. There can be multiple ```arg``` parameters. The type and number of the ```arg``` parameters are determined by the parameters of the **callback function**.

Returns (All types supported by the platform except **false values** and **null values** (any).): The return value after the callback function is executed.

Apply fault-tolerant handling to a function without parameters:

```javascript
function main(){
    var ticker = _C(exchange.GetTicker)
    // Change the retry interval of the _C() function to 2 seconds
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
    // Change the retry interval of the _C!() macro to 2 seconds
    _CDelay(2000);
    let depth = _C!(exchange.GetDepth(None));
    Log!(ticker);
    Log!(depth);
}
```

Apply fault-tolerant handling to a function with parameters:

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

It can also be used to apply fault-tolerant handling to custom functions:

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
    // In Rust, a custom function can use the _C! macro for fault tolerance as long as it returns a Result type; it will retry when Err is returned
    let ret = _C!(test(1, 5));
    Log!(ret);
}
```

The ```_C()``` function repeatedly calls the specified function until it returns successfully (when the function referenced by the parameter ```pfn``` returns a **null value** or a **false value** upon being called, the call to ```pfn``` will be retried).

For example, ```_C(exchange.GetTicker)```. The default retry interval is 3 seconds, and you can call the ```_CDelay()``` function to set the retry interval.

For example, ```_CDelay(1000)``` means changing the retry interval of the ```_C()``` function to 1 second.

Fault-tolerant handling can be applied to the following functions (but is not limited to them):

- ```exchange.GetTicker()```
- ```exchange.GetDepth()```
- ```exchange.GetTrades()```
- ```exchange.GetRecords()```
- ```exchange.GetAccount()```
- ```exchange.GetOrders()```
- ```exchange.GetOrder()```
- ```exchange.GetPositions()```

All of the above functions can be called through the ```_C()``` function to achieve fault tolerance. The fault tolerance of the ```_C()``` function is not limited to the functions listed above. Please note that the parameter ```pfn``` is a function reference rather than a function call, i.e. it should be written as ```_C(exchange.GetTicker)```, not ```_C(exchange.GetTicker())```.

#### _Cross

```
_Cross(arr1, arr2)
```

Returns the number of crossover periods between array ```arr1``` and array ```arr2```.

Parameters:

- `arr1` (array, required): An array whose elements are of type ```number```.
- `arr2` (array, required): An array whose elements are of type ```number```.

Returns (number): The number of crossover periods between array ```arr1``` and array ```arr2```.

You can simulate a set of data to test the _Cross(Arr1, Arr2) function:

```javascript
// Fast line indicator
var arr1 = [1,2,3,4,5,6,8,8,9]
// Slow line indicator
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
    // Fast line indicator
    let arr1 = [1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 8.0, 8.0, 9.0];
    // Slow line indicator
    let arr2 = [2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 7.0, 7.0, 7.0];
    Log!("_Cross(arr1, arr2) : ", _Cross(&arr1, &arr2));
    Log!("_Cross(arr2, arr1) : ", _Cross(&arr2, &arr1));
}
```

When the return value of the ```_Cross()``` function is positive, it indicates the number of periods since the upward cross (golden cross); when negative, it indicates the number of periods since the downward cross (death cross); when 0, it indicates that the current prices are equal. For detailed usage instructions, please refer to: [Analysis and Usage Instructions for the Built-in Function _Cross](https://www.fmz.com/bbs-topic/1140).

#### JSON.parse

```
JSON.parse(s)
JSON.parse(s, safeStr)
```

The ```JSON.parse``` function is a method of the **ECMAScript** standard built-in object ```JSON```, used to decode (parse) a JSON string. The FMZ Quant Trading Platform has extended it with an additional parameter ```safeStr``` on this basis.

Parameters:

- `s` (string, required): This parameter is the ```JSON``` string that needs to be decoded (parsed).
- `safeStr` (bool, optional): When this parameter is set to ```true```, if a value that may exceed the precision range is encountered during parsing, it will be returned as a string to avoid precision loss or numeric overflow issues.

Returns (object): The return value is a ```JSON``` object.

Decode (parse) a ```JSON``` string containing a large numeric value.

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
# You can use Python's third-party libraries to handle large numeric data.
```

```rust
fn main() {
    // Rust uses the JSONParse() function to parse JSON strings, without the safeStr parameter
    // Large numeric values that exceed the precision range will be parsed as f64, which may lose precision
    let s1 = r#"{"num": 8754613216564987646512354656874651651358}"#;
    Log!("JSONParse:", JSONParse(s1).unwrap()["num"].as_f64().unwrap_or(0.0));    // JSONParse: 8.754613216564987e39

    let s2 = r#"{"num": 123}"#;
    Log!("JSONParse:", JSONParse(s2).unwrap()["num"].as_f64().unwrap_or(0.0));    // JSONParse: 123
}
```

The ```JSON.parse()``` function can correctly parse JSON strings containing large numeric values; when the ```safeStr``` parameter is set to a truthy value, large numeric values will be parsed as the string type.

The ```safeStr``` parameter position also supports passing in a ```reviver``` parameter, i.e. a function used to transform the result, which is called once for each member of the object; for specific usage, please refer to the relevant materials, which will not be elaborated here.

Only the JavaScript language is supported.

The ```safeStr``` parameter feature of the ```JSON.parse()``` function is not supported in the backtesting system.

#### JSON.stringify

```
JSON.stringify(obj)
```

The ```JSON.stringify``` function is a method of the **ECMAScript** standard built-in object ```JSON```, used to convert JavaScript values to JSON strings.

Parameters:

- `obj` (string / number / bool / object / array / function / any (any type supported by the platform), required): The value to be serialized into a JSON string.

Returns (string): Returns the serialized ```JSON``` string.

Serialize an object to a JSON string and output it.

```javascript
function main() {
    let s1 = {"num": "8754613216564987646512354656874651651358"}
    Log("JSON.stringify:", JSON.stringify(s1))

    // JSON.stringify: {"num":"8754613216564987646512354656874651651358"}
    // The variable returned by JSON.stringify(s1) is of string type
}
```

```python
// Omitted
```

Only supported in JavaScript language.

#### Encode

```
Encode(algo, inputFormat, outputFormat, data)
Encode(algo, inputFormat, outputFormat, data, keyFormat, key)
```

This function encodes data according to the parameters passed in.

Parameters:

- `algo` (string, required): The ```algo``` parameter is used to specify the algorithm used in the encoding computation. It supports being set to one of the following values: "raw" (no algorithm used), "sign", "signTx", "md4", "md5", "sha256", "sha512", "sha1", "keccak256", "sha3.224", "sha3.256", "sha3.384", "sha3.512", "sha3.keccak256", "sha3.keccak512", "sha512.384", "sha512.256", "sha512.224", "ripemd160", "blake2b.256", "blake2b.512", "blake2s.128", "blake2s.256".

The ```algo``` parameter also supports "text.encoder.utf8", "text.decoder.utf8", "text.encoder.gbk", "text.decoder.gbk", which are used to encode or decode strings.

The ```algo``` parameter also supports the "ed25519" algorithm, which can be used in combination with different hash algorithms. For example, the ```algo``` parameter can be written as "ed25519.md5", "ed25519.sha512", etc., and ```ed25519.seed``` computation is also supported.
- `inputFormat` (string, required): Used to specify the data format of the ```data``` parameter. The ```inputFormat``` parameter supports being set to one of "raw", "hex", "base64", "string". "raw" indicates raw data, "hex" indicates ```hex```-encoded data, "base64" indicates ```base64```-encoded data, and "string" indicates string data.
- `outputFormat` (string, required): Used to specify the output data format. The ```outputFormat``` parameter supports being set to one of "raw", "hex", "base64", "string". "raw" indicates raw data, "hex" indicates ```hex```-encoded data, "base64" indicates ```base64```-encoded data, and "string" indicates string data.
- `data` (string, required): The ```data``` parameter is the data to be processed.
- `keyFormat` (string, optional): Used to specify the data format of the ```key``` parameter. The ```keyFormat``` parameter supports being set to one of "raw", "hex", "base64", "string". "raw" indicates raw data, "hex" indicates ```hex```-encoded data, "base64" indicates ```base64```-encoded data, and "string" indicates string data.
- `key` (string, optional): The ```key``` parameter is the key used for ```HMAC``` encryption.

When the ```algo``` parameter is set to "sign" or "signTx", the ```key``` parameter must be passed in.

When the ```algo``` parameter is set to "raw", the ```key``` parameter is not used for ```HMAC``` encryption (because HMAC encryption must specify an algorithm).

Returns (string): The ```Encode``` function returns the encoded and encrypted data.

Example of calling the Encode function.

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
    // In Rust, all 6 parameters of the Encode() function are required; when not encrypting, simply pass empty strings for keyFormat and key
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

The parameter ```algo``` also supports the following values: "text.encoder.utf8", "text.decoder.utf8", "text.encoder.gbk", "text.decoder.gbk", which are used to encode and decode strings.

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
    // In Rust, all 6 parameters of the Encode() function are required; when not encrypting, pass empty strings for keyFormat and key
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

The ```Encode()``` function is only supported in live trading. If the ```key``` and ```keyFormat``` parameters are not passed in, no ```key``` encryption is performed.

#### MD5

```
MD5(data)
```

Calculate the MD5 hash of the parameter ```data```.

Parameters:

- `data` (string, required): The data on which to perform the MD5 calculation.

Returns (string): The MD5 hash value.

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

After calling the ```MD5("hello world")``` function, the return value is: ```5eb63bbbe01eeed093cb22bb8f5acdc3```.

See also: `Encode`

#### UUID

```
UUID()
```

Create a UUID.

Returns (string): A 32-bit UUID.

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

The ```UUID()``` function is only supported in live trading.

### Log

#### Log

```
Log(...msgs)
```

The ```Log()``` function is used to output logs.

Parameters:

- `msg` (string / number / bool / object / array / any (any type supported by the platform), optional): The parameter ```msg``` is the content to be output. Multiple ```msg``` parameters can be passed in.

Multiple ```msg``` parameters can be passed in:

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

Setting the color of the output message is supported. If you need to set both the color and push simultaneously, set the color first and then use the ```@``` character to set push at the end.

```javascript
function main() {
    Log("Hello FMZ Quant !@")
    Sleep(1000 * 5)
    // Adding #ff0000 within the string makes the printed log display in red and pushes the message
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
    // Adding #ff0000 within the string makes the printed log display in red and pushes the message
    Log!("Hello, #ff0000@");
}
```

The ```Log()``` function supports printing ```base64```-encoded images. The content starts with ``` ` ``` and ends with ``` ` ```, for example:

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

The ```Log()``` function supports directly printing ```Python```'s ```matplotlib.pyplot``` object. As long as the object contains a ```savefig``` method, it can be printed directly using the ```Log``` function, for example:

```python
import matplotlib.pyplot as plt
def main():
    plt.plot([3,6,2,4,7,1])
    Log(plt)
```

The ```Log()``` function supports language switching. Its output text will automatically switch to the corresponding language according to the language setting of the platform page, for example:

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

The ```Log()``` function outputs a log message to the log area of the live trading or backtesting system. During live trading, the logs will be saved in the live trading database. If the content output by the ```Log()``` function ends with the ```@``` character, that log will enter the message push queue and be pushed to the email address, WebHook address, etc. configured in the [Push Settings](https://www.fmz.com/m/account) of the current FMZ Quant Trading Platform account. The [Debugging Tool](https://www.fmz.com/m/debug) and the backtesting system do not support message push. Message push is subject to frequency limits, with the specific rules as follows: within each 20-second cycle of live trading, only the last push message is retained and pushed, while the rest are filtered out and not pushed (the push logs output via the Log function are still printed and displayed normally in the log area).

If the content output by the ```Log()``` function ends with the ```&``` character, that log will be marked as a private log. When the live trading is publicly displayed, that log is hidden from other users, but remains visible from the perspective of the live trading owner's account. This feature can be used to record sensitive information such as API keys, account balances, etc. For example: ```Log("Private information", "&")```.

Regarding ```WebHook``` push, you can use a service program written in ```Golang```:
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

Set the ```WebHook``` in the [Push Settings](https://www.fmz.com/m/account): ```http://XXX.XX.XXX.XX:9090/data?data=Hello_FMZ```. After running the written ```Golang``` service program, you can start running the live trading strategy. The following is a strategy written in ```JavaScript```; when the strategy runs, it executes the ```Log()``` function and pushes the message:
```js
function main() {
    Log("msg", "@")
}
```

After the service program written in ```Golang``` receives the push, it prints the following information:
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

Outputs information to the status bar on the backtesting system or the live trading page.

Parameters:

- `msg` (string / number / bool / object / array / any (any type supported by the platform), optional): The parameter ```msg``` is the content to be output. Multiple ```msg``` parameters can be passed in.

Supports setting the color of the output content:

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

Example of data output in the status bar:

```javascript
function main() {
    var table = {type: 'table', title: 'Position Info', cols: ['Column 1', 'Column 2'], rows: [ ['abc', 'def'], ['ABC', 'support color #ff0000']]}
    // After JSON serialization, add ` characters at both ends of the string to have it recognized as a complex message format (tables are currently supported)
    LogStatus('`' + JSON.stringify(table) + '`')
    // Table information can also be displayed within multi-line text
    LogStatus('First line message\n`' + JSON.stringify(table) + '`\nThird line message')
    // Multiple tables can be displayed simultaneously, and will be grouped and shown as tabs (TAB)
    LogStatus('`' + JSON.stringify([table, table]) + '`')

    // Buttons can also be constructed within the table; the strategy receives the content of the cmd property via GetCommand
    var table = {
        type: 'table',
        title: 'Position Operation',
        cols: ['Column 1', 'Column 2', 'Action'],
        rows: [
            ['abc', 'def', {'type':'button', 'cmd': 'coverAll', 'name': 'Close All'}]
        ]
    }
    LogStatus('`' + JSON.stringify(table) + '`')
    // Or construct a standalone button
    LogStatus('`' + JSON.stringify({'type':'button', 'cmd': 'coverAll', 'name': 'Close All'}) + '`')
    // Button styles can be customized (bootstrap button attributes)
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
    // Add ` characters at both ends of the JSON string to have it recognized as a complex message format (tables are currently supported)
    LogStatus!(format!("`{}`", table));
    // Table information can also be displayed within multi-line text
    LogStatus!(format!("First line message\n`{}`\nThird line message", table));
    // Multiple tables can be displayed simultaneously, and will be grouped and shown as tabs (TAB)
    LogStatus!(format!("`[{},{}]`", table, table));

    // Buttons can also be constructed within the table; the strategy receives the content of the cmd property via GetCommand
    let table = String::from(r#"{"type": "table", "title": "Position Operation", "cols": ["Column 1", "Column 2", "Action"], "rows": ["#)
        + r#"["abc", "def", {"type": "button", "cmd": "coverAll", "name": "Close All"}]"#
        + r#"]}"#;
    LogStatus!(format!("`{}`", table));
    // Or construct a standalone button
    LogStatus!(format!("`{}`", r#"{"type": "button", "cmd": "coverAll", "name": "Close All"}"#));
    // Button styles can be customized (bootstrap button attributes)
    LogStatus!(format!("`{}`", r#"{"type": "button", "class": "btn btn-xs btn-danger", "cmd": "coverAll", "name": "Close All"}"#));
}
```

Supports designing button controls in the status bar (legacy button structure):

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

Configure the disable and description features of status bar buttons (legacy button structure):

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

In combination with the ```GetCommand()``` function, build the interactive functionality of status bar buttons (legacy button structure):

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

When constructing status bar buttons for interaction, data input is also supported, and the interaction command is ultimately captured by the ```GetCommand()``` function.

By adding an ```input``` field to the data structure of a status bar button control (legacy button structure) — for example, adding ```"input": {"name": "Quantity", "type": "number", "defValue": 1}``` to ```{"type": "button", "cmd": "open", "name": "Open"}``` — the button, when clicked, will pop up a dialog containing an input field control (the default value in the input field is 1, i.e. the value set by ```defValue```), so that a value can be entered and sent together with the button command. For example, when running the following test code, clicking the "Open Position" button will pop up a dialog with an input field; entering 111 in the input field and clicking "OK" will cause the ```GetCommand()``` function to capture the message: ```open:111```.

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

Group button controls are supported (the legacy button structure). Their functionality is identical to the **status bar button that supports data input** (configured via the "input" field), and the interaction commands are ultimately captured by the ```GetCommand()``` function. The difference is that group buttons are configured via the ```"group"``` field: when a button is clicked to trigger an interaction, the dialog box that pops up on the page displays a pre-configured **set** of input controls, allowing a group of data to be entered all at once.
Regarding the ```"group"``` field in the structure of status bar button controls and group button controls, note the following points:
- The ```type``` property in group only supports the following 4 types, and the ```defValue``` property is used to set the default value.
  "selected": drop-down box control; use the ```|``` symbol to separate the options in the drop-down box.
  "number": numeric input box control.
  "string": string input box control.
  "boolean": checkbox control; checked means (boolean) true, unchecked means (boolean) false.
- Controls for interactive input support dependency settings:
  For example, the ```"name": "tradePrice@orderType==1"``` setting in the example below makes the **trade price** (```tradePrice```) input control available only when the **order type** (orderType) drop-down box control is set to **limit order**.
- The names of controls for interactive input support bilingual settings.
  For example, the "description": "下单方式|order type" setting in the example below uses the ```|``` symbol to separate the Chinese and English description content.
- Although the ```name``` and ```description``` in group share the same field names as the ```name``` and ```description``` in the button structure, their definitions are not the same.
  The ```name``` in group is also defined differently from the ```name``` in input.
- After a group button control is triggered, the format of the interaction content sent is: the button's cmd field value plus the group field-related data. For example, when testing the example below, the content output by the ```Log("cmd:", cmd)``` statement is:
  ```cmd: open:{"orderType":1,"tradePrice":99,"orderAmount":"99","boolean":true}```, that is, the content returned by the ```GetCommand()``` function when the interaction operation occurs: ```open:{"orderType":1,"tradePrice":99,"orderAmount":"99","boolean":true}```.
- The ```type``` property of button controls only supports ```"button"```:
  For button controls that support data input, i.e. controls with the ```input``` property set, the ```type``` property in the ```input``` field configuration supports multiple control types.

Refer to the following example:

```javascript
function main() {
    var tbl = {
        type: "table",
        title: "Group Button Control Demo",
        cols: ["Operation"],
        rows: []
    }

    // Create the group button control structure
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

    // Test button 1
    var testBtn1 = {"type": "button", "name": "Button 1", "cmd": "button1", "description": "This is the first button"}
    var testBtn2 = {"type": "button", "name": "Button 2", "cmd": "button2", "description": "This is the second button", "input": {"name": "Quantity", "type": "number", "defValue": 1}}

    // Add groupBtn to tbl
    tbl.rows.push([groupBtn])
    // A single cell of a status bar table supports setting multiple buttons, i.e. the data in a single cell is an array of button structures: [testBtn1, testBtn2]
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
    // Create the group button control structure
    let group_btn = String::from(r#"{"type": "button", "cmd": "open", "name": "Open", "group": ["#)
        + r#"{"name": "orderType", "description": "下单方式|order type", "type": "selected", "defValue": "市价单|挂单"},"#
        + r#"{"name": "tradePrice@orderType==1", "description": "交易价格|trade price", "type": "number", "defValue": 100},"#
        + r#"{"name": "orderAmount", "description": "委托数量|order amount", "type": "string", "defValue": 100},"#
        + r#"{"name": "boolean", "description": "是/否|boolean", "type": "boolean", "defValue": true}"#
        + r#"]}"#;

    // Test button 1, test button 2
    let test_btn1 = r#"{"type": "button", "name": "Button 1", "cmd": "button1", "description": "This is the first button"}"#;
    let test_btn2 = r#"{"type": "button", "name": "Button 2", "cmd": "button2", "description": "This is the second button", "input": {"name": "Quantity", "type": "number", "defValue": 1}}"#;

    // Add groupBtn to tbl; a single cell of a status bar table supports setting multiple buttons, i.e. the data in a single cell is an array of button structures: [testBtn1, testBtn2]
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

When the status bar group button control (implemented by setting the ```group``` field) and the status bar button control (implemented by setting the ```input``` field) are clicked to trigger interaction (legacy button structure), the dropdown control in the dialog box that pops up on the page also supports multi-select. The following example demonstrates how to design a dropdown control with multi-select options:

```javascript
function main() {
    // In the page triggered by the status bar button control (implemented by setting the input field) testBtn1 button, the dropdown control uses the options field to set options, and uses the defValue field to set the default option. This differs from the approach in other examples of this chapter that set options directly using defValue.
    var testBtn1 = {
        type: "button",
        name: "testBtn1",
        cmd: "cmdTestBtn1",
        input: {name: "testBtn1ComboBox", type: "selected", options: ["A", "B"], defValue: 1}
    }

    /*
      In the page triggered by the status bar button control (implemented by setting the input field) testBtn2 button, the dropdown control uses the options field to set options. The options in the options field support not only strings,
      but also the ```{text: "description", value: "value"}``` structure. Use the defValue field to set the default option; the default option supports multi-select (implemented via an array structure). For multi-select, you need to additionally set the multiple field to a truthy value (true).
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

    // In the page triggered by the status bar group button control (implemented by setting the group field) testBtn3 button, the dropdown control uses the options field to set options, and also supports setting options directly using defValue.
    var testBtn3 = {
        type: "button",
        name: "testBtn3",
        cmd: "cmdTestBtn3",
        group: [
            {name: "comboBox1", label: "labelComboBox1", description: "Dropdown 1", type: "selected", defValue: 1, options: ["A", "B"]},
            {name: "comboBox2", label: "labelComboBox2", description: "Dropdown 2", type: "selected", defValue: "A|B"},
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
    // In the page triggered by the status bar button control (implemented by setting the input field) testBtn1 button, the dropdown control uses the options field to set options, and uses the defValue field to set the default option. This differs from the approach in other examples of this chapter that set options directly using defValue.
    let test_btn1 = r#"{"type": "button", "name": "testBtn1", "cmd": "cmdTestBtn1", "input": {"name": "testBtn1ComboBox", "type": "selected", "options": ["A", "B"], "defValue": 1}}"#;

    /*
      In the page triggered by the status bar button control (implemented by setting the input field) testBtn2 button, the dropdown control uses the options field to set options. The options in the options field support not only strings,
      but also the {"text": "description", "value": "value"} structure. Use the defValue field to set the default option; the default option supports multi-select (implemented via an array structure). For multi-select, you need to additionally set the multiple field to a truthy value (true).
    */
    let test_btn2 = String::from(r#"{"type": "button", "name": "testBtn2", "cmd": "cmdTestBtn2", "input": {"#)
        + r#""name": "testBtn2MultiComboBox", "type": "selected", "description": "Implement multi-select dropdown","#
        + r#""options": [{"text": "Option A", "value": "A"}, {"text": "Option B", "value": "B"}, {"text": "Option C", "value": "C"}],"#
        + r#""defValue": ["A", "C"], "multiple": true}}"#;

    // In the page triggered by the status bar group button control (implemented by setting the group field) testBtn3 button, the dropdown control uses the options field to set options, and also supports setting options directly using defValue.
    let test_btn3 = String::from(r#"{"type": "button", "name": "testBtn3", "cmd": "cmdTestBtn3", "group": ["#)
        + r#"{"name": "comboBox1", "label": "labelComboBox1", "description": "Dropdown 1", "type": "selected", "defValue": 1, "options": ["A", "B"]},"#
        + r#"{"name": "comboBox2", "label": "labelComboBox2", "description": "Dropdown 2", "type": "selected", "defValue": "A|B"},"#
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

Based on the current latest button structure, construct the buttons in the status bar table; when clicking a button triggers an interaction, pop up a dialog box containing multiple controls.

For more details, refer to: [User Guide - Interactive Controls in the Status Bar](/user-guide/编写策略/交互控件/状态栏中的交互控件).

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

            // Parse the interaction message: open:{"symbol":"LTC_USDT.swap","tradeType":0,"direction":"buy","amount":111}
            // Determine which button template triggered the message based on the command before the first colon :
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

            # Parse the interaction message: open:{"symbol":"LTC_USDT.swap","tradeType":0,"direction":"buy","amount":111}
            # Determine which button template triggered the message based on the command before the first colon :
            arrCmd = cmd.split(":")
            if arrCmd[0] == "open":
                msg = json.loads(cmd[5:])
                Log("Symbol:", msg["symbol"], ", Direction:", msg["direction"], ", Order type:", "Market order" if msg["tradeType"] == 0 else "Limit order", ", Price: Current market price" if msg["tradeType"] == 0 else ", Price:" + str(msg["price"]), ", Amount:", msg["amount"])

        # Output status bar information
        LogStatus(_D(), "\n", "`" + json.dumps(tbl) + "`")
        Sleep(1000)
```

```rust
fn main() {
    let symbols = ["BTC_USDT.swap", "ETH_USDT.swap", "LTC_USDT.swap", "BNB_USDT.swap", "SOL_USDT.swap"];

    // Btn: button template; the first element of "group" is the trading symbol control, __SYMBOL__ is a placeholder that is replaced when constructing the button
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

            // Parse the interaction message: open:{"symbol":"LTC_USDT.swap","tradeType":0,"direction":"buy","amount":111}
            // Determine which button template triggered the message based on the command before the first colon :
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

Horizontally merge cells in the table drawn by the ```LogStatus()``` function:

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
    // Add a row of data, merge the first and second cells, and output the ticker variable in the merged cell
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
    // Add a row of data, merge the first and second cells, and output the ticker data in the merged cell
    // body is a string (corresponding to JS's JSON.stringify(ticker)); its internal quotes must be escaped before being embedded into the JSON
    let row2 = format!(r#"[{{"body": "{}", "colspan": 2}}, "abc"]"#, json_ticker.replace('"', "\\\""));
    let table = table_tpl.replace("__ROW2__", &row2);
    LogStatus!(format!("`{}`", table));
}
```

Vertically merge cells in a table drawn by the ```LogStatus()``` function:

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
    // A3 is merged into the first cell of the previous row
    table.rows.push(["B4", "C4"])
    // A2 is merged into the first cell of the previous row
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
    // For ease of testing, constructed data is used here to keep the code short and readable
    let json_ticker = r#"{"High": 0, "Low": 0, "Buy": 0, "Sell": 0, "Last": 0, "Time": 0, "Volume": 0}"#;
    let name = exchange.GetName();

    let mut rows: Vec<String> = Vec::new();
    rows.push(String::from(r#"["A1", "B1", {"type": "button", "cmd": "coverAll", "name": "C1"}]"#));
    // body is a string, and the quotes inside it must be escaped before they can be embedded in JSON
    let body = format!("A2 + B2:{}", json_ticker).replace('"', "\\\"");
    rows.push(format!(r#"[{{"body": "{}", "colspan": 2}}, "C2"]"#, body));
    rows.push(format!(r#"[{{"body": "A3 + A4 + A5:{}", "rowspan": 3}}, "B3", "C3"]"#, name));
    // A3 is merged into the first cell of the previous row
    rows.push(String::from(r#"["B4", "C4"]"#));
    // A2 is merged into the first cell of the previous row
    rows.push(String::from(r#"["B5", "C5"]"#));
    rows.push(String::from(r#"["A6", "B6", "C6"]"#));

    let table = format!(r#"{{"type": "table", "title": "Table Demo", "cols": ["Column A", "Column B", "Column C"], "rows": [{}]}}"#, rows.join(","));
    LogStatus!(format!("`{}`", table));
}
```

Display tables with pagination in the status bar:

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

In addition to displaying tables with pagination, you can also arrange multiple tables from top to bottom:

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
    // In Rust, write the row data directly into the JSON string
    let tab1 = r#"{"type": "table", "title": "Table 1", "cols": ["1", "2"], "rows": [["jack", "lucy"]]}"#;
    let tab2 = r#"{"type": "table", "title": "Table 2", "cols": ["1", "2", "3"], "rows": [["A", "B", "C"]]}"#;
    let tab3 = r#"{"type": "table", "title": "Table 3", "cols": ["A", "B", "C"], "rows": [["A", "B", "C"]]}"#;

    LogStatus!(format!("`{}`\n`{}`\n`{}`", tab1, tab2, tab3));

    Log!("exit");
}
```

Supports setting horizontal and vertical scroll modes for the status bar table. After setting the ```scroll``` attribute to ```"auto"```, when the number of vertical rows in the status bar table exceeds 20, the content will scroll automatically; when the number of horizontal columns exceeds the visible range of the page, horizontal scrolling will be applied. Using the ```scroll``` attribute can help mitigate the lag caused by writing large amounts of data to the status bar during live trading.

Refer to the following test example:

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

During live trading, the information output by the ```LogStatus()``` function is not saved to the live trading database; it only updates the content of the current live trading status bar.

The ```LogStatus()``` function supports printing ```base64```-encoded images. The image string starts with ``` ` ``` and ends with ``` ` ```. For example: ```LogStatus("`data:image/png;base64,AAAA`")```.

The ```LogStatus()``` function supports directly passing in a ```Python``` ```matplotlib.pyplot``` object. As long as the object contains the ```savefig``` method, it can be passed as a parameter to the ```LogStatus()``` function. For example:

```python
import matplotlib.pyplot as plt

def main():
    plt.plot([3,6,2,4,7,1])
    LogStatus(plt)
```

When a strategy is running live, if you scroll through the historical records on the live trading page, the status bar enters a dormant state and stops updating; the status bar data is only refreshed when the log is on the first page. The status bar supports outputting ```base64```-encoded images, and also supports outputting ```base64```-encoded images within tables displayed in the status bar. Since encoded image string data is usually very long, no example code is shown here.

See also: `GetCommand`

#### LogProfit

```
LogProfit(profit)
LogProfit(profit, ...args)
```

Records and prints the profit/loss value, and plots the equity curve based on the profit/loss value.

Parameters:

- `profit` (number, required): The parameter ```profit``` is the profit data, which is calculated by the algorithm designed in the strategy.
- `arg` (string / number / bool / object / array / any (any type supported by the platform), optional): Extended parameter, used to output additional information to this profit log. Multiple ```arg``` parameters can be passed in.

When calling the ```LogProfit``` function, if the last parameter is the character ```&```, the log will not be written to the database and only the profit chart will be updated. Using the ```&``` parameter can avoid generating a large number of logs from frequent profit records, thereby keeping the logs clean. For example:

```javascript
function main() {
    // Plot 30 points on the profit chart
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
    // Plot 30 points on the profit chart
    // In Rust, LogProfit only accepts the profit value parameter and does not support extended parameters such as '&'
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

Clear all profit logs and the profit chart.

Parameters:

- `remain` (number, optional): The ```remain``` parameter is used to specify the number of log entries to retain (an integer).

```javascript
function main() {
    // Print 30 data points on the profit chart, then reset, keeping only the last 10 data points
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
    // Print 30 data points on the profit chart, then reset, keeping only the last 10 data points
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

Clear the logs.

Parameters:

- `remain` (number, optional): The ```remain``` parameter is used to set the number of most recent log entries to retain.

```javascript
function main() {
    // Retain the 10 most recent log entries and clear the rest
    LogReset(10)
}
```

```python
def main():
    LogReset(10)
```

```rust
fn main() {
    // Retain the 10 most recent log entries and clear the rest
    LogReset(10);
}
```

The startup log generated each time a live trading strategy starts is counted as one entry. Therefore, if no parameter is passed and the strategy produces no log output when it starts, the logs will not be displayed at all, and you will need to wait for the docker to send back the logs (this is normal behavior, not an error).

See also: `Log`, `LogVacuum`

#### LogVacuum

```
LogVacuum()
```

Used to reclaim the storage space occupied by deleted data in **SQLite** after clearing logs with the ```LogReset()``` function.

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

The reason is that ```SQLite``` does not immediately reclaim the occupied storage space when deleting data; the ```VACUUM``` command must be executed to clean up the data tables and free up space. This function triggers a file move operation when called, resulting in significant latency, so it is recommended to call it at appropriate time intervals.

See also: `LogReset`

#### EnableLog

```
EnableLog(enable)
```

Enable or disable logging of order information.

Parameters:

- `enable` (bool, required): When the ```enable``` parameter is set to a falsy value (e.g. ```false```), order logs (i.e. the logs generated by functions such as ```exchange.Buy()```) will not be printed, nor will they be written to the live trading database.

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

See also: `exchange.Buy`, `exchange.Sell`,
`exchange.CancelOrder`

#### Chart

```
Chart(options)
```

Custom chart plotting function.

Parameters:

- `options` (object / object array, required): The ```options``` parameter is the chart configuration. The ```options``` parameter of the ```Chart()``` function is a ```JSON```-serializable ```Highcharts.StockChart``` parameter of ```HighStocks```. Compared with the native parameters, it adds an additional ```__isStock``` property. If the ```__isStock``` property is set to a falsy value (e.g. ```false```), it is displayed as an ordinary chart, i.e. using a ```Highcharts``` chart; if the ```__isStock``` property is set to a truthy value (e.g. ```true```), a ```Highstocks``` chart is used (by default ```__isStock``` is truthy, e.g. ```true```). For details, refer to the [HighStocks chart library](http://api.highcharts.com/highstock).

Returns (object): Chart object.

Multi-chart drawing configuration notes:
- ```extension.layout``` property
  When this property is set to "single", the chart will not be displayed stacked with other charts (i.e., it is not presented as tabbed pages), but is instead tiled separately.
- ```extension.height``` property
  This property is used to set the height of the chart. The value can be a numeric type, or it can be set in the form of "300px".
- ```extension.col``` property
  This property is used to set the width of the chart. The page width is divided into 12 units in total; setting it to 8 means the chart occupies 8 units of width.

```javascript
function main() {
    var cfgA = {
        extension: {
            layout: 'single', // Not included in grouping, displayed separately; the default is grouping 'group'
            height: 300, // Specify height
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
            ]  // After specifying the initial data, there is no need to use the add function to update; you can update the data series simply by modifying the chart configuration directly.
        }]
    };
    var cfgD = {
        extension: {
            layout: 'single',
            col: 8, // Specify the number of units the width occupies; the total number of units is 12
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
        // Append a data point to the pie chart; add can only update data points that were added via the add method, built-in data points cannot be updated later
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
        // Equivalent to updating the first data series of the second chart
        chart.add([2, [new Date().getTime(), diff]]);
        chart.add(4, [new Date().getTime(), ticker.Buy]);
        chart.add(5, [new Date().getTime(), ticker.Buy]);
        cfgC.series[0].data[0][1] = Math.random() * 100;
        cfgE.series[0].data[0][1] = Math.random() * 100;
        // update is actually equivalent to resetting the chart configuration
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
    // In Rust, the chart configuration is a JSON string; variable parts are represented with placeholders, which are replaced when updating to rebuild the configuration
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
    // Append a data point to the pie chart; add can only update data points that were added via the add method, built-in data points cannot be updated later
    let y = (UnixNano() % 100) as f64;    // Use the timestamp to simulate a random number
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
        // Equivalent to updating the first data series of the second chart
        chart.add(2, &format!("[{}, {}]", now, diff), -1);
        chart.add(4, &format!("[{}, {}]", now, ticker.Buy), -1);
        chart.add(5, &format!("[{}, {}]", now, ticker.Buy), -1);
        let cfg_c = cfg_c_tpl.replace("__Y__", &format!("{}", (UnixNano() % 100) as f64));
        let cfg_e = cfg_e_tpl.replace("__Y__", &format!("{}", (UnixNano() % 100) as f64));
        // update is actually equivalent to resetting the chart configuration
        chart.update(&format!("[{},{},{},{},{}]", cfg_a, cfg_b, cfg_c, cfg_d, cfg_e));
    }
}
```

A simple charting example:

```javascript
// In JavaScript, chart is an object; before calling the Chart function, we need to declare an object variable chart used to configure the chart
var chart = {
    // This field marks whether the chart is an ordinary chart; interested readers can change it to false and run it to see the effect
    __isStock: true,
    // Tooltip
    tooltip: {xDateFormat: '%Y-%m-%d %H:%M:%S, %A'},
    // Title
    title : { text : 'Spread Analysis Chart'},
    // Range selector
    rangeSelector: {
        buttons:  [{type: 'hour',count: 1, text: '1h'}, {type: 'hour',count: 3, text: '3h'}, {type: 'hour', count: 8, text: '8h'}, {type: 'all',text: 'All'}],
        selected: 0,
        inputEnabled: false
    },
    // Horizontal axis (i.e., the x-axis); the currently set type is: datetime
    xAxis: { type: 'datetime'},
    // Vertical axis (i.e., the y-axis); by default the values are automatically adjusted according to the data size
    yAxis : {
        // Title
        title: {text: 'Spread'},
        // Whether to enable the right-side vertical axis
        opposite: false
    },
    // Data series; this property holds each data series (line charts, candlestick charts, labels, etc.)
    series : [
        // Index 0; the data array stores the data for the series at this index
        {name : "line1", id : "Line 1,buy1Price", data : []},
        // Index 1; dashStyle: 'shortdash' is set, i.e., it is set as a dashed line
        {name : "line2", id : "Line 2,lastPrice", dashStyle : 'shortdash', data : []}
    ]
}

function main(){
    // Call the Chart function to initialize the chart
    var ObjChart = Chart(chart)
    // Clear
    ObjChart.reset()
    while(true){
        // Get the timestamp of this poll (i.e., a millisecond-level timestamp), used to determine the X-axis position written to the chart
        var nowTime = new Date().getTime()
        // Get the ticker data
        var ticker = _C(exchange.GetTicker)
        // Get the best bid price from the return value of the ticker data
        var buy1Price = ticker.Buy
        // Get the last traded price; to prevent the two lines from overlapping, add 1 to it here
        var lastPrice = ticker.Last + 1
        // Pass the timestamp as the X value and the best bid price as the Y value into the data series at index 0
        ObjChart.add(0, [nowTime, buy1Price])
        // Same as above
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
    // In Rust, the chart configuration is a JSON string; before calling the Chart::new function, define the chart configuration first
    let chart = r#"{
        "__isStock": true,
        "tooltip": {"xDateFormat": "%Y-%m-%d %H:%M:%S, %A"},
        "title": {"text": "Spread Analysis Chart"},
        "rangeSelector": {
            "buttons": [{"type": "hour", "count": 1, "text": "1h"}, {"type": "hour", "count": 3, "text": "3h"}, {"type": "hour", "count": 8, "text": "8h"}, {"type": "all", "text": "All"}],
            "selected": 0,
            "inputEnabled": false
        },
        "xAxis": {"type": "datetime"},
        "yAxis": {
            "title": {"text": "Spread"},
            "opposite": false
        },
        "series": [
            {"name": "line1", "id": "Line 1,buy1Price", "data": []},
            {"name": "line2", "id": "Line 2,lastPrice", "dashStyle": "shortdash", "data": []}
        ]
    }"#;

    // Call the Chart::new function to initialize the chart
    let obj_chart = Chart::new(chart);
    // Clear
    obj_chart.reset(0);
    loop {
        // Get the timestamp of this poll (i.e., a millisecond-level timestamp), used to determine the X-axis position written to the chart
        let now_time = Unix() * 1000;
        // Get the ticker data
        let ticker = _C!(exchange.GetTicker(None));
        // Get the best bid price from the return value of the ticker data
        let buy1_price = ticker.Buy;
        // Get the last traded price; to prevent the two lines from overlapping, add 1 to it here
        let last_price = ticker.Last + 1.0;
        // Pass the timestamp as the X value and the best bid price as the Y value into the data series at index 0
        obj_chart.add(0, &format!("[{}, {}]", now_time, buy1_price), -1);
        // Same as above
        obj_chart.add(1, &format!("[{}, {}]", now_time, last_price), -1);
        Sleep(2000);
    }
}
```

Example of drawing trigonometric function curves:

```javascript
// Configuration object used to initialize the chart
var chart = {
    // Chart title
    title: {text: "Line value triggers plotLines value"},
    // Y-axis related settings
    yAxis: {
        // A horizontal line perpendicular to the Y-axis, used as a trigger line; this is an array of structs, and multiple trigger lines can be set
        plotLines: [{
            // The value of the trigger line; the line will be displayed at the corresponding numerical position
            value: 0,
            // Set the color of the trigger line
            color: 'red',
            // Line width
            width: 2,
            // The displayed label
            label: {
                // Label text
                text: 'Trigger Value',
                // Center-align the label
                align: 'center'
            }
        }]
    },
    // X-axis related settings; here the type is set to a datetime axis
    xAxis: {type: "datetime"},
    series: [
        {name: "sin", type: "spline", data: []},
        // Data series; multiple can be set and controlled via array indices
        {name: "cos", type: "spline", data: []}
    ]
}
function main(){
    // Pi
    var pi = 3.1415926535897
    // Variable used to record the timestamp
    var time = 0
    // Angle
    var angle = 0
    // The y-coordinate value, used to receive the sine or cosine value
    var y = 0
    // Call the API interface to initialize the chart using the chart object
    var objChart = Chart(chart)
    // Clear the chart during initialization
    objChart.reset()
    // Set the value of the trigger line to 1
    chart.yAxis.plotLines[0].value = 1
    // Loop
    while(true){
        // Get the timestamp of the current moment
        time = new Date().getTime()
        // Every 500ms, increase the angle by 5 degrees and calculate the sine value
        y = Math.sin(angle * 2 * pi / 360)
        // Write the calculated y value into the data series at the corresponding index in the chart; the first parameter of the add function is the specified data series index
        objChart.add(0, [time, y])
        // Calculate the cosine value
        y = Math.cos(angle * 2 * pi / 360)
        objChart.add(1, [time, y])
        // Increase by 5 degrees
        angle += 5
        // Pause for 5 seconds to avoid plotting too frequently and data growing too fast
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
    // JSON configuration string used to initialize the chart; the trigger line value is set directly to 1 in the configuration
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
    // Pi
    let pi = 3.1415926535897_f64;
    // Angle
    let mut angle = 0.0_f64;
    // Call the API interface to initialize the chart using the chart configuration
    let obj_chart = Chart::new(chart);
    // Clear the chart during initialization
    obj_chart.reset(0);
    // Loop
    loop {
        // Get the millisecond timestamp of the current moment
        let ts = Unix() * 1000;
        // Increase the angle by 5 degrees and calculate the sine value
        let mut y = (angle * 2.0 * pi / 360.0).sin();
        // Write the calculated y value into the data series at the corresponding index in the chart; the first parameter of the add function is the specified data series index
        obj_chart.add(0, &format!("[{}, {}]", ts, y), -1);
        // Calculate the cosine value
        y = (angle * 2.0 * pi / 360.0).cos();
        obj_chart.add(1, &format!("[{}, {}]", ts, y), -1);
        // Increase by 5 degrees
        angle += 5.0;
        // Pause for 5 seconds to avoid plotting too frequently and data growing too fast
        Sleep(5000);
    }
}
```

A complex example using a mixed chart:

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
    // In Rust, the chart configuration is represented as a JSON string; the pie chart data is marked with the placeholder __PIE_DATA__, which is replaced to rebuild the configuration on update
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
        let r = (UnixNano() % 100) as f64 / 100.0;          // use the timestamp to simulate a random number
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

The ```pie``` type chart does not have a time axis, so you need to update the chart configuration directly when updating the data. For example, in the code of the example above, after updating the data, simply call ```c.update(chartCfg)``` to refresh the chart, as shown below:

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
// In Rust the chart configuration is a JSON string; rebuild the configuration containing the new data and then call update to refresh the chart
let pie = format!(r#"[["A", {}], ["B", {}]]"#, (UnixNano() % 100) as f64, (UnixNano() % 100) as f64);
c.update(&chart_cfg_tpl.replace("__PIE_DATA__", &pie));
```

The ```Chart()``` function returns a chart object, which contains 4 methods: ```add()```, ```reset()```, ```update()```, ```del()```.
- 1. ```update()``` method:
  The ```update()``` method is used to update the chart's configuration information. Its parameter is a Chart chart configuration object (JSON).
- 2. ```del()``` method:
  The ```del()``` method deletes the data series at the specified index according to the passed series parameter.
- 3. ```add()``` method:
  The ```add()``` method is used to write data into the chart. Its parameters are, in order:
  - ```series```: used to set the index of the data series, an integer.
  - ```data```: used to set the specific data to be written, an array.
  - ```index``` (optional): used to set the data index, an integer, specifying the exact index position of the data to be modified. Negative numbers are supported; setting it to ```-1``` indicates the last data point of the data set.
    For example, when drawing a line, to modify the data of the last point on the line: ```chart.add(0, [1574993606000, 13.5], -1)```, i.e. change the data of the last point in the chart's ```series[0].data```. When the ```index``` parameter is not set, it means appending data to the end of the current data series (series).
- 4. ```reset()``` method:
  The ```reset()``` method is used to clear the chart data. It can take one parameter ```remain```, used to specify the number of data entries to retain. When the ```remain``` parameter is not passed, it means clearing all data.

See also: `KLineChart`

#### KLineChart

```
KLineChart(options)
```

This function is used to perform custom drawing while a strategy is running, using a drawing approach similar to the ```Pine``` language.

Parameters:

- `options` (object / object array, required): The ```options``` parameter is a chart configuration object that supports the following properties:

- ```overlay```: Boolean value, used to set whether the drawing content is overlaid onto the main chart. When set to ```true```, it is displayed on the main chart; when set to ```false```, it is displayed on the sub-chart.

- ```pricePrecision```: Number, price data precision, used to control the number of decimal places for price data in the chart. For example, setting it to 2 keeps 2 decimal places, and setting it to 0 keeps no decimal places (rounded to an integer).

- ```volumePrecision```: Number, volume data precision, used to control the number of decimal places for volume data in the chart. For example, setting it to 2 keeps 2 decimal places, and setting it to 0 keeps no decimal places (rounded to an integer).

Returns (object): Chart object.

The chart object returned by the ```KLineChart()``` function contains multiple methods, among which ```begin(bar)``` and ```close(bar)``` deserve special attention. When iterating over K-line data to perform drawing operations, each drawing operation must start with a call to the ```begin(bar)``` function and end with a call to the ```close(bar)``` function.

If you need to draw on the strategy's custom chart area, you must first create a chart control object, which can be created using the ```KLineChart()``` function. The argument of the ```KLineChart()``` function is a chart configuration structure. The chart configuration structure used in the reference code is very simple: ```{overlay: true}```.

This chart configuration structure only sets the drawing content to be output on the main chart. If ```overlay``` is set to a falsy value (for example ```false```), then all the chart content will be output on the sub-chart; if you need to specify that a certain drawing function draws on the main chart, you can also specify the argument ```overlay``` as a truthy value (for example ```true```) in the specific function call.

```javascript
function main() {
    // Call the KLineChart function to create the chart control object c
    let c = KLineChart({
        overlay: true
    })

    // Test with a spot exchange object to obtain K-line data. If testing with a futures exchange object, you need to set the contract first
    let bars = exchange.GetRecords()
    if (!bars) {
        return
    }

    // Iterate over the K-line data to perform drawing operations. Each drawing operation must start with a ```c.begin(bar)``` function call and end with a ```c.close(bar)``` function call.
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
    # Call the KLineChart function to create the chart control object c
    c = KLineChart({
        "overlay": True
    })

    # Test with a spot exchange object to obtain K-line data. If testing with a futures exchange object, you need to set the contract first
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
    // Call KLineChart::new to create the chart control object c
    let mut c = KLineChart::new(r#"{"overlay": true}"#);

    // Test with a spot exchange object to obtain K-line data. If testing with a futures exchange object, you need to set the contract first
    let bars = exchange.GetRecords(None, None, None).unwrap();

    // Iterate over the K-line data to perform drawing operations. Each drawing operation must start with a c.begin(bar) function call and end with a c.close() function call.
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

Use the ```pricePrecision``` and ```volumePrecision``` parameters to control the display precision of the chart data. You can set the display precision for price and volume according to your actual needs. For example, for instruments with large price fluctuations, you can set the precision to 0 to display integers; for instruments with finer price granularity, you can set it to 2 or a higher precision.

```javascript
function main() {
    // Create the chart control object, setting both price precision and volume precision to 0 (i.e., display integers)
    let c = KLineChart({
        overlay: true,
        pricePrecision: 0,   // Price data precision; set to 2 to keep 2 decimal places
        volumePrecision: 0   // Volume data precision
    })

    // Select the appropriate trading pair based on the exchange type
    let symbol = exchange.GetName().includes("Futures_") ? "ETH_USDT.swap" : "ETH_USDT"
    Log("Test symbol:", symbol)

    // Get K-line data
    let bars = exchange.GetRecords(symbol)
    if (!bars) {
        return
    }

    // Iterate over the K-line data and draw the chart
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
    # Create the chart control object, setting both price precision and volume precision to 0 (i.e., display integers)
    c = KLineChart({
        "overlay": True,
        "pricePrecision": 0,   # Price data precision; set to 2 to keep 2 decimal places
        "volumePrecision": 0   # Volume data precision
    })

    # Select the appropriate trading pair based on the exchange type
    exName = exchange.GetName()
    symbol = "ETH_USDT.swap" if "Futures_" in exName else "ETH_USDT"
    Log("Test symbol:", symbol)

    # Get K-line data
    bars = exchange.GetRecords(symbol)
    if not bars:
        return

    # Iterate over the K-line data and draw the chart
    for bar in bars:
        c.begin(bar)
        c.barcolor('rgba(255, 0, 0, 0.2)' if bar.Close > bar.Open else 'rgba(0, 0, 0, 0.2)')
        c.plot(bar.High, 'high')
        c.plot(bar.Low, 'low')
        c.close(bar)
```

```rust
fn main() {
    // Create the chart control object, setting both price precision and volume precision to 0 (i.e., display integers)
    // pricePrecision is the price data precision; set to 2 to keep 2 decimal places; volumePrecision is the volume data precision
    let mut c = KLineChart::new(r#"{"overlay": true, "pricePrecision": 0, "volumePrecision": 0}"#);

    // Select the appropriate trading pair based on the exchange type
    let symbol = if exchange.GetName().contains("Futures_") { "ETH_USDT.swap" } else { "ETH_USDT" };
    Log!("Test symbol:", symbol);

    // Get K-line data
    let bars = exchange.GetRecords(symbol, None, None).unwrap();

    // Iterate over the K-line data and draw the chart
    for bar in &bars {
        c.begin(bar);
        c.barcolor(if bar.Close > bar.Open { "rgba(255, 0, 0, 0.2)" } else { "rgba(0, 0, 0, 0.2)" }, "{}");
        c.plot(bar.High, r#"{"title": "high"}"#);
        c.plot(bar.Low, r#"{"title": "low"}"#);
        c.close();
    }
}
```

The ```Pine``` language drawing interface functions supported in drawing operations are as follows:

```barcolor```: Sets the color of the candlesticks.

> barcolor(color, offset, editable, show_last, title, display)

> The available values for the display parameter are: "none", "all"

```javascript
c.barcolor(bar.Close > bar.Open ? 'rgba(255, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.2)')   // The usage is the same as the reference code in the example above, so it will not be repeated here
```

```python
c.barcolor('rgba(255, 0, 0, 0.2)' if bar.Close > bar.Open else 'rgba(0, 0, 0, 0.2)')
```

```rust
c.barcolor(if bar.Close > bar.Open { "rgba(255, 0, 0, 0.2)" } else { "rgba(0, 0, 0, 0.2)" }, "{}");   // The usage is the same as the reference code in the example above, so it will not be repeated here
```

```bgcolor```: Fills the candlestick background with the specified color.

> bgcolor(color, offset, editable, show_last, title, display, overlay)

> The available values for the display parameter are: "none", "all"

```javascript
c.bgcolor('rgba(0, 255, 0, 0.5)')
```

```python
c.bgcolor('rgba(0, 255, 0, 0.5)')
```

```rust
c.bgcolor("rgba(0, 255, 0, 0.5)", "{}");
```

```plot```: Plots a series of data on the chart.

> plot(series, title, color, linewidth, style, trackprice, histbase, offset, join, editable, show_last, display)

> The available values for the style parameter are: "stepline_diamond", "stepline", "cross", "areabr", "area", "circles", "columns", "histogram", "linebr", "line"

> The available values for the display parameter are: "none", "all"

```javascript
c.plot(bar.High, 'high')

c.plot(bar.Open < bar.Close ? NaN : bar.Close, "Close", {style: "linebr"})  // Supports plotting discontinuous data lines
```

```python
h = c.plot(bar.High, 'high')

h = c.plot(None if bar.Open < bar.Close else bar.Close, "Close", style = "linebr")  # Supports plotting discontinuous data lines
```

```rust
let h = c.plot(bar.High, r#"{"title": "high"}"#);

c.plot(if bar.Open < bar.Close { f64::NAN } else { bar.Close }, r#"{"title": "Close", "style": "linebr"}"#);  // Supports plotting discontinuous data lines
```

```fill```, fills the background area between two plots or ```hline```s with a specified color. > fill(hline1, hline2, color, title, editable, fillgaps, display) > display parameter options: "none", "all"

Since the ```JavaScript``` language cannot pass arguments by parameter name, to solve this problem you can use the ```{key: value}``` structure to pass arguments to specified parameter names. For example, the reference code uses ```{color: bar.Close > bar.Open ? 'rgba(255, 0, 0, 0.2)' : 'rgba(255, 0, 0, 0.2)'}``` to assign a value to the ```color``` parameter of the ```fill``` function.

To pass arguments to multiple parameter names consecutively, you can use ```{key1: value1, key2: value2, key3: value3}```.

For example, this sample additionally specifies a ```title``` parameter: ```{color: bar.Close > bar.Open ? 'rgba(255, 0, 0, 0.2)' : 'rgba(255, 0, 0, 0.2)', title: 'fill'}```.

Color values can be set either using the ```'rgba(255, 0, 0, 0.2)'``` format or the ```'#FF0000'``` format.

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

```hline```, draws a horizontal line at a given fixed price level.

> hline(price, title, color, linestyle, linewidth, editable, display)

> linestyle parameter options: "dashed", "dotted", "solid"

> display parameter options: "none", "all"

```javascript
c.hline(bar.High)
```

```python
c.hline(bar.High)
```

```rust
c.hline(bar.High, "{}");
```

```plotarrow```, draws up and down arrows on the chart.

> plotarrow(series, title, colorup, colordown, offset, minheight, maxheight, editable, show_last, display)

> display parameter options: "none", "all"

```javascript
c.plotarrow(bar.Close - bar.Open)
```

```python
c.plotarrow(bar.Close - bar.Open)
```

```rust
c.plotarrow(bar.Close - bar.Open, "{}");
```

```plotshape```, draws visual shapes on the chart.

> plotshape(series, title, style, location, color, offset, text, textcolor, editable, size, show_last, display)

> The style parameter can be: "diamond", "square", "label_down", "label_up", "arrow_down", "arrow_up", "circle", "flag", "triangle_down", "triangle_up", "cross", "xcross"

> The location parameter can be: "abovebar", "belowbar", "top", "bottom", "absolute"

> The size parameter can be: "10px", "14px", "20px", "40px", "80px", corresponding respectively to size.tiny, size.small, size.normal, size.large, and size.huge in the Pine language.

> size.auto is equivalent to size.small.

> The display parameter can be: "none", "all"

```javascript
c.plotshape(bar.Low, {style: 'diamond'})
```

```python
c.plotshape(bar.Low, style = 'diamond')
```

```rust
c.plotshape(bar.Low > 0.0, r#"{"style": "diamond"}"#);
```

```plotchar```, draws visual shapes on the chart using any given Unicode character.

> plotchar(series, title, char, location, color, offset, text, textcolor, editable, size, show_last, display)

> The location parameter can be: "abovebar", "belowbar", "top", "bottom", "absolute"

> The size parameter can be: "10px", "14px", "20px", "40px", "80px", corresponding respectively to size.tiny, size.small, size.normal, size.large, and size.huge in the Pine language.

> size.auto is equivalent to size.small.

> The display parameter can be: "none", "all"

```javascript
c.plotchar(bar.Close, {char: 'X'})
```

```python
c.plotchar(bar.Close, char = 'X')
```

```rust
c.plotchar(bar.Close > 0.0, r#"{"char": "X"}"#);
```

```plotcandle```, draws a candlestick chart on the chart.

> plotcandle(open, high, low, close, title, color, wickcolor, editable, show_last, bordercolor, display)

> The display parameter can be: "none", "all"

```javascript
c.plotcandle(bar.Open*0.9, bar.High*0.9, bar.Low*0.9, bar.Close*0.9)
```

```python
c.plotcandle(bar.Open*0.9, bar.High*0.9, bar.Low*0.9, bar.Close*0.9)
```

```rust
c.plotcandle(bar.Open * 0.9, bar.High * 0.9, bar.Low * 0.9, bar.Close * 0.9, "{}");
```

```signal```, this is a function that does not exist in the Pine language; here it is used to draw buy/sell signals.

> signal(direction, price, qty, id)

The parameter "long" indicates the trade direction, which can be "long", "closelong", "short", or "closeshort". The parameter ```bar.High``` indicates the position of the signal marker on the Y-axis.

The parameter 1.5 indicates the trade quantity of the signal. A fourth parameter can be passed to replace the default text drawn; the default text of the signal marker is the trade direction, for example: "closelong".

```javascript
c.signal("long", bar.High, 1.5)
```

```python
c.signal("long", bar.High, 1.5)
```

```rust
c.signal("long", bar.High, 1.5, "long");
```

```reset```, this is a function that does not exist in the Pine language; it is used to clear chart data.

> reset(remain)

The ```reset()``` method accepts a parameter ```remain```, used to specify the number of data entries to retain. If the ```remain``` parameter is not passed, it means all data will be cleared.

```javascript
c.reset()
```

```python
c.reset()
```

```rust
c.reset(0);
```

For custom drawing in a strategy, you can only choose one of the two methods: the ```KLineChart()``` function or the ```Chart()``` function. For settings such as colors and styles involved when calling the ```KLineChart()``` function, please refer to the [topic article on drawing with the KLineChart function](https://www.fmz.com/bbs-topic/9482).

The ```pricePrecision``` and ```volumePrecision``` parameters are used to control the display precision of data in the chart. When these parameters are not set, the chart displays data using the default precision. After the precision parameters are set, the price and volume data in the chart will be rounded and displayed according to the specified number of decimal places, which helps simplify the chart display and improve readability.

See also: `Chart`

#### console.log

```
console.log(...msgs)
```

Used to output debug information in the "Debug Info" section of the live trading page. For example, when the live trading ID is ```123456```, the ```console.log``` function outputs debug information on the live trading page while creating a log file with ```.log``` extension in the docker directory ```/logs/storage/123456/``` and writing debug information to it. The file name prefix is ```stdout_```.

Parameters:

- `msg` (string / number / bool / object / array / any (any type supported by the platform), optional): The parameter ```msg``` is the content to be output, multiple parameters can be passed.

```javascript
function main() {
    console.log("test console.log")
}
```

```python
# 不支持
```

Notes:

- Only ```JavaScript``` language supports this function.

- Only live trading environment supports this function, neither "Debug Tool" nor "Backtesting System" supports it.

- When outputting objects, they will be converted to the string ```[object Object]```, so it is recommended to output readable information.

See also: `console.error`

#### console.error

```
console.error(...msgs)
```

Used to output error messages in the "Debug Information" section of the live trading page. For example, when the live trading ID is ```123456```, the ```console.error``` function outputs error messages on the live trading page while creating a log file with the prefix ```stderr_``` and extension ```.log``` in the docker's directory ```/logs/storage/123456/``` where the live trading belongs, and writes the error messages to this file.

Parameters:

- `msg` (string / number / bool / object / array / any (any type supported by the platform), optional): The parameter ```msg``` is the content to be output, multiple parameters can be passed.

```javascript
function main() {
    console.error("test console.error")
}
```

```python
# Not supported
```

Notes:
- Only ```JavaScript``` language supports this function.
- Only live trading environment supports this function, "Debug Tool" and "Backtesting System" do not support it.
- When outputting objects, they will be converted to the string ```[object Object]```, it is recommended to output human-readable information.

See also: `console.log`

#### exchange.Log

```
exchange.Log(orderType, price, amount)
exchange.Log(orderType, price, amount, ...args)
```

The ```exchange.Log()``` function is used to output order placement and cancellation logs in the log column area. When this function is called, it does not actually place an order; it is only used to output and record trading logs.

Parameters:

- `orderType` (number, required): The ```orderType``` parameter is used to set the type of log to output. The available values are `LOG_TYPE_BUY`, `LOG_TYPE_SELL`, `LOG_TYPE_CANCEL`.
- `price` (number, required): The ```price``` parameter is used to set the price displayed in the log.
- `amount` (number, required): The ```amount``` parameter is used to set the order quantity displayed in the log.
- `arg` (string / number / bool / object / array / any (any type supported by the platform), optional): An extension parameter used to output additional information to this log entry. Multiple ```arg``` parameters can be passed in.

Using ```exchange.Log(orderType, price, amount)``` allows you to perform live order-following tests and simulated order placement, and it can also assist in recording order information.

    The most common use case is: accessing the exchange's conditional order creation interface through the `exchange.IO` function, but calling the ```exchange.IO()``` function does not output trading log information in the live log.

    In this case, you can use the ```exchange.Log()``` function to supplement the log output in order to record the order information. The same applies to cancellation operations.

```javascript
var id = 123
function main() {
    // Order type buy, price 999, quantity 0.1
    exchange.Log(LOG_TYPE_BUY, 999, 0.1)
    // Cancel order
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
    // Order type buy, price 999, quantity 0.1
    exchange.Log(LOG_TYPE_BUY, 999, 0.1);
    // Cancel order; when orderType is LOG_TYPE_CANCEL, the price parameter is the order Id to be canceled (in Rust the amount parameter is required and can be passed as 0)
    exchange.Log(LOG_TYPE_CANCEL, id, 0);
}
```

When the ```orderType``` parameter is ```LOG_TYPE_CANCEL```, the ```price``` parameter represents the order Id to be canceled, which is used to print the cancellation log when canceling an order by directly calling the ```exchange.IO()``` function.

  The ```exchange.Log()``` function is a member function of the `exchange` exchange object, which is distinct from the global function `Log`.

See also: `Log`, `exchange`, `LOG_TYPE_BUY`, `LOG_TYPE_SELL`, `LOG_TYPE_CANCEL`

### Market

#### exchange.GetTicker

```
exchange.GetTicker()
exchange.GetTicker(symbol)
```

Retrieves the `Ticker` structure (i.e., the market data) corresponding to the spot or contract of the currently configured trading pair and contract code. The ```GetTicker()``` function is a member function of the exchange object `exchange`. The purpose of the member functions (methods) of the ```exchange``` object is related only to ```exchange```, which will not be repeated in the subsequent documentation.

Parameters:

- `symbol` (string, optional): The parameter ```symbol``` is used to specify the exact trading pair and contract code corresponding to the requested `Ticker` data. If this parameter is not passed, the market data of the currently configured trading pair and contract code is requested by default.

When calling the ```exchange.GetTicker(symbol)``` function and ```exchange``` is a spot exchange object, if you need to request market data with USDT as the quote currency and BTC as the trading currency, the parameter ```symbol``` is: ```"BTC_USDT"```, whose format is the trading pair format defined by the FMZ platform.

When calling the ```exchange.GetTicker(symbol)``` function and ```exchange``` is a futures exchange object, if you need to request market data of the BTC USDT-margined perpetual contract, the parameter ```symbol``` is: ```"BTC_USDT.swap"```, whose format is the combination of the **trading pair** and **contract code** defined by the FMZ platform, separated by the character ".".

When calling the ```exchange.GetTicker(symbol)``` function and ```exchange``` is a futures exchange object, if you need to request market data of the BTC USDT-margined options contract, the parameter ```symbol``` is: ```"BTC_USDT.BTC-240108-40000-C"``` (taking the Binance option BTC-240108-40000-C as an example), whose format is the combination of the **trading pair** defined by the FMZ platform and the specific options contract code defined by the exchange, separated by the character ".".

Returns (`Ticker` / null value): The ```exchange.GetTicker()``` function returns the `Ticker` structure when the data request succeeds, and returns a null value when the data request fails.

For a futures exchange object (i.e., ```exchange``` or ```exchanges[0]```), you need to first use the ```exchange.SetContractType()``` function to set the contract code before calling the market data functions, which will not be repeated in the subsequent documentation.

```javascript
function main(){
    // If it is a futures exchange object, first set the contract code, for example, set it to a perpetual contract
    // exchange.SetContractType("swap")

    var ticker = exchange.GetTicker()
    /*
        Due to network reasons, the exchange interface may be inaccessible (even if the device where the docker program is located can open the exchange website, the API interface may still be unreachable)
        In this case, ticker is null, and accessing ticker.High will cause an error, so when testing this code, make sure the exchange interface is accessible
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
    // If it is a futures exchange object, first set the contract code, for example, set it to a perpetual contract
    // exchange.SetContractType("swap").unwrap();

    let ticker = exchange.GetTicker(None).unwrap();
    Log!("Symbol:", ticker.Symbol, "High:", ticker.High, "Low:", ticker.Low, "Sell:", ticker.Sell, "Buy:", ticker.Buy, "Last:", ticker.Last, "Open:", ticker.Open, "Volume:", ticker.Volume);
}
```

Use the ```symbol``` parameter to request market data of a specific instrument (spot instrument).

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

In the backtesting system, in the ```Ticker``` data returned by the ```exchange.GetTicker()``` function, ```High``` and ```Low``` are simulated values, taken from the best ask price and best bid price of the order book at that time.

In live trading, in the ```Ticker``` data returned by the ```exchange.GetTicker()``` function, the values of ```High``` and ```Low``` are determined based on the data returned by the wrapped exchange's ```Tick``` interface. This data contains the highest price and lowest price within a certain period (usually a 24-hour period).

Exchanges that do not support the ```exchange.GetTicker()``` function:

| Function Name | Unsupported Spot Exchanges | Unsupported Futures Exchanges |
| - | - | - |
| GetTicker | -- | Futures_Aevo |

On the Uniswap exchange (on-chain swaps), ```Buy``` and ```Sell``` are the executable prices for about $1000 (pool fees included) and ```Last``` is their midpoint; on-chain pools have no 24h statistics, so ```High```, ```Low``` and ```Open``` are the current price and ```Volume``` is 0.

See also: `exchange.GetDepth`, `exchange.GetTrades`, `exchange.GetRecords`, `exchange.GetTickers`, `exchange.IO` (API rate limiting control)

#### exchange.GetTickers

```
exchange.GetTickers()
```

The ```exchange.GetTickers()``` function is used to retrieve aggregated market data from the exchange (an array of `Ticker` structures). When ```exchange``` is a spot exchange object, it returns the ticker market data for all trading pairs; when ```exchange``` is a futures exchange object, it returns the ticker market data for all contracts.

Returns (`Ticker` array / null): The ```exchange.GetTickers()``` function returns an array of `Ticker` structures when the data request succeeds, and returns null when the data request fails.

Call the ```exchange.GetTickers()``` function to retrieve aggregated market ticker data.

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

Use a spot exchange object and call the ```exchange.GetTickers()``` function in the backtesting system. Before calling any market data function, GetTickers only returns the ticker data of the current default trading pair; after calling a market data function, it returns the ticker data of all trading pairs that have been requested. You can refer to the following test example:

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

    // Before requesting the market data of other trading pairs, call GetTickers
    var tickers1 = exchange.GetTickers()
    var tbl1 = {type: "table", title: "tickers1", cols: ["Symbol", "High", "Open", "Low", "Last", "Buy", "Sell", "Time", "Volume"], rows: []}
    for (var ticker of tickers1) {
        tbl1.rows.push([ticker.Symbol, ticker.High, ticker.Open, ticker.Low, ticker.Last, ticker.Buy, ticker.Sell, ticker.Time, ticker.Volume])
    }

    // Request the market data of other trading pairs
    for (var symbol of arrSymbol) {
        exchange.GetTicker(symbol)
    }

    // Call GetTickers again
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

    // Before requesting the market data of other trading pairs, call GetTickers
    // The Rust SDK has no JSON serialization, so use format! to concatenate the JSON text of the table
    let tickers1 = exchange.GetTickers().unwrap();
    let rows1 = tickers1.iter().map(tickerToJson).collect::<Vec<String>>().join(",");
    let tbl1 = format!(r#"{{"type": "table", "title": "tickers1", "cols": ["Symbol", "High", "Open", "Low", "Last", "Buy", "Sell", "Time", "Volume"], "rows": [{}]}}"#, rows1);

    // Request the market data of other trading pairs
    for symbol in arrSymbol {
        exchange.GetTicker(symbol);
    }

    // Call GetTickers again
    let tickers2 = exchange.GetTickers().unwrap();
    let rows2 = tickers2.iter().map(tickerToJson).collect::<Vec<String>>().join(",");
    let tbl2 = format!(r#"{{"type": "table", "title": "tickers2", "cols": ["Symbol", "High", "Open", "Low", "Last", "Buy", "Sell", "Time", "Volume"], "rows": [{}]}}"#, rows2);

    LogStatus!(format!("`[{},{}]`", tbl1, tbl2));
}
```

Notes:

- This function requests the exchange's aggregated market data interface. There is no need to set a trading pair or contract code before calling it, and it only returns market data for trading instruments that are already listed on the exchange.

- The backtesting system supports this function.

- Exchange objects that do not provide an aggregated market data interface do not support this function.

- This function does not support options contracts.

Exchanges that do not support the ```exchange.GetTickers()``` function:

| Function Name | Unsupported Spot Exchanges | Unsupported Futures Exchanges |
| - | - | - |
| GetTickers | Zaif / WOO / Gemini / Coincheck / BitFlyer / Bibox / Uniswap | Futures_WOO / Futures_dYdX / Futures_Deribit / Futures_Bibox / Futures_Aevo / Futures_edgeX |

See also: `Ticker`, `exchange.GetTicker`

#### exchange.GetDepth

```
exchange.GetDepth()
exchange.GetDepth(symbol)
```

Gets the `Depth` structure, i.e. the order book data, of the spot or contract corresponding to the currently set trading pair and contract code.

Parameters:

- `symbol` (string, optional): The ```symbol``` parameter is used to specify the exact trading pair or contract code corresponding to the requested `Depth` data. If this parameter is not passed, the order book data of the currently set trading pair and contract code is requested by default.

When calling the ```exchange.GetDepth(symbol)``` function, if ```exchange``` is a spot exchange object and you need to request the order book data with USDT as the quote currency and BTC as the trading currency, then the ```symbol``` parameter should be ```"BTC_USDT"```, whose format is the trading pair format defined by the FMZ platform.

When calling the ```exchange.GetDepth(symbol)``` function, if ```exchange``` is a futures exchange object and you need to request the order book data of the BTC USDT-margined perpetual contract, then the ```symbol``` parameter should be ```"BTC_USDT.swap"```, whose format is a combination of the **trading pair** and **contract code** defined by the FMZ platform, separated by the character ".".

When calling the ```exchange.GetDepth(symbol)``` function, if ```exchange``` is a futures exchange object and you need to request the order book data of a BTC USDT-margined options contract, then the ```symbol``` parameter should be ```"BTC_USDT.BTC-240108-40000-C"``` (taking the Binance option BTC-240108-40000-C as an example), whose format is a combination of the **trading pair** defined by the FMZ platform and the specific options contract code defined by the exchange, separated by the character ".".

Returns (`Depth` / null): The ```exchange.GetDepth()``` function returns the `Depth` structure when the data request succeeds, and returns null when the data request fails.

Test the ```exchange.GetDepth()``` function:

```javascript
function main(){
    var depth = exchange.GetDepth()
    /*
        Due to network reasons, the exchange interface may be inaccessible (even if the device where the docker program runs can open the exchange website, the API interface may still be unreachable)
        In this case depth is null, and accessing depth.Asks[1].Price will cause an error, so when testing this code make sure the exchange interface is accessible
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

When the configured ```exchange``` object is a futures exchange object, use the ```symbol``` parameter to request the order book data of a specified instrument (futures instrument).

```javascript
function main() {
    // BTC USDT-margined perpetual contract
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
    // BTC USDT-margined perpetual contract
    let depth = exchange.GetDepth("BTC_USDT.swap").unwrap();
    Log!(depth);
}
```

In the backtesting system, when backtesting with **Simulated-level Tick**, all levels of the data returned by the ```exchange.GetDepth()``` function are simulated values.

In the backtesting system, when backtesting with **Live-level Tick**, the data returned by the ```exchange.GetDepth()``` function is a second-level depth snapshot.

The Uniswap exchange (on-chain swaps) has no order book; its depth is derived from on-chain quotes at sizes increasing from about $1000: each level's ```Amount``` is the base currency added at that level and its ```Price``` is the marginal fill price of that level.

See also: `exchange.GetTicker`, `exchange.GetTrades`, `exchange.GetRecords`

#### exchange.GetTrades

```
exchange.GetTrades()
exchange.GetTrades(symbol)
```

Gets the `Trade` structure array of the spot or futures corresponding to the currently set trading pair and contract code, i.e. the market's trade (tick) data.

Parameters:

- `symbol` (string, optional): The parameter ```symbol``` is used to specify the exact trading pair and contract code corresponding to the requested `Trade` array data. If this parameter is not passed, the most recent trade records of the currently set trading pair and contract code are requested by default.

When calling the ```exchange.GetTrades(symbol)``` function, if ```exchange``` is a spot exchange object and you need to request the trade data with USDT as the quote currency and BTC as the base currency, then the parameter ```symbol``` is: ```"BTC_USDT"```, whose format is the trading pair format defined by the FMZ platform.

When calling the ```exchange.GetTrades(symbol)``` function, if ```exchange``` is a futures exchange object and you need to request the trade data of BTC's USDT-margined perpetual contract, then the parameter ```symbol``` is: ```"BTC_USDT.swap"```, whose format is a combination of the **trading pair** and **contract code** defined by the FMZ platform, separated by the character ".".

When calling the ```exchange.GetTrades(symbol)``` function, if ```exchange``` is a futures exchange object and you need to request the trade data of BTC's USDT-margined options contract, then the parameter ```symbol``` is: ```"BTC_USDT.BTC-240108-40000-C"``` (taking Binance option BTC-240108-40000-C as an example), whose format is a combination of the **trading pair** defined by the FMZ platform and the specific options contract code defined by the exchange, separated by the character ".".

Returns (`Trade` array / null): The ```exchange.GetTrades()``` function returns the `Trade` structure array when the data request succeeds, and returns null when the data request fails.

Test the ```exchange.GetTrades()``` function:

```javascript
function main(){
    var trades = exchange.GetTrades()
    /*
        Due to network reasons, the exchange interface may be inaccessible (even if the device where the docker program is located can open the exchange website, the API interface may still be unreachable)
        In this case trades is null, and accessing trades[0].Id will cause an error, so when testing this code, make sure the exchange interface is accessible
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

When the configured ```exchange``` object is a futures exchange object, use the ```symbol``` parameter to request the market trade record data of a specific instrument (futures instrument).

```javascript
function main() {
    // BTC's USDT-margined perpetual contract
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
    // BTC's USDT-margined perpetual contract
    let trades = exchange.GetTrades("BTC_USDT.swap").unwrap();
    Log!(trades);
}
```

The ```exchange.GetTrades()``` function is used to get the trade history (not your own trades) of the market corresponding to the current trading pair and contract. Some exchanges do not support this function, and the specific range of trade records returned varies from exchange to exchange, which needs to be handled according to the actual situation. The returned data is an array, in which the time order of each element is consistent with the order of the data returned by the ```exchange.GetRecords()``` function, i.e. the last element of the array is the data closest to the current time.

In the backtesting system, when backtesting with **simulation-level Tick**, the ```exchange.GetTrades()``` function returns an empty array.

In the backtesting system, when backtesting with **live-trading-level Tick**, the data returned by the ```exchange.GetTrades()``` function is order flow snapshot data, i.e. the `Trade` structure array.

Exchanges that do not support the ```exchange.GetTrades()``` function:

| Function Name | Unsupported Spot Exchanges | Unsupported Futures Exchanges |
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

Get the `Record` structure array (i.e. K-line data) of the spot or contract corresponding to the currently set trading pair or contract code.

Parameters:

- `symbol` (string, optional): The ```symbol``` parameter is used to specify the exact trading pair or contract code corresponding to the requested `Record` array data. If this parameter is not passed, the K-line data of the currently set trading pair or contract code is requested by default.

When calling the ```exchange.GetRecords(symbol)``` function, if ```exchange``` is a spot exchange object and you need to request K-line data with USDT as the quote currency and BTC as the base currency, then the ```symbol``` parameter is: ```"BTC_USDT"```, which follows the trading pair format defined by the FMZ platform.

When calling the ```exchange.GetRecords(symbol)``` function, if ```exchange``` is a futures exchange object and you need to request K-line data for BTC's USDT-margined perpetual contract, then the ```symbol``` parameter is: ```"BTC_USDT.swap"```, which follows the format defined by the FMZ platform combining the **trading pair** and the **contract code**, separated by the character ".".

When calling the ```exchange.GetRecords(symbol)``` function, if ```exchange``` is a futures exchange object and you need to request K-line data for BTC's USDT-margined options contract, then the ```symbol``` parameter is: ```"BTC_USDT.BTC-240108-40000-C"``` (taking the Binance option BTC-240108-40000-C as an example), which follows the format defined by the FMZ platform combining the **trading pair** with the specific option contract code defined by the exchange, separated by the character ".".
- `period` (number, optional): The ```period``` parameter is used to specify the period of the requested K-line data, for example: `PERIOD_M1`, `PERIOD_M5`, `PERIOD_M15`, etc. In addition to accepting the predefined standard periods, the ```period``` parameter can also accept an integer value in seconds. If this parameter is not passed, the requested K-line data period defaults to the default K-line period configured for the current strategy's live trading/backtest.
- `limit` (number, optional): The ```limit``` parameter is used to specify the length of the requested K-line data. If this parameter is not passed, the default requested length is the maximum number of K-line bars that the exchange's K-line interface can request at once. This parameter may trigger paginated queries of the exchange's K-line data, and the call duration of this function will increase accordingly when paginated queries are performed.

Returns (`Record` array / null value): The ```exchange.GetRecords()``` function returns a `Record` structure array when the data request succeeds, and returns a null value when the data request fails.

Get K-line data for a custom period.

```javascript
function main() {
    // Print K-line data with a K-line period of 120 seconds (2 minutes)
    Log(exchange.GetRecords(60 * 2))
    // Print K-line data with a K-line period of 5 minutes
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
    // Print K-line data with a K-line period of 120 seconds (2 minutes)
    Log!(exchange.GetRecords(None, 60 * 2, None));
    // Print K-line data with a K-line period of 5 minutes
    Log!(exchange.GetRecords(None, PERIOD_M5, None));
}
```

Output K-line bar data:

```javascript
function main() {
    var records = exchange.GetRecords(PERIOD_H1)
    /*
        Due to network reasons, it may not be possible to access the exchange interface (even if the device running the docker program can open the exchange website, the API interface may still be inaccessible)
        In this case, records is null, and accessing records[0].Time will cause an error. Therefore, when testing this code, please make sure you can access the exchange interface normally
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

When the configured ```exchange``` object is a futures exchange object, you can use the ```symbol```, ```period```, and ```limit``` parameters to request K-line data for a specified instrument (futures instrument).

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

The default K-line period can be set on the backtesting and live trading pages. When calling the ```exchange.GetRecords()``` function, if a parameter is specified, it retrieves the K-line data for the period specified by that parameter; if no parameter is specified, it returns the K-line data for the period set in the backtesting or live trading parameters.

The return value is a ```Record``` structure array. The returned K-line data accumulates continuously over time, and the upper limit of the accumulated number of K-line bars is affected by the setting of the ```exchange.SetMaxBarLen()``` function. When not set, the default upper limit is 5000 K-line bars. Once the K-line data reaches the accumulation limit, each time a new K-line bar is added, the earliest K-line bar is deleted (similar to the first-in-first-out behavior of a queue). Some exchanges do not provide a K-line interface, in which case the docker collects market trade record data (a ```Trade``` structure array) in real time to synthesize K-lines.

If the exchange's K-line interface supports paginated queries, when calling the ```exchange.SetMaxBarLen()``` function to set a large K-line length, the system will initiate multiple API requests.

When the ```exchange.GetRecords()``` function is called for the first time, the number of K-line bars obtained differs between the backtesting and live trading environments:

  - The backtesting system pre-fetches a certain number of K-line bars prior to the start time of the backtesting time range (5000 by default; the relevant settings and data volume of the backtesting system will affect the final returned number) as the initial K-line data.

  - In live trading, the actual number of K-line bars obtained depends on the maximum amount of data that the exchange's K-line interface can provide.

Setting the ```period``` parameter to 5 means requesting K-line data with a period of 5 seconds. If the ```period``` parameter is not divisible by 60 (i.e., the represented period cannot be expressed in units of minutes), the underlying system will use the relevant interface of ```exchange.GetTrades()``` to obtain trade record data in order to synthesize the required K-line data; if the ```period``` parameter is divisible by 60, then 1-minute K-line data is used at minimum (using as large a period as possible) to synthesize the required K-line data.

In the simulation-level backtesting of the backtesting system, because the underlying K-line period must be set (during simulation-level backtesting, the system uses the corresponding K-line data to generate Tick data based on the configured underlying K-line period), the following must be noted: the K-line data period obtained in the strategy cannot be smaller than the underlying K-line period. This is because in simulation-level backtesting, the K-line data of each period is synthesized from the K-line data corresponding to the underlying K-line period.

Exchanges that do not support the ```exchange.GetRecords()``` function:

  | Function Name | Unsupported Spot Exchanges | Unsupported Futures Exchanges |
  | - | - | - |
  | GetRecords | Zaif / Coincheck / BitFlyer / Uniswap | Futures_Aevo |

See also: `exchange.GetTicker`, `exchange.GetDepth`, `exchange.GetTrades`, `exchange.SetMaxBarLen`

#### exchange.GetMarkets

```
exchange.GetMarkets()
```

The ```exchange.GetMarkets()``` function is used to retrieve market information from the exchange.

Returns (object / null): A dictionary containing `Market` structures.

Call example for a futures exchange object:

```javascript
function main() {
    var markets = exchange.GetMarkets()
    var currency = exchange.GetCurrency()

    // To get the current contract code you can also use the exchange.GetContractType() function
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

    // To get the current contract code you can also use the exchange.GetContractType() function
    let ct = "swap";

    let key = format!("{}.{}", currency, ct);
    Log!(key, ":", format!("{:?}", markets.get(&key)));
}
```

In the backtesting system, use the futures exchange object to call the ```exchange.GetMarkets()``` function. Before calling any market data function, GetMarkets only returns the market data of the current default trading pair; after calling a market data function, it returns the market data of all symbols that have already been requested. Refer to the following test example:

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

    // The Rust SDK has no JSON serialization feature; here format! is used to concatenate the table's JSON text
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

The return value of the ```exchange.GetMarkets()``` function is a dictionary. For spot exchanges, the key is the trading instrument name, in a fixed trading pair format, for example:
```json
{
    "BTC_USDT" : {...},  // The value is a Market structure
    "LTC_USDT" : {...},
    ...
}
```

For futures contract exchanges, since the same instrument may have multiple contracts—for example, the ```BTC_USDT``` trading pair includes perpetual contracts, quarterly contracts, etc.—the keys in the dictionary returned by the ```exchange.GetMarkets()``` function are a combination of the trading pair and the contract code, for example:
```json
{
    "BTC_USDT.swap" : {...},     // The value is a Market structure
    "BTC_USDT.quarter" : {...},
    "LTC_USDT.swap" : {...},
    ...
}
```

- The ```exchange.GetMarkets()``` function is supported by both live trading and the backtesting system.

- The ```exchange.GetMarkets()``` function only returns market information for trading instruments that are already listed on the exchange.

- Options: the results of Futures_Deribit, Futures_Bybit, Futures_GateIO and Futures_Aevo include option contracts (keys such as ```ETH_USDT.ETH-25JUN27-2800-C-USDT```); on other exchanges (e.g. Futures_Binance, Futures_OKX, Futures_Kraken) option contracts are not included.

Exchanges that do not support the ```exchange.GetMarkets()``` function:

| Function Name | Unsupported Spot Exchanges | Unsupported Futures Exchanges |
| - | - | - |
| GetMarkets | Coincheck / Bithumb / BitFlyer | -- |

See also: `Market`

#### exchange.GetRawJSON

```
exchange.GetRawJSON()
```

Get the raw content returned by the most recent ```rest``` request from the current exchange object (`exchange`, `exchanges`).

Returns (string): Response data from the ```rest``` request.

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

The ```exchange.GetRawJSON()``` function only supports live trading.

See also: `exchange`

#### exchange.SetData

```
exchange.SetData(key, value)
```

The ```exchange.SetData()``` function is used to set the data loaded when the strategy is running.

Parameters:

- `key` (string, required): The name of the data collection.
- `value` (array, required): The data to be loaded by the ```exchange.SetData()``` function, whose data structure is an array. This data structure is the same as the format required by the ```exchange.GetData()``` function when requesting external data, namely: ```"schema": ["time", "data"]```.

Returns (number): The string length of the ```value``` parameter after being JSON-encoded.

The data format required by the ```value``` parameter is like the ```data``` variable in the following example. As you can see, the timestamp ```1579622400000``` corresponds to the time ```2020-01-22 00:00:00```. When the running time of the strategy program exceeds this time and is before the timestamp ```1579708800000``` of the next data entry (i.e. the time ```2020-01-23 00:00:00```), calling the ```exchange.GetData()``` function will always retrieve the content of this data entry ```[1579622400000, 123]```. As the program continues to run and time passes, and so on, the data can be retrieved entry by entry.

In the following example, when the current moment of the runtime (backtesting or live trading) reaches or exceeds the timestamp ```1579795200000```, calling the ```exchange.GetData()``` function returns: ```{"Time":1579795200000,"Data":["abc",123,{"price":123}]}```. Here ```"Time":1579795200000``` corresponds to ```1579795200000``` in the data ```[1579795200000, ["abc", 123, {"price": 123}]]```; ```"Data":["abc",123,{"price":123}]``` corresponds to ```["abc", 123, {"price": 123}]``` in the data ```[1579795200000, ["abc", 123, {"price": 123}]]```.

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
    // In the Rust SDK, the data argument of SetData is a JSON string
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

The loaded data can be any economic indicator, industry data, related index, etc., used to quantitatively evaluate various types of quantifiable information within the strategy.

See also: `exchange.GetData`

#### exchange.GetData

```
exchange.GetData(key)
exchange.GetData(key, timeout)
```

The ```exchange.GetData()``` function is used to retrieve data loaded by the ```exchange.SetData()``` function, or data provided by an external link.

Parameters:

- `key` (string, required): The name of the dataset, or the data request URL.
- `timeout` (number, optional): Used to set the cache timeout period, in milliseconds. In live trading, the default cache timeout is one minute.

Returns (object / null value): The records in the dataset, or the data returned by the request.

How to call the method for writing data directly.

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
    // In the Rust SDK, the data parameter of SetData is a JSON string; use format! to concatenate the data
    let data = format!(r#"[[1579536000000, "{}"], [1579622400000, "{}"], [1579708800000, "{}"]]"#, _D(1579536000000), _D(1579622400000), _D(1579708800000));
    exchange.SetData("test", &data);
    loop {
        Log!(exchange.GetData("test"));
        Sleep(1000 * 60 * 60 * 24);
    }
}
```

Data can be requested through external links. The data format returned by the request is as follows:
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

Here ```schema``` defines the data format of each record in the data body. This format is fixed as ```["time","data"]```, corresponding one-to-one with the format of each piece of data in the ```data``` attribute. The ```data``` attribute is used to store the data body, where each piece of data consists of a millisecond-level timestamp and the data content (the data content can be any JSON-encodable data).

The following is a test service program written in Go:
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

The response data returned by the program after receiving the request:
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

The test strategy code is as follows:

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

How to call the method for fetching data from external links.

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

Request the query data created on the [datadata](https://www.datadata.com) platform. The response data format must meet the following requirements (the schema must describe the time and data fields):
```json
{
    "data": [],
    "schema": ["time", "data"]
}
```

The "data" field contains the required data content, and the data in the "data" field must be consistent with the fields defined in the "schema". When calling the ```exchange.GetData()``` function, a JSON object is returned, for example: ```{"Time":1579795200000, "Data":"..."}```.

```javascript
function main() {
    Log(exchange.GetData("https://www.datadata.com/api/v1/query/xxx/data"))   // The xxx part in the link is the code of the query data; xxx here is just an example
}
```

```python
def main():
    Log(exchange.GetData("https://www.datadata.com/api/v1/query/xxx/data"))
```

```rust
fn main() {
    Log!(exchange.GetData("https://www.datadata.com/api/v1/query/xxx/data"));   // The xxx part in the link is the code of the query data; xxx here is just an example
}
```

In backtesting, the data is retrieved all at once; in live trading, the data is cached for one minute. In the backtesting system, when requesting data via an access interface, the backtesting system automatically adds parameters such as ```from``` (timestamp, in seconds), ```to``` (timestamp, in seconds), and ```period``` (the underlying K-line period, timestamp, in milliseconds) to the request, in order to determine the time range of the data to be retrieved.

See also: `exchange.SetData`

### Trade

#### exchange.Buy

```
exchange.Buy(price, amount)
exchange.Buy(price, amount, ...args)
```

The ```exchange.Buy()``` function is used to place a buy order. The ```Buy()``` function is a member function of the exchange object `exchange`. The ```Buy()``` function operates on the exchange account bound to the exchange object ```exchange```. The purpose of the member functions (methods) of the ```exchange``` object is only related to ```exchange```, which will not be repeated in the rest of this document.

Parameters:

- `price` (number, required): The ```price``` parameter is used to set the order price.
- `amount` (number, required): The ```amount``` parameter is used to set the order amount.
- `arg` (string / number / bool / object / array / any (any type supported by the platform), optional): Extension parameter used to output accompanying information to this order log. Multiple ```arg``` parameters can be passed in.

Returns (string / null value): Returns the order Id if the order is placed successfully, and returns a null value if the order fails. The ```Id``` attribute of the order `Order` structure on the FMZ platform consists of the exchange symbol code and the exchange's original order Id, separated by an English comma. For example, the ```Id``` attribute format of an order for the OKX exchange spot trading pair ```ETH_USDT``` is: ```ETH-USDT,1547130415509278720```. When calling the ```exchange.Buy()``` function to place an order, the returned order ```Id``` is consistent with the ```Id``` attribute of the order `Order` structure.

The order number returned by ```exchange.Buy()``` can be used to query order information and cancel orders.

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

When placing an order for a cryptocurrency futures contract, you must pay attention to whether the trading direction is set correctly. If the trading direction does not match the trading function, an error will be reported:

    ```log

    direction is sell, invalid order type Buy

    direction is buy, invalid order type Sell

    direction is closebuy, invalid order type Buy

    direction is closesell, invalid order type Sell

    ```

```javascript
// The following are incorrect calls
function main() {
    exchange.SetContractType("quarter")

    // Set the short direction
    exchange.SetDirection("sell")
    // Placing a buy order will report an error; shorting can only sell
    var id = exchange.Buy(50, 1)

    // Set the long direction
    exchange.SetDirection("buy")
    // Placing a sell order will report an error; going long can only buy
    var id2 = exchange.Sell(60, 1)

    // Set the close-long direction
    exchange.SetDirection("closebuy")
    // Placing a buy order will report an error; closing long can only sell
    var id3 = exchange.Buy(-1, 1)

    // Set the close-short direction
    exchange.SetDirection("closesell")
    // Placing a sell order will report an error; closing short can only buy
    var id4 = exchange.Sell(-1, 1)
}
```

```python
# The following are incorrect calls
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
// The following are incorrect calls
fn main() {
    let _ = exchange.SetContractType("quarter");

    // Set the short direction
    let _ = exchange.SetDirection("sell");
    // Placing a buy order will report an error; shorting can only sell
    let id = exchange.Buy(50, 1);

    // Set the long direction
    let _ = exchange.SetDirection("buy");
    // Placing a sell order will report an error; going long can only buy
    let id2 = exchange.Sell(60, 1);

    // Set the close-long direction
    let _ = exchange.SetDirection("closebuy");
    // Placing a buy order will report an error; closing long can only sell
    let id3 = exchange.Buy(-1, 1);

    // Set the close-short direction
    let _ = exchange.SetDirection("closesell");
    // Placing a sell order will report an error; closing short can only buy
    let id4 = exchange.Sell(-1, 1);
}
```

Spot market order.

```javascript
// For example, trading pair: ETH_BTC, market order buy
function main() {
    // Place a market order to buy, buying ETH worth 0.1 BTC (quote currency)
    exchange.Buy(-1, 0.1)
}
```

```python
def main():
    exchange.Buy(-1, 0.1)
```

```rust
// For example, trading pair: ETH_BTC, market order buy
fn main() {
    // Place a market order to buy, buying ETH worth 0.1 BTC (quote currency)
    let _ = exchange.Buy(-1, 0.1);
}
```

When placing an order for a futures contract, you must pay attention to whether the trading direction is set correctly. If the trading direction does not match the trading function, an error will be reported. Unless otherwise specified, the order amount on cryptocurrency futures contract exchanges is denominated in number of contracts.

When the ```price``` parameter is set to ```-1```, it is used to place a market order. This feature requires the exchange's order placement interface to support market orders. When placing a buy order for cryptocurrency spot in the form of a market order, the order amount parameter ```amount``` is the amount denominated in the quote currency. When placing an order for a cryptocurrency futures contract in the form of a market order, the unit of the order amount parameter ```amount``` is number of contracts. In live trading, a few cryptocurrency exchanges do not support the market order interface. For a few spot exchanges, the order amount of a market buy order is the number of trading coins. For details, please refer to the **Exchange Special Notes** in the "User Guide".

If you are using an older version of the docker, the order ```Id``` returned by the ```exchange.Buy()``` function may differ from the return value order ```Id``` described in the current document.

It should be noted that the order placement interfaces of the following three exchanges are relatively special. For spot market buy orders, the order amount is the number of coins rather than the amount.

  - ```AscendEx```

  - ```BitMEX```

  - ```Bitfinex```

See also: `exchange.Sell`, `exchange.SetContractType`, `exchange.SetDirection`, `exchange.IO` (API rate limit control; the Buy function is affected by the CreateOrder rate limit setting)

#### exchange.Sell

```
exchange.Sell(price, amount)
exchange.Sell(price, amount, ...args)
```

The ```exchange.Sell()``` function is used to place a sell order.

Parameters:

- `price` (number, required): The ```price``` parameter is used to set the order price.
- `amount` (number, required): The ```amount``` parameter is used to set the order size.
- `arg` (string / number / bool / object / array / any (any type supported by the platform), optional): An extension parameter used to output additional information attached to this order log. Multiple ```arg``` parameters can be passed in.

Returns (string / null value): Returns the order Id when the order is placed successfully, and returns a null value when the order fails. The ```Id``` property of the FMZ platform's `Order` structure consists of the exchange symbol code and the exchange's original order Id, separated by an English comma. For example, the ```Id``` property format of an order for the spot trading pair ```ETH_USDT``` on the OKX exchange is: ```ETH-USDT,1547130415509278720```. When calling the ```exchange.Sell()``` function to place an order, the returned order ```Id``` is consistent with the ```Id``` property of the order `Order` structure.

The order number returned by ```exchange.Sell()``` can be used to query order information and cancel orders.

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

When placing orders for cryptocurrency futures contracts, you must pay attention to whether the trading direction is set correctly. If the trading direction does not match the trading function, an error will be reported:

```log

direction is sell, invalid order type Buy

direction is buy, invalid order type Sell

direction is closebuy, invalid order type Buy

direction is closesell, invalid order type Sell

```

```javascript
// The following are incorrect calls
function main() {
    exchange.SetContractType("quarter")

    // Set the short direction
    exchange.SetDirection("sell")
    // Placing a buy order will report an error; shorting can only sell
    var id = exchange.Buy(50, 1)

    // Set the long direction
    exchange.SetDirection("buy")
    // Placing a sell order will report an error; going long can only buy
    var id2 = exchange.Sell(60, 1)

    // Set the close-long direction
    exchange.SetDirection("closebuy")
    // Placing a buy order will report an error; closing a long can only sell
    var id3 = exchange.Buy(-1, 1)

    // Set the close-short direction
    exchange.SetDirection("closesell")
    // Placing a sell order will report an error; closing a short can only buy
    var id4 = exchange.Sell(-1, 1)
}
```

```python
# The following are incorrect calls
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
// The following are incorrect calls
fn main() {
    let _ = exchange.SetContractType("quarter");

    // Set the short direction
    let _ = exchange.SetDirection("sell");
    // Placing a buy order will report an error; shorting can only sell
    let id = exchange.Buy(50, 1);

    // Set the long direction
    let _ = exchange.SetDirection("buy");
    // Placing a sell order will report an error; going long can only buy
    let id2 = exchange.Sell(60, 1);

    // Set the close-long direction
    let _ = exchange.SetDirection("closebuy");
    // Placing a buy order will report an error; closing a long can only sell
    let id3 = exchange.Buy(-1, 1);

    // Set the close-short direction
    let _ = exchange.SetDirection("closesell");
    // Placing a sell order will report an error; closing a short can only buy
    let id4 = exchange.Sell(-1, 1);
}
```

Spot market order.

```javascript
// For example, trading pair: ETH_BTC, sell with a market order
function main() {
    // Note: place a market order to sell, selling 0.2 ETH
    exchange.Sell(-1, 0.2)
}
```

```python
def main():
    exchange.Sell(-1, 0.2)
```

```rust
// For example, trading pair: ETH_BTC, sell with a market order
fn main() {
    // Note: place a market order to sell, selling 0.2 ETH
    let _ = exchange.Sell(-1, 0.2);
}
```

When placing orders for futures contracts, you must pay attention to whether the trading direction is set correctly. If the trading direction does not match the trading function, an error will be reported. For cryptocurrency futures contract exchanges, the order size is denominated in number of contracts unless otherwise specified.

When the ```price``` parameter is set to ```-1```, it is used to place a market order, which requires the exchange's order interface to support market orders. When trading cryptocurrency spot with market orders, when placing a sell order, the order size parameter ```amount``` is denominated in the trading currency. When trading cryptocurrency futures contracts with market orders, the order size parameter ```amount``` is denominated in number of contracts. In live trading, a few cryptocurrency exchanges do not support the market order interface.

If you are using an older version of the docker, the order ```Id``` returned by the ```exchange.Sell()``` function may differ from the returned order ```Id``` described in the current documentation.

See also: `exchange.Buy`, `exchange.SetContractType`, `exchange.SetDirection`, `exchange.IO` (API rate limit control; the Sell function is affected by the CreateOrder rate limit setting)

#### exchange.CreateOrder

```
exchange.CreateOrder(symbol, side, price, amount)
exchange.CreateOrder(symbol, side, price, amount, ...args)
```

```exchange.CreateOrder()``` function is used to place orders.

Parameters:

- `symbol` (string, required): The ```symbol``` parameter is used to specify the trading pair or contract code corresponding to the order.

When calling the ```exchange.CreateOrder(symbol, side, price, amount)``` function to place an order, if ```exchange``` is a spot exchange object, and the order's quote currency is USDT and the base currency is BTC, then the ```symbol``` parameter is: ```"BTC_USDT"```, using the trading pair format defined by the FMZ platform.

When calling the ```exchange.CreateOrder(symbol, side, price, amount)``` function to place an order, if ```exchange``` is a futures exchange object, and the order is a USDT-margined perpetual contract order for BTC, then the ```symbol``` parameter is: ```"BTC_USDT.swap"```, using the format defined by the FMZ platform that combines the **trading pair** and **contract code**, with the two separated by the character ".".

When calling the ```exchange.CreateOrder(symbol, side, price, amount)``` function to place an order, if ```exchange``` is a futures exchange object, and the order is a USDT-margined options contract order for BTC, then the ```symbol``` parameter is: ```"BTC_USDT.BTC-240108-40000-C"``` (taking the Binance option BTC-240108-40000-C as an example), using the format that combines the **trading pair** defined by the FMZ platform and the specific options contract code defined by the exchange, with the two separated by the character ".".
- `side` (string, required): The ```side``` parameter is used to specify the trading direction of the order.

For spot exchange objects, the available values for the ```side``` parameter are: ```buy```, ```sell```. Here ```buy``` means buy, and ```sell``` means sell.

For futures exchange objects, the available values for the ```side``` parameter are: ```buy```, ```closebuy```, ```sell```, ```closesell```. Here ```buy``` means open long, ```closebuy``` means close long, ```sell``` means open short, and ```closesell``` means close short.


**Supports additional parameters (option)**: You can pass additional parameters via the ```side``` parameter, in the format: ```"side;{JSON object}"``` or ```"side;key=value&key=value"```.

For example: ```'buy;{"type":"TRAILING_STOP_MARKET","activationPrice":"2300"}'``` or ```"buy;type=TRAILING_STOP_MARKET&activationPrice=2300"```.

Additional parameters are used to pass exchange-specific parameters (such as order type, time-in-force rules, etc.); the specific parameters supported depend on the exchange API.
- `price` (number, required): The ```price``` parameter is used to set the price of the order. When the price is -1, it indicates that the order is a market order.
- `amount` (number, required): The ```amount``` parameter is used to set the order quantity. Note that when the order is a **spot market buy order**, the order quantity represents the purchase amount; for a few spot exchanges, the order quantity of a market buy order is the quantity of the base currency—please refer to the **Exchange Special Notes** in the "User Guide" for details. For futures exchange objects, when using the ```CreateOrder()```/```Buy()```/```Sell()``` functions to place orders, unless otherwise specified, the order quantity parameter ```amount``` is denominated in number of contracts.
- `arg` (string / number / bool / object / array / any (any type supported by the platform), optional): An extension parameter used to output accompanying information to the log of this order; the ```arg``` parameter can be passed in multiple times.

Returns (string / null value): Returns the order Id when the order is placed successfully, and returns a null value when the order fails. The ```Id``` property of the FMZ platform's `Order` structure consists of the exchange symbol code and the exchange's original order Id, separated by a comma. For example, the ```Id``` property of an order for the spot trading pair ```ETH_USDT``` on the OKX exchange has the format: ```ETH-USDT,1547130415509278720```.

When calling the ```exchange.CreateOrder(symbol, side, price, amount)``` function to place an order, the returned order ```Id``` is consistent with the ```Id``` property of the order `Order` structure.

Both spot exchange objects and futures exchange objects place orders by calling the ```exchange.CreateOrder()``` function.

```javascript
function main() {
    var id = exchange.CreateOrder("BTC_USDT", "buy", 60000, 0.01)           // Spot exchange object places an order, trading the BTC_USDT spot trading pair
    // var id = exchange.CreateOrder("BTC_USDT.swap", "buy", 60000, 0.01)   // Futures exchange object places an order, trading BTC's USDT-margined perpetual contract
    Log("Order Id:", id)
}
```

```python
def main():
    id = exchange.CreateOrder("BTC_USDT", "buy", 60000, 0.01)          # Spot exchange object places an order, trading the BTC_USDT spot trading pair
    # id = exchange.CreateOrder("BTC_USDT.swap", "buy", 60000, 0.01)   # Futures exchange object places an order, trading BTC's USDT-margined perpetual contract
    Log("Order Id:", id)
```

```rust
fn main() {
    let id = exchange.CreateOrder("BTC_USDT", "buy", 60000, 0.01);           // Spot exchange object places an order, trading the BTC_USDT spot trading pair
    // let id = exchange.CreateOrder("BTC_USDT.swap", "buy", 60000, 0.01);   // Futures exchange object places an order, trading BTC's USDT-margined perpetual contract
    Log!("Order Id:", id);
}
```

Place an order with additional parameters (option), used to pass exchange-specific parameters.

```javascript
function main() {
    // Pass the option parameter in JSON format
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
    # Pass the option parameter in JSON format
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
    // Pass the option parameter in JSON format (Rust does not support JSON.stringify, so construct the JSON text directly using a raw string)
    let option = r#"{"type": "TRAILING_STOP_MARKET", "activationPrice": "2300", "callbackRate": "0.1"}"#;
    let sideWithOption = format!("buy;{}", option);
    let id = exchange.CreateOrder("SOL_USDT.swap", &sideWithOption, -1, 1).unwrap();
    Log!("Order Id:", id);

    Sleep(2000);
    Log!(exchange.GetOrder(&id));
}
```

Additional parameters (option) can be passed via the ```side``` parameter to specify exchange-specific parameters. The additional parameters must be merged into the ```side``` parameter, in the format ```"side;{JSON object}"``` (recommended) or ```"side;key=value&key=value"``` (URL-encoded format). For example: ```"buy;{\"type\":\"TRAILING_STOP_MARKET\"}"```.

The option parameters supported by different exchanges vary. The specific supported parameters are subject to the exchange's API documentation. Common parameters include: order type (type), time in force (timeInForce), activation price (activationPrice), callback rate (callbackRate), etc.

When using the option parameters, you still need to provide the ```price``` and ```amount``` parameters. If certain parameters have already been passed via option, these base parameters may be overridden by the corresponding parameters in option; the specific behavior depends on the exchange's API implementation.

Uniswap exchange (on-chain swaps): an order swaps on chain immediately and never rests on a book. For a limit order, ```price``` is the worst acceptable fill price, enforced on chain; if the current quote cannot reach it, the call fails without sending a transaction. Market orders (```price``` of -1) are protected by the slippage set with ```exchange.IO("slippage", ...)```. For a market buy, ```amount``` is the quote currency to spend; otherwise it is the base currency amount. The order ID is the transaction hash; canceling sends a replacement transaction with the same nonce, and a mined transaction can no longer be canceled. Supported options are ```slippage``` (slippage for this order) and ```route``` (```v2```, ```v3```, ```hop``` or ```direct```, restricting the route type), e.g. ```"sell;{\"route\":\"v2\"}"```.

See also: `exchange.Buy`, `exchange.Sell`,
  `exchange.ModifyOrder`

#### exchange.ModifyOrder

```
exchange.ModifyOrder(orderId, side, price, amount)
```

The ```exchange.ModifyOrder()``` function is used to modify an existing regular order, allowing you to modify the order's price and quantity. This function supports modifying other order attributes via additional parameters (depending on the support of the exchange API).

Parameters:

- `orderId` (string, required): The ```orderId``` parameter is used to specify the ID of the original order to be modified. The order ID format is consistent with the order ID returned by the `exchange.CreateOrder` function, consisting of the exchange symbol code and the exchange's original order ID, separated by an English comma. For example: ```"ETH-USDT,1547130415509278720"```.
- `side` (string, required): The ```side``` parameter is used to specify the order's trade direction.

For spot exchange objects, the available values for the ```side``` parameter are: ```buy```, ```sell```. Here, ```buy``` means buy and ```sell``` means sell.

For futures exchange objects, the available values for the ```side``` parameter are: ```buy```, ```closebuy```, ```sell```, ```closesell```. Here, ```buy``` means open long position, ```closebuy``` means close long position, ```sell``` means open short position, and ```closesell``` means close short position.


**Supports additional parameters (option)**: Additional parameters can be passed via the ```side``` parameter, in the format ```"side;{JSON object}"``` or ```"side;key=value&key=value"```.

For example: ```"buy;{\"priceMatch\":\"QUEUE_20\"}"``` or ```"buy;priceMatch=QUEUE_20"```.

Additional parameters are used to modify other order attributes (such as the price match mode, etc.); the specific parameters supported depend on the exchange API.
- `price` (number, required): The ```price``` parameter is used to set the new price of the order. When the price is -1, it means the price is not modified, or depending on the exchange API implementation, it may be converted to a market order.
- `amount` (number, required): The ```amount``` parameter is used to set the new order quantity. When the quantity is -1, it means the quantity is not modified. Note that when the order is a **spot market buy order**, the order quantity represents the buy amount; for the market buy orders of certain spot exchanges, the order quantity is the amount of the trading currency.

Returns (string / null value): Returns the order ID when the order modification succeeds, and returns a null value when the modification fails. The returned order ID may be the same as the original order ID or different, depending on the exchange API implementation. Some exchanges return a new order ID after modifying the order, while others keep the order ID unchanged.

Modify the price and quantity of a regular order.

```javascript
function main() {
    // Create a limit buy order
    var id = exchange.CreateOrder("SOL_USDT.swap", "buy", 88, 1)
    Log("Original Order ID:", id)
    Sleep(2000)

    // Query the original order info
    var order = exchange.GetOrder(id)
    Log("Original Order Info:", order)
    Sleep(1000)

    // Modify the order's price and quantity
    var newId = exchange.ModifyOrder(id, "buy", 77, 2)
    Log("Modified Order ID:", newId)
    Sleep(2000)

    // Query the modified order info
    var newOrder = exchange.GetOrder(newId)
    Log("Modified Order Info:", newOrder)

    // Cancel the order
    exchange.CancelOrder(newId)
}
```

```python
def main():
    # Create a limit buy order
    id = exchange.CreateOrder("SOL_USDT.swap", "buy", 88, 1)
    Log("Original Order ID:", id)
    Sleep(2000)

    # Query the original order info
    order = exchange.GetOrder(id)
    Log("Original Order Info:", order)
    Sleep(1000)

    # Modify the order's price and quantity
    newId = exchange.ModifyOrder(id, "buy", 77, 2)
    Log("Modified Order ID:", newId)
    Sleep(2000)

    # Query the modified order info
    newOrder = exchange.GetOrder(newId)
    Log("Modified Order Info:", newOrder)

    # Cancel the order
    exchange.CancelOrder(newId)
```

```rust
fn main() {
    // Create a limit buy order
    let id = exchange.CreateOrder("SOL_USDT.swap", "buy", 88, 1).unwrap();
    Log!("Original Order ID:", id);
    Sleep(2000);

    // Query the original order info
    let order = exchange.GetOrder(&id).unwrap();
    Log!("Original Order Info:", order);
    Sleep(1000);

    // Modify the order's price and quantity
    let newId = exchange.ModifyOrder(&id, "buy", 77, 2).unwrap();
    Log!("Modified Order ID:", newId);
    Sleep(2000);

    // Query the modified order info
    let newOrder = exchange.GetOrder(&newId).unwrap();
    Log!("Modified Order Info:", newOrder);

    // Cancel the order
    let _ = exchange.CancelOrder(&newId);
}
```

Use the additional parameter (option) to modify the order's price match mode.

```javascript
function main() {
    // Create a limit buy order
    var id = exchange.CreateOrder("SOL_USDT.swap", "buy", 77, 1)
    Log("Original Order ID:", id)
    Sleep(2000)

    // Modify the order and set the price match mode to QUEUE_20
    // Pass the additional parameter (JSON format) via the side parameter
    var option = {"priceMatch": "QUEUE_20"}
    var sideWithOption = "buy;" + JSON.stringify(option)

    var newId = exchange.ModifyOrder(id, sideWithOption, -1, 2)
    Log("Modified Order ID:", newId)
    Sleep(2000)

    // Query the modified order information
    var newOrder = exchange.GetOrder(newId)
    Log("Modified Order Info:", newOrder)

    // Cancel the order
    exchange.CancelOrder(newId)
}
```

```python
import json

def main():
    # Create a limit buy order
    id = exchange.CreateOrder("SOL_USDT.swap", "buy", 77, 1)
    Log("Original Order ID:", id)
    Sleep(2000)

    # Modify the order and set the price match mode to QUEUE_20
    # Pass the additional parameter (JSON format) via the side parameter
    option = {"priceMatch": "QUEUE_20"}
    sideWithOption = "buy;" + json.dumps(option)

    newId = exchange.ModifyOrder(id, sideWithOption, -1, 2)
    Log("Modified Order ID:", newId)
    Sleep(2000)

    # Query the modified order information
    newOrder = exchange.GetOrder(newId)
    Log("Modified Order Info:", newOrder)

    # Cancel the order
    exchange.CancelOrder(newId)
```

```rust
fn main() {
    // Create a limit buy order
    let id = exchange.CreateOrder("SOL_USDT.swap", "buy", 77, 1).unwrap();
    Log!("Original Order ID:", id);
    Sleep(2000);

    // Modify the order and set the price match mode to QUEUE_20
    // Pass the additional parameter (JSON format) via the side parameter; Rust does not support JSON.stringify, so construct the JSON text directly using a raw string
    let option = r#"{"priceMatch": "QUEUE_20"}"#;
    let sideWithOption = format!("buy;{}", option);

    let newId = exchange.ModifyOrder(&id, &sideWithOption, -1, 2).unwrap();
    Log!("Modified Order ID:", newId);
    Sleep(2000);

    // Query the modified order information
    let newOrder = exchange.GetOrder(&newId).unwrap();
    Log!("Modified Order Info:", newOrder);

    // Cancel the order
    let _ = exchange.CancelOrder(&newId);
}
```

The order ID returned by the ```exchange.ModifyOrder()``` function may behave differently depending on the exchange API implementation. Some exchange APIs return an updated order ID, while others keep it unchanged. It is recommended to use the returned new order ID for subsequent operations.

The ```exchange.ModifyOrder()``` function does not validate the validity of parameters according to the exchange interface rules, but instead submits the parameters directly to the exchange API. When invalid parameters are passed in (such as a price or quantity of -1), the parameters may be ignored by the exchange, and the order will retain its original attributes unchanged.

Supports passing additional parameters (option) via the ```side``` parameter to modify other order attributes. Additional parameters must be merged with the ```side``` parameter before being passed in, in the format ```"side;{JSON object}"``` (recommended) or ```"side;key=value"``` (URL-encoded format). For example, to modify the price match mode: ```"buy;{\"priceMatch\":\"QUEUE_20\"}"```.

For modifying market orders among regular orders, you need to check specifically whether the exchange API supports it. Some exchanges do not support modifying market orders.

When modifying an order, the order's other attributes (such as order type, position mode, account mode, leverage, order time-in-force rules, etc.) usually retain the settings of the original order. If you need to modify these attributes, they can be passed in via additional parameters (option), provided the exchange API supports it.

Certain exchange APIs may convert an order into a market order when the price parameter is not received (price is -1 or null). For spot market buy orders, note that the unit of the order quantity may be the amount rather than the number of coins.

Support for the order modification feature depends on the specific exchange; some exchanges may not support the order modification feature, or may only support modifying certain parameters. Please consult the API documentation of the corresponding exchange before use.

See also: `exchange.CreateOrder`, `exchange.CancelOrder`, `exchange.GetOrder`, `exchange.GetOrders`

#### exchange.CancelOrder

```
exchange.CancelOrder(orderId)
exchange.CancelOrder(orderId, ...args)
```

The ```exchange.CancelOrder()``` function is used to cancel an order. In the order `Order` structure of the FMZ platform, the property ```Id``` is composed of the exchange's symbol code and the exchange's original order Id, separated by an English comma. For example, for an order of the OKX exchange spot trading pair ```ETH_USDT```, the format of its ```Id``` property is: ```ETH-USDT,1547130415509278720```.

When calling the ```exchange.CancelOrder()``` function to cancel an order, the passed-in parameter ```orderId``` is consistent with the ```Id``` property of the order `Order` structure.

Parameters:

- `orderId` (string, required): The parameter ```orderId``` is used to specify the order to be canceled.
- `arg` (string / number / bool / object / array / any (any type supported by the platform), optional): An extension parameter used to output accompanying information into this order-cancellation log; multiple ```arg``` parameters can be passed in.

Returns (bool): The ```exchange.CancelOrder()``` function returning a truthy value (e.g. ```true```) indicates that the order-cancellation request was sent successfully, while returning a falsy value (e.g. ```false```) indicates that the order-cancellation request failed to be sent. The return value only represents whether the request was sent successfully or not; to determine whether the exchange has actually canceled the order, you can call ```exchange.GetOrders()``` to check.

Cancel an order.

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

Among FMZ's API functions, functions that can produce log output (such as ```Log()```, ```exchange.Buy()```, ```exchange.CancelOrder()```, etc.) can all be accompanied by some output parameters after the required parameters.

For example: ```exchange.CancelOrder(orders[i].Id, orders[i])```, that is, when canceling the order with Id ```orders[i].Id```, additionally output the information of that order, i.e. the `Order` structure ```orders[i]```.

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
        // Rust does not support appending output parameters after the required parameters of CancelOrder; after canceling the order, call the Log! macro separately to output the accompanying information
        let _ = exchange.CancelOrder(&orders[i].Id);
        Log!("Canceled order:", orders[i]);
        Sleep(500);
    }
}
```

If you are using an older version of the docker (hosting agent), the parameter ```orderId``` of the ```exchange.CancelOrder()``` function may differ from the ```orderId``` described in the current documentation.

See also: `exchange.Buy`, `exchange.Sell`, `exchange.GetOrders`, `exchange.ModifyOrder`

#### exchange.GetOrder

```
exchange.GetOrder(orderId)
```

The ```exchange.GetOrder()``` function is used to obtain order information.

Parameters:

- `orderId` (string, required): The ```orderId``` parameter is used to specify the order to be queried. The ```Id``` attribute of the FMZ platform order `Order` structure consists of the exchange symbol code and the exchange's original order Id, separated by an English comma. For example, the ```Id``` attribute of an order for the spot trading pair ```ETH_USDT``` on the OKX exchange has the format: ```ETH-USDT,1547130415509278720```.

When calling the ```exchange.GetOrder()``` function to query an order, the ```orderId``` parameter passed in is consistent with the ```Id``` attribute of the order `Order` structure.

Returns (`Order` / null value): Queries order details based on the order Id. Returns the `Order` structure when the query is successful, and returns a null value when the query fails.

```javascript
function main(){
    var id = exchange.Sell(1000, 1)
    // The parameter id is the order number; fill in the number of the order you want to query
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
    // The parameter id is the order number; fill in the number of the order you want to query
    let order = exchange.GetOrder(&id).unwrap();
    Log!("Id:", order.Id, "Price:", order.Price, "Amount:", order.Amount, "DealAmount:",
        order.DealAmount, "Status:", order.Status, "Type:", order.Type);
}
```

Some exchanges do not support the ```exchange.GetOrder()``` function. The ```AvgPrice``` attribute in the return value `Order` structure is the average filled price; some exchanges do not support this field, and if it is not supported it will be set to 0.

If you are using an older version of the docker, the ```orderId``` parameter of the ```exchange.GetOrder()``` function may differ from the ```orderId``` described in the current documentation.

Exchanges that do not support the ```exchange.GetOrder()``` function:

  | Function Name | Unsupported Spot Exchanges | Unsupported Futures Exchanges |
  | - | - | - |
  | GetOrder | Zaif / Coincheck / Bitstamp | -- |

See also: `Order`, `exchange.GetOrders`, `exchange.GetHistoryOrders`, `exchange.ModifyOrder`

#### exchange.GetOrders

```
exchange.GetOrders()
exchange.GetOrders(symbol)
```

The ```exchange.GetOrders()``` function is used to obtain the current unfilled orders.

Parameters:

- `symbol` (string, optional): The ```symbol``` parameter is used to specify the **trading instrument** or **range of trading instruments** to be queried.

For a spot exchange object, if the ```symbol``` parameter is not passed in, the unfilled order data for all spot instruments is requested.

For a futures exchange object, if the ```symbol``` parameter is not passed in, the unfilled order data for all instruments within the dimension range of the current trading pair and contract code is requested by default.

Returns (`Order` array / null value): The ```exchange.GetOrders()``` function returns a `Order` structure array when the data request succeeds, and returns a null value when the data request fails.

Using a spot exchange object, place buy orders for multiple different trading pairs at half of the current price as the order price, then query the information of unfilled orders.

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

    // Print the information once and then return, to prevent orders from being filled during subsequent backtesting, which would affect data observation
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

    // Rust does not support JSON.stringify, use format! to build the table's JSON text
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

    // Print the information once and then return, to prevent orders from being filled during subsequent backtesting, which would affect data observation
    return;
}
```

Use the futures exchange object to place orders on multiple symbols with different trading pairs and contract codes. The order prices are set far away from the counterparty price at the top of the order book, keeping the orders in an unfilled state, and then query the orders in various ways.

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

    // Print the output once and then return immediately, to prevent orders from being filled later in the backtest and affecting the data observation
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

    // Rust does not support JSON.stringify, so format! is used here to assemble the JSON text of the table
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

    // Print the output once and then return immediately, to prevent orders from being filled later in the backtest and affecting the data observation
    return;
}
```

When calling the ```exchange.GetOrders()``` function, you can pass in the ```Symbol``` parameter to request order data for a specific trading pair or contract code.

```javascript
function main() {
    var orders = exchange.GetOrders("BTC_USDT")           // Spot symbol example
    // var orders = exchange.GetOrders("BTC_USDT.swap")   // Futures symbol example
    Log("orders:", orders)
}
```

```python
def main():
    orders = exchange.GetOrders("BTC_USDT")          # Spot symbol example
    # orders = exchange.GetOrders("BTC_USDT.swap")   # Futures symbol example
    Log("orders:", orders)
```

```rust
fn main() {
    let orders = exchange.GetOrders("BTC_USDT");           // Spot symbol example
    // let orders = exchange.GetOrders("BTC_USDT.swap");   // Futures symbol example
    Log!("orders:", orders);
}
```

In the ```GetOrders``` function, the use cases of the symbol parameter are summarized as follows:

| Exchange Object Category | symbol Parameter | Query Range | Remarks |
| - | - | - | - |
| Spot | Do not pass the symbol parameter | Query all spot trading pairs | Applicable to all calling scenarios; if the exchange interface does not support it, an error is reported and a null value is returned, which will not be repeated below |
| Spot | Specify a trading instrument, with the symbol parameter as: "BTC_USDT" | Query the specified BTC_USDT trading pair | For a spot exchange object, the format of the symbol parameter is: "BTC_USDT" |
| Futures | Do not pass the symbol parameter | Query all trading instruments within the dimension range of the current trading pair and contract code | If the current trading pair is BTC_USDT and the contract code is swap, this queries all USDT-margined perpetual contracts. Equivalent to calling ```GetOrders("USDT.swap")``` |
| Futures | Specify a trading instrument, with the symbol parameter as: "BTC_USDT.swap" | Query the specified BTC USDT-margined perpetual contract | For a futures exchange object, the format of the symbol parameter is: a combination of the **trading pair** and **contract code** defined by the FMZ platform, separated by the character ```"."```. |
| Futures | Specify a range of trading instruments, with the symbol parameter as: "USDT.swap" | Query all USDT-margined perpetual contracts | - |
| Futures exchange supporting options | Do not pass the symbol parameter | Query all option contracts within the dimension range of the current trading pair | If the current trading pair is BTC_USDT and the contract is set to an option contract, for example the Binance option contract: BTC-240108-40000-C |
| Futures exchange supporting options | Specify a specific trading instrument | Query the specified option contract | For example, for the Binance futures exchange, the symbol parameter is: BTC_USDT.BTC-240108-40000-C |
| Futures exchange supporting options | Specify a range of trading instruments, with the symbol parameter as: "USDT.option" | Query all USDT-margined option contracts | - |

In the ```GetOrders``` function, the query dimension ranges for a futures exchange object are summarized as follows:

| symbol Parameter | Request Range Definition | Remarks |
| - | - | - |
| USDT.swap          | Range of USDT-margined perpetual contracts.  | For dimensions not supported by the exchange API interface, an error is reported and a null value is returned when called. |
| USDT.futures       | Range of USDT-margined delivery contracts.  | - |
| USD.swap           | Range of coin-margined perpetual contracts.    | - |
| USD.futures        | Range of coin-margined delivery contracts.    | - |
| USDT.option        | Range of USDT-margined option contracts.  | - |
| USD.option         | Range of coin-margined option contracts.    | - |
| USDT.futures_combo | Range of spread combo contracts.      | Futures_Deribit exchange |
| USD.futures_ff     | Range of multi-collateral delivery contracts. | Futures_Kraken exchange |
| USD.swap_pf        | Range of multi-collateral perpetual contracts. | Futures_Kraken exchange |

When the account represented by the exchange object ```exchange``` has no open orders (i.e., active orders in an unfilled state) **within the query range** or on the **specified trading instrument**, calling this function will return an empty array, that is: ```[]```.

The following exchanges require a symbol parameter to be passed in for the interface that queries current unfilled orders. When calling the GetOrders function on these exchanges, if the symbol parameter is not passed in, only the unfilled orders of the current instrument are requested, rather than the unfilled orders of all instruments (because the exchange interface does not support it).

Zaif, MEXC, LBank, Korbit, Coinw, BitMart, Bithumb, BitFlyer, BigONE.

Exchanges that do not support the ```exchange.GetOrders()``` function:

| Function Name | Unsupported Spot Exchanges | Unsupported Futures Exchanges |
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

```exchange.GetHistoryOrders()``` function is used to retrieve the historical orders of the current trading pair or contract, and supports specifying a particular trading instrument.

Parameters:

- `symbol` (string, optional): The ```symbol``` parameter is used to specify the trading instrument. Take the ```BTC_USDT``` trading pair as an example: when ```exchange``` is a spot exchange object, the ```symbol``` parameter format is ```BTC_USDT```; when ```exchange``` is a futures exchange object, taking a perpetual contract as an example, the ```symbol``` parameter format is ```BTC_USDT.swap```.

If querying order data for an options contract, the ```symbol``` parameter should be set to ```"BTC_USDT.BTC-240108-40000-C"``` (taking the Binance option BTC-240108-40000-C as an example). Its format is a combination of the **trading pair** defined by the FMZ platform and the specific options contract code defined by the exchange, separated by the character ".". If this parameter is not passed, the order data for the currently set trading pair or contract code is requested by default.
- `since` (number, optional): The ```since``` parameter is used to specify the starting timestamp of the query, in milliseconds.
- `limit` (number, optional): The ```limit``` parameter is used to specify the number of orders to query.

Returns (`Order` array / null): The ```exchange.GetHistoryOrders()``` function returns a `Order` structure array when the data request succeeds, and returns null when the data request fails.

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

- When the ```symbol```, ```since```, and ```limit``` parameters are not specified, the historical orders of the current trading pair or contract are queried by default, i.e., the historical orders within a certain range closest to the current time are queried. The specific query range depends on the single-query range of the exchange's interface.

- When the ```symbol``` parameter is specified, the historical orders of the set trading instrument are queried.

- When the ```since``` parameter is specified, the query starts from the ```since``` timestamp and proceeds toward the current time.

- When the ```limit``` parameter is specified, the query returns once a sufficient number of records is reached.

- This function is only supported by exchanges that provide a historical order query interface.

Exchanges that do not support the ```exchange.GetHistoryOrders()``` function:

| Function Name | Unsupported Spot Exchanges | Unsupported Futures Exchanges |
| - | - | - |
| GetHistoryOrders | Zaif / Upbit / Coincheck / Bitstamp / Bithumb / BitFlyer / BigONE / Uniswap | Futures_Bibox / Futures_ApolloX |

See also: `Order`, `exchange.GetOrder`, `exchange.GetOrders`

#### exchange.CreateConditionOrder

```
exchange.CreateConditionOrder(symbol, side, amount, condition)
exchange.CreateConditionOrder(symbol, side, amount, condition, ...args)
```

The ```exchange.CreateConditionOrder()``` function is used to create a conditional order. A conditional order is a type of order that is automatically executed when specific trigger conditions are met.

Parameters:

- `symbol` (string, required): The ```symbol``` parameter is used to specify the trading pair or contract code corresponding to the conditional order.

When calling the ```exchange.CreateConditionOrder(symbol, side, amount, condition)``` function to place a conditional order, if ```exchange``` is a spot exchange object and the order's quote currency is USDT and the base currency is BTC, then the ```symbol``` parameter is: ```"BTC_USDT"```, whose format is the trading pair format defined by the FMZ platform.

When calling the ```exchange.CreateConditionOrder(symbol, side, amount, condition)``` function to place a conditional order, if ```exchange``` is a futures exchange object and the order is a BTC USDT-margined perpetual contract order, then the ```symbol``` parameter is: ```"BTC_USDT.swap"```, whose format is a combination of the **trading pair** and **contract code** defined by the FMZ platform, separated by the character ".".

When calling the ```exchange.CreateConditionOrder(symbol, side, amount, condition)``` function to place a conditional order, if ```exchange``` is a futures exchange object and the order is a BTC USDT-margined options contract order, then the ```symbol``` parameter is: ```"BTC_USDT.BTC-240108-40000-C"``` (taking the Binance option BTC-240108-40000-C as an example), whose format is a combination of the **trading pair** defined by the FMZ platform and the specific options contract code defined by the exchange, separated by the character ".".
- `side` (string, required): The ```side``` parameter is used to specify the trading direction of the conditional order.

For a spot exchange object, the available values of the ```side``` parameter are: ```buy```, ```sell```. ```buy``` means buy, and ```sell``` means sell.

For a futures exchange object, the available values of the ```side``` parameter are: ```buy```, ```closebuy```, ```sell```, ```closesell```. Among them, ```buy``` means open long position, ```closebuy``` means close long position, ```sell``` means open short position, and ```closesell``` means close short position.

**Additional parameters (option) are supported**: additional parameters can be passed through the ```side``` parameter, in the format: ```"side;{JSON object}"``` or ```"side;key=value&key=value"```.

For example: ```"buy;{\"type\":\"TRAILING_STOP_MARKET\",\"activatePrice\":\"300\"}"``` or ```"buy;type=TRAILING_STOP_MARKET&activatePrice=300"```.

Additional parameters are used to pass exchange-specific parameters (such as order type, effective rules, etc.). The specific supported parameters depend on the exchange API.
- `amount` (number, required): The ```amount``` parameter is used to set the order size of the conditional order. Note that when the order is a **spot market buy order**, the order size represents the purchase amount; for some individual spot exchanges, the order size of a market buy order is the quantity of the base currency. For details, please refer to the **Exchange Special Notes** in the "User Guide". For a futures exchange object, the order size parameter ```amount``` is always measured in the number of contracts.
- `condition` (object, required): The ```condition``` parameter is an object used to set the trigger conditions and execution price of the conditional order. The structure of this object refers to the `Condition` structure and contains the following properties:

- ```ConditionType``` (number): the condition type, refer to `ORDER_CONDITION_TYPE_OCO`, `ORDER_CONDITION_TYPE_TP`, `ORDER_CONDITION_TYPE_SL`, `ORDER_CONDITION_TYPE_GENERIC`.

- ```TpTriggerPrice``` (number): the take-profit trigger price.

- ```TpOrderPrice``` (number): the take-profit execution price, -1 indicates a market order.

- ```SlTriggerPrice``` (number): the stop-loss trigger price.

- ```SlOrderPrice``` (number): the stop-loss execution price, -1 indicates a market order.
- `arg` (string / number / bool / object / array / any (any type supported by the platform), optional): An extension parameter used to output additional information to the log of this conditional order. Multiple ```arg``` parameters can be passed in.

Returns (string / null value): When the conditional order is created successfully, the conditional order Id is returned; when creation fails, a null value is returned. The format of the conditional order Id is similar to that of an ordinary order Id, consisting of the exchange symbol code and the exchange's original conditional order Id, separated by an English comma.

Create a take-profit order (TP): automatically sell when the price rises to the target price.

```javascript
function main() {
    // Create a take-profit order: when the BTC_USDT price rises to 65000, sell 0.01 BTC at the price of 65000
    var condition = {
        ConditionType: ORDER_CONDITION_TYPE_TP,  // Take-profit order
        TpTriggerPrice: 65000,   // Trigger price
        TpOrderPrice: 65000      // Execution price, can also be set to -1 for a market order
    }
    var id = exchange.CreateConditionOrder("BTC_USDT", "sell", 0.01, condition)
    Log("TP order Id:", id)
}
```

```python
def main():
    # Create a take-profit order: when the BTC_USDT price rises to 65000, sell 0.01 BTC at the price of 65000
    condition = {
        "ConditionType": ORDER_CONDITION_TYPE_TP,  # Take-profit order
        "TpTriggerPrice": 65000,   # Trigger price
        "TpOrderPrice": 65000      # Execution price, can also be set to -1 for a market order
    }
    id = exchange.CreateConditionOrder("BTC_USDT", "sell", 0.01, condition)
    Log("TP order Id:", id)
```

```rust
fn main() {
    // Create a take-profit order: when the BTC_USDT price rises to 65000, sell 0.01 BTC at the price of 65000
    let condition = OrderCondition {
        ConditionType: ORDER_CONDITION_TYPE_TP,  // Take-profit order
        TpTriggerPrice: 65000.0,   // Trigger price
        TpOrderPrice: 65000.0,     // Execution price, can also be set to -1 for a market order
        ..Default::default()
    };
    let id = exchange.CreateConditionOrder("BTC_USDT", "sell", 0.01, &condition);
    Log!("TP order Id:", id);
}
```

Create a stop-loss order (SL): when the price drops to the stop-loss trigger price, automatically sell in the configured manner.

```javascript
function main() {
    // Create a stop-loss order: when the BTC_USDT price drops to 58000, sell 0.01 BTC at market price
    var condition = {
        ConditionType: ORDER_CONDITION_TYPE_SL,  // Stop-loss order
        SlTriggerPrice: 58000,   // Trigger price
        SlOrderPrice: -1         // -1 indicates a market order
    }
    var id = exchange.CreateConditionOrder("BTC_USDT", "sell", 0.01, condition)
    Log("SL order Id:", id)
}
```

```python
def main():
    # Create a stop-loss order: when the BTC_USDT price drops to 58000, sell 0.01 BTC at market price
    condition = {
        "ConditionType": ORDER_CONDITION_TYPE_SL,  # Stop-loss order
        "SlTriggerPrice": 58000,   # Trigger price
        "SlOrderPrice": -1         # -1 indicates a market order
    }
    id = exchange.CreateConditionOrder("BTC_USDT", "sell", 0.01, condition)
    Log("SL order Id:", id)
```

```rust
fn main() {
    // Create a stop-loss order: when the BTC_USDT price drops to 58000, sell 0.01 BTC at market price
    let condition = OrderCondition {
        ConditionType: ORDER_CONDITION_TYPE_SL,  // Stop-loss order
        SlTriggerPrice: 58000.0,   // Trigger price
        SlOrderPrice: -1.0,        // -1 indicates a market order
        ..Default::default()
    };
    let id = exchange.CreateConditionOrder("BTC_USDT", "sell", 0.01, &condition);
    Log!("SL order Id:", id);
}
```

Create an OCO order: set take-profit and stop-loss simultaneously. Once either one is triggered, the other is automatically canceled.

```javascript
function main() {
    // Create an OCO order: take-profit price 65000, stop-loss price 58000
    var condition = {
        ConditionType: ORDER_CONDITION_TYPE_OCO,  // OCO order
        TpTriggerPrice: 65000,   // Take-profit trigger price
        TpOrderPrice: 65000,     // Take-profit execution price
        SlTriggerPrice: 58000,   // Stop-loss trigger price
        SlOrderPrice: 58000      // Stop-loss execution price
    }
    var id = exchange.CreateConditionOrder("BTC_USDT", "sell", 0.01, condition)
    Log("OCO order Id:", id)
}
```

```python
def main():
    # Create an OCO order: take-profit price 65000, stop-loss price 58000
    condition = {
        "ConditionType": ORDER_CONDITION_TYPE_OCO,  # OCO order
        "TpTriggerPrice": 65000,   # Take-profit trigger price
        "TpOrderPrice": 65000,     # Take-profit execution price
        "SlTriggerPrice": 58000,   # Stop-loss trigger price
        "SlOrderPrice": 58000      # Stop-loss execution price
    }
    id = exchange.CreateConditionOrder("BTC_USDT", "sell", 0.01, condition)
    Log("OCO order Id:", id)
```

```rust
fn main() {
    // Create an OCO order: take-profit price 65000, stop-loss price 58000
    let condition = OrderCondition {
        ConditionType: ORDER_CONDITION_TYPE_OCO,  // OCO order
        TpTriggerPrice: 65000.0,   // Take-profit trigger price
        TpOrderPrice: 65000.0,     // Take-profit execution price
        SlTriggerPrice: 58000.0,   // Stop-loss trigger price
        SlOrderPrice: 58000.0      // Stop-loss execution price
    };
    let id = exchange.CreateConditionOrder("BTC_USDT", "sell", 0.01, &condition);
    Log!("OCO order Id:", id);
}
```

Create a conditional order with an additional parameter (option), used to pass exchange-specific parameters.

```javascript
function main() {
    // Pass the option parameter in JSON format
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
    # Pass the option parameter in JSON format
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
    // Pass the option parameter in JSON format (Rust has no JSON serialization capability, so a raw string is used directly here to construct it)
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

Whether conditional orders are supported depends on the specific exchange; some exchanges may not support conditional orders.

A conditional order does not lock up account funds before it is triggered; the order is only actually placed and funds are only committed after it is triggered.

Different exchanges may vary in their level of support for conditional orders and in the specific parameters involved. Please consult the API documentation of the corresponding exchange before use.

Additional parameters (option) can be passed via the ```side``` parameter to supply exchange-specific parameters. The additional parameters must be merged into the ```side``` parameter, in the format ```"side;{JSON object}"``` (recommended) or ```"side;key=value&key=value"``` (URL-encoded format). For example: ```"buy;{\"type\":\"TRAILING_STOP_MARKET\"}"```.

The option parameters supported vary from exchange to exchange; the specific supported parameters depend on the exchange's API documentation. Common parameters include: order type (type), time in force (timeInForce), activation price (activatePrice), callback rate (callbackRate), and so on.

When using option parameters, you still need to provide the ```amount``` and ```condition``` parameters. If certain parameters in the exchange API have already been passed via option, these base parameters may be overridden by the corresponding parameters in option; the exact behavior depends on the exchange API's implementation.

See also: `Condition`, `exchange.CancelConditionOrder`, `exchange.GetConditionOrder`, `exchange.GetConditionOrders`, `exchange.ModifyConditionOrder`

#### exchange.ModifyConditionOrder

```
exchange.ModifyConditionOrder(orderId, side, amount, condition)
```

The ```exchange.ModifyConditionOrder()``` function is used to modify an existing conditional order, allowing modification of the order amount, trigger condition, and execution price of the conditional order. It supports modifying other properties of the conditional order through additional parameters (depending on the specific support of the exchange API).

Parameters:

- `orderId` (string, required): The ```orderId``` parameter is used to specify the ID of the original conditional order to be modified. The format of the conditional order ID is consistent with the conditional order ID returned by the `exchange.CreateConditionOrder` function, consisting of the exchange symbol code and the exchange's original conditional order ID, separated by an English comma. For example: ```"SOL-USDT-SWAP,3196255845130256384"```.
- `side` (string, required): The ```side``` parameter is used to specify the trading direction of the conditional order.

For spot exchange objects, the available values for the ```side``` parameter are: ```buy```, ```sell```. ```buy``` means buying, ```sell``` means selling.

For futures exchange objects, the available values for the ```side``` parameter are: ```buy```, ```closebuy```, ```sell```, ```closesell```. ```buy``` means opening a long position, ```closebuy``` means closing a long position, ```sell``` means opening a short position, ```closesell``` means closing a short position.

**Additional parameters (option) supported**: Additional parameters can be passed through the ```side``` parameter, in the format: ```"side;{JSON object}"``` or ```"side;key=value&key=value"```.

For example: ```"buy;{\"newTpTriggerPxType\":\"index\"}"``` or ```"buy;newTpTriggerPxType=index"```.

Additional parameters are used to modify other properties of the conditional order (such as the trigger price type, etc.), and the specific parameters supported depend on the exchange API.
- `amount` (number, required): The ```amount``` parameter is used to set the new order amount of the conditional order. When the amount is -1, it indicates that the order amount is not modified. For futures exchange objects, the order amount parameter ```amount``` is denominated in the number of contracts.
- `condition` (object, required): The ```condition``` parameter is an object used to set the new trigger condition and execution price of the conditional order. The structure of this object refers to the `Condition` structure, and contains the following properties:

- ```ConditionType``` (number): The condition type, refer to `ORDER_CONDITION_TYPE_OCO`, `ORDER_CONDITION_TYPE_TP`, `ORDER_CONDITION_TYPE_SL`, `ORDER_CONDITION_TYPE_GENERIC`.

- ```TpTriggerPrice``` (number): The take-profit trigger price.

- ```TpOrderPrice``` (number): The take-profit execution price, -1 indicates a market order.

- ```SlTriggerPrice``` (number): The stop-loss trigger price.

- ```SlOrderPrice``` (number): The stop-loss execution price, -1 indicates a market order.

Returns (string / null value): When the conditional order is successfully modified, the conditional order ID is returned; when the modification fails, a null value is returned. The returned conditional order ID may be the same as the original conditional order ID, or it may be different, depending on the specific implementation of the exchange API. Some exchanges return a new conditional order ID after modifying the conditional order, while some exchanges keep the conditional order ID unchanged.

Modify the quantity and trigger conditions of a conditional order.

```javascript
function main() {
    // Create a take-profit conditional order
    var condition = {
        ConditionType: ORDER_CONDITION_TYPE_TP,
        TpTriggerPrice: 77,
        TpOrderPrice: 76
    }
    var id = exchange.CreateConditionOrder("SOL_USDT.swap", "buy", 1, condition)
    Log("Original Condition Order ID:", id)
    Sleep(2000)

    // Query the original conditional order information
    var order = exchange.GetConditionOrder(id)
    Log("Original Condition Order Info:", order)
    Sleep(1000)

    // Modify the quantity and trigger conditions of the conditional order
    var newCondition = {
        ConditionType: ORDER_CONDITION_TYPE_TP,
        TpTriggerPrice: 75,
        TpOrderPrice: 71
    }
    var newId = exchange.ModifyConditionOrder(id, "buy", 2, newCondition)
    Log("Modified Condition Order ID:", newId)
    Sleep(2000)

    // Query the modified conditional order information
    var newOrder = exchange.GetConditionOrder(newId)
    Log("Modified Condition Order Info:", newOrder)

    // Cancel the conditional order
    exchange.CancelConditionOrder(newId)
}
```

```python
def main():
    # Create a take-profit conditional order
    condition = {
        "ConditionType": ORDER_CONDITION_TYPE_TP,
        "TpTriggerPrice": 77,
        "TpOrderPrice": 76
    }
    id = exchange.CreateConditionOrder("SOL_USDT.swap", "buy", 1, condition)
    Log("Original Condition Order ID:", id)
    Sleep(2000)

    # Query the original conditional order information
    order = exchange.GetConditionOrder(id)
    Log("Original Condition Order Info:", order)
    Sleep(1000)

    # Modify the quantity and trigger conditions of the conditional order
    newCondition = {
        "ConditionType": ORDER_CONDITION_TYPE_TP,
        "TpTriggerPrice": 75,
        "TpOrderPrice": 71
    }
    newId = exchange.ModifyConditionOrder(id, "buy", 2, newCondition)
    Log("Modified Condition Order ID:", newId)
    Sleep(2000)

    # Query the modified conditional order information
    newOrder = exchange.GetConditionOrder(newId)
    Log("Modified Condition Order Info:", newOrder)

    # Cancel the conditional order
    exchange.CancelConditionOrder(newId)
```

```rust
fn main() {
    // Create a take-profit conditional order
    let condition = OrderCondition {
        ConditionType: ORDER_CONDITION_TYPE_TP,
        TpTriggerPrice: 77.0,
        TpOrderPrice: 76.0,
        ..Default::default()
    };
    let id = exchange.CreateConditionOrder("SOL_USDT.swap", "buy", 1, &condition).unwrap();
    Log!("Original Condition Order ID:", id);
    Sleep(2000);

    // Query the original conditional order information
    let order = exchange.GetConditionOrder(&id);
    Log!("Original Condition Order Info:", order);
    Sleep(1000);

    // Modify the quantity and trigger conditions of the conditional order
    let newCondition = OrderCondition {
        ConditionType: ORDER_CONDITION_TYPE_TP,
        TpTriggerPrice: 75.0,
        TpOrderPrice: 71.0,
        ..Default::default()
    };
    let newId = exchange.ModifyConditionOrder(&id, "buy", 2, &newCondition).unwrap();
    Log!("Modified Condition Order ID:", newId);
    Sleep(2000);

    // Query the modified conditional order information
    let newOrder = exchange.GetConditionOrder(&newId);
    Log!("Modified Condition Order Info:", newOrder);

    // Cancel the conditional order
    let _ = exchange.CancelConditionOrder(&newId);
}
```

Use the additional parameter (option) to modify the trigger price type of a conditional order.

```javascript
function main() {
    // Create a take-profit conditional order
    var condition = {
        ConditionType: ORDER_CONDITION_TYPE_TP,
        TpTriggerPrice: 77,
        TpOrderPrice: 76
    }
    var id = exchange.CreateConditionOrder("SOL_USDT.swap", "buy", 1, condition)
    Log("Original Condition Order ID:", id)
    Sleep(2000)

    // Modify the conditional order and set the trigger price type to index price (index)
    // Pass the additional parameter via the side parameter (in JSON format)
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

    // Query the modified conditional order information
    var newOrder = exchange.GetConditionOrder(newId)
    Log("Modified Condition Order Info:", newOrder)

    // Cancel the conditional order
    exchange.CancelConditionOrder(newId)
}
```

```python
import json

def main():
    # Create a take-profit conditional order
    condition = {
        "ConditionType": ORDER_CONDITION_TYPE_TP,
        "TpTriggerPrice": 77,
        "TpOrderPrice": 76
    }
    id = exchange.CreateConditionOrder("SOL_USDT.swap", "buy", 1, condition)
    Log("Original Condition Order ID:", id)
    Sleep(2000)

    # Modify the conditional order and set the trigger price type to index price (index)
    # Pass the additional parameter via the side parameter (in JSON format)
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

    # Query the modified conditional order information
    newOrder = exchange.GetConditionOrder(newId)
    Log("Modified Condition Order Info:", newOrder)

    # Cancel the conditional order
    exchange.CancelConditionOrder(newId)
```

```rust
fn main() {
    // Create a take-profit conditional order
    let condition = OrderCondition {
        ConditionType: ORDER_CONDITION_TYPE_TP,
        TpTriggerPrice: 77.0,
        TpOrderPrice: 76.0,
        ..Default::default()
    };
    let id = exchange.CreateConditionOrder("SOL_USDT.swap", "buy", 1, &condition).unwrap();
    Log!("Original Condition Order ID:", id);
    Sleep(2000);

    // Modify the conditional order and set the trigger price type to index price (index)
    // Pass the additional parameter via the side parameter (in JSON format; Rust has no JSON serialization here, so a raw string literal is used directly)
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

    // Query the modified conditional order information
    let newOrder = exchange.GetConditionOrder(&newId);
    Log!("Modified Condition Order Info:", newOrder);

    // Cancel the conditional order
    let _ = exchange.CancelConditionOrder(&newId);
}
```

The conditional order ID returned by the ```exchange.ModifyConditionOrder()``` function may exhibit different behaviors depending on the exchange API implementation. Some exchange APIs return an updated conditional order ID, while others keep it unchanged. It is recommended to use the returned new conditional order ID for subsequent operations.

The ```exchange.ModifyConditionOrder()``` function does not validate the validity of the parameters according to the exchange interface rules, but submits the parameters directly to the exchange API. When invalid parameters are passed in (such as an amount of -1), the parameter may be ignored by the exchange, and the conditional order retains its original properties unchanged.

Passing additional parameters (option) through the ```side``` parameter is supported, used to modify other properties of the conditional order. The additional parameters need to be merged with the ```side``` parameter, in the format ```"side;{JSON object}"``` (recommended) or ```"side;key=value"``` (URL-encoded format). For example, to modify the trigger price type: ```"buy;{\"newTpTriggerPxType\":\"index\"}"```.

For market order modification of conditional orders, you need to specifically check whether the exchange API supports it. Setting ```TpOrderPrice``` or ```SlOrderPrice``` in the ```condition``` parameter to -1 indicates a market order.

When modifying a conditional order, other properties of the conditional order (such as condition type, position mode, account mode, leverage, etc.) are usually retained from the original conditional order's settings. If you need to modify these properties, you can pass them in through additional parameters (option), provided that the exchange API supports it.

The trigger price type can be modified through additional parameters, for example, changing the trigger price type from the last price (last) to the index price (index) or the mark price (mark). The specific parameter names and support status depend on the exchange API documentation.

The support for the conditional order modification feature depends on the specific exchange. Some exchanges may not support the conditional order modification feature, or may only support modifying some parameters. Please consult the API documentation of the corresponding exchange before use.

See also: `Condition`, `exchange.CreateConditionOrder`, `exchange.CancelConditionOrder`, `exchange.GetConditionOrder`, `exchange.GetConditionOrders`

#### exchange.CancelConditionOrder

```
exchange.CancelConditionOrder(conditionOrderId)
exchange.CancelConditionOrder(conditionOrderId, ...args)
```

```exchange.CancelConditionOrder()``` function is used to cancel a conditional order. The format of the conditional order Id is similar to that of a regular order Id, consisting of the exchange symbol code and the exchange's original conditional order Id, separated by an English comma.

When calling the ```exchange.CancelConditionOrder()``` function to cancel a conditional order, the ```conditionOrderId``` parameter passed in is consistent with the ```Id``` attribute of the conditional order structure.

Parameters:

- `conditionOrderId` (string, required): The ```conditionOrderId``` parameter is used to specify the conditional order to be canceled.
- `arg` (string / number / bool / object / array / any (any type supported by the platform), optional): An extended parameter used to output additional information to the log of this canceled conditional order. Multiple ```arg``` parameters can be passed in.

Returns (bool): The ```exchange.CancelConditionOrder()``` function returns a truthy value (e.g. ```true```) to indicate that the request to cancel the conditional order was sent successfully, and returns a falsy value (e.g. ```false```) to indicate that the request to cancel the conditional order failed to send.

Cancel a conditional order.

```javascript
function main(){
    // Create a stop-loss conditional order
    var condition = {
        ConditionType: ORDER_CONDITION_TYPE_SL,
        SlTriggerPrice: 58000,
        SlOrderPrice: -1  // Market order
    }
    var id = exchange.CreateConditionOrder("BTC_USDT", "sell", 0.01, condition)
    Sleep(1000)
    exchange.CancelConditionOrder(id)
}
```

```python
def main():
    # Create a stop-loss conditional order
    condition = {
        "ConditionType": ORDER_CONDITION_TYPE_SL,
        "SlTriggerPrice": 58000,
        "SlOrderPrice": -1  # Market order
    }
    id = exchange.CreateConditionOrder("BTC_USDT", "sell", 0.01, condition)
    Sleep(1000)
    exchange.CancelConditionOrder(id)
```

```rust
fn main() {
    // Create a stop-loss conditional order
    let condition = OrderCondition {
        ConditionType: ORDER_CONDITION_TYPE_SL,
        SlTriggerPrice: 58000.0,
        SlOrderPrice: -1.0,  // Market order
        ..Default::default()
    };
    let id = exchange.CreateConditionOrder("BTC_USDT", "sell", 0.01, &condition).unwrap();
    Sleep(1000);
    let _ = exchange.CancelConditionOrder(&id);
}
```

Batch cancel condition orders, with condition order information output.

```javascript
function main() {
    // Create several condition orders
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
    # Create several condition orders
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
    // Create several condition orders
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
        // In Rust, CancelConditionOrder does not support extended parameters; output the accompanying information with Log
        let _ = exchange.CancelConditionOrder(&orders[i].Id);
        Log!("Canceled condition order:", orders[i]);
        Sleep(500);
    }
}
```

The return value of the ```exchange.CancelConditionOrder()``` function only indicates whether the cancellation request was sent successfully or failed. To determine whether the exchange has actually canceled the conditional order, you can call the ```exchange.GetConditionOrders()``` function for confirmation.

Only untriggered conditional orders can be canceled; conditional orders that have already been triggered and converted into regular orders cannot be canceled through this function.

See also: `exchange.CreateConditionOrder`, `exchange.GetConditionOrder`, `exchange.GetConditionOrders`, `exchange.ModifyConditionOrder`

#### exchange.GetConditionOrder

```
exchange.GetConditionOrder(conditionOrderId)
```

The ```exchange.GetConditionOrder()``` function is used to retrieve information about a specified conditional order.

Parameters:

- `conditionOrderId` (string, required): The ```conditionOrderId``` parameter is used to specify the conditional order to query. The format of the conditional order Id is similar to that of a regular order Id, consisting of the exchange symbol code and the exchange's original conditional order Id, separated by an English comma.

The ```conditionOrderId``` parameter passed in when calling the ```exchange.GetConditionOrder()``` function to query a conditional order is consistent with the ```Id``` property of the conditional order structure.

Returns (`Order` / null value): Query the details of a conditional order by its conditional order Id. When the query succeeds, the `Order` structure is returned; when the query fails, a null value is returned.

The returned Order structure contains a `Condition` field, which holds the detailed configuration information of the conditional order (trigger price, execution price, condition type, etc.).

```javascript
function main(){
    // Create a take-profit conditional order
    var condition = {
        ConditionType: ORDER_CONDITION_TYPE_TP,
        TpTriggerPrice: 65000,
        TpOrderPrice: 65000
    }
    var id = exchange.CreateConditionOrder("BTC_USDT", "sell", 0.01, condition)
    Sleep(1000)

    // The parameter id is the conditional order number; fill in the number of the conditional order you want to query
    var order = exchange.GetConditionOrder(id)
    Log("Id:", order.Id, "Price:", order.Price, "Amount:", order.Amount,
        "Status:", order.Status, "Type:", order.Type, "Condition:", order.Condition)
}
```

```python
def main():
    # Create a take-profit conditional order
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
    // Create a take-profit conditional order
    let condition = OrderCondition {
        ConditionType: ORDER_CONDITION_TYPE_TP,
        TpTriggerPrice: 65000.0,
        TpOrderPrice: 65000.0,
        ..Default::default()
    };
    let id = exchange.CreateConditionOrder("BTC_USDT", "sell", 0.01, &condition).unwrap();
    Sleep(1000);

    // The parameter id is the conditional order number; fill in the number of the conditional order you want to query
    let order = exchange.GetConditionOrder(&id).unwrap();
    Log!("Id:", order.Id, "Price:", order.Price, "Amount:", order.Amount,
        "Status:", order.Status, "Type:", order.Type, "Condition:", order.Condition);
}
```

Some exchanges do not support the ```exchange.GetConditionOrder()``` function.

The returned conditional order structure contains information such as the trigger condition, trigger price, and order status.

Conditional order statuses include: not triggered, triggered, canceled, etc. The specific status values are determined by the exchange.

See also: `Order`, `exchange.GetConditionOrders`, `exchange.GetHistoryConditionOrders`, `exchange.ModifyConditionOrder`

#### exchange.GetConditionOrders

```
exchange.GetConditionOrders()
exchange.GetConditionOrders(symbol)
```

```exchange.GetConditionOrders()``` function is used to obtain unfinished conditional orders (conditional orders that have not yet been triggered or canceled).

Parameters:

- `symbol` (string, optional): The ```symbol``` parameter is used to specify the **trading instrument** or **range of trading instruments** to be queried.

For spot exchange objects, when the ```symbol``` parameter is not passed, the unfinished conditional order data of all spot instruments will be requested.

For futures exchange objects, when the ```symbol``` parameter is not passed, by default it requests the unfinished conditional order data of all instruments within the dimension range of the current trading pair and contract code.

Returns (`Order` array / null value): The ```exchange.GetConditionOrders()``` function returns a `Order` structure array when the data request is successful, and returns a null value when the data request fails.

The returned Order structure contains a `Condition` field, which contains the detailed configuration information of the conditional order (trigger price, execution price, condition type, etc.).

Use the spot exchange object to create multiple condition orders, then query the pending condition order information.

```javascript
function main() {
    // Create multiple condition orders
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

    // Query all pending condition orders
    var orders = exchange.GetConditionOrders()
    Log("Pending condition orders count:", orders.length)
    for (var i = 0; i < orders.length; i++) {
        Log("Condition order", i+1, ":", orders[i])
    }
}
```

```python
def main():
    # Create multiple condition orders
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

    # Query all pending condition orders
    orders = exchange.GetConditionOrders()
    Log("Pending condition orders count:", len(orders))
    for i in range(len(orders)):
        Log("Condition order", i+1, ":", orders[i])
```

```rust
fn main() {
    // Create multiple condition orders
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

    // Query all pending condition orders
    let orders = exchange.GetConditionOrders(None).unwrap();
    Log!("Pending condition orders count:", orders.len());
    for i in 0..orders.len() {
        Log!("Condition order", i + 1, ":", orders[i]);
    }
}
```

Query the pending condition orders for a specified trading pair.

```javascript
function main() {
    // Query the pending condition orders for the BTC_USDT trading pair
    var orders = exchange.GetConditionOrders("BTC_USDT")
    Log("BTC_USDT pending condition orders:", orders)
}
```

```python
def main():
    # Query the pending condition orders for the BTC_USDT trading pair
    orders = exchange.GetConditionOrders("BTC_USDT")
    Log("BTC_USDT pending condition orders:", orders)
```

```rust
fn main() {
    // Query the pending condition orders for the BTC_USDT trading pair
    let orders = exchange.GetConditionOrders("BTC_USDT");
    Log!("BTC_USDT pending condition orders:", orders);
}
```

In the ```GetConditionOrders``` function, the use cases of the symbol parameter are summarized as follows:
| Exchange Object Category | symbol Parameter | Query Scope | Remarks |
| - | - | - | - |
| Spot | symbol parameter not passed | Query all spot trading pairs | Applicable to all call scenarios; if the exchange interface does not support it, an error is reported and a null value is returned, which will not be repeated below |
| Spot | Specify a trading instrument, with symbol parameter as: "BTC_USDT" | Query the specified BTC_USDT trading pair | For spot exchange objects, the format of the symbol parameter is: "BTC_USDT" |
| Futures | symbol parameter not passed | Query all trading instruments within the dimension range of the current trading pair and contract code | Assuming the current trading pair is BTC_USDT and the contract code is swap, this queries all USDT-margined perpetual contracts. Equivalent to calling ```GetConditionOrders("USDT.swap")``` |
| Futures | Specify a trading instrument, with symbol parameter as: "BTC_USDT.swap" | Query the specified BTC USDT-margined perpetual contract | For futures exchange objects, the format of the symbol parameter is: a combination of the **trading pair** and **contract code** defined by the FMZ platform, with the two separated by the character ```"."```. |
| Futures | Specify a range of trading instruments, with symbol parameter as: "USDT.swap" | Query all USDT-margined perpetual contracts | - |
| Futures exchange supporting options | symbol parameter not passed | Query all option contracts within the dimension range of the current trading pair | Assuming the current trading pair is BTC_USDT and the contract is set to an option contract, such as a Binance option contract: BTC-240108-40000-C |
| Futures exchange supporting options | Specify a specific trading instrument | Query the specified option contract | For example, for the Binance futures exchange, the symbol parameter is: BTC_USDT.BTC-240108-40000-C |
| Futures exchange supporting options | Specify a range of trading instruments, with symbol parameter as: "USDT.option" | Query all USDT-margined option contracts | - |

In the ```GetConditionOrders``` function, the query dimension ranges of the futures exchange object are summarized as follows:
| symbol Parameter | Request Scope Definition | Remarks |
| - | - | - |
| USDT.swap          | USDT-margined perpetual contract range.  | For dimensions not supported by the exchange API interface, an error is reported and a null value is returned when called. |
| USDT.futures       | USDT-margined delivery contract range.  | - |
| USD.swap           | Coin-margined perpetual contract range.    | - |
| USD.futures        | Coin-margined delivery contract range.    | - |
| USDT.option        | USDT-margined option contract range.  | - |
| USD.option         | Coin-margined option contract range.    | - |
| USDT.futures_combo | Spread combination contract range.      | Futures_Deribit exchange |
| USD.futures_ff     | Mixed-margin delivery contract range. | Futures_Kraken exchange |
| USD.swap_pf        | Mixed-margin perpetual contract range. | Futures_Kraken exchange |

When the account represented by the exchange object ```exchange``` has no unfinished conditional orders **within the query scope** or on the **specified trading instrument**, calling this function will return an empty array, i.e.: ```[]```.

Support for the conditional order feature depends on the specific exchange; some exchanges may not support the conditional order feature.

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

The ```exchange.GetHistoryConditionOrders()``` function is used to retrieve the historical conditional orders (including triggered, canceled, and expired conditional orders) for the current trading pair or contract, and supports specifying a particular trading instrument.

Parameters:

- `symbol` (string, optional): The ```symbol``` parameter is used to specify the trading instrument. Taking the ```BTC_USDT``` trading pair as an example, when ```exchange``` is a spot exchange object, the format of the ```symbol``` parameter is: ```BTC_USDT```; if it is a futures exchange object, taking a perpetual contract as an example, the format of the ```symbol``` parameter is: ```BTC_USDT.swap```.

If you are querying conditional order data for an options contract, set the ```symbol``` parameter to ```"BTC_USDT.BTC-240108-40000-C"``` (taking the Binance option BTC-240108-40000-C as an example). Its format is a combination of the **trading pair** defined by the FMZ platform and the specific option contract code defined by the exchange, separated by the character ".". If this parameter is not passed, the conditional order data for the currently set trading pair and contract code is requested by default.
- `since` (number, optional): The ```since``` parameter is used to specify the starting timestamp of the query, in milliseconds.
- `limit` (number, optional): The ```limit``` parameter is used to specify the number of conditional orders to query.

Returns (`Order` array / null): The ```exchange.GetHistoryConditionOrders()``` function returns an array of `Order` structures when the data request is successful, and returns null when the data request fails.

The returned Order structure contains a `Condition` field, which holds the detailed configuration information of the conditional order (trigger price, execution price, condition type, etc.).

Query historical conditional orders. The returned results are sorted in ascending order by time.

```javascript
function main() {
    var historyConditionOrders = exchange.GetHistoryConditionOrders()
    Log("Historical condition orders count:", historyConditionOrders.length)

    // Iterate and display; orders are sorted in ascending order by the Time property
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

    # Iterate and display; orders are sorted in ascending order by the Time property
    for i in range(len(historyConditionOrders)):
        Log("Order", i+1, "Created at:", historyConditionOrders[i]["Time"],
            "ID:", historyConditionOrders[i]["Id"],
            "Status:", historyConditionOrders[i]["Status"])
```

```rust
fn main() {
    let historyConditionOrders = exchange.GetHistoryConditionOrders(None, None, None).unwrap();
    Log!("Historical condition orders count:", historyConditionOrders.len());

    // Iterate and display; orders are sorted in ascending order by the Time property
    for i in 0..historyConditionOrders.len() {
        Log!("Order", i + 1, "Created at:", historyConditionOrders[i].Time,
            "ID:", historyConditionOrders[i].Id,
            "Status:", historyConditionOrders[i].Status);
    }
}
```

Query the historical conditional orders of a specified trading pair, and limit the number of results returned.

```javascript
function main() {
    // Query the 10 most recent historical conditional orders for the BTC_USDT trading pair
    var historyConditionOrders = exchange.GetHistoryConditionOrders("BTC_USDT", 0, 10)
    Log("BTC_USDT historical condition orders:", historyConditionOrders)
}
```

```python
def main():
    # Query the 10 most recent historical conditional orders for the BTC_USDT trading pair
    historyConditionOrders = exchange.GetHistoryConditionOrders("BTC_USDT", 0, 10)
    Log("BTC_USDT historical condition orders:", historyConditionOrders)
```

```rust
fn main() {
    // Query the 10 most recent historical conditional orders for the BTC_USDT trading pair
    let historyConditionOrders = exchange.GetHistoryConditionOrders("BTC_USDT", 0, 10);
    Log!("BTC_USDT historical condition orders:", historyConditionOrders);
}
```

Query historical conditional orders by time range.

```javascript
function main() {
    // Query historical conditional orders starting from the specified timestamp
    var startTime = new Date("2024-01-01").getTime()
    var historyConditionOrders = exchange.GetHistoryConditionOrders(startTime, 50)
    Log("Historical condition orders since:", historyConditionOrders)
}
```

```python
def main():
    # Query historical conditional orders starting from the specified timestamp
    import time
    startTime = int(time.mktime(time.strptime("2024-01-01", "%Y-%m-%d")) * 1000)
    historyConditionOrders = exchange.GetHistoryConditionOrders(startTime, 50)
    Log("Historical condition orders since:", historyConditionOrders)
```

```rust
fn main() {
    // Query historical conditional orders starting from the specified timestamp
    let startTime: i64 = 1704067200000;  // Timestamp for 2024-01-01
    // In Rust, passing None for the symbol parameter means the current trading pair
    let historyConditionOrders = exchange.GetHistoryConditionOrders(None, startTime, 50);
    Log!("Historical condition orders since:", historyConditionOrders);
}
```

- When the ```symbol```, ```since```, and ```limit``` parameters are not specified, the historical conditional orders of the current trading pair or contract are queried by default, i.e., the historical conditional orders within a certain range closest to the current time are queried. The query range depends on the single-query range of the exchange interface.

- When the ```symbol``` parameter is specified, the historical conditional orders of the set trading instrument are queried.

- When the ```since``` parameter is specified, the query starts from the ```since``` timestamp and proceeds toward the current time.

- When the ```limit``` parameter is specified, the query returns after a sufficient number of records has been found.

- This function is only supported by exchanges that provide a historical conditional order query interface.

Historical conditional orders include conditional orders in states such as triggered (converted to regular orders), canceled, and expired.

The returned array of historical conditional orders is sorted in ascending order by order creation time (the ```Time``` attribute), i.e., orders with the earliest time are at the front of the array, and orders with the latest time are at the back.

Support for the conditional order feature depends on the specific exchange. Some exchanges may not support the conditional order feature or the historical conditional order query feature.

See also: `Order`, `exchange.GetConditionOrder`, `exchange.GetConditionOrders`

### Account

#### exchange.GetAccount

```
exchange.GetAccount()
```

The ```exchange.GetAccount()``` function is used to request the exchange account information. The ```GetAccount()``` function is a member function of the exchange object `exchange`. The member functions (methods) of the ```exchange``` object are only related to ```exchange```, which will not be repeated in the subsequent documentation.

Returns (`Account` / null value): Queries the account asset information. Returns the `Account` structure when the query succeeds, and returns a null value when the query fails.

Set the trading pair and contract code, and get the current account information.

```javascript
function main(){
    // Switch the trading pair
    exchange.IO("currency", "BTC_USDT")
    // Taking OKX Futures as an example, set the contract to the current-week contract. The current trading pair is BTC_USDT, so the current contract is the USDT-margined current-week contract of BTC
    exchange.SetContractType("this_week")
    // Get the current account asset data
    var account = exchange.GetAccount()
    // Available balance with USDT as margin
    Log(account.Balance)
    // Frozen amount with USDT as margin
    Log(account.FrozenBalance)
    // Current asset equity
    Log(account.Equity)
    // Unrealized profit and loss of all positions with the current assets as margin
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
    // Switch the trading pair
    exchange.IO(("currency", "BTC_USDT")).unwrap();
    // Taking OKX Futures as an example, set the contract to the current-week contract. The current trading pair is BTC_USDT, so the current contract is the USDT-margined current-week contract of BTC
    exchange.SetContractType("this_week").unwrap();
    // Get the current account asset data
    let account = exchange.GetAccount().unwrap();
    // Available balance with USDT as margin
    Log!(account.Balance);
    // Frozen amount with USDT as margin
    Log!(account.FrozenBalance);
    // Current asset equity
    Log!(account.Equity);
    // Unrealized profit and loss of all positions with the current assets as margin
    Log!(account.UPnL);
}
```

If the exchange object is set to a cryptocurrency futures contract exchange and switched to a contract that uses ```USDT``` as margin (for the switching method, please refer to the `exchange.SetCurrency` and `exchange.SetContractType` functions), the assets are then denominated in ```USDT``` as margin and recorded in the ```Balance``` and ```FrozenBalance``` properties of the `Account` structure.

If the exchange object is set to a cryptocurrency futures contract exchange and switched to a coin-margined contract, the assets are then denominated in the coin as margin and recorded in the ```Stocks``` and ```FrozenStocks``` properties of the `Account` structure.

When using a Binance Futures unified account, calling the ```exchange.GetAccount()``` function to request account information returns encapsulated data where all assets are converted into their value in **USD**, displayed in the ```Balance``` field of the `Account` structure. If you need to calculate the converted value of other assets, you can divide the USD-converted amount by the index price (of the asset to be converted), and then divide by the collateral ratio (of the asset to be converted).

See also: `Account`, `exchange.SetCurrency`, `exchange.SetContractType`

#### exchange.GetAssets

```
exchange.GetAssets()
```

The ```exchange.GetAssets``` function is used to request the asset information of the exchange account.

Returns (`Asset` array / null value): The ```exchange.GetAssets()``` function returns a `Asset` structure array when the data request succeeds, and returns a null value when the data request fails.

Get the asset information of the exchange account. The ```exchange.GetAssets()``` function returns an array with Asset structures as elements.

```javascript
function main() {
    // exchange.SetCurrency("BTC_USDT")  // You can set the trading pair
    // exchange.SetContractType("swap")  // You can set the contract
    var assets = exchange.GetAssets()
    Log(assets)
}
```

```python
def main():
    # exchange.SetCurrency("BTC_USDT")  # You can set the trading pair
    # exchange.SetContractType("swap")  # You can set the contract
    assets = exchange.GetAssets()
    Log(assets)
```

```rust
fn main() {
    // exchange.SetCurrency("BTC_USDT");  // You can set the trading pair
    // exchange.SetContractType("swap").unwrap();  // You can set the contract
    let assets = exchange.GetAssets().unwrap();
    Log!(assets);
}
```

The ```GetAssets()``` function of a futures exchange object returns the margin assets under the current trading pair (coin-margined, USDT-margined, USDC-margined, etc.).

See also: `Asset`

### Futures

#### exchange.SetContractType

```
exchange.SetContractType(symbol)
```

The ```exchange.SetContractType()``` function is used to set the current contract code of the `exchange` exchange object.

Parameters:

- `symbol` (string, required): The ```symbol``` parameter is used to set the contract code. Optional values are: ```"this_week"```, ```"next_week"```, ```"quarter"```, ```"next_quarter"```, ```"swap"```, etc.

Unless otherwise specified, the codes for **delivery contracts** in cryptocurrency futures contracts generally include:

- ```this_week```: Current week contract.

- ```next_week```: Next week contract.

- ```quarter```: Current quarter contract.

- ```next_quarter```: Next quarter contract.


Unless otherwise specified, the codes for **perpetual contracts** in cryptocurrency futures contracts generally include:

- ```swap```: Perpetual contract.

Returns (object): The ```exchange.SetContractType()``` function returns a struct that contains the exchange contract code corresponding to the current contract code. For example, on a Binance Futures contract exchange, when the current contract code is ```quarter```, the return value structure of this function is: ```{"InstrumentID":"BTCUSD_230630","instrument":"BTCUSD_230630"}```.

Set the current contract to the current-week contract:

```javascript
function main() {
    // Set to the current-week contract
    exchange.SetContractType("this_week")
}
```

```python
def main():
    exchange.SetContractType("this_week")
```

```rust
fn main() {
    // Set to the current-week contract
    exchange.SetContractType("this_week").unwrap();
}
```

When setting a contract that uses ```USDT``` as margin, you need to switch the trading pair in the code (you can also set the trading pair directly when adding the exchange object):

```javascript
function main() {
    // The default trading pair is BTC_USD; set the contract to current-week, which is a coin-margined contract
    exchange.SetContractType("this_week")
    Log("ticker:", exchange.GetTicker())

    // Switch the trading pair, then set the contract, switching to a USDT-margined contract, as distinct from a coin-margined contract
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
    // The default trading pair is BTC_USD; set the contract to current-week, which is a coin-margined contract
    exchange.SetContractType("this_week").unwrap();
    Log!("ticker:", exchange.GetTicker(None));

    // Switch the trading pair, then set the contract, switching to a USDT-margined contract, as distinct from a coin-margined contract
    exchange.IO(("currency", "BTC_USDT")).unwrap();
    exchange.SetContractType("swap").unwrap();
    Log!("ticker:", exchange.GetTicker(None));
}
```

Print the return value of the ```exchange.SetContractType()``` function:

```javascript
function main(){
    // Set the contract to current-week
    var ret = exchange.SetContractType("this_week")
    // Returns the information of the current-week contract
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
    // Set the contract to current-week
    let ret = exchange.SetContractType("this_week").unwrap();
    // Returns the information of the current-week contract
    Log!(ret);
}
```

In cryptocurrency futures contract strategies, take switching to the ```BTC_USDT``` trading pair as an example:

  After switching the trading pair using the ```exchange.SetCurrency("BTC_USDT")``` or ```exchange.IO("currency", "BTC_USDT")``` function, you need to call the ```exchange.SetContractType()``` function again to reset the contract, so as to determine the specific contract to operate on under the new trading pair. The system determines whether the contract is a **coin-margined contract** or a **USDT-margined contract** based on the trading pair.


  For example: when the trading pair is set to ```BTC_USDT```, using the ```exchange.SetContractType("swap")``` function to set the contract code to ```swap``` sets it to the ```BTC``` **USDT-margined** perpetual contract. If the trading pair is ```BTC_USD```, using the ```exchange.SetContractType("swap")``` function to set the contract code to ```swap``` sets it to the ```BTC``` **coin-margined** perpetual contract.

Detailed introduction to the cryptocurrency futures contract exchanges supported by the platform. The contract naming conventions for each exchange are as follows:
- Futures_OKCoin（OKX）
  Set to perpetual contract: ```exchange.SetContractType("swap")```
  Set to current-week contract: ```exchange.SetContractType("this_week")```
  Set to next-week contract: ```exchange.SetContractType("next_week")```
  Set to monthly contract: ```exchange.SetContractType("month")```
  Set to next-month contract: ```exchange.SetContractType("next_month")```
  Set to quarterly contract: ```exchange.SetContractType("quarter")```
  Set to next-quarter contract: ```exchange.SetContractType("next_quarter")```

  OKX offers pre-market trading contracts, whose delivery dates are fixed. Taking the exchange-defined contract code ```HMSTR-USDT-250207``` as an example, first set the trading pair to ```HMSTR_USDT``` on the FMZ platform, then use ```exchange.SetContractType("HMSTR-USDT-250207")``` to set this contract.
  For functions that support the ```symbol``` parameter (such as ```exchange.GetTicker()```, ```exchange.CreateOrder()```, etc.), you can specify the ```symbol``` parameter as ```HMSTR_USDT.HMSTR-USDT-250207``` to obtain market data for this contract or to place orders and perform other operations.
- Futures_HuobiDM (Huobi Futures)
  Set to current-week contract: ```exchange.SetContractType("this_week")```.
  Set to next-week contract: ```exchange.SetContractType("next_week")```.
  Set to quarterly contract: ```exchange.SetContractType("quarter")```.
  Set to next-quarter contract: ```exchange.SetContractType("next_quarter")```.
  Set to perpetual contract: ```exchange.SetContractType("swap")```.
  Supports contracts using ```USDT``` as margin. Taking the ```BTC``` contract as an example: call ```exchange.IO("currency", "BTC_USDT")``` to switch to a contract using ```USDT``` as margin,
  or directly set the current trading pair to ```BTC_USDT``` when configuring live trading parameters and adding the exchange object. After switching the trading pair, you must call the ```exchange.SetContractType()``` function again to set the contract.
- Futures_BitMEX (BitMEX)
  Set to perpetual contract: ```exchange.SetContractType("swap")```.
  The delivery contracts on the Futures_BitMEX exchange are monthly contracts, with the following contract codes (January through December):
  ```code
  "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
  ```
  Set a delivery contract: ```exchange.SetContractType("December")```. For example, when the trading pair is set to ```XBT_USDT```, calling the ```exchange.SetContractType("December")``` function sets the USDT-margined December delivery contract for BTC (the corresponding actual contract code is ```XBTUSDTZ23```).

  Summary of Futures_BitMEX contract information
  |Contract code defined by Futures_BitMEX|Corresponding trading pair on FMZ|Corresponding contract code on FMZ|Remarks|
  | - | - | - | - |
  | DOGEUSD | DOGE_USD | swap | USD-denominated, XBT-settled. XBT is BTC. |
  | DOGEUSDT | DOGE_USDT | swap | USDT-denominated, USDT-settled. |
  | XBTETH | XBT_ETH | swap | ETH-denominated, XBT-settled. |
  | XBTEUR | XBT_EUR | swap | EUR-denominated (EUR), XBT-settled. |
  | USDTUSDC | USDT_USDC | swap | USDC-denominated, XBT-settled. |
  | ETHUSD_ETH | ETH_USD_ETH | swap | USD-denominated, ETH-settled. |
  | XBTH24 | XBT_USD | March | Expiry: March 2024, month code H; USD-denominated, XBT-settled. |
  | ETHUSDZ23 | ETH_USD | December | Expiry: December 2023, month code Z; USD-denominated, XBT-settled. |
  | XBTUSDTZ23 | XBT_USDT | December | Expiry: December 2023, month code Z; USDT-denominated, USDT-settled. |
  | ADAZ23 | ADA_XBT | December | Expiry: December 2023, month code Z; XBT-denominated, XBT-settled. |
  | P_XBTETFX23 | USDT_XXX | P_XBTETFX23 | Expiry: November 2023; denominated in percentage, USDT-settled. |
- Futures_GateIO
  Set to current-week contract: ```exchange.SetContractType("this_week")```.
  Set to next-week contract: ```exchange.SetContractType("next_week")```.
  Set to quarterly contract: ```exchange.SetContractType("quarter")```.
  Set to next-quarter contract: ```exchange.SetContractType("next_quarter")```.
  Set to perpetual contract: ```exchange.SetContractType("swap")```.
  Supports contracts using ```USDT``` as margin. Taking the ```BTC``` contract as an example, call ```exchange.IO("currency", "BTC_USDT")``` to switch to a contract using ```USDT``` as margin,
  or directly set the current trading pair to ```BTC_USDT``` when configuring live trading parameters and adding the exchange object. After switching the trading pair, you must call the ```exchange.SetContractType()``` function again to set the contract.
- Futures_Deribit
  Set to perpetual contract: ```exchange.SetContractType("swap")```.
  Supports Deribit's ```USDC``` contracts.
  Delivery contracts include: ```"this_week"```, ```"next_week"```, ```"month"```, ```"quarter"```, ```"next_quarter"```, ```"third_quarter"```, ```"fourth_quarter"```.
  Spread contracts (future_combo): ```"this_week,swap"```, ```"next_week,swap"```, ```"next_quarter,this_week"```, ```"third_quarter,this_week"```, ```"month,next_week"``` and various other combinations.
  For options contracts, you need to pass in the specific options contract code defined by the exchange; for details, please refer to the Deribit official website.
- Futures_KuCoin
  Coin-margined contracts: for example, set the trading pair to ```BTC_USD```, then set the contract code, which yields a coin-margined contract.
  Set to perpetual contract: ```exchange.SetContractType("swap")```.
  Set to current-quarter contract: ```exchange.SetContractType("quarter")```.
  Set to next-quarter contract: ```exchange.SetContractType("next_quarter")```.

  Contracts using USDT as margin:
  For example, set the trading pair to ```BTC_USDT```, then set the contract code, which yields a contract using USDT as margin.
  Set to perpetual contract: ```exchange.SetContractType("swap")```.
- Futures_Binance
  The Binance Futures exchange defaults to the perpetual contract of the current trading pair, with contract code: ```swap```.
  Set to perpetual contract: ```exchange.SetContractType("swap")```. Binance's perpetual contracts support using ```USDT``` as margin; for example, for the ```USDT```-margined perpetual contract of ```BTC```, set the trading pair to ```BTC_USDT```; Binance also supports coin-margined perpetual contracts, for example the coin-margined perpetual contract of ```BTC```, for which you set the trading pair to ```BTC_USD```.
  Set to quarterly contract: ```exchange.SetContractType("quarter")```. Delivery contracts include coin-margined contracts (i.e., using the coin as margin); for example, to set the quarterly contract of ```BTC```, set the trading pair to ```BTC_USD```, then call ```exchange.SetContractType("quarter")``` to set the coin-margined quarterly contract of ```BTC```.
  Set to next-quarter contract: ```exchange.SetContractType("next_quarter")```. For example, to set the coin-margined next-quarter contract of ```BTC```, set the trading pair to ```BTC_USD```, then call ```exchange.SetContractType("next_quarter")```.
  Binance supports some ```USDT```-margined delivery contracts. Taking ```BTC``` as an example, set the trading pair to ```BTC_USDT```, then set the contract code.

  Supports Binance options contracts:
  The options contract code format follows the exchange definition, for example ```BTC-241227-15000-C```, ```XRP-240112-0.5-C```, ```BTC-241227-15000-P```. Taking the Binance options contract code ```BTC-241227-15000-P``` as an example: BTC is the option's underlying coin code, 241227 is the exercise date, 15000 is the strike price, P indicates a put option, and C indicates a call option.
  For the specific type of option (European or American), please refer to the relevant documentation on the exchange's options contracts.
  The exchange may impose restrictions on option sellers, requiring a separate application for eligibility. Binance options, for instance, require applying for seller eligibility.
- Futures_Bibox
  Bibox perpetual contract code: ```swap```.
  Set to perpetual contract: ```exchange.SetContractType("swap")```.
- Futures_Bybit
  Defaults to the perpetual contract of the current trading pair, with contract code: ```swap```.
  Current-week contract code: ```this_week```.
  Next-week contract code: ```next_week```.
  Third-week contract code: ```third_week```.
  Monthly contract code: ```month```.
  Next-month contract code: ```next_month```.
  Quarterly contract code: ```quarter```.
  Next-quarter contract code: ```next_quarter```.
  Third-quarter contract code: ```third_quarter```.
  Directly use the exchange's contract naming: for example ```ETHUSDT-04APR25```. Since some contract instruments on the Bybit exchange have no clear periodicity, the exchange-defined contract code is used directly for naming.
- Futures_Kraken
  Defaults to the perpetual contract of the current trading pair, with contract code: ```swap```.
  ```swap```: perpetual contract.
  ```month```: current-month contract.
  ```quarter```: quarterly contract.
  ```next_quarter```: next-quarter contract.
  ```third_quarter```: third-quarter contract.
  ```swap_pf```: multi-collateral perpetual contract.
  ```quarter_ff```: multi-collateral quarterly contract.
  ```month_ff```: multi-collateral current-month contract.
  ```next_quarter_ff```: multi-collateral next-quarter contract.
  ```third_quarter_ff```: multi-collateral third-quarter contract.
  Directly use the exchange's contract naming: for example ```FF_ETHUSD_250307```. Since some contract instruments on the Kraken exchange have no clear periodicity, the exchange-defined contract code is used directly for naming.
  Option contracts: use the exchange's option code directly, such as ```OF_ETHUSD_261225_4000_C``` (trading pair ```ETH_USD```).
- Futures_Bitfinex
  Defaults to the perpetual contract of the current trading pair, with contract code: ```swap```.
- Futures_Bitget
  Defaults to the perpetual contract of the current trading pair, with contract code: ```swap```.
  Setting the trading pair to ```BTC_USD``` yields a coin-margined contract, and setting the trading pair to ```BTC_USDT``` yields a ```USDT```-settled contract. For simulation contracts, you can set the trading pair to ```SBTC_USD``` or ```BTC_SUSDT```.
- Futures_dYdX (v4)
  dYdX perpetual contract code: ```swap```.
  Set to perpetual contract: ```exchange.SetContractType("swap")```. dYdX has only the ```USD.swap``` instrument dimension, and the margin used is USDC.
- Futures_MEXC
  MEXC perpetual contract code: ```swap```.
  Set to perpetual contract: ```exchange.SetContractType("swap")```. Setting the trading pair to ```BTC_USD``` yields a coin-margined contract, and setting the trading pair to ```BTC_USDT``` yields a ```USDT```-settled contract.
- Futures_Crypto
  Tokens in the crypto.com exchange account can be converted into a USD-denominated allowance to be used as margin for contract trading.
  Set to perpetual contract: ```exchange.SetContractType("swap")```. For example, when the trading pair is set to ```BTC_USD```, calling the ```exchange.SetContractType("swap")``` function sets the perpetual contract of BTC.
  The delivery contracts on the crypto.com exchange are monthly contracts, with the following contract codes (January through December):
  ```code
  "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
  ```
  Set a delivery contract: ```exchange.SetContractType("October")```. For example, when the trading pair is set to ```BTC_USD```, calling the ```exchange.SetContractType("October")``` function sets the October delivery contract of BTC.
  The contract code corresponding to the current moment is ```BTCUSD-231027```.
- Futures_WOO
  The Futures_WOO exchange supports ```USDT```-margined contracts, with perpetual contract code ```swap```. For example, when the trading pair is set to ```BTC_USDT```, calling the ```exchange.SetContractType("swap")``` function sets the current contract to the USDT-margined perpetual contract of BTC.
- Futures_Hyperliquid
  The Futures_Hyperliquid exchange supports ```USDC```-margined contracts, with perpetual contract code ```swap```. For example, when the trading pair is set to ```ETH_USD```, calling the ```exchange.SetContractType("swap")``` function sets the current contract to the USDC-margined perpetual contract of ETH.
  Futures_Hyperliquid has only the ```USD.swap``` instrument dimension, and the margin used is USDC.
  Futures_Hyperliquid supports HIP-3 instruments.
- Futures_Lighter
  The Futures_Lighter exchange supports ```USDC```-margined contracts, with perpetual contract code ```swap```. For example, when the trading pair is set to ```BTC_USDC```, calling the ```exchange.SetContractType("swap")``` function sets the current contract to the USDC-margined perpetual contract of BTC.
  Futures_Lighter supports perpetual contracts only.
- Futures_Backpack
  The Futures_Backpack exchange supports ```USDC```-margined contracts, with perpetual contract code ```swap```. For example, when the trading pair is set to ```ETH_USDC```, calling the ```exchange.SetContractType("swap")``` function sets the current contract to the USDC-margined perpetual contract of ETH.
- Futures_edgeX
  The Futures_edgeX exchange supports ```USDC```-margined contracts, with perpetual contract code ```swap```. For example, when the trading pair is set to ```BTC_USDC```, calling the ```exchange.SetContractType("swap")``` function sets the current contract to the USDC-margined perpetual contract of BTC; the full symbol is ```BTC_USDC.swap```.
- Futures_WOOFI
  The Futures_WOOFI exchange supports ```USDC```-margined contracts, with perpetual contract code ```swap```. For example, when the trading pair is set to ```ETH_USDC```, calling the ```exchange.SetContractType("swap")``` function sets the current contract to the USDC-margined perpetual contract of ETH.
- Futures_Coinw
  The Futures_Coinw exchange supports ```USDT```-margined contracts, with perpetual contract code ```swap```. For example, when the trading pair is set to ```ETH_USDT```, calling the ```exchange.SetContractType("swap")``` function sets the current contract to the USDT-margined perpetual contract of ETH.
- Futures_Aster
  The Futures_Aster exchange supports ```USDT```-margined contracts, with perpetual contract code ```swap```. For example, when the trading pair is set to ```ETH_USDT```, calling the ```exchange.SetContractType("swap")``` function sets the current contract to the USDT-margined perpetual contract of ETH.
- Futures_DeepCoin
  Coin-margined contracts: for example, set the trading pair to ```BTC_USD```, then set the contract code, which yields a coin-margined contract.
  Set to perpetual contract: ```exchange.SetContractType("swap")```.

  Contracts using USDT as margin:
  For example, set the trading pair to ```BTC_USDT```, then set the contract code, which yields a contract using USDT as margin.
  Set to perpetual contract: ```exchange.SetContractType("swap")```.

See also: `exchange.GetContractType`, `exchange.SetCurrency`

#### exchange.GetContractType

```
exchange.GetContractType()
```

The ```exchange.GetContractType()``` function is used to get the contract code currently set for the `exchange` exchange object.

Returns (string): The ```exchange.GetContractType()``` function returns a contract code defined by the FMZ platform, for example: ```this_week```, ```swap```, etc.

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

The ```exchange.SetDirection()``` function is used to set the order direction when calling the `exchange.Buy` function or `exchange.Sell` function to place futures contract orders.

Parameters:

- `direction` (string, required): The ```direction``` parameter is used to set the direction when placing a futures contract order. The available values are: ```"buy"```, ```"closesell"```, ```"sell"```, ```"closebuy"```.

```javascript
function main(){
    // For example, set to OKX futures this-week contract
    exchange.SetContractType("this_week")
    // Set leverage to 5x
    exchange.SetMarginLevel(5)
    // Set the order direction to long
    exchange.SetDirection("buy")
    // Place an order at a price of 10000 with a quantity of 2 contracts
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
    // Note: In the Rust SDK, using the SetDirection, Buy, and Sell functions is not recommended. It is advisable to prefer the CreateOrder function,
    // CreateOrder can directly specify the side parameter ("buy", "sell", "closebuy", "closesell"), without needing to call SetDirection first
    // For example, set to OKX futures this-week contract
    exchange.SetContractType("this_week").unwrap();
    // Set leverage to 5x
    exchange.SetMarginLevel(5);
    // Set the order direction to long
    exchange.SetDirection("buy").unwrap();
    // Place an order at a price of 10000 with a quantity of 2 contracts
    exchange.Buy(10000, 2).unwrap();
    exchange.SetMarginLevel(5);
    exchange.SetDirection("closebuy").unwrap();
    exchange.Sell(1000, 2).unwrap();
}
```

The ```exchange.SetDirection()``` function is used to set the correspondence between the futures contract trading direction and the order-placing functions:


|Order Function|Direction Set by SetDirection|Remarks|
|-|-|-|
|exchange.Buy|"buy"|Buy to open long position|
|exchange.Buy|"closesell"|Buy to close short position|
|exchange.Sell|"sell"|Sell to open short position|
|exchange.Sell|"closebuy"|Sell to close long position|

```exchange.SetDirection()``` is only for futures exchange objects. Spot exchange objects neither need nor should call it: on spot the order side is determined by the function itself, ```exchange.Buy()``` buys and ```exchange.Sell()``` sells.

See also: `exchange.Buy`, `exchange.Sell`

#### exchange.SetMarginLevel

```
exchange.SetMarginLevel(symbol, marginLevel)
exchange.SetMarginLevel(marginLevel)
```

The ```exchange.SetMarginLevel()``` function is used to set the leverage value for the trading pair or contract specified by the ```symbol``` parameter. It is also compatible with a calling method that passes only the ```marginLevel``` parameter, which is used to set the leverage value of the current trading pair or contract of the `exchange` exchange object.

Parameters:

- `symbol` (string, optional): The ```symbol``` parameter is used to specify the trading pair or contract whose leverage value needs to be adjusted. The format of the ```symbol``` parameter in the ```SetMarginLevel()``` function is consistent with the format of the ```symbol``` parameter in the ```GetTicker()``` function.
- `marginLevel` (number, required): The ```marginLevel``` parameter is used to set the leverage value. The leverage value of an exchange is usually an integer, and some exchanges also support setting the leverage value in floating-point form.

```javascript
function main() {
    exchange.SetMarginLevel(10)
    // Set the leverage of BTC's USDT-margined perpetual contract to 15
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
    // In the Rust SDK, the SetMarginLevel function does not support the symbol parameter; it only sets the leverage value of the current trading pair or contract
    // To set the leverage of the BTC_USDT.swap instrument to 15, you need to switch to that trading pair or contract first and then call exchange.SetMarginLevel(15)
}
```

The ```exchange.SetMarginLevel()``` function only supports cryptocurrency futures contract exchange objects. The backtesting system supports calling the ```exchange.SetMarginLevel()``` function to set the leverage value.

For cryptocurrency futures contracts, the leverage mechanisms of different cryptocurrency futures contract exchanges are not unified.

On some exchanges, the leverage value of a futures contract is a parameter in the order-placing interface. In this case, calling the ```exchange.SetMarginLevel()``` function does not generate a network request; it merely sets the underlying leverage variable in the FMZ system (used for passing parameters to the order-placing interface).

On other exchanges, the leverage value of a futures contract is an independent setting of the exchange, which needs to be set through the exchange's website page or API interface. In this case, calling the ```exchange.SetMarginLevel()``` function will generate a network request and may fail to set the value. There can be various reasons for failure, for example: there are currently open positions or pending orders, which prevents a new leverage value from being set for that trading pair or contract.

Exchanges that do not support the ```exchange.SetMarginLevel()``` function:

| Function Name | Unsupported Spot Exchanges | Unsupported Futures Exchanges |
| - | - | - |
| SetMarginLevel | -- | Futures_dYdX / Futures_Deribit / Futures_edgeX |

See also: `exchange`

#### exchange.GetPositions

```
exchange.GetPositions()
exchange.GetPositions(symbol)
```

```exchange.GetPositions()``` function is used to get position information; the ```GetPositions()``` function is a member function of the exchange object `exchange`.

```GetPositions()``` function is used to get the position information of the exchange account bound to the exchange object ```exchange```. The purpose of the member functions (methods) of the ```exchange``` object is only related to ```exchange```, which will not be repeated in the rest of this document.

Parameters:

- `symbol` (string, optional): The ```symbol``` parameter is used to specify the **trading instrument** or **range of trading instruments** to be queried.

When the ```symbol``` parameter is not passed in, by default it requests the position data of all instruments within the dimension range of the current trading pair and contract code.

Returns (`Position` array / null value): The ```exchange.GetPositions()``` function returns a `Position` structure array when the data request succeeds, and returns a null value when the data request fails.

Using the futures exchange object, place market orders on multiple symbols with different trading pairs and contract codes, and query position information through various methods.

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

    // After printing the information once, return to prevent subsequent order fills during backtesting from affecting data observation
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

    // The Rust SDK has no JSON serialization; use format! to concatenate the table's JSON text
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

    // After printing the information once, return to prevent subsequent order fills during backtesting from affecting data observation
    return;
}
```

Cryptocurrency futures contracts are different from cryptocurrency spot; spot only has a logical concept of position. In the FMZ Quant Trading Platform system, the specific instrument of a cryptocurrency futures contract is jointly identified by the **trading pair** and the **contract code**. Refer to the `exchange.SetCurrency` and `exchange.SetContractType` functions.

In the ```GetPositions``` function, the usage scenarios of the symbol parameter are summarized as follows:

| Exchange Object Category | symbol Parameter | Query Scope | Remarks |
| - | - | - | - |
| Futures | symbol parameter not passed | Query all trading instruments within the dimension range of the current trading pair and contract code | If the current trading pair is BTC_USDT and the contract code is swap, it queries all USDT-margined perpetual contracts. Equivalent to calling ```GetPositions("USDT.swap")``` |
| Futures | Specify a trading instrument, symbol parameter is: "BTC_USDT.swap" | Query the specified BTC USDT-margined perpetual contract | For a futures exchange object, the format of the symbol parameter is: the combination of the **trading pair** and **contract code** defined by the FMZ platform, separated by the character ```"."```. |
| Futures | Specify a range of trading instruments, symbol parameter is: "USDT.swap" | Query all USDT-margined perpetual contracts | - |
| Futures exchange supporting options | symbol parameter not passed | Query all option contracts within the dimension range of the current trading pair | If the current trading pair is BTC_USDT and the contract is set to an option contract, for example, a Binance option contract: BTC-240108-40000-C |
| Futures exchange supporting options | Specify a specific trading instrument | Query the specified option contract | For example, for the Binance futures exchange, the symbol parameter is: BTC_USDT.BTC-240108-40000-C |
| Futures exchange supporting options | Specify a range of trading instruments, symbol parameter is: "USDT.option" | Query all USDT-margined option contracts | - |

In the ```GetPositions``` function, the query dimension ranges of the futures exchange object are summarized as follows:

| symbol Parameter | Request Scope Definition | Remarks |
| - | - | - |
| USDT.swap          | Scope of USDT-margined perpetual contracts.  | For dimensions not supported by the exchange API interface, calling it will report an error and return a null value. |
| USDT.futures       | Scope of USDT-margined delivery contracts.  | - |
| USD.swap           | Scope of coin-margined perpetual contracts.    | - |
| USD.futures        | Scope of coin-margined delivery contracts.    | - |
| USDT.option        | Scope of USDT-margined option contracts.  | - |
| USD.option         | Scope of coin-margined option contracts.    | - |
| USDT.futures_combo | Scope of spread combo contracts.      | Futures_Deribit exchange |
| USD.futures_ff     | Scope of mixed-margin delivery contracts. | Futures_Kraken exchange |
| USD.swap_pf        | Scope of mixed-margin perpetual contracts. | Futures_Kraken exchange |

Compatible with the ```exchange.GetPosition()``` call; ```GetPosition``` and ```GetPositions``` are used in exactly the same way.

When the account represented by the exchange object ```exchange``` has no positions **within the query scope** or on the **specified trading instrument**, the ```exchange.GetPositions()``` function returns an empty array, for example: ```[]```.

See also: `Position`, `exchange.SetCurrency`, `exchange.SetContractType`

#### exchange.GetFundings

```
exchange.GetFundings()
exchange.GetFundings(symbol)
```

The ```exchange.GetFundings()``` function is used to obtain the funding rate data for the current period.

Parameters:

- `symbol` (string, optional): The ```symbol``` parameter is used to specify the **trading pair** or **trading pair range** to be queried. If the ```symbol``` parameter is not passed in, by default the current-period funding rate data for all trading pairs is requested within the dimensional scope of the current trading pair and contract code.

Returns (`Funding` array / null value): When the ```exchange.GetFundings()``` function successfully requests data, it returns a `Funding` structure array; when the data request fails, it returns a null value.

Using the futures exchange object, call the ```exchange.GetFundings()``` function in the backtesting system. Before any market data function is called, GetFundings returns only the Funding data of the current default trading pair; after a market data function is called, it returns the Funding data of all symbols that have been requested. Refer to the following test example:

```javascript
/*backtest
start: 2024-10-01 00:00:00
end: 2024-10-23 00:05:00
period: 1m
basePeriod: 1m
exchanges: [{"eid":"Futures_Binance","currency":"SOL_USDC"}]
*/

function main() {
    // LPT_USDT.swap 4-hour interval
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
    # LPT_USDT.swap 4-hour interval
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
    // LPT_USDT.swap 4-hour interval
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

    // The Rust SDK has no JSON serialization; use format! to concatenate the table's JSON text
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

For futures exchanges that do not support batch querying of funding rate data, if the ```symbol``` parameter is specified as a query range (for example ```USDT.swap```) or is not passed in, the interface will report an error. When calling the ```GetFundings()``` function on such futures exchange objects, the ```symbol``` parameter must be specified as a specific perpetual contract in order to query the current-period funding rate data for that trading pair.

The ```exchange.GetFundings()``` function supports both live trading and the backtesting system.

Exchanges that do not support batch retrieval of funding rate data: Futures_Bitget, Futures_OKX, Futures_MEXC, Futures_Deribit, Futures_Crypto. When calling, you need to pass in the ```symbol``` parameter to specify the concrete trading pair code, for example: ```ETH_USDT.swap```.

Exchanges that do not support the ```exchange.GetFundings()``` function:

  | Function Name | Unsupported Spot Exchanges | Unsupported Futures Exchanges |
  | - | - | - |
  | GetFundings | -- | Futures_DigiFinex |

See also: `Funding`

### Exchange

Properties and settings of an exchange object (```exchange```, ```exchanges[n]```): name and label, current trading pair and quote currency, K-line period, order precision, exchange rate, API base address, proxy and timeout, and signing data the way the exchange requires.

#### exchange.GetName

```
exchange.GetName()
```

The ```exchange.GetName()``` function is used to get the name of the exchange bound to the current exchange object.

Returns (string): The ```exchange.GetName()``` function returns the exchange name defined by the FMZ Quant Trading Platform.

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

The ```exchange.GetName()``` function is typically used to identify the ```exchange``` or ```exchanges[1]```, ```exchanges[2]```, and other exchange objects in the strategy code. The name of a cryptocurrency futures contract exchange carries the fixed prefix ```Futures_```.

See also: `exchange.GetLabel`

#### exchange.GetLabel

```
exchange.GetLabel()
```

The ```exchange.GetLabel()``` function is used to obtain the custom label set when configuring the exchange object.

Returns (string): The ```exchange.GetLabel()``` function returns the custom label set when configuring the exchange object.

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

By means of the label that was set, you can identify the ```exchange``` or ```exchanges[1]```, ```exchanges[2]``` and other exchange objects in the strategy code.

See also: `exchange`

#### exchange.GetCurrency

```
exchange.GetCurrency()
```

The ```exchange.GetCurrency()``` function is used to get the currently set trading pair.

Returns (string): The ```exchange.GetCurrency()``` function returns the trading pair set on the current `exchange` exchange object.

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

The trading pair format uniformly uses uppercase, with an underscore separating ```baseCurrency``` and ```quoteCurrency```, for example: ```BTC_USDT```.

See also: `exchange.SetCurrency`

#### exchange.SetCurrency

```
exchange.SetCurrency(currency)
```

The ```exchange.SetCurrency()``` function is used to switch the current trading pair of the exchange object `exchange`.

Parameters:

- `currency` (string, required): The ```currency``` parameter is used to specify the trading pair to switch to. The trading pair format is uniformly uppercase, using an underscore to separate ```baseCurrency``` and ```quoteCurrency```, for example: ```BTC_USDT```.

```javascript
function main() {
    var ticker = exchange.GetTicker()
    Log(ticker)
    Log(exchange.GetAccount())
    // Switch the trading pair, note the changes in market data and account information after switching
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
    // Switch the trading pair, note the changes in market data and account information after switching
    exchange.SetCurrency("LTC_USDT");
    Log!("Switched to LTC_USDT");
    let ticker = exchange.GetTicker(None).unwrap();
    Log!(ticker);
    Log!(exchange.GetAccount());
}
```

1. Compatible with the ```exchange.IO("currency", "BTC_USDT")``` switching method, see `exchange.IO` for details.

  2. Switching trading pairs is supported in the backtesting system, but when switching trading pairs in the backtesting system, the name of the quote currency cannot be changed. For example: ```BTC_USDT``` can be switched to ```LTC_USDT```, but cannot be switched to ```LTC_BTC```.

  3. After switching to a trading pair other than the one initially set on the backtesting page, the amount of the base currency is 0. For example: during backtesting, the trading pair initially set on the backtesting page is ```BTC_USDT```, with 3 ```BTC``` and 10000 ```USDT```. If you immediately switch to ```LTC_USDT``` at this point, the amount of the base currency after switching is 0, i.e., the amount of ```LTC``` in the account is 0; the amount of ```USDT``` is shared after switching, i.e., the amount remains 10000.

See also: `exchange.GetCurrency`

#### exchange.GetQuoteCurrency

```
exchange.GetQuoteCurrency()
```

The ```exchange.GetQuoteCurrency()``` function is used to get the name of the quote currency of the current trading pair, i.e. ```quoteCurrency```.

Returns (string): The ```exchange.GetQuoteCurrency()``` function returns the name of the quote currency of the current trading pair.

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

For example: when the current trading pair of the `exchange` exchange object is ```BTC_USDT```, the ```exchange.GetQuoteCurrency()``` function returns ```USDT```; if the current trading pair is ```ETH_BTC```, then the ```exchange.GetQuoteCurrency()``` function returns ```BTC```.

See also: `exchange.GetCurrency`, `exchange.SetCurrency`

#### exchange.GetPeriod

```
exchange.GetPeriod()
```

Retrieves the K-line period configured on the FMZ Quant Trading platform website page when running a strategy in backtesting or live trading, i.e., the default K-line period used when calling the ```exchange.GetRecords()``` function without passing any parameters.

Returns (number): The number of seconds of the K-line period, an integer value, in seconds.

```javascript
function main() {
    // For example, the K-line period set on the FMZ Quant Trading platform website page during backtesting or live trading is 1 hour
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
    // For example, the K-line period set on the FMZ Quant Trading platform website page during backtesting or live trading is 1 hour
    let period = exchange.GetPeriod();
    Log!("K-line period:", period as f64 / (60.0 * 60.0), "hours");
}
```

See also: `exchange.GetRecords`

#### exchange.SetMaxBarLen

```
exchange.SetMaxBarLen(len)
```

Set the maximum length of the K-line (candlestick chart).

Parameters:

- `len` (number, required): The parameter ```len``` is used to specify the maximum length of the K-line.

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

The ```exchange.SetMaxBarLen()``` function affects the following two aspects when a cryptocurrency strategy is running:

- It affects the number of K-line bars (Bar) obtained on the first call.

- It affects the upper limit on the number of K-line bars (Bar).

See also: `exchange.GetRecords`

#### exchange.SetPrecision

```
exchange.SetPrecision(pricePrecision, amountPrecision)
```

The ```exchange.SetPrecision()``` function is used to set the precision of the **price** and **order amount** for the ```exchange``` exchange object. Once set, the system will automatically ignore any excess portion of the data that exceeds the specified precision.

Parameters:

- `pricePrecision` (number, required): The ```pricePrecision``` parameter is used to set the precision of the price data.
- `amountPrecision` (number, required): The ```amountPrecision``` parameter is used to set the precision of the order amount data.

```javascript
function main(){
    // Set the price decimal precision to 2 digits and the order amount decimal precision to 3 digits
    exchange.SetPrecision(2, 3)
}
```

```python
def main():
    exchange.SetPrecision(2, 3)
```

```rust
fn main() {
    // Set the price decimal precision to 2 digits and the order amount decimal precision to 3 digits
    exchange.SetPrecision(2, 3);
}
```

The backtesting system does not support this function; the numerical precision in the backtesting system is handled automatically by the system.

See also: `exchange.Buy`, `exchange.Sell`

#### exchange.GetRate

```
exchange.GetRate()
```

Get the exchange rate currently set for the exchange object.

Returns (number): The current exchange rate value of the exchange object.

```javascript
function main(){
    Log(exchange.GetTicker())
    // Set exchange rate conversion
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
    // Set exchange rate conversion
    exchange.SetRate(7);
    Log!(exchange.GetTicker(None));
    Log!("Current rate:", exchange.GetRate());
}
```

If the conversion rate has not been set by calling ```exchange.SetRate()```, the ```exchange.GetRate()``` function will return the default rate value ```1```, meaning that the data related to the currently displayed quote currency (quoteCurrency) has not been converted by any exchange rate.

If an exchange rate value has been set using ```exchange.SetRate()```, for example ```exchange.SetRate(7)```, then all price information obtained through the ```exchange``` exchange object—such as tickers, market depth, and order prices—will be multiplied by the set rate ```7``` for conversion.

If ```exchange``` corresponds to an exchange that uses the US dollar as its quote currency, after calling ```exchange.SetRate(7)```, all prices in live trading will be multiplied by ```7```, converting them to prices close to the Chinese yuan (CNY). At this point, the rate value obtained through ```exchange.GetRate()``` is ```7```.

See also: `exchange.SetRate`

#### exchange.SetRate

```
exchange.SetRate(rate)
```

Sets the current exchange rate for the exchange object.

Parameters:

- `rate` (number, required): The ```rate``` parameter is used to specify the conversion rate.

```javascript
function main(){
    Log(exchange.GetTicker())
    // Set the exchange rate conversion
    exchange.SetRate(7)
    Log(exchange.GetTicker())
    // Set to 1, no conversion
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
    // Set the exchange rate conversion
    exchange.SetRate(7);
    Log!(exchange.GetTicker(None));
    // Set to 1, no conversion
    exchange.SetRate(1);
}
```

If you set an exchange rate value using the ```exchange.SetRate()``` function (for example, set it to 7), then all price information represented by the current ```exchange``` object — such as tickers, depth, order prices, and so on — will be multiplied by the set rate of 7 for conversion.

For example, ```exchange``` is an exchange with USD as its quote currency. After executing ```exchange.SetRate(7)```, all prices in live trading will be multiplied by 7, converting them to prices close to those quoted in **CNY**.

See also: `exchange.GetRate`

#### exchange.SetBase

```
exchange.SetBase(s)
```

The ```exchange.SetBase()``` function is used to set the base URL of the exchange API interface used by the `exchange` exchange object.

Parameters:

- `s` (string, required): The ```s``` parameter is used to specify the base URL of the exchange API interface.

```javascript
function main() {
    // Use the default base URL
    Log(exchange.GetTicker())
    // Switch to https://aws.okx.com
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
    // Use the default base URL
    Log!(exchange.GetTicker(None));
    // Switch to https://aws.okx.com
    exchange.SetBase("https://aws.okx.com");
    Log!(exchange.GetTicker(None));
}
```

The backtesting system does not support switching the base URL of the exchange API interface, because the backtesting system is a sandbox simulation environment and does not actually access the exchange's API interface.

See also: `exchange.IO`

#### exchange.GetBase

```
exchange.GetBase()
```

The ```exchange.GetBase()``` function is used to get the base address of the current exchange API interface.

Returns (string): The base address of the current exchange API interface.

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

The ```exchange.SetProxy()``` function is used to configure the proxy settings of the `exchange` exchange object.

Parameters:

- `proxy` (string, required): The ```proxy``` parameter is used to specify the proxy configuration.

Configure a ```socks5``` proxy for the `exchange` exchange object:

```javascript
function main() {
    exchange.SetProxy("socks5://192.168.1.10:8080")
    // If the exchange market data interface cannot be accessed, set an available socks5 proxy to access the market data interface
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
    // If the exchange market data interface cannot be accessed, set an available socks5 proxy to access the market data interface
    Log!(exchange.GetTicker(None));
}
```

In addition to **globally specifying** the IP address used by the `exchange` exchange object to send requests, specifying the IP address individually based on the `exchange` is also supported:

```javascript
function main(){
    exchange.SetProxy("ip://10.0.3.15")
    // The IP address used to send requests is 10.0.3.15
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
    // The IP address used to send requests is 10.0.3.15
    let _ = exchange.GetTicker(None);
}
```

If the proxy setting fails, calling the ```exchange.SetProxy()``` function will return a null value.

The proxy setting feature of the ```exchange.SetProxy()``` function only supports the ```rest``` protocol. Each `exchange` exchange object can be assigned one proxy. Once a proxy is set, all access to the exchange interface bound to that `exchange` exchange object will go through this proxy.

Setting a ```socks5``` proxy is supported. Taking the first added exchange object `exchange` (i.e. ```exchanges[0]```) as an example:

- Set a proxy with no username and no password: ```exchange.SetProxy("socks5://127.0.0.1:8889")```.

- Set a proxy with a specified username and password: ```exchange.SetProxy("socks5://username:password@127.0.0.1:8889")```, where ```username``` is the username and ```password``` is the password.

- Switch back to normal mode without using a proxy: ```exchange.SetProxy("")```.

Specifying the IP address used by the `exchange` exchange object to send requests is supported. For details, see [Global specification](/user-guide/平台基础/托管者/命令行参数).

See also: `exchange`

#### exchange.SetTimeout

```
exchange.SetTimeout(timeout)
```

The ```exchange.SetTimeout()``` function is used to set the timeout for ```rest``` requests of the `exchange` exchange object.

Parameters:

- `timeout` (number, required): The ```timeout``` parameter is used to specify the timeout in milliseconds.

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

The ```timeout``` parameter is a value in milliseconds, where 1000 milliseconds equals 1 second. This setting only applies to the ```rest``` protocol and is used to set the timeout for ```rest``` requests; it only needs to be set once to take effect. For example: ```exchange.SetTimeout(3000)``` sets the ```rest``` request timeout of the ```exchange``` exchange object to 3 seconds; when calling functions that involve network requests such as ```exchange.GetTicker()```, if no response is received within 3 seconds, it is determined to be a timeout, and the timed-out function call will return a null value.

```SetTimeout()``` is not a global function, but a method of the `exchange` exchange object.

See also: `exchange`

#### exchange.Encode

```
exchange.Encode(algo, inputFormat, outputFormat, data)
exchange.Encode(algo, inputFormat, outputFormat, data, keyFormat, key)
```

The ```exchange.Encode()``` function is used to perform signature and encryption computations.

Parameters:

- `algo` (string, required): The ```algo``` parameter is used to specify the algorithm used in the encoding computation.

It supports the following settings: "raw" (no algorithm), "sign", "signTx", "md4", "md5", "sha256", "sha512", "sha1", "keccak256", "sha3.224", "sha3.256", "sha3.384", "sha3.512", "sha3.keccak256", "sha3.keccak512", "sha512.384", "sha512.256", "sha512.224", "ripemd160", "blake2b.256", "blake2b.512", "blake2s.128", "blake2s.256".

The ```algo``` parameter also supports: "text.encoder.utf8", "text.decoder.utf8", "text.encoder.gbk", "text.decoder.gbk", which are used to encode and decode strings.

The ```algo``` parameter also supports the "ed25519" algorithm, which can be combined with different hash algorithms. For example, the ```algo``` parameter can be written as "ed25519.md5", "ed25519.sha512", etc. The ```ed25519.seed``` computation is also supported.
- `inputFormat` (string, required): Used to specify the data format of the ```data``` parameter. The ```inputFormat``` parameter supports being set to one of: "raw", "hex", "base64", "string". "raw" represents raw data, "hex" represents ```hex```-encoded data, "base64" represents ```base64```-encoded data, and "string" represents string data.
- `outputFormat` (string, required): Used to specify the output data format. The ```outputFormat``` parameter supports being set to one of: "raw", "hex", "base64", "string". "raw" represents raw data, "hex" represents ```hex```-encoded data, "base64" represents ```base64```-encoded data, and "string" represents string data.
- `data` (string, required): The ```data``` parameter is the data to be processed.
- `keyFormat` (string, optional): Used to specify the data format of the ```key``` parameter. The ```keyFormat``` parameter supports being set to one of: "raw", "hex", "base64", "string". "raw" represents raw data, "hex" represents ```hex```-encoded data, "base64" represents ```base64```-encoded data, and "string" represents string data.
- `key` (string, optional): The ```key``` parameter is used to specify the key used in the signature computation. You can use a plaintext string, or you can use ```"{{accesskey}}"``` and ```"{{secretkey}}"``` to refer respectively to the ```accessKey``` and ```secretKey``` configured in the `exchange` exchange object.

Returns (string): The ```exchange.Encode()``` function returns the computed hash value encoding.

Example of BitMEX position change push (wss protocol):

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

Only live trading supports calling the ```exchange.Encode()``` function. The reference methods ```"{{accesskey}}"``` and ```"{{secretkey}}"``` are only valid when calling the ```exchange.Encode()``` function.

See also: `exchange`, `Encode`

### IO

```exchange.IO()``` calls the extended features of an exchange object; the first argument is the command name. Start with `exchange.IO` for the full list of commands and the commands specific to each exchange, then see the page of each command. Commands of Web3 and Uniswap exchange objects are in the Web3 and Uniswap categories.

#### exchange.IO

```
exchange.IO(k, ...args)
```

```exchange.IO()``` function is used to call other interfaces related to the exchange object.

Parameters:

- `k` (string, required): Call type identifier. Different values correspond to different functions; please refer to the descriptions in each section below for details.
- `arg` (string / number / bool / object / array / any, required): Extended parameters. Different parameters need to be passed in according to the different ```k``` values, and their number and types are not fixed.

Returns (string / number / bool / object / array / any): The ```exchange.IO()``` function is used to call other related interfaces of the exchange object. It returns the requested response data on a successful call, and returns a null value on a failed call.

Futures_edgeX calculates the order Hash and signs it:

```javascript
function main() {
    var strJson = `{
        "assetIdSynthetic":     "0x4554482d3900000000000000000000",
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

**Commands at a glance**

| Command | Description |
| - | - |
| ```"api"``` | Call a raw exchange endpoint that has no wrapper function |
| ```"currency"``` | Switch the trading pair at runtime |
| ```"base"``` / ```"mbase"``` | Switch the trading / market data API base address |
| ```"simulate"```, ```"cross"```, ```"dual"```, ```"unified"``` and more | Switch trading modes, see ```exchange.IO(mode, value)``` |
| ```"rate"``` / ```"quota"``` | Rate-limit API calls |

Each command has its own page in this category; the commands specific to each exchange are listed below.

**Exchange-Specific IO Commands**

All exchanges support the ```"api"``` and ```"currency"``` commands; only the exchange-specific commands are listed below.

---

#### Spot Exchanges

**Binance**

| Command | Parameter | Description |
| - | - | - |
| ```trade_margin``` | None | Switch to isolated margin mode |
| ```trade_super_margin``` | None | Switch to cross margin mode |
| ```trade_normal``` | None | Switch back to normal spot mode |
| ```unified``` | bool | Unified account mode |
| ```selfTradePreventionMode``` | string | Self-trade prevention; options: ```EXPIRE_TAKER```/```EXPIRE_MAKER```/```EXPIRE_BOTH```/```NONE``` |

**OKX**

| Command | Parameter | Description |
| - | - | - |
| ```simulate``` | bool | Switch between demo and live trading |
| ```trade_margin``` | None | Isolated margin (tdMode=isolated) |
| ```trade_super_margin``` | None | Cross margin (tdMode=cross) |
| ```trade_normal``` | None | Switch back to normal spot mode |
| ```tdMode``` | string | Directly set the trading mode; cross must be used in portfolio margin mode |

**Huobi**

| Command | Parameter | Description |
| - | - | - |
| ```trade_margin``` | None | Switch to isolated margin mode |
| ```trade_super_margin``` | None | Switch to cross margin mode |
| ```trade_normal``` | None | Switch back to normal spot mode |

**Bybit**

| Command | Parameter | Description |
| - | - | - |
| ```trade_margin``` | None | Switch to margin mode |
| ```trade_normal``` | None | Switch back to normal spot mode |

**Gate.io**

| Command | Parameter | Description |
| - | - | - |
| ```trade_margin``` | None | Switch to isolated margin mode |
| ```trade_super_margin``` | None | Switch to cross margin mode |
| ```trade_normal``` | None | Switch back to normal spot mode |
| ```unified``` | bool | Unified account mode |

**Bitget**

| Command | Parameter | Description |
| - | - | - |
| ```simulate``` | bool | Switch between demo and live trading |

**CoinEx**

| Command | Parameter | Description |
| - | - | - |
| ```trade_margin``` | None | Switch to margin mode |
| ```trade_normal``` | None | Switch back to normal mode |

**WOO**

| Command | Parameter | Description |
| - | - | - |
| ```trade_margin``` | None | Switch to margin mode |
| ```trade_normal``` | None | Switch back to normal mode |

**Crypto.com**

| Command | Parameter | Description |
| - | - | - |
| ```trade_margin``` | None | Switch to margin mode |
| ```trade_normal``` | None | Switch back to normal mode |

**AscendEx**

| Command | Parameter | Description |
| - | - | - |
| ```trade_margin``` | None | Switch to margin mode |
| ```trade_normal``` | None | Switch back to normal mode |

**Gemini**

| Command | Parameter | Description |
| - | - | - |
| ```subAccount``` | string | Set the sub-account name |

**Poloniex**

| Command | Parameter | Description |
| - | - | - |
| ```accountId``` | string | Set the account ID |

**Bitfinex**

| Command | Parameter | Description |
| - | - | - |
| ```version``` | None | Get the current API version number |

**Backpack**

| Command | Parameter | Description |
| - | - | - |
| ```selfTradePreventionMode``` | string | Self-trade prevention; options: ```Allow```/```RejectTaker```/```RejectMaker```/```RejectBoth```/```Ban``` |

**Hyperliquid (Spot)**

| Command | Parameter | Description |
| - | - | - |
| ```source``` | "a"/"b" | Switch the API data source |
| ```vaultAddress``` | string | Set the vault address; pass an empty string to disable |
| ```walletAddress``` | string | Set the wallet address |
| ```expiresAfter``` | number | Order expiration time (milliseconds); set to 0 to disable |

---

#### Futures Exchanges

**Futures_Binance (Binance Futures)**

| Command | Parameter | Description |
| - | - | - |
| ```cross``` | bool | Cross/isolated margin |
| ```dual``` | bool | Hedge/one-way position mode |
| ```unified``` | bool | Unified account (uses papi.binance.com after switching) |
| ```selfTradePreventionMode``` | string | Self-trade prevention; options: ```EXPIRE_TAKER```/```EXPIRE_MAKER```/```EXPIRE_BOTH```/```NONE``` |
| ```extend_key``` | string | Set extended fields in the API response (comma-separated) |

**Futures_OKX (OKX Futures)**

| Command | Parameter | Description |
| - | - | - |
| ```simulate``` | bool | Switch between demo and live trading |
| ```cross``` | bool | Cross/isolated margin; defaults to cross |
| ```dual``` | bool | Hedge (long_short_mode)/one-way (net_mode) position mode |

**Futures_HuobiDM (Huobi Futures)**

| Command | Parameter | Description |
| - | - | - |
| ```cross``` | bool | Cross/isolated margin; defaults to isolated. Only supported for ```XXX_USDT``` perpetual swaps (swap) |
| ```dual``` | bool | Hedge (dual_side)/one-way (single_side) position mode |
| ```unified``` | bool | Unified account mode |
| ```signHost``` | string | Set the API signature Host address; pass an empty string to disable |

**Futures_Bybit**

| Command | Parameter | Description |
| - | - | - |
| ```cross``` | bool | Cross/isolated margin |
| ```dual``` | bool | Hedge/one-way position mode |

**Futures_KuCoin**

| Command | Parameter | Description |
| - | - | - |
| ```cross``` | bool | Cross/isolated margin |

**Futures_GateIO**

| Command | Parameter | Description |
| - | - | - |
| ```cross``` | bool | Cross/isolated margin |
| ```dual``` | bool | Hedge/one-way position mode |
| ```unified``` | bool | Unified account mode |

**Futures_Bitget**

| Command | Parameter | Description |
| - | - | - |
| ```simulate``` | bool | Switch between demo and live trading |
| ```cross``` | bool | Cross (crossed)/isolated (isolated) margin |
| ```dual``` | bool | Hedge (hedge_mode)/one-way (one_way_mode) position mode |

**Futures_MEXC**

| Command | Parameter | Description |
| - | - | - |
| ```cross``` | bool | Cross/isolated margin |

**Futures_BitMEX**

| Command | Parameter | Description |
| - | - | - |
| ```cross``` | bool | Cross/isolated margin |

**Futures_CoinEx**

| Command | Parameter | Description |
| - | - | - |
| ```cross``` | bool | Cross/isolated margin |

**Futures_WOO**

| Command | Parameter | Description |
| - | - | - |
| ```cross``` | bool | Cross/isolated margin |
| ```dual``` | bool | Hedge/one-way position mode |

**Futures_Kraken**

| Command | Parameter | Description |
| - | - | - |
| ```cross``` | bool | Cross/isolated margin (only supported for multi-collateral accounts) |

**Futures_Aevo**

| Command | Parameter | Description |
| - | - | - |
| ```signingKey``` | string | Set the signing key and return the public key. Must be obtained from the exchange's API Key page; note that it is time-sensitive |

**Futures_Hyperliquid**

| Command | Parameter | Description |
| - | - | - |
| ```cross``` | bool | Cross/isolated margin |
| ```source``` | "a"/"b" | Switch the API data source |
| ```vaultAddress``` | string | Set the vault address; pass an empty string to disable |
| ```walletAddress``` | string | Set the wallet address |
| ```expiresAfter``` | number | Order expiration time (milliseconds); set to 0 to disable |

**Futures_Deepcoin**

| Command | Parameter | Description |
| - | - | - |
| ```cross``` | bool | Cross/isolated margin |
| ```merge``` | bool | Merge positions (true)/split positions (false) |

**Futures_DigiFinex**

| Command | Parameter | Description |
| - | - | - |
| ```simulate``` | bool | Switch between demo and live trading |
| ```cross``` | bool | Cross/isolated margin |

**Futures_ApolloX**

| Command | Parameter | Description |
| - | - | - |
| ```cross``` | bool | Cross/isolated margin |

**Futures_Aster**

| Command | Parameter | Description |
| - | - | - |
| ```cross``` | bool | Cross/isolated margin |
| ```dual``` | bool | Hedge/one-way position mode |

**Futures_CoinW**

| Command | Parameter | Description |
| - | - | - |
| ```cross``` | bool | Cross/isolated margin |

**Futures_BitMart**

| Command | Parameter | Description |
| - | - | - |
| ```cross``` | bool | Cross/isolated margin |

**Futures_Backpack**

| Command | Parameter | Description |
| - | - | - |
| ```selfTradePreventionMode``` | string | Self-trade prevention; options: ```Allow```/```RejectTaker```/```RejectMaker```/```RejectBoth```/```Ban``` |

**Futures_Lighter**

| Command | Parameter | Description |
| - | - | - |
| ```cross``` | bool | Cross/isolated margin |
| ```expiry``` | number | Order expiration timestamp (milliseconds); defaults to 29 days, minimum 4 minutes |

**Futures_Crypto.com**

| Command | Parameter | Description |
| - | - | - |
| ```accountId``` | string | Set the trading account ID |

**Futures_Bitfinex**

| Command | Parameter | Description |
| - | - | - |
| ```mbase``` | string | Set the market data API base address |

**Futures_edgeX**

| Command | Parameter | Description |
| - | - | - |
| ```calcOrderHashAndSign``` | string(JSON) | Compute the order hash and sign it; returns the signature string |

**Futures_Bibox**

| Command | Parameter | Description |
| - | - | - |
| ```cross``` | bool | Cross/isolated margin; defaults to cross |

**Futures_Pionex**

| Command | Parameter | Description |
| - | - | - |
| ```cross``` | bool | Cross/isolated margin |
| ```dual``` | bool | Hedge/one-way position mode |

**Futures_Phemex**

| Command | Parameter | Description |
| - | - | - |
| ```dual``` | bool | Hedge/one-way position mode. Cross/isolated margin must be set on the exchange's web interface |

**Futures_WooFi**

> Only the generic commands ```"api"``` and ```"currency"``` are supported; no exchange-specific commands.

**Special Platform IO Commands**

**Polymarket (Prediction Market)**

| Command | Parameters | Description |
| - | - | - |
| ```nonce``` | [number] | Gets or sets the order's nonce value. Returns the current nonce when no parameter is passed; sets a new nonce when a value is passed |
| ```proxyWalletAddress``` | None | Gets the proxy wallet address |
| ```redeem``` | symbol, [wait] | Redeems settled positions (gas-free via Relayer). wait defaults to true, waiting for transaction confirmation; when wait is false, returns ```{"transactionID": "..."}``` immediately |
| ```merge``` | symbol, [amount], [wait] | Merges and redeems YES+NO tokens into USDC (gas-free via Relayer). When amount is 0 or not passed, automatically takes the smaller position size of the two outcomes. wait defaults to true, waiting for transaction confirmation |
| ```l2_credentials``` | None | Gets L2 authentication information, returns ```{"apiKey":"","secret":"","passphrase":""}```, used for scenarios such as WebSocket connections |
| ```batchOrders``` | array | Batch order placement; the parameter is an array of order objects, each object containing ```symbol```, ```side```, ```price```, ```amount``` fields, as well as an optional ```option``` field |

**Web3 (Blockchain)**

| Command | Parameters | Description |
| - | - | - |
| ```abi``` | contract address, ABI string | Registers a contract ABI |
| ```address``` | [private key] | Gets the wallet address |
| ```encode``` / ```pack``` | type, data... | ABI-encodes data |
| ```encodePacked``` | type, data... | ABI tightly-packed encodes data |
| ```hash``` | param 1-4 | Computes the hash value |
| ```decode``` / ```unpack``` | type, data... | ABI-decodes data |
| ```key``` | string | Switches the private key used for operations |

**IB (Interactive Brokers)**

| Command | Parameters | Description |
| - | - | - |
| ```status``` | None | Gets the connection status |
| ```time``` | None | Gets the IB server time |
| ```reqId``` | None | Forces retrieval of a new request ID |
| ```orderId``` | None | Gets the next available order ID |
| ```ignore``` | string (array) | Ignores the specified error codes |
| ```scan``` | string (JSON) | Executes the market scanner |
| ```wait``` | [number] | Waits for a market data event, with an optional timeout in seconds |
| ```debug``` | bool | Debug mode: when on, every frame sent to or received from TWS/IB Gateway is logged in the gateway's API log format |
| ```marketDataType``` | number | Market data type (1 real-time / 2 frozen / 3 delayed / 4 delayed frozen) |

**Futu (Futu Securities)**

| Command | Parameters | Description |
| - | - | - |
| ```refresh``` | bool | Cache refresh; when caching is disabled, the rate limit is a maximum of 10 times per 30 seconds |
| ```accounts``` | None | Gets the list of all accounts |
| ```status``` | None | Gets the connection status |
| ```lock``` | None | Locks trading |
| ```unlock``` | None | Unlocks trading |
| ```wait``` | None | Waits for a market data event |

See also: `exchange.SetBase`, `exchange.SetCurrency`

#### exchange.IO("api", ...)

```
exchange.IO(k, httpMethod, resource)
exchange.IO(k, httpMethod, resource, params)
exchange.IO(k, httpMethod, resource, params, raw)
```

Forms:

- `exchange.IO("api", ...)`

```exchange.IO("api", ...)``` calls a raw REST endpoint of the exchange that has no wrapper function; the platform signs the request.

Parameters:

- `k` (string, required): The ```k``` parameter selects the ```exchange.IO()``` feature; ```"api"``` calls a raw exchange endpoint.
- `httpMethod` (string, required): The ```httpMethod``` parameter is the HTTP method, e.g. ```GET```, ```POST```, ```DELETE```.
- `resource` (string, required): The ```resource``` parameter is the endpoint path; a full URL also works (its host replaces the current base address).
- `params` (string, optional): The ```params``` parameter holds URL-encoded request parameters.
- `raw` (string, optional): The ```raw``` parameter is the raw request body, e.g. a JSON string.

Returns (object / array / null value): Returns the full response of the endpoint, or a null value on failure. Live trading only.

Use the ```"api"``` mode to call the OKX futures batch order placement interface, and pass the JSON-formatted order data via the ```raw``` parameter:

```javascript
function main() {
    var arrOrders = [
        {"instId":"BTC-USDT-SWAP","tdMode":"cross","side":"buy","ordType":"limit","px":"16000","sz":"1","posSide":"long"},
        {"instId":"BTC-USDT-SWAP","tdMode":"cross","side":"buy","ordType":"limit","px":"16000","sz":"2","posSide":"long"}
    ]

    // Call exchange.IO to directly access the exchange's batch order placement interface
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
    // Rust has no JSON serialization; construct the order array directly using a raw string
    let arrOrders = r#"[
        {"instId":"BTC-USDT-SWAP","tdMode":"cross","side":"buy","ordType":"limit","px":"16000","sz":"1","posSide":"long"},
        {"instId":"BTC-USDT-SWAP","tdMode":"cross","side":"buy","ordType":"limit","px":"16000","sz":"2","posSide":"long"}
    ]"#;

    // Call exchange.IO to directly access the exchange's batch order placement interface; multiple parameters are passed in as a tuple
    let ret = exchange.IO(("api", "POST", "/api/v5/trade/batch-orders", "", arrOrders));
    Log!(ret);
}
```

When the value of a key in the ```params``` parameter is of string type, you need to wrap the parameter value with single quotes:

```javascript
var amount = 1
var price = 10
var basecurrency = "ltc"
function main () {
    // Note that there is a ' character on both the left and right sides of amount.toString() and price.toString()
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
    // Note that there is a ' character on both the left and right sides of the amount and price parameter values
    let message = format!("symbol={}&amount='{}'&price='{}'&side=buy&type=limit", basecurrency, amount, price);
    let id = exchange.IO(("api", "POST", "/v1/order/new", message));
}
```

The ```resource``` parameter supports passing in a complete URL:

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

A GET request that does not use the ```raw``` parameter:

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

**Directly Calling Exchange APIs (```"api"``` mode)**

```javascript

exchange.IO("api", httpMethod, resource, params, raw)

```

Used to call the exchange's native API endpoints that are not wrapped by FMZ. FMZ automatically handles signature verification; you only need to fill in the request parameters.

| Parameter | Type | Required | Description |
| - | - | - | - |
| httpMethod | string | Yes | ```GET```, ```POST```, etc. |
| resource | string | Yes | Request path or full URL |
| params | string | No | Request parameters in URL-encoded format |
| raw | string | No | Raw request body (JSON, etc.) |

Returns a null value on failure, and this mode is only supported in live trading.

See also: `exchange.IO`

#### exchange.IO("currency", ...)

```
exchange.IO(k, symbol)
```

Forms:

- `exchange.IO("currency", ...)`

```exchange.IO("currency", ...)``` switches the current trading pair of the exchange object at runtime.

Parameters:

- `k` (string, required): The ```k``` parameter selects the ```exchange.IO()``` feature; ```"currency"``` switches the trading pair.
- `symbol` (string, required): The ```symbol``` parameter is the trading pair, upper case and underscore-separated, e.g. ```ETH_USDT```.

Returns (string / number / bool / object / array / any): Returns the result of the command on success, or a null value on failure.

Switch trading pair at runtime:

```javascript
function main() {
    // For example, when the live bot starts, the exchange object's current trading pair is BTC_USDT; print the ticker of the current trading pair
    Log(exchange.GetTicker())
    // Switch the trading pair to LTC_BTC
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
    // For example, when the live bot starts, the exchange object's current trading pair is BTC_USDT; print the ticker of the current trading pair
    Log!(exchange.GetTicker(None));
    // Switch the trading pair to LTC_BTC
    let _ = exchange.IO(("currency", "LTC_BTC"));
    Log!(exchange.GetTicker(None));
}
```

**Switching Trading Pairs at Runtime (```"currency"``` mode)**

```javascript

exchange.IO("currency", "ETH_USDT")

```

Used to dynamically switch trading pairs at runtime. The trading pair format is uppercase letters separated by an underscore. This instruction is equivalent to `exchange.SetCurrency`.

> In backtesting mode, only spot is supported, and you can only switch to a trading pair with the same quote currency. After switching trading pairs for futures, you need to call ```exchange.SetContractType()``` again.

See also: `exchange.IO`

#### exchange.IO("base", ...)

```
exchange.IO(k, address)
```

Forms:

- `exchange.IO("base", ...)`

```exchange.IO("base", ...)``` switches the base address of the trading API, and ```exchange.IO("mbase", ...)``` that of the market data API.

Parameters:

- `k` (string, required): The ```k``` parameter selects the ```exchange.IO()``` feature; ```"base"``` switches the trading API base address (```"mbase"``` switches the market data API base address).
- `address` (string, required): The ```address``` parameter is the new base address, e.g. ```https://api.example.com```.

Returns (string / number / bool / object / array / any): Returns the result of the command on success, or a null value on failure.

Switch the exchange API base address:

```javascript
function main () {
    // exchanges[0] is the first exchange object added when the live bot was created
    exchanges[0].IO("base", "https://api.huobi.pro")
}
```

```python
def main():
    exchanges[0].IO("base", "https://api.huobi.pro")
```

```rust
fn main() {
    // exchanges[0] is the first exchange object added when the live bot was created
    let _ = exchanges[0].IO(("base", "https://api.huobi.pro"));
}
```

Switch the market data API base address via ```"mbase"``` (using Bitfinex as an example):

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

**Switching the Base Address (```"base"``` / ```"mbase"``` mode)**

- ```"base"```: Switches the base address of the trading interface, equivalent to ```exchange.SetBase()```.

- ```"mbase"```: Switches the base address of the market data interface, suitable for exchanges that use different domain names for market data and trading.

See also: `exchange.IO`

#### exchange.IO(mode, value)

```
exchange.IO(mode)
exchange.IO(mode, value)
```

Forms:

- `exchange.IO(mode, value)`

```exchange.IO(mode, value)``` switches trading modes of the exchange: simulated or live, cross or isolated margin, hedge or one-way positions, unified account, margin trading mode, self-trade prevention and so on.

Parameters:

- `mode` (string, required): The ```mode``` parameter is the mode command, e.g. ```"simulate"```, ```"cross"```, ```"dual"```; see the table below for all commands.
- `value` (bool / string, optional): The ```value``` parameter is the value of the mode; see the table below for its type and meaning. Some commands take none.

Returns (string / number / bool / object / array / any): Returns the result of the command on success, or a null value on failure.

Switch between the demo/live trading environment (using OKX Futures as an example):

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

Switch contract margin mode and position mode (using Binance Futures as an example):

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

Switch to unified account mode (using Binance Futures as an example):

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

Set self-trade prevention mode (using Binance as an example):

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

**Common Trading Mode Instructions**

The following instructions are common across multiple exchanges. For the specific support of each exchange, please refer to `exchange.IO`.

| Instruction | Parameter | Function |
| - | - | - |
| ```simulate``` | bool | Simulated trading (true) / Live trading (false) |
| ```cross``` | bool | Cross margin (true) / Isolated margin (false) |
| ```dual``` | bool | Hedge mode (true) / One-way mode (false) |
| ```unified``` | bool | Unified account (true) / Standard account (false) |
| ```trade_margin``` | none | Switch to isolated margin mode |
| ```trade_super_margin``` | none | Switch to cross margin mode |
| ```trade_normal``` | none | Switch back to normal spot mode |
| ```selfTradePreventionMode``` | string | Self-Trade Prevention (STP) mode |

See also: `exchange.IO`

#### exchange.IO("rate", ...)

```
exchange.IO(k, functionNames, maxCalls, period)
exchange.IO(k, functionNames, maxCalls, period, behavior)
```

Forms:

- `exchange.IO("rate", ...)`

```exchange.IO("rate", ...)``` and ```exchange.IO("quota", ...)``` limit how often API functions are called.

Parameters:

- `k` (string, required): The ```k``` parameter selects the function of ```exchange.IO()```: ```"rate"``` is smooth rate limiting (a token bucket that allows short bursts), ```"quota"``` is quota limiting (calls counted per time window, windows aligned to the clock).
- `functionNames` (string, required): The ```functionNames``` parameter is an API function name (such as ```GetTicker```, ```CreateOrder```, ```GetAccount```); several names separated by commas share one rule. ```*``` is the fallback rule and applies only to functions without a rule of their own; ```IO/api``` stands for ```exchange.IO("api", ...)```. An empty string clears all rules.
- `maxCalls` (number, required): The ```maxCalls``` parameter is the maximum number of calls per period; a value of 0 or less deletes the rule for ```functionNames```. In ```"rate"``` mode it can be the string ```"count/burst"```, for example ```"10/5"```: 10 calls per period with bursts of at most 5; without a burst the burst equals the count.
- `period` (string, required): The ```period``` parameter is the period, written like a Go duration: ```"500ms"```, ```"1s"```, ```"1m"```, ```"1h30m"``` (units ns, us, ms, s, m, h), or ```"1d"```; or a daily reset time ```"@HHMM"``` / ```"@HHMMSS"``` (Beijing time), for example ```"@0815"```.
- `behavior` (string, optional): The ```behavior``` parameter decides what happens over the limit: ```"delay"``` waits and then runs; by default the call returns a null value.

Returns (string / number / bool / object / array / any): Returns the result of the command on success, or a null value on failure.

rate mode rate limiting - Limit GetTicker to a maximum of 10 calls per second; returns null when the limit is exceeded:

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
        // GetTicker returns Err when the limit is exceeded
        match exchange.GetTicker("BTC_USDT") {
            Ok(ticker) => Log!("Ticker:", ticker.Last),
            Err(_) => Log!("Rate limit exceeded"),
        }
    }
}
```

rate mode rate limiting - Use the ```"delay"``` parameter to automatically wait instead of returning null when the limit is exceeded:

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

Multiple functions sharing a rate limit quota:

```javascript
function main() {
    // GetTicker and GetDepth share the rate limit quota, with a combined maximum of 10 calls per second
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
    // GetTicker and GetDepth share the rate limit quota, with a combined maximum of 10 calls per second
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

Use a wildcard to uniformly limit the call frequency of all APIs:

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

quota mode - strict rate limiting aligned to time windows:

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

quota mode - intraday quota, resets daily at the specified time:

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

Combining multiple rate-limiting rules:

```javascript
function main() {
    exchange.IO("rate", "GetTicker", 10, "1s")      // GetTicker 10 times per second
    exchange.IO("rate", "GetDepth", 5, "1s")        // GetDepth 5 times per second
    exchange.IO("rate", "CreateOrder", 2, "1s")     // CreateOrder 2 times per second
    exchange.IO("quota", "*", 1000, "@0000")        // All APIs reset daily at 00:00, cap of 1000 calls

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
    exchange.IO("rate", "GetTicker", 10, "1s")      # GetTicker 10 times per second
    exchange.IO("rate", "GetDepth", 5, "1s")        # GetDepth 5 times per second
    exchange.IO("rate", "CreateOrder", 2, "1s")     # CreateOrder 2 times per second
    exchange.IO("quota", "*", 1000, "@0000")        # All APIs reset daily at 00:00, cap of 1000 calls

    Log("Rate limits configured successfully")

    for i in range(5):
        exchange.GetTicker("BTC_USDT")
        exchange.GetDepth("BTC_USDT")
        Sleep(200)
```

```rust
fn main() {
    let _ = exchange.IO(("rate", "GetTicker", 10, "1s"));      // GetTicker 10 times per second
    let _ = exchange.IO(("rate", "GetDepth", 5, "1s"));        // GetDepth 5 times per second
    let _ = exchange.IO(("rate", "CreateOrder", 2, "1s"));     // CreateOrder 2 times per second
    let _ = exchange.IO(("quota", "*", 1000, "@0000"));        // All APIs reset daily at 00:00, cap of 1000 calls

    Log!("Rate limits configured successfully");

    for _i in 0..5 {
        let _ = exchange.GetTicker("BTC_USDT");
        let _ = exchange.GetDepth("BTC_USDT");
        Sleep(200);
    }
}
```

**API Rate Limiting Control (```"rate"``` / ```"quota"``` modes)**

```javascript
exchange.IO("rate", functionNames, maxCalls, period, [behavior])
exchange.IO("quota", functionNames, maxCalls, period, [behavior])
```

- **rate**: smooth rate limiting (token bucket). The bucket holds the burst size, refills at count/period and starts full.
- **quota**: quota limiting. At most the given number of calls per period; periods are aligned to the clock (```"1m"``` resets at second 0 of every minute, ```"1d"``` at 00:00 UTC, i.e. 08:00 Beijing time).

| Parameter | Type | Description |
| - | - | - |
| functionNames | string | Function names, comma-separated; ```*``` is the fallback rule for functions without a rule of their own |
| maxCalls | number / string | Maximum calls per period; ```"rate"``` accepts ```"count/burst"```; 0 or less deletes the rule |
| period | string | Time period (```"500ms"```/```"1s"```/```"1h30m"```/```"1d"```) or daily reset time (```"@0815"```, Beijing time) |
| behavior | string | Optional; ```"delay"``` means wait when the limit is exceeded, defaults to returning null |

> The rate limiting of ```Buy```/```Sell``` follows the settings of ```CreateOrder```; ```Go``` follows the settings of the actual concurrent function; ```IO/api``` only takes effect for ```exchange.IO("api", ...)```.

Rules are set per exchange object and last for the current run only. By default an exceeded limit raises an error and the call returns null, with a message such as ```rate limit exceeded: GetTicker 10/1s```; with ```"delay"``` the call waits until it is allowed, and the wait is interrupted when the live trading stops. ```GetAccount``` and ```GetAssets``` are the same request, so a rule set for either name applies to both.

See also: `exchange.IO`

### Network

Network requests and services: HTTP requests, long-lived WebSocket/TCP connections, serving HTTP/TCP from a strategy (`threading.Serve`), and sending mail. Functions with the ```_Go``` suffix are the concurrent versions; wait for their results with `EventLoop`.

#### HttpQuery

```
HttpQuery(url)
HttpQuery(url, options)
```

Sends an HTTP request.

Parameters:

- `url` (string, required): The URL of the HTTP request.
- `options` (object, optional): Settings related to the HTTP request. For example, the following structure can be used:
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

- method: Used to set the request method.
- body: Used to set the request body content, typically for POST, PUT and similar requests.
- cookie: Used to set the Cookie in the request, generally for carrying authentication information or session identifiers.
- headers: Used to set the request header information, which can specify the content type, authentication information, etc.
- debug: When set to ```true```, this ```HttpQuery``` function call returns the complete response message; when set to ```false```, only the data in the ```Body``` of the response message is returned.
- timeout: Used to set the timeout in milliseconds. For example, setting it to 1000 means a timeout of 1 second.
- charset: Used to transcode the response data of the request, for example: GB18030. Commonly used encodings are supported.

All fields in this structure are optional. For example, the ```headers``` field can be omitted.

Returns (string / object): Returns the response data of the request. If the return value is a ```JSON``` string, it can be parsed with the ```JSON.parse()``` function in ```JavaScript``` strategies and with the ```JSONParse()``` function in ```Rust``` strategies. When ```debug``` in the ```options``` parameter structure is set to true, the return value is an object (JSON); when ```debug``` is set to false, the return value is a string.

When a request fails (no response is received, e.g. connection refused, DNS resolution failure, timeout, proxy failure), ```null``` is not returned, and an error message containing the request method and URL is recorded in the log: when ```debug``` is set to false, an empty string is returned; when ```debug``` is set to true, a structure with a ```StatusCode``` of 0 and an ```Error``` field (the failure reason) is returned. For a description of the structure, see ```HttpQuery-return```. Responses with HTTP status codes 4xx and 5xx are not considered request failures.

Example of accessing the OKX public market data API.

```javascript
function main(){
    // Example of a GET request without parameters
    var info = JSON.parse(HttpQuery("https://www.okx.com/api/v5/public/time"))
    Log(info)
    // Example of a GET request with parameters
    var ticker = JSON.parse(HttpQuery("https://www.okx.com/api/v5/market/books?instId=BTC-USDT"))
    Log(ticker)
}
```

```python
import json
import urllib.request
def main():
    # HttpQuery does not support Python; the urllib/urllib2 library can be used instead
    info = json.loads(urllib.request.urlopen("https://www.okx.com/api/v5/public/time").read().decode('utf-8'))
    Log(info)
    ticker = json.loads(urllib.request.urlopen("https://www.okx.com/api/v5/market/books?instId=BTC-USDT").read().decode('utf-8'))
    Log(ticker)
```

```rust
fn main() {
    // Example of a GET request without parameters. In Rust, the type annotation of the return value determines whether the Body string (String) or the complete response (HttpRet) is returned
    let body: String = HttpQuery("https://www.okx.com/api/v5/public/time", None);
    let info = JSONParse(&body).unwrap();
    Log!(info);
    // Example of a GET request with parameters
    let body2: String = HttpQuery("https://www.okx.com/api/v5/market/books?instId=BTC-USDT", None);
    let ticker = JSONParse(&body2).unwrap();
    Log!(ticker);
}
```

Example of using proxy settings with the HttpQuery function.

```javascript
function main() {
    // Set a proxy for this call and send the HTTP request without a username and password; this HTTP request will be sent through the proxy
    HttpQuery("socks5://127.0.0.1:8889/http://www.baidu.com/")

    // Set a proxy for this call and send the HTTP request with a username and password; the proxy setting only takes effect for the current HttpQuery call, and the proxy will not be used when HttpQuery("http://www.baidu.com") is called again afterwards
    HttpQuery("socks5://username:password@127.0.0.1:8889/http://www.baidu.com/")
}
```

```python
# HttpQuery does not support Python; Python's urllib2 library can be used
```

```rust
fn main() {
    // Set a proxy for this call and send the HTTP request without a username and password; this HTTP request will be sent through the proxy
    let ret1: String = HttpQuery("socks5://127.0.0.1:8889/http://www.baidu.com/", None);

    // Set a proxy for this call and send the HTTP request with a username and password; the proxy setting only takes effect for the current HttpQuery call, and the proxy will not be used when HttpQuery("http://www.baidu.com") is called again afterwards
    let ret2: String = HttpQuery("socks5://username:password@127.0.0.1:8889/http://www.baidu.com/", None);
}
```

The ```HttpQuery()``` function supports the ```JavaScript``` and ```Rust``` languages. In the ```Python``` language, the ```urllib``` library can be used to send HTTP requests directly. ```HttpQuery()``` is mainly used to access exchange interfaces that do not require a signature, such as public interfaces for market data.

In the backtesting system, ```HttpQuery()``` can be used to send requests (only ```GET``` requests are supported) to obtain data. During backtesting, access to at most 20 different ```URL```s is allowed, and ```HttpQuery()``` caches the accessed data: when the same ```URL``` is accessed again, the ```HttpQuery()``` function returns the cached data directly without initiating an actual network request.

See also: `HttpQuery_Go`

#### HttpQuery_Go

```
HttpQuery_Go(url)
HttpQuery_Go(url, options)
```

Sends an Http request. It is the asynchronous version of the ```HttpQuery``` function.

Parameters:

- `url` (string, required): The URL of the Http request.
- `options` (object, optional): Settings related to the Http request. For example, the following structure can be used:
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

- debug: When set to ```true```, this ```HttpQuery_Go``` function call returns the complete response message; when set to ```false```, only the data in the ```Body``` of the response message is returned.
- timeout: Timeout setting, in milliseconds. For example, setting it to 1000 means a timeout of 1 second.

All fields in this structure are optional. For example, the ```headers``` field can be omitted.
The ```options``` parameter of the ```HttpQuery_Go``` function is the same as the ```options``` parameter of the ```HttpQuery``` function and is not described again here.

Returns (object): The ```HttpQuery_Go()``` function immediately returns a concurrent object. The ```wait``` method of this concurrent object can be called to obtain the result of the Http request, and in strategies written in the ```JavaScript``` language the ```JSON.parse()``` function can be used to parse this result. The result obtained by the ```wait``` method is the same as the return value of the ```HttpQuery``` function, and the return value when the request fails is also the same (an empty string is returned when ```debug``` is false; when it is true, a structure with ```StatusCode``` of 0 and containing an ```Error``` field is returned).

Asynchronously access the public interfaces of exchanges to obtain aggregated market data.

```javascript
function main() {
    // Create the first asynchronous thread
    var r1 = HttpQuery_Go("https://www.okx.com/api/v5/market/tickers?instType=SPOT")
    // Create the second asynchronous thread
    var r2 = HttpQuery_Go("https://api.huobi.pro/market/tickers")

    // Get the return value of the first asynchronous thread call
    var tickers1 = r1.wait()
    // Get the return value of the second asynchronous thread call
    var tickers2 = r2.wait()

    // Print the results
    Log("tickers1:", tickers1)
    Log("tickers2:", tickers2)
}
```

```python
# Not supported
```

The ```HttpQuery_Go()``` function only supports the ```JavaScript``` language. In the ```Python``` language, the ```urllib``` library can be used to send Http requests directly. The ```HttpQuery_Go()``` function is mainly used to access exchange interfaces that do not require a signature, such as public interfaces for market data. The backtesting system does not support the ```HttpQuery_Go``` function.

See also: `HttpQuery`

#### Dial

```
Dial(address)
Dial(address, timeout)
Dial(address, options)
```

Used for raw ```Socket``` access, supporting the ```tcp```, ```udp```, ```tls```, and ```unix``` protocols. Supports 4 mainstream messaging protocols: ```mqtt```, ```nats```, ```amqp```, and ```kafka```. Also supports connecting to databases, with available databases including: ```sqlite3```, ```mysql```, ```postgres```, and ```clickhouse```.

Parameters:

- `address` (string, required): The request address.
- `timeout` (number, optional): The timeout period (unit: seconds).
- `options` (object, optional): Configuration options.

Returns (object): 

Dial function call example:

```javascript
function main(){
    // Dial supports the tcp://, udp://, tls://, and unix:// protocols, and accepts a parameter specifying the timeout in seconds
    var client = Dial("tls://www.baidu.com:443")
    if (client) {
        // write can take an additional numeric parameter to specify a timeout, and returns the number of bytes successfully sent
        client.write("GET / HTTP/1.1\nConnection: Closed\n\n")
        while (true) {
            // read can take an additional numeric parameter to specify a timeout, in milliseconds; returning null indicates an error, timeout, or that the socket has been closed
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
    // Dial supports the tcp://, udp://, tls://, and unix:// protocols, and you can use Dial::new(addr, timeout) to specify the timeout in seconds
    let mut client = Dial("tls://www.baidu.com:443");
    if client.Valid() {
        // The second numeric parameter of write is used to specify a timeout, and it returns the number of bytes successfully sent
        client.write("GET / HTTP/1.1\nConnection: Closed\n\n", 0);
        loop {
            // The numeric parameter of read is used to specify a timeout, in milliseconds; returning an empty string indicates an error, timeout, or that the socket has been closed
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

Access Binance's WebSocket market data interface:

```javascript
function main() {
    LogStatus("Connecting...")
    // Access Binance's WebSocket interface
    var client = Dial("wss://stream.binance.com:9443/ws/!ticker@arr")
    if (!client) {
        Log("Connection failed, exiting")
        return
    }

    while (true) {
        // read only returns data received after read is called
        var buf = client.read()
        if (!buf) {
            break
        }
        var table = {
            type: 'table',
            title: 'Market Chart',
            cols: ['Symbol', 'High', 'Low', 'Bid', 'Ask', 'Last Price', 'Volume', 'Update Time'],
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
            "title" : "Market Chart",
            "cols" : ["Symbol", "High", "Low", "Bid", "Ask", "Last Price", "Volume", "Update Time"],
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
    // Access Binance's WebSocket interface
    let mut client = Dial("wss://stream.binance.com:9443/ws/!ticker@arr");
    if !client.Valid() {
        Log!("Connection failed, exiting");
        return;
    }

    loop {
        // read only returns data received after read is called
        let buf = client.read(0);
        if buf == "" {
            break;
        }
        let obj = JSONParse(&buf).unwrap();
        // The Rust SDK has no JSON serialization; here we use string concatenation to build the JSON text for the status bar table
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
        let table = format!(r#"{{"type":"table","title":"Market Chart","cols":["Symbol","High","Low","Bid","Ask","Last Price","Volume","Update Time"],"rows":[{}]}}"#, rows);
        LogStatus!(format!("`{}`", table));
    }
    client.close();
}
```

Access Binance's WebSocket interface and set the wss request headers.

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
    // In Rust, use Dial::with_options() and pass options as a JSON string to set the request headers
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

Access OKX's WebSocket market data interface:

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
    // When calling the Dial function, specify reconnect=true to enable reconnection mode, and specify payload as the message to be sent upon reconnection. When the WebSocket connection is disconnected, it will automatically reconnect and automatically send this message
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
    // When calling the Dial function, specify reconnect=true to enable reconnection mode, and specify payload as the message to be sent upon reconnection. When the WebSocket connection is disconnected, it will automatically reconnect and automatically send this message
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
    // In Rust, the connection object is automatically closed when it goes out of scope; you can also explicitly call ws.close()
}
```

Access the Huobi exchange's WebSocket market data interface:

```javascript
var ws = null

function main(){
    var param = {"sub": "market.btcusdt.detail", "id": "id1"}
    ws = Dial("wss://api.huobi.pro/ws|compress=gzip&mode=recv&reconnect=true&payload="+ JSON.stringify(param))
    if(ws){
        while(1){
            var ret = ws.read()
            Log("ret:", ret)
            // Respond to the heartbeat packet
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
            # Respond to the heartbeat packet
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
            // Respond to the heartbeat packet; in Rust use JSONParse() to parse, which returns None on parse failure
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
    // In Rust the connection object is automatically closed when it leaves scope; you can also explicitly call ws.close()
}
```

Access OKX's WebSocket authentication interface:

```javascript
function getLogin(pAccessKey, pSecretKey, pPassphrase) {
    // Signature function, used to generate the login request
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
    // Since the read function has a timeout set, timeout errors need to be filtered, otherwise redundant error output will be produced
    SetErrorFilter("timeout")

    // Subscription information for the positions channel
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
    Sleep(3000)  // You cannot subscribe to private channels immediately after login; you need to wait for the server response
    client_private.write(JSON.stringify(posSubscribe))
    if (client_private) {
        var lastPingTS = new Date().getTime()
        while (true) {
            var buf = client_private.read(-1)
            if (buf) {
                Log(buf)
            }

            // Reconnect after detecting a disconnection
            if (buf == "" && client_private.write(JSON.stringify(posSubscribe)) == 0) {
                Log("Detected disconnection, closing connection, reconnecting")
                client_private.close()
                client_private = Dial("wss://ws.okx.com:8443/ws/v5/private")
                client_private.write(JSON.stringify(getLogin(accessKey, secretKey, passphrase)))
                Sleep(3000)
                client_private.write(JSON.stringify(posSubscribe))
            }

            // Send heartbeat packet
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
    // Signature function, used to generate the login request. There is no exchange.Encode member function in Rust, so the global Encode function is used to compute the signature
    let ts = format!("{}", Unix());
    let sign = Encode("sha256", "string", "base64", &format!("{}GET/users/self/verify", ts), "string", pSecretKey);
    format!(r#"{{"op":"login","args":[{{"apiKey":"{}","passphrase":"{}","timestamp":"{}","sign":"{}"}}]}}"#, pAccessKey, pPassphrase, ts, sign)
}

fn main() {
    // Since the read function has a timeout set, timeout errors need to be filtered, otherwise redundant error output will be produced
    SetErrorFilter("timeout");

    // Subscription information for the positions channel
    let posSubscribe = r#"{"op":"subscribe","args":[{"channel":"positions","instType":"ANY"}]}"#;

    let accessKey = "xxx";
    let secretKey = "xxx";
    let passphrase = "xxx";

    let mut client_private = Dial("wss://ws.okx.com:8443/ws/v5/private");
    client_private.write(&getLogin(accessKey, secretKey, passphrase), 0);
    Sleep(3000);  // You cannot subscribe to private channels immediately after login; you need to wait for the server response
    client_private.write(posSubscribe, 0);
    if client_private.Valid() {
        let mut lastPingTS = Unix() * 1000;
        loop {
            let buf = client_private.read(-1);
            if buf != "" {
                Log!(buf);
            }

            // Reconnect after detecting a disconnection
            if buf == "" && client_private.write(posSubscribe, 0) == 0 {
                Log!("Detected disconnection, closing connection, reconnecting");
                client_private.close();
                client_private = Dial("wss://ws.okx.com:8443/ws/v5/private");
                client_private.write(&getLogin(accessKey, secretKey, passphrase), 0);
                Sleep(3000);
                client_private.write(posSubscribe, 0);
            }

            // Send heartbeat packet
            let nowPingTS = Unix() * 1000;
            if nowPingTS - lastPingTS > 10 * 1000 {
                client_private.write("ping", 0);
                lastPingTS = nowPingTS;
            }
        }
    }
}
```

Access CoinEx's WebSocket authentication interface:

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

    // Subscribe to position push
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
// Omitted
```

```rust
fn main() {
    let accessKey = "your accessKey";

    let ts = Unix() * 1000;
    // Rust does not have the exchange.Encode member function and cannot use the {{secretkey}} template substitution, so use the global Encode function to pass the secret key directly to compute the signature
    let signature = Encode("sha256", "string", "hex", &format!("{}", ts), "string", "your secretKey");
    Log!("signature:", signature);

    // The Rust SDK does not have JSON serialization, so use string concatenation to construct the payload's JSON text
    let payload = format!(r#"{{"id":1,"method":"server.sign","params":{{"access_id":"{}","signed_str":"{}","timestamp":{}}}}}"#, accessKey, signature, ts);
    Log!("payload:", payload);

    let mut conn = Dial(&format!("wss://socket.coinex.com/v2/futures|compress=gzip&mode=recv&payload={}", payload));
    if !conn.Valid() {
        Panic!("stop");
    }
    Log!("Dial ... ", conn.read(0));

    // Subscribe to position push
    conn.write(r#"{"method":"position.subscribe","params":{"market_list":["BTCUSDT"]},"id":1}"#, 0);

    loop {
        let msg = conn.read(0);
        if msg != "" {
            Log!("msg:", msg);
        }
    }
}
```

The following example demonstrates how to access the ```Websocket``` interface of the MEXC exchange, subscribe to the ```public.aggre.deals.v3.api.pb``` channel, and use ```protobuf.js``` to decode the binary data:

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
# You can use the corresponding libraries in Python to implement encoding and decoding.
```

The connection object returned when the Dial function connects to a database has 2 unique methods:

    - ```exec(sqlString)```: Used to execute SQL statements, with usage similar to the ```DBExec()``` function.

    - ```fd()```: This function returns a handle (for example, a handle variable named handle), used for reconnecting in other threads. Even if the connection object created by Dial has already been closed via the ```close()``` function, you can still pass this handle into the ```Dial()``` function (for example, ```Dial(handle)```) to reuse the connection.

    The following is an example of using the Dial function to connect to a ```sqlite3``` database.

```javascript
var client = null
function main() {
    // client = Dial("sqlite3://:memory:")   // Use an in-memory database
    client = Dial("sqlite3://test1.db")      // Open/connect to the database file in the docker's directory

    // Record the handle
    var sqlite3Handle = client.fd()
    Log("sqlite3Handle:", sqlite3Handle)

    // Query the tables in the database
    var ret = client.exec("SELECT name FROM sqlite_master WHERE type='table'")
    Log(ret)
}

function onexit() {
    Log("Executing client.close()")
    client.close()
}
```

```python
// Not supported
```

```rust
fn main() {
    // let mut client = Dial("sqlite3://:memory:");   // Use an in-memory database
    let mut client = Dial("sqlite3://test1.db");      // Open/connect to the database file in the docker's directory

    // Rust's connection object does not support the fd() method

    // Query the tables in the database
    let ret = client.exec("SELECT name FROM sqlite_master WHERE type='table'");
    Log!(format!("{:?}", ret));

    Log!("Executing client.close()");
    client.close();
}
```

```address``` parameter details: after the standard address ```wss://ws.okx.com:8443/ws/v5/public```, use the ```|``` symbol as a separator. If the parameter string contains the ```|``` character, use ```||``` as the separator instead. The portion after the separator specifies the functional parameter settings, with individual parameters joined by the ```&``` character.

For example, to set both an ```ss5``` proxy and compression parameters at the same time, you can write:

```Dial("wss://ws.okx.com:8443/ws/v5/public|proxy=socks5://xxx:9999&compress=gzip_raw&mode=recv")```

| Features supported by the address parameter of the Dial function | Parameter description |
| - | - |
| Parameters related to WebSocket protocol data compression: compress=value | compress specifies the compression method. Available values include gzip_raw, gzip, etc. If the gzip used is not standard gzip, you can use the extended form: gzip_raw |
| Parameters related to WebSocket protocol data compression: mode=value | mode specifies the compression mode, with three options: dual, send, and recv. dual indicates bidirectional compression, i.e., sending and receiving compressed data simultaneously; send indicates only sending compressed data; recv indicates only receiving compressed data and decompressing it locally. |
| Enable the WebSocket protocol compression setting: enableCompression=true | Use enableCompression=false to disable this setting. It is disabled by default. |
| Parameters for configuring underlying auto-reconnection of the WebSocket protocol: reconnect=value | reconnect sets whether to auto-reconnect. reconnect=true enables reconnection. If this parameter is not set, reconnection is disabled by default. |
| Parameters for configuring underlying auto-reconnection of the WebSocket protocol: interval=value | interval is the retry interval, in milliseconds. For example, interval=10000 means a retry interval of 10 seconds; when not set, it defaults to 1 second, i.e., interval=1000. |
| Parameters for configuring underlying auto-reconnection of the WebSocket protocol: payload=value | payload is the subscription message to be sent when the WebSocket reconnects, for example: payload=okok. |
| Parameters related to the socks5 proxy: proxy=value | proxy configures the ss5 proxy. The value format is: socks5://name:pwd@192.168.0.1:1080. Here name is the username of the ss5 server, pwd is the login password of the ss5 server, and 1080 is the port of the ss5 service. |
| WebSocket receive buffer limit: qsize=value | qsize is the maximum number of messages kept in the receive buffer. Defaults to 4096 when not set. |
| WebSocket receive buffer limit: qbytes=value | qbytes is the maximum number of bytes kept in the receive buffer. Defaults to 16777216 (16 MB) when not set. |

The ```Dial()``` function is only supported in live trading.

When using the Dial function to connect to a database, you can refer to the Go language driver project corresponding to each database for how to write the connection string.

| Supported databases | Driver project | Connection String | Notes |
| - | - | - | - |
| sqlite3 | github.com/mattn/go-sqlite3 | sqlite3://file:test.db?cache=shared&mode=memory | The ```sqlite3://``` prefix indicates that the sqlite3 database is used. Example call: ```Dial("sqlite3://test1.db")``` |
| mysql | github.com/go-sql-driver/mysql | mysql://username:yourpassword@tcp(localhost:3306)/yourdatabase?charset=utf8mb4 | -- |
| postgres | github.com/lib/pq | postgres://user=postgres dbname=yourdatabase sslmode=disable password=yourpassword host=localhost port=5432 | -- |
| clickhouse | github.com/ClickHouse/clickhouse-go | clickhouse://tcp://host:9000?username=username&password=yourpassword&database=youdatabase | -- |

Note that when the ```payload``` content set in the ```address``` parameter contains the character ```=``` or other special characters, it may affect how the ```Dial``` function parses the ```address``` parameter. See the example below.

Example of calling the backPack exchange websocket private interface:
```js
var client = null

function main() {
    // The base64-encoded public key of the key pair, i.e., the access key configured on FMZ
    var base64ApiKey = "xxx"

    var ts = String(new Date().getTime())
    var data = "instruction=subscribe&timestamp=" + ts + "&window=5000"

    // Since signEd25519 ultimately returns a base64 encoding, it may contain the character "="
    var signature = signEd25519(data)

    // After being JSON-encoded, payload may contain the character "="
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

Using the following calling approach in the code works properly:
```js
client = Dial("wss://ws.backpack.exchange")
client.write(JSON.stringify(payload))
```

If it is written directly into the ```payload``` (in the address), it will not work properly, for example:
```js
client = Dial("wss://ws.backpack.exchange|payload=" +
JSON.stringify(payload))
```

Currently, only the JavaScript language supports using the ```mqtt```, ```nats```, ```amqp```, and ```kafka``` communication protocols in the Dial function. The following uses JavaScript strategy code as an example to demonstrate how to use the four protocols ```mqtt```, ```nats```, ```amqp```, and ```kafka```:

```js
// You need to first configure and deploy the proxy servers for each protocol
// For ease of demonstration, both subscribing to (read operation) and publishing to (write operation) the topic test_topic are performed within this current strategy

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

            // Write data
            conn.write(name + ", time: " + _D() + ", test msg.")

            // Read data
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

For a detailed introduction, please refer to the documentation: [Exploring FMZ: Practices of Communication Protocols Between Live Trading Strategies](https://www.fmz.com/bbs-topic/10479)

#### Mail

```
Mail(smtpServer, smtpUsername, smtpPassword, mailTo, title, body)
```

Send an email.

Parameters:

- `smtpServer` (string, required): Used to specify the ```SMTP``` server address of the email sender.
- `smtpUsername` (string, required): Used to specify the email address of the email sender.
- `smtpPassword` (string, required): Used to specify the ```SMTP``` service password of the email sender's mailbox.
- `mailTo` (string, required): Used to specify the email address of the email recipient.
- `title` (string, required): The email subject.
- `body` (string, required): The email body.

Returns (bool): Returns a truthy value, such as ```true```, when the email is sent successfully; returns a falsy value, such as ```false```, when sending fails.

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

The ```smtpPassword``` parameter sets the password for the ```SMTP``` service, not the mailbox login password.

When setting the ```smtpServer``` parameter, if you need to change the port, you can append the port number directly in the ```smtpServer``` parameter. For example: the ```smtp.qq.com:587``` port of QQ Mail has been tested and works.

If the error ```unencryped connection``` occurs, you need to modify the ```smtpServer``` parameter of the ```Mail``` function to the format ```ssl://xxx.com:xxx```. For example, the ```ssl``` method for QQ Mail ```SMTP``` is ```ssl://smtp.qq.com:465```, or use ```smtp://xxx.com:xxx```.

This function does not work in the backtesting system.

See also: `Mail_Go`

#### Mail_Go

```
Mail_Go(smtpServer, smtpUsername, smtpPassword, mailTo, title, body)
```

Asynchronous version of the ```Mail``` function.

Parameters:

- `smtpServer` (string, required): Used to specify the ```SMTP``` server address of the email sender.
- `smtpUsername` (string, required): Used to specify the email address of the email sender.
- `smtpPassword` (string, required): The ```SMTP``` authorization password for the sender's email account.
- `mailTo` (string, required): Used to specify the email address of the email recipient.
- `title` (string, required): Email subject.
- `body` (string, required): Email body content.

Returns (object): The ```Mail_Go``` function immediately returns a concurrent object. You can use the ```wait``` method of this concurrent object to get the email sending result. Returns a truthy value (e.g., ```true```) if the email is sent successfully, and returns a falsy value (e.g., ```false```) if sending fails.

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
# Not supported
```

Does not work in the backtesting system.

See also: `Mail`

### Storage

Persistence and communication between live robots: the `_G` key-value store, the built-in database `DBExec`, and broadcasting data between robots with `SetChannelData` and `GetChannelData`.

#### _G

```
_G()
_G(k)
_G(k, v)
```

Persistently store data. This function implements a persistently stored global dictionary, saving data as key-value (KV) pairs permanently in the local database file of the hosting device (docker).

Parameters:

- `k` (string / null, optional): The parameter ```k``` is the key name in the key-value pair to be stored; it is case-insensitive.
- `v` (string / number / bool / object / array / null, optional): The parameter ```v``` is the value in the key-value pair to be stored; it can be any data that can be ```JSON``` serialized.

Returns (string / number / bool / object / array / null): The value data in the persistently stored ```k-v``` key-value pair.

```javascript
function main(){
    // Set a global variable num with a value of 1
    _G("num", 1)
    // Change the global variable num to the string value ok
    _G("num", "ok")
    // Delete the global variable num
    _G("num", null)
    // Return the value of the global variable num
    Log(_G("num"))
    // Delete all global variables
    _G(null)
    // Return the live trading bot ID
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
    // Set a global variable num with a value of 1
    _G!("num", 1);
    // Change the global variable num to the string value ok
    _G!("num", "ok");
    // Delete the global variable num
    _G!("num", null);
    // Return the value of the global variable num
    Log!(_G!("num"));
    // Rust does not support the _G!(null) form for deleting all global variables
    // Return the live trading bot ID
    let robotId = _G!();
}
```

Each live trading bot corresponds to a separate database. After the strategy restarts or the hosting device (docker) stops running, the data saved by the ```_G()``` function will still persist. However, after a backtest ends, the data saved by the ```_G()``` function in the backtesting system will be cleared. When using the ```_G()``` function to persistently store data, use it reasonably according to the memory and disk space of the hardware device, and never abuse it.

In live trading, when the ```_G()``` function is called without passing any parameters, the ```_G()``` function returns the ```Id``` of the current live trading bot.

When calling the ```_G()``` function, passing a null value for the parameter ```v``` indicates deleting the corresponding ```k-v``` key-value pair.

When calling the ```_G()``` function, if only the parameter ```k``` is passed as a string, then the ```_G()``` function returns the stored value corresponding to the parameter ```k```.

When calling the ```_G()``` function, if only the parameter ```k``` is passed as a null value, it indicates deleting all recorded ```k-v``` key-value pairs.

After a ```k-v``` key-value pair has been persistently stored, calling the ```_G()``` function again and passing the persistently stored key name as the parameter ```k``` and a new value as the parameter ```v``` will update that ```k-v``` key-value pair.

Taking a live trading bot with Id ```123456``` as an example, the K-V key-value data persistently stored using the ```_G()``` function is stored in the ```/logs/storage/123456/123456.db3``` database file located in the directory of the hosting device (docker) to which the live trading bot (i.e., the strategy instance program) belongs, and the data is recorded in the ```kvdb``` table.

See also: `DBExec`

#### DBExec

```
DBExec(sql)
```

Database interface function.

Parameters:

- `sql` (string, required): The **sql** statement string.

Returns (object): An object containing the execution result of the **sql** statement, for example:

    ```json

    {"columns":["TS","HIGH","OPEN","LOW","CLOSE","VOLUME"],"values":[[1518970320000,100,99.1,90,100,12345.6]]}

    ```

Supports in-memory databases. For the parameter of the ```DBExec``` function, if the **sql** statement begins with ```:```, the operation is executed in the in-memory database; since there is no need to write to a file, it is faster. This approach is suitable for database operations that do not require persistent storage, for example:

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

    // Add a record
    Log(DBExec(":INSERT INTO TEST_TABLE (TS, HIGH, OPEN, LOW, CLOSE, VOLUME) VALUES (1518970320000, 100, 99.1, 90, 100, 12345.6);"))

    // Query data
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

    # Add a record
    Log(DBExec(":INSERT INTO TEST_TABLE (TS, HIGH, OPEN, LOW, CLOSE, VOLUME) VALUES (1518970320000, 100, 99.1, 90, 100, 12345.6);"))

    # Query data
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

    // Add a record
    Log!(format!("{:?}", DBExec(":INSERT INTO TEST_TABLE (TS, HIGH, OPEN, LOW, CLOSE, VOLUME) VALUES (1518970320000, 100, 99.1, 90, 100, 12345.6);")));

    // Query data
    Log!(format!("{:?}", DBExec(":SELECT * FROM TEST_TABLE;")));
}
```

Use the ```DBExec()``` function to create a data table.

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

Perform insert, delete, query, and update operations on records in a data table.

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

    // Insert a record
    Log(DBExec("INSERT INTO TEST_TABLE (TS, HIGH, OPEN, LOW, CLOSE, VOLUME) VALUES (1518970320000, 100, 99.1, 90, 100, 12345.6);"))

    // Query data
    Log(DBExec("SELECT * FROM TEST_TABLE;"))

    // Update data
    Log(DBExec("UPDATE TEST_TABLE SET HIGH=? WHERE TS=?", 110, 1518970320000))

    // Delete data
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

    # Insert a record
    Log(DBExec("INSERT INTO TEST_TABLE (TS, HIGH, OPEN, LOW, CLOSE, VOLUME) VALUES (1518970320000, 100, 99.1, 90, 100, 12345.6);"))

    # Query data
    Log(DBExec("SELECT * FROM TEST_TABLE;"))

    # Update data
    Log(DBExec("UPDATE TEST_TABLE SET HIGH=? WHERE TS=?", 110, 1518970320000))

    # Delete data
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

    // Insert a record
    Log!(format!("{:?}", DBExec("INSERT INTO TEST_TABLE (TS, HIGH, OPEN, LOW, CLOSE, VOLUME) VALUES (1518970320000, 100, 99.1, 90, 100, 12345.6);")));

    // Query data
    Log!(format!("{:?}", DBExec("SELECT * FROM TEST_TABLE;")));

    // Update data. Rust's DBExec() function only accepts a single SQL statement string argument and does not support the ? placeholder for passing parameters; parameter values are written directly in the statement
    Log!(format!("{:?}", DBExec("UPDATE TEST_TABLE SET HIGH=110 WHERE TS=1518970320000;")));

    // Delete data
    Log!(format!("{:?}", DBExec("DELETE FROM TEST_TABLE WHERE HIGH=110;")));
}
```

- By passing an argument to the ```DBExec()``` function, you can operate on the live trading database (SQLite database).

  - It supports insert, delete, query, and update operations on data in the live trading database, and supports **SQLite** syntax.

  - The system-reserved tables in the live trading database include: ```kvdb```, ```cfg```, ```log```, ```profit```, ```chart```. Please do not operate on these tables.

  - **Transactions** are currently not supported, and such operations are not recommended, as they may cause system conflicts.

  - The ```DBExec()``` function only supports live trading.

See also: `_G`

#### SetChannelData

```
SetChannelData(data)
```

Publishes the latest status data to a channel. This function is used for communication between live trading bots, allowing the current bot's status data to be broadcast to a channel for other live trading bots to subscribe to and retrieve.

Parameters:

- `data` (object / array / string / number / bool / null, required): The data to be published to the channel. It can be any data structure that supports ```JSON``` serialization, and is typically an object containing the live trading bot's status information.

Returns (null): This function has no return value.

Channel Broadcaster Example - Publishing BTC Market Price Data

```javascript
function main() {
    var updateId = 0
    var robotId = _G()  // Get current live bot ID

    while(true) {
        // Get real-time market price
        var ticker = exchange.GetTicker("BTC_USDT")
        if (!ticker) {
            Sleep(5000)
            continue
        }

        // Construct current channel state data
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

        // Display current channel state
        LogStatus("Channel Broadcaster [Bot ID: " + robotId + "]\n" +
                  "Update ID: #" + channelState.updateId + "\n" +
                  "Time: " + _D(channelState.timestamp) + "\n" +
                  "Symbol: " + channelState.symbol + "\n" +
                  "Last Price: $" + channelState.lastPrice.toFixed(2) + "\n" +
                  "Volume: " + channelState.volume.toFixed(4) + "\n" +
                  "High: $" + channelState.high.toFixed(2) + "\n" +
                  "Low: $" + channelState.low.toFixed(2))

        Sleep(60000)  // Update channel state once per minute
    }
}
```

```python
def main():
    updateId = 0
    robotId = _G()  # Get current live bot ID

    while True:
        # Get real-time market price
        ticker = exchange.GetTicker("BTC_USDT")
        if not ticker:
            Sleep(5000)
            continue

        # Construct current channel state data
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

        # Display current channel state
        LogStatus("Channel Broadcaster [Bot ID: {}]\n".format(robotId) +
                  "Update ID: #{}\n".format(channelState["updateId"]) +
                  "Time: {}\n".format(_D(channelState["timestamp"])) +
                  "Symbol: {}\n".format(channelState["symbol"]) +
                  "Last Price: ${:.2f}\n".format(channelState["lastPrice"]) +
                  "Volume: {:.4f}\n".format(channelState["volume"]) +
                  "High: ${:.2f}\n".format(channelState["high"]) +
                  "Low: ${:.2f}".format(channelState["low"]))

        Sleep(60000)  # Update channel state once per minute
```

```rust
fn main() {
    let mut updateId = 0;
    let robotId = _G!();  // Get current live bot ID

    loop {
        // Get real-time market price
        let ticker = match exchange.GetTicker("BTC_USDT") {
            Ok(t) => t,
            Err(_) => {
                Sleep(5000);
                continue;
            }
        };

        // Construct current channel state data
        // Rust's SetChannelData only accepts a string argument, so use format! to build the JSON text
        updateId += 1;
        let timestamp = Unix() * 1000;
        let channelState = format!(
            r#"{{"robotId": {}, "updateId": {}, "timestamp": {}, "symbol": "BTC_USDT", "lastPrice": {}, "volume": {}, "high": {}, "low": {}}}"#,
            robotId, updateId, timestamp, ticker.Last, ticker.Volume, ticker.High, ticker.Low
        );

        // Publish the latest state on the channel (overwrites the old state)
        SetChannelData(&channelState);

        // Display current channel state
        LogStatus!(format!(
            "Channel Broadcaster [Bot ID: {}]\nUpdate ID: #{}\nTime: {}\nSymbol: BTC_USDT\nLast Price: ${:.2}\nVolume: {:.4}\nHigh: ${:.2}\nLow: ${:.2}",
            robotId, updateId, _D(timestamp), ticker.Last, ticker.Volume, ticker.High, ticker.Low
        ));

        Sleep(60000);  // Update channel state once per minute
    }
}
```

Cross-platform sending example - Simulate an external platform (such as TradingView) sending data to an FMZ live bot

```javascript
// This example demonstrates how to use HttpQuery to send an HTTP POST request, simulating an external platform sending data to an FMZ live bot
// In a real scenario, external platforms (such as TradingView's Webhook alert URL, third-party trading systems, etc.) directly call the FMZ API endpoint

function main() {
    let uuid = "6BC42A119B5DBFA2188A8279DA3B5C30"
    let robotId = 123456  // Target live bot ID (the live bot used to receive data)
    let baseUrl = "https://www.fmz.com"

    while (true) {
        // Prepare the data to send (can be JSON, text, or other formats)
        let sendData = {
            "action": "buy",
            "symbol": "BTC_USDT",
            "price": 50000,
            "timestamp": Date.now()
        }

        // Construct the HTTP POST request
        let options = {
            method: "POST",
            body: JSON.stringify(sendData)  // body can be a JSON string, plain text, etc.
        }
        let url = `${baseUrl}/api/v1?method=pub&robot=${robotId}&channel=${uuid}`

        // Send the data
        let ret = HttpQuery(url, options)
        Log("Simulated external platform sending data, result:", ret)

        Sleep(10000)  // Send once every 10 seconds
    }
}
```

```python
# This example demonstrates how to use HttpQuery to send an HTTP POST request, simulating an external platform sending data to an FMZ live bot
# In a real scenario, external platforms (such as TradingView's Webhook alert URL, third-party trading systems, etc.) directly call the FMZ API endpoint

import json

def main():
    uuid = "6BC42A119B5DBFA2188A8279DA3B5C30"
    robotId = 123456  # Target live bot ID (the live bot used to receive data)
    baseUrl = "https://www.fmz.com"

    while True:
        # Prepare the data to send (can be JSON, text, or other formats)
        sendData = {
            "action": "buy",
            "symbol": "BTC_USDT",
            "price": 50000,
            "timestamp": time.time() * 1000
        }

        # Construct the HTTP POST request
        options = {
            "method": "POST",
            "body": json.dumps(sendData)  # body can be a JSON string, plain text, etc.
        }
        url = "{}/api/v1?method=pub&robot={}&channel={}".format(baseUrl, robotId, uuid)

        # Send the data
        ret = HttpQuery(url, options)
        Log("Simulated external platform sending data, result:", ret)

        Sleep(10000)  # Send once every 10 seconds
```

```rust
// This example demonstrates how to use HttpQuery to send an HTTP POST request, simulating an external platform sending data to an FMZ live bot
// In a real scenario, external platforms (such as TradingView's Webhook alert URL, third-party trading systems, etc.) directly call the FMZ API endpoint

fn main() {
    let uuid = "6BC42A119B5DBFA2188A8279DA3B5C30";
    let robotId = 123456;  // Target live bot ID (the live bot used to receive data)
    let baseUrl = "https://www.fmz.com";

    loop {
        // Prepare the data to send (can be JSON, text, or other formats)
        let sendData = format!(
            r#"{{"action": "buy", "symbol": "BTC_USDT", "price": 50000, "timestamp": {}}}"#,
            Unix() * 1000
        );

        // Construct the HTTP POST request; {:?} escapes body into a valid JSON string value
        let options = format!(r#"{{"method": "POST", "body": {:?}}}"#, sendData);
        let url = format!("{}/api/v1?method=pub&robot={}&channel={}", baseUrl, robotId, uuid);

        // Send the data
        let ret: String = HttpQuery(&url, options.as_str());
        Log!("Simulated external platform sending data, result:", ret);

        Sleep(10000);  // Send once every 10 seconds
    }
}
```

The ```SetChannelData()``` function is a non-blocking call; it returns immediately after being called and does not wait for the data transmission to complete.

Each live trading bot has its own dedicated channel, and the channel ID is the bot ID (which can be obtained via the ```_G()``` function).

The channel only stores the latest status data. Each call to ```SetChannelData()``` overwrites the previously published data rather than appending to a message history.

Channel data supports broadcasting across live trading bots, across dockers, and across servers, and multiple bots can subscribe to the same channel.

The subscriber side uses the ```GetChannelData()``` function to subscribe to channel data.

Channel communication is intended for live trading environments; this feature may be restricted in the backtesting system.

The byte length of the passed-in ```data``` parameter after JSON serialization must not exceed 1024 bytes. Exceeding this limit may cause the data publishing to fail. It is recommended to transmit only the necessary status information and to avoid transmitting overly large data objects.

The published data should be used reasonably according to the memory and network bandwidth of the hardware device; avoid publishing overly large data objects.

The data published by the ```SetChannelData()``` function can not only be subscribed to by other live trading bots within the FMZ platform, but also supports cross-platform data sending. External platforms (such as TradingView Webhook alerts, third-party trading systems, monitoring software, etc.) can send data to a specified FMZ live trading bot via HTTP POST requests.

**How to send data across platforms:** External systems send data to the FMZ platform API endpoint via an HTTP POST request: ```https://www.fmz.com/api/v1?method=pub&robot={robotId}&channel={uuid}```, where ```robotId``` is the target live trading bot ID and ```uuid``` is a 32-character channel identifier. The data to be sent is passed in the request body, and can be in JSON format, plain text, or other formats. Note: a live trading bot must already be subscribed to the specified UUID channel before an external system can successfully send data; the broadcast data will be sent to all live trading bots under the same docker as the ```robotId``` bot, and any bot under that docker subscribed to the UUID channel can receive the data.

See also: `GetChannelData`; `_G`

#### GetChannelData

```
GetChannelData(channelId)
```

Subscribes to the channel data of a specified live trading bot. This function is used for inter-bot communication, allowing you to retrieve the latest status data published by other live trading bots via the ```SetChannelData()``` function.

Parameters:

- `channelId` (string / number, required): The channel identifier, which supports the following two types:

1. **Bot ID**: Used to subscribe to the channel data of other live trading bots (i.e., inter-bot communication). The bot ID can be obtained via the ```_G()``` function.

2. **32-bit UUID**: Used to subscribe to data sent across platforms (i.e., data sent to the FMZ platform by external systems via the HTTP API).

Returns (object / array / string / number / bool / null value): Returns the latest status data of the subscribed channel. It returns ```null``` on the first call, in which case a retry is required. The data structure is determined by the data published by the broadcasting end.

Channel Subscriber Example - Subscribe to Channel Data from Two Live Trading Bots

```javascript
function main() {
    // The two channel IDs to subscribe to (modify according to your actual situation)
    var channelId1 = "632799"  // Live trading bot ID of channel 1
    var channelId2 = "632800"  // Live trading bot ID of channel 2

    while(true) {
        // Subscribe to the current state of channel 1
        var state1 = GetChannelData(channelId1)

        // Subscribe to the current state of channel 2
        var state2 = GetChannelData(channelId2)

        // Build the status display
        var statusMsg = "Channel Subscriber - Current Subscription State\n\n"

        // Display channel 1 state
        statusMsg += "═══ Channel 1 [" + channelId1 + "] ═══\n"
        if (state1 !== null) {
            statusMsg += "Update ID: #" + state1.updateId + "\n"
            statusMsg += "Time: " + _D(state1.timestamp) + "\n"
            statusMsg += "Trading Pair: " + state1.symbol + "\n"
            statusMsg += "Last Price: $" + state1.lastPrice.toFixed(2) + "\n"
            statusMsg += "Volume: " + state1.volume.toFixed(4) + "\n"
        } else {
            statusMsg += "State: Waiting... (first call returns null)\n"
        }

        statusMsg += "\n"

        // Display channel 2 state
        statusMsg += "═══ Channel 2 [" + channelId2 + "] ═══\n"
        if (state2 !== null) {
            statusMsg += "Update ID: #" + state2.updateId + "\n"
            statusMsg += "Time: " + _D(state2.timestamp) + "\n"
            statusMsg += "Trading Pair: " + state2.symbol + "\n"
            statusMsg += "Last Price: $" + state2.lastPrice.toFixed(2) + "\n"
            statusMsg += "Volume: " + state2.volume.toFixed(4) + "\n"
        } else {
            statusMsg += "State: Waiting... (first call returns null)\n"
        }

        LogStatus(statusMsg)

        Sleep(5000)  // Subscribe to the channel every 5 seconds
    }
}
```

```python
def main():
    # The two channel IDs to subscribe to (modify according to your actual situation)
    channelId1 = "632799"  # Live trading bot ID of channel 1
    channelId2 = "632800"  # Live trading bot ID of channel 2

    while True:
        # Subscribe to the current state of channel 1
        state1 = GetChannelData(channelId1)

        # Subscribe to the current state of channel 2
        state2 = GetChannelData(channelId2)

        # Build the status display
        statusMsg = "Channel Subscriber - Current Subscription State\n\n"

        # Display channel 1 state
        statusMsg += "═══ Channel 1 [{}] ═══\n".format(channelId1)
        if state1 is not None:
            statusMsg += "Update ID: #{}\n".format(state1["updateId"])
            statusMsg += "Time: {}\n".format(_D(state1["timestamp"]))
            statusMsg += "Trading Pair: {}\n".format(state1["symbol"])
            statusMsg += "Last Price: ${:.2f}\n".format(state1["lastPrice"])
            statusMsg += "Volume: {:.4f}\n".format(state1["volume"])
        else:
            statusMsg += "State: Waiting... (first call returns None)\n"

        statusMsg += "\n"

        # Display channel 2 state
        statusMsg += "═══ Channel 2 [{}] ═══\n".format(channelId2)
        if state2 is not None:
            statusMsg += "Update ID: #{}\n".format(state2["updateId"])
            statusMsg += "Time: {}\n".format(_D(state2["timestamp"]))
            statusMsg += "Trading Pair: {}\n".format(state2["symbol"])
            statusMsg += "Last Price: ${:.2f}\n".format(state2["lastPrice"])
            statusMsg += "Volume: {:.4f}\n".format(state2["volume"])
        else:
            statusMsg += "State: Waiting... (first call returns None)\n"

        LogStatus(statusMsg)

        Sleep(5000)  # Subscribe to the channel every 5 seconds
```

```rust
fn main() {
    // Rust's GetChannelData() function does not accept a channel ID parameter; it can only read the current live trading bot's own channel
    // (i.e. the latest data published by this bot via SetChannelData()); it cannot subscribe to the channels of other live trading bots
    loop {
        // Subscribe to the current state of the channel
        let state = GetChannelData();

        // Build the status display
        let mut statusMsg = String::from("Channel Subscriber - Current Subscription State\n\n");

        if !state.is_null() {
            statusMsg += &format!("Update ID: #{}\n", state["updateId"].as_i64().unwrap_or(0));
            statusMsg += &format!("Time: {}\n", _D(state["timestamp"].as_i64().unwrap_or(0)));
            statusMsg += &format!("Trading Pair: {}\n", state["symbol"].as_str().unwrap_or(""));
            statusMsg += &format!("Last Price: ${:.2}\n", state["lastPrice"].as_f64().unwrap_or(0.0));
            statusMsg += &format!("Volume: {:.4}\n", state["volume"].as_f64().unwrap_or(0.0));
        } else {
            statusMsg += "State: Waiting... (first call returns null)\n";
        }

        LogStatus!(statusMsg);

        Sleep(5000);  // Subscribe to the channel every 5 seconds
    }
}
```

Cross-platform subscription example - Using UUID to subscribe to data sent from external systems

```javascript
function main() {
    // Use a 32-bit UUID as the channel identifier
    let uuid = "6BC42A119B5DBFA2188A8279DA3B5C30"

    while (true) {
        // Subscribe to data on the UUID channel
        let data = GetChannelData(uuid)

        if (data !== null) {
            Log("Received cross-platform data:", data)
        } else {
            Log("Waiting for data... (first call returns null)")
        }

        Sleep(10000)  // Check every 10 seconds
    }
}
```

```python
def main():
    # Use a 32-bit UUID as the channel identifier
    uuid = "6BC42A119B5DBFA2188A8279DA3B5C30"

    while True:
        # Subscribe to data on the UUID channel
        data = GetChannelData(uuid)

        if data is not None:
            Log("Received cross-platform data:", data)
        else:
            Log("Waiting for data... (first call returns None)")

        Sleep(10000)  # Check every 10 seconds
```

```rust
fn main() {
    // Rust's GetChannelData() function does not accept a channel ID parameter, so it cannot use a 32-bit UUID to subscribe to cross-platform data;
    // it can only read the latest data from the current live trading bot's own channel (i.e., data published by this bot via SetChannelData())
    loop {
        // Subscribe to the channel's data
        let data = GetChannelData();

        if !data.is_null() {
            Log!("Received cross-platform data:", data);
        } else {
            Log!("Waiting for data... (first call returns null)");
        }

        Sleep(10000);  // Check every 10 seconds
    }
}
```

The ```GetChannelData()``` function is a non-blocking call. It returns immediately after being called and does not wait for data reception to complete.

The first time the ```GetChannelData()``` function is called, it returns ```null```. You need to retry and wait for the channel data synchronization to complete.

Each call retrieves the latest status data on the channel, rather than a historical message queue.

A single live trading bot can subscribe to the channels of multiple different bots simultaneously; simply call ```GetChannelData()``` multiple times, passing in a different bot ID each time.

The current live trading bot can also subscribe to its own channel, meaning the ```robotId``` parameter can be the ID of the current bot.

Channel data can be transmitted across bots, across administrators, and across servers.

The broadcasting end uses the ```SetChannelData()``` function to publish channel data.

Channel communication is suitable for the live trading environment; this feature may be limited in the backtesting system.

The ```GetChannelData()``` function supports cross-platform subscription. When a 32-bit UUID is used as the channel identifier, it can receive data sent by external systems outside the FMZ platform via the HTTP API. The external system must specify both the bot ID and the UUID in order to send data; all live trading bots under the same administrator can subscribe to the data of that UUID channel, while bots under different administrators cannot subscribe.

See also: `SetChannelData`; `_G`

### Threads

All concurrency functions are here. `exchange.Go` runs a slow call in the background and `EventLoop` waits for the results of concurrent calls and other events; both work in every programming language. The multi-threading objects below are ```JavaScript``` only.

The FMZ Quant Trading Platform provides true multi-threading support for ```JavaScript``` language strategies at the system level, implementing the following objects:

| Object | Description | Notes |
| - | - | - |
| threading | Global multi-threading object | Member functions: ```Thread```, ```getThread```, ```mainThread```, etc. |
| Thread | Thread object | Member functions: ```peekMessage```, ```postMessage```, ```join```, etc. |
| ThreadLock | Thread lock object | Member functions: ```acquire```, ```release```. Can be passed as a parameter to thread execution functions into the thread environment. |
| ThreadEvent | Event object | Member functions: ```set```, ```clear```, ```wait```, ```isSet```. Can be passed as a parameter to thread execution functions into the thread environment. |
| ThreadCondition | Condition object | Member functions: ```notify```, ```notifyAll```, ```wait```, ```acquire```, ```release```. Can be passed as a parameter to thread execution functions into the thread environment. |
| ThreadDict | Dictionary object | Member functions: ```get```, ```set```. Can be passed as a parameter to thread execution functions into the thread environment. |
| Server | Service object | Returned by ```threading.Serve()```. Member functions: ```addr```, ```close```, ```stop```, ```join```, ```pending```. Can be passed as a parameter to thread execution functions into the thread environment. |

#### exchange.Go

```
exchange.Go(method)
exchange.Go(method, ...args)
```

Multi-threaded asynchronous support function that can convert the operations of all supported functions into asynchronous concurrent execution.

Parameters:

- `method` (string, required): The ```method``` parameter is used to specify the name of the function to be executed concurrently. Please note that this parameter is a function name string, not a function reference.
- `arg` (string / number / bool / object / array / function / any (any type supported by the platform), optional): The parameters of the **concurrent execution function**. The ```arg``` parameter can appear multiple times. The type and number of the ```arg``` parameters depend on the parameter definition of the **concurrent execution function**.

Returns (object): The ```exchange.Go()``` function immediately returns a concurrent object. You can use the ```wait()``` method of this concurrent object to obtain the result of the concurrent request.

```exchange.Go()``` function usage example. When checking for ```undefined```, you must use ```typeof(xx) === "undefined"```, because ```null == undefined``` holds true in JavaScript.

```javascript
function main(){
    // The following four operations execute concurrently in asynchronous multi-threaded mode; they take no time and return immediately
    var a = exchange.Go("GetTicker")
    var b = exchange.Go("GetDepth")
    var c = exchange.Go("Buy", 1000, 0.1)
    var d = exchange.Go("GetRecords", PERIOD_H1)

    // Call the wait method to wait for the result of the asynchronous ticker retrieval
    var ticker = a.wait()
    // Returns the depth data; it may also return null if the retrieval fails
    var depth = b.wait()
    // Returns the order ID with a 1-second timeout; returns undefined on timeout. If the previous wait timed out, this object can continue calling wait
    var orderId = c.wait(1000)
    if(typeof(orderId) == "undefined") {
        // Timed out, retrieve again
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
    // In Rust, exchange.Go uses a typed form: use the Go:: method token to specify the concurrent function; pass () for no arguments and a tuple for arguments
    // The following four operations execute concurrently in asynchronous multi-threaded mode; they take no time and return immediately
    let a = exchange.Go(Go::GetTicker, ());
    let b = exchange.Go(Go::GetDepth, ());
    // There is no Buy token in Rust; it is equivalent to CreateOrder, where the first argument "" indicates the current trading pair
    let c = exchange.Go(Go::CreateOrder, ("", "buy", 1000, 0.1));
    let d = exchange.Go(Go::GetRecords, (PERIOD_H1,));

    // Call the wait method to wait for the result of the asynchronous ticker retrieval; wait(0) blocks until the concurrent thread finishes running (corresponding to the parameterless wait() in JS)
    let ticker = a.wait(0);
    // Returns the depth data; it may also return Err if the retrieval fails
    let depth = b.wait(0);
    // Returns the order ID with a 1-second timeout; returns Err on timeout. If the previous wait timed out, this object can continue calling wait
    // Note: Err may also indicate that the order placement itself failed (indistinguishable from a timeout); in this case, calling wait again will return Err and log the error message
    let mut orderId = c.wait(1000);
    if orderId.is_err() {
        // Timed out, retrieve again
        orderId = c.wait(0);
    }
    let records = d.wait(0);
}
```

Calling the ```wait()``` method on a released concurrent object will raise an error:

```javascript
function main() {
    var d = exchange.Go("GetRecords", PERIOD_H1)
    // Wait for the K-line data results to return
    var records = d.wait()
    // Calling wait again here on an asynchronous operation that has already been waited on and finished will return null and log an error message
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
    // In Rust, exchange.Go uses a typed syntax: specify the concurrent function via the Go:: method token
    let d = exchange.Go(Go::GetRecords, (PERIOD_H1,));
    // Wait for the K-line data results to return; wait(0) blocks until execution completes (equivalent to JS's parameterless wait())
    let records = d.wait(0);
    // Calling wait again here on an asynchronous operation that has already been waited on and finished will return Err and log an error message
    let ret = d.wait(0);
}
```

Concurrently retrieve market data from multiple exchanges:

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
            title: "Market Data",
            cols: ["Index", "Name", "Last Price"],
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
            "title": "Market Data",
            "cols": ["Index", "Name", "Last Price"],
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
            // In Rust, exchange.Go is a typed form; the token is Go::GetTicker
            arrRoutine.push(e.Go(Go::GetTicker, ()));
            arrName.push(e.GetName());
        }

        // On failure, record None as a placeholder to stay index-aligned with arrName
        for r in arrRoutine.iter() {
            arrTicker.push(r.wait(0).ok());
        }
        let endTS = UnixNano() / 1000000;

        // Rust has no built-in JSON serialization; use format! to assemble the table's JSON text
        let mut rows = String::new();
        for i in 0..arrTicker.len() {
            if let Some(ticker) = &arrTicker[i] {
                if !rows.is_empty() {
                    rows.push(',');
                }
                rows += &format!(r#"[{}, "{}", {}]"#, i, arrName[i], ticker.Last);
            }
        }
        let tbl = format!(r#"{{"type": "table", "title": "Market Data", "cols": ["Index", "Name", "Last Price"], "rows": [{}]}}"#, rows);

        LogStatus!(_D(None), "Total time for concurrent ticker retrieval:", endTS - beginTS, "ms", "\n", format!("`{}`", tbl));
        Sleep(500);
    }
}
```

Concurrently call the ```exchange.IO("api", ...)``` function:

```javascript
function main() {
    /*
        Test the OKX futures order placement endpoint
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
        Test the OKX futures order placement endpoint
        POST /api/v5/trade/order
    */

    let beginTS = UnixNano() / 1000000;
    // Rust does not support JSON serialization, so construct the parameters directly using a raw string
    let param = r#"{"instId":"BTC-USDT-SWAP","tdMode":"cross","side":"buy","ordType":"limit","px":"16000","sz":"1","posSide":"long"}"#;
    // In Rust, exchange.Go uses a typed form: the token is Go::IO, and the parameters are passed as a tuple
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

Testing the automatic release mechanism

```javascript
function main() {
    var counter = 0
    var arr = []                 // Variables used to test persistently referencing concurrent objects
    var symbols = ["BTC_USDT", "ETH_USDT", "SOL_USDT", "LTC_USDT", "EOS_USDT"]
    while (true) {
        var arrRoutine = []
        for (var symbol of symbols) {
            var r = exchange.Go("GetTicker", symbol)
            arrRoutine.push(r)   // Record the concurrent object, used to call the r.wait() function to get the result; cleared every loop iteration
            // arr.push(r)       // If this line is used, the runtime will persistently reference the concurrent objects, preventing them from being automatically released; when the number of concurrent tasks exceeds 2000, it will report an error: ```InternalError: too many routine wait, max is 2000```.
            counter++
        }

        // Iterate over arrRoutine and call r.wait() to get the results

        LogStatus(_D(), "routine number:", counter)
        Sleep(50)
    }
}
```

```rust
fn main() {
    let mut counter = 0;
    let mut arr: Vec<TypedRoutine<Go::GetTicker>> = Vec::new();   // Variables used to test persistently referencing concurrent objects
    let symbols = ["BTC_USDT", "ETH_USDT", "SOL_USDT", "LTC_USDT", "EOS_USDT"];
    loop {
        let mut arrRoutine = Vec::new();
        for symbol in symbols {
            // In Rust, exchange.Go uses a typed form, with the token being Go::GetTicker
            let r = exchange.Go(Go::GetTicker, (symbol,));
            arrRoutine.push(r);   // Record the concurrent object, used to call the r.wait(0) function to get the result; cleared every loop iteration
            // arr.push(r);       // If this line is used, the runtime will persistently reference the concurrent objects, preventing them from being automatically released; when the number of concurrent tasks exceeds 2000, it will report an error: InternalError: too many routine wait, max is 2000.
            counter += 1;
        }

        // Iterate over arrRoutine and call r.wait(0) to get the results

        LogStatus!(_D(None), "routine number:", counter);
        Sleep(50);
    }
}
```

This function only creates multi-threaded execution tasks when running in live trading. Backtesting does not support multi-threaded concurrent execution of tasks (it can be used in backtesting, but is still executed sequentially).

After the ```exchange.Go()``` function returns an object, you can call its ```wait()``` function through that object to obtain the data returned by the thread. When the concurrent multi-threaded tasks have finished executing and the related variables are no longer referenced, the underlying system will automatically handle resource reclamation.

The ```wait()``` method supports a timeout parameter:

  1. Do not set the timeout parameter, i.e. ```wait()```, or set the timeout parameter to 0, i.e. ```wait(0)```. In this case, the ```wait()``` function will block and wait until the concurrent thread finishes running, and return the execution result of the concurrent thread.

  2. Set the timeout parameter to -1, i.e. ```wait(-1)```. In this case, the ```wait()``` function will return immediately. The return value differs across programming languages; for details, please refer to the call examples in this section.

  3. Set a specific timeout parameter, i.e. ```wait(300)```. In this case, the ```wait()``` function will wait at most 300 milliseconds before returning.

Although the underlying system has an automatic reclamation mechanism, if the related variables are continuously referenced, the concurrent threads will not be released. When the number of concurrent threads exceeds 2000, an error will be reported: ```"too many routine wait, max is 2000"```.

Supported functions: ```GetTicker```, ```GetDepth```, ```GetTrades```, ```GetRecords```, ```GetAccount```, ```GetOrders```, ```GetOrder```, ```CancelOrder```, ```Buy```, ```Sell```, ```GetPositions```, ```IO```, etc. When these functions are called concurrently, they are all executed based on the current `exchange` exchange object.

The difference between the Python language and the JavaScript language is that in Python, the ```wait()``` function of a concurrent object returns two values: the first is the result returned by the asynchronous API call, and the second indicates whether the asynchronous call is completed.

```python
def main():
    d = exchange.Go("GetRecords", PERIOD_D1)
    # ok is guaranteed to return True, unless the strategy is stopped
    ret, ok = d.wait()
    # If the wait times out, or you wait on an instance that has already finished, ok returns False
    ret, ok = d.wait(100)
```

See also: `Mail_Go`, `HttpQuery_Go`, `EventLoop`, `exchange.IO` (API rate limiting control)

#### EventLoop

```
EventLoop()
EventLoop(timeout)
```

Listens for events and returns when any ```WebSocket``` has readable data, or when concurrent tasks such as ```exchange.Go()``` or ```HttpQuery_Go()``` complete.

Parameters:

- `timeout` (number, optional): The ```timeout``` parameter is used to set the timeout period, in milliseconds.

When ```timeout``` is set to 0, the function will wait indefinitely and return only when an event occurs; when ```timeout``` is greater than 0, it specifies the timeout period for waiting on events; when ```timeout``` is less than 0, it returns the most recent event immediately.

Returns (object): If the returned object is not empty, the ```Event``` field in the returned content indicates the trigger type of the event. For example, the following return value structure:

```json

{"Seq":1,"Event":"Exchange_GetTrades","ThreadId":0,"Index":3,"Nano":1682068771309583400}

```

```javascript
function main() {
    var routine_getTicker = exchange.Go("GetTicker")
    var routine_getDepth = exchange.Go("GetDepth")
    var routine_getTrades = exchange.Go("GetTrades")

    // Sleep(2000), if a Sleep statement is used here, it will cause the subsequent EventLoop function to miss the previous events. Because after waiting 2 seconds, the concurrent functions have already received data, and only then does the EventLoop listening mechanism start, so these events will be missed
    // Unless EventLoop(-1) is called on the very first line to initialize the EventLoop listening mechanism first, these events will not be missed

    // Log("GetDepth:", routine_getDepth.wait()) If the wait function is called here in advance to retrieve the result of the concurrent GetDepth function call, the event of this GetDepth function receiving the request result will not be returned in the EventLoop function
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
    // In Rust, exchange.Go uses typed tokens (such as Go::GetTicker) instead of method-name strings; pass () when there are no arguments
    let routine_getTicker = exchange.Go(Go::GetTicker, ());
    let routine_getDepth = exchange.Go(Go::GetDepth, ());
    let routine_getTrades = exchange.Go(Go::GetTrades, ());

    // Sleep(2000), if a Sleep statement is used here, it will cause the subsequent EventLoop function to miss the previous events. Because after waiting 2 seconds, the concurrent functions have already received data, and only then does the EventLoop listening mechanism start, so these events will be missed
    // Unless EventLoop(-1) is called on the very first line to initialize the EventLoop listening mechanism first, these events will not be missed

    // Log!("GetDepth:", routine_getDepth.wait(0)) If the wait function is called here in advance to retrieve the result of the concurrent GetDepth function call, the event of this GetDepth function receiving the request result will not be returned in the EventLoop function
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

The event-listening mechanism is initialized only when the ```EventLoop()``` function is called for the first time in the code. If ```EventLoop()``` is first called after an event callback has already occurred, that earlier event will be missed. The queue structure encapsulated at the system's underlying level can cache at most 500 event callbacks; if the program does not call the ```EventLoop()``` function in time to retrieve them, later event callbacks exceeding the 500-cache limit will be lost.

Calling the ```EventLoop()``` function does not affect the underlying WebSocket cache queue of the system, nor does it affect the cache of concurrent functions such as ```exchange.Go()```. The data in these caches must still be retrieved using their respective methods. For data that has already been retrieved before the ```EventLoop()``` function returns, no return event will be generated again in the ```EventLoop()``` function.

The main purpose of the ```EventLoop()``` function is to notify the strategy layer that the system's underlying level has received new network data, thereby driving the entire strategy in an event-driven manner. When the ```EventLoop()``` function returns an event, you only need to iterate through all data sources (such as WebSocket connections and objects created by ```exchange.Go()```) and attempt to retrieve the data.

The ```EventLoop()``` function is only supported in live trading.

When called in the main function ```main()```, it listens for events on the main thread. In strategies written in ```JavaScript```, it can also be called in the execution function of a thread created by the ```threading.Thread()``` function to listen for events on the current thread.

See also: `Dial`, `exchange.Go`, `HttpQuery_Go`

#### threading

The ```threading``` object serves as a global multi-threading management tool, providing functions for creating concurrent threads, thread locks, condition variables, and more. This section introduces the member functions of the ```threading``` object. Only ```JavaScript``` language strategies support this object.

##### Thread

```
Thread(func, ...args)
Thread(...items)
```

The ```Thread()``` function is used to create concurrent threads.

Parameters:

- `func` (function, required): The parameter ```func``` is a function for concurrent execution (passed by reference), supporting anonymous functions. ```func``` can accept multiple parameters, which will be passed through ```...args``` during concurrent execution. Therefore, the parameter list of ```func``` needs to be consistent with ```...args```.
- `arg` (string / number / bool / object / array / function / any (any type supported by the platform), optional): The parameter ```arg``` is the actual parameter passed to ```func``` (the concurrent thread execution function) during callback execution; there can be multiple ```arg``` parameters, and the parameter list of ```func``` needs to be consistent with ```...args```.
- `item` (array, required): The parameter ```item``` is an array containing the function reference to be executed concurrently and its parameters. When calling the ```Thread``` function, multiple sets of ```item``` parameters can be passed.

Returns (```Thread``` object): The ```Thread()``` function returns a ```Thread``` object for managing created concurrent threads, thread communication, etc.

Create a concurrent thread with both a custom function and an anonymous function simultaneously.

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

Use ```Thread(...items)``` format to create concurrent threads that execute multiple functions sequentially.

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

Support passing functions as parameters to concurrently executing functions.

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

Support passing function strings to dynamically import external libraries for concurrent computation.

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

The thread function ```func``` passed to the ```Thread()``` function for concurrent execution runs in an isolated environment, so it cannot directly reference variables outside the thread, which will cause compilation failure when referenced. Additionally, referencing other closure functions is not supported within the thread. All APIs provided by the platform can be called inside the thread, but user-defined functions cannot be called.

When a thread completes execution and is not continuously referenced, the system will automatically reclaim thread-related resources at the underlying level, without the need to explicitly call the ```join()``` function to release resources. If there are continuous references preventing resource release, an error will be reported when the number of concurrent threads exceeds 2000: ```InternalError: too many routine wait, max is 2000```.

Supports backtesting system and live trading environment; all concurrent thread-related functions in the backtesting system are only provided for code compatibility support and will not actually execute concurrent threads, which will not be elaborated further in this chapter.

See also: `getThread`, `mainThread`, `currentThread`, `Lock`,  `Condition`, `Event`, `Dict`, `pending`,  `eventLoop`

##### getThread

```
getThread(threadId)
```

The ```getThread()``` function is used to get a thread object based on the specified thread ID.

Parameters:

- `threadId` (number, required): The parameter ```threadId``` is the thread object ID, which is used to get the corresponding thread object.

Returns (```Thread``` object): The ```getThread()``` function returns the ```Thread``` object specified by the parameter threadId

Get the specified thread object by ```threadId```.

```javascript
function main() {
    var t1 = threading.Thread(function () {
        // Thread object has method: id(), used to get the thread's Id, you can check the documentation for the corresponding Thread object section
        var id = threading.currentThread().id()
        var thread1 = threading.getThread(id)

        Log("id:", id, ", thread1.id():", thread1.id())
        Log(`id == thread1.id():`, id == thread1.id())
    })
    t1.join()
}
```

Supports backtesting system and live trading environment.

If the target thread has finished executing and been released, the thread object cannot be obtained through ```threading.getThread(threadId)```.

See also: `Thread`, `mainThread`, `currentThread`, `Lock`,  `Condition`, `Event`, `Dict`, `pending`,  `eventLoop`

##### mainThread

```
mainThread()
```

The ```mainThread()``` function is used to get the thread object of the main thread, which is the thread where the ```main()``` function in the strategy is located.

Returns (```Thread``` object): The ```mainThread()``` function returns the thread object of the main thread.

Get the ```Thread``` object of the main thread and output the ```threadId``` of the main thread.

```javascript
function main() {
    Log("Main thread ID:", threading.mainThread().id())
}
```

The thread object of the main thread can also be obtained in concurrent threads.

```javascript
function test() {
    Log("Main thread ID output in test function:", threading.mainThread().id())
}

function main() {
    var t1 = threading.Thread(test)
    t1.join()
}
```

Supported in backtesting system and live trading environment.

See also: `getThread`, `Thread`, `currentThread`, `Lock`,  `Condition`, `Event`, `Dict`, `pending`,  `eventLoop`

##### currentThread

```
currentThread()
```

The ```currentThread()``` function is used to get the thread object of the current thread.

Returns (```Thread``` object): The ```currentThread()``` function returns the thread object of the current thread.

Get the ```Thread``` object of the current thread and output the ```threadId``` of the current thread.

```javascript
function test() {
    Log("Current thread ID:", threading.currentThread().id())
}

function main() {
    var t1 = threading.Thread(test)
    t1.join()
}
```

Supports backtesting system and live trading environment.

See also: `Thread`, `mainThread`, `Thread`, `Lock`,  `Condition`, `Event`, `Dict`, `pending`,  `eventLoop`

##### Lock

```
Lock()
```

The ```Lock()``` function is used to create a thread lock object.

Returns (```ThreadLock``` object): The ```Lock()``` function returns a thread lock object.

Two concurrent threads accessing shared resources.

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

Supports backtesting system and live trading environment.

See also: `getThread`, `mainThread`, `currentThread`, `Thread`,  `Condition`, `Event`, `Dict`, `pending`,  `eventLoop`

##### Condition

```
Condition()
```

The ```Condition()``` function is used to create a condition variable object, which is used to implement synchronization and communication between threads in a multi-threaded concurrent environment. Through ```Condition()```, a thread can enter a waiting state when specific conditions are not met, until another thread signals that the conditions have been met.

Returns (```ThreadCondition``` object): The ```Condition()``` function returns a ```ThreadCondition``` object.

Two concurrent threads accessing shared resources.

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

The backtesting system does not currently support this feature, only the interface definition is provided.

See also: `getThread`, `mainThread`, `currentThread`, `Lock`,  `Thread`, `Event`, `Dict`, `pending`,  `eventLoop`

##### Event

```
Event()
```

The ```Event()``` function is used to create a *thread event* object, which is used for synchronization between threads, allowing one thread to wait for notification or signal from another thread.

Returns (```ThreadEvent``` object): The ```Event()``` function returns a ```ThreadEvent``` object.

Two concurrent threads accessing shared resources.

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

Supports backtesting system and live trading environment.

See also: `getThread`, `mainThread`, `currentThread`, `Lock`,  `Condition`, `Thread`, `Dict`, `pending`,  `eventLoop`

##### Dict

```
Dict()
```

The ```Dict()``` function is used to create a dictionary object for passing and sharing data between concurrent threads.

Returns (```ThreadDict``` object): The ```Dict()``` function returns a ```ThreadDict``` object.

Pass a regular object to concurrent thread execution function, test whether modifying object key values will affect object key values in other threads.

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

Pass a ```ThreadDict``` object created by the ```Dict()``` function to concurrent thread execution function, test whether modifying object key values will affect object key values in other threads.

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

When passing regular objects to concurrent thread functions, deep copy is used. Modifying key values in concurrent threads will not affect dictionaries in other threads.

Supports backtesting system and live trading environment.

See also: `getThread`, `mainThread`, `currentThread`, `Lock`,  `Condition`, `Event`, `Thread`, `pending`,  `eventLoop`

##### Serve

```
Serve(serveURI, handler)
Serve(serveURI, handler, ...args)
```

The ```Serve()``` function starts an HTTP, TCP or WebSocket (over HTTP) service inside the strategy process and returns a `Server` object.

Parameters:

- `serveURI` (string, required): The ```serveURI``` parameter sets the protocol, bind address, port and options of the service, for example ```http://0.0.0.0:8088?gzip=true```; the IP can be omitted, as in ```http://:8088?gzip=true``` (listen on all interfaces). Port ```0``` picks a free port; get the actual address with ```addr()``` on the returned object.
- TCP
  For example ```tcp://127.0.0.1:6666```.
- HTTP
  For example ```http://127.0.0.1:6666```. WebSocket services use HTTP too: call ```ctx.upgrade("websocket")``` in the handler to switch.

Options after ```?```:
- ```gzip=true```: enable gzip compression.
- ```tls=true```: enable TLS (HTTPS, wss, or TLS over TCP). The PEM certificate and private key must be given as well, URL-encoded, in ```cert_pem``` and ```cert_key_pem```, for example ```http://:8443?tls=true&cert_pem=xxxx&cert_key_pem=xxxx```.
Only the ```tcp://``` and ```http://``` prefixes are accepted; an HTTPS service is ```http://``` with ```tls=true```.
- `handler` (function, required): The ```handler``` parameter is the route handler (HTTP), message handler (TCP) or stream handler (WebSocket). It is called once per TCP connection or HTTP request, each in its own thread.
The callback may declare several parameters; the first one is the ```ctx``` context object.
- `arg` (string / number / bool / object / array / function / any (any type supported by the platform), optional): Actual arguments for the **callback** passed as ```handler```; there can be several, for example:
```js
threading.Serve("http://:8088", function(ctx, a, b, c) {
    Log(`ctx.host():`, ctx.host(), ", a=", a, ", b=", b, ", c=", c)
}, 1, 2, 3)
```
The arguments ```1```, ```2```, ```3``` passed to ```Serve()``` become the callback's parameters ```a```, ```b```, ```c```.

Returns (Server object): A `Server` object. ```addr()``` returns the actual listening address and port, for example ```127.0.0.1:8088``` or ```[::]:8089```; ```close()``` and ```stop()``` shut the service down.

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
# Not supported
```

- JavaScript strategies only.
- Like threads created by `Thread`, the handler runs in an isolated environment: it cannot reference outer variables, closures or user-defined functions, so pass what it needs through ```...args```; every platform API is available. Objects such as `ThreadDict` and `ThreadLock` can be passed as arguments to share data with other threads.
- An HTTP service handles one request per connection; what the handler writes with ```ctx.write()``` is sent in one piece after the handler returns.
- At most 64 handlers run at the same time per service; beyond that HTTP requests get ```503``` and TCP connections are dropped.
- Services close automatically when the strategy stops; call ```close()``` or ```stop()``` on the returned object to close one earlier.
- WebSocket services are built on HTTP: route one path to the WebSocket handler to implement subscription/push, as in the example in this section.
- The old global function ```__Serve()``` still works with the same arguments but returns only the listening address string, i.e. ```threading.Serve(...).addr()```; use ```threading.Serve()``` in new code.

The callback passed as ```handler``` receives a ```ctx``` parameter, a context object for reading request data and writing responses, with the following methods:
- ctx.proto()
  HTTP/TCP. Returns the protocol name, for example ```HTTP/1.1``` or ```tcp```.
- ctx.host()
  HTTP. Returns the host information: IP address and port.
- ctx.path()
  HTTP. Returns the request path.
- ctx.query(key)
  HTTP. Returns the value of ```key``` in the request's query string. For the request ```http://127.0.0.1:8088?num=123```, ```ctx.query("num")``` returns ```"123"```.
- ctx.rawQuery()
  HTTP. Returns the raw query string of the request.
- ctx.headers()
  HTTP. Returns the request headers.
- ctx.header(key)
  HTTP. Returns the value of one request header, for example ```ctx.header("User-Agent")```.
- ctx.method()
  HTTP. Returns the request method, such as ```GET``` or ```POST```.
- ctx.body()
  HTTP POST. Returns the request body.
- ctx.setHeader(key, value)
  HTTP. Sets a response header.
- ctx.setStatus(code)
  HTTP. Sets the response status code, usually at the end of a route branch; the default is 200.
- ctx.remoteAddr()
  HTTP/TCP. Returns the address and port of the remote client.
- ctx.localAddr()
  HTTP/TCP. Returns the local address and port of the service.
- ctx.upgrade("websocket")
  WebSocket over HTTP. Switches ```ctx``` to the WebSocket protocol; returns ```true``` on success and ```false``` on failure.
- ctx.read(timeout_ms)
  WebSocket and TCP (not plain HTTP). Reads data from the connection; ```timeout_ms``` is an optional timeout in milliseconds. Returns ```null``` on timeout and an empty string ```""``` when the peer closed the connection.
- ctx.write(s)
  HTTP/TCP. Writes string data; encode objects with ```JSON.stringify()``` first. On a WebSocket connection it sends the string to the client.

See also: `Server`, `Dial`, `HttpQuery`, `Thread`

##### pending

```
pending()
```

The ```pending``` function is used to get the number of concurrent threads currently running in the strategy program.

Returns (number): The ```pending()``` function returns the number of concurrent threads currently running in the strategy program.

Create two concurrently running threads and call the ```pending()``` function at different time points.

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

When the strategy's ```main()``` function starts running, directly calling ```pending()``` will return 1, because the main thread where ```main()``` function is located is also counted as a running thread.

Supports both backtesting system and live trading environment.

See also: `getThread`, `mainThread`, `currentThread`, `Lock`,  `Condition`, `Event`, `Dict`, `Thread`,  `eventLoop`

#### Thread

```Thread``` objects can be created or returned through ```threading.Thread()```, ```threading.getThread()```, ```threading.mainThread()```, ```threading.currentThread()```.

##### peekMessage

```
peekMessage()
peekMessage(timeout)
```

The ```peekMessage()``` function is used to receive messages from a thread.

Parameters:

- `timeout` (number, optional): The ```timeout``` parameter sets the timeout duration, blocking and waiting for data according to the milliseconds specified by this parameter; returns null if no data is received and timeout occurs. If ```timeout``` is set to 0 or the ```timeout``` parameter is not passed, it will block indefinitely until data is received from the channel. If ```timeout``` is set to -1, it will not block and returns immediately, returning null when there is no data.

Returns (string / number / bool / object / array / any (any type supported by the platform)): The ```peekMessage()``` function returns messages received by the thread associated with the current thread object.

Concurrent thread sends messages to the main thread.

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

When writing programs, be careful to avoid thread deadlock issues.

See also: `postMessage`, `join`, `terminate`, `getData`, `setData`, `id`, `name`, `eventLoop`

##### postMessage

```
postMessage(msg)
```

The ```postMessage()``` function is used to send messages to a thread.

Parameters:

- `msg` (string / number / bool / object / array / function / any (any type supported by the platform), required): The parameter ```msg``` is the message to be sent.

Send messages in concurrent threads and use ```eventLoop()``` to receive message notifications.

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

Supports sending functions.

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

When the ```postMessage()``` function is called in a thread's execution function to send signals or data, it generates a message event. You can use the ```eventLoop()``` function to receive message notifications.

Each thread's message queue holds at most 10240 messages and 32 MB in total; when either limit is reached, the oldest messages are dropped and a warning is printed. The receiving thread should call ```peekMessage()``` regularly to take messages off the queue.

See also: `peekMessage`, `join`, `terminate`, `getData`, `setData`, `id`, `name`, `eventLoop`

##### join

```
join()
join(timeout)
```

The ```join()``` function is used to wait for a thread to exit and reclaim system resources.

Parameters:

- `timeout` (number, optional): The ```timeout``` parameter is used to set the timeout for waiting for the thread to end, in milliseconds. When the ```timeout``` parameter is set to 0 or the ```timeout``` parameter is not set, the ```join()``` function will block until the thread finishes execution. When the ```timeout``` parameter is set to -1, the ```join()``` function will return immediately.

Returns (```ThreadRet``` object): The [```ThreadRet``` object](/syntax-guide/struct/otherstruct/thread.join-return) contains data related to the execution result, including the following properties:

- id: Thread ID.
- terminated: Whether the thread was forcibly terminated.
- elapsed: The running time of the thread (nanoseconds).
- ret: The return value of the thread function.

Test ```join()``` function timeout and output the return value.

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

When the ```join()``` function times out, it returns ```undefined```.

See also: `peekMessage`, `postMessage`, `terminate`, `getData`, `setData`, `id`, `name`, `eventLoop`

##### terminate

```
terminate()
```

The ```terminate()``` function is used to forcibly terminate a thread and release the hardware resources occupied when the thread was created.

Forcibly terminate the execution of a thread. After forcibly terminating the thread, the content output by that thread will no longer be displayed in the logs.

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

For threads forcibly terminated using the ```terminate()``` function, the ```join()``` function can no longer be used to wait for their completion.

See also: `peekMessage`, `postMessage`, `join`, `getData`, `setData`, `id`, `name`, `eventLoop`

##### getData

```
getData()
getData(key)
```

The ```getData()``` function is used to access variables recorded in the thread environment. The data is valid when the thread has not executed the ```join()``` function (waiting for successful exit) and has not executed the ```terminate()``` function (forcibly terminating the thread).

Parameters:

- `key` (string, required): The ```key``` parameter is the key name of the stored key-value pair.

Returns (string / number / bool / object / array / any (any type supported by the platform)): The ```getData()``` function returns the key value corresponding to the ```key``` parameter in the key-value pairs stored in the current thread environment.

Record a value with the key name ```count``` in the concurrent thread environment, then read the key value of ```count``` in the main thread.

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

The ```setData()``` function is used to store variables in the thread environment.

Parameters:

- `key` (string, required): The ```key``` parameter is used to specify the key name of the key-value pair to be stored.
- `value` (string / number / bool / object / array / function / any (any type supported by the platform), required): The ```value``` parameter is used to specify the key value of the key-value pair to be stored.

Set a key-value pair in a concurrent thread and read the key-value pair in the main thread.

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

Supports passing functions as key values.

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

Data remains valid as long as the thread has not executed the ```join()``` function (waiting for successful exit) and has not executed the ```terminate()``` function (forcibly terminating the thread). The ```value``` parameter must be a serializable variable.

See also: `peekMessage`, `postMessage`, `join`, `terminate`, `getData`, `id`, `name`, `eventLoop`

##### id

```
id()
```

The ```id()``` function is used to return the ```threadId``` of the current multi-threaded object instance.

Returns (number): The ```id()``` function returns the ```threadId```.

Create a concurrently running thread and output the ```threadId``` of that concurrent thread in the main thread.

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

The ```name()``` function is used to return the name of the current multi-threaded object instance.

Returns (string): The ```name()``` function returns the name of the concurrent thread.

Create a concurrently running thread and output the name of that concurrent thread in the main thread.

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

The ```eventLoop()``` function is used to listen for events received by the current thread.

Parameters:

- `timeout` (number, optional): The ```timeout``` parameter is used to set the timeout duration, in milliseconds. If ```timeout``` is set to 0, it blocks and waits indefinitely, returning only when an event occurs; if greater than 0, it sets the timeout duration for waiting for an event; if less than 0, it returns the most recent event immediately.

Returns (object / null): The ```eventLoop()``` function returns the event information received by the current thread. For details, see [Event Information Structure](/syntax-guide/struct/otherstruct/eventloop-return).

Concurrently execute 3 threads, outputting the received event information; when a timeout occurs or it returns immediately, the output is null.

```javascript
function main() {
    var t1 = threading.Thread(function() {
        while (true) {
            var eventMsg = threading.currentThread().eventLoop()     // Block and wait
            // 2024-11-14 10:14:18 thread1 eventMsg: {"Seq":1,"Event":"thread","ThreadId":0,"Index":1,"Queue":0,"Nano":1731550458699947000}
            Log(_D(), "thread1 eventMsg:", eventMsg)
        }
    })

    var t2 = threading.Thread(function() {
        while (true) {
            var eventMsg = threading.currentThread().eventLoop(-1)   // Return immediately
            Log(_D(), "thread2 eventMsg:", eventMsg)
            Sleep(5000)
        }
    })

    var t3 = threading.Thread(function() {
        while (true) {
            var eventMsg = threading.currentThread().eventLoop(3000) // Set a 3-second timeout
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

The processing mechanism of the ```eventLoop()``` function is consistent with that of the global function ```EventLoop()```.

See also: `peekMessage`, `postMessage`, `join`, `terminate`, `getData`, `setData`, `id`, `name`

#### ThreadLock

Thread lock object for multi-threaded synchronization processing.

##### acquire

```
acquire()
```

The ```acquire()``` function is used to request a thread lock (acquire lock).

Please refer to the ```threading.Lock()``` section for examples.

The ```acquire()``` function is used to request a thread lock. When a thread calls the ```acquire()``` function of a thread lock object, it attempts to acquire the lock. If the lock is not currently held by another thread, the calling thread will successfully acquire the lock and continue execution. If the lock is already held by another thread, the thread calling ```acquire()``` will be blocked until the lock is released.

See also: `Lock`, `release`

##### release

```
release()
```

The ```release()``` function is used to release a thread lock (unlock).

Test deadlock scenario

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

Note that improper use of thread locks may cause deadlocks.

See also: `Lock`, `acquire`

#### ThreadEvent

Event object for event notification and signal passing between multiple threads.

##### set

```
set()
```

The ```set()``` function is used to set an event signal.

Please refer to the examples in the ```threading.Event()``` section.

If the event has already been set via ```set()```, it cannot be set again. You need to call the clear operation first before resetting the signal.

See also: `clear`, `wait`, `isSet`

##### clear

```
clear()
```

The ```clear()``` function is used to clear the signal.

Please refer to the example in the ```threading.Event()``` section.

See also: `set`, `wait`, `isSet`

##### wait

```
wait()
wait(timeout)
```

The ```wait()``` function is used to set event (signal) waiting, which will block until the event (signal) is set; supports setting timeout parameters.

Parameters:

- `timeout` (number, optional): The parameter ```timeout``` is used to set the waiting timeout period, in milliseconds.

Returns (bool): The ```wait()``` function returns whether a timeout occurred, returning true if a timeout occurs.

Test the return value of the ```wait()``` function.

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

The ```isSet()``` function is used to determine whether an event (signal) has been set.

Returns (bool): The ```isSet()``` function returns the set status of the event (signal); returns true if the event (signal) has been set.

Please refer to the examples in the ```threading.Event()``` section.

See also: `set`, `clear`, `wait`

#### ThreadCondition

Condition variable object used for implementing synchronization and communication between multiple threads.

##### notify

```
notify()
```

The ```notify()``` function is used to wake up one waiting thread (if any exists). Only threads that have called the ```wait()``` method can be awakened.

Use the ```notify()``` function to wake up waiting threads.

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

The ```notify()``` function wakes up one thread in the waiting queue.

When the ```notify()``` function wakes up a thread, that thread will reacquire the thread lock.

See also: `notifyAll`, `wait`,  `acquire`, `release`

##### notifyAll

```
notifyAll()
```

The ```notifyAll()``` function is used to wake up all waiting threads.

For examples, please refer to the ```ThreadCondition.notify()``` section.

The ```notifyAll()``` function wakes up all threads in the waiting state one by one, and the awakened threads will reacquire the thread lock.

See also: `notify`, `wait`,  `acquire`, `release`

##### wait

```
wait()
```

The ```wait()``` function is used to put a thread into a waiting state under specific conditions.

For examples, please refer to the content in the ```ThreadCondition.notify()``` section.

The ```wait()``` function releases the thread lock and will reacquire the thread lock when the thread is awakened.

See also: `notify`, `notifyAll`, `acquire`, `release`

##### acquire

```
acquire()
```

The ```acquire()``` function is used to request a thread lock (acquire lock).

For examples, please refer to the content in the ```ThreadCondition.notify()``` section.

The thread lock of the current condition object must be requested (acquired) before calling ```wait()```.

See also: `notify`, `notifyAll`, `wait`,  `release`

##### release

```
release()
```

The ```release()``` function is used to release the thread lock (unlock).

For examples, please refer to the content in the ```ThreadCondition.notify()``` section.

After calling ```wait()```, you need to release the thread lock (unlock) of the current condition object.

See also: `notify`, `notifyAll`, `wait`,  `acquire`

#### ThreadDict

Thread-safe dictionary object for data sharing in multi-threaded environments.

##### get

```
get(key)
```

The ```get()``` function is used to retrieve the value of a key recorded in a dictionary object.

Parameters:

- `key` (string, required): The ```key``` parameter is used to specify the key name to retrieve.

Returns (string / number / bool / object / array / any (any type supported by the platform)): The ```get()``` function returns the value corresponding to the key specified by the ```key``` parameter.

Use event objects to notify threads to read and modify data.

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

The ```set()``` function is used to set key-value pairs.

Parameters:

- `key` (string, required): The ```key``` parameter is used to specify the key name to be set.
- `value` (string / number / bool / object / array / function / any (any type supported by the platform), required): The ```value``` parameter is used to specify the key value to be set.

Supports passing functions as key values.

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

A ```Server``` object is returned by `threading.Serve()` and represents a running service. It can be passed to other threads as an argument of the thread function, where the service can be inspected or closed.

##### addr

```
addr()
```

The ```addr()``` function returns the address and port the service actually listens on.

Returns (string): The listening address, such as ```127.0.0.1:8088``` or ```[::]:8089```; with port ```0``` it contains the port the system picked.

```javascript
function main() {
    // Port 0 picks a free port; addr() returns the actual address
    var server = threading.Serve("http://127.0.0.1:0", function (ctx) {
        Sleep(1000)
        ctx.write("done")
    })
    Log("listen on", server.addr())

    // Send a request from another thread while the main thread watches the server
    threading.Thread(function (addr) {
        Log("response:", HttpQuery("http://" + addr + "/"))
    }, server.addr())
    Sleep(200)
    Log("pending:", server.pending())  // 1: one request is being handled

    server.close()                      // Stop accepting connections; requests in flight run to completion
    Log("idle:", server.join(5000))     // true: the server is closed and every request has finished
}
```

See also: `close`, `stop`, `join`, `pending`, `Serve`

##### close

```
close()
```

The ```close()``` function stops accepting new connections; handlers already running finish normally (graceful shutdown).

```javascript
function main() {
    // Port 0 picks a free port; addr() returns the actual address
    var server = threading.Serve("http://127.0.0.1:0", function (ctx) {
        Sleep(1000)
        ctx.write("done")
    })
    Log("listen on", server.addr())

    // Send a request from another thread while the main thread watches the server
    threading.Thread(function (addr) {
        Log("response:", HttpQuery("http://" + addr + "/"))
    }, server.addr())
    Sleep(200)
    Log("pending:", server.pending())  // 1: one request is being handled

    server.close()                      // Stop accepting connections; requests in flight run to completion
    Log("idle:", server.join(5000))     // true: the server is closed and every request has finished
}
```

Calling it again has no effect. To wait for the running handlers, call ```join()``` afterwards.

See also: `addr`, `stop`, `join`, `pending`, `Serve`

##### stop

```
stop()
```

The ```stop()``` function closes the service (as ```close()```) and then terminates every handler thread that is still running.

```javascript
function main() {
    // Port 0 picks a free port; addr() returns the actual address
    var server = threading.Serve("http://127.0.0.1:0", function (ctx) {
        Sleep(1000)
        ctx.write("done")
    })
    Log("listen on", server.addr())

    // Send a request from another thread while the main thread watches the server
    threading.Thread(function (addr) {
        Log("response:", HttpQuery("http://" + addr + "/"))
    }, server.addr())
    Sleep(200)
    Log("pending:", server.pending())  // 1: one request is being handled

    server.close()                      // Stop accepting connections; requests in flight run to completion
    Log("idle:", server.join(5000))     // true: the server is closed and every request has finished
}
```

Handlers are ended the same way as `terminate`; responses they have not sent are lost.

See also: `addr`, `close`, `join`, `pending`, `Serve`

##### join

```
join()
join(timeout)
```

The ```join()``` function waits until the service is closed and no handler is running.

Parameters:

- `timeout` (number, optional): Timeout in milliseconds. Omitted or ```0``` waits indefinitely (it returns when the strategy stops).

Returns (bool): ```true``` when the service is closed and no handler is running; ```false``` on timeout.

```javascript
function main() {
    // Port 0 picks a free port; addr() returns the actual address
    var server = threading.Serve("http://127.0.0.1:0", function (ctx) {
        Sleep(1000)
        ctx.write("done")
    })
    Log("listen on", server.addr())

    // Send a request from another thread while the main thread watches the server
    threading.Thread(function (addr) {
        Log("response:", HttpQuery("http://" + addr + "/"))
    }, server.addr())
    Sleep(200)
    Log("pending:", server.pending())  // 1: one request is being handled

    server.close()                      // Stop accepting connections; requests in flight run to completion
    Log("idle:", server.join(5000))     // true: the server is closed and every request has finished
}
```

On a service that is still open, ```join()``` waits until it is closed, so call ```close()``` first.

See also: `addr`, `close`, `stop`, `pending`, `Serve`

##### pending

```
pending()
```

The ```pending()``` function returns the number of handlers currently running, i.e. connections or requests being handled.

Returns (number): The number of running handlers.

```javascript
function main() {
    // Port 0 picks a free port; addr() returns the actual address
    var server = threading.Serve("http://127.0.0.1:0", function (ctx) {
        Sleep(1000)
        ctx.write("done")
    })
    Log("listen on", server.addr())

    // Send a request from another thread while the main thread watches the server
    threading.Thread(function (addr) {
        Log("response:", HttpQuery("http://" + addr + "/"))
    }, server.addr())
    Sleep(200)
    Log("pending:", server.pending())  // 1: one request is being handled

    server.close()                      // Stop accepting connections; requests in flight run to completion
    Log("idle:", server.join(5000))     // true: the server is closed and every request has finished
}
```

See also: `addr`, `close`, `stop`, `join`, `Serve`

### Web3

A Web3 exchange object connects to an EVM or TRON chain node and reads and writes on-chain data through the commands of ```exchange.IO()```: calling contracts after registering their ABI, encoding and decoding, signing, batched reads, event logs, sending transactions and managing nonces. Each page in this category is written as ```exchange.IO("command", ...)```, where the first argument is the command name.

To swap tokens on a decentralized exchange, use the Uniswap exchange object instead (see the Uniswap category): it supports the standard functions such as ```exchange.GetTicker()``` and ```exchange.CreateOrder()```.

#### exchange.IO("abi", ...)

```
exchange.IO(k, address, abiContent)
```

Forms:

- `exchange.IO("abi", ...)`

On the FMZ Quant Trading Platform, various blockchain-related functions and calls are mainly implemented through the ```exchange.IO()``` function. The following documentation describes the different calling methods of the ```exchange.IO()``` function separately by functionality. The ```exchange.IO("abi", ...)``` calling method is used to register an ABI.

- Supports Ethereum (eth)

- Supports TRON (tron)

Parameters:

- `k` (string, required): The ```k``` parameter is used to specify the functionality of the ```exchange.IO()``` function. When set to ```"abi"```, it indicates that the function is used to register an ```ABI```.
- `address` (string, required): The ```address``` parameter is used to specify the address of the smart contract.
- `abiContent` (string, required): The ```abiContent``` parameter specifies the smart contract's ```ABI``` (a JSON string). A built-in template name can be passed instead: ```"weth"``` (the wrapped native coin's ```deposit``` and ```withdraw``` methods, aliases ```"wbnb"``` and ```"wrappedNative"```), ```"uniswapV3Pool"```, ```"uniswapV3Factory"```, ```"uniswapV3QuoterV2"```, ```"uniswapV3SwapRouter02"```, ```"uniswapV3PositionManager"``` and ```"permit2"```. The corresponding PancakeSwap V3 contracts use the same templates and can also be written as ```"pancakeV3Pool"```, ```"pancakeV3Factory"```, ```"pancakeV3QuoterV2"```, ```"pancakeV3SmartRouter"``` and ```"pancakeV3PositionManager"```, or with the generic aliases ```"v3Pool"```, ```"v3Factory"```, ```"v3QuoterV2"```, ```"v3Router"``` and ```"v3PositionManager"```. An unknown template name is an error.

```javascript
function main() {
    // register Uniswap SwapRouter02 abi
    var routerAddress = "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45"
    var abi = `[{"inputs":[{"components":[{"internalType":"bytes","name":"path","type":"bytes"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"uint256","name":"amountInMaximum","type":"uint256"}],"internalType":"struct IV3SwapRouter.ExactOutputParams","name":"params","type":"tuple"}],"name":"exactOutput","outputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"}],"stateMutability":"payable","type":"function"}]`

    // The abi only contains the exactOutput method portion; the complete abi can be found by searching online
    exchange.IO("abi", routerAddress, abi)
}
```

Register the Uniswap V3 position manager contract using a built-in template, and query the most recently added positions.

```javascript
function main() {
    var npm = "0xC36442b4a4522E871399CD717aBDD847Ab11FE88"   // Uniswap V3 position manager contract (Ethereum mainnet)
    // Pass the template name as the second parameter to use the built-in ABI of commonly used contracts
    exchange.IO("abi", npm, "uniswapV3PositionManager")
    // The template contains event definitions: query positions with increased liquidity in the most recent 100 blocks
    var logs = exchange.IO("logs", { address: npm, event: "IncreaseLiquidity", fromBlock: -100 })
    if (logs.length > 0) {
        var id = logs[logs.length - 1].args.tokenId
        var pos = exchange.IO("api", npm, "positions", id)
        Log("Position", id, "Owner:", exchange.IO("api", npm, "ownerOf", id))
        Log("Range tick:", pos.tickLower, "~", pos.tickUpper, "Liquidity:", pos.liquidity)
    }
}
```

If the smart contract method being called is a standard ERC20 method, there is no need to register the ABI.

The ```ABI``` content of a contract can be obtained via Etherscan's V2 API (an Etherscan API key is required, ```chainid``` is the chain ID); only the ```result``` field is needed, for example:
```url
https://api.etherscan.io/v2/api?chainid=1&module=contract&action=getabi&address=0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45&apikey=YourApiKey
```

When calling by method name, methods in the ABI registered for that address are matched first, followed by the built-in ERC20 methods; for overloaded methods with the same name, the full method signature must be used to distinguish them, for example ```"permit(address,((address,uint160,uint48,uint48),address,uint256),bytes)"```.

The built-in templates contain commonly used function and event definitions. The event definitions can be used together with ```exchange.IO("logs", ...)``` and ```exchange.IO("waitReceipt", ...)``` for decoding; the addresses of commonly used contracts can be obtained via ```exchange.IO("contracts", ...)```.

On TRON, calling a method of a contract whose ABI has not been registered reads the contract's ABI from the chain automatically and caches it; if the chain has none, an error is reported and the ABI must be registered manually with ```exchange.IO("abi", ...)```.

#### exchange.IO("api", blockChain, ...)

```
exchange.IO(k, blockChain, rpcMethod)
exchange.IO(k, blockChain, rpcMethod, ...args)
```

Forms:

- `exchange.IO("api", "eth", ...)`

The ```exchange.IO("api", "eth", ...)``` calling method is used to call Ethereum RPC methods (select eth when configuring the Web3 exchange object).
```exchange.IO("api", "tron", ...)``` calling method is used to call TRON RPC methods (select tron when configuring the Web3 exchange object).

Parameters:

- `k` (string, required): The ```k``` parameter is used to set the function of the ```exchange.IO()``` function. When set to ```"api"```, it indicates that the function is used to extend the call request.
- `blockChain` (string, required): The ```blockChain``` parameter is used to specify the blockchain network called by the ```exchange.IO()``` function. When set to ```"eth"```, it indicates calling RPC methods of the Ethereum network; when set to ```"tron"```, it indicates calling RPC methods of the TRON network.
- `rpcMethod` (string, required): The ```rpcMethod``` parameter is used to specify the RPC method to be called by the ```exchange.IO()``` function.
- `arg` (string / number / bool / object / array / function / any (any type supported by the platform), optional): The ```arg``` parameter is used to specify the parameters of the RPC method to be called.
```arg``` parameters can be multiple, and their type and number depend on the RPC method specified by the ```rpcMethod``` parameter.

Returns (string / number / bool / object / array / any (any type supported by the platform)): The ```exchange.IO("api", "eth", ...)``` function returns the return value of the called RPC method.

Query the ETH balance in the wallet:

```javascript
// Convert an on-chain integer amount into a human-readable amount. decimals is the token precision: 18 for ETH, 6 for USDT/USDC.
// Supports both decimal strings and hexadecimal strings prefixed with 0x: RPC methods such as eth_getBalance return hexadecimal strings prefixed with 0x.
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
    // "owner" needs to be replaced with the actual wallet address
    // The position of "latest" is the block parameter, with optional values: 'latest', 'earliest' or 'pending'. For details, see https://eth.wiki/json-rpc/API#the-default-block-parameter
    // The return value ethBalance is a hexadecimal string, for example: 0x9b19ce56113070
    var ethBalance = exchange.IO("api", "eth", "eth_getBalance", "owner", "latest")

    // The precision of ETH is 18, i.e. 1 ETH equals 1e18 of the smallest unit
    var ethDecimal = 18

    // On-chain amounts are all integers; converting to a human-readable amount requires shifting the decimal point according to the precision. The entire conversion involves no floating-point arithmetic,
    // so there is no loss of JavaScript numeric precision: 0x9b19ce56113070 is converted to 0.043656995388076145
    Log(toAmount(ethBalance, ethDecimal))
}
```

For ETH transfers, you can set the ```{gasPrice: 11, gasLimit: 111, nonce: 111}``` parameter according to your specific needs. This parameter is passed as the last argument of the ```exchange.IO()``` function. Options you do not need can be omitted. Note that a plain transfer without ```gasPrice``` is priced at a fixed 100 Gwei with a default ```gasLimit``` of 21000, so query the gas price with ```eth_gasPrice``` first and pass it in.

This parameter also supports the ```data``` and ```dryRun``` fields: ```data``` is arbitrary call data (a hexadecimal string starting with ```0x```), used to directly send the transaction ```{to, data, value}``` returned by APIs such as aggregators and Pendle; when ```data``` is set, the gas price and gasLimit are estimated by the node in the same way as for a contract call. When ```dryRun``` is set to ```true```, the transaction is only signed and not broadcast, and an object containing fields such as ```hash```, ```raw``` (the signed transaction), ```nonce```, and ```gasLimit``` is returned, which can be used to inspect the transaction content or to send it through another channel. For example: ```exchange.IO("api", "eth", "send", router, value, {data: calldata, dryRun: true})```. Before sending, you can first use ```exchange.IO("call", router, calldata, {value: value})``` to simulate the call. When ```nonce``` is not set, the system automatically assigns a nonce and keeps it in sync with the chain, so nonces are not reused when sending transactions consecutively; see ```exchange.IO("nonce", ...)``` for details. If a transaction remains unconfirmed on-chain for a long time, you can use ```exchange.IO("speedUp", ...)``` to resend it with a higher gas price, or use ```exchange.IO("cancelTx", ...)``` to cancel the transaction.

```javascript
// Human-readable amount -> on-chain integer amount (string). The decimal point is shifted purely via string operations, without any floating-point arithmetic,
// so amounts exceeding 2^53 do not lose precision either. When 17 or more significant digits are needed, pass amount as a string.
function toInnerAmount(amount, decimals) {
    var t = String(amount), d = Number(decimals) || 0
    var m = /^([0-9]*)(?:\.([0-9]*))?[eE]([+-]?[0-9]+)$/.exec(t)
    if (m) {   // Expand scientific notation: 0.0000001 is represented by JavaScript as 1e-7
        var digits = (m[1] || "") + (m[2] || ""), point = (m[1] || "").length + parseInt(m[3], 10)
        t = point <= 0 ? "0." + new Array(1 - point).join("0") + digits
            : point >= digits.length ? digits + new Array(point - digits.length + 1).join("0")
            : digits.slice(0, point) + "." + digits.slice(point)
    }
    var dot = t.indexOf("."), int = dot < 0 ? t : t.slice(0, dot)
    var frac = dot < 0 ? "" : t.slice(dot + 1)
    frac = frac.slice(0, d)                       // Decimal places beyond the precision are truncated directly
    while (frac.length < d) frac += "0"
    return (int + frac).replace(/^0+(?=[0-9])/, "")
}

function main() {
    // The precision unit of ETH is 1e18
    var ethDecimal = 18

    // Transfer amount (human-readable amount), e.g., 0.01 ETH
    var sendAmount = 0.01

    // Convert to the integer amount used on-chain: 0.01 -> "10000000000000000"
    var amount = toInnerAmount(sendAmount, ethDecimal)

    // "toAddress" is the ETH wallet address of the transfer recipient and must be filled in according to the actual situation; amount is the transfer amount
    exchange.IO("api", "eth", "send", "toAddress", amount)
}
```

Query ```gasPrice```:

```javascript
// The toAmount function is used to convert a hex-encoded value to a decimal value. Passing 0 for decimals means the decimal point is not shifted
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
    Log("gasPrice:", toAmount(gasPrice, 9), "gwei")   // The precision unit of gwei is 1e9
}
```

Call ```eth_estimateGas``` to estimate the Gas required for a transaction:

```javascript
// The toAmount function is used to convert a hexadecimal-encoded value to a decimal value
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
    // Encode the call to the approve (authorization) method
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

    // Gas fee = gasLimit * gasPrice. Both are large integers in wei, so multiply them using BigInt to avoid precision loss,
    // then convert by 1e18 into a human-readable ETH amount
    Log("gas fee", toAmount((BigInt(gasLimit) * BigInt(gasPrice)).toString(), 18))
}
```

When the second parameter of the ```exchange.IO()``` function is set to ```"eth"```, you can directly call the RPC methods supported by the Ethereum node server.

Node methods return the node's ```result``` as is. When the node returns ```null``` (for example ```eth_getTransactionReceipt``` for a transaction not yet mined), a null value is returned without an error; when the node returns an error, a null value is returned with the error in ```GetLastError()```, and a contract revert reason is decoded into readable text.

```exchange.IO("api", "eth", "send", toAddress, value[, options])``` sends native coin from the current wallet; ```value``` is an on-chain integer (wei), and the transaction hash is returned. A plain transfer without ```data``` is sent as a legacy transaction: without ```gasPrice``` it is priced at a fixed 100 Gwei (plus a tiny random amount), and without ```gasLimit``` the limit is 21000. That is usually too high on Ethereum mainnet, so query ```eth_gasPrice``` first and pass it in. With ```data``` the transfer is handled as a contract call: the gas limit is estimated by the node and the gas price is set the same way as for contract write methods (an EIP-1559 transaction on chains that support it; see ```exchange.IO("api", ...)```).

On TRON the second argument is ```"tron"``` and method names are case-insensitive, for example ```GetNowBlock```, ```GetAccount```, ```GetTransactionInfoByID``` and ```TRC20ContractBalance```. ```send``` takes the recipient address and the TRX amount (in sun, 1 TRX = 1000000 sun) and returns the transaction ID without ```0x```. Methods that need a signature (transfers, contract triggers and so on) are signed and broadcast automatically. Full-node endpoints that are not built in can be called with the path and request body directly: ```exchange.IO("api", "tron", "/wallet/endpointName", {body})```.

#### exchange.IO("encode", ...)

```
exchange.IO(k, dataFormat, ...args)
exchange.IO(k, address, dataFormat)
exchange.IO(k, address, dataFormat, ...args)
```

Forms:

- `exchange.IO("encode", ...)`

The ```exchange.IO("encode", ...)``` function is called in this way for data encoding.

Parameters:

- `k` (string, required): The ```k``` parameter is used to set the function of the ```exchange.IO()``` function. Setting it to ```"encode"``` means the function is used for data encoding.
- `address` (string, optional): The ```address``` parameter is used to set the address of the smart contract. When calling the ```exchange.IO("encode", ...)``` function, if the ```address``` parameter is passed, it means encoding the method call of the smart contract; if the ```address``` parameter is not passed, the function is used to encode data in the specified type order, which is functionally equivalent to ```abi.encode``` in ```Solidity```.
- `dataFormat` (string, required): The ```dataFormat``` parameter is used to specify the method, types, and order of the encoded data.
- `arg` (string / number / tuple / array / any (any type supported by the platform), optional): The ```arg``` parameter is used to specify the specific data values that match the ```dataFormat``` parameter.
```arg``` parameter can be more than one, and its type and number depend on the ```dataFormat``` parameter setting.

Returns (string): The ```exchange.IO("encode", ...)``` function returns the encoded data.

Taking the encoding of the ```unwrapWETH9``` method call as an example:

```javascript
function main() {
    // ContractV3SwapRouterV2 mainnet address : 0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45
    // Calling the unwrapWETH9 method requires registering the ABI first; the registration step is omitted here
    // "owner" represents the wallet address, which needs to be filled in with the actual address; 1 represents the unwrapping amount, i.e. unwrapping 1 WETH into ETH
    var data = exchange.IO("encode", "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45", "unwrapWETH9(uint256,address)", 1, "owner")
    Log(data)
}
```

An encoding example equivalent to ```abi.encode``` in ```Solidity```:

```javascript
function main() {
    var x = 10
    var address = "0x02a5fBb259d20A3Ad2Fdf9CCADeF86F6C1c1Ccc9"
    var str = "Hello World"
    var array = [1, 2, 3]
    var ret = exchange.IO("encode", "uint256,address,string,uint256[]", x, address, str, array)   // uint is uint256, the type length needs to be specified on FMZ
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

It supports encoding a tuple or a type order containing tuples. In this example, the type order consists of ```tuple``` and ```bytes```, so two more parameters need to be passed when calling ```exchange.IO()``` for encoding:
- 1. The variable corresponding to the tuple type:
  ```
  [30, 20, "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"]
  ```
  The values of the tuple are passed in as an array by position. The number, order, and types of the elements must be consistent with ```(uint256,uint8,address)``` in the ```types``` parameter. A literal tuple has no field names; when decoding, the fields are numbered sequentially by position as ```Field1```, ```Field2```, and so on.
- 2. The variable corresponding to the ```bytes``` type:
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

It supports encoding an array or a type order containing arrays:

```javascript
function main() {
    var path = ["0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2", "0xdac17f958d2ee523a2206206994597c13d831ec7"]   // ETH address, USDT address
    var ret = exchange.IO("encode", "address[]", path)
    Log("encode: ", ret)
}
```

The ```exchange.IO()``` function encapsulates the ```encode``` method, which can encode a function call into a ```hex``` string format and return it. To swap on Uniswap or PancakeSwap, use the `Uniswap` exchange object instead of encoding the calls yourself.

When encoding a smart contract method call, the method can be a name, a full method signature or a selector; standard ERC20 methods are built in, and other methods need their ABI registered first.

Returns a hex string without the ```0x``` prefix. Values of ```bytesN``` types can be given as a hex string (```0x``` prefix optional) or an array of byte values; ```address``` values can be TRON addresses starting with ```T```.

```exchange.IO("pack", ...)``` is an alias of ```exchange.IO("encode", ...)```.

#### exchange.IO("encodePacked", ...)

```
exchange.IO(k, dataFormat, ...args)
```

Forms:

- `exchange.IO("encodePacked", ...)`

The ```exchange.IO("encodePacked", ...)``` function is used to perform ```encodePacked``` encoding operations.

Parameters:

- `k` (string, required): The ```k``` parameter is used to set the functional mode of the ```exchange.IO()``` function. When set to ```"encodePacked"```, it indicates that the function performs data ```encodePacked``` encoding operations.
- `dataFormat` (string, required): The ```dataFormat``` parameter is used to specify the data type format and arrangement order for ```encodePacked``` encoding.
- `arg` (string / number / tuple / array / any (any type supported by the platform), required): The ```arg``` parameter is used to specify the specific data values that match the format of the ```dataFormat``` parameter.

There can be multiple ```arg``` parameters, and their type and quantity are determined by the settings of the ```dataFormat``` parameter.

Returns (string): The ```exchange.IO("encodePacked", ...)``` function returns a data string that has been processed with ```encodePacked``` encoding.

When using ```Uniswap V3```, parameters such as trading path need to be passed in, which requires the use of ```encodePacked``` encoding operations:

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

The ```exchange.IO("decode", ...)``` calling method is used to decode data.

Parameters:

- `k` (string, required): The ```k``` parameter is used to set the function of the ```exchange.IO()``` function. When set to ```"decode"```, it indicates that the function is used for data decoding.
- `dataFormat` (string, required): The ```dataFormat``` parameter is used to specify the types and order of the data to be decoded.
- `data` (string, required): The ```data``` parameter is the data to decode, a hex string with an optional ```0x``` prefix.

Returns (string / number / bool / object / array): When ```dataFormat``` has a single type, the decoded value is returned directly; with several types, an array is returned. Integers of ```uint64```/```int64``` width or narrower are numbers and wider ones are decimal strings; ```address``` is a lowercase address starting with ```0x``` (also on TRON); ```bytes``` is a hex string without ```0x```; fixed-size ```bytesN``` such as ```bytes32``` is an array of byte values; a literal tuple is an object keyed ```Field1```, ```Field2``` and so on.

The inverse operation of the ```exchange.IO("encode", ...)``` function:

```javascript
function main() {
    // A tuple is written in parentheses, with fields arranged by position; here is a three-field tuple plus a bytes parameter
    var types = "(uint256,uint8,address),bytes"

    // Tuple values are passed as an array by position
    var ret = exchange.IO("encode", types, [30, 20, "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"], "0011")
    Log("encode: ", ret)

    // Decoded result: [{"Field1":"30","Field2":20,"Field3":"0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"}, "0011"]
    // A literal tuple has no field names, so fields are numbered by position as Field1, Field2... To use meaningful field names,
    // you need to register the contract ABI first with exchange.IO("abi", ...), refer to the next example
    var rawData = exchange.IO("decode", types, ret)
    Log("decode:", rawData)
}
```

The following example first performs ```encodePacked``` encoding on the ```path``` parameter, because the ```exactOutput``` method call to be encoded later requires ```path``` as a parameter. Then it performs ```encode``` encoding on the ```exactOutput``` method of the router contract, which has only one parameter of type ```tuple```. The method name ```exactOutput``` is encoded as: ```0x09b81346```. Finally, the ```exchange.IO("decode", ...)``` method is used to decode according to ```(bytes,address,uint256,uint256)``` to obtain ```decodeRaw```, whose fields are numbered by position as ```Field1``` to ```Field4```, and the value of each field corresponds in order to the contents of the variable ```dataTuple```.

```javascript
function main() {
    // register SwapRouter02 abi
    var walletAddress = "0x398a93ca23CBdd2642a07445bCD2b8435e0a373f"
    var routerAddress = "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45"
    var abi = `[{"inputs":[{"components":[{"internalType":"bytes","name":"path","type":"bytes"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"uint256","name":"amountInMaximum","type":"uint256"}],"internalType":"struct IV3SwapRouter.ExactOutputParams","name":"params","type":"tuple"}],"name":"exactOutput","outputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"}],"stateMutability":"payable","type":"function"}]`
    exchange.IO("abi", routerAddress, abi)   // The abi only contains the partial content of the exactOutput method; the complete abi can be found by searching online

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

In terms of data processing, the ```exchange.IO()``` function supports not only encoding (encode) but also decoding (decode).

```exchange.IO("unpack", ...)``` is an alias of ```exchange.IO("decode", ...)```.

#### exchange.IO("hash", ...)

```
exchange.IO(k, algo, inputFormat, outputFormat, data)
exchange.IO(k, algo, inputFormat, outputFormat, data, keyFormat, key)
```

Forms:

- `exchange.IO("hash", ...)`

The ```exchange.IO("hash", ...)``` call computes hash digests and HMACs, signs with the private key configured on the exchange object, and so on. Its parameters are the same as those of the `Encode` function. On a Web3 exchange object it is commonly used for ```keccak256``` hashes, such as method selectors and EIP-712 digests.

Parameters:

- `k` (string, required): The ```k``` parameter sets the function of ```exchange.IO()```; ```"hash"``` means hashing, signing and similar computations.
- `algo` (string, required): The ```algo``` parameter is the algorithm:
- Digests: ```"md4"```, ```"md5"```, ```"sha1"```, ```"sha224"```, ```"sha256"```, ```"sha384"``` (same as ```"sha512.384"```), ```"sha512"```, ```"sha512.224"```, ```"sha512.256"```, ```"keccak256"``` (same as ```"sha3.keccak256"```), ```"sha3.keccak512"```, ```"sha3.224"```, ```"sha3.256"```, ```"sha3.384"```, ```"sha3.512"```, ```"ripemd160"```, ```"blake2b.256"```, ```"blake2b.512"```, ```"blake2s.128"```, ```"blake2s.256"```. With ```keyFormat``` and ```key```, an HMAC is computed (a keyed MAC for blake2s).
- ```"raw"```, ```"string"```: no computation, format conversion only.
- ```"sign"```: signs the 32-byte ```data``` with a secp256k1 private key and returns the 65-byte ```r‖s‖v```, where v is 0 or 1; without ```key```, the private key configured on the exchange object is used.
- ```"signTx"```: ```data``` is the JSON of a legacy transaction with the fields ```Nonce```, ```GasPrice```, ```GasLimit```, ```To```, ```Value```, ```Data``` and ```ChainId``` (field names are case-insensitive, missing numbers count as 0), optionally with a ```Key``` field giving the private key; the signed transaction is returned.
- ```"abi.type"```: ABI-encodes one value, for example ```"abi.uint256"``` or ```"abi.address"```.
- Also supported: ```"ed25519"``` (and ```"ed25519.seed"```, ```"ed25519.sha512"```) signing, ```"text.encoder.charset"``` and ```"text.decoder.charset"``` charset conversion, ```"aes.encrypt"``` and ```"aes.decrypt"``` (optionally with ```.cbc```, ```.ecb``` or ```.cfb```, cbc by default), ```"zlib"```, ```"gzip"```, ```"flate"```, ```"br"```, ```"zstd"``` and ```"lz4"``` followed by ```.deflate``` (compress) or ```.inflate``` (decompress), and ```"unzip"``` (returns an object keyed by file name).
- `inputFormat` (string, required): The format of ```data```: ```"raw"```, ```"string"``` (the bytes of the string), ```"hex"``` (```0x``` prefix optional), ```"base64"```, ```"base64.url"```, ```"base64.rawurl"```.
- `outputFormat` (string, required): The output format: ```"hex"``` (without ```0x```), ```"base64"```, ```"base64.url"```, ```"base64.rawurl"```, ```"raw"```, ```"string"``` (the output must be valid UTF-8 text).
- `data` (string, required): The data to process, parsed according to ```inputFormat```.
- `keyFormat` (string, optional): The format of ```key```, with the same values as ```inputFormat```.
- `key` (string, optional): The key: the HMAC key, the private key used by ```"sign"``` (for example its hex when ```keyFormat``` is ```"hex"```), or the ed25519 or AES key. Required for ```"ed25519"``` and ```"aes.*"```. An AES key is 16, 24 or 32 bytes; the IV is the first 16 bytes of the key and no padding is applied (cbc and ecb need data whose length is a multiple of 16).

Returns (string / object): Returns the result encoded according to ```outputFormat```; ```"unzip"``` returns an object keyed by file name. Returns a null value on failure, with the error in ```GetLastError()```.

Compute a method selector, an HMAC and an ABI encoding, and sign a hash with the configured private key.

```javascript
function main() {
    // Method selector: the first 4 bytes of keccak256("transfer(address,uint256)")
    var h = exchange.IO("hash", "keccak256", "raw", "hex", "transfer(address,uint256)")
    Log("selector:", "0x" + h.slice(0, 8))      // 0xa9059cbb

    // Hash hex data; the output has no 0x
    Log(exchange.IO("hash", "keccak256", "hex", "hex", "0x1234"))

    // HMAC-SHA256: the last two arguments are the key format and the key
    Log(exchange.IO("hash", "sha256", "string", "base64", "message", "string", "secret"))

    // ABI-encode a uint256
    Log(exchange.IO("hash", "abi.uint256", "string", "hex", "1000"))

    // Sign a 32-byte hash with the configured key: 65 bytes r‖s‖v, v is 0 or 1
    Log(exchange.IO("hash", "sign", "hex", "hex", h))
}
```

```python
def main():
    # Method selector: the first 4 bytes of keccak256("transfer(address,uint256)")
    h = exchange.IO("hash", "keccak256", "raw", "hex", "transfer(address,uint256)")
    Log("selector:", "0x" + h[:8])      # 0xa9059cbb

    # Hash hex data; the output has no 0x
    Log(exchange.IO("hash", "keccak256", "hex", "hex", "0x1234"))

    # HMAC-SHA256: the last two arguments are the key format and the key
    Log(exchange.IO("hash", "sha256", "string", "base64", "message", "string", "secret"))

    # ABI-encode a uint256
    Log(exchange.IO("hash", "abi.uint256", "string", "hex", "1000"))

    # Sign a 32-byte hash with the configured key: 65 bytes r‖s‖v, v is 0 or 1
    Log(exchange.IO("hash", "sign", "hex", "hex", h))
```

There must be 4 or 6 arguments (not counting ```"hash"```).

The signature returned by ```"sign"``` has v as 0 or 1, as in earlier versions; to get ```r```, ```s``` and ```v``` (v as 27 or 28) separately, or the EIP-2098 compact signature, for on-chain verification, use ```exchange.IO("sign", ...)```.

Works on both Ethereum (EVM) and TRON exchange objects.

#### exchange.IO("key", ...)

```
exchange.IO(k, key)
```

Forms:

- `exchange.IO("key", ...)`

The ```exchange.IO("key", ...)``` function is used to switch the private key calling method.

Parameters:

- `k` (string, required): The ```k``` parameter is used to set the function of ```exchange.IO()```. When set to ```"key"```, it indicates that the function is used to switch private keys.
- `key` (string, required): The ```key``` parameter is used to set the private key string.

```javascript
function main() {
    exchange.IO("key", "Private Key")   // "Private Key" represents the private key string, which needs to be filled in specifically
}
```

The ```exchange.IO()``` function supports private key switching functionality, allowing operations on multiple wallet addresses. You can also add multiple exchange objects (refer to: `exchanges`) to operate multiple wallet addresses.

For private key switching operations: ```exchange.IO("key", "xxx")```, concurrent switching is not supported.

The private key is a hex string with an optional ```0x``` prefix. An invalid key is reported as an error and nothing is switched. The key is only kept in memory and never written to the log; after switching, getting the address, signing and sending transactions all use the new key.

#### exchange.IO("sign", ...)

```
exchange.IO(k, hash)
exchange.IO(k, hash, key)
```

Forms:

- `exchange.IO("sign", ...)`

The ```exchange.IO("sign", ...)``` calling method is used to sign a 32-byte hash with a secp256k1 private key and returns signature data such as r, s, and v. It is suitable for scenarios that require off-chain signing, such as EIP-712 structured data signing (e.g., ERC-20 Permit approvals, 1inch limit orders).

Parameters:

- `k` (string, required): The ```k``` parameter is used to set the function of the ```exchange.IO()``` function. Setting it to ```"sign"``` indicates that the function is used to sign a hash.
- `hash` (string, required): The ```hash``` parameter is the 32-byte hash to be signed, formatted as a hexadecimal string; the ```0x``` prefix is optional. This function does not hash the ```hash``` again, so the EIP-712 digest must be computed in advance. Please refer to the example.
- `key` (string, optional): The ```key``` parameter is used to specify the private key used for signing. If it is not passed, the private key configured for the `exchange` exchange object is used.

Returns (object): The ```exchange.IO("sign", ...)``` function returns a signature object containing the following fields: ```r``` (32 bytes, hexadecimal string), ```s``` (32 bytes, hexadecimal string), ```v``` (numeric value, 27 or 28), ```signature``` (65 bytes ```r‖s‖v```, hexadecimal string), and ```vs``` (EIP-2098 compact signature, 32 bytes, hexadecimal string). Returns a null value if the call fails.

Taking the ERC-20 Permit (EIP-2612) authorization signature for USDC on Ethereum mainnet as an example: first read the on-chain parameters, use ```exchange.IO("encode", ...)``` and ```exchange.IO("hash", "keccak256", ...)``` to compute the EIP-712 digest, then use ```exchange.IO("sign", ...)``` to sign the digest, and finally simulate a call to the ```permit``` method of the USDC contract via ```eth_call``` to verify the signature (simulation only; no transaction is sent and no gas is consumed). Return values of type ```bytes32``` are returned as byte arrays; the example uses the ```bytesToHex``` function to convert them to hexadecimal strings.

```javascript
// Sign an EIP-2612 Permit for USDC on Ethereum mainnet, and have the USDC contract verify the signature via eth_call (simulation only; no transaction is sent and no gas is consumed)
var USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"      // USDC contract address on Ethereum mainnet
var SPENDER = "0x1111111254EEB25477B68fb85Ed929f73A960582"   // Spender address (example: 1inch Router v5)
var VALUE = "1000000"                                         // Allowance: 1 USDC (6 decimals)

// keccak256 → hex string prefixed with 0x. fmt = "raw" (treat as string) or "hex" (treat as hexadecimal data)
function keccak(fmt, data) {
    return "0x" + String(exchange.IO("hash", "keccak256", fmt, "hex", data)).replace(/^0x/, "")
}
function strip0x(h) { return String(h).replace(/^0x/, "") }
// Return values of type bytesN are byte arrays (consistent with previous versions); convert them to a hex string prefixed with 0x here
function bytesToHex(v) {
    if (typeof v === "string") return "0x" + strip0x(v).toLowerCase()
    return "0x" + v.map(function (b) { return ("0" + b.toString(16)).slice(-2) }).join("")
}
// Function selector + standard ABI-encoded arguments → calldata
function calldata(signature, types, values) {
    var args = exchange.IO.apply(exchange, ["encode", types].concat(values))
    return keccak("raw", signature).slice(0, 10) + strip0x(args)
}
// eth_call simulation: returns true on success, or the error reason on revert
function simulate(data) {
    var r = exchange.IO("api", "eth", "eth_call", { from: SPENDER, to: USDC, data: data }, "latest")
    return r === null ? GetLastError() : true
}

function main() {
    // 1. Register the required ABI fragments and read the on-chain parameters
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

    // 2. Compute the EIP-712 domain separator and compare it with the value returned by the contract's DOMAIN_SEPARATOR()
    var domainSeparator = keccak("hex", exchange.IO("encode", "bytes32,bytes32,bytes32,uint256,address",
        keccak("raw", "EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"),
        keccak("raw", name), keccak("raw", version), chainId, USDC))
    var onchain = bytesToHex(exchange.IO("api", USDC, "DOMAIN_SEPARATOR"))
    Log("domainSeparator:", domainSeparator, domainSeparator === onchain ? "matches on-chain value" : "does not match on-chain value: " + onchain)

    // 3. Permit struct hash → EIP-712 digest → signature
    var structHash = keccak("hex", exchange.IO("encode", "bytes32,address,address,uint256,uint256,uint256",
        keccak("raw", "Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline)"),
        owner, SPENDER, VALUE, nonce, deadline))
    var digest = keccak("hex", "1901" + strip0x(domainSeparator) + strip0x(structHash))
    var sig = exchange.IO("sign", digest)
    Log("digest:", digest)
    Log("sign:", sig)

    // 4. Have the USDC contract verify the signature: permit(owner, spender, value, deadline, v, r, s)
    Log("permit(v,r,s) simulation:", simulate(calldata(
        "permit(address,address,uint256,uint256,uint8,bytes32,bytes32)",
        "address,address,uint256,uint256,uint8,bytes32,bytes32",
        [owner, SPENDER, VALUE, deadline, sig.v, sig.r, sig.s])))

    // USDC v2.2 also provides an overloaded method that accepts a bytes-type signature: permit(owner, spender, value, deadline, signature)
    Log("permit(bytes) simulation:", simulate(calldata(
        "permit(address,address,uint256,uint256,bytes)",
        "address,address,uint256,uint256,bytes",
        [owner, SPENDER, VALUE, deadline, sig.signature])))

    // 5. Negative case: after tampering with the v value, the contract should reject the signature
    Log("simulation after tampering with v:", simulate(calldata(
        "permit(address,address,uint256,uint256,uint8,bytes32,bytes32)",
        "address,address,uint256,uint256,uint8,bytes32,bytes32",
        [owner, SPENDER, VALUE, deadline, sig.v === 27 ? 28 : 27, sig.r, sig.s])))
}
```

For EIP-712 typed data, ```exchange.IO("signTypedData", ...)``` can be used directly by passing domain, types and message, with no need to compute the digest yourself; for EIP-191 message signing use ```exchange.IO("signMessage", ...)```.

The returned ```s``` is always a low-s value (not greater than half of the curve order), which complies with the EIP-2 specification and can be used directly in verification scenarios such as OpenZeppelin ```ECDSA.recover```.

When a contract accepts the three parameters ```(v, r, s)``` (e.g., ERC-20 Permit's ```permit(owner, spender, value, deadline, v, r, s)```), use the ```v```, ```r```, and ```s``` fields; when it accepts ```bytes signature```, use the ```signature``` field; when it accepts an EIP-2098 compact signature ```(r, vs)``` (e.g., the 1inch Limit Order Protocol), use the ```r``` and ```vs``` fields.

```exchange.IO("hash", "sign", ...)``` can also sign a 32-byte hash, but it returns the concatenated 65-byte data with v being 0 or 1, consistent with the behavior of previous versions; for on-chain verification scenarios such as EIP-712, it is recommended to use ```exchange.IO("sign", ...)```.

A ```hash``` that is not 32 bytes is an error. Signing does not depend on the chain and works on a TRON exchange object as well.

#### exchange.IO("signTypedData", ...)

```
exchange.IO(k, typedData)
exchange.IO(k, typedData, key)
exchange.IO(k, domain, types, message)
exchange.IO(k, domain, types, message, key)
```

Forms:

- `exchange.IO("signTypedData", ...)`

The ```exchange.IO("signTypedData", ...)``` calling method is used to sign structured data according to the EIP-712 standard. A single call completes the calculation of the type hash, domain separator, struct hash, and digest, and then signs it. It is suitable for scenarios such as ERC-20 Permit, Permit2, UniswapX, CoW, and 1inch limit orders.

Parameters:

- `k` (string, required): The ```k``` parameter is used to set the function of the ```exchange.IO()``` function. Setting it to ```"signTypedData"``` means using the function for EIP-712 signing.
- `typedData` (object, string, optional): The ```typedData``` parameter is an object containing ```domain```, ```types```, ```primaryType```, and ```message``` (i.e., the MetaMask ```eth_signTypedData_v4``` format; ```types``` may include ```EIP712Domain```). The JSON string of this object can also be passed in.
- `domain` (object, optional): The ```domain``` parameter is the EIP-712 domain, for example ```{name, version, chainId, verifyingContract}```. The calling method using the three parameters ```domain```, ```types```, and ```message``` is the same as ethers' ```signTypedData```: ```types``` does not need to include ```EIP712Domain``` (it is automatically derived from the fields present in ```domain```), and the primary type is the type that is not referenced by any other type.
- `types` (object, optional): The ```types``` parameter is the type definitions, for example ```{Permit: [{name: "owner", type: "address"}, ...]}```. Nested structs and arrays are supported.
- `message` (object, optional): The ```message``` parameter is the data to be signed. Large integers can be passed in as strings.
- `key` (string, optional): The ```key``` parameter is used to specify the private key used for signing. When this parameter is not passed, the private key configured for the `exchange` exchange object is used.

Returns (object): Returns a signature object with the same fields as the return value of ```exchange.IO("sign", ...)```: ```r```, ```s```, ```v``` (27 or 28), ```signature``` (65 bytes), and ```vs``` (EIP-2098 compact signature). In addition, it contains the ```digest``` field, which is the EIP-712 digest. Returns a null value when the call fails.

Sign a Permit for USDC on the Ethereum mainnet, and have the USDC contract verify the signature via ```exchange.IO("call", ...)```.

```javascript
function main() {
    var USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"      // Ethereum mainnet USDC
    var spender = "0x1111111254EEB25477B68fb85Ed929f73A960582"   // Spender (authorized party), fill in as needed
    var owner = exchange.IO("address")
    var deadline = Math.floor(Date.now() / 1000) + 3600

    // ethers style: domain, types (without EIP712Domain), message; the primary type is inferred automatically
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

    // Single-object style (MetaMask eth_signTypedData_v4 format) produces the same result
    var sig2 = exchange.IO("signTypedData", { domain: domain, types: types, primaryType: "Permit", message: message })
    Log("Both styles match:", sig.signature === sig2.signature)

    // Simulate USDC's permit with eth_call so the contract verifies the signature (no transaction is sent)
    var calldata = "0x" + String(exchange.IO("hash", "keccak256", "raw", "hex",
        "permit(address,address,uint256,uint256,uint8,bytes32,bytes32)")).replace(/^0x/, "").slice(0, 8) +
        exchange.IO("encode", "address,address,uint256,uint256,uint8,bytes32,bytes32",
            owner, spender, "1000000", deadline, sig.v, sig.r, sig.s)
    Log("permit simulation:", exchange.IO("call", USDC, calldata) !== null ? "Signature valid" : GetLastError())
}
```

An error is reported when ```message``` is missing a field from the type definitions; missing fields are not zero-filled and then signed.

The private key is used only inside the exchange object; strategy code cannot access the private key.

#### exchange.IO("signMessage", ...)

```
exchange.IO(k, message)
exchange.IO(k, message, key)
```

Forms:

- `exchange.IO("signMessage", ...)`

The ```exchange.IO("signMessage", ...)``` calling method is used to sign messages according to the EIP-191 standard (```personal_sign```). The signature result is consistent with ```signMessage``` of ethers and ```personal_sign``` of wallets, and is commonly used in scenarios such as DApp login and off-chain authentication.

Parameters:

- `k` (string, required): The ```k``` parameter is used to set the function of the ```exchange.IO()``` function. When set to ```"signMessage"```, it indicates that the function is used to sign a message.
- `message` (string, object, required): The ```message``` parameter is used to specify the message to be signed: when a string is passed in, it is signed using UTF-8 encoding; when raw bytes need to be signed, pass in an object in the format ```{hex: "0x..."}```.
- `key` (string, optional): The ```key``` parameter is used to specify the private key used for signing. When this parameter is not passed in, the private key configured for the `exchange` exchange object is used by default.

Returns (object): Returns a signature object whose fields are the same as the return value of ```exchange.IO("sign", ...)``` (```r```, ```s```, ```v```, ```signature```, ```vs```). In addition, it contains the ```digest``` field, which represents the EIP-191 message hash. Returns a null value when the call fails.

Sign a message and recover the signer address through the ecrecover precompiled contract.

```javascript
function main() {
    // Sign text using UTF-8 encoding (the result is consistent with ethers signMessage and wallet personal_sign)
    var sig = exchange.IO("signMessage", "hello fmz")
    Log("digest:", sig.digest, "signature:", sig.signature)

    // Raw bytes are passed in via {hex: ...}
    var sig2 = exchange.IO("signMessage", { hex: "0x68656c6c6f20666d7a" })
    Log("Consistent with text signature:", sig.signature === sig2.signature)

    // Use the ecrecover precompiled contract to recover the signer address; the result should match the current wallet address
    var ret = exchange.IO("call", "0x0000000000000000000000000000000000000001",
        "0x" + sig.digest.slice(2) + exchange.IO("encode", "uint8,bytes32,bytes32", sig.v, sig.r, sig.s))
    Log("Recovered address:", "0x" + String(ret).slice(-40), "Wallet address:", exchange.IO("address").toLowerCase())
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

The ```exchange.IO("api", ...)``` calling method is used to call methods of smart contracts.

Parameters:

- `k` (string, required): The ```k``` parameter is used to set the function of the ```exchange.IO()``` function. When set to ```"api"```, it indicates that the function is used to extend the call request.
- `address` (string, required): The ```address``` parameter is used to specify the address of the smart contract.
- `method` (string, required): The ```method``` parameter is used to specify the smart contract method to be called.
- `value` (number / string, optional): The ```value``` parameter is the amount of native coin sent with the call (an on-chain integer: wei on Ethereum, sun on TRON). It is only needed when the method's ```stateMutability``` is ```payable```, and goes before the method arguments; ```exchange.IO()``` decides whether it is needed from the ```stateMutability``` in the registered ABI, so ```nonpayable```, ```view``` and other methods take no ```value```. The ```stateMutability``` attribute can be looked up in the ABI.
- `arg` (string / number / bool / any (any type supported by the platform), optional): The ```arg``` parameter is used to specify the parameters of the smart contract method to be called.
There may be multiple ```arg``` parameters, and their types and number depend on the smart contract method to be called.
- `options` (object, optional): The ```options``` parameter holds the options for sending the transaction. It only applies to write methods and is passed as the last argument (recognized as options when there is one argument more than the method takes): ```gasLimit``` is the gas limit, estimated by the node (```eth_estimateGas```) when not set; ```gasPrice``` is the gas price, and setting it sends a legacy transaction; ```nonce``` sets the nonce, assigned automatically when not set; ```dryRun``` set to ```true``` only signs and does not broadcast. TRON only supports ```gasLimit```, which is the fee limit (feeLimit, in sun).

Returns (string / number / bool / object / array): For a read-only method (```view```, ```pure```), returns the decoded return value: a single return value is returned as is; several return values are returned as an object keyed by the output names, with unnamed outputs as ```ret0```, ```ret1``` and so on. Integers of ```uint64``` width or narrower are numbers and wider integers are decimal strings; ```address``` is a lowercase address starting with ```0x``` (an address starting with ```T``` on TRON); ```bytes``` is a hex string without ```0x```; fixed-size ```bytesN``` such as ```bytes32``` is an array of byte values (for example ```[17, 17, ...]```).

For a write method, returns the transaction hash (a string starting with ```0x``` on Ethereum, a transaction ID without ```0x``` on TRON); with ```dryRun```, returns an object containing ```hash```, ```raw``` (the signed transaction), ```from```, ```to```, ```value```, ```data```, ```nonce```, ```gasLimit```, ```chainId```, ```type```, ```gasPrice```, ```maxFeePerGas``` and ```maxPriorityFeePerGas```. Returns a null value on failure, with the error in ```GetLastError()```.

The ```decimals``` method is a ```constant``` method of ERC20 that does not consume gas and can be used to query the precision data of a token.
The ```decimals``` method has no parameters. Return value: the precision data of the token.

```javascript
function main(){
    var tokenAddress = "0x111111111117dC0aa78b770fA6A738034120C302"    // Contract address of the token, the token in this example is 1INCH
    Log(exchange.IO("api", tokenAddress, "decimals"))                  // Query and print the precision exponent of the 1INCH token, the result is 18
}
```

The ```allowance``` method is a ```constant``` method of ERC20 that does not consume gas and can be used to query the authorized allowance of a token for a certain contract address.
The ```allowance``` method requires 2 parameters: the first parameter is the wallet address, and the second parameter is the authorized address. Return value: the authorized allowance of the token.
```owner```: The wallet address, represented by the string "owner" in the example; a specific address needs to be filled in for actual use.
```spender```: The authorized contract address, represented by the string "spender" in the example; a specific address needs to be filled in for actual use, for example, it can be the ```Uniswap V3 router v1``` address.

```javascript
function main(){
    // Contract address of the token, the token in this example is 1INCH
    var tokenAddress = "0x111111111117dC0aa78b770fA6A738034120C302"

    // For example, if the query result is 1000000000000000000, dividing it by the token's precision unit 1e18 shows that the wallet bound to the current exchange object has authorized 1 1INCH to the spender address
    Log(exchange.IO("api", tokenAddress, "allowance", "owner", "spender"))
}
```

The ```approve``` method is a non-```constant``` method of ERC20 that consumes gas and is used to authorize a token operation allowance to a certain contract address.
The ```approve``` method requires 2 parameters: the first parameter is the authorized address, and the second parameter is the authorized allowance. Return value: txid.
```spender```: The authorized contract address, represented by the string "spender" in the example; a specific address needs to be filled in for actual use, for example, it can be the ```Uniswap V3 router v1``` address.
```0xde0b6b3a7640000```: The authorized amount, represented here as a hexadecimal string; the corresponding decimal value is 1e18, which divided by the token precision unit in the example (i.e., 1e18) means that 1 token is authorized.
The third parameter of the ```exchange.IO()``` function is passed the method name ```approve```, which can also be written in the form of a methodId, for example: "0x095ea7b3"; it can also be written as the full standard method name, for example: "approve(address,uint256)".

```javascript
function main(){
    // Contract address of the token, the token in this example is 1INCH
    var tokenAddress = "0x111111111117dC0aa78b770fA6A738034120C302"

    // Hexadecimal string of the authorized amount: 0xde0b6b3a7640000 , corresponding decimal value: 1e18 , 1e18 divided by the token's precision unit equals 1 token , so this means authorizing 1 token
    Log(exchange.IO("api", tokenAddress, "approve", "spender", "0xde0b6b3a7640000"))
}
```

The ```multicall``` method is a non-```constant``` method of ```Uniswap V3``` that consumes gas and is used for multi-path token swaps.
The ```multicall``` method may have multiple ways of passing parameters. For details, you can check the ABI containing this method. The ABI needs to be registered before calling this method. Return value: txid.
To swap on Uniswap or PancakeSwap, use the `Uniswap` exchange object instead of encoding the calls yourself.

The following uses pseudocode to describe some details:
```
exchange.IO("api", ContractV3SwapRouterV2, "multicall(uint256,bytes[])", value, deadline, data)
```

```ContractV3SwapRouterV2```: The router v2 address of Uniswap V3.
```value```: The amount of ETH to transfer; set it to 0 if the tokenIn token of the swap operation is not ETH.
```deadline```: ```deadline``` is a parameter of the ```multicall``` method, which can be set to (new Date().getTime() / 1000) + 3600, indicating that it is valid within one hour.
```data```: ```data``` is a parameter of the ```multicall``` method, i.e., the packed operation data to be executed. Similar to ```exchange.IO("api", "eth", "send", "toAddress", toAmount)```, the ```gasLimit/gasPrice/nonce``` settings of the method call can also be specified when calling the ```multicall``` method. Pseudocode is used again to describe this:

```
exchange.IO("api", ContractV3SwapRouterV2, "multicall(uint256,bytes[])", value, deadline, data, {gasPrice: 123456, gasLimit: 300000})
```

The ```{gasPrice: 11, gasLimit: 111, nonce: 111}``` parameter can be set according to specific needs, and it is passed in as the last parameter of the ```exchange.IO()``` function.
The ```nonce``` can be omitted to use the system default value; alternatively, ```gasLimit/gasPrice/nonce``` can all be left unset to use the system default values.

When ```dryRun: true``` is set in this parameter, the transaction is only signed and not broadcast, and an object containing fields such as ```hash``` and ```raw``` (the signed transaction) is returned. To confirm in advance whether the call will succeed, you can replace ```"api"``` with ```"call"``` and use ```exchange.IO("call", ...)``` to simulate the execution (no signing, no gas consumption). For details, see ```exchange.IO("call", ...)```.

```javascript
function main() {
    var ContractV3SwapRouterV2 = "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45"
    var tokenInName = "ETH"
    var amountIn = 0.01
    var options = {gasPrice: 5000000000, gasLimit: 300000, nonce: 100}   // This is only an example, set it according to the actual scenario
    var data = ""                                                       // The encoded data, an empty string here, set it according to the actual scenario
    var tx = exchange.IO("api", ContractV3SwapRouterV2, "multicall(uint256,bytes[])", (tokenInName == 'ETH' ? amountIn : 0), (new Date().getTime() / 1000) + 3600, data, options || {})
}
```

Read-only methods run through ```eth_call``` on the latest block; nothing is signed and no gas is spent.

Write methods are signed with the configured private key and broadcast. When ```gasPrice``` is not set, chains that support EIP-1559 get an EIP-1559 (type 2) transaction: the tip is the larger of the node's suggestion (```eth_maxPriorityFeePerGas```) and the median tip actually paid in the last 20 blocks (```eth_feeHistory```), and the max fee is ```2 × baseFee + tip```; chains without EIP-1559 are priced at the node's ```eth_gasPrice```.

When ```nonce``` is not set it is assigned automatically and kept in sync with the chain's pending count, so consecutive sends never reuse a nonce; see ```exchange.IO("nonce", ...)```. After sending, ```exchange.IO("waitReceipt", ...)``` waits for the transaction to be mined; if it stays unmined for a long time, ```exchange.IO("speedUp", ...)``` resends it with a higher fee and ```exchange.IO("cancelTx", ...)``` cancels it.

Quote methods declared ```nonpayable``` (such as Uniswap QuoterV2) are treated as write methods and signed and sent as transactions. To only get the return value, or to rehearse a write, simulate it with ```exchange.IO("call", ...)```.

#### exchange.IO("call", ...)

```
exchange.IO(k, address, method, ...args)
exchange.IO(k, address, calldata)
exchange.IO(k, address, calldata, options)
```

Forms:

- `exchange.IO("call", ...)`

The ```exchange.IO("call", ...)``` calling method simulates the execution of any smart contract method (including write methods that modify on-chain state) via ```eth_call```. The process does not sign or broadcast a transaction and consumes no gas, making it suitable for on-chain quoting, transaction dry runs, and checking whether a transaction can execute successfully.

Parameters:

- `k` (string, required): The ```k``` parameter is used to set the function of the ```exchange.IO()``` function. Setting it to ```"call"``` indicates that the function is used to simulate the execution of a contract method.
- `address` (string, required): The ```address``` parameter is used to specify the address of the smart contract.
- `method` (string, optional): The ```method``` parameter is used to specify the method to simulate. It can be a method name, a full method signature (e.g. ```"transfer(address,uint256)"```, used to distinguish overloaded methods), or a method selector. When using a method name, the contract ABI must first be registered via ```exchange.IO("abi", ...)``` (ERC20 standard methods are built in and do not require registration).
- `calldata` (string, optional): The ```calldata``` parameter is the complete call data (a hexadecimal string starting with ```0x```, consisting of the method selector and the encoded arguments), such as the transaction ```data``` returned by an aggregator API. When ```calldata``` is passed, no ABI registration is required and the function returns the raw return data.
- `args` (string, number, bool, object, array, any (platform supported type), optional): The ```args``` parameter holds the method arguments, laid out exactly as when calling a contract method with ```exchange.IO("api", ...)``` (for a ```payable``` method the first one is the amount of native coin sent), so replacing ```"api"``` with ```"call"``` rehearses the same call. The last argument can be an options object ```{from, value, block, gasLimit}```: ```from``` is the address to execute as (the configured wallet address by default, or the zero address when no private key is configured), ```value``` is the amount of native coin sent, ```block``` is the block to execute on (```"latest"``` by default; a block number or a tag such as ```"pending"``` can be given), and ```gasLimit``` is the gas limit for the execution.

Returns (string, number, bool, object, array): When called with a method name, returns the ABI-decoded return value (an object when there are multiple return values); when the method has no return value, returns ```true``` on successful execution. When called with ```calldata```, returns the raw return data (a hexadecimal string starting with ```0x```), which can be decoded using ```exchange.IO("decode", ...)```. When execution fails (the contract reverts), a null value is returned, and the failure reason given by the contract can be obtained via ```GetLastError()```.

Use Uniswap QuoterV2 to get a quote and simulate the execution of write operations.

```javascript
function main() {
    var WETH = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
    var USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
    var QUOTER = "0x61fFE014bA17989E743c5F6cB21bF9697530B21e"   // Uniswap V3 QuoterV2 (Ethereum mainnet)
    // The quote methods of QuoterV2 have a state mutability of nonpayable; when called with exchange.IO("api", ...), they are treated as write operations and a transaction is sent;
    // when called with exchange.IO("call", ...), the execution is only simulated: no signing, no broadcasting, and no gas consumed
    exchange.IO("abi", QUOTER, JSON.stringify([{
        type: "function", name: "quoteExactInputSingle", stateMutability: "nonpayable",
        inputs: [{ name: "params", type: "tuple", components: [
            { name: "tokenIn", type: "address" }, { name: "tokenOut", type: "address" },
            { name: "amountIn", type: "uint256" }, { name: "fee", type: "uint24" },
            { name: "sqrtPriceLimitX96", type: "uint160" }] }],
        outputs: [{ name: "amountOut", type: "uint256" }, { name: "sqrtPriceX96After", type: "uint160" },
            { name: "initializedTicksCrossed", type: "uint32" }, { name: "gasEstimate", type: "uint256" }]
    }]))
    // Quote: how much USDC 1 WETH can be swapped for in the 0.05% fee tier pool
    var q = exchange.IO("call", QUOTER, "quoteExactInputSingle", [WETH, USDC, "1000000000000000000", 500, 0])
    Log("amountOut:", q.amountOut, "gasEstimate:", q.gasEstimate)

    // Simulated write: execute transfer as the current wallet address; returns null if the balance is insufficient, and the revert reason returned by the contract can be obtained via GetLastError()
    var ok = exchange.IO("call", USDC, "transfer", "0x1111111254EEB25477B68fb85Ed929f73A960582", 1)
    Log("transfer simulation:", ok, GetLastError())
    // Use the from parameter to simulate the call as another address
    Log("simulation with specified from:", exchange.IO("call", USDC, "transfer", "0x1111111254EEB25477B68fb85Ed929f73A960582", 1,
        { from: "0x55FE002aefF02F77364de339a1292923A15844B8" }))
}
```

Use an aggregator (the KyberSwap public API) to complete the full workflow of getting a quote, building the transaction, simulating it, and sending it. When ```DRY_RUN``` is ```true```, the transaction is only signed and not broadcast.

```javascript
// Aggregator quote and swap example (using the KyberSwap public API, no key required): quote → build transaction → eth_call simulation → send
// When DRY_RUN = true, only sign without broadcasting
var DRY_RUN = true
var CHAIN = "ethereum"                                          // Chain name used by KyberSwap: ethereum / bsc / base / arbitrum …
var NATIVE = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"       // Native token address as defined by aggregator convention
var TOKEN_IN = NATIVE                                           // Sell: ETH
var TOKEN_OUT = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"    // Buy: USDC
var AMOUNT_IN = "10000000000000000"                             // 0.01 ETH (in the smallest unit)
var SLIPPAGE_BPS = 50                                           // 0.5%
// Sender address used for simulation: defaults to the current wallet; if the wallet balance is insufficient, the simulation will inevitably fail, so you can temporarily change it to an address holding the token, solely to verify whether the route can be executed
var SIMULATE_FROM = ""

var API = "https://aggregator-api.kyberswap.com/" + CHAIN + "/api/v1"
var HEADERS = { "x-client-id": "fmz-example", "Content-Type": "application/json" }

function getJSON(url, opts) {
    var r = JSON.parse(HttpQuery(url, opts || { headers: HEADERS }))
    if (r.code !== 0) throw "aggregator error: " + JSON.stringify(r)
    return r.data
}

// Before selling an ERC20 token, it must first be approved for the router contract; the native token requires no approval
function ensureAllowance(token, spender, amount) {
    if (token.toLowerCase() === NATIVE.toLowerCase()) return
    var owner = exchange.IO("address")
    var allowance = BigInt(exchange.IO("api", token, "allowance", owner, spender))
    if (allowance >= BigInt(amount)) return
    Log("Approve", token, "→", spender)
    var tx = exchange.IO("api", token, "approve", spender, amount, DRY_RUN ? { dryRun: true } : {})
    Log("approve:", DRY_RUN ? tx.hash + " (dryRun, not broadcast)" : tx)
}

function main() {
    var wallet = exchange.IO("address")

    // 1. Get a quote
    var route = getJSON(API + "/routes?tokenIn=" + TOKEN_IN + "&tokenOut=" + TOKEN_OUT + "&amountIn=" + AMOUNT_IN, { headers: HEADERS })
    var s = route.routeSummary
    Log("Quote:", s.amountIn, "→", s.amountOut, "(approx. $" + Number(s.amountOutUsd).toFixed(2) + "), gas≈" + s.gas)

    // 2. Build the transaction: the aggregator returns the router contract address, the calldata, and the amount of native token to attach
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
    Log("Router contract:", router, "| calldata", (built.data.length - 2) / 2, "bytes | value", value)

    // 3. Simulate: pass the complete calldata to IO("call") for execution, without signing or broadcasting; on failure, the revert reason given by the contract is returned
    var ret = exchange.IO("call", router, built.data, { from: from, value: value })
    if (ret === null) {
        Log("Simulation failed, not sending:", GetLastError())
        return
    }
    var decoded = exchange.IO("decode", "uint256,uint256", String(ret).replace(/^0x/, ""))
    Log("Simulation succeeded, actual amount out:", decoded[0], "(quoted", s.amountOut + ")")

    // 4. Send: approve (when selling an ERC20 token) → send the transaction with the calldata attached; gasLimit is set to 1.3x the estimated value
    ensureAllowance(TOKEN_IN, router, AMOUNT_IN)
    var opts = { data: built.data, gasLimit: Math.ceil(Number(built.gas || s.gas) * 1.3) }
    if (DRY_RUN) opts.dryRun = true
    var tx = exchange.IO("api", "eth", "send", router, value, opts)
    if (DRY_RUN) {
        Log("Signed (dryRun, not broadcast): hash", tx && tx.hash, "| nonce", tx && tx.nonce, "| type", tx && tx.type)
    } else {
        Log("Sent:", tx)
    }
}
```

The quoting methods of contracts such as Uniswap QuoterV2 are declared as ```nonpayable```. When called with ```exchange.IO("api", ...)```, they are treated as write operations, and a transaction is signed and sent. Therefore, ```exchange.IO("call", ...)``` should be used for quoting.

The contract revert reason is parsed into readable text: ```Error(string)``` returns the reason string, ```Panic(uint256)``` returns the error code and its meaning, and custom errors return the error selector and raw data.

When a transaction actually needs to be sent, ```exchange.IO("api", "eth", "send", toAddress, value, {data: calldata})``` can be used to send arbitrary call data; when ```dryRun: true``` is set, the transaction is only signed and not broadcast.

Currently only Ethereum (EVM) chains are supported; TRON is not supported.

#### exchange.IO("multicall", ...)

```
exchange.IO(k, calls)
exchange.IO(k, calls, options)
```

Forms:

- `exchange.IO("multicall", ...)`

The ```exchange.IO("multicall", ...)``` calling method is used to batch-read the results of multiple contract calls in a single request through the Multicall3 contract. It is suitable for batch querying balances, liquidity pool states, quotes, and other data, and can effectively reduce the number of RPC requests.

Parameters:

- `k` (string, required): The ```k``` parameter is used to set the function of the ```exchange.IO()``` function. When set to ```"multicall"```, it indicates that the function is used to batch-read contract call results.
- `calls` (array, required): The ```calls``` parameter is an array of calls. Each item in the array has the format ```[contract address, method, ...arguments]```, written in the same way as ```exchange.IO("call", ...)```, where the method can also be the complete call data (calldata). ```payable``` calls that attach native tokens are not supported.
- `options` (object, optional): The ```options``` parameter contains optional settings: when ```allowFailure``` is set to ```true```, failed calls return a null value; otherwise (by default), if any call fails, the entire result is a null value, and the index and reason of the failed call can be obtained through ```GetLastError()```. ```block``` is used to specify the block to read from (defaults to ```"latest"```; a negative number indicates an offset relative to the latest block). ```multicall``` is used to specify the Multicall3 contract address (defaults to ```0xcA11bde05977b3631167028862bE2a173976CA11```; this contract is deployed at this address on all mainstream EVM chains).

Returns (array): Returns an array of results in the same order as ```calls```. Each item is ABI-decoded and is identical to the result obtained by calling ```exchange.IO("call", ...)``` individually.

Read wallet balances and the Uniswap liquidity pool state simultaneously in a single request.

```javascript
function main() {
    var USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
    var WETH = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
    var POOL = "0x88e6A0c2dDD26FEEb64F039a2c41296FcB3f5640"   // Uniswap V3 USDC/WETH 0.05% pool
    var owner = exchange.IO("address")
    exchange.IO("abi", POOL, JSON.stringify([
        { type: "function", name: "slot0", stateMutability: "view", inputs: [], outputs: [
            { name: "sqrtPriceX96", type: "uint160" }, { name: "tick", type: "int24" },
            { name: "observationIndex", type: "uint16" }, { name: "observationCardinality", type: "uint16" },
            { name: "observationCardinalityNext", type: "uint16" }, { name: "feeProtocol", type: "uint8" },
            { name: "unlocked", type: "bool" }] },
        { type: "function", name: "liquidity", stateMutability: "view", inputs: [], outputs: [{ type: "uint128" }] }
    ]))

    // Each item is written the same way as exchange.IO("call", ...): [contract address, method, ...arguments], all read in a single request
    var ret = exchange.IO("multicall", [
        [USDC, "balanceOf", owner],
        [WETH, "balanceOf", owner],
        [POOL, "slot0"],
        [POOL, "liquidity"]
    ])
    Log("USDC balance:", ret[0], "WETH balance:", ret[1])
    Log("Pool tick:", ret[2].tick, "Liquidity:", ret[3])

    // By default, if any item fails, the entire result is null; when allowFailure is true, failed items are null
    var ret2 = exchange.IO("multicall", [[USDC, "decimals"], [USDC, "transfer", POOL, 1]], { allowFailure: true })
    Log("decimals:", ret2[0], "transfer (insufficient balance):", ret2[1])
}
```

All calls are executed against the same block state, so the returned results are consistent with one another.

Currently only Ethereum (EVM) chains are supported; TRON is not supported yet.

#### exchange.IO("logs", ...)

```
exchange.IO(k, query)
```

Forms:

- `exchange.IO("logs", ...)`

The ```exchange.IO("logs", ...)``` calling method is used to query the event logs of a contract (```eth_getLogs```) and decode them according to the ABI. It supports filtering by block range and by the indexed parameters of events, and can be used to monitor on-chain events such as trades, incoming transfers, and liquidity pool changes.

Parameters:

- `k` (string, required): The ```k``` parameter is used to set the function of the ```exchange.IO()``` function. When set to ```"logs"```, it indicates that the function is used to query event logs.
- `query` (object, required): The ```query``` parameter is used to set the query conditions: ```address``` is the contract address (a string or an array); ```event``` is the event name or the full event signature (for example, ```"Transfer(address,address,uint256)"```); ```filter``` is an object for filtering by indexed parameter names, and when a value is an array, it matches any one of the values in it; ```fromBlock``` and ```toBlock``` are used to specify the block range (they can be numbers or tags such as ```"latest"```; a negative number indicates an offset relative to the latest block, and both default to ```"latest"```); ```topics``` or ```blockHash``` can also be set directly.

Returns (array): Returns an array of logs. Each entry contains ```address``` (lowercase), ```blockNumber```, ```logIndex```, ```transactionIndex``` (numbers), ```transactionHash```, ```blockHash```, ```topics```, ```data``` and ```removed```, plus ```event``` (the event name) and ```args``` (the arguments) when it can be decoded by an ABI.

Query USDC transfer events and Swap events of a Uniswap liquidity pool.

```javascript
function main() {
    var USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
    var POOL = "0x88e6A0c2dDD26FEEb64F039a2c41296FcB3f5640"   // Uniswap V3 USDC/WETH 0.05% pool

    // The Transfer event of tokens is supported natively; a negative fromBlock indicates an offset relative to the latest block
    var transfers = exchange.IO("logs", { address: USDC, event: "Transfer", fromBlock: -2 })
    Log("USDC transfers in the last 3 blocks:", transfers.length, "entries")
    if (transfers.length > 0) {
        var t = transfers[0]
        Log(t.blockNumber, t.transactionHash, t.args.from, "→", t.args.to, t.args.value)
        // Filter by indexed parameters
        var mine = exchange.IO("logs", { address: USDC, event: "Transfer", fromBlock: -2, filter: { from: t.args.from } })
        Log("Same sender:", mine.length, "entries")
    }

    // For events of other contracts, the ABI containing the event must be registered first
    exchange.IO("abi", POOL, JSON.stringify([{ type: "event", name: "Swap", anonymous: false, inputs: [
        { indexed: true, name: "sender", type: "address" }, { indexed: true, name: "recipient", type: "address" },
        { indexed: false, name: "amount0", type: "int256" }, { indexed: false, name: "amount1", type: "int256" },
        { indexed: false, name: "sqrtPriceX96", type: "uint160" }, { indexed: false, name: "liquidity", type: "uint128" },
        { indexed: false, name: "tick", type: "int24" }] }]))
    var swaps = exchange.IO("logs", { address: POOL, event: "Swap", fromBlock: -20 })
    swaps.forEach(function (s) {
        Log("Swap block", s.blockNumber, "amount0:", s.args.amount0, "amount1:", s.args.amount1, "tick:", s.args.tick)
    })
}
```

The ```Transfer``` and ```Approval``` events of tokens are supported natively; for other events, the ABI containing the event must first be registered via ```exchange.IO("abi", ...)```.

When the node imposes limits on the block span of the query or the number of returned entries, the error message given by the node will be returned. In this case, you can narrow the block range and query in segments.

Currently only Ethereum (EVM) chains are supported; TRON is not supported.

#### exchange.IO("waitReceipt", ...)

```
exchange.IO(k, txHash)
exchange.IO(k, txHash, options)
```

Forms:

- `exchange.IO("waitReceipt", ...)`

The ```exchange.IO("waitReceipt", ...)``` calling method is used to wait for a transaction to be included on-chain and reach the specified number of confirmations, returning the transaction receipt and the decoded event logs.

Parameters:

- `k` (string, required): The ```k``` parameter is used to set the function of the ```exchange.IO()``` function. When set to ```"waitReceipt"```, the function is used to wait for a transaction receipt.
- `txHash` (string, required): The ```txHash``` parameter is the transaction hash (a 32-byte hexadecimal string starting with ```0x```), i.e., the value returned by ```exchange.IO("api", ...)``` when sending a transaction.
- `options` (object, optional): The ```options``` parameter holds optional settings ```{timeout, confirmations, interval}```: ```timeout``` is the maximum wait (milliseconds, 120000 by default, between 1000 and 600000), ```confirmations``` is the number of confirmations required (1 by default), and ```interval``` is the polling interval (milliseconds, 1500 by default, between 200 and 60000).

Returns (object): Returns the transaction receipt, retaining the original fields returned by the node, with the following processing applied: ```status``` is a number (1 indicates success, 0 indicates failure), ```blockNumber``` is a number, and fields such as ```gasUsed``` and ```effectiveGasPrice``` are decimal strings; ```events``` is an array of decoded events, where each element contains the ```address```, ```event```, ```args```, and ```logIndex``` fields; when the transaction execution fails, ```revertReason``` is the reason for the failure. If the transaction is still not on-chain after the timeout, a null value is returned, and the specific error message can be obtained through ```GetLastError()```.

After sending a transaction, wait for it to be included on-chain, then check the execution result and events.

```javascript
function main() {
    // After sending a transaction, you will get the transaction hash, for example:
    // var txHash = exchange.IO("api", "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", "approve", spender, amount)
    var txHash = "TX_HASH"     // The transaction hash to wait for

    // Wait up to 2 minutes until 2 confirmations are reached
    var rec = exchange.IO("waitReceipt", txHash, { timeout: 120000, confirmations: 2 })
    if (!rec) {
        Log("Wait failed:", GetLastError())
        return
    }
    if (rec.status !== 1) {
        Log("Transaction execution failed:", rec.revertReason)
        return
    }
    Log("Block:", rec.blockNumber, "gasUsed:", rec.gasUsed, "Gas price:", rec.effectiveGasPrice)
    // events contains the decoded events; the token Transfer/Approval events do not require ABI registration
    rec.events.forEach(function (e) {
        Log(e.address, e.event, JSON.stringify(e.args))
    })
}
```

Events are decoded according to the ABI registered through ```exchange.IO("abi", ...)```; the token ```Transfer``` and ```Approval``` events are supported natively and do not require registration. Logs without a matching ABI will not appear in ```events```; their raw data can be viewed in ```logs```.

Currently only Ethereum (EVM) chains are supported; TRON is not supported yet.

#### exchange.IO("nonce", ...)

```
exchange.IO(k)
exchange.IO(k, "sync")
exchange.IO(k, nonce)
```

Forms:

- `exchange.IO("nonce", ...)`

The ```exchange.IO("nonce", ...)``` function call is used to query, synchronize, or set the nonce counter used when sending transactions.

Parameters:

- `k` (string, required): The ```k``` parameter is used to set the functionality of the ```exchange.IO()``` function. When set to ```"nonce"```, the function is used to manage the nonce.
- `nonce` (string, number, optional): When this parameter is omitted, only the nonce status is queried. When ```"sync"``` is passed, the local record is resynchronized based on the pending count returned by the node. When a numeric value is passed, the next nonce in the local record is set to that value.

Returns (object): Returns a ```{address, latest, pending, local}``` object: ```latest``` is the number of transactions already confirmed on-chain; ```pending``` is the count returned by the node, including pending transactions; ```local``` is the next nonce in the local record (null if no transaction has been sent yet). All values are returned as strings.

Query the nonce status and resynchronize.

```javascript
function main() {
    // latest: number of transactions confirmed on-chain; pending: count seen by the node, including pending transactions; local: the next nonce to be used locally
    var st = exchange.IO("nonce")
    Log("Address:", st.address, "latest:", st.latest, "pending:", st.pending, "local:", st.local)
    if (Number(st.pending) > Number(st.latest)) {
        Log("There are", Number(st.pending) - Number(st.latest), "transactions not yet confirmed on-chain")
    }
    // After sending transactions from the same address elsewhere (wallet, other programs), you can manually resynchronize with the chain
    st = exchange.IO("nonce", "sync")
    Log("After sync, local:", st.local)
}
```

The nonce is assigned automatically when sending a transaction: the larger of the pending count returned by the node and the next nonce in the local record is used. If the node count is larger, it means the address has sent transactions elsewhere, so the node's value is used. If the local record is larger, it means transactions sent by yourself have not yet been detected by the node (for example, those sent through the private channel of ```exchange.IO("sendBase", ...)```), so the local value continues to be used; therefore, the nonce will not be reused when sending transactions consecutively. When the node returns a nonce-too-low error or a pending transaction already exists for that nonce, the system automatically resynchronizes and resends once. When the local record is ahead of the node and no new transaction has been confirmed on-chain for a long time (5 minutes), it is determined that an intermediate transaction has been dropped, and the nonce automatically falls back to the node's count.

The local record is only valid within the same exchange object (the same bot). When multiple bots share one wallet, they cannot access each other's records, so nonce conflicts may still occur. It is recommended that each bot use a separate wallet.

When sending a transaction, you can also set ```nonce``` in the last parameter of ```exchange.IO("api", ...)``` to specify the nonce manually.

Currently only Ethereum (EVM) chains are supported; TRON is not supported yet.

#### exchange.IO("speedUp", ...)

```
exchange.IO(k, txHash)
exchange.IO(k, txHash, options)
```

Forms:

- `exchange.IO("speedUp", ...)`

The ```exchange.IO("speedUp", ...)``` call is used to resend a stuck transaction (one that has not been mined for a long time) with a higher fee: the recipient address, amount, call data, and gas limit remain unchanged, and only the fee is increased.

Parameters:

- `k` (string, required): The ```k``` parameter is used to set the function of the ```exchange.IO()``` function. Setting it to ```"speedUp"``` indicates that the function is used to resend a transaction with a higher fee.
- `txHash` (string, required): The ```txHash``` parameter is the hash of the pending (not yet mined) transaction to be replaced. The transaction must have been sent from the current wallet.
- `options` (object, optional): The ```options``` parameter holds optional settings: ```multiplier``` is the fee multiplier, between 1.1 and 10, 1.125 by default; ```dryRun``` set to ```true``` only signs without sending and returns the replacement transaction (the same fields as ```exchange.IO("api", ...)``` with ```dryRun```, plus ```replaces```, the hash of the transaction being replaced).

Returns (string, object): Returns the hash of the replacement transaction; when ```dryRun``` is ```true```, returns the content of the replacement transaction.

Resend a transaction with a higher fee when it has not been mined within a certain period of time.

```javascript
function main() {
    var USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
    var spender = "0x1111111254EEB25477B68fb85Ed929f73A960582"
    var txHash = exchange.IO("api", USDC, "approve", spender, "1000000")
    Log("Sent:", txHash)
    var rec = exchange.IO("waitReceipt", txHash, { timeout: 30000 })
    if (!rec) {
        // Still not mined after 30 seconds: resend with a higher fee using the same nonce (tip and maxFee increased by at least 12.5%)
        txHash = exchange.IO("speedUp", txHash)
        Log("Sped up:", txHash)
        rec = exchange.IO("waitReceipt", txHash, { timeout: 30000 })
    }
    Log(rec ? "Mined, status: " + rec.status : "Still not mined: " + GetLastError())
}
```

The replacement transaction reuses the nonce of the original transaction. The fee is scaled up by ```multiplier``` (default value is 1.125, minimum value is 1.1; nodes require both the tip and maxFee of a replacement transaction to increase by at least 10%), and will not be lower than the current network's suggested value.

When the original transaction has already been mined, the node cannot find the original transaction (for example, it was sent through a private channel), or the original transaction was not sent from the current wallet, the function returns a null value and reports an error.

Currently only Ethereum (EVM) chains are supported; TRON is not supported yet.

Fee calculation: if the original is an EIP-1559 transaction, the tip is the larger of the original tip × ```multiplier``` and the current suggested tip, and the max fee is the larger of the original max fee × ```multiplier``` and ```2 × baseFee + tip```; if the original is a legacy transaction, the gas price is the larger of the original gas price × ```multiplier``` and the node's ```eth_gasPrice```. The recipient, amount, call data and gas limit are the same as the original's.

The original transaction is looked up on the node configured on the exchange object; when ```exchange.IO("sendBase", ...)``` is set, the replacement is broadcast through that node.

#### exchange.IO("cancelTx", ...)

```
exchange.IO(k, txHash)
exchange.IO(k, txHash, options)
```

Forms:

- `exchange.IO("cancelTx", ...)`

The ```exchange.IO("cancelTx", ...)``` calling method is used to cancel a transaction that has not yet been included on-chain: it sends a zero-amount transaction to yourself using the same nonce as the original transaction with a higher fee; once this transaction is included on-chain first, the original transaction becomes invalid.

Parameters:

- `k` (string, required): The ```k``` parameter is used to set the function of the ```exchange.IO()``` function. When set to ```"cancelTx"```, it indicates that the function is used to cancel a transaction.
- `txHash` (string, required): The ```txHash``` parameter is the hash of the transaction to be replaced that has not yet been included on-chain. The transaction must have been sent from the current wallet.
- `options` (object, optional): The ```options``` parameter holds optional settings: ```multiplier``` is the fee multiplier, between 1.1 and 10, 1.125 by default; ```dryRun``` set to ```true``` only signs without sending and returns the replacement transaction (the same fields as ```exchange.IO("api", ...)``` with ```dryRun```, plus ```replaces```, the hash of the transaction being replaced).

Returns (string, object): Returns the hash of the cancellation transaction; when ```dryRun``` is enabled, returns the content of the cancellation transaction.

Cancel a transaction that has been sent.

```javascript
function main() {
    var USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
    var spender = "0x1111111254EEB25477B68fb85Ed929f73A960582"
    var txHash = exchange.IO("api", USDC, "approve", spender, "1000000")
    Log("Sent:", txHash)
    // First use dryRun to check the fee of the replacement transaction (without sending)
    Log(JSON.stringify(exchange.IO("cancelTx", txHash, { dryRun: true, multiplier: 1.5 })))
    // This transaction is no longer needed: send a zero-amount transaction to yourself using the same nonce with a higher fee; it replaces the original transaction once it is included on-chain first
    var cancelHash = exchange.IO("cancelTx", txHash)
    Log("Cancellation transaction:", cancelHash)
}
```

The replacement transaction reuses the nonce of the original transaction, and the fee is scaled up by ```multiplier``` (default value is 1.125, minimum value is 1.1; nodes require both the tip and maxFee of the replacement transaction to be increased by at least 10%), and will not be lower than the current suggested value of the network.

The cancellation is not guaranteed to succeed: if the original transaction is included in a block first, the cancellation transaction will become invalid because the nonce has already been used.

When the original transaction has already been included on-chain, the node cannot find the original transaction (for example, when it was sent through a private channel), or the original transaction was not sent from the current wallet, the function returns a null value and reports an error.

Currently only Ethereum (EVM) chains are supported; TRON is not supported yet.

Fee calculation: if the original is an EIP-1559 transaction, the tip is the larger of the original tip × ```multiplier``` and the current suggested tip, and the max fee is the larger of the original max fee × ```multiplier``` and ```2 × baseFee + tip```; if the original is a legacy transaction, the gas price is the larger of the original gas price × ```multiplier``` and the node's ```eth_gasPrice```. The cancelling transaction uses a gas limit of 21000.

The original transaction is looked up on the node configured on the exchange object; when ```exchange.IO("sendBase", ...)``` is set, the replacement is broadcast through that node.

#### exchange.IO("toUnits", ...)

```
exchange.IO(k, amount, decimals)
```

Forms:

- `exchange.IO("toUnits", ...)`

The ```exchange.IO("toUnits", ...)``` function call is used to convert a human-readable amount into an on-chain integer. The entire conversion is performed as an exact calculation on strings, without any floating-point arithmetic.

Parameters:

- `k` (string, required): The ```k``` parameter is used to set the function of the ```exchange.IO()``` function. Setting it to ```"toUnits"``` indicates that the function is used to convert a human-readable amount into an on-chain integer.
- `amount` (string, number, required): The ```amount``` parameter is the human-readable amount, for example ```"1.5"```. It is recommended to pass it as a string to avoid precision issues with the JavaScript number type; scientific notation is not supported.
- `decimals` (number, string, required): The ```decimals``` parameter is the precision. You can pass a number (for example, 6 for USDC and 18 for ETH), or a token contract address, in which case the ```decimals()``` method of that token contract is called automatically to read the precision.

Returns (string): Returns the on-chain integer (as a decimal string). When the number of decimal places exceeds the precision, it returns a null value and reports an error instead of silently truncating.

Convert amounts of USDC and ETH.

```javascript
function main() {
    var USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
    // Human-readable amount -> on-chain integer; the precision can be a number or a token address (decimals is read automatically)
    Log(exchange.IO("toUnits", "1.5", 6))           // 1500000
    Log(exchange.IO("toUnits", "1.5", USDC))        // 1500000
    Log(exchange.IO("toUnits", "0.01", 18))         // 10000000000000000
    // On-chain integer -> human-readable amount
    Log(exchange.IO("fromUnits", "1500000", 6))     // 1.5
    var raw = exchange.IO("api", USDC, "balanceOf", exchange.IO("address"))
    Log("USDC balance:", exchange.IO("fromUnits", raw, USDC))
    // Reports an error when there are more decimal places than the precision, instead of silently truncating
    Log(exchange.IO("toUnits", "1.0000001", 6), GetLastError())
}
```

It is the inverse operation of ```exchange.IO("fromUnits", ...)```.

#### exchange.IO("fromUnits", ...)

```
exchange.IO(k, amount, decimals)
```

Forms:

- `exchange.IO("fromUnits", ...)`

The ```exchange.IO("fromUnits", ...)``` calling method is used to convert an on-chain integer value into a human-readable amount. The entire conversion is performed as exact string-based arithmetic without any floating-point operations, avoiding precision loss.

Parameters:

- `k` (string, required): The ```k``` parameter is used to set the function of the ```exchange.IO()``` function. When set to ```"fromUnits"```, it indicates that the function is used to convert an on-chain integer value into a human-readable amount.
- `amount` (string, number, required): The ```amount``` parameter is the on-chain integer value to be converted. It can be a decimal string, a hexadecimal string prefixed with ```0x```, or a number.
- `decimals` (number, string, required): The ```decimals``` parameter is used to specify the precision. You can pass a number (e.g., 6 for USDC, 18 for ETH) or a token contract address, in which case the ```decimals()``` method of that token contract will be called automatically to read the precision.

Returns (string): Returns the human-readable amount (a decimal string with trailing zeros removed).

Amount conversion for USDC and ETH.

```javascript
function main() {
    var USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
    // Human-readable amount -> on-chain integer; the precision can be passed as a number or as a token address (decimals is read automatically)
    Log(exchange.IO("toUnits", "1.5", 6))           // 1500000
    Log(exchange.IO("toUnits", "1.5", USDC))        // 1500000
    Log(exchange.IO("toUnits", "0.01", 18))         // 10000000000000000
    // On-chain integer -> human-readable amount
    Log(exchange.IO("fromUnits", "1500000", 6))     // 1.5
    var raw = exchange.IO("api", USDC, "balanceOf", exchange.IO("address"))
    Log("USDC balance:", exchange.IO("fromUnits", raw, USDC))
    // An error is reported when the number of decimal places exceeds the precision; no silent truncation occurs
    Log(exchange.IO("toUnits", "1.0000001", 6), GetLastError())
}
```

This is the inverse operation of ```exchange.IO("toUnits", ...)```.

#### exchange.IO("uniswapV3", ...)

```
exchange.IO(k, fn, ...args)
```

Forms:

- `exchange.IO("uniswapV3", ...)`

The ```exchange.IO("uniswapV3", ...)``` calling method is used for concentrated liquidity (Uniswap V3) related calculations, including conversions between tick, price, and sqrtPriceX96, as well as conversions between liquidity and token amounts. It is applicable to protocols that use the same formulas, such as Uniswap v3/v4, PancakeSwap v3, Aerodrome Slipstream, and SushiSwap v3.

Parameters:

- `k` (string, required): The ```k``` parameter is used to set the function of the ```exchange.IO()``` function. When set to ```"uniswapV3"```, it indicates that the function is used for concentrated liquidity calculations.
- `fn` (string, required): The calculation function to be called. The following functions are supported:
tickToPrice(tick, decimals0, decimals1): Calculates the price corresponding to the tick (the amount of token1 that 1 token0 can be exchanged for);
priceToTick(price, decimals0, decimals1[, tickSpacing]): Calculates the largest tick not higher than the given price; when tickSpacing is passed in, the result is rounded down to an integer multiple of it;
sqrtPriceToPrice(sqrtPriceX96, decimals0, decimals1): Converts the sqrtPriceX96 in the pool's slot0 to a price;
tickToSqrtPrice(tick): Calculates the sqrtPriceX96 corresponding to the tick (consistent with the result of the contract's TickMath.getSqrtRatioAtTick);
sqrtPriceToTick(sqrtPriceX96): Calculates the tick in which the sqrtPriceX96 is located (consistent with the result of the contract's TickMath.getTickAtSqrtRatio);
nearestUsableTick(tick, tickSpacing): Rounds the tick to the nearest integer multiple of tickSpacing;
amountsForLiquidity(sqrtPriceX96, tickLower, tickUpper, liquidity): Calculates the token amounts {amount0, amount1} corresponding to the liquidity within the range at the current price (consistent with the contract's calculation when removing liquidity);
liquidityForAmounts(sqrtPriceX96, tickLower, tickUpper, amount0, amount1): Calculates the maximum liquidity that can be provided without exceeding the given token amounts.
- `args` (string, number, required): The parameters of the calculation function. The precision parameters ```decimals0``` and ```decimals1``` can be passed in as numbers or as token addresses (in which case ```decimals()``` is called automatically to read the precision). Large integer parameters can be passed in as strings.

Returns (number, string, object): Price-related functions return numeric values (floating-point numbers, used for display and price level estimation); tick-related functions return integers; sqrtPriceX96, liquidity, and amount-related functions return decimal strings (exact values).

Read the price of a Uniswap V3 pool and calculate the token amounts required to provide liquidity around the current price.

```javascript
function main() {
    var C = exchange.IO("contracts")
    var T = C.tokens, U = C.uniswapV3
    exchange.IO("abi", U.factory, "uniswapV3Factory")
    var pool = exchange.IO("api", U.factory, "getPool", T.USDC.address, T.WETH.address, 500)
    exchange.IO("abi", pool, "uniswapV3Pool")
    var s = exchange.IO("api", pool, "slot0")
    // In this pool, token0 is USDC (6 decimals) and token1 is WETH (18 decimals): the price indicates how much WETH 1 USDC is worth
    var p = exchange.IO("uniswapV3", "sqrtPriceToPrice", s.sqrtPriceX96, 6, 18)
    Log("tick:", s.tick, "ETH price:", (1 / p).toFixed(2), "USDC")

    // Set the range to ±5% centered on the current price, with ticks rounded down to tickSpacing (10 for the 0.05% fee tier pool)
    var lower = exchange.IO("uniswapV3", "priceToTick", p * 0.95, 6, 18, 10)
    var upper = exchange.IO("uniswapV3", "priceToTick", p * 1.05, 6, 18, 10) + 10
    // The liquidity that can be provided when depositing at most 1000 USDC and 0.4 WETH, and the amounts actually used
    var liq = exchange.IO("uniswapV3", "liquidityForAmounts", s.sqrtPriceX96, lower, upper,
        exchange.IO("toUnits", "1000", 6), exchange.IO("toUnits", "0.4", 18))
    var used = exchange.IO("uniswapV3", "amountsForLiquidity", s.sqrtPriceX96, lower, upper, liq)
    Log("Range tick:", lower, "~", upper, "Liquidity:", liq)
    Log("Actual deposit:", exchange.IO("fromUnits", used.amount0, 6), "USDC +", exchange.IO("fromUnits", used.amount1, 18), "WETH")
}
```

The conversions between tick and sqrtPriceX96, and between liquidity and token amounts, are bit-for-bit ports of the contract's TickMath and LiquidityAmounts algorithms, and the calculation results are fully consistent with the on-chain contracts; price conversions use floating-point arithmetic and are subject to floating-point precision errors.

The token0 and token1 in a pool are sorted by contract address, and the price direction is the amount of token1 that 1 token0 can be exchanged for. You need to confirm the pool's ```token0``` before performing calculations.

#### exchange.IO("contracts", ...)

```
exchange.IO(k)
exchange.IO(k, chainId)
```

Forms:

- `exchange.IO("contracts", ...)`

The ```exchange.IO("contracts", ...)``` call is used to obtain commonly used contract addresses on the current chain (or a specified chain), including mainstream tokens, Multicall3, Permit2, as well as the Factory, router, QuoterV2, and position manager contracts of Uniswap V3 and PancakeSwap V3.

Parameters:

- `k` (string, required): The ```k``` parameter is used to set the functionality of the ```exchange.IO()``` function. When set to ```"contracts"```, it indicates that the function is used to obtain commonly used contract addresses.
- `chainId` (number, optional): The ```chainId``` parameter is used to specify the chain ID. If not passed, the chain of the current node is used by default. Currently supported chains: Ethereum (1), BNB Smart Chain (56), Base (8453), Arbitrum One (42161).

Returns (object): Returns ```{chainId, name, wrappedNative, tokens, multicall3, permit2, uniswapV3, pancakeV3}```: ```name``` is the chain name; ```wrappedNative``` is the wrapped native coin's key in ```tokens``` (such as ```"WETH"``` or ```"WBNB"```); each entry of ```tokens``` is ```{address, decimals}```; ```uniswapV3``` and ```pancakeV3``` contain ```factory```, ```router``` (SwapRouter02 for Uniswap, SmartRouter for PancakeSwap), ```quoterV2``` and ```positionManager```. An unsupported chain returns a null value and reports an error.

View the commonly used contract addresses of the current chain and use QuoterV2 to get a quote.

```javascript
function main() {
    // Get the commonly used contract address table of the current chain
    var C = exchange.IO("contracts")
    Log(C.name, "chainId:", C.chainId, "Wrapped native token:", C.wrappedNative)
    for (var sym in C.tokens) {
        Log(sym, C.tokens[sym].address, "decimals:", C.tokens[sym].decimals)
    }
    Log("Uniswap V3:", JSON.stringify(C.uniswapV3))

    // Use the addresses in the address table and the built-in ABI template to get a quote
    var quoter = C.uniswapV3.quoterV2
    exchange.IO("abi", quoter, "uniswapV3QuoterV2")
    var q = exchange.IO("call", quoter, "quoteExactInputSingle",
        [C.tokens.WETH.address, C.tokens.USDC.address, exchange.IO("toUnits", "1", 18), 500, 0])
    Log("1 WETH ≈", exchange.IO("fromUnits", q.amountOut, 6), "USDC")

    // View the address table of another chain
    Log("BSC PancakeSwap V3:", JSON.stringify(exchange.IO("contracts", 56).pancakeV3))
}
```

Every address in the address table has been verified on-chain: the contract code exists; the symbol and decimals of each token are consistent with the on-chain query results; the factory recorded in the router, quoter, and position manager contracts all point to the same Factory contract, and the wrapped native token/USDC liquidity pool can be queried.

When used together with the built-in templates of ```exchange.IO("abi", ...)```, these contracts can be called directly without manually writing the ABI.

Currently only Ethereum (EVM) chains are supported; TRON is not.

#### exchange.IO("address")

```
exchange.IO(k)
exchange.IO(k, key)
```

Forms:

- `exchange.IO("address")`

The ```exchange.IO("address")``` call returns the address of the wallet configured on the `exchange` object. When a private key is passed, it returns the wallet address of that key.

Parameters:

- `k` (string, required): The ```k``` parameter is used to set the function of ```exchange.IO()```. When set to ```"address"```, it indicates that the function is used to get the configured wallet address.
- `key` (string, optional): The ```key``` parameter is a private key (hex string, ```0x``` prefix optional); the wallet address of that key is returned. It does not switch the key used by the exchange object (use ```exchange.IO("key", ...)``` for that). When omitted, the configured private key is used.

Returns (string): Returns the wallet address: a lowercase address starting with ```0x``` on Ethereum (EVM), or an address starting with ```T``` on TRON. Returns a null value when the private key is invalid.

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

The ```exchange.IO("base", ...)``` calling method is used to set the RPC node address, and supports setting multiple nodes as backups for each other.

Parameters:

- `k` (string, required): The ```k``` parameter is used to specify the function of the ```exchange.IO()``` function. When set to ```"base"```, it indicates that the function is used to switch RPC nodes.
- `address` (string, array, optional): The ```address``` parameter is the node address. Ethereum (EVM) accepts ```http(s)://``` and ```ws(s)://``` addresses; to set several nodes, pass an array of addresses or a string separated by commas (spaces or newlines also work). TRON only accepts a single full-node HTTP address: the legacy gRPC addresses ```grpc.trongrid.io:50051```, ```grpc.nile.trongrid.io:50051``` and ```grpc.shasta.trongrid.io:50051``` are mapped to the corresponding HTTP addresses, and any other non-HTTP address is an error. When omitted, only the current node address is queried.

Returns (string): When setting, returns the node address in use before the change (a comma-separated string for several nodes); without ```address```, returns the current node address.

```javascript
function main() {
    var chainRpc = "https://bsc-dataseed.binance.org"
    exchange.IO("base", chainRpc)    // Switch to BSC chain
}
```

Set multiple nodes as backups for each other.

```javascript
function main() {
    // Multiple nodes as backups for each other: automatically switch to the next node when a node is unavailable or rate-limited; nodes whose chainId is inconsistent with the first node will not be used
    exchange.IO("base", ["https://bsc-dataseed.bnbchain.org", "https://bsc-rpc.publicnode.com"])
    Log("Node:", exchange.IO("base"))
    Log("Block height:", parseInt(exchange.IO("api", "eth", "eth_blockNumber"), 16))
}
```

When multiple nodes are set, the node that succeeded in the last request is used first. When a node encounters a connection failure, request timeout, HTTP 429 or 5xx status code, a response that is not in valid JSON-RPC format, or rate limiting, the system automatically switches to the next node. Normal JSON-RPC errors such as contract execution failure (revert) will not trigger node switching.

The chainId of each node is verified upon its first use. Nodes whose chain is inconsistent with that of the first available node will not be used, in order to avoid sending transactions to other chains. Node addresses in the logs only display the protocol and domain name, and do not include the API Key in the path.

The chain ID is fetched again after switching nodes. Multiple fallback nodes only apply to Ethereum (EVM); TRON does not support them.

#### exchange.IO("sendBase", ...)

```
exchange.IO(k)
exchange.IO(k, url)
```

Forms:

- `exchange.IO("sendBase", ...)`

The ```exchange.IO("sendBase", ...)``` call is used to set a node dedicated solely to broadcasting transactions. Once set, requests such as reading data, querying the nonce, and estimating gas still use the node configured for the exchange object, while signed transactions are sent only to this node. This feature is suitable for private transaction channels such as Flashbots Protect and MEV Blocker, and prevents transactions from being front-run or sandwich-attacked after entering the public mempool.

Parameters:

- `k` (string, required): The ```k``` parameter is used to set the function of the ```exchange.IO()``` function. When set to ```"sendBase"```, it indicates that the function is used to set the node for broadcasting transactions.
- `url` (string, optional): The ```url``` parameter is the JSON-RPC address of the node (supports the http or https protocol), for example ```"https://rpc.mevblocker.io"``` or ```"https://rpc.flashbots.net"```. Passing an empty string clears the setting and restores sending transactions through the node configured for the exchange object; when this parameter is not passed, only the current setting is queried.

Returns (string): Returns the send node address in effect before the setting; returns an empty string if it was not previously set.

Send transactions through MEV Blocker.

```javascript
function main() {
    // Read requests still go through the node configured for the exchange object; signed transactions are sent only to MEV Blocker
    var old = exchange.IO("sendBase", "https://rpc.mevblocker.io")
    Log("Previous send node:", old, "Current send node:", exchange.IO("sendBase"))
    // Subsequent transactions are all sent through the private channel, for example:
    // var txHash = exchange.IO("api", "eth", "send", toAddress, value)
    // Pass an empty string to clear the setting and restore sending from the configured node
    exchange.IO("sendBase", "")
}
```

Transactions sent through a private channel are not counted in the pending count of public nodes; when sending transactions consecutively, the local nonce record ensures that the nonce is not reused. For details, see ```exchange.IO("nonce", ...)```.

Requests sent to this node do not carry the authentication information (ApiKey) of the node configured for the exchange object.

It affects transactions sent by ```exchange.IO("api", ...)``` (transfers and contract writes) and the replacement transactions of ```exchange.IO("speedUp", ...)``` and ```exchange.IO("cancelTx", ...)```; nothing is sent with ```dryRun```.

Currently only Ethereum (EVM) chains are supported; TRON is not supported yet.

### Uniswap

A Uniswap exchange object connects to the Uniswap or PancakeSwap V2 and V3 pools on one chain (Ethereum, Arbitrum, Base, BNB Chain) and maps on-chain swaps onto the spot trading functions:

| Function | Behaviour on Uniswap |
| - | - |
| exchange.GetTicker() | Bid and ask are executable prices for about $1000; on-chain pools have no 24h statistics |
| exchange.GetDepth() | Derived from on-chain quotes at increasing sizes |
| exchange.GetTrades() | Recent on-chain trades of all pools of the pair |
| exchange.GetAssets() | Wallet balances of the native coin and of the tokens in the token table |
| exchange.CreateOrder() | Swaps on chain immediately: a limit price is the worst acceptable fill, market orders are protected by the slippage setting; a market buy is sized in the quote currency |
| exchange.GetOrder() | The order ID is the transaction hash; the state comes from the transaction receipt |
| exchange.CancelOrder() | Sends a replacement transaction with the same nonce; a mined transaction cannot be canceled |

```exchange.GetRecords()```, ```exchange.GetHistoryOrders()``` and ```exchange.GetTickers()``` are not supported. Pairs are written as ```ETH_USDC```; the native coin (ETH, BNB) and its wrapped token (WETH, WBNB) are different assets. The ```exchange.IO()``` commands below transfer funds, quote routes, simulate orders and tune swap parameters.

#### exchange.IO("transfer", ...)

```
exchange.IO(k, to, amount)
exchange.IO(k, to, amount, token)
```

Forms:

- `exchange.IO("transfer", ...)`

The ```exchange.IO("transfer", ...)``` call transfers the chain's native coin (such as ETH or BNB) or an ERC20 token out of the wallet configured on the Uniswap exchange object.

Parameters:

- `k` (string, required): The ```k``` parameter selects the function of ```exchange.IO()```. When set to ```"transfer"```, the function performs a transfer.
- `to` (string, required): The ```to``` parameter is the recipient address. It must be a 20-byte hexadecimal address starting with ```0x``` and must be on the same chain as the exchange object.
- `amount` (string / number, required): The ```amount``` parameter is the transfer amount in human-readable units (for example, ```"0.05"``` means 0.05 ETH). Pass it as a string where possible, because the function converts it exactly using the token's decimals. If the amount has more decimal places than the token supports, the function raises an error instead of silently truncating it. Set it to ```"all"``` to transfer the full balance. For the native coin, the function reserves the maximum fee for this transaction and transfers the rest of the balance. For a token, it transfers the entire token balance.
- `token` (string, optional): The ```token``` parameter sets the token to transfer. It can be a token name (such as ```"USDC"```), which must be a built-in token or one registered with ```exchange.IO("token", ...)```, or a token contract address. If you omit this parameter, the function transfers the native coin.

Returns (object / null): When the transaction is broadcast successfully, the function returns ```{txHash, from, to, token, tokenAddress, amount, raw}```. ```txHash``` is the transaction hash, ```amount``` is the amount transferred in human-readable units, and ```raw``` is the same amount as a decimal string in the smallest unit. ```tokenAddress``` is ```null``` when the native coin is transferred. The function only waits for the broadcast to finish. It does not wait for the transaction to be confirmed on-chain, so query the on-chain result with ```exchange.IO("receipt", ...)```. If the call fails, the function returns a null value, and you can get the reason with ```GetLastError()```.

Transfer ETH and USDC, then wait for the transaction to be confirmed on-chain.

```javascript
function main() {
    var TO = "0x收款地址"
    // Transfer 0.05 ETH; use "all" to transfer the full balance
    var r = exchange.IO("transfer", TO, "0.05")
    if (!r) {
        Log("转账失败:", GetLastError())
        return
    }
    Log("已发出", r.amount, r.token, "交易:", r.txHash)

    // Wait up to 3 minutes for on-chain confirmation
    var rc = exchange.IO("receipt", r.txHash, 180000)
    if (rc.pending) {
        Log("尚未上链")
    } else {
        Log("结果:", rc.status, "区块:", rc.blockNumber, "手续费:", rc.fee)
    }

    // Transfer 10 USDC
    var r2 = exchange.IO("transfer", TO, "10", "USDC")
    Log(r2 ? r2.txHash : GetLastError())
}
```

In the following cases, the function raises an error before signing and does not send a transaction: the address format is invalid, the recipient is the zero address, the recipient is the wallet itself, the amount is 0, the amount exceeds the balance, or the token is not registered.

When the full native-coin balance is transferred (```"all"```) on an EIP-1559 chain, the function reserves the maximum fee quoted for this transaction. The fee actually charged is lower than the reserved amount, so a tiny remainder stays in the wallet.

The priority fee (tip) is the higher of the node's suggested value and the median priority fee in recent blocks. This prevents a transaction from staying unconfirmed for a long time when the node suggests 0.

A transfer is a real on-chain transaction and cannot be reversed after it is sent. Before you transfer to an exchange deposit address, make sure the exchange supports deposits on that chain.

#### exchange.IO("receipt", ...)

```
exchange.IO(k, txHash)
exchange.IO(k, txHash, waitMs)
```

Forms:

- `exchange.IO("receipt", ...)`

When called as ```exchange.IO("receipt", ...)```, this function queries the receipt of a transaction sent by the Uniswap exchange object (such as an order or a transfer). It can also wait for the transaction to be confirmed on-chain.

Parameters:

- `k` (string, required): The ```k``` parameter selects what the ```exchange.IO()``` function does. Set it to ```"receipt"``` to query a transaction receipt.
- `txHash` (string, required): The ```txHash``` parameter is the transaction hash: a 32-byte hexadecimal string that starts with ```0x```, such as the ```txHash``` returned by ```exchange.IO("transfer", ...)```.
- `waitMs` (number, optional): The ```waitMs``` parameter is the maximum wait time in milliseconds. While the transaction is not yet on-chain, the function checks every 1.5 seconds and waits no longer than 10 minutes. If this parameter is omitted or set to 0, the function checks only once.

Returns (object): If the transaction is on-chain, the function returns ```{txHash, status, blockNumber, gasUsed, fee}```. ```status``` is either ```"success"``` or ```"reverted"```. ```fee``` is the fee actually paid, in the native coin and in human-readable units. If the transaction is still not on-chain when the wait time runs out, the function returns ```{txHash, pending: true, known}```. ```known``` shows whether the node can find the transaction. If the node can't find it, the transaction has usually been dropped or the hash is wrong.

Wait for a transaction to be confirmed on-chain.

```javascript
function main() {
    var txHash = "TX_HASH"     // Hash of the transaction to query
    var rc = exchange.IO("receipt", txHash, 120000)
    if (rc.pending) {
        Log("Not on-chain within 2 minutes; the node", rc.known ? "can find" : "cannot find", "this transaction")
        return
    }
    Log("Status:", rc.status, "Block:", rc.blockNumber, "gasUsed:", rc.gasUsed, "Fee:", rc.fee)
}
```

To check whether an order has been filled, use ```exchange.GetOrder()```. ```exchange.IO("receipt", ...)``` is mainly for checking transactions that are not orders, such as transfers.

#### exchange.IO("route", ...)

```
exchange.IO(k, symbol, side, qty)
```

Forms:

- `exchange.IO("route", ...)`

The ```exchange.IO("route", ...)``` call requests quotes on a Uniswap exchange object. It lists the quote for a swap on each candidate route and returns the best route. No order is placed.

Parameters:

- `k` (string, required): The ```k``` parameter sets what the ```exchange.IO()``` function does. When it is set to ```"route"```, the function requests quotes.
- `symbol` (string, required): The ```symbol``` parameter is the trading pair, for example ```"ETH_USDC"```.
- `side` (string, required): The ```side``` parameter is the trade direction. ```"sell"``` sells ```qty``` units of the base currency, and ```"buy"``` buys ```qty``` units of the base currency.
- `qty` (number, required): The ```qty``` parameter is the amount of the base currency.

Returns (object / null value): Returns ```{symbol, side, qty, best, quote, price, candidates}```. ```best``` is the best route. ```quote``` is the best quote: for a sell, the amount of quote currency received; for a buy, the amount of quote currency to be paid. ```price``` is the matching average execution price. ```candidates``` holds the quote for each candidate route, with each item in the format ```{route, quote}```. If a route cannot be quoted, its ```quote``` is ```null```. Returns a null value when no liquidity pool is available.

Compare the quotes on each route for selling 1 ETH.

```javascript
function main() {
    var r = exchange.IO("route", "ETH_USDC", "sell", 1)
    Log("最优路径:", r.best, "可得:", r.quote, "USDC")
    r.candidates.forEach(function (c) {
        Log(c.route, c.quote)
    })
}
```

Candidate routes include direct V3 pools at each fee tier, V2 pools, and two-hop routes through the wrapped native token (such as WETH) or through USDC/USDT. Routes are written as ```v3:WETH-500-USDC``` (a V3 pool where fee tier 500 means 0.05%), ```v2:WETH-USDC```, or ```v3:UNI-3000-USDT-100-USDC``` (a two-hop route).

V3 routes are quoted through the on-chain QuoterV2 contract, which fully simulates the whole swap. V2 routes are calculated locally from the pool reserves. Quotes do not include gas fees.

#### exchange.IO("simulate", ...)

```
exchange.IO(k, symbol, side, qty)
exchange.IO(k, symbol, side, qty, price)
exchange.IO(k, symbol, side, qty, price, stateOverride)
exchange.IO(k, symbol, side, qty, price, stateOverride, route)
```

Forms:

- `exchange.IO("simulate", ...)`

The ```exchange.IO("simulate", ...)``` call builds a swap transaction using the same order logic as the Uniswap exchange object (route selection, quoting and price protection). It only simulates execution on-chain (```eth_call```). The transaction is not signed or broadcast, and it uses no gas.

Parameters:

- `k` (string, required): The ```k``` parameter selects what the ```exchange.IO()``` function does. Set it to ```"simulate"``` to simulate placing an order.
- `symbol` (string, required): The ```symbol``` parameter is the trading pair, for example ```"ETH_USDC"```.
- `side` (string, required): The ```side``` parameter is the trade direction: ```"buy"``` or ```"sell"```.
- `qty` (number, required): The ```qty``` parameter is the order quantity. It means the same as the quantity parameter of ```exchange.CreateOrder()```. For a market buy order, it is the amount of quote currency to spend.
- `price` (number, optional): The ```price``` parameter is the limit price. If it is omitted or set to ```null```, the order is a market order.
- `stateOverride` (object, optional): The ```stateOverride``` parameter is a state override for the node's ```eth_call``` call (the geth state override set). Use it during simulation to temporarily give the wallet extra balance or token allowance, for example ```{"0xWalletAddress": {"balance": "0x56bc75e2d63100000"}}```. The override applies only to this simulation.
- `route` (string, optional): The ```route``` parameter limits the route type. Valid values are ```"v2"```, ```"v3"```, ```"hop"``` (two-hop) and ```"direct"``` (direct pool). If it is omitted, the best route among all routes is used.

Returns (object / null value): Returns ```{route, exactIn, amountIn, amountOut, quoted, executed, value, calls}```. ```quoted``` is the quoted amount when the order is placed. ```executed``` is the actual amount from the simulated execution: for exact input, the amount actually received; for exact output, the amount actually spent. Both are decimal strings in the token's smallest unit. If the limit price cannot be met, or the balance or allowance is too low and has not been covered by a state override, the function returns a null value and outputs an error message.

Temporarily add 100 ETH to the wallet and simulate selling 1 ETH.

```javascript
function main() {
    var ov = {}
    ov[exchange.IO("address")] = { balance: "0x56bc75e2d63100000" }
    var r = exchange.IO("simulate", "ETH_USDC", "sell", 1, null, ov)
    Log("路径:", r.route, "报价:", r.quoted, "模拟执行:", r.executed)
}
```

The simulation runs against the latest block state. The only difference from a real order is that the price may change before the transaction is actually included on-chain.

If the wallet balance is too low or the token has not been approved, the simulation fails with an error because the router contract's token transfer fails. In that case, use the ```stateOverride``` parameter to override the state.

#### exchange.IO("token", ...)

```
exchange.IO(k)
exchange.IO(k, name, address)
```

Forms:

- `exchange.IO("token", ...)`

The ```exchange.IO("token", ...)``` call is used to register a token on a Uniswap exchange object, or to list the token table. Once a token is registered, its name can be used directly in trading pairs.

Parameters:

- `k` (string, required): The ```k``` parameter specifies the function of ```exchange.IO()```. Setting it to ```"token"``` means the call is used to register a token.
- `name` (string, optional): The ```name``` parameter is the name used for the token in trading pairs, for example ```"UNI"```.
- `address` (string, optional): The ```address``` parameter is the token's contract address. The token's decimals (precision) are read automatically from the chain.

Returns (object / array / null value): When registering a token, returns ```{symbol, address, decimals}```. When the ```name``` and ```address``` parameters are omitted, returns the token table as an array in which each element is ```{symbol, address, decimals, native}```. ```native``` is ```true``` when the token is the chain's native coin. Returns a null value if the specified address is not an ERC20 token contract.

Register the UNI token, then query the ticker for the UNI_USDC trading pair.

```javascript
function main() {
    exchange.IO("token", "UNI", "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984")
    var t = exchange.GetTicker("UNI_USDC")
    Log("买一:", t.Buy, "卖一:", t.Sell)
}
```

Token names are resolved in this order: (1) the hand-checked built-in tokens (native coin, wrapped coin, USDC, USDT, the chain's BTC, etc.); (2) tokens registered with ```exchange.IO("token", ...)```; (3) the official token lists: the Uniswap Labs default list (tokens.uniswap.org) on Ethereum, Arbitrum and Base, and the PancakeSwap list (tokens.pancakeswap.finance) on BNB Chain (also consulted on Base). The connector ships a snapshot of the lists and fetches the latest lists once (at most once every 24 hours) when a name is not in the snapshot.

When the official lists contain several tokens with the same name on one chain (for example a bridged and a native version), the name cannot be used directly; the error message lists the candidate addresses, so specify the token by contract address. A listed token's decimals are checked against the contract on chain, and the token is refused when they differ.

A token that is not in the token table can also be used in a trading pair by its contract address, for example ```"0x1f9840a85d5af5bf1d1762f925bdaddc4201f984_USDC"```.

```exchange.GetMarkets()``` lists only pairs among the built-in tokens and between the most liquid common tokens and the wrapped coin / USDC / USDT; other listed tokens can be traded directly as well.

Native coins (ETH, BNB) and wrapped coins (WETH, WBNB) are separate assets. When you trade a native coin, the router contract wraps and unwraps it automatically.

#### exchange.IO("wrap", ...)

```
exchange.IO(k, amount)
```

Forms:

- `exchange.IO("wrap", ...)`

The ```exchange.IO("wrap", ...)``` call wraps the native coin (ETH, BNB) into the wrapped coin (WETH, WBNB) on a Uniswap exchange object: 1:1, no slippage, only gas is spent.

Parameters:

- `k` (string, required): The ```k``` parameter specifies the function of ```exchange.IO()```. Setting it to ```"wrap"``` means the call wraps the native coin.
- `amount` (string / number, required): The ```amount``` parameter is the amount of the native coin to wrap, in human units (preferably a string such as ```"0.01"```). ```"all"``` is not accepted: the native coin is still needed to pay gas.

Returns (object / null value): When the transaction has been broadcast, returns ```{txHash, action, from, to, amount, raw}```, where ```from``` and ```to``` are the coin names before and after. It only waits for the broadcast, not for confirmation; query the on-chain result with ```exchange.IO("receipt", ...)```. Returns a null value and logs an error when, for example, the balance is insufficient.

Wrap 0.01 ETH into WETH.

```javascript
function main() {
    var r = exchange.IO("wrap", "0.01")
    if (!r) {
        Log("wrap failed:", GetLastError())
        return
    }
    var rc = exchange.IO("receipt", r.txHash, 120000)
    Log(r.from, "→", r.to, r.amount, "status:", rc.status)
}
```

Calls ```deposit()``` on the wrapped-coin contract directly, without the Uniswap router or any pool. Pairs such as ```ETH_WETH``` cannot be traded; convert between the native and the wrapped coin with ```exchange.IO("wrap", ...)``` and ```exchange.IO("unwrap", ...)```.

#### exchange.IO("unwrap", ...)

```
exchange.IO(k, amount)
```

Forms:

- `exchange.IO("unwrap", ...)`

The ```exchange.IO("unwrap", ...)``` call unwraps the wrapped coin (WETH, WBNB) into the native coin (ETH, BNB) on a Uniswap exchange object: 1:1, no slippage, only gas is spent.

Parameters:

- `k` (string, required): The ```k``` parameter specifies the function of ```exchange.IO()```. Setting it to ```"unwrap"``` means the call unwraps the wrapped coin.
- `amount` (string / number, required): The ```amount``` parameter is the amount of the wrapped coin to unwrap, in human units (preferably a string); ```"all"``` unwraps the whole wrapped-coin balance.

Returns (object / null value): When the transaction has been broadcast, returns ```{txHash, action, from, to, amount, raw}```. Returns a null value and logs an error when the wrapped-coin balance is insufficient or zero.

Turn all WETH back into ETH.

```javascript
function main() {
    var r = exchange.IO("unwrap", "all")
    if (!r) {
        Log("unwrap failed:", GetLastError())
        return
    }
    var rc = exchange.IO("receipt", r.txHash, 120000)
    Log(r.from, "→", r.to, r.amount, "status:", rc.status)
}
```

Calls ```withdraw(uint256)``` on the wrapped-coin contract directly, without the Uniswap router or any pool.

#### exchange.IO("approve", ...)

```
exchange.IO(k)
exchange.IO(k, mode)
```

Forms:

- `exchange.IO("approve", ...)`

When called as ```exchange.IO("approve", ...)```, this function sets the token approval mode on a Uniswap exchange object.

Parameters:

- `k` (string, required): The ```k``` parameter specifies the function of ```exchange.IO()```. When set to ```"approve"```, the function is used to set the token approval mode.
- `mode` (string, optional): The ```mode``` parameter is the approval mode. ```"exact"``` (the default) approves only the amount needed for the current swap each time. ```"max"``` grants an unlimited allowance, so the same token never needs approval again. If this parameter is omitted, the function returns the current approval mode.

Returns (string): Returns the current approval mode: ```"exact"``` or ```"max"```.

Set the token approval mode.

```javascript
function main() {
    exchange.IO("approve", "max")
    Log("Current approval mode:", exchange.IO("approve"))
}
```

Before selling a token (when the input is an ERC20 token), the connector checks the router contract's allowance. If the allowance is too low, the connector first sends an approval transaction and waits for it to be confirmed on-chain, then sends the swap transaction. If the existing allowance is nonzero but still too low, the connector first resets it to 0 and then approves again (tokens such as USDT require this).

```"max"``` mode saves you later approval transactions and their gas fees, but it lets the router contract spend your entire balance of that token. Choose the mode that fits your needs.

#### exchange.IO("slippage", ...)

```
exchange.IO(k)
exchange.IO(k, ratio)
```

Forms:

- `exchange.IO("slippage", ...)`

When called this way, ```exchange.IO("slippage", ...)``` sets slippage protection for market orders on a Uniswap exchange object.

Parameters:

- `k` (string, required): The ```k``` parameter sets the function of ```exchange.IO()```. Setting it to ```"slippage"``` makes the function set slippage protection for market orders.
- `ratio` (number, optional): The ```ratio``` parameter is the slippage ratio. Its valid range is ```[0, 0.5)``` and its default is ```0.005``` (0.5%). If you omit this parameter, the function returns the current slippage ratio.

Returns (number): Returns the current slippage ratio.

Set slippage protection for market orders.

```javascript
function main() {
    exchange.IO("slippage", 0.01)     // 1%
    Log("Slippage:", exchange.IO("slippage"))
}
```

For a market order, the slippage is deducted from the quote at the time the order is placed. The result is the minimum amount the order can receive, and this amount is written into the on-chain transaction. If the price moves by more than the slippage ratio before the trade executes, the whole transaction is reverted and only the gas fee is lost.

You can also set slippage for a single order by appending ```;{"slippage":0.01}``` to the direction parameter of ```exchange.CreateOrder()```. Limit orders do not use slippage, because the limit price is already the worst price at which the order can fill.

#### exchange.IO("deadline", ...)

```
exchange.IO(k)
exchange.IO(k, seconds)
```

Forms:

- `exchange.IO("deadline", ...)`

The ```exchange.IO("deadline", ...)``` call sets the transaction deadline on a Uniswap exchange object.

Parameters:

- `k` (string, required): The ```k``` parameter selects the function of ```exchange.IO()```. When set to ```"deadline"```, the function sets the transaction deadline.
- `seconds` (number, optional): The ```seconds``` parameter is how long a transaction stays valid, in seconds. The range is 10 to 86400 and the default is 120. If this parameter is omitted, the call returns the current setting.

Returns (number): Returns the current transaction deadline, in seconds.

Set the transaction deadline.

```javascript
function main() {
    exchange.IO("deadline", 300)
    Log("截止时间:", exchange.IO("deadline"), "秒")
}
```

If a swap transaction has been sent but is not included on-chain before the deadline, it is reverted when executed. This keeps a transaction that has been pending for a long time from being filled after a large price move.

#### exchange.IO("gasMultiplier", ...)

```
exchange.IO(k)
exchange.IO(k, x)
```

Forms:

- `exchange.IO("gasMultiplier", ...)`

```exchange.IO("gasMultiplier", ...)``` is used to set the gas limit multiplier on a Uniswap exchange object.

Parameters:

- `k` (string, required): The ```k``` parameter specifies the function of ```exchange.IO()```. When set to ```"gasMultiplier"```, the function sets the gas limit multiplier.
- `x` (number, optional): The ```x``` parameter is the gas limit multiplier. It accepts values from 1 to 5, and the default is 1.2. A transaction's gasLimit is the node's estimated gas usage multiplied by this value. If this parameter is omitted, the call returns the current multiplier.

Returns (number): Returns the current gas limit multiplier.

Set the gas limit multiplier.

```javascript
function main() {
    exchange.IO("gasMultiplier", 1.5)
    Log("gas multiplier:", exchange.IO("gasMultiplier"))
}
```

gasLimit is only the maximum gas a transaction may use. The actual fee is based on the gas actually consumed, so a somewhat higher multiplier does not raise the actual cost. However, the wallet balance must cover the maximum fee at the gasLimit, or the transaction may not be sent.

### TA

#### TA.MACD

```
TA.MACD(inReal)
TA.MACD(inReal, optInFastPeriod, optInSlowPeriod, optInSignalPeriod)
```

The ```TA.MACD()``` function is used to calculate the **Moving Average Convergence Divergence (MACD) indicator**.

Parameters:

- `inReal` ({@struct/Record Record} structure array / numeric array, required): The ```inReal``` parameter is used to specify the K-line (candlestick) data.
- `optInFastPeriod` (number, optional): The ```optInFastPeriod``` parameter is used to set the fast line period.
- `optInSlowPeriod` (number, optional): The ```optInSlowPeriod``` parameter is used to set the slow line period.
- `optInSignalPeriod` (number, optional): The ```optInSignalPeriod``` parameter is used to set the signal line period.

Returns (array): The return value of the ```TA.MACD()``` function is a two-dimensional array with the structure: ```[DIF, DEA, MACD]```.

```javascript
function main(){
    // You can fill in different K-line periods, such as PERIOD_M1, PERIOD_M30, PERIOD_H1......
    var records = exchange.GetRecords(PERIOD_M15)
    var macd = TA.MACD(records, 12, 26, 9)
    // Checking the logs shows that three arrays are returned, corresponding to DIF, DEA, and MACD respectively
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
    // You can fill in different K-line periods, such as PERIOD_M1, PERIOD_M30, PERIOD_H1......
    let records = exchange.GetRecords(None, PERIOD_M15, None).unwrap();
    let macd = TA.MACD(&records, 12, 26, 9);
    // Checking the logs shows that three arrays are returned, corresponding to DIF, DEA, and MACD respectively
    Log!("DIF:", macd[0], "DEA:", macd[1], "MACD:", macd[2]);
}
```

FMZ Quant's ```TA``` indicator library optimizes the algorithms of commonly used indicators and supports calls from ```JavaScript```, ```Python```, and ```Rust``` strategies. For details, see the [open-source TA library code](https://www.fmz.com/bbs-topic/409).

The default values of the ```optInFastPeriod```, ```optInSlowPeriod```, and ```optInSignalPeriod``` parameters of the ```TA.MACD()``` function are ```12```, ```26```, and ```9``` respectively.

See also: `TA.KDJ`, `TA.RSI`, `TA.ATR`, `TA.OBV`,  `TA.MA`, `TA.EMA`, `TA.BOLL`, `TA.Alligator`, `TA.CMF`, `TA.Highest`, `TA.Lowest`

#### TA.KDJ

```
TA.KDJ(inReal)
TA.KDJ(inReal, period, kPeriod, dPeriod)
```

The ```TA.KDJ()``` function is used to calculate the **Stochastic Oscillator (KDJ)**.

Parameters:

- `inReal` ({@struct/Record Record} structure array / numeric array, required): The ```inReal``` parameter is used to pass in K-line (candlestick) data.
- `period` (number, optional): The ```period``` parameter is used to set calculation period 1.
- `kPeriod` (number, optional): The ```kPeriod``` parameter is used to set calculation period 2.
- `dPeriod` (number, optional): The ```dPeriod``` parameter is used to set calculation period 3.

Returns (array): The return value of the ```TA.KDJ()``` function is a two-dimensional array, with the structure: ```[K, D, J]```.

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

The default values of the ```period```, ```kPeriod```, and ```dPeriod``` parameters of the ```TA.KDJ()``` function are: ```9```, ```3```, and ```3``` respectively.

See also: `TA.MACD`, `TA.RSI`, `TA.ATR`, `TA.OBV`,  `TA.MA`, `TA.EMA`, `TA.BOLL`, `TA.Alligator`, `TA.CMF`, `TA.Highest`, `TA.Lowest`

#### TA.RSI

```
TA.RSI(inReal)
TA.RSI(inReal, optInTimePeriod)
```

The ```TA.RSI()``` function is used to calculate the **Relative Strength Index (RSI)**.

Parameters:

- `inReal` ({@struct/Record Record} struct array / numeric array, required): The ```inReal``` parameter is used to specify the K-line (candlestick) data.
- `optInTimePeriod` (number, optional): The ```optInTimePeriod``` parameter is used to set the calculation period.

Returns (array): The return value of the ```TA.RSI()``` function is a one-dimensional array.

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

The default value of the ```optInTimePeriod``` parameter of the ```TA.RSI()``` function is: ```14```.

See also: `TA.MACD`, `TA.KDJ`, `TA.ATR`, `TA.OBV`,  `TA.MA`, `TA.EMA`, `TA.BOLL`, `TA.Alligator`, `TA.CMF`, `TA.Highest`, `TA.Lowest`

#### TA.ATR

```
TA.ATR(inPriceHLC)
TA.ATR(inPriceHLC, optInTimePeriod)
```

The ```TA.ATR()``` function is used to calculate the **Average True Range indicator (ATR)**.

Parameters:

- `inPriceHLC` ({@struct/Record Record} structure array, required): The ```inPriceHLC``` parameter is used to specify the K-line data.
- `optInTimePeriod` (number, optional): The ```optInTimePeriod``` parameter is used to set the calculation period.

Returns (array): The return value of the ```TA.ATR()``` function is a one-dimensional array.

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

The default value of the ```optInTimePeriod``` parameter of the ```TA.ATR()``` function is: ```14```.

See also: `TA.MACD`, `TA.KDJ`, `TA.RSI`, `TA.OBV`,  `TA.MA`, `TA.EMA`, `TA.BOLL`, `TA.Alligator`, `TA.CMF`, `TA.Highest`, `TA.Lowest`

#### TA.OBV

```
TA.OBV(inReal)
```

```TA.OBV()``` function is used to calculate the **On-Balance Volume (OBV)**.

Parameters:

- `inReal` ({@struct/Record Record} structure array, required): The ```inReal``` parameter is used to specify the K-line data (the closing price and volume in the K-line data are used in the calculation).

Returns (array): The return value of the ```TA.OBV()``` function is a one-dimensional array.

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

The ```TA.MA()``` function is used to calculate the **Moving Average indicator (Moving Average)**.

Parameters:

- `inReal` ({@struct/Record Record} struct array / numeric array, required): The ```inReal``` parameter is used to specify the K-line data.
- `optInTimePeriod` (number, optional): The ```optInTimePeriod``` parameter is used to set the calculation period.

Returns (array): The return value of the ```TA.MA()``` function is a one-dimensional array.

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

The default value of the ```optInTimePeriod``` parameter of the ```TA.MA()``` function is: ```9```.

See also: `TA.MACD`, `TA.KDJ`, `TA.RSI`, `TA.ATR`, `TA.OBV`,  `TA.EMA`, `TA.BOLL`, `TA.Alligator`, `TA.CMF`, `TA.Highest`, `TA.Lowest`

#### TA.EMA

```
TA.EMA(inReal)
TA.EMA(inReal, optInTimePeriod)
```

The ```TA.EMA()``` function is used to calculate the **Exponential Moving Average (EMA) indicator**.

Parameters:

- `inReal` ({@struct/Record Record} structure array / numeric array, required): The ```inReal``` parameter is used to pass in the K-line (candlestick) data.
- `optInTimePeriod` (number, optional): The ```optInTimePeriod``` parameter is used to set the calculation period.

Returns (array): The return value of the ```TA.EMA()``` function is: a one-dimensional array.

```javascript
function main(){
    var records = exchange.GetRecords()
    // Check whether the number of K-line Bars meets the period required for indicator calculation
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
    // Check whether the number of K-line Bars meets the period required for indicator calculation
    if records.len() > 9 {
        let ema = TA.EMA(&records, 9);
        Log!(ema);
    }
}
```

The default value of the ```optInTimePeriod``` parameter of the ```TA.EMA()``` function is: ```9```.

See also: `TA.MACD`, `TA.KDJ`, `TA.RSI`, `TA.ATR`, `TA.OBV`,  `TA.MA`, `TA.BOLL`, `TA.Alligator`, `TA.CMF`, `TA.Highest`, `TA.Lowest`

#### TA.BOLL

```
TA.BOLL(inReal)
TA.BOLL(inReal, period, multiplier)
```

The ```TA.BOLL()``` function is used to calculate the **Bollinger Bands indicator**.

Parameters:

- `inReal` ({@struct/Record Record} struct array / numeric array, required): The ```inReal``` parameter is used to specify the K-line (candlestick) data.
- `period` (number, optional): The ```period``` parameter is used to set the calculation period.
- `multiplier` (number, optional): The ```multiplier``` parameter is used to set the multiplier (standard deviation multiplier).

Returns (array): The return value of the ```TA.BOLL()``` function is a two-dimensional array, with the structure ```[upLine, midLine, downLine]```.

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

The default values of the ```period``` and ```multiplier``` parameters of the ```TA.BOLL()``` function are ```20``` and ```2```, respectively.

See also: `TA.MACD`, `TA.KDJ`, `TA.RSI`, `TA.ATR`, `TA.OBV`,  `TA.MA`, `TA.EMA`, `TA.Alligator`, `TA.CMF`, `TA.Highest`, `TA.Lowest`

#### TA.Alligator

```
TA.Alligator(inReal)
TA.Alligator(inReal, jawLength, teethLength, lipsLength)
```

```TA.Alligator()``` function is used to calculate the **Alligator indicator**.

Parameters:

- `inReal` ({@struct/Record Record} structure array / numeric array, required): The ```inReal``` parameter is used to specify the K-line data.
- `jawLength` (number, optional): The ```jawLength``` parameter is used to set the period of the Jaw line.
- `teethLength` (number, optional): The ```teethLength``` parameter is used to set the period of the Teeth line.
- `lipsLength` (number, optional): The ```lipsLength``` parameter is used to set the period of the Lips line.

Returns (array): The return value of the ```TA.Alligator()``` function is a two-dimensional array with the structure: ```[jawLine, teethLine, lipsLine]```.

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

The default values of the ```jawLength```, ```teethLength```, and ```lipsLength``` parameters of the ```TA.Alligator()``` function are: ```13```, ```8```, and ```5``` respectively.

See also: `TA.MACD`, `TA.KDJ`, `TA.RSI`, `TA.ATR`, `TA.OBV`,  `TA.MA`, `TA.EMA`, `TA.BOLL`, `TA.CMF`, `TA.Highest`, `TA.Lowest`

#### TA.CMF

```
TA.CMF(inReal)
TA.CMF(inReal, periods)
```

The ```TA.CMF()``` function is used to calculate the **Chaikin Money Flow (CMF)** indicator.

Parameters:

- `inReal` ({@struct/Record Record} structure array, required): The ```inReal``` parameter is used to specify the K-line (candlestick) data (the high, low, close prices, and volume in the K-line data are used in the calculation).
- `periods` (number, optional): The ```periods``` parameter is used to specify the calculation period, with a default value of 20.

Returns (array): The return value of the ```TA.CMF()``` function is a one-dimensional array.

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

The ```TA.Highest()``` function is used to calculate the **highest price within a period**.

Parameters:

- `inReal` ({@struct/Record Record} structure array / numeric array, required): The ```inReal``` parameter is used to specify the K-line (candlestick) data.
- `period` (number, optional): The ```period``` parameter is used to set the calculation period.
- `attr` (string, optional): The ```attr``` parameter is used to specify the attribute. Optional values: ```Open```, ```Close```, ```Low```, ```High```, ```Volume```, ```OpenInterest```.

Returns (number): The ```TA.Highest()``` function returns the maximum value of a certain attribute over the most recent specified period, not including the current Bar.

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
    // Rust's TA.Highest has no attribute name parameter; first extract the opening price numeric sequence, then calculate (not including the current Bar)
    let opens: Vec<f64> = records.iter().map(|r| r.Open).collect();
    let highestForOpen = TA.Highest(&opens, 10);
    Log!(highestForOpen);
}
```

For example, when calling the ```TA.Highest(records, 30, "High")``` function, if the period parameter ```period``` is set to ```0```, it means calculating all ```Bar``` in the K-line data passed in by the ```inReal``` parameter; if the attribute parameter ```attr``` is not specified, the data passed in by the ```inReal``` parameter is treated as an ordinary array.

See also: `TA.MACD`, `TA.KDJ`, `TA.RSI`, `TA.ATR`, `TA.OBV`,  `TA.MA`, `TA.EMA`, `TA.BOLL`, `TA.Alligator`, `TA.CMF`, `TA.Lowest`

#### TA.Lowest

```
TA.Lowest(inReal)
TA.Lowest(inReal, period, attr)
```

The ```TA.Lowest()``` function is used to calculate the **lowest price over a period**.

Parameters:

- `inReal` ({@struct/Record Record} structure array / numeric array, required): The ```inReal``` parameter is used to specify the K-line (candlestick) data.
- `period` (number, optional): The ```period``` parameter is used to set the calculation period.
- `attr` (string, optional): The ```attr``` parameter is used to set the attribute. Optional values: ```Open```, ```Close```, ```Low```, ```High```, ```Volume```, ```OpenInterest```.

Returns (number): The ```TA.Lowest()``` function returns the minimum value of a certain attribute over the most recent given period, not including the current Bar.

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
    // Rust's TA.Lowest has no attribute-name parameter; first extract the opening price numeric sequence, then calculate (not including the current Bar)
    let opens: Vec<f64> = records.iter().map(|r| r.Open).collect();
    let lowestForOpen = TA.Lowest(&opens, 10);
    Log!(lowestForOpen);
}
```

For example, when calling the ```TA.Lowest(records, 30, "Low")``` function: if the period parameter ```period``` is set to ```0```, it means calculating over all ```Bar``` of the K-line data passed in via the ```inReal``` parameter; if the attribute parameter ```attr``` is not specified, the K-line data passed in via the ```inReal``` parameter is treated as an ordinary array.

See also: `TA.MACD`, `TA.KDJ`, `TA.RSI`, `TA.ATR`, `TA.OBV`,  `TA.MA`, `TA.EMA`, `TA.BOLL`, `TA.Alligator`, `TA.CMF`, `TA.Highest`

#### TA.SMA

```
TA.SMA(inReal)
TA.SMA(inReal, optInTimePeriod)
```

The ```TA.SMA()``` function is used to calculate the **Simple Moving Average (SMA) indicator**.

Parameters:

- `inReal` ({@struct/Record Record} structure array / numeric array, required): The ```inReal``` parameter is used to pass in the K-line (candlestick) data.
- `optInTimePeriod` (number, optional): The ```optInTimePeriod``` parameter is used to set the calculation period.

Returns (array): The return value of the ```TA.SMA()``` function is: a one-dimensional array.

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

The default value of the ```optInTimePeriod``` parameter of the ```TA.SMA()``` function is: ```9```.

See also: `TA.MACD`, `TA.KDJ`, `TA.RSI`, `TA.ATR`, `TA.OBV`,  `TA.MA`, `TA.EMA`, `TA.BOLL`, `TA.Alligator`, `TA.CMF`, `TA.Highest`, `TA.Lowest`

### Talib

#### OverlapStudies

Overlap studies: moving averages, Bollinger Bands, parabolic SAR and similar.

##### talib.BBANDS

```
talib.BBANDS(inReal)
talib.BBANDS(inReal, optInTimePeriod)
talib.BBANDS(inReal, optInTimePeriod, optInNbDevUp)
talib.BBANDS(inReal, optInTimePeriod, optInNbDevUp, optInNbDevDn)
talib.BBANDS(inReal, optInTimePeriod, optInNbDevUp, optInNbDevDn, optInMAType)
```

The ```talib.BBANDS()``` function is used to calculate **Bollinger Bands**.

Parameters:

- `inReal` ({@struct/Record Record} structure array / numeric array, required): The ```inReal``` parameter is used to specify the K-line data.
- `optInTimePeriod` (number, optional): The ```optInTimePeriod``` parameter is used to set the calculation period, with a default value of 5.
- `optInNbDevUp` (number, optional): The ```optInNbDevUp``` parameter is used to set the upper band standard deviation multiplier, with a default value of 2.
- `optInNbDevDn` (number, optional): The ```optInNbDevDn``` parameter is used to set the lower band standard deviation multiplier, with a default value of 2.
- `optInMAType` (number, optional): The ```optInMAType``` parameter is used to set the moving average type, with a default value of 0.

Returns (array): The ```talib.BBANDS()``` function returns a two-dimensional array containing three elements: upper band array, middle band array, and lower band array.

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

The ```BBANDS()``` function is described in the talib library documentation as: ```BBANDS(Records[Close],Time Period = 5,Deviations up = 2,Deviations down = 2,MA Type = 0) = [Array(outRealUpperBand),Array(outRealMiddleBand),Array(outRealLowerBand)]```

##### talib.DEMA

```
talib.DEMA(inReal)
talib.DEMA(inReal, optInTimePeriod)
```

The ```talib.DEMA()``` function is used to calculate **Double Exponential Moving Average**.

Parameters:

- `inReal` ({@struct/Record Record} structure array / numeric array, required): The ```inReal``` parameter is used to specify the K-line data.
- `optInTimePeriod` (number, optional): The ```optInTimePeriod``` parameter is used to set the calculation period, with a default value of 30.

Returns (array): The ```talib.DEMA()``` function returns a one-dimensional array.

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

The ```DEMA()``` function is described in the talib library documentation as: ```DEMA(Records[Close],Time Period = 30) = Array(outReal)```

##### talib.EMA

```
talib.EMA(inReal)
talib.EMA(inReal, optInTimePeriod)
```

The ```talib.EMA()``` function is used to calculate **Exponential Moving Average**.

Parameters:

- `inReal` ({@struct/Record Record} structure array / numeric array, required): The ```inReal``` parameter is used to specify the K-line data.
- `optInTimePeriod` (number, optional): The ```optInTimePeriod``` parameter is used to set the calculation period, with a default value of 30.

Returns (array): The ```talib.EMA()``` function returns a one-dimensional array.

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

The ```EMA()``` function is described in the talib library documentation as: ```EMA(Records[Close],Time Period = 30) = Array(outReal)```

##### talib.HT_TRENDLINE

```
talib.HT_TRENDLINE(inReal)
```

The ```talib.HT_TRENDLINE()``` function is used to calculate **Hilbert Transform - Instantaneous Trendline**.

Parameters:

- `inReal` ({@struct/Record Record} structure array / numeric array, required): The ```inReal``` parameter is used to specify the K-line data.

Returns (array): The ```talib.HT_TRENDLINE()``` function returns a one-dimensional array.

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

The ```HT_TRENDLINE()``` function is described in the talib library documentation as: ```HT_TRENDLINE(Records[Close]) = Array(outReal)```

##### talib.KAMA

```
talib.KAMA(inReal)
talib.KAMA(inReal, optInTimePeriod)
```

The ```talib.KAMA()``` function is used to calculate **Kaufman Adaptive Moving Average**.

Parameters:

- `inReal` ({@struct/Record Record} structure array / numeric array, required): The ```inReal``` parameter is used to specify the K-line data.
- `optInTimePeriod` (number, optional): The ```optInTimePeriod``` parameter is used to set the calculation period, with a default value of 30.

Returns (array): The ```talib.KAMA()``` function returns a one-dimensional array.

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

The ```KAMA()``` function is described in the talib library documentation as: ```KAMA(Records[Close],Time Period = 30) = Array(outReal)```

##### talib.MA

```
talib.MA(inReal)
talib.MA(inReal, optInTimePeriod)
talib.MA(inReal, optInTimePeriod, optInMAType)
```

The ```talib.MA()``` function is used to calculate **Moving average**.

Parameters:

- `inReal` ({@struct/Record Record} structure array / numeric array, required): The ```inReal``` parameter is used to specify the K-line data.
- `optInTimePeriod` (number, optional): The ```optInTimePeriod``` parameter is used to set the calculation period, default value is 30.
- `optInMAType` (number, optional): The ```optInMAType``` parameter is used to set the moving average type, default value is 0.

Returns (array): The ```talib.MA()``` function returns a one-dimensional array.

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

The ```MA()``` function is described in the talib library documentation as: ```MA(Records[Close],Time Period = 30,MA Type = 0) = Array(outReal)```

##### talib.MAMA

```
talib.MAMA(inReal)
talib.MAMA(inReal, optInFastLimit)
talib.MAMA(inReal, optInFastLimit, optInSlowLimit)
```

The ```talib.MAMA()``` function is used to calculate the **MESA Adaptive Moving Average**.

Parameters:

- `inReal` ({@struct/Record Record} structure array / numeric array, required): The ```inReal``` parameter is used to specify the K-line data.
- `optInFastLimit` (number, optional): The ```optInFastLimit``` parameter is used to set the fast limit value, with a default value of 0.5.
- `optInSlowLimit` (number, optional): The ```optInSlowLimit``` parameter is used to set the slow limit value, with a default value of 0.05.

Returns (array): The ```talib.MAMA()``` function returns a two-dimensional array.

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

The ```MAMA()``` function is described in the talib library documentation as: ```MAMA(Records[Close],Fast Limit = 0.5,Slow Limit = 0.05) = [Array(outMAMA),Array(outFAMA)]```

##### talib.MIDPOINT

```
talib.MIDPOINT(inReal)
talib.MIDPOINT(inReal, optInTimePeriod)
```

The ```talib.MIDPOINT()``` function is used to calculate **MidPoint over period**.

Parameters:

- `inReal` ({@struct/Record Record} structure array / numeric array, required): The ```inReal``` parameter is used to specify the K-line data.
- `optInTimePeriod` (number, optional): The ```optInTimePeriod``` parameter is used to set the calculation period, with a default value of 14.

Returns (array): The ```talib.MIDPOINT()``` function returns a one-dimensional array.

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

The ```MIDPOINT()``` function is described in the talib library documentation as: ```MIDPOINT(Records[Close],Time Period = 14) = Array(outReal)```

##### talib.MIDPRICE

```
talib.MIDPRICE(inPriceHL)
talib.MIDPRICE(inPriceHL, optInTimePeriod)
```

The ```talib.MIDPRICE()``` function is used to calculate **Midpoint Price over period**.

Parameters:

- `inPriceHL` ({@struct/Record Record} structure array, required): The ```inPriceHL``` parameter is used to specify the K-line data.
- `optInTimePeriod` (number, optional): The ```optInTimePeriod``` parameter is used to set the time period, with a default value of 14.

Returns (array): The ```talib.MIDPRICE()``` function returns a one-dimensional array.

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

The ```MIDPRICE()``` function is described in the talib library documentation as: ```MIDPRICE(Records[High,Low],Time Period = 14) = Array(outReal)```

##### talib.SAR

```
talib.SAR(inPriceHL)
talib.SAR(inPriceHL, optInAcceleration)
talib.SAR(inPriceHL, optInAcceleration, optInMaximum)
```

The ```talib.SAR()``` function is used to calculate the **Parabolic SAR (Stop and Reverse)** indicator.

Parameters:

- `inPriceHL` ({@struct/Record Record} structure array, required): The ```inPriceHL``` parameter is used to specify the K-line data.
- `optInAcceleration` (number, optional): The ```optInAcceleration``` parameter is used to set the Acceleration Factor, with a default value of 0.02.
- `optInMaximum` (number, optional): The ```optInMaximum``` parameter is used to set the AF Maximum (Acceleration Factor Maximum), with a default value of 0.2.

Returns (array): The ```talib.SAR()``` function returns a one-dimensional array.

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

The ```SAR()``` function is described in the talib library documentation as: ```SAR(Records[High,Low],Acceleration Factor = 0.02,AF Maximum = 0.2) = Array(outReal)```

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

The ```talib.SAREXT()``` function is used to calculate **Parabolic SAR - Extended**.

Parameters:

- `inPriceHL` ({@struct/Record Record} structure array, required): The ```inPriceHL``` parameter is used to specify K-line data.
- `optInStartValue` (number, optional): The ```optInStartValue``` parameter is used to set the Start Value, default value is 0.
- `optInOffsetOnReverse` (number, optional): The ```optInOffsetOnReverse``` parameter is used to set the Offset on Reverse, default value is 0.
- `optInAccelerationInitLong` (number, optional): The ```optInAccelerationInitLong``` parameter is used to set the long initial acceleration factor (AF Init Long), default value is 0.02.
- `optInAccelerationLong` (number, optional): The ```optInAccelerationLong``` parameter is used to set the long acceleration factor (AF Long), default value is 0.02.
- `optInAccelerationMaxLong` (number, optional): The ```optInAccelerationMaxLong``` parameter is used to set the long maximum acceleration factor (AF Max Long), default value is 0.2.
- `optInAccelerationInitShort` (number, optional): The ```optInAccelerationInitShort``` parameter is used to set the short initial acceleration factor (AF Init Short), default value is 0.02.
- `optInAccelerationShort` (number, optional): The ```optInAccelerationShort``` parameter is used to set the short acceleration factor (AF Short), default value is 0.02.
- `optInAccelerationMaxShort` (number, optional): The ```optInAccelerationMaxShort``` parameter is used to set the short maximum acceleration factor (AF Max Short), default value is 0.2.

Returns (array): The ```talib.SAREXT()``` function returns a one-dimensional array.

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

The ```SAREXT()``` function is described in the talib library documentation as: ```SAREXT(Records[High,Low],Start Value = 0,Offset on Reverse = 0,AF Init Long = 0.02,AF Long = 0.02,AF Max Long = 0.2,AF Init Short = 0.02,AF Short = 0.02,AF Max Short = 0.2) = Array(outReal)```

##### talib.SMA

```
talib.SMA(inReal)
talib.SMA(inReal, optInTimePeriod)
```

The ```talib.SMA()``` function is used to calculate **Simple Moving Average**.

Parameters:

- `inReal` ({@struct/Record Record} structure array / numeric array, required): The ```inReal``` parameter is used to specify the K-line data.
- `optInTimePeriod` (number, optional): The ```optInTimePeriod``` parameter is used to set the calculation period, with a default value of 30.

Returns (array): The ```talib.SMA()``` function returns a one-dimensional array.

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

The ```SMA()``` function is described in the talib library documentation as: ```SMA(Records[Close],Time Period = 30) = Array(outReal)```

##### talib.T3

```
talib.T3(inReal)
talib.T3(inReal, optInTimePeriod)
talib.T3(inReal, optInTimePeriod, optInVFactor)
```

The ```talib.T3()``` function is used to calculate **Triple Exponential Moving Average (T3)**.

Parameters:

- `inReal` ({@struct/Record Record} structure array / numeric array, required): The ```inReal``` parameter is used to specify the K-line data.
- `optInTimePeriod` (number, optional): The ```optInTimePeriod``` parameter is used to set the calculation period, with a default value of 5.
- `optInVFactor` (number, optional): The ```optInVFactor``` parameter is used to set the volume factor, with a default value of 0.7.

Returns (array): The ```talib.T3()``` function returns a one-dimensional array.

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

The ```T3()``` function is described in the talib library documentation as: ```T3(Records[Close],Time Period = 5,Volume Factor = 0.7) = Array(outReal)```

##### talib.TEMA

```
talib.TEMA(inReal)
talib.TEMA(inReal, optInTimePeriod)
```

The ```talib.TEMA()``` function is used to calculate **Triple Exponential Moving Average**.

Parameters:

- `inReal` ({@struct/Record Record} structure array / numeric array, required): The ```inReal``` parameter is used to specify the K-line data.
- `optInTimePeriod` (number, optional): The ```optInTimePeriod``` parameter is used to set the calculation period, with a default value of 30.

Returns (array): The ```talib.TEMA()``` function returns a one-dimensional array.

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

The ```TEMA()``` function is described in the talib library documentation as: ```TEMA(Records[Close],Time Period = 30) = Array(outReal)```

##### talib.TRIMA

```
talib.TRIMA(inReal)
talib.TRIMA(inReal, optInTimePeriod)
```

The ```talib.TRIMA()``` function is used to calculate **Triangular Moving Average**.

Parameters:

- `inReal` ({@struct/Record Record} structure array / numeric array, required): The ```inReal``` parameter is used to specify the K-line data.
- `optInTimePeriod` (number, optional): The ```optInTimePeriod``` parameter is used to set the calculation period, with a default value of 30.

Returns (array): The ```talib.TRIMA()``` function returns a one-dimensional array.

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

The ```TRIMA()``` function is described in the talib library documentation as: ```TRIMA(Records[Close],Time Period = 30) = Array(outReal)```

##### talib.WMA

```
talib.WMA(inReal)
talib.WMA(inReal, optInTimePeriod)
```

The ```talib.WMA()``` function is used to calculate **Weighted Moving Average**.

Parameters:

- `inReal` ({@struct/Record Record} structure array / numeric array, required): The ```inReal``` parameter is used to specify the K-line data.
- `optInTimePeriod` (number, optional): The ```optInTimePeriod``` parameter is used to set the calculation period, with a default value of 30.

Returns (array): The ```talib.WMA()``` function returns a one-dimensional array.

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

The ```WMA()``` function is described in the talib library documentation as: ```WMA(Records[Close],Time Period = 30) = Array(outReal)```

#### MomentumIndicators

Momentum indicators: MACD, RSI, stochastic oscillators (STOCH), ADX, CCI and similar.

##### talib.ADX

```
talib.ADX(inPriceHLC)
talib.ADX(inPriceHLC, optInTimePeriod)
```

The ```talib.ADX()``` function is used to calculate the **Average Directional Movement Index**.

Parameters:

- `inPriceHLC` ({@struct/Record Record} structure array, required): The ```inPriceHLC``` parameter is used to specify the K-line data.
- `optInTimePeriod` (number, optional): The ```optInTimePeriod``` parameter is used to set the calculation period, with a default value of 14.

Returns (array): The ```talib.ADX()``` function returns a one-dimensional array.

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

The ```ADX()``` function is described in the talib library documentation as: ```ADX(Records[High,Low,Close],Time Period = 14) = Array(outReal)```

##### talib.ADXR

```
talib.ADXR(inPriceHLC)
talib.ADXR(inPriceHLC, optInTimePeriod)
```

The ```talib.ADXR()``` function is used to calculate the **Average Directional Movement Index Rating**.

Parameters:

- `inPriceHLC` ({@struct/Record Record} structure array, required): The ```inPriceHLC``` parameter is used to specify the K-line data.
- `optInTimePeriod` (number, optional): The ```optInTimePeriod``` parameter is used to set the calculation period, with a default value of 14.

Returns (array): The ```talib.ADXR()``` function returns a one-dimensional array.

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

The ```ADXR()``` function is described in the talib library documentation as: ```ADXR(Records[High,Low,Close],Time Period = 14) = Array(outReal)```

##### talib.APO

```
talib.APO(inReal)
talib.APO(inReal, optInFastPeriod)
talib.APO(inReal, optInFastPeriod, optInSlowPeriod)
talib.APO(inReal, optInFastPeriod, optInSlowPeriod, optInMAType)
```

The ```talib.APO()``` function is used to calculate **Absolute Price Oscillator**.

Parameters:

- `inReal` ({@struct/Record Record} structure array / numeric array, required): The ```inReal``` parameter is used to specify K-line data.
- `optInFastPeriod` (number, optional): The ```optInFastPeriod``` parameter is used to set the fast period, default value is 12.
- `optInSlowPeriod` (number, optional): The ```optInSlowPeriod``` parameter is used to set the slow period, default value is 26.
- `optInMAType` (number, optional): The ```optInMAType``` parameter is used to set the moving average type, default value is 0.

Returns (array): The ```talib.APO()``` function returns a one-dimensional array.

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

The ```APO()``` function is described in the talib library documentation as: ```APO(Records[Close],Fast Period = 12,Slow Period = 26,MA Type = 0) = Array(outReal)```

##### talib.AROON

```
talib.AROON(inPriceHL)
talib.AROON(inPriceHL, optInTimePeriod)
```

The ```talib.AROON()``` function is used to calculate **Aroon (Aroon Indicator)**.

Parameters:

- `inPriceHL` ({@struct/Record Record} structure array, required): The ```inPriceHL``` parameter is used to specify the K-line data.
- `optInTimePeriod` (number, optional): The ```optInTimePeriod``` parameter is used to set the calculation period, with a default value of 14.

Returns (array): The ```talib.AROON()``` function returns a two-dimensional array.

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

The ```AROON()``` function is described in the talib library documentation as: ```AROON(Records[High,Low],Time Period = 14) = [Array(outAroonDown),Array(outAroonUp)]```

##### talib.AROONOSC

```
talib.AROONOSC(inPriceHL)
talib.AROONOSC(inPriceHL, optInTimePeriod)
```

The ```talib.AROONOSC()``` function is used to calculate the **Aroon Oscillator**.

Parameters:

- `inPriceHL` ({@struct/Record Record} structure array, required): The ```inPriceHL``` parameter is used to specify the K-line data.
- `optInTimePeriod` (number, optional): The ```optInTimePeriod``` parameter is used to set the calculation period, with a default value of 14.

Returns (array): The ```talib.AROONOSC()``` function returns a one-dimensional array.

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

The ```AROONOSC()``` function is described in the talib library documentation as: ```AROONOSC(Records[High,Low],Time Period = 14) = Array(outReal)```

##### talib.BOP

```
talib.BOP(inPriceOHLC)
```

The ```talib.BOP()``` function is used to calculate **Balance Of Power**.

Parameters:

- `inPriceOHLC` ({@struct/Record Record} structure array, required): The ```inPriceOHLC``` parameter is used to specify K-line data.

Returns (array): The ```talib.BOP()``` function returns a one-dimensional array.

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

The ```BOP()``` function is described in the talib library documentation as: ```BOP(Records[Open,High,Low,Close]) = Array(outReal)```

##### talib.CCI

```
talib.CCI(inPriceHLC)
talib.CCI(inPriceHLC, optInTimePeriod)
```

The ```talib.CCI()``` function is used to calculate the **Commodity Channel Index**.

Parameters:

- `inPriceHLC` ({@struct/Record Record} structure array, required): The ```inPriceHLC``` parameter is used to specify the K-line data.
- `optInTimePeriod` (number, optional): The ```optInTimePeriod``` parameter is used to set the calculation period, with a default value of 14.

Returns (array): The ```talib.CCI()``` function returns a one-dimensional array.

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

The ```CCI()``` function is described in the talib library documentation as: ```CCI(Records[High,Low,Close],Time Period = 14) = Array(outReal)```

##### talib.CMO

```
talib.CMO(inReal)
talib.CMO(inReal, optInTimePeriod)
```

The ```talib.CMO()``` function is used to calculate the **Chande Momentum Oscillator**.

Parameters:

- `inReal` ({@struct/Record Record} structure array / numeric array, required): The ```inReal``` parameter is used to specify the K-line data.
- `optInTimePeriod` (number, optional): The ```optInTimePeriod``` parameter is used to set the calculation period, with a default value of 14.

Returns (array): The ```talib.CMO()``` function returns a one-dimensional array.

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

The ```CMO()``` function is described in the talib library documentation as: ```CMO(Records[Close],Time Period = 14) = Array(outReal)```

##### talib.DX

```
talib.DX(inPriceHLC)
talib.DX(inPriceHLC, optInTimePeriod)
```

The ```talib.DX()``` function is used to calculate the **Directional Movement Index**.

Parameters:

- `inPriceHLC` ({@struct/Record Record} structure array, required): The ```inPriceHLC``` parameter is used to specify the K-line data.
- `optInTimePeriod` (number, optional): The ```optInTimePeriod``` parameter is used to set the calculation period, with a default value of 14.

Returns (array): The ```talib.DX()``` function returns a one-dimensional array.

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

The ```DX()``` function is described in the talib library documentation as: ```DX(Records[High,Low,Close],Time Period = 14) = Array(outReal)```

##### talib.MACD

```
talib.MACD(inReal)
talib.MACD(inReal, optInFastPeriod)
talib.MACD(inReal, optInFastPeriod, optInSlowPeriod)
talib.MACD(inReal, optInFastPeriod, optInSlowPeriod, optInSignalPeriod)
```

The ```talib.MACD()``` function is used to calculate **Moving Average Convergence/Divergence**.

Parameters:

- `inReal` ({@struct/Record Record} structure array / numeric array, required): The ```inReal``` parameter is used to specify the K-line data.
- `optInFastPeriod` (number, optional): The ```optInFastPeriod``` parameter is used to set the fast period, default value is 12.
- `optInSlowPeriod` (number, optional): The ```optInSlowPeriod``` parameter is used to set the slow period, default value is 26.
- `optInSignalPeriod` (number, optional): The ```optInSignalPeriod``` parameter is used to set the signal line period, default value is 9.

Returns (array): The ```talib.MACD()``` function returns a two-dimensional array.

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

The ```MACD()``` function is described in the talib library documentation as: ```MACD(Records[Close],Fast Period = 12,Slow Period = 26,Signal Period = 9) = [Array(outMACD),Array(outMACDSignal),Array(outMACDHist)]```

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

The ```talib.MACDEXT()``` function is used to calculate **MACD with controllable MA type**.

Parameters:

- `inReal` ({@struct/Record Record} structure array / numeric array, required): The ```inReal``` parameter is used to specify the K-line data.
- `optInFastPeriod` (number, optional): The ```optInFastPeriod``` parameter is used to set the fast period, default value is 12.
- `optInFastMAType` (number, optional): The ```optInFastMAType``` parameter is used to set the fast moving average type, default value is 0.
- `optInSlowPeriod` (number, optional): The ```optInSlowPeriod``` parameter is used to set the slow period, default value is 26.
- `optInSlowMAType` (number, optional): The ```optInSlowMAType``` parameter is used to set the slow moving average type, default value is 0.
- `optInSignalPeriod` (number, optional): The ```optInSignalPeriod``` parameter is used to set the signal line period, default value is 9.
- `optInSignalMAType` (number, optional): The ```optInSignalMAType``` parameter is used to set the signal line moving average type, default value is 0.

Returns (array): The ```talib.MACDEXT()``` function returns a two-dimensional array.

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

The ```MACDEXT()``` function is described in the talib library documentation as: ```MACDEXT(Records[Close],Fast Period = 12,Fast MA = 0,Slow Period = 26,Slow MA = 0,Signal Period = 9,Signal MA = 0) = [Array(outMACD),Array(outMACDSignal),Array(outMACDHist)]```

##### talib.MACDFIX

```
talib.MACDFIX(inReal)
talib.MACDFIX(inReal, optInSignalPeriod)
```

The ```talib.MACDFIX()``` function is used to calculate **Moving Average Convergence/Divergence Fix 12/26**.

Parameters:

- `inReal` ({@struct/Record Record} structure array / numeric array, required): The ```inReal``` parameter is used to specify the K-line data.
- `optInSignalPeriod` (number, optional): The ```optInSignalPeriod``` parameter is used to set the signal period, with a default value of 9.

Returns (array): The ```talib.MACDFIX()``` function returns a two-dimensional array.

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

The ```MACDFIX()``` function is described in the talib library documentation as: ```MACDFIX(Records[Close],Signal Period = 9) = [Array(outMACD),Array(outMACDSignal),Array(outMACDHist)]```

##### talib.MFI

```
talib.MFI(inPriceHLCV)
talib.MFI(inPriceHLCV, optInTimePeriod)
```

The ```talib.MFI()``` function is used to calculate **Money Flow Index**.

Parameters:

- `inPriceHLCV` ({@struct/Record Record} structure array, required): The ```inPriceHLCV``` parameter is used to specify the K-line data.
- `optInTimePeriod` (number, optional): The ```optInTimePeriod``` parameter is used to set the calculation period, with a default value of 14.

Returns (array): The ```talib.MFI()``` function returns a one-dimensional array.

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

The ```MFI()``` function is described in the talib library documentation as: ```MFI(Records[High,Low,Close,Volume],Time Period = 14) = Array(outReal)```

##### talib.MINUS_DI

```
talib.MINUS_DI(inPriceHLC)
talib.MINUS_DI(inPriceHLC, optInTimePeriod)
```

The ```talib.MINUS_DI()``` function is used to calculate the **Minus Directional Indicator**.

Parameters:

- `inPriceHLC` ({@struct/Record Record} structure array, required): The ```inPriceHLC``` parameter is used to specify the K-line data.
- `optInTimePeriod` (number, optional): The ```optInTimePeriod``` parameter is used to set the calculation period, with a default value of 14.

Returns (array): The ```talib.MINUS_DI()``` function returns a one-dimensional array.

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

The ```MINUS_DI()``` function is described in the talib library documentation as: ```MINUS_DI(Records[High,Low,Close],Time Period = 14) = Array(outReal)```

##### talib.MINUS_DM

```
talib.MINUS_DM(inPriceHL)
talib.MINUS_DM(inPriceHL, optInTimePeriod)
```

The ```talib.MINUS_DM()``` function is used to calculate **Minus Directional Movement**.

Parameters:

- `inPriceHL` ({@struct/Record Record} structure array, required): The ```inPriceHL``` parameter is used to specify the K-line data.
- `optInTimePeriod` (number, optional): The ```optInTimePeriod``` parameter is used to set the calculation period, with a default value of 14.

Returns (array): The ```talib.MINUS_DM()``` function returns a one-dimensional array.

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

The ```MINUS_DM()``` function is described in the talib library documentation as: ```MINUS_DM(Records[High,Low],Time Period = 14) = Array(outReal)```

##### talib.MOM

```
talib.MOM(inReal)
talib.MOM(inReal, optInTimePeriod)
```

The ```talib.MOM()``` function is used to calculate **Momentum (Momentum Indicator)**.

Parameters:

- `inReal` ({@struct/Record Record} structure array / numeric array, required): The ```inReal``` parameter is used to specify the K-line data.
- `optInTimePeriod` (number, optional): The ```optInTimePeriod``` parameter is used to set the calculation period, with a default value of 10.

Returns (array): The ```talib.MOM()``` function returns a one-dimensional array.

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

The ```MOM()``` function is described in the talib library documentation as: ```MOM(Records[Close],Time Period = 10) = Array(outReal)```

##### talib.PLUS_DI

```
talib.PLUS_DI(inPriceHLC)
talib.PLUS_DI(inPriceHLC, optInTimePeriod)
```

The ```talib.PLUS_DI()``` function is used to calculate the **Plus Directional Indicator**.

Parameters:

- `inPriceHLC` ({@struct/Record Record} structure array, required): The ```inPriceHLC``` parameter is used to specify the K-line data.
- `optInTimePeriod` (number, optional): The ```optInTimePeriod``` parameter is used to set the time period, with a default value of 14.

Returns (array): The ```talib.PLUS_DI()``` function returns a one-dimensional array.

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

The ```PLUS_DI()``` function is described in the talib library documentation as: ```PLUS_DI(Records[High,Low,Close],Time Period = 14) = Array(outReal)```

##### talib.PLUS_DM

```
talib.PLUS_DM(inPriceHL)
talib.PLUS_DM(inPriceHL, optInTimePeriod)
```

The ```talib.PLUS_DM()``` function is used to calculate **Plus Directional Movement**.

Parameters:

- `inPriceHL` ({@struct/Record Record} structure array, required): The ```inPriceHL``` parameter is used to specify the K-line data.
- `optInTimePeriod` (number, optional): The ```optInTimePeriod``` parameter is used to set the calculation period, with a default value of 14.

Returns (array): The ```talib.PLUS_DM()``` function returns a one-dimensional array.

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

The ```PLUS_DM()``` function is described in the talib library documentation as: ```PLUS_DM(Records[High,Low],Time Period = 14) = Array(outReal)```

##### talib.PPO

```
talib.PPO(inReal)
talib.PPO(inReal, optInFastPeriod)
talib.PPO(inReal, optInFastPeriod, optInSlowPeriod)
talib.PPO(inReal, optInFastPeriod, optInSlowPeriod, optInMAType)
```

The ```talib.PPO()``` function is used to calculate **Percentage Price Oscillator**.

Parameters:

- `inReal` ({@struct/Record Record} structure array / numeric array, required): The ```inReal``` parameter is used to specify the K-line data.
- `optInFastPeriod` (number, optional): The ```optInFastPeriod``` parameter is used to set the fast period, default value is 12.
- `optInSlowPeriod` (number, optional): The ```optInSlowPeriod``` parameter is used to set the slow period, default value is 26.
- `optInMAType` (number, optional): The ```optInMAType``` parameter is used to set the moving average type, default value is 0.

Returns (array): The ```talib.PPO()``` function returns a one-dimensional array.

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

The ```PPO()``` function is described in the talib library documentation as: ```PPO(Records[Close],Fast Period = 12,Slow Period = 26,MA Type = 0) = Array(outReal)```

##### talib.ROC

```
talib.ROC(inReal)
talib.ROC(inReal, optInTimePeriod)
```

The ```talib.ROC()``` function is used to calculate the **Rate of Change indicator: ((price/prevPrice)-1)*100**.

Parameters:

- `inReal` ({@struct/Record Record} structure array / numeric array, required): The ```inReal``` parameter is used to specify the K-line data.
- `optInTimePeriod` (number, optional): The ```optInTimePeriod``` parameter is used to set the calculation period, with a default value of 10.

Returns (array): The ```talib.ROC()``` function returns a one-dimensional array.

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

The ```ROC()``` function is described in the talib library documentation as: ```ROC(Records[Close],Time Period = 10) = Array(outReal)```

##### talib.ROCP

```
talib.ROCP(inReal)
talib.ROCP(inReal, optInTimePeriod)
```

The ```talib.ROCP()``` function is used to calculate **Rate of change Percentage: (price-prevPrice)/prevPrice**.

Parameters:

- `inReal` ({@struct/Record Record} structure array / numeric array, required): The ```inReal``` parameter is used to specify the K-line data.
- `optInTimePeriod` (number, optional): The ```optInTimePeriod``` parameter is used to set the calculation period, with a default value of 10.

Returns (array): The ```talib.ROCP()``` function returns a one-dimensional array.

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

The ```ROCP()``` function is described in the talib library documentation as: ```ROCP(Records[Close],Time Period = 10) = Array(outReal)```

##### talib.ROCR

```
talib.ROCR(inReal)
talib.ROCR(inReal, optInTimePeriod)
```

The ```talib.ROCR()``` function is used to calculate **Rate of change ratio: (price/prevPrice)**.

Parameters:

- `inReal` ({@struct/Record Record} structure array / numeric array, required): The ```inReal``` parameter is used to specify the K-line data.
- `optInTimePeriod` (number, optional): The ```optInTimePeriod``` parameter is used to set the calculation period, with a default value of 10.

Returns (array): The ```talib.ROCR()``` function returns a one-dimensional array.

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

The ```ROCR()``` function is described in the talib library documentation as: ```ROCR(Records[Close],Time Period = 10) = Array(outReal)```

##### talib.ROCR100

```
talib.ROCR100(inReal)
talib.ROCR100(inReal, optInTimePeriod)
```

The ```talib.ROCR100()``` function is used to calculate **Rate of change ratio 100 scale: (price/prevPrice)*100**.

Parameters:

- `inReal` ({@struct/Record Record} structure array / numeric array, required): The ```inReal``` parameter is used to specify the K-line data.
- `optInTimePeriod` (number, optional): The ```optInTimePeriod``` parameter is used to set the calculation period, with a default value of 10.

Returns (array): The ```talib.ROCR100()``` function returns a one-dimensional array.

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

The ```ROCR100()``` function is described in the talib library documentation as: ```ROCR100(Records[Close],Time Period = 10) = Array(outReal)```

##### talib.RSI

```
talib.RSI(inReal)
talib.RSI(inReal, optInTimePeriod)
```

The ```talib.RSI()``` function is used to calculate the **Relative Strength Index**.

Parameters:

- `inReal` ({@struct/Record Record} structure array / numeric array, required): The ```inReal``` parameter is used to specify the K-line data.
- `optInTimePeriod` (number, optional): The ```optInTimePeriod``` parameter is used to set the calculation period, with a default value of 14.

Returns (array): The ```talib.RSI()``` function returns a one-dimensional array.

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

The ```RSI()``` function is described in the talib library documentation as: ```RSI(Records[Close],Time Period = 14) = Array(outReal)```

##### talib.STOCH

```
talib.STOCH(inPriceHLC)
talib.STOCH(inPriceHLC, optInFastK_Period)
talib.STOCH(inPriceHLC, optInFastK_Period, optInSlowK_Period)
talib.STOCH(inPriceHLC, optInFastK_Period, optInSlowK_Period, optInSlowK_MAType)
talib.STOCH(inPriceHLC, optInFastK_Period, optInSlowK_Period, optInSlowK_MAType, optInSlowD_Period)
talib.STOCH(inPriceHLC, optInFastK_Period, optInSlowK_Period, optInSlowK_MAType, optInSlowD_Period, optInSlowD_MAType)
```

The ```talib.STOCH()``` function is used to calculate the **Stochastic Oscillator (STOCH indicator)**.

Parameters:

- `inPriceHLC` ({@struct/Record Record} structure array, required): The ```inPriceHLC``` parameter is used to specify the K-line data.
- `optInFastK_Period` (number, optional): The ```optInFastK_Period``` parameter is used to set the Fast-K period, default value is 5.
- `optInSlowK_Period` (number, optional): The ```optInSlowK_Period``` parameter is used to set the Slow-K period, default value is 3.
- `optInSlowK_MAType` (number, optional): The ```optInSlowK_MAType``` parameter is used to set the Slow-K moving average type, default value is 0.
- `optInSlowD_Period` (number, optional): The ```optInSlowD_Period``` parameter is used to set the Slow-D period, default value is 3.
- `optInSlowD_MAType` (number, optional): The ```optInSlowD_MAType``` parameter is used to set the Slow-D moving average type, default value is 0.

Returns (array): The ```talib.STOCH()``` function returns a two-dimensional array.

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

The ```STOCH()``` function is described in the talib library documentation as: ```STOCH(Records[High,Low,Close],Fast-K Period = 5,Slow-K Period = 3,Slow-K MA = 0,Slow-D Period = 3,Slow-D MA = 0) = [Array(outSlowK),Array(outSlowD)]```

##### talib.STOCHF

```
talib.STOCHF(inPriceHLC)
talib.STOCHF(inPriceHLC, optInFastK_Period)
talib.STOCHF(inPriceHLC, optInFastK_Period, optInFastD_Period)
talib.STOCHF(inPriceHLC, optInFastK_Period, optInFastD_Period, optInFastD_MAType)
```

The ```talib.STOCHF()``` function is used to calculate **Stochastic Fast**.

Parameters:

- `inPriceHLC` ({@struct/Record Record} structure array, required): The ```inPriceHLC``` parameter is used to specify the K-line data.
- `optInFastK_Period` (number, optional): The ```optInFastK_Period``` parameter is used to set the Fast-K period, default value is 5.
- `optInFastD_Period` (number, optional): The ```optInFastD_Period``` parameter is used to set the Fast-D period, default value is 3.
- `optInFastD_MAType` (number, optional): The ```optInFastD_MAType``` parameter is used to set the Fast-D moving average type, default value is 0.

Returns (array): The ```talib.STOCHF()``` function returns a two-dimensional array.

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

The ```STOCHF()``` function is described in the talib library documentation as: ```STOCHF(Records[High,Low,Close],Fast-K Period = 5,Fast-D Period = 3,Fast-D MA = 0) = [Array(outFastK),Array(outFastD)]```

##### talib.STOCHRSI

```
talib.STOCHRSI(inReal)
talib.STOCHRSI(inReal, optInTimePeriod)
talib.STOCHRSI(inReal, optInTimePeriod, optInFastK_Period)
talib.STOCHRSI(inReal, optInTimePeriod, optInFastK_Period, optInFastD_Period)
talib.STOCHRSI(inReal, optInTimePeriod, optInFastK_Period, optInFastD_Period, optInFastD_MAType)
```

The ```talib.STOCHRSI()``` function is used to calculate the **Stochastic Relative Strength Index**.

Parameters:

- `inReal` ({@struct/Record Record} structure array / numeric array, required): The ```inReal``` parameter is used to specify the price data.
- `optInTimePeriod` (number, optional): The ```optInTimePeriod``` parameter is used to set the calculation period, default value is 14.
- `optInFastK_Period` (number, optional): The ```optInFastK_Period``` parameter is used to set the Fast-K line period, default value is 5.
- `optInFastD_Period` (number, optional): The ```optInFastD_Period``` parameter is used to set the Fast-D line period, default value is 3.
- `optInFastD_MAType` (number, optional): The ```optInFastD_MAType``` parameter is used to set the Fast-D line moving average type, default value is 0.

Returns (array): The ```talib.STOCHRSI()``` function returns a two-dimensional array containing two arrays: Fast-K and Fast-D.

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

The ```STOCHRSI()``` function is described in the talib library documentation as: ```STOCHRSI(Records[Close],Time Period = 14,Fast-K Period = 5,Fast-D Period = 3,Fast-D MA = 0) = [Array(outFastK),Array(outFastD)]```

##### talib.TRIX

```
talib.TRIX(inReal)
talib.TRIX(inReal, optInTimePeriod)
```

The ```talib.TRIX()``` function is used to calculate **1-day Rate-Of-Change (ROC) of a Triple Smooth EMA**.

Parameters:

- `inReal` ({@struct/Record Record} structure array / numeric array, required): The ```inReal``` parameter is used to specify the K-line data.
- `optInTimePeriod` (number, optional): The ```optInTimePeriod``` parameter is used to set the calculation period, with a default value of 30.

Returns (array): The ```talib.TRIX()``` function returns a one-dimensional array.

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

The ```TRIX()``` function is described in the talib library documentation as: ```TRIX(Records[Close],Time Period = 30) = Array(outReal)```

##### talib.ULTOSC

```
talib.ULTOSC(inPriceHLC)
talib.ULTOSC(inPriceHLC, optInTimePeriod1)
talib.ULTOSC(inPriceHLC, optInTimePeriod1, optInTimePeriod2)
talib.ULTOSC(inPriceHLC, optInTimePeriod1, optInTimePeriod2, optInTimePeriod3)
```

The ```talib.ULTOSC()``` function is used to calculate the **Ultimate Oscillator**.

Parameters:

- `inPriceHLC` ({@struct/Record Record} structure array, required): The ```inPriceHLC``` parameter is used to specify the K-line data.
- `optInTimePeriod1` (number, optional): The ```optInTimePeriod1``` parameter is used to set the first time period, with a default value of 7.
- `optInTimePeriod2` (number, optional): The ```optInTimePeriod2``` parameter is used to set the second time period, with a default value of 14.
- `optInTimePeriod3` (number, optional): The ```optInTimePeriod3``` parameter is used to set the third time period, with a default value of 28.

Returns (array): The ```talib.ULTOSC()``` function returns a one-dimensional array.

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

The ```ULTOSC()``` function is described in the talib library documentation as: ```ULTOSC(Records[High,Low,Close],First Period = 7,Second Period = 14,Third Period = 28) = Array(outReal)```

##### talib.WILLR

```
talib.WILLR(inPriceHLC)
talib.WILLR(inPriceHLC, optInTimePeriod)
```

The ```talib.WILLR()``` function is used to calculate **Williams' %R (Williams Percent Range)**.

Parameters:

- `inPriceHLC` ({@struct/Record Record} structure array, required): The ```inPriceHLC``` parameter is used to specify the K-line data.
- `optInTimePeriod` (number, optional): The ```optInTimePeriod``` parameter is used to set the calculation period, with a default value of 14.

Returns (array): The ```talib.WILLR()``` function returns a one-dimensional array.

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

The ```WILLR()``` function is described in the talib library documentation as: ```WILLR(Records[High,Low,Close],Time Period = 14) = Array(outReal)```

#### VolumeIndicators

Volume indicators: AD, ADOSC and OBV.

##### talib.AD

```
talib.AD(inPriceHLCV)
```

The ```talib.AD()``` function is used to calculate the **Chaikin A/D Line (Accumulation/Distribution Line indicator)**.

Parameters:

- `inPriceHLCV` ({@struct/Record Record} structure array, required): The ```inPriceHLCV``` parameter is used to specify the K-line data.

Returns (array): The ```talib.AD()``` function returns a one-dimensional array.

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

The ```AD()``` function is described in the talib library documentation as: ```AD(Records[High,Low,Close,Volume]) = Array(outReal)```

##### talib.ADOSC

```
talib.ADOSC(inPriceHLCV)
talib.ADOSC(inPriceHLCV, optInFastPeriod, optInSlowPeriod)
```

The ```talib.ADOSC()``` function is used to calculate **Chaikin A/D Oscillator**.

Parameters:

- `inPriceHLCV` ({@struct/Record Record} structure array, required): The ```inPriceHLCV``` parameter is used to specify the K-line data.
- `optInFastPeriod` (number, optional): The ```optInFastPeriod``` parameter is used to set the fast period.
- `optInSlowPeriod` (number, optional): The ```optInSlowPeriod``` parameter is used to set the slow period.

Returns (array): The ```talib.ADOSC()``` function returns a one-dimensional array.

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

The ```ADOSC()``` function is described in the talib library documentation as: ```ADOSC(Records[High,Low,Close,Volume],Fast Period = 3,Slow Period = 10) = Array(outReal)```

##### talib.OBV

```
talib.OBV(inReal)
talib.OBV(inReal, inPriceV)
```

The ```talib.OBV()``` function is used to calculate **On Balance Volume**.

Parameters:

- `inReal` ({@struct/Record Record} structure array / numeric array, required): The ```inReal``` parameter is used to specify K-line data.
- `inPriceV` ({@struct/Record Record} structure array, optional): The ```inPriceV``` parameter is used to specify K-line data.

Returns (array): The ```talib.OBV()``` function returns a one-dimensional array.

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

The ```OBV()``` function is described in the talib library documentation as: ```OBV(Records[Close],Records[Volume]) = Array(outReal)```

#### VolatilityIndicators

Volatility indicators: ATR, NATR and TRANGE.

##### talib.ATR

```
talib.ATR(inPriceHLC)
talib.ATR(inPriceHLC, optInTimePeriod)
```

The ```talib.ATR()``` function is used to calculate the **Average True Range** indicator.

Parameters:

- `inPriceHLC` ({@struct/Record Record} structure array, required): The ```inPriceHLC``` parameter is used to specify the K-line data.
- `optInTimePeriod` (number, optional): The ```optInTimePeriod``` parameter is used to set the calculation period, with a default value of 14.

Returns (array): The ```talib.ATR()``` function returns a one-dimensional array.

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

The ```ATR()``` function is described in the talib library documentation as: ```ATR(Records[High,Low,Close],Time Period = 14) = Array(outReal)```

##### talib.NATR

```
talib.NATR(inPriceHLC)
talib.NATR(inPriceHLC, optInTimePeriod)
```

The ```talib.NATR()``` function is used to calculate **Normalized Average True Range**.

Parameters:

- `inPriceHLC` ({@struct/Record Record} structure array, required): The ```inPriceHLC``` parameter is used to specify the K-line data.
- `optInTimePeriod` (number, optional): The ```optInTimePeriod``` parameter is used to set the calculation period, with a default value of 14.

Returns (array): The ```talib.NATR()``` function returns a one-dimensional array.

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

The ```NATR()``` function is described in the talib library documentation as: ```NATR(Records[High,Low,Close],Time Period = 14) = Array(outReal)```

##### talib.TRANGE

```
talib.TRANGE(inPriceHLC)
```

The ```talib.TRANGE()``` function is used to calculate the **True Range** indicator.

Parameters:

- `inPriceHLC` ({@struct/Record Record} structure array, required): The ```inPriceHLC``` parameter is used to specify the K-line data.

Returns (array): The ```talib.TRANGE()``` function returns a one-dimensional array.

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

The ```TRANGE()``` function is described in the talib library documentation as: ```TRANGE(Records[High,Low,Close]) = Array(outReal)```

#### CycleIndicators

Cycle indicators (Hilbert transform).

##### talib.HT_DCPERIOD

```
talib.HT_DCPERIOD(inReal)
```

The ```talib.HT_DCPERIOD()``` function is used to calculate **Hilbert Transform - Dominant Cycle Period**.

Parameters:

- `inReal` ({@struct/Record Record} structure array / numeric array, required): The ```inReal``` parameter is used to specify K-line data.

Returns (array): The ```talib.HT_DCPERIOD()``` function returns a one-dimensional array.

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

The ```HT_DCPERIOD()``` function is described in the talib library documentation as: ```HT_DCPERIOD(Records[Close]) = Array(outReal)```

##### talib.HT_DCPHASE

```
talib.HT_DCPHASE(inReal)
```

The ```talib.HT_DCPHASE()``` function is used to calculate the **Hilbert Transform - Dominant Cycle Phase**.

Parameters:

- `inReal` ({@struct/Record Record} structure array / numeric array, required): The ```inReal``` parameter is used to specify the input K-line data.

Returns (array): The ```talib.HT_DCPHASE()``` function returns a one-dimensional array.

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

The ```HT_DCPHASE()``` function is described in the talib library documentation as: ```HT_DCPHASE(Records[Close]) = Array(outReal)```

##### talib.HT_PHASOR

```
talib.HT_PHASOR(inReal)
```

The ```talib.HT_PHASOR()``` function is used to calculate **Hilbert Transform - Phasor Components**.

Parameters:

- `inReal` ({@struct/Record Record} structure array / numeric array, required): The ```inReal``` parameter is used to specify the input K-line data.

Returns (array): The ```talib.HT_PHASOR()``` function returns a two-dimensional array.

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

The ```HT_PHASOR()``` function is described in the talib library documentation as: ```HT_PHASOR(Records[Close]) = [Array(outInPhase),Array(outQuadrature)]```

##### talib.HT_SINE

```
talib.HT_SINE(inReal)
```

The ```talib.HT_SINE()``` function is used to calculate **Hilbert Transform - SineWave**.

Parameters:

- `inReal` ({@struct/Record Record} structure array / numeric array, required): The ```inReal``` parameter is used to specify the K-line data.

Returns (array): The ```talib.HT_SINE()``` function returns a two-dimensional array.

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

The ```HT_SINE()``` function is described in the talib library documentation as: ```HT_SINE(Records[Close]) = [Array(outSine),Array(outLeadSine)]```

##### talib.HT_TRENDMODE

```
talib.HT_TRENDMODE(inReal)
```

The ```talib.HT_TRENDMODE()``` function is used to calculate **Hilbert Transform - Trend vs Cycle Mode**.

Parameters:

- `inReal` ({@struct/Record Record} structure array / numeric array, required): The ```inReal``` parameter is used to specify the K-line data.

Returns (array): The ```talib.HT_TRENDMODE()``` function returns a one-dimensional array.

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

The ```HT_TRENDMODE()``` function is described in the talib library documentation as: ```HT_TRENDMODE(Records[Close]) = Array(outInteger)```

#### PriceTransform

Price transforms: average, median, typical and weighted close price.

##### talib.AVGPRICE

```
talib.AVGPRICE(inPriceOHLC)
```

The ```talib.AVGPRICE()``` function is used to calculate **Average Price**.

Parameters:

- `inPriceOHLC` ({@struct/Record Record} structure array, required): The ```inPriceOHLC``` parameter is used to specify K-line data.

Returns (array): The ```talib.AVGPRICE()``` function returns a one-dimensional array.

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

The ```AVGPRICE()``` function is described in the talib library documentation as: ```AVGPRICE(Records[Open,High,Low,Close]) = Array(outReal)```

##### talib.MEDPRICE

```
talib.MEDPRICE(inPriceHL)
```

The ```talib.MEDPRICE()``` function is used to calculate **Median Price**.

Parameters:

- `inPriceHL` ({@struct/Record Record} structure array, required): The ```inPriceHL``` parameter is used to specify K-line data.

Returns (array): The ```talib.MEDPRICE()``` function returns a one-dimensional array.

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

The ```MEDPRICE()``` function is described in the talib library documentation as: ```MEDPRICE(Records[High,Low]) = Array(outReal)```

##### talib.TYPPRICE

```
talib.TYPPRICE(inPriceHLC)
```

The ```talib.TYPPRICE()``` function is used to calculate **Typical Price**.

Parameters:

- `inPriceHLC` ({@struct/Record Record} structure array, required): The ```inPriceHLC``` parameter is used to specify K-line data.

Returns (array): The ```talib.TYPPRICE()``` function returns a one-dimensional array.

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

The ```TYPPRICE()``` function is described in the talib library documentation as: ```TYPPRICE(Records[High,Low,Close]) = Array(outReal)```

##### talib.WCLPRICE

```
talib.WCLPRICE(inPriceHLC)
```

The ```talib.WCLPRICE()``` function is used to calculate **Weighted Close Price**.

Parameters:

- `inPriceHLC` ({@struct/Record Record} structure array, required): The ```inPriceHLC``` parameter is used to specify K-line data.

Returns (array): The ```talib.WCLPRICE()``` function returns a one-dimensional array.

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

The ```WCLPRICE()``` function is described in the talib library documentation as: ```WCLPRICE(Records[High,Low,Close]) = Array(outReal)```

#### StatisticFunctions

Statistic functions: linear regression, standard deviation, variance and time series forecast.

##### talib.LINEARREG

```
talib.LINEARREG(inReal)
talib.LINEARREG(inReal, optInTimePeriod)
```

The ```talib.LINEARREG()``` function is used to calculate the **Linear Regression** indicator.

Parameters:

- `inReal` ({@struct/Record Record} structure array / numeric array, required): The ```inReal``` parameter is used to specify the input K-line data.
- `optInTimePeriod` (number, optional): The ```optInTimePeriod``` parameter is used to set the calculation period, with a default value of 14.

Returns (array): The ```talib.LINEARREG()``` function returns a one-dimensional array containing the linear regression calculation results.

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

The ```LINEARREG()``` function is described in the talib library documentation as: ```LINEARREG(Records[Close],Time Period = 14) = Array(outReal)```

##### talib.LINEARREG_ANGLE

```
talib.LINEARREG_ANGLE(inReal)
talib.LINEARREG_ANGLE(inReal, optInTimePeriod)
```

The ```talib.LINEARREG_ANGLE()``` function is used to calculate **Linear Regression Angle**.

Parameters:

- `inReal` ({@struct/Record Record} structure array / numeric array, required): The ```inReal``` parameter is used to specify the K-line data.
- `optInTimePeriod` (number, optional): The ```optInTimePeriod``` parameter is used to set the calculation period, with a default value of 14.

Returns (array): The ```talib.LINEARREG_ANGLE()``` function returns a one-dimensional array.

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

The ```LINEARREG_ANGLE()``` function is described in the talib library documentation as: ```LINEARREG_ANGLE(Records[Close],Time Period = 14) = Array(outReal)```

##### talib.LINEARREG_INTERCEPT

```
talib.LINEARREG_INTERCEPT(inReal)
talib.LINEARREG_INTERCEPT(inReal, optInTimePeriod)
```

The ```talib.LINEARREG_INTERCEPT()``` function is used to calculate the **Linear Regression Intercept**.

Parameters:

- `inReal` ({@struct/Record Record} structure array / numeric array, required): The ```inReal``` parameter is used to specify the K-line data.
- `optInTimePeriod` (number, optional): The ```optInTimePeriod``` parameter is used to set the calculation period, with a default value of 14.

Returns (array): The ```talib.LINEARREG_INTERCEPT()``` function returns a one-dimensional array.

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

The ```LINEARREG_INTERCEPT()``` function is described in the talib library documentation as: ```LINEARREG_INTERCEPT(Records[Close],Time Period = 14) = Array(outReal)```

##### talib.LINEARREG_SLOPE

```
talib.LINEARREG_SLOPE(inReal)
talib.LINEARREG_SLOPE(inReal, optInTimePeriod)
```

The ```talib.LINEARREG_SLOPE()``` function is used to calculate **Linear Regression Slope**.

Parameters:

- `inReal` ({@struct/Record Record} structure array / numeric array, required): The ```inReal``` parameter is used to specify the K-line data.
- `optInTimePeriod` (number, optional): The ```optInTimePeriod``` parameter is used to set the calculation period, with a default value of 14.

Returns (array): The ```talib.LINEARREG_SLOPE()``` function returns a one-dimensional array.

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

The ```LINEARREG_SLOPE()``` function is described in the talib library documentation as: ```LINEARREG_SLOPE(Records[Close],Time Period = 14) = Array(outReal)```

##### talib.STDDEV

```
talib.STDDEV(inReal)
talib.STDDEV(inReal, optInTimePeriod)
talib.STDDEV(inReal, optInTimePeriod, optInNbDev)
```

The ```talib.STDDEV()``` function is used to calculate **Standard Deviation**.

Parameters:

- `inReal` ({@struct/Record Record} structure array / numeric array, required): The ```inReal``` parameter is used to specify the K-line data.
- `optInTimePeriod` (number, optional): The ```optInTimePeriod``` parameter is used to set the calculation period, with a default value of 5.
- `optInNbDev` (number, optional): The ```optInNbDev``` parameter is used to set the deviation multiplier, with a default value of 1.

Returns (array): The ```talib.STDDEV()``` function returns a one-dimensional array.

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

The ```STDDEV()``` function is described in the talib library documentation as: ```STDDEV(Records[Close],Time Period = 5,Deviations = 1) = Array(outReal)```

##### talib.TSF

```
talib.TSF(inReal)
talib.TSF(inReal, optInTimePeriod)
```

The ```talib.TSF()``` function is used to calculate **Time Series Forecast**.

Parameters:

- `inReal` ({@struct/Record Record} structure array / numeric array, required): The ```inReal``` parameter is used to specify the K-line data.
- `optInTimePeriod` (number, optional): The ```optInTimePeriod``` parameter is used to set the calculation period, with a default value of 14.

Returns (array): The ```talib.TSF()``` function returns a one-dimensional array.

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

The ```TSF()``` function is described in the talib library documentation as: ```TSF(Records[Close],Time Period = 14) = Array(outReal)```

##### talib.VAR

```
talib.VAR(inReal)
talib.VAR(inReal, optInTimePeriod)
talib.VAR(inReal, optInTimePeriod, optInNbDev)
```

The ```talib.VAR()``` function is used to calculate **Variance**.

Parameters:

- `inReal` ({@struct/Record Record} structure array / numeric array, required): The ```inReal``` parameter is used to specify the K-line data.
- `optInTimePeriod` (number, optional): The ```optInTimePeriod``` parameter is used to set the calculation period, with a default value of 5.
- `optInNbDev` (number, optional): The ```optInNbDev``` parameter is used to set the standard deviation multiplier, with a default value of 1.

Returns (array): The ```talib.VAR()``` function returns a one-dimensional array.

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

The ```VAR()``` function is described in the talib library documentation as: ```VAR(Records[Close],Time Period = 5,Deviations = 1) = Array(outReal)```

#### MathTransform

Math transforms: trigonometric functions, exponent, logarithm, rounding and square root.

##### talib.ACOS

```
talib.ACOS(inReal)
```

The ```talib.ACOS()``` function is used to calculate **Vector Trigonometric ACos**.

Parameters:

- `inReal` ({@struct/Record Record} structure array / numeric array, required): The ```inReal``` parameter is used to specify the input real number data.

Returns (array): The ```talib.ACOS()``` function returns a one-dimensional array containing the calculated arc cosine values.

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

The ```ACOS()``` function is described in the talib library documentation as: ```ACOS(Records[Close]) = Array(outReal)```

##### talib.ASIN

```
talib.ASIN(inReal)
```

The ```talib.ASIN()``` function is used to calculate **Vector Trigonometric ASin**.

Parameters:

- `inReal` ({@struct/Record Record} structure array / numeric array, required): The ```inReal``` parameter is used to specify the input real number data.

Returns (array): The ```talib.ASIN()``` function returns a one-dimensional array containing the calculated arcsine values.

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

The ```ASIN()``` function is described in the talib library documentation as: ```ASIN(Records[Close]) = Array(outReal)```

##### talib.ATAN

```
talib.ATAN(inReal)
```

The ```talib.ATAN()``` function is used to calculate **Vector Trigonometric ATan**.

Parameters:

- `inReal` ({@struct/Record Record} structure array / numeric array, required): The ```inReal``` parameter is used to specify the input real number data.

Returns (array): The ```talib.ATAN()``` function returns a one-dimensional array containing the calculated arctangent values.

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

The ```ATAN()``` function is described in the talib library documentation as: ```ATAN(Records[Close]) = Array(outReal)```

##### talib.CEIL

```
talib.CEIL(inReal)
```

The ```talib.CEIL()``` function is used to calculate **Vector Ceil**.

Parameters:

- `inReal` ({@struct/Record Record} structure array / numeric array, required): The ```inReal``` parameter is used to specify the input K-line data.

Returns (array): The ```talib.CEIL()``` function returns a one-dimensional array.

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

The ```CEIL()``` function is described in the talib library documentation as: ```CEIL(Records[Close]) = Array(outReal)```

##### talib.COS

```
talib.COS(inReal)
```

The ```talib.COS()``` function is used to calculate **Vector Trigonometric Cos**.

Parameters:

- `inReal` ({@struct/Record Record} structure array / numeric array, required): The ```inReal``` parameter is used to specify the input real number data sequence.

Returns (array): The ```talib.COS()``` function returns a one-dimensional array containing the cosine calculation results.

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

The ```COS()``` function is described in the talib library documentation as: ```COS(Records[Close]) = Array(outReal)```

##### talib.COSH

```
talib.COSH(inReal)
```

The ```talib.COSH()``` function is used to calculate **Vector Trigonometric Cosh**.

Parameters:

- `inReal` ({@struct/Record Record} structure array / numeric array, required): The ```inReal``` parameter is used to specify the input K-line data.

Returns (array): The ```talib.COSH()``` function returns a one-dimensional array containing the calculated hyperbolic cosine values.

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

The ```COSH()``` function is described in the talib library documentation as: ```COSH(Records[Close]) = Array(outReal)```

##### talib.EXP

```
talib.EXP(inReal)
```

The ```talib.EXP()``` function is used to calculate **Vector Arithmetic Exp**.

Parameters:

- `inReal` ({@struct/Record Record} structure array / numeric array, required): The ```inReal``` parameter is used to specify the input real number data.

Returns (array): The ```talib.EXP()``` function returns a one-dimensional array containing the exponential calculation results of the input data.

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

The ```EXP()``` function is described in the talib library documentation as: ```EXP(Records[Close]) = Array(outReal)```

##### talib.FLOOR

```
talib.FLOOR(inReal)
```

The ```talib.FLOOR()``` function is used to calculate **Vector Floor**.

Parameters:

- `inReal` ({@struct/Record Record} structure array / numeric array, required): The ```inReal``` parameter is used to specify the input K-line data.

Returns (array): The ```talib.FLOOR()``` function returns a one-dimensional array.

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

The ```FLOOR()``` function is described in the talib library documentation as: ```FLOOR(Records[Close]) = Array(outReal)```

##### talib.LN

```
talib.LN(inReal)
```

The ```talib.LN()``` function is used to calculate **Vector Log Natural**.

Parameters:

- `inReal` ({@struct/Record Record} structure array / numeric array, required): The ```inReal``` parameter is used to specify the input K-line data.

Returns (array): The ```talib.LN()``` function returns a one-dimensional array.

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

The ```LN()``` function is described in the talib library documentation as: ```LN(Records[Close]) = Array(outReal)```

##### talib.LOG10

```
talib.LOG10(inReal)
```

The ```talib.LOG10()``` function is used to calculate **Vector Log10 (logarithm function)**.

Parameters:

- `inReal` ({@struct/Record Record} structure array / numeric array, required): The ```inReal``` parameter is used to specify K-line data.

Returns (array): The return value of the ```talib.LOG10()``` function is a one-dimensional array.

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

The ```LOG10()``` function is described in the talib library documentation as: ```LOG10(Records[Close]) = Array(outReal)```

##### talib.SIN

```
talib.SIN(inReal)
```

The ```talib.SIN()``` function is used to calculate **Vector Trigonometric Sin**.

Parameters:

- `inReal` ({@struct/Record Record} structure array / numeric array, required): The ```inReal``` parameter is used to specify K-line data.

Returns (array): The ```talib.SIN()``` function returns a one-dimensional array.

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

The ```SIN()``` function is described in the talib library documentation as: ```SIN(Records[Close]) = Array(outReal)```

##### talib.SINH

```
talib.SINH(inReal)
```

The ```talib.SINH()``` function is used to calculate **Vector Trigonometric Sinh**.

Parameters:

- `inReal` ({@struct/Record Record} structure array / numeric array, required): The ```inReal``` parameter is used to specify the input real number data.

Returns (array): The ```talib.SINH()``` function returns a one-dimensional array containing the calculated hyperbolic sine values.

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

The ```SINH()``` function is described in the talib library documentation as: ```SINH(Records[Close]) = Array(outReal)```

##### talib.SQRT

```
talib.SQRT(inReal)
```

The ```talib.SQRT()``` function is used to calculate **Vector Square Root**.

Parameters:

- `inReal` ({@struct/Record Record} structure array / numeric array, required): The ```inReal``` parameter is used to specify the input numerical data.

Returns (array): The ```talib.SQRT()``` function returns a one-dimensional array containing the square root values of the input data.

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

The ```SQRT()``` function is described in the talib library documentation as: ```SQRT(Records[Close]) = Array(outReal)```

##### talib.TAN

```
talib.TAN(inReal)
```

The ```talib.TAN()``` function is used to calculate **Vector Trigonometric Tan**.

Parameters:

- `inReal` ({@struct/Record Record} structure array / numeric array, required): The ```inReal``` parameter is used to specify the input K-line data.

Returns (array): The ```talib.TAN()``` function returns a one-dimensional array.

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

The ```TAN()``` function is described in the talib library documentation as: ```TAN(Records[Close]) = Array(outReal)```

##### talib.TANH

```
talib.TANH(inReal)
```

The ```talib.TANH()``` function is used to calculate **Vector Trigonometric Tanh**.

Parameters:

- `inReal` ({@struct/Record Record} structure array / numeric array, required): The ```inReal``` parameter is used to specify the input real number data sequence.

Returns (array): The ```talib.TANH()``` function returns a one-dimensional array containing the hyperbolic tangent calculation results.

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

The ```TANH()``` function is described in the talib library documentation as: ```TANH(Records[Close]) = Array(outReal)```

#### MathOperators

Math operators: maximum and minimum over a period, their indexes, and sum.

##### talib.MAX

```
talib.MAX(inReal)
talib.MAX(inReal, optInTimePeriod)
```

The ```talib.MAX()``` function is used to calculate the **Highest value over a specified period**.

Parameters:

- `inReal` ({@struct/Record Record} structure array / numeric array, required): The ```inReal``` parameter is used to specify the K-line data.
- `optInTimePeriod` (number, optional): The ```optInTimePeriod``` parameter is used to set the calculation period, with a default value of 30.

Returns (array): The ```talib.MAX()``` function returns a one-dimensional array.

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

The ```MAX()``` function is described in the talib library documentation as: ```MAX(Records[Close],Time Period = 30) = Array(outReal)```

##### talib.MAXINDEX

```
talib.MAXINDEX(inReal)
talib.MAXINDEX(inReal, optInTimePeriod)
```

The ```talib.MAXINDEX()``` function is used to calculate the **Index of highest value over a specified period**.

Parameters:

- `inReal` ({@struct/Record Record} structure array / numeric array, required): The ```inReal``` parameter is used to specify the input K-line data.
- `optInTimePeriod` (number, optional): The ```optInTimePeriod``` parameter is used to set the calculation period, with a default value of 30.

Returns (array): The ```talib.MAXINDEX()``` function returns a one-dimensional array containing the index position of the maximum value within the specified period.

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

The ```MAXINDEX()``` function is described in the talib library documentation as: ```MAXINDEX(Records[Close],Time Period = 30) = Array(outInteger)```

##### talib.MIN

```
talib.MIN(inReal)
talib.MIN(inReal, optInTimePeriod)
```

The ```talib.MIN()``` function is used to calculate the **Lowest value over a specified period**.

Parameters:

- `inReal` ({@struct/Record Record} structure array / numeric array, required): The ```inReal``` parameter is used to specify the K-line data.
- `optInTimePeriod` (number, optional): The ```optInTimePeriod``` parameter is used to set the calculation period, with a default value of 30.

Returns (array): The ```talib.MIN()``` function returns a one-dimensional array.

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

The ```MIN()``` function is described in the talib library documentation as: ```MIN(Records[Close],Time Period = 30) = Array(outReal)```

##### talib.MININDEX

```
talib.MININDEX(inReal)
talib.MININDEX(inReal, optInTimePeriod)
```

The ```talib.MININDEX()``` function is used to calculate the **Index of lowest value over a specified period**.

Parameters:

- `inReal` ({@struct/Record Record} structure array / numeric array, required): The ```inReal``` parameter is used to specify the input K-line data.
- `optInTimePeriod` (number, optional): The ```optInTimePeriod``` parameter is used to set the calculation period, with a default value of 30.

Returns (array): The ```talib.MININDEX()``` function returns a one-dimensional array containing the index position of the minimum value within the specified period.

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

The ```MININDEX()``` function is described in the talib library documentation as: ```MININDEX(Records[Close],Time Period = 30) = Array(outInteger)```

##### talib.MINMAX

```
talib.MINMAX(inReal)
talib.MINMAX(inReal, optInTimePeriod)
```

The ```talib.MINMAX()``` function is used to calculate the **Lowest and highest values over a specified period**.

Parameters:

- `inReal` ({@struct/Record Record} structure array / numeric array, required): The ```inReal``` parameter is used to specify the input K-line data.
- `optInTimePeriod` (number, optional): The ```optInTimePeriod``` parameter is used to set the calculation period, with a default value of 30.

Returns (array): The ```talib.MINMAX()``` function returns a two-dimensional array. The first element of this two-dimensional array is the minimum values array, and the second element is the maximum values array.

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

The ```MINMAX()``` function is described in the talib library documentation as: ```MINMAX(Records[Close],Time Period = 30) = [Array(outMin),Array(outMax)]```

##### talib.MINMAXINDEX

```
talib.MINMAXINDEX(inReal)
talib.MINMAXINDEX(inReal, optInTimePeriod)
```

The ```talib.MINMAXINDEX()``` function is used to calculate **Indexes of lowest and highest values over a specified period**.

Parameters:

- `inReal` ({@struct/Record Record} structure array / numeric array, required): The ```inReal``` parameter is used to specify the input K-line data.
- `optInTimePeriod` (number, optional): The ```optInTimePeriod``` parameter is used to set the calculation period, with a default value of 30.

Returns (array): The ```talib.MINMAXINDEX()``` function returns a two-dimensional array. The first element of this array is the minimum value index array, and the second element is the maximum value index array.

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

The ```MINMAXINDEX()``` function is described in the talib library documentation as: ```MINMAXINDEX(Records[Close],Time Period = 30) = [Array(outMinIdx),Array(outMaxIdx)]```

##### talib.SUM

```
talib.SUM(inReal)
talib.SUM(inReal, optInTimePeriod)
```

The ```talib.SUM()``` function is used to calculate **Summation**.

Parameters:

- `inReal` ({@struct/Record Record} structure array / numeric array, required): The ```inReal``` parameter is used to specify the K-line data.
- `optInTimePeriod` (number, optional): The ```optInTimePeriod``` parameter is used to set the calculation period, with a default value of 30.

Returns (array): The ```talib.SUM()``` function returns a one-dimensional array.

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

The ```SUM()``` function is described in the talib library documentation as: ```SUM(Records[Close],Time Period = 30) = Array(outReal)```

#### PatternRecognition

Candlestick pattern recognition: a non-zero value where the pattern appears (positive for bullish, negative for bearish), otherwise 0.

##### talib.CDL2CROWS

```
talib.CDL2CROWS(inPriceOHLC)
```

The ```talib.CDL2CROWS()``` function is used to calculate **Two Crows (K-line pattern - Two Crows)**.

Parameters:

- `inPriceOHLC` ({@struct/Record Record} structure array, required): The ```inPriceOHLC``` parameter is used to specify K-line data.

Returns (array): The ```talib.CDL2CROWS()``` function returns a one-dimensional array.

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

The ```CDL2CROWS()``` function is described in the talib library documentation as: ```CDL2CROWS(Records[Open,High,Low,Close]) = Array(outInteger)```

For calls in ```Python``` language, the parameter passing method is different and needs to be passed according to the above description: ```Records[Open,High,Low,Close]```.

For example, split a variable ```records``` (i.e., parameter ```inPriceOHLC```, type `Record` structure array) into:

```Open``` list: represented as ```records.Open``` in Python.

```High``` list: represented as ```records.High``` in Python.

```Low``` list: represented as ```records.Low``` in Python.

```Close``` list: represented as ```records.Close``` in Python.

Calling method in Python strategy code:

```
talib.CDL2CROWS(records.Open, records.High, records.Low, records.Close)
```

The calling methods for other ```talib``` indicators are similar and will not be repeated.

##### talib.CDL3BLACKCROWS

```
talib.CDL3BLACKCROWS(inPriceOHLC)
```

The ```talib.CDL3BLACKCROWS()``` function is used to calculate **Three Black Crows (K-line pattern - Three Black Crows)**.

Parameters:

- `inPriceOHLC` ({@struct/Record Record} structure array, required): The ```inPriceOHLC``` parameter is used to specify K-line data.

Returns (array): The ```talib.CDL3BLACKCROWS()``` function returns a one-dimensional array.

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

The ```CDL3BLACKCROWS()``` function is described in the talib library documentation as: ```CDL3BLACKCROWS(Records[Open,High,Low,Close]) = Array(outInteger)```

##### talib.CDL3INSIDE

```
talib.CDL3INSIDE(inPriceOHLC)
```

The ```talib.CDL3INSIDE()``` function is used to calculate **Three Inside Up/Down (Candlestick Pattern: Three Inside Up/Down)**.

Parameters:

- `inPriceOHLC` ({@struct/Record Record} structure array, required): The ```inPriceOHLC``` parameter is used to specify the K-line data.

Returns (array): The ```talib.CDL3INSIDE()``` function returns a one-dimensional array.

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

The ```CDL3INSIDE()``` function is described in the talib library documentation as: ```CDL3INSIDE(Records[Open,High,Low,Close]) = Array(outInteger)```

##### talib.CDL3LINESTRIKE

```
talib.CDL3LINESTRIKE(inPriceOHLC)
```

The ```talib.CDL3LINESTRIKE()``` function is used to calculate **Three-Line Strike (Candlestick Pattern: Three-Line Strike)**.

Parameters:

- `inPriceOHLC` ({@struct/Record Record} structure array, required): The ```inPriceOHLC``` parameter is used to specify the K-line data.

Returns (array): The ```talib.CDL3LINESTRIKE()``` function returns a one-dimensional array.

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

The ```CDL3LINESTRIKE()``` function is described in the talib library documentation as: ```CDL3LINESTRIKE(Records[Open,High,Low,Close]) = Array(outInteger)```

##### talib.CDL3OUTSIDE

```
talib.CDL3OUTSIDE(inPriceOHLC)
```

The ```talib.CDL3OUTSIDE()``` function is used to calculate **Three Outside Up/Down (Candlestick Pattern: Three Outside)**.

Parameters:

- `inPriceOHLC` ({@struct/Record Record} structure array, required): The ```inPriceOHLC``` parameter is used to specify the K-line data.

Returns (array): The ```talib.CDL3OUTSIDE()``` function returns a one-dimensional array.

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

The ```CDL3OUTSIDE()``` function is described in the talib library documentation as: ```CDL3OUTSIDE(Records[Open,High,Low,Close]) = Array(outInteger)```

##### talib.CDL3STARSINSOUTH

```
talib.CDL3STARSINSOUTH(inPriceOHLC)
```

The ```talib.CDL3STARSINSOUTH()``` function is used to calculate **Three Stars In The South (Candlestick Pattern: Three Stars In The South)**.

Parameters:

- `inPriceOHLC` ({@struct/Record Record} structure array, required): The ```inPriceOHLC``` parameter is used to specify the K-line data.

Returns (array): The ```talib.CDL3STARSINSOUTH()``` function returns a one-dimensional array.

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

The ```CDL3STARSINSOUTH()``` function is described in the talib library documentation as: ```CDL3STARSINSOUTH(Records[Open,High,Low,Close]) = Array(outInteger)```

##### talib.CDL3WHITESOLDIERS

```
talib.CDL3WHITESOLDIERS(inPriceOHLC)
```

The ```talib.CDL3WHITESOLDIERS()``` function is used to calculate **Three Advancing White Soldiers (K-line pattern: Three White Soldiers)**.

Parameters:

- `inPriceOHLC` ({@struct/Record Record} structure array, required): The ```inPriceOHLC``` parameter is used to specify K-line data.

Returns (array): The ```talib.CDL3WHITESOLDIERS()``` function returns a one-dimensional array.

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

The ```CDL3WHITESOLDIERS()``` function is described in the talib library documentation as: ```CDL3WHITESOLDIERS(Records[Open,High,Low,Close]) = Array(outInteger)```

##### talib.CDLABANDONEDBABY

```
talib.CDLABANDONEDBABY(inPriceOHLC)
talib.CDLABANDONEDBABY(inPriceOHLC, optInPenetration)
```

The ```talib.CDLABANDONEDBABY()``` function is used to calculate **Abandoned Baby (Candlestick Pattern: Abandoned Baby)**.

Parameters:

- `inPriceOHLC` ({@struct/Record Record} structure array, required): The ```inPriceOHLC``` parameter is used to specify the K-line data.
- `optInPenetration` (number, optional): The ```optInPenetration``` parameter is used to set the penetration, with a default value of 0.3.

Returns (array): The ```talib.CDLABANDONEDBABY()``` function returns a one-dimensional array.

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

The ```CDLABANDONEDBABY()``` function is described in the talib library documentation as: ```CDLABANDONEDBABY(Records[Open,High,Low,Close],Penetration = 0.3) = Array(outInteger)```

##### talib.CDLADVANCEBLOCK

```
talib.CDLADVANCEBLOCK(inPriceOHLC)
```

The ```talib.CDLADVANCEBLOCK()``` function is used to calculate **Advance Block (Candlestick Pattern: Advance Block)**.

Parameters:

- `inPriceOHLC` ({@struct/Record Record} structure array, required): The ```inPriceOHLC``` parameter is used to specify the K-line data.

Returns (array): The ```talib.CDLADVANCEBLOCK()``` function returns a one-dimensional array.

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

The ```CDLADVANCEBLOCK()``` function is described in the talib library documentation as: ```CDLADVANCEBLOCK(Records[Open,High,Low,Close]) = Array(outInteger)```

##### talib.CDLBELTHOLD

```
talib.CDLBELTHOLD(inPriceOHLC)
```

The ```talib.CDLBELTHOLD()``` function is used to calculate **Belt-hold (Candlestick Pattern: Belt-hold)**.

Parameters:

- `inPriceOHLC` ({@struct/Record Record} structure array, required): The ```inPriceOHLC``` parameter is used to specify the K-line data.

Returns (array): The ```talib.CDLBELTHOLD()``` function returns a one-dimensional array.

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

The ```CDLBELTHOLD()``` function is described in the talib library documentation as: ```CDLBELTHOLD(Records[Open,High,Low,Close]) = Array(outInteger)```

##### talib.CDLBREAKAWAY

```
talib.CDLBREAKAWAY(inPriceOHLC)
```

The ```talib.CDLBREAKAWAY()``` function is used to calculate **Breakaway (Candlestick Pattern: Breakaway Pattern)**.

Parameters:

- `inPriceOHLC` ({@struct/Record Record} structure array, required): The ```inPriceOHLC``` parameter is used to specify the K-line data.

Returns (array): The ```talib.CDLBREAKAWAY()``` function returns a one-dimensional array.

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

The ```CDLBREAKAWAY()``` function is described in the talib library documentation as: ```CDLBREAKAWAY(Records[Open,High,Low,Close]) = Array(outInteger)```

##### talib.CDLCLOSINGMARUBOZU

```
talib.CDLCLOSINGMARUBOZU(inPriceOHLC)
```

The ```talib.CDLCLOSINGMARUBOZU()``` function is used to calculate the **Closing Marubozu** candlestick pattern.

Parameters:

- `inPriceOHLC` ({@struct/Record Record} structure array, required): The ```inPriceOHLC``` parameter is used to specify the K-line data.

Returns (array): The ```talib.CDLCLOSINGMARUBOZU()``` function returns a one-dimensional array.

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

The ```CDLCLOSINGMARUBOZU()``` function is described in the talib library documentation as: ```CDLCLOSINGMARUBOZU(Records[Open,High,Low,Close]) = Array(outInteger)```

##### talib.CDLCONCEALBABYSWALL

```
talib.CDLCONCEALBABYSWALL(inPriceOHLC)
```

The ```talib.CDLCONCEALBABYSWALL()``` function is used to calculate **Concealing Baby Swallow (Candlestick Pattern: Concealing Baby Swallow)**.

Parameters:

- `inPriceOHLC` ({@struct/Record Record} structure array, required): The ```inPriceOHLC``` parameter is used to specify the K-line data.

Returns (array): The ```talib.CDLCONCEALBABYSWALL()``` function returns a one-dimensional array.

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

The ```CDLCONCEALBABYSWALL()``` function is described in the talib library documentation as: ```CDLCONCEALBABYSWALL(Records[Open,High,Low,Close]) = Array(outInteger)```

##### talib.CDLCOUNTERATTACK

```
talib.CDLCOUNTERATTACK(inPriceOHLC)
```

The ```talib.CDLCOUNTERATTACK()``` function is used to calculate **Counterattack Lines (K-Line Pattern: Counterattack)**.

Parameters:

- `inPriceOHLC` ({@struct/Record Record} structure array, required): The ```inPriceOHLC``` parameter is used to specify K-line data.

Returns (array): The ```talib.CDLCOUNTERATTACK()``` function returns a one-dimensional array.

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

The ```CDLCOUNTERATTACK()``` function is described in the talib library documentation as: ```CDLCOUNTERATTACK(Records[Open,High,Low,Close]) = Array(outInteger)```

##### talib.CDLDARKCLOUDCOVER

```
talib.CDLDARKCLOUDCOVER(inPriceOHLC)
talib.CDLDARKCLOUDCOVER(inPriceOHLC, optInPenetration)
```

The ```talib.CDLDARKCLOUDCOVER()``` function is used to calculate **Dark Cloud Cover candlestick pattern**.

Parameters:

- `inPriceOHLC` ({@struct/Record Record} structure array, required): The ```inPriceOHLC``` parameter is used to specify the K-line data.
- `optInPenetration` (number, optional): The ```optInPenetration``` parameter is used to set the penetration ratio, with a default value of 0.5.

Returns (array): The ```talib.CDLDARKCLOUDCOVER()``` function returns a one-dimensional array.

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

The ```CDLDARKCLOUDCOVER()``` function is described in the talib library documentation as: ```CDLDARKCLOUDCOVER(Records[Open,High,Low,Close],Penetration = 0.5) = Array(outInteger)```

##### talib.CDLDOJI

```
talib.CDLDOJI(inPriceOHLC)
```

The ```talib.CDLDOJI()``` function is used to calculate **Doji (K-line pattern: Doji Star)**.

Parameters:

- `inPriceOHLC` ({@struct/Record Record} structure array, required): The ```inPriceOHLC``` parameter is used to specify K-line data.

Returns (array): The ```talib.CDLDOJI()``` function returns a one-dimensional array.

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

The ```CDLDOJI()``` function is described in the talib library documentation as: ```CDLDOJI(Records[Open,High,Low,Close]) = Array(outInteger)```

##### talib.CDLDOJISTAR

```
talib.CDLDOJISTAR(inPriceOHLC)
```

The ```talib.CDLDOJISTAR()``` function is used to calculate **Doji Star (Candlestick Pattern: Doji Star)**.

Parameters:

- `inPriceOHLC` ({@struct/Record Record} structure array, required): The ```inPriceOHLC``` parameter is used to specify the K-line data.

Returns (array): The ```talib.CDLDOJISTAR()``` function returns a one-dimensional array.

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

The ```CDLDOJISTAR()``` function is described in the talib library documentation as: ```CDLDOJISTAR(Records[Open,High,Low,Close]) = Array(outInteger)```

##### talib.CDLDRAGONFLYDOJI

```
talib.CDLDRAGONFLYDOJI(inPriceOHLC)
```

The ```talib.CDLDRAGONFLYDOJI()``` function is used to calculate **Dragonfly Doji (Candlestick Pattern: Dragonfly Doji)**.

Parameters:

- `inPriceOHLC` ({@struct/Record Record} structure array, required): The ```inPriceOHLC``` parameter is used to specify the K-line data.

Returns (array): The ```talib.CDLDRAGONFLYDOJI()``` function returns a one-dimensional array.

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

The ```CDLDRAGONFLYDOJI()``` function is described in the talib library documentation as: ```CDLDRAGONFLYDOJI(Records[Open,High,Low,Close]) = Array(outInteger)```

##### talib.CDLENGULFING

```
talib.CDLENGULFING(inPriceOHLC)
```

The ```talib.CDLENGULFING()``` function is used to calculate **Engulfing Pattern**.

Parameters:

- `inPriceOHLC` ({@struct/Record Record} structure array, required): The ```inPriceOHLC``` parameter is used to specify K-line data.

Returns (array): The ```talib.CDLENGULFING()``` function returns a one-dimensional array.

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

The ```CDLENGULFING()``` function is described in the talib library documentation as: ```CDLENGULFING(Records[Open,High,Low,Close]) = Array(outInteger)```

##### talib.CDLEVENINGDOJISTAR

```
talib.CDLEVENINGDOJISTAR(inPriceOHLC)
talib.CDLEVENINGDOJISTAR(inPriceOHLC, optInPenetration)
```

The ```talib.CDLEVENINGDOJISTAR()``` function is used to calculate **Evening Doji Star (K-line pattern: Evening Doji Star)**.

Parameters:

- `inPriceOHLC` ({@struct/Record Record} structure array, required): The ```inPriceOHLC``` parameter is used to specify the K-line data.
- `optInPenetration` (number, optional): The ```optInPenetration``` parameter is used to set the penetration rate, with a default value of 0.3.

Returns (array): The ```talib.CDLEVENINGDOJISTAR()``` function returns a one-dimensional array.

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

The ```CDLEVENINGDOJISTAR()``` function is described in the talib library documentation as: ```CDLEVENINGDOJISTAR(Records[Open,High,Low,Close],Penetration = 0.3) = Array(outInteger)```

##### talib.CDLEVENINGSTAR

```
talib.CDLEVENINGSTAR(inPriceOHLC)
talib.CDLEVENINGSTAR(inPriceOHLC, optInPenetration)
```

The ```talib.CDLEVENINGSTAR()``` function is used to calculate the **Evening Star** candlestick pattern.

Parameters:

- `inPriceOHLC` ({@struct/Record Record} structure array, required): The ```inPriceOHLC``` parameter is used to specify the K-line data.
- `optInPenetration` (number, optional): The ```optInPenetration``` parameter is used to set the penetration level, with a default value of 0.3.

Returns (array): The ```talib.CDLEVENINGSTAR()``` function returns a one-dimensional array.

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

The ```CDLEVENINGSTAR()``` function is described in the talib library documentation as: ```CDLEVENINGSTAR(Records[Open,High,Low,Close],Penetration = 0.3) = Array(outInteger)```

##### talib.CDLGAPSIDESIDEWHITE

```
talib.CDLGAPSIDESIDEWHITE(inPriceOHLC)
```

The ```talib.CDLGAPSIDESIDEWHITE()``` function is used to calculate **Up/Down-gap side-by-side white lines (K-line pattern: Up/Down-gap side-by-side white lines)**.

Parameters:

- `inPriceOHLC` ({@struct/Record Record} structure array, required): The ```inPriceOHLC``` parameter is used to specify the K-line data.

Returns (array): The ```talib.CDLGAPSIDESIDEWHITE()``` function returns a one-dimensional array.

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

The ```CDLGAPSIDESIDEWHITE()``` function is described in the talib library documentation as: ```CDLGAPSIDESIDEWHITE(Records[Open,High,Low,Close]) = Array(outInteger)```

##### talib.CDLGRAVESTONEDOJI

```
talib.CDLGRAVESTONEDOJI(inPriceOHLC)
```

The ```talib.CDLGRAVESTONEDOJI()``` function is used to calculate the **Gravestone Doji** candlestick pattern.

Parameters:

- `inPriceOHLC` ({@struct/Record Record} structure array, required): The ```inPriceOHLC``` parameter is used to specify the K-line data.

Returns (array): The ```talib.CDLGRAVESTONEDOJI()``` function returns a one-dimensional array.

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

The ```CDLGRAVESTONEDOJI()``` function is described in the talib library documentation as: ```CDLGRAVESTONEDOJI(Records[Open,High,Low,Close]) = Array(outInteger)```

##### talib.CDLHAMMER

```
talib.CDLHAMMER(inPriceOHLC)
```

The ```talib.CDLHAMMER()``` function is used to calculate **Hammer (Candlestick Pattern: Hammer)**.

Parameters:

- `inPriceOHLC` ({@struct/Record Record} structure array, required): The ```inPriceOHLC``` parameter is used to specify the K-line data.

Returns (array): The ```talib.CDLHAMMER()``` function returns a one-dimensional array.

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

The ```CDLHAMMER()``` function is described in the talib library documentation as: ```CDLHAMMER(Records[Open,High,Low,Close]) = Array(outInteger)```

##### talib.CDLHANGINGMAN

```
talib.CDLHANGINGMAN(inPriceOHLC)
```

The ```talib.CDLHANGINGMAN()``` function is used to calculate **Hanging Man (Candlestick Pattern: Hanging Man)**.

Parameters:

- `inPriceOHLC` ({@struct/Record Record} structure array, required): The ```inPriceOHLC``` parameter is used to specify the K-line data.

Returns (array): The ```talib.CDLHANGINGMAN()``` function returns a one-dimensional array.

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

The ```CDLHANGINGMAN()``` function is described in the talib library documentation as: ```CDLHANGINGMAN(Records[Open,High,Low,Close]) = Array(outInteger)```

##### talib.CDLHARAMI

```
talib.CDLHARAMI(inPriceOHLC)
```

The ```talib.CDLHARAMI()``` function is used to calculate **Harami Pattern (K-line chart: bullish/bearish pattern)**.

Parameters:

- `inPriceOHLC` ({@struct/Record Record} structure array, required): The ```inPriceOHLC``` parameter is used to specify K-line data.

Returns (array): The ```talib.CDLHARAMI()``` function returns a one-dimensional array.

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

The ```CDLHARAMI()``` function is described in the talib library documentation as: ```CDLHARAMI(Records[Open,High,Low,Close]) = Array(outInteger)```

##### talib.CDLHARAMICROSS

```
talib.CDLHARAMICROSS(inPriceOHLC)
```

The ```talib.CDLHARAMICROSS()``` function is used to calculate **Harami Cross Pattern (Candlestick Pattern: Harami Cross)**.

Parameters:

- `inPriceOHLC` ({@struct/Record Record} structure array, required): The ```inPriceOHLC``` parameter is used to specify the K-line data.

Returns (array): The ```talib.CDLHARAMICROSS()``` function returns a one-dimensional array.

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

The ```CDLHARAMICROSS()``` function is described in the talib library documentation as: ```CDLHARAMICROSS(Records[Open,High,Low,Close]) = Array(outInteger)```

##### talib.CDLHIGHWAVE

```
talib.CDLHIGHWAVE(inPriceOHLC)
```

The ```talib.CDLHIGHWAVE()``` function is used to calculate **High-Wave Candle (Candlestick Pattern: High Wave Candle)**.

Parameters:

- `inPriceOHLC` ({@struct/Record Record} structure array, required): The ```inPriceOHLC``` parameter is used to specify the K-line data.

Returns (array): The ```talib.CDLHIGHWAVE()``` function returns a one-dimensional array.

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

The ```CDLHIGHWAVE()``` function is described in the talib library documentation as: ```CDLHIGHWAVE(Records[Open,High,Low,Close]) = Array(outInteger)```

##### talib.CDLHIKKAKE

```
talib.CDLHIKKAKE(inPriceOHLC)
```

The ```talib.CDLHIKKAKE()``` function is used to calculate **Hikkake Pattern (Candlestick: Trap Pattern)**.

Parameters:

- `inPriceOHLC` ({@struct/Record Record} structure array, required): The ```inPriceOHLC``` parameter is used to specify the K-line data.

Returns (array): The ```talib.CDLHIKKAKE()``` function returns a one-dimensional array.

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

The ```CDLHIKKAKE()``` function is described in the talib library documentation as: ```CDLHIKKAKE(Records[Open,High,Low,Close]) = Array(outInteger)```

##### talib.CDLHIKKAKEMOD

```
talib.CDLHIKKAKEMOD(inPriceOHLC)
```

The ```talib.CDLHIKKAKEMOD()``` function is used to calculate **Modified Hikkake Pattern (Candlestick: Modified Hikkake Pattern)**.

Parameters:

- `inPriceOHLC` ({@struct/Record Record} structure array, required): The ```inPriceOHLC``` parameter is used to specify the K-line data.

Returns (array): The ```talib.CDLHIKKAKEMOD()``` function returns a one-dimensional array.

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

The ```CDLHIKKAKEMOD()``` function is described in the talib library documentation as: ```CDLHIKKAKEMOD(Records[Open,High,Low,Close]) = Array(outInteger)```

##### talib.CDLHOMINGPIGEON

```
talib.CDLHOMINGPIGEON(inPriceOHLC)
```

The ```talib.CDLHOMINGPIGEON()``` function is used to calculate **Homing Pigeon (Candlestick Pattern: Homing Pigeon)**.

Parameters:

- `inPriceOHLC` ({@struct/Record Record} structure array, required): The ```inPriceOHLC``` parameter is used to specify the K-line data.

Returns (array): The ```talib.CDLHOMINGPIGEON()``` function returns a one-dimensional array.

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

The ```CDLHOMINGPIGEON()``` function is described in the talib library documentation as: ```CDLHOMINGPIGEON(Records[Open,High,Low,Close]) = Array(outInteger)```

##### talib.CDLIDENTICAL3CROWS

```
talib.CDLIDENTICAL3CROWS(inPriceOHLC)
```

The ```talib.CDLIDENTICAL3CROWS()``` function is used to calculate **Identical Three Crows (Candlestick Pattern: Identical Three Crows)**.

Parameters:

- `inPriceOHLC` ({@struct/Record Record} structure array, required): The ```inPriceOHLC``` parameter is used to specify the K-line data.

Returns (array): The ```talib.CDLIDENTICAL3CROWS()``` function returns a one-dimensional array.

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

The ```CDLIDENTICAL3CROWS()``` function is described in the talib library documentation as: ```CDLIDENTICAL3CROWS(Records[Open,High,Low,Close]) = Array(outInteger)```

##### talib.CDLINNECK

```
talib.CDLINNECK(inPriceOHLC)
```

The ```talib.CDLINNECK()``` function is used to calculate **In-Neck Pattern (Candlestick Chart: In-Neck Pattern)**.

Parameters:

- `inPriceOHLC` ({@struct/Record Record} structure array, required): The ```inPriceOHLC``` parameter is used to specify the candlestick data.

Returns (array): The ```talib.CDLINNECK()``` function returns a one-dimensional array.

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

The ```CDLINNECK()``` function is described in the talib library documentation as: ```CDLINNECK(Records[Open,High,Low,Close]) = Array(outInteger)```

##### talib.CDLINVERTEDHAMMER

```
talib.CDLINVERTEDHAMMER(inPriceOHLC)
```

The ```talib.CDLINVERTEDHAMMER()``` function is used to calculate **Inverted Hammer (K-Line Pattern: Inverted Hammer)**.

Parameters:

- `inPriceOHLC` ({@struct/Record Record} structure array, required): The ```inPriceOHLC``` parameter is used to specify K-line data.

Returns (array): The ```talib.CDLINVERTEDHAMMER()``` function returns a one-dimensional array.

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

The ```CDLINVERTEDHAMMER()``` function is described in the talib library documentation as: ```CDLINVERTEDHAMMER(Records[Open,High,Low,Close]) = Array(outInteger)```

##### talib.CDLKICKING

```
talib.CDLKICKING(inPriceOHLC)
```

The ```talib.CDLKICKING()``` function is used to calculate **Kicking (Candlestick Pattern: Kicking Pattern)**.

Parameters:

- `inPriceOHLC` ({@struct/Record Record} structure array, required): The ```inPriceOHLC``` parameter is used to specify the K-line data.

Returns (array): The ```talib.CDLKICKING()``` function returns a one-dimensional array.

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

The ```CDLKICKING()``` function is described in the talib library documentation as: ```CDLKICKING(Records[Open,High,Low,Close]) = Array(outInteger)```

##### talib.CDLKICKINGBYLENGTH

```
talib.CDLKICKINGBYLENGTH(inPriceOHLC)
```

The ```talib.CDLKICKINGBYLENGTH()``` function is used to calculate **Kicking - bull/bear determined by the longer marubozu (K-line pattern: Kicking Bull/Bear)**.

Parameters:

- `inPriceOHLC` ({@struct/Record Record} structure array, required): The ```inPriceOHLC``` parameter is used to specify the K-line data.

Returns (array): The ```talib.CDLKICKINGBYLENGTH()``` function returns a one-dimensional array.

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

The ```CDLKICKINGBYLENGTH()``` function is described in the talib library documentation as: ```CDLKICKINGBYLENGTH(Records[Open,High,Low,Close]) = Array(outInteger)```

##### talib.CDLLADDERBOTTOM

```
talib.CDLLADDERBOTTOM(inPriceOHLC)
```

The ```talib.CDLLADDERBOTTOM()``` function is used to calculate **Ladder Bottom (Candlestick Pattern: Ladder Bottom)**.

Parameters:

- `inPriceOHLC` ({@struct/Record Record} structure array, required): The ```inPriceOHLC``` parameter is used to specify the K-line data.

Returns (array): The ```talib.CDLLADDERBOTTOM()``` function returns a one-dimensional array.

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

The ```CDLLADDERBOTTOM()``` function is described in the talib library documentation as: ```CDLLADDERBOTTOM(Records[Open,High,Low,Close]) = Array(outInteger)```

##### talib.CDLLONGLEGGEDDOJI

```
talib.CDLLONGLEGGEDDOJI(inPriceOHLC)
```

The ```talib.CDLLONGLEGGEDDOJI()``` function is used to calculate **Long Legged Doji (Candlestick Pattern: Long Legged Doji)**.

Parameters:

- `inPriceOHLC` ({@struct/Record Record} structure array, required): The ```inPriceOHLC``` parameter is used to specify the K-line data.

Returns (array): The ```talib.CDLLONGLEGGEDDOJI()``` function returns a one-dimensional array.

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

The ```CDLLONGLEGGEDDOJI()``` function is described in the talib library documentation as: ```CDLLONGLEGGEDDOJI(Records[Open,High,Low,Close]) = Array(outInteger)```

##### talib.CDLLONGLINE

```
talib.CDLLONGLINE(inPriceOHLC)
```

The ```talib.CDLLONGLINE()``` function is used to calculate **Long Line Candle Pattern (Candlestick Chart: Long Line)**.

Parameters:

- `inPriceOHLC` ({@struct/Record Record} structure array, required): The ```inPriceOHLC``` parameter is used to specify the K-line data.

Returns (array): The ```talib.CDLLONGLINE()``` function returns a one-dimensional array.

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

The ```CDLLONGLINE()``` function is described in the talib library documentation as: ```CDLLONGLINE(Records[Open,High,Low,Close]) = Array(outInteger)```

##### talib.CDLMARUBOZU

```
talib.CDLMARUBOZU(inPriceOHLC)
```

The ```talib.CDLMARUBOZU()``` function is used to calculate the **Marubozu (Candlestick Pattern: Shaven Head and Bottom)** pattern.

Parameters:

- `inPriceOHLC` ({@struct/Record Record} structure array, required): The ```inPriceOHLC``` parameter is used to specify the K-line data.

Returns (array): The ```talib.CDLMARUBOZU()``` function returns a one-dimensional array.

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

The ```CDLMARUBOZU()``` function is described in the talib library documentation as: ```CDLMARUBOZU(Records[Open,High,Low,Close]) = Array(outInteger)```

##### talib.CDLMATCHINGLOW

```
talib.CDLMATCHINGLOW(inPriceOHLC)
```

The ```talib.CDLMATCHINGLOW()``` function is used to calculate **Matching Low (Candlestick Pattern: Matching Low)**.

Parameters:

- `inPriceOHLC` ({@struct/Record Record} structure array, required): The ```inPriceOHLC``` parameter is used to specify the K-line data.

Returns (array): The ```talib.CDLMATCHINGLOW()``` function returns a one-dimensional array.

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

The ```CDLMATCHINGLOW()``` function is described in the talib library documentation as: ```CDLMATCHINGLOW(Records[Open,High,Low,Close]) = Array(outInteger)```

##### talib.CDLMATHOLD

```
talib.CDLMATHOLD(inPriceOHLC)
talib.CDLMATHOLD(inPriceOHLC, optInPenetration)
```

The ```talib.CDLMATHOLD()``` function is used to calculate **Mat Hold (Candlestick Pattern: Mat Hold)**.

Parameters:

- `inPriceOHLC` ({@struct/Record Record} structure array, required): The ```inPriceOHLC``` parameter is used to specify the K-line data.
- `optInPenetration` (number, optional): The ```optInPenetration``` parameter is optional and is used to specify the penetration percentage for the rising/falling trend line, with a default value of 0.5.

Returns (array): The ```talib.CDLMATHOLD()``` function returns a one-dimensional array.

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

The ```CDLMATHOLD()``` function is described in the talib library documentation as: ```CDLMATHOLD(Records[Open,High,Low,Close],Penetration = 0.5) = Array(outInteger)```

##### talib.CDLMORNINGDOJISTAR

```
talib.CDLMORNINGDOJISTAR(inPriceOHLC)
talib.CDLMORNINGDOJISTAR(inPriceOHLC, optInPenetration)
```

The ```talib.CDLMORNINGDOJISTAR()``` function is used to calculate **Morning Doji Star (Candlestick Pattern: Morning Doji Star)**.

Parameters:

- `inPriceOHLC` ({@struct/Record Record} structure array, required): The ```inPriceOHLC``` parameter is used to specify the K-line data.
- `optInPenetration` (number, optional): The ```optInPenetration``` parameter is used to specify the degree of overlap between the opening price and the real body for validation, with a default value of 0.3.

Returns (array): The ```talib.CDLMORNINGDOJISTAR()``` function returns a one-dimensional array.

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

The ```CDLMORNINGDOJISTAR()``` function is described in the talib library documentation as: ```CDLMORNINGDOJISTAR(Records[Open,High,Low,Close],Penetration = 0.3) = Array(outInteger)```

##### talib.CDLMORNINGSTAR

```
talib.CDLMORNINGSTAR(inPriceOHLC)
talib.CDLMORNINGSTAR(inPriceOHLC, optInPenetration)
```

The ```talib.CDLMORNINGSTAR()``` function is used to calculate **Morning Star (Candlestick Pattern: Morning Star)**.

Parameters:

- `inPriceOHLC` ({@struct/Record Record} structure array, required): The ```inPriceOHLC``` parameter is used to specify the K-line data.
- `optInPenetration` (number, optional): The ```optInPenetration``` parameter is the price penetration percentage threshold required for trend confirmation, with a value range of [0,1], default value is 0.3.

Returns (array): The ```talib.CDLMORNINGSTAR()``` function returns a one-dimensional array.

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

The ```CDLMORNINGSTAR()``` function is described in the talib library documentation as: ```CDLMORNINGSTAR(Records[Open,High,Low,Close],Penetration=0.3) = Array(outInteger)```

##### talib.CDLONNECK

```
talib.CDLONNECK(inPriceOHLC)
```

The ```talib.CDLONNECK()``` function is used to calculate **On-Neck Pattern (Candlestick Chart: On-Neck Pattern)**.

Parameters:

- `inPriceOHLC` ({@struct/Record Record} structure array, required): The ```inPriceOHLC``` parameter is used to specify the K-line data.

Returns (array): The ```talib.CDLONNECK()``` function returns a one-dimensional array.

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

The ```CDLONNECK()``` function is described in the talib library documentation as: ```CDLONNECK(Records[Open,High,Low,Close]) = Array(outInteger)```

##### talib.CDLPIERCING

```
talib.CDLPIERCING(inPriceOHLC)
```

The ```talib.CDLPIERCING()``` function is used to calculate **Piercing Pattern (Candlestick Pattern: Piercing Pattern)**.

Parameters:

- `inPriceOHLC` ({@struct/Record Record} structure array, required): The ```inPriceOHLC``` parameter is used to specify the K-line data.

Returns (array): The ```talib.CDLPIERCING()``` function returns a one-dimensional array.

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

The ```CDLPIERCING()``` function is described in the talib library documentation as: ```CDLPIERCING(Records[Open,High,Low,Close]) = Array(outInteger)```

##### talib.CDLRICKSHAWMAN

```
talib.CDLRICKSHAWMAN(inPriceOHLC)
```

The ```talib.CDLRICKSHAWMAN()``` function is used to calculate **Rickshaw Man (Candlestick Pattern: Rickshaw Man)**.

Parameters:

- `inPriceOHLC` ({@struct/Record Record} structure array, required): The ```inPriceOHLC``` parameter is used to specify the K-line data.

Returns (array): The ```talib.CDLRICKSHAWMAN()``` function returns a one-dimensional array.

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

The ```CDLRICKSHAWMAN()``` function is described in the talib library documentation as: ```CDLRICKSHAWMAN(Records[Open,High,Low,Close]) = Array(outInteger)```

##### talib.CDLRISEFALL3METHODS

```
talib.CDLRISEFALL3METHODS(inPriceOHLC)
```

The ```talib.CDLRISEFALL3METHODS()``` function is used to calculate **Rising/Falling Three Methods (Candlestick Pattern: Rising/Falling Three Methods)**.

Parameters:

- `inPriceOHLC` ({@struct/Record Record} structure array, required): The ```inPriceOHLC``` parameter is used to specify the K-line data.

Returns (array): The ```talib.CDLRISEFALL3METHODS()``` function returns a one-dimensional array.

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

The ```CDLRISEFALL3METHODS()``` function is described in the talib library documentation as: ```CDLRISEFALL3METHODS(Records[Open,High,Low,Close]) = Array(outInteger)```

##### talib.CDLSEPARATINGLINES

```
talib.CDLSEPARATINGLINES(inPriceOHLC)
```

The ```talib.CDLSEPARATINGLINES()``` function is used to calculate **Separating Lines Pattern (Candlestick Chart: Separating Lines)**.

Parameters:

- `inPriceOHLC` ({@struct/Record Record} structure array, required): The ```inPriceOHLC``` parameter is used to specify the K-line data.

Returns (array): The ```talib.CDLSEPARATINGLINES()``` function returns a one-dimensional array.

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

The ```CDLSEPARATINGLINES()``` function is described in the talib library documentation as: ```CDLSEPARATINGLINES(Records[Open,High,Low,Close]) = Array(outInteger)```

##### talib.CDLSHOOTINGSTAR

```
talib.CDLSHOOTINGSTAR(inPriceOHLC)
```

The ```talib.CDLSHOOTINGSTAR()``` function is used to calculate **Shooting Star (Candlestick Pattern: Shooting Star)**.

Parameters:

- `inPriceOHLC` ({@struct/Record Record} structure array, required): The ```inPriceOHLC``` parameter is used to specify the K-line data.

Returns (array): The ```talib.CDLSHOOTINGSTAR()``` function returns a one-dimensional array.

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

The ```CDLSHOOTINGSTAR()``` function is described in the talib library documentation as: ```CDLSHOOTINGSTAR(Records[Open,High,Low,Close]) = Array(outInteger)```

##### talib.CDLSHORTLINE

```
talib.CDLSHORTLINE(inPriceOHLC)
```

The ```talib.CDLSHORTLINE()``` function is used to calculate **Short Line Candle Pattern (K-Line: Short Line)**.

Parameters:

- `inPriceOHLC` ({@struct/Record Record} structure array, required): The ```inPriceOHLC``` parameter is used to specify K-line price data.

Returns (array): The ```talib.CDLSHORTLINE()``` function returns a one-dimensional array.

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

The ```CDLSHORTLINE()``` function is described in the talib library documentation as: ```CDLSHORTLINE(Records[Open,High,Low,Close]) = Array(outInteger)```

##### talib.CDLSPINNINGTOP

```
talib.CDLSPINNINGTOP(inPriceOHLC)
```

The ```talib.CDLSPINNINGTOP()``` function is used to calculate **Spinning Top (Candlestick Pattern: Spinning Top)**.

Parameters:

- `inPriceOHLC` ({@struct/Record Record} structure array, required): The ```inPriceOHLC``` parameter is used to specify the K-line data.

Returns (array): The ```talib.CDLSPINNINGTOP()``` function returns a one-dimensional array.

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

The ```CDLSPINNINGTOP()``` function is described in the talib library documentation as: ```CDLSPINNINGTOP(Records[Open,High,Low,Close]) = Array(outInteger)```

##### talib.CDLSTALLEDPATTERN

```
talib.CDLSTALLEDPATTERN(inPriceOHLC)
```

The ```talib.CDLSTALLEDPATTERN()``` function is used to calculate **Stalled Pattern (Candlestick Pattern: Stalled Pattern)**.

Parameters:

- `inPriceOHLC` ({@struct/Record Record} structure array, required): The ```inPriceOHLC``` parameter is used to specify the K-line data.

Returns (array): The ```talib.CDLSTALLEDPATTERN()``` function returns a one-dimensional array.

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

The ```CDLSTALLEDPATTERN()``` function is described in the talib library documentation as: ```CDLSTALLEDPATTERN(Records[Open,High,Low,Close]) = Array(outInteger)```

##### talib.CDLSTICKSANDWICH

```
talib.CDLSTICKSANDWICH(inPriceOHLC)
```

The ```talib.CDLSTICKSANDWICH()``` function is used to calculate **Stick Sandwich (Candlestick Pattern: Stick Sandwich)**.

Parameters:

- `inPriceOHLC` ({@struct/Record Record} structure array, required): The ```inPriceOHLC``` parameter is used to specify the K-line data.

Returns (array): The ```talib.CDLSTICKSANDWICH()``` function returns a one-dimensional array.

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

The ```CDLSTICKSANDWICH()``` function is described in the talib library documentation as: ```CDLSTICKSANDWICH(Records[Open,High,Low,Close]) = Array(outInteger)```

##### talib.CDLTAKURI

```
talib.CDLTAKURI(inPriceOHLC)
```

The ```talib.CDLTAKURI()``` function is used to calculate **Takuri (Dragonfly Doji with very long lower shadow)** candlestick pattern.

Parameters:

- `inPriceOHLC` ({@struct/Record Record} structure array, required): The ```inPriceOHLC``` parameter is used to specify the K-line data.

Returns (array): The ```talib.CDLTAKURI()``` function returns a one-dimensional array.

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

The ```CDLTAKURI()``` function is described in the talib library documentation as: ```CDLTAKURI(Records[Open,High,Low,Close]) = Array(outInteger)```

##### talib.CDLTASUKIGAP

```
talib.CDLTASUKIGAP(inPriceOHLC)
```

The ```talib.CDLTASUKIGAP()``` function is used to calculate **Tasuki Gap (Candlestick Pattern: Tasuki Gap)**.

Parameters:

- `inPriceOHLC` ({@struct/Record Record} structure array, required): The ```inPriceOHLC``` parameter is used to specify the K-line data.

Returns (array): The ```talib.CDLTASUKIGAP()``` function returns a one-dimensional array.

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

The ```CDLTASUKIGAP()``` function is described in the talib library documentation as: ```CDLTASUKIGAP(Records[Open,High,Low,Close]) = Array(outInteger)```

##### talib.CDLTHRUSTING

```
talib.CDLTHRUSTING(inPriceOHLC)
```

The ```talib.CDLTHRUSTING()``` function is used to calculate **Thrusting Pattern (Candlestick Pattern: Thrusting Pattern)**.

Parameters:

- `inPriceOHLC` ({@struct/Record Record} structure array, required): The ```inPriceOHLC``` parameter is used to specify the K-line data.

Returns (array): The ```talib.CDLTHRUSTING()``` function returns a one-dimensional array.

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

The ```CDLTHRUSTING()``` function is described in the talib library documentation as: ```CDLTHRUSTING(Records[Open,High,Low,Close]) = Array(outInteger)```

##### talib.CDLTRISTAR

```
talib.CDLTRISTAR(inPriceOHLC)
```

The ```talib.CDLTRISTAR()``` function is used to calculate **Tristar Pattern (Candlestick Chart: Tristar Pattern)**.

Parameters:

- `inPriceOHLC` ({@struct/Record Record} structure array, required): The ```inPriceOHLC``` parameter is used to specify the K-line data.

Returns (array): The ```talib.CDLTRISTAR()``` function returns a one-dimensional array.

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

The ```CDLTRISTAR()``` function is described in the talib library documentation as: ```CDLTRISTAR(Records[Open,High,Low,Close]) = Array(outInteger)```

##### talib.CDLUNIQUE3RIVER

```
talib.CDLUNIQUE3RIVER(inPriceOHLC)
```

The ```talib.CDLUNIQUE3RIVER()``` function is used to calculate **Unique 3 River (Candlestick Pattern: Unique Three River)**.

Parameters:

- `inPriceOHLC` ({@struct/Record Record} structure array, required): The ```inPriceOHLC``` parameter is used to specify the K-line data.

Returns (array): The ```talib.CDLUNIQUE3RIVER()``` function returns a one-dimensional array.

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

The ```CDLUNIQUE3RIVER()``` function is described in the talib library documentation as: ```CDLUNIQUE3RIVER(Records[Open,High,Low,Close]) = Array(outInteger)```

##### talib.CDLUPSIDEGAP2CROWS

```
talib.CDLUPSIDEGAP2CROWS(inPriceOHLC)
```

The ```talib.CDLUPSIDEGAP2CROWS()``` function is used to calculate **Upside Gap Two Crows (Candlestick Pattern: Two Crows)**.

Parameters:

- `inPriceOHLC` ({@struct/Record Record} structure array, required): The ```inPriceOHLC``` parameter is used to specify the K-line data.

Returns (array): The ```talib.CDLUPSIDEGAP2CROWS()``` function returns a one-dimensional array.

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

The ```CDLUPSIDEGAP2CROWS()``` function is described in the talib library documentation as: ```CDLUPSIDEGAP2CROWS(Records[Open,High,Low,Close]) = Array(outInteger)```

##### talib.CDLXSIDEGAP3METHODS

```
talib.CDLXSIDEGAP3METHODS(inPriceOHLC)
```

The ```talib.CDLXSIDEGAP3METHODS()``` function is used to calculate **Upside/Downside Gap Three Methods (Candlestick Pattern Recognition)**.

Parameters:

- `inPriceOHLC` ({@struct/Record Record} structure array, required): The ```inPriceOHLC``` parameter is used to specify the K-line data.

Returns (array): The ```talib.CDLXSIDEGAP3METHODS()``` function returns a one-dimensional array.

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

The ```CDLXSIDEGAP3METHODS()``` function is described in the talib library documentation as: ```CDLXSIDEGAP3METHODS(Records[Open,High,Low,Close]) = Array(outInteger)```

### OS

FMZ Quant Trading Platform supports file read/write operations. The os library provides a complete file system operation interface to help users with data persistence, configuration management, and logging during strategy development.
Note that this feature only supports ```JavaScript``` language strategies.

The os library supports: File objects, File list objects, and File information objects.
| Object | Description | Notes |
| - | - | - |
| File Object: File | Provides file read/write, positioning and other operations. | Obtained through ```os.open()```, need to call ```close()``` to release resources after use. |
| File List Object: ListFilesResult | Used to record directory listing information. | Supports wildcard matching patterns, returned by ```os.listFiles()``` function. |
| File Information Object: FileStat | File statistics information. | Returned by ```os.stat()``` function. |

Supports live trading and backtesting systems.
- Live trading environment:
  The default directory for live trading is the ```files``` folder at the same level as the live trading database file in the docker directory, i.e.: ```/logs/storage/xxx/files```, where ```xxx``` is the live trading ID, and the docker program (robot) is at the same level as ```logs```.
- Backtesting system environment:
  The backtesting system is a sandbox environment. The system simulates a file directory with the default directory: ```/logs/storage/1/files```.
  When backtesting ends, the created file contents will be cleared.

#### os

The os library provides a complete file system operation interface for the FMZ Quant Trading Platform.

##### open

```
open(filename)
open(filename, mode)
```

Open a file in the specified mode.

Parameters:

- `filename` (string, required): File name. The parameter ```filename``` is a path containing the file name. Since both the docker and backtesting system support ```os``` operations, please note that in **non-backtesting environments**, file operations are restricted to the ```files``` folder at the same level as the live trading database file in the docker directory, therefore absolute paths are not supported for operating any files. This note about the parameter ```filename``` will not be repeated in subsequent sections.
- `mode` (string, optional): Specify the file opening mode.

Returns (```File``` object): The ```open()``` function returns a ```File``` object for file operations.

Create a file, write data, then read it.

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

File opening modes:

  - ```r``` : read (read-only, file must exist)

  - ```w``` : write (write-only, creates file if it doesn't exist, clears content if it exists)

  - ```a``` : append (append write, creates file if it doesn't exist, writes to the end if it exists)

  - ```+``` : Adding + after r/w/a means both read and write are allowed (e.g., "r+", "w+", "a+")

  - ```b``` : binary (binary mode, commonly used in Windows to distinguish text/binary files, e.g., "rb", "wb")

Files are opened/created in the ```files``` folder under the live trading database file directory (xxx.db3, where xxx is the live trading Id).

See also: `File`, `ListFilesResult`, `FileStat`,  `open`, `fgets`, `fputs`, `mmap`, `getRootDir`, `listFiles`, `exists`, `remove`, `mkdir`, `rmdir`, `rename`, `stat`, `exit`,

##### fgets

```
fgets(filename)
```

Read the entire file content at once.

Parameters:

- `filename` (string, required): File path, including the filename to be read.

Returns (string): Returns the complete content of the file.

Read the content of a configuration file.

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

Suitable for quick reading of small files, loading the entire file content into memory at once.

If the file does not exist, the ```fgets()``` function will throw an error: ```InternalError: failed to open file: openat config.json: no such file or directory at main```.

See also: `File`, `ListFilesResult`, `FileStat`,  `open`, `fgets`, `fputs`, `mmap`, `getRootDir`, `listFiles`, `exists`, `remove`, `mkdir`, `rmdir`, `rename`, `stat`, `exit`,

##### fputs

```
fputs(filename, content)
fputs(filename, content, append)
```

Write content to a file.

Parameters:

- `filename` (string, required): File path.
- `content` (string, required): Content to write.
- `append` (bool, optional): Whether to write in append mode, defaults to false (overwrite mode).

Returns (number): Returns the actual number of bytes written.

Save strategy configuration to file.

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

Convenient file writing method, overwrites file content by default. Set append to true to append to the end of the file.

See also: `File`, `ListFilesResult`, `FileStat`,  `open`, `fgets`, `fputs`, `mmap`, `getRootDir`, `listFiles`, `exists`, `remove`, `mkdir`, `rmdir`, `rename`, `stat`, `exit`,

##### mmap

```
mmap(filename)
```

Memory-mapped file, returns the binary data of the file.

Parameters:

- `filename` (string, required): File path.

Returns (ArrayBuffer): Returns the binary data of the file content.

Map the binary data of a file.

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

Suitable for efficient reading and processing of large files, maps the file into memory and returns it as an ArrayBuffer.

See also: `File`, `ListFilesResult`, `FileStat`,  `open`, `fgets`, `fputs`, `mmap`, `getRootDir`, `listFiles`, `exists`, `remove`, `mkdir`, `rmdir`, `rename`, `stat`, `exit`,

##### getRootDir

```
getRootDir()
```

Get the root directory path for file operations.

Returns (string): Returns the path of the root directory.

Get and display the root directory path.

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

List files and subdirectories in the specified directory.

Parameters:

- `pattern` (string, optional): Optional matching pattern, supports wildcards (e.g., *.txt, data_*.json), can specify directory path.

Returns (ListFilesResult object): Returns an object containing ```files``` and ```dirs``` arrays.

    - files: Array of matched file names.

    - dirs: Array of subdirectory names in the current directory.

List matched files and directories.

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

When ```pattern``` parameter is not specified, lists all files and subdirectories in the current directory (```../files```).

See also: `File`, `ListFilesResult`, `FileStat`,  `open`, `fgets`, `fputs`, `mmap`, `getRootDir`, `listFiles`, `exists`, `remove`, `mkdir`, `rmdir`, `rename`, `stat`, `exit`,

##### exists

```
exists(filename)
```

Check if the specified file or directory exists.

Parameters:

- `filename` (string, required): The file or directory path to check.

Returns (bool): Returns true if the file or directory exists, otherwise returns false.

Check if a file or path exists.

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

Delete the specified file.

Parameters:

- `filename` (string, required): The file path to delete.

Returns (bool): Returns true on successful deletion, false on failure.

Example of deleting a file.

```javascript
function main() {
    let tempFile = "test_1.txt"
    if (os.exists(tempFile)) {
        let success = os.remove(tempFile)
        Log("Temp file deleted:", success)
    }
}
```

This function is only for deleting files, not for deleting directories. To delete directories, please use the ```rmdir()``` function.

See also: `File`, `ListFilesResult`, `FileStat`,  `open`, `fgets`, `fputs`, `mmap`, `getRootDir`, `listFiles`, `exists`, `remove`, `mkdir`, `rmdir`, `rename`, `stat`, `exit`,

##### mkdir

```
mkdir(dirname)
```

Create a directory.

Parameters:

- `dirname` (string, required): The directory path to create.

Returns (bool): Returns true if creation is successful, otherwise returns false.

Create a data storage directory, create a file and write data.

```javascript
function main() {
    let success = os.mkdir("data/backtest/results")
    Log("Directory created:", success)

    if (success) {
        os.fputs("data/backtest/results/summary.txt", "Backtest completed")
    }
}
```

Supports recursive creation of multi-level directories. If parent directories do not exist, they will be created automatically.

See also: `File`, `ListFilesResult`, `FileStat`,  `open`, `fgets`, `fputs`, `mmap`, `getRootDir`, `listFiles`, `exists`, `remove`, `mkdir`, `rmdir`, `rename`, `stat`, `exit`,

##### rmdir

```
rmdir(dirname)
```

Remove a directory and all its contents.

Parameters:

- `dirname` (string, required): The directory path to be removed.

Returns (bool): Returns true on successful deletion, false on failure.

Remove a directory and all its contents.

```javascript
function main() {
    let tempDir = "data"
    if (os.exists(tempDir)) {
        let success = os.rmdir(tempDir)
        Log("directory removed:", success)
    }
}
```

This operation will permanently delete the directory and all its contents, please use with caution.

See also: `File`, `ListFilesResult`, `FileStat`,  `open`, `fgets`, `fputs`, `mmap`, `getRootDir`, `listFiles`, `exists`, `remove`, `mkdir`, `rmdir`, `rename`, `stat`, `exit`,

##### rename

```
rename(oldName, newName)
```

Rename a file or move a file.

Parameters:

- `oldName` (string, required): The name or path of the original file.
- `newName` (string, required): The name or path of the new file.

Returns (bool): Returns true when the operation succeeds, otherwise returns false.

Rename a file and move it to another directory.

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

This function can be used to rename a file or move a file to another directory. If the directory of the new path does not exist, the operation will fail.

See also: `File`, `ListFilesResult`, `FileStat`,  `open`, `fgets`, `fputs`, `mmap`, `getRootDir`, `listFiles`, `exists`, `remove`, `mkdir`, `rmdir`, `rename`, `stat`, `exit`,

##### stat

```
stat(filename)
```

Get detailed statistics information of a file.

Parameters:

- `filename` (string, required): File path.

Returns (FileStat object): Returns an object containing file statistics information.

Get file information and check file size.

```javascript
function main() {
    if (os.exists("strategyConfig/testData.txt")) {
        let stat = os.stat("strategyConfig/testData.txt")  // stat: {"size":10,"mode":420,"mtime":1757312981796,"atime":1757312981796,"ctime":1757312981796}
        Log("stat:", stat)
    }
}
```

The returned ```FileStat``` object contains the following fields:

  - size: File size.

  - mode: File permissions.

  - mtime: Last modification time.

  - atime: Last access time.

  - ctime: Creation time.

See also: `File`, `ListFilesResult`, `FileStat`,  `open`, `fgets`, `fputs`, `mmap`, `getRootDir`, `listFiles`, `exists`, `remove`, `mkdir`, `rmdir`, `rename`, `stat`, `exit`,

##### exit

```
exit()
exit(status)
```

Exit the program.

Parameters:

- `status` (number, optional): Optional exit status code, default value is 0.

Returns (never): This function does not return a value, the program will terminate execution directly.

Exit program after checking conditions.

```javascript
function main() {
    if (!os.exists("required_config.json")) {
        Log("Required configuration file not found!")
        os.exit(1)  // Abnormal exit
    }
    Log("Configuration found, continuing...")
    // Normal strategy logic...
}
```

Immediately terminates program execution. Status code 0 indicates normal exit, non-zero values indicate abnormal exit (will be displayed as error in live trading).

See also: `File`, `ListFilesResult`, `FileStat`,  `open`, `fgets`, `fputs`, `mmap`, `getRootDir`, `listFiles`, `exists`, `remove`, `mkdir`, `rmdir`, `rename`, `stat`, `exit`,

#### File

File object that provides file read/write, positioning and other operations.

##### close

```
close()
```

Close the file and release associated resources.

Example of proper file operation workflow.

```javascript
function main() {
    let file = os.open("data.txt", "w")
    file.write("Hello FMZ!")
    file.close()  // 必须关闭文件
}
```

This method must be called after using the file object to release system resources.

See also: `close`, `puts`, `printf`, `flush`, `tell`, `seek`,  `eof`, `read`, `write`, `getline`, `toString`

##### puts

```
puts(data1, data2, ...dataN)
```

Write one or more strings to a file.

Parameters:

- `data` (string, required): String data to be written, multiple parameters can be passed.

Returns (number): Returns the actual number of bytes written.

Write multiple strings to a file.

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

Multiple string parameters can be written at once, they will be concatenated in order and then written.

See also: `close`, `puts`, `printf`, `flush`, `tell`, `seek`,  `eof`, `read`, `write`, `getline`, `toString`

##### printf

```
printf(format)
printf(format, arg1, arg2, ...argN)
```

Write formatted data to file.

Parameters:

- `format` (string, required): Format string.
- `args` (any (any type supported by the platform), optional): Format arguments.

Returns (number): Returns the actual number of bytes written.

Write formatted trading data.

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

Flush the file buffer to ensure data is written to disk.

Write important log data in real-time.

```javascript
function main() {
    let logFile = os.open("critical.log", "a")
    logFile.printf("[%s] Critical event occurred\n", new Date().toISOString())   // [2025-09-09T03:15:43.895Z] Critical event occurred
    logFile.flush()  // Immediately write data to disk
    // Continue with other operations...
    logFile.close()
}
```

See also: `close`, `puts`, `printf`, `flush`, `tell`, `seek`,  `eof`, `read`, `write`, `getline`, `toString`

##### tell

```
tell()
```

Get the current file pointer position.

Returns (number): Returns the current file pointer position (offset in bytes).

Track position during file operations.

```javascript
function main() {
    let file = os.open("data.txt", "r+")
    Log("Initial position:", file.tell())      // Initial position: 0

    file.write("Hello")
    Log("After write position:", file.tell())  // After write position: 5
    file.close()
}
```

Returns the byte offset of the current file pointer relative to the beginning of the file.

See also: `close`, `puts`, `printf`, `flush`, `tell`, `seek`,  `eof`, `read`, `write`, `getline`, `toString`

##### seek

```
seek(offset, whence)
```

Move the file pointer to a specified position.

Parameters:

- `offset` (number, required): Offset (in bytes).
- `whence` (number, required): Reference position: 0=beginning of file, 1=current position, 2=end of file.

Returns (number): Returns the new file pointer position.

Read characters in reverse order.

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

Used to position the file pointer, the ```offset``` parameter can be negative (indicating backward movement).

See also: `close`, `puts`, `printf`, `flush`, `tell`, `seek`,  `eof`, `read`, `write`, `getline`, `toString`

##### eof

```
eof()
```

Check if the file pointer has reached the end of file.

Returns (bool): Returns true if end of file has been reached, otherwise returns false.

Read file line by line until end of file.

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

Used to determine whether all content has been read when reading a file.

See also: `close`, `puts`, `printf`, `flush`, `tell`, `seek`,  `eof`, `read`, `write`, `getline`, `toString`

##### read

```
read()
read(size)
```

Read data from a file.

Parameters:

- `size` (number, optional): Number of bytes to read. If not specified, reads all remaining content in the file.

Returns (string / ArrayBuffer / undefined): Returns the content read. Returns ```undefined``` when the end of file is reached.

Read file content in chunks.

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

Can read a specified number of bytes or all remaining content in the file. The return type may be **string** or ```ArrayBuffer```.

See also: `close`, `puts`, `printf`, `flush`, `tell`, `seek`,  `eof`, `read`, `write`, `getline`, `toString`

##### write

```
write(data)
```

Write string data to a file.

Parameters:

- `data` (string, required): The string data to be written.

Returns (number): Returns the actual number of bytes written.

Writing trade records

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

Writes string data to the current position in the file.

See also: `close`, `puts`, `printf`, `flush`, `tell`, `seek`,  `eof`, `read`, `write`, `getline`, `toString`

##### getline

```
getline()
```

Read the next line from the file.

Returns (string / undefined): Returns the next line content, returns ```undefined``` when reaching end of file.

Read file line by line until the end.

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

Read file content line by line in sequential order.

See also: `close`, `puts`, `printf`, `flush`, `tell`, `seek`,  `eof`, `read`, `write`, `getline`, `toString`

##### toString

```
toString()
```

Get the string representation of the file object.

Returns (string): Returns the string description information of the file object.

Get the description information of the file object.

```javascript
function main() {
    let file = os.open("data/data.txt", "r")
    Log("File info:", file.toString())           // File info: File(data/data.txt)
    file.close()
}
```

Returns the description information of the file object.

See also: `close`, `puts`, `printf`, `flush`, `tell`, `seek`,  `eof`, `read`, `write`, `getline`, `toString`

#### ListFilesResult

File list object used to record directory listing information. This object contains two array properties: ```files``` (file list) and ```dirs``` (directory list).

ListFilesResult object structure:

```js
{
    files: string[],  // Array of searched file names
    dirs: string[]    // Array of subdirectory names in the current directory
}
```

This object is returned by the ```os.listFiles()``` function.

See also: `File`, `os`, `FileStat`

#### FileStat

File statistics information object.

FileStat object structure:

```js
{
    size: number,   // File size (bytes)
    mode: number,   // File permission mode
    mtime: number,  // Modification time, millisecond timestamp
    atime: number,  // Access time, millisecond timestamp
    ctime: number   // Creation time, millisecond timestamp
}
```

This object is returned by the ```os.stat()``` function.

See also: `File`, `os`, `ListFilesResult`

## Structures

### Ticker

Market data structure.

Fields:

- `Info` (object): Raw data returned by the exchange API, not included in backtesting.
- `Symbol` (string): The ```Symbol``` field is the trading symbol code defined by the FMZ platform.

- For spot exchange objects, the ```Symbol``` field value format is (example): ```BTC_USDT```, representing the BTC_USDT spot trading pair.

- For futures exchange objects, the ```Symbol``` field value format is (example): ```BTC_USDT.swap```, representing BTC's USDT-margined perpetual contract.

- For futures exchange objects (option-related functions are also encapsulated in futures exchange objects), the ```Symbol``` field value format is (example): ```BTC_USDT.BTC-240108-40000-C```, representing BTC's USDT-margined option contract with an expiration date of January 8, 2024, and a strike price of 40000 for a call option.
- `High` (number): Highest price. If the exchange API does not provide the 24-hour high, it is filled with the ask price.
- `Low` (number): Lowest price. If the exchange API does not provide the 24-hour low, it is filled with the bid price.
- `Sell` (number): Current best ask price.
- `Buy` (number): Current best bid price.
- `Last` (number): Last traded price.
- `Open` (number): Period opening price. If the exchange API does not provide the opening price for the 24-hour rolling period, it is filled with the current price.
- `Volume` (number): Recent trading volume. In principle, spot trading volume is in base currency units, and contract trading volume is in contract units. If the exchange API does not provide such data, it is filled with available data from the exchange API, for example, it may be trading volume in quote currency units.
- `Time` (number): Timestamp in milliseconds.
- `OpenInterest` (number): Open interest. Most exchange APIs do not provide this data, and the value is 0 when not supported.

The exchange.GetTicker() function returns a Ticker structure.

For option contracts, the order book is usually thin and there are often no orders on the bid or ask side; in that case the ```Buy``` and ```Sell``` fields of the ```Ticker``` structure are 0, and ```Last``` may also be 0 for an option that has never traded. On Futures_Aevo the option ```Last``` is the mark price; Futures_OKX and Futures_Kraken use the mark price as ```Last``` when the option has no last trade price. Check these fields before using option market data.

See also: `exchange.GetTicker`, `exchange.GetTickers`

### Depth

Market depth data structure.

Fields:

- `Asks` (array): Ask orders array, i.e., OrderBook array, sorted by price from low to high, with the first OrderBook structure in the array having the lowest price.
- `Bids` (array): Bid orders array, i.e., OrderBook array, sorted by price from high to low, with the first OrderBook structure in the array having the highest price.
- `Time` (number): Timestamp in milliseconds.

The exchange.GetDepth() function returns a Depth structure.

See also: `exchange.GetDepth`, `OrderBook`

### OrderBook

Order structure in market depth.

Fields:

- `Price` (number): Order price.
- `Amount` (number): Order quantity.

In the data structure returned by the exchange.GetDepth() function, the attribute values of Bids and Asks are OrderBook arrays.

See also: `exchange.GetDepth`, `Depth`

### Trade

Data structure for market trade records.

Fields:

- `Id` (string): Unique identifier for the market trade record. If the exchange API does not provide an Id, it will be filled with a timestamp.
- `Time` (number): Timestamp in milliseconds.
- `Price` (number): Execution price.
- `Amount` (number): Execution quantity.
- `Type` (number): Order type, refer to `ORDER_TYPE_BUY`, `ORDER_TYPE_SELL`.

The exchange.GetTrades() function returns an array of Trade or an empty array.

See also: `exchange.GetTrades`

### Record

Data structure for candlestick bars in standard OHLC format, used for charting candlesticks and calculating technical indicators.

Fields:

- `Time` (number): Millisecond timestamp representing the start time of this candlestick period.
- `Open` (number): Opening price.
- `High` (number): Highest price.
- `Low` (number): Lowest price.
- `Close` (number): Closing price.
- `OpenInterest` (number): Open interest. Most exchange APIs do not provide this data; value is 0 when not supported.
- `Volume` (number): Trading volume. For spot trading, volume is principally in base currency units; for futures, volume is in contract units. If the exchange API does not provide standard data, existing API data is used for filling, which may be volume in quote currency units.

The exchange.GetRecords() function returns an array of Records or an empty array. Each Record structure represents one candlestick bar.

For Python, different versions of pandas packages may require different handling, for example:

```python
pandas.DataFrame(records)  // May need to be adjusted to: pandas.DataFrame(list(records))
```

Related error message: ```in getattr KeyError: 'dtype'```.

See also: `exchange.GetRecords`

### Market

Data structure for trading symbol market information.

Fields:

- `Symbol` (string): Example value: ```"btcusdt"```, the ```Symbol``` field records the original name of this trading symbol on the exchange. Note that the format and definition of this attribute differs from the ```Symbol``` field in the `Ticker` structure.
- `BaseAsset` (string): Example value: ```"BTC"```, the ```BaseAsset``` field records the base currency name (i.e., baseCurrency), uniformly in uppercase letters.
- `QuoteAsset` (string): Example value: ```"USDT"```, the ```QuoteAsset``` field records the quote currency name (i.e., quoteCurrency), uniformly in uppercase letters.
- `TickSize` (number): Example value: ```0.01```, the ```TickSize``` field records the minimum price increment for this trading symbol on the exchange.
- `AmountSize` (number): Example value: ```0.01```, the ```AmountSize``` field records the minimum order quantity increment for this trading symbol on the exchange.
- `PricePrecision` (number): Example value: ```2```, the ```PricePrecision``` field records the price precision for this trading symbol on the exchange, indicating the price is accurate to 2 decimal places.
- `AmountPrecision` (number): Example value: ```3```, the ```AmountPrecision``` field records the order quantity precision for this trading symbol on the exchange, indicating the order quantity is accurate to 3 decimal places.
- `MinQty` (number): Example value: ```0.001```, the ```MinQty``` field records the minimum order quantity for this trading symbol on the exchange.
- `MaxQty` (number): Example value: ```1000```, the ```MaxQty``` field records the maximum order quantity for this trading symbol on the exchange.
- `MinNotional` (number): Example value: ```5```, the ```MinNotional``` field records the minimum order value for this trading symbol on the exchange.
- `MaxNotional` (number): Example value: ```9999999```, the ```MaxNotional``` field records the maximum order value for this trading symbol on the exchange.
- `CtVal` (number): The ```CtVal``` field records the value corresponding to a single contract for this trading symbol on the exchange, with the unit specified in the ```CtValCcy``` field. For example: ```CtVal``` of 0.01 and ```CtValCcy``` of ```"BTC"``` means a single contract is worth 0.01 BTC.
- `CtValCcy` (number): The ```CtValCcy``` field records the value unit of a single contract. The value unit of a single contract can be: ```BTC```, ```USD```, ```ETH```, etc.
- `Info` (object): The ```Info``` field records the raw data of this symbol returned by the exchange's market information interface.

The exchange.GetMarkets() function returns a dictionary containing this ```Market``` structure.

Due to varying levels of support for market information data across different exchanges, fields not supported by an exchange will be ignored. All field values above are derived from the exchange interface's raw data, and specific details can also be found in the ```Info``` field content.

See also: `exchange.GetMarkets`

### Order

Order structure.

Fields:

- `Info` (object): Raw data returned by the exchange interface, this attribute is not available during backtesting.
- `Symbol` (string): The ```Symbol``` field is the trading symbol code defined by the FMZ platform, with the same format as the ```Symbol``` field in the `Ticker` structure.

- For spot exchange objects, the format of the ```Symbol``` field value (example) is: ```BTC_USDT```, representing the BTC_USDT spot trading pair.

- For futures exchange objects, the format of the ```Symbol``` field value (example) is: ```BTC_USDT.swap```, representing the BTC USDT-margined perpetual contract.
- `Id` (string): Order ID, this attribute consists of the exchange symbol code and the exchange's original order ID, separated by an English comma. For example, the ```Id``` attribute format for an ```ETH_USDT``` spot trading pair order on OKX exchange is: ```ETH-USDT,1547130415509278720```.
- `Price` (number): Order price, note that this attribute for market orders may be 0 or -1.
- `Amount` (number): Order quantity, note that this attribute for market orders may be the amount value rather than the coin quantity.
- `DealAmount` (number): Filled quantity, if the exchange interface does not provide this data, it may be filled with 0.
- `AvgPrice` (number): Average filled price, note that some exchanges do not provide this data. When not provided and cannot be calculated, this attribute is set to 0.
- `Status` (number): Order status, refer to `ORDER_STATE_PENDING`, `ORDER_STATE_CLOSED`, `ORDER_STATE_CANCELED`, `ORDER_STATE_UNKNOWN`.
- `Type` (number): Order type, refer to `ORDER_TYPE_BUY`, `ORDER_TYPE_SELL`.
- `Offset` (number): Open/close direction for contract orders, refer to `ORDER_OFFSET_OPEN`, `ORDER_OFFSET_CLOSE`.
- `ContractType` (string): For spot orders, this attribute is ```""```, i.e., an empty string. For contract orders, this attribute is the specific contract code.
- `Condition` (object): Conditional order configuration information. When the order is a conditional order, this field contains the trigger conditions and execution price configuration for the conditional order. For regular orders, this field is null.

The structure of this field refers to the `Condition` structure.
- `Time` (number): Order creation time, millisecond timestamp.

The ```Order``` structure can be returned by ```exchange.GetOrder()``` and ```exchange.GetOrders()``` functions. The ```exchange.GetOrders()``` function returns an array of ```Order``` structures or an empty array. If there are no pending orders currently, it returns ```[]```, i.e., an empty array. The ```Status``` attribute of the ```Order``` structure can be directly compared with constants like ```ORDER_STATE_PENDING``` to determine if they are equal and thus confirm the order status.

For one-way position mode, when it cannot be determined whether an order is for closing (reducing) a position, the ```Offset``` field is set to the opening direction by default, i.e., ```ORDER_OFFSET_OPEN```.

The ```Time``` field represents the order creation time as a millisecond timestamp. Some exchanges may also include time information in the ```Info``` field, but the ```Time``` field provides a standardized timestamp format.

See also: `exchange.GetOrder`, `exchange.GetOrders`, `exchange.GetHistoryOrders`, `Condition`

### Condition

Conditional order configuration structure, used to set trigger conditions and execution prices for conditional orders.

Fields:

- `ConditionType` (number): Conditional order type, available values:

- `ORDER_CONDITION_TYPE_OCO` (value 0): OCO order (One-Cancels-the-Other)

- `ORDER_CONDITION_TYPE_TP` (value 1): Take Profit order

- `ORDER_CONDITION_TYPE_SL` (value 2): Stop Loss order

- `ORDER_CONDITION_TYPE_GENERIC` (value 3): Generic conditional order
- `TpTriggerPrice` (number): Take profit trigger price. Used when the conditional order type is TP or OCO, the take profit order is triggered when the market price reaches this price.
- `TpOrderPrice` (number): Take profit order execution price, i.e., the actual order price after take profit is triggered. A price of -1 indicates execution as a market order.
- `SlTriggerPrice` (number): Stop loss trigger price. Used when the conditional order type is SL or OCO, the stop loss order is triggered when the market price reaches this price.
- `SlOrderPrice` (number): Stop loss order execution price, i.e., the actual order price after stop loss is triggered. A price of -1 indicates execution as a market order.

- OCO orders (ConditionType=`ORDER_CONDITION_TYPE_OCO`) set both take profit and stop loss conditions simultaneously. When one condition is triggered, the other is automatically canceled.
- TP orders (ConditionType=`ORDER_CONDITION_TYPE_TP`) only use the TpTriggerPrice and TpOrderPrice fields.
- SL orders (ConditionType=`ORDER_CONDITION_TYPE_SL`) only use the SlTriggerPrice and SlOrderPrice fields.
- GENERIC orders (ConditionType=`ORDER_CONDITION_TYPE_GENERIC`) are generic conditional orders, and the specific fields used depend on the exchange implementation.

Support for conditional order functionality depends on the specific exchange. Some exchanges may not support certain types of conditional orders.

See also: `Order`, `exchange.CreateConditionOrder`, `exchange.GetConditionOrder`

### Account

Data structure for account information.

Fields:

- `Info` (object): Raw data returned by the exchange API. This property does not exist in backtesting mode.
- `Balance` (number): Available amount of quote currency. In spot trading, if the trading pair is BTC_USDT, Balance represents the current available USDT amount. In USDT-margined contracts, Balance represents the available margin (USDT, quoteCurrency) amount.
- `FrozenBalance` (number): Asset value frozen when orders are pending.
- `Stocks` (number): Available amount of base currency. In spot trading, if the trading pair is BTC_USDT, Stocks represents the current available BTC amount. In coin-margined contracts, Stocks represents the available margin (coin, baseCurrency) amount.
- `FrozenStocks` (number): Asset value frozen when orders are pending.
- `Equity` (number): Only supported by futures exchange objects. The ```Equity``` field represents the **total equity** of the futures account margin under the current contract settings. If the exchange API does not provide relevant data, this field value is 0.
- `UPnL` (number): Only supported by futures exchange objects. The ```UPnL``` field represents the total **unrealized profit and loss** of all open positions in the futures account margin under the current contract settings.

The exchange.GetAccount() function returns an Account structure. The data in the returned structure depends on the currently set trading pair and contract code.

See also: `exchange.GetAccount`

### Asset

Data structure for specific currency asset information.

Fields:

- `Currency` (string): Currency asset name defined by the exchange. Due to potential differences in naming conventions across exchanges, the same currency may use different identifiers on different exchanges, for example ```BTC``` may be identified as ```XBT``` on some exchanges.
- `Amount` (number): Available balance amount of the currency asset.
- `FrozenAmount` (number): Frozen amount of the currency asset.

The frozen amount ```FrozenAmount``` of currency assets typically includes assets locked by open orders and margin required for futures positions.

See also: `exchange.GetAssets`

### Position

Data structure for contract position information.

Fields:

- `Info` (object): Raw data returned by the exchange interface. This attribute does not exist in backtesting mode.
- `Symbol` (string): The ```Symbol``` field is the trading symbol code defined by the FMZ platform, with a format consistent with the ```Symbol``` field of the `Ticker` structure.

- For spot exchange objects, the format of the ```Symbol``` field value (example) is: ```BTC_USDT```, representing the BTC_USDT spot trading pair.

- For futures exchange objects, the format of the ```Symbol``` field value (example) is: ```BTC_USDT.swap```, representing the BTC USDT-margined perpetual contract.
- `MarginLevel` (number): Position leverage multiplier. If the exchange interface does not provide this data, it will be filled through calculation and may contain errors.
- `Amount` (number): Position quantity, usually a positive integer (number of contracts). Note that contract multipliers, values, and other contract specifications may differ between exchanges.
- `FrozenAmount` (number): Frozen position quantity, temporarily frozen position quantity when close orders are not filled.
- `Price` (number): Average position price. In principle, this attribute is the overall average price of the position (not involved in settlement). If the exchange interface does not provide this data, it will be filled with the existing average position price from the exchange interface (involved in settlement).
- `Profit` (number): Floating profit and loss of the position. In principle, this is the unrealized profit and loss of the position. If the exchange interface does not provide this data, it will be filled with other profit and loss data from the exchange interface. The unit of the profit and loss value is the same as the unit of the current contract margin.
- `Type` (number): Position type, refer to `PD_LONG`, `PD_SHORT`.
- `ContractType` (string): Contract code. For specific content, please refer to the description of the `exchange.SetContractType` function.
- `Margin` (number): Margin occupied by the position. If the exchange interface does not provide this data, it will be filled with 0.

The exchange.GetPositions() function returns a Position array or an empty array.

For cryptocurrency futures, it should be noted that in the Position structure array returned by the exchange.GetPositions() function, the FrozenAmount, Profit, and Margin attributes of the position data structure may have different definitions when calling the exchange.GetPositions() interface for different exchange objects, as the data provided by exchanges is not unified.

For example, some exchanges do not have frozen position data in their position data, in which case FrozenAmount is 0. If specific data needs to be calculated, the raw data in the Info attribute can be used for calculation and analysis.

See also: `exchange.GetPositions`

### Funding

Data structure for trading instrument funding rate information, only cryptocurrency perpetual contracts support funding rate functionality.

Fields:

- `Info` (object): Raw data object returned from cryptocurrency futures exchange funding rate API calls.
- `Symbol` (string): The ```Symbol``` field is the standardized trading instrument code defined by the FMZ platform.
- `Interval` (number): Funding rate settlement interval period, unit: milliseconds. For example, ```28800000``` represents an 8-hour interval.
- `Time` (number): Timestamp of the next funding rate period start time (current period settlement time), unit: milliseconds.
- `Rate` (number): Funding rate value to be applied at the current period settlement.

Different futures exchanges use different calculation methods and mechanisms for perpetual contract funding rates, with settlement periods including 1 hour, 4 hours, 8 hours, 24 hours, etc.

The current funding rate for futures exchange perpetual contracts may be a fixed value or a real-time calculated floating value.

The ```Rate``` field is the funding rate value without the ```%``` symbol. To convert to percentage format, multiply the value by 100 and add the ```%``` symbol.

See also: `exchange.GetFundings`

### OtherStruct

#### HttpQuery-options

This JSON structure is used to configure various parameters for HTTP requests sent by HttpQuery and HttpQuery_Go functions.

Fields:

- `method` (string): HTTP request method, for example: ```GET```, ```POST```, etc.
- `body` (string): Request body content. For example, in POST requests, body can contain form data, JSON data, text, etc.
- `charset` (string): Character set encoding. Used to specify the encoding method for text data in the request body, for example: ```"UTF-8"```.
- `cookie` (string): Cookie is a small piece of data used to store and exchange state information between the client (usually a browser) and the server.
- `debug` (bool): Debug mode switch. When set to true, the HttpQuery function call will return the complete HTTP response message; when set to false, it only returns the data in the response message Body.
- `headers` (JSON): HTTP request header information, existing as key-value pairs (JSON structure), used to pass various information such as content type, authentication information, cache control, etc.
- `timeout` (number): Timeout setting in milliseconds. Setting 1000 means 1 second timeout.

Usage example:
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

HTTP message sent when the above code is executed:

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

This JSON structure is the data structure returned by the HttpQuery function in debug mode, when the debug field is set to true in the ```options``` parameter structure while calling the HttpQuery function.

Fields:

- `StatusCode` (number): HTTP status code. It is 0 when no response is received for the request (connection refused, DNS resolution failure, timeout, proxy failure, etc.).
- `Header` (JSON): Response header information.
- `Cookies` (array): Cookies information.
- `Trace` (JSON): Complete trace information of the request.
- `Length` (number): Message length.
- `Body` (string): Message content. It is an empty string when the request fails.
- `Error` (string): The reason for the request failure, including the request method, URL, and underlying error information, for example: ```Get "https://www.okx.com/api/v5/public/time": timeout after 1000ms```. It only appears when the request fails (```StatusCode``` is 0).

Example of the returned JSON data structure:
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

Example of the data structure returned when the request fails (no response received):
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
Responses with HTTP status codes 4xx and 5xx are not considered request failures. In this case, ```StatusCode``` is the actual status code, and the ```Error``` field is not included. You can use ```StatusCode``` for unified checking: ```if (ret.StatusCode !== 200) { ... }```.

See also: `HttpQuery`, `HttpQuery_Go`

#### LogStatus-table

This JSON structure is used to configure the table content displayed in the strategy status bar.

Fields:

- `type` (string): Used to set the type of UI control to be parsed and displayed. For status bar tables, it is fixed as: ```table```.
- `title` (string): Used to set the title of the status bar table.
- `cols` (array): Used to set the column headers of the status bar table. The first element of the array is the title of the first column, and so on.
- `rows` (array): Used to set the row data of the status bar table. The first element of this rows array (two-dimensional array) is also an array structure. The length of this array structure should be consistent with the number of table columns (elements in the array correspond one-to-one with table column names), representing the first row of data in the table.

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

This JSON structure is used to configure button controls in the status bar. The button control JSON structure can be embedded into the status bar table JSON structure. This is a legacy version structure that the platform still supports for compatibility, but it is recommended to use the latest version of the button JSON structure.
Status bar button control construction example (after button click trigger, the popup contains a single input control, constructed through the input field):
```json
{
    "type": "button",
    "cmd": "open",
    "name": "Open Position",
    "input": {
        "name": "Position Size",
        "type": "number",
        "defValue": 1
    }
}
```
The controls in the popup triggered by clicking the status bar button are configured through the ```input``` or ```group``` fields.

Fields:

- `type` (string): For button controls, fixed as: ```button```.
- `class` (string): Button type setting.
- `name` (string): The text displayed on the button control, i.e., the button name.
- `cmd` (string): The interactive command content sent to the strategy when the button control triggers a click operation.
- `description` (string): Description information for the button control. This description is displayed when the mouse hovers over the button in the status bar.
- `disabled` (bool): Set the button as disabled (true) or enabled (false).
- `input` (JSON): When constructing status bar buttons for interaction, data input is supported. The interaction command is ultimately captured by the ```GetCommand()``` function. Add an ```input``` item to the JSON data structure of the status bar button control to configure the input control in the popup displayed when the button is triggered.
For example, set the ```input``` field value to:
```json
{
    "name": "Position Size",
    "type": "number",
    "defValue": 1,
    "description": "test"
}
```

Description of each field in the above JSON structure:
- name
  The title of the control in the popup that appears after the status bar button is clicked.
- description
  The description information of the control in the popup that appears after the status bar button is clicked.
- type
  The type of control in the popup that appears after the status bar button is clicked. The type field can take the following values:
  1. ```"number"```: Numeric input control.
  2. ```"string"```: String input control.
  3. ```"selected"```: Dropdown control.
  4. ```"boolean"```: Switch control.
- defValue
  The default value of the control in the popup that appears after the status bar button is clicked.
  For dropdown type controls (selected), the defValue field is used to set dropdown options, for example: ```"input": {"name": "Position Size", "type": "selected", "defValue": "A|B|C"}```, the text descriptions of the dropdown options are set to A, B, C.

Extended fields for dropdown type controls:
- options
  For dropdown controls in the page triggered by status bar button controls, the options field can be used to set options. Options in the options field support not only strings but also the ```{text: "description", value: "value"}``` structure. Use the defValue field to set default options, which can be multiple selections.
- multiple
  When this field is set to true, the dropdown supports multiple selections.
- `group` (array): The ```input``` field configures a single control in the popup that appears after the status bar button is clicked, while the ```group``` field is used to configure a group of controls. The data structure of elements in ```group``` is consistent with the value of the ```input``` field. Please refer to the related description of the ```input``` field.

Example of ```class``` attribute values for button JSON structure in status bar:
```js
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

```group``` field and ```input``` field usage example:
```js
function main() {
    // Status bar button control (implemented with input field) - The dropdown control on the page triggered by testBtn1 button uses options field to set options and defValue field to set default option. This differs from other examples in this chapter that directly use defValue to set options.
    var testBtn1 = {
        type: "button",
        name: "testBtn1",
        cmd: "cmdTestBtn1",
        input: {name: "testBtn1ComboBox", type: "selected", options: ["A", "B"], defValue: 1}
    }

    /*
      Status bar button control (implemented with input field) - The dropdown control on the page triggered by testBtn2 button uses options field to set options. The options field supports not only strings,
      but also ```{text: "description", value: "value"}``` structure. Use defValue field to set default option, which can be multiple selections (implemented through array structure). Multiple selection requires setting additional field multiple to true.
    */
    var testBtn2 = {
        type: "button",
        name: "testBtn2",
        cmd: "cmdTestBtn2",
        input: {
            name: "testBtn2MultiComboBox",
            type: "selected",
            description: "Implement dropdown multi-select",
            options: [{text: "Option A", value: "A"}, {text: "Option B", value: "B"}, {text: "Option C", value: "C"}],
            defValue: ["A", "C"],
            multiple: true
        }
    }

    // Status bar grouped button control (implemented with group field) - The dropdown control on the page triggered by testBtn3 button uses options field to set options, and also supports directly using defValue to set options.
    var testBtn3 = {
        type: "button",
        name: "testBtn3",
        cmd: "cmdTestBtn3",
        group: [
            {name: "comboBox1", label: "labelComboBox1", description: "Dropdown 1", type: "selected", defValue: 1, options: ["A", "B"]},
            {name: "comboBox2", label: "labelComboBox2", description: "Dropdown 2", type: "selected", defValue: "A|B"},
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

See also: `LogStatus`

#### LogStatus-btnTypeTwo

This JSON structure is used to configure button controls in the status bar. The button control JSON structure can be embedded into the status bar table JSON structure. This is the latest version of the button JSON structure.
Status bar button control construction example (after the button is clicked, a popup contains multiple input controls, constructed through the group field):
```json
{
    "type": "button",
    "cmd": "open",
    "name": "Open Position",
    "group": [{
        "type": "selected",
        "name": "tradeType",
        "label": "Order Type",
        "description": "Market order, Limit order",
        "default": 0,
        "group": "Trading Settings",
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
        "group": "Trading Settings",
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
        "group": "Trading Settings",
        "filter": "tradeType==1",
        "settings": {
            "required": true,
        }
    }, {
        "type": "number",
        "name": "amount",
        "label": "Order Amount",
        "description": "Order quantity",
        "group": "Trading Settings",
        "settings": {
            "required": true,
        }
    }],
}
```
The controls in the popup triggered by clicking the status bar button control are set through the ```input``` or ```group``` field.

Fields:

- `type` (string): For button controls, this field is fixed as: ```button```.
- `name` (string): The text displayed on the button control, i.e., the button name.
- `cmd` (string): The interactive command content sent to the strategy when the button control triggers a click action.
- `input` (JSON): When constructing status bar buttons for interaction, input data is also supported. The interaction commands are ultimately captured by the ```GetCommand()``` function. Add an ```input``` item to the JSON data structure of the status bar button control to configure the input controls displayed in the popup when the button is triggered.

Compared to the old version of the input structure, the new version adds some new fields and changes:
```json
{
    "type": "selected",
    "name": "test",
    "label": "topic",
    "description": "desc",
    "default": 1,
    "filter": "a>1",
    "group": "group1",
    "settings": { ... },    // Component configuration
}
```

Description and explanation of each field in the above JSON structure:
- type
  Control type (required field), supports setting to: ```"number"``` numeric input box, ```"string"``` string input box, ```"selected"``` dropdown box, ```"boolean"``` switch control.
- name
  If the current JSON structure is the field value of the input field, when the label field is not set, name is the control title in the popup that appears after clicking the status bar button.
  If the current JSON structure is an element in the field value (array structure) of the group field, name is not used as the control title, the name field is used to represent the field name of the control input content. For example, the following code snippet of the group field explains:
  ```json
  var testBtn3 = {
      type: "button",
      name: "testBtn3",
      cmd: "cmdTestBtn3",
      group: [
          {name: "comboBox1", label: "labelComboBox1", description: "Dropdown box 1", type: "selected", defValue: 1, options: ["A", "B"]},
          {name: "comboBox2", label: "labelComboBox2", description: "Dropdown box 2", type: "selected", defValue: "A|B"},
          {name: "comboBox3", label: "labelComboBox3", description: "Dropdown box 3", type: "selected", defValue: [0, 2], multiple: true, options: ["A", "B", "C"]},
          {
              name: "comboBox4",
              label: "labelComboBox4",
              description: "Dropdown box 4",
              type: "selected",
              defValue: ["A", "C"],
              multiple: true,
              options: [{text: "Option A", value: "A"}, {text: "Option B", value: "B"}, {text: "Option C", value: "C"}, {text: "Option D", value: "D"}]
          }
      ]
  }
  ```
  According to this code snippet, if the status bar button triggers interaction, a popup will appear with 4 controls, all of which are dropdown controls. After setting the options for each control and clicking OK to send the interaction message, the GetCommand function in the strategy will receive ```cmdTestBtn3:{"comboBox1":1,"comboBox2":0,"comboBox3":[0,2],"comboBox4":["A","C"]}```.
  The values of name in the JSON structure are all used as field names for the returned interaction information, for example: comboBox1, comboBox2, etc.
- label
  Used to set the control title.
- description
  Description information of the control. If the current JSON structure is an element in the field value (array structure) of the group field, when the label field is not set, description is the control title in the popup that appears after clicking the status bar button.
- default
  The default value of the control.
- filter
  Selector, used to hide controls. Not setting this field means no filtering (display control); when this field is set, when the expression is true, no filtering (display control), when the expression is false, filtering (do not display control).
- group
  Used to control control grouping, collapsible.
- settings
  Component configuration, controls have multiple UI options to choose from, this option can be used for specific settings. For example:
  ```json
  settings:{
      multiple:true,
      customizable:true,
      options:[{name:'xxx|yyy',value:0}]
  }
  ```

  Settings related configurations:
  settings.required: Whether required.
  settings.disabled: Whether disabled.
  settings.min: Valid when type=number, indicates minimum value or minimum string length.
  settings.max: Valid when type=number, indicates maximum value or maximum string length.
  settings.step: Valid when type=number, render=slider, indicates step size.
  settings.multiple: Valid when type=selected, indicates support for multiple selection.
  settings.customizable: Valid when type=selected, indicates support for customization; users can directly edit and add new options in the dropdown control, if a newly edited option is selected, the name of the option is used instead of the value it represents when triggering interaction.
  settings.options: Valid when type=selected, indicates the option data format of the selector: ["Option 1", "Option 2"], [{'name':'xxx','value':0}, {'name':'xxx','value':1}].
  settings.render: Render component type.
  When type=number, settings.render is not set (default numeric input box), optional: slider (slider bar), date (time selector returns timestamp).
  When type=string, settings.render is not set (default single-line input box), optional: textarea (multi-line input), date (time selector returns yyyy-MM-dd hh:mm:ss), color (color selector returns #FF00FF).
  When type=selected, settings.render is not set (default dropdown box), optional: segment (segment selector).
  When type=boolean, currently only default checkbox.
- `group` (array): The ```input``` field configures a control in the dialog box that pops up after clicking the status bar button. The difference between ```group``` and ```input``` is that ```group``` configures a group of controls. The elements in ```group``` have the same data structure as the ```input``` field values. Please refer to the above ```input``` field description.

Supports bilingual settings:
```json
{
    type:'selected',
    name:'test',
    label:'选项｜options',
    description:'描述｜description',
    default:0,                            // Here default value is set to 0, representing the value in {name:'xxx|yyy',value:0} option
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

This JSON is used to configure chart settings for the custom plotting function ```Chart()```. The chart library uses Highcharts. The following lists several basic configuration fields.

Fields:

- `__isStock` (string): Platform extension field. When set to true, uses Highstocks chart; when set to false, uses Highcharts chart.
- `extension` (JSON): ```json
{
    layout: 'single', // Not grouped, displayed separately, default is grouped 'group'
    height: 300,      // Specify height
}
```
- `title` (string): Chart title
- `xAxis` (JSON): X-axis configuration.
- `yAxis` (JSON): Y-axis configuration.
- `series` (JSON): Chart data series.

Simple plotting example:
```js
// This chart is an object in JavaScript. Before using the Chart function, you need to declare an object variable chart for configuring the chart
var chart = {
    // This field marks whether the chart is a stock chart. Interested users can change it to false and run to see the effect
    __isStock: true,
    // Zoom tool
    tooltip: {xDateFormat: '%Y-%m-%d %H:%M:%S, %A'},
    // Title
    title : { text : 'Spread Analysis Chart'},
    // Range selector
    rangeSelector: {
        buttons: [{type: 'hour',count: 1, text: '1h'}, {type: 'hour',count: 3, text: '3h'}, {type: 'hour', count: 8, text: '8h'}, {type: 'all',text: 'All'}],
        selected: 0,
        inputEnabled: false
    },
    // Horizontal axis (X-axis), currently set type is datetime
    xAxis: { type: 'datetime'},
    // Vertical axis (Y-axis), default values adjust with data size
    yAxis : {
        // Title
        title: {text: 'Spread'},
        // Whether to enable right-side Y-axis
        opposite: false
    },
    // Data series, this property stores various data series (lines, candlestick charts, labels, etc.)
    series : [
        // Index 0, data array stores data for this index series
        {name : "line1", id : "Line1,buy1Price", data : []},
        // Index 1, dashStyle:'shortdash' is set to display as dashed line
        {name : "line2", id : "Line2,lastPrice", dashStyle : 'shortdash', data : []}
    ]
}
function main(){
    // Call Chart function to initialize the chart
    var ObjChart = Chart(chart)
    // Clear
    ObjChart.reset()
    while(true){
        // Get the timestamp of this polling cycle, i.e., millisecond timestamp, used to determine the position on the chart's X-axis
        var nowTime = new Date().getTime()
        // Get market data
        var ticker = _C(exchange.GetTicker)
        // Get the best bid price from the market data return value
        var buy1Price = ticker.Buy
        // Get the last traded price. To prevent the two lines from overlapping, we add 1
        var lastPrice = ticker.Last + 1
        // Pass timestamp as X value and best bid price as Y value to data series at index 0
        ObjChart.add(0, [nowTime, buy1Price])
        // Same as above
        ObjChart.add(1, [nowTime, lastPrice])
        Sleep(2000)
    }
}
```

See also: `Chart`

#### KLineChart-options

This JSON is used to configure the chart settings for the custom drawing function ```KLineChart```. Only a few basic configuration fields are listed below.

Fields:

- `overlay` (bool): Whether to draw on the main chart.
- `xAxis` (JSON): X-axis configuration parameters.
- `yAxis` (JSON): Y-axis configuration parameters.
- `candle` (JSON): Candlestick chart configuration parameters.

Refer to [Topic article on drawing with KLineChart function](https://www.fmz.com/bbs-topic/9482).

See also: `KLineChart`

#### SetData-data

This JSON is used to set the data to be loaded by the ```exchange.SetData()``` function. This JSON data uses an array structure, where each element is also an array with the format ```[time, data]```.

Fields:

- `time` (number): The timestamp of the data, used to mark the time corresponding to this data entry.
- `data` (string / number / bool / object / array / any (any type supported by the platform)): data is the specific data content corresponding to a certain time in the data loaded by the ```exchange.SetData()``` function. When the strategy is running, the ```exchange.GetData()``` function retrieves the data with the corresponding timestamp based on the current time.

Example of loading data in the backtesting system and retrieving data when the strategy backtest is running:
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

This JSON is the data structure returned by the ```EventLoop()``` function. The ```EventLoop()``` function monitors the following events: 1. Any WebSocket readable data events; 2. Completion events of concurrent tasks from exchange.Go() and HttpQuery_Go() functions; 3. Message events sent by threads created using the ```threading.Thread()``` function in JavaScript language strategies.

Fields:

- `Seq` (number): Event sequence number.
- `Event` (string): Event name.
- `ThreadId` (number): Event thread ID.
- `Index` (number): Event index.
- `Nano` (number): Nanosecond timestamp.

When using the ```exchange.Go()``` function for concurrent requests, the event data structure returned by the ```EventLoop()``` function.
```json
{
    "Seq":1,
    "Event":"Exchange_GetTrades",
    "ThreadId":0,
    "Index":3,
    "Nano":1682068771309583400
}
```

When concurrent execution threads in JavaScript language strategies (created by the ```threading.Thread()``` function) use the thread object's ```postMessage()``` function to send messages, the ```EventLoop()``` function in the receiving thread will monitor the following event data structure:
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

This JSON is the data structure returned by the ```DBExec()``` function; this JSON data structure is also returned when executing SQL statements using the ```exec()``` method of objects created by the ```Dial()``` function.

Fields:

- `columns` (array): Column names of the queried data, string array.
- `values` (array): The specific data queried, where each data item corresponds to the column names. The values field is a two-dimensional array, with each element being an array representing one data record.

Example of querying data from database:
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

This JSON is the data structure returned by the ```join()``` member function of the ```Thread``` object, used to store information related to concurrent threads in ```JavaScript``` language strategies. The ```Thread``` object refers to a thread object created via ```threading.Thread()```.

Fields:

- `id` (number): Thread ID.
- `terminated` (bool): Whether the thread was forcibly terminated.
- `elapsed` (number): Thread execution time (nanoseconds).
- `ret` (number): Return value of the thread function.

The following code tests the timeout mechanism of the ```join()``` function of the ```Thread``` object and prints the return value of the ```join()``` function.
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

## Built-in Variables

### EXCHANGE

#### exchange

exchange is an exchange object, and it is also the first exchange object added in the strategy live trading settings and backtesting settings. All interactions with the exchange are implemented through the member functions of this object.

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

exchanges is an array of exchange objects that contains all the exchange objects added in the strategy's live trading settings or backtesting settings, where exchanges[0] is `exchange`.

The exchange objects added in the strategy's live trading settings or backtesting settings correspond to exchanges[0], exchanges[1], exchanges[2], …… exchanges[n] in the order they were added.

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

ORDER_STATE_PENDING is the value of the ```Status``` property in the `Order` structure, indicating that the order status is pending.

The value of ORDER_STATE_PENDING is 0.

See also: `ORDER_STATE_CLOSED`, `ORDER_STATE_CANCELED`, `ORDER_STATE_UNKNOWN`

#### ORDER_STATE_CLOSED

ORDER_STATE_CLOSED is the value of the ```Status``` property in the `Order` structure, indicating that the order status is completed.

The value of ORDER_STATE_CLOSED is 1.

See also: `ORDER_STATE_PENDING`, `ORDER_STATE_CANCELED`, `ORDER_STATE_UNKNOWN`

#### ORDER_STATE_CANCELED

ORDER_STATE_CANCELED is the value of the ```Status``` property in the `Order` structure, indicating that the order status is canceled.

The value of ORDER_STATE_CANCELED is 2.

See also: `ORDER_STATE_PENDING`, `ORDER_STATE_CLOSED`, `ORDER_STATE_UNKNOWN`

#### ORDER_STATE_UNKNOWN

ORDER_STATE_UNKNOWN is the value of the ```Status``` property in the `Order` structure, indicating that the order status is unknown (other status).

The value of ORDER_STATE_UNKNOWN is 3.

For ```ORDER_STATE_UNKNOWN``` status, you can call the `exchange.GetRawJSON` function to get the raw order status information and refer to the exchange documentation for specific descriptions.

See also: `ORDER_STATE_PENDING`, `ORDER_STATE_CLOSED`, `ORDER_STATE_CANCELED`

### ORDER_TYPE

#### ORDER_TYPE_BUY

ORDER_TYPE_BUY is the value of the ```Type``` property in the `Order` structure, representing a buy order type.

The value of ORDER_TYPE_BUY is 0.

See also: `ORDER_TYPE_SELL`

#### ORDER_TYPE_SELL

ORDER_TYPE_SELL is the ```Type``` property value in the `Order` structure, used to indicate a sell order type.

The value of ORDER_TYPE_SELL is 1.

See also: `ORDER_TYPE_BUY`

### ORDER_CONDITION_TYPE

#### ORDER_CONDITION_TYPE_OCO

ORDER_CONDITION_TYPE_OCO is the value of the ```ConditionType``` property in the `Condition` structure, representing OCO orders (One-Cancels-the-Other). OCO orders set both take-profit and stop-loss conditions simultaneously. When one condition is triggered, the other condition is automatically cancelled.

The value of ORDER_CONDITION_TYPE_OCO is 0.

See also: `Condition`, `ORDER_CONDITION_TYPE_TP`, `ORDER_CONDITION_TYPE_SL`

#### ORDER_CONDITION_TYPE_TP

ORDER_CONDITION_TYPE_TP is the ```ConditionType``` attribute value in the `Condition` structure, representing a Take Profit order. A take profit order automatically triggers when the market price reaches the preset target profit price.

The value of ORDER_CONDITION_TYPE_TP is 1.

See also: `Condition`, `ORDER_CONDITION_TYPE_OCO`, `ORDER_CONDITION_TYPE_SL`

#### ORDER_CONDITION_TYPE_SL

ORDER_CONDITION_TYPE_SL is the ```ConditionType``` attribute value in the `Condition` structure, representing a Stop Loss order. A stop loss order is automatically triggered when the market price reaches the preset stop loss price, used to limit potential losses.

The value of ORDER_CONDITION_TYPE_SL is 2.

See also: `Condition`, `ORDER_CONDITION_TYPE_OCO`, `ORDER_CONDITION_TYPE_TP`

#### ORDER_CONDITION_TYPE_GENERIC

ORDER_CONDITION_TYPE_GENERIC is the ```ConditionType``` property value in the `Condition` structure, representing a generic conditional order. The specific behavior of generic conditional orders depends on the exchange implementation.

The value of ORDER_CONDITION_TYPE_GENERIC is 3.

See also: `Condition`, `ORDER_CONDITION_TYPE_OCO`, `ORDER_CONDITION_TYPE_TP`

### POSITION_DIRECTION

#### PD_LONG

PD_LONG is the value of the ```Type``` property in the `Position` structure, representing a long position type.

The value of PD_LONG is 0.

For long positions in futures markets, use exchange.SetDirection("closebuy") to set the closing direction to close this type of position.

See also: `PD_SHORT`

#### PD_SHORT

PD_SHORT is the value of the ```Type``` property in the `Position` structure, representing a short position type.

The value of PD_SHORT is 1.

For short positions in futures markets, use exchange.SetDirection("closesell") to set the closing direction to close this type of position.

See also: `PD_LONG`

### ORDER_OFFSET

#### ORDER_OFFSET_OPEN

ORDER_OFFSET_OPEN is a value for the ```Offset``` property in the `Order` structure, indicating that the order is an opening position operation.

The value of ORDER_OFFSET_OPEN is 0.

See also: `ORDER_OFFSET_CLOSE`

#### ORDER_OFFSET_CLOSE

ORDER_OFFSET_CLOSE is a value for the ```Offset``` property in the `Order` structure, indicating that the order is in the close position direction.

The value of ORDER_OFFSET_CLOSE is 1.

See also: `ORDER_OFFSET_OPEN`

### PERIOD

#### PERIOD_M1

Constant representing 1-minute candlestick period, with a value of 60.

See also: `exchange.GetRecords`, `PERIOD_M3`, `PERIOD_M5`, `PERIOD_M15`,  `PERIOD_M30`, `PERIOD_H1`, `PERIOD_H2`, `PERIOD_H4`,  `PERIOD_H6`, `PERIOD_H12`, `PERIOD_D1`, `PERIOD_D3`, `PERIOD_W1`

#### PERIOD_M3

Constant representing the 3-minute candlestick period, with a value of 180.

See also: `exchange.GetRecords`, `PERIOD_M1`, `PERIOD_M5`, `PERIOD_M15`, `PERIOD_M30`, `PERIOD_H1`, `PERIOD_H2`, `PERIOD_H4`, `PERIOD_H6`, `PERIOD_H12`, `PERIOD_D1`, `PERIOD_D3`, `PERIOD_W1`

#### PERIOD_M5

Constant representing the 5-minute candlestick period, with a value of 300.

See also: `exchange.GetRecords`, `PERIOD_M1`, `PERIOD_M3`, `PERIOD_M15`, `PERIOD_M30`, `PERIOD_H1`, `PERIOD_H2`, `PERIOD_H4`, `PERIOD_H6`, `PERIOD_H12`, `PERIOD_D1`, `PERIOD_D3`, `PERIOD_W1`

#### PERIOD_M15

Constant representing the 15-minute candlestick period, with a value of 900.

See also: `exchange.GetRecords`, `PERIOD_M1`, `PERIOD_M3`, `PERIOD_M5`, `PERIOD_M30`, `PERIOD_H1`, `PERIOD_H2`, `PERIOD_H4`, `PERIOD_H6`, `PERIOD_H12`, `PERIOD_D1`, `PERIOD_D3`, `PERIOD_W1`

#### PERIOD_M30

Constant representing the 30-minute candlestick period, with a value of 1800 seconds.

See also: `exchange.GetRecords`, `PERIOD_M1`, `PERIOD_M3`, `PERIOD_M5`, `PERIOD_M15`, `PERIOD_H1`, `PERIOD_H2`, `PERIOD_H4`, `PERIOD_H6`, `PERIOD_H12`, `PERIOD_D1`, `PERIOD_D3`, `PERIOD_W1`

#### PERIOD_H1

Constant representing 1-hour candlestick period, with a value of 3600.

See also: `exchange.GetRecords`, `PERIOD_M1`, `PERIOD_M3`, `PERIOD_M5`, `PERIOD_M15`, `PERIOD_M30`, `PERIOD_H2`, `PERIOD_H4`, `PERIOD_H6`, `PERIOD_H12`, `PERIOD_D1`, `PERIOD_D3`, `PERIOD_W1`

#### PERIOD_H2

Constant representing the 2-hour candlestick period, with a value of 7200.

See also: `exchange.GetRecords`, `PERIOD_M1`, `PERIOD_M3`, `PERIOD_M5`, `PERIOD_M15`, `PERIOD_M30`, `PERIOD_H1`, `PERIOD_H4`, `PERIOD_H6`, `PERIOD_H12`, `PERIOD_D1`, `PERIOD_D3`, `PERIOD_W1`

#### PERIOD_H4

Constant representing the 4-hour candlestick period, with a value of 14400.

See also: `exchange.GetRecords`, `PERIOD_M1`, `PERIOD_M3`, `PERIOD_M5`, `PERIOD_M15`, `PERIOD_M30`, `PERIOD_H1`, `PERIOD_H2`, `PERIOD_H6`, `PERIOD_H12`, `PERIOD_D1`, `PERIOD_D3`, `PERIOD_W1`

#### PERIOD_H6

Constant representing the 6-hour candlestick period, with a value of 21600.

See also: `exchange.GetRecords`, `PERIOD_M1`, `PERIOD_M3`, `PERIOD_M5`, `PERIOD_M15`, `PERIOD_M30`, `PERIOD_H1`, `PERIOD_H2`, `PERIOD_H4`, `PERIOD_H12`, `PERIOD_D1`, `PERIOD_D3`, `PERIOD_W1`

#### PERIOD_H12

Constant representing the 12-hour candlestick period, with a value of 43200.

See also: `exchange.GetRecords`, `PERIOD_M1`, `PERIOD_M3`, `PERIOD_M5`, `PERIOD_M15`, `PERIOD_M30`, `PERIOD_H1`, `PERIOD_H2`, `PERIOD_H4`, `PERIOD_H6`, `PERIOD_D1`, `PERIOD_D3`, `PERIOD_W1`

#### PERIOD_D1

Constant representing 1-day candlestick period, with a value of 86400.

See also: `exchange.GetRecords`, `PERIOD_M1`, `PERIOD_M3`, `PERIOD_M5`, `PERIOD_M15`, `PERIOD_M30`, `PERIOD_H1`, `PERIOD_H2`, `PERIOD_H4`, `PERIOD_H6`, `PERIOD_H12`, `PERIOD_D3`, `PERIOD_W1`

#### PERIOD_D3

Constant representing the 3-day candlestick period, with a value of 259200.

See also: `exchange.GetRecords`, `PERIOD_M1`, `PERIOD_M3`, `PERIOD_M5`, `PERIOD_M15`, `PERIOD_M30`, `PERIOD_H1`, `PERIOD_H2`, `PERIOD_H4`, `PERIOD_H6`, `PERIOD_H12`, `PERIOD_D1`, `PERIOD_W1`

#### PERIOD_W1

Constant representing 1-week candlestick period, with a value of 604800 seconds.

See also: `exchange.GetRecords`, `PERIOD_M1`, `PERIOD_M3`, `PERIOD_M5`, `PERIOD_M15`, `PERIOD_M30`, `PERIOD_H1`, `PERIOD_H2`, `PERIOD_H4`, `PERIOD_H6`, `PERIOD_H12`, `PERIOD_D1`, `PERIOD_D3`

### LOG_TYPE

#### LOG_TYPE_BUY

LOG_TYPE_BUY is an optional value for the ```LogType``` parameter of the `exchange.Log` function, used to set the log type printed by the ```exchange.Log``` function as a buy order log.

The value of LOG_TYPE_BUY is 0.

See also: `LOG_TYPE_SELL`, `LOG_TYPE_CANCEL`

#### LOG_TYPE_SELL

LOG_TYPE_SELL is an optional value for the ```LogType``` parameter of the `exchange.Log` function, used to set the ```exchange.Log``` function to print sell order logs.

The value of LOG_TYPE_SELL is 1.

See also: `LOG_TYPE_BUY`, `LOG_TYPE_CANCEL`

#### LOG_TYPE_CANCEL

LOG_TYPE_CANCEL is an optional value for the ```LogType``` parameter of the `exchange.Log` function, used to set the ```exchange.Log``` function to print order cancellation logs.

The value of LOG_TYPE_CANCEL is 2.

See also: `LOG_TYPE_BUY`, `LOG_TYPE_SELL`
