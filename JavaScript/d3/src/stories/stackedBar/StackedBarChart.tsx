'use client'

import * as d3 from 'd3';
import { useMemo, useRef, useState } from 'react';
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
  selectedSource?: string;
}

const StackedBarChart = ({
  dimension,
  xAxisLabel,
  data,
  selectedSource,
}: Props) => {
  // console.log(d3.stack(data.categories))
  const stack = d3.stack()
    .keys(d3.union(data?.map(d => d.source) ?? []))
    .value(([_, map]: any, key) => map.get(key)?.value ?? 0)

  const index = d3.index(data ?? [], d => d.name, d => d.source) as any

  const series = stack(index);

  const regions = useMemo(() => Array.from(new Set(data?.map(d => d.name))) ?? [], [data]);
  const sources = useMemo(() => Array.from(new Set(data?.map(d => d.source))) ?? [], [data]);

  const xScale = useMemo(() => (
    d3.scaleLinear()
      .domain([0, d3.max(series, d => d3.max(d, d => d[1])) ?? 0])
      .rangeRound([0, dimension.boundedWidth])
      .nice()
  ), [series, dimension.boundedWidth])

  const yScale = useMemo(() => (
    d3.scaleBand()
      .domain(regions)
      .range([0, dimension.boundedHeight])
      .padding(0.3)
  ), [data, dimension.boundedHeight])

  const colors = useMemo(() => (
    d3.scaleOrdinal()
      .domain(sources)
      .range(d3.range(sources.length).map(
        d3.scaleSequential()
          .domain([0, sources.length - 1])
          .interpolator(d3.interpolateRdYlBu)
      ))
      .unknown('#ccc')
  ), [sources])

  const barItems = series.map(line => {
    const barLines = line.map((d) => {
      const [current, next] = d;
      const y = yScale(`${d.data[0]}`)

      return (
        <rect
          x={xScale(current)}
          y={y}
          width={xScale(next-current)}
          height={yScale.bandwidth()}
        />
      )
    })

    return (
      <g
        fill={`${colors(line.key)}`}
        opacity={!selectedSource ? 1
          : line.key === selectedSource ? 1 : 0.6
        }
        stroke={!selectedSource ? 'transparent'
          : line.key === selectedSource ? 'black' : 'transparent'
        }
        strokeWidth={1}
      >
        { barLines }
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
      >
        <g transform={`translate(${dimension.marginLeft},0)`}>
        </g>
        <g className='legend' transform={`translate(${dimension.marginLeft+dimension.boundedWidth},${dimension.marginTop})`}>
        </g>
        <g className='y-axis' transform={`translate(0,${dimension.marginTop})`}>
          <YAxis
            yScale={yScale}
            dimension={dimension}
          />
        </g>
        <g className='x-axis' transform={`translate(${dimension.marginLeft},${dimension.marginTop+dimension.boundedHeight})`}>
          <XAxis
            xScale={xScale}
            label={xAxisLabel}
            dimension={dimension}
            grid
          />
        </g>
        <g transform={`translate(${dimension.marginLeft},${dimension.marginTop})`}>
          <g>
            { barItems }
          </g>
        </g>
      </svg>
    </>
  )
}

export default StackedBarChart;
