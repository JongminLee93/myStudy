import * as d3 from 'd3';

import { useMemo } from 'react';
import { useChartDimensions } from '../component/hook/useChartDimensions';

import StackedBarChart from './StackedBarChart2';

interface Data {
  name: string;
  source: string;
  value: number;
}

type Source =
  "에너지산업 연소" |
  "비산업 연소" |
  "제조업 연소" |
  "생산공정" |
  "에너지수송 및 저장" |
  "유기용제 사용" |
  "도로이동오염원" |
  "비도로이동오염원" |
  "폐기물처리" |
  "농업" |
  "기타 면오염원" |
  "비산먼지" |
  "생물성 연소"


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
  source?: Source;
}

const StackedBarChartContainer = (props: Props) => {
  const { width, height, marginLeft, marginRight, marginTop, marginBottom } = props
  const { data, source } = props

  const [ref, dms] = useChartDimensions({
    width,
    height,
    marginLeft,
    marginRight,
    marginTop,
    marginBottom
  });

  const regions = useMemo(() => Array.from(new Set(data?.map(d => d.name).sort())) ?? [], [data]);
  const sources = useMemo(() => Array.from(new Set(data?.map(d => d.source).sort())) ?? [], [data]);

  const regionalData = regions?.map(name => {
    const value = data?.filter(d => d.name === name).reduce((acc, { value }) => acc + value, 0);

    return { name, value }
  })

  const xScale = useMemo(() => (
    d3.scaleLinear()
      .domain([0, d3.max(regionalData, d => d.value) ?? 0])
      .rangeRound([0, dms.boundedWidth])
      .nice()
  ), [data, dms.boundedWidth])

  const yScale = useMemo(() => (
    d3.scaleBand()
      .domain(regions)
      .range([0, dms.boundedHeight])
      .padding(0.3)
  ), [data, dms.boundedHeight])

  const colors = useMemo(() => (
    d3.scaleOrdinal()
      .domain(sources)
      .range(d3.range(sources.length).map(
        d3.scaleSequential()
          .domain([0, sources.length - 1])
          .interpolator(d3.interpolateRdYlBu)
      ))
      .unknown('#ccc')
  ), [sources])

  return (
    <div
      className='Chart_wrapper'
      ref={ref}
      style={{
        width,
        height,
        // position: 'relative',
        outline: 'solid',
      }}
    >
      <StackedBarChart data={data} dimension={dms} selectedSource={source} />
    </div>
  )
}

export default StackedBarChartContainer