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
  const tooltipRef = useRef<HTMLDivElement>(null);

  const [tooltipRegion, setTooltipRegion] = useState<string>('');
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number; }>();

  const regions = useMemo(() => Array.from(new Set(data?.map(d => d.name).sort())) ?? [], [data]);
  const sources = useMemo(() => Array.from(new Set(data?.map(d => d.source).sort())) ?? [], [data]);

  const regionalData = regions?.map(name => {
    const value = data?.filter(d => d.name === name).reduce((acc, { value }) => acc + value, 0);

    return { name, value }
  })

  const xScale = useMemo(() => (
    d3.scaleLinear()
      .domain([0, d3.max(regionalData, d => d.value) ?? 0])
      .rangeRound([0, dimension.boundedWidth])
      .nice()
  ), [data, dimension.boundedWidth])

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

  const barItems = regions.map(name => {
    const y = yScale(name) ?? 0;
    let acc = 0;

    const barStacks = sources.map(source => {
      const value = data?.find(d => d.name === name && d.source === source)?.value ?? 0;
      const color = colors(source);
      acc += value;

      return (
        <g>
          <rect
            key={`${name}-${source}`}
            x={xScale(acc-value)}
            y={y}
            width={xScale(value)}
            height={yScale.bandwidth()}
            fill={`${color}`}
            opacity={!selectedSource ? 1 : selectedSource === source ? 1 : 0.6}
            stroke={selectedSource === source ? 'black' : 'transparent'}
            strokeWidth={1}
            pointerEvents='none'
          />
          {/* <text
            x={springProps.barWidth?.to((width) => x+width + dataLabelOffset)}
            y={springProps.y?.to((y) => y + barHeight / 2)}
            textAnchor={textAnchor}
            alignmentBaseline="central"
            opacity={springProps.valueOpacity}
            fontSize={12}
            fontWeight='bold'
          >
            {springProps.value?.to((value) => value.toFixed(1) + ' ton')}
          </text> */}
          
        </g>
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
          onMouseEnter={(e) => {
            setTooltipRegion(name);
          }}
          onMouseMove={(e) => {
            const tooltip = tooltipRef.current;

            if (tooltip) {
              let tooltipWidth = tooltip.getBoundingClientRect().width;
              let tooltipHeight = tooltip.getBoundingClientRect().height;

              const targetBox = e.currentTarget.getBoundingClientRect();

              let posX = e.clientX - (targetBox.x - dimension.marginLeft) + 10;
              let posY = e.clientY - (targetBox.y - dimension.marginTop) + y - (yScale.step() - yScale.bandwidth()) / 2 + 10;

              if (posX > dimension.boundedWidth / 2) {
                posX -= (tooltipWidth + 20);
              }

              if (posY > dimension.boundedHeight / 2) {
                posY -= (tooltipHeight + 20);
              }

              setTooltipPosition({x: posX, y: posY});
            }
          }}
          onMouseLeave={(e) => {
            setTooltipRegion('');
          }}
        />
        { barStacks }
        <text
          x={xScale(acc) > dimension.boundedWidth - 100 ? xScale(acc) - 5 : xScale(acc) + 5}
          y={y + yScale.bandwidth() / 2}
          textAnchor={xScale(acc) > dimension.boundedWidth - 100 ? 'end' : 'start'}
          alignmentBaseline='central'
          fontSize={12}
        >
          {acc.toFixed(1)} ton
        </text>
      </g>
    )
  })

  const tooltip = sources.map((source, i) => {
    const value = data?.find(d => d.name === tooltipRegion && d.source === source)?.value ?? '-';
    const color = `${colors(source)}`;
    const size = 10;
    const textOffset = 2;

    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: i === 0 ? '' : '1px solid rgba(0, 0, 0, 0.08)',
          padding: '1px 0'
        }}
      >
        <div
          style={{
            background: color,
            width: size,
            height: size,
            marginRight: textOffset,
          }}
        />
        <div
          style={{
            flexGrow: 1,
            marginRight: textOffset,
            textAlign: 'center',
            fontSize: size,
          }}
        >
          {`${source}`}
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'end',
            minWidth: 65,
            fontSize: size,
          }}
        >
          {`${value} ton`}
        </div>
      </div>
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
          {/* <rect
            x={0}
            y={0}
            width={dimension.boundedWidth}
            height={dimension.marginTop}
            fill='green'
            opacity={0.2}
          /> */}
        </g>
        <g className='legend' transform={`translate(${dimension.marginLeft+dimension.boundedWidth},${dimension.marginTop})`}>
          {/* <rect
            x={0}
            y={0}
            width={dimension.marginRight}
            height={dimension.boundedHeight}
            fill='yellow'
            opacity={0.2}
          /> */}
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
            { barItems }
          </g>
        </g>
        <foreignObject
          x={tooltipPosition?.x ?? 0}
          y={tooltipPosition?.y ?? 0}
          width={'100%'}
          height={'100%'}
          overflow='visible'
          pointerEvents='none'
          visibility={tooltipRegion ? 'visiblity' : 'hidden'}
        >
          <div
            ref={tooltipRef}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              position: 'absolute',
              borderStyle: 'solid',
              borderColor: 'black',
              borderWidth: '1px',
              borderRadius: '2px',
              padding: '8px',
              fontFamily: 'sans-serif',
              overflow: 'visible'
            }}
          >
            { tooltip }
          </div>
        </foreignObject>
      </svg>
    </>
  )
}

export default StackedBarChart;
