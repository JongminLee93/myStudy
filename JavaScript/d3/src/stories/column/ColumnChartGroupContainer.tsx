
import ColumnChartGroup from '@/stories/column/ColumnChartGroup';
import { useChartDimensions } from '../component/hook/useChartDimensions';

type Region = '부산광역시' | '울산광역시' | '대구광역시' | '경상남도' | '경상북도';
type Pollutant =  'CO' | 'NOx' | 'SOx' | 'TSP' | 'PM10' | 'PM2P5' | 'VOC' | 'NH3' | 'BC';
type Source =  "기타 면오염원" | "농업" | "도로이동오염원" | "비도로이동오염원" | "비산먼지" | "비산업 연소" | "생물성 연소" | "생산공정" | "에너지산업 연소" | "에너지수송 및 저장" | "유기용제 사용" | "제조업 연소" | "폐기물처리";

interface Props {
  width?: number;
  height?: number;
  marginLeft?: number;
  marginRight?: number;
  marginTop?: number;
  marginBottom?: number;
  sido?: Region;
  pollutant?: Pollutant;
  sources?: Source[];
  xAxisLabel?: string;
  data?: Record<string, string | number>[];
}

const ColumnChartGroupContainer = (props: Props) => {
  const { width, height, marginLeft, marginRight, marginTop, marginBottom } = props
  const { data, sido, pollutant='PM10', sources } = props

  const filteredData = data?.filter(d => d.sido === sido);

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
      <ColumnChartGroup
        data={filteredData}
        group='year'
        y={pollutant}
        x='source_main'
        xOnly={sources}
        title={`${sido} 배출원별 연간 ${pollutant} 배출량 (2016-2020)`}
        dimension={dms}
      />
    </div>
  )
}

export default ColumnChartGroupContainer