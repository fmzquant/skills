#!/usr/bin/env python3
"""Regenerate references/talib.md from the FMZ syntax docs (fun/Talib pages).

Usage: python3 scripts/build-talib-table.py <syntax outdir> fmz/references/talib.md
  e.g. python3 scripts/build-talib-table.py ~/repos/doc/docs/fmz/syntax/outdir fmz/references/talib.md

Each talib page's desc reads "```talib.X()```函数用于计算**English (中文)**" and a remark carries the
TA-Lib signature ("...描述为：```SIG```"); the table is rebuilt from those, so it tracks the docs.
"""
import re
import sys
from pathlib import Path

import yaml

HEAD = """# TA-Lib functions available as `talib.*` (generated)

Call as `talib.NAME(records_or_array, params...)` in JavaScript / Python (same names; the Rust SDK has no `talib`, use `TA`). `Records[...]` lists which fields of the K-line records the function reads; parameters show their defaults; the result is an array (or several arrays) aligned with the input, with `NaN`/`null` where the window is not yet full.
"""


def text(v):
    return "\n".join(v) if isinstance(v, list) else (v or "")


def main(outdir, dest):
    rows = []
    for p in sorted(Path(outdir, "fun", "Talib").rglob("talib.*.yaml")):
        doc = yaml.safe_load(p.read_text(encoding="utf-8"))
        name = doc["title"].split(".", 1)[1]
        m = re.search(r"\*\*(.+?)\*\*", text(doc.get("desc")))
        en, zh = (m.group(1), "") if m else ("", "")
        m2 = re.match(r"(.+?)\s*[（(]([^()（）]+)[)）]\s*$", en)
        if m2:
            en, zh = m2.group(1).strip(), m2.group(2).strip()
        sig = re.search(r"描述为：```(.+?)```", text(doc.get("remarks")))
        rows.append((name, en, zh, sig.group(1) if sig else ""))
    rows.sort()
    out = [HEAD, "| Function | Description | 中文 | Signature |", "|---|---|---|---|"]
    out += [f"| `{n}` | {e} | {z} | `{s}` |" for n, e, z, s in rows]
    Path(dest).write_text("\n".join(out) + "\n", encoding="utf-8")
    print(f"{dest}: {len(rows)} functions")


if __name__ == "__main__":
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    main(sys.argv[1], sys.argv[2])
