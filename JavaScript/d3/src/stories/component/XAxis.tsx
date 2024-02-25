import { G } from '@/stories/component/animated/G';
import { toSIUnit } from '@/stories/util/formatter';
import * as d3 from 'd3';
import { useMemo } from 'react';

type Props = {
  xScale: d3.ScaleLinear<number, number, never>;
  tickSize?: number;
  tickFontSize?: string | number;
  tickOffset?: number;
  grid?: boolean;
  label?: string;
  labelFontSize?: string | number;
  labelOffset?: number;
  dimension: any;
}

const XAxis = ({
  xScale,
  tickSize=6,
  tickFontSize=10,
  tickOffset=18,
  grid=false,
  label,
  labelFontSize=11,
  labelOffset=25,
  dimension,
}: Props) => {
  const ticks = useMemo(() => {
    const pixelsPerTick = 60
    const numOfTicks = Math.max(
      1,
      Math.floor(dimension.boundedWidth / pixelsPerTick)
    )

    return xScale.ticks(numOfTicks)
      .map(value => ({
        value,
        xOffset: xScale(value)
      }))
  }, [xScale, dimension])

  return (
    <svg
      overflow='visible'
    >
      <path
        d={[
          "M", 0, tickSize,
          "v", -tickSize,
          "H", dimension.boundedWidth,
          "v", tickSize,
        ].join(" ")}
        fill="none"
        stroke="currentColor"
      />
      {ticks.map(({ value, xOffset }, i) => (
        <G
          key={value}
          transform={`translate(${xOffset}, 0)`}
          opacity={1}
        >
          {
            grid &&
            <line
              y2={-dimension.boundedHeight}
              stroke="#ddd"
              strokeDasharray={i === 0 ? 0 : 4}
              strokeOpacity={0.8}
            />
          }
          <line
            y2={tickSize}
            stroke="currentColor"
          />
          <text
            y={tickOffset}
            fontSize={tickFontSize}
            textAnchor='middle'
          >
            { toSIUnit(value) }
          </text>
        </G>
      ))}
      <text
        fontSize={labelFontSize}
        fontWeight='bold'
        textAnchor='middle'
        alignmentBaseline='hanging'
        transform={`translate(${[dimension.boundedWidth/2,labelOffset].join(',')})`}
      >
        {label}
      </text>
    </svg>
  )
}

export default XAxis