import * as d3 from 'd3';
import { Feature, FeatureCollection } from 'geojson';
import { useRef, useState } from 'react';
import BackgroundMap from './BackgroundMap';
//@ts-ignore
import rewind from '@turf/rewind';
import DetailMap from './DetailMap';
import SouthEasternMap from './SouthEasternMap';

interface MapProps {
  width?: number,
  height?: number,
  mapMarginLeft?: number,
  mapMarginRight?: number,
  mapMarginTop?: number,
  mapMarginBottom?: number,
  year: number
  pollutant: string
}

const backgroundData = rewind(require('/public/data/newMap/SouthKorea.json'), { reverse: true }) as FeatureCollection;
const seData = rewind(require('/public/data/newMap/SouthEastern.json'), { reverse: true }) as FeatureCollection;

const MapContainer = ({
  width=800,
  height=800,
  mapMarginLeft=0,
  mapMarginRight=0,
  mapMarginTop=0,
  mapMarginBottom=0,
  year=2020,
  pollutant='PM10',
  ...props
}: MapProps) => {
  const wrapperRef = useRef(null);
  const svgRef = useRef(null);

  const [currentFeature, setCurrentFeature] = useState<Feature>();

  const projection = d3
    .geoMercator()
    .fitExtent([[0+mapMarginLeft,0+mapMarginTop], [width-mapMarginRight,height-mapMarginBottom]], currentFeature || seData)

  const setFeature = (f: Feature | undefined) => {
    setCurrentFeature(f);
  }

  return (
    <div ref={wrapperRef} {...props}>
      <svg ref={svgRef} width={width} height={height}>
        <BackgroundMap
          projection={projection}
          geoJson={backgroundData}
        />
        <SouthEasternMap
          projection={projection}
          geoJson={seData}
          width={width}
          height={height}
          year={year}
          pollutant={pollutant}
          zoomed={currentFeature ? true : false}
          setFeature={setFeature}
        />
        {currentFeature &&
          <DetailMap
            projection={projection}
            width={width}
            height={height}
            year={year}
            pollutant={pollutant}
            feature={currentFeature}
            setFeature={setFeature}
          />
        }
      </svg>
    </div>
  )
}

export default MapContainer