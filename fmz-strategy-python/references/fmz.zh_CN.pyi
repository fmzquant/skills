from typing import Callable, Optional, TypeVar, Union, List

# ==================== K-line Period Constants ====================

PERIOD_M1: int
"""1分钟K线周期。"""

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
"""订单挂单状态（活跃订单，尚未成交）。"""

ORDER_STATE_CLOSED: int
"""订单已完成（完全成交）。"""

ORDER_STATE_CANCELED: int
"""订单已取消（由用户或交易所取消）。"""

ORDER_STATE_UNKNOWN: int
"""订单状态未知。"""

# ==================== Order Type Constants ====================

ORDER_TYPE_BUY: int
"""买入订单类型。"""

ORDER_TYPE_SELL: int
"""卖出订单类型。"""

# ==================== Order Direction Constants (Futures) ====================

ORDER_OFFSET_OPEN: int
"""开仓方向（期货）。"""

ORDER_OFFSET_CLOSE: int
"""平仓方向（期货）。"""

# ==================== Conditional Order Type Constants ====================

ORDER_CONDITION_TYPE_OCO: int
"""OCO条件单（One-Cancels-the-Other）。同时设置止盈和止损。"""

ORDER_CONDITION_TYPE_TP: int
"""止盈条件单。"""

ORDER_CONDITION_TYPE_SL: int
"""止损条件单。"""

ORDER_CONDITION_TYPE_GENERIC: int
"""通用条件单。"""

# ==================== Log Type Constants ====================

LOG_TYPE_BUY: int
"""买入日志类型，用于 ``exchange.Log()``。"""

LOG_TYPE_SELL: int
"""卖出日志类型，用于 ``exchange.Log()``。"""

LOG_TYPE_CANCEL: int
"""取消订单日志类型，用于 ``exchange.Log()``。"""

# ==================== Position Direction Constants (Futures) ====================

PD_LONG: int
"""多头持仓方向。"""

PD_SHORT: int
"""空头持仓方向。"""

PD_LONG_YD: int
"""昨日多头持仓（上期所特有）。"""

PD_SHORT_YD: int
"""昨日空头持仓（上期所特有）。"""

# ==================== Futures/Exchange Operation Code Constants ====================

FUTURES_OP_SET_MARGIN: int
"""设置保证金/杠杆操作代码。"""

FUTURES_OP_SET_DIRECTION: int
"""设置交易方向操作代码。"""

FUTURES_OP_SET_CONTRACT_TYPE: int
"""设置合约类型操作代码。"""

FUTURES_OP_GET_POSITION: int
"""获取持仓操作代码。"""

EXCHANGE_OP_IO_CONTROL: int
"""IO控制操作代码，用于发送任意API请求。"""

# ==================== Type Aliases ====================

IOrderId = Union[int, str]
"""订单ID类型，根据交易所不同可以是整数或字符串。"""
# ==================== Data Interfaces ====================

class IOrderCondition:
    """条件订单参数结构,定义止盈止损的触发条件。

    与 ``exchange.CreateConditionOrder()`` 配合使用来创建条件订单。

    Example::

        # Take-profit condition
        tp_condition = {
            "ConditionType": ORDER_CONDITION_TYPE_TP,
            "TpTriggerPrice": 55000,
            "TpOrderPrice": 54900
        }
        # Stop-loss condition
        sl_condition = {
            "ConditionType": ORDER_CONDITION_TYPE_SL,
            "SlTriggerPrice": 48000,
            "SlOrderPrice": 47900
        }
        # OCO condition (take-profit + stop-loss)
        oco_condition = {
            "ConditionType": ORDER_CONDITION_TYPE_OCO,
            "TpTriggerPrice": 55000, "TpOrderPrice": 54900,
            "SlTriggerPrice": 48000, "SlOrderPrice": 47900
        }
    """
    ConditionType: int
    """条件类型:ORDER_CONDITION_TYPE_OCO、TP(止盈)、SL(止损)或 GENERIC。"""
    TpTriggerPrice: Optional[float]
    """止盈触发价格。"""
    TpOrderPrice: Optional[float]
    """止盈订单价格(触发时以此价格下单)。"""
    SlTriggerPrice: Optional[float]
    """止损触发价格。"""
    SlOrderPrice: Optional[float]
    """止损订单价格(触发时以此价格下单)。"""

class IOrder:
    """订单信息结构,包含完整的订单详情。

    由 ``exchange.GetOrder()``、``exchange.GetOrders()`` 等返回。

    Example::

        order = exchange.GetOrder(order_id)
        if order:
            Log("Price:", order.Price, "Filled:", order.DealAmount, "Status:", order.Status)
    """
    Info: object
    """交易所返回的原始订单信息(JSON 对象),格式因交易所而异。"""
    Id: IOrderId
    """订单 ID,根据交易所可能是 str 或 int 类型。"""
    Time: int
    """订单时间戳(毫秒)。"""
    Price: float
    """订单价格。"""
    Amount: float
    """订单数量。"""
    DealAmount: float
    """已成交数量。"""
    AvgPrice: float
    """平均成交价格。"""
    Status: int
    """订单状态:ORDER_STATE_PENDING(挂单中)、ORDER_STATE_CLOSED(已成交)、
    ORDER_STATE_CANCELED(已取消)、ORDER_STATE_UNKNOWN(未知)。"""
    Type: int
    """订单类型:ORDER_TYPE_BUY(买入)、ORDER_TYPE_SELL(卖出)。"""
    Offset: Optional[int]
    """订单开平方向(期货):ORDER_OFFSET_OPEN(开仓)、ORDER_OFFSET_CLOSE(平仓)。"""
    ContractType: Optional[str]
    """合约类型(期货),例如 ``"swap"``(永续)、``"quarter"``(季度)。"""
    Condition: Optional[IOrderCondition]
    """条件订单信息(仅条件订单包含此字段)。"""

class IMarketOrder:
    """深度数据中的市场订单条目(买单/卖单),包含价格和数量。"""
    Price: float
    """价格档位。"""
    Amount: float
    """该价格档位的数量。"""

class IDepth:
    """市场深度(订单簿)数据,包含买卖订单信息。

    卖单按价格从低到高排序,买单从高到低排序。

    Example::

        depth = exchange.GetDepth()
        if depth:
            Log("Best ask:", depth.Asks[0].Price, "Best bid:", depth.Bids[0].Price)
            Log("Spread:", depth.Asks[0].Price - depth.Bids[0].Price)
    """
    Info: object
    """交易所返回的原始深度数据。"""
    Time: int
    """时间戳(毫秒)。"""
    Asks: list[IMarketOrder]
    """卖单数组,按价格从低到高排序(Asks[0] 为最优卖价)。"""
    Bids: list[IMarketOrder]
    """买单数组,按价格从高到低排序(Bids[0] 为最优买价)。"""

class IFunding:
    """资金费率信息(永续合约)。

    Example::

        fundings = exchange.GetFundings("BTC_USDT.swap")
        if fundings:
            Log("Funding rate:", fundings[0].Rate, "Settlement time:", fundings[0].Time)
    """
    Info: object
    """交易所返回的原始数据。"""
    Time: int
    """结算时间戳(毫秒)。"""
    Rate: float
    """资金费率,例如 0.0001 表示 0.01%。"""
    Period: float
    """结算周期(秒)。"""
    Symbol: str
    """交易对符号。"""

class IPosition:
    """持仓信息结构(期货)。

    Example::

        positions = exchange.GetPositions("BTC_USDT.swap")
        if positions:
            for pos in positions:
                direction = "Long" if pos.Type == PD_LONG else "Short"
                Log("Direction:", direction, "Amount:", pos.Amount, "PnL:", pos.Profit)
    """
    Info: object
    """交易所返回的原始持仓数据。"""
    MarginLevel: float
    """杠杆倍数。"""
    Amount: float
    """持仓数量。"""
    FrozenAmount: float
    """冻结数量(挂单中待平仓的持仓)。"""
    Price: float
    """平均持仓价格。"""
    Profit: float
    """未实现盈亏。"""
    Type: int
    """持仓方向:PD_LONG(多头)、PD_SHORT(空头)、
    PD_LONG_YD(多头昨仓)、PD_SHORT_YD(空头昨仓)。"""
    ContractType: str
    """合约类型,例如 ``"swap"``、``"quarter"``。"""
    Margin: float
    """该持仓占用的保证金。"""

class ITrade:
    """最近成交记录。

    Example::

        trades = exchange.GetTrades()
        if trades:
            Log("Latest trade:", trades[-1].Price, "Amount:", trades[-1].Amount)
    """
    Id: Union[int, str]
    """成交记录 ID。"""
    Time: int
    """成交时间戳(毫秒)。"""
    Price: float
    """成交价格。"""
    Amount: float
    """成交数量。"""
    Type: int
    """成交类型:ORDER_TYPE_BUY(买入)、ORDER_TYPE_SELL(卖出)。"""

class ITicker:
    """行情数据,包含当前市场快照信息。

    Example::

        ticker = exchange.GetTicker()
        if ticker:
            Log("Last:", ticker.Last, "Bid:", ticker.Buy, "Ask:", ticker.Sell)
            Log("24h High:", ticker.High, "Low:", ticker.Low, "Volume:", ticker.Volume)
    """
    Time: int
    """时间戳(毫秒)。"""
    Symbol: str
    """交易对符号。"""
    High: float
    """24小时最高价。"""
    Low: float
    """24小时最低价。"""
    Sell: float
    """最优卖价。"""
    Buy: float
    """最优买价。"""
    Last: float
    """最新成交价。"""
    Volume: float
    """24小时成交量。"""
    Info: object
    """交易所返回的原始行情数据。"""

class IAccount:
    """账户信息结构(现货)。

    对于期货账户,返回包含权益和未实现盈亏的扩展结构。

    Example::

        account = exchange.GetAccount()
        if account:
            Log("Quote balance:", account.Balance, "Frozen:", account.FrozenBalance)
            Log("Base balance:", account.Stocks, "Frozen:", account.FrozenStocks)
    """
    Info: object
    """交易所返回的原始账户数据。"""
    Balance: float
    """计价货币余额(例如 USDT)。对于期货,指可用保证金。"""
    FrozenBalance: float
    """冻结的计价货币余额。"""
    Stocks: float
    """基础货币余额(例如 BTC)。对于期货,指可用保证金对应的币种。"""
    FrozenStocks: float
    """冻结的基础货币余额。"""
    Equity: float
    """权益(期货),包括未实现盈亏的总账户价值。"""

class IAsset:
    """资产信息,表示账户中特定币种的持有情况。

    Example::

        assets = exchange.GetAssets()
        if assets:
            for asset in assets:
                Log("Currency:", asset.Currency, "Available:", asset.Amount, "Frozen:", asset.FrozenAmount)
    """
    Currency: str
    """币种名称,例如 ``"BTC"``、``"USDT"``。"""
    Amount: float
    """可用数量。"""
    FrozenAmount: float
    """冻结数量。"""

class IRecord:
    """K线数据结构,包含 OHLCV 信息。

    Example::

        records = exchange.GetRecords(PERIOD_H1)
        if records:
            last = records[-1]
            Log("Open:", last.Open, "High:", last.High, "Low:", last.Low, "Close:", last.Close)
    """
    Time: int
    """K线时间戳(毫秒),表示该柱的开始时间。"""
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

class IRecordList(list[IRecord]):
    """IRecord 的扩展列表,提供便捷的 OHLCV 数组属性访问器。

    可直接传递给 TA/talib 指标函数。属性访问器将特定字段的所有值
    提取为一个扁平列表。

    Example::

        records = exchange.GetRecords(PERIOD_H1)
        if records:
            closes = records.Close   # list of all close prices
            highs = records.High     # list of all high prices
            rsi = TA.RSI(records, 14)
    """
    @property
    def Open(self) -> list[float]:
        """从记录中提取的所有开盘价列表。"""
        ...
    @property
    def High(self) -> list[float]:
        """从记录中提取的所有最高价列表。"""
        ...
    @property
    def Low(self) -> list[float]:
        """从记录中提取的所有最低价列表。"""
        ...
    @property
    def Close(self) -> list[float]:
        """从记录中提取的所有收盘价列表。"""
        ...
    @property
    def Volume(self) -> list[float]:
        """从记录中提取的所有成交量列表。"""
        ...

class IMarket:
    """市场/交易对信息,描述精度、限制及其他元数据。

    通过 ``exchange.GetMarkets()`` 获取。

    Example::

        markets = exchange.GetMarkets()
        if markets:
            btc = markets.get("BTC_USDT")
            if btc:
                Log("Price precision:", btc.PricePrecision, "Amount precision:", btc.AmountPrecision)
                Log("Min qty:", btc.MinQty, "Min notional:", btc.MinNotional)
    """
    Symbol: str
    """交易对符号,例如 ``"BTC_USDT"``,期货为 ``"BTC_USDT.swap"``。"""
    BaseAsset: str
    """基础资产(交易币种),例如 ``"BTC"``。"""
    QuoteAsset: str
    """计价资产,例如 ``"USDT"``。"""
    TickSize: Optional[float]
    """最小价格变动单位,例如 0.01。"""
    AmountSize: Optional[float]
    """最小数量步长,例如 0.001。"""
    PricePrecision: Optional[int]
    """价格小数精度,例如 2 表示 2 位小数。"""
    AmountPrecision: Optional[int]
    """数量小数精度,例如 3 表示 3 位小数。"""
    MinQty: Optional[float]
    """最小订单数量。"""
    MaxQty: Optional[float]
    """最大订单数量。"""
    MinNotional: Optional[float]
    """最小订单价值(名义价值)。"""
    MaxNotional: Optional[float]
    """最大订单价值(名义价值)。"""
    CtVal: Optional[float]
    """合约面值(期货),例如 0.01 表示一张合约代表 0.01 个币。"""
    Info: Optional[object]
    """交易所返回的原始市场信息。"""
class IGo:
    """``exchange.Go()`` 返回的并发任务对象,用于异步获取结果。

    示例::

        # 并发获取行情和深度
        go_ticker = exchange.Go("GetTicker")
        go_depth = exchange.Go("GetDepth")
        ticker = go_ticker.wait()   # 等待行情结果
        depth = go_depth.wait()     # 等待深度结果
    """
    def wait(self, timeout: Optional[int] = None) -> object:
        """等待并发任务完成并返回结果。

        参数:
            timeout: 超时时间,单位毫秒。

                - 不传或传 0:阻塞等待直到返回结果。
                - 正数:等待指定毫秒数,超时返回 ``None``。
                - 负数 (-1):立即返回,无结果时返回 ``None``。

        返回:
            对应函数的返回值,失败或超时返回 ``None``。

        示例::

            go = exchange.Go("GetTicker")
            ticker = go.wait(2000)  # 最多等待 2 秒
        """
        ...

class IExchange:
    """交易所操作接口,封装所有交易所 API 调用方法。

    通过全局变量 ``exchange``(第一个交易所)或 ``exchanges[i]``(第 i 个交易所)访问。

    示例::

        ticker = exchange.GetTicker()
        order_id = exchange.Buy(ticker.Sell, 0.1)
        order = exchange.GetOrder(order_id)
    """
    def Go(self, method: str, *args: object) -> IGo:
        """创建并发任务,异步调用交易所方法。

        不阻塞当前代码执行。调用返回的 IGo 对象的 ``wait()`` 方法获取结果。
        可同时发起多个并发请求,提高效率。

        参数:
            method: 要调用的方法名,如 ``"GetTicker"``、``"GetDepth"``、
                ``"GetAccount"``、``"GetRecords"``、``"Buy"``、``"Sell"`` 等。
            *args: 传递给方法的参数。

        返回:
            IGo 对象。调用其 ``wait()`` 方法获取结果。

        示例::

            go_ticker = exchange.Go("GetTicker", "BTC_USDT")
            go_account = exchange.Go("GetAccount")
            ticker = go_ticker.wait()
            account = go_account.wait()
        """
        ...

    def GetPositions(self, symbol: str = '') -> Optional[list[IPosition]]:
        """获取当前持仓列表(期货)。

        参数:
            symbol: 交易对符号,如 ``"BTC_USDT.swap"``。
                不传返回所有持仓。

        返回:
            持仓列表,失败返回 ``None``。无持仓时返回空列表 ``[]``。

        示例::

            positions = exchange.GetPositions("BTC_USDT.swap")
            if positions and len(positions) > 0:
                Log("数量:", positions[0].Amount, "方向:", positions[0].Type)
        """
        ...

    def GetContractType(self) -> str:
        """获取当前设置的合约类型(期货)。

        返回:
            当前合约类型字符串,如 ``"swap"``(永续),
            ``"quarter"``(季度),``"this_week"`` 等。
        """
        ...

    def SetContractType(self, symbol: str) -> object:
        """设置合约类型(期货)。必须在调用交易接口前设置。

        参数:
            symbol: 合约类型:

                - ``"swap"``:永续合约
                - ``"quarter"``:季度合约
                - ``"next_quarter"``:下季度合约
                - ``"this_week"``:本周合约
                - ``"next_week"``:下周合约
                - 也可传合约 ID,如 ``"BTC-USD-200925"``

        返回:
            设置结果。

        示例::

            exchange.SetContractType("swap")       # 永续合约
            exchange.SetContractType("quarter")    # 季度合约
        """
        ...

    def SetMarginLevel(self, symbol: str|float, num: float=None) -> None:
        """设置杠杆倍数(期货)。

        可以用一个或两个参数调用:

        - ``SetMarginLevel(10)`` — 为所有交易对设置 10 倍杠杆。
        - ``SetMarginLevel("BTC_USDT.swap", 20)`` — 为特定交易对设置 20 倍杠杆。

        参数:
            symbol: 杠杆倍数(单参数时)或交易对符号(双参数时)。
            num: 指定交易对时的杠杆倍数。

        示例::

            exchange.SetMarginLevel(10)
            exchange.SetMarginLevel("BTC_USDT.swap", 20)
        """
        ...

    def SetDirection(self, s: str) -> None:
        """设置期货交易方向。下单前必须设置。

        不推荐：优先用 ``CreateOrder``,可直接指定 side,无需先调用 ``SetDirection``。

        参数:
            s: 交易方向:

                - ``"buy"``:买入开多
                - ``"sell"``:卖出开空
                - ``"closebuy"``:卖出平多
                - ``"closesell"``:买入平空

        示例::

            exchange.SetDirection("buy")
            exchange.Buy(50000, 1)           # 开多
            exchange.SetDirection("closebuy")
            exchange.Sell(51000, 1)           # 平多
        """
        ...

    def CancelOrder(self, orderId: object, *extra: object) -> bool:
        """取消指定订单。

        参数:
            orderId: 要取消的订单 ID。
            *extra: 附加日志信息,会显示在日志中。

        返回:
            取消成功返回 ``True``,失败返回 ``False``。

        示例::

            oid = exchange.Buy(50000, 0.1)
            if oid:
                exchange.CancelOrder(oid, "取消测试订单")
        """
        ...

    def GetOrder(self, orderId: object) -> Optional[IOrder]:
        """根据订单 ID 查询订单详情。

        参数:
            orderId: 订单 ID。

        返回:
            订单信息对象,失败返回 ``None``。

        示例::

            order = exchange.GetOrder(order_id)
            if order:
                Log("状态:", order.Status, "成交:", order.DealAmount)
        """
        ...

    def GetOrders(self, symbol: str = '') -> Optional[list[IOrder]]:
        """获取当前未成交挂单列表。

        参数:
            symbol: 交易对符号。不传使用当前设置的交易对。

        返回:
            未成交订单列表(空列表表示无挂单),失败返回 ``None``。

        示例::

            orders = exchange.GetOrders("BTC_USDT")
            if orders is not None:
                Log("挂单数量:", len(orders))
        """
        ...

    def GetHistoryOrders(self, symbol: str|int = '', since: int = 0, limit: int = 0) -> Optional[list[IOrder]]:
        """获取历史订单(已成交/已取消)。

        参数:
            symbol: 交易对符号。
            since: 起始时间戳(毫秒),默认最近的。
            limit: 返回的最大数量。

        返回:
            历史订单列表,失败返回 ``None``。

        示例::

            orders = exchange.GetHistoryOrders("BTC_USDT", 0, 100)
            if orders:
                Log("历史订单:", len(orders))
        """
        ...

    def CancelConditionOrder(self, orderId: object, *extra: object) -> bool:
        """取消指定条件单。

        参数:
            orderId: 条件单 ID。
            *extra: 附加日志信息。

        返回:
            取消成功返回 ``True``,失败返回 ``False``。
        """
        ...

    def GetConditionOrder(self, orderId: object) -> Optional[IOrder]:
        """根据 ID 查询条件单详情。

        参数:
            orderId: 条件单 ID。

        返回:
            条件单信息,失败返回 ``None``。
        """
        ...

    def GetConditionOrders(self, symbol: str = '') -> Optional[list[IOrder]]:
        """获取当前未触发的条件单列表。

        参数:
            symbol: 交易对符号。不传返回所有。

        返回:
            条件单列表,失败返回 ``None``。
        """
        ...

    def GetHistoryConditionOrders(self, symbol: str|int = '', since: int = 0, limit: int = 0) -> Optional[list[IOrder]]:
        """获取历史条件单列表。

        参数:
            symbol: 交易对符号。
            since: 起始时间戳(毫秒)。
            limit: 返回的最大数量。

        返回:
            历史条件单列表,失败返回 ``None``。
        """
        ...

    def Log(self, orderType: int, price: float, amount: float, *args: object) -> None:
        """记录模拟交易日志(不实际下单)。用于虚拟交易或信号标记。

        参数:
            orderType: 日志类型:``LOG_TYPE_BUY``、``LOG_TYPE_SELL`` 或 ``LOG_TYPE_CANCEL``。
            price: 价格(取消时为订单 ID)。
            amount: 数量。
            *args: 附加日志信息。

        示例::

            exchange.Log(LOG_TYPE_BUY, 50000, 0.1, "模拟买入信号")
            exchange.Log(LOG_TYPE_SELL, 51000, 0.1, "模拟卖出信号")
        """
        ...

    def Sell(self, price: float, amount: float, *extra: object) -> Optional[IOrderId]:
        """下卖单(现货卖出/期货根据当前方向卖出)。

        参数:
            price: 卖出价格。传 ``-1`` 表示市价单。
            amount: 卖出数量。
            *extra: 附加日志信息。

        返回:
            订单 ID(str 或 int),失败返回 ``None``。

        示例::

            oid = exchange.Sell(51000, 0.1, "限价卖出")
            oid = exchange.Sell(-1, 0.1, "市价卖出")
        """
        ...

    def Buy(self, price: float, amount: float, *extra: object) -> Optional[IOrderId]:
        """下买单(现货买入/期货根据当前方向买入)。

        参数:
            price: 买入价格。传 ``-1`` 表示市价单。
            amount: 买入数量。
            *extra: 附加日志信息。

        返回:
            订单 ID(str 或 int),失败返回 ``None``。

        示例::

            oid = exchange.Buy(50000, 0.1, "限价买入")
            oid = exchange.Buy(-1, 0.1, "市价买入")
        """
        ...

    def CreateOrder(self, symbol: str, side: str, price: float, amount: float, *extra: object) -> Optional[IOrderId]:
        """通用下单函数。支持直接指定交易对和方向。

        ``side`` 参数可附加选项,用分号分隔,
        如 ``'buy;{"timeInForce":"GTC"}'``。

        参数:
            symbol: 交易对符号,如 ``"BTC_USDT"``(现货)或 ``"BTC_USDT.swap"``(期货)。
            side: 订单方向:``"buy"``、``"sell"``、``"closebuy"``、``"closesell"``。
            price: 价格。传 ``-1`` 表示市价单。
            amount: 数量。
            *extra: 附加日志信息。

        返回:
            订单 ID,失败返回 ``None``。

        示例::

            # 现货买入
            exchange.CreateOrder("ETH_USDT", "buy", -1, 1)
            # 期货开多
            exchange.CreateOrder("BTC_USDT.swap", "buy", 50000, 1)
            # 期货平多
            exchange.CreateOrder("BTC_USDT.swap", "closebuy", -1, 1)
        """
        ...

    def ModifyOrder(self, orderId: object, side: str, price: float, amount: float, *extra: object) -> Optional[IOrderId]:
        """修改已有订单的价格和数量。

        参数:
            orderId: 要修改的订单 ID。期货可能是 ``"symbol,orderId"`` 格式。
            side: 订单方向。
            price: 新价格。
            amount: 新数量。
            *extra: 附加日志信息。

        返回:
            更新后的订单 ID,失败返回 ``None``。
        """
        ...

    def CreateConditionOrder(self, symbol: str, side: str, amount: float, condition: object, *extra: object) -> Optional[IOrderId]:
        """创建条件单(止盈、止损等)。

        参数:
            symbol: 交易对符号。
            side: 订单方向:``"buy"``、``"sell"``、``"closebuy"``、``"closesell"``。
            amount: 数量。
            condition: 条件参数字典,包括触发价格等。
            *extra: 附加日志信息。

        返回:
            条件单 ID,失败返回 ``None``。

        示例::

            exchange.CreateConditionOrder("BTC_USDT.swap", "closebuy", 1, {
                "ConditionType": ORDER_CONDITION_TYPE_TP,
                "TpTriggerPrice": 55000,
                "TpOrderPrice": 54900
            })
        """
        ...

    def ModifyConditionOrder(self, orderId: object, side: str, amount: float, condition: object, *extra: object) -> Optional[IOrderId]:
        """修改已有条件单。

        参数:
            orderId: 条件单 ID。
            side: 订单方向。
            amount: 新数量。
            condition: 新条件参数。
            *extra: 附加日志信息。

        返回:
            更新后的条件单 ID,失败返回 ``None``。
        """
        ...

    def GetRawJSON(self) -> str:
        """获取最近一次 REST API 请求返回的原始 JSON 字符串。

        用于调试和检查交易所原始响应。

        返回:
            原始 JSON 字符串。

        示例::

            exchange.GetTicker()
            raw = exchange.GetRawJSON()
            Log("原始响应:", raw)
        """
        ...

    def GetAccount(self) -> Optional[IAccount]:
        """获取账户信息(余额、冻结等)。

        返回:
            账户信息对象,失败返回 ``None``。

        示例::

            account = exchange.GetAccount()
            if account:
                Log("余额:", account.Balance, "冻结:", account.FrozenBalance)
        """
        ...

    def GetRecords(self, symbol: str|int='', period: Optional[int] = None, limit: int = 0) -> Optional[IRecordList]:
        """获取 K 线/OHLCV 数据。

        参数:
            symbol: 交易对符号。不传使用当前设置的交易对。
            period: K 线周期(秒),如 ``PERIOD_M1``、``PERIOD_H1``。
                不传使用创建机器人时设置的默认周期。
            limit: 返回的最大 K 线数量。

        返回:
            K 线数据列表(按时间升序),失败返回 ``None``。

        示例::

            records = exchange.GetRecords(PERIOD_H1)
            records = exchange.GetRecords("ETH_USDT", PERIOD_M5, 100)
            # 传给 TA 进行技术分析
            dif, dea, macd = TA.MACD(records)
        """
        ...

    def SetMaxBarLen(self, n: int) -> None:
        """设置最大 K 线缓存长度(默认 200 根)。

        参数:
            n: 最大 K 线根数。

        示例::

            exchange.SetMaxBarLen(500)  # 缓存最多 500 根
        """
        ...

    def GetTrades(self, symbol: str='') -> Optional[list[ITrade]]:
        """获取最近成交记录。

        参数:
            symbol: 交易对符号。不传使用当前设置的交易对。

        返回:
            成交记录列表(按时间升序),失败返回 ``None``。

        示例::

            trades = exchange.GetTrades()
            if trades and len(trades) > 0:
                Log("最新成交:", trades[-1].Price)
        """
        ...

    def GetTicker(self, symbol: str='') -> Optional[ITicker]:
        """获取当前行情。

        参数:
            symbol: 交易对符号。不传使用当前设置的交易对。

        返回:
            行情数据,失败返回 ``None``。

        示例::

            ticker = exchange.GetTicker("BTC_USDT")
            if ticker:
                Log("BTC 价格:", ticker.Last)
        """
        ...

    def GetTickers(self) -> Optional[list[ITicker]]:
        """获取所有交易对的行情数据(批量获取)。

        返回:
            所有交易对的行情列表,失败返回 ``None``。

        示例::

            tickers = exchange.GetTickers()
            if tickers:
                for t in tickers:
                    if t.Symbol == "BTC_USDT":
                        Log("BTC:", t.Last)
        """
        ...

    def GetFundings(self, symbol: str = '') -> Optional[list[IFunding]]:
        """获取资金费率信息(永续合约)。

        参数:
            symbol: 交易对符号。

        返回:
            资金费率列表,失败返回 ``None``。

        示例::

            fundings = exchange.GetFundings("BTC_USDT.swap")
            if fundings:
                Log("资金费率:", fundings[0].Rate)
        """
        ...

    def GetDepth(self, symbol: str='') -> Optional[IDepth]:
        """获取市场深度(订单簿)。卖单从低到高,买单从高到低。

        参数:
            symbol: 交易对符号。不传使用当前设置的交易对。

        返回:
            深度数据,失败返回 ``None``。

        示例::

            depth = exchange.GetDepth("BTC_USDT")
            if depth:
                Log("最佳卖价:", depth.Asks[0].Price, "最佳买价:", depth.Bids[0].Price)
        """
        ...

    def GetBaseCurrency(self) -> str:
        """获取基础币种名称。

        返回:
            基础币种字符串,如 ``"BTC"``。
        """
        ...

    def GetQuoteCurrency(self) -> str:
        """获取计价币种名称。

        返回:
            计价币种字符串,如 ``"USDT"``。
        """
        ...

    def SetProxy(self, proxy: str) -> None:
        """设置代理服务器地址。

        参数:
            proxy: 代理地址。支持的格式:

                - ``"socks5://user:pass@host:port"`` — SOCKS5 代理
                - ``"http://host:port"`` — HTTP 代理
                - ``""`` — 清除代理设置

        示例::

            exchange.SetProxy("socks5://127.0.0.1:1080")
            exchange.SetProxy("")  # 取消代理
        """
        ...

    def SetPrecision(self, pricePrecision: int, amountPrecision: int) -> None:
        """设置价格和数量的小数精度。下单时自动截断。

        参数:
            pricePrecision: 价格小数位数。
            amountPrecision: 数量小数位数。

        示例::

            exchange.SetPrecision(2, 4)  # 价格 2 位,数量 4 位
        """
        ...

    def IO(self, k: str, *args: object) -> object:
        """发送任意 API 请求(IO 控制)。用于调用尚未封装的交易所 API。

        参数:
            k: 请求路径或控制命令:

                - API 路径:如 ``"/api/v5/account/balance"``
                - ``"api"``:通用 API 调用
                - ``"currency"``:切换交易对
                - ``"base"``:切换 API 基础地址

            *args: 请求参数。

        返回:
            API 响应结果(解析为对象)。

        示例::

            ret = exchange.IO("api", "GET", "/api/v5/account/balance")
            exchange.IO("currency", "ETH_USDT")
        """
        ...

    def SetTimeout(self, n: int) -> None:
        """设置 REST API 请求超时时间。

        参数:
            n: 超时时长,单位毫秒。

        示例::

            exchange.SetTimeout(10000)  # 10 秒超时
        """
        ...

    def SetBase(self, s: str) -> None:
        """设置交易所 API 基础地址。用于切换到备用域名或测试网。

        参数:
            s: API 基础 URL。

        示例::

            exchange.SetBase("https://testnet.binance.vision")
        """
        ...

    def GetBase(self) -> str:
        """获取当前 API 基础地址。

        返回:
            API 基础 URL 字符串。
        """
        ...

    def SetCurrency(self, s: str) -> None:
        """切换当前交易对。

        参数:
            s: 交易对字符串,如 ``"BTC_USDT"``、``"ETH_BTC"``。

        示例::

            exchange.SetCurrency("ETH_USDT")
            Log(exchange.GetTicker())  # 获取 ETH 行情
        """
        ...

    def SetRate(self, n: float) -> None:
        """设置汇率转换。所有价格将自动乘以该汇率。

        参数:
            n: 汇率值。``1`` 表示不转换。

        示例::

            exchange.SetRate(6.5)  # 将价格转换为人民币
            exchange.SetRate(1)    # 取消转换
        """
        ...

    def GetRate(self) -> float:
        """获取当前设置的汇率值。

        返回:
            汇率值,默认为 ``1``。
        """
        ...

    def GetUSDCNY(self) -> float:
        """获取美元兑人民币汇率。

        返回:
            USD/CNY 汇率。
        """
        ...

    def GetLabel(self) -> str:
        """获取交易所自定义标签名称(在 FMZ 平台配置交易所时设置)。

        返回:
            标签字符串。
        """
        ...

    def GetCurrency(self) -> str:
        """获取当前交易对名称。

        返回:
            交易对字符串,如 ``"BTC_USDT"``。
        """
        ...

    def GetPeriod(self) -> int:
        """获取当前设置的 K 线周期。

        返回:
            K 线周期,单位秒。
        """
        ...

    def GetName(self) -> str:
        """获取交易所名称。

        返回:
            交易所平台名称,如 ``"Binance"``、``"OKX"``、``"Futures_Binance"``。
        """
        ...

    def GetMarkets(self) -> Optional[dict[str, IMarket]]:
        """获取所有交易对的市场信息。

        返回:
            以交易对符号为键(如 ``"BTC_USDT"``)的市场信息字典,
            失败返回 ``None``。

        示例::

            markets = exchange.GetMarkets()
            if markets:
                m = markets.get("BTC_USDT")
                if m:
                    Log("最小数量:", m.MinQty, "价格精度:", m.PricePrecision)
        """
        ...

    def GetAssets(self) -> Optional[list[IAsset]]:
        """获取账户的所有资产信息。

        返回:
            资产列表,每个元素包含币种、可用数量、冻结数量。
            失败返回 ``None``。

        示例::

            assets = exchange.GetAssets()
            if assets:
                for a in assets:
                    Log(a.Currency, "可用:", a.Amount)
        """
        ...# ==================== TA Input Type ====================

t_TAInput = Union[list[float], IRecordList]
"""TA指标函数的输入类型。可以是浮点数列表(例如收盘价)
或IRecordList(K线数组,自动使用Close字段)。"""

# ==================== Built-in TA Indicator Library ====================

class ITA:
    """FMZ平台内置技术分析指标库(简化版)。

    比talib更常用且更易使用。通过全局变量 ``TA`` 访问。

    示例::

        records = exchange.GetRecords()
        k, d, j = TA.KDJ(records, 9, 3, 3)
        upper, mid, lower = TA.BOLL(records, 20, 2)
    """
    def CMF(self, inReal: t_TAInput, optInTimePeriod: Optional[IRecordList] = None) -> list[float]:
        """CMF - 蔡金资金流量指标。

        参数:
            inReal: 输入数据(K线数组)。
            optInTimePeriod: 计算周期。

        返回:
            CMF数组。
        """
        ...

    def Alligator(self, inReal: t_TAInput, jawLength: Optional[int] = None, teethLength: Optional[int] = None, lipsLength: Optional[int] = None) -> tuple[list[float], list[float], list[float]]:
        """鳄鱼指标(威廉姆斯)。

        参数:
            inReal: 输入数据。
            jawLength: 鳄鱼颚线周期,默认13。
            teethLength: 鳄鱼齿线周期,默认8。
            lipsLength: 鳄鱼唇线周期,默认5。

        返回:
            (颚线, 齿线, 唇线)数组的元组。

        示例::

            jaw, teeth, lips = TA.Alligator(records, 13, 8, 5)
        """
        ...

    def ATR(self, inPriceHLC: IRecordList, optInTimePeriod: Optional[int] = None) -> list[float]:
        """ATR - 平均真实波幅。

        参数:
            inPriceHLC: K线数据(需要High/Low/Close)。
            optInTimePeriod: 计算周期,默认14。

        返回:
            ATR数组。
        """
        ...

    def OBV(self, inReal: t_TAInput, inPriceV: IRecordList) -> list[float]:
        """OBV - 能量潮指标。

        参数:
            inReal: 收盘价数组或K线数组。
            inPriceV: 包含成交量的K线数组。

        返回:
            OBV数组。
        """
        ...

    def RSI(self, inReal: t_TAInput, optInTimePeriod: Optional[int] = None) -> list[float]:
        """RSI - 相对强弱指标。

        参数:
            inReal: 输入数据。
            optInTimePeriod: 计算周期,默认14。

        返回:
            RSI数组,取值范围0~100。>70超买,<30超卖。

        示例::

            rsi = TA.RSI(records, 14)
            if rsi[-1] > 70:
                Log("Overbought zone")
        """
        ...

    def KDJ(self, inReal: t_TAInput, period: Optional[int] = None, kPeriod: Optional[int] = None, dPeriod: Optional[int] = None) -> tuple[list[float], list[float], list[float]]:
        """KDJ - 随机振荡指标。

        参数:
            inReal: K线数据。
            period: K线周期,默认9。
            kPeriod: K线平滑周期,默认3。
            dPeriod: D线平滑周期,默认3。

        返回:
            (K, D, J)数组的元组。

        示例::

            k, d, j = TA.KDJ(records, 9, 3, 3)
            Log("K:", k[-1], "D:", d[-1], "J:", j[-1])
        """
        ...

    def BOLL(self, inReal: t_TAInput, period: Optional[int] = None, multiplier: Optional[float] = None) -> tuple[list[float], list[float], list[float]]:
        """BOLL - 布林带。

        参数:
            inReal: 输入数据。
            period: 计算周期,默认20。
            multiplier: 标准差乘数,默认2。

        返回:
            (上轨, 中轨, 下轨)数组的元组。

        示例::

            upper, middle, lower = TA.BOLL(records, 20, 2)
        """
        ...

    def MACD(self, inReal: t_TAInput, optInFastPeriod: Optional[int] = None, optInSlowPeriod: Optional[int] = None, optInSignalPeriod: Optional[int] = None) -> tuple[list[float], list[float], list[float]]:
        """MACD - 指数平滑异同移动平均线。

        参数:
            inReal: 输入数据。
            optInFastPeriod: 快线周期,默认12。
            optInSlowPeriod: 慢线周期,默认26。
            optInSignalPeriod: 信号线周期,默认9。

        返回:
            (DIF, DEA, MACD柱状图)数组的元组。

        示例::

            dif, dea, macd = TA.MACD(records, 12, 26, 9)
            Log("MACD:", macd[-1])
        """
        ...

    def EMA(self, inReal: t_TAInput, optInTimePeriod: Optional[int] = None) -> list[float]:
        """EMA - 指数移动平均线。

        参数:
            inReal: 输入数据。
            optInTimePeriod: 计算周期。

        返回:
            EMA数组。
        """
        ...

    def SMA(self, inReal: t_TAInput, optInTimePeriod: Optional[int] = None) -> list[float]:
        """SMA - 简单移动平均线。

        参数:
            inReal: 输入数据。
            optInTimePeriod: 计算周期。

        返回:
            SMA数组。
        """
        ...

    def MA(self, inReal: t_TAInput, optInTimePeriod: Optional[int] = None) -> list[float]:
        """MA - 移动平均线(默认SMA)。

        参数:
            inReal: 输入数据。
            optInTimePeriod: 计算周期。

        返回:
            MA数组。
        """
        ...

    def Highest(self, inReal: t_TAInput, period: Optional[int] = None, attr: Optional[str] = None) -> float:
        """获取周期内的最高值。

        参数:
            inReal: 输入数据。
            period: 计算周期。如果未提供,计算所有数据。
            attr: 传入K线数组时的K线属性名,
                例如 ``"High"``, ``"Low"``, ``"Close"``, ``"Volume"``。

        返回:
            最高值(单个数字)。

        示例::

            highest_high = TA.Highest(records, 20, "High")
            highest_close = TA.Highest(records, 10, "Close")
        """
        ...

    def Lowest(self, inReal: t_TAInput, period: Optional[int] = None, attr: Optional[str] = None) -> float:
        """获取周期内的最低值。

        参数:
            inReal: 输入数据。
            period: 计算周期。如果未提供,计算所有数据。
            attr: K线属性名,例如 ``"High"``, ``"Low"``, ``"Close"``, ``"Volume"``。

        返回:
            最低值(单个数字)。

        示例::

            lowest_low = TA.Lowest(records, 20, "Low")
        """
        ...
# ==================== Database / Dial / Event Interfaces ====================

class IDBExecRet:
    """数据库执行结果结构。

    由 ``DBExec()`` 和 ``IDial.exec()`` 返回。
    """
    values: list[List]
    """查询结果数据行，每行是一个值列表。"""
    columns: list[str]
    """列名列表。"""

class IDial:
    """网络连接对象。支持 TCP、WebSocket、数据库和 KVDB 协议。

    通过 ``Dial()`` 函数创建。

    示例::

        # WebSocket 连接
        ws = Dial("wss://stream.binance.com:9443/ws/btcusdt@ticker")
        if ws:
            msg = ws.read(5000)  # 读取，5秒超时
            ws.close()

        # 数据库连接
        db = Dial("sqlite3:///mydata.db")
        db.exec("CREATE TABLE IF NOT EXISTS kv(k TEXT PRIMARY KEY, v TEXT)")
        db.exec("INSERT INTO kv VALUES(?, ?)", "key1", "value1")
        ret = db.exec("SELECT * FROM kv")
        db.close()
    """
    def read(self, timeout: Optional[int] = None) -> Optional[Union[str, bytes]]:
        """从连接读取数据。

        参数:
            timeout: 超时时间（毫秒）。省略则阻塞读取，传入 ``-1`` 则非阻塞。

        返回:
            从连接读取的数据。超时或无数据时返回 ``None``。
            连接关闭时返回空字符串 ``""``。
        """
        ...

    def write(self, data: Union[str, bytes]) -> None:
        """向连接写入数据。

        参数:
            data: 要发送的数据（字符串或二进制数据）。
        """
        ...

    def exec(self, sql: str, *extra: object) -> Optional[IDBExecRet]:
        """执行 SQL 语句（数据库连接）或 KVDB 操作。

        KVDB 支持的命令: ``"get key"``、``"set key value"``、``"del key"``、
        ``"scan prefix limit"``、``"range startKey endKey limit"``。

        参数:
            sql: SQL 语句或 KVDB 命令。
            *extra: SQL 参数化查询的绑定值。

        返回:
            查询结果对象，失败时返回 ``None``。

        示例::

            ret = db.exec("SELECT * FROM users WHERE age > ?", 18)
            db.exec("set mykey myvalue")
        """
        ...

    def fd(self) -> int:
        """获取连接的文件描述符编号。

        返回:
            文件描述符编号。
        """
        ...

    def close(self) -> None:
        """关闭连接并释放资源。"""
        ...

class IEventMsg:
    """事件循环消息结构，由 ``EventLoop()`` 返回。

    包含市场更新、线程消息、WebSocket 数据等事件的信息。
    """
    Seq: int
    """事件序列号。"""
    Event: str
    """事件类型，例如 ``"ticker"``、``"order"``、``"thread"`` 等。"""
    ThreadId: int
    """触发事件的线程 ID。"""
    Index: int
    """交易所索引。"""
    Nano: int
    """事件时间（纳秒）。"""
    Symbol: str
    """相关交易对。"""
    Ticker: Optional[ITicker]
    """如果是市场事件，包含 Ticker 数据。"""

class IChart:
    """图表对象，用于在策略页面绘制自定义图表。

    通过 ``Chart()`` 或 ``KLineChart()`` 创建。

    示例::

        chart = Chart({
            "title": {"text": "Price Trend"},
            "xAxis": {"type": "datetime"},
            "series": [{"name": "Price", "data": []}]
        })
        chart.add(0, [Unix() * 1000, ticker.Last])
    """
    def add(self, series: int, data: Union[list[object], object], index: Optional[int] = None) -> None:
        """向指定序列添加数据点。

        参数:
            series: 序列索引（从 0 开始）。
            data: 数据点。格式取决于图表类型（例如 ``[timestamp, value]``）。
            index: 在指定索引处更新数据点。省略则追加。
                ``-1`` 更新最后一个点。
        """
        ...

    def reset(self, remain: Optional[int] = None) -> None:
        """重置图表数据。

        参数:
            remain: 要保留的最近数据点数量。默认为 0（清除全部）。
        """
        ...

    def update(self, options: object) -> None:
        """更新图表配置选项。

        参数:
            options: 新的图表配置（Highcharts/Highstock 配置对象）。
        """
        ...

class IHttpOptions:
    """``HttpQuery()`` 的 HTTP 请求选项。

    示例::

        ret = HttpQuery("https://api.example.com/data", {
            "method": "POST",
            "body": json.dumps({"key": "value"}),
            "headers": {"Content-Type": "application/json"},
            "timeout": 5000,
            "debug": True
        })
    """
    method: Optional[str]
    """HTTP 方法: ``"GET"``、``"POST"``、``"PUT"``、``"DELETE"`` 等。默认 ``"GET"``。"""
    body: Optional[Union[str, bytes]]
    """请求体（用于 POST 和其他方法）。"""
    charset: Optional[str]
    """响应字符编码转换（例如 ``"gbk"``）。"""
    cookie: Optional[str]
    """Cookie 字符串。"""
    profile: Optional[str]
    """TLS 指纹配置。"""
    debug: Optional[bool]
    """为 ``True`` 时，返回完整响应对象（包括状态码和响应头）。"""
    format: Optional[str]
    """响应体的输出格式: ``"base64"`` 或 ``"hex"``。"""
    close: Optional[bool]
    """请求后是否关闭连接（禁用 keep-alive）。"""
    headers: Optional[dict[str, object]]
    """自定义请求头。"""
    timeout: Optional[int]
    """请求超时时间（毫秒）。"""

class IHttpRet:
    """在调试模式下由 ``HttpQuery()`` 返回的完整 HTTP 响应结构。"""
    StatusCode: int
    """HTTP 状态码，例如 200、404、500。"""
    Trace: Optional[object]
    """请求跟踪信息（在调试模式下可用）。"""
    Header: dict[str, list[str]]
    """响应头字典。每个键映射到一个字符串列表。"""
    Body: Optional[Union[str, bytes]]
    """响应体内容。请求失败时为 ``None``。"""

# ==================== Global Variables ====================

ext = object()
"""模板类库域。用于访问模板库函数。"""

TA = ITA()
"""FMZ 内置技术分析库，包含常用指标的简化版本
（KDJ、BOLL、MACD、EMA、SMA、RSI 等）。"""

exchanges: list[IExchange] = [IExchange()]
"""所有已添加的交易所对象列表。通过 ``exchanges[i]`` 访问第 i 个交易所。"""

exchange: IExchange = exchanges[0]

# ==================== Global Functions ====================

def Version() -> str:
    """获取托管者版本号。

    返回:
        版本号字符串,例如 ``"3.7"``。
    """
    ...

def Sleep(millisecond: int) -> None:
    """暂停策略执行指定的毫秒数。

    暂停期间会处理事件循环中的待处理事件。
    建议在策略主循环中添加 ``Sleep`` 以避免过于频繁的 API 请求。

    参数:
        millisecond: 暂停的毫秒数。

    示例::

        while True:
            ticker = exchange.GetTicker()
            Log(ticker.Last)
            Sleep(1000)  # 每秒执行一次
    """
    ...

def IsVirtual() -> bool:
    """判断当前是否运行在回测(模拟)环境中。

    返回:
        回测环境下返回 ``True``,实盘交易时返回 ``False``。

    示例::

        if IsVirtual():
            Log("回测模式")
        else:
            Log("实盘模式")
    """
    ...

def Mail(smtpServer: str, smtpUsername: str, smtpPassword: str, mailTo: str, title: str, body: str) -> bool:
    """通过 SMTP 发送邮件通知。

    参数:
        smtpServer: SMTP 服务器地址,例如 ``"smtp.qq.com:465"``。
        smtpUsername: SMTP 登录用户名(通常是邮箱地址)。
        smtpPassword: SMTP 登录密码或授权码。
        mailTo: 收件人邮箱地址。
        title: 邮件主题。
        body: 邮件正文。

    返回:
        成功时返回 ``True``,失败时返回 ``False``。

    示例::

        Mail("smtp.qq.com:465", "sender@qq.com", "auth_code",
             "receiver@gmail.com", "Alert", "BTC broke above 50000")
    """
    ...

def SetErrorFilter(filters: str) -> None:
    """设置错误信息过滤正则表达式。匹配的错误信息将不会被记录。

    常用于过滤频繁出现的无关错误。可以多次调用以添加多个过滤规则。

    参数:
        filters: 正则表达式字符串。传入空字符串 ``""`` 可清除所有过滤规则。

    示例::

        SetErrorFilter("timeout|503|rate limit")
        SetErrorFilter("")  # 清除所有过滤器
    """
    ...

def GetPid() -> int:
    """获取当前托管者进程的 PID。

    返回:
        进程 ID 号。
    """
    ...

def GetLastError() -> Optional[str]:
    """获取最近一次的错误信息并清除它。

    调用后,错误信息被消费,后续调用返回 ``None``。

    返回:
        最近的错误信息字符串,没有错误时返回 ``None``。

    示例::

        exchange.GetTicker()
        err = GetLastError()
        if err:
            Log("错误:", err)
    """
    ...

def GetCommand() -> Optional[str]:
    """获取策略交互命令。

    用于读取用户在 FMZ 平台策略页面发送的交互命令。

    返回:
        命令字符串(格式: ``"按钮名称:参数"``),没有命令时返回 ``None``。

    示例::

        cmd = GetCommand()
        if cmd:
            Log("收到:", cmd)
            parts = cmd.split(":")
            if parts[0] == "buy":
                exchange.Buy(-1, float(parts[1]))
    """
    ...

def GetChannelData(token: str) -> Optional[str]:
    """获取跨策略通信的通道数据。

    读取其他策略通过 ``SetChannelData()`` 发布的数据。

    参数:
        token: 通道令牌(用于标识数据源)。

    返回:
        来自通道的数据,没有可用数据时返回 ``None``。
    """
    ...

def SetChannelData(value: str) -> None:
    """设置不同机器人之间跨策略通信的通道数据。

    将数据发布到通道,其他策略可以通过 ``GetChannelData()`` 读取。

    参数:
        value: 要发布的数据。
    """
    ...

def GetMeta() -> Optional[str]:
    """获取策略元数据(创建机器人时设置的附加数据)。

    返回:
        元数据字符串,没有数据时返回 ``None``。
    """
    ...

def Dial(address: Union[str, int], timeout: Union[int, dict] = None) -> Optional[IDial]:
    """创建网络连接(TCP/WebSocket/数据库等)以与外部服务通信。

    参数:
        address: 连接地址,支持多种协议:

            - WebSocket: ``"wss://stream.binance.com:9443/ws/btcusdt@ticker"``
            - TCP: ``"tcp://host:port"``
            - SQLite: ``"sqlite3:///path/to/db.sqlite3"``
            - MySQL: ``"mysql://user:pass@host:port/dbname"``
            - PostgreSQL: ``"postgres://user:pass@host:port/dbname?sslmode=disable"``
            - KVDB (Pebble): ``"kvdb://"`` 或 ``"kvdb:///path/to/db"``

            选项可以在末尾用 ``|`` 分隔添加,例如:
            ``"wss://....|compress=gzip_raw&mode=recv"``

        timeout: 连接超时时间(毫秒),默认 30000。

    返回:
        IDial 连接对象,连接失败时返回 ``None``。

    示例::

        ws = Dial("wss://stream.binance.com:9443/ws/btcusdt@ticker")
        if ws:
            msg = ws.read(5000)
            if msg:
                Log(msg)
            ws.close()

        db = Dial("sqlite3:///strategy.db")
        db.exec("CREATE TABLE IF NOT EXISTS logs(time TEXT, msg TEXT)")
    """
    ...

def HttpQuery(url: str, postData: Optional[Union[str, bytes]] = None, cookies: Optional[str] = None, headers: Optional[Union[str, dict[str, str]]] = None) -> Optional[str]:
    """发送 HTTP 请求。

    当第二个参数传入包含 ``debug: True`` 的字典时,
    返回完整的 IHttpRet 响应对象而不仅仅是正文字符串。

    参数:
        url: 请求 URL。
        postData: POST 数据(非空时自动变为 POST 请求)。
            也可以是用于高级用法的 IHttpOptions 字典。
        cookies: Cookie 字符串。
        headers: 请求头,支持字符串(换行分隔)或字典。

    返回:
        响应正文字符串,失败时返回 ``None``。如果选项中有 ``debug=True``,
        返回包含 ``StatusCode``、``Header``、``Body`` 字段的字典。

    示例::

        data = HttpQuery("https://api.example.com/ticker")
        if data:
            Log(data)

        # 使用选项的高级用法
        ret = HttpQuery("https://api.example.com/data", {
            "method": "POST",
            "body": '{"key": "value"}',
            "headers": {"Content-Type": "application/json"},
            "debug": True
        })
    """
    ...

def Encode(algo: str, inputFormat: str, outputFormat: str, data: Union[str, bytes], keyFormat: Optional[str] = None, key: Optional[str] = None) -> Union[str, bytes]:
    """通用编码/加密/签名函数。

    参数:
        algo: 算法名称:

            - 哈希: ``"md5"``, ``"sha256"``, ``"sha512"``, ``"sha1"``, ``"keccak256"``
            - HMAC: ``"hmac_md5"``, ``"hmac_sha256"``, ``"hmac_sha512"``
            - 加密: ``"aes128-cbc"``, ``"aes256-cbc"``, ``"aes192-cbc"``
            - 签名: ``"ed25519"``, ``"ed25519.seed"``
            - 编码: ``"raw"``, ``"text.encoder"``, ``"text.decoder"``

        inputFormat: 输入数据格式: ``"hex"``, ``"base64"``, ``"raw"``, ``"string"``。
        outputFormat: 输出数据格式: ``"hex"``, ``"base64"``, ``"raw"``, ``"string"``。
        data: 输入数据。
        keyFormat: 密钥格式(加密时必需): ``"hex"``, ``"base64"``, ``"raw"``, ``"string"``。
        key: 密钥(加密算法所需)。

    返回:
        编码/加密结果。

    示例::

        sign = Encode("hmac_sha256", "string", "hex", "message", "string", "secret")
        hash_val = Encode("sha256", "string", "hex", "hello")
    """
    ...

def UnixNano() -> int:
    """获取当前时间的纳秒精度时间戳。

    返回:
        纳秒时间戳(例如 ``1609459200000000000``)。

    示例::

        start = UnixNano()
        # ... 执行操作 ...
        elapsed_ms = (UnixNano() - start) / 1e6
        Log("耗时:", elapsed_ms, "ms")
    """
    ...

def Unix() -> int:
    """获取当前时间的秒精度时间戳。

    返回:
        秒精度时间戳(例如 ``1609459200``)。
    """
    ...

def GetOS() -> str:
    """获取托管者运行所在的操作系统和架构信息。

    返回:
        格式为 ``"os/arch"`` 的字符串,例如 ``"linux/amd64"``、``"darwin/arm64"``。
    """
    ...

def SysInfo(attr: str) -> object:
    """获取系统信息。

    参数:
        attr: 信息类型:

            - ``"pid"``: 进程 ID
            - ``"ppid"``: 父进程 ID
            - ``"ncpu"``: CPU 核心数
            - ``"arch"``: CPU 架构(例如 ``"amd64"``)
            - ``"os"``: 操作系统(例如 ``"linux"``)
            - ``"sys_cpu"``: 系统 CPU 使用率(%)
            - ``"sys_mem"``: 系统内存信息
            - ``"cpu"``: 当前进程 CPU 使用率
            - ``"mem"``: 当前进程内存使用量
            - ``"threads"``: 当前进程线程数

    返回:
        对应的系统信息值。

    示例::

        Log("CPU 核心数:", SysInfo("ncpu"))
    """
    ...

def MD5(data: str) -> str:
    """计算字符串的 MD5 哈希值。

    参数:
        data: 要计算哈希的字符串。

    返回:
        32 字符十六进制 MD5 哈希字符串(小写)。

    示例::

        Log(MD5("hello"))  # "5d41402abc4b2a76b9719d911017c592"
    """
    ...

def DBExec(sql: str, *extra: object) -> Optional[IDBExecRet]:
    """在策略的内置 SQLite 数据库上执行 SQL 语句。

    每个机器人都有一个独立的 SQLite 数据库,数据持久化存储。
    当 SQL 以 ``":"`` 开头时,使用内存数据库(重启后数据丢失)。

    参数:
        sql: SQL 语句。支持参数化查询(使用 ``?`` 作为占位符)。
        *extra: 参数化查询的绑定值。

    返回:
        查询结果对象(包含 ``columns`` 和 ``values``),失败时返回 ``None``。

    示例::

        DBExec("CREATE TABLE IF NOT EXISTS trades(id INTEGER PRIMARY KEY, price REAL, amount REAL)")
        DBExec("INSERT INTO trades(price, amount) VALUES(?, ?)", 50000, 0.1)
        ret = DBExec("SELECT * FROM trades ORDER BY id DESC LIMIT 10")
        if ret:
            Log("列名:", ret.columns)
            Log("数据:", ret.values)
    """
    ...

def UUID() -> str:
    """生成 UUID 字符串(包含时间组件)。

    返回:
        UUID 字符串,例如 ``"550e8400-e29b-41d4-a716-446655440000"``。
    """
    ...

def EventLoop(timeout: Optional[int] = None) -> Optional[IEventMsg]:
    """等待事件循环中的下一个事件(市场更新、线程消息、WebSocket 数据等)。

    当策略使用 WebSocket 或多线程时,``EventLoop`` 是推荐的事件驱动方式。

    参数:
        timeout: 超时时间(毫秒):

            - 不传或传 0: 阻塞等待直到有事件。
            - 正数: 等待指定毫秒,超时返回 ``None``。
            - 负数(-1): 非阻塞,无事件时立即返回 ``None``。

    返回:
        事件消息对象,超时或无事件时返回 ``None``。

    示例::

        while True:
            ev = EventLoop(1000)
            if ev:
                Log("事件:", ev.Event, "交易所:", ev.Index, "品种:", ev.Symbol)
    """
    ...

def _G(k: str, v: Optional[object] = None) -> object:
    """全局持久化 KV 存储。数据保存在策略数据库中,重启后仍然保留。

    参数:
        k: 键名。传入 ``None`` 可清除所有 KV 数据。
        v: 值(可选):

            - 不传: 读取该键的值。
            - 传 ``None``: 删除该键。
            - 传其他值: 保存键值对。

    返回:
        读取时返回对应的值。写入时无有意义的返回。
        不带参数调用时返回机器人 ID。

    示例::

        _G("lastPrice", 50000)          # 保存
        price = _G("lastPrice")         # 读取 -> 50000
        _G("lastPrice", None)           # 删除
    """
    ...

def _D(timestamp: Optional[Union[int, float]] = None, fmt: Optional[str] = None) -> str:
    """将时间戳格式化为可读的日期字符串。

    参数:
        timestamp: 时间戳(毫秒)。不传时使用当前时间。
        fmt: 日期格式字符串,默认 ``"yyyy-MM-dd HH:mm:ss"``。

    返回:
        格式化后的日期字符串。

    示例::

        Log(_D())                     # "2024-01-15 10:30:45"
        Log(_D(1705284645000))        # "2024-01-15 10:30:45"
    """
    ...

def _N(num: float, precision: int = 4) -> float:
    """数字精度截断(向下截断,不进行四舍五入)。

    参数:
        num: 要截断的数字。
        precision: 保留的小数位数。

    返回:
        截断后的数字。

    示例::

        Log(_N(3.14159, 2))   # 3.14
        Log(_N(3.14959, 2))   # 3.14 (不四舍五入)
    """
    ...

def _Cross(arr1: list[float], arr2: list[float]) -> bool:
    """判断两条线是否交叉(金叉/死叉)。

    参数:
        arr1: 第一条线的数据数组。
        arr2: 第二条线的数据数组。

    返回:
        正数表示金叉(arr1 向上穿过 arr2),
        负数表示死叉(arr1 向下穿过 arr2),
        0 表示无交叉。

    示例::

        ema5 = TA.EMA(records, 5)
        ema20 = TA.EMA(records, 20)
        cross = _Cross(ema5, ema20)
        if cross > 0:
            Log("金叉!")
        if cross < 0:
            Log("死叉!")
    """
    ...

def JSONParse(s: str) -> dict:
    """安全的 JSON 解析。解析失败时抛出异常。

    参数:
        s: 要解析的 JSON 字符串。

    返回:
        解析后的字典对象。

    示例::

        obj = JSONParse('{"price": 50000, "amount": 0.1}')
        Log(obj["price"])  # 50000
    """
    ...

def Log(s: object, *extra: object) -> None:
    """向策略日志区域输出日志。

    支持特殊后缀来控制日志颜色: 追加 ``"#FF0000"`` 可以红色显示。

    参数:
        s: 日志内容,支持任意类型。
        *extra: 额外的日志参数,将被追加。

    示例::

        Log("普通日志")
        Log("红色日志 #FF0000")
        Log("价格:", ticker.Last, "数量:", 0.1)
    """
    ...

def LogProfit(profit: float, *extra: object) -> None:
    """记录盈亏数据并绘制盈亏曲线。

    参数:
        profit: 盈亏值。
        *extra: 额外的日志信息。

    示例::

        LogProfit(100.5)
        LogProfit(100.5, "本次交易盈亏")
    """
    ...

def LogProfitReset(remain: Optional[int] = None) -> None:
    """重置盈亏日志。

    参数:
        remain: 要保留的最近记录数。默认 0(清除所有)。

    示例::

        LogProfitReset()     # 清除所有
        LogProfitReset(10)   # 保留最后 10 条
    """
    ...

def LogStatus(s: object, *extra: object) -> None:
    """设置策略状态栏信息(显示在机器人页面顶部)。

    支持 Markdown 表格、HTML 等格式。

    参数:
        s: 状态信息字符串。
        *extra: 额外的状态参数。

    示例::

        LogStatus("价格: " + str(ticker.Last) + " | 持仓: " + str(pos.Amount))
    """
    ...

def EnableLog(enable: bool) -> None:
    """启用或禁用日志记录。

    参数:
        enable: ``True`` 启用,``False`` 禁用日志记录。

    示例::

        EnableLog(False)  # 禁用日志(减少数据库写入)
        EnableLog(True)   # 重新启用
    """
    ...

def Chart(options: Union[dict, list[dict]]) -> IChart:
    """为策略页面创建自定义图表(基于 Highcharts/Highstock)。

    【首选】支持最全面的图表类型(折线/柱状/散点/面积/K线等)。一般绘图请优先使用 Chart;
    仅当确实需要 Pine 风格 K 线/蜡烛图时才用 KLineChart。

    参数:
        options: Highcharts/Highstock 图表配置对象或配置列表。

    返回:
        IChart 图表对象,用于动态添加数据。

    示例::

        chart = Chart({
            "title": {"text": "Price Trend"},
            "xAxis": {"type": "datetime"},
            "series": [
                {"name": "Price", "type": "line", "data": []},
                {"name": "MA5", "type": "line", "data": []}
            ]
        })
        chart.add(0, [Unix() * 1000, ticker.Last])
        chart.reset()
    """
    ...

def KLineChart(options: Union[dict, list[dict]]) -> IChart:
    """创建 K 线图表(自定义蜡烛图),配置类似 Pine Script。

    【专用】仅用于绘制 K 线/蜡烛图;一般绘图请优先使用 Chart(类型更全面)。

    参数:
        options: K 线图表配置对象。

    返回:
        IChart 图表对象。

    示例::

        chart = KLineChart({"overlay": True})
    """
    ...

def LogReset(remain: Optional[int] = None) -> None:
    """重置所有日志。

    参数:
        remain: 要保留的最近日志数。默认 0(清除所有)。

    示例::

        LogReset()      # 清除所有日志
        LogReset(100)   # 保留最后 100 条
    """
    ...

def LogVacuum() -> None:
    """对策略数据库执行 VACUUM 操作以回收空间。

    在删除大量日志后调用,以减小数据库文件大小。
    """
    ...

T = TypeVar('T')

def _C(func: Callable[..., Optional[T]], *args: object, **kwargs: object) -> T:
    """容错重试函数。自动重试直到返回非 ``None`` 值。

    常用于包装可能因网络问题返回 ``None`` 的 API 调用。

    参数:
        func: 要重试调用的函数。
        *args: 传递给函数的参数。

    返回:
        函数成功返回的非 ``None`` 值。

    示例::

        # 确保获取 Ticker (持续重试直到成功)
        ticker = _C(exchange.GetTicker)
        # 带参数重试
        depth = _C(exchange.GetDepth, "BTC_USDT")
        account = _C(exchange.GetAccount)
    """
    ...
