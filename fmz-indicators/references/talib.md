# TA-Lib functions available as `talib.*` (generated)

Call as `talib.NAME(records_or_array, params...)` in JavaScript / Python / C++ / Rust (same names). `Records[...]` lists which fields of the K-line records the function reads; parameters show their defaults; the result is an array (or several arrays) aligned with the input, with `NaN`/`null` where the window is not yet full.

| Function | Description | 中文 | Signature |
|---|---|---|---|
| `ACOS` | Vector Trigonometric ACos | 反余弦函数 | `ACOS(Records[Close]) = Array(outReal)` |
| `AD` | Chaikin A/D Line | 线随机指标 | `AD(Records[High,Low,Close,Volume]) = Array(outReal)` |
| `ADOSC` | Chaikin A/D Oscillator | 佳庆指标 | `ADOSC(Records[High,Low,Close,Volume],Fast Period = 3,Slow Period = 10) = Array(outReal)` |
| `ADX` | Average Directional Movement Index | 平均趋向指数 | `ADX(Records[High,Low,Close],Time Period = 14) = Array(outReal)` |
| `ADXR` | Average Directional Movement Index Rating | 评估指数 | `ADXR(Records[High,Low,Close],Time Period = 14) = Array(outReal)` |
| `APO` | Absolute Price Oscillator | 绝对价格振荡指数 | `APO(Records[Close],Fast Period = 12,Slow Period = 26,MA Type = 0) = Array(outReal)` |
| `AROON` | Aroon | 阿隆指标 | `AROON(Records[High,Low],Time Period = 14) = [Array(outAroonDown),Array(outAroonUp)]` |
| `AROONOSC` | Aroon Oscillator | 阿隆震荡线 | `AROONOSC(Records[High,Low],Time Period = 14) = Array(outReal)` |
| `ASIN` | Vector Trigonometric ASin | 反正弦函数 | `ASIN(Records[Close]) = Array(outReal)` |
| `ATAN` | Vector Trigonometric ATan | 反正切函数 | `ATAN(Records[Close]) = Array(outReal)` |
| `ATR` | Average True Range | 平均真实波幅 | `ATR(Records[High,Low,Close],Time Period = 14) = Array(outReal)` |
| `AVGPRICE` | Average Price | 平均价格 | `AVGPRICE(Records[Open,High,Low,Close]) = Array(outReal)` |
| `BBANDS` | Bollinger Bands | 布林带 | `BBANDS(Records[Close],Time Period = 5,Deviations up = 2,Deviations down = 2,MA Type = 0) = [Array(outRealUpperBand),Array(outRealMiddleBand),Array(outRealLowerBand)]` |
| `BOP` | Balance Of Power | 均势指标 | `BOP(Records[Open,High,Low,Close]) = Array(outReal)` |
| `CCI` | Commodity Channel Index | 顺势指标 | `CCI(Records[High,Low,Close],Time Period = 14) = Array(outReal)` |
| `CDL2CROWS` | Two Crows | K线图--两只乌鸦 | `CDL2CROWS(Records[Open,High,Low,Close]) = Array(outInteger)` |
| `CDL3BLACKCROWS` | Three Black Crows | K线图--3只黑乌鸦 | `CDL3BLACKCROWS(Records[Open,High,Low,Close]) = Array(outInteger)` |
| `CDL3INSIDE` | Three Inside Up/Down | K线图:3内上下震荡 | `CDL3INSIDE(Records[Open,High,Low,Close]) = Array(outInteger)` |
| `CDL3LINESTRIKE` | Three-Line Strike  | K线图:3线震荡 | `CDL3LINESTRIKE(Records[Open,High,Low,Close]) = Array(outInteger)` |
| `CDL3OUTSIDE` | Three Outside Up/Down | K线图:3外下震荡 | `CDL3OUTSIDE(Records[Open,High,Low,Close]) = Array(outInteger)` |
| `CDL3STARSINSOUTH` | Three Stars In The South | K线图:南方三星 | `CDL3STARSINSOUTH(Records[Open,High,Low,Close]) = Array(outInteger)` |
| `CDL3WHITESOLDIERS` | Three Advancing White Soldiers | K线图:三白兵 | `CDL3WHITESOLDIERS(Records[Open,High,Low,Close]) = Array(outInteger)` |
| `CDLABANDONEDBABY` | Abandoned Baby | K线图:弃婴 | `CDLABANDONEDBABY(Records[Open,High,Low,Close],Penetration = 0.3) = Array(outInteger)` |
| `CDLADVANCEBLOCK` | Advance Block | K线图:推进 | `CDLADVANCEBLOCK(Records[Open,High,Low,Close]) = Array(outInteger)` |
| `CDLBELTHOLD` | Belt-hold | K线图:带住 | `CDLBELTHOLD(Records[Open,High,Low,Close]) = Array(outInteger)` |
| `CDLBREAKAWAY` | Breakaway | K线图:分离 | `CDLBREAKAWAY(Records[Open,High,Low,Close]) = Array(outInteger)` |
| `CDLCLOSINGMARUBOZU` | Closing Marubozu | K线图:收盘光头光脚 | `CDLCLOSINGMARUBOZU(Records[Open,High,Low,Close]) = Array(outInteger)` |
| `CDLCONCEALBABYSWALL` | Concealing Baby Swallow | K线图:藏婴吞没形态 | `CDLCONCEALBABYSWALL(Records[Open,High,Low,Close]) = Array(outInteger)` |
| `CDLCOUNTERATTACK` | Counterattack | K线图:反击 | `CDLCOUNTERATTACK(Records[Open,High,Low,Close]) = Array(outInteger)` |
| `CDLDARKCLOUDCOVER` | Dark Cloud Cover | K线图:乌云盖 | `CDLDARKCLOUDCOVER(Records[Open,High,Low,Close],Penetration = 0.5) = Array(outInteger)` |
| `CDLDOJI` | Doji | K线图:十字星  | `CDLDOJI(Records[Open,High,Low,Close]) = Array(outInteger)` |
| `CDLDOJISTAR` | Doji Star | K线图:十字星 | `CDLDOJISTAR(Records[Open,High,Low,Close]) = Array(outInteger)` |
| `CDLDRAGONFLYDOJI` | Dragonfly Doji | K线图:蜻蜓十字星 | `CDLDRAGONFLYDOJI(Records[Open,High,Low,Close]) = Array(outInteger)` |
| `CDLENGULFING` | Engulfing Pattern | K线图:吞没 | `CDLENGULFING(Records[Open,High,Low,Close]) = Array(outInteger)` |
| `CDLEVENINGDOJISTAR` | Evening Doji Star | K线图:黄昏十字星 | `CDLEVENINGDOJISTAR(Records[Open,High,Low,Close],Penetration = 0.3) = Array(outInteger)` |
| `CDLEVENINGSTAR` | Evening Star | K线图:黄昏之星 | `CDLEVENINGSTAR(Records[Open,High,Low,Close],Penetration = 0.3) = Array(outInteger)` |
| `CDLGAPSIDESIDEWHITE` | Up/Down-gap side-by-side white lines | K线图:上/下间隙并排的白色线条 | `CDLGAPSIDESIDEWHITE(Records[Open,High,Low,Close]) = Array(outInteger)` |
| `CDLGRAVESTONEDOJI` | Gravestone Doji | K线图:墓碑十字线 | `CDLGRAVESTONEDOJI(Records[Open,High,Low,Close]) = Array(outInteger)` |
| `CDLHAMMER` | Hammer | K线图:锤 | `CDLHAMMER(Records[Open,High,Low,Close]) = Array(outInteger)` |
| `CDLHANGINGMAN` | Hanging Man | K线图:吊人 | `CDLHANGINGMAN(Records[Open,High,Low,Close]) = Array(outInteger)` |
| `CDLHARAMI` | Harami Pattern | K线图:阴阳线 | `CDLHARAMI(Records[Open,High,Low,Close]) = Array(outInteger)` |
| `CDLHARAMICROSS` | Harami Cross Pattern | K线图:交叉阴阳线 | `CDLHARAMICROSS(Records[Open,High,Low,Close]) = Array(outInteger)` |
| `CDLHIGHWAVE` | High-Wave Candle | K线图:长脚十字线  | `CDLHIGHWAVE(Records[Open,High,Low,Close]) = Array(outInteger)` |
| `CDLHIKKAKE` | Hikkake Pattern | K线图:陷阱 | `CDLHIKKAKE(Records[Open,High,Low,Close]) = Array(outInteger)` |
| `CDLHIKKAKEMOD` | Modified Hikkake Pattern | K线图:改良的陷阱 | `CDLHIKKAKEMOD(Records[Open,High,Low,Close]) = Array(outInteger)` |
| `CDLHOMINGPIGEON` | Homing Pigeon | K线图:信鸽 | `CDLHOMINGPIGEON(Records[Open,High,Low,Close]) = Array(outInteger)` |
| `CDLIDENTICAL3CROWS` | Identical Three Crows | K线图:相同的三只乌鸦 | `CDLIDENTICAL3CROWS(Records[Open,High,Low,Close]) = Array(outInteger)` |
| `CDLINNECK` | In-Neck Pattern | K线图:颈纹 | `CDLINNECK(Records[Open,High,Low,Close]) = Array(outInteger)` |
| `CDLINVERTEDHAMMER` | Inverted Hammer | K线图:倒锤 | `CDLINVERTEDHAMMER(Records[Open,High,Low,Close]) = Array(outInteger)` |
| `CDLKICKING` | Kicking | K线图:踢 | `CDLKICKING(Records[Open,High,Low,Close]) = Array(outInteger)` |
| `CDLKICKINGBYLENGTH` | Kicking - bull/bear determined by the longer marubozu | K线图:踢牛/踢熊 | `CDLKICKINGBYLENGTH(Records[Open,High,Low,Close]) = Array(outInteger)` |
| `CDLLADDERBOTTOM` | Ladder Bottom | K线图:梯底 | `CDLLADDERBOTTOM(Records[Open,High,Low,Close]) = Array(outInteger)` |
| `CDLLONGLEGGEDDOJI` | Long Legged Doji | K线图:长腿十字线 | `CDLLONGLEGGEDDOJI(Records[Open,High,Low,Close]) = Array(outInteger)` |
| `CDLLONGLINE` | Long Line Candle | K线图:长线 | `CDLLONGLINE(Records[Open,High,Low,Close]) = Array(outInteger)` |
| `CDLMARUBOZU` | Marubozu | K线图:光头光脚  | `CDLMARUBOZU(Records[Open,High,Low,Close]) = Array(outInteger)` |
| `CDLMATCHINGLOW` | Matching Low | K线图:匹配低 | `CDLMATCHINGLOW(Records[Open,High,Low,Close]) = Array(outInteger)` |
| `CDLMATHOLD` | Mat Hold | K线图:垫住 | `CDLMATHOLD(Records[Open,High,Low,Close],Penetration = 0.5) = Array(outInteger)` |
| `CDLMORNINGDOJISTAR` | Morning Doji Star | K线图:早晨十字星 | `CDLMORNINGDOJISTAR(Records[Open,High,Low,Close],Penetration = 0.3) = Array(outInteger)` |
| `CDLMORNINGSTAR` | Morning Star | K线图:晨星 | `CDLMORNINGSTAR(Records[Open,High,Low,Close],Penetration = 0.3) = Array(outInteger)` |
| `CDLONNECK` | On-Neck Pattern | K线图:颈型 | `CDLONNECK(Records[Open,High,Low,Close]) = Array(outInteger)` |
| `CDLPIERCING` | Piercing Pattern | K线图:穿孔模式 | `CDLPIERCING(Records[Open,High,Low,Close]) = Array(outInteger)` |
| `CDLRICKSHAWMAN` | Rickshaw Man | K线图:车夫 | `CDLRICKSHAWMAN(Records[Open,High,Low,Close]) = Array(outInteger)` |
| `CDLRISEFALL3METHODS` | Rising/Falling Three Methods | K线图:上升/下降三法 | `CDLRISEFALL3METHODS(Records[Open,High,Low,Close]) = Array(outInteger)` |
| `CDLSEPARATINGLINES` | Separating Lines | K线图:分割线 | `CDLSEPARATINGLINES(Records[Open,High,Low,Close]) = Array(outInteger)` |
| `CDLSHOOTINGSTAR` | Shooting Star | K线图:流星 | `CDLSHOOTINGSTAR(Records[Open,High,Low,Close]) = Array(outInteger)` |
| `CDLSHORTLINE` | Short Line Candle | K线图:短线 | `CDLSHORTLINE(Records[Open,High,Low,Close]) = Array(outInteger)` |
| `CDLSPINNINGTOP` | Spinning Top | K线图:陀螺 | `CDLSPINNINGTOP(Records[Open,High,Low,Close]) = Array(outInteger)` |
| `CDLSTALLEDPATTERN` | Stalled Pattern | K线图:停滞模式 | `CDLSTALLEDPATTERN(Records[Open,High,Low,Close]) = Array(outInteger)` |
| `CDLSTICKSANDWICH` | Stick Sandwich | K线图:棍子三明治 | `CDLSTICKSANDWICH(Records[Open,High,Low,Close]) = Array(outInteger)` |
| `CDLTAKURI` | Takuri (Dragonfly Doji with very long lower shadow) | K线图:托里 | `CDLTAKURI(Records[Open,High,Low,Close]) = Array(outInteger)` |
| `CDLTASUKIGAP` | Tasuki Gap | K线图:翼隙 | `CDLTASUKIGAP(Records[Open,High,Low,Close]) = Array(outInteger)` |
| `CDLTHRUSTING` | Thrusting Pattern | K线图:推模式 | `CDLTHRUSTING(Records[Open,High,Low,Close]) = Array(outInteger)` |
| `CDLTRISTAR` | Tristar Pattern | K线图:三星模式 | `CDLTRISTAR(Records[Open,High,Low,Close]) = Array(outInteger)` |
| `CDLUNIQUE3RIVER` | Unique 3 River | K线图:独特的3河 | `CDLUNIQUE3RIVER(Records[Open,High,Low,Close]) = Array(outInteger)` |
| `CDLUPSIDEGAP2CROWS` | Upside Gap Two Crows | K线图:双飞乌鸦 | `CDLUPSIDEGAP2CROWS(Records[Open,High,Low,Close]) = Array(outInteger)` |
| `CDLXSIDEGAP3METHODS` | Upside/Downside Gap Three Methods | K线图:上行/下行缺口三方法 | `CDLXSIDEGAP3METHODS(Records[Open,High,Low,Close]) = Array(outInteger)` |
| `CEIL` | Vector Ceil | 取整函数 | `CEIL(Records[Close]) = Array(outReal)` |
| `CMO` | Chande Momentum Oscillator | 钱德动量摆动指标 | `CMO(Records[Close],Time Period = 14) = Array(outReal)` |
| `COS` | Vector Trigonometric Cos | 余弦函数 | `COS(Records[Close]) = Array(outReal)` |
| `COSH` | Vector Trigonometric Cosh | 双曲余弦值 | `COSH(Records[Close]) = Array(outReal)` |
| `DEMA` | Double Exponential Moving Average | 双指数移动平均线 | `DEMA(Records[Close],Time Period = 30) = Array(outReal)` |
| `DX` | Directional Movement Index | 动向指数 | `DX(Records[High,Low,Close],Time Period = 14) = Array(outReal)` |
| `EMA` | Exponential Moving Average | 指数移动平均线 | `EMA(Records[Close],Time Period = 30) = Array(outReal)` |
| `EXP` | Vector Arithmetic Exp | 指数函数 | `EXP(Records[Close]) = Array(outReal)` |
| `FLOOR` | Vector Floor | 向下取整 | `FLOOR(Records[Close]) = Array(outReal)` |
| `HT_DCPERIOD` | Hilbert Transform - Dominant Cycle Period | 希尔伯特变换, 主周期 | `HT_DCPERIOD(Records[Close]) = Array(outReal)` |
| `HT_DCPHASE` | Hilbert Transform - Dominant Cycle Phase | 希尔伯特变换,主阶段 | `HT_DCPHASE(Records[Close]) = Array(outReal)` |
| `HT_PHASOR` | Hilbert Transform - Phasor Components | 希尔伯特变换,相成分 | `HT_PHASOR(Records[Close]) = [Array(outInPhase),Array(outQuadrature)]` |
| `HT_SINE` | Hilbert Transform - SineWave | 希尔伯特变换,正弦波 | `HT_SINE(Records[Close]) = [Array(outSine),Array(outLeadSine)]` |
| `HT_TRENDLINE` | Hilbert Transform - Instantaneous Trendline | 希尔伯特变换,瞬时趋势 | `HT_TRENDLINE(Records[Close]) = Array(outReal)` |
| `HT_TRENDMODE` | Hilbert Transform - Trend vs Cycle Mode | 希尔伯特变换-趋势与周期模式 | `HT_TRENDMODE(Records[Close]) = Array(outInteger)` |
| `KAMA` | Kaufman Adaptive Moving Average | 适应性移动平均线 | `KAMA(Records[Close],Time Period = 30) = Array(outReal)` |
| `LINEARREG` | Linear Regression | 线性回归 | `LINEARREG(Records[Close],Time Period = 14) = Array(outReal)` |
| `LINEARREG_ANGLE` | Linear Regression Angle | 线性回归的角度 | `LINEARREG_ANGLE(Records[Close],Time Period = 14) = Array(outReal)` |
| `LINEARREG_INTERCEPT` | Linear Regression Intercept | 线性回归截距 | `LINEARREG_INTERCEPT(Records[Close],Time Period = 14) = Array(outReal)` |
| `LINEARREG_SLOPE` | Linear Regression Slope | 线性回归斜率 | `LINEARREG_SLOPE(Records[Close],Time Period = 14) = Array(outReal)` |
| `LN` | Vector Log Natural | 自然对数 | `LN(Records[Close]) = Array(outReal)` |
| `LOG10` | Vector Log10 | 对数函数 | `LOG10(Records[Close]) = Array(outReal)` |
| `MA` | Moving average | 移动平均线 | `MA(Records[Close],Time Period = 30,MA Type = 0) = Array(outReal)` |
| `MACD` | Moving Average Convergence/Divergence | 指数平滑移动平均线 | `MACD(Records[Close],Fast Period = 12,Slow Period = 26,Signal Period = 9) = [Array(outMACD),Array(outMACDSignal),Array(outMACDHist)]` |
| `MACDEXT` | MACD with controllable MA type | MA型可控 MACD | `MACDEXT(Records[Close],Fast Period = 12,Fast MA = 0,Slow Period = 26,Slow MA = 0,Signal Period = 9,Signal MA = 0) = [Array(outMACD),Array(outMACDSignal),Array(outMACDHist)]` |
| `MACDFIX` | Moving Average Convergence/Divergence Fix 12/26 | 移动平均收敛/发散修复12/26 | `MACDFIX(Records[Close],Signal Period = 9) = [Array(outMACD),Array(outMACDSignal),Array(outMACDHist)]` |
| `MAMA` | MESA Adaptive Moving Average | MESA 移动平均线 | `MAMA(Records[Close],Fast Limit = 0.5,Slow Limit = 0.05) = [Array(outMAMA),Array(outFAMA)]` |
| `MAX` | Highest value over a specified period | 最大值 | `MAX(Records[Close],Time Period = 30) = Array(outReal)` |
| `MAXINDEX` | Index of highest value over a specified period | 最大值索引 | `MAXINDEX(Records[Close],Time Period = 30) = Array(outInteger)` |
| `MEDPRICE` | Median Price | 中位数价格 | `MEDPRICE(Records[High,Low]) = Array(outReal)` |
| `MFI` | Money Flow Index | 货币流量指数 | `MFI(Records[High,Low,Close,Volume],Time Period = 14) = Array(outReal)` |
| `MIDPOINT` | MidPoint over period | 中点 | `MIDPOINT(Records[Close],Time Period = 14) = Array(outReal)` |
| `MIDPRICE` | Midpoint Price over period | 中点价格 | `MIDPRICE(Records[High,Low],Time Period = 14) = Array(outReal)` |
| `MIN` | Lowest value over a specified period | 最小值 | `MIN(Records[Close],Time Period = 30) = Array(outReal)` |
| `MININDEX` | Index of lowest value over a specified period | 最小值索引 | `MININDEX(Records[Close],Time Period = 30) = Array(outInteger)` |
| `MINMAX` | Lowest and highest values over a specified period | 最小最大值 | `MINMAX(Records[Close],Time Period = 30) = [Array(outMin),Array(outMax)]` |
| `MINMAXINDEX` | Indexes of lowest and highest values over a specified period | 最小最大值索引 | `MINMAXINDEX(Records[Close],Time Period = 30) = [Array(outMinIdx),Array(outMaxIdx)]` |
| `MINUS_DI` | Minus Directional Indicator | 负向指标 | `MINUS_DI(Records[High,Low,Close],Time Period = 14) = Array(outReal)` |
| `MINUS_DM` | Minus Directional Movement | 负向运动 | `MINUS_DM(Records[High,Low],Time Period = 14) = Array(outReal)` |
| `MOM` | Momentum | 动量 | `MOM(Records[Close],Time Period = 10) = Array(outReal)` |
| `NATR` | Normalized Average True Range | 归一化平均值范围 | `NATR(Records[High,Low,Close],Time Period = 14) = Array(outReal)` |
| `OBV` | On Balance Volume | 能量潮 | `OBV(Records[Close],Records[Volume]) = Array(outReal)` |
| `PLUS_DI` | Plus Directional Indicator | 更向指示器 | `PLUS_DI(Records[High,Low,Close],Time Period = 14) = Array(outReal)` |
| `PLUS_DM` | Plus Directional Movement | 定向运动 | `PLUS_DM(Records[High,Low],Time Period = 14) = Array(outReal)` |
| `PPO` | Percentage Price Oscillator | 价格振荡百分比 | `PPO(Records[Close],Fast Period = 12,Slow Period = 26,MA Type = 0) = Array(outReal)` |
| `ROC` | Rate of change : ((price/prevPrice)-1)*100 | 变动率指标 | `ROC(Records[Close],Time Period = 10) = Array(outReal)` |
| `ROCP` | Rate of change Percentage: (price-prevPrice)/prevPrice | 价格变化率 | `ROCP(Records[Close],Time Period = 10) = Array(outReal)` |
| `ROCR` | Rate of change ratio: (price/prevPrice) | 价格变化率 | `ROCR(Records[Close],Time Period = 10) = Array(outReal)` |
| `ROCR100` | Rate of change ratio 100 scale: (price/prevPrice)*100 | 价格变化率 | `ROCR100(Records[Close],Time Period = 10) = Array(outReal)` |
| `RSI` | Relative Strength Index | 相对强弱指标 | `RSI(Records[Close],Time Period = 14) = Array(outReal)` |
| `SAR` | Parabolic SAR | 抛物线转向 | `SAR(Records[High,Low],Acceleration Factor = 0.02,AF Maximum = 0.2) = Array(outReal)` |
| `SAREXT` | Parabolic SAR - Extended | 增强型抛物线转向 | `SAREXT(Records[High,Low],Start Value = 0,Offset on Reverse = 0,AF Init Long = 0.02,AF Long = 0.02,AF Max Long = 0.2,AF Init Short = 0.02,AF Short = 0.02,AF Max Short = 0.2) = Array(outReal)` |
| `SIN` | Vector Trigonometric Sin | 正弦值 | `SIN(Records[Close]) = Array(outReal)` |
| `SINH` | Vector Trigonometric Sinh | 双曲正弦函数 | `SINH(Records[Close]) = Array(outReal)` |
| `SMA` | Simple Moving Average | 简单移动平均 | `SMA(Records[Close],Time Period = 30) = Array(outReal)` |
| `SQRT` | Vector Square Root | 平方根 | `SQRT(Records[Close]) = Array(outReal)` |
| `STDDEV` | Standard Deviation | 标准偏差 | `STDDEV(Records[Close],Time Period = 5,Deviations = 1) = Array(outReal)` |
| `STOCH` | Stochastic | STOCH指标 | `STOCH(Records[High,Low,Close],Fast-K Period = 5,Slow-K Period = 3,Slow-K MA = 0,Slow-D Period = 3,Slow-D MA = 0) = [Array(outSlowK),Array(outSlowD)]` |
| `STOCHF` | Stochastic Fast | 快速STOCH指标 | `STOCHF(Records[High,Low,Close],Fast-K Period = 5,Fast-D Period = 3,Fast-D MA = 0) = [Array(outFastK),Array(outFastD)]` |
| `STOCHRSI` | Stochastic Relative Strength Index | 随机强弱指数 | `STOCHRSI(Records[Close],Time Period = 14,Fast-K Period = 5,Fast-D Period = 3,Fast-D MA = 0) = [Array(outFastK),Array(outFastD)]` |
| `SUM` | Summation | 求和 | `SUM(Records[Close],Time Period = 30) = Array(outReal)` |
| `T3` | Triple Exponential Moving Average (T3) | 三指数移动平均 | `T3(Records[Close],Time Period = 5,Volume Factor = 0.7) = Array(outReal)` |
| `TAN` | Vector Trigonometric Tan | 正切 | `TAN(Records[Close]) = Array(outReal)` |
| `TANH` | Vector Trigonometric Tanh | 双曲正切函数 | `TANH(Records[Close]) = Array(outReal)` |
| `TEMA` | Triple Exponential Moving Average | 三指数移动平均 | `TEMA(Records[Close],Time Period = 30) = Array(outReal)` |
| `TRANGE` | True Range | 真实范围 | `TRANGE(Records[High,Low,Close]) = Array(outReal)` |
| `TRIMA` | Triangular Moving Average | 三指数移动平均 | `TRIMA(Records[Close],Time Period = 30) = Array(outReal)` |
| `TRIX` | 1-day Rate-Of-Change (ROC) of a Triple Smooth EMA | 三重指数平滑平均线 | `TRIX(Records[Close],Time Period = 30) = Array(outReal)` |
| `TSF` | Time Series Forecast | 时间序列预测 | `TSF(Records[Close],Time Period = 14) = Array(outReal)` |
| `TYPPRICE` | Typical Price | 典型价格 | `TYPPRICE(Records[High,Low,Close]) = Array(outReal)` |
| `ULTOSC` | Ultimate Oscillator | 极限振子 | `ULTOSC(Records[High,Low,Close],First Period = 7,Second Period = 14,Third Period = 28) = Array(outReal)` |
| `VAR` | Variance | 变量定义 | `VAR(Records[Close],Time Period = 5,Deviations = 1) = Array(outReal)` |
| `WCLPRICE` | Weighted Close Price | 加权收盘价 | `WCLPRICE(Records[High,Low,Close]) = Array(outReal)` |
| `WILLR` | Williams' %R | 威廉指标 | `WILLR(Records[High,Low,Close],Time Period = 14) = Array(outReal)` |
| `WMA` | Weighted Moving Average | 加权移动平均 | `WMA(Records[Close],Time Period = 30) = Array(outReal)` |
