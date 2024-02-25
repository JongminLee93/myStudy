'use client'

import * as d3 from 'd3';
import { useMemo, useState } from 'react';
import XAxis from '../component/XAxis';
import YAxis from '../component/YAxis';
import { BarStack, BarStackText } from './BarStack';
import { Text } from '@/stories/component/animated';
import { Tooltip, TooltipContent } from '@/stories/component/Tooltip';

interface Props {
  dimension: any;
  xAxisLabel?: string;
  yAxisLabel?: string;
  data?: Record<string, string | number>[];
  x: string;
  y: string;
  stack: string;
  stackOnly?: string[];
}

const StackedBarChart = ({
  dimension,
  xAxisLabel,
  data,
  x,
  y,
  stack,
  stackOnly,
}: Props) => {
  const [hoveredY, setHoveredY] = useState<string>('');

  const [legendSource, setLegendSource] = useState<string>('');

  const yDomain = useMemo(() => Array.from(new Set(data?.map(d => `${d[y]}`).sort())) ?? [], [data, y]);
  const stackDomain = useMemo(() => Array.from(new Set(data?.map(d => `${d[stack]}`).sort())) ?? [], [data, stack]);

  const refinedData = useMemo(() => (data?.reduce((acc: any[], datum) => {
      let localY = datum[y].toString();
      let localStack = datum[stack].toString();
      let localX = Number.parseFloat(datum[x].toString());

      if (!acc.find(item => item.y === localY && item.stack === localStack))
        acc.push({ y: localY, stack: localStack, x: 0 });

      acc.find(item => item.y === localY && item.stack === localStack).x += localX;

      return acc
    }, [])
  ), [data, x, y, stack])

  const filteredData = useMemo(() => refinedData?.filter(d => stackOnly?.includes(`${d.stack}`)??true), [refinedData, stackOnly]);

  const accData = yDomain?.map(y => {
    const x = filteredData?.filter(d => d.y === y).reduce((acc, { x }) => acc + x, 0);

    return { y, x }
  })

  const xScale = useMemo(() => (
    d3.scaleLinear()
      .domain([0, d3.max(accData, d => d.x) || 100])
      .rangeRound([0, dimension.boundedWidth])
      .nice()
  ), [accData, dimension.boundedWidth])

  const yScale = useMemo(() => (
    d3.scaleBand()
      .domain(yDomain)
      .range([0, dimension.boundedHeight])
      .padding(0.3)
  ), [yDomain, dimension.boundedHeight])

  const colorScale = useMemo(() => (
    d3.scaleOrdinal()
      .domain(stackDomain)
      .range(d3.range(stackDomain.length).map(
        d3.scaleSequential()
          .domain([0, stackDomain.length - 1])
          .interpolator(d3.interpolateRdYlBu)
      ))
      .unknown('#ccc')
  ), [stackDomain])

  const barItems = yDomain.map(yValue => {
    const y = yScale(yValue) ?? 0;

    let acc = 0;
    const barStacks = stackDomain.map(stackValue => {
      const x = filteredData?.find(d => d.y === yValue && d.stack === stackValue)?.x ?? 0;
      const color = `${colorScale(stackValue)}`;

      const stackX = xScale(acc);
      const stackY = y;
      const stackWidth = xScale(x);
      const stackHeight = yScale.bandwidth();

      acc += x;

      return (
        <BarStack
          key={`${yValue}-${stackValue}`}
          x={stackX}
          y={stackY}
          barWidth={stackWidth}
          barHeight={stackHeight}
          fill={color}
          fillOpacity={!legendSource ? 1 : legendSource === stackValue ? 1 : 0.6}
          stroke={legendSource === stackValue ? 'black' : color}
        />
      )
    })

    // for legend
    // acc = 0;
    // const barStackTexts = stackValues.map(stackValue => {
    //   const x = filteredData?.find(d => d.y === yValue && d.stack === stackValue)?.x ?? 0;

    //   const stackX = xScale(acc);
    //   const stackY = y;
    //   const stackWidth = xScale(x);
    //   const stackHeight = yScale.bandwidth();

    //   const textSpace = 80
    //   const textOffset = 5
    //   const isEnoughSpace = dimension.boundedWidth - ( stackX + stackWidth ) > textSpace

    //   acc += x;

    //   return (
    //     <BarStackText
    //       key={`barStackText-${yValue}-${stackValue}`}
    //       x={isEnoughSpace ? stackX + stackWidth + textOffset : stackX + stackWidth - textOffset}
    //       y={stackY + stackHeight/2}
    //       textAnchor={isEnoughSpace ? 'start' : 'end'}
    //       fontSize={10}
    //       opacity={legendSource && legendSource === stackValue ? 1 : 0}
    //     >
    //       { Math.round(x * 10) / 10 } ton
    //     </BarStackText>
    //   )
    // })

    return (
      <g key={yValue}>
        <rect
          x={0}
          y={y - (yScale.step() - yScale.bandwidth()) / 2}
          width={dimension.boundedWidth}
          height={yScale.step()}
          fill={hoveredY === yValue ? 'black' : 'transparent'}
          fillOpacity={hoveredY === yValue ? 0.15 : 1}
          onMouseEnter={() => {
            setHoveredY(yValue);
          }}
          onMouseLeave={() => {
            setHoveredY('');
          }}
        />
        { barStacks }
        {/* { barStackTexts } */}
        <Text
          value={acc}
          formatter={(v) => `${typeof v === 'number' ? Math.round(v * 10) / 10 : v} ton`}
          x={xScale(acc) > dimension.boundedWidth - 100 ? xScale(acc) - 5 : xScale(acc) + 5}
          y={y + yScale.bandwidth() / 2}
          textAnchor={xScale(acc) > dimension.boundedWidth - 100 ? 'end' : 'start'}
          alignmentBaseline='central'
          fontSize={12}
          opacity={legendSource ? 0 : 1}
          pointerEvents='none'
          fontWeight='bold'
          paintOrder='stroke'
          stroke='white'
          strokeWidth={1.5}
          strokeLinecap='butt'
          strokeLinejoin='miter'
        />
      </g>
    )
  })

  // const legend = stackValues.map((stackValue, i) => {
  //   const color = `${colorScale(stackValue)}`;
  //   const size = 9;
  //   const step = size + 5;
  //   const textOffset = 2;

  //   return (
  //     <g
  //       key={`legend-${stackValue}`}
  //       onMouseEnter={() => {
  //         setLegendSource(stackValue);
  //       }}
  //       onMouseLeave={() => {
  //         setLegendSource('');
  //       }}
  //     >
  //       <rect
  //         x={0}
  //         y={step * i}
  //         width={size}
  //         height={size}
  //         fill={color}
  //       />
  //       <text
  //         x={size + textOffset}
  //         y={step * i}
  //         alignmentBaseline='before-edge'
  //         fontSize={size}
  //         fontFamily='sans-serif'
  //       >
  //         { stackValue }
  //       </text>
  //     </g>
  //   )
  // })

  const tooltip = (stackOnly || stackDomain)?.map((stack, i) => {
    const x = filteredData?.filter(d => d.y === hoveredY)?.find(d => d.stack === stack)?.x ?? 0;
    const color = `${colorScale(stack)}`;

    return (
      <TooltipContent
        key={`${stack}`}
        boxColor={color}
        itemName={stack}
        itemValue={x}
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
          <XAxis
            xScale={xScale}
            label={xAxisLabel}
            dimension={dimension}
            grid
          />
          {/* <AxisBottom scale={xScale} tickFormatter={(v) => toSIUnit(v)} /> */}
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
              { barItems }
            </g>
          </Tooltip>
        </g>
      </svg>
    </>
  )
}

export default StackedBarChart;
