import { Patcher } from '@/BdApi'
import { ReferencePositionLayer } from '@/modules/DiscordModules'

function patchReferencePositionLayer () {
  Patcher.after(ReferencePositionLayer.prototype, 'componentDidMount', (self) => {
    queueMicrotask(
      () => self.props.onPositionChange?.call(self.props, self.calculateState().position)
    )
  })
}

export default patchReferencePositionLayer
