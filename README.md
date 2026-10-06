# FMZ Quant skills for AI agents

Skills that teach an AI coding agent (Claude Code, Codex, Cursor, Gemini CLI, ... anything that follows the [Agent Skills](https://agentskills.io) format) how to operate the [FMZ Quant](https://www.fmz.com) trading platform and how to write strategies for it in every supported language.

## Install

```bash
npx skills add fmzquant/skills --global --yes -a claude-code
```

Set `-a` to your agent (`npx skills add --help` lists them). Without GitHub access, the same bundle is served by the platform itself:

```bash
npx skills add https://www.fmz.com/agent/skills.zip --global --yes -a claude-code
```

Single files are readable at `https://www.fmz.com/agent/skills/<skill>/SKILL.md`.

Connecting an agent to the platform (device-code authorization, MCP URL, permissions) is described at https://www.fmz.com/agent/setup.md — the agent can read that page and do it by itself.

## Skills

| Skill | Covers |
|---|---|
| `fmz-platform` | The platform model and every MCP tool: accounts, nodes, strategies, robots, backtests, messages; workflows; safety rules; the REST extended API; the user guide as markdown (en/zh). |
| `fmz-api-reference` | The complete strategy API documentation as greppable markdown (en/zh): every function, structure and constant with examples in JavaScript, Python, C++ and Rust. |
| `fmz-strategy-javascript` | Writing strategies in JavaScript/TypeScript: structure, parameters, the exchange API, concurrency, IO, logging and charts, pitfalls. References: `fmz.d.ts` (full typed declarations), the native event API, the platform self-check strategy. |
| `fmz-strategy-python` | The same for Python. References: `fmz.pyi`, `talib.pyi`, self-check. |
| `fmz-strategy-cpp` | The same for C++. References: `fmz.hpp`, json/TA/talib headers, self-check. |
| `fmz-strategy-rust` | The same for Rust (single-file crate, cargo-script dependencies). References: `fmz.rs`, self-check. |
| `fmz-strategy-pine` | Pine Script on FMZ: what the engine implements, strategy() options, orders, live specifics. Reference: generated built-in list. |
| `fmz-strategy-mylanguage` | 麦语言 (MyLanguage) on FMZ: syntax, trading instructions, money management, live specifics. References: function dictionary, official templates. |
| `fmz-backtest` | Cloud backtesting: configuration (MCP parameters and the `/*backtest*/` header), simulation model, reading results. |
| `fmz-indicators` | `TA.*` and the 151 `talib.*` functions: inputs, outputs, language differences. |

## Layout

Each skill is a folder with `SKILL.md` (what an agent reads first) and `references/` (declaration files, generated tables and converted documentation the SKILL.md tells the agent to grep). The generated references come from the platform's own sources; `scripts/build-references.py` rebuilds them (see its header for inputs).

## License

MIT. The documentation and declaration files are published by FMZ for strategy authors; keep the attribution when redistributing.
