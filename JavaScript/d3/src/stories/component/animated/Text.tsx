import { SpringConfig, animated, useSpring } from '@react-spring/web';
import { ReactNode, SVGAttributes } from 'react';

interface TextProps extends SVGAttributes<SVGTextElement> {
  animate?: boolean;
  springConfig?: SpringConfig;
  value: string | number;
  formatter?: (v: string | number) => string;
}

export const Text = ({
  animate=true,
  springConfig,
  value,
  formatter = (v) => v.toString(),
  ...rest
}: TextProps): ReactNode => {
  const springProps = useSpring({
    to: {
      x: rest.x,
      y: rest.y,
      opacity: rest.opacity,
      value,
    },
    config: springConfig
  })

  return (
    <animated.text
      {...rest}
      x={animate ? springProps.x : rest.x}
      y={animate ? springProps.y : rest.y}
      opacity={animate ? springProps.opacity : rest.opacity}
    >
      {springProps.value.to(formatter)}
    </animated.text>
  )
}
