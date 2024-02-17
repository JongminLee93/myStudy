import * as d3 from 'd3';
import { Feature, FeatureCollection } from 'geojson';
import { useEffect, useMemo, useRef, useState } from 'react';
import BackgroundMap from './BackgroundMap';
import rewind from '@turf/rewind';
import Legend from './Legend';
import SouthEasternMap from './SouthEasternMap';

interface Data {
  name: string;
  value: number;
}

interface MapProps {
  width?: number,
  height?: number,
  mapMarginLeft?: number,
  mapMarginRight?: number,
  mapMarginTop?: number,
  mapMarginBottom?: number,
  year: number;
  pollutant: string;
}

const backgroundData = rewind(require('/public/data/newMap/SouthKorea.json'), { reverse: true }) as FeatureCollection;

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

  const setFeature = (f: Feature | undefined) => {
    setCurrentFeature(f);
  }

  const geoJson = useMemo(() => {
    return rewind(require(`/public/data/newMap/${currentFeature?.properties?.SIG_ENG_NM || 'SouthEastern'}.json`), { reverse: true }) as FeatureCollection;
  }, [currentFeature])

  const data = useMemo(() => {
    return require(`/public/data/capss/${currentFeature?.properties?.SIG_ENG_NM || 'southEastern'}.json`) as Data[];
  }, [currentFeature])

  const colorScale = useMemo(() => {
    return d3.scaleLinear([0, d3.max(data || [], d => d.value) || 100], ['#fff', '#04018a']).nice();
  }, [currentFeature])

  useEffect(() => {
    d3.select('g.colorScale').selectChild().remove();

    d3.select('g.colorScale')
      .append(() => Legend(colorScale, { title: `${currentFeature?.properties?.SIG_KOR_NM||'동남권'} - ${year}년 ${pollutant} 배출량 (ton)`, width: Math.max(width/2, 200), left: width, top: height, marginRight: 20 }))
  }, [currentFeature])

  const projection = d3
    .geoMercator()
    .fitExtent([[0+mapMarginLeft,0+mapMarginTop], [width-mapMarginRight,height-mapMarginBottom]], geoJson);

  return (
    <div ref={wrapperRef} {...props} style={{ position: 'relative' }}>
      <svg id='map' ref={svgRef} width={width} height={height}>
        <BackgroundMap
          projection={projection}
          geoJson={backgroundData}
        />
          <SouthEasternMap
            projection={projection}
            geoJson={geoJson}
            data={data}
            colorScale={colorScale}
            year={year}
            pollutant={pollutant}
            zoomed={currentFeature ? true : false}
            setFeature={setFeature}
          />
                {/* {currentFeature &&
          <DetailMap
            projection={projection}
            width={width}
            height={height}
            year={year}
            pollutant={pollutant}
            feature={currentFeature}
            setFeature={setFeature}
          />
        } */}
        <g className='colorScale'></g>
        <g className='tooltip'></g>
      </svg>
    </div>
  )
}

export default MapContainer