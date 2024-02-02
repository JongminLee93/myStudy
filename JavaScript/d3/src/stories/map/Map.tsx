'use client'

import * as d3 from 'd3'
import { FeatureCollection } from 'geojson'
import { useRef } from 'react'

interface MapProps {
  width?: number,
  height?: number,
  defaultScale?: number,
  defaultCenter?: [number, number],
  data: FeatureCollection
  backgroundData?: FeatureCollection
}

const Map = ({
  width=800,
  height=800,
  defaultScale=100,
  defaultCenter=[0, 0],
  data,
  backgroundData,
  ...props
}: MapProps) => {
  const svgRef = useRef(null);

  const projection = d3
    .geoMercator()
    .scale(defaultScale)
    .center(defaultCenter)

  const geoPathGenerator = d3
    .geoPath()
    .projection(projection);

  const allSvgPaths = data.features.map((f) => (
    <path
      key={f.properties?.SIG_CD}
      d={geoPathGenerator(f) as any}
      stroke='white'
      fill='gray'
    />
  ))

  const backgroundPaths = backgroundData?.features.map((f) => (
    <path
      key={f.properties?.SIG_CD}
      d={geoPathGenerator(f) as any}
      stroke='black'
      fill='none'
    />
  ))

  const svg = d3.select(svgRef.current)

  const g = svg.enter().select('g');

  const zoomed = ({ transform }: { transform: d3.ZoomTransform }) => {
    g.attr('transform', d => `translate(${transform.apply(d as [number, number])})`);
  }

  const zoom = d3
    .zoom()
    .extent([[0,0], [width, height]])
    .scaleExtent([1, 8])
    .on('zoom', zoomed);


  svg.call(zoom as any);

  console.log(svg);

  return (
    <div {...props}>
      <svg ref={svgRef} width={width} height={height} style={{ outline: 'solid' }}>
        <g>
          {
            backgroundPaths
          }
          {
            allSvgPaths
          }
        </g>
      </svg>
    </div>
  )
  

}

export default Map