import * as d3 from 'd3';
import { ReactNode, useMemo } from 'react';
import XAxis from './XAxis';
import { useChartDimensions } from './hook/useChartDimensions';

type Data = {
  name: string;
  value: number;
}

type Props = {
  width?: number;
  height?: number;
  marginLeft?: number;
  marginRight?: number;
  marginTop?: number;
  marginBottom?: number;
  xAxisLabel?: string;
  data?: Data[];
  children?: ReactNode;
}

const ChartContainer = (props: Props) => {
  const { width, height, marginLeft, marginRight, marginTop, marginBottom } = props

  const [ref, dms] = useChartDimensions({
    width,
    height,
    marginLeft,
    marginRight,
    marginTop,
    marginBottom
  });

  const xScale = useMemo(() => (
    d3.scaleLinear()
      .domain([0, d3.max(props?.data || [], d => d.value) || 100])
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
          {props.children}
          <g transform={`translate(0,${dms.boundedHeight})`}>
            <XAxis
              xScale={xScale}
              label={props.xAxisLabel}
              dimension={dms}
            />
          </g>
        </g>
      </svg>
    </div>
  )

}

export default ChartContainer