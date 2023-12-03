import { Patcher } from '@/BdApi'
import { ContextMenu, TransitionGroup } from '@/modules/DiscordModules'
import AnimeTransition from '@/components/AnimeTransition'
import { parseAnimationData } from '@/modules/Animation/parser'
import animation from '../../../examples/reveal.animation.json'
import { z } from 'zod'
import { fromZodError } from 'zod-validation-error'
import { clearContainingStyles, directChild } from '@/helpers/transition'
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

function patchContextMenu () {
  const once = ensureOnce()

  Patcher.after(ContextMenu, 'default', (self, args, value) => {

    const context = {
      position: 'bottom',
      align: 'left',
      duration: 200
    }

    once(() =>
      Patcher.after(value.type.prototype, 'render', (self, args, value) => {
        return (
          <AnimeTransition
            in={!!value}
            targetNode={directChild}
            exit={false}
            animation={tempAnimationData}
            context={context}
            onEntered={clearContainingStyles}
          >
            {value}
          </AnimeTransition>
        )
      })
    )

    return (
      <TransitionGroup component={null}>
        {
          value.props.isOpen &&
          <AnimeTransition
            key={value.key}
            targetNode={directChild}
            enter={false}
            animation={tempAnimationData}
            context={context}
          >
            {value}
          </AnimeTransition>
        }
      </TransitionGroup>
    )
  })

  patchContextSubmenu()
}

export default patchContextMenu
