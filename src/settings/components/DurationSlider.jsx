import { range } from '@utils/general'
import Slider from '@/components/Slider'

function DurationSlider ({
  from,
  to,
  dense = to - from <= 2000,
  step = dense ? 50 : 100,
  ...props
}) {
  const markers = range(from - (from % step), to, step)

  const onMarkerRender = v => v % 500 === 0 || [from, to].includes(v)
    ? (v / 1000).toFixed(1) + 's'
    : (to - from <= 3000 && v % 100 === 0) ? '' : null

  const onValueRender = value => (value / 1000).toFixed(dense ? 2 : 1) + 's'

  return (
    <Slider
      minValue={from}
      maxValue={to}
      markers={markers}
      onMarkerRender={onMarkerRender}
      stickToMarkers={true}
      forceShowBubble={true}
      onValueRender={onValueRender}
      {...props}
    />
  )
}

export default DurationSlider
