from typing import Callable, Optional, TypeVar, Union, List

# ==================== K-line Period Constants ====================

PERIOD_M1: int
"""1-minute K-line period."""

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
"""Order pending status (active order, not yet filled)."""

ORDER_STATE_CLOSED: int
"""Order completed (fully filled)."""

ORDER_STATE_CANCELED: int
"""Order canceled (by user or exchange)."""

ORDER_STATE_UNKNOWN: int
"""Order status unknown."""

# ==================== Order Type Constants ====================

ORDER_TYPE_BUY: int
"""Buy order type."""

ORDER_TYPE_SELL: int
"""Sell order type."""

# ==================== Order Direction Constants (Futures) ====================

ORDER_OFFSET_OPEN: int
"""Open position direction (futures)."""

ORDER_OFFSET_CLOSE: int
"""Close position direction (futures)."""

# ==================== Conditional Order Type Constants ====================

ORDER_CONDITION_TYPE_OCO: int
"""OCO conditional order (One-Cancels-the-Other). Sets both take-profit and stop-loss simultaneously."""

ORDER_CONDITION_TYPE_TP: int
"""Take Profit conditional order."""

ORDER_CONDITION_TYPE_SL: int
"""Stop Loss conditional order."""

ORDER_CONDITION_TYPE_GENERIC: int
"""Generic conditional order."""

# ==================== Log Type Constants ====================

LOG_TYPE_BUY: int
"""Buy log type, used for ``exchange.Log()``."""

LOG_TYPE_SELL: int
"""Sell log type, used for ``exchange.Log()``."""

LOG_TYPE_CANCEL: int
"""Cancel order log type, used for ``exchange.Log()``."""

# ==================== Position Direction Constants (Futures) ====================

PD_LONG: int
"""Long position direction."""

PD_SHORT: int
"""Short position direction."""

PD_LONG_YD: int
"""Yesterday's long position (SHFE specific)."""

PD_SHORT_YD: int
"""Yesterday's short position (SHFE specific)."""

# ==================== Futures/Exchange Operation Code Constants ====================

FUTURES_OP_SET_MARGIN: int
"""Set margin/leverage operation code."""

FUTURES_OP_SET_DIRECTION: int
"""Set trading direction operation code."""

FUTURES_OP_SET_CONTRACT_TYPE: int
"""Set contract type operation code."""

FUTURES_OP_GET_POSITION: int
"""Get position operation code."""

EXCHANGE_OP_IO_CONTROL: int
"""IO control operation code, used for sending arbitrary API requests."""

# ==================== Type Aliases ====================

IOrderId = Union[int, str]
"""Order ID type, can be int or str depending on the exchange."""

# ==================== Data Interfaces ====================

class IOrderCondition:
    """Condition order parameter structure, defining take-profit and stop-loss trigger conditions.

    Used with ``exchange.CreateConditionOrder()`` to create conditional orders.

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
    """Condition type: ORDER_CONDITION_TYPE_OCO, TP (take profit), SL (stop loss), or GENERIC."""
    TpTriggerPrice: Optional[float]
    """Take-profit trigger price."""
    TpOrderPrice: Optional[float]
    """Take-profit order price (places order at this price when triggered)."""
    SlTriggerPrice: Optional[float]
    """Stop-loss trigger price."""
    SlOrderPrice: Optional[float]
    """Stop-loss order price (places order at this price when triggered)."""

class IOrder:
    """Order information structure containing complete order details.

    Returned by ``exchange.GetOrder()``, ``exchange.GetOrders()``, etc.

    Example::

        order = exchange.GetOrder(order_id)
        if order:
            Log("Price:", order.Price, "Filled:", order.DealAmount, "Status:", order.Status)
    """
    Info: object
    """Original order information returned by exchange (JSON object), format varies by exchange."""
    Id: IOrderId
    """Order ID, can be str or int depending on the exchange."""
    Time: int
    """Order timestamp (milliseconds)."""
    Price: float
    """Order price."""
    Amount: float
    """Order quantity."""
    DealAmount: float
    """Filled quantity."""
    AvgPrice: float
    """Average fill price."""
    Status: int
    """Order status: ORDER_STATE_PENDING (pending), ORDER_STATE_CLOSED (filled),
    ORDER_STATE_CANCELED (canceled), ORDER_STATE_UNKNOWN (unknown)."""
    Type: int
    """Order type: ORDER_TYPE_BUY (buy), ORDER_TYPE_SELL (sell)."""
    Offset: Optional[int]
    """Order offset direction (futures): ORDER_OFFSET_OPEN (open), ORDER_OFFSET_CLOSE (close)."""
    ContractType: Optional[str]
    """Contract type (futures), e.g. ``"swap"`` (perpetual), ``"quarter"`` (quarterly)."""
    Condition: Optional[IOrderCondition]
    """Conditional order information (only present for conditional orders)."""

class IMarketOrder:
    """Market order entry (bid/ask) in depth data, contains price and amount."""
    Price: float
    """Price level."""
    Amount: float
    """Amount at this price level."""

class IDepth:
    """Market depth (order book) data, contains bid and ask order information.

    Asks are sorted by price from low to high, Bids from high to low.

    Example::

        depth = exchange.GetDepth()
        if depth:
            Log("Best ask:", depth.Asks[0].Price, "Best bid:", depth.Bids[0].Price)
            Log("Spread:", depth.Asks[0].Price - depth.Bids[0].Price)
    """
    Info: object
    """Original depth data returned by exchange."""
    Time: int
    """Timestamp (milliseconds)."""
    Asks: list[IMarketOrder]
    """Ask order array, sorted by price from low to high (Asks[0] is best ask)."""
    Bids: list[IMarketOrder]
    """Bid order array, sorted by price from high to low (Bids[0] is best bid)."""

class IFunding:
    """Funding rate information (perpetual contracts).

    Example::

        fundings = exchange.GetFundings("BTC_USDT.swap")
        if fundings:
            Log("Funding rate:", fundings[0].Rate, "Settlement time:", fundings[0].Time)
    """
    Info: object
    """Original data returned by exchange."""
    Time: int
    """Settlement timestamp (milliseconds)."""
    Rate: float
    """Funding rate, e.g. 0.0001 means 0.01%."""
    Period: float
    """Settlement period (seconds)."""
    Symbol: str
    """Trading pair symbol."""

class IPosition:
    """Position information structure (futures).

    Example::

        positions = exchange.GetPositions("BTC_USDT.swap")
        if positions:
            for pos in positions:
                direction = "Long" if pos.Type == PD_LONG else "Short"
                Log("Direction:", direction, "Amount:", pos.Amount, "PnL:", pos.Profit)
    """
    Info: object
    """Original position data returned by exchange."""
    MarginLevel: float
    """Leverage multiplier."""
    Amount: float
    """Position amount."""
    FrozenAmount: float
    """Frozen amount (positions in pending close orders)."""
    Price: float
    """Average position price."""
    Profit: float
    """Unrealized profit and loss."""
    Type: int
    """Position direction: PD_LONG (long), PD_SHORT (short),
    PD_LONG_YD (long yesterday), PD_SHORT_YD (short yesterday)."""
    ContractType: str
    """Contract type, e.g. ``"swap"``, ``"quarter"``."""
    Margin: float
    """Margin used for this position."""

class ITrade:
    """Recent trade record.

    Example::

        trades = exchange.GetTrades()
        if trades:
            Log("Latest trade:", trades[-1].Price, "Amount:", trades[-1].Amount)
    """
    Id: Union[int, str]
    """Trade record ID."""
    Time: int
    """Trade timestamp (milliseconds)."""
    Price: float
    """Trade price."""
    Amount: float
    """Trade amount."""
    Type: int
    """Trade type: ORDER_TYPE_BUY (buy), ORDER_TYPE_SELL (sell)."""

class ITicker:
    """Ticker data containing current market snapshot information.

    Example::

        ticker = exchange.GetTicker()
        if ticker:
            Log("Last:", ticker.Last, "Bid:", ticker.Buy, "Ask:", ticker.Sell)
            Log("24h High:", ticker.High, "Low:", ticker.Low, "Volume:", ticker.Volume)
    """
    Time: int
    """Timestamp (milliseconds)."""
    Symbol: str
    """Trading pair symbol."""
    High: float
    """24-hour high price."""
    Low: float
    """24-hour low price."""
    Sell: float
    """Best ask price."""
    Buy: float
    """Best bid price."""
    Last: float
    """Last trade price."""
    Volume: float
    """24-hour trading volume."""
    Info: object
    """Original ticker data returned by exchange."""

class IAccount:
    """Account information structure (spot).

    For futures accounts, returns extended structure with equity and unrealized PnL.

    Example::

        account = exchange.GetAccount()
        if account:
            Log("Quote balance:", account.Balance, "Frozen:", account.FrozenBalance)
            Log("Base balance:", account.Stocks, "Frozen:", account.FrozenStocks)
    """
    Info: object
    """Original account data returned by exchange."""
    Balance: float
    """Quote currency balance (e.g. USDT). For futures, refers to available margin."""
    FrozenBalance: float
    """Frozen quote currency balance."""
    Stocks: float
    """Base currency balance (e.g. BTC). For futures, refers to currency corresponding to available margin."""
    FrozenStocks: float
    """Frozen base currency balance."""
    Equity: float
    """Equity (futures), total account value including unrealized PnL."""

class IAsset:
    """Asset information representing holdings of a specific currency in the account.

    Example::

        assets = exchange.GetAssets()
        if assets:
            for asset in assets:
                Log("Currency:", asset.Currency, "Available:", asset.Amount, "Frozen:", asset.FrozenAmount)
    """
    Currency: str
    """Currency name, e.g. ``"BTC"``, ``"USDT"``."""
    Amount: float
    """Available amount."""
    FrozenAmount: float
    """Frozen amount."""

class IRecord:
    """K-line (candlestick) data structure, containing OHLCV information.

    Example::

        records = exchange.GetRecords(PERIOD_H1)
        if records:
            last = records[-1]
            Log("Open:", last.Open, "High:", last.High, "Low:", last.Low, "Close:", last.Close)
    """
    Time: int
    """Candlestick timestamp (milliseconds), representing the start time of this bar."""
    Open: float
    """Open price."""
    High: float
    """High price."""
    Low: float
    """Low price."""
    Close: float
    """Close price."""
    Volume: float
    """Trading volume."""

class IRecordList(list[IRecord]):
    """Extended list of IRecord with convenient property accessors for OHLCV arrays.

    Can be passed directly to TA/talib indicator functions. The property accessors
    extract all values of a specific field into a flat list.

    Example::

        records = exchange.GetRecords(PERIOD_H1)
        if records:
            closes = records.Close   # list of all close prices
            highs = records.High     # list of all high prices
            rsi = TA.RSI(records, 14)
    """
    @property
    def Open(self) -> list[float]:
        """List of all open prices extracted from the records."""
        ...
    @property
    def High(self) -> list[float]:
        """List of all high prices extracted from the records."""
        ...
    @property
    def Low(self) -> list[float]:
        """List of all low prices extracted from the records."""
        ...
    @property
    def Close(self) -> list[float]:
        """List of all close prices extracted from the records."""
        ...
    @property
    def Volume(self) -> list[float]:
        """List of all volume values extracted from the records."""
        ...

class IMarket:
    """Market/trading pair information, describing precision, limits and other metadata.

    Obtained via ``exchange.GetMarkets()``.

    Example::

        markets = exchange.GetMarkets()
        if markets:
            btc = markets.get("BTC_USDT")
            if btc:
                Log("Price precision:", btc.PricePrecision, "Amount precision:", btc.AmountPrecision)
                Log("Min qty:", btc.MinQty, "Min notional:", btc.MinNotional)
    """
    Symbol: str
    """Trading pair symbol, e.g. ``"BTC_USDT"``, for futures ``"BTC_USDT.swap"``."""
    BaseAsset: str
    """Base asset (trading currency), e.g. ``"BTC"``."""
    QuoteAsset: str
    """Quote asset, e.g. ``"USDT"``."""
    TickSize: Optional[float]
    """Minimum price tick size, e.g. 0.01."""
    AmountSize: Optional[float]
    """Minimum amount step size, e.g. 0.001."""
    PricePrecision: Optional[int]
    """Price decimal precision, e.g. 2 means 2 decimal places."""
    AmountPrecision: Optional[int]
    """Amount decimal precision, e.g. 3 means 3 decimal places."""
    MinQty: Optional[float]
    """Minimum order quantity."""
    MaxQty: Optional[float]
    """Maximum order quantity."""
    MinNotional: Optional[float]
    """Minimum order value (notional value)."""
    MaxNotional: Optional[float]
    """Maximum order value (notional value)."""
    CtVal: Optional[float]
    """Contract value (futures), e.g. 0.01 means one contract represents 0.01 coins."""
    Info: Optional[object]
    """Raw market information returned by the exchange."""

class IGo:
    """Concurrent task object returned by ``exchange.Go()``, used for asynchronous result retrieval.

    Example::

        # Concurrently fetch ticker and depth
        go_ticker = exchange.Go("GetTicker")
        go_depth = exchange.Go("GetDepth")
        ticker = go_ticker.wait()   # Wait for ticker result
        depth = go_depth.wait()     # Wait for depth result
    """
    def wait(self, timeout: Optional[int] = None) -> object:
        """Wait for the concurrent task to complete and return the result.

        Args:
            timeout: Timeout duration in milliseconds.

                - Not passed or 0: Block until result is returned.
                - Positive number: Wait for specified ms, return ``None`` on timeout.
                - Negative number (-1): Return immediately, return ``None`` if no result.

        Returns:
            The return value of the corresponding function, ``None`` on failure or timeout.

        Example::

            go = exchange.Go("GetTicker")
            ticker = go.wait(2000)  # Wait at most 2 seconds
        """
        ...

class IExchange:
    """Exchange operation interface, encapsulates all exchange API call methods.

    Access via global variable ``exchange`` (first exchange) or ``exchanges[i]`` (i-th exchange).

    Example::

        ticker = exchange.GetTicker()
        order_id = exchange.Buy(ticker.Sell, 0.1)
        order = exchange.GetOrder(order_id)
    """
    def Go(self, method: str, *args: object) -> IGo:
        """Create a concurrent task, asynchronously call exchange methods.

        Does not block current code execution. Call the ``wait()`` method
        of the returned IGo object to get the result. Multiple concurrent
        requests can be initiated simultaneously to improve efficiency.

        Args:
            method: Method name to call, e.g. ``"GetTicker"``, ``"GetDepth"``,
                ``"GetAccount"``, ``"GetRecords"``, ``"Buy"``, ``"Sell"``, etc.
            *args: Parameters to pass to the method.

        Returns:
            IGo object. Call its ``wait()`` method to get the result.

        Example::

            go_ticker = exchange.Go("GetTicker", "BTC_USDT")
            go_account = exchange.Go("GetAccount")
            ticker = go_ticker.wait()
            account = go_account.wait()
        """
        ...

    def GetPositions(self, symbol: str = '') -> Optional[list[IPosition]]:
        """Get current position list (futures).

        Args:
            symbol: Trading pair symbol, e.g. ``"BTC_USDT.swap"``.
                Not passed returns all positions.

        Returns:
            Position list, ``None`` on failure. Empty list ``[]`` when no positions.

        Example::

            positions = exchange.GetPositions("BTC_USDT.swap")
            if positions and len(positions) > 0:
                Log("Amount:", positions[0].Amount, "Direction:", positions[0].Type)
        """
        ...

    def GetContractType(self) -> str:
        """Get currently set contract type (futures).

        Returns:
            Current contract type string, e.g. ``"swap"`` (perpetual),
            ``"quarter"`` (quarterly), ``"this_week"``, etc.
        """
        ...

    def SetContractType(self, symbol: str) -> object:
        """Set contract type (futures). Must be set before calling trading interfaces.

        Args:
            symbol: Contract type:

                - ``"swap"``: Perpetual contract
                - ``"quarter"``: Quarterly contract
                - ``"next_quarter"``: Next quarter contract
                - ``"this_week"``: This week contract
                - ``"next_week"``: Next week contract
                - Can also pass a contract ID, e.g. ``"BTC-USD-200925"``

        Returns:
            Setting result.

        Example::

            exchange.SetContractType("swap")       # Perpetual contract
            exchange.SetContractType("quarter")    # Quarterly contract
        """
        ...

    def SetMarginLevel(self, symbol: str|float, num: float=None) -> None:
        """Set leverage multiplier (futures).

        Can be called with one or two arguments:

        - ``SetMarginLevel(10)`` — Set 10x leverage for all pairs.
        - ``SetMarginLevel("BTC_USDT.swap", 20)`` — Set 20x leverage for a specific pair.

        Args:
            symbol: Leverage multiplier (if single arg) or trading pair symbol (if two args).
            num: Leverage multiplier when symbol is specified.

        Example::

            exchange.SetMarginLevel(10)
            exchange.SetMarginLevel("BTC_USDT.swap", 20)
        """
        ...

    def SetDirection(self, s: str) -> None:
        """Set futures trading direction. Must be set before placing orders.

        Discouraged: prefer ``CreateOrder``, which takes the side directly, so
        no ``SetDirection`` is needed.

        Args:
            s: Trading direction:

                - ``"buy"``: Buy to open long
                - ``"sell"``: Sell to open short
                - ``"closebuy"``: Sell to close long
                - ``"closesell"``: Buy to close short

        Example::

            exchange.SetDirection("buy")
            exchange.Buy(50000, 1)           # Open long
            exchange.SetDirection("closebuy")
            exchange.Sell(51000, 1)           # Close long
        """
        ...

    def CancelOrder(self, orderId: object, *extra: object) -> bool:
        """Cancel a specified order.

        Args:
            orderId: Order ID to cancel.
            *extra: Additional log information, will be displayed in the log.

        Returns:
            ``True`` on successful cancellation, ``False`` on failure.

        Example::

            oid = exchange.Buy(50000, 0.1)
            if oid:
                exchange.CancelOrder(oid, "Cancel test order")
        """
        ...

    def GetOrder(self, orderId: object) -> Optional[IOrder]:
        """Query order details by order ID.

        Args:
            orderId: Order ID.

        Returns:
            Order information object, ``None`` on failure.

        Example::

            order = exchange.GetOrder(order_id)
            if order:
                Log("Status:", order.Status, "Filled:", order.DealAmount)
        """
        ...

    def GetOrders(self, symbol: str = '') -> Optional[list[IOrder]]:
        """Get list of current unfilled pending orders.

        Args:
            symbol: Trading pair symbol. Not passed uses currently set trading pair.

        Returns:
            Unfilled order list (empty list means no pending orders), ``None`` on failure.

        Example::

            orders = exchange.GetOrders("BTC_USDT")
            if orders is not None:
                Log("Pending orders:", len(orders))
        """
        ...

    def GetHistoryOrders(self, symbol: str|int = '', since: int = 0, limit: int = 0) -> Optional[list[IOrder]]:
        """Get historical orders (filled/cancelled).

        Args:
            symbol: Trading pair symbol.
            since: Start timestamp (milliseconds), defaults to most recent.
            limit: Maximum number to return.

        Returns:
            Historical order list, ``None`` on failure.

        Example::

            orders = exchange.GetHistoryOrders("BTC_USDT", 0, 100)
            if orders:
                Log("Historical orders:", len(orders))
        """
        ...

    def CancelConditionOrder(self, orderId: object, *extra: object) -> bool:
        """Cancel a specified condition order.

        Args:
            orderId: Condition order ID.
            *extra: Additional log information.

        Returns:
            ``True`` on successful cancellation, ``False`` on failure.
        """
        ...

    def GetConditionOrder(self, orderId: object) -> Optional[IOrder]:
        """Query condition order details by ID.

        Args:
            orderId: Condition order ID.

        Returns:
            Condition order information, ``None`` on failure.
        """
        ...

    def GetConditionOrders(self, symbol: str = '') -> Optional[list[IOrder]]:
        """Get list of current untriggered condition orders.

        Args:
            symbol: Trading pair symbol. Not passed returns all.

        Returns:
            Condition order list, ``None`` on failure.
        """
        ...

    def GetHistoryConditionOrders(self, symbol: str|int = '', since: int = 0, limit: int = 0) -> Optional[list[IOrder]]:
        """Get historical condition order list.

        Args:
            symbol: Trading pair symbol.
            since: Start timestamp (milliseconds).
            limit: Maximum number to return.

        Returns:
            Historical condition order list, ``None`` on failure.
        """
        ...

    def Log(self, orderType: int, price: float, amount: float, *args: object) -> None:
        """Record simulated trading log (no actual order). Used for virtual trading or signal marking.

        Args:
            orderType: Log type: ``LOG_TYPE_BUY``, ``LOG_TYPE_SELL``, or ``LOG_TYPE_CANCEL``.
            price: Price (or order ID when cancelling).
            amount: Amount.
            *args: Additional log information.

        Example::

            exchange.Log(LOG_TYPE_BUY, 50000, 0.1, "Simulated buy signal")
            exchange.Log(LOG_TYPE_SELL, 51000, 0.1, "Simulated sell signal")
        """
        ...

    def Sell(self, price: float, amount: float, *extra: object) -> Optional[IOrderId]:
        """Place sell order (spot sell / futures sell order according to current direction).

        Args:
            price: Sell price. Pass ``-1`` for market order.
            amount: Sell amount.
            *extra: Additional log information.

        Returns:
            Order ID (str or int), ``None`` on failure.

        Example::

            oid = exchange.Sell(51000, 0.1, "Limit sell")
            oid = exchange.Sell(-1, 0.1, "Market sell")
        """
        ...

    def Buy(self, price: float, amount: float, *extra: object) -> Optional[IOrderId]:
        """Place buy order (spot buy / futures buy order according to current direction).

        Args:
            price: Buy price. Pass ``-1`` for market order.
            amount: Buy amount.
            *extra: Additional log information.

        Returns:
            Order ID (str or int), ``None`` on failure.

        Example::

            oid = exchange.Buy(50000, 0.1, "Limit buy")
            oid = exchange.Buy(-1, 0.1, "Market buy")
        """
        ...

    def CreateOrder(self, symbol: str, side: str, price: float, amount: float, *extra: object) -> Optional[IOrderId]:
        """Generic order function. Supports specifying trading pair and direction directly.

        The ``side`` parameter can have options attached, separated by semicolon,
        e.g. ``'buy;{"timeInForce":"GTC"}'``.

        Args:
            symbol: Trading pair symbol, e.g. ``"BTC_USDT"`` (spot) or ``"BTC_USDT.swap"`` (futures).
            side: Order direction: ``"buy"``, ``"sell"``, ``"closebuy"``, ``"closesell"``.
            price: Price. Pass ``-1`` for market order.
            amount: Amount.
            *extra: Additional log information.

        Returns:
            Order ID, ``None`` on failure.

        Example::

            # Spot buy
            exchange.CreateOrder("ETH_USDT", "buy", -1, 1)
            # Futures open long
            exchange.CreateOrder("BTC_USDT.swap", "buy", 50000, 1)
            # Futures close long
            exchange.CreateOrder("BTC_USDT.swap", "closebuy", -1, 1)
        """
        ...

    def ModifyOrder(self, orderId: object, side: str, price: float, amount: float, *extra: object) -> Optional[IOrderId]:
        """Modify price and amount of an existing order.

        Args:
            orderId: Order ID to modify. For futures may be in ``"symbol,orderId"`` format.
            side: Order direction.
            price: New price.
            amount: New amount.
            *extra: Additional log information.

        Returns:
            Updated order ID, ``None`` on failure.
        """
        ...

    def CreateConditionOrder(self, symbol: str, side: str, amount: float, condition: object, *extra: object) -> Optional[IOrderId]:
        """Create condition order (take profit, stop loss, etc.).

        Args:
            symbol: Trading pair symbol.
            side: Order direction: ``"buy"``, ``"sell"``, ``"closebuy"``, ``"closesell"``.
            amount: Amount.
            condition: Condition parameters dict, including trigger price, etc.
            *extra: Additional log information.

        Returns:
            Condition order ID, ``None`` on failure.

        Example::

            exchange.CreateConditionOrder("BTC_USDT.swap", "closebuy", 1, {
                "ConditionType": ORDER_CONDITION_TYPE_TP,
                "TpTriggerPrice": 55000,
                "TpOrderPrice": 54900
            })
        """
        ...

    def ModifyConditionOrder(self, orderId: object, side: str, amount: float, condition: object, *extra: object) -> Optional[IOrderId]:
        """Modify an existing condition order.

        Args:
            orderId: Condition order ID.
            side: Order direction.
            amount: New amount.
            condition: New condition parameters.
            *extra: Additional log information.

        Returns:
            Updated condition order ID, ``None`` on failure.
        """
        ...

    def GetRawJSON(self) -> str:
        """Get the raw JSON string returned by the most recent REST API request.

        Useful for debugging and inspecting raw exchange responses.

        Returns:
            Raw JSON string.

        Example::

            exchange.GetTicker()
            raw = exchange.GetRawJSON()
            Log("Raw response:", raw)
        """
        ...

    def GetAccount(self) -> Optional[IAccount]:
        """Get account information (balance, frozen, etc.).

        Returns:
            Account information object, ``None`` on failure.

        Example::

            account = exchange.GetAccount()
            if account:
                Log("Balance:", account.Balance, "Frozen:", account.FrozenBalance)
        """
        ...

    def GetRecords(self, symbol: str|int='', period: Optional[int] = None, limit: int = 0) -> Optional[IRecordList]:
        """Get candlestick/OHLCV data.

        Args:
            symbol: Trading pair symbol. Not passed uses currently set trading pair.
            period: Candlestick period (seconds), e.g. ``PERIOD_M1``, ``PERIOD_H1``.
                Not passed uses default period set when creating the bot.
            limit: Maximum number of candlesticks to return.

        Returns:
            Candlestick data list (ascending by time), ``None`` on failure.

        Example::

            records = exchange.GetRecords(PERIOD_H1)
            records = exchange.GetRecords("ETH_USDT", PERIOD_M5, 100)
            # Pass to TA for technical analysis
            dif, dea, macd = TA.MACD(records)
        """
        ...

    def SetMaxBarLen(self, n: int) -> None:
        """Set maximum candlestick cache length (default 200 bars).

        Args:
            n: Maximum number of candlestick bars.

        Example::

            exchange.SetMaxBarLen(500)  # Cache up to 500 bars
        """
        ...

    def GetTrades(self, symbol: str='') -> Optional[list[ITrade]]:
        """Get recent trade records.

        Args:
            symbol: Trading pair symbol. Not passed uses currently set trading pair.

        Returns:
            Trade record list (ascending by time), ``None`` on failure.

        Example::

            trades = exchange.GetTrades()
            if trades and len(trades) > 0:
                Log("Latest trade:", trades[-1].Price)
        """
        ...

    def GetTicker(self, symbol: str='') -> Optional[ITicker]:
        """Get current ticker.

        Args:
            symbol: Trading pair symbol. Not passed uses currently set trading pair.

        Returns:
            Ticker data, ``None`` on failure.

        Example::

            ticker = exchange.GetTicker("BTC_USDT")
            if ticker:
                Log("BTC price:", ticker.Last)
        """
        ...

    def GetTickers(self) -> Optional[list[ITicker]]:
        """Get ticker data for all trading pairs (batch fetch).

        Returns:
            Ticker list for all trading pairs, ``None`` on failure.

        Example::

            tickers = exchange.GetTickers()
            if tickers:
                for t in tickers:
                    if t.Symbol == "BTC_USDT":
                        Log("BTC:", t.Last)
        """
        ...

    def GetFundings(self, symbol: str = '') -> Optional[list[IFunding]]:
        """Get funding rate information (perpetual contracts).

        Args:
            symbol: Trading pair symbol.

        Returns:
            Funding rate list, ``None`` on failure.

        Example::

            fundings = exchange.GetFundings("BTC_USDT.swap")
            if fundings:
                Log("Funding rate:", fundings[0].Rate)
        """
        ...

    def GetDepth(self, symbol: str='') -> Optional[IDepth]:
        """Get market depth (order book). Asks from low to high, Bids from high to low.

        Args:
            symbol: Trading pair symbol. Not passed uses currently set trading pair.

        Returns:
            Depth data, ``None`` on failure.

        Example::

            depth = exchange.GetDepth("BTC_USDT")
            if depth:
                Log("Best ask:", depth.Asks[0].Price, "Best bid:", depth.Bids[0].Price)
        """
        ...

    def GetBaseCurrency(self) -> str:
        """Get base currency name.

        Returns:
            Base currency string, e.g. ``"BTC"``.
        """
        ...

    def GetQuoteCurrency(self) -> str:
        """Get quote currency name.

        Returns:
            Quote currency string, e.g. ``"USDT"``.
        """
        ...

    def SetProxy(self, proxy: str) -> None:
        """Set proxy server address.

        Args:
            proxy: Proxy address. Supported formats:

                - ``"socks5://user:pass@host:port"`` — SOCKS5 proxy
                - ``"http://host:port"`` — HTTP proxy
                - ``""`` — Clear proxy settings

        Example::

            exchange.SetProxy("socks5://127.0.0.1:1080")
            exchange.SetProxy("")  # Cancel proxy
        """
        ...

    def SetPrecision(self, pricePrecision: int, amountPrecision: int) -> None:
        """Set decimal precision for price and amount. Automatically truncates when placing orders.

        Args:
            pricePrecision: Price decimal places.
            amountPrecision: Amount decimal places.

        Example::

            exchange.SetPrecision(2, 4)  # Price 2 digits, amount 4 digits
        """
        ...

    def IO(self, k: str, *args: object) -> object:
        """Send arbitrary API request (IO control). Used to call exchange APIs not yet encapsulated.

        Args:
            k: Request path or control command:

                - API path: e.g. ``"/api/v5/account/balance"``
                - ``"api"``: Generic API call
                - ``"currency"``: Switch trading pair
                - ``"base"``: Switch API base address

            *args: Request parameters.

        Returns:
            API response result (parsed as object).

        Example::

            ret = exchange.IO("api", "GET", "/api/v5/account/balance")
            exchange.IO("currency", "ETH_USDT")
        """
        ...

    def SetTimeout(self, n: int) -> None:
        """Set REST API request timeout.

        Args:
            n: Timeout duration in milliseconds.

        Example::

            exchange.SetTimeout(10000)  # 10 second timeout
        """
        ...

    def SetBase(self, s: str) -> None:
        """Set exchange API base address. Used to switch to alternate domain or testnet.

        Args:
            s: API base URL.

        Example::

            exchange.SetBase("https://testnet.binance.vision")
        """
        ...

    def GetBase(self) -> str:
        """Get current API base address.

        Returns:
            API base URL string.
        """
        ...

    def SetCurrency(self, s: str) -> None:
        """Switch current trading pair.

        Args:
            s: Trading pair string, e.g. ``"BTC_USDT"``, ``"ETH_BTC"``.

        Example::

            exchange.SetCurrency("ETH_USDT")
            Log(exchange.GetTicker())  # Get ETH ticker
        """
        ...

    def SetRate(self, n: float) -> None:
        """Set exchange rate conversion. All prices will be automatically multiplied by this rate.

        Args:
            n: Exchange rate value. ``1`` means no conversion.

        Example::

            exchange.SetRate(6.5)  # Convert prices to CNY
            exchange.SetRate(1)    # Cancel conversion
        """
        ...

    def GetRate(self) -> float:
        """Get currently set exchange rate value.

        Returns:
            Exchange rate value, default is ``1``.
        """
        ...

    def GetUSDCNY(self) -> float:
        """Get USD to CNY exchange rate.

        Returns:
            USD/CNY exchange rate.
        """
        ...

    def GetLabel(self) -> str:
        """Get exchange custom label name (set when configuring exchange on FMZ platform).

        Returns:
            Label string.
        """
        ...

    def GetCurrency(self) -> str:
        """Get current trading pair name.

        Returns:
            Trading pair string, e.g. ``"BTC_USDT"``.
        """
        ...

    def GetPeriod(self) -> int:
        """Get currently set candlestick period.

        Returns:
            Candlestick period in seconds.
        """
        ...

    def GetName(self) -> str:
        """Get exchange name.

        Returns:
            Exchange platform name, e.g. ``"Binance"``, ``"OKX"``, ``"Futures_Binance"``.
        """
        ...

    def GetMarkets(self) -> Optional[dict[str, IMarket]]:
        """Get market information for all trading pairs.

        Returns:
            Market info dict keyed by trading pair symbol (e.g. ``"BTC_USDT"``),
            ``None`` on failure.

        Example::

            markets = exchange.GetMarkets()
            if markets:
                m = markets.get("BTC_USDT")
                if m:
                    Log("Min qty:", m.MinQty, "Price precision:", m.PricePrecision)
        """
        ...

    def GetAssets(self) -> Optional[list[IAsset]]:
        """Get all asset information for the account.

        Returns:
            Asset list, each element contains currency, available amount, frozen amount.
            ``None`` on failure.

        Example::

            assets = exchange.GetAssets()
            if assets:
                for a in assets:
                    Log(a.Currency, "Available:", a.Amount)
        """
        ...

# ==================== TA Input Type ====================

t_TAInput = Union[list[float], IRecordList]
"""Input type for TA indicator functions. Can be a list of floats (e.g. close prices)
or an IRecordList (candlestick array, automatically uses Close field)."""

# ==================== Built-in TA Indicator Library ====================

class ITA:
    """FMZ Platform built-in technical analysis indicator library (simplified version).

    More commonly used and easier to use than talib. Access via global variable ``TA``.

    Example::

        records = exchange.GetRecords()
        k, d, j = TA.KDJ(records, 9, 3, 3)
        upper, mid, lower = TA.BOLL(records, 20, 2)
    """
    def CMF(self, inReal: t_TAInput, optInTimePeriod: Optional[IRecordList] = None) -> list[float]:
        """CMF - Chaikin Money Flow.

        Args:
            inReal: Input data (candlestick array).
            optInTimePeriod: Calculation period.

        Returns:
            CMF array.
        """
        ...

    def Alligator(self, inReal: t_TAInput, jawLength: Optional[int] = None, teethLength: Optional[int] = None, lipsLength: Optional[int] = None) -> tuple[list[float], list[float], list[float]]:
        """Alligator Indicator (Williams).

        Args:
            inReal: Input data.
            jawLength: Alligator jaw period, default 13.
            teethLength: Alligator teeth period, default 8.
            lipsLength: Alligator lips period, default 5.

        Returns:
            Tuple of (jaw, teeth, lips) arrays.

        Example::

            jaw, teeth, lips = TA.Alligator(records, 13, 8, 5)
        """
        ...

    def ATR(self, inPriceHLC: IRecordList, optInTimePeriod: Optional[int] = None) -> list[float]:
        """ATR - Average True Range.

        Args:
            inPriceHLC: Candlestick data (requires High/Low/Close).
            optInTimePeriod: Calculation period, default 14.

        Returns:
            ATR array.
        """
        ...

    def OBV(self, inReal: t_TAInput, inPriceV: IRecordList) -> list[float]:
        """OBV - On Balance Volume.

        Args:
            inReal: Close price array or candlestick array.
            inPriceV: Candlestick array containing Volume.

        Returns:
            OBV array.
        """
        ...

    def RSI(self, inReal: t_TAInput, optInTimePeriod: Optional[int] = None) -> list[float]:
        """RSI - Relative Strength Index.

        Args:
            inReal: Input data.
            optInTimePeriod: Calculation period, default 14.

        Returns:
            RSI array, value range 0~100. >70 overbought, <30 oversold.

        Example::

            rsi = TA.RSI(records, 14)
            if rsi[-1] > 70:
                Log("Overbought zone")
        """
        ...

    def KDJ(self, inReal: t_TAInput, period: Optional[int] = None, kPeriod: Optional[int] = None, dPeriod: Optional[int] = None) -> tuple[list[float], list[float], list[float]]:
        """KDJ - Stochastic Oscillator.

        Args:
            inReal: Candlestick data.
            period: K-line period, default 9.
            kPeriod: K-line smoothing period, default 3.
            dPeriod: D-line smoothing period, default 3.

        Returns:
            Tuple of (K, D, J) arrays.

        Example::

            k, d, j = TA.KDJ(records, 9, 3, 3)
            Log("K:", k[-1], "D:", d[-1], "J:", j[-1])
        """
        ...

    def BOLL(self, inReal: t_TAInput, period: Optional[int] = None, multiplier: Optional[float] = None) -> tuple[list[float], list[float], list[float]]:
        """BOLL - Bollinger Bands.

        Args:
            inReal: Input data.
            period: Calculation period, default 20.
            multiplier: Standard deviation multiplier, default 2.

        Returns:
            Tuple of (upper band, middle band, lower band) arrays.

        Example::

            upper, middle, lower = TA.BOLL(records, 20, 2)
        """
        ...

    def MACD(self, inReal: t_TAInput, optInFastPeriod: Optional[int] = None, optInSlowPeriod: Optional[int] = None, optInSignalPeriod: Optional[int] = None) -> tuple[list[float], list[float], list[float]]:
        """MACD - Moving Average Convergence Divergence.

        Args:
            inReal: Input data.
            optInFastPeriod: Fast line period, default 12.
            optInSlowPeriod: Slow line period, default 26.
            optInSignalPeriod: Signal line period, default 9.

        Returns:
            Tuple of (DIF, DEA, MACD histogram) arrays.

        Example::

            dif, dea, macd = TA.MACD(records, 12, 26, 9)
            Log("MACD:", macd[-1])
        """
        ...

    def EMA(self, inReal: t_TAInput, optInTimePeriod: Optional[int] = None) -> list[float]:
        """EMA - Exponential Moving Average.

        Args:
            inReal: Input data.
            optInTimePeriod: Calculation period.

        Returns:
            EMA array.
        """
        ...

    def SMA(self, inReal: t_TAInput, optInTimePeriod: Optional[int] = None) -> list[float]:
        """SMA - Simple Moving Average.

        Args:
            inReal: Input data.
            optInTimePeriod: Calculation period.

        Returns:
            SMA array.
        """
        ...

    def MA(self, inReal: t_TAInput, optInTimePeriod: Optional[int] = None) -> list[float]:
        """MA - Moving Average (default SMA).

        Args:
            inReal: Input data.
            optInTimePeriod: Calculation period.

        Returns:
            MA array.
        """
        ...

    def Highest(self, inReal: t_TAInput, period: Optional[int] = None, attr: Optional[str] = None) -> float:
        """Get the highest value within a period.

        Args:
            inReal: Input data.
            period: Calculation period. If not provided, calculates all data.
            attr: Candlestick attribute name when passing candlestick array,
                e.g. ``"High"``, ``"Low"``, ``"Close"``, ``"Volume"``.

        Returns:
            Highest value (single number).

        Example::

            highest_high = TA.Highest(records, 20, "High")
            highest_close = TA.Highest(records, 10, "Close")
        """
        ...

    def Lowest(self, inReal: t_TAInput, period: Optional[int] = None, attr: Optional[str] = None) -> float:
        """Get the lowest value within a period.

        Args:
            inReal: Input data.
            period: Calculation period. If not provided, calculates all data.
            attr: Candlestick attribute name, e.g. ``"High"``, ``"Low"``, ``"Close"``, ``"Volume"``.

        Returns:
            Lowest value (single number).

        Example::

            lowest_low = TA.Lowest(records, 20, "Low")
        """
        ...

# ==================== Database / Dial / Event Interfaces ====================

class IDBExecRet:
    """Database execution result structure.

    Returned by ``DBExec()`` and ``IDial.exec()``.
    """
    values: list[List]
    """Query result data rows, each row is a list of values."""
    columns: list[str]
    """Column name list."""

class IDial:
    """Network connection object. Supports TCP, WebSocket, database, and KVDB protocols.

    Created via the ``Dial()`` function.

    Example::

        # WebSocket connection
        ws = Dial("wss://stream.binance.com:9443/ws/btcusdt@ticker")
        if ws:
            msg = ws.read(5000)  # Read with 5s timeout
            ws.close()

        # Database connection
        db = Dial("sqlite3:///mydata.db")
        db.exec("CREATE TABLE IF NOT EXISTS kv(k TEXT PRIMARY KEY, v TEXT)")
        db.exec("INSERT INTO kv VALUES(?, ?)", "key1", "value1")
        ret = db.exec("SELECT * FROM kv")
        db.close()
    """
    def read(self, timeout: Optional[int] = None) -> Optional[Union[str, bytes]]:
        """Read data from the connection.

        Args:
            timeout: Timeout in milliseconds. Omit for blocking read, pass ``-1`` for non-blocking.

        Returns:
            Data read from the connection. Returns ``None`` on timeout or no data available.
            Returns empty string ``""`` when the connection is closed.
        """
        ...

    def write(self, data: Union[str, bytes]) -> None:
        """Write data to the connection.

        Args:
            data: Data to send (string or binary data).
        """
        ...

    def exec(self, sql: str, *extra: object) -> Optional[IDBExecRet]:
        """Execute SQL statement (database connections) or KVDB operations.

        KVDB supported commands: ``"get key"``, ``"set key value"``, ``"del key"``,
        ``"scan prefix limit"``, ``"range startKey endKey limit"``.

        Args:
            sql: SQL statement or KVDB command.
            *extra: Binding values for SQL parameterized queries.

        Returns:
            Query result object, ``None`` on failure.

        Example::

            ret = db.exec("SELECT * FROM users WHERE age > ?", 18)
            db.exec("set mykey myvalue")
        """
        ...

    def fd(self) -> int:
        """Get the file descriptor number of the connection.

        Returns:
            File descriptor number.
        """
        ...

    def close(self) -> None:
        """Close the connection and release resources."""
        ...

class IEventMsg:
    """Event loop message structure, returned by ``EventLoop()``.

    Contains information about events such as market updates, thread messages,
    WebSocket data, etc.
    """
    Seq: int
    """Event sequence number."""
    Event: str
    """Event type, such as ``"ticker"``, ``"order"``, ``"thread"``, etc."""
    ThreadId: int
    """Thread ID that triggered the event."""
    Index: int
    """Exchange index."""
    Nano: int
    """Event time (nanoseconds)."""
    Symbol: str
    """Related trading pair."""
    Ticker: Optional[ITicker]
    """If it's a market event, contains Ticker data."""

class IChart:
    """Chart object for drawing custom charts on the strategy page.

    Created via ``Chart()`` or ``KLineChart()``.

    Example::

        chart = Chart({
            "title": {"text": "Price Trend"},
            "xAxis": {"type": "datetime"},
            "series": [{"name": "Price", "data": []}]
        })
        chart.add(0, [Unix() * 1000, ticker.Last])
    """
    def add(self, series: int, data: Union[list[object], object], index: Optional[int] = None) -> None:
        """Add a data point to the specified series.

        Args:
            series: Series index (starting from 0).
            data: Data point. Format depends on chart type (e.g. ``[timestamp, value]``).
            index: Update data point at specified index. Omit to append.
                ``-1`` to update the last point.
        """
        ...

    def reset(self, remain: Optional[int] = None) -> None:
        """Reset chart data.

        Args:
            remain: Number of recent data points to retain. Defaults to 0 (clear all).
        """
        ...

    def update(self, options: object) -> None:
        """Update chart configuration options.

        Args:
            options: New chart configuration (Highcharts/Highstock configuration object).
        """
        ...

class IHttpOptions:
    """HTTP request options for ``HttpQuery()``.

    Example::

        ret = HttpQuery("https://api.example.com/data", {
            "method": "POST",
            "body": json.dumps({"key": "value"}),
            "headers": {"Content-Type": "application/json"},
            "timeout": 5000,
            "debug": True
        })
    """
    method: Optional[str]
    """HTTP method: ``"GET"``, ``"POST"``, ``"PUT"``, ``"DELETE"``, etc. Default ``"GET"``."""
    body: Optional[Union[str, bytes]]
    """Request body (used for POST and other methods)."""
    charset: Optional[str]
    """Response character encoding conversion (e.g. ``"gbk"``)."""
    cookie: Optional[str]
    """Cookie string."""
    profile: Optional[str]
    """TLS fingerprint configuration."""
    debug: Optional[bool]
    """When ``True``, returns full response object (including status code and headers)."""
    format: Optional[str]
    """Output format for response body: ``"base64"`` or ``"hex"``."""
    close: Optional[bool]
    """Whether to close connection after request (disable keep-alive)."""
    headers: Optional[dict[str, object]]
    """Custom request headers."""
    timeout: Optional[int]
    """Request timeout in milliseconds."""

class IHttpRet:
    """Full HTTP response structure returned by ``HttpQuery()`` in debug mode."""
    StatusCode: int
    """HTTP status code, such as 200, 404, 500."""
    Trace: Optional[object]
    """Request trace information (available in debug mode)."""
    Header: dict[str, list[str]]
    """Response headers dict. Each key maps to a list of strings."""
    Body: Optional[Union[str, bytes]]
    """Response body content. ``None`` when request fails."""

# ==================== Global Variables ====================

ext = object()
"""Template class library domain. Used for accessing template library functions."""

TA = ITA()
"""FMZ built-in technical analysis library, containing simplified versions of common indicators
(KDJ, BOLL, MACD, EMA, SMA, RSI, etc.)."""

exchanges: list[IExchange] = [IExchange()]
"""List of all added exchange objects. Access the i-th exchange via ``exchanges[i]``."""

exchange: IExchange = exchanges[0]
"""First (default) exchange object, equivalent to ``exchanges[0]``."""

# ==================== Global Functions ====================

def Version() -> str:
    """Get the docker version number.

    Returns:
        Version number string, e.g. ``"3.7"``.
    """
    ...

def Sleep(millisecond: int) -> None:
    """Pause strategy execution for the specified number of milliseconds.

    Pending events in the event loop are processed during the pause.
    It is recommended to add ``Sleep`` in the main strategy loop to avoid
    overly frequent API requests.

    Args:
        millisecond: Number of milliseconds to pause.

    Example::

        while True:
            ticker = exchange.GetTicker()
            Log(ticker.Last)
            Sleep(1000)  # Execute once per second
    """
    ...

def IsVirtual() -> bool:
    """Determine whether currently running in a backtest (simulation) environment.

    Returns:
        ``True`` in backtest environment, ``False`` in live trading.

    Example::

        if IsVirtual():
            Log("Backtest mode")
        else:
            Log("Live trading mode")
    """
    ...

def Mail(smtpServer: str, smtpUsername: str, smtpPassword: str, mailTo: str, title: str, body: str) -> bool:
    """Send email notification via SMTP.

    Args:
        smtpServer: SMTP server address, e.g. ``"smtp.qq.com:465"``.
        smtpUsername: SMTP login username (usually email address).
        smtpPassword: SMTP login password or authorization code.
        mailTo: Recipient email address.
        title: Email subject.
        body: Email body.

    Returns:
        ``True`` on success, ``False`` on failure.

    Example::

        Mail("smtp.qq.com:465", "sender@qq.com", "auth_code",
             "receiver@gmail.com", "Alert", "BTC broke above 50000")
    """
    ...

def SetErrorFilter(filters: str) -> None:
    """Set error message filter regex. Matched error messages will not be logged.

    Commonly used to filter frequent irrelevant errors. Can be called multiple
    times to add multiple filter rules.

    Args:
        filters: Regular expression string. Pass empty string ``""`` to clear all filter rules.

    Example::

        SetErrorFilter("timeout|503|rate limit")
        SetErrorFilter("")  # Clear all filters
    """
    ...

def GetPid() -> int:
    """Get the PID of the current docker process.

    Returns:
        Process ID number.
    """
    ...

def GetLastError() -> Optional[str]:
    """Get the most recent error message and clear it.

    After calling, the error message is consumed and subsequent calls return ``None``.

    Returns:
        Most recent error message string, ``None`` when there is no error.

    Example::

        exchange.GetTicker()
        err = GetLastError()
        if err:
            Log("Error:", err)
    """
    ...

def GetCommand() -> Optional[str]:
    """Get strategy interaction command.

    Used to read interaction commands sent by users on the FMZ platform strategy page.

    Returns:
        Command string (format: ``"button_name:parameter"``), ``None`` when there is no command.

    Example::

        cmd = GetCommand()
        if cmd:
            Log("Received:", cmd)
            parts = cmd.split(":")
            if parts[0] == "buy":
                exchange.Buy(-1, float(parts[1]))
    """
    ...

def GetChannelData(token: str) -> Optional[str]:
    """Get channel data for cross-strategy communication.

    Read data published by other strategies via ``SetChannelData()``.

    Args:
        token: Channel token (used to identify data source).

    Returns:
        Data from the channel, ``None`` if no data available.
    """
    ...

def SetChannelData(value: str) -> None:
    """Set channel data for cross-strategy communication between different bots.

    Publish data to the channel, which can be read by other strategies via ``GetChannelData()``.

    Args:
        value: Data to publish.
    """
    ...

def GetMeta() -> Optional[str]:
    """Get strategy metadata (additional data set when creating the robot).

    Returns:
        Metadata string, ``None`` when there is no data.
    """
    ...

def Dial(address: Union[str, int], timeout: Union[int, dict] = None) -> Optional[IDial]:
    """Create network connection (TCP/WebSocket/database, etc.) for communication with external services.

    Args:
        address: Connection address, supports multiple protocols:

            - WebSocket: ``"wss://stream.binance.com:9443/ws/btcusdt@ticker"``
            - TCP: ``"tcp://host:port"``
            - SQLite: ``"sqlite3:///path/to/db.sqlite3"``
            - MySQL: ``"mysql://user:pass@host:port/dbname"``
            - PostgreSQL: ``"postgres://user:pass@host:port/dbname?sslmode=disable"``
            - KVDB (Pebble): ``"kvdb://"`` or ``"kvdb:///path/to/db"``

            Options can be appended at the end separated by ``|``, e.g.:
            ``"wss://....|compress=gzip_raw&mode=recv"``

        timeout: Connection timeout (milliseconds), default 30000.

    Returns:
        IDial connection object, ``None`` on connection failure.

    Example::

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
    """Send HTTP request.

    When called with a dict as the second argument containing ``debug: True``,
    returns a full IHttpRet response object instead of just the body string.

    Args:
        url: Request URL.
        postData: POST data (automatically becomes POST request when non-empty).
            Can also be a dict of IHttpOptions for advanced usage.
        cookies: Cookie string.
        headers: Request headers, supports string (newline-separated) or dict.

    Returns:
        Response body string, ``None`` on failure. If ``debug=True`` in options,
        returns a dict with ``StatusCode``, ``Header``, ``Body`` fields.

    Example::

        data = HttpQuery("https://api.example.com/ticker")
        if data:
            Log(data)

        # Advanced usage with options
        ret = HttpQuery("https://api.example.com/data", {
            "method": "POST",
            "body": '{"key": "value"}',
            "headers": {"Content-Type": "application/json"},
            "debug": True
        })
    """
    ...

def Encode(algo: str, inputFormat: str, outputFormat: str, data: Union[str, bytes], keyFormat: Optional[str] = None, key: Optional[str] = None) -> Union[str, bytes]:
    """Generic encoding/encryption/signing function.

    Args:
        algo: Algorithm name:

            - Hash: ``"md5"``, ``"sha256"``, ``"sha512"``, ``"sha1"``, ``"keccak256"``
            - HMAC: ``"hmac_md5"``, ``"hmac_sha256"``, ``"hmac_sha512"``
            - Encryption: ``"aes128-cbc"``, ``"aes256-cbc"``, ``"aes192-cbc"``
            - Signature: ``"ed25519"``, ``"ed25519.seed"``
            - Encoding: ``"raw"``, ``"text.encoder"``, ``"text.decoder"``

        inputFormat: Input data format: ``"hex"``, ``"base64"``, ``"raw"``, ``"string"``.
        outputFormat: Output data format: ``"hex"``, ``"base64"``, ``"raw"``, ``"string"``.
        data: Input data.
        keyFormat: Key format (required for encryption): ``"hex"``, ``"base64"``, ``"raw"``, ``"string"``.
        key: Key (required for encryption algorithms).

    Returns:
        Encoded/encrypted result.

    Example::

        sign = Encode("hmac_sha256", "string", "hex", "message", "string", "secret")
        hash_val = Encode("sha256", "string", "hex", "hello")
    """
    ...

def UnixNano() -> int:
    """Get current time as nanosecond-precision timestamp.

    Returns:
        Nanosecond timestamp (e.g. ``1609459200000000000``).

    Example::

        start = UnixNano()
        # ... perform operations ...
        elapsed_ms = (UnixNano() - start) / 1e6
        Log("Elapsed:", elapsed_ms, "ms")
    """
    ...

def Unix() -> int:
    """Get current time as second-precision timestamp.

    Returns:
        Second-precision timestamp (e.g. ``1609459200``).
    """
    ...

def GetOS() -> str:
    """Get operating system and architecture information where the docker is running.

    Returns:
        String in format ``"os/arch"``, e.g. ``"linux/amd64"``, ``"darwin/arm64"``.
    """
    ...

def SysInfo(attr: str) -> object:
    """Get system information.

    Args:
        attr: Information type:

            - ``"pid"``: Process ID
            - ``"ppid"``: Parent process ID
            - ``"ncpu"``: Number of CPU cores
            - ``"arch"``: CPU architecture (e.g. ``"amd64"``)
            - ``"os"``: Operating system (e.g. ``"linux"``)
            - ``"sys_cpu"``: System CPU usage (%)
            - ``"sys_mem"``: System memory information
            - ``"cpu"``: Current process CPU usage
            - ``"mem"``: Current process memory usage
            - ``"threads"``: Current process thread count

    Returns:
        Corresponding system information value.

    Example::

        Log("CPU cores:", SysInfo("ncpu"))
    """
    ...

def MD5(data: str) -> str:
    """Calculate MD5 hash value of a string.

    Args:
        data: String to hash.

    Returns:
        32-character hexadecimal MD5 hash string (lowercase).

    Example::

        Log(MD5("hello"))  # "5d41402abc4b2a76b9719d911017c592"
    """
    ...

def DBExec(sql: str, *extra: object) -> Optional[IDBExecRet]:
    """Execute SQL statement on the strategy's built-in SQLite database.

    Each robot has an independent SQLite database with persistent data storage.
    When SQL starts with ``":"``, uses in-memory database (data lost after restart).

    Args:
        sql: SQL statement. Supports parameterized queries (use ``?`` as placeholder).
        *extra: Binding values for parameterized queries.

    Returns:
        Query result object (containing ``columns`` and ``values``), ``None`` on failure.

    Example::

        DBExec("CREATE TABLE IF NOT EXISTS trades(id INTEGER PRIMARY KEY, price REAL, amount REAL)")
        DBExec("INSERT INTO trades(price, amount) VALUES(?, ?)", 50000, 0.1)
        ret = DBExec("SELECT * FROM trades ORDER BY id DESC LIMIT 10")
        if ret:
            Log("Columns:", ret.columns)
            Log("Data:", ret.values)
    """
    ...

def UUID() -> str:
    """Generate UUID string (includes time component).

    Returns:
        UUID string, e.g. ``"550e8400-e29b-41d4-a716-446655440000"``.
    """
    ...

def EventLoop(timeout: Optional[int] = None) -> Optional[IEventMsg]:
    """Wait for the next event in the event loop (market updates, thread messages, WebSocket data, etc.).

    When the strategy uses WebSocket or multi-threading, ``EventLoop`` is the
    recommended event-driven approach.

    Args:
        timeout: Timeout duration in milliseconds:

            - Not passed or 0: Block waiting until there is an event.
            - Positive number: Wait for specified ms, return ``None`` on timeout.
            - Negative number (-1): Non-blocking, return ``None`` immediately if no event.

    Returns:
        Event message object, ``None`` on timeout or no event.

    Example::

        while True:
            ev = EventLoop(1000)
            if ev:
                Log("Event:", ev.Event, "Exchange:", ev.Index, "Symbol:", ev.Symbol)
    """
    ...

def _G(k: str, v: Optional[object] = None) -> object:
    """Global persistent KV storage. Data is saved in the strategy database and persists after restart.

    Args:
        k: Key name. Pass ``None`` to clear all KV data.
        v: Value (optional):

            - Not passed: Read the value for the key.
            - Pass ``None``: Delete the key.
            - Pass other value: Save key-value pair.

    Returns:
        When reading, returns the corresponding value. When writing, no meaningful return.
        Calling without parameters returns the robot ID.

    Example::

        _G("lastPrice", 50000)          # Save
        price = _G("lastPrice")         # Read -> 50000
        _G("lastPrice", None)           # Delete
    """
    ...

def _D(timestamp: Optional[Union[int, float]] = None, fmt: Optional[str] = None) -> str:
    """Format timestamp to readable date string.

    Args:
        timestamp: Timestamp (milliseconds). Uses current time if not passed.
        fmt: Date format string, default ``"yyyy-MM-dd HH:mm:ss"``.

    Returns:
        Formatted date string.

    Example::

        Log(_D())                     # "2024-01-15 10:30:45"
        Log(_D(1705284645000))        # "2024-01-15 10:30:45"
    """
    ...

def _N(num: float, precision: int = 4) -> float:
    """Number precision truncation (truncates down, no rounding).

    Args:
        num: Number to truncate.
        precision: Number of decimal places to keep.

    Returns:
        Truncated number.

    Example::

        Log(_N(3.14159, 2))   # 3.14
        Log(_N(3.14959, 2))   # 3.14 (no rounding)
    """
    ...

def _Cross(arr1: list[float], arr2: list[float]) -> bool:
    """Determine whether two lines cross (golden cross / death cross).

    Args:
        arr1: Data array of the first line.
        arr2: Data array of the second line.

    Returns:
        Positive number indicates golden cross (arr1 crosses above arr2),
        negative number indicates death cross (arr1 crosses below arr2),
        0 indicates no cross.

    Example::

        ema5 = TA.EMA(records, 5)
        ema20 = TA.EMA(records, 20)
        cross = _Cross(ema5, ema20)
        if cross > 0:
            Log("Golden cross!")
        if cross < 0:
            Log("Death cross!")
    """
    ...

def JSONParse(s: str) -> dict:
    """Safe JSON parsing. Throws exception on parsing failure.

    Args:
        s: JSON string to parse.

    Returns:
        Parsed dict object.

    Example::

        obj = JSONParse('{"price": 50000, "amount": 0.1}')
        Log(obj["price"])  # 50000
    """
    ...

def Log(s: object, *extra: object) -> None:
    """Output log to the strategy log area.

    Supports special suffix to control log color: append ``"#FF0000"`` to display in red.

    Args:
        s: Log content, supports any type.
        *extra: Additional log parameters, will be appended.

    Example::

        Log("Normal log")
        Log("Red log #FF0000")
        Log("Price:", ticker.Last, "Amount:", 0.1)
    """
    ...

def LogProfit(profit: float, *extra: object) -> None:
    """Record profit data and draw profit curve.

    Args:
        profit: Profit value.
        *extra: Additional log information.

    Example::

        LogProfit(100.5)
        LogProfit(100.5, "Profit from this trade")
    """
    ...

def LogProfitReset(remain: Optional[int] = None) -> None:
    """Reset profit log.

    Args:
        remain: Number of recent records to retain. Default 0 (clear all).

    Example::

        LogProfitReset()     # Clear all
        LogProfitReset(10)   # Keep last 10
    """
    ...

def LogStatus(s: object, *extra: object) -> None:
    """Set strategy status bar information (displayed at the top of the bot page).

    Supports Markdown tables, HTML, and other formats.

    Args:
        s: Status information string.
        *extra: Additional status parameters.

    Example::

        LogStatus("Price: " + str(ticker.Last) + " | Position: " + str(pos.Amount))
    """
    ...

def EnableLog(enable: bool) -> None:
    """Enable or disable log recording.

    Args:
        enable: ``True`` to enable, ``False`` to disable log recording.

    Example::

        EnableLog(False)  # Disable logging (reduce database writes)
        EnableLog(True)   # Re-enable
    """
    ...

def Chart(options: Union[dict, list[dict]]) -> IChart:
    """Create custom chart (based on Highcharts/Highstock) for the strategy page.

    Preferred for charting: supports the full range of chart types (line, column,
    scatter, area, candlestick, ...). Use Chart by default; only use KLineChart
    when you specifically need a Pine-style candlestick/K-line chart.

    Args:
        options: Highcharts/Highstock chart configuration object or list of configs.

    Returns:
        IChart chart object, used to dynamically add data.

    Example::

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
    """Create K-line chart (custom candlestick chart), configuration similar to Pine Script.

    Specialized for K-line (candlestick) charts only — prefer Chart for general
    charting (it covers every chart type).

    Args:
        options: K-line chart configuration object.

    Returns:
        IChart chart object.

    Example::

        chart = KLineChart({"overlay": True})
    """
    ...

def LogReset(remain: Optional[int] = None) -> None:
    """Reset all logs.

    Args:
        remain: Number of recent logs to retain. Default 0 (clear all).

    Example::

        LogReset()      # Clear all logs
        LogReset(100)   # Keep last 100
    """
    ...

def LogVacuum() -> None:
    """Execute VACUUM operation on the strategy database to reclaim space.

    Call after deleting large amounts of logs to reduce database file size.
    """
    ...

T = TypeVar('T')

def _C(func: Callable[..., Optional[T]], *args: object, **kwargs: object) -> T:
    """Fault-tolerant retry function. Automatically retries until a non-None value is returned.

    Commonly used to wrap API calls that may return ``None`` due to network issues.

    Args:
        func: Function to retry calling.
        *args: Arguments to pass to the function.

    Returns:
        Non-None value successfully returned by the function.

    Example::

        # Ensure getting Ticker (retries continuously until success)
        ticker = _C(exchange.GetTicker)
        # Retry with parameters
        depth = _C(exchange.GetDepth, "BTC_USDT")
        account = _C(exchange.GetAccount)
    """
    ...
