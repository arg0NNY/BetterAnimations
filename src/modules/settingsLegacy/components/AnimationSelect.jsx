import AddonList from '@/modules/settingsLegacy/components/AddonList'
import AnimationList from '@/modules/settingsLegacy/components/AnimationList'

export default function AnimationSelect ({ module, selected, onSelect, onChange }) {
  const handleSelect = pack => (type, animation) => onSelect(type, animation && pack, animation)

  return (
    <AddonList>
      {pack => {
        const animations = pack.animations.filter(a => module.isSupportedBy(a))
        return !!animations.length && (
          <AnimationList
            module={module}
            pack={pack}
            animations={animations}
            selected={selected}
            onSelect={handleSelect(pack)}
            onChange={onChange}
          />
        )
      }}
    </AddonList>
  )
}
