import { React } from '@/BdApi'
import DurationControl from '@/modules/settings/components/controls/DurationControl'
import EasingControl from '@/modules/settings/components/controls/EasingControl'
import VariantControl from '@/modules/settings/components/controls/VariantControl'
import PositionControl from '@/modules/settings/components/controls/PositionControl'
import DirectionControl from '@/modules/settings/components/controls/DirectionControl'
import { getAnimationDefaultSettings } from '@/helpers/animations'
import OverflowControl from '@/modules/settings/components/controls/OverflowControl'

export default function AnimationSettings ({ animation, type, settings, onChange }) {
  const defaults = getAnimationDefaultSettings(animation, type)
  const setSettings = values => onChange(Object.assign({}, settings, values))

  return (
    <div style={{ display: 'grid', gap: 10, marginTop: 20 }}>
      {animation.settings.duration && (
        <DurationControl
          options={animation.settings.duration}
          value={settings.duration}
          onChange={duration => setSettings({ duration })}
          defaultValue={defaults.duration}
        />
      )}
      {animation.settings.easing && (
        <EasingControl
          value={settings.easing}
          onChange={easing => setSettings({ easing })}
          defaultValue={defaults.easing}
        />
      )}
      {animation.settings.variant && (
        <VariantControl
          options={animation.settings.variant}
          value={settings.variant}
          onChange={variant => setSettings({ variant })}
          defaultValue={defaults.variant}
        />
      )}
      {animation.settings.position && (
        <PositionControl
          animation={animation}
          value={settings.position}
          onChange={position => setSettings({ position })}
          defaultValue={defaults.position}
        />
      )}
      {animation.settings.direction && (
        <DirectionControl
          animation={animation}
          value={settings.direction}
          onChange={direction => setSettings({ direction })}
          defaultValue={defaults.direction}
          axis={settings.directionAxis}
          onAxisChange={axis => setSettings({ directionAxis: axis })}
        />
      )}
      <OverflowControl
        value={settings.overflow}
        onChange={(_, overflow) => setSettings({ overflow })}
        forced={animation.settings.overflow === false}
      />
    </div>
  )
}
