import { SpringConfig, animated, useSpring } from '@react-spring/web';
import { ReactNode, SVGAttributes } from 'react';

interface GProps extends SVGAttributes<SVGGElement> {
  animate?: boolean;
  springConfig?: SpringConfig;
}

export const G = ({
  animate=true,
  springConfig,
  ...rest
}: GProps): ReactNode => {
  const springProps = useSpring<{ transform: string, opacity: string | number }>({
    from: {
      opacity: rest.opacity ? 0 : undefined,
    },
    to: {
      opacity: rest.opacity,
    },
    config: springConfig,
  })

  return (
    <animated.g
      {...rest}
      opacity={animate ? springProps.opacity : rest.opacity}
    >
      { rest.children }
    </animated.g>
  )
}
