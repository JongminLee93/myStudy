import * as d3 from 'd3';
import { Feature, FeatureCollection } from 'geojson';
import { useEffect, useRef } from 'react';
import useSWR from 'swr';
import { fetcher } from '../util/fetchAPI';
import Legend from './Legend';
import { addTooltip } from './Tooltip';

interface Props {
  projection: d3.GeoProjection
  geoJson: FeatureCollection
  width: number
  height: number
  year: number
  pollutant: string
  zoomed: boolean
  setFeature: (f: Feature | undefined) => void
}

const SouthEasternMap = ({
  projection,
  geoJson,
  width,
  height,
  year,
  pollutant,
  zoomed,
  setFeature,
}: Props) => {
  const gRef = useRef(null);

  const { data, isLoading } = useSWR([`http://localhost/api/emissions/${year}`], ([url]) => 
    fetcher(url)
      .then(res => res.json())
  );
  const capss = refineData(data, pollutant);

  const pathGenerator = d3.geoPath().projection(projection);

  const minProps = 0
  const maxProps = findMax(capss);
  const colorScale = d3.scaleLinear([minProps,maxProps], ['white','red']).nice();

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

  const handleClick = (e: any, f: Feature) => {
    if (zoomed) {
      setFeature(undefined);
    } else {
      setFeature(f);
    }
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
          const text = `<strong>${region}</strong> <br /> ${pollutant} 배출량 : ${capss[region].value.toFixed(2)} ton`;
          if (!zoomed) {
            tooltip.show(text, e.offsetX, e.offsetY);
            handleMousemove(e, d);
          }
        })
        .on('mouseout', (e,d) => {
          tooltip.hide();
          handleMouseout(e,d);
        })
        .on('click', (e,d) => {
          tooltip.hide();
          handleClick(e,d)
        })
        .transition()
        .duration(1200)
        .attr('fill', (f) => {
          const value = capss && capss[f.properties?.SIG_KOR_NM]['value'];
          return zoomed? '#eee' : colorScale(value);
        })
        .attr('stroke', 'black')
        .attr('d', (f) => pathGenerator(f))
        .style('cursor', zoomed ? 'auto' : 'pointer');


    g.select('g.scale').selectChild().remove()

    if (!zoomed)
      g.select('g.scale')
        .append(() => Legend(colorScale, { title: `동남권 - ${year}년 ${pollutant} 배출량 (ton)`, width: Math.max(width/2, 200), left: width, top: height, marginRight: 20 }));
  }, [capss, zoomed])

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
      <g className='map'></g>
      <g className='scale'></g>
    </g>
  )
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

export default SouthEasternMap
