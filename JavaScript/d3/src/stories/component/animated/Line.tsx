import { SpringConfig, animated, useSpring } from '@react-spring/web';
import { ReactNode, SVGAttributes } from 'react';

interface LineProps extends SVGAttributes<SVGLineElement> {
  animate?: boolean;
  springConfig?: SpringConfig;
}

export const Line = ({
  animate=true,
  springConfig,
  ...rest
}: LineProps): ReactNode => {
  const springProps = useSpring({
    to: {
      x1: rest.x1,
      y1: rest.y1,
      x2: rest.x2,
      y2: rest.y2,
      opacity: rest.opacity
    },
    config: springConfig,
  })

  return (
    <animated.line
      {...rest}
      x1={animate ? springProps.x1 : rest.x1}
      y1={animate ? springProps.y1 : rest.y1}
      x2={animate ? springProps.x2 : rest.x2}
      y2={animate ? springProps.y2 : rest.y2}
      opacity={animate ? springProps.opacity : rest.opacity}
    />
  )
}
