import * as d3 from 'd3';

type Props = {
  yScale: d3.ScaleBand<string>;
  tickOffset?: number;
  dimension: any;
}

const YAxis = ({
  yScale,
  tickOffset=7,
  dimension,
}: Props) => {
  return (
    <svg>
      {
        yScale.domain().map(name => {
          const y = yScale(name);

          if (!y) return null;

          return (
            <g
              key={name}
              transform={`translate(${[dimension.marginLeft, y+yScale.bandwidth()/2].join(',')})`}
            >
              <text
                x={-tickOffset}
                textAnchor='end'
                alignmentBaseline='central'
                fontSize={12}
              >
                {name}
              </text>
            </g>
        )})
      }
    </svg>
  )
}

export default YAxis