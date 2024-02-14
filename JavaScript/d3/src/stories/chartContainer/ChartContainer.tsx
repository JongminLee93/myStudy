import { ReactNode, useMemo } from 'react';
import { useChartDimensions } from './useChartDimensions';
import * as d3 from 'd3';
import XAxis from './XAxis';

type Props = {
  width?: number;
  height?: number;
  marginLeft?: number;
  marginRight?: number;
  marginTop?: number;
  marginBottom?: number;
  children?: ReactNode;
}

const ChartContainer = (props: Props) => {
  const [ref, dms] = useChartDimensions({
    ...props
  });

  const xScale = useMemo(() => (
    d3.scaleLinear()
      .domain([0, 32535])
      .range([0, dms.boundedWidth])
  ), [dms.boundedWidth])

  return (
    <div
      className='Chart_wrapper'
      ref={ref}
      style={{
        width: props.width,
        height: props.height,
        background: 'gray'
      }}
    >
      <svg
        width={dms.width}
        height={dms.height}
        viewBox={`${[0,0,dms.width,dms.height].join(',')}`}
      >
        <g transform={`translate(${dms.marginLeft},${dms.marginTop})`}>
          <rect
            width={dms.boundedWidth}
            height={dms.boundedHeight}
            fill='lavender'
          >
          </rect>
          <text
            fontSize={15}
            textAnchor='middle'
            alignmentBaseline='central'
            transform={`translate(${[dms.boundedWidth/2,dms.boundedHeight/2].join(',')})`}
          >
            chart area
          </text>
          <g transform={`translate(0,${dms.boundedHeight})`}>
            <XAxis
              domain={xScale.domain()}
              range={xScale.range()}
              label='연간 배출량 (ton)'
            />
          </g>
        </g>
      </svg>
    </div>
  )

}

export default ChartContainer