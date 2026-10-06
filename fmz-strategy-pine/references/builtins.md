# Pine Script built-ins implemented by the FMZ Pine engine (generated from the engine source)

Only the names below exist in FMZ's Pine runtime; a script that uses anything else fails to compile. Parameter lists are the engine's own signatures (`:name` = a series argument, `[name, default]` = optional with default). Semantics follow TradingView Pine v5.

## alert

- `alert` ["message", ["freq", consts.alert.freq_once_per_bar]]
- `alertcondition` ["condition", "title", "message"]

## array.*

- `array.from`
- `array.new,array.new_bool,array.new_float,array.new_int,array.new_string` ["size", "initial_value"]
- `array.get` ["id", "index"]
- `array.push` ["id", "value"]
- `array.pop` ["id"]
- `array.set` ["id", "index", "value"]
- `array.shift` ["id"]
- `array.unshift` ["id", "value"]
- `array.size` ["id"]
- `array.slice` ["id", "index_from", "index_to"]
- `array.sum` ["id"]
- `array.avg` ["id"]
- `array.abs` ["id"]
- `array.binary_search` ["id", "val"]
- `array.binary_search_leftmost` ["id", "val"]
- `array.binary_search_rightmost` ["id", "val"]
- `array.sort` ["id", ["order", 0]]
- `array.sort_indices` ["id", ["order", 0]]
- `array.clear` ["id"]
- `array.concat` ["id1", "id2"]
- `array.copy` ["id"]
- `array.stdev` ["id", ["biased", true]]
- `array.standardize` ["id"]
- `array.variance` ["id", ["biased", true]]
- `array.covariance` ["id1", "id2", ["biased", true]]
- `array.fill` ["id", "value", ["index_from", 0], "index_to"]
- `array.includes` ["id", "value"]
- `array.indexof` ["id", "value"]
- `array.insert` ["id", "index", "value"]
- `array.join` ["id", "separator"]
- `array.lastindexof` ["id", "value"]
- `array.max` ["id", ["nth", 0]]
- `array.min` ["id", ["nth", 0]]
- `array.median` ["id"]
- `array.mode` ["id"]
- `array.percentile_linear_interpolation` ["id", "percentage"]
- `array.percentile_nearest_rank` ["id", "percentage"]
- `array.percentrank` ["id", "index"]
- `array.range` ["id"]
- `array.remove` ["id", "index"]
- `array.reverse` ["id"]

## math.*

- `math.abs,math.ceil,math.exp,math.floor,math.log,math.log10,math.sqrt,math.sign` ["number"]
- `math.acos,math.asin,math.cos,math.sin,math.tan,math.atan` ["angle"]
- `math.pow` ["base", "exponent"]
- `math.random` ["min", "max", "seed"]
- `math.round` ["number", ["precision", 0]]
- `math.max,math.min`
- `math.avg`
- `math.round_to_mintick` ["number"]
- `math.sum` [":source", "length"]
- `math.todegrees` ["radians"]
- `math.toradians` ["degrees"]
- `math.e`
- `math.phi`
- `math.pi`
- `math.rphi`

## other built-ins

- `@fixnan` ["source"]
- `nz` ["source", ["replacement", 0]]
- `na` ["x"]
- `int` ["x"]
- `float` ["x"]
- `bool` ["x"]
- `string` ["x"]
- `iff` ["condition", ":then", ":_else"]
- `heikinashi,ticker.heikinashi` ["symbol"]
- `study` ["title", "shorttitle", "overlay", "format", "precision", "scale", "max_bars_back", "max_lines_count", "max_labels_count", "resolution", "resolution_gaps", "max_boxes_count", "explicit_plot_zorder"]
- `indicator` ["title", "shorttitle", "overlay", "format", "precision", "scale", "max_bars_back", "timeframe", "timeframe_gaps", "explicit_plot_zorder", "max_lines_count", "max_labels_count", "max_boxes_count"]
- `runtime.debug`
- `runtime.log`
- `runtime.error,error`
- `input,input.source,input.color,input.string,input.bool,input.int,input.float,input.timeframe`

## plot / shapes / colors / input

- `plotshape` ["series", "title", "style", ["location", consts.location.abovebar], "color", "offset", "text", "textcolor", "editable", ["size", consts.size.auto],  "show_last", "display", "overlay"]
- `plotchar` ["series", "title", "char", ["location", consts.location.abovebar], "color", "offset", "text", "textcolor", "editable", ["size", consts.size.auto], "show_last", "display", "overlay"]
- `plot` [["series", NaN], "title", "color", "linewidth", ["style", consts.plot.style_line], "trackprice", ["histbase", 0], ["offset", 0], ["join", false], "editable", "show_last", ["display", consts.display.all], "overlay"]
- `plotcandle` ["open", "high", "low", "close", "title", "color", "wickcolor", "editable", "show_last", "bordercolor", ["display", consts.display.all], "overlay"]
- `plotarrow` ["series", "title", ["colorup", "#00ff00"], ["colordown", "#ff0000"], ["offset", 0], ["minheight",5], ["maxheight",100], ["editable",true], "show_last", ["display", consts.display.all], "overlay"]
- `color` ["x"]
- `color.new` ["color", ["transp", 0]]
- `color.rgb` ["red", "green", "blue", ["transp", 0]]
- `hline` ["price", "title", "color", ["linestyle", consts.hline.style_dashed], "linewidth", "editable", ["display", consts.display.all], "overlay"]
- `bgcolor` ["color", "offset", "editable", "show_last", "title", ["display", consts.display.all], "overlay"]
- `fill` ["plot1", "plot2", "color", "title", "editable", "show_last", "fillgaps", ["display", consts.display.all]]
- `barcolor` ["color", "offset", "editable", "show_last", "title", ["display", consts.display.all]]
- `array.new_label,label.copy,label.delete,label.get_text,label.get_x,label.get_y,label.new,label.set_color,label.set_size,label.set_style,label.set_text,label.set_textalign,label.set_textcolor,label.set_tooltip,label.set_x,label.set_xloc,label.set_xy,label.set_y,label.set_yloc,label.all`
- `table,table.cell,table.cell_set_bgcolor,table.cell_set_height,table.cell_set_text,table.cell_set_text_color,table.cell_set_text_halign,table.cell_set_text_size,table.cell_set_text_valign,table.cell_set_tooltip,table.cell_set_width,table.clear,table.delete,table.merge_cells,table.new,table.set_bgcolor,table.set_border_color,table.set_border_width,table.set_frame_color,table.set_frame_width,table.set_position`

## request.* / runtime

- `request.security` ["symbol", "timeframe", ":expression", "gaps", "lookahead", "ignore_invalid_symbol", "currency"]
- `request.data` ["uri", ":expression"]

## str.*

- `str.tostring` ["value", "format"]
- `str.contains` ["source", "str"]
- `str.endswith` ["source", "str"]
- `str.startswith` ["source", "str"]
- `str.substring` ["source", "begin_pos", "end_pos"]
- `str.tonumber` ["string"]
- `str.format`
- `str.length` ["string"]
- `str.lower` ["source"]
- `str.upper` ["source"]
- `str.match` ["source", "regex"]
- `str.pos` ["source", "str"]
- `str.replace` ["source", "target", "replacement", ["occurrence", 0]]
- `str.replace_all` ["source", "target", "replacement"]
- `str.split` ["string", "separator"]

## strategy.* (orders, position, risk)

- `strategy.equity`
- `strategy.initial_capital`
- `strategy`
- `strategy.risk.allow_entry_in` ["value"]
- `strategy.risk.max_position_size` ["contracts"]
- `strategy.entry,strategy.order` ["id", "direction", "qty", "limit", "stop", "oca_name", "oca_type", "comment", "when", "alert_message"]
- `strategy.cancel` ["id", "when"]
- `strategy.cancel_all` ["when"]
- `strategy.exit` ["id", "from_entry", "qty", "qty_percent", "profit", "limit", "loss", "stop", "trail_price", "trail_points", "trail_offset", "oca_name", "comment", "when", "alert_message"]
- `strategy.close` ["id", "when", "comment", "qty", "qty_percent", "alert_message"]
- `strategy.close_all` ["when", "comment", "alert_message"]
- `strategy.opentrades.entry_bar_index` ["trade_num"]
- `strategy.opentrades.entry_id` ["trade_num"]
- `strategy.opentrades.entry_price` ["trade_num"]
- `strategy.opentrades.entry_time` ["trade_num"]
- `strategy.opentrades.profit` ["trade_num"]
- `strategy.opentrades.size` ["trade_num"]
- `strategy.closedtrades.entry_bar_index` ["trade_num"]
- `strategy.closedtrades.exit_bar_index` ["trade_num"]
- `strategy.closedtrades.exit_time` ["trade_num"]
- `strategy.closedtrades.entry_id` ["trade_num"]
- `strategy.closedtrades.entry_price` ["trade_num"]
- `strategy.closedtrades.exit_price` ["trade_num"]
- `strategy.closedtrades.entry_time` ["trade_num"]
- `strategy.closedtrades.profit` ["trade_num"]
- `strategy.closedtrades.size` ["trade_num"]

## ta.*

- `ta.ema` [":source", "length"]
- `ta.alma` [":series", "length", "offset", "sigma", ["floor", false]]
- `ta.stdev` [":source", "length", ["biased", true]]
- `ta.variance` [":source", "length", ["biased", true]]
- `ta.tsi` [":source", "short_length", "long_length"]
- `ta.macd` [":source", "fastlen", "slowlen", "siglen"]
- `ta.linreg` [":source", "length", "offset"]
- `ta.sar` ["start", "inc", "max"]
- `ta.bb` [":series", "length", "mult"]
- `ta.bbw` [":series", "length", "mult"]
- `ta.cmo` [":series", "length"]
- `ta.percentile_linear_interpolation` [":source", "length", "percentage"]
- `ta.percentile_nearest_rank` [":source", "length", "percentage"]
- `ta.swma` [":source"]
- `ta.change` [":source", ["length", 1]]
- `ta.supertrend` ["factor", "atrPeriod"]
- `ta.sma` [":source", "length"]
- `ta.cog` [":source", "length"]
- `ta.atr` ["length"]
- `ta.tr` [["handle_na", false]]
- `ta.rma` [":source", "length"]
- `ta.rsi` [":source", "length"]
- `ta.wma` [":source", "length"]
- `ta.hma` [":source", "length"]
- `ta.roc` [":source", "length"]
- `ta.range` [":source", "length"]
- `ta.mode` [":source", "length"]
- `ta.median` [":source", "length"]
- `ta.dev` [":source", "length"]
- `ta.cci` [":source", "length"]
- `ta.mom` [":source", "length"]
- `ta.percentrank` [":source", "length"]
- `ta.mfi` [":series", "length"]
- `ta.kc` [":series", "length", "mult", ["useTrueRange", true]]
- `ta.kcw` [":series", "length", "mult", ["useTrueRange", true]]
- `ta.correlation` [":source1", ":source2", "length"]
- `ta.cross` [":source1", ":source2"]
- `ta.crossover` [":source1", ":source2"]
- `ta.crossunder` [":source1", ":source2"]
- `ta.barssince` [":condition"]
- `ta.cum` [":source"]
- `ta.dmi` ["diLength", "adxSmoothing"]
- `ta.falling` [":source", "length"]
- `ta.rising` [":source", "length"]
- `ta.pivothigh,ta.pivotlow`
- `ta.highest,ta.highestbars,ta.lowest,ta.lowestbars`
- `ta.stoch` [":source", ":high", ":low", "length"]
- `ta.valuewhen` [":condition", ":source", "occurrence"]
- `ta.vwap` [":source"]
- `ta.vwma` [":source", "length"]
- `ta.wpr` ["length"]
- `ta.accdist` ["length"]
- `ta.iii`
- `ta.nvi`
- `ta.pvi`
- `ta.obv`
- `ta.pvt`
- `ta.wad`
- `ta.wvad`

## timeframe / time

- `timeframe.in_seconds` ["timeframe"]
- `year,month,weekofyear,dayofmonth,dayofweek,hour,minute,second` ["time", "timezone"]
- `timestamp`
- `time,time_close` ["timeframe", "session", "timezone"]
- `timenow`
