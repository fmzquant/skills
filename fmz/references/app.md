# Strategy frontends (apps)

A strategy written in JavaScript, Python or Rust can carry a **frontend**: a set of web files with `index.html` at the root, served at the strategy's own address. The page talks to the strategy through the page SDK (`AppKit`); the strategy answers through `ctx.app`. Use it for dashboards, control panels and small tools around a running strategy. Pine, MyLanguage, Workflow and Blockly strategies cannot have one.

## How it fits together

| Piece | What it is |
|---|---|
| Address | `get_app` returns `url` (the public address, assigned from the strategy id, cannot be chosen) and `dev_url` (same content, only the author can open it; for previews and local development). `sdk` is the page SDK script to load. |
| Backend | The author's **newest running robot** of this strategy. It connects to the app gateway by itself once it starts; there is no connection code to write. With no robot running the address shows a "not running" page (the page's `app.online` is false, requests fail with `offline`), unless the author marked the frontend as needing no robot (`static`: a pure frontend). Every robot also has an address of its own, only its owner can open it, for picking a specific robot when several run the same strategy. |
| Who can open it | Only the author, until the author turns on "Publish to Apps" in the strategy's Frontend settings (`open` in `get_app`): then anyone can, signed in or not, and it is listed in Apps. This is independent of whether the strategy or the robot is public. A renter of a strategy that has a frontend gets an address of their own whose backend is the renter's own robot; there the renter is `owner`. |
| Saving | No draft: every write takes effect at once. Each saved strategy version records its frontend. Copying someone's public strategy copies its frontend. |

## Security: the strategy checks `role`

Everyone who can open the page can send requests, and **all of them reach the strategy**. The platform does not filter them: each event carries `role`, `owner` (the strategy's author, or the renter on a renter's address), `user` (someone else, signed in) or `guest` (not signed in, no `uid`). Anything only the owner should do (placing orders, changing parameters, stopping logic) must check `e.role === "owner"` in the strategy and refuse the rest with `ctx.app.fail`. HTTP routes are also gated by `auth` in `app.json` (below), but a channel request has no such gate.

`uid` is the user's id inside this app (8 lowercase letters/digits, stable per person per app, not the platform account id); key per-user data by it. Guests have no `uid`; tell their connections apart by `session`.

## Building one with the MCP tools

| Step | Tool |
|---|---|
| See whether the strategy has a frontend, its addresses, the SDK address, its files and robots | `get_app` (read) |
| Read a file | `read_app_file` (read) |
| Create or replace a text file; the first write creates the frontend | `write_app_file` (write) |
| Delete a file | `delete_app_file` (write) |
| Replace the whole frontend with a zip (`index.html` at the zip root, images and other binary files) | `upload_app_bundle` (write) returns a one-time `url`; within ten minutes `curl -X PUT --data-binary @app.zip <site><url>` |

Then the strategy needs a running robot as backend (`create_robot` / `start_robot`, `[trade]`: confirm with the user first). Opening `url` / `dev_url` in a browser is the user's step; the address needs their sign-in.

Turning on "Publish to Apps", the listing text and tags are settings on the website (strategy editor, Frontend settings), not MCP tools. Publishing to Apps exposes the page to everyone: do it only when the user asks.

Files:

- `index.html` at the root (required). Load the SDK with the full address from `get_app.sdk`: `<script src="..."></script>`. The same files then also run when downloaded and opened on localhost.
- `app.json` (optional): only the HTTP routes the strategy answers. A bad one is refused and nothing changes.

  ```json
  {"routes": [
      {"path": "/feed.json", "auth": "guest", "methods": ["GET"], "cache": 5},
      {"path": "/api/*", "auth": "user"}
  ]}
  ```

  `auth` is who at least may call it: `owner` only the owner, `user` anyone signed in who may open the page, `guest` anyone (may carry `cache` seconds). While the frontend is not published, `guest` routes count as `user`. GET routes must not change anything (other sites can trigger a GET by a link); use POST for orders and settings. Matching order: `/__app/*`, then `routes`, then files, then extension-less paths fall back to `index.html`.
- Icon: a file named `icon.svg`, `icon.png` or `icon.webp` at the root (256 KB max). Do not put `mode`, `guests` or `icon` keys in `app.json`; they are refused.

## Page side (`AppKit`)

```js
const app = await AppKit.connect()                 // published apps admit anyone; app.user is null for guests
app.role                                           // "owner" | "user" | "guest"
app.login()                                        // ask a guest to sign in, comes back to this page
const r = await app.request("status", params)      // request/reply; rejects with e.code: offline | timeout | backend | rate | too_large
await app.request("report", args, { timeout: 60000 }) // a long computation may wait longer (default 10 s, max 2 min)
app.send(data)                                     // one-way message to the strategy
const off = app.subscribe("ticker:BTC_USDT", fn)   // topic subscription; off() cancels
app.on("message", fn)                              // messages the strategy sends with ctx.app.send
app.on("status", ({ connected, online }) => ...)   // channel and backend state
await app.storage.get(k) / set(k, v) / remove(k) / keys()  // per (user, app) storage; guests get e.code "login"
await app.exchanges()                              // the backend robot's exchange accounts, no credentials; owner only, others get []
await app.fetch("/api/x")                          // call a route declared in app.json
```

`backend` errors carry the message the strategy passed to `ctx.app.fail`. The SDK reconnects and resubscribes by itself; unanswered requests are resent with the same id after a reconnect and the platform hands each request to the strategy only once (the resend gets the first reply), so order handlers need no dedupe.

## Strategy side (`ctx.app`)

Full reference with JavaScript / Python / Rust examples: `### ctx.app` in `references/api.en.md` (Chinese: `api.zh.md`); declarations in `references/ctx.d.ts` (`IApp`, `IAppEvent`), `references/fmz.pyi` (`CtxApp`, `AppEvent`), `references/fmz.rs` (`ctx::app`).

| Call | Does |
|---|---|
| `ctx.app.poll(timeoutMs)` | next event or null. JavaScript can also wait together with push events: `ctx.poll({sources: ["engine", "app"]}, ms)` (`"all"` excludes `app`) |
| `ctx.app.reply(e, data)` | answer a request (`message` from `app.request`) or an `http` event (`{status, type, headers, body}`; Rust `ctx::app::reply_http`) |
| `ctx.app.fail(e, message)` | answer with an error: the page gets `backend`, HTTP gets 500 `{"error": message}` |
| `ctx.app.publish(topic, data, {retain})` | to every page subscribed to the topic; returns false when nobody is (nothing leaves the process); `retain` keeps the last message for later subscribers |
| `ctx.app.send(session, data)` | to one page session (`"*"` = all) |
| `ctx.app.subscribers(topic)` | 1 if any page subscribes, else 0: compute only when someone watches |
| `ctx.app.connected` | link to the gateway is up (Rust `ctx::app::connected()`) |

Event `type` (Rust: `kind`): `message` (`data` = `{method, params}` for a request, the content for `send`), `http` (`method`, `path`, `query`, `headers`, `ip`, `body` raw bytes), `open` / `close` (a page session), `subscribe` / `unsubscribe` (`topic`, `count` 1/0; the last unsubscribe arrives 10 s late). Every event from a page carries `role`, `uid`, `nick`, `session` where they apply. Bodies are JSON values or raw bytes (the page gets an ArrayBuffer). Outside a robot that backs a frontend (other robots, backtests) `ctx.app` is disconnected: `poll` returns null, `publish` / `send` return false.

Limits: 64 KB per published or sent message; 1 MB per reply, HTTP request and response body; a request unanswered for 10 s times out (the page may ask for up to 2 min); 8192 pending events; 30 messages/s upstream per page connection; 2 MB/s (burst 8 MB) pushed per robot, counted per delivery; 100 storage keys of up to 64 KB per user per app.

## Minimal example

Strategy (JavaScript):

```js
function main() {
    while (true) {
        var e = ctx.app.poll(1000)
        if (e && e.type === "message") {
            if (e.data.method === "status") {
                ctx.app.reply(e, {account: exchange.GetAccount()})            // anyone
            } else if (e.role !== "owner") {
                ctx.app.fail(e, "Only the owner can do this")
            } else if (e.data.method === "buy") {
                ctx.app.reply(e, {id: exchange.Buy(-1, e.data.params.amount)})
            } else {
                ctx.app.fail(e, "unknown method " + e.data.method)
            }
        }
        if (ctx.app.subscribers("ticker") > 0) {
            var t = exchange.GetTicker()
            if (t) ctx.app.publish("ticker", {last: t.Last, time: t.Time}, {retain: true})
        }
    }
}
```

`index.html` (replace the script address with `get_app.sdk`):

```html
<!doctype html>
<meta charset="utf-8">
<p>Last: <b id="last">-</b> <span id="state"></span></p>
<button id="buy">Buy 0.001</button>
<script src="SDK_ADDRESS_FROM_get_app"></script>
<script>
(async () => {
  const app = await AppKit.connect()
  app.on("status", s => { document.getElementById("state").textContent = s.online ? "" : "(strategy offline)" })
  app.subscribe("ticker", t => { document.getElementById("last").textContent = t.last })
  const buy = document.getElementById("buy")
  buy.hidden = app.role !== "owner"
  buy.onclick = async () => {
    try { alert("order " + (await app.request("buy", {amount: 0.001})).id) }
    catch (e) { alert(e.code + ": " + e.message) }
  }
})()
</script>
```
