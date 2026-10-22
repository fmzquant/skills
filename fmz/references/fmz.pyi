from typing import Any, Callable, Generic, Literal, Optional, Sequence, TypedDict, TypeVar, Union, overload
import talib as talib

# Strategy API declarations for Python strategies. Every name below is injected
# into the strategy's globals by the runtime: use it directly, no import needed
# (``talib`` too; ``import talib`` also works). Structures returned by the API
# are dicts with attribute access: ``ticker.Last`` and ``ticker["Last"]`` both work.

_V = TypeVar("_V")

# ==================== K-line Period Constants ====================

PERIOD_M1: int
"""1-minute K-line period (60 seconds)."""

PERIOD_M3: int
"""3-minute K-line period."""

PERIOD_M5: int
"""5-minute K-line period."""

PERIOD_M15: int
"""15-minute K-line period."""

PERIOD_M30: int
"""30-minute K-line period."""

PERIOD_H1: int
"""1-hour K-line period."""

PERIOD_H2: int
"""2-hour K-line period."""

PERIOD_H4: int
"""4-hour K-line period."""

PERIOD_H6: int
"""6-hour K-line period."""

PERIOD_H12: int
"""12-hour K-line period."""

PERIOD_D1: int
"""1-day K-line period."""

PERIOD_D3: int
"""3-day K-line period."""

PERIOD_W1: int
"""1-week K-line period."""

# ==================== Order Status Constants ====================

ORDER_STATE_PENDING: int
"""Order pending (active, not completely filled). Value 0."""

ORDER_STATE_CLOSED: int
"""Order completed (fully filled). Value 1."""

ORDER_STATE_CANCELED: int
"""Order canceled (by the user or the exchange; also expired / rejected). Value 2."""

ORDER_STATE_UNKNOWN: int
"""Order status unknown. Value 3."""

# ==================== Order Type Constants ====================

ORDER_TYPE_BUY: int
"""Buy order. Value 0."""

ORDER_TYPE_SELL: int
"""Sell order. Value 1."""

ORDER_TYPE_NONE: int
"""No direction (``Trade.Type`` of a synthesized trade whose side the exchange did not report). Value 2."""

# ==================== Order Offset Constants (Futures) ====================

ORDER_OFFSET_OPEN: int
"""Opening order (futures). Value 0."""

ORDER_OFFSET_CLOSE: int
"""Closing order (futures). Value 1."""

# ==================== Conditional Order Type Constants ====================

ORDER_CONDITION_TYPE_OCO: int
"""OCO conditional order (One-Cancels-the-Other): take-profit and stop-loss together. Value 0."""

ORDER_CONDITION_TYPE_TP: int
"""Take-profit conditional order. Value 1."""

ORDER_CONDITION_TYPE_SL: int
"""Stop-loss conditional order. Value 2."""

ORDER_CONDITION_TYPE_GENERIC: int
"""Generic conditional order (only appears in query results, e.g. trailing stops). Value 3."""

# ==================== Log Type Constants ====================

LOG_TYPE_BUY: int
"""Buy log type, used with ``exchange.Log()``. Value 0."""

LOG_TYPE_SELL: int
"""Sell log type, used with ``exchange.Log()``. Value 1."""

LOG_TYPE_CANCEL: int
"""Cancel-order log type, used with ``exchange.Log()``. Value 2."""

# ==================== Position Direction Constants (Futures) ====================

PD_LONG: int
"""Long position. Value 0."""

PD_SHORT: int
"""Short position. Value 1."""

PD_LONG_YD: int
"""Yesterday's long position (Chinese futures counters). Value 2."""

PD_SHORT_YD: int
"""Yesterday's short position (Chinese futures counters). Value 3."""

# ==================== JavaScript-style aliases ====================

null: None
"""Alias of ``None`` (kept so code ported from JavaScript runs)."""

true: bool
"""Alias of ``True``."""

false: bool
"""Alias of ``False``."""

NaN: None
"""Alias of ``None``."""

# ==================== Type Aliases ====================

IOrderId = Union[str, int]
"""Order ID. Usually a string ``"<exchange symbol>,<raw order id>"`` (e.g. ``"ETH-USDT,1547130415509278720"``)."""

# ==================== Data Structures ====================

class IOrderCondition(dict[str, Any]):
    """Trigger condition and execution prices of a conditional order (``Order.Condition``; the
    ``condition`` argument of ``exchange.CreateConditionOrder()``).

    Example::

        # Take-profit
        tp = {"ConditionType": ORDER_CONDITION_TYPE_TP, "TpTriggerPrice": 55000, "TpOrderPrice": -1}
        # Stop-loss
        sl = {"ConditionType": ORDER_CONDITION_TYPE_SL, "SlTriggerPrice": 48000, "SlOrderPrice": 47900}
        # OCO (take-profit + stop-loss)
        oco = {"ConditionType": ORDER_CONDITION_TYPE_OCO,
               "TpTriggerPrice": 55000, "TpOrderPrice": 54900,
               "SlTriggerPrice": 48000, "SlOrderPrice": 47900}
    """
    ConditionType: int
    """Condition type: ``ORDER_CONDITION_TYPE_OCO`` (0), ``TP`` (1), ``SL`` (2), ``GENERIC`` (3, query results only)."""
    TpTriggerPrice: float
    """Take-profit trigger price (TP and OCO)."""
    TpOrderPrice: float
    """Take-profit execution price; ``-1`` when placing means market. In query results a market price is usually 0."""
    SlTriggerPrice: float
    """Stop-loss trigger price (SL and OCO)."""
    SlOrderPrice: float
    """Stop-loss execution price; ``-1`` when placing means market. In query results a market price is usually 0."""

class IOrder(dict[str, Any]):
    """Order structure, returned by ``exchange.GetOrder()``, ``exchange.GetOrders()``, ``exchange.GetHistoryOrders()``
    and the conditional-order queries.

    Example::

        order = exchange.GetOrder(order_id)
        if order:
            Log("Price:", order.Price, "Filled:", order.DealAmount, "Status:", order.Status)
    """
    Info: Any
    """Raw exchange response for this order (absent in backtests)."""
    Symbol: str
    """Symbol code, e.g. ``"BTC_USDT"`` (spot), ``"BTC_USDT.swap"`` (futures)."""
    Id: IOrderId
    """Order ID: usually ``"<exchange symbol>,<raw order id>"``, e.g. ``"ETH-USDT,1547130415509278720"``."""
    Time: int
    """Order creation time (millisecond timestamp)."""
    Price: float
    """Order price (may be 0 or -1 for market orders)."""
    Amount: float
    """Order quantity (for a spot market buy it may be the quote amount)."""
    DealAmount: float
    """Filled quantity."""
    AvgPrice: float
    """Average fill price (0 when the exchange does not provide it)."""
    Status: int
    """``ORDER_STATE_PENDING`` (0), ``ORDER_STATE_CLOSED`` (1), ``ORDER_STATE_CANCELED`` (2), ``ORDER_STATE_UNKNOWN`` (3)."""
    Type: int
    """``ORDER_TYPE_BUY`` (0) or ``ORDER_TYPE_SELL`` (1)."""
    Offset: int
    """``ORDER_OFFSET_OPEN`` (0) or ``ORDER_OFFSET_CLOSE`` (1) (futures; spot orders report open)."""
    ContractType: str
    """Contract code of a futures order (e.g. ``"swap"``); ``""`` for spot."""
    Condition: IOrderCondition
    """Conditional orders only: trigger condition and prices. Normal orders have no such key —
    read it with ``order.get("Condition")``."""

class IMarketOrder(dict[str, Any]):
    """One price level of the order book (``Depth.Asks`` / ``Depth.Bids``)."""
    Price: float
    """Price."""
    Amount: float
    """Quantity."""

class IDepth(dict[str, Any]):
    """Order book, returned by ``exchange.GetDepth()``.

    Example::

        depth = exchange.GetDepth()
        if depth:
            Log("Best ask:", depth.Asks[0].Price, "Best bid:", depth.Bids[0].Price)
    """
    Info: Any
    """Raw exchange response (absent in backtests)."""
    Time: int
    """Millisecond timestamp."""
    Asks: list[IMarketOrder]
    """Asks, price ascending (``Asks[0]`` is the best ask)."""
    Bids: list[IMarketOrder]
    """Bids, price descending (``Bids[0]`` is the best bid)."""

class IFunding(dict[str, Any]):
    """Funding rate (perpetual contracts), returned by ``exchange.GetFundings()``.

    Example::

        fundings = exchange.GetFundings("BTC_USDT.swap")
        if fundings:
            Log("Rate:", fundings[0].Rate, "Next settlement:", _D(fundings[0].Time / 1000))
    """
    Info: Any
    """Raw exchange response."""
    Symbol: str
    """Symbol code, e.g. ``"BTC_USDT.swap"``."""
    Interval: int
    """Funding interval in milliseconds (``28800000`` = 8 hours)."""
    Time: int
    """Start of the next period (settlement time of this one), millisecond timestamp."""
    Rate: float
    """Funding rate used at this settlement, e.g. 0.0001 = 0.01%."""

class IPosition(dict[str, Any]):
    """Futures position, returned by ``exchange.GetPositions()``.

    Example::

        positions = exchange.GetPositions("BTC_USDT.swap")
        if positions:
            for pos in positions:
                side = "long" if pos.Type == PD_LONG else "short"
                Log(pos.Symbol, side, "Amount:", pos.Amount, "PnL:", pos.Profit)
    """
    Info: Any
    """Raw exchange response (absent in backtests)."""
    Symbol: str
    """Symbol code, e.g. ``"BTC_USDT.swap"``."""
    MarginLevel: float
    """Leverage."""
    Amount: float
    """Position size (usually contracts)."""
    FrozenAmount: float
    """Frozen size (held by pending close orders)."""
    Price: float
    """Average position price."""
    Profit: float
    """Unrealized PnL, in the margin currency."""
    Type: int
    """``PD_LONG`` (0), ``PD_SHORT`` (1), ``PD_LONG_YD`` (2), ``PD_SHORT_YD`` (3)."""
    ContractType: str
    """Contract code, e.g. ``"swap"``, ``"quarter"``."""
    Margin: float
    """Margin held by the position (0 when not provided)."""

class ITrade(dict[str, Any]):
    """Public trade, returned by ``exchange.GetTrades()``.

    Example::

        trades = exchange.GetTrades()
        if trades:
            Log("Latest trade:", trades[-1].Price, trades[-1].Amount)
    """
    Id: str
    """Trade ID (generated by the platform when the exchange gives none; unique within one result)."""
    Time: int
    """Millisecond timestamp."""
    Price: float
    """Trade price."""
    Amount: float
    """Trade quantity."""
    Type: int
    """Taker side: ``ORDER_TYPE_BUY`` (0), ``ORDER_TYPE_SELL`` (1); ``ORDER_TYPE_NONE`` (2) when unknown."""

class ITicker(dict[str, Any]):
    """Market snapshot, returned by ``exchange.GetTicker()`` / ``exchange.GetTickers()``.

    Example::

        ticker = exchange.GetTicker()
        if ticker:
            Log("Last:", ticker.Last, "Bid:", ticker.Buy, "Ask:", ticker.Sell)
    """
    Info: Any
    """Raw exchange response (absent in backtests)."""
    Symbol: str
    """Symbol code, e.g. ``"BTC_USDT"``, ``"BTC_USDT.swap"``."""
    High: float
    """24h high (0 when not provided)."""
    Low: float
    """24h low (0 when not provided)."""
    Sell: float
    """Best ask (0 when the ticker endpoint has no order book prices)."""
    Buy: float
    """Best bid (0 when not provided)."""
    Last: float
    """Last trade price."""
    Open: float
    """Open of the rolling period (0 when not provided)."""
    Volume: float
    """Recent volume (base currency for spot, contracts for futures, as provided)."""
    Time: int
    """Millisecond timestamp."""
    OpenInterest: float
    """Open interest (0 when not provided)."""

class IAccount(dict[str, Any]):
    """Account balances of the current trading pair / contract, returned by ``exchange.GetAccount()``.

    Example::

        account = exchange.GetAccount()
        if account:
            Log("Quote:", account.Balance, "Frozen:", account.FrozenBalance)
            Log("Base:", account.Stocks, "Frozen:", account.FrozenStocks)
    """
    Info: Any
    """Raw exchange response (absent in backtests)."""
    Balance: float
    """Available quote currency (e.g. USDT for BTC_USDT); for USDT-margined futures, the available margin."""
    FrozenBalance: float
    """Frozen quote currency."""
    Stocks: float
    """Available base currency (e.g. BTC); for coin-margined futures, the available margin (coins)."""
    FrozenStocks: float
    """Frozen base currency."""
    Equity: float
    """Futures only: total margin equity of the current contract setting (0 when not provided)."""
    UPnL: float
    """Futures only: unrealized PnL of all positions of the current contract setting."""

class IAsset(dict[str, Any]):
    """One asset of the account, returned by ``exchange.GetAssets()``.

    Example::

        assets = exchange.GetAssets()
        if assets:
            for a in assets:
                Log(a.Currency, "Available:", a.Amount, "Frozen:", a.FrozenAmount)
    """
    Currency: str
    """Asset name as the exchange calls it (e.g. ``"BTC"``; some exchanges use ``"XBT"``)."""
    Amount: float
    """Available amount."""
    FrozenAmount: float
    """Frozen amount."""

class IRecord(dict[str, Any]):
    """One K-line bar, element of ``exchange.GetRecords()``.

    Example::

        records = exchange.GetRecords(PERIOD_H1)
        if records:
            last = records[-1]
            Log("Open:", last.Open, "High:", last.High, "Low:", last.Low, "Close:", last.Close)
    """
    Time: int
    """Bar start time (millisecond timestamp)."""
    Open: float
    """Open price."""
    High: float
    """High price."""
    Low: float
    """Low price."""
    Close: float
    """Close price."""
    Volume: float
    """Volume."""
    OpenInterest: float
    """Open interest (0 when not provided)."""

class IRecordList(list[IRecord]):
    """K-line list returned by ``exchange.GetRecords()``: a ``list`` of ``IRecord`` plus column accessors.

    ``records.Close`` (any field name) is the list of that field across all bars — a numpy array when
    numpy/TA-Lib is installed — ready for ``talib`` functions. The list itself can be passed to ``TA``.

    Example::

        records = exchange.GetRecords(PERIOD_H1)
        if records:
            closes = records.Close
            rsi = TA.RSI(records, 14)
            macd = talib.MACD(records.Close)
    """
    @property
    def Time(self) -> list[int]:
        """Bar start times."""
        ...
    @property
    def Open(self) -> list[float]:
        """Open prices."""
        ...
    @property
    def High(self) -> list[float]:
        """High prices."""
        ...
    @property
    def Low(self) -> list[float]:
        """Low prices."""
        ...
    @property
    def Close(self) -> list[float]:
        """Close prices."""
        ...
    @property
    def Volume(self) -> list[float]:
        """Volumes."""
        ...
    @property
    def OpenInterest(self) -> list[float]:
        """Open interest values."""
        ...

class IMarket(dict[str, Any]):
    """Market (instrument) information, values of the dict returned by ``exchange.GetMarkets()``.

    Example::

        markets = exchange.GetMarkets()
        if markets:
            m = markets.get("BTC_USDT")
            if m:
                Log("Price precision:", m.PricePrecision, "Min qty:", m.MinQty)
    """
    Symbol: str
    """The exchange's native instrument name, e.g. ``"btcusdt"`` (differs from ``Ticker.Symbol``; the dict key
    is the platform symbol code)."""
    BaseAsset: str
    """Base currency, upper case, e.g. ``"BTC"``."""
    QuoteAsset: str
    """Quote currency, upper case, e.g. ``"USDT"``."""
    TickSize: float
    """Minimum price increment, e.g. 0.01."""
    AmountSize: float
    """Minimum quantity increment, e.g. 0.001."""
    PricePrecision: int
    """Price decimals (may be negative: -1 means rounded to tens)."""
    AmountPrecision: int
    """Quantity decimals (may be negative)."""
    MinQty: float
    """Minimum order quantity."""
    MaxQty: float
    """Maximum order quantity (9007199254740991 when unlimited)."""
    MinNotional: float
    """Minimum order value."""
    MaxNotional: float
    """Maximum order value. The key is absent when the exchange does not provide it."""
    CtVal: float
    """Contract value of one contract, in ``CtValCcy`` (futures). The key is absent when not provided."""
    CtValCcy: str
    """Unit of ``CtVal`` (e.g. ``"BTC"``, ``"USD"``). The key is absent when not provided."""
    Info: Any
    """Raw exchange market data for this instrument."""

class IGo:
    """Concurrent task returned by ``exchange.Go()``.

    Example::

        a = exchange.Go("GetTicker", "BTC_USDT")
        b = exchange.Go("GetDepth")
        ticker, ok = a.wait()
        depth, ok = b.wait()
    """
    def wait(self, timeout: int = 0) -> tuple[Any, bool]:
        """Wait for the task and take its result.

        Args:
            timeout: Milliseconds. Omitted or ``0``: block until done. Positive: wait at most that long; if the
                task has not finished return ``(None, False)`` — ``wait()`` can be called again later.
                Negative (``-1``): do not wait.

        Returns:
            ``(result, True)`` on success (the same value the direct call returns); ``(None, False)`` on failure,
            no data or timeout. Calling ``wait()`` again after the result was taken logs the error
            ``routine N already finished`` and returns ``(None, False)``.
        """
        ...

class IHttpQueryGo(Generic[_V]):
    """Concurrent request returned by ``HttpQuery_Go()``."""
    @overload
    def wait(self) -> _V: ...
    @overload
    def wait(self, timeout: int) -> Optional[_V]:
        """Wait for the request; the result is the same value the synchronous ``HttpQuery()`` returns.

        Args:
            timeout: Milliseconds. Omitted or ``0`` waits until done; ``-1`` does not wait; a positive number
                waits at most that long. Returns ``None`` while unfinished (``wait()`` can be called again).
                Calling ``wait()`` again after the result was taken logs ``routine N already finished`` and
                returns ``None``.
        """
        ...

class IData(dict[str, Any]):
    """Return value of ``exchange.GetData()``."""
    Time: int
    """Timestamp (ms) of the matched row; ``offset`` (or the next row's time) when there is none."""
    Data: Any
    """Data of the matched row; ``None`` when there is no row, the fetch failed or the source is unavailable
    (read the reason with ``GetLastError()``)."""

class IExchange:
    """An exchange account object: the global ``exchange`` (= ``exchanges[0]``) or ``exchanges[i]``.

    Failed exchange calls do not raise: they log an error, return ``None`` (``CancelConditionOrder`` returns
    ``False``) and ``GetLastError()`` returns the reason.

    Example::

        ticker = exchange.GetTicker()
        order_id = exchange.Buy(ticker.Sell, 0.1)
        order = exchange.GetOrder(order_id)
    """
    def Go(self, method: str, *args: Any) -> IGo:
        """Call an exchange method concurrently: returns immediately, take the result with ``wait()``.

        Args:
            method: Method name, e.g. ``"GetTicker"``, ``"GetDepth"``, ``"GetAccount"``, ``"GetRecords"``,
                ``"CreateOrder"``, ``"Buy"``, ``"IO"``.
            *args: The method's arguments, as in a direct call.

        Returns:
            IGo task; ``wait()`` returns ``(result, ok)``. On completion ``EventLoop()`` receives an event whose
            ``Event`` is ``"Exchange_<method>"``.

        Example::

            a = exchange.Go("GetTicker", "BTC_USDT")
            b = exchange.Go("GetAccount")
            ticker, ok1 = a.wait()
            account, ok2 = b.wait()
        """
        ...

    # ---- Market ----

    def GetTicker(self, symbol: str = '') -> Optional[ITicker]:
        """Get the ticker.

        Args:
            symbol: Symbol code, e.g. ``"BTC_USDT"`` (spot), ``"BTC_USDT.swap"`` (futures). Omitted: the current
                trading pair / contract.

        Returns:
            ``ITicker``, ``None`` on failure.

        Example::

            ticker = exchange.GetTicker("BTC_USDT")
            if ticker:
                Log("BTC:", ticker.Last)
        """
        ...

    def GetTickers(self) -> Optional[list[ITicker]]:
        """Get the tickers of every symbol of the exchange (spot: all pairs; futures: all contracts).

        Returns:
            ``ITicker`` list, ``None`` on failure or when the exchange has no aggregated ticker endpoint.

        Example::

            tickers = exchange.GetTickers()
            if tickers:
                Log("Symbols:", len(tickers))
        """
        ...

    def GetDepth(self, symbol: str = '') -> Optional[IDepth]:
        """Get the order book. Asks ascending, bids descending.

        Args:
            symbol: Symbol code; omitted: the current trading pair / contract.

        Returns:
            ``IDepth``, ``None`` on failure.

        Example::

            depth = exchange.GetDepth()
            if depth:
                Log("Best ask:", depth.Asks[0].Price, "Best bid:", depth.Bids[0].Price)
        """
        ...

    def GetTrades(self, symbol: str = '') -> Optional[list[ITrade]]:
        """Get recent public trades (ascending by time).

        Args:
            symbol: Symbol code; omitted: the current trading pair / contract.

        Returns:
            ``ITrade`` list, ``None`` on failure.
        """
        ...

    def GetRecords(self, symbol: Union[str, int] = '', period: int = -1, limit: int = 0) -> Optional[IRecordList]:
        """Get K-lines (ascending by time).

        Call forms: ``GetRecords()``, ``GetRecords(symbol)``, ``GetRecords(symbol, period)``,
        ``GetRecords(symbol, period, limit)``, ``GetRecords(period)``, ``GetRecords(period, limit)``.

        Args:
            symbol: Symbol code; omitted: the current trading pair / contract. An int here is the period.
            period: Bar period in seconds, e.g. ``PERIOD_M1``, ``PERIOD_H1``; omitted: the robot's default period.
            limit: Number of bars; omitted: the length set by ``SetMaxBarLen()`` (200 by default).

        Returns:
            ``IRecordList``, ``None`` on failure.

        Example::

            records = exchange.GetRecords(PERIOD_H1)
            records = exchange.GetRecords("ETH_USDT", PERIOD_M5, 100)
            if records:
                dif, dea, hist = TA.MACD(records)
        """
        ...

    def GetMarkets(self) -> Optional[dict[str, IMarket]]:
        """Get market information of the exchange's instruments.

        Returns:
            Dict keyed by symbol code (e.g. ``"BTC_USDT"``, ``"BTC_USDT.swap"``), ``None`` on failure or when
            not supported.

        Example::

            markets = exchange.GetMarkets()
            if markets:
                m = markets.get("BTC_USDT")
                if m:
                    Log("Min qty:", m.MinQty, "Price precision:", m.PricePrecision)
        """
        ...

    def GetRawJSON(self) -> str:
        """Raw response of the most recent REST call of this exchange object (including ``IO("api", ...)``);
        the error string when that call failed, ``""`` before any call.

        Example::

            exchange.GetTicker()
            Log(exchange.GetRawJSON())
        """
        ...

    def SetData(self, key: str, value: Any) -> int:
        """Load a data set that ``exchange.GetData()`` reads.

        Args:
            key: Data set name.
            value: ``[[timestamp, data], ...]`` (or its JSON string), or ``{"schema": [...], "data": [...]}``.

        Returns:
            Length of the JSON-encoded data; ``0`` (with ``GetLastError()`` set) when the format is wrong.

        Example::

            exchange.SetData("test", [[1579536000000, 123], [1579622400000, 456]])
        """
        ...

    def GetData(self, key: str, timeout: int = 60000, offset: int = 0) -> IData:
        """Read a data set loaded by ``exchange.SetData()`` or served by an http(s) URL.

        The URL must return ``[[time, data], ...]`` or ``{"schema": [...], "data": [...]}``; it is cached for
        ``timeout`` ms and fetched again when expired. Data loaded by ``SetData()`` never expires.

        Args:
            key: Data set name or http(s) URL.
            timeout: Cache timeout in ms (60000 when omitted, minimum 5000).
            offset: Millisecond timestamp: take the last row with ``time <= offset``; omitted: now (only rows
                that have already "arrived").

        Returns:
            Always an ``IData`` ``{Time, Data}``; ``Data`` is ``None`` when there is no row or the fetch failed
            (``GetLastError()`` has the reason).

        Example::

            d = exchange.GetData("https://www.example.com/data.json")
            if d.Data is None:
                Log("no data:", GetLastError())
        """
        ...

    # ---- Account ----

    def GetAccount(self) -> Optional[IAccount]:
        """Get the balances of the current trading pair / contract.

        Returns:
            ``IAccount``, ``None`` on failure.

        Example::

            account = exchange.GetAccount()
            if account:
                Log("Balance:", account.Balance, "Stocks:", account.Stocks)
        """
        ...

    def GetAssets(self) -> Optional[list[IAsset]]:
        """Get every asset of the account.

        Returns:
            ``IAsset`` list, ``None`` on failure.

        Example::

            assets = exchange.GetAssets()
            if assets:
                for a in assets:
                    Log(a.Currency, a.Amount, a.FrozenAmount)
        """
        ...

    # ---- Trading ----

    def Buy(self, price: float, amount: float = ..., *args: Any) -> Optional[IOrderId]:
        """Place a buy order on the current trading pair / contract (futures: direction set by ``SetDirection()``).

        Args:
            price: Price; ``-1`` = market order. ``Buy(amount)`` with a single argument is also a market order.
            amount: Quantity (spot market buy: usually the quote amount; futures: contracts).
            *args: Extra values printed in the order log; a trailing dict is not logged but used as order options
                (e.g. ``{"type": "post_only"}``).

        Returns:
            Order ID, ``None`` on failure.

        Example::

            oid = exchange.Buy(50000, 0.01, "limit buy")
            oid = exchange.Buy(-1, 100)  # market buy for 100 USDT
        """
        ...

    def Sell(self, price: float, amount: float = ..., *args: Any) -> Optional[IOrderId]:
        """Place a sell order on the current trading pair / contract (futures: direction set by ``SetDirection()``).

        Args:
            price: Price; ``-1`` = market order. ``Sell(amount)`` with a single argument is also a market order.
            amount: Quantity.
            *args: Extra values printed in the order log; a trailing dict is used as order options.

        Returns:
            Order ID, ``None`` on failure.

        Example::

            oid = exchange.Sell(51000, 0.01)
            oid = exchange.Sell(-1, 0.01)  # market sell
        """
        ...

    def CreateOrder(self, symbol: str, side: str, price: float, amount: float, *args: Any) -> Optional[IOrderId]:
        """Place an order on any symbol with an explicit side (no ``SetCurrency()`` / ``SetDirection()`` needed).

        Args:
            symbol: Symbol code, e.g. ``"BTC_USDT"`` or ``"BTC_USDT.swap"``; ``""`` = the current one.
            side: Spot ``"buy"`` / ``"sell"``; futures ``"buy"`` (open long), ``"sell"`` (open short),
                ``"closebuy"`` (close long), ``"closesell"`` (close short).
            price: Price; ``-1`` = market order.
            amount: Quantity (spot market buy: usually the quote amount; futures: contracts).
            *args: Extra values printed in the order log; a trailing dict is used as order options
                (``type``, ``tif``, ``postOnly``, ``reduceOnly``, ``clientId``, ...).

        Returns:
            Order ID, ``None`` on failure.

        Example::

            exchange.CreateOrder("ETH_USDT", "buy", -1, 100)
            exchange.CreateOrder("BTC_USDT.swap", "buy", 50000, 1)
            exchange.CreateOrder("BTC_USDT.swap", "closebuy", -1, 1)
        """
        ...

    def ModifyOrder(self, orderId: Optional[IOrderId], side: str, price: float, amount: float, *args: Any) -> Optional[IOrderId]:
        """Modify the price and/or quantity of an open order.

        Args:
            orderId: ID of the order to modify.
            side: Side, as in ``CreateOrder()``.
            price: New price; ``<= 0`` (e.g. ``-1``) keeps the price.
            amount: New quantity; ``<= 0`` keeps the quantity (price and quantity cannot both be kept).
            *args: A dict of exchange-specific options.

        Returns:
            The (possibly new) order ID, ``None`` on failure.
        """
        ...

    def CancelOrder(self, orderId: Optional[IOrderId], *args: Any) -> Optional[bool]:
        """Cancel an order.

        Args:
            orderId: Order ID.
            *args: Extra values printed in the cancel log.

        Returns:
            ``True`` when the request was sent; ``False`` when the order could not be canceled (already filled /
            final, reason in ``GetLastError()``); ``None`` when the request failed. Check the result with
            ``GetOrder()``.

        Example::

            oid = exchange.Buy(50000, 0.01)
            if oid:
                exchange.CancelOrder(oid, "cancel test order")
        """
        ...

    def GetOrder(self, orderId: Optional[IOrderId]) -> Optional[IOrder]:
        """Get an order by ID.

        Returns:
            ``IOrder``, ``None`` on failure.

        Example::

            order = exchange.GetOrder(order_id)
            if order:
                Log("Status:", order.Status, "Filled:", order.DealAmount)
        """
        ...

    def GetOrders(self, symbol: str = '') -> Optional[list[IOrder]]:
        """Get open orders.

        Args:
            symbol: Symbol code (``"BTC_USDT.swap"``) or range (``"USDT.swap"``). Omitted or ``""``: spot = all
                symbols; futures = the current quote currency and contract family (e.g. ``"USDT.swap"``).

        Returns:
            ``IOrder`` list (``[]`` = none), ``None`` on failure.

        Example::

            orders = exchange.GetOrders()
            if orders is not None:
                Log("Open orders:", len(orders))
        """
        ...

    def GetHistoryOrders(self, symbol: Union[str, int] = '', since: int = 0, limit: int = 0) -> Optional[list[IOrder]]:
        """Get finished (filled / canceled) orders.

        Call forms: ``()``, ``(symbol)``, ``(symbol, since)``, ``(symbol, since, limit)``, ``(since)``,
        ``(since, limit)``.

        Args:
            symbol: Symbol code; omitted: the current one.
            since: Start time (millisecond timestamp).
            limit: Maximum number of orders.

        Returns:
            ``IOrder`` list, ``None`` on failure.
        """
        ...

    def CreateConditionOrder(self, symbol: str, side: str, amount: float, condition: dict[str, Any], *args: Any) -> Optional[IOrderId]:
        """Create a conditional order (take-profit / stop-loss / OCO).

        Args:
            symbol: Symbol code; ``""`` = the current one.
            side: ``"buy"``, ``"sell"``, ``"closebuy"``, ``"closesell"``.
            amount: Quantity (futures: contracts).
            condition: ``IOrderCondition`` dict.
            *args: Extra values printed in the log; a dict is passed to the exchange unchanged.

        Returns:
            Conditional order ID, ``None`` on failure.

        Example::

            exchange.CreateConditionOrder("BTC_USDT.swap", "closebuy", 1, {
                "ConditionType": ORDER_CONDITION_TYPE_TP,
                "TpTriggerPrice": 55000,
                "TpOrderPrice": -1
            })
        """
        ...

    def ModifyConditionOrder(self, orderId: Optional[IOrderId], side: str, amount: float, condition: dict[str, Any], *args: Any) -> Optional[IOrderId]:
        """Modify a conditional order.

        Args:
            orderId: Conditional order ID.
            side: Side.
            amount: New quantity (must be > 0).
            condition: New ``IOrderCondition`` dict.
            *args: A dict of exchange-specific options.

        Returns:
            The (possibly new) conditional order ID, ``None`` on failure.
        """
        ...

    def CancelConditionOrder(self, orderId: Optional[IOrderId], *args: Any) -> bool:
        """Cancel a conditional order.

        Returns:
            ``True`` when the request was sent, ``False`` otherwise.
        """
        ...

    def GetConditionOrder(self, orderId: Optional[IOrderId]) -> Optional[IOrder]:
        """Get a conditional order by ID (``Order.Condition`` holds the condition).

        Returns:
            ``IOrder``, ``None`` on failure.
        """
        ...

    def GetConditionOrders(self, symbol: str = '') -> Optional[list[IOrder]]:
        """Get pending (untriggered) conditional orders. ``symbol`` default as ``GetOrders()``.

        Returns:
            ``IOrder`` list, ``None`` on failure.
        """
        ...

    def GetHistoryConditionOrders(self, symbol: Union[str, int] = '', since: int = 0, limit: int = 0) -> Optional[list[IOrder]]:
        """Get finished conditional orders. Call forms as ``GetHistoryOrders()``.

        Returns:
            ``IOrder`` list, ``None`` on failure.
        """
        ...

    def Log(self, orderType: int, price: Union[float, IOrderId], amount: float = 0, *args: Any) -> Optional[Union[str, bool]]:
        """Write a trade log entry without placing an order.

        Args:
            orderType: ``LOG_TYPE_BUY``, ``LOG_TYPE_SELL`` or ``LOG_TYPE_CANCEL``.
            price: Price shown in the log (the order ID for ``LOG_TYPE_CANCEL``).
            amount: Quantity shown in the log.
            *args: Extra values appended to the log.

        Returns:
            Buy / sell: a virtual order ID (``"V"`` + digits); cancel: ``True``.

        Example::

            exchange.Log(LOG_TYPE_BUY, 50000, 0.1, "signal")
            exchange.Log(LOG_TYPE_CANCEL, "123")
        """
        ...

    # ---- Futures ----

    def GetPositions(self, symbol: str = '') -> Optional[list[IPosition]]:
        """Get futures positions.

        Args:
            symbol: Symbol code (``"BTC_USDT.swap"``) or range (``"USDT.swap"``). Omitted or ``""``: the current
                quote currency and contract family (e.g. ``"USDT.swap"``).

        Returns:
            ``IPosition`` list (``[]`` = no positions), ``None`` on failure.

        Example::

            positions = exchange.GetPositions("BTC_USDT.swap")
            if positions:
                Log("Amount:", positions[0].Amount, "Type:", positions[0].Type)
        """
        ...

    def GetPosition(self, symbol: str = '') -> Optional[list[IPosition]]:
        """Legacy alias of ``GetPositions()``."""
        ...

    def SetContractType(self, symbol: str, *args: Any) -> Optional[dict[str, Any]]:
        """Set the current contract (futures). Spot exchange objects do not support it.

        Args:
            symbol: Contract code, e.g. ``"swap"`` (perpetual), ``"quarter"``, ``"next_quarter"``, ``"this_week"``,
                ``"next_week"``, a native contract code, or ``"BTC_USDT.swap"`` to switch pair and contract at once.

        Returns:
            The exchange contract, e.g. ``{"InstrumentID": "BTCUSD_230630", "instrument": "BTCUSD_230630"}``;
            ``None`` on failure (the current contract is unchanged).

        Example::

            exchange.SetContractType("swap")
            exchange.SetContractType("quarter")
        """
        ...

    def GetContractType(self) -> str:
        """The current contract code, e.g. ``"swap"``, ``"quarter"`` (``""`` for spot)."""
        ...

    def SetMarginLevel(self, symbol: Union[str, float], marginLevel: float = ...) -> Any:
        """Set leverage (futures).

        Call forms: ``SetMarginLevel(marginLevel)`` (current contract) and ``SetMarginLevel(symbol, marginLevel)``.

        Example::

            exchange.SetMarginLevel(10)
            exchange.SetMarginLevel("BTC_USDT.swap", 20)
        """
        ...

    def SetDirection(self, direction: str, hedgeFlag: str = ...) -> None:
        """Set the direction of the next ``Buy()`` / ``Sell()`` (futures). Prefer ``CreateOrder()``, which takes the
        side directly.

        Args:
            direction: ``"buy"`` (open long, use ``Buy``), ``"sell"`` (open short, use ``Sell``),
                ``"closebuy"`` (close long, use ``Sell``), ``"closesell"`` (close short, use ``Buy``).
                Chinese futures counters also take ``"closebuy_today"`` / ``"closesell_today"``.
            hedgeFlag: Chinese futures counters: speculation / arbitrage / hedge flag.

        Example::

            exchange.SetDirection("buy")
            exchange.Buy(50000, 1)
            exchange.SetDirection("closebuy")
            exchange.Sell(51000, 1)
        """
        ...

    def GetFundings(self, symbol: str = '') -> Optional[list[IFunding]]:
        """Get funding rates (perpetual contracts).

        Args:
            symbol: Symbol code (``"BTC_USDT.swap"``) or range (``"USDT.swap"``); omitted: the current quote
                currency and contract family.

        Returns:
            ``IFunding`` list, ``None`` on failure.
        """
        ...

    # ---- Exchange settings ----

    def GetName(self) -> str:
        """Exchange name, e.g. ``"Binance"``, ``"Futures_OKX"``."""
        ...

    def GetLabel(self) -> str:
        """The label given to this exchange object when it was configured."""
        ...

    def SetLabel(self, label: str) -> None:
        """Change the label of this exchange object (this run only; empty string ignored)."""
        ...

    def GetIndex(self) -> int:
        """Index of this exchange object in ``exchanges`` (``exchange`` is 0); the same index as ``ev.ex`` of
        ``ctx.poll()`` events."""
        ...

    def GetCurrency(self) -> str:
        """The current trading pair, e.g. ``"BTC_USDT"`` (without the contract part)."""
        ...

    def SetCurrency(self, currency: str) -> bool:
        """Switch the trading pair (``"ETH_USDT"``; ``"ETH_USDT.swap"`` also sets the contract).

        Returns:
            ``True``. An invalid pair logs an error and leaves the pair unchanged.

        Example::

            exchange.SetCurrency("ETH_USDT")
            Log(exchange.GetTicker())
        """
        ...

    def GetBaseCurrency(self) -> str:
        """Base currency of the current pair, e.g. ``"BTC"``."""
        ...

    def GetQuoteCurrency(self) -> str:
        """Quote currency of the current pair, e.g. ``"USDT"``."""
        ...

    def GetPeriod(self) -> int:
        """The robot's default K-line period, in seconds."""
        ...

    def SetMaxBarLen(self, n: int) -> None:
        """Set the default number of bars ``GetRecords()`` requests and keeps (200 by default)."""
        ...

    def SetPrecision(self, pricePrecision: Optional[int] = None, amountPrecision: Optional[int] = None) -> None:
        """Set price / quantity decimals: order prices and quantities are truncated (not rounded) to them.

        Example::

            exchange.SetPrecision(2, 3)
        """
        ...

    def SetRate(self, rate: float = 1) -> float:
        """Set a conversion rate: prices returned afterwards are multiplied by it, order prices divided by it.

        Args:
            rate: Rate; ``1``, omitted or ``<= 0`` = no conversion.

        Returns:
            The rate in effect before this call.
        """
        ...

    def GetRate(self) -> float:
        """The conversion rate set by ``SetRate()`` (``1`` by default)."""
        ...

    def SetTimeout(self, timeout: int) -> int:
        """Set the timeout of this object's REST requests, in milliseconds."""
        ...

    def SetProxy(self, proxy: str) -> Optional[bool]:
        """Set a proxy for this exchange object's requests.

        Args:
            proxy: ``"socks5://[user:pass@]host:port"``, ``"http://host:port"``; ``""`` removes the proxy.

        Returns:
            ``True`` on success, ``None`` when the proxy is invalid.
        """
        ...

    def SetBase(self, base: str) -> str:
        """Switch the API base address (e.g. to a testnet).

        Returns:
            The base address before the switch; ``""`` when the exchange rejected the new one.
        """
        ...

    def GetBase(self) -> str:
        """The current API base address."""
        ...

    def IO(self, k: str, *args: Any) -> Any:
        """Exchange-specific calls and settings.

        Common forms:

        - ``IO("api", httpMethod, resource, params="", raw="")``: call a raw exchange endpoint (live only).
        - ``IO("currency", "ETH_USDT")``: same as ``SetCurrency()``.
        - ``IO("base")`` / ``IO("base", url)``: read / switch the base address.
        - ``IO("cross", True)``, ``IO("dual", True)``, ``IO("simulate", True)``: account modes (see each exchange).
        - ``IO("rate", "GetTicker", 10, "1s")``: client-side rate limits.

        Returns:
            Depends on the command; ``None`` on failure (reason in ``GetLastError()``).

        Example::

            ret = exchange.IO("api", "GET", "/api/v5/account/balance")
        """
        ...

    def Encode(self, algo: str, inputFormat: str, outputFormat: str, data: str, keyFormat: str = ..., key: str = ...) -> str:
        """Like the global ``Encode()``, but ``data`` / ``key`` may use ``"{{accesskey}}"`` / ``"{{secretkey}}"``,
        replaced by this exchange object's configured keys (live only).

        Example::

            sign = exchange.Encode("sha256", "string", "hex", "data", "string", "{{secretkey}}")
        """
        ...

    def HMAC(self, algo: str, outputFormat: str, data: str, key: str = ...) -> str:
        """HMAC signature: ``exchange.Encode(algo, "raw", outputFormat, data, "raw", key)``; ``key`` may be
        ``"{{secretkey}}"``."""
        ...

    def GetMeta(self, key: str) -> str:
        """A non-sensitive configuration field of this exchange object (e.g. ``"AccessKey"``), matched
        case-insensitively; ``""`` when absent or sensitive (secrets are never returned)."""
        ...

    def G(self, *args: Any) -> Any:
        """In-memory key/value store private to this exchange object (not persisted; unrelated to ``_G``).

        ``G()`` returns the index, ``G(None)`` clears, ``G(k)`` reads, ``G(k, None)`` deletes, ``G(k, v)`` writes.
        """
        ...

    def GetUSDCNY(self) -> Optional[float]:
        """Legacy: USD/CNY rate. Not available on this runtime: returns ``None`` (fetch rates with ``HttpQuery()``)."""
        ...

# ==================== TA Input Type ====================

t_TAInput = Union[Sequence[float], Sequence[IRecord]]
"""Input of the ``TA`` functions: a K-line list (``Close`` is used) or a list of numbers."""

# ==================== Built-in TA Indicator Library ====================

class ITA:
    """The platform's built-in indicator library (global ``TA``), computed locally.

    Results are lists aligned with the input; the warm-up part is ``None``.

    Example::

        records = exchange.GetRecords()
        k, d, j = TA.KDJ(records, 9, 3, 3)
        up, mid, down = TA.BOLL(records, 20, 2)
    """
    def MA(self, inReal: t_TAInput, optInTimePeriod: int = 9) -> list[float]:
        """Moving average (simple). ``optInTimePeriod`` defaults to 9."""
        ...

    def SMA(self, inReal: t_TAInput, optInTimePeriod: int = 9) -> list[float]:
        """Simple moving average. ``optInTimePeriod`` defaults to 9."""
        ...

    def EMA(self, inReal: t_TAInput, optInTimePeriod: int = 9) -> list[float]:
        """Exponential moving average. ``optInTimePeriod`` defaults to 9."""
        ...

    def MACD(self, inReal: t_TAInput, optInFastPeriod: int = 12, optInSlowPeriod: int = 26, optInSignalPeriod: int = 9) -> tuple[list[float], list[float], list[float]]:
        """MACD (defaults 12, 26, 9).

        Returns:
            ``[DIF, DEA, MACD histogram]``.

        Example::

            dif, dea, hist = TA.MACD(records)
        """
        ...

    def BOLL(self, inReal: t_TAInput, period: int = 20, multiplier: float = 2) -> tuple[list[float], list[float], list[float]]:
        """Bollinger bands (defaults 20, 2).

        Returns:
            ``[upper, middle, lower]``.
        """
        ...

    def KDJ(self, inPriceHLC: Sequence[IRecord], period: int = 9, kPeriod: int = 3, dPeriod: int = 3) -> tuple[list[float], list[float], list[float]]:
        """KDJ stochastic (defaults 9, 3, 3); K-lines only.

        Returns:
            ``[K, D, J]``.
        """
        ...

    def RSI(self, inReal: t_TAInput, optInTimePeriod: int = 14) -> list[float]:
        """Relative strength index (default 14).

        Example::

            rsi = TA.RSI(records, 14)
            if rsi[-1] > 70:
                Log("overbought")
        """
        ...

    def ATR(self, inPriceHLC: Sequence[IRecord], optInTimePeriod: int = 14) -> list[float]:
        """Average true range (default 14); K-lines only."""
        ...

    def OBV(self, inReal: Sequence[IRecord]) -> list[float]:
        """On-balance volume; K-lines only (uses Close and Volume)."""
        ...

    def Highest(self, inReal: t_TAInput, period: int, attr: Optional[str] = None) -> float:
        """Highest value of the last ``period`` bars, the current bar excluded (``period`` 0 = all bars).

        Args:
            inReal: K-lines or numbers.
            period: Number of bars.
            attr: Field for K-lines: ``"High"``, ``"Low"``, ``"Open"``, ``"Close"``, ``"Volume"``, ``"OpenInterest"``.

        Example::

            hh = TA.Highest(records, 20, "High")
        """
        ...

    def Lowest(self, inReal: t_TAInput, period: int, attr: Optional[str] = None) -> float:
        """Lowest value of the last ``period`` bars, the current bar excluded (``period`` 0 = all bars).

        Example::

            ll = TA.Lowest(records, 20, "Low")
        """
        ...

    def Alligator(self, inPriceHL: Sequence[IRecord], jawLength: int = 13, teethLength: int = 8, lipsLength: int = 5) -> tuple[list[float], list[float], list[float]]:
        """Williams Alligator (defaults 13, 8, 5) on the median price; K-lines only.

        Returns:
            ``[jaw, teeth, lips]``, shifted right by 8, 5 and 3 bars.
        """
        ...

    def CMF(self, inReal: Sequence[IRecord], periods: int = 20) -> list[float]:
        """Chaikin money flow (default 20); K-lines only."""
        ...

# ==================== Database / Network ====================

class IDBExecRet(dict[str, Any]):
    """Result of ``DBExec()`` and ``IDial.exec()``."""
    columns: list[str]
    """Column names."""
    values: list[list[Any]]
    """Rows, each a list matching ``columns``."""

class IDial:
    """Connection returned by ``Dial()``: TCP / TLS / WebSocket stream or database connection.

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
        """Read one message.

        Args:
            timeout: Milliseconds. Omitted / 0: block until data arrives; positive: wait at most that long.
                WebSocket only: ``-1`` returns at once (``None`` when nothing is buffered), ``-2`` returns only the
                latest buffered message.

        Returns:
            The data; ``None`` on timeout or when the connection is closed.
        """
        ...

    def write(self, data: str, timeout: int = 0) -> int:
        """Send data. Returns the number of bytes sent; ``0`` when the connection is closed."""
        ...

    def exec(self, sql: str, *args: Any) -> Optional[IDBExecRet]:
        """Database connections only: execute SQL (``?`` placeholders take ``args``), same result as ``DBExec()``."""
        ...

    def close(self) -> None:
        """Close the connection (also closed when the object is garbage collected)."""
        ...

class IEventMsg(dict[str, Any]):
    """Event returned by ``EventLoop()``.

    ``Event`` is e.g. ``"tick"`` / ``"order"`` (push-only futures counters), ``"Exchange_GetTicker"`` (an
    ``exchange.Go()`` task finished; ``Index`` = its ticket) or ``"HttpQuery"`` (an ``HttpQuery_Go()`` finished).
    """
    Seq: int
    """Sequence number."""
    Event: str
    """Event name."""
    ThreadId: int
    """Thread ID (0)."""
    Index: int
    """Exchange index for tick / order events; the task ticket for completion events."""
    Queue: int
    """Events still waiting in the queue after this one."""
    Dropped: int
    """Events dropped so far because the queue was full."""
    Nano: int
    """Nanosecond timestamp."""
    Symbol: str
    """Symbol of a tick event."""
    Ticker: ITicker
    """Tick events: the ticker."""
    Order: IOrder
    """Order events: the order."""

class IChart:
    """Chart returned by ``Chart()``.

    Example::

        chart = Chart({"title": {"text": "Price"}, "xAxis": {"type": "datetime"},
                       "series": [{"name": "Last", "data": []}]})
        chart.add(0, [Unix() * 1000, ticker.Last])
    """
    def add(self, series: Union[int, list[Any]], data: Any = ..., index: int = ...) -> None:
        """Write data: ``add(seriesIndex, [x, y])`` appends a point; ``add(seriesIndex, [x, y], -1)`` replaces the
        last point (another index replaces that point)."""
        ...

    def update(self, options: Union[dict[str, Any], list[dict[str, Any]]]) -> None:
        """Replace the chart configuration (same argument as ``Chart()``)."""
        ...

    def reset(self, remain: int = 0) -> None:
        """Clear the data, keeping the last ``remain`` points (0 = clear all)."""
        ...

    def dell(self, seriesIdx: int = 0) -> None:
        """Delete a series; ``<= 0`` deletes the whole chart (configuration included). (JavaScript's ``del``.)"""
        ...

class IKLineChart:
    """Pine-style K-line chart returned by ``KLineChart()``.

    Per bar: ``begin(bar)``, the drawing calls, then ``close()``.

    Example::

        c = KLineChart({"overlay": True})
        for bar in exchange.GetRecords():
            c.begin(bar)
            c.plot(bar.Close, "Close")
            c.close()
    """
    def begin(self, bar: IRecord) -> None:
        """Start drawing on a bar."""
        ...

    def close(self, bar: Optional[IRecord] = None) -> None:
        """Finish the bar and output it (passing ``bar`` is the same as ``begin(bar)`` first). Closing a bar with the
        same time again replaces it."""
        ...

    def reset(self, remain: int = 0) -> None:
        """Clear the chart, keeping the last ``remain`` bars."""
        ...

    def plot(self, series: Optional[float] = None, title: Optional[str] = None, color: Optional[str] = None, linewidth: int = 1, style: str = "line",
             trackprice: Optional[bool] = None, histbase: float = 0, offset: int = 0, join: bool = False, editable: bool = False,
             show_last: Optional[int] = None, display: str = "all", overlay: Optional[bool] = None) -> int:
        """Draw a line; returns its index (for ``fill()``). ``style``: ``"line"``, ``"stepline"``, ``"histogram"``,
        ``"cross"``, ``"area"``, ``"columns"``, ``"circles"``, ..."""
        ...

    def hline(self, price: float, title: Optional[str] = None, color: Optional[str] = None, linestyle: str = "dashed", linewidth: Optional[int] = None,
              editable: bool = False, display: str = "all", overlay: Optional[bool] = None) -> int:
        """Draw a horizontal line; returns its index. ``linestyle``: ``"dashed"``, ``"dotted"``, ``"solid"``."""
        ...

    def plotarrow(self, series: Optional[float], title: Optional[str] = None, colorup: str = "#00ff00", colordown: str = "#ff0000", offset: int = 0,
                  minheight: int = 5, maxheight: int = 100, editable: bool = False, show_last: Optional[int] = None,
                  display: str = "all", overlay: Optional[bool] = None) -> None:
        """Draw an up (positive) / down (negative) arrow."""
        ...

    def plotshape(self, series: Any, title: Optional[str] = None, style: Optional[str] = None, location: str = "abovebar", color: Optional[str] = None,
                  offset: Optional[int] = None, text: Optional[str] = None, textcolor: Optional[str] = None, editable: Optional[bool] = None,
                  size: str = "auto", show_last: Optional[int] = None, display: str = "all", overlay: Optional[bool] = None) -> None:
        """Draw a shape where ``series`` is truthy. ``style``: ``"diamond"``, ``"square"``, ``"label_down"``,
        ``"label_up"``, ``"arrow_down"``, ``"arrow_up"``, ``"circle"``, ``"flag"``, ``"triangle_down"``,
        ``"triangle_up"``, ``"cross"``, ``"xcross"``; ``location``: ``"abovebar"``, ``"belowbar"``, ``"top"``,
        ``"bottom"``, ``"absolute"``."""
        ...

    def plotchar(self, series: Any, title: Optional[str] = None, char: Optional[str] = None, location: str = "abovebar", color: Optional[str] = None,
                 offset: Optional[int] = None, text: Optional[str] = None, textcolor: Optional[str] = None, editable: Optional[bool] = None,
                 size: str = "auto", show_last: Optional[int] = None, display: str = "all", overlay: Optional[bool] = None) -> None:
        """Draw a character (``char`` is required) where ``series`` is truthy."""
        ...

    def plotcandle(self, open: float, high: float, low: float, close: float, title: Optional[str] = None, color: Optional[str] = None,
                   wickcolor: Optional[str] = None, editable: Optional[bool] = None, show_last: Optional[int] = None,
                   bordercolor: Optional[str] = None, display: str = "all", overlay: Optional[bool] = None) -> None:
        """Draw an extra candle."""
        ...

    def barcolor(self, color: str, offset: Optional[int] = None, editable: bool = False, show_last: Optional[int] = None,
                 title: Optional[str] = None, display: str = "all") -> None:
        """Color the current bar."""
        ...

    def bgcolor(self, color: str, offset: Optional[int] = None, editable: Optional[bool] = None, show_last: Optional[int] = None,
                title: Optional[str] = None, display: str = "all", overlay: Optional[bool] = None) -> None:
        """Color the background of the current bar."""
        ...

    def fill(self, plot1: int, plot2: int, color: Optional[str] = None, title: Optional[str] = None, editable: Optional[bool] = None,
             show_last: Optional[int] = None, fillgaps: Optional[bool] = None, display: str = "all") -> None:
        """Fill between two plots (indices returned by ``plot()`` / ``hline()``)."""
        ...

    def signal(self, direction: str, price: float, qty: float, id: Optional[str] = None) -> None:
        """Draw a trade signal. ``direction``: ``"buy"``/``"long"``, ``"sell"``/``"short"``, ``"closebuy"``/``"closelong"``,
        ``"closesell"``/``"closeshort"``; ``id`` defaults to ``direction``."""
        ...

class IHttpOptions(TypedDict, total=False):
    """Options of ``HttpQuery()`` (all optional)."""
    method: str
    """``"GET"`` (default), ``"POST"``, ``"PUT"``, ``"DELETE"``, ..."""
    body: str
    """Request body."""
    data: str
    """Request body when ``body`` is not set."""
    headers: dict[str, Any]
    """Request headers."""
    cookie: str
    """Cookie string."""
    timeout: int
    """Timeout in milliseconds (300000 by default)."""
    proxy: str
    """Proxy for this request: ``http://``, ``https://``, ``socks5://``, ``socks5h://``."""
    charset: str
    """Decode the response body from this charset (e.g. ``"GBK"``) to UTF-8."""
    debug: bool
    """``True``: return the full ``IHttpRet`` instead of the body."""

class _HttpDebugOptions(IHttpOptions):
    debug: Literal[True]

class IHttpRet(dict[str, Any]):
    """Full response of ``HttpQuery()`` (option ``debug: True``)."""
    StatusCode: int
    """HTTP status; 0 when no response was received (refused, DNS, timeout, proxy failure)."""
    Header: dict[str, list[str]]
    """Response headers; each value is a list of strings."""
    Cookies: list[dict[str, Any]]
    """Parsed ``Set-Cookie`` entries (``Name``, ``Value``, ``Path``, ``Domain``, ``Expires``, ...)."""
    Trace: dict[str, Any]
    """Timings (``elapsed_ms``, ``dns_ms``, ``connect_ms``, ``tls_ms``, ``ttfb_ms``, ...)."""
    Length: int
    """Body length (before charset decoding)."""
    Body: str
    """Body; ``""`` when the request failed."""
    Error: str
    """Failure reason (method + URL + error); present only when ``StatusCode`` is 0."""

# ==================== WebSocket push (ctx) ====================

class StopError(RuntimeError):
    """Raised by ``Sleep()``, ``EventLoop()``, ``ctx.poll()`` and API calls once the robot is stopping; let it
    propagate so ``onexit()`` runs."""
    message: str

class CtxRecord(dict[str, Any]):
    """A dict from the push API (order book, position / balance rows, connector rows) with attribute access:
    ``row.qty`` and ``row["qty"]`` both work."""
    def __getattr__(self, name: str) -> Any: ...

class Subscription:
    """A push subscription returned by ``ctx.subscribe()`` (read-only identity plus methods).

    It belongs to the thread that subscribed: its events go only to that thread and only that thread can
    ``unsubscribe()``. Pass it (or its ``id``) to ``ctx.poll()`` to take only its events.
    """
    id: int
    """Event stream ID (``ev.stream`` of its events)."""
    ex: int
    """Account index (``exchanges[ex]``)."""
    channel: str
    """``"ticker"``, ``"bbo"``, ``"depth"``, ``"trade"``, ``"kline"``, ``"tickers"`` or ``"private"``."""
    symbol: str
    """Symbol code (empty for ``private`` / ``tickers``)."""
    depth: int
    """Levels of a depth subscription (0 = the exchange default)."""
    interval: int
    """K-line period in seconds."""

    def info(self) -> dict[str, Any]:
        """The identity as a dict: ``{id, ex, channel, symbol, depth, interval}``."""
        ...

    def book(self, n: Optional[int] = None) -> CtxRecord:
        """Depth subscriptions: its own order book ``{"bids": [[price, qty], ...], "asks": [...]}`` (bids descending,
        asks ascending; ``n`` levels, default the subscription's depth). Raises for other channels or after
        unsubscribing."""
        ...

    def positions(self) -> Optional[list[CtxRecord]]:
        """``private`` subscriptions: latest positions (rows ``{symbol, side, posSide, qty, avgPx, profit?, margin?,
        liqPx?, markPx?, leverage?, time}``); ``None`` until the account snapshot is READY (unknown, not "none")."""
        ...

    def balances(self) -> Optional[list[CtxRecord]]:
        """``private`` subscriptions: latest balances (rows ``{asset, free, frozen, equity?, upnl?, margin?, time}``);
        ``None`` until the account snapshot is READY."""
        ...

    def unsubscribe(self) -> None:
        """Unsubscribe (again on the same object is a no-op). Only the subscribing thread can do it."""
        ...

class SubscriptionList(list[Subscription]):
    """Result of a batch ``ctx.subscribe()`` (``symbol`` is a list): the subscriptions in the same order; can be
    passed to ``ctx.poll()`` as a whole."""

    def unsubscribe(self) -> None:
        """Unsubscribe every element."""
        ...

class CtxEvent(dict[str, Any]):
    """Event returned by ``ctx.poll()``: a dict with the JavaScript event fields (``ev.kind`` or ``ev["kind"]``).

    Common fields: ``kind`` (1 ticker/bbo/tickers, 3 depth, 4 trade, 5 kline, 16 order, 17 position, 18 balance,
    32 timer, 33 gateway status, 35 init status), ``stream``, ``type`` (``"data"`` / ``"status"`` / ``"timer"``),
    ``channel``, ``ex``, ``symbol``, ``seq``, ``ts``. Per kind: 1 ``bid ask last bidQty askQty volume openInterest
    open high low time``; 4 ``px qty side tradeId time``; 5 ``open high low close volume openInterest intervalSec
    openTimeMs closed prefill``; 16 ``id state px qty filledQty avgPx reason reasonText``; 17 ``side posSide qty
    avgPx profit margin liqPx markPx leverage time snapshot``; 18 ``asset free frozen equity upnl margin time
    snapshot``; 32 ``timerId scheduledNs``; 33 ``status detail``; 35 ``channelCode intervalSec prefillStatus``
    (1 READY, 2 FAILED) ``detail message``. Depth events (kind 3) carry no levels: read them with ``ev.book(n)``.
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
        """Depth events (kind 3): the order book of the subscription it belongs to, as ``Subscription.book()``."""
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
    """The global ``ctx``: WebSocket push subscriptions (same semantics as JavaScript ``ctx``; live only).

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
                        Log("subscription failed:", ev.channel, ev.message)
                    continue
                if ev.channel == "depth":
                    b = ev.book(5)
                elif ev.channel in ("positions", "balance"):
                    Log(acct.positions(), acct.balances())
    """
    STREAM_TIMER: int
    """Built-in stream of engine timers (kind 32). Value 1."""
    STREAM_STATUS: int
    """Built-in stream of gateway status events (kind 33). Value 2."""

    @overload
    def subscribe(self, ex: Union[IExchange, int, str], opts: _SubscribeBatchOptions) -> SubscriptionList: ...
    @overload
    def subscribe(self, ex: Union[IExchange, int, str], opts: dict[str, Any]) -> Subscription:
        """Subscribe to push data: a symbol's market data, market-wide tickers or the account's private stream.

        Exactly two positional arguments.

        Args:
            ex: Exchange object (``exchange``, ``exchanges[1]``) or account index (an int or digit string).
            opts: ``{channel, symbol, depth, interval, mode, buffer}``. ``channel``: ``"ticker"`` (default),
                ``"bbo"``, ``"depth"``, ``"trade"``, ``"kline"``, ``"tickers"`` (whole market, no symbol) or
                ``"private"`` (orders + positions + balances, no symbol). ``symbol``: required for market data
                unless ``ex`` is an exchange object (its current pair); a list subscribes a batch. ``depth``:
                levels; ``interval``: K-line seconds; ``mode: "latest"`` or ``buffer: N``.

        Returns:
            ``Subscription``; a ``SubscriptionList`` when ``symbol`` is a list or tuple (validated as a whole).
            Invalid options raise; a subscription the exchange rejects gets a kind 35 FAILED event on its stream.
        """
        ...

    def poll(self, streams: Optional[Union[Subscription, int, Sequence[Any]]] = None, timeout_ms: Optional[int] = None) -> Optional[CtxEvent]:
        """Next event of this thread's subscriptions.

        Args:
            streams: ``None`` / ``[]`` = all of this thread's subscriptions; otherwise Subscriptions, stream IDs,
                a SubscriptionList or nested lists of them (``ctx.STREAM_TIMER`` / ``ctx.STREAM_STATUS`` too).
            timeout_ms: ``None`` waits until an event arrives, ``0`` does not wait, > 0 waits at most that many ms
                (non-negative int).

        Returns:
            The event, ``None`` on timeout. Raises ``StopError`` once the robot is stopping (also during
            ``onexit()``).
        """
        ...

    def connectors(self) -> list[CtxRecord]:
        """Loaded exchanges: ``[{ex, label, name, symbol, interval, orderIdScope, feed}, ...]``; ``feed`` =
        ``{ticksDropped, backpressure, ringCapacity}`` push-buffer counters (growing fast = the strategy is too
        slow)."""
        ...

# ==================== Global Variables ====================

ext: Any
"""Template library exports: functions a template assigns to ``ext`` (``ext.foo = foo``) are called as ``ext.foo()``."""

TA: ITA
"""Built-in indicator library (MA, EMA, MACD, BOLL, KDJ, RSI, ATR, OBV, Highest, Lowest, Alligator, CMF)."""

exchanges: list[IExchange]
"""All exchange objects of the robot, in configuration order."""

exchange: IExchange
"""The first exchange object, same as ``exchanges[0]``."""

ctx: Ctx
"""WebSocket push: ``ctx.subscribe()``, ``ctx.poll()``, ``ctx.connectors()`` (live only)."""

# ==================== Global Functions ====================

def Version() -> str:
    """Version of the docker (node) running the strategy, e.g. ``"3.9.2"``."""
    ...

def Sleep(millisecond: float) -> None:
    """Pause for ``millisecond`` milliseconds. Raises ``StopError`` when the robot stops.

    Example::

        while True:
            Log(exchange.GetTicker())
            Sleep(1000)
    """
    ...

def IsVirtual() -> bool:
    """``True`` in a backtest, ``False`` in live trading."""
    ...

def Mail(smtpServer: str, smtpUsername: str, smtpPassword: str, mailTo: str, title: str, body: str) -> bool:
    """Send an email via SMTP. Returns ``True`` on success, ``False`` on failure (reason in ``GetLastError()``).

    Example::

        Mail("smtp.qq.com:465", "sender@qq.com", "auth_code", "receiver@gmail.com", "Alert", "BTC above 50000")
    """
    ...

def SetErrorFilter(filters: str) -> None:
    """Error logs matching this regular expression are not recorded. ``""`` clears the filter.

    Example::

        SetErrorFilter("502:|503:|tcp|character|unexpected|network|timeout")
    """
    ...

def GetPid() -> int:
    """Process ID of the robot."""
    ...

def GetLastError() -> str:
    """The most recent error message, cleared by reading; ``""`` when there is none.

    Example::

        if exchange.GetTicker() is None:
            Log("error:", GetLastError())
    """
    ...

def GetCommand(timeout: int = -1) -> Optional[str]:
    """Read an interactive command (``"ControlName:Data"``) sent from the robot page; ``None`` when there is none.

    Args:
        timeout: Milliseconds: ``-1`` (default) do not wait, ``0`` wait until a command arrives, positive wait at
            most that long.

    Example::

        cmd = GetCommand()
        if cmd:
            name, _, data = cmd.partition(":")
    """
    ...

def GetChannelData(channelId: Union[str, int]) -> Any:
    """Latest data published with ``SetChannelData()`` by another robot (its robot ID), or data sent to the platform
    through the HTTP API (a 32-char UUID). ``None`` on the first call (retry) or when nothing was published."""
    ...

def SetChannelData(data: Any) -> None:
    """Publish this robot's state (any JSON-serializable value) for other robots to read with ``GetChannelData()``."""
    ...

def GetMeta() -> Optional[str]:
    """The ``Meta`` data set when the robot was created (via the API), ``None`` when there is none."""
    ...

def Dial(address: str, timeout: Union[int, dict[str, Any]] = 30) -> Optional[IDial]:
    """Open a TCP / TLS / WebSocket connection or a database connection (live only).

    Args:
        address: e.g. ``"wss://host/path"``, ``"tcp://host:port"``, ``"tls://host:443"``, ``"sqlite3://test.db"``,
            ``"sqlite3://:memory:"``, ``"mysql://user:pass@tcp(host:3306)/db?charset=utf8mb4&parseTime=true"``,
            ``"postgres://user=u password=p host=h port=5432 dbname=d sslmode=disable"``,
            ``"clickhouse://tcp://host:9000?username=u&password=p&database=d"``. Options follow a ``|``:
            ``"wss://...|compress=gzip_raw&mode=recv&reconnect=true&interval=10000&payload=..."``.
        timeout: Connect timeout: ws/wss in ms (below 100 = seconds), tcp/tls in seconds, 0 = default; 30 when
            omitted. Or an options dict, e.g. ``{"timeout": 10, "headers": {...}}``.

    Returns:
        ``IDial``, ``None`` when the connection failed (reason in ``GetLastError()``).

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
    """Send an HTTP request.

    Args:
        url: URL. A proxy prefix is allowed: ``"socks5://127.0.0.1:1080/https://api.example.com"`` (an explicit
            ``proxy`` option wins).
        postData: An ``IHttpOptions`` dict (``method``, ``body``, ``headers``, ``cookie``, ``timeout``, ``proxy``,
            ``charset``, ``format``, ``debug``, ...), or a non-empty string = POST body (legacy form).
        cookies, headers, isReturnHeader: Legacy positional form.

    Returns:
        The response body string (``""`` on failure; parse JSON with ``json.loads``). With ``{"debug": True}``
        (or ``isReturnHeader``) the full ``IHttpRet``; on failure its ``StatusCode`` is 0 and ``Error`` the reason.

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
    """Asynchronous ``HttpQuery()``: returns at once; ``wait(timeout)`` yields the same result as ``HttpQuery()``.
    On completion ``EventLoop()`` receives an event with ``Event`` ``"HttpQuery"`` (``Index`` = ticket).

    Example::

        r1 = HttpQuery_Go("https://api.example.com/a")
        r2 = HttpQuery_Go("https://api.example.com/b")
        a = json.loads(r1.wait())
        b = json.loads(r2.wait())
    """
    ...

def Encode(algo: str, inputFormat: str, outputFormat: str, data: str, keyFormat: str = ..., key: str = ...) -> str:
    """Encoding, hashing, HMAC, encryption and signing.

    Args:
        algo: ``"raw"``; hashes ``"md5"``, ``"sha1"``, ``"sha256"``, ``"sha512"``, ``"sha3.256"``, ``"keccak256"``,
            ``"ripemd160"``, ``"blake2b.256"``, ... (HMAC when ``key`` is given); ``"sign"``, ``"signTx"``;
            ``"ed25519"``, ``"ed25519.seed"``; ``"text.encoder.utf8"``, ``"text.decoder.gbk"``;
            ``"aes.encrypt"`` / ``"aes.decrypt"`` (``.cbc`` default, ``.cfb``, ``.ecb``); ``"gzip.deflate"``,
            ``"gzip.inflate"``, ``"zlib.deflate"``, ``"zlib.inflate"``, ``"raw.deflate"``, ``"raw.inflate"``.
        inputFormat: Format of ``data``: ``"raw"``, ``"hex"``, ``"base64"``, ``"string"`` (also ``"base64.url"``,
            ``"base64.rawurl"``, ``"latin1"``).
        outputFormat: ``"raw"``, ``"hex"``, ``"base64"``, ``"string"`` (also ``"base64.url"``, ``"base64.rawurl"``).
        data: Input data.
        keyFormat: Format of ``key``.
        key: Key (HMAC / signing / encryption).

    Example::

        sign = Encode("sha256", "string", "hex", "message", "string", "secret")  # HMAC-SHA256
        h = Encode("md5", "raw", "hex", "hello")
    """
    ...

def MD5(data: str) -> str:
    """MD5 of ``data``, 32 lower-case hex characters."""
    ...

def HMAC(algo: str, outputFormat: str, data: str, key: str) -> str:
    """Legacy: HMAC signature, same as ``Encode(algo, "raw", outputFormat, data, "raw", key)``."""
    ...

def Hash(algo: str, outputFormat: str, data: str) -> str:
    """Legacy: hash, same as ``Encode(algo, "raw", outputFormat, data)``."""
    ...

def StrDecode(s: str, charset: str) -> str:
    """Legacy: decode ``s`` (each character's code point is one byte) from ``charset`` (required, e.g. ``"gbk"``)
    to a UTF-8 string, same as ``Encode("text.decoder." + charset, "latin1", "string", s)``."""
    ...

def UnixNano() -> int:
    """Current nanosecond timestamp."""
    ...

def Unix() -> int:
    """Current second timestamp."""
    ...

def GetOS() -> str:
    """OS and architecture of the docker, e.g. ``"linux/amd64"``."""
    ...

def SysInfo(attr: str = ...) -> Any:
    """System information of the docker process: the whole dict without ``attr``, else one value (``"pid"``,
    ``"os"``, ``"arch"``, ``"ncpu"``, ...); ``None`` for an unknown key."""
    ...

def UUID() -> str:
    """A UUID: 32 upper-case hex characters, no hyphens."""
    ...

def DBExec(sql: str, *args: Any) -> Optional[IDBExecRet]:
    """Execute SQL on the robot's own SQLite database (persistent). ``?`` placeholders take ``args``.

    Returns:
        ``{columns, values}``, ``None`` on failure.

    Example::

        DBExec("CREATE TABLE IF NOT EXISTS trades(ts INTEGER, price REAL)")
        DBExec("INSERT INTO trades VALUES(?, ?)", Unix(), 50000)
        ret = DBExec("SELECT * FROM trades")
    """
    ...

def EventLoop(timeout: int = 0) -> Optional[IEventMsg]:
    """Wait for the next event: ``exchange.Go()`` / ``HttpQuery_Go()`` completions and, on push-only futures
    counters, tick / order events. (WebSocket push subscriptions are read with ``ctx.poll()`` instead.)

    Args:
        timeout: Milliseconds: ``0`` (default) wait until an event arrives, positive wait at most that long,
            negative do not wait.

    Returns:
        ``IEventMsg``, ``None`` on timeout. Raises ``StopError`` when the robot stops.

    Example::

        t = exchange.Go("GetTicker")
        ev = EventLoop(1000)
        if ev:
            Log(ev.Event, ev.Index)
    """
    ...

def JSONParse(s: str) -> Any:
    """Parse JSON; numbers beyond the safe integer range (2^53) are kept as strings."""
    ...

def Log(*args: Any) -> None:
    """Write a log line (values joined with spaces). A trailing ``"#ff0000"`` colors it; a trailing ``"@"`` also
    pushes it as a notification (email / WebHook, live only); a trailing ``"&"`` makes it a private log, hidden when
    the robot is shown publicly. matplotlib figures are shown as images.

    Example::

        Log("Price:", ticker.Last, "Amount:", 0.1)
        Log("Alert #ff0000@")
    """
    ...

def LogProfit(profit: float, *args: Any) -> None:
    """Record profit (calculated by the strategy) and draw the profit curve; ``args`` are appended to the log."""
    ...

def LogProfitReset(remain: int = ...) -> None:
    """Clear profit logs, keeping the last ``remain`` entries."""
    ...

def LogStatus(*args: Any) -> None:
    """Set the status bar shown above the logs: text, tables (``{"type": "table", "title", "cols", "rows"}``),
    buttons, status components, or a list of them; dicts / lists are sent as JSON.

    Example::

        table = {"type": "table", "title": "Positions", "cols": ["Symbol", "Amount"], "rows": [["BTC", 1]]}
        LogStatus("`" + json.dumps(table) + "`")
    """
    ...

def LogReset(remain: int = ...) -> None:
    """Clear logs, keeping the last ``remain`` entries."""
    ...

def LogVacuum() -> None:
    """Reclaim database space after ``LogReset()`` (SQLite VACUUM)."""
    ...

def EnableLog(enable: bool) -> None:
    """``False`` stops recording order logs (``Buy``/``Sell``/... lines); errors are always logged."""
    ...

def Chart(options: Union[dict[str, Any], list[dict[str, Any]]]) -> IChart:
    """Create a chart (Highcharts / Highstocks configuration; a list = several charts).

    Prefer ``Chart`` for general charting; use ``KLineChart`` for Pine-style candlestick charts.

    Example::

        chart = Chart({"title": {"text": "Spread"}, "xAxis": {"type": "datetime"},
                       "series": [{"name": "Spread", "data": []}]})
        chart.add(0, [Unix() * 1000, 1.5])
    """
    ...

def KLineChart(options: Optional[dict[str, Any]] = None) -> IKLineChart:
    """Create a Pine-style K-line chart. ``options``: ``overlay`` (main chart), ``pricePrecision``,
    ``volumePrecision``, ``xAxis``, ``yAxis``, ``candle``, ...

    Example::

        c = KLineChart({"overlay": True})
    """
    ...

def _G(k: Optional[str] = ..., v: Any = ...) -> Any:
    """Persistent key/value storage of the robot (survives restarts).

    ``_G()`` returns the robot ID; ``_G(k)`` reads; ``_G(k, v)`` writes; ``_G(k, None)`` deletes; ``_G(None)``
    clears everything.

    Example::

        _G("lastPrice", 50000)
        price = _G("lastPrice")
    """
    ...

def _D(timestamp: Optional[float] = None, fmt: Optional[str] = None) -> str:
    """Format a time. In Python ``timestamp`` is in **seconds** (``records[-1].Time / 1000``); omitted = now.
    ``fmt`` is a ``time.strftime`` format, default ``"%Y-%m-%d %H:%M:%S"``. Uses the docker's local time zone.

    Example::

        Log(_D())
        Log(_D(1574993606, "%Y-%m-%d"))
    """
    ...

def _N(num: float, precision: int = 4) -> float:
    """Truncate ``num`` to ``precision`` decimals (no rounding); a negative ``precision`` truncates integer digits.

    Example::

        _N(3.1415, 2)   # 3.14
        _N(1300, -3)    # 1000
    """
    ...

def _C(func: Callable[..., Optional[_V]], *args: Any) -> _V:
    """Call ``func(*args)`` until it returns something other than ``None`` / ``False``, sleeping between attempts
    (3000 ms, see ``_CDelay``).

    Example::

        ticker = _C(exchange.GetTicker)
        depth = _C(exchange.GetDepth, "BTC_USDT")
    """
    ...

def _CDelay(ms: float) -> None:
    """Set the retry interval of ``_C()`` in milliseconds (3000 by default)."""
    ...

def _Cross(arr1: Sequence[Optional[float]], arr2: Sequence[Optional[float]]) -> int:
    """Bars since ``arr1`` and ``arr2`` crossed: positive = ``arr1`` crossed above ``arr2`` that many bars ago,
    negative = crossed below, 0 = equal at the last bar. Both lists must have the same length.

    Example::

        n = _Cross(TA.EMA(records, 5), TA.EMA(records, 20))
        if n == 1:
            Log("golden cross on the last bar")
    """
    ...

def _T(text: str, other: Optional[str] = None) -> str:
    """Bilingual text: ``_T("中文", "English")`` shows the part matching the viewer's language."""
    ...
