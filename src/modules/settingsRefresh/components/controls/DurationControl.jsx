import { FormItem, FormTitle } from '@/modules/DiscordModules'
import { range } from '@/utils/general'
import AnimationSetting from '@/enums/AnimationSetting'
import { MAX_ANIMATION_DURATION } from '@/data/constants'
import Slider from '@/components/Slider'

function DurationControl ({ animation, value, onChange, computedBy, exceeds = 0, label = 'Duration', ...props }) {
  const { to, from } = animation.settings[AnimationSetting.Duration]
  const dense = to - from <= 2000

  const markers = range(0, MAX_ANIMATION_DURATION, dense ? 50 : 100)
    .filter(m => m >= from & m <= to)

  const onMarkerRender = v => v % 500 === 0 || [from, to].includes(v)
    ? (v / 1000).toFixed(1) + 's'
    : (to - from <= 3000 && v % 100 === 0) ? '' : null

  const onValueRender = computedBy === 'easing'
    ? () => `Computed by easing: ${exceeds > 0 ? '>' : exceeds < 0 ? '<' : ''}${(value / 1000).toFixed(2)}s`
    : value => (value / 1000).toFixed(dense ? 2 : 1) + 's'

  return (
    <FormItem>
      <FormTitle tag="h5">{label}</FormTitle>
      <Slider
        {...props}
        minValue={from}
        maxValue={to}
        markers={markers}
        onMarkerRender={onMarkerRender}
        stickToMarkers={!computedBy}
        forceShowBubble={true}
        initialValue={value}
        onValueChange={onChange}
        onValueRender={onValueRender}
        disabled={!!computedBy}
      />
    </FormItem>
  )
}

export default DurationControl
