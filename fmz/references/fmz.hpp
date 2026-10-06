
using json = nlohmann::json;
using namespace std;
/** JSON 字面量后缀，将字符串解析为 json 对象（如 R"({"a":1})"_json） */
json operator""_json(const char* s, std::size_t n);

// ===========================================================================
// 平台常量（对应 lib.d.ts 中的 declare const / declare var）
// ===========================================================================

// K 线周期
constexpr int PERIOD_M1  = 60;
constexpr int PERIOD_M3  = 180;
constexpr int PERIOD_M5  = 300;
constexpr int PERIOD_M15 = 900;
constexpr int PERIOD_M30 = 1800;
constexpr int PERIOD_H1  = 3600;
constexpr int PERIOD_H2  = 7200;
constexpr int PERIOD_H4  = 14400;
constexpr int PERIOD_H6  = 21600;
constexpr int PERIOD_H12 = 43200;
constexpr int PERIOD_D1  = 86400;
constexpr int PERIOD_D3  = 259200;
constexpr int PERIOD_W1  = 604800;

// 订单状态
constexpr int ORDER_STATE_PENDING  = 0;
constexpr int ORDER_STATE_CLOSED   = 1;
constexpr int ORDER_STATE_CANCELED = 2;
constexpr int ORDER_STATE_UNKNOWN  = 3;

// 订单方向
constexpr int ORDER_TYPE_BUY  = 0;
constexpr int ORDER_TYPE_SELL = 1;

// 条件单类型
constexpr int ORDER_CONDITION_TYPE_OCO     = 0;
constexpr int ORDER_CONDITION_TYPE_TP      = 1;
constexpr int ORDER_CONDITION_TYPE_SL      = 2;
constexpr int ORDER_CONDITION_TYPE_GENERIC = 3;

// 开/平仓方向（期货）
constexpr int ORDER_OFFSET_OPEN  = 0;
constexpr int ORDER_OFFSET_CLOSE = 1;

// Log 类型
constexpr int LOG_TYPE_BUY    = 0;
constexpr int LOG_TYPE_SELL   = 1;
constexpr int LOG_TYPE_CANCEL = 2;

// 持仓方向（期货）
constexpr int PD_LONG     = 0;
constexpr int PD_SHORT    = 1;
constexpr int PD_LONG_YD  = 2;
constexpr int PD_SHORT_YD = 3;

// Futures 操作码
constexpr int FUTURES_OP_SET_MARGIN        = 0;
constexpr int FUTURES_OP_SET_DIRECTION     = 1;
constexpr int FUTURES_OP_SET_CONTRACT_TYPE = 2;
constexpr int FUTURES_OP_GET_POSITION      = 3;
constexpr int EXCHANGE_OP_IO_CONTROL       = 4;

// ===========================================================================
// 基础数据结构
// ===========================================================================

/** 带有效性标志的基类（对应 TBase） */
class TBase {
public:
    /** 数据是否有效（API 获取成功为 true，失败为 false） */
    bool Valid;
    /** 默认构造，Valid 初始为 false（无效数据） */
    TBase();
    /** 隐式判真，等价于判断 Valid 是否为 true */
    explicit operator bool() const;
    /** 是否为空/无效数据 */
    bool is_null() const;
    /** 是否为布尔型 */
    bool is_boolean() const;
};

/** 市场深度单条档位（对应 IMarketOrder） */
struct MarketOrder {
    /** 价格 */
    double Price;
    /** 数量 */
    double Amount;
};

/** K 线/蜡烛图数据（对应 IRecord） */
struct Record {
    /** K 线柱起始时间戳（毫秒） */
    uint64_t Time;
    /** 开盘价 */
    double   Open;
    /** 最高价 */
    double   High;
    /** 最低价 */
    double   Low;
    /** 收盘价 */
    double   Close;
    /** 成交量 */
    double   Volume;
};

/** 条件单参数（对应 ICondition） */
struct OrderCondition {
    int    ConditionType;     ///< ORDER_CONDITION_TYPE_*
    /** 止盈触发价格 */
    double TpTriggerPrice;
    /** 止盈下单价格（触发后以此价格下单） */
    double TpOrderPrice;
    /** 止损触发价格 */
    double SlTriggerPrice;
    /** 止损下单价格（触发后以此价格下单） */
    double SlOrderPrice;
};

// ===========================================================================
// 主要数据类（对应 lib.d.ts 中的 interface I*）
// ===========================================================================

/** 行情快照（对应 ITicker） */
class Ticker : public TBase {
public:
    /** 时间戳（毫秒） */
    uint64_t Time;
    /** 交易对符号 */
    string   Symbol;
    /** 开盘价 */
    double   Open;
    /** 24 小时最高价 */
    double   High;
    /** 24 小时最低价 */
    double   Low;
    double   Sell;   ///< 最优卖价
    double   Buy;    ///< 最优买价
    double   Last;   ///< 最新成交价
    /** 24 小时成交量 */
    double   Volume;
    /** 未平仓合约量/持仓量（期货） */
    double   OpenInterest;
    /** 交易所返回的原始 Ticker 数据 */
    json     Info;
};

/** 账户信息（对应 IAccount） */
class Account : public TBase {
public:
    /** 计价币可用余额（如 USDT；期货为可用保证金） */
    double Balance;
    /** 冻结的计价币余额 */
    double FrozenBalance;
    /** 交易币可用余额（如 BTC） */
    double Stocks;
    /** 冻结的交易币余额 */
    double FrozenStocks;
    /** 账户权益（期货，含未实现盈亏的总账户价值） */
    double Equity;
    /** 未实现盈亏（期货） */
    double UPnL;
    /** 交易所返回的原始账户数据 */
    json   Info;
};

/** 市场深度（对应 IDepth） */
class Depth : public TBase {
public:
    uint64_t Time;  ///< 深度快照时间(毫秒)，实盘有效；回测为 0
    vector<MarketOrder> Asks;  ///< 卖盘，价格升序
    vector<MarketOrder> Bids;  ///< 买盘，价格降序
    /** 交易所返回的原始深度数据 */
    json Info;
};

/** 资金费率（对应 IFunding） */
class Funding {
public:
    /** 结算时间戳（毫秒） */
    uint64_t Time;
    /** 资金费率，如 0.0001 表示万分之一 */
    double   Rate;
    /** 结算周期（秒） */
    unsigned int Interval;
    /** 交易对符号 */
    string   Symbol;
    /** 交易所返回的原始数据 */
    json     Info;
};

/** 持仓信息（对应 IPosition） */
class Position {
public:
    /** 杠杆倍数 */
    double MarginLevel;
    /** 持仓数量 */
    double Amount;
    /** 冻结数量（平仓挂单中的仓位） */
    double FrozenAmount;
    /** 持仓均价 */
    double Price;
    /** 占用保证金 */
    double Margin;
    /** 持仓浮动盈亏 */
    double Profit;
    unsigned int Type;  ///< PD_LONG / PD_SHORT / ...
    /** 交易对符号 */
    string Symbol;
    /** 合约类型，如 "swap"、"quarter" */
    string ContractType;
    /** 交易所返回的原始持仓数据 */
    json   Info;
};

/** 单笔成交记录（对应 ITrade） */
struct Trade {
    // TId — 此处简化为 string 方便使用
    /** 成交记录 ID */
    string   Id;
    /** 成交时间戳（毫秒） */
    uint64_t Time;
    /** 成交价格 */
    double   Price;
    /** 成交数量 */
    double   Amount;
    unsigned int Type;  ///< ORDER_TYPE_BUY / ORDER_TYPE_SELL
};

/** 单个资产余额（对应 IAsset） */
struct Asset {
    /** 币种名称，如 "BTC"、"USDT" */
    string Currency;
    /** 可用数量 */
    double Amount;
    /** 冻结数量 */
    double FrozenAmount;
};

/** 订单 ID（可为数字或字符串，对应 number | string） */
class TId : public TBase {
public:
    /** 数字形式的 ID（>0 时优先使用，否则用字符串 s） */
    uint64_t i64u;
    /** 字符串形式的 ID（i64u 为 0 时使用） */
    string   s;
    /** 默认构造，i64u 置 0 */
    TId();
    /** 赋值字符串 ID（清空 i64u，置 Valid） */
    void operator=(const string &v);
    /** 赋值字符串 ID（C 字符串，清空 i64u，置 Valid） */
    void operator=(const char *v);
    /** 赋值数字 ID（清空 s，置 Valid） */
    template<typename T> void operator=(const T &v);
    /** 相等比较：i64u 与 s 均相等 */
    bool operator==(const TId &v) const;
    /** 不等比较 */
    bool operator!=(const TId &v) const;
    /** 小于比较（i64u>0 比数字，否则比字符串 s） */
    bool operator<(const TId &v)  const;
    /** 大于比较（i64u>0 比数字，否则比字符串 s） */
    bool operator>(const TId &v)  const;
    /** 小于等于比较（i64u>0 比数字，否则比字符串 s） */
    bool operator<=(const TId &v) const;
    /** 大于等于比较（i64u>0 比数字，否则比字符串 s） */
    bool operator>=(const TId &v) const;
    /** 与字符串比较（i64u>0 时先转字符串再比） */
    bool operator==(const string &v) const;
    /** 与 C 字符串比较（i64u>0 时先转字符串再比） */
    bool operator==(const char *v)   const;
    /** 转字符串（i64u>0 返回其十进制字符串，否则返回 s） */
    operator string() const;
    /** 转数字类型，返回 i64u */
    template<typename T> operator T() const;
};

/** 订单（对应 IOrder） */
class Order : public TBase {
public:
    /** 订单 ID（字符串或数字，取决于交易所） */
    TId          Id;
    /** 订单创建时间戳（毫秒） */
    uint64_t     Time;
    /** 委托价格 */
    double       Price;
    /** 委托数量 */
    double       Amount;
    /** 已成交数量 */
    double       DealAmount;
    /** 成交均价 */
    double       AvgPrice;
    unsigned int Type;          ///< ORDER_TYPE_BUY / ORDER_TYPE_SELL
    unsigned int Offset;        ///< ORDER_OFFSET_OPEN / ORDER_OFFSET_CLOSE
    unsigned int Status;        ///< ORDER_STATE_*
    /** 交易对符号，如 "BTC_USDT" */
    string       Symbol;
    /** 合约类型（期货），如 "swap"、"quarter" */
    string       ContractType;
    /** 条件单信息（仅条件单有此字段） */
    OrderCondition Condition;
    /** 交易所返回的原始订单数据 */
    json         Info;

    /** 返回订单的可读字符串表示 */
    string repr();
};

// ===========================================================================
// 集合类型（TBase + vector<T>）
// ===========================================================================

class Assets    : public TBase, public vector<Asset>    {};
class Orders    : public TBase, public vector<Order>    {};
class Trades    : public TBase, public vector<Trade>    {};
class Tickers   : public TBase, public vector<Ticker>   {};
class Positions : public TBase, public vector<Position> {};
class Fundings  : public TBase, public vector<Funding>  {};

/** K 线集合，额外提供逐字段 vector 访问（对应 IRecord[]） */
class Records : public TBase, public vector<Record> {
public:
    /** 取出全部时间戳（毫秒）序列 */
    vector<uint64_t> Time();
    /** 取出全部开盘价序列 */
    vector<double>   Open();
    /** 取出全部最高价序列 */
    vector<double>   High();
    /** 取出全部最低价序列 */
    vector<double>   Low();
    /** 取出全部收盘价序列 */
    vector<double>   Close();
    /** 取出全部成交量序列 */
    vector<double>   Volume();
};

// ===========================================================================
// GoObj — 异步并发对象（对应 IGo）
// ===========================================================================

class GoObj {
public:
    /** 并发任务的内部协程 ID */
    uint64_t m_routineId;
    /** 期望结果对象的类型名（用于 wait 时类型校验） */
    string   m_typeName;

    /** 构造并发对象，记录结果类型名与协程 ID（一般由 Go 内部创建，不直接调用） */
    GoObj(string typeName, uint64_t routineId);

    /**
     * 等待异步任务完成，将结果填入 obj。
     * @param obj      接收结果的对象（类型须与创建时一致）
     * @param timeout  超时毫秒数，0 = 阻塞等待
     * @return true 成功，false 失败/超时
     */
    template<typename T>
    bool wait(T &obj, int timeout = 0);
};

// ===========================================================================
// Chart — 自定义图表（对应 IChart）
// 【首选】支持最全面的图表类型（折线/柱状/散点/面积/K线等，基于 Highcharts/Highstock
// 配置）。一般绘图请优先使用 Chart；仅当确实需要 Pine 风格 K 线/蜡烛图时才用 KLineChart。
// ===========================================================================

class Chart {
public:
    /** 创建/更新图表配置，传入 Highcharts 配置 JSON */
    explicit Chart(json obj);

    /** 更新图表配置 */
    void update(json obj);

    /** 向指定序列追加一个数据点 */
    void add(int seriesIdx, json d);

    /** 向指定序列在 replaceId 位置写入数据点 */
    void add(int seriesIdx, json d, int replaceId);

    /** 重置图表数据，保留最近 reverse 条 */
    void reset(uint64_t reverse = 0);
};

// ===========================================================================
// KLineChart — Pine 风格 K 线图（对应 JS KLineChart）
// 【专用】仅用于绘制 K 线/蜡烛图；一般绘图请优先使用 Chart（类型更全面）。
// 有状态的逐 bar 绘图：begin(bar) 开始一根 K 线，调用 plot/plotshape/... 累积，
// close() 把这根 bar 的 plots/signals 打包成 K 线推送。可选命名参数用 json 传入
// （JS/Pine 参数名），如 chart.plot(ma, {{"color","#ff0000"},{"title","MA"}})。
// ===========================================================================

class KLineChart {
public:
    /** 创建/替换 K 线图（注入 __isCandle:true；overlay:true 时叠加在 K 线上） */
    KLineChart(json options = json::object());

    /** 开始当前 bar，后续 Pine 调用累积到这根 bar 上 */
    void begin(const Record &bar);

    /** 重置图表，保留最近 remain 条 K 线 */
    void reset(uint64_t remain = 0);

    /** 把当前 bar（OHLCV + plots/signals）打包成 K 线推送 */
    void close();

    /** 折线/柱状图绘制数值序列；opts: title/color/linewidth/style/histbase/offset/join/display/overlay；返回 plot 索引(供 fill 用)，跳过返回 -1 */
    int plot(double value, json opts = json::object());

    /** 在 price 处画水平线；opts: title/color/linestyle/linewidth/display/overlay；返回 plot 索引 */
    int hline(double price, json opts = json::object());

    /** cond 为真时绘制图形标记；opts: style/location/title/color/text/textcolor/size/offset/overlay */
    void plotshape(bool cond, json opts = json::object());

    /** cond 为真时绘制单个字符；opts: char(必填)/location/color/text/textcolor/size/offset/overlay */
    void plotchar(bool cond, json opts = json::object());

    /** 按 value 绘制上/下箭头；opts: title/colorup/colordown/offset/minheight/maxheight/overlay */
    void plotarrow(double value, json opts = json::object());

    /** 用显式 OHLC 额外绘制一根 K 线；opts: title/color/wickcolor/bordercolor/overlay */
    void plotcandle(double open, double high, double low, double close, json opts = json::object());

    /** 给当前价格 bar 着色；opts: title/offset/show_last/display */
    void barcolor(string color, json opts = json::object());

    /** 给当前 bar 背景着色；opts: title/offset/show_last/display/overlay */
    void bgcolor(string color, json opts = json::object());

    /** 在两条已有 plot(plot/hline 返回的索引)之间填充；opts: color/show_last */
    void fill(int plot1, int plot2, json opts = json::object());

    /** 发出交易信号标记；direction: buy/long、sell/short、closebuy/closelong、closesell/closeshort；id 为空时默认取 direction */
    void signal(string direction, double price, double qty, string id = "");
};

// ===========================================================================
// Dial — 网络连接（对应 IDial）
// ===========================================================================

class Dial {
public:
    /** 连接是否建立成功 */
    bool     Valid;
    /** 底层连接文件描述符 */
    uint64_t fd;
    /** 连接是否已关闭 */
    bool     isClosed;

    /** 建立连接，addr 支持 tcp://, wss://, sqlite3://, kvdb:// 等协议 */
    Dial(string addr, uint64_t timeout = 30);

    /** 以 JSON options 建立连接 */
    Dial(string addr, json &options);

    /** 析构时自动关闭连接 */
    ~Dial();

    /** 读取数据，timeout=0 阻塞，>0 等待指定毫秒 */
    string read(uint64_t timeout = 0, bool *ptrIsClosed = nullptr);

    /** 发送数据，返回实际发送字节数 */
    uint64_t write(string buf, uint64_t timeout = 0);
    /**
    * 执行 SQL 语句（数据库连接）或 KVDB 操作（对应 IDial.exec()）
    * KVDB 支持命令：
    *   "get key"
    *   "set key value"
    *   "del key"
    *   "scan prefix limit"
    *   "range startKey endKey limit"
    * @param sql SQL 语句或 KVDB 命令，支持 ? 占位符参数化查询
    * @return 查询结果 JSON（含 columns 和 values 字段），失败返回 null JSON
    */
    template<typename... Arg>
    json exec(Arg &&...rest);
    /** 关闭连接 */
    void close();
};


// ===========================================================================
// Data 类（平台内部，GetData 的返回值）
// ===========================================================================

class Data : public TBase {
public:
    /** 数据时间戳（毫秒） */
    uint64_t Time;
    /** 数据内容（JSON） */
    json     Data;
};


// ===========================================================================
// Exchange — 交易所操作接口（对应 IExchange）
// ===========================================================================

class Exchange {
public:
    // ---- 基础信息 ----
    /** 获取交易所名称，如 "Binance" */
    string GetName();
    /** 获取交易所自定义标签（控制台配置的备注名） */
    string GetLabel();
    /** 获取当前交易对名称，如 "BTC_USDT" */
    string GetCurrency();
    /** 获取交易币（基础货币）名称，如 "BTC" */
    string GetBaseCurrency();
    /** 获取计价货币名称，如 "USDT" */
    string GetQuoteCurrency();
    /** 获取当前设置的 K 线周期（秒） */
    unsigned int GetPeriod();

    // ---- 配置 ----
    /** 设置代理服务器地址，如 "socks5://127.0.0.1:1080"，传 "" 清除 */
    void   SetProxy(string s);
    /** 切换当前交易对，如 "ETH_USDT" */
    void   SetCurrency(string s);
    /** 设置 REST API 请求超时时间（毫秒） */
    void   SetTimeout(double ms);
    /** 设置价格/数量小数精度，下单时自动截断到指定位数 */
    void   SetPrecision(int price, int amount);
    /** 设置汇率转换，所有价格自动乘以此汇率；传 1 取消转换 */
    void   SetRate(double rate);
    /** 获取当前设置的汇率值 */
    double GetRate();
    /** 获取美元兑人民币汇率 */
    double GetUSDCNY();
    /** 获取欧元兑人民币汇率 */
    double GetEURCNY();
    /** 设置 K 线最大缓存长度（默认 200 根） */
    void   SetMaxBarLen(unsigned int n);
    /** 获取当前 API 基础地址 */
    string GetBase();
    /** 设置交易所 API 基础地址，用于切换备用域名或测试网 */
    string SetBase(string s);
    /** 注册/写入自定义数据源 pair 的数据，供 GetData 读取 */
    int    SetData(string pair, json obj);

    // ---- 行情 ----
    /** 获取行情 Ticker，symbol 为空时取当前交易对 */
    Ticker   GetTicker(string symbol = "");
    /** 批量获取所有交易对的 Ticker 行情 */
    Tickers  GetTickers();
    /** 获取市场深度（订单簿），Asks 由低到高、Bids 由高到低 */
    Depth    GetDepth(string symbol = "");
    /** 获取最近成交记录 */
    Trades   GetTrades(string symbol = "");
    /** 获取资金费率（永续合约） */
    Fundings GetFundings(string symbol = "");
    /** 获取 K 线数据；customPeriod 周期(秒,-1 用默认)，limit 数量(0 用默认) */
    Records &GetRecords(int customPeriod = -1, int limit = 0);
    /** 获取指定交易对的 K 线数据；customPeriod 周期(秒)，limit 数量 */
    Records &GetRecords(string symbol, int customPeriod = -1, int limit = 0);
    /** 读取自定义数据源 pair 的数据；timeout 毫秒、offset 偏移 */
    Data     GetData(string pair, int timeout = 60000, int offset = 0);

    // ---- 账户 ----
    /** 获取账户信息（余额、冻结、权益等） */
    Account GetAccount();
    /** 获取账户所有资产信息 */
    Assets  GetAssets();

    // ---- 市场信息 ----
    /** 获取所有交易对的市场信息（精度、限制等），key 为交易对符号 */
    json GetMarkets();

    // ---- 现货下单 ----
    /** 买入下单(price, amount, ...)；price 传 -1 为市价单，返回订单 ID */
    template<typename... Arg> TId Buy(Arg &&...rest);
    /** 卖出下单(price, amount, ...)；price 传 -1 为市价单，返回订单 ID */
    template<typename... Arg> TId Sell(Arg &&...rest);
    /** 通用下单(symbol, side, price, amount, ...)，无需预先 SetDirection */
    template<typename... Arg> TId CreateOrder(Arg &&...rest);
    /** 修改已有订单的价格和数量 */
    template<typename... Arg> TId ModifyOrder(Arg &&...rest);

    /**
    * 获取最近一次 REST API 请求返回的原始 JSON 字符串（对应 GetRawJSON()）
    * 可用于调试和检查交易所原始响应数据
    * @return 原始 JSON 字符串
    */
    string GetRawJSON();
    // ---- 订单查询/撤销 ----
    /** 根据订单 ID 查询订单详情 */
    Order  GetOrder(const TId &id);
    /** 获取当前未完成的挂单列表 */
    Orders GetOrders(string symbol = "");
    /** 获取历史订单(已完成/已取消)；since 起始毫秒、limit 数量 */
    Orders GetHistoryOrders(string symbol = "", uint64_t since = 0, size_t limit = 0);
    /** 取消指定订单(id, ...)，成功返回 true */
    template<typename... Arg> bool CancelOrder(Arg &&...rest);

    // ---- 条件单 ----
    /** 创建条件单(止盈/止损等)，返回订单 ID */
    template<typename... Extra>
    TId   CreateConditionOrder(string symbol, string side, double amount,
                               OrderCondition condition, Extra &&...extra);
    /** 修改已有条件单的方向/数量/触发条件 */
    template<typename... Extra>
    TId   ModifyConditionOrder(const TId &orderId, string side, double amount,
                               OrderCondition condition, Extra &&...extra);
    /** 获取当前未触发的条件单列表 */
    Orders GetConditionOrders(string symbol = "");
    /** 获取历史条件单列表；since 起始毫秒、limit 数量 */
    Orders GetHistoryConditionOrders(string symbol = "", uint64_t since = 0, size_t limit = 0);
    /** 根据 ID 查询条件单详情 */
    Order  GetConditionOrder(const TId &id);
    /** 取消指定条件单(id, ...)，成功返回 true */
    template<typename... Arg> bool CancelConditionOrder(Arg &&...rest);

    // ---- 期货专用 ----
    /** 获取当前持仓列表（期货） */
    Positions GetPositions(string symbol = "");
    /** 获取当前持仓列表（期货，GetPositions 的别名） */
    Positions GetPosition();
    void      SetDirection(string s);  ///< "buy"/"sell"/"closebuy"/"closesell"。不推荐：优先用 CreateOrder 直接指定 side
    /** 设置杠杆倍数（期货） */
    void      SetMarginLevel(double v);
    /** 设置指定合约的杠杆倍数（期货） */
    void      SetMarginLevel(string symbol, double v);
    /** 设置合约类型（期货），如 "swap"、"quarter"；交易前必须先设置 */
    json      SetContractType(string v);
    /** 获取当前设置的合约类型（期货） */
    string    GetContractType();

    // ---- 工具 ----
    /** 发送任意 API 请求(IO 控制)，调用交易所未封装的接口 */
    template<typename... Arg> json IO(Arg &&...rest);
    /** 输出交易日志(orderType, price, amount, ...)到该交易所日志 */
    template<typename... Arg> void Log(Arg &&...rest);
    /** 计算 HMAC 签名；algo 哈希算法、outAlgo 输出编码、data 数据、key 密钥 */
    string HMAC(string algo, string outAlgo, string data, string key);
    /** 哈希/HMAC/编码计算（同全局 Encode，但 key 支持 "{{accesskey}}"/"{{secretkey}}" 模板替换） */
    string Encode(string algo, string inputFormat, string outputFormat, string data, string keyFormat = "", string key = "");

    // ---- 异步并发 ----
    /** 创建并发任务，异步调用交易所方法 opCode；不阻塞，返回 GoObj 供 wait */
    template<typename... Arg> GoObj Go(string opCode, Arg &&...rest);
    /** 创建并发任务，异步调用无参交易所方法 opCode，返回 GoObj 供 wait */
    GoObj Go(string opCode);
};

namespace strategy {
    /** 默认（第一个）交易所对象，可用别名 exchange 直接访问 */
    extern Exchange exchange;
}
/** 全部交易所对象列表，按配置顺序排列 */
extern vector<Exchange> exchanges;

// 别名，与 TypeScript 侧保持一致
#define exchange strategy::exchange

// ===========================================================================
// 全局函数
// ===========================================================================

// ---- 日志 ----

/** 输出普通日志（对应 Log()） */
template<typename... Arg> void Log(Arg &&...rest);

/** 任意参数序列化为字符串（平台内置全局函数，如 to_string(order.Id)） */
template<typename... Arg> string to_string(Arg &&...rest);

/** 输出错误日志（对应 LogError/console.error） */
template<typename... Arg> void LogError(Arg &&...rest);

/** 设置状态栏显示内容（对应 LogStatus()） */
template<typename... Arg> void LogStatus(Arg &&...rest);

/** 记录收益数据（对应 LogProfit()） */
template<typename... Arg> void LogProfit(Arg &&...rest);

/** 重置日志，保留最近 reverse 条（对应 LogReset()） */
void LogReset(int reverse = 0);

/** 重置收益日志，保留最近 reverse 条（对应 LogProfitReset()） */
void LogProfitReset(int reverse = 0);

/** 对策略数据库执行 VACUUM（对应 LogVacuum()） */
void LogVacuum();

/** 开/关日志记录（对应 EnableLog()） */
void EnableLog(bool isEnable);

// ---- 流程控制 ----

/**
 * 暂停 ms 毫秒
 */
void Sleep(double ms);

/** 获取平台版本（对应 Version()） */
string Version();

/** 是否在回测环境中（对应 IsVirtual()） */
bool IsVirtual();

// ---- 时间 ----

/** 纳秒级时间戳（对应 UnixNano()） */
uint64_t UnixNano();

/** 秒级时间戳（对应 Unix()） */
uint64_t Unix();

/**
 * 格式化时间戳为可读字符串（对应 _D()）
 * @param ts  毫秒时间戳，0 表示当前时间
 * @param fmt strftime 格式串，默认 "%Y-%m-%d %H:%M:%S"
 */
string _D(uint64_t ts = 0, const char *fmt = "%Y-%m-%d %H:%M:%S");

// ---- 系统信息 ----

/** 获取操作系统/架构字符串，如 "linux/amd64"（对应 GetOS()） */
string GetOS();

/** 获取当前进程 PID（对应 GetPid()） */
uint64_t GetPid();

// ---- 网络 ----

/**
 * 发送 HTTP 请求（对应 HttpQuery()）
 * @param addr     请求 URL
 * @param options  可选的 JSON 选项对象指针（method/body/headers 等）
 * @return 响应体字符串，失败返回空字符串
 */
string HttpQuery(string addr, json *options = nullptr);

/** 发邮件（对应 Mail()） */
bool Mail(string smtpHost, string username, string password,
          string toEmail, string subject, string body);

// ---- 平台交互 ----

/** 设置错误过滤正则（对应 SetErrorFilter()） */
void SetErrorFilter(string filter);

/** 发布跨策略通信数据（对应 SetChannelData()） */
void SetChannelData(string s);

/** 读取跨策略通信数据（对应 GetChannelData()） */
string GetChannelData();

/** 获取机器人元数据（对应 GetMeta()） */
string GetMeta();

/** 获取交互指令（对应 GetCommand()） */
string GetCommand();

/**
 * 等待下一个事件（对应 EventLoop()）
 * 返回事件 JSON 字符串，超时返回空字符串
 */
string EventLoop(double timeout = 0);

// ---- 加密/编码 ----

/** MD5 哈希（对应 MD5()） */
string MD5(string s);

/**
 * 通用编码/签名函数（对应 Encode()）
 * algo: "hmac_sha256"/"sha256"/"aes256-cbc" 等
 */
string Encode(string algo, string inputFormat, string outputFormat,
              string data, string keyFormat = "", string key = "");

/** 字符集解码（平台扩展函数，非 TS 标准） */
string StrDecode(string s, string code = "gbk");

// ---- 数据库 ----

/**
 * 执行 SQLite SQL 语句（对应 DBExec()）
 * 返回查询结果 JSON（含 columns 和 values 字段），失败返回 null JSON
 */
template<typename... Arg>
json DBExec(Arg &&...rest);

// ---- 工具函数 ----

/** 生成 UUID（对应 UUID()） */
string UUID();

/** JSON 解析（对应 JSONParse()） */
json JSONParse(string s);

/**
 * 数字精度截断（对应 _N()）
 * 向下截断到 precision 位小数，不四舍五入
 */
double _N(double n, double precision = 4);

/**
 * 翻译函数（对应 _T()）
 * 返回 "[trans]a|b[/trans]" 格式字符串
 */
string _T(string a, string b = "");

/**
 * 判断两条均线是否交叉（对应 _Cross()）
 * 返回正数=金叉，负数=死叉，0=无交叉
 */
long _Cross(vector<double> &a, vector<double> &b);

/** KV 持久化存储：读取键值（对应 _G(k)） */
const json _G(string k);

/** KV 持久化存储：写入/删除键值（对应 _G(k, v)，v 为 null 时删除） */
void _G(string k, const json &v);

/** KV 持久化存储：清空全部（对应 _G(null)） */
void _G(void *ptr);

/** 抛出异常并终止策略（对应 Panic()） */
template<typename... Arg>
void Panic(Arg &&...rest);

/**
 * 容错重试宏（对应 _C(fn, args...)）
 * 持续调用 P(...) 直到返回非 null/非 false 的有效值
 */
#define _C(P, ...) (P(__VA_ARGS__))

/** printf 风格字符串格式化，按 format 与可变参数生成字符串 */
template <typename... Args>
string str_format(const std::string &format, Args... args);

/**
 * 获取最近一次错误信息并清除（对应 GetLastError()）
 * @return 错误信息字符串，无错误时返回空字符串
 */
string GetLastError();

/**
 * 获取系统信息（对应 SysInfo()）
 * @param attr 信息类型：
 *   "pid"      当前进程 ID
 *   "ppid"     父进程 ID
 *   "ncpu"     CPU 核心数
 *   "arch"     CPU 架构，如 "amd64"
 *   "os"       操作系统，如 "linux"
 *   "sys_cpu"  系统 CPU 使用率(%)
 *   "sys_mem"  系统内存信息
 *   "cpu"      当前进程 CPU 使用率
 *   "mem"      当前进程内存使用量
 *   "threads"  当前进程线程数
 * @return 对应的系统信息值
 */
json SysInfo(string attr);

/**
 * 异步发送邮件，不阻塞当前线程（对应 Mail_Go()）
 * 参数同 Mail()
 */
bool Mail_Go(string smtpHost, string username, string password, string toEmail, string subject, string body);

/**
 * 设置 _C 宏的重试间隔（对应 _CDelay()）
 * @param n 延迟毫秒数，传入正数生效
 */
void _CDelay(double n);