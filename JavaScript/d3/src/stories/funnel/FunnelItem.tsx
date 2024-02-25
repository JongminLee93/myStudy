import * as d3 from 'd3';

import { useSpring, animated } from '@react-spring/web'
import { SVGTextElementAttributes } from 'react';

interface PathAnimatedProps {
  d: string;
  leftTop: string;
}

interface Props {
  path: [number, number][];
  fill?: string;
  fillOpacity?: string | number;
  stroke?: string;
}

export const FunnelPath = ({
  path,
  fill,
  fillOpacity,
  stroke,
}: Props) => {
  const [[x0, y0], [x1, y1], [x2, y2], [x3, y3]] = path;

  const pathGenerator = d3.path();

  pathGenerator.moveTo(x0, y0);
  pathGenerator.bezierCurveTo(x0, (y0 + y1) / 2, x1, (y0 + y1) / 2, x1, y1);
  pathGenerator.lineTo(x2, y2);
  pathGenerator.bezierCurveTo(x2, (y2 + y3) / 2, x3, (y2 + y3) / 2, x3, y3);
  pathGenerator.closePath();

  const lineGenerator = d3.line();

  const props = useSpring({
    to: {
      leftTop: lineGenerator([[0, y0], [x0-5, y0]]) ?? '',
      leftBottom: lineGenerator([[0, y1], [x1-5, y1]]) ?? '',
      rightTop: lineGenerator([[x2+5, y2], [x0+x3, y2]]) ?? '',
      rightBottom: lineGenerator([[x3+5, y3], [x0+x3, y3]]) ?? '',
      d: pathGenerator.toString(),
    },
    config: {
      friction: 13,
    },
  });

  return (
    <animated.path
      d={props.d}
      fill={fill}
      fillOpacity={fillOpacity}
      stroke={stroke}
    />
  )
}
