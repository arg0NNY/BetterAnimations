import { React } from '@/BdApi'
import { Common } from '@/modules/DiscordModules'
import AnimationItem from '@/modules/settings/components/AnimationItem'
import AnimationType from '@/enums/AnimationType'

function ModifiersSettings ({ modifiers, onUpdate }) {
  const { animation, enter, exit } = modifiers

  const handleSelect = type => enabled => onUpdate(type, { enabled })
  const handleSetSettings = type => settings => onUpdate(type, { settings })

  return (
    <AnimationItem
      animation={animation}
      enterActive={enter.enabled}
      exitActive={exit.enabled}
      setEnter={handleSelect(AnimationType.Enter)}
      setExit={handleSelect(AnimationType.Exit)}
      enterSettings={enter.settings}
      exitSettings={exit.settings}
      setEnterSettings={handleSetSettings(AnimationType.Enter)}
      setExitSettings={handleSetSettings(AnimationType.Exit)}
    />
  )
}

function ModuleGeneralSettings ({ module, onChange }) {
  const modifiers = module.getModifiers()
  const onModifiersUpdate = (...args) => {
    module.updateModifier(...args)
    onChange()
  }

  const items = [
    modifiers && (
      <ModifiersSettings
        modifiers={modifiers}
        onUpdate={onModifiersUpdate}
      />
    )
  ].filter(Boolean)

  return items.length ? (
    <div style={{ display: 'grid', gap: 10, marginTop: 20 }}>
      <Common.FormTitle tag="h4">General settings</Common.FormTitle>
      {items}
    </div>
  ) : null
}

export default ModuleGeneralSettings
