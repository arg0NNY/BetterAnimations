import { Patcher } from '@/BdApi'
import { Common } from '@/modules/DiscordModules'

function patchReferencePositionLayer () {
  Patcher.after(Common.ReferencePositionLayer.prototype, 'componentDidMount', (self) => {
    queueMicrotask(
      () => self.props.onPositionChange?.call(self.props, self.calculateState().position)
    )
  })
}

export default patchReferencePositionLayer
