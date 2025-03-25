import { Common } from '@/modules/DiscordModules'
import { range } from '@/utils/general'
import AnimationSetting from '@/enums/AnimationSetting'

function DurationControl ({ animation, value, onChange, computedBy, label = 'Duration', ...props }) {
  const { to, from } = animation.settings[AnimationSetting.Duration]
  const dense = to - from <= 2000

  return (
    <Common.FormItem>
      <Common.FormTitle tag="h5">{label}</Common.FormTitle>
      <Common.Slider
        {...props}
        minValue={from}
        maxValue={to}
        markers={range(from, to, dense ? 50 : 100)}
        onMarkerRender={v => v % (dense ? 100 : 500) === 0 || [to, from].includes(v) ? (v / 1000).toFixed(1) + 's' : ''}
        initialValue={value}
        onValueChange={onChange}
        stickToMarkers={!computedBy}
        disabled={!!computedBy}
        onValueRender={computedBy === 'easing' ? () => `Computed by easing: ${(value / 1000).toFixed(1)}s` : null}
      />
    </Common.FormItem>
  )
}

export default DurationControl
