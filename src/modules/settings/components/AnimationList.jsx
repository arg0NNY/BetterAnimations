import { css } from '@style'
import AnimationCard from '@/modules/settings/components/AnimationCard'
import Config from '@/modules/Config'
import AnimationType from '@shared/enums/AnimationType'
import useAnimationSettings from '@/modules/settings/hooks/useAnimationSettings'
import { useMemo } from 'react'

function AnimationItem ({ module, pack, animation, selected, onSelect, ...props }) {
  const packConfig = useMemo(() => Config.pack(pack.slug), [pack])
  const isActive = type => selected[type].packSlug === pack.slug && selected[type].animationKey === animation.key

  const handleSelect = type => value => onSelect(type, value && animation && pack, value && animation)
  const handleSelectAll = () => {
    const value = !AnimationType.values().every(type => isActive(type))
    AnimationType.values().forEach(type => handleSelect(type)(value))
  }

  const handleSetSettings = type => value => packConfig.setAnimationConfig(animation.key, module.id, type, value)

  const defaultSettings = type => module.buildDefaultSettings(animation, type)
  const handleResetSettings = type => {
    const setSettings = handleSetSettings(type)
    return () => setSettings(defaultSettings(type))
  }
  
  const animationSettings = useAnimationSettings(
    module,
    AnimationType.values().map(type => ({
      animation,
      type: type,
      settings: module.getAnimationSettings(pack, animation, type),
      setSettings: handleSetSettings(type),
      enabled: isActive(type),
      setEnabled: handleSelect(type),
      context: isActive(type) ? selected[type].context : null,
      defaults: () => defaultSettings(type),
      onReset: handleResetSettings(type)
    }))
  )

  const errors = AnimationType.values()
    .map(type => isActive(type) && selected[type].error)
    .filter(Boolean)

  return (
    <AnimationCard
      {...props}
      key={animation.key}
      name={animation.name}
      enter={isActive(AnimationType.Enter)}
      exit={isActive(AnimationType.Exit)}
      setEnter={handleSelect(AnimationType.Enter)}
      setExit={handleSelect(AnimationType.Exit)}
      onClick={handleSelectAll}
      animationSettings={animationSettings}
      errors={errors}
    />
  )
}

function AnimationList ({ animations, ...props }) {
  return (
    <div className="BA__animationList">
      {animations.map(animation => (
        <AnimationItem
          animation={animation}
          {...props}
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
