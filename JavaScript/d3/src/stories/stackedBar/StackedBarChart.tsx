import * as d3 from 'd3';
import { useMemo, useRef, useState } from 'react';
import XAxis from '../component/XAxis';
import YAxis from '../component/YAxis';
import { Rect, Text } from '@/stories/component/animated';
import { Tooltip, TooltipContent } from '@/stories/component/Tooltip';

import { Title } from '@/stories/component';

interface Props {
  dimension: any;
  title?: string;
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
  title: titleText = 'chart',
  xAxisLabel,
  data,
  x,
  y,
  stack,
  stackOnly,
}: Props) => {
  const canvas = useRef<HTMLCanvasElement>(null);

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
        <Rect
          key={`${yValue}-${stackValue}`}
          x={stackX}
          y={stackY}
          width={stackWidth}
          height={stackHeight}
          fill={color}
          fillOpacity={!legendSource ? 1 : legendSource === stackValue ? 1 : 0.6}
          stroke={legendSource === stackValue ? 'black' : color}
          strokeWidth={1}
          pointerEvents='none'
        />
      )
    })

    // for legend
    acc = 0;
    const barStackTexts = stackDomain.map(stackValue => {
      const x = filteredData?.find(d => d.y === yValue && d.stack === stackValue)?.x ?? 0;

      const stackX = xScale(acc);
      const stackY = y;
      const stackWidth = xScale(x);
      const stackHeight = yScale.bandwidth();

      const textSpace = 80
      const textOffset = 5
      const isEnoughSpace = dimension.boundedWidth - ( stackX + stackWidth ) > textSpace

      acc += x;

      return (
        <Text
          key={`barStackText-${yValue}-${stackValue}`}
          value={x}
          formatter={v => `${ Math.round(x * 10) / 10 } ton`}
          x={isEnoughSpace ? stackX + stackWidth + textOffset : stackX + stackWidth - textOffset}
          y={stackY + stackHeight / 2}
          opacity={legendSource && legendSource === stackValue ? 1 : 0}
          textAnchor={isEnoughSpace ? 'start' : 'end'}
          alignmentBaseline='central'
          fontSize={dimension.boundedWidth > 300 ? 10 : 8}
          fontWeight='bold'
          stroke='white'
          paintOrder='stroke'
          pointerEvents='none'
        />
      )
    })

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
        { barStackTexts }
        <Text
          value={acc}
          formatter={(v) => `${typeof v === 'number' ? Math.round(v * 10) / 10 : v} ton`}
          x={xScale(acc) > dimension.boundedWidth - 80 ? xScale(acc) - 5 : xScale(acc) + 5}
          y={y + yScale.bandwidth() / 2}
          textAnchor={xScale(acc) > dimension.boundedWidth - 80 ?  'end' : 'start'}
          alignmentBaseline='central'
          fontSize={dimension.boundedWidth > 300 ? 12 : 10}
          opacity={legendSource ? 0 : 1}
          fontWeight='bold'
          paintOrder='stroke'
          stroke='white'
          strokeWidth={dimension.boundedWidth > 300 ? 1.5 : 1}
          strokeLinecap='butt'
          strokeLinejoin='miter'
          pointerEvents='none'
        />
      </g>
    )
  })

  const legend = stackDomain.map((stackValue, i) => {
    const stackOn = stackOnly?.includes(stackValue) ?? true;

    if (!stackOn) return null;

    const color = `${colorScale(stackValue)}`;
    const size = 8
    const step = size + 4;
    const textOffset = 2;

    return (
      <div
        key={`legend-${stackValue}`}
        onMouseEnter={() => {
          setLegendSource(stackValue);
        }}
        onMouseLeave={() => {
          setLegendSource('');
        }}
        style={{
          display: 'flex',
          flexWrap: 'nowrap',
          alignItems: 'center',
          cursor: 'default',
          pointerEvents: stackOn ? 'auto' : 'none',
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
          { stackValue }
        </div>
      </div>
    )
  })

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
        id='stacked-bar-chart'
        width={dimension.width}
        height={dimension.height}
        viewBox={`${[0,0,dimension.width,dimension.height].join(',')}`}
        fontFamily='sans-serif'
      >
        <Title
          dimension={dimension}
          title={titleText}
        />
        <g transform={`translate(${dimension.marginLeft},0)`}>
        </g>
        <g className='margin-right' transform={`translate(${dimension.marginLeft+dimension.boundedWidth},${dimension.marginTop})`}>
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
          <Tooltip
            open={hoveredY ? true : false}
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
