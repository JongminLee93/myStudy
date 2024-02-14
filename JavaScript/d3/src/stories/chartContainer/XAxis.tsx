import { useMemo } from 'react'
import * as d3 from 'd3';

type Props = {
  domain: number[];
  range: number[];
  label?: string;
  labelOffset?: number;
}

const XAxis = ({
  domain=[0, 100],
  range=[10, 290],
  label='x',
  labelOffset=25,
}: Props) => {
  const ticks = useMemo(() => {
    const xScale = d3.scaleLinear()
      .domain(domain)
      .range(range)
      .nice()

    const width = range[1] - range[0]
    const pixelsPerTick = 60
    const numberOfTicksTarget = Math.max(
      1,
      Math.floor(
        width / pixelsPerTick
      )
    )

    return xScale.ticks(numberOfTicksTarget)
      .map(value => ({
        value,
        xOffset: xScale(value)
      }))
  }, [
    domain.join("-"),
    range.join("-")
  ])

  return (
    <svg
      overflow='visible'
    >
      <path
        d={[
          "M", range[0], 6,
          "v", -6,
          "H", range[1],
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
          <line
            y2="6"
            stroke="currentColor"
          />
          <text
            key={value}
            style={{
              fontSize: "10px",
              textAnchor: "middle",
              transform: "translateY(20px)"
            }}>
            { toSIUnit(value) }
          </text>
        </g>
      ))}
      <text
        fontSize={11}
        fontWeight='bold'
        textAnchor='middle'
        alignmentBaseline='hanging'
        transform={`translate(${[(range[1]-range[0])/2,labelOffset].join(',')})`}
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