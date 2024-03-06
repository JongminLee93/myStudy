'use client'

import { G, Rect } from '@/stories/component/animated';
import { toSIUnit } from '../util/formatter';
import * as d3 from 'd3';
import { useMemo } from 'react';
import { Dimesion } from '@/app/chart/util/hook/useChartDimensions';

interface Props {
  data?: Record<string, string | number>[];
  x?: string;
  y?: string;
  color?: string;
  dimension: Dimesion;
  xAxisLabel?: string;
  yAxisLabel?: string;
}

export const LineChart = ({
  data,
  x: xKey = 'x',
  y: yKey = 'y',
  color: cKey='color',
  dimension,
  xAxisLabel,
}: Props) => {
  const xDomain = useMemo(() => (
    Array.from(new Set(data?.map(d => d[xKey] as string))) || []
  ), [data, xKey]);

  const yDomain = useMemo(() => (
    [0, d3.max(data || [], d => d[yKey] as number) || 100]
  ), [data, yKey])

  const colorDomain = useMemo(() => (
    Array.from(new Set(data?.map(d => d[cKey] as string))) || []
  ), [data, cKey])

  const xScale = useMemo(() => (
    d3.scaleBand()
      .domain(xDomain)
      .range([0, dimension.boundedWidth])
      .paddingInner(1)
      .paddingOuter(0)
  ), [xDomain, dimension.boundedWidth])

  const yScale = useMemo(() => (
    d3.scaleLinear()
      .domain(yDomain)
      .range([dimension.boundedHeight, 0])
      .nice()
  ), [yDomain, dimension.boundedHeight])

  const colorScale = useMemo(() => (
    d3.scaleOrdinal()
      .domain(colorDomain)
      .range(d3.range(colorDomain.length).map(
        d3.scaleSequential()
          .domain([0, colorDomain.length - 1])
          .interpolator(d3.interpolateRdYlBu)
      ))
      .unknown('#ccc')
  ), [colorDomain])

  // const columns = useMemo(() => (data?.map(d => {
  //   const key = d[xKey] as string;
  //   const value = d[yKey] as number;
  //   const x = xScale(key) || 0;

  //   return (
  //     <Rect
  //       key={`${d[xKey]}`}
  //       x={x}
  //       y={dimension.boundedHeight - yScale(value)}
  //       width={xScale.bandwidth()}
  //       height={yScale(value)}
  //       fill={`${colorScale(key)}`}
  //       stroke='black'
  //       paintOrder='stroke'
  //     />

  //   )
  // })), [data, xScale, yScale, colorScale, dimension.boundedHeight])

  const lineAndMarksForEachColor = colorDomain.map(cValue => {
    const filteredData = data?.filter(d => d[cKey] === cValue);

    const lineAndMarks = filteredData?.map((d,i,D) => {
      const x = d[xKey] as string;
      const y = d[yKey] as number;
      const nextX = i + 1 < D.length ? D[i+1][xKey] as string : x;
      const nextY = i + 1 < D.length ? D[i+1][yKey] as number : y;

      return (
        <g key={`${d[xKey]}-${cValue}`}>
          <circle
            cx={xScale(x)}
            cy={yScale(y)}
            fill={colorScale(cValue) as string}
            r={3}
          />
          <line
            x1={xScale(x)}
            y1={yScale(y)}
            x2={xScale(nextX)}
            y2={yScale(nextY)}
            stroke={colorScale(cValue) as string}
            strokeWidth={2}
          />
        </g>
      )
    })

    return (
      <g key={cValue}>
        { lineAndMarks }
      </g>
    )
  })

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
          <rect
            x={0}
            y={0}
            width={dimension.boundedWidth}
            height={dimension.marginTop}
            fill='green'
            opacity={0.2}
          />
        </g>
        <g className='margin-right' transform={`translate(${dimension.marginLeft+dimension.boundedWidth},${dimension.marginTop})`}>
          <rect
            x={0}
            y={0}
            width={dimension.marginRight}
            height={dimension.boundedHeight}
            fill='yellow'
            opacity={0.2}
          />
        </g>
        <g className='y-axis' transform={`translate(0,${dimension.marginTop})`}>
          <rect
            x={0}
            y={0}
            width={dimension.marginLeft}
            height={dimension.boundedHeight}
            fill='red'
            opacity={0.2}
          />
        </g>
        <g className='x-axis' transform={`translate(${dimension.marginLeft},${dimension.marginTop+dimension.boundedHeight})`}>
          <rect
            x={0}
            y={0}
            width={dimension.boundedWidth}
            height={dimension.marginBottom}
            fill='blue'
            opacity={0.2}
          />
        </g>
        <g transform={`translate(${dimension.marginLeft},${dimension.marginTop})`}>
          <rect
            x={0}
            y={0}
            width={dimension.boundedWidth}
            height={dimension.boundedHeight}
            fill='purple'
            opacity={0.2}
          />
          { lineAndMarksForEachColor }
        </g>
      </svg>
    </>
  )
}
