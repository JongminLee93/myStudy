import { useMemo } from 'react'
import * as d3 from 'd3';

type Props = {
  xScale: d3.ScaleLinear<number, number, never>;
  tickOffset?: number;
  grid?: boolean;
  label?: string;
  labelOffset?: number;
  dimension: any;
}

const XAxis = ({
  xScale,
  tickOffset=20,
  grid=false,
  label,
  labelOffset=25,
  dimension,
}: Props) => {
  const ticks = useMemo(() => {
    const pixelsPerTick = 60
    const numberOfTicksTarget = Math.max(
      1,
      Math.floor(
        dimension.boundedWidth / pixelsPerTick
      )
    )

    return xScale.ticks(numberOfTicksTarget)
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
          "M", 0, 6,
          "v", -6,
          "H", dimension.boundedWidth,
          "v", 6,
        ].join(" ")}
        fill="none"
        stroke="currentColor"
      />
      {ticks.map(({ value, xOffset }) => (
        <g
          key={value}
          transform={`translate(${xOffset}, 0)`}
        >
          {
            grid &&
            <line
              y2={-dimension.boundedHeight}
              stroke="#ddd"
            />
          }
          <line
            y2="6"
            stroke="currentColor"
          />
          <text
            fontSize={10}
            textAnchor='middle'
            y={tickOffset}
          >
            { toSIUnit(value) }
          </text>
        </g>
      ))}
      <text
        fontSize={11}
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

const toSIUnit = (value: number) => {
  const to = 1;
  if (value < 1e3) return value.toString();
  else if (value >= 1e3 && value < 1e6) return (value / 1e3).toFixed(to) + 'K';
  else if (value >= 1e6 && value < 1e9) return (value / 1e6).toFixed(to) + 'M';
  else if (value >= 1e9 && value < 1e12) return (value / 1e9).toFixed(to) + 'G';
  else if (value >= 1e12 && value < 1e15) return (value / 1e12).toFixed(to) + 'T';
  else if (value >= 1e15 && value < 1e18) return (value / 1e15).toFixed(to) + 'P';
  else return value.toString(); // 값을 그대로 반환
}


export default XAxis