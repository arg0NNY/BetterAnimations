import { css } from '@/modules/Style'
import AnimationCard from '@/modules/settingsRefresh/components/AnimationCard'
import Config from '@/modules/Config'
import AnimationType from '@/enums/AnimationType'
import useAnimationSettings from '@/modules/settingsRefresh/hooks/useAnimationSettings'
import { useCallback, useMemo } from 'react'

function AnimationList ({ module, pack, animations, selected, onSelect, ...props }) {
  const packConfig = useMemo(() => Config.pack(pack.slug), [pack.slug])
  const isActive = useCallback(
    (animation, type) => selected[type].packSlug === pack.slug && selected[type].animationKey === animation.key,
    [pack.slug, selected]
  )

  const handleSelect = (type, animation) => value => onSelect(type, value && animation && pack, value && animation)
  const handleSelectAll = animation => () => {
    const value = !AnimationType.values().every(type => isActive(animation, type))
    AnimationType.values().forEach(type => handleSelect(type, animation)(value))
  }

  const handleSetSettings = (animation, type) => value => packConfig.setAnimationConfig(animation.key, module.id, type, value)

  const defaultSettings = (animation, type) => module.buildDefaultSettings(animation, type)
  const handleResetSettings = (pack, animation, type) => {
    const setSettings = handleSetSettings(pack, animation, type)
    return () => setSettings(defaultSettings(animation, type))
  }

  function AnimationItem (animation) {
    const animationSettings = useAnimationSettings(module, [
      {
        animation,
        type: AnimationType.Enter,
        settings: module.getAnimationSettings(pack, animation, AnimationType.Enter),
        setSettings: handleSetSettings(animation, AnimationType.Enter),
        enabled: isActive(animation, AnimationType.Enter),
        setEnabled: handleSelect(AnimationType.Enter, animation),
        context: isActive(animation, AnimationType.Enter) ? selected[AnimationType.Enter].context : null,
        defaults: () => defaultSettings(animation, AnimationType.Enter),
        onReset: handleResetSettings(animation, AnimationType.Enter)
      },
      {
        animation,
        type: AnimationType.Exit,
        settings: module.getAnimationSettings(pack, animation, AnimationType.Exit),
        setSettings: handleSetSettings(animation, AnimationType.Exit),
        enabled: isActive(animation, AnimationType.Exit),
        setEnabled: handleSelect(AnimationType.Exit, animation),
        context: isActive(animation, AnimationType.Exit) ? selected[AnimationType.Exit].context : null,
        defaults: () => defaultSettings(animation, AnimationType.Exit),
        onReset: handleResetSettings(animation, AnimationType.Exit)
      }
    ])

    const errors = AnimationType.values()
      .map(type => isActive(animation, type) && selected[type].error)
      .filter(Boolean)

    return (
      <AnimationCard
        {...props}
        key={animation.key}
        name={animation.name}
        enter={isActive(animation, AnimationType.Enter)}
        exit={isActive(animation, AnimationType.Exit)}
        setEnter={handleSelect(AnimationType.Enter, animation)}
        setExit={handleSelect(AnimationType.Exit, animation)}
        onClick={handleSelectAll(animation)}
        animationSettings={animationSettings}
        errors={errors}
      />
    )
  }

  return (
    <div className="BA__animationList">
      {animations.map(AnimationItem)}
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
