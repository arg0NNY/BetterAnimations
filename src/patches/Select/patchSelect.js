import { Patcher } from '@/BdApi'
import { Common, Select, SingleSelect } from '@/modules/DiscordModules'
import Position from '@/enums/Position'
import findInReactTree from '@/utils/findInReactTree'

function patchSearchableSelect () {
  Patcher.after(Common.SearchableSelect, 'render', (self, args, value) => {
    const popout = findInReactTree(value, m => m?.renderPopout)
    if (popout) popout.align = Position.Center
  })
}

function patchSelect () {
  const after = (self, args, value) => {
    value.props.align = Position.Center
  }

  Patcher.after(...Select, after)
  Patcher.after(...SingleSelect, (...[,, value]) => {
    Patcher.after(value, 'type', after)
  })

  patchSearchableSelect()
}

export default patchSelect
