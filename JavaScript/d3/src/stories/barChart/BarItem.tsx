import { useSpring, animated } from '@react-spring/web'

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
  const hasEnoughWidth = dimension.boundedWidth - barWidth > 100;
  const dataLabelOffset = hasEnoughWidth ? 5 : -5;
  const textAnchor = hasEnoughWidth ? 'start' : 'end';

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
      valueOpacity: barWidth > 80 ? 1 : 0,
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
        fillOpacity={0.3}
        strokeWidth={1}
        rx={1}
      />
      <animated.text
        x={barWidth+100 > dimension.boundedWidth ? springProps.barWidth?.to((width) => x+width - 5) : springProps.barWidth?.to((width) => x+width + 5)}
        y={springProps.y?.to((y) => y + barHeight / 2)}
        textAnchor={barWidth+100 > dimension.boundedWidth ? 'end' : 'start' }
        alignmentBaseline="central"
        fontSize={12}
      >
        {springProps.value?.to((value) => value.toFixed(1) + ' ton')}
      </animated.text>
      <animated.text
        x={x - 7}
        y={springProps.y?.to((y) => y + barHeight / 2)}
        textAnchor="end"
        alignmentBaseline="central"
        fontSize={12}
      >
        {name}
      </animated.text>
    </g>
  )
}