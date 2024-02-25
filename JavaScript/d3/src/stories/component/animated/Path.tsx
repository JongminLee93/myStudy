import { SpringConfig, animated, useSpring } from '@react-spring/web';
import { ReactNode, SVGAttributes } from 'react';

interface PathProps extends SVGAttributes<SVGPathElement> {
  animate?: boolean;
  springConfig?: SpringConfig;
}

export const Path = ({
  animate=true,
  springConfig,
  ...rest
}: PathProps): ReactNode => {
  const springProps = useSpring({
    to: {
      d: rest.d,
    },
    springConfig
  })

  return (
    <animated.path
      {...rest}
      d={animate ? springProps.d : rest.d}
    />
  )
}
