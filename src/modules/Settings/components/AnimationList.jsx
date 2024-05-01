import { Common } from '@/modules/DiscordModules'
import AnimationItem from '@/modules/Settings/components/AnimationItem'

export default function AnimationList ({ pack, animations, selected, onSelect, setSettings }) {
  const isActive = (animation, type) => selected[type].packSlug === pack.slug && selected[type].animationKey === animation.key

  const handleSelect = (type, animation) => value => onSelect(type, value && animation)
  const handleSetSettings = type => value => setSettings(type, value)

  return (
    <div>
      <Common.FormTitle tag="h3">{pack.name}</Common.FormTitle>
      <div style={{ display: 'grid', gap: 20 }}>
        {animations.map(animation => (
          <AnimationItem
            animation={animation}
            enterActive={isActive(animation, 'enter')}
            exitActive={isActive(animation, 'exit')}
            setEnter={handleSelect('enter', animation)}
            setExit={handleSelect('exit', animation)}
            enterSettings={selected.enter.settings}
            exitSettings={selected.exit.settings}
            setEnterSettings={handleSetSettings('enter')}
            setExitSettings={handleSetSettings('exit')}
          />
        ))}
      </div>
    </div>
  )
}
