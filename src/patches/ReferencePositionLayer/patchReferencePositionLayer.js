import Patcher from '@/modules/Patcher'
import { ReferencePositionLayer } from '@discord/modules'
import { css } from '@style'
import DiscordSelectors from '@discord/selectors'

function patchReferencePositionLayer () {
  Patcher.after(ReferencePositionLayer.prototype, 'componentDidMount', (self) => {
    queueMicrotask(
      () => self.props.onPositionChange?.call(self.props, self.calculateState().position)
    )
  })
}

export default patchReferencePositionLayer

css
`/* Force layers to respect their order inside DOM for overlapping */
${DiscordSelectors.Layer.layerContainer} > * {
    isolation: isolate;
}

/* Don't trap clicks while exit animation is playing on the layer */
${DiscordSelectors.Layer.clickTrapContainer}:has([data-baa-type="exit"]) {
    pointer-events: none !important;
}`
`ReferencePositionLayer`
