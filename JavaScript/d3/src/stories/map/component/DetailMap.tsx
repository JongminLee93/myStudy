import { fetcher } from '../util/fetchAPI';
import * as d3 from 'd3';
import { Feature, FeatureCollection } from 'geojson';
import { useEffect, useRef } from 'react';
import useSWR from 'swr';
//@ts-ignore
import rewind from '@turf/rewind'
import Legend from './Legend';
import { addTooltip } from './Tooltip';

const DetailMap = ({
  projection,
  width,
  height,
  year,
  pollutant,
  feature,
  setFeature,
}: {
  projection: d3.GeoProjection
  width: number
  height: number
  year: number
  pollutant: string
  feature: Feature
  setFeature: (f: Feature | undefined) => void
}) => {
  const gRef = useRef(null);

  const geoJson = rewind(require(`/public/data/newMap/${feature.properties?.SIG_ENG_NM}.json`), { reverse: true }) as FeatureCollection;

  const { data, isLoading } = useSWR([`http://localhost/api/emissions/${year}/${feature.properties?.SIG_KOR_NM}`], ([url]) => (
    fetcher(url)
      .then(res => res.json())
  ));

  const capss = refineData(data, pollutant);

  const pathGenerator = d3.geoPath().projection(projection);

  const minProps = 0
  const maxProps = findMax(capss);
  const colorScale = d3.scaleLinear([minProps, maxProps], ['white', 'blue']).nice();

  const handleMousemove = (e: any, f: Feature) => {
    const path = d3.select(e.target);

    path.attr('opacity', '0.8')
      .style('filter', 'drop-shadow(0px 0px 3px rgba(0, 0, 0, .7))')
  }

  const handleMouseout = (e: any, f: Feature) => {
    const path = d3.select(e.target);

    path.attr('opacity', null)
      .style('filter', null);
  }

  const handleClick = () => {
    setFeature(undefined);
  }

  useEffect(() => {
    const g = d3.select(gRef.current);

    const tooltip = addTooltip(g);

    g.select('g.map')
      .selectAll('path')
      .data(geoJson.features)
      .join('path')
        .on('mousemove', (e,d) => {
          const region = d.properties?.SIG_KOR_NM;
          const text = `<strong>${region.replace('_', ' ')}</strong> <br /> ${pollutant} 배출량 : ${capss[region].value.toFixed(2)} ton`;
          tooltip.show(text, e.offsetX, e.offsetY);
          handleMousemove(e, d);
        })
        .on('mouseout', (e,d) => {
          tooltip.hide();
          handleMouseout(e,d);
        })
        .on('dblclick', handleClick)
        .transition()
        .delay(1200)
        .attr('fill', (f) => {
          const value = capss && capss[f.properties?.SIG_KOR_NM]['value'];
          return colorScale(value);
        })
        .attr('stroke', 'black')
        .attr('d', (f) => pathGenerator(f))
        .style('cursor', 'pointer');

    g.select('g.scale').selectChild().remove();

    g.select('g.scale')
      .append(() => Legend(colorScale, { title: `${feature.properties?.SIG_KOR_NM} - ${year}년 ${pollutant} 배출량 (ton)`, width: Math.max(width/2, 200), left: width, top: height, marginRight: 20 }));

  }, [capss, projection])

  if (isLoading) {
    return (
      <g>
        <text>
          loading
        </text>
      </g>
    )
  }

  return (
    <g ref={gRef}>
      <g></g>
      <g className='map'></g>
      <g className='scale'></g>
    </g>
  )
}

const refineData = (data: any, pollutant: string) => {
  if (!data)
    return undefined

  let refinedData = data.reduce((acc: any, item: any) => {
    const { sido, sigungu, source_main, key, ...rest } = item;

    const region = `${sido}_${sigungu}`

    if (!acc[region]) {
      acc[region] = {};
      acc[region]['key'] = region;
      acc[region]['value'] = 0
    }

    Object.keys(rest).forEach((p) => {
      if (p === pollutant)
        acc[region]['value'] += rest[p];
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

export default DetailMap
