import { ReactNode } from 'react';

interface Props {
  x: number;
  y: number;
  barWidth?: string | number;
  barHeight?: string | number;
  fill?: string;
  fillOpacity?: number;
  stroke?: string;
}

export const BarStack = ({
  x,
  y,
  barWidth,
  barHeight,
  fill,
  fillOpacity,
  stroke,
}: Props) => {

  return (
    <g pointerEvents='none'>
      <rect
        x={x}
        y={y}
        width={barWidth}
        height={barHeight}
        fill={fill}
        fillOpacity={fillOpacity}
        stroke={stroke}
        strokeWidth={1}
        pointerEvents='none'
      />
    </g>
  )
}

interface TextProps {
  x?: string | number;
  y?: string | number;
  textAnchor?: string;
  fontSize?: string | number;
  opacity?: string | number;
  children: ReactNode;
}

export const BarStackText = ({
  x,
  y,
  textAnchor,
  fontSize,
  opacity,
  children,
}: TextProps) => {

  return (
    <g pointerEvents='none'>
      <text
        x={x}
        y={y}
        alignmentBaseline='middle'
        textAnchor={textAnchor}
        fontSize={fontSize ?? 10}
        opacity={opacity}
      >
        { children }
      </text>
    </g>
  )
}
