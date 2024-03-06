
import { useChartDimensions } from '@/app/chart/util/hook/useChartDimensions';
import React from 'react';

interface Props {
  width?: number;
  height?: number;
  marginLeft?: number;
  marginRight?: number;
  marginTop?: number;
  marginBottom?: number;
  // data?: Record<string, string | number>[];
  children: React.ReactNode;
}

export const ChartContainer = ({
  width,
  height,
  marginLeft,
  marginRight,
  marginTop,
  marginBottom,
  children,
}: Props) => {
  const [ref, dms] = useChartDimensions({
    width,
    height,
    marginLeft,
    marginRight,
    marginTop,
    marginBottom
  });

  return (
    <div
      ref={ref}
      style={{
        width: '100%',
        height: '100%'
      }}
    >
      { children }
    </div>
  )
}
