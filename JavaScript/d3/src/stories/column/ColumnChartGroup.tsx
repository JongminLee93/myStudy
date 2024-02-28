'use client'

import ColumnChart from '@/stories/column/ColumnChart';
import { Tooltip, TooltipContent } from '@/stories/component/Tooltip';
import { useChartDimensions } from '@/stories/component/hook/useChartDimensions';
import * as d3 from 'd3';
import { useMemo, useState } from 'react';

interface Props {
  data?: Record<string, string | number>[];
  x?: string;
  y?: string;
  group?: string;
  xOnly?: string[];
  dimension: any;
  title?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
}

const ColumnChartGroup = ({
  data,
  group = 'group',
  x: xKey = 'x',
  y: yKey = 'y',
  xOnly,
  dimension,
  title: titleText,
  xAxisLabel,
  yAxisLabel,
}: Props) => {
  const [hoveredKey, setHoveredKey] = useState<string>('');

  const filteredData = useMemo(() => (
    data?.filter(d => xOnly?.includes(d[xKey] as string) ?? true)
  ), [data, xOnly, xKey])

  const rolld = useMemo(() => (
    d3.flatRollup(filteredData ?? [], v => d3.sum(v, d => d[yKey] as number), d => d[group], d => d[xKey])
  ), [filteredData, group, xKey, yKey]);

  const groupDomain = useMemo(() => {
    const groupSet = new Set(filteredData?.map(d => d[group] as string));
    return groupSet.size === 0 ? ['No data'] : Array.from(groupSet);
  }, [filteredData, group]);

  const xDomain = useMemo(() => {
    const xSet = new Set(filteredData?.map(d => d[xKey] as string));
    return xSet.size === 0 ? ['No data'] : Array.from(xSet);
  }, [filteredData, xKey]);

  const memoizedXDomain = useMemo(() => (
    Array.from(new Set(data?.map(d => d[xKey] as string)))
  ), [])

  const yDomain = useMemo(() => (
    [0, d3.max(rolld ?? [], ([_,__,v]) => v) || 100]
  ), [rolld])

  const [ref, dms] = useChartDimensions({
    width: dimension.boundedWidth,
    height: dimension.boundedHeight / groupDomain.length,
    marginLeft: 50,
    marginRight: 0,
    marginTop: 8,
    marginBottom: 0
  });

  const groupScale = useMemo(() => (
    d3.scaleBand()
      .domain(groupDomain)
      .range([0, dimension.boundedHeight])
      .padding(0)
  ), [groupDomain, dimension.boundedHeight])

  const xScale = useMemo(() => (
    d3.scaleBand()
      .domain(xDomain)
      .rangeRound([0, dms.boundedWidth])
      .padding(0.3)
  ), [xDomain, dms.boundedWidth])

  const yScale = useMemo(() => (
    d3.scaleLinear()
      .domain(yDomain)
      .rangeRound([0, dms.boundedHeight])
      .nice()
  ), [yDomain, dms.boundedHeight])

  const colorScale = useMemo(() => (
    d3.scaleOrdinal()
      .domain(memoizedXDomain)
      .range(d3.range(memoizedXDomain.length).map(
        d3.scaleSequential()
          .domain([0, memoizedXDomain.length - 1])
          .interpolator(d3.interpolateRdYlBu)
      ))
      .unknown('#ccc')
  ), [memoizedXDomain])

  const charts = groupDomain.map(key => {
    const y = groupScale(key) || 0;
    const refinedData = Array.from(rolld.filter(([k]) => k === key).map(([g, x, y]) => ({ [xKey]: x, [yKey]: y })));

    return (
      <g
        key={key}
        transform={`translate(0,${y})`}
        onMouseEnter={() => setHoveredKey(key)}
        onMouseLeave={() => setHoveredKey('')}
      >
        <rect
          x={dms.marginLeft}
          y={dms.marginTop}
          width={dms.boundedWidth}
          height={dms.boundedHeight}
          fill={hoveredKey === key ? 'black' : 'transparent'}
          fillOpacity={hoveredKey === key ? 0.15 : 0}
        />
        <ColumnChart
          dimension={dms}
          data={refinedData}
          x={xKey}
          y={yKey}
          xScale={xScale}
          yScale={yScale}
          colorScale={colorScale}
        />
      </g>
    )
  })

  const title = () => {
    return (
      <g>
        <foreignObject
          width='100%'
          height='100%'
          // overflow='visible'
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                fontSize: 12,
                fontWeight: 'bold',
              }}
            >
              { titleText }
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                flexWrap: 'wrap',
                paddingInline: 10
              }}
            >
              {
                xDomain.map(xValue => (
                  <div
                    style={{
                      background: `${colorScale(xValue)}`,
                      color: setLegendTextColor(`${colorScale(xValue)}`),
                      marginTop: 4,
                      fontSize: 8,
                      paddingInline: 3,
                      borderRadius: 2,
                      marginRight: 3
                    }}
                  >
                    { xValue }
                  </div>
                ))
              }
            </div>
          </div>
        </foreignObject>
      </g>
    )
  }

  const groupAxis = groupDomain.map(gValue => {
    const g = groupScale(gValue) || 0;

    return (
      <g
        key={gValue}
        transform={`translate(${dimension.marginLeft + dms.marginLeft},${g + groupScale.bandwidth() / 2})`}
      >
        <text
          textAnchor='middle'
          alignmentBaseline='central'
          fontSize={11}
          fontWeight='bold'
          transform='rotate(-90 -20 20)'
          pointerEvents='none'
        >
          { gValue }
        </text>
      </g>
    )
  })

  const xAxis = xDomain.map((xValue) => {
    const x = xScale(xValue) || 0;

    return (
      <g
        key={xValue}
        transform={`translate(${[x + xScale.bandwidth() / 2, 0].join(',')})`}
      >
        <line y2={6} stroke='#000' strokeOpacity={0.8} />
        <text
          x={-7}
          textAnchor='end'
          alignmentBaseline='hanging'
          fontSize={10}
          transform='rotate(-60)'
          pointerEvents='none'
        >
          { xValue }
        </text>
      </g>
    )
  })


  const tooltip = rolld.filter(([k1]) => k1 === hoveredKey).sort().map(([k1, k2, v]) => {
    return (
      <TooltipContent
        key={`${k1}-${k2}`}
        boxSize={10}
        boxColor={`${colorScale(k2 as string)}`}
        itemName={k2}
        itemValue={v}
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
        <g transform={`translate(${dimension.marginLeft},${dimension.marginTop})`}>
          <Tooltip
            open={hoveredKey ? true : false}
            dimension={dimension}
            tooltipContent={tooltip}
          >
            <g>
              { charts }
            </g>
          </Tooltip>
        </g>
        <g
          className='margin-top'
          transform={`translate(${dimension.marginLeft},0)`}
        >
          { title() }
        </g>
        <g
          className='margin-right'
          transform={`translate(${dimension.marginLeft+dimension.boundedWidth},${dimension.marginTop})`}
        >
        </g>
        <g
          className='y-axis'
          transform={`translate(0,${dimension.marginTop})`}
        >
          {groupAxis}
        </g>
        <g
          className='x-axis'
          transform={`translate(${dimension.marginLeft+dms.marginLeft},${dimension.marginTop+dimension.boundedHeight})`}
        >
          <line x2={dms.boundedWidth} stroke='black' strokeWidth={0.8} />
          { xAxis }
        </g>
      </svg>
    </>
  )
}


function setLegendTextColor(bgColor) {
  // 배경색에서 RGB 부분만 추출합니다.
  var rgb = bgColor.match(/\d+/g);

  if (rgb.length >= 3) {
      // RGB 값을 추출하고 밝기를 계산합니다.
      var brightness = 0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2];

    // 밝기에 따라 글자 색을 변경합니다.
    if (brightness > 210) { // 128은 임계값으로 조정할 수 있습니다.
      return 'rgba(120, 120, 120, 0.7)';
    } else {
      return 'white';
    }
  }
}

export default ColumnChartGroup;
