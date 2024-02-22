'use client'

import * as d3 from 'd3';
import { useMemo, useRef, useState } from 'react';
import XAxis from '../component/XAxis';
import YAxis from '../component/YAxis';
import { BarStack, BarStackText } from './BarStack';
import { Tooltip } from './Tooltip';

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
  selectedSources?: string[];
}

const StackedBarChart = ({
  dimension,
  xAxisLabel,
  data,
  selectedSources,
}: Props) => {
  const [tooltipRegion, setTooltipRegion] = useState<string>('');

  const [legendSource, setLegendSource] = useState<string>('');

  const regions = useMemo(() => Array.from(new Set(data?.map(d => d.name).sort())) ?? [], [data]);
  const sources = useMemo(() => Array.from(new Set(data?.map(d => d.source).sort())) ?? [], [data]);

  const filteredData = useMemo(() => data?.filter(d => selectedSources?.includes(d.source)??true), [data, selectedSources]);

  const regionalData = regions?.map(name => {
    const value = filteredData?.filter(d => d.name === name).reduce((acc, { value }) => acc + value, 0);

    return { name, value }
  })

  const xScale = useMemo(() => (
    d3.scaleLinear()
      .domain([0, d3.max(regionalData, d => d.value) ?? 0])
      .rangeRound([0, dimension.boundedWidth])
      .nice()
  ), [regionalData, dimension.boundedWidth])

  const yScale = useMemo(() => (
    d3.scaleBand()
      .domain(regions)
      .range([0, dimension.boundedHeight])
      .padding(0.3)
  ), [regions, dimension.boundedHeight])

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

  const barItems = regions.map(name => {
    const y = yScale(name) ?? 0;

    let acc = 0;
    const barStacks = sources.map(source => {
      const value = filteredData?.find(d => d.name === name && d.source === source)?.value ?? 0;
      const color = `${colors(source)}`;

      const stackX = xScale(acc);
      const stackY = y;
      const stackWidth = xScale(value);
      const stackHeight = yScale.bandwidth();

      acc += value;

      return (
        <BarStack
          key={`${name}-${source}`}
          x={stackX}
          y={stackY}
          barWidth={stackWidth}
          barHeight={stackHeight}
          fill={color}
          fillOpacity={!legendSource ? 1 : legendSource === source ? 1 : 0.6}
          stroke={legendSource === source ? 'black' : 'transparent'}
        />
      )
    })

    acc = 0;
    const barStackTexts = sources.map(source => {
      const value = filteredData?.find(d => d.name === name && d.source === source)?.value ?? 0;

      const stackX = xScale(acc);
      const stackY = y;
      const stackWidth = xScale(value);
      const stackHeight = yScale.bandwidth();

      const textSpace = 80
      const textOffset = 5
      const isEnoughSpace = dimension.boundedWidth - ( stackX + stackWidth ) > textSpace

      acc += value;

      return (
        <BarStackText
          key={`barStackText-${name}-${source}`}
          x={isEnoughSpace ? stackX + stackWidth + textOffset : stackX + stackWidth - textOffset}
          y={stackY + stackHeight/2}
          textAnchor={isEnoughSpace ? 'start' : 'end'}
          fontSize={10}
          opacity={legendSource && legendSource === source ? 1 : 0}
        >
          { value.toFixed(1) } ton
        </BarStackText>
      )
    })

    return (
      <g key={name}>
        <rect
          x={0}
          y={y - (yScale.step() - yScale.bandwidth()) / 2}
          width={dimension.boundedWidth}
          height={yScale.step()}
          fill={tooltipRegion === name ? 'black' : 'transparent'}
          fillOpacity={tooltipRegion === name ? 0.15 : 1}
          onMouseEnter={() => {
            setTooltipRegion(name);
          }}
          onMouseLeave={() => {
            setTooltipRegion('');
          }}
        />
        { barStacks }
        { barStackTexts }
        <text
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
        >
          {acc.toFixed(1)} ton
        </text>
      </g>
    )
  })

  const legend = sources.map((source, i) => {
    const color = `${colors(source)}`;
    const size = 9;
    const step = size + 5;
    const textOffset = 2;

    return (
      <g
        key={`legend-${source}`}
        onMouseEnter={() => {
          setLegendSource(source);
        }}
        onMouseLeave={() => {
          setLegendSource('');
        }}
      >
        <rect
          x={0}
          y={step * i}
          width={size}
          height={size}
          fill={color}
        />
        <text
          x={size + textOffset}
          y={step * i}
          alignmentBaseline='before-edge'
          fontSize={size}
          fontFamily='sans-serif'
        >
          { source }
        </text>
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
          <XAxis
            xScale={xScale}
            label={xAxisLabel}
            dimension={dimension}
            grid
          />
          {/* <g className='legend' transform={`translate`}>
            { legend }

          </g> */}
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
            open={tooltipRegion ? true : false}
            colorScale={colors}
            data={filteredData?.filter(d => d.name === tooltipRegion)}
            dimension={dimension}
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
