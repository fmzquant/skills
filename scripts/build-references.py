#!/usr/bin/env python3
"""Rebuild the generated reference files in this repository.

Inputs (all public or in the platform's own repositories):
  - API docs / user guide, either of
      * the website's SSR data endpoints
            https://www.fmz.com/lang/en/syntax-guide.data   https://www.fmz.com/lang/zh/syntax-guide.data
            https://www.fmz.com/lang/en/user-guide.data     https://www.fmz.com/lang/zh/user-guide.data
        (react-router .data = turbo-stream JSON; the doc tree is the JSON string after the key
        "syntaxGuide" / "userGuide"), or
      * the merged doc-tree JSON the site is built from (a path ending in `.json`, loaded as-is),
        e.g. doc/docs/fmz/syntax/syntax_{en_US,zh_CN}.json and doc/docs/fmz/guide/guide_{en_US,zh_CN}.json
    →  fmz/references/api.{en,zh}.md, fmz/references/user-guide.{en,zh}.md,
       fmz/references/rest-api.md (the English user guide's "Extended API Interface" section)
  - MCP tool table: dumped from the server (`mcpToolTable`, JSON with scope + mcp.Tool)
        → fmz/references/tools.md
  - talib descriptions: botvs misc/helper/talib/api_gen.js (`talibInfo`)   → fmz/references/talib.md
  - Pine built-ins: botvs backtest/pinescript/src/lib_*.js (`scope.register`) → fmz/references/pine-builtins.md
  - MyLanguage dictionary: botvs misc/helper/my/trans_dic.txt            → fmz/references/mylanguage-functions.md
  - Declaration files are copied verbatim from botvs misc/helper/gen_helper/ (js .d.ts, python .pyi,
    rust types.rs) and fmz/client/sdk/docs/typings/js/ (newest .d.ts, ctx.d.ts, EVENTS.md).

Usage:
  build-references.py docs  <syntax-guide.data|syntax_*.json> <lang> <out.md>      # lang = en | zh
  build-references.py guide <user-guide.data|guide_*.json> <lang> <out.md>
  build-references.py rest  <user-guide.data|guide_en_US.json> <out.md>             # English guide only
  build-references.py tools <mcp_tools.json> <out.md>
  build-references.py talib <api_gen.js> <out.md>
  build-references.py pine  <pinescript/src dir> <out.md>
  build-references.py my    <trans_dic.txt> <out.md>
"""
import glob, json, os, re, sys

SITE = "https://www.fmz.com"
REF = re.compile(r"\{@([^\s{}]+)\s+([^{}]+)\}")

def clean(s):
    if not isinstance(s, str): return ""
    s = REF.sub(lambda m: "`" + m.group(2).strip() + "`", s)
    s = s.replace("](/upload/", "](" + SITE + "/upload/")
    return s.strip()

def aslist(x):
    if x is None or x == "": return []
    return x if isinstance(x, list) else [x]

def val(x):
    if isinstance(x, dict):
        for k in ("value", "info"):
            if k in x: return clean(x[k])
        return clean(json.dumps(x, ensure_ascii=False))
    return clean(x)

def load(path, key):
    data = json.load(open(path, encoding="utf-8"))
    if path.endswith(".json"):  # merged doc tree: already the array the .data embeds after `key`
        return data
    return json.loads(data[data.index(key) + 1])

def para(label, x):
    """A field that is either a list of items or one string; a string is one paragraph, kept as written."""
    return [f"{label}:", "", clean(x), ""] if isinstance(x, str) and x.strip() else []

def leaf_md(n, level):
    out = [f"{'#'*level} {clean(n.get('title',''))}", ""]
    if n.get("syntax"):
        out += ["```", *[val(s) for s in aslist(n["syntax"])], "```", ""]
    if n.get("forms"):
        out += ["Forms:", "", *[f"- `{val(f)}`" for f in aslist(n["forms"])], ""]
    for d in aslist(n.get("desc")):
        out += [val(d), ""]
    if isinstance(n.get("args"), str):
        out += para("Parameters", n["args"])
    elif n.get("args"):
        out += ["Parameters:", ""]
        for a in n["args"]:
            if not isinstance(a, dict): out += [f"- {val(a)}"]; continue
            req = "required" if a.get("required") else "optional"
            out += [f"- `{a.get('name','')}` ({a.get('type','')}, {req}): {val(a.get('info',''))}"]
        out += [""]
    if isinstance(n.get("attrs"), str):
        out += para("Fields", n["attrs"])
    elif n.get("attrs"):
        out += ["Fields:", ""]
        for a in n["attrs"]:
            if isinstance(a, dict): out += [f"- `{a.get('name','')}` ({a.get('type','')}): {val(a.get('info',''))}"]
        out += [""]
    if isinstance(n.get("returns"), str):
        out += para("Returns", n["returns"])
    for r in [] if isinstance(n.get("returns"), str) else n.get("returns") or []:
        if isinstance(r, dict): out += [f"Returns ({clean(r.get('type',''))}): {val(r.get('info',''))}", ""]
        else: out += [f"Returns: {val(r)}", ""]
    for ex in aslist(n.get("examples")):
        if isinstance(ex, dict):
            if ex.get("value"): out += [val(ex["value"]), ""]
            for e in ex.get("examples") or []:
                if isinstance(e, dict) and e.get("code"):
                    out += [f"```{e.get('lang','')}", e["code"].rstrip(), "```", ""]
        else: out += [val(ex), ""]
    for r in aslist(n.get("remarks")):
        out += [val(r), ""]
    if n.get("seeAlso"):
        out += ["See also: " + "; ".join(val(s) for s in aslist(n["seeAlso"])), ""]
    return out

def walk(n, level, out):
    if isinstance(n, list):
        for c in n: walk(c, level, out)
        return
    kids = n.get("children") or []
    if n.get("isChildren"):
        level = min(level + 1, 6)
    if kids:
        out += [f"{'#'*level} {clean(n.get('title',''))}", ""]
        for d in aslist(n.get("desc")): out += [val(d), ""]
        for c in kids: walk(c, min(level + 1, 6), out)
    else:
        out += leaf_md(n, min(level, 6))

def convert(path, key, title, intro):
    tree = load(path, key)
    out = [f"# {title}", "", intro, ""]
    walk(tree, 2, out)
    return "\n".join(out).replace("\n\n\n", "\n\n")

REST_SECTION = "Extended API Interface"
REST_INTRO = ("Same API keys as MCP (website: `/m/account#apikey`). For REST the key's privileges are method names or `*` "
              "(scope names only apply to MCP). Prefer the MCP tools when they are available; this is for scripts, cron jobs "
              "and older integrations. Below is the user guide's section, verbatim: creating a key, the request format and "
              "signature, every method, the return codes and the robot status codes.")

def find(n, title):
    if isinstance(n, list):
        for c in n:
            r = find(c, title)
            if r: return r
        return None
    if clean(n.get("title", "")) == title: return n
    return find(n.get("children") or [], title)

def build_rest(src, dst):
    sec = find(load(src, "userGuide"), REST_SECTION)
    if not sec: sys.exit(f"{src}: no section titled {REST_SECTION!r} (English user guide expected)")
    out = [f"# FMZ extended REST API (generated from the user guide, section \u201c{REST_SECTION}\u201d)", "", REST_INTRO, ""]
    for d in aslist(sec.get("desc")): out += [val(d), ""]
    for c in sec.get("children") or []: walk(c, 2, out)
    open(dst, "w", encoding="utf-8").write("\n".join(out).replace("\n\n\n", "\n\n"))


TITLES = {
    ("docs", "en"): ("FMZ strategy API reference", "Generated from the platform's syntax guide (https://www.fmz.com/syntax-guide). Every built-in function, structure and constant, with examples in JavaScript, Python and Rust. Search this file by function name (e.g. `exchange.GetTicker`)."),
    ("docs", "zh"): ("FMZ 策略 API 参考", "由平台语法指南（https://www.fmz.com/syntax-guide）生成：全部内置函数、结构体与常量，示例覆盖 JavaScript、Python、Rust。按函数名（如 `exchange.GetTicker`）在本文件内搜索。"),
    ("guide", "en"): ("FMZ platform user guide", "Generated from https://www.fmz.com/user-guide: how the platform works (nodes, robots, strategies, templates, backtesting, extended API, MCP), as written for people; agents use it for concepts and limits."),
    ("guide", "zh"): ("FMZ 平台使用指南", "由 https://www.fmz.com/user-guide 生成：平台如何运作（托管者、实盘、策略、模板、回测、扩展 API、MCP），面向人写的说明；agent 用它理解概念与限制。"),
}

def build_tools(src, dst):
    d = json.load(open(src, encoding="utf-8"))
    order = ["read", "backtest", "write", "trade", "danger"]
    desc = {"read": "List/inspect; results never contain secrets.", "backtest": "Start, poll, stop cloud backtests.",
            "write": "Save strategies and versions, groups, alert switches, edit stopped robots.",
            "trade": "Create/start/stop robots and send them commands: spends balance and places real orders. Confirm with the user first.",
            "danger": "Delete strategies/robots/nodes, publish strategies. Never included in a key by default; confirm with the user first."}
    out = ["# FMZ MCP tools (generated from the server's tool table)", "",
           "Every tool the `fmz` MCP server exposes to agents, grouped by scope. A key's privileges decide which scopes are visible in `tools/list`: an empty privilege list means read+backtest+write+trade; `danger` must be granted explicitly. Parameters marked (required) must be present.", ""]
    def schema_lines(sch, indent=0):
        props = sch.get("properties") or {}; req = set(sch.get("required") or []); lines = []
        for name, p in props.items():
            t = p.get("type", "any")
            if "enum" in p: t += " one of " + "/".join(map(str, p["enum"]))
            if t == "array" and isinstance(p.get("items"), dict): t = "array of " + p["items"].get("type", "any")
            lines.append(f"{'  '*indent}- `{name}` ({t}{', required' if name in req else ''}): {p.get('description','')}".rstrip(": "))
            if t.startswith("array of object") and p["items"].get("properties"): lines += schema_lines(p["items"], indent + 1)
            elif p.get("type") == "object" and p.get("properties"): lines += schema_lines(p, indent + 1)
        return lines
    for sc in order:
        out += [f"## scope `{sc}`", "", desc[sc], ""]
        for r in d["tools"]:
            if r["scope"] != sc: continue
            t = r["tool"]; out += [f"### {t['name']}", "", t["description"], ""]
            ls = schema_lines(t.get("inputSchema") or {}); out += (ls + [""]) if ls else ["(no parameters)", ""]
    out += ["## Legacy raw names", "", "These older method names stay callable for existing integrations but are not listed in `tools/list`: " + ", ".join(f"`{x}`" for x in d["legacy"]) + ".", ""]
    out += ["## Strategy languages", "", "`language` values: " + ", ".join(f"`{x}`" for x in d["langs"]) + ".", ""]
    open(dst, "w", encoding="utf-8").write("\n".join(out))

def build_talib(src, dst):
    m = re.search(r"var talibInfo = (\[[\s\S]*?\]);", open(src, encoding="utf-8").read()); arr = json.loads(m.group(1))
    out = ["# TA-Lib functions available as `talib.*` (generated)", "",
           "Call as `talib.NAME(records_or_array, params...)` in JavaScript / Python (same names; the Rust SDK has no `talib`, use `TA`). `Records[...]` lists which fields of the K-line records the function reads; parameters show their defaults; the result is an array (or several arrays) aligned with the input, with `NaN`/`null` where the window is not yet full.", "",
           "| Function | Description | 中文 | Signature |", "|---|---|---|---|"]
    for e in arr: out.append(f"| `{e['name']}` | {e.get('hint','')} | {e.get('cn','')} | `{e.get('help','')}` |")
    open(dst, "w", encoding="utf-8").write("\n".join(out) + "\n")

def build_pine(srcdir, dst):
    pretty = {"lib_ta.js": "ta.*", "lib_math.js": "math.*", "lib_str.js": "str.*", "lib_array.js": "array.*", "lib_strategy.js": "strategy.* (orders, position, risk)", "lib_plot.js": "plot / shapes / colors / input", "lib_timeframe.js": "timeframe / time", "lib_request.js": "request.* / runtime", "lib_other.js": "other built-ins", "lib_alert.js": "alert"}
    out = ["# Pine Script built-ins implemented by the FMZ Pine engine (generated from the engine source)", "",
           "Only the names below exist in FMZ's Pine runtime; a script that uses anything else fails to compile. Parameter lists are the engine's own signatures (`:name` = a series argument, `[name, default]` = optional with default). Semantics follow TradingView Pine v5.", ""]
    for f in sorted(glob.glob(os.path.join(srcdir, "lib_*.js"))):
        src = open(f, encoding="utf-8").read(); out += [f"## {pretty.get(os.path.basename(f), os.path.basename(f))}", ""]
        for m in re.finditer(r'scope\.register\(\s*"([^"]+)"\s*,\s*', src):
            rest = src[m.end():m.end() + 600]; args = None
            if rest.startswith("["):
                depth = 0
                for i, ch in enumerate(rest):
                    if ch == "[": depth += 1
                    elif ch == "]":
                        depth -= 1
                        if depth == 0: args = rest[:i + 1]; break
            out.append(f"- `{m.group(1)}`" + (f" {args}" if args else ""))
        out.append("")
    open(dst, "w", encoding="utf-8").write("\n".join(out))

def build_my(src, dst):
    out = ["# MyLanguage (麦语言) functions and keywords (generated)", "", "| Name | 说明 | Description |", "|---|---|---|"]
    for l in open(src, encoding="utf-8"):
        l = l.lstrip("﻿").rstrip("\n")
        if ":" not in l: continue
        k, v = l.split(":", 1); zh, _, en = v.strip().partition("|")
        out.append(f"| `{k.strip()}` | {zh.strip()} | {en.strip()} |")
    open(dst, "w", encoding="utf-8").write("\n".join(out) + "\n")

if __name__ == "__main__":
    cmd = sys.argv[1]
    if cmd in ("docs", "guide"):
        src, lang, dst = sys.argv[2:5]; title, intro = TITLES[(cmd, lang)]
        key = "syntaxGuide" if cmd == "docs" else "userGuide"
        open(dst, "w", encoding="utf-8").write(convert(src, key, title, intro)); print(dst)
    elif cmd == "rest": build_rest(*sys.argv[2:4]); print(sys.argv[3])
    elif cmd == "tools": build_tools(*sys.argv[2:4])
    elif cmd == "talib": build_talib(*sys.argv[2:4])
    elif cmd == "pine": build_pine(*sys.argv[2:4])
    elif cmd == "my": build_my(*sys.argv[2:4])
    else: sys.exit(__doc__)
