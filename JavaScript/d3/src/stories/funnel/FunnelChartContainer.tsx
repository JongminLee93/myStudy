
import FunnelChart from '@/stories/funnel/FunnelChart';
import { useChartDimensions } from '../component/hook/useChartDimensions';

type Region = '부산광역시' | '울산광역시' | '대구광역시' | '경상남도' | '경상북도'
type Pollutant =  'CO' | 'NOx' | 'SOx' | 'TSP' | 'PM10' | 'PM2P5' | 'VOC' | 'NH3' | 'BC';

interface Props {
  width?: number;
  height?: number;
  marginLeft?: number;
  marginRight?: number;
  marginTop?: number;
  marginBottom?: number;
  xAxisLabel?: string;
  sido?: Region;
  pollutant?: Pollutant;
  data?: Record<string, string | number>[];
}

const FunnelChartContainer = (props: Props) => {
  const { width, height, marginLeft, marginRight, marginTop, marginBottom } = props
  const { data, sido, pollutant } = props

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
        x={pollutant}
        dimension={dms}
      />
    </div>
  )
}

export default FunnelChartContainer