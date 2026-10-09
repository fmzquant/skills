// FMZ Rust SDK — API self-check / integration test.
//
// Runs once and logs every SDK call, so a single build exercises the whole
// surface (kept in parity with the canonical TS API). Designed to
// run BOTH as a backtest and as a live bot:
//   * read-only calls always run (live + backtest);
//   * anything that writes exchange state, places orders, or clears persistent
//     data is gated behind IsVirtual() — so running it live is harmless; run it
//     as a backtest to exercise those paths too.
//
// A handful of deterministic results are verified with `check(...)`, which logs
// `[ok]`/`[FAIL]` and tallies a score (so a regression is loud, not silent). We
// deliberately use soft checks, not assert!/Panic!, which would tear the bot
// down mid-run.

/// Soft assertion: never aborts the run, just records pass/fail.
fn check(name: &str, ok: bool, score: &mut (u32, u32)) {
    if ok {
        score.0 += 1;
        Log!("[ok]", name);
    } else {
        score.1 += 1;
        Log!("[FAIL]", name);
    }
}

/// Auto-run once before main() — just declare `fn init()` and the runtime calls
/// it (no OnExit/registration needed).
fn init() {
    Log!("[init] self-check starting");
}

/// Auto-run when the strategy stops / the backtest ends — declare `fn onexit()`.
fn onexit() {
    Log!("[onexit] self-check finished");
}

/// Mean of `n` closes ending at index `end` (caller ensures end + 1 >= n).
fn ma(r: &[Record], end: usize, n: usize) -> f64 {
    let mut s = 0.0;
    for k in (end + 1 - n)..=end {
        s += r[k].Close;
    }
    s / n as f64
}

fn main() {
    let mut score = (0u32, 0u32);

    // ---- globals / runtime meta ----
    Log!("=== meta ===");
    Log!("Version:", Version(), "GetOS:", GetOS(), "GetPid:", GetPid(), "IsVirtual:", IsVirtual());
    Log!("Unix:", Unix(), "UnixNano:", UnixNano(), "_D(None):", _D(None), "_D(0):", _D(0));
    Log!("params():", params());
    Log!("GetMeta():", GetMeta());
    Log!("GetLastError():", GetLastError());
    match GetCommand(0) {
        Some(cmd) => Log!("GetCommand:", cmd),
        None => Log!("GetCommand: (none)"),
    }

    // deterministic checks (pure functions with known answers)
    check("_N(1.23456,2)≈1.23", (_N(1.23456, 2) - 1.23).abs() < 1e-9, &mut score);
    check("_N(123.456,0)==123", (_N(123.456, 0) - 123.0).abs() < 1e-9, &mut score);
    check("MD5(abc)", MD5("abc") == "900150983cd24fb0d6963f7d28e17f72", &mut score);
    check("_D(0)==epoch", _D(0) == "1970-01-01 00:00:00", &mut score);
    check("UUID len==36", UUID().len() == 36, &mut score);

    // ---- persistent KV (_G!), the canonical `_G(k?, v?)` ----
    Log!("=== KV (_G!) ===");
    _G!("selfcheck_k", "v1"); //                       store a string
    check("_G! store/read str", _G!("selfcheck_k") == "v1", &mut score);
    _G!("selfcheck_n", 42); //                          store any ToArg value
    check("_G! store/read int", _G!("selfcheck_n") == "42", &mut score);
    _G!("selfcheck_n", null); //                        delete (matches TS _G(k, null))
    check("_G! delete", _G!("selfcheck_n") == "", &mut score);

    // ---- crypto / encoding ----
    Log!("=== crypto ===");
    Log!("UUID:", UUID());
    Log!("Encode(sha256,hex):", Encode("sha256", "string", "hex", "abc", "", ""));
    Log!("StrDecode(abc,gbk):", StrDecode("abc", "gbk"));

    // ---- local DB + JSON (structured, not raw strings) ----
    Log!("=== DB / JSON ===");
    DBExec("CREATE TABLE IF NOT EXISTS selfcheck(id INTEGER PRIMARY KEY, k TEXT)");
    DBExec("INSERT INTO selfcheck(k) VALUES('hello')");
    let q = DBExec("SELECT id, k FROM selfcheck ORDER BY id DESC LIMIT 3"); // -> DBResult
    Log!("DBExec: columns", q.columns.len(), "rows", q.values.len());
    if let Some(row) = q.values.first() {
        Log!(
            "  latest row: id", row.first().and_then(|c| c.as_i64()).unwrap_or(0),
            "k", row.get(1).and_then(|c| c.as_str()).unwrap_or("")
        );
    }
    // JSONParse: parse arbitrary JSON (e.g. a struct's `Info` field) into JsonValue.
    if let Some(j) = JSONParse(r#"{"a":1,"b":[true,"x"],"c":{"d":2.5}}"#) {
        check("JSONParse a==1", j["a"].as_i64() == Some(1), &mut score); // serde_json-style indexing
        check("JSONParse b[1]==x", j["b"][1].as_str() == Some("x"), &mut score);
        check("JSONParse c.d==2.5", j["c"]["d"].as_f64() == Some(2.5), &mut score);
    } else {
        check("JSONParse parsed", false, &mut score);
    }

    // ---- logging ----
    Log!("=== logging ===");
    LogProfit(0.0);
    LogStatus!("self-check running @", _D(None));
    // Mail with empty args won't send — just exercises the binding.
    Log!("Mail(empty) ->", Mail("", "", "", "", "", ""));
    EnableLog(true);
    SetErrorFilter("");
    // HttpQuery makes a real request (may be firewalled / empty in backtest).
    // Return type chooses the result: String = body, HttpRet = full response.
    Log!("HttpQuery body len:", HttpQuery::<String>("https://www.fmz.com", None).len());
    let resp: HttpRet = HttpQuery("https://www.fmz.com", None);
    Log!("HttpQuery full: status", resp.StatusCode, "body len", resp.Body.len());

    // ---- exchanges / instrument info ----
    Log!("=== exchanges (", exchanges.len(), ") ===");
    for (i, e) in exchanges.iter().enumerate() {
        Log!("exchange", i, "Name:", e.GetName(), "Currency:", e.GetCurrency(), "Period(s):", e.GetPeriod());
    }
    Log!("GetName:", exchange.GetName(), "GetLabel:", exchange.GetLabel());
    Log!(
        "GetCurrency:", exchange.GetCurrency(),
        "Quote:", exchange.GetQuoteCurrency(),
        "Base:", exchange.GetBaseCurrency(),
        "GetBase:", exchange.GetBase()
    );
    Log!("GetContractType:", exchange.GetContractType());
    let markets = exchange.GetMarkets(); // symbol -> Market struct (not a string)
    Log!("GetMarkets:", markets.len(), "pairs");
    if let Some(m) = markets.values().next() {
        Log!(
            "  sample:", m.Symbol, "PricePrecision", m.PricePrecision,
            "MinQty", m.MinQty, "TickSize", m.TickSize, "Base", m.BaseAsset, "Quote", m.QuoteAsset
        );
    }
    Log!("GetPeriod(s):", exchange.GetPeriod());
    Log!("HMAC(sha256):", exchange.HMAC("sha256", "hex", "data", "key"));
    Log!("GetUSDCNY:", exchange.GetUSDCNY(), "GetEURCNY:", exchange.GetEURCNY());
    Log!("_Cross([1,2,3],[3,2,1]):", _Cross(&[1.0, 2.0, 3.0], &[3.0, 2.0, 1.0]));

    // ---- market data (default pair = None; pass a symbol string to override) ----
    Log!("=== market data ===");
    let last_price = match exchange.GetTicker(None) {
        Ok(t) => {
            Log!("GetTicker: Last", t.Last, "Buy", t.Buy, "Sell", t.Sell, "Vol", t.Volume);
            t.Last
        }
        Err(e) => {
            Log!("GetTicker err:", e);
            0.0
        }
    };
    match exchange.GetTickers() {
        Ok(t) => Log!("GetTickers:", t.len()),
        Err(e) => Log!("GetTickers err:", e),
    }
    match exchange.GetDepth(None) {
        Ok(d) => Log!("GetDepth: asks", d.Asks.len(), "bids", d.Bids.len()),
        Err(e) => Log!("GetDepth err:", e),
    }
    match exchange.GetRecords(None, None, None) {
        Ok(r) => {
            Log!("GetRecords(default):", r.len(), "bars");
            if let Some(last) = r.last() {
                Log!("  last:", _D(last.Time), "O", last.Open, "H", last.High, "L", last.Low, "C", last.Close);
            }
        }
        Err(e) => Log!("GetRecords err:", e),
    }
    match exchange.GetRecords(None, PERIOD_M5, 50) {
        Ok(r) => Log!("GetRecords(M5, limit 50):", r.len()),
        Err(e) => Log!("GetRecords(M5) err:", e),
    }
    match exchange.GetTrades(None) {
        Ok(t) => Log!("GetTrades:", t.len()),
        Err(e) => Log!("GetTrades err:", e),
    }
    match exchange.GetFundings(None) {
        Ok(f) => Log!("GetFundings:", f.len()),
        Err(e) => Log!("GetFundings err:", e),
    }

    // ---- account / assets / positions ----
    Log!("=== account ===");
    match exchange.GetAccount() {
        Ok(a) => Log!("GetAccount: Balance", a.Balance, "Stocks", a.Stocks, "Equity", a.Equity, "UPnL", a.UPnL),
        Err(e) => Log!("GetAccount err:", e),
    }
    match exchange.GetAssets() {
        Ok(a) => Log!("GetAssets:", a.len()),
        Err(e) => Log!("GetAssets err:", e),
    }
    match exchange.GetPositions(None) {
        Ok(p) => Log!("GetPositions:", p.len()),
        Err(e) => Log!("GetPositions err:", e),
    }

    // ---- async (Go) + inter-routine channel + data store ----
    Log!("=== async / channel / data ===");
    // Launch GetTicker on every exchange concurrently, then collect.
    let routines: Vec<_> = exchanges.iter().map(|e| e.Go(Go::GetTicker, "")).collect();
    for (i, r) in routines.iter().enumerate() {
        match r.wait(0) {
            Ok(t) => Log!("Go GetTicker[", i, "] -> Last", t.Last),
            Err(e) => Log!("Go GetTicker[", i, "] err:", e),
        }
    }
    SetChannelData("{\"hello\":1}");
    Log!("GetChannelData:", GetChannelData());
    match exchange.GetData("selfcheck") {
        Ok(d) => Log!("GetData: Time", d.Time, "Data", d.Data),
        Err(e) => Log!("GetData err:", e),
    }

    // ---- chart (works live + backtest) ----
    Log!("=== chart ===");
    // Same shape as the JS self-check: chart.type + each series carries data:[].
    let cfg = r#"{"chart":{"type":"line"},"title":{"text":"self-check"},"series":[{"name":"price","data":[]}]}"#;
    let chart = Chart::new(cfg);
    chart.reset(0);
    chart.add(0, &format!("[{}, {}]", Unix() * 1000, last_price), -1); // append a point (2-element form)
    chart.update(cfg); // update() REPLACES the whole config — pass the full cfg, else the series is lost
    // exchange.Log draws a simulated-trade marker on the chart (NOT a real order).
    exchange.Log(ORDER_TYPE_BUY, last_price, 0.01);

    // ---- KLineChart (Pine-style candlestick chart; works live + backtest) ----
    Log!("=== KLineChart ===");
    match exchange.GetRecords(None, None, None) {
        Ok(recs) if recs.len() >= 10 => {
            let mut kc = KLineChart::new(r#"{"overlay": true}"#);
            let mut pre_time: i64 = 0;
            let (mut bars, mut signals) = (0, 0);
            for i in 0..recs.len() {
                let bar = &recs[i];
                if bar.Time < pre_time {
                    continue; // finalized bars already drawn
                }
                kc.begin(bar);

                // overlay: MA5 / MA10 (the indices feed `fill`) + a reference hline
                let mut p5: i64 = -1;
                let mut p10: i64 = -1;
                if i >= 4 {
                    p5 = kc.plot(ma(&recs, i, 5), r##"{"color":"#e91e63","title":"MA5"}"##);
                }
                if i >= 9 {
                    p10 = kc.plot(ma(&recs, i, 10), r##"{"color":"#2196f3","title":"MA10"}"##);
                }
                kc.hline(recs[0].Close, r##"{"color":"#888888","linestyle":"dashed","title":"base"}"##);

                // subpane (overlay:false): a (close-open) histogram + an echo candle
                kc.plot(bar.Close - bar.Open, r##"{"style":"histogram","color":"#26a69a","title":"delta","overlay":false}"##);
                kc.plotcandle(bar.Open, bar.High, bar.Low, bar.Close, r##"{"title":"echo","color":"#9e9e9e","overlay":false}"##);

                // cross detection
                let (mut up, mut down) = (false, false);
                if i >= 10 {
                    let (a5p, a10p) = (ma(&recs, i - 1, 5), ma(&recs, i - 1, 10));
                    let (a5, a10) = (ma(&recs, i, 5), ma(&recs, i, 10));
                    up = a5p <= a10p && a5 > a10;
                    down = a5p >= a10p && a5 < a10;
                }

                // markers on the candles
                kc.plotshape(up, r##"{"style":"triangleup","location":"belowbar","color":"#4caf50","title":"golden"}"##);
                kc.plotchar(down, r##"{"char":"D","location":"abovebar","color":"#f44336","title":"dead"}"##);
                kc.plotarrow(bar.Close - bar.Open, r#"{"title":"delta-arrow"}"#);

                // bar / background coloring
                if up {
                    kc.barcolor("#4caf50", "{}");
                }
                if down {
                    kc.bgcolor("rgba(244,67,54,0.10)", "{}");
                }

                // fill the band between the two MAs
                if p5 >= 0 && p10 >= 0 {
                    kc.fill(p5, p10, r#"{"color":"rgba(120,120,255,0.18)"}"#);
                }

                // trade signals
                if up {
                    kc.signal("buy", bar.Close, 1.0, "");
                    signals += 1;
                }
                if down {
                    kc.signal("sell", bar.Close, 1.0, "");
                    signals += 1;
                }

                kc.close(); // pack OHLCV + this bar's plots/signals into a candle
                pre_time = bar.Time;
                bars += 1;
            }
            Log!("KLineChart drew", bars, "bars,", signals, "signals");
        }
        Ok(_) => Log!("KLineChart: not enough bars"),
        Err(e) => Log!("KLineChart GetRecords err:", e),
    }

    // ---- exchange config writes (backtest only) ----
    if IsVirtual() {
        Log!("=== config writes (virtual) ===");
        // _C! retries until Ok (GetTicker succeeds on the first try in a backtest).
        let _ = _C!(exchange.GetTicker(None));
        exchange.SetCurrency("BTC_USDT");
        exchange.SetData("selfcheck", "{\"k\":1}");
        Log!("SetBase ->", exchange.SetBase("https://example.com"));
        Log!("SetRate ->", exchange.SetRate(1.0));
        exchange.SetPrecision(2, 4);
        exchange.SetMaxBarLen(1000);
        exchange.SetMarginLevel(10); //   integer accepted (ToF64)
        exchange.SetMarginLevel(10.0); // float accepted
        Log!("GetRate:", exchange.GetRate());
        exchange.SetTimeout(5000);
        LogProfitReset(0);
        // Dial is live-only; in a backtest TSocket_* is stubbed, so this is an
        // already-closed handle — exercise the binding without any real I/O.
        let mut conn = Dial("wss://stream.example.com");
        Log!("Dial valid (backtest stub -> false):", conn.Valid(), "closed:", conn.IsClosed());
        conn.close();
        match exchange.SetContractType("swap") {
            Ok(s) => Log!("SetContractType:", s),
            Err(e) => Log!("SetContractType err:", e),
        }
        match exchange.SetDirection("buy") {
            Ok(s) => Log!("SetDirection:", s),
            Err(e) => Log!("SetDirection err:", e),
        }
        Log!("config writes done");
    } else {
        Log!("=== config writes skipped (live) ===");
    }

    // ---- trading (backtest only) ----
    if IsVirtual() {
        Log!("=== trading (virtual) ===");
        let px = exchange.GetTicker(None).map(|t| t.Sell).unwrap_or(0.0);

        // A resting limit buy far below market stays open, so ModifyOrder and the
        // cancel sweep below have a live order to act on.
        let bid = px * 0.5;
        match exchange.Buy(bid, 0.01) {
            Ok(id) => {
                Log!("Buy(limit) id:", id);
                match exchange.GetOrder(&id) {
                    Ok(o) => Log!("GetOrder: price", o.Price, "amount", o.Amount, "status", o.Status, "type", o.Type),
                    Err(e) => Log!("GetOrder err:", e),
                }
                // ModifyOrder requires `side` — the engine reads v[2] as the side,
                // so this also guards the arg-alignment fix.
                match exchange.ModifyOrder(&id, "buy", bid * 1.01, 0.02) {
                    Ok(nid) => Log!("ModifyOrder id:", nid),
                    Err(e) => Log!("ModifyOrder err:", e),
                }
            }
            Err(e) => Log!("Buy err:", e),
        }
        // Market-ish sell + a plain CreateOrder (symbol "" = the configured pair).
        match exchange.Sell(px, 0.01) {
            Ok(id) => Log!("Sell id:", id),
            Err(e) => Log!("Sell err:", e),
        }
        match exchange.CreateOrder("", "buy", bid, 0.01) {
            Ok(id) => Log!("CreateOrder id:", id),
            Err(e) => Log!("CreateOrder err:", e),
        }
        // Cancel everything still open.
        match exchange.GetOrders(None) {
            Ok(orders) => {
                Log!("GetOrders:", orders.len(), "open — cancelling");
                for o in &orders {
                    match exchange.CancelOrder(&o.Id) {
                        Ok(()) => Log!("  CancelOrder ok:", o.Id),
                        Err(e) => Log!("  CancelOrder err:", o.Id, e),
                    }
                }
            }
            Err(e) => Log!("GetOrders err:", e),
        }
        match exchange.GetHistoryOrders(None, None, None) {
            Ok(o) => Log!("GetHistoryOrders:", o.len()),
            Err(e) => Log!("GetHistoryOrders err:", e),
        }

        // conditional (stop-loss) orders
        let cond = OrderCondition {
            ConditionType: ORDER_CONDITION_TYPE_SL,
            SlTriggerPrice: px * 0.9,
            SlOrderPrice: px * 0.89,
            ..Default::default()
        };
        match exchange.CreateConditionOrder("", "buy", 0.01, &cond) {
            Ok(id) => {
                Log!("CreateConditionOrder id:", id);
                match exchange.ModifyConditionOrder(&id, "buy", 0.02, &cond) {
                    Ok(nid) => Log!("ModifyConditionOrder id:", nid),
                    Err(e) => Log!("ModifyConditionOrder err:", e),
                }
                match exchange.GetConditionOrder(&id) {
                    Ok(o) => Log!("GetConditionOrder: amount", o.Amount, "status", o.Status),
                    Err(e) => Log!("GetConditionOrder err:", e),
                }
                match exchange.CancelConditionOrder(&id) {
                    Ok(()) => Log!("CancelConditionOrder ok:", id),
                    Err(e) => Log!("CancelConditionOrder err:", e),
                }
            }
            Err(e) => Log!("CreateConditionOrder err:", e),
        }
        match exchange.GetConditionOrders(None) {
            Ok(o) => Log!("GetConditionOrders:", o.len()),
            Err(e) => Log!("GetConditionOrders err:", e),
        }
        match exchange.GetHistoryConditionOrders(None, None, None) {
            Ok(o) => Log!("GetHistoryConditionOrders:", o.len()),
            Err(e) => Log!("GetHistoryConditionOrders err:", e),
        }

        // raw exchange IO passthrough (live-oriented; engine implements a subset).
        match exchange.IO(("currency", "USDT")) {
            Ok(s) => Log!("IO(currency,USDT):", s),
            Err(e) => Log!("IO err:", e),
        }

        // Persistent store can be wiped wholesale, but only in a backtest — in
        // live this would erase the user's saved data, so it stays gated here.
        _G!();
        Log!("_G!() cleared the KV store");
    } else {
        Log!("=== trading skipped (live; gated by IsVirtual) ===");
    }

    Sleep(1000);
    LogStatus!("self-check done @", _D(None));
    Log!("=== self-check complete:", score.0, "ok,", score.1, "failed ===");
}
