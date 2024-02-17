import * as d3 from 'd3';
import { useMemo } from 'react';
import XAxis from '../component/XAxis';
import YAxis from '../component/YAxis';

interface Data {
  name: string;
  source: string;
  value: number;
}

interface Props {
  dimension: any;
  xAxisLabel?: string;
  yAxisLabel?: string;
  data: Data[] | undefined;
}

const GroupedBarChart = ({
  dimension,
  xAxisLabel,
  data
}: Props) => {
  const xScale = useMemo(() => (
    d3.scaleLinear()
      .domain([0, d3.max(data || [], d => d.value) || 100])
      .range([0, dimension.boundedWidth])
      .nice()
  ), [data, dimension.boundedWidth]);

  const yScale = useMemo(() => (
    d3.scaleBand()
      .domain(data?.map(d => d.name) || [])
      .range([0, dimension.boundedHeight])
      .padding(0.3)
  ), [data, dimension.boundedHeight]);

  // const barItems = data?.map(({ name, value }, i) => {
  //   const y = yScale(name) || 0;

  //   return (
  //     <g
  //       key={name}
  //     ></g>
  //   )
  // })

  const a = new Set(data?.map(d => d.name))
  console.log(a);

  return (
    <>
      <div id='tooltip' className='tooltip'></div>
      <svg
        width={dimension.width}
        height={dimension.height}
        viewBox={`${[0,0,dimension.width,dimension.height].join(',')}`}
      >
        <g transform={`translate(${dimension.marginLeft},0)`}>
          <rect
            x={0}
            y={0}
            width={dimension.boundedWidth}
            height={dimension.marginTop}
            fill='green'
            opacity={0.2}
          />
        </g>
        <g transform={`translate(${dimension.marginLeft+dimension.boundedWidth},${dimension.marginTop})`}>
          <rect
            x={0}
            y={0}
            width={dimension.marginRight}
            height={dimension.boundedHeight}
            fill='yellow'
            opacity={0.2}
          />
        </g>
        <g transform={`translate(0,${dimension.marginTop})`}>
          <rect
            x={0}
            y={0}
            width={dimension.marginLeft}
            height={dimension.boundedHeight}
            fill='red'
            opacity={0.2}
          />
          <YAxis
            yScale={yScale}
            dimension={dimension}
          />
        </g>
        <g transform={`translate(${dimension.marginLeft},${dimension.marginTop+dimension.boundedHeight})`}>
          <rect
            x={0}
            y={0}
            width={dimension.boundedWidth}
            height={dimension.marginBottom}
            fill='blue'
            opacity={0.2}
          />
          <XAxis
            xScale={xScale}
            label={xAxisLabel}
            dimension={dimension}
            grid
          />
        </g>
        <g transform={`translate(${dimension.marginLeft},${dimension.marginTop})`}>
          <g>
            <rect
              x={0}
              y={0}
              width={dimension.boundedWidth}
              height={dimension.boundedHeight}
              fill='purple'
              opacity={0.2}
            />
            {/* { barItems } */}
          </g>
        </g>
      </svg>
    </>
  )
}

export default GroupedBarChart;
