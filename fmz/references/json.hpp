// Strategy SDK API stub (clangd autocomplete + AI context). The whole API
// (exchange, exchanges, TA, talib, Log/LogStatus/LogProfit/_G/_N, json, ...) is
// auto-included into every strategy — strategy code needs no #include for it.
#ifndef NLOHMANN_JSON_HPP_STUB
#define NLOHMANN_JSON_HPP_STUB

#include <cstddef>
#include <cstdint>
#include <string>
#include <vector>
#include <map>
#include <memory>
#include <initializer_list>
#include <iosfwd>
#include <tuple>
#include <type_traits>
#include <utility>

// ---- 官方 ABI 宏 ----
#define NLOHMANN_JSON_VERSION_MAJOR 3
#define NLOHMANN_JSON_VERSION_MINOR 12
#define NLOHMANN_JSON_VERSION_PATCH 0

#ifndef NLOHMANN_JSON_NAMESPACE_BEGIN
#define NLOHMANN_JSON_NAMESPACE_BEGIN namespace nlohmann {
#endif
#ifndef NLOHMANN_JSON_NAMESPACE_END
#define NLOHMANN_JSON_NAMESPACE_END }
#endif

NLOHMANN_JSON_NAMESPACE_BEGIN

template<typename T = void, typename SFINAE = void>
struct adl_serializer;

template<class Key, class T, class IgnoredLess, class Allocator>
struct ordered_map;

// ---- items() 键值迭代代理（与官方 nlohmann::detail 同名同形，声明即可） ----
namespace detail {

template<typename BasicJsonType>
class iteration_proxy_value {
public:
    const std::string &key() const;
    BasicJsonType &value() const;
    iteration_proxy_value &operator*();
    iteration_proxy_value &operator++();
    bool operator==(const iteration_proxy_value &) const;
    bool operator!=(const iteration_proxy_value &) const;
};

template<typename BasicJsonType>
class iteration_proxy {
public:
    iteration_proxy_value<BasicJsonType> begin() const noexcept;
    iteration_proxy_value<BasicJsonType> end() const noexcept;
};

// 结构化绑定 auto &[k, v] 依赖的 get<N>
template<std::size_t N, typename BasicJsonType, typename std::enable_if<N == 0, int>::type = 0>
const std::string &get(const iteration_proxy_value<BasicJsonType> &v);
template<std::size_t N, typename BasicJsonType, typename std::enable_if<N == 1, int>::type = 0>
BasicJsonType &get(const iteration_proxy_value<BasicJsonType> &v);

} // namespace detail

template<
    template<typename U, typename V, typename... Args> class ObjectType   = std::map,
    template<typename U, typename... Args>             class ArrayType    = std::vector,
    class StringType         = std::string,
    class BooleanType        = bool,
    class NumberIntegerType  = std::int64_t,
    class NumberUnsignedType = std::uint64_t,
    class NumberFloatType    = double,
    template<typename U>   class AllocatorType   = std::allocator,
    template<typename T, typename SFINAE = void> class JSONSerializer = adl_serializer,
    class BinaryType         = std::vector<std::uint8_t>,
    class CustomBaseClass    = void
>
class basic_json {
public:
    using value_type      = basic_json;
    using reference       = basic_json &;
    using const_reference = const basic_json &;
    using size_type       = std::size_t;
    using difference_type = std::ptrdiff_t;
    using string_t        = StringType;
    using boolean_t       = BooleanType;
    using number_integer_t  = NumberIntegerType;
    using number_unsigned_t = NumberUnsignedType;
    using number_float_t    = NumberFloatType;

    // ---- 迭代器（占位） ----
    struct iterator {
        basic_json *ptr;
        basic_json &operator*();
        basic_json *operator->();
        iterator   &operator++();
        bool operator!=(const iterator &) const;
        bool operator==(const iterator &) const;
    };
    struct const_iterator {
        const basic_json *ptr;
        const basic_json &operator*();
        const basic_json *operator->();
        const_iterator   &operator++();
        bool operator!=(const const_iterator &) const;
        bool operator==(const const_iterator &) const;
    };

    // ---- 异常 ----
    class parse_error : public std::exception {
    public:
        int id; std::size_t byte;
        const char *what() const noexcept override;
    };
    class type_error   : public std::exception { public: int id; const char *what() const noexcept override; };
    class out_of_range : public std::exception { public: int id; const char *what() const noexcept override; };
    class other_error  : public std::exception { public: int id; const char *what() const noexcept override; };

    // ---- 构造 ----
    basic_json() noexcept;
    basic_json(std::nullptr_t) noexcept;
    basic_json(bool v) noexcept;
    basic_json(int v) noexcept;
    basic_json(unsigned int v) noexcept;
    basic_json(std::int64_t v) noexcept;
    basic_json(std::uint64_t v) noexcept;
    basic_json(long v) noexcept;          // 使 NULL(__null, long 0) 有精确匹配，如 _G("k", NULL)
    basic_json(unsigned long v) noexcept;
    basic_json(double v) noexcept;
    basic_json(float v) noexcept;
    basic_json(const char *v);
    basic_json(const std::string &v);
    basic_json(std::string &&v);
    basic_json(std::initializer_list<basic_json> init);
    template<typename T> basic_json(const std::vector<T> &v);
    template<typename K, typename V> basic_json(const std::map<K, V> &v);
    basic_json(const basic_json &other);
    basic_json(basic_json &&other) noexcept;
    ~basic_json();

    // ---- 赋值 ----
    basic_json &operator=(const basic_json &other);
    basic_json &operator=(basic_json &&other) noexcept;
    basic_json &operator=(std::nullptr_t) noexcept;
    basic_json &operator=(bool v) noexcept;
    basic_json &operator=(int v) noexcept;
    basic_json &operator=(unsigned int v) noexcept;
    basic_json &operator=(std::int64_t v) noexcept;
    basic_json &operator=(std::uint64_t v) noexcept;
    basic_json &operator=(long v) noexcept;
    basic_json &operator=(unsigned long v) noexcept;
    basic_json &operator=(double v) noexcept;
    basic_json &operator=(float v) noexcept;
    basic_json &operator=(const char *v);
    basic_json &operator=(const std::string &v);
    basic_json &operator=(std::string &&v);

    // ---- 工厂 ----
    static basic_json object();
    static basic_json array();
    static basic_json parse(const std::string &s, bool allow_exceptions = true);
    static basic_json parse(const char *s,        bool allow_exceptions = true);

    // ---- 序列化 ----
    std::string dump(int indent = -1, char indent_char = ' ', bool ensure_ascii = false) const;

    // ---- 类型判断 ----
    bool is_null()            const noexcept;
    bool is_boolean()         const noexcept;
    bool is_number()          const noexcept;
    bool is_number_integer()  const noexcept;
    bool is_number_unsigned() const noexcept;
    bool is_number_float()    const noexcept;
    bool is_string()          const noexcept;
    bool is_array()           const noexcept;
    bool is_object()          const noexcept;
    bool is_structured()      const noexcept;
    bool is_primitive()       const noexcept;
    bool is_discarded()       const noexcept;

    // ---- 类型转换 ----
    template<typename T> T get() const;
    template<typename T> T value(const std::string &key, const T &default_value) const;
    template<typename T> T value(const char *key,        const T &default_value) const;

    operator bool()             const;
    operator int()              const;
    operator unsigned int()     const;
    operator std::int64_t()     const;
    operator std::uint64_t()    const;
    operator long()             const;
    operator unsigned long()    const;
    operator double()           const;
    operator float()            const;
    // string 隐式，支持 string s = j["key"]
    operator std::string() const;

    // ---- 下标访问 ----
    basic_json       &operator[](const std::string &key);
    const basic_json &operator[](const std::string &key) const;
    basic_json       &operator[](const char *key);
    const basic_json &operator[](const char *key) const;
    basic_json       &operator[](size_type idx);
    const basic_json &operator[](size_type idx) const;
    basic_json       &operator[](int idx);
    const basic_json &operator[](int idx) const;

    basic_json       &at(const std::string &key);
    const basic_json &at(const std::string &key) const;
    basic_json       &at(size_type idx);
    const basic_json &at(size_type idx) const;

    // ---- 容器操作 ----
    size_type size()  const noexcept;
    bool      empty() const noexcept;
    void      clear() noexcept;
    void push_back(const basic_json &val);
    void push_back(basic_json &&val);
    template<typename... Args> void emplace_back(Args &&...args);
    basic_json &back();
    basic_json &front();
    void      erase(const std::string &key);
    void      erase(size_type idx);
    bool      contains(const std::string &key) const;
    bool      contains(const char *key)        const;
    size_type count(const std::string &key)    const;
    iterator       find(const std::string &key);
    const_iterator find(const std::string &key) const;
    iterator       find(const char *key);
    const_iterator find(const char *key)        const;

    // ---- 比较：等于/不等于 ----
#define _JSON_EQ(T) \
    bool operator==(T rhs) const noexcept; \
    bool operator!=(T rhs) const noexcept;

    _JSON_EQ(const basic_json &)
    _JSON_EQ(std::nullptr_t)
    _JSON_EQ(bool)
    _JSON_EQ(int)
    _JSON_EQ(unsigned int)
    _JSON_EQ(std::int64_t)
    _JSON_EQ(std::uint64_t)
    _JSON_EQ(long)
    _JSON_EQ(unsigned long)
    _JSON_EQ(double)
    _JSON_EQ(float)
    _JSON_EQ(const char *)
    _JSON_EQ(const std::string &)
#undef _JSON_EQ

    // ---- 比较：大小 ----
#define _JSON_CMP(T) \
    bool operator< (T rhs) const noexcept; \
    bool operator> (T rhs) const noexcept; \
    bool operator<=(T rhs) const noexcept; \
    bool operator>=(T rhs) const noexcept;

    _JSON_CMP(const basic_json &)
    _JSON_CMP(int)
    _JSON_CMP(unsigned int)
    _JSON_CMP(std::int64_t)
    _JSON_CMP(std::uint64_t)
    _JSON_CMP(long)
    _JSON_CMP(unsigned long)
    _JSON_CMP(double)
    _JSON_CMP(float)
#undef _JSON_CMP

    // ---- 迭代器 ----
    iterator       begin()        noexcept;
    iterator       end()          noexcept;
    const_iterator begin()  const noexcept;
    const_iterator end()    const noexcept;
    const_iterator cbegin() const noexcept;
    const_iterator cend()   const noexcept;

    // ---- items()：键值对迭代 ----
    // for (auto &el : j.items()) { el.key(); el.value(); }
    // for (auto &[key, value] : j.items()) { ... }
    detail::iteration_proxy<basic_json>       items() noexcept;
    detail::iteration_proxy<const basic_json> items() const noexcept;

    // ---- 流 ----
    friend std::ostream &operator<<(std::ostream &os, const basic_json &j);
    friend std::istream &operator>>(std::istream &is, basic_json &j);

    // ---- 其他 ----
    std::string type_name() const noexcept;
    basic_json  flatten()   const;
    basic_json  unflatten() const;
    std::size_t get_allocator() const; // placeholder
};

// ---- 官方类型别名（与 json_fwd.hpp 完全一致） ----
using json         = basic_json<>;
using ordered_json = basic_json<nlohmann::ordered_map>;


// ---- 全局反向比较 ----
inline bool operator==(std::nullptr_t, const json &j) noexcept { return j.is_null(); }
inline bool operator!=(std::nullptr_t, const json &j) noexcept { return !j.is_null(); }

// 标量在左的对称比较（官方 nlohmann 为 friend 对称重载，stub 补常用标量）
#define _JSON_EQ_REV(T) \
inline bool operator==(T lhs, const json &j) noexcept { return j == lhs; } \
inline bool operator!=(T lhs, const json &j) noexcept { return j != lhs; }

_JSON_EQ_REV(bool)
_JSON_EQ_REV(int)
_JSON_EQ_REV(unsigned int)
_JSON_EQ_REV(std::int64_t)
_JSON_EQ_REV(std::uint64_t)
_JSON_EQ_REV(long)
_JSON_EQ_REV(unsigned long)
_JSON_EQ_REV(double)
_JSON_EQ_REV(float)
_JSON_EQ_REV(const char *)
_JSON_EQ_REV(const std::string &)
#undef _JSON_EQ_REV

NLOHMANN_JSON_NAMESPACE_END

// ---- items() 结构化绑定支持（同官方 nlohmann/json 的 std 特化） ----
namespace std {
template<typename BasicJsonType>
struct tuple_size<::nlohmann::detail::iteration_proxy_value<BasicJsonType>>
    : integral_constant<size_t, 2> {};
template<size_t N, typename BasicJsonType>
struct tuple_element<N, ::nlohmann::detail::iteration_proxy_value<BasicJsonType>> {
    using type = decltype(get<N>(declval<::nlohmann::detail::iteration_proxy_value<BasicJsonType>>()));
};
} // namespace std

#endif // NLOHMANN_JSON_HPP_STUB