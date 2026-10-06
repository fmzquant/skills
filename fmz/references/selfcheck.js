// FMZ / botvs JavaScript SDK — API self-check / integration test.
//
// Ported from the canonical Rust self-check (backtest/rust/src/strategy.rs).
// Runs ONCE and logs every SDK call, so a single run exercises the whole
// surface (kept in parity with the C++ SDK + the canonical TS API). Designed
// to run BOTH as a backtest and as a live bot:
//   * read-only calls always run (live + backtest);
//   * anything that writes exchange state, places orders, or clears persistent
//     data is gated behind IsVirtual() — so running it live is harmless; run it
//     as a backtest to exercise those paths too.
//
// A handful of deterministic results are verified with check(...), which logs
// [ok]/[FAIL] and tallies a score (so a regression is loud, not silent). We
// deliberately use soft checks, not throw, which would tear the bot down
// mid-run.
//
// On the FMZ platform paste this as a JavaScript strategy — the runtime injects
// the SDK globals (exchange, exchanges, Log, LogStatus, Sleep, Chart,
// KLineChart, _G, _N, _C, _Cross, _D, IsVirtual, ...). Do NOT require() anything.

// ---- soft assertion: never aborts the run, just records pass/fail ----
function check(name, ok, score) {
    if (ok) {
        score.ok += 1;
        Log("[ok]", name);
    } else {
        score.fail += 1;
        Log("[FAIL]", name);
    }
}

// mean of `n` closes ending at index `end` (caller ensures end + 1 >= n)
function ma(r, end, n) {
    var s = 0;
    for (var k = end - n + 1; k <= end; k++) s += r[k].Close;
    return s / n;
}

function main() {
    var score = { ok: 0, fail: 0 };

    // ---- globals / runtime meta ----
    Log("=== meta ===");
    Log("Version:", Version(), "GetOS:", GetOS(), "GetPid:", GetPid(), "IsVirtual:", IsVirtual());
    Log("Unix:", Unix(), "UnixNano:", UnixNano(), "_D():", _D(), "_D(0):", _D(0));
    // not in JS API: params() — Rust-only; the JS SDK has no params() global.
    Log("GetMeta():", GetMeta());
    Log("GetLastError():", GetLastError());
    // JS GetCommand() takes no args (Rust used GetCommand(0)).
    var cmd = GetCommand();
    Log("GetCommand:", cmd === null ? "(none)" : cmd);

    // deterministic checks (pure functions with known answers)
    check("_N(1.23456,2)==1.23", Math.abs(_N(1.23456, 2) - 1.23) < 1e-9, score);
    check("_N(123.456,0)==123", Math.abs(_N(123.456, 0) - 123.0) < 1e-9, score);
    check("MD5(abc)", MD5("abc") === "900150983cd24fb0d6963f7d28e17f72", score);
    // NOTE: JS _D(0) formats in the runtime's LOCAL timezone (Rust assumed UTC),
    // so the exact epoch string is not portable — check the format/length only.
    check("_D(0) is yyyy-MM-dd hh:mm:ss", /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(_D(0)), score);
    check("UUID len==36", UUID().length === 36, score);
    // _Cross([1,2,3],[3,2,1]) — the two lines cross, so a cross is detected.
    check("_Cross detects crossing", _Cross([1, 2, 3], [3, 2, 1]) !== 0, score);

    // ---- persistent KV (_G), the canonical `_G(k?, v?)` ----
    Log("=== KV (_G) ===");
    _G("selfcheck_k", "v1"); //                         store a string
    check("_G store/read str", _G("selfcheck_k") === "v1", score);
    _G("selfcheck_n", 42); //                            store any JSON value (returns it parsed)
    check("_G store/read int", _G("selfcheck_n") === 42, score);
    _G("selfcheck_n", null); //                          delete (matches TS _G(k, null))
    check("_G delete -> null", _G("selfcheck_n") === null, score);

    // ---- JSON (structured, not raw strings) ----
    Log("=== JSON ===");
    // JS has native JSON.parse; the SDK also exposes JSONParse (alias).
    var j = JSONParse('{"a":1,"b":[true,"x"],"c":{"d":2.5}}');
    if (j) {
        check("JSONParse a==1", j.a === 1, score);
        check("JSONParse b[1]==x", j.b[1] === "x", score);
        check("JSONParse c.d==2.5", j.c.d === 2.5, score);
    } else {
        check("JSONParse parsed", false, score);
    }

    // ---- crypto / encoding ----
    Log("=== crypto ===");
    Log("UUID:", UUID());
    // Encode(algo, inputFormat, outputFormat, data, keyFormat?, key?)
    Log("Encode(sha256,hex):", Encode("sha256", "string", "hex", "abc", "", ""));
    // not in JS API: exchange.HMAC — the JS SDK has no HMAC method; HMAC is done
    // via Encode() with an "hmac_*" algo. Exercise that here instead.
    Log("Encode(hmac_sha256,hex):", Encode("hmac_sha256", "string", "hex", "data", "string", "key"));
    // StrDecode exists in the runtime (decode a string from a charset); in the
    // sandbox/backtest it is unsupported and just logs, but we exercise the binding.
    Log("StrDecode(abc,gbk):", StrDecode("abc", "gbk"));

    // ---- local DB ----
    Log("=== DB ===");
    DBExec("CREATE TABLE IF NOT EXISTS selfcheck(id INTEGER PRIMARY KEY, k TEXT)");
    DBExec("INSERT INTO selfcheck(k) VALUES('hello')");
    var q = DBExec("SELECT id, k FROM selfcheck ORDER BY id DESC LIMIT 3"); // -> IDBExecRet
    if (q) {
        Log("DBExec: columns", q.columns.length, "rows", q.values.length);
        if (q.values.length > 0) {
            var row = q.values[0];
            Log("  latest row: id", row[0], "k", row[1]);
        }
    } else {
        Log("DBExec: (null)");
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
    var body = HttpQuery("https://www.fmz.com");
    Log("HttpQuery body len:", body ? body.length : 0);
    var resp = HttpQuery("https://www.fmz.com", { debug: true });
    if (resp && typeof resp === "object") {
        Log("HttpQuery full: status", resp.StatusCode, "body len", resp.Body ? resp.Body.length : 0);
    } else {
        Log("HttpQuery full: body len", resp ? resp.length : 0);
    }

    // ---- exchanges / instrument info ----
    Log("=== exchanges (", exchanges.length, ") ===");
    for (var i = 0; i < exchanges.length; i++) {
        var e = exchanges[i];
        Log("exchange", i, "Name:", e.GetName(), "Currency:", e.GetCurrency(), "Period(s):", e.GetPeriod());
    }
    Log("GetName:", exchange.GetName(), "GetLabel:", exchange.GetLabel());
    Log(
        "GetCurrency:", exchange.GetCurrency(),
        "Quote:", exchange.GetQuoteCurrency(),
        "Base:", exchange.GetBaseCurrency(),
        "GetBase:", exchange.GetBase()
    );
    Log("GetContractType:", exchange.GetContractType());
    var markets = exchange.GetMarkets(); // symbol -> IMarket (not a string)
    if (markets) {
        var keys = Object.keys(markets);
        Log("GetMarkets:", keys.length, "pairs");
        if (keys.length > 0) {
            var m = markets[keys[0]];
            Log(
                "  sample:", m.Symbol, "PricePrecision", m.PricePrecision,
                "MinQty", m.MinQty, "TickSize", m.TickSize, "Base", m.BaseAsset, "Quote", m.QuoteAsset
            );
        }
    } else {
        Log("GetMarkets: (null)");
    }
    Log("GetPeriod(s):", exchange.GetPeriod());
    // not in JS API: exchange.HMAC — see Encode("hmac_*", ...) above.
    Log("GetUSDCNY:", exchange.GetUSDCNY());
    // not in JS API: exchange.GetEURCNY — only GetUSDCNY exists in the JS SDK.

    // ---- market data (default pair = ""; pass a symbol string to override) ----
    Log("=== market data ===");
    var lastPrice = 0;
    var t = exchange.GetTicker();
    if (t) {
        Log("GetTicker: Last", t.Last, "Buy", t.Buy, "Sell", t.Sell, "Vol", t.Volume);
        lastPrice = t.Last;
    } else {
        Log("GetTicker: (null)", "err:", GetLastError());
    }
    var tks = exchange.GetTickers();
    Log("GetTickers:", tks ? tks.length : "(null)");
    var d = exchange.GetDepth();
    if (d) {
        Log("GetDepth: asks", d.Asks.length, "bids", d.Bids.length);
    } else {
        Log("GetDepth: (null)");
    }
    var r = exchange.GetRecords();
    if (r) {
        Log("GetRecords(default):", r.length, "bars");
        if (r.length > 0) {
            var last = r[r.length - 1];
            Log("  last:", _D(last.Time), "O", last.Open, "H", last.High, "L", last.Low, "C", last.Close);
        }
    } else {
        Log("GetRecords: (null)");
    }
    // period/limit variant: GetRecords(symbol?, period?, limit?). The runtime also
    // accepts GetRecords(period, limit) when the first arg is a number.
    var r5 = exchange.GetRecords(PERIOD_M5, 50);
    Log("GetRecords(M5, limit 50):", r5 ? r5.length : "(null)");
    var trades = exchange.GetTrades();
    Log("GetTrades:", trades ? trades.length : "(null)");
    var fundings = exchange.GetFundings();
    Log("GetFundings:", fundings ? fundings.length : "(null)");

    // ---- account / assets / positions ----
    Log("=== account ===");
    var acc = exchange.GetAccount();
    if (acc) {
        Log("GetAccount: Balance", acc.Balance, "Stocks", acc.Stocks, "Equity", acc.Equity, "UPnL", acc.UPnL);
    } else {
        Log("GetAccount: (null)");
    }
    var assets = exchange.GetAssets();
    Log("GetAssets:", assets ? assets.length : "(null)");
    var positions = exchange.GetPositions();
    Log("GetPositions:", positions ? positions.length : "(null)");

    // ---- async (Go) + inter-routine channel + data store ----
    Log("=== async / channel / data ===");
    // Launch GetTicker on every exchange concurrently, then collect.
    var routines = [];
    for (var gi = 0; gi < exchanges.length; gi++) {
        routines.push(exchanges[gi].Go("GetTicker"));
    }
    for (var ri = 0; ri < routines.length; ri++) {
        var gt = routines[ri].wait();
        Log("Go GetTicker[", ri, "] -> Last", gt ? gt.Last : "(null)");
    }
    SetChannelData('{"hello":1}');
    Log("GetChannelData:", GetChannelData());
    var gd = exchange.GetData("selfcheck");
    if (gd) {
        Log("GetData: Time", gd.Time, "Data", gd.Data);
    } else {
        Log("GetData: (null)");
    }

    // ---- chart (works live + backtest) ----
    Log("=== chart ===");
    // Match the C++/JS working shape: chart.type + each series carries data:[].
    var cfg = { chart: { type: "line" }, title: { text: "self-check" }, series: [{ name: "price", data: [] }] };
    var chart = Chart(cfg);
    chart.reset(0);
    chart.add(0, [Unix() * 1000, lastPrice], -1); // append a point (2-element form)
    chart.update(cfg); // update() REPLACES the whole config — pass the full cfg, else the series is lost
    // exchange.Log draws a simulated-trade marker on the chart (NOT a real order).
    exchange.Log(ORDER_TYPE_BUY, lastPrice, 0.01);

    // ---- KLineChart: single pass over records, Pine-style plotting ----
    // Folded in from server/kline-selfcheck/javascript/kline_selfcheck.js, with
    // the infinite while(true) loop converted to a single pass.
    Log("=== KLineChart ===");
    var klChart = KLineChart({ overlay: true }); // plots overlay the candles by default
    var klBars = 0, klSignals = 0;
    var kr = exchange.GetRecords();
    if (kr && kr.length >= 10) {
        var kn = kr.length;
        for (var ki = 0; ki < kn; ki++) {
            var bar = kr[ki];
            klChart.begin(bar);

            // --- overlay: MA5 / MA10 + a reference hline ---
            var p5 = -1, p10 = -1;
            if (ki >= 4)  p5  = klChart.plot(ma(kr, ki, 5),  { color: "#e91e63", title: "MA5" });
            if (ki >= 9)  p10 = klChart.plot(ma(kr, ki, 10), { color: "#2196f3", title: "MA10" });
            klChart.hline(kr[0].Close, { color: "#888888", linestyle: "dashed", title: "base" });

            // --- subpane (overlay:false): a (close-open) histogram + an echo candle ---
            klChart.plot(bar.Close - bar.Open, { style: "histogram", color: "#26a69a", title: "delta", overlay: false });
            klChart.plotcandle(bar.Open, bar.High, bar.Low, bar.Close, { title: "echo", color: "#9e9e9e", overlay: false });

            // --- cross detection ---
            var up = false, down = false;
            if (ki >= 10) {
                var a5p = ma(kr, ki - 1, 5), a10p = ma(kr, ki - 1, 10);
                var a5  = ma(kr, ki, 5),     a10  = ma(kr, ki, 10);
                up   = a5p <= a10p && a5 > a10;
                down = a5p >= a10p && a5 < a10;
            }

            // --- markers on the candles ---
            klChart.plotshape(up,  { style: "triangleup", location: "belowbar", color: "#4caf50", title: "golden" });
            klChart.plotchar(down, { char: "D", location: "abovebar", color: "#f44336", title: "dead" });
            klChart.plotarrow(bar.Close - bar.Open, { title: "delta-arrow" });

            // --- bar / background coloring ---
            if (up)   klChart.barcolor("#4caf50");
            if (down) klChart.bgcolor("rgba(244,67,54,0.10)");

            // --- fill the band between the two MAs ---
            if (p5 >= 0 && p10 >= 0) klChart.fill(p5, p10, { color: "rgba(120,120,255,0.18)" });

            // --- trade signals ---
            if (up)   { klChart.signal("buy",  bar.Close, 1); klSignals++; }
            if (down) { klChart.signal("sell", bar.Close, 1); klSignals++; }

            klChart.close(); // pack OHLCV + this bar's plots/signals into a candle
            klBars++;
        }
    }
    Log("KLineChart: bars plotted", klBars, "signals", klSignals);

    // ---- exchange config writes (backtest only) ----
    if (IsVirtual()) {
        Log("=== config writes (virtual) ===");
        // _C retries until non-null (GetTicker succeeds on the first try in a backtest).
        _C(exchange.GetTicker);
        exchange.SetCurrency("BTC_USDT");
        exchange.SetData("selfcheck", { k: 1 });
        Log("SetBase ->", exchange.SetBase("https://example.com"));
        Log("SetRate ->", exchange.SetRate(1.0));
        exchange.SetPrecision(2, 4);
        exchange.SetMaxBarLen(1000);
        exchange.SetMarginLevel(10); //   integer accepted
        exchange.SetMarginLevel(10.0); // float accepted
        Log("GetRate:", exchange.GetRate());
        exchange.SetTimeout(5000);
        LogProfitReset(0);
        // Dial is live-oriented; in a backtest the socket is stubbed. Exercise the
        // binding without any real I/O. JS IDial exposes read/write/exec/fd/close
        // (no Valid()/IsClosed() like the Rust SDK).
        var conn = Dial("wss://stream.example.com");
        Log("Dial ->", conn ? "handle" : "(null)");
        if (conn) conn.close();
        Log("SetContractType:", exchange.SetContractType("swap"));
        // SetDirection returns void in the JS SDK (no Result like Rust).
        exchange.SetDirection("buy");
        Log("SetDirection(buy) called");
        Log("config writes done");
    } else {
        Log("=== config writes skipped (live) ===");
    }

    // ---- trading (backtest only) ----
    if (IsVirtual()) {
        Log("=== trading (virtual) ===");
        var pt = exchange.GetTicker();
        var px = pt ? pt.Sell : 0;

        // A resting limit buy far below market stays open, so ModifyOrder and the
        // cancel sweep below have a live order to act on.
        var bid = px * 0.5;
        var buyId = exchange.Buy(bid, 0.01);
        if (buyId !== null && typeof buyId !== "undefined") {
            Log("Buy(limit) id:", buyId);
            var o = exchange.GetOrder(buyId);
            if (o) {
                Log("GetOrder: price", o.Price, "amount", o.Amount, "status", o.Status, "type", o.Type);
            } else {
                Log("GetOrder: (null)");
            }
            // ModifyOrder requires `side` (orderId, side, price, amount).
            var mid = exchange.ModifyOrder(buyId, "buy", bid * 1.01, 0.02);
            Log("ModifyOrder id:", mid);
        } else {
            Log("Buy: (null)", "err:", GetLastError());
        }
        // Market-ish sell + a plain CreateOrder (symbol "" = the configured pair).
        var sellId = exchange.Sell(px, 0.01);
        Log("Sell id:", sellId);
        var coId = exchange.CreateOrder("", "buy", bid, 0.01);
        Log("CreateOrder id:", coId);

        // Cancel everything still open.
        var orders = exchange.GetOrders();
        if (orders) {
            Log("GetOrders:", orders.length, "open — cancelling");
            for (var oi = 0; oi < orders.length; oi++) {
                var ok = exchange.CancelOrder(orders[oi].Id);
                Log("  CancelOrder", orders[oi].Id, "->", ok);
            }
        } else {
            Log("GetOrders: (null)");
        }
        var hist = exchange.GetHistoryOrders("");
        Log("GetHistoryOrders:", hist ? hist.length : "(null)");

        // conditional (stop-loss) orders
        var cond = {
            ConditionType: ORDER_CONDITION_TYPE_SL,
            SlTriggerPrice: px * 0.9,
            SlOrderPrice: px * 0.89
        };
        var ccId = exchange.CreateConditionOrder("", "buy", 0.01, cond);
        if (ccId !== null && typeof ccId !== "undefined") {
            Log("CreateConditionOrder id:", ccId);
            var mcId = exchange.ModifyConditionOrder(ccId, "buy", 0.02, cond);
            Log("ModifyConditionOrder id:", mcId);
            var co = exchange.GetConditionOrder(ccId);
            if (co) {
                Log("GetConditionOrder: amount", co.Amount, "status", co.Status);
            } else {
                Log("GetConditionOrder: (null)");
            }
            var ccOk = exchange.CancelConditionOrder(ccId);
            Log("CancelConditionOrder", ccId, "->", ccOk);
        } else {
            Log("CreateConditionOrder: (null)", "err:", GetLastError());
        }
        var condOrders = exchange.GetConditionOrders();
        Log("GetConditionOrders:", condOrders ? condOrders.length : "(null)");
        var histCond = exchange.GetHistoryConditionOrders();
        Log("GetHistoryConditionOrders:", histCond ? histCond.length : "(null)");

        // raw exchange IO passthrough (live-oriented; engine implements a subset).
        Log("IO(currency,USDT):", exchange.IO("currency", "USDT"));

        // Persistent store can be wiped wholesale, but only in a backtest — in
        // live this would erase the user's saved data, so it stays gated here.
        // JS: _G(null) wipes the store (Rust _G!()); _G() with no args does NOT.
        _G(null);
        Log("_G(null) cleared the KV store");
    } else {
        Log("=== trading skipped (live; gated by IsVirtual) ===");
    }

    Sleep(1000);
    LogStatus("self-check done @", _D());
    Log("=== self-check complete:", score.ok, "ok,", score.fail, "failed ===");
}
