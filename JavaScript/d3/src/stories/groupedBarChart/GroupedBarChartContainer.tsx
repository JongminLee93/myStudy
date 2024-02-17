import { useChartDimensions } from '../component/hook/useChartDimensions';

import GroupedBarChart from './GroupedBarChart';

interface Data {
  name: string;
  source: string;
  value: number;
}

interface Props {
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

const GroupedBarChartContainer = (props: Props) => {
  const { width, height, marginLeft, marginRight, marginTop, marginBottom } = props
  const { data } = props

  // console.log(refineData(data, 'PM10'));

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
      <GroupedBarChart data={refineData(data, 'PM10')} dimension={dms} />
    </div>
  )
}

const refineData = (data: any, pollutant: string): Data[] | undefined => {
  if (data === undefined)
    return undefined

  let refinedData = data.reduce((acc: any[], item: any) => {
    const { sido, sigungu, source_main, key, ...rest } = item;
    const value = rest[pollutant];

    if (sigungu) {
      if (!acc.some(i => i.name === sigungu && i.source === source_main)) {
        acc.push({
          name: sigungu,
          source: source_main,
          value: 0,
        })
      }

      acc.find(i => i.name === sigungu)['value'] += value;

      return acc;
    }

    if (!acc.some(i => i.name === sido && i.source === source_main)) {
      acc.push({
        name: sido,
        source: source_main,
        value: 0,
      })
    }

    acc.find(i => i.name === sido)['value'] += value;

    return acc;

  }, [])

  return refinedData.sort(((a: any, b: any) => a.name > b.name ? 1 : a.name < b.name ? -1 : 0))
}


export default GroupedBarChartContainer