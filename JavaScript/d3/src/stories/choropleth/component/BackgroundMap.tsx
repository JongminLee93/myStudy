import * as d3 from 'd3';
import { FeatureCollection } from 'geojson';
import { useEffect, useRef } from 'react';

const BackgroundMap = ({
  projection,
  geoJson,
}: {
  projection: d3.GeoProjection;
  geoJson: FeatureCollection;
}) => {
  const gRef = useRef(null);

  const pathGenerator = d3.geoPath().projection(projection);

  useEffect(() => {
    const g = d3.select(gRef.current);

    g.selectAll('path')
      .data(geoJson.features)
      .join('path')
        .transition()
        .duration(1200)
        .attr('fill', '#eee')
        .attr('stroke', 'black')
        .attr('d', (f) => pathGenerator(f))

  }, [projection])

  return (
    <g className='background' ref={gRef}></g>
  )
}

export default BackgroundMap