import * as d3 from 'd3';
import { useSpring, animated } from '@react-spring/web';
import { useEffect, useRef } from 'react';
import { addTooltip } from '../map/component/Tooltip';

type BarItemProps = {
  name: string;
  value: number;
  barHeight: number;
  barWidth: number;
  x: number;
  y: number;
  dimension: any;
}

type AnimatedProps = {
  barWidth: number;
  value: number;
  valueOpacity: number;
  y: number;
}

export const BarItem = ({
  name,
  value,
  barHeight,
  barWidth,
  x,
  y,
  dimension
}: BarItemProps) => {
  const isEnoughEmptySpace = dimension.boundedWidth - barWidth > 100;
  const isEnoughBarWidth = barWidth > 100;
  const dataLabelOffset = isEnoughEmptySpace ? 5 : -5;
  const textAnchor = isEnoughEmptySpace ? 'start' : 'end';

  const springProps = useSpring<AnimatedProps>({
    // the 'from' properties will be used only to animate the initialization of the component
    // if you put nothing it will be initialized with the first prop that is provided
    from: {
      value: 0,
      barWidth: 0,
      valueOpacity: 0,
    },
    to: {
      value: value,
      barWidth: barWidth,
      valueOpacity: isEnoughBarWidth ? 1 : isEnoughEmptySpace ? 1 : 0,
      y: y,
    },
    config: {
      duration: 1200,
    },
  });

  return (
    <g>
      <animated.rect
        x={x}
        y={springProps.y}
        width={springProps.barWidth}
        height={barHeight}
        opacity={0.7}
        stroke="#9d174d"
        fill="#9d174d"
        fillOpacity={0.7}
        strokeWidth={1}
        rx={1}
        onMouseMove={(e) => {
          const tooltip = d3.select('#tooltip');

          // tooltip.style('opacity', 1);
        }}
        onMouseOut={(e) => {
          const tooltip = d3.select('#tooltip');

          // tooltip.style('opacity', 0);
        }}
      />
      <animated.text
        x={springProps.barWidth?.to((width) => x+width + dataLabelOffset)}
        y={springProps.y?.to((y) => y + barHeight / 2)}
        textAnchor={textAnchor}
        alignmentBaseline="central"
        opacity={springProps.valueOpacity}
        fontSize={12}
        fontWeight='bold'
      >
        {springProps.value?.to((value) => value.toFixed(1) + ' ton')}
      </animated.text>
    </g>
  )
}