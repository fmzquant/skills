#!/usr/bin/env node
// Local FMZ backtest runner (part of the `fmz` skill). Node 18+, no npm packages.
//
// The platform prepares the run (prepare_backtest over MCP: templates, required libraries, Pine /
// MyLanguage / TypeScript -> JS, Rust -> wasm, exchange defaults); this machine downloads the
// platform's own engine (cached by sha256) and runs it. Python strategies run with python3.
//
//   node backtest.js run <config.json | strategy file> [options]
//   node backtest.js optimize <config.json> [options]
//   node backtest.js prepare <config.json | strategy file> --out task.json
//   node backtest.js exec <task.json> [options]          run a task saved by `prepare`
//
// See references/backtest-local.md for the config file format and the output.
'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');
const { fork, spawn } = require('child_process');

const EXT_LANG = { '.js': 'javascript', '.mjs': 'javascript', '.ts': 'typescript', '.py': 'python', '.pine': 'pine',
  '.rs': 'rust', '.my': 'mylanguage', '.mylang': 'mylanguage', '.mylanguage': 'mylanguage' };
const ENGINE_FILES = { javascript: 'backtest_javascript_wasm.js', dlopen: 'backtest_dlopen_wasm.js', python: 'backtest_python.py' };
const LOG_TYPES = ['buy', 'sell', 'cancel', 'error', 'profit', 'log', 'buy', 'sell'];

class Fail extends Error {
  constructor(code, msg) { super(msg); this.exitCode = code; }
}

// ── command line ───────────────────────────────────────────────────────────────

function usage() {
  return `usage:
  node backtest.js run <config.json | strategy file> [options]
  node backtest.js optimize <config.json> [options]
  node backtest.js prepare <config.json | strategy file> --out task.json
  node backtest.js exec <task.json> [options]

options:
  --out FILE        full result (run/exec), the ranking (optimize) or the task (prepare)
  --html FILE       write an HTML report (run/exec)
  --logs N          include the last N runtime log lines in the summary (default 0)
  --args JSON       parameter values, overrides the config's "args"
  --start/--end/--period/--base-period/--timezone VALUE   override the backtest settings
  --parallel N      concurrent runs for optimize (default: CPU count - 1)
  --quiet           no progress on stderr
  --mcp-url URL --key SECRET   credentials (default: env FMZ_MCP_URL / FMZ_SECRET_KEY,
                    then ~/.config/fmz/credentials.json, then the fmz MCP server configured in Claude Code)`;
}

function parseArgv(argv) {
  const opts = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--quiet' || a === '-q') opts.quiet = true;
    else if (a === '--help' || a === '-h') opts.help = true;
    else if (a.startsWith('--')) {
      const eq = a.indexOf('=');
      const key = (eq > 0 ? a.slice(2, eq) : a.slice(2)).replace(/-([a-z])/g, (_, c) => c.toUpperCase());
      const val = eq > 0 ? a.slice(eq + 1) : argv[++i];
      if (val === undefined) throw new Fail(2, `${a} needs a value`);
      opts[key] = val;
    } else opts._.push(a);
  }
  return opts;
}

function readJSON(file, what) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (e) {
    throw new Fail(2, `${what} ${file}: ${e.message}`);
  }
}

// config file, or a bare strategy file (its own /*backtest*/ header carries the settings)
function loadConfig(target, opts) {
  if (!target) throw new Fail(2, usage());
  const file = path.resolve(target);
  if (!fs.existsSync(file)) throw new Fail(2, `not found: ${target}`);
  let cfg;
  if (path.extname(file).toLowerCase() === '.json') {
    cfg = readJSON(file, 'config');
    cfg.__dir = path.dirname(file);
  } else {
    cfg = { strategy: file, __dir: process.cwd() };
  }
  cfg.backtest = Object.assign({}, cfg.backtest || {});
  for (const [opt, key] of [['start', 'start'], ['end', 'end'], ['period', 'period'], ['basePeriod', 'basePeriod'], ['timezone', 'timezone']]) {
    if (opts[opt] !== undefined) cfg.backtest[key] = opts[opt];
  }
  if (opts.args !== undefined) {
    try { cfg.args = JSON.parse(opts.args); } catch (e) { throw new Fail(2, `--args: ${e.message}`); }
  }
  return cfg;
}

// ── credentials ────────────────────────────────────────────────────────────────

function findCredentials(opts) {
  if (opts.mcpUrl && opts.key) return { url: opts.mcpUrl, key: opts.key };
  if (process.env.FMZ_MCP_URL && process.env.FMZ_SECRET_KEY) return { url: process.env.FMZ_MCP_URL, key: process.env.FMZ_SECRET_KEY };
  const home = os.homedir();
  const credFile = process.env.FMZ_CREDENTIALS || path.join(process.env.XDG_CONFIG_HOME || path.join(home, '.config'), 'fmz', 'credentials.json');
  if (fs.existsSync(credFile)) {
    const c = readJSON(credFile, 'credentials');
    if (c.mcp_url && c.secret_key) return { url: c.mcp_url, key: c.secret_key };
  }
  // Claude Code: `claude mcp add --transport http fmz <mcp_url> --header "Authorization: Bearer <secret>"`
  const claudeFile = path.join(home, '.claude.json');
  if (fs.existsSync(claudeFile)) {
    try {
      const d = JSON.parse(fs.readFileSync(claudeFile, 'utf8'));
      const pools = [d.mcpServers || {}];
      const proj = (d.projects || {})[process.cwd()];
      if (proj && proj.mcpServers) pools.unshift(proj.mcpServers);
      for (const pool of pools) {
        const entries = Object.entries(pool).sort(([a], [b]) => (a === 'fmz' ? -1 : b === 'fmz' ? 1 : 0));
        for (const [, v] of entries) {
          const auth = v && v.headers && (v.headers.Authorization || v.headers.authorization);
          if (v && typeof v.url === 'string' && /\/api\/mcp\/[^/]+$/.test(v.url) && auth) {
            return { url: v.url, key: String(auth).replace(/^Bearer\s+/i, '') };
          }
        }
      }
    } catch (e) { /* fall through */ }
  }
  throw new Fail(2, 'no FMZ credentials: set FMZ_MCP_URL and FMZ_SECRET_KEY (the mcp_url and secret_key of the agent key), '
    + `or write {"mcp_url": "...", "secret_key": "..."} to ${credFile} (chmod 600)`);
}

// ── prepare_backtest over MCP ──────────────────────────────────────────────────

async function mcpCall(cred, name, args) {
  const body = { jsonrpc: '2.0', id: 1, method: 'tools/call',
    params: { name, arguments: args, _meta: { protocolVersion: '2025-06-18', clientInfo: { name: 'fmz-skill-backtest', version: '1' } } } };
  let r;
  try {
    r = await fetch(cred.url, { method: 'POST', body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json', Accept: 'application/json, text/event-stream', Authorization: 'Bearer ' + cred.key } });
  } catch (e) {
    throw new Fail(4, `cannot reach ${new URL(cred.url).origin}: ${e.cause ? e.cause.message : e.message}`);
  }
  const text = await r.text();
  if (r.status === 401) throw new Fail(2, 'the FMZ key was rejected (revoked or wrong secret); create a new one');
  if (!r.ok) throw new Fail(4, `${name}: HTTP ${r.status} ${text.slice(0, 300)}`);
  let msg = null;
  if ((r.headers.get('content-type') || '').includes('text/event-stream')) {
    for (const line of text.split('\n')) if (line.startsWith('data:')) msg = JSON.parse(line.slice(5));
  } else msg = JSON.parse(text);
  if (!msg) throw new Fail(4, `${name}: empty reply`);
  if (msg.error) throw new Fail(3, `${name}: ${msg.error.message || JSON.stringify(msg.error)}`);
  const content = (msg.result && msg.result.content) || [];
  const out = content.map((c) => c.text || '').join('');
  if (msg.result.isError) {
    if (/Tool not found|Tool not allowed/.test(out)) {
      throw new Fail(3, `${name}: ${out} (the key needs the backtest scope; tools/list shows what it can call)`);
    }
    throw new Fail(3, out);
  }
  return JSON.parse(out);
}

function readText(file, dir) {
  const f = path.resolve(dir, file);
  try {
    return fs.readFileSync(f, 'utf8');
  } catch (e) {
    throw new Fail(2, `cannot read ${file}: ${e.message}`);
  }
}

function langOf(file, explicit, source) {
  if (explicit) return explicit;
  const l = EXT_LANG[path.extname(file).toLowerCase()];
  if (!l) throw new Fail(2, `cannot tell the language of ${file}; set "language" (javascript, typescript, python, pine, mylanguage, rust)`);
  if (l === 'javascript' && /^\s*\/\/\s*@ts-check/m.test(source)) return 'typescript';
  return l;
}

// config → prepare_backtest arguments
function prepareArgs(cfg) {
  const dir = cfg.__dir;
  const a = {};
  let s = cfg.strategy;
  if (s === undefined || s === null) throw new Fail(2, 'config.strategy is required (a file path, {"file", "language"}, {"source", "language"} or {"id"})');
  if (typeof s === 'number') s = { id: s };
  if (typeof s === 'string') s = { file: s };
  if (s.id) a.strategy_id = Number(s.id);
  else {
    const source = s.source !== undefined ? s.source : readText(s.file, dir);
    a.source = source;
    a.language = s.source !== undefined ? (s.language || 'javascript') : langOf(s.file, s.language, source);
  }
  if (cfg.templates) {
    a.templates = cfg.templates.map((t) => {
      if (typeof t === 'number') return t;
      if (typeof t === 'string') return { name: path.basename(t, path.extname(t)), source: readText(t, dir) };
      if (t.id) return Number(t.id);
      return { name: t.name || path.basename(t.file || 'template', path.extname(t.file || '')), source: t.source !== undefined ? t.source : readText(t.file, dir), args: t.args };
    });
  }
  if (cfg.args) a.args = cfg.args;
  const bt = Object.assign({}, cfg.backtest || {});
  if (bt.timezone === undefined) bt.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  a.config = bt;
  if (cfg.taskOverrides) a.task_overrides = cfg.taskOverrides;
  return a;
}

async function prepare(cfg, cred, extraArgs) {
  const a = prepareArgs(cfg);
  if (extraArgs) a.args = extraArgs;
  const p = await mcpCall(cred, 'prepare_backtest', a);
  p.origin = new URL(cred.url).origin;
  return p;
}

// ── engine download (cached by sha256) ─────────────────────────────────────────

function cacheDir() {
  const base = process.env.FMZ_CACHE_DIR
    || (process.platform === 'win32' ? path.join(process.env.LOCALAPPDATA || os.tmpdir(), 'fmz')
      : path.join(process.env.XDG_CACHE_HOME || path.join(os.homedir(), '.cache'), 'fmz'));
  const d = path.join(base, 'backtest-engines');
  fs.mkdirSync(d, { recursive: true });
  return d;
}

async function engineFile(engine, origin) {
  // FMZ_ENGINE_DIR: a local build of the engines (fmz/backtest/dist), for engine development
  if (process.env.FMZ_ENGINE_DIR) {
    const f = path.join(process.env.FMZ_ENGINE_DIR, ENGINE_FILES[engine.name]);
    if (!fs.existsSync(f)) throw new Fail(4, `FMZ_ENGINE_DIR has no ${ENGINE_FILES[engine.name]}`);
    return f;
  }
  const ext = engine.name === 'python' ? '.py' : '.js';
  const f = path.join(cacheDir(), `${engine.name}-${engine.sha256.slice(0, 16)}${ext}`);
  if (fs.existsSync(f)) return f;
  let r;
  try {
    r = await fetch(origin + engine.path);
  } catch (e) {
    throw new Fail(4, `cannot download the ${engine.name} engine: ${e.cause ? e.cause.message : e.message}`);
  }
  if (!r.ok) throw new Fail(4, `engine ${engine.name}: HTTP ${r.status}`);
  const buf = Buffer.from(await r.arrayBuffer());
  const sum = crypto.createHash('sha256').update(buf).digest('hex');
  if (sum !== engine.sha256) throw new Fail(4, `engine ${engine.name}: sha256 mismatch (the site updated it during the download?); run again`);
  const tmp = `${f}.${process.pid}.tmp`;
  fs.writeFileSync(tmp, buf);
  fs.renameSync(tmp, f);
  for (const old of fs.readdirSync(path.dirname(f))) { // keep only the current version of each engine
    if (old.startsWith(engine.name + '-') && path.join(path.dirname(f), old) !== f && !old.endsWith('.tmp')) {
      try { fs.unlinkSync(path.join(path.dirname(f), old)); } catch (e) { /* in use */ }
    }
  }
  return f;
}

// ── running one task ───────────────────────────────────────────────────────────

function pythonBin() {
  if (process.env.FMZ_PYTHON) return process.env.FMZ_PYTHON;
  return process.platform === 'win32' ? 'python' : 'python3';
}

// onProgress(percent) is called while it runs; resolves with the engine's final result object
function runTask(task, engineName, enginePath, onProgress) {
  return new Promise((resolve, reject) => {
    let stderr = '';
    let settled = false;
    const done = (err, res) => {
      if (settled) return;
      settled = true;
      err ? reject(err) : resolve(res);
    };
    if (engineName === 'python') {
      const tmp = path.join(os.tmpdir(), `fmz-bt-${process.pid}-${crypto.randomBytes(4).toString('hex')}`);
      fs.writeFileSync(tmp + '.task.json', JSON.stringify(task));
      const py = spawn(pythonBin(), [path.join(__dirname, 'backtest.py'), enginePath, tmp + '.task.json', tmp + '.result.json'],
        { stdio: ['ignore', 'pipe', 'pipe'], env: Object.assign({}, process.env, { PYTHONIOENCODING: 'utf-8' }) });
      let stdout = '';
      py.stdout.on('data', (b) => { stdout = (stdout + b).slice(-20000); });
      py.stderr.on('data', (b) => {
        for (const line of String(b).split('\n')) {
          const m = line.match(/^\x1eFMZ (\d+(?:\.\d+)?)/);
          if (m) onProgress(Number(m[1]));
          else if (line) stderr = (stderr + line + '\n').slice(-20000);
        }
      });
      py.on('error', (e) => done(new Fail(4, `cannot start ${pythonBin()} (Python 3 is needed for Python strategies; set FMZ_PYTHON): ${e.message}`)));
      py.on('close', (code) => {
        let res = null;
        try { res = JSON.parse(fs.readFileSync(tmp + '.result.json', 'utf8')); } catch (e) { /* none */ }
        for (const f of [tmp + '.task.json', tmp + '.result.json']) { try { fs.unlinkSync(f); } catch (e) { /* gone */ } }
        if (res) return done(null, res);
        done(new Fail(1, `python engine exited with ${code} and no result\n${(stderr || stdout).trim().slice(-3000)}`));
      });
      return;
    }
    const child = fork(__filename, ['__child'], { stdio: ['ignore', 'ignore', 'pipe', 'ipc'], serialization: 'advanced' });
    child.stderr.on('data', (b) => { stderr = (stderr + b).slice(-20000); });
    child.on('message', (m) => {
      if (m.type === 'progress') onProgress(m.progress);
      else if (m.type === 'result') done(null, m.result);
      else if (m.type === 'error') done(new Fail(1, m.message));
    });
    child.on('error', (e) => done(new Fail(4, e.message)));
    child.on('exit', (code) => done(new Fail(1, `engine exited with ${code} and no result\n${stderr.trim().slice(-3000)}`)));
    child.send({ task, engine: enginePath });
  });
}

// child process: the engine's cloud socket path (frames of [u32 TaskStatus][u32 length][JSON])
function childMain() {
  process.once('message', ({ task, engine }) => {
    let buf = Buffer.alloc(0);
    let last = null;
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      if (last) process.send({ type: 'result', result: last }, () => process.exit(0));
      else process.send({ type: 'error', message: 'the engine ended without a result' }, () => process.exit(1));
    };
    globalThis.s = {
      write(b) {
        buf = Buffer.concat([buf, b]);
        while (buf.length >= 8) {
          const n = buf.readUInt32BE(4);
          if (buf.length < 8 + n) break;
          const t = buf.readUInt32BE(0);
          const st = JSON.parse(buf.subarray(8, 8 + n).toString());
          buf = buf.subarray(8 + n);
          if (t === 0) process.send({ type: 'progress', progress: st.Progress });
          else last = st;
        }
      },
      end() { finish(); },
    };
    globalThis.__cfg__ = task;
    process.on('uncaughtException', (e) => {
      if (last) return finish();
      process.send({ type: 'error', message: 'engine error: ' + (e && e.stack || e) }, () => process.exit(1));
    });
    require(engine);
  });
}

// ── result summary (same metrics as the website's backtest page) ───────────────

function isoLocal(ms) {
  const d = new Date(ms);
  const off = -d.getTimezoneOffset();
  const p = (n) => String(Math.floor(Math.abs(n))).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`
    + `${off >= 0 ? '+' : '-'}${p(off / 60)}:${p(off % 60)}`;
}

// port of the website's parseAnalyze (hooks/tool/return-analyze.ts): daily buckets, risk-free 3 %
function analyze(totalAssets, profits, ts, te, yearDays = 365) {
  if (!profits || profits.length === 0 || !(totalAssets > 0)) return null;
  const period = 86400000;
  const yearRange = yearDays * 86400000;
  const totalReturns = profits[profits.length - 1][1] / totalAssets;
  const annualized = (totalReturns * yearRange) / (te - ts);
  let maxDD = 0, maxAssets = totalAssets, maxAssetsTime = 0, ddTime = 0, ddStart = 0, wins = 0;
  for (let i = 0; i < profits.length; i++) {
    if (i === 0 ? profits[i][1] > 0 : profits[i][1] > profits[i - 1][1]) wins++;
    const assets = profits[i][1] + totalAssets;
    if (assets > maxAssets) { maxAssets = assets; maxAssetsTime = profits[i][0]; }
    if (maxAssets > 0 && 1 - assets / maxAssets > maxDD) { maxDD = 1 - assets / maxAssets; ddTime = profits[i][0]; ddStart = maxAssetsTime; }
  }
  const datas = [];
  let sum = 0, pre = 0, i = 0;
  const rangeEnd = (te - ts) % period > 0 ? (Math.floor(te / period) + 1) * period : te;
  for (let n = ts; n < rangeEnd; n += period) {
    let day = 0;
    while (i < profits.length && profits[i][0] < n + period) { day += profits[i][1] - pre; pre = profits[i][1]; i++; }
    const r = ((day / totalAssets) * yearRange) / period;
    sum += r;
    datas.push(r);
  }
  let sharpe = 0, vol = 0;
  if (datas.length) {
    const avg = sum / datas.length;
    vol = Math.sqrt(datas.reduce((s, x) => s + (x - avg) ** 2, 0) / datas.length);
    if (vol !== 0) sharpe = (annualized - 0.03) / vol;
  }
  return { total_assets: totalAssets, return: totalReturns, annualized_return: annualized, sharpe, volatility: vol, max_drawdown: maxDD,
    max_drawdown_start: ddStart ? isoLocal(ddStart) : null, max_drawdown_time: ddTime ? isoLocal(ddTime) : null, win_rate: wins / profits.length };
}

const r6 = (x) => (typeof x === 'number' && isFinite(x) ? Math.round(x * 1e6) / 1e6 : x);

function summarize(res, task, opts = {}) {
  const ts = task.Options.TimeBegin * 1000, te = task.Options.TimeEnd * 1000;
  const out = { status: res.TaskStatus === 1 ? 'done' : 'error', elapsed_ms: Math.round((res.Elapsed || 0) / 1e6) };
  const exc = String(res.Exception || '').replace(/\0/g, '').trim();
  if (exc) out.exception = exc.slice(0, 3000);
  const profits = res.ProfitLogs || [];
  out.profit = profits.length ? profits[profits.length - 1][1] : res.Profit;

  // assets base the website uses: initial stocks when there are any (CTP/XTP excluded), else quote balance
  let totalBalance = 0, totalStocks = 0;
  for (const e of task.Exchanges) {
    totalBalance += Number(e.Balance) || 0;
    if (e.Id !== 'Futures_CTP' && e.Id !== 'Futures_XTP') totalStocks += Number(e.Stocks) || 0;
  }
  const deposit = totalStocks > 0 ? totalStocks : totalBalance;
  const snaps = res.Snapshots || [];
  let stats = null, basis = null;
  if ((res.CloseProfitLogs || []).length) { stats = analyze(deposit, res.CloseProfitLogs, ts, te); basis = 'CloseProfitLogs'; }
  else if (profits.length) { stats = analyze(totalBalance > 0 ? totalBalance : deposit, profits, ts, te); basis = 'LogProfit'; }
  else if (snaps.length) {
    const pnl = snaps.map(([t, accs]) => [t, (accs && accs[0] && accs[0].PnL) || 0]);
    const first = task.Exchanges[0] || {};
    stats = analyze(Number(first.Balance) || Number(first.Stocks) || deposit, pnl, ts, te);
    basis = 'account PnL';
    if (out.profit === undefined || out.profit === 0) out.profit = pnl[pnl.length - 1][1];
  }
  if (stats) {
    out.stats_basis = basis;
    for (const [k, v] of Object.entries(stats)) out[k] = r6(v);
  }

  const counts = {};
  const errorLines = [];
  const logs = res.RuntimeLogs || [];
  for (const row of logs) {
    const type = LOG_TYPES[row[2]] || String(row[2]);
    counts[type] = (counts[type] || 0) + 1;
    if (row[2] === 3 && errorLines.length < 20) errorLines.push(`${isoLocal(row[1])} ${String(row[7]).replace(/\0/g, '').slice(0, 300)}`);
  }
  out.orders = (counts.buy || 0) + (counts.sell || 0);
  out.cancels = counts.cancel || 0;
  out.errors = counts.error || 0;
  out.log_counts = counts;
  out.logs_total = res.LogsCount;
  if (errorLines.length) out.error_lines = errorLines;
  if (opts.logs > 0) {
    out.logs = logs.slice(-opts.logs).map((row) => {
      const l = { time: isoLocal(row[1]), type: LOG_TYPES[row[2]] || row[2] };
      if (row[2] <= 2) Object.assign(l, { order_id: row[4], price: row[5], amount: row[6], symbol: row[8], direction: row[9] });
      const text = String(row[7] || '').replace(/\0/g, '');
      if (text) l.text = text.slice(0, 500);
      return l;
    });
  }
  if (snaps.length) {
    const [t, accs] = snaps[snaps.length - 1];
    out.final_accounts = (accs || []).map((a, i) => ({
      exchange: (task.Exchanges[i] || {}).Label,
      time: isoLocal(t),
      pnl: r6(a.PnL),
      utilization: r6(a.Utilization),
      assets: (a.Assets || []).map((x) => ({ currency: x.Currency, amount: r6(x.Amount), frozen: r6(x.FrozenAmount), commission: r6(x.Commission), funding: r6(x.Funding) })),
      positions: Object.entries(a.Symbols || {}).filter(([, v]) => v && ((v.Long && v.Long.Amount) || (v.Short && v.Short.Amount)))
        .map(([sym, v]) => ({ symbol: sym, last: v.Last, long: v.Long, short: v.Short })),
    }));
  }
  const status = String(res.Status || '').replace(/\0/g, '').trim();
  if (status) out.status_page = status.slice(0, 2000);
  if (!profits.length && !logs.length && !snaps.length) {
    out.note = 'empty result: usually no history data for this exchange/pair/period/range, or the strategy never called the exchange';
  }
  return out;
}

// ── HTML report ────────────────────────────────────────────────────────────────

function esc(s) {
  return String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}

function curveSVG(points) {
  if (points.length < 2) return '<p class="muted">No equity curve: the strategy logged no profit and held no snapshot data.</p>';
  const W = 960, H = 260, P = 36;
  const xs = points.map((p) => p[0]), ys = points.map((p) => p[1]);
  const x0 = Math.min(...xs), x1 = Math.max(...xs);
  let y0 = Math.min(0, ...ys), y1 = Math.max(0, ...ys);
  if (y0 === y1) { y0 -= 1; y1 += 1; }
  const X = (x) => P + ((x - x0) / (x1 - x0 || 1)) * (W - 2 * P);
  const Y = (y) => H - P - ((y - y0) / (y1 - y0)) * (H - 2 * P);
  const line = points.map((p, i) => `${i ? 'L' : 'M'}${X(p[0]).toFixed(1)},${Y(p[1]).toFixed(1)}`).join('');
  const area = `${line}L${X(x1).toFixed(1)},${Y(0).toFixed(1)}L${X(x0).toFixed(1)},${Y(0).toFixed(1)}Z`;
  const lastP = points[points.length - 1];
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Profit curve">
<line x1="${P}" x2="${W - P}" y1="${Y(0)}" y2="${Y(0)}" class="zero"/>
<path d="${area}" class="area"/><path d="${line}" class="line"/>
<circle cx="${X(lastP[0])}" cy="${Y(lastP[1])}" r="4" class="dot"/>
<text x="${P}" y="${H - 10}" class="axis">${esc(isoLocal(x0).slice(0, 10))}</text>
<text x="${W - P}" y="${H - 10}" class="axis" text-anchor="end">${esc(isoLocal(x1).slice(0, 10))}</text>
<text x="${P}" y="${P - 12}" class="axis">${esc(r6(y1))}</text>
<text x="${P}" y="${H - P + 16}" class="axis">${esc(r6(y0))}</text>
</svg>`;
}

function htmlReport(summary, res, prep) {
  const task = prep.task;
  let points = (res.ProfitLogs || []).map((p) => [p[0], p[1]]);
  if (!points.length) points = (res.Snapshots || []).map(([t, a]) => [t, (a || []).reduce((s, x) => s + (x.PnL || 0), 0)]);
  const pct = (x) => (typeof x === 'number' ? (x * 100).toFixed(2) + '%' : '–');
  const cards = [
    ['Profit', r6(summary.profit)], ['Return', pct(summary.return)], ['Annualized', pct(summary.annualized_return)],
    ['Sharpe', typeof summary.sharpe === 'number' ? summary.sharpe.toFixed(2) : '–'], ['Max drawdown', pct(summary.max_drawdown)],
    ['Win rate', pct(summary.win_rate)], ['Orders', summary.orders], ['Errors', summary.errors],
  ].map(([k, v]) => `<div class="card"><span>${esc(k)}</span><b>${esc(v === undefined ? '–' : v)}</b></div>`).join('');
  const r = prep.resolved || {};
  const exRows = (r.exchanges || task.Exchanges.map((e) => ({ eid: e.Id, currency: e.Currency, balance: e.Balance, stocks: e.Stocks })))
    .map((e) => `<tr><td>${esc(e.label || e.eid)}</td><td>${esc(e.currency)}</td><td class="n">${esc(e.balance)}</td><td class="n">${esc(e.stocks)}</td><td class="n">${esc((e.fee || []).join(' / '))}</td></tr>`).join('');
  const logRows = (res.RuntimeLogs || []).slice(-300).reverse().map((row) => `<tr class="t${row[2]}"><td>${esc(isoLocal(row[1]).replace('T', ' ').slice(0, 19))}</td>`
    + `<td>${esc(LOG_TYPES[row[2]] || row[2])}</td><td class="n">${row[2] <= 2 ? esc(r6(row[5])) : ''}</td><td class="n">${row[2] <= 2 ? esc(r6(row[6])) : ''}</td>`
    + `<td>${esc(String(row[7] || '').replace(/\0/g, '').slice(0, 300))}</td></tr>`).join('');
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Backtest report</title><style>
:root{--bg:#f6f7f9;--panel:#fff;--ink:#1d232b;--muted:#69737f;--line:#dde1e6;--accent:#1f6feb;--fill:rgba(31,111,235,.12);--bad:#c43d3d;--good:#1f8a4c}
@media (prefers-color-scheme:dark){:root{--bg:#11151a;--panel:#181e25;--ink:#e3e8ee;--muted:#8d97a3;--line:#2a323c;--accent:#5b9dff;--fill:rgba(91,157,255,.16);--bad:#ff7a7a;--good:#4fd18b}}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
main{max-width:1040px;margin:0 auto;padding:24px 16px}h1{font-size:20px;margin:0 0 4px}h2{font-size:15px;margin:28px 0 10px}
.muted{color:var(--muted)}.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:10px;margin-top:16px}
.card{background:var(--panel);border:1px solid var(--line);border-radius:8px;padding:10px 12px;display:flex;flex-direction:column;gap:2px}
.card span{color:var(--muted);font-size:12px;letter-spacing:.02em}.card b{font-size:18px;font-variant-numeric:tabular-nums}
.panel{background:var(--panel);border:1px solid var(--line);border-radius:8px;padding:12px;overflow-x:auto}
svg{width:100%;height:auto}.line{fill:none;stroke:var(--accent);stroke-width:2}.area{fill:var(--fill)}.zero{stroke:var(--line)}.dot{fill:var(--accent)}
.axis{fill:var(--muted);font-size:12px}table{border-collapse:collapse;width:100%;font-variant-numeric:tabular-nums}
th,td{text-align:left;padding:5px 8px;border-bottom:1px solid var(--line);vertical-align:top}th{color:var(--muted);font-weight:500;font-size:12px}
td.n{text-align:right}tr.t3 td{color:var(--bad)}tr.t0 td:nth-child(2){color:var(--good)}tr.t1 td:nth-child(2){color:var(--bad)}
pre{white-space:pre-wrap;margin:0;font:12px/1.5 ui-monospace,Menlo,monospace}
</style></head><body><main>
<h1>Backtest report</h1>
<div class="muted">${esc(prep.language || '')} · ${esc(r.start || '')} → ${esc(r.end || '')} · ${esc(r.period || '')} ${esc(r.mode || '')} · ${esc(summary.status)}${summary.elapsed_ms ? ' in ' + (summary.elapsed_ms / 1000).toFixed(1) + ' s' : ''}</div>
<div class="cards">${cards}</div>
${summary.exception ? `<h2>Exception</h2><div class="panel"><pre>${esc(summary.exception)}</pre></div>` : ''}
<h2>Profit</h2><div class="panel">${curveSVG(points)}</div>
<h2>Exchanges</h2><div class="panel"><table><thead><tr><th>Exchange</th><th>Pair</th><th>Balance</th><th>Stocks</th><th>Fee % (maker / taker)</th></tr></thead><tbody>${exRows}</tbody></table></div>
${summary.status_page ? `<h2>Status</h2><div class="panel"><pre>${esc(summary.status_page)}</pre></div>` : ''}
<h2>Log <span class="muted">(latest ${Math.min(300, (res.RuntimeLogs || []).length)} of ${esc(summary.logs_total || 0)})</span></h2>
<div class="panel"><table><thead><tr><th>Time</th><th>Type</th><th>Price</th><th>Amount</th><th>Message</th></tr></thead><tbody>${logRows}</tbody></table></div>
</main></body></html>`;
}

// ── commands ───────────────────────────────────────────────────────────────────

function progressBar(quiet, label) {
  let lastPct = -1;
  return (p) => {
    if (quiet || !process.stderr.isTTY || typeof p !== 'number') return;
    const pct = Math.floor(p);
    if (pct === lastPct) return;
    lastPct = pct;
    process.stderr.write(`\r${label} ${pct}%   `);
  };
}

function writeOut(file, data) {
  fs.mkdirSync(path.dirname(path.resolve(file)), { recursive: true });
  fs.writeFileSync(file, typeof data === 'string' ? data : JSON.stringify(data, null, 1));
}

async function runPrepared(prep, opts) {
  const enginePath = await engineFile(prep.engine, prep.origin);
  const res = await runTask(prep.task, prep.engine.name, enginePath, progressBar(opts.quiet, 'backtest'));
  if (!opts.quiet && process.stderr.isTTY) process.stderr.write('\r' + ' '.repeat(24) + '\r');
  const summary = summarize(res, prep.task, { logs: Number(opts.logs || 0) });
  if (prep.warnings) summary.warnings = prep.warnings;
  if (prep.resolved) summary.config = prep.resolved;
  const outFile = opts.out || path.join(os.tmpdir(), 'fmz-backtest', 'last-result.json');
  writeOut(outFile, { summary, result: res });
  summary.result_file = path.resolve(outFile);
  if (opts.html) {
    writeOut(opts.html, htmlReport(summary, res, prep));
    summary.report = path.resolve(opts.html);
  }
  return summary;
}

// optimize: {"params": {"fast": [5, 10] | {"from": 5, "to": 20, "step": 5}, "MyLib.x": [...]}, "target": "sharpe", "top": 10}
function grid(params) {
  const keys = Object.keys(params || {});
  if (!keys.length) throw new Fail(2, 'optimize.params is required, e.g. {"fast": {"from": 5, "to": 20, "step": 5}}');
  const values = keys.map((k) => {
    const v = params[k];
    if (Array.isArray(v)) return v;
    if (v && typeof v === 'object' && v.from !== undefined && v.to !== undefined) {
      const step = Number(v.step || 1);
      if (!(step > 0)) throw new Fail(2, `optimize.params.${k}: step must be > 0`);
      const out = [];
      for (let x = Number(v.from); x <= Number(v.to) + step * 1e-9; x += step) out.push(Math.round(x * 1e10) / 1e10);
      return out;
    }
    return [v];
  });
  let combos = [{}];
  keys.forEach((k, i) => { combos = combos.flatMap((c) => values[i].map((v) => Object.assign({}, c, { [k]: v }))); });
  return combos;
}

// put one combination into a prepared task: "name" → the strategy, "Template.name" → that template
function applyCombo(task, combo) {
  const t = JSON.parse(JSON.stringify(task));
  const code = t.Code;
  for (const [key, val] of Object.entries(combo)) {
    const dot = key.indexOf('.');
    const entry = dot > 0 ? code.find((c) => c[2] === key.slice(0, dot)) : code[code.length - 1];
    const name = dot > 0 ? key.slice(dot + 1) : key;
    if (!entry) throw new Fail(2, `optimize: no template named ${key.slice(0, dot)}`);
    const pair = entry[1].find((p) => p[0] === name);
    if (pair) pair[1] = val;
    else entry[1].push([name, val]);
  }
  return t;
}

const TARGETS = { sharpe: 1, profit: 1, return: 1, annualized_return: 1, win_rate: 1, max_drawdown: -1, calmar: 1 };

async function optimize(cfg, cred, opts) {
  const o = cfg.optimize || {};
  const combos = grid(o.params);
  const maxRuns = Number(o.maxRuns || 2000);
  if (combos.length > maxRuns) throw new Fail(2, `${combos.length} combinations exceed optimize.maxRuns (${maxRuns}); narrow the ranges or raise maxRuns`);
  const target = o.target || 'sharpe';
  if (!TARGETS[target]) throw new Fail(2, `optimize.target must be one of ${Object.keys(TARGETS).join(', ')}`);
  const parallel = Math.max(1, Number(opts.parallel || o.parallel || Math.max(1, os.cpus().length - 1)));

  const base = await prepare(cfg, cred);
  const isRust = base.engine.name === 'dlopen'; // Rust bakes parameters into the wasm: compile per combination
  const lean = (task) => {
    Object.assign(task.Options, { RetFlags: 1 | 16 | 32 | 64 | 128 | 256, MaxRuntimeLogs: 200, MaxChartLogs: 0 });
    return task;
  };
  const enginePath = await engineFile(base.engine, base.origin);
  const rows = new Array(combos.length);
  let next = 0, finished = 0;
  const label = () => { if (!opts.quiet && process.stderr.isTTY) process.stderr.write(`\roptimize ${finished}/${combos.length}   `); };
  label();
  async function worker() {
    while (next < combos.length) {
      const i = next++;
      const combo = combos[i];
      let task;
      try {
        if (isRust) {
          const args = Object.assign({}, typeof cfg.args === 'object' && !Array.isArray(cfg.args) ? cfg.args : {});
          const tplArgs = [];
          for (const [k, v] of Object.entries(combo)) {
            const dot = k.indexOf('.');
            if (dot > 0) tplArgs.push([k.slice(dot + 1), v, k.slice(0, dot)]); else args[k] = v;
          }
          const pairs = Object.entries(args).map(([k, v]) => [k, v]).concat(tplArgs);
          task = lean((await prepare(cfg, cred, pairs)).task);
        } else task = lean(applyCombo(base.task, combo));
        const res = await runTask(task, base.engine.name, enginePath, () => {});
        const s = summarize(res, task);
        rows[i] = { args: combo, status: s.status, profit: r6(s.profit), return: s.return, annualized_return: s.annualized_return, sharpe: s.sharpe,
          max_drawdown: s.max_drawdown, win_rate: s.win_rate, calmar: s.max_drawdown ? r6((s.annualized_return || 0) / s.max_drawdown) : null,
          errors: s.errors, exception: s.exception ? s.exception.slice(0, 200) : undefined };
      } catch (e) {
        rows[i] = { args: combo, status: 'error', exception: String(e.message).slice(0, 300) };
      }
      finished++;
      label();
    }
  }
  await Promise.all(Array.from({ length: Math.min(parallel, combos.length) }, worker));
  if (!opts.quiet && process.stderr.isTTY) process.stderr.write('\r' + ' '.repeat(30) + '\r');
  const dir = TARGETS[target];
  const ok = rows.filter((r) => r.status === 'done' && typeof r[target] === 'number');
  ok.sort((a, b) => dir * (b[target] - a[target]));
  const failed = rows.filter((r) => r.status !== 'done');
  const out = { runs: rows.length, ok: ok.length, failed: failed.length, target, top: ok.slice(0, Number(o.top || 10)), config: base.resolved };
  if (failed.length) out.failures = failed.slice(0, 5);
  if (base.warnings) out.warnings = base.warnings;
  const outFile = opts.out || path.join(os.tmpdir(), 'fmz-backtest', 'last-optimize.json');
  writeOut(outFile, { summary: out, rows: ok.concat(failed) });
  out.result_file = path.resolve(outFile);
  return out;
}

async function main() {
  const argv = process.argv.slice(2);
  if (argv[0] === '__child') return childMain();
  const opts = parseArgv(argv);
  const [cmd, target] = opts._;
  if (opts.help || !cmd) { console.log(usage()); return; }
  let out;
  if (cmd === 'exec') {
    const prep = readJSON(path.resolve(target || ''), 'task');
    if (!prep.task || !prep.engine) throw new Fail(2, `${target} is not a file written by \`prepare --out\``);
    if (!prep.origin) prep.origin = new URL(findCredentials(opts).url).origin;
    out = await runPrepared(prep, opts);
  } else if (cmd === 'run' || cmd === 'prepare' || cmd === 'optimize') {
    const cfg = loadConfig(target, opts);
    const cred = findCredentials(opts);
    if (cmd === 'optimize') out = await optimize(cfg, cred, opts);
    else {
      const prep = await prepare(cfg, cred);
      if (cmd === 'prepare') {
        const file = opts.out || 'backtest-task.json';
        writeOut(file, prep);
        out = { task_file: path.resolve(file), engine: prep.engine.name, config: prep.resolved, warnings: prep.warnings };
      } else out = await runPrepared(prep, opts);
    }
  } else throw new Fail(2, `unknown command ${cmd}\n${usage()}`);
  console.log(JSON.stringify(out, null, 1));
  if (out.status === 'error') process.exitCode = 1;
}

if (require.main === module) {
  main().catch((e) => {
    if (process.stderr.isTTY) process.stderr.write('\r' + ' '.repeat(30) + '\r');
    console.log(JSON.stringify({ status: 'error', error: e.message }, null, 1));
    process.exitCode = e.exitCode || 1;
  });
}

module.exports = { analyze, summarize, grid, applyCombo, prepareArgs };
