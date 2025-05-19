import PackAccordionItem from '@/modules/settings/components/PackAccordionItem'
import PackManager from '@/modules/PackManager'
import { css } from '@style'
import AnimationList from '@/modules/settings/components/AnimationList'
import AnimationType from '@/enums/AnimationType'

function PackAccordion ({ module, packs, selected, ...props }) {
  return (
    <div className="BA__packAccordion">
      {packs.map(pack => {
        const animations = !pack.partial ? pack.animations.filter(a => module.isSupportedBy(a)) : []
        if (!pack.partial && !animations.length) return null

        return (
          <PackAccordionItem
            pack={pack}
            isActive={AnimationType.values().some(t => selected[t].packSlug === pack.slug)}
            isOpen={PackManager.isEnabled(pack.id)}
            onToggle={() => PackManager.togglePack(pack.id)}
          >
            {!pack.partial && (
              <AnimationList
                {...props}
                module={module}
                pack={pack}
                animations={animations}
                selected={selected}
              />
            )}
          </PackAccordionItem>
        )
      })}
    </div>
  )
}

export default PackAccordion

css
`.BA__packAccordion {
    display: flex;
    flex-direction: column;
    gap: 16px;
}`
`PackAccordion`
