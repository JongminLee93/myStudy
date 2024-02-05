'use client'

import * as d3 from 'd3'
import { FeatureCollection } from 'geojson'
import { useEffect, useRef } from 'react'

interface MapProps {
  width?: number,
  height?: number,
  data: FeatureCollection
  onClick: () => void
}

const DetailedMap = ({
  width=800,
  height=800,
  data,
  onClick,
  ...props
}: MapProps) => {
  const svgRef = useRef(null);

  const projection = d3
    .geoMercator()
    .fitExtent([[20, 20], [width-20, height-20]], data)

  const geoPathGenerator = d3
    .geoPath()
    .projection(projection);

  useEffect(() => {

    const svg = d3.select(svgRef.current);

    svg.select('g')
      .selectAll('g path.sigungu')
      .data(data.features)
      .join('path')
        .on('click', onClick)
        .transition()
        .delay(1200)
        .attr('class', 'sigungu')
        .attr('d', (f) => geoPathGenerator(f))
        .attr('fill', 'grey')
        .attr('stroke', 'black')

  }, [])

  return (
    <svg ref={svgRef} width={width} height={height}>
      <g>

      </g>
    </svg>
  )
}

export default DetailedMap