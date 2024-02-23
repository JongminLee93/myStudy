'use client'

import { FunnelPath, FunnelText } from '@/stories/funnel/FunnelItem';
import * as d3 from 'd3';
import { useMemo } from 'react';
import YAxis from '../component/YAxis';

interface Data {
  year: string;
  value: number;
}

interface Props {
  data?: Data[];
  dimension: any;
  xAxisLabel?: string;
  yAxisLabel?: string;
}

const FunnelChart = ({
  data,
  dimension,
  xAxisLabel,
}: Props) => {
  const domainY = useMemo(() => Array.from(new Set(data?.map(d => d.year))) ?? [], [data]);

  const xScale = useMemo(() => (
    d3.scaleLinear()
      .domain([-(d3.max(data ?? [], d => d.value) ?? 0), d3.max(data ?? [], d => d.value) ?? 0])
      .rangeRound([0, dimension.boundedWidth])
      .nice()
  ), [data, dimension.boundedWidth])

  const yScale = useMemo(() => (
    d3.scaleBand()
      .domain(domainY)
      .range([0, dimension.boundedHeight])
      .padding(0.3)
  ), [domainY, dimension.boundedHeight])

  const colorScale = useMemo(() => (
    d3.scaleOrdinal()
      .domain(domainY)
      .range(d3.range(domainY.length).map(
        d3.scaleSequential()
          .domain([domainY.length - 1, 0])
          .interpolator(d3.interpolateRgb('rgb(194, 217, 236)', 'rgb(34, 113, 180)'))
      ))
      .unknown('#ccc')
  ), [domainY])

  const funnelPath = data?.map(({ year, value }, i, D) => {
    const { year: nextYear, value: nextValue } = i + 1 < D.length ? D[i+1] : D[i];

    const y = yScale(year) ?? 0;
    const nextY = y + yScale.step();
    const paddingY = (yScale.step() - yScale.bandwidth()) / 2

    const x0 = dimension.boundedWidth - xScale(value);
    const y0 = y - paddingY;

    const x1 = dimension.boundedWidth - xScale(nextValue);
    const y1 = nextY - paddingY;

    const x2 = xScale(nextValue);
    const y2 = nextY - paddingY;

    const x3 = xScale(value);
    const y3 = y - paddingY;

    return (
      <g key={`funnel-${year}`}>
        <FunnelPath
          path={[
            [x0, y0],
            [x1, y1],
            [x2, y2],
            [x3, y3]
          ]}
          fill={`${colorScale(year)}`}
          stroke='black'
        />
      </g>
    )
  })

  const funnelText = data?.map(({ year, value }, i, D) => {
    const { value: nextValue } = i + 1 < D.length ? D[i+1] : D[i];

    const y = yScale(year) ?? 0;
    const nextY = y + yScale.step();
    const paddingY = (yScale.step() - yScale.bandwidth()) / 2

    const y2 = nextY - paddingY;

    return (
      <g key={`funnel-${year}`}>
        <FunnelText
          x={dimension.boundedWidth / 2}
          y={y + yScale.bandwidth() / 2}
          value={value}
          unit='ton'
          textAnchor='middle'
          alignmentBaseline='central'
          fontSize={14}
          fontWeight='bold'
          paintOrder='stroke'
          stroke='white'
          strokeWidth={1.5}
          strokeLinecap='butt'
          strokeLinejoin='miter'
          pointerEvents='none'
        />
        <FunnelText
          x={dimension.boundedWidth / 2}
          y={y2}
          value={(nextValue / value) * 100}
          unit='%'
          textAnchor='middle'
          alignmentBaseline='central'
          opacity={i + 1 < D.length ? 1 : 0}
          fontSize={12}
          fontWeight='bold'
          fill='#707070'
          stroke='white'
          strokeWidth={1}
          strokeLinecap='butt'
          strokeLinejoin='miter'
          paintOrder='stroke'
          pointerEvents='none'
        />
      </g>
    )
  })

  return (
    <>
      <svg
        width={dimension.width}
        height={dimension.height}
        viewBox={`${[0,0,dimension.width,dimension.height].join(',')}`}
        overflow='visible'
        fontFamily='sans-serif'
      >
        <g transform={`translate(${dimension.marginLeft},0)`}>
          {/* <rect
            x={0}
            y={0}
            width={dimension.boundedWidth}
            height={dimension.marginTop}
            fill='green'
            opacity={0.2}
          /> */}
        </g>
        <g className='margin-right' transform={`translate(${dimension.marginLeft+dimension.boundedWidth},${dimension.marginTop})`}>
          {/* <rect
            x={0}
            y={0}
            width={dimension.marginRight}
            height={dimension.boundedHeight}
            fill='yellow'
            opacity={0.2}
          /> */}
          {/* <g className='legend'>
            { legend }
          </g> */}
        </g>
        <g className='y-axis' transform={`translate(0,${dimension.marginTop})`}>
          {/* <rect
            x={0}
            y={0}
            width={dimension.marginLeft}
            height={dimension.boundedHeight}
            fill='red'
            opacity={0.2}
          /> */}
          <YAxis
            yScale={yScale}
            dimension={dimension}
          />
        </g>
        <g className='x-axis' transform={`translate(${dimension.marginLeft},${dimension.marginTop+dimension.boundedHeight})`}>
          {/* <rect
            x={0}
            y={0}
            width={dimension.boundedWidth}
            height={dimension.marginBottom}
            fill='blue'
            opacity={0.2}
          /> */}
          {/* <XAxis
            xScale={xScale}
            label={xAxisLabel}
            dimension={dimension}
          /> */}
        </g>
        <g transform={`translate(${dimension.marginLeft},${dimension.marginTop})`}>
          {/* <rect
            x={0}
            y={0}
            width={dimension.boundedWidth}
            height={dimension.boundedHeight}
            fill='purple'
            opacity={0.1}
          /> */}
          <g>
            { funnelPath }
            { funnelText }
          </g>
        </g>
      </svg>
    </>
  )
}

export default FunnelChart;
