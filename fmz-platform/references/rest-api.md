# FMZ extended REST API (generated from the user guide, section “Extended API Interface”)

Same API keys as MCP (website: `/m/account#apikey`). For REST the key's privileges are method names or `*` (scope names only apply to MCP). Prefer the MCP tools when they are available; this is for scripts, cron jobs and older integrations.

## Endpoint and signature

`POST https://www.fmz.com/api/v1` (youquant: `https://www.youquant.com/api/v1`), form-encoded fields:

| Field | Value |
|---|---|
| `version` | `"1.0"` |
| `access_key` | the key |
| `method` | method name, e.g. `GetRobotList` |
| `args` | JSON array of the positional arguments, e.g. `[0, 5, -1, ""]` |
| `nonce` | current time in milliseconds; must increase on every call (the server keeps the last one per key; ±1 h tolerance) |
| `sign` | `md5(version + "|" + method + "|" + args + "|" + nonce + "|" + secret_key)` as lowercase hex |

Direct verification (sending `secret_key` instead of `sign`) also works but exposes the secret in transit; avoid it.

```python
import hashlib, json, time, urllib.parse, urllib.request
def api(method, *args, access_key, secret_key, base="https://www.fmz.com"):
    d = {"version": "1.0", "access_key": access_key, "method": method,
         "args": json.dumps(list(args)), "nonce": int(time.time() * 1000)}
    d["sign"] = hashlib.md5(("%s|%s|%s|%d|%s" % (d["version"], d["method"], d["args"], d["nonce"], secret_key)).encode()).hexdigest()
    body = urllib.parse.urlencode(d).encode()
    return json.loads(urllib.request.urlopen(base + "/api/v1", body, timeout=30).read())
```

Response: `{"code": 0, "data": ...}`. Codes: 0 ok, 1 invalid API key, 2 invalid signature, 3 nonce error, 4 wrong method, 5 wrong parameters, 6 internal error.

## Robot status codes (REST returns numbers; MCP returns words)

| Code | Status |
|---|---|
| 0 | idle (queue) |
| 1 | running |
| 2 | stopping |
| 3 | exited (complete) |
| 4 | stopped |
| 5 | strategy error |
| -1 | rented strategy expired |
| -2 | node (docker) not found |
| -3 | strategy compile error |
| -4 | robot already running |
| -5 | insufficient balance |
| -6 | strategy concurrency limit exceeded |

## Methods

Arguments are positional (the `args` JSON array). Each entry below is the user guide's description.

### GetNodeList

The ```GetNodeList``` method is used to retrieve the list of docker nodes under the FMZ Quant Trading Platform account corresponding to the ```API KEY``` in the request.

Parameters:

- N
- o
- 
- p
- a
- r
- a
- m
- e
- t
- e
- r
- s

Returns: `

Returns: `

Returns: `

Returns: j

Returns: s

Returns: o

Returns: n

Returns: 

Returns: {

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: c

Returns: o

Returns: d

Returns: e

Returns: "

Returns: :

Returns: 

Returns: 0

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: d

Returns: a

Returns: t

Returns: a

Returns: "

Returns: :

Returns: 

Returns: {

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: r

Returns: e

Returns: s

Returns: u

Returns: l

Returns: t

Returns: "

Returns: :

Returns: 

Returns: {

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: a

Returns: l

Returns: l

Returns: "

Returns: :

Returns: 

Returns: 1

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: n

Returns: o

Returns: d

Returns: e

Returns: s

Returns: "

Returns: :

Returns: 

Returns: [

Returns: {

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: b

Returns: u

Returns: i

Returns: l

Returns: d

Returns: "

Returns: :

Returns: 

Returns: "

Returns: 3

Returns: .

Returns: 7

Returns: "

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: c

Returns: i

Returns: t

Returns: y

Returns: "

Returns: :

Returns: 

Returns: "

Returns: .

Returns: .

Returns: .

Returns: "

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: c

Returns: r

Returns: e

Returns: a

Returns: t

Returns: e

Returns: d

Returns: "

Returns: :

Returns: 

Returns: "

Returns: 2

Returns: 0

Returns: 2

Returns: 4

Returns: -

Returns: 1

Returns: 1

Returns: -

Returns: 0

Returns: 8

Returns: 

Returns: 0

Returns: 9

Returns: :

Returns: 2

Returns: 1

Returns: :

Returns: 0

Returns: 8

Returns: "

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: d

Returns: a

Returns: t

Returns: e

Returns: "

Returns: :

Returns: 

Returns: "

Returns: 2

Returns: 0

Returns: 2

Returns: 4

Returns: -

Returns: 1

Returns: 1

Returns: -

Returns: 0

Returns: 8

Returns: 

Returns: 1

Returns: 6

Returns: :

Returns: 3

Returns: 7

Returns: :

Returns: 1

Returns: 6

Returns: "

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: f

Returns: o

Returns: r

Returns: w

Returns: a

Returns: r

Returns: d

Returns: "

Returns: :

Returns: 

Returns: "

Returns: .

Returns: .

Returns: .

Returns: "

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: g

Returns: u

Returns: i

Returns: d

Returns: "

Returns: :

Returns: 

Returns: "

Returns: .

Returns: .

Returns: .

Returns: "

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: h

Returns: o

Returns: s

Returns: t

Returns: "

Returns: :

Returns: 

Returns: "

Returns: n

Returns: o

Returns: d

Returns: e

Returns: .

Returns: f

Returns: m

Returns: z

Returns: .

Returns: c

Returns: o

Returns: m

Returns: :

Returns: 9

Returns: 9

Returns: 0

Returns: 2

Returns: "

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: i

Returns: d

Returns: "

Returns: :

Returns: 

Returns: 1

Returns: 2

Returns: 3

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: i

Returns: p

Returns: "

Returns: :

Returns: 

Returns: "

Returns: .

Returns: .

Returns: .

Returns: "

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: i

Returns: s

Returns: _

Returns: o

Returns: w

Returns: n

Returns: e

Returns: r

Returns: "

Returns: :

Returns: 

Returns: t

Returns: r

Returns: u

Returns: e

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: l

Returns: o

Returns: a

Returns: d

Returns: e

Returns: d

Returns: "

Returns: :

Returns: 

Returns: 0

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: n

Returns: a

Returns: m

Returns: e

Returns: "

Returns: :

Returns: 

Returns: "

Returns: M

Returns: a

Returns: c

Returns: B

Returns: o

Returns: o

Returns: k

Returns: -

Returns: P

Returns: r

Returns: o

Returns: -

Returns: 2

Returns: .

Returns: l

Returns: o

Returns: c

Returns: a

Returns: l

Returns: "

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: o

Returns: n

Returns: l

Returns: i

Returns: n

Returns: e

Returns: "

Returns: :

Returns: 

Returns: t

Returns: r

Returns: u

Returns: e

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: o

Returns: s

Returns: "

Returns: :

Returns: 

Returns: "

Returns: d

Returns: a

Returns: r

Returns: w

Returns: i

Returns: n

Returns: /

Returns: a

Returns: m

Returns: d

Returns: 6

Returns: 4

Returns: "

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: p

Returns: e

Returns: e

Returns: r

Returns: "

Returns: :

Returns: 

Returns: "

Returns: .

Returns: .

Returns: .

Returns: "

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: p

Returns: u

Returns: b

Returns: l

Returns: i

Returns: c

Returns: "

Returns: :

Returns: 

Returns: 0

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: r

Returns: e

Returns: g

Returns: i

Returns: o

Returns: n

Returns: "

Returns: :

Returns: 

Returns: "

Returns: .

Returns: .

Returns: .

Returns: "

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: t

Returns: u

Returns: n

Returns: n

Returns: e

Returns: l

Returns: "

Returns: :

Returns: 

Returns: f

Returns: a

Returns: l

Returns: s

Returns: e

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: v

Returns: e

Returns: r

Returns: s

Returns: i

Returns: o

Returns: n

Returns: "

Returns: :

Returns: 

Returns: "

Returns: .

Returns: .

Returns: .

Returns: "

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: w

Returns: d

Returns: "

Returns: :

Returns: 

Returns: 0

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: }

Returns: ]

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: }

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: e

Returns: r

Returns: r

Returns: o

Returns: r

Returns: "

Returns: :

Returns: 

Returns: n

Returns: u

Returns: l

Returns: l

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: }

Returns: 

Returns: }

Returns: 

Returns: `

Returns: `

Returns: `

Returns: 

Returns: 

Returns: R

Returns: e

Returns: t

Returns: u

Returns: r

Returns: n

Returns: 

Returns: v

Returns: a

Returns: l

Returns: u

Returns: e

Returns: 

Returns: f

Returns: i

Returns: e

Returns: l

Returns: d

Returns: 

Returns: d

Returns: e

Returns: s

Returns: c

Returns: r

Returns: i

Returns: p

Returns: t

Returns: i

Returns: o

Returns: n

Returns: s

Returns: 

Returns: (

Returns: f

Returns: i

Returns: e

Returns: l

Returns: d

Returns: s

Returns: 

Returns: w

Returns: i

Returns: t

Returns: h

Returns: 

Returns: o

Returns: b

Returns: v

Returns: i

Returns: o

Returns: u

Returns: s

Returns: 

Returns: l

Returns: i

Returns: t

Returns: e

Returns: r

Returns: a

Returns: l

Returns: 

Returns: m

Returns: e

Returns: a

Returns: n

Returns: i

Returns: n

Returns: g

Returns: s

Returns: 

Returns: a

Returns: r

Returns: e

Returns: 

Returns: n

Returns: o

Returns: t

Returns: 

Returns: e

Returns: l

Returns: a

Returns: b

Returns: o

Returns: r

Returns: a

Returns: t

Returns: e

Returns: d

Returns: )

Returns: :

Returns: 

Returns: -

Returns: 

Returns: a

Returns: l

Returns: l

Returns: :

Returns: 

Returns: T

Returns: o

Returns: t

Returns: a

Returns: l

Returns: 

Returns: n

Returns: u

Returns: m

Returns: b

Returns: e

Returns: r

Returns: 

Returns: o

Returns: f

Returns: 

Returns: d

Returns: o

Returns: c

Returns: k

Returns: e

Returns: r

Returns: 

Returns: n

Returns: o

Returns: d

Returns: e

Returns: s

Returns: 

Returns: a

Returns: s

Returns: s

Returns: o

Returns: c

Returns: i

Returns: a

Returns: t

Returns: e

Returns: d

Returns: 

Returns: w

Returns: i

Returns: t

Returns: h

Returns: 

Returns: t

Returns: h

Returns: e

Returns: 

Returns: c

Returns: u

Returns: r

Returns: r

Returns: e

Returns: n

Returns: t

Returns: 

Returns: a

Returns: c

Returns: c

Returns: o

Returns: u

Returns: n

Returns: t

Returns: .

Returns: 

Returns: -

Returns: 

Returns: n

Returns: o

Returns: d

Returns: e

Returns: s

Returns: :

Returns: 

Returns: L

Returns: i

Returns: s

Returns: t

Returns: 

Returns: o

Returns: f

Returns: 

Returns: d

Returns: e

Returns: t

Returns: a

Returns: i

Returns: l

Returns: e

Returns: d

Returns: 

Returns: i

Returns: n

Returns: f

Returns: o

Returns: r

Returns: m

Returns: a

Returns: t

Returns: i

Returns: o

Returns: n

Returns: 

Returns: f

Returns: o

Returns: r

Returns: 

Returns: d

Returns: o

Returns: c

Returns: k

Returns: e

Returns: r

Returns: 

Returns: n

Returns: o

Returns: d

Returns: e

Returns: s

Returns: .

Returns: 

Returns: 

Returns: 

Returns: -

Returns: 

Returns: b

Returns: u

Returns: i

Returns: l

Returns: d

Returns: :

Returns: 

Returns: V

Returns: e

Returns: r

Returns: s

Returns: i

Returns: o

Returns: n

Returns: 

Returns: n

Returns: u

Returns: m

Returns: b

Returns: e

Returns: r

Returns: .

Returns: 

Returns: 

Returns: 

Returns: -

Returns: 

Returns: c

Returns: i

Returns: t

Returns: y

Returns: :

Returns: 

Returns: C

Returns: i

Returns: t

Returns: y

Returns: 

Returns: l

Returns: o

Returns: c

Returns: a

Returns: t

Returns: i

Returns: o

Returns: n

Returns: .

Returns: 

Returns: 

Returns: 

Returns: -

Returns: 

Returns: i

Returns: s

Returns: _

Returns: o

Returns: w

Returns: n

Returns: e

Returns: r

Returns: :

Returns: 

Returns: t

Returns: r

Returns: u

Returns: e

Returns: 

Returns: i

Returns: n

Returns: d

Returns: i

Returns: c

Returns: a

Returns: t

Returns: e

Returns: s

Returns: 

Returns: p

Returns: r

Returns: i

Returns: v

Returns: a

Returns: t

Returns: e

Returns: 

Returns: d

Returns: o

Returns: c

Returns: k

Returns: e

Returns: r

Returns: ,

Returns: 

Returns: f

Returns: a

Returns: l

Returns: s

Returns: e

Returns: 

Returns: i

Returns: n

Returns: d

Returns: i

Returns: c

Returns: a

Returns: t

Returns: e

Returns: s

Returns: 

Returns: p

Returns: u

Returns: b

Returns: l

Returns: i

Returns: c

Returns: 

Returns: d

Returns: o

Returns: c

Returns: k

Returns: e

Returns: r

Returns: .

Returns: 

Returns: 

Returns: 

Returns: -

Returns: 

Returns: l

Returns: o

Returns: a

Returns: d

Returns: e

Returns: d

Returns: :

Returns: 

Returns: L

Returns: o

Returns: a

Returns: d

Returns: 

Returns: a

Returns: m

Returns: o

Returns: u

Returns: n

Returns: t

Returns: ,

Returns: 

Returns: i

Returns: .

Returns: e

Returns: .

Returns: ,

Returns: 

Returns: t

Returns: h

Returns: e

Returns: 

Returns: n

Returns: u

Returns: m

Returns: b

Returns: e

Returns: r

Returns: 

Returns: o

Returns: f

Returns: 

Returns: c

Returns: u

Returns: r

Returns: r

Returns: e

Returns: n

Returns: t

Returns: l

Returns: y

Returns: 

Returns: r

Returns: u

Returns: n

Returns: n

Returns: i

Returns: n

Returns: g

Returns: 

Returns: s

Returns: t

Returns: r

Returns: a

Returns: t

Returns: e

Returns: g

Returns: y

Returns: 

Returns: i

Returns: n

Returns: s

Returns: t

Returns: a

Returns: n

Returns: c

Returns: e

Returns: s

Returns: .

Returns: 

Returns: 

Returns: 

Returns: -

Returns: 

Returns: p

Returns: u

Returns: b

Returns: l

Returns: i

Returns: c

Returns: :

Returns: 

Returns: 0

Returns: 

Returns: i

Returns: n

Returns: d

Returns: i

Returns: c

Returns: a

Returns: t

Returns: e

Returns: s

Returns: 

Returns: p

Returns: r

Returns: i

Returns: v

Returns: a

Returns: t

Returns: e

Returns: 

Returns: d

Returns: o

Returns: c

Returns: k

Returns: e

Returns: r

Returns: ,

Returns: 

Returns: 1

Returns: 

Returns: i

Returns: n

Returns: d

Returns: i

Returns: c

Returns: a

Returns: t

Returns: e

Returns: s

Returns: 

Returns: p

Returns: u

Returns: b

Returns: l

Returns: i

Returns: c

Returns: 

Returns: d

Returns: o

Returns: c

Returns: k

Returns: e

Returns: r

Returns: .

Returns: 

Returns: 

Returns: 

Returns: -

Returns: 

Returns: r

Returns: e

Returns: g

Returns: i

Returns: o

Returns: n

Returns: :

Returns: 

Returns: G

Returns: e

Returns: o

Returns: g

Returns: r

Returns: a

Returns: p

Returns: h

Returns: i

Returns: c

Returns: 

Returns: l

Returns: o

Returns: c

Returns: a

Returns: t

Returns: i

Returns: o

Returns: n

Returns: .

Returns: 

Returns: 

Returns: 

Returns: -

Returns: 

Returns: v

Returns: e

Returns: r

Returns: s

Returns: i

Returns: o

Returns: n

Returns: :

Returns: 

Returns: D

Returns: e

Returns: t

Returns: a

Returns: i

Returns: l

Returns: e

Returns: d

Returns: 

Returns: v

Returns: e

Returns: r

Returns: s

Returns: i

Returns: o

Returns: n

Returns: 

Returns: i

Returns: n

Returns: f

Returns: o

Returns: r

Returns: m

Returns: a

Returns: t

Returns: i

Returns: o

Returns: n

Returns: 

Returns: o

Returns: f

Returns: 

Returns: t

Returns: h

Returns: e

Returns: 

Returns: d

Returns: o

Returns: c

Returns: k

Returns: e

Returns: r

Returns: .

Returns: 

Returns: 

Returns: 

Returns: -

Returns: 

Returns: w

Returns: d

Returns: :

Returns: 

Returns: O

Returns: f

Returns: f

Returns: l

Returns: i

Returns: n

Returns: e

Returns: 

Returns: a

Returns: l

Returns: a

Returns: r

Returns: m

Returns: 

Returns: s

Returns: w

Returns: i

Returns: t

Returns: c

Returns: h

Returns: ,

Returns: 

Returns: 0

Returns: 

Returns: i

Returns: n

Returns: d

Returns: i

Returns: c

Returns: a

Returns: t

Returns: e

Returns: s

Returns: 

Returns: n

Returns: o

Returns: t

Returns: 

Returns: e

Returns: n

Returns: a

Returns: b

Returns: l

Returns: e

Returns: d

Returns: .

Returns: 

Returns: O

Returns: n

Returns: e

Returns: -

Returns: c

Returns: l

Returns: i

Returns: c

Returns: k

Returns: 

Returns: d

Returns: e

Returns: p

Returns: l

Returns: o

Returns: y

Returns: e

Returns: d

Returns: 

Returns: d

Returns: o

Returns: c

Returns: k

Returns: e

Returns: r

Returns: s

Returns: 

Returns: c

Returns: o

Returns: n

Returns: t

Returns: a

Returns: i

Returns: n

Returns: 

Returns: a

Returns: d

Returns: d

Returns: i

Returns: t

Returns: i

Returns: o

Returns: n

Returns: a

Returns: l

Returns: 

Returns: i

Returns: n

Returns: f

Returns: o

Returns: r

Returns: m

Returns: a

Returns: t

Returns: i

Returns: o

Returns: n

Returns: ,

Returns: 

Returns: w

Returns: i

Returns: t

Returns: h

Returns: 

Returns: r

Returns: e

Returns: l

Returns: a

Returns: t

Returns: e

Returns: d

Returns: 

Returns: f

Returns: i

Returns: e

Returns: l

Returns: d

Returns: s

Returns: 

Returns: p

Returns: r

Returns: e

Returns: f

Returns: i

Returns: x

Returns: e

Returns: d

Returns: 

Returns: b

Returns: y

Returns: 

Returns: `

Returns: `

Returns: `

Returns: e

Returns: c

Returns: s

Returns: _

Returns: `

Returns: `

Returns: `

Returns: 

Returns: a

Returns: n

Returns: d

Returns: 

Returns: `

Returns: `

Returns: `

Returns: u

Returns: n

Returns: i

Returns: t

Returns: _

Returns: `

Returns: `

Returns: `

Returns: ,

Returns: 

Returns: r

Returns: e

Returns: c

Returns: o

Returns: r

Returns: d

Returns: i

Returns: n

Returns: g

Returns: 

Returns: i

Returns: n

Returns: f

Returns: o

Returns: r

Returns: m

Returns: a

Returns: t

Returns: i

Returns: o

Returns: n

Returns: 

Returns: a

Returns: b

Returns: o

Returns: u

Returns: t

Returns: 

Returns: t

Returns: h

Returns: e

Returns: 

Returns: o

Returns: n

Returns: e

Returns: -

Returns: c

Returns: l

Returns: i

Returns: c

Returns: k

Returns: 

Returns: d

Returns: e

Returns: p

Returns: l

Returns: o

Returns: y

Returns: e

Returns: d

Returns: 

Returns: d

Returns: o

Returns: c

Returns: k

Returns: e

Returns: r

Returns: 

Returns: s

Returns: e

Returns: r

Returns: v

Returns: e

Returns: r

Returns: 

Returns: (

Returns: o

Returns: p

Returns: e

Returns: r

Returns: a

Returns: t

Returns: o

Returns: r

Returns: 

Returns: n

Returns: a

Returns: m

Returns: e

Returns: ,

Returns: 

Returns: c

Returns: o

Returns: n

Returns: f

Returns: i

Returns: g

Returns: u

Returns: r

Returns: a

Returns: t

Returns: i

Returns: o

Returns: n

Returns: ,

Returns: 

Returns: s

Returns: t

Returns: a

Returns: t

Returns: u

Returns: s

Returns: ,

Returns: 

Returns: e

Returns: t

Returns: c

Returns: .

Returns: )

Returns: ,

Returns: 

Returns: b

Returns: i

Returns: l

Returns: l

Returns: i

Returns: n

Returns: g

Returns: 

Returns: c

Returns: y

Returns: c

Returns: l

Returns: e

Returns: ,

Returns: 

Returns: p

Returns: r

Returns: i

Returns: c

Returns: e

Returns: ,

Returns: 

Returns: a

Returns: n

Returns: d

Returns: 

Returns: o

Returns: t

Returns: h

Returns: e

Returns: r

Returns: 

Returns: i

Returns: n

Returns: f

Returns: o

Returns: r

Returns: m

Returns: a

Returns: t

Returns: i

Returns: o

Returns: n

Returns: ,

Returns: 

Returns: w

Returns: h

Returns: i

Returns: c

Returns: h

Returns: 

Returns: w

Returns: i

Returns: l

Returns: l

Returns: 

Returns: n

Returns: o

Returns: t

Returns: 

Returns: b

Returns: e

Returns: 

Returns: d

Returns: e

Returns: t

Returns: a

Returns: i

Returns: l

Returns: e

Returns: d

Returns: 

Returns: h

Returns: e

Returns: r

Returns: e

Returns: .

### GetRobotGroupList

The ```GetRobotGroupList``` method is used to get the list of live trading groups under the FMZ Quant Trading Platform account corresponding to the ```API KEY``` in the request.

Parameters:

- N
- o
- 
- p
- a
- r
- a
- m
- e
- t
- e
- r
- s

Returns: `

Returns: `

Returns: `

Returns: j

Returns: s

Returns: o

Returns: n

Returns: 

Returns: {

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: c

Returns: o

Returns: d

Returns: e

Returns: "

Returns: :

Returns: 

Returns: 0

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: d

Returns: a

Returns: t

Returns: a

Returns: "

Returns: :

Returns: 

Returns: {

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: r

Returns: e

Returns: s

Returns: u

Returns: l

Returns: t

Returns: "

Returns: :

Returns: 

Returns: {

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: i

Returns: t

Returns: e

Returns: m

Returns: s

Returns: "

Returns: :

Returns: 

Returns: [

Returns: {

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: i

Returns: d

Returns: "

Returns: :

Returns: 

Returns: 3

Returns: 4

Returns: 1

Returns: 7

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: n

Returns: a

Returns: m

Returns: e

Returns: "

Returns: :

Returns: 

Returns: "

Returns: T

Returns: e

Returns: s

Returns: t

Returns: "

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: }

Returns: ,

Returns: 

Returns: {

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: i

Returns: d

Returns: "

Returns: :

Returns: 

Returns: 3

Returns: 6

Returns: 0

Returns: 8

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: n

Returns: a

Returns: m

Returns: e

Returns: "

Returns: :

Returns: 

Returns: "

Returns: L

Returns: i

Returns: v

Returns: e

Returns: 

Returns: T

Returns: r

Returns: a

Returns: d

Returns: i

Returns: n

Returns: g

Returns: 

Returns: D

Returns: e

Returns: m

Returns: o

Returns: "

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: }

Returns: ]

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: }

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: e

Returns: r

Returns: r

Returns: o

Returns: r

Returns: "

Returns: :

Returns: 

Returns: n

Returns: u

Returns: l

Returns: l

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: }

Returns: 

Returns: }

Returns: 

Returns: `

Returns: `

Returns: `

Returns: 

Returns: 

Returns: -

Returns: 

Returns: i

Returns: t

Returns: e

Returns: m

Returns: s

Returns: :

Returns: 

Returns: L

Returns: i

Returns: v

Returns: e

Returns: 

Returns: t

Returns: r

Returns: a

Returns: d

Returns: i

Returns: n

Returns: g

Returns: 

Returns: g

Returns: r

Returns: o

Returns: u

Returns: p

Returns: 

Returns: i

Returns: n

Returns: f

Returns: o

Returns: r

Returns: m

Returns: a

Returns: t

Returns: i

Returns: o

Returns: n

Returns: .

Returns: 

Returns: 

Returns: 

Returns: -

Returns: 

Returns: i

Returns: d

Returns: :

Returns: 

Returns: L

Returns: i

Returns: v

Returns: e

Returns: 

Returns: t

Returns: r

Returns: a

Returns: d

Returns: i

Returns: n

Returns: g

Returns: 

Returns: g

Returns: r

Returns: o

Returns: u

Returns: p

Returns: 

Returns: I

Returns: D

Returns: .

Returns: 

Returns: 

Returns: 

Returns: -

Returns: 

Returns: n

Returns: a

Returns: m

Returns: e

Returns: :

Returns: 

Returns: L

Returns: i

Returns: v

Returns: e

Returns: 

Returns: t

Returns: r

Returns: a

Returns: d

Returns: i

Returns: n

Returns: g

Returns: 

Returns: g

Returns: r

Returns: o

Returns: u

Returns: p

Returns: 

Returns: n

Returns: a

Returns: m

Returns: e

Returns: .

Returns: 

Returns: T

Returns: h

Returns: e

Returns: 

Returns: `

Returns: `

Returns: `

Returns: i

Returns: t

Returns: e

Returns: m

Returns: s

Returns: `

Returns: `

Returns: `

Returns: 

Returns: f

Returns: i

Returns: e

Returns: l

Returns: d

Returns: 

Returns: o

Returns: n

Returns: l

Returns: y

Returns: 

Returns: r

Returns: e

Returns: c

Returns: o

Returns: r

Returns: d

Returns: s

Returns: 

Returns: n

Returns: e

Returns: w

Returns: l

Returns: y

Returns: 

Returns: c

Returns: r

Returns: e

Returns: a

Returns: t

Returns: e

Returns: d

Returns: 

Returns: g

Returns: r

Returns: o

Returns: u

Returns: p

Returns: s

Returns: ,

Returns: 

Returns: t

Returns: h

Returns: e

Returns: 

Returns: "

Returns: D

Returns: e

Returns: f

Returns: a

Returns: u

Returns: l

Returns: t

Returns: "

Returns: 

Returns: g

Returns: r

Returns: o

Returns: u

Returns: p

Returns: 

Returns: i

Returns: s

Returns: 

Returns: n

Returns: o

Returns: t

Returns: 

Returns: i

Returns: n

Returns: c

Returns: l

Returns: u

Returns: d

Returns: e

Returns: d

Returns: 

Returns: i

Returns: n

Returns: 

Returns: `

Returns: `

Returns: `

Returns: i

Returns: t

Returns: e

Returns: m

Returns: s

Returns: `

Returns: `

Returns: `

Returns: .

### GetPlatformList

The ```GetPlatformList``` method is used to get the list of configured exchanges under the FMZ Quant Trading Platform account corresponding to the ```API KEY``` in the request.

Parameters:

- N
- o
- 
- p
- a
- r
- a
- m
- e
- t
- e
- r
- s

Returns: `

Returns: `

Returns: `

Returns: j

Returns: s

Returns: o

Returns: n

Returns: 

Returns: {

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: c

Returns: o

Returns: d

Returns: e

Returns: "

Returns: :

Returns: 

Returns: 0

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: d

Returns: a

Returns: t

Returns: a

Returns: "

Returns: :

Returns: 

Returns: {

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: r

Returns: e

Returns: s

Returns: u

Returns: l

Returns: t

Returns: "

Returns: :

Returns: 

Returns: {

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: a

Returns: l

Returns: l

Returns: "

Returns: :

Returns: 

Returns: 2

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: p

Returns: l

Returns: a

Returns: t

Returns: f

Returns: o

Returns: r

Returns: m

Returns: s

Returns: "

Returns: :

Returns: 

Returns: [

Returns: {

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: c

Returns: a

Returns: t

Returns: e

Returns: g

Returns: o

Returns: r

Returns: y

Returns: "

Returns: :

Returns: 

Returns: "

Returns: 加

Returns: 密

Returns: 货

Returns: 币

Returns: |

Returns: |

Returns: C

Returns: r

Returns: y

Returns: p

Returns: t

Returns: o

Returns: "

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: d

Returns: a

Returns: t

Returns: e

Returns: "

Returns: :

Returns: 

Returns: "

Returns: 2

Returns: 0

Returns: 2

Returns: 3

Returns: -

Returns: 1

Returns: 2

Returns: -

Returns: 0

Returns: 7

Returns: 

Returns: 1

Returns: 3

Returns: :

Returns: 4

Returns: 4

Returns: :

Returns: 5

Returns: 2

Returns: "

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: e

Returns: i

Returns: d

Returns: "

Returns: :

Returns: 

Returns: "

Returns: B

Returns: i

Returns: n

Returns: a

Returns: n

Returns: c

Returns: e

Returns: "

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: i

Returns: d

Returns: "

Returns: :

Returns: 

Returns: 1

Returns: 2

Returns: 3

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: l

Returns: a

Returns: b

Returns: e

Returns: l

Returns: "

Returns: :

Returns: 

Returns: "

Returns: 币

Returns: 安

Returns: "

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: l

Returns: o

Returns: g

Returns: o

Returns: "

Returns: :

Returns: 

Returns: "

Returns: .

Returns: .

Returns: .

Returns: "

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: n

Returns: a

Returns: m

Returns: e

Returns: "

Returns: :

Returns: 

Returns: "

Returns: 币

Returns: 安

Returns: 现

Returns: 货

Returns: |

Returns: B

Returns: i

Returns: n

Returns: a

Returns: n

Returns: c

Returns: e

Returns: "

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: s

Returns: t

Returns: o

Returns: c

Returns: k

Returns: s

Returns: "

Returns: :

Returns: 

Returns: [

Returns: "

Returns: B

Returns: T

Returns: C

Returns: _

Returns: U

Returns: S

Returns: D

Returns: T

Returns: "

Returns: ,

Returns: 

Returns: "

Returns: L

Returns: T

Returns: C

Returns: _

Returns: U

Returns: S

Returns: D

Returns: T

Returns: "

Returns: ,

Returns: 

Returns: "

Returns: E

Returns: T

Returns: H

Returns: _

Returns: U

Returns: S

Returns: D

Returns: T

Returns: "

Returns: ,

Returns: 

Returns: "

Returns: E

Returns: T

Returns: C

Returns: _

Returns: U

Returns: S

Returns: D

Returns: T

Returns: "

Returns: ,

Returns: 

Returns: "

Returns: B

Returns: T

Returns: C

Returns: _

Returns: T

Returns: U

Returns: S

Returns: D

Returns: "

Returns: ,

Returns: 

Returns: "

Returns: E

Returns: T

Returns: H

Returns: _

Returns: T

Returns: U

Returns: S

Returns: D

Returns: "

Returns: ,

Returns: 

Returns: "

Returns: B

Returns: N

Returns: B

Returns: _

Returns: T

Returns: U

Returns: S

Returns: D

Returns: "

Returns: ]

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: w

Returns: e

Returns: b

Returns: s

Returns: i

Returns: t

Returns: e

Returns: "

Returns: :

Returns: 

Returns: "

Returns: .

Returns: .

Returns: .

Returns: "

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: }

Returns: ,

Returns: 

Returns: {

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: c

Returns: a

Returns: t

Returns: e

Returns: g

Returns: o

Returns: r

Returns: y

Returns: "

Returns: :

Returns: 

Returns: "

Returns: 通

Returns: 用

Returns: 协

Returns: 议

Returns: |

Returns: C

Returns: u

Returns: s

Returns: t

Returns: o

Returns: m

Returns: 

Returns: P

Returns: r

Returns: o

Returns: t

Returns: o

Returns: c

Returns: o

Returns: l

Returns: "

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: d

Returns: a

Returns: t

Returns: e

Returns: "

Returns: :

Returns: 

Returns: "

Returns: 2

Returns: 0

Returns: 2

Returns: 0

Returns: -

Returns: 1

Returns: 1

Returns: -

Returns: 0

Returns: 9

Returns: 

Returns: 1

Returns: 1

Returns: :

Returns: 2

Returns: 3

Returns: :

Returns: 4

Returns: 8

Returns: "

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: e

Returns: i

Returns: d

Returns: "

Returns: :

Returns: 

Returns: "

Returns: E

Returns: x

Returns: c

Returns: h

Returns: a

Returns: n

Returns: g

Returns: e

Returns: "

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: i

Returns: d

Returns: "

Returns: :

Returns: 

Returns: 1

Returns: 2

Returns: 3

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: l

Returns: a

Returns: b

Returns: e

Returns: l

Returns: "

Returns: :

Returns: 

Returns: "

Returns: X

Returns: X

Returns: 交

Returns: 易

Returns: 所

Returns: R

Returns: E

Returns: S

Returns: T

Returns: 协

Returns: 议

Returns: "

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: l

Returns: o

Returns: g

Returns: o

Returns: "

Returns: :

Returns: 

Returns: "

Returns: .

Returns: .

Returns: .

Returns: "

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: n

Returns: a

Returns: m

Returns: e

Returns: "

Returns: :

Returns: 

Returns: "

Returns: 通

Returns: 用

Returns: 协

Returns: 议

Returns: |

Returns: C

Returns: u

Returns: s

Returns: t

Returns: o

Returns: m

Returns: 

Returns: P

Returns: r

Returns: o

Returns: t

Returns: o

Returns: c

Returns: o

Returns: l

Returns: "

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: s

Returns: t

Returns: o

Returns: c

Returns: k

Returns: s

Returns: "

Returns: :

Returns: 

Returns: [

Returns: "

Returns: B

Returns: T

Returns: C

Returns: _

Returns: U

Returns: S

Returns: D

Returns: T

Returns: "

Returns: ,

Returns: 

Returns: "

Returns: E

Returns: T

Returns: H

Returns: _

Returns: U

Returns: S

Returns: D

Returns: T

Returns: "

Returns: ]

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: w

Returns: e

Returns: b

Returns: s

Returns: i

Returns: t

Returns: e

Returns: "

Returns: :

Returns: 

Returns: "

Returns: "

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: }

Returns: ]

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: }

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: e

Returns: r

Returns: r

Returns: o

Returns: r

Returns: "

Returns: :

Returns: 

Returns: n

Returns: u

Returns: l

Returns: l

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: }

Returns: 

Returns: }

Returns: 

Returns: `

Returns: `

Returns: `

Returns: 

Returns: 

Returns: -

Returns: 

Returns: a

Returns: l

Returns: l

Returns: :

Returns: 

Returns: T

Returns: o

Returns: t

Returns: a

Returns: l

Returns: 

Returns: n

Returns: u

Returns: m

Returns: b

Returns: e

Returns: r

Returns: 

Returns: o

Returns: f

Returns: 

Returns: c

Returns: o

Returns: n

Returns: f

Returns: i

Returns: g

Returns: u

Returns: r

Returns: e

Returns: d

Returns: 

Returns: e

Returns: x

Returns: c

Returns: h

Returns: a

Returns: n

Returns: g

Returns: e

Returns: 

Returns: o

Returns: b

Returns: j

Returns: e

Returns: c

Returns: t

Returns: s

Returns: .

Returns: 

Returns: -

Returns: 

Returns: p

Returns: l

Returns: a

Returns: t

Returns: f

Returns: o

Returns: r

Returns: m

Returns: s

Returns: :

Returns: 

Returns: E

Returns: x

Returns: c

Returns: h

Returns: a

Returns: n

Returns: g

Returns: e

Returns: 

Returns: r

Returns: e

Returns: l

Returns: a

Returns: t

Returns: e

Returns: d

Returns: 

Returns: i

Returns: n

Returns: f

Returns: o

Returns: r

Returns: m

Returns: a

Returns: t

Returns: i

Returns: o

Returns: n

Returns: .

Returns: 

Returns: 

Returns: 

Returns: -

Returns: 

Returns: e

Returns: i

Returns: d

Returns: :

Returns: 

Returns: E

Returns: x

Returns: c

Returns: h

Returns: a

Returns: n

Returns: g

Returns: e

Returns: 

Returns: i

Returns: d

Returns: e

Returns: n

Returns: t

Returns: i

Returns: f

Returns: i

Returns: e

Returns: r

Returns: 

Returns: o

Returns: n

Returns: 

Returns: t

Returns: h

Returns: e

Returns: 

Returns: F

Returns: M

Returns: Z

Returns: 

Returns: Q

Returns: u

Returns: a

Returns: n

Returns: t

Returns: 

Returns: T

Returns: r

Returns: a

Returns: d

Returns: i

Returns: n

Returns: g

Returns: 

Returns: P

Returns: l

Returns: a

Returns: t

Returns: f

Returns: o

Returns: r

Returns: m

Returns: ,

Returns: 

Returns: `

Returns: `

Returns: `

Returns: e

Returns: i

Returns: d

Returns: `

Returns: `

Returns: `

Returns: 

Returns: i

Returns: s

Returns: 

Returns: r

Returns: e

Returns: q

Returns: u

Returns: i

Returns: r

Returns: e

Returns: d

Returns: 

Returns: i

Returns: n

Returns: 

Returns: c

Returns: e

Returns: r

Returns: t

Returns: a

Returns: i

Returns: n

Returns: 

Returns: c

Returns: o

Returns: n

Returns: f

Returns: i

Returns: g

Returns: u

Returns: r

Returns: a

Returns: t

Returns: i

Returns: o

Returns: n

Returns: s

Returns: 

Returns: a

Returns: n

Returns: d

Returns: 

Returns: p

Returns: a

Returns: r

Returns: a

Returns: m

Returns: e

Returns: t

Returns: e

Returns: r

Returns: s

Returns: .

### GetRobotList

The ```GetRobotList``` method is used to get the list of live trading bots under the FMZ Quant Trading Platform account corresponding to the ```API KEY``` in the request.

Parameters:

- `offset` (number, optional): Offset setting for pagination query.
- `length` (number, optional): Data length setting for pagination query.
- `robotStatus` (number, optional): Specify the status of live trading bots to query, refer to Extended API Interface ["Live Trading Status Codes"](/user-guide/extended-api-interface/live-trading-status-codes), pass ```-1``` to get all live trading bots.
- `label` (string, optional): Specify the custom label of live trading bots to query, can filter all live trading bots containing this label.
- `keyWord` (string, optional): Query keyword.

Returns: `

Returns: `

Returns: `

Returns: j

Returns: s

Returns: o

Returns: n

Returns: 

Returns: {

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: c

Returns: o

Returns: d

Returns: e

Returns: "

Returns: :

Returns: 

Returns: 0

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: d

Returns: a

Returns: t

Returns: a

Returns: "

Returns: :

Returns: 

Returns: {

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: r

Returns: e

Returns: s

Returns: u

Returns: l

Returns: t

Returns: "

Returns: :

Returns: 

Returns: {

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: a

Returns: l

Returns: l

Returns: "

Returns: :

Returns: 

Returns: 1

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: c

Returns: o

Returns: n

Returns: c

Returns: u

Returns: r

Returns: r

Returns: e

Returns: n

Returns: t

Returns: "

Returns: :

Returns: 

Returns: 0

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: r

Returns: o

Returns: b

Returns: o

Returns: t

Returns: s

Returns: "

Returns: :

Returns: 

Returns: [

Returns: {

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: c

Returns: h

Returns: a

Returns: r

Returns: g

Returns: e

Returns: _

Returns: t

Returns: i

Returns: m

Returns: e

Returns: "

Returns: :

Returns: 

Returns: 1

Returns: 7

Returns: 3

Returns: 1

Returns: 6

Returns: 5

Returns: 4

Returns: 8

Returns: 4

Returns: 6

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: d

Returns: a

Returns: t

Returns: e

Returns: "

Returns: :

Returns: 

Returns: "

Returns: 2

Returns: 0

Returns: 2

Returns: 4

Returns: -

Returns: 1

Returns: 1

Returns: -

Returns: 1

Returns: 2

Returns: 

Returns: 1

Returns: 4

Returns: :

Returns: 0

Returns: 5

Returns: :

Returns: 2

Returns: 9

Returns: "

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: e

Returns: n

Returns: d

Returns: _

Returns: t

Returns: i

Returns: m

Returns: e

Returns: "

Returns: :

Returns: 

Returns: "

Returns: 2

Returns: 0

Returns: 2

Returns: 4

Returns: -

Returns: 1

Returns: 1

Returns: -

Returns: 1

Returns: 5

Returns: 

Returns: 1

Returns: 4

Returns: :

Returns: 5

Returns: 6

Returns: :

Returns: 3

Returns: 2

Returns: "

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: f

Returns: i

Returns: x

Returns: e

Returns: d

Returns: _

Returns: i

Returns: d

Returns: "

Returns: :

Returns: 

Returns: 4

Returns: 5

Returns: 0

Returns: 9

Returns: 1

Returns: 5

Returns: 3

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: i

Returns: d

Returns: "

Returns: :

Returns: 

Returns: 5

Returns: 9

Returns: 1

Returns: 0

Returns: 2

Returns: 6

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: i

Returns: s

Returns: _

Returns: s

Returns: a

Returns: n

Returns: d

Returns: b

Returns: o

Returns: x

Returns: "

Returns: :

Returns: 

Returns: 0

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: n

Returns: a

Returns: m

Returns: e

Returns: "

Returns: :

Returns: 

Returns: "

Returns: T

Returns: e

Returns: s

Returns: t

Returns: "

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: n

Returns: o

Returns: d

Returns: e

Returns: _

Returns: g

Returns: u

Returns: i

Returns: d

Returns: "

Returns: :

Returns: 

Returns: "

Returns: 4

Returns: 5

Returns: 8

Returns: 9

Returns: 1

Returns: b

Returns: c

Returns: f

Returns: 3

Returns: d

Returns: 5

Returns: 7

Returns: f

Returns: 9

Returns: 9

Returns: b

Returns: 0

Returns: 8

Returns: a

Returns: 4

Returns: 3

Returns: d

Returns: f

Returns: f

Returns: 7

Returns: 6

Returns: e

Returns: e

Returns: 1

Returns: e

Returns: a

Returns: 1

Returns: "

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: n

Returns: o

Returns: d

Returns: e

Returns: _

Returns: i

Returns: d

Returns: "

Returns: :

Returns: 

Returns: 4

Returns: 5

Returns: 1

Returns: 9

Returns: 1

Returns: 5

Returns: 3

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: n

Returns: o

Returns: d

Returns: e

Returns: _

Returns: p

Returns: u

Returns: b

Returns: l

Returns: i

Returns: c

Returns: "

Returns: :

Returns: 

Returns: 0

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: p

Returns: r

Returns: o

Returns: f

Returns: i

Returns: t

Returns: "

Returns: :

Returns: 

Returns: 0

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: p

Returns: u

Returns: b

Returns: l

Returns: i

Returns: c

Returns: "

Returns: :

Returns: 

Returns: 0

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: r

Returns: e

Returns: f

Returns: r

Returns: e

Returns: s

Returns: h

Returns: "

Returns: :

Returns: 

Returns: 1

Returns: 7

Returns: 3

Returns: 1

Returns: 6

Returns: 5

Returns: 1

Returns: 2

Returns: 5

Returns: 7

Returns: 0

Returns: 0

Returns: 0

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: s

Returns: t

Returns: a

Returns: r

Returns: t

Returns: _

Returns: t

Returns: i

Returns: m

Returns: e

Returns: "

Returns: :

Returns: 

Returns: "

Returns: 2

Returns: 0

Returns: 2

Returns: 4

Returns: -

Returns: 1

Returns: 1

Returns: -

Returns: 1

Returns: 5

Returns: 

Returns: 1

Returns: 4

Returns: :

Returns: 5

Returns: 6

Returns: :

Returns: 3

Returns: 0

Returns: "

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: s

Returns: t

Returns: a

Returns: t

Returns: u

Returns: s

Returns: "

Returns: :

Returns: 

Returns: 3

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: s

Returns: t

Returns: r

Returns: a

Returns: t

Returns: e

Returns: g

Returns: y

Returns: _

Returns: i

Returns: d

Returns: "

Returns: :

Returns: 

Returns: 4

Returns: 1

Returns: 1

Returns: 6

Returns: 7

Returns: 0

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: s

Returns: t

Returns: r

Returns: a

Returns: t

Returns: e

Returns: g

Returns: y

Returns: _

Returns: i

Returns: s

Returns: o

Returns: w

Returns: n

Returns: e

Returns: r

Returns: "

Returns: :

Returns: 

Returns: t

Returns: r

Returns: u

Returns: e

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: s

Returns: t

Returns: r

Returns: a

Returns: t

Returns: e

Returns: g

Returns: y

Returns: _

Returns: l

Returns: a

Returns: n

Returns: g

Returns: u

Returns: a

Returns: g

Returns: e

Returns: "

Returns: :

Returns: 

Returns: 0

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: s

Returns: t

Returns: r

Returns: a

Returns: t

Returns: e

Returns: g

Returns: y

Returns: _

Returns: n

Returns: a

Returns: m

Returns: e

Returns: "

Returns: :

Returns: 

Returns: "

Returns: T

Returns: e

Returns: s

Returns: t

Returns: "

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: s

Returns: t

Returns: r

Returns: a

Returns: t

Returns: e

Returns: g

Returns: y

Returns: _

Returns: p

Returns: u

Returns: b

Returns: l

Returns: i

Returns: c

Returns: "

Returns: :

Returns: 

Returns: 0

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: u

Returns: i

Returns: d

Returns: "

Returns: :

Returns: 

Returns: "

Returns: 1

Returns: 0

Returns: 5

Returns: e

Returns: d

Returns: 6

Returns: e

Returns: 5

Returns: 1

Returns: 1

Returns: c

Returns: c

Returns: 9

Returns: 7

Returns: 7

Returns: 9

Returns: 2

Returns: 1

Returns: 6

Returns: 1

Returns: 0

Returns: f

Returns: d

Returns: b

Returns: b

Returns: 7

Returns: e

Returns: 2

Returns: a

Returns: 1

Returns: d

Returns: 6

Returns: "

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: w

Returns: d

Returns: "

Returns: :

Returns: 

Returns: 0

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: }

Returns: ]

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: }

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: e

Returns: r

Returns: r

Returns: o

Returns: r

Returns: "

Returns: :

Returns: 

Returns: n

Returns: u

Returns: l

Returns: l

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: }

Returns: 

Returns: }

Returns: 

Returns: `

Returns: `

Returns: `

Returns: 

Returns: 

Returns: -

Returns: 

Returns: r

Returns: o

Returns: b

Returns: o

Returns: t

Returns: s

Returns: :

Returns: 

Returns: L

Returns: i

Returns: v

Returns: e

Returns: 

Returns: t

Returns: r

Returns: a

Returns: d

Returns: i

Returns: n

Returns: g

Returns: 

Returns: b

Returns: o

Returns: t

Returns: 

Returns: i

Returns: n

Returns: f

Returns: o

Returns: r

Returns: m

Returns: a

Returns: t

Returns: i

Returns: o

Returns: n

Returns: 

Returns: 

Returns: 

Returns: -

Returns: 

Returns: g

Returns: r

Returns: o

Returns: u

Returns: p

Returns: _

Returns: i

Returns: d

Returns: :

Returns: 

Returns: L

Returns: i

Returns: v

Returns: e

Returns: 

Returns: t

Returns: r

Returns: a

Returns: d

Returns: i

Returns: n

Returns: g

Returns: 

Returns: b

Returns: o

Returns: t

Returns: 

Returns: g

Returns: r

Returns: o

Returns: u

Returns: p

Returns: 

Returns: I

Returns: D

Returns: ;

Returns: 

Returns: i

Returns: f

Returns: 

Returns: t

Returns: h

Returns: e

Returns: 

Returns: l

Returns: i

Returns: v

Returns: e

Returns: 

Returns: t

Returns: r

Returns: a

Returns: d

Returns: i

Returns: n

Returns: g

Returns: 

Returns: b

Returns: o

Returns: t

Returns: 

Returns: i

Returns: s

Returns: 

Returns: i

Returns: n

Returns: 

Returns: t

Returns: h

Returns: e

Returns: 

Returns: d

Returns: e

Returns: f

Returns: a

Returns: u

Returns: l

Returns: t

Returns: 

Returns: g

Returns: r

Returns: o

Returns: u

Returns: p

Returns: ,

Returns: 

Returns: t

Returns: h

Returns: e

Returns: 

Returns: `

Returns: `

Returns: `

Returns: g

Returns: r

Returns: o

Returns: u

Returns: p

Returns: _

Returns: i

Returns: d

Returns: `

Returns: `

Returns: `

Returns: 

Returns: f

Returns: i

Returns: e

Returns: l

Returns: d

Returns: 

Returns: i

Returns: s

Returns: 

Returns: n

Returns: o

Returns: t

Returns: 

Returns: i

Returns: n

Returns: c

Returns: l

Returns: u

Returns: d

Returns: e

Returns: d

Returns: .

Taking the Extended API Interface ["Authentication Method"](/user-guide/extended-api-interface/authentication-method) in ```Python``` language as an example:

```print(api('GetRobotList'))```: Get all live trading bot information.

```print(api('GetRobotList', 'member2'))```: Print all live trading bot information with custom label member2.

```print(api('GetRobotList', 0, 5, -1, 'member2'))```: Pagination query, starting from offset 0, returning at most 5 live trading bots with label member2.

### CommandRobot

The ```CommandRobot``` method is used to send interactive commands to a live trading bot under the FMZ Quant Trading Platform account corresponding to the ```API KEY``` in the request. The bot Id that receives the interactive command is specified by the ```robotId``` parameter, and the interactive command is captured and returned by the ```GetCommand()``` function called in the strategy.

Parameters:

- `robotId` (number, required): The ```robotId``` parameter is used to specify the bot Id that receives the interactive command. You can use the ```GetRobotList``` method to get information about bots under the account, which includes the bot Id.
- `cmd` (string, required): The ```cmd``` parameter is the interactive command sent to the bot. The ```GetCommand()``` function in the bot strategy will capture this interactive command and trigger the strategy's interaction logic. For the specific implementation of interaction logic in the strategy code, please refer to the ```GetCommand()``` function description in the [FMZ Quant Trading Platform API Manual](https://www.fmz.com/syntax-guide#fun_getcommand).

Returns: `

Returns: `

Returns: `

Returns: j

Returns: s

Returns: o

Returns: n

Returns: 

Returns: {

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: c

Returns: o

Returns: d

Returns: e

Returns: "

Returns: :

Returns: 0

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: d

Returns: a

Returns: t

Returns: a

Returns: "

Returns: :

Returns: {

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: r

Returns: e

Returns: s

Returns: u

Returns: l

Returns: t

Returns: "

Returns: :

Returns: t

Returns: r

Returns: u

Returns: e

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: e

Returns: r

Returns: r

Returns: o

Returns: r

Returns: "

Returns: :

Returns: n

Returns: u

Returns: l

Returns: l

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: }

Returns: 

Returns: }

Returns: 

Returns: `

Returns: `

Returns: `

Returns: 

Returns: 

Returns: -

Returns: 

Returns: r

Returns: e

Returns: s

Returns: u

Returns: l

Returns: t

Returns: :

Returns: 

Returns: W

Returns: h

Returns: e

Returns: t

Returns: h

Returns: e

Returns: r

Returns: 

Returns: t

Returns: h

Returns: e

Returns: 

Returns: i

Returns: n

Returns: t

Returns: e

Returns: r

Returns: a

Returns: c

Returns: t

Returns: i

Returns: v

Returns: e

Returns: 

Returns: c

Returns: o

Returns: m

Returns: m

Returns: a

Returns: n

Returns: d

Returns: 

Returns: w

Returns: a

Returns: s

Returns: 

Returns: s

Returns: e

Returns: n

Returns: t

Returns: 

Returns: s

Returns: u

Returns: c

Returns: c

Returns: e

Returns: s

Returns: s

Returns: f

Returns: u

Returns: l

Returns: l

Returns: y

Returns: .

Returns: 

Returns: W

Returns: h

Returns: e

Returns: n

Returns: 

Returns: s

Returns: e

Returns: n

Returns: d

Returns: i

Returns: n

Returns: g

Returns: 

Returns: a

Returns: 

Returns: c

Returns: o

Returns: m

Returns: m

Returns: a

Returns: n

Returns: d

Returns: 

Returns: t

Returns: o

Returns: 

Returns: a

Returns: 

Returns: b

Returns: o

Returns: t

Returns: 

Returns: t

Returns: h

Returns: a

Returns: t

Returns: 

Returns: i

Returns: s

Returns: 

Returns: n

Returns: o

Returns: t

Returns: 

Returns: r

Returns: u

Returns: n

Returns: n

Returns: i

Returns: n

Returns: g

Returns: ,

Returns: 

Returns: t

Returns: h

Returns: e

Returns: 

Returns: r

Returns: e

Returns: s

Returns: u

Returns: l

Returns: t

Returns: 

Returns: i

Returns: n

Returns: 

Returns: t

Returns: h

Returns: e

Returns: 

Returns: r

Returns: e

Returns: t

Returns: u

Returns: r

Returns: n

Returns: e

Returns: d

Returns: 

Returns: d

Returns: a

Returns: t

Returns: a

Returns: 

Returns: w

Returns: i

Returns: l

Returns: l

Returns: 

Returns: b

Returns: e

Returns: 

Returns: f

Returns: a

Returns: l

Returns: s

Returns: e

Returns: .

Example of bot strategy (assuming this strategy bot is running with bot Id 123):
```js
function main() {
    while (true) {
        var cmd = GetCommand()
        if (cmd) {
            Log(cmd)
        }
        Sleep(2000)
    }
}
```

If you use the Python test script in this section to access the FMZ Quant Trading Platform's extended API: ```api("CommandRobot", 123, "test command")```, the bot with Id 123 will receive the interactive command: ```test command```, and output it through the Log function.

### StopRobot

The ```StopRobot``` method is used to stop a live trading bot under the FMZ Quant Trading Platform account corresponding to the ```API KEY``` in the request. The bot Id to be stopped is specified by the ```robotId``` parameter.

Parameters:

- `robotId` (number, required): The ```robotId``` parameter is used to specify the bot Id to be stopped. You can obtain the bot information under the account through the ```GetRobotList``` method, which includes the bot Id.

Returns: `

Returns: `

Returns: `

Returns: j

Returns: s

Returns: o

Returns: n

Returns: 

Returns: {

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: c

Returns: o

Returns: d

Returns: e

Returns: "

Returns: :

Returns: 0

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: d

Returns: a

Returns: t

Returns: a

Returns: "

Returns: :

Returns: {

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: r

Returns: e

Returns: s

Returns: u

Returns: l

Returns: t

Returns: "

Returns: :

Returns: 2

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: e

Returns: r

Returns: r

Returns: o

Returns: r

Returns: "

Returns: :

Returns: n

Returns: u

Returns: l

Returns: l

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: }

Returns: 

Returns: }

Returns: 

Returns: `

Returns: `

Returns: `

Returns: 

Returns: 

Returns: -

Returns: 

Returns: r

Returns: e

Returns: s

Returns: u

Returns: l

Returns: t

Returns: :

Returns: 

Returns: B

Returns: o

Returns: t

Returns: 

Returns: s

Returns: t

Returns: a

Returns: t

Returns: u

Returns: s

Returns: 

Returns: c

Returns: o

Returns: d

Returns: e

Returns: ,

Returns: 

Returns: 2

Returns: 

Returns: i

Returns: n

Returns: d

Returns: i

Returns: c

Returns: a

Returns: t

Returns: e

Returns: s

Returns: 

Returns: s

Returns: t

Returns: o

Returns: p

Returns: p

Returns: i

Returns: n

Returns: g

Returns: .

### RestartRobot

The ```RestartRobot``` method is used to restart a live trading bot under the FMZ Quant Trading Platform account corresponding to the ```API KEY``` in the request. The bot ID to be restarted is specified by the ```robotId``` parameter.

Parameters:

- `robotId` (number, required): The ```robotId``` parameter is used to specify the ID of the live trading bot to be restarted. You can use the ```GetRobotList``` method to get information about live trading bots under the account, which includes the bot ID.
- `settings` (JSON object, optional): Live trading configuration parameters. The ```settings``` parameter format is as follows:

```json
{
    "appid":"test",
    "args":[],
    "exchanges":[
        {"pair":"SOL_USDT","pid":123},
        {"pair":"ETH_USDT","pid":456}
    ],
    "name":"Test",
    "node":123,
    "period":60,
    "strategy":123
}
```

- appid: Custom field
  Can be used to define labels.
- args: Strategy parameter settings
  Structure is an array, with each element being a parameter. For example, if the strategy has a parameter ```Interval``` and you want to set ```Interval``` to 500 when restarting the strategy, ```args``` should contain: ```["Interval", 500]```, i.e.: ```"args": [["Interval", 500]]```.
- exchanges: Exchange object configuration bound to the live trading bot
  Structure is an array, where each element is an exchange object configuration.
  - Can bind exchange objects already configured on the platform
    Using ```pid``` configuration: ```{"pair":"SOL_USDT","pid":123}```; ```pid``` can be queried through the ```GetPlatformList``` interface, where the ```id``` field in the returned data is the exchange ```pid```.
  - Can directly pass configuration information to bind exchange objects
    Using ```eid``` configuration: ```{"eid":"Huobi","label":"test Huobi","meta":{"AccessKey":"123","SecretKey":"123"},"pair":"BCH_BTC"}```; Sensitive information such as the passed ```API KEY``` will not be stored by the FMZ Quant Trading Platform, and this data will be directly forwarded to the docker program. If using this type of configuration, this information must be configured each time creating or restarting a live trading bot.
  - Can bind **General Protocol** exchange objects
    Can pass configuration information: ```{"eid":"Exchange","label":"test exchange","pair":"BTC_USDT","meta":{"AccessKey":"123","SecretKey":"123","Front":"http://127.0.0.1:6666/test"}}```.
    The ```label``` attribute is used to set a label for the current **General Protocol** connected exchange object, which can be retrieved in the strategy using the ```exchange.GetLabel()``` function.
- name: Strategy name
- node: Docker ID
  Specifies which docker to run on. If this attribute is not set, the system will automatically allocate.
- period: Default K-line period
  K-line period parameter, 60 means 60 seconds.
- strategy: Strategy ID
  Can be obtained using the ```GetStrategyList``` method.

Returns: `

Returns: `

Returns: `

Returns: j

Returns: s

Returns: o

Returns: n

Returns: 

Returns: {

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: c

Returns: o

Returns: d

Returns: e

Returns: "

Returns: :

Returns: 0

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: d

Returns: a

Returns: t

Returns: a

Returns: "

Returns: :

Returns: {

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: r

Returns: e

Returns: s

Returns: u

Returns: l

Returns: t

Returns: "

Returns: :

Returns: 1

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: e

Returns: r

Returns: r

Returns: o

Returns: r

Returns: "

Returns: :

Returns: n

Returns: u

Returns: l

Returns: l

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: }

Returns: 

Returns: }

Returns: 

Returns: `

Returns: `

Returns: `

Returns: 

Returns: 

Returns: -

Returns: 

Returns: r

Returns: e

Returns: s

Returns: u

Returns: l

Returns: t

Returns: :

Returns: 

Returns: L

Returns: i

Returns: v

Returns: e

Returns: 

Returns: t

Returns: r

Returns: a

Returns: d

Returns: i

Returns: n

Returns: g

Returns: 

Returns: s

Returns: t

Returns: a

Returns: t

Returns: u

Returns: s

Returns: 

Returns: c

Returns: o

Returns: d

Returns: e

Returns: ,

Returns: 

Returns: 1

Returns: 

Returns: i

Returns: n

Returns: d

Returns: i

Returns: c

Returns: a

Returns: t

Returns: e

Returns: s

Returns: 

Returns: r

Returns: u

Returns: n

Returns: n

Returns: i

Returns: n

Returns: g

Returns: .

If the live trading bot was created through the extended API interface, it must be restarted using the extended API interface ```RestartRobot```, and the ```settings``` parameter must be passed. For live trading bots created on the platform page, they can be restarted through the extended API interface or by clicking the button on the live trading page. The ```settings``` parameter can be passed or not. If only the ```robotId``` parameter is passed, it will start running according to the current settings of the live trading bot.

### GetRobotDetail

The ```GetRobotDetail``` method is used to get detailed information of a live trading bot under the FMZ Quant Trading Platform account corresponding to the ```API KEY``` in the request. The detailed information of the live trading bot to be retrieved is specified by the ```robotId``` parameter.

Parameters:

- `robotId` (number, required): The ```robotId``` parameter is used to specify the ID of the live trading bot for which to retrieve detailed information. The live trading bot information under the account, including the bot ID, can be obtained through the ```GetRobotList``` method.

Returns: `

Returns: `

Returns: `

Returns: j

Returns: s

Returns: o

Returns: n

Returns: 

Returns: {

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: c

Returns: o

Returns: d

Returns: e

Returns: "

Returns: :

Returns: 

Returns: 0

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: d

Returns: a

Returns: t

Returns: a

Returns: "

Returns: :

Returns: 

Returns: {

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: r

Returns: e

Returns: s

Returns: u

Returns: l

Returns: t

Returns: "

Returns: :

Returns: 

Returns: {

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: r

Returns: o

Returns: b

Returns: o

Returns: t

Returns: "

Returns: :

Returns: 

Returns: {

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: c

Returns: h

Returns: a

Returns: r

Returns: g

Returns: e

Returns: _

Returns: t

Returns: i

Returns: m

Returns: e

Returns: "

Returns: :

Returns: 

Returns: 1

Returns: 7

Returns: 3

Returns: 2

Returns: 2

Returns: 4

Returns: 6

Returns: 5

Returns: 3

Returns: 9

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: c

Returns: h

Returns: a

Returns: r

Returns: g

Returns: e

Returns: d

Returns: "

Returns: :

Returns: 

Returns: 5

Returns: 8

Returns: 5

Returns: 0

Returns: 0

Returns: 0

Returns: 0

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: c

Returns: o

Returns: n

Returns: s

Returns: u

Returns: m

Returns: e

Returns: d

Returns: "

Returns: :

Returns: 

Returns: 5

Returns: 3

Returns: 7

Returns: 5

Returns: 0

Returns: 0

Returns: 0

Returns: 0

Returns: 0

Returns: 0

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: d

Returns: a

Returns: t

Returns: e

Returns: "

Returns: :

Returns: 

Returns: "

Returns: 2

Returns: 0

Returns: 1

Returns: 8

Returns: -

Returns: 1

Returns: 2

Returns: -

Returns: 2

Returns: 8

Returns: 

Returns: 1

Returns: 4

Returns: :

Returns: 3

Returns: 4

Returns: :

Returns: 5

Returns: 1

Returns: "

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: f

Returns: a

Returns: v

Returns: o

Returns: r

Returns: i

Returns: t

Returns: e

Returns: "

Returns: :

Returns: 

Returns: {

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: a

Returns: d

Returns: d

Returns: e

Returns: d

Returns: "

Returns: :

Returns: 

Returns: f

Returns: a

Returns: l

Returns: s

Returns: e

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: t

Returns: y

Returns: p

Returns: e

Returns: "

Returns: :

Returns: 

Returns: "

Returns: R

Returns: "

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: }

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: f

Returns: i

Returns: x

Returns: e

Returns: d

Returns: _

Returns: i

Returns: d

Returns: "

Returns: :

Returns: 

Returns: 1

Returns: 2

Returns: 3

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: h

Returns: i

Returns: t

Returns: s

Returns: "

Returns: :

Returns: 

Returns: 1

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: i

Returns: d

Returns: "

Returns: :

Returns: 

Returns: 1

Returns: 2

Returns: 3

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: i

Returns: s

Returns: _

Returns: d

Returns: e

Returns: l

Returns: e

Returns: t

Returns: e

Returns: d

Returns: "

Returns: :

Returns: 

Returns: 0

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: i

Returns: s

Returns: _

Returns: m

Returns: a

Returns: n

Returns: a

Returns: g

Returns: e

Returns: r

Returns: "

Returns: :

Returns: 

Returns: t

Returns: r

Returns: u

Returns: e

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: i

Returns: s

Returns: _

Returns: s

Returns: a

Returns: n

Returns: d

Returns: b

Returns: o

Returns: x

Returns: "

Returns: :

Returns: 

Returns: 0

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: n

Returns: a

Returns: m

Returns: e

Returns: "

Returns: :

Returns: 

Returns: "

Returns: T

Returns: e

Returns: s

Returns: t

Returns: "

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: n

Returns: o

Returns: d

Returns: e

Returns: _

Returns: i

Returns: d

Returns: "

Returns: :

Returns: 

Returns: 1

Returns: 2

Returns: 3

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: p

Returns: e

Returns: x

Returns: c

Returns: h

Returns: a

Returns: n

Returns: g

Returns: e

Returns: s

Returns: "

Returns: :

Returns: 

Returns: {

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: 1

Returns: 2

Returns: 3

Returns: "

Returns: :

Returns: 

Returns: "

Returns: F

Returns: u

Returns: t

Returns: u

Returns: r

Returns: e

Returns: s

Returns: _

Returns: O

Returns: K

Returns: C

Returns: o

Returns: i

Returns: n

Returns: "

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: }

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: p

Returns: h

Returns: a

Returns: s

Returns: h

Returns: "

Returns: :

Returns: 

Returns: {

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: 1

Returns: 2

Returns: 3

Returns: "

Returns: :

Returns: 

Returns: "

Returns: c

Returns: a

Returns: 1

Returns: a

Returns: c

Returns: a

Returns: 7

Returns: 4

Returns: b

Returns: 9

Returns: c

Returns: f

Returns: 7

Returns: d

Returns: 8

Returns: 6

Returns: 2

Returns: 4

Returns: f

Returns: 2

Returns: a

Returns: f

Returns: 2

Returns: d

Returns: a

Returns: c

Returns: 0

Returns: 1

Returns: e

Returns: 3

Returns: 6

Returns: d

Returns: "

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: }

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: p

Returns: l

Returns: a

Returns: b

Returns: e

Returns: l

Returns: s

Returns: "

Returns: :

Returns: 

Returns: {

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: 1

Returns: 2

Returns: 3

Returns: "

Returns: :

Returns: 

Returns: "

Returns: O

Returns: K

Returns: E

Returns: X

Returns: 

Returns: F

Returns: u

Returns: t

Returns: u

Returns: r

Returns: e

Returns: s

Returns: 

Returns: V

Returns: 5

Returns: "

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: }

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: p

Returns: r

Returns: i

Returns: o

Returns: r

Returns: i

Returns: t

Returns: y

Returns: "

Returns: :

Returns: 

Returns: 0

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: p

Returns: r

Returns: o

Returns: f

Returns: i

Returns: t

Returns: "

Returns: :

Returns: 

Returns: 0

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: p

Returns: u

Returns: b

Returns: l

Returns: i

Returns: c

Returns: "

Returns: :

Returns: 

Returns: 0

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: r

Returns: e

Returns: f

Returns: r

Returns: e

Returns: s

Returns: h

Returns: "

Returns: :

Returns: 

Returns: 1

Returns: 7

Returns: 3

Returns: 2

Returns: 2

Returns: 4

Returns: 4

Returns: 4

Returns: 5

Returns: 3

Returns: 0

Returns: 0

Returns: 0

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: r

Returns: o

Returns: b

Returns: o

Returns: t

Returns: _

Returns: a

Returns: r

Returns: g

Returns: s

Returns: "

Returns: :

Returns: 

Returns: "

Returns: [

Returns: ]

Returns: "

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: s

Returns: t

Returns: a

Returns: r

Returns: t

Returns: _

Returns: t

Returns: i

Returns: m

Returns: e

Returns: "

Returns: :

Returns: 

Returns: "

Returns: 2

Returns: 0

Returns: 2

Returns: 4

Returns: -

Returns: 1

Returns: 1

Returns: -

Returns: 2

Returns: 2

Returns: 

Returns: 1

Returns: 1

Returns: :

Returns: 0

Returns: 0

Returns: :

Returns: 4

Returns: 8

Returns: "

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: s

Returns: t

Returns: a

Returns: t

Returns: u

Returns: s

Returns: "

Returns: :

Returns: 

Returns: 1

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: s

Returns: t

Returns: r

Returns: a

Returns: t

Returns: e

Returns: g

Returns: y

Returns: _

Returns: a

Returns: r

Returns: g

Returns: s

Returns: "

Returns: :

Returns: 

Returns: "

Returns: [

Returns: ]

Returns: "

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: s

Returns: t

Returns: r

Returns: a

Returns: t

Returns: e

Returns: g

Returns: y

Returns: _

Returns: e

Returns: x

Returns: c

Returns: h

Returns: a

Returns: n

Returns: g

Returns: e

Returns: _

Returns: p

Returns: a

Returns: i

Returns: r

Returns: s

Returns: "

Returns: :

Returns: 

Returns: "

Returns: [

Returns: 6

Returns: 0

Returns: ,

Returns: [

Returns: 1

Returns: 2

Returns: 3

Returns: ]

Returns: ,

Returns: [

Returns: \

Returns: "

Returns: E

Returns: T

Returns: H

Returns: _

Returns: U

Returns: S

Returns: D

Returns: T

Returns: \

Returns: "

Returns: ]

Returns: ]

Returns: "

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: s

Returns: t

Returns: r

Returns: a

Returns: t

Returns: e

Returns: g

Returns: y

Returns: _

Returns: i

Returns: d

Returns: "

Returns: :

Returns: 

Returns: 1

Returns: 2

Returns: 3

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: s

Returns: t

Returns: r

Returns: a

Returns: t

Returns: e

Returns: g

Returns: y

Returns: _

Returns: l

Returns: a

Returns: s

Returns: t

Returns: _

Returns: m

Returns: o

Returns: d

Returns: i

Returns: f

Returns: i

Returns: e

Returns: d

Returns: "

Returns: :

Returns: 

Returns: "

Returns: 2

Returns: 0

Returns: 2

Returns: 4

Returns: -

Returns: 1

Returns: 1

Returns: -

Returns: 2

Returns: 1

Returns: 

Returns: 1

Returns: 6

Returns: :

Returns: 4

Returns: 9

Returns: :

Returns: 2

Returns: 5

Returns: "

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: s

Returns: t

Returns: r

Returns: a

Returns: t

Returns: e

Returns: g

Returns: y

Returns: _

Returns: n

Returns: a

Returns: m

Returns: e

Returns: "

Returns: :

Returns: 

Returns: "

Returns: T

Returns: e

Returns: s

Returns: t

Returns: "

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: s

Returns: t

Returns: r

Returns: a

Returns: t

Returns: e

Returns: g

Returns: y

Returns: _

Returns: p

Returns: u

Returns: b

Returns: l

Returns: i

Returns: c

Returns: "

Returns: :

Returns: 

Returns: "

Returns: 0

Returns: "

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: u

Returns: i

Returns: d

Returns: "

Returns: :

Returns: 

Returns: "

Returns: 1

Returns: 0

Returns: 5

Returns: e

Returns: d

Returns: 6

Returns: e

Returns: 5

Returns: 1

Returns: b

Returns: c

Returns: c

Returns: 1

Returns: 7

Returns: 7

Returns: 9

Returns: 2

Returns: a

Returns: 6

Returns: 1

Returns: 0

Returns: f

Returns: d

Returns: b

Returns: b

Returns: 7

Returns: e

Returns: 2

Returns: a

Returns: 1

Returns: d

Returns: 6

Returns: "

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: u

Returns: s

Returns: e

Returns: r

Returns: n

Returns: a

Returns: m

Returns: e

Returns: "

Returns: :

Returns: 

Returns: "

Returns: a

Returns: b

Returns: c

Returns: "

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: w

Returns: d

Returns: "

Returns: :

Returns: 

Returns: 0

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: }

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: }

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: e

Returns: r

Returns: r

Returns: o

Returns: r

Returns: "

Returns: :

Returns: 

Returns: n

Returns: u

Returns: l

Returns: l

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: }

Returns: 

Returns: }

Returns: 

Returns: `

Returns: `

Returns: `

Returns: 

Returns: 

Returns: -

Returns: 

Returns: c

Returns: h

Returns: a

Returns: r

Returns: g

Returns: e

Returns: _

Returns: t

Returns: i

Returns: m

Returns: e

Returns: :

Returns: 

Returns: N

Returns: e

Returns: x

Returns: t

Returns: 

Returns: b

Returns: i

Returns: l

Returns: l

Returns: i

Returns: n

Returns: g

Returns: 

Returns: t

Returns: i

Returns: m

Returns: e

Returns: ,

Returns: 

Returns: i

Returns: .

Returns: e

Returns: .

Returns: ,

Returns: 

Returns: t

Returns: h

Returns: e

Returns: 

Returns: v

Returns: a

Returns: l

Returns: i

Returns: d

Returns: 

Returns: e

Returns: x

Returns: p

Returns: i

Returns: r

Returns: a

Returns: t

Returns: i

Returns: o

Returns: n

Returns: 

Returns: t

Returns: i

Returns: m

Returns: e

Returns: 

Returns: a

Returns: f

Returns: t

Returns: e

Returns: r

Returns: 

Returns: c

Returns: u

Returns: r

Returns: r

Returns: e

Returns: n

Returns: t

Returns: 

Returns: b

Returns: i

Returns: l

Returns: l

Returns: i

Returns: n

Returns: g

Returns: .

Returns: 

Returns: -

Returns: 

Returns: c

Returns: h

Returns: a

Returns: r

Returns: g

Returns: e

Returns: d

Returns: :

Returns: 

Returns: T

Returns: i

Returns: m

Returns: e

Returns: 

Returns: c

Returns: o

Returns: n

Returns: s

Returns: u

Returns: m

Returns: e

Returns: d

Returns: .

Returns: 

Returns: -

Returns: 

Returns: c

Returns: o

Returns: n

Returns: s

Returns: u

Returns: m

Returns: e

Returns: d

Returns: :

Returns: 

Returns: A

Returns: m

Returns: o

Returns: u

Returns: n

Returns: t

Returns: 

Returns: c

Returns: o

Returns: n

Returns: s

Returns: u

Returns: m

Returns: e

Returns: d

Returns: 

Returns: (

Returns: 0

Returns: .

Returns: 1

Returns: 2

Returns: 5

Returns: 

Returns: U

Returns: S

Returns: D

Returns: 

Returns: =

Returns: 

Returns: 1

Returns: 2

Returns: 5

Returns: 0

Returns: 0

Returns: 0

Returns: 0

Returns: 0

Returns: 

Returns: /

Returns: 

Returns: 1

Returns: e

Returns: 8

Returns: )

Returns: .

Returns: 

Returns: -

Returns: 

Returns: d

Returns: a

Returns: t

Returns: e

Returns: :

Returns: 

Returns: C

Returns: r

Returns: e

Returns: a

Returns: t

Returns: i

Returns: o

Returns: n

Returns: 

Returns: d

Returns: a

Returns: t

Returns: e

Returns: .

Returns: 

Returns: -

Returns: 

Returns: f

Returns: i

Returns: x

Returns: e

Returns: d

Returns: _

Returns: i

Returns: d

Returns: :

Returns: 

Returns: D

Returns: o

Returns: c

Returns: k

Returns: e

Returns: r

Returns: 

Returns: I

Returns: D

Returns: 

Returns: a

Returns: s

Returns: s

Returns: i

Returns: g

Returns: n

Returns: e

Returns: d

Returns: 

Returns: d

Returns: u

Returns: r

Returns: i

Returns: n

Returns: g

Returns: 

Returns: l

Returns: i

Returns: v

Returns: e

Returns: 

Returns: t

Returns: r

Returns: a

Returns: d

Returns: i

Returns: n

Returns: g

Returns: .

Returns: 

Returns: I

Returns: f

Returns: 

Returns: a

Returns: u

Returns: t

Returns: o

Returns: -

Returns: a

Returns: s

Returns: s

Returns: i

Returns: g

Returns: n

Returns: e

Returns: d

Returns: ,

Returns: 

Returns: t

Returns: h

Returns: i

Returns: s

Returns: 

Returns: v

Returns: a

Returns: l

Returns: u

Returns: e

Returns: 

Returns: i

Returns: s

Returns: 

Returns: -

Returns: 1

Returns: .

Returns: 

Returns: -

Returns: 

Returns: i

Returns: s

Returns: _

Returns: m

Returns: a

Returns: n

Returns: a

Returns: g

Returns: e

Returns: r

Returns: :

Returns: 

Returns: W

Returns: h

Returns: e

Returns: t

Returns: h

Returns: e

Returns: r

Returns: 

Returns: h

Returns: a

Returns: s

Returns: 

Returns: p

Returns: e

Returns: r

Returns: m

Returns: i

Returns: s

Returns: s

Returns: i

Returns: o

Returns: n

Returns: 

Returns: t

Returns: o

Returns: 

Returns: m

Returns: a

Returns: n

Returns: a

Returns: g

Returns: e

Returns: 

Returns: t

Returns: h

Returns: i

Returns: s

Returns: 

Returns: l

Returns: i

Returns: v

Returns: e

Returns: 

Returns: t

Returns: r

Returns: a

Returns: d

Returns: i

Returns: n

Returns: g

Returns: 

Returns: b

Returns: o

Returns: t

Returns: .

Returns: 

Returns: -

Returns: 

Returns: i

Returns: s

Returns: _

Returns: s

Returns: a

Returns: n

Returns: d

Returns: b

Returns: o

Returns: x

Returns: :

Returns: 

Returns: W

Returns: h

Returns: e

Returns: t

Returns: h

Returns: e

Returns: r

Returns: 

Returns: i

Returns: t

Returns: 

Returns: i

Returns: s

Returns: 

Returns: a

Returns: 

Returns: s

Returns: i

Returns: m

Returns: u

Returns: l

Returns: a

Returns: t

Returns: e

Returns: d

Returns: 

Returns: t

Returns: r

Returns: a

Returns: d

Returns: i

Returns: n

Returns: g

Returns: 

Returns: b

Returns: o

Returns: t

Returns: .

Returns: 

Returns: -

Returns: 

Returns: n

Returns: a

Returns: m

Returns: e

Returns: :

Returns: 

Returns: L

Returns: i

Returns: v

Returns: e

Returns: 

Returns: t

Returns: r

Returns: a

Returns: d

Returns: i

Returns: n

Returns: g

Returns: 

Returns: b

Returns: o

Returns: t

Returns: 

Returns: n

Returns: a

Returns: m

Returns: e

Returns: .

Returns: 

Returns: -

Returns: 

Returns: n

Returns: o

Returns: d

Returns: e

Returns: _

Returns: i

Returns: d

Returns: :

Returns: 

Returns: D

Returns: o

Returns: c

Returns: k

Returns: e

Returns: r

Returns: 

Returns: I

Returns: D

Returns: .

Returns: 

Returns: -

Returns: 

Returns: p

Returns: e

Returns: x

Returns: c

Returns: h

Returns: a

Returns: n

Returns: g

Returns: e

Returns: s

Returns: :

Returns: 

Returns: E

Returns: x

Returns: c

Returns: h

Returns: a

Returns: n

Returns: g

Returns: e

Returns: 

Returns: o

Returns: b

Returns: j

Returns: e

Returns: c

Returns: t

Returns: s

Returns: 

Returns: c

Returns: o

Returns: n

Returns: f

Returns: i

Returns: g

Returns: u

Returns: r

Returns: e

Returns: d

Returns: 

Returns: f

Returns: o

Returns: r

Returns: 

Returns: t

Returns: h

Returns: e

Returns: 

Returns: l

Returns: i

Returns: v

Returns: e

Returns: 

Returns: t

Returns: r

Returns: a

Returns: d

Returns: i

Returns: n

Returns: g

Returns: 

Returns: b

Returns: o

Returns: t

Returns: ,

Returns: 

Returns: w

Returns: h

Returns: e

Returns: r

Returns: e

Returns: 

Returns: 1

Returns: 2

Returns: 3

Returns: 

Returns: i

Returns: s

Returns: 

Returns: t

Returns: h

Returns: e

Returns: 

Returns: p

Returns: i

Returns: d

Returns: 

Returns: a

Returns: n

Returns: d

Returns: 

Returns: "

Returns: F

Returns: u

Returns: t

Returns: u

Returns: r

Returns: e

Returns: s

Returns: _

Returns: O

Returns: K

Returns: C

Returns: o

Returns: i

Returns: n

Returns: "

Returns: 

Returns: i

Returns: s

Returns: 

Returns: t

Returns: h

Returns: e

Returns: 

Returns: e

Returns: x

Returns: c

Returns: h

Returns: a

Returns: n

Returns: g

Returns: e

Returns: 

Returns: n

Returns: a

Returns: m

Returns: e

Returns: .

Returns: 

Returns: -

Returns: 

Returns: p

Returns: l

Returns: a

Returns: b

Returns: e

Returns: l

Returns: s

Returns: :

Returns: 

Returns: L

Returns: a

Returns: b

Returns: e

Returns: l

Returns: 

Returns: i

Returns: n

Returns: f

Returns: o

Returns: r

Returns: m

Returns: a

Returns: t

Returns: i

Returns: o

Returns: n

Returns: 

Returns: f

Returns: o

Returns: r

Returns: 

Returns: t

Returns: h

Returns: e

Returns: 

Returns: e

Returns: x

Returns: c

Returns: h

Returns: a

Returns: n

Returns: g

Returns: e

Returns: 

Returns: o

Returns: b

Returns: j

Returns: e

Returns: c

Returns: t

Returns: s

Returns: 

Returns: c

Returns: o

Returns: n

Returns: f

Returns: i

Returns: g

Returns: u

Returns: r

Returns: e

Returns: d

Returns: 

Returns: f

Returns: o

Returns: r

Returns: 

Returns: t

Returns: h

Returns: e

Returns: 

Returns: l

Returns: i

Returns: v

Returns: e

Returns: 

Returns: t

Returns: r

Returns: a

Returns: d

Returns: i

Returns: n

Returns: g

Returns: 

Returns: b

Returns: o

Returns: t

Returns: .

Returns: 

Returns: -

Returns: 

Returns: p

Returns: r

Returns: o

Returns: f

Returns: i

Returns: t

Returns: :

Returns: 

Returns: L

Returns: i

Returns: v

Returns: e

Returns: 

Returns: t

Returns: r

Returns: a

Returns: d

Returns: i

Returns: n

Returns: g

Returns: 

Returns: b

Returns: o

Returns: t

Returns: 

Returns: p

Returns: r

Returns: o

Returns: f

Returns: i

Returns: t

Returns: 

Returns: d

Returns: a

Returns: t

Returns: a

Returns: .

Returns: 

Returns: -

Returns: 

Returns: p

Returns: u

Returns: b

Returns: l

Returns: i

Returns: c

Returns: :

Returns: 

Returns: W

Returns: h

Returns: e

Returns: t

Returns: h

Returns: e

Returns: r

Returns: 

Returns: t

Returns: h

Returns: e

Returns: 

Returns: l

Returns: i

Returns: v

Returns: e

Returns: 

Returns: t

Returns: r

Returns: a

Returns: d

Returns: i

Returns: n

Returns: g

Returns: 

Returns: b

Returns: o

Returns: t

Returns: 

Returns: i

Returns: s

Returns: 

Returns: p

Returns: u

Returns: b

Returns: l

Returns: i

Returns: c

Returns: .

Returns: 

Returns: -

Returns: 

Returns: r

Returns: e

Returns: f

Returns: r

Returns: e

Returns: s

Returns: h

Returns: :

Returns: 

Returns: L

Returns: a

Returns: s

Returns: t

Returns: 

Returns: a

Returns: c

Returns: t

Returns: i

Returns: v

Returns: e

Returns: 

Returns: t

Returns: i

Returns: m

Returns: e

Returns: .

Returns: 

Returns: -

Returns: 

Returns: s

Returns: t

Returns: r

Returns: a

Returns: t

Returns: e

Returns: g

Returns: y

Returns: _

Returns: e

Returns: x

Returns: c

Returns: h

Returns: a

Returns: n

Returns: g

Returns: e

Returns: _

Returns: p

Returns: a

Returns: i

Returns: r

Returns: s

Returns: :

Returns: 

Returns: C

Returns: o

Returns: n

Returns: f

Returns: i

Returns: g

Returns: u

Returns: r

Returns: e

Returns: d

Returns: 

Returns: e

Returns: x

Returns: c

Returns: h

Returns: a

Returns: n

Returns: g

Returns: e

Returns: 

Returns: o

Returns: b

Returns: j

Returns: e

Returns: c

Returns: t

Returns: s

Returns: 

Returns: a

Returns: n

Returns: d

Returns: 

Returns: t

Returns: h

Returns: e

Returns: i

Returns: r

Returns: 

Returns: t

Returns: r

Returns: a

Returns: d

Returns: i

Returns: n

Returns: g

Returns: 

Returns: p

Returns: a

Returns: i

Returns: r

Returns: 

Returns: i

Returns: n

Returns: f

Returns: o

Returns: r

Returns: m

Returns: a

Returns: t

Returns: i

Returns: o

Returns: n

Returns: .

Returns: 

Returns: -

Returns: 

Returns: w

Returns: d

Returns: :

Returns: 

Returns: W

Returns: h

Returns: e

Returns: t

Returns: h

Returns: e

Returns: r

Returns: 

Returns: o

Returns: f

Returns: f

Returns: l

Returns: i

Returns: n

Returns: e

Returns: 

Returns: a

Returns: l

Returns: e

Returns: r

Returns: t

Returns: 

Returns: i

Returns: s

Returns: 

Returns: e

Returns: n

Returns: a

Returns: b

Returns: l

Returns: e

Returns: d

Returns: .

Explanation of the ```strategy_exchange_pairs``` attribute, using the following data as an example:

```plaintext
"[60,[44314,42960,15445,14703],[\"BTC_USDT\",\"BTC_USDT\",\"ETH_USDT\",\"ETH_USDT\"]]"
```

The first data ```60``` indicates that the default K-line period set for the live trading bot is 1 minute, i.e., 60 seconds.

```[44314,42960,15445,14703]``` are the ```pid``` values of the exchange objects configured for the live trading bot (arranged in the order they were added).

```[\"BTC_USDT\",\"BTC_USDT\",\"ETH_USDT\",\"ETH_USDT\"]``` are the trading pairs set for the exchange objects configured for the live trading bot (corresponding one-to-one with the pid values in the order they were added).

### GetAccount

The ```GetAccount``` method is used to retrieve account information for the FMZ Quant Trading Platform account corresponding to the ```API KEY``` in the request.

Returns: `

Returns: `

Returns: `

Returns: j

Returns: s

Returns: o

Returns: n

Returns: 

Returns: {

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: c

Returns: o

Returns: d

Returns: e

Returns: "

Returns: :

Returns: 0

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: d

Returns: a

Returns: t

Returns: a

Returns: "

Returns: :

Returns: {

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: r

Returns: e

Returns: s

Returns: u

Returns: l

Returns: t

Returns: "

Returns: :

Returns: {

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: b

Returns: a

Returns: l

Returns: a

Returns: n

Returns: c

Returns: e

Returns: "

Returns: :

Returns: 2

Returns: 2

Returns: 9

Returns: 4

Returns: 4

Returns: 7

Returns: 0

Returns: 2

Returns: 4

Returns: 3

Returns: 6

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: c

Returns: o

Returns: n

Returns: c

Returns: u

Returns: r

Returns: r

Returns: e

Returns: n

Returns: t

Returns: "

Returns: :

Returns: 0

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: c

Returns: o

Returns: n

Returns: s

Returns: u

Returns: m

Returns: e

Returns: d

Returns: "

Returns: :

Returns: 2

Returns: 1

Returns: 1

Returns: 0

Returns: 9

Returns: 2

Returns: 7

Returns: 1

Returns: 9

Returns: 6

Returns: 5

Returns: 3

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: c

Returns: u

Returns: r

Returns: r

Returns: e

Returns: n

Returns: c

Returns: y

Returns: "

Returns: :

Returns: "

Returns: U

Returns: S

Returns: D

Returns: "

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: e

Returns: m

Returns: a

Returns: i

Returns: l

Returns: "

Returns: :

Returns: "

Returns: 1

Returns: 2

Returns: 3

Returns: @

Returns: q

Returns: q

Returns: .

Returns: c

Returns: o

Returns: m

Returns: "

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: o

Returns: p

Returns: e

Returns: n

Returns: a

Returns: i

Returns: "

Returns: :

Returns: f

Returns: a

Returns: l

Returns: s

Returns: e

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: s

Returns: e

Returns: t

Returns: t

Returns: i

Returns: n

Returns: g

Returns: s

Returns: "

Returns: :

Returns: n

Returns: u

Returns: l

Returns: l

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: s

Returns: n

Returns: s

Returns: "

Returns: :

Returns: {

Returns: "

Returns: w

Returns: e

Returns: c

Returns: h

Returns: a

Returns: t

Returns: "

Returns: :

Returns: t

Returns: r

Returns: u

Returns: e

Returns: }

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: u

Returns: i

Returns: d

Returns: "

Returns: :

Returns: "

Returns: 1

Returns: 0

Returns: 5

Returns: e

Returns: a

Returns: 6

Returns: e

Returns: 5

Returns: 1

Returns: b

Returns: c

Returns: c

Returns: 1

Returns: 7

Returns: 7

Returns: 9

Returns: 2

Returns: 6

Returns: a

Returns: 1

Returns: 0

Returns: f

Returns: d

Returns: b

Returns: b

Returns: 7

Returns: e

Returns: 2

Returns: a

Returns: 1

Returns: d

Returns: 6

Returns: "

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: u

Returns: s

Returns: e

Returns: r

Returns: n

Returns: a

Returns: m

Returns: e

Returns: "

Returns: :

Returns: "

Returns: a

Returns: b

Returns: c

Returns: "

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: }

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: e

Returns: r

Returns: r

Returns: o

Returns: r

Returns: "

Returns: :

Returns: n

Returns: u

Returns: l

Returns: l

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: }

Returns: 

Returns: }

Returns: 

Returns: `

Returns: `

Returns: `

Returns: 

Returns: 

Returns: -

Returns: 

Returns: b

Returns: a

Returns: l

Returns: a

Returns: n

Returns: c

Returns: e

Returns: :

Returns: 

Returns: A

Returns: c

Returns: c

Returns: o

Returns: u

Returns: n

Returns: t

Returns: 

Returns: b

Returns: a

Returns: l

Returns: a

Returns: n

Returns: c

Returns: e

Returns: 

Returns: 

Returns: 

Returns: T

Returns: h

Returns: e

Returns: 

Returns: v

Returns: a

Returns: l

Returns: u

Returns: e

Returns: 

Returns: h

Returns: e

Returns: r

Returns: e

Returns: 

Returns: i

Returns: s

Returns: 

Returns: r

Returns: e

Returns: p

Returns: r

Returns: e

Returns: s

Returns: e

Returns: n

Returns: t

Returns: e

Returns: d

Returns: 

Returns: a

Returns: s

Returns: 

Returns: a

Returns: n

Returns: 

Returns: i

Returns: n

Returns: t

Returns: e

Returns: g

Returns: e

Returns: r

Returns: 

Returns: t

Returns: o

Returns: 

Returns: e

Returns: n

Returns: s

Returns: u

Returns: r

Returns: e

Returns: 

Returns: p

Returns: r

Returns: e

Returns: c

Returns: i

Returns: s

Returns: i

Returns: o

Returns: n

Returns: .

Returns: 

Returns: T

Returns: h

Returns: e

Returns: 

Returns: a

Returns: c

Returns: t

Returns: u

Returns: a

Returns: l

Returns: 

Returns: v

Returns: a

Returns: l

Returns: u

Returns: e

Returns: 

Returns: n

Returns: e

Returns: e

Returns: d

Returns: s

Returns: 

Returns: t

Returns: o

Returns: 

Returns: b

Returns: e

Returns: 

Returns: d

Returns: i

Returns: v

Returns: i

Returns: d

Returns: e

Returns: d

Returns: 

Returns: b

Returns: y

Returns: 

Returns: 1

Returns: e

Returns: 8

Returns: 

Returns: (

Returns: 1

Returns: 0

Returns: 

Returns: t

Returns: o

Returns: 

Returns: t

Returns: h

Returns: e

Returns: 

Returns: p

Returns: o

Returns: w

Returns: e

Returns: r

Returns: 

Returns: o

Returns: f

Returns: 

Returns: 8

Returns: )

Returns: 

Returns: f

Returns: o

Returns: r

Returns: 

Returns: c

Returns: o

Returns: n

Returns: v

Returns: e

Returns: r

Returns: s

Returns: i

Returns: o

Returns: n

Returns: .

Returns: 

Returns: I

Returns: n

Returns: 

Returns: t

Returns: h

Returns: i

Returns: s

Returns: 

Returns: e

Returns: x

Returns: a

Returns: m

Returns: p

Returns: l

Returns: e

Returns: ,

Returns: 

Returns: t

Returns: h

Returns: e

Returns: 

Returns: a

Returns: c

Returns: t

Returns: u

Returns: a

Returns: l

Returns: 

Returns: b

Returns: a

Returns: l

Returns: a

Returns: n

Returns: c

Returns: e

Returns: 

Returns: i

Returns: s

Returns: :

Returns: 

Returns: 2

Returns: 2

Returns: 9

Returns: .

Returns: 4

Returns: 4

Returns: 7

Returns: 0

Returns: 2

Returns: 4

Returns: 3

Returns: 6

### GetExchangeList

The ```GetExchangeList``` method is used to get the list of exchanges supported by the FMZ quantitative trading platform and their configuration information.

Parameters:

- `isSummary` (bool, required): The ```isSummary``` parameter is used to specify whether the returned data is summary information.

Returns: W

Returns: h

Returns: e

Returns: n

Returns: 

Returns: t

Returns: h

Returns: e

Returns: 

Returns: `

Returns: `

Returns: `

Returns: i

Returns: s

Returns: S

Returns: u

Returns: m

Returns: m

Returns: a

Returns: r

Returns: y

Returns: `

Returns: `

Returns: `

Returns: 

Returns: p

Returns: a

Returns: r

Returns: a

Returns: m

Returns: e

Returns: t

Returns: e

Returns: r

Returns: 

Returns: i

Returns: s

Returns: 

Returns: `

Returns: `

Returns: `

Returns: f

Returns: a

Returns: l

Returns: s

Returns: e

Returns: `

Returns: `

Returns: `

Returns: ,

Returns: 

Returns: t

Returns: h

Returns: e

Returns: 

Returns: r

Returns: e

Returns: t

Returns: u

Returns: r

Returns: n

Returns: e

Returns: d

Returns: 

Returns: d

Returns: a

Returns: t

Returns: a

Returns: :

Returns: 

Returns: 

Returns: `

Returns: `

Returns: `

Returns: j

Returns: s

Returns: o

Returns: n

Returns: 

Returns: {

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: c

Returns: o

Returns: d

Returns: e

Returns: "

Returns: :

Returns: 

Returns: 0

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: d

Returns: a

Returns: t

Returns: a

Returns: "

Returns: :

Returns: 

Returns: {

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: r

Returns: e

Returns: s

Returns: u

Returns: l

Returns: t

Returns: "

Returns: :

Returns: 

Returns: {

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: e

Returns: x

Returns: c

Returns: h

Returns: a

Returns: n

Returns: g

Returns: e

Returns: s

Returns: "

Returns: :

Returns: 

Returns: [

Returns: {

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: c

Returns: a

Returns: t

Returns: e

Returns: g

Returns: o

Returns: r

Returns: y

Returns: "

Returns: :

Returns: 

Returns: "

Returns: 加

Returns: 密

Returns: 货

Returns: 币

Returns: |

Returns: |

Returns: C

Returns: r

Returns: y

Returns: p

Returns: t

Returns: o

Returns: "

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: e

Returns: i

Returns: d

Returns: "

Returns: :

Returns: 

Returns: "

Returns: F

Returns: u

Returns: t

Returns: u

Returns: r

Returns: e

Returns: s

Returns: _

Returns: B

Returns: i

Returns: n

Returns: a

Returns: n

Returns: c

Returns: e

Returns: "

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: i

Returns: d

Returns: "

Returns: :

Returns: 

Returns: 7

Returns: 4

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: l

Returns: o

Returns: g

Returns: o

Returns: "

Returns: :

Returns: 

Returns: "

Returns: /

Returns: u

Returns: p

Returns: l

Returns: o

Returns: a

Returns: d

Returns: /

Returns: a

Returns: s

Returns: s

Returns: e

Returns: t

Returns: /

Returns: d

Returns: 8

Returns: d

Returns: 8

Returns: 4

Returns: b

Returns: 2

Returns: 3

Returns: e

Returns: 5

Returns: 7

Returns: 3

Returns: e

Returns: 9

Returns: 3

Returns: 2

Returns: 6

Returns: b

Returns: 9

Returns: 9

Returns: .

Returns: s

Returns: v

Returns: g

Returns: "

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: m

Returns: e

Returns: t

Returns: a

Returns: "

Returns: :

Returns: 

Returns: "

Returns: [

Returns: {

Returns: \

Returns: "

Returns: d

Returns: e

Returns: s

Returns: c

Returns: \

Returns: "

Returns: :

Returns: 

Returns: \

Returns: "

Returns: A

Returns: c

Returns: c

Returns: e

Returns: s

Returns: s

Returns: 

Returns: K

Returns: e

Returns: y

Returns: \

Returns: "

Returns: ,

Returns: 

Returns: \

Returns: "

Returns: q

Returns: r

Returns: \

Returns: "

Returns: :

Returns: \

Returns: "

Returns: a

Returns: p

Returns: i

Returns: K

Returns: e

Returns: y

Returns: \

Returns: "

Returns: ,

Returns: \

Returns: "

Returns: r

Returns: e

Returns: q

Returns: u

Returns: i

Returns: r

Returns: e

Returns: d

Returns: \

Returns: "

Returns: :

Returns: 

Returns: t

Returns: r

Returns: u

Returns: e

Returns: ,

Returns: 

Returns: \

Returns: "

Returns: t

Returns: y

Returns: p

Returns: e

Returns: \

Returns: "

Returns: :

Returns: 

Returns: \

Returns: "

Returns: s

Returns: t

Returns: r

Returns: i

Returns: n

Returns: g

Returns: \

Returns: "

Returns: ,

Returns: 

Returns: \

Returns: "

Returns: n

Returns: a

Returns: m

Returns: e

Returns: \

Returns: "

Returns: :

Returns: 

Returns: \

Returns: "

Returns: A

Returns: c

Returns: c

Returns: e

Returns: s

Returns: s

Returns: K

Returns: e

Returns: y

Returns: \

Returns: "

Returns: ,

Returns: 

Returns: \

Returns: "

Returns: l

Returns: a

Returns: b

Returns: e

Returns: l

Returns: \

Returns: "

Returns: :

Returns: 

Returns: \

Returns: "

Returns: A

Returns: c

Returns: c

Returns: e

Returns: s

Returns: s

Returns: 

Returns: K

Returns: e

Returns: y

Returns: \

Returns: "

Returns: }

Returns: ,

Returns: 

Returns: {

Returns: \

Returns: "

Returns: e

Returns: n

Returns: c

Returns: r

Returns: y

Returns: p

Returns: t

Returns: \

Returns: "

Returns: :

Returns: 

Returns: t

Returns: r

Returns: u

Returns: e

Returns: ,

Returns: 

Returns: \

Returns: "

Returns: q

Returns: r

Returns: \

Returns: "

Returns: :

Returns: \

Returns: "

Returns: s

Returns: e

Returns: c

Returns: r

Returns: e

Returns: t

Returns: K

Returns: e

Returns: y

Returns: \

Returns: "

Returns: ,

Returns: \

Returns: "

Returns: n

Returns: a

Returns: m

Returns: e

Returns: \

Returns: "

Returns: :

Returns: 

Returns: \

Returns: "

Returns: S

Returns: e

Returns: c

Returns: r

Returns: e

Returns: t

Returns: K

Returns: e

Returns: y

Returns: \

Returns: "

Returns: ,

Returns: 

Returns: \

Returns: "

Returns: r

Returns: e

Returns: q

Returns: u

Returns: i

Returns: r

Returns: e

Returns: d

Returns: \

Returns: "

Returns: :

Returns: 

Returns: t

Returns: r

Returns: u

Returns: e

Returns: ,

Returns: 

Returns: \

Returns: "

Returns: l

Returns: a

Returns: b

Returns: e

Returns: l

Returns: \

Returns: "

Returns: :

Returns: 

Returns: \

Returns: "

Returns: S

Returns: e

Returns: c

Returns: r

Returns: e

Returns: t

Returns: 

Returns: K

Returns: e

Returns: y

Returns: \

Returns: "

Returns: ,

Returns: 

Returns: \

Returns: "

Returns: t

Returns: y

Returns: p

Returns: e

Returns: \

Returns: "

Returns: :

Returns: 

Returns: \

Returns: "

Returns: p

Returns: a

Returns: s

Returns: s

Returns: w

Returns: o

Returns: r

Returns: d

Returns: \

Returns: "

Returns: ,

Returns: 

Returns: \

Returns: "

Returns: d

Returns: e

Returns: s

Returns: c

Returns: \

Returns: "

Returns: :

Returns: 

Returns: \

Returns: "

Returns: S

Returns: e

Returns: c

Returns: r

Returns: e

Returns: t

Returns: 

Returns: K

Returns: e

Returns: y

Returns: \

Returns: "

Returns: }

Returns: ]

Returns: "

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: n

Returns: a

Returns: m

Returns: e

Returns: "

Returns: :

Returns: 

Returns: "

Returns: 币

Returns: 安

Returns: 期

Returns: 货

Returns: |

Returns: F

Returns: u

Returns: t

Returns: u

Returns: r

Returns: e

Returns: s

Returns: _

Returns: B

Returns: i

Returns: n

Returns: a

Returns: n

Returns: c

Returns: e

Returns: "

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: p

Returns: r

Returns: i

Returns: o

Returns: r

Returns: i

Returns: t

Returns: y

Returns: "

Returns: :

Returns: 

Returns: 2

Returns: 0

Returns: 0

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: s

Returns: t

Returns: o

Returns: c

Returns: k

Returns: s

Returns: "

Returns: :

Returns: 

Returns: "

Returns: B

Returns: T

Returns: C

Returns: _

Returns: U

Returns: S

Returns: D

Returns: T

Returns: ,

Returns: E

Returns: T

Returns: H

Returns: _

Returns: U

Returns: S

Returns: D

Returns: T

Returns: ,

Returns: E

Returns: T

Returns: H

Returns: _

Returns: U

Returns: S

Returns: D

Returns: "

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: w

Returns: e

Returns: b

Returns: s

Returns: i

Returns: t

Returns: e

Returns: "

Returns: :

Returns: 

Returns: "

Returns: h

Returns: t

Returns: t

Returns: p

Returns: s

Returns: :

Returns: /

Returns: /

Returns: a

Returns: c

Returns: c

Returns: o

Returns: u

Returns: n

Returns: t

Returns: s

Returns: .

Returns: b

Returns: i

Returns: n

Returns: a

Returns: n

Returns: c

Returns: e

Returns: .

Returns: c

Returns: o

Returns: m

Returns: /

Returns: z

Returns: h

Returns: -

Returns: T

Returns: C

Returns: /

Returns: r

Returns: e

Returns: g

Returns: i

Returns: s

Returns: t

Returns: e

Returns: r

Returns: ?

Returns: r

Returns: e

Returns: f

Returns: =

Returns: 4

Returns: 5

Returns: 1

Returns: 1

Returns: 0

Returns: 2

Returns: 7

Returns: 0

Returns: "

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: }

Returns: ]

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: }

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: e

Returns: r

Returns: r

Returns: o

Returns: r

Returns: "

Returns: :

Returns: 

Returns: n

Returns: u

Returns: l

Returns: l

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: }

Returns: 

Returns: }

Returns: 

Returns: `

Returns: `

Returns: `

Returns: 

Returns: 

Returns: W

Returns: h

Returns: e

Returns: n

Returns: 

Returns: t

Returns: h

Returns: e

Returns: 

Returns: `

Returns: `

Returns: `

Returns: i

Returns: s

Returns: S

Returns: u

Returns: m

Returns: m

Returns: a

Returns: r

Returns: y

Returns: `

Returns: `

Returns: `

Returns: 

Returns: p

Returns: a

Returns: r

Returns: a

Returns: m

Returns: e

Returns: t

Returns: e

Returns: r

Returns: 

Returns: i

Returns: s

Returns: 

Returns: `

Returns: `

Returns: `

Returns: t

Returns: r

Returns: u

Returns: e

Returns: `

Returns: `

Returns: `

Returns: ,

Returns: 

Returns: t

Returns: h

Returns: e

Returns: 

Returns: r

Returns: e

Returns: t

Returns: u

Returns: r

Returns: n

Returns: e

Returns: d

Returns: 

Returns: d

Returns: a

Returns: t

Returns: a

Returns: :

Returns: 

Returns: 

Returns: `

Returns: `

Returns: `

Returns: j

Returns: s

Returns: o

Returns: n

Returns: 

Returns: {

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: c

Returns: o

Returns: d

Returns: e

Returns: "

Returns: :

Returns: 

Returns: 0

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: d

Returns: a

Returns: t

Returns: a

Returns: "

Returns: :

Returns: 

Returns: {

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: r

Returns: e

Returns: s

Returns: u

Returns: l

Returns: t

Returns: "

Returns: :

Returns: 

Returns: {

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: e

Returns: x

Returns: c

Returns: h

Returns: a

Returns: n

Returns: g

Returns: e

Returns: s

Returns: "

Returns: :

Returns: 

Returns: [

Returns: {

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: c

Returns: a

Returns: t

Returns: e

Returns: g

Returns: o

Returns: r

Returns: y

Returns: "

Returns: :

Returns: 

Returns: "

Returns: 加

Returns: 密

Returns: 货

Returns: 币

Returns: |

Returns: |

Returns: C

Returns: r

Returns: y

Returns: p

Returns: t

Returns: o

Returns: "

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: e

Returns: i

Returns: d

Returns: "

Returns: :

Returns: 

Returns: "

Returns: F

Returns: u

Returns: t

Returns: u

Returns: r

Returns: e

Returns: s

Returns: _

Returns: B

Returns: i

Returns: n

Returns: a

Returns: n

Returns: c

Returns: e

Returns: "

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: i

Returns: d

Returns: "

Returns: :

Returns: 

Returns: 7

Returns: 4

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: l

Returns: o

Returns: g

Returns: o

Returns: "

Returns: :

Returns: 

Returns: "

Returns: /

Returns: u

Returns: p

Returns: l

Returns: o

Returns: a

Returns: d

Returns: /

Returns: a

Returns: s

Returns: s

Returns: e

Returns: t

Returns: /

Returns: d

Returns: 8

Returns: d

Returns: 8

Returns: 4

Returns: b

Returns: 2

Returns: 3

Returns: e

Returns: 5

Returns: 7

Returns: 3

Returns: e

Returns: 9

Returns: 3

Returns: 2

Returns: 6

Returns: b

Returns: 9

Returns: 9

Returns: .

Returns: s

Returns: v

Returns: g

Returns: "

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: n

Returns: a

Returns: m

Returns: e

Returns: "

Returns: :

Returns: 

Returns: "

Returns: 币

Returns: 安

Returns: 期

Returns: 货

Returns: |

Returns: F

Returns: u

Returns: t

Returns: u

Returns: r

Returns: e

Returns: s

Returns: _

Returns: B

Returns: i

Returns: n

Returns: a

Returns: n

Returns: c

Returns: e

Returns: "

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: p

Returns: r

Returns: i

Returns: o

Returns: r

Returns: i

Returns: t

Returns: y

Returns: "

Returns: :

Returns: 

Returns: 2

Returns: 0

Returns: 0

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: w

Returns: e

Returns: b

Returns: s

Returns: i

Returns: t

Returns: e

Returns: "

Returns: :

Returns: 

Returns: "

Returns: h

Returns: t

Returns: t

Returns: p

Returns: s

Returns: :

Returns: /

Returns: /

Returns: a

Returns: c

Returns: c

Returns: o

Returns: u

Returns: n

Returns: t

Returns: s

Returns: .

Returns: b

Returns: i

Returns: n

Returns: a

Returns: n

Returns: c

Returns: e

Returns: .

Returns: c

Returns: o

Returns: m

Returns: /

Returns: z

Returns: h

Returns: -

Returns: T

Returns: C

Returns: /

Returns: r

Returns: e

Returns: g

Returns: i

Returns: s

Returns: t

Returns: e

Returns: r

Returns: ?

Returns: r

Returns: e

Returns: f

Returns: =

Returns: 4

Returns: 5

Returns: 1

Returns: 1

Returns: 0

Returns: 2

Returns: 7

Returns: 0

Returns: "

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: }

Returns: ]

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: }

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: e

Returns: r

Returns: r

Returns: o

Returns: r

Returns: "

Returns: :

Returns: 

Returns: n

Returns: u

Returns: l

Returns: l

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: }

Returns: 

Returns: }

Returns: 

Returns: `

Returns: `

Returns: `

Returns: 

Returns: 

Returns: -

Returns: 

Returns: m

Returns: e

Returns: t

Returns: a

Returns: :

Returns: 

Returns: E

Returns: x

Returns: c

Returns: h

Returns: a

Returns: n

Returns: g

Returns: e

Returns: 

Returns: c

Returns: o

Returns: n

Returns: f

Returns: i

Returns: g

Returns: u

Returns: r

Returns: a

Returns: t

Returns: i

Returns: o

Returns: n

Returns: 

Returns: m

Returns: e

Returns: t

Returns: a

Returns: d

Returns: a

Returns: t

Returns: a

Returns: .

### DeleteNode

The ```DeleteNode``` method is used to delete a docker node under the FMZ Quant Trading Platform account corresponding to the ```API KEY``` in the request. The docker node ID to be deleted is specified by the ```nid``` parameter.

Parameters:

- `nid` (number, required): The ```nid``` parameter is used to specify the docker ID to be deleted. You can obtain the docker information under the account through the ```GetNodeList``` method.

Returns: `

Returns: `

Returns: `

Returns: j

Returns: s

Returns: o

Returns: n

Returns: 

Returns: {

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: c

Returns: o

Returns: d

Returns: e

Returns: "

Returns: :

Returns: 0

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: d

Returns: a

Returns: t

Returns: a

Returns: "

Returns: :

Returns: {

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: r

Returns: e

Returns: s

Returns: u

Returns: l

Returns: t

Returns: "

Returns: :

Returns: t

Returns: r

Returns: u

Returns: e

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: e

Returns: r

Returns: r

Returns: o

Returns: r

Returns: "

Returns: :

Returns: n

Returns: u

Returns: l

Returns: l

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: }

Returns: 

Returns: }

Returns: 

Returns: `

Returns: `

Returns: `

Returns: 

Returns: 

Returns: -

Returns: 

Returns: r

Returns: e

Returns: s

Returns: u

Returns: l

Returns: t

Returns: :

Returns: 

Returns: W

Returns: h

Returns: e

Returns: t

Returns: h

Returns: e

Returns: r

Returns: 

Returns: t

Returns: h

Returns: e

Returns: 

Returns: a

Returns: s

Returns: s

Returns: o

Returns: c

Returns: i

Returns: a

Returns: t

Returns: e

Returns: d

Returns: 

Returns: d

Returns: o

Returns: c

Returns: k

Returns: e

Returns: r

Returns: 

Returns: p

Returns: r

Returns: o

Returns: g

Returns: r

Returns: a

Returns: m

Returns: 

Returns: w

Returns: a

Returns: s

Returns: 

Returns: s

Returns: u

Returns: c

Returns: c

Returns: e

Returns: s

Returns: s

Returns: f

Returns: u

Returns: l

Returns: l

Returns: y

Returns: 

Returns: d

Returns: e

Returns: l

Returns: e

Returns: t

Returns: e

Returns: d

Returns: .

### DeleteRobot

The ```DeleteRobot``` method is used to delete a live trading bot under the FMZ Quant Trading Platform account corresponding to the ```API KEY``` in the request. The deleted bot ID is specified by the ```robotId``` parameter.

Parameters:

- `robotId` (number, required): The ```robotId``` parameter is used to specify the ID of the live trading bot to be deleted. You can use the ```GetRobotList``` method to get information about bots under the account, which includes the bot ID.
- `deleteLogs` (bool, required): The ```deleteLogs``` parameter is used to set whether to delete the bot logs. If a truthy value is passed (e.g., ```true```), the bot logs will be deleted.

Returns: `

Returns: `

Returns: `

Returns: j

Returns: s

Returns: o

Returns: n

Returns: 

Returns: {

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: c

Returns: o

Returns: d

Returns: e

Returns: "

Returns: :

Returns: 0

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: d

Returns: a

Returns: t

Returns: a

Returns: "

Returns: :

Returns: {

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: r

Returns: e

Returns: s

Returns: u

Returns: l

Returns: t

Returns: "

Returns: :

Returns: 0

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: e

Returns: r

Returns: r

Returns: o

Returns: r

Returns: "

Returns: :

Returns: n

Returns: u

Returns: l

Returns: l

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: }

Returns: 

Returns: }

Returns: 

Returns: `

Returns: `

Returns: `

Returns: 

Returns: 

Returns: -

Returns: 

Returns: r

Returns: e

Returns: s

Returns: u

Returns: l

Returns: t

Returns: :

Returns: 

Returns: F

Returns: e

Returns: e

Returns: d

Returns: b

Returns: a

Returns: c

Returns: k

Returns: 

Returns: r

Returns: e

Returns: s

Returns: u

Returns: l

Returns: t

Returns: 

Returns: o

Returns: f

Returns: 

Returns: t

Returns: h

Returns: e

Returns: 

Returns: b

Returns: o

Returns: t

Returns: 

Returns: d

Returns: e

Returns: l

Returns: e

Returns: t

Returns: i

Returns: o

Returns: n

Returns: 

Returns: o

Returns: p

Returns: e

Returns: r

Returns: a

Returns: t

Returns: i

Returns: o

Returns: n

Returns: .

Returns: 

Returns: 

Returns: 

Returns: -

Returns: 

Returns: 0

Returns: :

Returns: 

Returns: N

Returns: o

Returns: r

Returns: m

Returns: a

Returns: l

Returns: 

Returns: d

Returns: e

Returns: l

Returns: e

Returns: t

Returns: i

Returns: o

Returns: n

Returns: .

Returns: 

Returns: 

Returns: 

Returns: -

Returns: 

Returns: -

Returns: 2

Returns: :

Returns: 

Returns: D

Returns: e

Returns: l

Returns: e

Returns: t

Returns: i

Returns: o

Returns: n

Returns: 

Returns: s

Returns: u

Returns: c

Returns: c

Returns: e

Returns: s

Returns: s

Returns: f

Returns: u

Returns: l

Returns: ,

Returns: 

Returns: b

Returns: u

Returns: t

Returns: 

Returns: u

Returns: n

Returns: a

Returns: b

Returns: l

Returns: e

Returns: 

Returns: t

Returns: o

Returns: 

Returns: c

Returns: o

Returns: n

Returns: t

Returns: a

Returns: c

Returns: t

Returns: 

Returns: t

Returns: h

Returns: e

Returns: 

Returns: d

Returns: o

Returns: c

Returns: k

Returns: e

Returns: r

Returns: 

Returns: a

Returns: s

Returns: s

Returns: o

Returns: c

Returns: i

Returns: a

Returns: t

Returns: e

Returns: d

Returns: 

Returns: w

Returns: i

Returns: t

Returns: h

Returns: 

Returns: t

Returns: h

Returns: e

Returns: 

Returns: b

Returns: o

Returns: t

Returns: ,

Returns: 

Returns: p

Returns: l

Returns: e

Returns: a

Returns: s

Returns: e

Returns: 

Returns: m

Returns: a

Returns: n

Returns: u

Returns: a

Returns: l

Returns: l

Returns: y

Returns: 

Returns: d

Returns: e

Returns: l

Returns: e

Returns: t

Returns: e

Returns: 

Returns: t

Returns: h

Returns: e

Returns: 

Returns: f

Returns: i

Returns: l

Returns: e

Returns: 

Returns: 1

Returns: 2

Returns: 3

Returns: .

Returns: d

Returns: b

Returns: 3

Returns: !

### GetStrategyList

The ```GetStrategyList``` method is used to retrieve platform strategy information.

Parameters:

- `offset` (number, required): The ```offset``` parameter is used to set the query offset.
- `length` (number, required): The ```length``` parameter is used to set the number of data entries returned by the query.
- `strategyType` (number, required): The ```strategyType``` parameter is used to set the type of strategy to query.

- Set ```strategyType``` parameter to ```0```: Query all strategies.

- Set ```strategyType``` parameter to ```1```: Query published strategies.

- Set ```strategyType``` parameter to ```2```: Query strategies pending review.
- `category` (number, required): The ```category``` parameter is used to set the strategy category to query.

- Set ```category``` parameter to ```-1```: Query all strategies.

- Set ```category``` parameter to ```0```: Query general strategies.
- `needArgs` (number, required): The ```needArgs``` parameter is used to set whether the queried strategy requires parameters.

- Set ```needArgs``` parameter to ```0```: Query all strategies.
- `language` (number, required): The ```language``` parameter is used to set the programming language of the strategy to query.

- Set ```language``` parameter to ```0```: JavaScript language.

- Set ```language``` parameter to ```1```: Python language.

- Set ```language``` parameter to ```2```: C++ language.

- Set ```language``` parameter to ```3```: Visual strategy.

- Set ```language``` parameter to ```4```: My language.

- Set ```language``` parameter to ```5```: PINE language.
- `kw` (string, required): The ```kw``` parameter is used to set keywords for querying strategies.

- Set to an empty string to not use keyword filtering.

Returns: `

Returns: `

Returns: `

Returns: j

Returns: s

Returns: o

Returns: n

Returns: 

Returns: {

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: c

Returns: o

Returns: d

Returns: e

Returns: "

Returns: :

Returns: 

Returns: 0

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: d

Returns: a

Returns: t

Returns: a

Returns: "

Returns: :

Returns: 

Returns: {

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: r

Returns: e

Returns: s

Returns: u

Returns: l

Returns: t

Returns: "

Returns: :

Returns: 

Returns: {

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: a

Returns: l

Returns: l

Returns: "

Returns: :

Returns: 

Returns: 1

Returns: 2

Returns: 3

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: s

Returns: t

Returns: r

Returns: a

Returns: t

Returns: e

Returns: g

Returns: i

Returns: e

Returns: s

Returns: "

Returns: :

Returns: 

Returns: [

Returns: {

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: c

Returns: a

Returns: t

Returns: e

Returns: g

Returns: o

Returns: r

Returns: y

Returns: "

Returns: :

Returns: 

Returns: 9

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: d

Returns: a

Returns: t

Returns: e

Returns: "

Returns: :

Returns: 

Returns: "

Returns: 2

Returns: 0

Returns: 2

Returns: 4

Returns: -

Returns: 1

Returns: 1

Returns: -

Returns: 1

Returns: 0

Returns: 

Returns: 2

Returns: 0

Returns: :

Returns: 4

Returns: 0

Returns: :

Returns: 0

Returns: 4

Returns: "

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: d

Returns: e

Returns: s

Returns: c

Returns: r

Returns: i

Returns: p

Returns: t

Returns: i

Returns: o

Returns: n

Returns: "

Returns: :

Returns: 

Returns: "

Returns: "

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: f

Returns: o

Returns: r

Returns: k

Returns: e

Returns: d

Returns: "

Returns: :

Returns: 

Returns: 0

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: h

Returns: i

Returns: t

Returns: s

Returns: "

Returns: :

Returns: 

Returns: 0

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: i

Returns: d

Returns: "

Returns: :

Returns: 

Returns: 1

Returns: 2

Returns: 3

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: i

Returns: s

Returns: _

Returns: b

Returns: u

Returns: y

Returns: "

Returns: :

Returns: 

Returns: f

Returns: a

Returns: l

Returns: s

Returns: e

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: i

Returns: s

Returns: _

Returns: o

Returns: w

Returns: n

Returns: e

Returns: r

Returns: "

Returns: :

Returns: 

Returns: f

Returns: a

Returns: l

Returns: s

Returns: e

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: l

Returns: a

Returns: n

Returns: g

Returns: u

Returns: a

Returns: g

Returns: e

Returns: "

Returns: :

Returns: 

Returns: 2

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: l

Returns: a

Returns: s

Returns: t

Returns: _

Returns: m

Returns: o

Returns: d

Returns: i

Returns: f

Returns: i

Returns: e

Returns: d

Returns: "

Returns: :

Returns: 

Returns: "

Returns: 2

Returns: 0

Returns: 2

Returns: 4

Returns: -

Returns: 1

Returns: 1

Returns: -

Returns: 1

Returns: 1

Returns: 

Returns: 1

Returns: 7

Returns: :

Returns: 2

Returns: 3

Returns: :

Returns: 5

Returns: 2

Returns: "

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: n

Returns: a

Returns: m

Returns: e

Returns: "

Returns: :

Returns: 

Returns: "

Returns: H

Returns: e

Returns: d

Returns: g

Returns: e

Returns: G

Returns: r

Returns: i

Returns: d

Returns: S

Returns: t

Returns: r

Returns: a

Returns: t

Returns: e

Returns: g

Returns: y

Returns: "

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: p

Returns: r

Returns: o

Returns: f

Returns: i

Returns: l

Returns: e

Returns: "

Returns: :

Returns: 

Returns: {

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: a

Returns: v

Returns: a

Returns: t

Returns: a

Returns: r

Returns: "

Returns: :

Returns: 

Returns: "

Returns: .

Returns: .

Returns: .

Returns: "

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: n

Returns: i

Returns: c

Returns: k

Returns: n

Returns: a

Returns: m

Returns: e

Returns: "

Returns: :

Returns: 

Returns: "

Returns: a

Returns: b

Returns: c

Returns: "

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: u

Returns: i

Returns: d

Returns: "

Returns: :

Returns: 

Returns: "

Returns: 4

Returns: e

Returns: d

Returns: 2

Returns: 2

Returns: 5

Returns: 4

Returns: 4

Returns: 0

Returns: d

Returns: b

Returns: 1

Returns: e

Returns: d

Returns: a

Returns: 2

Returns: 3

Returns: f

Returns: e

Returns: 0

Returns: 5

Returns: e

Returns: d

Returns: 1

Returns: 0

Returns: 1

Returns: 8

Returns: 4

Returns: 1

Returns: 1

Returns: 3

Returns: e

Returns: "

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: }

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: p

Returns: u

Returns: b

Returns: l

Returns: i

Returns: c

Returns: "

Returns: :

Returns: 

Returns: 0

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: t

Returns: a

Returns: g

Returns: s

Returns: "

Returns: :

Returns: 

Returns: "

Returns: "

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: u

Returns: i

Returns: d

Returns: "

Returns: :

Returns: 

Returns: "

Returns: 4

Returns: e

Returns: d

Returns: 2

Returns: 2

Returns: 5

Returns: 4

Returns: 4

Returns: 0

Returns: d

Returns: b

Returns: 1

Returns: e

Returns: d

Returns: a

Returns: 2

Returns: 3

Returns: f

Returns: e

Returns: 0

Returns: 5

Returns: e

Returns: d

Returns: 1

Returns: 0

Returns: 1

Returns: 8

Returns: 4

Returns: 1

Returns: 1

Returns: 3

Returns: e

Returns: "

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: u

Returns: s

Returns: e

Returns: r

Returns: n

Returns: a

Returns: m

Returns: e

Returns: "

Returns: :

Returns: 

Returns: "

Returns: a

Returns: b

Returns: c

Returns: "

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: }

Returns: ]

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: }

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: e

Returns: r

Returns: r

Returns: o

Returns: r

Returns: "

Returns: :

Returns: 

Returns: n

Returns: u

Returns: l

Returns: l

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: }

Returns: 

Returns: }

Returns: 

Returns: `

Returns: `

Returns: `

Returns: 

Returns: 

Returns: -

Returns: 

Returns: a

Returns: l

Returns: l

Returns: :

Returns: 

Returns: T

Returns: o

Returns: t

Returns: a

Returns: l

Returns: 

Returns: n

Returns: u

Returns: m

Returns: b

Returns: e

Returns: r

Returns: 

Returns: o

Returns: f

Returns: 

Returns: s

Returns: t

Returns: r

Returns: a

Returns: t

Returns: e

Returns: g

Returns: i

Returns: e

Returns: s

Returns: 

Returns: m

Returns: a

Returns: t

Returns: c

Returns: h

Returns: i

Returns: n

Returns: g

Returns: 

Returns: t

Returns: h

Returns: e

Returns: 

Returns: f

Returns: i

Returns: l

Returns: t

Returns: e

Returns: r

Returns: 

Returns: c

Returns: r

Returns: i

Returns: t

Returns: e

Returns: r

Returns: i

Returns: a

Returns: .

Returns: 

Returns: -

Returns: 

Returns: s

Returns: t

Returns: r

Returns: a

Returns: t

Returns: e

Returns: g

Returns: i

Returns: e

Returns: s

Returns: :

Returns: 

Returns: D

Returns: e

Returns: t

Returns: a

Returns: i

Returns: l

Returns: e

Returns: d

Returns: 

Returns: i

Returns: n

Returns: f

Returns: o

Returns: r

Returns: m

Returns: a

Returns: t

Returns: i

Returns: o

Returns: n

Returns: 

Returns: o

Returns: f

Returns: 

Returns: s

Returns: t

Returns: r

Returns: a

Returns: t

Returns: e

Returns: g

Returns: i

Returns: e

Returns: s

Returns: 

Returns: r

Returns: e

Returns: t

Returns: u

Returns: r

Returns: n

Returns: e

Returns: d

Returns: 

Returns: b

Returns: y

Returns: 

Returns: t

Returns: h

Returns: e

Returns: 

Returns: q

Returns: u

Returns: e

Returns: r

Returns: y

Returns: .

### NewRobot

The ```NewRobot``` method is used to create a live trading bot under the FMZ Quant Trading Platform account corresponding to the ```API KEY``` in the request.

Parameters:

- `settings` (JSON Object, required): Live trading configuration parameters. The ```settings``` parameter format is as follows:

```json
{
    "appid":"test",
    "args":[],
    "exchanges":[
        {"pair":"SOL_USDT","pid":123}
    ],
    "group":123,
    "name":"test",
    "node":123,
    "period":60,
    "strategy":123
}
```

- group: Specify the live trading group.
- args: Strategy parameters, empty array if the strategy has no parameters.
- exchanges: Exchange object configuration, refer to the ```RestartRobot``` interface.

Returns: `

Returns: `

Returns: `

Returns: j

Returns: s

Returns: o

Returns: n

Returns: 

Returns: {

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: c

Returns: o

Returns: d

Returns: e

Returns: "

Returns: :

Returns: 0

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: d

Returns: a

Returns: t

Returns: a

Returns: "

Returns: :

Returns: {

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: r

Returns: e

Returns: s

Returns: u

Returns: l

Returns: t

Returns: "

Returns: :

Returns: 5

Returns: 9

Returns: 1

Returns: 9

Returns: 8

Returns: 8

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: e

Returns: r

Returns: r

Returns: o

Returns: r

Returns: "

Returns: :

Returns: n

Returns: u

Returns: l

Returns: l

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: }

Returns: 

Returns: }

Returns: 

Returns: `

Returns: `

Returns: `

Returns: 

Returns: 

Returns: -

Returns: 

Returns: r

Returns: e

Returns: s

Returns: u

Returns: l

Returns: t

Returns: :

Returns: 

Returns: S

Returns: u

Returns: c

Returns: c

Returns: e

Returns: s

Returns: s

Returns: f

Returns: u

Returns: l

Returns: l

Returns: y

Returns: 

Returns: c

Returns: r

Returns: e

Returns: a

Returns: t

Returns: e

Returns: d

Returns: ,

Returns: 

Returns: r

Returns: e

Returns: t

Returns: u

Returns: r

Returns: n

Returns: s

Returns: 

Returns: t

Returns: h

Returns: e

Returns: 

Returns: l

Returns: i

Returns: v

Returns: e

Returns: 

Returns: t

Returns: r

Returns: a

Returns: d

Returns: i

Returns: n

Returns: g

Returns: 

Returns: I

Returns: D

Returns: .

Sensitive information such as ```"meta":{"AccessKey": "123", "SecretKey": "123"}``` configured in the ```eid``` of the ```settings``` parameter will not be stored by the FMZ Quant Trading Platform. This data will be directly forwarded to the docker program, so this information must be configured each time a live trading bot is created or restarted.

When creating a live trading bot using a general protocol exchange object, the ```exchanges``` property can use the following settings when configuring the ```settings``` parameter:
```json
{
    "eid": "Exchange",
    "label": "test",
    "pair": "ETH_BTC",
    "meta": {
        "AccessKey": "123",
        "SecretKey": "123",
        "Front": "http://127.0.0.1:6666/test"
    }
}
```

The ```label``` property is used to set a label for the current general protocol connected exchange object, which can be retrieved in the strategy using the ```exchange.GetLabel()``` function.

### PluginRun

The ```PluginRun``` method is used to call the **debugging tool** functionality of the FMZ Quant Trading Platform; only JavaScript language is supported.

Parameters:

- `settings` (JSON object, required): Setting parameters in the debugging tool, the ```settings``` configuration contains test code located in the ```source``` attribute. The ```settings``` parameter format is as follows:

```json
{
    "exchanges":[{"pair":"SOL_USDT","pid":123}],
    "node":123,
    "period":60,
    "source":"function main() {Log(\"Hello FMZ\")}"
}
```

- source: The code to be debugged.
- node: Docker ID, specifies which docker to run the live trading on. If this value is -1, it means automatic allocation.
- exchanges: Exchange object configuration, refer to the ```RestartRobot``` interface.

Returns: `

Returns: `

Returns: `

Returns: j

Returns: s

Returns: o

Returns: n

Returns: 

Returns: {

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: c

Returns: o

Returns: d

Returns: e

Returns: "

Returns: :

Returns: 

Returns: 0

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: d

Returns: a

Returns: t

Returns: a

Returns: "

Returns: :

Returns: 

Returns: {

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: r

Returns: e

Returns: s

Returns: u

Returns: l

Returns: t

Returns: "

Returns: :

Returns: 

Returns: "

Returns: {

Returns: \

Returns: "

Returns: l

Returns: o

Returns: g

Returns: s

Returns: \

Returns: "

Returns: :

Returns: [

Returns: {

Returns: \

Returns: "

Returns: P

Returns: l

Returns: a

Returns: t

Returns: f

Returns: o

Returns: r

Returns: m

Returns: I

Returns: d

Returns: \

Returns: "

Returns: :

Returns: \

Returns: "

Returns: \

Returns: "

Returns: ,

Returns: \

Returns: "

Returns: O

Returns: r

Returns: d

Returns: e

Returns: r

Returns: I

Returns: d

Returns: \

Returns: "

Returns: :

Returns: \

Returns: "

Returns: 0

Returns: \

Returns: "

Returns: ,

Returns: \

Returns: "

Returns: L

Returns: o

Returns: g

Returns: T

Returns: y

Returns: p

Returns: e

Returns: \

Returns: "

Returns: :

Returns: 5

Returns: ,

Returns: \

Returns: "

Returns: P

Returns: r

Returns: i

Returns: c

Returns: e

Returns: \

Returns: "

Returns: :

Returns: 0

Returns: ,

Returns: \

Returns: "

Returns: A

Returns: m

Returns: o

Returns: u

Returns: n

Returns: t

Returns: \

Returns: "

Returns: :

Returns: 0

Returns: ,

Returns: \

Returns: "

Returns: E

Returns: x

Returns: t

Returns: r

Returns: a

Returns: \

Returns: "

Returns: :

Returns: \

Returns: "

Returns: H

Returns: e

Returns: l

Returns: l

Returns: o

Returns: 

Returns: F

Returns: M

Returns: Z

Returns: \

Returns: "

Returns: ,

Returns: \

Returns: "

Returns: C

Returns: u

Returns: r

Returns: r

Returns: e

Returns: n

Returns: c

Returns: y

Returns: \

Returns: "

Returns: :

Returns: \

Returns: "

Returns: \

Returns: "

Returns: ,

Returns: \

Returns: "

Returns: I

Returns: n

Returns: s

Returns: t

Returns: r

Returns: u

Returns: m

Returns: e

Returns: n

Returns: t

Returns: \

Returns: "

Returns: :

Returns: \

Returns: "

Returns: \

Returns: "

Returns: ,

Returns: \

Returns: "

Returns: D

Returns: i

Returns: r

Returns: e

Returns: c

Returns: t

Returns: i

Returns: o

Returns: n

Returns: \

Returns: "

Returns: :

Returns: \

Returns: "

Returns: \

Returns: "

Returns: ,

Returns: \

Returns: "

Returns: T

Returns: i

Returns: m

Returns: e

Returns: \

Returns: "

Returns: :

Returns: 1

Returns: 7

Returns: 3

Returns: 2

Returns: 2

Returns: 6

Returns: 7

Returns: 4

Returns: 7

Returns: 3

Returns: 1

Returns: 0

Returns: 8

Returns: }

Returns: ]

Returns: ,

Returns: \

Returns: "

Returns: r

Returns: e

Returns: s

Returns: u

Returns: l

Returns: t

Returns: \

Returns: "

Returns: :

Returns: \

Returns: "

Returns: \

Returns: "

Returns: }

Returns: "

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: e

Returns: r

Returns: r

Returns: o

Returns: r

Returns: "

Returns: :

Returns: 

Returns: n

Returns: u

Returns: l

Returns: l

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: }

Returns: 

Returns: }

Returns: 

Returns: `

Returns: `

Returns: `

Returns: 

Returns: 

Returns: -

Returns: 

Returns: r

Returns: e

Returns: s

Returns: u

Returns: l

Returns: t

Returns: :

Returns: 

Returns: T

Returns: e

Returns: s

Returns: t

Returns: 

Returns: r

Returns: e

Returns: s

Returns: u

Returns: l

Returns: t

Returns: 

Returns: d

Returns: a

Returns: t

Returns: a

Returns: 

Returns: r

Returns: e

Returns: t

Returns: u

Returns: r

Returns: n

Returns: e

Returns: d

Returns: 

Returns: a

Returns: f

Returns: t

Returns: e

Returns: r

Returns: 

Returns: t

Returns: h

Returns: e

Returns: 

Returns: d

Returns: e

Returns: b

Returns: u

Returns: g

Returns: g

Returns: i

Returns: n

Returns: g

Returns: 

Returns: t

Returns: o

Returns: o

Returns: l

Returns: 

Returns: s

Returns: u

Returns: c

Returns: c

Returns: e

Returns: s

Returns: s

Returns: f

Returns: u

Returns: l

Returns: l

Returns: y

Returns: 

Returns: e

Returns: x

Returns: e

Returns: c

Returns: u

Returns: t

Returns: e

Returns: s

Returns: 

Returns: t

Returns: h

Returns: e

Returns: 

Returns: p

Returns: a

Returns: s

Returns: s

Returns: e

Returns: d

Returns: 

Returns: J

Returns: a

Returns: v

Returns: a

Returns: S

Returns: c

Returns: r

Returns: i

Returns: p

Returns: t

Returns: 

Returns: c

Returns: o

Returns: d

Returns: e

Returns: .

```{"eid": "OKEX", "pair": "ETH_BTC", "meta" :{"AccessKey": "123", "SecretKey": "123"}}```
```{"eid": "Huobi", "pair": "BCH_BTC", "meta" :{"AccessKey": "123", "SecretKey": "123"}}```

For the ```exchanges``` attribute in ```settings```, only one needs to be set when calling the ```PluginRun``` method (only one exchange object is supported when using the debugging tool page). Setting 2 exchange objects in ```settings``` will not cause an error, but accessing the second exchange object in the code will cause an error.

### GetRobotLogs

The ```GetRobotLogs``` method is used to get the live trading log information under the FMZ Quant Trading Platform account corresponding to the ```API KEY``` in the request. The live trading ID for which to get log information is specified by the ```robotId``` parameter.

Parameters:

- `robotId` (number, required): The ```robotId``` parameter is used to specify the live trading ID for which to get log information. You can use the ```GetRobotList``` method to get the live trading information under the account, which includes the live trading ID.
- `logMinId` (number, required): The ```logMinId``` parameter is used to specify the minimum ID of log records.
- `logMaxId` (number, required): The ```logMaxId``` parameter is used to specify the maximum ID of log records.
- `logOffset` (number, required): The ```logOffset``` parameter is used to set the offset. Within the range determined by ```logMinId``` and ```logMaxId```, skip the specified number of records according to ```logOffset``` to determine the starting position for data retrieval.
- `logLimit` (number, required): The ```logLimit``` parameter is used to set the number of data records to retrieve starting from the initial position.
- `profitMinId` (number, required): The ```profitMinId``` parameter is used to set the minimum ID of profit logs.
- `profitMaxId` (number, required): The ```profitMaxId``` parameter is used to set the maximum ID of profit logs.
- `profitOffset` (number, required): The ```profitOffset``` parameter is used to set the offset, i.e., skip the specified number of records as the starting position.
- `profitLimit` (number, required): The ```profitLimit``` parameter is used to set the number of data records to retrieve starting from the initial position.
- `chartMinId` (number, required): The ```chartMinId``` parameter is used to set the minimum ID of chart data records.
- `chartMaxId` (number, required): The ```chartMaxId``` parameter is used to set the maximum ID of chart data records.
- `chartOffset` (number, required): The ```chartOffset``` parameter is used to set the offset.
- `chartLimit` (number, required): The ```chartLimit``` parameter is used to set the number of records to retrieve.
- `chartUpdateBaseId` (number, required): The ```chartUpdateBaseId``` parameter is used to set the base ID for querying update records.
- `chartUpdateDate` (number, required): The ```chartUpdateDate``` parameter is used to set the update timestamp of data records, and the system will filter out records greater than this timestamp.
- `summaryLimit` (number, required): The ```summaryLimit``` parameter is used to set the number of bytes of status bar data to query. This parameter is an integer used to query the status bar data of live trading.

Setting it to 0 means not querying status bar information; setting it to a non-zero value indicates the number of bytes of status bar information to query (this interface does not limit the amount of data, you can specify a larger summaryLimit parameter to get all status bar information). The status bar data is stored in the ```summary``` field of the returned data.

Returns: `

Returns: `

Returns: `

Returns: j

Returns: s

Returns: o

Returns: n

Returns: 

Returns: {

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: c

Returns: o

Returns: d

Returns: e

Returns: "

Returns: :

Returns: 

Returns: 0

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: d

Returns: a

Returns: t

Returns: a

Returns: "

Returns: :

Returns: 

Returns: {

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: r

Returns: e

Returns: s

Returns: u

Returns: l

Returns: t

Returns: "

Returns: :

Returns: 

Returns: {

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: c

Returns: h

Returns: a

Returns: r

Returns: t

Returns: "

Returns: :

Returns: 

Returns: "

Returns: "

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: c

Returns: h

Returns: a

Returns: r

Returns: t

Returns: T

Returns: i

Returns: m

Returns: e

Returns: "

Returns: :

Returns: 

Returns: 0

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: l

Returns: o

Returns: g

Returns: s

Returns: "

Returns: :

Returns: 

Returns: [

Returns: {

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: T

Returns: o

Returns: t

Returns: a

Returns: l

Returns: "

Returns: :

Returns: 

Returns: 2

Returns: 0

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: M

Returns: a

Returns: x

Returns: "

Returns: :

Returns: 

Returns: 2

Returns: 0

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: M

Returns: i

Returns: n

Returns: "

Returns: :

Returns: 

Returns: 1

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: A

Returns: r

Returns: r

Returns: "

Returns: :

Returns: 

Returns: [

Returns: ]

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: }

Returns: ,

Returns: 

Returns: {

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: T

Returns: o

Returns: t

Returns: a

Returns: l

Returns: "

Returns: :

Returns: 

Returns: 0

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: M

Returns: a

Returns: x

Returns: "

Returns: :

Returns: 

Returns: 0

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: M

Returns: i

Returns: n

Returns: "

Returns: :

Returns: 

Returns: 0

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: A

Returns: r

Returns: r

Returns: "

Returns: :

Returns: 

Returns: [

Returns: ]

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: }

Returns: ,

Returns: 

Returns: {

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: T

Returns: o

Returns: t

Returns: a

Returns: l

Returns: "

Returns: :

Returns: 

Returns: 0

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: M

Returns: a

Returns: x

Returns: "

Returns: :

Returns: 

Returns: 0

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: M

Returns: i

Returns: n

Returns: "

Returns: :

Returns: 

Returns: 0

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: A

Returns: r

Returns: r

Returns: "

Returns: :

Returns: 

Returns: [

Returns: ]

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: }

Returns: ]

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: n

Returns: o

Returns: d

Returns: e

Returns: _

Returns: i

Returns: d

Returns: "

Returns: :

Returns: 

Returns: 1

Returns: 2

Returns: 3

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: o

Returns: n

Returns: l

Returns: i

Returns: n

Returns: e

Returns: "

Returns: :

Returns: 

Returns: t

Returns: r

Returns: u

Returns: e

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: r

Returns: e

Returns: f

Returns: r

Returns: e

Returns: s

Returns: h

Returns: "

Returns: :

Returns: 

Returns: 1

Returns: 7

Returns: 3

Returns: 2

Returns: 2

Returns: 0

Returns: 1

Returns: 5

Returns: 4

Returns: 4

Returns: 0

Returns: 0

Returns: 0

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: s

Returns: t

Returns: a

Returns: t

Returns: u

Returns: s

Returns: "

Returns: :

Returns: 

Returns: 4

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: s

Returns: u

Returns: m

Returns: m

Returns: a

Returns: r

Returns: y

Returns: "

Returns: :

Returns: 

Returns: "

Returns: .

Returns: .

Returns: .

Returns: "

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: u

Returns: p

Returns: d

Returns: a

Returns: t

Returns: e

Returns: T

Returns: i

Returns: m

Returns: e

Returns: "

Returns: :

Returns: 

Returns: 1

Returns: 7

Returns: 3

Returns: 2

Returns: 2

Returns: 0

Returns: 1

Returns: 5

Returns: 3

Returns: 2

Returns: 6

Returns: 3

Returns: 6

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: w

Returns: d

Returns: "

Returns: :

Returns: 

Returns: 0

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: }

Returns: ,

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: "

Returns: e

Returns: r

Returns: r

Returns: o

Returns: r

Returns: "

Returns: :

Returns: 

Returns: n

Returns: u

Returns: l

Returns: l

Returns: 

Returns: 

Returns: 

Returns: 

Returns: 

Returns: }

Returns: 

Returns: }

Returns: 

Returns: `

Returns: `

Returns: `

Returns: 

Returns: 

Returns: -

Returns: 

Returns: l

Returns: o

Returns: g

Returns: s

Returns: :

Returns: 

Returns: L

Returns: o

Returns: g

Returns: 

Returns: i

Returns: n

Returns: f

Returns: o

Returns: r

Returns: m

Returns: a

Returns: t

Returns: i

Returns: o

Returns: n

Returns: ;

Returns: 

Returns: t

Returns: h

Returns: e

Returns: 

Returns: q

Returns: u

Returns: e

Returns: r

Returns: i

Returns: e

Returns: d

Returns: 

Returns: l

Returns: o

Returns: g

Returns: 

Returns: d

Returns: a

Returns: t

Returns: a

Returns: 

Returns: e

Returns: n

Returns: t

Returns: r

Returns: i

Returns: e

Returns: s

Returns: 

Returns: a

Returns: r

Returns: e

Returns: 

Returns: s

Returns: t

Returns: o

Returns: r

Returns: e

Returns: d

Returns: 

Returns: i

Returns: n

Returns: 

Returns: t

Returns: h

Returns: e

Returns: 

Returns: A

Returns: r

Returns: r

Returns: 

Returns: f

Returns: i

Returns: e

Returns: l

Returns: d

Returns: .

Returns: 

Returns: 

Returns: 

Returns: T

Returns: h

Returns: e

Returns: 

Returns: f

Returns: i

Returns: r

Returns: s

Returns: t

Returns: 

Returns: d

Returns: a

Returns: t

Returns: a

Returns: 

Returns: s

Returns: t

Returns: r

Returns: u

Returns: c

Returns: t

Returns: u

Returns: r

Returns: e

Returns: 

Returns: i

Returns: n

Returns: 

Returns: l

Returns: o

Returns: g

Returns: s

Returns: 

Returns: c

Returns: o

Returns: n

Returns: t

Returns: a

Returns: i

Returns: n

Returns: s

Returns: 

Returns: l

Returns: o

Returns: g

Returns: 

Returns: r

Returns: e

Returns: c

Returns: o

Returns: r

Returns: d

Returns: s

Returns: 

Returns: f

Returns: r

Returns: o

Returns: m

Returns: 

Returns: t

Returns: h

Returns: e

Returns: 

Returns: s

Returns: t

Returns: r

Returns: a

Returns: t

Returns: e

Returns: g

Returns: y

Returns: 

Returns: l

Returns: o

Returns: g

Returns: 

Returns: t

Returns: a

Returns: b

Returns: l

Returns: e

Returns: 

Returns: i

Returns: n

Returns: 

Returns: t

Returns: h

Returns: e

Returns: 

Returns: l

Returns: i

Returns: v

Returns: e

Returns: 

Returns: t

Returns: r

Returns: a

Returns: d

Returns: i

Returns: n

Returns: g

Returns: 

Returns: d

Returns: a

Returns: t

Returns: a

Returns: b

Returns: a

Returns: s

Returns: e

Returns: .

Returns: 

Returns: 

Returns: 

Returns: T

Returns: h

Returns: e

Returns: 

Returns: s

Returns: e

Returns: c

Returns: o

Returns: n

Returns: d

Returns: 

Returns: d

Returns: a

Returns: t

Returns: a

Returns: 

Returns: s

Returns: t

Returns: r

Returns: u

Returns: c

Returns: t

Returns: u

Returns: r

Returns: e

Returns: 

Returns: i

Returns: n

Returns: 

Returns: l

Returns: o

Returns: g

Returns: s

Returns: 

Returns: c

Returns: o

Returns: n

Returns: t

Returns: a

Returns: i

Returns: n

Returns: s

Returns: 

Returns: l

Returns: o

Returns: g

Returns: 

Returns: r

Returns: e

Returns: c

Returns: o

Returns: r

Returns: d

Returns: s

Returns: 

Returns: f

Returns: r

Returns: o

Returns: m

Returns: 

Returns: t

Returns: h

Returns: e

Returns: 

Returns: p

Returns: r

Returns: o

Returns: f

Returns: i

Returns: t

Returns: 

Returns: l

Returns: o

Returns: g

Returns: 

Returns: t

Returns: a

Returns: b

Returns: l

Returns: e

Returns: 

Returns: i

Returns: n

Returns: 

Returns: t

Returns: h

Returns: e

Returns: 

Returns: l

Returns: i

Returns: v

Returns: e

Returns: 

Returns: t

Returns: r

Returns: a

Returns: d

Returns: i

Returns: n

Returns: g

Returns: 

Returns: d

Returns: a

Returns: t

Returns: a

Returns: b

Returns: a

Returns: s

Returns: e

Returns: .

Returns: 

Returns: 

Returns: 

Returns: T

Returns: h

Returns: e

Returns: 

Returns: t

Returns: h

Returns: i

Returns: r

Returns: d

Returns: 

Returns: d

Returns: a

Returns: t

Returns: a

Returns: 

Returns: s

Returns: t

Returns: r

Returns: u

Returns: c

Returns: t

Returns: u

Returns: r

Returns: e

Returns: 

Returns: i

Returns: n

Returns: 

Returns: l

Returns: o

Returns: g

Returns: s

Returns: 

Returns: c

Returns: o

Returns: n

Returns: t

Returns: a

Returns: i

Returns: n

Returns: s

Returns: 

Returns: l

Returns: o

Returns: g

Returns: 

Returns: r

Returns: e

Returns: c

Returns: o

Returns: r

Returns: d

Returns: s

Returns: 

Returns: f

Returns: r

Returns: o

Returns: m

Returns: 

Returns: t

Returns: h

Returns: e

Returns: 

Returns: c

Returns: h

Returns: a

Returns: r

Returns: t

Returns: 

Returns: l

Returns: o

Returns: g

Returns: 

Returns: t

Returns: a

Returns: b

Returns: l

Returns: e

Returns: 

Returns: i

Returns: n

Returns: 

Returns: t

Returns: h

Returns: e

Returns: 

Returns: l

Returns: i

Returns: v

Returns: e

Returns: 

Returns: t

Returns: r

Returns: a

Returns: d

Returns: i

Returns: n

Returns: g

Returns: 

Returns: d

Returns: a

Returns: t

Returns: a

Returns: b

Returns: a

Returns: s

Returns: e

Returns: .

Returns: 

Returns: -

Returns: 

Returns: s

Returns: u

Returns: m

Returns: m

Returns: a

Returns: r

Returns: y

Returns: :

Returns: 

Returns: L

Returns: i

Returns: v

Returns: e

Returns: 

Returns: t

Returns: r

Returns: a

Returns: d

Returns: i

Returns: n

Returns: g

Returns: 

Returns: s

Returns: t

Returns: a

Returns: t

Returns: u

Returns: s

Returns: 

Returns: b

Returns: a

Returns: r

Returns: 

Returns: d

Returns: a

Returns: t

Returns: a

Returns: .

- Strategy log table in database
  The description of the ```Arr``` attribute value in the first element (log data) of the ```logs``` attribute value (array structure) in the returned data is as follows:

  ```plaintext
  "Arr": [
      [3977, 3, "Futures_OKCoin", "", 0, 0, "Sell(688.9, 2): 20016", 1526954372591, "", ""],
      [3976, 5, "", "", 0, 0, "OKCoin:this_week Position too large, long: 2", 1526954372410, "", ""]
  ],
  ```

  | id | logType | eid | orderId | price | amount | extra | date | contractType | direction |
  | - | - | - | - | - | - | - | - | - | - |
  | 3977 | 3 | "Futures_OKCoin" | "" | 0 | 0 | "Sell(688.9, 2): 20016" | 1526954372591 | "" | "" |
  | 3976 | 5 | "" | "" | 0 | 0 | "OKCoin:this_week Position too large, long: 2" | 1526954372410 | "" | "" |

  ```extra``` is the additional information for the printed log.

  The log type descriptions corresponding to ```logType``` values are as follows:

  | logType: | 0 | 1 | 2 | 3 | 4 | 5 | 6 |
  | - | - | - | - | - | - | - | - |
  | logType meaning: | BUY | SALE | RETRACT | ERROR | PROFIT | MESSAGE | RESTART |
  | English meaning | Buy order log | Sell order log | Cancel order | Error | Profit | Message | Restart |

- Profit chart log table in database
  The data in this chart log table is consistent with the profit logs in the strategy log table.

  ```plaintext
  "Arr": [
      [202, 2515.44, 1575896700315],
      [201, 1415.44, 1575896341568]
  ]
  ```

  Taking one log data as an example:

  ```plaintext
  [202, 2515.44, 1575896700315]
  ```

  ```202``` is the log ID, ```2515.44``` is the profit value, ```1575896700315``` is the timestamp.
- Chart log table in database

  ```plaintext
  "Arr": [
      [23637, 0, "{\"close\":648,\"high\":650.5,\"low\":647,\"open\":650,\"x\":1575960300000}"],
      [23636, 5, "{\"x\":1575960300000,\"y\":3.0735}"]
  ]
  ```

  Taking one log data as an example:

  ```plaintext
  [23637, 0, "{\"close\":648,\"high\":650.5,\"low\":647,\"open\":650,\"x\":1575960300000}"],
  ```

  ```23637``` is the log ID, ```0``` is the chart data series index, and the final data ```"{\"close\":648,\"high\":650.5,\"low\":647,\"open\":650,\"x\":1575960300000}"``` is the log data, which is the K-line data on the chart.
