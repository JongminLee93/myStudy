interface Props {
  dimension: any;
  title?: string;
}

export const Title = ({
  dimension,
  title: titleText = 'chart'
}: Props) => {
  return (
    <g>
      <foreignObject
        width={dimension.width}
        height={dimension.marginTop}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: 12,
            fontWeight: 'bold',
          }}
        >
          { titleText }
        </div>
      </foreignObject>
    </g>
  )
}
