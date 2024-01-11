// 引入 VChart 核心模块
import { VChart } from '@visactor/vchart/esm/core'
// 引入柱状图
import { registerBarChart, registerAreaChart } from '@visactor/vchart/esm/chart'
// 引入坐标轴、Tooltip、CrossHair组件
import {
  registerCartesianLinearAxis,
  registerCartesianBandAxis,
  registerTooltip,
  registerLabel,
  registerDiscreteLegend,
} from '@visactor/vchart/esm/component'

// 注册图表和组件
VChart.useRegisters([
  registerDiscreteLegend,
  registerLabel,
  registerBarChart,
  registerCartesianLinearAxis,
  registerAreaChart,
  registerCartesianBandAxis,
  registerTooltip,
])

export default VChart