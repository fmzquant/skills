---
name: fmz-strategy-mylanguage
description: "Write FMZ Quant strategies in MyLanguage (麦语言), the Wenhua-style (文华财经) formula language that FMZ compiles with its own engine and runs live on the user's node against real exchange accounts (crypto spot/futures, commodity futures via CTP). Covers the statement forms (:=  :  ^^  ..), series functions (REF, HHV/LLV, CROSS, BARSLAST), the trading instructions (指令) BK/SK/BP/SP/BPK/SPK/CLOSEOUT and the signal/position model behind them (AUTOFILTER, TRADE_AGAIN, ISLAST*, BKVOL/BKPRICE, MONEYTOT/UNIT sizing), multi-period #EXPORT/#IMPORT, the built-in trade library (交易类库) parameters (bar-close vs tick model, default lot, slippage, contract), the (*backtest*) header, and what differs from Wenhua. Use when writing, porting or debugging a MyLanguage / 麦语言 strategy for FMZ (then check and save it with the fmz MCP tools, language \"mylanguage\")."
---

# FMZ MyLanguage (麦语言) strategies

A MyLanguage strategy is a list of formula lines. FMZ compiles them into JavaScript and runs them inside its own MyLanguage runtime plus the built-in trade library (麦语言交易类库); the platform documents it as "compatible with most syntax, instructions and functions of Wenhua MyLanguage" — not all. `references/functions.md` is the authoritative list of what exists on FMZ; a name that is not there does not compile or fails at run time. The official templates in `references/examples/` show real syntax.

```
MA1:MA(C,N1);                 // output line: plotted in the indicator pane
MA2:MA(C,N2);
CROSSUP(MA1,MA2),BPK;         // signal line: condition , instruction ;
CROSSDOWN(MA1,MA2),SPK;
AUTOFILTER;                   // one open, one close, alternating
```

## Program structure

- One statement per line, terminated by `;`. Comments: `//` to end of line, `{ ... }` and `(* ... *)` blocks. The official templates write comments as `//[trans]中文|English[/trans]` — that is just a `//` comment carrying both languages; you may write plain `// text`.
- Assignment / output forms (the operator decides what is shown):
  - `X:=expr;` intermediate value, not drawn (中间变量).
  - `X:expr;` output drawn as a line in the indicator pane (副图).
  - `X^^expr;` output drawn on the price chart (主图叠加).
  - `X..expr;` output shown as a value only (tip), not drawn.
  - A trailing style, e.g. `X:expr,COLORRED,LINETHICK2;` or `,COLORSTICK` / `,VOLUMESTICK` (histogram), is accepted.
  - `VARIABLE:X:=0;` declares a value that keeps its last value across bars (initialised once); later `X:=X+1;` accumulates.
- Identifiers are case-insensitive — the compiler upper-cases every name — but write everything in UPPER CASE as the templates do. Chinese identifiers are legal (`均值1:EMA(C,20);`). Keywords and instructions (`BK`, `AUTOFILTER`, `#IMPORT`) must be upper case.
- Operators: `+ - * /` (`div`), `%` (also `MOD(A,B)`), comparisons `= <> < > <= >=` (there is no `==` and no `!=`), logic `AND`/`&&`, `OR`/`||`, `NOT(X)`. `=` is equality: `ISLASTBK=0`, `BARSBK=1`. Comparison binds tighter than AND/OR; arithmetic tighter than comparison. Conditionals are the function `IF(X,A,B)` / `IFELSE(X,A,B)`. Strings use single quotes: `ISCONTRACT('rb2501')`.
- Values are numbers; booleans are 1/0 (`ISNULL(X)` tests an empty value).
- Parameters: there is no `INPUT` keyword. Either declare them when saving (`save_strategy.args`: `[[name, label, description, default], ...]`, numbers/booleans only) — the user guide states MyLanguage code reads interface parameters directly as globals, and the runtime exposes them under their UPPER-CASE name — or hard-code them with an assignment (`N := 20;`), which is what the platform's own Bollinger example does. An in-code assignment is re-run every bar and overrides an interface parameter of the same name, so pick one of the two.

### Series semantics

Every line is evaluated once per bar, for every bar of history in order (the engine replays the fetched K-lines on start so series warm up), then on each new bar.

- `REF(X,N)` value N bars ago; `BARSLAST(cond)` bars since cond was last true (0 = now); `COUNT(cond,N)` (N=0 → whole history); `EVERY`, `EXIST`, `LAST(X,N1,N2)`, `VALUEWHEN(cond,X)`, `BARSSINCE`, `BARSSINCEN`, `CONDBARS`.
- `HHV(X,N)`/`LLV(X,N)` include the current bar; `HV(X,N)`/`LV(X,N)` exclude it (the turtle template uses `HV`/`LV` for breakouts so the current bar cannot be its own high).
- `CROSS(A,B)` = `CROSSUP(A,B)`: 1 when A was ≤ B on the previous bar and A > B now. `CROSSDOWN(A,B)` is `CROSS(B,A)`. `LONGCROSS(A,B,N)`.
- `MA, EMA, SMA(X,N,M), DMA, WMA, SMMA, TRMA, STD, AVEDEV, SAR, SLOPE, FORCAST, SUM, ...` — see `functions.md`. Every indicator must be built from these primitives; there is no library of named indicators (KDJ, MACD are written out, see `examples/跨指标.txt`).
- Price/volume: `O H L C` = `OPEN HIGH LOW CLOSE`, `V`/`VOL`, `NEW` (= C). Time: `DATE` (yymmdd), `TIME` (hhmm), `YEAR MONTH DAY HOUR MINUTE WEEKDAY`, `TIMESTAMP` (seconds), `BARPOS` (bar index), `BARSTATUS` (1 first bar, 2 last bar, 0 otherwise), `ISLASTBAR` (1 only on the live, tradable bar), `PERIOD` (minutes). Order book on the live bar: `ASK1..ASK5`, `BID1..BID5`, `ASK1VOL`..., `OPI` (open interest, futures; implemented by the runtime although `functions.md` omits it).
- Errors inside a line are swallowed: if a function lacks history (`MA(C,20)` on bar 5), a value is NaN (division by zero), or a signal reference does not exist yet (`BARSBK` before any BK), that line produces nothing for that bar — no value, no signal, no log. Only hard errors (unknown name → `undefined locals X` / `undefined function X`, type errors) stop the robot with `line:N - ...`.

### Signal lines, marks, logging

```
cond,BK;            // open long with the default lot
cond,SK(2);         // open short, 2 lots; the argument may be an expression
cond,SELECT;        // mark the bar (screening formulas), no trade
INFO(cond,'msg',X); // log 'msg' and X when cond is true (live bar only)
EXIT('msg');        // stop the strategy with this message
```

## Trading instructions (指令) and the position model

The model holds one position in one direction. `BKVOL`/`SKVOL` are the real long/short amount of the robot's position on the exchange (synced after every trade, not a theoretical count); only one of them is non-zero.

| Instruction | Meaning | What the trade library does |
|---|---|---|
| `BK` / `BK(n)` | 买开 open long | open long n lots |
| `SK` / `SK(n)` | 卖开 open short | open short n lots |
| `BP` / `BP(n)` | 买平 close short | close n lots of the short (omitted n = the default lot, not the whole position) |
| `SP` / `SP(n)` | 卖平 close long | close n lots of the long; `SP(BKVOL)` closes it all |
| `BPK` / `BPK(n)` | 买平开 reverse to long | close the whole short (if any), then open long n |
| `SPK` / `SPK(n)` | 卖平开 reverse to short | close the whole long (if any), then open short n |
| `CLOSEOUT` | 清仓 | close whatever is held, either direction |

- Lot: `n` when given, otherwise the trade library parameter `TradeAmount` (默认开仓手数 "Default Open Lot", also readable as `MYVOL`). A NaN lot (e.g. computed from missing data) makes the instruction do nothing.
- Position guards (silent): `BK` while short, `SK` while long, `SP` with no long, `BP` with no short, `CLOSEOUT` when flat are ignored. To flip direction use `BPK`/`SPK` or close first.
- Signal history: `BKPRICE`/`SKPRICE` = close price of the bar on which the last BK/SK was executed (the signal price, not the fill); `BKPRICEAV`/`SKPRICEAV` = actual average position price from the account; `BKHIGH/BKLOW`, `SKHIGH/SKLOW` extremes since entry; `BARSBK/BARSSK/BARSBP/BARSSP` bars since the last such signal (no value until one exists); `ISLASTBK/ISLASTSK/ISLASTBP/ISLASTSP/ISLASTBPK/ISLASTSPK/ISLASTCLOSEOUT` = 1 if the last executed instruction was that one. On a live start with an existing position and nothing to recover, the last instruction is taken as BK (long) or SK (short).
- Every executed instruction is logged as `BK(1) 信号所在行数: <line> 信号次数: <count> 触发周期: <bar>`; ignored ones are not logged.

### Which signals are executed (one per bar)

Signal lines are collected top to bottom on each evaluation; the first one that passes the filters is executed and the rest of the bar is dropped. At most one instruction per bar (`MULTSIG` raises that cap). The filters:

- Always allowed: the alternation transitions open → close/reverse and close → open (after `BK/BPK`: `SP`, `SPK`, `CLOSEOUT`; after `SK/SPK`: `BP`, `BPK`, `CLOSEOUT`; after `SP/BP/CLOSEOUT` or at start: any open).
- Without `AUTOFILTER` (加减仓 models): in addition, each signal line may fire once per position cycle — a second `BK` line adds to the long. `TRADE_AGAIN(N);` lets the same line fire up to N times (`examples/海龟交易.txt` adds with `TRADE_AGAIN(10)`). Per-line counters reset when a different line executes a reverse transition (with `TRADE_AGAIN`, whenever a different line executes).
- With `AUTOFILTER;` (一开一平): only the alternation transitions above — no adding, `TRADE_AGAIN` has no effect, and when flat with BK and SK on the same bar BK wins. Use it for every simple one-position system.
- `MULTSIG(sec1,sec2,N,interval)` / `MULTSIG_MIN(min1,min2,N)`: allow up to N (≤ 60) signals per bar, wait sec1 seconds before open orders and sec2 before close orders, and force the real-time (tick) model. The 4th argument is accepted but unused on FMZ.

### Money, contract and sizing

- `MONEYTOT` account equity, `MONEY` available funds (both from the exchange account: quote currency for spot and USDT-margined futures, coins for coin-margined futures), `COINS` coin balance, `UNIT` contract multiplier (`VolumeMultiple`, logged at start as `每手单位`), `MARGIN` margin ratio, `MINPRICE` = `MINPRICE1` price tick. On spot `UNIT` is the trade library's `Lot` parameter, `MARGIN` is 1, `MINPRICE` is 10^-ZPrecision.
- There is no `FEE`, `SETDEALPERCENT`, `CONDITION_ORDER`, `STOP`/`STOP1`, `KLINESIG` or `INPUT` on FMZ (not in `functions.md`; `STOP` even lexes but fails at run time). Write stops as explicit conditions (`examples/限价止损+限价止赢.txt`).
- Order price type keywords (`NEW_ORDER`, `TRACING_ORDER`, ...) have no effect and `SETSIGPRICETYPE(...)` is accepted but ignored with a log line `指令 ... 已被忽略`. On FMZ every order is placed by the trade library at the opposite book price plus `SlideTick` ticks of slippage, re-sent until filled (see "How FMZ runs it live").
- Also accepted but ignored: `DAYTRADE`, `DAYTRADE1`, `CHECKSIG`, `CHECKSIG_MIN`, `AUTOFINANCING`, `BACKGROUNDSTYLE`, `DRAWKLINE`, `DRAWKLINE2`.

### Multi-period and multi-formula references

```
#EXPORT TEST                      // a named sub-formula; several may be declared
均值1:EMA(C,20);
均值2:EMA(C,10);
#END
#IMPORT [MIN,15,TEST] AS VAR15    // run TEST on 15-minute bars of the same symbol
#IMPORT [MIN,30,TEST] AS VAR30
CROSSUP(VAR15.均值1,VAR30.均值1),BPK;
十五分最高价:VAR15.HIGH;          // built-ins of the imported scope are readable too
```

`#IMPORT [TEST] AS X` runs it on the robot's own period; period units `MIN`, `HOUR`, `DAY` are accepted (`functions.md` lists `[MIN, 1/5/15/30/60/1440, FORMULA]`). The engine synthesises every period from the largest common base among 1440/60/30/15/5/3/1 minutes, so any whole-minute period works but odd mixes fall back to 1-minute data. Instructions inside an `#EXPORT` block never trade — only the main body does. `#IMPORT` lines have no `;`.

## Examples

MA cross, one position, interface parameters `N1`=5, `N2`=20 (`save_strategy.args: [["N1","Fast MA","",5],["N2","Slow MA","",20]]`):

```
MA1^^MA(C,N1);
MA2^^MA(C,N2);
CROSSUP(MA1,MA2),BPK;
CROSSDOWN(MA1,MA2),SPK;
AUTOFILTER;
```

Money management, adapted from `examples/海龟交易.txt` (sizing by 1% of equity per ATR, add up to 4 units, stop at 2 ATR):

```
TR:=MAX(MAX((H-L),ABS(REF(C,1)-H)),ABS(REF(C,1)-L));
ATR:=MA(TR,26);
TC..INTPART((MONEYTOT*0.01/(UNIT*ATR)));       // lots per unit of risk
MTC..4*TC;                                     // maximum lots
HH:=HV(H,20);
LL:=LV(L,20);
CROSSUP(C,HH)&&ISLASTBK=0&&ISLASTSK=0&&BARPOS>=26,BK(TC);
CROSSDOWN(C,LL)&&ISLASTBK=0&&ISLASTSK=0&&BARPOS>=26,SK(TC);
C>=BKPRICE+0.5*ATR&&BKVOL<MTC&&ISLASTBK,BK(TC);   // add
C<=SKPRICE-0.5*ATR&&SKVOL<MTC&&ISLASTSK,SK(TC);
C<=(BKPRICE-2*ATR)&&BKVOL>0,SP(BKVOL);            // stop
C>=(SKPRICE+2*ATR)&&SKVOL>0,BP(SKVOL);
CROSSUP(H,HV(H,10))&&SKVOL>0,BP(SKVOL);           // exit
CROSSDOWN(L,LV(L,10))&&BKVOL>0,SP(BKVOL);
TRADE_AGAIN(10);                                  // no AUTOFILTER: adding is allowed
```

`TC` is 0 when `MONEYTOT*0.01 < UNIT*ATR`; a `BK(0)` places nothing, so check the equity/lot arithmetic for the instrument before going live.

## How FMZ runs it live

- One exchange object only (`只支持一个交易对`). The robot's K-line period (`create_robot`/`update_robot` `period`, seconds) is the formula's bar; `PERIOD` returns it in minutes. The symbol is the robot's pair for spot; for futures it is the trade library's `ContractType` parameter (crypto: `this_week`/`next_week`/`quarter`; CTP: a contract such as `rb2501`, or `MA000/MA888`-style mapping = index data, trade the main contract, with automatic roll-over 移仓 when the main contract changes).
- Trade library (交易类库) parameters appear in the robot's parameter list (user guide: it is integrated into MyLanguage strategies; the run-time error `Please import MyLanguage Class` means it is missing). The important ones: `RunMode` 执行方式 — `收盘价模型|Bar` evaluates on the closed bar and sends orders at the start of the next bar; `实时价模型|Tick` re-evaluates the forming bar on every poll and trades immediately (signals can appear mid-bar; `MULTSIG` forces this mode). `TradeAmount` default lot; `MaxAmountOnce` splits big orders; `SlideTick` slippage in ticks added to the opposite price; `MaxRetry`, `RetryDelay`, `LoopInterval` (REST polling ms); `AutoRecover` restores the signal state (`_G("_ctx")`) and account snapshot after a restart — when off, logs and state are reset at start; `MarginLevel` leverage (crypto futures); spot only: `Lot`, `MinStock`, `ZPrecision`/`XPrecision`, `TradeFee`; `WXNotify` pushes each signal (`Log(..., "@")`). The names here come from the library's source; the robot UI shows their labels.
- Order path, futures: open = `Buy/Sell` at ask1/bid1 ± `SlideTick` ticks, capped by `MaxAmountOnce` and the exchange's max order size, loop until the position grew by the requested lots, cancelling leftovers; opening against an existing opposite position throws `发现有相反仓位`. Close = `closebuy`/`closesell` (CTP: 平今/平昨) the same way. Spot: `BK`/`BP` buy, `SK`/`SP` sell coins; the "position" is the coin balance change since the library's account snapshot — there is no real short on spot. Stock exchanges (Futu/XTP): `SK`, `BP` are ignored and `SPK` becomes `SP`.
- CTP: the robot waits for the trading session (`等待交易时间开始`) and for the market feed; `CLOSEMINUTE` (minutes to the day-session close; implemented by the runtime although `functions.md` omits it) is a futures/stock heuristic and is always 1440 on crypto, so `CLOSEMINUTE<=1,CLOSEOUT;` never fires there.
- Backtest vs live: the same compiled code runs in the backtester with the same trade library semantics (`RunMode` applies there too) and no sleeps. Fills in backtest come from the simulated book with the backtest's slippage/fee settings; live fills come from the loop above, so `BKPRICEAV` and `MONEYTOT` differ between the two. `INFO` logs only on the live bar.

## Pitfalls

- Full-width punctuation (`，` `；` `（`): the lexer treats every multi-byte character as a letter, so `C>O，BK;` becomes one identifier `O，BK` and fails with `undefined locals` or a syntax error on that line. Use ASCII `, ; ( )`.
- A missing `;` is `Line N: syntax error`. `#IMPORT`/`#EXPORT`/`#END` lines take no `;`.
- Any name not in `references/functions.md` is an error — including Wenhua-only functions (`FEE`, `SETDEALPERCENT`, `CONDITION_ORDER`, `STOP`, `CLOSEMINUTE1`, `REFWH`, `KLINESIG`). Check the table before using a function; do not guess argument orders either (`SMA(X,N,M)`, `SAR(N,STEP,MAX)`, `ROUND(N,M)`).
- `==`, `!=`, `!` do not exist: use `=`, `<>`, `NOT()`.
- Signal flicker: in the tick model a condition on `C` flips during the bar; because one instruction per bar is executed and `BKPRICE` is the bar close at execution, a mid-bar BK followed by a mid-bar stop on the same bar is blocked until the next bar. Prefer the bar-close model unless the strategy needs intrabar fills; then design conditions on `H`/`L`/`REF` values that do not flicker.
- Warm-up silence: lines that lack history or reference a signal that has not happened simply do nothing — guard entries with `BARPOS>=N` as the turtle template does, and remember `BARSBK=1` style conditions are false (absent) until a BK has executed.
- Lots vs multiplier: `BK(n)` sends n as the order amount — contracts for futures, coins for spot. `UNIT` is the contract multiplier, so cash risk per lot is `UNIT*price`; size with `MONEYTOT`/`UNIT` as in the turtle example, and round with `INTPART`.
- Cross-period references: `VAR15.X` is recomputed on every robot bar from the imported period's current, still-forming bar, so it moves inside the 15-minute window. For completed-bar values export `X1:=REF(X,1);` inside the `#EXPORT` block and read `VAR15.X1`. Only names assigned in the block (plus built-ins) are readable; the exported formula must be in the same source file.
- Parameters named in `save_strategy.args` must be valid identifiers and will be read in UPPER CASE; do not also assign them in code.
- `ISLASTxx`, `BARSxx` and the signal log reflect executed instructions, not conditions that were true but filtered out — and an instruction whose order placed nothing (lot 0, insufficient funds, exchange error) still counts as executed: `ISLASTBK` becomes 1 while `BKVOL` stays 0 and `BKPRICE` keeps its old value. Guard entries with `BKVOL=0&&SKVOL=0` when sizing can come out as 0.
- An opposite position on the exchange that the model does not know about (manual trade) makes the next open throw `发现有相反仓位, 终止开仓` and the robot stops; flatten by hand or restart with `AutoRecover` off.

## Save and run

1. Write the source (plain text; FMZ exports MyLanguage strategies as `.txt`).
2. `check_strategy` with `language: "mylanguage"` compiles it (returns `{ok, error}`, errors carry `Line N:`).
3. `save_strategy` with `language: "mylanguage"`, `source`, `name`, `args` for interface parameters. Returns `strategy_id`.
4. `run_backtest` with `strategy_id` (or `source` + `language: "mylanguage"`), `begin`/`end`, `period` (the K-line period the formula sees), `exchanges` → `get_backtest`. The in-source backtest header for MyLanguage is a `(* *)` comment, not `/* */` (which does not lex):

```
(*backtest
start: 2024-01-01 00:00:00
end: 2024-06-01 00:00:00
period: 1h
basePeriod: 15m
exchanges: [{"eid":"Futures_Binance","currency":"BTC_USDT"}]
*)
```

5. `create_robot` with the strategy, one exchange account and `period`; set the trade library parameters (`RunMode`, `TradeAmount`, `ContractType` for futures) in `args` together with the strategy's own parameters. Read `get_robot_logs` for the `信号所在行数` lines to confirm which line fired.

## References

- `references/functions.md` — every function and keyword that exists on FMZ (name, 中文, English). Authoritative.
- `references/examples/*.txt` — official templates: `海龟交易` (sizing, adding, stops, `TRADE_AGAIN`), `跨指标` (KDJ + MA, `..`/`^^` outputs), `多周期引用` (`#EXPORT`/`#IMPORT`), `限价止损+限价止赢` (`MINPRICE1` stops), `MA组合`, `ATR`, `CCI`, `BBIBOLL`, screening formulas with `SELECT`.
- Sibling skills: `fmz-backtest` (backtest header fields, reading results), `fmz-platform` (MCP tools, robot lifecycle, safety rules).
- Platform docs: FMZ MyLanguage documentation `https://www.fmz.com/bbs-topic/2569`; trade library parameters `https://www.fmz.com/bbs-topic/5768`.
