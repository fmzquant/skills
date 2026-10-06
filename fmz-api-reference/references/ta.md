# `TA.*` reference (extracted from `ta.js`)

The `TA` object is the FMZ-written indicator library. This file follows the JavaScript implementation (`backtest/js/ta.js`); the Python, C++ (`TAHelper`) and Rust (`TAHelper`/`Ticks`) ports expose the same functions with the same defaults and output shapes. Where a port differs in calling convention it is noted.

Conventions used below: `r` is the input array, `n = r.length`, `out[i]` is aligned with `r[i]` unless stated, "NaN" means `NaN` (JS/C++/Rust) or `float('nan')` (Python). Every call also reports its name and parameters to the host (`_log`), which the backtest uses to draw indicator charts.

## Input handling (`Std._ticks`)

- If `r[0].Close` is defined, the series is `r[i].Close`; otherwise `r` is used as a plain number array. Empty input gives `[]`.
- Functions marked **K-line only** read `High/Low/Close/Volume` directly and must be given records (`OBV` and `ATR` throw `"argument must KLine"` on a number array; `KDJ`, `Alligator`, `CMF` would read `undefined` fields and return NaN).

## Window helpers (`Std`)

| Helper | Behaviour |
|---|---|
| `_skip(arr, period)` | index `j` at which the `period`-th non-NaN value appears (leading NaNs are skipped); `arr.length` if there are fewer |
| `_sum`/`_avg(arr, num)` | sum / mean of the non-NaN values among the first `num` |
| `_sma(S, period)` | `out[0..j) = NaN`, `out[j] = sum(first j+1 non-NaN) / period`, then rolling `sum += S[i] - S[i-period]` |
| `_smma(S, period)` | `out[j] = avg(first j+1)`, then `out[i] = (out[i-1]*(period-1) + S[i]) / period` (Wilder smoothing) |
| `_ema(S, period)` | `k = 2/(period+1)`; `out[j] = avg(first j+1)` (SMA seed), then `out[i] = (S[i]-out[i-1])*k + out[i-1]` |
| `_diff(a, b)` | `a[i]-b[i]`, NaN where either is NaN, length `b.length` |
| `_move_diff(a)` | `a[i]-a[i-1]` for `i >= 1` (length `n-1`) |

The SMA seed for EMA/SMMA means `TA.EMA` values near the start differ slightly from libraries that seed with the first price.

## Functions

### `TA.Highest(r, n, attr)` / `TA.Lowest(r, n, attr)`

- Input: records with `attr` (`"Open" | "High" | "Low" | "Close" | "Volume" | "OpenInterest"`), or a number array without `attr`. C++ takes a `vector<double>` (`TA.Highest(r.Close(), 10)`), Rust a `&[f64]`/`&Vec<f64>`; neither has `attr`.
- Output: **one number**.
- Window: the `n` elements **before the last one**, i.e. indices `[length-1-n, length-2]`; `n` is clamped to `length-1`; `n = 0` means all elements before the last.
- Edge: fewer than 2 elements -> `NaN`. The running seed is `Number.MIN_VALUE` (a tiny positive number) for `Highest` and `Number.MAX_VALUE` for `Lowest`, so `Highest` of an all-negative series returns `5e-324`, not the true maximum.

### `TA.MA(r, period = 9)` and `TA.SMA(r, period = 9)`

- Identical: simple moving average of Close (or of the number array).
- Output: array, `NaN` for `i < period-1` (later if the input has leading NaNs).

### `TA.EMA(r, period = 9)`

- Exponential moving average, SMA-seeded (see helpers).
- Output: array, `NaN` for `i < period-1`.

### `TA.MACD(r, fast = 12, slow = 26, signal = 9)`

- `dif = EMA(fast) - EMA(slow)`, `dea = EMA(dif, signal)`, `hist = dif - dea`.
- Output: `[dif, dea, hist]` (docs call them DIF, DEA, MACD); all three aligned with `r`.
- First valid index: `dif` at `slow-1`; `dea` and `hist` at `slow+signal-2` (e.g. 33 for 12/26/9), so at least `slow+signal-1` bars are needed. The histogram is **not** multiplied by 2.

### `TA.BOLL(r, period = 20, multiplier = 2)`

- Middle = SMA(period); `stdev` is the **population** standard deviation over the window (divide by `period`); upper/lower = middle +/- `multiplier * stdev`.
- Output: `[upper, middle, lower]`, `NaN` for `i < period-1`.
- Edge: the initial window sum adds `S[0..period-1]` without skipping NaN, so a number array with leading NaNs yields NaN throughout; pass clean numbers or records.

### `TA.KDJ(r, n = 9, k = 3, d = 3)` - K-line only

- `RSV[i] = 100 * (Close - lowestLow) / (highestHigh - lowestLow)` over the window `[i-n+1, i]` (100 when high == low).
- `K[i] = (RSV[i] + (k-1)*K[i-1]) / k`, `D[i] = (K[i] + (d-1)*D[i-1]) / d`, `J = 3K - 2D`.
- Seed: for `i < n-1` the internal K and D are 50 (RSV 0); those first `n-1` entries of K, D and J are then set to `NaN`. The seed 50 still influences the first real values.
- Output: `[K, D, J]`, `NaN` for `i < n-1`. Needs `n` bars.

### `TA.RSI(r, period = 14)`

- Wilder RSI. Deltas `Close[i]-Close[i-1]`; the first `period` deltas seed the average gain/loss (gains and losses divided by `period`); afterwards `avg = (avg*(period-1) + value) / period`.
- Output: array; `NaN` for `i < period` (first value at index `period`, not `period-1`). If `n < period` the whole array is NaN.
- Edge: seed `rs = 0` when the seed loss is 0 (RSI 0); later an average loss of 0 gives `rs = Infinity` and RSI 100.

### `TA.OBV(r)` - K-line only

- `out[0] = Volume[0]`; `out[i] = out[i-1] + Volume[i]` when `Close[i] >= Close[i-1]` (equal counts as up), else `- Volume[i]`.
- Output: array, no NaN. Empty input -> `[]`.

### `TA.ATR(r, period = 14)` - K-line only

- `TR[0] = High-Low`; `TR[i] = max(High-Low, |High-prevClose|, |prevClose-Low|)`.
- For `i < period` the value is the plain average of the TRs so far (expanding window); from `i = period` on, Wilder smoothing `((period-1)*prev + TR) / period`.
- Output: array, no NaN (first `period` values are warm-up). Empty input -> `[]`.

### `TA.Alligator(r, jaw = 13, teeth = 8, lips = 5)` - K-line only

- Series: median price `(High+Low)/2`; each line is `SMMA(series, length)` **shifted forward**: jaw by 8 bars, teeth by 5, lips by 3 (the standard Bill Williams offsets, hard-coded regardless of the lengths).
- Output: `[jaw, teeth, lips]` with lengths `n+8`, `n+5`, `n+3`. `jaw[i]` is the value plotted on bar `i`; the entry for the current bar is `jaw[n-1]`; the last 8/5/3 entries are projections into the future.
- First valid index: jaw `8 + jaw-1` (20 by default), teeth `5 + teeth-1` (12), lips `3 + lips-1` (7).

### `TA.CMF(r, periods = 20)` - K-line only

- Money-flow volume per bar `mfv = ((Close-Low) - (High-Close)) / (High-Low) * Volume` (0 when High == Low); `out[i] = sum(mfv) / sum(Volume)` over the last `periods` bars (an expanding window until `periods` bars exist).
- Output: array, no NaN unless the volume sum is 0 (`0/0`). `periods = 0` falls back to 20 (`periods || 20`).

## Quick index of shapes and warm-up

| Function | Needs records | Output | NaN prefix / warm-up |
|---|---|---|---|
| `Highest`, `Lowest` | optional (`attr`) | number | NaN if fewer than 2 elements |
| `MA`, `SMA`, `EMA` | no | array | `period-1` |
| `MACD` | no | 3 arrays | `slow-1`, `slow+signal-2`, `slow+signal-2` |
| `BOLL` | no | 3 arrays | `period-1` |
| `KDJ` | yes | 3 arrays | `n-1` |
| `RSI` | no | array | `period` (all NaN if `n < period`) |
| `OBV` | yes | array | none |
| `ATR` | yes | array | none (expanding average for `period` bars) |
| `Alligator` | yes | 3 arrays, longer than input | 20 / 12 / 7 (defaults) |
| `CMF` | yes | array | none (expanding window) |

## Port notes

- **Python**: same names and argument order (`TA.MACD(r, 12, 26, 9)` returns a list of three lists); `TA.Highest(records, 10, "Open")` supports `attr` like JavaScript.
- **C++** (`TA.hpp`): `TAHelper TA;` with overloads for `vector<double>&` and `Records&`; `MACD/KDJ/BOLL/Alligator` return `array<vector<double>, 3>`; `Highest/Lowest(vector<double>, size_t n)` only; `BOLL` multiplier is `double`.
- **Rust** (`fmz.rs`): `TA.MA(&records, 20)` / `TA.MA(&closes, 20)` via the `Ticks` trait (`Vec<Record>`, `[Record]`, `Vec<f64>`, `[f64]`); optional periods take `None`; `MACD/BOLL/KDJ/Alligator` return `[Vec<f64>; 3]`; `KDJ/OBV/ATR/Alligator/CMF` take `&[Record]`; `Highest/Lowest(&T, n: usize)` return `f64`.
