# MyLanguage (麦语言) functions and keywords (generated)

| Name | 说明 | Description |
|---|---|---|
| `CIRCLEDOT` | 画圆点 | Draw a dot |
| `BID1VOL` | 取得TICK图该笔TICK的买一量 | Get the tick's latest buying volume |
| `DASHDOTDOT` | 画双点虚线 | Draw a double dotted line |
| `MIN` | (A,B),取A，B中较小者 | take the smaller between A and B |
| `TRADE_AGAIN` | (N), 含有该函数的加减仓模型中,同一指令行可以连续出N个信号 | in the addition and subtraction position model with this function, the same command line can continuously send N signals |
| `COLORYELLOW` | 黄色 | yellow |
| `YEAR` | 取得年份（1970-2033） | Year of acquisition (1970-2033) |
| `BKPRICEAV` | 返回数据合约多头开仓均价 | Return data contract long position average price |
| `BK` | 买开仓 | Buy long open positions |
| `COLORGREEN` | 绿色 | green |
| `SKLOW` | 返回数据合约卖开仓以来的最低价 | Return the lowest price since the data contract was short sell |
| `BP` | 买平仓 | buy to cover |
| `ISUP` | 判断该周期是否收阳，如果K线为阳线返回1，否则返回0 | Determine whether the cycle is positive or not. If the K line is a positive line, return 1; otherwise, return 0 |
| `EXP` | (X),求e的X次幂 | find the X power of e |
| `LINETHICK1` | 实线 粗细度为1 | Solid line Thickness is 1 |
| `LINETHICK3` | 实线 粗细度为3 | Solid line Thickness is 3 |
| `LINETHICK2` | 实线 粗细度为2 | Solid line Thickness is 2 |
| `LINETHICK5` | 实线 粗细度为5 | Solid line Thickness is 5 |
| `MULTSIG` | (Sec1,Sec2,N,INTERVAL), 设置一根k线多信号的指令价方式（TICK逐笔回测，可设置回测精度）， 开仓信号出信号Sec1秒下单，不复核 平仓信号出信号Sec2秒下单，不复核， 一根K线最大的信号个数为N,INTERVAL代表数据时间间隔 | set one k-line multi-signal command price mode (TICK one-by-one backtest, can set the backtest accuracy), open position when the signal appear Sec1 seconds to place an order, no review, close position when the signal appear Sec2 seconds to place an order, no review, the maximum number of signals of a K line is N, INTERVAL represents the data time interval |
| `CONDBARS` | (A,B),取得最近满足A、B条件的k线间周期数 | the number of cycles between k lines that have recently met the A and B conditions |
| `LINETHICK6` | 实线 粗细度为6 | Solid line Thickness is 6 |
| `LAST` | (X,N1,N2),判断过去N1到N2周期内，是否一直满足条件X 一直满足返回1，否则返回0 | judge whether the condition X has been satisfied to return 1 in the past N1 to N2 cycle, otherwise it returns 0 |
| `COLORBLACK` | 黑色 | black |
| `ASK1VOL` | 取得TICK图该笔TICK的卖一量 | Get the tick's latest selling volume |
| `SKPRICEAV` | 返回数据合约空头开仓均价 | Return data contract short position average price |
| `COLORSTICK` | 画柱线，大于0为红色，小于0为青色 | Plot line, greater than 0 is red, less than 0 is cyan |
| `BID2VOL` | 取得TICK图该笔TICK的买二量 | Get the tick's second latest selling volume |
| `EVERY` | (X,N),判断过去一定周期N内，是否一直满足条件X  如果一直满足返回1，否则返回0 | judge whether the condition X has been satisfied for a certain period of time in the past N. If it is always satisfied, return 1; otherwise, return 0 |
| `COLORGRAY` | 灰色 | gray |
| `TRACING_ORDER` | 自动连续追价 | Automatic continuous price chasing |
| `SAR` | (N, Step, Max)，取抛物转向值N为周期数，Step为步长，Max为极值 | take the parabolic turning value N as the number of cycles, Step is the step size, Max is the extreme value |
| `FLOOR` | (A),取沿A数值减小方向最接近的整数 | taking the nearest integer along the direction in which the value of A decreases |
| `NORMPDF` | (X,MU,SIGMA),返回参数为MU和SIGMA的正态分布密度函数在X处的值 | return the value of the normal distribution density function at X at parameters MU and SIGMA |
| `SUM` | (X,N)，求X在N个周期内的总和 | find the sum of X in N cycles |
| `ASK5` | 取得TICK图该笔TICK的卖五价 | Get the tick's fifth latest selling volume |
| `ASK4` | 取得TICK图该笔TICK的卖四价 | Get the tick's fourth latest selling volume |
| `V` | 取成交量 | get the volume |
| `IFELSE` | (X,A,B),若满足条件X则取A，否则取B | if the condition X is satisfied, take A, otherwise take B |
| `ASK1` | 取得TICK图该笔TICK的卖一价 | Get the tick's latest buying price |
| `ASK3` | 取得TICK图该笔TICK的卖三价 | Get the tick's third latest buying price |
| `ASK4VOL` | 取得TICK图该笔TICK的卖四量 | Get the tick's fourth latest selling volume |
| `H` | 最高价 | highest price |
| `COLORLIGHTBLUE` | 浅蓝色 | Light blue |
| `PERIOD` | 自动读取当前技术图表周期 | Automatically read the current technical chart cycle |
| `CROSS` | (A,B), A从下方向上穿过B时取1(Yes)，否则取0(No) | (A, B), A takes 1 (Yes) when passing through B from below, otherwise it takes 0 (No) |
| `HIGH` | 取最高价 | get the highest price |
| `BKPRICE` | 返回数据合约最近一次买开信号价位 | Return the data contract last time to buy the signal price |
| `VAR` | (X,N)，求X在N周期内的样本方差 | find the sample variance of X in the N period |
| `BARSLAST` | (X),求上一次条件X满足到现在的周期数 | find the last condition X meets the current number of cycles |
| `STDP` | (X,N)，求X的N日总体标准差 | find the N-day overall standard deviation of X |
| `MINUTE` | 取某个周期的分钟数（0-59） | Take the number of minutes in a cycle (0-59) |
| `MINPRICE1` | 取模组交易合约的最小变动价位 | get the minimum price change of the module trading contract |
| `#IMPORT` | [MIN, 1/5/15/30/60/1440, FORMULA] 引用公式 | Reference Formula |
| `BARPOS` | 取某K线的位置 | get the position of a K line |
| `MYVOL` | 取下单手数 | get the number of sent orders |
| `MONEY` | 返回账户可用资金 | Return account available funds |
| `MONTH` | 取得某周期的月份（1-12） | Get the month of a certain period (1-12) |
| `COVAR` | (X,Y,N) 求X、Y在N个周期内的协方差 | Find the covariance of X and Y in N cycles |
| `EXIST` | (X,N),判断过去周期N内，是否有满足条件X  如果有满足X条件的K线，返回1如果没有满足X条件的K线，则返回0 | judges whether the condition X is satisfied in the past period N. If there is a K line that satisfies the X condition, return 1. if the K line that does not satisfy the X condition, returned 0. |
| `BARSBK` | 取上一次买开信号位置 | get the last buy long signal location |
| `ASK3VOL` | 取得TICK图该笔TICK的卖三量 | Get the tick's third latest selling volume |
| `MAX` | (A,B),取A，B中较大者 | get the larger of A, B |
| `MARGIN` | 保证金率 | Margin Rate |
| `ISLASTSPK` | 判断上一个指令是否是卖平开 | Determine if the previous instruction is "sell to close long position and sell short to open position immediately" |
| `DMA` | (X,A),求X的动态移动平均 A必须小于1大于0 | find the dynamic moving average of X. A must be less than 1 and greater than 0 |
| `EMA` | (X,N),求X的N日指数加权移动平均值 | find the N-day exponentially weighted moving average of X |
| `REVERSE` | (X)，取－X | get - x |
| `COINS` | 账户中的币数 | The number of coins in the account |
| `HV` | (X,N)求X在N个周期内的最高值(不包含当前K线) | find the highest value of X in N cycles (excluding the current K line) |
| `AUTOFILTER` | 启用一开一平信号过滤机制 | Enable one open position and one close position signal filtering mechanism |
| `SKEWNESS` | (X,N) 求X在N个周期内的偏度系数 | Find the skewness coefficient of X in N cycles |
| `WEEKDAY` | 取得星期数（0-6） | Get the number of weeks (0-6) |
| `NODRAW` | 不画线 | Do not draw lines |
| `COLORBLUE` | 蓝色 | blue |
| `ROUND` | (N,M),对N指定M位小数进行四舍五入 | specify the M decimal places for N to round off |
| `SELECT` | 在附合条件的K线上标记 | mark on the K line of the attached condition |
| `CROSSUP` | (A,B), 表示当A从下方向上穿过B时返回1(Yes)，否则返回0(No) | it means that 1 (Yes) is returned when A passes through B from below, otherwise it returns 0 (No) |
| `MULTSIG_MIN` | (min1,min2,N),设置一根k线多信号的指令价方式（逐分钟回测） 开仓信号出信号min1分钟下单，不复核 平仓信号出信号min2分钟下单，不复核， 一根K线最大的信号个数为N | (min1, min2, N), set a k-line multi-signal command price mode (return every minute), open position when the signal appear Min1 minutes to place an order, no review, closing position when the signal appear min2 minutes to place an order, no Review, the maximum number of signals for a K line is N |
| `OPEN` | 取得开盘价 | Get the opening price |
| `LLV` | (X,N),求X在N个周期内的最小值 | find the minimum value of X in N cycles |
| `OPISTICK` | 画竖线，K线为阳线为红色，K线为阴线为青色 | Draw a vertical line, the K line is the red when it is positive; cyan when it is negative. |
| `SIN` | (X)，求X的正弦值 | get the sine of X |
| `LINETHICK7` | 实线 粗细度为7 | Solid line Thickness is 7 |
| `ACOS` | (X),求X的反余弦值 | get the inverse cosine of X |
| `NUMPOW` | (X,N,M),自然数幂方和   X为基础变量，N为自然数，M为实数 | natural number power and X are base variables, N is a natural number, M is a real number |
| `COLORCYAN` | 青色 | Cyan |
| `COUNT` | (X,N),统计N周期中满足X条件的周期数 若N为0则从第一个周期开始 | count the number of cycles that satisfy the X condition in the N cycle. If N is 0, start from the first cycle |
| `C` | 收盘价 | closing price |
| `SQUARE` | (X)，求X的平方 | find the square of X |
| `O` | 开盘价 | Opening price |
| `BARSSINCEN` | 统计N周期内第一次条件成立到当前的周期数 | Count the first condition was met in the N cycle to the current number of cycles |
| `RANGE` | (A,B,C),判断是否A大于B同时小于C，如果是则返回1，否则返回0 | determine whether A is greater than B and also less than C, if yes, return 1, otherwise return 0 |
| `BARSCOUNT` | (COND) 返回COND第一个有效值的位置到当前的周期数 | returns the position of the first valid value of COND to the current number of cycles |
| `DOT` | 画点线 | Draw a line |
| `UNIT` | 取加载数据合约的交易单位 | get the transaction unit of the loaded data contract |
| `BID3VOL` | 取得TICK图该笔TICK的买三量 | Get the tick's third latest buying volume |
| `ISLASTBP` | 判断上一个指令是否是买平 | Determine if the previous instruction is buy to cover to close position |
| `VOL` | 取成交量 | get the trading volume |
| `TIMESTAMP` | 返回当前周期的时间戳 | Returns the timestamp of the current cycle |
| `COLORWHITE` | 白色 | White |
| `CLOSEOUT` | 清仓指令,平掉所有方向的持仓 | close all position order, close the positions in all directions |
| `MV` | (A,...P),取A到P的均值 | get the mean of A to P |
| `SKHIGH` | 返回数据合约卖开仓以来的最高价 | The highest price since the return of the data contract to sell short any position |
| `TIME` | 取周期的时数，分钟周期表示为0900，秒周期表示为090000 | get the number of cycles, the minute period is represented as 0900, and the second period is represented as 090000 |
| `NOT` | (X),不满足条件X，不满足条件X返回1，否则返回0 | does not satisfy the condition X, does not satisfy the condition X returns 1, otherwise returns 0 |
| `NOP` | 空语句 | empty statement |
| `BARSSINCE` | 第一个条件成立到当前的周期数 | From the first condition is established to the current number of cycles |
| `RAND` | (X,Y) 产生随机数的随机函数,返回范围在X到Y之间的随机数 | A random function that produces a random number, returning a random number between X and Y |
| `COS` | (X),求X的余弦值 | find the cosine of X |
| `ASK5VOL` | 取得TICK图该笔TICK的卖五量 | Get the tick's fifth latest selling volume |
| `BID5` | 取得TICK图该笔TICK的买五价 | Get the tick's fifth latest buying price |
| `BID4` | 取得TICK图该笔TICK的买四价 | Get the tick's fourth latest buying price |
| `BID3` | 取得TICK图该笔TICK的买三价 | Get the tick's third latest buying price |
| `BID2` | 取得TICK图该笔TICK的买二价 | Get the tick's second latest buying price |
| `BID1` | 取得TICK图该笔TICK的买一价 | Get the tick's latest buying price |
| `NEW` | 取得TICK图该笔TICK的最新价 | Get the tick's latest price |
| `ISDOWN` | 判断该周期是否收阴 如果为阴线返回1，否则返回0 | Determine whether the cycle is negative. returns 1 if it is negative, otherwise return 0 |
| `REF` | (X,N),取X在N个周期前的值 | take the value of X before N cycles |
| `SMA` | (X,N,M)，求X的N个周期内的扩展指数加权移动平均 M为权重，N为周期数 | find the extended exponential weighted moving average in N cycles of X is the weight, N is the number of cycles |
| `LOG` | (X)求X的常用对数 | Find the common logarithm of X |
| `SLOPE` | (X,N)，求X的N周期的线型回归的斜率 | find the slope of the linear regression of the N period of X |
| `VOLUMESTICK` | 画柱线，K线为阳线为红色，K线为阴线为青色 | draw the column line, the K line is the red when it is positive; cyan when it is negative. |
| `ISLASTBAR` | ,判断是否是最后一个K线，如果为最后一根K线返回1，否则返回0 | determine whether it is the last K line, if it is, returns 1, otherwise returns 0 |
| `MEDIAN` | (X,N) 求X在N个周期内的中位数 | Find the median of X in N cycles |
| `SPK` | 卖平后卖开新仓 | Selling short a new position after selling (closed a long position) |
| `SMMA` | (X,N),表示当前K线上X在N个周期的通畅移动平均线 | indicating the smooth moving average of X on the current K line in N cycles |
| `MIN1` | (A...P),取A...P中的最小值（支持2-16个参数进行比较） | take the minimum value in A...P (support 2-16 parameters for comparison) |
| `MINPRICE` | 取数据合约的最小变动价位 | get the minimum price change of the data contract |
| `SKPRICE` | 返回数据合约最近一次卖开信号价位 | return data contract latest short sell signal price |
| `SORT` | (TYPE,POS,N1,N2,...,N16); 按升(降)序排列，取第POS个参数对应的数值 | Arrange in ascending (descending) order, get the value corresponding to the POS parameter |
| `HARMEAN` | (X,N) 求X在N个周期内的调和平均值 | Find the harmonic mean of X in N cycles |
| `ISLASTBPK` | 判断上一个指令是否是买平开 | Determine if the previous instruction is a "buy to cover and buy long immediately" |
| `ISLASTCLOSEOUT` | 判断上一个指令是否是全平 | Determine if the previous instruction is fully close all position |
| `SETSIGPRICETYPE` | (SIG,PRICE,IsCancel) 设置SIG指令的委托方式 SIG为指令，PRICE为委托价格，IsCancel为是否启用终止下单 | (SIG, PRICE, IsCancel) Set the delegate mode of the SIG command. SIG is the command, PRICE is the commission price, and IsCancel is whether to enable the termination order. |
| `VALUEWHEN` | (COND,X)，取满足条件COND时的X值 | get the X value when the condition COND is satisfied |
| `CROSSDOWN` | (A,B), 表示当A从上方向下穿过B时返回1(Yes)，否则返回0(No) | it means that 1 (Yes) is returned when A passes through B from above, otherwise it returns 0 (No) |
| `BETWEEN` | (A,B,C) ,A处于B和C之间时取1(Yes)，否则取0(No) | (A, B, C), take 1 (Yes) when A is between B and C, otherwise take 0 (No) |
| `MA` | (X , N),求X在N个周期内的简单移动平均 | (X , N), find the simple moving average of X in N cycles |
| `COLORLIGHTGREY` | 浅灰色 | Light grey |
| `KURTOSIS` | (X,N) 求X在N个周期内的峰度系数 | (X, N) Find the kurtosis coefficient of X in N cycles |
| `TAN` | (X)，求X的正切值 | find the tangent of X |
| `#END` | 结束公式 | End formula |
| `INTPART` | (X),取X的整数部分 | (X), take the integer part of X |
| `INFO` | (COND, MSG, ...) 当COND条件满足时输出日志信息 | (COND, MSG, ...) When the COND condition meets the most output log information |
| `MONEYTOT` | 返回当前账户权益 | Return current account equity |
| `COLORRED` | 红色 | Red |
| `EMA2` | (X,N),求X的N个周期的线性加权平均值 | (X, N), find the linear weighted average of the N periods of X |
| `SKVOL` | 返回模型当前的空头持仓 | Returns the current short position of the model |
| `SP` | 卖平仓 | sell to close position |
| `BARSTATUS` | 返回当前周期的位置状态  1表示当前周期是第一个周期，2表示是最后一个周期，0表示当前周期处于中间位置 | Returns the position status of the current cycle. 1 indicates that the current cycle is the first cycle, 2 indicates the last cycle, and 0 indicates that the current cycle is in the middle position. |
| `NEW_ORDER` | 最新价 | Latest price |
| `ISLASTBK` | 判断上一个指令是否是买开 | Determine if the previous instruction is buy long |
| `SK` | 卖开仓 | sell short |
| `EXIT` | (MSG) 输出信息并退出策略 | output information and exit strategy |
| `ISEQUAL` | 判断该周期是否平盘，如果K线为平盘返回1，否则返回0 | Determine whether the cycle is without position. If the K line is, return 1; otherwise, return 0 |
| `ISLASTSTOP` | 判断上一个指令是否是STOP指令 | Determine if the previous instruction is a STOP instruction |
| `COLORLIGHTGREEN` | 浅绿色 | Light green |
| `#EXPORT` | FORMULA 开始声明一个公式 | FORMULA starts declaring a formula |
| `VARP` | (X,N)，求X的N周期总体方差 | (X, N), find the N-period population variance of X |
| `BPK` | 买平后买开新仓 | buy long a new position after buy to cover closed a position |
| `MAX1` | (A...P),取A...P中的最大值（支持2-16个参数进行比较） | get the maximum value in A...P (supporting 2-16 parameters for comparison) |
| `CLOSE` | 取收盘(最新)价 | get the closing price (latest) price |
| `ABS` | (X),求X的绝对值 | find the absolute value of X |
| `LOW` | 取得当根K线的最低价 | Get the lowest price of the current K line |
| `DATE` | ,取某周期的日期数（700101-331231） | the number of dates in a certain period (700101-331231) |
| `NULL` | 返回空值 | return null value |
| `BKVOL` | 返回模型当前的多头持仓 | Returns the current long position of the model |
| `LLVBARS` | (X,N),求N周期内X最低值到当前周期数 | (X, N),find the lowest value of X in the N period to the current number of cycles |
| `AVEDEV` | (X,N),求X在N周期内的平均绝对偏差 | (X, N), find the average absolute deviation of X in the N period |
| `ATAN` | (X),求X的反正切值 | (X), find the inverse tangent of X |
| `DASHDOT` | 画点虚线 | Draw a dotted line |
| `LN` | (X),求X的自然对数 | (X), find the natural logarithm of X |
| `ISLASTSP` | 判断上一个指令是否是卖平 | Determine if the previous instruction is sell to close a position |
| `ASK2` | 取得TICK图该笔TICK的卖二价 | Get the tick's second latest selling price |
| `COLORLIGHTRED` | 浅红色 | Light red |
| `LV` | (X,N)求X在N个周期内的最小值(不包含当前K线) | (X, N) find the minimum value of X in N cycles (excluding the current K line) |
| `DEVSQ` | (X,N) ,求X的N个周期的数据偏差平方和 | (X, N), find the sum of squared data deviations of N cycles of X |
| `ISLASTSK` | 判断上一个指令是否是卖开 | Determine if the previous instruction is selling short |
| `MODE` | (X,N) 求X在N个周期内最常出现的值 | (X, N) Find the most frequently occurring value of X in N cycles |
| `SGN` | (X)，判断X正负数 （若X>0返回1,若X<0返回-1,否则返回0） | (X), judge X positive and negative numbers (if X>0 returns 1, if X<0 returns -1, otherwise returns 0) |
| `BID5VOL` | 取得TICK图该笔TICK的买五量 | Get the tick's fifth latest buying volume |
| `COEFFICIENTR` | (X,Y,N) 求X、Y在N个周期内的皮尔森相关系数 | (X, Y, N) Find the Pearson correlation coefficient of X and Y in N cycles |
| `DAY` | ,取某周期的日数（1-31） | get the number of days in a cycle (1-31) |
| `LONGCROSS` | (A,B,N),判断A在是否在N个周期内都小于B 如果是则返回1，否则返回0 | (A, B, N), determine whether A is less than B in N cycles. If yes, return 1; otherwise, return 0 |
| `STD` | (X,N)，求X在N个周期内的样本标准差 | (X, N), find the sample standard deviation of X in N cycles |
| `BARSBP` | 取上一次买平信号位置 | get the last buy to cover signal position |
| `COLORMAGENTA` | 紫红色 | Fuchsia |
| `ASIN` | (X),求X的反正弦值 | (X), find the inverse sine of X |
| `MEDIAN1` | (A,..,P),求A...P的中位数（支持最多16个参数） | (A,..,P), find the median of A...P (supports up to 16 parameters) |
| `LINETHICK4` | 实线 粗细度为4 | Solid line Thickness is 4 |
| `EMAWH` | （X,N),求X的N日指数加权移动平均值 | (X, N), find the N-day exponentially weighted moving average of X |
| `BARSSK` | 取上一次卖开信号位置 | get the last sell short signal position |
| `L` | 最低价 | lowest price |
| `ISNULL` | (N) 判断空值，如果N为空值返回1，否则返回0 | (N) determine null value, return 1 if N is null, otherwise return 0 |
| `WMA` | (X, N) 线性加权移动平均 | (X, N) linear weighted moving average |
| `HOUR` | 取某周期的小时（0-23） | get the hour of a cycle (0-23) |
| `BARSSP` | 取上一次卖平信号位置 | Take the last sell to close a position signal position |
| `CORRELATION` | (X,Y,N) 求X、Y在N个周期内的相关系数 | (X, Y, N) Find the correlation coefficient of X and Y in N cycles |
| `CUBE` | (X),求X的三次方 | (X), find the third power of X |
| `IF` | (X,A,B),若满足条件X则取A，否则取B | (X, A, B), if the condition X is satisfied, take A, otherwise take B |
| `DASH` | 画虚线 | Draw a dotted line |
| `CEILING` | (X,Y) 返回指定实数(X)在沿绝对值增大的方向上第一个能整除基数(Y)的值 | (X,Y) Returns the value of the first real divisible base (Y) in the direction along which the absolute value is increased in the absolute value (X) |
| `ISCONTRACT` | ('CODE') 当前是否为指定的合约 | weather it is currently the specified contract |
| `HHV` | (X,N),求X在N个周期内的最高值 | (X, N), find the highest value of X in N cycles |
| `FORCAST` | (X,N),求X的N周期线性回归预测值 | (X, N), find the N-period linear regression prediction of X |
| `SQRT` | (X)，求X的平方根 | (X), find the square root of X |
| `BKHIGH` | 返回数据合约买开仓以来的最高价 | The highest price since the return of the data contract to buy long any position |
| `SUMBARS` | (X,A):求多少个周期的X向前累加能够大于等于A | (X, A): get the cycles of X forward accumulation that can be greater than or equal to A |
| `BID4VOL` | 取得TICK图该笔TICK的买四量 | Get the tick's fourth latest buying volume |
| `POW` | (X,Y),求X的Y次幂 | (X, Y), find the Y power of X |
| `BKLOW` | 返回数据合约买开仓以来的最低价 | Return the lowest price since the data contract was bought long any position |
| `MOD` | (A,B),A对B求模 | (A, B), A to B to modeling |
| `ASK2VOL` | 取得TICK图该笔TICK的卖二量 | Get the tick's second latest selling volume |
| `HHVBARS` | (X,N),求N周期内X最高值到当前周期数 | (X, N), find the highest value of X in the N period to the current number of cycles |
