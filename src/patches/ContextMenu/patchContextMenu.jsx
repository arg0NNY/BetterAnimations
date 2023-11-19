import { Patcher } from '@/BdApi'
import { ContextMenu, TransitionGroup } from '@/modules/DiscordModules'
import CloneTransition from '@/components/CloneTransition'
import { parseAnimationData } from '@/modules/Animation/parser'
import animation from '../../../examples/reveal.animation.json'
import { z } from 'zod'
import { fromZodError } from 'zod-validation-error'
import { clearContainingStyles } from '@/helpers/style'
import patchContextSubmenu from '@/patches/ContextMenu/patchContextSubmenu'
import ensureOnce from '@/helpers/ensureOnce'

export let tempAnimationData
try {
  tempAnimationData = parseAnimationData(animation)
}
catch (e) {
  e = e instanceof z.ZodError ? fromZodError(e).message : e
  console.error('Failed to load animation:', e)
}

const once = ensureOnce()

function patchContextMenu () {
  Patcher.after(ContextMenu, 'default', (self, args, value) => {

    once(() =>
      Patcher.after(value.type.prototype, 'render', (self, args, value) => {
        return (
          <CloneTransition
            in={!!value}
            clone={false}
            exit={false}
            animation={tempAnimationData}
            onEntered={clearContainingStyles}
          >
            {value}
          </CloneTransition>
        )
      })
    )

    return (
      <TransitionGroup component={null}>
        {
          value.props.isOpen &&
          <CloneTransition
            key={value.key}
            clone={false}
            enter={false}
            animation={tempAnimationData}
          >
            {value}
          </CloneTransition>
        }
      </TransitionGroup>
    )
  })

  patchContextSubmenu()
}

export default patchContextMenu
