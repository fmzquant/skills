//! Rust strategy SDK — API stub (rust-analyzer + AI context).
//! The SDK API below is auto-injected via the prelude: call it directly
//! (exchange, exchanges, TA, Log!/LogStatus!/LogProfit, _G!/_C!, types, params,
//! ...) — no `use`/`mod`/`extern crate` is needed for it.
//!
//! Lifecycle: the strategy entry is `fn main()`. A strategy may also optionally
//! define `fn init()` and/or `fn onexit()` (both no-arg) — the bootstrap wires
//! them automatically: `init()` runs before `main()`, `onexit()` runs on exit
//! (normal return or robot stop; same as the JS entry functions). There is no
//! `OnExit(...)` registration call — define `fn onexit()` instead.
//!
//! Threads: use `std::thread` / `std::sync::mpsc` directly; `exchange`, `Log!` and
//! every other SDK call are thread-safe (there is no `__Thread`/threadId model).
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
//!     encrypted string   -> Decrypted           // derefs to &str: `&*SECRET` / `SECRET.to_string()`
//!     dropdown, single   -> f64 | bool | &str   // by the selected option's value type
//!     dropdown, multiple -> &[i64] (all ints) | &[f64] (any decimal) | &[&str]
//!     anything else      -> &str                // the value's raw JSON text — parse it
//! So e.g. `exchange.GetTicker(SYMBOL)` works because SYMBOL is `&str` (passing a
//! `String` would fail `impl Into<Option<&str>>`); a numeric param is `f64`, so
//! cast for integer uses: `let n = Period as usize;`. The full parameter set is
//! also available as JSON text via `params()` ("" when the runtime has no
//! parameter channel — the baked constants are the primary interface).
//!
//! The new-model primitives (`ctx::subscribe`/`ctx::poll`/...) are also in scope
//! (`ctx` module, raw event vocabulary `Event`/`EV_*` from `abi`) and can be mixed
//! with this legacy API; read events with `use sdk::ctx::EventExt;` (no `unsafe`).

#![allow(non_snake_case, non_upper_case_globals, dead_code, unused_variables)]

use std::collections::BTreeMap;

/// A parsed JSON value (the Rust equivalent of the other runtimes' `any`).
/// Read scalars with `as_f64`/`as_i64`/`as_bool`/`as_str`; navigate objects/arrays
/// with `get(key)`/`get(i)` or indexing (`v["a"][0]`). `Display` (`to_string()`,
/// `format!("{}", v)`) prints compact JSON.
#[derive(Clone, Debug, Default, PartialEq)]
pub enum JsonValue {
    #[default]
    Null,
    Bool(bool),
    Number(f64),
    String(String),
    Array(Vec<JsonValue>),
    Object(BTreeMap<String, JsonValue>),
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
/// Compact JSON serialization (no whitespace).
impl std::fmt::Display for JsonValue {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        todo!()
    }
}
/// Parse a JSON string into a [`JsonValue`] tree (the canonical `JSONParse`);
/// `None` on malformed input.
pub fn JSONParse(s: &str) -> Option<JsonValue> {
    todo!()
}

/// Error returned by fallible API calls (`Result<T>`).
#[derive(Debug, Clone)]
pub enum Error {
    /// Host signalled stop (robot stop / timeout).
    Stopped,
    /// A connector / network / exchange error, carrying the message (HTTP code,
    /// exchange code and a snippet of the response body included).
    Api(String),
}

impl std::fmt::Display for Error {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Error::Stopped => write!(f, "strategy stopped by host"),
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

/// Converts a value into an [`Arg`] for the variadic `Log!`/`LogStatus!`/`Panic!`
/// macros and [`IO`](Exchange::IO)-style args.
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
/// Objects/arrays log as compact JSON, scalars as their value.
impl ToArg for JsonValue {
    fn to_arg(&self) -> Arg {
        todo!()
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
/// `Log!(opt)` — `Some` logs the value, `None` logs `null`.
impl<T: ToArg> ToArg for Option<T> {
    fn to_arg(&self) -> Arg {
        match self {
            Some(v) => v.to_arg(),
            None => Arg::Null,
        }
    }
}
/// `Log!(exchange.GetTicker(""))` — `Ok` logs the value, `Err` the error text.
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
// Data structures log as `{Field: value, ...}` (Debug without the type name).
macro_rules! to_arg_debug {
    ($($t:ty),* $(,)?) => {$(impl ToArg for $t {
        fn to_arg(&self) -> Arg { Arg::Str(format!("{:?}", self)) }
    })*};
}
to_arg_debug!(
    Data, DBResult, HttpRet, Ticker, Record, MarketOrder, Depth, Account, Asset, OrderCondition,
    Order, Position, Trade, Funding, Market,
);

/// Argument forms for [`IO`](Exchange::IO)/[`Go`](Exchange::Go): a tuple of mixed
/// [`ToArg`] values, a single value, a `Vec<Arg>`, or `()`.
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

/// Backend of the variadic log macros; `kind` = "Log"/"LogStatus"/"Panic".
#[doc(hidden)]
pub fn log_args(kind: &str, args: &[Arg]) {
    let _ = (kind, args);
}

/// The [`_C!`] retry delay in milliseconds (set by [`_CDelay`], default 3000).
#[doc(hidden)]
pub fn c_retry_delay_ms() -> u64 {
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
/// No direction: `Trade.Type` of a trade whose side the exchange did not report and that cannot be inferred.
pub const ORDER_TYPE_NONE: i32 = 2;

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

// Futures_OP / Exchange_OP operation codes (legacy op numbering).
pub const FUTURES_OP_SET_MARGIN: i64 = 0;
pub const FUTURES_OP_SET_DIRECTION: i64 = 1;
pub const FUTURES_OP_SET_CONTRACT_TYPE: i64 = 2;
pub const FUTURES_OP_GET_POSITION: i64 = 3;
pub const EXCHANGE_OP_IO_CONTROL: i64 = 4;

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
/// -1 = not set, else an `ORDER_CONDITION_TYPE_*` value). `Default` has
/// `ConditionType: -1` (0 is a valid OCO), so build one with
/// `OrderCondition { ConditionType: ORDER_CONDITION_TYPE_TP, TpTriggerPrice: .., ..Default::default() }`.
#[derive(Clone, Debug)]
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
impl Default for OrderCondition {
    fn default() -> Self {
        OrderCondition {
            ConditionType: -1,
            TpTriggerPrice: 0.0,
            TpOrderPrice: 0.0,
            SlTriggerPrice: 0.0,
            SlOrderPrice: 0.0,
        }
    }
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
    /// Taker side `ORDER_TYPE_*`: 0 = buy, 1 = sell, 2 = unknown (`ORDER_TYPE_NONE`).
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

/// A row from the exchange data store / feed (`exchange.GetData`).
#[derive(Clone, Debug, Default)]
pub struct Data {
    /// Unix timestamp in milliseconds.
    pub Time: i64,
    /// The row's value as JSON text (parse it yourself); "null" when no row
    /// at or before the requested offset exists.
    pub Data: String,
}

/// Trading-pair metadata — one entry of the [`GetMarkets`](Exchange::GetMarkets)
/// map. Absent optional fields default to 0 / "".
#[derive(Clone, Debug, Default)]
pub struct Market {
    /// The exchange's NATIVE instrument name, e.g. "BTCUSDT" (Binance spot) or
    /// "BTC-USDT-SWAP" (OKX perpetual). The platform unified symbol ("BTC_USDT",
    /// "BTC_USDT.swap") is the map KEY. Falls back to the unified symbol when the
    /// exchange provides no native name.
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
/// (`let r: HttpRet = HttpQuery(...)`); for just the body, take a `String`.
#[derive(Clone, Debug, Default)]
pub struct HttpRet {
    /// HTTP status code; 0 when no response was received (see `Error`).
    pub StatusCode: i64,
    /// Response headers — a `{ name: [values...] }` object (a header may repeat).
    pub Header: JsonValue,
    /// Response cookies.
    pub Cookies: JsonValue,
    /// Response body.
    pub Body: String,
    /// Failure reason (method + URL + underlying error); "" on success. On failure
    /// `StatusCode` is 0, so one `StatusCode != 200` check catches both "no
    /// connection" and HTTP errors.
    pub Error: String,
}

/// Possible return types of [`HttpQuery`] — `String` (body) or [`HttpRet`]
/// (status + headers + body). The call site's return type selects which. On
/// failure the body is "" / `HttpRet` has `StatusCode` 0 and `Error` set.
pub trait HttpResp {
    #[doc(hidden)]
    fn from_parts(status: u16, headers: &[(String, String)], body: String) -> Self;
    #[doc(hidden)]
    fn failed(err: &str) -> Self;
}
impl HttpResp for String {
    fn from_parts(status: u16, headers: &[(String, String)], body: String) -> Self {
        todo!()
    }
    fn failed(err: &str) -> Self {
        todo!()
    }
}
impl HttpResp for HttpRet {
    fn from_parts(status: u16, headers: &[(String, String)], body: String) -> Self {
        todo!()
    }
    fn failed(err: &str) -> Self {
        todo!()
    }
}

/// Forms the second argument of [`HttpQuery`] accepts (legacy `postData|options`):
/// - `None` / `""` → GET;
/// - a string (`&str`/`String`/`&String`) → a POST with that string as the body;
/// - a [`JsonValue`] object (by value or `&`) → **options**: `method`, `body`/`data`,
///   `headers` (string or array values), `cookie`, `timeout` (ms, default 300000),
///   `proxy` (this request's proxy: `http(s)://`/`socks5(h)://`/`ssocks5://`),
///   `charset` (decode the response from that charset to UTF-8), `format`
///   (`"base64"`/`"hex"` encodes the body) — same names and meaning as JS.
pub trait HttpOption {
    #[doc(hidden)]
    fn into_http_option(self) -> HttpOpt;
}
#[doc(hidden)]
pub enum HttpOpt {
    Body(String),
    Options(JsonValue),
}
impl HttpOption for Option<&str> {
    fn into_http_option(self) -> HttpOpt {
        todo!()
    }
}
impl HttpOption for &str {
    fn into_http_option(self) -> HttpOpt {
        todo!()
    }
}
impl HttpOption for String {
    fn into_http_option(self) -> HttpOpt {
        todo!()
    }
}
impl HttpOption for &String {
    fn into_http_option(self) -> HttpOpt {
        todo!()
    }
}
impl HttpOption for &JsonValue {
    fn into_http_option(self) -> HttpOpt {
        todo!()
    }
}
impl HttpOption for JsonValue {
    fn into_http_option(self) -> HttpOpt {
        todo!()
    }
}

/// A configured exchange — use the global `exchange` (or `exchanges[i]`) to call
/// market-data and trading methods. A zero-cost `Copy` handle
/// (`let ex = exchanges[1];`).
#[derive(Clone, Copy)]
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
    /// Index of this exchange object in `exchanges` (`exchange` is 0): the account
    /// index the `ctx::*` functions take (`ExIndex`), `Sub::ex()`, and `ex` of the
    /// `ctx::connectors()` rows.
    pub fn GetIndex(&self) -> u16 {
        todo!()
    }
    /// Current trading-pair string, e.g. "BTC_USDT".
    pub fn GetCurrency(&self) -> String {
        todo!()
    }
    /// Switch the current trading pair, e.g. "ETH_USDT" (upper-cased; a
    /// "ETH_USDT.swap" form also sets the contract). `Err` on an invalid symbol.
    pub fn SetCurrency(&self, symbol: &str) -> Result<bool> {
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
    /// Currently set contract type (futures), e.g. "swap".
    pub fn GetContractType(&self) -> String {
        todo!()
    }
    /// Set the contract type (futures), e.g. "swap"/"quarter" (or "BTC_USDT.swap" to
    /// set pair + contract); call before trading. Returns
    /// `{"instrument": <native contract>, "InstrumentID": <native contract>}`; `Err` on
    /// spot or an unknown contract (the contract stays unchanged).
    pub fn SetContractType(&self, contract_type: &str) -> Result<JsonValue> {
        todo!()
    }
    /// IB overload of [`SetContractType`](Self::SetContractType): `calendar`
    /// ""/"trading"/"liquid" picks the TWS calendar, any other string is parsed as a
    /// trading-session expression. Non-IB connectors ignore `calendar`.
    pub fn SetContractTypeWithCalendar(&self, contract_type: &str, calendar: &str) -> Result<JsonValue> {
        todo!()
    }
    /// Configured K-line period in **seconds**.
    pub fn GetPeriod(&self) -> i64 {
        todo!()
    }
    /// **不推荐**：优先用 `CreateOrder`(可直接指定 side: "buy"/"sell"/...),无需先 `SetDirection`。
    /// Sets the direction ("buy"/"sell"/"closebuy"/"closesell") that `Buy`/`Sell`
    /// use for futures orders; returns it.
    pub fn SetDirection(&self, direction: &str) -> Result<String> {
        todo!()
    }
    /// Set the max number of K-line bars cached / requested (default 200).
    pub fn SetMaxBarLen(&self, n: i64) {
        todo!()
    }
    /// Set order price/amount decimal precision (values truncated when ordering;
    /// negative values round off integer digits).
    pub fn SetPrecision(&self, price: i64, amount: i64) {
        todo!()
    }
    /// Per-request timeout in milliseconds. Live only.
    pub fn SetTimeout(&self, ms: impl ToF64) {
        todo!()
    }
    /// Set a fiat conversion rate (prices are multiplied by it; non-positive = 1);
    /// returns the PREVIOUS rate.
    pub fn SetRate(&self, rate: impl ToF64) -> f64 {
        todo!()
    }
    /// Effective fiat conversion rate (the value `SetRate` established, else 1).
    pub fn GetRate(&self) -> f64 {
        todo!()
    }
    /// Raw reply text of this exchange object's most recent REST call (including
    /// `IO("api")`) — parse it with `JSONParse`. It is the exchange's original
    /// response when the connector carries one, else the connector's reply; the
    /// error text after a failed `IO("api")`; "" before any call.
    pub fn GetRawJSON(&self) -> String {
        todo!()
    }
    /// Current exchange API base address.
    pub fn GetBase(&self) -> String {
        todo!()
    }
    /// Set the exchange API base URL (e.g. switch to a testnet); returns the
    /// previous base ("" if the connector rejected it). Live only.
    pub fn SetBase(&self, base: &str) -> String {
        todo!()
    }
    /// Route this exchange's HTTP/WS through a proxy ("" = direct). Live only.
    pub fn SetProxy(&self, proxy: &str) -> Result<()> {
        todo!()
    }
    /// Replace the extra request headers sent to this exchange (empty slice clears).
    pub fn SetHeaders(&self, headers: &[(&str, &str)]) -> Result<()> {
        todo!()
    }
    /// Set the leverage multiplier (futures), e.g. 10 for 10x. `Err` on spot
    /// (no leverage) or when the exchange rejects it.
    pub fn SetMarginLevel(&self, level: impl ToF64) -> Result<()> {
        todo!()
    }

    /// Ticker; `symbol` "" or `None` means the configured trading pair, e.g.
    /// `exchange.GetTicker("ETH_USDT")`.
    pub fn GetTicker<'a>(&self, symbol: impl Into<Option<&'a str>>) -> Result<Ticker> {
        todo!()
    }
    /// Every market's latest ticker.
    pub fn GetTickers(&self) -> Result<Vec<Ticker>> {
        todo!()
    }
    /// Order book; `symbol` "" or `None` means the configured trading pair.
    pub fn GetDepth<'a>(&self, symbol: impl Into<Option<&'a str>>) -> Result<Depth> {
        todo!()
    }
    /// Recent public trades; `symbol` "" or `None` = the configured pair.
    pub fn GetTrades<'a>(&self, symbol: impl Into<Option<&'a str>>) -> Result<Vec<Trade>> {
        todo!()
    }
    /// Fetch K-line records (`GetRecords(symbol?, period?, limit?)`). All three
    /// args are optional — pass `None` (or the bare value) for any; `symbol` ""/`None`
    /// = the configured pair; `period` is in seconds (the `PERIOD_*` constants;
    /// <= 0 / `None` = the robot's default period); `limit` = bars per call.
    pub fn GetRecords<'a>(
        &self,
        symbol: impl Into<Option<&'a str>>,
        period: impl Into<Option<i64>>,
        limit: impl Into<Option<i64>>,
    ) -> Result<Vec<Record>> {
        todo!()
    }
    /// All trading-pair metadata as a `unified symbol -> Market` map. Not a
    /// `Result`: on failure / no support it logs an error and returns an empty map.
    pub fn GetMarkets(&self) -> BTreeMap<String, Market> {
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
    /// Open orders. `symbol` "" or `None`: futures → the current quote currency +
    /// contract family (e.g. "USDT.swap"); spot → all markets. A full symbol
    /// ("BTC_USDT") or a range ("USDT.swap") narrows it.
    pub fn GetOrders<'a>(&self, symbol: impl Into<Option<&'a str>>) -> Result<Vec<Order>> {
        todo!()
    }
    /// One order by id.
    pub fn GetOrder(&self, id: &OrderId) -> Result<Order> {
        todo!()
    }
    /// Finished orders; `symbol` "" = the configured pair. `since`/`limit` page the history.
    pub fn GetHistoryOrders<'a>(&self, symbol: impl Into<Option<&'a str>>, since: impl Into<Option<i64>>, limit: impl Into<Option<i64>>) -> Result<Vec<Order>> {
        todo!()
    }
    /// Positions. `symbol` "" or `None`: futures → the current quote currency +
    /// contract family (e.g. "USDT.swap"); spot → all. A full symbol or a range
    /// narrows it.
    pub fn GetPositions<'a>(&self, symbol: impl Into<Option<&'a str>>) -> Result<Vec<Position>> {
        todo!()
    }
    /// Positions of ONE symbol: `symbol` "" or `None` = the configured pair (unlike
    /// [`GetPositions`](Self::GetPositions), which defaults to the whole range).
    pub fn GetPosition<'a>(&self, symbol: impl Into<Option<&'a str>>) -> Result<Vec<Position>> {
        todo!()
    }
    /// Funding rates (perpetuals). `symbol` "" or `None` defaults to a range like
    /// [`GetPositions`](Self::GetPositions); a full symbol narrows it.
    pub fn GetFundings<'a>(&self, symbol: impl Into<Option<&'a str>>) -> Result<Vec<Funding>> {
        todo!()
    }

    /// Buy order on the configured pair (spot buy / futures per `SetDirection`);
    /// `price` -1 for a market order. Prefer [`CreateOrder`](Self::CreateOrder).
    pub fn Buy(&self, price: impl ToF64, amount: impl ToF64) -> Result<OrderId> {
        todo!()
    }
    /// Sell order on the configured pair (spot sell / futures per `SetDirection`);
    /// `price` -1 for a market order. Prefer [`CreateOrder`](Self::CreateOrder).
    pub fn Sell(&self, price: impl ToF64, amount: impl ToF64) -> Result<OrderId> {
        todo!()
    }
    /// Place an order; `symbol` "" or `None` = the configured pair. `side` is
    /// "buy"/"sell"/"closebuy"/"closesell"; market order with `price` -1. `side`
    /// may carry exchange-specific params after a `;`:
    /// `"buy;{\"posSide\":\"long\"}"` or `"buy;k=v&k2=v2"`.
    pub fn CreateOrder<'a>(&self, symbol: impl Into<Option<&'a str>>, side: &str, price: impl ToF64, amount: impl ToF64) -> Result<OrderId> {
        todo!()
    }
    /// [`CreateOrder`](Self::CreateOrder) with exchange-specific options as a JSON
    /// object (values keep their JSON types).
    pub fn CreateOrderWithOptions<'a>(&self, symbol: impl Into<Option<&'a str>>, side: &str, price: impl ToF64, amount: impl ToF64, options: &JsonValue) -> Result<OrderId> {
        todo!()
    }
    /// Amend an open order; returns the (possibly new) order id. `side`
    /// ("buy"/"sell") is required by the engine.
    pub fn ModifyOrder(&self, id: &OrderId, side: &str, price: impl ToF64, amount: impl ToF64) -> Result<OrderId> {
        todo!()
    }
    /// [`ModifyOrder`](Self::ModifyOrder) with exchange-specific options.
    pub fn ModifyOrderWithOptions(&self, id: &OrderId, side: &str, price: impl ToF64, amount: impl ToF64, options: &JsonValue) -> Result<OrderId> {
        todo!()
    }
    /// Cancel an order by id.
    pub fn CancelOrder(&self, id: &OrderId) -> Result<()> {
        todo!()
    }
    /// Write a trade-type log entry (`order_type` 0 = buy, 1 = sell, 2 = cancel);
    /// no real order. Buy/sell return a virtual order id ("V00001"...), cancel
    /// (pass the order id in `price`) returns "". Muted by `EnableLog(false)`.
    /// Distinct from the `Log!` logging macro.
    pub fn Log(&self, order_type: i32, price: impl ToF64, amount: impl ToF64) -> String {
        todo!()
    }

    /// Raw exchange IO passthrough (native API calls, mode switching, ...) —
    /// `exchange.IO(("api", "GET", "/api/v3/time", "symbol=BTC"))`; returns the
    /// connector's JSON result. See [`IoArgs`].
    pub fn IO(&self, args: impl IoArgs) -> Result<JsonValue> {
        todo!()
    }
    /// Same as the global [`Encode`], plus `{{field}}` templates: `{{accesskey}}`,
    /// `{{secretkey}}` (any config field name) are replaced by this exchange's
    /// configured values inside digest/sign algorithms. "" on failure.
    pub fn Encode(&self, algo: &str, in_fmt: &str, out_fmt: &str, data: &str, key_fmt: &str, key: &str) -> String {
        todo!()
    }
    /// `exchange.HMAC(algo, out_fmt, data, key)` = `Encode(algo, "raw", out_fmt,
    /// data, "raw", key)`, with the same `{{secretkey}}` templates. "" on failure.
    pub fn HMAC(&self, algo: &str, out_fmt: &str, data: &str, key: &str) -> String {
        todo!()
    }
    /// A non-sensitive field of this exchange's configuration, e.g.
    /// `GetMeta("AccessKey")` (key matched case/`_`/`-`-insensitively). Secret
    /// fields (SecretKey/Password/Passphrase/encrypted) always return "".
    pub fn GetMeta(&self, key: &str) -> String {
        todo!()
    }

    /// Place a conditional (stop-loss / take-profit) order; "" symbol = the
    /// configured pair. `side` is "buy"/"sell"/"closebuy"/"closesell".
    pub fn CreateConditionOrder<'a>(&self, symbol: impl Into<Option<&'a str>>, side: &str, amount: impl ToF64, condition: &OrderCondition) -> Result<OrderId> {
        todo!()
    }
    /// [`CreateConditionOrder`](Self::CreateConditionOrder) with exchange-specific options.
    pub fn CreateConditionOrderWithOptions<'a>(&self, symbol: impl Into<Option<&'a str>>, side: &str, amount: impl ToF64, condition: &OrderCondition, options: &JsonValue) -> Result<OrderId> {
        todo!()
    }
    /// Amend a conditional order (on the configured pair).
    pub fn ModifyConditionOrder(&self, id: &OrderId, side: &str, amount: impl ToF64, condition: &OrderCondition) -> Result<OrderId> {
        todo!()
    }
    /// [`ModifyConditionOrder`](Self::ModifyConditionOrder) with exchange-specific options.
    pub fn ModifyConditionOrderWithOptions(&self, id: &OrderId, side: &str, amount: impl ToF64, condition: &OrderCondition, options: &JsonValue) -> Result<OrderId> {
        todo!()
    }
    /// Open conditional orders; `symbol` "" or `None` defaults like
    /// [`GetOrders`](Self::GetOrders).
    pub fn GetConditionOrders<'a>(&self, symbol: impl Into<Option<&'a str>>) -> Result<Vec<Order>> {
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
    /// Finished conditional orders; `symbol` "" = the configured pair. `since`/`limit` page it.
    pub fn GetHistoryConditionOrders<'a>(&self, symbol: impl Into<Option<&'a str>>, since: impl Into<Option<i64>>, limit: impl Into<Option<i64>>) -> Result<Vec<Order>> {
        todo!()
    }

    /// Store a data set under `pair` for [`GetData`](Self::GetData): `json_value` is
    /// JSON text (`[[time, value], ...]` or an object with schema + data). Returns
    /// the JSON text length; 0 (and `GetLastError`) on a bad format. Never expires.
    pub fn SetData(&self, pair: &str, json_value: &str) -> i64 {
        todo!()
    }
    /// `GetData(key)` with the default cache timeout (60 s) and offset (now) — see
    /// [`GetDataWithOptions`](Self::GetDataWithOptions).
    pub fn GetData(&self, pair: &str) -> Result<Data> {
        todo!()
    }
    /// `GetData(key, timeout?, offset?)`. `key` is a [`SetData`](Self::SetData) name
    /// (never expires) or an `http(s)://` URL (cached `timeout` ms, default 60000,
    /// minimum 5000, refetched when expired); `ext.` server feeds are unavailable
    /// on this runtime (`Err`). Returns the last row with `time <= offset`
    /// (default now); with no such row, `Data { Time: <next row's time>, Data: "null" }`.
    /// A failed fetch / missing source is `Err` (and `GetLastError`).
    pub fn GetDataWithOptions(&self, pair: &str, timeout: impl Into<Option<i64>>, offset: impl Into<Option<i64>>) -> Result<Data> {
        todo!()
    }

    /// Legacy fiat reference rate USD→CNY. This node has no FX source: returns 0
    /// and logs a warning — fetch a rate with `HttpQuery` instead.
    pub fn GetUSDCNY(&self) -> f64 {
        todo!()
    }
    /// Legacy fiat reference rate EUR→CNY. Returns 0 like [`GetUSDCNY`](Self::GetUSDCNY).
    pub fn GetEURCNY(&self) -> f64 {
        todo!()
    }

    /// Start an exchange method asynchronously, typed by a [`mod@Go`] token:
    /// `exchange.Go(Go::GetRecords, ("BTC_USDT", PERIOD_H1))`. Its REST request goes
    /// to a worker thread right away; `.wait(timeout)` yields the token's result type
    /// (see [`TypedRoutine::wait`]). `args` are the method's positional args in
    /// [`IO`](Self::IO)'s shapes; for `Go::GetRecords` a numeric first arg means the
    /// legacy `(period, limit)` form. The pair/contract/precision/rate state at
    /// submit time is snapshotted. On completion [`EventLoop`] receives
    /// `Event: "Exchange_<Method>"`, `Index` = ticket. At most 2000 unwaited tickets.
    pub fn Go<M: GoCall>(&self, method: M, args: impl IoArgs) -> TypedRoutine<M> {
        todo!()
    }
}

/// All configured exchanges in load order (`exchanges[0]`, `exchanges.len()`).
pub static exchanges: std::sync::LazyLock<Vec<Exchange>> = std::sync::LazyLock::new(Vec::new);

/// The first configured exchange (`exchange.GetTicker("")`).
pub static exchange: Exchange = Exchange;

/// The strategy's parameter set as JSON text ("" when the runtime has no
/// parameter channel — the baked parameter constants are the primary interface).
pub fn params() -> &'static str {
    todo!()
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

/// Sleep for `ms` **milliseconds** (fractions honoured: `Sleep(0.5)`).
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

/// The host (node) version string — same value as JS/Python `Version()`; "" (and
/// an error log) if the host cannot tell.
pub fn Version() -> String {
    todo!()
}

/// "<os>/<arch>" of the runtime, e.g. "linux/amd64".
pub fn GetOS() -> String {
    todo!()
}

/// Runtime environment info (os, arch, pid, ...) as a [`JsonValue`].
pub fn SysInfo() -> JsonValue {
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

/// [`LogProfit`] with a note: `LogProfitText(12.5, "after rebalance")` (the
/// legacy `LogProfit(profit, ...)` extra args).
pub fn LogProfitText(profit: impl ToF64, text: &str) {
    todo!()
}

/// Poll the interactive command queue. `timeout_ms`: `< 0` (e.g. `-1`) does not
/// block — returns `None` at once when there is no command (use this in a main
/// loop); `0` blocks until a command arrives or the robot stops; `> 0` waits at
/// most that many ms. `None` = no command.
pub fn GetCommand(timeout_ms: impl ToF64) -> Option<String> {
    todo!()
}

/// Push a command into this robot's own interactive command queue.
pub fn SendCommand(cmd: &str) {
    todo!()
}

/// Format a Unix **millisecond** timestamp as "YYYY-MM-DD HH:MM:SS" (UTC).
/// `None` = current time; otherwise pass a ms value such as a K-line `Time`
/// (`_D(None)`, `_D(record.Time)`). Not seconds — for a `Unix()` value use
/// `_D(Unix() * 1000)`.
pub fn _D(ts_ms: impl Into<Option<i64>>) -> String {
    todo!()
}

/// Multi-language text marker (legacy `_T`): `_T("中文", Some("English"))` —
/// the web page shows the part matching the viewer's language.
pub fn _T(a: &str, b: Option<&str>) -> String {
    todo!()
}

/// Round `num` to `precision` decimals (`None` = 4), truncating toward zero (
/// `_N`): `_N(-2.7, 0)` == -2, not -3.
pub fn _N(num: impl ToF64, precision: impl Into<Option<i32>>) -> f64 {
    todo!()
}

/// Trend of two equal-length series at their tail (`_Cross`): bars `a` has
/// stayed above (`>0`) or below (`<0`) `b`, i.e. how many bars since they crossed.
pub fn _Cross(a: &[f64], b: &[f64]) -> i64 {
    todo!()
}

/// Set the [`_C!`] retry delay in milliseconds (`_CDelay`; default 3000).
pub fn _CDelay(ms: impl ToF64) {
    todo!()
}

/// `_G!(k, v)` — write a key (the value's text/JSON is stored).
#[doc(hidden)]
pub fn GSet(k: &str, v: impl ToArg) {
    let _ = (k, v);
}
/// `_G!(k)` — read a key ("" when absent).
#[doc(hidden)]
pub fn GGet(k: &str) -> String {
    todo!()
}
/// `_G!(k, null)` — delete a key.
#[doc(hidden)]
pub fn GDel(k: &str) {
    todo!()
}
/// Robot / live id — the `_G!()` (no-arg) form; 0 in backtest.
#[doc(hidden)]
pub fn GId() -> i64 {
    todo!()
}

/// `EnableLog(false)` stops recording TRADE logs only (`Buy`/`Sell`/`CreateOrder`/
/// `CancelOrder`/`exchange.Log`); `Log!`/`LogStatus!`/`LogProfit`/error logs are
/// unaffected. Process-wide.
pub fn EnableLog(on: bool) {
    todo!()
}

/// Robot meta info (the host's "meta" env value) as a navigable [`JsonValue`]; `Null` if none.
pub fn GetMeta() -> JsonValue {
    todo!()
}

/// Add a **regex**; error logs matching any added regex are not recorded ("" clears
/// all filters). `GetLastError` is unaffected.
pub fn SetErrorFilter(pattern: &str) {
    todo!()
}

/// Send an email via SMTP; returns whether it was accepted (failure is logged).
pub fn Mail(smtp: &str, user: &str, pass: &str, to: &str, title: &str, body: &str) -> bool {
    todo!()
}

/// Async [`Mail`] (same arguments): the mail is sent on a background thread;
/// `.wait(timeout)` yields `Mail`'s result (`true` sent, `false` failed — logged
/// at wait). On completion [`EventLoop`] receives `Event: "Mail"`.
pub fn Mail_Go(smtp: &str, user: &str, pass: &str, to: &str, title: &str, body: &str) -> AsyncRoutine<bool> {
    todo!()
}

/// HTTP request (legacy `HttpQuery(url, postData|options)`; second argument: see
/// [`HttpOption`]). The return type chooses the result:
/// `let body: String = HttpQuery(url, None);` /
/// `let r: HttpRet = HttpQuery(url, None);` /
/// `let r: HttpRet = HttpQuery(url, &opts);` (`opts` a [`JsonValue`] options object).
/// A legacy URL proxy prefix also works:
/// `HttpQuery("socks5://127.0.0.1:8889/http://www.baidu.com/", None)`.
/// Never `Err`: on failure the error is logged + `GetLastError`, a `String` result
/// is "" and an `HttpRet` has `StatusCode` 0 + `Error`. Default timeout 300 s.
pub fn HttpQuery<R: HttpResp>(url: &str, option: impl HttpOption) -> R {
    todo!()
}

/// Async [`HttpQuery`] (same arguments): the request starts on a background
/// thread right away; `.wait(timeout)` yields what `HttpQuery` would return —
/// the result type picks the body (`String`) or the full [`HttpRet`], failures
/// included ("" / `StatusCode` 0 + `Error`, logged at wait). `wait` follows
/// [`TypedRoutine::wait`] (see [`AsyncRoutine::wait`]). On completion
/// [`EventLoop`] receives `Event: "HttpQuery"`, `Index` = ticket. Shares the
/// 2000 unwaited-ticket limit with `exchange.Go`.
/// `let r: String = HttpQuery_Go(url, None).wait(0).unwrap();`
pub fn HttpQuery_Go<R: HttpResp + 'static>(url: &str, option: impl HttpOption) -> AsyncRoutine<R> {
    todo!()
}

/// A random 26-char id (generated locally in a backtest).
pub fn UUID() -> String {
    todo!()
}

/// MD5 hex digest of `data` ("" on failure).
pub fn MD5(data: &str) -> String {
    todo!()
}

/// Generic hash / HMAC / codec (host `Encode`). `key_fmt`/`key` are ""
/// for plain digests, e.g. `Encode("sha256", "string", "hex", data, "", "")`.
/// "" on failure (reason in `GetLastError`).
pub fn Encode(algo: &str, in_fmt: &str, out_fmt: &str, data: &str, key_fmt: &str, key: &str) -> String {
    todo!()
}

/// Digest of raw `data` — `Hash("sha256", "hex", data)` =
/// `Encode(algo, "raw", out_fmt, data, "", "")`.
pub fn Hash(algo: &str, out_fmt: &str, data: &str) -> String {
    todo!()
}

/// HMAC of raw `data` with raw `key` — `HMAC("sha256", "hex", data, key)` =
/// `Encode(algo, "raw", out_fmt, data, "raw", key)`.
pub fn HMAC(algo: &str, out_fmt: &str, data: &str, key: &str) -> String {
    todo!()
}

/// Decode a byte string (its code points taken as latin1 bytes) from `charset`
/// (e.g. "gbk", required) to UTF-8.
pub fn StrDecode(s: &str, charset: &str) -> String {
    todo!()
}

/// Decrypt a `$$$__...` encrypted credential string ("" on failure).
pub fn Decrypt(data: &str) -> String {
    todo!()
}

/// A lazily-decrypted encrypted strategy parameter. The server bakes an encrypted
/// UI param as `static name: Decrypted = __decrypt(...)`; it derefs to `&str` so a
/// strategy uses it like a string param (`&*SECRET`, `SECRET.to_string()`,
/// `format!("{}", SECRET)`).
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
/// Construct a lazily-decrypted param (a `const fn`, so it can initialise a
/// `static`). Emitted by the server for encrypted UI params. See [`Decrypted`].
pub const fn __decrypt(p: &'static str, v: &'static str) -> Decrypted {
    Decrypted::new(p, v)
}

/// Clear the log table; `remain` > 0 keeps the newest `remain` rows. Failure is
/// logged (and `GetLastError`), not silent.
pub fn LogReset(remain: i64) {
    todo!()
}
/// Clear the profit log; `remain` > 0 keeps the newest `remain` rows.
pub fn LogProfitReset(remain: i64) {
    todo!()
}
/// Compact the log database. Live only.
pub fn LogVacuum() {
    todo!()
}

/// Run a SQL statement on the robot's local database (canonical `DBExec`; a ":"
/// prefix = in-memory DB). A query returns its rows and column names; a write/DDL
/// yields an empty [`DBResult`]. On error: logged + `GetLastError`, empty result.
pub fn DBExec(sql: &str) -> DBResult {
    todo!()
}

/// Wait for the next runtime event. `timeout` < 0 does not wait (`Null` when
/// none), 0 waits until an event arrives, > 0 waits at most that many ms
/// (`JsonValue::Null` on timeout). Event objects (same shapes as JS):
/// - tick: `{Seq, Event:"tick", ThreadId:0, Index:<exchange index>, Queue:0, Nano, Symbol, Ticker}`;
/// - order: `{..., Event:"order", Index:<exchange index>, Order}`;
/// - `exchange.Go` done: `{..., Event:"Exchange_<Method>", Index:<ticket>}`.
/// The first call subscribes the current pair (ticker + order updates) of every
/// push-only exchange (CTP-style counters; REST venues are never auto-subscribed);
/// SetCurrency/SetContractType on the thread that first called EventLoop move it
/// (other threads have their own pair). Don't mix with `ctx::poll` in one thread.
pub fn EventLoop(timeout: impl ToF64) -> JsonValue {
    todo!()
}

/// Publish data on this robot's channel (read by others via [`GetChannelDataOf`]).
pub fn SetChannelData(s: &str) {
    todo!()
}
/// Latest data on THIS robot's own channel — same as
/// `GetChannelDataOf(_G!())`. The first call subscribes and returns `Null`; the
/// value arrives once the channel syncs. Use [`GetChannelDataOf`] for others.
pub fn GetChannelData() -> JsonValue {
    todo!()
}
/// Latest data on channel `channel` — a robot id (`123456` / `"123456"`) or a
/// 32-char UUID (legacy `GetChannelData(channelId)`): `Null` until data arrives;
/// JSON is parsed, anything else is a `JsonValue::String`. On a read error: an
/// error log, `GetLastError`, and `Null`.
pub fn GetChannelDataOf(channel: impl ToArg) -> JsonValue {
    todo!()
}

/// A streaming socket / WebSocket / database connection (`Dial`). Opening
/// failure yields an invalid, already-closed handle (no panic). Closed on drop.
pub struct Dial {
    fd: i64,
    valid: bool,
    closed: bool,
    reconnect: bool,
}

/// Open a connection with the host default timeout. `addr` e.g. "wss://...",
/// "tcp://...", "sqlite3://file.db"; legacy tail options work:
/// `"wss://...|compress=gzip&reconnect=true&payload=..."`.
pub fn Dial(addr: &str) -> Dial {
    todo!()
}

impl Dial {
    /// Open a connection. `timeout` is the connect timeout in **seconds** (0 = host
    /// default) — same as `with_options(addr, {"timeout": timeout*1000})`.
    pub fn new(addr: &str, timeout: i64) -> Dial {
        todo!()
    }

    /// Open with a JSON options string: `{"timeout":30000,"reconnect":true,
    /// "retry":0,"interval":1000,"payload":"...","compress":"gzip",
    /// "pingInterval":5000,"pingMessage":"ping","pingType":"text","headers":{...},
    /// "insecureSkipVerify":true,"proxy":"..."}` (address tail options override).
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

    /// Read one message; `timeout` ms: > 0 waits at most that long, 0 blocks until
    /// data, -1 takes one without waiting, < -1 drops the backlog and takes the
    /// latest. "" on timeout / no data / peer closed (then `IsClosed()`; with
    /// `reconnect` the handle stays open and reconnects in the background).
    pub fn read(&mut self, timeout: i64) -> String {
        todo!()
    }

    /// Send `buf`; returns bytes written (0 == failed / now closed).
    pub fn write(&mut self, buf: &str, timeout: i64) -> i64 {
        todo!()
    }

    /// Run a SQL statement over a database connection (`Dial("sqlite3://...")`): a
    /// query returns rows + column names, a write/DDL yields an empty [`DBResult`].
    /// Not a DB connection / failure: logged + `GetLastError`, empty result.
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
    /// Start the current bar — subsequent Pine calls accumulate onto it until
    /// [`close`](Self::close).
    pub fn begin(&mut self, bar: &Record) {
        todo!()
    }
    /// Clear the chart; `remain` > 0 keeps the newest `remain` candles.
    pub fn reset(&mut self, remain: i64) {
        todo!()
    }
    /// Pack the current bar (OHLCV + plots/signals) into a candle and push it: a
    /// new bar time appends, the same bar time replaces the last candle (an
    /// updating bar can be closed repeatedly).
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
    /// Plot an up/down arrow sized by `value` (NaN/0 → none). `opts`: title,
    /// colorup, colordown, offset, minheight, maxheight, overlay.
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
    /// closebuy/closelong, closesell/closeshort. `id` "" defaults to `direction`.
    pub fn signal(&mut self, direction: &str, price: f64, qty: f64, id: &str) {
        todo!()
    }
}

/// A method token for [`Exchange::Go`]: carries the op name and result type. The
/// unit structs in [`mod@Go`] implement it — you never implement it yourself.
pub trait GoCall {
    /// The decoded result type [`TypedRoutine::wait`] returns.
    type Out: Clone;
    /// Method name (the EventLoop completion event is `Exchange_<NAME>`).
    #[doc(hidden)]
    const NAME: &'static str;
    #[doc(hidden)]
    fn go(ex: &Exchange, args: Vec<Arg>) -> Result<Self::Out>;
}
/// Typed handle to an async call started by [`Exchange::Go`]; `wait` yields the
/// token's result type.
pub struct TypedRoutine<M: GoCall> {
    _m: std::marker::PhantomData<fn() -> M>,
}
impl<M: GoCall> TypedRoutine<M> {
    /// Wait for the result: `timeout_ms < 0` does not wait, `0` waits until done,
    /// `> 0` waits at most that many ms. Not finished yet →
    /// `Err("routine N not finished")` (the ticket is kept — wait again later);
    /// result already taken → `Err("routine N already finished")`; robot stopped →
    /// `Err(Error::Stopped)`. Otherwise the method's own `Result`.
    pub fn wait(&self, timeout_ms: i64) -> Result<M::Out> {
        todo!()
    }
}

/// Handle to an async [`HttpQuery_Go`] / [`Mail_Go`] call.
pub struct AsyncRoutine<T> {
    _t: std::marker::PhantomData<T>,
}
impl<T> AsyncRoutine<T> {
    /// Wait for the result: `timeout_ms < 0` does not wait, `0` waits until done,
    /// `> 0` waits at most that many ms. Not finished yet →
    /// `Err("routine N not finished")` (wait again later); result already taken →
    /// `Err("routine N already finished")`; robot stopped → `Err(Error::Stopped)`.
    /// Otherwise `Ok` with the sync function's result.
    pub fn wait(&self, timeout_ms: i64) -> Result<T> {
        todo!()
    }
}

/// Method tokens for [`Exchange::Go`] — `Go::GetTicker`, `Go::CreateOrder`, … each
/// selects the async exchange method and its typed result. Args are the method's
/// positional args (single value, tuple or `Vec<Arg>`), e.g.
/// `exchange.Go(Go::CreateOrder, ("BTC_USDT", "buy", -1, 0.01))`.
#[allow(non_snake_case)]
pub mod Go {
    /// Token for async [`GetTicker`](super::Exchange::GetTicker) → `Ticker`.
    pub struct GetTicker;
    /// Token for async [`GetTickers`](super::Exchange::GetTickers) → `Vec<Ticker>`.
    pub struct GetTickers;
    /// Token for async [`GetDepth`](super::Exchange::GetDepth) → `Depth`.
    pub struct GetDepth;
    /// Token for async [`GetAccount`](super::Exchange::GetAccount) → `Account`.
    pub struct GetAccount;
    /// Token for async [`GetAssets`](super::Exchange::GetAssets) → `Vec<Asset>`.
    pub struct GetAssets;
    /// Token for async [`GetPositions`](super::Exchange::GetPositions) → `Vec<Position>`.
    pub struct GetPositions;
    /// Token for async [`GetPosition`](super::Exchange::GetPosition) → `Vec<Position>`.
    pub struct GetPosition;
    /// Token for async [`GetRecords`](super::Exchange::GetRecords) → `Vec<Record>`;
    /// args `(symbol, period, limit)` or the legacy `(period, limit)`.
    pub struct GetRecords;
    /// Token for async [`GetTrades`](super::Exchange::GetTrades) → `Vec<Trade>`.
    pub struct GetTrades;
    /// Token for async [`GetFundings`](super::Exchange::GetFundings) → `Vec<Funding>`.
    pub struct GetFundings;
    /// Token for async [`GetOrders`](super::Exchange::GetOrders) → `Vec<Order>`.
    pub struct GetOrders;
    /// Token for async [`GetOrder`](super::Exchange::GetOrder) → `Order`.
    pub struct GetOrder;
    /// Token for async [`GetHistoryOrders`](super::Exchange::GetHistoryOrders) → `Vec<Order>`.
    pub struct GetHistoryOrders;
    /// Token for async [`Buy`](super::Exchange::Buy) → `OrderId`; args `(price, amount)`.
    pub struct Buy;
    /// Token for async [`Sell`](super::Exchange::Sell) → `OrderId`; args `(price, amount)`.
    pub struct Sell;
    /// Token for async [`CreateOrder`](super::Exchange::CreateOrder) → `OrderId`.
    pub struct CreateOrder;
    /// Token for async [`ModifyOrder`](super::Exchange::ModifyOrder) → `OrderId`.
    pub struct ModifyOrder;
    /// Token for async [`CancelOrder`](super::Exchange::CancelOrder) → `()`.
    pub struct CancelOrder;
    /// Token for async [`CreateConditionOrder`](super::Exchange::CreateConditionOrder)
    /// → `OrderId`; the condition arg is a JSON object with the `OrderCondition` fields.
    pub struct CreateConditionOrder;
    /// Token for async [`GetConditionOrders`](super::Exchange::GetConditionOrders) → `Vec<Order>`.
    pub struct GetConditionOrders;
    /// Token for async [`GetConditionOrder`](super::Exchange::GetConditionOrder) → `Order`.
    pub struct GetConditionOrder;
    /// Token for async [`CancelConditionOrder`](super::Exchange::CancelConditionOrder) → `()`.
    pub struct CancelConditionOrder;
    /// Token for async [`IO`](super::Exchange::IO) → `JsonValue`.
    pub struct IO;
}
macro_rules! go_call {
    ($name:ident, $out:ty) => {
        impl GoCall for Go::$name {
            type Out = $out;
            const NAME: &'static str = stringify!($name);
            fn go(ex: &Exchange, args: Vec<Arg>) -> Result<$out> {
                todo!()
            }
        }
    };
}
go_call!(GetTicker, Ticker);
go_call!(GetTickers, Vec<Ticker>);
go_call!(GetDepth, Depth);
go_call!(GetAccount, Account);
go_call!(GetAssets, Vec<Asset>);
go_call!(GetPositions, Vec<Position>);
go_call!(GetPosition, Vec<Position>);
go_call!(GetRecords, Vec<Record>);
go_call!(GetTrades, Vec<Trade>);
go_call!(GetFundings, Vec<Funding>);
go_call!(GetOrders, Vec<Order>);
go_call!(GetOrder, Order);
go_call!(GetHistoryOrders, Vec<Order>);
go_call!(Buy, OrderId);
go_call!(Sell, OrderId);
go_call!(CreateOrder, OrderId);
go_call!(ModifyOrder, OrderId);
go_call!(CancelOrder, ());
go_call!(CreateConditionOrder, OrderId);
go_call!(GetConditionOrders, Vec<Order>);
go_call!(GetConditionOrder, Order);
go_call!(CancelConditionOrder, ());
go_call!(IO, JsonValue);

/// `Log!("price", last, ...)` — variadic, mixed types (any [`ToArg`]).
#[macro_export]
macro_rules! Log {
    ($($arg:expr),* $(,)?) => {
        $crate::log_args("Log", &[$($crate::ToArg::to_arg(&$arg)),*][..])
    };
}

/// `LogStatus!(...)` — refresh the status bar.
#[macro_export]
macro_rules! LogStatus {
    ($($arg:expr),* $(,)?) => {
        $crate::log_args("LogStatus", &[$($crate::ToArg::to_arg(&$arg)),*][..])
    };
}

/// `Panic!(...)` — log an error line, then abort the strategy.
#[macro_export]
macro_rules! Panic {
    ($($arg:expr),* $(,)?) => {
        $crate::log_args("Panic", &[$($crate::ToArg::to_arg(&$arg)),*][..])
    };
}

/// Persistent KV (legacy `_G`), by arity: `_G!()` → robot id; `_G!(k)` → read
/// ("" when absent); `_G!(k, v)` → write; `_G!(k, null)` → delete.
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

/// Retry until `Ok` (legacy `_C`): `_C!(exchange.GetTicker(""))` re-runs the
/// expression every [`_CDelay`] ms until it returns `Ok`, then yields the value.
/// Only for transient errors — a permanent error loops forever.
#[macro_export]
macro_rules! _C {
    ($call:expr) => {{
        loop {
            match $call {
                ::core::result::Result::Ok(v) => break v,
                ::core::result::Result::Err(_) => $crate::Sleep($crate::c_retry_delay_ms()),
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

/// Technical-analysis helpers (warm-up values are NaN, identical to JS `TA`).
/// Use the global value [`TA`] (`TA.EMA(&r, 9)`) or the module form
/// (`TA::EMA(&r, 9)`) — both take the same arguments.
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
    /// Bill Williams Alligator → `[jaw, teeth, lips]` (default periods 13/8/5;
    /// SMMA of (High+Low)/2, shifted forward 8/5/3 bars).
    pub fn Alligator(&self, records: &[Record], jaw: impl Into<Option<usize>>, teeth: impl Into<Option<usize>>, lips: impl Into<Option<usize>>) -> [Vec<f64>; 3] { todo!() }
    /// Chaikin Money Flow (default period 20). Needs a K-line (High/Low/Close/Volume).
    pub fn CMF(&self, records: &[Record], periods: impl Into<Option<usize>>) -> Vec<f64> { todo!() }
    /// Highest value over the `n` bars before the current (last) one (`n` 0 = all).
    /// On a K-line this reads `Close`; use [`HighestBy`](Self::HighestBy) for another field.
    pub fn Highest<T: Ticks + ?Sized>(&self, src: &T, n: usize) -> f64 { todo!() }
    /// Lowest value over the `n` bars before the current (last) one (`n` 0 = all).
    pub fn Lowest<T: Ticks + ?Sized>(&self, src: &T, n: usize) -> f64 { todo!() }
    /// Legacy `TA.Highest(records, n, attr)`: highest of field `attr` ("High"/"Low"/
    /// "Open"/"Close"/"Volume"/"OpenInterest"/"Time") over the `n` bars before the
    /// current one (`n` 0 = all bars). An unknown field gives NaN.
    pub fn HighestBy(&self, records: &[Record], n: usize, attr: &str) -> f64 { todo!() }
    /// Legacy `TA.Lowest(records, n, attr)`; same rules as [`HighestBy`](Self::HighestBy).
    pub fn LowestBy(&self, records: &[Record], n: usize, attr: &str) -> f64 { todo!() }
}
/// Global instance: `TA.EMA(&records, 9)`.
pub static TA: TAHelper = TAHelper;

/// Module form of the [`TA`] helpers: `TA::MA(&r, 5)` — each forwards to
/// `TA.X(...)` with the same signature. (The module and the `TA` value live in
/// different namespaces, so both spellings work.)
#[allow(non_snake_case)]
pub mod TA {
    use super::Record;
    pub use super::{TAHelper, Ticks};
    pub fn MA<T: Ticks + ?Sized>(src: &T, period: impl Into<Option<usize>>) -> Vec<f64> { todo!() }
    pub fn SMA<T: Ticks + ?Sized>(src: &T, period: impl Into<Option<usize>>) -> Vec<f64> { todo!() }
    pub fn EMA<T: Ticks + ?Sized>(src: &T, period: impl Into<Option<usize>>) -> Vec<f64> { todo!() }
    pub fn MACD<T: Ticks + ?Sized>(src: &T, fast: impl Into<Option<usize>>, slow: impl Into<Option<usize>>, signal: impl Into<Option<usize>>) -> [Vec<f64>; 3] { todo!() }
    pub fn BOLL<T: Ticks + ?Sized>(src: &T, period: impl Into<Option<usize>>, multiplier: impl Into<Option<f64>>) -> [Vec<f64>; 3] { todo!() }
    pub fn KDJ(records: &[Record], n: impl Into<Option<usize>>, k: impl Into<Option<usize>>, d: impl Into<Option<usize>>) -> [Vec<f64>; 3] { todo!() }
    pub fn RSI<T: Ticks + ?Sized>(src: &T, period: impl Into<Option<usize>>) -> Vec<f64> { todo!() }
    pub fn OBV(records: &[Record]) -> Vec<f64> { todo!() }
    pub fn ATR(records: &[Record], period: impl Into<Option<usize>>) -> Vec<f64> { todo!() }
    pub fn Alligator(records: &[Record], jaw: impl Into<Option<usize>>, teeth: impl Into<Option<usize>>, lips: impl Into<Option<usize>>) -> [Vec<f64>; 3] { todo!() }
    pub fn CMF(records: &[Record], periods: impl Into<Option<usize>>) -> Vec<f64> { todo!() }
    pub fn Highest<T: Ticks + ?Sized>(src: &T, n: usize) -> f64 { todo!() }
    pub fn Lowest<T: Ticks + ?Sized>(src: &T, n: usize) -> f64 { todo!() }
    pub fn HighestBy(records: &[Record], n: usize, attr: &str) -> f64 { todo!() }
    pub fn LowestBy(records: &[Record], n: usize, attr: &str) -> f64 { todo!() }
}

/// Fixed-point decimal (legacy `BigDecimal`/`BigFloat`): an i128 mantissa + scale
/// (~38 significant digits, NOT arbitrary precision; overflow panics). Avoids f64
/// rounding for amounts/prices: `BigDecimal("0.1").add(0.2).to_string() == "0.3"`.
#[derive(Clone, Copy, Debug)]
pub struct Decimal {
    v: i128,
    s: u32,
}
/// Values convertible to a [`Decimal`]: `&str`/`String` (parsed, scientific
/// notation ok), integers, floats, `Decimal`.
pub trait ToDecimal {
    fn to_decimal(&self) -> Decimal;
}
impl ToDecimal for Decimal { fn to_decimal(&self) -> Decimal { *self } }
impl ToDecimal for &str { fn to_decimal(&self) -> Decimal { todo!() } }
impl ToDecimal for String { fn to_decimal(&self) -> Decimal { todo!() } }
macro_rules! to_decimal_num {
    ($($t:ty),*) => {$(impl ToDecimal for $t { fn to_decimal(&self) -> Decimal { todo!() } })*};
}
to_decimal_num!(i8, i16, i32, i64, i128, isize, u8, u16, u32, u64, f32, f64);
impl Decimal {
    /// Parse a decimal string (scientific notation ok). Invalid input panics.
    pub fn parse(x: &str) -> Decimal { todo!() }
    pub fn add(&self, o: impl ToDecimal) -> Decimal { todo!() }
    pub fn sub(&self, o: impl ToDecimal) -> Decimal { todo!() }
    pub fn mul(&self, o: impl ToDecimal) -> Decimal { todo!() }
    /// Divide, keeping `scale` decimals (`None` = 20). Division by zero panics.
    pub fn div(&self, o: impl ToDecimal, scale: impl Into<Option<u32>>) -> Decimal { todo!() }
    pub fn neg(&self) -> Decimal { todo!() }
    pub fn abs(&self) -> Decimal { todo!() }
    pub fn cmp(&self, o: impl ToDecimal) -> std::cmp::Ordering { todo!() }
    pub fn eq(&self, o: impl ToDecimal) -> bool { todo!() }
    /// Round half-up to `scale` decimals.
    pub fn round(&self, scale: u32) -> Decimal { todo!() }
    pub fn to_f64(&self) -> f64 { todo!() }
    pub fn to_i64(&self) -> i64 { todo!() }
}
/// Plain decimal text (no exponent, trailing zeros trimmed).
impl std::fmt::Display for Decimal {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result { todo!() }
}
/// Construct a fixed-point decimal (legacy `BigDecimal(x)`): `BigDecimal("1.05")` / `BigDecimal(3)`.
pub fn BigDecimal(x: impl ToDecimal) -> Decimal { todo!() }
/// Legacy `BigFloat` (same as [`BigDecimal`]).
pub fn BigFloat(x: impl ToDecimal) -> Decimal { todo!() }

// ---- New model: WebSocket push (`ctx::subscribe` / `ctx::poll`) ----

/// Raw event vocabulary of the new model (`Event`, `EV_*`, `FEED_*`, `GW_*`, `CH_*`, …),
/// in scope like the SDK's `sdk::abi::*`. Read events through [`ctx::EventExt`]: it checks
/// `kind` and converts fixed-point prices/quantities to real numbers — no `unsafe` needed.
pub mod abi {
    /// One runtime event (512-byte POD). `payload` is a union keyed by `kind`; read it
    /// with the safe [`EventExt`](super::ctx::EventExt) accessors instead (raw prices and
    /// quantities are fixed-point mantissas, see `ctx::scales_of`).
    #[derive(Clone, Copy)]
    pub struct Event {
        /// Engine sequence number (monotonic within a run).
        pub seq: u64,
        pub ts_ingress_ns: u64,
        pub ts_publish_ns: u64,
        /// Event kind as the ABI number (`EV_*`). Strategies should not compare it: use the
        /// typed views (`ev.fill()`, `ev.order_ack()`, …),
        /// [`EventExt::event_kind`](super::ctx::EventExt::event_kind) (a [`Kind`](super::ctx::Kind))
        /// or [`EventExt::kind_str`](super::ctx::EventExt::kind_str) (the same name as JS `ev.kind`).
        pub kind: u16,
        /// Account (load order) the event came from.
        pub source: u16,
        /// Instrument id (`ctx::instrument_of` → (exchange, symbol)).
        pub instrument: u32,
        /// Kind-specific payload (reading a field needs `unsafe`; prefer `EventExt`).
        pub payload: EventPayload,
        /// Delivery stream id (= `Sub::id()`, or `STREAM_TIMER` / `STREAM_STATUS` / `STREAM_ORDER_ACK`).
        pub tag: u32,
    }
    impl Event {
        pub fn zeroed() -> Self { todo!() }
    }
    /// Event payload, the branch is chosen by `Event::kind`.
    #[derive(Clone, Copy)]
    pub union EventPayload {
        pub tick: MdTick,
        pub depth5: MdDepth5Side,
        pub trade: MdTrade,
        pub kline: MdKline,
        pub ord: OrdUpdate,
        pub pos: PosUpdate,
        pub bal: BalUpdate,
        pub fill: FillUpdate,
        pub ack: OrdAck,
        pub timer: TimerFired,
        pub gw: GwStatus,
        pub feed: FeedStatus,
        pub raw: [u8; 472],
    }
    /// `EV_MD_TICK` (fixed-point mantissas).
    #[derive(Clone, Copy)]
    pub struct MdTick {
        pub bid_px: i64, pub bid_qty: i64, pub ask_px: i64, pub ask_qty: i64,
        pub last_px: i64, pub last_qty: i64, pub volume: i64, pub open_interest: i64,
        pub day_open_px: i64, pub day_high_px: i64, pub day_low_px: i64,
        /// Exchange time (ms; 0 = unknown).
        pub exch_ts_ms: i64,
        pub flags: u32, pub _pad: u32,
    }
    /// `EV_MD_DEPTH5`: one side, up to 5 levels starting at `start_level`.
    #[derive(Clone, Copy)]
    pub struct MdDepth5Side {
        /// `SIDE_BUY` / `SIDE_SELL`.
        pub side: u8,
        pub count: u8,
        pub start_level: u8,
        /// `DEPTH5_F_*`.
        pub flags: u8,
        pub _pad: [u8; 4],
        pub px: [i64; 5],
        pub qty: [i64; 5],
    }
    /// `EV_MD_TRADE`.
    #[derive(Clone, Copy)]
    pub struct MdTrade {
        pub px: i64, pub qty: i64, pub exch_ts_ms: i64,
        /// Taker side (`SIDE_*`; 0 = unknown).
        pub side: u8,
        pub _pad: [u8; 7],
        pub trade_id: [u8; TRADE_ID_CAP],
    }
    impl MdTrade {
        pub fn trade_id_str(&self) -> &str { todo!() }
    }
    /// `EV_MD_KLINE`.
    #[derive(Clone, Copy)]
    pub struct MdKline {
        pub open: i64, pub high: i64, pub low: i64, pub close: i64,
        pub volume: i64, pub quote_volume: i64,
        pub open_time_ms: u64,
        pub interval_sec: u32,
        pub trades: u32,
        /// 1 = the bar is final.
        pub closed: u8,
        /// `KLINE_F_*`.
        pub flags: u8,
        pub _pad: [u8; 6],
        pub open_interest: i64,
    }
    /// `EV_ORD_UPDATE`.
    #[derive(Clone, Copy)]
    pub struct OrdUpdate {
        pub ord_id: [u8; ORD_ID_CAP],
        /// Client order id from the push (the localId for orders placed by `ctx::submit`); empty = none.
        pub client_id: [u8; CLIENT_ID_CAP],
        pub px: i64, pub qty: i64, pub filled_qty: i64, pub avg_px: i64,
        /// `ORD_ST_*`.
        pub state: u8,
        /// `rej::*`.
        pub reason: u8,
        pub _pad: [u8; 6],
    }
    impl OrdUpdate {
        pub fn ord_id_str(&self) -> &str { todo!() }
        pub fn client_id_str(&self) -> &str { todo!() }
    }
    /// `EV_POS_UPDATE`: full current state of one position slot (qty 0 = closed).
    #[derive(Clone, Copy)]
    pub struct PosUpdate {
        pub qty: i64, pub avg_px: i64,
        pub profit: f64, pub margin: f64, pub liq_px: f64, pub mark_px: f64, pub leverage: f64,
        pub exch_ts_ms: i64,
        pub side: u8,
        /// `POS_SIDE_*`.
        pub pos_side: u8,
        /// `PRIV_F_*`.
        pub flags: u8,
        pub _pad: [u8; 5],
    }
    /// `EV_BAL_UPDATE`: full current amounts of one asset (not a delta).
    #[derive(Clone, Copy)]
    pub struct BalUpdate {
        pub asset: [u8; ASSET_CAP],
        pub free: f64, pub frozen: f64, pub equity: f64, pub upnl: f64, pub margin: f64,
        pub exch_ts_ms: i64,
        pub flags: u8,
        pub _pad: [u8; 7],
    }
    impl BalUpdate {
        pub fn asset_str(&self) -> &str { todo!() }
    }
    /// `EV_FILL`: one fill of your own order (private stream, channel "fills").
    #[derive(Clone, Copy)]
    pub struct FillUpdate {
        /// Order id of the filled order (same as `OrdUpdate::ord_id`).
        pub ord_id: [u8; ORD_ID_CAP],
        /// Client order id of the filled order (same as `OrdUpdate::client_id`); empty = none.
        pub client_id: [u8; CLIENT_ID_CAP],
        /// Exchange trade id (`syn:` synthetic id when the venue gives none).
        pub trade_id: [u8; TRADE_ID_CAP],
        /// Fee asset; empty = unknown.
        pub fee_ccy: [u8; ASSET_CAP],
        pub px: i64, pub qty: i64,
        /// Fee of this fill: positive = paid, negative = rebate; NaN = unknown.
        pub fee: f64,
        /// Exchange fill time (ms; 0 = unknown).
        pub exch_ts_ms: i64,
        /// Order side (`SIDE_*`, not the taker side; 0 = unknown).
        pub side: u8,
        /// `LIQ_*`.
        pub liquidity: u8,
        pub _pad: [u8; 6],
    }
    impl FillUpdate {
        pub fn ord_id_str(&self) -> &str { todo!() }
        pub fn client_id_str(&self) -> &str { todo!() }
        pub fn trade_id_str(&self) -> &str { todo!() }
        pub fn fee_ccy_str(&self) -> &str { todo!() }
    }
    /// `EV_ORD_ACK`: result of one `ctx::submit` / `ctx::submit_batch` item (host-generated).
    #[derive(Clone, Copy)]
    pub struct OrdAck {
        /// Host time just before the request was written (`now_ns` clock).
        pub sent_ns: u64,
        /// Exchange answer time (ms; 0 = not given).
        pub exch_ts_ms: i64,
        /// `ACK_OP_*`.
        pub op: u8,
        /// `ACK_ST_*`.
        pub status: u8,
        /// `rej::*` (0 on success).
        pub reason: u8,
        pub _pad: [u8; 5],
        /// Request id `submit` returned: the order's client order id (localId) for orders, a new id for cancels.
        pub req_id: [u8; CLIENT_ID_CAP],
        /// Client order id of the target order (the localId; empty when canceling by exchange order id).
        pub client_id: [u8; CLIENT_ID_CAP],
        pub ord_id: [u8; ORD_ID_CAP],
        pub symbol: [u8; ACK_SYMBOL_CAP],
        /// Failure reason (truncated to 127 bytes); empty on success.
        pub message: [u8; ACK_MESSAGE_CAP],
    }
    impl OrdAck {
        pub fn ord_id_str(&self) -> &str { todo!() }
        pub fn client_id_str(&self) -> &str { todo!() }
        pub fn symbol_str(&self) -> &str { todo!() }
        pub fn message_str(&self) -> &str { todo!() }
    }
    /// `EV_TIMER`.
    #[derive(Clone, Copy)]
    pub struct TimerFired { pub timer_id: u64, pub scheduled_ns: u64 }
    /// `EV_GW_STATUS`.
    #[derive(Clone, Copy)]
    pub struct GwStatus {
        /// `GW_*`.
        pub status: u8,
        pub _pad: [u8; 7],
        pub detail: u64,
    }
    /// `EV_FEED_STATUS`.
    #[derive(Clone, Copy)]
    pub struct FeedStatus {
        /// `CH_*` of the target subscription.
        pub channel: u16,
        /// `FEED_PREFILL_*`.
        pub status: u8,
        pub _pad0: u8,
        pub interval_sec: u32,
        pub detail: u64,
        pub message: [u8; 152],
    }
    impl FeedStatus {
        pub fn message_str(&self) -> Result<&str, core::str::Utf8Error> { todo!() }
    }
    pub const EV_MD_TICK: u16 = 1;
    pub const EV_MD_DEPTH5: u16 = 3;
    pub const EV_MD_TRADE: u16 = 4;
    pub const EV_MD_KLINE: u16 = 5;
    pub const EV_ORD_UPDATE: u16 = 16;
    pub const EV_POS_UPDATE: u16 = 17;
    pub const EV_BAL_UPDATE: u16 = 18;
    /// One fill of your own order (private stream, channel "fills").
    pub const EV_FILL: u16 = 19;
    /// WebSocket order / cancel ack (one per `ctx::submit` item), on `STREAM_ORDER_ACK`.
    pub const EV_ORD_ACK: u16 = 20;
    pub const EV_TIMER: u16 = 32;
    pub const EV_GW_STATUS: u16 = 33;
    pub const EV_FEED_STATUS: u16 = 35;
    pub const STREAM_TIMER: u32 = 1;
    pub const STREAM_STATUS: u32 = 2;
    /// `ctx::submit` acks (kind "ack"), delivered only to the requesting thread.
    pub const STREAM_ORDER_ACK: u32 = 4;
    /// Stream ids minted by `subscribe` start here.
    pub const STREAM_FIRST_DYNAMIC: u32 = 16;
    pub const SIDE_BUY: u8 = 1;
    pub const SIDE_SELL: u8 = 2;
    pub const ORD_ST_ACKED: u8 = 1;
    pub const ORD_ST_PARTIAL: u8 = 2;
    pub const ORD_ST_FILLED: u8 = 3;
    pub const ORD_ST_CANCELED: u8 = 4;
    pub const ORD_ST_REJECTED: u8 = 5;
    pub const GW_UP: u8 = 1;
    pub const GW_DOWN: u8 = 2;
    pub const GW_DEGRADED: u8 = 3;
    pub const FEED_PREFILL_READY: u8 = 1;
    pub const FEED_PREFILL_FAILED: u8 = 2;
    pub const POS_SIDE_LONG: u8 = 1;
    pub const POS_SIDE_SHORT: u8 = 2;
    pub const POS_SIDE_NET: u8 = 3;
    /// `MdDepth5Side::flags`: last block of this book update.
    pub const DEPTH5_F_LAST: u8 = 1;
    /// `MdKline::flags`: history bar sent on the first subscription.
    pub const KLINE_F_PREFILL: u8 = 1;
    /// `PosUpdate::flags` / `BalUpdate::flags`: snapshot row after (re)subscribing.
    pub const PRIV_F_SNAPSHOT: u8 = 1;
    pub const ORD_ID_CAP: usize = 128;
    pub const TRADE_ID_CAP: usize = 128;
    pub const ASSET_CAP: usize = 64;
    pub const CLIENT_ID_CAP: usize = 64;
    pub const SYMBOL_CAP: usize = 128;
    /// `FillUpdate::liquidity`.
    pub const LIQ_UNKNOWN: u8 = 0;
    pub const LIQ_MAKER: u8 = 1;
    pub const LIQ_TAKER: u8 = 2;
    /// `OrdAck::op` / `status`.
    pub const ACK_OP_ORDER: u8 = 1;
    pub const ACK_OP_CANCEL: u8 = 2;
    pub const ACK_ST_OK: u8 = 1;
    pub const ACK_ST_FAILED: u8 = 2;
    pub const ACK_ST_UNKNOWN: u8 = 3;
    /// `OrdAck::symbol` / `message` capacities.
    pub const ACK_SYMBOL_CAP: usize = 64;
    pub const ACK_MESSAGE_CAP: usize = 128;
    pub const CH_TICKER: u16 = 1;
    pub const CH_TRADE: u16 = 2;
    pub const CH_DEPTH: u16 = 3;
    pub const CH_KLINE: u16 = 4;
    pub const CH_BBO: u16 = 5;
    pub const CH_PRIVATE: u16 = 6;
    pub const CH_TICKERS: u16 = 7;
    /// `ctx::WsOptions::compress`: auto-decompress binary frames.
    pub const WS_COMP_NONE: u8 = 0;
    pub const WS_COMP_GZIP: u8 = 1;
    pub const WS_COMP_DEFLATE: u8 = 2;
    pub const WS_COMP_RAW_DEFLATE: u8 = 3;
    /// Unified order reject reasons (`OrdUpdate::reason`, `OrderView::reason`).
    pub mod rej {
        pub const NONE: u8 = 0;
        pub const BAD_REQUEST: u8 = 1;
        pub const CREDENTIALS: u8 = 2;
        pub const TRANSPORT: u8 = 3;
        pub const EXCHANGE: u8 = 4;
        pub const THROTTLED: u8 = 5;
        pub fn text(code: u8) -> &'static str { todo!() }
    }
}
pub use abi::*;

/// WebSocket push and the native runtime: subscribe, then poll events yourself (no
/// callbacks). A subscription belongs to the thread that called [`ctx::subscribe`]: its
/// events go only to that thread, `poll` returns only that thread's events, and only
/// that thread can unsubscribe. Push is independent of REST (`GetTicker` etc. always
/// hit REST). Fallible calls return `Result<_, String>`, never panic.
///     use sdk::ctx::EventExt;
///     let book = ctx::subscribe(exchange, ctx::SubOpts::depth(20)).unwrap();
///     loop {
///         match ctx::poll(&[], Some(1000)) {
///             ctx::Polled::Event(ev) => {
///                 if let Some(st) = ev.feed_status() { if st.failed() { panic!("{}", st.message); } }
///                 else if let Ok(b) = ev.book(1) { Log!("bid1:", b.bids[0].0); }
///             }
///             ctx::Polled::Stopped => break,
///             _ => {}
///         }
///     }
pub mod ctx {
    pub use super::abi::{Event, STREAM_ORDER_ACK, STREAM_STATUS, STREAM_TIMER};
    use super::Exchange;

    /// Account address: load-order index (`u16`) or an exchange object (`exchange`,
    /// `exchanges[i]`). With an exchange object and no `symbol`, market-data
    /// subscriptions use its current pair at subscribe time.
    #[derive(Clone, Copy, Debug, PartialEq, Eq)]
    pub struct ExIndex;
    impl ExIndex {
        pub fn index(self) -> u16 { todo!() }
    }
    impl From<u16> for ExIndex { fn from(_: u16) -> Self { todo!() } }
    impl From<Exchange> for ExIndex { fn from(_: Exchange) -> Self { todo!() } }
    impl From<&Exchange> for ExIndex { fn from(_: &Exchange) -> Self { todo!() } }

    /// Subscription options (JS `{channel, symbol, depth, interval, mode, buffer}`).
    #[derive(Clone, Default, Debug)]
    pub struct SubOpts {
        /// "ticker" / "bbo" / "trade" / "depth" / "kline" / "private" / "tickers".
        pub channel: &'static str,
        pub symbol: String,
        pub depth: u16,
        /// K-line period in seconds.
        pub interval: u32,
        /// Latest mode: keep only the newest event (default for ticker/bbo/depth).
        pub latest: bool,
        /// Ring mode: bounded buffer of N events, oldest dropped (trade/kline default 1024).
        pub buffer: u32,
    }
    impl SubOpts {
        pub fn ticker() -> Self { todo!() }
        /// Best bid/ask (a separate subscription from ticker).
        pub fn bbo() -> Self { todo!() }
        pub fn trade() -> Self { todo!() }
        /// Order book with `n` levels: 0 = the venue's default, or any 1..=255, each level count its own
        /// subscription (smallest native level covering `n`, truncated to `n`). Above 255 `subscribe` returns
        /// Err; above the venue's maximum the stream gets a kind "status" FAILED ("unsupported depth ...").
        pub fn depth(n: u16) -> Self { todo!() }
        pub fn kline(interval_sec: u32) -> Self { todo!() }
        /// The account's private stream: order updates + fills + positions + balances, no symbol.
        pub fn private() -> Self { todo!() }
        /// Market-wide tickers, no symbol; only venues with an all-market stream
        /// (otherwise a kind "status" FAILED event on this stream).
        pub fn tickers() -> Self { todo!() }
        /// Unified symbol `BASE_QUOTE[.contract]`.
        pub fn symbol(self, symbol: impl Into<String>) -> Self { todo!() }
        /// Latest delivery mode (exclusive with [`Self::buffer`]).
        pub fn latest(self) -> Self { todo!() }
        /// Ring delivery mode with `n` events (exclusive with [`Self::latest`]).
        pub fn buffer(self, n: u32) -> Self { todo!() }
    }

    /// Subscription handle (`Copy`). Identical subscriptions in one thread share one
    /// stream (reference counted: one `unsubscribe` per `subscribe`).
    #[derive(Clone, Copy, Debug, PartialEq, Eq)]
    pub struct Sub;
    impl Sub {
        /// Stream id: the `poll` filter unit and the events' `ev.stream()`.
        pub fn id(self) -> u32 { todo!() }
        pub fn ex(self) -> u16 { todo!() }
        pub fn channel(self) -> &'static str { todo!() }
        pub fn depth(self) -> u16 { todo!() }
        pub fn interval(self) -> u32 { todo!() }
        /// This depth subscription's own order book, top `n` levels (empty before the
        /// first snapshot). Not a depth subscription / unsubscribed → Err.
        pub fn book(self, n: usize) -> Result<Book, String> { todo!() }
        /// Latest positions of a private subscription; `Ok(None)` = account snapshot
        /// not READY yet (unknown, not "no positions").
        pub fn positions(self) -> Result<Option<Vec<PositionRow>>, String> { todo!() }
        /// Latest balances of a private subscription; `Ok(None)` as for `positions`.
        pub fn balances(self) -> Result<Option<Vec<BalanceRow>>, String> { todo!() }
        /// Drop this reference; only the subscribing thread can do it (other threads → Err).
        pub fn unsubscribe(self) -> Result<(), String> { todo!() }
    }

    /// Assembled order book: `(price, qty)`, bids descending, asks ascending.
    #[derive(Clone, Debug, Default, PartialEq)]
    pub struct Book {
        pub bids: Vec<(f64, f64)>,
        pub asks: Vec<(f64, f64)>,
    }

    /// A position row (full current state). Money fields `None` = not given by the venue.
    #[derive(Clone, Debug, PartialEq)]
    pub struct PositionRow {
        pub symbol: String,
        /// "buy" (long) / "sell" (short); "" when a net slot is flat.
        pub side: String,
        /// "long" / "short" (hedge mode legs) or "net".
        pub pos_side: String,
        pub qty: f64,
        pub avg_px: f64,
        pub profit: Option<f64>,
        pub margin: Option<f64>,
        pub liq_px: Option<f64>,
        pub mark_px: Option<f64>,
        pub leverage: Option<f64>,
        /// Exchange update time (ms): always `Some` on events (ingress time when the venue gave
        /// none); `None` in `Sub::positions()` rows when the venue gave none.
        pub time: Option<f64>,
        /// Part of the snapshot after (re)subscribing.
        pub snapshot: bool,
    }

    /// A balance row: the asset's full current amounts (not a delta).
    #[derive(Clone, Debug, PartialEq)]
    pub struct BalanceRow {
        pub asset: String,
        /// `None`: the push carries no value with `GetAssets()`'s meaning (pushes are never back-filled from REST).
        pub free: Option<f64>,
        pub frozen: Option<f64>,
        pub equity: Option<f64>,
        pub upnl: Option<f64>,
        pub margin: Option<f64>,
        /// As `PositionRow::time`.
        pub time: Option<f64>,
        pub snapshot: bool,
    }

    /// Ticker event (kind "ticker": ticker / bbo / tickers channels), real numbers.
    #[derive(Clone, Debug, PartialEq)]
    pub struct TickerView {
        pub symbol: String,
        pub bid: f64,
        pub ask: f64,
        /// 0 on bbo-type channels without a last price.
        pub last: f64,
        pub bid_qty: f64,
        pub ask_qty: f64,
        pub volume: f64,
        pub open_interest: f64,
        /// Trading-day open/high/low; `last` when the protocol has none.
        pub open: f64,
        pub high: f64,
        pub low: f64,
        /// Exchange time (ms; ingress time when the venue gave none), same as `ev.time()`.
        pub time: f64,
    }

    /// Trade event (kind "trade").
    #[derive(Clone, Debug, PartialEq)]
    pub struct TradeView {
        pub symbol: String,
        pub px: f64,
        pub qty: f64,
        /// Taker side "buy" / "sell"; "" when unknown.
        pub side: &'static str,
        /// Same id as the REST `trades` row `id`; "" when the venue gives none.
        pub trade_id: String,
        /// Exchange trade time (ms; ingress time when the venue gave none).
        pub time: f64,
    }

    /// K-line event (kind "kline").
    #[derive(Clone, Debug, PartialEq)]
    pub struct KlineView {
        pub symbol: String,
        pub open: f64,
        pub high: f64,
        pub low: f64,
        pub close: f64,
        pub volume: f64,
        pub open_interest: f64,
        /// Period in seconds.
        pub interval: u32,
        /// Bar open time (ms; can go straight to `_D`).
        pub open_time: i64,
        /// Same as `open_time` (f64, the uniform `time` of every view).
        pub time: f64,
        /// The bar is final (open bars are pushed repeatedly).
        pub closed: bool,
        /// History sent on the first subscription.
        pub prefill: bool,
    }

    /// Order update (kind "order", private stream).
    #[derive(Clone, Debug, PartialEq)]
    pub struct OrderView {
        pub symbol: String,
        /// Exchange order id ("" when the venue gave none).
        pub id: String,
        /// Client order id from the push (the localId [`submit`] returned for orders it placed; "" = none).
        pub client_id: String,
        /// "acked" / "partial" / "filled" / "canceled" / "rejected".
        pub state: &'static str,
        pub px: f64,
        pub qty: f64,
        pub filled_qty: f64,
        pub avg_px: f64,
        /// Unified reject reason code (0 = none).
        pub reason: u8,
        pub reason_text: &'static str,
        /// Ingress time (ms): order updates carry no exchange time yet.
        pub time: f64,
    }

    /// Fill (kind "fill", private stream "fills"): one fill of your own order. Pushed before the
    /// order update that reflects it; no snapshot, no backfill after (re)subscribing.
    #[derive(Clone, Debug, PartialEq)]
    pub struct FillView {
        pub symbol: String,
        /// Order id of the filled order (same as `OrderView::id` / `ctx::order`'s result).
        pub order_id: String,
        /// Client order id of the filled order (same as `OrderView::client_id`; "" = none).
        pub client_id: String,
        /// Exchange trade id ("syn:" synthetic id when the venue gives none; "" when none at all).
        pub trade_id: String,
        /// This fill's price / quantity.
        pub px: f64,
        pub qty: f64,
        /// Fee of this fill: positive = paid, negative = rebate; `None` = not given (not 0).
        pub fee: Option<f64>,
        /// Fee asset; "" = unknown.
        pub fee_ccy: String,
        /// Order side "buy" / "sell" (not the taker side); "" when unknown.
        pub side: &'static str,
        /// "maker" / "taker"; "" when the venue does not say.
        pub liquidity: &'static str,
        /// Exchange fill time (ms; ingress time when the venue gave none).
        pub time: f64,
    }

    /// WebSocket order / cancel ack (kind "ack", stream `STREAM_ORDER_ACK`): the result of one
    /// [`submit`] / [`submit_batch`] item, delivered only to the requesting thread.
    #[derive(Clone, Debug, PartialEq)]
    pub struct OrderAckView {
        /// The request id [`submit`] returned: the order's client order id (localId) for orders, a new id
        /// for cancels.
        pub req_id: String,
        /// "order" / "cancel".
        pub op: &'static str,
        /// "ok" / "failed" / "unknown" (sent, no verdict: do NOT resend, reconcile by `client_id`).
        pub status: &'static str,
        /// `status == "ok"`.
        pub ok: bool,
        /// Exchange order id (new order / cancel target; "" for a failed placement).
        pub id: String,
        /// Client order id of the target order (the localId; "" when canceling by exchange order id).
        pub client_id: String,
        pub symbol: String,
        /// Failure reason (same text as REST; "" on success; truncated to 127 bytes).
        pub error: String,
        /// Unified reason code (`rej::*`, 0 on success) and its text.
        pub reason: u8,
        pub reason_text: &'static str,
        /// Exchange answer time (ms); `None` = not given.
        pub exch_time: Option<i64>,
        /// Round trip (ms): just before the request was written → the host got the verdict.
        pub latency_ms: f64,
        /// Exchange answer time, else `ev.ts()`.
        pub time: f64,
    }

    /// Gateway status (kind "gateway").
    #[derive(Clone, Copy, Debug, PartialEq)]
    pub struct GatewayView {
        pub ex: u16,
        /// `GW_UP` / `GW_DOWN` / `GW_DEGRADED`.
        pub status: u8,
        pub detail: u64,
        /// Ingress time (ms).
        pub time: f64,
    }

    /// Subscription init status (kind "status", on the target subscription's stream):
    /// K-line history, private account snapshot, or a rejected subscription.
    #[derive(Clone, Debug, PartialEq)]
    pub struct FeedStatusView {
        pub stream: u32,
        /// The target subscription's channel ("private" for the account snapshot).
        pub channel: &'static str,
        pub interval: u32,
        /// `FEED_PREFILL_READY` (1) / `FEED_PREFILL_FAILED` (2).
        pub status: u8,
        pub detail: u64,
        /// The real reason when FAILED.
        pub message: String,
        /// Ingress time (ms).
        pub time: f64,
    }
    impl FeedStatusView {
        pub fn ready(&self) -> bool { todo!() }
        pub fn failed(&self) -> bool { todo!() }
    }

    /// Event type ([`EventExt::event_kind`]; `use sdk::ctx::{EventExt, Kind};`). Each variant's
    /// [`as_str`](Kind::as_str) (also its `Display`) is the JS / Python `ev.kind` name.
    /// Handle one kind with its typed view (`if let Some(f) = ev.fill() { … }`), dispatch
    /// several with `match ev.event_kind() { Kind::Fill => …, Kind::Order => …, _ => {} }`,
    /// and use [`EventExt::kind_str`] for logging or comparing names across languages.
    /// `#[non_exhaustive]`: new event kinds may be added as variants, so a `match` needs a
    /// `_` arm. `Unknown` is what an event of a kind this SDK does not know reads as.
    /// ticker / bbo / tickers are all `Ticker` (told apart by [`channel`](EventExt::channel)).
    #[derive(Copy, Clone, Debug, PartialEq, Eq, Hash)]
    #[non_exhaustive]
    pub enum Kind {
        /// "ticker" → `ev.ticker()`.
        Ticker,
        /// "depth" → `ev.book(n)`.
        Depth,
        /// "trade" → `ev.trade()`.
        Trade,
        /// "kline" → `ev.kline()`.
        Kline,
        /// "order" → `ev.order()`.
        Order,
        /// "position" → `ev.position()`.
        Position,
        /// "balance" → `ev.balance()`.
        Balance,
        /// "fill" → `ev.fill()`.
        Fill,
        /// "ack" (async order / cancel ack) → `ev.order_ack()`.
        Ack,
        /// "timer".
        Timer,
        /// "gateway" → `ev.gateway()`.
        Gateway,
        /// "status" (subscription READY / FAILED) → `ev.feed_status()`.
        Status,
        /// "unknown": a kind this SDK does not know.
        Unknown,
    }
    impl Kind {
        /// ABI event number (`Event.kind`) → `Kind` (`Unknown` if not registered).
        pub const fn from_abi(kind: u16) -> Kind { todo!() }
        /// The JS / Python `ev.kind` name: `Kind::Fill.as_str() == "fill"`.
        pub const fn as_str(self) -> &'static str { todo!() }
    }
    impl std::fmt::Display for Kind {
        fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result { todo!() }
    }

    /// Safe readers for a raw [`Event`] (`use sdk::ctx::EventExt;`): each checks the
    /// kind (`None` otherwise) and returns real numbers.
    pub trait EventExt {
        /// Event type as a [`Kind`]: dispatch several kinds with
        /// `match ev.event_kind() { Kind::Fill => …, _ => {} }`; for one kind use its typed
        /// view (`if let Some(f) = ev.fill()`). Never compare the numeric `Event.kind` (the ABI field).
        fn event_kind(&self) -> Kind;
        /// Event type name, the same as JS / Python `ev.kind` (= `ev.event_kind().as_str()`):
        /// "ticker" (ticker / bbo / tickers, told apart by [`channel`](EventExt::channel)),
        /// "depth", "trade", "kline", "order", "position", "balance", "fill", "ack", "timer",
        /// "gateway", "status"; "unknown" for a kind this SDK does not know. Use it for logging
        /// and cross-language name comparison; dispatch with [`event_kind`](EventExt::event_kind)
        /// or the typed views.
        fn kind_str(&self) -> &'static str;
        /// Delivery stream id (`Sub::id()`, `STREAM_TIMER`, `STREAM_STATUS`, `STREAM_ORDER_ACK`).
        fn stream(&self) -> u32;
        /// ticker / bbo / tickers / depth / trade / kline; orders / fills / positions / balance
        /// (private stream); "gateway"; "timer"; "ack"; kind "status" = its subscription's channel.
        fn channel(&self) -> &'static str;
        /// Depth event (kind "depth"): this subscription's book, top `n` levels.
        fn book(&self, n: usize) -> Result<Book, String>;
        /// Trade id of a trade event (kind "trade").
        fn trade_id(&self) -> Option<&str>;
        fn ticker(&self) -> Option<TickerView>;
        fn trade(&self) -> Option<TradeView>;
        fn kline(&self) -> Option<KlineView>;
        fn order(&self) -> Option<OrderView>;
        /// Fill (kind "fill").
        fn fill(&self) -> Option<FillView>;
        /// Async order / cancel ack (kind "ack").
        fn order_ack(&self) -> Option<OrderAckView>;
        fn position(&self) -> Option<PositionRow>;
        fn balance(&self) -> Option<BalanceRow>;
        fn gateway(&self) -> Option<GatewayView>;
        fn feed_status(&self) -> Option<FeedStatusView>;
        /// Ingress time (ms, µs fraction; JS `ts`): `ctx::now() - ev.ts()` = engine + poll latency.
        fn ts(&self) -> f64;
        /// When the event happened (ms; JS `time`): the exchange time when given (ticker, trade,
        /// fill, position, balance, ack), bar open for klines, scheduled time for timers, else `ts()`.
        fn time(&self) -> f64;
    }
    impl EventExt for Event {
        fn event_kind(&self) -> Kind { todo!() }
        fn kind_str(&self) -> &'static str { todo!() }
        fn stream(&self) -> u32 { todo!() }
        fn channel(&self) -> &'static str { todo!() }
        fn book(&self, n: usize) -> Result<Book, String> { todo!() }
        fn trade_id(&self) -> Option<&str> { todo!() }
        fn ticker(&self) -> Option<TickerView> { todo!() }
        fn trade(&self) -> Option<TradeView> { todo!() }
        fn kline(&self) -> Option<KlineView> { todo!() }
        fn order(&self) -> Option<OrderView> { todo!() }
        fn fill(&self) -> Option<FillView> { todo!() }
        fn order_ack(&self) -> Option<OrderAckView> { todo!() }
        fn position(&self) -> Option<PositionRow> { todo!() }
        fn balance(&self) -> Option<BalanceRow> { todo!() }
        fn gateway(&self) -> Option<GatewayView> { todo!() }
        fn feed_status(&self) -> Option<FeedStatusView> { todo!() }
        fn ts(&self) -> f64 { todo!() }
        fn time(&self) -> f64 { todo!() }
    }

    /// Result of [`poll`].
    pub enum Polled {
        Event(Event),
        /// Timed out (only with a timeout).
        Empty,
        /// The robot is stopping: finish and return.
        Stopped,
        /// Host poll failure (ABI return code; the reason is in the log).
        Error(i32),
    }

    /// Subscribe; returns the handle. Lazy: the upstream subscription is sent on the
    /// first `poll`. A rejected subscription does not fail here — its stream gets a
    /// kind "status" FAILED event (`ev.feed_status()`).
    pub fn subscribe(ex: impl Into<ExIndex>, opts: SubOpts) -> Result<Sub, String> { todo!() }
    /// Batch subscribe `symbols` with the same options; handles in the same order.
    /// Validated as a whole (one bad symbol → Err, nothing subscribed).
    pub fn subscribe_many(ex: impl Into<ExIndex>, opts: SubOpts, symbols: &[&str]) -> Result<Vec<Sub>, String> { todo!() }
    /// Next event of THIS thread's subscriptions (`&[]` = all of them, or `sub.id()`s /
    /// `STREAM_TIMER` / `STREAM_STATUS` / `STREAM_ORDER_ACK`); `None` = wait until an event or stop.
    pub fn poll(streams: &[u32], timeout_ms: Option<u64>) -> Polled { todo!() }
    /// Loaded exchanges as JSON `[{ex, label, name, symbol, interval, orderIdScope, feed, acksDropped}]`;
    /// `feed` = `{ticksDropped, backpressure, ringCapacity}` push-buffer counters; `acksDropped` =
    /// [`submit`] acks dropped because the requesting thread's ack queue (1024) was full.
    pub fn connectors() -> String { todo!() }
    /// Instrument id → (exchange index, symbol).
    pub fn instrument_of(inst: u32) -> std::rc::Rc<(u16, String)> { todo!() }
    /// Instrument (px_scale, qty_scale) of the raw fixed-point fields.
    pub fn scales_of(inst: u32) -> (u8, u8) { todo!() }
    /// Place an order over REST synchronously (real px/qty, `side` "buy"/"sell"; callable from any
    /// thread) → the exchange order id. `opts_json` (pass "{}" for none) only takes `type`
    /// ("limit"/"market"), `tif` ("gtc"/"ioc"/"fak"/"fok"/"postOnly"), `reduceOnly`, `postOnly` and
    /// `extra`; other keys → Err. WebSocket order entry is [`submit`].
    pub fn order(exchange: impl Into<ExIndex>, symbol: &str, side: &str, px: f64, qty: f64, opts_json: &str) -> Result<String, String> { todo!() }
    /// Cancel over REST synchronously. `id` = the exchange order id, or a localId [`submit`] returned in
    /// this run (canceled by client order id; Err where the exchange does not support that). An order
    /// that already filled → Err.
    pub fn cancel(exchange: impl Into<ExIndex>, symbol: &str, id: &str) -> Result<(), String> { todo!() }
    /// WebSocket order / cancel (WS only: Err where unsupported, never a REST fallback). `req_json` =
    /// `{"op":"order", symbol, side, price, amount, type?, tif?, postOnly?, reduceOnly?, extra?}` or
    /// `{"op":"cancel", symbol, id}` (`id` = exchange order id or a localId of this run). Returns the
    /// request id once written: for orders it is the client order id sent to the exchange (localId,
    /// generated for you — `clientId` is rejected), also the `client_id` of its order / fill pushes.
    /// The verdict is a kind "ack" event to THIS thread (`poll(&[STREAM_ORDER_ACK], …)`, `ev.order_ack()`).
    /// Bad request / unsupported / trading connection not up (first call waits ~5 s) / more than 256
    /// in flight / local rate limit → Err (nothing sent, no ack). A batch goes through [`submit_batch`].
    ///
    ///     let lid = ctx::submit(0, r#"{"op":"order","symbol":"BTC_USDT","side":"buy","price":30000,"amount":0.001}"#)?;
    ///     if let ctx::Polled::Event(ev) = ctx::poll(&[ctx::STREAM_ORDER_ACK], Some(5000)) {
    ///         if let Some(a) = ev.order_ack() { Log!("ack", a.req_id == lid, a.status, a.id); }
    ///     }
    pub fn submit(exchange: impl Into<ExIndex>, req_json: &str) -> Result<String, String> { todo!() }
    /// Batch [`submit`]: `req_json` = `{"op":"order"|"cancel","orders":[item, …]}` → request ids in the
    /// same order, one ack per item. Validated as a whole (one bad item → Err, nothing sent); one frame
    /// on venues with a native batch API, pipelined on one connection otherwise (not atomic).
    pub fn submit_batch(exchange: impl Into<ExIndex>, req_json: &str) -> Result<Vec<String>, String> { todo!() }
    /// Synchronous standard REST method (`"ticker"`, `"depth"`, `"assets"`, …) → result JSON.
    pub fn rest(exchange: impl Into<ExIndex>, method: &str, args_json: &str) -> Result<String, String> { todo!() }
    /// Exchange-specific endpoint escape hatch → raw string.
    pub fn raw(exchange: impl Into<ExIndex>, method: &str, args: &str) -> Result<String, String> { todo!() }
    /// Asynchronous [`rest`]: returns a ticket at once; collect it with [`rest_wait`].
    pub fn rest_go(exchange: impl Into<ExIndex>, method: &str, args_json: &str) -> Result<u64, String> { todo!() }
    /// Result of a [`rest_go`] ticket (blocks until done).
    pub fn rest_wait(ticket: u64) -> Result<String, String> { todo!() }
    /// Wall clock, epoch ms.
    pub fn now() -> f64 { todo!() }
    /// Sleep `ms` (interrupted by stop). Events are not lost while sleeping; to wait
    /// *and* react to events use `poll(&[..], Some(ms))`.
    pub fn sleep(ms: u64) { todo!() }
    /// [`sleep`] with fractional milliseconds (`0` sleeps nothing but still checks stop).
    pub fn sleep_f64(ms: f64) { todo!() }
    /// Whether a stop was requested (no side effects).
    pub fn stopped() -> bool { todo!() }

    // ---- runtime services (the base of the legacy globals) ----
    pub fn log(msg: impl AsRef<str>) { todo!() }
    pub fn log_status(msg: impl AsRef<str>) { todo!() }
    pub fn log_profit(profit: f64, note: impl AsRef<str>) { todo!() }
    /// Trade log row (`sell` false = buy / true = sell), fields in their own columns.
    pub fn trade_log(exchange: &str, sell: bool, direction: &str, order_id: &str, symbol: &str, price: f64, amount: f64, text: &str) { todo!() }
    /// Exchange-call failure log row.
    pub fn error_log(exchange: &str, text: &str) { todo!() }
    /// Cancel log row.
    pub fn cancel_log(exchange: &str, order_id: &str, symbol: &str, text: &str) { todo!() }
    /// Compact the log database (legacy `LogVacuum`).
    pub fn log_vacuum() { todo!() }
    /// Chart config JSON (legacy `Chart`).
    pub fn chart(cfg_json: impl AsRef<str>) { todo!() }
    /// Add a point (`data_json`: number / `[x, y]` …); `replace` = index to overwrite.
    pub fn chart_add(series: i64, data_json: &str, replace: Option<i64>) { todo!() }
    /// Delete a series; `series <= 0` deletes the whole chart (config included).
    pub fn chart_del(series: i64) { todo!() }
    /// Clear the chart data, keeping the newest `keep` points.
    pub fn chart_reset(keep: u64) { todo!() }
    pub fn set_channel_data(v: impl AsRef<str>) { todo!() }
    /// Latest data of the `token` channel ("" = nothing received yet); Err = unsupported.
    pub fn get_channel_data(token: impl AsRef<str>) -> Result<String, String> { todo!() }
    /// Interactive command: `timeout_ms < 0` non-blocking, `0` blocks until a command or
    /// stop, `> 0` waits at most that long. "" = no command.
    pub fn get_command(timeout_ms: f64) -> String { todo!() }
    /// The strategy sends a command to itself (legacy `SendCommand`).
    pub fn send_command(cmd: impl AsRef<str>) { todo!() }
    /// Decrypt a `$$$__` credential field.
    pub fn decrypt(data: impl AsRef<str>) -> Result<String, String> { todo!() }
    /// Robot id (legacy `_G()`).
    pub fn robot_id() -> i64 { todo!() }
    pub fn uuid() -> String { todo!() }
    /// Runtime info JSON (legacy `SysInfo()`).
    pub fn sys_info() -> String { todo!() }
    /// Backtest (virtual) run (legacy `IsVirtual()`).
    pub fn is_virtual() -> bool { todo!() }
    /// Server-pushed runtime config (trading sessions table …); `None` = never pushed.
    pub fn runtime_context() -> Option<String> { todo!() }
    /// Persistent KV (legacy `_G`): `None` = missing (an empty value is `Some("")`).
    pub fn kv_get(key: &str) -> Option<String> { todo!() }
    pub fn kv_set(key: &str, value: &str) { todo!() }
    pub fn kv_del(key: &str) { todo!() }
    /// Encode / digest (legacy `Encode`): `algo` md5/sha256/hmac-sha256/aes.*, formats
    /// raw|hex|base64; `key_fmt`+`key` for HMAC/AES (else "").
    pub fn encode(algo: &str, in_fmt: &str, out_fmt: &str, data: &str, key_fmt: &str, key: &str) -> Result<String, String> { todo!() }
    /// Hex digest (`hash("sha256", s)`).
    pub fn hash(algo: &str, data: &str) -> Result<String, String> { todo!() }
    /// Hex HMAC.
    pub fn hmac(algo: &str, data: &str, key: &str) -> Result<String, String> { todo!() }
    pub fn md5(data: &str) -> Result<String, String> { todo!() }
    /// Send a mail (legacy `Mail`).
    pub fn mail(smtp: &str, user: &str, pass: &str, to: &str, subject: &str, body: &str) -> Result<(), String> { todo!() }
    /// Set an account's outbound proxy ("" = direct; legacy `exchange.SetProxy`).
    pub fn set_proxy(exchange: u16, proxy: &str) -> Result<(), String> { todo!() }
    /// Replace an account's extra request headers (empty = clear).
    pub fn set_headers(exchange: u16, headers: &[(&str, &str)]) -> Result<(), String> { todo!() }

    // ---- Dial: blocking tcp/tls/ws/sqlite stream, integer fd (base of legacy `Dial`) ----
    /// Open `tcp://…` / `tls://…` / `ws(s)://…` / `sqlite://…` → fd (`opts_json` "{}" for none).
    pub fn dial(uri: &str, opts_json: &str) -> Result<i64, String> { todo!() }
    /// `Some(bytes)` data, `None` timeout, `Some([])` peer closed.
    pub fn dial_read(fd: i64, timeout_ms: i64) -> Result<Option<Vec<u8>>, String> { todo!() }
    /// Bytes written.
    pub fn dial_write(fd: i64, data: &[u8], timeout_ms: i64) -> Result<usize, String> { todo!() }
    pub fn dial_close(fd: i64) { todo!() }

    // ---- HTTP / WebSocket on the host's shared network stack ----
    /// HTTP response (owned).
    pub struct HttpResult {
        pub status: u16,
        pub headers: Vec<(String, String)>,
        pub body: Vec<u8>,
    }
    impl HttpResult {
        /// Body as UTF-8 text (invalid bytes replaced).
        pub fn text(&self) -> std::borrow::Cow<'_, str> { todo!() }
    }
    /// Options of [`http_with`] (default = [`http`]: 30 s timeout, follow 5 redirects).
    #[derive(Clone, Debug)]
    pub struct HttpOptions<'a> {
        /// Whole-request timeout ms (0 = host default).
        pub timeout_ms: u64,
        /// Per-request proxy `http(s)://` / `socks5(h)://` ("" = session default).
        pub proxy: &'a str,
        /// Max redirects (0 = do not follow).
        pub redirects: u32,
    }
    impl Default for HttpOptions<'_> { fn default() -> Self { todo!() } }
    /// Blocking HTTP request; TLS certificates are not verified (as the legacy client).
    pub fn http(method: &str, url: &str, headers: &[(&str, &str)], body: &[u8]) -> Result<HttpResult, String> { todo!() }
    pub fn http_with(method: &str, url: &str, headers: &[(&str, &str)], body: &[u8], o: &HttpOptions<'_>) -> Result<HttpResult, String> { todo!() }
    pub fn http_get(url: &str) -> Result<HttpResult, String> { todo!() }
    /// A WebSocket connection (not closed on drop: call [`WebSocket::close`]). No
    /// auto-reconnect: a dropped connection shows up as `recv` → Err.
    pub struct WebSocket;
    impl WebSocket {
        pub fn send_text(&self, s: &str) -> Result<(), String> { todo!() }
        pub fn send_binary(&self, b: &[u8]) -> Result<(), String> { todo!() }
        /// `timeout_ms < 0` blocks (`<= -2` drops stale frames, newest only);
        /// `Ok(None)` = timeout, Err = closed.
        pub fn recv(&self, timeout_ms: i64) -> Result<Option<WsFrame>, String> { todo!() }
        pub fn close(self) { todo!() }
    }
    /// A received frame.
    pub enum WsFrame {
        Text(String),
        Binary(Vec<u8>),
    }
    /// Options of [`ws_open_with`] (default = [`ws_open`]). The host sends the
    /// heartbeat and decompresses frames; reconnecting is up to the caller.
    #[derive(Default, Clone)]
    pub struct WsOptions<'a> {
        /// Handshake headers.
        pub headers: &'a [(&'a str, &'a str)],
        pub proxy: &'a str,
        /// Local outbound IP ("" = system default).
        pub local_ip: &'a str,
        /// Heartbeat period ms (0 = none).
        pub ping_interval_ms: u64,
        pub ping_payload: &'a str,
        /// true = heartbeat as a text frame (e.g. `"ping"`); false = protocol Ping.
        pub ping_text: bool,
        /// `abi::WS_COMP_GZIP` / `WS_COMP_DEFLATE` / `WS_COMP_RAW_DEFLATE`.
        pub compress: u8,
        /// Verify TLS certificates (default false).
        pub verify_cert: bool,
    }
    pub fn ws_open(url: &str) -> Result<WebSocket, String> { todo!() }
    pub fn ws_open_with(url: &str, o: &WsOptions<'_>) -> Result<WebSocket, String> { todo!() }
    /// Low-level host service call (`method`, JSON `args`) — escape hatch.
    pub fn call(method: &str, args: &str) -> Result<String, String> { todo!() }
}

/// `use sdk::ctx::EventExt;` / `use sdk::abi::*;` resolve as in a compiled strategy.
pub mod sdk {
    pub use super::{abi, ctx};
}

pub mod prelude {
    pub use super::{
        exchange, exchanges, params, Arg, Chart, KLineChart, DBExec, Decrypt, Decrypted, Dial, EnableLog, Encode, Error,
        __decrypt, EventLoop, GetChannelData, GetChannelDataOf, GetCommand, GetLastError, GetMeta, GetOS,
        Go, GoCall, TypedRoutine, AsyncRoutine, Hash, HMAC, HttpOption, IoArgs, ToF64,
        GetPid, HttpQuery, HttpQuery_Go, HttpResp, IsVirtual, LogProfit, LogProfitText, LogProfitReset, LogReset, LogVacuum, Mail, Mail_Go,
        Result, SendCommand, SetChannelData, SetErrorFilter, Sleep, StrDecode, SysInfo, ToArg, Unix, UnixNano,
        Version, _D, _T, JSONParse, MD5, UUID, _CDelay, _Cross, _N,
    };
    pub use super::{
        Account, Asset, DBResult, Data, Depth, Exchange, Funding, HttpRet, Index, JsonValue, Market, MarketOrder, Order,
        OrderCondition, OrderId, Position, Record, Ticker, Trade,
    };
    pub use super::{
        ORDER_CONDITION_TYPE_GENERIC, ORDER_CONDITION_TYPE_OCO, ORDER_CONDITION_TYPE_SL,
        ORDER_CONDITION_TYPE_TP, ORDER_OFFSET_CLOSE, ORDER_OFFSET_OPEN, ORDER_STATE_CANCELED,
        ORDER_STATE_CLOSED, ORDER_STATE_PENDING, ORDER_STATE_UNKNOWN, ORDER_TYPE_BUY,
        ORDER_TYPE_SELL, ORDER_TYPE_NONE, LOG_TYPE_BUY, LOG_TYPE_SELL, LOG_TYPE_CANCEL, LOG_TYPE_ERROR,
        LOG_TYPE_PROFIT, LOG_TYPE_LOG, LOG_TYPE_RESTART, PD_LONG, PD_LONG_YD, PD_SHORT, PD_SHORT_YD, PERIOD_D1, PERIOD_D3,
        PERIOD_H1, PERIOD_H12, PERIOD_H2, PERIOD_H4, PERIOD_H6, PERIOD_M1, PERIOD_M15, PERIOD_M3,
        PERIOD_M30, PERIOD_M5, PERIOD_W1, FUTURES_OP_SET_MARGIN, FUTURES_OP_SET_DIRECTION,
        FUTURES_OP_SET_CONTRACT_TYPE, FUTURES_OP_GET_POSITION, EXCHANGE_OP_IO_CONTROL,
    };
    pub use crate::{Log, LogStatus, Panic, _C, _G};
    pub use super::{TA, TAHelper, Ticks};
    pub use super::{BigDecimal, BigFloat, Decimal, ToDecimal};
    // The new-model primitives come with the prelude (legacy API and `ctx` can be mixed).
    pub use super::ctx;
}
