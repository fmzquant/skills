from typing import Any, Callable, Generic, Literal, Optional, Sequence, TypedDict, TypeVar, Union, overload
import talib as talib

# Python 策略的 API 声明。下面每个名字都由运行时注入到策略的全局命名空间：直接使用，
# 不需要 import（``talib`` 也一样；写 ``import talib`` 也可以）。API 返回的结构都是可以按属性
# 访问的字典：``ticker.Last`` 与 ``ticker["Last"]`` 两种写法都可以。

_V = TypeVar("_V")

# ==================== K-line Period Constants ====================

PERIOD_M1: int
"""1分钟K线周期（60秒）。"""

PERIOD_M3: int
"""3分钟K线周期。"""

PERIOD_M5: int
"""5分钟K线周期。"""

PERIOD_M15: int
"""15分钟K线周期。"""

PERIOD_M30: int
"""30分钟K线周期。"""

PERIOD_H1: int
"""1小时K线周期。"""

PERIOD_H2: int
"""2小时K线周期。"""

PERIOD_H4: int
"""4小时K线周期。"""

PERIOD_H6: int
"""6小时K线周期。"""

PERIOD_H12: int
"""12小时K线周期。"""

PERIOD_D1: int
"""1天K线周期。"""

PERIOD_D3: int
"""3天K线周期。"""

PERIOD_W1: int
"""1周K线周期。"""

# ==================== Order Status Constants ====================

ORDER_STATE_PENDING: int
"""订单未完成（挂单中、部分成交）。值为0。"""

ORDER_STATE_CLOSED: int
"""订单已完成（全部成交）。值为1。"""

ORDER_STATE_CANCELED: int
"""订单已取消（用户或交易所取消，也包括过期、拒单）。值为2。"""

ORDER_STATE_UNKNOWN: int
"""订单状态未知。值为3。"""

# ==================== Order Type Constants ====================

ORDER_TYPE_BUY: int
"""买单。值为0。"""

ORDER_TYPE_SELL: int
"""卖单。值为1。"""

ORDER_TYPE_NONE: int
"""无方向（交易所没有给出方向的合成成交的 ``Trade.Type``）。值为2。"""

# ==================== Order Offset Constants (Futures) ====================

ORDER_OFFSET_OPEN: int
"""开仓订单（期货）。值为0。"""

ORDER_OFFSET_CLOSE: int
"""平仓订单（期货）。值为1。"""

# ==================== Conditional Order Type Constants ====================

ORDER_CONDITION_TYPE_OCO: int
"""OCO条件单（二选一）：同时设置止盈与止损。值为0。"""

ORDER_CONDITION_TYPE_TP: int
"""止盈条件单。值为1。"""

ORDER_CONDITION_TYPE_SL: int
"""止损条件单。值为2。"""

ORDER_CONDITION_TYPE_GENERIC: int
"""通用条件单（只出现在查询结果中，例如追踪止损）。值为3。"""

# ==================== Log Type Constants ====================

LOG_TYPE_BUY: int
"""买入日志类型，用于 ``exchange.Log()``。值为0。"""

LOG_TYPE_SELL: int
"""卖出日志类型，用于 ``exchange.Log()``。值为1。"""

LOG_TYPE_CANCEL: int
"""撤单日志类型，用于 ``exchange.Log()``。值为2。"""

# ==================== Position Direction Constants (Futures) ====================

PD_LONG: int
"""多头持仓。值为0。"""

PD_SHORT: int
"""空头持仓。值为1。"""

PD_LONG_YD: int
"""昨日多头持仓（国内期货柜台）。值为2。"""

PD_SHORT_YD: int
"""昨日空头持仓（国内期货柜台）。值为3。"""

# ==================== JavaScript-style aliases ====================

null: None
"""``None`` 的别名（保留它是为了让从 JavaScript 移植的代码能运行）。"""

true: bool
"""``True`` 的别名。"""

false: bool
"""``False`` 的别名。"""

NaN: None
"""``None`` 的别名。"""

# ==================== Type Aliases ====================

IOrderId = Union[str, int]
"""订单Id。通常是字符串 ``"交易所品种代码,交易所原始订单Id"``（例如 ``"ETH-USDT,1547130415509278720"``）。"""

# ==================== Data Structures ====================

class IOrderCondition(dict[str, Any]):
    """条件单的触发条件与执行价格（``Order.Condition``；``exchange.CreateConditionOrder()`` 的 ``condition`` 参数）。

    Example::

        # 止盈
        tp = {"ConditionType": ORDER_CONDITION_TYPE_TP, "TpTriggerPrice": 55000, "TpOrderPrice": -1}
        # 止损
        sl = {"ConditionType": ORDER_CONDITION_TYPE_SL, "SlTriggerPrice": 48000, "SlOrderPrice": 47900}
        # OCO（止盈 + 止损）
        oco = {"ConditionType": ORDER_CONDITION_TYPE_OCO,
               "TpTriggerPrice": 55000, "TpOrderPrice": 54900,
               "SlTriggerPrice": 48000, "SlOrderPrice": 47900}
    """
    ConditionType: int
    """条件单类型：``ORDER_CONDITION_TYPE_OCO``（0）、``TP``（1）、``SL``（2）、``GENERIC``（3，只出现在查询结果中）。"""
    TpTriggerPrice: float
    """止盈触发价（TP 与 OCO）。"""
    TpOrderPrice: float
    """止盈执行价；下单时 ``-1`` 表示市价。查询结果中市价执行的价格通常为0。"""
    SlTriggerPrice: float
    """止损触发价（SL 与 OCO）。"""
    SlOrderPrice: float
    """止损执行价；下单时 ``-1`` 表示市价。查询结果中市价执行的价格通常为0。"""

class IOrder(dict[str, Any]):
    """订单结构，由 ``exchange.GetOrder()``、``exchange.GetOrders()``、``exchange.GetHistoryOrders()`` 与条件单查询函数返回。

    Example::

        order = exchange.GetOrder(order_id)
        if order:
            Log("价格:", order.Price, "成交:", order.DealAmount, "状态:", order.Status)
    """
    Info: Any
    """交易所接口应答的该订单原始数据（回测时没有）。"""
    Symbol: str
    """品种代码，例如 ``"BTC_USDT"``（现货）、``"BTC_USDT.swap"``（期货）。"""
    Id: IOrderId
    """订单Id：通常为 ``"交易所品种代码,交易所原始订单Id"``，例如 ``"ETH-USDT,1547130415509278720"``。"""
    Time: int
    """订单创建时间（毫秒时间戳）。"""
    Price: float
    """下单价格（市价单可能为0或-1）。"""
    Amount: float
    """下单数量（现货市价买单可能是计价币金额）。"""
    DealAmount: float
    """成交数量。"""
    AvgPrice: float
    """成交均价（交易所不提供时为0）。"""
    Status: int
    """``ORDER_STATE_PENDING``（0）、``ORDER_STATE_CLOSED``（1）、``ORDER_STATE_CANCELED``（2）、``ORDER_STATE_UNKNOWN``（3）。"""
    Type: int
    """``ORDER_TYPE_BUY``（0）或 ``ORDER_TYPE_SELL``（1）。"""
    Offset: int
    """``ORDER_OFFSET_OPEN``（0）或 ``ORDER_OFFSET_CLOSE``（1）（期货；现货订单为开仓）。"""
    ContractType: str
    """期货订单的合约代码（例如 ``"swap"``）；现货为 ``""``。"""
    Condition: IOrderCondition
    """只有条件单有：触发条件与价格。普通订单没有这个键——用 ``order.get("Condition")`` 读取。"""

class IMarketOrder(dict[str, Any]):
    """订单簿的一档（``Depth.Asks`` / ``Depth.Bids`` 的元素）。"""
    Price: float
    """价格。"""
    Amount: float
    """数量。"""

class IDepth(dict[str, Any]):
    """订单簿，由 ``exchange.GetDepth()`` 返回。

    Example::

        depth = exchange.GetDepth()
        if depth:
            Log("卖一:", depth.Asks[0].Price, "买一:", depth.Bids[0].Price)
    """
    Info: Any
    """交易所接口应答的原始数据（回测时没有）。"""
    Time: int
    """毫秒时间戳。"""
    Asks: list[IMarketOrder]
    """卖单，价格从低到高（``Asks[0]`` 为卖一）。"""
    Bids: list[IMarketOrder]
    """买单，价格从高到低（``Bids[0]`` 为买一）。"""

class IFunding(dict[str, Any]):
    """资金费率（永续合约），由 ``exchange.GetFundings()`` 返回。

    Example::

        fundings = exchange.GetFundings("BTC_USDT.swap")
        if fundings:
            Log("费率:", fundings[0].Rate, "下次结算:", _D(fundings[0].Time / 1000))
    """
    Info: Any
    """交易所接口应答的原始数据。"""
    Symbol: str
    """品种代码，例如 ``"BTC_USDT.swap"``。"""
    Interval: int
    """资金费率间隔，单位毫秒（``28800000`` 即8小时）。"""
    Time: int
    """下一期开始时刻（本期结算时刻），毫秒时间戳。"""
    Rate: float
    """本期结算使用的资金费率，例如 0.0001 即 0.01%。"""

class IPosition(dict[str, Any]):
    """期货持仓，由 ``exchange.GetPositions()`` 返回。

    Example::

        positions = exchange.GetPositions("BTC_USDT.swap")
        if positions:
            for pos in positions:
                side = "多" if pos.Type == PD_LONG else "空"
                Log(pos.Symbol, side, "数量:", pos.Amount, "盈亏:", pos.Profit)
    """
    Info: Any
    """交易所接口应答的原始数据（回测时没有）。"""
    Symbol: str
    """品种代码，例如 ``"BTC_USDT.swap"``。"""
    MarginLevel: float
    """杠杆倍数。"""
    Amount: float
    """持仓量（通常为合约张数）。"""
    FrozenAmount: float
    """冻结量（平仓挂单占用）。"""
    Price: float
    """持仓均价。"""
    Profit: float
    """未实现盈亏，单位为保证金币种。"""
    Type: int
    """``PD_LONG``（0）、``PD_SHORT``（1）、``PD_LONG_YD``（2）、``PD_SHORT_YD``（3）。"""
    ContractType: str
    """合约代码，例如 ``"swap"``、``"quarter"``。"""
    Margin: float
    """仓位占用的保证金（不提供时为0）。"""

class ITrade(dict[str, Any]):
    """市场成交记录，由 ``exchange.GetTrades()`` 返回。

    Example::

        trades = exchange.GetTrades()
        if trades:
            Log("最新成交:", trades[-1].Price, trades[-1].Amount)
    """
    Id: str
    """成交Id（交易所不提供时由平台生成，只保证在同一次返回结果中唯一）。"""
    Time: int
    """毫秒时间戳。"""
    Price: float
    """成交价格。"""
    Amount: float
    """成交数量。"""
    Type: int
    """主动成交方向：``ORDER_TYPE_BUY``（0）、``ORDER_TYPE_SELL``（1）；未知时为 ``ORDER_TYPE_NONE``（2）。"""

class ITicker(dict[str, Any]):
    """行情快照，由 ``exchange.GetTicker()`` / ``exchange.GetTickers()`` 返回。

    Example::

        ticker = exchange.GetTicker()
        if ticker:
            Log("最新价:", ticker.Last, "买一:", ticker.Buy, "卖一:", ticker.Sell)
    """
    Info: Any
    """交易所接口应答的原始数据（回测时没有）。"""
    Symbol: str
    """品种代码，例如 ``"BTC_USDT"``、``"BTC_USDT.swap"``。"""
    High: float
    """24小时最高价（不提供时为0）。"""
    Low: float
    """24小时最低价（不提供时为0）。"""
    Sell: float
    """卖一价（行情接口不含盘口数据时为0）。"""
    Buy: float
    """买一价（不提供时为0）。"""
    Last: float
    """最新成交价。"""
    Open: float
    """滚动周期的开盘价（不提供时为0）。"""
    Volume: float
    """最近成交量（现货为交易币，期货为合约张数，以交易所提供的为准）。"""
    Time: int
    """毫秒时间戳。"""
    OpenInterest: float
    """持仓量（不提供时为0）。"""

class IAccount(dict[str, Any]):
    """当前交易对 / 合约的账户资产，由 ``exchange.GetAccount()`` 返回。

    Example::

        account = exchange.GetAccount()
        if account:
            Log("计价币:", account.Balance, "冻结:", account.FrozenBalance)
            Log("交易币:", account.Stocks, "冻结:", account.FrozenStocks)
    """
    Info: Any
    """交易所接口应答的原始数据（回测时没有）。"""
    Balance: float
    """可用计价币（例如 BTC_USDT 的 USDT）；U本位合约为可用保证金。"""
    FrozenBalance: float
    """冻结的计价币。"""
    Stocks: float
    """可用交易币（例如 BTC）；币本位合约为可用保证金（币）。"""
    FrozenStocks: float
    """冻结的交易币。"""
    Equity: float
    """仅期货：当前合约设置下的保证金总权益（不提供时为0）。"""
    UPnL: float
    """仅期货：当前合约设置下所有持仓的未实现盈亏。"""

class IAsset(dict[str, Any]):
    """账户中的一种资产，由 ``exchange.GetAssets()`` 返回。

    Example::

        assets = exchange.GetAssets()
        if assets:
            for a in assets:
                Log(a.Currency, "可用:", a.Amount, "冻结:", a.FrozenAmount)
    """
    Currency: str
    """交易所使用的资产名称（例如 ``"BTC"``；有的交易所叫 ``"XBT"``）。"""
    Amount: float
    """可用数量。"""
    FrozenAmount: float
    """冻结数量。"""

class IRecord(dict[str, Any]):
    """一根K线，``exchange.GetRecords()`` 的元素。

    Example::

        records = exchange.GetRecords(PERIOD_H1)
        if records:
            last = records[-1]
            Log("开:", last.Open, "高:", last.High, "低:", last.Low, "收:", last.Close)
    """
    Time: int
    """这根K线的起始时间（毫秒时间戳）。"""
    Open: float
    """开盘价。"""
    High: float
    """最高价。"""
    Low: float
    """最低价。"""
    Close: float
    """收盘价。"""
    Volume: float
    """成交量。"""
    OpenInterest: float
    """持仓量（不提供时为0）。"""

class IRecordList(list[IRecord]):
    """``exchange.GetRecords()`` 返回的K线列表：``IRecord`` 的 ``list``，外加按列取值。

    ``records.Close``（任意字段名）是该字段在所有K线上的列表——安装了 numpy/TA-Lib 时为 numpy 数组——
    可以直接传给 ``talib`` 的函数。列表本身可以直接传给 ``TA``。

    Example::

        records = exchange.GetRecords(PERIOD_H1)
        if records:
            closes = records.Close
            rsi = TA.RSI(records, 14)
            macd = talib.MACD(records.Close)
    """
    @property
    def Time(self) -> list[int]:
        """各K线的起始时间。"""
        ...
    @property
    def Open(self) -> list[float]:
        """开盘价。"""
        ...
    @property
    def High(self) -> list[float]:
        """最高价。"""
        ...
    @property
    def Low(self) -> list[float]:
        """最低价。"""
        ...
    @property
    def Close(self) -> list[float]:
        """收盘价。"""
        ...
    @property
    def Volume(self) -> list[float]:
        """成交量。"""
        ...
    @property
    def OpenInterest(self) -> list[float]:
        """持仓量。"""
        ...

class IMarket(dict[str, Any]):
    """市场（品种）信息，``exchange.GetMarkets()`` 返回的字典的值。

    Example::

        markets = exchange.GetMarkets()
        if markets:
            m = markets.get("BTC_USDT")
            if m:
                Log("价格精度:", m.PricePrecision, "最小下单量:", m.MinQty)
    """
    Symbol: str
    """交易所原始的品种名称，例如 ``"btcusdt"``（与 ``Ticker.Symbol`` 不同；字典的键才是平台的品种代码）。"""
    BaseAsset: str
    """交易币，大写，例如 ``"BTC"``。"""
    QuoteAsset: str
    """计价币，大写，例如 ``"USDT"``。"""
    TickSize: float
    """价格最小变动，例如 0.01。"""
    AmountSize: float
    """下单量最小变动，例如 0.001。"""
    PricePrecision: int
    """价格小数位数（可能为负数：-1 表示取整到十位）。"""
    AmountPrecision: int
    """下单量小数位数（可能为负数）。"""
    MinQty: float
    """最小下单量。"""
    MaxQty: float
    """最大下单量（不限制时为 9007199254740991）。"""
    MinNotional: float
    """最小下单金额。"""
    MaxNotional: float
    """最大下单金额。交易所不提供时没有这个键。"""
    CtVal: float
    """一张合约的价值，单位为 ``CtValCcy``（期货）。不提供时没有这个键。"""
    CtValCcy: str
    """``CtVal`` 的单位（例如 ``"BTC"``、``"USD"``）。不提供时没有这个键。"""
    Info: Any
    """交易所市场信息接口返回的该品种原始数据。"""

class IGo:
    """``exchange.Go()`` 返回的并发任务。

    Example::

        a = exchange.Go("GetTicker", "BTC_USDT")
        b = exchange.Go("GetDepth")
        ticker, ok = a.wait()
        depth, ok = b.wait()
    """
    def wait(self, timeout: int = 0) -> tuple[Any, bool]:
        """等待任务完成并取出结果。

        Args:
            timeout: 毫秒。不传或 ``0``：阻塞到完成。正数：最多等这么久，任务还没完成时返回 ``(None, False)``，
                之后可以再次调用 ``wait()``。负数（``-1``）：不等待。

        Returns:
            成功时为 ``(结果, True)``（与直接调用的返回值相同）；失败、无数据或超时为 ``(None, False)``。
            结果已经取走后再次调用 ``wait()`` 会记录错误 ``routine N already finished`` 并返回 ``(None, False)``。
        """
        ...

class IHttpQueryGo(Generic[_V]):
    """``HttpQuery_Go()`` 返回的并发请求。"""
    @overload
    def wait(self) -> _V: ...
    @overload
    def wait(self, timeout: int) -> Optional[_V]:
        """等待请求完成，结果与同步的 ``HttpQuery()`` 返回值相同。

        Args:
            timeout: 毫秒。不传或 ``0`` 一直等到完成；``-1`` 不等待；正数最多等这么久。还没完成时返回 ``None``
                （可以再次调用 ``wait()``）。结果已经取走后再次调用 ``wait()`` 会记录错误 ``routine N already finished``
                并返回 ``None``。
        """
        ...

class IData(dict[str, Any]):
    """``exchange.GetData()`` 的返回值。"""
    Time: int
    """匹配到的那一行的时间戳（毫秒）；没有时为 ``offset``（或下一行的时间）。"""
    Data: Any
    """匹配到的那一行的数据；没有数据、拉取失败或数据源不可用时为 ``None``（原因用 ``GetLastError()`` 读取）。"""

class IExchange:
    """交易所账户对象：全局变量 ``exchange``（即 ``exchanges[0]``）或 ``exchanges[i]``。

    交易所函数调用失败时不抛异常：记录一条错误日志，返回 ``None``（``CancelConditionOrder`` 返回 ``False``），
    原因用 ``GetLastError()`` 读取。

    Example::

        ticker = exchange.GetTicker()
        order_id = exchange.Buy(ticker.Sell, 0.1)
        order = exchange.GetOrder(order_id)
    """
    def Go(self, method: str, *args: Any) -> IGo:
        """并发调用交易所函数：立即返回，用 ``wait()`` 取结果。

        Args:
            method: 函数名，例如 ``"GetTicker"``、``"GetDepth"``、``"GetAccount"``、``"GetRecords"``、
                ``"CreateOrder"``、``"Buy"``、``"IO"``。
            *args: 该函数的参数，与直接调用时相同。

        Returns:
            IGo 任务；``wait()`` 返回 ``(结果, ok)``。完成时 ``EventLoop()`` 收到 ``Event`` 为 ``"Exchange_函数名"`` 的事件。

        Example::

            a = exchange.Go("GetTicker", "BTC_USDT")
            b = exchange.Go("GetAccount")
            ticker, ok1 = a.wait()
            account, ok2 = b.wait()
        """
        ...

    # ---- Market ----

    def GetTicker(self, symbol: str = '') -> Optional[ITicker]:
        """获取行情。

        Args:
            symbol: 品种代码，例如 ``"BTC_USDT"``（现货）、``"BTC_USDT.swap"``（期货）。不传：当前交易对 / 合约。

        Returns:
            ``ITicker``，失败返回 ``None``。

        Example::

            ticker = exchange.GetTicker("BTC_USDT")
            if ticker:
                Log("BTC:", ticker.Last)
        """
        ...

    def GetTickers(self) -> Optional[list[ITicker]]:
        """获取交易所全部品种的行情（现货为所有交易对，期货为所有合约）。

        Returns:
            ``ITicker`` 列表；失败或交易所没有聚合行情接口时返回 ``None``。

        Example::

            tickers = exchange.GetTickers()
            if tickers:
                Log("品种数:", len(tickers))
        """
        ...

    def GetDepth(self, symbol: str = '') -> Optional[IDepth]:
        """获取订单簿。卖单价格从低到高，买单从高到低。

        Args:
            symbol: 品种代码；不传：当前交易对 / 合约。

        Returns:
            ``IDepth``，失败返回 ``None``。

        Example::

            depth = exchange.GetDepth()
            if depth:
                Log("卖一:", depth.Asks[0].Price, "买一:", depth.Bids[0].Price)
        """
        ...

    def GetTrades(self, symbol: str = '') -> Optional[list[ITrade]]:
        """获取最近的市场成交记录（按时间升序）。

        Args:
            symbol: 品种代码；不传：当前交易对 / 合约。

        Returns:
            ``ITrade`` 列表，失败返回 ``None``。
        """
        ...

    def GetRecords(self, symbol: Union[str, int] = '', period: int = -1, limit: int = 0) -> Optional[IRecordList]:
        """获取K线（按时间升序）。

        调用形式：``GetRecords()``、``GetRecords(symbol)``、``GetRecords(symbol, period)``、
        ``GetRecords(symbol, period, limit)``、``GetRecords(period)``、``GetRecords(period, limit)``。

        Args:
            symbol: 品种代码；不传：当前交易对 / 合约。这一位传整数时表示周期。
            period: K线周期（秒），例如 ``PERIOD_M1``、``PERIOD_H1``；不传：实盘的默认周期。
            limit: K线根数；不传：``SetMaxBarLen()`` 设置的长度（默认200）。

        Returns:
            ``IRecordList``，失败返回 ``None``。

        Example::

            records = exchange.GetRecords(PERIOD_H1)
            records = exchange.GetRecords("ETH_USDT", PERIOD_M5, 100)
            if records:
                dif, dea, hist = TA.MACD(records)
        """
        ...

    def GetMarkets(self) -> Optional[dict[str, IMarket]]:
        """获取交易所各品种的市场信息。

        Returns:
            以品种代码为键的字典（例如 ``"BTC_USDT"``、``"BTC_USDT.swap"``）；失败或不支持时返回 ``None``。

        Example::

            markets = exchange.GetMarkets()
            if markets:
                m = markets.get("BTC_USDT")
                if m:
                    Log("最小下单量:", m.MinQty, "价格精度:", m.PricePrecision)
        """
        ...

    def GetRawJSON(self) -> str:
        """该交易所对象最近一次 REST 调用（包括 ``IO("api", ...)``）的原始应答；那次调用失败时为错误信息，
        还没有调用过时为 ``""``。

        Example::

            exchange.GetTicker()
            Log(exchange.GetRawJSON())
        """
        ...

    def SetData(self, key: str, value: Any) -> int:
        """加载数据集，供 ``exchange.GetData()`` 读取。

        Args:
            key: 数据集名称。
            value: ``[[时间戳, 数据], ...]``（或它的 JSON 字符串），或 ``{"schema": [...], "data": [...]}``。

        Returns:
            数据 JSON 编码后的长度；格式不正确时返回 ``0``（并设置 ``GetLastError()``）。

        Example::

            exchange.SetData("test", [[1579536000000, 123], [1579622400000, 456]])
        """
        ...

    def GetData(self, key: str, timeout: int = 60000, offset: int = 0) -> IData:
        """读取 ``exchange.SetData()`` 加载的数据集，或 http(s) 链接提供的数据。

        链接须返回 ``[[时间, 数据], ...]`` 或 ``{"schema": [...], "data": [...]}``；按 ``timeout`` 毫秒缓存，
        过期后重新拉取。``SetData()`` 加载的数据不会过期。

        Args:
            key: 数据集名称或 http(s) 链接。
            timeout: 缓存超时，毫秒（不传为60000，最小5000）。
            offset: 毫秒时间戳：取 ``time <= offset`` 的最后一行；不传：当前时间（只取已经"到达"的行）。

        Returns:
            总是返回 ``IData`` ``{Time, Data}``；没有数据或拉取失败时 ``Data`` 为 ``None``（原因见 ``GetLastError()``）。

        Example::

            d = exchange.GetData("https://www.example.com/data.json")
            if d.Data is None:
                Log("没有数据:", GetLastError())
        """
        ...

    # ---- Account ----

    def GetAccount(self) -> Optional[IAccount]:
        """获取当前交易对 / 合约的账户资产。

        Returns:
            ``IAccount``，失败返回 ``None``。

        Example::

            account = exchange.GetAccount()
            if account:
                Log("Balance:", account.Balance, "Stocks:", account.Stocks)
        """
        ...

    def GetAssets(self) -> Optional[list[IAsset]]:
        """获取账户的全部资产。

        Returns:
            ``IAsset`` 列表，失败返回 ``None``。

        Example::

            assets = exchange.GetAssets()
            if assets:
                for a in assets:
                    Log(a.Currency, a.Amount, a.FrozenAmount)
        """
        ...

    # ---- Trading ----

    def Buy(self, price: float, amount: float = ..., *args: Any) -> Optional[IOrderId]:
        """在当前交易对 / 合约上下买单（期货的方向由 ``SetDirection()`` 设置）。

        Args:
            price: 价格；``-1`` 为市价单。只传一个参数 ``Buy(amount)`` 也是市价单。
            amount: 数量（现货市价买单通常为计价币金额；期货为合约张数）。
            *args: 输出到下单日志的附加内容；最后一个字典参数不输出，作为下单选项（例如 ``{"type": "post_only"}``）。

        Returns:
            订单Id，失败返回 ``None``。

        Example::

            oid = exchange.Buy(50000, 0.01, "限价买入")
            oid = exchange.Buy(-1, 100)  # 市价买入 100 USDT
        """
        ...

    def Sell(self, price: float, amount: float = ..., *args: Any) -> Optional[IOrderId]:
        """在当前交易对 / 合约上下卖单（期货的方向由 ``SetDirection()`` 设置）。

        Args:
            price: 价格；``-1`` 为市价单。只传一个参数 ``Sell(amount)`` 也是市价单。
            amount: 数量。
            *args: 输出到下单日志的附加内容；最后一个字典参数作为下单选项。

        Returns:
            订单Id，失败返回 ``None``。

        Example::

            oid = exchange.Sell(51000, 0.01)
            oid = exchange.Sell(-1, 0.01)  # 市价卖出
        """
        ...

    def CreateOrder(self, symbol: str, side: str, price: float, amount: float, *args: Any) -> Optional[IOrderId]:
        """在任意品种上按指定方向下单（不需要 ``SetCurrency()`` / ``SetDirection()``）。

        Args:
            symbol: 品种代码，例如 ``"BTC_USDT"`` 或 ``"BTC_USDT.swap"``；``""`` 为当前品种。
            side: 现货 ``"buy"`` / ``"sell"``；期货 ``"buy"``（开多）、``"sell"``（开空）、``"closebuy"``（平多）、
                ``"closesell"``（平空）。
            price: 价格；``-1`` 为市价单。
            amount: 数量（现货市价买单通常为计价币金额；期货为合约张数）。
            *args: 输出到下单日志的附加内容；最后一个字典参数作为下单选项（``type``、``tif``、``postOnly``、
                ``reduceOnly``、``clientId`` 等）。

        Returns:
            订单Id，失败返回 ``None``。

        Example::

            exchange.CreateOrder("ETH_USDT", "buy", -1, 100)
            exchange.CreateOrder("BTC_USDT.swap", "buy", 50000, 1)
            exchange.CreateOrder("BTC_USDT.swap", "closebuy", -1, 1)
        """
        ...

    def ModifyOrder(self, orderId: Optional[IOrderId], side: str, price: float, amount: float, *args: Any) -> Optional[IOrderId]:
        """修改未完成订单的价格和/或数量。

        Args:
            orderId: 要修改的订单Id。
            side: 方向，同 ``CreateOrder()``。
            price: 新价格；``<= 0``（例如 ``-1``）表示不改价格。
            amount: 新数量；``<= 0`` 表示不改数量（价格和数量不能都不改）。
            *args: 交易所特定参数的字典。

        Returns:
            （可能是新的）订单Id，失败返回 ``None``。
        """
        ...

    def CancelOrder(self, orderId: Optional[IOrderId], *args: Any) -> Optional[bool]:
        """撤销订单。

        Args:
            orderId: 订单Id。
            *args: 输出到撤单日志的附加内容。

        Returns:
            请求发送成功返回 ``True``；订单无法撤销（已成交 / 已终结，原因见 ``GetLastError()``）返回 ``False``；
            请求失败返回 ``None``。撤单结果用 ``GetOrder()`` 确认。

        Example::

            oid = exchange.Buy(50000, 0.01)
            if oid:
                exchange.CancelOrder(oid, "撤销测试订单")
        """
        ...

    def GetOrder(self, orderId: Optional[IOrderId]) -> Optional[IOrder]:
        """按订单Id查询订单。

        Returns:
            ``IOrder``，失败返回 ``None``。

        Example::

            order = exchange.GetOrder(order_id)
            if order:
                Log("状态:", order.Status, "成交:", order.DealAmount)
        """
        ...

    def GetOrders(self, symbol: str = '') -> Optional[list[IOrder]]:
        """获取未完成订单。

        Args:
            symbol: 品种代码（``"BTC_USDT.swap"``）或品种范围（``"USDT.swap"``）。不传或 ``""``：现货查询全部品种；
                期货查询当前计价币与合约类型的范围（例如 ``"USDT.swap"``）。

        Returns:
            ``IOrder`` 列表（``[]`` 表示没有），失败返回 ``None``。

        Example::

            orders = exchange.GetOrders()
            if orders is not None:
                Log("挂单数:", len(orders))
        """
        ...

    def GetHistoryOrders(self, symbol: Union[str, int] = '', since: int = 0, limit: int = 0) -> Optional[list[IOrder]]:
        """获取已完成（成交 / 撤销）的订单。

        调用形式：``()``、``(symbol)``、``(symbol, since)``、``(symbol, since, limit)``、``(since)``、``(since, limit)``。

        Args:
            symbol: 品种代码；不传：当前品种。
            since: 起始时间（毫秒时间戳）。
            limit: 最多返回的订单数。

        Returns:
            ``IOrder`` 列表，失败返回 ``None``。
        """
        ...

    def CreateConditionOrder(self, symbol: str, side: str, amount: float, condition: dict[str, Any], *args: Any) -> Optional[IOrderId]:
        """创建条件单（止盈 / 止损 / OCO）。

        Args:
            symbol: 品种代码；``""`` 为当前品种。
            side: ``"buy"``、``"sell"``、``"closebuy"``、``"closesell"``。
            amount: 数量（期货为合约张数）。
            condition: ``IOrderCondition`` 字典。
            *args: 输出到日志的附加内容；字典参数原样传给交易所。

        Returns:
            条件单Id，失败返回 ``None``。

        Example::

            exchange.CreateConditionOrder("BTC_USDT.swap", "closebuy", 1, {
                "ConditionType": ORDER_CONDITION_TYPE_TP,
                "TpTriggerPrice": 55000,
                "TpOrderPrice": -1
            })
        """
        ...

    def ModifyConditionOrder(self, orderId: Optional[IOrderId], side: str, amount: float, condition: dict[str, Any], *args: Any) -> Optional[IOrderId]:
        """修改条件单。

        Args:
            orderId: 条件单Id。
            side: 方向。
            amount: 新数量（必须大于0）。
            condition: 新的 ``IOrderCondition`` 字典。
            *args: 交易所特定参数的字典。

        Returns:
            （可能是新的）条件单Id，失败返回 ``None``。
        """
        ...

    def CancelConditionOrder(self, orderId: Optional[IOrderId], *args: Any) -> bool:
        """撤销条件单。

        Returns:
            请求发送成功返回 ``True``，否则返回 ``False``。
        """
        ...

    def GetConditionOrder(self, orderId: Optional[IOrderId]) -> Optional[IOrder]:
        """按条件单Id查询条件单（条件在 ``Order.Condition`` 中）。

        Returns:
            ``IOrder``，失败返回 ``None``。
        """
        ...

    def GetConditionOrders(self, symbol: str = '') -> Optional[list[IOrder]]:
        """获取未触发的条件单。``symbol`` 的缺省范围同 ``GetOrders()``。

        Returns:
            ``IOrder`` 列表，失败返回 ``None``。
        """
        ...

    def GetHistoryConditionOrders(self, symbol: Union[str, int] = '', since: int = 0, limit: int = 0) -> Optional[list[IOrder]]:
        """获取已完成的条件单。调用形式同 ``GetHistoryOrders()``。

        Returns:
            ``IOrder`` 列表，失败返回 ``None``。
        """
        ...

    def Log(self, orderType: int, price: Union[float, IOrderId], amount: float = 0, *args: Any) -> Optional[Union[str, bool]]:
        """输出一条交易日志，不实际下单。

        Args:
            orderType: ``LOG_TYPE_BUY``、``LOG_TYPE_SELL`` 或 ``LOG_TYPE_CANCEL``。
            price: 日志中显示的价格（``LOG_TYPE_CANCEL`` 时为订单Id）。
            amount: 日志中显示的数量。
            *args: 追加到日志的附加内容。

        Returns:
            买卖：虚拟订单号（``"V"`` 加数字）；撤单：``True``。

        Example::

            exchange.Log(LOG_TYPE_BUY, 50000, 0.1, "信号")
            exchange.Log(LOG_TYPE_CANCEL, "123")
        """
        ...

    # ---- Futures ----

    def GetPositions(self, symbol: str = '') -> Optional[list[IPosition]]:
        """获取期货持仓。

        Args:
            symbol: 品种代码（``"BTC_USDT.swap"``）或品种范围（``"USDT.swap"``）。不传或 ``""``：当前计价币与合约类型的范围
                （例如 ``"USDT.swap"``）。

        Returns:
            ``IPosition`` 列表（``[]`` 表示没有持仓），失败返回 ``None``。

        Example::

            positions = exchange.GetPositions("BTC_USDT.swap")
            if positions:
                Log("数量:", positions[0].Amount, "类型:", positions[0].Type)
        """
        ...

    def GetPosition(self, symbol: str = '') -> Optional[list[IPosition]]:
        """旧名称，同 ``GetPositions()``。"""
        ...

    def SetContractType(self, symbol: str, *args: Any) -> Optional[dict[str, Any]]:
        """设置当前合约（期货）。现货交易所对象不支持。

        Args:
            symbol: 合约代码，例如 ``"swap"``（永续）、``"quarter"``、``"next_quarter"``、``"this_week"``、``"next_week"``、
                交易所原生合约代码，或 ``"BTC_USDT.swap"``（同时切换交易对与合约）。

        Returns:
            交易所合约，例如 ``{"InstrumentID": "BTCUSD_230630", "instrument": "BTCUSD_230630"}``；
            失败返回 ``None``（当前合约不变）。

        Example::

            exchange.SetContractType("swap")
            exchange.SetContractType("quarter")
        """
        ...

    def GetContractType(self) -> str:
        """当前合约代码，例如 ``"swap"``、``"quarter"``（现货为 ``""``）。"""
        ...

    def SetMarginLevel(self, symbol: Union[str, float], marginLevel: float = ...) -> Any:
        """设置杠杆（期货）。

        调用形式：``SetMarginLevel(marginLevel)``（当前合约）与 ``SetMarginLevel(symbol, marginLevel)``。

        Example::

            exchange.SetMarginLevel(10)
            exchange.SetMarginLevel("BTC_USDT.swap", 20)
        """
        ...

    def SetDirection(self, direction: str, hedgeFlag: str = ...) -> None:
        """设置下一次 ``Buy()`` / ``Sell()`` 的方向（期货）。推荐使用直接指定方向的 ``CreateOrder()``。

        Args:
            direction: ``"buy"``（开多，配合 ``Buy``）、``"sell"``（开空，配合 ``Sell``）、
                ``"closebuy"``（平多，配合 ``Sell``）、``"closesell"``（平空，配合 ``Buy``）。
                国内期货柜台还支持 ``"closebuy_today"`` / ``"closesell_today"``。
            hedgeFlag: 国内期货柜台：投机 / 套利 / 套保标志。

        Example::

            exchange.SetDirection("buy")
            exchange.Buy(50000, 1)
            exchange.SetDirection("closebuy")
            exchange.Sell(51000, 1)
        """
        ...

    def GetFundings(self, symbol: str = '') -> Optional[list[IFunding]]:
        """获取资金费率（永续合约）。

        Args:
            symbol: 品种代码（``"BTC_USDT.swap"``）或品种范围（``"USDT.swap"``）；不传：当前计价币与合约类型的范围。

        Returns:
            ``IFunding`` 列表，失败返回 ``None``。
        """
        ...

    # ---- Exchange settings ----

    def GetName(self) -> str:
        """交易所名称，例如 ``"Binance"``、``"Futures_OKX"``。"""
        ...

    def GetLabel(self) -> str:
        """配置该交易所对象时设置的标签。"""
        ...

    def SetLabel(self, label: str) -> None:
        """修改该交易所对象的标签（只在本次运行中有效；空字符串不生效）。"""
        ...

    def GetIndex(self) -> int:
        """该交易所对象在 ``exchanges`` 中的下标（``exchange`` 为0）；与 ``ctx.poll()`` 事件的 ``ev.ex`` 是同一个下标。"""
        ...

    def GetCurrency(self) -> str:
        """当前交易对，例如 ``"BTC_USDT"``（不含合约部分）。"""
        ...

    def SetCurrency(self, currency: str) -> bool:
        """切换交易对（``"ETH_USDT"``；``"ETH_USDT.swap"`` 同时设置合约）。

        Returns:
            ``True``。交易对不合法时记录错误日志，交易对不变。

        Example::

            exchange.SetCurrency("ETH_USDT")
            Log(exchange.GetTicker())
        """
        ...

    def GetBaseCurrency(self) -> str:
        """当前交易对的交易币，例如 ``"BTC"``。"""
        ...

    def GetQuoteCurrency(self) -> str:
        """当前交易对的计价币，例如 ``"USDT"``。"""
        ...

    def GetPeriod(self) -> int:
        """实盘的默认K线周期，单位秒。"""
        ...

    def SetMaxBarLen(self, n: int) -> None:
        """设置 ``GetRecords()`` 默认请求与保留的K线根数（默认200）。"""
        ...

    def SetPrecision(self, pricePrecision: Optional[int] = None, amountPrecision: Optional[int] = None) -> None:
        """设置价格 / 下单量的小数位数：下单的价格与数量按它截断（不四舍五入）。

        Example::

            exchange.SetPrecision(2, 3)
        """
        ...

    def SetRate(self, rate: float = 1) -> float:
        """设置汇率：之后返回的价格乘以它，下单价格除以它。

        Args:
            rate: 汇率；``1``、不传或 ``<= 0`` 表示不转换。

        Returns:
            设置之前的汇率。
        """
        ...

    def GetRate(self) -> float:
        """``SetRate()`` 设置的汇率（默认 ``1``）。"""
        ...

    def SetTimeout(self, timeout: int) -> int:
        """设置该对象 REST 请求的超时，单位毫秒。"""
        ...

    def SetProxy(self, proxy: str) -> Optional[bool]:
        """为该交易所对象的请求设置代理。

        Args:
            proxy: ``"socks5://[用户名:密码@]主机:端口"``、``"http://主机:端口"``；``""`` 取消代理。

        Returns:
            设置成功返回 ``True``，代理格式不正确返回 ``None``。
        """
        ...

    def SetBase(self, base: str) -> str:
        """切换 API 基地址（例如切换到测试网）。

        Returns:
            切换之前的基地址；交易所拒绝新地址时返回 ``""``。
        """
        ...

    def GetBase(self) -> str:
        """当前的 API 基地址。"""
        ...

    def IO(self, k: str, *args: Any) -> Any:
        """交易所特有的调用与设置。

        常用形式：

        - ``IO("api", httpMethod, resource, params="", raw="")``：调用交易所原始接口（仅实盘）。
        - ``IO("currency", "ETH_USDT")``：同 ``SetCurrency()``。
        - ``IO("base")`` / ``IO("base", url)``：查询 / 切换基地址。
        - ``IO("cross", True)``、``IO("dual", True)``、``IO("simulate", True)``：账户模式（见各交易所页面）。
        - ``IO("rate", "GetTicker", 10, "1s")``：本地限流。

        Returns:
            由指令决定；失败返回 ``None``（原因见 ``GetLastError()``）。

        Example::

            ret = exchange.IO("api", "GET", "/api/v5/account/balance")
        """
        ...

    def Encode(self, algo: str, inputFormat: str, outputFormat: str, data: str, keyFormat: str = ..., key: str = ...) -> str:
        """同全局 ``Encode()``，但 ``data`` / ``key`` 中可以写 ``"{{accesskey}}"`` / ``"{{secretkey}}"``，替换为该交易所
        对象配置的密钥（仅实盘）。

        Example::

            sign = exchange.Encode("sha256", "string", "hex", "data", "string", "{{secretkey}}")
        """
        ...

    def HMAC(self, algo: str, outputFormat: str, data: str, key: str = ...) -> str:
        """HMAC 签名：即 ``exchange.Encode(algo, "raw", outputFormat, data, "raw", key)``；``key`` 可以写 ``"{{secretkey}}"``。"""
        ...

    def GetMeta(self, key: str) -> str:
        """该交易所对象的非敏感配置字段（例如 ``"AccessKey"``），键名不区分大小写；不存在或为敏感字段时返回 ``""``
        （不会返回密钥）。"""
        ...

    def G(self, *args: Any) -> Any:
        """该交易所对象私有的内存键值存储（不持久化，与 ``_G`` 无关）。

        ``G()`` 返回下标，``G(None)`` 清空，``G(k)`` 读取，``G(k, None)`` 删除，``G(k, v)`` 写入。
        """
        ...

    def GetUSDCNY(self) -> Optional[float]:
        """旧接口：美元兑人民币汇率。当前运行环境不提供：返回 ``None``（汇率请用 ``HttpQuery()`` 获取）。"""
        ...

# ==================== TA Input Type ====================

t_TAInput = Union[Sequence[float], Sequence[IRecord]]
"""``TA`` 函数的输入：K线列表（使用 ``Close``）或数值列表。"""

# ==================== Built-in TA Indicator Library ====================

class ITA:
    """平台内置的指标库（全局变量 ``TA``），在本地计算。

    结果是与输入等长的列表，指标预热部分为 ``None``。

    Example::

        records = exchange.GetRecords()
        k, d, j = TA.KDJ(records, 9, 3, 3)
        up, mid, down = TA.BOLL(records, 20, 2)
    """
    def MA(self, inReal: t_TAInput, optInTimePeriod: int = 9) -> list[float]:
        """移动平均线（简单）。``optInTimePeriod`` 默认9。"""
        ...

    def SMA(self, inReal: t_TAInput, optInTimePeriod: int = 9) -> list[float]:
        """简单移动平均线。``optInTimePeriod`` 默认9。"""
        ...

    def EMA(self, inReal: t_TAInput, optInTimePeriod: int = 9) -> list[float]:
        """指数移动平均线。``optInTimePeriod`` 默认9。"""
        ...

    def MACD(self, inReal: t_TAInput, optInFastPeriod: int = 12, optInSlowPeriod: int = 26, optInSignalPeriod: int = 9) -> tuple[list[float], list[float], list[float]]:
        """MACD（默认 12、26、9）。

        Returns:
            ``[DIF, DEA, MACD柱]``。

        Example::

            dif, dea, hist = TA.MACD(records)
        """
        ...

    def BOLL(self, inReal: t_TAInput, period: int = 20, multiplier: float = 2) -> tuple[list[float], list[float], list[float]]:
        """布林带（默认 20、2）。

        Returns:
            ``[上轨, 中轨, 下轨]``。
        """
        ...

    def KDJ(self, inPriceHLC: Sequence[IRecord], period: int = 9, kPeriod: int = 3, dPeriod: int = 3) -> tuple[list[float], list[float], list[float]]:
        """KDJ 随机指标（默认 9、3、3）；只接受K线。

        Returns:
            ``[K, D, J]``。
        """
        ...

    def RSI(self, inReal: t_TAInput, optInTimePeriod: int = 14) -> list[float]:
        """相对强弱指标（默认14）。

        Example::

            rsi = TA.RSI(records, 14)
            if rsi[-1] > 70:
                Log("超买")
        """
        ...

    def ATR(self, inPriceHLC: Sequence[IRecord], optInTimePeriod: int = 14) -> list[float]:
        """平均真实波幅（默认14）；只接受K线。"""
        ...

    def OBV(self, inReal: Sequence[IRecord]) -> list[float]:
        """能量潮；只接受K线（使用收盘价与成交量）。"""
        ...

    def Highest(self, inReal: t_TAInput, period: int, attr: Optional[str] = None) -> float:
        """最近 ``period`` 根K线的最大值，不含当前K线（``period`` 为0表示全部K线）。

        Args:
            inReal: K线或数值列表。
            period: K线根数。
            attr: K线的字段：``"High"``、``"Low"``、``"Open"``、``"Close"``、``"Volume"``、``"OpenInterest"``。

        Example::

            hh = TA.Highest(records, 20, "High")
        """
        ...

    def Lowest(self, inReal: t_TAInput, period: int, attr: Optional[str] = None) -> float:
        """最近 ``period`` 根K线的最小值，不含当前K线（``period`` 为0表示全部K线）。

        Example::

            ll = TA.Lowest(records, 20, "Low")
        """
        ...

    def Alligator(self, inPriceHL: Sequence[IRecord], jawLength: int = 13, teethLength: int = 8, lipsLength: int = 5) -> tuple[list[float], list[float], list[float]]:
        """鳄鱼线（默认 13、8、5），按最高价与最低价的中值计算；只接受K线。

        Returns:
            ``[下颚, 牙齿, 上唇]``，分别向右平移8、5、3根K线。
        """
        ...

    def CMF(self, inReal: Sequence[IRecord], periods: int = 20) -> list[float]:
        """蔡金资金流量（默认20）；只接受K线。"""
        ...

# ==================== Database / Network ====================

class IDBExecRet(dict[str, Any]):
    """``DBExec()`` 与 ``IDial.exec()`` 的结果。"""
    columns: list[str]
    """列名。"""
    values: list[list[Any]]
    """数据行，每行是与 ``columns`` 对应的列表。"""

class IDial:
    """``Dial()`` 返回的连接：TCP / TLS / WebSocket 数据流或数据库连接。

    Example::

        ws = Dial("wss://stream.binance.com:9443/ws/btcusdt@ticker")
        if ws:
            msg = ws.read(5000)
            ws.close()

        db = Dial("sqlite3://test.db")
        db.exec("CREATE TABLE IF NOT EXISTS kv(k TEXT PRIMARY KEY, v TEXT)")
        db.exec("INSERT INTO kv VALUES(?, ?)", "key1", "value1")
    """
    def read(self, timeout: int = 0) -> Optional[str]:
        """读取一条数据。

        Args:
            timeout: 毫秒。不传 / 0：阻塞到有数据；正数：最多等这么久。只对 WebSocket 有效：``-1`` 立即返回
                （没有缓存数据时返回 ``None``），``-2`` 立即返回，只取缓存中最新的一条。

        Returns:
            读到的数据；超时或连接已关闭时返回 ``None``。
        """
        ...

    def write(self, data: str, timeout: int = 0) -> int:
        """发送数据。返回发送的字节数；连接已断开时返回 ``0``。"""
        ...

    def exec(self, sql: str, *args: Any) -> Optional[IDBExecRet]:
        """仅数据库连接：执行 SQL（``?`` 占位符依次取 ``args``），结果同 ``DBExec()``。"""
        ...

    def close(self) -> None:
        """关闭连接（对象被回收时也会关闭）。"""
        ...

class IEventMsg(dict[str, Any]):
    """``EventLoop()`` 返回的事件。

    ``Event`` 例如 ``"tick"`` / ``"order"``（纯推送的期货柜台）、``"Exchange_GetTicker"``（``exchange.Go()`` 的任务
    完成，``Index`` 为其票据号）、``"HttpQuery"``（``HttpQuery_Go()`` 完成）。
    """
    Seq: int
    """事件序号。"""
    Event: str
    """事件名称。"""
    ThreadId: int
    """线程Id（0）。"""
    Index: int
    """tick / order 事件为交易所下标；完成事件为任务票据号。"""
    Queue: int
    """取出这条事件之后队列中还剩的事件数。"""
    Dropped: int
    """到目前为止因为队列已满被丢弃的事件数。"""
    Nano: int
    """纳秒时间戳。"""
    Symbol: str
    """tick 事件的品种。"""
    Ticker: ITicker
    """tick 事件：行情。"""
    Order: IOrder
    """order 事件：订单。"""

class IChart:
    """``Chart()`` 返回的图表对象。

    Example::

        chart = Chart({"title": {"text": "价格"}, "xAxis": {"type": "datetime"},
                       "series": [{"name": "Last", "data": []}]})
        chart.add(0, [Unix() * 1000, ticker.Last])
    """
    def add(self, series: Union[int, list[Any]], data: Any = ..., index: int = ...) -> None:
        """写入数据：``add(数据系列索引, [x, y])`` 追加一个点；``add(数据系列索引, [x, y], -1)`` 替换最后一个点
        （其它索引替换对应的点）。"""
        ...

    def update(self, options: Union[dict[str, Any], list[dict[str, Any]]]) -> None:
        """替换图表配置（参数与 ``Chart()`` 相同）。"""
        ...

    def reset(self, remain: int = 0) -> None:
        """清空数据，保留最后 ``remain`` 个点（0 为全部清空）。"""
        ...

    def dell(self, seriesIdx: int = 0) -> None:
        """删除一个数据系列；``<= 0`` 时删除整张图表（包括配置）。（JavaScript 中为 ``del``。）"""
        ...

class IKLineChart:
    """``KLineChart()`` 返回的 Pine 风格K线图。

    每根K线：``begin(bar)``，画图函数，然后 ``close()``。

    Example::

        c = KLineChart({"overlay": True})
        for bar in exchange.GetRecords():
            c.begin(bar)
            c.plot(bar.Close, "Close")
            c.close()
    """
    def begin(self, bar: IRecord) -> None:
        """开始在一根K线上画图。"""
        ...

    def close(self, bar: Optional[IRecord] = None) -> None:
        """结束这根K线的画图并输出（传 ``bar`` 等同先调用 ``begin(bar)``）。同一时间的K线再次 close 会替换它。"""
        ...

    def reset(self, remain: int = 0) -> None:
        """清空图表，保留最后 ``remain`` 根K线。"""
        ...

    def plot(self, series: Optional[float] = None, title: Optional[str] = None, color: Optional[str] = None, linewidth: int = 1, style: str = "line",
             trackprice: Optional[bool] = None, histbase: float = 0, offset: int = 0, join: bool = False, editable: bool = False,
             show_last: Optional[int] = None, display: str = "all", overlay: Optional[bool] = None) -> int:
        """画一条线，返回线的编号（供 ``fill()`` 使用）。``style``：``"line"``、``"stepline"``、``"histogram"``、
        ``"cross"``、``"area"``、``"columns"``、``"circles"`` 等。"""
        ...

    def hline(self, price: float, title: Optional[str] = None, color: Optional[str] = None, linestyle: str = "dashed", linewidth: Optional[int] = None,
              editable: bool = False, display: str = "all", overlay: Optional[bool] = None) -> int:
        """画水平线，返回线的编号。``linestyle``：``"dashed"``、``"dotted"``、``"solid"``。"""
        ...

    def plotarrow(self, series: Optional[float], title: Optional[str] = None, colorup: str = "#00ff00", colordown: str = "#ff0000", offset: int = 0,
                  minheight: int = 5, maxheight: int = 100, editable: bool = False, show_last: Optional[int] = None,
                  display: str = "all", overlay: Optional[bool] = None) -> None:
        """画向上（正数）/ 向下（负数）的箭头。"""
        ...

    def plotshape(self, series: Any, title: Optional[str] = None, style: Optional[str] = None, location: str = "abovebar", color: Optional[str] = None,
                  offset: Optional[int] = None, text: Optional[str] = None, textcolor: Optional[str] = None, editable: Optional[bool] = None,
                  size: str = "auto", show_last: Optional[int] = None, display: str = "all", overlay: Optional[bool] = None) -> None:
        """在 ``series`` 为真值处画形状。``style``：``"diamond"``、``"square"``、``"label_down"``、``"label_up"``、
        ``"arrow_down"``、``"arrow_up"``、``"circle"``、``"flag"``、``"triangle_down"``、``"triangle_up"``、``"cross"``、
        ``"xcross"``；``location``：``"abovebar"``、``"belowbar"``、``"top"``、``"bottom"``、``"absolute"``。"""
        ...

    def plotchar(self, series: Any, title: Optional[str] = None, char: Optional[str] = None, location: str = "abovebar", color: Optional[str] = None,
                 offset: Optional[int] = None, text: Optional[str] = None, textcolor: Optional[str] = None, editable: Optional[bool] = None,
                 size: str = "auto", show_last: Optional[int] = None, display: str = "all", overlay: Optional[bool] = None) -> None:
        """在 ``series`` 为真值处画一个字符（必须传 ``char``）。"""
        ...

    def plotcandle(self, open: float, high: float, low: float, close: float, title: Optional[str] = None, color: Optional[str] = None,
                   wickcolor: Optional[str] = None, editable: Optional[bool] = None, show_last: Optional[int] = None,
                   bordercolor: Optional[str] = None, display: str = "all", overlay: Optional[bool] = None) -> None:
        """另画一根K线。"""
        ...

    def barcolor(self, color: str, offset: Optional[int] = None, editable: bool = False, show_last: Optional[int] = None,
                 title: Optional[str] = None, display: str = "all") -> None:
        """设置当前K线的颜色。"""
        ...

    def bgcolor(self, color: str, offset: Optional[int] = None, editable: Optional[bool] = None, show_last: Optional[int] = None,
                title: Optional[str] = None, display: str = "all", overlay: Optional[bool] = None) -> None:
        """设置当前K线的背景色。"""
        ...

    def fill(self, plot1: int, plot2: int, color: Optional[str] = None, title: Optional[str] = None, editable: Optional[bool] = None,
             show_last: Optional[int] = None, fillgaps: Optional[bool] = None, display: str = "all") -> None:
        """填充两条线（``plot()`` / ``hline()`` 返回的编号）之间的区域。"""
        ...

    def signal(self, direction: str, price: float, qty: float, id: Optional[str] = None) -> None:
        """画交易信号。``direction``：``"buy"``/``"long"``、``"sell"``/``"short"``、``"closebuy"``/``"closelong"``、
        ``"closesell"``/``"closeshort"``；``id`` 缺省为 ``direction``。"""
        ...

class IHttpOptions(TypedDict, total=False):
    """``HttpQuery()`` 的请求设置（所有字段都可选）。"""
    method: str
    """``"GET"``（默认）、``"POST"``、``"PUT"``、``"DELETE"`` 等。"""
    body: str
    """请求体。"""
    data: str
    """没有设置 ``body`` 时作为请求体。"""
    headers: dict[str, Any]
    """请求头。"""
    cookie: str
    """Cookie 字符串。"""
    timeout: int
    """超时，单位毫秒（默认300000）。"""
    proxy: str
    """本次请求使用的代理：``http://``、``https://``、``socks5://``、``socks5h://``。"""
    charset: str
    """把应答体从该字符集（例如 ``"GBK"``）解码为 UTF-8。"""
    debug: bool
    """``True``：返回完整的 ``IHttpRet``，而不是应答体。"""

class _HttpDebugOptions(IHttpOptions):
    debug: Literal[True]

class IHttpRet(dict[str, Any]):
    """``HttpQuery()`` 的完整应答（选项 ``debug: True``）。"""
    StatusCode: int
    """HTTP 状态码；没有收到应答（拒绝连接、DNS解析失败、超时、代理失败）时为0。"""
    Header: dict[str, list[str]]
    """应答头；每个值是字符串列表。"""
    Cookies: list[dict[str, Any]]
    """解析后的 ``Set-Cookie``（``Name``、``Value``、``Path``、``Domain``、``Expires`` 等）。"""
    Trace: dict[str, Any]
    """各阶段耗时（``elapsed_ms``、``dns_ms``、``connect_ms``、``tls_ms``、``ttfb_ms`` 等）。"""
    Length: int
    """应答体长度（字符集解码之前）。"""
    Body: str
    """应答体；请求失败时为 ``""``。"""
    Error: str
    """失败原因（请求方法 + URL + 底层错误）；只在 ``StatusCode`` 为0时出现。"""

# ==================== WebSocket push (ctx) ====================

class StopError(RuntimeError):
    """实盘停止后 ``Sleep()``、``EventLoop()``、``ctx.poll()`` 与 API 调用抛出它；让它继续向上抛出，``onexit()`` 才会执行。"""
    message: str

class CtxRecord(dict[str, Any]):
    """推送接口返回的字典（订单簿、持仓 / 余额行、交易所列表行），可以按属性访问：``row.qty`` 与 ``row["qty"]``
    两种写法都可以。"""
    def __getattr__(self, name: str) -> Any: ...

class Subscription:
    """``ctx.subscribe()`` 返回的推送订阅（只读的订阅身份加方法）。

    订阅属于调用 ``ctx.subscribe()`` 的线程：事件只投给这个线程，也只有这个线程能 ``unsubscribe()``。
    把它（或它的 ``id``）传给 ``ctx.poll()`` 只取这一路的事件。
    """
    id: int
    """事件流Id（这一路事件的 ``ev.stream``）。"""
    ex: int
    """账户下标（``exchanges[ex]``）。"""
    channel: str
    """``"ticker"``、``"bbo"``、``"depth"``、``"trade"``、``"kline"``、``"tickers"`` 或 ``"private"``。"""
    symbol: str
    """品种代码（``private`` / ``tickers`` 为空）。"""
    depth: int
    """深度订阅的档数（0 为交易所默认档数）。"""
    interval: int
    """K线周期，单位秒。"""

    def info(self) -> dict[str, Any]:
        """订阅身份的字典：``{id, ex, channel, symbol, depth, interval}``。"""
        ...

    def book(self, n: Optional[int] = None) -> CtxRecord:
        """深度订阅：这一路自己的订单簿 ``{"bids": [[价格, 数量], ...], "asks": [...]}``（bids 从高到低，asks 从低到高；
        ``n`` 档，缺省为订阅的档数）。不是深度订阅或已退订时抛出异常。"""
        ...

    def positions(self) -> Optional[list[CtxRecord]]:
        """``private`` 订阅：最新持仓（行 ``{symbol, side, posSide, qty, avgPx, profit?, margin?, liqPx?, markPx?, leverage?, time}``）；
        账户快照就绪（READY）之前为 ``None``（状态未知，不是"没有持仓"）。"""
        ...

    def balances(self) -> Optional[list[CtxRecord]]:
        """``private`` 订阅：最新余额（行 ``{asset, free, frozen, equity?, upnl?, margin?, time}``）；账户快照就绪之前为 ``None``。"""
        ...

    def unsubscribe(self) -> None:
        """退订（同一个对象再次调用不做任何事）。只有订阅它的线程能退订。"""
        ...

class SubscriptionList(list[Subscription]):
    """批量 ``ctx.subscribe()``（``symbol`` 为列表）的结果：同序的订阅对象，可以整个传给 ``ctx.poll()``。"""

    def unsubscribe(self) -> None:
        """退订全部元素。"""
        ...

class CtxEvent(dict[str, Any]):
    """``ctx.poll()`` 返回的事件：字段与 JavaScript 事件相同的字典（``ev.kind`` 或 ``ev["kind"]``）。

    公共字段：``kind``（1 ticker/bbo/tickers，3 深度，4 成交，5 K线，16 订单回报，17 持仓，18 余额，32 定时器，
    33 网关状态，35 初始化状态）、``stream``、``type``（``"data"`` / ``"status"`` / ``"timer"``）、``channel``、``ex``、
    ``symbol``、``seq``、``ts``。各类事件：1 ``bid ask last bidQty askQty volume openInterest open high low time``；
    4 ``px qty side tradeId time``；5 ``open high low close volume openInterest intervalSec openTimeMs closed prefill``；
    16 ``id state px qty filledQty avgPx reason reasonText``；17 ``side posSide qty avgPx profit margin liqPx markPx
    leverage time snapshot``；18 ``asset free frozen equity upnl margin time snapshot``；32 ``timerId scheduledNs``；
    33 ``status detail``；35 ``channelCode intervalSec prefillStatus``（1 就绪，2 失败）``detail message``。
    深度事件（kind 3）不带档位：用 ``ev.book(n)`` 读取。
    """
    kind: int
    stream: int
    type: str
    channel: str
    ex: int
    symbol: str
    seq: int
    ts: float

    def book(self, n: Optional[int] = None) -> CtxRecord:
        """深度事件（kind 3）：所属订阅的订单簿，同 ``Subscription.book()``。"""
        ...

    def __getattr__(self, name: str) -> Any: ...

class _SubscribeOptions(TypedDict, total=False):
    channel: str
    depth: int
    interval: int
    mode: str
    buffer: int

class _SubscribeBatchOptions(_SubscribeOptions):
    symbol: Union[list[str], tuple[str, ...]]

class Ctx:
    """全局变量 ``ctx``：WebSocket 推送订阅（与 JavaScript 的 ``ctx`` 同语义；仅实盘）。

    Example::

        def main():
            depth = ctx.subscribe(exchange, {"channel": "depth", "depth": 20})
            acct = ctx.subscribe(exchange, {"channel": "private"})
            while True:
                ev = ctx.poll([], 1000)
                if ev is None:
                    continue
                if ev.type == "status":
                    if ev.kind == 35 and ev.prefillStatus == 2:
                        Log("订阅失败:", ev.channel, ev.message)
                    continue
                if ev.channel == "depth":
                    b = ev.book(5)
                elif ev.channel in ("positions", "balance"):
                    Log(acct.positions(), acct.balances())
    """
    STREAM_TIMER: int
    """引擎定时器的内置事件流（kind 32）。值为1。"""
    STREAM_STATUS: int
    """网关状态事件的内置事件流（kind 33）。值为2。"""

    @overload
    def subscribe(self, ex: Union[IExchange, int, str], opts: _SubscribeBatchOptions) -> SubscriptionList: ...
    @overload
    def subscribe(self, ex: Union[IExchange, int, str], opts: dict[str, Any]) -> Subscription:
        """订阅推送：某个品种的行情、全市场 ticker 或账户私有流。

        只接受这两个位置参数。

        Args:
            ex: 交易所对象（``exchange``、``exchanges[1]``）或账户下标（整数或数字字符串）。
            opts: ``{channel, symbol, depth, interval, mode, buffer}``。``channel``：``"ticker"``（默认）、``"bbo"``、
                ``"depth"``、``"trade"``、``"kline"``、``"tickers"``（全市场，不传 symbol）或 ``"private"``（订单 +
                持仓 + 余额，不传 symbol）。``symbol``：行情频道必填，``ex`` 为交易所对象时可省略（取它当前的交易对）；
                传列表为批量订阅。``depth``：档数；``interval``：K线秒数；``mode: "latest"`` 或 ``buffer: N``。

        Returns:
            ``Subscription``；``symbol`` 为列表或元组时返回 ``SubscriptionList``（整批先校验）。参数不合法时抛出异常；
            交易所拒绝的订阅在它的事件流上收到一条 kind 35 失败事件。
        """
        ...

    def poll(self, streams: Optional[Union[Subscription, int, Sequence[Any]]] = None, timeout_ms: Optional[int] = None) -> Optional[CtxEvent]:
        """本线程订阅的下一条事件。

        Args:
            streams: ``None`` / ``[]`` = 本线程的全部订阅；否则为订阅对象、事件流Id、SubscriptionList 或它们的（嵌套）
                列表（也可以写 ``ctx.STREAM_TIMER`` / ``ctx.STREAM_STATUS``）。
            timeout_ms: ``None`` 一直等到有事件，``0`` 不等待，> 0 最多等待的毫秒数（非负整数）。

        Returns:
            事件，超时返回 ``None``。实盘停止后（包括 ``onexit()`` 执行期间）抛出 ``StopError``。
        """
        ...

    def connectors(self) -> list[CtxRecord]:
        """已加载的交易所：``[{ex, label, name, symbol, interval, orderIdScope, feed}, ...]``；``feed`` =
        ``{ticksDropped, backpressure, ringCapacity}`` 推送缓冲计数（增长快说明策略处理太慢）。"""
        ...

# ==================== Global Variables ====================

ext: Any
"""模板类库的导出：模板赋给 ``ext`` 的函数（``ext.foo = foo``）在策略中以 ``ext.foo()`` 调用。"""

TA: ITA
"""内置指标库（MA、EMA、MACD、BOLL、KDJ、RSI、ATR、OBV、Highest、Lowest、Alligator、CMF）。"""

exchanges: list[IExchange]
"""实盘的全部交易所对象，按配置顺序排列。"""

exchange: IExchange
"""第一个交易所对象，即 ``exchanges[0]``。"""

ctx: Ctx
"""WebSocket 推送：``ctx.subscribe()``、``ctx.poll()``、``ctx.connectors()``（仅实盘）。"""

# ==================== Global Functions ====================

def Version() -> str:
    """运行策略的托管者版本号，例如 ``"3.9.2"``。"""
    ...

def Sleep(millisecond: float) -> None:
    """暂停 ``millisecond`` 毫秒。实盘停止时抛出 ``StopError``。

    Example::

        while True:
            Log(exchange.GetTicker())
            Sleep(1000)
    """
    ...

def IsVirtual() -> bool:
    """回测中返回 ``True``，实盘返回 ``False``。"""
    ...

def Mail(smtpServer: str, smtpUsername: str, smtpPassword: str, mailTo: str, title: str, body: str) -> bool:
    """通过 SMTP 发送邮件。成功返回 ``True``，失败返回 ``False``（原因见 ``GetLastError()``）。

    Example::

        Mail("smtp.qq.com:465", "sender@qq.com", "授权码", "receiver@gmail.com", "提醒", "BTC 突破 50000")
    """
    ...

def SetErrorFilter(filters: str) -> None:
    """匹配这个正则表达式的错误日志不再记录。``""`` 清除过滤。

    Example::

        SetErrorFilter("502:|503:|tcp|character|unexpected|network|timeout")
    """
    ...

def GetPid() -> int:
    """实盘进程Id。"""
    ...

def GetLastError() -> str:
    """最近一次的错误信息，读取后清除；没有错误时为 ``""``。

    Example::

        if exchange.GetTicker() is None:
            Log("错误:", GetLastError())
    """
    ...

def GetCommand(timeout: int = -1) -> Optional[str]:
    """读取实盘页面发来的交互命令（``"控件名:数据"``）；没有命令时返回 ``None``。

    Args:
        timeout: 毫秒：``-1``（默认）不等待，``0`` 一直等到有命令，正数最多等这么久。

    Example::

        cmd = GetCommand()
        if cmd:
            name, _, data = cmd.partition(":")
    """
    ...

def GetChannelData(channelId: Union[str, int]) -> Any:
    """读取其它实盘用 ``SetChannelData()`` 发布的最新数据（参数为它的实盘Id），或通过 HTTP API 发送到平台的数据
    （32位 UUID）。首次调用（需要重试）或没有发布过数据时返回 ``None``。"""
    ...

def SetChannelData(data: Any) -> None:
    """发布本实盘的状态（任意可 JSON 序列化的值），供其它实盘用 ``GetChannelData()`` 读取。"""
    ...

def GetMeta() -> Optional[str]:
    """创建实盘时（通过 API）设置的 ``Meta`` 数据，没有时返回 ``None``。"""
    ...

def Dial(address: str, timeout: Union[int, dict[str, Any]] = 30) -> Optional[IDial]:
    """建立 TCP / TLS / WebSocket 连接或数据库连接（仅实盘）。

    Args:
        address: 例如 ``"wss://host/path"``、``"tcp://host:port"``、``"tls://host:443"``、``"sqlite3://test.db"``、
            ``"sqlite3://:memory:"``、``"mysql://user:pass@tcp(host:3306)/db?charset=utf8mb4&parseTime=true"``、
            ``"postgres://user=u password=p host=h port=5432 dbname=d sslmode=disable"``、
            ``"clickhouse://tcp://host:9000?username=u&password=p&database=d"``。功能参数写在 ``|`` 之后：
            ``"wss://...|compress=gzip_raw&mode=recv&reconnect=true&interval=10000&payload=..."``。
        timeout: 建立连接的超时：ws/wss 单位毫秒（小于100按秒计），tcp/tls 单位秒，0 为默认超时；不传为30。
            也可以传选项字典，例如 ``{"timeout": 10, "headers": {...}}``。

    Returns:
        ``IDial``，连接失败返回 ``None``（原因见 ``GetLastError()``）。

    Example::

        ws = Dial("wss://stream.binance.com:9443/ws/btcusdt@ticker")
        if ws:
            Log(ws.read(5000))
            ws.close()
    """
    ...

@overload
def HttpQuery(url: str, options: _HttpDebugOptions) -> IHttpRet: ...
@overload
def HttpQuery(url: str, postData: Union[str, IHttpOptions, dict[str, Any], None], cookies: Optional[str], headers: Optional[str], isReturnHeader: Literal[True]) -> IHttpRet: ...
@overload
def HttpQuery(url: str, postData: Union[str, IHttpOptions, dict[str, Any], None] = None, cookies: Optional[str] = None, headers: Optional[str] = None, isReturnHeader: bool = False) -> str:
    """发送 HTTP 请求。

    Args:
        url: 请求地址。可以带代理前缀：``"socks5://127.0.0.1:1080/https://api.example.com"``（显式的 ``proxy`` 选项优先）。
        postData: ``IHttpOptions`` 字典（``method``、``body``、``headers``、``cookie``、``timeout``、``proxy``、``charset``、
            ``debug`` 等），或非空字符串 = POST 请求体（旧写法）。
        cookies, headers, isReturnHeader: 旧的位置参数写法。

    Returns:
        应答体字符串（失败时为 ``""``；JSON 用 ``json.loads`` 解析）。设置 ``{"debug": True}``（或 ``isReturnHeader``）时
        返回完整的 ``IHttpRet``；失败时其 ``StatusCode`` 为0，``Error`` 为原因。

    Example::

        body = HttpQuery("https://www.okx.com/api/v5/public/time")
        ret = HttpQuery("https://api.example.com/data", {
            "method": "POST",
            "body": json.dumps({"key": "value"}),
            "headers": {"Content-Type": "application/json"},
            "debug": True
        })
        Log(ret.StatusCode, ret.Body)
    """
    ...

@overload
def HttpQuery_Go(url: str, options: _HttpDebugOptions) -> IHttpQueryGo[IHttpRet]: ...
@overload
def HttpQuery_Go(url: str, postData: Union[str, IHttpOptions, dict[str, Any], None] = None, cookies: Optional[str] = None, headers: Optional[str] = None) -> IHttpQueryGo[str]:
    """异步的 ``HttpQuery()``：立即返回；``wait(timeout)`` 得到与 ``HttpQuery()`` 相同的结果。
    完成时 ``EventLoop()`` 收到 ``Event`` 为 ``"HttpQuery"`` 的事件（``Index`` 为票据号）。

    Example::

        r1 = HttpQuery_Go("https://api.example.com/a")
        r2 = HttpQuery_Go("https://api.example.com/b")
        a = json.loads(r1.wait())
        b = json.loads(r2.wait())
    """
    ...

def Encode(algo: str, inputFormat: str, outputFormat: str, data: str, keyFormat: str = ..., key: str = ...) -> str:
    """编码、哈希、HMAC、加解密与签名。

    Args:
        algo: ``"raw"``；哈希 ``"md5"``、``"sha1"``、``"sha256"``、``"sha512"``、``"sha3.256"``、``"keccak256"``、
            ``"ripemd160"``、``"blake2b.256"`` 等（传 ``key`` 时为 HMAC）；``"sign"``、``"signTx"``；``"ed25519"``、
            ``"ed25519.seed"``；``"text.encoder.utf8"``、``"text.decoder.gbk"``；``"aes.encrypt"`` / ``"aes.decrypt"``
            （默认 ``.cbc``，可选 ``.cfb``、``.ecb``）；``"gzip.deflate"``、``"gzip.inflate"``、``"zlib.deflate"``、
            ``"zlib.inflate"``、``"raw.deflate"``、``"raw.inflate"``。
        inputFormat: ``data`` 的格式：``"raw"``、``"hex"``、``"base64"``、``"string"``（另支持 ``"base64.url"``、
            ``"base64.rawurl"``、``"latin1"``）。
        outputFormat: ``"raw"``、``"hex"``、``"base64"``、``"string"``（另支持 ``"base64.url"``、``"base64.rawurl"``）。
        data: 输入数据。
        keyFormat: ``key`` 的格式。
        key: 密钥（HMAC / 签名 / 加密）。

    Example::

        sign = Encode("sha256", "string", "hex", "message", "string", "secret")  # HMAC-SHA256
        h = Encode("md5", "raw", "hex", "hello")
    """
    ...

def MD5(data: str) -> str:
    """``data`` 的 MD5，32位小写十六进制。"""
    ...

def HMAC(algo: str, outputFormat: str, data: str, key: str) -> str:
    """旧接口：HMAC 签名，同 ``Encode(algo, "raw", outputFormat, data, "raw", key)``。"""
    ...

def Hash(algo: str, outputFormat: str, data: str) -> str:
    """旧接口：哈希，同 ``Encode(algo, "raw", outputFormat, data)``。"""
    ...

def StrDecode(s: str, charset: str) -> str:
    """旧接口：把 ``s``（每个字符的码点为一个字节）按 ``charset``（必填，例如 ``"gbk"``）解码为 UTF-8 字符串，
    同 ``Encode("text.decoder." + charset, "latin1", "string", s)``。"""
    ...

def UnixNano() -> int:
    """当前纳秒时间戳。"""
    ...

def Unix() -> int:
    """当前秒级时间戳。"""
    ...

def GetOS() -> str:
    """托管者的操作系统与架构，例如 ``"linux/amd64"``。"""
    ...

def SysInfo(attr: str = ...) -> Any:
    """托管者进程的系统信息：不传 ``attr`` 返回整个字典，否则返回其中一项（``"pid"``、``"os"``、``"arch"``、``"ncpu"`` 等）；
    未知的键返回 ``None``。"""
    ...

def UUID() -> str:
    """UUID：32位大写十六进制字符，不带连字符。"""
    ...

def DBExec(sql: str, *args: Any) -> Optional[IDBExecRet]:
    """在实盘自己的 SQLite 数据库（持久化）上执行 SQL。``?`` 占位符依次取 ``args``。

    Returns:
        ``{columns, values}``，失败返回 ``None``。

    Example::

        DBExec("CREATE TABLE IF NOT EXISTS trades(ts INTEGER, price REAL)")
        DBExec("INSERT INTO trades VALUES(?, ?)", Unix(), 50000)
        ret = DBExec("SELECT * FROM trades")
    """
    ...

def EventLoop(timeout: int = 0) -> Optional[IEventMsg]:
    """等待下一个事件：``exchange.Go()`` / ``HttpQuery_Go()`` 的完成通知，以及纯推送期货柜台的 tick / order 事件。
    （WebSocket 推送订阅用 ``ctx.poll()`` 读取。）

    Args:
        timeout: 毫秒：``0``（默认）一直等到有事件，正数最多等这么久，负数不等待。

    Returns:
        ``IEventMsg``，超时返回 ``None``。实盘停止时抛出 ``StopError``。

    Example::

        t = exchange.Go("GetTicker")
        ev = EventLoop(1000)
        if ev:
            Log(ev.Event, ev.Index)
    """
    ...

def JSONParse(s: str) -> Any:
    """解析 JSON；超出安全整数范围（2^53）的数字保留为字符串。"""
    ...

def Log(*args: Any) -> None:
    """输出一条日志（多个值以空格连接）。以 ``"#ff0000"`` 结尾设置颜色；以 ``"@"`` 结尾同时推送消息（邮箱、WebHook，
    仅实盘）；以 ``"&"`` 结尾为私密日志，实盘公开展示时对其他用户隐藏。matplotlib 图像显示为图片。

    Example::

        Log("价格:", ticker.Last, "数量:", 0.1)
        Log("提醒 #ff0000@")
    """
    ...

def LogProfit(profit: float, *args: Any) -> None:
    """记录收益（由策略计算）并画收益曲线；``args`` 附加到这条日志中。"""
    ...

def LogProfitReset(remain: int = ...) -> None:
    """清空收益日志，保留最后 ``remain`` 条。"""
    ...

def LogStatus(*args: Any) -> None:
    """设置日志上方的状态栏：文字、表格（``{"type": "table", "title", "cols", "rows"}``）、按钮、状态栏组件，或它们组成的
    列表；字典 / 列表以 JSON 发送。

    Example::

        table = {"type": "table", "title": "持仓", "cols": ["品种", "数量"], "rows": [["BTC", 1]]}
        LogStatus("`" + json.dumps(table) + "`")
    """
    ...

def LogReset(remain: int = ...) -> None:
    """清空日志，保留最后 ``remain`` 条。"""
    ...

def LogVacuum() -> None:
    """``LogReset()`` 之后回收数据库空间（SQLite VACUUM）。"""
    ...

def EnableLog(enable: bool) -> None:
    """``False`` 时不再记录订单日志（``Buy``/``Sell`` 等产生的日志）；错误日志总是记录。"""
    ...

def Chart(options: Union[dict[str, Any], list[dict[str, Any]]]) -> IChart:
    """创建图表（Highcharts / Highstocks 配置；列表为多张图表）。

    一般画图优先使用 ``Chart``；需要 Pine 风格的K线图时使用 ``KLineChart``。

    Example::

        chart = Chart({"title": {"text": "价差"}, "xAxis": {"type": "datetime"},
                       "series": [{"name": "价差", "data": []}]})
        chart.add(0, [Unix() * 1000, 1.5])
    """
    ...

def KLineChart(options: Optional[dict[str, Any]] = None) -> IKLineChart:
    """创建 Pine 风格的K线图。``options``：``overlay``（画在主图）、``pricePrecision``、``volumePrecision``、``xAxis``、
    ``yAxis``、``candle`` 等。

    Example::

        c = KLineChart({"overlay": True})
    """
    ...

def _G(k: Optional[str] = ..., v: Any = ...) -> Any:
    """实盘的持久化键值存储（重启后仍在）。

    ``_G()`` 返回实盘Id；``_G(k)`` 读取；``_G(k, v)`` 写入；``_G(k, None)`` 删除；``_G(None)`` 清空全部。

    Example::

        _G("lastPrice", 50000)
        price = _G("lastPrice")
    """
    ...

def _D(timestamp: Optional[float] = None, fmt: Optional[str] = None) -> str:
    """格式化时间。Python 中 ``timestamp`` 的单位是**秒**（``records[-1].Time / 1000``）；不传为当前时间。
    ``fmt`` 是 ``time.strftime`` 格式，默认 ``"%Y-%m-%d %H:%M:%S"``。使用托管者所在系统的时区。

    Example::

        Log(_D())
        Log(_D(1574993606, "%Y-%m-%d"))
    """
    ...

def _N(num: float, precision: int = 4) -> float:
    """把 ``num`` 截断到 ``precision`` 位小数（不四舍五入）；``precision`` 为负数时截断整数位。

    Example::

        _N(3.1415, 2)   # 3.14
        _N(1300, -3)    # 1000
    """
    ...

def _C(func: Callable[..., Optional[_V]], *args: Any) -> _V:
    """反复调用 ``func(*args)``，直到返回的不是 ``None`` / ``False``，每次失败后休眠（3000毫秒，见 ``_CDelay``）。

    Example::

        ticker = _C(exchange.GetTicker)
        depth = _C(exchange.GetDepth, "BTC_USDT")
    """
    ...

def _CDelay(ms: float) -> None:
    """设置 ``_C()`` 的重试间隔，单位毫秒（默认3000）。"""
    ...

def _Cross(arr1: Sequence[Optional[float]], arr2: Sequence[Optional[float]]) -> int:
    """``arr1`` 与 ``arr2`` 交叉以来的周期数：正数 = ``arr1`` 在这么多根K线之前上穿 ``arr2``，负数 = 下穿，
    0 = 最后一根相等。两个列表长度必须相同。

    Example::

        n = _Cross(TA.EMA(records, 5), TA.EMA(records, 20))
        if n == 1:
            Log("最后一根K线金叉")
    """
    ...

def _T(text: str, other: Optional[str] = None) -> str:
    """双语文本：``_T("中文", "English")`` 按查看者的语言显示对应的部分。"""
    ...
