import Map from '@/app/map/map'

//@ts-ignore
import rewind from '@turf/rewind';

const data = rewind(require('/public/data/newMap/SouthEastern.json'), { reverse: true });

const Page = () => {
  return (
    <div>
      <Map data={data} />
    </div>
  )
}

export default Page