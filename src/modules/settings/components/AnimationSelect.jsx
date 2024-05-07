import AddonList from '@/modules/settings/components/AddonList'
import AnimationList from '@/modules/settings/components/AnimationList'

export default function AnimationSelect ({ module, selected, onSelect, setSettings }) {
  const handleSelect = pack => (type, animation) => onSelect(type, animation && pack, animation)

  return (
    <AddonList>
      {pack => <AnimationList
        pack={pack}
        animations={pack.animations}
        selected={selected}
        onSelect={handleSelect(pack)}
        setSettings={setSettings}
      />}
    </AddonList>
  )
}
