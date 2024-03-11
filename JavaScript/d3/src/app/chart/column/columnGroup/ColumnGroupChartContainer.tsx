import { ColumnGroupChart } from '@/app/chart/column/columnGroup';
import { groupSum, melt, meltAndGroupSum } from '@/app/chart/util';
import { useChartDimensions } from '@/app/chart/util/hook/useChartDimensions';

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
  x?: 'sido' | 'source_main';
  xAxisLabel?: string;
  // data?: Record<string, string | number>[];
}

const data = require('/public/data/capss/searchResult.json');

export const ColumnGroupChartContainer = ({
  width,
  height,
  marginLeft,
  marginRight,
  marginTop,
  marginBottom,
  // data,
  x='sido',
}: Props) => {
  const [ref, dms] = useChartDimensions({
    width,
    height,
    marginLeft,
    marginRight,
    marginTop,
    marginBottom
  });

  const updatedData = meltAndGroupSum(data, ['sido', 'sigungu'], ['CO', 'NOx', 'SOx', 'TSP', 'PM10', 'PM2P5', 'VOC', 'NH3', 'BC'], 'pollutant') //.sort(d => ['PM10', 'PM2P5', 'BC'].includes(d['pollutant']) ? 1 : -1);

  // console.log(updatedData.sort((a, b) => a.source_main > b.source_main ? 1 : -1));

  return (
    <div
      ref={ref}
      style={{
        width,
        height,
        outline: 'solid',
      }}
    >
      <ColumnGroupChart
        data={updatedData}
        x='sigungu'
        y='value'
        group='pollutant'
        dimension={dms}
      />
    </div>
  )
}
