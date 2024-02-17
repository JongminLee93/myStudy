import { MutableRefObject, useEffect, useRef, useState } from 'react';
import { ResizeObserver } from '@juggle/resize-observer';

interface DimensionConfig {
  width?: number;
  height?: number;
  marginLeft?: number;
  marginRight?: number;
  marginTop?: number;
  marginBottom?: number;
}

interface Dimesion {
  boundedWidth: number;
  boundedHeight: number;
  marginLeft: number;
  marginRight: number;
  marginTop: number;
  marginBottom: number;
  width?: number;
  height?: number;
}

const combineChartDimensions = (dimensions: DimensionConfig) => {
  const parsedDimensions = {
    ...dimensions,
    marginLeft: dimensions.marginLeft || 75,
    marginRight: dimensions.marginRight || 10,
    marginTop: dimensions.marginTop || 10,
    marginBottom: dimensions.marginBottom || 50,
  }

  return {
    ...parsedDimensions,
    boundedWidth: Math.max(
      parsedDimensions.width as number - parsedDimensions.marginLeft - parsedDimensions.marginRight,
      0,
    ) || 0,
    boundedHeight: Math.max(
      parsedDimensions.height as number - parsedDimensions.marginTop - parsedDimensions.marginBottom,
      0,
    ) || 0,
  }
}

export const useChartDimensions = (passedSettings: DimensionConfig): [MutableRefObject<null>, Dimesion] => {
  const ref = useRef(null);
  const dimensions = combineChartDimensions(passedSettings);

  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  useEffect((): any => {
    if (dimensions.width && dimensions.height) {
      return () => [ref, dimensions]
    }

    const element = ref.current;

    const resizeObserver = new ResizeObserver(entries => {
        if (!Array.isArray(entries))
          return;

        if (!entries.length)
          return;

        const entry = entries[0];

        if (width != entry.contentRect.width)
          setWidth(entry.contentRect.width);

        if (height != entry.contentRect.height)
          setHeight(entry.contentRect.height);
      }
    )

    resizeObserver.observe(element as any);

    return () => resizeObserver.unobserve(element as any)
  }, []);

  const newSettings = combineChartDimensions({
    ...dimensions,
    width: dimensions.width || width,
    height: dimensions.height || height,
  })

  return [ref, newSettings]
}
