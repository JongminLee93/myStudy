'use client'

import * as d3 from 'd3';
import { Feature, FeatureCollection } from 'geojson';
import { useEffect, useRef, useState } from 'react';
//@ts-ignore
import rewind from '@turf/rewind';
import DetailedMap from './DetailedMap';
import Legend from './Legend';
import useSWR from 'swr';
import qs from 'qs';

const fetcher = async (
  path: string,
  urlParamsObject?: Record<string, string>,
  options?: RequestInit
) => {
  return await fetch(`${path}${urlParamsObject ? `?${qs.stringify(urlParamsObject)}` : ''}`, options)
}

const refineData = (data: any, pollutant: string) => {
  if (!data)
    return undefined

  let refinedData = data.reduce((acc: any, item: any) => {
    const { sido, source_main, key, ...rest } = item;

    if (!acc[sido]) {
      acc[sido] = {};
      acc[sido]['key'] = sido;
      acc[sido]['value'] = 0
    }

    Object.keys(rest).forEach((p) => {
      if (p === pollutant)
        acc[sido]['value'] += rest[p];
    })

    return acc;
  }, {})

  return refinedData
}

const findMax = (data: any) => {
  if (!data)
    return 0

  const max = Object.values(data).reduce((max: number, item: any) => {
    const value = item.value
    return max - value > 0 ? max : value
  }, 0)

  return max
}

interface MapProps {
  width?: number,
  height?: number,
  data: FeatureCollection
  backgroundData?: FeatureCollection
  year: number
  pollutant: string
}

const Map = ({
  width=800,
  height=800,
  data,
  backgroundData,
  year=2020,
  pollutant='PM10',
  ...props
}: MapProps) => {
  const svgRef = useRef(null);
  const wrapperRef = useRef(null);
  const [currentFeature, setCurrentFeature] = useState<Feature>();
  const [detailFeatures, setDetailFeatures] = useState<FeatureCollection>();

  const { data: capss } = useSWR([`http://localhost/api/emissions/${year}`], ([url]) => fetcher(url).then(res => res.json()));

  const refinedData = refineData(capss, pollutant);

  const projection = d3
    .geoMercator()
    .fitExtent([[20, 20], [width-20, height-20]], currentFeature || data)

  const geoPathGenerator = d3
    .geoPath()
    .projection(projection);

  useEffect(() => {
    const svg = d3.select(svgRef.current);

    const minProps = 0
    const maxProps = findMax(refinedData);
    const colorScale = d3.scaleLinear([minProps, maxProps], ['white', 'red']).nice();

    svg.select('g.map')
      .selectAll('g path.sido')
      .data(data.features)
      .join('path')
        .on('click', (_,f) => setCurrentFeature(currentFeature ? undefined : f))
        .transition()
        .duration(1200)
        .attr('class', 'sido')
        .attr('d', (f) => geoPathGenerator(f))
        .attr('fill', (f) => {
          const value = refinedData && refinedData[f.properties?.SIG_KOR_NM]['value'];
          return currentFeature ? 'transparent' : colorScale(value);
        })
        .attr('stroke', 'black')
        .style('cursor', 'pointer')

    if (currentFeature) {
      setDetailFeatures(undefined);
      const sigunguJson = rewind(require(`/public/data/newMap/${currentFeature.properties?.SIG_ENG_NM}.json`), { reverse: true });

      svg.select('g.scalebar')
        .selectChild()
        .remove();

      svg.select('g.scalebar')
        .attr("transform", `translate(${width * 2 / 3},${height * 9 / 10})`)
        .append(() => Legend(colorScale, { title: `${currentFeature? currentFeature.properties?.SIG_KOR_NM : '동남권'} - ${year}년 ${pollutant} 배출량 (ton)`, width: width/4 }))

      setDetailFeatures(sigunguJson);
    }

    if (!currentFeature) {

      svg.select('g.scalebar')
        .selectChild()
        .remove();

      svg.select('g.scalebar')
        .attr("transform", `translate(${width * 2 / 3},${height * 9 / 10})`)
        .append(() => Legend(colorScale, { title: `동남권 - ${year}년 ${pollutant} 배출량 (ton)`, width: width/4 }))

      setDetailFeatures(undefined);
    }
  }, [currentFeature])

  const handleClick = () => {
    setCurrentFeature(undefined);
  }

  return (
    <div ref={wrapperRef} {...props}>
      <svg ref={svgRef} width={width} height={height} style={{ outline: 'solid' }}>
        <g className='map'></g>
        { detailFeatures && <DetailedMap data={detailFeatures} onClick={handleClick} /> }
        <g className='scalebar'></g>
      </svg>
    </div>
  )
}

export default Map