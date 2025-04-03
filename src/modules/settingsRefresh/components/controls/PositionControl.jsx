import positions from '@/data/positions'
import Auto from '@/enums/Auto'
import AnimationSetting from '@/enums/AnimationSetting'
import { Checkbox, Common, Text } from '@/modules/DiscordModules'
import SettingControl from '@/modules/settingsRefresh/components/controls/SettingControl'
import Position from '@/enums/Position'
import PositionAutoType from '@/enums/PositionAutoType'
import { DiscordClasses } from '@/modules/DiscordSelectors'

function PositionPreserveControl ({ value, onChange, label = 'Preserve' }) {
  return (
    <Checkbox
      className={DiscordClasses.Margins.marginTop8}
      value={value}
      onChange={(_, value) => onChange(value)}
      type={Checkbox.Types.INVERTED}
    >
      <Text variant="text-sm/normal">{label}</Text>
    </Checkbox>
  )
}

function PositionControl ({ module, animation, value, onChange, defaultValue, preserve, onPreserveChange, onReset }) {
  const options = positions.filter(
    p => p.value === Auto()
      ? module?.supportsAuto(animation, AnimationSetting.Position)
      : (animation.settings[AnimationSetting.Position] === true || animation.settings[AnimationSetting.Position].includes(p.value))
  )

  const auto = module?.getSupportsAuto(AnimationSetting.Position)
  const additionalControl = value === Auto(Position).Auto
    ? {
        [PositionAutoType.Precise]: auto?.options.preservable && (
          <PositionPreserveControl
            value={preserve}
            onChange={onPreserveChange}
            label={auto?.options.preserveLabel}
          />
        )
      }[auto?.type]
    : null

  return (
    <SettingControl label="Position" onReset={onReset}>
      <Common.SingleSelect
        placeholder={defaultValue}
        options={options}
        value={value}
        onChange={onChange}
      />
      {additionalControl}
    </SettingControl>
  )
}

export default PositionControl
