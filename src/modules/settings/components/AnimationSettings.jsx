import { React } from '@/BdApi'
import DurationControl from '@/modules/settings/components/controls/DurationControl'
import EasingControl from '@/modules/settings/components/controls/EasingControl'
import VariantControl from '@/modules/settings/components/controls/VariantControl'
import PositionControl from '@/modules/settings/components/controls/PositionControl'
import DirectionControl from '@/modules/settings/components/controls/DirectionControl'

export default function AnimationSettings ({ animation, settings, onChange }) {
  const setSettings = values => onChange(Object.assign({}, settings, values))

  return (
    <div style={{ display: 'grid', gap: 10, marginTop: 20 }}>
      {animation.settings.duration && (
        <DurationControl
          options={animation.settings.duration}
          value={settings.duration}
          onChange={duration => setSettings({ duration })}
          defaultValue={animation.settings.defaults.duration}
        />
      )}
      {animation.settings.easing && (
        <EasingControl
          value={settings.easing}
          onChange={easing => setSettings({ easing })}
          defaultValue={animation.settings.defaults.easing}
        />
      )}
      {animation.settings.variant && (
        <VariantControl
          options={animation.settings.variant}
          value={settings.variant}
          onChange={variant => setSettings({ variant })}
          defaultValue={animation.settings.defaults.variant}
        />
      )}
      {animation.settings.position && (
        <PositionControl
          animation={animation}
          value={settings.position}
          onChange={position => setSettings({ position })}
          defaultValue={animation.settings.defaults.position}
        />
      )}
      {animation.settings.direction && (
        <DirectionControl
          animation={animation}
          value={settings.direction}
          onChange={direction => setSettings({ direction })}
          defaultValue={animation.settings.defaults.direction}
          axis={settings.directionAxis}
          onAxisChange={axis => setSettings({ directionAxis: axis })}
        />
      )}
    </div>
  )
}
