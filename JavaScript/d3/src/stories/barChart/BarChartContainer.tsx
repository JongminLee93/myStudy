import * as d3 from 'd3';
import { useMemo } from 'react';
import XAxis from '../component/XAxis';
import { useChartDimensions } from '../component/hook/useChartDimensions';
import YAxis from '../component/YAxis';
import { BarItem } from './BarItem';

type Data = {
  name: string;
  value: number;
}

type Props = {
  width?: number;
  height?: number;
  marginLeft?: number;
  marginRight?: number;
  marginTop?: number;
  marginBottom?: number;
  xAxisLabel?: string;
  data?: Data[];
  year?: number;
}

const BarChartContainer = (props: Props) => {
  const { width, height, marginLeft, marginRight, marginTop, marginBottom } = props
  const { data } = props

  const [ref, dms] = useChartDimensions({
    width,
    height,
    marginLeft,
    marginRight,
    marginTop,
    marginBottom
  });

  const xScale = useMemo(() => (
    d3.scaleLinear()
      .domain([0, d3.max(data || [], d => d.value) || 100])
      .range([0, dms.boundedWidth])
      .nice()
  ), [data, dms.boundedWidth]);

  const yScale = useMemo(() => (
    d3.scaleBand()
      .domain(data?.map(d => d.name) || [])
      .range([0, dms.boundedHeight])
      .padding(0.3)
  ), [data, dms.boundedHeight]);

  const barItems = data?.map(({ name, value }, i) => {
    const y = yScale(name) || 0;

    // const hasEnoughWidth = dms.boundedWidth - xScale(value) > 100;
    // const dataLabelOffset = hasEnoughWidth ? 5 : -5;
    // const textAnchor = hasEnoughWidth ? 'start' : 'end';

    return (
      <BarItem
        name={name}
        value={value}
        x={0}
        y={y}
        barWidth={xScale(value)}
        barHeight={yScale.bandwidth()}
        dimension={dms}
      />
      // <g key={i}>
      //   <rect
      //     x={0}
      //     y={y}
      //     width={xScale(value)}
      //     height={yScale.bandwidth()}
      //     opacity={0.7}
      //     stroke='#9d174d'
      //     fill='#9d174d'
      //     fillOpacity={0.3}
      //     rx={1}
      //   />
      //   <text
      //     x={xScale(value) + dataLabelOffset}
      //     y={y + yScale.bandwidth() / 2}
      //     textAnchor={textAnchor}
      //     alignmentBaseline='central'
      //     fontSize={11}
      //   >
      //     {value.toFixed(1)} ton
      //   </text>
      // </g>
    )
  })

  return (
    <div
      className='Chart_wrapper'
      ref={ref}
      style={{
        width,
        height,
        background: '#f0f0f0',
      }}
    >
      <svg
        width={dms.width}
        height={dms.height}
        viewBox={`${[0,0,dms.width,dms.height].join(',')}`}
      >
        <g transform={`translate(0,${dms.marginTop})`}>
          <rect
            x={0}
            y={0}
            width={dms.marginLeft}
            height={dms.boundedHeight}
            fill='red'
            opacity={0.2}
          />
          <YAxis
            yScale={yScale}
            dimension={dms}
          />
        </g>
        <g transform={`translate(${dms.marginLeft},${dms.marginTop+dms.boundedHeight})`}>
          <rect
            x={0}
            y={0}
            width={dms.boundedWidth}
            height={dms.marginBottom}
            fill='blue'
            opacity={0.2}
          />
          <XAxis
            xScale={xScale}
            label={props.xAxisLabel}
            dimension={dms}
            grid
          />
        </g>
        <g transform={`translate(${dms.marginLeft},${dms.marginTop})`}>
          <g>
            <rect
              x={0}
              y={0}
              width={dms.boundedWidth}
              height={dms.boundedHeight}
              fill='lavender'
              opacity={0.2}
            />
            { barItems }
          </g>
        </g>
      </svg>
    </div>
  )

}

export default BarChartContainer