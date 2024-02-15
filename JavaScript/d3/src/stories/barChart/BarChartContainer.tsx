import { useChartDimensions } from '../component/hook/useChartDimensions';

import BarChart from './BarChart';

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
  year?: number;
}

const BarChartContainer = (props: Props) => {
  const { width, height, marginLeft, marginRight, marginTop, marginBottom } = props
  const { data } = props

  const [ref, dms] = useChartDimensions({
    width,
    height,
    marginLeft,
    marginRight,
    marginTop,
    marginBottom
  });

  return (
    <div
      className='Chart_wrapper'
      ref={ref}
      style={{
        width,
        height,
        position: 'relative',
        background: '#f0f0f0',
      }}
    >
      <BarChart data={data} dimension={dms} />
    </div>
  )

}

export default BarChartContainer