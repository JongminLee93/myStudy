import * as d3 from 'd3';
import { Feature, FeatureCollection } from 'geojson';
import { useEffect, useRef } from 'react';
import { addTooltip } from './Tooltip';

interface Data {
  name: string;
  value: number;
}

interface Props {
  projection: d3.GeoProjection;
  geoJson: FeatureCollection;
  colorScale: d3.ScaleLinear<string, string, never>;
  width?: number;
  height?: number;
  data: Data[];
  year: number;
  pollutant: string;
  zoomed: boolean;
  setFeature: (f: Feature | undefined) => void;
}

const SouthEasternMap = ({
  projection,
  geoJson,
  colorScale,
  width,
  height,
  data: capss,
  year,
  pollutant,
  zoomed,
  setFeature,
}: Props) => {
  const gRef = useRef(null);

  const pathGenerator = d3.geoPath().projection(projection);

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

    g.select('g.map').selectChildren().remove();

    g.select('g.map')
      .selectAll('path')
      .data(geoJson.features)
      .join('path')
        .on('mousemove', (e,d) => {
          const sido = d.properties?.SIG_KOR_NM.split('_')[0];
          const sigungu = d.properties?.SIG_KOR_NM.split('_')[1];
          const region = sigungu || sido;

          const value = capss.find(({ name }) => name === region)?.value;
          const text = `<strong>${region}</strong> <br /> ${pollutant} 배출량 : ${value?.toFixed(2)} ton`;

          tooltip.show(text, e.offsetX, e.offsetY);

          d3.select(e.target).style('filter', 'drop-shadow(0px 0px 3px rgba(0, 0, 0, .7))');
        })
        .on('mouseout', (e,d) => {
          tooltip.hide();
          d3.select(e.target).style('filter', null);
        })
        .on('click', (e,d) => {
          tooltip.hide();
          handleClick(e,d);
        })
        .transition()
        .duration(1200)
        .attr('fill', (d) => {
          const sido = d.properties?.SIG_KOR_NM.split('_')[0];
          const sigungu = d.properties?.SIG_KOR_NM.split('_')[1];
          const region = sigungu || sido

          const value = capss.find(({ name }) => name === region)?.value;
          return colorScale(value || 0);
        })
        .attr('stroke', 'black')
        .attr('d', (f) => pathGenerator(f))
        .style('cursor', 'pointer');

  }, [capss, geoJson, zoomed])

  return (
    <g ref={gRef}>
      <g className='map'></g>
    </g>
  )
}

export default SouthEasternMap
