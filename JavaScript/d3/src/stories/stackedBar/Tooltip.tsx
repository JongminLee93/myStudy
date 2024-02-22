import { ReactNode, useRef, useState } from 'react';

interface Data {
  source: string;
  value: number;
}

interface TooltipProps {
  open: boolean;
  data?: Data[];
  colorScale: d3.ScaleOrdinal<string, unknown, string>;
  dimension: any;
  children: ReactNode;
}

export const Tooltip = ({
  open,
  data,
  colorScale,
  dimension,
  children,
}: TooltipProps) => {
  const tooltipRef = useRef<HTMLDivElement>(null);

  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number; }>();

  const tooltip = colorScale.domain().map((source, i) => {
    const value = data?.find(d => d.source === source)?.value ?? '-';
    const color = `${colorScale(source)}`;
    const size = 10;
    const textOffset = 2;

    return (
      <div
        key={`tooltip-${source}`}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: i === 0 ? '' : '1px solid rgba(0, 0, 0, 0.08)',
          padding: '1px 0'
        }}
      >
        <div
          style={{
            background: color,
            width: size,
            height: size,
            marginRight: textOffset,
          }}
        />
        <div
          style={{
            flexGrow: 1,
            marginRight: textOffset,
            textAlign: 'center',
            fontSize: size,
          }}
        >
          {`${source}`}
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'end',
            minWidth: 65,
            fontSize: size,
          }}
        >
          {`${value} ton`}
        </div>
      </div>
    )
  })

  return (
    <>
      <g
        onMouseMove={(e) => {
          const tooltip = tooltipRef.current;

          if (tooltip) {
            let tooltipWidth = tooltip.getBoundingClientRect().width;
            let tooltipHeight = tooltip.getBoundingClientRect().height;

            const targetBox = e.currentTarget.getBoundingClientRect();

            let posX = e.clientX - (targetBox.x) + 10;
            let posY = e.clientY - (targetBox.y) + 10;

            if (posX > dimension.boundedWidth / 2) {
              posX -= (tooltipWidth + 20);
            }

            if (posY > dimension.boundedHeight / 2) {
              posY -= (tooltipHeight + 20);
            }

            setTooltipPosition({x: posX, y: posY});
          }
        }}
      >
        { children }
      </g>
      <foreignObject
        x={0}
        y={0}
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
            left: tooltipPosition?.x ?? 0,
            top: tooltipPosition?.y ?? 0,
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
          { tooltip }
        </div>
      </foreignObject>
    </>
  )
}