//! Rust strategy SDK — API stub (rust-analyzer + AI context).
//! The SDK API below is auto-injected via the prelude: call it directly
//! (exchange, exchanges, TA, Log!/LogStatus!/LogProfit!, _G!/_C!, types, params,
//! ...) — no `use`/`mod`/`extern crate` is needed for it.
//!
//! Lifecycle: the strategy entry is `fn main()`. A strategy may also optionally
//! define `fn init()` and/or `fn onexit()` (both no-arg) — the bootstrap wires
//! them automatically: `init()` runs before `main()`, `onexit()` runs on exit
//! (same as the JS entry functions). `OnExit(...)` can register extra exit
//! hooks programmatically.
//!
//! Third-party crates ARE supported. The strategy source is the only file you
//! write (there is no separate Cargo.toml), so declare deps with a cargo-script
//! frontmatter at the very top of the source — a `---` fence, a TOML
//! `[dependencies]` table, then a closing `---`:
//!     ---
//!     [dependencies]
//!     serde_json = "1"
//!     ---
//!     fn main() {
//!         let v: serde_json::Value = serde_json::from_str(params()).unwrap();
//!         Log!("tNum =", v["tNum"].as_f64().unwrap_or(0.0));
//!     }
//! The table is merged into Cargo.toml at build time; then `use` those crates
//! normally (only SDK items skip `use`, external crates do not).
//!
//! TLS: the sandbox has no system OpenSSL, so for any crate doing TLS
//! (websocket / HTTP clients) PREFER pure-Rust rustls over native-tls/openssl —
//! native-tls pulls openssl-sys and fails to build. e.g.
//!     tokio-tungstenite = { version = "0.21", default-features = false, features = ["connect", "rustls-tls-webpki-roots"] }
//! rustls is also self-contained (no system lib at runtime), so it stays portable
//! across live robots (windows/linux/mac). Better still, for websockets use the
//! built-in `Dial("wss://...")` — no external crate needed.
//!
//! Strategy parameters are injected as global constants — reference each by its
//! own name directly (no `use`, same as the SDK API). The Rust type is derived
//! from the parameter's real value, so write code against that type and cast
//! only when you need another:
//!     number             -> f64                 // index/count: `N as usize` / `N as i64`
//!     boolean            -> bool
//!     string / password  -> &str                // pass straight to the API; it is NOT String
//!     dropdown, single   -> f64 | bool | &str   // by the selected option's value type
//!     dropdown, multiple -> &[i64] (all ints) | &[f64] (any decimal) | &[&str]
//!     anything else      -> &str                // the value's raw JSON text — parse it
//! So e.g. `exchange.GetTicker(SYMBOL)` works because SYMBOL is `&str` (passing a
//! `String` would fail `impl Into<Option<&str>>`); a numeric param is `f64`, so
//! cast for integer uses: `let n = Period as usize;`. The full parameter set is
//! also available as JSON text via `params()`.

#![allow(non_snake_case, non_upper_case_globals, dead_code, unused_variables)]

use std::collections::BTreeMap;

/// A parsed JSON value (the Rust equivalent of the other runtimes' `any`).
/// Read scalars with `as_f64`/`as_i64`/`as_bool`/`as_str`; navigate objects/arrays
/// with `get(key)`/`get(i)` or indexing (`v["a"][0]`).
#[derive(Clone, Debug, PartialEq)]
pub enum JsonValue {
    Null,
    Bool(bool),
    Number(f64),
    String(String),
    Array(Vec<JsonValue>),
    Object(BTreeMap<String, JsonValue>),
}
impl Default for JsonValue {
    fn default() -> Self {
        JsonValue::Null
    }
}
/// Index into a [`JsonValue`] — a string key (objects) or a `usize` (arrays);
/// lets `get(...)` and `value[...]` take either.
pub trait Index {
    #[doc(hidden)]
    fn index_into<'v>(&self, v: &'v JsonValue) -> Option<&'v JsonValue>;
}
impl Index for &str {
    fn index_into<'v>(&self, v: &'v JsonValue) -> Option<&'v JsonValue> {
        todo!()
    }
}
impl Index for usize {
    fn index_into<'v>(&self, v: &'v JsonValue) -> Option<&'v JsonValue> {
        todo!()
    }
}

impl JsonValue {
    /// Object member by key, or array element by index — `get("k")` / `get(0)`.
    pub fn get<I: Index>(&self, index: I) -> Option<&JsonValue> {
        todo!()
    }
    /// `Some(())` if this is `Null`, else `None`.
    pub fn as_null(&self) -> Option<()> {
        todo!()
    }
    /// The bool if this is `Bool`, else `None`.
    pub fn as_bool(&self) -> Option<bool> {
        todo!()
    }
    /// The number as `f64` if this is `Number`, else `None`.
    pub fn as_f64(&self) -> Option<f64> {
        todo!()
    }
    /// The number truncated to `i64` if this is `Number`, else `None`.
    pub fn as_i64(&self) -> Option<i64> {
        todo!()
    }
    /// The number truncated to `u64` if this is `Number`, else `None`.
    pub fn as_u64(&self) -> Option<u64> {
        todo!()
    }
    /// The string slice if this is `String`, else `None`.
    pub fn as_str(&self) -> Option<&str> {
        todo!()
    }
    /// The elements if this is `Array`, else `None`.
    pub fn as_array(&self) -> Option<&Vec<JsonValue>> {
        todo!()
    }
    /// The key→value map if this is `Object`, else `None`.
    pub fn as_object(&self) -> Option<&BTreeMap<String, JsonValue>> {
        todo!()
    }
    /// True if this is `Null`.
    pub fn is_null(&self) -> bool {
        todo!()
    }
    /// True if this is `Bool`.
    pub fn is_boolean(&self) -> bool {
        todo!()
    }
    /// True if this is `Number`.
    pub fn is_number(&self) -> bool {
        todo!()
    }
    /// True if this is `String`.
    pub fn is_string(&self) -> bool {
        todo!()
    }
    /// True if this is `Array`.
    pub fn is_array(&self) -> bool {
        todo!()
    }
    /// True if this is `Object`.
    pub fn is_object(&self) -> bool {
        todo!()
    }
}

/// `value["key"]` / `value[0]` — returns `Null` (never panics) when the key or
/// index is absent; chains: `v["a"]["b"][0]`.
impl<I: Index> std::ops::Index<I> for JsonValue {
    type Output = JsonValue;
    fn index(&self, index: I) -> &JsonValue {
        todo!()
    }
}
/// Parse a JSON string into a [`JsonValue`] tree (the canonical `JSONParse`);
/// `None` on malformed input.
pub fn JSONParse(s: &str) -> Option<JsonValue> {
    todo!()
}

/// Error returned by fallible API calls (`Result<T>`).
#[derive(Debug)]
pub enum Error {
    /// Host signalled stop (robot stop / timeout).
    Stopped,
    /// Backtest reached the end of its time window (engine EOTException).
    Eot,
    /// An exchange/API error, carrying the host's message.
    Api(String),
}

impl std::fmt::Display for Error {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Error::Stopped => write!(f, "strategy stopped by host"),
            Error::Eot => write!(f, "strategy stopped by host (end of backtest)"),
            Error::Api(s) => write!(f, "{}", s),
        }
    }
}
impl std::error::Error for Error {}
/// Result of a fallible API call: `Ok(value)` or [`Err(Error)`](Error).
pub type Result<T> = std::result::Result<T, Error>;

/// A strategy value passed to the host, the typed equivalent of Go's `any`.
#[derive(Clone, Debug)]
pub enum Arg {
    Null,
    Str(String),
    Bool(bool),
    Int(i64),
    Float(f64),
}

/// Converts a value into an [`Arg`] for the variadic `Log!`/`LogStatus!` macros
/// and [`IO`](Exchange::IO)-style args.
pub trait ToArg {
    fn to_arg(&self) -> Arg;
}

macro_rules! to_arg_int {
    ($($t:ty),*) => {$(impl ToArg for $t { fn to_arg(&self) -> Arg { Arg::Int(*self as i64) } })*};
}
macro_rules! to_arg_float {
    ($($t:ty),*) => {$(impl ToArg for $t { fn to_arg(&self) -> Arg { Arg::Float(*self as f64) } })*};
}
to_arg_int!(i8, i16, i32, i64, isize, u8, u16, u32, u64, usize);
to_arg_float!(f32, f64);
impl ToArg for bool {
    fn to_arg(&self) -> Arg {
        Arg::Bool(*self)
    }
}
impl ToArg for &str {
    fn to_arg(&self) -> Arg {
        Arg::Str((*self).to_string())
    }
}
impl ToArg for String {
    fn to_arg(&self) -> Arg {
        Arg::Str(self.clone())
    }
}
impl ToArg for &String {
    fn to_arg(&self) -> Arg {
        Arg::Str(self.to_string())
    }
}
impl ToArg for JsonValue {
    fn to_arg(&self) -> Arg {
        Arg::Str(format!("{:?}", self))
    }
}
impl ToArg for Arg {
    fn to_arg(&self) -> Arg {
        self.clone()
    }
}
impl ToArg for OrderId {
    fn to_arg(&self) -> Arg {
        Arg::Str(self.to_string())
    }
}
impl ToArg for Error {
    fn to_arg(&self) -> Arg {
        Arg::Str(self.to_string())
    }
}
impl<T: ToArg> ToArg for std::result::Result<T, Error> {
    fn to_arg(&self) -> Arg {
        match self {
            Ok(v) => v.to_arg(),
            Err(e) => e.to_arg(),
        }
    }
}
impl<T: std::fmt::Debug> ToArg for Vec<T> {
    fn to_arg(&self) -> Arg {
        Arg::Str(format!("{:?}", self))
    }
}
impl<K: std::fmt::Debug, V: std::fmt::Debug> ToArg for BTreeMap<K, V> {
    fn to_arg(&self) -> Arg {
        Arg::Str(format!("{:?}", self))
    }
}
macro_rules! to_arg_debug {
    ($($t:ty),* $(,)?) => {$(impl ToArg for $t {
        fn to_arg(&self) -> Arg { Arg::Str(format!("{:?}", self)) }
    })*};
}
to_arg_debug!(
    Ticker, Record, MarketOrder, Depth, Account, Asset, OrderCondition, Order,
    Position, Trade, Funding, Data,
);

/// Argument forms for [`IO`](Exchange::IO)/[`Go`](Exchange::Go)/[`Futures_OP`](Exchange::Futures_OP):
/// a tuple of mixed [`ToArg`] values, a single value, a `Vec<Arg>`, or `()`.
pub trait IoArgs {
    #[doc(hidden)]
    fn into_io_args(self) -> Vec<Arg>;
}
impl IoArgs for Vec<Arg> {
    fn into_io_args(self) -> Vec<Arg> {
        todo!()
    }
}
impl IoArgs for () {
    fn into_io_args(self) -> Vec<Arg> {
        todo!()
    }
}
impl IoArgs for &str {
    fn into_io_args(self) -> Vec<Arg> {
        todo!()
    }
}
impl IoArgs for String {
    fn into_io_args(self) -> Vec<Arg> {
        todo!()
    }
}
macro_rules! impl_io_args_tuple {
    ($($T:ident $i:tt),+) => {
        impl<$($T: ToArg),+> IoArgs for ($($T,)+) {
            fn into_io_args(self) -> Vec<Arg> {
                todo!()
            }
        }
    };
}
impl_io_args_tuple!(A 0);
impl_io_args_tuple!(A 0, B 1);
impl_io_args_tuple!(A 0, B 1, C 2);
impl_io_args_tuple!(A 0, B 1, C 2, D 3);
impl_io_args_tuple!(A 0, B 1, C 2, D 3, E 4);
impl_io_args_tuple!(A 0, B 1, C 2, D 3, E 4, F 5);

#[doc(hidden)]
pub fn log_args(op: &str, args: &[Arg]) {
    let _ = (op, args);
}

#[doc(hidden)]
pub fn retry_delay_ms() -> f64 {
    todo!()
}

// PERIOD_* are bar durations in SECONDS (the `period` arg to GetRecords) — not ms.
pub const PERIOD_M1: i64 = 60;
pub const PERIOD_M3: i64 = 60 * 3;
pub const PERIOD_M5: i64 = 60 * 5;
pub const PERIOD_M15: i64 = 60 * 15;
pub const PERIOD_M30: i64 = 60 * 30;
pub const PERIOD_H1: i64 = 60 * 60;
pub const PERIOD_H2: i64 = 60 * 60 * 2;
pub const PERIOD_H4: i64 = 60 * 60 * 4;
pub const PERIOD_H6: i64 = 60 * 60 * 6;
pub const PERIOD_H12: i64 = 60 * 60 * 12;
pub const PERIOD_D1: i64 = 60 * 60 * 24;
pub const PERIOD_D3: i64 = 60 * 60 * 24 * 3;
pub const PERIOD_W1: i64 = 60 * 60 * 24 * 7;

pub const ORDER_STATE_PENDING: i32 = 0;
pub const ORDER_STATE_CLOSED: i32 = 1;
pub const ORDER_STATE_CANCELED: i32 = 2;
pub const ORDER_STATE_UNKNOWN: i32 = 3;

pub const ORDER_TYPE_BUY: i32 = 0;
pub const ORDER_TYPE_SELL: i32 = 1;

pub const LOG_TYPE_BUY: i32 = 0;
pub const LOG_TYPE_SELL: i32 = 1;
pub const LOG_TYPE_CANCEL: i32 = 2;
pub const LOG_TYPE_ERROR: i32 = 3;
pub const LOG_TYPE_PROFIT: i32 = 4;
pub const LOG_TYPE_LOG: i32 = 5;
pub const LOG_TYPE_RESTART: i32 = 6;

pub const ORDER_OFFSET_OPEN: i32 = 0;
pub const ORDER_OFFSET_CLOSE: i32 = 1;

pub const PD_LONG: i32 = 0;
pub const PD_SHORT: i32 = 1;
pub const PD_LONG_YD: i32 = 2;
pub const PD_SHORT_YD: i32 = 3;

pub const ORDER_CONDITION_TYPE_OCO: i32 = 0;
pub const ORDER_CONDITION_TYPE_TP: i32 = 1;
pub const ORDER_CONDITION_TYPE_SL: i32 = 2;
pub const ORDER_CONDITION_TYPE_GENERIC: i32 = 3;

/// An order id — either numeric (`I64`) or string (`S`), per the exchange.
#[derive(Clone, Debug, Default)]
pub struct OrderId {
    /// Numeric order id (used when the exchange ids are integers).
    pub I64: i64,
    /// String order id (used when the exchange ids are strings).
    pub S: String,
}

impl std::fmt::Display for OrderId {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        if !self.S.is_empty() {
            write!(f, "{}", self.S)
        } else {
            write!(f, "{}", self.I64)
        }
    }
}

/// A market snapshot for one symbol (`exchange.GetTicker`).
#[derive(Clone, Debug, Default)]
pub struct Ticker {
    /// Unix timestamp in milliseconds.
    pub Time: i64,
    /// Trading-pair symbol.
    pub Symbol: String,
    /// Opening price of the period.
    pub Open: f64,
    /// 24-hour high price.
    pub High: f64,
    /// 24-hour low price.
    pub Low: f64,
    /// Best ask (lowest sell) price.
    pub Sell: f64,
    /// Best bid (highest buy) price.
    pub Buy: f64,
    /// Last traded price.
    pub Last: f64,
    /// 24-hour traded volume.
    pub Volume: f64,
    /// Open interest (futures).
    pub OpenInterest: f64,
    /// Raw exchange response, parsed to a [`JsonValue`].
    pub Info: JsonValue,
}

/// One K-line (candlestick) bar — OHLCV (`exchange.GetRecords`).
#[derive(Clone, Debug, Default)]
pub struct Record {
    /// Unix timestamp in milliseconds.
    pub Time: i64,
    /// Open price.
    pub Open: f64,
    /// High price.
    pub High: f64,
    /// Low price.
    pub Low: f64,
    /// Close price.
    pub Close: f64,
    /// Volume.
    pub Volume: f64,
    /// Open interest (futures).
    pub OpenInterest: f64,
}

/// One price level in an order book (`Depth.Asks`/`Bids`).
#[derive(Clone, Debug, Default)]
pub struct MarketOrder {
    /// Price at this level.
    pub Price: f64,
    /// Amount available at this level.
    pub Amount: f64,
}

/// Order book (`exchange.GetDepth`); `Asks` ascend in price, `Bids` descend.
#[derive(Clone, Debug, Default)]
pub struct Depth {
    /// Snapshot time in ms (live only; 0 when the host does not provide it).
    pub Time: i64,
    /// Ask levels, sorted by price low→high (`Asks[0]` is the best ask).
    pub Asks: Vec<MarketOrder>,
    /// Bid levels, sorted by price high→low (`Bids[0]` is the best bid).
    pub Bids: Vec<MarketOrder>,
    /// Raw exchange response, parsed to a [`JsonValue`].
    pub Info: JsonValue,
}

/// Account balances (`exchange.GetAccount`).
#[derive(Clone, Debug, Default)]
pub struct Account {
    /// Quote-currency balance (e.g. USDT); for futures, available margin.
    pub Balance: f64,
    /// Frozen quote-currency balance (locked in open orders).
    pub FrozenBalance: f64,
    /// Base-currency balance (e.g. BTC).
    pub Stocks: f64,
    /// Frozen base-currency balance.
    pub FrozenStocks: f64,
    /// Total equity incl. unrealized PnL (futures; best-effort — only some hosts fill it).
    pub Equity: f64,
    /// Unrealized PnL (futures; best-effort — only some hosts fill it).
    pub UPnL: f64,
    /// Raw exchange response, parsed to a [`JsonValue`].
    pub Info: JsonValue,
}

/// A single currency's holdings (`exchange.GetAssets`).
#[derive(Clone, Debug, Default)]
pub struct Asset {
    /// Currency name, e.g. "BTC", "USDT".
    pub Currency: String,
    /// Available amount.
    pub Amount: f64,
    /// Frozen amount (locked in open orders).
    pub FrozenAmount: f64,
}

/// Take-profit / stop-loss parameters of a conditional order (`ConditionType`
/// -1 = not set, else an `ORDER_CONDITION_TYPE_*` value).
#[derive(Clone, Debug, Default)]
pub struct OrderCondition {
    /// `ORDER_CONDITION_TYPE_*` (-1 = a plain, non-conditional order).
    pub ConditionType: i32,
    /// Take-profit trigger price.
    pub TpTriggerPrice: f64,
    /// Take-profit order price.
    pub TpOrderPrice: f64,
    /// Stop-loss trigger price.
    pub SlTriggerPrice: f64,
    /// Stop-loss order price.
    pub SlOrderPrice: f64,
}

/// An order (`exchange.GetOrder`/`GetOrders`/...).
#[derive(Clone, Debug, Default)]
pub struct Order {
    /// Order id.
    pub Id: OrderId,
    /// Trading-pair symbol.
    pub Symbol: String,
    /// Unix timestamp in milliseconds.
    pub Time: i64,
    /// Order price.
    pub Price: f64,
    /// Order quantity.
    pub Amount: f64,
    /// Filled quantity.
    pub DealAmount: f64,
    /// Average fill price.
    pub AvgPrice: f64,
    /// `ORDER_TYPE_*` (0 = buy, 1 = sell).
    pub Type: i32,
    /// `ORDER_OFFSET_*` (futures: 0 = open, 1 = close).
    pub Offset: i32,
    /// `ORDER_STATE_*` (pending / closed / canceled / unknown).
    pub Status: i32,
    /// Contract type (futures), e.g. "swap", "quarter".
    pub ContractType: String,
    /// TP/SL of a conditional order; `ConditionType` -1 for a plain order.
    pub Condition: OrderCondition,
    /// Raw exchange response, parsed to a [`JsonValue`].
    pub Info: JsonValue,
}

/// An open position (`exchange.GetPositions`, futures).
#[derive(Clone, Debug, Default)]
pub struct Position {
    /// Leverage multiplier.
    pub MarginLevel: f64,
    /// Position size.
    pub Amount: f64,
    /// Frozen amount (size locked in pending close orders).
    pub FrozenAmount: f64,
    /// Average entry price.
    pub Price: f64,
    /// Unrealized profit and loss.
    pub Profit: f64,
    /// Margin held for the position.
    pub Margin: f64,
    /// Direction: `PD_LONG`/`PD_SHORT`/`PD_LONG_YD`/`PD_SHORT_YD`.
    pub Type: i32,
    /// Trading-pair symbol.
    pub Symbol: String,
    /// Contract type, e.g. "swap", "quarter".
    pub ContractType: String,
    /// Raw exchange response, parsed to a [`JsonValue`].
    pub Info: JsonValue,
}

/// A public market trade (`exchange.GetTrades`).
#[derive(Clone, Debug, Default)]
pub struct Trade {
    /// Trade id.
    pub Id: OrderId,
    /// Unix timestamp in milliseconds.
    pub Time: i64,
    /// Trade price.
    pub Price: f64,
    /// Trade amount.
    pub Amount: f64,
    /// `ORDER_TYPE_*` (0 = buy, 1 = sell).
    pub Type: i32,
}

/// A funding-rate entry (`exchange.GetFundings`, perpetuals).
#[derive(Clone, Debug, Default)]
pub struct Funding {
    /// Unix timestamp in milliseconds.
    pub Time: i64,
    /// Funding rate (e.g. 0.0001 = 0.01%).
    pub Rate: f64,
    /// Settlement interval in milliseconds (e.g. 8h = 28800000).
    pub Interval: i32,
    /// Trading-pair symbol.
    pub Symbol: String,
    /// Raw exchange response, parsed to a [`JsonValue`].
    pub Info: JsonValue,
}

/// A value from the exchange data store / feed (`exchange.GetData`).
#[derive(Clone, Debug, Default)]
pub struct Data {
    /// Unix timestamp in milliseconds.
    pub Time: i64,
    /// The stored value as a JSON string (parse it yourself).
    pub Data: String,
}

/// Trading-pair metadata — one entry of the [`GetMarkets`](Exchange::GetMarkets)
/// map. Absent optional fields default to 0 / "".
#[derive(Clone, Debug, Default)]
pub struct Market {
    /// Trading-pair symbol, e.g. "BTC_USDT" (futures "BTC_USDT.swap").
    pub Symbol: String,
    /// Base asset (traded currency), e.g. "BTC".
    pub BaseAsset: String,
    /// Quote asset, e.g. "USDT".
    pub QuoteAsset: String,
    /// Minimum price tick size, e.g. 0.01.
    pub TickSize: f64,
    /// Minimum amount step size, e.g. 0.001.
    pub AmountSize: f64,
    /// Price decimal precision.
    pub PricePrecision: i64,
    /// Amount decimal precision.
    pub AmountPrecision: i64,
    /// Minimum order quantity.
    pub MinQty: f64,
    /// Maximum order quantity.
    pub MaxQty: f64,
    /// Minimum order notional value.
    pub MinNotional: f64,
    /// Maximum order notional value.
    pub MaxNotional: f64,
    /// Contract value (futures).
    pub CtVal: f64,
    /// Currency the contract value is denominated in (futures).
    pub CtValCcy: String,
    /// Raw exchange market info, parsed to a [`JsonValue`].
    pub Info: JsonValue,
}

/// Result of [`DBExec`]/[`Dial::exec`]: column names plus rows of values. A
/// write/DDL statement yields an empty result; a query fills both.
#[derive(Clone, Debug, Default)]
pub struct DBResult {
    /// Column names of the result set.
    pub columns: Vec<String>,
    /// Rows, each a vector of column values.
    pub values: Vec<Vec<JsonValue>>,
}

/// Full HTTP response — what [`HttpQuery`] returns when asked
/// (`let r: HttpRet = HttpQuery(...)`); for just the body, take a `String`. In a
/// backtest Header/Cookies are empty.
#[derive(Clone, Debug, Default)]
pub struct HttpRet {
    /// HTTP status code.
    pub StatusCode: i64,
    /// Response headers — a `{ name: [values...] }` object.
    pub Header: JsonValue,
    /// Response cookies.
    pub Cookies: JsonValue,
    /// Response body.
    pub Body: String,
}

/// Possible return types of [`HttpQuery`] — `String` (body) or [`HttpRet`]
/// (status + headers + body). The call site's return type selects which.
pub trait HttpResp {
    #[doc(hidden)]
    fn want_headers() -> bool;
    #[doc(hidden)]
    fn from_http(raw: String) -> Self;
}
impl HttpResp for String {
    fn want_headers() -> bool {
        todo!()
    }
    fn from_http(raw: String) -> Self {
        todo!()
    }
}
impl HttpResp for HttpRet {
    fn want_headers() -> bool {
        todo!()
    }
    fn from_http(raw: String) -> Self {
        todo!()
    }
}

/// A configured exchange — use the global `exchange` (or `exchanges[i]`) to call
/// market-data and trading methods.
#[derive(Clone, Debug, Default)]
pub struct Exchange;

impl Exchange {
    /// Exchange platform name, e.g. "Binance", "Futures_Binance".
    pub fn GetName(&self) -> String {
        todo!()
    }
    /// Custom label set when configuring the exchange on the platform.
    pub fn GetLabel(&self) -> String {
        todo!()
    }
    /// Current trading-pair string, e.g. "BTC_USDT".
    pub fn GetCurrency(&self) -> String {
        todo!()
    }
    /// Quote-currency name of the current pair, e.g. "USDT".
    pub fn GetQuoteCurrency(&self) -> String {
        todo!()
    }
    /// Base-currency name of the current pair, e.g. "BTC".
    pub fn GetBaseCurrency(&self) -> String {
        todo!()
    }

    /// Ticker; `symbol` "" or `None` means the configured trading pair, e.g.
    /// `exchange.GetTicker("ETH_USDT")`.
    pub fn GetTicker<'a>(&self, symbol: impl Into<Option<&'a str>>) -> Result<Ticker> {
        todo!()
    }

    /// Order book; `symbol` "" or `None` means the configured trading pair.
    pub fn GetDepth<'a>(&self, symbol: impl Into<Option<&'a str>>) -> Result<Depth> {
        todo!()
    }

    /// Fetch K-line records (`GetRecords(symbol?, period?, limit?)`). All three
    /// args are optional — pass `None` (or the bare value) for any; `period` is in
    /// seconds (the `PERIOD_*` constants).
    pub fn GetRecords<'a>(
        &self,
        symbol: impl Into<Option<&'a str>>,
        period: impl Into<Option<i64>>,
        limit: impl Into<Option<i64>>,
    ) -> Result<Vec<Record>> {
        todo!()
    }

    /// Account balances of the configured pair.
    pub fn GetAccount(&self) -> Result<Account> {
        todo!()
    }

    /// Per-currency asset balances.
    pub fn GetAssets(&self) -> Result<Vec<Asset>> {
        todo!()
    }

    /// Open orders; `symbol` "" or `None` means the configured trading pair.
    pub fn GetOrders<'a>(&self, symbol: impl Into<Option<&'a str>>) -> Result<Vec<Order>> {
        todo!()
    }

    /// One order by id.
    pub fn GetOrder(&self, id: &OrderId) -> Result<Order> {
        todo!()
    }

    /// Place an order; `symbol` "" or `None` = the configured pair. `side` is
    /// "buy"/"sell"/"closebuy"/"closesell"; market order with `price` -1.
    pub fn CreateOrder<'a>(&self, symbol: impl Into<Option<&'a str>>, side: &str, price: impl ToF64, amount: impl ToF64) -> Result<OrderId> {
        todo!()
    }

    /// Buy order on the configured pair (spot buy / futures buy per direction);
    /// `price` -1 for a market order. Prefer [`CreateOrder`](Self::CreateOrder).
    pub fn Buy(&self, price: impl ToF64, amount: impl ToF64) -> Result<OrderId> {
        todo!()
    }

    /// Sell order on the configured pair (spot sell / futures sell per direction);
    /// `price` -1 for a market order. Prefer [`CreateOrder`](Self::CreateOrder).
    pub fn Sell(&self, price: impl ToF64, amount: impl ToF64) -> Result<OrderId> {
        todo!()
    }

    /// Draw a manual simulated-trade marker (`order_type` is `ORDER_TYPE_BUY`/
    /// `ORDER_TYPE_SELL`); no real order. Distinct from the `Log!` logging macro.
    pub fn Log(&self, order_type: i32, price: impl ToF64, amount: impl ToF64) {
        todo!()
    }

    /// Cancel an order by id.
    pub fn CancelOrder(&self, id: &OrderId) -> Result<()> {
        todo!()
    }

    /// Positions; `symbol` "" or `None` means the configured trading pair.
    pub fn GetPositions<'a>(&self, symbol: impl Into<Option<&'a str>>) -> Result<Vec<Position>> {
        todo!()
    }

    /// Set the contract type (futures), e.g. "swap"/"quarter"; call before trading.
    pub fn SetContractType(&self, contract_type: &str) -> Result<String> {
        todo!()
    }

    /// **不推荐**：优先用 `CreateOrder`(可直接指定 side: "buy"/"sell"/...),无需先 `SetDirection`。
    pub fn SetDirection(&self, direction: &str) -> Result<String> {
        todo!()
    }

    /// Every market's latest ticker.
    pub fn GetTickers(&self) -> Result<Vec<Ticker>> {
        todo!()
    }

    /// Recent public trades; `symbol` "" or `None` = the configured pair.
    pub fn GetTrades<'a>(&self, symbol: impl Into<Option<&'a str>>) -> Result<Vec<Trade>> {
        todo!()
    }

    /// Funding-rate history (perpetuals); `symbol` "" or `None` = the configured pair.
    pub fn GetFundings<'a>(&self, symbol: impl Into<Option<&'a str>>) -> Result<Vec<Funding>> {
        todo!()
    }

    /// Finished orders; `symbol` "" = the configured pair. `since`/`limit` page the history.
    pub fn GetHistoryOrders<'a>(&self, symbol: impl Into<Option<&'a str>>, since: impl Into<Option<i64>>, limit: impl Into<Option<i64>>) -> Result<Vec<Order>> {
        todo!()
    }

    /// Switch the current trading pair, e.g. "ETH_USDT".
    pub fn SetCurrency(&self, symbol: &str) {
        todo!()
    }
    /// Current exchange API base address.
    pub fn GetBase(&self) -> String {
        todo!()
    }
    /// Set the exchange API base URL (e.g. switch to a testnet). Live only.
    pub fn SetBase(&self, base: &str) -> String {
        todo!()
    }
    /// Currently set contract type (futures), e.g. "swap".
    pub fn GetContractType(&self) -> String {
        todo!()
    }
    /// All trading-pair metadata as a `symbol -> Market` map.
    pub fn GetMarkets(&self) -> BTreeMap<String, Market> {
        todo!()
    }
    /// Set a fiat conversion rate (all prices multiplied by it); returns the effective rate.
    pub fn SetRate(&self, rate: impl ToF64) -> f64 {
        todo!()
    }
    /// Set order price/amount decimal precision (values truncated when ordering).
    pub fn SetPrecision(&self, price: i64, amount: i64) {
        todo!()
    }
    /// Set the max number of K-line bars cached (default 500).
    pub fn SetMaxBarLen(&self, n: i64) {
        todo!()
    }
    /// Set the leverage multiplier (futures), e.g. 10 for 10x.
    pub fn SetMarginLevel(&self, level: impl ToF64) {
        todo!()
    }
    /// Effective fiat conversion rate (the value `SetRate` established, else 1).
    pub fn GetRate(&self) -> f64 {
        todo!()
    }
    /// Legacy fiat reference rate USD→CNY.
    pub fn GetUSDCNY(&self) -> f64 {
        todo!()
    }
    /// Legacy fiat reference rate EUR→CNY.
    pub fn GetEURCNY(&self) -> f64 {
        todo!()
    }
    /// Route this exchange's HTTP/WS through a proxy ("" clears). Live only.
    pub fn SetProxy(&self, proxy: &str) {
        todo!()
    }
    /// Per-request timeout in milliseconds. Live only.
    pub fn SetTimeout(&self, ms: impl ToF64) {
        todo!()
    }
    /// HMAC signature helper.
    pub fn HMAC(&self, algo: &str, out_algo: &str, data: &str, key: &str) -> String {
        todo!()
    }

    /// Configured K-line period in **seconds**.
    pub fn GetPeriod(&self) -> i64 {
        todo!()
    }

    /// Amend an open order; returns the (possibly new) order id. `side`
    /// ("buy"/"sell") is required by the engine.
    pub fn ModifyOrder(&self, id: &OrderId, side: &str, price: impl ToF64, amount: impl ToF64) -> Result<OrderId> {
        todo!()
    }

    /// Raw futures control op. `op` is a `FUTURES_OP_*` code; `args` are op-specific
    /// (same shapes as [`IO`](Self::IO)). Returns the raw JSON result.
    pub fn Futures_OP(&self, op: i64, args: impl IoArgs) -> Result<String> {
        todo!()
    }

    /// Raw exchange IO passthrough (native API calls, mode switching, ...) —
    /// `exchange.IO(("api", "GET", "/v3/ticker", "symbol=BTC"))`. See [`IoArgs`].
    pub fn IO(&self, args: impl IoArgs) -> Result<String> {
        todo!()
    }

    /// Place a conditional (stop-loss / take-profit) order; "" symbol = the
    /// configured pair. `side` is "buy"/"sell"/"closebuy"/"closesell".
    pub fn CreateConditionOrder<'a>(&self, symbol: impl Into<Option<&'a str>>, side: &str, amount: impl ToF64, condition: &OrderCondition) -> Result<OrderId> {
        todo!()
    }

    /// Amend a conditional order.
    pub fn ModifyConditionOrder(&self, id: &OrderId, side: &str, amount: impl ToF64, condition: &OrderCondition) -> Result<OrderId> {
        todo!()
    }

    /// Open conditional orders; `symbol` "" = the configured pair.
    pub fn GetConditionOrders<'a>(&self, symbol: impl Into<Option<&'a str>>) -> Result<Vec<Order>> {
        todo!()
    }

    /// Finished conditional orders; `symbol` "" = the configured pair. `since`/`limit` page it.
    pub fn GetHistoryConditionOrders<'a>(&self, symbol: impl Into<Option<&'a str>>, since: impl Into<Option<i64>>, limit: impl Into<Option<i64>>) -> Result<Vec<Order>> {
        todo!()
    }

    /// One conditional order by id.
    pub fn GetConditionOrder(&self, id: &OrderId) -> Result<Order> {
        todo!()
    }

    /// Cancel a conditional order.
    pub fn CancelConditionOrder(&self, id: &OrderId) -> Result<()> {
        todo!()
    }

    /// Store a custom JSON-string value under `pair` in the exchange data store;
    /// returns rows affected.
    pub fn SetData(&self, pair: &str, json_value: &str) -> i64 {
        todo!()
    }

    /// Fetch a value from the exchange data store / feed for `pair` (JSON string in
    /// [`Data::Data`]).
    pub fn GetData(&self, pair: &str) -> Result<Data> {
        todo!()
    }

    /// Start an exchange method asynchronously, typed by a [`mod@Go`] token; one
    /// `.wait()` then yields the token's result type. `args` take [`IO`](Self::IO)'s shapes.
    pub fn Go<M: GoCall>(&self, _method: M, args: impl IoArgs) -> TypedRoutine<M> {
        todo!()
    }
}

pub static exchanges: Vec<Exchange> = Vec::new();

pub static exchange: Exchange = Exchange;

/// The strategy's parameter set as a JSON text (parse it for raw access).
pub fn params() -> &'static str {
    todo!()
}

/// Register an exit hook (runs on stop / after `main` in live mode).
pub fn OnExit<F: FnMut() + 'static>(f: F) {
    let _ = f;
}

/// Lets a numeric argument be passed as any integer or float type (converted to
/// f64) — so f64-taking API calls accept `1000` as readily as `1000.0`.
pub trait ToF64 {
    fn to_f64(self) -> f64;
}
macro_rules! impl_to_f64 {
    ($($t:ty),*) => { $(impl ToF64 for $t { fn to_f64(self) -> f64 { self as f64 } })* };
}
impl_to_f64!(i8, i16, i32, i64, isize, u8, u16, u32, u64, usize, f32, f64);

/// Sleep for `ms` **milliseconds**.
pub fn Sleep(ms: impl ToF64) {
    let _ = ms;
    todo!()
}

/// Current time as a Unix timestamp in **nanoseconds**.
pub fn UnixNano() -> i64 {
    todo!()
}

/// Current time as a Unix timestamp in **seconds** (×1000 for a `Time`/`_D` ms value).
pub fn Unix() -> i64 {
    todo!()
}

/// The runtime/docker version string, e.g. "3.7".
pub fn Version() -> String {
    todo!()
}

/// "<os>/<arch>" of the backtest runtime, e.g. "linux/amd64" (browser: "linux/wasm").
pub fn GetOS() -> String {
    todo!()
}

/// The most recent error message, then clears it (subsequent calls return "" until the next error).
pub fn GetLastError() -> String {
    todo!()
}

/// The PID of the current runtime process.
pub fn GetPid() -> i64 {
    todo!()
}

/// True when running in a backtest (simulation), false in live trading.
pub fn IsVirtual() -> bool {
    todo!()
}

/// Record a profit value and plot it on the profit curve.
pub fn LogProfit(profit: impl ToF64) {
    todo!()
}

/// Poll the interactive command queue; `timeout_ms` < 0 blocks. `None` = no command.
pub fn GetCommand(timeout_ms: impl ToF64) -> Option<String> {
    todo!()
}

/// Format a Unix **millisecond** timestamp as "YYYY-MM-DD HH:MM:SS".
/// `None` = current time; otherwise pass a ms value such as a K-line `Time`
/// (`_D(None)`, `_D(record.Time)`). Not seconds — for a `Unix()` value use
/// `_D(Unix() * 1000)`.
pub fn _D(ts_ms: impl Into<Option<i64>>) -> String {
    todo!()
}

/// Round `n` to `precision` decimals, truncating toward zero (FMZ `_N`):
/// `_N(-2.7, 0)` == -2, not -3.
pub fn _N(n: impl ToF64, precision: i32) -> f64 {
    todo!()
}

/// Trend of two equal-length series at their tail (FMZ `_Cross`): bars `a` has
/// stayed above (`>0`) or below (`<0`) `b`, i.e. how many bars since they crossed.
pub fn _Cross(a: &[f64], b: &[f64]) -> i64 {
    todo!()
}

/// Set the [`_C!`] retry delay in milliseconds (FMZ `_CDelay`).
pub fn _CDelay(ms: impl ToF64) {
    todo!()
}

#[doc(hidden)]
pub fn GSet<V: ToArg>(key: &str, value: V) {
    let _ = (key, value);
}
#[doc(hidden)]
pub fn GGet(key: &str) -> String {
    todo!()
}
#[doc(hidden)]
pub fn GDel(key: &str) {
    todo!()
}
#[doc(hidden)]
pub fn GCls() {
    todo!()
}
/// Robot / live id — the `_G!()` (no-arg) form; 0 in backtest.
#[doc(hidden)]
pub fn GId() -> i64 {
    todo!()
}

/// Enable or disable log recording (`false` reduces database writes).
pub fn EnableLog(enable: bool) {
    todo!()
}

/// Robot meta info (the host's "meta" env value) as a navigable [`JsonValue`].
pub fn GetMeta() -> JsonValue {
    todo!()
}

/// Suppress logging of errors matching the regex `filter` ("" clears all filters).
pub fn SetErrorFilter(filter: &str) {
    todo!()
}

/// Send an email via SMTP; returns whether it was accepted.
pub fn Mail(smtp_host: &str, username: &str, password: &str, to: &str, subject: &str, body: &str) -> bool {
    todo!()
}

/// HTTP request — `url` plus an optional body/options JSON string (`None`/"" = GET).
/// The return type chooses the result: a body `String`, or a full [`HttpRet`].
pub fn HttpQuery<'a, R: HttpResp>(url: &str, option: impl Into<Option<&'a str>>) -> R {
    todo!()
}

/// A random 26-char id (generated locally in a backtest).
pub fn UUID() -> String {
    todo!()
}

/// MD5 hex digest of `s`.
pub fn MD5(s: &str) -> String {
    todo!()
}

/// Generic hash / HMAC / base64 codec (host `Encode`). `key_format`/`key` are ""
/// for plain digests, e.g. `Encode("sha256", "string", "hex", data, "", "")`.
pub fn Encode(algo: &str, input_format: &str, output_format: &str, data: &str, key_format: &str, key: &str) -> String {
    todo!()
}

/// Decode a non-UTF-8 byte string (default charset "gbk") to UTF-8.
pub fn StrDecode(s: &str, charset: &str) -> String {
    todo!()
}

/// A lazily-decrypted encrypted strategy parameter. The server bakes an encrypted
/// UI param as `static name: Decrypted = __decrypt(...)`; it derefs to `&str` so a
/// strategy uses it like any string param.
pub struct Decrypted {
    p: &'static str,
    v: &'static str,
    cache: std::sync::OnceLock<String>,
}
impl Decrypted {
    /// Construct a deferred-decryption param; decryption runs (and caches) on first use.
    pub const fn new(p: &'static str, v: &'static str) -> Self {
        Decrypted { p, v, cache: std::sync::OnceLock::new() }
    }
}
impl std::ops::Deref for Decrypted {
    type Target = str;
    fn deref(&self) -> &str {
        todo!()
    }
}
impl std::fmt::Display for Decrypted {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        todo!()
    }
}
impl ToArg for Decrypted {
    fn to_arg(&self) -> Arg {
        todo!()
    }
}
/// Construct a lazily-decrypted param (a `const fn`, so it can initialise a
/// `static`). Emitted by the server for encrypted UI params. See [`Decrypted`].
pub const fn __decrypt(p: &'static str, v: &'static str) -> Decrypted {
    Decrypted::new(p, v)
}

/// Clear the log table; `reverse` > 0 keeps the newest `reverse` rows.
pub fn LogReset(reverse: i64) {
    todo!()
}
/// Clear the profit log; `reverse` > 0 keeps the newest `reverse` rows.
pub fn LogProfitReset(reverse: i64) {
    todo!()
}
/// Compact the log database. Live only — a clean no-op error in a backtest.
pub fn LogVacuum() {
    todo!()
}

/// Run a local-DB SQL statement (canonical `DBExec`). A query returns its rows and
/// column names; a write/DDL yields an empty [`DBResult`]. Live only.
pub fn DBExec(sql: &str) -> DBResult {
    todo!()
}

/// Block up to `timeout_ms` for the next runtime event as a [`JsonValue`]
/// (`Null` when none). Live only.
pub fn EventLoop(timeout_ms: impl ToF64) -> JsonValue {
    todo!()
}

/// Publish data on the bot's inter-thread channel. Live only.
pub fn SetChannelData(s: &str) {
    todo!()
}
/// Read data from the bot's inter-thread channel as a [`JsonValue`]. Live only.
pub fn GetChannelData() -> JsonValue {
    todo!()
}

/// A streaming socket / WebSocket connection (FMZ `Dial`). Live only — in a
/// backtest it yields an invalid, already-closed handle. Closed on drop.
pub struct Dial {
    fd: i64,
    valid: bool,
    closed: bool,
}

/// Open a connection with the host default timeout. `addr` e.g. "wss://...".
pub fn Dial(addr: &str) -> Dial {
    todo!()
}

impl Dial {
    /// Open a connection. `timeout` is in seconds (0 = host default).
    pub fn new(addr: &str, timeout: i64) -> Dial {
        todo!()
    }

    /// Open with a JSON options string (proxy, headers, ...).
    pub fn with_options(addr: &str, options: &str) -> Dial {
        todo!()
    }

    /// Whether the connection opened successfully.
    pub fn Valid(&self) -> bool {
        todo!()
    }
    /// Whether the connection has been closed (by us or the peer).
    pub fn IsClosed(&self) -> bool {
        todo!()
    }

    /// Read one message; `timeout` ms (0 = block / host default). "" if nothing
    /// arrived or the connection is closed.
    pub fn read(&mut self, timeout: i64) -> String {
        todo!()
    }

    /// Send `buf`; returns bytes written (0 == failed / now closed).
    pub fn write(&mut self, buf: &str, timeout: i64) -> i64 {
        todo!()
    }

    /// Run a SQL statement over a DB connection (host `TSocket_DBExec`): a query
    /// returns rows + column names, a write/DDL yields an empty [`DBResult`].
    pub fn exec(&mut self, sql: &str) -> DBResult {
        todo!()
    }

    /// Close the connection (idempotent; also runs on drop).
    pub fn close(&mut self) {
        todo!()
    }
}

impl Drop for Dial {
    fn drop(&mut self) {}
}

/// A custom chart for the strategy page. **Preferred** for charting: it supports
/// the full range of chart types (line, column, scatter, area, candlestick, ...)
/// via the Highcharts/Highstock config. Reach for `Chart` by default; only use
/// [`KLineChart`] when you specifically need a Pine-style candlestick/K-line chart.
pub struct Chart;

impl Chart {
    /// Create (or replace) the chart from a JSON config string.
    pub fn new(config_json: &str) -> Chart {
        todo!()
    }
    /// Replace the chart config.
    pub fn update(&self, config_json: &str) {
        todo!()
    }
    /// Append `data_json` (e.g. "[t, value]" or "[t,o,h,l,c]") to series
    /// `series_idx`. `replace_id` < 0 appends; >= 0 replaces that point.
    pub fn add(&self, series_idx: i64, data_json: &str, replace_id: i64) {
        todo!()
    }
    /// Clear the chart; `reverse` > 0 keeps the newest `reverse` points.
    pub fn reset(&self, reverse: i64) {
        todo!()
    }
}

/// Specialized for **K-line (candlestick) charts only** — for general charting
/// prefer [`Chart`], which covers every chart type. Use `KLineChart` only when you
/// specifically need a Pine-style candlestick chart.
///
/// A Pine-style candlestick chart (mirrors JS `KLineChart`). Unlike [`Chart`]
/// (generic add/reset/update), it is a stateful per-bar plotter: `begin(bar)`,
/// emit Pine primitives (plot/plotshape/.../signal), then `close()` to pack the
/// bar's plots+signals into a candle and push it. Optional named args are an
/// options-JSON string using the JS/Pine arg names, e.g.
/// `c.plot(ma, r#"{"color":"#ff0000","title":"MA"}"#)`.
pub struct KLineChart;

impl KLineChart {
    /// Create (or replace) the K-line chart from a JSON config (`__isCandle:true`
    /// is injected; `overlay:true` overlays plots on the candles by default).
    pub fn new(config_json: &str) -> KLineChart {
        todo!()
    }
    /// Start the current bar — subsequent Pine calls accumulate onto it.
    pub fn begin(&mut self, bar: &Record) {
        todo!()
    }
    /// Clear the chart; `remain` > 0 keeps the newest `remain` candles.
    pub fn reset(&mut self, remain: i64) {
        todo!()
    }
    /// Pack the current bar (OHLCV + plots/signals) into a candle and push it.
    pub fn close(&mut self) {
        todo!()
    }
    /// Plot a numeric series as a line/histogram/area. `opts`: title, color,
    /// linewidth, style, histbase, offset, join, display, overlay. Returns the
    /// plot index (for [`fill`](Self::fill)), or -1 when skipped.
    pub fn plot(&mut self, value: f64, opts: &str) -> i64 {
        todo!()
    }
    /// Horizontal line at `price`. `opts`: title, color, linestyle, linewidth,
    /// display, overlay. Returns the plot index.
    pub fn hline(&mut self, price: f64, opts: &str) -> i64 {
        todo!()
    }
    /// Plot a shape (marker) where `cond` is true. `opts`: style, location,
    /// title, color, text, textcolor, size, offset, overlay.
    pub fn plotshape(&mut self, cond: bool, opts: &str) {
        todo!()
    }
    /// Plot a single character where `cond` is true. `opts`: char (required),
    /// location, color, text, textcolor, size, offset, overlay.
    pub fn plotchar(&mut self, cond: bool, opts: &str) {
        todo!()
    }
    /// Plot an up/down arrow sized by `value`. `opts`: title, colorup, colordown,
    /// offset, minheight, maxheight, overlay.
    pub fn plotarrow(&mut self, value: f64, opts: &str) {
        todo!()
    }
    /// Plot an extra candle from explicit OHLC. `opts`: title, color, wickcolor,
    /// bordercolor, overlay.
    pub fn plotcandle(&mut self, open: f64, high: f64, low: f64, close: f64, opts: &str) {
        todo!()
    }
    /// Color the current price bar. `opts`: title, offset, show_last, display.
    pub fn barcolor(&mut self, color: &str, opts: &str) {
        todo!()
    }
    /// Fill the background of the current bar. `opts`: title, offset, show_last,
    /// display, overlay.
    pub fn bgcolor(&mut self, color: &str, opts: &str) {
        todo!()
    }
    /// Fill the area between two earlier plots (indices from plot/hline). `opts`:
    /// color, show_last.
    pub fn fill(&mut self, plot1: i64, plot2: i64, opts: &str) {
        todo!()
    }
    /// Emit a trade signal marker. `direction`: buy/long, sell/short,
    /// closebuy/closelong, closesell/closeshort. `id` defaults to `direction`.
    pub fn signal(&mut self, direction: &str, price: f64, qty: f64, id: &str) {
        todo!()
    }
}

/// A method token for [`Exchange::Go`]: carries the op name and result type. The
/// unit structs in [`mod@Go`] implement it — you never implement it yourself.
pub trait GoCall {
    /// The decoded result type [`TypedRoutine::wait`] returns.
    type Out;
}
/// Typed handle to an async call started by [`Exchange::Go`]; `wait` yields the
/// token's result type.
pub struct TypedRoutine<M: GoCall> {
    _m: std::marker::PhantomData<M>,
}
impl<M: GoCall> TypedRoutine<M> {
    /// Block up to `timeout_ms` for the result (0 = block until done, <0 = poll).
    /// Returns the method's typed result.
    pub fn wait(&self, timeout_ms: i64) -> Result<M::Out> {
        todo!()
    }
}

/// Method tokens for [`Exchange::Go`] — `Go::GetTicker`, `Go::CreateOrder`, … each
/// selects the async exchange method and its typed result.
#[allow(non_snake_case)]
pub mod Go {
    /// Token for async [`GetTicker`](super::Exchange::GetTicker).
    pub struct GetTicker;
    /// Token for async [`GetTickers`](super::Exchange::GetTickers).
    pub struct GetTickers;
    /// Token for async [`GetDepth`](super::Exchange::GetDepth).
    pub struct GetDepth;
    /// Token for async [`GetAccount`](super::Exchange::GetAccount).
    pub struct GetAccount;
    /// Token for async [`GetAssets`](super::Exchange::GetAssets).
    pub struct GetAssets;
    /// Token for async [`GetPositions`](super::Exchange::GetPositions).
    pub struct GetPositions;
    /// Token for async [`GetRecords`](super::Exchange::GetRecords).
    pub struct GetRecords;
    /// Token for async [`GetTrades`](super::Exchange::GetTrades).
    pub struct GetTrades;
    /// Token for async [`GetFundings`](super::Exchange::GetFundings).
    pub struct GetFundings;
    /// Token for async [`GetOrders`](super::Exchange::GetOrders).
    pub struct GetOrders;
    /// Token for async [`GetOrder`](super::Exchange::GetOrder).
    pub struct GetOrder;
    /// Token for async [`GetHistoryOrders`](super::Exchange::GetHistoryOrders).
    pub struct GetHistoryOrders;
    /// Token for async [`CreateOrder`](super::Exchange::CreateOrder).
    pub struct CreateOrder;
    /// Token for async [`CreateConditionOrder`](super::Exchange::CreateConditionOrder).
    pub struct CreateConditionOrder;
    /// Token for async [`CancelOrder`](super::Exchange::CancelOrder).
    pub struct CancelOrder;
    /// Token for async [`IO`](super::Exchange::IO).
    pub struct IO;
}
macro_rules! go_call {
    ($name:ident, $out:ty) => {
        impl GoCall for Go::$name {
            type Out = $out;
        }
    };
}
go_call!(GetTicker, Ticker);
go_call!(GetTickers, Vec<Ticker>);
go_call!(GetDepth, Depth);
go_call!(GetAccount, Account);
go_call!(GetAssets, Vec<Asset>);
go_call!(GetPositions, Vec<Position>);
go_call!(GetRecords, Vec<Record>);
go_call!(GetTrades, Vec<Trade>);
go_call!(GetFundings, Vec<Funding>);
go_call!(GetOrders, Vec<Order>);
go_call!(GetOrder, Order);
go_call!(GetHistoryOrders, Vec<Order>);
go_call!(CreateOrder, OrderId);
go_call!(CreateConditionOrder, OrderId);
go_call!(CancelOrder, bool);
go_call!(IO, String);

#[macro_export]
macro_rules! Log {
    ($($arg:expr),* $(,)?) => {
        $crate::log_args("Log", &[$($crate::ToArg::to_arg(&$arg)),*][..])
    };
}

#[macro_export]
macro_rules! LogStatus {
    ($($arg:expr),* $(,)?) => {
        $crate::log_args("LogStatus", &[$($crate::ToArg::to_arg(&$arg)),*][..])
    };
}

#[macro_export]
macro_rules! Panic {
    ($($arg:expr),* $(,)?) => {
        $crate::log_args("Panic", &[$($crate::ToArg::to_arg(&$arg)),*][..])
    };
}

#[macro_export]
macro_rules! _G {
    () => {
        $crate::GId()
    };
    ($k:expr, null $(,)?) => {
        $crate::GDel($k)
    };
    ($k:expr $(,)?) => {
        $crate::GGet($k)
    };
    ($k:expr, $v:expr $(,)?) => {
        $crate::GSet($k, $v)
    };
}

#[macro_export]
macro_rules! _C {
    ($call:expr) => {{
        loop {
            match $call {
                ::core::result::Result::Ok(v) => break v,
                ::core::result::Result::Err(_) => $crate::Sleep($crate::retry_delay_ms()),
            }
        }
    }};
}

/// Source series for a [`TA`] call: a K-line (uses `Close`) or a bare `f64`
/// series, so `TA.EMA(&records, ..)` and `TA.EMA(&closes, ..)` both work.
pub trait Ticks { fn ticks(&self) -> Vec<f64>; }
impl Ticks for Vec<Record> { fn ticks(&self) -> Vec<f64> { todo!() } }
impl Ticks for [Record] { fn ticks(&self) -> Vec<f64> { todo!() } }
impl<const M: usize> Ticks for [Record; M] { fn ticks(&self) -> Vec<f64> { todo!() } }
impl Ticks for Vec<f64> { fn ticks(&self) -> Vec<f64> { todo!() } }
impl Ticks for [f64] { fn ticks(&self) -> Vec<f64> { todo!() } }
impl<const M: usize> Ticks for [f64; M] { fn ticks(&self) -> Vec<f64> { todo!() } }

/// Technical-analysis helpers. Use the global [`TA`].
pub struct TAHelper;
impl TAHelper {
    /// Simple moving average of the close (alias of [`SMA`](Self::SMA); default period 9).
    pub fn MA<T: Ticks + ?Sized>(&self, src: &T, period: impl Into<Option<usize>>) -> Vec<f64> { todo!() }
    /// Simple moving average of the close (default period 9).
    pub fn SMA<T: Ticks + ?Sized>(&self, src: &T, period: impl Into<Option<usize>>) -> Vec<f64> { todo!() }
    /// Exponential moving average of the close (default period 9).
    pub fn EMA<T: Ticks + ?Sized>(&self, src: &T, period: impl Into<Option<usize>>) -> Vec<f64> { todo!() }
    /// MACD → `[DIF, DEA, histogram]` (default 12/26/9); histogram is `DIF - DEA`.
    pub fn MACD<T: Ticks + ?Sized>(&self, src: &T, fast: impl Into<Option<usize>>, slow: impl Into<Option<usize>>, signal: impl Into<Option<usize>>) -> [Vec<f64>; 3] { todo!() }
    /// Bollinger Bands → `[upper, middle, lower]` (default period 20, multiplier 2).
    pub fn BOLL<T: Ticks + ?Sized>(&self, src: &T, period: impl Into<Option<usize>>, multiplier: impl Into<Option<f64>>) -> [Vec<f64>; 3] { todo!() }
    /// KDJ stochastic → `[K, D, J]` (default 9/3/3). Needs a K-line (High/Low/Close).
    pub fn KDJ(&self, records: &[Record], n: impl Into<Option<usize>>, k: impl Into<Option<usize>>, d: impl Into<Option<usize>>) -> [Vec<f64>; 3] { todo!() }
    /// Relative Strength Index of the close (default period 14).
    pub fn RSI<T: Ticks + ?Sized>(&self, src: &T, period: impl Into<Option<usize>>) -> Vec<f64> { todo!() }
    /// On-Balance Volume. Needs a K-line (uses Close/Volume).
    pub fn OBV(&self, records: &[Record]) -> Vec<f64> { todo!() }
    /// Average True Range (default period 14). Needs a K-line (uses High/Low/Close).
    pub fn ATR(&self, records: &[Record], period: impl Into<Option<usize>>) -> Vec<f64> { todo!() }
    /// Bill Williams Alligator → `[jaw, teeth, lips]` (default periods 13/8/5).
    pub fn Alligator(&self, records: &[Record], jaw: impl Into<Option<usize>>, teeth: impl Into<Option<usize>>, lips: impl Into<Option<usize>>) -> [Vec<f64>; 3] { todo!() }
    /// Chaikin Money Flow (default period 20). Needs a K-line (High/Low/Close/Volume).
    pub fn CMF(&self, records: &[Record], periods: impl Into<Option<usize>>) -> Vec<f64> { todo!() }
    /// Highest value over the `n` bars before the current (last) one.
    pub fn Highest<T: Ticks + ?Sized>(&self, src: &T, n: usize) -> f64 { todo!() }
    /// Lowest value over the `n` bars before the current (last) one.
    pub fn Lowest<T: Ticks + ?Sized>(&self, src: &T, n: usize) -> f64 { todo!() }
}
pub static TA: TAHelper = TAHelper;

pub mod prelude {
    pub use crate::{
        exchange, exchanges, params, Arg, Chart, KLineChart, DBExec, Decrypted, Dial, EnableLog, Encode, Error,
        __decrypt, EventLoop, GetChannelData, GetCommand, GetLastError, GetMeta, GetOS,
        Go, GoCall, TypedRoutine,
        GetPid, HttpQuery, HttpResp, IsVirtual, LogProfit, LogProfitReset, LogReset, LogVacuum, Mail, OnExit,
        Result, SetChannelData, SetErrorFilter, Sleep, StrDecode, ToArg, Unix, UnixNano,
        Version, _D, JSONParse, MD5, UUID, _CDelay, _Cross, _N,
    };
    pub use crate::{
        Account, Asset, DBResult, Data, Depth, Exchange, Funding, HttpRet, JsonValue, Market, MarketOrder, Order,
        OrderCondition, OrderId, Position, Record, Ticker, Trade,
    };
    pub use crate::{
        ORDER_CONDITION_TYPE_GENERIC, ORDER_CONDITION_TYPE_OCO, ORDER_CONDITION_TYPE_SL,
        ORDER_CONDITION_TYPE_TP, ORDER_OFFSET_CLOSE, ORDER_OFFSET_OPEN, ORDER_STATE_CANCELED,
        ORDER_STATE_CLOSED, ORDER_STATE_PENDING, ORDER_STATE_UNKNOWN, ORDER_TYPE_BUY,
        ORDER_TYPE_SELL, LOG_TYPE_BUY, LOG_TYPE_SELL, LOG_TYPE_CANCEL, LOG_TYPE_ERROR,
        LOG_TYPE_PROFIT, LOG_TYPE_LOG, LOG_TYPE_RESTART, PD_LONG, PD_LONG_YD, PD_SHORT, PD_SHORT_YD, PERIOD_D1, PERIOD_D3,
        PERIOD_H1, PERIOD_H12, PERIOD_H2, PERIOD_H4, PERIOD_H6, PERIOD_M1, PERIOD_M15, PERIOD_M3,
        PERIOD_M30, PERIOD_M5, PERIOD_W1,
    };
    pub use crate::{Log, LogStatus, Panic, _C, _G};
    pub use crate::{TA, TAHelper, Ticks};
}
