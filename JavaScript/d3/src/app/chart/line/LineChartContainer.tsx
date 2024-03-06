
import { LineChart } from '@/app/chart/line';
import { useChartDimensions } from '@/app/chart/util/hook/useChartDimensions';
import * as d3 from 'd3';

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
  xAxisLabel?: string;
  pollutant?: Pollutant;
  data?: Record<string, string | number>[];
}

export const LineChartContainer = ({
  width,
  height,
  marginLeft,
  marginRight,
  marginTop,
  marginBottom,
  xAxisLabel,
  pollutant,
  data,
}: Props) => {
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
      ref={ref}
      style={{
        width,
        height,
        outline: 'solid',
      }}
    >
      <LineChart
        data={data}
        x='year'
        y='value'
        color='pollutant'
        dimension={dms}
      />
    </div>
  )
}
