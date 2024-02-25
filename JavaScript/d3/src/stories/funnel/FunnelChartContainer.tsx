
import FunnelChart from '@/stories/funnel/FunnelChart';
import { useChartDimensions } from '../component/hook/useChartDimensions';

type Region = '부산광역시' | '울산광역시' | '대구광역시' | '경상남도' | '경상북도'

interface Props {
  width?: number;
  height?: number;
  marginLeft?: number;
  marginRight?: number;
  marginTop?: number;
  marginBottom?: number;
  xAxisLabel?: string;
  data?: Record<string, string | number>[];
  sido?: Region;
}

const FunnelChartContainer = (props: Props) => {
  const { width, height, marginLeft, marginRight, marginTop, marginBottom } = props
  const { data, sido } = props

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
        outline: 'solid',
      }}
    >
      <FunnelChart
        data={data?.filter(d => d.sido === sido ?? true)}
        y={'year'}
        x={'value'}
        dimension={dms}
      />
    </div>
  )
}

export default FunnelChartContainer