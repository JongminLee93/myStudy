'use client'

import * as d3 from 'd3';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Dimesion } from '@/app/chart/util/hook/useChartDimensions';
import { toSIUnit } from '@/app/chart/util/formatter';

interface Props {
  data?: Record<string, string | number>[];
  x?: string;
  y?: string;
  group?: string;
  // groupOnly?: string[];
  dimension: Dimesion;
  xAxisLabel?: string;
  yAxisLabel?: string;
}

export const ColumnGroupChart = ({
  data,
  x='x',
  y='y',
  group='group',
  // groupOnly,
  dimension,
  xAxisLabel,
  yAxisLabel,
}: Props) => {
  const svgRef = useRef<SVGSVGElement>(null);

  const groupDomain = useMemo(() => (
    Array.from(new Set(data?.map(d => d[group] as string))).sort(d => ['PM10', 'PM2P5', 'BC'].includes(d) ? 1 : -1)
  ), [])

  const groupScale = useMemo(() => (
    d3.scaleOrdinal()
      .domain(groupDomain)
      .range(d3.range(groupDomain.length).map(
        d3.scaleSequential()
          .domain([0, groupDomain.length - 1])
          .interpolator(d3.interpolateRdYlBu)
      ))
      .unknown('#ccc')
  ), [])

  const [groupOnly, setGroupOnly] = useState<string[]>(groupDomain);

  const filteredData = data?.filter(d => groupOnly.includes(d[group] as string))

  console.log(filteredData);

  const xDomain = useMemo(() => (
    Array.from(new Set(filteredData?.map(d => d[x] as string))).sort()
  ), [filteredData, x])

  const yDomain = useMemo(() => (
    [0, d3.max(filteredData || [], d => d[y] as number) ?? 100]
  ), [filteredData, y])

  const xScale = useMemo(() => (
    d3.scaleBand().domain(xDomain).range([0, dimension.boundedWidth]).padding(0.3)
  ), [xDomain, dimension.boundedWidth])

  const yScale = useMemo(() => (
    d3.scaleLinear().domain(yDomain).range([dimension.boundedHeight, 0]).nice()
  ), [yDomain, dimension.boundedHeight])

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const svgContent = svg.select('g.content');

    const yAxis = d3.axisLeft(yScale)
      .tickFormat((d) => toSIUnit(d.valueOf()));
    svg.select('.y-axis').call(yAxis as any);

    const xAxis = d3.axisBottom(xScale);
    svg.select(".x-axis").call(xAxis as any);

    svgContent.select('g').selectAll('rect')
      .data(filteredData || [])
      .join('rect')
        .attr('x', (d, i) => (xScale(d[x] as string) || 0) + (xScale.bandwidth() / groupOnly.length) * (i % groupOnly.length))
        .attr('y', d => yScale(d[y] as number))
        .attr('width', (xScale.bandwidth() / groupOnly.length))
        .attr('height', d => yScale(0) - yScale(d[y] as number))
        .attr('fill', d => `${groupScale(d[group] as string)}`)

    // zoom
    const zoomBehavior = d3.zoom()
      .scaleExtent([1, 3])
      .translateExtent([[0, 0], [dimension.boundedWidth, dimension.boundedHeight]])
      .extent([[0, 0], [dimension.boundedWidth, dimension.boundedHeight]])
      .on("zoom", ({ transform }) => {
        xScale.range([0, dimension.boundedWidth].map(d => transform.applyX(d)));

        svgContent.select('g').selectAll('rect')
          .attr('x', (d: any, i) => (xScale(d[x] as string) || 0) + (xScale.bandwidth() / groupOnly.length) * (i % groupOnly.length))
          .attr('width', (xScale.bandwidth() / groupOnly.length));
        svg.select(".x-axis")
          .call(xAxis as any);
      })

    svgContent.call(zoomBehavior as any);
  }, [filteredData])

  const legend = groupDomain.map((value, i) => {
    const stackOn = groupOnly?.includes(value) ?? true;

    // if (!stackOn) return null;

    const color = `${groupScale(value)}`;
    const size = 8
    const step = size + 4;
    const textOffset = 2;

    return (
      <div
        key={`legend-${value}`}
        onClick={() => {
          console.log(value);
          
          let next = [...groupOnly];

          if (next.includes(value))
            next = next.filter(v => v !== value);
          else
            next.push(value);

          setGroupOnly(next)
        }}
        onMouseLeave={() => {
          // setLegendSource('');
        }}
        style={{
          display: 'flex',
          flexWrap: 'nowrap',
          alignItems: 'center',
          cursor: 'default',
          // pointerEvents: stackOn ? 'auto' : 'none',
        }}
      >
        <i
          style={{
            flexShrink: 0,
            background: stackOn ? color : '#999',
            width: size,
            height: size,
            marginRight: textOffset,
          }}
        />
        <div
          style={{
            textWrap: 'nowrap',
            flexGrow: 1,
            color: stackOn ? '#000' : '#999',
            fontSize: size,
            textDecoration: stackOn ? 'none' : 'line-through'
          }}
        >
          { value }
        </div>
      </div>
    )
  })

  return (
    <>
      <svg
        ref={svgRef}
        id='column-group-chart'
        width={dimension.width}
        height={dimension.height}
        viewBox={`${[0,0,dimension.width,dimension.height].join(',')}`}
        overflow='visible'
        fontFamily='sans-serif'
      >
        <defs>
          <clipPath id='chartBackground'>
            <rect x={0} y={0} width={dimension.boundedWidth} height={dimension.boundedHeight} />
          </clipPath>
        </defs>
        <g
          className='margin-top'
          transform={`translate(${dimension.marginLeft},0)`}
        >
          <rect
            x={0}
            y={0}
            width={dimension.boundedWidth}
            height={dimension.marginTop}
            fill='green'
            opacity={0.2}
          />
        </g>
        <g
          className='margin-right'
          transform={`translate(${dimension.marginLeft+dimension.boundedWidth},${dimension.marginTop})`}
        >
          <rect
            x={0}
            y={0}
            width={dimension.marginRight}
            height={dimension.boundedHeight}
            fill='yellow'
            opacity={0.2}
          />
          <foreignObject
            className='legend'
            x={5}
            width={dimension.marginRight}
            height={dimension.boundedHeight}
          >
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}
            >
              { legend }
            </div>
          </foreignObject>
        </g>
        <g
          className='y-axis'
          transform={`translate(${dimension.marginLeft},${dimension.marginTop})`}
        >
          <rect
            x={-dimension.marginLeft}
            y={0}
            width={dimension.marginLeft}
            height={dimension.boundedHeight}
            fill='red'
            opacity={0.2}
          />
        </g>
        <g
          className='x-axis'
          transform={`translate(${dimension.marginLeft},${dimension.marginTop+dimension.boundedHeight})`}
        >
          <rect
            x={0}
            y={0}
            width={dimension.boundedWidth}
            height={dimension.marginBottom}
            fill='blue'
            opacity={0.2}
          />
        </g>
        <g
          className='content'
          transform={`translate(${dimension.marginLeft},${dimension.marginTop})`}
          clipPath='url(#chartBackground)'
        >
          <rect x={0} y={0} width={dimension.boundedWidth} height={dimension.boundedHeight} fill='transparent' stroke='black' />
          <g />
        </g>
      </svg>
    </>
  )
}
