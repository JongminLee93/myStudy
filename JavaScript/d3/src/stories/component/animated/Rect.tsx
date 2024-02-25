import { SpringConfig, animated, useSpring } from '@react-spring/web';
import { ReactNode, SVGAttributes } from 'react';

interface RectProps extends SVGAttributes<SVGRectElement> {
  animate?: boolean;
  springConfig?: SpringConfig;
}

export const Rect = ({
  animate=true,
  springConfig,
  ...rest
}: RectProps): ReactNode => {
  const springProps = useSpring({
    to: {
      x: rest.x,
      y: rest.y,
      width: rest.width,
      height: rest.height,
      opacity: rest.opacity,
    },
    spring: springConfig,
  })

  return (
    <animated.rect
      {...rest}
      x={animate ? springProps.x : rest.x}
      y={animate ? springProps.y : rest.y}
      width={animate ? springProps.width : rest.width}
      height={animate ? springProps.height : rest.height}
      opacity={animate ? springProps.opacity : rest.opacity}
    />
  )
}
