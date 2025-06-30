import { range } from '@utils/general'
import AnimationSetting from '@enums/AnimationSetting'
import { MAX_ANIMATION_DURATION } from '@data/constants'
import Slider from '@/components/Slider'
import SettingControl from '@/settings/components/controls/SettingControl'
import Documentation from '@shared/documentation'

function DurationControl ({ animation, value, onChange, label = 'Duration', onReset, ...props }) {
  const { to, from } = animation.settings[AnimationSetting.Duration]
  const dense = to - from <= 2000

  const markers = range(0, MAX_ANIMATION_DURATION, dense ? 50 : 100)
    .filter(m => m >= from & m <= to)

  const onMarkerRender = v => v % 500 === 0 || [from, to].includes(v)
    ? (v / 1000).toFixed(1) + 's'
    : (to - from <= 3000 && v % 100 === 0) ? '' : null

  const onValueRender = value => (value / 1000).toFixed(dense ? 2 : 1) + 's'

  return (
    <SettingControl label={label} doc={Documentation.Setting.Duration} onReset={onReset}>
      <Slider
        {...props}
        minValue={from}
        maxValue={to}
        markers={markers}
        onMarkerRender={onMarkerRender}
        stickToMarkers={true}
        forceShowBubble={true}
        initialValue={value}
        onValueChange={onChange}
        onValueRender={onValueRender}
      />
    </SettingControl>
  )
}

export default DurationControl
