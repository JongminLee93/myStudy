'use client'

import { Tooltip, TooltipContent } from '@/stories/component/Tooltip';
import { Text } from '@/stories/component/animated';
import * as d3 from 'd3';
import { useMemo, useState } from 'react';
import YAxis from '../component/YAxis';
import { Path } from '@/stories/component/animated/Path';

interface Data {
  year: string;
  value: number;
}

const drawShape = (pathGenerator: d3.Path, [[x0, y0], [x1, y1], [x2, y2], [x3, y3]]: [number, number][]) => {
  pathGenerator.moveTo(x0, y0);
  pathGenerator.bezierCurveTo(x0, (y0 + y1) / 2, x1, (y0 + y1) / 2, x1, y1);
  pathGenerator.lineTo(x2, y2);
  pathGenerator.bezierCurveTo(x2, (y2 + y3) / 2, x3, (y2 + y3) / 2, x3, y3);
  pathGenerator.closePath();

  return pathGenerator
}

interface Props {
  data?: Record<string, string | number>[];
  x?: string;
  y?: string;
  dimension: any;
  xAxisLabel?: string;
  yAxisLabel?: string;
}

const FunnelChart = ({
  data,
  x: xKey = 'x',
  y: yKey = 'y',
  dimension,
  xAxisLabel,
}: Props) => {
  const [hoveredKey, setHoveredKey] = useState<string>('');

  const refinedData = useMemo(() => {
    const summary: Record<string, number> = {};

    data?.forEach(item => {
      const yValue = item[yKey] as string;
      const xValue = item[xKey] as number;

      if (!summary[yValue])
        summary[yValue] = 0;

      summary[yValue] += xValue;
    });

    return Object.keys(summary).map(y => ({
      y,
      x: summary[y],
    }));
  }, [data, xKey, yKey])

  const yDomain = useMemo(() => Array.from(new Set(refinedData?.map(d => d.y))) ?? [], [refinedData]);

  const xScale = useMemo(() => (
    d3.scaleLinear()
      .domain([-(d3.max(refinedData ?? [], d => d.x) ?? 0), d3.max(refinedData ?? [], d => d.x) ?? 0])
      .rangeRound([0, dimension.boundedWidth])
      .nice()
  ), [refinedData, dimension.boundedWidth])

  const yScale = useMemo(() => (
    d3.scaleBand()
      .domain(yDomain)
      .range([0, dimension.boundedHeight])
      .padding(0.3)
  ), [yDomain, dimension.boundedHeight])

  const colorScale = useMemo(() => (
    d3.scaleOrdinal()
      .domain(yDomain)
      .range(d3.range(yDomain.length).map(
        d3.scaleSequential()
          .domain([yDomain.length - 1, 0])
          .interpolator(d3.interpolateRgb('#d4d6eb', '#000887'))
      ))
      .unknown('#ccc')
  ), [yDomain])

  const funnelPath = refinedData?.map(({ y: key, x: value }, i, D) => {
    const { x: nextValue } = i + 1 < D.length ? D[i+1] : D[i];

    const dx = hoveredKey === key ? 10 : 0

    const y = yScale(key) ?? 0;
    const nextY = y + yScale.step();
    const paddingY = (yScale.step() - yScale.bandwidth()) / 2

    const x0 = dimension.boundedWidth - xScale(value) - dx;
    const y0 = y - paddingY;

    const x1 = dimension.boundedWidth - xScale(nextValue) - dx;
    const y1 = nextY - paddingY;

    const x2 = xScale(nextValue) + dx;
    const y2 = nextY - paddingY;

    const x3 = xScale(value) + dx;
    const y3 = y - paddingY;

    return (
      <g
        key={`funnel-${key}`}
        onMouseEnter={() => setHoveredKey(key)}
        onMouseLeave={() => setHoveredKey('')}
      >
        {i ===  0 &&
          <line
            x1={0}
            y1={y0}
            x2={dimension.boundedWidth}
            y2={y0}
            stroke='#ddd'
          />
        }
        <line
          x1={0}
          y1={y1}
          x2={dimension.boundedWidth}
          y2={y1}
          stroke='#ddd'
        />
        <Path
          d={drawShape(d3.path(), [[x0, y0], [x1, y1], [x2, y2], [x3, y3]]).toString()}
          fill={`${colorScale(key)}`}
          stroke='black'
        />
      </g>
    )
  })

  const funnelText = refinedData?.map(({ y: key, x: value }, i, D) => {
    const { x: nextValue } = i + 1 < D.length ? D[i+1] : D[i];

    const y = yScale(key) ?? 0;
    const nextY = y + yScale.step();
    const paddingY = (yScale.step() - yScale.bandwidth()) / 2

    const y2 = nextY - paddingY;

    return (
      <g key={`funnel-text-${key}`}>
        <Text
          x={dimension.boundedWidth / 2}
          y={y + yScale.bandwidth() / 2}
          value={value}
          formatter={(v) => `${typeof v === 'number' ? Math.round(v*10)/10 : v} ton`}
          textAnchor='middle'
          alignmentBaseline='central'
          fontSize={12}
          fontWeight='bold'
          paintOrder='stroke'
          stroke='white'
          strokeWidth={1}
          strokeLinecap='butt'
          strokeLinejoin='miter'
          pointerEvents='none'
        />
        <Text
          x={dimension.boundedWidth / 2}
          y={y2}
          value={(nextValue / value) * 100}
          formatter={(v) => `${typeof v === 'number' ? Math.round(v*10)/10 : v} %`}
          textAnchor='middle'
          alignmentBaseline='central'
          opacity={i + 1 < D.length ? 1 : 0}
          fontSize={10}
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

  const tooltip = refinedData?.filter(({ y: key }) => key === hoveredKey)?.map(({ y: key, x: value }) => {
    const color = `${colorScale(key)}`;

    return (
      <TooltipContent
        key={`${key}`}
        boxColor={color}
        itemName={`${key}년 배출량`}
        itemValue={value}
        valueFormatter={(v) => `${Math.round(v * 10) / 10} ton`}
      />
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
          <Tooltip
            dimension={dimension}
            tooltipContent={tooltip}
          >
            <g>
              { funnelPath }
              { funnelText }
            </g>
          </Tooltip>
        </g>
      </svg>
    </>
  )
}

export default FunnelChart;
