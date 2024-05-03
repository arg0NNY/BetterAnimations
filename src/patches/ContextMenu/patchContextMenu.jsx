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
import Position from '@/enums/Position'
import useModule, { injectModule } from '@/hooks/useModule'
import ModuleKey from '@/enums/ModuleKey'
import Modules from '@/modules/Modules'

export let tempAnimationData
try {
  tempAnimationData = parseAnimationData(animation)
}
catch (e) {
  e = e instanceof z.ZodError ? fromZodError(e).message : e
  console.error('Failed to load animation:', e)
}

export const animationOptions = {
  auto: {
    position: Position.Bottom,
    align: Position.Left
  }
}

function patchContextMenu () {
  const once = ensureOnce()

  Patcher.after(ContextMenu, 'default', (self, args, value) => {
    once(() => {
      injectModule(value.type, ModuleKey.ContextMenu)
      Patcher.after(value.type.prototype, 'render', (self, args, value) => {
        const module = Modules.getModule(ModuleKey.ContextMenu)
        if (!module.isEnabled()) return

        return (
          <AnimeTransition
            in={!!value}
            targetNode={directChild}
            exit={false}
            animations={module.getAnimations(animationOptions)}
            onEntered={clearContainingStyles}
          >
            {value}
          </AnimeTransition>
        )
      })
    })

    const module = useModule(ModuleKey.ContextMenu)
    if (!module.isEnabled()) return
    return (
      <TransitionGroup component={null}>
        {
          value.props.isOpen &&
          <AnimeTransition
            key={value.key}
            targetNode={directChild}
            enter={false}
            animations={module.getAnimations(animationOptions)}
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
