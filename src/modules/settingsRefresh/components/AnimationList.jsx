import { React } from '@/BdApi'
import { css } from '@/modules/Style'
import AnimationCard from '@/modules/settingsRefresh/components/AnimationCard'
import Config from '@/modules/Config'
import AnimationType from '@/enums/AnimationType'

function AnimationList ({ module, pack, animations, selected, onSelect, ...props }) {
  const packConfig = React.useMemo(() => Config.pack(pack.slug), [pack.slug])
  const isActive = React.useCallback(
    (animation, type) => selected[type].packSlug === pack.slug && selected[type].animationKey === animation.key,
    [pack.slug, selected]
  )

  const handleSelect = (type, animation) => value => onSelect(type, value && animation && pack, value && animation)
  const handleSelectAll = animation => () => {
    const value = !AnimationType.values().every(type => isActive(animation, type))
    AnimationType.values().forEach(type => handleSelect(type, animation)(value))
  }

  const handleSetSettings = (animation, type) => value => packConfig.setAnimationConfig(animation.key, module.id, type, value)
  const handleResetSettings = (animation, type) => {
    const setSettings = handleSetSettings(animation, type)
    return () => setSettings(module.buildDefaultSettings(animation, type))
  }

  return (
    <div className="BA__animationList">
      {animations.map(animation => (
        <AnimationCard
          {...props}
          key={animation.key}
          module={module}
          animation={animation}
          enter={isActive(animation, AnimationType.Enter)}
          exit={isActive(animation, AnimationType.Exit)}
          setEnter={handleSelect(AnimationType.Enter, animation)}
          setExit={handleSelect(AnimationType.Exit, animation)}
          onClick={handleSelectAll(animation)}
          enterSettings={module.getAnimationSettings(pack, animation, AnimationType.Enter)}
          exitSettings={module.getAnimationSettings(pack, animation, AnimationType.Exit)}
          setEnterSettings={handleSetSettings(animation, AnimationType.Enter)}
          setExitSettings={handleSetSettings(animation, AnimationType.Exit)}
          resetEnterSettings={handleResetSettings(animation, AnimationType.Enter)}
          resetExitSettings={handleResetSettings(animation, AnimationType.Exit)}
        />
      ))}
    </div>
  )
}

export default AnimationList

css
`.BA__animationList {
    display: grid;
    gap: 8px;
    grid-template-columns: repeat(3, 1fr);
}`
`AnimationList`
