import * as d3 from 'd3';
import { CSSProperties, ReactNode, useRef, useState } from 'react';

interface TooltipProps {
  open?: boolean;
  tooltipContent: ReactNode;
  dimension: any;
  children: ReactNode;
}

export const Tooltip = ({
  open,
  tooltipContent,
  dimension,
  children,
}: TooltipProps) => {
  const tooltipRef = useRef<HTMLDivElement>(null);

  const [position, setPosition] = useState<{ x: number; y: number; }>();

  return (
    <>
      <g
        onMouseMove={(e) => {
          const tooltip = tooltipRef.current;

          if (tooltip) {
            let tooltipWidth = tooltip.getBoundingClientRect().width;
            let tooltipHeight = tooltip.getBoundingClientRect().height;

            let [posX, posY] = d3.pointer(e).map(v => v + 10);

            if (posX + tooltipWidth > dimension.boundedWidth) {
              posX -= (tooltipWidth + 20);
            }

            if (posY > dimension.height / 2) {
              posY -= (tooltipHeight + 20);
            }

            setPosition({x: posX, y: posY});
          }
        }}
      >
        { children }
      </g>
      <foreignObject
        x={position?.x ?? 0}
        y={position?.y ?? 0}
        width={'100%'}
        height={'100%'}
        viewBox={`0 0 ${dimension.width} ${dimension.height}`}
        overflow='visible'
        pointerEvents='none'
        visibility={open ? 'visiblity' : 'hidden'}
      >
        <div
          ref={tooltipRef}
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            position: 'fixed',
            borderStyle: 'solid',
            borderColor: 'black',
            borderWidth: '1px',
            borderRadius: '2px',
            padding: '8px',
            minWidth: 180,
            fontFamily: 'sans-serif',
            overflow: 'visible',
            zIndex: 100,
          }}
        >
          { tooltipContent }
        </div>
      </foreignObject>
    </>
  )
}

interface TooltipContentProps {
  itemStyle?: CSSProperties;
  boxColor?: string;
  boxSize?: string | number;
  textOffset?: string | number;
  fontSize?: string | number;
  itemName: string | number;
  itemValue: number;
  valueFormatter?: (v: number) => string;
}

export const TooltipContent = ({
  itemStyle,
  boxColor='black',
  boxSize=10,
  textOffset=2,
  fontSize=boxSize,
  itemName,
  itemValue,
  valueFormatter = (v) => v.toString(),
}: TooltipContentProps) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1px 0',
        ...itemStyle
      }}
    >
      <div
        style={{
          background: boxColor,
          width: boxSize,
          height: boxSize,
          marginRight: textOffset,
        }}
      />
      <div
        style={{
          flexGrow: 1,
          marginRight: textOffset,
          textAlign: 'center',
          fontSize: fontSize,
        }}
      >
        { itemName }
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'end',
          minWidth: 65,
          fontSize: fontSize,
        }}
      >
        {valueFormatter(itemValue)}
      </div>
    </div>
  )
}