import { Usage } from '@record-your-life/shared'
import { uniqueDurations } from '..'

export function formatAreaChartData(
  records: Record<string, Usage>,
  type: string,
  isHorizontal?: boolean,
) {
  const formatData = Object.entries(records).flatMap(
    ([type, { durations }]) => {
      return uniqueDurations(durations).map(({ time, duration }) => ({
        type,
        time,
        value: (duration / 1000 / 60).toFixed(2),
      }))
    },
  )
  const spec: any = {
    type: type,
    xField: isHorizontal ? 'value' : 'time',
    yField: isHorizontal ? 'time' : 'value',
    seriesField: 'type',
    direction: isHorizontal ? 'horizontal' : undefined,
    stack: false,
    data: {
      values: formatData,
    },
    point: {
      visible: false,
    },
    line: {
      style: {
        curveType: 'monotone',
      },
    },
    area: {
      style: {
        fillOpacity: 0.1,
      },
    },
    legends: [
      {
        orient: 'top',
        position: 'middle',
        select: false, // disable legend select interaction
        data: (items: any[]) => {
          return items.map((item) => {
            item.shape.outerBorder = {
              stroke: item.shape.fill,
              distance: 2,
              lineWidth: 1,
            }

            return item
          })
        },
        item: {
          shape: {
            space: 8,
          },
          background: {
            visible: false,
          },
        },
      },
    ],
    bar: {
      state: {
        legend_hover_reverse: {
          fill: '#ccc',
        },
      },
    },
    stateDef: {
      legend_hover: {
        filter: () => {
          return true
        },
      },
    },
  }
  if (type === 'bar') {
    spec.label = {
      visible: true,
      formatMethod: (val: string) => val + 'min',
    }
  }

  return spec as any
}
