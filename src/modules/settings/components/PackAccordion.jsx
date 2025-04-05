import PackAccordionItem from '@/modules/settings/components/PackAccordionItem'
import PackManager from '@/modules/PackManager'
import { css } from '@/modules/Style'
import AnimationList from '@/modules/settings/components/AnimationList'

function PackAccordion ({ module, packs, ...props }) {
  return (
    <div className="BA__packAccordion">
      {packs.map(pack => {
        const animations = !pack.partial ? pack.animations.filter(a => module.isSupportedBy(a)) : []
        if (!pack.partial && !animations.length) return null

        return (
          <PackAccordionItem
            pack={pack}
            isOpen={PackManager.isEnabled(pack.id)}
            onToggle={() => PackManager.togglePack(pack.id)}
          >
            {!pack.partial && (
              <AnimationList
                {...props}
                module={module}
                pack={pack}
                animations={animations}
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
