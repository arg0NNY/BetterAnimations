import { React } from '@/BdApi'
import DurationControl from '@/modules/settingsLegacy/components/controls/DurationControl'
import EasingControl from '@/modules/settingsLegacy/components/controls/EasingControl'
import VariantControl from '@/modules/settingsLegacy/components/controls/VariantControl'
import PositionControl from '@/modules/settingsLegacy/components/controls/PositionControl'
import DirectionControl from '@/modules/settingsLegacy/components/controls/DirectionControl'
import { getAnimationDefaultSettings } from '@/helpers/animations'
import OverflowControl from '@/modules/settingsLegacy/components/controls/OverflowControl'
import ModuleContext from '@/modules/settingsLegacy/context/ModuleContext'

export default function AnimationSettings ({ animation, type, settings, onChange }) {
  const module = React.useContext(ModuleContext)
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
          towards={settings.directionTowards}
          onTowardsChange={towards => setSettings({ directionTowards: towards })}
        />
      )}
      {!module?.meta.settings?.hideOverflow && (
        <OverflowControl
          value={settings.overflow}
          onChange={(_, overflow) => setSettings({ overflow })}
          forced={animation.settings.overflow === false}
        />
      )}
    </div>
  )
}
