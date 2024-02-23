
import FunnelChart from '@/stories/funnel/FunnelChart';
import { useChartDimensions } from '../component/hook/useChartDimensions';

interface Data {
  year: string;
  sido: Region;
  sigungu: string;
  source_main: string;
  value: number;
}

type Region = '부산광역시' | '울산광역시' | '대구광역시' | '경상남도' | '경상북도'

interface Props {
  width?: number;
  height?: number;
  marginLeft?: number;
  marginRight?: number;
  marginTop?: number;
  marginBottom?: number;
  xAxisLabel?: string;
  data?: Data[];
  sido: Region;
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
        data={refineData(data, sido)}
        dimension={dms}
      />
    </div>
  )
}

const refineData = (data: any, sido: Region): Data[] | undefined => {
  return data.filter(d => d.sido === sido).reduce((acc, { year, value }) => {
    if (!acc.some(d => d.year === year))
      acc.push({ year, value: 0 });

    acc.find(d => d.year === year).value += value;

    return acc
  }, [] as Array<Data>)
}

export default FunnelChartContainer