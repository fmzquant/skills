# FMZ Quant skill for AI agents

One [Agent Skill](https://agentskills.io) that teaches an AI coding agent (Claude Code, Codex, Cursor, Gemini CLI, ... anything that follows the format) how to operate the [FMZ Quant](https://www.fmz.com) trading platform through its MCP tools and how to write strategies for it in every supported language.

## Install

```bash
npx skills add fmzquant/skills --global --yes -a claude-code
```

Set `-a` to your agent (`npx skills add --help` lists them).

Connecting an agent to the platform (device-code authorization, MCP URL, permissions) is described at https://www.fmz.com/agent/setup.md and in the skill itself — the agent can read either and do it by itself.

## Layout

```
fmz/
├── SKILL.md                  entry point: connecting, the platform model, every MCP tool, workflows, safety rules,
│                             and a routing table that says which reference to read for which task
└── references/
    ├── javascript.md python.md cpp.md rust.md pine.md mylanguage.md   how to write a strategy in each language
    ├── fmz.d.ts fmz.zh_CN.d.ts ctx.d.ts events.md selfcheck.js        JavaScript declarations, native event API, self-check
    ├── fmz.pyi fmz.zh_CN.pyi talib.pyi selfcheck.py                   Python
    ├── fmz.hpp json.hpp TA.hpp talib.hpp selfcheck.cpp                C++
    ├── fmz.rs selfcheck.rs                                            Rust
    ├── pine-builtins.md                                               built-ins the Pine engine implements
    ├── mylanguage-functions.md mylanguage-examples/                   麦语言 dictionary and official templates
    ├── api-docs.md api.en.md api.zh.md                                the complete strategy API documentation (en/zh)
    ├── indicators.md ta.md talib.md                                   TA.* and talib.*
    ├── backtest.md backtest-config.md                                 cloud backtesting
    ├── tools.md rest-api.md                                           MCP tool parameters, REST extended API
    └── user-guide.en.md user-guide.zh.md                              the platform user guide as markdown
```

The agent loads `SKILL.md` when a task concerns FMZ and reads only the reference files that task needs. The generated references come from the platform's own sources; `scripts/build-references.py` rebuilds them (see its header for inputs).

## License

MIT. The documentation and declaration files are published by FMZ for strategy authors; keep the attribution when redistributing.
