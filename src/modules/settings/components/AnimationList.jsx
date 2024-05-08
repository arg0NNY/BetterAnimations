import { Common } from '@/modules/DiscordModules'
import AnimationItem from '@/modules/settings/components/AnimationItem'
import Config from '@/modules/Config'
import AnimationType from '@/enums/AnimationType'

export default function AnimationList ({ module, pack, animations, selected, onSelect, onChange }) {
  const packConfig = Config.pack(pack.slug)
  const isActive = (animation, type) => selected[type].packSlug === pack.slug && selected[type].animationKey === animation.key

  const handleSelect = (type, animation) => value => onSelect(type, value && animation)
  const handleSetSettings = (animation, type) => value => {
    packConfig.setAnimationConfig(animation.key, module.id, type, value)
    onChange()
  }

  return (
    <div>
      <Common.FormTitle tag="h3">{pack.name}</Common.FormTitle>
      <div style={{ display: 'grid', gap: 20 }}>
        {animations.map(animation => (
          <AnimationItem
            animation={animation}
            enterActive={isActive(animation, AnimationType.Enter)}
            exitActive={isActive(animation, AnimationType.Exit)}
            setEnter={handleSelect(AnimationType.Enter, animation)}
            setExit={handleSelect(AnimationType.Exit, animation)}
            enterSettings={selected.enter.settings}
            exitSettings={selected.exit.settings}
            setEnterSettings={handleSetSettings(animation, AnimationType.Enter)}
            setExitSettings={handleSetSettings(animation, AnimationType.Exit)}
          />
        ))}
      </div>
    </div>
  )
}
