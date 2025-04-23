import { Patcher } from '@/BdApi'
import { SearchableSelect, SelectKeyed, SingleSelectKeyed } from '@/modules/DiscordModules'
import Position from '@/enums/Position'
import findInReactTree from '@/utils/findInReactTree'
import { useLayoutEffect, useState } from 'react'
import { css } from '@/modules/Style'
import { DiscordSelectors } from '@/modules/DiscordSelectors'

function createPatcher () {
  let patchedPopout = null

  return (self, args, value) => {
    const popout = findInReactTree(value, m => m?.renderPopout)
    if (!popout) return

    popout.align = Position.Center

    Patcher.after(popout, 'renderPopout', (self, args, value) => {
      // Patching like this to avoid infinite updates
      if (!patchedPopout) {
        const { type: original } = value
        patchedPopout = props => {
          const value = original(props)

          // Fix Discord bug where they messed up and used `useEffect` instead of `useLayoutEffect`
          // to update popout position after measuring the height
          const [v, setV] = useState(0)
          useLayoutEffect(() => setV(1), [])
          useLayoutEffect(() => {
            if (v === 1) props.updatePosition()
          }, [v])

          return value
        }
      }
      value.type = patchedPopout
    })
  }
}

function patchSelect () {
  const patcher = createPatcher()

  Patcher.after(...SelectKeyed, patcher)
  Patcher.after(...SingleSelectKeyed, (...[,, value]) => {
    Patcher.after(value, 'type', patcher)
  })

  Patcher.after(SearchableSelect, 'render', createPatcher())
}

export default patchSelect

css
`/* Fixes a bug where the measurement element may interfere with the select inner element positioning */
${DiscordSelectors.Select.measurement} {
    top: 0;
    left: 0;
}`
`Select`
