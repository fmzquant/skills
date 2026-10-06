# FMZ / botvs Python SDK — API self-check / integration test.
#
# Python port of the canonical Rust self-check (backtest/rust/src/strategy.rs).
# Runs ONCE and logs every SDK call, so a single backtest exercises the whole
# surface. Designed to run BOTH as a backtest and as a live bot:
#   * read-only calls always run (live + backtest);
#   * anything that writes exchange state, places orders, or clears persistent
#     data is gated behind IsVirtual() — so running it live is harmless; run it
#     as a backtest to exercise those paths too.
#
# A handful of deterministic results are verified with check(...), which logs
# [ok]/[FAIL] and tallies a score (so a regression is loud, not silent). We use
# soft checks, NOT assert/Panic, which would tear the bot down mid-run.
#
# On the FMZ platform paste this as a Python strategy — the runtime injects the
# SDK globals (exchange, exchanges, Log, LogStatus, Sleep, _N, _D, _G, MD5, UUID,
# JSONParse, IsVirtual, Version, Chart, KLineChart, the PERIOD_*/ORDER_* consts,
# ...). Do NOT import anything; the globals are already present.
#
# Python notes vs. the Rust reference:
#   * market/account/order calls return a dict-like (dic2obj) or None — guard
#     with `if t:` instead of Rust's Result match.
#   * records are dicts: r[i]["Close"], r[i]["Time"].
#   * KLineChart takes optional args as keyword arguments (color=..., title=...).
#   * a few Rust calls have no Python equivalent (GetEURCNY, exchange.HMAC,
#     params) or are sandbox-stubbed (Encode, StrDecode, DBExec, Dial) — each is
#     marked with a `# not in Python SDK:` / `# sandbox-stubbed:` note.


# --- helpers ---------------------------------------------------------------

# score is a mutable [ok, fail] pair, threaded through check() like Rust's tuple.
def check(name, ok, score):
    if ok:
        score[0] += 1
        Log("[ok]", name)
    else:
        score[1] += 1
        Log("[FAIL]", name)


# mean of `n` closes ending at index `end` (caller ensures end + 1 >= n)
def ma(r, end, n):
    return sum(r[k]["Close"] for k in range(end - n + 1, end + 1)) / n


def main():
    score = [0, 0]

    # ---- globals / runtime meta ----
    Log("=== meta ===")
    Log("Version:", Version(), "GetOS:", GetOS(), "GetPid:", GetPid(), "IsVirtual:", IsVirtual())
    Log("Unix:", Unix(), "UnixNano:", UnixNano(), "_D():", _D(), "_D(0):", _D(0))
    # not in Python SDK: params() — no params global in fmz.py
    Log("GetMeta():", GetMeta())          # returns None in the sandbox
    Log("GetLastError():", GetLastError())  # returns '' in the sandbox
    Log("GetCommand:", GetCommand())      # takes no args in Python; returns ''

    # deterministic checks (pure functions with known answers)
    check("_N(1.23456,2)~=1.23", abs(_N(1.23456, 2) - 1.23) < 1e-9, score)
    check("_N(123.456,0)==123", abs(_N(123.456, 0) - 123.0) < 1e-9, score)
    check("MD5(abc)", MD5("abc") == "900150983cd24fb0d6963f7d28e17f72", score)
    check("_D(0)==epoch", _D(0).endswith("1970-01-01 00:00:00") or "1970-01-01" in _D(0), score)
    check("UUID len==36", len(UUID()) == 36, score)
    check("_Cross up", _Cross([1.0, 2.0, 3.0], [3.0, 2.0, 1.0]) > 0, score)

    # ---- persistent KV (_G), the canonical _G(k?, v?) ----
    Log("=== KV (_G) ===")
    _G("selfcheck_k", "v1")                                  # store a string
    check("_G store/read str", _G("selfcheck_k") == "v1", score)
    _G("selfcheck_n", 42)                                    # store any value
    check("_G store/read int", _G("selfcheck_n") == 42, score)
    _G("selfcheck_n", None)                                  # delete (matches TS _G(k, null))
    check("_G delete", _G("selfcheck_n") is None, score)

    # ---- crypto / encoding ----
    Log("=== crypto ===")
    Log("UUID:", UUID())
    # sandbox-stubbed: Encode logs "not support" and returns None in fmz.py.
    Log("Encode(sha256,hex):", Encode("sha256", "string", "hex", "abc", "", ""))
    # sandbox-stubbed: StrDecode logs "not support" and returns None.
    Log("StrDecode(abc,gbk):", StrDecode("abc", "gbk"))
    # not in Python SDK: exchange.HMAC — no HMAC method on the Exchange class.

    # ---- local DB + JSON (structured, not raw strings) ----
    Log("=== DB / JSON ===")
    # sandbox-stubbed: DBExec logs "not support" and returns None in fmz.py.
    DBExec("CREATE TABLE IF NOT EXISTS selfcheck(id INTEGER PRIMARY KEY, k TEXT)")
    DBExec("INSERT INTO selfcheck(k) VALUES('hello')")
    q = DBExec("SELECT id, k FROM selfcheck ORDER BY id DESC LIMIT 3")
    Log("DBExec ->", q)
    # JSONParse: parse arbitrary JSON into a Python object (dict/list).
    j = JSONParse('{"a":1,"b":[true,"x"],"c":{"d":2.5}}')
    if j is not None:
        check("JSONParse a==1", j["a"] == 1, score)
        check("JSONParse b[1]==x", j["b"][1] == "x", score)
        check("JSONParse c.d==2.5", j["c"]["d"] == 2.5, score)
    else:
        check("JSONParse parsed", False, score)

    # ---- logging ----
    Log("=== logging ===")
    LogProfit(0.0)
    LogStatus("self-check running @", _D())
    # Mail with empty args won't send — just exercises the binding (returns True).
    Log("Mail(empty) ->", Mail("", "", "", "", "", ""))
    EnableLog(True)
    SetErrorFilter("")
    # HttpQuery returns 'dummy' in the sandbox (no real request).
    body = HttpQuery("https://www.fmz.com")
    Log("HttpQuery body:", body, "len:", len(body) if body else 0)

    # ---- exchanges / instrument info ----
    Log("=== exchanges (", len(exchanges), ") ===")
    for i in range(len(exchanges)):
        e = exchanges[i]
        Log("exchange", i, "Name:", e.GetName(), "Currency:", e.GetCurrency(), "Period(s):", e.GetPeriod())
    Log("GetName:", exchange.GetName(), "GetLabel:", exchange.GetLabel())
    Log(
        "GetCurrency:", exchange.GetCurrency(),
        "Quote:", exchange.GetQuoteCurrency(),
        "Base:", exchange.GetBaseCurrency(),
        "GetBase:", exchange.GetBase(),
    )
    Log("GetContractType:", exchange.GetContractType())
    markets = exchange.GetMarkets()  # symbol -> Market dict
    Log("GetMarkets:", len(markets), "pairs")
    if markets:
        sym = next(iter(markets))
        Log("  sample:", sym, "->", markets[sym])
    Log("GetPeriod(s):", exchange.GetPeriod())
    Log("GetUSDCNY:", exchange.GetUSDCNY())
    # not in Python SDK: GetEURCNY — only GetUSDCNY exists on the Exchange class.

    # ---- market data (default pair = ''; pass a symbol string to override) ----
    Log("=== market data ===")
    last_price = 0.0
    t = exchange.GetTicker()
    if t:
        Log("GetTicker: Last", t["Last"], "Buy", t["Buy"], "Sell", t["Sell"], "Vol", t["Volume"])
        last_price = t["Last"]
    else:
        Log("GetTicker -> None")
    tickers = exchange.GetTickers()
    Log("GetTickers:", len(tickers) if tickers else 0)
    d = exchange.GetDepth()
    if d:
        Log("GetDepth: asks", len(d["Asks"]), "bids", len(d["Bids"]))
    else:
        Log("GetDepth -> None")
    r = exchange.GetRecords()
    if r:
        Log("GetRecords(default):", len(r), "bars")
        last = r[len(r) - 1]
        Log("  last:", _D(last["Time"] // 1000), "O", last["Open"], "H", last["High"],
            "L", last["Low"], "C", last["Close"])
    else:
        Log("GetRecords -> None")
    r5 = exchange.GetRecords(PERIOD_M5, 50)  # int first-arg form: (period, limit)
    Log("GetRecords(M5, limit 50):", len(r5) if r5 else 0)
    trades = exchange.GetTrades()
    Log("GetTrades:", len(trades) if trades else 0)
    fundings = exchange.GetFundings()
    Log("GetFundings:", len(fundings) if fundings else 0)

    # ---- account / assets / positions ----
    Log("=== account ===")
    a = exchange.GetAccount()
    if a:
        Log("GetAccount: Balance", a["Balance"], "Stocks", a["Stocks"], "Equity", a["Equity"], "UPnL", a["UPnL"])
    else:
        Log("GetAccount -> None")
    assets = exchange.GetAssets()
    Log("GetAssets:", len(assets) if assets else 0)
    positions = exchange.GetPositions()
    Log("GetPositions:", len(positions) if positions else 0)

    # ---- async (Go) + inter-routine channel + data store ----
    Log("=== async / channel / data ===")
    # Launch GetTicker on every exchange concurrently, then collect. Python Go()
    # takes the method NAME as a string and returns an AsyncRet; wait(timeout)
    # returns a (value, ok) tuple.
    routines = [e.Go("GetTicker") for e in exchanges]
    for i in range(len(routines)):
        tk, ok = routines[i].wait(0)
        if ok and tk:
            Log("Go GetTicker[", i, "] -> Last", tk["Last"])
        else:
            Log("Go GetTicker[", i, "] -> no data")
    SetChannelData('{"hello":1}')
    Log("GetChannelData:", GetChannelData(""))
    gd = exchange.GetData("selfcheck")
    if gd:
        Log("GetData: Time", gd["Time"], "Data", gd["Data"])
    else:
        Log("GetData -> None")

    # ---- chart (works live + backtest) ----
    Log("=== chart ===")
    # Python Chart takes a config OBJECT (dict), not a JSON string; update()
    # REPLACES the whole config, so pass the full cfg each time.
    cfg = {"chart": {"type": "line"}, "title": {"text": "self-check"},
           "series": [{"name": "price", "data": []}]}
    chart = Chart(cfg)
    chart.reset(0)
    chart.add(0, [Unix() * 1000, last_price], -1)  # append a 2-element point
    chart.update(cfg)
    # exchange.Log draws a simulated-trade marker on the chart (NOT a real order).
    exchange.Log(ORDER_TYPE_BUY, last_price, 0.01)

    # ---- KLineChart (full Pine-method exercise, single pass) ----
    Log("=== KLineChart ===")
    kc = KLineChart({"overlay": True})  # plots overlay the candles by default
    kbars = 0
    ksignals = 0
    kr = exchange.GetRecords()
    if kr and len(kr) >= 10:
        n = len(kr)
        for i in range(n):
            bar = kr[i]
            kc.begin(bar)

            # --- overlay: MA5 / MA10 + a reference hline ---
            p5 = -1
            p10 = -1
            if i >= 4:
                p5 = kc.plot(ma(kr, i, 5), color="#e91e63", title="MA5")
            if i >= 9:
                p10 = kc.plot(ma(kr, i, 10), color="#2196f3", title="MA10")
            kc.hline(kr[0]["Close"], color="#888888", linestyle="dashed", title="base")

            # --- subpane (overlay=False): (close-open) histogram + echo candle ---
            kc.plot(bar["Close"] - bar["Open"], style="histogram", color="#26a69a", title="delta", overlay=False)
            kc.plotcandle(bar["Open"], bar["High"], bar["Low"], bar["Close"], title="echo", color="#9e9e9e", overlay=False)

            # --- cross detection ---
            up = False
            down = False
            if i >= 10:
                a5p = ma(kr, i - 1, 5)
                a10p = ma(kr, i - 1, 10)
                a5 = ma(kr, i, 5)
                a10 = ma(kr, i, 10)
                up = a5p <= a10p and a5 > a10
                down = a5p >= a10p and a5 < a10

            # --- markers on the candles ---
            kc.plotshape(up, style="triangleup", location="belowbar", color="#4caf50", title="golden")
            kc.plotchar(down, char="D", location="abovebar", color="#f44336", title="dead")
            kc.plotarrow(bar["Close"] - bar["Open"], title="delta-arrow")

            # --- bar / background coloring ---
            if up:
                kc.barcolor("#4caf50")
            if down:
                kc.bgcolor("rgba(244,67,54,0.10)")

            # --- fill the band between the two MAs ---
            if p5 >= 0 and p10 >= 0:
                kc.fill(p5, p10, color="rgba(120,120,255,0.18)")

            # --- trade signals ---
            if up:
                kc.signal("buy", bar["Close"], 1)
                ksignals += 1
            if down:
                kc.signal("sell", bar["Close"], 1)
                ksignals += 1

            kc.close()  # pack OHLCV + this bar's plots/signals into a candle
            kbars += 1
    Log("KLineChart: bars plotted:", kbars, "| signals:", ksignals)

    # ---- exchange config writes (backtest only) ----
    if IsVirtual():
        Log("=== config writes (virtual) ===")
        # _C retries until truthy (GetTicker succeeds on the first try in a backtest).
        _C(exchange.GetTicker)
        exchange.SetCurrency("BTC_USDT")
        exchange.SetData("selfcheck", '{"k":1}')
        Log("SetBase ->", exchange.SetBase("https://example.com"))
        Log("SetRate ->", exchange.SetRate(1.0))
        exchange.SetPrecision(2, 4)
        exchange.SetMaxBarLen(1000)
        exchange.SetMarginLevel(10)     # int accepted (level-only form swaps args)
        exchange.SetMarginLevel(10.0)   # float accepted
        Log("GetRate:", exchange.GetRate())
        exchange.SetTimeout(5000)
        LogProfitReset(0)
        # sandbox-stubbed: Dial logs "not support" and returns None in fmz.py;
        # exercise the binding without any real I/O.
        Log("Dial ->", Dial("wss://stream.example.com"))
        ct = exchange.SetContractType("swap")
        Log("SetContractType:", ct)
        Log("SetDirection:", exchange.SetDirection("buy"))
        Log("config writes done")
    else:
        Log("=== config writes skipped (live) ===")

    # ---- trading (backtest only) ----
    if IsVirtual():
        Log("=== trading (virtual) ===")
        tk = exchange.GetTicker()
        px = tk["Sell"] if tk else 0.0

        # A resting limit buy far below market stays open, so ModifyOrder and the
        # cancel sweep below have a live order to act on.
        bid = px * 0.5
        bid_id = exchange.Buy(bid, 0.01)
        if bid_id:
            Log("Buy(limit) id:", bid_id)
            o = exchange.GetOrder(bid_id)
            if o:
                Log("GetOrder: price", o["Price"], "amount", o["Amount"], "status", o["Status"], "type", o["Type"])
            else:
                Log("GetOrder -> None")
            # ModifyOrder requires `side` — the engine reads it as the order side.
            nid = exchange.ModifyOrder(bid_id, "buy", bid * 1.01, 0.02)
            Log("ModifyOrder id:", nid)
        else:
            Log("Buy -> None")
        # Market-ish sell + a plain CreateOrder (symbol "" = the configured pair).
        Log("Sell id:", exchange.Sell(px, 0.01))
        Log("CreateOrder id:", exchange.CreateOrder("", "buy", bid, 0.01))
        # Cancel everything still open.
        orders = exchange.GetOrders()
        if orders:
            Log("GetOrders:", len(orders), "open — cancelling")
            for o in orders:
                Log("  CancelOrder", o["Id"], "->", exchange.CancelOrder(o["Id"]))
        else:
            Log("GetOrders: none open")
        ho = exchange.GetHistoryOrders()
        Log("GetHistoryOrders:", len(ho) if ho else 0)

        # conditional (stop-loss) orders — condition is a Python dict.
        cond = {
            "ConditionType": ORDER_CONDITION_TYPE_SL,
            "SlTriggerPrice": px * 0.9,
            "SlOrderPrice": px * 0.89,
        }
        cid = exchange.CreateConditionOrder("", "buy", 0.01, cond)
        if cid:
            Log("CreateConditionOrder id:", cid)
            Log("ModifyConditionOrder id:", exchange.ModifyConditionOrder(cid, "buy", 0.02, cond))
            co = exchange.GetConditionOrder(cid)
            if co:
                Log("GetConditionOrder: amount", co["Amount"], "status", co["Status"])
            else:
                Log("GetConditionOrder -> None")
            Log("CancelConditionOrder ->", exchange.CancelConditionOrder(cid))
        else:
            Log("CreateConditionOrder -> None")
        cos = exchange.GetConditionOrders()
        Log("GetConditionOrders:", len(cos) if cos else 0)
        hco = exchange.GetHistoryConditionOrders()
        Log("GetHistoryConditionOrders:", len(hco) if hco else 0)

        # raw exchange IO passthrough (live-oriented; engine implements a subset).
        # In Python, IO("currency", x) routes to SetCurrency.
        Log("IO(currency,USDT):", exchange.IO("currency", "USDT"))

        # Persistent store can be wiped wholesale, but only in a backtest — in
        # live this would erase the user's saved data, so it stays gated here.
        # NOTE: in the Python SDK the wipe is _G(None) (no-arg _G() returns 1).
        _G(None)
        Log("_G(None) cleared the KV store")
    else:
        Log("=== trading skipped (live; gated by IsVirtual) ===")

    Sleep(1000)
    LogStatus("self-check done @", _D())
    Log("=== self-check complete:", score[0], "ok,", score[1], "failed ===")
