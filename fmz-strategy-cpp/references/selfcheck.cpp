// FMZ/botvs C++ SDK — API self-check / integration test.
//
// A faithful port of the canonical Rust self-check
// (backtest/rust/src/strategy.rs). Runs ONCE and logs every SDK call, so a
// single build exercises the whole surface (kept in parity with the Rust SDK +
// the canonical TS API). Designed to run BOTH as a backtest and as a live bot:
//   * read-only calls always run (live + backtest);
//   * anything that writes exchange state, places orders, or clears persistent
//     data is gated behind IsVirtual() — so running it live is harmless; run it
//     as a backtest to exercise those paths too.
//
// A handful of deterministic results are verified with check(...), which logs
// `[ok]`/`[FAIL]` and tallies a score (so a regression is loud, not silent). We
// deliberately use soft checks, not Panic(), which would tear the bot down
// mid-run.
//
// On the FMZ platform paste this as a C++ strategy — the runtime injects the
// SDK bundle, so no #include is needed. Entry point is `void main()`; globals
// `exchange`, `exchanges` are injected.
//
// C++ idioms differ from Rust: there is NO Result — market/account/order calls
// return objects extending TBase (check `.Valid`); records are a Records vector
// (`.size()`, `r[i].Close`, `r[i].Time`). _G(k,v) is the persistent KV.

// ---- soft-check scoreboard (mirrors the Rust `check(name, ok, &mut score)`) ----
static long _okCount = 0;
static long _failCount = 0;

void check(const string &name, bool ok) {
    if (ok) {
        _okCount++;
        Log("[ok]", name);
    } else {
        _failCount++;
        Log("[FAIL]", name);
    }
}

// mean of `n` closes ending at index `end` (caller ensures end + 1 >= n) — used
// by the KLineChart section below.
double ma(Records &r, int end, int n) {
    double s = 0;
    for (int k = end - n + 1; k <= end; k++) s += r[k].Close;
    return s / n;
}

// Auto-run once before main() — the C++ SDK maps `init()` -> plugin_oninit,
// called by the runtime (no registration needed).
void init() {
    Log("[init] self-check starting");
}

// Auto-run when the strategy stops / the backtest ends — `onexit()` maps to
// plugin_onexit.
void onexit() {
    Log("[onexit] self-check finished");
}

void main() {
    // ---- globals / runtime meta ----
    Log("=== meta ===");
    Log("Version:", Version(), "GetOS:", GetOS(), "GetPid:", GetPid(), "IsVirtual:", IsVirtual());
    Log("Unix:", Unix(), "UnixNano:", UnixNano(), "_D():", _D(), "_D(0):", _D(0));
    // No params() in the C++ SDK; strategy params arrive in the __jsargv json global.
    Log("params (__jsargv):", __jsargv.dump());
    Log("GetMeta():", GetMeta());
    Log("GetLastError():", GetLastError());
    // C++ GetCommand() takes no index arg (Rust GetCommand(0)); returns "" when none.
    {
        string cmd = GetCommand();
        if (cmd.size() > 0) Log("GetCommand:", cmd);
        else Log("GetCommand: (none)");
    }

    // deterministic checks (pure functions with known answers)
    check("_N(1.23456,2)~1.23", fabs(_N(1.23456, 2) - 1.23) < 1e-9);
    check("_N(123.456,0)==123", fabs(_N(123.456, 0) - 123.0) < 1e-9);
    check("MD5(abc)", MD5("abc") == "900150983cd24fb0d6963f7d28e17f72");
    check("_D(0)==epoch", _D(0) == "1970-01-01 08:00:00" || _D(0).find("1970-01-01") == 0);
    check("UUID len in {26,36}", UUID().size() == 36 || UUID().size() == 26);

    // ---- persistent KV (_G), the canonical `_G(k?, v?)` ----
    Log("=== KV (_G) ===");
    _G("selfcheck_k", "v1");                          // store a string
    check("_G store/read str", _G("selfcheck_k") == "v1");
    _G("selfcheck_n", 42);                            // store any json value
    check("_G store/read int", _G("selfcheck_n") == 42);
    _G("selfcheck_n", nullptr);                       // delete (matches TS _G(k, null))
    check("_G delete", _G("selfcheck_n").is_null());

    // ---- crypto / encoding ----
    Log("=== crypto ===");
    Log("UUID:", UUID());
    Log("Encode(sha256,hex):", Encode("sha256", "string", "hex", "abc", "", ""));
    Log("StrDecode(abc,gbk):", StrDecode("abc", "gbk"));

    // ---- local DB + JSON (structured, not raw strings) ----
    Log("=== DB / JSON ===");
    DBExec("CREATE TABLE IF NOT EXISTS selfcheck(id INTEGER PRIMARY KEY, k TEXT)");
    DBExec("INSERT INTO selfcheck(k) VALUES('hello')");
    json q = DBExec("SELECT id, k FROM selfcheck ORDER BY id DESC LIMIT 3"); // -> {columns, values}
    {
        size_t cols = q.contains("columns") && q["columns"].is_array() ? q["columns"].size() : 0;
        size_t rows = q.contains("values") && q["values"].is_array() ? q["values"].size() : 0;
        Log("DBExec: columns", cols, "rows", rows);
        if (rows > 0) {
            json row = q["values"][0];
            Log("  latest row: id", row.size() > 0 ? row[0].dump() : "?",
                "k", row.size() > 1 ? row[1].dump() : "?");
        }
    }
    // JSONParse: parse arbitrary JSON (e.g. a struct's Info field) into a json value.
    // Uses the C++ JSON (json::parse under the hood); guard against parse_error.
    try {
        json j = JSONParse(R"({"a":1,"b":[true,"x"],"c":{"d":2.5}})");
        check("JSONParse a==1", j["a"] == 1);
        check("JSONParse b[1]==x", j["b"][1] == "x");
        check("JSONParse c.d==2.5", j["c"]["d"] == 2.5);
    } catch (json::exception &e) {
        check("JSONParse parsed", false);
    }

    // ---- logging ----
    Log("=== logging ===");
    LogProfit(0.0);
    LogStatus("self-check running @", _D());
    // Mail with empty args won't send — just exercises the binding.
    Log("Mail(empty) ->", Mail("", "", "", "", "", ""));
    EnableLog(true);
    SetErrorFilter("");
    // HttpQuery makes a real request (may be firewalled / empty in backtest).
    // C++ returns the body string (no separate HttpRet full-response type).
    Log("HttpQuery body len:", HttpQuery("https://www.fmz.com").size());

    // ---- exchanges / instrument info ----
    Log("=== exchanges (", exchanges.size(), ") ===");
    for (size_t i = 0; i < exchanges.size(); i++) {
        Exchange &e = exchanges[i];
        Log("exchange", i, "Name:", e.GetName(), "Currency:", e.GetCurrency(), "Period(s):", e.GetPeriod());
    }
    Log("GetName:", exchange.GetName(), "GetLabel:", exchange.GetLabel());
    Log("GetCurrency:", exchange.GetCurrency(),
        "Quote:", exchange.GetQuoteCurrency(),
        "Base:", exchange.GetBaseCurrency(),
        "GetBase:", exchange.GetBase());
    Log("GetContractType:", exchange.GetContractType());
    json markets = exchange.GetMarkets(); // symbol -> Market object (not a string)
    Log("GetMarkets:", markets.is_object() ? markets.size() : 0, "pairs");
    if (markets.is_object() && markets.size() > 0) {
        auto it = markets.begin();
        Log("  sample:", it.key(), it.value().dump());
    }
    Log("GetPeriod(s):", exchange.GetPeriod());
    Log("HMAC(sha256):", exchange.HMAC("sha256", "hex", "data", "key"));
    Log("GetUSDCNY:", exchange.GetUSDCNY(), "GetEURCNY:", exchange.GetEURCNY());
    {
        vector<double> a = {1.0, 2.0, 3.0};
        vector<double> b = {3.0, 2.0, 1.0};
        Log("_Cross([1,2,3],[3,2,1]):", _Cross(a, b));
    }

    // ---- market data (default pair = ""; pass a symbol string to override) ----
    Log("=== market data ===");
    double last_price = 0.0;
    {
        Ticker t = exchange.GetTicker();
        if (t.Valid) {
            Log("GetTicker: Last", t.Last, "Buy", t.Buy, "Sell", t.Sell, "Vol", t.Volume);
            last_price = t.Last;
        } else {
            Log("GetTicker err:", GetLastError());
        }
    }
    {
        Tickers t = exchange.GetTickers();
        if (t.Valid) Log("GetTickers:", t.size());
        else Log("GetTickers err:", GetLastError());
    }
    {
        Depth d = exchange.GetDepth();
        if (d.Valid) Log("GetDepth: asks", d.Asks.size(), "bids", d.Bids.size());
        else Log("GetDepth err:", GetLastError());
    }
    {
        Records &r = exchange.GetRecords();
        if (r.Valid) {
            Log("GetRecords(default):", r.size(), "bars");
            if (r.size() > 0) {
                Record &last = r[r.size() - 1];
                Log("  last:", _D(last.Time), "O", last.Open, "H", last.High, "L", last.Low, "C", last.Close);
            }
        } else {
            Log("GetRecords err:", GetLastError());
        }
    }
    {
        // period/limit variant: PERIOD_M5 seconds, limit 50.
        Records &r = exchange.GetRecords(PERIOD_M5, 50);
        if (r.Valid) Log("GetRecords(M5, limit 50):", r.size());
        else Log("GetRecords(M5) err:", GetLastError());
    }
    {
        Trades t = exchange.GetTrades();
        if (t.Valid) Log("GetTrades:", t.size());
        else Log("GetTrades err:", GetLastError());
    }
    {
        Fundings f = exchange.GetFundings();
        if (f.Valid) Log("GetFundings:", f.size());
        else Log("GetFundings err:", GetLastError());
    }

    // ---- account / assets / positions ----
    Log("=== account ===");
    {
        Account a = exchange.GetAccount();
        if (a.Valid) Log("GetAccount: Balance", a.Balance, "Stocks", a.Stocks, "Equity", a.Equity, "UPnL", a.UPnL);
        else Log("GetAccount err:", GetLastError());
    }
    {
        Assets a = exchange.GetAssets();
        if (a.Valid) Log("GetAssets:", a.size());
        else Log("GetAssets err:", GetLastError());
    }
    {
        Positions p = exchange.GetPositions();
        if (p.Valid) Log("GetPositions:", p.size());
        else Log("GetPositions err:", GetLastError());
    }

    // ---- async (Go) + inter-routine channel + data store ----
    Log("=== async / channel / data ===");
    // Launch GetTicker on every exchange concurrently, then collect.
    {
        vector<GoObj> routines;
        for (size_t i = 0; i < exchanges.size(); i++) {
            routines.push_back(exchanges[i].Go("GetTicker"));
        }
        for (size_t i = 0; i < routines.size(); i++) {
            Ticker t;
            if (routines[i].wait(t, 0) && t.Valid) {
                Log("Go GetTicker[", i, "] -> Last", t.Last);
            } else {
                Log("Go GetTicker[", i, "] err:", GetLastError());
            }
        }
    }
    SetChannelData("{\"hello\":1}");
    Log("GetChannelData:", GetChannelData());
    {
        Data d = exchange.GetData("selfcheck");
        if (d.Valid) Log("GetData: Time", d.Time, "Data", d.Data.dump());
        else Log("GetData err (none yet):", GetLastError());
    }

    // ---- chart (works live + backtest) ----
    Log("=== chart ===");
    // Match the C++/JS working shape: chart.type + each series carries data:[].
    string cfg = R"({"chart":{"type":"line"},"title":{"text":"self-check"},"series":[{"name":"price","data":[]}]})";
    {
        Chart chart = Chart(cfg);
        chart.reset(0);
        chart.add(0, {(double)(Unix() * 1000), last_price}, -1); // append a point (2-element form)
        chart.update(cfg); // update() REPLACES the whole config — pass the full cfg, else the series is lost
    }
    // exchange.Log draws a simulated-trade marker on the chart (NOT a real order).
    exchange.Log(ORDER_TYPE_BUY, last_price, 0.01);

    // ---- the full KLineChart section (Pine-style candlestick plotter) ----
    // Single pass: get records once, iterate them once plotting MA5/MA10 + a
    // fill, a reference hline, a subpane histogram + echo candle, golden/dead
    // cross shapes & chars, delta arrows, bar/bg coloring, and buy/sell signals.
    Log("=== KLineChart ===");
    {
        KLineChart kchart(json({{"overlay", true}})); // plots overlay the candles by default
        long bars = 0, signals = 0;
        Records &r = exchange.GetRecords();
        if (r.size() < 10) {
            Log("KLineChart: not enough bars (", r.size(), ") — skipping plot pass");
        } else {
            int n = (int)r.size();
            for (int i = 0; i < n; i++) {
                Record &bar = r[i];
                kchart.begin(bar);

                // --- overlay: MA5 / MA10 + a reference hline ---
                int p5 = -1, p10 = -1;
                if (i >= 4)  p5  = kchart.plot(ma(r, i, 5),  {{"color", "#e91e63"}, {"title", "MA5"}});
                if (i >= 9)  p10 = kchart.plot(ma(r, i, 10), {{"color", "#2196f3"}, {"title", "MA10"}});
                kchart.hline(r[0].Close, {{"color", "#888888"}, {"linestyle", "dashed"}, {"title", "base"}});

                // --- subpane (overlay:false): a (close-open) histogram + an echo candle ---
                kchart.plot(bar.Close - bar.Open, {{"style", "histogram"}, {"color", "#26a69a"}, {"title", "delta"}, {"overlay", false}});
                kchart.plotcandle(bar.Open, bar.High, bar.Low, bar.Close, {{"title", "echo"}, {"color", "#9e9e9e"}, {"overlay", false}});

                // --- cross detection ---
                bool up = false, down = false;
                if (i >= 10) {
                    double a5p = ma(r, i - 1, 5), a10p = ma(r, i - 1, 10);
                    double a5  = ma(r, i, 5),     a10  = ma(r, i, 10);
                    up   = a5p <= a10p && a5 > a10;
                    down = a5p >= a10p && a5 < a10;
                }

                // --- markers on the candles ---
                kchart.plotshape(up,  {{"style", "triangleup"}, {"location", "belowbar"}, {"color", "#4caf50"}, {"title", "golden"}});
                kchart.plotchar(down, {{"char", "D"}, {"location", "abovebar"}, {"color", "#f44336"}, {"title", "dead"}});
                kchart.plotarrow(bar.Close - bar.Open, {{"title", "delta-arrow"}});

                // --- bar / background coloring ---
                if (up)   kchart.barcolor("#4caf50");
                if (down) kchart.bgcolor("rgba(244,67,54,0.10)");

                // --- fill the band between the two MAs ---
                if (p5 >= 0 && p10 >= 0) kchart.fill(p5, p10, {{"color", "rgba(120,120,255,0.18)"}});

                // --- trade signals ---
                if (up)   { kchart.signal("buy",  bar.Close, 1); signals++; }
                if (down) { kchart.signal("sell", bar.Close, 1); signals++; }

                kchart.close(); // pack OHLCV + this bar's plots/signals into a candle
                bars++;
            }
            Log("KLineChart: bars plotted", bars, "| signals", signals);
        }
    }

    // ---- exchange config writes (backtest only) ----
    if (IsVirtual()) {
        Log("=== config writes (virtual) ===");
        // _C retries until valid (GetTicker succeeds on the first try in a backtest).
        _C(exchange.GetTicker);
        exchange.SetCurrency("BTC_USDT");
        exchange.SetData("selfcheck", "{\"k\":1}");
        Log("SetBase ->", exchange.SetBase("https://example.com"));
        Log("SetRate ->", exchange.SetRate(1.0));
        exchange.SetPrecision(2, 4);
        exchange.SetMaxBarLen(1000);
        exchange.SetMarginLevel(10.0); // float accepted (also a (symbol,double) overload)
        Log("GetRate:", exchange.GetRate());
        exchange.SetTimeout(5000);
        LogProfitReset(0);
        // Dial is live-only; in a backtest TSocket_* is stubbed, so this is an
        // already-closed handle — exercise the binding without any real I/O.
        {
            Dial conn("wss://stream.example.com");
            Log("Dial valid (backtest stub -> false):", conn.Valid, "closed:", conn.isClosed);
            conn.close();
        }
        Log("SetContractType:", exchange.SetContractType("swap").dump());
        exchange.SetDirection("buy"); // C++ SetDirection returns void
        Log("SetDirection(buy) done");
        Log("config writes done");
    } else {
        Log("=== config writes skipped (live) ===");
    }

    // ---- trading (backtest only) ----
    if (IsVirtual()) {
        Log("=== trading (virtual) ===");
        double px = 0.0;
        {
            Ticker t = exchange.GetTicker();
            if (t.Valid) px = t.Sell;
        }

        // A resting limit buy far below market stays open, so ModifyOrder and the
        // cancel sweep below have a live order to act on.
        double bid = px * 0.5;
        {
            TId id = exchange.Buy(bid, 0.01);
            if (id.Valid) {
                Log("Buy(limit) id:", (string)id);
                Order o = exchange.GetOrder(id);
                if (o.Valid) Log("GetOrder: price", o.Price, "amount", o.Amount, "status", o.Status, "type", o.Type);
                else Log("GetOrder err:", GetLastError());
                // ModifyOrder requires `side` — the engine reads v[2] as the side,
                // so this also guards the arg-alignment fix.
                TId nid = exchange.ModifyOrder(id, "buy", bid * 1.01, 0.02);
                if (nid.Valid) Log("ModifyOrder id:", (string)nid);
                else Log("ModifyOrder err:", GetLastError());
            } else {
                Log("Buy err:", GetLastError());
            }
        }
        // Market-ish sell + a plain CreateOrder (symbol "" = the configured pair).
        {
            TId id = exchange.Sell(px, 0.01);
            if (id.Valid) Log("Sell id:", (string)id);
            else Log("Sell err:", GetLastError());
        }
        {
            TId id = exchange.CreateOrder("", "buy", bid, 0.01);
            if (id.Valid) Log("CreateOrder id:", (string)id);
            else Log("CreateOrder err:", GetLastError());
        }
        // Cancel everything still open.
        {
            Orders orders = exchange.GetOrders();
            if (orders.Valid) {
                Log("GetOrders:", orders.size(), "open — cancelling");
                for (size_t i = 0; i < orders.size(); i++) {
                    if (exchange.CancelOrder(orders[i].Id)) Log("  CancelOrder ok:", (string)orders[i].Id);
                    else Log("  CancelOrder err:", (string)orders[i].Id, GetLastError());
                }
            } else {
                Log("GetOrders err:", GetLastError());
            }
        }
        {
            Orders o = exchange.GetHistoryOrders();
            if (o.Valid) Log("GetHistoryOrders:", o.size());
            else Log("GetHistoryOrders err:", GetLastError());
        }

        // conditional (stop-loss) orders
        OrderCondition cond;
        cond.ConditionType = ORDER_CONDITION_TYPE_SL;
        cond.TpTriggerPrice = 0;
        cond.TpOrderPrice = 0;
        cond.SlTriggerPrice = px * 0.9;
        cond.SlOrderPrice = px * 0.89;
        {
            TId id = exchange.CreateConditionOrder("", "buy", 0.01, cond);
            if (id.Valid) {
                Log("CreateConditionOrder id:", (string)id);
                TId nid = exchange.ModifyConditionOrder(id, "buy", 0.02, cond);
                if (nid.Valid) Log("ModifyConditionOrder id:", (string)nid);
                else Log("ModifyConditionOrder err:", GetLastError());
                Order o = exchange.GetConditionOrder(id);
                if (o.Valid) Log("GetConditionOrder: amount", o.Amount, "status", o.Status);
                else Log("GetConditionOrder err:", GetLastError());
                if (exchange.CancelConditionOrder(id)) Log("CancelConditionOrder ok:", (string)id);
                else Log("CancelConditionOrder err:", GetLastError());
            } else {
                Log("CreateConditionOrder err:", GetLastError());
            }
        }
        {
            Orders o = exchange.GetConditionOrders();
            if (o.Valid) Log("GetConditionOrders:", o.size());
            else Log("GetConditionOrders err:", GetLastError());
        }
        {
            Orders o = exchange.GetHistoryConditionOrders();
            if (o.Valid) Log("GetHistoryConditionOrders:", o.size());
            else Log("GetHistoryConditionOrders err:", GetLastError());
        }

        // raw exchange IO passthrough (live-oriented; engine implements a subset).
        Log("IO(currency,USDT):", exchange.IO("currency", "USDT").dump());

        // Persistent store can be wiped wholesale, but only in a backtest — in
        // live this would erase the user's saved data, so it stays gated here.
        _G(nullptr);
        Log("_G(nullptr) cleared the KV store");
    } else {
        Log("=== trading skipped (live; gated by IsVirtual) ===");
    }

    Sleep(1000);
    LogStatus("self-check done @", _D());
    Log("=== self-check complete:", _okCount, "ok,", _failCount, "failed ===");
}
