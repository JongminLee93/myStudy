'use client'

import { G, Rect } from '@/stories/component/animated';
import { toSIUnit } from '@/stories/util/formatter';
import * as d3 from 'd3';
import { useMemo } from 'react';

interface Props {
  data?: Record<string, string | number>[];
  x?: string;
  y?: string;
  xScale?: any;
  yScale?: any;
  colorScale?: any;
  dimension: any;
  xAxisLabel?: string;
  yAxisLabel?: string;
}

const ColumnChart = ({
  data,
  x: xKey = 'x',
  y: yKey = 'y',
  xScale: fixedXScale,
  yScale: fixedYScale,
  colorScale: fixedColorScale,
  dimension,
  xAxisLabel,
}: Props) => {
  const xDomain = useMemo(() => (
    fixedXScale?.domain() || Array.from(new Set(data?.map(d => d[xKey] as string))) || []
  ), [fixedXScale, data, xKey]);

  const yDomain = useMemo(() => (
    fixedYScale?.domain() || [0, d3.max(data || [], d => d[yKey] as number) || 100]
  ), [fixedYScale, data, yKey])

  const xScale = useMemo(() => (
    d3.scaleBand()
      .domain(xDomain)
      .range([0, dimension.boundedWidth])
      .padding(0.3)
  ), [fixedXScale, xDomain, dimension.boundedWidth])

  const yScale = useMemo(() => (
    d3.scaleLinear()
      .domain(yDomain)
      .range([0, dimension.boundedHeight])
      .nice()
  ), [fixedYScale, yDomain, dimension.boundedHeight])

  const colorScale = useMemo(() => (
    fixedColorScale ||
    d3.scaleOrdinal()
      .domain(xDomain)
      .range(d3.range(xDomain.length).map(
        d3.scaleSequential()
          .domain([0, xDomain.length - 1])
          .interpolator(d3.interpolateRdYlBu)
      ))
      .unknown('#ccc')
  ), [xDomain])

  const columns = useMemo(() => (data?.map(d => {
    const key = d[xKey] as string;
    const value = d[yKey] as number;
    const x = xScale(key) || 0;

    return (
      <Rect
        key={`${d[xKey]}`}
        x={x}
        y={dimension.boundedHeight - yScale(value)}
        width={xScale.bandwidth()}
        height={yScale(value)}
        fill={`${colorScale(key)}`}
        stroke='black'
        paintOrder='stroke'
      />

    )
  })), [data, xScale, yScale, colorScale, dimension.boundedHeight])

  const ticks = useMemo(() => {
    const pixelsPerTick = 20;
    const numOfTicks = Math.max(
      1,
      Math.floor(dimension.boundedHeight / pixelsPerTick)
    )

    return yScale.ticks(numOfTicks)
      .map(value => ({
        value,
        yOffset: yScale(value)
      }))
  }, [yScale, dimension])

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
        </g>
        <g className='margin-right' transform={`translate(${dimension.marginLeft+dimension.boundedWidth},${dimension.marginTop})`}>
        </g>
        <g className='y-axis' transform={`translate(0,${dimension.marginTop})`}>
          <path
            d={[
              "M", dimension.marginLeft - 6, 0,
              "h", 6,
              "V", dimension.boundedHeight,
              "h", -6,
            ].join(" ")}
            fill="none"
            stroke="currentColor"
          />
          {ticks.map(({ value, yOffset }, i) => (
            <G
              key={value}
              transform={`translate(${dimension.marginLeft}, ${dimension.boundedHeight - yOffset})`}
              opacity={1}
            >
              <line
                x2={dimension.boundedWidth}
                stroke={i === 0 ? '#000' : '#ddd'}
                strokeDasharray={i === 0 ? 0 : 4}
                strokeOpacity={0.8}
                strokeWidth={0.5}
              />
              <line
                x2={-6}
                stroke="currentColor"
              />
              <text
                x={-10}
                fontSize={8}
                alignmentBaseline='central'
                textAnchor='end'
                pointerEvents='none'
              >
                { toSIUnit(value) }
              </text>
            </G>
          ))}
        </g>
        <g className='x-axis' transform={`translate(${dimension.marginLeft},${dimension.marginTop+dimension.boundedHeight})`}>

        </g>
        <g transform={`translate(${dimension.marginLeft},${dimension.marginTop})`}>
          <g>
            { columns }
          </g>
        </g>
      </svg>
    </>
  )
}

export default ColumnChart;
