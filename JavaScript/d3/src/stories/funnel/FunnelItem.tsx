import * as d3 from 'd3';

import { useSpring, animated } from '@react-spring/web'

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
  // pathGenerator.moveTo(path[0][0], path[0][1]);
  // pathGenerator.bezierCurveTo(path[0][0], (path[0][1] + path[1][1]) / 2, path[1][0], (path[0][1] + path[1][1]) / 2, path[1][0], path[1][1]);
  // pathGenerator.lineTo(path[2][0], path[2][1]);
  // pathGenerator.bezierCurveTo(path[2][0], (path[2][1] + path[3][1]) / 2, path[3][0], (path[2][1] + path[3][1]) / 2, path[3][0], path[3][1]);
  // pathGenerator.closePath();

  const [x0, y0] = path[0];
  const [x1, y1] = path[1];
  const [x2, y2] = path[2];
  const [x3, y3] = path[3];

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
    <>
      <animated.path
        d={props.leftTop}
        strokeWidth={1}
        stroke='#ddd'
      />
      <animated.path
        d={props.leftBottom}
        strokeWidth={1}
        stroke='#ddd'
      />
      <animated.path
        d={props.rightTop}
        strokeWidth={1}
        stroke='#ddd'
      />
      <animated.path
        d={props.rightBottom}
        strokeWidth={1}
        stroke='#ddd'
      />
      <animated.path
        d={props.d}
        fill={fill}
        fillOpacity={fillOpacity}
        stroke={stroke}
      />
    </>
  )
}

export const FunnelText = ({
  x,
  y,
  value,
  unit,
  ...rest
}: {
  x: string | number;
  y: string | number;
  value: number;
  unit?: string;
  textAnchor?: string;
  alignmentBaseline?: "middle" | "inherit" | "auto" | "central" | "baseline" | "before-edge" | "text-before-edge" | "after-edge" | "text-after-edge" | "ideographic" | "alphabetic" | "hanging" | "mathematical";
  opacity?: string | number;
  fontSize?: string | number;
  fontWeight?: string | number;
  fill?: string;
  stroke?: string;
  strokeWidth?: string | number;
  strokeLinecap?: "inherit" | "round" | "butt" | "square";
  strokeLinejoin?: "round" | "inherit" | "miter" | "bevel";
  paintOrder?: string | number;
  pointerEvents?: string | number;
}) => {
  const springProps = useSpring<{
    x: string | number;
    y: string | number;
    value: number;
  }> ({
    to: {
      x,
      y,
      value
    },
    config: {
      friction: 30,
    },
  });

  return (
    <animated.text
      x={springProps.x}
      y={springProps.y}
      {...rest}
    >
      {springProps.value.to(v => `${toSIUnit(v)} ${unit}`)}
    </animated.text>

  )
}

const toSIUnit = (value: number) => {
  const to = 1;
  if (Math.abs(value) < 1e3) return value.toFixed(to).toString();
  else if (Math.abs(value) >= 1e3 && Math.abs(value) < 1e6) return (value / 1e3).toFixed(to) + 'K';
  else if (Math.abs(value) >= 1e6 && Math.abs(value) < 1e9) return (value / 1e6).toFixed(to) + 'M';
  else if (Math.abs(value) >= 1e9 && Math.abs(value) < 1e12) return (value / 1e9).toFixed(to) + 'G';
  else if (Math.abs(value) >= 1e12 && Math.abs(value) < 1e15) return (value / 1e12).toFixed(to) + 'T';
  else if (Math.abs(value) >= 1e15 && Math.abs(value) < 1e18) return (value / 1e15).toFixed(to) + 'P';
  else return value.toFixed(to).toString(); // 값을 그대로 반환
}

